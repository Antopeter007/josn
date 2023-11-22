
import {
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  ElementRef,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, DynamicDialogRef } from 'primeng';
import { BehaviorSubject, Subscription } from 'rxjs';

import { FccBusinessConstantsService } from '../../../../../../common/core/fcc-business-constants.service';
import { FccGlobalConstantService } from '../../../../../../common/core/fcc-global-constant.service';
import { CommonService } from '../../../../../../common/services/common.service';
import { DropDownAPIService } from '../../../../../../common/services/dropdownAPI.service';
import { EventEmitterService } from '../../../../../../common/services/event-emitter-service';
import { FormModelService } from '../../../../../../common/services/form-model.service';
import { MultiBankService } from '../../../../../../common/services/multi-bank.service';
import { ResolverService } from '../../../../../../common/services/resolver.service';
import { SearchLayoutService } from '../../../../../../common/services/search-layout.service';
import { ProductStateService } from '../../../../../../corporate/trade/lc/common/services/product-state.service';
import { FormControlService } from '../../../../../../corporate/trade/lc/initiation/services/form-control.service';
import { LcReturnService } from '../../../../../../corporate/trade/lc/initiation/services/lc-return.service';
import { PrevNextService } from '../../../../../../corporate/trade/lc/initiation/services/prev-next.service';
import { UtilityService } from '../../../../../../corporate/trade/lc/initiation/services/utility.service';
import { AmendCommonService } from '../../../../../common/services/amend-common.service';
import { CustomCommasInCurrenciesPipe } from '../../../../lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { FilelistService } from '../../../../lc/initiation/services/filelist.service';
import { UiAdviseThroughBankComponent } from '../ui-advise-through-bank/ui-advise-through-bank.component';
import { UiLocalAdviseThroughBankComponent } from '../ui-local-advise-through-bank/ui-local-advise-through-bank.component';
import { UiAdvisingBankComponent } from '../ui-advising-bank/ui-advising-bank.component';
import { UiConfirmingBankComponent } from '../ui-confirming-bank/ui-confirming-bank.component';
import { UiIssuingBankComponent } from '../ui-issuing-bank/ui-issuing-bank.component';
import { UiProductComponent } from '../ui-product/ui-product.component';
import { FCCFormGroup } from './../../../../../../base/model/fcc-control.model';
import { FccGlobalConstant } from './../../../../../../common/core/fcc-global-constants';
import { BankDetails } from './../../../../../../common/model/bankDetails';
import { References } from './../../../../../../common/model/references';
import { CorporateCommonService } from './../../../../../../corporate/common/services/common.service';
import { FccTaskService } from '../../../../../../common/services/fcc-task.service';
import { CurrencyConverterPipe } from '../../../../lc/initiation/pipes/currency-converter.pipe';
import { UiProductService } from '../../../services/ui-product.service';
import { HOST_COMPONENT } from './../../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';
import { TabPanelService } from './../../../../../../common/services/tab-panel.service';

@Component({
  selector: 'app-ui-bank-details',
  templateUrl: './ui-bank-details.component.html',
  styleUrls: ['./ui-bank-details.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: UiBankDetailsComponent }]
})
export class UiBankDetailsComponent extends UiProductComponent implements OnInit, OnDestroy {

  form: FCCFormGroup;
  @Output() notify = new EventEmitter<any>();
  @ViewChild('tabs') public tabs: MatTabGroup;
  @ViewChild(UiIssuingBankComponent, { read: UiIssuingBankComponent })
  public issuingBankComponent: UiIssuingBankComponent;
  @ViewChild(UiAdvisingBankComponent, { read: UiAdvisingBankComponent })
  public advisingBankComponent: UiAdvisingBankComponent;
  @ViewChild(UiAdviseThroughBankComponent, { read: UiAdviseThroughBankComponent })
  public adviseThroughBankComponent: UiAdviseThroughBankComponent;
 @ViewChild(UiLocalAdviseThroughBankComponent, { read: UiLocalAdviseThroughBankComponent })
  public localAdviseThroughBankComponent: UiLocalAdviseThroughBankComponent;
  @ViewChild(UiConfirmingBankComponent, { read: UiConfirmingBankComponent })
  public confirmingBankComponent: UiConfirmingBankComponent;

  bankDetails: BankDetails;
  corporateBanks = [];
  corporateReferences = [];
  references: References;
  entityName: any;
  entitiesList: any;
  params = FccGlobalConstant.PARAMS;
  rendered = FccGlobalConstant.RENDERED;
  readOnly = FccGlobalConstant.READONLY;
  bankResponse;
  confirmationBehaviourSubject = new BehaviorSubject(null);
  mode;
  modeRef;
  operation;
  confirmationPartyValue;
  generalDetails;
  subProductValue;
  productCode: any;
  tnxTypeCode: any;
  option: any;
  isMasterRequired: any;
  module = `${this.translateService.instant(FccGlobalConstant.UI_BANK_DETAILS)}`;
  selectedEntity;
  nameOrAbbvName: any;
  entityChange$: Subscription;
  prevCreateFrom;
  disableProvisionalBank: boolean;
  provisionalTagValue: any;

  constructor(protected translateService: TranslateService, protected eventEmitterService: EventEmitterService,
              protected stateService: ProductStateService,
              protected multiBankService: MultiBankService, protected dropDownAPIservice: DropDownAPIService ,
              protected searchLayoutService: SearchLayoutService,
              protected resolverService: ResolverService,
              protected corporateCommonService: CorporateCommonService,
              protected elementRef: ElementRef,
              protected commonService: CommonService,
              protected lcReturnService: LcReturnService, protected router: Router,
              protected utilityService: UtilityService,
              protected fccGlobalConstantService: FccGlobalConstantService,
              protected prevNextService: PrevNextService,
              protected formModelService: FormModelService,
              protected formControlService: FormControlService,
              protected emitterService: EventEmitterService,
              protected viewContainerRef: ViewContainerRef,
              protected cdRef: ChangeDetectorRef,
              protected resolver: ComponentFactoryResolver,
              protected amendCommonService: AmendCommonService,
              protected confirmationService: ConfirmationService,
              protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe,
              protected fileArray: FilelistService,
              protected dialogRef: DynamicDialogRef,
              protected taskService: FccTaskService,
              protected tabPanelService: TabPanelService,
              protected currencyConverterPipe: CurrencyConverterPipe, protected uiProductService: UiProductService) {

              super(eventEmitterService, stateService, commonService, translateService, confirmationService,
                customCommasInCurrenciesPipe, searchLayoutService, utilityService, resolverService, fileArray, dialogRef,
                currencyConverterPipe, uiProductService);
}

ngOnInit(): void {
  this.commonService.loadDefaultConfiguration().subscribe(response => {
    if (response) {
      this.nameOrAbbvName = response.TradeIssuingBankNameOrAbbvName;
    }
  });
  this.isMasterRequired = this.isMasterRequired;
  this.tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
  this.productCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.PRODUCT);
  this.form = this.stateService.getSectionData(FccGlobalConstant.UI_BANK_DETAILS, undefined, this.isMasterRequired);
  this.provisionalTagValue =
  this.stateService.getSectionData(FccGlobalConstant.UI_GENERAL_DETAIL).get(FccGlobalConstant.PROVISIONAL_STATUS).value;
  this.mode =
  this.stateService.getSectionData(FccGlobalConstant.UI_GENERAL_DETAIL, undefined, this.isMasterRequired).get('advSendMode').value;
  this.disableProvisionalBank;
  this.confirmationPartyValue = this.stateService
  .getSectionData(
    FccGlobalConstant.UI_GENERAL_DETAIL,
    undefined,
    this.isMasterRequired
  )
  .get("bgConfInstructions").value;

  this.generalDetails = this.stateService
  .getSectionData(
    FccGlobalConstant.UI_GENERAL_DETAIL,
    undefined,
    this.isMasterRequired
  );

  this.subProductValue = this.stateService
  .getSectionData(
    FccGlobalConstant.UI_GENERAL_DETAIL,
    undefined,
    this.isMasterRequired
  )
  .get("bgSubProductCode").value;
  if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND && this.subProductValue[0]
    && this.subProductValue[0].value === FccGlobalConstant.STBY) {
  this.subProductValue=this.subProductValue[0].value;
}
  this.option = this.commonService.getQueryParametersFromKey('option');
  this.modeRef = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
  this.operation = this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPERATION);
  this.getCorporateBanks();
  this.getCorporateReferences();
  if (!this.commonService.isUpdateRefSubScribed)
  {
    this.multiBankService.myUpdateRefonEntityChangeSub = this.multiBankService.updateRefonEntityChangeSub.subscribe(
      data => {
        if (data) {
          this.commonService.isUpdateRefSubScribed = true;
          this.getCorporateBanks();
          this.getCorporateReferences();
        }
      }
    );
  }
  this.removeMandatory();
  if (this.modeRef === FccGlobalConstant.DRAFT_OPTION){
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();
    const event = {
      value : this.form.get('uiBankNameList').value
    };
    this.onClickUiBankNameList(event);
  }
  if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND) {
    this.amendFormFields();
    this.commonService.formatForm(this.form);
    const event = {
      value : this.form.get('uiBankNameList').value
    };
    this.onClickUiBankNameList(event);
  }
}


handleOnChange() {
  if (this.issuingBankComponent) {
    this.issuingBankComponent.ngOnDestroy();
  }
  if (this.adviseThroughBankComponent) {
    this.adviseThroughBankComponent.ngOnDestroy();
  }
  if (this.localAdviseThroughBankComponent) {
    this.localAdviseThroughBankComponent.ngOnDestroy();
  }
  if (this.advisingBankComponent) {
    this.advisingBankComponent.ngOnDestroy();
  }
  if (this.confirmingBankComponent) {
    this.confirmingBankComponent.ngOnDestroy();
  }
}

removeMandatory() {
  if (this.option === FccGlobalConstant.TEMPLATE) {
    this.setMandatoryField(this.form, 'uiBankNameList', false);
    this.setMandatoryField(this.form, 'issuerReferenceList', false);
    this.form.get('uiBankNameList').setErrors({ required: false });
    this.form.get('uiBankNameList').updateValueAndValidity();
    this.form.get('uiBankNameList').clearValidators();
    this.form.get('uiBankNameList').updateValueAndValidity();
    this.form.get('issuerReferenceList').setErrors({ required: false });
    this.form.get('issuerReferenceList').updateValueAndValidity();
    this.form.get('issuerReferenceList').clearValidators();
    this.form.get('issuerReferenceList').updateValueAndValidity();
  }
}

ngAfterViewInit() {
 // this.uiProductService.uiBankDetailsAfterViewInit(this.subProductValue, this.confirmationPartyValue, this.form, this.elementRef);
  // TODO :: Retain the below commented code once the component extension works fine.
  // const confirmingBankFields = ['confirmingBankIcons', 'confirmingSwiftCode', 'confirmingBankName',
  // 'confirmingBankFirstAddress', 'confirmingBankSecondAddress', 'confirmingBankThirdAddress'];
  // if (this.subProductValue === FccGlobalConstant.STBY && this.confirmationPartyValue !== FccBusinessConstantsService.WITHOUT_03) {
  //    if (this.form.get('uiConfirmingBank')) {
  //     this.toggleControls(this.form.get('uiConfirmingBank'), confirmingBankFields, true);
  //     this.form.get('uiConfirmingBank')[this.rendered] = true;
  //  }
  //  } else {
  //   this.elementRef.nativeElement.querySelectorAll('.mat-tab-label.mat-focus-indicator.mat-ripple')
  //   [FccGlobalConstant.LENGTH_3].style.display = 'none';
  //   if (this.form.get('uiConfirmingBank')) {
  //   this.form.get('uiConfirmingBank').reset();
  //   this.toggleControls(this.form.get('uiConfirmingBank'), confirmingBankFields, false);
  //   this.form.get('uiConfirmingBank')[this.rendered] = false;
  //   }
  // }
  // this.tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
  // if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND) {
  //   this.amendFormFields();
  // }
}

handleControlComponentsData(event: any) {
  // this.uiProductService.uiBankDetailsAfterViewInit(this.subProductValue, this.confirmationPartyValue, this.form, event);
  if (event.has('bankDetailsTab') && event.get('bankDetailsTab').has('querySelectorAllValue')) {
    this.uiProductService.uiBankDetailsAfterViewInit(this.subProductValue, this.confirmationPartyValue, this.form, event);
   // event.get("bankDetailsTab").get("querySelectorAllValue")[FccGlobalConstant.LENGTH_3].style.display = 'none';
  }
}


amendFormFields() {
  this.amendCommonService.setValueFromMasterToPrevious(FccGlobalConstant.UI_BANK_DETAILS);
}

private renderDependentFields(displayFields?: any,
                              hideFields?: any) {
if (displayFields) {
this.toggleControls(this.form, displayFields, true);

}
if (hideFields) {
this.toggleControls(this.form, hideFields, false);
this.setValueToNull(hideFields);
}

}
setValueToNull(fieldName: any[]) {
  let index: any;
  for (index = 0; index < fieldName.length; index++) {
    this.form.controls[fieldName[index]].setValue('');
  }
}

getCorporateBanks() {
  this.selectedEntity = this.stateService.getSectionData(FccGlobalConstant.UI_APPLICANT_BENEFICIARY_DETAILS, undefined,
    this.isMasterRequired).get('applicantEntity')?.value;
  if (typeof this.selectedEntity === 'object'){
    this.selectedEntity = this.selectedEntity?.shortName;
  }
  this.multiBankService.setCurrentEntity(this.selectedEntity);
  this.setBankNameList();
  const defaultFirst = (this.corporateBanks && this.corporateBanks.length === 1) ? true : false;
  const val = this.dropDownAPIservice.getInputDropdownValue(this.corporateBanks,
    'uiBankNameList', this.form, defaultFirst);
  this.patchFieldParameters(this.form.get('uiBankNameList'), { options: this.corporateBanks });
  if (val && this.commonService.isnonEMptyString(val)) {
    this.form.get('uiBankNameList').setValue(val);
  }
  if (this.modeRef == FccGlobalConstant.VIEW && this.operation == FccGlobalConstant.LIST_INQUIRY)
  {
    const valObj = { label: String, value: String };
  const valueDisplayed = this.dropDownAPIservice
  .getDropDownFilterValueObj(this.corporateBanks, FccGlobalConstant.UI_BANK_NAME_LIST, this.form);
  valObj.label = valueDisplayed[FccGlobalConstant.LABEL];
  if (valObj)
  {
    this.form.get(FccGlobalConstant.RECIPIENT_BANK_NAME).setValue(valObj.label);
  if(this.stateService.getSectionData(FccGlobalConstant.UI_BANK_DETAILS, undefined, false, FccGlobalConstant.EVENT_STATE))
  {
    this.stateService.getSectionData(FccGlobalConstant.UI_BANK_DETAILS, undefined, false, FccGlobalConstant.EVENT_STATE)
    .get(FccGlobalConstant.RECIPIENT_BANK_NAME).setValue(valObj.label);
    this.stateService.getSectionData(FccGlobalConstant.UI_BANK_DETAILS, undefined, false, FccGlobalConstant.EVENT_STATE)
    .get(FccGlobalConstant.UI_BANK_NAME_LIST).setValue(valObj.label);
  }
}
  }
  const valueDisplayed = this.dropDownAPIservice
  .getDropDownFilterValueObj(this.corporateBanks, FccGlobalConstant.UI_BANK_NAME_LIST, this.form);
  if (valueDisplayed) {
    this.form.get(FccGlobalConstant.RECIPIENT_BANK_NAME).setValue(valueDisplayed[FccGlobalConstant.LABEL]);
  }
  if (this.corporateBanks.length === FccGlobalConstant.LENGTH_1) {
    this.form.get('uiBankNameList')[FccGlobalConstant.PARAMS][FccGlobalConstant.DISABLED] = true;
  }
  const generalDetails = this.stateService.getSectionData('uiGeneralDetails');
  const prov = generalDetails.get(FccGlobalConstant.PROVISIONAL_STATUS)[this.params][FccGlobalConstant.PROVISIONALRENDERED];
  const isAnyBanProv = generalDetails.get(FccGlobalConstant.PROVISIONAL_STATUS)[this.params][FccGlobalConstant.ISANYPROVBANKAVL];
  if (this.corporateBanks.length === FccGlobalConstant.LENGTH_1 && isAnyBanProv) {
    if(val && this.commonService.isnonEMptyString(val)){
      this.disableProvisionalBank = true;
      this.disableProvisionalBank = this.uiProductService.keyDataResponseBank(val, this.disableProvisionalBank);
      if(this.disableProvisionalBank){
        generalDetails.get(FccGlobalConstant.PROVISIONAL_STATUS).setValue('N');
        generalDetails.get(FccGlobalConstant.PROVISIONAL_STATUS)[this.params][FccGlobalConstant.PROVISIONALRENDERED] = false;
        generalDetails.get(FccGlobalConstant.PROVISIONAL_STATUS)[this.params][FccGlobalConstant.RENDERED] = false;
      }
      if(!this.disableProvisionalBank){
        generalDetails.get(FccGlobalConstant.PROVISIONAL_STATUS)[this.params][FccGlobalConstant.PROVISIONALRENDERED] = true;
        generalDetails.get(FccGlobalConstant.PROVISIONAL_STATUS)[this.params][FccGlobalConstant.RENDERED] = true;
      }
    generalDetails.get(FccGlobalConstant.PROVISIONAL_STATUS).updateValueAndValidity();
    generalDetails.updateValueAndValidity();
  }
  } else if(this.corporateBanks.length > 1 && !prov && isAnyBanProv) {
    generalDetails.get(FccGlobalConstant.PROVISIONAL_STATUS)[this.params][FccGlobalConstant.PROVISIONALRENDERED] = true;
    generalDetails.get(FccGlobalConstant.PROVISIONAL_STATUS)[this.params][FccGlobalConstant.RENDERED] = true;
    generalDetails.get(FccGlobalConstant.PROVISIONAL_STATUS).updateValueAndValidity();
    generalDetails.updateValueAndValidity();
  }
  if (val && this.commonService.isnonEMptyString(val)) {
    this.multiBankService.setCurrentBank(val);
  }
  if (this.taskService.getTaskBank()){
    if (this.corporateBanks && this.corporateBanks.length === 1) {
      this.form.get('uiBankNameList').setValue(this.taskService.getTaskBank().value);
      this.multiBankService.setCurrentBank(this.taskService.getTaskBank().value);
      this.taskService.setTaskBank(this.corporateBanks[0]);
    } else if (this.corporateBanks && this.corporateBanks.length > 1
       && val && this.commonService.isnonEMptyString(val)) {
      const filteredBank = this.corporateBanks.filter(rec=>rec.value === val);
      if (filteredBank && filteredBank.length > 0){
        this.taskService.setTaskBank(filteredBank[0]);
        this.form.get('uiBankNameList').setValue(this.taskService.getTaskBank().value);
        this.multiBankService.setCurrentBank(this.taskService.getTaskBank().value);
      }
    }
  } else {
    // this.taskService.setTaskBank(this.corporateBanks[0]);
    // Creating issue in case of multibank customer. So checking multibank and if not setting first as default
    if (val && this.commonService.isnonEMptyString(val)) {
      const filteredBank = this.corporateBanks.filter(rec=>rec.value === val);
      if (filteredBank && filteredBank.length > 0){
        this.taskService.setTaskBank(filteredBank[0]);
      } else if (this.corporateBanks && this.corporateBanks.length === 1){
        this.taskService.setTaskBank(this.corporateBanks[0]);
      }
    } else if (this.corporateBanks && this.corporateBanks.length === 1){
      this.taskService.setTaskBank(this.corporateBanks[0]);
    }
  }
  if (this.commonService.getUserDateTimezone() &&
    this.commonService.getUserDateTimezone().getValue() && this.taskService.getTaskBank() &&
    this.commonService.getUserDateTimezone().getValue() !== this.taskService.getTaskBank()?.timezone) {
    this.form.get('bankTimezoneMessage')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
  } else {
    this.form.get('bankTimezoneMessage')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
  }
  if (this.tnxTypeCode && this.tnxTypeCode === FccGlobalConstant.N002_AMEND
      && this.form.get('recipientBankName').value !== FccGlobalConstant.EMPTY_STRING) {
    this.patchFieldParameters(this.form.get('recipientBankName'), { amendPersistenceSave: true });
    const valObj = { label: String, value: String };
    const valueDisplayedBank = this.dropDownAPIservice.getDropDownFilterValueObj(this.corporateBanks, 'recipientBankName', this.form);
    if(this.commonService.isnonEMptyString(valueDisplayedBank)){
    valObj.label = valueDisplayedBank[FccGlobalConstant.LABEL];
    if (valObj) {
      this.form.get('recipientBankName').setValue(valObj.label);
    }
   }
  }
  }

setBankNameList() {
  if (this.nameOrAbbvName === 'abbv_name') {
    this.corporateBanks = [];
    this.multiBankService.getBankList().forEach(bank => {
      bank.label = bank.value;
      this.corporateBanks.push(bank);
    });
  } else {
    this.corporateBanks = [];
    this.multiBankService.getBankList().forEach(bank => {
      this.corporateBanks.push(bank);
    });
  }
}

onClickUiBankNameList(event) {
  if (event.value) {
    this.disableProvisionalBank = true;
    this.disableProvisionalBank = this.uiProductService.keyDataResponseBank(event.value, this.disableProvisionalBank);
    const generalDetails = this.stateService.getSectionData('uiGeneralDetails');
    this.multiBankService.setCurrentBank(event.value);
    const taskBank = this.corporateBanks.filter((item) => item.value === event.value);
    this.taskService.setTaskBank(taskBank[0]);
    if (this.commonService.getUserDateTimezone() && taskBank && taskBank.length > 0 &&
      this.commonService.getUserDateTimezone().getValue() &&
      this.commonService.getUserDateTimezone().getValue() !== taskBank[0].timezone) {
      this.form.get('bankTimezoneMessage')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
    } else {
      this.form.get('bankTimezoneMessage')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
    }
    if (this.corporateBanks && this.corporateBanks.length > 1 && taskBank && taskBank.length > 0) {
      this.validateOtherSectionDates(this.form.get('uiBankNameList')[this.params]['sectionToValidate'],
      taskBank[0].timezone);
    }
    this.setIssuerReferenceList();
    const reqURl = `${this.fccGlobalConstantService.corporateBanks}/${taskBank[0].value}`;
    this.corporateCommonService.getValues(reqURl).subscribe(response => {
    if (response.status === 200) {
      this.form.get('uiIssuingBank').get('issuingBankName').setValue(response.body.name);
          if (response.body.SWIFTAddress) {
            this.form.get('uiIssuingBank').get('issuingBankFirstAddress').setValue(response.body.SWIFTAddress.line1);
            this.form.get('uiIssuingBank').get('issuingBankSecondAddress').setValue(response.body.SWIFTAddress.line2);
            this.form.get('uiIssuingBank').get('issuingBankThirdAddress').setValue(response.body.SWIFTAddress.line3);
          }
          if (response.body.isoCode) {
            this.form.get('uiIssuingBank').get('issuingBankswiftCode').setValue(response.body.isoCode);
          } else {
            this.form.get('uiIssuingBank').get('issuingBankswiftCode').setValue('');
          }
        }
      });
    if(this.provisionalTagValue === 'Y' && this.disableProvisionalBank ){
      this.chipSelection(event, FccGlobalConstant.PROVISIONAL_MSG);
      generalDetails.get(FccGlobalConstant.PROVISIONAL_STATUS).setValue('N');
      generalDetails.get(FccGlobalConstant.PROVISIONAL_STATUS)[this.params][FccGlobalConstant.DISABLED] = true;
      generalDetails.get(FccGlobalConstant.PROVISIONAL_STATUS).updateValueAndValidity();
      generalDetails.updateValueAndValidity();
    }
    else if(this.provisionalTagValue === 'Y'){
      generalDetails.get(FccGlobalConstant.PROVISIONAL_STATUS).setValue('Y');
      generalDetails.get(FccGlobalConstant.PROVISIONAL_STATUS).updateValueAndValidity();
      generalDetails.updateValueAndValidity();
    }
    if(!this.disableProvisionalBank && !this.uiProductService.enableDisableProvGurtType()){
      generalDetails.get(FccGlobalConstant.PROVISIONAL_STATUS)[this.params][FccGlobalConstant.DISABLED] = false;
      generalDetails.get(FccGlobalConstant.PROVISIONAL_STATUS).updateValueAndValidity();
      generalDetails.updateValueAndValidity();
    }
    if(this.disableProvisionalBank){
      generalDetails.get(FccGlobalConstant.PROVISIONAL_STATUS)[this.params][FccGlobalConstant.DISABLED] = true;
      generalDetails.get(FccGlobalConstant.PROVISIONAL_STATUS).updateValueAndValidity();
      generalDetails.updateValueAndValidity();
    }
  }
}

chipSelection(data , message) {
  const presentValue = data[FccGlobalConstant.SOURCE][FccGlobalConstant.VALUE];
  this.prevCreateFrom = this.taskService.taskBank === undefined ? presentValue : this.taskService.taskBank.value;
  const data1 = {
      controlName: 'bankNameList',
      previousValue: this.prevCreateFrom,
      presentValue,
      event: true,
      locaKey: message
    };
  this.commonService.openConfirmationDialog$.next(data1);
}

getCorporateReferences() {
  this.patchFieldParameters(this.form.get('issuerReferenceList'), { options: [] });
  this.entityName = this.stateService
  .getSectionData(
    "uiApplicantBeneficiaryDetails",
    undefined,
    this.isMasterRequired
  )
  .get("applicantEntity").value.shortName;

  if (this.entityName === '') {
    this.form.get('issuerReferenceList')[this.params][this.readOnly] = true;
  } else {
    this.form.get('issuerReferenceList')[this.params][this.readOnly] = false;
  }
  this.setIssuerReferenceList();
}

setIssuerReferenceList() {
  this.corporateReferences = [];
  const referenceList = this.multiBankService.getReferenceList();
  referenceList.forEach(reference => {
    this.corporateReferences.push(reference);
  });
  const isDefaultFirst = this.corporateReferences.length === FccGlobalConstant.LENGTH_1;
  let val = this.dropDownAPIservice.getInputDropdownValue(this.corporateReferences, 'issuerReferenceList', this.form, isDefaultFirst);
  this.patchFieldParameters(this.form.get('issuerReferenceList'), { options: this.corporateReferences });
  if (this.modeRef == FccGlobalConstant.VIEW && this.operation == FccGlobalConstant.LIST_INQUIRY) {
    const valObj = { label: String, value: String };
    const valueDisplayed = this.dropDownAPIservice
    .getDropDownFilterValueObj(this.corporateReferences, FccGlobalConstant.ISSUER_REF_LIST, this.form);
    valObj.label = valueDisplayed[FccGlobalConstant.LABEL];
    if (valObj)
    {
      this.form.get(FccGlobalConstant.ISSUER_REF_LIST).setValue(valObj.label);
    if(this.stateService.getSectionData(FccGlobalConstant.UI_BANK_DETAILS, undefined, false, FccGlobalConstant.EVENT_STATE))
    {
      this.stateService.getSectionData(FccGlobalConstant.UI_BANK_DETAILS, undefined, false, FccGlobalConstant.EVENT_STATE)
      .get(FccGlobalConstant.ISSUER_REF_LIST).setValue(valObj.label);
    }
  }
}
  val = this.multiBankService.updateRefonEntityChange && !isDefaultFirst && !val ? '' : val;
  this.form.get('issuerReferenceList').setValue(val);
  if (this.corporateReferences.length === 1) {
    this.form.get('issuerReferenceList')[this.params][this.readOnly] = true;
    this.form.get('issuerReferenceList')[FccGlobalConstant.PARAMS][FccGlobalConstant.DISABLED] = true;
  } else {
    this.form.get('issuerReferenceList')[this.params][this.readOnly] = false;
    this.form.get('issuerReferenceList')[FccGlobalConstant.PARAMS][FccGlobalConstant.DISABLED] = false;
  }
  if (this.tnxTypeCode && this.tnxTypeCode === FccGlobalConstant.N002_AMEND
    && this.form.get('issuerReferenceList').value !== FccGlobalConstant.EMPTY_STRING) {
    this.patchFieldParameters(this.form.get('issuerReferenceList'), { amendPersistenceSave: true });
    const valObj = { label: String, value: String };
    const valueDisplayed = this.dropDownAPIservice.getDropDownFilterValueObj(this.corporateReferences, 'issuerReferenceList', this.form);
    valObj.label = valueDisplayed[FccGlobalConstant.LABEL];
    if (valObj) {
      this.form.get('issuerReferenceList').setValue(valObj.label);
    }
  }
}

ngOnDestroy() {
  if (this.form.get('uiConfirmingBank') && this.form.get('uiConfirmingBank')[this.rendered] === true ) {
    this.updateConfirmingBankDetails(this.form.get('uiConfirmingBank'));
  }
  /*if (this.form.get('uiLocalAdviseThrough') && this.form.get('uiLocalAdviseThrough')[this.rendered] === true ) {
    this.updateLocalAdviseThroughBank(this.form.get('uiLocalAdviseThrough'));
  }*/
  this.stateService.setStateSection(FccGlobalConstant.UI_BANK_DETAILS, this.form, this.isMasterRequired);
  if(this.entityChange$) {
    this.entityChange$.unsubscribe();
  }
}

/*updateLocalAdviseThroughBank(localadviseThru) {
  const localAdvThruBank = this.stateService
    .getSectionData(
      FccGlobalConstant.UI_BANK_DETAILS,
      undefined,
      this.isMasterRequired
    )
    .get("uiLocalAdviseThrough");
  if (this.generalDetails.get('purposeUI').value !== '01') {
        localAdvThruBank.get('localAdviseThroughSwiftCode')[this.params].rendered = true;
        localAdvThruBank.get('localAdviseThroughName')[this.params].rendered = true;
        localAdvThruBank.get('localAdviseThroughFirstAddress')[this.params].rendered = true;
        localAdvThruBank.get('localAdviseThroughSecondAddress')[this.params].rendered = true;
        localAdvThruBank.get('localAdviseThroughThirdAddress')[this.params].rendered = true;
      }
  }*/

  /*localadviseThru.get('localAdviseThroughSwiftCode').patchValue(localAdvThrough.localAdviseThroughSwiftCode);
  localadviseThru.get('localAdviseThroughName').patchValue(localAdvThrough.localAdviseThroughName);
  localadviseThru.get('localAdviseThroughName').patchValue(localAdvThrough.localAdviseThroughFirstAddress);
  localadviseThru.get('localAdviseThroughName').patchValue(localAdvThrough.localAdviseThroughSecondAddress);
  localadviseThru.get('localAdviseThroughName').patchValue(localAdvThrough.localAdviseThroughThirdAddress);*/

updateConfirmingBankDetails(confirmBankForm){
  const advConf =
  this.stateService.getSectionData(FccGlobalConstant.UI_BANK_DETAILS, undefined, this.isMasterRequired).get('uiAdvisingBank').value;
  const advThruConf = this.stateService
  .getSectionData(
    FccGlobalConstant.UI_BANK_DETAILS,
    undefined,
    this.isMasterRequired
  )
  .get("uiAdviceThrough").value;

  const localAdvThroughConf = this.stateService
  .getSectionData(
    FccGlobalConstant.UI_BANK_DETAILS,
    undefined,
    this.isMasterRequired
  )
  .get("uiLocalAdviseThrough").value;

  if (advConf.advBankConfReq === 'Y' ) {
    confirmBankForm.get('counterPartyList').patchValue(FccGlobalConstant.Advising_Banks);
    confirmBankForm.get('confirmingSwiftCode').patchValue(advConf.advisingswiftCode);
    confirmBankForm.get('confirmingBankName').patchValue(advConf.advisingBankName);
    confirmBankForm.get('confirmingBankFirstAddress').patchValue(advConf.advisingBankFirstAddress);
    confirmBankForm.get('confirmingBankSecondAddress').patchValue(advConf.advisingBankSecondAddress);
    confirmBankForm.get('confirmingBankThirdAddress').patchValue(advConf.advisingBankThirdAddress);
    if (this.mode !== FccBusinessConstantsService.SWIFT) {
      confirmBankForm.get('confirmingBankFourthAddress').patchValue(advConf.advisingBankFourthdAddress);
    }
  } else if (advThruConf.adviseThruBankConfReq === 'Y') {
    confirmBankForm.get('counterPartyList').patchValue(FccGlobalConstant.Advise_Thru_Bank);
    confirmBankForm.get('confirmingSwiftCode').patchValue(advThruConf.advThroughswiftCode);
    confirmBankForm.get('confirmingBankName').patchValue(advThruConf.adviceThroughName);
    confirmBankForm.get('confirmingBankFirstAddress').patchValue(advThruConf.adviceThroughFirstAddress);
    confirmBankForm.get('confirmingBankSecondAddress').patchValue(advThruConf.adviceThroughSecondAddress);
    confirmBankForm.get('confirmingBankThirdAddress').patchValue(advThruConf.adviceThroughThirdAddress);
    if (this.mode !== FccBusinessConstantsService.SWIFT) {
      confirmBankForm.get('confirmingBankFourthAddress').patchValue(advThruConf.adviceThroughFourthdAddress);
    }
}
else if (localAdvThroughConf.localAdviseThroughBankConfReq === 'Y') {
  confirmBankForm.get('counterPartyList').patchValue(FccGlobalConstant.Local_AdviseThru_Bank);
  confirmBankForm.get('confirmingSwiftCode').patchValue(localAdvThroughConf.localAdviseThroughSwiftCode);
  confirmBankForm.get('confirmingBankName').patchValue(localAdvThroughConf.localAdviseThroughName);
  confirmBankForm.get('confirmingBankFirstAddress').patchValue(localAdvThroughConf.localAdviseThroughFirstAddress);
  confirmBankForm.get('confirmingBankSecondAddress').patchValue(localAdvThroughConf.localAdviseThroughSecondAddress);
  confirmBankForm.get('confirmingBankThirdAddress').patchValue(localAdvThroughConf.localAdviseThroughThirdAddress);
  if (this.mode !== FccBusinessConstantsService.SWIFT) {
    confirmBankForm.get('confirmingBankFourthAddress').patchValue(localAdvThroughConf.localAdviseThroughFourthAddress);
  }
}
}

}
