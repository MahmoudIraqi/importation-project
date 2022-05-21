export interface cosmaticsReleaseModel
{
    id: number,
    releaseTypeId: number,
    bolNo: string,
    estimatedValue:number,
    fWithinIncluded: boolean,
    lkupPortsId: number,
    pod: string,
    grossWeight: number,
    lkupUomId: number,
    receiptNumber: string,
    groupNumber: string,
    receiptValue: number,
    lkupServicesId: number,
    lkupServiceTypeId: number,
    syslkupServiceActionId: number,
    lkupTrackTypeId: number,
    importerLicenseNo:string,
    fRefrencedCountry:boolean,
    customCertificate:string,
    noOfItems: number,
    invoices: invoices[]
}
  export interface invoices {
    id: number,
    bolId: number,
    invoiceNo: string,
    fWithinIncluded: boolean,
    invoiceValue: number,
    invoiceDate: string,
    lkupCurrencyId: number,
    approvalInvoiceNo:string,
    supplierName: string,
    supplierCountryId: number,
    noOfItems: number,
    releaseItemDtos: releaseItemDtos[]
  }
  
  export interface releaseItemDtos {
    id: number,
    itemTypeId: number,
    itemName: string,
    lkupCountryId: number,
    quantity: number,
    lkupUomId: number,
    fConformity : boolean,
    lkupConformityCommentsId:number,
    approvalItemNo:string,
    itemPrice: number,
    lkupCurrencyId:number,
    fRegisteredProduct: boolean,
    foc:number,
    workingStandard:number,
    itemCosmPackDto:itemCosmPackDto,
    itemCosmProductDto:itemCosmProductDto,
    itemPremixDto:itemPremixDto,
    itemRawMaterialDto:itemRawMaterialDto,
  }
  export interface itemCosmPackDto
   { 
    id: number,
    lkupPackingId: number,
    lkupManufactoryId: number,
    batchNo: string
  }
  export interface itemCosmProductDto {
  id: number,
  productId: number,
  notificationNo:string,
  productName: string,
  productShortname: string,
  flagType: string,
  lkupManufactoryId:number,
  batchNo: string,
  volume: string,
  lkupUomId: number,
  packingDescription: string,
  lkupPackingTypeId: number,
  fCartonbox: boolean,
  productColour: string,
  fragrance: string,
  flavor: string,
  barcode: string,

  productIngredientDtos:productIngredientDtos[]
}
  export interface productIngredientDtos {
    id: number,
    itemProductId: number,
    concentration: number,
    functionId:number,
    inciName: string
  }
  export interface itemPremixDto{
    id: number,
    premixBatchesId: number,
    lkupManufactoryId: number,
    sourceRawMaterialId: number
  }
  export interface itemRawMaterialDto
  {
    id: number,
    ingredientsId: number,
    cosingRefNo: number,
    inciName: string,
    lkupManufactoryId: number,
    manufacturingCompany: string,
    sourceRawMaterialId: number
  }