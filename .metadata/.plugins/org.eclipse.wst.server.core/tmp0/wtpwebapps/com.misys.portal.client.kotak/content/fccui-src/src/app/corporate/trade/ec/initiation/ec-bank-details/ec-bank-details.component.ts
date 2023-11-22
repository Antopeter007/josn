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
import { AmendCommonService } from '../../../../../corporate/common/services/amend-common.service';
import { FCCFormGroup } from '../../../../../base/model/fcc-control.model';
import { FccGlobalConstantService } from '../../../../../common/core/fcc-global-constant.service';
import { FccGlobalConstant } from '../../../../../common/core/fcc-global-constants';
import { CommonService } from '../../../../../common/services/common.service';
import { EventEmitterService } from '../../../../../common/services/event-emitter-service';
import { FormModelService } from '../../../../../common/services/form-model.service';
import { LcTemplateService } from '../../../../../common/services/lc-template.service';
import { ResolverService } from '../../../../../common/services/resolver.service';
import { SearchLayoutService } from '../../../../../common/services/search-layout.service';
import { CorporateCommonService } from '../../../../common/services/common.service';
import { ProductStateService } from '../../../lc/common/services/product-state.service';
import { SaveDraftService } from '../../../lc/common/services/save-draft.service';
import { CustomCommasInCurrenciesPipe } from '../../../lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { FilelistService } from '../../../lc/initiation/services/filelist.service';
import { FormControlService } from '../../../lc/initiation/services/form-control.service';
import { LcReturnService } from '../../../lc/initiation/services/lc-return.service';
import { PrevNextService } from '../../../lc/initiation/services/prev-next.service';
import { UtilityService } from '../../../lc/initiation/services/utility.service';
import { EcProductComponent } from '../ec-product/ec-product.component';
import { EcCollectingBankComponent } from './../ec-collecting-bank/ec-collecting-bank.component';
import { EcPresentingBankComponent } from './../ec-presenting-bank/ec-presenting-bank.component';
import { EcRemittingBankComponent } from './../ec-remitting-bank/ec-remitting-bank.component';
import { CurrencyConverterPipe } from '../../../lc/initiation/pipes/currency-converter.pipe';
import { EcProductService } from '../../services/ec-product.service';
import { EcBankService } from '../../../../../common/services/ec-bank.service';
import { HOST_COMPONENT } from './../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';


@Component({
  selector: 'ec-trade-bank-details',
  templateUrl: './ec-bank-details.component.html',
  styleUrls: ['./ec-bank-details.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: EcBankDetailsComponent }]
})
export class EcBankDetailsComponent extends EcProductComponent implements OnInit, AfterViewInit, OnDestroy {
  form: FCCFormGroup;
  readonly rendered = 'rendered';
  @Output() notify = new EventEmitter<any>();
  @ViewChild('tabs') public tabs: MatTabGroup;
  @ViewChild(EcRemittingBankComponent, { read: EcRemittingBankComponent }) public ecRemittingBankComponent: EcRemittingBankComponent;
  @ViewChild(EcPresentingBankComponent, { read: EcPresentingBankComponent }) public ecPresentingBankComponent: EcPresentingBankComponent;
  @ViewChild(EcCollectingBankComponent, { read: EcCollectingBankComponent }) public ecCollectingBankComponent: EcCollectingBankComponent;
  mode;
  module = `${this.translateService.instant('ecbankDetails')}`;
  collectionTypeOptions: any;
  option: any;

  constructor(protected translateService: TranslateService, protected commonService: CommonService,
              protected lcReturnService: LcReturnService, protected router: Router,
              protected utilityService: UtilityService, protected corporateCommonService: CorporateCommonService,
              protected fccGlobalConstantService: FccGlobalConstantService,
              protected prevNextService: PrevNextService, protected saveDraftService: SaveDraftService,
              protected lcTemplateService: LcTemplateService, protected formModelService: FormModelService,
              protected formControlService: FormControlService, protected searchLayoutService: SearchLayoutService,
              protected stateService: ProductStateService, protected emitterService: EventEmitterService,
              protected viewContainerRef: ViewContainerRef, protected elementRef: ElementRef,
              protected cdRef: ChangeDetectorRef, protected resolver: ComponentFactoryResolver,
              protected confirmationService: ConfirmationService, protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe,
              protected resolverService: ResolverService, protected fileList: FilelistService,
              protected dialogRef: DynamicDialogRef, protected amendCommonService: AmendCommonService,
              protected currencyConverterPipe: CurrencyConverterPipe, protected ecProductService: EcProductService,
              protected ecBankService: EcBankService
  ) {
    super(emitterService, stateService, commonService, translateService, confirmationService, customCommasInCurrenciesPipe,
      searchLayoutService, utilityService, resolverService, fileList, dialogRef, currencyConverterPipe, ecProductService);
  }


  ngOnInit() {
    window.scroll(0, 0);
    this.tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    this.collectionTypeOptions = this.stateService.getSectionData(FccGlobalConstant.EC_GENERAL_DETAILS).get('collectionTypeOptions').value;
    this.form = this.stateService.getSectionData(FccGlobalConstant.EC_BANK_DETAILS);
    this.option = this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPTION);
    if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND) {
      this.amendFormFields();
    }
  }

  ngAfterViewInit() {
    // this.ecBankService.afterViewMethod(this.option, this.collectionTypeOptions, this.elementRef, this.tnxTypeCode);
  }

  handlecontrolComponentsData(event: any){
    if (event.has('bankDetailsTab') && event.get('bankDetailsTab').has('querySelectorAllValue')) {
      this.ecBankService.afterViewMethod(this.option, this.collectionTypeOptions, event, this.tnxTypeCode);
     }
  }

  handleOnChange() {
    if (this.ecRemittingBankComponent) {
      this.ecRemittingBankComponent.ngOnDestroy();
    }
    if (this.ecPresentingBankComponent) {
      this.ecPresentingBankComponent.ngOnDestroy();
    }
    if (this.ecCollectingBankComponent) {
      this.ecCollectingBankComponent.ngOnDestroy();
    }
  }

  amendFormFields() {
    this.ecBankService.amendFormFields();
  }

  ngOnDestroy(): void {
    this.stateService.setStateSection(FccGlobalConstant.EC_BANK_DETAILS, this.form);
  }

}
