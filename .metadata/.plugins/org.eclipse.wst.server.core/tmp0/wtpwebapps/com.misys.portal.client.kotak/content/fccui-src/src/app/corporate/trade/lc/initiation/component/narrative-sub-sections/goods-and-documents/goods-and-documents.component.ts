import { AfterViewInit, Component, ElementRef, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, DynamicDialogRef } from 'primeng';
import { LcProductService } from '../../../../services/lc-product.service';
import { ResolverService } from '../../../../../../../common/services/resolver.service';
import { SearchLayoutService } from '../../../../../../../common/services/search-layout.service';
import { CurrencyConverterPipe } from '../../../pipes/currency-converter.pipe';
import { CustomCommasInCurrenciesPipe } from '../../../pipes/custom-commas-in-currencies.pipe';
import { FilelistService } from '../../../services/filelist.service';
import { UtilityService } from '../../../services/utility.service';
import { LcProductComponent } from '../../lc-product/lc-product.component';
import { FCCFormGroup } from './../../../../../../../base/model/fcc-control.model';
import { FccGlobalConstant } from './../../../../../../../common/core/fcc-global-constants';
import { CommonService } from './../../../../../../../common/services/common.service';
import { EventEmitterService } from './../../../../../../../common/services/event-emitter-service';
import { ProductStateService } from './../../../../common/services/product-state.service';
import { FormControlService } from './../../../services/form-control.service';
import { NarrativeService } from './../../../services/narrative.service';
import { HOST_COMPONENT } from './../../../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';

@Component({
  selector: 'app-goods-and-documents',
  templateUrl: './goods-and-documents.component.html',
  styleUrls: ['./goods-and-documents.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: GoodsAndDocumentsComponent }]
})
export class GoodsAndDocumentsComponent extends LcProductComponent implements OnInit, AfterViewInit {
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
  constructor(protected emitterService: EventEmitterService, protected stateService: ProductStateService,
              protected formControlService: FormControlService, protected narrativeService: NarrativeService,
              protected elementRef: ElementRef, protected commonService: CommonService,
              protected translateService: TranslateService, protected confirmationService: ConfirmationService,
              protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe, protected searchLayoutService: SearchLayoutService,
              protected utilityService: UtilityService, protected resolverService: ResolverService,
              protected fileList: FilelistService, protected dialogRef: DynamicDialogRef,
              protected currencyConverterPipe: CurrencyConverterPipe, protected lcProductService: LcProductService
    ) {
    super(emitterService, stateService, commonService, translateService, confirmationService, customCommasInCurrenciesPipe,
          searchLayoutService, utilityService, resolverService, fileList, dialogRef, currencyConverterPipe, lcProductService);
   }

  ngOnInit(): void {
    this.tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    this.option = this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPTION);
    const obj = this.parentForm.controls[this.controlName];
    if (obj !== null) {
        this.form = obj as FCCFormGroup;
    }
  }
  handlecontrolComponentsData(event: any){
    if ( event.has('goodsAndDocs') && event.get('goodsAndDocs').has('querySelectorAllValue'))
    {
      if (this.descOfGoodsMandatory && this.tnxTypeCode !== FccGlobalConstant.N002_AMEND && this.option === FccGlobalConstant.TEMPLATE) {
        event.get('goodsAndDocs').get('querySelectorAllValue')[0].innerText =
        this.translateService.instant('descOfGoodsText');
      }
      if (this.docRequiredMandatory && this.tnxTypeCode !== FccGlobalConstant.N002_AMEND && this.option === FccGlobalConstant.TEMPLATE) {
        event.get('goodsAndDocs').get('querySelectorAllValue')[1].innerText =
        this.translateService.instant('docRequiredText');
      }
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

 }
