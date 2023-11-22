import { Component, OnInit, ViewChild } from '@angular/core';
import { BankDetailsComponent } from './../bank-details/bank-details.component';
import { IUCommonAmountDetailsComponent } from './../../../common/components/amount-details/amount-details.component';
import { UndertakingDetailsComponent } from './../undertaking-details/undertaking-details.component';
import { BankInstructionsComponent } from './../bank-instructions/bank-instructions.component';
import { ContractDetailsComponent } from './../contract-details/contract-details.component';
import { IUCommonApplicantDetailsComponent } from './../../../common/components/applicant-details-form/applicant-details-form.component';
import { RenewalDetailsComponent } from '../renewal-details/renewal-details.component';

import { CommonService } from '../../../../../common/services/common.service';
import { IUService } from '../../../common/service/iu.service';
import { IUCommonDataService } from '../../../common/service/iuCommonData.service';
import { GeneratePdfService } from '../../../../../common/services/generate-pdf.service';
import { TradeEventDetailsComponent } from '../../../../../trade/common/components/event-details/event-details.component';
import { Constants } from '../../../../../common/constants';
import { IUCommonLicenseComponent } from '../../../common/components/license/license.component';
import { CuGeneralDetailsComponent} from '../cu-general-details/cu-general-details.component';
import { CuBeneficiaryDetailsComponent } from '../cu-beneficiary-details/cu-beneficiary-details.component';
import { CuAmountDetailsComponent } from '../cu-amount-details/cu-amount-details.component';
import { CuRenewalDetailsComponent } from '../cu-renewal-details/cu-renewal-details.component';
import { CuUndertakingDetailsComponent } from '../cu-undertaking-details/cu-undertaking-details.component';
import { IUGeneralDetailsComponent } from '../iu-general-details/iu-general-details.component';
import { ReductionIncreaseComponent } from '../reduction-increase/reduction-increase.component';
import { CuReductionIncreaseComponent } from '../cu-reduction-increase/cu-reduction-increase.component';
import { CuPaymentDetailsComponent } from '../cu-payment-details/cu-payment-details.component';
import { IuPaymentDetailsComponent } from '../iu-payment-details/iu-payment-details.component';
import { ShipmentDetailsComponent } from '../shipment-details/shipment-details.component';
import { BanktemplateDownloadRequest } from '../../../common/model/BanktemplateDownloadRequest';
import { UndertakingGeneralDetailsComponent} from '../iu-undertaking-general-details/iu-undertaking-general-details.component';



interface FileAttachmentsList {
  fileName: string;
  type: string;
  status: string;
  title: string;
  objectData?: object;
}

@Component({
  selector: 'fcc-iu-inquiry-preview',
  templateUrl: './iu-inquiry-preview.component.html',
  styleUrls: ['./iu-inquiry-preview.component.css']
})
export class IUInquiryPreviewComponent implements OnInit {

  public tnxbgContent;
  public displayLU = false;
  public bankDetails: string[] = [];
  attachmentsList: FileAttachmentsList[] = [];
  @ViewChild(RenewalDetailsComponent) renewalDetailsComponent: RenewalDetailsComponent;
  @ViewChild(IUCommonApplicantDetailsComponent)applicantDetailsComponent: IUCommonApplicantDetailsComponent;
  @ViewChild(ContractDetailsComponent) contractDetailsComponent: ContractDetailsComponent;
  @ViewChild(BankInstructionsComponent) bankInstructionsComponent: BankInstructionsComponent;
  @ViewChild(UndertakingDetailsComponent) undertakingChildComponent: UndertakingDetailsComponent;
  @ViewChild(IUCommonAmountDetailsComponent)amountDetailsChildComponent: IUCommonAmountDetailsComponent;
  @ViewChild(BankDetailsComponent)bankDetailsComponent: BankDetailsComponent;
  @ViewChild(TradeEventDetailsComponent)tradeEventDetailsComponent: TradeEventDetailsComponent;
  @ViewChild(IUCommonLicenseComponent)commonLicenseDetailsComponent: IUCommonLicenseComponent;
  @ViewChild(IUGeneralDetailsComponent) generalDetailsComponent: IUGeneralDetailsComponent;
  @ViewChild(CuGeneralDetailsComponent) luGeneraldetailsChildComponent: CuGeneralDetailsComponent;
  @ViewChild(CuBeneficiaryDetailsComponent) cuBeneficaryDetailsChildComponent: CuBeneficiaryDetailsComponent;
  @ViewChild(CuAmountDetailsComponent) luAmountDetailsChildComponent: CuAmountDetailsComponent;
  @ViewChild(CuRenewalDetailsComponent) cuRenewalDetailsChildComponent: CuRenewalDetailsComponent;
  @ViewChild(CuUndertakingDetailsComponent) cuUndertakingChildComponent: CuUndertakingDetailsComponent;
  @ViewChild(ReductionIncreaseComponent) reductionIncreaseComponent: ReductionIncreaseComponent;
  @ViewChild(CuReductionIncreaseComponent) cuReductionIncreaseComponent: CuReductionIncreaseComponent;
  @ViewChild(ShipmentDetailsComponent) shipmentDetailsComponent: ShipmentDetailsComponent;
  @ViewChild(IuPaymentDetailsComponent) iuPaymentDetailsComponent: IuPaymentDetailsComponent;
  @ViewChild(CuPaymentDetailsComponent) cuPaymentDetailsComponent: CuPaymentDetailsComponent;
  @ViewChild(UndertakingGeneralDetailsComponent) undertakingGeneralDetailsComponent: UndertakingGeneralDetailsComponent;

  constructor(public iuService: IUService, public commonDataService: IUCommonDataService,
              public commonService: CommonService, public generatePdfService: GeneratePdfService) { }

ngOnInit() {
  this.commonService.getTnxDetails(this.commonDataService.getRefId(), this.commonDataService.getTnxId(),
  Constants.PRODUCT_CODE_IU, '').subscribe(data => {
    this.tnxbgContent = data.transactionDetails as string[];
    if (this.tnxbgContent.purpose != null && this.tnxbgContent.purpose !== '' && this.tnxbgContent.purpose !== '01') {
      this.commonDataService.setLUStatus(true);
      this.displayLU = true;
    }
    if (((this.tnxbgContent.guaranteeTypeName != null && this.tnxbgContent.guaranteeTypeName !== '') &&
        (this.tnxbgContent.guaranteeTypeCompanyId != null && this.tnxbgContent.guaranteeTypeCompanyId !== ''))) {
          this.commonDataService.setBankTemplateData(this.tnxbgContent);
        }
    this.commonDataService.setTnxStatCode(this.tnxbgContent.tnxStatCode);
    this.commonDataService.setViewComments(true);
    this.commonDataService.setDisplayMode('view');
  });
  this.commonService.getBankDetails().subscribe(data => {
    this.bankDetails = data as string[];
  });

  }
  closeWindow() {
    window.close();
  }

  fetchBankDetails() {
    if (this.tnxbgContent && this.tnxbgContent !== null) {
      let bankAbbvName = '';
      if (this.tnxbgContent.productCode === 'BG' && this.tnxbgContent.recipientBank && this.tnxbgContent.recipientBank.abbvName) {
        bankAbbvName = this.tnxbgContent.recipientBank.abbvName;
      } else if (this.tnxbgContent.productCode === 'BR' && this.tnxbgContent.advisingBank && this.tnxbgContent.advisingBank.abbvName) {
        bankAbbvName = this.tnxbgContent.advisingBank.abbvName;
      }
      this.commonService.fetchBankDetails(bankAbbvName).subscribe(data => {
              this.bankDetails = data as string[];
      });
    }
  }

  generatePdf() {
    this.fetchBankDetails();
    this.generatePdfService.generateFile(Constants.PRODUCT_CODE_IU, this.bankDetails);
    this.tradeEventDetailsComponent.generatePdf(this.generatePdfService);
    if (this.commonDataService.getPreviewOption() !== 'SUMMARY') {
    this.generalDetailsComponent.generatePdf(this.generatePdfService);
    this.applicantDetailsComponent.generatePdf(this.generatePdfService);
    this.undertakingGeneralDetailsComponent.generatePdf(this.generatePdfService);
    this.amountDetailsChildComponent.generatePdf(this.generatePdfService);
    this.renewalDetailsComponent.generatePdf(this.generatePdfService);
    this.reductionIncreaseComponent.generatePdf(this.generatePdfService);
    if (this.iuPaymentDetailsComponent) {
      this.iuPaymentDetailsComponent.generatePdf(this.generatePdfService);
    }
    if (this.shipmentDetailsComponent) {
      this.shipmentDetailsComponent.generatePdf(this.generatePdfService);
    }
    this.contractDetailsComponent.generatePdf(this.generatePdfService);
    this.bankDetailsComponent.generatePdf(this.generatePdfService);
    this.bankInstructionsComponent.generatePdf(this.generatePdfService);
    this.undertakingChildComponent.generatePdf(this.generatePdfService);
    if (this.displayLU) {
      this.luGeneraldetailsChildComponent.generatePdf(this.generatePdfService);
      this.cuBeneficaryDetailsChildComponent.generatePdf(this.generatePdfService);
      this.luAmountDetailsChildComponent.generatePdf(this.generatePdfService);
      this.cuRenewalDetailsChildComponent.generatePdf(this.generatePdfService);
      this.cuReductionIncreaseComponent.generatePdf(this.generatePdfService);
      if (this.cuPaymentDetailsComponent) {
        this.cuPaymentDetailsComponent.generatePdf(this.generatePdfService);
      }
      this.cuUndertakingChildComponent.generatePdf(this.generatePdfService);
    }
  }
    this.commonLicenseDetailsComponent.generatePdf(this.generatePdfService);
    this.generatePdfService.saveFile(this.tnxbgContent.refId, this.tnxbgContent.tnxId);
  }

  handleEvents(operation) {
    if (operation === Constants.OPERATION_EXPORT) {
      this.generatePdf();
    }
  }

  downloadTemplateFile() {
    if (this.commonDataService.isEditorTemplate) {
      this.commonDataService.transformToTemplateIssuedUndertaking(
        this.commonDataService.getTnxId(), this.commonDataService.getRefId(), this.commonDataService.getProductCode(),
           this.tnxbgContent.guaranteeTypeName, this.tnxbgContent.guaranteeTypeCompanyId,
           this.commonDataService.guaranteeTextId, '', this.commonDataService.getMode(), '', '');
      this.iuService.downloadTemplateDocument(this.commonDataService.banktemplateDownloadRequest
         ).subscribe(data => {
          const authError = data.headers.get('authError');
          if (!authError) {
              this.downloadBankTemplate(data);
              }
             });
    } else if (this.commonDataService.isSpecimenTemplate) {
      this.commonDataService.transformToTemplateIssuedUndertaking(
        this.commonDataService.getTnxId(), this.commonDataService.getRefId(), this.commonDataService.getProductCode(),
           this.tnxbgContent.guaranteeTypeName, this.tnxbgContent.guaranteeTypeCompanyId,
           '', this.commonDataService.documentId, this.commonDataService.getMode(), '', '');
      this.iuService.downloadTemplateDocument(this.commonDataService.banktemplateDownloadRequest
            ).subscribe(data => {
              const authError = data.headers.get('authError');
              if (!authError) {
              this.downloadBankTemplate(data);
              }
             });
    } else if (this.commonDataService.isXslTemplate) {
      this.commonDataService.transformToTemplateIssuedUndertaking(
        this.commonDataService.getTnxId(), this.commonDataService.getRefId(), this.commonDataService.getProductCode(),
           this.tnxbgContent.guaranteeTypeName, this.tnxbgContent.guaranteeTypeCompanyId,
           '', '', this.commonDataService.getMode(), this.commonDataService.stylesheetname,
           (JSON.stringify(this.tnxbgContent)));
      this.iuService.downloadTemplateDocument(this.commonDataService.banktemplateDownloadRequest
          ).subscribe(data => {
            const authError = data.headers.get('authError');
            if (!authError) {
            this.downloadBankTemplate(data);
            }
             });

    }

  }

  downloadBankTemplate(response) {

    let fileType;
    if (response.headers.get('content-type')) {
      fileType = response.type;
    } else {
      fileType = 'application/octet-stream';
    }
    const newBlob = new Blob([response.body], { type: fileType });

    // IE doesn't allow using a blob object directly as link href
    // instead it is necessary to use msSaveOrOpenBlob
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(newBlob);
        return;
    }

    const data = window.URL.createObjectURL(newBlob);

    const link = document.createElement('a');
    link.href = data;
    const filename = response.headers.get('content-disposition').split(';')[1].split('=')[1].replace(/\"/g, '');
    link.download = filename;
    // this is necessary as link.click() does not work on the latest firefox
    link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));

    setTimeout(() => {
    // For Firefox it is necessary to delay revoking the ObjectURL
    window.URL.revokeObjectURL(data);
    link.remove();
    }, Constants.LENGTH_100);
  }
}
