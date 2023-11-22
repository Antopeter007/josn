import { Component, OnInit, ViewChild } from '@angular/core';
import { IUService } from '../../../common/service/iu.service';
import { IUCommonDataService } from '../../../common/service/iuCommonData.service';
import { CommonDataService } from '../../../../../common/services/common-data.service';
import { Constants } from '../../../../../common/constants';
import { CuGeneralDetailsComponent } from '../../../initiation/components/cu-general-details/cu-general-details.component';
import { CuBeneficiaryDetailsComponent } from '../../../initiation/components/cu-beneficiary-details/cu-beneficiary-details.component';
import { CuAmountDetailsComponent } from '../../../initiation/components/cu-amount-details/cu-amount-details.component';
import { CuRenewalDetailsComponent } from '../../../initiation/components/cu-renewal-details/cu-renewal-details.component';
import { CuUndertakingDetailsComponent } from '../../../initiation/components/cu-undertaking-details/cu-undertaking-details.component';
import { CuReductionIncreaseComponent } from '../../../initiation/components/cu-reduction-increase/cu-reduction-increase.component';
import { ActivatedRoute } from '@angular/router';
import { CuPaymentDetailsComponent } from '../../../initiation/components/cu-payment-details/cu-payment-details.component';
import { CommonService } from '../../../../../common/services/common.service';

@Component({
  selector: 'fcc-iu-cu-preview-details',
  templateUrl: './amend-cu-preview-details.component.html',
  styleUrls: ['./amend-cu-preview-details.component.css']
})
export class AmendCuPreviewDetailsComponent implements OnInit {

  public jsonContent;
  public isPreviewEnabled = false;
  public operation: string;
  contextPath: string;
  actionCode: string;
  public viewMode = false;
  public mode: string;
  public tnxType;
  public luStatus = false;

  @ViewChild(CuGeneralDetailsComponent) luGeneraldetailsChildComponent: CuGeneralDetailsComponent;
  @ViewChild(CuBeneficiaryDetailsComponent) cuBeneficaryDetailsChildComponent: CuBeneficiaryDetailsComponent;
  @ViewChild(CuAmountDetailsComponent) cuAmountDetailsChildComponent: CuAmountDetailsComponent;
  @ViewChild(CuRenewalDetailsComponent) cuRenewalDetailsChildComponent: CuRenewalDetailsComponent;
  @ViewChild(CuUndertakingDetailsComponent) cuUndertakingChildComponent: CuUndertakingDetailsComponent;
  @ViewChild(CuReductionIncreaseComponent) cuReductionIncreaseComponent: CuReductionIncreaseComponent;
  @ViewChild(CuPaymentDetailsComponent) cuPaymentDetailsComponent: CuPaymentDetailsComponent;

  constructor(public commonService: CommonService, public iuCommonDataService: IUCommonDataService,
              public commonData: CommonDataService, protected activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.contextPath = window[`CONTEXT_PATH`];
    this.actionCode = window[`ACTION_CODE`];
    let viewRefId;
    this.activatedRoute.params.subscribe(paramsId => {
      viewRefId = paramsId.refId;
    });
    this.commonService.getMasterDetails(viewRefId, Constants.PRODUCT_CODE_IU, this.actionCode).subscribe(data => {
      this.jsonContent = data.masterDetails as string[];
      this.iuCommonDataService.setDisplayMode('view');
      this.iuCommonDataService.setmasterorTnx('master');
      this.iuCommonDataService.setOption(Constants.OPTION_FULL);
      if (this.jsonContent.purpose != null && this.jsonContent.purpose !== '' && this.jsonContent.purpose !== '01') {
        this.iuCommonDataService.setLUStatus(true);
        this.luStatus = true;
      }
    });

  }

  onClose() {
    window.close();
  }

}
