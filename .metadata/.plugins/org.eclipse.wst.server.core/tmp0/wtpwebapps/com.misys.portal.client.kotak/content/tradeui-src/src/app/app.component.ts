import { PdfStylesService } from './common/services/pdf-styles.service';
import { CommonDataService } from './common/services/common-data.service';
import { SessionService } from './common/services/Session.Service';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from './common/services/common.service';
import { Constants } from './common/constants';
import { ConfigService } from './common/services/config.service';
import { URLConstants } from './common/urlConstants';
import { User } from './common/model/user.model';

@Component({
  selector: 'fcc-common-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    contextPath: string;
    constructor(protected http: HttpClient, protected translate: TranslateService,
                protected sessionService: SessionService, protected commonService: CommonService,
                protected commonDataService: CommonDataService, protected configService: ConfigService,
                protected pdfStylesService: PdfStylesService) {}

    sessionFetchedSuccess = false;
    private  userName: string;
    private  language: string;
    private  company: string;
    productCode: string;
    userLanguage: string;
    currencyDecimalMap = new Map<string, number>();
    public theme = 'default-theme-align';

    ngOnInit() {
      const CONTEXT_PATH = 'CONTEXT_PATH';
      const PRODUCT_CODE = 'PRODUCT_CODE';
      this.contextPath = window[CONTEXT_PATH];
      this.productCode = window[PRODUCT_CODE];
      this.userLanguage = window[Constants.USER_LANGUAGE];
      this.commonService.setUserLanguage(this.userLanguage);
      this.theme = this.userLanguage === 'ar' ? 'arabic-theme-align' : 'default-theme-align';
      if (this.userLanguage === 'ar') {
        // Adjust the portlet header to make it aligned from RTL in case the user language is Arabic
        const portletTitleList = document.querySelectorAll<HTMLElement>('.portlet-title');
        portletTitleList.forEach(element => {
          element.style.textAlign = 'right';
        });
        const style = document.createElement('style');
        style.innerHTML =
          `body .ui-panel .ui-panel-titlebar .ui-panel-titlebar-icon {
          float: left;
          }
          .ui-dropdown label.ui-dropdown-label {
            text-align: right !important;
          }
          .ui-dropdown-panel .ui-dropdown-item {
            text-align: right !important;
          }
          body .ui-dropdown .ui-dropdown-trigger {
            position: inherit !important;
            margin-top: -1.65em !important;
            margin-left: 1em;
            float: left !important;
            width: 0em !important;
          }
          body p-dropdown.ui-inputwrapper-filled> .ui-dropdown.ui-dropdown-clearable .ui-dropdown-trigger {
            margin-left: 0em !important;
          }
          body .ui-dropdown.ui-dropdown-clearable .ui-dropdown-clear-icon {
            position: inherit !important;
            top: -10% !important;
            right: -10% important;
            font-size: 1em;
            height: 1em;
            margin-top: -0.9em;
            float: left;
          }
          body .ui-dialog .ui-dialog-titlebar {
          ${Constants.TEXT_ALIGN_RIGHT}
          }
          body .ui-dialog .ui-dialog-titlebar .ui-dialog-titlebar-icon{
          float : left;
          margin : 0 !important;
          }
          body .ui-dialog .ui-dialog-content {
            ${Constants.TEXT_ALIGN_RIGHT}
          }
          body .ui-dialog .ui-dialog-content .ui-confirmdialog-icon {
            float: right !important;
            top: 0em !important;
            margin: 0em 0em 0em 0.5em !important;
        }
          body p-calendar.ng-touched.ng-invalid > .ui-calendar > .ui-inputtext {
            border-left: 0 !important;
            border-top: 1px solid #CB4335 !important;
            border-bottom: 1px solid #CB4335 !important;
            border-right: 1px solid #CB4335 !important;
            border-radius: 0 3px 3px 0 !important;
          }
          .ui-calendar.ui-calendar-w-btn .ui-inputtext {
              border-left: 0 !important;
              border-right: 1px solid #c8c8c8 !important;
              border-radius: 0 3px 3px 0 !important;
          }
          .ui-calendar.ui-calendar-w-btn .ui-inputtext:enabled:hover {
                border-left: 0 !important;
                border-top: 1px solid #212121 !important;
                border-bottom: 1px solid #212121 !important;
                border-right: 1px solid #212121 !important;
                border-radius: 0 3px 3px 0 !important;
            }
          .ui-calendar.ui-calendar-w-btn .ui-inputtext:enabled:focus{
            border-color: #007ad9 !important;
            }
          body .ui-calendar.ui-calendar-w-btn .ui-datepicker-trigger.ui-button {
            border-radius: 3px 0 0 3px !important;
          }
          .demobank .tree-product-menu-container .dijitTreeRow {
          ${Constants.TEXT_ALIGN_RIGHT}
          }
          body .ui-chkbox .ui-chkbox-box {
          margin-right: 10px;
          }
          .demobank .panel1 {
          ${Constants.TEXT_ALIGN_RIGHT}
          }
          label {
          text-align: left !important;
          }`;
        const ref = document.querySelector('style');
        ref.parentNode.insertBefore(style, ref);
      }
      this.translate.setDefaultLang(this.userLanguage);
      this.translate.use(this.userLanguage);
      const dateFormat = this.userLanguage === Constants.LANGUAGE_US ? Constants.HTML_DATE_FORMAT_MDY : Constants.HTML_DATE_FORMAT_DMY;
      this.commonService.setDateFormat(dateFormat);
      if (this.productCode === 'RU') {
         this.productCode = 'BR';
      } else if (this.productCode === 'IU') {
         this.productCode = 'BG';
      }
      this.commonDataService.setProductCode(this.productCode);
      const BANK_USER = 'BANK_USER';
      const bankUser = window[BANK_USER];
      if (bankUser && bankUser !== null && bankUser !== '') {
        this.commonDataService.setIsBankUser(JSON.parse(bankUser));
      }
      const arg1 = new Date().getFullYear() - Number(Constants.MIN_YEAR);
      const arg2 = new Date().getFullYear() + Number(Constants.MAX_YEAR);
      this.commonService.setYearRange(`${arg1}: ${arg2}`);
      const url = this.contextPath + URLConstants.SESSION_DATA;
      this.sessionService.fetchSessionData(url).subscribe(data => {
        if (data) {
           this.commonService.setSessionData(data);
           this.sessionFetchedSuccess = true;
           this.commonService.setLoginUserName(data.username);
           this.commonService.setCompanyName(data.companyAbbvName);
           this.commonDataService.setEntity(data.entity_name);
           this.userName =  data.username;
           this.company =  data.companyAbbvName;
           this.language =  data.language;
          } else {
           console.error('Session not fetched');
         }
       },
         error => {
           console.error(' fetchSessionData() -- Something went wrong');
       });

      this.loadDefaultConfiguration();

      this.commonService.getCurrencyDecimals().subscribe(data => {
          for (const i in data.currencies) {
            if (data.currencies[i].isoCode !== '') {
            this.currencyDecimalMap.set(data.currencies[i].isoCode, data.currencies[i].decimalNumber);
            }
          }
          this.commonService.setCurrencyDecimalMap(this.currencyDecimalMap);
        });
    }

    get username(): string {
      return this.userName;
    }

    set username(value: string) {
     this.userName = value;
    }

    getLanguage(): string {
      return this.language;
    }

    setLanguage(value: string) {
     this.language = value;
    }

    getCompany(): string {
      return this.company;
    }

    setCompany(value: string) {
     this.company = value;
    }

    setLang(lang: string) {
      this.translate.use(lang);
    }

    loadDefaultConfiguration() {
      this.commonService.loadDefaultConfiguration().subscribe(
        response => {
          this.commonService.setAllowedExtensionsForUpload(response.allowedExtensionsForUpload);
          this.commonService.setMaxUploadSize(response.maxUploadSizePerRequest);
          this.commonService.setFileuploadMaxLimit(response.fileUploadMaxLimit);
          this.commonService.setPdfLogo(response.pdfLogo);
          this.commonService.settlementAmtFlag(response.settlementAmtEditable);
          this.commonService.setReauthEnabled(response.reauthEnabled);
          this.commonService.setAttachmentDataResolver();
          this.commonService.setClientSideEncryptionEnabled(response.clientSideEncryptionEnabled);
          this.commonService.setEnableUIUX(response.uiuxenabled);
          this.commonService.setSwiftBicCodeRegexValue(response.swiftBicCodeRegexValue);
          this.configService.setCounterUndertakingEnabled(response.counterUndertakingEnabled);
          this.commonService.setShowEventReference(response.showEventReference);
          this.commonService.setCustRefIdLength(response.custRefIdLength);
          this.commonService.setShowLiabilityAmount(response.showLiabilityAmount);
          this.commonService.setShowLicence(response.showLicence);
          this.commonService.setShowFacilitySectionForTrade(response.showFacilitySectionForTrade);
          this.commonService.setfacilitySelectionValidation(response.facilitySelectionValidation);
          this.commonService.setValidateTnxAmtWithLimitAmt(response.validateTnxAmtWithLimitAmt);
          this.pdfStylesService.setNoticeSectionBorderColour(response.pdfNoticeSectionBorderColour);
          this.pdfStylesService.setNoticeSectionFontSize(response.pdfNoticeSectionFontSize);
          this.pdfStylesService.setNoticeSectionFontColour(response.pdfNoticeSectionFontColour);
          this.pdfStylesService.setNoticeSectionFont(response.pdfNoticeSectionFont);
          this.commonService.setSwiftVersion(response.swiftVersion);
          this.commonService.setSwiftZChar(response.swiftZChar);
          this.pdfStylesService.setHeaderFontSize(response.pdfHeaderFontSize);
          this.pdfStylesService.setHeaderFont(response.pdfHeaderFontStyle);
          this.pdfStylesService.setHeaderFontColour(response.pdfHeaderFontColour);
          this.pdfStylesService.setLeftBarColour(response.pdfLeftBarColour);
          this.pdfStylesService.setLeftBarWidth(response.pdfLeftBarWidth);
          this.pdfStylesService.setLeftBarTextColour(response.pdfLeftBarTextColour);
          this.pdfStylesService.setLeftBarTextSize(response.pdfLeftBarTextSize);
          this.pdfStylesService.setSectionHeaderFontSize(response.pdfSectionHeaderFontSize);
          this.pdfStylesService.setSectionHeaderFont(response.pdfSectionHeaderFont);
          this.pdfStylesService.setSectionHeaderFontStyle(response.pdfSectionHeaderFontStyle);
          this.pdfStylesService.setSectionHeaderFontColour(response.pdfSectionHeaderFontColour);
          this.pdfStylesService.setSectionHeaderBorderColour(response.pdfSectionHeaderBorderColour);

          this.pdfStylesService.setSubSectionHeaderBorderColour(response.pdfSubSectionHeaderBorderColour);
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

          this.pdfStylesService.setTableFontSize(response.pdfTableFontSize);
          this.pdfStylesService.setTableFontColour(response.pdfTableFontColour);
          this.pdfStylesService.setTableFontStyle(response.pdfTableFontStyle);

          this.pdfStylesService.setFooterFontSize(response.pdfFooterFontSize);
          this.pdfStylesService.setFooterFontColour(response.pdfFooterFontColour);
          this.commonService.setNameTradeLength(response.nameTradeLength);
          this.commonService.setAddress1TradeLength(response.address1TradeLength);
          this.commonService.setAddress2TradeLength(response.address2TradeLength);
          this.commonService.setDomTradeLength(response.domTradeLength);
          this.commonService.setAddress4TradeLength(response.address4TradeLength);
          this.commonService.setShipmentPeriodStandard(response.shipmentPeriodStandard);
          this.commonService.courierTrackingFeatureEnabled = response.courierTrackingFeatureEnabled;
          this.commonService.availableAmountEnabled = response.availableAmountEnabled;
        });
    }
}
