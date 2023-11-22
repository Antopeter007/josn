import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FccGlobalConstant } from './../../../../common/core/fcc-global-constants';
import { CommonService } from './../../../../common/services/common.service';
import { FCCBase } from './../../../../base/model/fcc-base';
import { FCCFormGroup } from './../../../../base/model/fcc-control.model';
import { FormModelService } from './../../../../common/services/form-model.service';
import { FormControlService } from './../../../../corporate/trade/lc/initiation/services/form-control.service';
import { HOST_COMPONENT } from './../../../../shared/FCCform/form/form-resolver/form-resolver.directive';
import { ListDefService } from './../../../../common/services/listdef.service';

@Component({
  selector: 'app-bill-details',
  templateUrl: './bill-details.component.html',
  styleUrls: ['./bill-details.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: BillDetailsComponent }]
})
export class BillDetailsComponent extends FCCBase implements OnInit {

  constructor(protected formControlService: FormControlService, protected translateService: TranslateService,
              protected formModelService: FormModelService, protected commonService: CommonService,
              protected activatedRoute: ActivatedRoute, protected router: Router, protected listService: ListDefService) {
      super();
  }

  form: FCCFormGroup;
  module = ``;
  language = localStorage.getItem('language');
  billID: any;
  billType: any;

  ngOnInit(): void {
    const billId = 'billId';
    const billType = 'billType';
    this.activatedRoute.queryParams.subscribe(params => {
      this.billID = params[billId];
      this.billType = params[billType];
    });
    this.translateService.get('corporatechannels').subscribe(() => {
      this.initializeFormGroup();
    });
  }

  initializeFormGroup() {
    this.formModelService.getSubSectionModelAPI().subscribe(model => {
      const dialogmodel = model[FccGlobalConstant.BILL_DETAILS_MODEL];
      this.form = this.formControlService.getFormControls(dialogmodel);
      const paginatorParams = {};
      const filterValues = {};
      const billId = 'bill_id';
      filterValues[billId] = this.billID;

      const billType = 'bill_type';
      filterValues[billType] = this.billType;

      const filterParams = JSON.stringify(filterValues);
      this.listService.getTableData(
      'loan/listdef/customer/LN/inquiryLNBillDetails', filterParams , JSON.stringify(paginatorParams))
      .subscribe(result => {
        const billData = result.rowDetails[0].index.filter(obj => obj.name === 'details')
        .map(item => ({ details: item.value }));
        const details = billData[0].details
        .replaceAll('&#xa;', '<br/>')
        .replaceAll(' ', '&nbsp;');
        const newData = `<pre>${details}</pre>`;
        this.setBillDetails(newData);

      });
      this.form.updateValueAndValidity();
    });
  }

  setBillDetails(billData) {
    this.patchFieldValueAndParameters(this.form.get('billID'), this.billID, {});
    this.patchFieldParameters(this.form.get('billContent'), { label: billData });
    this.form.get('billContent')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
    this.auditCall();
  }
  auditCall() {
    const requestPayload = {
      productCode: this.activatedRoute.snapshot.queryParams[FccGlobalConstant.PRODUCT],
      subProductCode: this.activatedRoute.snapshot.queryParams[FccGlobalConstant.SUB_PRODUCT_CODE],
      operation: this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPERATION),
      option: 'BL',
      action: this.commonService.getQueryParametersFromKey(FccGlobalConstant.ACTION),
      tnxtype: this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE),
      mode: this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE),
      subTnxType: this.commonService.getQueryParametersFromKey(FccGlobalConstant.SUB_TRANSACTION_TYPE_CODE),
      listDefName:  'loan/listdef/customer/LN/inquiryLNBillDetails'
    };
    this.commonService.audit(requestPayload).subscribe(() => {
      //eslint : no-empty-function
    });
  }

}
