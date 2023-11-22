import {
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

import { FccGlobalConstantService } from '../../../../../../common/core/fcc-global-constant.service';
import { FccGlobalConstant } from '../../../../../../common/core/fcc-global-constants';
import { ResolverService } from '../../../../../../common/services/resolver.service';
import { SearchLayoutService } from '../../../../../../common/services/search-layout.service';
import { AmendCommonService } from '../../../../../common/services/amend-common.service';
import { ProductStateService } from '../../../common/services/product-state.service';
import { CurrencyConverterPipe } from '../../pipes/currency-converter.pipe';
import { CustomCommasInCurrenciesPipe } from '../../pipes/custom-commas-in-currencies.pipe';
import { FilelistService } from '../../services/filelist.service';
import { UtilityService } from '../../services/utility.service';
import { IssuingBankComponent } from '../issuing-bank/issuing-bank.component';
import { FCCFormGroup } from './../../../../../../base/model/fcc-control.model';
import { FccBusinessConstantsService } from './../../../../../../common/core/fcc-business-constants.service';
import { CommonService } from './../../../../../../common/services/common.service';
import { EventEmitterService } from './../../../../../../common/services/event-emitter-service';
import { FormModelService } from './../../../../../../common/services/form-model.service';
import { LcTemplateService } from './../../../../../../common/services/lc-template.service';
import { CorporateCommonService } from './../../../../../../corporate/common/services/common.service';
import { SaveDraftService } from './../../../common/services/save-draft.service';
import { FormControlService } from './../../services/form-control.service';
import { LcReturnService } from './../../services/lc-return.service';
import { PrevNextService } from './../../services/prev-next.service';
import { AdviseThroughBankComponent } from './../advise-through-bank/advise-through-bank.component';
import { AdvisingBankComponent } from './../advising-bank/advising-bank.component';
import { ConfirmationPartyComponent } from './../confirmation-party/confirmation-party.component';
import { LcProductComponent } from './../lc-product/lc-product.component';
import { LcProductService } from '../../../services/lc-product.service';
import { HOST_COMPONENT } from './../../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';
import { LcBankService } from '../../../services/lc-bank.service';

@Component({
  selector: 'fcc-trade-bank-details',
  templateUrl: './fcc-bank-details.component.html',
  styleUrls: ['./fcc-bank-details.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: FccBankDetailsComponent }]
})
export class FccBankDetailsComponent extends LcProductComponent implements OnInit, OnDestroy {
  form: FCCFormGroup;
  readonly rendered = 'rendered';
  @Output() notify = new EventEmitter<any>();
  @ViewChild('tabs') tabs: MatTabGroup;
  @ViewChild(IssuingBankComponent, { read: IssuingBankComponent }) public issuingBankComponent: IssuingBankComponent;
  @ViewChild(AdviseThroughBankComponent, { read: AdviseThroughBankComponent })
  public adviseThroughBankComponent: AdviseThroughBankComponent;
  @ViewChild(AdvisingBankComponent, { read: AdvisingBankComponent }) public advisingBankComponent: AdvisingBankComponent;
  @ViewChild(ConfirmationPartyComponent, { read: ConfirmationPartyComponent })
  public confirmationPartyComponent: ConfirmationPartyComponent;
  mode;
  module = `${this.translateService.instant('bankDetails')}`;
  confirmationPartyValue;
  productCode: any;
  confirmationBehaviourSubject = new BehaviorSubject(null);
  isMasterRequired: any;
  tnxTypeCode: any;

  constructor(protected translateService: TranslateService,
              protected commonService: CommonService,
              protected lcReturnService: LcReturnService, protected router: Router,
              protected utilityService: UtilityService, protected corporateCommonService: CorporateCommonService,
              protected fccGlobalConstantService: FccGlobalConstantService,
              protected prevNextService: PrevNextService, protected saveDraftService: SaveDraftService,
              protected lcTemplateService: LcTemplateService, protected formModelService: FormModelService,
              protected formControlService: FormControlService, protected searchLayoutService: SearchLayoutService,
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
              protected fileList: FilelistService,
              protected dialogRef: DynamicDialogRef,
              protected currencyConverterPipe: CurrencyConverterPipe,
              protected lcProductService: LcProductService,
              protected lcBankService: LcBankService
  ) {
    super(emitterService, stateService, commonService, translateService, confirmationService, customCommasInCurrenciesPipe,
          searchLayoutService, utilityService, resolverService, fileList, dialogRef, currencyConverterPipe, lcProductService);
  }

  ngOnInit() {
    window.scroll(0, 0);
    this.isMasterRequired = this.isMasterRequired;
    this.tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    this.productCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.PRODUCT);
    this.form = this.stateService.getSectionData(FccGlobalConstant.BANK_DETAILS, undefined, this.isMasterRequired);
    this.mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    this.confirmationPartyValue = this.stateService.getSectionData(FccGlobalConstant.GENERAL_DETAILS).get('confirmationOptions').value;
    this.operation = this.commonService.getQueryParametersFromKey (FccGlobalConstant.OPERATION);
    if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND) {
      this.amendFormFields();
    }
  }

  handleControlComponentsData(event: any){
    // eslint-disable-next-line no-console
    console.log(event);
    if (this.confirmationPartyValue === FccBusinessConstantsService.WITHOUT_03) {
      event.get('bankDetailsTab').get('querySelectorAllValue')[FccGlobalConstant.LENGTH_3].style.display = 'none';
    }
  }

  handleOnChange() {
    if (this.issuingBankComponent) {
      this.issuingBankComponent.ngOnDestroy();
    }
    if (this.adviseThroughBankComponent) {
      this.adviseThroughBankComponent.ngOnDestroy();
    }
    if (this.advisingBankComponent) {
      this.advisingBankComponent.ngOnDestroy();
    }
    if (this.confirmationPartyComponent) {
      this.confirmationPartyComponent.ngOnDestroy();
    }
  }

  ngAfterViewInit() {
    this.lcBankService.afterViewMethod(this.form , this.confirmationPartyValue , this.elementRef ,
      this.tnxTypeCode, this.mode, this.operation);
  }

  amendFormFields() {
    this.lcBankService.amendFormFields();
  }

  ngOnDestroy(): void {
    this.stateService.setStateSection(FccGlobalConstant.BANK_DETAILS, this.form, this.isMasterRequired);
  }
}
