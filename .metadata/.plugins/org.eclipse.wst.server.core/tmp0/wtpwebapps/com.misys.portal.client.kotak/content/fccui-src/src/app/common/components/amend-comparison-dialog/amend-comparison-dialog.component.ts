import { Component, OnInit, OnDestroy, ElementRef, AfterViewInit } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { FccGlobalConstant } from '../../core/fcc-global-constants';
import { FCCFormControl, FCCFormGroup } from '../../../base/model/fcc-control.model';
import { TranslateService } from '@ngx-translate/core';
import { FormatAmdNoService } from '../../services/format-amd-no.service';
import { ProductStateService } from '../../../corporate/trade/lc/common/services/product-state.service';
import { Subscription } from 'rxjs';

interface CardData {
  value: string;
  viewValue: string;
  tnxCodeValue?: string;
  subTnxValue?: string;
  productStatCode?: string;
}

@Component({
  selector: 'app-amend-comparison-dialog',
  templateUrl: './amend-comparison-dialog.component.html',
  styleUrls: ['./amend-comparison-dialog.component.scss']
})

export class AmendComparisonDialogComponent implements OnInit, OnDestroy, AfterViewInit {

  eventTnxStatCode: any;
  transactionId;
  referenceId;
  tnxTypeCode;
  operation;
  mode;
  productCode;
  eventRequiredForEnquiry: any;
  eventTypeCode = 'eventTypeCode';
  paramsForSecondCard: any = {};
  pdfData: Map<string, FCCFormGroup>;
  sectionNames: string[];
  tabSectionControlMap: Map<string, Map<string, FCCFormControl>>;
  readonly param = 'params';
  readonly grouphead = 'grouphead';
  readonly previewScreen = 'previewScreen';
  translateLabel = 'translate';
  translateValue = 'translateValue';
  tnxIdForAmend = 'tnxIdForAmend';
  previousTnxIdForAmend = 'previousTnxIdForAmend';
  dir: string = localStorage.getItem('langDir');
  initialReq;
  secondCardData: CardData[] = [];
  dropdownOptions: CardData[] = [];
  dropDownCardData: CardData[] = [];
  selectedTransaction;
  previousTnxId = '';
  transactionList = [];
  transaction1Header = 'Transaction 1';
  transaction2Header = 'Transaction 2';
  transaction1 = 'transaction1Header';
  transaction2 = 'transaction2Header';
  selectedOption: CardData;
  subscription: Subscription;
  tnxCodeValue: string;
  tnxTypeCodeVal = 'tnxTypeCode';
  previousTnxTypeCodeVal = 'previousTnxTypeCode';
  previousTnxTypeCode = '';
  fetchSubTnxType: any;

  constructor(protected activatedRoute: ActivatedRoute, protected dynamicDialogConfig: DynamicDialogConfig,
              protected commonService: CommonService, protected translate: TranslateService,
              protected formatAmdNoService: FormatAmdNoService, protected stateService: ProductStateService,
              protected el: ElementRef) { }

  ngOnInit(): void {
    const referenceid = 'referenceid';
    const tnxTypeCode = 'tnxTypeCode';
    this.subscription = this.activatedRoute.queryParams.subscribe(params => {
      this.referenceId = params[referenceid];
      this.productCode = this.referenceId.substring(FccGlobalConstant.LENGTH_0, FccGlobalConstant.LENGTH_2);
      this.tnxTypeCode = params[tnxTypeCode];
      this.operation = 'PREVIEW';
  });
    this.mode = 'view';
    if (this.dynamicDialogConfig) {
      this.selectedTransaction = this.dynamicDialogConfig.data.selectedTransaction;
      this.transactionList = this.dynamicDialogConfig.data.transactionList;
      this.transactionId = this.dynamicDialogConfig.data.selectedTransaction.tnxId;
      this.fetchSubTnxType = this.dynamicDialogConfig.data.selectedTransaction.subTnxType;
      const tempfetchSubTnxType = this.fetchSubTnxTypeStr(this.fetchSubTnxType);
      this.transaction1Header = this.dynamicDialogConfig.data.selectedTransaction.tnxType + ' ' + tempfetchSubTnxType;
    }
    this.populateSecondCard();
    for (const item of this.dropdownOptions){
    if (item.value === this.selectedTransaction.tnxId) {
      this.selectedOption = { value: item.value,
        viewValue: item.viewValue,
        tnxCodeValue: item.tnxCodeValue,
         subTnxValue: item.subTnxValue,
         productStatCode: item.productStatCode };
    }
  }
    this.commonService.comparisonPopup = true;
  }

  populateSecondCard() {
    const modeValue = 'mode';
    const prodCode = 'productCode';
    const componentType = 'componentType';
    const accordionViewRequired = 'accordionViewRequired';
    const tnxTypeCode = 'tnxTypeCode';
    const operation = 'operation';
    const eventTnxStatCode = 'eventTnxStatCode';
    // const subTnxValue = 'subTnxValue';
    for (const item of this.transactionList) {
      if (item.tnxTypeCode) {
        if (item.tnxTypeCode === FccGlobalConstant.N002_AMEND){
          const subTnxValue = this.fetchSubTnxTypeStr(item.subTnxType);
          if (!(item.productStatCode === FccGlobalConstant.PROD_STAT_CODE_AMENDMENT_AWAITING_BENE_APPROVAL && item.respond === false))
          {
            this.dropDownCardData.push({
              value: item.currentTnxId,
              subTnxValue: item.subTnxType,
              viewValue: item.tnxType + ' ' + subTnxValue,
              tnxCodeValue: item.tnxTypeCode,
              productStatCode: item.productStatCode
            });
          }
          this.secondCardData.push({
            value: item.currentTnxId,
            subTnxValue: item.subTnxType,
            viewValue: item.tnxType + ' ' + subTnxValue,
            tnxCodeValue: item.tnxTypeCode,
            productStatCode: item.productStatCode
          });
        }else{
          if (!(item.productStatCode === FccGlobalConstant.PROD_STAT_CODE_AMENDMENT_AWAITING_BENE_APPROVAL && item.respond === false))
          {
            this.dropDownCardData.push({
              value: item.currentTnxId,
              viewValue: item.tnxType,
              tnxCodeValue: item.tnxTypeCode,
              subTnxValue: item.subTnxType,
              productStatCode: item.productStatCode
            });
          }
          this.secondCardData.push({
            value: item.currentTnxId,
            viewValue: item.tnxType,
            tnxCodeValue: item.tnxTypeCode,
            subTnxValue: item.subTnxType,
            productStatCode: item.productStatCode
          });
      }
     } else {
        this.secondCardData.push({
          value: item.currentTnxId,
          viewValue: item.tnxType
        });
        this.dropDownCardData.push({
          value: item.currentTnxId,
          viewValue: item.tnxType
        });
      }

    }
    this.dropdownOptions = this.dropDownCardData.slice(0);
    this.dropdownOptions.pop();
    let flag = false;
    for (const item of this.secondCardData)
    {
      if (flag && item.productStatCode !== FccGlobalConstant.PROD_STAT_CODE_AMENDMENT_AWAITING_BENE_APPROVAL) {
        this.previousTnxId = item.value;
        this.transaction2Header = item.viewValue;
        if (item.tnxCodeValue) {
          this.previousTnxTypeCode = item.tnxCodeValue;
        }
        break;
      }
      if (item.value === this.selectedTransaction.tnxId) {
        if (item.tnxCodeValue) {
          this.tnxCodeValue = item.tnxCodeValue;
        }
        if (this.selectedTransaction.productStatCode === FccGlobalConstant.PROD_STAT_CODE_AMENDMENT_AWAITING_BENE_APPROVAL)
        {
          for (const listitem of this.secondCardData)
          {
            if (listitem.productStatCode !== FccGlobalConstant.PROD_STAT_CODE_AMENDMENT_AWAITING_BENE_APPROVAL)
            {
              this.previousTnxId = listitem.value;
              this.transaction2Header = listitem.viewValue;
              if (listitem.tnxCodeValue) {
              this.previousTnxTypeCode = listitem.tnxCodeValue;
            }
              break;
            }
          }
          break;
        }
        flag = true;
      }
    }
    this.initialReq = 'Transaction';
    this.paramsForSecondCard[prodCode] = this.productCode;
    this.paramsForSecondCard[modeValue] = this.mode;
    this.paramsForSecondCard[FccGlobalConstant.refId] = this.referenceId;
    this.paramsForSecondCard[FccGlobalConstant.tnxId] = this.transactionId;
    this.paramsForSecondCard[componentType] = 'summaryDetails';
    this.paramsForSecondCard[accordionViewRequired] = false;
    this.paramsForSecondCard[tnxTypeCode] = this.tnxTypeCode;
    this.paramsForSecondCard[operation] = this.operation;
    this.paramsForSecondCard[eventTnxStatCode] = this.eventTnxStatCode;
    this.paramsForSecondCard[FccGlobalConstant.eventTab] = false;
    this.paramsForSecondCard[FccGlobalConstant.transactionTab] = true;
    this.paramsForSecondCard[this.tnxIdForAmend] = this.transactionId;
    this.paramsForSecondCard[this.previousTnxIdForAmend] = this.previousTnxId;
    this.paramsForSecondCard[this.transaction1] = this.transaction1Header;
    this.paramsForSecondCard[this.transaction2] = this.transaction2Header;
    this.paramsForSecondCard[this.tnxTypeCodeVal] = this.tnxCodeValue;
    this.paramsForSecondCard[this.previousTnxTypeCodeVal] = this.previousTnxTypeCode;
  }

  ngAfterViewInit(): void {
    this.el.nativeElement.querySelectorAll('.ui-dropdown span.ui-dropdown-label')[0].style.borderBottom = 'none';
    this.el.nativeElement.querySelectorAll('body .ui-dropdown')[0].style =
      `background-color: #694ED614 ; 
       border-bottom: 0.06em solid #694ed7 ; 
       width: 15em; margin-left: 0.7em;`;
  }

  onChangeDropdownField(event) {
    let tempTnxType = 'Transaction';
    if (event && event.value) {
    let flag = false;
   // let tempSubtnx1;
    for (const item of this.secondCardData) {
      if (flag && item.productStatCode !== FccGlobalConstant.PROD_STAT_CODE_AMENDMENT_AWAITING_BENE_APPROVAL) {
        this.previousTnxId = item.value;
       // tempSubtnx1 = this.fetchSubTnxTypeStr(item.subTnxValue);
        if ( item.tnxCodeValue === FccGlobalConstant.N002_AMEND)
        {
          tempTnxType = item.viewValue;
          //  + ' ' + tempSubtnx1;
        }
        else
        {
          tempTnxType = item.viewValue;
        }
        break;
      }
      if (item.value === event.value.value) {
        flag = true;
      }
    }
    this.paramsForSecondCard[this.tnxIdForAmend] = event.value.value;
    this.paramsForSecondCard[this.previousTnxIdForAmend] = this.previousTnxId;
    this.paramsForSecondCard[FccGlobalConstant.tnxId] = event.value.value;
    this.paramsForSecondCard[this.transaction1] = event.value.viewValue ;
    this.paramsForSecondCard[this.transaction2] = tempTnxType;
    this.commonService.initiateProdComp$.next(true);
    }
  }
  fetchSubTnxTypeStr(subtnx: any){
    let tempSubtnx = '';
    if ( subtnx === '01' || subtnx === '02' || subtnx === '03' )
    {
       tempSubtnx = `${this.translate.instant( 'LIST_N003_' + subtnx )}`;
    }
    return tempSubtnx;
    }
  ngOnDestroy(): void {
    this.stateService.clearState();
    this.stateService.clearState(true);
    this.subscription.unsubscribe();
    this.commonService.comparisonPopup = false;
  }
}
