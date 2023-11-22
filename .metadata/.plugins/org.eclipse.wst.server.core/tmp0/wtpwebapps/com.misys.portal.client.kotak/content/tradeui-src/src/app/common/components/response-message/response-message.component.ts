import { CommonDataService } from './../../services/common-data.service';
import { Component, OnInit } from '@angular/core';
import { ResponseService } from '../../services/response.service';
import { CommonService } from '../../services/common.service';
import { Constants } from '../../constants';
import { Location } from '@angular/common';

@Component({
  selector: 'fcc-common-response-message',
  templateUrl: './response-message.component.html',
  styleUrls: ['./response-message.component.scss']
})
export class ResponseMessageComponent implements OnInit {

  constructor(protected service: ResponseService, protected commonService: CommonService,
              protected location: Location, protected commonDataService: CommonDataService) { }

  message: string;
  refId: string;
  tnxId: string;
  tnxType: string;
  option: string;
  subTnxType: string;
  productCode: string;
  showPreview: boolean;
  prodStatCode: string;

  ngOnInit(): void {
    this.showPreview = true;
    this.message = this.service.getResponseMessage();
    this.refId = this.service.getRefId();
    this.tnxId = this.service.getTnxId();
    this.tnxType = this.service.getTnxType();
    this.option = this.service.getOption();
    this.subTnxType = this.service.getSubTnxType();
    this.productCode = this.service.getProductCode();
    this.prodStatCode = this.commonDataService.getProdStatCode();
    this.location.replaceState('');
    window.scrollTo(0, 0);
  }

  openPreview() {
    const host = window.location.origin;
    let url = host + this.commonService.getBaseServletUrl();
    url += Constants.PREVIEW_POPUP_SCREEN;

    if (this.tnxType === '03' || this.tnxType === '13') {
      url = `${url}/?option=FULL&referenceid=${this.refId}&tnxid=${this.tnxId}&productcode=${this.productCode}`;
      url += `&tnxtype=${this.tnxType}&subtnxtype=${this.subTnxType}`;
    } else if (this.tnxType === '15' && (this.prodStatCode === '08' || this.prodStatCode === '31')) {
      url = `${url}/?option=FULL&referenceid=${this.refId}&tnxid=${this.tnxId}&productcode=${this.productCode}`;
      url += `&tnxtype=${this.tnxType}&prodStatCode=${this.prodStatCode}`;
    } else {
      url = `${url}/?option=${this.option}&referenceid=${this.refId}&tnxid=${this.tnxId}`;
      url += `&productcode=${this.productCode}&tnxtype=${this.tnxType}`;
    }

    const myWindow = window.open(url, Constants.TRANSACTION_POPUP, 'width=800,height=500,resizable=yes,scrollbars=yes');
    myWindow.focus();
  }

}
