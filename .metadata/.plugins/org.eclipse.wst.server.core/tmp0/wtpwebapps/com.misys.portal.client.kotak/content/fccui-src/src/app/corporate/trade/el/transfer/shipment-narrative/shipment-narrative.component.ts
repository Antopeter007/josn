import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, DynamicDialogRef } from 'primeng';
import { HOST_COMPONENT } from './../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';

import { ResolverService } from '../../../../../common/services/resolver.service';
import { SearchLayoutService } from '../../../../../common/services/search-layout.service';
import {
  transferShipmentDateGreaterThanELExpiryDate,
  transferShipmentDateGreaterThanELShipmentDate,
  transferShipmentDateLessThanCurrentDate,
} from '../../../../trade/lc/initiation/validator/ValidateDates';
import { ProductStateService } from '../../../lc/common/services/product-state.service';
import { CurrencyConverterPipe } from '../../../lc/initiation/pipes/currency-converter.pipe';
import { CustomCommasInCurrenciesPipe } from '../../../lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { FilelistService } from '../../../lc/initiation/services/filelist.service';
import { FormControlService } from '../../../lc/initiation/services/form-control.service';
import { UtilityService } from '../../../lc/initiation/services/utility.service';
import { ElProductComponent } from '../../el-product/el-product.component';
import { ElProductService } from '../../services/el-product.service';
import { FCCFormGroup } from './../../../.../../../../base/model/fcc-control.model';
import { FccGlobalConstant } from './../../../../../common/core/fcc-global-constants';
import { CommonService } from './../../../../../common/services/common.service';
import { EventEmitterService } from './../../../../../common/services/event-emitter-service';
import { FormModelService } from './../../../../../common/services/form-model.service';
import { PhrasesService } from './../../../../../common/services/phrases.service';
import { Validators } from '@angular/forms';
import { FccBusinessConstantsService } from './../../../../../common/core/fcc-business-constants.service';

@Component({
  selector: 'app-shipment-narrative',
  templateUrl: './shipment-narrative.component.html',
  styleUrls: ['./shipment-narrative.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: ShipmentNarrativeComponent }]
})
export class ShipmentNarrativeComponent extends ElProductComponent implements OnInit {
  productCode;
  form: FCCFormGroup;
  elShipmentDate;
  swiftXCharRegex: string;
  swiftZCharRegex: string;
  transferExpiryDate;
  transferShipmentDateField = 'transferShipmentDate';
  lastShipmentDate;
  params = 'params';
  enteredCharCount = 'enteredCharCount';
  module = `${this.translateService.instant('shipmentAndNarrative')}`;
  modeOfTransmission: any;

  constructor(
    protected formModelService: FormModelService,
    protected formControlService: FormControlService,
    protected translateService: TranslateService,
    protected commonService: CommonService,
    protected emitterService: EventEmitterService,
    protected stateService: ProductStateService,
    protected phrasesService: PhrasesService,
    protected confirmationService: ConfirmationService,
    protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe,
    protected searchLayoutService: SearchLayoutService,
    protected utilityService: UtilityService,
    protected resolverService: ResolverService,
    protected fileList: FilelistService,
    protected dialogRef: DynamicDialogRef,
    protected currencyConverterPipe: CurrencyConverterPipe, protected elProductService: ElProductService
    ) {
      super(emitterService, stateService, commonService, translateService, confirmationService,
            customCommasInCurrenciesPipe, searchLayoutService, utilityService, resolverService, fileList,
            dialogRef, currencyConverterPipe, elProductService);
      }

  ngOnInit(): void {
  this.productCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.PRODUCT);
  this.initializeFormGroup();
  this.lastShipmentDate = this.stateService.getValueObject('shipmentNarrativeDetails', 'transferShipmentDate', false);
  this.onClickTransferShipmentDate();
  this.updateNarrativeCount();
  this.modeOfTransmission = this.stateService.getSectionData(FccGlobalConstant.TRANSFER_DETAILS).get('transmissionMode').value;
  this.commonService.loadDefaultConfiguration().subscribe(response => {
    if (response) {
      this.swiftXCharRegex = response.swiftXCharacterSet;
      this.swiftZCharRegex = response.swiftZChar;
      if (this.modeOfTransmission === FccBusinessConstantsService.SWIFT) {
        this.form.addFCCValidators('transferDetailsNarrative', Validators.pattern(this.swiftZCharRegex), 0);
        this.form.addFCCValidators('transferNamedPlace', Validators.pattern(this.swiftXCharRegex), 0);
        this.form.get('transferDetailsNarrative').updateValueAndValidity();
        this.form.get('transferNamedPlace').updateValueAndValidity();
      }
    }
  });
  }

  updateNarrativeCount() {
    if (this.form.get('transferDetailsNarrative').value) {
      const count = this.commonService.counterOfPopulatedData(this.form.get('transferDetailsNarrative').value);
      this.form.get('transferDetailsNarrative')[this.params][this.enteredCharCount] = count;
    }
  }

  initializeFormGroup() {
    const sectionName = 'shipmentNarrativeDetails';
    this.form = this.stateService.getSectionData(sectionName);
}

onClickTransferShipmentDate() {
  const transferShipmentDate = this.form.get(this.transferShipmentDateField).value;
  if (transferShipmentDate !== null && transferShipmentDate !== '') {
  this.validateShipmentDate(transferShipmentDate);
  this.validateShipmentDateOnLoad();
} else {
  this.form.get(this.transferShipmentDateField).clearValidators();
  this.form.get(this.transferShipmentDateField).updateValueAndValidity();
}
}

validateShipmentDateOnLoad() {
  if (this.form.get(this.transferShipmentDateField).hasError('transferShipmentDateLessThanCurrentDate')) {
    this.form.get(this.transferShipmentDateField).setErrors({ transferShipmentDateLessThanCurrentDate: true });
    this.form.get(this.transferShipmentDateField).markAsTouched({ onlySelf: true });
    this.form.get(this.transferShipmentDateField).markAsDirty();
    this.form.get(this.transferShipmentDateField).updateValueAndValidity();
  } else if (this.form.get(this.transferShipmentDateField).hasError('transferShipmentDateGreaterThanELExpiryDate')) {
    this.form.get(this.transferShipmentDateField).setErrors({ transferShipmentDateGreaterThanELExpiryDate: true });
    this.form.get(this.transferShipmentDateField).markAsTouched({ onlySelf: true });
    this.form.get(this.transferShipmentDateField).markAsDirty();
    this.form.get(this.transferShipmentDateField).updateValueAndValidity();
  } else if (this.form.get(this.transferShipmentDateField).hasError('transferShipmentDateGreaterThanELShipmentDate')) {
    this.form.get(this.transferShipmentDateField).setErrors({ transferShipmentDateGreaterThanELShipmentDate: true });
    this.form.get(this.transferShipmentDateField).markAsTouched({ onlySelf: true });
    this.form.get(this.transferShipmentDateField).markAsDirty();
    this.form.get(this.transferShipmentDateField).updateValueAndValidity();
  }
}

validateShipmentDate(transferShipmentDate: any) {
  const currentDate = new Date();
  this.elShipmentDate = this.lastShipmentDate;
  this.transferExpiryDate = this.stateService.getValueObject(FccGlobalConstant.TRANSFER_DETAILS, 'transferExpiryDate', false);
  transferShipmentDate = `${transferShipmentDate.getDate()}/${(transferShipmentDate.getMonth() + 1)}/${transferShipmentDate.getFullYear()}`;
  transferShipmentDate = (transferShipmentDate !== '' && transferShipmentDate !== null) ?
                                  this.commonService.convertToDateFormat(transferShipmentDate) : '';
  this.elShipmentDate = (this.elShipmentDate !== '' && this.elShipmentDate !== null) ?
        `${this.elShipmentDate.getDate()}/${(this.elShipmentDate.getMonth() + 1)}/${this.elShipmentDate.getFullYear()}` : '';
  this.elShipmentDate = (this.elShipmentDate !== '') ?
                                  this.commonService.convertToDateFormat(this.elShipmentDate) : '';
  this.form.get(this.transferShipmentDateField).clearValidators();
  if (transferShipmentDate !== '' && this.elShipmentDate !== '' && (transferShipmentDate > this.elShipmentDate)) {
    this.form.get(this.transferShipmentDateField).setValidators([transferShipmentDateGreaterThanELShipmentDate]);
    this.form.get(this.transferShipmentDateField).updateValueAndValidity();
  } else if (transferShipmentDate !== '' && this.transferExpiryDate !== '' && (transferShipmentDate > this.transferExpiryDate) ) {
    this.form.get(this.transferShipmentDateField).setValidators([transferShipmentDateGreaterThanELExpiryDate]);
    this.form.get(this.transferShipmentDateField).updateValueAndValidity();
  } else if (transferShipmentDate !== '' && (transferShipmentDate.setHours(0, 0, 0, 0) < currentDate.setHours(0, 0, 0, 0) )) {
    this.form.get(this.transferShipmentDateField).setValidators([transferShipmentDateLessThanCurrentDate]);
    this.form.get(this.transferShipmentDateField).updateValueAndValidity();
  }
}

onClickPhraseIcon(event, key) {
    this.phrasesService.getPhrasesDetails(this.form, FccGlobalConstant.PRODUCT_EL, key, '', true);
}

}
