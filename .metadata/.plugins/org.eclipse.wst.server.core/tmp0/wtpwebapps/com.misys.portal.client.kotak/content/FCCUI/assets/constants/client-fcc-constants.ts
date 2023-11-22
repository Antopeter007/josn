export class ClientFccConstants {
  static CURRENCY = 'currency';
  static GLOBAL = 'GLOBAL';
  static TRADE = 'TRADE';
  static INPUT_DTM = "inp_dttm";
  static DATE_EXP = "&#x2f;"
  static INVALID_DATE = "Invalid Date";
  static BARCHART = "bar";
  static POLARAREA_CHART = "polarArea";
  static ALLOW_MULTI_CUR = 'allow_multi_cur';
  static LICENSE_PRODUCT_CODE = 'LicenseProduct@product_code';
  static TRANSACTION_INPROGRESS_BANK = "Transaction In Progress with Bank";
  static PENDING_APPROVAL_LISTDEF = "core/listdef/customer/MC/openPendingApprovalMCList";
  static TRANSACTION_INPROGRESS_LISTDEF = "core/listdef/customer/MC/openTransactionInProgressListClient";
  static ACTION_REQUIRED_LISDEF ="core/listdef/customer/MC/openActionRequiredListClient";
  static ACTION_REQUIRED_LISTDEF_CORE = "core/listdef/customer/MC/openActionRequiredList";
  static IMPORT_PRODUCTS = ['BG', 'LC', 'LI', 'SG', 'SI'];
  static EXPORT_PRODUCTS = ['BR', 'EL', 'SR'];
  static OUTSTANDING_PRODUCT_ARRAY = ['IC', 'IP', 'EC', 'INV', 'EL', 'LI'];
  static SESSION_INVALID = "SESSION_INVALID";
  static REST_API_SUCCESS = "REST_API_SUCCESS";
  static APP_JSON = 'application/json';
  static LABELS = '"labels": ';
  static DATASET = '"datasets": [';
  static IMPORT = "import";
  static EXPORT = "export";
  
  /**
   * API related constants
   */
   static CONTEXT_PATH = 'CONTEXT_PATH';
   static SERVLET_NAME = 'SERVLET_NAME';
   static RESTSERVLET_NAME = 'RESTPORTAL_NAME';

   //Available balance category
   static PRODUCT = "product";
   static SUB_PRODUCT = "subProduct";
   static CCY = "ccy";
   static SUB_PRODUCT_CATEGORY = "subProductCategory";
   static AMOUNT = "Amount";
   static TRANSACTION_CURRENCY = "transactionCurrency";
   static CLIENT_SUB_PRODUCT = "clientSubProductBill";

   /**
    *  CSS Related Constants
    */
   static BODY_SCROLL_INTIAL = 'initial';
   static BODY_SCROLL = 'scroll';
   static N004_CONTROLLED = '03';

  static CURRENT_ACCOUNT = "01";
  static SAVING_ACCOUNT = "03";
  static OVERDRAFT_ACCOUNT = "23";
  static FOREIGN_BILL_ACCOUNT = "17";

  //Production Fixes
  static XLS_CURRENT_DOWNLOAD = 'XLS_current';
  static XLS_FULL_DOWNLOAD = 'XLS_full';

  // Phase 3 changes
  static VIEW_INFO_POPUP_PAYMENT_WIDGET_LIST = ['payments/listdef/paymentStatusWidget'];
   static STRING_TRUE = 'true';
   static FCM = 'FCM';
   static FCM_PAYMENT_PAYMENT_TYPE = 'paymentType';
   static FCM_CLIENT_CODE_DETAILS = 'clientDetails';
   static FCM_BENEFICIARY_IFSC_DATA_OPTIONS = [
    'beneficiaryBankIfscCode'
    ];

    static FCM_BENEFICIARY_PACKAGE_DATA_OPTIONS = [
      'packages'
      ]; 
   static PARAM_ID = 'parm_id';
  static DATA_8 = 'data_8';
  static BENEFICIARY_ACC = 'beneficiaryAct';
  //FCM beneficiary related constants
  static FCM_ACCOUNT_CURRENCY = 'accountCurrency';
  static BENE_BANK_IFSC_CODE = 'beneficiaryBankIfscCode';
  static BENEFICIARY_BANK_CODE = 'beneficiaryBankCode';
  static BENEFICIARY_BANK_NAME = 'beneficiaryBankName';
  static BENEFICIARY_BRANCH_CODE = 'beneficiaryBranchCode';
  static BENEFICIARY_BANK_BRANCH = 'beneficiaryBankBranch';
  static BENE_BANK_KOTAK_IFSC_CODE = 'KKBK';
  static FCM_PAYMENT_PAYMENT_TYPE_IN_HOUSE_TRANSFER = '04';
  static FCM_PAYMENT_PAYMENT_TYPE_INTERBANK_TRANSFER = '06';
  static FCM_AMOUNT_LIMIT = 'amountLimit';
  static FCM_ISO_CODE = 'INR';
  static FCM_PAYMENT_AMOUNT = 'amount';
  public static CREDITOR_CURRENCY  = 'creditorCurrency';
  static FCM_BENEFICIARY_IFSC_DATA_OPTION = 'beneficiaryBankIfscCode';
  static EXTERNAL_ACCOUNTS = 'externalAccount';
  static PAYMENTS_OVERVIEW = 'PAYMENTS_OVERVIEW';
  static DISPLAY_TOTAL_BALANCE = 'displayTotalBalance';
  static ALL_ACCOUNTS = 'ALL_ACCOUNTS';
  static FCM_BENEFICIARY_CODE = 'beneficiaryCode';
  public static BENEFICIARY_NAME = 'beneficiaryName';
  static FCM_SWITCH_HYPERLINK_AND_IMG = 'switchHyperlinkAndImg';
  static FCM_SWITCH_IMG_PATH = 'switchImgPath';
  static WIDGET_CONTAINER = '.widget-container';
  static STYLE_NONE = 'none';
  static RIGHT_HEADER_SECTION = '.rightHeaderSection';
  static STYLE_BLOCK = 'block';
  static STYLE_FLEX = 'flex';
  static SUMMARY_DETAILS = 'summaryDetails';
  static FCM_CURRENCY = 'currency';
  public static IS_ADHOC_CREDITOR = 'isAdhocCreditor';
  static ENRICHMENT_LIST_DATA = 'enrichmentListData';
  static DATA = 'data';
  static FCM_ENRICHMENT_BY_PACKAGE = 'enrichmentFieldsByPackageId';
  static FCM_PAYMENT_PACKAGES = 'paymentPackages';
  public static MODIFY_BATCH = 'MODIFY_BATCH';
  static VIEW_CHEQUE_STATUS_LISTDEF = 'cash/listdef/customer/AB/viewChequeStatus';
  static BATCH_DETAILS_LISTDEF = '/payments/listdef/paymentsFCMBatchDetailsList';
  public static FCM_PAYMENT_COLUMNS = ['payFrom','paymentProductType','beneficiaryNameCode','beneficiaryCode','payTo','currency','amount', 'beneficiaryBankIfscCode','effectiveDate'];
  public static NEXT_BUTTON_DISABLE_FCM_CONTAINER_TYPE = 'disable.next.button.container.type';
  static BENEFICIARY_DATE_FORMAT_PARAM = 'beneficiary';
  static PAYMENTS_FILTER_POPUP_PARAM = '/payments/listdef';
  static BENEFICIARY_DATE_FORMAT_PARAM_LIST = ['bankAccount@initiationDate','bankAccount@initiationDate2','initiationDate','initiationDate2'];
  static FCM_PAYMENT_APPROVAL_LISTDEF = '/payments/listdef/paymentsPendingMyApprovalFCMList';
  static FCM_SEND_SCRAP_LISTDEF = '/payments/listdef/paymentsPendingSendFCMList';
  static EXISTING_BENE_CODE = 'existingBeneficiaryCode';
  static FCM_BENEFECIARY_NAME = 'BeneficiaryName';
  static ASYNC_ACCOUNT_SUMMARY_LISTDEF = '/trade/listdef/customer/SE/openExistingAsyncAccountStatementList';
  static ADDITIONAL_DETAILS = 'additionalDetails';
  static ACC_SUMMARY = 'accSummary';
}