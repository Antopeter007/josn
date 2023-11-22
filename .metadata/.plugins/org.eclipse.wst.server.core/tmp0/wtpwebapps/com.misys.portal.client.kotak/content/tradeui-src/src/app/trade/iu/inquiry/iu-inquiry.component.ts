import { CuAmountDetailsComponent } from './../initiation/components/cu-amount-details/cu-amount-details.component';
import { CuBeneficiaryDetailsComponent } from './../initiation/components/cu-beneficiary-details/cu-beneficiary-details.component';
import { IUCommonBeneficiaryDetailsComponent } from './../common/components/beneficiary-details-form/beneficiary-details-form.component';
import { UndertakingDetailsComponent } from './../initiation/components/undertaking-details/undertaking-details.component';
import { TransactionDetailsComponent } from './../../../bank/common/components/transaction-details/transaction-details.component';
import { CommonDataService } from './../../../common/services/common-data.service';
import { Constants } from '../../../common/constants';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { IUCommonDataService } from '../common/service/iuCommonData.service';
import { ChartComponent } from '../../../common/components/chart/chart.component';
import { CommonService } from '../../../common/services/common.service';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { CuGeneralDetailsComponent } from '../initiation/components/cu-general-details/cu-general-details.component';
import { CuUndertakingDetailsComponent } from '../initiation/components/cu-undertaking-details/cu-undertaking-details.component';

@Component({
  selector: 'fcc-iu-inquiry',
  templateUrl: './iu-inquiry.component.html',
  styleUrls: ['./iu-inquiry.component.scss']
})
export class IuInquiryComponent implements OnInit {

  bankInquiryIUForm: UntypedFormGroup;
  refId: string;
  public jsonContent;
  productCode: string = Constants.PRODUCT_CODE_IU;
  isBankUser: boolean;
  public luStatus = false;
  isActionRequired = true;
  actionCode: string;

  @ViewChild(ChartComponent)chartComponent: ChartComponent;
  @ViewChild(TransactionDetailsComponent)transactionDetailsComponent: TransactionDetailsComponent;
  @ViewChild(UndertakingDetailsComponent)undertakingDetailsComponent: UndertakingDetailsComponent;
  @ViewChild(IUCommonBeneficiaryDetailsComponent)iuCommonBeneficiaryDetailsComponent:
             IUCommonBeneficiaryDetailsComponent;
  @ViewChild(CuBeneficiaryDetailsComponent)cuBeneficiaryDetailsComponent: CuBeneficiaryDetailsComponent;
  @ViewChild(CuAmountDetailsComponent)cuAmountDetailsComponent: CuAmountDetailsComponent;

  constructor(protected readonly fb: UntypedFormBuilder, public commonService: CommonService, protected activatedRoute: ActivatedRoute,
              protected router: Router, public iuCommonDataService: IUCommonDataService, public translate: TranslateService,
              public commonDataService: CommonDataService) { }

  ngOnInit() {
    this.actionCode = window[`ACTION_CODE`];
    this.bankInquiryIUForm = new UntypedFormGroup({});
    this.activatedRoute.params.subscribe(paramsId => {
      this.refId = paramsId.refId;
      this.iuCommonDataService.setRefId(paramsId.refId);
     });
    this.commonService.getMasterDetails(this.refId, Constants.PRODUCT_CODE_IU, this.actionCode).subscribe(data => {
      this.jsonContent = data.masterDetails as string[];
      if (this.jsonContent.purpose !== null && this.jsonContent.purpose !== '' && this.jsonContent.purpose !== '01') {
        this.iuCommonDataService.setLUStatus(true);
        this.luStatus = true;
      }
      this.isActionRequired = (this.jsonContent.prodStatCode !== '98' && this.jsonContent.prodStatCode !== '78' &&
       this.jsonContent.prodStatCode !== '79');
     });
    this.commonDataService.setOperation(Constants.OPERATION_LIST_INQUIRY);
    this.isBankUser = this.commonDataService.getIsBankUser();
    if (this.isBankUser) {
      this.iuCommonDataService.setDisplayMode('view');
      this.commonDataService.setDisplayMode('view');
    }

    this.createMainForm();
  }

  createMainForm() {
    return this.bankInquiryIUForm = this.fb.group({});
  }

  checkForDataIfPresent() {
    const arr = [this.jsonContent.cuCurCode, this.jsonContent.cuAmt, this.jsonContent.cuRecipientBank.name,
    this.jsonContent.cuAvailableAmt, this.jsonContent.cuLiabAmt, this.jsonContent.cuRecipientBank.reference];
    return this.commonService.isFieldsValuesExists(arr) || this.checkForDataIfPresentForCUBene();
  }

  checkForDataIfPresentForCUBene() {
    const arr = [this.jsonContent.cuBeneficiary.name, this.jsonContent.cuBeneficiary.addressLine1,
    this.jsonContent.cuBeneficiary.addressLine2, this.jsonContent.cuBeneficiary.dom, this.jsonContent.cuBeneficiary.addressLine4];
    return this.commonService.isFieldsValuesExists(arr);
  }

  goToTnx(link: string) {
    const host = window.location.origin;
    let url = host + this.commonService.getBaseServletUrl();
    if (!this.isBankUser) {
      url += Constants.IU_LANDING_SCREEN;
    }
    if (link === 'initiate') {
      url = `${url}/?tnxtype=01&referenceid=${this.refId}&option=EXISTING`;
    } else if (link === 'amend') {
      url = `${url}/?tnxtype=03&referenceid=${this.refId}&option=EXISTING`;
    } else if (link === 'release') {
      url = `${url}/?tnxtype=03&subtnxtype=05&referenceid=${this.refId}&option=EXISTING`;
    } else if (link === 'msg') {
      url = `${url}/?tnxtype=13&referenceid=${this.refId}&option=EXISTING`;
    } else if (link === 'initiateBank') {
      url += Constants.TRADE_ADMIN_LANDING_SCREEN;
      url = `${url}/?operation=CREATE_REPORTING&referenceid=${this.refId}&option=EXISTING&productcode=BG`;
    }
    const myWindow = window.open(url, Constants.TARGET_SELF, 'width=800,height=500,resizable=yes,scrollbars=yes');
    myWindow.focus();
  }
}
