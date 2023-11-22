export class Constants {
  public static MODE_DRAFT = 'DRAFT';
  public static OPTION_ACTION_REQUIRED = 'ACTION_REQUIRED';
  public static OPTION_CLAIM_PROCESSING = 'CLAIM_PROCESSING';
  public static OPTION_SCRATCH_GUARANTEE = 'SCRATCH_GUARANTEE';
  public static OPTION_CANCEL = 'CANCEL';
  public static OPTION_EXISTING = 'EXISTING';
  public static OPTION_REJECTED = 'REJECTED';
  public static OPTION_TEMPLATE = 'TEMPLATE';
  public static OPTION_SAVE_TEMPLATE = 'SAVE_TEMPLATE';
  public static OPERATION_MODIFY_TEMPLATE = 'MODIFY_TEMPLATE';
  public static OPERATION_DELETE_TEMPLATE = 'DELETE_TEMPLATE';
  public static MODE_UNSIGNED = 'UNSIGNED';
  public static MODE_AMEND = 'AMEND';
  public static LAST_SHIP_DATE = 'Last Shipment Date';
  public static EARLIEST_SHIP_DATE = 'Earliest Shipment Date';
  public static X_CHAR = 'X-Char';
  public static Z_CHAR = 'Z-Char';
  public static REGEX_AMOUNT = '^\\d{1,13}(\\.\\d{1,2})?$';
  public static REGEX_AMOUNT_DECIMAL_0 = '^\\d{1,13}$';
  public static REGEX_AMOUNT_DECIMAL_1 = '^\\d{1,13}(\\.\\d{1,1})?$';
  public static REGEX_AMOUNT_DECIMAL_2 = '^\\d{1,13}(\\.\\d{1,2})?$';
  public static REGEX_AMOUNT_DECIMAL_3 = '^\\d{1,12}(\\.\\d{1,3})?$';
  public static REGEX_AMOUNT_DECIMAL_4 = '^\\d{1,11}(\\.\\d{1,4})?$';
  public static REGEX_AMOUNT_DECIMAL_5 = '^\\d{1,10}(\\.\\d{1,5})?$';
  public static REGEX_AMOUNT_DECIMAL_6 = '^\\d{1,9}(\\.\\d{1,6})?$';
  public static REGEX_AMOUNT_DECIMAL_7 = '^\\d{1,8}(\\.\\d{1,7})?$';
  public static REGEX_AMOUNT_DECIMAL_8 = '^\\d{1,7}(\\.\\d{1,8})?$';
  public static REGEX_AMOUNT_DECIMAL_9 = '^\\d{1,6}(\\.\\d{1,9})?$';
  public static REGEX_AMOUNT_DECIMAL_10 = '^\\d{1,5}(\\.\\d{1,10})?$';
  public static REGEX_AMOUNT_DECIMAL_11 = '^\\d{1,4}(\\.\\d{1,11})?$';
  public static REGEX_AMOUNT_DECIMAL_12 = '^\\d{1,3}(\\.\\d{1,12})?$';
  public static REGEX_AMOUNT_DECIMAL_13 = '^\\d{1,2}(\\.\\d{1,13})?$';
  public static REGEX_AMOUNT_DECIMAL_14 = '^\\d{1,1}(\\.\\d{1,14})?$';
  public static REGEX_AMOUNT_DECIMAL_0_FR = '^[0-9]{1,3}(?:\u{0020}?[0-9]{3})*?$';
  public static REGEX_AMOUNT_DECIMAL_1_FR = '^[0-9]{1,3}(?:\u{0020}?[0-9]{3})*(?:\,[0-9]{1,1})?$';
  public static REGEX_AMOUNT_DECIMAL_2_FR = '^[0-9]{1,3}(?:\u{0020}?[0-9]{3})*(?:\,[0-9]{1,2})?$';
  public static REGEX_AMOUNT_DECIMAL_3_FR = '^[0-9]{1,3}(?:\u{0020}?[0-9]{3})*(?:\,[0-9]{1,3})?$';
  public static REGEX_AMOUNT_DECIMAL_0_AR = '^[0-9]{1,3}(?:\u{066C}?[0-9]{3})*?$';
  public static REGEX_AMOUNT_DECIMAL_1_AR = '^[0-9]{1,3}(?:\u{066C}?[0-9]{3})*(?:\u{066B}[0-9]{1,1})?$';
  public static REGEX_AMOUNT_DECIMAL_2_AR = '^[0-9]{1,3}(?:\u{066C}?[0-9]{3})*(?:\u{066B}[0-9]{1,2})?$';
  public static REGEX_AMOUNT_DECIMAL_3_AR = '^[0-9]{1,3}(?:\u{066C}?[0-9]{3})*(?:\u{066B}[0-9]{1,3})?$';
  public static REGEX_AMOUNT_JPY = '^\\d{1,13}$';
  public static REGEX_TOLERANCE = '^\\d*$';
  public static REGEX_AMOUNT_BHD = '^\\d{1,12}(\\.\\d{1,3})?$';
  public static REGEX_PERCENTAGE = '^\\d{1,3}(\\.\\d{1,3})?$';
  public static REGEX_X_CHARSET = '^[a-zA-Z0-9 :\u{0105}\u{0104}\u{0107}\u{0106}\u{0119}\u{0118}\u{0142}\u{0141}\u{0144}\u{0143}\u{00f3}\u{00d3}\u{015b}\u{015a}\u{017a}\u{0179}\u{017c}\u{017b}\,\/\'?.+()\\r\\n-]*$';
  public static REGEX_Z_CHARSET = '^[a-zA-Z0-9 :\,\/\'?.+()\\r\\n=@#{!\"%&*;<>_-]*$';
  public static X_CHARSET_ERROR = 'A-Za-z0-9/-?:().,\'+SPACE Crlf ';
  public static Z_CHARSET_ERROR = 'A-Za-z0-9/-?:().,\'+SPACE Crlf =!"%&*<>;@#_{';
  public static REGEX_NUMBER = '^[0-9]*$';
  public static REGEX_CURR_COMMA = '^[0-9]{1,3}(?:,?[0-9]{3})*(?:\.[0-9]{1,2})?$';
  public static REGEX_BIC_CODE = '^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$';
  public static REGEX_CURRENCY = '^[a-zA-Z]+$';
  public static EMAIL = '^([!#-\/\'*+\\-\\/-9=?A-Z^-~]+[.])*[!#-\/\'*+\\-\\/-9=?A-Z^-~]+@[a-zA-Z0-9.-]+[\.]+[a-zA-Z0-9.-]+$';
  public static PHONE_NUMBER = '^[+]?[0-9()-]*$';
  public static TYPE_AMEND = '03';
  public static TYPE_NEW = '01';
  public static TYPE_INQUIRE = '13';
  public static TYPE_STOPOVER = '17';
  public static TYPE_REPORTING = '15';
  public static PRODUCT_CODE_IU = 'BG';
  public static PRODUCT_CODE_RU = 'BR';
  public static WEB_ADDRESS = '^(http(s)?:\/\/\\.)?(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*)$';
  public static SUCCESS = 'SUCCESS';
  public static ENQUIRE_STATUS_CLAIM_PROCESSING = 'CLAIM PROCESSING';
  public static ENQUIRE_STATUS_CLAIM_PRESENTATION = 'CLAIM PRESENTATION';
  public static UPDATE_ENTITY = 'UPDATE_ENTITY';
  public static MIN_YEAR = '5';
  public static MAX_YEAR = '30';
  public static OPERATION_SUBMIT = 'SUBMIT';
  public static REAUTH_OPERATION_RETURN = 'RETURN_TRANSACTION';
  public static RESPONSE_FAILURE = 'FAILURE';
  public static RESPONSE_REAUTH_FAILURE = 'REAUTH_FAILURE';
  public static REAUTH_TYPE_PASSWORD = 'PASSWORD';
  public static REAUTH_TYPE_ERROR = 'ERROR';
  public static UPDATE_CUSTOMER_REF = 'UPDATE_CUSTOMER_REF';
  public static OPTION_HISTORY = 'HISTORY';
  public static UNDERTAKING_TYPE_CU = 'cu';
  public static UNDERTAKING_TYPE_IU = 'bg';
  public static UNDERTAKING_TYPE_BR = 'br';
  public static MODE_VIEW = 'view';
  public static OPTION_FULL = 'FULL';
  public static OPTION_SUMMARY = 'SUMMARY';
  public static OPTION_UPDATED = 'UPDATED';
  public static OPTION_DETAILS = 'DETAILS';
  public static OPTION_FULLORSUMMARY = 'FULLORSUMMARY';
  public static DELV_ORGNL_UNDERTAKING_CODE = 'N439';
  public static SPECIAL_TERMS_CODE = 'N438';
  public static DEMAND_IND_CODE = 'N437';
  public static EFFEC_DATE_TYPE_CODE = 'N024';
  public static SEND_ATTACH_CODE = 'N441';
  public static SHIPMENT_DETAILS = 'N118';
  public static PURCHASE_DETIALS = 'N119';
  public static OPERATION_PREVIEW = 'PREVIEW';
  public static OPERATION_SAVE = 'SAVE';
  public static OPERATION_CANCEL = 'CANCEL';
  public static OPERATION_TEMPLATE = 'TEMPLATE';
  public static OPERATION_RETURN = 'RETURN';
  public static OPERATION_OVERWRITE_TEMPLATE = 'OVERWRITE_TEMPLATE';
  public static OPERATION_EXPORT = 'EXPORT';
  public static OPERATION_HELP = 'HELP';
  public static IU_LANDING_SCREEN = '/screen/IssuedUndertakingScreen';
  public static RU_LANDING_SCREEN = '/screen/ReceivedUndertakingScreen';
  public static TRADE_ADMIN_LANDING_SCREEN = '/screen/TradeAdminScreen';
  public static PREVIEW_POPUP_SCREEN = '/screen/ReportingPopup';
  public static DEMAND_GUARANTEE = 'DGAR';
  public static STAND_BY = 'STBY';
  public static DEPEND_UNDERTAKING = 'DEPU';
  public static MASTER = 'master';
  public static OPERATION_CREATE_REPORTING = 'CREATE_REPORTING';
  public static OPERATION_CREATE_RELEASEREJECT_REPORTING = 'CREATE_RELEASEREJECT_REPORTING';
  public static TASKS_MONITORING = 'TASKS_MONITORING';
  public static MODE_RELEASE = 'RELEASE';
  public static OPERATION_LIST_INQUIRY = 'LIST_INQUIRY';
  public static SCRATCH = 'SCRATCH';
  public static SWIFT_VERSION2023 = 2023;
  public static LENGTH_16 = 16;
  public static LENGTH_35 = 35;
  public static LENGTH_32 = 32;
  public static LENGTH_20 = 20;
  public static LENGTH_780 = 780;
  public static LENGTH_11 = 11;
  public static LENGTH_12 = 12;
  public static LENGTH_64 = 64;
  public static LENGTH_65 = 65;
  public static LENGTH_9750 = 9750;
  public static LENGTH_3250 = 3250;
  public static LENGTH_6500 = 6500;
  public static LENGTH_140 = 140;
  public static LENGTH_3 = 3;
  public static LENGTH_2 = 2;
  public static LENGTH_1750 = 1750;
  public static LENGTH_210 = 210;
  public static LENGTH_200 = 200;
  public static LENGTH_1048576 = 1048576;
  public static LENGTH_100 = 100;
  public static LENGTH_101 = 101;
  public static LENGTH_80 = 80;
  public static LENGTH_NEGETIVE_5 = -5;
  public static LENGTH_10 = 10;
  public static LENGTH_50 = 50;
  public static LENGTH_440 = 440;
  public static LENGTH_310 = 310;
  public static LENGTH_70 = 70;
  public static LENGTH_60 = 60;
  public static LENGTH_170 = 170;
  public static LENGTH_30 = 30;
  public static LENGTH_118 = 118;
  public static LENGTH_146 = 146;
  public static LENGTH_183 = 183;
  public static LENGTH_9 = 9;
  public static LENGTH_40 = 40;
  public static LENGTH_810 = 810;
  public static LENGTH_255 = 255;
  public static LENGTH_400 = 400;
  public static LENGTH_390 = 390;
  public static LENGTH_590 = 590;
  public static LENGTH_90 = 90;
  public static LENGTH_5 = 5;
  public static LENGTH_150 = 150;
  public static LENGTH_450 = 450;
  public static LENGTH_4 = 4;
  public static LENGTH_25 = 25;
  public static LENGTH_7 = 7;
  public static LENGTH_300 = 300;
  public static LENGTH_6 = 6;
  public static LENGTH_820 = 820;
  public static LENGTH_550 = 550;
  public static LENGTH_191 = 191;
  public static LENGTH_800 = 800;
  public static LENGTH_POINT_5 = 0.05;
  public static LENGTH_3_POINT_5 = 3.5;
  public static LENGTH_34 = 34;
  public static LENGTH_16500 = 16500;
  public static LENGTH_31 = 31;
  public static LENGTH_1 = 1;
  public static FINAL_EXPIRY_DATE = 'final expiry date';
  public static CALENDAR_DATE = 'calendar date';
  public static PREVIEW_TNX = '/previewTnx';
  public static TWO_COL_AMEND_PREVIEW = '/previewAmendComparison';
  public static RU_PREVIEW_TNX = 'ru/previewTnx';
  public static MO_INITIATE_SCRATCH = 'mo/initiateFromScratch';
  public static PREVIEW_FROM_PENDING_TNX = '/previewFromPendingTnx';
  public static FROM_BANK_TEMPLATE_OPTION = '/initiateFromBankTemplate';
  public static CONTEXT_PATH = 'CONTEXT_PATH';
  public static ACTION_CODE = 'ACTION_CODE';
  public static REGEX_DATE_NUMBER = '^([1-9]|[12][0-9]|3[01])$';
  public static DECIMAL_0 = 0;
  public static DECIMAL_1 = 1;
  public static DECIMAL_2 = 2;
  public static DECIMAL_3 = 3;
  public static DECIMAL_4 = 4;
  public static DECIMAL_5 = 5;
  public static DECIMAL_6 = 6;
  public static DECIMAL_7 = 7;
  public static DECIMAL_8 = 8;
  public static DECIMAL_9 = 9;
  public static DECIMAL_10 = 10;
  public static DECIMAL_11 = 11;
  public static DECIMAL_12 = 12;
  public static DECIMAL_13 = 13;
  public static DECIMAL_14 = 14;
  public static NUMERIC_ZERO = 0;
  public static NUMERIC_ONE = 1;
  public static NUMERIC_TWO = 2;
  public static NUMERIC_THREE = 3;
  public static NUMERIC_FOUR = 4;
  public static NUMERIC_FIVE = 5;
  public static NUMERIC_SIX = 6;
  public static NUMERIC_SEVEN = 7;
  public static NUMERIC_EIGHT = 8;
  public static NUMERIC_NINE = 9;
  public static NUMERIC_TEN = 10;
  public static NUMERIC_ELEVEN = 11;
  public static NUMERIC_TWELVE = 12;
  public static NUMERIC_THIRTEEN = 13;
  public static NUMERIC_FOURTEEN = 14;
  public static NUMERIC_FIFTEEN = 15;
  public static NUMERIC_780 = 780;
  public static NUMERIC_TWENTY = 20;
  public static NUMERIC_STRING_ONE = '01';
  public static NUMERIC_STRING_TWO = '02';
  public static NUMERIC_STRING_THREE = '03';
  public static NUMERIC_STRING_EIGHT = '08';
  public static NUMERIC_STRING_NINTY_NINE = '99';
  public static SECTION_GENERAL_DETAILS = 'generaldetailsSection';
  public static SECTION_APPLICANT_DETAILS = 'applicantDetailsFormSection';
  public static SECTION_ALT_APPLICANT_DETAILS = 'altApplicantDetailsFormSection';
  public static SECTION_BENEFICIARY_DETAILS = 'beneficiaryDetailsFormSection';
  public static SECTION_AMOUNT_DETAILS = 'amountDetailsSection';
  public static SECTION_CONTRACT_DETAILS = 'contractDetails';
  public static SECTION_UNDERTAKING_GENERAL_DETAILS = 'undertakingGeneralDetailsSection';
  public static SECTION_RENEWAL_DETAILS = 'renewalDetailsSection';
  public static SECTION_RU_GENERAL_DETAILS = 'ruGeneraldetailsSection';
  public static SECTION_BANK_DETAILS = 'bankDetailsSection';
  public static SECTION_CU_BANK_DETAILS = 'cuBankDetailsSection';
  public static SECTION_UNDERTAKING_DETAILS = 'undertakingDetailsForm';
  public static SECTION_BANK_INSTR = 'bankInstructionsForm';
  public static SECTION_LICENSE = 'License';
  public static SECTION_FILE_UPLOAD = 'fileUploadSection';
  public static SECTION_INCR_DECR = 'redIncForm';
  public static SECTION_CU_GENERAL_DETAILS = 'cuGeneraldetailsSection';
  public static SECTION_CU_AMOUNT_DETAILS = 'cuAmountDetailsSection';
  public static SECTION_CU_RENEWAL_DETAILS = 'cuRenewalDetailsSection';
  public static SECTION_CU_UNDERTAKING_DETAILS = 'cuUndertakingDetailsForm';
  public static SECTION_CU_INCR_DECR = 'cuRedIncForm';
  public static SECTION_CU_BENEFICIARY = 'cuBeneficaryDetailsSection';
  public static SECTION_RETURN_COMMENTS = 'commentsForm';
  public static SECTION_TRANSACTION_DETAILS = 'transactionDetailsComponent';
  public static SECTION_REPORTING_MESSGE_DETAILS = 'reportingMessageDetailsComponent';
  public static SECTION_RU_APPLICANT_BEN_DETAILS = 'ruApplicantBeneDetailsForm';
  public static SECTION_COURIER_DETAILS = 'courierDetailsForm';
  public static SECTION_CHARGES = 'chargeForm';
  public static SECTION_SHIPMENT_DETAILS = 'shipmentDetailsSection';
  public static SECTION_FACILITY_DETAILS = 'facilityDetailsSection';
  public static TRANSACTION_POPUP = 'TransactionPopup';
  public static UNSIGNED_AMEND = 'unsignedAmend';
  public static VIEW_AMEND = 'viewAmend';
  public static INITIATE_AMEND = 'initiateAmend';
  public static ISSUINGBANKTYPECODE = 'issuingBankTypeCode';
  public static ISSUINGBANKSWIFTCODE = 'issuingBankSwiftCode';
  public static ISSUINGBANKNAME = 'issuingBankName';
  public static ISSUINGBANKADDRESSLINE1 = 'issuingBankAddressLine1';
  public static ISSUINGBANKADDRESSLINE2 = 'issuingBankAddressLine2';
  public static ISSUINGBANKDOM = 'issuingBankDom';
  public static ISSUINGBANKADDRESSLINE4 = 'issuingBankAddressLine4';
  public static ADVISINGSWIFTCODE = 'advisingSwiftCode';
  public static ADVISINGBANKNAME = 'advisingBankName';
  public static ADVISINGBANKADDRESSLINE1 = 'advisingBankAddressLine1';
  public static ADVISINGBANKADDRESSLINE2 = 'advisingBankAddressLine2';
  public static ADVISINGBANKDOM = 'advisingBankDom';
  public static ADVISINGBANKADDRESSLINE4 = 'advisingBankAddressLine4';
  public static ADVBANKCONFREQ = 'advBankConfReq';
  public static ADVISETHRUSWIFTCODE = 'adviseThruSwiftCode';
  public static ADVISETHRUBANKNAME = 'adviseThruBankName';
  public static ADVISETHRUBANKADDRESSLINE1 = 'adviseThruBankAddressLine1';
  public static ADVISETHRUBANKADDRESSLINE2 = 'adviseThruBankAddressLine2';
  public static ADVISETHRUBANKDOM = 'adviseThruBankDom';
  public static ADVISETHRUBANKADDRESSLINE4 = 'adviseThruBankAddressLine4';
  public static LOCALADVISETHROUGHCONFREQ = 'localAdviseThroughConfReq';
  public static LOCALADVISETHROUGHSWIFTCODE = 'localAdviseThroughSwiftCode';
  public static LOCALADVISETHROUGHNAME = 'localAdviseThroughName';
  public static LOCALADVISETHROUGHADDRESSLINE1 = 'localAdviseThroughAddressLine1';
  public static LOCALADVISETHROUGHADDRESSLINE2 = 'localAdviseThroughAddressLine2';
  public static LOCALADVISETHROUGHDOM = 'localAdviseThroughDom';
  public static LOCALADVISETHROUGHADDRESSLINE4 = 'localAdviseThroughAddressLine4';
  public static CONFIRMINGSWIFTCODE = 'confirmingSwiftCode';
  public static CONFIRMINGBANKNAME = 'confirmingBankName';
  public static CONFIRMINGBANKADDRESSLINE1 = 'confirmingBankAddressLine1';
  public static CONFIRMINGBANKADDRESSLINE2 = 'confirmingBankAddressLine2';
  public static CONFIRMINGBANKDOM = 'confirmingBankDom';
  public static CONFIRMINGBANKADDRESSLINE4 = 'confirmingBankAddressLine4';
  public static SECTION_PAYMENT_DETAILS = 'paymentDetailsForm';
  public static SECTION_CU_PAYMENT_DETAILS = 'cuPaymentDetailsForm';
  public static CU_PREVIEW = 'CUPreview';
  public static SHIPMENT_ALLOWED = 'ALLOWED';
  public static SHIPMENT_NOT_ALLOWED = 'NOT ALLOWED';
  public static SHIPMENT_CONDITIONAL = 'CONDITIONAL';
  public static SHIPMENT_NO = '02';
  public static SHIPMENT_YES = '01';
  public static SHIPMENT_BETWEEN = '03';
  public static INCO_CFR = 'CFR';
  public static INCO_DPU = 'DPU';
  public static INCO_CIF = 'CIF';
  public static INCO_CIP = 'CIP';
  public static INCO_CPT = 'CPT';
  public static INCO_DAF = 'DAF';
  public static INCO_DDP = 'DDP';
  public static INCO_DDU = 'DDU';
  public static INCO_DEQ = 'DEQ';
  public static INCO_DES = 'DES';
  public static INCO_EXW = 'EXW';
  public static INCO_FCA = 'FCA';
  public static INCO_FAS = 'FAS';
  public static INCO_FOB = 'FOB';
  public static INCO_DAT = 'DAT';
  public static INCO_DAP = 'DAP';
  public static INCO_OTH = 'OTH';
  public static cuPurposeList = ['02', '03'];
  public static AMEND_CU_GENERAL_DETAILS = 'amendLUGeneraldetailsSection';
  public static AMEND_GENERAL_DETAILS = 'amendGeneraldetailsSection';
  public static AMEND_BANK_DETAILS = 'amendBankDetailsSection';
  public static EXPIRY_DATE = 'expiry date';
  public static CONTRACT_DATE = 'Contract Date';
  public static FIRST_DATE = 'First date';
  public static LESSER_THAN = 'lesserThan';
  public static GREATER_THAN = 'greaterThan';
  public static GREATER_THAN_OR_EQUAL_TO = 'greaterThanOrEqualTo';
  public static LESSER_THAN_OR_EQUAL_TO = 'lesserThanOrEqualTo';
  public static APPLICATION_DATE = 'application date';
  public static APPL_DATE = 'applDate';
  public static DATE_FORMAT = 'MM/dd/yyyy';
  public static AMEND_AMOUNT_DETAILS = 'amendAmtForm';
  public static EXPIRY_TYPE = 'Expiry Date';
  public static EXTENSION_EXPIRY_TYPE = 'Extension Final Expiry Date';
  public static COUNTRY_CODE_VALUE = 'C006';
  public static CRED_ON_DEMAND_VALUE = '06';
  public static OTHER = 'Other';
  public static TARGET_SELF = '_self';
  public static TRIANGLE_ICON = 'pi pi-exclamation-triangle';
  public static SELECT_MESSAGE = 'Select';
  public static USER_LANGUAGE = 'USER_LANGUAGE';
  public static HELP_IU_INITIATION = 'IU_01';
  public static HELP_IU_MSG_TO_BANK = 'IU_02';
  public static HELP_IU_AMEND = 'IU_03';
  public static HELP_IU_MAINTENANCE = 'IU_17';
  public static HELP_RU_INITIATION = 'RU_01';
  public static HELP_RU_MSG_TO_BANK = 'RU_02';
  public static HELP_RU_AMEND = 'RU_03';
  public static HELP_RU_MAINTENANCE = 'RU_17';
  public static ARABIC_DECIMAL_SEPARATOR = '\u066B';
  public static ARABIC_THOUSAND_SEPARATOR = '\u066C';
  public static COMMA = ',';
  public static NO_BREAK_SPACE = '\u00A0';
  public static DATE_FORMAT_DMY = 'dd/MM/yyyy';
  public static STRING_FALSE = 'false';
  public static DOT = '.';
  public static FRENCH_THOUSAND_SEPARATOR = '\u0020';
  public static HTML_DATE_FORMAT_DMY = 'dd/mm/yy';
  public static HTML_DATE_FORMAT_MDY = 'mm/dd/yy';
  public static LANGUAGE_EN = 'en';
  public static LANGUAGE_US = 'us';
  public static LANGUAGE_FR = 'fr';
  public static LANGUAGE_AR = 'ar';
  public static TEXT_ALIGN_RIGHT = 'text-align: right;';
  public static ADVISE_DATE = 'advise date';
  public static ISSUE_DATE = 'date of issue';
  public static REJECT_VALIDATION_ERROR = ['maxlength', 'amtFieldInvalid', 'pattern', 'currencyCodeIsInvalid', 'countryCodeIsInvalid'];
  public static REJECT_PROD_STATUS_CODE = '01';
  public static DELIVERY_TO_OTHER_APPLICABLE_CODE = ['99', '02', '04', '05'];
  public static PENDING_PROD_STATUS_CODE = '02';
  public static CODE_02 = '02';
  public static APPROVED_PROD_STAT_CODE = '04';
  public static TODAYS_DATE = 'todays date';
  public static EFFECTIVE_DATE = 'effective date';
  public static AMEND_DATE = 'Amend date';
  public static MATURITY_DATE = 'Maturity date';
  public static CURRENT_DATE = 'current date';
  public static ISSUANCE_DATE = 'issue date';
  public static CLAIM_DATE = 'Claim date';
  public static SETTLEMENT_DATE = 'Settlement date';
  public static PAYMENT_DATE = 'Payment date';
  public static TRANSACTION_POPUP_PROPERTIES = 'width=800,height=500,resizable=yes,scrollbars=yes';
  public static PROD_STAT_CODE_PROVISIONAL = '98';
  public static PROD_STAT_CODE_WORDING_REVIEW = '78';
  public static PROD_STAT_CODE_FINAL_WORDING = '79';
  public static LATEST_RESPONSE_DATE = 'Latest Response Date';
  public static ADVISING_BANK = 'Advising Bank';
  public static ISSUING_BANK = 'Issuing Bank';
  public static ANY_BANK = 'Any Bank';
  public static PUBLIC_TASK = 'Public';
  public static STATIC_PHRASE = '01';
  public static CODE_01 = '01';
  public static CODE_03 = '03';
  public static TIMESTAMP_FORMAT = 'dd/MM/yyyy HH:MM:SS';
  public static NO = 'N';
  public static YES = 'Y';
  public static TRAILING_SUBSTRING_CHAR = '...';
  public static APP_JSON = 'application/json';
  public static CONTENT_TYPE = 'Content-Type';
  public static IDEMPOTENCY_KEY = 'Idempotency-Key';
  public static DELIVERY_MODE_PARM_ID = 'P805';
  public static DELIVERY_TO_PARM_ID = 'P806';
  public static SERVLET_NAME = 'SERVLET_NAME';
  public static DEMAND_INDICATOR_PARM_ID = 'P807';
  public static ADVISE_THRU_BANK = 'Advise Thru Bank';
  public static LOCAL_ADVISE_THROUGH_BANK = 'Local Advise Through Bank';
  public static ADVISING_BANK_TYPE = 'advising';
  public static ADVISE_THRU_BANK_TYPE = 'adviseThru';
  public static LOCAL_ADVISE_THROUGH_BANK_TYPE = 'localAdviseThrough';
  public static NUMBER_500 = 500;
  public static MALICIOUS = 'malicious';
  public static N005_DISCREPANT = 12;
  public static N005_REJECTED = '01';
  public static N005_ACCEPTED = '04';
  public static N005_UPDATED = '07';
  public static N005_PART_SIGHT_PAID = '14';
  public static N005_FULL_SIGHT_PAID = '15';
  public static N042_DISCREPANCY_RESPONSE = 12;
  public static N015_PENDING_AUTHORISE = '03';
  public static N015_PENDING_VERIFY = '02';
  public static N015_PENDING_SEND = '04';
}

