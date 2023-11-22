import { ShipmentDetailsComponent } from './../../iu/initiation/components/shipment-details/shipment-details.component';
import { RuReductionIncreaseComponent } from './ru-reduction-increase/ru-reduction-increase.component';
import { TradeCommonDataService } from './../../common/services/trade-common-data.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from '../../../common/services/common.service';
import { IUCommonDataService } from '../../../trade/iu/common/service/iuCommonData.service';
import { ActivatedRoute } from '@angular/router';
import { Constants } from '../../../common/constants';
import { GeneratePdfService } from '../../../common/services/generate-pdf.service';
import { IUGeneralDetailsComponent } from '../../iu/initiation/components/iu-general-details/iu-general-details.component';
import { CommonBankDetailsComponent } from '../../iu/initiation/components/common-bank-details/common-bank-details.component';
import { RUPartyDetailsComponent } from './components/ru-party-details/ru-party-details.component';
import { CommonDataService } from '../../../common/services/common-data.service';
import { IUCommonAmountDetailsComponent } from '../../iu/common/components/amount-details/amount-details.component';
import { RenewalDetailsComponent } from '../../iu/initiation/components/renewal-details/renewal-details.component';
import { ContractDetailsComponent } from '../../iu/initiation/components/contract-details/contract-details.component';
import { RUUndertakingDetailsComponent } from '../common/components/undertaking-details/ru-undertaking-details.component';
import { IuPaymentDetailsComponent } from '../../iu/initiation/components/iu-payment-details/iu-payment-details.component';

@Component({
  selector: 'fcc-ru-initiation',
  templateUrl: './ru-initiation.component.html',
  styleUrls: ['./ru-initiation.component.css']
})
export class RUInitiationComponent implements OnInit {

  public brContent;
  public displayLU = false;
  productcode: string;
  public bankDetails: string[] = [];
  public viewMode = false;
  public operation: string;

  @ViewChild(IUGeneralDetailsComponent) iuGeneraldetailsChildComponent: IUGeneralDetailsComponent;
  @ViewChild(CommonBankDetailsComponent)commonBankDetailsComponent: CommonBankDetailsComponent;
  @ViewChild(RUPartyDetailsComponent)ruPartyDetailsComponent: RUPartyDetailsComponent;
  @ViewChild(IUCommonAmountDetailsComponent) amountDetailsChildComponent: IUCommonAmountDetailsComponent;
  @ViewChild(RenewalDetailsComponent) renewalDetailsComponent: RenewalDetailsComponent;
  @ViewChild(ContractDetailsComponent) contractDetailsComponent: ContractDetailsComponent;
  @ViewChild(RUUndertakingDetailsComponent) ruUndertakingChildComponent: RUUndertakingDetailsComponent;
  @ViewChild(RuReductionIncreaseComponent) ruReductionIncreaseComponent: RuReductionIncreaseComponent;
  @ViewChild(IuPaymentDetailsComponent) iuPaymentDetailsComponent: IuPaymentDetailsComponent;
  @ViewChild(ShipmentDetailsComponent) shipmentDetailsComponent: ShipmentDetailsComponent;

  constructor(public commonDataService: IUCommonDataService, public activatedRoute: ActivatedRoute,
              public commonService: CommonService, public translate: TranslateService,
              public commonData: CommonDataService,
              public tradeCommonDataService: TradeCommonDataService, public generatePdfService: GeneratePdfService) { }

  ngOnInit() {
    let masterOrTnx;
    let viewRefId;
    let viewTnxId;
    this.activatedRoute.params.subscribe(paramsId => {
      this.viewMode = paramsId.viewMode;
      viewRefId = paramsId.refId;
      viewTnxId = paramsId.tnxId;
      this.productcode = paramsId.productcode;
      masterOrTnx = paramsId.masterOrTnx;
      this.commonDataService.setRefId(paramsId.refId);
    });
    if (this.viewMode) {
      if (masterOrTnx === 'tnx') {
        this.commonService.getTnxDetails(viewRefId, viewTnxId, 'BR', '').subscribe(data => {
          this.brContent = data.transactionDetails as string[];
          this.commonDataService.setDisplayMode('view');
          this.commonData.setEntity(this.brContent.entity);
          this.tradeCommonDataService.setDisplayMode('view');
          this.commonDataService.setmasterorTnx(masterOrTnx);
        });
      } else if (masterOrTnx === Constants.MASTER) {
        this.commonService.getMasterDetails(viewRefId, 'BR', '').subscribe(data => {
          this.brContent = data.masterDetails as string[];
          this.commonDataService.setDisplayMode('view');
          this.commonData.setEntity(this.brContent.entity);
          this.tradeCommonDataService.setDisplayMode('view');
          this.commonDataService.setmasterorTnx(masterOrTnx);
        });
      }
      this.commonData.setDisplayMode(Constants.MODE_VIEW);
      this.commonData.setProductCode(Constants.PRODUCT_CODE_RU);
      this.commonService.getBankDetails().subscribe(data => {
        this.bankDetails = data as string[];
      });
    }
  }

  fetchBankDetails() {
    if (this.brContent && this.brContent !== null) {
      let bankAbbvName = '';
      if (this.brContent.productCode === 'BG' && this.brContent.recipientBank && this.brContent.recipientBank.abbvName) {
        bankAbbvName = this.brContent.recipientBank.abbvName;
      } else if (this.brContent.productCode === 'BR' && this.brContent.advisingBank && this.brContent.advisingBank.abbvName) {
        bankAbbvName = this.brContent.advisingBank.abbvName;
      }
      this.commonService.fetchBankDetails(bankAbbvName).subscribe(data => {
              this.bankDetails = data as string[];
      });
    }
  }

  generatePdf() {
    this.fetchBankDetails();
    this.generatePdfService.generateFile(Constants.PRODUCT_CODE_RU, this.bankDetails);
    if (this.iuGeneraldetailsChildComponent) {
    this.iuGeneraldetailsChildComponent.generatePdf(this.generatePdfService);
    }
    if (this.commonDataService.getPreviewOption() !== Constants.OPTION_SUMMARY) {
      if (this.ruPartyDetailsComponent) {
        this.ruPartyDetailsComponent.generatePdf(this.generatePdfService);
      }
      if (this.amountDetailsChildComponent) {
        this.amountDetailsChildComponent.generatePdf(this.generatePdfService);
      }
      if (this.renewalDetailsComponent) {
        this.renewalDetailsComponent.generatePdf(this.generatePdfService);
      }
      if (this.ruReductionIncreaseComponent) {
        this.ruReductionIncreaseComponent.generatePdf(this.generatePdfService);
      }
      if (this.iuPaymentDetailsComponent) {
        this.iuPaymentDetailsComponent.generatePdf(this.generatePdfService);
      }
      if (this.shipmentDetailsComponent) {
        this.shipmentDetailsComponent.generatePdf(this.generatePdfService);
      }
      if (this.commonBankDetailsComponent) {
        this.commonBankDetailsComponent.generatePdf(this.generatePdfService);
      }
      if (this.contractDetailsComponent) {
        this.contractDetailsComponent.generatePdf(this.generatePdfService);
      }
      if (this.ruUndertakingChildComponent) {
        this.ruUndertakingChildComponent.generatePdf(this.generatePdfService);
      }
   }
    if (this.commonDataService.getmasterorTnx() === Constants.MASTER) {
       this.generatePdfService.saveFile(this.brContent.refId, '');
     } else {
      this.generatePdfService.saveFile(this.brContent.refId, this.brContent.tnxId);
   }
  }
  handleEvents(operation) {
    this.operation = operation;
    if (operation === Constants.OPERATION_EXPORT) {
      this.generatePdf();
    }
  }
}
