import {Component, OnDestroy, OnInit, QueryList, TemplateRef, ViewChild, ViewChildren} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {FormService} from '../services/form.service';
import {ActivatedRoute, Router} from '@angular/router';
import {DecimalPipe} from '@angular/common';
import {catchError, debounceTime, distinctUntilChanged, filter, map, startWith} from 'rxjs/operators';
import {Observable, Subscription} from 'rxjs';
import {MatAutocompleteTrigger} from '@angular/material/autocomplete';
import {TabsetComponent} from 'ngx-bootstrap/tabs';
import {InputService} from '../services/input.service';
import {BsModalRef, BsModalService, ModalOptions} from 'ngx-bootstrap/modal';
import {TranslateService} from "@ngx-translate/core";
import {CustomReleaseModel} from "../../utils/common-models";

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit, OnDestroy {

  isLoading: boolean = false;
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
  productComments;
  regCustomReleaseForm: FormGroup;
  regInvoicesForm: FormGroup;
  regApprovedInvoicesForm: FormGroup;
  regApprovedItemsForm:FormGroup;
  regItemsForm: FormGroup;
  regPackagingForProduct: FormGroup;
  regDetailedForProduct: FormGroup;
  filteredOptionsForRawMaterialType: Observable<any[]>;
  filteredOptionsForRequestedReleaseType: Observable<LookupState[]>;
  filteredOptionsForCustomPortName: Observable<LookupState[]>;
  filteredOptionsForSupplierCountry: Observable<LookupState[]>;
  filteredOptionsForMeasureUnitList: Observable<LookupState[]>;
  filteredOptionsForCurrency: Observable<LookupState[]>;
  filteredOptionsForManufacturingCompany:[any];
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
      id: 'packingList',
      name: 'Packing List',
      fileName: '',
      fileValue: '',
      required: false,
      enable: true,
      attachmentTypeStatus: '',
      loadingStatus: false,
    },
    {
      id: 'receipt',
      name: 'Receipt',
      fileName: '',
      fileValue: '',
      required: false,
      enable: true,
      attachmentTypeStatus: '',
      loadingStatus: false,
    },
    {
      id: 'exportPledge',
      name: 'Export Pledge',
      fileName: '',
      fileValue: '',
      required: false,
      enable: true,
      attachmentTypeStatus: '',
      loadingStatus: false,
    },
    {
      id: 'importersRecord',
      name: 'Importers Record',
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
      id: 'invoice',
      name: 'Invoice',
      fileName: '',
      fileValue: '',
      required: false,
      enable: true,
      attachmentTypeStatus: '',
      loadingStatus: false,
    },
    {
      id: 'InvApprovalNo',
      name: 'Invoice Importation Approval Number',
      fileName: '',
      fileValue: '',
      required: false,
      enable: true,
      attachmentTypeStatus: '',
      loadingStatus: false,
    }
  ];
  ItemAttachmentFields: AttachemntObject[] = [];
  fileStructure;
  attachmentRequiredStatus: boolean = false;
  invoiceListTable = {
    tableHeader: ['invoiceNo', 'invoiceDate', 'invoiceValue', 'Currency', 'Actions'],
    tableBody: []
  };
  itemListTable = {
    tableHeader: ['itemType', 'importReason', 'manufacturingCompany', 'quantity', 'batchNo', 'Actions'],
    tableBody: []
  };
  approvedItemListTable = {
    tableHeader: ['select','id','itemType', 'initApprovedQty', 'currentApprovedQty', 'validityFrom', 'validityTo', 'Actions'],
    tableBody: []
  };
  detailsListTable = {
    tableHeader: ['colour', 'fragrance', 'flavor', 'barCode'],
    tableBody: []
  };
  manufacturingListTable = {
    tableHeader: ['manufactureCompany', 'manufactureCountry'],
    tableBody: []
  };
  packagingListTable = {
    tableHeader: ['choose', 'volumes', 'unitOfMeasure', 'typeOfPackaging'],
    tableBody: []
  };
  invoiceContainerDisplayStatus: boolean = false;
  invoiceApprovalcontainerDisplayStatus: boolean = false;
  itemApprovalcontainerDisplayStatus: boolean = false;
  approvedInvoiceDetails  ;
  approvedItemDetails  ;
  itemContainerDisplayStatus: boolean = false;
  itemType;
  importReason;
  premixField;
  rowMaterialNameField = new FormControl();
  sourceOfRowMaterialField;
  typeOfRegistrationField;
  packingItemNameField;
  showNotificationNoStatus: boolean = false;
  notificationNo;
  editItemIndex;
  editItemRowStatus = false;
  customImportRelease: any = [];
  serviceId;
  serviceTypeId;
  serviceTypeName;
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
  companyId;
  companyName;
  arrayOfObservablesForIngredient: Observable<LookupState[]>[] = [];
  arrayOfObservablesForFunction: Observable<LookupState[]>[] = [];
  subscription: Subscription;
  showDetailsTab: boolean = false;

  constructor(private fb: FormBuilder,
              private number: DecimalPipe,
              private router: Router,
              private route: ActivatedRoute,
              private inputService: InputService,
              public translateService: TranslateService,
              private modalService: BsModalService,
              private getService: FormService) {



    this.route.params.subscribe(res => {
      this.serviceId = res.serviceId;
      this.serviceTypeId = res.serviceTypeId;
      this.serviceTypeName = " " + res.serviceTypeName;
      if (res.id) {
        this.getService.getRequestWithId(res.id).subscribe(res => {
          this.getFormAsStarting(res);
        })
      }
    });
	this.getFormAsStarting('', '');
    this.getInvoicesFormAsStarting('', '');
    this.getItemsFormAsStarting('', '');
    this.getPackagingFormAsStarting('');
    this.getDetailedFormAsStarting('');

  }

  ngOnInit(): void {
    this.inputService.getInput$().pipe(
      filter(x => x.type === 'allLookups'),
      distinctUntilChanged()
    ).subscribe(res => {
      this.formData = {
        ...res.payload,
        premixNameList: [
          {
            id: 'localFactory',
            name: 'Local factory'
          },
          {
            id: 'premixBatches',
            name: 'Premix Batches'
          }
        ],
        sourceOfRawMaterialList: [
          {
            id: 'animal',
            name: 'Animal'
          },
          {
            id: 'vegetable',
            name: 'Vegetable'
          },
          {
            id: 'marain',
            name: 'Marain'
          },
          {
            id: 'chemical',
            name: 'Chemical'
          },
          {
            id: 'wool',
            name: 'Wool'
          }
        ],
        packingMaterialList: [
          {
            id: 'animal',
            name: 'Animal'
          },
          {
            id: 'vegetable',
            name: 'Vegetable'
          },
          {
            id: 'marain',
            name: 'Marain'
          },
          {
            id: 'chemical',
            name: 'Chemical'
          },
          {
            id: 'wool',
            name: 'Wool'
          }
        ],
        typeOfRegistrationList: [
          {
            id: 'notified',
            name: {
              en: 'Notified',
              ar: ''
            }
          },
          {
            id: 'oldRegistration',
            name: {
              en: 'Old Registration',
              ar: ''
            }
          },
        ],
        productTypeList: [
          {id: 'referenced',name: {en: 'Referenced',ar: 'مرجعي'}},
          {id: 'nonReferenced',name: {en: 'NoN Referenced',ar: 'غير مرجعي'}},]

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


    this.regCustomReleaseForm.get('releaseTypeId').valueChanges.subscribe(res => {
      this.selectedReleaseTypeId = this.getIdFromLookupByName(this.formData?.releaseType, res);

      this.renderingTheItemAttachment(this.itemType, this.importReason);
    })

    this.setAllLookupsInObservable();
  }

  typeOfPackagingList:[any];
  selectedtypeOfPackagingId: number;
  setAllLookupsInObservable() {
    this.filteredOptionsForRawMaterialType = this.filterLookupsFunction('rowMaterialNameField', this.rowMaterialNameField, this.formData?.rawMaterialList);
    this.filteredOptionsForRequestedReleaseType = this.filterLookupsFunction('releaseType', this.regCustomReleaseForm.get('releaseTypeId'), this.formData?.releaseType);
    this.filteredOptionsForCustomPortName = this.filterLookupsFunction('ports', this.regCustomReleaseForm.get('LkupPortsId'), this.formData?.ports);
    this.filteredOptionsForSupplierCountry = this.filterLookupsFunction('countries', this.regCustomReleaseForm.get('supplierCountryId'), this.formData?.countries);
    this.filteredOptionsForMeasureUnitList = this.filterLookupsFunction('unitOfMeasure', this.regCustomReleaseForm.get('lkupUomId'), this.formData?.unitOfMeasure);
    this.filteredOptionsForCurrency = this.filterLookupsFunction('currencies', this.regInvoicesForm.get('currency'), this.formData?.currencies);
    this.filteredOptionsForManufacturingCountry = this.filterLookupsFunction('manufacturingCountry', this.regItemsForm.get('manufacturingCountry'), this.formData?.countries);
    this.filteredOptionsForPackingManufacturingCompany = this.filterLookupsFunction('PackingManufacturingCompany', this.regPackagingForProduct.get('PackingManufacturingCompany'), this.formData?.companies);
    this.filteredOptionsForPackingManufacturingCountry = this.filterLookupsFunction('PackingManufacturingCountry', this.regPackagingForProduct.get('PackingManufacturingCountry'), this.formData?.countries);
    this.filteredOptionsForIngredientList = this.filterLookupsFunction('ingredient', this.regItemsForm.get('ingredient'), this.formData?.ingredient);
    this.filteredOptionsForFunctionList = this.filterLookupsFunction('function', this.regItemsForm.get('function'), this.formData?.function);
    this.filteredOptionsForUOM = this.filterLookupsFunction('uom', this.regItemsForm.get('uom'), this.formData?.unitOfMeasure);
    // this.getService.getPackingTypes().subscribe((res: any) =>
   // {this.typeOfPackagingList =res; }, error => this.handleError(error));
    // this.getService.getManufactureCompanies().subscribe((res: any) => {this.filteredOptionsForManufacturingCompany =res; }, error => this.handleError(error));

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

  setApplicant(companyProfileName) {
    this.regCustomReleaseForm.patchValue({
      applicant: companyProfileName
    })
  }

  onFileSelect(event, fileControlName) {
    let cardImageBase64;
    let resForSetAttachment;
    let attachmentValue;

    if (this.attachmentFields.filter(x => x.loadingStatus === true).length === 0) {
      if (event.target.files.length > 0) {
        if (event.target.files[0].type === 'application/pdf' && event.target.files[0].size <= 5000000) {
          this.attachmentFields.filter(x => x.id === fileControlName).map(y => {
            y.fileName = event.target.value.split(/(\\|\/)/g).pop();
            attachmentValue = y.fileValue;
          });

          this.attachmentFields.filter(x => x.id === fileControlName).map(file => {
            file.attachmentTypeStatus = 'Yes';
          });
          this.fileStructure = event.target.files[0];
          const reader = new FileReader();

          reader.readAsDataURL(this.fileStructure);
          reader.onload = (res: any) => {
            if (!this.regCustomReleaseForm.value.id) {
              this.handleError('Please save the request first');
              const newAttachmentObject = {
                ...this.regCustomReleaseForm.value,
              };
            } else {
              this.setAttachmentFileFunction(this.regCustomReleaseForm.value.id, fileControlName, this.fileStructure.name, 0, res.target.result, attachmentValue);
            }
          };

        } else {
          this.attachmentFields.filter(x => x.id === fileControlName).map(file => {
            file.attachmentTypeStatus = 'No';
            file.loadingStatus = false;
          });
        }
      }
    }
  }

  setAttachmentFileFunction(requestId, FileID, FileName, id, base64Data, fileValue) {
    const dataForRequest = this.convertDataForAttachmentRequestBody(requestId, FileID, FileName, id, base64Data, fileValue);

    this.attachmentFields.filter(x => x.id === FileID).map(y => {
      y.loadingStatus = true;
    });

    this.getService.setAttachmentFile(dataForRequest).subscribe((res: any) => {
      this.attachmentFields.filter(x => x.id === FileID).map(y => {
        y.fileValue = res.ID;
        y.loadingStatus = false;
        this.regCustomReleaseForm.get(FileID).setValue(res.ID);
      });

      return res;
    }, error => this.handleError(error)); //
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

  downloadFile(FileName) {
    this.getService.getAttachmentFileByID(this.regCustomReleaseForm.value.id, FileName).subscribe((res: any) => {
      this.convertFilesToPDF(res.base64Data, FileName);
    });
  }

  convertFilesToPDF(base64Data, fileName) {
    let obj = document.createElement('object');
    obj.style.width = '100%';
    obj.style.height = '842pt';
    obj.type = 'application/pdf';
    obj.data = 'data:application/pdf;base64,' + base64Data;

    var link = document.createElement('a');
    link.innerHTML = 'Download PDF file';
    link.download = `${fileName}`;
    link.className = 'pdfLink';
    link.href = 'data:application/pdf;base64,' + base64Data;

    link.click();
  }


  getDecimalValue(value, fromWhere) {
    this.regCustomReleaseForm.patchValue({
      receiptValue: this.number.transform(this.regCustomReleaseForm.get('receiptValue').value, '1.2-2')
    }, {emitEvent: false});
  }

  getFormAsStarting(data, fromWhere?: string) {
    if (data) {
      this.formData.releaseType.filter(item => item.id === data.releaseTypeId).map(x => data.releaseTypeId = x.name[this.currentLang]);
      this.formData.ports.filter(item => item.id === data.LkupPortsId).map(x => data.LkupPortsId = x.name[this.currentLang]);
      this.formData.countries.filter(item => item.id === data.supplierCountryId).map(x => data.supplierCountryId = x.name[this.currentLang]);
      this.formData.unitOfMeasure.filter(item => item.id === data.lkupUomId).map(x => data.lkupUomId = x.name[this.currentLang]);


      data.Invoices ? data.Invoices.map(x => {
        this.formData.currencies.filter(option => option.id === x.currency).map(item => x.currency = item.name[this.currentLang]);
        //itemDetails
        x.itemDetails ? x.itemDetails.map(item => {
          this.formData.countries.filter(option => option.id === x.manufacturingCompany).map(item => x.manufacturingCompany = item.name[this.currentLang]);
          this.formData.countries.filter(option => option.id === x.manufacturingCountry).map(item => x.manufacturingCountry = item.name[this.currentLang]);
          this.formData.unitOfMeasure.filter(option => option.id === x.uom).map(item => x.uom = item.name[this.currentLang]);
          this.formData.unitOfMeasure.filter(option => option.id === x.uom).map(item => x.uom = item.name[this.currentLang]);
        }) : null;
      }) : null;
      this.productComments = data.productComments;
      setTimeout(() => {
        this.invoiceListTable.tableBody = [];
        data.Invoices ? data.Invoices.map((x, i) => {
          this.invoiceListTable.tableBody = [...this.invoiceListTable.tableBody, x];

          x.itemDetails ? x.itemDetails.map((item, i) => {
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
        releaseTypeId: this.fb.control('', Validators.required),
        bolNo: this.fb.control('', Validators.required),
        estimatedValue: 0,
        fWithinIncluded: this.fb.control(false),
        applicant: this.fb.control('', Validators.required),
        LkupPortsId: this.fb.control('', Validators.required),
        pod: this.fb.control(''),
        supplierName: this.fb.control(''),
        supplierCountryId: this.fb.control(''),
        grossWeight: this.fb.control('', Validators.required),
        lkupUomId: this.fb.control('', Validators.required),
        receiptNumber: this.fb.control('', Validators.required),
        groupNumber: this.fb.control('', Validators.required),
        receiptValue: this.fb.control('', Validators.required),
        carrierName: this.fb.control(''),
        lkupServicesId: null,
        lkupServiceTypeId: null,
        syslkupServiceActionId: null,
        dueDate: myDate,
        companyRolesId: null,
        lkupTrackTypeId: null,
        fComplete: false,
        syslkupWfStatesId: null,
        Invoices: this.fb.control([]),
        bolPolicy: this.fb.control(''),
        packingList: this.fb.control(''),
        receipt: this.fb.control(''),
        exportPledge: this.fb.control(''),
        importersRecord: this.fb.control('')
      });
    }
  }

  getInvoicesFormAsStarting(data, fromWhere?: string) {
    if (data) {
      this.formData.currencies.filter(item => item.id === data.currency).map(x => data.currency = x.name[this.currentLang]);

      this.regInvoicesForm.patchValue({...data})
    } else {
      this.regInvoicesForm = this.fb.group({
        id: 0,
        invoiceNo: this.fb.control('', Validators.required),
        fWithinIncluded: this.fb.control(false),
        invoiceValue: this.fb.control('', Validators.required),
        invoiceDate: this.fb.control(null, Validators.required),
        currency: this.fb.control('', Validators.required),
        itemDetails: this.fb.control([]),
        invoice: this.fb.control(''),
        InvApprovalNo: this.fb.control(''),
        supplierName: this.fb.control(''),
        supplierCountry: this.fb.control(''),
        InvoiceApprovalNo: this.fb.control('', Validators.required)
      });
    }
  }

  getApprovedInvoiceFormAsStarting(data) {

    if (data) {
      this.approvedItemListTable.tableBody=data.listApprovalItemDtos;
      debugger;
      //this.regApprovedInvoicesForm.patchValue({...data})
       this.regApprovedInvoicesForm.patchValue({
        id: data.id,
        invoiceNo:data.invoiceNo,
        invoiceValue: data.invoiceValue,
        invoiceDate: data.invoiceDate,
        supplierName: data.supplierName,
        currency:this.formData.currencies.filter(item => item.id === data.lkupCurrencyId).map(x => data.lkupCurrencyId = x.name[this.currentLang]),
        supplierCountry: this.formData.countries.filter(item => item.id === data.supplierCountryId).map(x => data.supplierCountryId = x.name[this.currentLang]),
        approvedItemDetails: data.listApprovalItemDtos ,
      })

this.regApprovedInvoicesForm.value.approvedItemDetails.push({...data.listApprovalItemDtos});
this.approvedItemListTable.tableBody=this.approvedItemDetails;
    } else {
      this.regApprovedInvoicesForm = this.fb.group({
        id: 0,
        invoiceNo: this.fb.control('', Validators.required),
        fWithinIncluded: this.fb.control(false),
        invoiceValue: this.fb.control('', Validators.required),
        invoiceDate: this.fb.control(null, Validators.required),
        currency: this.fb.control('', Validators.required),
        approvedItemDetails: this.fb.control([]),
        invoice: this.fb.control(''),
        supplierName: this.fb.control(''),
        supplierCountry: this.fb.control(''),

      });
    }
  }
  getApprovedItemFormAsStarting(data) {
    debugger;
    if (data) {
      this.regApprovedInvoicesForm.patchValue({
        id: data.id,
        invoiceNo:data.invoiceNo,
        invoiceValue: data.invoiceValue,
        invoiceDate: data.invoiceDate,
        supplierName: data.supplierName,
        currency:this.formData.currencies.filter(item => item.id === data.lkupCurrencyId).map(x => data.lkupCurrencyId = x.name[this.currentLang]),
        supplierCountry: this.formData.countries.filter(item => item.id === data.supplierCountryId).map(x => data.supplierCountryId = x.name[this.currentLang]),
        itemDetails: data.listApprovalItemDtos

      })
      this.approvedItemListTable.tableBody=data.listApprovalItemDtos
    } else {
      this.regApprovedInvoicesForm = this.fb.group({
        id: 0,
        invoiceNo: this.fb.control('', Validators.required),
        fWithinIncluded: this.fb.control(false),
        invoiceValue: this.fb.control('', Validators.required),
        invoiceDate: this.fb.control(null, Validators.required),
        currency: this.fb.control('', Validators.required),
        itemDetails: this.fb.control([]),
        invoice: this.fb.control(''),
        supplierName: this.fb.control(''),
        supplierCountry: this.fb.control(''),

      });
    }
  }


  getItemsFormAsStarting(data, fromWhere?: string) {
    if (data) {
      this.formData.itemTypeList.filter(item => item.id === data.ItemTypeId).map(x => this.itemType = x.name[this.currentLang]);
      this.formData.importReasonList.filter(item => item.id === data.importReason).map(x => this.importReason = x.name[this.currentLang]);
      this.formData.companies.filter(item => item.id === data.manufacturingCompany).map(x => data.manufacturingCompany = x.name[this.currentLang]);
      this.formData.countries.filter(item => item.id === data.manufacturingCountry).map(x => data.manufacturingCountry = x.name[this.currentLang]);
      this.formData.unitOfMeasure.filter(item => item.id === data.uom).map(x => data.uom = x.name[this.currentLang]);

      this.regItemsForm.patchValue({...data})
    } else {
      this.regItemsForm = this.fb.group({
        id: 0,
        ItemTypeId: this.fb.control(''),
        InvoiceItemName: this.fb.control(''),
        importReason: this.fb.control(''),
        NotificationNo: this.fb.control(''),
        shortName: this.fb.control(''),
        ProductEnglishName: this.fb.control('', Validators.required),
        manufacturingCompany: this.fb.control('', Validators.required),
        manufacturingCountry: this.fb.control('', Validators.required),
        batchNo: this.selectedReleaseTypeId !== 2 && this.importReason === 'PREMIX' ? this.fb.control('', Validators.required) : this.fb.control(''),
        quantity: this.fb.control('', Validators.required),
        uom: this.fb.control('', Validators.required),
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
        packingItemName: this.itemType === 'PACKING_MATERIALS' ? this.fb.control('') : this.fb.control(''),
        packagingTable: this.fb.control([]),
        detailsTable: this.fb.control([]),
        manufactureTable: this.fb.control([]),
      });
    }
  }

  getPackagingFormAsStarting(data) {
    if (data) {

    } else {
      this.regPackagingForProduct = this.fb.group({
        APPWORKS_GUID: null,
        APPWORKS_ID: null,
        volumesID: this.fb.control(''),
        uomId: this.fb.control(''),
        volumes: this.fb.control('', [Validators.required, Validators.pattern(/^\d*\.?\d*$/)]),
        unitOfMeasure: this.fb.control('', Validators.required),
        packingManufacturingCompany: this.fb.control('', Validators.required),
        packingManufacturingCountry: this.fb.control('', Validators.required),
        typeOfPackaging: this.fb.control('', Validators.required),
        packagingDescription: this.fb.control(''),
        isCartonBox: this.fb.control(''),
        colour: this.fb.control(''),
        fragrance: this.fb.control(''),
        flavor: this.fb.control(''),
        barCode: this.fb.control(''),
      });
    }
  }

  getDetailedFormAsStarting(data) {
    if (data) {

    } else {
      this.regDetailedForProduct = this.fb.group({
        APPWORKS_GUID: null,
        APPWORKS_ID: null,
        DetailsID: this.fb.control(''),
        PRODUCT_ID: this.fb.control(''),
        ingrediantDetails: this.fb.array([this.fb.group({
          APPWORKS_GUID: null,
          APPWORKS_ID: null,
          Ingredient_ID: this.fb.control(''),
          ingrediant: this.fb.control('', Validators.required),
          concentrations: this.fb.control('', [Validators.required, Validators.pattern(/^\d*\.?\d*$/)]),
          function: this.fb.control('', Validators.required),
        })])
      });
    }
  }

  saveData() {
    const data = this.adaptTheObjectToBE(this.regCustomReleaseForm.value, Number(this.serviceId), Number(this.serviceTypeId));

    this.getService.createProductRequest(data).subscribe(res => {
      if (res) {
        this.getFormAsStarting(res);
      }
    })
  }

  onSubmit() {
    const data = this.adaptTheObjectToBE(this.regCustomReleaseForm.value, Number(this.serviceId), Number(this.serviceTypeId));

    this.getService.submitRequest(data).subscribe(res => {
      console.log('res', res)
    })
  }

  async onSubmitInvoices(): Promise<any> {
    const data = this.regInvoicesForm.value;
    data.currency = await this.checkControllerValueWithListForFormArray(this.regInvoicesForm, this.formData?.currencies, 'currency', data.currency);

    if (this.regInvoicesForm.valid && this.regInvoicesForm.value.itemDetails.length) {
      if (!this.editInvoiceIndex && this.editInvoiceIndex !== 0) {
        this.regCustomReleaseForm.value.Invoices.push({...data});
      } else {
        this.regCustomReleaseForm.get('Invoices').value[this.editInvoiceIndex] = {
          ...this.regCustomReleaseForm.get('Invoices').value[this.editInvoiceIndex],
          ...data
        };

        this.editInvoiceRowStatus = false;
        this.editInvoiceIndex = '';
      }

      this.invoiceListTable.tableBody = this.regCustomReleaseForm.get('Invoices').value;

      this.getInvoicesFormAsStarting('', '');
      this.hideInvoiceContainer();
    } else {
      this.alertErrorNotificationStatus = true;
      this.alertErrorNotification = {msg: 'please complete the required values which marked with *'};
    }
  }

  async onSubmitItems(): Promise<any> {
    const data = {
      ...this.regItemsForm.value,
      ItemTypeId: this.itemType.name[this.currentLang],
      importReason: this.importReason.name[this.currentLang],
    };

   //  data.manufacturingCompany = await this.checkControllerValueWithListForFormArray(this.regItemsForm, this.formData?.companies, 'manufacturingCompany', data.manufacturingCompany);
   // data.manufacturingCountry = await this.checkControllerValueWithListForFormArray(this.regItemsForm, this.formData?.countries, 'manufacturingCountry', data.manufacturingCountry);
    data.uom = await this.checkControllerValueWithListForFormArray(this.regItemsForm, this.formData?.unitOfMeasure, 'uom', data.uom);
    data.premixName = await this.checkControllerValueWithListForFormArray(this.regItemsForm, this.formData?.premixNameList, 'premixName', data.premixName);
    data.ingredient = await this.checkControllerValueWithListForFormArray(this.regItemsForm, this.formData?.ingredient, 'ingredient', data.ingredient);
    data.function = await this.checkControllerValueWithListForFormArray(this.regItemsForm, this.formData?.function, 'function', data.function);
    data.rawMaterialName = await this.checkControllerValueWithListForFormArray(this.regItemsForm, this.formData?.rawMaterialList, 'rawMaterialName', data.rawMaterialName);
    data.sourceOfRawMaterialName = await this.checkControllerValueWithListForFormArray(this.regItemsForm, this.formData?.sourceOfRawMaterialList, 'sourceOfRawMaterialName', data.sourceOfRawMaterialName);
    data.packingItemName = await this.checkControllerValueWithListForFormArray(this.regItemsForm, this.formData?.packingMaterialList, 'packingItemName', data.packingItemName);


    if (this.regItemsForm.valid) {
      if (!this.editItemIndex && this.editItemIndex !== 0) {
        this.regInvoicesForm.value.itemDetails.push({...data});
      } else {
        this.regInvoicesForm.get('itemDetails').value[this.editItemIndex] = {
          ...this.regInvoicesForm.get('itemDetails').value[this.editItemIndex],
          ...data
        };
        this.editItemRowStatus = false;
        this.editItemIndex = '';
      }

      this.itemListTable.tableBody = this.regInvoicesForm.get('itemDetails').value;

      this.getItemsFormAsStarting('', '');
      this.hideItemContainer();
    } else {
      this.alertErrorNotificationStatus = true;
      this.alertErrorNotification = {msg: 'please complete the required values which marked with *'};
    }
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

  showInvoiceApprovalContainer(approvalNo)
  { debugger;
    this.getService.getRequestComments(approvalNo).subscribe((res: any) => {this.approvedInvoiceDetails=res; }, error => this.handleError(error));
    this.getApprovedInvoiceFormAsStarting(this.approvedInvoiceDetails);
    this.invoiceApprovalcontainerDisplayStatus = true;
  }
  showItemApprovalContainer(approvalNo)
  { debugger;
    this.getService.getRequestComments(approvalNo).subscribe((res: any) =>
     {this.approvedInvoiceDetails=res; }, error => this.handleError(error));
    this.getApprovedInvoiceFormAsStarting(this.approvedInvoiceDetails);
    this.invoiceApprovalcontainerDisplayStatus = true;
  }
  showItemContainer() {
    this.itemContainerDisplayStatus = true;
  }
  hideInvoiceApprovalContainer() {
    this.invoiceApprovalcontainerDisplayStatus = false;
   //this.getInvoicesFormAsStarting('')
  }
  hideItemApprovalContainer() {
    this.invoiceApprovalcontainerDisplayStatus = false;
   //this.getInvoicesFormAsStarting('')
  }
  async onSubmitApprovedInvoice()
  {    const data = this.regApprovedInvoicesForm.value;
    data.currency = await this.checkControllerValueWithListForFormArray(this.regApprovedInvoicesForm, this.formData?.currencies, 'currency', data.currency);

    if (this.regApprovedInvoicesForm.valid && this.regApprovedInvoicesForm.value.itemDetails.length) {
      if (!this.editInvoiceIndex && this.editInvoiceIndex !== 0) {
        this.regCustomReleaseForm.value.Invoices.push({...data});
      } else {
        this.regCustomReleaseForm.get('Invoices').value[this.editInvoiceIndex] = {
          ...this.regCustomReleaseForm.get('Invoices').value[this.editInvoiceIndex],
          ...data
        };

        this.editInvoiceRowStatus = false;
        this.editInvoiceIndex = '';
      }

      this.invoiceListTable.tableBody = this.regCustomReleaseForm.get('Invoices').value;

      this.getInvoicesFormAsStarting('', '');
      this.hideInvoiceApprovalContainer();
      this.hideInvoiceContainer();
    } else {
      this.alertErrorNotificationStatus = true;
      this.alertErrorNotification = {msg: 'please complete the required values which marked with *'};
    }
  }
  onSubmitApprovedItem()
  {}
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

    this.getItemsFormAsStarting(event.data);
  }

  deleteItem(i) {
    this.regInvoicesForm.get('itemDetails').value.splice(i, 1);

    this.itemListTable.tableBody = [];
    this.regInvoicesForm.get('itemDetails').value.map((x, i) => {
      this.itemListTable.tableBody = [...this.itemListTable.tableBody, x];
    });
  }

  editInvoice(event) {
    this.showInvoiceContainer();

    this.editInvoiceIndex = event.index;
    this.editInvoiceRowStatus = true;

    this.getInvoicesFormAsStarting(event.data);
  }

  deleteInvoice(i) {
    this.regInvoicesForm.get('itemDetails').value.splice(i, 1);

    this.itemListTable.tableBody = [];
    this.regInvoicesForm.get('itemDetails').value.map((x, i) => {
      this.itemListTable.tableBody = [...this.itemListTable.tableBody, x];
    });
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
/*   renderingTheItemAttachment(itemType, importReason) {
    debugger;
    this.ItemAttachmentFields = this.allItemTypeAttachmentFields[itemType.code].map(item => {
      if (item.requiredWithImportReasonCondition && item.relatedWithField.includes(importReason.code)) {
        item.required = false;
      } else if (item.requiredWithImportReasonCondition && !item.relatedWithField.includes(importReason.code)) {
        item.required = false;
      }

      if (item.enabledCondition && item.relatedWithField.includes(importReason.code)) {
        item.enable = true;
      } else if (item.enabledCondition && !item.relatedWithField.includes(importReason.code)) {
        item.enable = false;
      }

      return item;
    });
  } */
   renderingTheItemAttachment(itemType, importReason) {
    this.ItemAttachmentFields = this.allItemTypeAttachmentFields[itemType.code].map(item => {
      if (item.requiredWithImportReasonCondition && item.relatedWithField.includes(importReason.code)) {
        item.required = false;
      } else if (item.requiredWithImportReasonCondition && !item.relatedWithField.includes(importReason.code)) {
        item.required = false;
      }

      if (item.enabledCondition && item.relatedWithField.includes(importReason.code)) {
        if (item.id === 'coa') {
          if (this.selectedReleaseTypeId !== 2) {
            item.enable = true;
          } else {
            item.enable = false;
          }
        } else {
          item.enable = true
        }
      } else if (item.enabledCondition && !item.relatedWithField.includes(importReason.code)) {
        item.enable = false;
      }

      return item;
    });
  }

  applyProduct(notificationNumber) {

    this.isLoading = true;
    if (notificationNumber) {
      this.getService.getProductWithNotificationNumberList(notificationNumber).subscribe((res: any) => {
        if (res) {
          this.showDetailsTab = true;

          // if ingredientDetailsDto of productDetailsDto is object
          const detailsArray = res.productDetailsDto.map(item => {
            return {
              ...item,
              ingredientDetailsDto: item.ingredientDetailsDto ? [item.ingredientDetailsDto] : []
            }
          });

          this.regItemsForm.patchValue({
            shortName: res.shortName,
            ProductEnglishName: res.englishName,
            manufacturingCompany: res.manufacturingCompanyId,
            manufacturingCountry: res.manufacturingCountryId,
          });

          this.packagingListTable.tableBody = res.productVolumesDto;
          this.detailsListTable.tableBody = detailsArray;
          this.manufacturingListTable.tableBody=res.productManufactoyDtos;
        }
        this.isLoading = false;
      }, error => this.handleError(error));
    }
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
            map(state => state ? this.filterInsideList(whichLookup, state, list) : list.slice())
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

  adaptTheObjectToBE(data, servicesId?: number, servicesTypeId?: number): any {
    const myDate = new Date();

    data.Invoices = data.Invoices?.map(option => {
      option.currency = option.currency ? this.getIdFromLookupByName(this.formData.currencies, option.currency) : '';
      option.supplierName= data.supplierName ? data.supplierName : '';
      option.supplierCountry= data.supplierCountry ? this.getIdFromLookupByName(this.formData.countries, data.supplierCountry) : 0;
      option.invoiceValue = Number(option.invoiceValue)
      option.itemDetails = option.itemDetails?.map(item => {
        item.ItemTypeId = item.ItemTypeId ? this.getIdFromLookupByName(this.formData.itemTypeList, item.ItemTypeId) : '';
        item.importReason = item.importReason ? this.getIdFromLookupByName(this.formData.importReasonList, item.importReason) : '';
        item.manufacturingCompany = item.manufacturingCompany ? this.getIdFromLookupByName(this.formData.companies, item.manufacturingCompany) : '';
        item.manufacturingCountry = item.manufacturingCountry ? this.getIdFromLookupByName(this.formData.countries, item.manufacturingCountry) : '';
        item.uom = item.uom ? this.getIdFromLookupByName(this.formData.unitOfMeasure, item.uom) : '';
        item.premixName = item.premixName ? this.getIdFromLookupByName(this.formData.premixNameList, item.premixName) : '';
        item.ingredient = item.ingredient ? this.getIdFromLookupByName(this.formData.ingredient, item.ingredient) : '';
        item.function = item.function ? this.getIdFromLookupByName(this.formData.function, item.function) : '';
        item.rawMaterialName = item.rawMaterialName ? this.getIdFromLookupByName(this.formData.rawMaterialList, item.rawMaterialName) : '';
        item.packingItemName = item.packingItemName ? this.getIdFromLookupByName(this.formData.packingMaterialList, item.packingItemName) : '';

        item.quantity = Number(item.quantity);

        return item;
      })

      return option;
    });

    return {
      id: data.id ? data.id : 0,
      releaseTypeId: data.releaseTypeId ? this.getIdFromLookupByName(this.formData.releaseType, data.requestedReleaseType) : '',
      bolNo: data.bolNo ? data.bolNo : '',
      estimatedValue: data.estimatedValue ? data.estimatedValue : 0,
      FWithinIncluded: data.fWithinIncluded,
      applicant: this.companyId,
      LkupPortsId: data.LkupPortsId ? this.getIdFromLookupByName(this.formData.ports, data.LkupPortsId) : 0,
      pod: data.pod ? data.pod : '',
     // supplierName: data.supplierName ? data.supplierName : '',
      //supplierCountryId: data.supplierCountryId ? this.getIdFromLookupByName(this.formData.countries, data.supplierCountryId) : 0,
      carrierName: data.carrierName ? data.carrierName : '',
      grossWeight: data.grossWeight ? data.grossWeight : 0,
      LkupUomId: data.lkupUomId ? this.getIdFromLookupByName(this.formData.unitOfMeasure, data.lkupUomId) : 0,
      receiptNumber: data.receiptNumber ? data.receiptNumber : '',
      groupNumber: data.groupNumber ? data.groupNumber : '',
      receiptValue: data.receiptValue ? Number(data.receiptValue) : 0,
      LkupServicesId: data.lkupServicesId ? data.lkupServicesId : servicesId,
      LkupServiceTypeId: data.lkupServiceTypeId ? data.lkupServiceTypeId : servicesTypeId,
      SyslkupServiceActionId: 100,
      DueDate: data.dueDate ? data.dueDate : myDate,
      SubmissionDate: null,
      FComplete: data.FComplete ? data.FComplete : false,
      LkupTrackTypeId: data.lkupTrackTypeId ? data.lkupTrackTypeId : 0,
      LkupReqTypeId: data.LkupReqTypeId ? data.LkupReqTypeId : 0,
      SyslkupWfStatesId: 0,
      Invoices: data.Invoices && data.Invoices.length ? data.Invoices : [],
    };
  };

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

  ngOnDestroy() {
    if (this.subscription && !this.subscription.closed) {
      this.subscription.unsubscribe();
    }
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, this.modalOptions);
  }

  choosePackagingData(event: { index: number, data: any }) {
    this.regItemsForm.get('packagingTable').patchValue([event.data]);
  }

  chooseDetailsData(event: { index: number, data: any }) {
    this.regItemsForm.get('detailsTable').patchValue([event.data]);
  }

  chooseManufactureData(event: { index: number, data: any }) {
    this.regItemsForm.get('manufactureTable').patchValue([event.data]);
  }
}

export interface AttachemntObject {
  id: string;
  name: string;
  fileName: string;
  fileValue: string;
  required: boolean;
  enable: boolean;
  isCanBeAppealed?: boolean
  attachmentTypeStatus: string;
  loadingStatus: boolean;
}

export interface LookupState {
  code: string;
  description: { en: string, ar: string };
  id: number;
  name: { en: string, ar: string };
}
