import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FccConstants } from '../../core/fcc-constants';
import { FccGlobalConstant } from '../../core/fcc-global-constants';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-download-center',
  templateUrl: './download-center.component.html',
  styleUrls: ['./download-center.component.scss']
})
export class DownloadCenterComponent implements OnInit {

  constructor(protected router: Router, protected commonService: CommonService,
              protected translate: TranslateService) { }


  inputParams: any = {};
  contextPath: any;
  downloadCenter = 'downloadCenter';
  accountStatement = 'accountStatementText';
  accountSummary = 'accountSummary';
  noteMessage: any;

  ngOnInit(): void {
    this.prepareInputParams();
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.noteMessage = response.accountStatementDeleteFrequency;
        }
    });
  }

  onClickAccountSummaryNavigate(){
    this.router.navigateByUrl('/dashboard/accSummary?option=ACCOUNTS');
  }

  onClickAccountStatementNavigate(){
    this.router.navigateByUrl('/accountDetails?operation=ACCOUNT_STATEMENT&productCode=accountStatement&option=ACCOUNTS');
  }

  private prepareInputParams() {
    const listdefName = 'listdefName';
    const showFilterSection = 'showFilterSection';
    const paginator = 'paginator';
    const downloadIconEnabled = 'downloadIconEnabled';
    const colFilterIconEnabled = 'colFilterIconEnabled';
    const passBackEnabled = 'passBackEnabled';
    const columnSort = 'columnSort';
    this.contextPath = this.commonService.getContextPath();
    const productCode = 'productCode';
    const filterParamsRequired = 'filterParamsRequired';
    const filterChipsRequired = 'filterChipsRequired';
    const allowPreferenceSave = 'allowPreferenceSave';
    this.inputParams[listdefName] = FccConstants.ASYNC_ACCOUNT_SUMMARY_LISTDEF;
    this.inputParams[showFilterSection] = true;
    this.inputParams[paginator] = true;
    this.inputParams[downloadIconEnabled] = false;
    this.inputParams[colFilterIconEnabled] = false;
    this.inputParams[passBackEnabled] = false;
    this.inputParams[columnSort] = true;
    this.inputParams[productCode] = FccGlobalConstant.PRODUCT_SE;
    this.inputParams[filterParamsRequired] = false;
    this.inputParams[filterChipsRequired] = false;
    this.inputParams[FccGlobalConstant.ENABLE_LIST_DATA_DOWNLOAD] = false;
    this.inputParams[FccGlobalConstant.WILDSEARCH] = true;
    this.inputParams[allowPreferenceSave] = false;
  }

}
