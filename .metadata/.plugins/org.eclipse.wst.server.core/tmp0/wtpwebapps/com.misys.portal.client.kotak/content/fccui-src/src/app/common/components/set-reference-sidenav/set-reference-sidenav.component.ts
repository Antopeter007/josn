import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormControlService } from '../../../corporate/trade/lc/initiation/services/form-control.service';
import { FCCBase } from '../../../base/model/fcc-base';
import { CommonService } from '../../services/common.service';
import { FormModelService } from '../../services/form-model.service';
import { TransactionDetailService } from '../../services/transactionDetail.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { FCCFormGroup } from '../../../base/model/fcc-control.model';
import { ProductParams } from '../../model/params-model';
import { FccGlobalConstant } from '../../core/fcc-global-constants';
import { MessageService } from 'primeng';
import { HOST_COMPONENT } from './../../../shared/FCCform/form/form-resolver/form-resolver.directive';

@Component({
  selector: 'app-set-reference-sidenav',
  templateUrl: './set-reference-sidenav.component.html',
  styleUrls: ['./set-reference-sidenav.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: SetReferenceSidenavComponent }]

})
export class SetReferenceSidenavComponent extends FCCBase implements OnInit {
  module = '';
  subscription: Subscription;
  refRowData: any;
  dir: string = localStorage.getItem('langDir');
  form: FCCFormGroup;
  responseObj: any;
  flag = false;
  subProductCode: string;
  productCode: string;
  refId: any;
  toastPosition: string;
  constructor(
    protected commonService: CommonService,
    protected translateService: TranslateService,
    protected transactionDetailService: TransactionDetailService,
    protected formModelService: FormModelService,
    protected formControlService: FormControlService,
    protected messageService: MessageService
    ) {
      super();
    }

    ngOnInit() {
      this.toastPosition = this.dir === 'rtl' ? 'top-left' : 'top-right';
      this.subscription = this.commonService.listenSetReferenceClicked$.subscribe(
        rowdata => {
          this.refRowData = rowdata;
          this.flag = true;
          this.initializeFormGroup();
      });
    }

    initializeFormGroup() {
      const refModel = 'setReferenceNavModel';
      const params: ProductParams = {
        type: FccGlobalConstant.MODEL_SUBSECTION
      };
      this.commonService.getProductModel(params).subscribe(
        response => {
          const dialogmodel = JSON.parse(JSON.stringify(response[refModel]));
          this.form = this.formControlService.getFormControls(dialogmodel);
          this.patchFieldParameters(this.form.get('channelRefValue'), { label: '' });
          this.patchFieldParameters(this.form.get('statusVal'), { label: '' });
          this.patchFieldParameters(this.form.get('bankRefValue'), { label: '' });
          this.patchFieldParameters(this.form.get('currentEntityValue'), { label: '' });
          this.patchFieldParameters(this.form.get('addressValue'), { label: '' });
          this.updateFieldValues();
        });
    }

    updateFieldValues() {
      this.transactionDetailService.fetchTransactionDetails(this.refRowData.ref_id).subscribe(responseData => {
        this.responseObj = responseData.body;
        this.productCode = this.responseObj.product_code;
        this.subProductCode = this.responseObj.sub_product_code;
        this.refId = this.responseObj.ref_id;
        this.patchFieldParameters(this.form.get('channelRefValue'), { label: this.responseObj.ref_id });
        this.patchFieldParameters(this.form.get('statusVal'), { label: `${this.translateService
        .instant('N005_' + this.responseObj.prod_stat_code)}` });
        this.patchFieldParameters(this.form.get('bankRefValue'), { label: this.responseObj.bo_ref_id });
        if (this.productCode === FccGlobalConstant.PRODUCT_EL || this.productCode === FccGlobalConstant.PRODUCT_SR) {
          this.patchFieldParameters(this.form.get('currentEntityValue'), { label: `${this.responseObj.beneficiary_name
            + ' (' + this.responseObj.entity + ')'}` });
        } else if (this.productCode === FccGlobalConstant.PRODUCT_IC) {
          this.patchFieldParameters(this.form.get('currentEntityValue'), { label: `${this.responseObj.drawee_name
            + ' (' + this.responseObj.entity + ')'}` });
        } else {
          this.patchFieldParameters(this.form.get('currentEntityValue'), { label: `${this.responseObj.applicant_name
            + ' (' + this.responseObj.entity + ')'}` });
        }
        let addressVal = '';
        addressVal = addressVal.concat((this.responseObj.applicant_address_line_1 !== undefined &&
        this.responseObj.applicant_address_line_1 !== '') ? ',' + this.responseObj.applicant_address_line_1 : '');
        addressVal = addressVal.concat((this.responseObj.applicant_address_line_2 !== undefined &&
        this.responseObj.applicant_address_line_2 !== '') ? ',' + this.responseObj.applicant_address_line_2 : '');
        addressVal = addressVal.concat((this.responseObj.applicant_dom !== undefined && this.responseObj.applicant_dom !== '') ?
        ',' + this.responseObj.applicant_dom : '');
        addressVal = addressVal.concat((this.responseObj.applicant_country !== undefined && this.responseObj.applicant_country !== '') ?
        ',' + this.responseObj.applicant_country : '');
        if (addressVal.charAt(0) === ',') {
          addressVal = addressVal.split(',')[1];
        }
        this.patchFieldParameters(this.form.get('addressValue'), { label: addressVal });
      });
    }

    onClickSubmit() {
      const reference = this.form.get('reference').value;
      if (reference !== undefined && reference !== null && reference !== '' && this.refId !== undefined
        && this.refId !== null && this.refId !== '') {
        const requestPayload = {
          customerReference: reference
        };
        this.commonService.setReference(requestPayload, this.refId).subscribe(
          () => {
            const tosterObj = {
              life : 5000,
              key: 'tc',
              severity: 'success',
              summary: `${this.refId}`,
              detail: `${this.translateService.instant('setRefToastMsg')}` + `${reference}`
            };
            this.messageService.add(tosterObj);
            this.commonService.setReferenceSuccedded();
          },
          () => {
            //eslint : no-empty-function
          });
      } else {
        this.form.get('reference').setErrors({ required: true });
      }
    }
}
