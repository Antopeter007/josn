import { ActionsComponent } from '../../../common/components/actions/actions.component';
import { Constants } from '../../../common/constants';
import { Component, OnInit, EventEmitter, Output, ViewChild, ChangeDetectorRef, ElementRef } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng';
import { ValidationService } from '../../../common/validators/validation.service';
import { AccountDialogComponent } from '../../../common/components/account-dialog/account-dialog.component';
import { ResponseService } from '../../../common/services/response.service';
import { validateAmountField, validateSettlementAmount, validateSettlementDocumentAmount, validateSwiftCharSet } from '../../../common/validators/common-validator';
import { AuditService } from '../../../common/services/audit.service';
import { CommonService } from '../../../common/services/common.service';
import { TnxIdGeneratorService } from '../../../common/services/tnxIdGenerator.service';
import { ReauthService } from '../../../common/services/reauth.service';
import { ReauthDialogComponent } from '../../../common/components/reauth-dialog/reauth-dialog.component';
import { IUCommonDataService } from '../common/service/iuCommonData.service';
import { IUService } from '../common/service/iu.service';
import { DropdownObject } from '../common/model/DropdownObject.model';
import { IssuedUndertakingRequest } from '../common/model/IssuedUndertakingRequest';
import { GeneratePdfService } from '../../../common/services/generate-pdf.service';
import { IUGeneralDetailsComponent } from '../initiation/components/iu-general-details/iu-general-details.component';
import { IUCommonApplicantDetailsComponent } from '../common/components/applicant-details-form/applicant-details-form.component';
import { RenewalDetailsComponent } from '../initiation/components/renewal-details/renewal-details.component';
import { BankDetailsComponent } from '../initiation/components/bank-details/bank-details.component';
import { ContractDetailsComponent } from '../initiation/components/contract-details/contract-details.component';
import { BankInstructionsComponent } from '../initiation/components/bank-instructions/bank-instructions.component';
import { UndertakingDetailsComponent } from '../initiation/components/undertaking-details/undertaking-details.component';
import { IUCommonAmountDetailsComponent } from '../common/components/amount-details/amount-details.component';
import { IUCommonReturnCommentsComponent } from '../common/components/return-comments/return-comments.component';
import { TradeEventDetailsComponent } from '../../common/components/event-details/event-details.component';
import { CuRenewalDetailsComponent } from '../initiation/components/cu-renewal-details/cu-renewal-details.component';
import { CuGeneralDetailsComponent } from '../initiation/components/cu-general-details/cu-general-details.component';
import { CuAmountDetailsComponent } from '../initiation/components/cu-amount-details/cu-amount-details.component';
import { CuBeneficiaryDetailsComponent } from '../initiation/components/cu-beneficiary-details/cu-beneficiary-details.component';
import { CuUndertakingDetailsComponent } from '../initiation/components/cu-undertaking-details/cu-undertaking-details.component';
import { CommonDataService } from '../../../common/services/common-data.service';
import { TranslateService } from '@ngx-translate/core';
import { URLConstants } from './../../../common//urlConstants';
import $ from 'jquery';
import { CuReductionIncreaseComponent } from '../initiation/components/cu-reduction-increase/cu-reduction-increase.component';
import { ReductionIncreaseComponent } from '../initiation/components/reduction-increase/reduction-increase.component';
import { IuPaymentDetailsComponent } from '../initiation/components/iu-payment-details/iu-payment-details.component';
import { CuPaymentDetailsComponent } from '../initiation/components/cu-payment-details/cu-payment-details.component';

interface Account {
  ACCOUNTNO: string;
}
const jqueryConst = $;

@Component({
  selector: 'fcc-iu-message-to-bank',
  templateUrl: './iu-message-to-bank.component.html',
  styleUrls: ['./iu-message-to-bank.component.scss']
})
export class IUMessageToBankComponent implements OnInit {

  public bgRecord;
  public bankDetails: string[] = [];
  @Output() formReady = new EventEmitter<UntypedFormGroup>();
  messageToBankForm: UntypedFormGroup;
  rawValuesForm: UntypedFormGroup;
  public jsonContent;
  public previewOption;
  issuedundertaking: IssuedUndertakingRequest;
  contextPath: string;
  actionCode: string;
  responseMessage: object;
  public showForm = true;
  public viewMode = false;
  public prodStatCode;
  public subTnxTypeObj: any[] = [];
  public mode;
  public tnxType;
  public tnxId;
  public refId;
  public parentTnxId;
  public option;
  public subTnxType;
  public tnxAmtReadOnly = false;
  public subTnxTypeCodes: DropdownObject[];
  public operation: string;
  public displaySubTnx = true;
  public enableReauthPopup = false;
  private returnFormValid: boolean;
  public isMessageToBank = false;
  public luStatus = false;

  @ViewChild(ReauthDialogComponent) reauthDialogComponent: ReauthDialogComponent;
  @ViewChild(IUGeneralDetailsComponent) iuGeneralDetailsComponent: IUGeneralDetailsComponent;
  @ViewChild(IUCommonApplicantDetailsComponent) iuCommonApplicantDetailsComponent: IUCommonApplicantDetailsComponent;
  @ViewChild(IUCommonAmountDetailsComponent) iuCommonAmountDetailsComponent: IUCommonAmountDetailsComponent;
  @ViewChild(RenewalDetailsComponent) renewalDetailsComponent: RenewalDetailsComponent;
  @ViewChild(BankDetailsComponent) bankDetailsComponent: BankDetailsComponent;
  @ViewChild(ContractDetailsComponent) contractDetailsComponent: ContractDetailsComponent;
  @ViewChild(BankInstructionsComponent) bankInstructionsComponent: BankInstructionsComponent;
  @ViewChild(UndertakingDetailsComponent) undertakingDetailsComponent: UndertakingDetailsComponent;
  @ViewChild(ActionsComponent) actionsComponent: ActionsComponent;
  @ViewChild(IUCommonReturnCommentsComponent) iuCommonReturnCommentsComponent: IUCommonReturnCommentsComponent;
  @ViewChild(TradeEventDetailsComponent) tradeEventDetailsComponent: TradeEventDetailsComponent;
  @ViewChild(CuGeneralDetailsComponent) luGeneraldetailsChildComponent: CuGeneralDetailsComponent;
  @ViewChild(CuBeneficiaryDetailsComponent) cuBeneficaryDetailsChildComponent: CuBeneficiaryDetailsComponent;
  @ViewChild(CuAmountDetailsComponent) luAmountDetailsChildComponent: CuAmountDetailsComponent;
  @ViewChild(CuRenewalDetailsComponent) cuRenewalDetailsChildComponent: CuRenewalDetailsComponent;
  @ViewChild(CuUndertakingDetailsComponent) cuUndertakingChildComponent: CuUndertakingDetailsComponent;
  @ViewChild(CuReductionIncreaseComponent) cuReductionIncreaseComponent: CuReductionIncreaseComponent;
  @ViewChild(ReductionIncreaseComponent) reductionIncreaseComponent: ReductionIncreaseComponent;
  @ViewChild(IuPaymentDetailsComponent) iuPaymentDetailsComponent: IuPaymentDetailsComponent;
  @ViewChild(CuPaymentDetailsComponent) cuPaymentDetailsComponent: CuPaymentDetailsComponent;

  constructor(
    public fb: UntypedFormBuilder, public router: Router, public iuService: IUService, public activatedRoute: ActivatedRoute,
    public iuCommonDataService: IUCommonDataService, public dialogService: DialogService, public validationService: ValidationService,
    public responseService: ResponseService, public commonService: CommonService, public auditService: AuditService,
    public tnxIdGeneratorService: TnxIdGeneratorService, public reauthService: ReauthService, public generatePdfService: GeneratePdfService,
    public commonDataService: CommonDataService, public translate: TranslateService, public confirmationService: ConfirmationService,
    public changeDetectorRef: ChangeDetectorRef, public el: ElementRef) { }

  ngOnInit() {
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
      this.previewOption = paramsId.option;
      masterOrTnx = paramsId.masterOrTnx;
      this.mode = paramsId.mode;
      this.subTnxType = paramsId.subTnxType;
    });
    this.commonService.setTnxType('13');
    if (this.subTnxType === '25') {
      this.option = Constants.OPTION_CLAIM_PROCESSING;
    } else if (this.subTnxType === '68') {
      this.option = Constants.OPTION_CANCEL;
    } else if (this.subTnxType === '24') {
      this.option = Constants.OPTION_EXISTING;
    } else if (this.subTnxType === '08' || this.subTnxType === '09' || this.subTnxType === '62'
      || this.subTnxType === '63' || this.subTnxType === '88' || this.subTnxType === '89'
      || this.subTnxType === '66' || this.subTnxType === '67') {
      this.option = Constants.OPTION_ACTION_REQUIRED;
    }
    this.parentTnxId = viewTnxId;
    this.createForm();
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
      }
    } else if (this.mode === Constants.MODE_UNSIGNED) {
      this.commonService.getTnxDetails(viewRefId, viewTnxId, Constants.PRODUCT_CODE_IU, this.actionCode).subscribe(data => {
        this.bgRecord = data.transactionDetails as string[];
        this.jsonContent = data.transactionDetails as string[];
        this.previewOption = data.option as string[];
        this.viewMode = true;
        this.iuCommonDataService.setDisplayMode('view');
        this.iuCommonDataService.setMode(Constants.MODE_UNSIGNED);
      });
    } else if (this.mode === 'DRAFT') {
      this.tnxId = viewTnxId;
      this.iuCommonDataService.setMode(Constants.MODE_DRAFT);
      this.iuCommonDataService.setViewComments(true);
      this.iuCommonDataService.setRefId(viewRefId);
      this.iuCommonDataService.setTnxId(viewTnxId);
      this.commonService.getTnxDetails(viewRefId, viewTnxId, Constants.PRODUCT_CODE_IU, this.actionCode).subscribe(data => {
        this.bgRecord = data.transactionDetails as string[];
        this.jsonContent = data.transactionDetails as string[];
        this.previewOption = data.option as string[];
        this.commonDataService.setEntity(this.bgRecord[`entity`]);
        this.prodStatCode = this.bgRecord[`prodStatCode`];
        this.subTnxType = this.bgRecord[`subTnxTypeCode`];
        if (this.subTnxType !== null && this.subTnxType !== '') {
          if (this.subTnxType === '24' && (this.bgRecord[`actionReqCode`] == null || this.bgRecord[`actionReqCode`] === '')) {
            this.option = Constants.OPTION_EXISTING;
            this.subTnxTypeCodes = [
              { name: 'Correspondence', value: '24' }
            ];
          } else if (this.subTnxType === '25') {
            this.option = Constants.OPTION_CLAIM_PROCESSING;
            this.subTnxTypeCodes = [
              { name: 'Request For Settlement', value: '25' }
            ];
          } else if (this.subTnxType === '68' && (this.bgRecord[`actionReqCode`] == null && this.bgRecord[`actionReqCode`] === '')) {
            this.option = Constants.OPTION_CANCEL;
          } else {
            this.option = Constants.OPTION_ACTION_REQUIRED;
          }
          this.iuCommonDataService.setOption(this.option);
        } else {
          this.option = Constants.OPTION_ACTION_REQUIRED;
          this.iuCommonDataService.setOption(this.option);
        }
        this.messageToBankForm.patchValue({
          tnxAmt: this.commonService.transformAmt(this.bgRecord[`tnxAmt`], this.bgRecord[`tnxCurCode`]),
          tnxCurCode: this.bgRecord[`tnxCurCode`],
          claimAmt: this.commonService.transformAmt(this.bgRecord[`claimAmt`], this.bgRecord[`claimCurCode`]),
          bgAmt: this.bgRecord[`bgAmt`]
        });
        if (this.option === Constants.OPTION_CLAIM_PROCESSING || this.option === Constants.OPTION_ACTION_REQUIRED) {
          this.messageToBankForm.patchValue({
            tnxCurCode: (this.bgRecord[`purpose`] === '01' ? this.bgRecord[`tnxCurCode`] : this.bgRecord[`cuCurCode`]),
            tnxAmt: this.commonService.transformAmt((this.bgRecord[`purpose`] === '01'
                                          ? this.bgRecord[`tnxAmt`] : this.bgRecord[`cuTnxAmt`]),
                    this.messageToBankForm.controls[`tnxCurCode`].value),
            claimAmt: this.commonService.transformAmt(this.bgRecord[`claimAmt`], this.bgRecord[`claimCurCode`]),
            bgAmt: this.bgRecord[`purpose`] === '01' ? this.bgRecord[`bgAmt`] : this.bgRecord[`cuAmt`],
            bgPrincipalActNo: this.bgRecord[`bgPrincipalActNo`],
            bgFeeActNo: this.bgRecord[`bgFeeActNo`]
          });
        }
        if (this.option === Constants.OPTION_CLAIM_PROCESSING ||
          (this.option === Constants.OPTION_ACTION_REQUIRED && (this.prodStatCode === '84' || this.prodStatCode === '85' ||
          this.prodStatCode === '86'))) {
          this.tnxAmtReadOnly = !this.commonService.isSettlementAmtEditable();
          if (!this.tnxAmtReadOnly) {
            this.messageToBankForm.get('tnxAmt').setValidators([Validators.required, validateAmountField(this.bgRecord[`tnxCurCode`],
              this.commonService.getCurrencyDecimalMap().get(this.bgRecord[`tnxCurCode`])),
              validateSettlementAmount(this.messageToBankForm.get('tnxAmt'),
              this.messageToBankForm.get('claimAmt'), this.bgRecord[`purpose`] === '01' ? this.bgRecord[`bgAvailableAmt`] :
                    this.bgRecord[`cuAvailableAmt`])]);
          }
          if (this.prodStatCode === '86' && this.bgRecord[`extendedDate`] && this.bgRecord[`extendedDate`] !== null &&
              this.bgRecord[`extendedDate`] !== '') {
            const formattedDate = this.commonService.getDateObject(this.bgRecord[`extendedDate`]);
            this.messageToBankForm.get(`extendedDate`).setValue(formattedDate);
            if (this.bgRecord[`subTnxTypeCode`] === '63') {
              this.messageToBankForm.get(`acceptRejectSubTnxTypeCode`).setValue('63');
            } else {
              this.messageToBankForm.get(`acceptRejectSubTnxTypeCode`).setValue('62');
              this.messageToBankForm.get(`subTnxTypeCode`).setValue(this.bgRecord[`subTnxTypeCode`]);
            }
          }
        }
        if (this.option === Constants.OPTION_ACTION_REQUIRED && this.prodStatCode !== undefined) {
          this.iuService.getMsgToBankSubTnxType().subscribe(tnxDataObj => {
            const subTnxObj = tnxDataObj.dropdownOptions;
            subTnxObj.forEach(element => {
              if (this.bgRecord[`subTnxTypeCode`] === element.value || this.toBeInSubTnx(element.value)) {
                const subTnxTypeCode: any = {};
                subTnxTypeCode.label = element.name;
                subTnxTypeCode.value = element.value;
                this.subTnxTypeObj.push(subTnxTypeCode);
                if (this.bgRecord[`subTnxTypeCode`] === element.value) {
                  this.messageToBankForm.patchValue({
                    subTnxTypeCode: this.bgRecord[`subTnxTypeCode`]
                  });
                }
              }
              if (this.subTnxTypeObj.length === Constants.NUMERIC_ONE) {
                this.messageToBankForm.get(`subTnxTypeCode`).setValue(this.subTnxTypeObj[0].value);
              }
            });
          });
        }
      });
    } else {
      this.iuCommonDataService.setOption(this.option);
      this.tnxIdGeneratorService.getTransactionId().subscribe(data => {
        this.tnxId = data.tnxId as string;
        this.iuCommonDataService.setTnxId(this.tnxId);
      });
      this.iuCommonDataService.setRefId(viewRefId);
      if (this.option === Constants.OPTION_CLAIM_PROCESSING || this.option === Constants.OPTION_ACTION_REQUIRED) {
        this.tnxId = viewTnxId;
        this.refId = viewRefId;
        this.commonService.getTnxDetails(viewRefId, viewTnxId, Constants.PRODUCT_CODE_IU, this.actionCode).subscribe(data => {
          this.bgRecord = data.transactionDetails as string[];
          this.jsonContent = data.transactionDetails as string[];
          this.previewOption = data.option as string[];
          this.commonDataService.setEntity(this.bgRecord[`entity`]);
          this.prodStatCode = this.bgRecord[`prodStatCode`];

          this.messageToBankForm.patchValue({
            tnxCurCode: (this.bgRecord[`purpose`] === '01' ? this.bgRecord[`tnxCurCode`] : this.bgRecord[`cuCurCode`]),
            tnxAmt: this.commonService.transformAmt((this.bgRecord[`purpose`] === '01'
                                          ? this.bgRecord[`tnxAmt`] : this.bgRecord[`cuTnxAmt`]),
                    this.messageToBankForm.controls[`tnxCurCode`].value),
            claimAmt: this.commonService.transformAmt(this.bgRecord[`claimAmt`], this.bgRecord[`claimCurCode`]),
            bgAmt: this.bgRecord[`purpose`] === '01' ? this.bgRecord[`bgAmt`] : this.bgRecord[`cuAmt`]
          });
          if (this.option === Constants.OPTION_CLAIM_PROCESSING ||
            (this.option === Constants.OPTION_ACTION_REQUIRED && this.prodStatCode === '84' ||
            this.prodStatCode === '85' || this.prodStatCode === '86')) {
            this.tnxAmtReadOnly = !this.commonService.isSettlementAmtEditable();
            if (!this.tnxAmtReadOnly) {
              this.messageToBankForm.get('tnxAmt').setValidators([Validators.required,
                validateAmountField(this.messageToBankForm.get('tnxCurCode').value,
                this.commonService.getCurrencyDecimalMap().get(this.messageToBankForm.get('tnxCurCode').value)),
                validateSettlementAmount(this.messageToBankForm.get('tnxAmt'),
                this.messageToBankForm.get('claimAmt'), this.messageToBankForm.get('bgAmt'))]);
            }
            this.messageToBankForm.get(`acceptRejectSubTnxTypeCode`).setValue('62');
            if (this.prodStatCode === '86' && this.bgRecord[`extendedDate`] && this.bgRecord[`extendedDate`] !== null &&
              this.bgRecord[`extendedDate`] !== '') {
                this.messageToBankForm.get(`subTnxTypeCode`).setValue('20');
                this.messageToBankForm.get('tnxAmt').setValidators(null);
                this.messageToBankForm.get('tnxAmt').updateValueAndValidity();
            } else if (this.prodStatCode === '86') {
              this.messageToBankForm.get(`subTnxTypeCode`).setValue('21');
            }
          }
          if (this.option === Constants.OPTION_ACTION_REQUIRED && this.prodStatCode !== undefined) {
            this.iuService.getMsgToBankSubTnxType().subscribe(tnxDataObj => {
              const subTnxObj = tnxDataObj.dropdownOptions;
              subTnxObj.forEach(element => {
                if (this.toBeInSubTnx(element.value)) {
                  const subTnxTypeCode: any = {};
                  subTnxTypeCode.label = element.name;
                  subTnxTypeCode.value = element.value;
                  this.subTnxTypeObj.push(subTnxTypeCode);
                }
                if (this.subTnxTypeObj.length === Constants.NUMERIC_ONE) {
                  this.messageToBankForm.get(`subTnxTypeCode`).setValue(this.subTnxTypeObj[0].value);
                }
              });
              const provisionalWordingStatus = ['78', '79'];
              if (provisionalWordingStatus.includes(this.prodStatCode)) {
                this.messageToBankForm.get(`subTnxTypeCode`).setValue('89');
                this.messageToBankForm.get(`subTnxTypeCode`).updateValueAndValidity();
              }
            });
          }
        });
        if (this.option === Constants.OPTION_CLAIM_PROCESSING) {
          this.subTnxTypeCodes = [
            { name: 'Request For Settlement', value: '25' }
          ];
        }
      } else if (this.option === 'CANCEL') {
        this.commonService.getMasterDetails(viewRefId, Constants.PRODUCT_CODE_IU, this.actionCode).subscribe(data => {
          this.previewOption = data.option as string[];
          this.bgRecord = data.masterDetails as string[];
          this.jsonContent = data.masterDetails as string[];
        });
      } else if (this.option === Constants.OPTION_EXISTING) {
        this.commonService.getMasterDetails(viewRefId, Constants.PRODUCT_CODE_IU, this.actionCode).subscribe(data => {
          this.bgRecord = data.masterDetails as string[];
          this.jsonContent = data.masterDetails as string[];
          this.previewOption = data.option as string[];
          this.iuCommonDataService.setRefId(data.masterDetails[`refId`]);
        });
        this.subTnxTypeCodes = [
          { name: 'Correspondence', value: '24' }
        ];
      }
    }
  }

  createForm() {
    this.messageToBankForm = this.fb.group({
      refId: '',
      issDate: '',
      custRefId: '',
      bgExpDate: '',
      boRefId: '',
      claimPresentDate: '',
      claimReference: '',
      claimAmt: '',
      bgAmt: '',
      claimCurCode: '',
      subTnxTypeCode: '',
      tnxAmt: '',
      tnxCurCode: '',
      bgPrincipalActNo: '',
      bgFeeActNo: '',
      purpose: '',
      subProductCode: '',
      acceptRejectSubTnxTypeCode: '',
      extendedDate: ''
    });
  }

  toBeInSubTnx(value): boolean {
    let flag = false;
    if ((((this.prodStatCode === '98' || this.prodStatCode === '78' || this.prodStatCode === '79') && (value === '88' || value === '89'))
      || ((this.prodStatCode === '15' || this.prodStatCode === '84') && (value === '62' || value === '63'))
      || (this.prodStatCode === '85' && (value === '24' || value === '25'))
      || (this.prodStatCode === '12' && (value === '08' || value === '09'))
      || ((this.prodStatCode === '31' || this.prodStatCode === '14') && (value === '66' || value === '67'))
      || (this.prodStatCode === '26' && value === '66'))
      || (!(this.prodStatCode === '98' || this.prodStatCode === '78' || this.prodStatCode === '79'
        || this.prodStatCode === '15' || this.prodStatCode === '84' || this.prodStatCode === '12'
        || this.prodStatCode === '31' || this.prodStatCode === '14' || this.prodStatCode === '26')
        && (value === '24' || value === '68'))) {
      flag = true;
    }
    return flag;
  }
  /**
   * After a form is initialized, we link it to our main form
   */
  addToForm(name: string, form: UntypedFormGroup) {
    this.messageToBankForm.setControl(name, form);
  }

  setFieldError() {
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
          jqueryConst('html,body').animate({ scrollTop: (target.offset().top - Constants.NUMERIC_TWENTY) }, 'slow', () => {
            target.trigger('focus');
          });
        }
      }
    });
  }

  handleEvents(operation) {
    this.operation = operation;
    if (operation === Constants.OPERATION_SAVE) {
      let isSaveAllowed = true;
      if (this.messageToBankForm.get('tnxAmt') && this.messageToBankForm.get('tnxAmt').value != null
       && this.messageToBankForm.get('tnxAmt').value !== '' && this.messageToBankForm.get('tnxAmt').invalid) {
        isSaveAllowed = false;
        this.messageToBankForm.get('tnxAmt').markAllAsTouched();
        this.setFieldError();
      }
      if (isSaveAllowed) {
      this.actionsComponent.showProgressBar = true;
      this.translate.get('PROGRESSBAR_MSG_SAVE').subscribe((value: string) => {
        this.actionsComponent.displayMessage = value;
      });
      this.onSave();
    }
    } else if (operation === Constants.OPERATION_SUBMIT && this.mode !== Constants.MODE_UNSIGNED) {
      this.validateForm();
      if (this.messageToBankForm.valid && this.commonService.getReauthEnabled()) {
        this.transformToIssuedUndertaking();
        this.enableReauthPopup = this.commonService.getReauthEnabled();
        this.showReauthPopup(Constants.OPERATION_SUBMIT);
      } else if (this.messageToBankForm.valid) {
        this.transformToIssuedUndertaking();
        this.onSubmit();
      }
    } else if (operation === Constants.OPERATION_SUBMIT && this.mode === Constants.MODE_UNSIGNED) {
      if (this.commonService.getReauthEnabled()) {
        this.enableReauthPopup = this.commonService.getReauthEnabled();
        this.transformForUnsignedMode();
        this.showReauthPopup(Constants.OPERATION_SUBMIT);
      } else {
        this.transformForUnsignedMode();
        this.onSubmitRetrieveUnsigned();
      }
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
    } else if (operation === Constants.OPERATION_CANCEL) {
      this.onCancel();
    } else if (operation === Constants.OPERATION_PREVIEW) {
      this.openPreview();
    } else if (operation === Constants.OPERATION_EXPORT) {
      this.generatePdf();
    } else if (operation === Constants.OPERATION_HELP) {
      this.openHelp();
    }
  }

  onSave() {
    this.showForm = false;
    this.transformToIssuedUndertaking();
    if (this.option === Constants.OPTION_ACTION_REQUIRED) {
    this.issuedundertaking.actionReqCode = this.bgRecord[`actionReqCode`];
    }
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
    Object.assign(this.rawValuesForm, this.messageToBankForm.getRawValue());
    this.issuedundertaking = new IssuedUndertakingRequest();
    this.issuedundertaking.refId = this.bgRecord[`refId`];
    this.issuedundertaking.custRefId = this.bgRecord[`custRefId`];
    this.issuedundertaking.bgExpDate = this.bgRecord[`bgExpDate`];
    this.issuedundertaking.boRefId = this.bgRecord[`boRefId`];
    this.issuedundertaking.purpose = this.bgRecord[`purpose`];
    this.issuedundertaking.subProductCode = this.bgRecord[`subProductCode`];
    this.issuedundertaking.merge(this.messageToBankForm.controls[`freeFormatMessageSection`].value);
    this.issuedundertaking.bgFreeFormatText = this.messageToBankForm.controls[`freeFormatMessageSection`].get('bgFreeFormatText').value;
    this.issuedundertaking.tnxTypeCode = '13';
    this.issuedundertaking.tnxId = this.tnxId;
    this.issuedundertaking.attids = this.iuCommonDataService.getAttIds();

    if (this.option === Constants.OPTION_CLAIM_PROCESSING || this.option === Constants.OPTION_ACTION_REQUIRED) {
      this.issuedundertaking.claimPresentDate = this.bgRecord[`claimPresentDate`];
      this.issuedundertaking.claimReference = this.bgRecord[`claimReference`];
      this.issuedundertaking.bgFeeActNo = this.rawValuesForm[`bgFeeActNo`];
      this.issuedundertaking.bgPrincipalActNo = this.rawValuesForm[`bgPrincipalActNo`];
      this.issuedundertaking.parentTnxId = this.parentTnxId;
      if (this.bgRecord[`purpose`] === '01') {
        this.issuedundertaking.tnxAmt = this.rawValuesForm[`tnxAmt`];
        this.issuedundertaking.tnxCurCode = this.rawValuesForm[`tnxCurCode`];
        this.issuedundertaking.bgAvailableAmt = this.bgRecord[`bgAvailableAmt`];
      } else {
        this.issuedundertaking.cuTnxAmt = this.rawValuesForm[`tnxAmt`];
        this.issuedundertaking.cuCurCode = this.rawValuesForm[`tnxCurCode`];
        this.issuedundertaking.cuAvailableAmt = this.bgRecord[`cuAvailableAmt`];
      }
      if (this.option === Constants.OPTION_ACTION_REQUIRED) {
        if (this.prodStatCode === '86') {
          this.issuedundertaking.subTnxTypeCode = this.rawValuesForm[`acceptRejectSubTnxTypeCode`] === '63' ?
                                                  this.rawValuesForm[`acceptRejectSubTnxTypeCode`] : this.rawValuesForm[`subTnxTypeCode`];
          this.issuedundertaking.extendedDate = this.bgRecord[`extendedDate`];
          } else {
          this.issuedundertaking.subTnxTypeCode = this.rawValuesForm[`subTnxTypeCode`];
        }
        this.issuedundertaking.prodStatCode = this.prodStatCode;
      } else {
        // for now hard coding values, need to change later.
        this.issuedundertaking.subTnxTypeCode = '25';
      }
    } else if ((this.option === Constants.OPTION_CANCEL) || (this.option === Constants.OPTION_EXISTING)) {
       this.setValuesForExistingCancelOption(this.option);
    }
    this.issuedundertaking.applicantReference = this.bgRecord[`applicantReference`];
    if (this.commonService.getTnxToDoListId() != null && this.commonService.getTnxToDoListId() !== '' ) {
      this.issuedundertaking.todoListId = this.commonService.getTnxToDoListId();
    }
  }

  setValuesForExistingCancelOption(option) {
    if (this.bgRecord[`issDate`] !== null && this.bgRecord[`issDate`] !== '') {
      this.issuedundertaking.issDate = this.bgRecord[`issDate`];
    }  else if (this.option === 'CANCEL') {
      this.issuedundertaking.issDate = this.rawValuesForm[`issDate`];
      this.issuedundertaking.subTnxTypeCode = '68';
      this.issuedundertaking.prodStatCode = 'F4';
    } else if (this.option === Constants.OPTION_EXISTING) {
      this.issuedundertaking.issDate = this.rawValuesForm[`issDate`];
    }
    if (option === Constants.OPTION_EXISTING) {
      this.issuedundertaking.subTnxTypeCode = '24';
      this.issuedundertaking.prodStatCode = '02';
    } else {
      this.issuedundertaking.subTnxTypeCode = '68';
      this.issuedundertaking.prodStatCode = 'F3';
    }
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
          this.responseMessage = data.message;
          this.responseService.setResponseMessage(data.message);
          this.responseService.setRefId(data.refId);
          this.responseService.setTnxId(data.tnxId);
          this.responseService.setOption(data.option);
          this.responseService.setTnxType(data.tnxTypeCode);
          this.responseService.setSubTnxType(data.subTnxTypeCode);
          const response = data.response;
          if (this.enableReauthPopup) {
            this.actionsComponent.showProgressBar = false;
            this.reauthDialogComponent.onReauthSubmitCompletion(response);
            if (response === Constants.SUCCESS) {
              this.router.navigate(['submitOrSave']);
            }
          } else {
            this.router.navigate(['submitOrSave']);
          }
        }
      );
  }

  validateAllFields(mainForm: UntypedFormGroup) {
   mainForm.markAllAsTouched();
   if (!this.messageToBankForm.valid) {
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
      icon: 'pi pi-exclamation-triangle',
      key: 'fieldErrorDialog',
      rejectVisible: false,
      acceptLabel: this.commonService.getTranslation('USER_ACTION_OK'),
      accept: () => {
      }
    });
  }
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
        this.messageToBankForm.get(fieldId).setValue(account.ACCOUNTNO);
      }
    });
  }

  clearPrincipalAcc(event) {
    this.messageToBankForm.get('bgPrincipalActNo').setValue('');
  }

  clearFeeAcc(event) {
    this.messageToBankForm.get('bgFeeActNo').setValue('');
  }

  showDailog(refId, tnxId): void {
    const host = window.location.origin;
    let url = host + this.commonService.getBaseServletUrl();
    url += Constants.PREVIEW_POPUP_SCREEN;
    let myWindow = null;

    if (tnxId !== null) {
      myWindow = window.open(`${url}?option=FULL&referenceid=${refId}&tnxid=${tnxId}&productcode=BG`,
        Constants.TRANSACTION_POPUP, Constants.TRANSACTION_POPUP_PROPERTIES);
    } else {
      myWindow = window.open(`${url}?option=FULL&referenceid=${refId}&productcode=BG`,
        Constants.TRANSACTION_POPUP, Constants.TRANSACTION_POPUP_PROPERTIES);
    }

    myWindow.focus();
  }

  openPreview() {
    const host = window.location.origin;
    let url = host + this.commonService.getBaseServletUrl();
    url += Constants.PREVIEW_POPUP_SCREEN;
    url += `/?option=FULL&referenceid=${this.iuCommonDataService.getRefId()}`;
    url += `&tnxid=${this.iuCommonDataService.getTnxId()}`;
    url += `&productcode=${this.iuCommonDataService.getProductCode()}&tnxtype=13`;
    const myWindow = window.open(url,
      Constants.TRANSACTION_POPUP, Constants.TRANSACTION_POPUP_PROPERTIES);


    myWindow.focus();
  }

  onReturn() {
    this.actionsComponent.showProgressBar = true;
    this.translate.get('PROGRESSBAR_MSG_RETURN').subscribe((value: string) => {
      this.actionsComponent.displayMessage = value;
    });
    this.iuService.returnIssuedUndertaking(this.issuedundertaking)
      .subscribe(
        data => {
          this.response(data);
        }
      );
  }

  transformForUnsignedMode() {
    this.rawValuesForm = new UntypedFormGroup({});
    Object.assign(this.rawValuesForm, this.messageToBankForm.getRawValue());
    this.issuedundertaking = new IssuedUndertakingRequest();
    this.issuedundertaking.tnxTypeCode = Constants.TYPE_INQUIRE;
    this.issuedundertaking.refId = this.iuCommonDataService.getRefId();
    this.issuedundertaking.tnxId = this.iuCommonDataService.getTnxId();
    if ((this.operation === Constants.OPERATION_RETURN) || (this.bgRecord[`returnComments`] && this.bgRecord[`returnComments`] !== null &&
        this.bgRecord[`returnComments`] !== '')) {
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
    this.iuService.submitFromRetrieveUnsigned(this.issuedundertaking).subscribe(
      data => {
        this.response(data);
      }
    );

  }

  response(data) {
    this.responseMessage = data.message;
    this.responseService.setResponseMessage(data.message);
    this.responseService.setRefId(data.refId);
    this.responseService.setTnxId(data.tnxId);
    this.responseService.setTnxType(data.tnxTypeCode);
    this.responseService.setOption(data.option);
    const response = data.response;
    if (this.enableReauthPopup) {
      this.actionsComponent.showProgressBar = false;
      this.reauthDialogComponent.onReauthSubmitCompletion(response);
      if (response === Constants.SUCCESS) {
        this.router.navigate(['submitOrSave']);
      }
    } else {
      this.router.navigate(['submitOrSave']);
    }
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
    this.validateAllFields(this.messageToBankForm);
  }

  showReauthPopup(operation) {
    const entity = this.bgRecord[`entity`];
    const currency = this.bgRecord[`bgCurCode`];
    const amount = this.commonService.getNumberWithoutLanguageFormatting(this.bgRecord[`bgAmt`]);
    const subProdCode = this.bgRecord[`subProductCode`];
    const bank = this.bgRecord[`issuingBank`][`abbvName`];
    const tnxTypeCode = this.bgRecord[`tnxTypeCode`];
    const reauthParams = new Map();
    reauthParams.set('productCode', Constants.PRODUCT_CODE_IU);
    reauthParams.set('subProductCode', subProdCode);
    reauthParams.set('tnxTypeCode', tnxTypeCode);
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
    this.issuedundertaking.clientSideEncryption = this.messageToBankForm.controls.reauthForm.get('clientSideEncryption').value;
    this.issuedundertaking.reauthPassword = this.messageToBankForm.controls.reauthForm.get('reauthPassword').value;
    this.issuedundertaking.reauthPerform = this.messageToBankForm.controls.reauthForm.get('reauthPerform').value;
    if (this.operation === Constants.OPERATION_SUBMIT && this.mode !== Constants.MODE_UNSIGNED) {
      this.onSubmit();
    } else if (this.operation === Constants.OPERATION_SUBMIT && this.mode === Constants.MODE_UNSIGNED) {
      this.onSubmitRetrieveUnsigned();
    } else if (this.operation === Constants.OPERATION_RETURN) {
      this.onReturn();
    }
  }

  validateFormOnReturn() {
    const comments = this.messageToBankForm.controls.commentsForm.get('returnComments');
    comments.setValidators([Validators.required, validateSwiftCharSet(Constants.Z_CHAR)]);
    comments.updateValueAndValidity();
    this.returnFormValid = true;
    if (!comments.valid) {
      comments.markAsTouched();
      this.returnFormValid = false;
      return this.validationService.validateField(comments);
    }
    return '';
  }

  updatePayExtendValue() {
    //  acceptRejectSubTnxTypeCode: 63->Reject, 62->Accept
    //  subTnxTypeCode: 21 ->pay, 20 ->extend
    if (this.messageToBankForm.get('acceptRejectSubTnxTypeCode').value === '63') {
      this.displaySubTnx = false;
      this.messageToBankForm.get('subTnxTypeCode').setValue('');
      this.messageToBankForm.get('tnxAmt').setValidators(null);
    } else if (this.bgRecord[`extendedDate`] && this.bgRecord[`extendedDate`] !== null &&
               this.bgRecord[`extendedDate`] !== '') {
      this.displaySubTnx = true;
      this.messageToBankForm.get('subTnxTypeCode').setValue('20');
      this.messageToBankForm.get('tnxAmt').setValidators(null);
    } else {
      this.displaySubTnx = true;
      this.messageToBankForm.get('subTnxTypeCode').setValue('21');
      this.updateSettlementAmount();
    }
    this.messageToBankForm.get('subTnxTypeCode').updateValueAndValidity();
    this.messageToBankForm.get('tnxAmt').updateValueAndValidity();
    this.changeDetectorRef.detectChanges();
  }

  updateSettlementAmount() {
    // subTnxTypeCode: 21 ->pay, 20 ->extend
    if (this.messageToBankForm.get('subTnxTypeCode').value === '21') {
    this.messageToBankForm.get('tnxAmt').setValidators([Validators.required,
      validateAmountField(this.messageToBankForm.get('tnxCurCode').value,
      this.commonService.getCurrencyDecimalMap().get(this.messageToBankForm.get('tnxCurCode').value)),
      validateSettlementAmount(this.messageToBankForm.get('tnxAmt'),
      this.messageToBankForm.get('claimAmt'), this.messageToBankForm.get('bgAmt'))]);
    } else {
      this.messageToBankForm.get('tnxAmt').setValidators(null);
    }
    if ( this.bgRecord[`purpose`] === '01') {
      this.messageToBankForm.get(`tnxAmt`).setValue(this.commonService.transformAmt(this.bgRecord[`tnxAmt`], this.bgRecord[`tnxCurCode`]));
    } else {
      this.messageToBankForm.get(`tnxAmt`).setValue(this.commonService.transformAmt(this.bgRecord[`cuTnxAmt`], this.bgRecord[`cuCurCode`]));
    }
    this.messageToBankForm.get('tnxAmt').updateValueAndValidity();
  }

  validatePaymentDocumentAmount() {
    const bgDocumentAmt = this.commonService.transformAmt((this.bgRecord[`purpose`] === '01'
    ? this.bgRecord[`tnxAmt`] : this.bgRecord[`cuTnxAmt`]), this.messageToBankForm.controls[`tnxCurCode`].value);
    this.messageToBankForm.get('tnxAmt').clearValidators();
    this.messageToBankForm.get('tnxAmt').setValidators(validateSettlementDocumentAmount(this.messageToBankForm.get('tnxAmt').value,
    bgDocumentAmt));
    this.messageToBankForm.get('tnxAmt').updateValueAndValidity();
  }


  hasFeeAccountValue(): boolean {
    if (this.messageToBankForm.get(`bgFeeActNo`) &&
        this.messageToBankForm.get(`bgFeeActNo`).value !== null &&
        this.messageToBankForm.get(`bgFeeActNo`).value !== '') {
      return true;
    } else {
      return false;
    }
  }

  hasPrincipalAccountValue(): boolean {
    if (this.messageToBankForm.get(`bgPrincipalActNo`) &&
        this.messageToBankForm.get(`bgPrincipalActNo`).value !== null &&
        this.messageToBankForm.get(`bgPrincipalActNo`).value !== '') {
      return true;
    } else {
      return false;
    }
  }
  onPrint() {
    window.print();
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
    if (this.tradeEventDetailsComponent) {
      this.tradeEventDetailsComponent.generatePdf(this.generatePdfService);
    }
    this.generatePdfService.setSubSectionHeader('HEADER_MESSAGE_TO_BANK', true);
    this.generatePdfService.setSectionDetails('', false, false, 'claimSection');
    this.generatePdfService.setSectionDetails('', false, false, 'messageTypeAndAccounts');
    this.generatePdfService.setSectionDetails('', false, false, 'freeFormatMessage');
    if (this.bgRecord[`returnComments`] && this.bgRecord[`returnComments`] !== '' && this.bgRecord[`returnComments`] !== null &&
      this.iuCommonReturnCommentsComponent) {
      this.iuCommonReturnCommentsComponent.generatePdf(this.generatePdfService);
    }

    if (this.mode !== 'UNSIGNED' && (this.previewOption !== 'SUMMARY' && this.previewOption !== 'FULLORSUMMARY')) {
      this.generatePdfFullDetails();
    }
    if (this.iuCommonDataService.getmasterorTnx() === 'master') {
      this.generatePdfService.saveFile(this.jsonContent.refId, '');
    } else {
      this.generatePdfService.saveFile(this.jsonContent.refId, this.jsonContent.tnxId);
    }
  }

  openHelp() {
    const host = window.location.origin;
    let url = host + this.commonService.getBaseServletUrl();
    const userLanguage = this.commonService.getUserLanguage();
    const accessKey = Constants.HELP_IU_MSG_TO_BANK;
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
}
