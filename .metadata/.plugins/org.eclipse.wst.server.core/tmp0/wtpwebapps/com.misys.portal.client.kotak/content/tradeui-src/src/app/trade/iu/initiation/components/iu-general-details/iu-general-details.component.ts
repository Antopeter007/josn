import { CommonService } from './../../../../../common/services/common.service';
import { EntityService } from './../../../../../common/services/entity.service';
import { formatDate } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild, AfterContentInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';
import { Constants } from '../../../../../common/constants';
import { validateSwiftCharSet } from '../../../../../common/validators/common-validator';
import { ValidationService } from '../../../../../common/validators/validation.service';
import { IUCommonDataService } from '../../../common/service/iuCommonData.service';
import { CommonDataService } from './../../../../../common/services/common-data.service';
import { TnxIdGeneratorService } from './../../../../../common/services/tnxIdGenerator.service';
import { TradeEventDetailsComponent } from './../../../../common/components/event-details/event-details.component';
import { IUService } from './../../../common/service/iu.service';
import { DropdownOptions } from '../../../common/model/DropdownOptions.model';
import { DropdownObject } from '../../../common/model/DropdownObject.model';
@Component({
  selector: 'fcc-iu-initiate-general-details',
  templateUrl: './iu-general-details.component.html',
  styleUrls: ['./iu-general-details.component.scss']
})
export class IUGeneralDetailsComponent implements OnInit, AfterContentInit {

  public static CONFIRMATION_ICON = 'pi pi-exclamation-triangle';
  @Input() public bgRecord;
  @Output() formReady = new EventEmitter<UntypedFormGroup>();
  @Output() lUStatus = new EventEmitter<any>();
  @Output() resetRenewalDetails = new EventEmitter<any>();
  @Output() resetLUSections = new EventEmitter<any>();
  @Output() entity = new EventEmitter<any>();
  @Output() subProductCodeChange = new EventEmitter<any>();
  @Input() public displayDepuFlag: boolean;
  @Output() resetLUForms = new EventEmitter<any>();
  @Output() displayLUStatus = new EventEmitter<any>();
  @Output() confInstructions = new EventEmitter<UntypedFormGroup>();
  @Output() swiftModeSelected = new EventEmitter<any>();
  generaldetailsSection: UntypedFormGroup;
  referenceAndPurposeSection: UntypedFormGroup;
  viewMode: boolean;
  isMaster: boolean;
  public isOnchangeEvent = false;
  @ViewChild(TradeEventDetailsComponent)tradeEventDetailsComponent: TradeEventDetailsComponent;
  @Input() public entitySelected: string;
  mode: string;
  public isMessageToBank = false;
  isBankUser: boolean;
  public provisionalStatus: string;
  public transmissionMethodObj: DropdownOptions[];
  public purposeTypeObj: any[] = [];
  fromExistingReadOnlyFlag = false;
  confInstType: string;
  transferIndicatorType: string;
  public purposes: any[] = [];
  public purposesForDepu: any[] = [];
  length: any;
  subProductsList;
  displayDgar = false;
  displayStby = false;
  displayDepu = false;
  selected: string;
  undertakingType = '';
  public purposeObj: DropdownObject[];
  purposeSelected: DropdownObject;
  private reloadApplicantSection = false; // default value false.
  isExistingDraftMenu = false;
  public enableLiabilityAmt: boolean;

  constructor(public fb: UntypedFormBuilder, public validationService: ValidationService, public commonData: CommonDataService,
              public commonDataService: IUCommonDataService, public iuService: IUService,  public translate: TranslateService,
              public confirmationService: ConfirmationService,  public tnxIdGeneratorService: TnxIdGeneratorService,
              public entityService: EntityService, public commonService: CommonService) { }
  ngOnInit() {
    this.transmissionMethodObj =  this.commonDataService.getTransmissionMethod('') as DropdownOptions[];
    this.isBankUser = this.commonData.getIsBankUser();
    if (this.isBankUser && (this.commonData.getOption() === Constants.OPTION_EXISTING ||
       (Constants.MODE_DRAFT === this.commonData.getMode() && this.bgRecord.tnxTypeCode === Constants.TYPE_REPORTING))) {
      this.fromExistingReadOnlyFlag = true;
    }
    this.isExistingDraftMenu = (this.bgRecord.tnxTypeCode === Constants.TYPE_REPORTING
      && this.commonData.getMode() === Constants.MODE_DRAFT);
    this.generaldetailsSection = this.fb.group({
      refId: '',
      tnxId: '',
      brchCode: '',
      companyId: '',
      companyName: '',
      templateId: ['', Validators.maxLength(Constants.LENGTH_20)],
      custRefId: ['', [Validators.maxLength(this.commonService.getCustRefIdLength()),
        validateSwiftCharSet(Constants.X_CHAR)]],
      additionalCustRef: ['', [Validators.maxLength(this.commonService.getCustRefIdLength()),
        validateSwiftCharSet(Constants.X_CHAR)]],
      applDate: '',
      beneficiaryReference: ['', [Validators.maxLength(this.commonService.getCustRefIdLength()), validateSwiftCharSet(Constants.X_CHAR)]],
      provisionalStatus: [''],
      advSendMode: ['', [Validators.required]],
      advSendModeText: [{value: '', disabled: true}, [Validators.maxLength(Constants.LENGTH_35),
                                     validateSwiftCharSet(Constants.X_CHAR)]],
     purpose: ['', [Validators.required]],
     subProductCode: ['', [Validators.required]],
     bgConfInstructions: ['03'],
     bgTransferIndicator: [''],
     narrativeTransferConditions: [{value: '', disabled: true}, [Validators.maxLength(Constants.LENGTH_780),
                                      validateSwiftCharSet(Constants.Z_CHAR)]]
    });

    this.commonDataService.setBeneMandatoryVal(true);
    this.getFieldValues();

    this.mode = this.commonDataService.getMode();

    if (this.bgRecord.tnxTypeCode === '13') {
      this.isMessageToBank = true;
    }
    // set Minimum Variation Date
    let minDate;
    minDate = this.generaldetailsSection.get(`applDate`).value;
    if (minDate !== '' && minDate !== null) {
      minDate = this.commonService.getDateObject(minDate);
    }
    this.commonService.setMinFirstDate(minDate);

    // provisional Status service call
    this.getProvisionalValue();

    // Sub product code related changes
    this.setSubProdValue();
    // Emit the form group to the parent
    this.formReady.emit(this.generaldetailsSection);
  }
  ngAfterContentInit() {
    if (this.bgRecord.advSendMode === '99' && !(this.commonData.disableTnx)) {
      this.generaldetailsSection.get('advSendModeText').enable();
    }
    if (this.bgRecord[`bgTransferIndicator`] === 'Y' && !(this.commonData.disableTnx)) {
      this.generaldetailsSection.controls[`narrativeTransferConditions`].enable();
    }
    this.generaldetailsSection.updateValueAndValidity();
  }

  getFieldValues() {
    this.generaldetailsSection.patchValue({
      refId: this.bgRecord.refId,
      templateId: this.bgRecord.templateId,
      custRefId: this.bgRecord.custRefId,
      additionalCustRef: this.bgRecord.additionalCustRef,
      bgIssDateTypeCode: this.bgRecord.bgIssDateTypeCode,
      applDate: this.bgRecord.applDate,
      beneficiaryReference: this.bgRecord.beneficiaryReference,
      provisionalStatus: this.bgRecord.provisionalStatus,
      tnxId: this.bgRecord.tnxId,
      brchCode: this.bgRecord.brchCode,
      companyId: this.bgRecord.companyId,
      companyName: this.bgRecord.companyName,
      advSendMode: this.bgRecord.advSendMode,
      advSendModeText: this.bgRecord.advSendModeText,
      purpose: this.bgRecord.purpose,
      subProductCode: this.bgRecord.subProductCode,
      bgConfInstructions: this.bgRecord.bgConfInstructions,
      bgTransferIndicator: this.commonDataService.getCheckboxBooleanValues(this.bgRecord.bgTransferIndicator),
      narrativeTransferConditions: this.bgRecord.narrativeTransferConditions,
    });

    this.commonDataService.setRefId(this.bgRecord.refId);
    if ((this.commonDataService.getTnxType() === '01' || this.commonData.getIsBankUser()) &&
        this.commonDataService.getOption() === Constants.OPTION_EXISTING) {
      this.tnxIdGeneratorService.getTransactionId().subscribe(data => {
        this.commonDataService.setTnxId(data.tnxId);
        this.generaldetailsSection.patchValue({
          tnxId: this.commonDataService.getTnxId()
        });
      });
    }

    if (this.commonDataService.getTnxType() === '01' &&
    (this.commonDataService.getOption() === Constants.OPTION_EXISTING ||
    this.commonDataService.getOption() === Constants.OPTION_REJECTED)) {
      this.generaldetailsSection.get('custRefId').setValue('');
      const format = this.commonService.getUserLanguage() === Constants.LANGUAGE_US ? Constants.DATE_FORMAT : Constants.DATE_FORMAT_DMY;
      this.generaldetailsSection.get('applDate').setValue(formatDate(new Date(), format, Constants.LANGUAGE_EN));
      this.generaldetailsSection.get('bgTransferIndicator').setValue('');
      this.generaldetailsSection.get('narrativeTransferConditions').setValue('');
    }
    if (this.commonDataService.getDisplayMode() === 'view') {
        this.viewMode = true;
    } else {
        this.viewMode = false;
    }
    if (this.commonDataService.getmasterorTnx() === 'master') {
      this.isMaster = true;
    } else {
      this.isMaster = false;
    }
  }

  setSubProdValue() {
    this.iuService.getIUSubProducts().subscribe(data => {
      this.length = data.dropdownOptions.length;
      this.subProductsList = data.dropdownOptions;
      for (let i = 0; i < this.length; i++) {
        const value = data.dropdownOptions[i].value;
        if (value === Constants.STAND_BY) {
          this.displayStby = true;
        } else if (value === Constants.DEMAND_GUARANTEE) {
          this.displayDgar = true;
        } else if (value === Constants.DEPEND_UNDERTAKING) {
          this.displayDepu = true;
        }
      }
      // For Edit case, set the value from the saved details.
      if (this.bgRecord && this.commonDataService.getOption() !== Constants.OPTION_SCRATCH_GUARANTEE &&
      (this.bgRecord.subProductCode !== '' && this.bgRecord.subProductCode !== null)) {
        this.getUserEntityforEditScreen();
       } else if (this.bgRecord.subProductCode === '' || this.bgRecord.subProductCode === null) {
        this.getUserEntity(data);
       } else {
         this.getUserEntity(data);
        }
      if (this.commonDataService.isFromBankTemplateOption &&
        ((this.bgRecord.subProductCode != null && this.bgRecord.subProductCode !== '' ))) {
          this.generaldetailsSection.get('subProductCode').disable();
        }
      if (this.displayDepu || this.displayDgar || this.displayStby) {
       this.getIUPurposeValues();
      }
    });
  }
  enableOrDisableFields(inputField: string, enabledField: string, expectedValue: string) {
    if (this.generaldetailsSection.get(inputField).value === expectedValue) {
      this.generaldetailsSection.get(enabledField).markAsUntouched({ onlySelf: true });
      this.generaldetailsSection.get(enabledField).markAsPristine({ onlySelf: true });
      this.generaldetailsSection.get(enabledField).updateValueAndValidity();
      this.generaldetailsSection.get(enabledField).enable();
      this.generaldetailsSection.get(enabledField).setValidators([Validators.required]);
    } else {
      this.generaldetailsSection.get(enabledField).setValue('');
      this.generaldetailsSection.get(enabledField).disable();
   }
  }

  changeMethodOfTransmission() {
    this.enableOrDisableFields('advSendMode', 'advSendModeText', '99');
  }

  showLUStatus(purposeStatus) {
    this.lUStatus.emit(purposeStatus);
  }

  resetRenewalSection(flag) {
    this.resetRenewalDetails.emit(Constants.UNDERTAKING_TYPE_IU);
  }

  resetLUSection(resetLUReq) {
    this.resetLUSections.emit(resetLUReq);
  }

  onChangeSubProdCode() {
    this.getUserEntityOnSubProdCodeChange();
    const subProdCode = this.generaldetailsSection.get('subProductCode').value;
    this.commonDataService.setSubProdCode(subProdCode, '');

    // Purposes 'ISCO' and 'ICCO' not available when form of undertaking is DEPU
    if (subProdCode === Constants.DEPEND_UNDERTAKING) {
      this.purposeTypeObj = this.purposesForDepu;
    } else {
      this.purposeTypeObj = this.purposes;
    }
    this.subProductCodeChange.emit(subProdCode);

    if (this.commonDataService.getSubProdCode() !== Constants.STAND_BY) {
      if (this.generaldetailsSection.controls[`bgConfInstructions`]) {
        this.generaldetailsSection.controls[`bgConfInstructions`].clearValidators();
        this.generaldetailsSection.controls[`bgConfInstructions`].setValue('');
        this.setConfInstValue(this.generaldetailsSection.controls[`bgConfInstructions`].value);
      }
      if (this.generaldetailsSection.controls[`bgTransferIndicator`].value &&
        this.generaldetailsSection.controls[`narrativeTransferConditions`]) {
        this.generaldetailsSection.controls[`bgTransferIndicator`].clearValidators();
        this.generaldetailsSection.controls[`bgTransferIndicator`].setValue('');
        this.generaldetailsSection.controls[`narrativeTransferConditions`].clearValidators();
        this.generaldetailsSection.controls[`narrativeTransferConditions`].setValue('');
      }
    } else if (this.generaldetailsSection.controls[`bgConfInstructions`]) {
      this.generaldetailsSection.controls[`bgConfInstructions`].setValue('03');
      this.setConfInstValue(this.generaldetailsSection.controls[`bgConfInstructions`].value);
    }
  }

  setStatusOfLuSection() {
    this.isOnchangeEvent = true;
    if (this.generaldetailsSection.get('purpose').value === '01' && this.commonDataService.getOldPurposeVal() !== '') {
      let confirmationMessage = '';
      let dialogHeader = '';
      this.translate.get('WARNING_TITLE').subscribe((value: string) => {
        dialogHeader = value;
      });
      this.translate.get('RESET_WARNING_MSG').subscribe((value: string) => {
        confirmationMessage = value;
      });
      this.confirmationService.confirm({
        message: confirmationMessage,
        header: dialogHeader,
        icon: IUGeneralDetailsComponent.CONFIRMATION_ICON,
        key: 'resetWarningMsg',
        acceptLabel: this.commonService.getTranslation('USER_ACTION_OK'),
        rejectLabel: 'Cancel',
        accept: () => {
          this.setLUStatus(`true,true`);
        },
        reject: () => {
          this.generaldetailsSection.get('purpose').setValue(this.commonDataService.getOldPurposeVal());
          this.setLUStatus(`false,false`);
        }
      });
    } else {
      this.setLUStatus(`false,true`);
    }
  }

  setLUStatus(isResetLUBeneReq) {
    if (this.generaldetailsSection.get('purpose').value === '02' || this.generaldetailsSection.get('purpose').value === '03') {
      this.commonDataService.setLUStatus(true);
      if (this.commonData.getProductCode() === 'BG' && this.commonData.getIsBankUser()) {
        this.enableLiabilityAmt = false;
      }
    } else {
      this.commonDataService.setLUStatus(false);
      if (this.commonData.getProductCode() === 'BG' && this.commonData.getIsBankUser()) {
        this.enableLiabilityAmt = true;
      } else {
        this.enableLiabilityAmt = false;
      }
    }
    this.commonData.setliabilityAmtFlag(this.enableLiabilityAmt);
    this.lUStatus.emit(this.commonDataService.displayLUSection());
    this.resetLUForms.emit(isResetLUBeneReq);
    this.resetLUSections.emit(isResetLUBeneReq);
  }

  setOldPurposeVal() {
    if (!this.isOnchangeEvent) {
      this.commonDataService.setOldPurposeVal(this.generaldetailsSection.get('purpose').value);
    }
    this.isOnchangeEvent = false;
  }

  onCheckedTransferIndicator() {
    if (this.generaldetailsSection.get(`bgTransferIndicator`).value) {
        this.generaldetailsSection.get(`narrativeTransferConditions`).enable();
    } else {
        this.generaldetailsSection.get(`narrativeTransferConditions`).setValue('');
        this.generaldetailsSection.get(`narrativeTransferConditions`).disable();
    }
  }

  setConfInstValue(value) {
      this.confInstructions.emit(value);
  }

  getProvisionalValue() {
    if (!this.isBankUser) {
      this.iuService.getProvisionalStatus(this.commonDataService.getSubProdCode(), null).subscribe(data => {
        this.provisionalStatus = data.provisionalStatus as string;
        // provisional checkbox will appear on the basis of config P306
        if (this.provisionalStatus === 'Y') {
          // if provisional status is saved in db, provisional checkbox will be checked
          if (this.bgRecord && this.bgRecord.provisionalStatus === 'Y') {
            this.generaldetailsSection.get('provisionalStatus')
              .setValue(this.commonDataService.getCheckboxBooleanValues(this.provisionalStatus));
          } else {
            this.generaldetailsSection.get('provisionalStatus')
              .setValue(this.commonDataService.getCheckboxBooleanValues('N'));
          }
        }
      });
    }

    if (this.bgRecord.provisionalStatus !== '') {
      this.generaldetailsSection.patchValue({
        provisionalStatus: this.commonDataService.getCheckboxBooleanValues(this.bgRecord.provisionalStatus),
      });
    }
  }

  getIUPurposeValues() {
    this.iuService.getIUPurposes().subscribe(purposes => {
      this.purposeObj = purposes.dropdownOptions as DropdownObject[];
      if (purposes.dropdownOptions.length === 1) {
        this.purposeSelected = purposes.dropdownOptions[0] as DropdownObject;
      }
      this.purposeObj.forEach(purposeData => {
        const purposeElement: any = {};
        purposeElement.label = purposeData.name;
        purposeElement.value = purposeData.value;
        if (this.selected === Constants.DEPEND_UNDERTAKING && purposeData.value === '01') {
          this.purposeTypeObj.push(purposeElement);
          this.purposesForDepu.push(purposeElement);
        } else if (this.selected !== Constants.DEPEND_UNDERTAKING) {
          if (purposeData.value === '01') {
            this.purposesForDepu.push(purposeElement);
          }
          this.purposeTypeObj.push(purposeElement);
        }
        this.purposes = this.purposeTypeObj;
        if (purposeData.value === this.bgRecord.purpose) {
          this.generaldetailsSection.get('purpose').setValue(purposeData.value);
        }
      });
    });
  }

  getUserEntityforEditScreen() {
    if (this.bgRecord.subProductCode !== '' && this.bgRecord.subProductCode !== null) {
      this.selected = this.bgRecord.subProductCode;
      }
    this.commonDataService.setSubProdCode(this.bgRecord.subProductCode, this.undertakingType);

    if (!this.isBankUser) {
      this.entityService.getUserEntities('').subscribe(entityData => {
        if (entityData !== null && entityData.items !== null) {
          this.commonService.setNumberOfEntities(entityData.items.length);
          if (entityData.items.length === 1) {
            this.commonData.setEntity(entityData.items[0].ABBVNAME);
            this.bgRecord.applicant_name = entityData.items[0].NAME;
            this.bgRecord.applicant_address_line_1 = entityData.items[0].ADDRESSLINE1;
            this.bgRecord.applicant_address_line_2 = entityData.items[0].ADDRESSLINE2;
            this.bgRecord.applicant_dom = entityData.items[0].DOMICILE;
            this.bgRecord.applicant_country = entityData.items[0].COUNTRY;
          }
        } else {
          this.commonService.setNumberOfEntities(0);
        }
        // no need to reload applicant section for draft mode, as data will be retained from patch values.
        this.entity.emit(true);
      });
    }
  }

  getUserEntity(data) {
    if (this.length === 1) {
      this.selected = data.dropdownOptions[0].value;
      if (this.displayStby) {
        this.generaldetailsSection.controls[`bgConfInstructions`].setValue('03');
        this.setConfInstValue(this.generaldetailsSection.controls[`bgConfInstructions`].value);
      }
    } else if (this.displayDgar) {
      this.selected = Constants.DEMAND_GUARANTEE;
    } else if (this.displayStby) {
      this.selected = Constants.STAND_BY;
      this.generaldetailsSection.controls[`bgConfInstructions`].setValue('03');
      this.setConfInstValue(this.generaldetailsSection.controls[`bgConfInstructions`].value);
    } else if (this.displayDepu) {
      this.selected = Constants.DEPEND_UNDERTAKING;
    }
    this.commonDataService.setSubProdCode(this.selected, this.undertakingType);
    if (!this.isBankUser) {
      this.entityService.getUserEntities('').subscribe(entityData => {
        if (entityData !== null && entityData.items !== null) {
          this.commonService.setNumberOfEntities(entityData.items.length);
          if (entityData.items.length === 1) {
            this.commonData.setEntity(entityData.items[0].ABBVNAME);
            this.bgRecord.applicantName = entityData.items[0].NAME;
            this.bgRecord.applicantAddressLine1 = entityData.items[0].ADDRESSLINE1;
            this.bgRecord.applicantAddressLine2 = entityData.items[0].ADDRESSLINE2;
            this.bgRecord.applicantDom = entityData.items[0].DOMICILE;
            this.bgRecord.applicantCountry = entityData.items[0].COUNTRY;
          }
        } else {
          this.commonService.setNumberOfEntities(0);
        }
        // while initiating IU from scratch reloading applicant section to show entity and other details.
        this.entity.emit(true);
      });
    }
  }

  getUserEntityOnSubProdCodeChange() {
    if (!this.isBankUser) {
      this.entityService.getUserEntities('').subscribe(data => {
        if (data !== null && data.items !== null) {
          const totalEntities = data.items.length;
          if (totalEntities !== this.commonService.getNumberOfEntities()) {
            this.reloadApplicantSection = true;
          }
          this.checkEntitiesField(totalEntities, data);
          this.commonService.setNumberOfEntities(totalEntities);
        } else {
          this.commonService.setNumberOfEntities(0);
        }
        this.entity.emit(this.reloadApplicantSection);
      });
    }
  }

  checkEntitiesField(totalEntities, data) {
    // reloadApplicantSection flag to check if applicant details need to be cleared or retained
    // on the basis of entities and sub product code permissions.
    if (totalEntities === 0) {
      this.commonData.setEntity('');
    } else if (totalEntities === 1) {
      this.commonData.setEntity(data.items[0].ABBVNAME);
      this.populateEntityData(data.items[0], totalEntities);
    } else {
      for (const i in data.items) {
        if (data.items[i].ABBVNAME === this.commonData.getEntity()) {
          this.populateEntityData(data.items[i], totalEntities);
          break;
        }
      }
    }
  }

  generatePdf(generatePdfService) {
    if (this.mode !== 'UNSIGNED' && this.commonDataService.getTnxStatCode() !== '04' &&
    this.tradeEventDetailsComponent) {
      this.tradeEventDetailsComponent.generatePdf(generatePdfService);
    }
    generatePdfService.setSectionDetails('HEADER_GENERAL_DETAILS', true, false, 'referenceDetails');
  }

  populateEntityData(item, totalEntities) {
    this.bgRecord.entity = item.ABBVNAME;
    this.bgRecord.applicantName = item.NAME;
    this.bgRecord.applicantAddressLine1 = item.ADDRESSLINE1;
    this.bgRecord.applicantAddressLine2 = item.ADDRESSLINE2;
    this.bgRecord.applicantDom = item.DOMICILE;
    this.bgRecord.applicantCountry = item.COUNTRY;
    if (totalEntities > 1 && this.commonService.getNumberOfEntities() > 1) {
      this.reloadApplicantSection = false;
    }
  }
  setSwiftModeIfSelected() {
    this.swiftModeSelected.emit(this.generaldetailsSection.get('advSendMode').value === '01' &&
     !(this.commonData.getIsBankUser() && this.commonData.getProductCode() === Constants.PRODUCT_CODE_RU));
  }
}
