export class ScreenMapping {

    // Mapping Not Yet Completed need to add logic for considering sub product code.
    static screenmappings = {

     LC: 'LetterOfCreditScreen',
     LI : 'LetterOfIndemnityScreen',
     SG : 'ShippingGuaranteeScreen',
     TF : 'FinancingRequestScreen',
     BG : 'BankerGuaranteeScreen',
     BR : 'GuaranteeReceivedScreen',

     EC : 'ExportCollectionScreen',
     SI : 'StandbyIssuedScreen',
     SR : 'StandbyReceivedScreen',
     IC : 'ImportCollectionScreen',
     RI : 'ReceivedLetterOfIndemnityScreen',
     EL : 'ExportLetterOfCreditScreen',

     IR : 'InwardRemittanceScreen',
     DM : 'DocumentManagementScreen',
     SE : 'SecureEmailScreen',
     FA : 'FactoringScreen',
     // 'FT' :'TradeFundTransferScreen',
     LS : 'LicenseScreen',

    // Cash

     TD : 'TermDepositScreen',
     TD_CSTD : 'TermDepositScreen',
     FB : 'BillEnquiryScreen',
     XO : 'ForeignExchangeOrderScreen',
     AB : 'AccountBalanceScreen',
     LA : 'CashLoanScreen',
     FT : 'FundTransferScreen',
     FT_INT : 'FundTransferScreen',
     FT_DOM : 'FundTransferScreen',
     FT_TPT : 'FundTransferScreen',
     FT_MT103 : 'FundTransferScreen',
     FT_MT101 : 'FundTransferScreen',
     FT_FI103 : 'FundTransferScreen',
     FT_FI202 : 'FundTransferScreen',
     FT_BILLP : 'FundTransferScreen',
     FT_BILLS : 'FundTransferScreen',

     FT_PICO : 'FundTransferScreen',
     FT_PIDD : 'FundTransferScreen',
     FT_COCQI : 'FundTransferScreen',
     FT_COCQS : 'FundTransferScreen',

     FT_CQBKR : 'FundTransferScreen',
     PO : 'PurchaseOrderScreen',
     SO : 'SellOrderScreen',
     IN_ISO : 'InvoiceScreen',
     SMP_SMP : 'InvoiceScreen',


     BK : 'BulkScreen',
     TO : 'TransferOrderScreen',
     SP : 'SweepScreen',
     // 'FT' :'PIScreen',
     // 'FT' :'RemittanceScreen',
     // 'FT' :'RemittanceFIScreen',
     // 'FT' :'BillPaymentScreen',
     // 'FT' :'ChequeServicesScreen',

    // Loan
    //  'SE' :'DocumentTrackingScreen',
    // 'LN' :'BillScreen',
     LN : 'LoanScreen',
     IN : 'InvoiceScreen',
     IP : 'InvoicePayableScreen',
     CN : 'CreditNoteScreen',
     CR : 'CreditNoteCRScreen'
    };
}
