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
  selector: 'app-set-reference',
  templateUrl: './set-reference.component.html',
  styleUrls: ['./set-reference.component.scss']
})
export class SetReferenceComponent implements OnInit {

  setReferenceForm: UntypedFormGroup;
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
  entity: any;
  toastPosition: string;
  fields = [];
  @Output() closeSetReferenceOverlay: EventEmitter<any> = new EventEmitter<any>();
  hasError = false;
  errorMsg: string;
  subscription: Subscription;
  componentData: any;
  model: any;
  menuToggleFlag: string;
  custRefLength;
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
    let fieldValue = this.translate.instant(FccGlobalConstant.REFERENCE_TEXT);
    fieldValue = (fieldValue !== undefined && fieldValue !== null && fieldValue !== '') ?
    fieldValue : FccGlobalConstant.REFERENCE_TEXT;
    this.errorMsg = this.translate.instant(FccGlobalConstant.REQUIRED, { field: fieldValue });
    this.componentData = this.commonService.getComponentRowData();
    this.productCode = this.translate.instant(this.componentData.product_code);
    this.setReferenceForm = this.formBuilder.group({
      reference: ['']
    });
    this.initializeFormGroup();
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.custRefLength = response.customerReferenceTradeLength;
      }
    });
  }

  onCloseMatDrawer(event) {
    this.closeSetReferenceOverlay.emit(event);
  }

  initializeFormGroup() {
    const params: ProductParams = {
      type: FccGlobalConstant.MODEL_SET_REFERENCE
    };
    this.commonService.getProductModel(params).subscribe(
      response => {
        this.model = JSON.parse(JSON.stringify(response));
        this.updateFieldValues();
        const target = document.getElementById('referenceHeader');
        target.setAttribute('tabindex', '-1');
        target.focus();
        target.setAttribute('tabindex', '0');
      });
  }

  updateFieldValues() {
    this.transactionDetailService.fetchTransactionDetails(this.componentData.ref_id).subscribe(responseData => {
      this.responseObj = responseData.body;
      this.productCode = this.responseObj.product_code;
      this.subProductCode = this.responseObj.sub_product_code;
      this.refId = this.responseObj.ref_id;
      this.entity = this.responseObj.entity;
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

  onSubmit() {
      const reference = this.setReferenceForm.value.reference;
      if (reference != null && reference !== '' && this.refId != null && this.refId !== '') {
          if (this.productCode === 'PO' || this.productCode === 'SO' || this.productCode === 'LS') {
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
                  detail: `${this.translate.instant('setRefToastMsg')}` + `${reference}`
                };
                this.messageService.add(tosterObj);
                this.commonService.setReferenceSuccedded();
              },
              () => {
                //eslint : no-empty-function
              });
          } else {
            const requestPayload = this.buildRequestObject();
            const reauthData: any = {
            action: FccGlobalConstant.MODEL_SET_REFERENCE,
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
    const refId = 'ref_id';
    const tnxObj = {};
    tnxObj[refId] = this.refId;
    tnxObj[FccGlobalConstant.CUSTOMER_REF] = this.setReferenceForm.value.reference;
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
  onBlurReference() {
    const reference = this.setReferenceForm.value.reference;
    if (reference === undefined || reference === null || reference === '') {
      this.hasError = true;
    } else {
      this.hasError = false;
    }
  }

  onChangeReference(value) {
    if (value === undefined || value === null || value === '') {
      this.hasError = true;
    } else {
      this.hasError = false;
    }
  }

  onClickReference() {
    this.hasError = false;
  }

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event:
    KeyboardEvent) {
      this.onCloseMatDrawer(event);
   }

}
