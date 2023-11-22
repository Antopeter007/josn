import { Constants } from './../../../common/constants';
import { TnxIdGeneratorService } from './../../../common/services/tnxIdGenerator.service';
import { Component, OnInit, EventEmitter, Output, ViewChild } from '@angular/core';
import { UntypedFormGroup, Validators, UntypedFormBuilder, UntypedFormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { IssuedUndertakingRequest } from '../common/model/IssuedUndertakingRequest';
import { ConfirmationService, DialogService } from 'primeng';
import { DropdownObject } from '../common/model/DropdownObject.model';
import { ValidationService } from '../../../common/validators/validation.service';
import { AccountDialogComponent } from '../../../common/components/account-dialog/account-dialog.component';
import { ResponseService } from '../../../common/services/response.service';
import { validateSwiftCharSet, validateDates, validateAmountField, validateReleaseAmount} from '../../../common/validators/common-validator';
import { TranslateService } from '@ngx-translate/core';
import { AuditService } from '../../../common/services/audit.service';
import { CommonService } from '../../../common/services/common.service';
import { ReauthService } from '../../../common/services/reauth.service';
import { ReauthDialogComponent } from '../../../common/components/reauth-dialog/reauth-dialog.component';
import { IUService } from '../common/service/iu.service';
import { IUCommonDataService } from '../common/service/iuCommonData.service';
import { GeneratePdfService } from './../../../common/services/generate-pdf.service';
import { ActionsComponent } from './../../../common/components/actions/actions.component';
import { TradeEventDetailsComponent } from '../../common/components/event-details/event-details.component';
import { CommonDataService } from '../../../common/services/common-data.service';
import { URLConstants } from './../../../common//urlConstants';
import { DatePipe } from '@angular/common';
import { IUGeneralDetailsComponent } from '../initiation/components/iu-general-details/iu-general-details.component';
import { IUCommonApplicantDetailsComponent } from '../common/components/applicant-details-form/applicant-details-form.component';
import { RenewalDetailsComponent } from '../initiation/components/renewal-details/renewal-details.component';
import { BankDetailsComponent } from '../initiation/components/bank-details/bank-details.component';
import { ContractDetailsComponent } from '../initiation/components/contract-details/contract-details.component';
import { BankInstructionsComponent } from '../initiation/components/bank-instructions/bank-instructions.component';
import { UndertakingDetailsComponent } from '../initiation/components/undertaking-details/undertaking-details.component';
import { IUCommonAmountDetailsComponent } from '../common/components/amount-details/amount-details.component';
import { CuRenewalDetailsComponent } from '../initiation/components/cu-renewal-details/cu-renewal-details.component';
import { CuGeneralDetailsComponent } from '../initiation/components/cu-general-details/cu-general-details.component';
import { CuAmountDetailsComponent } from '../initiation/components/cu-amount-details/cu-amount-details.component';
import { CuBeneficiaryDetailsComponent } from '../initiation/components/cu-beneficiary-details/cu-beneficiary-details.component';
import { CuUndertakingDetailsComponent } from '../initiation/components/cu-undertaking-details/cu-undertaking-details.component';
import { CuReductionIncreaseComponent } from '../initiation/components/cu-reduction-increase/cu-reduction-increase.component';
import { ReductionIncreaseComponent } from '../initiation/components/reduction-increase/reduction-increase.component';
import { IuPaymentDetailsComponent } from '../initiation/components/iu-payment-details/iu-payment-details.component';
import { CuPaymentDetailsComponent } from '../initiation/components/cu-payment-details/cu-payment-details.component';
import { PhraseDialogComponent } from './../../../common/components/phrase-dialog/phrase-dialog.component';
import { IUCommonReturnCommentsComponent } from '../common/components/return-comments/return-comments.component';

interface Account {
  ACCOUNTNO: string;
}

@Component({
  selector: 'fcc-iu-amend-release',
  templateUrl: './iu-amend-release.component.html',
  styleUrls: ['./iu-amend-release.component.scss']
})
export class IUAmendReleaseComponent implements OnInit {

  public bgRecord;
  public bankDetails: string[] = [];
  @Output() formReady = new EventEmitter<UntypedFormGroup>();
  amendReleaseSection: UntypedFormGroup;
  rawValuesForm: UntypedFormGroup;
  public jsonContent;
  issuedundertaking: IssuedUndertakingRequest;
  amdDateSelected: string;
  curDate: string;
  bgReleaseFlagSelected: boolean;
  contextPath: string;
  actionCode: string;
  responseMessage: object;
  public showForm = true;
  public viewMode = false;
  private submitted = false;
  public isRequired = false;
  public mode;
  public tnxType;
  public tnxId;
  public option;
  public ReductionReleaseReasonsObj: DropdownObject[];
  public reasonReductionReleaseSelected: DropdownObject;
  amdNum: string;
  yearRange: string;
  public operation: string;
  public enableReauthPopup = false;
  private returnFormValid: boolean;
  currencyDecimalMap = new Map<string, number>();
  modalDialogTitle: string;
  dateFormat: string;
  public luStatus = false;
  public showCommentSection = false;
  @ViewChild(ReauthDialogComponent) reauthDialogComponent: ReauthDialogComponent;
  @ViewChild(ActionsComponent) actionsComponent: ActionsComponent;
  @ViewChild(TradeEventDetailsComponent) tradeEventDetailsComponent: TradeEventDetailsComponent;
  @ViewChild(IUGeneralDetailsComponent) iuGeneralDetailsComponent: IUGeneralDetailsComponent;
  @ViewChild(IUCommonApplicantDetailsComponent) iuCommonApplicantDetailsComponent: IUCommonApplicantDetailsComponent;
  @ViewChild(IUCommonAmountDetailsComponent) iuCommonAmountDetailsComponent: IUCommonAmountDetailsComponent;
  @ViewChild(RenewalDetailsComponent) renewalDetailsComponent: RenewalDetailsComponent;
  @ViewChild(BankDetailsComponent) bankDetailsComponent: BankDetailsComponent;
  @ViewChild(ContractDetailsComponent) contractDetailsComponent: ContractDetailsComponent;
  @ViewChild(BankInstructionsComponent) bankInstructionsComponent: BankInstructionsComponent;
  @ViewChild(UndertakingDetailsComponent) undertakingDetailsComponent: UndertakingDetailsComponent;
  @ViewChild(CuGeneralDetailsComponent) luGeneraldetailsChildComponent: CuGeneralDetailsComponent;
  @ViewChild(CuBeneficiaryDetailsComponent) cuBeneficaryDetailsChildComponent: CuBeneficiaryDetailsComponent;
  @ViewChild(CuAmountDetailsComponent) luAmountDetailsChildComponent: CuAmountDetailsComponent;
  @ViewChild(CuRenewalDetailsComponent) cuRenewalDetailsChildComponent: CuRenewalDetailsComponent;
  @ViewChild(CuUndertakingDetailsComponent) cuUndertakingChildComponent: CuUndertakingDetailsComponent;
  @ViewChild(CuReductionIncreaseComponent) cuReductionIncreaseComponent: CuReductionIncreaseComponent;
  @ViewChild(ReductionIncreaseComponent) reductionIncreaseComponent: ReductionIncreaseComponent;
  @ViewChild(IuPaymentDetailsComponent) iuPaymentDetailsComponent: IuPaymentDetailsComponent;
  @ViewChild(CuPaymentDetailsComponent) cuPaymentDetailsComponent: CuPaymentDetailsComponent;
  @ViewChild(IUCommonReturnCommentsComponent) iuCommonReturnCommentsComponent: IUCommonReturnCommentsComponent;

  constructor(
    protected fb: UntypedFormBuilder, protected router: Router, protected iuService: IUService,
    protected confirmationService: ConfirmationService, protected activatedRoute: ActivatedRoute,
    public iuCommonDataService: IUCommonDataService, public dialogService: DialogService,
    public validationService: ValidationService, public translate: TranslateService,
    protected responseService: ResponseService, protected tnxIdGeneratorService: TnxIdGeneratorService,
    protected auditService: AuditService, public commonService: CommonService,
    protected reauthService: ReauthService, protected generatePdfService: GeneratePdfService,
    public commonDataService: CommonDataService, public datePipe: DatePipe) { }

  ngOnInit() {
    this.dateFormat = this.commonService.getDateFormat();
    const maxTextLength = 210;
    this.contextPath = window[`CONTEXT_PATH`];
    this.actionCode = window[`ACTION_CODE`];
    let viewRefId;
    let viewTnxId;
    let masterOrTnx;
    this.activatedRoute.params.subscribe(paramsId => {
      this.viewMode = paramsId.viewMode;
      viewRefId = paramsId.refId;
      viewTnxId = paramsId.tnxId;
      this.option = paramsId.option;
      masterOrTnx = paramsId.masterOrTnx;
      this.mode = paramsId.mode;
    });
    this.amendReleaseSection = this.fb.group({
      refId: '',
      issDate: '',
      bgExpDate: '',
      boRefId: '',
      bgAmt: '',
      bgCurCode: '',
      bgPrincipalActNo: '',
      bgFeeActNo: '',
      bgIssDateTypeCode: '',
      bgAmdDate: '',
      bgAmdNo: '',
      tnxAmt: '',
      tnxCurCode: '',
      bgAmdDetails: '',
      bgFreeFormatText: ['', [validateSwiftCharSet(Constants.Z_CHAR), Validators.maxLength(maxTextLength)]],
      bgOsAmt: [{ value: '' }, [Validators.required]],
      bgReleaseAmt: [{ value: '' }, [Validators.pattern(Constants.REGEX_NUMBER), Validators.required]],
      bgReleaseFlag: '',
      reasonReductionRelease: [{ value: '' }, [Validators.required]],
      returnComments: '',
      curDate: '',
      tnxId: ''


    });
    this.commonService.setTnxType('03');
    if (this.viewMode) {
      if (masterOrTnx === 'tnx') {
        this.commonService.getTnxDetails(viewRefId, viewTnxId, Constants.PRODUCT_CODE_IU, '').subscribe(data => {
          this.bgRecord = data.transactionDetails as string[];
          this.jsonContent = data.transactionDetails as string[];
          this.iuCommonDataService.setDisplayMode('view');
          if (this.jsonContent.purpose != null && this.jsonContent.purpose !== '' && this.jsonContent.purpose !== '01') {
            this.iuCommonDataService.setLUStatus(true);
            this.luStatus = true;
          }
        });
        this.commonService.getBankDetails().subscribe(data => {
          this.bankDetails = data as string[];
        });
        this.showCommentSection = true;
      }
    } else if (this.mode === 'DRAFT') {
      this.tnxId = viewTnxId;
      this.commonService.getTnxDetails(viewRefId, viewTnxId, Constants.PRODUCT_CODE_IU, this.actionCode).subscribe(data => {
        this.bgRecord = data.transactionDetails as string[];
        this.jsonContent = data.transactionDetails as string[];
        this.commonDataService.setEntity(this.bgRecord[`entity`]);
        this.reasonReductionReleaseSelected = new DropdownObject();
        if (this.bgRecord[`reasonReductionRelease`] !== '') {
          this.reasonReductionReleaseSelected.value = this.bgRecord[`reasonReductionRelease`];
          this.translate.get(this.iuCommonDataService.getReasonReductionRelease(this.reasonReductionReleaseSelected.value))
            .subscribe(text => {
              this.reasonReductionReleaseSelected.name = text;
            });
        }
        const amdNumber = this.bgRecord[`bgAmdNo`];
        this.amdNum = this.iuCommonDataService.getBgAmdNo(amdNumber);
        this.iuCommonDataService.setRefId(viewRefId);
        this.iuCommonDataService.setTnxId(viewTnxId);
        this.iuCommonDataService.setMode(Constants.MODE_DRAFT);

        this.amendReleaseSection.patchValue({
          subTnxTypeCode: '05',
          bgReleaseFlag: this.iuCommonDataService.getCheckboxBooleanValues(this.bgRecord[`bgReleaseFlag`]),
          bgReleaseAmt: this.commonService.transformAmt(this.bgRecord[`bgReleaseAmt`], this.bgRecord[`bgCurCode`]),
          bgOsAmt: this.commonService.transformAmt(this.bgRecord[`bgLiabAmt`], this.bgRecord[`bgCurCode`]),
          reasonReductionRelease: this.reasonReductionReleaseSelected,
          bgAmdDetails: this.bgRecord[`bgAmdDetails`],
          bgPrincipalActNo: this.bgRecord[`bgPrincipalActNo`],
          bgFeeActNo: this.bgRecord[`bgFeeActNo`],
          bgFreeFormatText: this.bgRecord[`bgFreeFormatText`],
          bgExpDate: this.bgRecord[`bgExpDate`],
          tnxCurCcode: this.bgRecord[`bgCurCode`],
          curDate: this.curDate,
          bgAmdNo: this.amdNum
        });
      });

    } else if (this.mode === Constants.MODE_UNSIGNED) {
      this.viewMode = true;
      this.commonService.getTnxDetails(viewRefId, viewTnxId, Constants.PRODUCT_CODE_IU, this.actionCode).subscribe(data => {
        this.bgRecord = data.transactionDetails as string[];
        this.jsonContent = data.transactionDetails as string[];
        const amdNumber = this.bgRecord[`bgAmdNo`];
        this.amdNum = this.iuCommonDataService.getBgAmdNo(amdNumber);
        this.amendReleaseSection.patchValue({ bgAmdNo: this.amdNum });
        this.iuCommonDataService.setDisplayMode(Constants.UNSIGNED_AMEND);
      });
    } else {
      this.commonService.getMasterDetails(viewRefId, Constants.PRODUCT_CODE_IU, this.actionCode).subscribe(data => {
        this.bgRecord = data.masterDetails as string[];
        this.jsonContent = data.masterDetails as string[];
        this.commonDataService.setEntity(this.bgRecord[`entity`]);
        this.amendReleaseSection.patchValue({
          tnxCurCode: this.bgRecord[`bgCurCode`],
          bgOsAmt: this.commonService.transformAmt(this.bgRecord[`bgLiabAmt`], this.bgRecord[`bgCurCode`]),
          bgReleaseAmt: this.commonService.transformAmt(this.bgRecord[`bgLiabAmt`], this.bgRecord[`bgCurCode`]),
          bgExpDate: this.bgRecord[`bgExpDate`],
          curDate: this.curDate,
          bgAmdNo: this.amdNum
        });
      });

      this.tnxIdGeneratorService.getTransactionId().subscribe(data => {
        this.tnxId = data.tnxId as string;
        this.amendReleaseSection.patchValue({ tnxId: this.tnxId });
        this.iuCommonDataService.setTnxId(this.tnxId);
      });

      this.iuService.getAmendmentNumber(viewRefId).subscribe(data => {
        const amdNo = data.amdNo as string;
        this.amdNum = amdNo;
        this.amendReleaseSection.patchValue({ bgAmdNo: this.amdNum });
      });

      this.iuCommonDataService.setRefId(viewRefId);
    }
    this.translate.get('TABLE_PHRASES_LIST').subscribe((res: string) => {
      this.modalDialogTitle =  res;
    });
    this.initFieldValues();
    this.yearRange = this.commonService.getYearRange();
  }
  initFieldValues() {
    this.ReductionReleaseReasonsObj = [
      { name: 'Underlying Business Finished', value: 'BUFI' },
      { name: 'Warranty Obligation Period Expired', value: 'WOEX' },
      { name: 'Non Acceptance of a Tender', value: 'NOAC' },
      { name: 'Reduction Clause Fulfilled', value: 'REFU' },
      { name: 'Other', value: 'OTHR' }
    ];

    const format = this.commonService.getUserLanguage() === Constants.LANGUAGE_US ? Constants.DATE_FORMAT : Constants.DATE_FORMAT_DMY;
    const currentDate = this.datePipe.transform(new Date(), format);
    this.amdDateSelected = currentDate;
    this.curDate = currentDate;

    const releaseFlag = true;
    this.bgReleaseFlagSelected = releaseFlag;

    if (this.mode !== 'DRAFT') {
      this.amendReleaseSection.patchValue({
        bgReleaseFlag: this.bgReleaseFlagSelected
      });
    }

    this.amendReleaseSection.get('bgReleaseAmt').disable();
    this.amendReleaseSection.get('bgOsAmt').disable();

    this.amendReleaseSection.patchValue({
      bgAmdDate: this.amdDateSelected
    });
  }

  onChangeAmendReleaseFull(event) {
    if (event) {
      this.amendReleaseSection.get('bgReleaseAmt').disable();
      this.amendReleaseSection.get('bgReleaseAmt').setValue(this.bgRecord[`bgLiabAmt`]);
    } else {
      this.amendReleaseSection.get('bgReleaseAmt').enable();
    }
  }
  onchangeReasonForReductionRelease(event) {
    const maxLength = 15000;
    this.amendReleaseSection.controls[`bgAmdDetails`].clearValidators();
    if (event.value === 'OTHR') {
      this.isRequired = true;
      this.amendReleaseSection.controls[`bgAmdDetails`].setValidators([Validators.required, validateSwiftCharSet(Constants.Z_CHAR),
      Validators.maxLength(maxLength)]);
    } else {
      this.isRequired = false;
      this.amendReleaseSection.controls[`bgAmdDetails`].setValidators([validateSwiftCharSet(Constants.Z_CHAR),
      Validators.maxLength(maxLength)]);
    }
    this.amendReleaseSection.controls[`bgAmdDetails`].updateValueAndValidity();
    this.amendReleaseSection.updateValueAndValidity();
  }


  // After a form is initialized, we link it to our main form
  addToForm(name: string, form: UntypedFormGroup) {
    this.amendReleaseSection.setControl(name, form);
  }

  handleEvents(operation) {
    this.operation = operation;
    if (operation === Constants.OPERATION_SAVE) {
      this.onSave();
    } else if (operation === Constants.OPERATION_SUBMIT && this.mode === Constants.MODE_UNSIGNED) {
      this.onSubmitWhenUnsigned();
    } else if (operation === Constants.OPERATION_SUBMIT && this.mode !== Constants.MODE_UNSIGNED) {
      this.onSubmitWhenNotUnsigned();
    } else if (operation === Constants.OPERATION_CANCEL) {
      this.onCancel();
    } else if (operation === Constants.OPERATION_RETURN) {
      this.goToReturn();
    } else if (operation === Constants.OPERATION_PREVIEW) {
      this.openPreview();
    } else if (operation === Constants.OPERATION_EXPORT) {
      this.generatePdf();
    } else if (operation === Constants.OPERATION_HELP) {
      this.openHelp();
    }
  }

  onSubmitWhenUnsigned() {
    if (this.commonService.getReauthEnabled()) {
      this.enableReauthPopup = this.commonService.getReauthEnabled();
      this.transformForUnsignedMode();
      this.showReauthPopup(Constants.OPERATION_SUBMIT);
    } else {
      this.transformForUnsignedMode();
      this.onSubmitRetrieveUnsigned();
    }
  }

  onSubmitWhenNotUnsigned() {
    this.validateForm();
    if (this.amendReleaseSection.valid && this.commonService.getReauthEnabled()) {
      this.transformToIssuedUndertaking();
      this.enableReauthPopup = this.commonService.getReauthEnabled();
      this.showReauthPopup(Constants.OPERATION_SUBMIT);
    } else if (this.amendReleaseSection.valid) {
      this.transformToIssuedUndertaking();
      this.onSubmit();
    }
  }

  onSave() {
    this.actionsComponent.showProgressBar = true;
    this.translate.get('PROGRESSBAR_MSG_SAVE').subscribe((value: string) => {
      this.actionsComponent.displayMessage = value;
    });
    this.showForm = false;
    this.transformToIssuedUndertaking();
    this.iuService.saveOrSubmitIU(this.contextPath + URLConstants.IU_SAVE,
      this.issuedundertaking).subscribe(
        data => {
          this.responseMessage = data.message;
          this.responseService.setResponseMessage(data.message);
          this.responseService.setRefId(data.refId);
          this.responseService.setTnxId(data.tnxId);
          this.responseService.setTnxType(data.tnxTypeCode);
          this.responseService.setOption(data.option);
          this.responseService.setSubTnxType(data.subTnxTypeCode);
          this.router.navigate(['submitOrSave']);
        }
      );
  }

  transformToIssuedUndertaking() {
    this.rawValuesForm = new UntypedFormGroup({});
    Object.assign(this.rawValuesForm, this.amendReleaseSection.getRawValue());
    this.issuedundertaking = new IssuedUndertakingRequest();
    this.issuedundertaking.refId = this.bgRecord[`refId`];
    this.issuedundertaking.issDate = this.rawValuesForm[`issDate`];
    this.issuedundertaking.bgExpDate = this.bgRecord[`bgExpDate`];
    this.issuedundertaking.boRefId = this.bgRecord[`boRefId`];
    this.issuedundertaking.bgFreeFormatText = this.rawValuesForm[`bgFreeFormatText`];
    this.issuedundertaking.tnxTypeCode = '03';
    this.issuedundertaking.subTnxTypeCode = '05';
    this.issuedundertaking.bgFeeActNo = this.rawValuesForm[`bgFeeActNo`];
    this.issuedundertaking.bgPrincipalActNo = this.rawValuesForm[`bgPrincipalActNo`];
    this.issuedundertaking.tnxAmt = this.rawValuesForm[`bgReleaseAmt`].replaceAll(',', '');
    this.issuedundertaking.tnxCurCode = this.bgRecord[`bgCurCode`];
    this.issuedundertaking.bgReleaseAmt = this.rawValuesForm[`bgReleaseAmt`].replaceAll(',', '');
    this.issuedundertaking.bgAmdDate = this.rawValuesForm[`bgAmdDate`];
    this.issuedundertaking.bgAmdDetails = this.rawValuesForm[`bgAmdDetails`];
    this.issuedundertaking.bgAmdNo = this.rawValuesForm[`bgAmdNo`];
    this.issuedundertaking.bgReleaseFlag =
      this.iuCommonDataService.getCheckboxFlagValues(this.amendReleaseSection.controls[`bgReleaseFlag`].value);
    this.issuedundertaking.reasonReductionRelease = this.amendReleaseSection.controls[`reasonReductionRelease`].value.value;
    this.issuedundertaking.tnxId = this.tnxId;
    this.issuedundertaking.attids = this.iuCommonDataService.getAttIds();
    this.issuedundertaking.applicantReference = this.bgRecord[`applicantReference`];
    this.issuedundertaking.merge(this.amendReleaseSection.controls[Constants.SECTION_FILE_UPLOAD].value);
    if (this.commonService.getTnxToDoListId() != null && this.commonService.getTnxToDoListId() !== '' ) {
      this.issuedundertaking.todoListId = this.commonService.getTnxToDoListId();
    }
  }

  setResponse(data) {
    this.responseService.setResponseMessage(data.message);
    this.responseService.setRefId(data.refId);
    this.responseService.setTnxId(data.tnxId);
    this.responseService.setOption(data.option);
    this.responseService.setTnxType(data.tnxTypeCode);
    this.responseService.setSubTnxType(data.subTnxTypeCode);
  }

  onSubmit() {
    this.actionsComponent.showProgressBar = true;
    this.translate.get('PROGRESSBAR_MSG_SUBMIT').subscribe((value: string) => {
      this.actionsComponent.displayMessage = value;
    });
    this.showForm = false;
    this.iuService.saveOrSubmitIU(this.contextPath + URLConstants.IU_SUBMIT,
      this.issuedundertaking).subscribe(
        data => {
          this.setResponseAndSubmit(data);
        }
      );
  }

  transformForUnsignedMode() {
    this.rawValuesForm = new UntypedFormGroup({});
    Object.assign(this.rawValuesForm, this.amendReleaseSection.getRawValue());
    this.issuedundertaking = new IssuedUndertakingRequest();
    this.issuedundertaking.tnxTypeCode = Constants.TYPE_AMEND;
    this.issuedundertaking.refId = this.iuCommonDataService.getRefId();
    this.issuedundertaking.tnxId = this.iuCommonDataService.getTnxId();
    if ((this.operation === Constants.OPERATION_RETURN) || (this.bgRecord[`returnComments`] &&
        this.bgRecord[`returnComments`] !== null && this.bgRecord[`returnComments`] !== '')) {
      const returnComments = this.rawValuesForm[`commentsForm`].returnComments;
      this.issuedundertaking.returnComments = returnComments;
    }
    this.issuedundertaking.applicantReference = this.bgRecord[`applicantReference`];
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
        this.setResponseAndSubmit(data);
      }
    );

  }

  openPreview() {
    this.openPopup();
  }

  goToReturn() {
    this.validateFormOnReturn();
    if (this.returnFormValid && this.commonService.getReauthEnabled()) {
      this.enableReauthPopup = this.commonService.getReauthEnabled();
      this.transformForUnsignedMode();
      this.showReauthPopup(Constants.REAUTH_OPERATION_RETURN);
    } else if (this.returnFormValid) {
      this.transformForUnsignedMode();
      this.onReturn();
    }
  }

  onReturn() {
    this.actionsComponent.showProgressBar = true;
    this.translate.get('PROGRESSBAR_MSG_RETURN').subscribe((value: string) => {
      this.actionsComponent.displayMessage = value;
    });
    this.iuService.returnIssuedUndertaking(this.issuedundertaking)
      .subscribe(
        data => {
          this.setResponseAndSubmit(data);
        }
      );
  }

  setResponseAndSubmit(data) {
    this.responseMessage = data.message;
    const response = data.response;
    this.setResponse(data);
    if (this.enableReauthPopup && (response === Constants.RESPONSE_REAUTH_FAILURE)) {
      this.actionsComponent.showProgressBar = false;
      this.reauthDialogComponent.onReauthSubmitCompletion(response);
    } else {
      this.router.navigate(['submitOrSave']);
    }
  }

  validateAllFields(mainForm: UntypedFormGroup) {
    Object.keys(mainForm.controls).forEach(field => {
      const control = mainForm.get(field);
      if (control instanceof UntypedFormControl) {
        if (!control.disabled) {
          control.markAsTouched({ onlySelf: true });
        }
      } else if (control instanceof UntypedFormGroup) {
        this.validateAllFields(control);
      }
    });
  }

  public openAccountDialog(fieldId): void {
    const ref = this.dialogService.open(AccountDialogComponent, {
      header: 'List of Accounts',
      width: '1000px',
      height: '400px',
      contentStyle: { overflow: 'auto' }
    });
    ref.onClose.subscribe((account: Account) => {
      if (account) {
        this.amendReleaseSection.get(fieldId).setValue(account.ACCOUNTNO);
      }
    });
  }

  clearPrincipalAcc(event) {
    this.amendReleaseSection.get('bgPrincipalActNo').setValue('');
  }

  clearFeeAcc(event) {
    this.amendReleaseSection.get('bgFeeActNo').setValue('');
  }

  showDailog(refId): void {
    this.openPopup();
  }

  openPopup() {
    const host = window.location.origin;
    let url = host + this.commonService.getBaseServletUrl();
    url += Constants.PREVIEW_POPUP_SCREEN;
    const myWindow = window.open(`${url}/?option=FULL&referenceid=${this.iuCommonDataService.getRefId()}&productcode=BG`,
      Constants.TRANSACTION_POPUP, 'width=800,height=500,resizable=yes,scrollbars=yes');
    myWindow.focus();
  }

  setValidatorAmendDate(dateField) {
    this.amendReleaseSection.controls[dateField].clearValidators();
    this.amendReleaseSection.controls[dateField].setValidators([validateDates(
      this.amendReleaseSection.get(dateField), this.amendReleaseSection.get('curDate'),
      'amendment request date', 'current date', 'lesserThan'),
    validateDates(this.amendReleaseSection.get(dateField),
      this.amendReleaseSection.get('bgExpDate'), 'amendment request date', 'expiry date', 'greaterThan')]);

    this.amendReleaseSection.controls[dateField].updateValueAndValidity();
    this.amendReleaseSection.updateValueAndValidity();
  }

  setValidatorReleaseAmount() {
    this.currencyDecimalMap = this.commonService.getCurrencyDecimalMap();
    this.amendReleaseSection.controls[`bgReleaseAmt`].clearValidators();
    this.amendReleaseSection.get('bgReleaseAmt').setValidators([validateAmountField(this.bgRecord[`bgCurCode`],
      this.currencyDecimalMap.get(this.bgRecord[`bgCurCode`])),
    validateReleaseAmount(this.amendReleaseSection.get('bgReleaseAmt'), this.amendReleaseSection.get('bgOsAmt'))]);
    this.amendReleaseSection.get('bgReleaseAmt').setValue(this.commonService.transformAmt(
      this.amendReleaseSection.get('bgReleaseAmt').value, this.bgRecord[`bgCurCode`]));
    this.amendReleaseSection.controls[`bgReleaseAmt`].updateValueAndValidity();
    this.amendReleaseSection.updateValueAndValidity();
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
  closeWindow() {
    window.close();
  }


  validateForm() {
    this.validateAllFields(this.amendReleaseSection);
    if (this.mode === 'DRAFT') {
      this.setValidatorReleaseAmount();
    }
  }

  showReauthPopup(operation) {
    const entity = this.bgRecord[`entity`];
    const currency = this.bgRecord[`bgCurCode`];
    const amount = this.bgRecord[`bgAmt`];
    const subProdCode = this.bgRecord[`subProductCode`];
    const bank = this.bgRecord[`issuingBank`][`abbvName`];
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
        if (reauthType === Constants.REAUTH_TYPE_PASSWORD) {
          this.reauthDialogComponent.enableReauthPopup = true;
          // setting reauthPassword to '' as it has to get cleared when user clicks on submit after reauthentication failure
          this.reauthDialogComponent.reauthForm.get('reauthPassword').setValue('');
        } else if (reauthType === Constants.REAUTH_TYPE_ERROR) {
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
    this.issuedundertaking.clientSideEncryption = this.amendReleaseSection.controls.reauthForm.get('clientSideEncryption').value;
    this.issuedundertaking.reauthPassword = this.amendReleaseSection.controls.reauthForm.get('reauthPassword').value;
    this.issuedundertaking.reauthPerform = this.amendReleaseSection.controls.reauthForm.get('reauthPerform').value;

    if (this.operation === Constants.OPERATION_SUBMIT && this.mode !== Constants.MODE_UNSIGNED) {
      this.onSubmit();
    } else if (this.operation === Constants.OPERATION_SUBMIT && this.mode === Constants.MODE_UNSIGNED) {
      this.onSubmitRetrieveUnsigned();
    } else if (this.operation === Constants.OPERATION_RETURN) {
      this.onReturn();
    }
  }

  validateFormOnReturn(): string | undefined {
    const comments = this.amendReleaseSection.controls.commentsForm.get('returnComments');
    comments.setValidators([Validators.required, validateSwiftCharSet(Constants.Z_CHAR)]);
    comments.updateValueAndValidity();
    this.returnFormValid = true;
    if (!comments.valid) {
      comments.markAsTouched();
      this.returnFormValid = false;
      return this.validationService.validateField(comments);
    }
  }

  fetchBankDetails() {
    if (this.jsonContent && this.jsonContent !== null) {
      let bankAbbvName = '';
      if (this.jsonContent.productCode === 'BG' && this.jsonContent.recipientBank && this.jsonContent.recipientBank.abbvName) {
        bankAbbvName = this.jsonContent.recipientBank.abbvName;
      } else if (this.jsonContent.productCode === 'BR' && this.jsonContent.advisingBank && this.jsonContent.advisingBank.abbvName) {
        bankAbbvName = this.jsonContent.advisingBank.abbvName;
      }
      this.commonService.fetchBankDetails(bankAbbvName).subscribe(data => {
              this.bankDetails = data as string[];
      });
    }
  }

  generatePdf() {
    this.fetchBankDetails();
    this.generatePdfService.generateFile(Constants.PRODUCT_CODE_IU, this.bankDetails);
    if (this.mode === 'UNSIGNED') {
      this.generatePdfService.setSectionDetails('HEADER_GENERAL_DETAILS', true, false, 'commonGeneralDetails');
    } else {
      if (this.tradeEventDetailsComponent) {
        this.tradeEventDetailsComponent.generatePdf(this.generatePdfService);
      }
    }
    this.generatePdfService.setSectionDetails('HEADER_AMEND_AMOUNT_DETAILS', true, false, 'amountDetails');
    this.generatePdfService.setNarrativeSectionDetails('HEADER_NARRATIVE_DETAILS', true, false, false, this.bgRecord[`bgAmdDetails`]);
    this.generatePdfService.setSectionDetails('HEADER_INSTRUCTIONS', true, false, 'instructionDetails');
    // Attachments table
    if (this.mode === 'UNSIGNED' && this.bgRecord[`attachments`] && this.bgRecord[`attachments`] !== '') {
      this.generatePdfService.setSectionHeader('ATTACHMENT_LIST_HEADER', true);
      const headers = [];
      headers.push(this.commonService.getTranslation('KEY_FILE_TITLE'));
      headers.push(this.commonService.getTranslation('FILE_NAME'));
      const data = [];
      for (const attachment of this.bgRecord[`attachments`][`attachment`]) {
        const row = [];
        row.push(attachment.title);
        row.push(attachment.fileName);
        data.push(row);
      }
      this.generatePdfService.createTable(headers, data);
    }
    if (this.mode !== 'UNSIGNED' && (this.option !== 'SUMMARY' && this.option !== 'FULLORSUMMARY')) {
      this.generatePdfFullDetails();
    }
    if (this.iuCommonDataService.getmasterorTnx() === 'master') {
      this.generatePdfService.saveFile(this.jsonContent.refId, '');
    } else {
      this.generatePdfService.saveFile(this.jsonContent.refId, this.jsonContent.tnxId);
    }
  }

  hasFeeAccountValue(): boolean {
    if (this.amendReleaseSection.get(`bgFeeActNo`) &&
        this.amendReleaseSection.get(`bgFeeActNo`).value !== null &&
        this.amendReleaseSection.get(`bgFeeActNo`).value !== '') {
      return true;
    } else {
      return false;
    }
  }

  hasPrincipalAccountValue(): boolean {
    if (this.amendReleaseSection.get(`bgPrincipalActNo`) &&
        this.amendReleaseSection.get(`bgPrincipalActNo`).value !== null &&
        this.amendReleaseSection.get(`bgPrincipalActNo`).value !== '') {
      return true;
    } else {
      return false;
    }
  }

  openHelp() {
    const host = window.location.origin;
    let url = host + this.commonService.getBaseServletUrl();
    const userLanguage = this.commonService.getUserLanguage();
    const accessKey = Constants.HELP_IU_AMEND;
    url += URLConstants.ONLINE_HELP;
    url += `/?helplanguage=${userLanguage}`;
    url += `&accesskey=${accessKey}`;
    const myWindow = window.open(url, Constants.TRANSACTION_POPUP, 'width=800,height=500,resizable=yes,scrollbars=yes');
    myWindow.focus();
  }

  generatePdfFullDetails() {
    if (this.iuGeneralDetailsComponent) {
      this.iuGeneralDetailsComponent.generatePdf(this.generatePdfService);
    }
    if (this.iuCommonApplicantDetailsComponent) {
      this.iuCommonApplicantDetailsComponent.generatePdf(this.generatePdfService);
    }
    if (this.iuCommonAmountDetailsComponent) {
      this.iuCommonAmountDetailsComponent.generatePdf(this.generatePdfService);
    }
    if (this.renewalDetailsComponent) {
      this.renewalDetailsComponent.generatePdf(this.generatePdfService);
    }
    if (this.reductionIncreaseComponent) {
      this.reductionIncreaseComponent.generatePdf(this.generatePdfService);
    }
    if (this.iuPaymentDetailsComponent) {
      this.iuPaymentDetailsComponent.generatePdf(this.generatePdfService);
    }
    if (this.contractDetailsComponent) {
      this.contractDetailsComponent.generatePdf(this.generatePdfService);
    }
    if (this.bankDetailsComponent) {
      this.bankDetailsComponent.generatePdf(this.generatePdfService);
    }
    if (this.bankInstructionsComponent) {
      this.bankInstructionsComponent.generatePdf(this.generatePdfService);
    }
    if (this.undertakingDetailsComponent) {
      this.undertakingDetailsComponent.generatePdf(this.generatePdfService);
    }
    if (this.iuCommonReturnCommentsComponent && this.jsonContent.returnComments && this.jsonContent.returnComments !== '' &&
    this.jsonContent.returnComments !== null) {
    this.iuCommonReturnCommentsComponent.generatePdf(this.generatePdfService);
    }
    if (this.iuCommonDataService.displayLUSection()) {
      if (this.luGeneraldetailsChildComponent) {
        this.luGeneraldetailsChildComponent.generatePdf(this.generatePdfService);
      }
      if (this.cuBeneficaryDetailsChildComponent) {
        this.cuBeneficaryDetailsChildComponent.generatePdf(this.generatePdfService);
      }
      if (this.luAmountDetailsChildComponent) {
        this.luAmountDetailsChildComponent.generatePdf(this.generatePdfService);
      }
      if (this.cuRenewalDetailsChildComponent) {
        this.cuRenewalDetailsChildComponent.generatePdf(this.generatePdfService);
      }
      if (this.cuReductionIncreaseComponent) {
        this.cuReductionIncreaseComponent.generatePdf(this.generatePdfService);
      }
      if (this.cuPaymentDetailsComponent) {
        this.cuPaymentDetailsComponent.generatePdf(this.generatePdfService);
      }
      if (this.cuUndertakingChildComponent) {
        this.cuUndertakingChildComponent.generatePdf(this.generatePdfService);
      }
    }
  }

  openPhraseDialog(formControlName: string) {
    const applicantEntityName = this.bgRecord.entity != null ? this.bgRecord.entity : this.bgRecord.applicantName;
    const ref = this.dialogService.open(PhraseDialogComponent, {
      data: {
        product: Constants.PRODUCT_CODE_IU,
        categoryName: formControlName,
        applicantEntityName
      },
      header: this.modalDialogTitle,
      width: '65vw',
      height: '80vh',
      contentStyle: { overflow: 'auto', height: '80vh' }
    });
    ref.onClose.subscribe((text: string) => {
      if (text) {
        if (text.includes('\\n')) {
          text = text.split('\\n').join('');
        }
        let finalText = '';
        if (this.amendReleaseSection.get(formControlName).value != null &&
            this.amendReleaseSection.get(formControlName).value !== '') {
            finalText = this.amendReleaseSection.get(formControlName).value.concat('\n');
        } else {
          finalText = this.amendReleaseSection.get(formControlName).value;
        }
        finalText = finalText.concat(text);
        this.amendReleaseSection.get(formControlName).setValue(finalText);
      }
    });
  }
}
