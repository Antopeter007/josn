export class FCMPaymentsConstants {
  public static DISPLAY_PAYMENT_DETAILS_FIELDS = [
    'paymentDetailsText',
    'payFrom',
    'beneficiaryNameCode',
    'payTo',
    'paymentProductType',
    'currency',
    'amount',
    'effectiveDate',
    'additionalInformation'
  ];

  public static DISPLAY_ADDITIONAL_INFO_FIELDS = [
    'customerReferenceNumber',
    'receiverType',
    'emailID',
    'mobileNumber',
    'debitNarration',
    'creditNarration',
    'leiCode'
  ];

  public static DISPLAY_ADHOC_BENEFICIARY_FIELDS = [
    'accountType',
    'accountNumber',
    'confirmAccountNumber',
    'beneficiaryBankIfscCode',
    'beneficiaryBankIfscCodeIcons',
    'addBeneficiaryCheckbox'
  ];

  static PAYMENT_PRODUCT_TYPE_DEPENDANT_FIELDS = [
    'accountType',
    'accountNumber',
    'confirmAccountNumber',
    'beneficiaryBankIfscCode',
    'emailID',
    'mobileNumber',
    'beneficiaryNameCode',
    'payTo',
    'leiCode'
  ];
  public static ADHOC_BENEFICIARY_FIELDS_ON_EDIT = [
    'accountNumber',
    'beneficiaryBankIfscCode'
  ];

  public static IS_ADHOC_CREDITOR = 'isAdhocCreditor';
  public static CONFIRM_ACCOUNT_NO = 'confirmAccountNumber';
  public static BENE_BANK_IFSC = 'beneficiaryBankIfscCode';
  public static REQUIRED_ADHOC_BENEFICIARY_FIELDS = [
    'accountType',
    'accountNumber',
    'confirmAccountNumber',
    'beneficiaryBankIfscCode'
  ];

  public static HIDE_ADHOC_BENEFICIARY_FIELDS = [
    'payTo'
  ];

  public static FCM_FETCH_DATA_OPTIONS = [
    'clientDetails',
    'paymentPackages'
  ];


  public static FCM_FETCH_DATA_PAYMENT_PACKAGE = [
    'paymentPackages'
  ];

  public static FCM_FETCH_PACKAGE_BASED_OPTIONS = [
    'payFrom',
    'paymentProductType'
  ];


  public static FCM_PAY_FROM = [
    'payFrom'
    ];

  public static FCM_FETCH_CONFIDENTIALITY_CHECKBOX =  'confidentialCheckbox';

  public static FCM_FETCH_HOLIDAY_LIST =  'holidayDate';

  public static FCM_FETCH_PRODUCT_CODE_BASED_OPTIONS = [
    'beneficiaryNameCode',
    'effectiveDate'
  ];

  public static FCM_FETCH_BENEFICIARY_CODE_BASED_OPTIONS = [
    'payTo',
    'receiverType',
    'leiCode'
  ];

  public static FCM_FETCH_ADHOC_BASED_OPTIONS = [
    'beneficiaryBankIfscCode',
    'accountType'
  ];

  public static FCM_PAYMENT_SINGLE_CLIENT_FIELDS = [
    'paymentType',
    'paymentDetailsText',
    'payFrom',
    'paymentProductType',
    'beneficiaryNameCode',
    'payTo',
    'accountType',
    'accountNumber',
    'confirmAccountNumber',
    'BeneficiaryName',
    'beneficiaryCodeView',
    'beneficiaryBankIfscCodeView',
    'beneficiaryBankIfscCode',
    'beneficiaryBankIfscCodeIcons',
    'currency',
    'amount',
    'effectiveDate',
    'addBeneficiaryCheckbox',
    'beneficiaryCode',
    'confidentialCheckbox',
    'additionalInformation',
    'customerReferenceNumber',
    'receiverType',
    'leiCode',
    'emailID',
    'mobileNumber',
    'debitNarration',
    'creditNarration',
    'addEnrichmentField'

  ];

  public static FCM_PAYMENT_SINGLE_PAYMENT_FIELDS = [
    'payFrom',
    'paymentProductType',
    'beneficiaryNameCode',
    'payTo',
    'accountType',
    'accountNumber',
    'confirmAccountNumber',
    'BeneficiaryName',
    'beneficiaryBankIfscCode',
    'beneficiaryBankIfscCodeIcons',
    'beneficiaryCodeView',
    'beneficiaryBankIfscCodeView',
    'currency',
    'amount',
    'effectiveDate',
    'addBeneficiaryCheckbox',
    'beneficiaryCode',
    'confidentialCheckbox',
    'additionalInformation',
    'customerReferenceNumber',
    'receiverType',
    'leiCode',
    'emailID',
    'mobileNumber',
    'debitNarration',
    'creditNarration',
    'addEnrichmentField'

  ];

  public static FCM_ADHOC_BENE_PAYMENT_FIELDS = [
    'clientDetails',
    'legalEntity',
    'beneficiaryCode',
    'BeneficiaryName',
    'beneficiaryStatus',
    'accountNumber',
    'paymentType',
    'packageType',
    'identifierType',
    'beneficiaryBankIfscCode',
    'currency',
    'defaultAccountFlag',
    'accountType',
    'beneficiaryBankBranch'
  ];

  public static FCM_SINGLE_PAYMENT_FIELDS = {
    'accountNumber' : ['creditorDetails','account','id','other','id'],
    'accountType' : ['creditorDetails','account','type'],
    'debtorAccountId' : ['debtorAccount','id','other','id'],
    'beneficiaryNameCode' : ['creditorDetails', 'creditorName'],
    'beneficiaryName' : ['creditorDetails', 'creditorIdentification'],
    'BeneficiaryName' : ['creditorDetails', 'creditorIdentification'],
    'payTo' : ['creditorDetails','account','id','other','id'],
    'beneficiaryBankIfscCode' : ['creditorAgent','otherId'],
    'identifierType' : ['creditorAgent','identifierType'],
    'leiCode' : ['creditorDetails','legalEntityIdentifierCode'],
    'receiverType' : ['creditorDetails','creditorType'],
    'amount' : ['instructedAmountCurrencyOfTransfer2','amount'],
    'currency' : ['instructedAmountCurrencyOfTransfer2','currencyOfTransfer'],
    'debtorAccountType' : ['debtorAccount','type'],
    'debtorCurrency' : ['debtorAccount','currency'],
    'creditorCurrency' : ['creditorDetails','account','currency'],
    'debtorName' : ['debtorAccount','name'],
    'emailID' : ['creditorDetails','emailid'],
    'mobileNumber': ['creditorDetails','mobileNumber'],
    'debitNarration': ['referenceInformation','debitDescription'],
    'creditNarration': ['referenceInformation','creditDescription'],
    'isAdhocCreditor':['creditorDetails','isAdhocCreditor'],
    'addBeneficiaryCheckbox':['creditorDetails','addReceiverToDirectory']
  };

  public static FCM_ADHOC_BENEFICIARY_FIELDS = {
    'beneficiaryStatus' : ['bankAccount','beneficiaryStatus'],
    'paymentType' : ['bankAccount','paymentType'],
    'packageType' : ['bankAccount','packageType'],
    'defaultAccountFlag' : ['bankAccount','isDefaultAccount'],
    'accountNumber' : ['bankAccount','account','id','other','id'],
    'accountType' : ['bankAccount','account','type'],
    'currency' : ['bankAccount','account','currency'],
    'identifierType' : ['bankAccount','benificiaryBank','identifierType'],
    'beneficiaryBankIfscCode' : ['bankAccount','benificiaryBank','otherId'],
    'beneficiaryBankBranch' : ['bankAccount','benificiaryBank','name']
  };

  public static BOOLEAN_CONTROLS = ['confidentialCheckbox','addBeneficiaryCheckbox'];

  public static BENEFICIARY_NAME = 'beneficiaryName';

  public static CREDITOR_AGENT = 'creditorAgent';
  
  public static OTHER_ID = 'otherId';

  public static IDENTIFIER_TYPE = 'identifierType';

  public static NAME = 'name';

  public static SYSTEM = 'SYSTEM';
  
  public static SYSTEM_BRANCH = 'System branch';

  public static BENEFICIARY_ADHOC_NAME = 'BeneficiaryName';

  public static DEBTOR_CURRENCY = 'debtorCurrency';

  public static PAY_FROM = 'payFrom';
  public static DEBTOR_ACCOUNT_TYPE  = 'debtorAccountType';
  public static DEBTOR_NAME  = 'debtorName';
  public static PAYMENT_PRODUCT_TYPE  = 'paymentProductType';
  public static ACCOUNT_TYPE  = 'accountType';
  public static ACCOUNT_NUMBER  = 'accountNumber';
  public static CREDITOR_CURRENCY  = 'creditorCurrency';
  public static AMOUNT = 'amount';
  public static DEBTOR_ACCOUNT_ID  = 'debtorAccountId';
  public static BENEFICIARY_TYPE_ADHOC = 'Adhoc';
  public static BENEFICIARY_TYPE_EXISTING = 'Existing';

  static FCM_UPCOMING_PAYMENTS = [
    'upcomingPayments'
    ];
  static FCM_SELECTED_DATE_PAYMENTS = [
    'selectedDatePayments'
    ];
  static FCM_SELECTED_DATE_PACKAGES = [
    'clientPackagePayments'
    ];

    public static FCM_ADD_BATCH_INSTRUMENT_FIELD = {
      'beneficiaryName' : ['creditorDetails', 'creditorIdentification'],
      'BeneficiaryName' : ['creditorDetails', 'creditorIdentification'],
      'beneficiaryNameCode' : ['creditorDetails', 'creditorName'],
      'receiverType' : ['creditorDetails','creditorType'],
      'amount' : ['instructedAmountCurrencyOfTransfer2','amount'],
      'currency' : ['instructedAmountCurrencyOfTransfer2','currencyOfTransfer'],
      'payTo' : ['creditorDetails','account','id','other','id'],
      'debtorAccountId' : ['debtorAccount','id','other','id'],
      'debitorType' : ['debtorAccount', 'type'],
      'debitorCurrency' : ['debtorAccount', 'currency'],
      'debitorName' : ['debtorAccount', 'name'],
      'identifierType' : ['creditorAgent','identifierType'],
      'accountNumber' : ['creditorDetails','account','id','other','id'],
      'leiCode' : ['creditorDetails','legalEntityIdentifierCode'],
      'creditorAccountCurrency' : ['creditorDetails','account','currency'],
      'creditorAccountType' : ['creditorDetails','account','type'],
      'creditorType' : ['creditorDetails','creditorType'],
      'beneficiaryBankIfscCode' : ['creditorAgent','otherId'],
      'debitNarration': ['referenceInformation','debitDescription'],
      'creditNarration': ['referenceInformation','creditDescription'],
      'isAdhocCreditor':['creditorDetails','isAdhocCreditor'],
      'addBeneficiaryCheckbox':['creditorDetails','addReceiverToDirectory']
    };

    public static DISPLAY_BENE_CODE = [
      'beneficiaryCode'
    ];

    public static  BULK_CONFIDENTIAL_CHECKBOX = ['confidentialCheckbox'];

    public static ENRICHMENT_SAVE_CANCEL = [
      'save',
      'cancel'
    ]
    public static FCM_ENRICHMENT_SAVE_ADD_NEW = "saveAndAddNew";
    public static SINGLE_TAB = "single";
    public static BULK_TAB = "bulk";
    public static FCM_ENRICHMENT_ADD_NEW = "addNew";
    public static FCM_ENRICHMENT_CANCEL = "cancel";
    public static FCM_ENRICHMENT_UPDATE = "update";
    public static ADD_ENRICHMENT_FIELD = 'addEnrichmentField';
    public static ENRICHMENT_FIELD_HEADER = 'enrichmentFieldsHeader';
    public static ORIGNAL = "Orignal";
    public static DELETE_ENRICHMENT = "deleteEnrichment";
    public static DELETE_ENRICHMENT_CONFIRM = "deleteEnrichmentConfirmationMsg";
    public static ENRICHMENT_DETAILS_HEADER= "enrichmentDetailsHeader";
    public static ENRICHMENT_DETAILS_TRANSACTION= "enrichmentDetailsTransaction";
    public static MULTI_SET = "multiSet";
    public static SINGLE_SET = "singleSet";

    public static FCM_BATCH_ACCORDION_PAYMENT_FIELDS = [
      'payFrom',
      'paymentProductType',
      'beneficiaryNameCode',
      'payTo',
      'accountType',
      'accountNumber',
      'confirmAccountNumber',
      'beneficiaryBankIfscCode',
      'beneficiaryBankIfscCodeIcons',
      'currency',
      'amount',
      'effectiveDate',
      'addBeneficiaryCheckbox',
      'beneficiaryCode',
      'confidentialCheckbox',
      'additionalInformation',
      'customerReferenceNumber',
      'receiverType',
      'leiCode',
      'emailID',
      'mobileNumber',
      'debitNarration',
      'creditNarration',
      'addEnrichmentField'

    ];
    //public static  BULK_CONFIDENTIAL_CHECKBOX =[];

    public static FCM_BATCH_FIELDS = ['paymentType','paymentNoOfTransaction','paymentTransactionAmt'];

    public static FCM_BATCH_STATUS_FIELDS_NON_ADHOC = ['payFrom','paymentProductType','beneficiaryNameCode',
  'payTo','currency','amount','effectiveDate','customerReferenceNumber','receiverType','leiCode','emailID', 
  'mobileNumber','debitNarration','creditNarration'];

    public static FCM_BATCH_STATUS_NON_ADHOC = {payTo:true};

    public static FCM_BATCH_STATUS_ADHOC = {accountType:true,
        accountNumber:true,confirmAccountNumber :true,beneficiaryBankIfscCode:true};

    public static FCM_BATCH_COMMON_FIELDS = {payFrom :true,paymentProductType:true,beneficiaryNameCode:true,
      currency:true,amount:true,effectiveDate:true,customerReferenceNumber:true,receiverType:true,leiCode:true,
      emailID:true,mobileNumber:true,debitNarration:true,creditNarration:true}

    public static FCM_PAYMENT_FIELDS = ['payFrom','paymentProductType','beneficiaryNameCode',
      'payTo','currency','amount','effectiveDate','additionalInformation','addEnrichmentField','savePayment','cancel'];

    public static FCM_ADHOC_PAYMENT_FIELDS = ['payFrom','paymentProductType','beneficiaryNameCode',
      'accountType','accountNumber','confirmAccountNumber','beneficiaryBankIfscCode',,'beneficiaryBankIfscCodeIcons','currency','amount',
      'effectiveDate','addBeneficiaryCheckbox','addEnrichmentField','additionalInformation','savePayment','cancel'];

    public static FCM_PAYMENT_COLUMNS = ['payFrom','paymentProductType','beneficiaryType','beneficiaryNameCode','beneficiaryCode'
      ,'payTo','currency','amount', 'beneficiaryBankIfscCode','effectiveDate'];

    public static FCM_BATCH_ADHOC_PAYMENT_FIELDS = ['accountType','accountNumber','confirmAccountNumber',
      'beneficiaryBankIfscCode','addBeneficiaryCheckbox'];

    public static FCM_PAYMENT_RESET_FIELDS = ['payFrom','paymentProductType','beneficiaryNameCode','payFrom',
      'payTo','currency','amount','effectiveDate','additionalInformation','addEnrichmentField','savePayment','cancel','beneficiaryName','BeneficiaryName'];

    public static PAYMENTS_TABLE = 'paymentsTable';

    public static PAYMENTS = 'payments';

    public static ADD_PAYMENT = 'addPayment';

    public static ADD_PAYMENT_FLAG = 'addPaymentFlag';

    public static SAVE_PAYMENT = 'savePayment';
    public static UPDATE_PAYMENT = 'updatePayment';
    public static CANCEL_PAYMENT = 'cancel';
    public static PAYMENT_NO_OF_TRANSACTIONS = 'paymentNoOfTransaction';
    public static FCM_BATCH_RESET_FIELDS = ['paymentType','paymentNoOfTransaction','paymentTransactionAmt'];
    public static PAYMENT_REFERENCE_NUMBER = 'paymentRefNo';
    public static PAYMENT_REFERENCE = 'paymentReference';
    public static PAYMENT_TRANSACTION_AMT = 'paymentTransactionAmt';
    public static CREDITOR_ACCOUNT_CURRENCY = 'creditorAccountCurrency';
    public static CREDITOR_ACCOUNT_TYPE = 'creditorAccountType';
    public static BALANCE_NO_OF_TRANSACTION = 'balanceTransaction';
    public static BALANCE_TRANSACTION_AMOUNT = 'balanceAmount';
    public static MODIFY_BATCH = 'MODIFY_BATCH';
    public static FCM_BATCH_INSTRUMENT_FORM_FIELD_MAPPING = {
      'payFrom' : ['debtorAccount', 'id', 'other', 'id'],
      'paymentProductType' : ['paymentbankproduct'],
      'beneficiaryNameCode' : ['creditorDetails','creditorName'],
      'payTo' : ['creditorDetails', 'account','id','other','id'],
      'currency' : ['instructedAmountCurrencyOfTransfer2','currencyOfTransfer'],
      'amount' : ['instructedAmountCurrencyOfTransfer2','amount'],
      'effectiveDate' : ['requestedExecutionDate'],
      'accountType' : ['creditorDetails','account','type'],
      'debtorAccountId' : ['debtorAccount','id','other','id'],
      'debitorType' : ['debtorAccount', 'type'],
      'debitorCurrency' : ['debtorAccount', 'currency'],
      'debitorName' : ['debtorAccount', 'name'],
      'identifierType' : ['creditorAgent','identifierType'],
      'accountNumber' : ['creditorDetails','account','id','other','id'],
      'confirmAccountNumber' : ['creditorDetails','account','id','other','id'],
      'creditorAccountCurrency' : ['creditorDetails','account','currency'],
      'creditorAccountType' : ['creditorDetails','account','type'],
      'receiverType' : ['creditorDetails','creditorType'],
      'leiCode' : ['creditorDetails','legalEntityIdentifierCode'],
      'beneficiaryBankIfscCode' : ['creditorAgent','otherId'],
      'customerReferenceNumber' : ['paymentReference'],
      'beneficiaryCodeView' : ['creditorDetails', 'creditorIdentification'],
      'emailID' : ['creditorDetails', 'emailid'],
      'mobileNumber': ['creditorDetails', 'mobileNumber'],
      'isAdhocCreditor':['creditorDetails','isAdhocCreditor'],
      'addBeneficiaryCheckbox':['creditorDetails','addReceiverToDirectory']
    };
    public static CUSTOMER_REFERENCE_NUMBER = 'customerReferenceNumber';
    public static COUNTER_NO_OF_TRANSACTION = 'counterTransaction';
    public static COUNTER_TRANSACTION_AMOUNT = 'counterTransactionAmount';
    public static PAYMENT_REFERENCE_NUMBER_FIELD = 'paymentReferenceNumber';

    public static enrichmentFlags = {
      hasEnrichmentFields : false,
      isEnrichTypeMultiple : true,
      isEnrichmentBtnClicked : false,
      isFieldLoadedOnScreen : false,
      isModeNew: true,
      isPackageChanged: false,
      loadEnrichDataAutoSaveFlag : false,
      isSaveValid : false,
      preloadData : false,
      isEditMode : false,
      hasRequiredField : false
    }
    public static enrichmentConfig = {
      enrichmentFields: {},
      enrichmentFieldsName : [],
      columnOrder : [],
      editRecordIndex : 0,
      tempRowData : {}
    }
    public static PAYMENT_REF_NUMBER = 'paymentRefNumber';
    public static DEBIT_NARRATION = 'debitNarration';
    public static CREDIT_NARRATION = 'creditNarration';
    public static EMAILID = 'emailID';
    public static MOBILE_NUMBER = 'mobileNumber';
    public static CREDITOR_IDENTIFICATION = 'creditorDetails@creditorIdentification';
    public static BENEFICIARY_BANK = 'benificiaryBank';
    public static BANK_ACCOUNT = 'bankAccount';
    public static ACCT_NUMBER = "accountNumber";
    public static IFSC_SEARCH_ICON = 'beneficiaryBankIfscCodeIcons';
}
