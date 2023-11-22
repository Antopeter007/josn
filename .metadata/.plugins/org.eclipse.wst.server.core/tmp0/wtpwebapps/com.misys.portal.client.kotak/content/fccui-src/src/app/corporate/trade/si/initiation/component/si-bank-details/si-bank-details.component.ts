import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  ElementRef,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, DynamicDialogRef } from 'primeng';
import { BehaviorSubject } from 'rxjs';
import { CurrencyConverterPipe } from './../../../../lc/initiation/pipes/currency-converter.pipe';

import { FccGlobalConstantService } from '../../../../../../common/core/fcc-global-constant.service';
import { FccGlobalConstant } from '../../../../../../common/core/fcc-global-constants';
import { CommonService } from '../../../../../../common/services/common.service';
import { EventEmitterService } from '../../../../../../common/services/event-emitter-service';
import { ResolverService } from '../../../../../../common/services/resolver.service';
import { SearchLayoutService } from '../../../../../../common/services/search-layout.service';
import { CustomCommasInCurrenciesPipe } from '../../../../lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { FilelistService } from '../../../../lc/initiation/services/filelist.service';
import { SiAdviseThroughBankComponent } from '../si-advise-through-bank/si-advise-through-bank.component';
import { SiAdvisingBankComponent } from '../si-advising-bank/si-advising-bank.component';
import { SiConfirmationPartyComponent } from '../si-confirmation-party/si-confirmation-party.component';
import { SiIssuingBankComponent } from '../si-issuing-bank/si-issuing-bank.component';
import { SiProductComponent } from '../si-product/si-product.component';
import { FCCFormGroup } from './../../../../../../base/model/fcc-control.model';
import { FccBusinessConstantsService } from './../../../../../../common/core/fcc-business-constants.service';
import { FormModelService } from './../../../../../../common/services/form-model.service';
import { LcTemplateService } from './../../../../../../common/services/lc-template.service';
import { AmendCommonService } from './../../../../../../corporate/common/services/amend-common.service';
import { CorporateCommonService } from './../../../../../../corporate/common/services/common.service';
import { ProductStateService } from './../../../../../../corporate/trade/lc/common/services/product-state.service';
import { SaveDraftService } from './../../../../../../corporate/trade/lc/common/services/save-draft.service';
import { FormControlService } from './../../../../../../corporate/trade/lc/initiation/services/form-control.service';
import { LcReturnService } from './../../../../../../corporate/trade/lc/initiation/services/lc-return.service';
import { PrevNextService } from './../../../../../../corporate/trade/lc/initiation/services/prev-next.service';
import { UtilityService } from './../../../../../../corporate/trade/lc/initiation/services/utility.service';
import { SiProductService } from '../../../services/si-product.service';
import { HOST_COMPONENT } from './../../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';
import { SiBankService } from '../../../services/si-bank.service';


@Component({
  selector: 'app-si-bank-details',
  templateUrl: './si-bank-details.component.html',
  styleUrls: ['./si-bank-details.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: SiBankDetailsComponent }]
})
export class SiBankDetailsComponent extends SiProductComponent implements OnInit, AfterViewInit, OnDestroy {

  form: FCCFormGroup;
  readonly rendered = 'rendered';
  @Output() notify = new EventEmitter<any>();
  @ViewChild('tabs') public tabs: MatTabGroup;
  @ViewChild(SiIssuingBankComponent, { read: SiIssuingBankComponent }) public siIssuingBankComponent: SiIssuingBankComponent;
  @ViewChild(SiAdviseThroughBankComponent,
    { read: SiAdviseThroughBankComponent }) public siAdviseThroughBankComponent: SiAdviseThroughBankComponent;
  @ViewChild(SiAdvisingBankComponent, { read: SiAdvisingBankComponent }) public siAdvisingBankComponent: SiAdvisingBankComponent;
  @ViewChild(SiConfirmationPartyComponent,
    { read: SiConfirmationPartyComponent }) public siConfirmationPartyComponent: SiConfirmationPartyComponent;
  mode;
  module = `${this.translateService.instant(FccGlobalConstant.SI_BANK_DETAILS)}`;
  confirmationPartyValue;
  productCode: any;
  confirmationBehaviourSubject = new BehaviorSubject(null);
  tnxTypeCode: any;
  isMasterRequired: any;
  constructor(protected translateService: TranslateService,
              protected commonService: CommonService,
              protected lcReturnService: LcReturnService,
              protected router: Router,
              protected utilityService: UtilityService,
              protected corporateCommonService: CorporateCommonService,
              protected fccGlobalConstantService: FccGlobalConstantService,
              protected prevNextService: PrevNextService,
              protected saveDraftService: SaveDraftService,
              protected lcTemplateService: LcTemplateService,
              protected formModelService: FormModelService,
              protected formControlService: FormControlService,
              protected searchLayoutService: SearchLayoutService,
              protected stateService: ProductStateService,
              protected emitterService: EventEmitterService,
              protected viewContainerRef: ViewContainerRef,
              protected elementRef: ElementRef,
              protected cdRef: ChangeDetectorRef,
              protected resolver: ComponentFactoryResolver,
              protected amendCommonService: AmendCommonService,
              protected confirmationService: ConfirmationService,
              protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe,
              protected resolverService: ResolverService,
              protected fileArray: FilelistService,
              protected dialogRef: DynamicDialogRef,
              protected currencyConverterPipe: CurrencyConverterPipe,
              protected siProductService: SiProductService,
              protected siBankService: SiBankService
) {
super(emitterService, stateService, commonService, translateService, confirmationService,
  customCommasInCurrenciesPipe, searchLayoutService, utilityService, resolverService, fileArray,
  dialogRef, currencyConverterPipe, siProductService);

}

ngOnInit() {
  window.scroll(0, 0);
  this.isMasterRequired = this.isMasterRequired;
  this.tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
  this.productCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.PRODUCT);
  this.form = this.stateService.getSectionData(FccGlobalConstant.SI_BANK_DETAILS, undefined, this.isMasterRequired);
  this.mode = this.stateService.getSectionData(FccGlobalConstant.SI_GENERAL_DETAILS).get('transmissionMode').value;
  this.confirmationPartyValue = this.stateService.getSectionData(FccGlobalConstant.SI_GENERAL_DETAILS).get('confirmationOptions').value;
  if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND) {
    this.amendFormFields();
  }
}

handleOnChange() {
  if (this.siIssuingBankComponent) {
    this.siIssuingBankComponent.ngOnDestroy();
  }
  if (this.siAdviseThroughBankComponent) {
    this.siAdviseThroughBankComponent.ngOnDestroy();
  }
  if (this.siAdvisingBankComponent) {
    this.siAdvisingBankComponent.ngOnDestroy();
  }
  if (this.siConfirmationPartyComponent) {
    this.siConfirmationPartyComponent.ngOnDestroy();
  }
}

ngAfterViewInit() {
  this.siBankService.afterViewMethod(this.form, this.confirmationPartyValue, this.elementRef, this.tnxTypeCode);
}

handleControlComponentsData(event: any){
  if (this.confirmationPartyValue === FccBusinessConstantsService.WITHOUT_03) {
    event.get('bankDetailsTab').get('querySelectorAllValue')[FccGlobalConstant.LENGTH_3].style.display = 'none';
  }
}

amendFormFields() {
  this.siBankService.amendFormFields();
}

ngOnDestroy(): void {
  this.stateService.setStateSection(FccGlobalConstant.SI_BANK_DETAILS, this.form, this.isMasterRequired);
}
}

