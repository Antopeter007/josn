import { AmendBankDetailsComponent } from './components/amend-bank-details/amend-bank-details.component';
import { Constants } from '../../../common/constants';
import { ResponseService } from '../../../common/services/response.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { IUService } from '../common/service/iu.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { ValidationService } from '../../../common/validators/validation.service';
import { validateSwiftCharSet } from '../../../common/validators/common-validator';
import { AuditService } from '../../../common/services/audit.service';
import { CommonService } from '../../../common/services/common.service';
import { FilelistService } from '../../../common/services/filelist.service';
import { ReauthService } from '../../../common/services/reauth.service';
import { ReauthDialogComponent } from '../../../common/components/reauth-dialog/reauth-dialog.component';
import { TranslateService } from '@ngx-translate/core';
import { TnxIdGeneratorService } from '../../../common/services/tnxIdGenerator.service';
import { IssuedUndertakingRequest } from '../common/model/IssuedUndertakingRequest';
import { IssuedUndertaking } from '../common/model/issuedUndertaking.model';
import { IUCommonDataService } from '../common/service/iuCommonData.service';
import { ActionsComponent } from './../../../common/components/actions/actions.component';
import { IUCommonLicenseComponent } from '../common/components/license/license.component';
import { ShipmentDetailsComponent } from '../initiation/components/shipment-details/shipment-details.component';
import $ from 'jquery';
import { ReductionIncreaseComponent } from '../initiation/components/reduction-increase/reduction-increase.component';
import { DatePipe } from '@angular/common';
import { URLConstants } from '../../../common/urlConstants';
import { RenewalDetailsComponent } from '../initiation/components/renewal-details/renewal-details.component';

const jqueryConst = $;


@Component({
  selector: 'fcc-iu-amend',
  templateUrl: './iu-amend.component.html',
  styleUrls: ['./iu-amend.component.scss']
})
export class IUAmendComponent implements OnInit {

  amendForm: UntypedFormGroup;
  rawValuesForm: UntypedFormGroup;
  issuedundertaking: IssuedUndertakingRequest;
  contextPath: string;
  actionCode: string;
  responseMessage: object;
  public jsonContent;
  public showForm = true;
  protected submitted = false;
  public displayLUSection = false;
  masterIu: IssuedUndertaking;
  public mode;
  public tnxType;
  public tnxId;
  public refId;
  public operation: string;
  public enableReauthPopup = false;
  protected returnFormValid: boolean;
  protected licenseValidError: string;
  currencyDecimalMap = new Map<string, number>();
  private expDate: string;
  private finalRenewalExpDate: string;
  private readonly popUpDimensions = 'width=800,height=500,resizable=yes,scrollbars=yes';

  @ViewChild(ReauthDialogComponent) reauthDialogComponent: ReauthDialogComponent;
  @ViewChild(IUCommonLicenseComponent) iuLicenseComponent: IUCommonLicenseComponent;
  @ViewChild(ActionsComponent) actionsComponent: ActionsComponent;
  @ViewChild(AmendBankDetailsComponent) amendBankDetailsComponent: AmendBankDetailsComponent;
  @ViewChild(ShipmentDetailsComponent) shipmentDetailsComponent: ShipmentDetailsComponent;
  @ViewChild(ReductionIncreaseComponent) reductionIncreaseComponent: ReductionIncreaseComponent;
  @ViewChild(RenewalDetailsComponent) renewalDetailsComponent: RenewalDetailsComponent;

  constructor(
    protected fb: UntypedFormBuilder, protected iuService: IUService,
    protected fl: FilelistService, protected responseService: ResponseService,
    public commonDataService: IUCommonDataService, public commonService: CommonService,
    protected router: Router, protected activatedRoute: ActivatedRoute, protected reauthService: ReauthService,
    protected confirmationService: ConfirmationService, protected validationService: ValidationService,
    protected auditService: AuditService, protected translate: TranslateService,
    protected tnxIdGeneratorService: TnxIdGeneratorService, protected el: ElementRef, public datePipe: DatePipe
    ) { }

  ngOnInit() {
    this.contextPath = window[`CONTEXT_PATH`];
    this.actionCode = window[`ACTION_CODE`];
    let viewRefId;
    let viewTnxId;
    let mode;
    let tnxType;
    let masterOrTnx;
    this.activatedRoute.params.subscribe(paramsId => {
      viewRefId = paramsId.refId;
      viewTnxId = paramsId.tnxId;
      mode = paramsId.mode;
      tnxType = paramsId.tnxType;
      masterOrTnx = paramsId.masterOrTnx;
    });
    this.refId = viewRefId;
    this.mode = mode;
    this.commonService.setTnxType('03');
    if (this.mode === Constants.MODE_UNSIGNED) {
      // Fetch Master details to display original values.this.masterIu.contractReference = orgData['contractReference'];
      this.commonService.getMasterDetails(viewRefId, Constants.PRODUCT_CODE_IU, '').subscribe(data => {
        const orgData = data.masterDetails as string[];
        this.masterIu = new IssuedUndertaking();
        this.masterIu.bgExpDate = orgData[`bgExpDate`];
        this.masterIu.contractReference = orgData[`contractReference`];
        this.masterIu.contractNarrative = orgData[`contractNarrative`];
        this.masterIu.contractDate = orgData[`contractDate`];
        this.masterIu.tenderExpiryDate = orgData[`tenderExpiryDate`];
        this.masterIu.contractCurCode = orgData[`contractCurCode`];
        this.masterIu.contractAmt = this.commonService.transformAmt(orgData[`contractAmt`], orgData[`contractCurCode`]);
        this.masterIu.contractPct = orgData[`contractPct`];
        this.masterIu.bgAmt = orgData[`bgAmt`];
        this.masterIu.bgCurCode = orgData[`bgCurCode`];
        this.masterIu.bgAvailableAmt = this.commonService.transformAmt(orgData[`bgAvailableAmt`], orgData[`bgCurCode`]);
        this.masterIu.cuAmt = this.commonService.transformAmt(orgData[`cuAmt`], orgData[`cuCurCode`]);
        this.masterIu.cuCurCode = orgData[`cuCurCode`];
        this.masterIu.bgLiabAmt = this.commonService.transformAmt(orgData[`bgLiabAmt`], orgData[`bgCurCode`]);
        this.masterIu.bgExpDateTypeCode = orgData[`bgExpDateTypeCode`];
        this.masterIu.bgConfInstructions = orgData[`bgConfInstructions`];
        this.commonDataService.setOrgData(this.masterIu);
      });
      this.commonService.getTnxDetails(viewRefId, viewTnxId, Constants.PRODUCT_CODE_IU, this.actionCode).subscribe(data => {
        this.jsonContent = data.transactionDetails as string[];
        this.commonDataService.setDisplayMode(Constants.UNSIGNED_AMEND);
        if (this.jsonContent.purpose != null && this.jsonContent.purpose !== '' && this.jsonContent.purpose !== '01') {
          this.commonDataService.setLUStatus(true);
          this.commonDataService.setBeneMandatoryVal(false);
          this.displayLUSection = true;
        } else {
          this.commonDataService.setBeneMandatoryVal(true);
        }
      });
    } else if (mode === 'DRAFT' && tnxType === '03') {
      // Fetch Master details to display original values.this.masterIu.contractReference = orgData['contractReference'];
      this.commonService.getMasterDetails(viewRefId, Constants.PRODUCT_CODE_IU, '').subscribe(data => {
        const orgData = data.masterDetails as string[];
        this.masterIu = new IssuedUndertaking();
        this.masterIu.bgExpDate = orgData[`bgExpDate`];
        this.masterIu.contractReference = orgData[`contractReference`];
        this.masterIu.contractNarrative = orgData[`contractNarrative`];
        this.masterIu.contractDate = orgData[`contractDate`];
        this.masterIu.tenderExpiryDate = orgData[`tenderExpiryDate`];
        this.masterIu.contractCurCode = orgData[`contractCurCode`];
        this.masterIu.contractAmt = this.commonService.transformAmt(orgData[`contractAmt`], orgData[`contractCurCode`]);
        this.masterIu.contractPct = orgData[`contractPct`];
        this.masterIu.bgAmt = orgData[`bgAmt`];
        this.masterIu.bgCurCode = orgData[`bgCurCode`];
        this.masterIu.bgAvailableAmt = this.commonService.transformAmt(orgData[`bgAvailableAmt`], orgData[`bgCurCode`]);
        this.masterIu.cuAmt = this.commonService.transformAmt(orgData[`cuAmt`], orgData[`cuCurCode`]);
        this.masterIu.cuCurCode = orgData[`cuCurCode`];
        this.masterIu.bgLiabAmt = this.commonService.transformAmt(orgData[`bgLiabAmt`], orgData[`bgCurCode`]);
        this.masterIu.bgExpDateTypeCode = orgData[`bgExpDateTypeCode`];
        this.masterIu.bgConfInstructions = orgData[`bgConfInstructions`];
        this.commonDataService.setOrgData(this.masterIu);
      });
      this.commonService.getTnxDetails(viewRefId, viewTnxId, Constants.PRODUCT_CODE_IU, this.actionCode).subscribe(data => {
        this.jsonContent = data.transactionDetails as string[];
        this.commonDataService.setViewComments(true);
        if (this.jsonContent.purpose != null && this.jsonContent.purpose !== '' && this.jsonContent.purpose !== '01') {
          this.commonDataService.setLUStatus(true);
          this.commonDataService.setBeneMandatoryVal(false);
          this.displayLUSection = true;
        } else {
          this.commonDataService.setBeneMandatoryVal(true);
        }
      });
      this.mode = mode;
      this.tnxType = tnxType;
      this.tnxId = viewTnxId;
      this.commonDataService.setMode(Constants.MODE_DRAFT);
      this.commonDataService.setTnxType(this.tnxType);
      this.commonDataService.setRefId(viewRefId);
      this.commonDataService.setTnxId(viewTnxId);
    } else {
      // Fetch Master details to display original values.this.masterIu.contractReference = orgData['contractReference'];
      this.commonService.getMasterDetails(viewRefId, Constants.PRODUCT_CODE_IU, this.actionCode).subscribe(data => {
        const orgData = data.masterDetails as string[];
        this.masterIu = new IssuedUndertaking();
        this.masterIu.bgExpDate = orgData[`bgExpDate`];
        this.masterIu.contractReference = orgData[`contractReference`];
        this.masterIu.contractNarrative = orgData[`contractNarrative`];
        this.masterIu.contractDate = orgData[`contractDate`];
        this.masterIu.tenderExpiryDate = orgData[`tenderExpiryDate`];
        this.masterIu.contractCurCode = orgData[`contractCurCode`];
        this.masterIu.contractAmt = this.commonService.transformAmt(orgData[`contractAmt`], orgData[`contractCurCode`]);
        this.masterIu.contractPct = orgData[`contractPct`];
        this.masterIu.bgAmt = orgData[`bgAmt`];
        this.masterIu.bgCurCode = orgData[`bgCurCode`];
        this.masterIu.bgAvailableAmt = this.commonService.transformAmt(orgData[`bgAvailableAmt`], orgData[`bgCurCode`]);
        this.masterIu.cuAmt = this.commonService.transformAmt(orgData[`cuAmt`], orgData[`cuCurCode`]);
        this.masterIu.cuCurCode = orgData[`cuCurCode`];
        this.masterIu.bgLiabAmt = this.commonService.transformAmt(orgData[`bgLiabAmt`], orgData[`bgCurCode`]);
        this.masterIu.bgExpDateTypeCode = orgData[`bgExpDateTypeCode`];
        this.masterIu.bgConfInstructions = orgData[`bgConfInstructions`];
        this.commonDataService.setOrgData(this.masterIu);
        this.jsonContent = data.masterDetails as string[];
        this.commonDataService.setMode(Constants.MODE_AMEND);
        if (this.jsonContent.purpose != null && this.jsonContent.purpose !== '' && this.jsonContent.purpose !== '01') {
          this.commonDataService.setLUStatus(true);
          this.commonDataService.setBeneMandatoryVal(false);
          this.displayLUSection = true;
        } else {
          this.commonDataService.setBeneMandatoryVal(true);
        }
      });
      this.tnxIdGeneratorService.getTransactionId().subscribe(data => {
        this.tnxId = data.tnxId as string;
        this.commonDataService.setTnxId(this.tnxId);
      });

      this.commonDataService.setRefId(viewRefId);
    }
    // Fetching decimal number allowed for every currency
    this.currencyDecimalMap = this.commonService.getCurrencyDecimalMap();
    this.createMainForm();

  }

  createMainForm() {
    return this.amendForm = this.fb.group({});
  }

  // After a form is initialized, we link it to our main form

  addToForm(name: string, form: UntypedFormGroup) {
    this.amendForm.setControl(name, form);
  }

  setResponse(data) {
    this.responseService.setResponseMessage(data.message);
    this.responseService.setRefId(data.refId);
    this.responseService.setTnxId(data.tnxId);
    this.responseService.setOption(data.option);
    this.responseService.setTnxType(data.tnxTypeCode);
    this.responseService.setSubTnxType(data.subTnxTypeCode);
  }


  onSave() {
    const invalidControl = this.commonService.OnSaveFormValidation(this.amendForm);
    if (invalidControl) {
      let message = '';
      let dialogHeader = '';
      this.translate.get('ERROR_TITLE').subscribe((value: string) => {
        dialogHeader = value;
      });
      this.translate.get('ON_SAVE_FIELD_ERROR').subscribe((value: string) => {
        message = value;
      });

      this.confirmationService.confirm({
        message,
        header: dialogHeader,
        icon: Constants.TRIANGLE_ICON,
        key: 'fieldErrorDialog',
        rejectVisible: false,
        acceptLabel: this.commonService.getTranslation('USER_ACTION_OK'),
        accept: () => {
          const formGroupInvalid = this.el.nativeElement.querySelectorAll('.ng-invalid.ng-dirty.ng-touched.fieldError');
          if (formGroupInvalid) {
            const target = jqueryConst('.ng-invalid.ng-dirty.ng-touched.fieldError:not(form):first');
            jqueryConst('html,body').animate({ scrollTop: (target.offset().top - Constants.NUMERIC_TWENTY) }, 'slow', () => {
              target.trigger('focus');
            });
          }
        }
    });
    } else {
    this.actionsComponent.showProgressBar = true;
    this.translate.get('PROGRESSBAR_MSG_SAVE').subscribe((value: string) => {
      this.actionsComponent.displayMessage = value;
    });
    // entity validation is remaining to be done later
    this.showForm = false;
    this.submitted = true;
    this.transformToIssuedUndertaking();
    this.iuService.saveOrSubmitIU(this.contextPath + URLConstants.IU_SAVE,
      this.issuedundertaking).subscribe(
        data => {
          this.responseMessage = data.message;
          this.setResponse(data);
          this.router.navigate(['submitOrSave']);
        }
      );
    }

  }

  transformToIssuedUndertaking() {
    this.rawValuesForm = new UntypedFormGroup({});
    Object.assign(this.rawValuesForm, this.amendForm.getRawValue());
    this.issuedundertaking = new IssuedUndertakingRequest();

    this.issuedundertaking.tnxId = this.tnxId;
    this.issuedundertaking.refId = this.amendForm.controls[`amendGeneraldetailsSection`].get('refId').value;
    this.issuedundertaking.custRefId = this.amendForm.controls[`amendGeneraldetailsSection`].get('custRefId').value;
    this.issuedundertaking.additionalCustRef = this.amendForm.controls[`amendGeneraldetailsSection`].get('additionalCustRef').value;
    this.issuedundertaking.bgIssDateTypeCode = this.amendForm.controls[`amendGeneraldetailsSection`].get('bgIssDateTypeCode').value;
    this.issuedundertaking.bgAmdNo = this.amendForm.controls[`amendGeneraldetailsSection`].get('bgAmdNo').value;
    this.issuedundertaking.attids = this.commonDataService.getAttIds();
    if (this.amendForm.controls[`amendGeneraldetailsSection`].get('bgConfInstructions').value !== '03') {
    this.issuedundertaking.reqConfParty = this.amendForm.controls[`amendBankDetailsSection`].get('reqConfParty').value;
    }

    this.issuedundertaking.tnxTypeCode = '03';
    this.issuedundertaking.merge(this.rawValuesForm[Constants.SECTION_APPLICANT_DETAILS]);
    this.issuedundertaking.merge(this.rawValuesForm[Constants.SECTION_ALT_APPLICANT_DETAILS]);
    this.issuedundertaking.merge(this.rawValuesForm[Constants.SECTION_BENEFICIARY_DETAILS]);
    this.issuedundertaking.merge(this.amendForm.controls.amendGeneraldetailsSection.value);
    // This has to be done for all drop downs
    // this.issuedundertaking.purpose = this.amendForm.controls['amendGeneraldetailsSection'].get('purpose').value.value;
    this.issuedundertaking.bgExpDateTypeCode = this.amendForm.controls.amendGeneraldetailsSection.get('bgExpDateTypeCode').value;
    this.issuedundertaking.bgTransferIndicator = this.commonDataService
      .getCheckboxFlagValues(this.amendForm.controls[`amendGeneraldetailsSection`].get('bgTransferIndicator').value);
    this.issuedundertaking.merge(this.amendForm.controls[`amendAmtForm`].value);

    if (this.amendForm.controls[`amendAmtForm`].get('subTnxTypeCode') &&
      (this.amendForm.controls[`amendAmtForm`].get('subTnxTypeCode').value === null
        || this.amendForm.controls[`amendAmtForm`].get('subTnxTypeCode').value === '')) {
      this.issuedundertaking.subTnxTypeCode = '03';
      // Set the original bgAmt from master, when it is null, for terms condition.
      if (this.issuedundertaking.bgAmt === null || this.issuedundertaking.bgAmt === '') {
        this.issuedundertaking.bgAmt = this.jsonContent.bgAmt;
      }
    }

    this.issuedundertaking.mergeBankDetailsSection(this.rawValuesForm[Constants.AMEND_BANK_DETAILS], this.commonDataService);
    this.issuedundertaking.merge(this.amendForm.controls[`amendContractDetailsSection`].value);
    this.issuedundertaking.contractReference = this.amendForm.controls[`amendContractDetailsSection`].get('contractReference').value;
    this.issuedundertaking.customerIdentifier =
    this.amendForm.controls[Constants.SECTION_BENEFICIARY_DETAILS].get('customerIdentifier').value;
    this.issuedundertaking.customerIdentifierOther =
      this.amendForm.controls[Constants.SECTION_BENEFICIARY_DETAILS].get('customerIdentifierOther').value;

    this.issuedundertaking.merge(this.amendForm.controls[`amendNarrativeSection`].value);
    this.issuedundertaking.merge(this.amendForm.controls[`amendBankInstructionsSection`].value);
    this.issuedundertaking.merge(this.amendForm.controls[`fileUploadSection`].value);
    this.issuedundertaking.bgDeliveryTo = this.amendForm.controls[`amendBankInstructionsSection`].get('bgDeliveryTo').value;
    this.issuedundertaking.bgDelvOrgUndertaking =
    this.amendForm.controls[`amendBankInstructionsSection`].get('bgDelvOrgUndertaking').value;
    if (this.amendForm.controls[`fileUploadSection`].get('bgSendAttachmentsBy').value !== '') {
      this.issuedundertaking.bgSendAttachmentsBy = this.amendForm.controls[`fileUploadSection`].get('bgSendAttachmentsBy').value;
    }
    if (this.amendForm.get(Constants.SECTION_INCR_DECR).get(`bgVariationType`).value) {
      this.issuedundertaking.mergeVariationDetails(this.rawValuesForm[Constants.SECTION_INCR_DECR], this.commonDataService);
    }
    if (this.rawValuesForm[`License`] && this.rawValuesForm[`License`].listOfLicenses !== '') {
      this.issuedundertaking.mergeLicensesSection(this.rawValuesForm[`License`]);
    }
    if (this.commonDataService.getExpDateType() === '02' || this.masterIu.bgExpDateTypeCode === '02') {
        this.issuedundertaking.merge(this.rawValuesForm[Constants.SECTION_RENEWAL_DETAILS]);
        if (this.amendForm.controls[Constants.SECTION_RENEWAL_DETAILS]) {
          this.issuedundertaking.bgRenewFlag = this.commonDataService
            .getCheckboxFlagValues(this.amendForm.controls[Constants.SECTION_RENEWAL_DETAILS].get('bgRenewFlag').value);
          this.issuedundertaking.bgRollingRenewalFlag =
            this.commonDataService.getCheckboxFlagValues(
              this.amendForm.controls[Constants.SECTION_RENEWAL_DETAILS].get('bgRollingRenewalFlag').value);
          this.issuedundertaking.bgAdviseRenewalFlag = this.commonDataService
            .getCheckboxFlagValues(this.amendForm.controls[Constants.SECTION_RENEWAL_DETAILS].get('bgAdviseRenewalFlag').value);
          this.issuedundertaking.bgRenewForPeriod =
          this.amendForm.controls[Constants.SECTION_RENEWAL_DETAILS].get('bgRenewForPeriod').value;
          this.issuedundertaking.bgRenewOnCode = this.amendForm.controls[Constants.SECTION_RENEWAL_DETAILS].get('bgRenewOnCode').value;
          this.issuedundertaking.bgRollingRenewForPeriod =
            this.amendForm.controls[Constants.SECTION_RENEWAL_DETAILS].get('bgRollingRenewForPeriod').value;
          this.issuedundertaking.bgRollingRenewOnCode =
            this.amendForm.controls[Constants.SECTION_RENEWAL_DETAILS].get('bgRollingRenewOnCode').value;
        }
      }

    if (this.commonDataService.getSubProdCode() === Constants.STAND_BY) {
      this.issuedundertaking.bgCrAvlByCode = this.rawValuesForm[Constants.SECTION_PAYMENT_DETAILS].bgCrAvlByCode;
      this.issuedundertaking.mergeCreditAvlWithBankDetails(this.rawValuesForm[Constants.SECTION_PAYMENT_DETAILS],
        'bg', this.commonDataService);
      this.issuedundertaking.merge(this.rawValuesForm[Constants.SECTION_SHIPMENT_DETAILS]);
    }
    this.issuedundertaking.applicantReference = this.jsonContent.applicantReference;
    if (this.commonService.getTnxToDoListId() != null && this.commonService.getTnxToDoListId() !== '' ) {
      this.issuedundertaking.todoListId = this.commonService.getTnxToDoListId();
    }
  }

    onSubmit() {
    this.showForm = false;
    this.submitted = true;
    this.validateLS();
    if (this.licenseValidError === undefined) {
      this.actionsComponent.showProgressBar = true;
      this.translate.get('PROGRESSBAR_MSG_SUBMIT').subscribe((value: string) => {
        this.actionsComponent.displayMessage = value;
      });
      this.iuService.saveOrSubmitIU(this.contextPath + URLConstants.IU_SUBMIT,
        this.issuedundertaking).subscribe(
          data => {
            this.responseMessage = data.message;
            const response = data.response;
            this.setResponse(data);
            if (this.enableReauthPopup && response === Constants.RESPONSE_REAUTH_FAILURE) {
              this.actionsComponent.showProgressBar = false;
              this.reauthDialogComponent.onReauthSubmitCompletion(response);
            } else {
              this.router.navigate(['submitOrSave']);
            }
          }
        );
    }
  }

    validateAllFields(mainForm: UntypedFormGroup) {
    mainForm.markAllAsTouched();
    if (!this.amendForm.valid) {
      let message = '';
      let dialogHeader = '';
      this.translate.get('ERROR_TITLE').subscribe((value: string) => {
        dialogHeader = value;
      });
      this.translate.get('FIELD_ERROR').subscribe((value: string) => {
        message = value;
      });

      this.confirmationService.confirm({
        message,
        header: dialogHeader,
        icon: Constants.TRIANGLE_ICON,
        key: 'fieldErrorDialog',
        rejectVisible: false,
        acceptLabel: this.commonService.getTranslation('USER_ACTION_OK'),
        accept: () => {
          const formGroupInvalid = this.el.nativeElement.querySelectorAll('.ng-invalid');
          if (formGroupInvalid) {
            const target = jqueryConst('.ng-invalid:not(form):first');
            const topDiff = 20;
            jqueryConst('html,body').animate({ scrollTop: (target.offset().top - topDiff) }, 'slow', () => {
              target.trigger('focus');
            });
          }
        }
      });
    }
  }

    transformForUnsignedMode() {
    this.rawValuesForm = new UntypedFormGroup({});
    Object.assign(this.rawValuesForm, this.amendForm.getRawValue());
    this.issuedundertaking = new IssuedUndertakingRequest();
    this.issuedundertaking.tnxTypeCode = '03';
    this.issuedundertaking.refId = this.commonDataService.getRefId();
    this.issuedundertaking.tnxId = this.commonDataService.getTnxId();
    if ((this.operation === Constants.OPERATION_RETURN) || (this.jsonContent[`returnComments`] &&
        this.jsonContent[`returnComments`] !== null && this.jsonContent[`returnComments`] !== '')) {
      const returnComments = this.rawValuesForm[`commentsForm`].returnComments;
      this.issuedundertaking.returnComments = returnComments;
    }
    this.issuedundertaking.applicantReference = this.jsonContent.applicantReference;
    if (this.commonService.getTnxToDoListId() != null && this.commonService.getTnxToDoListId() !== '' ) {
      this.issuedundertaking.todoListId = this.commonService.getTnxToDoListId();
    }
  }

    onSubmitRetrieveUnsigned() {
    this.actionsComponent.showProgressBar = true;
    this.translate.get('PROGRESSBAR_MSG_SUBMIT').subscribe((value: string) => {
      this.actionsComponent.displayMessage = value;
    });
    this.showForm = false;
    this.submitted = true;
    this.iuService.submitFromRetrieveUnsigned(this.issuedundertaking).subscribe(
      data => {
        this.responseMessage = data.message;
        const response = data.response;
        this.setResponse(data);
        if (this.enableReauthPopup && response === Constants.RESPONSE_REAUTH_FAILURE) {
          this.actionsComponent.showProgressBar = false;
          this.reauthDialogComponent.onReauthSubmitCompletion(response);
        } else {
          this.router.navigate(['submitOrSave']);
        }
      }
    );

  }

    onReturn() {
    this.actionsComponent.showProgressBar = true;
    this.translate.get('PROGRESSBAR_MSG_RETURN').subscribe((value: string) => {
      this.actionsComponent.displayMessage = value;
    });
    this.iuService.returnIssuedUndertaking(this.issuedundertaking)
      .subscribe(
        data => {
          this.responseMessage = data.message;
          const response = data.response;
          this.setResponse(data);
          if (this.enableReauthPopup && response === Constants.RESPONSE_REAUTH_FAILURE) {
            this.actionsComponent.showProgressBar = false;
            this.reauthDialogComponent.onReauthSubmitCompletion(response);
          } else {
            this.router.navigate(['submitOrSave']);
          }
        }
      );
  }

    openPreview() {
    const host = window.location.origin;
    let url = host + this.commonService.getBaseServletUrl();
    url += Constants.PREVIEW_POPUP_SCREEN;
    url += `/?option=FULL&referenceid=${this.commonDataService.getRefId()}`;
    url += `&tnxid=${this.commonDataService.getTnxId()}`;
    url += `&productcode=${this.commonDataService.getProductCode()}&tnxtype=03`;
    const myWindow = window.open(url,
      Constants.TRANSACTION_POPUP, this.popUpDimensions);
    myWindow.focus();
  }
    onCancel() {
    const host = window.location.origin;
    let url = host + this.commonService.getBaseServletUrl();
    url += Constants.IU_LANDING_SCREEN;
    window.location.replace(url);
    this.auditService.audit().subscribe(
      data => {
      }
    );
  }

    validateForm() {
    this.validateAllFields(this.amendForm);
  }

    showReauthPopup(operation) {
    const entity = this.jsonContent.entity;
    const currency = this.jsonContent.bgCurCode;
    let amount = this.commonService.getNumberWithoutLanguageFormatting(this.amendForm.get('amendAmtForm').get('bgAmt').value);
    if (amount === '' || amount === null) {
      amount = this.jsonContent.bgAmt;
    }
    const subProdCode = this.jsonContent.subProductCode;
    const bank = 'DEMOBANK';
    const reauthParams = new Map();
    reauthParams.set('productCode', Constants.PRODUCT_CODE_IU);
    reauthParams.set('subProductCode', subProdCode);
    reauthParams.set('tnxTypeCode', '03');
    reauthParams.set('entity', entity);
    reauthParams.set('currency', currency);
    reauthParams.set('amount', amount);
    reauthParams.set('bankAbbvName', bank);
    reauthParams.set('es_field1', '');
    reauthParams.set('es_field2', '');
    reauthParams.set('tnxData', this.issuedundertaking);
    reauthParams.set('operation', operation);
    reauthParams.set('mode', this.mode);

    // Call Reauth service to get the re-auth type
    this.reauthService.getReauthType(reauthParams).subscribe(
      data => {
        const reauthType = data.response;
        if (reauthType === 'PASSWORD') {
          this.reauthDialogComponent.enableReauthPopup = true;
          // setting reauthPassword to '' as it has to get cleared when user clicks on submit after reauthentication failure
          this.reauthDialogComponent.reauthForm.get('reauthPassword').setValue('');
        } else if (reauthType === 'ERROR') {
          this.reauthDialogComponent.enableErrorPopup = true;
        } else {
          this.enableReauthPopup = false;
          if (this.operation === Constants.OPERATION_SUBMIT && this.mode !== Constants.MODE_UNSIGNED) {
            this.onSubmit();
          } else if (this.operation === Constants.OPERATION_SUBMIT && this.mode === Constants.MODE_UNSIGNED) {
            this.onSubmitRetrieveUnsigned();
          } else if (this.operation === Constants.OPERATION_RETURN) {
            this.onReturn();
          }
        }
      });
  }

    onReauthSubmit() {
    // Set reauth form details.
    this.issuedundertaking.clientSideEncryption = this.amendForm.controls[`reauthForm`].get('clientSideEncryption').value;
    this.issuedundertaking.reauthPassword = this.amendForm.controls[`reauthForm`].get('reauthPassword').value;
    this.issuedundertaking.reauthPerform = this.amendForm.controls[`reauthForm`].get('reauthPerform').value;

    if (this.operation === Constants.OPERATION_SUBMIT && this.mode !== Constants.MODE_UNSIGNED) {
      this.onSubmit();
    } else if (this.operation === Constants.OPERATION_SUBMIT && this.mode === Constants.MODE_UNSIGNED) {
      this.onSubmitRetrieveUnsigned();
    } else if (this.operation === Constants.OPERATION_RETURN) {
      this.onReturn();
    }
  }

    validateFormOnReturn(): string | undefined {
    const comments = this.amendForm.controls.commentsForm.get('returnComments');
    comments.setValidators([Validators.required, validateSwiftCharSet(Constants.Z_CHAR)]);
    comments.updateValueAndValidity();
    this.returnFormValid = true;
    if (!comments.valid) {
      comments.markAsTouched();
      this.returnFormValid = false;
      return this.validationService.validateField(comments);
    }
  }

    handleEvents(operation) {
    this.operation = operation;
    if (operation === Constants.OPERATION_SAVE) {
      this.onSave();
    } else if (operation === Constants.OPERATION_SUBMIT && this.mode === Constants.MODE_UNSIGNED) {
      if (this.commonService.getReauthEnabled()) {
        this.enableReauthPopup = this.commonService.getReauthEnabled();
        this.transformForUnsignedMode();
        this.showReauthPopup(Constants.OPERATION_SUBMIT);
      } else {
        this.transformForUnsignedMode();
        this.onSubmitRetrieveUnsigned();
      }
    } else if (operation === Constants.OPERATION_SUBMIT && this.mode !== Constants.MODE_UNSIGNED) {
      this.validateForm();
      if (this.amendForm.valid && this.commonService.getReauthEnabled()) {
        this.transformToIssuedUndertaking();
        this.enableReauthPopup = this.commonService.getReauthEnabled();
        this.showReauthPopup(Constants.OPERATION_SUBMIT);
      } else if (this.amendForm.valid) {
        this.transformToIssuedUndertaking();
        this.onSubmit();
      }
    } else if (operation === Constants.OPERATION_CANCEL) {
      this.onCancel();
    } else if (operation === Constants.OPERATION_RETURN) {
      this.validateFormOnReturn();
      if (this.returnFormValid && this.commonService.getReauthEnabled()) {
        this.enableReauthPopup = this.commonService.getReauthEnabled();
        this.transformForUnsignedMode();
        this.showReauthPopup(Constants.REAUTH_OPERATION_RETURN);
      } else if (this.returnFormValid) {
        this.transformForUnsignedMode();
        this.onReturn();
      }
    } else if (operation === Constants.OPERATION_PREVIEW) {
      this.openPreview();
    } else if (operation === Constants.OPERATION_HELP) {
      this.openHelp();
    }
  }

    validateLS() {
    this.licenseValidError = undefined;
    if (this.iuLicenseComponent.uploadFile.licenseMap.length > 0) {
      let sum = 0;
      for (const license of this.iuLicenseComponent.uploadFile.licenseMap) {
        const amt: number = parseFloat(this.commonService.getNumberWithoutLanguageFormatting(license.lsAllocatedAmt));
        if (amt > 0) {
          sum = sum + amt;
        } else {
          this.licenseValidError = 'ERROR_ZERO_LS_AMT';
          break;
        }
      }

      if (this.licenseValidError === undefined && sum !==
        parseFloat(this.commonService.getNumberWithoutLanguageFormatting(this.issuedundertaking.bgAmt))) {
        this.licenseValidError = 'ERROR_NOT_EQUAL_LS_AMT';
      }
    }
    if (this.licenseValidError !== undefined) {
      let message = '';
      let dialogHeader = '';
      this.translate.get('ERROR_TITLE').subscribe((value: string) => {
        dialogHeader = value;
      });
      this.translate.get(this.licenseValidError).subscribe((value: string) => {
        message = value;
      });

      this.confirmationService.confirm({
        message,
        header: dialogHeader,
        icon: Constants.TRIANGLE_ICON,
        key: 'amendLinkedLicenseErrorDialog',
        rejectVisible: false,
        acceptLabel: this.commonService.getTranslation('USER_ACTION_OK'),
        accept: () => { }
      });
    }

  }

    setConfInstValue(value) {
    this.amendBankDetailsComponent.checkConfirmingBankMandatory(value);
  }

    loadCUPreview() {
    const host = window.location.origin;
    let url = host + this.commonService.getBaseServletUrl();
    url += Constants.PREVIEW_POPUP_SCREEN;
    url = `${url}/?option=CUPreview&referenceid=${this.refId}&productcode=BG`;
    const myWindow = window.open(`${url}`,
    `CounterPopup`, this.popUpDimensions);
    myWindow.focus();
  }

    setRenewalExpDate(finalRenewalExpDateAndType) {
    if (finalRenewalExpDateAndType !== '' && finalRenewalExpDateAndType !== null) {
      let finalRenewalExpDate = finalRenewalExpDateAndType.split(',')[0];
      if (finalRenewalExpDate !== '' && finalRenewalExpDate != null) {
        finalRenewalExpDate = this.commonService.getDateObject(finalRenewalExpDate);
      }
      this.finalRenewalExpDate = finalRenewalExpDate;
      this.setMaxExpDate();
    }
  }

    setExpDate(expiryDate) {
      if (expiryDate !== '' && expiryDate != null) {
        expiryDate = this.commonService.getDateObject(expiryDate);
      }
      this.expDate = expiryDate;
      this.setMaxExpDate();
  }

    setMaxExpDate() {
    //let form ;
    let renewalExpDate;
    let expDate;
    let firstDate;
    const form = this.reductionIncreaseComponent;
    if (this.commonDataService.getExpDateType() !== '02') {
      this.finalRenewalExpDate = '';
    }
    renewalExpDate = this.finalRenewalExpDate;
    expDate = this.expDate;
    const renewalDetailSectionControl = this.amendForm.get(Constants.SECTION_RENEWAL_DETAILS);
    if (renewalExpDate === undefined || renewalExpDate === '') {
        renewalExpDate = ( renewalDetailSectionControl ?  renewalDetailSectionControl.get('bgFinalExpiryDate').value : '');
        renewalExpDate = renewalExpDate !== '' ? this.commonService.getDateObject(renewalExpDate) : '';
      }
    if (expDate === undefined || expDate === '') {
        expDate = this.amendForm.get(Constants.AMEND_GENERAL_DETAILS).get('bgExpDate').value;
        expDate = expDate !== '' ? this.commonService.getDateObject(expDate) : '';
      }
    firstDate = form.redIncForm.controls.bgVariationFirstDate !== undefined ? form.redIncForm.controls.bgVariationFirstDate.value : '';
    if (firstDate !== '' && firstDate != null ) {
      firstDate = this.commonService.getDateObject(firstDate);
      firstDate = Date.parse(this.datePipe.transform(firstDate , Constants.DATE_FORMAT));
    }

    if (renewalExpDate !== '' && renewalExpDate !== undefined) {
       this.commonService.maxDate = renewalExpDate;
       this.commonService.expiryDateType = Constants.EXTENSION_EXPIRY_TYPE;
       renewalExpDate = Date.parse(this.datePipe.transform(renewalExpDate , Constants.DATE_FORMAT));
       this.commonService.setMaxFirstDateValidations(firstDate, renewalExpDate, form.redIncForm, Constants.UNDERTAKING_TYPE_IU,
                              Constants.EXTENSION_EXPIRY_TYPE);
    } else if (expDate !== '' && expDate !== undefined) {
      this.commonService.maxDate = expDate;
      this.commonService.expiryDateType = Constants.EXPIRY_TYPE;
      expDate = Date.parse(this.datePipe.transform(expDate , Constants.DATE_FORMAT));
      this.commonService.setMaxFirstDateValidations(firstDate, expDate, form.redIncForm,
        Constants.UNDERTAKING_TYPE_IU, Constants.EXPIRY_TYPE);
    }
  }

  reCalculateVariationAmount() {
    this.reductionIncreaseComponent.commonReductionIncreaseChildComponent.reCalculateVariationAmount();
  }

  openHelp() {
    const host = window.location.origin;
    let url = host + this.commonService.getBaseServletUrl();
    const userLanguage = this.commonService.getUserLanguage();
    const accessKey = Constants.HELP_IU_AMEND;
    url += URLConstants.ONLINE_HELP;
    url += `/?helplanguage=${userLanguage}`;
    url += `&accesskey=${accessKey}`;
    const myWindow = window.open(url, Constants.TRANSACTION_POPUP, this.popUpDimensions);
    myWindow.focus();
  }

  setExpiryDateForExtension() {
      if (this.renewalDetailsComponent) {
      this.renewalDetailsComponent.commonRenewalDetails.setFinalExpiryDate('bg');
     }
   }
   resetRenewalSection(undertakingType) {
    if (this.renewalDetailsComponent && undertakingType === Constants.UNDERTAKING_TYPE_IU) {
      this.renewalDetailsComponent.commonRenewalDetails.clearAllRenewalFieldsAndValidators();
    }
  }
}

