import { Injectable } from '@angular/core';
import { warning } from '../../pdf-images/warning-base64';
import { map } from '../../pdf-images/map-base64';
import { TranslateService } from '@ngx-translate/core';
import 'jspdf-autotable';
import { DatePipe } from '@angular/common';
import { CommonDataService } from './common-data.service';
import { PdfConstants } from '../pdfConstants';
import { PdfStylesService } from './pdf-styles.service';
import { arabicBoldArial } from '../../common/fonts/arabic-bold-arial';
import { arabicNormalCourier } from '../../common/fonts/arabic-normal-courier';
import { arabicBoldCourier } from '../../common/fonts/arabic-bold-courier';
import { CommonService } from './common.service';
import { arabicNormalArial } from '../../common/fonts/arabic-normal-arial';
import { Constants } from '../constants';
import jsPDF from 'jspdf';

@Injectable({ providedIn: 'root' })
export class GeneratePdfService {
  constructor(public translate: TranslateService, public datePipe: DatePipe, public commonDataService: CommonDataService,
              public pdfStylesService: PdfStylesService, public commonService: CommonService) {
                if (this.commonService.getUserLanguage() === PdfConstants.LANGUAGE_AR) {
                  this.logoConfig.xcord = PdfConstants.NUMB_460;
                  this.xcord = PdfConstants.NUMB_550;
                  this.textXCoOrd = PdfConstants.NUMB_480;
                  this.lineEndCord = PdfConstants.ZERO;
                  this.setTextOption =  { align: PdfConstants.ALIGN_RIGHT, lang: PdfConstants.LANGUAGE_AR };
                }
                this.commonService.loadDefaultConfiguration().subscribe(response => {
                  if (response) {
                    const contextPath = window[Constants.CONTEXT_PATH];
                    this.headerlogoPath =  contextPath + this.commonService.getPdfLogo();
                    this.commonService.getBase64ImageFromUrl(this.headerlogoPath)
                    .then(async  result => {
                      this.resultImage = result;
                      if (this.resultImage.indexOf('charset=UTF-8;') !== -1) {
                        this.resultImage = this.resultImage.replace('charset=UTF-8;', '');
                        this.resultImage = this.resultImage.replace(/\s/g, '');
                      }
                    })
                    .catch(err => console.error(err));
                  }
                });
              }
  doc;
  logoConfig = {
    xcord: PdfConstants.X_CORD_50,
    ycord: PdfConstants.Y_CORD_50,
    length: PdfConstants.LENGTH_80,
    width: PdfConstants.WIDTH_40
  };
  mapConfig = {
    xcord: PdfConstants.X_CORD_40,
    ycord: PdfConstants.Y_CORD_100,
    length: PdfConstants.LENGTH_650,
    width: PdfConstants.WIDTH_850
  };
  public ycord;
  public setTextOption =  {};
  public nextLine = PdfConstants.NEXT_LINE_10;
  public pageNumber = PdfConstants.PAGE_NUMBER_1;
  public pageHeight;
  public productCode;
  public xcord = PdfConstants.X_CORD_35;
  public lineEndCord = PdfConstants.LINE_END_CORD_565;
  public remainingTableHeight = PdfConstants.REMAINING_TABLE_HEIGHT;
  public rowsInRemainingPage = PdfConstants.ROWS_IN_REMAINING_PAGE;
  public remaingTableRows = PdfConstants.REMAINING_TABLE_ROWS;
  public textXCoOrd = PdfConstants.TEXT_X_COORD_100;
  public xCoOrdDiffForLine = PdfConstants.X_COORD_DIFF_FOR_LINE_5;
  public headerlogoPath: string;
  public backgroundImage = map;
  public warningImage = warning;
  public arabicEncoding = /[\u0600-\u06FF\u0750-\u077F]/;
  resultImage;

  /*
   * Method generates an empty PDF File with the borders, background image and header/footer.
  */
  generateFile(productCode, bankDetails) {
    this.doc = new jsPDF('p', 'pt', 'a4');
    this.productCode = productCode;
    const ycordInit = PdfConstants.Y_CORD_INIT_140;
    this.ycord = ycordInit;
    if (this.commonService.getUserLanguage() === PdfConstants.LANGUAGE_AR) {
      this.addFontArabic();
    }
    this.addHeader(bankDetails);
    this.addBackgroundImage();
    if (this.commonDataService.getmasterorTnx() === 'master') {
     this.setNoticeSectionContent();
    }
    this.addLeftBar();
    this.addRightBar();
    const pageHeightSub = PdfConstants.PAGE_HEIGHT_SUB_80;
    this.pageHeight = this.doc.internal.pageSize.height - pageHeightSub;
  }

  addHeaderImage() {
    if (this.resultImage && this.logoConfig)
    {
      this.doc.addImage(this.resultImage, 'JPEG', this.logoConfig.xcord, this.logoConfig.ycord,
      this.logoConfig.length, this.logoConfig.width);
    }
  }

  addHeader(bankDetails) {
    this.doc.setFontSize(PdfConstants.SIZE_30);
    this.addHeaderImage();
    this.doc.setFontSize(PdfConstants.NUMB_8);
    if (this.commonService.getUserLanguage() === PdfConstants.LANGUAGE_AR) {
      this.setArabicFont(this.pdfStylesService.getHeaderFont(), PdfConstants.FONT_STYLE_NORMAL);
    } else {
      this.doc.setFont(this.pdfStylesService.getHeaderFont(), PdfConstants.FONT_STYLE_NORMAL);
    }
    this.doc.setTextColor(this.pdfStylesService.getHeaderFontColour());
    let bankDetailsXCoOrd = PdfConstants.BANK_DETAILS_X_COORD_170;
    let bankDetailsYCoOrd = PdfConstants.BANK_DETAILS_Y_COORD_50;
    if (this.commonService.getUserLanguage() === PdfConstants.LANGUAGE_AR) {
      bankDetailsXCoOrd = PdfConstants.NUMB_410;
      this.doc.text(bankDetailsXCoOrd, bankDetailsYCoOrd, bankDetails.name, this.setTextOption);
    } else {
      this.doc.text(bankDetailsXCoOrd, bankDetailsYCoOrd, bankDetails.name);
    }
    if (bankDetails.SWIFTAddress.line1 &&  bankDetails.SWIFTAddress.line1 !== ''
    && bankDetails.SWIFTAddress.line1 != null) {
      bankDetailsYCoOrd = bankDetailsYCoOrd + this.nextLine;
      this.doc.text(bankDetailsXCoOrd, bankDetailsYCoOrd,
        this.commonService.decodeHtml(bankDetails.SWIFTAddress.line1), this.setTextOption);
    }
    if (bankDetails.SWIFTAddress.line2 &&  bankDetails.SWIFTAddress.line2 !== ''
    && bankDetails.SWIFTAddress.line2 != null) {
      bankDetailsYCoOrd = bankDetailsYCoOrd + this.nextLine;
      this.doc.text(bankDetailsXCoOrd, bankDetailsYCoOrd,
        this.commonService.decodeHtml(bankDetails.SWIFTAddress.line2), this.setTextOption);
    }
    if (bankDetails.SWIFTAddress.line3 &&  bankDetails.SWIFTAddress.line3 !== ''
    && bankDetails.SWIFTAddress.line3 != null) {
      bankDetailsYCoOrd = bankDetailsYCoOrd + this.nextLine;
      this.doc.text(bankDetailsXCoOrd, bankDetailsYCoOrd,
        this.commonService.decodeHtml(bankDetails.SWIFTAddress.line3), this.setTextOption);
    }
    const bankContactDetailsXCoOrd = this.commonService.getUserLanguage() === PdfConstants.LANGUAGE_AR ? PdfConstants.NUMB_270 :
                                    PdfConstants.BANK_CONTRACT_DETAILS_X_COORD_340;

    let bankContactDetailsYCoOrd = PdfConstants.BANK_CONTRACT_DETAILS_Y_COORD_50;
    if (bankDetails.fax &&  bankDetails.fax !== '' && bankDetails.fax != null) {
      this.doc.text(bankContactDetailsXCoOrd, bankContactDetailsYCoOrd,
        this.getTranslation('FAX') + bankDetails.fax, this.setTextOption);
    }
    if (bankDetails.phone &&  bankDetails.phone !== '' && bankDetails.phone != null) {
      bankContactDetailsYCoOrd = bankContactDetailsYCoOrd + this.nextLine;
      this.doc.text(bankContactDetailsXCoOrd, bankContactDetailsYCoOrd,
        this.getTranslation('JURISDICTION_PHONENO') + bankDetails.phone, this.setTextOption);
    }
    if (bankDetails.telex &&  bankDetails.telex !== '' && bankDetails.telex != null) {
      bankContactDetailsYCoOrd = bankContactDetailsYCoOrd + this.nextLine;
      this.doc.text(bankContactDetailsXCoOrd, bankContactDetailsYCoOrd,
        this.getTranslation('TELEX') + bankDetails.telex, this.setTextOption);
    }
    if (bankDetails.isoCode &&  bankDetails.isoCode !== '' && bankDetails.isoCode != null) {
      bankContactDetailsYCoOrd = bankContactDetailsYCoOrd + this.nextLine;
      this.doc.text(bankContactDetailsXCoOrd, bankContactDetailsYCoOrd,
        this.getTranslation('SWIFT_CODE') + bankDetails.isoCode, this.setTextOption);
    }
    this.doc.setFont(this.pdfStylesService.getHeaderFont(), 'bold');
    this.doc.setFontSize(PdfConstants.NUMB_10);
    if (this.commonService.getUserLanguage() === PdfConstants.LANGUAGE_AR) {
      this.setArabicFont(this.pdfStylesService.getHeaderFont(), PdfConstants.FONT_STYLE_BOLD);
      this.doc.text(PdfConstants.Y_CORD_INIT_140, PdfConstants.PRODUCT_CODE_Y_COORD_50, this.getTranslation(this.productCode),
      this.setTextOption);
    } else {
      this.doc.text(PdfConstants.PRODUCT_CODE_X_COORD_450, PdfConstants.PRODUCT_CODE_Y_COORD_50, this.getTranslation(this.productCode));
    }
  }

  /*
   * The method is used to add the background watermark image.
   */
  addBackgroundImage() {
      this.doc.setPage(this.pageNumber);
      this.doc.addImage(this.backgroundImage, 'JPEG', this.mapConfig.xcord, this.mapConfig.ycord,
      this.mapConfig.length, this.mapConfig.width, 'watermark', 'NONE', PdfConstants.BACKGROUND_IMAGE_ROTATION);
      // TODO : Status Text
  }

  /*
   *
   */
  addLeftBar() {

    // Left Side Bar
    this.doc.setDrawColor(this.pdfStylesService.getLeftBarColour()); // draw red lines #FFFFFF
    this.doc.setLineWidth(this.pdfStylesService.getLeftBarWidth());
    if (this.commonService.getUserLanguage() === PdfConstants.LANGUAGE_AR) {
      this.doc.line(this.xcord, PdfConstants.LEFT_BAR_Y1, this.xcord, PdfConstants.LEFT_BAR_Y2);
    } else {
      this.doc.line(this.xcord, PdfConstants.LEFT_BAR_Y1, PdfConstants.LEFT_BAR_X2, PdfConstants.LEFT_BAR_Y2);
    }

    // Print Product Code in the left border.
    this.doc.setTextColor(this.pdfStylesService.getLeftBarTextColour());
    this.doc.setFontSize(this.pdfStylesService.getLeftBarTextSize());
    this.doc.text(this.xcord + PdfConstants.X_CORD_DIFF_3, PdfConstants.Y_COORD_LEFT_BAR_400,
                  this.getTranslation(this.productCode), null, PdfConstants.PRODUCT_CODE_ROTATION_90);
  }

  addRightBar() {
    // Draw a background colour
    this.doc.setDrawColor(PdfConstants.COLOR_BACKGROUND_LINE);
    this.doc.setLineWidth(PdfConstants.WHITE_LINE_WIDTH_50);
    if (this.commonService.getUserLanguage() === PdfConstants.LANGUAGE_AR) {
      this.doc.line(PdfConstants.ZERO, PdfConstants.RIGHT_BAR_Y1, PdfConstants.ZERO, PdfConstants.RIGHT_BAR_Y2);
    } else {
      this.doc.line(PdfConstants.RIGHT_BAR_X, PdfConstants.RIGHT_BAR_Y1, PdfConstants.RIGHT_BAR_X, PdfConstants.RIGHT_BAR_Y2);
    }
  }


  /*
   * Method is used to set the notice section.
   */
  setNoticeSectionContent() {
    // Draw the header line
    let ycord = PdfConstants.Y_CORD_96;
    ycord = ycord + PdfConstants.UPPER_LINE_DIFF_4;
    this.doc.setDrawColor(this.pdfStylesService.getNoticeSectionBorderColour());
    const backGroundLineWidth = PdfConstants.BACKGROUND_LINE_WIDTH_1;
    this.doc.setLineWidth(backGroundLineWidth);
    if (this.commonService.getUserLanguage() === PdfConstants.LANGUAGE_AR) {
      this.addFontArabic();
      this.doc.line(this.xcord - this.xCoOrdDiffForLine, ycord, this.lineEndCord, ycord);
    } else {
      this.doc.line(this.xcord + this.xCoOrdDiffForLine, ycord, this.lineEndCord, ycord);
    }
    ycord = ycord + this.nextLine;
    // Image
    if (this.commonService.getUserLanguage() === PdfConstants.LANGUAGE_AR) {
      this.doc.addImage(this.warningImage, 'JPEG', this.logoConfig.xcord + PdfConstants.NUMB_30, ycord,
      PdfConstants.WARNING_WIDTH_40, PdfConstants.WARNING_HEIGHT_30);
    } else {
      this.doc.addImage(this.warningImage, 'JPEG', this.logoConfig.xcord, ycord,
      PdfConstants.WARNING_WIDTH_40, PdfConstants.WARNING_HEIGHT_30);
    }

    // Text
    this.doc.setFontSize(this.pdfStylesService.getNoticeSectionFontSize());
    this.doc.setTextColor(this.pdfStylesService.getNoticeSectionFontColour());
    if (this.commonService.getUserLanguage() === PdfConstants.LANGUAGE_AR) {
      this.setArabicFont(this.pdfStylesService.getNoticeSectionFont(), PdfConstants.FONT_STYLE_NORMAL);
    } else {
      this.doc.setFont(this.pdfStylesService.getNoticeSectionFont(), PdfConstants.FONT_STYLE_NORMAL);
    }
    this.doc.text(this.textXCoOrd, ycord, this.getTranslation('REPORTING_DISCLAIMER_LABEL'), this.setTextOption);

    ycord = ycord + this.nextLine;
    const value = this.getTranslation('REPORTING_DISCLAIMER');
    if (value.length > PdfConstants.MAX_ALLOWED_LENGTH_150) {
      const splitValue = this.doc.splitTextToSize(value, PdfConstants.MAX_LENGTH_450, {pageSplit: true});
      for (const splitText of splitValue) {
        this.doc.text(this.textXCoOrd, ycord, splitText, this.setTextOption);
        ycord = ycord + this.nextLine;
      }
    } else {
      this.doc.text(this.textXCoOrd, ycord, value, this.setTextOption);
    }
    // Lower Line
    ycord = ycord + PdfConstants.LOWER_LINE_DIFF_2;
    this.doc.setDrawColor(this.pdfStylesService.getNoticeSectionBorderColour());
    this.doc.setLineWidth(backGroundLineWidth);
    if (this.commonService.getUserLanguage() === PdfConstants.LANGUAGE_AR) {
      this.doc.line(this.xcord - this.xCoOrdDiffForLine, ycord, this.lineEndCord, ycord);
    } else {
      this.doc.line(this.xcord + this.xCoOrdDiffForLine, ycord, this.lineEndCord, ycord);
    }
  }
  /*
   * Read the div details and generate pdf.
   * Sets the header and content details, based on the availability of content in the div.
   */
  setSectionDetails(headerName, isLocaleKey, isSubSection, id) {
    const previewDiv = document.getElementById(id);
    if (this.commonService.getUserLanguage() === PdfConstants.LANGUAGE_AR) {
      this.addFontArabic();
    }
    if (previewDiv !== null) {
      if (isSubSection) {
        this.setSubSectionHeader(headerName, isLocaleKey);
      } else {
        this.setSectionHeader(headerName, isLocaleKey);
      }
      const childDivs = previewDiv.querySelectorAll('div');
      childDivs.forEach(childDiv => {
        const label = childDiv.getElementsByTagName('label')[0];
        const content = childDiv.getElementsByTagName('label')[1];
        const subHeader = childDiv.getElementsByTagName('h3')[0];
        if (subHeader) {
          this.setSubSectionHeader(subHeader.innerText, false);
        }
        if (label) {
          this.setSectionLabel(label.innerText, false);
        }
        if (content) {
          this.setSectionContent(content.innerText, false);
        }
      });
    }
  }

  /*
   * Method is used to set the header details.
   * If "headerName" is the text, then isLocaleKey should be false.
   * If "headerName" is the locale key, then isLocaleKey should be true.
   */
  setSectionHeader(headerName, isLocaleKey) {
    if (headerName !== '' && headerName !== null ) {
      this.ycord = this.ycord + (this.nextLine * PdfConstants.Y_COORD_GAP_4);
      if (this.ycord >= this.pageHeight) {
        this.addPage();
      }
      // Draw a background colour
      this.doc.setDrawColor(PdfConstants.COLOR_BACKGROUND_LINE);
      this.doc.setLineWidth(PdfConstants.WHITE_LINE_WIDTH_25);
      const xCoOrdLineDiff = PdfConstants.X_COORD_LINE_DIFF_5;

      if (this.commonService.getUserLanguage() === PdfConstants.LANGUAGE_AR) {
        this.doc.line(this.xcord - xCoOrdLineDiff, this.ycord, this.lineEndCord, this.ycord);
      } else {
        this.doc.line(this.xcord + xCoOrdLineDiff, this.ycord, this.lineEndCord, this.ycord);
      }

      this.ycord = this.ycord + this.nextLine;

      // Set text
      this.doc.setFontSize(this.pdfStylesService.getSectionHeaderFontSize());
      if (this.commonService.getUserLanguage() === PdfConstants.LANGUAGE_AR) {
        this.setArabicFont(this.pdfStylesService.getSectionHeaderFont(), this.pdfStylesService.getSectionHeaderFontStyle());
      } else {
        this.doc.setFont(this.pdfStylesService.getSectionHeaderFont(), this.pdfStylesService.getSectionHeaderFontStyle());
      }
      this.doc.setTextColor(this.pdfStylesService.getSectionHeaderFontColour());
      const xCoOrdDiffText = PdfConstants.X_COORD_DIFF_TEXT_8;
      const finalXcord = this.commonService.getUserLanguage() === PdfConstants.LANGUAGE_AR ?
                          this.xcord - xCoOrdDiffText : this.xcord + xCoOrdDiffText;
      if (isLocaleKey) {
        this.doc.text(this.getTranslation(headerName), finalXcord, this.ycord, this.setTextOption);
      } else {
        this.doc.text(headerName, finalXcord, this.ycord, this.setTextOption);
      }
      // Draw the header line
      this.ycord = this.ycord + PdfConstants.NUMB_4;
      this.doc.setDrawColor(this.pdfStylesService.getSectionHeaderBorderColour()); // draw red lines #FFFFFF
      this.doc.setLineWidth(PdfConstants.LINE_WIDTH_2);
      this.doc.line(finalXcord, this.ycord, this.lineEndCord, this.ycord);
      this.ycord = this.ycord + this.nextLine;
    }
  }

  /*
    This method is used to add the arabic fonts from a base64 string.
  */
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

  /*
    This method is used to set the arabic font based on the param passed (Arial or Courier).
  */
  setArabicFont(font, style) {
    if (PdfConstants.HEADER_LABEL_FONT === font && PdfConstants.FONT_STYLE_BOLD === style) {
      this.doc.setFont(PdfConstants.ARABIC_BOLD_ARIAL); // Set font as Arial Bold
    } else if (PdfConstants.HEADER_LABEL_FONT === font && PdfConstants.FONT_STYLE_NORMAL === style) {
      this.doc.setFont(PdfConstants.ARABIC_NORMAL_ARIAL); // Set font as Arial Normal
    } else if (PdfConstants.TEXT_FONT === font && PdfConstants.FONT_STYLE_NORMAL === style) {
      this.doc.setFont(PdfConstants.ARABIC_NORMAL_COURIER); // Set font as Courier Normal
    } else {
      this.doc.setFont(PdfConstants.ARABIC_BOLD_COURIER); // Set font as Courier Bold
    }
  }

  /*
   * Method is used to set the sub header details.
   * If "headerName" is the text, then isLocaleKey should be false.
   * If "headerName" is the locale key, then isLocaleKey should be true.
   */
  setSubSectionHeader(headerName, isLocaleKey) {
    if (headerName !== '' && headerName !== null ) {
      this.ycord = this.ycord + this.nextLine;
      if (this.ycord >= this.pageHeight) {
        this.addPage();
      }
      // draw gray lines
      this.doc.setDrawColor(this.pdfStylesService.getSubSectionHeaderBorderColour());
      const grayLineWidth = PdfConstants.GRAY_LINE_WIDTH_1;
      const xcordForLine = (this.commonService.getUserLanguage() === PdfConstants.LANGUAGE_AR) ?
                            (this.xcord - this.xCoOrdDiffForLine) : (this.xcord + this.xCoOrdDiffForLine);

      this.doc.setLineWidth(grayLineWidth);
      this.doc.line(xcordForLine, this.ycord, this.lineEndCord, this.ycord);

      let yCoOrdDiff = PdfConstants.Y_COORD_DIFF_7;
      this.ycord = this.ycord + yCoOrdDiff;
      // Draw a background colour
      this.doc.setDrawColor(PdfConstants.COLOR_BACKGROUND_LINE);
      this.doc.setLineWidth(PdfConstants.WHITE_LINE_WIDTH_12);
      this.doc.line(xcordForLine, this.ycord, this.lineEndCord, this.ycord);

      yCoOrdDiff = PdfConstants.NUMB_3;
      this.ycord = this.ycord + yCoOrdDiff;

      // Set header text
      this.doc.setFontSize(this.pdfStylesService.getSubSectionHeaderFontSize());
      let subSectionHeaderNameXCoOrd = PdfConstants.SUB_SECTION_HEADER_NAME_X_COORD_60;
      if (this.commonService.getUserLanguage() === PdfConstants.LANGUAGE_AR) {
        this.setArabicFont(this.pdfStylesService.getSubSectionHeaderFont(), this.pdfStylesService.getSubSectionHeaderFontStyle());
        subSectionHeaderNameXCoOrd = PdfConstants.NUMB_525;
      } else {
        this.doc.setFont(this.pdfStylesService.getSubSectionHeaderFont(), this.pdfStylesService.getSubSectionHeaderFontStyle());
      }
      this.doc.setTextColor(this.pdfStylesService.getSubSectionHeaderFontColour());
      if (isLocaleKey) {
        this.doc.text(this.getTranslation(headerName), subSectionHeaderNameXCoOrd, this.ycord, this.setTextOption);
      } else {
        this.doc.text(headerName, subSectionHeaderNameXCoOrd, this.ycord, this.setTextOption);
      }
      this.ycord = this.ycord + yCoOrdDiff;
      // draw gray lines
      this.doc.setDrawColor(this.pdfStylesService.getSubSectionHeaderBorderColour());
      this.doc.setLineWidth(grayLineWidth);
      this.doc.line(xcordForLine, this.ycord, this.lineEndCord, this.ycord);

      this.ycord = this.ycord + this.nextLine;
    }
  }

    /*
   * Method is used to set the fonts, spacing and value of the label.
   * If "label" is the text, then isLocaleKey should be false.
   * If "label" is the locale key, then isLocaleKey should be true.
   */
  setSectionLabel(label, isLocaleKey) {
    this.ycord = this.ycord + this.nextLine;
    if (this.ycord >= this.pageHeight) {
      this.addPage();
    }
    this.doc.setFontSize(this.pdfStylesService.getSectionLabelFontSize());
    if (this.commonService.getUserLanguage() === PdfConstants.LANGUAGE_AR) {
      this.setArabicFont(this.pdfStylesService.getSectionLabelFont(), this.pdfStylesService.getSectionLabelFontStyle());
    } else {
      this.doc.setFont(this.pdfStylesService.getSectionLabelFont(), this.pdfStylesService.getSectionLabelFontStyle());
    }
    this.doc.setTextColor(this.pdfStylesService.getSectionLabelFontColour());
    if (isLocaleKey) {
      this.doc.text(this.textXCoOrd, this.ycord, this.getTranslation(label), this.setTextOption);
    } else {     
      const maxAllowedLength = PdfConstants.MAX_ALLOWED_LENGTH_100;
      if (label.length > PdfConstants.MAX_ALLOWED_LENGTH_35) {
        const splitValue = this.doc.splitTextToSize(label, maxAllowedLength, {pageSplit: true});
        let count = 1;
        for (const splitText of splitValue) {
          if (this.ycord >= this.pageHeight) {
            this.addPage();
            this.doc.setFontSize(this.pdfStylesService.getSectionContentFontSize());
            if (this.commonService.getUserLanguage() === PdfConstants.LANGUAGE_AR) {
              this.setArabicFont(this.pdfStylesService.getSectionContentFont(), PdfConstants.FONT_STYLE_BOLD);
            } else {
              this.doc.setFont(this.pdfStylesService.getSectionContentFont());
            }
            this.doc.setTextColor(this.pdfStylesService.getSectionContentFontColour());
          }
          this.doc.text(this.textXCoOrd, this.ycord, splitText, this.setTextOption);
          if (count < splitValue.length)
          {
           this.ycord = this.ycord + this.nextLine;
           count++;
          }
        }
      } else {
        this.doc.text(this.textXCoOrd, this.ycord, label, this.setTextOption);
      }
    }
  }

  /*
   * Method is used to set the fonts, spacing etc and text.
   * If "value" is the text, then isLocaleKey should be false.
   * If "value" is the locale key, then isLocaleKey should be true.
   */
  setSectionContent(value, isLocaleKey) {
    // Test whether the section content contains arabic text, if yes add the AR fonts
    const isArabicPresent = this.arabicEncoding.test(value);
    if (isArabicPresent) {
      this.addFontArabic();
    }
    this.doc.setFontSize(this.pdfStylesService.getSectionContentFontSize());
    let sectionContentXCoOrd = PdfConstants.SECTION_CONTENT_X_COORD_280;
    if (isArabicPresent) {
      if (this.commonService.getUserLanguage() === PdfConstants.LANGUAGE_AR) {
        this.setArabicFont(this.pdfStylesService.getSectionContentFont(), PdfConstants.FONT_STYLE_BOLD);
        sectionContentXCoOrd = PdfConstants.NUMB_300;
      } else {
        this.setArabicFont(this.pdfStylesService.getSectionContentFont(), PdfConstants.FONT_STYLE_BOLD);
        sectionContentXCoOrd = PdfConstants.SECTION_CONTENT_X_COORD_280;
      }
    } else {
      this.doc.setFont(this.pdfStylesService.getSectionContentFont());
    }
    this.doc.setTextColor(this.pdfStylesService.getSectionContentFontColour());
    if (isLocaleKey) {
      this.doc.text(sectionContentXCoOrd, this.ycord, this.getTranslation(value), this.setTextOption);
    } else {
      const maxAllowedLength = PdfConstants.MAX_ALLOWED_LENGTH_285;
      if (value.length > PdfConstants.MAX_ALLOWED_LENGTH_65) {
        const splitValue = this.doc.splitTextToSize(value, maxAllowedLength, {pageSplit: true});
        for (const splitText of splitValue) {
          if (this.ycord >= this.pageHeight) {
            this.addPage();
            this.doc.setFontSize(this.pdfStylesService.getSectionContentFontSize());
            if (this.commonService.getUserLanguage() === PdfConstants.LANGUAGE_AR) {
              this.setArabicFont(this.pdfStylesService.getSectionContentFont(), PdfConstants.FONT_STYLE_BOLD);
            } else {
              this.doc.setFont(this.pdfStylesService.getSectionContentFont());
            }
            this.doc.setTextColor(this.pdfStylesService.getSectionContentFontColour());
          }
          this.doc.text(sectionContentXCoOrd, this.ycord, splitText, this.setTextOption);
          this.ycord = this.ycord + this.nextLine;
        }
      } else if (value.length > PdfConstants.MAX_LENGTH_50) {
        const splitValue = this.doc.splitTextToSize(value, maxAllowedLength, {pageSplit: true});
        for (const splitText of splitValue) {
          if (this.ycord >= this.pageHeight) {
            this.addPage();
            this.doc.setFontSize(this.pdfStylesService.getSectionContentFontSize());
            if (this.commonService.getUserLanguage() === PdfConstants.LANGUAGE_AR) {
              this.setArabicFont(this.pdfStylesService.getSectionContentFont(), PdfConstants.FONT_STYLE_BOLD);
            } else {
              this.doc.setFont(this.pdfStylesService.getSectionContentFont());
            }
            this.doc.setTextColor(this.pdfStylesService.getSectionContentFontColour());
          }
          this.doc.text(sectionContentXCoOrd, this.ycord, splitText, this.setTextOption);
          this.ycord = this.ycord + this.nextLine;
        }
      }
      else {
        this.doc.text(sectionContentXCoOrd, this.ycord, value, this.setTextOption);
      }
    }
  }

  /*
   * Read the div details and generate pdf for Narrative section.
   * Sets the header and content details, based on the availability of content passed.
   * To be used when we need to set the content directly on the left side, and no label is available.
   */
  setNarrativeSectionDetails(headerName, isHeaderLocaleKey, isContentLocaleKey, isSubSection, content) {
    if (content && content !== null && content !== '') {
      if (this.commonService.getUserLanguage() === PdfConstants.LANGUAGE_AR) {
        this.addFontArabic();
      }
      if (isSubSection) {
        this.setSubSectionHeader(headerName, isHeaderLocaleKey);
      } else {
        this.setSectionHeader(headerName, isHeaderLocaleKey);
      }
      this.doc.setFontSize(this.pdfStylesService.getSectionContentFontSize());
      if (this.commonService.getUserLanguage() === PdfConstants.LANGUAGE_AR) {
        this.setArabicFont(this.pdfStylesService.getSectionContentFont(), PdfConstants.FONT_STYLE_BOLD);
      } else {
        this.doc.setFont(this.pdfStylesService.getSectionContentFont());
      }
      this.doc.setTextColor(this.pdfStylesService.getSectionContentFontColour());
      if (isContentLocaleKey) {
        this.doc.text(this.textXCoOrd, this.ycord, this.getTranslation(content), this.setTextOption);
      } else {
        this.setTextIfNotLocaleKey(content);
      }
    }
  }

  setTextIfNotLocaleKey(content) {
    const maxAllowedLength = PdfConstants.MAX_ALLOWED_LENGTH_100;
    if (content.length > maxAllowedLength) {
      const splitValue = this.doc.splitTextToSize(content, PdfConstants.MAX_LENGTH_150, { pageSplit: true });
      for (const splitText of splitValue) {
        if (this.ycord >= this.pageHeight) {
          this.addPage();
          this.doc.setFontSize(this.pdfStylesService.getSectionContentFontSize());
          if (this.commonService.getUserLanguage() === PdfConstants.LANGUAGE_AR) {
            this.setArabicFont(this.pdfStylesService.getSectionContentFont(), PdfConstants.FONT_STYLE_BOLD);
          } else {
            this.doc.setFont(this.pdfStylesService.getSectionContentFont());
          }
          this.doc.setTextColor(this.pdfStylesService.getSectionContentFontColour());
        }
        this.doc.text(this.textXCoOrd, this.ycord, splitText, this.setTextOption);
        this.ycord = this.ycord + this.nextLine;
      }
    } else {
      this.doc.text(this.textXCoOrd, this.ycord, content, this.setTextOption);
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
    this.doc.addPage();
    this.ycord = PdfConstants.Y_CORD_INIT_40;
    this.pageNumber++;
    this.addBackgroundImage();
    this.addLeftBar();
    this.addRightBar();
    const yCoOrdGap = 2;
    this.ycord = this.ycord + (this.nextLine * yCoOrdGap);
  }

  saveFile(pdfRefId, pdfTnxId) {
    this.updateFooter();
    if (pdfTnxId !== '') {
      this.doc.save(`${pdfRefId}_${pdfTnxId}.pdf`);
    } else {
      this.doc.save(`${pdfRefId}.pdf`);
    }
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
    const currentPage = `${pageNumber} / ${totalPages}`;
    const currentDate = this.datePipe.transform(new Date(), 'dd/MM/yyyy');
    this.doc.setPage(pageNumber);

    // Draw a background colour
    this.doc.setDrawColor(PdfConstants.COLOR_BACKGROUND_LINE);
    this.doc.setLineWidth(PdfConstants.WHITE_LINE_WIDTH_50);
    let xcordDiff = PdfConstants.X_CORD_DIFF_6;
    const footerLineY = PdfConstants.FOOTER_LINE_Y;
    if (this.commonService.getUserLanguage() === PdfConstants.LANGUAGE_AR) {
      xcordDiff = PdfConstants.NUMB_10;
      this.doc.line(this.xcord - xcordDiff, footerLineY, PdfConstants.FOOTER_LINE_X2, footerLineY);
    } else {
      this.doc.line(this.xcord + xcordDiff, footerLineY, PdfConstants.FOOTER_LINE_X2, footerLineY);
    }

    this.doc.setFontSize(this.pdfStylesService.getFooterFontSize());
    this.doc.setTextColor(this.pdfStylesService.getFooterFontColour());
    const pageYCoOrd = PdfConstants.PAGE_Y_COORD;

    if (this.commonService.getUserLanguage() === PdfConstants.LANGUAGE_AR) {
      this.doc.text(currentPage, this.xcord - xcordDiff, pageYCoOrd, this.setTextOption);
      this.doc.text(currentDate, this.xcord - xcordDiff, pageYCoOrd + this.nextLine, this.setTextOption);
    } else {
      this.doc.text(currentPage, this.xcord + xcordDiff, pageYCoOrd);
      this.doc.text(currentDate, this.xcord + xcordDiff, pageYCoOrd + this.nextLine);
    }
  }

  /*
   * Creates a table with the headers and data(rows).
   */
  createTable(headers, data) {
    this.setTableFontFormat();
    if (this.commonService.getUserLanguage() === PdfConstants.LANGUAGE_AR) {
      this.addFontArabic();
    }
    const rows = data.length;
    const yCoOrdGap = PdfConstants.Y_COORD_GAP_2;
    this.remainingTableHeight = this.ycord + (this.nextLine * yCoOrdGap * (rows + 1));
    if (this.remainingTableHeight >= this.pageHeight) {
      this.createFirstPartOfTable(data, headers);
      while (this.remainingTableHeight > this.pageHeight) {
        this.remaingTableRows = rows - this.rowsInRemainingPage;
        this.createRemainingPartOfTable(data, headers);
      }
    } else {
      let options = {
        margin: {
          top: this.ycord + this.nextLine,
          right: PdfConstants.NUMB_30
        },
        pageBreak: PdfConstants.PAGE_BREAK,
        styles: { font: this.getArabicFontIfLanguageAR(this.pdfStylesService.getSectionLabelFont(),
          this.pdfStylesService.getTableFontStyle()), fontStyle: this.pdfStylesService.getTableFontStyle(),
          halign: PdfConstants.ALIGN_LEFT }
      };
      if (this.commonService.getUserLanguage() === PdfConstants.LANGUAGE_AR) {
        options = {
          margin: {
            top: this.ycord + this.nextLine,
            right: PdfConstants.LENGTH_80
          },
          pageBreak: PdfConstants.PAGE_BREAK,
          styles: { font: this.getArabicFontIfLanguageAR(this.pdfStylesService.getSectionLabelFont(),
            this.pdfStylesService.getTableFontStyle()), fontStyle: this.pdfStylesService.getTableFontStyle(),
            halign: PdfConstants.ALIGN_RIGHT }
        };
      }

      this.doc.autoTable(headers, data, options);
      this.ycord = this.remainingTableHeight + this.nextLine * yCoOrdGap;
    }
  }

  getTranslation(key: string) {
    let value = '';
    if (key !== '' && key !== null) {
      this.translate.get(key).subscribe((res: string) => {
        value = res;
      });
    }
    return value;
  }

  createFirstPartOfTable(data, headers) {
    let options = {
      margin: {
        top: this.ycord + this.nextLine,
        right: PdfConstants.NUMB_30
      },
      pageBreak: PdfConstants.PAGE_BREAK,
      styles: { font: this.getArabicFontIfLanguageAR(this.pdfStylesService.getSectionLabelFont(),
        this.pdfStylesService.getTableFontStyle()), fontStyle: this.pdfStylesService.getTableFontStyle(),
        halign: PdfConstants.ALIGN_LEFT }
    };
    if (this.commonService.getUserLanguage() === PdfConstants.LANGUAGE_AR) {
      options = {
        margin: {
          top: this.ycord + this.nextLine,
          right: PdfConstants.LENGTH_80
        },
        pageBreak: PdfConstants.PAGE_BREAK,
        styles: { font: this.getArabicFontIfLanguageAR(this.pdfStylesService.getSectionLabelFont(),
          this.pdfStylesService.getTableFontStyle()), fontStyle: this.pdfStylesService.getTableFontStyle(),
          halign: PdfConstants.ALIGN_RIGHT }
      };
    }
    this.rowsInRemainingPage = Math.round((PdfConstants.ROW_MULTIPLIER * (this.pageHeight - this.ycord)) - 1);
    const splitData = data.slice(0, this.rowsInRemainingPage);

    if (this.commonService.getUserLanguage() === PdfConstants.LANGUAGE_AR) {
      this.doc.autoTable(headers, splitData, options, { align: PdfConstants.ALIGN_RIGHT, lang: PdfConstants.LANGUAGE_AR });
    } else {
      this.doc.autoTable(headers, splitData, options);
    }
    const yCoOrdGap = PdfConstants.Y_COORD_GAP_2;
    this.ycord = this.ycord + (this.nextLine * yCoOrdGap * (splitData.length + 1));
    this.remainingTableHeight = this.ycord + (this.nextLine * yCoOrdGap * (this.remaingTableRows + 1));
  }

  createRemainingPartOfTable(data, headers) {
    this.addPage();
    this.setTableFontFormat();
    let optionsSplit = {
      margin: {
        top: this.ycord + this.nextLine,
        right: PdfConstants.NUMB_30
      },
      drawHeaderRow() {
        return false;
      },
      pageBreak: PdfConstants.PAGE_BREAK,
      styles: { font: this.getArabicFontIfLanguageAR(this.pdfStylesService.getSectionLabelFont(),
        this.pdfStylesService.getTableFontStyle()), fontStyle: this.pdfStylesService.getTableFontStyle(),
        halign: PdfConstants.ALIGN_LEFT }
    };
    const splitData = data.slice(this.rowsInRemainingPage, data.length);
    if (this.commonService.getUserLanguage() === PdfConstants.LANGUAGE_AR) {
      optionsSplit = {
        margin: {
          top: this.ycord + this.nextLine,
          right: PdfConstants.LENGTH_80
        },
        drawHeaderRow() {
          return false;
        },
        pageBreak: PdfConstants.PAGE_BREAK,
        styles: { font: this.getArabicFontIfLanguageAR(this.pdfStylesService.getSectionLabelFont(),
          this.pdfStylesService.getTableFontStyle()), fontStyle: this.pdfStylesService.getTableFontStyle(),
          halign: PdfConstants.ALIGN_RIGHT }
      };
      this.doc.autoTable(headers, splitData, optionsSplit, { align: PdfConstants.ALIGN_RIGHT, lang: PdfConstants.LANGUAGE_AR });
    } else {
      this.doc.autoTable(headers, splitData, optionsSplit);
    }
    const yCoOrdGap = PdfConstants.Y_COORD_GAP_2;
    this.ycord = this.ycord + (this.nextLine * yCoOrdGap * (splitData.length + 1));
    this.remainingTableHeight = this.ycord + (this.nextLine * yCoOrdGap * (this.remaingTableRows + 1));
  }

  setTableFontFormat() {
    this.doc.setFontSize(this.pdfStylesService.getTableFontSize());
    this.doc.setTextColor(this.pdfStylesService.getTableFontColour());
    this.doc.setFont('', this.pdfStylesService.getTableFontStyle());
  }

  getArabicFontIfLanguageAR(font, style) {
    if (this.commonService.getUserLanguage() === PdfConstants.LANGUAGE_AR) {
      if (PdfConstants.HEADER_LABEL_FONT === font && PdfConstants.FONT_STYLE_BOLD === style) {
        return PdfConstants.ARABIC_BOLD_ARIAL; // Return Arial Bold font
      } else if (PdfConstants.HEADER_LABEL_FONT === font && PdfConstants.FONT_STYLE_NORMAL === style) {
        return PdfConstants.ARABIC_NORMAL_ARIAL; // Return Arial Normal font
      } else if (PdfConstants.TEXT_FONT === font && PdfConstants.FONT_STYLE_NORMAL === style) {
        return PdfConstants.ARABIC_NORMAL_COURIER; // Return Courier Normal font
      } else {
        return PdfConstants.ARABIC_BOLD_COURIER; // Return Courier Bold font
      }
    } else {
      return this.pdfStylesService.getSectionLabelFont();
    }
  }
}
