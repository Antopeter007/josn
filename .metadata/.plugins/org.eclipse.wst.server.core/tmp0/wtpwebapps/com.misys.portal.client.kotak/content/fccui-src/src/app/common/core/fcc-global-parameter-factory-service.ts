import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FccGlobalParameterFactoryService {

  constructor() {
    //eslint : no-empty-function
   }

  private inputTextBox = 'input-text';

  private inputMultiselect = 'input-multiselect';

  private dropdownWithSearch = 'dropdownWithSearch';

  private dateRange = 'input-date';

  private datePicker = 'datePicker';

  private amountRange = 'amountRange';

  private dropdown = 'input-dropdown';

  private radio = 'input-radio';

  private inputText = 'input-text';

  private spacer = 'spacer';

  private text = 'text';

  private dropdownFiler = 'input-dropdown-filter';

  getParameterType(parameterType, isCodeField?): any {
    if (isCodeField) {
      return this.getTypeForCodeField();
    }
    let currentType: any;
    switch (parameterType) {
      case 'AvailableProductsByBusinessArea':
      case 'AvailableProducts':
      case 'AvailableBulkPayrollTypes':
      case 'AvailableMasterProducts':
      case 'AvailableReports':
      case 'AvailableMasterReports':
      case 'AvailableCustomerReference':
      case 'AvailableLNBorrowerReference':
      case 'action_code':
      case 'AvaliableProductStatus':
      case 'Currency':
      case 'Country':
      case 'CounterCurrency':
      case 'AvaliableSubProductType':
      case 'Entity':
      case 'AccountNo':
      case 'AvaliableTransactionStatus':
      case 'AvailableSubTransactionStatus':
      case 'SEAdvicesType':
      case 'LicenseTypes':
      case 'AvailableReference':
      case 'AvailableLoanStatus':
      case 'AvailableLoanTransactionType':
      case 'AvailableLoanSwingLineTransactionType':
      case 'AvailableLoanTransactionStatus':
      case 'sub_tnx_stat_code':
      case 'AvailableFacilityStatus':
      case 'SellerName':
      case 'BuyerName':
      case 'AvailableTMAStatus':
      case 'TMAMessageType':
      case 'AvailableUserStatusFlag':
      case 'AvailableDealForCustomer':
      case 'AvaliableFeeStatus':
      case 'PaymentStatus':
      case 'bk_type':
      case 'CustomerReference':
      case 'EntityBank':
      case 'DealCurrency':
      case 'InvoiceStatus':
      case 'AvailableFeeProduct':
      case 'FscmProgram':
      case 'prod_stat_code':
      case 'sub_product_code':
      case 'tnx_stat_code':
      case 'autoRollOver':
      case 'AvailableFacilityForDeal':
      case 'AvailablePricingOptionForFacility':
      case 'AvailableCollectionStatus':
      case 'intendNoticeDaysValidation':
      case 'FscmProgramCollection':
      case 'sub_tnx_type_code':
      case 'adv_send_mode':
      case 'status':
      case 'chrg_code':
      case 'tnx_type_code':
      case 'feeRID':
      case 'AvailableBooleanStrings':
      case 'AvailableChargeCode':
      case 'AvailableTDType':
      case 'AvailableClearingCode':
      case 'AvailableBulkType':
      case 'AvailableTransactionType': // To be removed since has been converted to code field
      case 'AvailableFundTransferType':
      case 'Beneficiary':
      case 'AvailableTradeEventTypes': // To be removed since has been converted to code field
      case 'AvailableTradeProductStatus': // To be removed since has been converted to code field
      case 'Drawee':
      case 'Drawer':
      case 'AvailableTenorType':
      case 'AvailableECType':
      case 'AvailableActionRequiredStatus': // To be removed since has been converted to code field
      case 'AvailableFinancingType':
      case 'Category':
      case 'AvailableTradeFundTransferTypes': // To be removed since has been converted to code field
      case 'TermCode':
      case 'bo_deal_name':
      case 'bo_facility_name':
      case 'pricing_option':
      case 'ExpiryType':
      case 'Action_Type':
      case 'StandByLCType':
      case 'AccountNo':
      case 'TnxTypeSubTnxType':
      case 'AvailableTradeSubTnxStatus':
      case 'pre_approved_beneficiary':
      case 'product_type':
      case 'counterparty':
      case 'applicantName':
      case 'PHRASETYPE':
      case 'NegateParamValue':
      case 'PAB':
      case 'Bank':
      currentType = this.inputMultiselect;
      break;
      case'Date':
      currentType = this.datePicker;
      break;
      case'range':
      currentType = this.dateRange;
      break;
      case'Amount':
      case'AmountRange':
      currentType = this.amountRange;
      break;
      case'AccountType':
      case'EntityFilter':
      case'AccountNoFilter':
      currentType = this.dropdown;
      break;
      case'ChequeNoFilter':
      currentType = this.radio;
      break;
      case'HeaderFilter':
      currentType = this.text;
      break;
      case'ChequeFrom':
      case'retention_period':
      currentType = this.inputText;
      break;
      case 'spacer':
      currentType = this.spacer;
      break;
      case 'input-dropdown-filter':
      currentType = this.dropdownFiler;
      break;
      default:
      currentType = this.inputTextBox;
    }
    return currentType;
  }

  getTypeForCodeField() {
    return this.inputMultiselect;
  }


}
