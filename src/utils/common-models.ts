export interface CardsList {
  id: string,
  name: {
    ar: string,
    en: string
  },
  description: {
    ar: string
    en: string,
  },
  newRequestLink: string,
  draftListLink: string,
  trackListLink: string,
  newImortedRequestLink:string,
  draftImportedListLink:string,
  trackImportedListLink:string,
  icon: string
}

export interface DepartmentBEModel {
  code: string,
  id: number,
  name: {
    ar: string,
    en: string
  },
  description: {
    ar: string,
    en: string
  } | null,
  sections: DepartmentServicesListBEModel[]
}

export interface DepartmentServicesListBEModel {
  servicesList: DepartmentSectionsBEModel[],
  code: string,
  id: number,
  name: {
    ar: string,
    en: string
  },
  description: {
    ar: string,
    en: string
  } | null
}

export interface DepartmentSectionsBEModel {
  serviceTypeDto: ServiceTypeDto | string | null,
  code: string,
  id: number,
  name: {
    ar: string,
    en: string
  },
  itemtypes: ItemTypeDTO[],
  description: { ar: string, en: string } | null
}

export interface DepartmentIntegratingModel {
  code: string,
  id: number,
  name: {
    ar: string,
    en: string
  },
  link: string,
  dropDownStatus: boolean,
  icon: string,
  description: {
    ar: string,
    en: string
  } | null,
  dropdownLinks: DepartmentServicesListBEModel[]
}

export interface DepartmentSectionsIntegratingModel {
  department: string | null,
  code: string,
  id: number,
  name: {
    ar: string,
    en: string
  },
  description: {
    ar: string,
    en: string
  } | null,
  link: string,
  icon: string,
}

export interface MenuObjectCommonKeys {
  RAW_MATERIALS: MenuObjectCommonKeysItem,
  PHARMACEUTICAL_PRODUCTS: MenuObjectCommonKeysItem,
  BIOLOGICAL: MenuObjectCommonKeysItem,
  NARCOTICS: MenuObjectCommonKeysItem,
  DETERGENTS_PESTICIDES: MenuObjectCommonKeysItem,
  COSMETICS: MenuObjectCommonKeysItem,
  EXEMPTION: MenuObjectCommonKeysItem
}

export interface MenuObjectCommonKeysItem {
  baseLink: string,
  baseIcon: string,
  servicesIcon: string,
  newRequestLink: string,
  draftListLink: string,
  trackListLink: string,
  newImortedRequestLink:string,
  draftImportedListLink:string,
  trackImportedListLink:string,
  dropdownLinks: any
}

export interface ServicesPerAdmin {
  id: number,
  serviceDto: ServicesDTO,
  itemTypeList: ItemTypeDTO[]
}

export interface ItemTypeDTO {
  importReasons: ServiceTypeDto,
  code: string,
  id: number,
  name: {
    ar: string,
    en: string
  } | null,
  description: {
    ar: string,
    en: string
  } | null
}

export interface ServicesDTO {
  serviceTypeDto: ServiceTypeDto,
  code: string,
  id: number,
  name: {
    ar: string,
    en: string
  },
  description: {
    ar: string,
    en: string
  } | null
}

export interface ServiceTypeDto {
  code: string,
  id: number,
  name: {
    ar: string,
    en: string
  } | null,
  description: {
    ar: string,
    en: string
  } | null,
  fApprovalRequired?: boolean | null
  fNotification?: boolean | null
}

export interface ImportReasonDTO {
  code: string,
  id: number,
  name: {
    ar: string,
    en: string
  } | null,
  description: {
    ar: string,
    en: string
  } | null,
  importReasons: ServiceTypeDto
}

export interface ServicesPerAdminAfterIntegrating {
  code: string,
  id: number,
  name: {
    ar: string,
    en: string
  },
  description: {
    ar: string,
    en: string
  } | null,
  newRequestLink: string,
  draftListLink: string,
  trackListLink: string,
  newImortedRequestLink:string,
  draftImportedListLink:string,
  trackImportedListLink:string,
  icon: string,
  serviceTypeDto?: ServiceTypeDto | string | null,
  itemTypeList?: ItemTypeDTO[] | null,
}

export interface CustomReleaseModel {
  id: number
  estimatedValue: number,
  bolNo: string,
  FWithinIncluded: boolean,
  releaseTypeId: string,
  applicant: string | number,
  LkupPortsId: number,
  pod: string,
  supplierName: string,
  supplierCountry: string | number,
  carrierName: string,
  grossWeight: number,
  LkupUomId: number,
  receiptNumber: string,
  groupNumber: string,
  receiptValue: number,
  LkupServicesId: number,
  LkupServiceTypeId: number,
  SyslkupServiceActionId: number,
  DueDate: string | number,
  SubmissionDate: string | number,
  FComplete: boolean,
  LkupTrackTypeId: number,
  LkupReqTypeId: number,
  SyslkupWfStatesId: number,
  bolPolicy: number,
  packingList: number,
  receipt: number,
  exportPledge: number,
  importersRecord: number,
  invoice: number,
  invoiceDetails: CustomReleaseInvoiceModel[]
}

export interface CustomReleaseInvoiceModel {
  id: number,
  BolId: number,
  invoiceNo: string,
  FWithinIncluded: boolean,
  invoiceValue: number,
  invoiceDate: string,
  LkupCurrencyId: number,
  LkupCurrencyName: string,
  currency: string | number,
  itemDetails: CustomReleaseItemModel[]
}

export interface CustomReleaseItemModel {
  id: number,
  itemType: string | number,
  importReason: string | number,
  NotificationNo: string,
  shortName: string,
  ProductEnglishName: string,
  flagTypeId: number,
  ManufacturingCountryId: number,
  ManufacturingCompanyId: number,
  batchNo: string,
  quantity: number,
  uomId: number,
  certificateOfOrigin: number,
  companyManufactureRelationship: number,
  legalizedHealthCertificate: number,
  coa: number,
  coc: number,
  premixName: string,
  sourceOfRawMaterial: string,
  IngredientId: number,
  ConcentrationId: number,
  function: string | number,
  materialSafetyDataSheet: number,
  sourceOfRawMaterialAttach: number,
  declarationOfChemicalTreatment: number,
  compositionOfPremixColorsFromManufacturer: number,
  approvalOfThePublicSecurityAuthority: number,
  delegationForImportation: number,
  supplyOrder: number,
  rawMaterialName: string,
  declarationOfFreeOfSalmonella: number,
  packingItemName: string,
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