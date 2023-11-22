import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, DynamicDialogRef } from 'primeng';
import { AmendCommonService } from './../../../../common/services/amend-common.service';

import { FccGlobalConstantService } from '../../../../../common/core/fcc-global-constant.service';
import { FccGlobalConstant } from '../../../../../common/core/fcc-global-constants';
import { FormModelService } from '../../../../../common/services/form-model.service';
import { ResolverService } from '../../../../../common/services/resolver.service';
import { SearchLayoutService } from '../../../../../common/services/search-layout.service';
import { TransactionDetailService } from '../../../../../common/services/transactionDetail.service';
import { FormControlService } from '../../../../../corporate/trade/lc/initiation/services/form-control.service';
import { ProductStateService } from '../../../lc/common/services/product-state.service';
import { SaveDraftService } from '../../../lc/common/services/save-draft.service';
import { CurrencyConverterPipe } from '../../../lc/initiation/pipes/currency-converter.pipe';
import { CustomCommasInCurrenciesPipe } from '../../../lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { FilelistService } from '../../../lc/initiation/services/filelist.service';
import { PrevNextService } from '../../../lc/initiation/services/prev-next.service';
import { UtilityService } from '../../../lc/initiation/services/utility.service';
import { FCCFormGroup } from './../../../../../base/model/fcc-control.model';
import { CodeDataService } from './../../../../../common/services/code-data.service';
import { CommonService } from './../../../../../common/services/common.service';
import { EventEmitterService } from './../../../../../common/services/event-emitter-service';
import { PhrasesService } from './../../../../../common/services/phrases.service';
import { LeftSectionService } from './../../../../common/services/leftSection.service';
import { EcProductComponent } from './../ec-product/ec-product.component';
import { EcProductService } from '../../services/ec-product.service';
import { HOST_COMPONENT } from './../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';

@Component({
  selector: 'app-ec-collection-instructions',
  templateUrl: './ec-collection-instructions.component.html',
  styleUrls: ['./ec-collection-instructions.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: EcCollectionInstructionsComponent }]
})
export class EcCollectionInstructionsComponent extends EcProductComponent implements OnInit {

  @Output() messageToEmit = new EventEmitter<string>();

  form: FCCFormGroup;
  module = `${this.translateService.instant('ecCollectionInstructionsDetails')}`;
  contextPath: any;
  tnxTypeCode: any;
  ecTermCode: any;
  params = 'params';
  readonly = 'readonly';
  advPaymtByValues: any;
  advAcptDueDateValues: any;
  advRefusalByValues: any;
  codeIDAdvPaymtBy: any;
  codeIDAdvAcptDueDate: any;
  codeIDAdvRefusalBy: any;
  phrasesResponse: any;
  ecOtherInst = 'ecOtherInst';
  ecNeedReferTo = 'ecNeedReferTo';
  enteredCharCount = 'enteredCharCount';
  mode: any;

  constructor(protected commonService: CommonService, protected leftSectionService: LeftSectionService,
              protected router: Router, protected translateService: TranslateService,
              protected prevNextService: PrevNextService, protected searchLayoutService: SearchLayoutService,
              protected utilityService: UtilityService, protected saveDraftService: SaveDraftService,
              protected formModelService: FormModelService, protected formControlService: FormControlService,
              protected stateService: ProductStateService, protected route: ActivatedRoute,
              protected eventEmitterService: EventEmitterService, protected transactionDetailService: TransactionDetailService,
              protected codeDataService: CodeDataService,
              protected fccGlobalConstantService: FccGlobalConstantService, protected phrasesService: PhrasesService,
              protected fileList: FilelistService, protected dialogRef: DynamicDialogRef, protected resolverService: ResolverService,
              protected confirmationService: ConfirmationService, protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe,
              protected currencyConverterPipe: CurrencyConverterPipe,
              protected amendCommonService: AmendCommonService, protected ecProductService: EcProductService) {
    super(eventEmitterService, stateService, commonService, translateService, confirmationService, customCommasInCurrenciesPipe,
      searchLayoutService, utilityService, resolverService, fileList, dialogRef, currencyConverterPipe, ecProductService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    this.contextPath = this.fccGlobalConstantService.contextPath;
    this.tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    this.initializeFormGroup();
    this.updateNarrativeCount();
    this.initializeTerms();
    this.checkECTenor();
    if (this.mode === FccGlobalConstant.DRAFT_OPTION && this.tnxTypeCode === FccGlobalConstant.N002_AMEND) {
      const productCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.PRODUCT);
      this.amendCommonService.compareTransactionAndMasterForAmend(productCode);
    }
  }

  updateNarrativeCount() {
    if (this.form.get('ecNeedReferTo').value) {
      const count = this.commonService.counterOfPopulatedData(this.form.get('ecNeedReferTo').value);
      this.form.get('ecNeedReferTo')[this.params][this.enteredCharCount] = count;
    }
    if (this.form.get('ecOtherInst').value) {
      const count = this.commonService.counterOfPopulatedData(this.form.get('ecOtherInst').value);
      this.form.get('ecOtherInst')[this.params][this.enteredCharCount] = count;
    }
  }

  /**
   * Initialise the form from state servic
   */
  initializeFormGroup() {
    const sectionName = FccGlobalConstant.EC_COLLECTION_INSTRUCTIONS_DETAILS;
    this.form = this.stateService.getSectionData(sectionName);
    if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND) {
      this.amendFormFields();
    }
  }

  amendFormFields() {
    this.amendCommonService.setValueFromMasterToPrevious(FccGlobalConstant.EC_COLLECTION_INSTRUCTIONS_DETAILS);
  }

  checkECTenor() {
    this.ecTermCode = this.stateService.getSectionData(FccGlobalConstant.EC_PAYMENT_DETAILS).get(FccGlobalConstant.EC_TERM_CODE).value;
    if (this.ecTermCode && this.ecTermCode === FccGlobalConstant.EC_TERM_CODE_SIGHT) {
      this.form.get(FccGlobalConstant.ADV_ACPT_DUE_DATE).setValue('');
      this.form.get(FccGlobalConstant.ADV_ACPT_DUE_DATE)[FccGlobalConstant.PARAMS][FccGlobalConstant.DISABLED] = true;
    } else {
      this.form.get(FccGlobalConstant.ADV_ACPT_DUE_DATE)[FccGlobalConstant.PARAMS][FccGlobalConstant.DISABLED] = false;
    }
  }

  onClickAdvPaymtBy() {
    this.codeIDAdvPaymtBy = this.form.get(FccGlobalConstant.ADV_PAYMT_BY)[FccGlobalConstant.PARAMS][FccGlobalConstant.CODE_ID];
    this.advPaymtByValues = this.codeDataService.getCodeData(this.codeIDAdvPaymtBy, FccGlobalConstant.PRODUCT_EC,
      FccGlobalConstant.SUBPRODUCT_DEFAULT, this.form, FccGlobalConstant.ADV_PAYMT_BY);
    this.patchFieldParameters(this.form.get(FccGlobalConstant.ADV_PAYMT_BY), { options: this.advPaymtByValues });
  }

  onClickAdvAcptDueDate() {
    this.codeIDAdvAcptDueDate = this.form.get(FccGlobalConstant.ADV_ACPT_DUE_DATE)[FccGlobalConstant.PARAMS][FccGlobalConstant.CODE_ID];
    this.advAcptDueDateValues = this.codeDataService.getCodeData(this.codeIDAdvPaymtBy, FccGlobalConstant.PRODUCT_EC,
      FccGlobalConstant.SUBPRODUCT_DEFAULT, this.form, FccGlobalConstant.ADV_ACPT_DUE_DATE);
    this.patchFieldParameters(this.form.get(FccGlobalConstant.ADV_ACPT_DUE_DATE), { options: this.advAcptDueDateValues });
  }

  onClickAdvRefusalBy() {
    this.codeIDAdvRefusalBy = this.form.get(FccGlobalConstant.ADV_REFUSAL_BY)[FccGlobalConstant.PARAMS][FccGlobalConstant.CODE_ID];
    this.advRefusalByValues = this.codeDataService.getCodeData(this.codeIDAdvPaymtBy, FccGlobalConstant.PRODUCT_EC,
      FccGlobalConstant.SUBPRODUCT_DEFAULT, this.form, FccGlobalConstant.ADV_REFUSAL_BY);
    this.patchFieldParameters(this.form.get(FccGlobalConstant.ADV_REFUSAL_BY), { options: this.advRefusalByValues });
  }

  initializeTerms() {
    this.codeIDAdvPaymtBy = this.form.get(FccGlobalConstant.ADV_PAYMT_BY)[FccGlobalConstant.PARAMS][FccGlobalConstant.CODE_ID];
    this.advPaymtByValues = this.codeDataService.getCodeData(this.codeIDAdvPaymtBy, FccGlobalConstant.PRODUCT_EC,
      FccGlobalConstant.SUBPRODUCT_DEFAULT, this.form, FccGlobalConstant.ADV_PAYMT_BY);
    this.patchFieldParameters(this.form.get(FccGlobalConstant.ADV_PAYMT_BY), { options: this.advPaymtByValues });

    this.codeIDAdvAcptDueDate = this.form.get(FccGlobalConstant.ADV_ACPT_DUE_DATE)[FccGlobalConstant.PARAMS][FccGlobalConstant.CODE_ID];
    this.advAcptDueDateValues = this.codeDataService.getCodeData(this.codeIDAdvPaymtBy, FccGlobalConstant.PRODUCT_EC,
      FccGlobalConstant.SUBPRODUCT_DEFAULT, this.form, FccGlobalConstant.ADV_ACPT_DUE_DATE);
    this.patchFieldParameters(this.form.get(FccGlobalConstant.ADV_ACPT_DUE_DATE), { options: this.advAcptDueDateValues });

    this.codeIDAdvRefusalBy = this.form.get(FccGlobalConstant.ADV_REFUSAL_BY)[FccGlobalConstant.PARAMS][FccGlobalConstant.CODE_ID];
    this.advRefusalByValues = this.codeDataService.getCodeData(this.codeIDAdvPaymtBy, FccGlobalConstant.PRODUCT_EC,
      FccGlobalConstant.SUBPRODUCT_DEFAULT, this.form, FccGlobalConstant.ADV_REFUSAL_BY);
    this.patchFieldParameters(this.form.get(FccGlobalConstant.ADV_REFUSAL_BY), { options: this.advRefusalByValues });
  }

  onClickPhraseIcon(event: any, key: any) {
    this.phrasesService.getPhrasesDetails(this.form, FccGlobalConstant.PRODUCT_EC, key);
  }

  ngOnDestroy() {
    this.stateService.setStateSection(FccGlobalConstant.EC_COLLECTION_INSTRUCTIONS_DETAILS, this.form);
  }
}
