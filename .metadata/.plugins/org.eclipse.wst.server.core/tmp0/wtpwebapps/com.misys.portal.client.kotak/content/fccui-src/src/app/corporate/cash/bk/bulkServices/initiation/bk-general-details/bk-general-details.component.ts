/* eslint-disable @typescript-eslint/no-unused-vars */
import { FccConstants } from '../../../../../../common/core/fcc-constants';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CommonService } from '../../../../../../common/services/common.service';
import { FormModelService } from '../../../../../../common/services/form-model.service';
import { SearchLayoutService } from '../../../../../../common/services/search-layout.service';
import { LeftSectionService } from '../../../../../common/services/leftSection.service';
import { ProductStateService } from '../../../../../trade/lc/common/services/product-state.service';
import { SaveDraftService } from '../../../../../trade/lc/common/services/save-draft.service';
import { FormControlService } from '../../../../../trade/lc/initiation/services/form-control.service';
import { PrevNextService } from '../../../../../trade/lc/initiation/services/prev-next.service';
import { UtilityService } from '../../../../../trade/lc/initiation/services/utility.service';
import { HOST_COMPONENT } from '../../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';
import { EventEmitterService } from '../../../../../../common/services/event-emitter-service';
import { FccGlobalConstantService } from '../../../../../../common/core/fcc-global-constant.service';
import { FilelistService } from '../../../../../trade/lc/initiation/services/filelist.service';
import { ResolverService } from '../../../../../../common/services/resolver.service';
import { CurrencyConverterPipe } from '../../../../../trade/lc/initiation/pipes/currency-converter.pipe';
import { TransactionDetailService } from '../../../../../../common/services/transactionDetail.service';
import { ProductMappingService } from '../../../../../../common/services/productMapping.service';
import { CustomCommasInCurrenciesPipe } from '../../../../../trade/lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { FCCFormGroup } from '../../../../../../base/model/fcc-control.model';
import { MultiBankService } from '../../../../../../common/services/multi-bank.service';
import { DropDownAPIService } from '../../../../../../common/services/dropdownAPI.service';
import { FccTaskService } from '../../../../../../common/services/fcc-task.service';
import { DashboardService } from '../../../../../../common/services/dashboard.service';
import { CashCommonDataService } from './../../../../services/cash-common-data.service';
import { SessionValidateService } from '../../../../../../common/services/session-validate-service';
import { BkProductService } from '../../services/bk-product.service';
import { BkProductComponent } from '../bk-product/bk-product.component';
import { FccGlobalConstant } from '../../../../../../common/core/fcc-global-constants';
import { BulkMappingService } from '../../../../../../common/services/bulk-mapping.service';

@Component({
  selector: 'app-bk-general-details',
  templateUrl: './bk-general-details.component.html',
  styleUrls: ['./bk-general-details.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: BkGeneralDetailsComponent }]
})
export class BkGeneralDetailsComponent extends BkProductComponent implements OnInit {

  form: FCCFormGroup;
  module = `${this.translateService.instant('bkGeneralDetails')}`;
  contextPath: any;
  useOnChange = true;

  constructor(protected commonService: CommonService, protected leftSectionService: LeftSectionService,
    protected router: Router, protected translateService: TranslateService,
    protected prevNextService: PrevNextService,
    protected utilityService: UtilityService, protected saveDraftService: SaveDraftService,
    protected searchLayoutService: SearchLayoutService,
    protected formModelService: FormModelService, protected formControlService: FormControlService,
    protected stateService: ProductStateService, protected route: ActivatedRoute,
    protected eventEmitterService: EventEmitterService, protected transactionDetailService: TransactionDetailService,
    protected dialogService: DialogService,
    public fccGlobalConstantService: FccGlobalConstantService, protected productMappingService: ProductMappingService,
    protected fileList: FilelistService, protected dialogRef: DynamicDialogRef,
    protected confirmationService: ConfirmationService, protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe,
    protected resolverService: ResolverService, protected fileListSvc: FilelistService,
    protected currencyConverterPipe: CurrencyConverterPipe,
    protected bkProductService: BkProductService,
    protected multiBankService: MultiBankService,
    protected dropdownAPIService: DropDownAPIService,
    protected taskService: FccTaskService, protected sessionValidation: SessionValidateService,
    protected dashboardService: DashboardService, protected cashCommonDataService: CashCommonDataService,
    protected bulkMappingService: BulkMappingService) {
super(eventEmitterService, stateService, commonService, translateService, confirmationService, customCommasInCurrenciesPipe,
searchLayoutService, utilityService, resolverService, fileList, dialogRef, currencyConverterPipe, bkProductService);
    }

  ngOnInit(): void {
    super.ngOnInit();
    this.contextPath = this.fccGlobalConstantService.contextPath;
    this.initializeFormGroup();
    this.form.valueChanges.subscribe(change => {
      if(this.form.valid){
        this.commonService.announceMission('no');
      } else {
        this.hideNavigation();
      }
    });
    this.commonService.bulkBankError.subscribe((value) => {
      if (value) {
        this.form.get(FccGlobalConstant.BK_BANK).setErrors({ bulkBankError: `${this.translateService.instant('bulkBankErrorMsg')}` });
        this.disableEnableFields(this.form,
          ['bkProductGroup', 'bkProductType', 'bkTransferFrom', 'bkTransferDate'], true);
        this.commonService.bulkBankError.next(false);
      }
    });
  }

  initializeFormGroup() {
    const sectionName = FccConstants.BK_GENERAL_DETAILS;
    this.form = this.stateService.getSectionData(sectionName);
    this.hideNavigation();
    this.form = this.cashCommonDataService.loadEntity(this.form, FccGlobalConstant.BK_ENTITY, FccGlobalConstant.BK_BANK);
    this.form = this.cashCommonDataService.loadBankList(this.form, FccGlobalConstant.BK_BANK, FccGlobalConstant.BK_ENTITY);
    this.form.updateValueAndValidity();
    this.bulkMappingService.getDropdownValues(this.form,
      this.commonService.isnonEMptyString(this.form.get(FccGlobalConstant.BK_ENTITY).value) ?
      this.form.get(FccGlobalConstant.BK_ENTITY).value.shortName : '*');
  }

  onChangebkEntity(event: any) {
    this.resetFields(this.form,
      ['bkProductGroup', 'bkProductType', 'bkTransferFrom', 'bkTransferDate']);
    this.setRenderOnlyFields(this.form,
      ['bulkType', 'bkPayrollType'],
    false);
    this.resetOptions(this.form, ['bkProductGroup', 'bkProductType', 'bkPayrollType']);
    this.disableEnableFields(this.form,
      ['bkProductGroup', 'bkProductType', 'bkTransferFrom', 'bkTransferDate'], false);
    this.form.get(FccGlobalConstant.BULK_PAB)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
    if (event?.value) {
      this.form.get(FccGlobalConstant.BK_ENTITY).setValue(event.value);
      this.form.get(FccGlobalConstant.BK_BANK)[FccGlobalConstant.PARAMS][FccGlobalConstant.DISABLED] = false;
      this.form = this.cashCommonDataService.loadBankList(this.form, FccGlobalConstant.BK_BANK, FccGlobalConstant.BK_ENTITY, false);
      this.form.updateValueAndValidity();
      this.bulkMappingService.getDropdownValues(this.form, this.form.get(FccGlobalConstant.BK_ENTITY).value.shortName);
    }
  }

  onChangeBank(event: any){
    this.resetFields(this.form,
      ['bkProductGroup', 'bkProductType', 'bkTransferFrom', 'bkTransferDate']);
    this.setRenderOnlyFields(this.form,
      ['bulkType', 'bkPayrollType'],
    false);
    this.resetOptions(this.form, ['bkProductGroup', 'bkProductType', 'bkPayrollType']);
    this.disableEnableFields(this.form,
      ['bkProductGroup', 'bkProductType', 'bkTransferFrom', 'bkTransferDate'], false);
    this.form.get(FccGlobalConstant.BULK_PAB)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
    if (event?.value) {
      this.bulkMappingService.getDropdownValuesOnBankSelect(this.form, this.form.get(FccGlobalConstant.BK_ENTITY).value.shortName,
      event.value.shortName);
    }
  }

  onChangebkProductGroup(event: any){
    this.resetFields(this.form, ['bkProductType', 'bkPayrollType']);
    this.resetOptions(this.form, ['bkProductType', 'bkPayrollType']);
    this.setRenderOnlyFields(this.form,
      ['bulkType'],
    false);
    this.form.get(FccGlobalConstant.BULK_PAB)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
    if (event?.value && event.value.code !== 'PAYRL') {
      this.setRenderOnlyFields(this.form,
        ['bkPayrollType'],
        false);
      this.resetFields(this.form, ['bkTransferFrom', 'bkTransferDate']);
      this.bulkMappingService.getSubProductCode(this.form,
        this.commonService.isnonEMptyString(this.form.get(FccGlobalConstant.BK_ENTITY).value) ?
        this.form.get(FccGlobalConstant.BK_ENTITY).value.shortName : '*',
        this.form.get('bkProductGroup').value);
    } else {
      this.setRenderOnlyFields(this.form,
        ['bkPayrollType'],
        true);
        this.resetFields(this.form, ['bkTransferFrom', 'bkTransferDate']);
        this.bulkMappingService.getPayrollType(this.form,
          this.commonService.isnonEMptyString(this.form.get(FccGlobalConstant.BK_ENTITY).value) ?
          this.form.get(FccGlobalConstant.BK_ENTITY).value.shortName : '*',
          this.form.get('bkProductGroup').value);
    }
  }

  onChangebkPayrollType(event: any){
    if (event?.value) {
      this.bulkMappingService.getPayrollSubProductCode(this.form,
        this.commonService.isnonEMptyString(this.form.get(FccGlobalConstant.BK_ENTITY).value) ?
        this.form.get(FccGlobalConstant.BK_ENTITY).value.shortName : '*',
        this.form.get('bkProductGroup').value, this.form.get('bkPayrollType').value);
    }
  }

  onChangebkProductType(event: any){
    if (event?.value) {
      this.setRenderOnlyFields(this.form,
        ['bulkType'],
      true);
      this.form.get('bulkType').setValue(event.value.description);
      this.resetFields(this.form,
        ['bkTransferFrom', 'bkTransferDate']);
      this.form.get(FccGlobalConstant.BULK_PAB)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
    } else {
      this.setRenderOnlyFields(this.form,
        ['bulkType'],
      false);
    }
  }

  onClickBkTransferFromIcons(_event: any) {
    this.cashCommonDataService.getBulkTransferFromLookup(this.form, FccGlobalConstant.BK_ENTITY,
      FccGlobalConstant.BK_BANK, this.form.get('bkProductType').value.subProductCode);
  }

  onKeyupFtTransferFromIcons(event: any) {
    const keycodeIs = event.which || event.keyCode;
    if (keycodeIs === FccGlobalConstant.LENGTH_13) {
      this.cashCommonDataService.getBulkTransferFromLookup(this.form, FccGlobalConstant.BK_ENTITY,
        FccGlobalConstant.BK_BANK, this.form.get('bkProductType').value.subProductCode);
    }
  }

  setRenderOnlyFields(form, ids: string[], flag) {
    ids.forEach((id) => {
      if(!flag){
        form.controls[id].setValue(null);
        form.controls[id].setErrors(null);
        form.controls[id].updateValueAndValidity();
      }
      this.patchFieldParameters(form.controls[id], { rendered: flag });
    });
  }

  hideNavigation() {
    setTimeout(() => {
      const ele = document.getElementById('next');
      if (ele) {
        this.commonService.announceMission('yes');
      } else {
        this.hideNavigation();
      }
    }, FccGlobalConstant.LENGTH_500);
  }

  resetFields(form, ids: string[]){
    ids.forEach((id) => {
        form.controls[id].setValue(null);
        form.controls[id].setErrors(null);
        form.controls[id].updateValueAndValidity();
    });
  }

  resetOptions(form, ids: string[]){
    ids.forEach((id) => {
      this.patchFieldParameters(form.controls[id], { options: [] });
    });
  }

  disableEnableFields(form, ids: string[], flag){
    ids.forEach((id) => {
      form.get(id)[FccGlobalConstant.PARAMS][FccGlobalConstant.READONLY] = flag;
    });
  }

}
