export module Inspection {

    export interface ItemDetailCommentDto {
        Id: number;
        ShortName: string;
        Quantity: string;
        UomName: string;
        ManufacturingCountryName: string;
        ItemTypeName: string;
        ProductEnglishName?: any;
        FlagTypename?: any;
        BatchNo?: any;
        SourceOfRawMaterialAttach?: any;
        ManufacturingCompanyName?: any;
    }

    export interface ItemDetail {
        id: number;
        invoiceId: number;
        shortName: string;
        productEnglishName?: any;
        batchNo?: any;
        quantity: number;
        fConformity?: any;
        packingItemName?: any;
        rawMaterialName?: any;
        premixName?: any;
        function?: any;
        sourceOfRawMaterialId?: any;
        itemTypeId: number;
        itemTypeName: string;
        flagTypeId: number;
        flagTypename?: any;
        importReasonId?: any;
        importReasonName?: any;
        manufacturingCountryId?: any;
        manufacturingCountryName: string;
        manufacturingCompanyId?: any;
        manufacturingCompanyName?: any;
        uomId?: any;
        uomName: string;
        lkupConformityCommentsId?: any;
        concentrationId?: any;
        concentrationName?: any;
        ingredientId?: any;
        ingredientName?: any;
        premixBatchesId: number;
        certificateOfOrigin?: any;
        companyManufactureRelationship?: any;
        legalizedHealthCertificate?: any;
        coa?: any;
        coc?: any;
        materialSafetyDataSheet?: any;
        sourceOfRawMaterialAttach?: any;
        declarationOfChemicalTreatment?: any;
        compositionOfPremixColorsFromManufacturer?: any;
        approvalOfThePublicSecurityAuthority?: any;
        delegationForImportation?: any;
        supplyOrder?: any;
        declarationOfFreeOfSalmonella?: any;
        ItemDetailCommentDto: ItemDetailCommentDto;
    }

    export interface InvoiceCommentDto {
        Id: number;
        InvoiceNo: string;
        InvoiceDate: string;
        InvoiceValue: string;
        LkupCurrencyName: string;
        ApprovalInvoiceNo?: any;
        SupplierName?: any;
    }

    export interface Invoice {
        id: number;
        bolId: number;
        invoiceNo: string;
        fWithinIncluded: boolean;
        invoiceValue: number;
        invoiceDate: Date;
        lkupCurrencyId: number;
        lkupCurrencyName: string;
        itemDetails: ItemDetail[];
        invoiceAttachments?: any;
        approvalInvoiceNo?: any;
        supplierName?: any;
        InvoiceCommentDto: InvoiceCommentDto;
    }

    export interface RequestDetailsCommentDto {
        BolNo: string;
        ReleaseTypeName: string;
        LkupPortsName: string;
        ReceiptNumber: string;
        GroupNumber?: any;
        ReceiptValue: string;
        LkupUomName: string;
        GrossWeight: string;
        LkupServiceTypeName: string;
    }

    export interface jsonRequestComments {
        id: number;
        releaseTypeId: number;
        releaseTypeName: string;
        bolNo?: any;
        estimatedValue: number;
        fWithinIncluded: boolean;
        applicant: number;
        lkupPortsId: number;
        lkupPortsName: string;
        pod?: any;
        supplierName?: any;
        supplierCountryId?: any;
        grossWeight: number;
        lkupUomId: number;
        lkupUomName: string;
        receiptNumber: string;
        groupNumber: string;
        receiptValue: number;
        carrierName?: any;
        lkupServicesId: number;
        lkupServicesName?: any;
        lkupServiceTypeId: number;
        lkupServiceTypeName: string;
        syslkupServiceActionId: number;
        syslkupServiceActionName?: any;
        dueDate?: any;
        companyRolesId?: any;
        lkupTrackTypeId?: any;
        lkupTrackTypeName?: any;
        fComplete?: any;
        syslkupWfStatesId: number;
        syslkupWfStatesName?: any;
        createdBy?: any;
        mobile?: any;
        email?: any;
        company: string;
        bolPolicy?: any;
        packingList?: any;
        receipt?: any;
        exportPledge?: any;
        importersRecord?: any;
        invoice?: any;
        invoices: Invoice[];
        RequestDetailsCommentDto: RequestDetailsCommentDto;
    }

      export interface IStepComments {
        jsonRequestComments: jsonRequestComments;
        requestId: number;
        stepSequenceDescription: string;
        stepSequenceId: number;
        wfTypeId: number;
    }

}

