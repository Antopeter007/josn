import { TranslateService } from '@ngx-translate/core';
import { ValidationService } from './../../../../common/validators/validation.service';
import { CommonDataService } from './../../../../common/services/common-data.service';
import { CommonService } from './../../../../common/services/common.service';
import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators} from '@angular/forms';
import { Constants } from '../../../../common/constants';
import { DatePipe } from '@angular/common';
import { IUCommonDataService } from '../../../../trade/iu/common/service/iuCommonData.service';
import { TradeCommonDataService } from '../../../../trade/common/services/trade-common-data.service';


@Component({
  selector: 'fcc-bank-transaction-details',
  templateUrl: './transaction-details.component.html',
  styleUrls: ['./transaction-details.component.scss']
})
export class TransactionDetailsComponent implements OnInit {

  @Input() public jsonContent;
  prodStatusObj: any;
  transactionDetailsSection: UntypedFormGroup;
  yearRange: string;
  @Output() formReady = new EventEmitter<UntypedFormGroup>();
  @Output() prodStatus = new EventEmitter<any>();
  viewMode: boolean;
  applicationDate = 'application date';
  dateFormat: string;
  adviseDate;
  issDate;
  expiredTransaction: boolean;
  currentDate: any;
  isExistingDraftMenu = false;
  dateLabel: string;
  boInpDate: any;
  isRUScratchUnsignedMode = false;
  isRUUnsignedViewMode = false;
  isProvisional = false;
  collapse = false;
  imagePath: string;
  masterIcon = false;
  tnxIcon = false;
  companyFullName: any;

  constructor(public fb: UntypedFormBuilder, public commonService: CommonService, public commonDataService: CommonDataService,
              public validationService: ValidationService, public datePipe: DatePipe,
              public iuCommonDataService: IUCommonDataService, public tradeCommonDataService: TradeCommonDataService,
              public translate: TranslateService) { }

  ngOnInit() {
    this.dateFormat = this.commonService.getDateFormat();
    this.imagePath = this.commonService.getImagePath();
    this.currentDate = this.datePipe.transform(new Date(), 'dd/MM/yyyy');
    this.translate.get('GENERALDETAILS_APPLICATION_DATE').subscribe((value: string) => {
      this.dateLabel = value;
    });
    this.isExistingDraftMenu = (this.jsonContent.tnxTypeCode === Constants.TYPE_REPORTING
      && this.commonDataService.getMode() === Constants.MODE_DRAFT);
    if (this.commonDataService.getDisplayMode() === Constants.MODE_VIEW) {
      this.viewMode = true;
    } else {
      this.viewMode = false;
    }
    if (this.jsonContent.tnxTypeCode === Constants.TYPE_NEW && this.commonDataService.getProductCode() === 'BR' &&
        this.commonDataService.getMode() === Constants.MODE_UNSIGNED) {
          this.isRUScratchUnsignedMode = true;
    }
    if (this.jsonContent.tnxTypeCode === Constants.TYPE_NEW && this.commonDataService.getProductCode() === 'BR' &&
        this.commonDataService.getMode() !== Constants.MODE_DRAFT && this.viewMode) {
           this.isRUUnsignedViewMode = true;
    }
    if (Constants.OPTION_EXISTING === this.commonDataService.getOption() || this.isExistingDraftMenu) {
      this.transactionDetailsSection = this.fb.group({
        applDate: '',
        boInpDttm: this.currentDate,
        prodStatCode: ['', [Validators.required]],
        adviseDate: '',
        issDate: ''
      });
    } else {
      this.transactionDetailsSection = this.fb.group({
        applDate: '',
        boInpDttm: '',
        adviseDate: '',
        issDate: ''
      });
    }

    if ((this.jsonContent[`prodStatCode`] === '78' || this.jsonContent[`prodStatCode`] === '79' ||
     this.jsonContent[`prodStatCode`] === '98' || this.jsonContent[`provisionalStatus`] === 'Y') ||
     (this.commonDataService.getOperation() === Constants.OPERATION_CREATE_REPORTING &&
      this.jsonContent.tnxTypeCode === Constants.TYPE_INQUIRE && this.jsonContent[`prodStatCode`] === '03' &&
      (this.jsonContent.subTnxTypeCode === '88' || this.jsonContent.subTnxTypeCode === '89')
     )) {
      this.isProvisional = true;
     }

    this.getFieldValues();
    this.yearRange = this.commonService.getYearRange();
    // set Application Date for issuance or issue date for other events
    let minDate;
    minDate = this.commonService.getDateObject(this.transactionDetailsSection.get(`applDate`).value);
    this.commonService.setMinSettlementDate(minDate);
    this.manageNewProdStatEvents();
    this.checkIconVisibility();
    this.getCompanyName();
    // Emit the form group to the parent
    this.formReady.emit(this.transactionDetailsSection);
  }
  getCompanyName() {
    if (this.jsonContent && this.jsonContent.refId && this.jsonContent.productCode && this.jsonContent.refId !== null
      && this.jsonContent.productCode !== null && this.jsonContent.refId !== '' && this.jsonContent.productCode !== '') {
      this.commonService.getCompanyFullName(this.jsonContent.refId, this.jsonContent.productCode).subscribe(data => {
        if (data && data.companyName && data.companyName !== null && data.companyName !== '') {
          this.companyFullName = data.companyName;
        }
      });
    }
  }
  checkIconVisibility() {
    if (this.commonDataService.getOption() === Constants.SCRATCH || (Constants.MODE_DRAFT === this.commonDataService.getMode()
    && this.jsonContent.tnxTypeCode !== Constants.TYPE_REPORTING) || this.jsonContent.subTnxStatCode === Constants.TYPE_STOPOVER ||
    (this.commonDataService.getOption() !== Constants.OPTION_EXISTING && this.iuCommonDataService.getMode() === 'UNSIGNED' &&
     this.jsonContent.tnxTypeCode === Constants.TYPE_NEW)) {
      this.tnxIcon = true;
    } else if (this.commonDataService.getOption() === Constants.OPTION_EXISTING
    || (this.commonDataService.getOption() === Constants.OPTION_REJECTED)
    || (Constants.MODE_DRAFT === this.commonDataService.getMode() && this.jsonContent.tnxTypeCode === Constants.TYPE_REPORTING)
    || (this.commonDataService.getOption() !== Constants.OPTION_EXISTING && this.iuCommonDataService.getMode() === 'UNSIGNED' &&
    this.jsonContent.tnxTypeCode !== Constants.TYPE_NEW)) {
      this.masterIcon = true;
    }

  }

  getFieldValues() {
    if (Constants.OPTION_EXISTING === this.commonDataService.getOption() || this.isExistingDraftMenu) {
      this.transactionDetailsSection.patchValue({
        boInpDttm: this.currentDate,
        applDate: this.jsonContent.applDate,
        adviseDate: this.jsonContent.adviseDate,
        issDate: this.jsonContent.issDate
      });
      this.translate.get('CREATION_DATE').subscribe((value: string) => {
        this.dateLabel = value;
      });
    } else if (!this.viewMode) {
      this.transactionDetailsSection.patchValue({
        boInpDttm: this.jsonContent[`boInpDttm`],
        applDate: this.jsonContent.applDate,
        adviseDate: this.jsonContent.adviseDate,
        issDate: this.jsonContent.issDate
      });
    }
    if (this.viewMode && (this.jsonContent.tnxTypeCode === Constants.TYPE_REPORTING)) {
      this.translate.get('CREATION_DATE').subscribe((value: string) => {
        this.dateLabel = value;
      });
      this.boInpDate = (this.jsonContent[`boInpDttm`].split(' '))[0];
    }
    if (this.jsonContent.adviseDate && this.jsonContent.adviseDate !== null && this.jsonContent.adviseDate !== '') {
      this.adviseDate = this.jsonContent.adviseDate;
    } else {
      this.adviseDate = this.datePipe.transform(new Date(), Constants.DATE_FORMAT_DMY);
    }
    if (this.jsonContent.issDate && this.jsonContent.issDate !== null && this.jsonContent.issDate !== '') {
      this.issDate = this.jsonContent.issDate;
    }
  }

  manageNewProdStatEvents() {
    if (this.commonDataService.getProductCode() === Constants.PRODUCT_CODE_IU) {
      if (!this.viewMode && (Constants.OPTION_EXISTING === this.commonDataService.getOption() || this.isExistingDraftMenu)
        && (this.jsonContent.prodStatCode === '98' || this.jsonContent.prodStatCode === '78' || this.jsonContent.prodStatCode === '79')) {
          this.prodStatusObj = [
            { label: this.commonService.getTranslation('WORDING_UNDER_REVIEW'), value: '78' },
            { label: this.commonService.getTranslation('FINAL_WORDING'), value: '79'}
          ];
          this.transactionDetailsSection.get('prodStatCode').setValue('78');
          this.commonDataService.setProdStatCode('78');
        } else if (!this.viewMode && (Constants.OPTION_EXISTING === this.commonDataService.getOption() || this.isExistingDraftMenu)
        && this.iuCommonDataService.getSubProdCode() === 'STBY') {
        this.prodStatusObj = [
          { label: this.commonService.getTranslation('DISCREPANT'), value: '12' },
          { label: this.commonService.getTranslation('AMENDED'), value: '08'},
          { label: this.commonService.getTranslation('AMENDMENT_AWAITING_BENEFICIARY_APPROVAL'), value: '31'},
          { label: this.commonService.getTranslation('SETTLED'), value: '05'},
          { label: this.commonService.getTranslation('EXPIRED'), value: '42'},
          { label: this.commonService.getTranslation('PURGED'), value: '10'},
          { label: this.commonService.getTranslation('UPDATED'), value: '07'},
          { label: this.commonService.getTranslation('AMENDMENT_REFUSED'), value: '32'},
          { label: this.commonService.getTranslation('EXTENDED'), value: '09'},
          { label: this.commonService.getTranslation('ACCEPTED'), value: '04'},
          { label: this.commonService.getTranslation('PARTIALLY_SETTLED'), value: '13'},
          { label: this.commonService.getTranslation('CANCELLED'), value: '06'},
          { label: this.commonService.getTranslation('ADVISE_OF_BILL_ARRIVAL_CLEAN'), value: '26'},
          { label: this.commonService.getTranslation('PARTIAL_SIGHT_PAYMENT'), value: '14'},
          { label: this.commonService.getTranslation('SIGHT_PAYMENT'), value: '15'},
          { label: this.commonService.getTranslation('CANCEL_AWAITING_COUNTERPARTY_RESPONSE'), value: '81'},
          { label: this.commonService.getTranslation('CANCEL_REFUSED'), value: '82'},
          { label: this.commonService.getTranslation('NOTIFICATION_OF_CHARGES'), value: '16'},
          { label: this.commonService.getTranslation('REQUEST_FOR_SETTLEMENT'), value: '24'}
        ];
      } else if (!this.viewMode && (Constants.OPTION_EXISTING === this.commonDataService.getOption() || this.isExistingDraftMenu)
        && this.iuCommonDataService.getSubProdCode() !== 'STBY') {
        this.prodStatusObj = [
          { label: this.commonService.getTranslation('AMENDED'), value: '08'},
          { label: this.commonService.getTranslation('AMENDMENT_AWAITING_BENEFICIARY_APPROVAL'), value: '31'},
          { label: this.commonService.getTranslation('CLAIM_PRESENTATION'), value: '84'},
          { label: this.commonService.getTranslation('CLAIM_SETTLEMENT'), value: '85'},
          { label: this.commonService.getTranslation('EXPIRED'), value: '42'},
          { label: this.commonService.getTranslation('PURGED'), value: '10'},
          { label: this.commonService.getTranslation('UPDATED'), value: '07'},
          { label: this.commonService.getTranslation('AMENDMENT_REFUSED'), value: '32'},
          { label: this.commonService.getTranslation('EXTENDED'), value: '09'},
          { label: this.commonService.getTranslation('ACCEPTED'), value: '04'},
          { label: this.commonService.getTranslation('CANCELLED'), value: '06'},
          { label: this.commonService.getTranslation('RELEASED'), value: '11'},
          { label: this.commonService.getTranslation('CANCEL_AWAITING_COUNTERPARTY_RESPONSE'), value: '81'},
          { label: this.commonService.getTranslation('CANCEL_REFUSED'), value: '82'},
          { label: this.commonService.getTranslation('NOTIFICATION_OF_CHARGES'), value: '16'},
          { label: this.commonService.getTranslation('REQUEST_FOR_SETTLEMENT'), value: '24'}
        ];
      }
    } else if (this.commonDataService.getProductCode() === Constants.PRODUCT_CODE_RU) {
      if (!this.viewMode && (Constants.OPTION_EXISTING === this.commonDataService.getOption() || this.isExistingDraftMenu)
      && this.iuCommonDataService.getSubProdCode() === 'STBY') {
      this.prodStatusObj = [
        { label: this.commonService.getTranslation('DISCREPANT'), value: '12' },
        { label: this.commonService.getTranslation('AMENDED'), value: '08'},
        { label: this.commonService.getTranslation('AMENDMENT_AWAITING_BENEFICIARY_APPROVAL'), value: '31'},
        { label: this.commonService.getTranslation('EXPIRED'), value: '42'},
        { label: this.commonService.getTranslation('PURGED'), value: '10'},
        { label: this.commonService.getTranslation('UPDATED'), value: '07'},
        { label: this.commonService.getTranslation('AMENDMENT_REFUSED'), value: '32'},
        { label: this.commonService.getTranslation('EXTENDED'), value: '09'},
        { label: this.commonService.getTranslation('ACCEPTED'), value: '04'},
        { label: this.commonService.getTranslation('CANCELLED'), value: '06'},
        { label: this.commonService.getTranslation('ADVISE_OF_BILL_ARRIVAL_CLEAN'), value: '26'},
        { label: this.commonService.getTranslation('CANCEL_AWAITING_COUNTERPARTY_RESPONSE'), value: '81'},
        { label: this.commonService.getTranslation('CANCEL_REFUSED'), value: '82'},
        { label: this.commonService.getTranslation('NOTIFICATION_OF_CHARGES'), value: '16'},
      ];
    } else if (!this.viewMode && (Constants.OPTION_EXISTING === this.commonDataService.getOption() || this.isExistingDraftMenu)
      && this.iuCommonDataService.getSubProdCode() !== 'STBY') {
      this.prodStatusObj = [
        { label: this.commonService.getTranslation('AMENDED'), value: '08'},
        { label: this.commonService.getTranslation('AMENDMENT_AWAITING_BENEFICIARY_APPROVAL'), value: '31'},
        { label: this.commonService.getTranslation('EXPIRED'), value: '42'},
        { label: this.commonService.getTranslation('PURGED'), value: '10'},
        { label: this.commonService.getTranslation('UPDATED'), value: '07'},
        { label: this.commonService.getTranslation('AMENDMENT_REFUSED'), value: '32'},
        { label: this.commonService.getTranslation('EXTENDED'), value: '09'},
        { label: this.commonService.getTranslation('ACCEPTED'), value: '04'},
        { label: this.commonService.getTranslation('CANCELLED'), value: '06'},
        { label: this.commonService.getTranslation('RELEASED'), value: '11'},
        { label: this.commonService.getTranslation('CANCEL_AWAITING_COUNTERPARTY_RESPONSE'), value: '81'},
        { label: this.commonService.getTranslation('CANCEL_REFUSED'), value: '82'},
        { label: this.commonService.getTranslation('NOTIFICATION_OF_CHARGES'), value: '16'},
      ];
    }
    }
    this.setProdStatDetails();
  }

  setProdStatDetails() {
    if (this.isExistingDraftMenu && this.jsonContent.prodStatCode !== '') {
      this.transactionDetailsSection.get('prodStatCode').setValue(this.jsonContent.prodStatCode);
      this.commonDataService.setProdStatCode(this.jsonContent.prodStatCode);
    }
    let bgExpDate ;
    if (this.commonDataService.getProductCode() === 'BG') {
    bgExpDate = this.jsonContent.bgExpDate ;
  } else if (this.commonDataService.getProductCode() === 'BR') {
    bgExpDate = this.jsonContent.expDate ;
  }
    const purged = this.commonService.getTranslation('PURGED');
    if (!this.viewMode && !this.commonService.compareExpirydatewithCurrentDate(bgExpDate) && (
    Constants.OPTION_EXISTING === this.commonDataService.getOption() || this.isExistingDraftMenu)) {
      const index = this.prodStatusObj.findIndex(x => x.label === purged);
      if (index > -1) {
        this.prodStatusObj.splice(index, 1);
      }
    }
  }

  onProdStatChange(event) {
    this.commonDataService.setProdStatCode(event);
    this.prodStatus.emit(event);
  }

  generatePdf(generatePdfService) {
    if (this.commonDataService.getProductCode() === Constants.PRODUCT_CODE_RU && this.jsonContent.tnxTypeCode === '01') {
      generatePdfService.setSectionDetails('HEADER_TRANSACTION_BRIEF', true, false, 'ruUnsignedTransactionDetails');

    } else {
    generatePdfService.setSectionDetails('HEADER_TRANSACTION_BRIEF', true, false, 'transactionDetailsView');
    }
  }
  getTnxTypeCode(tnxTypeCode) {
    let tnxType = this.commonDataService.getTnxTypeCode(tnxTypeCode);
    if (this.jsonContent.tnxTypeCode === Constants.TYPE_AMEND &&
      (this.jsonContent.subTnxTypeCode !== '' || this.jsonContent.subTnxTypeCode !== null)) {
        let subTnxType = this.jsonContent.subTnxTypeCode;
        subTnxType = this.commonDataService.getTnxSubTypeCode(subTnxType);
        tnxType += `(${subTnxType})`;
    }
    return tnxType;
    }

  showTwoColumnPreview(refId): void {
    const host = window.location.origin;
    let url = host + this.commonService.getBaseServletUrl();
    url += Constants.PREVIEW_POPUP_SCREEN;
    const prodCode = this.commonDataService.getProductCode();
    let myWindow;
    const isBRamend = (this.jsonContent.productCode === Constants.PRODUCT_CODE_RU && this.jsonContent.prodStatCode === '08');
    const isBGamend = (this.jsonContent.productCode === Constants.PRODUCT_CODE_IU && this.jsonContent.prodStatCode === '08');
    if (isBRamend || isBGamend || (this.jsonContent.tnxTypeCode === Constants.TYPE_AMEND &&
        (this.jsonContent.subTnxTypeCode === '01' || this.jsonContent.subTnxTypeCode === '02' ||
        this.jsonContent.subTnxTypeCode === '03'))) {
      const tnxId = this.jsonContent.tnxId;
      const tnxType = this.jsonContent.tnxTypeCode;
      const subTnxType = this.jsonContent.subTnxTypeCode;
      url += `/?option=FULL&referenceid=${refId}`;
      url += `&tnxid=${tnxId}`;
      url += `&productcode=${prodCode}&tnxtype=${tnxType}`;
      if (subTnxType && subTnxType != null && subTnxType !== '') {
        url += `&subtnxtype=${subTnxType}`;
      }
      if (isBRamend || isBGamend) {
        const prodStatCode = this.jsonContent.prodStatCode;
        url += `&prodStatCode=${prodStatCode}`;
      }
      myWindow = window.open(url,
        Constants.TRANSACTION_POPUP, Constants.TRANSACTION_POPUP_PROPERTIES);
      }
    myWindow.focus();
  }

  showDailog(refId): void {
    const host = window.location.origin;
    let url = host + this.commonService.getBaseServletUrl();
    url += Constants.PREVIEW_POPUP_SCREEN;
    const prodCode = this.commonDataService.getProductCode();
    let myWindow;
    if (this.commonDataService.getOption() === Constants.SCRATCH || (Constants.MODE_DRAFT === this.commonDataService.getMode()
    && this.jsonContent.tnxTypeCode !== Constants.TYPE_REPORTING) || this.jsonContent.subTnxStatCode === Constants.TYPE_STOPOVER ||
    (this.commonDataService.getOption() !== Constants.OPTION_EXISTING && this.iuCommonDataService.getMode() === 'UNSIGNED' &&
     this.jsonContent.tnxTypeCode === Constants.TYPE_NEW)) {
      const tnxId = this.jsonContent.tnxId;
      myWindow = window.open(`${url}?option=FULL&referenceid=${refId}&productcode=${prodCode}&tnxid=${tnxId}`,
        Constants.TRANSACTION_POPUP, Constants.TRANSACTION_POPUP_PROPERTIES);
    } else if (this.commonDataService.getOption() === Constants.OPTION_EXISTING
    || (this.commonDataService.getOption() === Constants.OPTION_REJECTED)
    || (Constants.MODE_DRAFT === this.commonDataService.getMode() && this.jsonContent.tnxTypeCode === Constants.TYPE_REPORTING)
    || (this.commonDataService.getOption() !== Constants.OPTION_EXISTING && this.iuCommonDataService.getMode() === 'UNSIGNED' &&
    this.jsonContent.tnxTypeCode !== Constants.TYPE_NEW)) {
      myWindow = window.open(`${url}?option=FULL&referenceid=${refId}&productcode=${prodCode}`,
      Constants.TRANSACTION_POPUP, Constants.TRANSACTION_POPUP_PROPERTIES);
    }
    myWindow.focus();
  }
  collapsePanel() {
    this.collapse = !this.collapse;
  }

}
