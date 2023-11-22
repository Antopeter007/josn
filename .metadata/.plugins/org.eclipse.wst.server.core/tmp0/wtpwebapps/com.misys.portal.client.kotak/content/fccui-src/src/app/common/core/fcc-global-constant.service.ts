import { Injectable } from '@angular/core';
import * as uuid from 'uuid';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FccGlobalConstant } from './fcc-global-constants';

@Injectable({
  providedIn: 'root'
})
export class FccGlobalConstantService {

    contextPath = window[FccGlobalConstant.CONTEXT_PATH];
    servletName = window[FccGlobalConstant.SERVLET_NAME];
    restServletName = window[FccGlobalConstant.RESTSERVLET_NAME];
    baseUrl: string = this.contextPath + this.restServletName + '/';
    // FCM URL
    fcmUrl = `finastra/PaymentTransfers/v1`;
    // Login Api
    fccLogin = this.baseUrl + 'login/';

    // Logout API
    private fccLogout = this.baseUrl + 'fbcclogout/';

    // Feedback API
    private submitFeedback = this.baseUrl + 'submitFeedback';

    private isFeedbackEnabled = this.baseUrl + 'show-feedback-option';

    // Courier Tracking API
    getCourierTracking = this.baseUrl + 'courierTracking';

    // Convert currency API
    private currencyConverter = this.baseUrl + 'convertCurrency';

    // Exchange rate API
    private exchangeRate = this.baseUrl + 'exchangeRates';

    // List of currencies API
    private currencies = this.baseUrl + 'currencyList';

    private bankCurrencies = this.baseUrl + 'bankCurrencyList';
    // List of Deals API
    getAllDeals = this.baseUrl + 'deals';

    // List of Facilities API
    getAllFacilities = this.baseUrl + 'facilities';

    generateTokenUrl = this.baseUrl + 'generateToken';

    getCommitmentScheduledValue = this.baseUrl + 'facility/validate/commitmentSchedule';

    // Menu API
    private menu = this.baseUrl + 'menuDetails/';

    // Default configuration API
    private configuration = this.baseUrl + 'configuration';

    private readonly retrieveUser = this.baseUrl + 'credentials/retrieve-userid';

    private readonly retrievePassword = this.baseUrl + 'credentials/reset-password';
    audit = this.baseUrl + 'uiAudit';

    // news api
    getNewsInternal = this.baseUrl + 'internalnews/';
    getSyndicatedNews = this.baseUrl + 'syndicatedNews/';
    // speech to text API url
    speechtoTextUrl = this.baseUrl + 'getSpeechText';

    // mini statment api

    getParamDetails = this.baseUrl + 'large-param';

    getUserAccount = this.baseUrl + 'accounts';
    getUserSpecificAccount = this.baseUrl + 'get-user-specific-accounts';
    getUserTimeZone = this.baseUrl + 'user-details';
    getDashboardAccountBalance = this.baseUrl + 'accounts/';
    getAccountStatment = this.baseUrl + 'accountstatment';
    getAccountDetails = this.baseUrl + 'accounts/';
    getAccountAdditionalPostingDetails = this.baseUrl + 'accounts/additionalPostingDetails';
    // product list api
    getPRoductList = this.baseUrl + 'availableProductList/';

    // check landing page
    getLandingPage = this.baseUrl + 'getUserPreference';

    saveLandingpreference = this.baseUrl + 'updateUserPreference';

    getAccountBalance = this.baseUrl + 'accountBalanceInfo/';

    getUserDetails = this.baseUrl + 'user-details';

    changeUserLanguage = this.baseUrl + 'language/change/';

    search = this.baseUrl + 'search';

    searchDetails = this.baseUrl + 'transactionDetails';

    searchDetailsBoRefId = this.baseUrl + 'transactionDetailsBoRefId';

    getDuplicateBeneDetails = this.baseUrl + 'getDuplicateBeneDetails';

    isIBANValid = this.baseUrl + 'isIBANValid';

    actionDetails = this.baseUrl + 'actionDetails';

    menuSearch = this.baseUrl + 'menuDetails/';

    // outstanding amount api
    getOutstandingAmount = this.baseUrl + 'outstandingAmount';

    // receivable amount api
    getReceivableAmount = this.baseUrl + 'receivableAmount';

    // available amount api
    getAvailableAmount = this.baseUrl + 'availableAmount';

    // calendar events api
    getCalendarEvents = this.baseUrl + 'calendarEvents/';

    // transaction in progress api
    getTransactionInProgress = this.baseUrl + 'transactionInProgressList';

   // pending transactions api
   private pendingTransaction = this.baseUrl + 'pendingApprovalTransactions/';

   // actionRequired api
   private actionRequired = this.baseUrl + 'actionRequiredList';

   // get configuared values
   getConfigurationDetails = this.baseUrl + 'getConfigurationDetails';

   // DashboardWidgetDetails

   getDashboardWidget = this.baseUrl + 'widgets';

   // Dashboard Permission Widget

   getDashboardPermissionWidget = this.baseUrl + 'permissionWidget';

   // Dashboard Save Preference Widget

   saveDashboardData = this.baseUrl + 'savePreference';

   // Accounts Summary API
   accountsSummaryDetails = this.baseUrl + 'accounts-summary';

   // Metadata api
   productListScreen = this.baseUrl + 'listscreen';

   // Metadata api
   metaDataListdef = this.baseUrl + 'metadata';

   savePreferenceListdef = this.baseUrl + 'savePreference';

   saveCustomizeColumnListdef = this.baseUrl + 'saveCustomizeColumn';

   getCustomizeColumnListdef = this.baseUrl + 'getCustomizeColumn';

   // Count api for listdef
   numOfRecords = this.baseUrl + 'countRecords';

   // Table data api
   tableDataListdef = this.baseUrl + 'listdata';

   // Get Packages
   packages = this.baseUrl + 'packages';

   // CharBot API

   chatBotLink = this.baseUrl + 'chatBotSession';

  // Parameter Configuration API

   getParamConfig = this.baseUrl + 'paramData';

   // Amount Configuration API

   getAmountConfig = this.baseUrl + 'amountConfiguration';

   // file upload API
   fileuploadURL = this.baseUrl + 'documents';

   // file upload API
   filedeleteUrl = this.baseUrl + 'documents' + '/';

   // product model API
   productModelUrl = this.baseUrl + 'model' + '/';

   // file upload API
   filedownloadUrl = this.baseUrl + 'documents' + '/';

   // template download API
   templatedownloadUrl = this.baseUrl + 'templates' + '/';

   // get file details
   getFileDetails = this.baseUrl + 'documents';

    // get Entities
    userEntities = this.baseUrl + 'entities';

    // get counterparties
    counterparties = this.baseUrl + 'counterparties';

     // get banks
     banks = this.baseUrl + 'banks';

     // get countries
     countries = this.baseUrl + 'countries';

     // get accounts
     staticAccounts = this.baseUrl + 'static-accounts';

     // get Corporate References
     corporateReferences = this.baseUrl + 'corporate-references';

     // get all import letter of credit transaction details
     getMasterTransaction = this.baseUrl + 'import-letter-of-credit/events';

     // get all transaction details
     getTransactionDetails = this.baseUrl + 'details';

     // get batch transaction details
     getBatchTransactionDetails = this.baseUrl + 'batchdetails';

     // get Corporate banks
     corporateBanks = this.baseUrl + 'bank-details';

     // get Corporate details
     corporateDetails = this.baseUrl + 'corporate-details';

     // get Customer Bank details
     corporateBank = this.baseUrl + 'customer-Banks';

     // save draft LC
     saveLCAsDraft = this.baseUrl + 'import-letter-of-credit/drafts';

     // update Saved LC
     updateSaveLCAsDraft = this.baseUrl + 'import-letter-of-credit/drafts' + '/';
     // retrieve Code data details
     getCodeData = this.baseUrl + 'codedata';

     // retrieve subtopic details
     getSubTopic = this.baseUrl + 'subtopic';

     // get transaction data LC
     getLCTransactionData = this.baseUrl + 'import-letter-of-credit/events';

     // get transaction data for a particular LC
     getLCTransactionDataDetails = this.baseUrl + 'import-letter-of-credit/events/';

    // get transactionCodes
    getTransactionCode = this.baseUrl + 'transactions/';

    // get online help api
    private getOnlineHelpUrl = this.baseUrl + 'fccHelp/';

     // get Unique UserID
     uniqueUserIdUrl = this.baseUrl + 'login/username?newusername=';

     uniqueEmailIdUrl = this.baseUrl + 'login/emailid';

     // get Widget Content
     getWidgetContent = this.baseUrl + 'genericWidget';

    // get All Transaction
    getAllTransaction = this.baseUrl + 'searchTransactions';

    // get action of transaction search
    getSearchAction = this.baseUrl + 'actionDetails';

    // get approved/rejected transactions
    bankApprovals = this.baseUrl + 'bankApprovedTransactions';

    // get auto search for Benefiary
    getBeneficiarySerach = this.baseUrl + 'search';

    // get BEneficiaryDetails
    getBeneficiaryDetail = this.baseUrl + 'beneficiaryDetails';

    // generate keys
     generateKeys = this.baseUrl + 'generateKeys';

    // Convert currency API
    userAuthorizationDetails = this.baseUrl + 'userAuthorizationDetails';

    // get Landing Page data
    getLandingPageData = this.baseUrl + 'landingPageData';
    // embedToken for Power BI
    getEmbedToken = this.baseUrl + 'embedToken';

    // getDashboard list BAsed on user
    getDashboardList = this.baseUrl + 'getDefaultDashbaord';

    // post dashboard preference
    saveDashboardPreferences = this.baseUrl + 'saveDefaultDashboard';

    // post adhoc beneficiary
    adhocCounterparties = this.baseUrl + 'counterparties/adhoc';

    // get all the widgets of dashboard
    getuserDashboardWidget = this.baseUrl + 'dashboardWidgets';

    // Create User Dashboard
    createUserDashboard = this.baseUrl + 'createDashboard';

    // Update User Dashboard
    updateUserDashboard = this.baseUrl + 'updateDashboard';

    // chatbot access
    hasChatbotAccess = this.baseUrl + 'chatbotAccess';

    // create task
    createTask = this.baseUrl + 'create-tasks';

    // create task
    updateTaskurl = this.baseUrl + 'update-tasks/';

    taskStatus = this.baseUrl + 'tasks/';

    // list of collaboration Users
    CollabUsers = this.baseUrl + 'staticdata/collaborationUsers';

    // add comment to task
    addCommentToTask = this.baseUrl + 'SaveTask-Comments/';

    // get Task Widget Details

   taskWidgetDetails = this.baseUrl + 'getOngoingTasks/';

    // Review (import letter of credit)
    getImportLetterOFCredit = this.baseUrl + 'import-letter-of-credit/events/';

    // Review (Eport letter of credit)
    getExportLetterOFCredit = this.baseUrl + 'export-letter-of-credit/events/';

    // Review (Export Colletion)
    getExportCollection = this.baseUrl + 'export-collections/events/';

    // Review (Import collection)
    getImportCollection = this.baseUrl + 'import-collections/events/';
    // save template
    saveLCTemplate = this.baseUrl + 'import-letter-of-credit/templates';

    // Attachment Tab data
    getAttachDocument = this.baseUrl + 'file/attachments';

    deleteLCTemplate = this.baseUrl + 'import-letter-of-credit/templates' + '/';

    deleteTemplate = this.baseUrl + 'templates-maintenance/';

    // generate template name
    generateTemplateName = this.baseUrl + 'template/name';

    deleteLC = this.baseUrl + 'import-letter-of-credit/drafts/';

    deleteTD = this.baseUrl + 'transactions-maintenance/cancel';

    delete = this.baseUrl + 'payment-beneficiaries/';

    deleteEL = this.baseUrl + 'export-letter-of-credit/drafts/';

    // add favrouite account
    addFavAccount = this.baseUrl + 'add-favourite/accountId/';

    // delete favrouite
    delFavAccount = this.baseUrl + 'delete-favourite/accountId/';

    genericDelete = this.baseUrl + 'transactions-maintenance';

    rejectedDelete = this.baseUrl + 'transactions-maintenance/rejected';

    batchCancel = this.baseUrl + 'transactions-maintenance/batch-cancel';

    // Master Import letter of credit
    getLCMasterDetails = this.baseUrl + 'import-letter-of-credit/masters/';

    // Get PDF styles from server side
    getPdfConfigurations = this.baseUrl + 'pdfConfigurations';
    // multisubmission
    severalTransactionApprove = this.baseUrl + 'transaction/batch-transaction/approve';

    severalTransactionReject = this.baseUrl + 'transaction/batch-transaction/reject';

    bankDetailsForPdf = this.baseUrl + 'bank-details';

    bankDateAndTime = this.baseUrl + 'bank-date-time';

    // get Incoterm Details
    incotermDetails = this.baseUrl + 'incotermDetails';

    getUnifiedWidget = this.baseUrl + 'getUnifiedWidget';
    // get Dynamic Phrases
    dynamicPhrases = this.baseUrl + 'dynamicPhrases';

    // get accounts
    getBeneficiaries = this.baseUrl + 'beneficiaries';

    // API for duplicate Template Name validation
    valiateTemplateId = this.baseUrl + 'validateTemplateId';

    // API for getting chat configuration
    chatConfigUrl = this.baseUrl + 'getChatConfiguration';

    // API for set entity
    setEntityURL = this.baseUrl + 'link-entity';

    // API for set entity
    setReferenceURL = this.baseUrl + 'update-reference/';

    getAmendmentNo = this.baseUrl + 'undertaking/customer/generateAmendmentNo';

    getBankTemplateDetails = this.baseUrl + 'bankdetails';

    downloadSpecimenEditor = this.baseUrl + 'standby-lc-banktemplate-download';

    downloadUndertakingSpecimenEditor = this.baseUrl + 'banktemplate-download';

    // Consolidated Charge Details
    getConsolidatedChargeDetails = this.baseUrl + 'charges/chargeDetails';

    // Get Valid Loan Business Date
    getValidateBusinessDate = this.baseUrl + 'facility/validate/businessDate';

    // Get Legaltext detils
    getLegalTextDetails = this.baseUrl + 'facility/legalText';

    // Dcuments Details
    getDocumentDetails = this.baseUrl + 'documentsList';

    // Get exculded fields and sections
    getExcludedFieldsNdSections = this.baseUrl + 'excluded/fields';

    // Get nudges List for widget
    getNudges = this.baseUrl + 'nudgets';

    getDeepLinking = this.baseUrl + `deep-linking`;

    // Get Product List for Phrases
    productsForPhrases = this.baseUrl + 'productsForPhrases';

    // Get Product List for Phrases
    addFieldsForDynamicPhrases = this.baseUrl + 'addFieldDynamicPhrases';

    // Get Phrase Save
    phraseSaveUrl = this.baseUrl + 'phrases';

    // API for duplicate phrase abbvName Validation
    validatePhraseAbbvName = this.baseUrl + 'uniquePhrase';

    swiftRegexPattern = '^[a-zA-Z0-9-/?:().,+ ]*$';

    userProfileAccounts = this.baseUrl + 'staticdata/getUserProfileAccounts';

    //Bank Save
    bankSaveUrl = this.baseUrl + 'bank/save';

    // api response limit
    staticDataLimit = 10000;

    // group details api
    getUserGroupsData = this.baseUrl + 'accounts-group/getUserGroupDetails/';

    userAccountsType = this.baseUrl + 'account-type';

    userAccountsIds = this.baseUrl + 'accounts';

    // Groups list data api
    groupsListDataListdef = this.baseUrl + 'groupslistdata';

    paymentBeneficiaryDetails = this.baseUrl + 'payment-beneficiaries';

    updatePaymentBeneficiaryDetails = this.baseUrl + 'payment-beneficiaries/';

    favPaymentBeneficiaryDetails = this.baseUrl + 'payment-beneficiaries';

    fcmBeneficiaryCreation = this.baseUrl + 'beneficiary-accounts';

    fcmBeneficiaryUpdation = this.baseUrl + 'beneficiary-accounts/update';

    detailJourney = this.baseUrl + `detailJourney`;

    autoSave = this.baseUrl + `autosave`;

    getExternalStaticData = this.baseUrl + `externalStaticData`;

    favBeneficiaryCount = this.baseUrl + `payment-beneficiaries/favourite-count`;

    getBeneficiaryDetails = this.baseUrl + `payment-beneficiaries/beneficiary-details`;

    getBeneficiaryAccountDetails = this.baseUrl + `payment-beneficiaries/beneficiary-account-details`;

    bankHolidayList = this.baseUrl + `v1/bank-holiday-list`;

    holidayCutOffs = this.baseUrl + `holidays-cutoff`;

    beneficiaryStatus = this.baseUrl + 'beneficiary-accounts';

    getPopupActions = this.baseUrl + `getPopupActions`;

    createBatchURL = this.baseUrl + `${this.fcmUrl}/electronic/batch-payment`;

    addInstrumentURL = this.baseUrl + `${this.fcmUrl}/electronic/batch-payment/instrument/`;

    updateInstrumentURL = this.baseUrl + `${this.fcmUrl}/electronic/batch-payment/instrument/`;

    submitBatchPaymentURL = this.baseUrl + `${this.fcmUrl}/physical/batch-payment`;

    paymentOverviewDetailsURL = this.baseUrl + `${this.fcmUrl}/payments/payments-overview-detail`;

    getPaymentBulkUploadDetail = this.baseUrl + `getPaymentBulkUploadStatus`;

    getBeneBulkUploadDetail = this.baseUrl + `bene-bulk-upload-status`;

    getUpcomingPaymentSummaryUrlNew = this.baseUrl + `upcoming-payments-summary`;

    fileViewerComponent = 'fccFileViewerComponent';

    updatePreferenceListdef = this.baseUrl + 'updatePreference';
    
    deletePreferenceListdef = this.baseUrl + 'deletePreference';


    getPopupActionsUrl(){
      return this.getPopupActions;
    }

    getExternalStaticDataUrl() {
      return this.getExternalStaticData;
    }

    getPaymentBulkUploadDetails() {
      return this.getPaymentBulkUploadDetail;
    }

    getBeneBulkUploadDetails() {
      return this.getBeneBulkUploadDetail;
    }

    getUpcomingPaymentSummaryUrl() {
      return this.getUpcomingPaymentSummaryUrlNew;
    }


    beneficiaryAccounts = this.baseUrl + `payment-beneficiary-accounts`;

    singlePaymentURL = this.baseUrl + `finastra/PaymentTransfers/v1/electronic/single-payment`;

    bulkPaymentURL = this.baseUrl + `finastra/PaymentTransfers/v1/payments/bulktransactions-files`;

    bulkBeneURL = this.baseUrl + `payment-beneficiaries/fcm-bulk-upload`;

    paymentDetailsurl = this.baseUrl + `finastra/PaymentTransfers/v1/payments/`;
    
    accountListUrl = this.baseUrl + `accounts`;

    getAccountTypes = this.baseUrl + `account-type/`;

    requestAccountStatementUrl = this.baseUrl + `requestAccountStatementGeneration`;
    getExchangeRateConfig = this.baseUrl + `exchange-rate`;

    getFxDetails = this.baseUrl + `fx-details`;

    bulkMapperUrl = this.baseUrl + `corporate/channels/profile/me/v1/bulk-Mapper`;

    pabAmountValidationUrl = this.baseUrl + 'v1/pab-amount-validation';

    // Get Auto Save API
    getAutoSaveUrl(): string {
      return this.autoSave;
    }

    // Get Deal Details API
    getDealDetails(dealId: string): string {
      return this.baseUrl + `deal/details/${dealId}`;
    }

    // Get Facility Details API
    getFacilityDetails(facilityId: string): string {
      return this.baseUrl + `facility/details/${facilityId}`;
    }
     // Get accounts asscoiated with entityId;
     getAccountsByEntityId(entityId: string): string {
      return this.baseUrl + `get-entity-accounts/${entityId}`;
    }

     // Set accounts asscoiated with groupId;
    setAccountData(groupId: string): string{
      return this.baseUrl + `accounts-group/${groupId}`;
    }
    getLogoutUrl(): string {
      return this.fccLogout;
    }

    getAudit() {
      return this.audit;
    }

    getBulkMapperUrl() {
      return this.bulkMapperUrl;
    }

    public getStaticDataLimit() {
      return this.staticDataLimit;
    }

    public getSwiftRegexPattern(): string {
      return this.swiftRegexPattern;
    }


    public setSwiftRegexPattern(pattern: string) {
      this.swiftRegexPattern = pattern;
    }

    getSubmitFeedbackUrl(): string {
      return this.submitFeedback;
    }

    isFeedbackEnabledUrl(): string {
      return this.isFeedbackEnabled;
    }

    getProductModelURL(type: string): string {
      const url = (this.productModelUrl) + (type);
      return url;
    }

    getCurrencyConverterUrl(): string {
      return this.currencyConverter;
    }

    getExchangeRateUrl(): string {
      return this.exchangeRate;
    }

    getCurrencies(): string {
      return this.currencies;
    }
    
    getBankCurrencies(): string {
      return this.bankCurrencies;
    }

    getMenuPath(): string {
      return this.menu;
    }

    getConfgurations(): string {
      return this.configuration;
    }

    getPendingTransactionUrl(): string {
      return this.pendingTransaction;
    }

    getActionRequiredUrl(): string {
      return this.actionRequired;
    }

    getFileUploadUrl(): string {
      return this.fileuploadURL;
    }
    getFileDeleteUrl(AttachmentID: string): string {
      const a = (this.filedeleteUrl) + (AttachmentID);
      return a;
    }

    putSavedLCUrl(transactionID: string): string {
      const save = (this.updateSaveLCAsDraft) + (transactionID);
      return save;
    }

    updateTask(taskId: string): string {
      const url = (this.updateTaskurl) + (taskId);
      return url;
    }

    updateTaskStatus(taskId: string): string {
      const url = (this.taskStatus) + (taskId) + '/status';
      return url;
    }

    putTransactionApprovalUrl(): string {
      return this.severalTransactionApprove;
    }

    putTransactionRejectUrl(): string {
      return this.severalTransactionReject;
    }

    getFileDownloadUrl(AttachmentID: string): string {
      const a = (this.filedownloadUrl) + (AttachmentID);
      return a;
    }

    getTemplateDownloadUrl(TemplateID: string): string {
      const a = (this.templatedownloadUrl) + (TemplateID);
      return a;
    }
    getNewsAttachmentDownloadUrl(AttachmentID: string, AttachmentType: string): string {
      const a = (this.filedownloadUrl) + `${AttachmentID}/${AttachmentType}`;
      return a;
    }

    getUniqueUserIdUrl(userId: string): string {
      const a = (this.uniqueUserIdUrl) + (userId);
      return a;
    }

    getGenerateKeysUrl(): string {
      return this.generateKeys;
    }

    getLCTransactionDataDetailsUrl(transactionID: string): string {
      const getUrl = (this.getLCTransactionDataDetails) + (transactionID);
      return getUrl;
    }


  generateUIUD() {
    const key = uuid.v4();
    return key;
 }

  generateUUIDUsingTime() {
    let d = new Date().getTime();
    let d2 = (performance && performance.now && (performance.now() * 1000)) || 0;
    const uuid = 'xxxxxxxx-xxxx-xxxx'.replace(/[xy]/g, function(c){
      let r = Math.random() * 16;
      if (d > 0) {
        r = (d + r) % 16 | 0;
        d = Math.floor(d / 16);
      } else {
        r = (d2 + r) % 16 | 0;
        d2 = Math.floor(d2 / 16);
      }
      return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
    });
    return uuid;
  }

  getRetrieveUserId() {
    return this.retrieveUser;
  }

 getRetrievePassword() {
  return this.retrievePassword;
}

getHelpSectionUrl(key) {
  const url = (this.getOnlineHelpUrl) + (key);
  return url;
}

getUserLanguageUrl(): string {
  return this.changeUserLanguage;
}

getProductsForPhrases() {
  return this.productsForPhrases;
}

getPhraseSaveUrl() {
  return this.phraseSaveUrl;
}

getBankSaveUrl() {
  return this.bankSaveUrl;
}

// Get audit trail for a transaction
getUserAuditByTnx(transactionId): string {
  return this.baseUrl + `transactions/${transactionId}/history`;
}

deleteGroup(groupId: string): string {
    return this.baseUrl + `accounts-group/${groupId}`;
}

createGroup() {
    return this.baseUrl + `accounts-group`;
}

    public getFileViewerComponent(): string {
      return this.fileViewerComponent;
    }

    public setFileViewerComponent(fileViewerComponent: string) {
      this.fileViewerComponent = fileViewerComponent;
    }

getRequestAccountStatementUrl(){
  return this.requestAccountStatementUrl;
}

}
