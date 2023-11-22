import { AfterViewInit, Component, ElementRef, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, DynamicDialogRef } from 'primeng';
import { CurrencyConverterPipe } from './../../../../lc/initiation/pipes/currency-converter.pipe';

import { FccGlobalConstant } from '../../../../../../common/core/fcc-global-constants';
import { CommonService } from '../../../../../../common/services/common.service';
import { EventEmitterService } from '../../../../../../common/services/event-emitter-service';
import { ResolverService } from '../../../../../../common/services/resolver.service';
import { SearchLayoutService } from '../../../../../../common/services/search-layout.service';
import { CustomCommasInCurrenciesPipe } from '../../../../lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { FilelistService } from '../../../../lc/initiation/services/filelist.service';
import { UtilityService } from '../../../../lc/initiation/services/utility.service';
import { SiProductComponent } from '../si-product/si-product.component';
import { FCCFormGroup } from './../../../../../../base/model/fcc-control.model';
import { ProductStateService } from './../../../../../../corporate/trade/lc/common/services/product-state.service';
import { FormControlService } from './../../../../../../corporate/trade/lc/initiation/services/form-control.service';
import { NarrativeService } from './../../../../../../corporate/trade/lc/initiation/services/narrative.service';
import { SiProductService } from '../../../services/si-product.service';
import { HOST_COMPONENT } from './../../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';

@Component({
  selector: 'app-si-goods-and-documents',
  templateUrl: './si-goods-and-documents.component.html',
  styleUrls: ['./si-goods-and-documents.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: SiGoodsAndDocumentsComponent }]
})
export class SiGoodsAndDocumentsComponent extends SiProductComponent implements OnInit, AfterViewInit {

  form: FCCFormGroup;
  @Input() parentForm: FCCFormGroup;
  @Input() data;
  @Input() controlName;
  module = '';
  params;
  descOfGoodsMandatory: boolean;
  docRequiredMandatory: boolean;
  tnxTypeCode: any;
  option;
  requestLCType: any;
  constructor(protected emitterService: EventEmitterService, protected stateService: ProductStateService,
              protected formControlService: FormControlService, protected narrativeService: NarrativeService,
              protected elementRef: ElementRef, protected commonService: CommonService,
              protected translateService: TranslateService, protected confirmationService: ConfirmationService,
              protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe, protected searchLayoutService: SearchLayoutService,
              protected utilityService: UtilityService, protected resolverService: ResolverService,
              protected fileArray: FilelistService, protected dialogRef: DynamicDialogRef,
              protected currencyConverterPipe: CurrencyConverterPipe, protected siProductService: SiProductService
    ) {
    super(emitterService, stateService, commonService, translateService, confirmationService,
      customCommasInCurrenciesPipe, searchLayoutService, utilityService, resolverService, fileArray,
      dialogRef, currencyConverterPipe, siProductService);
   }

  ngOnInit(): void {
    this.requestLCType = this.stateService.getSectionData(FccGlobalConstant.SI_GENERAL_DETAILS).get('requestOptionsLC').value;
    this.tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    this.option = this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPTION);
    const obj = this.parentForm.controls[this.controlName];
    if (obj !== null) {
        this.form = obj as FCCFormGroup;
    }
    if (this.requestLCType === FccGlobalConstant.REQUEST_OPTION_LC_FREE_FORMAT && this.tnxTypeCode !== FccGlobalConstant.N002_AMEND) {
      this.form.get('siDescOfGoods').get('descOfGoodsText').clearValidators();
      this.form.get('siDescOfGoods').get('descOfGoodsText').updateValueAndValidity();
      this.form.get('siDocRequired').get('docRequiredText').clearValidators();
      this.form.get('siDocRequired').get('docRequiredText').updateValueAndValidity();
    }
  }

  ngAfterViewInit() {
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.descOfGoodsMandatory = response.descOfGoodsMandatory;
        this.docRequiredMandatory = response.docReqMandatory;
      }
    });
  }

  handleControlComponentsData(event: any) {
    // eslint-disable-next-line no-console
    console.log(event);
    if (this.descOfGoodsMandatory && this.tnxTypeCode !== FccGlobalConstant.N002_AMEND && this.option === FccGlobalConstant.TEMPLATE
        && event.get('goodsAndDocs') && event.get('goodsAndDocs').get('querySelectorAllValue')
        && event.get('goodsAndDocs').get('querySelectorAllValue').length > 0
        && event.get('goodsAndDocs').get('querySelectorAllValue')[0]) {
      event.get('goodsAndDocs').get('querySelectorAllValue')[0].innerText =
      this.translateService.instant('descOfGoodsText');
    }
    if (this.docRequiredMandatory && this.tnxTypeCode !== FccGlobalConstant.N002_AMEND && this.option === FccGlobalConstant.TEMPLATE
        && event.get('goodsAndDocs') && event.get('goodsAndDocs').get('querySelectorAllValue')
        && event.get('goodsAndDocs').get('querySelectorAllValue').length > 0
        && event.get('goodsAndDocs').get('querySelectorAllValue')[1]) {
      event.get('goodsAndDocs').get('querySelectorAllValue')[1].innerText =
      this.translateService.instant('docRequiredText');
    }
  }
 }
