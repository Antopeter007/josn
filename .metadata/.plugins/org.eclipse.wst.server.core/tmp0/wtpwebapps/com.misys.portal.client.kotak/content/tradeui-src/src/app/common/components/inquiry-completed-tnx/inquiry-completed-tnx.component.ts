import { CommonDataService } from './../../services/common-data.service';
import { IUCommonDataService } from '../../../trade/iu/common/service/iuCommonData.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from 'primeng';
import { Constants } from '../../../common/constants';
import { CommonService } from '../../../common/services/common.service';
import { UsersDialogComponent } from '../users-dialog/users-dialog.component';
import { TranslateService } from '@ngx-translate/core';

interface CompleterdTransactions {
  releaseDttm: string;
  type: string;
  status: string;
  curCode: string;
  inpUser: string;
  rlsUser: string;
  eventRef: string;
  tmaStatus: string;
  messageType: string;
  reportType: string;
  amt: string;
  tnxId: string;
  childId: string;
  objectData?: object;
  subTnxTypeCode: string;
  prodStatusCode: string;
  tnxStatCode: string;
}

@Component({
  selector: 'fcc-common-inquiry-completed-tnx',
  templateUrl: './inquiry-completed-tnx.component.html',
  styleUrls: ['./inquiry-completed-tnx.component.scss'],
  providers: [DialogService]
})
export class InquiryCompletedTnxComponent implements OnInit {
  transactions: CompleterdTransactions[] = [];
  refId: string;
  imagePath: string;
  productCode: string;
  option: string;
  showEventRef = true;

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected router: Router, protected iuCommonDataService: IUCommonDataService,
    public dialogService: DialogService, protected commonService: CommonService,
    public translate: TranslateService, public commonDataService: CommonDataService
    ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(paramsId => {
      this.refId = paramsId.refId;
      this.productCode = paramsId.productcode;
    });

    const subProductCode = '*';
    this.commonService.getCompletedTransactionsList(this.refId, this.productCode, subProductCode).subscribe(data => {
      this.transactions = data.transactionHistories;
      this.option = data.option;
      if (this.productCode === Constants.PRODUCT_CODE_RU) {
        this.option = Constants.OPTION_FULL;
      }
      this.showEventRef = this.commonService.isShowEventReferenceEnabled();
    });
    this.imagePath = this.commonService.getImagePath();
  }

  showDailog(tnxId: string, tnxType: string): void {
    this.iuCommonDataService.setTnxId(tnxId);
    this.iuCommonDataService.setTnxType(tnxType);
    const ref = this.dialogService.open(UsersDialogComponent, {
      header: 'Users',
      width: '40vw',
      height: '40vh',
      contentStyle: { overflow: 'auto', position: 'absolute', height: '40vh' }
    });
    ref.onClose.subscribe(() => { });
  }

  navigateToMsgToBank(tnxId, prodStat: string) {
    const host = window.location.origin;
    let url = host + this.commonService.getBaseServletUrl();
    if (this.productCode === Constants.PRODUCT_CODE_IU) {
      url += Constants.IU_LANDING_SCREEN;
      if (prodStat.toUpperCase() === Constants.ENQUIRE_STATUS_CLAIM_PROCESSING) {
        url = `${url}/?tnxtype=13&referenceid=${this.refId}&option=${Constants.OPTION_CLAIM_PROCESSING}&tnxid=${tnxId}`;
      } else if (prodStat.toUpperCase() === Constants.OPTION_CANCEL) {
        url = `${url}/?tnxtype=13&referenceid=${this.refId}&option=${Constants.OPTION_CANCEL}`;
      } else {
        url = `${url}/?tnxtype=13&referenceid=${this.refId}&option=${Constants.OPTION_ACTION_REQUIRED}&tnxid=${tnxId}`;
      }
    } else if (this.productCode === Constants.PRODUCT_CODE_RU) {
      url += Constants.RU_LANDING_SCREEN;
      url = `${url}/?tnxtype=13&referenceid=${this.refId}&option=${Constants.OPTION_ACTION_REQUIRED}&tnxid=${tnxId}`;
    }
    const myWindow = window.open(url, Constants.TARGET_SELF, 'width=800,height=500,resizable=yes,scrollbars=yes');
    myWindow.focus();
  }

  navigateToPreview(tnxId: string, tnxTypeCode: string, subTnxTypeCode: string, status: string) {
    const host = window.location.origin;
    let url = host + this.commonService.getBaseServletUrl();
    url += Constants.PREVIEW_POPUP_SCREEN;
    const tnxStatCode = '04';
    if (this.commonDataService.getIsBankUser()) {
      if (status === 'Amended') {
        url += `/?option=${this.option}&referenceid=${this.refId}&tnxid=${tnxId}`;
        url += `&productcode=${this.productCode}&tnxtype=${tnxTypeCode}&prodStatCode=08`;
      } else {
        url += `/?option=${this.option}&referenceid=${this.refId}&tnxid=${tnxId}`;
        url += `&productcode=${this.productCode}&tnxtype=${tnxTypeCode}&tnxStatCode=${tnxStatCode}`;
      }
    } else {
      const isAmend = (tnxTypeCode === '03' &&
        (subTnxTypeCode === '01' || subTnxTypeCode === '02' || subTnxTypeCode === '03'));
      // For Amend
      if (isAmend) {
        url += `/?option=${this.option}&referenceid=${this.refId}&tnxid=${tnxId}`;
        url += `&productcode=${this.productCode}&tnxtype=${tnxTypeCode}&subtnxtype=${subTnxTypeCode}`;
      } else {
        // Show preview Inquiry for New, Amend Release &   Message to Bank, except for Amend after Approval.
        url += `/?option=${this.option}&referenceid=${this.refId}&tnxid=${tnxId}`;
        url += `&productcode=${this.productCode}&tnxtype=${tnxTypeCode}&tnxStatCode=${tnxStatCode}`;
      }
    }
    const myWindow = window.open(url, Constants.TRANSACTION_POPUP, 'width=800,height=500,resizable=yes,scrollbars=yes');
    myWindow.focus();
  }
}
