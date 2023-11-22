export class FCMBeneConstants {

  static ACCOUNTS_TABLE_FIELDS = [
    'defaultAccountFlag',
    'accountType',
    'accountCurrency',
    'accountNumber',
    'confirmAccountNumber',
    'paymentType',
    'beneficiaryBankIfscCode',
    'beneficiaryBankIfscCodeIcons',
    'beneficiaryBankCode',
    'beneficiaryBankName',
    'beneficiaryBranchCode',
    'beneficiaryBankBranch'
  ];

  static DISPLAY_ACCOUNTS_FIELDS = [
    'beneficiaryAccountDetailsText',
    'defaultAccountFlag',
    'accountNumber',
    'accountType',
    'accountCurrency',
    'confirmAccountNumber',
    'paymentType',
    'beneficiaryBankIfscCode',
    'beneficiaryBankIfscCodeIcons'
  ];

  static ACCOUNTS_TABLE_COLUMNS = [
    'defaultAccountFlag',
    'accountNumber',
    'accountType',
    'accountCurrency',
    'paymentType',
    'beneficiaryBankIfscCode',
    'beneficiaryBankName',
    'beneficiaryBankBranch'
  ];

  static ACCOUNTS_TABLE_COLUMNS_ALL = [
    'defaultAccountFlag',
    'accountNumber',
    'accountType',
    'accountCurrency',
    'paymentType',
    'beneficiaryBankIfscCode',
    'beneficiaryBankName',
    'beneficiaryBankBranch',
    'associationId',
    'beneficiaryStatus'
  ];

  static FCM_FETCH_DATA_OPTIONS = [
    'clientDetails',
    'accountType',
    'packages'
  ];

  static FCM_BENEFICIARY_IFSC_DATA_OPTIONS = [
    'beneficiaryBankIfscCode'
    ];

    static FCM_BENEFICIARY_PACKAGE_DATA_OPTIONS = [
      'packages'
      ];

  static ACCOUNTS_TABLE_REQUIRED_FIELDS = [
    'accountType',
    'accountCurrency',
    'accountNumber',
    'confirmAccountNumber',
    'beneficiaryBankIfscCode',
    'paymentType'
  ];

  static BENEFICIARY_LIMIT = [
    'limitLevel',
    'limitFrequency',
    'numberOfTransaction',
    'amountLimit'
  ];

  static POSTAL_ADDRESS_FIELDS = [
    'addressType',
    'pincode',
    'addressLine1',
    'addressLine2',
    'addressLine3'
  ];


  static BANK_ACCOUNT_FIELDS = [
    'beneficiaryStatus',
    'paymentType',
    'packageType',
    'packages',
    'defaultAccountFlag',
    'accountType',
    'accountNumber',
    'accountCurrency',
    'identifierType',
    'beneficiaryBankIfscCode',
    'beneficiaryBankBranch'
  ];

  static BENEFICIARY_LIMIT_ADD = [
    'limitLevel',
    'limitFrequency',
    'numberOfTransaction',
    'amountLimit'
  ];

  static BENEFICIARY_LIMIT_UPDATE = [
    'limitLevel',
    'limitFrequency',
    'newNumberOfTransaction',
    'newAmountLimit'
  ];

  static POSTAL_ADDRESS_FIELDS_ADD = [
    'addressType',
    'pincode',
    'addressLine1',
    'addressLine2',
    'addressLine3'
  ];

  static POSTAL_ADDRESS_FIELDS_UPDATE = [
    'addressType',
    'newPincode',
    'newAddressLine1',
    'newAddressLine2',
    'newAddressLine3'
  ];

  static BANK_ACCOUNT_FIELDS_CREATE = [
    'beneficiaryStatus',
    'paymentType',
    'packageType',
    'packages',
    'defaultAccountFlag',
    'accountType',
    'accountNumber',
    'accountCurrency',
    'identifierType',
    'beneficiaryBankIfscCode',
    'beneficiaryBankBranch'
  ];

  static BANK_ACCOUNT_FIELDS_UPDATE = [
    'beneficiaryStatus',
    'paymentType',
    'packageType',
    'newPackage',
    'defaultAccountFlag',
    'accountType',
    'accountNumber',
    'accountCurrency',
    'identifierType',
    'beneficiaryBankIfscCode',
    'beneficiaryBankBranch',
    'beneficiaryCode',
    'clientDetails',
    'legalEntity',
    'associationId'
  ];

  static ACCOUNT_DETAILS = [
    'accountType',
    'accountNumber',
    'accountCurrency'
  ];

  static BENEFICIARY_BANK_DETAILS = [
    'identifierType',
    'beneficiaryBankIfscCode',
    'beneficiaryBankBranch'
  ];

  static CONSTRUCT_COMPLEX_FIELD = {
    'accountNumber' : ['id', 'other', 'id']
  };

  static FIELDS_WITH_ENUM_FORMAT = [
    'paymentType'
  ];

  static FCM_FETCH_BULK_FILE_DATA_OPTIONS = [
    'beneficiaryfileFormatCode',
    'clientDetails'
  ];

  static FCM_BENEFICIARY_ADDITIONAL_INFO_FIELDS = [
    'packages','mobileNo','addressLine1', 'receiverType',
    'addressLine2','addressLine3','pincode','numberOfTransaction','amountLimit','leiCode'];

  static FCM_MAKER_REMARKS = 'enterComments';

  static FCM_REMARKS = 'remarks';

}
