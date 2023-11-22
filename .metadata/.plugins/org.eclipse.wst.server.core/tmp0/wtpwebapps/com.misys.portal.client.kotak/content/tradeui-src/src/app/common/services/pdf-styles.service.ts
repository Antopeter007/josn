import { PdfConstants } from '../pdfConstants';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PdfStylesService {

  // Header
  public headerFontSize = PdfConstants.MEDIUM_FONT_SIZE;
  public headerFont = PdfConstants.TEXT_FONT;
  public headerFontColour = PdfConstants.COLOR_HEADER_TEXT;

  // Notice Section
  public noticeSectionBorderColour = PdfConstants.COLOR_NOTICE_BORDER;
  public noticeSectionFontSize = PdfConstants.SMALL_FONT_SIZE;
  public noticeSectionFontColour = PdfConstants.COLOR_NOTICE_TEXT;
  public noticeSectionFont = PdfConstants.TEXT_FONT;

  // Left Bar
  public leftBarColour = PdfConstants.COLOR_BORDER;
  public leftBarWidth = PdfConstants.LEFT_BAR_LINE_WIDTH_9;
  public leftBarTextColour = PdfConstants.COLOR_BAR_TEXT;
  public leftBarTextSize = PdfConstants.SMALL_FONT_SIZE;


  // Section Header
  public sectionHeaderFontSize = PdfConstants.LARGE_FONT_SIZE;
  public sectionHeaderFont = PdfConstants.HEADER_LABEL_FONT;
  public sectionHeaderFontStyle = PdfConstants.FONT_STYLE_BOLD;
  public sectionHeaderFontColour = PdfConstants.COLOR_SECTION_HEADER_TEXT;
  public sectionHeaderBorderColour = PdfConstants.COLOR_SECTION_HEADER_LINE;

  // Sub - Section Header

  public subSectionHeaderBorderColour = PdfConstants.COLOR_SUB_SECTION_HEADER_LINE;
  public subSectionHeaderFontSize = PdfConstants.MEDIUM_FONT_SIZE;
  public subSectionHeaderFont = PdfConstants.HEADER_LABEL_FONT;
  public subSectionHeaderFontStyle = PdfConstants.FONT_STYLE_BOLD;
  public subSectionHeaderFontColour = PdfConstants.COLOR_SUB_SECTION_LABEL_TEXT;

  // Section Label
  public sectionLabelFontSize;
  public sectionLabelFont = PdfConstants.HEADER_LABEL_FONT;
  public sectionLabelFontColour = PdfConstants.COLOR_SECTION_LABEL_TEXT;
  public sectionLabelFontStyle = PdfConstants.FONT_STYLE_BOLD;

  // Section Content
  public sectionContentFontSize = PdfConstants.SMALL_FONT_SIZE;
  public sectionContentFont = PdfConstants.TEXT_FONT;
  public sectionContentFontColour = PdfConstants.COLOR_SECTION_CONTENT_TEXT;

  // Table
  public tableFontSize =  PdfConstants.MEDIUM_FONT_SIZE;
  public tableFontColour = PdfConstants.COLOR_TABLE_TEXT;
  public tableFontStyle = PdfConstants.FONT_STYLE_NORMAL;

  // Footer
  public footerFontSize = PdfConstants.SMALL_FONT_SIZE;
  public footerFontColour = PdfConstants.COLOR_FOOTER_PAGES_DATE;


  public getHeaderFontSize(): number {
    return this.headerFontSize;
  }

  public setHeaderFontSize(headerFontSize) {
    this.headerFontSize = headerFontSize;
  }

  public getHeaderFont(): string {
    return this.headerFont;
  }

  public setHeaderFont(headerFont) {
    this.headerFont = headerFont;
  }

  public getHeaderFontColour(): string {
    return this.headerFontColour;
  }

  public setHeaderFontColour(headerFontColour) {
    this.headerFontColour = headerFontColour;
  }

  // Notice Section
  public getNoticeSectionBorderColour(): string {
    return this.noticeSectionBorderColour;
  }

  public setNoticeSectionBorderColour(noticeSectionBorderColour) {
    this.noticeSectionBorderColour = noticeSectionBorderColour;
  }
  public getNoticeSectionFontSize(): number {
    return this.noticeSectionFontSize;
  }

  public setNoticeSectionFontSize(noticeSectionFontSize) {
    this.noticeSectionFontSize = noticeSectionFontSize;
  }

  public getNoticeSectionFontColour(): string {
    return this.noticeSectionFontColour;
  }

  public setNoticeSectionFontColour(noticeSectionFontColour) {
    this.noticeSectionFontColour = noticeSectionFontColour;
  }
  public getNoticeSectionFont(): string {
    return this.noticeSectionFont;
  }

  public setNoticeSectionFont(noticeSectionFont) {
    this.noticeSectionFont = noticeSectionFont;
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

  public getLeftBarTextColour(): string {
    return this.leftBarTextColour;
  }

  public setLeftBarTextColour(leftBarTextColour) {
    this.leftBarTextColour = leftBarTextColour;
  }

  public getLeftBarTextSize(): number {
    return this.leftBarTextSize;
  }

  public setLeftBarTextSize(leftBarTextSize) {
    this.leftBarTextSize = leftBarTextSize;
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

  public getSectionHeaderBorderColour(): string {
    return this.sectionHeaderBorderColour;
  }

  public setSectionHeaderBorderColour(sectionHeaderBorderColour) {
    this.sectionHeaderBorderColour = sectionHeaderBorderColour;
  }

 // Sub - Section Header

  public getSubSectionHeaderBorderColour(): string {
    return this.subSectionHeaderBorderColour;
  }

  public setSubSectionHeaderBorderColour(subSectionHeaderBorderColour) {
    this.subSectionHeaderBorderColour = subSectionHeaderBorderColour;
  }

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

  public setSectionContentFontColour(sectionContentFontColour) {
    this.sectionContentFontColour = sectionContentFontColour;
  }

  // Table
  public getTableFontSize(): number {
    return this.tableFontSize;
  }

  public setTableFontSize(tableFontSize) {
    this.tableFontSize = tableFontSize;
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

  // Footer
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

}
