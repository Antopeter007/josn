import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng';
import { Subscription } from 'rxjs/internal/Subscription';
import { FCCFormGroup } from '../../../base/model/fcc-control.model';
import { FccGlobalConstant } from '../../core/fcc-global-constants';
import { ProductParams } from '../../model/params-model';
import { CommonService } from '../../services/common.service';
import { DropDownAPIService } from '../../services/dropdownAPI.service';
import { MultiBankService } from '../../services/multi-bank.service';
import { ReauthService } from '../../services/reauth.service';
import { TransactionDetailService } from '../../services/transactionDetail.service';

@Component({
  selector: 'app-set-entity',
  templateUrl: './set-entity.component.html',
  styleUrls: ['./set-entity.component.scss']
})

export class SetEntityComponent implements OnInit {

  setEntityForm: UntypedFormGroup;
  productCode: string;
  dir: string = localStorage.getItem('langDir');
  form: FCCFormGroup;
  responseObj: any;
  entities = [];
  options = [];
  flag = false;
  subSectionModels: any;
  subProductCode: string;
  refId: any;
  currentEntity: any;
  toastPosition: string;
  fields = [];
  @Output() closeSetEntityOverlay: EventEmitter<any> = new EventEmitter<any>();
  hasError = false;
  errorMsg: string;
  subscription: Subscription;
  componentData: any;
  model: any;
  menuToggleFlag: string;
  errorHeader = `${this.translate.instant('errorTitle')}`;

  constructor(
    protected formBuilder: UntypedFormBuilder,
    protected translate: TranslateService,
    protected commonService: CommonService,
    protected transactionDetailService: TransactionDetailService,
    protected multiBankService: MultiBankService,
    protected dropdownAPIService: DropDownAPIService,
    protected messageService: MessageService,
    protected reauthService: ReauthService
  ) { }

  ngOnInit(): void {
    this.commonService.getMenuValue().subscribe((value) => {
      this.menuToggleFlag = value;
    });
    this.toastPosition = this.dir === 'rtl' ? 'top-left' : 'top-right';
    let fieldValue = this.translate.instant(FccGlobalConstant.ENTITY_TEXT);
    fieldValue = (fieldValue !== undefined && fieldValue !== null && fieldValue !== '') ?
    fieldValue : FccGlobalConstant.ENTITY_TEXT;
    this.errorMsg = this.translate.instant(FccGlobalConstant.REQUIRED, { field: fieldValue });
    this.componentData = this.commonService.getComponentRowData();
    this.productCode = this.translate.instant(this.componentData.product_code);
    this.setEntityForm = this.formBuilder.group({
      entityDropdown: ['']
    });
    this.initializeFormGroup();
  }

  onCloseMatDrawer(event) {
    this.closeSetEntityOverlay.emit(event);
  }

  initializeFormGroup() {
    const params: ProductParams = {
      type: FccGlobalConstant.MODEL_SET_ENTITY
    };
    this.commonService.getProductModel(params).subscribe(
      response => {
        this.model = JSON.parse(JSON.stringify(response));
        this.updateFieldValues();
        const target = document.getElementById('entityHeader');
        target.setAttribute('tabindex', '-1');
        target.focus();
        target.setAttribute('tabindex', '0');
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
    this.options = this.entities;
    this.multiBankService.clearAllData();
  }

  updateFieldValues() {
    this.transactionDetailService.fetchTransactionDetails(this.componentData.ref_id).subscribe(responseData => {
      this.responseObj = responseData.body;
      this.productCode = this.responseObj.product_code;
      this.subProductCode = this.responseObj.sub_product_code;
      this.refId = this.responseObj.ref_id;
      this.currentEntity = this.responseObj.entity;
      this.multiBankAPI();
      const fields = Object.keys(this.model);
      fields.forEach(element => {
        const fieldLabel = `${this.translate.instant(element)}`;
        const data = this.model[element];
        let fieldValue = '';
        if (data.translate === true) {
          fieldValue = `${this.translate.instant(data.translateValue + this.responseObj[data.apiKey])}`;
        } else {
          fieldValue = this.responseObj[data.apiKey];
        }
        const field = {
          label: fieldLabel,
          value: fieldValue
        };
        if (data[FccGlobalConstant.NOT_APPLICABLE_PRODUCTS]) {
          if ( !data[FccGlobalConstant.NOT_APPLICABLE_PRODUCTS].includes(this.productCode)) {
            this.fields.push(field);
          }
        }else {
          this.fields.push(field);
        }
      });
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

  onSubmit() {
    const entity = this.setEntityForm.value.entityDropdown.shortName;
    if (entity != null && entity !== '' && this.refId != null && this.refId !== '') {
      if (this.productCode === 'PO' || this.productCode === 'SO' || this.productCode === 'LS') {
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
              detail: `${this.translate.instant('setEntityToastMsg')}` + `${entity}`
            };
            this.messageService.add(tosterObj);
            this.commonService.setEntitySuccedded();
          },
          () => {
            //eslint : no-empty-function
        });
      } else {
        const requestPayload = this.buildRequestObject();
        const reauthData: any = {
        action: FccGlobalConstant.MODEL_SET_ENTITY,
        request: requestPayload
        };
        this.reauthService.reauthenticate(reauthData, FccGlobalConstant.reAuthComponentKey);
      }
    } else {
      this.hasError = true;
    }
 }

  buildRequestObject() {
    const requestObj = {};
    const common = 'common';
    const transaction = 'transaction';
    const tnxObj = {};
    const refId = 'ref_id';
    tnxObj[refId] = this.refId;
    tnxObj[FccGlobalConstant.ENTITY_SHORT_NAME] = this.setEntityForm.value.entityDropdown.shortName;
    const commonRequestObj = {};
    commonRequestObj[FccGlobalConstant.OPERATION] = 'SUBMIT';
    commonRequestObj[FccGlobalConstant.SCREEN] = '';
    commonRequestObj[FccGlobalConstant.MODE] = '';
    commonRequestObj[FccGlobalConstant.MODULE_NAME] = '';
    commonRequestObj[FccGlobalConstant.OPTION] = '';
    commonRequestObj[FccGlobalConstant.TEMPLATEID] = '';
    commonRequestObj[FccGlobalConstant.TNXID] = '';
    commonRequestObj[FccGlobalConstant.TNXTYPE] = '';
    requestObj[common] = commonRequestObj;
    requestObj[transaction] = tnxObj;
    return requestObj;
  }

  onBlurEntityDropdown() {
    const entity = this.setEntityForm.value.entityDropdown.shortName;
    if (entity === undefined || entity === null || entity === '') {
      this.hasError = true;
    } else {
      this.hasError = false;
    }
  }

  onChangeDropdown(value) {
    if (value.shortName === undefined || value.shortName === null || value.shortName === '') {
      this.hasError = true;
    } else {
      this.hasError = false;
    }
  }

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event:
    KeyboardEvent) {
      this.onCloseMatDrawer(event);
   }

}
