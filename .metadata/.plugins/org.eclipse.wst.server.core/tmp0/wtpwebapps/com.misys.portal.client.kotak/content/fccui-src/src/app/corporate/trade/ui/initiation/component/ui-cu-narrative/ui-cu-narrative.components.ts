import { FccGlobalConstant } from './../../../../../../common/core/fcc-global-constants';
import { TranslateService } from '@ngx-translate/core';
import { FCCFormGroup } from './../../../../../../base/model/fcc-control.model';
import { Component, Input, OnInit } from '@angular/core';
import { UiProductComponent } from '../ui-product/ui-product.component';
import { CommonService } from '../../../../../../common/services/common.service';
import { EventEmitterService } from '../../../../../../common/services/event-emitter-service';
import { ProductStateService } from '../../../../../../corporate/trade/lc/common/services/product-state.service';
import { Validators } from '@angular/forms';
import { FccBusinessConstantsService } from './../../../../../../common/core/fcc-business-constants.service';
import { LcConstant } from '../../../../../../corporate/trade/lc/common/model/constant';
import { PhrasesService } from '../../../../../../common/services/phrases.service';
import { ConfirmationService, DynamicDialogRef } from 'primeng';
import { CustomCommasInCurrenciesPipe } from '../../../../lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { UtilityService } from '../../../../lc/initiation/services/utility.service';
import { ResolverService } from '../../../../../../common/services/resolver.service';
import { SearchLayoutService } from '../../../../../../common/services/search-layout.service';
import { FilelistService } from '../../../../lc/initiation/services/filelist.service';
import { CurrencyConverterPipe } from './../../../../lc/initiation/pipes/currency-converter.pipe';
import { UiProductService } from '../../../services/ui-product.service';
import { HOST_COMPONENT } from './../../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';

@Component({
  selector: 'app-ui-cu-narrative',
  templateUrl: './ui-cu-narrative.components.html',
  styleUrls: ['./ui-cu-narrative.components.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: UiCuNarrativeComponent }]
})
export class UiCuNarrativeComponent extends UiProductComponent implements OnInit {

  module = ``;
  form: FCCFormGroup;
  @Input() parentForm: FCCFormGroup;
  @Input() data;
  @Input() controlName;
  constant = new LcConstant();
  params = this.constant.params;
  allowedCharCount = this.constant.allowedCharCount;
  maxlength = this.constant.maximumlength;
  enteredCharCount = 'enteredCharCount';
  modeOfTransmission;
  swiftZChar;
  option: any;
  constructor(protected translateService: TranslateService, protected eventEmitterService: EventEmitterService,
              protected stateService: ProductStateService, protected commonService: CommonService,
              protected phrasesService: PhrasesService, protected confirmationService: ConfirmationService,
              protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe, protected utilityService: UtilityService,
              protected searchLayoutService: SearchLayoutService, protected resolverService: ResolverService,
              protected fileList: FilelistService, protected dialogRef: DynamicDialogRef,
              protected currencyConverterPipe: CurrencyConverterPipe, protected uiProductService: UiProductService) {
              super(eventEmitterService, stateService, commonService, translateService, confirmationService, customCommasInCurrenciesPipe,
                searchLayoutService, utilityService, resolverService, fileList, dialogRef, currencyConverterPipe, uiProductService);
}

  ngOnInit(): void {
    this.initializeFormGroup();
    this.option = this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPTION);
    if (this.option === FccGlobalConstant.TEMPLATE) {
      this.setMandatoryFields(this.form, ['cuNarrativeUndertakingTermsAndConditions', 'cuNarrativeUnderlyingTransactionDetails'], false);
      this.form.get('cuNarrativeUndertakingTermsAndConditions').clearValidators();
      this.form.get('cuNarrativeUnderlyingTransactionDetails').clearValidators();
      this.form.updateValueAndValidity();
    }
  }

  initializeFormGroup() {
    const form = this.parentForm.controls[this.controlName];
    this.tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.swiftZChar = response.swiftZChar;
      }
    });
    if (form !== null) {
      this.form = form as FCCFormGroup;
    }
    this.modeOfTransmission = this.stateService.getSectionData(FccGlobalConstant.UI_GENERAL_DETAIL, undefined, this.isMasterRequired)
    .get('advSendMode').value;
    if (this.tnxTypeCode !== FccGlobalConstant.N002_AMEND) {
      this.form.get('cuNarrativeUndertakingTermsAndConditions').clearValidators();
      this.form.get('cuNarrativeUnderlyingTransactionDetails').clearValidators();
      this.form.get('cuNarrativePresentationInstructions').clearValidators();
      if (this.modeOfTransmission !== FccBusinessConstantsService.SWIFT) {
        this.form.get('cuNarrativeUndertakingTermsAndConditions')[this.params][this.allowedCharCount] = '9750';
        this.form.get('cuNarrativeUndertakingTermsAndConditions')[this.params][this.maxlength] = '9750';
        this.form.get('cuNarrativeUnderlyingTransactionDetails')[this.params][this.allowedCharCount] = '3250';
        this.form.get('cuNarrativeUnderlyingTransactionDetails')[this.params][this.maxlength] = '3250';
        this.form.get('cuNarrativePresentationInstructions')[this.params][this.allowedCharCount] = '6500';
        this.form.get('cuNarrativePresentationInstructions')[this.params][this.maxlength] = '6500';
        this.form.get('cuNarrativeUndertakingTermsAndConditions').clearValidators();
        this.form.get('cuNarrativeUnderlyingTransactionDetails').clearValidators();
        this.form.get('cuNarrativePresentationInstructions').clearValidators();
      } else {
        this.form.get('cuNarrativeUndertakingTermsAndConditions')[this.params][this.allowedCharCount] = '9750';
        this.form.get('cuNarrativeUndertakingTermsAndConditions')[this.params][this.maxlength] = '9750';
        this.form.get('cuNarrativeUnderlyingTransactionDetails')[this.params][this.allowedCharCount] = '3250';
        this.form.get('cuNarrativeUnderlyingTransactionDetails')[this.params][this.maxlength] = '3250';
        this.form.get('cuNarrativePresentationInstructions')[this.params][this.allowedCharCount] = '6500';
        this.form.get('cuNarrativePresentationInstructions')[this.params][this.maxlength] = '6500';
        this.form.addFCCValidators('cuNarrativeUndertakingTermsAndConditions', Validators.pattern(this.swiftZChar), 0);
        this.form.addFCCValidators('cuNarrativeUnderlyingTransactionDetails', Validators.pattern(this.swiftZChar), 0);
        this.form.addFCCValidators('cuNarrativePresentationInstructions', Validators.pattern(this.swiftZChar), 0);
      }
    }
  }

  onClickPhraseIcon(event, key) {
    this.phrasesService.getPhrasesDetails(this.form, FccGlobalConstant.PRODUCT_BG, key, '', true);
  }

  onBlurBgNarrativeTextUndertaking() {
    if (this.option === FccGlobalConstant.TEMPLATE) {
      this.setMandatoryField(this.form, 'cuNarrativeUndertakingTermsAndConditions', false);
      this.form.get('cuNarrativeUndertakingTermsAndConditions').clearValidators();
      if (this.modeOfTransmission !== FccBusinessConstantsService.SWIFT) {
        this.form.get('cuNarrativeUndertakingTermsAndConditions')[this.params][this.allowedCharCount] = '9750';
        this.form.get('cuNarrativeUndertakingTermsAndConditions')[this.params][this.maxlength] = '9750';
      }
      else {
        this.form.get('cuNarrativeUndertakingTermsAndConditions')[this.params][this.allowedCharCount] = '9750';
        this.form.get('cuNarrativeUndertakingTermsAndConditions')[this.params][this.maxlength] = '9750';
        this.form.addFCCValidators('cuNarrativeUndertakingTermsAndConditions', Validators.pattern(this.swiftZChar), 0);
      }
      this.form.get('cuNarrativeUndertakingTermsAndConditions').updateValueAndValidity();
    }
  }

  onBlurCuNarrativeUnderlyingTransactionDetails() {
    if (this.option === FccGlobalConstant.TEMPLATE) {
      this.setMandatoryField(this.form, 'cuNarrativeUnderlyingTransactionDetails', false);
      this.form.get('cuNarrativeUnderlyingTransactionDetails').clearValidators();
      if (this.modeOfTransmission !== FccBusinessConstantsService.SWIFT) {
        this.form.get('cuNarrativeUnderlyingTransactionDetails')[this.params][this.allowedCharCount] = '3250';
        this.form.get('cuNarrativeUnderlyingTransactionDetails')[this.params][this.maxlength] = '3250';
      }
      else {
        this.form.get('cuNarrativeUnderlyingTransactionDetails')[this.params][this.allowedCharCount] = '3250';
        this.form.get('cuNarrativeUnderlyingTransactionDetails')[this.params][this.maxlength] = '3250';
        this.form.addFCCValidators('cuNarrativeUnderlyingTransactionDetails', Validators.pattern(this.swiftZChar), 0);
      }
      this.form.get('cuNarrativeUnderlyingTransactionDetails').updateValueAndValidity();
    }
  }

  ngOnDestroy() {
    this.parentForm.controls[this.controlName] = this.form;
  }

}
