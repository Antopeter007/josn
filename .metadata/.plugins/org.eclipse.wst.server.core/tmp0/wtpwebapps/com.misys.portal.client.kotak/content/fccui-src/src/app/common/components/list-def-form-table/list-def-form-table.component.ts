import { Component, Input, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { FccConstants } from '../../core/fcc-constants';
import { FccGlobalConstant } from '../../core/fcc-global-constants';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'form-listdef-table',
  templateUrl: './list-def-form-table.component.html',
  styleUrls: ['./list-def-form-table.component.scss']
})
export class ListDefFormTableComponent implements OnInit {

  @Input() inputParams?: any = [];
  tableName = '';
  contextPath : string;
  showTable = false;
  inputParameter: any;

  constructor(protected commonService : CommonService, protected translateService: TranslateService,
    protected router: Router) { }

  ngOnInit(): void {
    if(this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPERATION) === 
    FccGlobalConstant.ACCOUNT_STATEMENT){
      this.commonService.listdefInputParams.subscribe((val) =>{
        if(!this.commonService.isEmptyValue(val)){
          this.inputParameter = val;
          this.refreshTableData();
        }
      });
    } else{
      this.prepareBatchDetailsInputParams();
    }
    
  }

  private prepareBatchDetailsInputParams() {
    const listdefName = 'listdefName';
    const showFilterSection = 'showFilterSection';
    const paginator = 'paginator';
    const downloadIconEnabled = 'downloadIconEnabled';
    const colFilterIconEnabled = 'colFilterIconEnabled';
    const passBackEnabled = 'passBackEnabled';
    const columnSort = 'columnSort';
    this.contextPath = this.commonService.getContextPath();
    const productCode = 'productCode';
    const filterParam = 'filterParams';
    const filterParamsRequired = 'filterParamsRequired';
    const filterChipsRequired = 'filterChipsRequired';
    const widgetName = 'widgetName';
    const allowColumnCustomization = 'allowColumnCustomization';
    this.inputParams[listdefName] = FccConstants.BATCH_DETAILS_LISTDEF;
    this.inputParams[showFilterSection] = false;
    this.inputParams[paginator] = true;
    this.inputParams[downloadIconEnabled] = true;
    this.inputParams[colFilterIconEnabled] = true;
    this.inputParams[passBackEnabled] = false;
    this.inputParams[columnSort] = true;
    this.inputParams[productCode] = FccGlobalConstant.PRODUCT_BT;
    this.inputParams[filterParamsRequired] = true;
    this.inputParams[filterParam] = { paymentReferenceNumber: this.commonService.getQueryParametersFromKey('paymentReferenceNumber') };
    this.inputParams[filterChipsRequired] = false;
    this.inputParams[FccGlobalConstant.ENABLE_LIST_DATA_DOWNLOAD] = false;
    this.inputParams[widgetName] = this.translateService.instant('batchDetails');
    this.inputParams[FccGlobalConstant.WILDSEARCH] = true;
    this.inputParams[allowColumnCustomization] = true;
    this.showTable = true;
  }

  private prepareTableDetailsInputParams(inputParam){
    this.tableName = inputParam.tableName;
    const listdefName = 'listdefName';
    const showFilterSection = 'showFilterSection';
    const paginator = 'paginator';
    const downloadIconEnabled = 'downloadIconEnabled';
    const colFilterIconEnabled = 'colFilterIconEnabled';
    const passBackEnabled = 'passBackEnabled';
    const columnSort = 'columnSort';
    this.contextPath = this.commonService.getContextPath();
    const productCode = 'productCode';
    const filterParam = 'filterParams';
    const filterParamsRequired = 'filterParamsRequired';
    const filterChipsRequired = 'filterChipsRequired';
    const widgetName = 'widgetName';
    this.inputParams[listdefName] = inputParam.listdefName;
    this.inputParams[showFilterSection] = inputParam.showFilterSection;
    this.inputParams[paginator] = inputParam.paginator;
    this.inputParams[downloadIconEnabled] = inputParam.downloadIconEnabled;
    this.inputParams[colFilterIconEnabled] = inputParam.colFilterIconEnabled;
    this.inputParams[passBackEnabled] = inputParam.passBackEnabled;
    this.inputParams[columnSort] = inputParam.columnSort;
    this.inputParams[productCode] = inputParam.productCode;
    this.inputParams[filterParamsRequired] = inputParam.filterParamsRequired;
    this.inputParams[filterParam] = inputParam.filterParam;
    this.inputParams[filterChipsRequired] = inputParam.filterChipsRequired;
    this.inputParams[FccGlobalConstant.ENABLE_LIST_DATA_DOWNLOAD] = inputParam.enableListDataDownload;
    this.inputParams[widgetName] = inputParam.widgetName;
    this.inputParams[FccGlobalConstant.WILDSEARCH] = inputParam.wildsearch;
    this.showTable = true;
  }
  refreshTableData(){
    this.showTable = false;
    if(this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPERATION) === 
    FccGlobalConstant.ACCOUNT_STATEMENT){
      setTimeout( ()=> {
        this.prepareTableDetailsInputParams(this.inputParameter);
      });
    }else{
      setTimeout( ()=> {
        this.prepareBatchDetailsInputParams();
      });
    }
  }
}
