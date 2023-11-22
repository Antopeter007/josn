import { FccGlobalConstant } from './../../core/fcc-global-constants';
import { DynamicButtonComponent } from './../dynamic-button/dynamic-button.component';
import { Component, OnInit, Injectable } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { EnquiryService } from '../../../corporate/trade/lc/initiation/services/enquiry.service';
import { CommonService } from '../../services/common.service';
import { PreviewService } from '../../../corporate/trade/lc/initiation/services/preview.service';


@Component({
  selector: 'app-review-tab',
  templateUrl: './review-tab.component.html',
  styleUrls: ['./review-tab.component.scss']
})

@Injectable({
  providedIn: 'root'
})

export class ReviewTabComponent implements OnInit {

  widgetDetails: any;
  widgets;
  productCode;
  tnxTypeCode;
  tnxStatCode;
  modelStatCode;
  fetchItems: MenuItem[] = [];
  items: any[] = [];
  activeItem: MenuItem;
  componentDetails: any;
  dir: string = localStorage.getItem('langDir');
  tnxID;
  params: any = {};
  itemIdTnx = FccGlobalConstant.ITEM_ID_TNX;
  selectedIndex = 0;


  constructor(protected translateService: TranslateService,
              protected enquiryService: EnquiryService,
              protected dynamicButtonComponent: DynamicButtonComponent,
              protected commonService: CommonService,
              protected previewService:PreviewService) { }

  // eslint-disable-next-line @angular-eslint/contextual-lifecycle
  ngOnInit() {
    this.widgets = this.widgetDetails ? JSON.parse(this.widgetDetails) : '';
    this.tnxID = this.widgets.recordDetails.transactionId;
    if (this.tnxID === '') {
      this.tnxTypeCode = 'MASTER';
      this.tnxStatCode = 'ACKNOWLEDGED';
    } else {
      this.tnxTypeCode = this.widgets.transactionCode.body.tnx_type_code;
      const tnxStatRepl = this.widgets.transactionCode.body.tnx_stat_code;
      this.tnxStatCode = tnxStatRepl.replace(/-/g, '_');
    }
    this.productCode = this.widgets.recordDetails.productCode;
    const modelObj = this.widgets.widgetData.tnxStatus;
    this.componentDetails = this.widgets.widgetData;
    const displayTabs = 'displayTabs';
    const fields = this.componentDetails[displayTabs];
    this.fetchItems = this.enquiryService.getDisplayTabs(fields, String(this.tnxTypeCode), String(this.tnxStatCode), modelObj);
    this.items = this.fetchItems;
    this.activeItem = this.items[0];
    this.itemIdTnx = this.activeItem.id ? this.activeItem.id : FccGlobalConstant.ITEM_ID_TNX;
    this.params[FccGlobalConstant.PRODUCT_CODE] = this.productCode;
    this.params[FccGlobalConstant.FIELD_DATA] = fields;
    this.params[FccGlobalConstant.TRANSACTION_ID] = this.tnxID;
    }

    onTabChange(event) {
      this.selectedIndex = event.index;
      this.setFooterPositionId();
  }

  setFooterPositionId(){
    const tnxTypeCode = this.commonService.getQueryParametersFromKey('tnxTypeCode');
    const action = this.commonService.getQueryParametersFromKey('action');
    const mode = this.commonService.getQueryParametersFromKey('mode');
    if(tnxTypeCode === FccGlobalConstant.LENGTH_13.toString() && action.toLowerCase() === 'approve'
    && mode.toLowerCase() == 'view'){
    if(this.items.length !== 0 && this.items[this.selectedIndex]?.id === FccGlobalConstant.ITEM_ID_TNX){
      const footerSection = document.querySelector('#footerMain');
      if(footerSection){
        footerSection.setAttribute('id','sectionFixedFooter');
      }
    }else{
      const footerSection = document.querySelector('#sectionFixedFooter');
      if(footerSection){
        footerSection.setAttribute('id','footerMain');
      }
    }
    const hostFormKeys = Object.keys(this.previewService.accordionhostComponentData?.form?.controls);
    if(hostFormKeys.length != 0){
      for (let index = 0; index < hostFormKeys.length; index++) {
        const element = hostFormKeys[index];
        this.previewService.setCollapsibleMasterAccordion(this.previewService.accordionhostComponentData.form.controls[element],
          '','',this.items[this.selectedIndex]?.id);
      }
    }
   }
  }
}

