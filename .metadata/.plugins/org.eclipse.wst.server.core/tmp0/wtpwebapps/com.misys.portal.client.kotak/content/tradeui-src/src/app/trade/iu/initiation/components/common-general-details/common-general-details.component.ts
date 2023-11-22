import { DatePipe } from '@angular/common';
import { AfterContentInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormGroup, Validators, AbstractControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';
import { Constants } from '../../../../../common/constants';
import { CommonDataService } from '../../../../../common/services/common-data.service';
import { CommonService } from '../../../../../common/services/common.service';
import { EntityService } from '../../../../../common/services/entity.service';
import { LicenseService } from '../../../../../common/services/license.service';
import { StaticDataService } from '../../../../../common/services/staticData.service';
import { validateDate, validateDates, validateExpDateWithOtherDate, validateSwiftCharSet } from '../../../../../common/validators/common-validator';
import { ValidationService } from '../../../../../common/validators/validation.service';
import { CodeData } from '../../../../common/model/codeData.model';
import { IUService } from '../../../common/service/iu.service';
import { IUCommonDataService } from '../../../common/service/iuCommonData.service';
import { DropdownOptions } from './../../../common/model/DropdownOptions.model';
import { IssuedUndertakingRequest } from '../../../common/model/IssuedUndertakingRequest';


@Component({
  selector: 'fcc-iu-common-general-details',
  templateUrl: './common-general-details.component.html',
  styleUrls: ['./common-general-details.component.scss']
})


export class CommonGeneralDetailsComponent implements OnInit, AfterContentInit {
  public static CONFIRMATION_ICON = 'pi pi-exclamation-triangle';

  @Input() public bgRecord;
  @Input() public sectionForm: UntypedFormGroup;
  @Input() public undertakingType: string;
  @Output() resetRenewalDetails = new EventEmitter<any>();
  @Output() downloadBankTemplate = new EventEmitter<any>();
  @Output() confInstructions = new EventEmitter<UntypedFormGroup>();
  @Output() cuConfInstructions = new EventEmitter<UntypedFormGroup>();
  @Output() entity = new EventEmitter<any>();
  @Output() displayLUStatus = new EventEmitter<any>();
  @Output() expDate = new EventEmitter<string>();
  @Output() expiryDateExtension = new EventEmitter<string>();
  issuedundertaking: IssuedUndertakingRequest;
  viewMode: boolean;
  imagePath: string;
  displayDgar = false;
  displayStby = false;
  displayDepu = false;
  displayLuDepu = false;
  subProductsList;
  selected: string;
  luSelected: string;
  length: any;
  tempUndertakingType: string;
  confInstType: string;
  transferIndicatorType: string;
  isSpecimenTemplate: boolean;
  isXslTemplate: boolean;
  isEditorTemplate: boolean;
  bankTemplateLinkLabel: string;
  public isOnchangeEvent = false;
  public issueDateTypeObj: DropdownOptions[] = [];
  typeOfUndertakingObj: any[] = [];
  typeOfUndertaking: CodeData[];
  yearRange: string;
  type: string;
  isBankUser: boolean;
  fromExistingReadOnlyFlag = false;
  showBGExpiryEvent = false;
  showCUExpiryEvent = false;
  dateFormat: string;

  constructor(
    public validationService: ValidationService, public license: LicenseService,
    public commonDataService: IUCommonDataService, public commonService: CommonService,
    public iuService: IUService, public translate: TranslateService, public datePipe: DatePipe,
    public confirmationService: ConfirmationService, public staticDataService: StaticDataService,
    public entityService: EntityService, public commonData: CommonDataService
  ) { }

  ngOnInit() {
    this.dateFormat = this.commonService.getDateFormat();
    if (this.undertakingType === Constants.UNDERTAKING_TYPE_CU &&
      !(this.bgRecord[`cuEffectiveDateTypeCode`] && this.bgRecord[`cuEffectiveDateTypeCode`] !== null
        && this.bgRecord[`cuEffectiveDateTypeCode`] !== '')) {
      this.sectionForm.get(`cuEffectiveDateTypeCode`).setValue(null);
    }
    if (this.undertakingType !== Constants.UNDERTAKING_TYPE_IU &&
      !(this.bgRecord[`${this.undertakingType}TypeCode`] && this.bgRecord[`${this.undertakingType}TypeCode`] !== null
        && this.bgRecord[`${this.undertakingType}TypeCode`] !== '')) {
      this.sectionForm.get(`${this.undertakingType}TypeCode`).setValue(null);
    }
    this.isBankUser = this.commonData.getIsBankUser();
    if (this.isBankUser && (this.commonData.getOption() === Constants.OPTION_EXISTING ||
      (Constants.MODE_DRAFT === this.commonData.getMode() && this.bgRecord.tnxTypeCode === Constants.TYPE_REPORTING))) {
      this.fromExistingReadOnlyFlag = true;
    }

    setTimeout(() => {
    this.staticDataService.getCodeData('C082').subscribe(data => {
      this.typeOfUndertaking = data.codeData;
      this.typeOfUndertaking.forEach(types => {
        const undertakingElement: any = {};
        undertakingElement.label = types.longDesc;
        undertakingElement.value = types.codeVal;
        if (!(undertakingElement.value === '99' && this.undertakingType === 'cu')) {
          this.typeOfUndertakingObj.push(undertakingElement);
        }
        if (!(this.commonDataService.getTnxType() === '01' && this.commonDataService.getOption() === Constants.OPTION_EXISTING)
        && !(this.commonDataService.getTnxType() === '01' && this.commonDataService.getOption() === Constants.OPTION_REJECTED)) {
        if (this.bgRecord[`${this.type}TypeCode`] === undertakingElement.value) {
          this.sectionForm.get(`${this.type}TypeCode`).setValue(undertakingElement.value);
        }
      }
      });
    });
  }, Constants.NUMBER_500);
    this.imagePath = this.commonService.getImagePath();
    this.yearRange = this.commonService.getYearRange();
    if (this.commonDataService.getDisplayMode() === 'view') {
      this.viewMode = true;
    } else {
      this.viewMode = false;
      if (this.bgRecord.bgExpDateTypeCode && (this.bgRecord.bgExpDateTypeCode === '01' || this.bgRecord.bgExpDateTypeCode === '03')) {
        this.showBGExpiryEvent = true;
      }
      if (this.undertakingType === 'cu') {
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
              this.displayLuDepu = true;
            }
          }
          // For Edit case, set the value from the saved details.
          if (this.bgRecord && this.commonDataService.getOption() !== Constants.OPTION_SCRATCH_GUARANTEE
            && this.commonDataService.getTnxType() !== '01' && this.commonDataService.getOption() !== Constants.OPTION_EXISTING) {
            if (this.bgRecord.cuSubProductCode !== '') {
              this.luSelected = this.bgRecord.cuSubProductCode;
            } else {
              this.luSelected = this.commonDataService.getCUSubProdCode();
            }
            if (this.undertakingType === 'cu') {
              this.commonDataService.setSubProdCode(this.bgRecord[`${this.undertakingType}SubProductCode`], this.undertakingType);
            }
          } else if (this.bgRecord && this.commonDataService.getOption() === Constants.OPTION_TEMPLATE
          && this.commonDataService.getTnxType() === '01') {
            this.luSelected = this.commonDataService.getCUSubProdCode();
          } else {
            if (this.commonDataService.getTnxType() !== '01' && this.commonDataService.getOption() !== Constants.OPTION_EXISTING) {
              this.luSelected = this.commonDataService.getCUSubProdCode();
            }
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
              });
            }
          }
        });
      }

      this.staticDataService.fetchBusinessCodes(Constants.EFFEC_DATE_TYPE_CODE).subscribe(data => {
        this.issueDateTypeObj = data.dropdownOptions as DropdownOptions[];
        if (this.bgRecord.bgIssDateTypeCode !== '' && this.undertakingType === 'bg') {
          this.sectionForm.get(`${this.undertakingType}IssDateTypeCode`).setValue(this.bgRecord.bgIssDateTypeCode);
        } else if (this.commonDataService.getTnxType() !== '01' && this.commonDataService.getOption() !== Constants.OPTION_EXISTING
          && this.bgRecord.cuEffectiveDateTypeCode !== '' && this.undertakingType === 'cu') {
          this.sectionForm.get(`${this.undertakingType}EffectiveDateTypeCode`).setValue(this.bgRecord.cuEffectiveDateTypeCode);
        }
      });
    }
    this.type = this.undertakingType === 'bg' ? 'bg' : this.undertakingType;
    if (this.bgRecord.cuSubProductCode) {
      this.commonDataService.setSubProdCode(this.bgRecord.cuSubProductCode, Constants.UNDERTAKING_TYPE_CU);
    }
    if (this.bgRecord.cuExpDateTypeCode) {
      this.commonDataService.setExpDateType(this.bgRecord.cuExpDateTypeCode, Constants.UNDERTAKING_TYPE_CU);
    }
    if (this.commonDataService.isFromBankTemplateOption && this.type === 'bg') {
      this.sectionForm.controls[`${this.undertakingType}TypeCode`].disable();
      if (this.sectionForm.get(`guaranteeTypeName`)) {
        this.sectionForm.get(`guaranteeTypeName`).disable();
      }
    }
    if (this.commonDataService.isSpecimenTemplate) {
      this.translate.get('VIEW_THE_UNDERTAKING_SPECIMEN').subscribe((value: string) => {
        this.bankTemplateLinkLabel = value;
      });
    } else if (this.commonDataService.isEditorTemplate) {
      this.translate.get('VIEW_EDITED_DOCUMENT').subscribe((value: string) => {
        this.bankTemplateLinkLabel = value;
      });
    } else if (this.commonDataService.isXslTemplate) {
      this.translate.get('PREVIEW_UNDERTAKING_DETAILS').subscribe((value: string) => {
        this.bankTemplateLinkLabel = value;
      });
    }
  }

  ngAfterContentInit() {
    if ((this.bgRecord[`${this.undertakingType}EffectiveDateTypeCode`] === '99') && !(this.commonData.disableTnx)) {
      this.sectionForm.controls[`${this.undertakingType}EffectiveDateTypeDetails`].enable();
    }
    // iss_date_type_code is present only for BG. So handled only for BG
    if (this.undertakingType === 'bg' && this.bgRecord.bgIssDateTypeCode === '99' && !(this.commonData.disableTnx)) {
      this.sectionForm.controls.bgIssDateTypeDetails.enable();
    }
    // only bg_type code has 'other' option. So handled only for BG
    if (this.undertakingType === 'bg' && this.bgRecord.bgTypeCode === '99' && !(this.commonData.disableTnx)) {
      this.sectionForm.controls.bgTypeDetails.enable();
    }
    if (this.undertakingType === 'bg' && this.bgRecord[`subProductCode`] !== '') {
        this.commonDataService.setSubProdCode(this.bgRecord[`subProductCode`], this.undertakingType);
    }
    if (this.bgRecord[`${this.undertakingType}ExpDateTypeCode`] === '02') {
      if (this.undertakingType === 'bg') {
        this.showBGExpiryEvent = false;
      } else if (this.undertakingType === 'cu') {
        this.showCUExpiryEvent = false;
      }
      if (!(this.commonData.disableTnx)) {
        this.sectionForm.controls[`${this.undertakingType}ExpDate`].enable();
      }
      this.sectionForm.controls[`${this.undertakingType}ExpDate`].setValidators(Validators.required);
      this.sectionForm.controls[`${this.undertakingType}ExpEvent`].disable();
      this.commonService.setExpiryDate(this.bgRecord[`${this.undertakingType}ExpDate`], this.undertakingType);
    }
    if (this.bgRecord[`${this.undertakingType}ExpDateTypeCode`] === '01' ||
        this.bgRecord[`${this.undertakingType}ExpDateTypeCode`] === '03') {
      if (this.undertakingType === 'bg') {
        this.showBGExpiryEvent = true;
      } else if (this.undertakingType === 'cu') {
        this.showCUExpiryEvent = true;
      }
      this.sectionForm.controls[`${this.undertakingType}ExpDate`].clearValidators();
      this.sectionForm.controls[`${this.undertakingType}ExpDate`].setErrors(null);
      if (!(this.commonData.disableTnx)) {
        this.sectionForm.controls[`${this.undertakingType}ApproxExpiryDate`].enable();
        this.sectionForm.controls[`${this.undertakingType}ExpEvent`].enable();
      }
      if (this.bgRecord[`${this.undertakingType}ExpDateTypeCode`] === '03') {
        this.sectionForm.controls[`${this.undertakingType}ExpEvent`].setValidators(Validators.required);
      }
    }
    if (this.bgRecord[`${this.undertakingType}ExpDateTypeCode`] !== '') {
      this.commonDataService.setExpDateType(this.bgRecord[`${this.undertakingType}ExpDateTypeCode`], this.undertakingType);
    }
    if (this.commonDataService.getOption() === Constants.OPTION_TEMPLATE && this.undertakingType === 'cu' &&
        this.bgRecord[`${this.undertakingType}ExpDateTypeCode`] === '') {
      this.commonDataService.setExpDateType('', this.undertakingType);
      this.sectionForm.controls[`${this.undertakingType}ExpDateTypeCode`].setValue('');
    }
    if (this.undertakingType === 'cu' && this.bgRecord[`${this.undertakingType}SubProductCode`] !== '') {
        this.commonDataService.setSubProdCode(this.bgRecord[`${this.undertakingType}SubProductCode`], this.undertakingType);
    }
    if (this.bgRecord[`cuTransferIndicator`] === 'Y' && !(this.commonData.disableTnx)
    && this.sectionForm.controls[`narrativeTransferConditionsCu`]) {
      this.sectionForm.controls[`narrativeTransferConditionsCu`].enable();
    }
    if (this.bgRecord[`${this.undertakingType}ExpDate`] !== '') {
      let maxDate;
      maxDate = this.bgRecord[`${this.undertakingType}ExpDate`];
      maxDate = this.commonService.getDateObject(maxDate);
      this.setMaxDateAndType(maxDate);
    }
    this.sectionForm.updateValueAndValidity();
  }

  setValueFromField(cuSubProdCode, undertakingType) {
    const cuSubProdCodeValue = this.commonDataService.getCUSubProdCode();
    if (cuSubProdCodeValue && cuSubProdCodeValue !== null && cuSubProdCodeValue !== '' &&
        (cuSubProdCodeValue === this.sectionForm.get(cuSubProdCode).value)) {
      this.sectionForm.get(cuSubProdCode).reset();
      this.sectionForm.get(cuSubProdCode).setValue('');
      this.commonDataService.setSubProdCode('', undertakingType);
    } else {
      this.commonDataService.setSubProdCode(this.sectionForm.get(cuSubProdCode).value, undertakingType);
      this.onChangeSubProdCode(undertakingType);
    }
  }
  setExpiryTypeFromField(expiryType) {
    if (!(this.commonData.disableTnx)) {
    const cuExpTypeValue = this.commonDataService.getCUExpDateType();
    if (this.undertakingType === Constants.UNDERTAKING_TYPE_CU && cuExpTypeValue && cuExpTypeValue !== null && cuExpTypeValue !== '' &&
        (cuExpTypeValue === this.sectionForm.get(expiryType).value)) {
      this.sectionForm.get(expiryType).reset();
      this.sectionForm.get(expiryType).setValue('');
      this.sectionForm.get(`cuExpEvent`).setValue('');
      this.sectionForm.get(`cuExpEvent`).disable();
      this.sectionForm.get(`cuExpEvent`).clearValidators();
      this.sectionForm.get(`cuExpDate`).setValue('');
      this.sectionForm.get(`cuExpDate`).disable();
      this.sectionForm.get(`cuExpDate`).clearValidators();
      this.sectionForm.get(`cuApproxExpiryDate`).setValue('');
      this.sectionForm.get(`cuApproxExpiryDate`).disable();
      this.sectionForm.get(`cuApproxExpiryDate`).clearValidators();
      this.showCUExpiryEvent = false;
      this.sectionForm.updateValueAndValidity();
      this.commonDataService.setExpDateType('', Constants.UNDERTAKING_TYPE_CU);
    } else {
      this.updateLicenseListExpType();
      this.setVariationFrequencyValidator();
    }
  }
  }

  setMaxDateAndType(maxDate) {
    if (this.undertakingType === Constants.UNDERTAKING_TYPE_IU &&
      (this.commonService.maxDate === undefined || this.commonService.maxDate === null || this.commonService.maxDate === '' )) {
      this.commonService.maxDate = maxDate;
      this.commonService.expiryDateType = Constants.EXPIRY_TYPE;
      } else if (this.undertakingType === Constants.UNDERTAKING_TYPE_CU &&
        (this.commonService.cuMaxDate === undefined || this.commonService.cuMaxDate === null || this.commonService.cuMaxDate === '' )) {
      this.commonService.cuMaxDate = maxDate;
      this.commonService.cuExpiryDateType = Constants.EXPIRY_TYPE;
      }
  }

  onChangeIssuedate() {
    if (this.undertakingType === 'cu') {
      if (this.sectionForm.get(`${this.undertakingType}EffectiveDateTypeCode`).value === '99') {
        this.sectionForm.controls[`${this.undertakingType}EffectiveDateTypeDetails`].setValidators([Validators.required]);
        this.sectionForm.get(`${this.undertakingType}EffectiveDateTypeDetails`).enable();
      } else {
        this.sectionForm.get(`${this.undertakingType}EffectiveDateTypeDetails`).setValue('');
        this.sectionForm.get(`${this.undertakingType}EffectiveDateTypeDetails`).disable();
      }
    } else {
      if (this.sectionForm.get(`${this.undertakingType}IssDateTypeCode`).value === '99') {
        this.sectionForm.controls[`${this.undertakingType}IssDateTypeDetails`].setValidators([Validators.required]);
        this.sectionForm.get(`${this.undertakingType}IssDateTypeDetails`).enable();
      } else {
        this.sectionForm.get(`${this.undertakingType}IssDateTypeDetails`).setValue('');
        this.sectionForm.get(`${this.undertakingType}IssDateTypeDetails`).disable();
      }
    }
  }

  onChangeExpDateTypeCode() {
      if (this.sectionForm.get(`${this.undertakingType}ExpDateTypeCode`).value === '01') {
        this.setSectionFormWhenExpDateTypeUnlimited();
      } else if (this.sectionForm.get(`${this.undertakingType}ExpDateTypeCode`).value === '02') {
        this.setSectionFormWhenExpDateTypeFixed();
      } else if (this.sectionForm.get(`${this.undertakingType}ExpDateTypeCode`).value === '03') {
        this.setSectionFormWhenExpDateTypeProjected();
      }
      this.commonDataService.setExpDateType(this.sectionForm.get(`${this.undertakingType}ExpDateTypeCode`).value, this.undertakingType);
      this.resetRenewalDetails.emit(this.undertakingType);
  }

  setSectionFormWhenExpDateTypeUnlimited() {
    this.commonDataService.setExpDateType('01', this.undertakingType);
    this.sectionForm.get(`${this.undertakingType}ExpDate`).setValue('');
    if (this.undertakingType === 'bg') {
      this.commonDataService.setExpDate('');
    }
    this.sectionForm.get(`${this.undertakingType}ExpDate`).disable();
    this.sectionForm.get(`${this.undertakingType}ExpDate`).clearValidators();
    this.sectionForm.get(`${this.undertakingType}ApproxExpiryDate`).setErrors(null);
    this.sectionForm.get(`${this.undertakingType}ApproxExpiryDate`).clearValidators();
    this.sectionForm.get(`${this.undertakingType}ApproxExpiryDate`).enable();
    this.sectionForm.get(`${this.undertakingType}ApproxExpiryDate`).setValue('');
    this.sectionForm.get(`${this.undertakingType}ExpEvent`).setErrors(null);
    this.sectionForm.get(`${this.undertakingType}ExpEvent`).enable();
    this.sectionForm.get(`${this.undertakingType}ExpEvent`).setValue('');
    this.sectionForm.get(`${this.undertakingType}ExpEvent`).setValidators([Validators.maxLength(Constants.LENGTH_780),
      validateSwiftCharSet(Constants.X_CHAR)]);
    if (this.undertakingType === 'bg') {
      this.showBGExpiryEvent = true;
      this.sectionForm.get('bgExpEvent').markAsUntouched({ onlySelf: true });
      this.sectionForm.get('bgExpEvent').markAsPristine({ onlySelf: true });
    } else if (this.undertakingType === 'cu') {
      this.showCUExpiryEvent = true;
    }
    this.sectionForm.updateValueAndValidity();
  }

  setSectionFormWhenExpDateTypeFixed() {
    this.commonDataService.setExpDateType('02', this.undertakingType);
    this.sectionForm.get(`${this.undertakingType}ExpEvent`).setValue('');
    this.sectionForm.get(`${this.undertakingType}ExpEvent`).disable();
    this.sectionForm.get(`${this.undertakingType}ExpEvent`).clearValidators();
    this.sectionForm.get(`${this.undertakingType}ExpDate`).enable();
    this.sectionForm.get(`${this.undertakingType}ExpDate`).setValue('');
    this.sectionForm.controls[`${this.undertakingType}ExpDate`].setValidators(Validators.required);
    if (this.undertakingType === 'bg') {
      this.showBGExpiryEvent = false;
      this.sectionForm.get('bgExpEvent').markAsUntouched({ onlySelf: true });
      this.sectionForm.get('bgExpEvent').markAsPristine({ onlySelf: true });
    } else if (this.undertakingType === 'cu') {
      this.showCUExpiryEvent = false;
    }
    this.sectionForm.updateValueAndValidity();
  }

  setSectionFormWhenExpDateTypeProjected() {
    this.commonDataService.setExpDateType('03', this.undertakingType);
    this.sectionForm.controls[`${this.undertakingType}ExpDate`].clearValidators();
    this.sectionForm.controls[`${this.undertakingType}ExpDate`].setValue('');
    this.sectionForm.controls[`${this.undertakingType}ExpDate`].setErrors(null);
    this.sectionForm.controls[`${this.undertakingType}ExpEvent`].clearValidators();
    this.sectionForm.controls[`${this.undertakingType}ExpEvent`].setValue('');
    this.sectionForm.controls[`${this.undertakingType}ExpEvent`].setErrors(null);
    if (this.undertakingType === 'bg') {
      this.showBGExpiryEvent = true;
      this.sectionForm.controls[`${this.undertakingType}ExpEvent`].setValidators([Validators.required,
        validateSwiftCharSet(Constants.X_CHAR), Validators.maxLength(Constants.LENGTH_780)]);
      this.commonDataService.setExpDate('');
    } else if (this.undertakingType === 'cu' && this.commonData.getIsBankUser()) {
      this.showCUExpiryEvent = true;
      this.sectionForm.controls[`${this.undertakingType}ExpEvent`].setValidators([Validators.required,
        validateSwiftCharSet(Constants.X_CHAR), Validators.maxLength(Constants.LENGTH_780)]);
    } else {
      this.showCUExpiryEvent = true;
      this.sectionForm.controls[`${this.undertakingType}ExpEvent`].setValidators([validateSwiftCharSet(Constants.X_CHAR),
        Validators.maxLength(Constants.LENGTH_780)]);
    }
    this.sectionForm.get(`${this.undertakingType}ExpEvent`).enable();
    this.sectionForm.get(`${this.undertakingType}ApproxExpiryDate`).clearValidators();
    this.sectionForm.get(`${this.undertakingType}ApproxExpiryDate`).setErrors(null);
    this.sectionForm.get(`${this.undertakingType}ApproxExpiryDate`).enable();
    this.sectionForm.get(`${this.undertakingType}ApproxExpiryDate`).setValue('');
    this.sectionForm.updateValueAndValidity();
  }

  setValidationIssueDate(dateField) {
    this.sectionForm.controls[dateField].clearValidators();
    let relevantExpiryDate;
    if (this.undertakingType === 'cu') {
      if (this.sectionForm.get('cuExpDateTypeCode').value === '02') {
        relevantExpiryDate = 'cuExpDate';
      } else if (this.sectionForm.get('cuExpDateTypeCode').value === '03') {
        relevantExpiryDate = 'cuApproxExpiryDate';
      }
    } else {
      if (this.sectionForm.get('bgExpDateTypeCode').value === '02') {
        relevantExpiryDate = 'bgExpDate';
      } else if (this.sectionForm.get('bgExpDateTypeCode').value === '03') {
        relevantExpiryDate = 'bgApproxExpiryDate';
      }
    }
    if (relevantExpiryDate !== null && relevantExpiryDate !== undefined) {
      this.sectionForm.controls[dateField].setValidators([validateDate(this.sectionForm.get(dateField).value,
        this.sectionForm.get(relevantExpiryDate).value, 'effective date', 'expiry date', 'greaterThan')]);
    }
    this.sectionForm.controls[dateField].updateValueAndValidity();
  }

  setValidatorExpDate(dateField) {
    const format = this.commonService.getUserLanguage() === Constants.LANGUAGE_US ? Constants.DATE_FORMAT : Constants.DATE_FORMAT_DMY;
    const currentDate = this.datePipe.transform(new Date(), format);
    let renSection;
    if (this.undertakingType === 'cu') {
      renSection = this.sectionForm.parent.get(Constants.SECTION_CU_RENEWAL_DETAILS);
    } else {
      renSection = this.sectionForm.parent.get('renewalDetailsSection');
    }
    this.sectionForm.controls[dateField].clearValidators();
    const validatorsSet = [validateExpDateWithOtherDate(this.sectionForm.get(dateField),
                            this.sectionForm.parent.get('generaldetailsSection').get('applDate'), 'application date'),
                          validateDate(this.sectionForm.get(dateField).value, currentDate, Constants.EXPIRY_DATE, 'todays date',
                            Constants.LESSER_THAN)];
    let issueDate: AbstractControl;
    if (this.commonData.getIsBankUser() &&
    this.sectionForm.parent.get('reportingMessageDetailsComponent').get('issDate').value) {
      const bankerSection = this.sectionForm.parent.get('reportingMessageDetailsComponent');
      issueDate = bankerSection.get('issDate');
    } else {
      issueDate = this.undertakingType === 'cu' ? this.sectionForm.get('cuEffectiveDateTypeDetails') :
        this.sectionForm.get('bgIssDateTypeDetails');
    }
    validatorsSet.push(validateExpDateWithOtherDate(this.sectionForm.get(dateField), issueDate, 'effective date'));

    if (this.isBankUser) {
      validatorsSet.push(validateDates(this.sectionForm.get(dateField),
      renSection.get(`${this.undertakingType}FinalExpiryDate`), Constants.EXPIRY_TYPE,
      Constants.FINAL_EXPIRY_DATE, Constants.GREATER_THAN));
      renSection.controls[`${this.undertakingType}FinalExpiryDate`].updateValueAndValidity();
    }
    if (this.commonDataService.getExpDateType() === '02') {
      validatorsSet.push(Validators.required);
    }
    if (this.commonDataService.getExpDateType() === '02') {
      validatorsSet.push(validateExpDateWithOtherDate(this.sectionForm.get(dateField),
        renSection.get(`${this.undertakingType}RenewalCalendarDate`), Constants.CALENDAR_DATE));
      renSection.get(`${this.undertakingType}RenewalCalendarDate`).clearValidators();
      renSection.get(`${this.undertakingType}RenewalCalendarDate`).updateValueAndValidity();
    }
    if (this.commonDataService.getSubProdCode() === Constants.STAND_BY && this.undertakingType !== 'cu') {
      validatorsSet.push(validateExpDateWithOtherDate(this.sectionForm.get(dateField),
        this.sectionForm.parent.get(Constants.SECTION_SHIPMENT_DETAILS).get('lastShipDate'), 'last shipment date'));
      this.sectionForm.parent.get(Constants.SECTION_SHIPMENT_DETAILS).get('lastShipDate').clearValidators();
      this.sectionForm.parent.get(Constants.SECTION_SHIPMENT_DETAILS).get('lastShipDate').updateValueAndValidity();
      validatorsSet.push(validateExpDateWithOtherDate(this.sectionForm.get(dateField),
      this.sectionForm.parent.get(Constants.SECTION_SHIPMENT_DETAILS).get('earliestShipDate'), 'earliest shipment date'));
      this.sectionForm.parent.get(Constants.SECTION_SHIPMENT_DETAILS).get('earliestShipDate').clearValidators();
      this.sectionForm.parent.get(Constants.SECTION_SHIPMENT_DETAILS).get('earliestShipDate').updateValueAndValidity();
    }
    this.sectionForm.controls[dateField].setValidators(validatorsSet);
    this.sectionForm.controls[dateField].updateValueAndValidity();
  }

  setValidatorEffectiveDate(dateField) {
    const format = this.commonService.getUserLanguage() === Constants.LANGUAGE_US ? Constants.DATE_FORMAT : Constants.DATE_FORMAT_DMY;
    const currentDate = this.datePipe.transform(new Date(), format);
    this.sectionForm.get(dateField).clearValidators();
    this.sectionForm.get(dateField).setValidators([
      validateDate(this.sectionForm.get(dateField).value, currentDate,
      Constants.EFFECTIVE_DATE, Constants.CURRENT_DATE, Constants.LESSER_THAN)]);
    this.sectionForm.get(dateField).updateValueAndValidity();
  }

  onCheckedTransferIndicator() {
    if (this.sectionForm.get(`cuTransferIndicator`).value) {
        this.sectionForm.get('narrativeTransferConditionsCu').enable();
    } else {
        this.sectionForm.get('narrativeTransferConditionsCu').setValue('');
        this.sectionForm.get('narrativeTransferConditionsCu').disable();
     }
   }

  onChangeSubProdCode(undertakingType) {
    if (undertakingType === 'bg') {
      this.confInstType = 'bg';
      this.transferIndicatorType = '';
    } else {
      this.confInstType = 'cu';
      this.transferIndicatorType = 'Cu';
    }

    if (undertakingType === 'cu' && this.sectionForm.controls[`cuSubProductCode`].value !== Constants.STAND_BY) {
      if (this.sectionForm.controls[`${this.confInstType}ConfInstructions`]) {
        this.sectionForm.controls[`${this.confInstType}ConfInstructions`].clearValidators();
        this.sectionForm.controls[`${this.confInstType}ConfInstructions`].setValue('');
        this.setConfInstValue(this.sectionForm.controls[`${this.confInstType}ConfInstructions`].value);
      }
      if (this.sectionForm.controls[`${this.confInstType}TransferIndicator`].value &&
        this.sectionForm.controls[`narrativeTransferConditions${this.transferIndicatorType}`]) {
        this.sectionForm.controls[`${this.confInstType}TransferIndicator`].clearValidators();
        this.sectionForm.controls[`${this.confInstType}TransferIndicator`].setValue('');
        this.sectionForm.controls[`narrativeTransferConditions${this.transferIndicatorType}`].clearValidators();
        this.sectionForm.controls[`narrativeTransferConditions${this.transferIndicatorType}`].setValue('');
      }
    } else if (undertakingType === 'bg' &&
        this.sectionForm.parent.get('generaldetailsSection').get('subProductCode').value !== Constants.STAND_BY) {
          this.sectionForm.parent.get('shipmentDetailsSection').get('lastShipDate').clearValidators();
          this.sectionForm.parent.get('shipmentDetailsSection').get('lastShipDate').updateValueAndValidity();
          this.sectionForm.parent.get('shipmentDetailsSection').get('earliestShipDate').clearValidators();
          this.sectionForm.parent.get('shipmentDetailsSection').get('earliestShipDate').updateValueAndValidity();
    } else {
      if (this.sectionForm.controls[`${this.confInstType}ConfInstructions`]) {
        this.sectionForm.controls[`${this.confInstType}ConfInstructions`].setValue('03');
        this.setConfInstValue(this.sectionForm.controls[`${this.confInstType}ConfInstructions`].value);
      }
    }
    this.resetRenewalDetails.emit(Constants.UNDERTAKING_TYPE_CU);
  }

  setConfInstValue(value) {
    if (this.undertakingType === 'cu') {
      this.cuConfInstructions.emit(value);
    }
  }

  changeTypeOfUndertaking() {
    if (this.sectionForm.get(`${this.type}TypeCode`).value === '99') {
      this.sectionForm.get(`${this.type}TypeDetails`).enable();
    } else {
      this.sectionForm.get(`${this.type}TypeDetails`).setValue('');
      this.sectionForm.get(`${this.type}TypeDetails`).markAsUntouched({ onlySelf: true });
      this.sectionForm.get(`${this.type}TypeDetails`).markAsPristine({ onlySelf: true });
      this.sectionForm.get(`${this.type}TypeDetails`).updateValueAndValidity();
      this.sectionForm.get(`${this.type}TypeDetails`).disable();
    }
  }

  generatePdf(generatePdfService) {
    if (this.commonDataService.getPreviewOption() !== 'SUMMARY' && this.undertakingType === 'bg') {
      if (this.commonData.getProductCode() === Constants.PRODUCT_CODE_IU) {
        generatePdfService.setSectionDetails('HEADER_UNDERTAKING_GENERAL_DETAILS', true, false, 'commonGeneralDetails');
        generatePdfService.setSectionDetails('', true, false, 'commonGeneralDetailsOtherDetails');
      } else if (this.commonData.getProductCode() === Constants.PRODUCT_CODE_RU) {
        generatePdfService.setSectionDetails('HEADER_GENERAL_DETAILS', true, false, 'commonGeneralDetails');
        generatePdfService.setSectionDetails('', true, false, 'commonGeneralDetailsOtherDetails');
      }
    } else if (this.commonDataService.getPreviewOption() !== 'SUMMARY' && this.undertakingType === 'cu') {
      generatePdfService.setSectionDetails('HEADER_COUNTER_UNDERTAKING_GENERAL_DETAILS', true, false, 'luGeneralDetails');
    }
  }

  updateLicenseList() {
    if (this.undertakingType === 'bg') {
      if (this.license.licenseMap.length === 0) {
        this.commonDataService.setExpDate(this.sectionForm.get('bgExpDate').value);
      } else {
        let message = '';
        let dialogHeader = '';
        this.translate.get('DELINK_LICENSE_CONFIRMATION_MSG').subscribe((value: string) => {
          message = value;
        });
        this.translate.get('DAILOG_CONFIRMATION').subscribe((res: string) => {
          dialogHeader = res;
        });
        this.confirmationService.confirm({
          message,
          header: dialogHeader,
          icon: CommonGeneralDetailsComponent.CONFIRMATION_ICON,
          key: 'deleteLicenseConfirmDialog',
          accept: () => {
            this.license.removeLinkedLicense();
            this.commonDataService.setExpDate(this.sectionForm.get('bgExpDate').value);
          },
          reject: () => {
            this.sectionForm.get('bgExpDate').setValue(this.commonDataService.getExpDate());
          }
        });
      }
    }
  }

  updateLicenseListExpType() {
    if (this.undertakingType === 'bg') {
      if (this.license.licenseMap.length === 0) {
        this.onChangeExpDateTypeCode();
      } else {
        let message = '';
        let dialogHeader = '';
        this.translate.get('DELINK_LICENSE_CONFIRMATION_MSG').subscribe((value: string) => {
          message = value;
        });
        this.translate.get('DAILOG_CONFIRMATION').subscribe((res: string) => {
          dialogHeader = res;
        });
        this.confirmationService.confirm({
          message,
          header: dialogHeader,
          icon: CommonGeneralDetailsComponent.CONFIRMATION_ICON,
          key: 'deleteLicenseConfirmDialog',
          accept: () => {
            this.license.removeLinkedLicense();
            this.onChangeExpDateTypeCode();
          },
          reject: () => {
            this.sectionForm.get('bgExpDateTypeCode').setValue(this.commonDataService.getExpDateType());
            if (this.commonDataService.getExpDateType() === '02') {
              this.sectionForm.get('bgExpDate').setValue(this.commonDataService.getExpDate());
            }
          }
        });
      }
    } else {
      this.onChangeExpDateTypeCode();
    }
  }

  setVariationFrequencyValidator() {
    let increaseDecreaseForm;
    if (this.undertakingType === Constants.UNDERTAKING_TYPE_CU) {
      increaseDecreaseForm = this.sectionForm.parent.get('cuRedIncForm');
    } else {
      increaseDecreaseForm = this.sectionForm.parent.get('redIncForm');
    }
    if (this.sectionForm.get(`${this.undertakingType}ExpDateTypeCode`).value !== '02') {
      if ( this.undertakingType === Constants.UNDERTAKING_TYPE_IU ) {
        this.commonService.maxDate = '';
      } else {
        this.commonService.cuMaxDate = '';
      }
    }
    this.commonService.validateDatewithExpiryDate(increaseDecreaseForm, this.undertakingType);
    this.expDate.emit(`${this.sectionForm.get(`${this.undertakingType}ExpDate`).value},${this.undertakingType}`);
 }

 setExpiryDateForExt() {
  this.expiryDateExtension.emit(`${this.sectionForm.get(`${this.undertakingType}ExpDate`).value},${this.undertakingType}`);
  }

 clearExpDate(event) {
  this.sectionForm.get(`${this.undertakingType}ExpDate`).setValue('');
}

clearApproxExpiryDate(event) {
  this.sectionForm.get(`${this.undertakingType}ApproxExpiryDate`).setValue('');
 }

 hasExpDate(): boolean {
  if (this.sectionForm.get(`${this.undertakingType}ExpDate`) &&
      this.sectionForm.get(`${this.undertakingType}ExpDate`).value !== null &&
      this.sectionForm.get(`${this.undertakingType}ExpDate`).value !== '') {
    return true;
  } else {
    return false;
  }
}

hasApproxExpiryDate(): boolean {
  if (this.sectionForm.get(`${this.undertakingType}ApproxExpiryDate`) &&
      this.sectionForm.get(`${this.undertakingType}ApproxExpiryDate`).value !== null &&
      this.sectionForm.get(`${this.undertakingType}ApproxExpiryDate`).value !== '') {
    return true;
  } else {
    return false;
  }
}

downloadSpecimen() {
  this.downloadBankTemplate.emit();
}

getSelectedUndertakingType(key: any): any {

  const arrayToObject = (array, keyField) =>
          array.reduce((obj, item) => {
          obj[item[keyField]] = item;
          return obj;
   }, {});
  if (key !== '' && key !== null ) {
      const obj = arrayToObject(this.typeOfUndertakingObj, 'value');
      if (obj[key] && obj[key] != null && obj[key] !== '') {
        return obj[key].label;
      } else {
        return obj[key];
      }
    } else {
      return this.typeOfUndertakingObj;
    }
}

}

