import { Injectable } from '@angular/core';
import { PdfConstants } from './pdfConstants';

@Injectable({ providedIn: 'root' })
export class FccPdfStylesService {

  // Product Code
  public productCodeFontSize = PdfConstants.PRODUCT_CODE_FONT_SIZE;
  public productCodeFont = PdfConstants.TEXT_FONT;
  public productCodeFontColour = PdfConstants.COLOR_HEADER_PRODUCT_CODE;

  // Sub Product Code
  public subProductCodeFontSize = PdfConstants.SUB_PRODUCT_CODE_FONT_SIZE;
  public subProductCodeFont = PdfConstants.TEXT_FONT;
  public subProductCodeFontColour = PdfConstants.COLOR_HEADER_SUB_PRODUCT_CODE;

  // Bank Address
  public bankAddressFontSize = PdfConstants.TEXT_FONT_SIZE;
  public bankAddressFont = PdfConstants.TEXT_FONT;
  public bankAddressFontColour = PdfConstants.COLOR_HEADER_TEXT;

  // Left Bar
  public leftBarColour = PdfConstants.COLOR_BORDER;
  public leftBarWidth = PdfConstants.LEFT_BAR_LINE_WIDTH_50;
  public leftBarTextFontColour = PdfConstants.COLOR_BAR_TEXT;
  public leftBarTextFontSize = PdfConstants.MEDIUM_FONT_SIZE;
  public leftBarTextFont = PdfConstants.TEXT_FONT;
  public leftBarTextFontStyle = PdfConstants.FONT_STYLE_NORMAL;

   //Noteforlinebreak
   public LineBreakForMaster = PdfConstants.COLOR_BACKGROUND;
   public LineBreakSideBar = PdfConstants.COLOR_NOTE_SIDEBAR_TEXT;
   public LineBreakBarTextFontColour = PdfConstants.COLOR_NOTEBAR_TEXT;

  // Right Bar
  public rightBarColour = PdfConstants.COLOR_BACKGROUND_LINE;
  public rightBarWidth = PdfConstants.LEFT_BAR_LINE_WIDTH_50;

  // Section Header
  public sectionHeaderFontSize = PdfConstants.SECTION_HEADER_FONT_SIZE;
  public sectionHeaderFont = PdfConstants.TEXT_FONT;
  public sectionHeaderFontStyle = PdfConstants.FONT_STYLE_BOLD;
  public sectionHeaderFontColour = PdfConstants.COLOR_SECTION_HEADER_TEXT;

  // Sub - Section Header
  public subSectionHeaderFontSize = PdfConstants.MEDIUM_FONT_SIZE;
  public subSectionHeaderFont = PdfConstants.TEXT_FONT;
  public subSectionHeaderFontStyle = PdfConstants.FONT_STYLE_BOLD;
  public subSectionHeaderFontColour = PdfConstants.COLOR_SECTION_HEADER_TEXT;

  // Section Label
  public sectionLabelFontSize = PdfConstants.TEXT_FONT_SIZE;
  public sectionLabelFont = PdfConstants.TEXT_FONT;
  public sectionLabelFontColour = PdfConstants.COLOR_SECTION_LABEL_TEXT;
  public sectionLabelFontStyle = PdfConstants.FONT_STYLE_BOLD;

  // Section Content
  public sectionContentFontSize = PdfConstants.TEXT_FONT_SIZE;
  public sectionContentFont = PdfConstants.TEXT_FONT;
  public sectionContentFontColour = PdfConstants.COLOR_SECTION_CONTENT_TEXT;
  public sectionContentFontStyle = PdfConstants.FONT_STYLE_NORMAL;
  public italicContentStyle = PdfConstants.FONT_STYLE_ITALICS;
  public sectionAmendContentFontColour = PdfConstants.COLOR_AMEND_SECTION_CONTENT_TEXT;
  // Footer
  public footerFont = PdfConstants.TEXT_FONT;
  public footerFontSize = PdfConstants.SMALL_FONT_SIZE;
  public footerFontColour = PdfConstants.COLOR_FOOTER_PAGES_DATE;

  public showHeader = true;
  public showFooter = true;
  public showLogo = true;
  public showLogoAllPages = true;
  public showLeftBar = true;
  public showWatermark = true;
  public showDateAndTime = true;

  // Table
  public tableFont = PdfConstants.TEXT_FONT;
  public tableFontSize = PdfConstants.MEDIUM_FONT_SIZE;
  public tableHeaderFontSize = PdfConstants.MEDIUM_FONT_SIZE;
  public tableFontColour = PdfConstants.COLOR_TABLE_TEXT;
  public tableFontStyle = PdfConstants.FONT_STYLE_NORMAL;
  public tableHeaderFontStyle = PdfConstants.FONT_STYLE_NORMAL;
  public tableHeaderBackgroundColour = PdfConstants.COLOR_TABLE_HEADER_BACKGROUND;
  public tableHeaderTextColour = PdfConstants.COLOR_TABLE_HEADER_TEXT;

  // Header
  public getBankAddressFontSize(): number {
    return this.bankAddressFontSize;
  }

  public setBankAddressFontSize(bankAddressFontSize) {
    this.bankAddressFontSize = bankAddressFontSize;
  }

  public getBankAddressFont(): string {
    return this.bankAddressFont;
  }

  public setBankAddressFont(bankAddressFont) {
    this.bankAddressFont = bankAddressFont;
  }

  public getBankAddressFontColour(): string {
    return this.bankAddressFontColour;
  }

  public setBankAddressFontColour(bankAddressFontColour) {
    this.bankAddressFontColour = bankAddressFontColour;
  }

  // Left Bar
  public getLeftBarColour(): string {
    return this.leftBarColour;
  }

  public setLeftBarColour(leftBarColour) {
    this.leftBarColour = leftBarColour;
  }

  public getLeftBarWidth(): number {
    return this.leftBarWidth;
  }

  public setLeftBarWidth(leftBarWidth) {
    this.leftBarWidth = leftBarWidth;
  }

  public getLeftBarTextFontColour(): string {
    return this.leftBarTextFontColour;
  }

  public getLineBreakForMaster(): string {
    return this.LineBreakForMaster;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public setLineBreakForMaster(LineBreakForMaster) {
    return this.LineBreakForMaster;
  }

  public getLineBreakBarTextFontColour(): string {
    return this.LineBreakBarTextFontColour;
  }

  public setLineBreakBarTextFontColour(LineBreakBarTextFontColour) {
    this.LineBreakBarTextFontColour = LineBreakBarTextFontColour;
  }

  public getLineBreakSideBar(): string {
    return this.LineBreakSideBar;
  }

  public setLineBreakSideBar(LineBreakSideBar) {
    this.LineBreakSideBar = LineBreakSideBar;
  }

  public setLeftBarTextFontColour(leftBarTextFontColour) {
    this.leftBarTextFontColour = leftBarTextFontColour;
  }

  public getLeftBarTextFontSize(): number {
    return this.leftBarTextFontSize;
  }

  public setLeftBarTextFontSize(leftBarTextFontSize) {
    this.leftBarTextFontSize = leftBarTextFontSize;
  }

  public getLeftBarTextFont(): string {
    return this.leftBarTextFont;
  }

  public setLeftBarTextFont(leftBarTextFont) {
    this.leftBarTextFont = leftBarTextFont;
  }

  public getLeftBarTextFontStyle(): string {
    return this.leftBarTextFontStyle;
  }

  public setLeftBarTextFontStyle(leftBarTextFontStyle) {
    this.leftBarTextFontStyle = leftBarTextFontStyle;
  }

  // Section Header
  public getSectionHeaderFontSize(): number {
    return this.sectionHeaderFontSize;
  }

  public setSectionHeaderFontSize(sectionHeaderFontSize) {
    this.sectionHeaderFontSize = sectionHeaderFontSize;
  }

  public getSectionHeaderFont(): string {
    return this.sectionHeaderFont;
  }

  public setSectionHeaderFont(sectionHeaderFont) {
    this.sectionHeaderFont = sectionHeaderFont;
  }

  public getSectionHeaderFontStyle(): string {
    return this.sectionHeaderFontStyle;
  }

  public setSectionHeaderFontStyle(sectionHeaderFontStyle) {
    this.sectionHeaderFontStyle = sectionHeaderFontStyle;
  }

  public getSectionHeaderFontColour(): string {
    return this.sectionHeaderFontColour;
  }

  public setSectionHeaderFontColour(sectionHeaderFontColour) {
    this.sectionHeaderFontColour = sectionHeaderFontColour;
  }

  // Sub - Section Header
  public getSubSectionHeaderFontSize(): number {
    return this.subSectionHeaderFontSize;
  }

  public setSubSectionHeaderFontSize(subSectionHeaderFontSize) {
    this.subSectionHeaderFontSize = subSectionHeaderFontSize;
  }

  public getSubSectionHeaderFont(): string {
    return this.subSectionHeaderFont;
  }

  public setSubSectionHeaderFont(subSectionHeaderFont) {
    this.subSectionHeaderFont = subSectionHeaderFont;
  }

  public getSubSectionHeaderFontStyle(): string {
    return this.subSectionHeaderFontStyle;
  }

  public setSubSectionHeaderFontStyle(subSectionHeaderFontStyle) {
    this.subSectionHeaderFontStyle = subSectionHeaderFontStyle;
  }

  public getSubSectionHeaderFontColour(): string {
    return this.subSectionHeaderFontColour;
  }

  public setSubSectionHeaderFontColour(subSectionHeaderFontColour) {
    this.subSectionHeaderFontColour = subSectionHeaderFontColour;
  }

  // Section Label
  public getSectionLabelFontSize(): number {
    return this.sectionLabelFontSize;
  }

  public setSectionLabelFontSize(sectionLabelFontSize) {
    this.sectionLabelFontSize = sectionLabelFontSize;
  }

  public getSectionLabelFont(): string {
    return this.sectionLabelFont;
  }

  public setSectionLabelFont(sectionLabelFont) {
    this.sectionLabelFont = sectionLabelFont;
  }

  public getSectionLabelFontColour(): string {
    return this.sectionLabelFontColour;
  }

  public setSectionLabelFontColour(sectionLabelFontColour) {
    this.sectionLabelFontColour = sectionLabelFontColour;
  }

  public getSectionLabelFontStyle(): string {
    return this.sectionLabelFontStyle;
  }

  public setSectionLabelFontStyle(sectionLabelFontStyle) {
    this.sectionLabelFontStyle = sectionLabelFontStyle;
  }

  // Section Content
  public getSectionContentFontSize(): number {
    return this.sectionContentFontSize;
  }

  public setSectionContentFontSize(sectionContentFontSize) {
    this.sectionContentFontSize = sectionContentFontSize;
  }

  public getSectionContentFont(): string {
    return this.sectionContentFont;
  }

  public setSectionContentFont(sectionContentFont) {
    this.sectionContentFont = sectionContentFont;
  }

  public getSectionContentFontColour(): string {
    return this.sectionContentFontColour;
  }

  public getAmendSectionContentFontColour(): string {
    return this.sectionAmendContentFontColour;
  }

  public setSectionContentFontColour(sectionContentFontColour) {
    this.sectionContentFontColour = sectionContentFontColour;
  }

  public getSectionContentFontStyle(): string {
    return this.sectionContentFontStyle;
  }

  public setSectionContentFontStyle(sectionContentFontStyle) {
    this.sectionContentFontStyle = sectionContentFontStyle;
  }

  // Footer
  public getFooterFont(): string {
    return this.footerFont;
  }

  public setFooterFont(footerFont) {
    this.footerFont = footerFont;
  }

  public getFooterFontSize(): number {
    return this.footerFontSize;
  }

  public setFooterFontSize(footerFontSize) {
    this.footerFontSize = footerFontSize;
  }

  public getFooterFontColour(): string {
    return this.footerFontColour;
  }

  public setFooterFontColour(footerFontColour) {
    this.footerFontColour = footerFontColour;
  }

  // Product Code
  public getProductCodeFontSize(): number {
    return this.productCodeFontSize;
  }

  public setProductCodeFontSize(productCodeFontSize) {
    this.productCodeFontSize = productCodeFontSize;
  }

  public getProductCodeFont(): string {
    return this.productCodeFont;
  }

  public setProductCodeFont(productCodeFont) {
    this.productCodeFont = productCodeFont;
  }

  public getProductCodeFontColour(): string {
    return this.productCodeFontColour;
  }

  public setProductCodeFontColour(productCodeFontColour) {
    this.productCodeFontColour = productCodeFontColour;
  }

  // Right Bar
  public getRightBarColour(): string {
    return this.rightBarColour;
  }

  public setRightBarColour(rightBarColour) {
    this.rightBarColour = rightBarColour;
  }

  public getRightBarWidth(): number {
    return this.rightBarWidth;
  }

  public setRightBarWidth(rightBarWidth) {
    this.rightBarWidth = rightBarWidth;
  }

  public getShowHeader(): boolean {
    return this.showHeader;
  }

  public setShowHeader(showHeader) {
    this.showHeader = showHeader;
  }

  public getShowDateAndTime(): boolean {
    return this.showDateAndTime;
  }

  public setShowDateAndTime(showDateAndTime) {
    this.showDateAndTime = showDateAndTime;
  }

  public getShowLogoAllPages(): boolean {
    return this.showLogoAllPages;
  }

  public setShowLogoAllPages(showLogoAllPages) {
    this.showLogoAllPages = showLogoAllPages;
  }

  public getShowFooter(): boolean {
    return this.showFooter;
  }

  public setShowFooter(showFooter) {
    this.showFooter = showFooter;
  }

  public getShowLogo(): boolean {
    return this.showLogo;
  }

  public setShowLogo(showLogo) {
    this.showLogo = showLogo;
  }

  public getShowLeftBar(): boolean {
    return this.showLeftBar;
  }

  public setShowLeftBar(showLeftBar) {
    this.showLeftBar = showLeftBar;
  }

  public getShowWatermark(): boolean {
    return this.showWatermark;
  }

  public setShowWatermark(showWatermark) {
    this.showWatermark = showWatermark;
  }

  // Sub Product Code
  public getSubProductCodeFontSize(): number {
    return this.subProductCodeFontSize;
  }

  public setSubProductCodeFontSize(subProductCodeFontSize) {
    this.subProductCodeFontSize = subProductCodeFontSize;
  }

  public getSubProductCodeFont(): string {
    return this.subProductCodeFont;
  }

  public setSubProductCodeFont(subProductCodeFont) {
    this.subProductCodeFont = subProductCodeFont;
  }

  public getSubProductCodeFontColour(): string {
    return this.subProductCodeFontColour;
  }

  public setSubProductCodeFontColour(subProductCodeFontColour) {
    this.subProductCodeFontColour = subProductCodeFontColour;
  }

  // Table
  public getTableFont(): string {
    return this.tableFont;
  }

  public setTableFont(tableFont) {
    this.tableFont = tableFont;
  }

  public getTableFontSize(): number {
    return this.tableFontSize;
  }

  public setTableFontSize(tableFontSize) {
    this.tableFontSize = tableFontSize;
  }

  public getTableHeaderFontSize(): number {
    return this.tableFontSize;
  }

  public setTableHeaderFontSize(tableHeaderFontSize) {
    this.tableFontSize = tableHeaderFontSize;
  }

  public getTableFontColour(): string {
    return this.tableFontColour;
  }

  public setTableFontColour(tableFontColour) {
    this.tableFontColour = tableFontColour;
  }

  public getTableFontStyle(): string {
    return this.tableFontStyle;
  }

  public setTableFontStyle(tableFontStyle) {
    this.tableFontStyle = tableFontStyle;
  }

  public getTableHeaderFontStyle(): string {
    return this.tableHeaderFontStyle;
  }

  public setTableHeaderFontStyle(tableHeaderFontStyle) {
    this.tableHeaderFontStyle = tableHeaderFontStyle;
  }

  public getTableHeaderBackgroundColour(): string {
    return this.tableHeaderBackgroundColour;
  }

  public setTableHeaderBackgroundColour(tableHeaderBackgroundColour) {
    this.tableHeaderBackgroundColour = tableHeaderBackgroundColour;
  }

  public getTableHeaderTextColour(): string {
    return this.tableHeaderTextColour;
  }

  public setTableHeaderTextColour(tableHeaderTextColour) {
    this.tableHeaderTextColour = tableHeaderTextColour;
  }
}
