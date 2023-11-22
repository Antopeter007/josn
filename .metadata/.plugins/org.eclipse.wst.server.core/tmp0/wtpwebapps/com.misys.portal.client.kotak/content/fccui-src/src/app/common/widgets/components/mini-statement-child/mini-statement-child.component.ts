import { DatePipe } from '@angular/common';
import { PdfConstants } from './../../../core/pdfConstants';
import { CustomCommasInCurrenciesPipe } from './../../../../corporate/trade/lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { DropdownFormControl, ImgControl } from './../../../../base/model/form-controls.model';
import { DashboardService } from './../../../services/dashboard.service';
import { Component, OnInit, EventEmitter, Output, Input, OnChanges } from '@angular/core';
import { FCCFormGroup } from '../../../../base/model/fcc-control.model';
import {
  TextControl,
  ImageFormControl,
  InputTextControl
} from '../../../../base/model/form-controls.model';
import { TranslateService } from '@ngx-translate/core';
import { FccGlobalConstantService } from '../../../core/fcc-global-constant.service';
import { CommonService } from '../../../services/common.service';
import { FCCBase } from '../../../../base/model/fcc-base';
import { SelectItem } from 'primeng/api';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { FccGlobalConstant } from '../../../../common/core/fcc-global-constants';
import * as moment from 'moment';
import 'isomorphic-fetch';
import 'moment-timezone';
import { arabicBoldArial } from '../../../../common/fonts/arabic-bold-arial';
import { arabicNormalCourier } from '../../../../common/fonts/arabic-normal-courier';
import { arabicBoldCourier } from '../../../../common/fonts/arabic-bold-courier';
import { arabicNormalArial } from '../../../../common/fonts/arabic-normal-arial';
import { iif, Observable } from 'rxjs';
import { UtilityService } from '../../../../corporate/trade/lc/initiation/services/utility.service';
import { HOST_COMPONENT } from './../../../../shared/FCCform/form/form-resolver/form-resolver.directive';
import { FccPdfStylesService } from '../../../../common/core/fcc-pdf-styles-constants.service';

@Component({
  selector: 'app-mini-statement-child',
  templateUrl: './mini-statement-child.component.html',
  styleUrls: ['./mini-statement-child.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: MiniStatementChildComponent }]
})
export class MiniStatementChildComponent extends FCCBase implements OnInit, OnChanges {

  @Input() entityId = '';
  @Output() selectedTransactionType = new EventEmitter<string>();
  module = '';
  contextPath: any;
  form: FCCFormGroup;
  currency: [];
  patchFieldParameters: any;
  accountNo: [];
  accounts: SelectItem[] = [];
  accountBalanceId: string;
  accountData = true;
  valueupdated;
  fromdate: string;
  todate: string;
  formattedDate;
  pdfDataList = [];
  monthsDifference: string;
  highestBalance = [];
  accountIdPDF: string;
  pdfCount = 0;
  pdfFormattedDate;
  rowCount: string;
  totalBalanceCount = 0;
  i = 0;
  doc;
  id = 'id';
  statementTypes: any;
  dateFormat: string;

  configurePath: string;
  resultImage;
  imageExtension: boolean;

  col = [`${this.translateService.instant('postdate')}`,
  `${this.translateService.instant('valueDate')}`,
  `${this.translateService.instant('Description')}`,
  `${this.translateService.instant('transactionType')}`];


  AccCol = [`${this.translateService.instant('acc')}`,
  `${this.translateService.instant('Ledgerbalance')}`,
  `${this.translateService.instant('availableBal')}`,
  `${this.translateService.instant('status')}`,
  `${this.translateService.instant('Accounttype')}`,
  `${this.translateService.instant('accountName')}`];


  accountDetails = new Map();
  accountStatments = new Map();
  accountBalance = new Map();

  path;
  bankAddress;
  base64result: string;

  // variables used for PDF
  private remainingTableHeight = PdfConstants.REMAINING_TABLE_HEIGHT;
  private remainingHeight = PdfConstants.REMAINING_TABLE_HEIGHT;
  private rowsInRemainingPage = PdfConstants.ROWS_IN_REMAINING_PAGE;
  private remaingTableRows = PdfConstants.REMAINING_TABLE_ROWS;
  public arabicEncoding = /[\u0600-\u06FF\u0750-\u077F]/;
  private pageHeight;
  rows = [];
  private ycord;
  logoConfig = {
    xcord: PdfConstants.X_CORD_60,
    ycord: PdfConstants.Y_CORD_100,
    length: 100,
    width: 60
  };
  public watermarkImage;
  watermarkImageExtension: boolean;
  readonly nextLine = PdfConstants.NEXT_LINE_10;
  readonly xcord = PdfConstants.X_CORD_10;
  public setTextOption = {};
  watermarkConfig = {
    xcord: PdfConstants.X_CORD_40,
    ycord: PdfConstants.Y_CORD_100,
    length: PdfConstants.LENGTH_650,
    width: PdfConstants.WIDTH_850
  };

  @Output() accountNumber = new EventEmitter<any>();
  @Output() accountDataPresent = new EventEmitter<any>();

  constructor(protected translateService: TranslateService,
              protected fccGlobalConstantService: FccGlobalConstantService,
              protected commonService: CommonService,
              protected dashboardService: DashboardService, protected pdfStylesService: FccPdfStylesService,
              protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe,
              public datepipe: DatePipe, protected utilityService: UtilityService) {
    super();
  }

  ngOnInit() {
    this.statementTypes = [
      { label: `${this.translateService.instant('all')}`, value: 'all' },
      { label: `${this.translateService.instant('credit')}`, value: 'credit' },
      { label: `${this.translateService.instant('debit')}`, value: 'debit' },
    ];
    this.contextPath = this.fccGlobalConstantService.contextPath;
    this.initializeFormGroup();
    this.form.get('statementType').setValue(this.statementTypes[0].value);
    this.selectedTransactionType.emit(this.statementTypes[0].value);
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.configurePath = this.contextPath + response.pdfImagePath;
        this.patchFieldParameters(this.form.get('backGroundImage'), {
          path: this.contextPath + response.ministatementImageFilePath
        });
        this.patchFieldParameters(this.form.get('backGroundImage'), {
          altText: this.translateService.instant('C102_Mini_Statement_*_*')
        });
        this.dateFormat = response.pdfDateFormat;
        this.bankAddress = response.bankAdressMiniStmt;
        this.monthsDifference = response.Minimonth.toString();
        this.rowCount = response.MiniCount.toString();
        this.caluculateDate();
        this.commonService.getBase64FDataFromFile(this.configurePath)
          .then(async result => {
            this.resultImage = result;
            if (this.resultImage.indexOf('charset=UTF-8;') !== -1) {
              this.resultImage = this.resultImage.replace('charset=UTF-8;', '');
              this.resultImage = this.resultImage.replace(/\s/g, '');
            }
            if (this.configurePath.indexOf('.svg') > -1) {
              this.imageExtension = true;
            } else {
              this.imageExtension = false;
            }
          })
          .catch(err => console.error(err));
        const watermarkImagePath = this.contextPath + response.pdfWatermarkImagePath;
        this.commonService.getBase64FDataFromFile(watermarkImagePath)
          .then(async result => {
            this.watermarkImage = result;
            if (this.watermarkImage.indexOf('charset=UTF-8;') !== -1) {
              this.watermarkImage = this.watermarkImage.replace('charset=UTF-8;', '');
              this.watermarkImage = this.watermarkImage.replace(/\s/g, '');
            }
            if (this.watermarkImage.indexOf('.svg') > -1) {
              this.watermarkImageExtension = true;
            } else {
              this.watermarkImageExtension = false;
            }
          })
          .catch(err => console.error(err));
      }
    });
    this.commonService.loadPdfConfiguration().subscribe(response => {
        if (response) {
          this.pdfStylesService.setProductCodeFont(response.pdfProductCodeFont);
          this.pdfStylesService.setProductCodeFontSize(response.pdfProductCodeFontSize);
          this.pdfStylesService.setProductCodeFontColour(response.pdfProductCodeFontColour);

          this.pdfStylesService.setSubProductCodeFont(response.pdfSubProductCodeFont);
          this.pdfStylesService.setSubProductCodeFontSize(response.pdfSubProductCodeFontSize);
          this.pdfStylesService.setSubProductCodeFontColour(response.pdfSubProductCodeFontColour);

          this.pdfStylesService.setBankAddressFontSize(response.pdfBankAddressFontSize);
          this.pdfStylesService.setBankAddressFont(response.pdfBankAddressFont);
          this.pdfStylesService.setBankAddressFontColour(response.pdfBankAddressFontColour);

          this.pdfStylesService.setLeftBarColour(response.pdfLeftBarColour);
          this.pdfStylesService.setLeftBarWidth(response.pdfLeftBarWidth);

          this.pdfStylesService.setLeftBarTextFontColour(response.pdfLeftBarTextColour);
          this.pdfStylesService.setLeftBarTextFontSize(response.pdfLeftBarTextSize);
          this.pdfStylesService.setLeftBarTextFont(response.pdfLeftBarTextFont);
          this.pdfStylesService.setLeftBarTextFontStyle(response.pdfLeftBarTextFontStyle);

          this.pdfStylesService.setSectionHeaderFontSize(response.pdfSectionHeaderFontSize);
          this.pdfStylesService.setSectionHeaderFont(response.pdfSectionHeaderFont);
          this.pdfStylesService.setSectionHeaderFontStyle(response.pdfSectionHeaderFontStyle);
          this.pdfStylesService.setSectionHeaderFontColour(response.pdfSectionHeaderFontColour);

          this.pdfStylesService.setSubSectionHeaderFontSize(response.pdfSubSectionHeaderFontSize);
          this.pdfStylesService.setSubSectionHeaderFont(response.pdfSubSectionHeaderFont);
          this.pdfStylesService.setSubSectionHeaderFontStyle(response.pdfSubSectionHeaderFontStyle);
          this.pdfStylesService.setSubSectionHeaderFontColour(response.pdfSubSectionHeaderFontColour);

          this.pdfStylesService.setSectionLabelFontSize(response.pdfSectionLabelFontSize);
          this.pdfStylesService.setSectionLabelFont(response.pdfSectionLabelFont);
          this.pdfStylesService.setSectionLabelFontColour(response.pdfSectionLabelFontColour);
          this.pdfStylesService.setSectionLabelFontStyle(response.pdfSectionLabelFontStyle);

          this.pdfStylesService.setSectionContentFontSize(response.pdfSectionContentFontSize);
          this.pdfStylesService.setSectionContentFont(response.pdfSectionContentFont);
          this.pdfStylesService.setSectionContentFontColour(response.pdfSectionContentFontColour);
          this.pdfStylesService.setSectionContentFontStyle(response.pdfSectionContentFontStyle);

          this.pdfStylesService.setRightBarColour(response.pdfRightBarColour);
          this.pdfStylesService.setRightBarWidth(response.pdfRightBarWidth);

          this.pdfStylesService.setFooterFont(response.pdfFooterFont);
          this.pdfStylesService.setFooterFontSize(response.pdfFooterFontSize);
          this.pdfStylesService.setFooterFontColour(response.pdfFooterFontColour);

          this.pdfStylesService.setShowHeader(response.pdfHeaderShow);
          this.pdfStylesService.setShowFooter(response.pdfFooterShow);
          this.pdfStylesService.setShowLogo(response.pdfLogoShow);
          this.pdfStylesService.setShowLeftBar(response.pdfLeftBarShow);
          this.pdfStylesService.setShowWatermark(response.pdfWatermarkShow);
          this.pdfStylesService.setShowLogoAllPages(response.pdfLogoShowAllPages);

          this.pdfStylesService.setTableFont(response.pdfTableFont);
          this.pdfStylesService.setTableFontSize(response.pdfTableFontSize);
          this.pdfStylesService.setTableFontColour(response.pdfTableFontColour);
          this.pdfStylesService.setTableFontStyle(response.pdfTableFontStyle);
          this.pdfStylesService.setTableHeaderBackgroundColour(response.pdfTableHeaderBackgroundColour);
          this.pdfStylesService.setTableHeaderTextColour(response.pdfTableHeaderTextColour);
        }
    });
    this.fetchUserTimeZone();
  }

  ngOnChanges() {
    this.fetchUserAccounts();
  }

  caluculateDate() {
    const date = new Date();
    this.todate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    date.setMonth(date.getMonth() - +this.monthsDifference);
    this.fromdate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
  }

  formatDate(timeZoneresponse) {
    const timezone = timeZoneresponse.userPreferences.timezone.replace('&#x2f;', '/');
    const formatdt = this.utilityService.transformDateTimeFormat(moment.tz(timezone));
    this.pdfFormattedDate = this.utilityService.transformDateTimeFormat(moment.tz(timezone));
    this.formattedDate = `${this.translateService.instant('asOn')}` + ' ' + formatdt;
    this.patchFieldParameters(this.form.get('msheader'),
    { label: `${this.translateService.instant('miniStatement')} <br/><div class="miniStmtDate"> ` + this.formattedDate + `</div>` });
  }

  fetchUserTimeZone() {

    this.dashboardService.getUserTimeZone().subscribe(
      response => {
        this.formatDate(response);
      }
    );

  }
  fetchUserAccounts() {
    iif(() => this.entityId.length > 0,
      this.getUserAccountsByEntityId(),
      this.allUserAccounts()
    ).subscribe(
      response => {
        this.accounts = [];
        this.highestBalance = [];
        this.totalBalanceCount = 0;
        if (response.items.length > 0) {
          this.accountData = true;
          this.accountDataPresent.emit(this.accountData);
          response.items.forEach(
            value => {
              const account: { label: string, value: any } = {
                label: value.number,
                value: {
                  accountNo: value.number,
                  id: value.id,
                  currency: value.currency,
                  type: value.type,
                  accountContext: value.accountContext ? value.accountContext : ''
                }
              };
              this.accounts.push(account);
          });
          this.patchFieldParameters(this.form.get('accountNo'), { options: this.accounts });
          this.accounts.forEach(data => {
            this.dashboardService.getUserAccountBalance(data.value.id).subscribe(data1 => {
              this.totalBalanceCount++;
              const highbal: { accnum: string, amount: any } = {
                accnum: data1.number,
                amount: data1.availableBalance
              };
              this.highestBalance.push(highbal);
              this.balanceMatch();
            });
          });
          this.showAll();
        } else {
          this.accountData = false;
          this.accountDataPresent.emit(this.accountData);
          this.hideAll();
        }
      });
  }

  hideAll(){
    this.patchFieldParameters(this.form.get('detailStatement'), { rendered: false });
    this.patchFieldParameters(this.form.get('accountNo'), { rendered: false });
    this.patchFieldParameters(this.form.get('currency'), { rendered: false });
    this.patchFieldParameters(this.form.get('avlBalanceHeader'), { rendered: false });
    this.patchFieldParameters(this.form.get('statementType'), { rendered: false });
    this.patchFieldParameters(this.form.get('avlBalance'), { rendered: false });
    this.patchFieldParameters(this.form.get('recentTransactionHeader'), { rendered: false });
    this.patchFieldParameters(this.form.get('download'), { rendered: false });
  }

  showAll(){
    this.patchFieldParameters(this.form.get('detailStatement'), { rendered: true });
    this.patchFieldParameters(this.form.get('accountNo'), { rendered: true });
    this.patchFieldParameters(this.form.get('currency'), { rendered: true });
    this.patchFieldParameters(this.form.get('avlBalanceHeader'), { rendered: true });
    this.patchFieldParameters(this.form.get('statementType'), { rendered: true });
    this.patchFieldParameters(this.form.get('avlBalance'), { rendered: true });
    this.patchFieldParameters(this.form.get('recentTransactionHeader'), { rendered: true });
    this.patchFieldParameters(this.form.get('download'), { rendered: true });
  }

  allUserAccounts(): Observable<any> {
    return this.dashboardService.getUserAccount();
  }

  getUserAccountsByEntityId(): Observable<any> {
    return this.dashboardService.getUserAccountsByEntityId(this.entityId);
  }

  balanceMatch() {

    if (this.accounts.length === this.totalBalanceCount) {
      this.highestBalance.sort((a, b) => (a.amount > b.amount) ? -1 : 1);

      const item1 = this.accounts.find(i => i.label === this.highestBalance[0].accnum);

      this.accountNumber.emit(item1.value);
      this.form.get('accountNo').setValue(item1.value);
      this.patchFieldValueAndParameters(this.form.get('currency'), item1.value.currency,
        { readonly: true });
      this.accountIdPDF = item1.value.id;
      this.fetchAvlBalance(item1.value.id,
        item1.value.currency);

      if (this.accounts.length === 1) {
        this.patchFieldParameters(this.form.get('accountNo'), { autoDisplayFirst: true });
        this.patchFieldParameters(this.form.get('accountNo'), { readonly: true });
      } else {
        this.patchFieldParameters(this.form.get('accountNo'), { readonly: false });
        this.patchFieldParameters(this.form.get('accountNo'), { autoDisplayFirst: false });
      }


    }

  }



// eslint-disable-next-line @typescript-eslint/no-unused-vars
  fetchAvlBalance(balanceId, currency) {
    this.accountBalanceId = balanceId;
    this.dashboardService.getUserAccountBalance(this.accountBalanceId).subscribe(data => {
      this.patchFieldValueAndParameters(this.form.get('avlBalance'), data.availableBalance,
        { readonly: true });
    });
  }

  initializeFormGroup() {
    this.form = new FCCFormGroup({
      backGroundImage: new ImageFormControl('backGroundImage', this.translateService, {
        layoutClass: 'p-col-2 p-md-4 miniStatementImage',
        anchorNeeded: false,
        rendered: true
      }),
      msheader: new TextControl('msheader', this.translateService, {
        label: `${this.translateService.instant('miniStatement')}`,
        rendered: true,
        layoutClass: 'p-col-10 p-md-8 miniheader',
        styleClass: ['msheader'],
        tabIndex: '-1'
      }),
      download: new ImgControl('download', this.translateService, {
        label: `  ${this.translateService.instant('download')}`,
        rendered: true,
        key: 'itemId',
        styleClass: ['download'],
        itemId: 'download',
        downloadicon: 'downloadicon',
        title: 'Download',
        layoutClass: 'p-col-12 downloadmini'
      }),
      accountNo: new DropdownFormControl('accountNo', '', this.translateService, {
        label: `${this.translateService.instant('acc')}`,
        options: this.accounts,
        key: 'accountNo',
        styleClass: ['fcc-ui-dropdown'],
        rendered: true,
        layoutClass: 'p-col-7 accountNoLayout',
      }),
      currency: new InputTextControl('currency', '', this.translateService, {
        label: `${this.translateService.instant('cur')}`,
        rendered: true,
        layoutClass: 'p-col-5 currencyLayout',
        styleClass: 'currency',
      }),
      avlBalanceHeader: new TextControl('avlBalanceHeader', this.translateService, {
        label: `${this.translateService.instant('avlBalanceHeader')}`,
        rendered: true,
        layoutClass: 'p-col-12 BalanceHeader',
        styleClass: ['avlBalanceHeader']
      }),
      avlBalance: new InputTextControl('avlBalance', '', this.translateService, {
        label: `${this.translateService.instant('avlBalanceHeader')}`,
        hideLabel: true,
        valueOnly: true,
        rendered: true,
        layoutClass: 'p-col-12 avlBalance1',
        styleClass: ['avlBalance']
      }),
      recentTransactionHeader: new TextControl('recentTransactionHeader', this.translateService, {
        label: `${this.translateService.instant('recentTransactionHeader')}`,
        rendered: true,
        layoutClass: 'p-col-8 transactionHeader',
        styleClass: ['recentTransactionHeader']
      }),
      statementType: new DropdownFormControl('statementType', '', this.translateService, {
        label: `${this.translateService.instant('statementType')}`,
        options: this.statementTypes,
        key: 'statementType',
        styleClass: ['fcc-ui-dropdown'],
        rendered: true,
        layoutClass: 'p-col-4 statementTypeLayout',
      }),
    });
    if (this.dir === FccGlobalConstant.LANUGUAGE_DIR_ARABIC) {
      this.patchFieldParameters(this.form.get('download'), { layoutClass: 'p-col-12 downloadminiArabic' });
    } else {
      this.patchFieldParameters(this.form.get('download'), { layoutClass: 'p-col-12 downloadmini' });
    }
    this.form.get("currency").disable();
  }

  onClickAccountNo(event) {
    if (event.value !== undefined) {
      this.accountIdPDF = event.value.id;
      this.accountNumber.emit(event.value);
      this.patchFieldValueAndParameters(this.form.get('currency'), event.value.currency,
        { readonly: true });
      this.fetchAvlBalance(event.value.id, event.value.currency);
    }
  }

  onClickStatementType(event) {
    if (event.value !== undefined) {
      this.selectedTransactionType.emit(event.value);
    }
  }

  // download part
  onClickDownload() {
    this.accountDetails = new Map();
    this.accounts.forEach(data1 => {
      if (data1.value.accountNo === this.form.get('accountNo').value.accountNo) {
        this.dashboardService.getAccountDetails(data1.value.id).subscribe(element => {
          this.accountDetails.set(data1.value.id, element);
        });

        this.dashboardService.getUserAccountBalance(data1.value.id).subscribe(data => {
          this.accountBalance.set(data1.value.id, data);
        });
        this.dashboardService.getAccountStatment('', this.fromdate, this.todate, data1.value.id,
        this.form.get('statementType').value, this.entityId)
          .subscribe(data => {
            this.accountStatments.set(data1.value.id, data.slice(0, +this.rowCount));
            const accStatementData = this.accountStatments.get(data1.value.id).filter(item => item.transactionType);
            this.accountStatments.set(data1.value.id, accStatementData);
            this.formatPDFData();
          });
      }
    });
  }

  addFontArabic() {
    if (!this.doc.existsFileInVFS(PdfConstants.ARABIC_BOLD_ARIAL_TTF)) {
      this.doc.addFileToVFS(PdfConstants.ARABIC_BOLD_ARIAL_TTF, arabicBoldArial);
      this.doc.addFont(PdfConstants.ARABIC_BOLD_ARIAL_TTF, PdfConstants.ARABIC_BOLD_ARIAL, PdfConstants.FONT_STYLE_BOLD);
    }
    if (!this.doc.existsFileInVFS(PdfConstants.ARABIC_NORMAL_COURIER_TTF)) {
      this.doc.addFileToVFS(PdfConstants.ARABIC_NORMAL_COURIER_TTF, arabicNormalCourier);
      this.doc.addFont(PdfConstants.ARABIC_NORMAL_COURIER_TTF, PdfConstants.ARABIC_NORMAL_COURIER, PdfConstants.FONT_STYLE_NORMAL);
    }
    if (!this.doc.existsFileInVFS(PdfConstants.ARABIC_BOLD_COURIER_TTF)) {
      this.doc.addFileToVFS(PdfConstants.ARABIC_BOLD_COURIER_TTF, arabicBoldCourier);
      this.doc.addFont(PdfConstants.ARABIC_BOLD_COURIER_TTF, PdfConstants.ARABIC_BOLD_COURIER, PdfConstants.FONT_STYLE_BOLD);
    }
    if (!this.doc.existsFileInVFS(PdfConstants.ARABIC_NORMAL_ARIAL_TTF)) {
      this.doc.addFileToVFS(PdfConstants.ARABIC_NORMAL_ARIAL_TTF, arabicNormalArial);
      this.doc.addFont(PdfConstants.ARABIC_NORMAL_ARIAL_TTF, PdfConstants.ARABIC_NORMAL_ARIAL, PdfConstants.FONT_STYLE_NORMAL);
    }
  }

  formatPDFData() {
    this.doc = new jsPDF('p', 'pt');
    if (this.dir === FccGlobalConstant.LANUGUAGE_DIR_ARABIC) {
      this.addFontArabic();
      this.setTextOption = { align: PdfConstants.ALIGN_RIGHT, lang: PdfConstants.LANGUAGE_AR };
      this.logoConfig.xcord = PdfConstants.X_CORD_445_AR;
      this.AccCol.reverse();
    }
    this.addBackgroundImage();
    this.setHeader();
    this.addHeaderImage();
    this.addRightBar();
    this.addLeftBorder();
    this.setTableFontFormat();

    this.ycord = this.ycord + (this.nextLine * PdfConstants.Y_COORD_GAP_6);
    const pageHeightSub = PdfConstants.PAGE_HEIGHT_SUB_80;
    this.pageHeight = this.doc.internal.pageSize.height - pageHeightSub;

    for (const accountID of this.accountDetails.keys()) {


      const SingleAccountDetail = this.accountDetails.get(accountID);
      const SingAccountStatment = this.accountStatments.get(accountID);
      const SingAccountBalance = this.accountBalance.get(accountID);
      if (this.col.indexOf(`${this.translateService.instant('transactionAmountIn')}` + '(' + SingleAccountDetail.currency + ')') === -1) {
        this.col.push(`${this.translateService.instant('transactionAmountIn')}` + '(' + SingleAccountDetail.currency + ')');
      }
      if (this.dir === FccGlobalConstant.LANUGUAGE_DIR_ARABIC) {
        this.col.reverse();
      }
      const yCoOrdGap = PdfConstants.Y_COORD_GAP_2;
      this.remainingHeight = this.ycord + (this.nextLine * yCoOrdGap * (1 + 1));

      this.createHeadTable(SingleAccountDetail, SingAccountBalance);
      this.ycord = this.ycord + this.nextLine * yCoOrdGap;
      this.createStatmentTable(SingAccountStatment, SingleAccountDetail);
      if(SingAccountStatment.length == 0) {
        this.setEmptyStatementMessage();
      }
      this.addLeftBorder();
      this.ycord = this.ycord + this.nextLine * yCoOrdGap;
      if (this.dir === FccGlobalConstant.LANUGUAGE_DIR_ARABIC) {
        this.col.reverse();
      }
      this.col.pop();
    }
    this.updateFooter();
    this.doc.save(`${this.translateService.instant('accountStatment')}.pdf`);

  }

  setEmptyStatementMessage() {
    this.doc.setFont(this.pdfStylesService.getTableFont());
    this.doc.setFontSize(this.pdfStylesService.getTableFontSize());
    this.doc.setTextColor(this.pdfStylesService.getTableFontColour());

    const X_CORD = this.getXcordbasedonLanguage(FccGlobalConstant.LENGTH_60, FccGlobalConstant.LENGTH_540);

    if (this.dir === FccGlobalConstant.LANUGUAGE_DIR_ARABIC) {
      this.checkArabicFont(`${this.translateService.instant('miniStatmentNoData')}`, PdfConstants.FONT_STYLE_NORMAL);
    } else {
      this.doc.setFont(this.pdfStylesService.getTableFont(), PdfConstants.FONT_STYLE_NORMAL);
      this.doc.setFontSize(this.pdfStylesService.getTableFontSize());
      this.doc.setTextColor(this.pdfStylesService.getTableFontColour());
    }
    this.doc.text(X_CORD,
      this.ycord,
      `${this.translateService.instant('miniStatmentNoData')}`, this.setTextOption);
    this.ycord = this.ycord + FccGlobalConstant.LENGTH_20;
  }

  addBackgroundImage() {
    if (this.pdfStylesService.getShowWatermark()) {
      if (this.watermarkImageExtension) {
        this.doc.addSvgAsImage(this.watermarkImage, this.watermarkConfig.xcord, this.watermarkConfig.ycord,
          this.watermarkConfig.length, this.watermarkConfig.width, 'watermark', 'NONE', PdfConstants.BACKGROUND_IMAGE_ROTATION);
      } else {
        this.doc.addImage(this.watermarkImage, 'JPEG', this.watermarkConfig.xcord, this.watermarkConfig.ycord,
        this.watermarkConfig.length, this.watermarkConfig.width, 'watermark', 'NONE', PdfConstants.BACKGROUND_IMAGE_ROTATION);
      }
    }
  }

  addRightBar() {
    // Draw a background colour
    this.doc.setDrawColor(this.pdfStylesService.getRightBarColour());
    this.doc.setLineWidth(this.pdfStylesService.getRightBarWidth());
    const rightbarXcord = this.getXcordbasedonLanguage(PdfConstants.RIGHT_BAR_X, PdfConstants.RIGHT_BAR_X_AR);
    this.doc.line(rightbarXcord, PdfConstants.RIGHT_BAR_Y1, rightbarXcord, PdfConstants.RIGHT_BAR_Y2);
  }

  addHeaderImage() {
    if (this.pdfStylesService.getShowLogo()) {
      if (this.imageExtension) {
        this.doc.addSvgAsImage(this.resultImage, this.logoConfig.xcord, this.logoConfig.ycord, this.logoConfig.length,
          this.logoConfig.width);
      } else {
        this.doc.addImage(this.resultImage, 'JPEG', this.logoConfig.xcord, this.logoConfig.ycord, this.logoConfig.length,
          this.logoConfig.width);
      }
    }
  }

  createFirstPartOfTable(SingAccountStatment, SingleAccountDetail) {

    this.rowsInRemainingPage = Math.round((PdfConstants.ROW_MULTIPLIER * (this.pageHeight - this.ycord)) - 1);
    const splitData = SingAccountStatment.slice(0, this.rowsInRemainingPage);
    const row = [];
    splitData.forEach(element => {
      const tempa = [this.datepipe.transform(element.transactionDate, this.dateFormat),
      this.datepipe.transform(element.Date, this.dateFormat), element.Description, element.transactionType,
      this.customCommasInCurrenciesPipe.transform(element.amount, SingleAccountDetail.currency)];
      row.push(tempa);
    });

    this.doc.autoTable(
      {
        useCss: true,
        startY: this.ycord,
        head: [this.col],
        body: row,
        margin: { left: PdfConstants.MARGIN_50 },
        theme: 'plain',
        headStyles: {
          halign: 'center', overflow: 'linebreak', fillColor: this.pdfStylesService.getTableHeaderBackgroundColour(),
        textColor: this.pdfStylesService.getTableHeaderTextColour(),
        font: this.getArabicFontIfLanguageAR(),
        fontSize: this.pdfStylesService.getTableFontSize(), fontStyle: this.pdfStylesService.getTableFontStyle()
        },
        bodyStyles: {
        halign: 'center', overflow: 'linebreak', textColor: this.pdfStylesService.getTableFontColour(),
        font: this.getArabicFontIfLanguageAR(),
        fontSize: this.pdfStylesService.getTableFontSize(),
        fontStyle: this.pdfStylesService.getTableFontStyle()
      },
      styles: { font: this.getArabicFontIfLanguageAR(), fontStyle: this.pdfStylesService.getTableFontStyle(),
         halign: PdfConstants.ALIGN_LEFT }
      });

    const yCoOrdGap = PdfConstants.Y_COORD_GAP_2;
    this.ycord = this.doc.autoTable.previous.finalY + (this.nextLine * yCoOrdGap * (splitData.length + 1));
    this.remainingTableHeight = this.ycord + (this.nextLine * yCoOrdGap * (this.remaingTableRows + 1));
  }

  createRemainingPartOfTable(SingAccountStatment, SingleAccountDetail) {
    this.addPage();
    this.setTableFontFormat();

    const splitData = SingAccountStatment.slice(this.rowsInRemainingPage, SingAccountStatment.length);
    const row = [];
    splitData.forEach(element => {
      const tempa = [this.datepipe.transform(element.transactionDate, this.dateFormat),
      this.datepipe.transform(element.Date, this.dateFormat), element.Description, element.transactionType,
      this.customCommasInCurrenciesPipe.transform(element.amount, SingleAccountDetail.currency)];
      row.push(tempa);
    });
    this.doc.autoTable(
      {
        useCss: true,
        startY: this.ycord,
        head: [this.col],
        body: row,
        margin: { left: PdfConstants.MARGIN_50 },
        theme: 'plain',
        headStyles: {
          halign: 'center', overflow: 'linebreak', fillColor: this.pdfStylesService.getTableHeaderBackgroundColour(),
        textColor: this.pdfStylesService.getTableHeaderTextColour(),
        font: this.getArabicFontIfLanguageAR(),
        fontSize: this.pdfStylesService.getTableFontSize(), fontStyle: this.pdfStylesService.getTableFontStyle()
        },
        bodyStyles: {
        halign: 'center', overflow: 'linebreak', textColor: this.pdfStylesService.getTableFontColour(),
        font: this.getArabicFontIfLanguageAR(),
        fontSize: this.pdfStylesService.getTableFontSize(),
        fontStyle: this.pdfStylesService.getTableFontStyle() },
        styles: { font: this.getArabicFontIfLanguageAR(), fontStyle: this.pdfStylesService.getTableFontStyle(),
          halign: PdfConstants.ALIGN_LEFT }
      });
    const yCoOrdGap = PdfConstants.Y_COORD_GAP_2;
    this.ycord = this.doc.autoTable.previous.finalY + (this.nextLine * yCoOrdGap * (splitData.length + 1));
    this.remainingTableHeight = this.ycord + (this.nextLine * yCoOrdGap * (this.remaingTableRows + 1));
  }


  setHeaderStyles() {
    const font = this.pdfStylesService.getSectionHeaderFont();
    const fontStyle = this.pdfStylesService.getSectionHeaderFontStyle();
    this.doc.setFont(font, fontStyle);
    this.doc.setFontSize(this.pdfStylesService.getSectionHeaderFontSize());
    this.doc.setTextColor(this.pdfStylesService.getSectionHeaderFontColour());
  }

  setSubHeaderStyles() {
    const font = this.pdfStylesService.getSubSectionHeaderFont();
    const fontStyle = this.pdfStylesService.getSubSectionHeaderFontStyle();
    this.doc.setFont(font, fontStyle);
    this.doc.setFontSize(this.pdfStylesService.getSubSectionHeaderFontSize());
    this.doc.setTextColor(this.pdfStylesService.getSubSectionHeaderFontColour());
  }

  setLabelStyles() {
    const font = this.pdfStylesService.getSectionLabelFont();
    const fontStyle = this.pdfStylesService.getSectionLabelFontStyle();
    this.doc.setFont(font, fontStyle);
    this.doc.setFontSize(this.pdfStylesService.getSectionLabelFontSize());
    this.doc.setTextColor(this.pdfStylesService.getSectionLabelFontColour());
  }

  setContentStyles() {
    const font = this.pdfStylesService.getSectionContentFont();
    const fontStyle = this.pdfStylesService.getSectionContentFontStyle();
    this.doc.setFont(font, fontStyle);
    this.doc.setFontSize(this.pdfStylesService.getSectionContentFontSize());
    this.doc.setTextColor(this.pdfStylesService.getSectionContentFontColour());
  }


  createStatmentTable(SingAccountStatment, SingleAccountDetail) {
    const yCoOrdGap = PdfConstants.Y_COORD_GAP_2;
    const row = [];
    SingAccountStatment.forEach(element => {
      const tempa = [this.datepipe.transform(element.transactionDate, this.dateFormat),
      this.datepipe.transform(element.Date, this.dateFormat), element.Description, element.transactionType,
      this.customCommasInCurrenciesPipe.transform(element.amount, SingleAccountDetail.currency)];
      if (this.dir === FccGlobalConstant.LANUGUAGE_DIR_ARABIC) {
        tempa.reverse();
      }
      row.push(tempa);
    });
    const options = {
      startY: this.ycord,
      head: [this.col],
      body: row,
      margin: { left: PdfConstants.X_CORD_60, right: PdfConstants.NUMB_30 },
      theme: 'grid',
      headStyles: {
        halign: 'center', overflow: 'linebreak', fillColor: this.pdfStylesService.getTableHeaderBackgroundColour(),
          textColor: this.pdfStylesService.getTableHeaderTextColour(),
          font: this.getArabicFontIfLanguageAR(),
          fontSize: this.pdfStylesService.getTableFontSize(), fontStyle: this.pdfStylesService.getTableFontStyle()
      },
      bodyStyles: {
        halign: 'center', overflow: 'linebreak', textColor: this.pdfStylesService.getTableFontColour(),
          font: this.getArabicFontIfLanguageAR(),
          fontSize: this.pdfStylesService.getTableFontSize(),
          fontStyle: this.pdfStylesService.getTableFontStyle()
      },
      styles: { font: this.getArabicFontIfLanguageAR(), fontStyle: this.pdfStylesService.getTableFontStyle(),
         halign: PdfConstants.ALIGN_LEFT }
    };
    if (this.dir === FccGlobalConstant.LANUGUAGE_DIR_ARABIC) {
      options.margin.left = PdfConstants.NUMB_30;
      options.margin.right = PdfConstants.MARGIN_50;
    }
    this.doc.autoTable(options);

    this.ycord = this.doc.autoTable.previous.finalY + this.nextLine * yCoOrdGap;
  }

  addPage() {
    this.doc.addPage();
    this.ycord = PdfConstants.Y_CORD_INIT_40;
    this.addLeftBorder();
    let yCoOrdGap = 2;
    if (this.pdfStylesService.getShowLogoAllPages()) {
      this.addHeaderImage();
      yCoOrdGap = PdfConstants.Y_COORD_GAP_6;
    }
    this.ycord = this.ycord + (this.nextLine * yCoOrdGap);
  }


  createHeadTable(SingleAccountDetail, SingAccountBalance) {

    const yCoOrdGap = PdfConstants.Y_COORD_GAP_4;

    const row1 = [];
    const temp = [SingleAccountDetail.number, SingleAccountDetail.currency + ' ' + SingAccountBalance.ledgerBalance,
    SingleAccountDetail.currency + ' ' + SingAccountBalance.availableBalance, SingleAccountDetail.status,
    SingleAccountDetail.type, SingleAccountDetail.bankShortName];
    if (this.dir === FccGlobalConstant.LANUGUAGE_DIR_ARABIC) {
      temp.reverse();
    }
    row1.push(temp);
    const options = {
      headStyles: {
        halign: 'center', overflow: 'linebreak', fillColor: this.pdfStylesService.getTableHeaderBackgroundColour(),
        textColor: this.pdfStylesService.getTableHeaderTextColour(),
        font: this.getArabicFontIfLanguageAR(),
        fontSize: this.pdfStylesService.getTableFontSize(), fontStyle: this.pdfStylesService.getTableFontStyle()
      },
      bodyStyles: {
        halign: 'center', overflow: 'linebreak', textColor: this.pdfStylesService.getTableFontColour(),
        font: this.getArabicFontIfLanguageAR(),
        fontSize: this.pdfStylesService.getTableFontSize(),
        fontStyle: this.pdfStylesService.getTableFontStyle()
      },
      useCss: true,
      startY: this.ycord,
      head: [this.AccCol],
      body: row1,
      margin: { left: PdfConstants.MARGIN_60, right: PdfConstants.NUMB_30 },
      theme: 'grid',
      pageBreak: PdfConstants.PAGE_BREAK,
      styles: { font: this.getArabicFontIfLanguageAR(), fontStyle: this.pdfStylesService.getTableFontStyle(),
          halign: PdfConstants.ALIGN_LEFT }
    };
    if (this.dir === FccGlobalConstant.LANUGUAGE_DIR_ARABIC) {
      options.margin.left = PdfConstants.NUMB_30;
      options.margin.right = PdfConstants.MARGIN_50;
    }
    this.doc.autoTable(options);
    this.ycord = this.ycord + this.nextLine * yCoOrdGap;
  }

  /*
 * Method adds the footer cotent for every page in the document.
 */
  updateFooter() {
    const totalPages = this.doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      this.footer(i, totalPages);
    }
  }

  footer(pageNumber, totalPages) {
    const currentPage = `${this.translateService.instant('page')}` +
      `${pageNumber}` + `${this.translateService.instant('of')}` + ` ${totalPages}`;
    this.doc.setPage(pageNumber);
    const xcordDiff = PdfConstants.X_CORD_DIFF_6;
    const pageYCoOrd = this.getXcordbasedonLanguage(PdfConstants.PAGE_Y_COORD, PdfConstants.FOOTER_LINE_Y);
    const XcordFooter = this.getXcordbasedonLanguage(FccGlobalConstant.LENGTH_500 + xcordDiff, PdfConstants.NUMB_65);
    this.doc.setFont(this.pdfStylesService.getFooterFont());
    this.doc.setFontSize(this.pdfStylesService.getFooterFontSize());
    this.doc.setTextColor(this.pdfStylesService.getFooterFontColour());
    this.checkArabicFont(currentPage, '');
    this.doc.text(currentPage, XcordFooter, pageYCoOrd, this.setTextOption);
  }

  setTableFontFormat() {
    this.doc.setFontSize(this.pdfStylesService.getTableFontSize());
    this.doc.setTextColor(this.pdfStylesService.getTableFontColour());
    this.doc.setFont(this.pdfStylesService.getTableFont());
  }

  addLeftBorder() {
    this.doc.setDrawColor(this.pdfStylesService.getLeftBarColour());
    this.doc.setLineWidth(this.pdfStylesService.getLeftBarWidth());
    this.doc.setFont(this.pdfStylesService.getLeftBarTextFont(), this.pdfStylesService.getLeftBarTextFontStyle());
    this.doc.setFontSize(this.pdfStylesService.getLeftBarTextFontSize());
    this.doc.setTextColor(this.pdfStylesService.getLeftBarTextFontColour());
    const leftBoarderXcord = this.getXcordbasedonLanguage(this.xcord, PdfConstants.X_CORD_570_AR);
    this.doc.line(leftBoarderXcord, PdfConstants.LEFT_BAR_Y1, leftBoarderXcord, PdfConstants.LEFT_BAR_Y2);
    this.doc.text(PdfConstants.LEFT_BAR_PRODUCT_CODE_X_COORD_15, PdfConstants.LEFT_BAR_PRODUCT_CODE_Y_COORD_400,
      `${this.translateService.instant('MODULE_STATEMENTS')}`, null, PdfConstants.LEFT_BAR_PRODUCT_CODE_ROTATION_90);
  }

  getXcordbasedonLanguage(XcordEN, XcordAR) {
    if (this.dir === FccGlobalConstant.LANUGUAGE_DIR_ARABIC) {
      return XcordAR;
    }
    return XcordEN;
  }

  checkArabicFont(value, fontStyle) {
    if (this.dir === FccGlobalConstant.LANUGUAGE_DIR_ARABIC) {
      const isArabicPresent = this.arabicEncoding.test(value);
      if (isArabicPresent) {
        if (PdfConstants.FONT_STYLE_BOLD === fontStyle.toLowerCase()) {
          this.doc.setFont(PdfConstants.ARABIC_BOLD_ARIAL);
        }
        else {
          this.doc.setFont(PdfConstants.ARABIC_NORMAL_ARIAL);
        }
      }
    }
  }

  getArabicFontIfLanguageAR() {
    if (this.dir === FccGlobalConstant.LANUGUAGE_DIR_ARABIC) {
      return PdfConstants.ARABIC_NORMAL_ARIAL;
    } else {
      return PdfConstants.FONT_HELVETICA;
    }
  }

  setHeader() {
    this.doc.setFont(this.pdfStylesService.getBankAddressFont());
    this.doc.setFontSize(this.pdfStylesService.getBankAddressFontSize());
    this.doc.setTextColor(this.pdfStylesService.getBankAddressFontColour());
    let X_DATE_CORD: number;
    X_DATE_CORD = this.getXcordbasedonLanguage(FccGlobalConstant.LENGTH_475, FccGlobalConstant.LENGTH_115_AR);
    const X_DATE_CORD1 = this.doc.getTextWidth(this.pdfFormattedDate);
    const X_ACC_CORD = this.getXcordbasedonLanguage(FccGlobalConstant.LENGTH_350, FccGlobalConstant.LENGTH_240_AR);
    const X_ACC_CORD1 = this.doc.getTextWidth(`${this.translateService.instant('MODULE_STATEMENTS')}`);

    if ((X_DATE_CORD + X_DATE_CORD1) > (X_ACC_CORD + X_ACC_CORD1)) {
      X_DATE_CORD = this.getXcordbasedonLanguage(FccGlobalConstant.LENGTH_435, FccGlobalConstant.LENGTH_155_AR);
    }

    this.doc.text(X_DATE_CORD, FccGlobalConstant.LENGTH_37, this.pdfFormattedDate);

    if (this.dir === FccGlobalConstant.LANUGUAGE_DIR_ARABIC) {
      this.checkArabicFont(`${this.translateService.instant('MODULE_STATEMENTS')}`, PdfConstants.FONT_STYLE_BOLD);
    } else {
      this.doc.setFont(this.pdfStylesService.getProductCodeFont(), PdfConstants.FONT_STYLE_BOLD);
      this.doc.setFontSize(this.pdfStylesService.getProductCodeFontSize());
      this.doc.setTextColor(this.pdfStylesService.getProductCodeFontColour());
    }
    this.doc.text(X_ACC_CORD, FccGlobalConstant.LENGTH_60, `${this.translateService.instant('MODULE_STATEMENTS')}`, this.setTextOption);

    if (this.imageExtension) {
      this.doc.addSvgAsImage(this.resultImage, this.logoConfig.xcord, this.logoConfig.ycord,
        this.logoConfig.length, this.logoConfig.width, 'response', 'NONE', PdfConstants.DIMENSION_IMG);
    } else {
      this.doc.addImage(this.resultImage, 'JPEG', this.logoConfig.xcord, this.logoConfig.ycord,
        this.logoConfig.length, this.logoConfig.width);
    }
    this.doc.setFont(this.pdfStylesService.getBankAddressFont(), PdfConstants.FONT_STYLE_NORMAL);
    this.doc.setFontSize(this.pdfStylesService.getBankAddressFontSize());
    this.doc.setTextColor(this.pdfStylesService.getBankAddressFontColour());
    const splitTitle = this.doc.splitTextToSize(this.bankAddress, FccGlobalConstant.LENGTH_150);
    const splitTitleXCord = this.getXcordbasedonLanguage(FccGlobalConstant.LENGTH_60, PdfConstants.X_CORD_545_AR);
    this.doc.text(splitTitleXCord, FccGlobalConstant.LENGTH_170, splitTitle, this.setTextOption);
    this.ycord = FccGlobalConstant.LENGTH_170;
  }
}
