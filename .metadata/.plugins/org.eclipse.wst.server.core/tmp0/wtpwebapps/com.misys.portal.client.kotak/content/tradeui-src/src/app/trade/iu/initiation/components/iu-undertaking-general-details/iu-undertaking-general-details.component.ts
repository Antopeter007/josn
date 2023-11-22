import { formatDate } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';
import { Constants } from '../../../../../common/constants';
import { validateSwiftCharSet } from '../../../../../common/validators/common-validator';
import { ValidationService } from '../../../../../common/validators/validation.service';
import { IUCommonDataService } from '../../../common/service/iuCommonData.service';
import { CommonGeneralDetailsComponent } from '../common-general-details/common-general-details.component';
import { CommonDataService } from '../../../../../common/services/common-data.service';
import { TnxIdGeneratorService } from '../../../../../common/services/tnxIdGenerator.service';
import { TradeEventDetailsComponent } from '../../../../common/components/event-details/event-details.component';
import { IUService } from '../../../common/service/iu.service';

@Component({
  selector: 'fcc-iu-undertaking-general-details',
  templateUrl: './iu-undertaking-general-details.component.html',
  styleUrls: ['./iu-undertaking-general-details.component.scss']
})
export class UndertakingGeneralDetailsComponent implements OnInit {

  @Input() public bgRecord;
  @Output() formReady = new EventEmitter<UntypedFormGroup>();
  @Output() resetRenewalDetails = new EventEmitter<any>();
  @Output() downloadBankTemplate = new EventEmitter<any>();
  @Output() entity = new EventEmitter<any>();
  @Output() confInstructions = new EventEmitter<UntypedFormGroup>();
  @Output() expDate = new EventEmitter<string>();
  @Output() expiryDateExtension = new EventEmitter<string>();
  @ViewChild(CommonGeneralDetailsComponent)commonGeneralDetailsChildComponent: CommonGeneralDetailsComponent;
  @Input() public displayDepuFlag: boolean;
  undertakingGeneralDetailsSection: UntypedFormGroup;
  referenceAndPurposeSection: UntypedFormGroup;
  public viewMode = false;
  isMaster: boolean;
  public isOnchangeEvent = false;
  @ViewChild(TradeEventDetailsComponent)tradeEventDetailsComponent: TradeEventDetailsComponent;
  @Input() public entitySelected: string;
  mode: string;
  public isMessageToBank = false;

  constructor(public fb: UntypedFormBuilder, public validationService: ValidationService, public commonData: CommonDataService,
              public commonDataService: IUCommonDataService, public iuService: IUService,  public translate: TranslateService,
              public confirmationService: ConfirmationService, public tnxIdGeneratorService: TnxIdGeneratorService) { }

  ngOnInit() {
    this.undertakingGeneralDetailsSection = this.fb.group({
      bgTypeCode: ['', [Validators.required]],
      bgTypeDetails: [{value: '', disabled: true}, [Validators.maxLength(Constants.LENGTH_35),
                                      validateSwiftCharSet(Constants.X_CHAR)]],
      bgIssDateTypeCode: ['', [Validators.required]],
      bgIssDateTypeDetails: {value: '', disabled: true },
      bgExpDateTypeCode: ['02', Validators.required],
      bgExpDate: '' ,
      bgApproxExpiryDate: {value: '', disabled: true},
      bgExpEvent: [{value: '', disabled: true}, [Validators.maxLength(Constants.LENGTH_780)]],
      guaranteeTypeName: [{value: '', disabled: true}, [Validators.required]],
    });

    this.commonDataService.setBeneMandatoryVal(true);
    this.getFieldValues();

    this.mode = this.commonDataService.getMode();

    if (this.bgRecord.tnxTypeCode === '13') {
      this.isMessageToBank = true;
    }

    // Setting to false, since
    this.resetRenewalDetails.emit(Constants.UNDERTAKING_TYPE_IU);
        // Emit the form group to the parent
    this.formReady.emit(this.undertakingGeneralDetailsSection);
  }

  getFieldValues() {
    this.undertakingGeneralDetailsSection.patchValue({
      bgTypeCode: this.bgRecord.bgTypeCode,
      bgTypeDetails: this.bgRecord.bgTypeDetails,
      bgIssDateTypeDetails: this.bgRecord.bgIssDateTypeDetails,
      bgExpDateTypeCode: this.bgRecord.bgExpDateTypeCode,
      bgIssDateTypeCode: this.bgRecord.bgIssDateTypeCode,
      bgExpDate: this.bgRecord.bgExpDate,
      bgApproxExpiryDate: this.bgRecord.bgApproxExpiryDate,
      bgExpEvent: this.bgRecord.bgExpEvent,
      tnxId: this.bgRecord.tnxId,
      brchCode: this.bgRecord.brchCode,
      companyId: this.bgRecord.companyId,
      companyName: this.bgRecord.companyName,
      guaranteeTypeName: this.bgRecord.guaranteeTypeName
    });

    this.commonDataService.setRefId(this.bgRecord.refId);
    if (this.bgRecord.boRefId && this.bgRecord.boRefId !== undefined && this.bgRecord.boRefId !== null
      && this.bgRecord.boRefId !== ''){
        this.commonDataService.setBORefId(this.bgRecord.boRefId);
      }
    if (this.commonDataService.getDisplayMode() === 'view') {
        this.viewMode = true;
    }
    if (this.commonDataService.getmasterorTnx() === 'master') {
      this.isMaster = true;
    } else {
      this.isMaster = false;
    }
    if (this.commonDataService.getTnxType() === '01' &&
    (this.commonDataService.getOption() === Constants.OPTION_EXISTING
    || this.commonDataService.getOption() === Constants.OPTION_REJECTED)) {
      if (this.bgRecord.bgExpDateTypeCode === '02') {
        this.undertakingGeneralDetailsSection.get('bgExpDate').setValue('');
      } else if (this.bgRecord.bgExpDateTypeCode === '03') {
        this.undertakingGeneralDetailsSection.get('bgExpEvent').setValue('');
      }
      this.undertakingGeneralDetailsSection.get('bgApproxExpiryDate').setValue('');
    }
    this.commonDataService.setExpDateType('02', '');

    if (this.bgRecord.purpose && (this.bgRecord.purpose === '02' || this.bgRecord.purpose === '03')) {
      this.commonDataService.setBeneMandatoryVal(false);
    } else {
      this.commonDataService.setBeneMandatoryVal(true);
    }
    if (this.commonData.getIsBankUser()) {
      this.undertakingGeneralDetailsSection.get('guaranteeTypeName').clearValidators();
      this.undertakingGeneralDetailsSection.get('guaranteeTypeName').updateValueAndValidity();
    }
  }

  resetRenewalSection(flag) {
    this.resetRenewalDetails.emit(Constants.UNDERTAKING_TYPE_IU);
  }

  downloadTemplateFile(flag) {
    this.downloadBankTemplate.emit();
  }

  setConfInstValue(value) {
    this.confInstructions.emit(value);
  }

  generatePdf(generatePdfService) {
    if (this.mode !== 'UNSIGNED' && this.commonDataService.getTnxStatCode() !== '04' && !this.isMessageToBank &&
    this.tradeEventDetailsComponent) {
      this.tradeEventDetailsComponent.generatePdf(generatePdfService);
    }


    if (this.commonDataService.getPreviewOption() !== 'SUMMARY' && this.commonGeneralDetailsChildComponent) {
      this.commonGeneralDetailsChildComponent.generatePdf(generatePdfService);
    }
  }

  setExpDate(expDate) {
    this.expDate.emit(expDate);
  }

  setExpiryDateForExtension(expiryDateExtension) {
    this.expiryDateExtension.emit(expiryDateExtension);
  }

}
