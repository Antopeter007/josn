import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';

import { FccGlobalConstant } from '../../common/core/fcc-global-constants';
import { CommonService } from '../../common/services/common.service';
import { TransactionDetailService } from '../../common/services/transactionDetail.service';
import { ProductFormHeaderParams } from '../../common/model/params-model';
import { FccConstants } from '../../common/core/fcc-constants';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  drawdownHeader = 'drawdownHeader';
  rollOverHeader = 'rollOverHeader';
  loanIncreaseHeader = 'loanIncreaseHeader';
  loanRepaymentHeader = 'loanRepaymentHeader';
  productFormHeaderComponent = 'formHeaderComponent'; // defined in mapping.ts
  tdWithdrawalHeader = 'tdWithdrawalHeader';
  tdUpdateHeader = 'tdUpdateHeader';
  tdInitiationHeader = 'tdInitiationHeader';
  feePaymentHeader = 'feePaymentHeader';
  bulkServicesHeader = 'bulkServicesHeader';


  protected eventDetailsSections = [FccGlobalConstant.eventDetails, FccGlobalConstant.bankMessageEvents, FccGlobalConstant.FEES_AND_CHARGES,
  FccGlobalConstant.BANK_INST_HEADER, FccGlobalConstant.CUSTOMER_ATTACHMENTS, FccGlobalConstant.RELEASE_INSTRUCTION_SECTION,
  FccGlobalConstant.BANK_ATTACHMENT, FccGlobalConstant.ADVICE_DISCREPANCY, FccGlobalConstant.PREVIOUS_ATTACHMENTS, FccGlobalConstant.TRANSACTION_DETAILS];
  onClickView$ = new BehaviorSubject(false); // for onclick view in productcomponent/product form page
  onProductFormChange$ = new BehaviorSubject(null);
  onInnerProductFormChange$ = new BehaviorSubject(null);
  setSectionDetails: BehaviorSubject<any> = new BehaviorSubject('');

  constructor(protected translateService: TranslateService, protected titleService: Title,
              protected transactionDetailService: TransactionDetailService,
              protected commonService: CommonService) { }

  /**This method is set value to the title tag at the top of the window. The params used in this method are
   * @productCode
   * @subProductCode
   * @option
   */
  setTranslatedTitle(productCode, subProductCode, option) {
    let titleKey: any;
    const dontShowRouter = 'dontShowRouter';
    if (!(window[dontShowRouter] && window[dontShowRouter] === true)) {
      let title = '';
      titleKey = productCode;
      this.translateService.get('corporatechannels').subscribe((translated: string) => {
        if (null != titleKey && this.translateService.instant(titleKey) !== titleKey) {
          title = this.translateService.instant('MAIN_TITLE') + ' - ' + this.translateService.instant(titleKey);
        }
        // if title translation is missing, then display main title(to avoid displaying url)
        if(this.commonService.isnonEMptyString(title)) {
          this.titleService.setTitle(title);
        }
        else {
          const mainTitle = this.translateService.instant('MAIN_TITLE');
          this.titleService.setTitle(mainTitle);
        }
      });
    }
  }

  /**
   * This method is used to return the name of the header
   * on top of the stepper for
   * tnx_type_code as '13' and option as ACTION_REQUIRED
   * @param productCode
   * @param tnxId
   * @param mode
   * @param tnxType
   * @param subTnxType
   * @param subProductCode
   * @param option
   * @returns lcHeaderKey
   */

   actionRequiredheaderNameParams(productCode, tnxId, mode, tnxType, subTnxType, subProductCode, option): Observable<any> {
    let headerNameParams = '';
    return new Observable(subscriber => {
    this.transactionDetailService.fetchTransactionDetails(tnxId, productCode).subscribe(
      response => {
      const responseObj = response.body;
      if (responseObj.action_req_code) {
        const actionRequiredCode = responseObj.action_req_code;
        headerNameParams = this.getHeaderNameParams(productCode, mode, tnxType, subTnxType, subProductCode, option, actionRequiredCode);
      }
      subscriber.next(headerNameParams);
    });
  });

  }

  /** This method is getting called by headerNameParams in this service internally
   *
   * @param productCode
   * @param mode
   * @param tnxType
   * @param subTnxType
   * @param subProductCode
   * @param option
   * @param actionRequiredCode
   * @returns headerNameParams
   */
  getHeaderNameParams(productCode, mode, tnxType, subTnxType, subProductCode, option, actionRequiredCode: any) {
    let headerNameParams: any;
    switch (productCode) {
      case FccGlobalConstant.PRODUCT_TF:
        headerNameParams = productCode.concat(option ? option : '')
          .concat(mode ? mode : '')
          .concat(tnxType ? tnxType : '')
          .concat(subTnxType !== undefined ? subTnxType : '')
          .concat(actionRequiredCode !== undefined ? actionRequiredCode : '');
        break;
      default:
        headerNameParams = productCode.concat((subProductCode !== undefined ? subProductCode : ''))
          .concat(option ? option : '')
          .concat(mode ? mode : '')
          .concat(tnxType ? tnxType : '')
          .concat(subTnxType !== undefined ? subTnxType : '')
          .concat(actionRequiredCode !== undefined ? actionRequiredCode : '');
    }
    return headerNameParams;
  }

  /**This method is used to return the name of the header
   * on top of the stepper
   * @param productCode
   * @param mode
   * @param tnxType
   * @param subTnxType
   * @param subProductCode
   * @param option
   * @returns lcHeaderKey
   */
  getHeaderName(productCode, mode, tnxType, subTnxType, subProductCode, option, operation, action) {
    let headerName: any;
    if (productCode) {
    switch (productCode) {
      case FccGlobalConstant.PRODUCT_TF:
        headerName = productCode.concat(option ? option : '')
          .concat(mode ? mode : '')
          .concat(tnxType ? tnxType : '')
          .concat(subTnxType !== undefined ? subTnxType : '');
        break;
      default:
        headerName = productCode.concat((subProductCode !== undefined ? subProductCode : ''))
          .concat(option ? option : '')
          .concat(mode ? mode : '')
          .concat(tnxType ? tnxType : '')
          .concat(subTnxType !== undefined ? subTnxType : '');
    }
  } else if (option) {
    headerName = option.concat((operation ? operation : ''))
          .concat(mode ? mode : '')
          .concat(tnxType ? tnxType : '')
          .concat(action ? action : '');
  }
    return headerName;
  }

  /** This method returns boolean value whether the user has
   * list of collaboration permissions or not
   *
   * @returns permissionFlag
   */
  getTaskCreatePermission(){
    let permissionFlag = false;
    const permissions = ['collaboration_add_private_task', 'collaboration_add_public_task', 'collaboration_add_public_task_for_bank', 'collaboration_add_public_task_for_other_user', 'collboration_add_other_user'];
    for (const index in permissions)
     {
      if (this.commonService.getUserPermissionFlag(permissions[index]))
      { permissionFlag = true;
        break;
      }
    }
    return permissionFlag;
  }

  /**
   * This method returns whether a param is valid or not
   * @param param
   * @returns isParamValid
   */
  isParamValid(param: any) {
    let isParamValid = false;
    if (param !== undefined && param !== null && param !== '') {
      isParamValid = true;
    }
    return isParamValid;
  }

  /**
   * This method is used to check whether the form loading has data available on form load
   * @param tnxType
   * @param option
   * @param mode
   * @param tnxId
   * @param parent
   * @returns form state
   */
  checkStateForErrorValidation(tnxType, option, mode, tnxId, parent, operation): boolean {
    if ((tnxType === FccGlobalConstant.N002_NEW ) || (mode === 'DRAFT') ||
        (tnxType === FccGlobalConstant.N002_INQUIRE && !parent && (option === FccGlobalConstant.OPTION_ASSIGNEE ||
        option === FccGlobalConstant.EXISTING_OPTION || option === FccGlobalConstant.OPTION_TRANSFER ||
        option === FccGlobalConstant.CANCEL_OPTION )) || 
        (tnxType === FccGlobalConstant.N002_INQUIRE && !parent && (mode === 'view' && option === undefined && operation === undefined)) ||
        ( operation === 'LIST_INQUIRY' || operation === 'PREVIEW') ||
        (tnxType === FccGlobalConstant.N002_NEW && option === 'EXISTING') ||
        (tnxType === FccGlobalConstant.N002_INQUIRE && (option === FccGlobalConstant.ACTION_REQUIRED
        || mode === FccGlobalConstant.DISCREPANT) && tnxId !== undefined && tnxId !== null && (mode !== 'view' || (parent && mode === 'view')))) {
      return true;
    } else {
        return false;
    }
  }

  /**
   * This method checks if option is ACTION_REQUIRED or mode is DISCREPANT
   * @param actionRequiredOption
   * @param discrepantmode
   * @returns true if condition is satisfied
   */
   checkForDiscrepantOrActionRequired(actionRequiredOption, discrepantmode): boolean {
    if (actionRequiredOption === FccGlobalConstant.ACTION_REQUIRED || discrepantmode === FccGlobalConstant.DISCREPANT) {
      return true;
    }
  }

  checkForDraftAndActionRequiredQuery(discrepantmode): boolean {
    if (discrepantmode === FccGlobalConstant.DRAFT_OPTION && this.commonService.getQueryParametersFromKey('actionReqCode') !== undefined
    && this.commonService.getQueryParametersFromKey('actionReqCode') !== null) {
      return true;
    }
  }

  /**
   * This method is used to return the form name
   * @param productCode
   * @param tnxType
   * @param subTnxType
   * @param subProductCode
   * @param productFormHeaderContext
   * @returns formName
   */
   getFormName(productCode, tnxType, subTnxType, subProductCode, option?, operation?) {
    let formName = '';
    if (productCode) {
      switch (productCode) {
      case FccGlobalConstant.PRODUCT_BG:
      case FccGlobalConstant.PRODUCT_TF:
        formName = productCode;
        break;
      case FccGlobalConstant.PRODUCT_LN:
        if (tnxType === FccGlobalConstant.N002_NEW) {
          formName = this.translateService.instant(this.drawdownHeader);
        }
        else if (tnxType === FccGlobalConstant.N002_AMEND){
          formName = this.translateService.instant(this.loanIncreaseHeader);
        }else if (tnxType === FccGlobalConstant.N002_INQUIRE){
          formName = this.translateService.instant(this.loanRepaymentHeader);
        }else {
          formName = productCode.concat(((subProductCode !== undefined &&
            subProductCode !== null && subProductCode !== '') ? '.'.concat(subProductCode) : ''));
        }
        break;
      case FccGlobalConstant.PRODUCT_BK:
        if (subProductCode === FccGlobalConstant.SUB_PRODUCT_LNRPN && tnxType === FccGlobalConstant.N002_NEW) {
          formName = this.translateService.instant(this.rollOverHeader);
        }
        if (subProductCode === FccGlobalConstant.SUB_PRODUCT_BLFP && tnxType === FccGlobalConstant.N002_NEW) {
          formName = this.translateService.instant(this.feePaymentHeader);
        }
        if (this.commonService.getQueryParametersFromKey('category') === FccGlobalConstant.CATEGORY_CASH){
          formName = this.translateService.instant(this.bulkServicesHeader);
        }
        break;
        case FccGlobalConstant.PRODUCT_TD:
          if (subProductCode === FccGlobalConstant.SUB_PRODUCT_CODE_CSTD && tnxType === FccGlobalConstant.N002_AMEND) {
            formName = this.translateService.instant(this.tdUpdateHeader);
          } else if (subProductCode === FccGlobalConstant.SUB_PRODUCT_CODE_CSTD && tnxType === FccGlobalConstant.N002_NEW) {
            formName = this.translateService.instant(this.tdInitiationHeader);
          } else if (subProductCode === FccGlobalConstant.SUB_PRODUCT_CODE_CSTD && tnxType === FccGlobalConstant.N002_INQUIRE) {
            formName = this.translateService.instant(this.tdWithdrawalHeader);
          }
          break;
        case FccGlobalConstant.PRODUCT_FT:
          formName = productCode.concat(((subProductCode !== undefined &&
            subProductCode !== null && subProductCode !== '') ? '_'.concat(subProductCode) : ''));
          break;
      default:
        formName = productCode.concat(((subProductCode !== undefined &&
          subProductCode !== null && subProductCode !== '') ? '.'.concat(subProductCode) : ''));
        }
      } else if (!productCode && option) {
          formName = operation ? option.concat(FccConstants.STRING_UNDERSCORE).concat(operation) : option
      }
    return formName;
  }

  getConditionForHandleMasterTnxState(tnxType: string, productCode: string, subProductCode: string): boolean {
    return (tnxType === FccGlobalConstant.N002_INQUIRE);
  }

  getSetSectionListConditionToPushItem(item: string): boolean {
     return (this.eventDetailsSections.indexOf(item) === -1);
    //  return (item !== 'eventDetails' && item !== 'bankMessageEvents' && item !== FccGlobalConstant.FEES_AND_CHARGES &&
    //   item !== FccGlobalConstant.BANK_INST_HEADER && item !== FccGlobalConstant.CUSTOMER_ATTACHMENTS &&
    //   item !== FccGlobalConstant.RELEASE_INSTRUCTION_SECTION && item !== FccGlobalConstant.BANK_ATTACHMENT);
  }

  getConditionForUpdateSectionOnLoad(section: string, sectionList, storeIndexValue): boolean {
    return(sectionList.indexOf(section) >= storeIndexValue && this.eventDetailsSections.indexOf(section) === -1);
    // section !== 'eventDetails' && section !== 'bankMessageEvents' &&
    // section !== FccGlobalConstant.FEES_AND_CHARGES && section !== FccGlobalConstant.BANK_INST_HEADER &&
    // section !== FccGlobalConstant.CUSTOMER_ATTACHMENTS && section !== FccGlobalConstant.RELEASE_INSTRUCTION_SECTION
    // && section !== FccGlobalConstant.BANK_ATTACHMENT);
  }

  getConditionForUpdateSectionOnChange(section: string, items, storeIndexValue): boolean {
    return (items.indexOf(section) >= storeIndexValue && this.eventDetailsSections.indexOf(section) === -1);
    // section !== 'eventDetails' && section !== 'bankMessageEvents' &&
    // section !== FccGlobalConstant.BANK_ATTACHMENT && section !== FccGlobalConstant.FEES_AND_CHARGES &&
    // section !== FccGlobalConstant.BANK_INST_HEADER && section !== FccGlobalConstant.CUSTOMER_ATTACHMENTS &&
    // section !== FccGlobalConstant.RELEASE_INSTRUCTION_SECTION);
  }

  /**
   * check for enabling view icon for master view
   * update criteria as and when needed for other products/subproducts/options
   *  @param params ProductFormHeaderParams type
   */
     isViewDetailEnabled(params: ProductFormHeaderParams): boolean {
      // currently applicable for below type, extend as per need
      return params.option === FccGlobalConstant.OPTION_ASSIGNEE || params.option === FccGlobalConstant.OPTION_TRANSFER
        || params.tnxTypeCode === FccGlobalConstant.N002_INQUIRE || params.subTnxTypeCode === FccGlobalConstant.N003_AMEND_RELEASE
        || params.tnxTypeCode === FccGlobalConstant.N002_AMEND;
    }

    /**
     * to enable form subheader
     * @param params ProductFormHeaderParams type
     */
    isSubHeaderEnabled(params: ProductFormHeaderParams): boolean {
      return false;
    }

    /**
     * returns form header component defined in mapping.ts for dynamic loading in product component.
     * for overriding the same in client. define in client mapping
     * @param context optional
     */
    getFormHeaderComponent(context?) {
      return this.productFormHeaderComponent;
    }

    /**
   * This method is used to add the validations on form save
   * @componentState Dynamic Component state
   * @section   section name
   */
  OnSaveFormValidation(componentState, section) {
    // for adding validation while customization
}

  setCurrentSectionData(data) {
    this.setSectionDetails.next(data);
  }

  displayDescription(params: any): boolean {
    return params.productCode === FccGlobalConstant.PRODUCT_FT && params.subProductCode === FccGlobalConstant.FT_TPT;
  }

}
