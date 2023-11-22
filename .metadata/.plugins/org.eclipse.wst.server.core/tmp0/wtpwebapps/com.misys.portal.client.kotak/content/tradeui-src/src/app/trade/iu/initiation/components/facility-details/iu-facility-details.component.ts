import { IUInitiationComponent } from './../../iu-initiation.component';
import { StaticDataService } from './../../../../../common/services/staticData.service';
import { CommonService } from '../../../../../common/services/common.service';
import { EntityService } from '../../../../../common/services/entity.service';
import { formatDate } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild, AfterContentInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';
import { Constants } from '../../../../../common/constants';
import { validateAmountField, validateBookingAmountWithBGAndLimAvlblAmount, validateSwiftCharSet, validateTnxAndLimAvlblAmount } from '../../../../../common/validators/common-validator';
import { ValidationService } from '../../../../../common/validators/validation.service';
import { IUCommonDataService } from '../../../common/service/iuCommonData.service';
import { CommonDataService } from '../../../../../common/services/common-data.service';
import { TnxIdGeneratorService } from '../../../../../common/services/tnxIdGenerator.service';
import { TradeEventDetailsComponent } from '../../../../common/components/event-details/event-details.component';
import { IUService } from '../../../common/service/iu.service';
import { DropdownOptions } from '../../../common/model/DropdownOptions.model';
import { DropdownObject } from '../../../common/model/DropdownObject.model';


@Component({
  selector: 'fcc-iu-facility-details',
  templateUrl: './iu-facility-details.component.html',
  styleUrls: ['./iu-facility-details.component.scss']
})
export class IUFacilityDetailsComponent implements OnInit {
  @Input() public bgRecord;
  @Input() public customerRef: string;
  @Input() public bgAmtValue: string;
  @Input() public bgCurCode: string;
  @Output() formReady = new EventEmitter<UntypedFormGroup>();
  facilityDetailsSection: UntypedFormGroup;
  viewMode: boolean;
  public jsonContent;
  collapsible: boolean;
  dataToBePersisted = false;
  isExistingDraftMenu: boolean;
  custRef: string;
  yearRange: string;
  dateFormat: string;
  actionCode: string;
  facilityDate;
  limitDate;
  facilityOutAmount: string = null;
  facilityOutCurCode: string = null;
  limAmount: string = null;
  limCurCode: string = null;
  limOutAmt: string = null;
  limOutCurCode: string = null;
  bookingAmt: string = null;
  bookCurCode: string = null;

  facilityId;
  facilityName;
  limitId;
  limitName;
  facilityDetails;
  facilityReferenceDetails;
  facilityDateDetails;
  facilityDateElement;
  boReference;
  bankEntity;
  limitItems;
  limitStore;
  facility;


  facilityIdDropDown: DropdownOptions[] = [];
  limitIdDropDown: DropdownOptions[] = [];

  constructor(public fb: UntypedFormBuilder, public validationService: ValidationService,
              public commonDataService: IUCommonDataService, public iuService: IUService,
              protected staticDataService: StaticDataService, public commonService: CommonService,
              public translate: TranslateService, public readonly commonData: CommonDataService) { }
  ngOnInit() {
    this.actionCode = window[`ACTION_CODE`];
    this.facilityDetailsSection = this.fb.group({
      facilityHidden: '',
      limitHidden: '',
      facilityId: [''],
      facilityDate: [''],
      limitId: [''],
      limitReviewDate: [''],
      facilityOutstandingAmount: [''],
      facilityOutstandingCurCode: [''],
      limitOutstandingAmount: [''],
      limitOutstandingCurCode: [''],
      limitAmount: [''],
      limitCurCode: [''],
      bookingAmount: [''],
      bookingCurCode: [''],
    });

    this.facilityIdDropDown = [];
    this.limitIdDropDown = [];
    this.custRef = null;

    // set dataToBePersisted- true for edit, template, amend, pending (MO) and existing (MO)
    this.dataToBePersisted = (this.commonDataService.getOption() === Constants.OPTION_EXISTING ||
    this.commonDataService.getOption() === Constants.OPTION_TEMPLATE ||
    this.commonDataService.getMode() === Constants.MODE_DRAFT ||
    this.commonDataService.getMode() === Constants.MODE_AMEND ||
    this.commonDataService.getMode() === Constants.OPTION_REJECTED
    || this.isExistingDraftMenu);

    // set view mode - true for preview/pdf mode for all the screens
    if (this.commonDataService.getDisplayMode() === 'view' ||
        this.commonDataService.getDisplayMode() === Constants.UNSIGNED_AMEND) {
      this.viewMode = true;
    } else {
      this.viewMode = false;
    }

    // Set custref
    if (this.commonService.issuerRef !== null && this.commonService.issuerRef !== '' && this.commonService.issuerRef !== undefined) {
      this.custRef = this.commonService.issuerRef; // create
    } else if (this.dataToBePersisted || this.viewMode === true) {
      this.custRef = this.bgRecord.applicantReference; // create[view],edit, template, amend, pending (MO) and existing (MO)
    }

    if (this.custRef !== null && this.custRef !== '' && this.custRef !== undefined) {
      this.yearRange = this.commonService.getYearRange();
      this.dateFormat = this.commonService.getDateFormat();

      if (this.commonDataService.getOption() === Constants.OPTION_EXISTING ||
      this.commonData.getOperation() === Constants.OPERATION_CREATE_REPORTING) {
        this.initMOFields();
        const facilityElement: any = {};
        facilityElement.label = this.bgRecord.limit_details.facilityReference;
        facilityElement.value = this.bgRecord.limit_details.facilityReference;
        this.facilityIdDropDown.push(facilityElement);
        this.facilityDetailsSection.get(`facilityId`).setValue(this.bgRecord.limit_details.facilityReference);
        this.facilityId = this.bgRecord.limit_details.facilityReference;
        const LimitElement: any = {};
        LimitElement.label = this.bgRecord.limit_details.limitReference;
        LimitElement.value = this.bgRecord.limit_details.limitReference;
        this.limitIdDropDown.push(LimitElement);
        this.facilityDetailsSection.get(`limitId`).setValue(this.bgRecord.limit_details.limitReference);
        this.limitId = this.bgRecord.limit_details.limitReference;
      } else {
        this.fetchfacilities();
      }
      if (this.checkForDataIfPresent() || (this.commonDataService.getDisplayMode() === 'view' && this.checkForDataIfPresent())) {
        this.collapsible = true;
      } else {
        this.collapsible = false;
      }



      if (this.viewMode) {
      this.populateLimitDateOnView();
      this.populateFacilityDateOnView();
      }
      this.formReady.emit(this.facilityDetailsSection);
    }
  }


  populateLimitDateOnView() {
    const facilityReference = this.bgRecord.limit_details.facilityReference;
    const facilityId = this.bgRecord.limit_details.facilityId;
    const requestPayload = this.constructLimitRequest(facilityReference, facilityId);
    this.staticDataService.getLimitDetails(requestPayload).subscribe(limitRes => {
      this.limitItems = limitRes.items;
      this.limitStore = limitRes.store;
      limitRes.store.forEach(LimitObj => {
        if (LimitObj.name === this.bgRecord.limit_details.limitReference) {
          this.limitId = LimitObj.value;
        }
      });

      limitRes.items.forEach(LimitObj => {
        if (LimitObj.value === this.bgRecord.limit_details.limitId) {
          this.limitDate = LimitObj.listValues[0].limitReviewDate;
        }
      });
    });
  }


  populateFacilityDateOnView() {
    const facilityReference = this.bgRecord.limit_details.facilityReference;
    const facilityId = this.bgRecord.limit_details.facilityId;
    this.facilityDate = this.bgRecord.facilityDate;

  }
// populate facility date based on selected facility
  updateFacilityDate(facilityRef) {
  this.facilityDateElement.forEach(fac => {
      if (fac.facility === facilityRef) {
        this.facilityDetailsSection.controls.facilityDate.setValue(fac.date);
        this.facilityDate = fac.date;
      }
  });
  }


  checkForDataIfPresent() {
    const arr = [this.bgRecord.facilityOutstandingCurCode, this.bgRecord.facilityOutstandingAmount, this.bgRecord.limitReviewDate,
      this.bgRecord.facilityDate, this.bgRecord.limitAmount, this.bgRecord.limitOutstandingAmount,
      this.bgRecord.limit_details.bookingCurCode, this.bgRecord.limit_details.bookingAmount, this.bgRecord.limit_details.limitReference,
      this.bgRecord.limit_details.facilityReference];

    return this.commonService.isFieldsValuesExists(arr);
  }

  initMOFields() {
    this.facilityId = this.bgRecord.limit_details.facilityReference;
    this.limitId = this.bgRecord.limit_details.limitReference;
    this.facilityOutAmount = this.bgRecord.facilityOutstandingAmount;
    this.facilityOutCurCode = this.bgRecord.facilityOutstandingCurCode;
    this.limAmount = this.bgRecord.limitAmount;
    this.limCurCode = this.bgRecord.facilityOutstandingCurCode;
    this.limOutAmt = this.bgRecord.limitOutstandingAmount;
    this.limOutCurCode = this.bgRecord.facilityOutstandingCurCode;
    this.bookingAmt = this.bgRecord.limit_details.bookingAmount;
    this.bookCurCode = this.bgRecord.limit_details.bookingCurCode;
    this.facilityDetailsSection.patchValue({
       facilityDate: this.bgRecord.facilityDate,
       limitReviewDate: this.bgRecord.limitReviewDate,
          });
  }


   fetchfacilities() {
    const entity = this.commonData.getEntity();
    this.facilityIdDropDown = [];
    this.facility = null;
    this.bankEntity = null;
    this.iuService.getDefaultValuesJsonService(this.actionCode).subscribe(data => {
      if (data && data != null && data.bg_tnx_record && data.bg_tnx_record.facilityDetails &&
        data.bg_tnx_record.facilityDetails.facilityReferenceDetails &&
        data.bg_tnx_record.facilityDetails.facilityReferenceDetails.length !== 0
        && data.bg_tnx_record.facilityDetails.facilityDateDetails &&
        data.bg_tnx_record.facilityDetails.facilityDateDetails.length !== 0) {
          this.jsonContent = data.bg_tnx_record as string[];
          this.facilityDetails = this.jsonContent.facilityDetails;
          this.facilityReferenceDetails = this.facilityDetails.facilityReferenceDetails;
          this.facilityDateDetails = this.facilityDetails.facilityDateDetails;
          this.facilityDateElement = this.facilityDetails.facilityDateDetails[0].facilityDateElement;
          this.facilityReferenceDetails[0].boReference.forEach(boref => {
            if (boref.custRef === this.custRef) {
            this.bankEntity = boref.bankEntity;
            }
          });
          if (this.bankEntity && this.bankEntity !== null && this.bankEntity !== '') {
            this.bankEntity.forEach(bankEnt => {
              if (bankEnt.name.endsWith(entity)) {
                this.facility = bankEnt.facility;
                }
            });
          }
          this.facilityDetailsSection.get(`facilityId`).reset();
          this.facilityDetailsSection.get(`facilityDate`).reset();
          this.facilityId = null;
          this.facility.forEach(fac => {
            const facilityElement: any = {};
            facilityElement.label = fac.reference;
            facilityElement.value = fac.reference;
            this.facilityIdDropDown.push(facilityElement);
            if (this.bgRecord.limit_details.facilityReference === fac.reference) {
            this.facilityDetailsSection.get(`facilityId`).setValue(fac.reference);
            this.facilityDetailsSection.get(`facilityDate`).setValue(this.bgRecord.facilityDate);
            this.facilityId = fac.reference;
            this.facilityDate = this.bgRecord.facilityDate;
            this.populateLimitDropdown(this.bgRecord.limit_details.facilityReference);
            this.populateLimitValues(this.bgRecord.limit_details.facilityReference);
          }
        });
        }
});
}

populateLimitDropdown(facilityRef) {
  let facilityId;

  this.facility.forEach(fac => {
    if (fac.reference === facilityRef) {
      facilityId = fac.id;
      this.facilityDetailsSection.get('facilityHidden').setValue(facilityId);
    }
  });
  if (!(facilityRef === null || facilityRef === '' || facilityRef === undefined)) {
    const requestPayload = this.constructLimitRequest(facilityRef, facilityId);
    this.facilityDetailsSection.get(`limitId`).reset();
    this.limitIdDropDown.length = 0;
    this.staticDataService.getLimitDetails(requestPayload).subscribe(data => {
      if (data && data != null && data.items && data.items.length !== 0 && data.store && data.store.length !== 0) {
        this.limitItems = data.items;
        this.limitStore = data.store;
        data.store.forEach(LimitObj => {
          const LimitElement: any = {};
          LimitElement.label = LimitObj.name;
          LimitElement.value = LimitObj.name;
          this.limitIdDropDown.push(LimitElement);
          if (this.bgRecord.limit_details.limitReference === LimitObj.name) {
            this.facilityDetailsSection.get(`limitId`).setValue(LimitObj.name);
            this.limitId = LimitObj.name;
            this.facilityDetailsSection.get('limitHidden').setValue(this.bgRecord.limit_details.limitId);
          }
        });
      }

    });
  } else {
    this.facilityId = null;
    this.limitId = null;
    this.facilityDetailsSection.get(`facilityId`).setValue('');
    this.facilityDetailsSection.get(`limitId`).setValue('');
    this.facilityDetailsSection.get(`limitId`).clearValidators();
    this.facilityDetailsSection.get(`limitId`).setErrors(null);
}
}

populateLimitValues(facilityRef) {
  if (!(facilityRef === null || facilityRef === '' || facilityRef === undefined)) {
    this.facilityDetailsSection.get('limitReviewDate').setValue('');
    this.facilityDetailsSection.get('facilityOutstandingAmount').setValue('');
    this.facilityDetailsSection.get('facilityOutstandingCurCode').setValue('');
    this.facilityDetailsSection.get('limitOutstandingAmount').setValue('');
    this.facilityDetailsSection.get('limitOutstandingCurCode').setValue('');
    this.facilityDetailsSection.get('limitAmount').setValue('');
    this.facilityDetailsSection.get('limitCurCode').setValue('');
    this.facilityDetailsSection.get('bookingAmount').setValue('');
    this.facilityDetailsSection.get('bookingCurCode').setValue('');
    this.bookingAmt = null;
    this.bookCurCode = null;
    if (this.commonService.isFieldsValuesExists([this.bgRecord.limitReviewDate]) &&
    this.commonService.isFieldsValuesExists([this.bgRecord.facilityOutstandingAmount]) &&
    this.commonService.isFieldsValuesExists([this.bgRecord.facilityOutstandingCurCode]) &&
    this.commonService.isFieldsValuesExists([this.bgRecord.limitOutstandingAmount]) &&
    this.commonService.isFieldsValuesExists([this.bgRecord.limitAmount]) &&
    this.commonService.isFieldsValuesExists([this.bgRecord.limit_details.bookingAmount]) &&
    this.commonService.isFieldsValuesExists([this.bgRecord.limit_details.bookingCurCode]) &&
    this.commonService.isFieldsValuesExists([this.bgRecord.limit_details.bookingCurCode]) &&
    this.commonService.isFieldsValuesExists([this.bgRecord.limit_details.bookingCurCode])) {
      this.facilityDetailsSection.get(`limitReviewDate`).setValue(this.bgRecord.limitReviewDate);
      this.facilityDetailsSection.get(`facilityOutstandingAmount`).setValue(this.bgRecord.facilityOutstandingAmount);
      this.facilityDetailsSection.get(`facilityOutstandingCurCode`).setValue(this.bgRecord.facilityOutstandingCurCode);
      this.facilityDetailsSection.get(`limitOutstandingAmount`).setValue(this.bgRecord.limitOutstandingAmount);
      this.facilityDetailsSection.get(`limitOutstandingCurCode`).setValue(this.bgRecord.limit_details.bookingCurCode);
      this.facilityDetailsSection.get(`limitAmount`).setValue(this.bgRecord.limitAmount);
      this.facilityDetailsSection.get(`limitCurCode`).setValue(this.bgRecord.limit_details.bookingCurCode);
      this.facilityDetailsSection.get(`bookingAmount`).setValue(this.bgRecord.limit_details.bookingAmount);
      this.facilityDetailsSection.get(`bookingCurCode`).setValue(this.bgRecord.limit_details.bookingCurCode);
      this.bookingAmt = this.bgRecord.limit_details.bookingAmount;
      this.bookCurCode = this.bgRecord.limit_details.bookingCurCode;
    }

  } else {
      this.facilityId = null;
      this.limitId = null;
      this.facilityDetailsSection.get(`facilityId`).setValue('');
      this.facilityDetailsSection.get(`limitId`).setValue('');
      this.facilityDetailsSection.get(`limitId`).clearValidators();
      this.facilityDetailsSection.get(`limitId`).setErrors(null);
  }
}

clearFacilityValues() {
  this.facilityDetailsSection.controls.bookingAmount.clearValidators();
  this.limitId = null;
  this.bookingAmt = null;
  this.bookCurCode = null;
  this.facilityDetailsSection.get('facilityDate').setValue('');
  this.facilityDetailsSection.get('limitReviewDate').setValue('');
  this.facilityDetailsSection.get('limitId').setValue('');
  this.facilityDetailsSection.get('facilityOutstandingAmount').setValue('');
  this.facilityDetailsSection.get('facilityOutstandingCurCode').setValue('');
  this.facilityDetailsSection.get('limitOutstandingAmount').setValue('');
  this.facilityDetailsSection.get('limitOutstandingCurCode').setValue('');
  this.facilityDetailsSection.get('limitAmount').setValue('');
  this.facilityDetailsSection.get('limitCurCode').setValue('');
  this.facilityDetailsSection.get('bookingAmount').setValue('');
  this.facilityDetailsSection.get('bookingCurCode').setValue('');
}


clearLimitValues() {
  this.facilityDetailsSection.controls.bookingAmount.clearValidators();
  this.bookingAmt = null;
  this.bookCurCode = null;
  this.facilityDetailsSection.get('limitReviewDate').setValue('');
  this.facilityDetailsSection.get('facilityOutstandingAmount').setValue('');
  this.facilityDetailsSection.get('facilityOutstandingCurCode').setValue('');
  this.facilityDetailsSection.get('limitOutstandingAmount').setValue('');
  this.facilityDetailsSection.get('limitOutstandingCurCode').setValue('');
  this.facilityDetailsSection.get('limitAmount').setValue('');
  this.facilityDetailsSection.get('limitCurCode').setValue('');
  this.facilityDetailsSection.get('bookingAmount').setValue('');
  this.facilityDetailsSection.get('bookingCurCode').setValue('');
}


populateLimitFields(selectedLimitName) {

  if (selectedLimitName !== null && selectedLimitName !== '') {
    this.limitStore.forEach(limit => {
      if (limit.name === selectedLimitName) {
        this.limitId = limit.value;
        this.facilityDetailsSection.get('limitHidden').setValue(this.limitId);
      }
  });
    this.limitItems.forEach(item => {
    if (item.value === this.limitId) {
      const selectedLimit = item.listValues[0];
      this.facilityOutCurCode = selectedLimit.facilityOutstandingCurCode;
      this.facilityOutAmount = selectedLimit.facilityOutstandingAmount;
      this.limCurCode = selectedLimit.limitCurCode;
      this.limAmount = selectedLimit.limitAmount;
      this.limOutCurCode = selectedLimit.limitOutstandingCurCode;
      this.limOutAmt = selectedLimit.limitOutstandingAmount;
      this.bookCurCode = selectedLimit.bookingCurCode;
      this.bookingAmt = this.facilityDetailsSection.parent.get('amountDetailsSection').get('bgAmt').value;
      this.facilityDetailsSection.controls.limitReviewDate.setValue(selectedLimit.limitReviewDate);
      this.facilityDetailsSection.controls.facilityOutstandingCurCode.setValue(selectedLimit.facilityOutstandingCurCode);
      this.facilityDetailsSection.controls.facilityOutstandingAmount.setValue(selectedLimit.facilityOutstandingAmount);
      this.facilityDetailsSection.controls.limitCurCode.setValue(selectedLimit.limitCurCode);
      this.facilityDetailsSection.controls.limitAmount.setValue(selectedLimit.limitAmount);
      this.facilityDetailsSection.controls.limitOutstandingCurCode.setValue(selectedLimit.limitOutstandingCurCode);
      this.facilityDetailsSection.controls.limitOutstandingAmount.setValue(selectedLimit.limitOutstandingAmount);
      this.facilityDetailsSection.controls.bookingCurCode.setValue(selectedLimit.bookingCurCode);
      this.facilityDetailsSection.controls.bookingAmount.setValue(this.facilityDetailsSection.parent.
        get('amountDetailsSection').get('bgAmt').value);
    }
});

  }

  }

  generatePdf(generatePdfService) {
    if (this.commonDataService.getPreviewOption() !== 'SUMMARY') {
      generatePdfService.setSectionDetails('HEADER_FACILITY_DETAILS', true, false, 'facilityDetailsSection');
    }
  }

  populateBookingAmount() {
    if (this.bgRecord.bgAmt !== null && this.bgRecord.bgAmt !== '' && this.bgRecord.bgAmt !== undefined) {
      this.facilityDetailsSection.controls.bookingAmount.setValue(this.bgRecord.bgAmt);
      this.bookingAmt = this.bgRecord.bgAmt;
    } else if (this.facilityDetailsSection.value.limitId === null || this.facilityDetailsSection.value.limitId ===  '') {
      this.facilityDetailsSection.controls.bookingAmount.setValue('');
      this.bookingAmt = null;
    } else {
      let MidCur = '';
      const tnxAmt = (this.commonService.getNumberWithoutLanguageFormatting
        (this.facilityDetailsSection.parent.get('amountDetailsSection').get('bgAmt').value));
      const bookCur = this.facilityDetailsSection.get('bookingCurCode').value;
      const tnxCur = this.facilityDetailsSection.parent.get('amountDetailsSection').get('bgCurCode').value;
      if (tnxCur !== '' && tnxAmt !== '') {
      this.commonService.getCurrencyRate(tnxCur, bookCur, tnxAmt).subscribe(data => {
        this.jsonContent = data as string[];
        MidCur = this.jsonContent;
        if (bookCur !== tnxCur) {
          this.facilityDetailsSection.controls.bookingAmount.setValue(this.jsonContent.toCurrencyAmount);
          this.bookingAmt = this.jsonContent.toCurrencyAmount;
        } else {
          this.facilityDetailsSection.controls.bookingAmount.setValue(this.facilityDetailsSection.parent.
            get('amountDetailsSection').get('bgAmt').value);
          this.bookingAmt = this.facilityDetailsSection.parent.get('amountDetailsSection').get('bgAmt').value;
        }
        this.setValidationBookingAmt();
        this.validateTnxAmount();
    });
    }
    }
  }

  validateTnxAmount() {
    if (this.commonService.isValidateTnxAmtWithLimitAmt() === true) {
      const tnxAmt = this.facilityDetailsSection.parent.get('amountDetailsSection').get('bgAmt').value;
      if (tnxAmt !== null && tnxAmt !== '' && tnxAmt !== undefined) {
        this.facilityDetailsSection.parent.get('amountDetailsSection').get('bgAmt').setValidators
        ([validateTnxAndLimAvlblAmount( this.facilityDetailsSection.get('limitOutstandingAmount'),
        this.facilityDetailsSection.parent.get('amountDetailsSection').get('bgAmt'))]);
        this.facilityDetailsSection.parent.get('amountDetailsSection').get('bgAmt').updateValueAndValidity();
      }

    }
  }


  setValidationBookingAmt() {
    this.facilityDetailsSection.get('bookingAmount').setValidators([validateBookingAmountWithBGAndLimAvlblAmount(
      this.facilityDetailsSection.get('bookingAmount'), this.facilityDetailsSection.parent.get('amountDetailsSection').get('bgAmt')),
      Validators.required]);
    this.facilityDetailsSection.get('bookingAmount').setValidators([validateBookingAmountWithBGAndLimAvlblAmount(
      this.facilityDetailsSection.get('bookingAmount'), this.facilityDetailsSection.get('limitOutstandingAmount')), Validators.required]);
    this.facilityDetailsSection.controls.bookingAmount.updateValueAndValidity();
    if (this.facility !== '' && this.facility !== null && this.facility !== undefined) {
      this.facilityDetailsSection.get('bookingAmount').setValidators([Validators.required]);
    }
    }

  setBookingAmount(value) {
    this.bookingAmt = value;
    this.setValidationBookingAmt();
  }


  constructLimitRequest(facilityReference, facilityId) {
    const userData = {
      username: this.commonService.getLoginUserName(),
      company: this.commonService.getCompanyName()
    };
    const productCode = this.commonDataService.getProductCode();
    const entity = this.commonData.getEntity() ;
    const subProductCode = this.commonDataService.getSubProdCode();
    const productTypeCode = '';
    const beneficiary = this.commonDataService.getBeneficiary();
    const beneficiaryCountry = '';
    const requestPayload = {
      userData, facilityReference, facilityId,
      productCode, entity, subProductCode, productTypeCode,
      beneficiary, beneficiaryCountry
    };
    return requestPayload;
}



clearValuesOnSubProdChange() {
  this.facilityDetailsSection.controls.bookingAmount.clearValidators();
  this.limitId = null;
  this.bookingAmt = null;
  this.bookCurCode = null;
  this.facilityDetailsSection.get('limitReviewDate').setValue('');
  this.facilityDetailsSection.get('limitId').setValue('');
  this.facilityDetailsSection.get('facilityOutstandingAmount').setValue('');
  this.facilityDetailsSection.get('facilityOutstandingCurCode').setValue('');
  this.facilityDetailsSection.get('limitOutstandingAmount').setValue('');
  this.facilityDetailsSection.get('limitOutstandingCurCode').setValue('');
  this.facilityDetailsSection.get('limitAmount').setValue('');
  this.facilityDetailsSection.get('limitCurCode').setValue('');
  this.facilityDetailsSection.get('bookingAmount').setValue('');
  this.facilityDetailsSection.get('bookingCurCode').setValue('');
}
}
