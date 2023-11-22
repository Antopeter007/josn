import { Constants } from './../../../common/constants';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IUCommonDataService } from '../../iu/common/service/iuCommonData.service';
import { CommonService } from './../../../common/services/common.service';
import { DialogService } from 'primeng';
import { TranslateService } from '@ngx-translate/core';
import { ChartComponent } from './../../../common/components/chart/chart.component';
import { CommonDataService } from './../../../common/services/common-data.service';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';


@Component({
  selector: 'fcc-ru-inquiry',
  templateUrl: './ru-inquiry.component.html',
  styleUrls: ['./ru-inquiry.component.scss']
})
export class RuInquiryComponent implements OnInit {

  bankInquiryRUForm: UntypedFormGroup;
  refId: string;
  public jsonContent;
  productCode: string = Constants.PRODUCT_CODE_RU;
  isBankUser: boolean;
  actionCode: string;

  @ViewChild(ChartComponent)chartComponent: ChartComponent;

  constructor(
    protected readonly fb: UntypedFormBuilder,
    public activatedRoute: ActivatedRoute,
    public router: Router,
    public commonService: CommonService,
    public commonDataService: IUCommonDataService,
    public commonData: CommonDataService,
    public dialogService: DialogService,
    public translate: TranslateService
    ) { }

  ngOnInit() {
    this.actionCode = window[`ACTION_CODE`];
    this.bankInquiryRUForm = new UntypedFormGroup({});
    this.activatedRoute.params.subscribe(paramsId => {
      this.refId = paramsId.refId;
      this.commonDataService.setRefId(paramsId.refId);
     });

    this.commonService.getMasterDetails(this.refId, 'BR', this.actionCode).subscribe(data => {
      this.jsonContent = data.masterDetails as string[];
     });
    this.commonData.setOperation(Constants.OPERATION_LIST_INQUIRY);
    this.isBankUser = this.commonData.getIsBankUser();
    if (this.isBankUser) {
      this.commonDataService.setDisplayMode('view');
      this.commonData.setDisplayMode('view');
    }
    this.createMainForm();
 }

 createMainForm() {
  return this.bankInquiryRUForm = this.fb.group({});
}

  goToTnx(tnxType: string) {
    const host = window.location.origin;
    let url = host + this.commonService.getBaseServletUrl();
    if (tnxType === '13') {
      url += Constants.RU_LANDING_SCREEN;
      url = `${url}/?tnxtype=13&referenceid=${this.refId}&option=EXISTING`;
      } else if (tnxType === 'initiateBank') {
        url += Constants.TRADE_ADMIN_LANDING_SCREEN;
        url = `${url}/?operation=CREATE_REPORTING&referenceid=${this.refId}&option=EXISTING&productcode=BR`;
      }
    const myWindow = window.open(url, Constants.TARGET_SELF, 'width=800,height=500,resizable=yes,scrollbars=yes');
    myWindow.focus();
  }
}
