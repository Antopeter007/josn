import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy, HostListener, ElementRef } from '@angular/core';
import { GlobalSearchService } from '../../services/globalsearch.service';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { SpeechRecognitionService } from '../../services/speech-recognition.service';
import { TransactionMappings } from '../../model/TransactionScreenMapping';
import { CommonService } from '../../services/common.service';
import { SessionValidateService } from '../../services/session-validate-service';
import { FccGlobalConstant } from '../../core/fcc-global-constants';
import { FccGlobalConstantService } from '../../core/fcc-global-constant.service';
import * as RecordRTC from 'recordrtc';
import { LazyLoadEvent } from 'primeng';
@Component({
    selector: 'fcc-common-global-search',
    templateUrl: './global-search.component.html',
    styleUrls: ['./global-search.component.scss']
})
export class GlobalSearchComponent implements OnInit, AfterViewInit, OnDestroy {
    suggestedTransaction = `${this.translateService.instant('suggestedTransaction')}`;
    suggestedBen = `${this.translateService.instant('suggestedBen')}`;
    resultFound = `${this.translateService.instant('resultFound')}`;
    resultsFound = `${this.translateService.instant('resultsFound')}`;
    NoresultFound = `${this.translateService.instant('NoresultFound')}`;
    filteredSingle: any = [];
    tnxSearch: any;
    noResult = false;
    searchID = true;
    micIcon = true;
    tnxTypeCodeVal: string;
    inputIDAuto = '';
    finalactionDetails;
    refId = '';
    url = '';
    finalmenu: any;
    // transactionexpression = '^[A-Za-z]{2}[0-9]{2}';
    menuexpression = '^[a-zA-Z_ ->]*$';
    localizationMenu: any[];
    amend: boolean;
    messageToBank: boolean;
    viewDetails: boolean;
    consolidatedView: boolean;
    editDetails: boolean;
    approve: boolean;
    return: boolean;
    transfer: boolean;
    assignment: boolean;
    amendUrl = '';
    messagebankUrl = '';
    consolidateViewUrl = '';
    viewDetailsUrl = '';
    editUrl = '';
    aprroveReturnUrl = '';
    transferAssigneeUrl = '';
    transferAssigneeUrlInitial = 'screen/!?tnxtype=13&referenceid=';
    amendUrlInitial = 'screen/!?tnxtype=03&referenceid=';
    amendUrlEnd = '&option=EXISTING';
    messagebankUrlInitial = 'screen/!?tnxtype=13&referenceid=';
    messagebankUrlEnd = '&option=EXISTING';
    consolidateViewUrlInitial = 'screen/!?productcode=';
    consolidateViewUrlMiddle = '&operation=LIST_INQUIRY&referenceid=';
    consolidateViewUrlEnd = '&option=HISTORY';
    // viewDetailsUrlIntial = '/screen/ReportingPopup?option=FULL&referenceid=';
    viewDetailsUrlEnd = '&productcode=';
    editUrlInitial = 'screen/!?mode=DRAFT';
    editUrlTnxType = '&tnxtype=tnxtypeValue';
    editUrlEnd = '&referenceid=refernceValue';
    editUrlEnd1 = '&tnxid=tnxValue';
    aprroveReturnInitial = 'screen/!?mode=UNSIGNED';
    contextPath: string;
    two = 2;
    four = 4;
    beneficiaryList = false;
    showWarning = false;
    showWarningMsg: string;
    angularProductList;
    @ViewChild('autoComplete') public autoComp: any;
    searchDetails: any[];
    cols: any[];
    searchAction: any[];
    speechData: string;
    transactionDetails = false;
    dir: string;
    defaultSearchResult: any[];
    brands: any[];
    colors: any[];
    rowHover = true;
    mouseOverRow = false;
    storedindex;
    searchFilter: any;
    defaultSearchResultPage = false;
    inputSearchString;
    tnxFilter = 'tnx';
    pageCount = 0;
    searchRow = [];
    searchcols = [];
    tnxData = 'tnx';
    refData = '';
    searchActionItem = [];
    loading: boolean;
    totalSearchCount = -1;
    beneficiaryDetails = false;
    beneficiaryType;
    defaultBeneficiary = false;
    trIndex;
    tnxSearchPatternStore = 'search';
    tnxamount;
    tnxUnit;
    ViewDetails = false;
    Approve = false;
    Return = false;
    ConsolidatedView = false;
    MessageToBank = false;
    Amend = false;
    iconeditDetails = false;
    name = this.translateService.instant('Name');
    abbrevationName = this.translateService.instant('abbrevationName');
    addressLine1 = this.translateService.instant('addressLine1');
    addressLine2 = this.translateService.instant('addressLine2');
    counterpartiesUrl = '/screen/CustomerSystemFeaturesScreen?option=BENEFICIARIES_MAINTENANCE';
    beneMasterUrl = '/screen/CustomerSystemFeaturesScreen?option=BENEFICIARY_MASTER_MAINTENANCE_MC';
    beneDetailsUrl = '';
    voiceSearchFlag = false;
    beneSelected = false;
    bencardDetail = [];
    filtered: any[] = [];
    // Will use this flag for toggeling recording
    recording = false;
    record;
    error;
    CapturedText = '';
    ischrome: any;
    flag = false;
    micChromeToggle = false;
    searchedProductCode: any;
    searchedSubProductCode: any;
    searchedTnxStatusCode: any;
    first = FccGlobalConstant.LENGTH_0;
    rows = FccGlobalConstant.LENGTH_20;
    drowDownFocus = '';
    dropdownOpen = false;
    errorHeader = `${this.translateService.instant('errorTitle')}`;
    counterPartyVar = { field: 'counterpartyName', header: 'counterpartyName', class: 'counterpartyNameID' };
    rowsPerPageOptions = [FccGlobalConstant.LENGTH_10, FccGlobalConstant.LENGTH_20,
       FccGlobalConstant.LENGTH_50, FccGlobalConstant.LENGTH_100];

    @ViewChild('globalSearchTable') set globalSearchTable(ref) {
      this.addAccessibilityControls(ref);
    }
    constructor(protected http: HttpClient,
                protected searchService: GlobalSearchService,
                protected dynamicDialogRef: DynamicDialogRef,
                protected translateService: TranslateService,
                protected router: Router,
                protected speechRecognitionService: SpeechRecognitionService,
                public commonService: CommonService,
                protected sessionValidation: SessionValidateService,
                protected fccGlobalConstantService: FccGlobalConstantService) {
        this.speechData = '';
        this.ischrome = this.myBrowser();
        if (this.ischrome) {
          this.speechRecognitionService.init();
        }
    }

    ngAfterViewInit() {
      this.speechRecognitionService.speechText.subscribe(
        data => {
          if (data) {
            this.setSpeechTranscript(data);
          }
      });
    }
    onFocus(){
      this.drowDownFocus = 'drowDownFocus';
    }
  onFocusout() {
    this.drowDownFocus = '';
    }
    ngOnInit() {
        this.skipLink('searchClose');
        this.angularProductList = this.commonService.getAngularProducts();
        this.searchFilter = [
            { label:  `${this.translateService.instant('Transaction')}`, id: 1, value: 'tnx' },
            { label: `${this.translateService.instant('beneficiary')}` , id: 2, value: 'beneficiary' },
            { label: `${this.translateService.instant('menu')}`, id: 3, value: 'menu' },
            { label: `${this.translateService.instant('boRefId')}`, id: 4, value: 'boRefId' }
        ];
        if (this.searchService.menufilter.length === 0) {
          this.searchService.getMenuSearch();
        }
        this.contextPath = this.commonService.getContextPath();

        this.cols = [
            { field: 'tnxTypeCode', header: '', class: 'tnxTypeCodeID' },
            { field: 'refId', header: 'Reference', class: 'refID' },
            { field: 'boRefId', header: 'bankReference', class: 'boRefId' },
            { field: 'amount', header: 'Amount', class: 'tnxAmountID' },
            { field: 'status', header: 'Status', class: 'statusID' }
        ];
        this.dir = localStorage.getItem('langDir');
        this.showWarningMsg = `${this.translateService.instant('showWarningMsg')}`;
        // Load the permissions if not available
        this.commonService.getUserPermission('').subscribe(() => {
          //eslint : no-empty-function
        });
    }

    ngOnDestroy(): void {
      this.searchedProductCode = null;
      this.searchedSubProductCode = null;
      this.searchedTnxStatusCode = null;
    }

    filterSingle(event) {
        this.searchID = true;
        this.transactionDetails = false;
        this.beneficiaryList = false;
        this.beneficiaryDetails = false;
        this.defaultSearchResultPage = false;
        const query = event.query;
        this.showWarning = (query === undefined || query.length === 0) ? true : false;
        if (this.tnxFilter === 'tnx' || this.tnxFilter === 'beneficiary' || this.tnxFilter === 'boRefId') {
            this.searchService.getsearchresult(this.tnxFilter === 'boRefId' ? query : encodeURIComponent(query), this.tnxFilter)
            .then(searchResult => {
                if (searchResult.error !== undefined && searchResult.error.message === 'SESSION_INVALID') {
                    this.onDialogClose();
                    this.sessionValidation.IsSessionValid();
                } else {
                    this.filteredSingle = this.filter(query, searchResult);
                }
            });
        }

        // if (this.tnxFilter === 'beneficiary') {
        //     this.searchService.getBenSearchDetails(query, this.tnxFilter).then(searchResult => {
        //         if (searchResult.error !== undefined && searchResult.error.message === 'SESSION_INVALID') {
        //             this.onDialogClose();
        //             this.sessionValidation.IsSessionValid();
        //         } else {
        //             this.filteredSingle = this.filter(query, searchResult);
        //         }
        //     });
        // }

        if (this.tnxFilter === 'menu') {
            this.filteredSingle = this.filter(query, this.searchService.menufilter);
        }
    }

    setSpeechTranscript(data) {
      this.CapturedText = data;
      this.speechData = data; //  instead of two variables, use either speechdata or captured text across whole component and template
      this.autoComp.inputFieldValue = this.CapturedText;
      this.autoComp.search(new Event('input'), this.CapturedText);
      this.autoComp.focusInput();
    }


    filter(query: string, searchResult: any[]): any[] {
        this.filtered = [];
        if (this.tnxFilter !== 'menu') {

                for (let i = 0; i < searchResult.length; i++) {
                    if ( searchResult.length > 0) {
                    if (this.filtered.length < 1) {
                        if (this.tnxFilter === 'beneficiary') {
                            searchResult[i].beneficiary_name = this.commonService.decodeHtml(searchResult[i].beneficiary_name);
                            searchResult[i].beneficiary_abbv_name = this.commonService.decodeHtml(searchResult[i].beneficiary_abbv_name);
                            searchResult[i].referenceId = this.commonService.decodeHtml(searchResult[i].referenceId);
                            searchResult[i].address_line_1 = this.commonService.decodeHtml(searchResult[i].address_line_1);
                            searchResult[i].address_line_2 = this.commonService.decodeHtml(searchResult[i].address_line_2);
                        }
                        this.filtered.push(searchResult[i]);
                    } else {
                        this.filtered.forEach(element => {
                            if (!this.filtered.indexOf(element)) {
                              if (this.tnxFilter === 'beneficiary') {
                                searchResult[i].beneficiary_name = this.commonService.decodeHtml(searchResult[i].beneficiary_name);
                                searchResult[i].beneficiary_abbv_name = this.commonService.decodeHtml(
                                  searchResult[i].beneficiary_abbv_name);
                                searchResult[i].referenceId = this.commonService.decodeHtml(searchResult[i].referenceId);
                                searchResult[i].address_line_1 = this.commonService.decodeHtml(searchResult[i].address_line_1);
                                searchResult[i].address_line_2 = this.commonService.decodeHtml(searchResult[i].address_line_2);
                              }
                              this.filtered.push(searchResult[i]);
                            }
                        });
                    }
                    }
                  }

        }
        this.filtersub(query, searchResult);
        return [...new Set(this.filtered)];
    }

  filtersub(query, searchResult) {
      for (let i = 0; i < searchResult.length; i++) {
        const menu = searchResult[i];
        const re = /-> /gi;
        const menu1 = menu.referenceId.replace(re, '');
        if (menu1.toLowerCase().indexOf(query.toLowerCase()) > -1) {
          this.filtered.push(menu);
        }
      }
  }

    filterSelect() {
      this.dropdownOpen = false;
      this.beneficiaryDetails = false;
      this.inputSearchString = '';
      this.transactionDetails = false;
      this.defaultSearchResultPage = false;
      this.beneficiaryList = false;
      this.showWarning = false;
    }

    onDialogClose() {
        this.dynamicDialogRef.close();
    }


    benDetails(name) {
        this.inputSearchString = name;
        this.doOnSelect(name);
    }

    doOnSelect(event) {
        this.cols = this.getDefaultColDtls();
        this.viewDetails = false;
        this.consolidatedView = false;
        this.amend = false;
        this.messageToBank = false;
        this.editDetails = false;
        this.approve = false;
        this.return = false;
        this.refId = event.referenceId;
        this.beneficiaryType = 'cash';
        this.url = event.url;
        this.beneficiaryList = false;
        this.searchID = false;
        this.searchedProductCode = null;
        this.searchedSubProductCode = null;
        this.searchedTnxStatusCode = null;
        if (this.tnxFilter === 'tnx') {
        this.searchService.getsearchDetailresult(this.refId).then(data => {
            if (data.error !== undefined && data.error.message === 'SESSION_INVALID') {
                this.onDialogClose();
                this.sessionValidation.IsSessionValid();
            } else {
              this.searchDetails = data;
              this.searchDetails = this.searchDetails.map(ele => {
                if ( ele.counterpartyName !== null && ele.counterpartyName !== undefined && ele.counterpartyName.length > 0 ) {
                  this.cols.splice(1, 0, this.counterPartyVar);
                }
                return { ...ele, boRefId: this.commonService.decodeHtml(ele.boRefId) };
              });
              this.searchDetails[0].counterpartyName = this.commonService.decodeHtml(this.searchDetails[0].counterpartyName);
              if (this.inputSearchString !== '') {
                this.transactionDetails = true;
                this.searchedProductCode = data[0].productCode;
                this.searchedSubProductCode = data[0].subProductCode;
                this.searchedTnxStatusCode = data[0].tnxStatCode;
                this.getActionDetails(this.searchDetails);
                }
            }
        });
        }

        if (this.tnxFilter === 'boRefId') {
          this.searchService.getBoRefIdsearchDetailresult(this.refId,this.tnxFilter).then(data => {
            if (data.error !== undefined && data.error.message === 'SESSION_INVALID') {
                this.onDialogClose();
                this.sessionValidation.IsSessionValid();
            } else {
              this.searchDetails = data;
              this.searchDetails = this.searchDetails.map(ele => {
                if ( ele.counterpartyName !== null && ele.counterpartyName !== undefined && ele.counterpartyName.length > 0 ) {
                  this.cols.splice(1, 0, this.counterPartyVar);
                }
              return { ...ele, boRefId: this.commonService.decodeHtml(ele.boRefId) };
              });
              this.searchDetails[0].counterpartyName = this.commonService.decodeHtml(this.searchDetails[0].counterpartyName);
              if (this.inputSearchString !== '') {
                this.transactionDetails = true;
                this.searchedProductCode = data[0].productCode;
                this.searchedSubProductCode = data[0].subProductCode;
                this.searchedTnxStatusCode = data[0].tnxStatCode;
                this.getActionDetails(this.searchDetails);
                }
              }
            });
          }

        if (this.tnxFilter === 'beneficiary') {
            this.beneSelected = true;
            this.searchService.getBenSearchDetails(encodeURIComponent(this.refId), this.beneficiaryType).then(data => {

                if (data.error !== undefined && data.error.message === 'SESSION_INVALID') {
                    this.onDialogClose();
                    this.sessionValidation.IsSessionValid();
                } else {
                this.searchDetails = data;
                if (this.inputSearchString !== '') {
                    this.beneficiaryDetails = true;
                    this.bencardDetail = data;
                    this.searchcols = [];
                    this.searchRow = [];
                    this.rows = FccGlobalConstant.LENGTH_20;
                    this.defaultSearchResultPage = true;
                    this.getActionDetails(this.searchDetails);
                    this.getSearchResult(this.commonService.decodeHtml(data[0].beneficiary_name),
                     'beneficiary' , this.pageCount, this.rows);
                    }
                }
            });
        } else if (this.tnxFilter === 'menu' ) {
            this.router.navigate([]).then(() => { window.open(this.url, '_self'); });
            this.onDialogClose();
          }
    }

    viewDetailsmethod() {
      this.commonService.getSwiftVersionValue();
      if (!this.isAngularProductURL(this.searchDetails[0].productCode, this.searchDetails[0].subProductCode) ||
      ((this.commonService.swiftVersion < FccGlobalConstant.SWIFT_2021 &&
        (this.searchDetails[0].productCode === FccGlobalConstant.PRODUCT_BG ||
          this.searchDetails[0].productCode === FccGlobalConstant.PRODUCT_BR)))) {
        this.viewDetailsUrl = '';
        if (this.contextPath !== null && this.contextPath !== '') {
            this.viewDetailsUrl = this.contextPath;
        }
        this.getViewURL('FULL', this.searchDetails[0].productCode, this.searchDetails[0].refId,
             this.searchDetails[0].tnxId, '', '', '', '');
      } else {
        const url = this.router.serializeUrl(
          this.router.createUrlTree(['view'], { queryParams: {
            referenceid: this.searchDetails[0].refId,
            tnxid: this.searchDetails[0].tnxId,
            productCode: this.searchDetails[0].productCode,
            subProductCode: this.searchDetails[0].subProductCode,
            tnxTypeCode: this.searchDetails[0].tnxTypeCode,
            eventTnxStatCode: this.searchDetails[0].tnxStatCode,
            subTnxTypeCode: this.searchDetails[0].subTnxTypeCode,
            mode: FccGlobalConstant.VIEW_MODE,
            operation: FccGlobalConstant.PREVIEW }
          })
        );
        const popup = window.open(window.origin + this.fccGlobalConstantService.contextPath + this.fccGlobalConstantService.servletName
          + '#/' + url, '_blank', 'top=100,left=200,height=400,width=900,toolbar=no,resizable=no');
        if (this.searchDetails[0].subProductCode === FccGlobalConstant.SUB_PRODUCT_LNCDS){
          popup.onload = () => {
            popup.document.title =
            `${this.translateService.instant(this.searchDetails[0].subProductCode)}`.concat('-').concat(this.searchDetails[0].refId);
            };
        }else{
          popup.onload = () => {
            popup.document.title =
            `${this.translateService.instant(this.searchDetails[0].productCode)}`.concat('-').concat(this.searchDetails[0].refId);
            };
        }
      }
    }

    viewDetailsmethodList(rowData) {
      this.commonService.getSwiftVersionValue();
      if (!this.isAngularProductURL(rowData.product_code_val, rowData.sub_product_code_val) ||
      ((this.commonService.swiftVersion < FccGlobalConstant.SWIFT_2021 &&
        (rowData.product_code_val === FccGlobalConstant.PRODUCT_BG || rowData.product_code_val === FccGlobalConstant.PRODUCT_BR)))) {
        this.viewDetailsUrl = '';
        const productCode = rowData.ref_id.substring(0, this.two);
        if (this.contextPath !== null && this.contextPath !== '') {
            this.viewDetailsUrl = this.contextPath;
        }
        this.getViewURL('FULL', productCode, rowData.ref_id,
        rowData.tnx_id, '', '', '', '');
      } else {
        const url = this.router.serializeUrl(
          this.router.createUrlTree([FccGlobalConstant.VIEW_SCREEN], { queryParams: {
            referenceid: rowData.ref_id,
            tnxid: rowData.tnx_id,
            productCode: rowData.product_code_val,
            subProductCode: rowData.sub_product_code_val,
            tnxTypeCode: rowData.tnx_type_code_val,
            eventTnxStatCode: rowData.tnx_stat_code_val,
            subTnxTypeCode: rowData.sub_tnx_type_code_val,
            mode: FccGlobalConstant.VIEW_MODE,
            operation: FccGlobalConstant.PREVIEW }
          })
        );
        const popup = window.open(window.origin + this.fccGlobalConstantService.contextPath + this.fccGlobalConstantService.servletName
          + '#/' + url, '_blank', 'top=100,left=200,height=400,width=900,toolbar=no,resizable=no');
        if (rowData.sub_product_code_val === FccGlobalConstant.SUB_PRODUCT_LNCDS){
            popup.onload = () => {
              popup.document.title = `${this.translateService.instant(rowData.sub_product_code_val)}`.concat('-').concat(rowData.ref_id);
              };
          }else{
            popup.onload = () => {
              popup.document.title = `${this.translateService.instant(rowData.product_code)}`.concat('-').concat(rowData.ref_id);
              };
          }
      }
    }


    consolidatedMethodlist(rowData) {
      this.commonService.getSwiftVersionValue();
      if (!this.commonService.isAngularProductUrl(rowData.product_code_val, rowData.sub_product_code_val) ||
      ((this.commonService.swiftVersion < FccGlobalConstant.SWIFT_2021 &&
        (rowData.product_code_val === FccGlobalConstant.PRODUCT_BG || rowData.product_code_val === FccGlobalConstant.PRODUCT_BR)))) {
        this.consolidateViewUrl = '';
        const productCode = rowData.ref_id.substring(0, this.two);
        if (this.contextPath !== null && this.contextPath !== '') {
            this.consolidateViewUrl = this.contextPath;
        }
        this.consolidateViewUrl += this.fccGlobalConstantService.servletName.concat('/')
        .concat(this.consolidateViewUrlInitial.replace('!', rowData.screen))
        .concat(productCode).concat(this.consolidateViewUrlMiddle).concat(rowData.ref_id).concat(this.consolidateViewUrlEnd);
        this.router.navigate([]).then(() => { window.open(this.consolidateViewUrl, '_self'); });
      } else {

        const isAngularUrl = this.fccGlobalConstantService.servletName &&
        window.location.pathname + '#' === (this.fccGlobalConstantService.contextPath + this.fccGlobalConstantService.servletName) + '#';
        if (!isAngularUrl) {
          const url = this.router.serializeUrl(
            this.router.createUrlTree([FccGlobalConstant.REVIEW_SCREEN], { queryParams: {
              referenceid: rowData.ref_id,
              tnxid: rowData.tnx_id,
              productCode: rowData.product_code_val,
              subProductCode: rowData.sub_product_code_val,
              mode: FccGlobalConstant.VIEW_MODE,
              operation: FccGlobalConstant.LIST_INQUIRY
            }
            })
          );
          window.open(
            `${window.origin}${this.fccGlobalConstantService.contextPath}${this.fccGlobalConstantService.servletName}#/${url}`, '_self');
        } else {
          this.buildViewUrl(rowData, FccGlobalConstant.REVIEW_SCREEN, FccGlobalConstant.VIEW_MODE, FccGlobalConstant.LIST_INQUIRY);
        }
      }

    }

  private buildViewUrl(rowData: any, routeUrl, modeOrOption: string, operationValue: string) {
    this.router.navigate([routeUrl], {
      queryParams: {
        referenceid: rowData.ref_id,
        tnxid: rowData.tnx_id,
        productCode: rowData.product_code_val,
        subProductCode: rowData.sub_product_code_val,
        mode: modeOrOption,
        operation: operationValue
      }
    });
    this.onDialogClose();
  }

    consolidatedMethod() {
      this.commonService.getSwiftVersionValue();
      if (!this.isAngularProductURL(this.searchDetails[0].productCode, this.searchDetails[0].subProductCode) ||
      ((this.commonService.swiftVersion < FccGlobalConstant.SWIFT_2021 &&
        (this.searchDetails[0].productCode === FccGlobalConstant.PRODUCT_BG ||
          this.searchDetails[0].productCode === FccGlobalConstant.PRODUCT_BR)))) {
        this.consolidateViewUrl = '';
        const productCode = this.refId.substring(0, this.two);
        if (this.contextPath !== null && this.contextPath !== '') {
            this.consolidateViewUrl = this.contextPath;
        }
        this.consolidateViewUrl += this.fccGlobalConstantService.servletName.concat('/')
        .concat(this.consolidateViewUrlInitial.replace('!', this.searchDetails[0].screen))
        .concat(productCode).concat(this.consolidateViewUrlMiddle).concat(this.refId).concat(this.consolidateViewUrlEnd);
        this.router.navigate([]).then(() => { window.open(this.consolidateViewUrl, '_self'); });
      } else {
        const isAngularUrl = this.fccGlobalConstantService.servletName &&
        window.location.pathname + '#' === (this.fccGlobalConstantService.contextPath + this.fccGlobalConstantService.servletName) + '#';
        if (!isAngularUrl) {
          const url = this.router.serializeUrl(
            this.router.createUrlTree([FccGlobalConstant.REVIEW_SCREEN], { queryParams: {
              referenceid: this.searchDetails[0].refId,
              tnxid: this.searchDetails[0].tnxId,
              productCode: this.searchDetails[0].productCode,
              subProductCode: this.searchDetails[0].subProductCode,
              mode: FccGlobalConstant.VIEW_MODE,
              operation: FccGlobalConstant.LIST_INQUIRY
            }
            })
          );
          window.open(
            `${window.origin}${this.fccGlobalConstantService.contextPath}${this.fccGlobalConstantService.servletName}#/${url}`, '_self');
        } else {
          this.router.navigate([FccGlobalConstant.REVIEW_SCREEN], {
            queryParams: {
              referenceid: this.searchDetails[0].refId,
              tnxid: this.searchDetails[0].tnxId,
              productCode: this.searchDetails[0].productCode,
              subProductCode: this.searchDetails[0].subProductCode,
              mode: FccGlobalConstant.VIEW_MODE,
              operation: FccGlobalConstant.LIST_INQUIRY
            }
          });
        }
      }
      this.onDialogClose();
    }

    amendmentMethodList(rowData) {
      this.commonService.getSwiftVersionValue();
      if (!this.commonService.isAngularProductUrl(rowData.product_code_val, rowData.sub_product_code_val) ||
      ((this.commonService.swiftVersion < FccGlobalConstant.SWIFT_2021 &&
        (rowData.product_code_val === FccGlobalConstant.PRODUCT_BG || rowData.product_code_val === FccGlobalConstant.PRODUCT_BR)))) {
        this.amendUrl = '';
        if (this.contextPath !== null && this.contextPath !== '') {
            this.amendUrl = this.contextPath;
        }
        this.amendUrl += this.fccGlobalConstantService.servletName.concat('/')
        .concat(this.amendUrlInitial.replace('!', rowData.screen)).concat(rowData.ref_id).concat(this.amendUrlEnd);
        this.router.navigate([]).then(() => { window.open(this.amendUrl, '_self'); });
      } else {
        const isAngularUrl = this.fccGlobalConstantService.servletName &&
        window.location.pathname + '#' === (this.fccGlobalConstantService.contextPath + this.fccGlobalConstantService.servletName) + '#';
        if (!isAngularUrl) {
          const url = this.router.serializeUrl(
            this.router.createUrlTree([FccGlobalConstant.PRODUCT_SCREEN], { queryParams: {
              refId: rowData.ref_id,
              productCode: rowData.product_code_val, subProductCode: rowData.sub_product_code_val,
              tnxTypeCode: FccGlobalConstant.N002_AMEND, mode: FccGlobalConstant.EXISTING_OPTION
            }
            })
          );
          window.open(
            `${window.origin}${this.fccGlobalConstantService.contextPath}${this.fccGlobalConstantService.servletName}#/${url}`, '_self');
        } else {
          this.router.navigate([FccGlobalConstant.PRODUCT_SCREEN], {
            queryParams: {
              refId: rowData.ref_id,
              productCode: rowData.product_code_val, subProductCode: rowData.sub_product_code_val,
              tnxTypeCode: FccGlobalConstant.N002_AMEND, mode: FccGlobalConstant.EXISTING_OPTION
            }
          });
        }
      }
      this.onDialogClose();
    }


    amendmentMethod() {
      this.commonService.getSwiftVersionValue();
      if (!this.commonService.isAngularProductUrl(this.searchDetails[0].productCode, this.searchDetails[0].subProductCode) ||
      ((this.commonService.swiftVersion < FccGlobalConstant.SWIFT_2021 &&
        (this.searchDetails[0].productCode === FccGlobalConstant.PRODUCT_BG ||
          this.searchDetails[0].productCode === FccGlobalConstant.PRODUCT_BR)))) {
        this.amendUrl = '';
        if (this.contextPath !== null && this.contextPath !== '') {
            this.amendUrl = this.contextPath;
        }
        this.amendUrl += this.fccGlobalConstantService.servletName.concat('/')
        .concat(this.amendUrlInitial.replace('!', this.searchDetails[0].screen)).concat(this.refId).concat(this.amendUrlEnd);
        this.router.navigate([]).then(() => { window.open(this.amendUrl, '_self'); });
      } else {

        const isAngularUrl = this.fccGlobalConstantService.servletName &&
        window.location.pathname + '#' === (this.fccGlobalConstantService.contextPath + this.fccGlobalConstantService.servletName) + '#';
        if (!isAngularUrl) {
          const url = this.router.serializeUrl(
            this.router.createUrlTree([FccGlobalConstant.PRODUCT_SCREEN], { queryParams: {
              refId: this.searchDetails[0].refId,
              productCode: this.searchDetails[0].productCode, subProductCode: this.searchDetails[0].subProductCode,
              tnxTypeCode: FccGlobalConstant.N002_AMEND, mode: FccGlobalConstant.EXISTING_OPTION
            }
            })
          );
          window.open(
            `${window.origin}${this.fccGlobalConstantService.contextPath}${this.fccGlobalConstantService.servletName}#/${url}`, '_self');
        } else {
          this.router.navigate([FccGlobalConstant.PRODUCT_SCREEN], {
            queryParams: {
              refId: this.searchDetails[0].refId,
              productCode: this.searchDetails[0].productCode, subProductCode: this.searchDetails[0].subProductCode,
              tnxTypeCode: FccGlobalConstant.N002_AMEND, mode: FccGlobalConstant.EXISTING_OPTION
            }
          });
        }
      }
      this.onDialogClose();
    }

    messageBankmethodList(rowData) {
      this.commonService.getSwiftVersionValue();
      if (!this.commonService.isAngularProductUrl(rowData.product_code_val, rowData.sub_product_code_val) ||
      ((this.commonService.swiftVersion < FccGlobalConstant.SWIFT_2021 &&
        (rowData.product_code_val === FccGlobalConstant.PRODUCT_BG ||
          rowData.product_code_val === FccGlobalConstant.PRODUCT_BR)))) {
        this.messagebankUrl = '';
        if (this.contextPath !== null && this.contextPath !== '') {
            this.messagebankUrl = this.contextPath;
        }
        this.messagebankUrl += this.fccGlobalConstantService.servletName + '/'
        + this.messagebankUrlInitial.replace('!', rowData.screen)
         + rowData.ref_id + this.messagebankUrlEnd;
        this.router.navigate([]).then(() => { window.open(this.messagebankUrl, '_self'); });
      } else {
        const isAngularUrl = this.fccGlobalConstantService.servletName &&
        window.location.pathname + '#' === (this.fccGlobalConstantService.contextPath + this.fccGlobalConstantService.servletName) + '#';
        if (!isAngularUrl) {
          const url = this.router.serializeUrl(
            this.router.createUrlTree([FccGlobalConstant.PRODUCT_SCREEN], { queryParams: {
              refId: rowData.ref_id,
              productCode: rowData.product_code_val,
              subProductCode: rowData.sub_product_code_val,
              tnxTypeCode: FccGlobalConstant.N002_INQUIRE,
              option: FccGlobalConstant.EXISTING_OPTION,
              subTnxTypeCode: FccGlobalConstant.N003_CORRESPONDENCE }
            })
          );
          window.open(
            `${window.origin}${this.fccGlobalConstantService.contextPath}${this.fccGlobalConstantService.servletName}#/${url}`, '_self');
        } else {
          this.router.navigate([FccGlobalConstant.PRODUCT_SCREEN], {
            queryParams: {
              refId: rowData.ref_id,
              productCode: rowData.product_code_val,
              subProductCode: rowData.sub_product_code_val,
              tnxTypeCode: FccGlobalConstant.N002_INQUIRE,
              option: FccGlobalConstant.EXISTING_OPTION,
              subTnxTypeCode: FccGlobalConstant.N003_CORRESPONDENCE
            }
          });
        }
      }
      this.onDialogClose();

    }

    messageBankmethod() {
      this.commonService.getSwiftVersionValue();
      if (!this.commonService.isAngularProductUrl(this.searchDetails[0].productCode, this.searchDetails[0].subProductCode) ||
      ((this.commonService.swiftVersion < FccGlobalConstant.SWIFT_2021 &&
        (this.searchDetails[0].productCode === FccGlobalConstant.PRODUCT_BG ||
          this.searchDetails[0].productCode === FccGlobalConstant.PRODUCT_BR)))) {
        this.messagebankUrl = '';
        if (this.contextPath !== null && this.contextPath !== '') {
          this.messagebankUrl = this.contextPath;
        }
        this.messagebankUrl += this.fccGlobalConstantService.servletName + '/'
        + this.messagebankUrlInitial.replace('!', this.searchDetails[0].screen)
        + this.refId + this.messagebankUrlEnd;
        this.router.navigate([]).then(() => { window.open(this.messagebankUrl, '_self'); });
      } else {
        const isAngularUrl = this.fccGlobalConstantService.servletName &&
        window.location.pathname + '#' === (this.fccGlobalConstantService.contextPath + this.fccGlobalConstantService.servletName) + '#';
        if (!isAngularUrl) {
          const url = this.router.serializeUrl(
            this.router.createUrlTree([FccGlobalConstant.PRODUCT_SCREEN], { queryParams: {
              refId: this.searchDetails[0].refId,
              productCode: this.searchDetails[0].productCode,
              subProductCode: this.searchDetails[0].subProductCode,
              tnxTypeCode: FccGlobalConstant.N002_INQUIRE,
              option: FccGlobalConstant.EXISTING_OPTION,
              subTnxTypeCode: FccGlobalConstant.N003_CORRESPONDENCE }
            })
          );
          window.open(
            `${window.origin}${this.fccGlobalConstantService.contextPath}${this.fccGlobalConstantService.servletName}#/${url}`, '_self');
        } else {
          this.router.navigate([FccGlobalConstant.PRODUCT_SCREEN], {
            queryParams: {
              refId: this.searchDetails[0].refId,
              productCode: this.searchDetails[0].productCode,
              subProductCode: this.searchDetails[0].subProductCode,
              tnxTypeCode: FccGlobalConstant.N002_INQUIRE,
              option: FccGlobalConstant.EXISTING_OPTION,
              subTnxTypeCode: FccGlobalConstant.N003_CORRESPONDENCE
            }
          });
        }
      }
      this.onDialogClose();
  }

  editDetailsmethodList(rowData) {
    this.commonService.getSwiftVersionValue();
    if (!this.commonService.isAngularProductUrl(rowData.product_code_val, rowData.sub_product_code_val) ||
    ((this.commonService.swiftVersion < FccGlobalConstant.SWIFT_2021 &&
      (rowData.product_code_val === FccGlobalConstant.PRODUCT_BG || rowData.product_code_val === FccGlobalConstant.PRODUCT_BR)))) {
      this.editUrl = '';
      if (this.contextPath !== null && this.contextPath !== '') {
        this.editUrl = this.contextPath;
      }
      this.editUrl += this.fccGlobalConstantService.servletName.concat('/')
        .concat(this.editUrlInitial.replace('!', rowData.screen));
      this.editUrl += this.editUrlTnxType.replace('tnxtypeValue', rowData.tnx_type_code_val);
      this.editUrl += this.editUrlEnd.replace('refernceValue', rowData.ref_id);
      this.editUrl += this.editUrlEnd1.replace('tnxValue', rowData.tnx_id);
      this.router.navigate([]).then(() => { window.open(this.editUrl, '_self'); });
    } else {
      const isAngularUrl = this.fccGlobalConstantService.servletName &&
      window.location.pathname + '#' === (this.fccGlobalConstantService.contextPath + this.fccGlobalConstantService.servletName) + '#';
      if (!isAngularUrl) {
        const url = this.router.serializeUrl(
          this.router.createUrlTree([FccGlobalConstant.PRODUCT_SCREEN], { queryParams: {
            refId: rowData.ref_id,
            tnxId: rowData.tnx_id,
            productCode: rowData.product_code_val, subProductCode: rowData.sub_product_code_val,
            tnxTypeCode: rowData.tnx_type_code_val, mode: FccGlobalConstant.DRAFT_OPTION
          }
          })
        );
        window.open(
          `${window.origin}${this.fccGlobalConstantService.contextPath}${this.fccGlobalConstantService.servletName}#/${url}`, '_self');
      } else {
        this.router.navigate([FccGlobalConstant.PRODUCT_SCREEN], {
          queryParams: {
            refId: rowData.ref_id,
            tnxId: rowData.tnx_id,
            productCode: rowData.product_code_val, subProductCode: rowData.sub_product_code_val,
            tnxTypeCode: rowData.tnx_type_code_val, mode: FccGlobalConstant.DRAFT_OPTION
          }
        });
      }
    }
    this.onDialogClose();
  }

  editDetailsmethod() {
    this.commonService.getSwiftVersionValue();
    if (!this.commonService.isAngularProductUrl(this.searchDetails[0].productCode, this.searchDetails[0].subProductCode) ||
    ((this.commonService.swiftVersion < FccGlobalConstant.SWIFT_2021 &&
      (this.searchDetails[0].productCode === FccGlobalConstant.PRODUCT_BG ||
        this.searchDetails[0].productCode === FccGlobalConstant.PRODUCT_BR)))) {
      this.editUrl = '';
      if (this.contextPath !== null && this.contextPath !== '') {
        this.editUrl = this.contextPath;
      }
      this.editUrl += this.fccGlobalConstantService.servletName.concat('/')
      .concat(this.editUrlInitial.replace('!', this.searchDetails[0].screen));
      this.editUrl += this.editUrlTnxType.replace('tnxtypeValue', this.searchDetails[0].tnxTypeCode);
      this.editUrl += this.editUrlEnd.replace('refernceValue', this.refId);
      this.editUrl += this.editUrlEnd1.replace('tnxValue', this.searchDetails[0].tnxId);
      this.router.navigate([]).then(() => { window.open(this.editUrl, '_self'); });
    } else {
      const isAngularUrl = this.fccGlobalConstantService.servletName &&
      window.location.pathname + '#' === (this.fccGlobalConstantService.contextPath + this.fccGlobalConstantService.servletName) + '#';
      if (!isAngularUrl) {
        const url = this.router.serializeUrl(
          this.router.createUrlTree([FccGlobalConstant.PRODUCT_SCREEN], { queryParams: {
            refId: this.searchDetails[0].refId,
            tnxId: this.searchDetails[0].tnxId,
            productCode: this.searchDetails[0].productCode, subProductCode: this.searchDetails[0].subProductCode,
            tnxTypeCode: this.searchDetails[0].tnxTypeCode, subTnxTypeCode: this.searchDetails[0].subTnxTypeCode,
            mode: FccGlobalConstant.DRAFT_OPTION }
          })
        );
        window.open(
          `${window.origin}${this.fccGlobalConstantService.contextPath}${this.fccGlobalConstantService.servletName}#/${url}`, '_self');
      } else {
        this.router.navigate([FccGlobalConstant.PRODUCT_SCREEN], {
          queryParams: {
            refId: this.searchDetails[0].refId,
            tnxId: this.searchDetails[0].tnxId,
            productCode: this.searchDetails[0].productCode,
            subProductCode: this.searchDetails[0].subProductCode,
            tnxTypeCode: this.searchDetails[0].tnxTypeCode,
            subTnxTypeCode: this.searchDetails[0].subTnxTypeCode,
            mode: FccGlobalConstant.DRAFT_OPTION
          }
        });
      }
    }
    this.onDialogClose();
  }


  approvereturnmethodList(rowData, operationCode?: string) {
    this.commonService.getSwiftVersionValue();
    if (!this.commonService.isAngularProductUrl(rowData.product_code_val, rowData.sub_product_code_val) ||
    ((this.commonService.swiftVersion < FccGlobalConstant.SWIFT_2021 &&
      (rowData.product_code_val === FccGlobalConstant.PRODUCT_BG || rowData.product_code_val === FccGlobalConstant.PRODUCT_BR)))) {
      this.aprroveReturnUrl = '';
      if (this.contextPath !== null && this.contextPath !== '') {
        this.aprroveReturnUrl = this.contextPath;
      }
      this.aprroveReturnUrl += this.fccGlobalConstantService.servletName.concat('/')
      .concat(this.aprroveReturnInitial.replace('!', rowData.screen));
      this.aprroveReturnUrl += this.editUrlTnxType.replace('tnxtypeValue', rowData.tnx_type_code_val);
      this.aprroveReturnUrl += this.editUrlEnd.replace('refernceValue', rowData.ref_id);
      this.aprroveReturnUrl += this.editUrlEnd1.replace('tnxValue', rowData.tnx_id);
      this.router.navigate([]).then(() => { window.open(this.aprroveReturnUrl, '_self'); });
    } else {
      const isAngularUrl = this.fccGlobalConstantService.servletName &&
      window.location.pathname + '#' === (this.fccGlobalConstantService.contextPath + this.fccGlobalConstantService.servletName) + '#';
      if (!isAngularUrl) {
        const url = this.router.serializeUrl(
          this.router.createUrlTree([FccGlobalConstant.REVIEW_SCREEN], { queryParams: {
            productCode: rowData.product_code_val,
            subProductCode: rowData.sub_product_code_val,
            referenceid: rowData.ref_id,
            tnxid: rowData.tnx_id,
            mode: FccGlobalConstant.VIEW_MODE,
            operation: FccGlobalConstant.LIST_INQUIRY,
            action: operationCode
          }
          })
        );
        window.open(
          `${window.origin}${this.fccGlobalConstantService.contextPath}${this.fccGlobalConstantService.servletName}#/${url}`, '_self');
      } else {
        this.router.navigate([FccGlobalConstant.REVIEW_SCREEN], {
          queryParams: {
            productCode: rowData.product_code_val,
            subProductCode: rowData.sub_product_code_val,
            referenceid: rowData.ref_id,
            tnxid: rowData.tnx_id,
            mode: FccGlobalConstant.VIEW_MODE,
            operation: FccGlobalConstant.LIST_INQUIRY,
            action: operationCode
          }
        });
      }

      this.onDialogClose();
    }
  }

  approvereturnmethod(operationCode?: string) {
    this.commonService.getSwiftVersionValue();
    if (!this.commonService.isAngularProductUrl(this.searchDetails[0].productCode, this.searchDetails[0].subProductCode) ||
    ((this.commonService.swiftVersion < FccGlobalConstant.SWIFT_2021 &&
      (this.searchDetails[0].productCode === FccGlobalConstant.PRODUCT_BG ||
        this.searchDetails[0].productCode === FccGlobalConstant.PRODUCT_BR)))) {
      this.aprroveReturnUrl = '';
      if (this.contextPath !== null && this.contextPath !== '') {
        this.aprroveReturnUrl = this.contextPath;
      }
      this.aprroveReturnUrl += this.fccGlobalConstantService.servletName.concat('/')
      .concat(this.aprroveReturnInitial.replace('!', this.searchDetails[0].screen));
      this.editUrl += this.editUrlTnxType.replace('tnxtypeValue', this.searchDetails[0].tnxTypeCode);
      this.aprroveReturnUrl += this.editUrlEnd.replace('refernceValue', this.refId);
      this.aprroveReturnUrl += this.editUrlEnd1.replace('tnxValue', this.searchDetails[0].tnxId);
      this.aprroveReturnUrl += this.editUrl;
      this.router.navigate([]).then(() => { window.open(this.aprroveReturnUrl, '_self'); });
    } else {
      const isAngularUrl = this.fccGlobalConstantService.servletName &&
      window.location.pathname + '#' === (this.fccGlobalConstantService.contextPath + this.fccGlobalConstantService.servletName) + '#';
      if (!isAngularUrl) {
        const url = this.router.serializeUrl(
          this.router.createUrlTree([FccGlobalConstant.REVIEW_SCREEN], {
            queryParams: {
              referenceid: this.searchDetails[0].refId,
              tnxid: this.searchDetails[0].tnxId,
              productCode: this.searchDetails[0].productCode,
              subProductCode: this.searchDetails[0].subProductCode,
              mode: FccGlobalConstant.VIEW_MODE,
              operation: FccGlobalConstant.LIST_INQUIRY,
              action: operationCode
            }
          })
        );
        window.open(
          `${window.origin}${this.fccGlobalConstantService.contextPath}${this.fccGlobalConstantService.servletName}#/${url}`, '_self');
      } else {
        this.router.navigate([FccGlobalConstant.REVIEW_SCREEN], {
          queryParams: {
            referenceid: this.searchDetails[0].refId,
            tnxid: this.searchDetails[0].tnxId,
            productCode: this.searchDetails[0].productCode,
            subProductCode: this.searchDetails[0].subProductCode,
            mode: FccGlobalConstant.VIEW_MODE,
            operation: FccGlobalConstant.LIST_INQUIRY,
            action: operationCode
          }
        });
      }
    }
    this.onDialogClose();
  }

    getScreenName(productCode: string): string {
        let screenName = '';
        screenName = TransactionMappings.mappings[productCode];
        return screenName;
    }

    activateSpeechSearch(): void {
      //eslint : no-empty-function
    }

    getActionDetails(searchDetails: any) {
      let subProduCode = '';

      if(this.commonService.isNonEmptyValue(searchDetails[0].subProductCode)) {
        subProduCode = searchDetails[0].subProductCode;
      }

      this.searchService.getsearchActionresult(this.refId, searchDetails[0].tnxId, subProduCode).then(data => {
        if (data.error !== undefined && data.error.message === 'SESSION_INVALID') {
            this.onDialogClose();
            this.sessionValidation.IsSessionValid();
        } else if (data.length > 0) {
            const actionDetails = data[0].supportedActions;
            this.finalactionDetails = actionDetails.split(',');
           // for (let i = 0; i < this.finalactionDetails.length; i++) {
            this.finalactionDetailsInitialise(this.finalactionDetails);
            // }

    }
    });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getActionDetailsBen(data) {
      //eslint : no-empty-function
    }

 // eslint-disable-next-line @typescript-eslint/no-unused-vars
finalactionDetailsInitialise(status) {
    this.amend = false;
    this.viewDetails = false;
    this.consolidatedView = false;
    this.messageToBank = false;
    this.editDetails = false;
    this.approve = false;
    this.return = false;
    if (this.finalactionDetails.indexOf('amend') > -1) {
        this.amend = true;
    }
    if (this.finalactionDetails.indexOf('viewDetails') > -1) {
        this.viewDetails = true;
    }
    if (this.finalactionDetails.indexOf('consolidatedView') > -1) {
        this.consolidatedView = true;
    }
    if (this.finalactionDetails.indexOf('messageToBank') > -1) {
        this.messageToBank = true;
    }
    if (this.finalactionDetails.indexOf('editDetails') > -1) {
      this.editDetails = true;
  }
    if (this.finalactionDetails.indexOf('approve') > -1) {
    this.approve = true;
}
    if (this.finalactionDetails.indexOf('return') > -1) {
    this.return = true;
}

    if (this.finalactionDetails.indexOf('transfer') > -1) {
      this.transfer = true;
    }

    if (this.finalactionDetails.indexOf('assignment') > -1) {
      this.assignment = true;
    }
    if (this.searchedTnxStatusCode === FccGlobalConstant.N004_UNCONTROLLED && this.searchedProductCode) {
    const approverPermission = this.commonService.getPermissionName(this.searchedProductCode, 'approve', this.searchedSubProductCode);
    this.commonService.getUserPermission(approverPermission).subscribe(result => {
    if (result) {
      this.approve = true;
      this.return = true;
    }
    });
    }

}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
    highlightRow(e, data, i) {
      //eslint : no-empty-function
    }

    actionItemChangeStatus(arr, iconStatus) {
      if (!arr) {
        return false;
      }
      if (arr.indexOf(iconStatus) > -1) {
        return true;
      } else {
        return false;
      }

    }
    disablehighlightRow(i) {
        if (i === undefined || null) {
        this.mouseOverRow = false;
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    loadDataOnScroll(event: LazyLoadEvent) {
        // if (this.totalSearchCount > FccGlobalConstant.defaultTransactionDisplay) {
        //     const calculation = Math.ceil(this.totalSearchCount / FccGlobalConstant.LENGTH_10) * FccGlobalConstant.LENGTH_10;
        //     const count = FccGlobalConstant.defaultTransactionDisplay;
        //     this.pageCount += count;
        //     if (calculation >= this.pageCount) {
        //         if ((typeof(this.inputSearchString)) === 'string' ) {
        //         this.getSearchResult(  this.inputSearchString,
        //         this.tnxFilter, this.pageCount, this.rows);
        //         } else {
        //         this.getSearchResult(  this.inputSearchString.beneficiary_name,
        //         this.tnxFilter, this.pageCount, this.rows);
        //         }
        //     }
        // }
    }

    relatedSearch() {
      this.searchID = false;
      this.totalSearchCount = -1;
      this.showWarning = (this.inputSearchString === undefined || this.inputSearchString.length === 0) ? true : false;
      if (this.inputSearchString !== undefined && this.inputSearchString.length > 0 && (this.tnxFilter === 'tnx'
          || this.tnxFilter === 'boRefId') || this.voiceSearchFlag === true) {
        this.defaultSearchResultPage = true;
        this.searchRow = [];
        this.searchcols = [];
        this.pageCount = 0;
        this.rows = FccGlobalConstant.LENGTH_20;
        if (this.tnxSearchPatternStore === this.inputSearchString) {
          this.tnxSearchPatternStore = this.inputSearchString;
        } else {
          if (this.voiceSearchFlag) {
            this.getSearchResult( this.speechData, this.tnxFilter, this.pageCount, this.rows);
          } else {
            this.getSearchResult( this.inputSearchString, this.tnxFilter, this.pageCount, this.rows);
          }
        }
      }

      if (this.inputSearchString !== undefined && this.inputSearchString.length > 0 && this.tnxFilter === 'beneficiary') {
        this.searchRow = [];
        this.beneficiaryList = true;
        this.searchService.getBenSearchDetails(encodeURIComponent(this.inputSearchString), this.tnxFilter).then(searchResult => {
          if (!searchResult) {
            return false;
          }
          this.totalSearchCount = searchResult.length;
          this.searchRow = searchResult;
        });
      }
      this.voiceSearchFlag = false;
      this.beneSelected = false;
    }

    checkForEnter(event) {
      const keyCode = event.keyCode;
      if (keyCode === FccGlobalConstant.LENGTH_13) {
        this.relatedSearch();
      }
    }

    getSearchResult(searchCrit , searchFilter, pageCount, rows) {
        this.loading = true;
        const displayColumns = ['ref_id', 'tnx_type_code', 'amount', 'status', 'bo_ref_id'];
        this.searchService.getAllTransactions(encodeURIComponent(searchCrit) , searchFilter.trim(), pageCount, rows).then(data => {
            this.searchRow = [];
            this.totalSearchCount = data.count;
            let i;
            let j;
            let index1 = null;
            let index2 = null;
            let tnxProductCode = null;
            let tnxSubProductCode = null;
            for (i = 0; i < data.rowDetails.length; i++) {
              for (j = 0; j < data.rowDetails[i].index.length; j++) {
                if (data.rowDetails[i].index[j].name === 'tnx_stat_code_val' && data.rowDetails[i].index[j].value === '02') {
                  index1 = j;
                } else if (data.rowDetails[i].index[j].name === 'actions') {
                  index2 = j;
                } else if (data.rowDetails[i].index[j].name === 'product_code_val') {
                  tnxProductCode = data.rowDetails[i].index[j].value;
                } else if (data.rowDetails[i].index[j].name === 'sub_product_code_val') {
                  tnxSubProductCode = data.rowDetails[i].index[j].value;
                }
              }
              if (index1 && index2 && tnxProductCode) {
                const approverPermission = this.commonService.getPermissionName(tnxProductCode, 'approve', tnxSubProductCode);
                this.commonService.getUserPermission(approverPermission).subscribe(result => {
                if (result) {
                  data.rowDetails[i].index[index2].value = data.rowDetails[i].index[index2].value.toString() + ',approve,return';
                }
                });
              }
              index1 = null;
              index2 = null;
              tnxProductCode = null;
              tnxSubProductCode = null;
            }
            data.rowDetails.map(x => {
            let fetchObj = {};
            x.index.map(y => {
              const row = { [y.name]: y.value };
              fetchObj = { ...fetchObj, ...row };
            });
            this.searchRow.push(fetchObj);
          });
            if (this.searchcols.length === 0) {
              displayColumns.forEach(x => {
                const b = { field: x };
                this.searchcols.push(b);
              });
            }

            if (this.tnxFilter === 'beneficiary') {
            this.searchcols = [];
            displayColumns.forEach(x => {
              const b = { field: x };
              this.searchcols.push(b);
            });
            }
    }).finally(() => this.loading = false);
}


  addAccessibilityControls(ref: ElementRef): void {
      const uiPaginatorFirstList = Array.from(ref[`el`].nativeElement.getElementsByClassName('ui-paginator-first'));
      const uiPaginatorPreviousList = Array.from(ref[`el`].nativeElement.getElementsByClassName('ui-paginator-prev'));
      const uiPaginatorNextList = Array.from(ref[`el`].nativeElement.getElementsByClassName('ui-paginator-next'));
      const uiPaginatorLastList = Array.from(ref[`el`].nativeElement.getElementsByClassName('ui-paginator-last'));
      const uiPaginatorNumOfRecords = Array.from(ref[`el`].nativeElement.getElementsByClassName('ui-paginator-bottom')[0]
      .getElementsByClassName('ui-dropdown-label-container'));

      uiPaginatorFirstList.forEach(element=> {
        element[FccGlobalConstant.ARIA_LABEL] = this.translateService.instant("goToFirstPage");
        element[FccGlobalConstant.TITLE] = this.translateService.instant("goToFirstPage");
      });

      uiPaginatorPreviousList.forEach(element=> {
        element[FccGlobalConstant.TITLE] = this.translateService.instant("previousPage");
      });

      uiPaginatorNextList.forEach(element=> {
        element[FccGlobalConstant.TITLE] = this.translateService.instant("nextPage");
      });

      uiPaginatorLastList.forEach(element=> {
        element[FccGlobalConstant.TITLE ] = this.translateService.instant("goToLastPage");
      });

      uiPaginatorNumOfRecords.forEach(element=> {
        element[FccGlobalConstant.TITLE ] = this.translateService.instant("rowsPerPage");
      });
  }
  onRowClick(data: any) {
    // const screenName = ScreenMapping.screenmappings[productCode];
    const screenName = '';
    const tnxTypeCode = data.tnxTypeCode;
    const subTnxTypeCode = data.subTnxTypeCode === undefined || data.subTnxTypeCode === '' ? 'null' : data.subTnxTypeCode;
    const referenceId = data.refId;
    const tnxId = data.tnxId;
    const mode = data.tnxStatCode === FccGlobalConstant.N004_UNCONTROLLED ? 'UNSIGNED' : 'DRAFT';
    let url = '';
    if (this.contextPath !== undefined && this.contextPath !== null && this.contextPath !== '') {
      url = this.contextPath;
    }
    url = url + this.fccGlobalConstantService.servletName + '/' +
      'screen/' + screenName + '?mode=' + mode + '&tnxtype=' + tnxTypeCode + '&subtnxtype=' +
      subTnxTypeCode + '&referenceid=' + referenceId + '&tnxid=' + tnxId + '&option=null';
    this.router.navigate([]).then(() => { window.open(url, '_self'); });
  }

  onClick(url: string) {
    this.router.navigate([url]);
  }
    viewBeneDetails(beneData) {
        if (this.contextPath !== null && this.contextPath !== '') {
          this.beneDetailsUrl = this.fccGlobalConstantService.contextPath;
      }
        const servletPath = this.fccGlobalConstantService.servletName;
        if (servletPath !== undefined && servletPath !== null && servletPath !== '') {
        this.beneDetailsUrl += servletPath;
      }
        if (beneData.key === 'GTP_MASTER_ACCOUNT') {
        this.beneDetailsUrl += this.beneMasterUrl;
      } else {
        this.beneDetailsUrl += this.counterpartiesUrl;
      }
        this.router.navigate([]).then(() => { window.open(this.beneDetailsUrl, '_self'); });
      }

    skipLink(targetId: string) {
      const target = document.getElementById(targetId);
      if (target) {
        target.setAttribute('tabindex', '-1');
        target.focus();
        target.setAttribute('tabindex', '0');
      }
    }

    showicon(event) {
        event.target.classList.add('iconvisible');
    }

    hideicon(event) {
        event.target.classList.remove('iconvisible');
    }

    getViewURL(type: string, prodCode: string, refId: string, tnxId: string, tnxTypeCode: string,
               subTnxTypeCode: string, tnxstatus: string, strScreen: string) {
            const prodCodeParam = [];
            const refIdParam = [];
            const tnxIdParam = [];
            let screenParam = 'ReportingPopup';
            const viewUrl = [];
            const tnxTypeCodeParam = [];
            const subTnxTypeCodeParam = [];
            const tnxStatusParam = [];
            if (prodCode && prodCode !== '') {
            prodCodeParam.push('&productcode=', prodCode);
            }

            if (refId && refId !== '') {
            refIdParam.push('&referenceid=', refId);
            }

            if (tnxId && tnxId !== '') {
            tnxIdParam.push('&tnxid=', tnxId);
            }

            if (tnxTypeCode && tnxTypeCode !== '') {
            tnxTypeCodeParam.push('&tnxtype=', tnxTypeCode);
            }

            if (subTnxTypeCode && subTnxTypeCode !== '') {
            subTnxTypeCodeParam.push('&subtnxtype=', subTnxTypeCode);
            }
            if (tnxstatus && tnxstatus !== '') {
            tnxStatusParam.push('&tnxstatus=', tnxstatus);
            }

            if (strScreen && strScreen !== '') {
            screenParam = strScreen;
            }
            viewUrl.push('/screen/', screenParam);
            viewUrl.push('?option=', type);
            viewUrl.push(refIdParam.join(''), tnxIdParam.join(''), prodCodeParam.join(''),
            tnxTypeCodeParam.join(''), subTnxTypeCodeParam.join(''), tnxStatusParam.join(''));
            this.viewDetailsUrl += this.fccGlobalConstantService.servletName + '/' + viewUrl.join('');
            this.router.navigate([]).then(() => { window.open(
              this.viewDetailsUrl,
              "",
              "width=800,height=600,resizable=yes,scrollbars=yes"
            ); });
}
initiateRecording() {

    this.recording = true;
    const mediaConstraints = {
      video: false,
      audio: true
    };
    navigator.mediaDevices
    .getUserMedia(mediaConstraints)
    .then(this.successCallback.bind(this), this.errorCallback.bind(this));
  }

  successCallback(stream) {
    const options = {
    mimeType: 'audio/wav',
    numberOfAudioChannels: 1,
    sampleRate: 48000,
    };
    // Start Actual Recording
    const StereoAudioRecorder = RecordRTC.StereoAudioRecorder;
    this.record = new StereoAudioRecorder(stream, options);
    this.record.record();
  }

  stopRecording() {
    this.recording = false;
    this.record.stop(this.processRecording.bind(this));
  }

  async processRecording(blob) {
    this.url = URL.createObjectURL(blob);
    const toBase64 = file => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
    this.commonService.getSpeechText(await toBase64(blob)).subscribe(data => {
      this.CapturedText = data.textCaptured;
      // eslint-disable-next-line no-console
      console.log(this.CapturedText) ;
      this.speechData = this.CapturedText;
      if (!(this.CapturedText === undefined || this.CapturedText === '' )) {
        this.autoComp.inputFieldValue = this.CapturedText;
        this.autoComp.search(new Event('input'), this.CapturedText);
      }
    });
  }

  errorCallback() {
    this.error = 'Can not play audio in your browser';
  }

  myBrowser() {
    if (navigator.userAgent.indexOf('Chrome') !== -1 &&
    !(navigator.userAgent.indexOf('Edg') !== -1 || navigator.userAgent.indexOf('Edge') !== -1)) {
        return true;
    } else {
        return false;
    }
  }

  start() {
    this.speechData = ''; // reset text
    this.CapturedText = '';
    this.speechRecognitionService.start();
  }

  stop() {
    this.speechRecognitionService.stop();
  }

  onMicClick(): any {
    this.voiceSearchFlag = true;
    // only for Chromium based browsers like chrome, edge etc.
    if (this.ischrome) {
      this.micChromeToggle = !this.micChromeToggle;
      this.micChromeToggle ? this.start() : this.stop() ;
    } else {
      // for other browsers
      this.flag = !this.flag;
      if (this.flag === true) {
        this.initiateRecording();
      } else {
        this.stopRecording();
      }
    }
    this.voiceSearchFlag = false;
  }

  onpaginate(event) {
    if (this.rows !== event.rows) {
      this.rows = event.rows;
    }
    this.pageCount = Math.ceil(event.first / FccGlobalConstant.LENGTH_100 * FccGlobalConstant.LENGTH_10);
    if ((typeof(this.inputSearchString)) === 'string' ) {
      this.getSearchResult( this.inputSearchString,
      this.tnxFilter, this.pageCount, this.rows);
    } else {
      this.getSearchResult( this.inputSearchString.beneficiary_name,
      this.tnxFilter, this.pageCount, this.rows);
    }
  }

  transferAssignmentMethod(actionCode: string, rowData?: any) {
    this.commonService.getSwiftVersionValue();
    let productCode;
    let subProductCode;
    let screen;
    let refId;
    const tnxTypeCode = FccGlobalConstant.N002_INQUIRE;
    if (rowData !== undefined && rowData !== '' && rowData !== null) {
      productCode = rowData.product_code_val;
      subProductCode = rowData.sub_product_code_val;
      screen = rowData.screen;
      refId = rowData.ref_id;
    } else {
      productCode = this.searchDetails[0].productCode;
      subProductCode = this.searchDetails[0].subProductCode;
      screen = this.searchDetails[0].screen;
      refId = this.searchDetails[0].refId;
    }
    if (!this.commonService.isAngularProductUrl(productCode, subProductCode) ||
    (this.commonService.swiftVersion < FccGlobalConstant.SWIFT_2021 &&
      (productCode === FccGlobalConstant.PRODUCT_BG || productCode === FccGlobalConstant.PRODUCT_BR))) {
      this.transferAssigneeUrl = '';
      if (this.contextPath !== null && this.contextPath !== '') {
          this.transferAssigneeUrl = this.contextPath;
      }
      this.transferAssigneeUrl += this.fccGlobalConstantService.servletName.concat('/')
      .concat(this.transferAssigneeUrlInitial.replace('!', screen)).concat(refId).concat('&OPTION=' + actionCode);
      this.router.navigate([]).then(() => { window.open(this.transferAssigneeUrl, '_self'); });
    } else {

      const isAngularUrl = this.fccGlobalConstantService.servletName &&
      window.location.pathname + '#' === (this.fccGlobalConstantService.contextPath + this.fccGlobalConstantService.servletName) + '#';
      if (!isAngularUrl) {
        const url = this.router.serializeUrl(
          this.router.createUrlTree([FccGlobalConstant.PRODUCT_SCREEN], { queryParams: {
            refId, productCode, subProductCode, tnxTypeCode, option: actionCode
          }
          })
        );
        window.open(
          `${window.origin}${this.fccGlobalConstantService.contextPath}${this.fccGlobalConstantService.servletName}#/${url}`, '_self');
      } else {
        this.router.navigate([FccGlobalConstant.PRODUCT_SCREEN], {
          queryParams: {
            refId, productCode, subProductCode, tnxTypeCode, option: actionCode
          }
        });
      }
    }
    this.onDialogClose();
  }

  onDropdownChange(event) {
    if (event) {
      this.dropdownOpen = !this.dropdownOpen;
    }
  }

  oncloseDropdown(event: KeyboardEvent) {
    if (event) {
      this.dropdownOpen = false;
    }
  }
  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event:
    KeyboardEvent) {
      if (event){
        if ( !this.dropdownOpen) {
          this.onDialogClose();
        }
      }
    }

    get smartSearchLabel(): string {
      return this.translateService.instant("search");
    }

    get closeButtonLabel(): string {
      return this.translateService.instant("close");
    }

    get searchFilterLabel(): string {
      switch(this.tnxFilter) {
        case 'tnx': return this.translateService.instant('Transaction');
        case 'beneficiary': return this.translateService.instant('BENEFICIARY');
        case 'menu': return this.translateService.instant('menu');
        case 'boRefId': return this.translateService.instant('boRefId');
        default: return this.translateService.instant('Transaction');
      }
    }

    getDefaultColDtls(): any[]{
      return [
        { field: 'tnxTypeCode', header: '', class: 'tnxTypeCodeID' },
        { field: 'refId', header: 'Reference', class: 'refID' },
        { field: 'boRefId', header: 'bankReference', class: 'boRefId' },
        { field: 'amount', header: 'Amount', class: 'tnxAmountID' },
        { field: 'status', header: 'Status', class: 'statusID' }
    ];
    }

    isAngularProductURL(productCode: string, subProductCode: string) {
      let isAngularURL = this.commonService.isAngularProductUrl(productCode,
        subProductCode);

        /*
        * Angular UX is not present for product SE and sub product code OTHER,
        *  should remove below condition once angular ux available
        **/
        if(productCode === 'SE'
            && this.commonService.isnonEMptyString(subProductCode)
            && subProductCode === 'OTHER') {
              isAngularURL = false;
        }
        return isAngularURL;
    }
}

