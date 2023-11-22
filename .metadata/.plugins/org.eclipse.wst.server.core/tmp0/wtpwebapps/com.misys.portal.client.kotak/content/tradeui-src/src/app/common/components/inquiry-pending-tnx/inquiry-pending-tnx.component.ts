import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { IUCommonDataService } from '../../../trade/iu/common/service/iuCommonData.service';
import { CommonService } from '../../services/common.service';
import { Constants } from '../../constants';

interface PendingTransaction {
  entity: string;
  tnxId: string;
  subProductCode: string;
  tnxTypeCode: string;
  prodStatCode: string;
  subTnxTypeCode: string;
  tnxStatCode: string;
  subTnxStatCode: string;
  amdNo: string;
  boTnxId: string;
  inpDttm: string;
  status: string;
  fullType: string;
  messageType: string;
  tnxCurCode: string;
  tnxAmt: string;
  objectData?: object;
}

@Component({
  selector: 'fcc-common-inquiry-pending-tnx',
  templateUrl: './inquiry-pending-tnx.component.html',
  styleUrls: ['./inquiry-pending-tnx.component.scss']
})
export class InquiryPendingTnxComponent implements OnInit {
  pendingTransactions: PendingTransaction[] = [];
  refId: string;
  imagePath: string;
  productCode: string;
  showEventRef = true;
  WINDOW_SIZE = 'width=800,height=500,resizable=yes,scrollbars=yes';

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected router: Router, protected commonDataService: IUCommonDataService,
    public translate: TranslateService, protected commonService: CommonService
    ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(paramsId => {
      this.refId = paramsId.refId;
      this.productCode = paramsId.productcode;
    });

    this.commonService.getPendingTransactionsList(this.refId, this.productCode).subscribe(data => {
      this.pendingTransactions = data.pendingTransactions;
      this.showEventRef = this.commonService.isShowEventReferenceEnabled();
    });
    this.imagePath = this.commonService.getImagePath();
  }

  navigateToPreview(tnxId: string, tnxTypeCode: string, subTnxTypeCode: string) {
    const host = window.location.origin;
    let url = host + this.commonService.getBaseServletUrl();
    url += Constants.PREVIEW_POPUP_SCREEN;

    const isAmend = (tnxTypeCode === '03' &&
      (subTnxTypeCode === '01' || subTnxTypeCode === '02' || subTnxTypeCode === '03'));
    const isPendingAmendRelease = tnxTypeCode === '03' && subTnxTypeCode === '05';
    const isPendingMsgToBank = tnxTypeCode === '13';
    // For Amend , Amend release , Amend awaiting bene approval, Message to Bank, events before approval.
    if (isAmend || isPendingAmendRelease || isPendingMsgToBank) {
      url = `${url}/?option=FULLORSUMMARY&referenceid=${this.refId}&tnxid=${tnxId}&productcode=${this.productCode}`;
      url += `&tnxtype=${tnxTypeCode}&subtnxtype=${subTnxTypeCode}`;
    } else {
      url = `${url}/?option=FULLORSUMMARY&referenceid=${this.refId}&tnxid=${tnxId}&productcode=${this.productCode}`;
    }
    const myWindow = window.open(url, Constants.TRANSACTION_POPUP, this.WINDOW_SIZE);
    myWindow.focus();
  }

  navigateToEditScreen(tnxId: string, tnxTypeCode: string, subTnxTypeCode: string) {
    const host = window.location.origin;
    let url = host + this.commonService.getBaseServletUrl();
    if (this.productCode === Constants.PRODUCT_CODE_IU) {
      url += Constants.IU_LANDING_SCREEN;
      if (tnxTypeCode === '13') {
        url = `${url}/?mode=DRAFT&tnxtype=13&referenceid=${this.refId}&tnxid=${tnxId}`;
      } else if (tnxTypeCode === '03') {
        url = `${url}/?mode=DRAFT&tnxtype=03&subtnxtype=${subTnxTypeCode}&referenceid=${this.refId}&tnxid=${tnxId}`;
      }
    } else if (this.productCode === Constants.PRODUCT_CODE_RU && tnxTypeCode === '13') {
      url += Constants.RU_LANDING_SCREEN;
      url = `${url}/?mode=DRAFT&tnxtype=13&referenceid=${this.refId}&tnxid=${tnxId}`;
    }
    const myWindow = window.open(url, Constants.TARGET_SELF, this.WINDOW_SIZE);
    myWindow.focus();
  }

  navigateToUnsignedScreen(tnxId: string, tnxTypeCode: string, subTnxTypeCode: string) {
    const host = window.location.origin;
    let url = host + this.commonService.getBaseServletUrl();
    if (this.productCode === Constants.PRODUCT_CODE_IU) {
      url += Constants.IU_LANDING_SCREEN;
      if (tnxTypeCode === '13') {
        url = `${url}/?mode=UNSIGNED&tnxtype=13&referenceid=${this.refId}&tnxid=${tnxId}`;
      } else if (tnxTypeCode === '03') {
        url = `${url}/?mode=UNSIGNED&tnxtype=03&subtnxtype=${subTnxTypeCode}&referenceid=${this.refId}&tnxid=${tnxId}`;
        this.commonDataService.setMode(Constants.MODE_UNSIGNED);
        this.commonDataService.setmasterorTnx('tnx');
      }
    } else if (this.productCode === Constants.PRODUCT_CODE_RU && tnxTypeCode === '13') {
      url += Constants.RU_LANDING_SCREEN;
      url = `${url}/?mode=UNSIGNED&tnxtype=13&referenceid=${this.refId}&tnxid=${tnxId}`;
    }
    this.commonDataService.setRefId(this.refId);
    this.commonDataService.setTnxId(tnxId);
    const myWindow = window.open(url, Constants.TARGET_SELF, this.WINDOW_SIZE);
    myWindow.focus();
  }
}
