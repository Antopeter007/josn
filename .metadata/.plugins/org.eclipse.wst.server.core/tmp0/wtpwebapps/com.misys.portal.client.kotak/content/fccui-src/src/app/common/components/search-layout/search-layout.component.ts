import { SearchLayoutService } from './../../services/search-layout.service';
import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { FccGlobalConstant } from '../../core/fcc-global-constants';
import { HideShowDeleteWidgetsService } from '../../services/hide-show-delete-widgets.service';
import { FccConstants } from '../../core/fcc-constants';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'fcc-common-search-layout',
  templateUrl: './search-layout.component.html',
  styleUrls: ['./search-layout.component.scss']
})
export class SearchLayoutComponent implements OnInit , OnDestroy {
  dir: string = localStorage.getItem('langDir');
  selectedRowsdata: string[] = [];
  constructor(protected dynamicDialogRef: DynamicDialogRef,
              protected dynamicDialogConfig: DynamicDialogConfig,
              protected searchLayoutService: SearchLayoutService,
              protected hideShowDeleteWidgetsService: HideShowDeleteWidgetsService,
              protected translateService: TranslateService) {}
inputParams: any = {};
enableLicenseOKButton = false;

  ngOnInit() {
    this.hideShowDeleteWidgetsService.customiseSubject.next(true);
    const productCode = 'ProductCode';
    const option = 'Option';
    const templateCreation = 'templateCreation';
    const screenType = 'screenType';
    this.inputParams[screenType] = 'dialog';
    this.inputParams[productCode] = this.dynamicDialogConfig.data.productCode;
    this.inputParams[option] = this.dynamicDialogConfig.data.option;
    this.inputParams[FccGlobalConstant.PASSBACK_ENABLED] = true;
    this.inputParams[FccGlobalConstant.SUB_PRODUCT_CODE] = this.dynamicDialogConfig.data.subProductCode;
    this.inputParams[FccGlobalConstant.BUTTONS] = this.dynamicDialogConfig.data.buttons;
    this.inputParams[FccGlobalConstant.SAVED_LIST] = this.dynamicDialogConfig.data.savedList;
    this.inputParams[FccGlobalConstant.HEADER_DISPLAY] = this.dynamicDialogConfig.data.headerDisplay;
    this.inputParams[FccGlobalConstant.DOWNLOAD_ICON_ENABLED] = this.dynamicDialogConfig.data.downloadIconEnabled;
    this.inputParams[FccGlobalConstant.LISTDEF] = this.dynamicDialogConfig.data.listDef;
    this.inputParams[FccGlobalConstant.CPTY_NAME] = this.dynamicDialogConfig.data.cptyName;
    this.inputParams[FccGlobalConstant.EXPIRY_DATE_FIELD] = this.dynamicDialogConfig.data.expiryDate;
    this.inputParams[FccGlobalConstant.FILTER_PARAMS_REQUIRED] = this.dynamicDialogConfig.data.filterParamsRequired;
    this.inputParams[FccGlobalConstant.FILTER_PARAMS] = this.dynamicDialogConfig.data.filterParams;
    this.inputParams[FccGlobalConstant.DEFAULT_LICENSE_FILTER] = this.dynamicDialogConfig.data.defaultLicenseFilter;
    this.inputParams[FccGlobalConstant.CURRENCY] = this.dynamicDialogConfig.data.currency;
    this.inputParams[FccGlobalConstant.BENEFICIARY_NAME] = this.dynamicDialogConfig.data.beneficiaryName;
    this.inputParams[FccGlobalConstant.FIN_TYPE] = this.dynamicDialogConfig.data.ls_type;
    this.inputParams.parmid = this.dynamicDialogConfig.data.parmid;
    this.inputParams.intermediateBankFlag = this.dynamicDialogConfig.data.intermediateBankFlag;
    this.inputParams[FccGlobalConstant.DEFAULT_CRITERIA] = this.dynamicDialogConfig.data.defaultFilterCriteria;
    this.inputParams[templateCreation] = this.dynamicDialogConfig.data.templateCreation;
    this.inputParams[FccGlobalConstant.CURRENT_DATE] = this.dynamicDialogConfig.data.currentDate;
    this.inputParams.allowColumnCustomization = this.dynamicDialogConfig?.data?.allowColumnCustomization ?
    this.dynamicDialogConfig.data.allowColumnCustomization : false;
    this.inputParams.allowPreferenceSave = this.dynamicDialogConfig?.data?.allowPreferenceSave ?
    this.dynamicDialogConfig.data.allowPreferenceSave : false;
    this.inputParams.filterChipsRequired = this.dynamicDialogConfig?.data?.filterChipsRequired ?
    this.dynamicDialogConfig.data.filterChipsRequired : false;
    if (this.inputParams[FccGlobalConstant.LISTDEF] === FccGlobalConstant.LIST_LICENSE_SCREEN) {
      this.enableLicenseOKButton = true;
    }
    this.inputParams[FccGlobalConstant.CATEGORY] = this.dynamicDialogConfig.data.category;
    this.inputParams[FccConstants.BENE_BANK_CODE_OPTION] = this.dynamicDialogConfig.data.beneBankCodeOption;
    this.inputParams[FccGlobalConstant.IFSC_VALUE] = this.dynamicDialogConfig.data?.ifscValue ?
    this.dynamicDialogConfig.data.ifscValue : '%';
    this.searchLayoutService.initializeSearchLayoutDataSubject();
    this.addAccessibilityControl();
  }

  @HostListener('document:keydown.escape') onKeydownHandler() {
    this.onDialogClose();
  }

  onDialogClose() {
    this.dynamicDialogRef.close();
  }

  addAccessibilityControl(): void {
    const titleBarCloseList = Array.from(document.getElementsByClassName('ui-dialog-titlebar-close'));
    titleBarCloseList.forEach(element => {
      element[FccGlobalConstant.ARIA_LABEL] = this.translateService.instant('close');
      element[FccGlobalConstant.TITLE] = this.translateService.instant('close');
    });    
  }

  getDataOnRowClick(event) {
    if (event.type === 'row') {
    this.onDialogClose();
    this.sendPassBackData(event.data.passbackParameters);
    } else if (event.type === 'checkbox') {
      this.selectedRowsdata.push(event.data.passbackParameters);
    } else if (event.type === 'radiobutton') {
      this.selectedRowsdata.push(event.data.passbackParameters);
    }
  }

  removeDataOnRowClick(event) {
    if ( event === FccGlobalConstant.MULTIPLE_LICENSE_CHECK) {
      this.selectedRowsdata = [];
    } else if (event.type === 'checkbox') {
      this.selectedRowsdata.forEach((item, index) => {
        if (item[`REF_ID`] === event.data.ref_id) {
          this.selectedRowsdata.splice(index, 1);
        }
      });
    }
  }

  onHeaderCheckboxToggle(event) {
    this.selectedRowsdata = [];
    if (event.checked) {
      event.selectedRows.forEach(element => {
        this.selectedRowsdata.push(element.passbackParameters);
      });
    }
  }

  sendPassBackData(passBackData: any) {
    this.searchLayoutService.searchLayoutDataSubject.next({ responseData: passBackData });
  }

  onClickOK() {
    this.onDialogClose();
    this.sendPassBackData(this.selectedRowsdata);
  }

  ngOnDestroy(): void {
    this.hideShowDeleteWidgetsService.customiseSubject.next(false);
  }
}
