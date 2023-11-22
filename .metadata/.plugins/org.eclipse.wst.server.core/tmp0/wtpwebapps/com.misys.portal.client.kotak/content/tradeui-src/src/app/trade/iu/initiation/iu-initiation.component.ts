import { StaticDataService } from './../../../common/services/staticData.service';
import { TnxIdGeneratorService } from './../../../common/services/tnxIdGenerator.service';
import { CuReductionIncreaseComponent } from './components/cu-reduction-increase/cu-reduction-increase.component';
import { CommonDataService } from '../../../common/services/common-data.service';
import { GeneratePdfService } from '../../../common/services/generate-pdf.service';
import { UndertakingDetailsComponent } from './components/undertaking-details/undertaking-details.component';
import { BankInstructionsComponent } from './components/bank-instructions/bank-instructions.component';
import { ContractDetailsComponent } from './components/contract-details/contract-details.component';
import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';
import { Constants } from './../../../common/constants';
import { AuditService } from './../../../common/services/audit.service';
import { RefIdGeneratorService } from './../../../common/services/refIdGenerator.service';
import { validateSwiftCharSet, validateWithCurrentDate, validateDates, validateBookingAmountWithBGAndLimAvlblAmount, validateTnxAndLimAvlblAmount } from './../../../common/validators/common-validator';
import { ValidationService } from './../../../common/validators/validation.service';
import { CuBeneficiaryDetailsComponent } from './components/cu-beneficiary-details/cu-beneficiary-details.component';
import { CuGeneralDetailsComponent } from './components/cu-general-details/cu-general-details.component';
import { CuUndertakingDetailsComponent } from './components/cu-undertaking-details/cu-undertaking-details.component';
import { ReauthDialogComponent } from '../../../common/components/reauth-dialog/reauth-dialog.component';
import { ReauthService } from '../../../common/services/reauth.service';
import { IUCommonAmountDetailsComponent } from '../common/components/amount-details/amount-details.component';
import { IssuedUndertakingRequest } from '../common/model/IssuedUndertakingRequest';
import { TemplateIssuedUndertakingRequest } from '../common/model/TemplateIssuedUndertakingRequest';
import { IUService } from '../common/service/iu.service';
import { IUCommonDataService } from '../common/service/iuCommonData.service';
import { CommonService } from '../../../common/services/common.service';
import { ResponseService } from '../../../common/services/response.service';
import { IUCommonApplicantDetailsComponent } from '../common/components/applicant-details-form/applicant-details-form.component';
import { BankDetailsComponent } from './components/bank-details/bank-details.component';
import { IUGeneralDetailsComponent } from './components/iu-general-details/iu-general-details.component';
import { CuRenewalDetailsComponent } from './components/cu-renewal-details/cu-renewal-details.component';
import { RenewalDetailsComponent } from './components/renewal-details/renewal-details.component';
import { IUCommonLicenseComponent } from '../common/components/license/license.component';
import { ActionsComponent } from '../../../common/components/actions/actions.component';
import { IUCommonReturnCommentsComponent } from '../common/components/return-comments/return-comments.component';
import $ from 'jquery';
import { UndertakingGeneralDetailsComponent } from './components/iu-undertaking-general-details/iu-undertaking-general-details.component';
import { ConfigService } from '../../../common/services/config.service';
import { CuAmountDetailsComponent } from './components/cu-amount-details/cu-amount-details.component';
import { ReductionIncreaseComponent } from './components/reduction-increase/reduction-increase.component';
import { ShipmentDetailsComponent } from './components/shipment-details/shipment-details.component';
import { IUFacilityDetailsComponent } from './components/facility-details/iu-facility-details.component';
import { IuPaymentDetailsComponent } from './components/iu-payment-details/iu-payment-details.component';
import { CuPaymentDetailsComponent } from './components/cu-payment-details/cu-payment-details.component';
import { AmendBankDetailsComponent } from '../amend/components/amend-bank-details/amend-bank-details.component';
import { URLConstants } from './../../../common/urlConstants';
import { IUCommonBeneficiaryDetailsComponent } from '../common/components/beneficiary-details-form/beneficiary-details-form.component';
import { BanktemplateDownloadRequest } from '../common/model/BanktemplateDownloadRequest';

const jqueryConst = $;


@Component({
  selector: 'fcc-iu-initiation',
  templateUrl: './iu-initiation.component.html',
  styleUrls: ['./iu-initiation.component.css']
})
export class IUInitiationComponent implements OnInit {

  inititationForm: UntypedFormGroup;
  rawValuesForm: UntypedFormGroup;
  issuedundertaking: IssuedUndertakingRequest;
  templateIssuedUndertaking: TemplateIssuedUndertakingRequest;
  contextPath: string;
  actionCode: string;
  responseMessage: object;
  public bankDetails: string[] = [];
  public jsonContent;
  public showForm = true;
  public viewMode = false;
  private submitted = false;
  public luStatus = false;
  public displayDepuFlag = false;
  public entitySelected: string;
  public errorTitle: string;
  public tnxType;
  public tnxId;
  public displayErrorDialog = false;
  public errorMessage: string;
  public enableReauthPopup = false;
  public facilityVisible = false;
  public operation: string;
  public customerReference: string;
   public bgAmtValue: string;
  public bgCurCode: string;
  public mode: string;
  public speciman: string;
  public documentId: string;
  public stylesheetname: string;
  public textTypeStandard: string;
  public guaranteeTextId: string;
  public guaranteeTypeCompanyId: string;
  public guaranteeTypeName: string;
  public invalidValue: string;
  private returnFormValid: boolean;
  private licenseValidError: string;
  private expDate: string;
  private finalRenewalExpDate: string;
  private cuExpDate: string;
  private cuFinalRenewalExpDate: string;
  currencyDecimalMap = new Map<string, number>();

  @ViewChild(UndertakingGeneralDetailsComponent) undertakingGeneralDetailsChildComponent: UndertakingGeneralDetailsComponent;
  @ViewChild(IUGeneralDetailsComponent) iuGeneraldetailsChildComponent: IUGeneralDetailsComponent;
  @ViewChild(CuGeneralDetailsComponent) luGeneraldetailsChildComponent: CuGeneralDetailsComponent;
  @ViewChild(CuBeneficiaryDetailsComponent) cuBeneficaryDetailsChildComponent: CuBeneficiaryDetailsComponent;
  @ViewChild(CuAmountDetailsComponent) cuAmountDetailsChildComponent: CuAmountDetailsComponent;
  @ViewChild(CuRenewalDetailsComponent) cuRenewalDetailsChildComponent: CuRenewalDetailsComponent;
  @ViewChild(CuUndertakingDetailsComponent) cuUndertakingChildComponent: CuUndertakingDetailsComponent;
  @ViewChild(IUCommonAmountDetailsComponent) amountDetailsChildComponent: IUCommonAmountDetailsComponent;
  @ViewChild(BankDetailsComponent) bankDetailsComponent: BankDetailsComponent;
  @ViewChild(ReauthDialogComponent) reauthDialogComponent: ReauthDialogComponent;
  @ViewChild(RenewalDetailsComponent) renewalDetailsComponent: RenewalDetailsComponent;
  @ViewChild(IUCommonApplicantDetailsComponent) applicantDetailsComponent: IUCommonApplicantDetailsComponent;
  @ViewChild(ContractDetailsComponent) contractDetailsComponent: ContractDetailsComponent;
  @ViewChild(BankInstructionsComponent) bankInstructionsComponent: BankInstructionsComponent;
  @ViewChild(UndertakingDetailsComponent) undertakingChildComponent: UndertakingDetailsComponent;
  @ViewChild(IUCommonLicenseComponent) iuLicenseComponent: IUCommonLicenseComponent;
  @ViewChild(ActionsComponent) actionsComponent: ActionsComponent;
  @ViewChild(IUCommonReturnCommentsComponent) iuCommonReturnCommentsComponent: IUCommonReturnCommentsComponent;
  @ViewChild(ReductionIncreaseComponent) reductionIncreaseComponent: ReductionIncreaseComponent;
  @ViewChild(CuReductionIncreaseComponent) cuReductionIncreaseComponent: CuReductionIncreaseComponent;
  @ViewChild(ShipmentDetailsComponent) shipmentDetailsComponent: ShipmentDetailsComponent;
  @ViewChild(IuPaymentDetailsComponent) iuPaymentDetailsComponent: IuPaymentDetailsComponent;
  @ViewChild(CuPaymentDetailsComponent) cuPaymentDetailsComponent: CuPaymentDetailsComponent;
  @ViewChild(IUFacilityDetailsComponent) iuFacilityDetailsComponent: IUFacilityDetailsComponent;
  @ViewChild(IUCommonBeneficiaryDetailsComponent) beneficiaryDetailsComponent: IUCommonBeneficiaryDetailsComponent;
  constructor(
    public fb: UntypedFormBuilder, public iuService: IUService,
    public responseService: ResponseService, public commonService: CommonService,
    public iuCommonDataService: IUCommonDataService, public confirmationService: ConfirmationService,
    public translate: TranslateService, public router: Router, public activatedRoute: ActivatedRoute,
    public validationService: ValidationService, public reauthService: ReauthService,
    public refIdGeneratorService: RefIdGeneratorService, public commonData: CommonDataService,
    public datePipe: DatePipe, public auditService: AuditService, public generatePdfService: GeneratePdfService,
    public el: ElementRef, public configService: ConfigService,
    protected tnxIdGeneratorService: TnxIdGeneratorService
  ) { }

  ngOnInit() {
    this.contextPath = window[`CONTEXT_PATH`];
    this.actionCode = window[`ACTION_CODE`];
    let viewRefId;
    let viewTnxId;
    let mode;
    let option;
    let masterOrTnx;
    let templateid;
    let subproductcode;
    let companyId;
    this.activatedRoute.params.subscribe(paramsId => {
      this.viewMode = paramsId.viewMode;
      viewRefId = paramsId.refId;
      viewTnxId = paramsId.tnxId;
      mode = paramsId.mode;
      this.mode = mode;
      this.tnxType = paramsId.tnxType;
      option = paramsId.option;
      masterOrTnx = paramsId.masterOrTnx;
      templateid = paramsId.templateid;
      subproductcode = paramsId.subproductcode;
      companyId = paramsId.companyid;
    });

    if (this.viewMode) {
      if (masterOrTnx === 'tnx') {
        this.commonService.getTnxDetails(viewRefId, viewTnxId, Constants.PRODUCT_CODE_IU, '').subscribe(data => {
          this.jsonContent = data.transactionDetails as string[];
          if ((this.jsonContent.guaranteeTypeName != null && this.jsonContent.guaranteeTypeName !== '') &&
          (this.jsonContent.guaranteeTypeCompanyId != null && this.jsonContent.guaranteeTypeCompanyId !== '')) {
          this.iuCommonDataService.setBankTemplateData(this.jsonContent);
        }
          if (this.jsonContent.facilityDate !== null) {
          this.facilityVisible = true;
        }
          this.iuCommonDataService.setDisplayMode('view');
          this.iuCommonDataService.setOption(option);
          this.commonData.setmasterorTnx('tnx');
          if (this.jsonContent.purpose != null && this.jsonContent.purpose !== '' && this.jsonContent.purpose !== '01') {
            this.iuCommonDataService.setLUStatus(true);
            this.luStatus = true;
          }
        });
      } else if (masterOrTnx === 'master') {
        this.commonService.getMasterDetails(viewRefId, Constants.PRODUCT_CODE_IU, '').subscribe(data => {
          this.jsonContent = data.masterDetails as string[];
          this.iuCommonDataService.setDisplayMode('view');
          this.iuCommonDataService.setmasterorTnx('master');
          this.commonData.setmasterorTnx('master');
          this.iuCommonDataService.setOption(option);
          if ((this.jsonContent.guaranteeTypeName != null && this.jsonContent.guaranteeTypeName !== '') &&
          (this.jsonContent.guaranteeTypeCompanyId != null && this.jsonContent.guaranteeTypeCompanyId !== '')) {
          this.iuCommonDataService.setBankTemplateData(this.jsonContent);
        }
          if (this.jsonContent.purpose != null && this.jsonContent.purpose !== '' && this.jsonContent.purpose !== '01') {
            this.iuCommonDataService.setLUStatus(true);
            this.luStatus = true;
          }
        });
      }
      this.commonService.getBankDetails().subscribe(data => {
        this.bankDetails = data as string[];
      });
    } else if (mode === Constants.MODE_DRAFT && this.tnxType === '01') {
      this.iuCommonDataService.setRefId(viewRefId);
      this.iuCommonDataService.setTnxId(viewTnxId);
      this.commonService.getTnxDetails(viewRefId, viewTnxId, Constants.PRODUCT_CODE_IU, this.actionCode).subscribe(data => {
        this.jsonContent = data.transactionDetails as string[];
        this.iuCommonDataService.setMode(Constants.MODE_DRAFT);
        this.iuCommonDataService.setViewComments(true);
        if ((this.jsonContent.guaranteeTypeName != null && this.jsonContent.guaranteeTypeName !== '') &&
        (this.jsonContent.guaranteeTypeCompanyId != null && this.jsonContent.guaranteeTypeCompanyId !== '')) {
          this.iuCommonDataService.setBankTemplateData(this.jsonContent);
        }
        if (this.jsonContent.facilityDate !== null) {
          this.facilityVisible = true;
        }
        if (this.jsonContent.purpose != null && (this.jsonContent.purpose === '02' || this.jsonContent.purpose === '03')) {
          this.iuCommonDataService.setLUStatus(true);
          this.luStatus = true;
        }
      });
    } else if (mode === Constants.MODE_UNSIGNED) {
      this.commonService.getTnxDetails(viewRefId, viewTnxId, Constants.PRODUCT_CODE_IU, this.actionCode).subscribe(data => {
        this.jsonContent = data.transactionDetails as string[];
        this.viewMode = true;
        if ((this.jsonContent.guaranteeTypeName != null && this.jsonContent.guaranteeTypeName !== '') &&
        (this.jsonContent.guaranteeTypeCompanyId != null && this.jsonContent.guaranteeTypeCompanyId !== '')) {
          this.iuCommonDataService.setBankTemplateData(this.jsonContent);
        }
        if (this.jsonContent.facilityDate !== null) {
          this.facilityVisible = true;
        }
        this.iuCommonDataService.setDisplayMode('view');
        this.iuCommonDataService.setMode(Constants.MODE_UNSIGNED);
        if (this.jsonContent.purpose != null && (this.jsonContent.purpose === '02' || this.jsonContent.purpose === '03')) {
          this.iuCommonDataService.setLUStatus(true);
          this.luStatus = true;
        }
      });
    } else if (this.tnxType === '01' && (option === Constants.OPTION_EXISTING)) {
      this.commonService.getMasterDetails(viewRefId, Constants.PRODUCT_CODE_IU, this.actionCode).subscribe(data => {
        this.refIdGeneratorService.generateRefId('BG').subscribe(refData => {
          this.jsonContent = data.masterDetails as string[];
          this.jsonContent.refId = refData.refId;
          this.iuCommonDataService.setTnxType(this.tnxType);
          this.iuCommonDataService.setOption(option);
          if (this.jsonContent.purpose != null && this.jsonContent.purpose !== '' && this.jsonContent.purpose !== '01') {
            this.iuCommonDataService.setLUStatus(true);
            this.luStatus = true;
          }
          if ((this.jsonContent.guaranteeTypeName != null && this.jsonContent.guaranteeTypeName !== '') &&
          (this.jsonContent.guaranteeTypeCompanyId != null && this.jsonContent.guaranteeTypeCompanyId !== '')) {
          this.iuCommonDataService.setBankTemplateData(this.jsonContent);
        }
        });
      });

    } else if (this.tnxType === '01' && (option === Constants.OPTION_REJECTED)) {
      this.commonService.getTnxDetails(viewRefId, viewTnxId, Constants.PRODUCT_CODE_IU, this.actionCode).subscribe(data => {
          this.refIdGeneratorService.generateRefId('BG').subscribe(refData => {
            this.jsonContent = data.transactionDetails as string[];
            this.jsonContent.refId = refData.refId;
            this.iuCommonDataService.setTnxType(this.tnxType);
            this.iuCommonDataService.setOption(option);
            if (this.jsonContent.purpose != null && this.jsonContent.purpose !== '' && this.jsonContent.purpose !== '01') {
              this.iuCommonDataService.setLUStatus(true);
              this.luStatus = true;
            }
          });
        });
      this.tnxIdGeneratorService.getTransactionId().subscribe(data => {
          this.tnxId = data.tnxId as string;
          this.iuCommonDataService.setTnxId(this.tnxId);
        });

    } else if (this.tnxType === '01' && option === Constants.OPTION_TEMPLATE) {
      this.iuService.getIuTemplateDetails(templateid, this.iuCommonDataService.getProductCode(),
        subproductcode, option).subscribe(data => {
          this.jsonContent = data.bg_tnx_record as string[];
          if ((this.jsonContent.guaranteeTypeName != null && this.jsonContent.guaranteeTypeName !== '') &&
          (this.jsonContent.guaranteeTypeCompanyId != null && this.jsonContent.guaranteeTypeCompanyId !== '')) {
          this.iuCommonDataService.setBankTemplateData(this.jsonContent);
        }
          this.iuCommonDataService.setMode(Constants.MODE_DRAFT);
          this.iuCommonDataService.setTnxType(this.tnxType);
          this.iuCommonDataService.setOption(Constants.OPTION_TEMPLATE);
          this.iuCommonDataService.setViewComments(true);
          this.iuCommonDataService.setTnxId(this.jsonContent.tnxId);
          if (this.jsonContent.purpose != null && (this.jsonContent.purpose === '02' || this.jsonContent.purpose === '03')) {
            this.iuCommonDataService.setLUStatus(true);
            this.luStatus = true;
          }
        });
    } else if (this.tnxType === '01' && option === Constants.SCRATCH
    && this.iuCommonDataService.getIsFromBankTemplateOption()) {
      this.iuService.getIuBankTemplateDetails(this.iuCommonDataService.getBankTemplateID(),
      this.iuCommonDataService.getTemplateUndertakingType(), this.iuCommonDataService.getProductCode(),
      companyId, option).subscribe(data => {
          this.refIdGeneratorService.generateRefId('BG').subscribe(refData => {
            this.jsonContent.refId = refData.refId;
          });
          this.jsonContent = data.bg_tnx_record as string[];
          this.iuCommonDataService.setBankTemplateData(this.jsonContent);
          this.iuCommonDataService.setMode(Constants.MODE_DRAFT);
          this.iuCommonDataService.setTnxType(this.tnxType);
          this.iuCommonDataService.setViewComments(true);
          this.iuCommonDataService.setTnxId(this.jsonContent.tnxId);
          if (this.jsonContent.purpose != null && (this.jsonContent.purpose === '02' || this.jsonContent.purpose === '03')) {
            this.iuCommonDataService.setLUStatus(true);
            this.luStatus = true;
          }
        });
    } else {
      this.iuService.getDefaultValuesJsonService(this.actionCode).subscribe(data => {
        this.jsonContent = data.bg_tnx_record as string[];
        this.iuCommonDataService.setOption(Constants.OPTION_SCRATCH_GUARANTEE);
        this.iuCommonDataService.setRefId(this.jsonContent.refId);
        this.iuCommonDataService.setTnxId(this.jsonContent.tnxId);
      });
    }
    this.currencyDecimalMap = this.commonService.getCurrencyDecimalMap();

    this.createMainForm();

  }

  createMainForm() {
    return this.inititationForm = this.fb.group({
      counter_undertaking: ['']
    });
  }

  /**
   * After a form is initialized, we link it to our main form
   */
  addToForm(name: string, form: UntypedFormGroup) {
    this.inititationForm.setControl(name, form);
    if (name === 'beneficiaryDetailsFormSection') {
      this.inititationForm.setControl('altApplicantDetailsFormSection',
      this.inititationForm.get('applicantDetailsFormSection').get('altApplicantDetailsFormSection'));
    }
  }

  onSubmit() {
    if ((this.inititationForm.controls.applicantDetailsFormSection.get('entity') !== undefined
      && this.inititationForm.controls.applicantDetailsFormSection.get('entity').value !== ''
      && this.commonService.getNumberOfEntities() > 0)
      || this.commonService.getNumberOfEntities() === 0) {
      this.actionsComponent.showProgressBar = true;
      this.translate.get('PROGRESSBAR_MSG_SUBMIT').subscribe((value: string) => {
        this.actionsComponent.displayMessage = value;
      });
      this.showForm = false;
      this.submitted = true;
      this.iuService.saveOrSubmitIU(this.contextPath + URLConstants.IU_SUBMIT,
        this.issuedundertaking).subscribe(
          data => {
            // If Reauth is enabled and if Reauth is failed , then we are showing Alert Pop up for Failure
            // else set Response data and navigate the page
            if (this.enableReauthPopup && data.response === Constants.RESPONSE_REAUTH_FAILURE) {
              this.actionsComponent.showProgressBar = false;
              this.reauthDialogComponent.onReauthSubmitCompletion(data.response);
            } else {
              this.commonService.setResponseData(data);
              this.router.navigate(['submitOrSave']);
            }
          }
        );
    } else if (this.commonService.getNumberOfEntities() > 0) {
      // Display error message
      this.displayErrorDialog = true;
      this.translate.get('ERROR_TITLE').subscribe((value: string) => {
        this.errorTitle = value;
      });
      this.translate.get('ENTITY_MANDATORY_ERROR').subscribe((value: string) => {
        this.errorMessage = value;
      });
    }
  }

  transformForUnsignedMode() {
    this.rawValuesForm = new UntypedFormGroup({});
    Object.assign(this.rawValuesForm, this.inititationForm.getRawValue());
    this.issuedundertaking = new IssuedUndertakingRequest();
    this.issuedundertaking.tnxTypeCode = '01';
    this.issuedundertaking.refId = this.iuCommonDataService.getRefId();
    this.issuedundertaking.tnxId = this.iuCommonDataService.getTnxId();
    if ((this.operation === Constants.OPERATION_RETURN) || (this.jsonContent[`returnComments`] &&
        this.jsonContent[`returnComments`] !== null && this.jsonContent[`returnComments`] !== '')) {
      const returnComments = this.rawValuesForm[Constants.SECTION_RETURN_COMMENTS].returnComments;
      this.issuedundertaking.returnComments = returnComments;
    }
    this.issuedundertaking.applicantReference = this.rawValuesForm[Constants.SECTION_BANK_DETAILS].recipientBankCustomerReference;
    if (this.iuCommonDataService.getIsFromBankTemplateOption() ||
     (this.jsonContent.guaranteeTypeName != null && this.jsonContent.guaranteeTypeName !== '')) {
    this.issuedundertaking.guaranteeTypeName = this.jsonContent.guaranteeTypeName;
    this.issuedundertaking.guaranteeTypeCompanyId = this.jsonContent.guaranteeTypeCompanyId;
    if (this.iuCommonDataService.isEditorTemplate) {
      this.issuedundertaking.bgTextDetailsCode = '02';
     }
    }
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
        // If Reauth is enabled and if Reauth is failed , then we are showing Alert Pop up for Failure
        // else set the Response data and navigate the page
        if (this.enableReauthPopup && data.response === Constants.RESPONSE_REAUTH_FAILURE) {
          this.actionsComponent.showProgressBar = false;
          this.reauthDialogComponent.onReauthSubmitCompletion(data.response);
        } else {
          this.commonService.setResponseData(data);
          this.router.navigate(['submitOrSave']);
        }
      }
    );
  }

  onSave() {
    // entity validation is remaining to be done later
    const invalidControl = this.commonService.OnSaveFormValidation(this.inititationForm);
    if (invalidControl) {
      this.findInvalidField();
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

    if ((this.inititationForm.controls.applicantDetailsFormSection.get('entity') !== undefined
      && this.inititationForm.controls.applicantDetailsFormSection.get('entity').value !== ''
      && this.commonService.getNumberOfEntities() > 0)
      || this.commonService.getNumberOfEntities() === 0) {
      this.actionsComponent.showProgressBar = true;
      this.translate.get('PROGRESSBAR_MSG_SAVE').subscribe((value: string) => {
        this.actionsComponent.displayMessage = value;
      });
      this.showForm = false;
      this.submitted = true;
      this.transformToIssuedUndertaking();
      this.iuService.saveOrSubmitIU(this.contextPath + URLConstants.IU_SAVE,
        this.issuedundertaking).subscribe(
          data => {
            this.commonService.setResponseData(data);
            this.router.navigate(['submitOrSave']);
          }
        );
    } else if (this.commonService.getNumberOfEntities() > 0) {
      // Display error message
      this.displayErrorDialog = true;
      this.translate.get('ERROR_TITLE').subscribe((value: string) => {
        this.errorTitle = value;
      });
      this.translate.get('ENTITY_MANDATORY_ERROR').subscribe((value: string) => {
        this.errorMessage = value;
      });
    }
  }
  }

  // populate booking amount with BG amount and then validate booking amount with limit amount

    validateLimitBookingAmount() {
    let requestCur = '';
    let MidCur = '';
    const tnxAmt = (this.commonService.getNumberWithoutLanguageFormatting
      (this.inititationForm.get('amountDetailsSection').get('bgAmt').value));
    const tnxCur = this.inititationForm.get('amountDetailsSection').get('bgCurCode').value;
    const limCur = this.inititationForm.get('facilityDetailsSection').get('limitOutstandingCurCode').value;
    const limAmt = this.inititationForm.get('facilityDetailsSection').get('limitOutstandingAmount').value;
    const facCur = this.inititationForm.get('facilityDetailsSection').get('facilityOutstandingCurCode').value;
    const facAmt = this.inititationForm.get('facilityDetailsSection').get('facilityOutstandingAmount').value;
    let bookAmt = this.inititationForm.get('facilityDetailsSection').get('bookingAmount').value;
    if (limCur !== null && limCur !== '' && tnxCur !== null && tnxCur !== '' && facCur !== null && facAmt !== '' ) {
      if (limCur !== tnxCur) {
          requestCur = `${tnxCur} _ ${limCur} _limit`;
      }
      if (facCur !== limCur) {
        requestCur = `${requestCur}${facCur} _ ${limCur} _limit`;
      }
      this.commonService.getCurrencyRate(tnxCur, limCur, tnxAmt).subscribe(data => {
        this.jsonContent = data as string[];
        MidCur = this.jsonContent;
        if (limCur !== tnxCur) {
        bookAmt = this.jsonContent.toCurrencyAmount;
        this.iuFacilityDetailsComponent.setBookingAmount(bookAmt);
      } else if (limCur === tnxCur) {
        bookAmt = tnxAmt;
        this.iuFacilityDetailsComponent.setBookingAmount(bookAmt);
      }
        this.inititationForm.controls.facilityDetailsSection.get('bookingAmount').setValidators
      ([validateBookingAmountWithBGAndLimAvlblAmount(this.inititationForm.controls.facilityDetailsSection.get('bookingAmount'),
      this.inititationForm.controls.facilityDetailsSection.get('limitOutstandingAmount'))]);
    });
    }
  }

  // validate BG amount with limit amount
  validateBGAmount() {
    if (this.commonService.isValidateTnxAmtWithLimitAmt() === true) {
      const limAvlblAmt = this.inititationForm.get('facilityDetailsSection').get('limitOutstandingAmount').value;
      if (this.inititationForm.get('facilityDetailsSection') &&
      this.inititationForm.get('facilityDetailsSection').get('limitOutstandingAmount') && limAvlblAmt !== '' &&
      limAvlblAmt !== null && limAvlblAmt !== undefined) {
          this.inititationForm.controls.amountDetailsSection.get('bgAmt').setValidators
        ([validateTnxAndLimAvlblAmount(this.inititationForm.controls.facilityDetailsSection.get('limitOutstandingAmount'),
        this.inititationForm.controls.amountDetailsSection.get('bgAmt'))]);
          this.inititationForm.controls.amountDetailsSection.get('bgAmt').updateValueAndValidity();
      }
    }
  }


  checkIsTemplateUnique() {
    if ((this.inititationForm.controls.generaldetailsSection.get('templateId') !== undefined
      && this.inititationForm.controls.generaldetailsSection.get('templateId').value !== '')) {
      const templateId = this.inititationForm.controls.generaldetailsSection.get('templateId').value;
      this.translate.get('PROGRESSBAR_MSG_TEMPLATE', { templateId }).subscribe((value: string) => {
        this.actionsComponent.displayMessage = value;
      });
      this.actionsComponent.showProgressBar = true;
      const subProductCode = this.inititationForm.controls.generaldetailsSection.get('subProductCode').value;
      this.iuService.isTemplateUnique(templateId, this.iuCommonDataService.getProductCode(), subProductCode).subscribe(data => {
        this.responseMessage = data.message;
        if (data.message === Constants.STRING_FALSE) {
          this.actionsComponent.showProgressBar = false;
          this.actionsComponent.openDialog(Constants.OPERATION_OVERWRITE_TEMPLATE);
        } else {
          this.saveTemplate();
        }
      });
    } else {
      this.displayErrorDialog = true;
      this.translate.get('ERROR_TITLE').subscribe((value: string) => {
        this.errorTitle = value;
      });
      this.translate.get('mandatoryTemplateFieldError').subscribe((value: string) => {
        this.errorMessage = value;
      });
    }
  }
  saveTemplate() {
    this.actionsComponent.showProgressBar = true;
    this.showForm = false;
    this.submitted = true;
    this.transformToIssuedUndertaking();
    this.iuService.saveOrSubmitIUTemplate(this.contextPath + URLConstants.IU_TEMPLATE,
      this.issuedundertaking).subscribe(
        data => {
          this.responseMessage = data.message;
          this.responseService.setResponseMessage(data.message);
          this.responseService.setOption(Constants.OPTION_SAVE_TEMPLATE);
          this.router.navigate(['submitOrSave']);
        }
      );
  }

  validateFormOnReturn(): string | undefined {
    const comments = this.inititationForm.controls.commentsForm.get('returnComments');
    comments.setValidators([Validators.required, validateSwiftCharSet(Constants.Z_CHAR)]);
    comments.updateValueAndValidity();
    this.returnFormValid = true;
    if (!comments.valid) {
      comments.markAsTouched();
      this.returnFormValid = false;
      return this.validationService.validateField(comments);
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
          // If Reauth is enabled and if Reauth is failed , then we are showing Alert Pop up for Failure
          // else set Response data and navigate the page
          if (this.enableReauthPopup && data.response === Constants.RESPONSE_REAUTH_FAILURE) {
            this.actionsComponent.showProgressBar = false;
            this.reauthDialogComponent.onReauthSubmitCompletion(data.response);
          } else {
            this.commonService.setResponseData(data);
            this.router.navigate(['submitOrSave']);
          }
        }
      );
  }

  openPreview() {
    const host = window.location.origin;
    let url = host + this.commonService.getBaseServletUrl();
    url += Constants.PREVIEW_POPUP_SCREEN;
    url += `/?option=FULL&referenceid=${this.iuCommonDataService.getRefId()}`;
    url += `&tnxid=${this.iuCommonDataService.getTnxId()}`;
    url += `&productcode=${this.iuCommonDataService.getProductCode()}`;
    const myWindow = window.open(url, Constants.TRANSACTION_POPUP, 'width=800,height=500,resizable=yes,scrollbars=yes');
    myWindow.focus();
  }


  handleEvents(operation) {
    this.operation = operation;

    if (operation === Constants.OPERATION_SAVE) {
      this.onSave();
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
    } else if (operation === Constants.OPERATION_SUBMIT && this.mode !== Constants.MODE_UNSIGNED) {
      this.validateForm();
      this.validateLS();
      if ((this.inititationForm.valid && this.licenseValidError === undefined) && this.commonService.getReauthEnabled()) {
        this.transformToIssuedUndertaking();
        this.enableReauthPopup = this.commonService.getReauthEnabled();
        this.showReauthPopup(Constants.OPERATION_SUBMIT);
      } else if (this.inititationForm.valid && this.licenseValidError === undefined) {
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
    } else if (operation === Constants.OPERATION_TEMPLATE) {
      this.checkIsTemplateUnique();
    } else if (operation === Constants.OPERATION_OVERWRITE_TEMPLATE) {
      this.saveTemplate();
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

  transformToIssuedUndertaking() {
    // To fetch all control values i.e. including the fields which are disabled druing toggling
    this.rawValuesForm = new UntypedFormGroup({});
    Object.assign(this.rawValuesForm, this.inititationForm.getRawValue());
    this.issuedundertaking = new IssuedUndertakingRequest();
    this.issuedundertaking.tnxTypeCode = '01';
    this.issuedundertaking.tnxId = this.rawValuesForm[Constants.SECTION_GENERAL_DETAILS].tnxId;
    if (this.rawValuesForm[Constants.SECTION_ALT_APPLICANT_DETAILS]) {
      this.rawValuesForm[Constants.SECTION_ALT_APPLICANT_DETAILS].forAccount = this.iuCommonDataService
      .getCheckboxFlagValues(this.rawValuesForm[Constants.SECTION_ALT_APPLICANT_DETAILS].forAccount);
    }
    this.rawValuesForm[Constants.SECTION_AMOUNT_DETAILS].bgConsortium = this.iuCommonDataService
      .getCheckboxFlagValues(this.rawValuesForm[Constants.SECTION_AMOUNT_DETAILS].bgConsortium);
    this.rawValuesForm[Constants.SECTION_GENERAL_DETAILS].bgTransferIndicator = this.iuCommonDataService
      .getCheckboxFlagValues(this.rawValuesForm[Constants.SECTION_GENERAL_DETAILS].bgTransferIndicator);
    if (this.iuCommonDataService.getExpDateType() === '02') {
      this.rawValuesForm[Constants.SECTION_RENEWAL_DETAILS].bgRenewFlag = this.iuCommonDataService
        .getCheckboxFlagValues(this.rawValuesForm[Constants.SECTION_RENEWAL_DETAILS].bgRenewFlag);
      this.rawValuesForm[Constants.SECTION_RENEWAL_DETAILS].bgAdviseRenewalFlag = this.iuCommonDataService
        .getCheckboxFlagValues(this.rawValuesForm[Constants.SECTION_RENEWAL_DETAILS].bgAdviseRenewalFlag);
      this.rawValuesForm[Constants.SECTION_RENEWAL_DETAILS].bgRollingRenewalFlag = this.iuCommonDataService
        .getCheckboxFlagValues(this.rawValuesForm[Constants.SECTION_RENEWAL_DETAILS].bgRollingRenewalFlag);
      this.issuedundertaking.merge(this.rawValuesForm[Constants.SECTION_RENEWAL_DETAILS]);
    }
    this.rawValuesForm[Constants.SECTION_BANK_DETAILS].leadBankFlag = this.iuCommonDataService
      .getCheckboxFlagValues(this.rawValuesForm[Constants.SECTION_BANK_DETAILS].leadBankFlag);
    this.issuedundertaking.merge(this.rawValuesForm[Constants.SECTION_GENERAL_DETAILS]);
    this.issuedundertaking.merge(this.rawValuesForm[Constants.SECTION_APPLICANT_DETAILS]);
    this.issuedundertaking.merge(this.rawValuesForm[Constants.SECTION_ALT_APPLICANT_DETAILS]);
    this.issuedundertaking.merge(this.rawValuesForm[Constants.SECTION_BENEFICIARY_DETAILS]);
    if (this.customerReference !== null && this.customerReference !== ''
    && this.rawValuesForm[Constants.SECTION_FACILITY_DETAILS] != null) {
      this.issuedundertaking.mergeFacilityDetails(this.rawValuesForm[Constants.SECTION_FACILITY_DETAILS]);
    }
    this.issuedundertaking.merge(this.rawValuesForm[Constants.SECTION_UNDERTAKING_GENERAL_DETAILS]);
    this.issuedundertaking.merge(this.rawValuesForm[Constants.SECTION_AMOUNT_DETAILS]);
    if (this.iuCommonDataService.getSubProdCode() === Constants.STAND_BY) {
      this.issuedundertaking.bgCrAvlByCode = this.rawValuesForm[Constants.SECTION_PAYMENT_DETAILS].bgCrAvlByCode;
      this.issuedundertaking.mergeCreditAvlWithBankDetails(this.rawValuesForm[Constants.SECTION_PAYMENT_DETAILS],
        'bg', this.iuCommonDataService);
      this.issuedundertaking.merge(this.rawValuesForm[Constants.SECTION_SHIPMENT_DETAILS]);
    }
    this.issuedundertaking.merge(this.rawValuesForm[Constants.SECTION_UNDERTAKING_DETAILS]);
    if (this.inititationForm.get(Constants.SECTION_INCR_DECR).get(`bgVariationType`).value) {
      this.issuedundertaking.mergeVariationDetails(this.rawValuesForm[Constants.SECTION_INCR_DECR], this.iuCommonDataService);
    }
    this.issuedundertaking.provisionalStatus = this.iuCommonDataService
      .getCheckboxFlagValues(this.rawValuesForm[Constants.SECTION_GENERAL_DETAILS].provisionalStatus);
    this.issuedundertaking.merge(this.rawValuesForm[Constants.SECTION_CONTRACT_DETAILS]);
    this.issuedundertaking.merge(this.rawValuesForm[Constants.SECTION_BANK_INSTR]);
    this.issuedundertaking.mergeBankDetailsSection(this.rawValuesForm[Constants.SECTION_BANK_DETAILS], this.iuCommonDataService);
    if (this.rawValuesForm[Constants.SECTION_LICENSE].listOfLicenses !== '') {
      this.issuedundertaking.mergeLicensesSection(this.rawValuesForm[Constants.SECTION_LICENSE]);
    }
    this.issuedundertaking.merge(this.rawValuesForm[Constants.SECTION_FILE_UPLOAD]);
    if (this.rawValuesForm[Constants.SECTION_GENERAL_DETAILS].purpose &&
      (Constants.cuPurposeList.includes(this.rawValuesForm[Constants.SECTION_GENERAL_DETAILS].purpose))
        && this.iuCommonDataService.displayLUSection()) {
      this.rawValuesForm[Constants.SECTION_CU_AMOUNT_DETAILS].cuConsortium = this.iuCommonDataService
        .getCheckboxFlagValues(this.rawValuesForm[Constants.SECTION_CU_AMOUNT_DETAILS].cuConsortium);
      this.rawValuesForm[Constants.SECTION_CU_GENERAL_DETAILS].cuTransferIndicator = this.iuCommonDataService
        .getCheckboxFlagValues(this.rawValuesForm[Constants.SECTION_CU_GENERAL_DETAILS].cuTransferIndicator);

      if ((this.iuCommonDataService.getCUExpDateType() === '02' || this.iuCommonDataService.getCUExpDateType() === '')) {
        this.rawValuesForm[Constants.SECTION_CU_RENEWAL_DETAILS].cuRenewFlag = this.iuCommonDataService
          .getCheckboxFlagValues(this.rawValuesForm[Constants.SECTION_CU_RENEWAL_DETAILS].cuRenewFlag);
        this.rawValuesForm[Constants.SECTION_CU_RENEWAL_DETAILS].cuAdviseRenewalFlag = this.iuCommonDataService
          .getCheckboxFlagValues(this.rawValuesForm[Constants.SECTION_CU_RENEWAL_DETAILS].cuAdviseRenewalFlag);
        this.rawValuesForm[Constants.SECTION_CU_RENEWAL_DETAILS].cuRollingRenewalFlag = this.iuCommonDataService
          .getCheckboxFlagValues(this.rawValuesForm[Constants.SECTION_CU_RENEWAL_DETAILS].cuRollingRenewalFlag);
        this.issuedundertaking.merge(this.rawValuesForm[Constants.SECTION_CU_RENEWAL_DETAILS]);
      }
      if (this.iuCommonDataService.getCUSubProdCode() === Constants.STAND_BY) {
        this.issuedundertaking.cuCrAvlByCode = this.rawValuesForm[Constants.SECTION_CU_PAYMENT_DETAILS].cuCrAvlByCode;
        this.issuedundertaking.mergeCreditAvlWithBankDetails(this.rawValuesForm[Constants.SECTION_CU_PAYMENT_DETAILS],
                                                            'cu', this.iuCommonDataService);
      }
      this.issuedundertaking.merge(this.rawValuesForm[Constants.SECTION_CU_GENERAL_DETAILS]);
      this.issuedundertaking.mergeCuBankDetailsSection(this.rawValuesForm[Constants.SECTION_BANK_DETAILS]);
      this.issuedundertaking.mergeCuBeneficiaryAndContactDetails(this.rawValuesForm[Constants.SECTION_CU_BENEFICIARY]);
      this.issuedundertaking.merge(this.rawValuesForm[Constants.SECTION_CU_AMOUNT_DETAILS]);
      this.issuedundertaking.merge(this.rawValuesForm[Constants.SECTION_CU_UNDERTAKING_DETAILS]);
      if (this.inititationForm.get(Constants.SECTION_CU_INCR_DECR).get(`cuVariationType`).value) {
        this.issuedundertaking.mergeCuVariationDetails(this.rawValuesForm[Constants.SECTION_CU_INCR_DECR], this.iuCommonDataService);
      }
    }
    if (this.rawValuesForm[Constants.SECTION_GENERAL_DETAILS].purpose === '01') {
      this.setCounterUndertakingSection();
    }
    this.issuedundertaking.applicantReference = this.rawValuesForm[Constants.SECTION_BANK_DETAILS].recipientBankCustomerReference;
    this.issuedundertaking.attids = this.iuCommonDataService.getAttIds();
    if (this.iuCommonDataService.getIsFromBankTemplateOption() ||
     (this.jsonContent.guaranteeTypeName != null && this.jsonContent.guaranteeTypeName !== '')) {
    this.issuedundertaking.guaranteeTypeName = this.jsonContent.guaranteeTypeName;
    this.issuedundertaking.guaranteeTypeCompanyId = this.jsonContent.guaranteeTypeCompanyId;
    if (this.iuCommonDataService.isEditorTemplate) {
      this.issuedundertaking.bgTextDetailsCode = '02';
     }
    }
    if (this.commonService.getTnxToDoListId() != null && this.commonService.getTnxToDoListId() !== '' ) {
      this.issuedundertaking.todoListId = this.commonService.getTnxToDoListId();
    }
  }

  setCounterUndertakingSection() {
    if (this.rawValuesForm[Constants.SECTION_CU_GENERAL_DETAILS] &&
      this.rawValuesForm[Constants.SECTION_CU_GENERAL_DETAILS] !== null) {
      this.issuedundertaking.merge(this.rawValuesForm[Constants.SECTION_CU_GENERAL_DETAILS]);
    }
    if (this.rawValuesForm[Constants.SECTION_BANK_DETAILS] &&
      this.rawValuesForm[Constants.SECTION_BANK_DETAILS] !== null) {
      this.issuedundertaking.mergeCuBankDetailsSection(this.rawValuesForm[Constants.SECTION_BANK_DETAILS]);
    }
    if (this.rawValuesForm[Constants.SECTION_CU_BENEFICIARY] &&
      this.rawValuesForm[Constants.SECTION_CU_BENEFICIARY] !== null) {
      this.issuedundertaking.mergeCuBeneficiaryAndContactDetails(this.rawValuesForm[Constants.SECTION_CU_BENEFICIARY]);
    }
    if (this.rawValuesForm[Constants.SECTION_CU_AMOUNT_DETAILS] &&
      this.rawValuesForm[Constants.SECTION_CU_AMOUNT_DETAILS] !== null) {
      this.issuedundertaking.merge(this.rawValuesForm[Constants.SECTION_CU_AMOUNT_DETAILS]);
    }
    if (this.rawValuesForm[Constants.SECTION_CU_UNDERTAKING_DETAILS] &&
      this.rawValuesForm[Constants.SECTION_CU_UNDERTAKING_DETAILS] !== null) {
      this.issuedundertaking.merge(this.rawValuesForm[Constants.SECTION_CU_UNDERTAKING_DETAILS]);
    }
    if (this.rawValuesForm[Constants.SECTION_CU_INCR_DECR] &&
      this.rawValuesForm[Constants.SECTION_CU_INCR_DECR] !== null &&
      this.inititationForm.get(Constants.SECTION_CU_INCR_DECR).get(`cuVariationType`).value) {
      this.issuedundertaking.mergeCuVariationDetails(this.rawValuesForm[Constants.SECTION_CU_INCR_DECR], this.iuCommonDataService);
    }
    this.issuedundertaking.cuCrAvlByCode = '';
    if (this.rawValuesForm[Constants.SECTION_CU_PAYMENT_DETAILS] &&
      this.rawValuesForm[Constants.SECTION_CU_PAYMENT_DETAILS] !== null &&
      this.iuCommonDataService.getCUSubProdCode() === Constants.STAND_BY) {
      this.issuedundertaking.mergeCreditAvlWithBankDetails(this.rawValuesForm[Constants.SECTION_CU_PAYMENT_DETAILS],
        Constants.UNDERTAKING_TYPE_CU, this.iuCommonDataService);
    }
    if (this.rawValuesForm[Constants.SECTION_CU_RENEWAL_DETAILS] &&
      this.rawValuesForm[Constants.SECTION_CU_RENEWAL_DETAILS] !== null &&
      (this.iuCommonDataService.getCUExpDateType() === '02' || this.iuCommonDataService.getCUExpDateType() === '')) {
      this.issuedundertaking.merge(this.rawValuesForm[Constants.SECTION_CU_RENEWAL_DETAILS]);
    }
  }

  validateAllFields(mainForm: UntypedFormGroup) {
    mainForm.markAllAsTouched();
    const format = this.commonService.getUserLanguage() === Constants.LANGUAGE_US ? Constants.DATE_FORMAT : Constants.DATE_FORMAT_DMY;
    const currentDate = this.datePipe.transform(new Date(), format);

    const counterDateFields: string[] = ['bgExpDate', 'bgApproxExpiryDate', 'bgFinalExpiryDate', 'bgRenewalCalendarDate'];
    const luDateFields: string[] = ['cuApproxExpiryDate', 'cuExpDate', 'cuFinalExpiryDate', 'cuRenewalCalendarDate'];

    for (const index of counterDateFields) {
      if ((index === 'bgExpDate' || index === 'bgApproxExpiryDate') &&
      mainForm.get('generaldetailsSection').get('subProductCode').value === Constants.STAND_BY) {
        mainForm.get('undertakingGeneralDetailsSection').get(index).setValidators(validateWithCurrentDate(currentDate,
          (index === 'bgExpDate' && this.inititationForm.controls.undertakingGeneralDetailsSection
          .get('bgExpDateTypeCode').value === '02') ? true : false));
        if (mainForm.get('shipmentDetailsSection').get('lastShipDate').value !== '' &&
            mainForm.get('shipmentDetailsSection').get('lastShipDate').value !== null) {
            mainForm.get('undertakingGeneralDetailsSection').get(index).setValidators(validateDates(
            mainForm.get('undertakingGeneralDetailsSection').get(index), mainForm.get('shipmentDetailsSection').get('lastShipDate'),
            'Expiry Date', 'Last Shipment Date', 'lesserThan'));
          }
        mainForm.get('undertakingGeneralDetailsSection').get(index).updateValueAndValidity();
      }
      else if (mainForm.get('shipmentDetailsSection').get('earliestShipDate').value !== '' &&
      mainForm.get('shipmentDetailsSection').get('earliestShipDate').value !== null){
        mainForm.get('undertakingGeneralDetailsSection').get(index).setValidators(validateDates(
          mainForm.get('undertakingGeneralDetailsSection').get(index), mainForm.get('shipmentDetailsSection').get('earliestShipDate'),
          'Expiry Date', 'Earliest Shipment Date', 'lesserThan'));
      }
      else if (index === 'bgExpDate' || index === 'bgApproxExpiryDate') {
          mainForm.get('undertakingGeneralDetailsSection').get(index).clearValidators();
          mainForm.get('undertakingGeneralDetailsSection').get(index).setValidators(validateWithCurrentDate(currentDate,
            (index === 'bgExpDate' && this.inititationForm.controls.undertakingGeneralDetailsSection
            .get('bgExpDateTypeCode').value === '02') ? true : false));
          mainForm.get('undertakingGeneralDetailsSection').get(index).updateValueAndValidity();
      } else if (index === 'renewalCalendarDate' && mainForm.get(Constants.SECTION_RENEWAL_DETAILS).get('bgRenewFlag').value === 'Y') {
        mainForm.get(Constants.SECTION_RENEWAL_DETAILS).get(index).setValidators(validateWithCurrentDate(currentDate,
          index === 'renewalCalendarDate' ? true : false));
        mainForm.get(Constants.SECTION_RENEWAL_DETAILS).get(index).updateValueAndValidity();
      }
    }

    if (this.iuCommonDataService.displayLUSection()) {
      for (const luIndex of luDateFields) {
        if (luIndex === 'cuApproxExpiryDate' || luIndex === 'cuExpDate') {
          mainForm.get(Constants.SECTION_CU_GENERAL_DETAILS).get(luIndex).setValidators(validateWithCurrentDate(currentDate,
            (luIndex === 'cuExpDate' && this.inititationForm.controls
              .cuGeneraldetailsSection.get('cuExpDateTypeCode').value === '02') ? true : false));
          mainForm.get(Constants.SECTION_CU_GENERAL_DETAILS).get(luIndex).updateValueAndValidity();
        } else if (luIndex === 'cuRenewalCalendarDate' &&
          mainForm.get(Constants.SECTION_CU_RENEWAL_DETAILS).get('cuRenewFlag').value === 'Y') {
          mainForm.get(Constants.SECTION_CU_RENEWAL_DETAILS).get(luIndex).setValidators(validateWithCurrentDate(currentDate,
            luIndex === 'cuRenewalCalendarDate' ? true : false));
          mainForm.get(Constants.SECTION_CU_RENEWAL_DETAILS).get(luIndex).updateValueAndValidity();
        }
      }
    }

    if (!this.inititationForm.valid) {
      this.findInvalidField();
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
  }

  resetLUForms(resetLUReq) {
    const array = resetLUReq.split(',');
    const isResetLU = array[0];

    if (isResetLU === 'true') {
      this.inititationForm.controls.cuGeneraldetailsSection.reset();
      this.inititationForm.controls.cuBeneficaryDetailsSection.reset();
      this.inititationForm.controls.cuAmountDetailsSection.reset();
      this.inititationForm.controls.cuRenewalDetailsSection.reset();
      this.inititationForm.controls.cuUndertakingDetailsForm.reset();

      this.inititationForm.controls.cuGeneraldetailsSection.patchValue({
        cuSubProductCode: '', cuConfInstructions: '', cuTransferIndicator: '',
        narrativeTransferConditionsCu: '', cuTypeCode: '', cuTypeDetails: '',
        cuEffectiveDateTypeCode: '', cuEffectiveDateTypeDetails: '', cuExpDateTypeCode: '',
        cuExpDate: '', cuApproxExpiryDate: '', cuExpEvent: ''
      });
      this.inititationForm.controls.cuBeneficaryDetailsSection.patchValue({
        cuBeiCode: '', cuBeneficiaryName: '', cuBeneficiaryAddressLine1: '', cuBeneficiaryAddressLine2: '',
        cuBeneficiaryDom: '', cuBeneficiaryAddressLine4: '', cuBeneficiaryCountry: '',
        cuBeneficiaryReference: '', cuBeneficiaryContact: '', cuContactName: '',
        cuContactAddressLine1: '', cuContactAddressLine2: '', cuContactDom: '',
        cuContactAddressLine4: ''
      });
      this.inititationForm.controls.cuAmountDetailsSection.patchValue({
        cuCurCode: '', cuAmt: '', cuTolerancePositivePct: '',
        cuToleranceNegativePct: '', cuNarrativeAdditionalAmount: '', cuConsortium: '',
        cuConsortiumDetails: '', cuNetExposureCurCode: '', cuNetExposureAmt: '',
        cuOpenChrgBorneByCode: '', cuCorrChrgBorneByCode: '', cuConfChrgBorneByCode: ''
      });
      this.inititationForm.controls.cuUndertakingDetailsForm.patchValue({
        cuRule: '', cuRuleOther: '', cuDemandIndicator: '',
        cuGovernCountry: '', cuGovernText: '', cuGovernCountrySubdiv: '', cuTextTypeCode: '',
        cuTextTypeDetails: '', cuTextLanguage: '', cuTextLanguageOther: '',
        cuNarrativeUndertakingTermsAndConditions: '', cuNarrativeUnderlyingTransactionDetails: '', cuNarrativePresentationInstructions: ''
      });
      if (this.inititationForm.get(Constants.SECTION_CU_INCR_DECR).get(`cuVariationType`).value) {
        this.inititationForm.controls.cuRedIncForm.patchValue({
          cuVariationType: '', cuAdviseEventFlag: '',
          cuAdviseDaysPriorNb: '', cuMaximumNbVariation: '', cuVariationFrequency: '',
          cuVariationPeriod: '', cuVariationDayInMonth: '', cuVariationsLists: ''
        });
      }
      if (this.iuCommonDataService.getCUSubProdCode() === Constants.STAND_BY) {
        this.inititationForm.controls.cuPaymentDetailsForm.patchValue({
          cuCreditAvailableWithBank: '', cuCrAvlByCode: ''
        });
      }
      if ((this.iuCommonDataService.getCUExpDateType() === '02' || this.iuCommonDataService.getCUExpDateType() === '')) {
        this.inititationForm.controls.cuRenewalDetailsSection.patchValue({
          cuRenewalType: '', cuRenewFlag: '', cuRenewOnCode: '',
          cuRenewalCalendarDate: '', cuRenewForNb: '', cuRenewForPeriod: '',
          cuAdviseRenewalFlag: '', cuAdviseRenewalDaysNb: '', cuRollingRenewalFlag: '',
          cuRollingRenewOnCode: '', cuRollingRenewForNb: '', cuRollingRenewForPeriod: '',
          cuRollingDayInMonth: '', cuRollingRenewalNb: '', cuRollingCancellationDays: '',
          cuNarrativeCancellation: '', cuRenewAmtCode: '', cuFinalExpiryDate: ''
        });
      }
      this.inititationForm.updateValueAndValidity();
    }
  }

  setLUStatus(luStatus) {
    this.luStatus = luStatus;
    this.beneficiaryDetailsComponent.setValidationsOnBeneFields(!luStatus);
    if (luStatus) {
      this.iuCommonDataService.setBeneMandatoryVal(false);
    } else {
      this.iuCommonDataService.setBeneMandatoryVal(true);
    }
    if (this.iuGeneraldetailsChildComponent.generaldetailsSection.get('advSendMode') &&
        this.iuGeneraldetailsChildComponent.generaldetailsSection.get('advSendMode') !== null &&
        this.iuGeneraldetailsChildComponent.generaldetailsSection.get('purpose').value !== '01') {
      this.setValidatorsForCounterSections(this.iuGeneraldetailsChildComponent.generaldetailsSection.get('advSendMode').value === '01');
    }
  }
  resetRenewalSection(undertakingType) {
    if (this.renewalDetailsComponent && undertakingType === Constants.UNDERTAKING_TYPE_IU) {
      this.renewalDetailsComponent.ngOnInit();
    } else if (this.cuRenewalDetailsChildComponent && undertakingType === Constants.UNDERTAKING_TYPE_CU) {
        this.cuRenewalDetailsChildComponent.ngOnInit();
    }
  }
  setExpiryDateForExtension(expiryDateExt) {
    if (expiryDateExt !== '' && expiryDateExt !== null) {
      const undertakingType = expiryDateExt.split(',')[1];
      if (this.renewalDetailsComponent && undertakingType === Constants.UNDERTAKING_TYPE_IU) {
        this.renewalDetailsComponent.commonRenewalDetails.setFinalExpiryDate(undertakingType);
     } else if ( this.renewalDetailsComponent && undertakingType === Constants.UNDERTAKING_TYPE_CU) {
        this.cuRenewalDetailsChildComponent.commonRenewalDetailsComponent.setFinalExpiryDate(undertakingType);
     }
    }
   }

  reloadApplicantDetails(reloadApplicantSection) {
    if (reloadApplicantSection) {
      this.applicantDetailsComponent.ngOnInit();
    } else if ((this.inititationForm.controls.applicantDetailsFormSection.get('entity') &&
      this.inititationForm.controls.applicantDetailsFormSection.get('entity').value !== undefined) && (
        this.inititationForm.controls.applicantDetailsFormSection.get('entity').value !== this.commonData.getEntity())) {
      this.applicantDetailsComponent.clearApplicantDetailsSection(true);
    }
  }

  updateBankDetails() {
    this.bankDetailsComponent.commonBankDetailsComponent.ngOnInit();
  }

  setConfInstValue(value) {
    this.bankDetailsComponent.commonBankDetailsComponent.checkConfirmingBankMandatory(value);
    this.amountDetailsChildComponent.commonAmountDetailsChildComponent.checkConfirmingChargeManadatory(value);
  }

  setCuConfInstValue(value) {
    this.cuAmountDetailsChildComponent.commonAmountDetailsChildComponent.checkCuConfirmingChargeManadatory(value);
  }
  onChangeSubProductCode(value) {
    this.amountDetailsChildComponent.commonAmountDetailsChildComponent.onChangeSubProductCode(value);
    this.undertakingGeneralDetailsChildComponent.commonGeneralDetailsChildComponent.onChangeSubProdCode('bg');
    if (this.iuPaymentDetailsComponent) {
      this.iuPaymentDetailsComponent.ngOnInit();
    }
    if (this.iuFacilityDetailsComponent) {
      this.iuFacilityDetailsComponent.clearValuesOnSubProdChange();
    }
  }

  onChangeIssuerRef(value) {
    this.customerReference = value;
    let facilityDetails = null;
    let facilityReferenceDetails = null;
    this.facilityVisible = false;
    this.iuService.getDefaultValuesJsonService(this.actionCode).subscribe(data => {
      if (data && data != null && data.bg_tnx_record && data.bg_tnx_record.facilityDetails &&
        data.bg_tnx_record.facilityDetails.facilityReferenceDetails &&
        data.bg_tnx_record.facilityDetails.facilityReferenceDetails.length !== 0) {
          this.jsonContent = data.bg_tnx_record as string[];
          facilityDetails = this.jsonContent.facilityDetails;
          facilityReferenceDetails = facilityDetails.facilityReferenceDetails;
          facilityReferenceDetails[0].boReference.forEach(boref => {
              if (boref.custRef === this.customerReference) {
                this.facilityVisible = true;
                }
          });
        }
      if (this.facilityVisible === false && !this.viewMode) {
          this.inititationForm.controls.facilityDetailsSection.reset();
      }
      if (this.iuFacilityDetailsComponent) {
          this.iuFacilityDetailsComponent.ngOnInit();
      }
    });
  }

  showReauthPopup(operation) {
    const entity = this.inititationForm.get(Constants.SECTION_APPLICANT_DETAILS).get('entity').value;
    const currency = this.inititationForm.get('amountDetailsSection').get('bgCurCode').value;
    const amount = this.inititationForm.get('amountDetailsSection').get('bgAmt').value;
    const subProdCode = this.inititationForm.get('generaldetailsSection').get('subProductCode').value;
    const bank = 'DEMOBANK';
    const reauthParams = new Map();
    reauthParams.set('productCode', Constants.PRODUCT_CODE_IU);
    reauthParams.set('subProductCode', subProdCode);
    reauthParams.set('tnxTypeCode', '01');
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
    this.issuedundertaking.clientSideEncryption = this.inititationForm.controls.reauthForm.get('clientSideEncryption').value;
    this.issuedundertaking.reauthPassword = this.inititationForm.controls.reauthForm.get('reauthPassword').value;
    this.issuedundertaking.reauthPerform = this.inititationForm.controls.reauthForm.get('reauthPerform').value;
    if (this.operation === Constants.OPERATION_SUBMIT && this.mode !== Constants.MODE_UNSIGNED) {
      this.onSubmit();
    } else if (this.operation === Constants.OPERATION_SUBMIT && this.mode === Constants.MODE_UNSIGNED) {
      this.onSubmitRetrieveUnsigned();
    } else if (this.operation === Constants.OPERATION_RETURN) {
      this.onReturn();
    }
  }

  validateForm() {
    this.validateAllFields(this.inititationForm);
  }
  onCancel() {
    const host = window.location.origin;
    const url = host + this.commonService.getBaseServletUrl() + Constants.IU_LANDING_SCREEN;
    window.location.replace(url);
    this.auditService.audit().subscribe(
      data => {
      }
    );
  }

  closeWindow() {
    window.close();
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
    if (this.iuGeneraldetailsChildComponent) {
      this.iuGeneraldetailsChildComponent.generatePdf(this.generatePdfService);
    }
    if (this.iuCommonDataService.getPreviewOption() !== 'SUMMARY') {
      if (this.applicantDetailsComponent) {
        this.applicantDetailsComponent.generatePdf(this.generatePdfService);
      }
      if (this.applicantDetailsComponent.altApplicantDetails) {
        this.applicantDetailsComponent.altApplicantDetails.generatePdf(this.generatePdfService);
      }
      if (this.beneficiaryDetailsComponent) {
        this.beneficiaryDetailsComponent.generatePdf(this.generatePdfService);
      }
      if (this.bankDetailsComponent) {
        this.bankDetailsComponent.generatePdf(this.generatePdfService);
      }
      if (this.undertakingGeneralDetailsChildComponent) {
        this.undertakingGeneralDetailsChildComponent.generatePdf(this.generatePdfService);
      }
      if (this.amountDetailsChildComponent) {
        this.amountDetailsChildComponent.generatePdf(this.generatePdfService);
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
      if (this.shipmentDetailsComponent) {
        this.shipmentDetailsComponent.generatePdf(this.generatePdfService);
      }
      if (this.iuFacilityDetailsComponent) {
        this.iuFacilityDetailsComponent.generatePdf(this.generatePdfService);
      }
      if (this.contractDetailsComponent) {
        this.contractDetailsComponent.generatePdf(this.generatePdfService);
      }

      if (this.undertakingChildComponent) {
        this.undertakingChildComponent.generatePdf(this.generatePdfService);
      }
      if (this.iuCommonDataService.displayLUSection()) {
        if (this.luGeneraldetailsChildComponent) {
          this.luGeneraldetailsChildComponent.generatePdf(this.generatePdfService);
        }
        if (this.cuBeneficaryDetailsChildComponent) {
          this.cuBeneficaryDetailsChildComponent.generatePdf(this.generatePdfService);
        }
        if (this.cuAmountDetailsChildComponent) {
          this.cuAmountDetailsChildComponent.generatePdf(this.generatePdfService);
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
      if (this.bankInstructionsComponent) {
        this.bankInstructionsComponent.generatePdf(this.generatePdfService);
      }
    }
    if (this.iuLicenseComponent) {
      this.iuLicenseComponent.generatePdf(this.generatePdfService);
    }
    if (this.iuCommonReturnCommentsComponent && this.jsonContent.returnComments && this.jsonContent.returnComments !== '' &&
      this.jsonContent.returnComments !== null) {
      this.iuCommonReturnCommentsComponent.generatePdf(this.generatePdfService);
    }
    if (this.iuCommonDataService.getmasterorTnx() === 'master') {
      this.generatePdfService.saveFile(this.jsonContent.refId, '');
    } else {
      this.generatePdfService.saveFile(this.jsonContent.refId, this.jsonContent.tnxId);
    }
  }
  validateLS() {
    this.licenseValidError = undefined;
    if (this.iuLicenseComponent.uploadFile.licenseMap.length > 0) {
      let sum = 0;
      for (const value of this.iuLicenseComponent.uploadFile.licenseMap) {
        const amt: number = parseFloat(this.commonService.getNumberWithoutLanguageFormatting(value.lsAllocatedAmt));
        if (amt > 0) {
          sum = sum + amt;
        } else {
          this.licenseValidError = 'ERROR_ZERO_LS_AMT';
          break;
        }
      }

      if (this.licenseValidError === undefined && sum !== parseFloat(
        this.commonService.getNumberWithoutLanguageFormatting(this.amountDetailsChildComponent.amountDetailsSection.get('bgAmt').value))) {
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
        key: 'linkedLicenseErrorDialog',
        rejectVisible: false,
        acceptLabel: this.commonService.getTranslation('USER_ACTION_OK'),
        accept: () => { }
      });
    }

  }


  public clearVariationAmtValidations(isTnxCurCodeAmtNullAndUndetakingType: string) {
    if (isTnxCurCodeAmtNullAndUndetakingType !== '' && isTnxCurCodeAmtNullAndUndetakingType !== null) {
      const undertakingType = isTnxCurCodeAmtNullAndUndetakingType.split(',')[1];
      if (undertakingType === Constants.UNDERTAKING_TYPE_IU && this.reductionIncreaseComponent &&
      this.inititationForm.get(Constants.SECTION_INCR_DECR).get('bgVariationType').value) {
          this.reductionIncreaseComponent.commonReductionIncreaseChildComponent.validateForNullTnxAmtCurrencyField();
          this.reductionIncreaseComponent.commonReductionIncreaseChildComponent.reCalculateVariationAmount();
    } else if (undertakingType === Constants.UNDERTAKING_TYPE_CU && this.cuReductionIncreaseComponent &&
      this.inititationForm.get(Constants.SECTION_CU_INCR_DECR).get('cuVariationType').value) {
          this.cuReductionIncreaseComponent.commonReductionIncreaseChildComponent.validateForNullTnxAmtCurrencyField();
          this.cuReductionIncreaseComponent.commonReductionIncreaseChildComponent.reCalculateVariationAmount();
    }
  }
  }

  public setVariationCurrCode(currCodeAndType: string) {
    if (currCodeAndType !== '' && currCodeAndType !== null) {
      const currCode = currCodeAndType.split(',')[0];
      const undertakingType = currCodeAndType.split(',')[1];
      let form;

      if (undertakingType === 'bg') {
        form = this.reductionIncreaseComponent;
      } else {
        form = this.cuReductionIncreaseComponent;
      }
      this.iuCommonDataService.setCurCode(currCode, undertakingType);
      form.commonReductionIncreaseChildComponent.currCode = currCode;
      const reductionForm = form.commonReductionIncreaseChildComponent.sectionForm;
      if (reductionForm.get(`${undertakingType}VariationType`).value) {
        const tnxCurCodeControl = form.commonReductionIncreaseChildComponent.
          sectionForm.parent.get(undertakingType === 'bg' ? 'amountDetailsSection' : 'cuAmountDetailsSection')
          .get(undertakingType === 'bg' ? 'bgCurCode' : 'cuCurCode');
        const irregularVariationList = form.commonReductionIncreaseChildComponent.irregularList;
        for (const entry of irregularVariationList) {
          entry.variationCurCode = currCode;
        }
        this.commonService.transformAmtAndSetValidators(reductionForm.get(undertakingType === 'bg' ? 'bgVariationAmt' : 'cuVariationAmt'),
          tnxCurCodeControl, (undertakingType === 'bg' ? 'bgVariationCurCode' : 'cuVariationCurCode'));
      }
    }
  }

  private findInvalidField() {
    const invalid = [];
    const issuingBank = [Constants.ISSUINGBANKTYPECODE, Constants.ISSUINGBANKSWIFTCODE, Constants.ISSUINGBANKNAME,
                         Constants.ISSUINGBANKADDRESSLINE1, Constants.ISSUINGBANKADDRESSLINE2, Constants.ISSUINGBANKDOM,
                         Constants.ISSUINGBANKADDRESSLINE4];
    const advisingBank = [Constants.ADVISINGSWIFTCODE, Constants.ADVISINGBANKNAME, Constants.ADVISINGBANKADDRESSLINE1,
                          Constants.ADVISINGBANKADDRESSLINE2, Constants.ADVISINGBANKDOM, Constants.ADVISINGBANKADDRESSLINE4,
                          Constants.ADVBANKCONFREQ];
    const adviseThruBank = [Constants.ADVISETHRUSWIFTCODE, Constants.ADVISETHRUBANKNAME, Constants.ADVISETHRUBANKADDRESSLINE1,
                            Constants.ADVISETHRUBANKADDRESSLINE2, Constants.ADVISETHRUBANKDOM, Constants.ADVISETHRUBANKADDRESSLINE4];
    const localAdviseThroughBank = [Constants.LOCALADVISETHROUGHSWIFTCODE,
                                    Constants.LOCALADVISETHROUGHNAME, Constants.LOCALADVISETHROUGHADDRESSLINE1,
                                    Constants.LOCALADVISETHROUGHADDRESSLINE2, Constants.LOCALADVISETHROUGHDOM,
                                    Constants.LOCALADVISETHROUGHADDRESSLINE4];
    const confirmingbank = [Constants.CONFIRMINGSWIFTCODE, Constants.CONFIRMINGBANKNAME, Constants.CONFIRMINGBANKADDRESSLINE1,
                            Constants.CONFIRMINGBANKADDRESSLINE2, Constants.CONFIRMINGBANKDOM, Constants.CONFIRMINGBANKADDRESSLINE4];
    const controls = this.inititationForm.controls[`bankDetailsSection`][`controls`];
    for (const field in controls) {
        if (controls[field].invalid) {
            invalid.push(field);
        }
    }
    if (invalid.length !== 0) {
      const issuingTabInvalid = issuingBank.some(r => invalid.indexOf(r) >= 0);
      const advisingTabInvalid = advisingBank.some(r => invalid.indexOf(r) >= 0);
      const adviseThruTabInvalid = adviseThruBank.some(r => invalid.indexOf(r) >= 0);
      const confirmingabInvalid = confirmingbank.some(r => invalid.indexOf(r) >= 0);
      const localAdviseThroughTabInvalid = localAdviseThroughBank.some(r => invalid.indexOf(r) >= 0);
      let indexNo;
      if (issuingTabInvalid) {
        indexNo = Constants.NUMERIC_ZERO;
      } else if (!issuingTabInvalid && advisingTabInvalid) {
        indexNo = Constants.NUMERIC_ONE;
      } else if (!issuingTabInvalid && !advisingTabInvalid && adviseThruTabInvalid) {
        indexNo = Constants.NUMERIC_TWO;
      } else if (!issuingTabInvalid && !advisingTabInvalid && !adviseThruTabInvalid && localAdviseThroughTabInvalid) {
        indexNo = Constants.NUMERIC_THREE;
      } else {
        indexNo = Constants.NUMERIC_FOUR;
      }
      this.bankDetailsComponent.commonBankDetailsComponent.changeActiveIndex(indexNo);
    }
  }

  setRenewalExpDate(finalRenewalExpDateAndType) {
    if (finalRenewalExpDateAndType !== '' && finalRenewalExpDateAndType !== null) {
      let finalRenewalExpDate = finalRenewalExpDateAndType.split(',')[0];
      const undertakingType = finalRenewalExpDateAndType.split(',')[1];
      if (finalRenewalExpDate !== '' && finalRenewalExpDate != null) {
        finalRenewalExpDate = this.commonService.getDateObject(finalRenewalExpDate);
      }
      if (undertakingType === Constants.UNDERTAKING_TYPE_IU) {
        this.finalRenewalExpDate = finalRenewalExpDate;
      } else {
        this.cuFinalRenewalExpDate = finalRenewalExpDate;
      }
      this.setMaxDate(undertakingType);
    }
  }

  setExpDate(expDateAndType) {
    if (expDateAndType !== '' && expDateAndType !== null) {
      let expiryDate = expDateAndType.split(',')[0];
      const undertakingType = expDateAndType.split(',')[1];
      if (expiryDate !== '' && expiryDate != null) {
        expiryDate = this.commonService.getDateObject(expiryDate);
      }
      if (undertakingType === Constants.UNDERTAKING_TYPE_IU) {
        this.expDate = expiryDate;
      } else {
        this.cuExpDate = expiryDate;
      }
      this.setMaxDate(undertakingType);
    }
  }

  setMaxDate(undertakingType: string) {
    let form ;
    let renewalExpDate;
    let expDate;
    let firstDate;
    form = this.reductionIncreaseComponent;
    if (undertakingType === Constants.UNDERTAKING_TYPE_IU && this.iuCommonDataService.getExpDateType() !== '02') {
      this.finalRenewalExpDate = '';
    } else if (undertakingType === Constants.UNDERTAKING_TYPE_CU && this.iuCommonDataService.getCUExpDateType() !== '02') {
      this.cuFinalRenewalExpDate = '';
    }
    renewalExpDate = this.finalRenewalExpDate;
    expDate = this.expDate;
    firstDate = form.redIncForm.get('bgVariationFirstDate') !== null ? form.redIncForm.get('bgVariationFirstDate').value : '';
    if (undertakingType === Constants.UNDERTAKING_TYPE_CU) {
      form = this.cuReductionIncreaseComponent;
      renewalExpDate = this.cuFinalRenewalExpDate;
      expDate = this.cuExpDate;
      firstDate = form.cuRedIncForm.get('cuVariationFirstDate') !== null ? form.cuRedIncForm.get('cuVariationFirstDate').value : '';
    }
    const renewalDetailSectionControl = this.inititationForm.get(Constants.SECTION_RENEWAL_DETAILS);
    if (undertakingType === Constants.UNDERTAKING_TYPE_IU && (renewalExpDate === undefined || renewalExpDate === '')
    && this.iuCommonDataService.getExpDateType() === '02') {
        renewalExpDate = ( renewalDetailSectionControl ? renewalDetailSectionControl.get('bgFinalExpiryDate').value : '');
        renewalExpDate = renewalExpDate !== '' ? this.commonService.getDateObject(renewalExpDate) : '';
      } else if ((renewalExpDate === undefined || renewalExpDate === '') && this.iuCommonDataService.getCUExpDateType() === '02') {
        renewalExpDate = this.inititationForm.get(Constants.SECTION_CU_RENEWAL_DETAILS) ?
        this.inititationForm.get(Constants.SECTION_CU_RENEWAL_DETAILS).get('cuFinalExpiryDate').value : '';
        renewalExpDate = renewalExpDate !== '' ? this.commonService.getDateObject(renewalExpDate) : '';
      }
    if (firstDate !== '' && firstDate != null) {
      firstDate = this.commonService.getDateObject(firstDate);
      firstDate = Date.parse(this.datePipe.transform(firstDate , Constants.DATE_FORMAT));
    }
    this.setMaximumFirstDateValidation(renewalExpDate, expDate, form, undertakingType, firstDate);
}

  setMaximumFirstDateValidation(renewalExpDate: any, expDate: any, form: any, undertakingType: string, firstDate: string) {
    if (undertakingType === Constants.UNDERTAKING_TYPE_IU && (expDate === undefined || expDate === '')) {
      expDate = this.inititationForm.get(Constants.SECTION_UNDERTAKING_GENERAL_DETAILS).get('bgExpDate').value;
      expDate = expDate !== '' ? this.commonService.getDateObject(expDate) : '';
    } else if (expDate === undefined || expDate === '') {
      expDate = this.inititationForm.get(Constants.SECTION_CU_GENERAL_DETAILS) ?
      this.inititationForm.get(Constants.SECTION_CU_GENERAL_DETAILS).get('cuExpDate').value : '';
      expDate = expDate !== '' ? this.commonService.getDateObject(expDate) : '';
    }
    const formGroup = undertakingType === Constants.UNDERTAKING_TYPE_IU ? form.redIncForm : form.cuRedIncForm;
    if (renewalExpDate !== '' && renewalExpDate !== undefined && renewalExpDate !== null) {
      if ( undertakingType === Constants.UNDERTAKING_TYPE_IU ) {
        this.commonService.maxDate = renewalExpDate;
        this.commonService.expiryDateType = Constants.EXTENSION_EXPIRY_TYPE ;
      } else {
        this.commonService.cuMaxDate = renewalExpDate;
        this.commonService.cuExpiryDateType = Constants.EXTENSION_EXPIRY_TYPE;
      }
      renewalExpDate = Date.parse(this.datePipe.transform(renewalExpDate , Constants.DATE_FORMAT));
      this.commonService.validateDatewithExpiryDate(formGroup, undertakingType);
      this.commonService.setMaxFirstDateValidations(firstDate, renewalExpDate, formGroup, undertakingType,
                                Constants.EXTENSION_EXPIRY_TYPE);
    } else if (expDate !== '' && expDate !== undefined && expDate !== null) {
      if ( undertakingType === Constants.UNDERTAKING_TYPE_IU ) {
        this.commonService.maxDate = expDate;
        this.commonService.expiryDateType = Constants.EXPIRY_TYPE ;
      } else {
        this.commonService.cuMaxDate = expDate;
        this.commonService.cuExpiryDateType = Constants.EXPIRY_TYPE;
      }
      expDate = Date.parse(this.datePipe.transform(expDate , Constants.DATE_FORMAT));
      this.commonService.validateDatewithExpiryDate(formGroup, undertakingType);
      this.commonService.setMaxFirstDateValidations(firstDate, expDate, formGroup, undertakingType, Constants.EXPIRY_TYPE);
    }
  }

  openHelp() {
    const host = window.location.origin;
    let url = host + this.commonService.getBaseServletUrl();
    const accessKey = Constants.HELP_IU_INITIATION;
    url += URLConstants.ONLINE_HELP;
    url += `/?helplanguage=${this.commonService.getUserLanguage()}`;
    url += `&accesskey=${accessKey}`;
    const myWindow = window.open(url, Constants.TRANSACTION_POPUP, 'width=800,height=500,resizable=yes,scrollbars=yes');
    myWindow.focus();
  }

  fetchIncoTermRules(event) {
    if (this.shipmentDetailsComponent && this.shipmentDetailsComponent.shipmentDetailsSection) {
      this.shipmentDetailsComponent.getIncoTermDetailsOptions(event, false);
    }
  }

  fetchLargeParamDetails(event) {
    if (this.bankInstructionsComponent && this.bankInstructionsComponent.commonBankInstructionsComponent) {
      this.bankInstructionsComponent.commonBankInstructionsComponent.getLargeParamDataOptions(event, false,
        Constants.DELIVERY_TO_PARM_ID);
      this.bankInstructionsComponent.commonBankInstructionsComponent.getLargeParamDataOptions(event, false,
        Constants.DELIVERY_MODE_PARM_ID);
    }
    if (this.undertakingChildComponent && this.undertakingChildComponent.undertakingDetailsForm) {
      this.undertakingChildComponent.commonUndertakingDetailsComponent.getLargeParamDataOptions(event, false,
        Constants.DEMAND_INDICATOR_PARM_ID);
    }
    if (this.cuUndertakingChildComponent) {
      this.cuUndertakingChildComponent.commonUndertakingDetailsComponent.getLargeParamDataOptions(event, false,
        Constants.DEMAND_INDICATOR_PARM_ID);
    }
  }
  setValidatorsIfModeSwift(swiftModeSelected) {
    this.iuCommonDataService.setAdvSendMode(swiftModeSelected);
    this.applicantDetailsComponent.setValidatorsIfModeSwift(swiftModeSelected);
    this.beneficiaryDetailsComponent.setValidatorsIfModeSwift(swiftModeSelected);
    this.bankDetailsComponent.commonBankDetailsComponent.setValidatorsIfModeSwift(swiftModeSelected);
    this.amountDetailsChildComponent.commonAmountDetailsChildComponent.setValidatorsIfModeSwift(swiftModeSelected);
    this.undertakingChildComponent.commonUndertakingDetailsComponent.setValidatorsIfModeSwift(swiftModeSelected);
    this.setValidatorsForCounterSections(swiftModeSelected);
  }

  setValidatorsForCounterSections(swiftModeSelected) {
    if (this.cuBeneficaryDetailsChildComponent && this.cuBeneficaryDetailsChildComponent !== null) {
      this.cuBeneficaryDetailsChildComponent.setValidatorsIfModeSwift(swiftModeSelected);
    }
    if (this.cuBeneficaryDetailsChildComponent && this.cuBeneficaryDetailsChildComponent !== null) {
      this.cuAmountDetailsChildComponent.commonAmountDetailsChildComponent.setValidatorsIfModeSwift(swiftModeSelected);
    }
    if (this.cuBeneficaryDetailsChildComponent && this.cuBeneficaryDetailsChildComponent !== null) {
      this.cuUndertakingChildComponent.commonUndertakingDetailsComponent.setValidatorsIfModeSwift(swiftModeSelected);
    }
  }

  downloadTemplateFile() {
    if (this.iuCommonDataService.isEditorTemplate) {
      this.iuCommonDataService.transformToTemplateIssuedUndertaking(
        this.iuCommonDataService.getTnxId(), this.iuCommonDataService.getRefId(), this.iuCommonDataService.getProductCode(),
           this.jsonContent.guaranteeTypeName, this.jsonContent.guaranteeTypeCompanyId,
           this.iuCommonDataService.guaranteeTextId, '', this.iuCommonDataService.getMode(), '', '');
      this.iuService.downloadTemplateDocument(this.iuCommonDataService.banktemplateDownloadRequest
         ).subscribe(data => {
          const authError = data.headers.get('authError');
          if (!authError) {
              this.downloadBankTemplate(data);
              }
             });
    } else if (this.iuCommonDataService.isSpecimenTemplate) {
      this.iuCommonDataService.transformToTemplateIssuedUndertaking(
        this.iuCommonDataService.getTnxId(), this.iuCommonDataService.getRefId(), this.iuCommonDataService.getProductCode(),
           this.jsonContent.guaranteeTypeName, this.jsonContent.guaranteeTypeCompanyId,
           '', this.iuCommonDataService.documentId, this.iuCommonDataService.getMode(), '', '');
      this.iuService.downloadTemplateDocument(this.iuCommonDataService.banktemplateDownloadRequest
            ).subscribe(data => {
              const authError = data.headers.get('authError');
              if (!authError) {
              this.downloadBankTemplate(data);
              }
             });
    } else if (this.iuCommonDataService.isXslTemplate) {
      let formData;
      this.transformToIssuedUndertaking();
      if (this.viewMode) {
        formData = (JSON.stringify(this.jsonContent));
      } else {
        formData = (JSON.stringify(this.issuedundertaking));
      }
      this.iuCommonDataService.transformToTemplateIssuedUndertaking(
        this.iuCommonDataService.getTnxId(), this.iuCommonDataService.getRefId(), this.iuCommonDataService.getProductCode(),
           this.jsonContent.guaranteeTypeName, this.jsonContent.guaranteeTypeCompanyId,
           '', '', this.iuCommonDataService.getMode(), this.iuCommonDataService.stylesheetname,
           (formData));
      this.iuService.downloadTemplateDocument(this.iuCommonDataService.banktemplateDownloadRequest
          ).subscribe(data => {
            const authError = data.headers.get('authError');
            if (!authError) {
            this.downloadBankTemplate(data);
            }
             });
    }

  }

  downloadBankTemplate(response) {

    let fileType;
    if (response.headers.get('content-type')) {
      fileType = response.type;
    } else {
      fileType = 'application/octet-stream';
    }
    const newBlob = new Blob([response.body], { type: fileType });

    // IE doesn't allow using a blob object directly as link href
    // instead it is necessary to use msSaveOrOpenBlob
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(newBlob);
        return;
    }

    const data = window.URL.createObjectURL(newBlob);

    const link = document.createElement('a');
    link.href = data;
    const filename = response.headers.get('content-disposition').split(';')[1].split('=')[1].replace(/\"/g, '');
    link.download = filename;
    // this is necessary as link.click() does not work on the latest firefox
    link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));

    setTimeout(() => {
    // For Firefox it is necessary to delay revoking the ObjectURL
    window.URL.revokeObjectURL(data);
    link.remove();
    }, Constants.LENGTH_100);
  }

}
