import { Constants } from './../../../../common/constants';
import { DownloadAttachmentService } from '../../../../common/services/downloadAttachment.service';
import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ValidationService } from '../../../../common/validators/validation.service';
import { CommonService } from './../../../../common/services/common.service';
import { IUService } from '../../../iu/common/service/iu.service';
import { IUCommonDataService } from '../../../iu/common/service/iuCommonData.service';
import { CommonDataService } from './../../../../common/services/common-data.service';

@Component({
  selector: 'fcc-trade-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.scss']
})
export class TradeEventDetailsComponent implements OnInit {

  @Input() public bgRecord;
  amendEventdetailsSection: UntypedFormGroup;
  @Input() public formReady: UntypedFormGroup;
  imagePath: string;
  @Input() isMessageToBank = false;
  public amdNum: string;
  isMaster: boolean;
  hasCustomerAttach = false;
  hasBankAttach = false;
  doesFieldValueExist =  false;
  deliveryToOtherApplicableCode: any[] = [];
  completeDate: string;
  companyFullName: any;


  constructor(public validationService: ValidationService, public iuService: IUService,
              public commonDataService: IUCommonDataService, public commonService: CommonService, public translate: TranslateService,
              public downloadAttachmentService: DownloadAttachmentService, public commonData: CommonDataService) { }

  ngOnInit() {
    this.deliveryToOtherApplicableCode = Constants.DELIVERY_TO_OTHER_APPLICABLE_CODE;
    this.imagePath = this.commonService.getImagePath();
    if (this.commonDataService.getmasterorTnx() === 'master') {
      this.isMaster = true;
    } else {
      this.isMaster = false;
    }
    if (this.bgRecord.attachments && this.bgRecord.attachments.attachment !== '') {
      this.hasCustomerAttach = this.bgRecord.attachments.attachment.some(item => item.type === '01');
      this.hasBankAttach = this.bgRecord.attachments.attachment.some(item => item.type === '02');
    }

    this.checkFieldsExistence();
    this.completeDate = this.bgRecord.releaseDttm;
    this.formatDate(this.completeDate);
    this.getCompanyName();
  }

  checkFieldsExistence() {
    if (!(this.bgRecord && (this.checkFieldExist(this.bgRecord.bgDelvOrgUndertaking)
    && this.checkFieldExist(this.bgRecord.bgDelvOrgUndertakingText)
    && this.checkFieldExist(this.bgRecord.delvOrgUndertaking)
    && this.checkFieldExist(this.bgRecord.delvOrgUndertakingText)
    && this.checkFieldExist(this.bgRecord.bgPrincipalActNo)
    && this.checkFieldExist(this.bgRecord.bgFeeActNo)
    && this.checkFieldExist(this.bgRecord.bgDeliveryTo)
    && this.checkFieldExist(this.bgRecord.bgDeliveryToOther)
    && this.checkFieldExist(this.bgRecord.bgFreeFormatText)))) {
      this.doesFieldValueExist = true;
    }
  }

  getCompanyName() {
    if (this.bgRecord && this.bgRecord.refId && this.bgRecord.productCode && this.bgRecord.refId !== null
      && this.bgRecord.productCode !== null && this.bgRecord.refId !== '' && this.bgRecord.productCode !== '') {
      this.commonService.getCompanyFullName(this.bgRecord.refId, this.bgRecord.productCode).subscribe(data => {
        if (data && data.companyName && data.companyName !== null && data.companyName !== '') {
          this.companyFullName = data.companyName;
        }
      });
    }
  }

  checkFieldExist(field: any) {
    if (field === null || field === '') {
      return true;
    }
  }

  formatDate(dateString: string) {
    if (dateString && dateString !== null && dateString !== '') {
      this.commonService.getFormattedDate(dateString).subscribe(data => {
        if (data && data.date && data.date !== null && data.date !== '') {
          this.completeDate = data.date;
        }
      });
    }
  }

  getFileExt(fileName: any) {
    if (fileName !== '' && fileName !== null) {
      return fileName.split('.').pop();
    } else {
      return '';
    }
  }

  closeWindow() {
    window.close();
  }

  generatePdf(generatePdfService) {
    generatePdfService.setSectionDetails('HEADER_EVENT_DETAILS', true, false, 'eventDetails');
    generatePdfService.setSectionDetails('', false, false, 'eventAmountDetails');

    generatePdfService.setSectionDetails('HEADER_INSTRUCTIONS', true, true, 'instructionsToBank');

    generatePdfService.setSectionDetails('HEADER_BANK_MESSAGE', true, true, 'messageToBank');
    // Charges table
    let headers: string[] = [];
    let data: any[] = [];
    if (this.bgRecord.charges && this.bgRecord.charges !== ''
       && this.commonDataService.getmasterorTnx() !== Constants.MASTER && !this.commonData.getIsBankUser()) {
      generatePdfService.setSubSectionHeader('HEADER_CHARGE_DETAILS', true);
      for (const charge of this.bgRecord.charges.charge) {
        generatePdfService.setSectionLabel('CHARGE', true);
        generatePdfService.setSectionContent(this.commonDataService.getChargeType(charge.chrgCode), true);

        generatePdfService.setSectionLabel('CHARGE_DESCRIPTION_LABEL', true);
        generatePdfService.setSectionContent(charge.additionalComment, false);

        generatePdfService.setSectionLabel('CHARGE_AMOUNT_LABEL', true);
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
        generatePdfService.setSectionContent((chargeCurCode + chargeAmt), false);

        generatePdfService.setSectionLabel('CHARGE_STATUS_LABEL', true);
        generatePdfService.setSectionContent(this.commonDataService.getChargeStatus(charge.status), true);

        generatePdfService.setSectionLabel('CHARGE_SETTLEMENT_DATE_LABEL', true);
        generatePdfService.setSectionContent(charge.settlementDate, false);
      }
    }

    // Attachments table
    if (this.bgRecord.attachments && this.bgRecord.attachments !== '' && !this.commonData.getIsBankUser()) {
      generatePdfService.setSubSectionHeader('KEY_HEADER_FILE_UPLOAD', true);
      headers  = [];
      headers.push(this.commonService.getTranslation('KEY_FILE_TITLE'));
      headers.push(this.commonService.getTranslation('FILE_NAME'));
      data  = [];
      for (const attachment of this.bgRecord.attachments.attachment) {
        const row = [];
        row.push(attachment.title);
        row.push(attachment.fileName);
        data.push(row);
      }
      generatePdfService.createTable(headers, data);
      generatePdfService.setSectionDetails('', false, false, 'sendAttachmentDetails');
    } else if (this.bgRecord.attachments && this.bgRecord.attachments !== '' && this.commonData.getIsBankUser()) {
      if (this.hasCustomerAttach) {
        generatePdfService.setSubSectionHeader('CUSTOMER_FILES_UPLOAD', true);
        headers  = [];
        headers.push(this.commonService.getTranslation('KEY_FILE_TITLE'));
        headers.push(this.commonService.getTranslation('FILE_NAME'));
        data  = [];
        for (const attachment of this.bgRecord.attachments.attachment) {
          if (attachment.type === '01') {
            const row = [];
            row.push(attachment.title);
            row.push(attachment.fileName);
            data.push(row);
          }
      }
        generatePdfService.createTable(headers, data);
        generatePdfService.setSectionDetails('', false, false, 'sendAttachmentDetails');
      }
      if (this.hasBankAttach) {
        generatePdfService.setSubSectionHeader('BANK_FILES_UPLOAD', true);
        headers  = [];
        headers.push(this.commonService.getTranslation('KEY_FILE_TITLE'));
        headers.push(this.commonService.getTranslation('FILE_NAME'));
        data  = [];
        for (const attachment of this.bgRecord.attachments.attachment) {
          if (attachment.type === '02') {
            const row = [];
            row.push(attachment.title);
            row.push(attachment.fileName);
            data.push(row);
          }
      }
        generatePdfService.createTable(headers, data);
        generatePdfService.setSectionDetails('', false, false, 'sendAttachmentDetails');
      }
    }
  }
}
