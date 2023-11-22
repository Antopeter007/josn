import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng';
import { Subscription } from 'rxjs/internal/Subscription';
import { FCCBase } from '../../../base/model/fcc-base';
import { FCCFormGroup } from '../../../base/model/fcc-control.model';
import { FormControlService } from '../../../corporate/trade/lc/initiation/services/form-control.service';
import { FccGlobalConstant } from '../../core/fcc-global-constants';
import { ProductParams } from '../../model/params-model';
import { CommonService } from '../../services/common.service';
import { DropDownAPIService } from '../../services/dropdownAPI.service';
import { FormModelService } from '../../services/form-model.service';
import { MultiBankService } from '../../services/multi-bank.service';
import { TransactionDetailService } from '../../services/transactionDetail.service';

@Component({
  selector: 'app-set-entity-sidenav',
  templateUrl: './set-entity-sidenav.component.html',
  styleUrls: ['./set-entity-sidenav.component.scss'],
})
export class SetEntitySidenavComponent extends FCCBase implements OnInit {
  module = '';
  subscription: Subscription;
  entityRowData: any;
  dir: string = localStorage.getItem('langDir');
  form: FCCFormGroup;
  responseObj: any;
  entities = [];
  flag = false;
  subSectionModels: any;
  subProductCode: string;
  productCode: string;
  refId: any;
  currentEntity: any;
  toastPosition: string;
  constructor(
    protected commonService: CommonService,
    protected translateService: TranslateService,
    protected transactionDetailService: TransactionDetailService,
    protected multiBankService: MultiBankService,
    protected dropdownAPIService: DropDownAPIService,
    protected formModelService: FormModelService,
    protected formControlService: FormControlService,
    protected messageService: MessageService
    ) {
      super();
    }

    ngOnInit() {
      this.toastPosition = this.dir === 'rtl' ? 'top-left' : 'top-right';
      this.subscription = this.commonService.listenSetEntityClicked$.subscribe(
        rowdata => {
          this.entityRowData = rowdata;
          this.flag = true;
          this.initializeFormGroup();
      });
    }

    initializeFormGroup() {
      const entityModel = 'setEntityNavModel';
      const params: ProductParams = {
        type: FccGlobalConstant.MODEL_SUBSECTION
      };
      this.commonService.getProductModel(params).subscribe(
        response => {
          const dialogmodel = JSON.parse(JSON.stringify(response[entityModel]));
          this.form = this.formControlService.getFormControls(dialogmodel);
          this.patchFieldParameters(this.form.get('channelRefValue'), { label: '' });
          this.patchFieldParameters(this.form.get('statusVal'), { label: '' });
          this.patchFieldParameters(this.form.get('bankRefValue'), { label: '' });
          this.patchFieldParameters(this.form.get('currentEntityValue'), { label: '' });
          this.patchFieldParameters(this.form.get('addressValue'), { label: '' });
          this.updateFieldValues();
        });
    }

    getEntityList() {
      this.entities = [];
      this.multiBankService.getEntityList().forEach(entity => {
        if (this.entities.indexOf(entity) === -1) {
          this.entities.push(entity);
        }
      });
      this.entities.forEach((value, index) => {
        if (value.value.shortName === this.currentEntity) {
          this.entities.splice(index, 1);
        }
      });
      this.patchFieldParameters(this.form.get('entity'), { options: this.entities });
      this.multiBankService.clearAllData();
    }

    updateFieldValues() {
      this.transactionDetailService.fetchTransactionDetails(this.entityRowData.ref_id).subscribe(responseData => {
        this.responseObj = responseData.body;
        this.productCode = this.responseObj.product_code;
        this.subProductCode = this.responseObj.sub_product_code;
        this.refId = this.responseObj.ref_id;
        this.currentEntity = this.responseObj.entity;
        this.multiBankAPI();
        if (this.responseObj.cust_ref_id === undefined || this.responseObj.cust_ref_id === '' || this.responseObj.cust_ref_id === null) {
          this.patchFieldParameters(this.form.get('bankRefValue'), { layoutClass: 'p-col-12' });
        } else {
          this.patchFieldParameters(this.form.get('customerReference'), { rendered: true });
          this.patchFieldParameters(this.form.get('customerRefValue'), { rendered: true });
        }
        this.patchFieldParameters(this.form.get('channelRefValue'), { label: this.responseObj.ref_id });
        this.patchFieldParameters(this.form.get('statusVal'), { label: `${this.translateService
        .instant('N005_' + this.responseObj.prod_stat_code)}` });
        this.patchFieldParameters(this.form.get('customerRefValue'), { label: this.responseObj.cust_ref_id });
        this.patchFieldParameters(this.form.get('bankRefValue'), { label: this.responseObj.bo_ref_id });
        if (this.productCode === FccGlobalConstant.PRODUCT_EL || this.productCode === FccGlobalConstant.PRODUCT_SR ||
           this.productCode === FccGlobalConstant.PRODUCT_BG || this.productCode === FccGlobalConstant.PRODUCT_BR
        || this.productCode === FccGlobalConstant.PRODUCT_IR) {
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

    async multiBankAPI() {
      const subProductCode = this.subProductCode ? this.subProductCode : '';
      if (this.multiBankService.getEntityList().length !== 0) {
        this.getEntityList();
      }
      await this.multiBankService.getCustomerBankDetails(this.productCode, subProductCode).subscribe(
        res => {
          this.multiBankService.initializeProcess(res);
          this.getEntityList();
        },
        () => {
          this.multiBankService.clearAllData();
        }
      );
    }

    onClickSubmit() {
      const entity = this.form.get('entity').value.shortName;
      if (entity !== undefined && entity !== null && entity !== '' && this.refId !== undefined
        && this.refId !== null && this.refId !== '') {
        const requestPayload = {
          id: this.refId,
          entityShortName: entity
        };
        this.commonService.setEntity(requestPayload).subscribe(
          () => {
            const tosterObj = {
              life : 5000,
              key: 'tc',
              severity: 'success',
              summary: `${this.refId}`,
              detail: `${this.translateService.instant('setEntityToastMsg')}` + `${entity}`
            };
            this.messageService.add(tosterObj);
            this.commonService.setEntitySuccedded();
          },
          () => {
            //eslint : no-empty-function
          });
      } else {
        this.form.get('entity').setErrors({ required: true });
      }
    }
}
