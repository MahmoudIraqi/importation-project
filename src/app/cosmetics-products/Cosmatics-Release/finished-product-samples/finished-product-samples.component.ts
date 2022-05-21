import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewChildren
} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {DecimalPipe} from '@angular/common';
import {catchError, debounceTime, distinctUntilChanged, filter, map, startWith} from 'rxjs/operators';
import {Observable, Subscription} from 'rxjs';
import {MatAutocompleteTrigger} from '@angular/material/autocomplete';
import {TabsetComponent} from 'ngx-bootstrap/tabs';
import {BsModalRef, BsModalService, ModalOptions} from 'ngx-bootstrap/modal';
import {TranslateService} from "@ngx-translate/core";
import {MatDialog} from '@angular/material/dialog';
import {MatCheckboxChange} from '@angular/material/checkbox';
import {cosmaticsReleaseModel, invoices, releaseItemDtos} from 'src/app/custom-release/customRelease.model';
import {InputService} from 'src/app/services/input.service';
import {FormService} from 'src/app/services/form.service';
import {
  ViewReleaseCommentsComponent,
  ViewReleaseCommentsComponentDataDialog
} from 'src/app/comments/view-release-comments/view-release-comments.component';
import {AttachemntObject, LookupState} from 'src/utils/common-models';


@Component({
  selector: 'app-finished-product-samples',
  templateUrl: './finished-product-samples.component.html',
  styleUrls: ['./finished-product-samples.component.scss']
})
export class FinishedProductSamplesComponent implements OnInit, OnDestroy {

  isLoading: boolean = false;
  cosmaticsReleaseModel = {} as cosmaticsReleaseModel
  invoiceModelList = [{}] as invoices[]
  releaseItemsList = [{}] as releaseItemDtos[]
  invoiceModel = {} as invoices
  releaseItemDto = {} as releaseItemDtos
  alertNotificationStatus: boolean = false;
  alertNotification: any;
  alertErrorNotificationStatus: boolean = false;
  alertErrorNotification: any;
  @ViewChildren(MatAutocompleteTrigger) triggerCollection: QueryList<MatAutocompleteTrigger>;
  modalRef: BsModalRef;
  modalOptions: ModalOptions = {
    backdrop: 'static',
    keyboard: false,
    class: 'modal-xl packagingModal',
  };
  @ViewChild('successSubmissionModal') modalSuccessionTemplate: TemplateRef<any>;
  dataInAnyError: any;
  @ViewChild('formTabs', {static: false}) formTabs: TabsetComponent;
  @ViewChild('invoicesTabs', {static: false}) invoicesTabs: TabsetComponent;
  @ViewChild('itemsStepsTabs', {static: false}) itemsStepsTabs: TabsetComponent;
  @ViewChild('packagingModal') modalTemplate: TemplateRef<any>;
  @ViewChild('detailedModal') modalDetailedTemplate: TemplateRef<any>;
  activeTabIndex;
  regCustomReleaseForm: FormGroup;
  regInvoicesForm: FormGroup;
  regItemsForm: FormGroup;
  filteredOptionsForRawMaterialType: Observable<any[]>;
  filteredOptionsForRequestedReleaseType: Observable<LookupState[]>;
  filteredOptionsForCustomPortName: Observable<LookupState[]>;
  filteredOptionsForSupplierCountry: Observable<LookupState[]>;
  filteredOptionsForMeasureUnitList: Observable<LookupState[]>;
  filteredOptionsForCurrency: Observable<LookupState[]>;
  filteredOptionsForManufacturingCompany: [any];
  filteredOptionsForManufacturingCountry: Observable<LookupState[]>;
  filteredOptionsForPackingManufacturingCompany: Observable<LookupState[]>;
  filteredOptionsForPackingManufacturingCountry: Observable<LookupState[]>;
  filteredOptionsForUOM: Observable<LookupState[]>;
  filteredOptionsForIngredientList: Observable<LookupState[]>;
  filteredOptionsForFunctionList: Observable<LookupState[]>;
  filteredOptionsForIngradiant: Observable<LookupState[]>;
  filteredOptionsForFunction: Observable<LookupState[]>;
  formData = null;
  attachmentFields: AttachemntObject[] = [
    {
      dbTableId: 1,
      id: 'bolPolicy',
      name: 'BOL',
      fileName: '',
      fileValue: '',
      required: false,
      enable: true,
      attachmentTypeStatus: '',
      loadingStatus: false,
    },
    {
      dbTableId: 10003,
      id: 'customReleaseRequest',
      name: 'Custom Release Request',
      fileName: '',
      fileValue: '',
      required: false,
      enable: true,
      attachmentTypeStatus: '',
      loadingStatus: false,
    },
    {
      dbTableId: 3,
      id: 'receipt',
      name: 'Receipt',
      fileName: '',
      fileValue: '',
      required: false,
      enable: true,
      attachmentTypeStatus: '',
      loadingStatus: false,
    },
    // { dbTableId:4,id: 'exportPledge', name: 'Export Pledge',fileName: '',fileValue: '',required: false,enable: true,attachmentTypeStatus: '',loadingStatus: false, },
    {
      dbTableId: 5,
      id: 'importersRecord',
      name: 'Importers Record',
      fileName: '',
      fileValue: '',
      required: false,
      enable: true,
      attachmentTypeStatus: '',
      loadingStatus: false,
    },
    {
      dbTableId: 10002,
      id: 'other',
      name: 'Other',
      fileName: '',
      fileValue: '',
      required: false,
      enable: true,
      attachmentTypeStatus: '',
      loadingStatus: false,
    },
  ];
  InvoiceAttachmentFields: AttachemntObject[] = [
    {
      dbTableId: 6,
      id: 'invoice',
      name: 'Invoice',
      fileName: '',
      fileValue: '',
      required: false,
      enable: true,
      attachmentTypeStatus: '',
      loadingStatus: false
    },
    {
      dbTableId: 2,
      id: 'packingList',
      name: 'Packing List',
      fileName: '',
      fileValue: '',
      required: false,
      enable: true,
      attachmentTypeStatus: '',
      loadingStatus: false,
    },

  ];

  ItemAttachmentFields: AttachemntObject[] = [];
  fileStructure;
  attachmentRequiredStatus: boolean = false;
  invoiceListTable = {
    tableHeader: ['invoiceNo', 'invoiceDate', 'invoiceValue', 'Currency', 'Actions'],
    tableBody: []
  };
  itemListTable = {
    tableHeader: ['itemName', 'approvalNo', 'itemType', 'importReason', 'manufacturingCompany', 'quantity', 'batchNo', 'Actions'],
    tableBody: []
  };

  detailsListTable = {
    tableHeader: ['select', 'colour', 'fragrance', 'flavor', 'barCode'],
    tableBody: []
  };
  manufacturingListTable = {
    tableHeader: ['select', 'manufactureCompany', 'manufactureCountry'],
    tableBody: []
  };
  packagingListTable = {
    tableHeader: ['choose', 'volumes', 'unitOfMeasure', 'typeOfPackaging'],
    tableBody: []
  };
  invoiceContainerDisplayStatus: boolean = false;
  itemContainerDisplayStatus: boolean = false;
  itemType;
  importReason;
  premixField;
  rowMaterialNameField = new FormControl();
  sourceOfRowMaterialField;
  ProductTypeField: string = '';
  showNotificationNoStatus: boolean = false;
  notificationNo;
  editItemIndex;
  editItemRowStatus = false;
  customImportRelease: any = [];
  serviceId;
  parentRequestId: number;
  serviceAction: string;
  serviceTypeId;
  serviceTypeName;
  ServiceActionId;
  customReleaseEdited: boolean = false;
  customReleaseReplaced: boolean = false;

  OutofSpectializationServiceAttachmentFields: AttachemntObject[] = [
    {
      dbTableId: 10004,
      id: 'MSDS',
      name: 'MSDS ',
      fileName: '',
      fileValue: '',
      required: false,
      enable: true,
      attachmentTypeStatus: '',
      loadingStatus: false,
    },
    {
      dbTableId: 8,
      id: 'certificateOfOrigin',
      name: 'Certificate of origin ',
      fileName: '',
      fileValue: '',
      required: false,
      enable: true,
      attachmentTypeStatus: '',
      loadingStatus: false,
    },
    {
      dbTableId: 10005,
      id: 'customsCertificate',
      name: 'customs certificate ',
      fileName: '',
      fileValue: '',
      required: false,
      enable: true,
      attachmentTypeStatus: '',
      loadingStatus: false,
    },
  ];
  PrivateUseServiceAttachmentFields: AttachemntObject[] = [
    {
      dbTableId: 10006,
      id: 'customsInspection',
      name: 'customs Inspection ',
      fileName: '',
      fileValue: '',
      required: false,
      enable: true,
      attachmentTypeStatus: '',
      loadingStatus: false,
    },
    {
      dbTableId: 8,
      id: 'certificateOfOrigin',
      name: 'Certificate of origin ',
      fileName: '',
      fileValue: '',
      required: false,
      enable: true,
      attachmentTypeStatus: '',
      loadingStatus: false,
    },
    {
      dbTableId: 10007,
      id: 'useInsideFacility',
      name: 'use Inside Facility',
      fileName: '',
      fileValue: '',
      required: false,
      enable: true,
      attachmentTypeStatus: '',
      loadingStatus: false,
    },
  ];
  samplesServiceAttachmentFields: AttachemntObject[] = [

    {
      dbTableId: 8,
      id: 'certificateOfOrigin',
      name: 'Certificate of origin ',
      fileName: '',
      fileValue: '',
      required: false,
      enable: true,
      attachmentTypeStatus: '',
      loadingStatus: false,
    }
  ];
  allItemTypeAttachmentFields = {
    PRODUCTS: [
      {
        id: 'certificateOfOrigin',
        name: 'Certificate Of Origin',
        fileName: '',
        fileValue: '',
        required: false,
        enable: false,
        enabledCondition: true,
        relatedWithField: ['FINISHED_PRDUCTS'],
        attachmentTypeStatus: '',
        loadingStatus: false,
      },
      {
        id: 'companyManufactureRelationship',
        name: 'Company Manufacture Relationship',
        fileName: '',
        fileValue: '',
        required: false,
        enable: false,
        enabledCondition: true,
        relatedWithField: ['FINISHED_PRDUCTS'],
        attachmentTypeStatus: '',
        loadingStatus: false,
      },

      {
        id: 'legalizedHealthCertificate',
        name: 'legalized Health Certificate',
        fileName: '',
        fileValue: '',
        required: false,
        enable: false,
        enabledCondition: true,
        relatedWithField: ['FINISHED_PRDUCTS'],
        attachmentTypeStatus: '',
        loadingStatus: false,
      },
      {
        id: 'coa',
        name: 'COA',
        fileName: '',
        fileValue: '',
        required: false,
        enable: false,
        //enabledCondition: true,
        relatedWithField: ['FINISHED_PRDUCTS'],
        attachmentTypeStatus: '',
        loadingStatus: false,
      },
    ],
    PREMIX: [
      {
        id: 'certificateOfOrigin',
        name: 'Certificate Of Origin',
        fileName: '',
        fileValue: '',
        required: false,
        enable: true,
        attachmentTypeStatus: '',
        loadingStatus: false,
      },
      {
        id: 'coa',
        name: 'COA',
        fileName: '',
        fileValue: '',
        required: false,
        enable: true,
        attachmentTypeStatus: '',
        loadingStatus: false,
      },
      {
        id: 'approvalOfThePublicSecurityAuthority',
        name: 'The approval of the public security authority',
        fileName: '',
        fileValue: '',
        required: false,
        enable: true,
        attachmentTypeStatus: '',
        loadingStatus: false,
      },
      {
        id: 'packingList',
        name: 'Packing list',
        fileName: '',
        fileValue: '',
        required: false,
        enable: true,
        attachmentTypeStatus: '',
        loadingStatus: false,
      },
    ],
    RAW_MATERIAL: [
      {
        id: 'certificateOfOrigin',
        name: 'Certificate Of Origin',
        fileName: '',
        fileValue: '',
        required: false,
        enable: true,
        attachmentTypeStatus: '',
        loadingStatus: false,
      },
      {
        id: 'coa',
        name: 'COA',
        fileName: '',
        fileValue: '',
        required: false,
        requiredWithImportReasonCondition: true,
        enable: false,
        enabledCondition: true,
        relatedWithField: ['RAW_MAT_FOR_LOCAL', 'RAW_MAT_FOR_EXPORT', 'RAW_MAT_IMPORTERS'],
        attachmentTypeStatus: '',
        loadingStatus: false,
      },
      {
        id: 'approvalOfThePublicSecurityAuthority',
        name: 'The approval of the public security authority ',
        fileName: '',
        fileValue: '',
        required: false,
        requiredWithImportReasonCondition: true,
        enable: false,
        enabledCondition: true,
        relatedWithField: ['RAW_MAT_FOR_LOCAL', 'RAW_MAT_FOR_EXPORT', 'RAW_MAT_IMPORTERS'],
        attachmentTypeStatus: '',
        loadingStatus: false,
      },
      {
        id: 'packingList',
        name: 'Packing list',
        fileName: '',
        fileValue: '',
        required: false,
        enable: false,
        enabledCondition: true,
        relatedWithField: ['RAW_MAT_FOR_LOCAL', 'RAW_MAT_FOR_EXPORT', 'RAW_MAT_IMPORTERS'],
        attachmentTypeStatus: '',
        loadingStatus: false,
      },
    ],
    PACKING_MATERIALS: [
      {
        id: 'certificateOfOrigin',
        name: 'Certificate Of Origin',
        fileName: '',
        fileValue: '',
        required: false,
        enable: true,
        attachmentTypeStatus: '',
        loadingStatus: false,
      },
      {
        id: 'delegationForImportation',
        name: 'Delegation for importation (Raw Material/Packing Material)',
        fileName: '',
        fileValue: '',
        required: false,
        requiredWithImportReasonCondition: true,
        enable: false,
        enabledCondition: true,
        relatedWithField: ['PACK_FOR_LOCAL'],
        attachmentTypeStatus: '',
        loadingStatus: false,
      },
      {
        id: 'supplyOrder',
        name: 'Supply order (Raw Material/Packing Material)',
        fileName: '',
        fileValue: '',
        required: false,
        requiredWithImportReasonCondition: true,
        enable: false,
        enabledCondition: true,
        relatedWithField: ['PACK_FOR_LOCAL'],
        attachmentTypeStatus: '',
        loadingStatus: false,
      },
    ],
  };

  currentLang = this.translateService.currentLang ? this.translateService.currentLang : 'en';
  disableItemTypeField: boolean = false;
  disableImportReasonField: boolean = false;
  editIndex;
  editDetailedRowStatus = false;
  editPackagingIndex;
  editPackagingRowStatus = false;
  editInvoiceIndex;
  editInvoiceRowStatus = false;
  selectedReleaseTypeId;
  selectedPortId;
  companyId;
  companyName;
  arrayOfObservablesForIngredient: Observable<LookupState[]>[] = [];
  arrayOfObservablesForFunction: Observable<LookupState[]>[] = [];
  subscription: Subscription;
  showDetailsTab: boolean = false;
  showCommentsButton: boolean = false;

  constructor(private fb: FormBuilder, private number: DecimalPipe, private router: Router, private route: ActivatedRoute,
              private inputService: InputService, public translateService: TranslateService, private modalService: BsModalService, private getService: FormService, private dialog: MatDialog) {
    this.route.params.subscribe(res => {
      if (res.id) {
        this.getService.getRequestWithId(res.id).subscribe(request => {
          if (request) {
            this.showCommentsButton = true;
            this.invoiceListTable.tableBody = [];
            this.itemListTable.tableBody = [];
            this.serviceId = request.lkupServicesId;
            this.serviceTypeName = request.lkupServicesName;
            this.serviceTypeId = request.lkupServiceTypeId;
            this.setAttachmentValues(request);
            this.setInvoiceAttachmentValues(request);
            this.getFormAsStarting(request);
          }
        })
      }
      if (res.serviceId) {
        this.serviceId = res.serviceId;
        this.serviceTypeId = res.serviceTypeId;
        this.serviceTypeName = res.serviceTypeName;
      }
    });
    this.isServiceOfTypeSamples(this.serviceTypeName);
    this.getFormAsStarting('', '');
    this.getInvoicesFormAsStarting('', '');
    this.getItemsFormAsStarting('', '');
  }

  isSamplesService: boolean = false;

  isServiceOfTypeSamples(serviceName: string) {
    if (serviceName === 'Samples' || serviceName === 'R&D Samples' || serviceName === 'Samples of Packing Materials') {
      this.isSamplesService = true;
    }

  }

  ngOnInit(): void {

    //Reem [Start] && edit and replace for lost
    this.route.queryParams.subscribe(params => {
        this.parentRequestId = params.parentRequestId;
        if (this.parentRequestId) {
          this.customReleaseEdited = true;
        }
        this.serviceAction = params.serviceAction;
        if (this.serviceAction == 'Edit') {
          this.ServiceActionId = 2;
        }

        if (this.serviceAction == 'Replace') {
          this.customReleaseReplaced = true;
          this.regCustomReleaseForm.disable();
          this.regInvoicesForm.disable();
          this.regItemsForm.disable();
          this.ServiceActionId = 3;
        }
      }
    );
    //Reem [End]
    this.inputService.getInput$().pipe(
      filter(x => x.type === 'allLookups'),
      distinctUntilChanged()
    ).subscribe(res => {
      this.formData = {
        ...res.payload,
        premixNameList: [
          {id: 'localFactory', name: 'Local factory'},
          {id: 'premixBatches', name: 'Premix Batches'}],

        sourceOfRawMaterialList: [
          {id: 'animal', name: 'Animal'},
          {id: 'vegetable', name: 'Vegetable'},
          {id: 'marain', name: 'Marain'},
          {id: 'chemical', name: 'Chemical'},
          {id: 'wool', name: 'Wool'}],

        packingMaterialList: [
          {id: 'animal', name: 'Animal'},
          {id: 'vegetable', name: 'Vegetable'},
          {id: 'marain', name: 'Marain'},
          {id: 'chemical', name: 'Chemical'},
          {id: 'wool', name: 'Wool'}],

        typeOfRegistrationList: [
          {id: 'notified', name: {en: 'Notified', ar: ''}},
          {id: 'oldRegistration', name: {en: 'Old Registration', ar: ''}},],
        productTypeList: [
          {id: 'referenced', name: {en: 'Referenced', ar: 'مرجعي'}},
          {id: 'nonReferenced', name: {en: 'NoN Referenced', ar: 'غير مرجعي'}},]

      };
      this.isLoading = false;
    });


    this.inputService.getInput$().pipe(
      filter(x => x.type === 'CompanyData'),
      distinctUntilChanged()
    ).subscribe(res => {
      this.companyName = res.payload.CompanyName;
      this.setApplicant(res.payload.CompanyName);
      this.companyId = res.payload.companyId;
    });


    this.inputService.getInput$().pipe(
      filter(x => x.type === 'currentLang'),
      distinctUntilChanged()
    ).subscribe(res => {
      this.currentLang = res.payload;
    });

    this.inputService.getInput$().pipe(
      filter(x => x.type === 'productServices'),
      distinctUntilChanged()
    ).subscribe(res => {
      res.payload.filter(row => row.id === Number(this.serviceId)).map(item => {
        this.formData.itemTypeList = item.itemTypeList.map(element => {
          return {
            code: element.code,
            id: element.id,
            name: element.name
          }
        });
        this.formData.importReason = item.itemTypeList.map(element => {
          return [{
            code: element.importReasons.code,
            id: element.importReasons.id,
            name: element.importReasons.name,
            fApprovalRequired: element.importReasons.fApprovalRequired,
            fNotification: element.importReasons.fNotification,
          }]
        });
      });
      if (this.formData.itemTypeList.length === 1) {
        this.itemType = this.formData.itemTypeList[0];
        this.disableItemTypeField = true;

        this.getTermType({value: this.formData.itemTypeList[0]});
      }
    });

    this.regCustomReleaseForm.get('releaseTypeId').valueChanges.subscribe((res) => {
      this.selectedReleaseTypeId = this.getIdFromLookupByName(this.formData?.releaseType, res);
      this.renderingTheItemAttachment(this.itemType, this.importReason);
    });
    this.regCustomReleaseForm.get('lkupPortsId').valueChanges.subscribe((res) => {
        this.selectedPortId = this.getIdFromLookupByName(this.formData?.ports, res)
      }
    );


    this.setAllLookupsInObservable();
    this.route.params.subscribe(res => {
      if (res.id) {
        this.getService.getRequestWithId(res.id).subscribe(request => {
          if (request) {
            this.showCommentsButton = true;
            this.invoiceListTable.tableBody = [];
            this.itemListTable.tableBody = [];
            this.serviceId = request.lkupServicesId;
            this.serviceTypeName = request.lkupServicesName;
            this.serviceTypeId = request.lkupServiceTypeId;
            this.setAttachmentValues(request);
            this.setInvoiceAttachmentValues(request);
            this.getFormAsStarting(request);
          }
        })
      }


      if (res.serviceId) {
        this.serviceId = res.serviceId;
        this.serviceTypeId = res.serviceTypeId;
        this.serviceTypeName = res.serviceTypeName;
      }
    });
    this.isServiceOfTypeSamples(this.serviceTypeName);

  }

  fillFormData() {
    this.getService.getAllInvoiceItemTypes().subscribe((res: any) => {
      if (res) {
        this.formData.itemTypeList = res;
      }
    }), error => this.handleError(error);
  }

  typeOfPackagingList: [any];
  selectedtypeOfPackagingId: number;

  setAllLookupsInObservable() {

    this.filteredOptionsForRawMaterialType = this.filterLookupsFunction('rowMaterialNameField', this.rowMaterialNameField, this.formData?.rawMaterialList);
    this.filteredOptionsForRequestedReleaseType = this.filterLookupsFunction('releaseType', this.regCustomReleaseForm.get('releaseTypeId'), this.formData?.releaseType);
    this.filteredOptionsForCustomPortName = this.filterLookupsFunction('ports', this.regCustomReleaseForm.get('lkupPortsId'), this.formData?.ports);
    this.filteredOptionsForSupplierCountry = this.filterLookupsFunction('countries', this.regCustomReleaseForm.get('supplierCountryId'), this.formData?.countries);
    this.filteredOptionsForMeasureUnitList = this.filterLookupsFunction('unitOfMeasure', this.regCustomReleaseForm.get('lkupUomId'), this.formData?.unitOfMeasure);
    this.filteredOptionsForCurrency = this.filterLookupsFunction('currencies', this.regInvoicesForm.get('currency'), this.formData?.currencies);
    this.filteredOptionsForManufacturingCountry = this.filterLookupsFunction('manufacturingCountry', this.regItemsForm.get('manufacturingCountry'), this.formData?.countries);
    this.filteredOptionsForIngredientList = this.filterLookupsFunction('ingredient', this.regItemsForm.get('ingredient'), this.formData?.ingredient);
    this.filteredOptionsForFunctionList = this.filterLookupsFunction('function', this.regItemsForm.get('function'), this.formData?.function);
    this.filteredOptionsForUOM = this.filterLookupsFunction('uom', this.regItemsForm.get('uom'), this.formData?.unitOfMeasure);
    this.getService.getManufactureCompanies().subscribe((res: any) => {
      this.filteredOptionsForManufacturingCompany = res;
    }, error => this.handleError(error));

  }

  setApplicant(companyProfileName) {
    this.regCustomReleaseForm.patchValue({
      applicant: companyProfileName
    })
  }

  nextToNextTab(whichTab) {

    let activeTabIndex;
    whichTab.tabs.filter(x => x.active).map(y => activeTabIndex = whichTab.tabs.indexOf(y));
    activeTabIndex + 1 <= whichTab.tabs.length - 1 ? whichTab.tabs[activeTabIndex + 1].active = true : null;
  }

  backToNextTab(whichTab) {
    let activeTabIndex;
    whichTab.tabs.filter(x => x.active).map(y => activeTabIndex = whichTab.tabs.indexOf(y));
    activeTabIndex >= 0 ? whichTab.tabs[activeTabIndex - 1].active = true : null;
  }

  async getTermType(event): Promise<any> {

    if (event.value == undefined) {
      this.fillFormData();
    }
    this.formData.itemTypeList.filter(item => item.id === event.value.id).map(res => {

      this.formData.importReasonList = this.formData.importReason[this.formData.itemTypeList.indexOf(res)]
      this.importReason = '';

      if (this.formData.importReasonList.length === 1) {
        this.importReason = this.formData.importReasonList[0];
        this.disableImportReasonField = true;
        this.getTheSelectedValueForImportedReason(this.itemType, {value: this.formData.importReasonList[0]});
      }
    })
    this.getItemsFormAsStarting('', '');
  }

  onFileSelect(event, fileControlName, attachmentList, listName) {
    let attachmentValue;
    if (attachmentList.filter(x => x.loadingStatus === true).length === 0) {
      if (event.target.files.length > 0) {
        if (event.target.files[0].type === 'application/pdf' && event.target.files[0].size <= 5000000) {
          attachmentList.filter(x => x.id === fileControlName).map(y => {
            y.fileName = event.target.value.split(/(\\|\/)/g).pop();
            attachmentValue = y.fileValue;
          });

          attachmentList.filter(x => x.id === fileControlName).map(file => {
            file.attachmentTypeStatus = 'Yes';
          });
          this.fileStructure = event.target.files[0];
          const reader = new FileReader();

          reader.readAsDataURL(this.fileStructure);
          reader.onload = (res: any) => {
            if (!this.regCustomReleaseForm.value.id) {
              this.handleError('Please save the request first');
            } else {
              var reqId = 0;
              switch (listName) {
                case 'attachmentFields': {
                  reqId = this.regCustomReleaseForm.value.id;
                  break;
                }
                case 'InvoiceAttachmentFields': {
                  reqId = this.regInvoicesForm.value.id;
                  break;
                }
                case 'ItemAttachmentFields': {
                  reqId = this.regItemsForm.value.id;
                  break;
                }
                default: {
                  reqId = this.regCustomReleaseForm.value.id;
                  break;
                }
              }
              this.setAttachmentFileFunction(reqId, fileControlName, this.fileStructure.name, 0, res.target.result, attachmentValue, attachmentList, listName);
            }
          };

        } else {
          attachmentList.filter(x => x.id === fileControlName).map(file => {
            file.attachmentTypeStatus = 'No';
            file.loadingStatus = false;
          });
        }
      }
    }
  }

  setAttachmentFileFunction(requestId, FileID, FileName, id, base64Data, fileValue, attachmentList, ListName) {

    const dataForRequest = this.convertDataForAttachmentRequestBody(requestId, FileID, FileName, id, base64Data, fileValue);
    var objtype = 1;
    switch (ListName) {
      case 'attachmentFields': {
        objtype = 1;
        break;
      }
      case 'InvoiceAttachmentFields': {
        objtype = 2;
        break;
      }
      case 'ItemAttachmentFields': {
        objtype = 3;
        break;
      }
      default: {
        objtype = 1;
        break;
      }
    }
    const uploadObj =
      {
        objectTypeId: objtype,
        objectId: requestId,
        lkupAttachmentsId: attachmentList.find(x => x.id === FileID).dbTableId,
        base64Data: base64Data
      }
    debugger;
    this.getService.uploadOnOpenText(uploadObj).subscribe((res: any) => {

      this.handleSuccess("uploaded Successfully");
      attachmentList.find(x => x.id === FileID).fileValue = res;
      switch (attachmentList) {
        case 'attachmentFields': {
          this.regCustomReleaseForm.get(FileID).setValue(res);
          break;
        }
        case 'PrivateUseServiceAttachmentFields': {
          this.regCustomReleaseForm.get(FileID).setValue(res);
          break;
        }
        case 'samplesServiceAttachmentFields': {
          this.regCustomReleaseForm.get(FileID).setValue(res);
          break;
        }
        case 'OutofSpectializationServiceAttachmentFields': {
          this.regCustomReleaseForm.get(FileID).setValue(res);
          break;
        }
        case 'InvoiceAttachmentFields': {
          this.regInvoicesForm.get(FileID).setValue(res);
          break;
        }
        case 'ItemAttachmentFields': {
          this.regItemsForm.get(FileID).setValue(res);
          break;
        }
        default: {

          break;
        }
      }
    });


  }

  convertDataForAttachmentRequestBody(requestId, FileID, FileName, id, base64Data, fileValue) {
    return {
      RequestId: this.regCustomReleaseForm.value.id,
      AttachmentName: FileID,
      AttachmentFileName: FileName,
      base64Data: base64Data,
      ID: fileValue ? fileValue : id
    };
  }

  downloadFile(FileId, fileValue, attachmentList) {

    fileValue = attachmentList.find(x => x.id === FileId).fileValue;

    const fileName = attachmentList.find(x => x.id === FileId).fileName;

    this.getService.GetDocumentAsBase64(fileValue)
      .subscribe((res: any) => {

          const source = `data:application/pdf;base64,${res.base64data}`;
          const link = document.createElement("a");
          link.href = source;
          link.download = `${fileName}`
          link.click();
          this.handleSuccess("Downloaded Successfully");
        }
      )
  }


  getDecimalValue(value, fromWhere) {
    this.regCustomReleaseForm.patchValue({
      //  receiptValue: this.number.transform(this.regCustomReleaseForm.get('receiptValue').value, '1.2-2')
    }, {emitEvent: false});
  }

  getFormAsStarting(data, fromWhere?: string) {

    if (data) {
      this.formData.releaseType.filter(item => item.id === data.releaseTypeId).map(x => data.releaseTypeId = x.name[this.currentLang]);
      this.formData.ports.filter(item => item.id === data.lkupPortsId).map(x => data.lkupPortsId = x.name[this.currentLang]);
      this.formData.unitOfMeasure.filter(item => item.id === data.lkupUomId).map(x => data.lkupUomId = x.name[this.currentLang]);
      data.fRefrencedCountry = data.fRefrencedCountry ? 'referenced' : 'nonReferenced';
      data.invoices ? data.invoices.map(x => {
        x.currency = this.formData.currencies.filter(option => option.id === x.lkupCurrencyId).map(item => x.lkupCurrencyId = item.name[this.currentLang]);
        x.supplierCountry = x.supplierCountryId //this.formData.countries.filter(option => option.id === x.supplierCountryId).map(item => x.supplierCountryId = item.name[this.currentLang]);

        //itemDetails
        x.releaseItemDtos ? x.releaseItemDtos.map(item => {
          this.formData.countries.filter(option => option.id === x.manufacturingCompany).map(item => x.manufacturingCompany = item.name[this.currentLang]);
          this.formData.countries.filter(option => option.id === x.manufacturingCountry).map(item => x.manufacturingCountry = item.name[this.currentLang]);
          this.formData.unitOfMeasure.filter(option => option.id === x.uom).map(item => x.uom = item.name[this.currentLang]);
          this.formData.unitOfMeasure.filter(option => option.id === x.uom).map(item => x.uom = item.name[this.currentLang]);
        }) : null;
      }) : null;
      setTimeout(() => {
        this.invoiceListTable.tableBody = [];
        data.invoices ? data.invoices.map((x, i) => {
          this.invoiceListTable.tableBody = [...this.invoiceListTable.tableBody, x];
          this.itemListTable.tableBody = [];
          x.releaseItemDtos ? x.releaseItemDtos.map((item, i) => {
            this.itemListTable.tableBody = [...this.itemListTable.tableBody, item];
          }) : null;

        }) : null;
      }, 500);

      this.regCustomReleaseForm.patchValue({
        ...data
      });
      this.setApplicant(this.companyName);
      data.receiptValue === 0 ? this.regCustomReleaseForm.get('receiptValue').patchValue('') : null;
    } else {
      const myDate = new Date();

      this.regCustomReleaseForm = this.fb.group({
        id: 0,
        noOfItems: this.fb.control(''),
        customCertificate: this.fb.control('', Validators.required),
        releaseTypeId: this.fb.control('', Validators.required),
        bolNo: this.fb.control('', Validators.required),
        estimatedValue: 0,
        fWithinIncluded: this.fb.control(false),
        applicant: this.fb.control('', Validators.required),
        lkupPortsId: this.fb.control('', Validators.required),
        pod: this.fb.control(''),
        supplierName: this.fb.control(''),
        supplierCountryId: this.fb.control(''),
        grossWeight: this.fb.control('', Validators.required),
        lkupUomId: this.fb.control('', Validators.required),
        receiptNumber: this.fb.control('', Validators.required),
        groupNumber: this.fb.control('', Validators.required),
        receiptValue: this.fb.control('', Validators.required),
        lkupServicesId: null,
        lkupServiceTypeId: null,
        syslkupServiceActionId: null,
        dueDate: myDate,
        ProductTypeField: this.fb.control(''),
        companyRolesId: null,
        lkupTrackTypeId: null,
        fComplete: false,
        syslkupWfStatesId: null,
        invoices: this.fb.control([]),
        bolPolicy: this.fb.control(''),
        receipt: this.fb.control(''),
        exportPledge: this.fb.control(''),
        importersRecord: this.fb.control(''),
        customReleaseRequest: this.fb.control(''),
        other: this.fb.control(''),
        fRefrencedCountry: this.fb.control(''),
      });
    }
  }

  getInvoicesFormAsStarting(data, fromWhere?: string) {

    if (data) {
      this.regInvoicesForm.patchValue({
        ...data,
        currency: data.lkupCurrencyName,
        supplierCountry: this.formData.countries.filter(item => item.id === data.supplierCountryId).map(x => data.supplierCountryId = x.name[this.currentLang]),
      })
    } else {
      this.regInvoicesForm = this.fb.group({

        id: 0,
        invoiceNo: this.fb.control('', Validators.required),
        fWithinIncluded: this.fb.control(false),
        invoiceValue: this.fb.control('', Validators.required),
        invoiceDate: this.fb.control(null, Validators.required),
        currency: this.fb.control('', Validators.required),
        releaseItemDtos: this.fb.control([]),
        invoice: this.fb.control(''),
        supplierName: this.fb.control(''),
        supplierCountry: this.fb.control(''),
        InvoiceApprovalNo: this.fb.control('', Validators.required),
        packingList: this.fb.control(''),
        noOfItems: this.fb.control(''),

      });
    }
  }

  getItemsFormAsStarting(data, fromWhere?: string) {

    if (data) {
      this.formData.itemTypeList.filter(item => item.id === data.ItemTypeId).map(x => this.itemType = x.name[this.currentLang]);
      this.formData.importReasonList.filter(item => item.id === data.importReason).map(x => this.importReason = x.name[this.currentLang]);
      this.formData.unitOfMeasure.filter(item => item.id === data.uom).map(x => data.uom = x.name[this.currentLang]);
      this.regItemsForm.patchValue({
        ...data,
        shortName: data.itemCosmProductDto.productShortname,
        ProductEnglishName: data.itemCosmProductDto.productName,
        batchNo: data.itemCosmProductDto.batchNo,
        uom: this.formData.unitOfMeasure.filter(item => item.id === data.lkupUomId).map(x => data.lkupUomId = x.name[this.currentLang]),
      })

    } else {
      this.regItemsForm = this.fb.group({
        id: 0,
        ItemTypeId: this.fb.control(''),
        InvoiceItemName: this.fb.control(''),
        quantity: this.fb.control('', Validators.required),
        uom: this.fb.control('', Validators.required),
        manufacturingCountry: this.fb.control('', Validators.required),
        unitPrice: this.fb.control('', Validators.required),
        importReason: this.fb.control(''),
        certificateOfOrigin: this.fb.control(''),
        companyManufactureRelationship: this.fb.control(''),
        legalizedHealthCertificate: this.fb.control(''),
        coa: this.itemType === 'PREMIX' || (this.itemType === 'RAW_MATERIAL' && this.importReason !== 'RAW_MAT_RD') ? this.fb.control('') : this.fb.control(''),
        coc: this.importReason === 'FINISHED_PRDUCTS' ? this.fb.control('') : this.fb.control(''),
        premixName: this.fb.control(''),
        sourceOfRawMaterial: this.fb.control(''),
        ingredient: this.importReason === 'PREMIX' ? this.fb.control('', Validators.required) : this.fb.control(''),
        concentration: this.importReason === 'PREMIX' ? this.fb.control('', Validators.required) : this.fb.control(''),
        function: this.importReason === 'PREMIX' ? this.fb.control('', Validators.required) : this.fb.control(''),
        materialSafetyDataSheet: this.itemType === 'PREMIX' || (this.itemType === 'RAW_MATERIAL' && this.importReason !== 'RAW_MAT_RD') ? this.fb.control('') : this.fb.control(''),
        sourceOfRawMaterialAttach: this.itemType === 'PREMIX' || (this.itemType === 'RAW_MATERIAL' && this.importReason !== 'RAW_MAT_RD') ? this.fb.control('') : this.fb.control(''),
        declarationOfChemicalTreatment: this.fb.control(''),
        compositionOfPremixColorsFromManufacturer: this.importReason === 'PREMIX' ? this.fb.control('') : this.fb.control(''),
        approvalOfThePublicSecurityAuthority: this.itemType === 'PREMIX' || (this.itemType === 'RAW_MATERIAL' && this.importReason !== 'RAW_MAT_RD') ? this.fb.control('') : this.fb.control(''),
        delegationForImportation: this.itemType === 'PREMIX' || (this.itemType === 'RAW_MATERIAL' && this.importReason === 'RAW_MAT_FOR_LOCAL') ? this.fb.control('') : this.fb.control(''),
        supplyOrder: this.itemType === 'PREMIX' || (this.itemType === 'RAW_MATERIAL' && this.importReason === 'RAW_MAT_FOR_LOCAL') ? this.fb.control('') : this.fb.control(''),
        rawMaterialName: this.itemType === 'RAW_MATERIAL' ? this.fb.control('') : this.fb.control(''),
        sourceOfRawMaterialName: this.itemType === 'RAW_MATERIAL' ? this.fb.control('') : this.fb.control(''),
        declarationOfFreeOfSalmonella: this.itemType === 'RAW_MATERIAL' && this.importReason !== 'RAW_MAT_RD' ? this.fb.control('') : this.fb.control(''),
        packingList: this.itemType === 'PREMIX' ? this.fb.control('') : this.fb.control(''),
        MSDS: this.fb.control(''),
        customsCertificate: this.fb.control(''),
        customsInspection: this.fb.control(''),
        useInsideFacility: this.fb.control(''),
        foc: this.fb.control('', Validators.required),
        workingStandard: this.fb.control('', Validators.required),

      });
    }
  }

  async onSubmitInvoices(): Promise<any> {
    const data = this.regInvoicesForm.value;
    if (!this.editInvoiceIndex && this.editInvoiceIndex !== 0) {
      this.regCustomReleaseForm.value.invoices.push({...data});
    } else {
      this.regCustomReleaseForm.get('invoices').value[this.editInvoiceIndex] = {
        ...this.regCustomReleaseForm.get('invoices').value[this.editInvoiceIndex],
        ...data
      };
      this.editInvoiceRowStatus = false;
      this.editInvoiceIndex = '';
    }
    this.invoiceListTable.tableBody = this.regCustomReleaseForm.get('invoices').value;
    this.getInvoicesFormAsStarting('', '');
    this.hideInvoiceContainer();
  }

  async onSubmitItems(): Promise<any> {

    const data = {
      ...this.regItemsForm.value,
      ItemTypeId: this.itemType ? this.itemType.name[this.currentLang] : 1,
      importReason: this.importReason ? this.importReason.name[this.currentLang] : 0,
    };
    data.uom = await this.checkControllerValueWithListForFormArray(this.regItemsForm, this.formData?.unitOfMeasure, 'uom', data.uom);
    data.premixName = await this.checkControllerValueWithListForFormArray(this.regItemsForm, this.formData?.premixNameList, 'premixName', data.premixName);
    data.ingredient = await this.checkControllerValueWithListForFormArray(this.regItemsForm, this.formData?.ingredient, 'ingredient', data.ingredient);
    data.function = await this.checkControllerValueWithListForFormArray(this.regItemsForm, this.formData?.function, 'function', data.function);
    data.rawMaterialName = await this.checkControllerValueWithListForFormArray(this.regItemsForm, this.formData?.rawMaterialList, 'rawMaterialName', data.rawMaterialName);
    data.sourceOfRawMaterialName = await this.checkControllerValueWithListForFormArray(this.regItemsForm, this.formData?.sourceOfRawMaterialList, 'sourceOfRawMaterialName', data.sourceOfRawMaterialName);
    data.packingItemName = await this.checkControllerValueWithListForFormArray(this.regItemsForm, this.formData?.packingMaterialList, 'packingItemName', data.packingItemName);
    // if (this.regItemsForm.valid) {
    if (!this.editItemIndex && this.editItemIndex !== 0) {
      this.regInvoicesForm.value.releaseItemDtos.push({...data});
    } else {
      this.regInvoicesForm.get('releaseItemDtos').value[this.editItemIndex] = {
        ...this.regInvoicesForm.get('releaseItemDtos').value[this.editItemIndex],
        ...data
      };
      this.editItemRowStatus = false;
      this.editItemIndex = '';
    }
    this.itemListTable.tableBody = this.regInvoicesForm.get('releaseItemDtos').value;
    this.getItemsFormAsStarting('', '');
    this.hideItemContainer();

    this.releaseItemsList.push(this.releaseItemDto)
  }

  onClosed() {
    setTimeout(() => {
      this.alertNotificationStatus = false;
    }, 2000);
  }

  onClosedErrorAlert() {
    setTimeout(() => {
      this.alertErrorNotificationStatus = false;
    }, 2000);
  }

  closeSuccessSubmissionModal() {
    this.modalRef.hide();
  }

  handleError(error) {
    this.alertErrorNotificationStatus = true;
    this.alertErrorNotification = {msg: error};
    this.isLoading = false;
  }

  showInvoiceContainer() {
    this.invoiceContainerDisplayStatus = true;
  }

  showItemContainer() {
    this.itemContainerDisplayStatus = true;
  }

  hideInvoiceContainer() {
    this.invoiceContainerDisplayStatus = false;

    this.getInvoicesFormAsStarting('')
  }

  hideItemContainer() {
    this.itemContainerDisplayStatus = false;
    this.getItemsFormAsStarting('')
  }

  editItem(event) {

    this.showItemContainer();
    this.editItemIndex = event.index;
    this.editItemRowStatus = true;
    this.getItemsFormAsStarting(event.item);


  }

  deleteItem(event) {
    this.regInvoicesForm.get('releaseItemDtos').value.splice(event.index, 1);
    this.itemListTable.tableBody = [];
    this.regInvoicesForm.get('releaseItemDtos').value.map((x, i) => {
      this.itemListTable.tableBody = [...this.itemListTable.tableBody, x];
    });
  }

  deleteInvoice(event) {
    this.regCustomReleaseForm.get('invoices').value.splice(event.index, 1);
    this.invoiceListTable.tableBody = [];
    this.regCustomReleaseForm.get('invoices').value.map((x, i) => {
      this.invoiceListTable.tableBody = [...this.invoiceListTable.tableBody, x];
    });
  }

  editInvoice(event) {

    this.showInvoiceContainer();
    this.editInvoiceIndex = event.index;
    this.editInvoiceRowStatus = true;
    this.getInvoicesFormAsStarting(event.item);
  }

  getTheSelectedValueForImportedReason(itemType, event) {
    this.isLoading = true;
    this.showNotificationNoStatus = event.value.fNotification;
    setTimeout(() => {
      this.getItemsFormAsStarting('', '');
      this.renderingTheItemAttachment(itemType, event.value);
      this.isLoading = false;
    }, 500);
  }

  renderingTheItemAttachment(itemType, importReason) {
    //sara temp start
    itemType = itemType ? itemType : {id: 1, code: 'PRODUCTS'}
    // sara temp end
    this.ItemAttachmentFields = this.allItemTypeAttachmentFields[itemType.code].map(item => {
      if (item.requiredWithImportReasonCondition && item.relatedWithField.includes(importReason?.code)) {
        item.required = false;
      } else if (item.requiredWithImportReasonCondition && !item.relatedWithField.includes(importReason?.code)) {
        item.required = false;
      }

      if (item.enabledCondition && item.relatedWithField.includes(importReason?.code)) {
        if (item.id === 'coa') {
          if (this.selectedReleaseTypeId !== 2) {
            item.enable = true;
          } else {
            item.enable = false;
          }
        } else {
          item.enable = true
        }
      } else if (item.enabledCondition && !item.relatedWithField.includes(importReason?.code)) {
        item.enable = false;
      }

      return item;
    });
  }

  filterLookupsFunction(whichLookup, formControlValue, list, index?: any) {
    if (whichLookup === 'ingrediant') {
      if (formControlValue) {
        return formControlValue.valueChanges
          .pipe(
            startWith(''),
            debounceTime(30),
            map(state => state ? this.filterInsideListForDiffModel(whichLookup, state, list, index).slice(0, 3000) : list.slice(0, 3000))
          );
      }
    } else if (whichLookup === 'rowMaterialNameField') {
      if (formControlValue) {
        return formControlValue.valueChanges
          .pipe(
            startWith(''),
            map(state => state ? this.filterInsideListForDiffModel(whichLookup, state, list, index).slice(0, 3000) : list.slice(0, 3000))
          );
      }
    } else {
      if (formControlValue) {

        return formControlValue.valueChanges
          .pipe(
            startWith(''),
            map(state => state ? this.filterInsideList(whichLookup, state, list) : list?.slice())
          );
      }
    }
  }

  filterInsideList(lookup, value, list, index?: any): LookupState[] {
    let filterValue;
    if (value) {
      filterValue = value.toLowerCase() ? value.toLowerCase() : '';
    }
    return list.filter(option => option.name[this.currentLang].toLowerCase().includes(filterValue)).map(x => x);
  }

  filterInsideListForDiffModel(lookup, value, list, index?: any): any[] {
    let filterValue;
    if (value) {

      filterValue = value.toLowerCase() ? value.toLowerCase() : '';
    }
    return list.filter(option => option.inciName.toLowerCase().includes(filterValue)).map(x => x);
  }

  saveNewRequest() {
    const data = this.adaptTheObjectToBE(this.regCustomReleaseForm.value, Number(this.serviceId), Number(this.serviceTypeId));
    this.removeUnUsedProperties(data)
    this.getService.createProductRequest(data).subscribe(res => {

        this.regCustomReleaseForm.reset();
        this.regInvoicesForm.reset();
        this.regItemsForm.reset();
        this.handleSuccess('Request has been saved Successfully');
        this.isLoading = false;
        if (res) {
          this.getService.getRequestWithId(res).subscribe(request => {
            if (request) {
              this.showCommentsButton = true;
              this.invoiceListTable.tableBody = [];
              this.getFormAsStarting(request);
            }
          })
        }
        //this.router.navigate([`/pages/cosmetics-product/inner/release-services/6/12`]);
      },
      (error) => {
        this.isLoading = false;
        this.handleError(error);
      }
    );
  }

  alertSuccessNotificationStatus: boolean = false;
  alertSuccessNotification;

  handleSuccess(donemsg) {
    this.alertSuccessNotificationStatus = true;
    this.alertSuccessNotification = {msg: donemsg};
    this.isLoading = false;
  }

  removeUnUsedProperties(data) {
    if (data.invoices) {
      data.invoices.map(Option => {
        delete Option.InvApprovalNo;
        delete Option.InvoiceApprovalNo;
        delete Option.currency;
        delete Option.invoice;
        delete Option.supplierCountry;
        delete Option.itemDetails;
        Option.releaseItemDtos?.map(item => {
          delete item.APPWORKS_GUID;
          delete item.APPWORKS_ID;
          delete item.DetailsID;
          delete item.InvoiceItemName;
          delete item.NotificationNo;
          delete item.PRODUCT_ID;
          delete item.ProductEnglishName;
          delete item.approvalOfThePublicSecurityAuthority;
          delete item.batchNo;
          delete item.certificateOfOrigin;
          delete item.coa;
          delete item.coc;
          delete item.colour;
          delete item.declarationOfChemicalTreatment;
          delete item.companyManufactureRelationship;
          delete item.compositionOfPremixColorsFromManufacturer;
          delete item.concentration;
          delete item.declarationOfFreeOfSalmonella;
          delete item.delegationForImportation;
          delete item.detailsTable;
          delete item.flavor;
          delete item.fragrance;
          delete item.function;
          delete item.ingrediantDetails;
          delete item.ingredient;
          delete item.isCartonBox;
          delete item.legalizedHealthCertificate;
          delete item.manufactureTable;
          delete item.manufacturingCompany;
          delete item.manufacturingCountry;
          delete item.materialSafetyDataSheet;
          delete item.rawMaterialName;
          delete item.shortName;
          delete item.sourceOfRawMaterial;
          delete item.sourceOfRawMaterialAttach;
          delete item.sourceOfRawMaterialName;
          delete item.supplyOrder;
          delete item.typeOfPackaging;
          delete item.unitOfMeasure;
          delete item.uom;
          delete item.uomId;
          delete item.volumes;
          delete item.volumesID;
          delete item.importReason;
          delete item.packagingTable;
          delete item.approvalItemPackDto;
          delete item.approvalItemPremixDto;
          delete item.approvalItemProductDto;
          delete item.approvalItemRawDto;
          delete item.currentApprovalCount;
          delete item.invoicesId;
          delete item.itemPremixDto;
          delete item.lkupCurrencyName;
          delete item.lkupCurrencyId;
          delete item.syslkupItemTypeId;
          delete item.syslkupItemTypeName;
          delete item.validityDateFrom;
          delete item.validityDateTo;
          delete item.opentextId;
          delete item.ItemTypeId;

        })
      })

    }
  }

  adaptTheObjectToBE(data, servicesId?: number, servicesTypeId?: number): any {
    debugger;
    data.invoiceDtos = data.invoices?.map(option => {
      option.id = option.id ? option.id : 0,
        option.bolId = data.id
      option.lkupCurrencyId = option.currency ? this.getIdFromLookupByName(this.formData.currencies, option.currency) : '';
      option.fWithinIncluded = option.fWithinIncluded ? data.fWithinIncluded : false;

      option.supplierName = option.supplierName ? option.supplierName : '';
      option.supplierCountryId = option.supplierCountry ? this.getIdFromLookupByName(this.formData.countries, option.supplierCountry) : null;
      option.invoiceValue = Number(option.invoiceValue)
      option.invoiceDate = option.invoiceDate ? option.invoiceDate : null;
      option.invoiceNo = option.invoiceNo ? option.invoiceNo : '';
      option.approvalInvoiceNo = option.InvoiceApprovalNo ? option.InvoiceApprovalNo : '';
      option.noOfItems = Number(option.noOfItems),
        option.releaseItemDtos = option.releaseItemDtos?.map(item => {
          item.id = item.approvalItemNo ? 0 : item.id;
          item.invoicesId = option.id;
          item.fRegisteredProduct = this.ProductTypeField === 'referenced' ? true : false;
          item.lkupCountryId = item.manufacturingCountry ? this.getIdFromLookupByName(this.formData.countries, item.manufacturingCountry) : null;
          item.lkupUomId = item.uom ? this.getIdFromLookupByName(this.formData.unitOfMeasure, item.uom) : null,
            item.itemName = item.shortName ? item.shortName : '';
          item.quantity = Number(item.quantity);
          item.fConformity = item.lkupConformityCommentsId;
          item.lkupConformityCommentsId = item.lkupConformityCommentsId ? item.lkupConformityCommentsId : null;
          item.itemTypeId = item.ItemTypeId ? this.getIdFromLookupByName(this.formData.itemTypeList, item.ItemTypeId) : 1;
          item.foc = Number(item.foc);
          item.workingStandard = Number(item.workingStandard);
          item.itemCosmPackDto =
            {
              id: 0,
              lkupPackingId: item.typeOfPackaging ? this.getIdFromPackingTypeByName(this.typeOfPackagingList, item.typeOfPackaging) : null,
              lkupManufactoryId: item.manufacturingCompany ? !isNaN(item.manufacturingCompany) ? item.manufacturingCompany : this.getIdFromLookupByName(this.formData.companies, item.manufacturingCompany) : null,
              batchNo: item.batchNo ? item.batchNo : ''
            }
          item.itemCosmProductDto = {
            id: 0,
            productId: 0,
            notificationNo: this.notificationNo,
            productName: item.ProductEnglishName ? item.ProductEnglishName : '',
            productShortname: item.shortName ? item.shortName : '',
            flagType: '',
            lkupManufactoryId: item.manufacturingCompany ? !isNaN(item.manufacturingCompany) ? item.manufacturingCompany : this.getIdFromLookupByName(this.formData.companies, item.manufacturingCompany) : null,
            batchNo: item.batchNo ? item.batchNo : '',
            volume: item.volumes ? item.volumes : '',
            lkupUomId: item.uom ? this.getIdFromLookupByName(this.formData.unitOfMeasure, item.uom) : '',
            packingDescription: item.packagingDescription ? item.packagingDescription : '',
            lkupPackingTypeId: item.typeOfPackaging ? this.getIdFromPackingTypeByName(this.typeOfPackagingList, item.typeOfPackaging) : null,
            fCartonbox: item.isCartonBox ? item.isCartonBox : false,
            productColour: item.colour ? item.colour : '',
            fragrance: item.fragrance ? item.fragrance : '',
            flavor: item.flavor ? item.flavor : '',
            barcode: '',
            productIngredientDtos: []
          }

          item.itemPremixDto = null,
            item.itemRawMaterialDto = {
              id: 0,
              ingredientsId: item.approvalItemRawDto ? item.approvalItemRawDto.approvalItemId : null,
              cosingRefNo: item.approvalItemRawDto ? item.approvalItemRawDto.cosingRefNo : '',
              inciName: item.approvalItemRawDto ? item.approvalItemRawDto.inciName : '',
              lkupManufactoryId: item.approvalItemRawDto ? item.approvalItemRawDto.lkupManufactoryId : null,
              manufacturingCompany: item.approvalItemRawDto ? item.approvalItemRawDto.manufacturingCompany : null,
              sourceRawMaterialId: item.approvalItemRawDto ? item.approvalItemRawDto.lkupRawMaterialsId : null,
            }
          item.uomId = item.uomId ? this.getIdFromLookupByName(this.formData.unitOfMeasure, item.uom) : null;
          return item;
        })

      return option;
    });

    return {
      id: data.id ? data.id : 0,
      customCertificate: data.customCertificate ? data.customCertificate : '',
      noOfItems: Number(data.noOfItems),
      importerLicenseNo: '',
      LkupServiceTypeId: data.lkupServiceTypeId ? data.lkupServiceTypeId : servicesTypeId,
      LkupServicesId: data.lkupServicesId ? data.lkupServicesId : servicesId,
      SyslkupServiceActionId: 1,
      releaseTypeId: this.selectedReleaseTypeId ? Number(this.selectedReleaseTypeId) : 1,
      receiptNumber: data.receiptNumber ? data.receiptNumber : '',
      receiptValue: data.receiptValue ? Number(data.receiptValue) : 0,
      groupNumber: data.groupNumber ? data.groupNumber : '',
      estimatedValue: data.estimatedValue ? data.estimatedValue : 0,
      bolNo: data.bolNo ? data.bolNo : '',
      FWithinIncluded: data.fWithinIncluded,
      lkupPortsId: data.lkupPortsId ? this.getIdFromLookupByName(this.formData.ports, data.lkupPortsId) : null,
      pod: data.pod ? data.pod : '',
      grossWeight: data.grossWeight ? Number(data.grossWeight) : 0,
      LkupUomId: data.lkupUomId ? this.getIdFromLookupByName(this.formData.unitOfMeasure, data.lkupUomId) : null,
      lkupTrackTypeId: null,
      fRefrencedCountry: this.ProductTypeField === 'referenced' ? true : false,
      invoices: data.invoices && data.invoices.length ? data.invoices : [],

    };

  };

  selectedapproveditems: any[] = [];

  onselectApprovedItem(approvedItem) {
    this.selectedapproveditems.push(approvedItem);
  }

  onSubmitForm() {
    switch (this.ServiceActionId) {
      case 1:// Create new Request Action
      {
        this.onSubmitNewRequest();
        break;
      }
      case 2: {

        break;
      }
      case 3: // Replace for Lost Action
      {
        this.onSubmitReplaceRequest();
        break;
      }
      default: {
        this.onSubmitNewRequest();
        break;
      }

    }
  }

  onSubmitNewRequest() {
    const data = this.adaptTheObjectToBE(this.regCustomReleaseForm.value, Number(this.serviceId), Number(this.serviceTypeId));
    this.removeUnUsedProperties(data)
    this.getService.submitRequest(data).subscribe(res => {
      if (res) {

        this.handleSuccess("Request has been saved Successfully");
        this.regCustomReleaseForm.reset();
        this.regInvoicesForm.reset();
        this.regItemsForm.reset();
        this.router.navigate([`/pages/cosmetics-product/inner/release-services/6/12`]);
      }
    }, (error) => {
      this.handleError(error);
    })
  }

  checkControllerValueWithListForFormArray(form: FormGroup, list, formControlKey, formControlValue) {
    let value;
    if (formControlValue) {
      if (list.filter(option => option.name[this.currentLang] === formControlValue).length > 0) {
        list.filter(option => option.name[this.currentLang] === formControlValue).map(x => {
          value = x.name[this.currentLang];
        });
      } else {
        form.get(formControlKey).patchValue('');
        value = '';
      }
    }
    return value;
  }

  getIdFromLookupByName(list, value) {
    let id;
    list.filter(option => option.name[this.currentLang] === value).map(res => {
      id = res.id;
    });

    return id;
  }

  getIdFromLookupByNameWithDiffModel(list, value) {
    let id;
    list.filter(option => option.inciName === value).map(res => {
      id = res.id;
    });

    return id;
  }

  getIdFromPackingTypeByName(list, value) {
    let id;
    list.filter(option => option.packingType === value).map(res => {
      id = res.id;
    });

    return id;
  }

  ngOnDestroy() {
    if (this.subscription && !this.subscription.closed) {
      this.subscription.unsubscribe();
    }
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, this.modalOptions);
  }

  choosePackagingData(event) {

    this.regItemsForm.get('packagingTable').patchValue([event]);
  }

  chooseDetailsData(event) {
    this.regItemsForm.get('detailsTable').patchValue([event]);
  }

  chooseManufactureData(event) {
    this.regItemsForm.get('manufactureTable').patchValue([event]);
  }

  viewReleseComment() {
    this.dialog.open<ViewReleaseCommentsComponent, ViewReleaseCommentsComponentDataDialog>(ViewReleaseCommentsComponent, {
      width: '80%',
      data: {requestId: /*this.serviceId ||*/ 40442},
    });
  }

  // Within Included[Start]
  withinIncludedBols: any[] = [];
  checkedIncludedBol: any = {};
  withinIncludedInvoices: any[] = [];
  IncludedInvoices: any[] = [];
  checkedIncludedInvoice: any = {};
  includedInvoiceSelected: boolean = false;
  includedBolSelected: boolean = false;

  showIncludedBols(event: MatCheckboxChange): void {
    if (event.checked) {
      this.includedBolSelected = true;
      this.getService.getWithinIncludedBols().subscribe((res) => {
        this.withinIncludedBols = res;

      });

    } else {
      this.includedBolSelected = false;
    }
  }

  checkIncludedBol(bolNo: string) {

    if (this.includedBolSelected == true) {
      this.getService.getBillOfLading(bolNo).subscribe((res) => {
        this.checkedIncludedBol = res;
        this.getBolsFormAsStarting(this.checkedIncludedBol);

      });
      this.getService.getWithinIncludedInvoices(bolNo).subscribe((res) => {
        this.IncludedInvoices = res;

      });
    }
  }

  showIncludedInvoices(event: MatCheckboxChange) {
    if (event.checked) {
      this.includedInvoiceSelected = true;
      this.withinIncludedInvoices = this.IncludedInvoices;

    } else {
      this.includedInvoiceSelected = false;
    }

  }

  showInvoiceDetails(InvoiceNo: string) {
    if (this.includedInvoiceSelected == true) {
      this.getService.getInvoiceByInvoiceNo(InvoiceNo).subscribe((res) => {
        this.checkedIncludedInvoice = res;
        this.getInvoicesFormAsStarting(this.checkedIncludedInvoice);

      });
    }
  }

  getBolsFormAsStarting(data, fromWhere?: string) {
    if (data) {
      this.regCustomReleaseForm.patchValue({
        id: 0,
        releaseTypeId: data.releaseTypeId,
        receiptNumber: data.receiptNumber,
        groupNumber: data.groupNumber,
        receiptValue: data.receiptValue,
        applicant: data.applicant,
        lkupPortsId: data.lkupPortsId,
        pod: data.pod,
        grossWeight: data.grossWeight,
        lkupUomId: data.lkupUomId
      });
    } else {
      this.regCustomReleaseForm = this.fb.group({
        id: 0,
        releaseTypeId: this.fb.control('', Validators.required),
        bolNo: this.fb.control('', Validators.required),
        estimatedValue: 0,
        fWithinIncluded: this.fb.control(false),
        receiptNumber: this.fb.control('', Validators.required),
        groupNumber: this.fb.control('', Validators.required),
        receiptValue: this.fb.control('', Validators.required),
        lkupServicesId: null,
        lkupServiceTypeId: null,
        syslkupServiceActionId: null,
        applicant: this.fb.control('', Validators.required),
        lkupPortsId: this.fb.control('', Validators.required),
        pod: this.fb.control(''),
        grossWeight: this.fb.control('', Validators.required),
        lkupUomId: this.fb.control('', Validators.required),
        other: this.fb.control(''),
      });

    }
  }

  // within Included [End]
  resetForms() {
    this.regCustomReleaseForm.reset();
    this.regInvoicesForm.reset();
    this.regItemsForm.reset();
    this.setAllLookupsInObservable();

  }

  //Reem Get attachemnt Key [Start]
  setAttachmentValues(request) {
    this.attachmentFields.find(x => x.id == 'bolPolicy').fileValue = request.bolPolicy ? request.bolPolicy.opentextId : '';
    this.attachmentFields.find(x => x.id == 'customReleaseRequest').fileValue = request.customReleaseRequest ? request.customReleaseRequest.opentextId : '';
    this.attachmentFields.find(x => x.id == 'receipt').fileValue = request.receipt ? request.receipt.opentextId : '';
    this.attachmentFields.find(x => x.id == 'importersRecord').fileValue = request.importersRecord ? request.importersRecord.opentextId : '';
    this.attachmentFields.find(x => x.id == 'other').fileValue = request.other ? request.other.opentextId : '';

  }

  setInvoiceAttachmentValues(request) {
    debugger;
    this.InvoiceAttachmentFields.find(x => x.id == 'invoice').fileValue = request.invoices.invoice ? request.invoices.invoice.opentextId : '';
    this.InvoiceAttachmentFields.find(x => x.id == 'InvApprovalNo').fileValue = request.invoices.provalInvoiceNo ? request.invoices.provalInvoiceNo.opentextId : '';
    this.InvoiceAttachmentFields.find(x => x.id == 'packingList').fileValue = request.invoices.packingList ? request.invoices.packingList.opentextId : '';
  }

  //Reem Get attachemnt Key [End]

  //Reem Replace for Lost 5-8-2022 [Start]
  replacementReportIssueSites = [
    {id: 1, name: 'Company'}, {id: 2, name: 'Eda'}]

  replacementCustomReleaseForm = new FormGroup({
    replacementReportNo: new FormControl(),
    replacementReportIssueSite: new FormControl(),
    replacementReportDate: new FormControl()
  });

  saveReplaceRequest() {
    debugger;
    const data = {
      lostReplacementReportNo: this.replacementCustomReleaseForm.value.replacementReportNo ? this.replacementCustomReleaseForm.value.replacementReportNo : 0,
      lostReplacementReportIssueSite: this.replacementCustomReleaseForm.value.replacementReportIssueSite ? this.replacementCustomReleaseForm.value.replacementReportIssueSite : '',
      lostReplacementReportDate: this.replacementCustomReleaseForm.value.replacementReportDate ? this.replacementCustomReleaseForm.value.replacementReportDate : '',
      requestId: this.parentRequestId
    }

    this.getService.replaceForLost(data).subscribe(res => {
        if (res) {
          this.replacementCustomReleaseForm.reset();
          this.regCustomReleaseForm.reset();
          this.regInvoicesForm.reset();
          this.regItemsForm.reset();
          this.handleSuccess('Request has been saved Successfully');

          this.isLoading = false;
        }
      }, (error) => {
        this.isLoading = false;
        this.handleError(error);
      }
    );

  }

  saveData() {
    switch (this.ServiceActionId) {
      case 1:// Create new Request Action
      {
        this.saveNewRequest();
        break;
      }
      case 2: // Edit Request
      {

        break;
      }
      case 3: // Replace for Lost Action
      {
        this.saveReplaceRequest();
        break;
      }
      default: {
        this.saveNewRequest();
        break;
      }

    }
  }

  onSubmitReplaceRequest() {
    const data = {
      lostReplacementReportNo: this.replacementCustomReleaseForm.value.replacementReportNo ? this.replacementCustomReleaseForm.value.replacementReportNo : 0,
      lostReplacementReportIssueSite: this.replacementCustomReleaseForm.value.replacementReportIssueSite ? this.replacementCustomReleaseForm.value.replacementReportIssueSite : '',
      lostReplacementReportDate: this.replacementCustomReleaseForm.value.replacementReportDate ? this.replacementCustomReleaseForm.value.replacementReportDate : '',
      requestId: this.parentRequestId
    }
    this.getService.replaceForLost(data).subscribe(res => {
        if (res) {
          this.replacementCustomReleaseForm.reset();
          this.regCustomReleaseForm.reset();
          this.regInvoicesForm.reset();
          this.regItemsForm.reset();
          this.handleSuccess('Request has been saved Successfully');
          this.isLoading = false;
        }
      }, (error) => {
        this.isLoading = false;
        this.handleError(error);
      }
    );

  }
}
