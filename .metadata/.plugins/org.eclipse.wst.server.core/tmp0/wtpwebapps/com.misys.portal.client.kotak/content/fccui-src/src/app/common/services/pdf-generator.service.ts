/* eslint-disable @typescript-eslint/no-unused-vars */
import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import jsPDF from 'jspdf';
import { CurrencyConverterPipe } from '../../corporate/trade/lc/initiation/pipes/currency-converter.pipe';

import { FCCFormControl, FCCFormGroup } from '../../base/model/fcc-control.model';
import { arabicBoldArial } from '../../common/fonts/arabic-bold-arial';
import { arabicBoldCourier } from '../../common/fonts/arabic-bold-courier';
import { arabicNormalArial } from '../../common/fonts/arabic-normal-arial';
import { arabicNormalCourier } from '../../common/fonts/arabic-normal-courier';
import { ProductStateService } from '../../corporate/trade/lc/common/services/product-state.service';
import { PreviewService } from '../../corporate/trade/lc/initiation/services/preview.service';
import { UtilityService } from '../../corporate/trade/lc/initiation/services/utility.service';
import { FccBusinessConstantsService } from '../core/fcc-business-constants.service';
import { FccGlobalConstantService } from '../core/fcc-global-constant.service';
import { FccGlobalConstant } from '../core/fcc-global-constants';
import { FccPdfStylesService } from '../core/fcc-pdf-styles-constants.service';
import { PdfConstants } from '../core/pdfConstants';
import { CorporateDetails } from '../model/corporateDetails';
import { CountryList } from '../model/countryList';
import { LendingCommonDataService } from './../../corporate/lending/common/service/lending-common-data-service';
import { CommonService } from './common.service';
import { DashboardService } from './dashboard.service';
import { GroupClubService } from './group-club.service';
import { FormControlService } from '../../corporate/trade/lc/initiation/services/form-control.service';

interface FieldDetails {
  label?: string;
  value?: any;
  previousValue?: any;
  pdfParams?: any;
  singleColumn?: boolean;
  labelOnly?: boolean;
  fieldType?: string;
}

interface SectionDetails {
  pdfParams?: any;
  fieldsMap: Map<string, SubSectionDetails>;
  hasSubSection: boolean;
}

interface SubSectionDetails {
  pdfParams?: any;
  isSubSection: boolean;
  listOfFields: FieldDetails[];
  hideSubHeader?: boolean;
  fieldType?: string;
  pdfFieldType?: string;
}

interface FieldControlDetails {
  pdfParams?: any;
  isSubSection?: boolean;
  fieldControls?: FCCFormControl[];
  hideSubHeader?: boolean;
  isClubbedItem?: boolean;
}

interface FormDetails {
  pdfParams?: any;
  fieldsMap: Map<string, FieldControlDetails>;
  hasSubSection: boolean;
}

@Injectable({
  providedIn: 'root'
})

export class PdfGeneratorService {
  operation;
  pdf;
  public bankDetails: string[] = [];
  public corporateDetails: CorporateDetails;
  public loggedInUserDetails;
  logoConfig = {
    xcord: PdfConstants.X_CORD_50,
    ycord: PdfConstants.Y_CORD_INIT_40,
    length: PdfConstants.LENGTH_100,
    width: PdfConstants.WIDTH_50
  };
  watermarkConfig = {
    xcord: PdfConstants.X_CORD_40,
    ycord: PdfConstants.Y_CORD_100,
    length: PdfConstants.LENGTH_650,
    width: PdfConstants.WIDTH_850
  };
  logoBasedOnbankConfig = {
    xcord: PdfConstants.X_CORD_50,
    ycord: PdfConstants.Y_CORD_INIT_40,
    length: PdfConstants.LENGTH_100,
    width: PdfConstants.WIDTH_50
  };
  public ycord;
  public setTextOption = {};
  public nextLine = PdfConstants.NEXT_LINE_10;
  public pageNumber = PdfConstants.PAGE_NUMBER_1;
  protected lastTablePage = PdfConstants.LAST_TABLE_PAGE;
  public pageHeight;
  public productCode;
  public refId;
  public tnxId;
  public subProductCode;
  public operationType;
  public tnxTypeCode;
  public tnxStatCode;
  public childTnxObj;
  public childRefID;
  public xcord = PdfConstants.X_CORD_35;
  public headerlogo;
  logoImageExtension: boolean;
  public watermarkImage;
  watermarkImageExtension: boolean;
  sectionDataMap: Map<string, SectionDetails>;
  protected addHeaderExtraSpace = true;
  protected addSubHeaderExtraSpace = false;
  protected addFieldExtraSpace = false;
  protected addNarrativeTextExtraSpace = false;
  protected headerFont;
  protected headerFontSize;
  protected headerFontStyle;
  protected headerFontColor;

  protected subHeaderFont;
  protected subHeaderFontSize;
  protected subHeaderFontStyle;
  protected subHeaderFontColor;

  protected contentFont;
  protected contentFontSize;
  protected contentFontStyle;
  protected contentFontColor;

  protected labelFont;
  protected labelFontSize;
  protected labelFontStyle;
  protected labelFontColor;
  protected notEntered;
  protected previousTnxId;
  protected amendedValue;
  protected fieldLabelYCord;
  protected setAmendedChords = false;
  protected fieldContentYCord = 0;
  protected firstColfieldLabelYCordAfterSplit = 0;
  protected firstColFieldContentYCordAfterSplit = 0;
  protected firstColfieldLabelYCordBeforeSplit = 0;
  protected firstColFieldContentYCordBeforeSplit = 0;
  protected language;
  public arabicEncoding = /[\u0600-\u06FF\u0750-\u077F]/;
  protected lastFieldNarrative = false;
  readonly key = 'key';
  readonly params = 'params';
  readonly previewScreen = 'previewScreen';
  readonly pdfParams = 'pdfParams';
  readonly masked = 'masked';
  readonly rendered = 'rendered';
  readonly showViewDetails = 'showViewDetails';
  readonly fieldControls = 'fieldControls';
  readonly type = 'type';
  readonly label = 'label';
  readonly grouphead = 'grouphead';
  readonly groupChildren = 'groupChildren';
  readonly groupHeaderText = 'groupHeaderText';
  readonly clubbedDelimiter = 'clubbedDelimiter';
  readonly clubbedHeaderText = 'clubbedHeaderText';
  readonly clubbedList = 'clubbedList';
  readonly fullWidth = FccGlobalConstant.FULL_WIDTH_VIEW;
  readonly halfWidth = FccGlobalConstant.HALF_WIDTH_VIEW;
  maxWordLimit = FccGlobalConstant.LENGTH_500;
  public remainingTableHeight = PdfConstants.REMAINING_TABLE_HEIGHT;
  public remaingTableRows = PdfConstants.REMAINING_TABLE_ROWS;
  public rowsInRemainingPage = PdfConstants.ROWS_IN_REMAINING_PAGE;
  protected documentsectionnotemptyflag = true;
  protected tableName: any;
  protected pdfMode: any;
  protected isGroupDataDownload: any;
  readonly options = 'options';
  readonly valueStr = 'value';
  clubbedChildList: string[] = [];
  sectionNames: string[];
  allControlsMap: Map<string, FCCFormControl>;
  formDataMap: Map<string, FormDetails>; // <header, <subHeader/label, sectionControls>>
  groupItemsMap: Map<string, Map<string, string[]>>; // contains Map<fieldName, Map<GroupHeader, [GroupChildern]>>
  clubbeItemsMap: Map<string, Map<string, string[]>>; // contains Map<FieldName, clubbedHeader, [clubbedList]>
  clubbedTrueFields: string[] = [];
  applicationDate: string;
  isMaster: boolean;
  stateType: any;
  arialUniBase64: any;
  dejavuBase64: any;

  isBatchAttachmentPage: boolean;
  isBatchBlankPage: boolean;
  isPOPresent: boolean = false;
  eventsection: boolean;


  readonly listOfFileUploadSections: string[] = ['fileUploadDetails', 'elUploadMT700', 'elFileUploadDetails', 'irFileUploadDetails',
    'sgFileUploadDetails', 'icFileUploadDetails', 'tfAttachmentDetails', 'siFileUploadDetails', 'srFileUploadDetails',
    'ftTradeFileUploadDetails', 'ecFileUploadDetails', 'uiFileUploadDetails', 'UaFileUploadDetails', 'customerAttachments',
    'bankAttachments', 'liFileUploadDetails', 'lnFileUploadDetails', 'lnrpnFileUploadDetails', 'lncdsFileUploadDetails',
    'blfpFileUploadDetails', 'bankAttachmentHeader', 'seFileUploadDetails', 'seHelpdeskFileUploadDetails',
    'seUploadFileUploadDetailsComponent'];
  readonly listOfApplicationDate: string[] = ['creationDate', 'applicationDate', 'requestedDate'];
  extraLineInLabel = false;
  accordionSectionsList: string[] = [];
  newPageAddedDuringFirstColSplit = false;
  movedToAlreadyAddedPageDuringSecondColSplit = false;
  listOfEventInqurySection = [FccGlobalConstant.eventDetails, FccGlobalConstant.bankMessageEvents,
    FccGlobalConstant.LN_REMITTANCE_INSTRUCTIONS, FccGlobalConstant.BANK_ATTACHMENT, FccGlobalConstant.ADVICE_DISCREPANCY,
    FccGlobalConstant.PREVIOUS_ATTACHMENTS, FccGlobalConstant.FEES_AND_CHARGES];
  listOfBackToBackTogglesData: string[] = ['backToBackLCToggle', 'backToBackSIToggle'];
  fieldIndexCount = 1;
  dateFormatForPdf: any;
  dateValue: any;
  currencyList: any;
  currencySymbolDisplayEnabled = false;
  isAccSummaryDashboard = false;
  isAccountStatementDownload = false;
  statementFilters = {};
  accStatementRecordLimit: any;
  isRepeatHeader =false;
  headerAlignment:any;
  repeatLogoEnabled =false;
  showAvailableAmount: any;

  constructor(protected translate: TranslateService, protected commonService: CommonService,
              protected pdfStylesService: FccPdfStylesService, public datePipe: DatePipe,
              protected dashboardService: DashboardService,
              protected previewService: PreviewService, protected stateService: ProductStateService,
              protected currencyConverterPipe: CurrencyConverterPipe,protected formControlService: FormControlService,
              protected groupClubService: GroupClubService, protected fccGlobalConstantService: FccGlobalConstantService,
              protected utilityService: UtilityService, protected lendingCommonDataService: LendingCommonDataService) {
    this.commonService.getBankDetails().subscribe(data => {
      this.bankDetails = data as string[];
    });

    this.commonService.getCorporateDetailsAPI(FccGlobalConstant.REQUEST_INTERNAL).subscribe(response => {
      this.corporateDetails = response.body;
    });

    this.dashboardService.getUserDetails().subscribe(response => {
      this.loggedInUserDetails = response;
    });

    this.commonService.loadPdfConfiguration().subscribe(
      response => {
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
    });

    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.currencyList = response.currencyList;
        const contextPath = this.fccGlobalConstantService.contextPath;
        this.showAvailableAmount = response.showAvailableAmount;
        const logoImagePath = contextPath + response.pdfImagePath;
        this.commonService.getBase64FDataFromFile(logoImagePath)
          .then(async result => {
            this.headerlogo = result;
            if (this.headerlogo.indexOf('charset=UTF-8;') !== -1) {
              this.headerlogo = this.headerlogo.replace('charset=UTF-8;', '');
              this.headerlogo = this.headerlogo.replace(/\s/g, '');
            }
            if (this.headerlogo.indexOf('.svg') > -1) {
              this.logoImageExtension = true;
            } else {
              this.logoImageExtension = false;
            }
          })
          .catch(err => console.error(err));
        const watermarkImagePath = contextPath + response.pdfWatermarkImagePath;
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

          const fontFiletPath = contextPath + response.pdfFontFilePath;
          this.commonService.getBase64FDataFromFile(fontFiletPath + PdfConstants.ARIALUNI_TTF)
          .then(async result => {
            this.arialUniBase64 = result.toString().replace(/^.+?(;base64),/, '');
          })
          .catch(err => console.error(err));

          this.commonService.getBase64FDataFromFile(fontFiletPath + PdfConstants.DEJAVUSANS_TTF)
          .then(async result => {
            this.dejavuBase64 = result.toString().replace(/^.+?(;base64),/, '');
          })
          .catch(err => console.error(err));
      }
    });
    this.commonService.getBankContextParameterConfiguredValues(FccGlobalConstant.PARAMETER_P809).subscribe(
      (response) => {
      if (this.commonService.isNonEmptyValue(response) &&
      this.commonService.isNonEmptyValue(response.paramDataList) && response.paramDataList[0]) {
        this.currencySymbolDisplayEnabled = response.paramDataList[0][FccGlobalConstant.DATA_1] === 'y';
      }
    });
    const language = localStorage.getItem('language');
    this.translate.use(language ? language : 'en' );
    this.translate.get('corporatechannels').subscribe(() => {
      // eslint-disable-next-line no-console
        console.log('to ensure that the translations are loaded via making this sequential call');
    });
    this.commonService.getBankContextParameterConfiguredValues(FccGlobalConstant.PARAMETER_P988,'').subscribe(
      (response) => {
      if (this.commonService.isNonEmptyValue(response) &&
      this.commonService.isNonEmptyValue(response.paramDataList) && response.paramDataList.length > 0) {
        this.isRepeatHeader = response.paramDataList[0][FccGlobalConstant.DATA_1] === 'Y';
        this.headerAlignment= response.paramDataList[0][FccGlobalConstant.DATA_2];
        this.repeatLogoEnabled= response.paramDataList[0][FccGlobalConstant.DATA_3] === 'Y';

      }
    });
  }


  createPDF(pdfData: Map<string, FCCFormGroup>, modelJson, refId, productCode, source: string, tnxId?: string, subProductCode?: string,
            operation?: string, tnxTypeCode?: any, tnxStatCode?: any, stateType?: any) {
    this.commonService.modePdf = true;
    this.notEntered = this.translate.instant(FccGlobalConstant.NOT_ENTERED);
    this.refId = refId;
    this.tnxId = tnxId;
    this.operationType = operation;
    this.tnxTypeCode = tnxTypeCode;
    this.productCode = productCode;
    this.stateType = stateType;
    const amendProductsList = [FccGlobalConstant.PRODUCT_LC, FccGlobalConstant.PRODUCT_SI,
      FccGlobalConstant.PRODUCT_BG,
      FccGlobalConstant.PRODUCT_EC,FccGlobalConstant.PRODUCT_SE];
    if (subProductCode) {
      this.subProductCode = subProductCode;
    }
    if (tnxStatCode) {
      this.tnxStatCode = tnxStatCode;
      this.amendedValue = ((this.tnxStatCode === FccGlobalConstant.N004_UNCONTROLLED ||
        this.tnxStatCode === FccGlobalConstant.N004_CONTROLLED) &&
        this.tnxTypeCode === FccGlobalConstant.N002_AMEND
        && amendProductsList.includes(this.productCode) && this.operationType === FccGlobalConstant.PREVIEW) ? true : false;
    } else {
      this.amendedValue = false;
    }
    if (this.commonService.isnonEMptyString(this.tnxId)) {
      this.isMaster = false;
    } else {
      this.isMaster = true;
    }
    this.language = this.translate.currentLang;
    this.groupClubService.initializeMaps(modelJson, this.amendedValue);
    this.groupItemsMap = this.groupClubService.getSubGroupMap();
    this.clubbeItemsMap = this.groupClubService.getClubbedFieldMap();
    this.clubbedTrueFields = this.groupClubService.getClubbedTrueFields();
    if (this.language === PdfConstants.LANGUAGE_AR) {
      this.logoConfig.xcord = PdfConstants.X_CORD_430_AR;
      this.xcord = PdfConstants.X_CORD_530_AR;
      this.setTextOption = { align: PdfConstants.ALIGN_RIGHT, lang: PdfConstants.LANGUAGE_AR };
    }
    this.generatePdfWithData(pdfData);
  }

  /* start getting the PDF Data */
  addDataToPdfFile(pdfData) {
    this.sectionNames.forEach(sectionHeader => {
      if (this.getAccordionSectionsList().length > 0 && this.getAccordionSectionsList().indexOf(sectionHeader) > -1 &&
      pdfData.get(sectionHeader)) {
        const fieldMap = pdfData.get(sectionHeader).fieldsMap;
        fieldMap.forEach((value: boolean, key: string) => {
          const sectionControls = fieldMap.get(key);
          this.sectionDataMap = new Map();
          let sectionStyles;
          if (sectionControls[this.pdfParams]) {
            sectionStyles = sectionControls[this.pdfParams];
          }
          if (sectionControls && !(sectionStyles && sectionStyles[this.masked] && sectionStyles[this.masked] === true)) {
            this.populateSectionDataMap(key, sectionControls);
            if (sectionControls.fieldsMap.get(FccGlobalConstant.UI_IRREGULAR_VARIATIONS) !== undefined ||
                sectionControls.fieldsMap.get(FccGlobalConstant.CU_IRREGULAR_VARIATIONS) !== undefined) {
              this.populateIrregularVariationTableDate(sectionHeader, key, sectionControls, sectionStyles);
            } else {
              this.addContentTOPDF(sectionHeader + key, this.sectionDataMap.get(key), sectionStyles);
            }
          }
        });
      } else {
      const sectionControls = pdfData.get(sectionHeader);
      this.sectionDataMap = new Map();
      let sectionStyles;
      if (sectionControls && sectionControls[this.pdfParams]) {
        sectionStyles = sectionControls[this.pdfParams];
      }
      if (sectionControls && !(sectionStyles && sectionStyles[this.masked] && sectionStyles[this.masked] === true)) {
        this.populateSectionDataMap(sectionHeader, sectionControls);
        const isAttachmentSection = this.checkFileUploadSections(sectionHeader);
        const emptySection = this.isSectionEmpty(sectionControls);
        if (isAttachmentSection && !emptySection) {
          this.populateAttachmentTableData(sectionHeader, sectionControls, sectionStyles);
        } else if (this.checkLicenseSections(sectionHeader, this.productCode) && !emptySection) {
          this.populateLicenseTableData(sectionHeader, sectionControls, sectionStyles);
        } else if (this.checkDocumentsSections(sectionHeader) && !emptySection) {
          this.handleDocumentSection(sectionHeader, emptySection, sectionControls, sectionStyles);
        } else if (this.checkNarrativeSections(sectionHeader) && !emptySection) {
          this.populatePurchaseOrderData(sectionHeader,this.sectionDataMap.get(sectionHeader), sectionControls, sectionStyles);
          this.addContentTOPDF(sectionHeader, this.sectionDataMap.get(sectionHeader), sectionStyles, !this.isPOPresent);
        }else if (this.checkFeesAndCharges(sectionHeader) && !emptySection) {
          this.populateFeesAndCharges(sectionHeader, sectionControls, sectionStyles);
        } else if (this.checkChildReferences(sectionHeader, sectionControls) && !emptySection) {
          this.addContentTOPDF(sectionHeader, this.sectionDataMap.get(sectionHeader), sectionStyles);
          this.populateChildReferences(sectionControls);
        } else {
          this.addContentTOPDF(sectionHeader, this.sectionDataMap.get(sectionHeader), sectionStyles);
        }
      }
    }
    });
  }

  checkChildReferences(sectionHeader: string , sectionControls): boolean {
    if (sectionHeader.toLowerCase().indexOf('generaldetails') > -1
     && ((sectionControls.fieldsMap.has(FccGlobalConstant.CHILD_REFERENCE) &&
     sectionControls.fieldsMap.get(FccGlobalConstant.CHILD_REFERENCE).fieldControls.length!==undefined &&
     sectionControls.fieldsMap.get(FccGlobalConstant.CHILD_REFERENCE).fieldControls.length>0) ||
     sectionControls.fieldsMap.has(FccGlobalConstant.ROLLED_OVER_FROM) ||
     sectionControls.fieldsMap.has(FccGlobalConstant.ROLLED_OVER_TO))) {
      return true;
    }
    return false;
  }


  protected populateChildReferences(sectionControls: any){
    const fieldsMap = 'fieldsMap';
    const data = 'data';
    const key = 'key';
    const firstColumnXCord = this.getXCordBasedOnLang(PdfConstants.FIRST_COLUMN_START_XCORD, PdfConstants.FIRST_COLUMN_START_XCORD_AR);
    let index = 0;
    let fieldIndex = index;
    sectionControls.fieldsMap.forEach(element => {
      if(element !== undefined && element.fieldControls !== undefined &&
        this.commonService.isnonEMptyString(element.fieldControls.key )){
      if (element.fieldControls.key === FccGlobalConstant.CHILD_REFERENCE ||
        element.fieldControls.key === FccGlobalConstant.ROLLED_OVER_FROM ||
        element.fieldControls.key === FccGlobalConstant.ROLLED_OVER_TO){
        fieldIndex = index;
      }
      if (element.fieldControls.length && element.fieldControls.length > 0){
        if (element.fieldControls[0].value !== null && element.fieldControls[0].params.previewScreen){
          ++index;
          }
      } else {
        if (element.fieldControls.value !== null && element.fieldControls.params && element.fieldControls.params.previewScreen){
          ++index;
          }
      }
      const isFirstColumn = fieldIndex % PdfConstants.CHECK_EVEN_NUMBER === 0;
      if (isFirstColumn && this.fieldContentYCord >= this.pageHeight) {
        this.addPage();
        this.fieldLabelYCord = this.ycord + PdfConstants.ADD_20;
        this.fieldContentYCord = this.ycord + PdfConstants.ADD_40;
        this.addHeaderExtraSpace = false;
        this.addSubHeaderExtraSpace = false;
        this.addFieldExtraSpace = false;
        this.addNarrativeTextExtraSpace = false;
        this.lastFieldNarrative = false;
      }
      const gridTable = sectionControls[fieldsMap].get(element.fieldControls.key);
      if (gridTable) {
        this.handleReferences(gridTable, data, key, isFirstColumn, firstColumnXCord, element);
      }
    }
    });
  }

  // Extracted this logic from populateChildReferences() to seperate method
  protected handleReferences(gridTable: any, data: string, key: string, isFirstColumn: boolean, firstColumnXCord: any, element: any) {
    const dataList = gridTable[this.fieldControls][this.params][data];
    if (dataList && dataList.length !== 0) {
      const columnName = gridTable[this.fieldControls][this.params][key];
      const translatedValue = this.translate.instant(columnName);
      if (isFirstColumn) {
        this.setLabelStyles(translatedValue);
        this.addLabelToPdf(translatedValue, firstColumnXCord, PdfConstants.MAX_LENGTH_TWO_COLUMN_230, false);
        this.fieldLabelYCord = this.fieldLabelYCord + PdfConstants.ADD_20;
        this.addHeaderExtraSpace = true;
        this.addSubHeaderExtraSpace = true;
        this.addNarrativeTextExtraSpace = true;
      } else {
        this.handleNonFirstColumn(translatedValue, firstColumnXCord);
      }
      for (const fileData of dataList) {
        const fieldValue = fileData.ChildRefId ? fileData.ChildRefId : fileData[element.fieldControls.key];
        if (isFirstColumn) {
          this.setContentStyles(fieldValue);
          this.addContentValueToPdf(fieldValue, firstColumnXCord, PdfConstants.MAX_LENGTH_TWO_COLUMN_230, false, false, true);
          this.fieldContentYCord = this.fieldContentYCord + PdfConstants.ADD_20;
        } else {
          this.setContentStyles(fieldValue);
          this.addContentValueToPdf(fieldValue, firstColumnXCord, PdfConstants.MAX_LENGTH_TWO_COLUMN_230, false, false, false);
          this.fieldContentYCord = this.fieldContentYCord + PdfConstants.ADD_20;
        }
      }
      this.ycord = this.fieldContentYCord;
    }
  }

  // Extracted this logic from populateChildReferences() to seperate method
  protected handleNonFirstColumn(translatedValue: any, firstColumnXCord: any) {
    if (this.firstColfieldLabelYCordBeforeSplit !== 0 && this.firstColFieldContentYCordBeforeSplit !== 0) {
      this.fieldContentYCord = this.firstColFieldContentYCordBeforeSplit;
      this.fieldLabelYCord = this.firstColfieldLabelYCordBeforeSplit;
      if (this.newPageAddedDuringFirstColSplit) {
        this.pdf.setPage(this.pageNumber - 1);
      }
    }
    this.fieldContentYCord = this.ycord + PdfConstants.ADD_40;
    this.fieldLabelYCord = this.fieldLabelYCord + PdfConstants.ADD_40;
    this.setLabelStyles(translatedValue);
    this.addLabelToPdf(translatedValue, firstColumnXCord, PdfConstants.MAX_LENGTH_TWO_COLUMN_230, true);
    if (this.newPageAddedDuringFirstColSplit && !this.movedToAlreadyAddedPageDuringSecondColSplit) {
      this.pdf.setPage(this.pageNumber);
      /**
       * If the first field content has moved to next page, but the second field content has not moved,
       * then set the yord to after the first field cord.
       */
      this.fieldLabelYCord = this.firstColfieldLabelYCordAfterSplit;
      this.fieldContentYCord = this.firstColFieldContentYCordAfterSplit;
    }
    this.fieldLabelYCord = this.fieldLabelYCord + PdfConstants.ADD_20;
    this.addHeaderExtraSpace = false;
    // Seting addSubHeaderExtraSpace to false here, since we are already adding 20 above.
    this.addSubHeaderExtraSpace = false;
    this.addNarrativeTextExtraSpace = false;
    this.firstColfieldLabelYCordAfterSplit = 0;
    this.firstColfieldLabelYCordBeforeSplit = 0;
  }

  // handleLicenseDocumentSection(sectionHeader: string, emptySection: boolean, sectionControls: any, sectionStyles: any) {
  //   if (this.checkLicenseSections(sectionHeader, this.productCode) && !emptySection) {
  //     this.populateLicenseTableData(sectionHeader, sectionControls, sectionStyles);
  //   } else if (this.checkDocumentsSections(sectionHeader) && !emptySection) {
  //     this.handleDocumentSection(sectionHeader, emptySection, sectionControls, sectionStyles);
  //   } else if (this.checkFeesAndCharges(sectionHeader) && !emptySection) {
  //     this.populateFeesAndCharges(sectionHeader, sectionControls, sectionStyles);
  //   } else {
  //     this.addContentTOPDF(sectionHeader, this.sectionDataMap.get(sectionHeader), sectionStyles);
  //   }
  // }

  protected handleDocumentSection(sectionHeader: string, emptySection: boolean, sectionControls: any, sectionStyles: any) {
    switch (this.productCode) {
      case FccGlobalConstant.PRODUCT_IC:
        this.populateICDocumentsTableData(sectionHeader, sectionControls, sectionStyles);
        break;
      case FccGlobalConstant.PRODUCT_EC:
        this.populateECDocumentsTableData(sectionHeader, sectionControls, sectionStyles);
        break;
    }
  }

  populateECDocumentsTableData(sectionHeader: any, sectionControls: any, sectionStyles: any) {
    this.populateECAttachmentTableData(sectionHeader, sectionControls, sectionStyles);
    const fieldsMap = 'fieldsMap';
    const columns = 'columns';
    const data = 'data';
    const documentGridTable = sectionControls[fieldsMap].get(FccGlobalConstant.documentTableDetails);
    let dataList;
    if (documentGridTable !== undefined){
      dataList = documentGridTable[this.fieldControls][this.params][data];
    }
    let documentNameHeaderFlag = false;
    if (dataList !== undefined && dataList.length !== 0) {
      for ( let i = 0 ; i < dataList.length ; i++ ) {
        if (dataList[i].documentName !== '' && dataList[i].documentName !== null && dataList[i].documentName !== undefined) {
          documentNameHeaderFlag = true;
        }
      }
      const columnsList = documentGridTable[this.fieldControls][this.params][columns];
      let tableHeaders: string[] = [];
      const tableData: any[] = [];
      for (const columnName of columnsList) {
        if (columnName !== 'documentName') {
          const translatedValue = this.translate.instant(columnName);
          tableHeaders.push(translatedValue);
        } else if (documentNameHeaderFlag) {
          const translatedValue = this.translate.instant(columnName);
          tableHeaders.push(translatedValue);
        }
      }
      if (this.language === PdfConstants.LANGUAGE_AR) {
        tableHeaders = this.reverseTableContent(tableHeaders);
      }
      for (const fileData of dataList) {
        let row = [];
        row.push(this.translate.instant(`C064_${fileData.documentType}`));
        if ( documentNameHeaderFlag ) {
          row.push(fileData.documentName);
        }
        row.push(fileData.documentNumber);
        row.push(fileData.documentDate);
        row.push(fileData.numOfOriginals);
        row.push(fileData.numOfPhotocopies);
        row.push(fileData.total);
        row.push(fileData.fileName);
        if (this.language === PdfConstants.LANGUAGE_AR) {
          row = this.reverseTableContent(row);
        }
        tableData.push(row);
      }
      this.fieldLabelYCord = this.ycord + PdfConstants.ADD_10;
      this.fieldContentYCord = this.ycord + PdfConstants.ADD_20;
      const subSectionHeaderTranslated = this.translate.instant(FccGlobalConstant.DOCUMENTS);
      const firstColumnXCord = this.getXCordBasedOnLang(PdfConstants.FIRST_COLUMN_START_XCORD, PdfConstants.FIRST_COLUMN_START_XCORD_AR);
      this.setSubHeaderStyles(subSectionHeaderTranslated);
      this.pdf.text(firstColumnXCord, this.fieldLabelYCord, subSectionHeaderTranslated, this.setTextOption);
      this.createTable(tableHeaders, tableData);
      this.ycord = this.ycord + PdfConstants.ADD_30;
    }
  }
populateFeesAndCharges(sectionHeader: any, sectionControls: any, sectionStyles: any) {
    const fieldsMap = 'fieldsMap';
    const columns = 'columns';
    const data = 'data';
    const gridTable = sectionControls[fieldsMap].get(FccGlobalConstant.FEES_AND_CHARGES);
    const dataList = gridTable[this.fieldControls][this.params][data];
    if (dataList.length !== 0) {
      const columnsList = gridTable[this.fieldControls][this.params][columns];
      let tableHeaders: string[] = [];
      const tableData: any[] = [];
      for (const columnName of columnsList) {
        const translatedValue = this.translate.instant(columnName.header);
        tableHeaders.push(translatedValue);
      }
      if (this.language === PdfConstants.LANGUAGE_AR) {
        tableHeaders = this.reverseTableContent(tableHeaders);
      }
      for (const fileData of dataList) {
        let row = [];
        row.push(fileData.ChargeType);
        row.push(fileData.Description);
        row.push(fileData.tnx_cur_code);
        row.push(fileData.amount);
        row.push(fileData.tnx_stat_code);
        row.push(fileData.SettlementDate);
        if (this.language === PdfConstants.LANGUAGE_AR) {
          row = this.reverseTableContent(row);
        }
        tableData.push(row);
      }
      this.addSectionHeaderToPDF(sectionHeader, sectionStyles);
      this.createTable(tableHeaders, tableData);
      this.ycord = this.ycord + PdfConstants.ADD_30;
    } else {
      this.addContentTOPDF(sectionHeader, undefined, sectionStyles);
    }
  }
  reverseTableContent(DataArray: string[]) {
    const DataArrayLength = DataArray.length;
    const DataArrayArabic: string[] = [];
    for (let i = 0; i < DataArrayLength; i++) {
      DataArrayArabic.push(DataArray.pop());
    }
    return DataArrayArabic;
  }

  populateLicenseTableData(sectionHeader: any, sectionControls: any, sectionStyles: any) {
    const fieldsMap = 'fieldsMap';
    const columns = 'columns';
    const data = 'data';
    const documentGridTable = sectionControls[fieldsMap].get(FccGlobalConstant.LICENSE);
    if (documentGridTable) {
      const dataList = documentGridTable[this.fieldControls][this.params][data];
      if (dataList.length !== 0) {
        const columnsList = documentGridTable[this.fieldControls][this.params][columns];
        let tableHeaders: string[] = [];
        const tableData: any[] = [];
        for (const columnName of columnsList) {
          const translatedValue = this.translate.instant(columnName);
          tableHeaders.push(translatedValue);
        }
        if (this.language === PdfConstants.LANGUAGE_AR) {
          tableHeaders = this.reverseTableContent(tableHeaders);
        }
        for (const fileData of dataList) {
          const row = [];
          row.push(fileData.REF_ID);
          row.push(fileData.BO_REF_ID);
          row.push(fileData.LS_NUMBER);
          row.push(fileData.currency);
          row.push(fileData.amount);
          if (this.language === PdfConstants.LANGUAGE_AR) {
            tableHeaders = this.reverseTableContent(tableHeaders);
          }
          tableData.push(row);
        }
        this.addSectionHeaderToPDF(sectionHeader, sectionStyles);
        this.createTable(tableHeaders, tableData);
        this.ycord = this.ycord + PdfConstants.ADD_30;
      } else {
        this.addContentTOPDF(sectionHeader, undefined, sectionStyles);
      }
    }
  }

  addContentTOPDF(sectionHeader, sectionDetails, sectionStyles, showSectionHeader : boolean = true) {
    const firstColumnXCord = this.getXCordBasedOnLang(PdfConstants.FIRST_COLUMN_START_XCORD, PdfConstants.FIRST_COLUMN_START_XCORD_AR);
    const addNotEntered = this.checkForNotEntered(sectionHeader);
    const isAttachmentSection = this.checkFileUploadSections(sectionHeader);
    const isLicenseSection = this.checkLicenseSections(sectionHeader, this.productCode);
    if (this.isSectionEmpty(sectionDetails)) {
      if (addNotEntered) {
        this.addSectionHeaderToPDF(sectionHeader, sectionStyles);
        if (sectionHeader === FccGlobalConstant.EC_DOCUMENT_DETAILS &&
            this.documentsectionnotemptyflag) {
          this.fieldLabelYCord = this.fieldLabelYCord + PdfConstants.ADD_30;
          this.fieldContentYCord = this.fieldContentYCord + PdfConstants.ADD_30;
          const subSectionHeaderTranslated = this.translate.instant(FccGlobalConstant.FILE_UPLOAD_TABLE);
          this.setSubHeaderStyles(subSectionHeaderTranslated);
          this.pdf.text(firstColumnXCord, this.fieldLabelYCord, subSectionHeaderTranslated, this.setTextOption);
        }

        this.fieldLabelYCord = this.fieldLabelYCord + PdfConstants.ADD_20;
        this.fieldContentYCord = this.fieldContentYCord + PdfConstants.ADD_20;
        this.checkAddPage(PdfConstants.ADD_30, PdfConstants.ADD_50);
        this.addHeaderExtraSpace = false;
        this.lastFieldNarrative = false;
        if (isAttachmentSection || (sectionHeader === FccGlobalConstant.EC_DOCUMENT_DETAILS &&
          this.documentsectionnotemptyflag) ) {
          this.setContentStyles(this.translate.instant(FccGlobalConstant.NO_ATTACHMENT));
          this.pdf.text(firstColumnXCord, this.fieldLabelYCord, this.translate.instant(FccGlobalConstant.NO_ATTACHMENT),
           this.setTextOption);
        }else if (isLicenseSection) {
          this.setContentStyles(this.translate.instant(FccGlobalConstant.NO_LICENSE));
          this.pdf.text(firstColumnXCord, this.fieldLabelYCord, this.translate.instant(FccGlobalConstant.NO_LICENSE), this.setTextOption);
        } else if(sectionHeader !== FccGlobalConstant.POPUP_MSG){
          this.setContentStyles(this.notEntered);
          this.pdf.text(firstColumnXCord, this.fieldLabelYCord, this.notEntered, this.setTextOption);
        }

      } else if (this.fieldContentYCord === 0){
        this.fieldContentYCord = this.ycord;
      }
    } else {
      let totalSectionHeight = PdfConstants.ADD_30 + PdfConstants.ADD_30 + PdfConstants.ADD_20;
      let firstSection = [];
      if (sectionDetails.fieldsMap.size){
        firstSection = sectionDetails.fieldsMap.entries().next().value;
      }
      if (firstSection[1].listOfFields && firstSection[1].listOfFields.length && firstSection[1].isSubSection) {
        totalSectionHeight = totalSectionHeight + PdfConstants.ADD_40;
        this.checkAddPageForHeader(PdfConstants.ADD_30, PdfConstants.ADD_50, totalSectionHeight);
      }
      this.addSectionHeaderToPDF(sectionHeader, sectionStyles, showSectionHeader);
      this.fieldLabelYCord = this.fieldLabelYCord + PdfConstants.ADD_20;
      this.fieldContentYCord = this.fieldContentYCord + PdfConstants.ADD_20;
      let index = 0;
      this.fieldIndexCount = 1;
      for (const [subSectionHeader, subSectionControl] of sectionDetails.fieldsMap) {
        this.lastFieldNarrative = false;
        if (subSectionControl.listOfFields === undefined || subSectionControl.listOfFields.length === 0) {
          if (addNotEntered) {
            if (subSectionControl.isSubSection && (!subSectionControl.hideSubHeader)) {
              index = 0;
              this.addSubSectionHeaderToPDF(subSectionHeader, subSectionControl);
            }
            this.addSubHeaderExtraSpace = false;
            this.setContentStyles(this.notEntered);
            if (index % PdfConstants.CHECK_EVEN_NUMBER === 0) {
              this.pdf.text(firstColumnXCord, this.fieldLabelYCord, this.notEntered, this.setTextOption);
            } else {
              this.pdf.text(PdfConstants.SECOND_COLUMN_START_XCORD, this.fieldLabelYCord, this.notEntered, this.setTextOption);
            }
            this.fieldLabelYCord = this.fieldLabelYCord + PdfConstants.ADD_20;
            this.fieldContentYCord = this.fieldContentYCord + PdfConstants.ADD_20;
            this.addFieldExtraSpace = true;
          }
        } else {
          if (subSectionControl.isSubSection) {
            if (!subSectionControl.hideSubHeader) {
              index = 0;
              let totalSubSectionHeight = PdfConstants.ADD_30;
              if (subSectionControl.listOfFields.length){
                totalSubSectionHeight = totalSubSectionHeight + PdfConstants.ADD_40;
                this.checkAddPageForHeader(PdfConstants.ADD_30, PdfConstants.ADD_50, totalSubSectionHeight);
              }
              this.addSubSectionHeaderToPDF(subSectionHeader, subSectionControl);
            } else if (subSectionControl.hideSubHeader && subSectionControl.listOfFields.length > 1) {
              /**
               * If the previous field was the first column, then after adding field, index would have been updated to second column,
               * and will be odd number.
               * So in that case, the label and content Ycord will not be updated, hence incrementing.
               * Post that reset the index to start group fields from first column.
               */
              if (index % PdfConstants.CHECK_EVEN_NUMBER !== 0) {
                this.fieldLabelYCord = this.fieldLabelYCord + PdfConstants.ADD_40;
                this.fieldContentYCord = this.fieldContentYCord + PdfConstants.ADD_40;
              }
              index = 0;
            }
          }
          if (subSectionControl.fieldType === FccGlobalConstant.MAT_CARD) {
            let topLineYCord;
            /**
             * Set ycord for the line and the fields based on the previous field position(first or second column).
             */
            if (index % PdfConstants.CHECK_EVEN_NUMBER === 0) {
              topLineYCord = this.fieldContentYCord;
              this.fieldLabelYCord = this.fieldContentYCord + PdfConstants.ADD_20;
              this.fieldContentYCord = this.fieldContentYCord + PdfConstants.ADD_40;
            } else {
              topLineYCord = this.fieldContentYCord + PdfConstants.ADD_20;
              this.fieldLabelYCord = this.fieldContentYCord + PdfConstants.ADD_40;
              this.fieldContentYCord = this.fieldContentYCord + PdfConstants.ADD_60;
            }
            index = 0;
            const xcordStart = PdfConstants.CARD_LINE_X_CORD_START;
            const xCordEnd = this.getXCordBasedOnLang(PdfConstants.FOOTER_LINE_X2, PdfConstants.FIRST_COLUMN_START_XCORD_AR + 5);
            this.pdf.line(xcordStart, topLineYCord, xCordEnd, topLineYCord); // first horizontal
            // Add Card Header
            this.addCardHeader(subSectionControl, subSectionHeader);
            // Add Card Fields
            subSectionControl.listOfFields.forEach((fieldDetails: any) => {
              if (fieldDetails && fieldDetails !== null) {
                this.addFieldDetailsInPdf(index, fieldDetails);
                /**
                 * If a single row field placed at even index, then increment index an extra time,
                 * so it will move to odd index and then move to even in the next increment which is common and hence move to a new line.
                 */
                if (fieldDetails.singleColumn && index % PdfConstants.CHECK_EVEN_NUMBER === 0) {
                  ++index;
                }
                ++index;
                this.resetPDFStyles(fieldDetails[this.pdfParams]);
              }
            });
            let bottomLineYCord;
            if (index % PdfConstants.CHECK_EVEN_NUMBER === 0) {
              bottomLineYCord = this.fieldContentYCord - PdfConstants.ADD_30;
            } else {
              bottomLineYCord = this.fieldContentYCord + PdfConstants.ADD_10;
            }
            this.pdf.line(xcordStart, topLineYCord, xcordStart, bottomLineYCord); // first vertical
            this.pdf.line(xCordEnd, topLineYCord, xCordEnd, bottomLineYCord); // second vertical
            this.pdf.line(xcordStart, bottomLineYCord, xCordEnd, bottomLineYCord); // second horizontal
            this.fieldLabelYCord = bottomLineYCord + PdfConstants.ADD_20;
            this.fieldContentYCord = bottomLineYCord + PdfConstants.ADD_40;
            // Reset index to zero after the card details are added so that the next data will start from the first column.
            index = 0;
          } else if (subSectionControl.fieldType === FccGlobalConstant.expansionPanelTable
            && this.tnxTypeCode === FccGlobalConstant.N002_NEW) {
            if (this.fieldIndexCount % FccGlobalConstant.LENGTH_2 === 0) {
              this.fieldLabelYCord = this.fieldLabelYCord + PdfConstants.ADD_30;
              this.fieldContentYCord = this.fieldContentYCord + PdfConstants.ADD_30;
            }
            this.fieldIndexCount = 1;
            this.populateRemInstTableData(sectionHeader, subSectionControl, subSectionHeader, firstColumnXCord);
          } else if (subSectionControl.pdfFieldType && subSectionControl.pdfFieldType === 'table') {
            if (this.fieldIndexCount % FccGlobalConstant.LENGTH_2 === 0) {
              this.fieldLabelYCord = this.fieldLabelYCord + PdfConstants.ADD_30;
              this.fieldContentYCord = this.fieldContentYCord + PdfConstants.ADD_30;
            }
            this.fieldIndexCount = 1;
            this.populateTableData(sectionHeader, subSectionControl, subSectionHeader, firstColumnXCord);
          } else {
            this.eventsection = this.isEventInquirySections(sectionHeader);
            subSectionControl.listOfFields.forEach((fieldDetails: any) => {
              this.fieldIndexCount++;
              if (fieldDetails && fieldDetails !== null && fieldDetails.value && fieldDetails.value !== '[object Object]') {
                this.addFieldDetailsInPdf(index, fieldDetails);
                /**
                 * If a single row field placed at even index, then increment index an extra time,
                 * so it will move to odd index and then move to even in the next increment which is common and hence move to a new line.
                 */
                if (fieldDetails.singleColumn && index % PdfConstants.CHECK_EVEN_NUMBER === 0) {
                  ++index;
                }
                ++index;
                this.resetPDFStyles(fieldDetails[this.pdfParams]);
              }
            });
          }
        }
      }
    }
    if (this.fieldContentYCord > this.ycord) {
      this.ycord = this.fieldContentYCord;
    }
    this.addNarrativeTextExtraSpace = false;
    this.resetPDFStyles(sectionStyles);
  }

  addCardHeader(subSectionControl, subSectionHeader) {
    const cardHeader = this.translate.instant(subSectionHeader);
    this.setCardHeaderStyles(cardHeader);
    const headerXCord = this.getXCordBasedOnLang(PdfConstants.FIRST_COLUMN_START_XCORD, PdfConstants.FIRST_COLUMN_START_XCORD_AR);
    this.pdf.text(headerXCord, this.fieldLabelYCord, cardHeader, this.setTextOption);
    this.fieldLabelYCord = this.fieldLabelYCord + PdfConstants.ADD_20;
    this.fieldContentYCord = this.fieldContentYCord + PdfConstants.ADD_20;
    this.resetPDFStyles(subSectionControl[this.pdfParams]);
  }

  checkAddPageForHeader(labelGap, contentGap, sectionHeight: number) {
    if (this.fieldContentYCord + sectionHeight >= this.pageHeight || sectionHeight > this.pageHeight) {
      this.addPage();
      this.fieldLabelYCord = this.ycord + labelGap;
      this.fieldContentYCord = this.ycord + contentGap;
      this.addHeaderExtraSpace = false;
      this.addSubHeaderExtraSpace = false;
      this.addFieldExtraSpace = false;
      this.lastFieldNarrative = false;
    }
  }

  generateEmptyFile() {
    this.pdf = new jsPDF('p', 'pt', 'a4');
    const ycordInit = PdfConstants.Y_CORD_INIT_140;
    this.ycord = ycordInit;
    this.addFontArabic();
    this.addOtherFonts();
    this.addBackgroundImage();
    if (this.pdfStylesService.getShowHeader()) {
      this.addHeaderText();
    }
    this.addHeaderImage();
    if (this.productCode !== FccGlobalConstant.PRODUCT_SE || (this.subProductCode === FccGlobalConstant.SUB_PRODUCT_SEEML
      || this.subProductCode === FccGlobalConstant.SUB_PRODUCT_CTCHP)) {
      // Retaining the code for more refactoring required later.
      //this.addDownloadDateTime();
      this.addDateFormatNote();
    }
    this.addLeftBar();
    this.addRightBar();
    const pageHeightSub = PdfConstants.PAGE_HEIGHT_SUB_80;
    this.pageHeight = this.pdf.internal.pageSize.height - pageHeightSub;
  }

  getXCordBasedOnLang(XCordleft, xCordRight) {
    if (this.language === PdfConstants.LANGUAGE_AR) {
      return xCordRight;
    }
    return XCordleft;
  }

  addHeaderText() {
    if(this.isAccountStatementDownload || this.isAccSummaryDashboard)
    {
     this.pdf.setFont(this.pdfStylesService.getBankAddressFont(),PdfConstants.FONT_STYLE_BOLD);
    } else{
      this.pdf.setFont(this.pdfStylesService.getBankAddressFont());
    }
    this.pdf.setFontSize(this.pdfStylesService.getBankAddressFontSize());
    this.pdf.setTextColor(this.pdfStylesService.getBankAddressFontColour());
    let bankDetailsXCordAR = PdfConstants.BANK_DETAILS_X_COORD_530_AR;
    if (this.pdfMode && this.pdfMode === FccGlobalConstant.PDF_MODE_LANDSCAPE) {
      bankDetailsXCordAR = PdfConstants.LANDSCAPE_BANK_DETAILS_X_COORD_750_AR;
    }
    const bankDetailsXCoOrd = this.getXCordBasedOnLang(PdfConstants.BANK_DETAILS_X_COORD_50, bankDetailsXCordAR);
    let bankDetailsYCoOrd = PdfConstants.BANK_DETAILS_Y_COORD_100;
    const swiftAddress = 'SWIFTAddress';
    const name = 'name';
    if( this.isAccSummaryDashboard && this.isRepeatHeader)
    {
      this.setTextOption= { align: PdfConstants.ALIGN_LEFT };
    }
    if((this.isAccountStatementDownload || this.isAccSummaryDashboard)
      && this.headerAlignment !== FccGlobalConstant.ALIGN_TOP_LEFT && this.headerAlignment !== FccGlobalConstant.EMPTY_VALUE_CHECK
      && this.headerAlignment !== " ")
    {
      bankDetailsYCoOrd= PdfConstants.ADD_70;
    }
    if( this.isAccSummaryDashboard && this.isRepeatHeader && this.language === PdfConstants.LANGUAGE_AR)
    {
      this.setTextOption= { align: PdfConstants.ALIGN_RIGHT };
    }
    if (this.bankDetails[name] && this.bankDetails[name] !== '' && this.bankDetails[name] != null) {
        this.pdf.text(bankDetailsXCoOrd, bankDetailsYCoOrd, this.bankDetails[name], this.setTextOption);
    }
    //TODO:: Condition to be updated to more meaningful one.
    if (this.productCode !== FccGlobalConstant.PRODUCT_SE || (this.subProductCode === FccGlobalConstant.SUB_PRODUCT_SEEML
      || this.subProductCode === FccGlobalConstant.SUB_PRODUCT_CTCHP)) {
        this.addDownloadDateTime(bankDetailsYCoOrd);
      }
    this.pdf.setFont(this.pdfStylesService.getBankAddressFont(),PdfConstants.FONT_STYLE_NORMAL);
    if (this.bankDetails[swiftAddress].line1 && this.bankDetails[swiftAddress].line1 !== ''
      && this.bankDetails[swiftAddress].line1 != null) {
      bankDetailsYCoOrd = bankDetailsYCoOrd + PdfConstants.NEXT_LINE_12;
      this.pdf.text(bankDetailsXCoOrd, bankDetailsYCoOrd, this.bankDetails[swiftAddress].line1, this.setTextOption);
    }
    if (this.bankDetails[swiftAddress].line2 && this.bankDetails[swiftAddress].line2 !== ''
      && this.bankDetails[swiftAddress].line2 != null) {
      bankDetailsYCoOrd = bankDetailsYCoOrd + PdfConstants.NEXT_LINE_12;
      this.pdf.text(bankDetailsXCoOrd, bankDetailsYCoOrd, this.bankDetails[swiftAddress].line2, this.setTextOption);
    }
    if (this.bankDetails[swiftAddress].line3 && this.bankDetails[swiftAddress].line3 !== ''
      && this.bankDetails[swiftAddress].line3 != null) {
      bankDetailsYCoOrd = bankDetailsYCoOrd + PdfConstants.NEXT_LINE_12;
      this.pdf.text(bankDetailsXCoOrd, bankDetailsYCoOrd, this.bankDetails[swiftAddress].line3, this.setTextOption);
    }

    const isoCode = 'isoCode';
    if (this.bankDetails[isoCode] && this.bankDetails[isoCode] !== null) {
      const swiftDetailsLabel = this.translate.instant('SWIFT');
      this.setLabelStyles(swiftDetailsLabel);
      bankDetailsYCoOrd = bankDetailsYCoOrd + PdfConstants.NEXT_LINE_12;
      this.pdf.text(bankDetailsXCoOrd, bankDetailsYCoOrd, swiftDetailsLabel, this.setTextOption);
      this.setContentStyles(this.bankDetails[isoCode]);
      bankDetailsYCoOrd = bankDetailsYCoOrd + PdfConstants.NEXT_LINE_12;
      this.pdf.text(bankDetailsXCoOrd, bankDetailsYCoOrd, this.bankDetails[isoCode], this.setTextOption);
    }
    this.ycord = bankDetailsYCoOrd + PdfConstants.ADD_20;
    if (this.commonService.isnonEMptyString(this.tableName) && !this.isAccSummaryDashboard && !this.isAccountStatementDownload) {
      this.pdf.setFont(this.pdfStylesService.getProductCodeFont(), PdfConstants.FONT_STYLE_BOLD);
      this.pdf.setFontSize(this.pdfStylesService.getProductCodeFontSize());
      this.pdf.setTextColor(this.pdfStylesService.getProductCodeFontColour());
      const tableNameDisplay = this.translate.instant(this.tableName);
      const headerProductCodeXcord = this.getHeaderProductCodeXCord();
      this.checkArabicFont(tableNameDisplay, this.pdfStylesService.getProductCodeFont(), PdfConstants.FONT_STYLE_BOLD);
      const splitHeader = this.pdf.splitTextToSize(tableNameDisplay, PdfConstants.HEADER_PRODUCT_CODE_X_COORD_415_AR);
      this.pdf.text(headerProductCodeXcord, PdfConstants.HEADER_PRODUCT_CODE_Y_COORD_35, splitHeader, this.setTextOption);
    }else {
    if (this.productCode && this.productCode !== null && this.productCode !== '' && !this.commonService.isnonEMptyString(this.tableName)) {
      this.pdf.setFont(this.pdfStylesService.getProductCodeFont(), PdfConstants.FONT_STYLE_BOLD);
      this.pdf.setFontSize(this.pdfStylesService.getProductCodeFontSize());
      this.pdf.setTextColor(this.pdfStylesService.getProductCodeFontColour());
      const productCodeValue = this.generateLabelFromProductCode();
      const headerProductCodeXcord = this.getHeaderProductCodeXCord();
      this.checkArabicFont(productCodeValue, this.pdfStylesService.getProductCodeFont(), PdfConstants.FONT_STYLE_BOLD);
      this.pdf.text(headerProductCodeXcord, PdfConstants.HEADER_PRODUCT_CODE_Y_COORD_35, productCodeValue, this.setTextOption);
    }
    if (this.subProductCode && this.subProductCode !== null && this.subProductCode !== '' &&
      this.subProductCode !== undefined && this.subProductCode !== 'undefined'
      && this.checkSubProductCodeRequired()) {
      this.pdf.setFont(this.pdfStylesService.getSubProductCodeFont(), PdfConstants.FONT_STYLE_BOLD);
      this.pdf.setFontSize(this.pdfStylesService.getSubProductCodeFontSize());
      this.pdf.setTextColor(this.pdfStylesService.getSubProductCodeFontColour());
      this.pdf.setFontSize(PdfConstants.SUB_PRODUCT_CODE_FONT_SIZE);
      const subProductCodeValue = this.translate.instant(this.subProductCode);
      const subProdXCord = this.getHeaderProductCodeXCord();
      this.checkArabicFont(subProductCodeValue, this.pdfStylesService.getSubProductCodeFont(), PdfConstants.FONT_STYLE_BOLD);
      this.pdf.text(subProdXCord, PdfConstants.HEADER_SUB_PRODUCT_CODE_Y_COORD_60,
        subProductCodeValue, this.setTextOption);
    }
  }
  }

  checkSubProductCodeRequired() {
    return (this.subProductCode !== FccGlobalConstant.SE_SUB_PRODUCT_CODE_COCQS
    && this.subProductCode !== FccGlobalConstant.SE_SUB_PRODUCT_CODE
    && this.subProductCode !== FccGlobalConstant.SUB_PRODUCT_LNRPN
    && this.subProductCode !== FccGlobalConstant.SUB_PRODUCT_BLFP
    && this.subProductCode !== FccGlobalConstant.N047_LOAN_DRAWDOWN
    && this.subProductCode !== FccGlobalConstant.N047_LOAN_SWINGLINE
    && this.subProductCode !== FccGlobalConstant.SUB_PRODUCT_SEEML
    && this.subProductCode !== FccGlobalConstant.SUB_PRODUCT_CTCHP);
  }

  generateLabelFromProductCode() {
    let productCodeValue = '';
    if (this.productCode === FccGlobalConstant.PRODUCT_SE) {
      if (this.subProductCode === FccGlobalConstant.SE_SUB_PRODUCT_CODE) {
        productCodeValue = this.translate.instant('chequeBookRequest');
      } else if (this.subProductCode === FccGlobalConstant.SE_SUB_PRODUCT_CODE_COCQS) {
        productCodeValue = this.translate.instant('SECOCQSINITIATE01');
      } else if (this.subProductCode === FccGlobalConstant.SUB_PRODUCT_SEEML) {
        productCodeValue = this.translate.instant('N047_SEEML');
      } else if (this.subProductCode === FccGlobalConstant.SUB_PRODUCT_CTCHP) {
        productCodeValue = this.translate.instant('SE.CTCHP');
      }
    } else if (this.subProductCode === FccGlobalConstant.SUB_PRODUCT_LNCDS) {
      productCodeValue = this.translate.instant(this.subProductCode);
    } else if (this.subProductCode === FccGlobalConstant.SUB_PRODUCT_BLFP) {
      productCodeValue = this.translate.instant('LIST_N003_B3');
    } else if (this.subProductCode === FccGlobalConstant.SUB_PRODUCT_LNRPN) {
      productCodeValue = this.translate.instant('LIST_N003_28');
    } else if (this.productCode !== FccGlobalConstant.PRODUCT_BENE) {
      productCodeValue = this.translate.instant(this.productCode);
    }
    return productCodeValue;
  }

  /*
   * The method is used to add the background watermark image.
   */
  addBackgroundImage() {
    this.pdf.setPage(this.pageNumber);
    if (this.pdfStylesService.getShowWatermark()) {
      if (this.watermarkImageExtension) {
        this.pdf.addSvgAsImage(this.watermarkImage, this.watermarkConfig.xcord, this.watermarkConfig.ycord,
          this.watermarkConfig.length, this.watermarkConfig.width, 'watermark', 'NONE', PdfConstants.BACKGROUND_IMAGE_ROTATION);
      } else {
        this.pdf.addImage(this.watermarkImage, 'JPEG', this.watermarkConfig.xcord, this.watermarkConfig.ycord,
        this.watermarkConfig.length, this.watermarkConfig.width, 'watermark', 'NONE', PdfConstants.BACKGROUND_IMAGE_ROTATION);
      }
    }
  }

  addLeftBar(pageNumber?: any, leftBarText : any = '') {
    if (this.commonService.isnonEMptyString(pageNumber)) {
      this.pdf.setPage(pageNumber);
    }
    if (this.pdfStylesService.getShowLeftBar()) {
      // Left Side Bar
      this.pdf.setDrawColor(this.pdfStylesService.getLeftBarColour());
      this.pdf.setLineWidth(this.pdfStylesService.getLeftBarWidth());
      let leftBarXCordAR = PdfConstants.LEFT_BAR_X_AR;
      if (this.pdfMode && this.pdfMode === FccGlobalConstant.PDF_MODE_LANDSCAPE) {
        leftBarXCordAR = PdfConstants.LANDSCAPE_LEFT_BAR_X_AR;
      }
      const leftBarXCor = this.getXCordBasedOnLang(PdfConstants.LEFT_BAR_X, leftBarXCordAR);
      this.pdf.line(leftBarXCor, PdfConstants.LEFT_BAR_Y1, leftBarXCor, PdfConstants.LEFT_BAR_Y2);
      // Print Product Code in the left border.
      if (this.commonService.isnonEMptyString(this.tableName)) {
        this.pdf.setFont(this.pdfStylesService.getLeftBarTextFont(), this.pdfStylesService.getLeftBarTextFontStyle());
        this.pdf.setFontSize(this.pdfStylesService.getLeftBarTextFontSize());
        this.pdf.setTextColor(this.pdfStylesService.getLeftBarTextFontColour());
        const tableNameDisplay = this.translate.instant(this.tableName);
        this.checkArabicFont(tableNameDisplay, this.pdfStylesService.getLeftBarTextFont(),
        this.pdfStylesService.getLeftBarTextFontStyle());
        let leftBarTextAR = PdfConstants.LEFT_BAR_PRDUCT_CODE_X_CORD_585_AR;
        if (this.pdfMode && this.pdfMode === FccGlobalConstant.PDF_MODE_LANDSCAPE) {
          leftBarTextAR = PdfConstants.LANDSCAPE_LEFT_BAR_PRDUCT_CODE_X_CORD_830_AR;
        }
        const tableNametext = this.getXCordBasedOnLang(PdfConstants.LEFT_BAR_PRODUCT_CODE_X_COORD_15, leftBarTextAR);
        this.pdf.text(tableNametext, PdfConstants.LEFT_BAR_PRODUCT_CODE_Y_COORD_400,
          tableNameDisplay, null, PdfConstants.LEFT_BAR_PRODUCT_CODE_ROTATION_90);
      }else {
      if ((this.productCode && this.productCode !== null && this.productCode !== '')) {
      this.pdf.setFont(this.pdfStylesService.getLeftBarTextFont(), this.pdfStylesService.getLeftBarTextFontStyle());
      this.pdf.setFontSize(this.pdfStylesService.getLeftBarTextFontSize());
      this.pdf.setTextColor(this.pdfStylesService.getLeftBarTextFontColour());
      let prodCodeValue = this.generateLabelFromProductCode();
      this.checkArabicFont(prodCodeValue, this.pdfStylesService.getLeftBarTextFont(),
      this.pdfStylesService.getLeftBarTextFontStyle());
      const productCodetext = this.getXCordBasedOnLang(PdfConstants.LEFT_BAR_PRODUCT_CODE_X_COORD_15,
      PdfConstants.LEFT_BAR_PRDUCT_CODE_X_CORD_585_AR);
      if(this.commonService.isnonEMptyString(leftBarText)){
        prodCodeValue = leftBarText;
      }
      this.pdf.text(productCodetext, PdfConstants.LEFT_BAR_PRODUCT_CODE_Y_COORD_400,
        prodCodeValue, null, PdfConstants.LEFT_BAR_PRODUCT_CODE_ROTATION_90);
      }
      }
    }
  }

  addRightBar(pageNumber?: any) {
    if (this.commonService.isnonEMptyString(pageNumber)) {
      this.pdf.setPage(pageNumber);
    }
    // Draw a background colour
    this.pdf.setDrawColor(this.pdfStylesService.getRightBarColour());
    this.pdf.setLineWidth(this.pdfStylesService.getRightBarWidth());
    let rightbarXcord;
    if (this.pdfMode && this.pdfMode === FccGlobalConstant.PDF_MODE_LANDSCAPE) {
      rightbarXcord = this.getXCordBasedOnLang(PdfConstants.RIGHT_BAR_X_LANDSCAPE, PdfConstants.RIGHT_BAR_X_AR);
    } else {
      rightbarXcord = this.getXCordBasedOnLang(PdfConstants.RIGHT_BAR_X, PdfConstants.RIGHT_BAR_X_AR);
    }
    this.pdf.line(rightbarXcord, PdfConstants.RIGHT_BAR_Y1, rightbarXcord, PdfConstants.RIGHT_BAR_Y2);
  }

   // Styling for for lineBreak for Master Note
   // eslint-disable-next-line @typescript-eslint/no-unused-vars
   addLineBreakforMasterBar(BarText) {
    // BackGround Bar for lineBreak for Master Note
    this.pdf.setDrawColor(this.pdfStylesService.getLineBreakForMaster());
    this.pdf.setLineWidth(12);
    this.pdf.line(PdfConstants.LEFT_BAR_LINE_WIDTH_30,this.fieldLabelYCord - PdfConstants.LINE_WIDTH_DIFF_3,
       PdfConstants.BAR_LINE_WIDTH_460, this.fieldLabelYCord - 3); //horizental bar
    this.pdf.setDrawColor(this.pdfStylesService.getLineBreakSideBar());
    this.pdf.setLineWidth(12);
    this.pdf.line(PdfConstants.LEFT_BAR_LINE_WIDTH_30, this.fieldLabelYCord -PdfConstants.LINE_WIDTH_DIFF_3 ,
      PdfConstants.BAR_LINE_WIDTH_36, this.fieldLabelYCord -3); // Vertical bar
    this.pdf.setFont(this.pdfStylesService.getLeftBarTextFont(), this.pdfStylesService.getLeftBarTextFontStyle());
      this.pdf.setFontSize(this.pdfStylesService.getLeftBarTextFontSize());
      this.pdf.setTextColor(this.pdfStylesService.getLineBreakBarTextFontColour());
      this.pdfStylesService.getLeftBarTextFontStyle();
      const productCodetext = this.getXCordBasedOnLang(PdfConstants.LEFT_BAR_PRODUCT_CODE_X_COORD_15,
      PdfConstants.LEFT_BAR_PRDUCT_CODE_X_CORD_585_AR);
  }

  addHeaderImage(pageNumber?: any) {
    if (this.commonService.isnonEMptyString(pageNumber)) {
      this.pdf.setPage(pageNumber);
    }
    if (this.pdfStylesService.getShowLogo()) {
      if (this.logoImageExtension) {
        this.pdf.addSvgAsImage(this.headerlogo, this.logoConfig.xcord, this.logoConfig.ycord, this.logoConfig.length,
          this.logoConfig.width);
      } else {
        if ((this.isAccountStatementDownload || this.isAccSummaryDashboard)) {
        if (this.repeatLogoEnabled || (!this.repeatLogoEnabled && pageNumber === 1))
        {
          if (this.headerAlignment === FccGlobalConstant.ALIGN_TOP_RIGHT) {
            this.logoBasedOnbankConfig.xcord = PdfConstants.ADD_700;
            this.logoBasedOnbankConfig.ycord = PdfConstants.ADD_12;
            this.pdf.addImage(this.headerlogo, 'JPEG', this.logoBasedOnbankConfig.xcord, this.logoBasedOnbankConfig.ycord,
             this.logoConfig.length,this.logoConfig.width);
          } else
            if (this.headerAlignment === FccGlobalConstant.ALIGN_BOTTOM_LEFT) {
              this.logoBasedOnbankConfig.ycord = PdfConstants.y_CORD_480;
              this.pdf.addImage(this.headerlogo, 'JPEG', this.logoConfig.xcord, this.logoBasedOnbankConfig.ycord, this.logoConfig.length,
                this.logoConfig.width);
            }
            else
              if (this.headerAlignment === FccGlobalConstant.ALIGN_BOTTOM_RIGHT) {
                this.logoBasedOnbankConfig.xcord = PdfConstants.X_CORD_680;
                this.logoBasedOnbankConfig.ycord = PdfConstants.y_CORD_500;
                this.pdf.addImage(this.headerlogo, 'JPEG', this.logoBasedOnbankConfig.xcord, this.logoBasedOnbankConfig.ycord,
                  this.logoConfig.length,
                  this.logoConfig.width);
              }
               else
              if(this.headerAlignment === FccGlobalConstant.ALIGN_TOP_LEFT){
                this.pdf.addImage(this.headerlogo, 'JPEG', this.logoConfig.xcord, this.logoConfig.ycord, this.logoConfig.length,
                  this.logoConfig.width);
              }
              else{
                this.pdf.addImage(this.headerlogo, 'JPEG', this.logoConfig.xcord, this.logoConfig.ycord, this.logoConfig.length,
                this.logoConfig.width);
              }
            }
        } else
          {
            this.pdf.addImage(this.headerlogo, 'JPEG', this.logoConfig.xcord, this.logoConfig.ycord, this.logoConfig.length,
              this.logoConfig.width);
          }
      }
    }
  }

  getHeaderLogoForExcel(){
    return this.headerlogo;
  }

  addDateFormatNote() {
    this.pdf.setFontSize(this.pdfStylesService.sectionContentFontSize);
    this.pdf.setTextColor(this.pdfStylesService.sectionContentFontColour);
    /**
     * Add the note based at the next ycord value.
     */
    this.ycord = this.ycord + PdfConstants.ADD_10;
    let dateFormatMessage = this.translate.instant('dateFollows');
    const isArabic = this.arabicEncoding.test(dateFormatMessage);
    if (isArabic) {
      dateFormatMessage = dateFormatMessage + ' : ' + this.translate.instant('arabicdateFormat');
      this.pdf.setFont(PdfConstants.ARABIC_BOLD_COURIER);
    } else {
      dateFormatMessage = dateFormatMessage + ' ' + this.utilityService.getDisplayDateFormat();
      this.pdf.setFont(this.pdfStylesService.sectionContentFont, PdfConstants.FONT_STYLE_ITALICS);
    }
    let xcord = PdfConstants.X_CORD_430;
    if (this.language === PdfConstants.LANGUAGE_FR) {
      xcord = PdfConstants.X_CORD_380;
      if (this.pdfMode && this.pdfMode === FccGlobalConstant.PDF_MODE_LANDSCAPE) {
        xcord = PdfConstants.X_CORD_620;
      }
    } else if (this.pdfMode && this.pdfMode === FccGlobalConstant.PDF_MODE_LANDSCAPE) {
      xcord = PdfConstants.X_CORD_680;
    } else {
      xcord = this.getXCordBasedOnLang(PdfConstants.X_CORD_430, PdfConstants.X_CORD_200_AR);
    }
    xcord = this.getXCordBasedOnLang(xcord, PdfConstants.X_CORD_250_AR);
    if(this.isAccSummaryDashboard) {
      this.setContentStyles(dateFormatMessage);
    }
    this.pdf.text(xcord, this.ycord, dateFormatMessage, this.setTextOption);
  }

  addDownloadDateTime(bankDetailsYCoOrd?) {
    if (bankDetailsYCoOrd && bankDetailsYCoOrd !== null && bankDetailsYCoOrd !== '') {
      this.ycord = bankDetailsYCoOrd;
    }
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        if(response.dateFormat && this.language){
          this.dateFormatForPdf = response.dateFormat[this.language];
        } else {
          this.dateFormatForPdf = response.listDataExcelDateFormat;
        }
    }});
    this.pdf.setFontSize(this.pdfStylesService.sectionContentFontSize);
    this.pdf.setTextColor(this.pdfStylesService.sectionContentFontColour);
    const downloadDate = new Date();
    const dateValue = this.datePipe.transform(downloadDate, this.dateFormatForPdf);
    this.dateValue = dateValue;
    const timeValue = this.datePipe.transform(downloadDate, 'mediumTime');
    let dateValueMessage = this.translate.instant(FccGlobalConstant.DOWNLOAD_DATE);
    let timeValueMessage = this.translate.instant(FccGlobalConstant.DOWNLOAD_TIME);
    const isArabic = this.arabicEncoding.test(dateValueMessage && timeValueMessage);
    if (isArabic) {
      dateValueMessage = dateValue + ' ' + dateValueMessage;
      timeValueMessage = timeValue + ' ' + timeValueMessage;
      this.pdf.setFont(PdfConstants.ARABIC_BOLD_COURIER);
    } else {
      dateValueMessage = dateValueMessage + ' ' + dateValue;
      timeValueMessage = timeValueMessage + ' ' + timeValue;
      this.pdf.setFont(this.pdfStylesService.sectionContentFont, PdfConstants.FONT_STYLE_NORMAL);
    }
    let xcord = PdfConstants.X_CORD_430;
    if (this.language === PdfConstants.LANGUAGE_FR) {
      xcord = PdfConstants.X_CORD_380;
      if (this.pdfMode && this.pdfMode === FccGlobalConstant.PDF_MODE_LANDSCAPE) {
        xcord = PdfConstants.X_CORD_620;
      }
    } else if (this.pdfMode && this.pdfMode === FccGlobalConstant.PDF_MODE_LANDSCAPE) {
      xcord = PdfConstants.X_CORD_680;
    } else {
      xcord = this.getXCordBasedOnLang(PdfConstants.X_CORD_430, PdfConstants.X_CORD_200_AR);
    }
    xcord = this.getXCordBasedOnLang(xcord, PdfConstants.X_CORD_160_AR);
    if(this.isRepeatHeader)
    {
      this.ycord =PdfConstants.ADD_192;
    }
    if(this.isRepeatHeader && isArabic && this.isAccSummaryDashboard)
    {
        this.setTextOption = { align: PdfConstants.ALIGN_RIGHT };
    }
    if(this.isAccSummaryDashboard){
      this.setContentStyles(dateValueMessage);
    }
    this.pdf.text(xcord, this.ycord, dateValueMessage, this.setTextOption);
    if(timeValueMessage){
      this.ycord = this.ycord + PdfConstants.NEXT_LINE_12;
      this.pdf.text(xcord, this.ycord, timeValueMessage, this.setTextOption);
    }
    this.ycord = this.ycord + PdfConstants.NEXT_LINE_12;
  }

  addAccountHolderDetails() {
    this.pdf.setFont(this.pdfStylesService.sectionContentFont,PdfConstants.FONT_STYLE_BOLD);
    this.setTextOption = { align: PdfConstants.ALIGN_RIGHT };
    const swiftAddress = 'SWIFTAddress';
    const corporateDetailsXCoOrd = this.getXCordBasedOnLang(PdfConstants.X_CORD_800, PdfConstants.X_CORD_200_AR);
    let corporateDetailsYCoOrd = PdfConstants.PAGE_HEIGHT_SUB_80;
    if (this.isAccountStatementDownload) {
      this.pdf.text(corporateDetailsXCoOrd, corporateDetailsYCoOrd,
        this.corporateDetails.name, this.setTextOption);
      corporateDetailsYCoOrd = corporateDetailsYCoOrd + PdfConstants.Y_COORD_GAP_2;
    } else if(this.loggedInUserDetails.firstName){
      this.pdf.text(corporateDetailsXCoOrd, corporateDetailsYCoOrd, this.loggedInUserDetails.firstName + ' '
      + this.loggedInUserDetails.lastName, this.setTextOption);
    corporateDetailsYCoOrd = corporateDetailsYCoOrd + PdfConstants.Y_COORD_GAP_2;
    }
    this.pdf.setFont(this.pdfStylesService.sectionContentFont,PdfConstants.FONT_STYLE_NORMAL);
    if (this.corporateDetails[swiftAddress].line1 && this.corporateDetails[swiftAddress].line1 !== ''
      && this.corporateDetails[swiftAddress].line1 != null) {
      corporateDetailsYCoOrd = corporateDetailsYCoOrd + PdfConstants.NEXT_LINE_12;
      this.pdf.text(corporateDetailsXCoOrd, corporateDetailsYCoOrd, this.corporateDetails[swiftAddress].line1, this.setTextOption);
    }
    if (this.corporateDetails[swiftAddress].line2 && this.corporateDetails[swiftAddress].line2 !== ''
      && this.corporateDetails[swiftAddress].line2 != null) {
      corporateDetailsYCoOrd = corporateDetailsYCoOrd + PdfConstants.NEXT_LINE_12;
      this.pdf.text(corporateDetailsXCoOrd, corporateDetailsYCoOrd, this.corporateDetails[swiftAddress].line2, this.setTextOption);
    }
    if (this.corporateDetails[swiftAddress].line3 && this.corporateDetails[swiftAddress].line3 !== ''
      && this.corporateDetails[swiftAddress].line3 != null) {
      corporateDetailsYCoOrd = corporateDetailsYCoOrd + PdfConstants.NEXT_LINE_12;
      this.pdf.text(corporateDetailsXCoOrd, corporateDetailsYCoOrd, this.corporateDetails[swiftAddress].line3, this.setTextOption);
    }

    if (this.corporateDetails[swiftAddress].line4 && this.corporateDetails[swiftAddress].line4 !== ''
      && this.corporateDetails[swiftAddress].line4 != null) {
      corporateDetailsYCoOrd = corporateDetailsYCoOrd + PdfConstants.NEXT_LINE_12;
      this.pdf.text(corporateDetailsXCoOrd, corporateDetailsYCoOrd, this.corporateDetails[swiftAddress].line4, this.setTextOption);
    }
  }

  addFilterDetails() {
    let XCoOrd = this.getXCordBasedOnLang(PdfConstants.BANK_DETAILS_X_COORD_50,PdfConstants.X_CORD_680_AR);
    let YCoOrd = PdfConstants.HEADER_PRODUCT_CODE_Y_COORD_170;
    this.setTextOption = { align: PdfConstants.ALIGN_LEFT } ;
    YCoOrd = YCoOrd + PdfConstants.NEXT_LINE_12;
    this.setContentStyles(this.translate.instant('filteredBy'));
    const isArabic = this.arabicEncoding.test(this.translate.instant('filteredBy'));
    if (isArabic) {
      this.pdf.text(XCoOrd,YCoOrd, ":"+this.translate.instant('filteredBy'), this.setTextOption);
    } else {
      this.pdf.text(XCoOrd,YCoOrd, this.translate.instant('filteredBy')+": ", this.setTextOption);
    }
    const appliedFilter = this.commonService.getAccountSummaryFilter();
    if (isArabic) {
      XCoOrd = XCoOrd-PdfConstants.NEXT_LINE_12;
    } else {
      XCoOrd = XCoOrd+PdfConstants.NEXT_LINE_12;
    }
    Object.keys(appliedFilter).forEach(filter => {
      if (FccGlobalConstant.ACC_SUMMARY_FILTER_PDF.indexOf(filter) > -1) {
        YCoOrd = YCoOrd + PdfConstants.NEXT_LINE_12;
        if (isArabic) {
          this.pdf.text(XCoOrd,YCoOrd, this.commonService.convertToString(appliedFilter[filter])?.replace('|',',')
          +" :"+this.translate.instant(filter), this.setTextOption);
        } else {
          this.pdf.text(XCoOrd,YCoOrd, this.translate.instant(filter)+": "
          +this.commonService.convertToString(appliedFilter[filter])?.replace('|',','), this.setTextOption);
        }
      }
    });
  }

  addAllTablesHeader() {
    if (this.language === PdfConstants.LANGUAGE_AR) {
      this.setContentStyles(this.translate.instant('accountSummaryPDFTitle'),PdfConstants.FONT_STYLE_BOLD);
    } else {
      this.pdf.setFont(this.pdfStylesService.getProductCodeFont(), PdfConstants.FONT_STYLE_BOLD);
    }
    const XCoOrd = this.getXCordBasedOnLang(PdfConstants.BANK_DETAILS_X_COORD_50-PdfConstants.ADD_8, PdfConstants.X_CORD_525_AR);
    let YCoOrd = PdfConstants.BANK_CONTACT_DETAILS_Y_COORD_220+PdfConstants.NEXT_LINE_12;
    if(this.isRepeatHeader)
    {
      YCoOrd = PdfConstants.y_CORD_230;
      this.setTextOption ={ align: PdfConstants.ALIGN_LEFT };
    }
    this.pdf.setFontSize(this.pdfStylesService.getProductCodeFontSize());
    this.pdf.text(XCoOrd,YCoOrd, this.translate.instant('accountSummaryPDFTitle')+' '+this.dateValue , this.setTextOption);
  }

  /*
   * Method adds the footer cotent for every page in the document.
   */
  updateFooter() {
    const totalPages = this.pdf.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      this.footer(i, totalPages);
    }
  }

  footer(pageNumber, totalPages) {
    // Draw a background colour
    this.pdf.setPage(pageNumber);
    this.pdf.setDrawColor(PdfConstants.COLOR_BACKGROUND_LINE);
    this.pdf.setLineWidth(PdfConstants.WHITE_LINE_WIDTH_50);
    let footerLineY = PdfConstants.FOOTER_LINE_Y;
    if (this.pdfMode && this.pdfMode === FccGlobalConstant.PDF_MODE_LANDSCAPE) {
      footerLineY = PdfConstants.LANDSCAPE_FOOTER_LINE_Y;
    }
    const footerLineX2 = this.getXCordBasedOnLang(PdfConstants.FOOTER_LINE_X2, PdfConstants.FOOTER_LINE_X2_AR);
    this.pdf.line(this.xcord, footerLineY, footerLineX2, footerLineY);
    if (this.pdfStylesService.getShowFooter()) {
      const currentPage = this.translate.instant('PDF_FOOTER_PAGE_NUMBER_TEXT', { pageNumber, totalPages });
      this.pdf.setFont(this.pdfStylesService.getFooterFont());
      this.pdf.setFontSize(this.pdfStylesService.getFooterFontSize());
      this.pdf.setTextColor(this.pdfStylesService.getFooterFontColour());
      let pageYCoOrd = PdfConstants.PAGE_Y_COORD + this.nextLine;
      if (this.pdfMode && this.pdfMode === FccGlobalConstant.PDF_MODE_LANDSCAPE) {
        pageYCoOrd = PdfConstants.LANDSCAPE_PAGE_Y_COORD + this.nextLine;
      }
      const pageDateDetails = currentPage;
      this.checkArabicFont(pageDateDetails, this.pdfStylesService.getFooterFont(), PdfConstants.FONT_STYLE_NORMAL);
      let xCoredFooter = this.xcord + PdfConstants.ADD_450;
      if (this.pdfMode && this.pdfMode === FccGlobalConstant.PDF_MODE_LANDSCAPE) {
        xCoredFooter = this.xcord + PdfConstants.ADD_700;
      }
      const footerXCord = this.getXCordBasedOnLang(xCoredFooter, this.xcord - PdfConstants.ADD_400);
      this.pdf.text(pageDateDetails, footerXCord, pageYCoOrd, this.setTextOption);
    }
  }

  saveFile() {
    this.updateFooter();
    if (this.refId && this.tnxId) {
      this.pdf.save(`${this.refId}_${this.tnxId}.pdf`);
    } else {
      this.pdf.save(`${this.refId}.pdf`);
    }
  }

  /*
   * Add a new page to the PDF,
   * reset the ycord,
   * increment the current page number and the totalnumber of pages
   * Add background image
   * Set header and footer details.
   */
  addPage() {
    this.pdf.addPage();
    this.ycord = PdfConstants.Y_CORD_INIT_40;
    this.pageNumber++;
    this.addBackgroundImage();
    let yCoOrdGap = PdfConstants.Y_COORD_GAP_2;
    if (this.pdfStylesService.getShowLogoAllPages()) {
      this.addHeaderImage();
      yCoOrdGap = PdfConstants.Y_COORD_GAP_6;
    }
    this.addLeftBar();
    this.addRightBar();
    this.ycord = this.ycord + (this.nextLine * yCoOrdGap);
  }

  setHeaderStyles(headerValue) {
    const font = this.headerFont ? this.headerFont : this.pdfStylesService.getSectionHeaderFont();
    const fontStyle = this.headerFontStyle ? this.headerFontStyle : this.pdfStylesService.getSectionHeaderFontStyle();
    this.pdf.setFont(font, fontStyle);
    this.pdf.setFontSize(this.headerFontSize ? this.headerFontSize : this.pdfStylesService.getSectionHeaderFontSize());
    this.pdf.setTextColor(this.headerFontColor ? this.headerFontColor : this.pdfStylesService.getSectionHeaderFontColour());
    this.checkArabicFont(headerValue, font, fontStyle);
  }

  setSubHeaderStyles(subHeaderValue) {
    const font = this.subHeaderFont ? this.subHeaderFont : this.pdfStylesService.getSubSectionHeaderFont();
    const fontStyle = this.subHeaderFontStyle ? this.subHeaderFontStyle : this.pdfStylesService.getSubSectionHeaderFontStyle();
    this.pdf.setFont(font, fontStyle);
    this.pdf.setFontSize(this.subHeaderFontSize ? this.subHeaderFontSize : this.pdfStylesService.getSubSectionHeaderFontSize());
    this.pdf.setTextColor(this.subHeaderFontColor ? this.subHeaderFontColor : this.pdfStylesService.getSubSectionHeaderFontColour());
    this.checkArabicFont(subHeaderValue, font, fontStyle);
  }

  setLabelStyles(labelValue) {
    const font = this.labelFont ? this.labelFont : this.pdfStylesService.getSectionLabelFont();
    const fontStyle = this.labelFontStyle ? this.labelFontStyle : this.pdfStylesService.getSectionLabelFontStyle();
    this.pdf.setFont(font, fontStyle);
    this.pdf.setFontSize(this.labelFontSize ? this.labelFontSize : this.pdfStylesService.getSectionLabelFontSize());
    this.pdf.setTextColor(this.labelFontColor ? this.labelFontColor : this.pdfStylesService.getSectionLabelFontColour());
    this.checkArabicFont(labelValue, font, fontStyle);
  }

  setContentStyles(contentValue, style? , previousValue: boolean = false, xcord?) {
    if (previousValue && !this.eventsection){
      this.pdf.setTextColor(this.pdfStylesService.getAmendSectionContentFontColour());
      const textWidth = this.pdf.getTextWidth(contentValue);
      const lineHeight = this.pdf.getLineHeight();
      this.pdf.setDrawColor(0, 0, 0); // Set line color to red
      this.pdf.setLineWidth(0.5); // Set line width to 0.1
      this.pdf.line(xcord, this.fieldContentYCord - lineHeight/4, xcord + textWidth, this.fieldContentYCord - lineHeight/4);
    } else {
    const font = this.currencySymbolDisplayEnabled ? PdfConstants.ARABIC_NORMAL_ARIAL:
    this.contentFont ? this.contentFont : this.pdfStylesService.getSectionContentFont();
    const fontStyle = style ? style : this.contentFontStyle ? this.contentFontStyle : this.pdfStylesService.getSectionContentFontStyle();
    this.pdf.setFont(font, fontStyle);
    this.pdf.setFontSize(this.contentFontSize ? this.contentFontSize : this.pdfStylesService.getSectionContentFontSize());
    this.pdf.setTextColor(this.contentFontColor ? this.contentFontColor : this.pdfStylesService.getSectionContentFontColour());
    this.checkArabicFont(contentValue, font, fontStyle);
    }
  }
  setCardHeaderStyles(subHeaderValue) {
    const font = this.subHeaderFont ? this.subHeaderFont : this.pdfStylesService.getSubSectionHeaderFont();
    const fontStyle = this.subHeaderFontStyle ? this.subHeaderFontStyle : this.pdfStylesService.getSubSectionHeaderFontStyle();
    this.pdf.setFont(font, fontStyle);
    this.pdf.setFontSize(this.subHeaderFontSize ? this.subHeaderFontSize : this.pdfStylesService.getSubSectionHeaderFontSize());
    this.pdf.setTextColor(this.subHeaderFontColor ? this.subHeaderFontColor : this.pdfStylesService.getSectionLabelFontColour());
    this.checkArabicFont(subHeaderValue, font, fontStyle);
  }

  checkSectionControls(sectionControl): boolean {
    let rendered = sectionControl[this.fieldControls][this.params][this.rendered];
    rendered = rendered === false ? false : true;
    const previewScreen = this.getPreviewScreenValue(sectionControl);
    if ((sectionControl[this.pdfParams] && sectionControl[this.pdfParams][this.masked]
      && sectionControl[this.pdfParams][this.masked] === true) || rendered === false
      || previewScreen === false || sectionControl.params.hideControl === true
      || sectionControl.type === 'spacer' || sectionControl.type === 'DivControl'
      || sectionControl.type === 'icon' || sectionControl.type === FccGlobalConstant.BUTTON_DIV
      || sectionControl.params.label === 'hideControl') {
      return false;
    }
    return true;
  }

  setPDFStyles(pdfParams) {
    if (pdfParams) {
      if (pdfParams.sectionHeader) {
        this.headerFont = pdfParams.sectionHeader.font;
        this.headerFontSize = pdfParams.sectionHeader.fontSize;
        this.headerFontStyle = pdfParams.sectionHeader.fontStyle;
        this.headerFontColor = pdfParams.sectionHeader.fontColor;
      }
      if (pdfParams.subSectionHeader) {
        this.subHeaderFont = pdfParams.sectionHeader.font;
        this.subHeaderFontSize = pdfParams.sectionHeader.fontSize;
        this.subHeaderFontStyle = pdfParams.sectionHeader.fontStyle;
        this.subHeaderFontColor = pdfParams.sectionHeader.fontColor;
      }
      if (pdfParams.sectionLabel) {
        this.labelFont = pdfParams.sectionLabel.font;
        this.labelFontSize = pdfParams.sectionLabel.fontSize;
        this.labelFontStyle = pdfParams.sectionLabel.fontStyle;
        this.labelFontColor = pdfParams.sectionLabel.fontColor;
      }
      if (pdfParams.sectionContent) {
        this.contentFont = pdfParams.sectionContent.font;
        this.contentFontSize = pdfParams.sectionContent.fontSize;
        this.contentFontStyle = pdfParams.sectionContent.fontStyle;
        this.contentFontColor = pdfParams.sectionContent.fontColor;
      }
    }
  }

  resetPDFStyles(pdfParams) {
    if (pdfParams && pdfParams.sectionHeader) {
      this.headerFont = null;
      this.headerFontSize = null;
      this.headerFontStyle = null;
      this.headerFontColor = null;
    }
    if (pdfParams && pdfParams.subSectionHeader) {
      this.subHeaderFont = null;
      this.subHeaderFontSize = null;
      this.subHeaderFontStyle = null;
      this.subHeaderFontColor = null;
    }
    if (pdfParams && pdfParams.sectionLabel) {
      this.labelFont = null;
      this.labelFontSize = null;
      this.labelFontStyle = null;
      this.labelFontColor = null;
    }
    if (pdfParams && pdfParams.sectionContent) {
      this.contentFont = null;
      this.contentFontSize = null;
      this.contentFontStyle = null;
      this.contentFontColor = null;
    }
  }

  addFieldDetailsInPdf(fieldIndex, fieldDetails) {
    let renderAmendLabel: boolean;
    if (this.currencySymbolDisplayEnabled && fieldDetails && fieldDetails.fieldType
      && fieldDetails.fieldType === FccGlobalConstant.AMOUNT_FIELD) {
      const val = fieldDetails.value.indexOf('  ') > -1 ? fieldDetails.value.split('  ') : fieldDetails.value.split(' ');
      if (val.length === 2) {
        fieldDetails.value = this.commonService.getCurrencySymbolForPDF(val[0], val[1]);
      }
    }
    const firstColumnXCord = this.getXCordBasedOnLang(PdfConstants.FIRST_COLUMN_START_XCORD, PdfConstants.FIRST_COLUMN_START_XCORD_AR);
    const secondColumnXCord = this.getXCordBasedOnLang(PdfConstants.SECOND_COLUMN_START_XCORD, PdfConstants.SECOND_COLUMN_XCORD_AR);
    const isFirstColumn = fieldIndex % PdfConstants.CHECK_EVEN_NUMBER === 0;
    if ((fieldDetails.singleColumn || isFirstColumn) && this.fieldContentYCord >= this.pageHeight) {
      this.addPage();
      this.fieldLabelYCord = this.ycord + PdfConstants.ADD_20;
      this.fieldContentYCord = this.ycord + PdfConstants.ADD_40;
      this.addHeaderExtraSpace = false;
      this.addSubHeaderExtraSpace = false;
      this.addFieldExtraSpace = false;
      this.addNarrativeTextExtraSpace = false;
      this.lastFieldNarrative = false;
    }
    this.setPDFStyles(fieldDetails[this.pdfParams]);
    const fieldValue = fieldDetails.value;
    const fieldPreviousValue = fieldDetails.previousValue;
    if (fieldPreviousValue && (fieldPreviousValue !== fieldValue) && !this.eventsection && this.amendedValue) {
      renderAmendLabel = true;
    } else {
      renderAmendLabel = false;
    }
    let labelFromParams = '';
    if (fieldDetails[this.params] && fieldDetails[this.params][this.label]) {
      labelFromParams = fieldDetails[this.params][this.label];
    }
    const fieldLabel = fieldDetails.label ? fieldDetails.label : labelFromParams;
    if (fieldDetails.singleColumn) {
      if (this.lastFieldNarrative || this.addFieldExtraSpace) {
        this.fieldLabelYCord = this.fieldLabelYCord + PdfConstants.ADD_30;
        this.fieldContentYCord = this.fieldContentYCord + PdfConstants.ADD_30;
        this.lastFieldNarrative = false;
        this.addSubHeaderExtraSpace = false;
        this.addFieldExtraSpace = false;
      }
      if (this.addNarrativeTextExtraSpace) {
        this.fieldLabelYCord = this.fieldLabelYCord + PdfConstants.ADD_40;
        this.fieldContentYCord = this.fieldContentYCord + PdfConstants.ADD_40;
        this.lastFieldNarrative = false;
        this.addSubHeaderExtraSpace = false;
        this.addFieldExtraSpace = false;
        this.addNarrativeTextExtraSpace = false;
      }
      this.setLabelStyles(fieldLabel);
      const isArabicPresent = this.arabicEncoding.test(fieldValue);
      if (isArabicPresent) {
        this.setTextOption['isInputVisual'] = false;
        this.setTextOption['isOutputVisual'] = true;
        this.setTextOption['isInputRtl'] = true;
        this.setTextOption['isOutputRtl'] = false;
        this.setTextOption['isSymmetricSwapping'] = true;
      }
      this.pdf.text(firstColumnXCord, this.fieldLabelYCord, fieldLabel, this.setTextOption);
      // If label only field, just move the ycord. No need to add content or extra space.
      if (fieldDetails.labelOnly) {
        this.fieldLabelYCord = this.fieldLabelYCord + PdfConstants.ADD_20;
        this.fieldContentYCord = this.fieldLabelYCord + PdfConstants.ADD_20;
      } else {
        this.setContentStyles(fieldValue);
        this.addContentValueToPdf(fieldValue, firstColumnXCord, PdfConstants.MAX_LENGTH_SINGLE_COLUMN_500,
          false, true, true, fieldPreviousValue);
        this.fieldLabelYCord = this.fieldLabelYCord + PdfConstants.ADD_30;
        this.fieldContentYCord = this.fieldContentYCord + PdfConstants.ADD_30;
        this.addHeaderExtraSpace = false;
        this.addSubHeaderExtraSpace = false;
        this.lastFieldNarrative = true;
      }
    } else {
      this.lastFieldNarrative = false;
      if (this.addFieldExtraSpace) {
        this.fieldLabelYCord = this.fieldLabelYCord + PdfConstants.ADD_20;
        this.fieldContentYCord = this.fieldContentYCord + PdfConstants.ADD_20;
        this.addHeaderExtraSpace = false;
        this.addSubHeaderExtraSpace = false;
        this.addFieldExtraSpace = false;
        this.lastFieldNarrative = false;
      }
      if (isFirstColumn) {
        if (this.setAmendedChords) {
          this.setAmendedChords = false;
          this.fieldLabelYCord = this.fieldLabelYCord + 15;
          this.fieldContentYCord = this.fieldContentYCord + 15;
        }
        this.setLabelStyles(fieldLabel);
        this.addLabelToPdf(fieldLabel, firstColumnXCord, PdfConstants.MAX_LENGTH_TWO_COLUMN_230, false, renderAmendLabel);
        this.setContentStyles(fieldValue);
        this.addContentValueToPdf(fieldValue, firstColumnXCord, PdfConstants.MAX_LENGTH_TWO_COLUMN_230, false,
          false, true, fieldPreviousValue);
        this.addHeaderExtraSpace = true;
        this.addSubHeaderExtraSpace = true;
        this.addNarrativeTextExtraSpace = true;
      } else {
        if (this.firstColfieldLabelYCordBeforeSplit !== 0 && this.firstColFieldContentYCordBeforeSplit !== 0) {
          this.fieldLabelYCord = this.firstColfieldLabelYCordBeforeSplit;
          this.fieldContentYCord = this.firstColFieldContentYCordBeforeSplit;
          if (this.newPageAddedDuringFirstColSplit) {
            this.pdf.setPage(this.pageNumber - 1);
          }
        }
        this.setLabelStyles(fieldLabel);
        this.addLabelToPdf(fieldLabel, secondColumnXCord, PdfConstants.MAX_LENGTH_TWO_COLUMN_230, true, renderAmendLabel);
        this.setContentStyles(fieldValue);
        this.addContentValueToPdf(fieldValue, secondColumnXCord, PdfConstants.MAX_LENGTH_TWO_COLUMN_230,
           true, false, false, fieldPreviousValue);
        if (this.newPageAddedDuringFirstColSplit && !this.movedToAlreadyAddedPageDuringSecondColSplit) {
          this.pdf.setPage(this.pageNumber);
          /**
           * If the first field content has moved to next page, but the second field content has not moved,
           * then set the yord to after the first field cord.
           */
          this.fieldLabelYCord = this.firstColfieldLabelYCordAfterSplit;
          this.fieldContentYCord = this.firstColFieldContentYCordAfterSplit;
        }
        this.fieldLabelYCord = this.fieldLabelYCord + PdfConstants.ADD_40;
        this.fieldContentYCord = this.fieldContentYCord + PdfConstants.ADD_40;
        this.addHeaderExtraSpace = false;
        // Seting addSubHeaderExtraSpace to false here, since we are already adding 40 above.
        this.addSubHeaderExtraSpace = false;
        this.addNarrativeTextExtraSpace = false;
        this.firstColfieldLabelYCordAfterSplit = 0;
        this.firstColFieldContentYCordAfterSplit = 0;
        this.firstColfieldLabelYCordBeforeSplit = 0;
        this.firstColFieldContentYCordBeforeSplit = 0;

      }
    }
  }

  /*
    This method is used to add the arabic fonts from a base64 string.
  */
  addFontArabic() {
    if (!this.pdf.existsFileInVFS(PdfConstants.ARABIC_BOLD_ARIAL_TTF)) {
      this.pdf.addFileToVFS(PdfConstants.ARABIC_BOLD_ARIAL_TTF, arabicBoldArial);
      this.pdf.addFont(PdfConstants.ARABIC_BOLD_ARIAL_TTF, PdfConstants.ARABIC_BOLD_ARIAL, PdfConstants.FONT_STYLE_BOLD);
    }
    if (!this.pdf.existsFileInVFS(PdfConstants.ARABIC_NORMAL_COURIER_TTF)) {
      this.pdf.addFileToVFS(PdfConstants.ARABIC_NORMAL_COURIER_TTF, arabicNormalCourier);
      this.pdf.addFont(PdfConstants.ARABIC_NORMAL_COURIER_TTF, PdfConstants.ARABIC_NORMAL_COURIER, PdfConstants.FONT_STYLE_NORMAL);
    }
    if (!this.pdf.existsFileInVFS(PdfConstants.ARABIC_BOLD_COURIER_TTF)) {
      this.pdf.addFileToVFS(PdfConstants.ARABIC_BOLD_COURIER_TTF, arabicBoldCourier);
      this.pdf.addFont(PdfConstants.ARABIC_BOLD_COURIER_TTF, PdfConstants.ARABIC_BOLD_COURIER, PdfConstants.FONT_STYLE_BOLD);
    }
    if (!this.pdf.existsFileInVFS(PdfConstants.ARABIC_NORMAL_ARIAL_TTF)) {
      this.pdf.addFileToVFS(PdfConstants.ARABIC_NORMAL_ARIAL_TTF, arabicNormalArial);
      this.pdf.addFont(PdfConstants.ARABIC_NORMAL_ARIAL_TTF, PdfConstants.ARABIC_NORMAL_ARIAL, PdfConstants.FONT_STYLE_NORMAL);
    }
  }

  /*
  	This method is used to add the arialuni fonts from a base64 string.
  */
addOtherFonts() {
	if (!this.pdf.existsFileInVFS(PdfConstants.ARIALUNI_TTF)) {
      this.pdf.addFileToVFS(PdfConstants.ARIALUNI_TTF, this.arialUniBase64);
      this.pdf.addFont(PdfConstants.ARIALUNI_TTF, PdfConstants.ARIALUNI, PdfConstants.FONT_STYLE_NORMAL);
      this.pdf.addFont(PdfConstants.ARIALUNI_TTF, PdfConstants.ARIALUNI, PdfConstants.FONT_STYLE_BOLD);
      this.pdf.addFont(PdfConstants.ARIALUNI_TTF, PdfConstants.ARIALUNI, PdfConstants.FONT_STYLE_ITALICS);
    }
    if (!this.pdf.existsFileInVFS(PdfConstants.DEJAVUSANS_TTF)) {
      this.pdf.addFileToVFS(PdfConstants.DEJAVUSANS_TTF, this.dejavuBase64);
      this.pdf.addFont(PdfConstants.DEJAVUSANS_TTF, PdfConstants.DEJAVUSANS, PdfConstants.FONT_STYLE_NORMAL);
      this.pdf.addFont(PdfConstants.DEJAVUSANS_TTF, PdfConstants.DEJAVUSANS, PdfConstants.FONT_STYLE_BOLD);
      this.pdf.addFont(PdfConstants.DEJAVUSANS_TTF, PdfConstants.DEJAVUSANS, PdfConstants.FONT_STYLE_ITALICS);
    }
  }


  /*
  This method is used to set the arabic font based on the param passed (Arial or Courier).
*/
  setArabicFont(font, style) {
    if (PdfConstants.FONT_COURIER === font.toLowerCase() && PdfConstants.FONT_STYLE_NORMAL === style) {
      this.pdf.setFont(PdfConstants.ARABIC_NORMAL_COURIER); // Set font as Courier Normal
    } else if (PdfConstants.FONT_COURIER === font.toLowerCase() && PdfConstants.FONT_STYLE_BOLD === style) {
      this.pdf.setFont(PdfConstants.ARABIC_BOLD_COURIER); // Set font as Courier Bold
    } else if (PdfConstants.FONT_STYLE_BOLD === style.toLowerCase()) {
      this.pdf.setFont(PdfConstants.ARABIC_BOLD_ARIAL); // Set font as Arial Bold
    } else {
      this.pdf.setFont(PdfConstants.ARABIC_NORMAL_ARIAL); // Set font as Arial Normal
    }
  }

  checkArabicFont(value, font, fontStyle) {
    const isArabicPresent = this.arabicEncoding.test(value);
    if (isArabicPresent) {
      this.setArabicFont(font, fontStyle);
    }
  }

  checkSingleColumnFields(fieldControl: FCCFormControl): boolean {
    const allowedCharCount = 'allowedCharCount';
    const maxlength = 'maxlength';
    if (fieldControl && fieldControl !== undefined ) {
    const fullWidth = fieldControl[this.params][this.fullWidth];
    if(fieldControl[this.params][this.halfWidth]){
    return false;
    }
    else if ((fieldControl[this.params][allowedCharCount]
      && Number(fieldControl[this.params][allowedCharCount]) > this.maxWordLimit) ||
      (fieldControl[this.params][maxlength]
        && Number(fieldControl[this.params][maxlength]) > this.maxWordLimit) || fullWidth) {
      return true;
    }
   }
    return false;
  }

  getFieldDataDetails(sectionControl, addNotEntered): FieldDetails {
    let label = sectionControl.params.label ? sectionControl.params.label : `${this.translate.instant(sectionControl[this.key])}`;
    let value = sectionControl.value;
    let previousValue = sectionControl.params.previousValue;
    let fieldDataDetails: FieldDetails = null;
    const valueOnlyField = sectionControl[this.params][FccGlobalConstant.VALUE_ONLY];
    const labelOnlyField = sectionControl[this.params][FccGlobalConstant.LABEL_ONLY] ? true : false;
    /**
     * If not a value only field( when only value is displayed and label is hidden), and if the label is empty, then return null
     */
    if (!valueOnlyField && !label) {
      return fieldDataDetails;
    }
    value = this.getFieldValueForPdf(sectionControl, addNotEntered);
    if (previousValue) {
      if(sectionControl.key === 'beneficiarycountry'){
        previousValue = this.getFieldValueForPdf(sectionControl, addNotEntered, true);
      }
    }
    else if(this.amendedValue && this.commonService.isnonEMptyString(value) && !previousValue &&
    sectionControl.type && sectionControl.type !== "view-mode") {
        previousValue = FccGlobalConstant.NotEntered;
    }
    if ((sectionControl && sectionControl[this.params].isNotRequiredForComparison) ||
    FccGlobalConstant.AMEND_NARRATIVE_READ_FILEDS.indexOf(sectionControl.key) > -1){
      previousValue = null;
    }
    let fieldStyle;
    if (sectionControl[this.pdfParams]) {
      fieldStyle = sectionControl[this.pdfParams];
    }
    /**
     * Set field details only when both label and value are not null.
     * OR
     * If type 'text' even when value is null and is a labelonly field.
     * OR
     * If value only field, then check for value and set the details.
     */
    if ((label && value) ||
    (label && sectionControl.type === FccGlobalConstant.TEXT && labelOnlyField) ||
    (valueOnlyField && value)) {
      if (valueOnlyField) {
        label = '';
      }
      const singleColumn = this.checkSingleColumnFields(sectionControl);
      fieldDataDetails = {
        label,
        value,
        previousValue,
        pdfParams: fieldStyle,
        singleColumn,
        labelOnly: labelOnlyField
      };
      return fieldDataDetails;
    }
    return fieldDataDetails;
  }

  populateSectionDataMap(sectionHeader, sectionControls) {
    for (const [subSectionHeader, subSectionControl] of sectionControls.fieldsMap) {
      if (this.sectionDataMap.has(sectionHeader)) { // section already available
        this.handleAlreadyAddedSection(sectionHeader, sectionControls, subSectionHeader, subSectionControl);
      } else {
        this.handleNewSection(sectionHeader, sectionControls, subSectionHeader, subSectionControl);
      }
    }
  }

  /*
   * Creates a table with the headers and data(rows).
   */
  createTable(headers, data) {
    const tableStartSpace = this.fieldContentYCord + (PdfConstants.Y_COORD_GAP_2 * this.nextLine);
    if (tableStartSpace >= this.pageHeight) {
      this.addPage();
      this.fieldLabelYCord = this.ycord + PdfConstants.ADD_30;
      this.fieldContentYCord = this.ycord + PdfConstants.ADD_50;
      this.addHeaderExtraSpace = false;
      this.addSubHeaderExtraSpace = false;
      this.addFieldExtraSpace = false;
      this.lastFieldNarrative = false;
    }
    this.ycord = this.fieldContentYCord + this.nextLine;
    if (this.language === PdfConstants.LANGUAGE_AR) {
      this.addFontArabic();
    }
    this.addOtherFonts();
    const rows = data.length;
    const yCoOrdGap = PdfConstants.Y_COORD_GAP_2;
    this.remainingTableHeight = this.ycord + (this.nextLine * yCoOrdGap * (rows + 1));
    // If the table height is greater than the page heigth
    if (this.remainingTableHeight >= this.pageHeight) {
      // Table is moved to next page, if rows are exceeding the page height.
      // this.addPage();
      this.createFirstPartOfTable(data, headers);
      while (this.remainingTableHeight > this.pageHeight) {
        this.remaingTableRows = rows - this.rowsInRemainingPage;
        this.createRemainingPartOfTable(data, headers);
      }
    } else {
     // Bank Attachments and Fees and Charges table not displayed in same page due to this.
      // if (this.pdf.lastAutoTable.finalY && this.lastTablePage && this.lastTablePage === this.pageNumber) {
      //   this.addPage();
      // }
      const options = {
        headStyles: {
          halign: 'center', overflow: 'linebreak', fillColor: this.pdfStylesService.getTableHeaderBackgroundColour(),
          textColor: this.pdfStylesService.getTableHeaderTextColour(),
          font: this.getArabicFontIfLanguageAR(this.pdfStylesService.getTableFont(), this.pdfStylesService.getTableHeaderFontStyle()),
          fontSize: this.pdfStylesService.getTableHeaderFontSize(), fontStyle: this.pdfStylesService.getTableHeaderFontStyle()
        },
        bodyStyles: {
          halign: 'center', overflow: 'linebreak', textColor: this.pdfStylesService.getTableFontColour(),
          font: this.getArabicFontIfLanguageAR(this.pdfStylesService.getTableFont(), this.pdfStylesService.getTableFontStyle()),
          fontSize: this.pdfStylesService.getTableFontSize(),
          fontStyle: this.pdfStylesService.getTableFontStyle()
        },
        margin: {
          top: this.ycord + this.nextLine,
          right: PdfConstants.NUMB_30
        },
        startY: this.ycord + this.nextLine,
        pageBreak: PdfConstants.PAGE_BREAK,
        styles: { font: this.getArabicFontIfLanguageAR(this.pdfStylesService.getTableFont(),
          this.pdfStylesService.getTableFontStyle()), fontStyle: this.pdfStylesService.getTableFontStyle(),
           halign: PdfConstants.ALIGN_LEFT }
      };
      if (this.language === PdfConstants.LANGUAGE_AR) {
        options.margin.right = PdfConstants.NUMB_65;
        options.styles.halign = PdfConstants.ALIGN_RIGHT;
      }
      this.pdf.autoTable(headers, data, options);
      this.ycord = this.remainingTableHeight + this.nextLine * yCoOrdGap;
    }
    if (this.pdf.lastAutoTable.finalY && this.commonService.isnonEMptyString(this.lastTablePage)
    && (this.lastTablePage + 1 === this.pageNumber || this.pageNumber >= this.lastTablePage)) {
      this.ycord = this.pdf.lastAutoTable.finalY + PdfConstants.ADD_20;
      this.fieldLabelYCord = this.ycord + PdfConstants.ADD_30;
      this.fieldContentYCord = this.ycord + PdfConstants.ADD_50;
    }
    this.lastTablePage = this.pageNumber;
  }

  createFirstPartOfTable(data, headers) {
    const options = {
      headStyles: {
        halign: 'center', overflow: 'linebreak', fillColor: this.pdfStylesService.getTableHeaderBackgroundColour(),
        textColor: this.pdfStylesService.getTableHeaderTextColour(),
        font: this.getArabicFontIfLanguageAR(this.pdfStylesService.getTableFont(), this.pdfStylesService.getTableHeaderFontStyle()),
        fontSize: this.pdfStylesService.getTableFontSize(), fontStyle: this.pdfStylesService.getTableHeaderFontStyle()
      },
      bodyStyles: {
        halign: 'center', overflow: 'linebreak', textColor: this.pdfStylesService.getTableFontColour(),
        font: this.getArabicFontIfLanguageAR(this.pdfStylesService.getTableFont(), this.pdfStylesService.getTableFontStyle()),
        fontSize: this.pdfStylesService.getTableFontSize(),
        fontStyle: this.pdfStylesService.getTableFontStyle()
      },
      margin: {
        top: this.ycord + this.nextLine,
        right: PdfConstants.NUMB_30
      },
      startY: this.ycord + this.nextLine,
      pageBreak: PdfConstants.PAGE_BREAK,
      styles: { font: this.getArabicFontIfLanguageAR(this.pdfStylesService.getTableFont(),
        this.pdfStylesService.getTableFontStyle()), fontStyle: this.pdfStylesService.getTableFontStyle(),
         halign: PdfConstants.ALIGN_LEFT }
    };
    if (this.language === PdfConstants.LANGUAGE_AR) {
      options.margin.right = PdfConstants.NUMB_65;
      options.styles.halign = PdfConstants.ALIGN_RIGHT;
    }
    this.rowsInRemainingPage = Math.round((PdfConstants.ROW_MULTIPLIER * (this.pageHeight - this.ycord)) - 1);
    const splitData = data.slice(0, this.rowsInRemainingPage);
    this.pdf.autoTable(headers, splitData, options, this.setTextOption);
    const yCoOrdGap = PdfConstants.Y_COORD_GAP_2;
    this.ycord = this.ycord + (this.nextLine * yCoOrdGap * (splitData.length + 1));
    this.remainingTableHeight = this.ycord + (this.nextLine * yCoOrdGap * (this.remaingTableRows + 1));
  }

  createRemainingPartOfTable(data, headers) {
    this.addPage();
    this.addHeaderExtraSpace = false;
    this.addSubHeaderExtraSpace = false;
    this.addFieldExtraSpace = false;
    this.lastFieldNarrative = false;
    const optionsSplit = {
      headStyles: {
        halign: 'center', overflow: 'linebreak', fillColor: this.pdfStylesService.getTableHeaderBackgroundColour(),
        textColor: this.pdfStylesService.getTableHeaderTextColour(),
        font: this.getArabicFontIfLanguageAR(this.pdfStylesService.getTableFont(), this.pdfStylesService.getTableHeaderFontStyle()),
        fontSize: this.pdfStylesService.getTableFontSize(), fontStyle: this.pdfStylesService.getTableHeaderFontStyle()
      },
      bodyStyles: {
        halign: 'center', overflow: 'linebreak', textColor: this.pdfStylesService.getTableFontColour(),
        font: this.getArabicFontIfLanguageAR(this.pdfStylesService.getTableFont(), this.pdfStylesService.getTableFontStyle()),
        fontSize: this.pdfStylesService.getTableFontSize(),
        fontStyle: this.pdfStylesService.getTableFontStyle()
      },
      margin: {
        top: this.ycord + this.nextLine,
        right: PdfConstants.NUMB_30
      },
      drawHeaderRow() {
        return false;
      },
      pageBreak: PdfConstants.PAGE_BREAK,
      styles: { font: this.getArabicFontIfLanguageAR(this.pdfStylesService.getTableFont(),
        this.pdfStylesService.getTableFontStyle()), fontStyle: this.pdfStylesService.getTableFontStyle(), halign: PdfConstants.ALIGN_LEFT }
    };
    if (this.language === PdfConstants.LANGUAGE_AR)
    {
      optionsSplit.margin.right = PdfConstants.NUMB_65;
      optionsSplit.styles.halign = PdfConstants.ALIGN_RIGHT;
    }
    const splitData = data.slice(this.rowsInRemainingPage, data.length);
    this.pdf.autoTable(headers, splitData, optionsSplit, this.setTextOption);
    const yCoOrdGap = PdfConstants.Y_COORD_GAP_2;
    this.ycord = this.ycord + (this.nextLine * yCoOrdGap * (splitData.length + 1));
    this.remainingTableHeight = this.ycord + (this.nextLine * yCoOrdGap * (this.remaingTableRows + 1));
  }

  createTableForListData(headers, data, colData?: any, colHeaders?: any,amountSum?:any) {
    this.ycord = this.fieldContentYCord + this.nextLine;
    if (this.language === PdfConstants.LANGUAGE_AR) {
      this.addFontArabic();
    }
    this.addOtherFonts();
    // Set the headers and alignment
    const tableHeaders = [];
    if(colHeaders === undefined){
      colHeaders = headers;
    }
    colHeaders.forEach((header) => {
      if (!this.commonService.isListdefActionColumn(header.field)) {
        const headerAlign = this.language === PdfConstants.LANGUAGE_AR ? (header.align === 'left' ? 'right' : 'left') : header.align;
        const headStyles = {
          halign: headerAlign, overflow: 'linebreak', fillColor: this.pdfStylesService.getTableHeaderBackgroundColour(),
          textColor: this.pdfStylesService.getTableHeaderTextColour(),
          font: this.getArabicFontIfLanguageAR(this.pdfStylesService.getTableFont(), this.pdfStylesService.getTableFontStyle()),
          fontSize: this.pdfStylesService.getTableFontSize(), fontStyle: this.pdfStylesService.getTableFontStyle()
        };
        let col = {};
        if(header.header !== undefined){
          col = { content: header.header, styles: headStyles };
        } else {
          col = { content: header, styles: headStyles };
        }
        tableHeaders.push(col);
      }
    });
    // Set the table rows and each column alignment
    const tableData = [];
    if(colData === undefined){
      colData = data;
    }
    const footerRow = [];
    for (const listData of colData) {
      const row = [];
      let dataValue: any;
      let index = 0;
      colHeaders.forEach(colHeader=> {
        if (!this.commonService.isListdefActionColumn(colHeader.field)) {
        const header = colHeader.field !== undefined ? colHeader.field : index;
        index++;
        if (!this.commonService.isListdefActionColumn(header)) {
          dataValue = this.getTableDataValue(header, listData);
          dataValue = this.formatDataValueContainLargeText(dataValue);
          const dataAlign = this.language === PdfConstants.LANGUAGE_AR ? (colHeader.align === 'left' ? 'right' : 'left') : colHeader.align;
          const bodyStyles = {
            halign: dataAlign, overflow: 'linebreak', textColor: this.pdfStylesService.getTableFontColour(),
            font: this.getArabicFontIfLanguageAR(this.pdfStylesService.getTableFont(), this.pdfStylesService.getTableFontStyle()),
            fontSize: this.pdfStylesService.getTableFontSize(),
            fontStyle: this.pdfStylesService.getTableFontStyle()
          };
          row.push({ content: dataValue, styles: bodyStyles });
          if (this.isAccSummaryDashboard && amountSum) {
            const footerStyles = {
              halign: dataAlign, overflow: 'linebreak', textColor: this.pdfStylesService.getTableFontColour(),
              font: this.getArabicFontIfLanguageAR(this.pdfStylesService.getTableFont(), PdfConstants.FONT_STYLE_BOLD),
              fontSize: this.pdfStylesService.getTableFontSize()
            };
            if ((this.language !== PdfConstants.LANGUAGE_AR && index == 1 && footerRow[0] === undefined) ||
              (this.language === PdfConstants.LANGUAGE_AR && index == colHeaders.length-1 &&
                footerRow[colHeaders.length - 1] === undefined)) {
              footerRow[index - 1] = { content: this.translate.instant('totalAmt'), styles: footerStyles };
            } else if (colHeader.header === this.translate.instant('OPENING_AMOUNT') ||
              colHeader === this.translate.instant('OPENING_AMOUNT') && amountSum) {
              footerRow[index - 1] = { content: amountSum[0] ? amountSum[0] : '-', styles: footerStyles };
            } else if (colHeader.header ? colHeader.header.includes(this.translate.instant('EQUIVALENT_OPENING_BALANCE'))
              : colHeader.includes(this.translate.instant('EQUIVALENT_OPENING_BALANCE')) && amountSum) {
              footerRow[index - 1] = { content: amountSum[1] ? amountSum[1] : '-', styles: footerStyles };
            } else if (colHeader.header ? colHeader.header.includes(this.translate.instant('EQUIVALENT_PRINCIPAL_AMOUNT'))
              : colHeader.includes(this.translate.instant('EQUIVALENT_PRINCIPAL_AMOUNT')) && amountSum) {
              footerRow[index - 1] = { content: amountSum[1] ? amountSum[1] : '-', styles: footerStyles };
            } else if (colHeader.header === this.translate.instant('CURRENT_AMOUNT') ||
              colHeader === this.translate.instant('CURRENT_AMOUNT') && amountSum) {
              footerRow[index - 1] = { content: amountSum[1] ? amountSum[1] : '-', styles: footerStyles };
            } else if (colHeader.header === this.translate.instant('BALANCE_AT_MATURITY') ||
              colHeader === this.translate.instant('BALANCE_AT_MATURITY') && amountSum) {
              footerRow[index - 1] = { content: amountSum[2] ? amountSum[2] : '-', styles: footerStyles };
            } else if (colHeader.header ? colHeader.header.indexOf(this.translate.instant('EQUIVALENT_CURRENT_AMOUNT'))>-1
            : colHeader.indexOf(this.translate.instant('EQUIVALENT_CURRENT_AMOUNT'))>-1 && amountSum) {
            footerRow[index - 1] = { content: amountSum[3] ? amountSum[3] : '-', styles: footerStyles };
          }
          }
        }
      }
      });
      tableData.push(row);
    }
    if (this.isAccSummaryDashboard && footerRow.length>0) {
      tableData.push(footerRow);
    }
    if (tableData.length === 0 && this.isAccSummaryDashboard) {
      const bodyStyles = {
        halign: 'left', overflow: 'linebreak', textColor: this.pdfStylesService.getTableFontColour(),
        font: this.getArabicFontIfLanguageAR(this.pdfStylesService.getTableFont(), this.pdfStylesService.getTableFontStyle()),
        fontSize: this.pdfStylesService.getTableFontSize(),
        fontStyle: this.pdfStylesService.getTableFontStyle()
      };
      const row = [];
      row[Math.round(colHeaders.length/2)] = { content: this.translate.instant('noRecordsFound'), styles: bodyStyles };
      tableData.push(row);
    }
    const margin = {
      top: this.logoConfig.ycord + PdfConstants.MARGIN_50 + this.nextLine,
      right: PdfConstants.NUMB_30,
      bottom:PdfConstants.ADD_110
    };
    const styles = { font: this.getArabicFontIfLanguageAR(this.pdfStylesService.getTableFont(),
      this.pdfStylesService.getTableFontStyle()), fontStyle: this.pdfStylesService.getTableFontStyle(),
        halign: PdfConstants.ALIGN_LEFT };

    if (this.language === PdfConstants.LANGUAGE_AR) {
      margin.right = PdfConstants.NUMB_65;
      styles.halign = PdfConstants.ALIGN_RIGHT;
    }
    if(this.isRepeatHeader)
    {
      margin.top=this.logoConfig.ycord + PdfConstants.MARGIN_50 + this.nextLine + PdfConstants.Y_CORD_150;
    }
    this.pdf.autoTable({
      body: tableData,
      head: [tableHeaders],
      margin: margin,
      startY: this.ycord + this.nextLine,
      pageBreak: PdfConstants.PAGE_BREAK,
      styles: styles
    });
    // this.pdf.autoTable(headers, data, options);
  }

  /*
  PDF column value contain words
  with large text without space
  applying wordwrap to align properly
  */
  formatDataValueContainLargeText(dataValue:string){
    if(dataValue?.length > 50){
      dataValue = dataValue.replace(/(.{50})/g, '$1 ').trim();
    }
    return dataValue;
  }

  getTableDataValue(header, listData) {
    let dataValue: any;
    switch (header) {
      case FccGlobalConstant.ACCOUNT_TYPE:
      case FccGlobalConstant.ACCOUNTTYPECODE:
        dataValue = this.translate.instant('N068_' + listData[header]);
        break;
      case FccGlobalConstant.PRODUCTCODE:
        dataValue = this.translate.instant('N001_' + listData[header]);
        break;
      case FccGlobalConstant.TNXTYPECODE:
        dataValue = this.translate.instant('N002_' + listData[header]);
        break;
      case FccGlobalConstant.TOPIC:
        dataValue = this.translate.instant('P321_' + listData[header]);
        break;
      case FccGlobalConstant.SUB_TOPIC:
        dataValue = this.translate.instant('P812_' + listData[header]);
        break;
      case FccGlobalConstant.SUB_TNX_STAT_CODE:
        dataValue = this.translate.instant('N015_' + listData[header]);
        break;
      case FccGlobalConstant.NEXT_AUTHORISER:
        dataValue = this.translate.instant(listData[header]);
        break;
      case FccGlobalConstant.PROD_STAT_CODE:
        dataValue = this.translate.instant('N005_' + listData[header]);
        break;
      case FccGlobalConstant.TRANSACTION_TYPE:
          dataValue = this.translate.instant('C818_' + listData[header]);
          break;
      case FccGlobalConstant.subProductCode:
          if (listData[header] !== FccGlobalConstant.SAMPLE_COMMENT){
            dataValue = this.translate.instant('N047_' + listData[header]);
          } else {
            dataValue = listData[header];
          }
          break;
      case FccGlobalConstant.CASH_FUND_TRANSFER_TYPE :
          dataValue = this.translate.instant('C096_' + listData[header]);
          break;
      case FccGlobalConstant.TENOR_TYPE:
        dataValue = this.translate.instant('DraftAgainst_' + listData[header]);
        break;
      case FccGlobalConstant.ENTITY:
        if ((listData[header].includes('displayedFieldValue') || listData[header].includes('fieldValuePassbackParameters'))
          && ((listData[header] !== 'displayedFieldValue') || listData[header] !== 'fieldValuePassbackParameters')) {
          dataValue = listData[header].split("displayedFieldValue\":\"").pop().split("\"}")[0];
        } else {
          dataValue = listData[header];
        }
        break;
        case FccGlobalConstant.ACCOUNT_ENTITY_ABBV_NAME:
        if(!this.commonService.isEmptyValue(listData['originalGroupedVal'])){
          dataValue = listData['originalGroupedVal'];
        } else {
          dataValue = listData[header];
        }
        break;
      case FccGlobalConstant.LC_EXP_DATE_TYPE_CODE:
        dataValue = this.translate.instant('expiryType_' + listData[header]);
        break;
      case FccGlobalConstant.FT_TYPE:
        dataValue = this.translate.instant('ftType_' + listData[header]);
        break;
      case FccGlobalConstant.SUB_TNX_STAT_CODE:
        if (listData[header] === '01'){
          dataValue = this.translate.instant('SECQBK_' + listData[header]);
        } else {
          dataValue = listData[header];
        }
        break;

      case FccGlobalConstant.ACTION_REQ_CODE:
        dataValue = this.translate.instant('N042_' + listData[header]);
        break;
      case FccGlobalConstant.ENTITYCOL:
      case FccGlobalConstant.BENE_ACCOUNT_MASTER:
      case FccGlobalConstant.BENE_ACCOUNT_TNX:
        if (this.commonService.isnonEMptyString(listData[FccGlobalConstant.ORIG_GROUPED_VAL]))
        {
          dataValue = listData[FccGlobalConstant.ORIG_GROUPED_VAL];
        }else{
          dataValue = listData[header];
        }
        break;
      case FccGlobalConstant.BENE_DEFAULT_ACCOUNT:
        if( listData[header] === 'true'){
          dataValue = this.translate.instant('yes');
        } else{
          dataValue = this.translate.instant('no');
        }
        break;
      default:
        if (header === 'amt' || header === 'tnx_amt') {
          const val = listData[header];
          const groupSeprator = `${this.translate.instant('groupSeprator')}`;
          if (groupSeprator !== ' ' && val.indexOf(' ') > -1) {
            const currSymbol = val.split(' ')[1];
            if (localStorage.getItem('language') !== 'ar'){
              listData[header] = currSymbol.length !== 3 ? `${currSymbol} ${val.split(' ')[0]}` : val;
            }
          }
        }
        dataValue = listData[header];
    }
    return dataValue;
  }
  getArabicFontIfLanguageAR(font, style) {
    if (this.language === PdfConstants.LANGUAGE_AR) {
      if (PdfConstants.FONT_COURIER === font.toLowerCase() && PdfConstants.FONT_STYLE_NORMAL === style) {
        return PdfConstants.ARABIC_NORMAL_COURIER;
      } else if (PdfConstants.FONT_COURIER === font.toLowerCase() && PdfConstants.FONT_STYLE_BOLD === style) {
        return PdfConstants.ARABIC_BOLD_COURIER;
      } else if (PdfConstants.FONT_STYLE_BOLD === style.toLowerCase()) {
        return PdfConstants.ARABIC_BOLD_ARIAL;
      } else {
        return PdfConstants.ARABIC_NORMAL_ARIAL;
      }
    } else {
      if (PdfConstants.FONT_STYLE_BOLD === style.toLowerCase()) {
        return this.currencySymbolDisplayEnabled ? PdfConstants.ARABIC_BOLD_ARIAL : this.pdfStylesService.getTableFont();
      } else{
        return this.currencySymbolDisplayEnabled ? PdfConstants.ARABIC_NORMAL_ARIAL : this.pdfStylesService.getTableFont();
      }
    }
  }

  addSectionHeaderToPDF(sectionHeader, sectionStyles, showSectionHeader : boolean = true) {
    const firstColumnXCord = this.getXCordBasedOnLang(PdfConstants.FIRST_COLUMN_START_XCORD, PdfConstants.FIRST_COLUMN_START_XCORD_AR);
    this.fieldLabelYCord = this.ycord + PdfConstants.ADD_10;
    this.fieldContentYCord = this.ycord + PdfConstants.ADD_30;
    if (this.fieldContentYCord >= this.pageHeight) {
      this.addPage();
      this.fieldLabelYCord = this.ycord + PdfConstants.ADD_30;
      this.fieldContentYCord = this.ycord + PdfConstants.ADD_50;
      this.addHeaderExtraSpace = false;
      this.addSubHeaderExtraSpace = false;
      this.addFieldExtraSpace = false;
      this.lastFieldNarrative = false;
    }
    if (this.addHeaderExtraSpace) {
      this.fieldLabelYCord = this.fieldLabelYCord + PdfConstants.ADD_30;
      this.fieldContentYCord = this.fieldContentYCord + PdfConstants.ADD_30;
      this.addHeaderExtraSpace = false;
      this.addSubHeaderExtraSpace = false;
      this.addFieldExtraSpace = false;
      this.lastFieldNarrative = false;
    }
    this.addSubHeaderExtraSpace = false;
    this.addFieldExtraSpace = false;
    this.setPDFStyles(sectionStyles);
    const sectionHeaderTranslated = this.translate.instant(sectionHeader);
    if(sectionHeader === FccGlobalConstant.POPUP_MSG) {
      this.addLineBreakforMasterBar(sectionHeaderTranslated);
    } else {
      this.setHeaderStyles(sectionHeaderTranslated);
    }
    this.pdf.text(firstColumnXCord, this.fieldLabelYCord, sectionHeaderTranslated, this.setTextOption);
    // add line in header.
    this.pdf.setDrawColor(PdfConstants.COLOR_SECTION_HEADER_LINE);
    this.pdf.setLineWidth(PdfConstants.COLOR_SECTION_HEADER_LINE_WIDTH);
    const headerLineXCoOrd = this.getXCordBasedOnLang(
          this.pdf.getTextWidth(sectionHeaderTranslated) + firstColumnXCord + PdfConstants.ADD_20,
          PdfConstants.MAX_X_CORD - (this.pdf.getTextWidth(sectionHeaderTranslated) + PdfConstants.X_CORD_35 + PdfConstants.ADD_30));
    const headerLineYCoOrd = this.fieldLabelYCord - PdfConstants.SUBTRACT_HEADER_LINE_YCOORD;
    if (this.language === PdfConstants.LANGUAGE_AR)
    {
      this.pdf.line(PdfConstants.X_CORD_35, headerLineYCoOrd, headerLineXCoOrd, headerLineYCoOrd);
    }
    else {
      this.pdf.line(headerLineXCoOrd, headerLineYCoOrd, PdfConstants.FOOTER_LINE_X2, headerLineYCoOrd);
    }
  }

  generatePdfWithData(pdfData) {
    this.formDataMap = new Map();
    this.allControlsMap = new Map();
    this.sectionNames = this.stateService.getSectionNames(this.isMaster, this.stateType);
    this.sectionNames.forEach(sectionName => {
      const value: FCCFormGroup = pdfData.get(sectionName);
      const pdfParams: any = value.pdfParams;
      const hasSubSection = true;
      const sectionForm = this.stateService.getSectionData(sectionName, this.productCode, this.isMaster, this.stateType);
      if (sectionForm[this.rendered] !== false) {
        if (this.getAccordionSectionsList().length > 0 && this.getAccordionSectionsList().indexOf(sectionName) > -1) {
          const fieldsMap = new Map();
          Object.keys(value.controls).forEach(subSectionName => {
            // const subSectionForm = value.controls[subSectionName] as FCCFormGroup;
            const subSectionForm = sectionForm.controls[subSectionName] as FCCFormGroup;

            if (subSectionForm[this.rendered] !== false) {
              const fieldDetails = this.iterateMapControl(subSectionName, subSectionForm.controls, value.pdfParams);
              fieldsMap.set(subSectionName, fieldDetails);
             }
          });

          const formDetails: FormDetails = {
            pdfParams,
            fieldsMap,
            hasSubSection
          };
          this.formDataMap.set(sectionName, formDetails);
        } else {
          const formDetails = this.iterateMapControl(sectionName, value.controls, value.pdfParams);
          this.formDataMap.set(sectionName, formDetails);
        }
    }
    });

    this.generateEmptyFile();
    this.addDataToPdfFile(this.formDataMap);
    this.saveFile();
  }

  generateBatchPdf(batchPdfData, sectionNames, productCode, subProductCode) {
    this.productCode = productCode;
    if (subProductCode) {
      this.subProductCode = subProductCode;
    }
    this.language = this.translate.currentLang;
    if (this.language === PdfConstants.LANGUAGE_AR) {
      this.logoConfig.xcord = PdfConstants.X_CORD_430_AR;
      this.xcord = PdfConstants.X_CORD_530_AR;
      this.setTextOption = { align: PdfConstants.ALIGN_RIGHT, lang: PdfConstants.LANGUAGE_AR };
    }
    this.sectionNames = sectionNames;
    let lastElement = false;
    let index = 0;
    this.generateEmptyFile();
    // Remove Key since it is not used. LINT issue FIX
    batchPdfData.forEach((pdfData: any) => {
      this.formDataMap = new Map();
      this.allControlsMap = new Map();
      sectionNames.forEach(sectionName => {
      const value: FCCFormGroup = this.commonService.getSectionForm(sectionName, pdfData);
      const sectionForm = this.commonService.getSectionForm(sectionName, pdfData);
      if (sectionForm[this.rendered] !== false) {
          const formDetails = this.iterateMapControl(sectionName, value.controls, value.pdfParams);
          this.formDataMap.set(sectionName, formDetails);
      }
    });
    if(index > 0){
      this.addHeaderExtraSpace = false;
    }
    this.isBatchAttachmentPage = true;
    this.addDataToPdfFile(this.formDataMap);
    this.isBatchBlankPage = false;
    index++;
    if(index === batchPdfData.size){
      lastElement = true;
    }
    if(!lastElement){
      this.isBatchBlankPage = true;
      this.addExtraSpace();
    }
    });
    this.isBatchAttachmentPage = false;
    this.pdf.save('Batch.pdf');
  }

  addExtraSpace(){
    this.addPage();
    if (this.fieldContentYCord >= this.pageHeight) {
      this.fieldLabelYCord = this.ycord + PdfConstants.ADD_10;
    }
    this.fieldLabelYCord = this.fieldLabelYCord - PdfConstants.ADD_30;
    this.fieldContentYCord = this.fieldContentYCord - PdfConstants.ADD_30;
    this.pdf.setFontSize(PdfConstants.PRODUCT_CODE_FONT_SIZE).setFont(undefined, 'bold');
    this.pdf.setTextColor(PdfConstants.COLOR_TABLE_TEXT);
    const batchBlankPageMessage = this.translate.instant('batchBlankPageMessage');
    this.checkArabicFont(batchBlankPageMessage, this.pdfStylesService.getProductCodeFont(), PdfConstants.FONT_STYLE_BOLD);
    const headerProductCodeXcord = this.getXCordBasedOnLang(PdfConstants.Y_CORD_100,
      PdfConstants.HEADER_PRODUCT_CODE_X_COORD_415_AR);
    this.checkArabicFont(batchBlankPageMessage, this.pdfStylesService.getProductCodeFont(), PdfConstants.FONT_STYLE_BOLD);
    this.pdf.text(headerProductCodeXcord, PdfConstants.HEADER_PRODUCT_CODE_X_COORD_300_AR, batchBlankPageMessage, this.setTextOption);

    this.pdf.setTextColor(PdfConstants.COLOR_TABLE_HEADER_TEXT);
    this.pdf.setFontSize(PdfConstants.SECTION_SUB_HEADER_FONT_SIZE).setFont(undefined, 'bold');
    this.checkArabicFont(batchBlankPageMessage, this.pdfStylesService.getProductCodeFont(), PdfConstants.FONT_STYLE_BOLD);
    this.addLeftBar('', batchBlankPageMessage);
    this.addPage();
    this.addHeaderText();
    if (this.productCode !== FccGlobalConstant.PRODUCT_SE) {
      this.addDownloadDateTime();
      this.addDateFormatNote();
    }
    this.isBatchBlankPage = false;
    this.addLeftBar();
    this.addRightBar();
    const pageHeightSub = PdfConstants.PAGE_HEIGHT_SUB_80;
    this.pageHeight = this.pdf.internal.pageSize.height - pageHeightSub;
    this.fieldLabelYCord = this.fieldLabelYCord - PdfConstants.ADD_20;
    this.fieldContentYCord = this.fieldContentYCord - PdfConstants.ADD_20;
    this.isBatchBlankPage = false;
  }

  iterateMapControl(sectionName: string, sectionControls, pdfParams?: any) {
    const fieldsMap = new Map();
    let hasSubSection = false;
    const notUnderAnyHeader = 'notunderanyheader';
    Object.keys(sectionControls).forEach(controlName => {
      if ((this.listOfApplicationDate.indexOf(controlName) > -1) && (this.applicationDate === undefined
        || this.applicationDate === null || this.applicationDate === '')) {
          this.applicationDate = sectionControls[controlName].value;
      }
      this.allControlsMap.set(controlName, sectionControls[controlName]);
      const previewScreen = this.getPreviewScreenValue(sectionControls[controlName]);
      this.handleAmountFields(sectionControls, controlName);
      this.handleAmendNarrative(sectionControls, controlName);
      this.handleCrossRefsFields(sectionControls, controlName);
      this.handleCheckBoxFields(sectionControls, controlName);
      const rendered = sectionControls[controlName][this.params][this.rendered];
      const groupHead = sectionControls[controlName][this.params][this.grouphead];
      if ((previewScreen && rendered) || (this.clubbeItemsMap && this.clubbeItemsMap.has(controlName) && previewScreen)) {
      const fieldValue = sectionControls[controlName].value;
      if (sectionControls[controlName][this.params][this.groupChildren] && !fieldsMap.has(sectionControls[controlName][this.key])) {
          const fieldDetails = this.setFieldDetailsForNewGroupChildren(sectionControls[controlName], fieldValue);
          hasSubSection = true;
          const groupHeaderText = sectionControls[controlName][this.groupHeaderText]
          ? sectionControls[controlName][this.groupHeaderText] : sectionControls[controlName][this.key];
          fieldsMap.set(groupHeaderText, fieldDetails);
        } else if (sectionControls[controlName][this.params][FccGlobalConstant.DYNAMIC_CRITERIA] &&
          sectionControls[controlName][this.params][FccGlobalConstant.DYNAMIC_CRITERIA][FccGlobalConstant.DC_DEPENDANT_CONTROL] &&
          sectionControls[controlName][this.params][FccGlobalConstant.DYNAMIC_CRITERIA][FccGlobalConstant.DC_DPNDNT_CNTRL_FLAG]) {
            const dependCOntrol =
            sectionControls[controlName][this.params][FccGlobalConstant.DYNAMIC_CRITERIA][FccGlobalConstant.DC_DEPENDANT_CONTROL];
            const requiredValue = sectionControls[controlName][this.params][FccGlobalConstant.DYNAMIC_CRITERIA]['requiredValue'];
            if(sectionControls[dependCOntrol]=== undefined){
              return;
            }
            if(this.commonService.isnonEMptyString(requiredValue) &&
            requiredValue === sectionControls[dependCOntrol]['value']){
              const fieldDetails: FieldControlDetails = {
                fieldControls: sectionControls[controlName]
              };
              sectionControls[controlName][this.params][this.rendered] = true;
              if (this.clubbeItemsMap && this.clubbeItemsMap.has(controlName) && sectionControls[controlName].params[this.clubbedList]) {
                const clubbedFieldDetails = this.setFieldDetailsOfClubbedList(sectionControls[controlName], sectionControls);
                hasSubSection = false;
                const clubbedHeaderText = sectionControls[controlName][this.params][this.clubbedHeaderText]
                ? sectionControls[controlName][this.params][this.clubbedHeaderText] : sectionControls[controlName][this.key];
                fieldsMap.set(clubbedHeaderText, clubbedFieldDetails);
              } else if(!fieldsMap.has(controlName)){
                fieldsMap.set(sectionControls[controlName][this.key], fieldDetails);
              }
            }
        } else if (groupHead && fieldsMap.has(groupHead) && groupHead !== notUnderAnyHeader) {
          const newFieldDetails = this.setFieldDetailsExistingGroupHead(sectionControls[controlName], fieldValue, fieldsMap.get(groupHead));
          hasSubSection = true;
          fieldsMap.set(groupHead, newFieldDetails);
        } else if (this.clubbeItemsMap && this.clubbeItemsMap.has(controlName) && sectionControls[controlName].params[this.clubbedList]) {
          let showField = true;
          if (sectionControls[controlName].params && sectionControls[controlName].params.dynamicCriteria
            && sectionControls[controlName].params.dynamicCriteria.hideByProperty && this.showAvailableAmount === false) {
            showField = false;
          }
          if (showField) {
            const fieldDetails = this.setFieldDetailsOfClubbedList(sectionControls[controlName], sectionControls);
            hasSubSection = false;
            const clubbedHeaderText = sectionControls[controlName][this.params][this.clubbedHeaderText]
              ? sectionControls[controlName][this.params][this.clubbedHeaderText] : sectionControls[controlName][this.key];
            fieldsMap.set(clubbedHeaderText, fieldDetails);
          }
        } else if (groupHead && !fieldsMap.has(groupHead) && groupHead !== notUnderAnyHeader) {
          const fieldDetails = this.setFieldDetailsForNewGroupHead(sectionControls[controlName], fieldValue);
          if(sectionControls[groupHead] && sectionControls[groupHead][this.params][FccGlobalConstant.HIDE_GRP_HEADER_VIEW]
            && sectionControls[groupHead][this.params][FccGlobalConstant.HIDE_GRP_HEADER_VIEW] == true){
            fieldDetails.hideSubHeader = true;
          }
          hasSubSection = true;
          fieldsMap.set(groupHead, fieldDetails);
        } else if (sectionControls[controlName][this.key] !== null && !fieldsMap.has(sectionControls[controlName][this.key])
          && this.clubbedTrueFields.indexOf(sectionControls[controlName][this.key]) === -1) {
          const fieldDetails: FieldControlDetails = {
            isSubSection: false,
            fieldControls: sectionControls[controlName]
          };
          fieldsMap.set(sectionControls[controlName][this.key], fieldDetails);
        }
      } else if (this.listOfBackToBackTogglesData.indexOf(controlName) > -1) {
        const fieldDetails: FieldControlDetails = {
          isSubSection: false,
          fieldControls: sectionControls[controlName]
        };
        fieldsMap.set(sectionControls[controlName][this.key], fieldDetails);
      }
    });
    const formDetails: FormDetails = {
      pdfParams,
      fieldsMap,
      hasSubSection
    };
    return formDetails;
  }

  protected handleAmendNarrative(sectionControls: any, controls: string) {
    if (sectionControls[controls][this.params][FccGlobalConstant.NARRATIVE_PDF] &&
      (this.operationType === FccGlobalConstant.PREVIEW || this.operationType === FccGlobalConstant.LIST_INQUIRY) &&
      this.tnxTypeCode === FccGlobalConstant.N002_AMEND) {
      sectionControls[controls][this.params][this.rendered] = true;
    }
    if (sectionControls[controls][this.params][FccGlobalConstant.NARRATIVE_RENDER_PDF]
      && (this.operationType === FccGlobalConstant.PREVIEW || this.operationType === FccGlobalConstant.LIST_INQUIRY)
      && this.tnxTypeCode === FccGlobalConstant.N002_AMEND) {
      sectionControls[controls][this.params][this.rendered] = false;
    }
  }
  protected handleAmountFields(sectionControls: any, controls: string) {
    if ((sectionControls[controls][this.params][FccGlobalConstant.PDF_DISPLAY_HIDDEN_VALUE]) &&
      (this.operationType === FccGlobalConstant.PREVIEW || this.operationType === FccGlobalConstant.LIST_INQUIRY) &&
      this.tnxTypeCode === FccGlobalConstant.N002_AMEND) {
        sectionControls[controls][this.params][this.rendered] = false;
      }
    if ((sectionControls[controls][this.params][FccGlobalConstant.PDF_DISPLAY_HIDDEN_VALUE]) === true &&
    (this.operationType === FccGlobalConstant.PREVIEW || this.operationType === FccGlobalConstant.LIST_INQUIRY) &&
    this.commonService.isNonEmptyValue(sectionControls[controls].value)) {
      sectionControls[controls][this.params][this.rendered] = true;
    }
  }

  protected handleCrossRefsFields(sectionControls: any, controls: string) {
    if (sectionControls[controls][this.params][FccGlobalConstant.RETRIEVE_INDIVIDUAL_CROSS_REFS] &&
      (sectionControls[controls][this.params][FccGlobalConstant.DATA].length === 0)) {
      sectionControls[controls][this.params][this.rendered] = false;
    }
  }

  protected handleCheckBoxFields(sectionControls: any, controls: string) {
    if ((sectionControls[controls][this.params][FccGlobalConstant.PDF_DISPLAY_CHECKBOX]) === true &&
      (this.operationType === FccGlobalConstant.PREVIEW || this.operationType === FccGlobalConstant.LIST_INQUIRY)) {
      if (sectionControls[controls].value && sectionControls[controls].value === FccGlobalConstant.CODE_Y) {
        sectionControls[controls][this.params][this.rendered] = false;
      } else {
        sectionControls[controls][this.params][this.rendered] = true;
      }
    }
  }

  getSubSectionDetails(subSectionControl, subSectionFieldsControl, addNotEntered): SubSectionDetails {
    const fieldDetailsList = [];
    let subSectionDetails: SubSectionDetails;
    let valueEnteredInSection = false;
    let tempAddress;
    subSectionFieldsControl.forEach((fieldControl) => {
      const previewScreen = this.getPreviewScreenValue(fieldControl);
      const rendered = fieldControl[this.params][this.rendered];
      const fieldKey = fieldControl[this.key];
      const tempFieldDetails = this.getFieldDataDetails(fieldControl, addNotEntered);
      if (this.clubbeItemsMap.has(fieldKey)) {
        let clubbedValue = '';
        let clubbedPrevValue = '';
        let spaceValue = ' ';
        let childFieldType = '';
        let clubbedHeader = this.getClubbedHeader(fieldControl);
        let clubbedDelimiter = ' ';
        const tempDelimiter = this.getClubbedDelimiter(fieldControl);
        if (tempDelimiter !== ' ') {
          clubbedDelimiter = tempDelimiter;
        }
        if (clubbedDelimiter === FccGlobalConstant.NEXT_LINE_CHAR) {
          spaceValue = '';
        }
        let addField = true;
        if (fieldControl[this.params][this.clubbedList]) {
          this.clubbedChildList.splice(0, this.clubbedChildList.length);
          const clubbedList = fieldControl[this.params][this.clubbedList];
          const fieldType = fieldControl[this.params][FccGlobalConstant.FIELD_TYPE];
          clubbedList.forEach(childField => {
            const childControl = this.allControlsMap.get(childField);
            if (childControl !== undefined) {
              childFieldType = childControl[this.params][FccGlobalConstant.FIELD_TYPE];
              const previewScreenChild = this.getPreviewScreenValue(childControl);
              const renderedChild = childControl[this.params][this.rendered];
              if (!(renderedChild)) {
                this.clubbedChildList.push(childField);
              }
              const tempChildFieldDetails = this.getFieldDataDetails(childControl, addNotEntered);
              if (previewScreenChild && renderedChild) {
                const childValue = this.getClubbedValue(childControl, tempChildFieldDetails);
                const childPrevValue = this.getClubbedPreviousValue(childControl, tempChildFieldDetails);
                if (childValue && childValue.length > 0) {
                  clubbedValue += childValue + clubbedDelimiter + spaceValue;
                }
                if (fieldType === FccGlobalConstant.AMOUNT_FIELD && childValue === '') {
                  addField = false;
                }
                if(childPrevValue && childValue.length > 0){
                  clubbedPrevValue += childPrevValue + clubbedDelimiter + spaceValue;
                }
              }
            }
          });
          if (fieldType === FccGlobalConstant.AMOUNT_FIELD && clubbedList.length === this.clubbedChildList.length) {
            addField = false;
          }
        }
        if (clubbedValue.length > 0) {
          clubbedValue = clubbedValue.substring(0, clubbedValue.length - FccGlobalConstant.LENGTH_2);
        }
        if (clubbedPrevValue.length > 0) {
          clubbedPrevValue = clubbedPrevValue.substring(0, clubbedPrevValue.length - FccGlobalConstant.LENGTH_2);
        } else if (clubbedPrevValue === '' && clubbedValue !== ''){
          clubbedPrevValue = this.notEntered;
        }
        if (clubbedValue.length > 0) {
          valueEnteredInSection = true;
        } else if (addNotEntered) {
          clubbedValue = this.notEntered;
        }
        if (clubbedHeader) {
          clubbedHeader = this.translate.instant(clubbedHeader);
        }
        const newFieldDetails: FieldDetails = {
          label: clubbedHeader,
          value: clubbedValue,
          fieldType: childFieldType,
          previousValue: clubbedPrevValue,
          pdfParams: (tempFieldDetails && tempFieldDetails !== null) ? tempFieldDetails.pdfParams : '',
          singleColumn: (tempFieldDetails && tempFieldDetails !== null) ? tempFieldDetails.singleColumn : false,
        };
        // In case of amount field, dont add the field is ccy is available and amount is empty.
        if (addField) {
          fieldDetailsList.push(newFieldDetails);
        }
      } else if (this.clubbedTrueFields.indexOf(fieldKey) === -1 && previewScreen && rendered) {
        valueEnteredInSection = true;
        fieldDetailsList.push(tempFieldDetails);
      } else if (fieldKey === FccGlobalConstant.ISSUING_BANK_FIRST_ADDRESS ||
        fieldKey === FccGlobalConstant.ISSUING_BANK_SECOND_ADDRESS ||
        fieldKey === FccGlobalConstant.ISSUING_BANK_THIRD_ADDRESS ||fieldKey === FccGlobalConstant.ISSUING_BANK_FOURTH_ADDRESS
        && previewScreen && rendered) {
        valueEnteredInSection = true;
        if (tempAddress === undefined) {
          tempAddress = tempFieldDetails.value;
        } else {
          tempAddress = tempAddress + ', ' + tempFieldDetails.value;
        }
        if (fieldKey === FccGlobalConstant.ISSUING_BANK_THIRD_ADDRESS) {
          const newFieldDetails: FieldDetails = {
            label: `${this.translate.instant(FccGlobalConstant.ISSUING_BANK_FULL_ADDRESS)}`,
            value: tempAddress,
            pdfParams: (tempFieldDetails && tempFieldDetails !== null) ? tempFieldDetails.pdfParams : '',
            singleColumn: (tempFieldDetails && tempFieldDetails !== null) ? tempFieldDetails.singleColumn : false,
          };
          fieldDetailsList.push(newFieldDetails);
        }
      }
    });
    if (valueEnteredInSection) {
      subSectionDetails = {
        isSubSection: true,
        listOfFields: fieldDetailsList,
        pdfParams: subSectionControl.pdfParams,
        hideSubHeader: subSectionControl.hideSubHeader
      };
    } else {
      subSectionDetails = {
        isSubSection: true,
        listOfFields: undefined,
        pdfParams: subSectionControl.pdfParams,
        hideSubHeader: subSectionControl.hideSubHeader
      };
    }
    return subSectionDetails;
  }

  getClubbedValue(fieldControl, fieldDetails): string {
    let clubbedValue = '';
    if (fieldControl.type === FccGlobalConstant.checkBox) {
      if (fieldControl.value && fieldControl.params[FccGlobalConstant.TRANSLATE]) {
        const translateVal = fieldControl.params[FccGlobalConstant.TRANSLATE_VALUE];
        clubbedValue = `${this.translate.instant( translateVal + fieldControl.value)}`;
      } else if (fieldControl.value === FccBusinessConstantsService.YES) {
        clubbedValue = fieldDetails.label;
      }
    } else if (this.commonService.isNonEmptyValue(fieldDetails) && fieldDetails.value !== this.notEntered) {
      clubbedValue = fieldDetails.value;
    }
    return clubbedValue;
  }

  getClubbedPreviousValue(fieldControl, fieldDetails){
    let clubbedValue = '';
    if (fieldControl.type === FccGlobalConstant.checkBox) {
      if (fieldControl.params[FccGlobalConstant.PREVIOUSVALUE] && fieldControl.params[FccGlobalConstant.TRANSLATE]) {
        const translateVal = fieldControl.params[FccGlobalConstant.TRANSLATE_VALUE];
        clubbedValue = `${this.translate.instant( translateVal + fieldControl.params[FccGlobalConstant.PREVIOUSVALUE])}`;
      } else if (fieldControl.value === FccBusinessConstantsService.YES) {
        clubbedValue = fieldDetails.label;
      }
    } else if (this.commonService.isNonEmptyValue(fieldDetails) && fieldDetails.previousValue !== this.notEntered) {
      clubbedValue = fieldDetails.previousValue;
    }
    return clubbedValue;
  }

  addContentValueToPdf(fieldValue, xcord, maxAllowedLength, addExtraSpace, isSingleColumn, isFirstColumn, previousValue?) {
    if (fieldValue !== null && fieldValue !== '') {
      const fieldValueLength = this.pdf.getTextWidth(fieldValue);
      if (isFirstColumn) {
        this.firstColfieldLabelYCordAfterSplit = 0;
        this.firstColFieldContentYCordAfterSplit = 0;
        this.firstColfieldLabelYCordBeforeSplit = 0;
        this.firstColFieldContentYCordBeforeSplit = 0;
        this.newPageAddedDuringFirstColSplit = false;
      } else {
        this.movedToAlreadyAddedPageDuringSecondColSplit = false;
      }
      if (fieldValueLength > maxAllowedLength) {
        const tempLabelYCord = this.fieldLabelYCord;
        const tempContentYCord = this.fieldContentYCord;
        const splitValue = this.pdf.splitTextToSize(fieldValue, maxAllowedLength, { pageSplit: true });
        for (const splitText of splitValue) {
          if (this.fieldContentYCord >= this.pageHeight) {
            if (isFirstColumn) {
              this.addPage();
              this.newPageAddedDuringFirstColSplit = true;
            } else {
              if (this.newPageAddedDuringFirstColSplit) {
                this.pdf.setPage(this.pageNumber);
                this.movedToAlreadyAddedPageDuringSecondColSplit = true;
              } else {
                this.addPage();
              }
            }
            this.fieldLabelYCord = this.ycord + PdfConstants.ADD_20;
            this.fieldContentYCord = this.ycord + PdfConstants.ADD_40;
            this.setContentStyles(fieldValue);
            this.addHeaderExtraSpace = false;
            this.addSubHeaderExtraSpace = false;
            this.addFieldExtraSpace = false;
            this.lastFieldNarrative = false;
          }
          this.pdf.text(xcord, this.fieldContentYCord, splitText, this.setTextOption);
          const yCoOrdGap = PdfConstants.Y_COORD_GAP_2;
          this.fieldContentYCord = this.fieldContentYCord + (this.nextLine * yCoOrdGap);
        }
        /**
         * If not a single column field and it is the second column.
         * check if the first column lable and content Y cord after split are greater than the current cord after split.
         * If yes, set to the greater value.
         */
        if (!isSingleColumn && !isFirstColumn && this.firstColFieldContentYCordAfterSplit > this.fieldContentYCord) {
          this.fieldLabelYCord = this.firstColfieldLabelYCordAfterSplit;
          this.fieldContentYCord = this.firstColFieldContentYCordAfterSplit;
        }
        /**
         * If - single column data (OR) not single column field and its the second column.
         * Increment so that cord move to the next line.
         * ELSE If - Not single column field and its the first column.
         * Reset the label and content cord to same as initial values of first column cord.
         * Set the current cord after split to be used after the second column.
         */
        if (isSingleColumn || (!isSingleColumn && !isFirstColumn)) {
          this.fieldLabelYCord = this.fieldContentYCord - PdfConstants.ADD_20;
          // this.fieldContentYCord = this.fieldContentYCord + PdfConstants.ADD_40;
        } else if (!isSingleColumn && isFirstColumn) {
          this.firstColfieldLabelYCordAfterSplit = this.fieldContentYCord - PdfConstants.ADD_20;
          this.firstColFieldContentYCordAfterSplit = this.fieldContentYCord;
          this.firstColfieldLabelYCordBeforeSplit = tempLabelYCord;
          this.firstColFieldContentYCordBeforeSplit = tempContentYCord;
          this.fieldLabelYCord = this.firstColfieldLabelYCordAfterSplit;
          this.fieldContentYCord = this.firstColFieldContentYCordAfterSplit;
        }
      } else {
        if(typeof(previousValue) === 'string' && previousValue && (previousValue !== fieldValue)
          && !this.eventsection && this.amendedValue) {
          this.setContentStyles(previousValue, null, true, xcord);
          this.pdf.text(xcord, this.fieldContentYCord , previousValue, this.setTextOption);
          this.setContentStyles(fieldValue, null, false);
          this.pdf.text(xcord, this.fieldContentYCord+15, fieldValue, this.setTextOption);
          this.setAmendedChords = true;
        } else {
          this.setContentStyles(fieldValue, null, false);
          this.pdf.text(xcord, this.fieldContentYCord, fieldValue, this.setTextOption);
        }
        if (!isSingleColumn && !isFirstColumn && this.firstColFieldContentYCordAfterSplit > this.fieldContentYCord) {
        this.fieldLabelYCord = this.firstColfieldLabelYCordAfterSplit;
        this.fieldContentYCord = this.firstColFieldContentYCordAfterSplit;
        }
        if (this.fieldLabelYCord === this.fieldContentYCord && addExtraSpace) {
          this.fieldContentYCord = this.fieldContentYCord + PdfConstants.ADD_20;
        }
        if (fieldValue.includes('\n')) {
          const numberOfLines = (fieldValue.split('\n').length) - 1;
          this.fieldLabelYCord = this.fieldLabelYCord + (numberOfLines) * PdfConstants.ADD_10;
          this.fieldContentYCord = this.fieldContentYCord + (numberOfLines) * PdfConstants.ADD_10;
        }
        if (isSingleColumn ) {
          this.fieldLabelYCord = this.fieldLabelYCord + PdfConstants.ADD_10;
          this.fieldContentYCord = this.fieldContentYCord + PdfConstants.ADD_10;
        }
      }
    }
  }

  addLabelToPdf(fieldLabel, xcord, maxAllowedLength, isSecondColumn, previousValue?) {
    const fieldLabelStyle = fieldLabel;
    if (previousValue){
      const amendTag = FccGlobalConstant.PDF_AMENDED;
      fieldLabel = fieldLabel + ' ' + amendTag;
    }
    const fieldValueLength = this.pdf.getTextWidth(fieldLabel);
    let tempLabelYCord = this.fieldLabelYCord;
    if (fieldValueLength > maxAllowedLength) {
      this.extraLineInLabel = true;
      const splitValue = this.pdf.splitTextToSize(fieldLabel, maxAllowedLength, { pageSplit: true });
      for (const splitText of splitValue) {
        if (tempLabelYCord >= this.pageHeight) {
          this.addPage();
          tempLabelYCord = this.ycord + PdfConstants.ADD_20;
          tempLabelYCord = this.ycord + PdfConstants.ADD_40;
          this.setLabelStyles(fieldLabelStyle);
          this.addHeaderExtraSpace = false;
          this.addSubHeaderExtraSpace = false;
          this.addFieldExtraSpace = false;
          this.lastFieldNarrative = false;
        }
        this.pdf.text(xcord, tempLabelYCord, splitText, this.setTextOption);
        const yCoOrdGap = PdfConstants.Y_COORD_GAP_2;
        tempLabelYCord = tempLabelYCord + (this.nextLine * yCoOrdGap);
      }
      if (isSecondColumn) {
        this.fieldLabelYCord = tempLabelYCord + PdfConstants.ADD_20;
      }
      this.fieldContentYCord = tempLabelYCord + PdfConstants.ADD_20;
    } else {
      this.extraLineInLabel = false;
      this.pdf.text(xcord, this.fieldLabelYCord, fieldLabel, this.setTextOption);
    }
  }

  checkAddPage(labelGap, contentGap) {
    if (this.fieldContentYCord >= this.pageHeight) {
      this.addPage();
      this.fieldLabelYCord = this.ycord + labelGap;
      this.fieldContentYCord = this.ycord + contentGap;
      this.addHeaderExtraSpace = false;
      this.addSubHeaderExtraSpace = false;
      this.addFieldExtraSpace = false;
      this.lastFieldNarrative = false;
    }
  }

  getPreviewScreenValue(fieldControl): boolean {
    let previewScreen = fieldControl[this.params][this.previewScreen];
    previewScreen = previewScreen === false ? false : true;
    return previewScreen;
  }

  getClubbedDelimiter(fieldControl): string {
    let clubbedDelimiter = ' ';
    if (fieldControl && fieldControl[this.params][this.clubbedDelimiter]) {
      clubbedDelimiter = fieldControl[this.params][this.clubbedDelimiter];
    }
    return clubbedDelimiter;
  }

  getClubbedHeader(fieldControl) {
    let clubbedHeader = fieldControl[this.params][this.clubbedHeaderText] ?
    fieldControl[this.params][this.clubbedHeaderText] : fieldControl[this.params][this.label];
    if (clubbedHeader.indexOf('clubbed_address') > -1) {
      clubbedHeader = 'clubbed_address';
    }
    return clubbedHeader;
  }

  handleAlreadyAddedSection(sectionHeader, sectionControls, subSectionHeader, subSectionControl) {
    const existingSectionDetails = this.sectionDataMap.get(sectionHeader); // get section details
    const existingFieldsMap = existingSectionDetails.fieldsMap; // get field details
    let hasSubSection = false;
    const addNotEntered = this.checkForNotEntered(sectionHeader);
    const sectionFieldControl = subSectionControl[this.fieldControls];
    if (subSectionControl.isSubSection) {
      hasSubSection = true;
      if (subSectionControl[this.fieldControls] === undefined || subSectionControl[this.fieldControls].length === 0) {
        const subSectionDetails: SubSectionDetails = {
          isSubSection: true,
          listOfFields: undefined,
          pdfParams: subSectionControl.pdfParams,
          hideSubHeader: subSectionControl.hideSubHeader
        };
        existingFieldsMap.set(subSectionHeader, subSectionDetails);
      } else if (subSectionControl[this.fieldControls][this.type] !== FccGlobalConstant.FORM_TABLE) {
        const subSectionDetails: SubSectionDetails =
        this.getSubSectionDetails(subSectionControl, subSectionControl[this.fieldControls], addNotEntered);
        existingFieldsMap.set(subSectionHeader, subSectionDetails);
      }
    } else if (subSectionControl.isClubbedItem) {
      const fieldDataDetails = this.getFieldDetailsOfClubbedLists(subSectionHeader, subSectionControl[this.fieldControls]);
      if (fieldDataDetails !== null && (subSectionControl[this.fieldControls][this.type] !== FccGlobalConstant.FORM_TABLE)) {
        const fieldDetailsList = [];
        fieldDetailsList.push(fieldDataDetails);
        const fieldDetails: SubSectionDetails = {
          isSubSection: false,
          listOfFields: fieldDetailsList
        };
        existingFieldsMap.set(subSectionHeader, fieldDetails);
      }
    } else if (sectionFieldControl && sectionFieldControl[FccGlobalConstant.TYPE] === FccGlobalConstant.MAT_CARD ) {
      const previewScreen = this.getPreviewScreenValue(subSectionControl[this.fieldControls]);
      const rendered = subSectionControl[this.fieldControls][this.params][this.rendered];
      const showViewDetails = subSectionControl[this.fieldControls][this.params][this.showViewDetails];
      if (previewScreen && rendered) {
        const cardFieldsList = sectionFieldControl[this.params][FccGlobalConstant.OPTIONS];
        const fieldDetailsList = [];
        cardFieldsList?.forEach(fieldName => {
          const cardFieldDetails = {
            label: this.translate.instant(fieldName?.header),
            value: fieldName?.value
           };
          fieldDetailsList.push(cardFieldDetails);
        });
        const fieldDetails: SubSectionDetails = {
          isSubSection: false,
          listOfFields: fieldDetailsList,
          pdfParams: sectionFieldControl[this.pdfParams],
          hideSubHeader: subSectionControl.hideSubHeader,
          fieldType: FccGlobalConstant.MAT_CARD
        };
        this.commonService.getChildTnxInformation().subscribe(
          (childTnx: string) => {
            this.childTnxObj = childTnx;
          }
        );
        if (showViewDetails) {
          if (this.childTnxObj) {
            this.childRefID = this.childTnxObj[FccGlobalConstant.CHANNELREF];
          } else {
            this.commonService.getChildReferenceAsObservable().subscribe(
              (childRef: string) => {
                this.childRefID = childRef;
              }
            );
          }
        }
        let matCardHeader;
        if (this.commonService.isnonEMptyString(this.childRefID)) {
        matCardHeader = (this.translate.instant(subSectionControl[this.fieldControls][this.key])).
        concat(" | ").concat(this.childRefID);
        } else {
          matCardHeader = (subSectionControl[this.fieldControls][this.key]);
        }
        existingFieldsMap.set(matCardHeader, fieldDetails);
      }
    } else if (sectionFieldControl && sectionFieldControl[FccGlobalConstant.TYPE] === FccGlobalConstant.expansionPanelTable
      && this.tnxTypeCode === FccGlobalConstant.N002_NEW) {
      const previewScreen = this.getPreviewScreenValue(subSectionControl[this.fieldControls]);
      const rendered = subSectionControl[this.fieldControls][this.params][this.rendered];
      if (previewScreen && rendered) {
        const fieldDetailsList = [];
        let fieldDataDetails: FieldDetails = null;
        fieldDataDetails = {
          label: sectionFieldControl[this.params][FccGlobalConstant.LABEL],
          value: sectionFieldControl[FccGlobalConstant.VALUE],
          pdfParams: sectionFieldControl[this.pdfParams]
        };
        fieldDetailsList.push(fieldDataDetails);
        const fieldDetails: SubSectionDetails = {
          isSubSection: false,
          listOfFields: fieldDetailsList,
          pdfParams: sectionFieldControl[this.pdfParams],
          hideSubHeader: subSectionControl.hideSubHeader,
          fieldType: FccGlobalConstant.expansionPanelTable
        };
        existingFieldsMap.set(subSectionControl[this.fieldControls][this.key], fieldDetails);
      }
    } else if (sectionFieldControl && sectionFieldControl[this.params]
      && sectionFieldControl[this.params][`pdfFieldType`] === 'table') {
      const previewScreen = this.getPreviewScreenValue(subSectionControl[this.fieldControls]);
      const rendered = subSectionControl[this.fieldControls][this.params][this.rendered];
      if (previewScreen && rendered) {
        const fieldDetailsList = [];
        let fieldDataDetails: FieldDetails = null;
        fieldDataDetails = {
          label: sectionFieldControl[this.params][FccGlobalConstant.LABEL],
          value: sectionFieldControl[FccGlobalConstant.VALUE],
          pdfParams: sectionFieldControl[this.pdfParams]
        };
        fieldDetailsList.push(fieldDataDetails);
        const fieldDetails: SubSectionDetails = {
          isSubSection: false,
          listOfFields: fieldDetailsList,
          pdfParams: sectionFieldControl[this.pdfParams],
          hideSubHeader: subSectionControl.hideSubHeader,
          pdfFieldType: 'table',
          fieldType: sectionFieldControl[FccGlobalConstant.TYPE]
        };
        existingFieldsMap.set(subSectionControl[this.fieldControls][this.key], fieldDetails);
      }
    } else {
      if (subSectionControl[this.fieldControls].length > 1){
        subSectionControl[this.fieldControls] = subSectionControl[this.fieldControls][0];
      }
      const previewScreen = this.getPreviewScreenValue(subSectionControl[this.fieldControls]);
      const rendered = subSectionControl[this.fieldControls][this.params][this.rendered];
      const fieldDataDetails = this.getFieldDataDetails(subSectionControl[this.fieldControls], addNotEntered);
      if (previewScreen && rendered && fieldDataDetails !== null &&
        (subSectionControl[this.fieldControls][this.type] !== FccGlobalConstant.FORM_TABLE)) {
        const fieldDetailsList = [];
        fieldDetailsList.push(fieldDataDetails);
        const fieldDetails: SubSectionDetails = {
          isSubSection: false,
          listOfFields: fieldDetailsList,
          pdfParams: subSectionControl[this.fieldControls][this.pdfParams],
          hideSubHeader: subSectionControl.hideSubHeader
        };
        existingFieldsMap.set(subSectionControl[this.fieldControls][this.key], fieldDetails);
      } else if (this.listOfBackToBackTogglesData.indexOf(subSectionControl[this.fieldControls][this.key]) > -1) {
        if (subSectionControl[this.fieldControls][this.valueStr] === 'y' || subSectionControl[this.fieldControls][this.valueStr] === 'Y') {
          const fieldDetailsList = [];
          fieldDetailsList.push(fieldDataDetails);
          const fieldDetails: SubSectionDetails = {
            isSubSection: false,
            listOfFields: fieldDetailsList,
            pdfParams: subSectionControl[this.fieldControls][this.pdfParams],
            hideSubHeader: subSectionControl.hideSubHeader
          };
          existingFieldsMap.set(subSectionControl[this.fieldControls][this.key], fieldDetails);
        }
      }
    }
    const sectionDetails: SectionDetails = {
      pdfParams: sectionControls.pdfParams,
      fieldsMap: existingFieldsMap,
      hasSubSection
    };
    this.sectionDataMap.set(sectionHeader, sectionDetails);
  }

  handleNewSection(sectionHeader, sectionControls, subSectionHeader, subSectionControl) {
    let hasSubSection = false;
    const newFieldsMap = new Map();
    const addNotEntered = this.checkForNotEntered(sectionHeader);
    if (subSectionControl.isSubSection) {
      hasSubSection = true;
      if (subSectionControl[this.fieldControls] === undefined || subSectionControl[this.fieldControls].length === 0) {
        const subSectionDetails: SubSectionDetails = {
          isSubSection: true,
          listOfFields: undefined,
          pdfParams: subSectionControl.pdfParams,
          hideSubHeader: subSectionControl.hideSubHeader
        };
        newFieldsMap.set(subSectionHeader, subSectionDetails);
      } else {
        const subSectionDetails: SubSectionDetails =
        this.getSubSectionDetails(subSectionControl, subSectionControl[this.fieldControls], addNotEntered);
        newFieldsMap.set(subSectionHeader, subSectionDetails);
      }
    } else if (subSectionControl.isClubbedItem) {
      const fieldDataDetails = this.getFieldDetailsOfClubbedLists(subSectionHeader, subSectionControl[this.fieldControls]);
      if (fieldDataDetails !== null) {
        const fieldDetailsList = [];
        fieldDetailsList.push(fieldDataDetails);
        const fieldDetails: SubSectionDetails = {
          isSubSection: false,
          listOfFields: fieldDetailsList
        };
        newFieldsMap.set(subSectionHeader, fieldDetails);
      }
    } else if (subSectionControl[this.fieldControls] &&
       subSectionControl[this.fieldControls][FccGlobalConstant.TYPE] === FccGlobalConstant.MAT_CARD ) {
      const previewScreen = this.getPreviewScreenValue(subSectionControl[this.fieldControls]);
      const rendered = subSectionControl[this.fieldControls][this.params][this.rendered];
      const showViewDetails = subSectionControl[this.fieldControls][this.params][this.showViewDetails];
      if (previewScreen && rendered) {
        const cardFieldsList = subSectionControl[this.fieldControls][this.params][FccGlobalConstant.OPTIONS];
        const fieldDetailsList = [];
        if (this.commonService.isNonEmptyValue(cardFieldsList)) {
          cardFieldsList.forEach(fieldName => {
            const cardFieldDetails = {
              label: this.translate.instant(fieldName.header),
              value: fieldName.value
            };
            fieldDetailsList.push(cardFieldDetails);
          });
          const fieldDetails: SubSectionDetails = {
            isSubSection: false,
            listOfFields: fieldDetailsList,
            pdfParams: subSectionControl[this.fieldControls][this.pdfParams],
            hideSubHeader: subSectionControl.hideSubHeader,
            fieldType: FccGlobalConstant.MAT_CARD
          };
          this.commonService.getChildTnxInformation().subscribe(
            (childTnx: string) => {
              this.childTnxObj = childTnx;
            }
          );
          if (showViewDetails) {
          if (this.childTnxObj) {
            this.childRefID = this.childTnxObj[FccGlobalConstant.CHANNELREF];
          } else {
            this.commonService.getChildReferenceAsObservable().subscribe(
              (childRef: string) => {
                this.childRefID = childRef;
              }
            );
          }
          }
          let matCardHeader;
          if (this.commonService.isnonEMptyString(this.childRefID)) {
            matCardHeader = (this.translate.instant(subSectionControl[this.fieldControls][this.key])).
            concat(" | ").concat(this.childRefID);
          } else {
            matCardHeader = (subSectionControl[this.fieldControls][this.key]);
          }
          newFieldsMap.set(matCardHeader, fieldDetails);
          }
      }
    } else if (subSectionControl && subSectionControl[this.fieldControls] && subSectionControl[this.fieldControls][this.params]
      && subSectionControl[this.fieldControls][this.params][`pdfFieldType`] === 'table') {
      const previewScreen = this.getPreviewScreenValue(subSectionControl[this.fieldControls]);
      const rendered = subSectionControl[this.fieldControls][this.params][this.rendered];
      const fieldDataDetails = this.getFieldDataDetails(subSectionControl[this.fieldControls], addNotEntered);
      if (previewScreen && rendered && fieldDataDetails !== null) {
        const fieldDetailsList = [];
        fieldDetailsList.push(fieldDataDetails);
        const fieldDetails: SubSectionDetails = {
          isSubSection: false,
          listOfFields: fieldDetailsList,
          pdfParams: subSectionControl[this.fieldControls][this.pdfParams],
          hideSubHeader: subSectionControl.hideSubHeader,
          pdfFieldType: 'table',
          fieldType: subSectionControl[this.fieldControls][FccGlobalConstant.TYPE]
        };
        newFieldsMap.set(subSectionControl[this.fieldControls][this.key], fieldDetails);
      }
    } else {
      const previewScreen = this.getPreviewScreenValue(subSectionControl[this.fieldControls]);
      const rendered = subSectionControl[this.fieldControls][this.params][this.rendered];
      const fieldDataDetails = this.getFieldDataDetails(subSectionControl[this.fieldControls], addNotEntered);
      if (previewScreen && rendered && fieldDataDetails !== null) {
        const fieldDetailsList = [];
        fieldDetailsList.push(fieldDataDetails);
        const fieldDetails: SubSectionDetails = {
          isSubSection: false,
          listOfFields: fieldDetailsList,
          pdfParams: subSectionControl[this.fieldControls][this.pdfParams],
          hideSubHeader: subSectionControl.hideSubHeader
        };
        newFieldsMap.set(subSectionControl[this.fieldControls][this.key], fieldDetails);
      } else if (this.listOfBackToBackTogglesData.indexOf(subSectionControl[this.fieldControls][this.key]) > -1) {
        if (subSectionControl[this.fieldControls][this.valueStr] === 'y' || subSectionControl[this.fieldControls][this.valueStr] === 'Y') {
          const fieldDetailsList = [];
          fieldDetailsList.push(fieldDataDetails);
          const fieldDetails: SubSectionDetails = {
            isSubSection: false,
            listOfFields: fieldDetailsList,
            pdfParams: subSectionControl[this.fieldControls][this.pdfParams],
            hideSubHeader: subSectionControl.hideSubHeader
          };
          newFieldsMap.set(subSectionControl[this.fieldControls][this.key], fieldDetails);
        }
      }
    }
    const sectionDetails: SectionDetails = {
      pdfParams: sectionControls.pdfParams,
      fieldsMap: newFieldsMap,
      hasSubSection
    };
    this.sectionDataMap.set(sectionHeader, sectionDetails);
  }

  checkFileUploadSections(sectionHeader): boolean {
    return this.listOfFileUploadSections.indexOf(sectionHeader) !== -1;
  }

  checkDocumentsSections(sectionHeader): boolean {
    if (sectionHeader === 'ecDocumentDetails' || sectionHeader === FccGlobalConstant.DOCUMENTS) {
      return true;
    }
    return false;
  }

  checkNarrativeSections(sectionHeader): boolean {
    if (sectionHeader === FccGlobalConstant.NARRATIVE_DETAILS || sectionHeader === FccGlobalConstant.SI_NARRATIVE_DETAILS) {
      return true;
    }
    return false;
  }

  checkFeesAndCharges(sectionHeader): boolean {
    if (sectionHeader === 'feesAndCharges' || sectionHeader === FccGlobalConstant.FEES_AND_CHARGES) {
      return true;
    }
    return false;
  }

  checkLicenseSections(sectionHeader: any, productCode: any): boolean {
    if (productCode !== undefined && productCode !== null && productCode !== '') {
      switch (productCode) {
        case FccGlobalConstant.PRODUCT_EC:
          return sectionHeader === FccGlobalConstant.EC_LICENSE_DETAILS;
        case FccGlobalConstant.PRODUCT_EL:
          return sectionHeader === FccGlobalConstant.EL_LICENSE_DETAILS;
        case FccGlobalConstant.PRODUCT_TF:
          return sectionHeader === FccGlobalConstant.TF_LICENSE_DETAILS;
        case FccGlobalConstant.PRODUCT_FT:
          return sectionHeader === FccGlobalConstant.FT_LICENSE_DETAILS;
        case FccGlobalConstant.PRODUCT_LC:
          return sectionHeader === FccGlobalConstant.LC_LICENSE_DETAILS;
        case FccGlobalConstant.PRODUCT_BG:
          return sectionHeader === FccGlobalConstant.UI_LICENSE_DETAILS;
        case FccGlobalConstant.PRODUCT_BR:
          return sectionHeader === FccGlobalConstant.UA_LICENSE_DETAILS;
        case FccGlobalConstant.PRODUCT_IC:
          return sectionHeader === FccGlobalConstant.IC_LICENSE_DETAILS;
        default: return false;
      }
    } else {
      return false;
    }
  }

  isSectionEmpty(sectionDetails): boolean {
    return sectionDetails === undefined || (sectionDetails && sectionDetails.fieldsMap === undefined)
    || (sectionDetails && sectionDetails.fieldsMap && sectionDetails.fieldsMap.size === 0);
  }

  populateAttachmentTableData(sectionHeader, sectionControls, sectionStyles) {
    const fieldsMap = 'fieldsMap';
    const columns = 'columns';
    const data = 'data';
    let fileUploadTable;
    if (sectionHeader === FccGlobalConstant.BANK_ATTACHMENT) {
      fileUploadTable = sectionControls[fieldsMap].get('bankAttachmentTable');
    } else if (sectionHeader === FccGlobalConstant.EL_MT700_UPLOAD) {
      fileUploadTable = sectionControls[fieldsMap].get('elMT700fileUploadTable');
    }
    else if (sectionHeader === FccGlobalConstant.PREVIOUS_ATTACHMENTS) {
      fileUploadTable = sectionControls[fieldsMap].get('previousBankAttachmentTable');
    }
     else {
       fileUploadTable = sectionControls[fieldsMap].get('fileUploadTable');
    }
    const dataList = fileUploadTable[this.fieldControls][this.params][data];
    if (dataList.length !== 0) {
      const columnsList = fileUploadTable[this.fieldControls][this.params][columns];
      let tableHeaders: string[] = [];
      const tableData: any[] = [];
      for (const columnName of columnsList) {
        tableHeaders.push(columnName);
      }
      if (this.language === PdfConstants.LANGUAGE_AR)
      {
        tableHeaders = this.reverseTableContent(tableHeaders);
      }
      for (const fileData of dataList) {
        let row = [];
        const fileName = this.commonService.decodeHtml(fileData.fileName);
        const mimeType = this.commonService.decodeHtml(fileData.mimeType);
        let fileType = fileName.split('.').pop().toUpperCase();
        if(fileName.toUpperCase() === fileType && mimeType !== undefined){
          fileType= "";
          fileType = mimeType.split('/').pop().toUpperCase();
          const arrayExtn = fileType.split('.');
          const size = arrayExtn.length;
          fileType = arrayExtn[size - 1];
        }
        row.push(fileType);
        row.push(fileData.title);
        row.push(fileName);
        if(fileData?.fileSize != null){
          row.push(fileData.fileSize);
        }
        if (this.language === PdfConstants.LANGUAGE_AR)
        {
          row = this.reverseTableContent(row);
        }
        tableData.push(row);
      }
      this.addSectionHeaderToPDF(sectionHeader, sectionStyles);
      this.createTable(tableHeaders, tableData);
      this.ycord = this.ycord + PdfConstants.ADD_30;
    } else {
      this.addContentTOPDF(sectionHeader, undefined, sectionStyles);
    }
  }

  populateIrregularVariationTableDate(sectionHeader, key, sectionControls, sectionStyles) {
    const fieldsMap = 'fieldsMap';
    const columns = 'columns';
    const data = 'data';
    let variationTable;
    if (sectionControls[fieldsMap].get(FccGlobalConstant.UI_IRREGULAR_VARIATIONS) !== undefined) {
      variationTable = sectionControls[fieldsMap].get(FccGlobalConstant.UI_IRREGULAR_VARIATIONS);
    } else if (sectionControls[fieldsMap].get(FccGlobalConstant.CU_IRREGULAR_VARIATIONS) !== undefined) {
      variationTable = sectionControls[fieldsMap].get(FccGlobalConstant.CU_IRREGULAR_VARIATIONS);
    }
    sectionControls[fieldsMap].forEach(value => {
      if (value === variationTable) {
        const dataList = variationTable[this.fieldControls][this.params][data];
        if (dataList.length !== 0) {
        const columnsList = variationTable[this.fieldControls][this.params][columns];
        let tableHeaders: string[] = [];
        const tableData: any[] = [];
        for (const columnName of columnsList) {
          const translatedValue = this.translate.instant(columnName.header);
          tableHeaders.push(translatedValue);
        }
        if (this.language === PdfConstants.LANGUAGE_AR)
          {
            tableHeaders = this.reverseTableContent(tableHeaders);
          }
        for (const fileData of dataList) {
          let row = [];
          row.push(fileData.variationFirstDate);
          row.push(fileData.operation);
          row.push(fileData.variationPct);
          row.push(fileData.variationAmtAndCurCode);
          if (this.language === PdfConstants.LANGUAGE_AR)
            {
              row = this.reverseTableContent(row);
            }
          tableData.push(row);
        }
        this.createTable(tableHeaders, tableData);
        this.ycord = this.ycord + PdfConstants.ADD_30;
        } else {
          this.addContentTOPDF(sectionHeader + key, undefined, sectionStyles);
        }
      } else if (value === sectionControls[fieldsMap].get(FccGlobalConstant.UI_INC_DEC_HEADER) ||
          value === sectionControls[fieldsMap].get(FccGlobalConstant.CU_INC_DEC_HEADER)) {
        this.addContentTOPDF(sectionHeader + key , this.sectionDataMap.get(key), sectionStyles);
      }
    });
  }

  populateICDocumentsTableData(sectionHeader, sectionControls, sectionStyles) {
    const fieldsMap = 'fieldsMap';
    const columns = 'columns';
    const data = 'data';
    const fileUploadTable = sectionControls[fieldsMap].get(FccGlobalConstant.DOCUMENTS);
    const dataList = fileUploadTable[this.fieldControls][this.params][data];
    if (dataList.length !== 0) {
      const columnsList = fileUploadTable[this.fieldControls][this.params][columns];
      let tableHeaders: string[] = [];
      const tableData: any[] = [];
      for (const columnName of columnsList) {
        const translatedValue = this.translate.instant(columnName.header);
        tableHeaders.push(translatedValue);
      }
      if (this.language === PdfConstants.LANGUAGE_AR)
      {
        tableHeaders = this.reverseTableContent(tableHeaders);
      }
      for (const fileData of dataList) {
        let row = [];
        row.push(fileData.type);
        row.push(fileData.DocCode);
        row.push(fileData.DocNo);
        row.push(fileData.DocDate);
        row.push(fileData.firstMail);
        row.push(fileData.secondMail);
        row.push(fileData.total);
        row.push(fileData.mapAttach);
        if (this.language === PdfConstants.LANGUAGE_AR)
        {
          row = this.reverseTableContent(tableHeaders);
        }
        tableData.push(row);
      }
      this.addSectionHeaderToPDF(sectionHeader, sectionStyles);
      this.createTable(tableHeaders, tableData);
      this.ycord = this.ycord + PdfConstants.ADD_30;
    } else {
      this.addContentTOPDF(sectionHeader, undefined, sectionStyles);
    }
  }

  populatePurchaseOrderData(sectionHeader, sectionDetails, sectionControls, sectionStyles) {
    const fieldsMap = 'fieldsMap';
    const columns = 'columns';
    const lineItems = 'line_items';
    const poLineItemColumns = 'poLineItemsCols';
    const data = 'data';
    const purchaseOrderControl = sectionControls[fieldsMap].get(lineItems);
    if(purchaseOrderControl && purchaseOrderControl !== undefined){
      this.isPOPresent = true;
      const purchaseOrders = purchaseOrderControl[this.fieldControls][this.params][data];
      let currency = '';
      if (this.productCode === FccGlobalConstant.PRODUCT_LC) {
        currency = this.stateService.getSectionData('amountChargeDetails').get('currency').value.shortName;
      } else if (this.productCode === FccGlobalConstant.PRODUCT_SI) {
        currency = this.stateService.getSectionData('siAmountChargeDetails').get('currency').value.shortName;
      }
      this.addPage();
      this.addSectionHeaderToPDF(sectionHeader, sectionStyles);
      if (purchaseOrders.length !== 0) {
          const purchaseOrderColumns = purchaseOrderControl[this.fieldControls][this.params][columns];
          const purchaseOrderLineItemColumns = purchaseOrderControl[this.fieldControls][this.params][poLineItemColumns];
          let purchaseOrderTableHeaders: string[] = [];

          //Purchase Order Columns
          for (const columnName of purchaseOrderColumns) {
              const translatedValue = this.translate.instant(columnName.header);
              purchaseOrderTableHeaders.push(translatedValue);
          }
          if (this.language === PdfConstants.LANGUAGE_AR) {
              purchaseOrderTableHeaders = this.reverseTableContent(purchaseOrderTableHeaders);
          }

          //Purchase Order Line Items Columns
          let lineItemTableHeaders: string[] = [];
          for (const columnName of purchaseOrderLineItemColumns) {
              const translatedValue = this.translate.instant(columnName.header);
              lineItemTableHeaders.push(translatedValue);
          }
          if (this.language === PdfConstants.LANGUAGE_AR) {
              lineItemTableHeaders = this.reverseTableContent(lineItemTableHeaders);
          }

          const fieldLabel = this.translate.instant(lineItems);
          const firstColumnXCord = this.getXCordBasedOnLang(50, 530);
          this.fieldLabelYCord = this.fieldLabelYCord + PdfConstants.ADD_20;
          this.fieldContentYCord = this.fieldContentYCord + PdfConstants.ADD_20;
          this.setLabelStyles(fieldLabel);
          this.pdf.text(firstColumnXCord, this.fieldLabelYCord, fieldLabel, this.setTextOption);
          this.fieldLabelYCord = this.fieldLabelYCord - PdfConstants.ADD_30;
          this.fieldContentYCord = this.fieldContentYCord - PdfConstants.ADD_30;
          for (const purchaseOrder of purchaseOrders) {
              //Purchase Order Table
              const purchaseOrderTableData: any[] = [];
              let row = [];
              row.push(purchaseOrder.PurchaseOrderID);
              const dateValue = this.datePipe.transform(purchaseOrder.PurchaseOrderDate, this.dateFormatForPdf);
              row.push(dateValue);
              row.push(purchaseOrder.PurchaseOrderLineItems.length);
              row.push(currency);
              let netAmount = 0;
              purchaseOrder.PurchaseOrderLineItems.forEach(val => {
                  if (val) {
                    netAmount = netAmount + Number(val.PurchaseOrderQuantityValue.replace(/[^0-9.-]+/g,"")) *
                    Number(val.PurchaseOrderQuantityPriceUnit.replace(/[^0-9.-]+/g,""));
                  }
              });
              let grossAmount = netAmount;
              let taxes = 0;
              if (this.commonService.isnonEMptyString(purchaseOrder.PurchaseOrderTaxes) &&
              !Number.isNaN(purchaseOrder.PurchaseOrderTaxes)) {
                  taxes = Number(purchaseOrder.PurchaseOrderTaxes);
              }
              grossAmount = grossAmount + taxes;
              row.push(this.currencyConverterPipe.transform(netAmount.toString(), currency));
              row.push(this.currencyConverterPipe.transform(taxes.toString(), currency));
              row.push(this.currencyConverterPipe.transform(grossAmount.toString(), currency));
              if (this.language === PdfConstants.LANGUAGE_AR) {
                  row = this.reverseTableContent(purchaseOrderTableHeaders);
              }
              purchaseOrderTableData.push(row);

              if (this.fieldContentYCord >= this.pageHeight) {
                  this.fieldLabelYCord = this.ycord + PdfConstants.ADD_10;
              }

              this.pdfStylesService.setTableHeaderBackgroundColour(PdfConstants.COLOR_TABLE_HEADER_TEXT);
              this.pdfStylesService.setTableHeaderTextColour(PdfConstants.COLOR_SECTION_LABEL_TEXT);
              this.pdfStylesService.setTableHeaderFontStyle(PdfConstants.FONT_STYLE_BOLD);
              this.pdfStylesService.setTableHeaderFontSize(PdfConstants.MEDIUM_FONT_SIZE);
              this.pdfStylesService.setTableFontSize(PdfConstants.SMALL_FONT_SIZE);
              this.createTable(purchaseOrderTableHeaders, purchaseOrderTableData);
              this.fieldContentYCord = this.ycord + PdfConstants.ADD_5;

              //Purchase Order Line Item Table
              const lineItemTableData: any[] = [];
              for (const LineItem of purchaseOrder.PurchaseOrderLineItems) {
                  let lineItemRow = [];
                  lineItemRow.push(LineItem.PurchaseOrderDescription);
                  lineItemRow.push(LineItem.PurchaseOrderQuantityCode);

              const POQuantityPriceUnit = Number(LineItem[FccGlobalConstant.PURCHASE_ORDER_QUANTITY_PRICE_UNIT].replace(/[^0-9.-]+/g,""));
                  const POQuantityValue = Number(LineItem[FccGlobalConstant.PURCHASE_ORDER_QUANTITY_VALUE].replace(/[^0-9.-]+/g,""));

                  let quantityTolerancePos = '';
                  if(LineItem[FccGlobalConstant.PURCHASE_ORDER_QUANTITY_TOLERANCE_POS] !== undefined){
                    quantityTolerancePos = LineItem[FccGlobalConstant.PURCHASE_ORDER_QUANTITY_TOLERANCE_POS];
                  }

                  let quantityToleranceNeg = '';
                  if(LineItem[FccGlobalConstant.PURCHASE_ORDER_QUANTITY_TOLERANCE_NEG] !== undefined){
                    quantityToleranceNeg = LineItem[FccGlobalConstant.PURCHASE_ORDER_QUANTITY_TOLERANCE_NEG];
                  }

                  const PurchaseOrderQuantityWithValAndTolerance = POQuantityValue
                      + " (+" + quantityTolerancePos + ") (-"
                      + quantityToleranceNeg + ") %";
                  lineItemRow.push(PurchaseOrderQuantityWithValAndTolerance);

                  let quantityPriceTolerancePos = '';
                  if(LineItem[FccGlobalConstant.PURCHASE_ORDER_PRICE_UNIT_POS] !== undefined){
                    quantityPriceTolerancePos = LineItem[FccGlobalConstant.PURCHASE_ORDER_PRICE_UNIT_POS];
                  }
                  let quantityPriceToleranceNeg = '';
                  if(LineItem[FccGlobalConstant.PURCHASE_ORDER_QUANTITY_PRICE_UNIT_Neg] !== undefined){
                    quantityPriceToleranceNeg = LineItem[FccGlobalConstant.PURCHASE_ORDER_QUANTITY_PRICE_UNIT_Neg];
                  }

                  const PurchaseOrderPriceUnitWithValAndTolerance = currency + " "
                      + this.currencyConverterPipe.transform(POQuantityPriceUnit.toString(), currency)
                      + " (+" + quantityPriceTolerancePos + ") (-" +
                      quantityPriceToleranceNeg + ") %";
                  lineItemRow.push(PurchaseOrderPriceUnitWithValAndTolerance);

                  if(!Number.isNaN(POQuantityPriceUnit) && !Number.isNaN(POQuantityValue)){
                    const PurchaseOrderAmount = POQuantityPriceUnit * POQuantityValue;
                    lineItemRow.push(currency + ' ' + this.currencyConverterPipe.transform(PurchaseOrderAmount.toString(), currency));
                  }else{
                    lineItemRow.push(currency + ' ');
                  }

                  if (this.language === PdfConstants.LANGUAGE_AR) {
                      lineItemRow = this.reverseTableContent(lineItemTableHeaders);
                  }
                  lineItemTableData.push(lineItemRow);
              }
              if (this.fieldContentYCord >= this.pageHeight) {
                  this.fieldLabelYCord = this.ycord + PdfConstants.ADD_10;
              }

              this.fieldLabelYCord = this.fieldLabelYCord - PdfConstants.ADD_30;
              this.fieldContentYCord = this.fieldContentYCord - PdfConstants.ADD_30;

              this.pdfStylesService.setTableHeaderBackgroundColour('#dbd7f7');
              this.pdfStylesService.setTableHeaderTextColour(PdfConstants.COLOR_TABLE_TEXT);
              this.pdfStylesService.setTableHeaderFontStyle(PdfConstants.FONT_STYLE_BOLD);
              this.pdfStylesService.setTableFontSize(PdfConstants.SMALL_FONT_SIZE);
              this.pdfStylesService.setTableHeaderFontSize(PdfConstants.SMALL_FONT_SIZE);
              this.createTable(lineItemTableHeaders, lineItemTableData);

              for (let i = 0; i < lineItemTableData.length; i++) {
                  this.fieldLabelYCord = this.ycord + PdfConstants.ADD_10;
                  this.fieldContentYCord = this.ycord + PdfConstants.ADD_10;
              }
          }
      }
    }
    else{
      this.isPOPresent = false;
    }
}

  populateRemInstTableData(sectionHeader, subSectionControl, subSectionHeader, firstColumnXCord) {
    const columns = 'columns';
    const data = 'data';
    const remInstAccountNo = 'remInstAccountNo';
    const remInstDescription = 'remInstDescription';
    const sectionForm = this.stateService.getSectionData(sectionHeader, this.productCode, this.isMaster, this.stateType);
    const dataList = sectionForm[FccGlobalConstant.CONTROLS][subSectionHeader][this.params][data];
    let currencyVal;
    let remInstAccountNoVal;
    let remInstDescriptionVal;
    let remInst = {};
    if (sectionForm.get('remittanceInstructions') && sectionForm.get('remittanceInstructions').value) {
      remInst = JSON.parse( sectionForm.get('remittanceInstructions').value);
      sectionForm.get('remInstAccountNo')[FccGlobalConstant.VALUE] = remInst[`account_no`];
      sectionForm.get('remInstDescription')[FccGlobalConstant.VALUE] = remInst[`description`];
    }
    if ((sectionForm.get('currency') && sectionForm.get('currency').value) ||
        (sectionForm.get('bkCurCode') && sectionForm.get('bkCurCode').value)) {
      currencyVal = sectionForm.get('bkCurCode') ?
                    sectionForm.get('bkCurCode').value :
                    sectionForm.get('currency').value.shortName;
    }
    if (sectionForm[FccGlobalConstant.CONTROLS][remInstAccountNo]
        && sectionForm[FccGlobalConstant.CONTROLS][remInstAccountNo].value) {
      remInstAccountNoVal = sectionForm[FccGlobalConstant.CONTROLS][remInstAccountNo].value;
    }
    if (sectionForm[FccGlobalConstant.CONTROLS][remInstDescription]
        && sectionForm[FccGlobalConstant.CONTROLS][remInstDescription].value) {
      remInstDescriptionVal = sectionForm[FccGlobalConstant.CONTROLS][remInstDescription].value;
    }
    if ((dataList.length === 0) && (currencyVal
      && (remInstAccountNoVal || remInstDescriptionVal || remInstDescriptionVal))) {
      const selectedJson: { accountNumber: any, currency: any, description: any } = {
        accountNumber: remInstAccountNoVal,
        currency: currencyVal,
        description: remInstDescriptionVal
      };
      dataList.push(selectedJson);
    }
    if (dataList.length !== 0) {
      const columnsList = sectionForm[FccGlobalConstant.CONTROLS][subSectionHeader][this.params][columns];
      let tableHeaders: string[] = [];
      const tableData: any[] = [];
      for (const columnName of columnsList) {
        tableHeaders.push(columnName);
      }
      if (this.language === PdfConstants.LANGUAGE_AR)
      {
        tableHeaders = this.reverseTableContent(tableHeaders);
      }
      let row = [];
      row.push(remInstAccountNoVal);
      row.push(currencyVal);
      row.push(remInstDescriptionVal);
      if (this.language === PdfConstants.LANGUAGE_AR)
      {
        row = this.reverseTableContent(row);
      }
      tableData.push(row);
      let fieldLabel;
      subSectionControl.listOfFields.forEach((fieldDetails: any) => {
        if (fieldDetails && fieldDetails !== null) {
          fieldLabel = fieldDetails.label;
        }
      });
      this.fieldLabelYCord = this.fieldLabelYCord + PdfConstants.ADD_20;
      this.fieldContentYCord = this.fieldContentYCord + PdfConstants.ADD_20;
      this.setLabelStyles(fieldLabel);
      this.pdf.text(firstColumnXCord, this.fieldLabelYCord, fieldLabel, this.setTextOption);
      this.fieldLabelYCord = this.fieldLabelYCord - PdfConstants.ADD_30;
      this.fieldContentYCord = this.fieldContentYCord - PdfConstants.ADD_30;
      this.createTable(tableHeaders, tableData);
      this.fieldLabelYCord = this.fieldLabelYCord + PdfConstants.ADD_40;
      this.fieldContentYCord = this.fieldContentYCord + PdfConstants.ADD_80;
    }
  }

  populateTableData(sectionHeader, subSectionControl, subSectionHeader, firstColumnXCord) {
    let shallowData = {};
    let fieldLabel;
    subSectionControl.listOfFields.forEach((fieldDetails: any) => {
      if (fieldDetails && fieldDetails !== null) {
        fieldLabel = fieldDetails.label;
      }
    });
    const sectionForm = this.stateService.getSectionData(sectionHeader, this.productCode, this.isMaster, this.stateType);
    let columnData = sectionForm[FccGlobalConstant.CONTROLS][subSectionHeader][`params`][`columns`];
    const selectedRow = sectionForm[FccGlobalConstant.CONTROLS][subSectionHeader][`params`][FccGlobalConstant.SELECTED_ROW];
    let returnData = (selectedRow && selectedRow.length > 0) ? selectedRow :
                      sectionForm[FccGlobalConstant.CONTROLS][subSectionHeader][`params`][`data`];
    if (!returnData || !columnData) {
      switch (this.productCode) {
        case FccGlobalConstant.PRODUCT_BK:
          shallowData = this.lendingCommonDataService.setPDFTableData(subSectionHeader, sectionForm);
          columnData = shallowData[`column`];
          returnData = shallowData[`data`];
          break;
        default:
          break;
      }
    }
    const dataList = returnData;
    const columnsList = columnData;
    if (dataList && (dataList.length !== 0)) {
      let tableHeaders: string[] = [];
      const tableData: any[] = [];
      for (const columnName of columnsList) {
        if (subSectionControl[`fieldType`] === FccGlobalConstant.FORM_TABLE) {
          const columnObj: any = {
            header: this.translate.instant(columnName[`header`]),
            field: columnName[`header`],
            width: columnName[`width`]
          };
          tableHeaders.push(columnObj);
        } else {
          tableHeaders.push(columnName);
        }
      }
      if (this.language === PdfConstants.LANGUAGE_AR) {
        tableHeaders = this.reverseTableContent(tableHeaders);
      }
      for (const fileData of dataList) {
        let row = [];
        Object.keys(tableHeaders).forEach(j => {
          Object.keys(fileData).forEach(index => {
            if (tableHeaders[j][`field`] === index) {
              row.push(fileData[index]);
              if (this.language === PdfConstants.LANGUAGE_AR) {
                row = this.reverseTableContent(row);
              }
            }
          });
        });
        tableData.push(row);
      }
      this.setLabelStyles(fieldLabel);
      this.pdf.text(firstColumnXCord, this.fieldLabelYCord, fieldLabel, this.setTextOption);
      this.fieldContentYCord = this.fieldContentYCord - PdfConstants.ADD_30;
      if (sectionForm[FccGlobalConstant.CONTROLS][subSectionHeader][`params`][`pdfTableSize`]) {
        this.pdfStylesService.setTableFontSize(sectionForm[FccGlobalConstant.CONTROLS][subSectionHeader][`params`][`pdfTableSize`]);
      }
      this.createTable(tableHeaders, tableData);
      this.fieldLabelYCord = this.ycord + PdfConstants.ADD_30;
      this.fieldContentYCord = this.fieldLabelYCord + PdfConstants.ADD_20;
    } else {
      this.setLabelStyles(fieldLabel);
      this.fieldLabelYCord = this.fieldLabelYCord - PdfConstants.ADD_10;
      this.pdf.text(firstColumnXCord, this.fieldLabelYCord, fieldLabel, this.setTextOption);
      this.setContentStyles(this.notEntered);
      this.fieldContentYCord = this.fieldContentYCord - PdfConstants.ADD_10;
      this.pdf.text(firstColumnXCord, this.fieldContentYCord, this.notEntered, this.setTextOption);
      this.fieldLabelYCord = this.fieldContentYCord + PdfConstants.ADD_30;
      this.fieldContentYCord = this.fieldLabelYCord + PdfConstants.ADD_20;
    }
  }

  checkIfValuePresent(fieldValue) {
    return fieldValue && fieldValue !== null && fieldValue !== '';
  }

  checkIfSectionControlAlreadyExists(sectionControl, controllist){
    let controlExists = false;
    controllist.forEach(element => {
     if (sectionControl.key === element.key){
        controlExists = true;
     }
    });
    return controlExists;
  }

  checkForNotEntered(sectionHeader): boolean {
    let addNotEntered = true;
    if (this.isEventInquirySections(sectionHeader) ||
    (this.isMaster || (this.tnxStatCode && this.tnxStatCode === FccGlobalConstant.N004_ACKNOWLEDGED))) {
      addNotEntered = false;
    }
    if (sectionHeader === FccGlobalConstant.POPUP_MSG)
    {
      addNotEntered = true;
    }
    return addNotEntered;
  }

  getSubSectionLabel(subSectionHeader, subSectionMap): string {
    let subSectionLabel = subSectionHeader;
    if (subSectionMap && subSectionMap.size > 0) {
      for (const key of subSectionMap.keys()) {
        subSectionLabel = key;
      }
    }
    return subSectionLabel;
  }

  addSubSectionHeaderToPDF(subSectionHeader, subSectionControl) {
    const firstColumnXCord = this.getXCordBasedOnLang(PdfConstants.FIRST_COLUMN_START_XCORD, PdfConstants.FIRST_COLUMN_START_XCORD_AR);
    this.fieldLabelYCord = this.fieldLabelYCord + PdfConstants.ADD_10;
    this.fieldContentYCord = this.fieldContentYCord + PdfConstants.ADD_10;
    this.checkAddPage(PdfConstants.ADD_30, PdfConstants.ADD_50);
    if (this.addSubHeaderExtraSpace) {
      this.fieldLabelYCord = this.fieldLabelYCord + PdfConstants.ADD_30;
      this.fieldContentYCord = this.fieldContentYCord + PdfConstants.ADD_30;
      this.addHeaderExtraSpace = false;
      this.addSubHeaderExtraSpace = false;
      this.addFieldExtraSpace = false;
      this.lastFieldNarrative = false;
    }
    this.setPDFStyles(subSectionControl.pdfParams);
    const subSectionMap = this.groupItemsMap.get(subSectionHeader);
    const subSectionLabel = this.getSubSectionLabel(subSectionHeader, subSectionMap);
    const subSectionHeaderTranslated = this.translate.instant(subSectionLabel);
    this.setSubHeaderStyles(subSectionHeaderTranslated);
    if (this.setAmendedChords) {
      this.setAmendedChords = false;
      this.fieldLabelYCord = this.fieldLabelYCord + 15;
      this.fieldContentYCord = this.fieldContentYCord + 15;
    }
    this.pdf.text(firstColumnXCord, this.fieldLabelYCord, subSectionHeaderTranslated, this.setTextOption);
    this.fieldLabelYCord = this.fieldLabelYCord + PdfConstants.ADD_20;
    this.fieldContentYCord = this.fieldContentYCord + PdfConstants.ADD_20;
    this.addNarrativeTextExtraSpace = false;
    this.resetPDFStyles(subSectionControl[this.pdfParams]);
  }

  setFieldDetailsForNewGroupChildren(sectionControl, fieldValue): FieldControlDetails {
    let controlsList;
    const isFieldValuePresent = this.checkIfValuePresent(fieldValue);
    if (isFieldValuePresent) {
      controlsList = [];
      controlsList.push(sectionControl);
    }
    const fieldDetails : FieldControlDetails = {
      fieldControls: controlsList,
      pdfParams: sectionControl[this.pdfParams],
      isSubSection: true,
      hideSubHeader: sectionControl[this.params][FccGlobalConstant.HIDE_GRP_HEADER_VIEW] === true ? true : false
    };
    return fieldDetails;
  }

  setFieldDetailsExistingGroupHead(sectionControl, fieldValue, existingFieldDetails): FieldControlDetails {
    let controlsList = existingFieldDetails.fieldControls;
    if (controlsList === null || controlsList === undefined) {
      controlsList = [];
    }
    let isFieldValuePresent = this.checkIfValuePresent(fieldValue);
    if (sectionControl.type === FccGlobalConstant.TEXT) {
      isFieldValuePresent = true;
    }
    let checkSectionexists = false;
    if (controlsList.length > 1){
      checkSectionexists = this.checkIfSectionControlAlreadyExists(sectionControl, controlsList);
    }
    if ( !checkSectionexists && (isFieldValuePresent || (sectionControl.type === FccGlobalConstant.inputRadio 
       && (fieldValue === "" || fieldValue === null)))) {
      controlsList.push(sectionControl);
    }
    if(this.productCode === FccGlobalConstant.PRODUCT_EL && (sectionControl.key === 'percp' || sectionControl.key === 'percm') && 
      (fieldValue === "" || fieldValue === null)){
        controlsList.push(sectionControl);
    }
    const newFieldDetails : FieldControlDetails= {
      fieldControls: controlsList,
      pdfParams: existingFieldDetails.pdfParams,
      isSubSection: existingFieldDetails.isSubSection,
      hideSubHeader: existingFieldDetails.hideSubHeader,
      isClubbedItem: existingFieldDetails.isClubbedItem
    };
    return newFieldDetails;
  }

  setFieldDetailsForNewGroupHead(sectionControl, fieldValue): FieldControlDetails {
    let controlsList;
    const isFieldValuePresent = this.checkIfValuePresent(fieldValue);
    if (isFieldValuePresent) {
      controlsList = [];
      controlsList.push(sectionControl);
    }
    else if (this.productCode === FccGlobalConstant.PRODUCT_EL && (sectionControl.key === 'percp' || sectionControl.key === 'percm') 
      && (fieldValue === "" || fieldValue === null)) {
      controlsList = [];
      controlsList.push(sectionControl);
    }
    const fieldDetails : FieldControlDetails = {
      pdfParams: sectionControl[this.pdfParams],
      isSubSection: true,
      fieldControls: controlsList
    };
    return fieldDetails;
  }

  getAccordionSectionsList(): string[] {
    return this.accordionSectionsList;
  }

  setAccordionList(accordionSectionsList: string[]) {
    this.accordionSectionsList = accordionSectionsList;
  }

  setFieldDetailsOfClubbedList(control, sectionControls): FieldControlDetails {
    const controlsList = [];
    const clubbedList = control.params[this.clubbedList];
    Object.keys(clubbedList).forEach(childField => {
      controlsList.push(sectionControls[clubbedList[childField]]);
      });
    const fieldDetails : FieldControlDetails = {
      fieldControls: controlsList,
      pdfParams: control[this.pdfParams],
      isSubSection: false,
      isClubbedItem: true
    };
    return fieldDetails;
  }

  getFieldDetailsOfClubbedLists(controlLabel, clubbedControls) {
    let clubbedValue = '';
    let fieldDataDetails: FieldDetails = null;
    const clubbedDelimiter = ' ';
    let addField = true;
    clubbedControls.forEach(control => {
      if (control !== undefined) {
        const previewScreen = this.getPreviewScreenValue(control);
        const rendered = control[this.params][this.rendered];
        const fieldType = control[this.params][FccGlobalConstant.FIELD_TYPE];
        if (fieldType === FccGlobalConstant.AMOUNT_FIELD && !rendered) {
          clubbedValue = '';
        }
        if (previewScreen && rendered) {
          let controlVal = this.previewService.getValue(control, true);
          if (control && control.params[FccGlobalConstant.TRANSLATE] && controlVal !== '') {
            const translateVal = control.params[FccGlobalConstant.TRANSLATE_VALUE];
            controlVal = `${this.translate.instant( translateVal + controlVal)}`;
          }
          if (fieldType === FccGlobalConstant.AMOUNT_FIELD && controlVal === '') {
            addField = false;
          }
          if (controlVal !== '') {
            clubbedValue += controlVal + clubbedDelimiter;
          }
        }
      }
      });
    const curCode = clubbedValue.slice(0, 3);
    const amt = clubbedValue.slice(3).trim();
    if (this.currencyList.indexOf(curCode) > -1 && this.currencySymbolDisplayEnabled) {
      const amtVal = this.commonService.getCurrencySymbol(curCode, amt);
      clubbedValue = amtVal.indexOf(curCode) > -1 ? `${amtVal}` : `${curCode} ${amtVal}`;
    }
    if (addField && clubbedValue !== '') {
      fieldDataDetails = {
        label: this.translate.instant(controlLabel),
        value: clubbedValue
       };
    }
    return fieldDataDetails;
  }

  /**
   * Get the value and transform as required to display in PDF.
   */
  getFieldValueForPdf(sectionControl, addNotEntered, previousValue?: boolean): string {
    let value;
    if (previousValue){
      // value = sectionControl.params.previousValue;
    } else {
      value = sectionControl.value;
    }
    if (sectionControl.type === FccGlobalConstant.inputSwitch || sectionControl.type === FccGlobalConstant.checkBox) {
      value = this.previewService.getValue(sectionControl, true);
      if (sectionControl.params[FccGlobalConstant.TRANSLATE] && value !== '') {
        const translateVal = sectionControl.params[FccGlobalConstant.TRANSLATE_VALUE];
        value = this.translate.instant( translateVal + value);
      } else {
        value = (value.toLowerCase() === 'y') ? `${this.translate.instant('yes')}` : `${this.translate.instant('no')}`;
      }
    } else if (sectionControl.params[FccGlobalConstant.PREVIEW_DISPALYED_VALUE]) {
      value = (sectionControl.params[FccGlobalConstant.DISPLAYED_VALUE] !== '' &&
      sectionControl.params[FccGlobalConstant.DISPLAYED_VALUE] !== undefined)
      ? sectionControl.params[FccGlobalConstant.DISPLAYED_VALUE] : this.previewService.getValue(sectionControl, true);
    } else if (sectionControl.type === FccGlobalConstant.inputDropdown && sectionControl[this.options] &&
        sectionControl.params[FccGlobalConstant.SHOW_VALUE]) {
      Object.keys(sectionControl[this.options]).forEach(dropDownobj => {
        if (sectionControl[this.options][dropDownobj][this.valueStr] === value) {
          value = sectionControl[this.options][dropDownobj][this.label];
        }
      });
    } else if (value) {
      if (sectionControl.params.translate && sectionControl.params.translateValue !== null
      && sectionControl.params.translateValue !== '') {
        const val = this.translate.instant(sectionControl.params.translateValue + value);
        if (val) {
          value = val;
        } else {
          value = this.previewService.getValue(sectionControl, true);
        }
      } else {
        this.commonService.pdfDecodeValue = true;
        value = this.previewService.getValue(sectionControl, true);
      }
      if (sectionControl.value === ' ' && (sectionControl.type === FccGlobalConstant.inputTextArea))
      {
        return this.notEntered;
       }
      } else if (!(value === null && (sectionControl.type === FccGlobalConstant.TEXT
      || sectionControl.type === 'input-table' || sectionControl.type === 'rounded-button'
      || sectionControl.type === 'fileUpload-dragdrop')) && addNotEntered) {
      value = this.notEntered;
    }
    const keyArray = [
      "applicantcountry",
      "loanEntitycountry",
      "beneficiarycountry",
      "beneficiaryTypecountry",
      "addressLinecountry",
      "draweecountry",
      "altApplicantcountry",
    ];
    const delimitter = '-';
    if (sectionControl && keyArray.indexOf(sectionControl.key) > -1)
    {
      let countryList: CountryList;
      this.commonService.getCountries().subscribe(data => {
        countryList = data;
        let country;

        if (sectionControl.value.shortName !== undefined) {
          country = countryList.countries.filter(task => task.alpha2code === sectionControl.value.shortName)[0];
        } else {
          country = countryList.countries.filter(task => task.alpha2code === sectionControl.value)[0];
        }
        value = country.alpha2code + delimitter + country.name;
      });
    } else if (sectionControl && this.listOfBackToBackTogglesData.indexOf(sectionControl.key) > -1) {
      const finalValue = this.translate.instant(sectionControl.key) + ' ' + value;
      value = finalValue;
    }

    return value;
  }

    populateECAttachmentTableData(sectionHeader, sectionControls, sectionStyles) {
    const fieldsMap = 'fieldsMap';
    const columns = 'columns';
    const data = 'data';
    const fileUploadTable = sectionControls[fieldsMap].get('fileUploadTable');
    const dataList = fileUploadTable[this.fieldControls][this.params][data];
    const documentGridTable = sectionControls[fieldsMap].get(FccGlobalConstant.documentTableDetails);
    let dataListdocument;
    let dataListDocumentLength = 0;
    if (documentGridTable !== undefined){
      dataListdocument = documentGridTable[this.fieldControls][this.params][data];
      dataListDocumentLength = dataListdocument.length;
    }
    if (dataList.length !== 0) {
      const columnsList = fileUploadTable[this.fieldControls][this.params][columns];
      let tableHeaders: string[] = [];
      const tableData: any[] = [];
      for (const columnName of columnsList) {
        tableHeaders.push(columnName);
      }
      if (this.language === PdfConstants.LANGUAGE_AR)
      {
        tableHeaders = this.reverseTableContent(tableHeaders);
      }
      for (const fileData of dataList) {
        let row = [];
        const fileName = this.commonService.decodeHtml(fileData.fileName);
        const fileType = fileName.split('.').pop().toUpperCase();
        row.push(fileType);
        row.push(fileData.title);
        row.push(fileName);
        if(fileData?.fileSize != null){
          row.push(fileData.fileSize);
        }
        if (this.language === PdfConstants.LANGUAGE_AR)
        {
          row = this.reverseTableContent(row);
        }
        tableData.push(row);
      }
      this.addSectionHeaderToPDF(sectionHeader, sectionStyles);
      this.fieldLabelYCord = this.fieldLabelYCord + PdfConstants.ADD_30;
      this.fieldContentYCord = this.fieldContentYCord + PdfConstants.ADD_30;
      const subSectionHeaderTranslated = this.translate.instant(FccGlobalConstant.FILE_UPLOAD_TABLE);
      const firstColumnXCord = this.getXCordBasedOnLang(PdfConstants.FIRST_COLUMN_START_XCORD, PdfConstants.FIRST_COLUMN_START_XCORD_AR);
      this.setSubHeaderStyles(subSectionHeaderTranslated);
      this.pdf.text(firstColumnXCord, this.fieldLabelYCord, subSectionHeaderTranslated, this.setTextOption);
      this.fieldContentYCord = this.fieldContentYCord - this.nextLine;
      this.createTable(tableHeaders, tableData);
      this.addPage();
      if (dataListDocumentLength === 0)
      {
        this.fieldLabelYCord = this.ycord + PdfConstants.ADD_10;
        this.fieldContentYCord = this.ycord + PdfConstants.ADD_20;
        const subSectionHeaderDOCUMENTSTranslated = this.translate.instant(FccGlobalConstant.DOCUMENTS);
        this.setSubHeaderStyles(subSectionHeaderDOCUMENTSTranslated);
        this.pdf.text(firstColumnXCord, this.fieldLabelYCord, subSectionHeaderDOCUMENTSTranslated, this.setTextOption);
        this.fieldLabelYCord = this.fieldLabelYCord + PdfConstants.ADD_20;
        this.fieldContentYCord = this.fieldContentYCord + PdfConstants.ADD_20;
        this.setContentStyles(this.translate.instant(FccGlobalConstant.NO_DOCUMENTS));
        this.pdf.text(firstColumnXCord, this.fieldLabelYCord, this.translate.instant(FccGlobalConstant.NO_DOCUMENTS), this.setTextOption);
        this.ycord = this.ycord + PdfConstants.ADD_60;
       }
    } else {
      if (dataListDocumentLength === 0 )
      {
        this.documentsectionnotemptyflag = false;
      }
      this.addContentTOPDF(sectionHeader, undefined, sectionStyles);
    }
  }

  /**
   * Position the Product Name, based on the value.
   */

   getHeaderProductCodeXCord() {
    if (this.productCode === FccGlobalConstant.PRODUCT_LN){
      return this.getXCordBasedOnLang(PdfConstants.CONTENT_MAX_LENGTH_TWO_COLUMN_250,
      PdfConstants.HEADER_PRODUCT_CODE_X_COORD_415_AR);
    } else if (this.productCode === FccGlobalConstant.PRODUCT_IC) {
      return this.getXCordBasedOnLang(PdfConstants.HEADER_PRODUCT_CODE_X_COORD_220,
      PdfConstants.HEADER_PRODUCT_CODE_X_COORD_415_AR);
    } else if (this.productCode === FccGlobalConstant.PRODUCT_SE) {
      return this.headerAlignementCenterForSE();
    } else if (this.productCode === FccGlobalConstant.PRODUCT_LC){
      return this.getXCordBasedOnLang(PdfConstants.HEADER_PRODUCT_CODE_X_COORD_220,
      PdfConstants.HEADER_PRODUCT_CODE_X_COORD_500_AR);
    }
    else {
      return this.headerAlignementCenterForAll();
    }
  }


  headerAlignementCenterForSE() {
    const width = this.pdf.internal.pageSize.getWidth();
    const headerCordXDynaWidth = (width / 2) - (width / 8);
    const headerCordXDynaWidthAR = (width / 2) + (width / 16);
    return this.getXCordBasedOnLang(headerCordXDynaWidth, headerCordXDynaWidthAR);
  }

  headerAlignementCenterForAll() {
    const width = this.pdf.internal.pageSize.getWidth();
    const headerCordXDynaWidth = (width / 2) - (width / 8);
    return this.getXCordBasedOnLang(headerCordXDynaWidth, PdfConstants.HEADER_PRODUCT_CODE_X_COORD_350_AR);
  }

  createListDataPDF(pdfMode, tableHeaders, tableData, colHeaders?: any, colData?: any, tableName?: any, isGroupDataDownload?: any,
                    groupDetails?: any, productCode?: string,isAccSummaryDashoabrd?:any,amountSum?:any,fileName?:any,
                    isAccountStatementDownload?: any,statementFilters? :any,accStatementRecordLimit?:any) {
    this.isAccSummaryDashboard = isAccSummaryDashoabrd;
    this.isAccountStatementDownload = isAccountStatementDownload;
    this.accStatementRecordLimit = accStatementRecordLimit;
    this.statementFilters = statementFilters;
    this.language = this.translate.currentLang;
    this.isGroupDataDownload = isGroupDataDownload;
    this.pdfMode = pdfMode;
    if (this.language === PdfConstants.LANGUAGE_AR) {
      if (this.pdfMode && this.pdfMode === FccGlobalConstant.PDF_MODE_LANDSCAPE) {
        this.logoConfig.xcord = PdfConstants.X_CORD_650_AR;
      } else {
        this.logoConfig.xcord = PdfConstants.X_CORD_430_AR;
      }
      this.xcord = PdfConstants.X_CORD_530_AR;
      this.setTextOption = { align: PdfConstants.ALIGN_RIGHT, lang: PdfConstants.LANGUAGE_AR };
    }
    this.tableName = tableName ? tableName : this.isAccountStatementDownload ?
      tableName : FccGlobalConstant.LIST_DATA_TITLE;

    fileName = fileName ? fileName : this.tableName;
    if (this.isGroupDataDownload) {
      this.tableName = groupDetails[FccGlobalConstant.GROUP_TITLE] ? groupDetails[FccGlobalConstant.GROUP_TITLE] :
      FccGlobalConstant.LIST_DATA_TITLE;
      fileName = this.tableName;
    }
    if (this.productCode === null || this.productCode === undefined) {
      this.productCode = productCode;
    }
    this.generateEmptyFileForListDataPDF();
    if (this.isAccSummaryDashboard && !this.isGroupDataDownload) {
      const isArabic = this.arabicEncoding.test(this.translate.instant(this.tableName));
      if(isArabic) {
        this.setContentStyles(this.translate.instant(this.tableName),PdfConstants.FONT_STYLE_BOLD);
      } else {
         this.pdf.setFont(this.pdfStylesService.getSubProductCodeFont(),PdfConstants.FONT_STYLE_BOLD);
      }
      this.pdf.setFontSize(PdfConstants.SECTION_SUB_HEADER_FONT_SIZE);
      const xcord = this.getXCordBasedOnLang(PdfConstants.FIRST_COLUMN_START_XCORD - PdfConstants.ADD_8,
        PdfConstants.X_CORD_675_AR);
      this.fieldContentYCord = PdfConstants.HEADER_PRODUCT_CODE_X_COORD_285;
      this.pdf.text(xcord, this.fieldContentYCord, this.translate.instant(this.tableName), this.setTextOption);
    }
    if (this.isGroupDataDownload) {
      if (groupDetails.length === tableData.length) {
        for (let i = 0; i < groupDetails.length; i++) {
          if (i !== FccGlobalConstant.ZERO) {
            this.pdf.addPage();
            if (this.pdf.lastAutoTable.finalY) {
              this.ycord = PdfConstants.Y_CORD_100;
            }
            if(this.isRepeatHeader)
            {
              this.fieldContentYCord = this.ycord + PdfConstants.ADD_200 ;
            }else{
              this.fieldLabelYCord = this.ycord + PdfConstants.ADD_30;
              this.fieldContentYCord = this.ycord + PdfConstants.ADD_50;
            }
          }
          if (this.isAccSummaryDashboard) {
            if (i === FccGlobalConstant.ZERO) {
              this.fieldContentYCord = PdfConstants.HEADER_PRODUCT_CODE_X_COORD_285;
            } else {
              this.fieldContentYCord = this.fieldContentYCord - PdfConstants.ADD_30;
            }
            const isArabic = this.arabicEncoding.test(this.translate.instant(groupDetails[i]));
            if(isArabic) {
              this.setContentStyles(this.translate.instant(groupDetails[i]),PdfConstants.FONT_STYLE_BOLD);
            } else {
             this.pdf.setFont(this.pdfStylesService.getSubProductCodeFont(),PdfConstants.FONT_STYLE_BOLD);
            }
            this.pdf.setFontSize(PdfConstants.SECTION_SUB_HEADER_FONT_SIZE);
            const xcord = this.getXCordBasedOnLang(PdfConstants.FIRST_COLUMN_START_XCORD-PdfConstants.ADD_8,
              PdfConstants.X_CORD_675_AR);
            this.pdf.text(xcord, this.fieldContentYCord, this.translate.instant(groupDetails[i]), this.setTextOption);
            this.createTableForListData(tableHeaders[i], tableData[i],colData[i],colHeaders[i],amountSum[i]);
          } else {
            this.setGroupDetails(groupDetails[i]);
            if (groupDetails[i][FccGlobalConstant.GROUP_ACCOUNTS_TOTAL] &&
              groupDetails[i][FccGlobalConstant.GROUP_ACCOUNTS_TOTAL] > FccGlobalConstant.ZERO) {
              this.createTableForListData(tableHeaders, tableData[i]);
            }
          }
        }
      }
    } else if (this.isAccountStatementDownload) {
      fileName = this.commonService.isEmptyValue(fileName) ? this.statementFilters['account_no'].charAt(0) :
      fileName+'_'+this.statementFilters['account_no'].charAt(0);
      fileName = fileName+this.statementFilters['account_no'].charAt(1);
      for (let index = 0; index<this.statementFilters['account_no'].length-4; index++) {
        fileName = fileName+'X';
      }
      fileName = fileName+this.statementFilters['account_no'].charAt(this.statementFilters['account_no'].length-2)+
      this.statementFilters['account_no'].charAt(this.statementFilters['account_no'].length-1);

      fileName = fileName+'_'+this.translate.instant('MODULE_STATEMENTS');
      this.dashboardService.getUserAccountBalance(this.statementFilters['account_id']).subscribe(bannerData => {
      this.createAccStatementTableForListData(tableHeaders, tableData, colData, colHeaders,bannerData);
      this.saveListDataFile(this.translate.instant(fileName));
      });
    } else {
      this.createTableForListData(tableHeaders, tableData, colData, colHeaders);
    }
    if (!this.isAccountStatementDownload) {
      this.saveListDataFile(this.translate.instant(fileName));
    }
  }

  generateEmptyFileForListDataPDF() {
    this.pdf = new jsPDF(this.pdfMode, 'pt', 'a4');
    const ycordInit = PdfConstants.Y_CORD_INIT_140;
    this.ycord = ycordInit;
    this.fieldLabelYCord = FccGlobalConstant.ZERO;
    this.addFontArabic();
    this.addOtherFonts();
    if (this.pdfStylesService.getShowHeader()) {
      this.addHeaderText();
    }
    this.addHeaderImage();
    if (this.productCode !== FccGlobalConstant.PRODUCT_SE && this.pdfStylesService.getShowDateAndTime() &&
      !this.isAccountStatementDownload) {
      //this.addDownloadDateTime();
      this.addDateFormatNote();
    }

    if(this.isAccSummaryDashboard) {
      this.addAccountHolderDetails();
      this.addFilterDetails();
      this.addAllTablesHeader();
    }

    if(this.isAccountStatementDownload){
      this.pdf.setFontSize(this.pdfStylesService.sectionContentFontSize);
      this.pdf.setTextColor(this.pdfStylesService.sectionContentFontColour);
      this.addAccountHolderDetails();
    }
    const pageHeightSub = PdfConstants.PAGE_HEIGHT_SUB_80;
    this.pageHeight = this.pdf.internal.pageSize.height - pageHeightSub;
    if (this.isGroupDataDownload) {
      this.fieldLabelYCord = this.ycord + PdfConstants.ADD_30;
      this.fieldContentYCord = this.ycord + PdfConstants.ADD_50;
    } else {
      this.fieldContentYCord = this.ycord;
    }
  }

  saveListDataFile(tableName: any) {
    this.addLeftAndRightBarToAllPages();
    this.updateFooter();
    if (tableName) {
      this.pdf.save(`${tableName}.pdf`);
    }

  }

  addLeftAndRightBarToAllPages() {
    const totalPages = this.pdf.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      if(!this.isAccSummaryDashboard && !this.isAccountStatementDownload) {
        this.addLeftBar(i);
        this.addRightBar(i);
      }
      this.addHeaderImage(i);
      if (this.isAccSummaryDashboard && i!=1)
      {
        if(this.isRepeatHeader)
        {
        this.addDownloadDateTime();
        this.addDateFormatNote();
        this.addHeaderText();
        this.addAccountHolderDetails();
        this.addFilterDetails();
        this.addAllTablesHeader();
        }
      }
      if(this.isAccountStatementDownload && i!=1) {
        if(this.isRepeatHeader)
        {
        this.addHeaderText();
        this.addAccountHolderDetails();
        this.addStatementHeader(this.logoConfig.ycord+PdfConstants.ADD_135+this.nextLine);
        }else{
        this.addStatementHeader(this.logoConfig.ycord+PdfConstants.ADD_60+this.nextLine);
        }
      }

    }
  }

  setGroupDetails(groupDetails: any) {
    let firstColXCordAR;
    if (this.pdfMode && this.pdfMode === FccGlobalConstant.PDF_MODE_LANDSCAPE) {
      firstColXCordAR = PdfConstants.LANDSCAPE_FIRST_COLUMN_START_XCORD_AR;
    } else {
      firstColXCordAR = PdfConstants.FIRST_COLUMN_START_XCORD_AR;
    }
    let firstColumnXCord = this.getXCordBasedOnLang(PdfConstants.FIRST_COLUMN_START_XCORD, firstColXCordAR);
    let fieldValue;
    Object.keys(groupDetails).forEach(element => {
      if (element === FccGlobalConstant.GROUP_NAME || element === FccGlobalConstant.GROUP_ACCOUNTS_TOTAL ||
          element === FccGlobalConstant.AMOUNT_BALANCE) {
            const fieldLabel = this.translate.instant(element);
            if (element === FccGlobalConstant.GROUP_NAME) {
              fieldValue = groupDetails[element] ? this.translate.instant(groupDetails[element]) : FccGlobalConstant.EMPTY_STRING;
            } else {
              fieldValue = this.commonService.isNonEmptyValue(groupDetails[element]) ?
              groupDetails[element].toString() : FccGlobalConstant.EMPTY_STRING;
            }
            this.setLabelStyles(fieldLabel);
            this.addLabelToPdf(fieldLabel, firstColumnXCord, PdfConstants.MAX_LENGTH_TWO_COLUMN_230, false);
            this.setContentStyles(fieldValue);
            this.addContentValueToPdf(fieldValue, firstColumnXCord, PdfConstants.MAX_LENGTH_TWO_COLUMN_230, false, false, false);
            if (this.language === PdfConstants.LANGUAGE_AR) {
              firstColumnXCord = firstColumnXCord - PdfConstants.ADD_200;
            } else {
              firstColumnXCord = firstColumnXCord + PdfConstants.ADD_200;
            }
          }
    });
  }

  isEventInquirySections(sectionName): boolean {
    return this.listOfEventInqurySection.indexOf(sectionName) !== -1;
  }

  createPaymentSummaryPDF(pdfMode,tableName,data,tableHeaders,subTableHeaders,duration) {

    this.language = this.translate.currentLang;
    this.pdfMode = pdfMode;
    this.pdfStylesService.setShowHeader(false);
    this.pdfStylesService.setShowDateAndTime(false);

    if (this.language === PdfConstants.LANGUAGE_AR) {
      if (this.pdfMode && this.pdfMode === FccGlobalConstant.PDF_MODE_LANDSCAPE) {
        this.logoConfig.xcord = PdfConstants.X_CORD_650_AR;
      } else {
        this.logoConfig.xcord = PdfConstants.X_CORD_430_AR;
      }
      this.xcord = PdfConstants.X_CORD_530_AR;
      this.setTextOption = { align: PdfConstants.ALIGN_RIGHT, lang: PdfConstants.LANGUAGE_AR };
    }
    this.tableName = tableName ? this.translate.instant(tableName) : FccGlobalConstant.LIST_DATA_TITLE;

    this.generateEmptyFileForListDataPDF();

    this.createTableForPaymentSummary(data, tableHeaders, subTableHeaders,duration);

    this.saveListDataFile(this.tableName);
    this.pdfStylesService.setShowHeader(true);
    this.pdfStylesService.setShowDateAndTime(true);
  }
  /**
   * payment summary widget pdf data
   */
  createTableForPaymentSummary(data, headers, subHeaders, duration) {
    if (this.language === PdfConstants.LANGUAGE_AR) {
      headers = this.reverseTableContent(headers);
      subHeaders = this.reverseTableContent(subHeaders);
    }
    duration = this.translate.instant(duration);
    duration = this.translate.instant('DURATION_OF_TRANSACTION', { duration });

    this.pdf.setFont(this.pdfStylesService.sectionContentFont, PdfConstants.FONT_STYLE_NORMAL);
    const companyName = this.translate.instant(FccGlobalConstant.COMPANY_NAME);
    const totalAmnt = this.translate.instant(FccGlobalConstant.TOTAL_PAYMENT);
    const isArabic = this.arabicEncoding.test(companyName && totalAmnt);
    if (isArabic) {
      this.pdf.setFont(PdfConstants.ARABIC_BOLD_COURIER, PdfConstants.FONT_STYLE_NORMAL);
      this.pdf.setFontSize(PdfConstants.MEDIUM_FONT_SIZE);
      this.pdf.setTextColor(PdfConstants.COLOR_SECTION_CONTENT_TEXT);
      this.checkArabicFont(this.tableName, PdfConstants.ARABIC_BOLD_COURIER, PdfConstants.FONT_STYLE_NORMAL);

      this.setTextOption = { align: PdfConstants.ALIGN_RIGHT, lang: PdfConstants.LANGUAGE_AR };
      this.pdf.text(PdfConstants.X_CORD_530_AR, PdfConstants.Y_CORD_INIT_140, data.companyName + " :" +
      companyName, this.setTextOption);
      this.pdf.text(PdfConstants.X_CORD_530_AR, PdfConstants.Y_CORD_INIT_140 + PdfConstants.NEXT_LINE_12,
        this.commonService.getCurrencyFormatedAmount("INR", data.totalConsolidatedPackageAmount, this.currencySymbolDisplayEnabled) + " :"
        + totalAmnt, this.setTextOption);
      this.pdf.text(PdfConstants.X_CORD_530_AR, PdfConstants.X_CORD_200_AR, duration, this.setTextOption);
      this.pdf.setFont(PdfConstants.ARABIC_BOLD_COURIER);
    } else {
      this.setContentStyles(this.commonService.getCurrencyFormatedAmount("INR", data.totalConsolidatedPackageAmount,
        this.currencySymbolDisplayEnabled));
      this.pdf.text(PdfConstants.X_CORD_40, PdfConstants.Y_CORD_INIT_140, this.translate.instant(FccGlobalConstant.COMPANY_NAME) + ": "
        + data.companyName, this.setTextOption);
      this.pdf.text(PdfConstants.X_CORD_40, PdfConstants.Y_CORD_INIT_140 + PdfConstants.NEXT_LINE_12,
        this.translate.instant(FccGlobalConstant.TOTAL_PAYMENT) + ": " +
        this.commonService.getCurrencyFormatedAmount("INR", data.totalConsolidatedPackageAmount,
          this.currencySymbolDisplayEnabled), this.setTextOption);
      if (data.paymentsOverview.length > 0) {
        this.pdf.text(PdfConstants.X_CORD_40, PdfConstants.X_CORD_200_AR, duration, this.setTextOption);
      } else {
        this.pdf.text(PdfConstants.X_CORD_40, PdfConstants.X_CORD_200_AR, this.translate.instant('noRecordsFound'), this.setTextOption);
      }

    }
    this.addDownloadDateTimePaymentSummary();
    const width = this.pdf.internal.pageSize.getWidth();
    const headerCordXDynaWidth = (width / 2) - (width / 8);
    this.pdf.setFont(this.pdfStylesService.getProductCodeFont(), PdfConstants.FONT_STYLE_BOLD);
    this.pdf.setFontSize(this.pdfStylesService.getProductCodeFontSize());
    this.pdf.setTextColor(this.pdfStylesService.getProductCodeFontColour());
    this.checkArabicFont(this.tableName, this.pdfStylesService.getProductCodeFont(), PdfConstants.FONT_STYLE_BOLD);
    this.pdf.text(this.getXCordBasedOnLang(headerCordXDynaWidth, PdfConstants.HEADER_PRODUCT_CODE_X_COORD_300_AR)
    , PdfConstants.HEADER_PRODUCT_CODE_Y_COORD_35, this.tableName, this.setTextOption);

    this.ycord = PdfConstants.X_CORD_200_AR + this.nextLine;
    const margin = {
      top: this.logoConfig.ycord + PdfConstants.MARGIN_50 + this.nextLine,
      right: PdfConstants.NUMB_30
    };
    const styles = {
      font: this.getArabicFontIfLanguageAR(this.pdfStylesService.getTableFont(),
        this.pdfStylesService.getTableFontStyle()), fontStyle: this.pdfStylesService.getTableFontStyle(),
      halign: PdfConstants.ALIGN_LEFT
    };

    if (this.language === PdfConstants.LANGUAGE_AR) {
      margin.right = PdfConstants.NUMB_65;
      styles.halign = PdfConstants.ALIGN_RIGHT;
    }
    let headStyles;
    let subheadStyles;

    // Set the headers and alignment
    const tableHeaders = [];
    headers.forEach((header) => {
      if (header !== FccGlobalConstant.CLIENT_DETAILS) {
        const headerAlign = this.language === PdfConstants.LANGUAGE_AR ? 'right' : 'left';
        headStyles = {
          halign: headerAlign, overflow: 'linebreak', fillColor:  PdfConstants.COLOR_SUB_TABLE_HEADER,
          textColor: PdfConstants.COLOR_TABLE_TEXT,
          font: this.getArabicFontIfLanguageAR(this.pdfStylesService.getTableFont(), this.pdfStylesService.getTableFontStyle()),
          fontSize: this.pdfStylesService.getTableFontSize(), fontStyle: PdfConstants.FONT_STYLE_BOLD
        };
        const col = { content: this.translate.instant(header), styles: headStyles };
        tableHeaders.push(col);
      }
    });

    const subHeaderRow = [];
    subHeaders.forEach((subheader) => {
      const subHeaderAlign = 'left';
      subheadStyles = {
        halign: subHeaderAlign, overflow: 'linebreak', fillColor:  PdfConstants.COLOR_SUB_TABLE_HEADER,
        textColor: PdfConstants.COLOR_TABLE_TEXT,
        font: this.getArabicFontIfLanguageAR(this.pdfStylesService.getTableFont(), this.pdfStylesService.getTableFontStyle()),
        fontSize: this.pdfStylesService.getTableFontSize(), fontStyle: this.pdfStylesService.getTableFontStyle()
      };
      subHeaderRow.push({ content: this.translate.instant(subheader), styles: subheadStyles });
    });

    // Set the table rows and each column alignment
    const tableData = [];
    let subTableData = [];
    let bodyStyles;
    tableData.push(tableHeaders);
    const listData = data.paymentsOverview;
    for (let index = 0; index < listData.length; index++) {
      const row = [];
      let dataValue: any;
      headers.forEach(colHeader => {
        const header = colHeader;
        if (header !== FccGlobalConstant.CLIENT_DETAILS) {
          dataValue = listData[index][header];
          dataValue = this.formatDataValueContainLargeText(dataValue);
          const dataAlign = this.language === PdfConstants.LANGUAGE_AR ? 'right' : 'left';
          bodyStyles = {
            halign: dataAlign, overflow: 'linebreak', textColor: this.pdfStylesService.getTableFontColour(),
            font: this.getArabicFontIfLanguageAR(this.pdfStylesService.getTableFont(), this.pdfStylesService.getTableFontStyle()),
            fontSize: this.pdfStylesService.getTableFontSize(),
            fontStyle: this.pdfStylesService.getTableFontStyle()
          };
          if (header === FccGlobalConstant.PACKAGE_AMT) {
            dataValue = this.commonService.getCurrencyFormatedAmount("INR", dataValue, this.currencySymbolDisplayEnabled);
          }
          row.push({ content: dataValue, styles: bodyStyles });

        } else {
          subTableData = [];
          for (const subData of listData[index][FccGlobalConstant.CLIENT_DETAILS]) { // iterating sub list
            let subDataValue: any;
            const subRow = [];
            subHeaders.forEach(subColHeader => {
              subDataValue = subData[subColHeader];
              subDataValue = this.formatDataValueContainLargeText(subDataValue);
              if (subColHeader === FccGlobalConstant.CLIENT_AMT) {
                subDataValue = this.commonService.getCurrencyFormatedAmount("INR", subDataValue, this.currencySymbolDisplayEnabled);
              }
              subRow.push({ content: subDataValue, styles: bodyStyles });
            });
            subTableData.push(subRow);
          }
        }
      });
      tableData.push(row);
      tableData.push(subHeaderRow);
      for (const subData of subTableData) {
        tableData.push(subData);
      }
      //check for last element
      if (index != listData.length - 1) {
        tableData.push([]);
        tableData.push(tableHeaders);
      }

      this.pdf.autoTable({
        body: tableData,
        margin: margin,
        startY: this.ycord + this.nextLine,
        pageBreak: PdfConstants.PAGE_BREAK,
        styles: styles
      });
    }
  }

  generateFileWithTnxIDS(tnxCheckboxData){
    const pdf = new jsPDF();
    tnxCheckboxData.forEach((data)=>{
      pdf.text(data, 10, 10);
    pdf.addPage();
    });

    pdf.save('document.pdf');
  }

  addDownloadDateTimePaymentSummary() {
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.dateFormatForPdf = response.listDataExcelDateFormat;
      }
    });
    this.pdf.setFontSize(this.pdfStylesService.sectionContentFontSize);
    this.pdf.setTextColor(this.pdfStylesService.sectionContentFontColour);
    const downloadDate = new Date();
    const dateValue = this.datePipe.transform(downloadDate, this.dateFormatForPdf);
    const timeValue = this.datePipe.transform(downloadDate, 'mediumTime');
    let dateValueMessage = this.translate.instant(FccGlobalConstant.DOWNLOAD_DATE);
    let timeValueMessage = this.translate.instant(FccGlobalConstant.DOWNLOAD_TIME);
    const isArabic = this.arabicEncoding.test(dateValueMessage && timeValueMessage);
    if (isArabic) {
      this.pdf.setFont(PdfConstants.ARABIC_BOLD_COURIER, PdfConstants.FONT_STYLE_NORMAL);
      this.pdf.setFontSize(PdfConstants.MEDIUM_FONT_SIZE);
      this.pdf.setTextColor(PdfConstants.COLOR_SECTION_CONTENT_TEXT);
      this.checkArabicFont(this.tableName, PdfConstants.ARABIC_BOLD_COURIER, PdfConstants.FONT_STYLE_NORMAL);

      dateValueMessage = dateValue + ' ' + dateValueMessage;
      timeValueMessage = timeValue + ' ' + timeValueMessage;
    } else {
      dateValueMessage = dateValueMessage + ' ' + dateValue;
      timeValueMessage = timeValueMessage + ' ' + timeValue;
      this.pdf.setFont(this.pdfStylesService.sectionContentFont, PdfConstants.FONT_STYLE_NORMAL);
    }
    let xcord = PdfConstants.X_CORD_430;
    if (this.language === PdfConstants.LANGUAGE_FR) {
      xcord = PdfConstants.X_CORD_380;
      if (this.pdfMode && this.pdfMode === FccGlobalConstant.PDF_MODE_LANDSCAPE) {
        xcord = PdfConstants.X_CORD_620;
      }
    } else if (this.pdfMode && this.pdfMode === FccGlobalConstant.PDF_MODE_LANDSCAPE) {
      xcord = PdfConstants.X_CORD_650;
    } else {
      xcord = this.getXCordBasedOnLang(PdfConstants.X_CORD_430, PdfConstants.X_CORD_200_AR);
    }
    xcord = this.getXCordBasedOnLang(xcord, PdfConstants.HEADER_PRODUCT_CODE_X_COORD_150);
    this.pdf.text(xcord, this.ycord, dateValueMessage, this.setTextOption);
    if(timeValueMessage){
      this.ycord = this.ycord + PdfConstants.NEXT_LINE_12;
      this.pdf.text(xcord, this.ycord, timeValueMessage, this.setTextOption);
    }
    this.ycord = this.ycord + PdfConstants.NEXT_LINE_12;
  }

  createAccStatementTableForListData(headers, data, colData?: any, colHeaders?: any,bannerData?: any) {
    this.createAccStatementBanner(bannerData);
    this.addStatementHeader();
    this.ycord = this.ycord + this.nextLine;
    if (this.language === PdfConstants.LANGUAGE_AR) {
      this.addFontArabic();
    }
    this.addOtherFonts();
    // Set the headers and alignment
    const tableHeaders = [];
    if (colHeaders === undefined) {
      colHeaders = headers;
    }
    colHeaders.forEach((header) => {
      if (!this.commonService.isListdefActionColumn(header.field)) {
        const headerAlign = this.language === PdfConstants.LANGUAGE_AR ? (header.align === 'left' ? 'right' : 'left') : header.align;
        const headStyles = {
          halign: headerAlign, overflow: 'linebreak',
          textColor: this.pdfStylesService.getTableFontColour(),
          fillColor:PdfConstants.COLOR_STEMENT_TABLE_HEADER_BACKGROUND,
          font: this.getArabicFontIfLanguageAR(this.pdfStylesService.getTableFont(), PdfConstants.FONT_STYLE_BOLD),
          fontSize: this.pdfStylesService.getTableFontSize(), fontStyle: this.pdfStylesService.getTableFontStyle()
        };
        let col = {};
        if (header.header !== undefined) {
          col = { content: header.header, styles: headStyles };
        } else {
          col = { content: header, styles: headStyles };
        }
        tableHeaders.push(col);
      }
    });
    // Set the table rows and each column alignment
    const tableData = [];
    if (colData === undefined) {
      colData = data;
    }
    let footerRow = [];
    for (const listData of colData) {
      const row = [];
      let dataValue: any;
      let index = 0;
      colHeaders.forEach(colHeader => {
        const header = colHeader.field !== undefined ? colHeader.field : index;
        index++;
        if (!this.commonService.isListdefActionColumn(header)) {
          dataValue = this.getTableDataValue(header, listData);
          dataValue = this.formatDataValueContainLargeText(dataValue);
          const dataAlign = this.language === PdfConstants.LANGUAGE_AR ? (colHeader.align === 'left' ? 'right' : 'left') : colHeader.align;
          const bodyStyles = {
            halign: dataAlign, overflow: 'linebreak', textColor: this.pdfStylesService.getTableFontColour(),
            fillColor:PdfConstants.COLOR_STEMENT_TABLE_HEADER_BACKGROUND,
            font: this.getArabicFontIfLanguageAR(this.pdfStylesService.getTableFont(), this.pdfStylesService.getTableFontStyle()),
            fontSize: this.pdfStylesService.getTableFontSize(),
            fontStyle: this.pdfStylesService.getTableFontStyle()
          };
          row.push({ content: dataValue, styles: bodyStyles });
          const footerHeadStyles = {
            halign: 'center', overflow: 'linebreak', textColor: this.pdfStylesService.getTableFontColour(),
            fillColor:PdfConstants.COLOR_STEMENT_TABLE_HEADER_BACKGROUND,
            font: this.getArabicFontIfLanguageAR(this.pdfStylesService.getTableFont(), PdfConstants.FONT_STYLE_BOLD),
            fontSize: this.pdfStylesService.getTableFontSize()
          };
          const footerStyles = {
            halign: dataAlign, overflow: 'linebreak', textColor: this.pdfStylesService.getTableFontColour(),
            fillColor:PdfConstants.COLOR_STEMENT_TABLE_HEADER_BACKGROUND,
            font: this.getArabicFontIfLanguageAR(this.pdfStylesService.getTableFont(), PdfConstants.FONT_STYLE_BOLD),
            fontSize: this.pdfStylesService.getTableFontSize()
          };

          footerRow[0] = { content: this.translate.instant('transactionTotal'), colSpan: 4,
          styles: footerHeadStyles };
          footerRow[1] = { content: this.getTableDataValue(FccGlobalConstant.AGGREGATE1, listData), styles: footerStyles };
          footerRow[2] = { content: this.getTableDataValue(FccGlobalConstant.AGGREGATE2, listData), styles: footerStyles };
          footerRow[3] = { content: "", styles: footerStyles };
          if (this.language === PdfConstants.LANGUAGE_AR) {
            footerRow = this.reverseTableContent(footerRow);
          }
        }
      });
      tableData.push(row);
    }
    if (colData.length>0) {
      tableData.push(footerRow);
    }
    if (tableData.length === 0) {
      const bodyStyles = {
        halign: 'center', overflow: 'linebreak', textColor: this.pdfStylesService.getTableFontColour(),
        fillColor:PdfConstants.COLOR_STEMENT_TABLE_HEADER_BACKGROUND,
        font: this.getArabicFontIfLanguageAR(this.pdfStylesService.getTableFont(), this.pdfStylesService.getTableFontStyle()),
        fontSize: this.pdfStylesService.getTableFontSize(),
        fontStyle: this.pdfStylesService.getTableFontStyle()
      };
      const row = [];
      row[0] = { content: this.translate.instant('noTransactionFound'), colSpan: colHeaders.length, styles: bodyStyles };
      tableData.push(row);
    }

    const margin = {
      top: this.logoConfig.ycord + PdfConstants.MARGIN_50 + this.nextLine+PdfConstants.ADD_40,
      right: PdfConstants.NUMB_30,
      bottom : PdfConstants.ADD_120
    };
    const styles = {
      font: this.getArabicFontIfLanguageAR(this.pdfStylesService.getTableFont(),
        this.pdfStylesService.getTableFontStyle()), fontStyle: this.pdfStylesService.getTableFontStyle(),
      halign: PdfConstants.ALIGN_LEFT
    };

    if (this.language === PdfConstants.LANGUAGE_AR) {
      margin.right = PdfConstants.NUMB_65;
      styles.halign = PdfConstants.ALIGN_RIGHT;
    }
    if(this.isRepeatHeader)
    {
      margin.top = this.logoConfig.ycord + PdfConstants.MARGIN_50 + this.nextLine +PdfConstants.ADD_100;
    }
    if (tableData.length <= this.accStatementRecordLimit) {
    this.pdf.autoTable({
      body: tableData,
      head: [tableHeaders],
      margin: margin,
      startY: this.ycord + this.nextLine,
      pageBreak: PdfConstants.PAGE_BREAK,
      styles: styles,
      tableLineColor: [189, 195, 199],
      tableLineWidth: 0.75,
      theme: "plain",

      didDrawCell: function(data) {
        if (data.row.section === "head") {
          data.doc.line(
            data.cell.x,
            data.cell.y + data.cell.height-1,
            data.cell.x + data.cell.width,
            data.cell.y + data.cell.height-1
          );
        }

        if (data.row.section === "body" && data.row.index === tableData.length - 1) {
          data.doc.line(
            data.cell.x + data.cell.width,
            data.cell.y,
            data.cell.x,
            data.cell.y
          );
        }
        // draw left border
        data.doc.line(
          data.cell.x,
          data.cell.y + data.cell.height,
          data.cell.x,
          data.cell.y
        );
        // draw right border
        data.doc.line(
          data.cell.x + data.cell.width,
          data.cell.y,
          data.cell.x + data.cell.width,
          data.cell.y + data.cell.height
        );
      }
    });
  }
    this.pdf.setFont(this.pdfStylesService.getSubProductCodeFont(),PdfConstants.FONT_STYLE_NORMAL);
    this.setContentStyles(this.translate.instant("endOfStatement"));
    this.pdf.setFontSize(PdfConstants.MEDIUM_FONT_SIZE);
    let xcord = PdfConstants.X_CORD_350_AR;

    this.pdf.text(xcord, this.pageHeight+PdfConstants.ADD_20, "++++"+this.translate.instant("endOfStatement")+"++++", this.setTextOption);
    this.setContentStyles(this.translate.instant("statmentNote"));
    this.pdf.setTextColor(this.pdfStylesService.getBankAddressFontColour());
    this.pdf.setFontSize(PdfConstants.SMALL_FONT_SIZE);
    xcord = PdfConstants.ADD_30;
    if (this.language === PdfConstants.LANGUAGE_AR) {
      xcord = PdfConstants.X_CORD_780;
    }
    this.pdf.text(xcord, this.pageHeight+PdfConstants.ADD_25, this.translate.instant("statmentNote"),
    this.setTextOption);
  }

  createAccStatementBanner(bannerData) {
    this.fieldContentYCord = this.fieldContentYCord + PdfConstants.ADD_40;

    const headStyles = {
      halign: 'center',valign: 'bottom', overflow: 'linebreak', fillColor: this.pdfStylesService.getTableHeaderBackgroundColour(),
      textColor: this.pdfStylesService.getTableHeaderTextColour(),
      font: this.getArabicFontIfLanguageAR(this.pdfStylesService.getTableFont(), this.pdfStylesService.getTableFontStyle()),
      fontSize: PdfConstants.TEXT_FONT_SIZE, fontStyle: this.pdfStylesService.getTableFontStyle()
    };
    const tableHeaders = [];
    let headerRow = [];
    headerRow.push({ content: this.translate.instant('Accounttype'), styles: headStyles });
    headerRow.push({ content: " ", styles: headStyles });
    headerRow.push({ content: this.translate.instant('currency'), styles: headStyles });
    headerRow.push({ content: " ", styles: headStyles });
    headerRow.push({ content: this.translate.instant('ledgerBalance'), styles: headStyles });
    headerRow.push({ content: " ", styles: headStyles });
    headerRow.push({ content: this.translate.instant('availableBal'), styles: headStyles });
    if (this.language === PdfConstants.LANGUAGE_AR) {
      headerRow = this.reverseTableContent(headerRow);
    }
    tableHeaders.push(headerRow);

    const bodyStyles = {
      halign: 'center',valign: 'top', overflow: 'linebreak', fillColor: this.pdfStylesService.getTableHeaderBackgroundColour(),
      textColor: this.pdfStylesService.getTableHeaderTextColour(),
      font: this.getArabicFontIfLanguageAR(this.pdfStylesService.getTableFont(), PdfConstants.FONT_STYLE_BOLD),
      fontSize:PdfConstants.TEXT_FONT_SIZE, fontStyle: this.pdfStylesService.getTableFontStyle()
    };
    const tableData = [];
    let row = [];

    row.push({ content: bannerData.type ? this.translate.instant(bannerData.type) : '-', styles: bodyStyles });
    row.push({ content: "|", styles: headStyles });
    row.push({ content: bannerData.currency ? bannerData.currency : '-', styles: bodyStyles });
    row.push({ content: "|", styles: headStyles });
    row.push({
      content: this.commonService.getCurrencyFormatedAmount(bannerData.currency, bannerData.ledgerBalance,
        this.currencySymbolDisplayEnabled), styles: bodyStyles
    });
    row.push({ content: "|", styles: headStyles });
    row.push({
      content: this.commonService.getCurrencyFormatedAmount(bannerData.currency, bannerData.availableBalance,
        this.currencySymbolDisplayEnabled), styles: bodyStyles
    });
    if (this.language === PdfConstants.LANGUAGE_AR) {
      row = this.reverseTableContent(row);
    }
    tableData.push(row);
    const margin = {
      top: this.logoConfig.ycord + PdfConstants.MARGIN_50 + this.nextLine,
      right: PdfConstants.NUMB_30
    };
    const styles = {
      font: this.getArabicFontIfLanguageAR(this.pdfStylesService.getTableFont(),
        this.pdfStylesService.getTableFontStyle()), fontStyle: this.pdfStylesService.getTableFontStyle(),
      halign: 'center'
    };

    if (this.language === PdfConstants.LANGUAGE_AR) {
      margin.right = PdfConstants.NUMB_65;
      styles.halign = 'center';
    }
    this.pdf.autoTable({
      body: tableData,
      head: [headerRow],
      margin: margin,
      startY: this.ycord + PdfConstants.ADD_5,
      pageBreak: PdfConstants.PAGE_BREAK,
      styles: styles,
      willDrawCell: function(data) {
        if (data.row.section === "head") {
          data.cell.styles.cellPadding = { top: 8, bottom: 9 };
          data.cell.height = 33;
        }
        if (data.row.section === "body" && data.cell.raw.content !== "|") {
          data.cell.styles.cellPadding = { top:4,bottom: 12 };
          data.cell.height = PdfConstants.ADD_30;
        }
        if (data.row.section === "body" && data.cell.raw.content === "|") {
          data.cell.styles.cellPadding = { top: 1,bottom: 20 };
          data.cell.height = PdfConstants.ADD_30;
        }
      }
    });
  }

  addStatementHeader(yCord?:any){
    this.setTextOption = { align: PdfConstants.ALIGN_LEFT };
    this.ycord = yCord ? yCord : this.fieldContentYCord + PdfConstants.ADD_40;
    this.pdf.setTextColor(PdfConstants.COLOR_TABLE_TEXT);
    this.pdf.setFont(this.pdfStylesService.getSubProductCodeFont(),PdfConstants.FONT_STYLE_BOLD);
    this.pdf.setFontSize(PdfConstants.TEXT_FONT_SIZE);
    const isArabic = this.arabicEncoding.test(this.translate.instant('statementPeriodMsg'));
    if(isArabic) {
      this.contentFontSize = PdfConstants.TEXT_FONT_SIZE;
      this.setContentStyles(this.translate.instant('statementPeriodMsg'),PdfConstants.FONT_STYLE_BOLD);
      this.setTextOption = { align: PdfConstants.ALIGN_RIGHT, lang: PdfConstants.LANGUAGE_AR };
    }
    const [day, month, year] = this.statementFilters['create_date'].split('/');
    const [day2, month2, year2] = this.statementFilters['create_date2'].split('/');
    this.pdf.text(this.getXCordBasedOnLang(PdfConstants.ADD_40, PdfConstants.X_CORD_780),
     this.ycord, this.translate.instant('statementPeriodMsg',
      {
        accountNo: this.statementFilters['account_no'],
        startDate: this.datePipe.transform(new Date(year, month - 1, day),'dd MMM yyyy'),
        endDate: this.datePipe.transform(new Date(year2, month2 - 1, day2),'dd MMM yyyy')
      })
      , this.setTextOption);
  }
}
