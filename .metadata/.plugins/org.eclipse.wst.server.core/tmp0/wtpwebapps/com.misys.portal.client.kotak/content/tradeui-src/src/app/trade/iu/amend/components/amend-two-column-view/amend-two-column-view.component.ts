import { InquiryConsolidatedChargesComponent } from './../../../../../common/components/inquiry-consolidated-charges/inquiry-consolidated-charges.component';
import { ReportingMessageDetailsComponent } from './../../../../../bank/common/components/reporting-message-details/reporting-message-details.component';
import { TransactionDetailsComponent } from './../../../../../bank/common/components/transaction-details/transaction-details.component';
import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit, ViewChild} from '@angular/core';
import { Constants } from '../../../../../common/constants';
import { CommonService } from '../../../../../common/services/common.service';
import { IUCommonDataService } from '../../../common/service/iuCommonData.service';
import { IUService } from '../../../common/service/iu.service';
import { GeneratePdfService } from './../../../../../common/services/generate-pdf.service';
import { TradeEventDetailsComponent } from '../../../../common/components/event-details/event-details.component';
import { IUCommonReturnCommentsComponent } from '../../../common/components/return-comments/return-comments.component';
import { CommonDataService } from './../../../../../common/services/common-data.service';

@Component({
  selector: 'fcc-iu-amend-two-column-view',
  templateUrl: './amend-two-column-view.component.html',
  styleUrls: ['./amend-two-column-view.component.scss']
})
export class AmendTwoColumnViewComponent implements OnInit {
  public masterbgContent;
  public tnxbgContent;
  public bankDetails: string[] = [];
  imagePath: string;
  isIncremented = false;
  blank: string;
  displayNarrative = false;
  displayCuNarrative = false;
  swiftMode = false;
  productCode: string;
  hasCustomerAttach = false;
  hasBankAttach = false;
  swiftVersion: number;
  isSwiftVersion2023Enable = false;

  constructor(public iuService: IUService, public iuCommonDataService: IUCommonDataService,
              public commonService: CommonService, public translate: TranslateService,
              public generatePdfService: GeneratePdfService, public commonDataService: CommonDataService) { }

  @ViewChild(TradeEventDetailsComponent)tradeEventDetailsComponent: TradeEventDetailsComponent;
  @ViewChild(IUCommonReturnCommentsComponent)iUCommonReturnCommentsComponent: IUCommonReturnCommentsComponent;
  @ViewChild(TransactionDetailsComponent) transactionDetailsChildComponent: TransactionDetailsComponent;
  @ViewChild(ReportingMessageDetailsComponent) reportingMessageDetailsComponent: ReportingMessageDetailsComponent;
  @ViewChild(InquiryConsolidatedChargesComponent) inquiryConsolidatedChargesComponent: InquiryConsolidatedChargesComponent;

  ngOnInit() {
    this.imagePath = this.commonService.getImagePath();
    this.translate.get('BLANK').subscribe((res: string) => {
      this.blank =  res;
    });
    this.commonService.getBankDetails().subscribe(data => {
      this.bankDetails = data as string[];
    });
    if (this.commonDataService.productCode) {
      this.productCode = this.commonDataService.productCode;
    } else {
      this.productCode = Constants.PRODUCT_CODE_IU;
    }
    this.commonService.getTnxDetails(this.iuCommonDataService.getRefId(), this.iuCommonDataService.getTnxId(),
    this.productCode, '').subscribe(data => {
      this.tnxbgContent = data.transactionDetails as string[];
      this.commonService.getMasterDetails(this.iuCommonDataService.getRefId(), this.productCode, '').subscribe(details => {
        this.masterbgContent = details.masterDetails as string[];
        if (this.tnxbgContent.purpose != null && this.tnxbgContent.purpose !== '' && this.tnxbgContent.purpose !== '01') {
          this.iuCommonDataService.setLUStatus(true);
        }
        if (this.tnxbgContent.purpose != null && this.tnxbgContent.purpose !== '' && this.tnxbgContent.purpose !== '01') {
          this.iuCommonDataService.setLUStatus(true);
        }
        if (this.tnxbgContent.subTnxTypeCode &&  this.tnxbgContent.subTnxTypeCode === '01') {
          this.isIncremented = true;
        } else if (this.tnxbgContent.subTnxTypeCode === '02') {
          this.isIncremented = false;
        }

      });
      if (this.tnxbgContent.advSendMode && this.tnxbgContent.advSendMode != null && this.tnxbgContent.advSendMode !== '') {
        this.swiftMode = (this.tnxbgContent.advSendMode === '01');
      }
      if (this.tnxbgContent.attachments && this.tnxbgContent.attachments.attachment !== '') {
        this.hasCustomerAttach = this.tnxbgContent.attachments.attachment.some(item => item.type === '01');
        this.hasBankAttach = this.tnxbgContent.attachments.attachment.some(item => item.type === '02');
      }
    });
  }


  showExtendedView(narrativeField: string) {
      if (narrativeField === 'bgAmdDetails') {
        this.displayNarrative = true;
      }
   }

   checkForMasterFields(fieldName): boolean {
    this.commonService. getSwiftVersion();
    this.swiftVersion = this.commonService.swiftVersion;
    if(this.swiftVersion >= Constants.SWIFT_VERSION2023){
     this.isSwiftVersion2023Enable = true;
    }
    if ((this.masterbgContent[fieldName] && this.masterbgContent[fieldName] != null && this.masterbgContent[fieldName] !== '')
       || ((this.masterbgContent[fieldName] === null || this.masterbgContent[fieldName] === '') &&
        this.tnxbgContent[fieldName]  && this.tnxbgContent[fieldName] != null && this.tnxbgContent[fieldName] !== '')) {
          return true;
        } else {
         return false;
        }
    }

    checkForBankMasterFields(fieldName1, fieldName2): boolean {
      if ((this.masterbgContent[fieldName1][fieldName2] && this.masterbgContent[fieldName1][fieldName2] != null &&
        this.masterbgContent[fieldName1][fieldName2] !== '')
         || ((this.masterbgContent[fieldName1][fieldName2] === null || this.masterbgContent[fieldName1][fieldName2] === '') &&
          this.tnxbgContent[fieldName1][fieldName2]  && this.tnxbgContent[fieldName1][fieldName2] != null &&
          this.tnxbgContent[fieldName1][fieldName2] !== '')) {
            return true;
          } else {
           return false;
          }
      }

    checkForBankTnxFields(fieldName1, fieldName2): boolean {
      if ((this.tnxbgContent[fieldName1][fieldName2] && this.tnxbgContent[fieldName1][fieldName2] != null &&
        this.tnxbgContent[fieldName1][fieldName2] !== '')
      || ((this.tnxbgContent[fieldName1][fieldName2] === null || this.tnxbgContent[fieldName1][fieldName2] === '') &&
       this.masterbgContent[fieldName1][fieldName2] && this.masterbgContent[fieldName1][fieldName2] != null &&
       this.masterbgContent[fieldName1][fieldName2] !== '')) {
          return true;
        } else {
          return false;
        }
      }

   checkForTnxFields(fieldName): boolean {
    if ((this.tnxbgContent[fieldName] && this.tnxbgContent[fieldName] != null && this.tnxbgContent[fieldName] !== '')
       || ((this.tnxbgContent[fieldName] === null || this.tnxbgContent[fieldName] === '') &&
        this.masterbgContent[fieldName]  && this.masterbgContent[fieldName] != null && this.masterbgContent[fieldName] !== '')) {
          return true;
        } else {
         return false;
        }
    }

    valuesForBankMasterFields(fieldname1, fieldName2) {
      return ((this.masterbgContent[fieldname1][fieldName2] === null || this.masterbgContent[fieldname1][fieldName2] === '') &&
               this.tnxbgContent[fieldname1][fieldName2] != null && this.tnxbgContent[fieldname1][fieldName2] !== '' ) ?
                this.blank : this.masterbgContent[fieldname1][fieldName2];
    }

    valuesForMasterFields(fieldname) {
      return ((this.masterbgContent[fieldname] === null || this.masterbgContent[fieldname] === '') &&
               this.tnxbgContent[fieldname] != null && this.tnxbgContent[fieldname] !== '' ) ?
                this.blank : this.masterbgContent[fieldname];
    }

    valuesForTnxFields(fieldname) {
      return ((this.tnxbgContent[fieldname] === null || this.tnxbgContent[fieldname] === '') &&
               this.masterbgContent[fieldname] != null && this.masterbgContent[fieldname] !== '' ) ?
                this.blank : this.tnxbgContent[fieldname];
    }

    valueReturnedFromService(value): string {
      return ((value === '' || value == null) ? this.blank : value);
    }

    valuesForBankTnxFields(fieldname1, fieldName2) {
      return ((this.tnxbgContent[fieldname1][fieldName2] === null || this.tnxbgContent[fieldname1][fieldName2] === '') &&
               this.masterbgContent[fieldname1][fieldName2] != null && this.masterbgContent[fieldname1][fieldName2] !== '' ) ?
                this.blank : this.tnxbgContent[fieldname1][fieldName2];
    }

    displaySwiftNarrative(initialValue: string, length: number) {
        const swiftDisplay = initialValue.split('\n');
        let finalValue = '';
        const len = swiftDisplay.length > length ? length : swiftDisplay.length;
        for (let i = 0 ; i < len; i++) {
            finalValue = `${finalValue}${swiftDisplay[i]}\n`;
         }
        if (swiftDisplay.length > len) {
           const tail = '.....';
           finalValue = finalValue.trim() + tail;
         }
        return finalValue;

    }

    closeWindow() {
      window.close();
    }

    generatePDFForIrregularCUVariation() {
       if (this.tnxbgContent.cuVariation && this.tnxbgContent.cuVariation !== '' &&
          this.tnxbgContent.cuVariation.variationLineItem !== ''
              && this.tnxbgContent.cuVariation.variationLineItem[0].type === '02') {
                const data: any[] = [];
                const headers: string[] = [];
                headers.push(this.commonService.getTranslation('CHARGE_DATE'));
                headers.push(this.commonService.getTranslation('HEADER_OPERATION'));
                headers.push(this.commonService.getTranslation('INCREASE_DECREASE_PERCENTAGE_HEADER'));
                headers.push(this.commonService.getTranslation('AMOUNT'));
                for (const variation of this.tnxbgContent.cuVariation.variationLineItem) {
                    if (variation.variationFirstDate !== '' && variation.operationType !== '' && variation.variationPct !== ''
                                  && variation.variationCurCode !== '' && variation.variationAmt !== '') {
                              const column: string[] = [];
                              column.push(variation.variationFirstDate);
                              column.push(this.commonService.getTranslation(
                                this.iuCommonDataService.getReductionOperationType(variation.operationType)));
                              column.push(`${variation.variationPct}%`);
                              column.push(`${variation.variationCurCode} ${variation.variationAmt}`);
                              data.push(column);
                    }
                }
                this.generatePdfService.createTable(headers, data);
            }
    }

    generatePDFForIrregularIUVariation() {
       if (this.tnxbgContent.bgVariation && this.tnxbgContent.bgVariation !== '' && this.tnxbgContent.bgVariation.variationLineItem !== ''
          && this.tnxbgContent.bgVariation.variationLineItem[0].type === '02') {
            const data: any[] = [];
            const headers: string[] = [];
            headers.push(this.commonService.getTranslation('CHARGE_DATE'));
            headers.push(this.commonService.getTranslation('HEADER_OPERATION'));
            headers.push(this.commonService.getTranslation('INCREASE_DECREASE_PERCENTAGE_HEADER'));
            headers.push(this.commonService.getTranslation('AMOUNT'));
            for (const variation of this.tnxbgContent.bgVariation.variationLineItem) {
                if (variation.variationFirstDate !== '' && variation.operationType !== '' && variation.variationPct !== ''
                              && variation.variationCurCode !== '' && variation.variationAmt !== '') {
                          const column: string[] = [];
                          column.push(variation.variationFirstDate);
                          column.push(this.commonService.getTranslation(
                            this.iuCommonDataService.getReductionOperationType(variation.operationType)));
                          column.push(`${variation.variationPct}%`);
                          column.push(`${variation.variationCurCode} ${variation.variationAmt}`);
                          data.push(column);
                }
            }
            this.generatePdfService.createTable(headers, data);
        }
    }

    generatePDFForMOCounterSection() {
      if (this.tnxbgContent.purpose && this.tnxbgContent.purpose === '02' && this.commonDataService.getIsBankUser()) {
        this.generatePdfService.setSectionDetails('CU_HEADER_GENERAL_DETAILS', true, false, 'cuTnxGeneralDetails');
        this.generatePdfService.setSectionDetails('CU_HEADER_BENEFICIARY_DETAILS', true, true, 'tnxCuBeneficiaryDetails');
        this.generatePdfService.setSectionDetails('HEADER_COUNTER_AMOUNT_CONFIRMATION_DETAILS', true, false, 'tnxCUAmtDetails');
        this.generatePdfService.setSectionDetails('COUNTER_EXTENSION_DETAILS_LABEL', true, false, 'tnxCuExtensionDetails');
        this.generatePdfService.setSectionDetails('', true, true, 'tnxCuAdviseExtension');
        this.generatePdfService.setSectionDetails('', true, true, 'tnxCuExtensionAmtCancellation');
        this.generatePdfService.
        setSectionDetails('KEY_HEADER_LOCAL_UNDERTAKING_INCREASE_DECREASE', true, false, 'cuTnxReductionIncreaseDetails');
        this.generatePdfService.setSectionDetails('', true, false, 'cuRegularVariationTnx');
        this.generatePdfService.setSectionDetails('', true, false, 'cuIrregularVariationTnx');
        // For Irregular CU Variation Type
        this.generatePDFForIrregularCUVariation();
        this.generatePdfService.setSectionDetails('HEADER_COUNTER_PAYMENT_DETAILS', true, false, 'cuTnxPaymentDetails');
        this.generatePdfService.setSectionDetails('COUNTER_UNDERTAKING_DETAILS_LABEL', true, false, 'tnxCUUndertakingDetails');
      }
    }

    generatePDFForLicenseTable() {
      if (this.tnxbgContent.linkedLicenses && this.tnxbgContent.linkedLicenses !== '') {
        const data: any[] = [];
        const headers: string[] = [];
        headers.push(this.commonService.getTranslation('REFERENCEID'));
        headers.push(this.commonService.getTranslation('BACK_OFFICE_REFERENCE'));
        headers.push(this.commonService.getTranslation('LICENSE_NUMBER'));
        headers.push(this.commonService.getTranslation('LS_ALLOCATED_AMT'));
        for (const license of this.tnxbgContent.linkedLicenses.license) {
          const column: string[] = [];
          column.push(license.lsRefId);
          column.push(license.boRefId);
          column.push(license.lsNumber);
          column.push(this.commonService.transformAmt(license.lsAllocatedAmt, this.tnxbgContent.bgCurCode));
          data.push(column);
        }
        this.generatePdfService.createTable(headers, data);
      }
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
      this.generatePdfService.generateFile(this.productCode, this.bankDetails);
      if (!this.commonDataService.getIsBankUser()) {
        this.tradeEventDetailsComponent.generatePdf(this.generatePdfService);
      }
      if (this.commonDataService.getIsBankUser()) {
        this.transactionDetailsChildComponent.generatePdf(this.generatePdfService);
      }
      if (this.tnxbgContent.returnComments && this.tnxbgContent.returnComments !== '' && this.tnxbgContent.returnComments !== null) {
        this.iUCommonReturnCommentsComponent.generatePdf(this.generatePdfService);
      }
      if (this.productCode === Constants.PRODUCT_CODE_IU && !this.commonDataService.getIsBankUser()) {
        this.generatePdfService.setSectionDetails('HEADER_GENERAL_DETAILS', true, false, 'tnxGeneralDetails');
        this.generatePdfService.setSectionDetails('HEADER_BENEFICIARY_DETAILS', true, true, 'tnxBeneficiaryDetails');
        this.generatePdfService.setSectionDetails('HEADER_AMEND_AMOUNT_DETAILS', true, false, 'tnxAmountDetails');
      } else if (this.productCode === Constants.PRODUCT_CODE_IU && this.commonDataService.getIsBankUser()) {
        this.generatePdfService.setSectionDetails('HEADER_GENERAL_DETAILS', true, false, 'tnxGeneralDetails');
        this.generatePdfService.setSectionDetails('HEADER_APPLICANT_DETAILS', true, false, 'tnxBRApplicantDetails');
        this.generatePdfService.setSectionDetails('HEADER_BENEFICIARY_DETAILS', true, false, 'tnxBeneficiaryDetails');
        this.generatePDFForMOCounterSection();
      } else {
        this.generatePdfService.setSectionDetails('HEADER_BENEFICIARY_DETAILS', true, false, 'tnxBRBeneficiaryDetails');
        this.generatePdfService.setSectionDetails('HEADER_APPLICANT_DETAILS', true, false, 'tnxBRApplicantDetails');
        this.generatePdfService.setSectionDetails('HEADER_GENERAL_DETAILS', true, false, 'tnxBRGeneralDetails');
      }
      if (this.commonDataService.getIsBankUser()) {
        this.generatePdfService.setSectionHeader('BANK_DETAILS_LABEL', true);
        this.generatePdfService.setSectionDetails('BANKDETAILS_ISSUING_BANK_DETAILS', true, true, 'tnxIssuingBankDetails');
        if (this.productCode === Constants.PRODUCT_CODE_IU) {
          this.generatePdfService.setSectionDetails('BANKDETAILS_TAB_ADVISING_BANK', true, true, 'tnxAdvisingBankDetails');
          this.generatePdfService.setSectionDetails('BANKDETAILS_TAB_ADVISE_THRU_BANK', true, true, 'tnxAdvisingThruBankDetails');
          this.generatePdfService.setSectionDetails('BANKDETAILS_TAB_CONFIRMING_BANK', true, true, 'tnxConfirmingBankDetails');
        } else {
        if (this.iuCommonDataService.getSubProdCode() === Constants.STAND_BY &&
        (this.tnxbgContent.bgConfInstructions === Constants.CODE_01 ||
        this.tnxbgContent.bgConfInstructions === Constants.CODE_02 )) {
        this.generatePdfService.setSectionDetails('BANKDETAILS_TAB_CONFIRMING_BANK', true, true, 'tnxConfirmingBankDetails');
        }
        this.generatePdfService.setSectionDetails('BANKDETAILS_TAB_ADVISE_THRU_BANK', true, true, 'tnxAdvisingThruBankDetails');
        }
        this.generatePdfService.setSectionDetails('HEADER_AMOUNT_CONFIRMATION_DETAILS', true, false, 'tnxBRAmtDetails');
      }
      this.generatePdfService.setSectionDetails('EXTENSION_DETAILS_LABEL', true, false, 'tnxExtensionDetails');
      this.generatePdfService.setSectionDetails('', true, true, 'tnxAdviseExtension');
      this.generatePdfService.setSectionDetails('', true, true, 'tnxExtensionAmtCancellation');
      this.generatePdfService.setSectionDetails('KEY_HEADER_UNDERTAKING_INCREASE_DECREASE', true, false, 'tnxReductionIncreaseDetails');
      this.generatePdfService.setSectionDetails('', true, false, 'regularVariationTnx');
      this.generatePdfService.setSectionDetails('', true, false, 'irregularVariationTnx');
      // For Irregular IU Variation Type
      this.generatePDFForIrregularIUVariation();
      this.generatePdfService.setSectionDetails('HEADER_UNDERTAKING_PAYMENT_DETAILS', true, false, 'tnxPaymentDetails');
      this.generatePdfService.setSectionDetails('HEADER_SHIPMENT_DETAILS', true, false, 'tnxShipmentDetails');
      this.generatePdfService.setSectionDetails('KEY_HEADER_CONTRACT_DETAILS', true, false, 'tnxContractDetails');
      this.generatePdfService.setSectionDetails('UNDERTAKING_DETAILS_LABEL', true, false, 'tnxBRUndertakingDetails');
      this.generatePdfService.setNarrativeSectionDetails('HEADER_AMEND_NARRATIVE_DETAILS',
      true, false, false, this.tnxbgContent.bgAmdDetails);
      this.generatePdfInstFrmCustomer();
      if (this.commonDataService.getIsBankUser()) {
        this.reportingMessageDetailsComponent.generatePdf(this.generatePdfService);
      } else {
        this.generatePdfService.setSectionDetails('BANK_AND_CONFIRMING_PARTY_DETAILS_LABEL', true, false, 'tnxreqConfPartyDetails');
        this.generatePdfService.setSectionDetails('BANKDETAILS_TAB_CONFIRMING_BANK', true, true, 'tnxConfirmingBankDetails');
      }
      // Attachment & Charges table
      if (this.commonDataService.getIsBankUser()) {
        this.chargePdfMOAmend();
        this.attachemntPdfMOAmend();
      }

      this.generatePdfService.setSectionDetails('HEADER_LICENSES', true, false, 'tnxLicenseDetails');
      // For License
      this.generatePDFForLicenseTable();

      if (this.commonDataService.getmasterorTnx() === 'master') {
         this.generatePdfService.saveFile(this.tnxbgContent.refId, '');
      } else {
        this.generatePdfService.saveFile(this.tnxbgContent.refId, this.tnxbgContent.tnxId);
      }
    }

    generatePdfInstFrmCustomer() {
      if (this.commonDataService.getIsBankUser() && this.productCode === Constants.PRODUCT_CODE_IU) {
        this.generatePdfService.setSectionDetails('HEADER_INSTRUCTIONS_FROM_CUST', true, false, 'tnxCustomerInstructions');
      }
    }

    handleEvents(operation) {
      if (operation === Constants.OPERATION_EXPORT) {
        this.generatePdf();
      }
    }

    attachemntPdfMOAmend() {
      let headers: string[] = [];
      let data: any[] = [];
      // Attachments table
      if (this.tnxbgContent.attachments && this.tnxbgContent.attachments !== '') {
        this.generatePdfService.setSectionHeader('KEY_HEADER_FILE_UPLOAD', true);
        this.generatePdfService.setSectionDetails('', false, false, 'sendAttachmentDetails');
        if (this.hasCustomerAttach) {
        this.generatePdfService.setSubSectionHeader('CUSTOMER_FILES_UPLOAD', true);
        headers  = [];
        headers.push(this.commonService.getTranslation('KEY_FILE_TITLE'));
        headers.push(this.commonService.getTranslation('FILE_NAME'));
        data  = [];
        for (const attachment of this.tnxbgContent.attachments.attachment) {
            if (attachment.type === '01') {
            const row = [];
            row.push(attachment.title);
            row.push(attachment.fileName);
            data.push(row);
            }
        }
        this.generatePdfService.createTable(headers, data);
        }
        if (this.hasBankAttach) {
        this.generatePdfService.setSubSectionHeader('BANK_FILES_UPLOAD', true);
        headers  = [];
        headers.push(this.commonService.getTranslation('KEY_FILE_TITLE'));
        headers.push(this.commonService.getTranslation('FILE_NAME'));
        data  = [];
        for (const attachment of this.tnxbgContent.attachments.attachment) {
            if (attachment.type === '02') {
            const row = [];
            row.push(attachment.title);
            row.push(attachment.fileName);
            data.push(row);
            }
        }
        this.generatePdfService.createTable(headers, data);
        }
      }
    }

    chargePdfMOAmend() {
      const headers: string[] = [];
      const data: any[] = [];
      // Charges' table
      if (this.tnxbgContent.charges && this.tnxbgContent.charges !== '') {
        this.generatePdfService.setSubSectionHeader('HEADER_CHARGE_DETAILS', true);
        for (const charge of this.tnxbgContent.charges.charge) {
          this.generatePdfService.setSectionLabel('CHARGE', true);
          this.generatePdfService.setSectionContent(this.iuCommonDataService.getChargeType(charge.chrgCode), true);

          this.generatePdfService.setSectionLabel('CHARGE_DESCRIPTION_LABEL', true);
          this.generatePdfService.setSectionContent(charge.additionalComment, false);

          this.generatePdfService.setSectionLabel('CHARGE_AMOUNT_LABEL', true);
          let chargeCurCode;
          if (charge.curCode && charge.curCode !== '') {
            chargeCurCode = charge.curCode;
          } else {
            chargeCurCode = charge.eqv_cur_code;
          }
          let chargeAmt;
          if (charge.amt && charge.amt !== '') {
            chargeAmt = charge.amt;
          } else {
            chargeAmt = charge.eqv_amt;
          }
          this.generatePdfService.setSectionContent((chargeCurCode + chargeAmt), false);

          this.generatePdfService.setSectionLabel('CHARGE_STATUS_LABEL', true);
          this.generatePdfService.setSectionContent(this.iuCommonDataService.getChargeStatus(charge.status), true);

          this.generatePdfService.setSectionLabel('CHARGE_SETTLEMENT_DATE_LABEL', true);
          this.generatePdfService.setSectionContent(charge.settlementDate, false);
        }
      }
    }

    checkForTnxServiceFields(fieldName): boolean {
      if ((this.tnxbgContent[fieldName]  === '' || this.tnxbgContent[fieldName] === null)
          && (this.masterbgContent[fieldName]  !== '' || this.masterbgContent[fieldName] !== null)) {
        return true;
      } else {
        return false;
      }
    }
}
