import {
  Component,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {FormService} from '../../../services/form.service';
import {ActivatedRoute, Router} from '@angular/router';
import {DatePipe, DecimalPipe} from '@angular/common';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  startWith,
} from 'rxjs/operators';
import {Observable, Subscription} from 'rxjs';
import {MatAutocompleteTrigger} from '@angular/material/autocomplete';
import {TabsetComponent} from 'ngx-bootstrap/tabs';
import {InputService} from '../../../services/input.service';
import {BsModalRef, BsModalService, ModalOptions} from 'ngx-bootstrap/modal';
import {TranslateService} from '@ngx-translate/core';
import {
  CustomReleaseModel,
  LookupState,
} from '../../../../utils/common-models';
import {EventEmitter} from '@angular/core';
import {connectableObservableDescriptor} from 'rxjs/internal/observable/ConnectableObservable';

@Component({
  selector: 'app-cosmatic-importation',
  templateUrl: './cosmatic-importation.component.html',
  styleUrls: ['./cosmatic-importation.component.scss'],
})
export class CosmaticImportationComponent implements OnInit, OnDestroy {
  ViewDownload: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('formTabs', {static: false}) formTabs: TabsetComponent;
  @ViewChild('invoicesTabs', {static: false}) invoicesTabs: TabsetComponent;
  @ViewChild('itemsStepsTabs', {static: false})
  itemsStepsTabs: TabsetComponent;
  isLoading: boolean = false;
  editInvoiceIndex: any;
  editItemIndex: any;
  alertErrorNotificationStatus: boolean;
  alertSuccessNotificationStatus: boolean;
  attachmentRequiredStatus: boolean;
  approvaInvoice: boolean = false;
  approvalItem: boolean = false;
  invoiceContainerDisplayStatus: boolean;
  disableItemTypeField: boolean;
  itemContainerDisplayStatus: boolean;
  ChoosedRegisterType: any;
  ShowOldRegister: boolean;
  ShowNotified: boolean;
  IsDrafted: boolean;
  ShowDetails: boolean;
  selectedItem: any;
  alertSuccessNotification: any = {};
  alertErrorNotification: any = {};
  RegisterImportation: any = {};
  neededapprovalItemProductDto: any = {};
  activeTabIndex: any;
  ChoosedItemType: any;
  serviceTypeName: any;
  SetInvoiceIDAfterSave: any;
  selectedcurrency: any;
  serviceId: any;
  notificationNo: any;
  serviceTypeId: any;
  ChoosedCurrency: any;
  SelectedneededInvoiceType: any;
  InvoiceTypeID: any;
  FetchedSavedApprovalID: any;
  SetSelectedItemType: any;
  DraftserviceID: any;
  SelectedItem: any;
  SelectedItemID: any;
  SelectedRegisterationType: any;

  currentLang = this.translateService.currentLang
    ? this.translateService.currentLang
    : 'en';
  registerRequestForm: FormGroup;
  registerInvoiceForm: FormGroup;
  registerItemsForm: FormGroup;
  ProductDetails: FormGroup;
  PackagingDataForm: FormGroup;
  IngredientsDataForm: FormGroup;
  ManufacturingDataForm: FormGroup;
  ParsedInvoiceData = [];
  AllCurrencies = [];
  ItemTypeList = [];
  RegisterationType = [];
  AllCompanies = [];
  AllAttachments = [];
  RequestAttachments = [];
  ItemTypes = [];
  InvoiceAttachments = [];
  ItemAttachments = [];
  UnitOfMeasurements = [];
  ManufacturingData = [];
  IngredientsData = [];
  ingredientDtos = [];
  selected_invoice_type: any;
  selectedsuppliername: any;
  ManufacturingCompany: any;
  selectedItemTypeId: any;
  SetSelectedUOM: any;
  oldProdSelect: any;
  fileStructure: any;
  invoiceListTable = {
    tableHeader: [
      'invoiceNo',
      'invoiceDate',
      'invoiceValue',
      'Currency',
      'Actions',
    ],
    tableBody: [],
  };
  detailsListTable = {
    tableHeader: ['colour', 'fragrance', 'flavor'],
    tableBody: [],
  };
  packagingListTable = {
    tableHeader: ['choose', 'volumes', 'unitOfMeasure', 'typeOfPackaging'],
    tableBody: [],
  };
  manufacturingListTable = {
    tableHeader: ['manufactureCompany', 'manufactureCountry'],
    tableBody: [],
  };
  itemListTable = {
    /*  tableHeader: ['itemType', 'manufacturingCompany', 'quantity', 'Actions'], */

    tableHeader: ['itemName', 'itemType', 'quantity', 'notificationNumber', 'Actions'],
    tableBody: [],
  };

  FetchedAttachmentID: any;

  constructor(
    private apiService: FormService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    public translateService: TranslateService,
    private inputService: InputService
  ) {
    this.productTypeList = [
      {id: 'referenced', name: {en: 'Referenced', ar: 'مرجعي'}},
      {
        id: 'nonReferenced',
        name: {en: 'NoN Referenced', ar: 'غير مرجعي'},
      },
    ]
    this.route.params.subscribe((res) => {
      this.serviceId = res.serviceId;
      this.IsDrafted = true;
      if (res.id) {
        this.DraftserviceID = res.id;
        this.GetRequestDataAfterSave(res.id);
        // this.SetRegisterRequestFormValues(res);
      }
      if (this.serviceId == undefined) {
        //sara 12-5 [Start]
        /*     this.IsDrafted = true;
        if (res.id) {
          this.DraftserviceID = res.id;
          this.GetRequestDataAfterSave(res.id);
          // this.SetRegisterRequestFormValues(res);
        } */
        //   //sara 12-5 [End]
      } else {
        this.serviceId = res.serviceId;
        this.serviceTypeId = res.serviceTypeId;
        this.serviceTypeName = ' ' + res.serviceTypeName;
      }
      this.serviceTypeId = res.serviceTypeId;
    });
    this.GetAllAttachments();
    this.GetAllUnitOfMeasure();
  }

  productTypeList = [];
  sourceOfRawMaterialList = [];

  ngOnInit(): void {
    this.sourceOfRawMaterialList = [
      {id: 10001, name: 'Animal'},
      {id: 10003, name: 'Vegetable'},
      {id: 10002, name: 'Marain'},
      {id: 10004, name: 'Chemical'},
      {id: 1, name: 'Wool'},
    ];

    this.productTypeList = [
      {id: 'referenced', name: {en: 'Referenced', ar: 'مرجعي'}},
      {
        id: 'nonReferenced',
        name: {en: 'NoN Referenced', ar: 'غير مرجعي'},
      },
    ]
    //sara 11-5-2022 [start]
    this.setAllLookupsInObservable();
    this.inputService
      .getInput$()
      .pipe(
        filter((x) => x.type === 'allLookups'),
        distinctUntilChanged()
      )
      .subscribe((res) => {
        this.formData = {
          ...res.payload,
          premixNameList: [
            {id: 'localFactory', name: 'Local factory'},
            {id: 'premixBatches', name: 'Premix Batches'},
          ],

          packingMaterialList: [
            {id: 10001, name: 'Animal'},
            {id: 10003, name: 'Vegetable'},
            {id: 10002, name: 'Marain'},
            {id: 10004, name: 'Chemical'},
            {id: 1, name: 'Wool'},
          ],

          typeOfRegistrationList: [
            {id: 'notified', name: {en: 'Notified', ar: ''}},
            {id: 'oldRegistration', name: {en: 'Old Registration', ar: ''}},
          ],
          productTypeList: [
            {id: 'referenced', name: {en: 'Referenced', ar: 'مرجعي'}},
            {
              id: 'nonReferenced',
              name: {en: 'NoN Referenced', ar: 'غير مرجعي'},
            },
          ],
        };
        this.isLoading = false;
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
    //sara 11-5-2022 [End]
    this.ItemTypes = [
      {
        id: 1,
        name: 'Proforma',
      },
      {id: 2, name: 'Commercial'},
    ];

    this.RegisterationType = [
      {id: false, name: 'Old Registeration'},
      {id: true, name: 'Notified'},
    ];

    this.registerRequestForm = this.formBuilder.group({
      importerLicenseNo: [null, Validators.required],
      receiptNumber: [null, Validators.required],
      receiptValue: [null, Validators.required],
      groupNumber: [null, Validators.required],
      estimatedValue: [0, Validators.required],
      fRefrencedCountry: [null]
    });

    this.registerInvoiceForm = this.formBuilder.group({
      invoiceNo: [null, Validators.required],
      invoicetype: [null, Validators.required],
      noofitems: [null, Validators.required],
      invoiceValue: [null, Validators.required],
      invoiceDate: [null, Validators.required],
      lkupCurrencyName: [null, Validators.required],
      supplierName: [null, Validators.required],
      supplierCountryName: [null, Validators.required],
    });

    this.ProductDetails = this.formBuilder.group({
      notificationNumber: [null, Validators.required],
      itemType: [null, Validators.required],
      registerType: [null, Validators.required],
      notificationNo: [null, Validators.required],
      rowMaterialNameField: this.formBuilder.control(''),
      sourceOfRowMaterialField: this.formBuilder.control(''),
      premixName: this.formBuilder.control(''),
      premixBatch: this.formBuilder.control(''),
    });

    this.registerItemsForm = this.formBuilder.group({
      shortName: [null, Validators.required],
      ProductEnglishName: [null, Validators.required],
      quantity: [null, Validators.required],
      uom: [null, Validators.required],
      InvoiceItemName: [null, Validators.required],
      //Sara 16-5 [start]
      unitPrice: [null, Validators.required],
      batchNo: [null, Validators.required],
      storageSite: [null],
      ManufacturingCompany: [null],
      ManufacturingCountry: [null],
      registrationExpireDate: [null],
      //Sara 16-5 [End]
    });

    this.PackagingDataForm = this.formBuilder.group({
      volumes: [null, Validators.required],
      unitOfMeasure: [null, Validators.required],
      typeOfPackaging: [null, Validators.required],
      packDescription: [null, Validators.required],
      colour: this.formBuilder.control(''),
      fragrance: this.formBuilder.control(''),
      flavor: this.formBuilder.control(''),
      packingManufacturingCompany: this.formBuilder.control(''),
      PackingManufacturingCountry: this.formBuilder.control(''),
      // packingManufacturingCompany: this.formBuilder.control(''),
      // packingManufacturingCountry: this.formBuilder.control(''),
    });
    this.IngredientsDataForm = this.formBuilder.group({});
    this.ManufacturingDataForm = this.formBuilder.group({});
    this.filteredOptionsForManufacturingCountry = this.filterLookupsFunction('manufacturingCountry', this.registerItemsForm.get('ManufacturingCountry'), this.formData?.countries);
    this.filteredOptionsForManufacturingCountry = this.filterLookupsFunction('manufacturingCountry', this.PackagingDataForm.get('PackingManufacturingCountry'), this.formData?.countries);

    //  this.apiService.getManufactureCompanies().subscribe((res: any) => {this.filteredOptionsForManufacturingCompany =res; }, error => this.handleError(error));
    this.setItemTypeBasedOnSelectedService(this.serviceId)
    this.GetAllItemTypes();
    this.GetAllUnitOfMeasure();
    this.GetAllPackingData();
    this.GetAllIngredients();
  }

  setItemTypeBasedOnSelectedService(serviceId: number) {

    switch (serviceId) {
      case 1:
        this.SelectedItemTypeId = 1;
        break;
      case 2:
        this.SelectedItemTypeId = 3;
        break;
      case 3:
        this.SelectedItemTypeId = 3;
        break;
      case 4:
        this.SelectedItemTypeId = 4;
        break;
      case 5:
        this.SelectedItemTypeId = 2;
        break;
    }

  }

  ngOnDestroy(): void {
    if (this.IsSubmitted) {
      this.handleSuccess('Done submit approval request');
    }
  }

  //here is the function needed to set the choosed register type
  HideAttachment: boolean;
  HideGetProductButn: boolean;

  SetRegisterType(e) {
    if (this.ProductDetails.controls.registerType.value == true) {
      this.ShowNotified = true;
      this.ShowOldRegister = false;
      // this.HideAttachment = true;
      // this.HideGetProductButn = false;
    } else {
      // this.HideAttachment = false;
      this.ShowOldRegister = true;
      this.ShowNotified = false;
      // this.HideGetProductButn = true;
    }
  }

  EditSetRegisterType(e) {
    this.ChoosedRegisterType = e;
    if (this.ChoosedRegisterType == true) {
      this.ShowNotified = true;
      this.ShowOldRegister = false;
      this.HideAttachment = true;
      this.HideGetProductButn = false;
    } else {
      this.HideAttachment = false;
      this.ShowOldRegister = true;
      this.ShowNotified = false;
      this.HideGetProductButn = true;
    }
  }

  //here is the function needed to set the choosed invoice type
  SetInvoiceType(e) {
    this.SelectedneededInvoiceType = JSON.parse(e.value);
    this.InvoiceTypeID = this.SelectedneededInvoiceType.id;
  }

  //here is the function needed to get all needed packing types
  PackTypes = [];

  GetAllPackTypes() {
    this.apiService.getPackingTypes().subscribe(
      (data) => {
        this.PackTypes = data;
      },
      (error) => {
        this.handleError(error);
      }
    );
  }

  //here is the function needed to disabaled the item type based on the selected service
  SetSelectedData(event) {
    this.SetSelectedItemType = JSON.parse(event.value);
    let selectedid = this.SetSelectedItemType.id;
    if (this.serviceId == '1' && selectedid == 1) {
      this.SelectedItem = this.SetSelectedItemType.name.en;
      this.SelectedItemID = this.SetSelectedItemType.id;
      this.ProductDetails.controls['itemType'].disable();
    } else if (this.serviceId == '2') {
      this.SelectedItem = this.SetSelectedItemType.name.en;
      this.SelectedItemID = this.SetSelectedItemType.id;
      this.ProductDetails.controls['itemType'].disable();
    } else if (this.serviceId == '3') {
      this.SelectedItem = this.SetSelectedItemType.name.en;
      this.SelectedItemID = this.SetSelectedItemType.id;
      this.ProductDetails.controls['itemType'].disable();
    }
  }

  //here is the function needed to browse file uploader to upload files
  objctTypeId: any;
  objectId: any;
  base64Data: any;
  neededBase64Data: any;
  FinalneededBase64Data: any;
  lkupAttachmentsId: any;

  onFileSelect(event, fileControlName) {
    let cardImageBase64;
    let resForSetAttachment;
    let attachmentValue;

    //first case ,  handle send attachment for registered request
    if (this.approvaInvoice == false && this.approvalItem == false) {
      if (
        this.RequestAttachments.filter((x) => x.loadingStatus === true)
          .length === 0
      ) {
        if (event.target.files.length > 0) {
          if (
            event.target.files[0].type === 'application/pdf' &&
            event.target.files[0].size <= 5000000
          ) {
            this.RequestAttachments.filter((x) => x.id === fileControlName).map(
              (y) => {
                y.fileName = event.target.value.split(/(\\|\/)/g).pop();
                attachmentValue = y.fileValue;
              }
            );

            this.RequestAttachments.filter((x) => x.id === fileControlName).map(
              (file) => {
                file.attachmentTypeStatus = 'Yes';
              }
            );
            this.fileStructure = event.target.files[0];
            const reader = new FileReader();

            reader.readAsDataURL(this.fileStructure);
            reader.onload = (res: any) => {
              this.base64Data = res.target.result;
              this.neededBase64Data = this.base64Data.split(',')[1];
              this.FinalneededBase64Data = this.neededBase64Data;
              if (this.FetchedSavedApprovalID == null) {
                this.handleError('Please save the request first');
              } else {
                //here is the first case , while sending the attachment for the request not use invoice or item
                if (
                  this.approvaInvoice == false &&
                  this.approvalItem == false
                ) {
                  this.objctTypeId = 1;
                  this.objectId = this.FetchedSavedApprovalID;
                  this.lkupAttachmentsId = fileControlName;
                  this.ViewDownload.subscribe((val) => {
                    this.lkupAttachmentsId = fileControlName;
                  });
                  // this.base64Data =
                  const dataForRequest = {
                    objectId: this.FetchedSavedApprovalID,
                    objectTypeId: this.objctTypeId,
                    lkupAttachmentsId: this.lkupAttachmentsId,
                    base64Data: this.FinalneededBase64Data,
                  };
                  this.SendAttachment(dataForRequest);
                }
              }
            };
          } else {
            this.RequestAttachments.filter((x) => x.id === fileControlName).map(
              (file) => {
                file.attachmentTypeStatus = 'No';
                file.loadingStatus = false;
              }
            );
          }
        }
      }
    }

    //second case , handle send attachment for added invoice
    else if (this.approvaInvoice == true) {
      if (
        this.InvoiceAttachments.filter((x) => x.loadingStatus === true)
          .length === 0
      ) {
        if (event.target.files.length > 0) {
          if (
            event.target.files[0].type === 'application/pdf' &&
            event.target.files[0].size <= 5000000
          ) {
            this.InvoiceAttachments.filter((x) => x.id === fileControlName).map(
              (y) => {
                y.fileName = event.target.value.split(/(\\|\/)/g).pop();
                attachmentValue = y.fileValue;
              }
            );

            this.InvoiceAttachments.filter((x) => x.id === fileControlName).map(
              (file) => {
                file.attachmentTypeStatus = 'Yes';
              }
            );
            this.fileStructure = event.target.files[0];
            const reader = new FileReader();

            reader.readAsDataURL(this.fileStructure);
            reader.onload = (res: any) => {
              this.base64Data = res.target.result;
              this.neededBase64Data = this.base64Data.split(',')[1];
              this.FinalneededBase64Data = this.neededBase64Data;
              if (this.FetchedSavedApprovalID == null) {
                this.handleError('Please save the request first');
              } else {
                this.objctTypeId = 4;
                this.objectId = this.SetInvoiceIDAfterSave;
                this.lkupAttachmentsId = fileControlName;
                const dataForRequest = {
                  objectId: this.SetInvoiceIDAfterSave,
                  objectTypeId: this.objctTypeId,
                  lkupAttachmentsId: this.lkupAttachmentsId,
                  base64Data: this.FinalneededBase64Data,
                };
                this.SendAttachment(dataForRequest);
              }
            };
          } else {
            this.InvoiceAttachments.filter((x) => x.id === fileControlName).map(
              (file) => {
                file.attachmentTypeStatus = 'No';
                file.loadingStatus = false;
              }
            );
          }
        }
      }
    }

    //third case , handle attachment for selected item
    else if (this.approvalItem == true) {
      if (
        this.ItemAttachments.filter((x) => x.loadingStatus === true).length ===
        0
      ) {
        if (event.target.files.length > 0) {
          if (
            event.target.files[0].type === 'application/pdf' &&
            event.target.files[0].size <= 5000000
          ) {
            this.ItemAttachments.filter((x) => x.id === fileControlName).map(
              (y) => {
                y.fileName = event.target.value.split(/(\\|\/)/g).pop();
                attachmentValue = y.fileValue;
              }
            );

            this.ItemAttachments.filter((x) => x.id === fileControlName).map(
              (file) => {
                file.attachmentTypeStatus = 'Yes';
              }
            );
            this.fileStructure = event.target.files[0];
            const reader = new FileReader();

            reader.readAsDataURL(this.fileStructure);
            reader.onload = (res: any) => {
              this.base64Data = res.target.result;
              this.neededBase64Data = this.base64Data.split(',')[1];
              this.FinalneededBase64Data = this.neededBase64Data;
              if (this.FetchedSavedApprovalID == null) {
                this.handleError('Please save the request first');
              } else {
                this.objctTypeId = 5;
                this.objectId = this.SetInvoiceIDAfterSave;
                this.lkupAttachmentsId = fileControlName;
                const dataForRequest = {
                  objectId: this.SetInvoiceIDAfterSave,
                  objectTypeId: this.objctTypeId,
                  lkupAttachmentsId: this.lkupAttachmentsId,
                  base64Data: this.FinalneededBase64Data,
                };
                this.SendAttachment(dataForRequest);
              }
            };
          } else {
            this.ItemAttachments.filter((x) => x.id === fileControlName).map(
              (file) => {
                file.attachmentTypeStatus = 'No';
                file.loadingStatus = false;
              }
            );
          }
        }
      }
    }
  }

  ManucaturingCompany: any;
  ManufactureID: any;

  chooseManufactureData(event) {
    this.ManufactureID = event.packingRow.manufactoryId;
    this.ManucaturingCompany = event.packingRow.manufactoryName;
  }

  //here is the function needed to get all needed measuring unit
  PackgingList = [];

  GetAllPackingData() {
    this.apiService.getAllPackagingList().subscribe(
      (data) => {
        this.PackgingList = data;
      },
      (error) => {
        this.handleError(error);
      }
    );
  }

  //here is the function needed to fetch all currencies
  GetAllCurrencies() {
    this.apiService.getSharedCurrencies().subscribe(
      (data) => {
        this.AllCurrencies = data;
      },
      (error) => {
        this.handleError(error);
      }
    );
  }

  AllIngredients: any = [];

  GetAllIngredients() {
    this.apiService.getAllIngredient().subscribe(
      (data) => {
        this.AllIngredients = data;
      },
      (error) => {
        this.handleError(error);
      }
    );
  }

  //here is the function needed to fetch all item types
  GetAllItemTypes() {
    this.apiService.getAllInvoiceItemTypes().subscribe(
      (data) => {
        this.ItemTypeList = data;
      },
      (error) => {
        this.handleError(error);
      }
    );
  }

  //here is the function needed to fetch all Exproting companies
  GetAllExportingComapnies() {
    this.apiService.getSharedCountries().subscribe(
      (data) => {
        this.AllCompanies = data;
      },
      (error) => {
        this.handleError(error);
      }
    );
  }

  //here is the function needed to get all the added unit of measure
  GetAllUnitOfMeasure() {
    this.apiService.getAllUnitOfMeasure().subscribe(
      (data) => {
        this.UnitOfMeasurements = data;
      },
      (error) => {
        this.handleError(error);
      }
    );
  }

  //here is the function needed to get all added attachments
  ParsedRequestAttachment = [];

  GetAllAttachments() {
    //this condition means that the fetched attachments leds to request tab
    if (this.approvaInvoice == false && this.approvalItem == false) {
      this.apiService.GetAttachmentTypes(1, this.serviceId).subscribe(
        (data) => {
          //fetch and filter attachments based on needed thing
          this.AllAttachments = data;
          this.AllAttachments.forEach((element) => {
            this.RequestAttachments.push({
              //if null , set required intance to false
              required: false,
              enable: true,
              attachmentTypeStatus: '',
              loadingStatus: false,
              id: element.id,
              name: element.name.en,
              fileName: '',
              fileValue: '',
            });
          });
        },
        (error) => {
          this.handleError(error);
        }
      );
    }

    //this condition means that the fetched attachments leds to invoice tab
    else if (this.approvaInvoice == true) {
      this.apiService.GetAttachmentTypes(4, this.serviceId).subscribe(
        (data) => {
          //fetch and filter attachments based on needed thing
          this.AllAttachments = data;
          this.AllAttachments.forEach((element) => {
            this.InvoiceAttachments.push({
              //if null , set required intance to false
              required: false,
              enable: true,
              attachmentTypeStatus: '',
              loadingStatus: false,
              id: element.id,
              name: element.name.en,
              fileName: '',
              fileValue: '',
            });
          });
        },
        (error) => {
          this.handleError(error);
        }
      );
    }

    //this conditions means that the fetched attachments leds to items tabs
    else if (this.approvalItem == true) {
      this.apiService.GetAttachmentTypes(5, this.serviceId).subscribe(
        (data) => {
          //fetch and filter attachments based on needed thing
          this.AllAttachments = data;
          this.AllAttachments.forEach((element) => {
            this.ItemAttachments.push({
              //if null , set required intance to false
              required: false,
              enable: true,
              attachmentTypeStatus: '',
              loadingStatus: false,
              id: element.id,
              name: element.name.en,
              fileName: '',
              fileValue: '',
            });
          });
        },
        (error) => {
          this.handleError(error);
        }
      );
    }
  }

  //here is the function needed to get all the request details after save the request
  FetchedInvoice = [];
  FetchedItems = [];

  GetRequestDataAfterSave(ApprovalRequestID) {
    this.FetchedSavedApprovalID = ApprovalRequestID;
    this.isLoading = true;
    this.apiService.GetSaveSubmitData(ApprovalRequestID).subscribe(
      (data) => {
        this.approvalInvoiceDTO = data?.approvalInvoiceDto;
        this.ChoosedItemList = data?.approvalInvoiceDto?.listApprovalItemDtos;
        if (this.IsDrafted == true) {
          this.registerRequestForm.controls.importerLicenseNo.setValue(
            data.importerLicenseNo
          );
          this.registerRequestForm.controls.receiptNumber.setValue(
            data.receiptNumber
          );
          this.registerRequestForm.controls.receiptValue.setValue(
            data.receiptValue
          );
          this.registerRequestForm.controls.groupNumber.setValue(
            data.groupNumber
          );
          this.registerRequestForm.controls.estimatedValue.setValue(
            data.estimatedValue
          );
          /*      this.registerRequestForm.controls.fRefrencedCountry.setValue(
                 data.estimatedValue
               ); */
          this.isLoading = false;
          this.ShowDetails = false;
          this.serviceId = data.lkupServicesId;
          this.serviceTypeId = data.lkupServiceTypeId;
          this.packagingListTable.tableBody = [];
          this.detailsListTable.tableBody = [];
          this.invoiceListTable.tableBody = [];
          this.FetchedInvoice = [];
          this.FetchedItems = [];
          this.FetchedInvoice.push(data.approvalInvoiceDto);
          this.SetInvoiceIDAfterSave = data.approvalInvoiceDto.id;
          this.FetchedItems = data.approvalInvoiceDto.listApprovalItemDtos;
          this.invoiceListTable.tableBody.push(data.approvalInvoiceDto);
          this.itemListTable.tableBody = [];
          this.itemListTable.tableBody =
            data.approvalInvoiceDto.listApprovalItemDtos;
          this.registerItemsForm.reset();
          // this.ProductDetails.reset();
          this.ProductDetails.controls['itemType'].enable();
        } else {
          this.isLoading = false;
          if (data.approvalInvoiceDto == null) {
            this.invoiceListTable.tableBody = [];
            return;
          } else {
            this.approvalInvoiceDTO = data.approvalInvoiceDto;
          }

          if (
            data.approvalInvoiceDto.listApprovalItemDtos == null ||
            data.approvalInvoiceDto.listApprovalItemDtos == undefined
          ) {
            this.itemListTable.tableBody = [];
            return;
          }
          this.registerRequestForm.reset();
          this.registerRequestForm.controls.importerLicenseNo.setValue(
            data.importerLicenseNo
          );
          this.registerRequestForm.controls.receiptNumber.setValue(
            data.receiptNumber
          );
          this.registerRequestForm.controls.receiptValue.setValue(
            data.receiptValue
          );
          this.registerRequestForm.controls.groupNumber.setValue(
            data.groupNumber
          );
          this.registerRequestForm.controls.estimatedValue.setValue(
            data.estimatedValue
          );

          this.ShowDetails = true;

          this.packagingListTable.tableBody = [];
          this.detailsListTable.tableBody = [];
          this.invoiceListTable.tableBody = [];
          this.FetchedInvoice = [];
          this.FetchedItems = [];
          this.FetchedInvoice.push(data.approvalInvoiceDto);
          this.SetInvoiceIDAfterSave = data.approvalInvoiceDto.id;
          // if (
          //   data.approvalInvoiceDto.listApprovalItemDtos == null ||
          //   data.approvalInvoiceDto.listApprovalItemDtos == undefined
          // ) {
          //   this.itemListTable.tableBody = [];
          // } else {
          //   // this.itemListTable.tableBody = [];
          // }
          this.invoiceListTable.tableBody.push(data.approvalInvoiceDto);
          this.FetchedItems = data.approvalInvoiceDto.listApprovalItemDtos;

          // // this.itemListTable.tableBody = [];
          // // this.itemListTable.tableBody =
          // //   data.approvalInvoiceDto.listApprovalItemDtos;
          // this.registerItemsForm.reset();
          // this.ProductDetails.reset();
          // this.ProductDetails.controls['itemType'].enable();
          // // this.approvaInvoice = false;
          // // this.approvalItem = false;
        }
      },
      (error) => {
        this.isLoading = false;
        this.handleError(error);
      }
    );
  }

  //here is the fucntion needed to get all uploaded attachments under the saved request
  GetAllUploadedAttachments(FetchedRequestID) {
    this.apiService.GetUploadedAttachments(FetchedRequestID).subscribe(
      (data) => {
      },
      (error) => {
        this.handleError(error);
      }
    );
  }

  //here is the function needed to get the product informations based on notification number
  GetProductDetails(notificationNo) {
    this.isLoading = true;
    notificationNo = this.ProductDetails.controls.notificationNo.value;
    this.apiService
      .getProductWithNotificationNumberList(notificationNo)
      .subscribe(
        (data) => {
          if (data) {
            this.neededapprovalItemProductDto = {
              productId: data.id,
              notificationNo: data.notificationNo,
              productName: data.englishName,
              productShortname: data.shortName,
              manufacturingCompanyId: data.manufacturingCompanyId,
              flagType: 1,
              lkupManufactoryId: 1,
            };
            this.isLoading = false;
            this.ShowDetails = true;
            //this case means the user choose old registeration value
            this.registerItemsForm.patchValue({
              shortName: data.englishName,
              ProductEnglishName: data.englishName,
            });

            const detailsArray = data.productDetailsDto.map((item) => {
              return {
                ...item,
                ingredientDetailsDto: item.ingredientDetailsDto
                  ? [item.ingredientDetailsDto]
                  : [],
              };
            });
            this.packagingListTable.tableBody = data.productVolumesDto;
            this.detailsListTable.tableBody = detailsArray;
            this.manufacturingListTable.tableBody = data.productManufactoyDtos;
          }
        },
        (error) => {
          this.handleError(error);
        }
      );
  }

  //here is the function needed to send attachment
  IsUploaded: boolean;

  SendAttachment(neededBody) {
    this.isLoading = true;
    this.apiService.setAttachmentFile(neededBody).subscribe(
      (data) => {
        if (this.approvaInvoice == false && this.approvalItem == false) {
          this.isLoading = false;
          this.handleSuccess('Done sending attachment for request');
          this.FetchedAttachmentID = data;
          this.IsUploaded = true;
          // this.ViewDownload.next(neededBody.lkupAttachmentsId);
        } else if (this.approvaInvoice == true) {
          this.isLoading = false;
          this.handleSuccess('Done sending attachment for invoice');
          this.FetchedAttachmentID = data;
          this.IsUploaded = true;
        } else {
          this.isLoading = false;
          this.handleSuccess('Done sending attachment for item');
          this.FetchedAttachmentID = data;
          this.IsUploaded = true;
        }
      },
      (error) => {
        this.isLoading = false;
        this.handleError(error);
      }
    );
  }

  //here is the function needed to open a modal to add invoice
  AddInvoice() {
    //add invoice need to select the needed currency and the selected exporting company
    //also to add an invoice after save the request need to upload the needed attachments , so call the following functions
    this.GetAllCurrencies();
    this.GetAllExportingComapnies();
    this.approvaInvoice = true;
    this.InvoiceAttachments = [];
    this.GetAllAttachments();
    this.ShowUpdate = false;
    this.invoiceContainerDisplayStatus = true;
  }

  //here is the function needed to delete the selected invoice
  IsDeleted: boolean;
  DeletedApprovalInvoiceDTO: any = {};

  deleteInvoice(event) {
    //check if the request in draft stage
    if (this.IsDrafted == true) {
      if (this.DraftserviceID != undefined) {
        this.invoiceListTable.tableBody.splice(event.index);
        this.IsDeleted = true;
        this.DeletedApprovalInvoiceDTO = null;
      }
    }

    //check if the request is not saved
    else if (
      this.FetchedSavedApprovalID == undefined ||
      this.FetchedSavedApprovalID == null
    ) {
      this.IsDeleted = false;
      this.invoiceListTable.tableBody.splice(event);
    }

    //check if the request has been saved
    else if (
      this.FetchedSavedApprovalID != undefined ||
      this.FetchedSavedApprovalID != null
    ) {
      this.IsDeleted = false;
      this.invoiceListTable.tableBody.splice(event.index);
      this.approvalInvoiceDTO = {
        invoiceValue: event.request.invoiceValue,
        invoiceNo: event.request.invoiceNo,
        invoiceType: event.request.invoiceType,
        lkupCurrencyId: event.request.lkupCurrencyId,
        invoiceDate: event.request.invoiceDate,
        requestApprovalsId: 0,
        supplierName: event.request.supplierName,
        supplierCountryId: event.request.supplierCountryId,
        noOfItems: event.request.noOfItems,
      };
    }
  }

  //here is the function needed to open a modal to update invoice
  ShowUpdate: boolean = false;
  UpdateIsDrafted: boolean;

  editInvoice(event) {
    //check if the request not saved
    if (this.IsDrafted == true) {
      this.UpdateIsDrafted = true;
      this.GetAllCurrencies();
      this.GetAllExportingComapnies();
      if (event.item.id == undefined) {
        this.invoiceContainerDisplayStatus = true;
        this.ShowUpdate = true;
        this.editInvoiceIndex = event.index;

        this.registerInvoiceForm.controls.invoiceNo.setValue(
          event.item.invoiceNo
        );
        this.registerInvoiceForm.controls.noofitems.setValue(
          event.item.noOfItems
        );
        this.registerInvoiceForm.controls.invoiceValue.setValue(
          event.item.invoiceValue
        );
        this.registerInvoiceForm.controls.invoiceDate.setValue(
          event.item.invoiceDate
        );
        this.selectedcurrency = event.item.lkupCurrencyName;
        this.registerInvoiceForm.controls.lkupCurrencyName.setValue(
          this.selectedcurrency
        );

        this.selectedsuppliername = event.item.supplierCountryName;
        this.registerInvoiceForm.controls.supplierCountryName.setValue(
          this.selectedsuppliername
        );
        this.registerInvoiceForm.controls.supplierName.setValue(
          event.item.supplierName
        );
      }

      //check if the request already saved
      else {
        this.GetAllCurrencies();
        this.GetAllExportingComapnies();
        this.invoiceContainerDisplayStatus = true;
        this.ShowUpdate = true;
        this.editInvoiceIndex = event.index;

        this.registerInvoiceForm.controls.invoiceNo.setValue(
          event.item.invoiceNo
        );
        this.registerInvoiceForm.controls.noofitems.setValue(
          event.item.noOfItems
        );
        this.registerInvoiceForm.controls.invoiceValue.setValue(
          event.item.invoiceValue
        );
        this.registerInvoiceForm.controls.invoiceDate.setValue(
          event.item.invoiceDate
        );
        this.selectedcurrency = event.item.lkupCurrencyId;
        this.registerInvoiceForm.controls.lkupCurrencyName.setValue(
          this.selectedcurrency
        );

        this.selectedsuppliername = event.item.supplierCountryId;
        this.registerInvoiceForm.controls.supplierCountryName.setValue(
          this.selectedsuppliername
        );
        this.registerInvoiceForm.controls.supplierName.setValue(
          event.item.supplierName
        );
        this.selected_invoice_type = event.item.invoiceType;
        this.registerInvoiceForm.controls.invoicetype.setValue(
          this.selected_invoice_type
        );
      }
    } else {
      this.approvaInvoice = true;
      this.UpdateIsDrafted = false;
      this.GetAllCurrencies();
      this.GetAllExportingComapnies();
      if (event.item.id == undefined) {
        this.invoiceContainerDisplayStatus = true;
        this.ShowUpdate = true;
        this.editInvoiceIndex = event.index;

        this.registerInvoiceForm.controls.invoiceNo.setValue(
          event.item.invoiceNo
        );
        this.registerInvoiceForm.controls.noofitems.setValue(
          event.item.noOfItems
        );
        this.registerInvoiceForm.controls.invoiceValue.setValue(
          event.item.invoiceValue
        );
        this.registerInvoiceForm.controls.invoiceDate.setValue(
          event.item.invoiceDate
        );
        this.selectedcurrency = event.item.lkupCurrencyId;
        this.registerInvoiceForm.controls.lkupCurrencyName.setValue(
          this.selectedcurrency
        );

        this.selectedsuppliername = event.item.supplierCountryId;
        this.registerInvoiceForm.controls.supplierCountryName.setValue(
          this.selectedsuppliername
        );
        this.registerInvoiceForm.controls.supplierName.setValue(
          event.item.supplierName
        );
        this.selected_invoice_type = event.item.invoiceType;
        this.registerInvoiceForm.controls.invoicetype.setValue(
          this.selected_invoice_type
        );
      }

      //check if the request already saved
      else {
        this.invoiceContainerDisplayStatus = true;
        this.ShowUpdate = true;
        this.editInvoiceIndex = event.index;

        this.registerInvoiceForm.controls.invoiceNo.setValue(
          event.item.invoiceNo
        );
        this.registerInvoiceForm.controls.noofitems.setValue(
          event.item.noOfItems
        );
        this.registerInvoiceForm.controls.invoiceValue.setValue(
          event.item.invoiceValue
        );
        this.registerInvoiceForm.controls.invoiceDate.setValue(
          event.item.invoiceDate
        );
        this.selectedcurrency = event.item.lkupCurrencyId;
        this.registerInvoiceForm.controls.lkupCurrencyName.setValue(
          this.selectedcurrency
        );

        this.selectedsuppliername = event.item.supplierCountryId;
        this.registerInvoiceForm.controls.supplierCountryName.setValue(
          this.selectedsuppliername
        );
        this.registerInvoiceForm.controls.supplierName.setValue(
          event.item.supplierName
        );
        this.selected_invoice_type = event.item.invoiceType;
        this.registerInvoiceForm.controls.invoicetype.setValue(
          this.selected_invoice_type
        );
      }
    }
  }

  //here is the function needed to push at least on invoice to make user be able to add list of items on it
  approvalInvoiceDTO: any;

  PushInVoiceToTable() {
    if (this.registerInvoiceForm.invalid) {
      this.handleError('Please fill all fields');
    } else if (this.invoiceListTable.tableBody.length == 0) {
      this.approvaInvoice = false;
      this.invoiceListTable.tableBody.push({
        invoiceNo: this.registerInvoiceForm.controls.invoiceNo.value,
        invoiceDate: this.registerInvoiceForm.controls.invoiceDate.value,
        invoiceValue: this.registerInvoiceForm.controls.invoiceValue.value,
        lkupCurrencyName:
        this.registerInvoiceForm.controls.lkupCurrencyName.value,
        fWithinIncluded: false,
        supplierCountryName:
        this.registerInvoiceForm.controls.supplierCountryName.value,
        noOfItems: this.registerInvoiceForm.controls.noofitems.value,
        supplierName: this.registerInvoiceForm.controls.supplierName.value,
      });
      this.approvalInvoiceDTO = {
        invoiceValue: this.registerInvoiceForm.controls.invoiceValue.value,
        invoiceNo: this.registerInvoiceForm.controls.invoiceNo.value,
        invoiceType: this.registerInvoiceForm.controls.invoicetype.value,
        lkupCurrencyId:
        this.registerInvoiceForm.controls.lkupCurrencyName.value,
        invoiceDate: this.registerInvoiceForm.controls.invoiceDate.value,
        requestApprovalsId: 0,
        supplierName: this.registerInvoiceForm.controls.supplierName.value,
        supplierCountryId:
        this.registerInvoiceForm.controls.supplierCountryName.value,
        noOfItems: this.registerInvoiceForm.controls.noofitems.value,
      };
      this.CloseInvoice();
    } else if (this.invoiceListTable.tableBody.length == 1) {
      return;
    } else {
      this.handleError('Cannot be able to add more than one invoice');
    }
  }

  //here is the function needed to update the unsaved approval request
  //specialy update invoice for unsaved approval request
  //so check if the request not saved , and there is no invoice id
  UpdateSelectedInvoice() {
    //first case , there is no invoice id
    if (this.SetInvoiceIDAfterSave == undefined) {
      this.registerInvoiceForm.patchValue({
        invoiceNo: this.registerInvoiceForm.controls.invoiceNo.value,
        noOfItems: this.registerInvoiceForm.controls.noofitems.value,
        invoiceValue: this.registerInvoiceForm.controls.invoiceValue.value,
        invoiceDate: this.registerInvoiceForm.controls.invoiceDate.value,
        lkupCurrencyName:
        this.registerInvoiceForm.controls.lkupCurrencyName.value,
        supplierName: this.registerInvoiceForm.controls.supplierName.value,
        supplierCountryName:
        this.registerInvoiceForm.controls.supplierCountryName.value,
      });
      this.invoiceListTable.tableBody[this.editInvoiceIndex] =
        this.registerInvoiceForm.value;
      this.approvalInvoiceDTO = {
        id: 0,
        invoiceValue: this.registerInvoiceForm.controls.invoiceValue.value,
        invoiceNo: this.registerInvoiceForm.controls.invoiceNo.value,
        invoiceType: this.registerInvoiceForm.controls.invoicetype.value,
        lkupCurrencyId:
        this.registerInvoiceForm.controls.lkupCurrencyName.value,
        invoiceDate: this.registerInvoiceForm.controls.invoiceDate.value,
        requestApprovalsId: 0,
        supplierName: this.registerInvoiceForm.controls.supplierName.value,
        supplierCountryId:
        this.registerInvoiceForm.controls.supplierCountryName.value,
        noOfItems: this.registerInvoiceForm.controls.noofitems.value,
      };
      this.CloseInvoice();
      this.handleSuccess('Done update invoice before save');
    }

    //there is an invoice id
    else {
      this.registerInvoiceForm.patchValue({
        invoiceNo: this.registerInvoiceForm.controls.invoiceNo.value,
        noOfItems: this.registerInvoiceForm.controls.noofitems.value,
        invoiceValue: this.registerInvoiceForm.controls.invoiceValue.value,
        invoiceDate: this.registerInvoiceForm.controls.invoiceDate.value,
        lkupCurrencyName:
        this.registerInvoiceForm.controls.lkupCurrencyName.value,
        supplierName: this.registerInvoiceForm.controls.supplierName.value,
        supplierCountryName:
        this.registerInvoiceForm.controls.supplierCountryName.value,
      });
      this.invoiceListTable.tableBody[this.editInvoiceIndex] =
        this.registerInvoiceForm.value;
      this.approvalInvoiceDTO = {
        id: this.SetInvoiceIDAfterSave,
        invoiceValue: this.registerInvoiceForm.controls.invoiceValue.value,
        invoiceNo: this.registerInvoiceForm.controls.invoiceNo.value,
        invoiceType: this.registerInvoiceForm.controls.invoicetype.value,
        lkupCurrencyId:
        this.registerInvoiceForm.controls.lkupCurrencyName.value,
        invoiceDate: this.registerInvoiceForm.controls.invoiceDate.value,
        requestApprovalsId: 0,
        supplierName: this.registerInvoiceForm.controls.supplierName.value,
        supplierCountryId:
        this.registerInvoiceForm.controls.supplierCountryName.value,
        noOfItems: this.registerInvoiceForm.controls.noofitems.value,
      };

      this.CloseInvoice();
      this.handleSuccess('Done update invoice after save');
    }
  }

  //here is the function needed to add item over an invoice
  addIteminvoice(event) {
    this.itemContainerDisplayStatus = true;
    this.approvalItem = true;
    this.ItemAttachments = [];
    this.ShowDetails = true;
    this.GetAllAttachments();
  }

  volume;
  packingDescription;
  fCartonbox;
  lkupUomId;
  lkupPackingTypeId;
  newapprovalItemPackDto;
  packingId: any;

  choosePackagingData(event) {
    if (this.serviceId == 1) {
      this.packingId = event.id;
      this.volume = event.volume;
      this.packingDescription = event.packingDescription;
      this.fCartonbox = event.fCartonbox;
      this.lkupUomId = event.lkupUomId;
      this.lkupPackingTypeId = event.lkupPackingTypeId;
      // this.newapprovalItemPackDto = {
      //   lkupPackingId: event.id,
      //   approvalItemId: 0,
      //   packingName: event.lkupPackingTypeName,
      //   lkupManufactoryId: 0,
      //   manufacturingCompany:
      //     this.registerInvoiceForm.controls.supplierName.value,
      //   batchNo: this.registerItemsForm.controls.batchNo.value,
      // };
    }
  }

  barcode: any;
  flavor: any;
  fragrance: any;
  productColour: any;
  ingredientId: any;

  ChooseIngredientData(event: any) {
    this.ingredientId = event.packingRow.id;
    this.barcode = event.packingRow.barcode;
    this.flavor = event.packingRow.flavor;
    this.fragrance = event.packingRow.fragrance;
    this.productColour = event.packingRow.productColour;
    this.ingredientDtos.push({
      inciName:
      event.packingRow.ingredientDetailsDto[0][0].ingredientDto.inciName,
      functionId: event.packingRow.ingredientDetailsDto[0][0].functionId,
      concentration: event.packingRow.ingredientDetailsDto[0][0].concentration,
    });
  }

  newSelectedItemType: any;
  ShowUpdateItembutton: boolean;

  editItem(event) {
    debugger;
    this.ShowUpdateItembutton = true;
    this.approvalItemsDto = event.item;
    if (event.item.itemTypeId == 1) {
      this.EditProduct(event);
      return;
    }

    if (event.item.itemTypeId == 3) {
      this.EditRawMaterial(event);
      return;
    }

    if (event.item.itemTypeId == 2) {
      this.EditPremix(event);
      return;
    }

    if (event.item.itemTypeId == 4) {
      this.EditPack(event);
      return;
    }
  }

  //here is the function needed to update the selected item
  DoneUpdate() {
    debugger;

    this.approvalItemsDto = {
      id: this.approvalItemsDto.id,
      syslkupItemTypeId: this.SelectedItemTypeId,
      initialApprovalCount: +this.registerItemsForm.controls.quantity.value,
      itemName: this.registerItemsForm.controls.shortName.value,
      lkupCountryId:
      this.registerInvoiceForm.controls.supplierCountryName.value,
      lkupUomId: this.SetSelectedUOM,
      lkupCurrencyId: this.registerInvoiceForm.controls.lkupCurrencyName.value,
      fRegisteredProduct: this.ChoosedRegisterType,
      noOfItems: this.registerInvoiceForm.controls.noofitems.value,
      itemNameInInvoice: this.registerItemsForm.controls.InvoiceItemName.value,
      itemPrice: this.registerItemsForm.controls.unitPrice.value,
      approvalItemProductDto: {
        id: this.approvalItemsDto.approvalItemProductDto.id,
        approvalItemId:
        this.approvalItemsDto.approvalItemProductDto.approvalItemId,
        productId: this.neededapprovalItemProductDto.productId,
        notificationNo: this.neededapprovalItemProductDto.notificationNo,
        productName: this.neededapprovalItemProductDto.productName,
        productShortname: this.neededapprovalItemProductDto.productShortname,
        flagType: 1,
        lkupManufactoryId: 1,
        manufacturingCompany: this.ManucaturingCompany,
        // batchNo: this.registerItemsForm.controls.batchNo.value,
        volume: this.volume,
        lkupUomId: this.SetSelectedUOM,
        packingDescription: this.packingDescription,
        lkupPackingTypeId: this.lkupPackingTypeId,
        fCartonbox: this.fCartonbox,
        productColour: this.productColour,
        fragrance: this.fragrance,
        flavor: this.flavor,
        barcode: this.barcode,
        packingId: this.packingId,
        manufactoryId: this.ManufactureID,
        ingredientId: this.ingredientId,
        ingredientDtos: this.ingredientDtos,
      },
      approvalItemRawDto: this.CollectRawMaterialDataFromUI(),
      approvalItemPremixDto: this.CollectPremixFromUI(),
      approvalItemPackDto: this.CollectPackFromUI(),
    };
    this.ShowUpdateItembutton = false;
  }

  EditProduct(event) {
    this.ProductDetails.controls.notificationNo.setValue(
      event.item.approvalItemProductDto.notificationNo
    );
    debugger;
    //get product by notification number without click >> call function automatic

    if (this.ProductDetails.controls.notificationNo.value != null) {
      this.GetProductDetails(this.ProductDetails.controls.notificationNo.value);
    }


    // this.ProductDetails.reset();
    // this.registerItemsForm.reset();
    //set value for product details form inputs (3 inputs)
    // this.newSelectedItemType = event.settedRequest.itemTypeId;
    this.ProductDetails.controls.itemType.setValue(event.item.itemTypeId);

    //fill item registeration form with already registered data

    this.registerItemsForm.controls.quantity.setValue(event.item.quantity);

    this.SetSelectedUOM = event.item.lkupUomId;
    this.registerItemsForm.controls.uom.setValue(this.SetSelectedUOM);

    this.registerItemsForm.controls.InvoiceItemName.setValue(
      event.item.itemNameInInvoice
    );

    if (event.item.fRegisteredProduct == true) {
      this.ChoosedItemType = true;
      this.ProductDetails.controls.registerType.setValue(this.ChoosedItemType);
      this.EditSetRegisterType(this.ChoosedItemType);
    } else {
      this.ChoosedItemType = false;
      this.ProductDetails.controls.registerType.setValue(this.ChoosedItemType);
      this.EditSetRegisterType(this.ChoosedItemType);
    }

    //set the already checked items in the table lists by looping through each array to match
    this.detailsListTable.tableBody.forEach((element: any) => {
      if (element.id == event.item.approvalItemProductDto.ingredientId) {
        element.checked = true;
      }
    });
  }

  premixBatch: any;
  sourceOfRowMaterialField;

  EditPremix(event) {
    this.SelectedItemTypeId = 2;
    this.ProductDetails.controls.itemType.setValue(this.SelectedItemTypeId);
    this.premixBatch = event.item.premixBatchesId;
    this.ProductDetails.controls.premixBatch.setValue(
      event.item.premixBatchesId
    );
    this.sourceOfRowMaterialField = event.item.sourceRawMaterialId;
    this.ProductDetails.controls.sourceOfRowMaterialField.setValue(
      this.sourceOfRowMaterialField
    );
    //call edit product function to set the needed product data in the form
    this.EditProduct(event);
  }

  EditRawMaterial(event) {
    //set item type id
    this.SelectedItemTypeId = 3;
    this.ProductDetails.controls.itemType.setValue(this.SelectedItemTypeId);
    this.rowMaterialNameField = event.item.approvalItemRawDto.ingredientsId;
    this.ProductDetails.controls.rowMaterialNameField.setValue(
      this.rowMaterialNameField
    );
    this.sourceOfRawMaterialList;
    this.sourceOfRowMaterialField =
      event.item.approvalItemRawDto.sourceRawMaterialId;
    this.ProductDetails.controls.sourceOfRowMaterialField.setValue(
      event.item.sourceRawMaterialId
    );

    //call edit product function to set the needed product data in the form
    this.EditProduct(event);
  }

  EditPack(event) {
    this.EditProduct(event);
  }

  //here is the fucntion needed to fill the table needed for items
  approvalItemsDto: any = {};
  ChoosedItemList = [];
  SelectedItemTypeId;

  PushItems() {
    debugger;
    if (this.itemListTable.tableBody == null) {
      this.itemListTable.tableBody = [];
    }

    this.itemListTable.tableBody.push({
      itemName: this.registerItemsForm.controls.InvoiceItemName.value,
      itemType: this.SelectedItemTypeId,
      //manufacturingCompany: this.registerItemsForm.controls.ManufacturingCompany.value,
      quantity: this.registerItemsForm.controls.quantity.value,
      NotificationNumber: this.notificationNo,
    });
    //sara start
    // this.registerItemsForm.reset();
    // this.PackagingDataForm.reset();
    //sara end

    // if (this.SelectedItemTypeId == 1)
    this.approvalItemsDto = {
      id: 0,
      syslkupItemTypeId: this.SelectedItemTypeId,
      initialApprovalCount: +this.registerItemsForm.controls.quantity.value,
      itemName: this.registerItemsForm.controls.shortName.value,

      lkupCountryId: this.registerInvoiceForm.controls.supplierCountryName.value,
      //lkupCountryId: this.ItemManufacturingCountry;

      // manufacturingCompany: this.ManufacturingCompany,

      lkupUomId: this.SetSelectedUOM,
      lkupCurrencyId: this.registerInvoiceForm.controls.lkupCurrencyName.value,
      fRegisteredProduct: this.ChoosedRegisterType,
      noOfItems: this.registerInvoiceForm.controls.noofitems.value,
      itemNameInInvoice: this.registerItemsForm.controls.InvoiceItemName.value,
      approvalItemProductDto: {
        id: 0,
        approvalItemId: 0,
        productId: this.neededapprovalItemProductDto.productId,
        notificationNo: this.neededapprovalItemProductDto.notificationNo,
        productName: this.neededapprovalItemProductDto.productName,
        productShortname: this.neededapprovalItemProductDto.productShortname,
        flagType: 1,
        lkupManufactoryId: 1,
        manufacturingCompany: this.ManucaturingCompany,
        // batchNo: this.registerItemsForm.controls.batchNo.value,
        volume: this.volume,
        lkupUomId: this.SetSelectedUOM,
        packingDescription: this.packingDescription,
        lkupPackingTypeId: this.lkupPackingTypeId,
        fCartonbox: this.fCartonbox,
        productColour: this.productColour,
        fragrance: this.fragrance,
        flavor: this.flavor,
        barcode: this.barcode,
        packingId: this.packingId,
        manufactoryId: this.ManufactureID,
        ingredientId: this.ingredientId,
        ingredientDtos: this.ingredientDtos,
      },
      approvalItemRawDto: this.CollectRawMaterialDataFromUI(),
      approvalItemPremixDto: this.CollectPremixFromUI(),
      approvalItemPackDto: this.CollectPackFromUI(),
    };

    if (this.ChoosedItemList == null) {
      this.ChoosedItemList = [];
    }
    this.ChoosedItemList.push(
      (this.approvalItemsDto = {
        id: 0,
        syslkupItemTypeId: this.SelectedItemTypeId,
        initialApprovalCount: +this.registerItemsForm.controls.quantity.value,
        itemName: this.registerItemsForm.controls.shortName.value,
        lkupCountryId:
        this.registerInvoiceForm.controls.supplierCountryName.value,
        lkupUomId: this.SetSelectedUOM,
        lkupCurrencyId:
        this.registerInvoiceForm.controls.lkupCurrencyName.value,
        itemNameInInvoice:
        this.registerItemsForm.controls.InvoiceItemName.value,
        noOfItems: this.registerInvoiceForm.controls.noofitems.value,
        fRegisteredProduct: this.ChoosedRegisterType,

        approvalItemProductDto: {
          id: 0,
          approvalItemId: 0,
          productId: this.neededapprovalItemProductDto.productId,
          notificationNo: this.neededapprovalItemProductDto.notificationNo,
          productName: this.neededapprovalItemProductDto.productName,
          productShortname: this.neededapprovalItemProductDto.productShortname,
          flagType: 1,
          lkupManufactoryId: 1,
          manufacturingCompany:
          this.neededapprovalItemProductDto.manufacturingCompanyId,
          // batchNo: this.registerItemsForm.controls.batchNo.value,
          volume: this.volume,
          lkupUomId: this.SetSelectedUOM,
          packingDescription: this.packingDescription,
          lkupPackingTypeId: this.lkupPackingTypeId,
          fCartonbox: this.fCartonbox,
          productColour: this.productColour,
          fragrance: this.fragrance,
          flavor: this.flavor,
          barcode: this.barcode,
          packingId: this.packingId,
          ingredientId: this.ingredientId,
          manufactoryId: this.ManufactureID,
          ingredientDtos: this.ingredientDtos,
        },
        approvalItemRawDto: this.CollectRawMaterialDataFromUI(),
        approvalItemPremixDto: this.CollectPremixFromUI(),
        approvalItemPackDto: this.CollectPackFromUI(),
      })
    );
  }

  ChoosedRawmaterial: any;

  SetChoosedRawMaterial(e) {
    this.ChoosedRawmaterial = JSON.parse(e.value);
  }

  rawmaterial: any;

  CollectRawMaterialDataFromUI() {
    debugger;
    if (this.SelectedItemTypeId != 3) {
      return null;
    }
    //to be inhanced
    return {
      approvalItemId:
        this.approvalItemsDto.approvalItemRawDto?.approvalItemId == undefined
          ? 0
          : this.approvalItemsDto.approvalItemRawDto?.approvalItemId,
      ingredientsId: this.rowMaterialNameField,
      cosingRefNo: 0,
      inciName: this.rawmaterial,
      lkupManufactoryId: null,
      manufacturingCompany: null,
      sourceRawMaterialId: this.sourceOfRowMaterialField,
      rawNameAsInvoice: null,
      storageSite: this.registerItemsForm.controls.storageSite.value
    };
  }

  CollectPremixFromUI() {
    if (this.SelectedItemTypeId != 2) {
      return null;
    }
    return {
      approvalItemId:
        this.SelectedItemID == undefined ? 0 : this.SelectedItemID,
      premixBatchesId: +this.ProductDetails.controls.premixBatch.value,
      lkupManufactoryId: null,
      manufacturingCompany: null,
      sourceRawMaterialId: this.sourceOfRowMaterialField,
    };
  }

  lkupPackingTypeName: any;

  CollectPackFromUI() {
    if (this.SelectedItemTypeId != 4) {
      return null;
    }

    return {
      approvalItemId:
        this.SelectedItemID == undefined ? 0 : this.SelectedItemID,
      lkupPackingId: this.packingId,
      packingName: this.lkupPackingTypeName,
      lkupManufactoryId: null,
      manufacturingCompany: null,
    };
  }

  //here is the function needed to delete the selected item over the invoice
  deleteItem(event) {
    this.ChoosedItemList.splice(event, 1);
    this.itemListTable.tableBody.splice(event, 1);
  }

  //here is the function needed to download a selected attachment
  DisableDownload: boolean;

  downloadFile(FileName) {
    this.isLoading = true;
    this.apiService.GetUploadedAttach(this.FetchedAttachmentID).subscribe(
      (res: any) => {
        if (res.base64data == undefined) {
          this.DisableDownload = true;
          this.handleError(
            'There is no file updloaded to this attachment type to download'
          );
        } else {
          this.isLoading = false;
          this.DisableDownload = false;
          this.convertFilesToPDF(res.base64data, FileName);
          this.handleSuccess('File downloaded successfully');
        }
      },
      (error) => {
        this.isLoading = false;
        this.handleError(error);
      }
    );
  }

  //here is the function needed to convert files to PDF
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

  //here is the function needed to save request
  SaveRequest() {
    const body = {
      id: this.FetchedSavedApprovalID ? this.FetchedSavedApprovalID : 0,
      estimatedValue: this.registerRequestForm.controls.estimatedValue.value,
      groupNumber: this.registerRequestForm.controls.groupNumber.value,
      fWithinIncluded: false,
      importerLicenseNo:
      this.registerRequestForm.controls.importerLicenseNo.value,
      lkupServiceTypeId: this.serviceTypeId,
      lkupServicesId: this.serviceId,
      receiptNumber: this.registerRequestForm.controls.receiptNumber.value,
      receiptValue: this.registerRequestForm.controls.receiptValue.value,
      approvalItemsDto: this.approvalItemsDto,
      approvalInvoiceDto: this.approvalInvoiceDTO,
      listApprovalItemDtos: this.ChoosedItemList,
    };
    debugger;
    this.apiService.SaveApproval(body).subscribe(
      (res) => {
        if (res.code == 200) {
          this.isLoading = false;
          this.handleSuccess('Done save approval request');
          this.FetchedSavedApprovalID = res.data;
          this.GetRequestDataAfterSave(this.FetchedSavedApprovalID);
          this.registerItemsForm.reset();
          this.ProductDetails.reset();
          // this.GetAllUploadedAttachments(this.FetchedSavedApprovalID);}
        } else {
          this.handleError(res.message);
        }


      },
      (error) => {
        this.handleError(error);
      }
    );
  }

  //here is the function needed to submit requst
  IsSubmitted: boolean;

  SubmitRequest() {
    //check also if the user edit the request form draft option
    if (this.IsDrafted == true) {
      if (this.UpdateIsDrafted == true) {
        this.FetchedSavedApprovalID = this.DraftserviceID;
        this.isLoading = true;
        const body = {
          id: this.DraftserviceID,
          estimatedValue:
          this.registerRequestForm.controls.estimatedValue.value,
          groupNumber: this.registerRequestForm.controls.groupNumber.value,
          fWithinIncluded: false,
          importerLicenseNo:
          this.registerRequestForm.controls.importerLicenseNo.value,
          lkupServiceTypeId: this.serviceTypeId,
          lkupServicesId: this.serviceId,
          receiptNumber: this.registerRequestForm.controls.receiptNumber.value,
          receiptValue: this.registerRequestForm.controls.receiptValue.value,
          approvalItemsDto: this.approvalItemsDto,
          approvalInvoiceDto: this.approvalInvoiceDTO,
          listApprovalItemDtos: this.ChoosedItemList,
        };
        this.apiService.SubmitApprovalRequestforService(body).subscribe(
          //sara-validation
          (res) => {
            if (res.code == 200) {
              this.IsSubmitted = true;
              this.isLoading = false;
              this.FetchedSavedApprovalID = res.data;
              this.router.navigate([
                `pages/cosmetics-product/inner/importation-services/6/11`,
              ]);
              // this.GetAllUploadedAttachments(this.FetchedSavedApprovalID);
            }
            //sara-validation
            else {
              this.handleError(res.message);
            }
          }
          ,
          (error) => {
            this.isLoading = false;
            this.handleError(error);
          }
        );
      } else {
        this.FetchedSavedApprovalID = this.DraftserviceID;
        this.isLoading = true;
        const body = {
          id: this.DraftserviceID,
          estimatedValue:
          this.registerRequestForm.controls.estimatedValue.value,
          groupNumber: this.registerRequestForm.controls.groupNumber.value,
          fWithinIncluded: false,
          importerLicenseNo:
          this.registerRequestForm.controls.importerLicenseNo.value,
          lkupServiceTypeId: this.serviceTypeId,
          lkupServicesId: this.serviceId,
          receiptNumber: this.registerRequestForm.controls.receiptNumber.value,
          receiptValue: this.registerRequestForm.controls.receiptValue.value,
          approvalItemsDto: this.approvalItemsDto,

          approvalInvoiceDto: this.invoiceListTable.tableBody.length == 0 ? null : {
            id: this.SetInvoiceIDAfterSave,
            invoiceValue: this.invoiceListTable.tableBody[0].invoiceValue,
            invoiceNo: this.invoiceListTable.tableBody[0].invoiceNo,
            invoiceType: this.invoiceListTable.tableBody[0].invoiceType,
            lkupCurrencyId: this.invoiceListTable.tableBody[0].lkupCurrencyId,
            invoiceDate: this.invoiceListTable.tableBody[0].invoiceDate,
            requestApprovalsId: 0,
            supplierName: this.invoiceListTable.tableBody[0].supplierName,
            supplierCountryId:
            this.invoiceListTable.tableBody[0].supplierCountryId,
            noOfItems: this.invoiceListTable.tableBody[0].noOfItems,
          },
          listApprovalItemDtos: this.ChoosedItemList,
        };

        this.apiService.SubmitApprovalRequestforService(body).subscribe(
          //sara validation
          (res) => {

            if (res.code == 200) {
              //sara validation
              this.IsSubmitted = true;
              this.isLoading = false;
              this.FetchedSavedApprovalID = res.data;
              this.router.navigate([
                `pages/cosmetics-product/inner/importation-services/6/11`,
              ]);
              // this.GetRequestDataAfterSave(this.FetchedSavedApprovalID);
              // this.GetAllUploadedAttachments(this.FetchedSavedApprovalID);
            }
            //sara validation
            else {
              this.handleError(res.message);
            }
          },
          (error) => {
            this.isLoading = false;
            this.handleError(error);
          }
        );
      }
    }

      //check if the reuqest already saved by check for the requesid after save
      // if the request not saved , so set id to be = 0
    // else , so set id to be with the request id
    else {
      if (
        this.FetchedSavedApprovalID == null ||
        this.FetchedSavedApprovalID == undefined
      ) {
        this.handleError('Cannot submit request before save');
      } else {
        this.isLoading = true;
        const body = {
          id: this.FetchedSavedApprovalID,
          estimatedValue:
          this.registerRequestForm.controls.estimatedValue.value,
          groupNumber: this.registerRequestForm.controls.groupNumber.value,
          fWithinIncluded: false,
          importerLicenseNo:
          this.registerRequestForm.controls.importerLicenseNo.value,
          lkupServiceTypeId: this.serviceTypeId,
          lkupServicesId: this.serviceId,
          receiptNumber: this.registerRequestForm.controls.receiptNumber.value,
          receiptValue: this.registerRequestForm.controls.receiptValue.value,
          approvalItemsDto: this.approvalItemsDto,
          approvalInvoiceDto: this.approvalInvoiceDTO,
          listApprovalItemDtos: this.ChoosedItemList,
        };
        this.apiService.SubmitApprovalRequestforService(body).subscribe(
          (data) => {
            this.IsSubmitted = true;
            this.isLoading = false;
            this.FetchedSavedApprovalID = data;
            this.router.navigate([
              `pages/cosmetics-product/inner/importation-services/6/11`,
            ]);

            // this.GetAllUploadedAttachments(this.FetchedSavedApprovalID);
          },
          (error) => {
            this.isLoading = false;
            this.handleError(error);
          }
        );
      }
    }
  }

  //here is the function fired an error
  handleError(error) {
    this.alertErrorNotificationStatus = true;
    this.alertErrorNotification = {msg: error};
    this.isLoading = false;
  }

  //here is the function needed to fire when a done operation occurred
  handleSuccess(donemsg) {
    this.alertSuccessNotificationStatus = true;
    this.alertSuccessNotification = {msg: donemsg};
    this.isLoading = false;
  }

  //here is the function needed to close invoice modal
  CloseInvoice() {
    this.invoiceContainerDisplayStatus = false;
    this.InvoiceAttachments = [];
    this.approvaInvoice = false;
  }

  //here is the function needed to close the modal for add item
  CloseItem() {
    // this.registerItemsForm.reset();
    // this.ProductDetails.reset();
    this.ItemAttachments = [];
    this.approvalItem = false;
    this.itemContainerDisplayStatus = false;
  }

  //here is the function needed to close the alert for something error after 2sec
  onClosedErrorAlert() {
    setTimeout(() => {
      this.alertErrorNotificationStatus = false;
    }, 2000);
  }

  //here is the function needed to goto the next operation step
  nextToNextTab(whichTab) {
    let activeTabIndex;
    whichTab.tabs
      .filter((x) => x.active)
      .map((y) => (activeTabIndex = whichTab.tabs.indexOf(y)));
    activeTabIndex + 1 <= whichTab.tabs.length - 1
      ? (whichTab.tabs[activeTabIndex + 1].active = true)
      : null;
  }

  //here is the function needed to back to the previous step
  backToNextTab(whichTab) {
    let activeTabIndex;
    whichTab.tabs
      .filter((x) => x.active)
      .map((y) => (activeTabIndex = whichTab.tabs.indexOf(y)));
    activeTabIndex >= 0
      ? (whichTab.tabs[activeTabIndex - 1].active = true)
      : null;
  }

  //here is the function needed to change reciept value to decimal number
  // number : number
  // getDecimalValue(value, fromWhere) {
  //   this.registerRequestForm.patchValue(
  //     {
  //       receiptValue: this.number.transform(
  //         this.registerInvoiceForm.get('receiptValue').value,
  //         '1.2-2'
  //       ),
  //     },
  //     { emitEvent: false }
  //   );
  // }
  //sara 11-5-2022 [start]
  filteredOptionsForRawMaterialType: Observable<any[]>;
  filteredOptionsForManufacturingCompany: [any];
  filteredOptionsForManufacturingCountry: Observable<LookupState[]>;
  rowMaterialNameField: any;
  formData = null;
  premixNameList: any;
  premixBatchesList: [] = [];

  setAllLookupsInObservable() {
    this.filteredOptionsForRawMaterialType = this.filterLookupsFunction(
      'rowMaterialNameField',
      this.rowMaterialNameField,
      this.formData?.rawMaterialList
    );

    this.apiService.getPremixList().subscribe((res) => {
      this.premixNameList = res;
    });
  }

  GetSelectedPremixBatchesList(premixName: string) {
    this.premixBatchesList = null;
    this.premixBatchesList = this.premixNameList.find(
      (o) => o.name == premixName
    ).premixBatchDtos;
  }

  filterLookupsFunction(whichLookup, formControlValue, list, index?: any) {
    if (whichLookup === 'ingrediant') {
      if (formControlValue) {
        return formControlValue.valueChanges.pipe(
          startWith(''),
          debounceTime(30),
          map((state) =>
            state
              ? this.filterInsideListForDiffModel(
              whichLookup,
              state,
              list,
              index
              ).slice(0, 3000)
              : list.slice(0, 3000)
          )
        );
      }
    } else if (whichLookup === 'rowMaterialNameField') {
      if (formControlValue) {
        return formControlValue.valueChanges.pipe(
          startWith(''),
          map((state) =>
            state
              ? this.filterInsideListForDiffModel(
              whichLookup,
              state,
              list,
              index
              ).slice(0, 3000)
              : list.slice(0, 3000)
          )
        );
      }
    } else {
      if (formControlValue) {
        return formControlValue.valueChanges.pipe(
          startWith(''),
          map((state) =>
            state
              ? this.filterInsideList(whichLookup, state, list)
              : list?.slice()
          )
        );
      }
    }
  }

  filterInsideList(lookup, value, list, index?: any): LookupState[] {
    let filterValue;
    if (value) {
      filterValue = value.toLowerCase() ? value.toLowerCase() : '';
    }
    return list
      .filter((option) =>
        option.name[this.currentLang].toLowerCase().includes(filterValue)
      )
      .map((x) => x);
  }

  filterInsideListForDiffModel(lookup, value, list, index?: any): any[] {
    let filterValue;
    if (value) {
      filterValue = value.toLowerCase() ? value.toLowerCase() : '';
    }
    return list
      .filter((option) => option.inciName.toLowerCase().includes(filterValue))
      .map((x) => x);
  }

  itemType;
  importReason;
  disableImportReasonField: boolean = false;

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

      }
    })

  }

  fillFormData() {
    this.apiService.getAllInvoiceItemTypes().subscribe((res: any) => {
      if (res) {
        this.formData.itemTypeList = res;
      }
    }), error => this.handleError(error);
  }

  //Reem Validation on Invoice date [Start]
  curr_year: number = (new Date()).getFullYear();
  curr_date: number = (new Date()).getDate();
  curr_month: number = (new Date()).getMonth();
  maxDate = new Date(this.curr_year, (this.curr_month), (this.curr_date));
  minDate = new Date(this.curr_year - 1, (this.curr_month), (this.curr_date));
  //Reem Validation on Invoice date [End]
  //sara 11-5-2022 [End ]
}
