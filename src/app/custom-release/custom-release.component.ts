import {ChangeDetectorRef, Component, OnDestroy, OnInit, QueryList, TemplateRef, ViewChild, ViewChildren} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {FormService} from '../services/form.service';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {DecimalPipe} from '@angular/common';
import {catchError, debounceTime, distinctUntilChanged, filter, map, startWith} from 'rxjs/operators';
import {Observable, Subscription} from 'rxjs';
import {MatAutocompleteTrigger} from '@angular/material/autocomplete';
import {TabsetComponent} from 'ngx-bootstrap/tabs';
import {InputService} from '../services/input.service';
import {BsModalRef, BsModalService, ModalOptions} from 'ngx-bootstrap/modal';
import {TranslateService} from "@ngx-translate/core";
import {CustomReleaseModel} from "../../utils/common-models";
import {cosmaticsReleaseModel, invoices, releaseItemDtos} from "./customRelease.model";
import { ViewReleaseCommentsComponent, ViewReleaseCommentsComponentDataDialog } from '../comments/view-release-comments/view-release-comments.component';
import { MatDialog } from '@angular/material/dialog';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { stringify } from 'querystring';

@Component({
  selector: 'app-custom-release',
  templateUrl: './custom-release.component.html',
  styleUrls: ['./custom-release.component.scss']
})
export class CustomReleaseComponent implements OnInit, OnDestroy {

  isLoading: boolean = false;
  cosmaticsReleaseModel ={} as cosmaticsReleaseModel
  invoiceModelList =[{}] as invoices[]
  releaseItemsList =[{}] as  releaseItemDtos[]
  invoiceModel ={} as invoices
  releaseItemDto ={} as  releaseItemDtos
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
 // RequestAttachments : AttachemntObject[]=[]
  InvoiceAttachments : AttachemntObject[]=[]
  ItemAttachments :    AttachemntObject[]=[]
  RequestAttachments:    AttachemntObject[] =[]
 /*   [
    { dbTableId:1,id: 'bolPolicy',name: 'BOL',fileName: '',fileValue: '',required: false,enable: true,attachmentTypeStatus: '',loadingStatus: false,},
    { dbTableId:10003,id: 'customReleaseRequest', name: 'Custom Release Request',fileName: '',fileValue: '',required: false,enable: true,attachmentTypeStatus: '',loadingStatus: false,},
    { dbTableId:3,id: 'receipt',name: 'Receipt',fileName: '', fileValue: '',required: false,enable: true, attachmentTypeStatus: '',loadingStatus: false,},  
 // { dbTableId:4,id: 'exportPledge', name: 'Export Pledge',fileName: '',fileValue: '',required: false,enable: true,attachmentTypeStatus: '',loadingStatus: false, },
    { dbTableId:5,id: 'importersRecord',  name: 'Importers Record',fileName: '',fileValue: '',required: false,enable: true,attachmentTypeStatus: '',loadingStatus: false,},
    { dbTableId:10002,id: 'other',name: 'Other',fileName: '',fileValue: '',required: false,enable: true,attachmentTypeStatus: '',loadingStatus: false,},
  ]; */
  InvoiceAttachmentFields: AttachemntObject[] = [
    {dbTableId:6, id: 'invoice',name: 'Invoice',fileName: '',fileValue: '',required: false,enable: true,attachmentTypeStatus: '',loadingStatus: false},
    {dbTableId:2,id: 'packingList',name: 'Packing List',fileName: '',fileValue: '',required: false,enable: true,attachmentTypeStatus: '',loadingStatus: false,},
    {dbTableId:7, id: 'InvApprovalNo',name: 'Invoice Importation Approval Number',fileName: '',fileValue: '',required: false,enable: true,attachmentTypeStatus: '',loadingStatus: false,}
  ];
 
  ItemAttachmentFields: AttachemntObject[] = [];
  fileStructure;
  attachmentRequiredStatus: boolean = false;
  invoiceListTable = {
    tableHeader: ['invoiceNo', 'invoiceDate', 'invoiceValue', 'Currency', 'Actions'],
    tableBody: []
  };
  itemListTable = {
    tableHeader: ['itemName','approvalNo','itemType', 'importReason', 'manufacturingCompany', 'quantity', 'batchNo', 'Actions'],
    tableBody: []
  };
  approvedItemList = {
    tableHeader: ['select','id','Item Name','ItemNameInInvoice','itemType', 'approvalNo','quantity','currentApprovedQty'],
    tableBody: []
  };
  detailsListTable = {
    tableHeader: ['select', 'colour', 'fragrance', 'flavor', 'barCode'],
    tableBody: []
  };
  manufacturingListTable = {
    tableHeader: ['select','manufactureCompany', 'manufactureCountry'],
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
  ProductTypeField:string='';
  typeOfRegistrationField;
  packingItemNameField;
  showNotificationNoStatus: boolean = false;
  notificationNo;
  editItemIndex;
  editItemRowStatus = false;
  customImportRelease: any = [];
  serviceId;
  parentRequestId:number;
  serviceAction:string;
  serviceTypeId;
  serviceTypeName;
  ServiceActionId;
  customReleaseEdited:boolean=false;
  customReleaseReplaced:boolean=false;

  OutofSpectializationServiceAttachmentFields: AttachemntObject[] = [
    {dbTableId:10004,
      id: 'MSDS',name: 'MSDS ',fileName: '',fileValue: '',required: false,enable: true,attachmentTypeStatus: '',loadingStatus: false,
    },
    {dbTableId:8,
      id: 'certificateOfOrigin',name: 'Certificate of origin ',fileName: '',fileValue: '',required: false,enable: true,attachmentTypeStatus: '',loadingStatus: false,
    },
    {dbTableId:10005,
      id: 'customsCertificate',name: 'customs certificate ',fileName: '',fileValue: '',required: false,enable: true,attachmentTypeStatus: '',loadingStatus: false,
    },
  ];
  PrivateUseServiceAttachmentFields: AttachemntObject[] = [
    {dbTableId:10006,
      id: 'customsInspection',name: 'customs Inspection ',fileName: '',fileValue: '',required: false,enable: true,attachmentTypeStatus: '',loadingStatus: false,
    },
    {dbTableId:8,
      id: 'certificateOfOrigin',name: 'Certificate of origin ',fileName: '',fileValue: '',required: false,enable: true,attachmentTypeStatus: '',loadingStatus: false,
    },
    {dbTableId:10007,
      id: 'useInsideFacility',name: 'use Inside Facility',fileName: '',fileValue: '',required: false,enable: true,attachmentTypeStatus: '',loadingStatus: false,
    },
  ];
  samplesServiceAttachmentFields: AttachemntObject[] = [
    
    {dbTableId:8,
      id: 'certificateOfOrigin',name: 'Certificate of origin ',fileName: '',fileValue: '',required: false,enable: true,attachmentTypeStatus: '',loadingStatus: false,
    }
  ];
  allItemTypeAttachmentFields = {
    PRODUCTS: [
      {
        id: 'certificateOfOrigin',name: 'Certificate Of Origin',fileName: '',fileValue: '',required: false,enable: false,enabledCondition: true,relatedWithField: ['FINISHED_PRDUCTS'],attachmentTypeStatus: '',loadingStatus: false,},
      {id: 'companyManufactureRelationship',name: 'Company Manufacture Relationship',fileName: '',fileValue: '',required: false,enable: false, enabledCondition: true,relatedWithField: ['FINISHED_PRDUCTS'],attachmentTypeStatus: '',loadingStatus: false,},

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
  showCommentsButton:boolean=false;
 
  constructor(private fb: FormBuilder,private number: DecimalPipe,private router: Router,private route: ActivatedRoute,
              private inputService: InputService,public translateService: TranslateService,private modalService: BsModalService,private getService: FormService, private dialog: MatDialog)           
  {   
      this.route.params.subscribe(res => {
      if (res.id) 
      {  
     
        this.getService.getRequestWithId(res.id).subscribe(request => {
          if(request)
          {  console.log('req55',request)
            this.showCommentsButton=true;
            this.invoiceListTable.tableBody=[];
            this.itemListTable.tableBody=[];
            this.serviceId=request.lkupServicesId;
            this.serviceTypeName=request.lkupServicesName;
            this.serviceTypeId=request.lkupServiceTypeId;
            this.SetAttachmentLists();
            this.setAttachmentValues(request);
            this.setInvoiceAttachmentValues(request);
            this.getFormAsStarting(request);
          }
        }) 
      }
      if(res.serviceId)
      {
        this.serviceId = res.serviceId;
        this.serviceTypeId = res.serviceTypeId;
        this.serviceTypeName =  res.serviceTypeName;} 
      });
      this.isServiceOfTypeSamples( this.serviceTypeName);
        this.getFormAsStarting('', '');
        this.getInvoicesFormAsStarting('', '');
        this.getItemsFormAsStarting('', '');
        this.getPackagingFormAsStarting('');
        this.getDetailedFormAsStarting('');
        this.getApprovedInvoiceFormAsStarting('');
        this.getApprovedItemFormAsStarting('');    
  }
  isSamplesService:boolean=false;
  isServiceOfTypeSamples(serviceName:string)
  {
    if(serviceName==='Samples' ||serviceName==='R&D Samples' ||serviceName==='Samples of Packing Materials')
    {
      this.isSamplesService=true;
    }

  }
  ngOnInit(): void {
    
    //Reem [Start] && edit and replace for lost
    this.route.queryParams.subscribe(params => {
    this.parentRequestId = params.parentRequestId;
    if(this.parentRequestId){
    this.customReleaseEdited=true;
    }
    this.serviceAction= params.serviceAction;
    if(this.serviceAction=='Edit'){
      this.ServiceActionId=2;
    }
  
    if(this.serviceAction=='Replace'){
      this.customReleaseReplaced=true;
      this.regCustomReleaseForm.disable();
      this.regInvoicesForm.disable();
      this.regItemsForm.disable();
      this.regApprovedInvoicesForm.disable();
      this.regApprovedItemsForm.disable();
      this.regPackagingForProduct.disable();
      this.ServiceActionId=3;
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
          {id: 'localFactory',name: 'Local factory'},
          {id: 'premixBatches',name: 'Premix Batches'}], 
    
        sourceOfRawMaterialList: [    
          {id: 'animal', name: 'Animal'},
          {id: 'vegetable', name: 'Vegetable'},
          {id: 'marain',name: 'Marain'},
          {id: 'chemical',name: 'Chemical'}, 
          {id: 'wool',name: 'Wool'}],
    
        packingMaterialList: [
          {id: 'animal',name: 'Animal'},
          {id: 'vegetable', name: 'Vegetable'}, 
          {id: 'marain', name: 'Marain'}, 
          {id: 'chemical',name: 'Chemical'},
          {id: 'wool',name: 'Wool'} ], 
        
        typeOfRegistrationList: [
          {id: 'notified',name: {en: 'Notified',ar: ''}},
          {id: 'oldRegistration',name: {en: 'Old Registration',ar: ''}},],
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
 
    this.regCustomReleaseForm.get('releaseTypeId').valueChanges.subscribe((res) => {
      this.selectedReleaseTypeId = this.getIdFromLookupByName(this.formData?.releaseType,res);
      this.renderingTheItemAttachment(this.itemType, this.importReason);
    });
    this.regCustomReleaseForm.get('lkupPortsId').valueChanges.subscribe((res) => {
      this.selectedPortId = this.getIdFromLookupByName( this.formData?.ports, res)}
      );
    
      this.SetAttachmentLists();
      this.setAllLookupsInObservable();
      this.route.params.subscribe(res => {
      if (res.id) 
      {  
        this.getService.getRequestWithId(res.id).subscribe(request => {
          if(request)
          {    
            console.log('req55',request)
            this.showCommentsButton=true;
            this.invoiceListTable.tableBody=[];
            this.itemListTable.tableBody=[];
            this.serviceId=request.lkupServicesId;
            this.serviceTypeName=request.lkupServicesName;
            this.serviceTypeId=request.lkupServiceTypeId;
            this.setAttachmentValues(request);
            this.setInvoiceAttachmentValues(request);
            this.getFormAsStarting(request);     
          }
        }) 
      }
      if(res.serviceId)
      {
        this.serviceId = res.serviceId;
        this.serviceTypeId = res.serviceTypeId;
        this.serviceTypeName =  res.serviceTypeName;} 
      });
      this.isServiceOfTypeSamples( this.serviceTypeName);
  }
 
 fillFormData()
 {       this.getService.getAllInvoiceItemTypes().subscribe((res: any) => {
  if (res) {
    this.formData.itemTypeList = res;
  }
}), error => this.handleError(error); }
  typeOfPackagingList:[any];
  selectedtypeOfPackagingId: number;
  setAllLookupsInObservable() {
   
    this.filteredOptionsForRawMaterialType = this.filterLookupsFunction('rowMaterialNameField', this.rowMaterialNameField, this.formData?.rawMaterialList);
    this.filteredOptionsForRequestedReleaseType = this.filterLookupsFunction('releaseType', this.regCustomReleaseForm.get('releaseTypeId'), this.formData?.releaseType);
    this.filteredOptionsForCustomPortName = this.filterLookupsFunction('ports', this.regCustomReleaseForm.get('lkupPortsId'), this.formData?.ports);
    this.filteredOptionsForSupplierCountry = this.filterLookupsFunction('countries', this.regCustomReleaseForm.get('supplierCountryId'), this.formData?.countries);
    this.filteredOptionsForMeasureUnitList = this.filterLookupsFunction('unitOfMeasure', this.regCustomReleaseForm.get('lkupUomId'), this.formData?.unitOfMeasure);
    this.filteredOptionsForCurrency = this.filterLookupsFunction('currencies', this.regInvoicesForm.get('currency'), this.formData?.currencies);
    this.filteredOptionsForManufacturingCountry = this.filterLookupsFunction('manufacturingCountry', this.regItemsForm.get('manufacturingCountry'), this.formData?.countries);
    this.filteredOptionsForPackingManufacturingCompany = this.filterLookupsFunction('PackingManufacturingCompany', this.regPackagingForProduct.get('PackingManufacturingCompany'), this.formData?.companies);
    this.filteredOptionsForPackingManufacturingCountry = this.filterLookupsFunction('PackingManufacturingCountry', this.regPackagingForProduct.get('PackingManufacturingCountry'), this.formData?.countries);
    this.filteredOptionsForIngredientList = this.filterLookupsFunction('ingredient', this.regItemsForm.get('ingredient'), this.formData?.ingredient);
    this.filteredOptionsForFunctionList = this.filterLookupsFunction('function', this.regItemsForm.get('function'), this.formData?.function);
    this.filteredOptionsForUOM = this.filterLookupsFunction('uom', this.regItemsForm.get('uom'), this.formData?.unitOfMeasure);
    this.getService.getPackingTypes().subscribe((res: any) => {this.typeOfPackagingList =res; }, error => this.handleError(error));  
    this.getService.getManufactureCompanies().subscribe((res: any) => {this.filteredOptionsForManufacturingCompany =res; }, error => this.handleError(error));  
    
  }

  SetAttachmentLists()
  {
    this.getService.GetAttachmentTypes(1,this.serviceId).subscribe(
      (res)=>{
        this.RequestAttachments=[];
        res.map(resultObj=>
        this.RequestAttachments.push ({
          id: resultObj.code,
          name: resultObj.name[this.currentLang],
          fileName: resultObj.name[this.currentLang],
          fileValue: '',
          required: resultObj.required,
          enable: true,
          isCanBeAppealed: true,
          attachmentTypeStatus: '',
          loadingStatus: false,
          dbTableId:resultObj.id,
        })
      )
     }, error => this.handleError(error)); 
   // this.getService.getLkupAttachByListId(2,this.serviceId).subscribe((res)=>{}, error => this.handleError(error));  
   // this.getService.getLkupAttachByListId(3,this.serviceId).subscribe((res)=>{}, error => this.handleError(error));   
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
  
    if(event.value ==undefined)
    {
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

  onFileSelect(event, fileControlName,attachmentList,listName) {
    debugger;
    let cardImageBase64;
    let resForSetAttachment;
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
              var reqId=0;
              switch(listName) { 
                case 'RequestAttachments': { 
                  reqId=this.regCustomReleaseForm.value.id;
                   break; 
                } 
                case 'InvoiceAttachmentFields': { 
                  reqId=this.regInvoicesForm.value.id;
                   break; 
                }
                case 'ItemAttachmentFields': { 
                  reqId=this.regItemsForm.value.id;
                   break; 
                } 
                default: { 
                  reqId=this.regCustomReleaseForm.value.id;
                   break; 
                } 
             }
              this.setAttachmentFileFunction(reqId, fileControlName, this.fileStructure.name, 0, res.target.result, attachmentValue,attachmentList,listName);
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

  setAttachmentFileFunction(requestId, FileID, FileName, id, base64Data, fileValue,attachmentList,ListName) {
  
    const dataForRequest = this.convertDataForAttachmentRequestBody(requestId, FileID, FileName, id, base64Data, fileValue);

   /*  this.RequestAttachments.filter(x => x.id === FileID).map(y => {
      y.loadingStatus = true;
    }); */

   // var n = base64Data.lastIndexOf(',');
    //var base64String = base64Data.substring(n + 1);
    var objtype=1;
    switch(ListName) { 
      case 'RequestAttachments': { 
        objtype=1;
         break; 
      } 
      case 'InvoiceAttachmentFields': { 
        objtype=2;
         break; 
      }
      case 'ItemAttachmentFields': { 
        objtype=3;
         break; 
      } 
      default: { 
        objtype=1;
         break; 
      } 
   }
    const uploadObj=
    {
      objectTypeId: objtype,
      objectId: requestId,
      lkupAttachmentsId: attachmentList.find(x => x.id === FileID).dbTableId,
      base64Data: base64Data
    }
    debugger;
      this.getService.uploadOnOpenText(uploadObj).subscribe((res: any) => {
      
      this.handleSuccess("uploaded Successfully");
      debugger;
      attachmentList.find(x => x.id === FileID).fileValue = res;
      switch(attachmentList) { 
        case 'RequestAttachments': { 
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

  /*   this.getService.setAttachmentFile(dataForRequest).subscribe((res: any) => {
      this.RequestAttachments.filter(x => x.id === FileID).map(y => {
        y.fileValue = res.ID;
        y.loadingStatus = false;
        this.regCustomReleaseForm.get(FileID).setValue(res.ID);
      });

      return res;
    }, error => this.handleError(error)); // */
  
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

  downloadFile(FileId,fileValue,attachmentList) {
debugger;
fileValue= attachmentList.find(x => x.id === FileId).fileValue ;

const fileName= attachmentList.find(x => x.id === FileId).fileName ;

this.getService.GetDocumentAsBase64(fileValue)
.subscribe((res: any) => {

const source = `data:application/pdf;base64,${res.base64data}`;
const link = document.createElement("a");
link.href = source;
link.download = `${fileName}`
link.click();
this.handleSuccess("Downloaded Successfully");}

)

  
 // this.convertFilesToPDF(res, FileId);

  /*   this.getService.getAttachmentFileByID(this.regCustomReleaseForm.value.id, FileId).subscribe((res: any) => {
      this.convertFilesToPDF(res.base64Data, FileId);
    }); */
  }

  convertFilesToPDF(base64Data, fileName) {
   

   /*  let obj = document.createElement('object');
    obj.style.width = '100%';
    obj.style.height = '842pt';
    obj.type = 'application/pdf';
    obj.data = 'data:application/pdf;base64,' + base64Data;

    var link = document.createElement('a');
    link.innerHTML = 'Download PDF file';
    link.download = `${fileName}`;
    link.className = 'pdfLink';
    link.href = 'data:application/pdf;base64,' + base64Data;

    link.click(); */


  }

  getDecimalValue(value, fromWhere) {
    this.regCustomReleaseForm.patchValue({
    //  receiptValue: this.number.transform(this.regCustomReleaseForm.get('receiptValue').value, '1.2-2')
    }, {emitEvent: false});
  }

  getFormAsStarting(data, fromWhere?: string) {
    
    if (data) {
console.log('formdata',this.formData)
      this.formData.releaseType.filter(item => item.id === data.releaseTypeId).map(x => data.releaseTypeId = x.name[this.currentLang]);
      this.formData.ports.filter(item => item.id === data.lkupPortsId).map(x => data.lkupPortsId = x.name[this.currentLang]);
      this.formData.unitOfMeasure.filter(item => item.id === data.lkupUomId).map(x => data.lkupUomId = x.name[this.currentLang]);
      data.fRefrencedCountry=data.fRefrencedCountry? 'referenced':'nonReferenced';
      data.invoices ? data.invoices.map(x => {
        x.currency=  this.formData.currencies.filter(option => option.id === x.lkupCurrencyId).map(item => x.lkupCurrencyId = item.name[this.currentLang]);
        x.supplierCountry=x.supplierCountryId //this.formData.countries.filter(option => option.id === x.supplierCountryId).map(item => x.supplierCountryId = item.name[this.currentLang]);
     
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
          this.itemListTable.tableBody=[];
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
    } 
    else {
      const myDate = new Date();

      this.regCustomReleaseForm = this.fb.group({
        id: 0,
        noOfItems:this.fb.control(''),
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
        ProductTypeField:this.fb.control(''),
        companyRolesId: null,
        lkupTrackTypeId: null,
        fComplete: false,
        syslkupWfStatesId: null,
        invoices: this.fb.control([]),
        BOLPOLICY: this.fb.control(''),
        RECEIPT: this.fb.control(''),
        exportPledge: this.fb.control(''),
        IMPORTERSRECORD: this.fb.control(''),
        CUSTOMRELEASEREQUEST:this.fb.control(''),
        OTHER:this.fb.control(''),
        fRefrencedCountry:this.fb.control(''),
      });
    }
  }
 
  getInvoicesFormAsStarting(data, fromWhere?: string) {
  
    if (data) {

   
      this.regInvoicesForm.patchValue({...data,
        currency:data.lkupCurrencyName,
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
        InvApprovalNo: this.fb.control(''),
        supplierName: this.fb.control(''),
        supplierCountry: this.fb.control(''),
        InvoiceApprovalNo: this.fb.control('', Validators.required),
        packingList: this.fb.control(''),
        noOfItems:this.fb.control(''),
      
      });
     // this.itemListTable.tableBody=[];
    }
  }


  getApprovedInvoiceFormAsStarting(data) {
    if (data) {
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

      this.selectedapproveditems=data.listApprovalItemDtos;
    } else {
      this.regApprovedInvoicesForm = this.fb.group({
        id: 0,
        invoiceNo: this.fb.control('', Validators.required),
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
   
    if (data) {
      this.regApprovedItemsForm.patchValue({
        id: data.id,
        approvedItemDetails: data.listApprovalItemDtos       
      
      })
      this.approvedItemList.tableBody=data.listApprovalItemDtos
    } else {
      this.regApprovedItemsForm = this.fb.group({
        id: 0,
        approvedItemDetails: this.fb.control([]),
      
      });
    }
  }


  getItemsFormAsStarting(data, fromWhere?: string) {
 
    if (data) {
  
   
      this.formData.itemTypeList.filter(item => item.id === data.ItemTypeId).map(x => this.itemType = x.name[this.currentLang]);
      this.formData.importReasonList.filter(item => item.id === data.importReason).map(x => this.importReason = x.name[this.currentLang]);
     // this.formData.companies.filter(item => item.id === data.manufacturingCompany).map(x => data.manufacturingCompany = x.name[this.currentLang]);
     // this.formData.countries.filter(item => item.id === data.manufacturingCountry).map(x => data.manufacturingCountry = x.name[this.currentLang]);
      this.formData.unitOfMeasure.filter(item => item.id === data.uom).map(x => data.uom = x.name[this.currentLang]);
    
      this.regItemsForm.patchValue({...data,
        shortName:data.itemCosmProductDto.productShortname,
        ProductEnglishName:data.itemCosmProductDto.productName,
        batchNo:data.itemCosmProductDto.batchNo,
        uom: this.formData.unitOfMeasure.filter(item => item.id === data.lkupUomId).map(x => data.lkupUomId = x.name[this.currentLang]),
      })
      this.typeOfRegistrationField=data.fRegisteredProduct?'notified':'oldRegistration';
      this.regPackagingForProduct.patchValue({...data.itemCosmProductDto,
      uomId: this.formData.unitOfMeasure.filter(item => item.id === data.itemCosmProductDto.lkupUomId).map(x => data.itemCosmProductDto.lkupUomId = x.name[this.currentLang]),
      volumes:data.itemCosmProductDto.volume,
      packagingDescription: data.itemCosmProductDto.packingDescription,
      isCartonBox: data.itemCosmProductDto.fCartonbox,
      colour: data.itemCosmProductDto.productColour,
      packingManufacturingCompany: this.filteredOptionsForManufacturingCompany.filter(item => item.id === data.itemCosmProductDto.lkupManufactoryId).map(x => data.itemCosmProductDto.lkupManufactoryId = x.manufactory),
      packingManufacturingCountry: this.formData.countries.filter(item => item.id === data.lkupCountryId).map(x => data.lkupCountryId = x.name[this.currentLang]),
      typeOfPackaging:this.typeOfPackagingList.filter(item => item.id === data.itemCosmProductDto.lkupPackingTypeId).map(x => data.itemCosmProductDto.lkupPackingTypeId = x.packingType),
      })
   
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
        packingList: this.itemType === 'PREMIX' ? this.fb.control('') : this.fb.control(''),
        approvalItemNo:this.fb.control(''),
        unitPrice: this.fb.control('', Validators.required),
        MSDS : this.fb.control(''),
        customsCertificate: this.fb.control(''),
        customsInspection: this.fb.control(''),
        useInsideFacility: this.fb.control(''),
        foc: this.fb.control('', Validators.required),
        workingStandard: this.fb.control('', Validators.required),
        
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
       // barCode: this.fb.control(''),
      });
    }
  }

  getDetailedFormAsStarting(data) {
    if (data) {} else {
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

  

  async onSubmitInvoices(): Promise<any> {

    const data = this.regInvoicesForm.value;
    this.createInvoiceModel(this.regApprovedInvoicesForm.value);

   // data.currency = await this.checkControllerValueWithListForFormArray(this.regInvoicesForm, this.formData?.currencies, 'currency', data.currency);

   // if (this.regInvoicesForm.valid && this.regInvoicesForm.value.itemDetails.length) {
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
   // }
  /*   else {
      this.alertErrorNotificationStatus = true;
      this.alertErrorNotification = {msg: 'please complete the required values which marked with *'};
    } */
  }
  
  createInvoiceModel(invoiceFormData)
  {
      this.invoiceModel.id=invoiceFormData.id ? invoiceFormData.id : 0;
      this.invoiceModel.bolId=invoiceFormData.id ? invoiceFormData.id : 0;
      this.invoiceModel.lkupCurrencyId=this.getIdFromLookupByName(this.formData.currencies, invoiceFormData.currency)?this.getIdFromLookupByName(this.formData.currencies, invoiceFormData.currency):null;
      this.invoiceModel.invoiceNo=invoiceFormData.invoiceNo ? invoiceFormData.invoiceNo : '';
      this.invoiceModel.fWithinIncluded=invoiceFormData.fWithinIncluded ? invoiceFormData.fWithinIncluded : false;
      this.invoiceModel.invoiceValue= Number(invoiceFormData.invoiceValue)  ;
      this.invoiceModel.invoiceDate=invoiceFormData.invoiceDate ? invoiceFormData.invoiceDate : null;
      this.invoiceModel.approvalInvoiceNo=invoiceFormData.InvoiceApprovalNo ?invoiceFormData.InvoiceApprovalNo   : '';
      this.invoiceModel.supplierName=invoiceFormData.supplierName ?invoiceFormData.supplierName : '';
      this.invoiceModel.supplierCountryId=invoiceFormData.supplierCountry ? this.getIdFromLookupByName(this.formData.countries, invoiceFormData.supplierCountry) : null;
      this.invoiceModel.noOfItems=0;
      this.invoiceModel.releaseItemDtos=this.releaseItemsList;
      this.invoiceModelList.push( this.invoiceModel);
 
}
  async onSubmitItems(): Promise<any> {
  
    const data = {
      ...this.regItemsForm.value,
      ...this.regPackagingForProduct.value,
      ...this.regDetailedForProduct.value,
      ItemTypeId:this.itemType? this.itemType.name[this.currentLang]: 1,
      importReason:this.importReason? this.importReason.name[this.currentLang]:0,
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
  //  }
     /* else {
      this.alertErrorNotificationStatus = true;
      this.alertErrorNotification = {msg: 'please complete the required values which marked with *'};
    } */
    this.createItemDto(this.regItemsForm.value,this.regPackagingForProduct.value,this.regDetailedForProduct.value)
    this.releaseItemsList.push(this.releaseItemDto)

  }
  createItemDto(itemForm , packingForm,detailsForm)
  {
   
    this.releaseItemDto.approvalItemNo=''
    this.releaseItemDto.fConformity=false;
    this.releaseItemDto.fRegisteredProduct=this.typeOfRegistrationField==='oldRegistration'?true:false;
    this.releaseItemDto.foc=0;
    this.releaseItemDto.id=itemForm.id
    this.releaseItemDto.itemName=itemForm.shortName
    this.releaseItemDto.itemPrice=0
    this.releaseItemDto.itemTypeId=itemForm.ItemTypeId ? this.getIdFromLookupByName(this.formData.itemTypeList, itemForm.ItemTypeId) : null;
    this.releaseItemDto.lkupConformityCommentsId=null;
    this.releaseItemDto.lkupCountryId=itemForm.manufacturingCountry ? this.getIdFromLookupByName(this.formData.countries, itemForm.manufacturingCountry) : null;
    this.releaseItemDto.lkupCurrencyId=null
    this.releaseItemDto.lkupUomId=itemForm.uom ? this.getIdFromLookupByName(this.formData.unitOfMeasure, itemForm.uom) : null,
    this.releaseItemDto.quantity=Number(itemForm.quantity);
    this.releaseItemDto.workingStandard=null;
    this.releaseItemDto.itemPremixDto=null;
    this.releaseItemDto.itemCosmPackDto=
    {  id: 0,batchNo: itemForm.batchNo? itemForm.batchNo :'',
       lkupPackingId:itemForm.typeOfPackaging ? this.getIdFromPackingTypeByName(this.typeOfPackagingList,itemForm.typeOfPackaging):null,
       lkupManufactoryId:  packingForm.packingManufacturingCompany ? ! isNaN(itemForm.manufacturingCompany)? packingForm.packingManufacturingCompany :this.getIdFromLookupByName(this.formData.companies, itemForm.manufacturingCompany):null ,
    };
    this.releaseItemDto.itemCosmProductDto=
    {
      id: 0,
      productId: 0,
      notificationNo: this.notificationNo,
      productName:itemForm.ProductEnglishName?itemForm.ProductEnglishName:'',
      productShortname: itemForm.shortName? itemForm.shortName:'',
      flagType: '',
      lkupManufactoryId:  packingForm.packingManufacturingCompany ? ! isNaN(itemForm.manufacturingCompany)? packingForm.packingManufacturingCompany :this.getIdFromLookupByName(this.formData.companies, itemForm.manufacturingCompany):null ,
      batchNo: itemForm.batchNo? itemForm.batchNo :'',
      volume: packingForm.volumes?packingForm.volumes:'' ,
      lkupUomId:  packingForm.uomId ? this.getIdFromLookupByName(this.formData.unitOfMeasure, packingForm.uomId) : '',
      packingDescription: packingForm.packagingDescription?packingForm.packagingDescription:'',
      lkupPackingTypeId:packingForm.typeOfPackaging ?this.getIdFromPackingTypeByName(this.typeOfPackagingList, packingForm.typeOfPackaging) : null ,
      fCartonbox: packingForm.isCartonBox?packingForm.isCartonBox:false,
      productColour: packingForm.colour?packingForm.colour:'',
      fragrance: packingForm.fragrance ?packingForm.fragrance:'',
      flavor: packingForm.flavor?packingForm.flavor:'',
      barcode:'',
      productIngredientDtos:[]
    }
    
    this.releaseItemDto.itemRawMaterialDto= 
    {
      id: 0,
      ingredientsId: itemForm.approvalItemRawDto?itemForm.approvalItemRawDto.approvalItemId:null,
      cosingRefNo:  itemForm.approvalItemRawDto?itemForm.approvalItemRawDto.cosingRefNo:'',
      inciName: itemForm.approvalItemRawDto?itemForm.approvalItemRawDto.inciName:'',
      lkupManufactoryId: itemForm.approvalItemRawDto?itemForm.approvalItemRawDto.lkupManufactoryId:null,
      manufacturingCompany: itemForm.approvalItemRawDto?itemForm.approvalItemRawDto.manufacturingCompany:null,
      sourceRawMaterialId: itemForm.approvalItemRawDto?itemForm.approvalItemRawDto.lkupRawMaterialsId:null,
    };
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
  {
    this.getService.GetApprovalInvoice(approvalNo,this.serviceId).subscribe(
      res => 
      {if(res)
        { 
          
          this.approvedInvoiceDetails=res;  
          this.approvedItemList.tableBody=res.listApprovalItemDtos;
          this.getApprovedInvoiceFormAsStarting(this.approvedInvoiceDetails); 
          this.invoiceApprovalcontainerDisplayStatus = true;
        }  
     }, error => this.handleError(error)); 
  }

  showItemApprovalContainer(approvalNo)
  { 
    this.getService.GetApprovalInvoice(approvalNo ,this.serviceId).subscribe(
      res => 
      {if(res)
        { 
         
          this.approvedInvoiceDetails=res;  
          this.approvedItemList.tableBody=res.listApprovalItemDtos;
          this.getApprovedItemFormAsStarting(this.approvedInvoiceDetails); 
          this.itemApprovalcontainerDisplayStatus = true;
        }
     }, error => this.handleError(error) );  
  }
  showItemContainer() {
    this.itemContainerDisplayStatus = true;
  }
  hideInvoiceApprovalContainer() {
    this.invoiceApprovalcontainerDisplayStatus = false;
  }
  hideItemApprovalContainer() {
    this.itemApprovalcontainerDisplayStatus = false;
  }
  async onSubmitApprovedInvoice() : Promise<any>
 
  { 
  
    const data = this.regApprovedInvoicesForm.value;
  
    this.regInvoicesForm.patchValue({
      id: 0,
      invoiceNo: data.invoiceNo,
      fWithinIncluded: this.fb.control(false),
      invoiceValue: data.invoiceValue,
      invoiceDate: data.invoiceDate,
      currency:data.currency,
     // currency:this.formData.currencies.filter(item => item.id === data.currency).map(x => data.currency = x.name[this.currentLang]),
     releaseItemDtos:this.selectedapproveditems,
      invoice: data.invoice,
      supplierName: data.supplierName,
      supplierCountry: data.supplierCountry,
    });
    this.itemListTable.tableBody = this.selectedapproveditems;
   /*  this.regCustomReleaseForm.get('Invoices').value.map((x, i) => {
      this.itemListTable.tableBody = [...data.approvedItemDetails, x];
    }); */
      this.hideInvoiceApprovalContainer();  
  }

 async onSubmitApprovedItem(): Promise<any>
  {const data = this.regApprovedItemsForm.value;
    
    this.regInvoicesForm.patchValue({
      id: 0,
      invoiceNo: data.invoiceNo,
      fWithinIncluded: this.fb.control(false),
      invoiceValue: data.invoiceValue,
      invoiceDate: data.invoiceDate,
      currency: data.currency,
      releaseItemDtos:this.selectedapproveditems,
      invoice: data.invoice,
      supplierName: data.supplierName,
      supplierCountry: data.supplierCountry,
    });
     // this.itemListTable.tableBody = this.regApprovedItemsForm.get('approvedItemDetails').value;
      this.itemListTable.tableBody = this.selectedapproveditems;
      this.hideItemApprovalContainer(); 
      this.hideItemContainer(); }


  hideInvoiceContainer() {
    this.invoiceContainerDisplayStatus = false;

   this.getInvoicesFormAsStarting('')
  }

  hideItemContainer() {
    this.itemContainerDisplayStatus = false;
    this.getItemsFormAsStarting('')
  }
  previouslyApprovedItem :boolean=false;
  editItem(event) {

    this.showItemContainer();
    this.editItemIndex = event.index;
    this.editItemRowStatus = true;
    this.getItemsFormAsStarting(event.item);

    if(event.item.approvalItemNo){
      this.previouslyApprovedItem=true;
    } 
    
  }
  getBatchValue(event)
  {
   this.regInvoicesForm.get('releaseItemDtos').value[event.index].batchNo=event.value;
  }
  uploadCOA(event)
  {
  this.setAttachmentFileFunction(event.value?.id, 'coa', event.fileStructure, event.value?.id,event.targetResult, event.value?.coa?event.value.coa:0,this.ItemAttachmentFields,'ItemAttachmentFields')
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
 /*   renderingTheItemAttachment(itemType, importReason) {
 
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
  }  */
    renderingTheItemAttachment(itemType, importReason) {
      //sara temp start
      itemType=itemType?itemType:{id:1,code:'PRODUCTS'}
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
  saveNewRequest()
   {
     //this.createcosmaticsReleaseModel(this.regCustomReleaseForm.value, Number(this.serviceId), Number(this.serviceTypeId))

    const data = this.adaptTheObjectToBE(this.regCustomReleaseForm.value, Number(this.serviceId), Number(this.serviceTypeId));
 
    this.removeUnUsedProperties(data)

   this.getService.createProductRequest(data).subscribe(res => {
    
    //  this.getService.createProductRequest(this.cosmaticsReleaseModel).subscribe(res => {
        this.regCustomReleaseForm.reset();
        this.regInvoicesForm.reset();
        this.regItemsForm.reset();
        this.regApprovedInvoicesForm.reset();
        this.regApprovedItemsForm.reset();
        this.handleSuccess('Request has been saved Successfully');
        this.isLoading = false;
        if (res) 
        {  
          this.getService.getRequestWithId(res).subscribe(request => {
            if(request)
            {    
              this.showCommentsButton=true;
              this.invoiceListTable.tableBody=[];
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
    this.alertSuccessNotification = { msg: donemsg };
    this.isLoading = false;
  }
removeUnUsedProperties(data)
{ 
  if(data.invoices)
  {data.invoices.map(Option=>
    { delete Option.InvApprovalNo;
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
        delete item. opentextId;
        delete item.ItemTypeId;

    })
  })
    
  }
}
 createcosmaticsReleaseModel(data , servicesId?: number, servicesTypeId?: number)
{
  this.cosmaticsReleaseModel.id=data.id ? data.id : 0,
  this.cosmaticsReleaseModel.releaseTypeId=Number(this.selectedReleaseTypeId);
  this.cosmaticsReleaseModel.bolNo=data.bolNo ? data.bolNo : '',
  this.cosmaticsReleaseModel.estimatedValue=data.estimatedValue ? data.estimatedValue : 0,
  this.cosmaticsReleaseModel.fWithinIncluded=data.fWithinIncluded?data.fWithinIncluded:false;
  this.cosmaticsReleaseModel.lkupPortsId=data.lkupPortsId ? this.getIdFromLookupByName(this.formData.ports, data.lkupPortsId) : null,
  this.cosmaticsReleaseModel.pod=data.pod ? data.pod : '',
  this.cosmaticsReleaseModel.grossWeight=data.grossWeight ? Number(data.grossWeight)  : 0,
  this.cosmaticsReleaseModel.lkupUomId=data.lkupUomId ? this.getIdFromLookupByName(this.formData.unitOfMeasure, data.lkupUomId) : null,
  this.cosmaticsReleaseModel.receiptNumber=data.receiptNumber ? data.receiptNumber : '',
  this.cosmaticsReleaseModel.groupNumber=data.groupNumber ? data.groupNumber : '',
  this.cosmaticsReleaseModel.receiptValue=data.receiptValue ? Number(data.receiptValue) : 0,
  this.cosmaticsReleaseModel.lkupServicesId=data.lkupServicesId ? data.lkupServicesId : servicesId,
  this.cosmaticsReleaseModel.lkupServiceTypeId=data.lkupServiceTypeId ? data.lkupServiceTypeId : servicesTypeId,
  this.cosmaticsReleaseModel.syslkupServiceActionId=1;
  this.cosmaticsReleaseModel.lkupTrackTypeId=null;
  this.cosmaticsReleaseModel.importerLicenseNo=data.importerLicenseNo?data.importerLicenseNo:'' ,
  this.cosmaticsReleaseModel.fRefrencedCountry=true;
  this.cosmaticsReleaseModel.customCertificate=data.customCertificate?data.customCertificate:'' ,
  this.cosmaticsReleaseModel.noOfItems=0;
  this.cosmaticsReleaseModel.invoices= this.invoiceModelList

} 
  adaptTheObjectToBE(data, servicesId?: number, servicesTypeId?: number): any {
    debugger;
      data.invoiceDtos = data.invoices?.map(option => {
      option.id= option.id ? option.id : 0,
      option.bolId=data.id
      option.lkupCurrencyId = option.currency ? this.getIdFromLookupByName(this.formData.currencies, option.currency) : '';
      option.fWithinIncluded= option.fWithinIncluded ? data.fWithinIncluded : false;
    
      option.supplierName= option.supplierName ? option.supplierName : '';
      option.supplierCountryId= option.supplierCountry ? this.getIdFromLookupByName(this.formData.countries, option.supplierCountry) : null;
      option.invoiceValue = Number(option.invoiceValue)
      option.invoiceDate=option.invoiceDate?option.invoiceDate:null;
      option.invoiceNo=option.invoiceNo ? option.invoiceNo:'';
      option.approvalInvoiceNo=option.InvoiceApprovalNo ? option.InvoiceApprovalNo:'';
      option.noOfItems=Number(option.noOfItems),
      option.releaseItemDtos = option.releaseItemDtos?.map(item => {
        item.id=item.approvalItemNo?0:item.id;
        item.invoicesId=option.id;
        item.fRegisteredProduct=this.ProductTypeField ==='referenced' ? true:false;
        item.lkupCountryId = item.manufacturingCountry ? this.getIdFromLookupByName(this.formData.countries, item.manufacturingCountry) : null;
        item.lkupUomId=  item.uom ? this.getIdFromLookupByName(this.formData.unitOfMeasure, item.uom) : null,
        item.itemName=item.shortName?item.shortName:'';
        item.quantity = Number(item.quantity);
        item.fConformity=item.lkupConformityCommentsId;
        item.lkupConformityCommentsId=item.lkupConformityCommentsId?item.lkupConformityCommentsId:null;
        item.itemTypeId = item.ItemTypeId ? this.getIdFromLookupByName(this.formData.itemTypeList, item.ItemTypeId) : 1;
        item.foc= Number(item.foc) ;
        item.workingStandard=Number(item.workingStandard);
        debugger;
        item.itemCosmPackDto=
        { id: 0,
           lkupPackingId:item.typeOfPackaging ? this.getIdFromPackingTypeByName(this.typeOfPackagingList,item.typeOfPackaging):null,
           lkupManufactoryId:  item.manufacturingCompany ? ! isNaN(item.manufacturingCompany)? item.manufacturingCompany :this.getIdFromLookupByName(this.formData.companies, item.manufacturingCompany):null ,
           batchNo: item.batchNo? item.batchNo :''
        }
        item.itemCosmProductDto={
          id: 0,
          productId: 0,
          notificationNo: this.notificationNo,
          productName:item.ProductEnglishName?item.ProductEnglishName:'',
          productShortname: item.shortName? item.shortName:'',
          flagType: '',
          lkupManufactoryId:  item.manufacturingCompany ? ! isNaN(item.manufacturingCompany)? item.manufacturingCompany :this.getIdFromLookupByName(this.formData.companies, item.manufacturingCompany):null ,
          batchNo: item.batchNo? item.batchNo :'',
          volume: item.volumes?item.volumes:'' ,
          lkupUomId:  item.uom ? this.getIdFromLookupByName(this.formData.unitOfMeasure, item.uom) : '',
          packingDescription: item.packagingDescription?item.packagingDescription:'',
          lkupPackingTypeId:item.typeOfPackaging ?this.getIdFromPackingTypeByName(this.typeOfPackagingList, item.typeOfPackaging) : null ,
          fCartonbox: item.isCartonBox?item.isCartonBox:false,
          productColour: item.colour?item.colour:'',
          fragrance: item.fragrance ?item.fragrance:'',
          flavor: item.flavor?item.flavor:'',
          barcode:'',
          productIngredientDtos:[]
        }
   /*      item.itemPremixDto={
          id: 0,
        //  invoiceItemId:0,
          premixBatchesId: 0,
          lkupManufactoryId: null,
          sourceRawMaterialId: item.approvalItemRawDto?item.approvalItemRawDto.lkupRawMaterialsId:null
        }; */
        item.itemPremixDto=null,
        item.itemRawMaterialDto={
          id: 0,
          ingredientsId: item.approvalItemRawDto?item.approvalItemRawDto.approvalItemId:null,
          cosingRefNo:  item.approvalItemRawDto?item.approvalItemRawDto.cosingRefNo:'',
          inciName: item.approvalItemRawDto?item.approvalItemRawDto.inciName:'',
          lkupManufactoryId: item.approvalItemRawDto?item.approvalItemRawDto.lkupManufactoryId:null,
          manufacturingCompany: item.approvalItemRawDto?item.approvalItemRawDto.manufacturingCompany:null,
          sourceRawMaterialId: item.approvalItemRawDto?item.approvalItemRawDto.lkupRawMaterialsId:null,
        }
        item.uomId = item.uomId ? this.getIdFromLookupByName(this.formData.unitOfMeasure, item.uom) :null;
        return item;
      })

      return option;
    });

    return {
      id: data.id ? data.id : 0,
      customCertificate:data.customCertificate?data.customCertificate:'' ,
      noOfItems:Number(data.noOfItems),
      importerLicenseNo:'',
      LkupServiceTypeId: data.lkupServiceTypeId ? data.lkupServiceTypeId : servicesTypeId,
      LkupServicesId: data.lkupServicesId ? data.lkupServicesId : servicesId,
      SyslkupServiceActionId: 1,
      releaseTypeId:this.selectedReleaseTypeId?Number(this.selectedReleaseTypeId):1,
      receiptNumber: data.receiptNumber ? data.receiptNumber : '',
      receiptValue: data.receiptValue ? Number(data.receiptValue) : 0,
      groupNumber: data.groupNumber ? data.groupNumber : '',
      estimatedValue: data.estimatedValue ? data.estimatedValue : 0,
      bolNo: data.bolNo ? data.bolNo : '',
      FWithinIncluded: data.fWithinIncluded, 
      lkupPortsId: data.lkupPortsId ? this.getIdFromLookupByName(this.formData.ports, data.lkupPortsId) : null,
      pod: data.pod ? data.pod : '',
      grossWeight: data.grossWeight ? Number(data.grossWeight)  : 0,
      LkupUomId: data.lkupUomId ? this.getIdFromLookupByName(this.formData.unitOfMeasure, data.lkupUomId) : null,
      lkupTrackTypeId:null,
      fRefrencedCountry:this.ProductTypeField ==='referenced' ? true:false,
      invoices: data.invoices && data.invoices.length ? data.invoices : [],

    };
   
  };
 
  selectedapproveditems:any[]=[];
  
  onselectApprovedItem(approvedItem)
  {
    this.selectedapproveditems.push(approvedItem);
  }
  onSubmitForm()
  
  {
    switch(this.ServiceActionId) { 
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
    if (this.regCustomReleaseForm.valid && this.regCustomReleaseForm.value.invoices.length>0 && this.regItemsForm.valid  ){

      const data = this.adaptTheObjectToBE(this.regCustomReleaseForm.value, Number(this.serviceId), Number(this.serviceTypeId));
      this.removeUnUsedProperties(data)
      this.getService.submitRequest(data).subscribe(res => {
        if (res) {  
        if(res.code==200)
        {        this.handleSuccess("Request has been saved Successfully");
        this.regCustomReleaseForm.reset();
        this.regInvoicesForm.reset();
        this.regItemsForm.reset();
        this.regApprovedInvoicesForm.reset();
        this.regApprovedItemsForm.reset();
        this.router.navigate([`/pages/cosmetics-product/inner/release-services/6/12`]);}else{this.handleError(res.message);}

        }
      } ,(error) => { this.handleError(error);})
    }
    else{
           this.SubmitErrorValidationHandling()
        }
  
  }
  SubmitErrorValidationHandling()
  {
    if(this.regCustomReleaseForm.value.invoices.length===0 ){ this.handleError('Please enter at least 1 invoice on the request'); }
    if(this.regCustomReleaseForm.value.invoices.length===0 ){ this.handleError('Please enter at least 1 invoice on the request'); }
    debugger;
    console.log('requestErrors',this.regCustomReleaseForm.errors)
    console.log('InvocieErrors',this.regInvoicesForm.errors)
    console.log('ItemErrors',this.regItemsForm.errors)
   

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
  /* chooseManufactureData(event: { index: number, data: any }) {
    this.regItemsForm.get('manufactureTable').patchValue([event.data]);
  } */
  chooseManufactureData(event) {
    this.regItemsForm.get('manufactureTable').patchValue([event]);
  }
  chooseApprovedItem(event: { index: number, data: any }) {
    this.regApprovedInvoicesForm.get('approvedItemDetails').patchValue([event.data]);
  }
  viewReleseComment() {
    this.dialog.open<ViewReleaseCommentsComponent, ViewReleaseCommentsComponentDataDialog>(ViewReleaseCommentsComponent, {
      width: '80%',
      data: { requestId: /*this.serviceId ||*/ 40442 },
    });
  }
  // Within Included[Start]
  withinIncludedBols: any[] = [];
  checkedIncludedBol: any = {};
  withinIncludedInvoices:any[]=[];
  IncludedInvoices: any[] = [];
  checkedIncludedInvoice:any={};
  includedInvoiceSelected: boolean = false;
  includedBolSelected: boolean = false;
  showIncludedBols(event: MatCheckboxChange): void {
    if (event.checked) {
      this.includedBolSelected = true;
      this.getService.getWithinIncludedBols().subscribe((res) => {
        this.withinIncludedBols = res;
  
      });
     
    } else {
      this.includedBolSelected= false;
    }
  }
  checkIncludedBol(bolNo: string) {
  
    if (this.includedBolSelected == true) {
      this.getService.getBillOfLading(bolNo).subscribe((res) => {
        this.checkedIncludedBol= res;
       this.getBolsFormAsStarting(this.checkedIncludedBol);
      
      });
      this.getService.getWithinIncludedInvoices(bolNo).subscribe((res) => {
        this.IncludedInvoices = res;
      
      });
    }}
 
  showIncludedInvoices(event: MatCheckboxChange){
    if (event.checked) {
     this.includedInvoiceSelected = true;
      this.withinIncludedInvoices=this.IncludedInvoices;
      
    }
    else{
      this.includedInvoiceSelected= false;
    }
 
  }
  showInvoiceDetails(InvoiceNo: string){
    if( this.includedInvoiceSelected==true){
      this.getService.getInvoiceByInvoiceNo(InvoiceNo).subscribe((res) => {
        this.checkedIncludedInvoice= res;
        this.getInvoicesFormAsStarting(this.checkedIncludedInvoice);
   
      });
    }
  }
  getBolsFormAsStarting(data, fromWhere?: string){
    if (data) {
      this.regCustomReleaseForm.patchValue({
        id: 0,
        releaseTypeId:data.releaseTypeId,
        receiptNumber:data.receiptNumber,
        groupNumber:data.groupNumber,
        receiptValue:data.receiptValue,
        applicant:data.applicant,
        lkupPortsId:data.lkupPortsId,
        pod:data.pod,
        grossWeight:data.grossWeight,
        lkupUomId:data.lkupUomId
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
        other:this.fb.control(''),
      });
   
    }
  }
  // within Included [End]
  // REEM-read only fields if item added by approval number -21-4-2022 [start]
   
     onEditApprovedItem(data){
      this.regItemsForm = this.fb.group({
      id:0,
      shortName:data.itemName,
      ProductEnglishName:data.syslkupItemTypeName,
      sourceOfRawMaterial:data.sourceOfRawMaterialAttach,
      quantity:data.quantity,
      uom:data.uom
      })
  }
 // REEM-read only fields if item added by approval number -21-4-2022  [End]
 resetForms()
 {
  this.regCustomReleaseForm.reset();
  this.regInvoicesForm.reset();
  this.regItemsForm.reset();
  this.regApprovedInvoicesForm.reset();
  this.regApprovedItemsForm.reset();
  this.setAllLookupsInObservable();

 }
 //Reem Get attachemnt Key [Start]
 setAttachmentValues(request){
  this.RequestAttachments.find(x=>x.id=='BOLPOLICY').fileValue=request.bolPolicy?request.bolPolicy.opentextId:'';
  this.RequestAttachments.find(x=>x.id=='CUSTOMRELEASEREQUEST').fileValue=request.customReleaseRequest?request.customReleaseRequest.opentextId:'';
  this.RequestAttachments.find(x=>x.id=='RECEIPT').fileValue=request.receipt?request.receipt.opentextId:'';
  this.RequestAttachments.find(x=>x.id=='IMPORTERSRECORD').fileValue=request.importersRecord?request.importersRecord.opentextId:'';
  this.RequestAttachments.find(x=>x.id=='OTHER').fileValue=request.other?request.other.opentextId:'';

 }

 setInvoiceAttachmentValues(request){
  this.InvoiceAttachmentFields.find(x=>x.id=='invoice').fileValue=request.invoices.map((o)=> o.invoice? o.invoice.opentextId:'');
  this.InvoiceAttachmentFields.find(x=>x.id=='InvApprovalNo').fileValue=request.invoices.map( (o)=> o.importationApprovalNumber? o.importationApprovalNumber.opentextId:'');
  this.InvoiceAttachmentFields.find(x=>x.id=='packingList').fileValue=request.invoices.map( (o)=> o.packingList?o.packingList.opentextId:'');
}
setItemAttachmentValues(request){
  this.ItemAttachmentFields.find(x=>x.id=='certificateOfOrigin').fileValue=request.invoices.map((o)=> o.releaseItemDtos.map((x)=>x.certificateOfOrigin?x.certificateOfOrigin.opentextId:''));
  this.ItemAttachmentFields.find(x=>x.id=='companyManufactureRelationship').fileValue=request.invoices.map((o)=> o.releaseItemDtos.map((x)=>x.companyManufactureRelationship?x.companyManufactureRelationship.opentextId:''));
  this.ItemAttachmentFields.find(x=>x.id=='coa').fileValue=request.invoices.map((o)=> o.releaseItemDtos.map((x)=>x.coa?x.coa.opentextId:''));
  this.ItemAttachmentFields.find(x=>x.id=='legalizedHealthCertificate').fileValue=request.invoices.map((o)=> o.releaseItemDtos.map((x)=>x.legalizedHealthCertificate?x.legalizedHealthCertificate.opentextId:''));
  console.log('ItemAttachmentFields',this.ItemAttachmentFields);
 }
  //Reem Get attachemnt Key [End]

  //Reem Replace for Lost 5-8-2022 [Start]
  replacementReportIssueSites=[
    {id:1,name: 'Company'},{id:2,name:'Eda'}]
  replacementCustomReleaseForm=new FormGroup({
    replacementReportNo:new FormControl(),
    replacementReportIssueSite:new FormControl(),
    replacementReportDate:new FormControl()
  });

  saveReplaceRequest(){
    debugger;
    const data= {
      lostReplacementReportNo: this.replacementCustomReleaseForm.value.replacementReportNo?this.replacementCustomReleaseForm.value.replacementReportNo: 0,
      lostReplacementReportIssueSite:this.replacementCustomReleaseForm.value.replacementReportIssueSite?this.replacementCustomReleaseForm.value.replacementReportIssueSite:'' ,
      lostReplacementReportDate:this.replacementCustomReleaseForm.value.replacementReportDate?this.replacementCustomReleaseForm.value.replacementReportDate:'',
      requestId:this.parentRequestId
    }

    this.getService.replaceForLost(data).subscribe(res => {
      if(res){
      this.replacementCustomReleaseForm.reset();
      this.regCustomReleaseForm.reset();
      this.regInvoicesForm.reset();
      this.regItemsForm.reset();
      this.regApprovedInvoicesForm.reset();
      this.regApprovedItemsForm.reset();
      this.handleSuccess('Request has been saved Successfully');
      
      this.isLoading = false;
    }},  (error) => {
      this.isLoading = false;
      this.handleError(error);
    }
    );
    
  }
  

    saveData()
   { 
    switch(this.ServiceActionId) { 
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
  onSubmitReplaceRequest(){
    const data= {
      lostReplacementReportNo: this.replacementCustomReleaseForm.value.replacementReportNo?this.replacementCustomReleaseForm.value.replacementReportNo: 0,
      lostReplacementReportIssueSite:this.replacementCustomReleaseForm.value.replacementReportIssueSite?this.replacementCustomReleaseForm.value.replacementReportIssueSite:'' ,
      lostReplacementReportDate:this.replacementCustomReleaseForm.value.replacementReportDate?this.replacementCustomReleaseForm.value.replacementReportDate:'',
      requestId:this.parentRequestId
    }
    this.getService.replaceForLost(data).subscribe(res => {
      if(res){
      this.replacementCustomReleaseForm.reset();
      this.regCustomReleaseForm.reset();
      this.regInvoicesForm.reset();
      this.regItemsForm.reset();
      this.regApprovedInvoicesForm.reset();
      this.regApprovedItemsForm.reset();
      this.handleSuccess('Request has been saved Successfully');
      this.isLoading = false;
    }},  (error) => {
      this.isLoading = false;
      this.handleError(error);
    }
    );
    
  }
  //Reem Validation on Invoice date [Start]
  curr_year :number= (new Date()).getFullYear();
  curr_date:number = (new Date()).getDate();
  curr_month:number =(new Date()) .getMonth();
  maxDate= new Date(this.curr_year ,(this.curr_month),(this.curr_date));
  minDate=new Date(this.curr_year-1 ,(this.curr_month),(this.curr_date));
  //Reem Validation on Invoice date [End]
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
  dbTableId:number;
}


export interface LookupState {
  code: string;
  description: { en: string, ar: string };
  id: number;
  name: { en: string, ar: string };
}