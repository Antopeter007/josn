import { TradeCommonDataService } from './../../common/services/trade-common-data.service';
import { ReceivedUndertakingRequest } from '../common/model/ReceivedUndertakingRequest';
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormControl } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ReceivedUndertaking } from '../common/model/receivedUndertaking.model';
import { ReauthDialogComponent } from './../../../common/components/reauth-dialog/reauth-dialog.component';
import { Router, ActivatedRoute } from '@angular/router';
import { ValidationService } from './../../../common/validators/validation.service';
import { ResponseService } from './../../../common/services/response.service';
import { CommonService } from './../../../common/services/common.service';
import { AuditService } from './../../../common/services/audit.service';
import { TnxIdGeneratorService } from './../../../common/services/tnxIdGenerator.service';
import { ReauthService } from './../../../common/services/reauth.service';
import { Constants } from './../../../common/constants';
import { CommonDataService } from './../../../common/services/common-data.service';
import { validateSwiftCharSet } from './../../../common/validators/common-validator';
import { DropdownObject } from '../../iu/common/model/DropdownObject.model';
import { RUService } from '../service/ru.service';
import { ActionsComponent } from './../../../common/components/actions/actions.component';
import { GeneratePdfService } from './../../../common/services/generate-pdf.service';
import { IUCommonReturnCommentsComponent } from '../../iu/common/components/return-comments/return-comments.component';
import { URLConstants } from './../../../common/urlConstants';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'fcc-ru-message-to-bank',
  templateUrl: './ru-message-to-bank.component.html',
  styleUrls: ['./ru-message-to-bank.component.scss']
})
export class RuMessageToBankComponent implements OnInit {

  public ruRecord;
  messageToBankForm: UntypedFormGroup;
  rawValuesForm: UntypedFormGroup;
  public jsonContent;
  receivedUndertaking: ReceivedUndertakingRequest;
  contextPath: string;
  actionCode: string;
  responseMessage: string;
  public showForm = true;
  public viewMode = false;
  public prodStatCode;
  public subTnxTypeObj: any[] = [];
  masterIu: ReceivedUndertaking;
  public mode;
  public tnxType;
  public tnxId;
  public refId;
  public option;
  public subTnxType;
  public tnxAmtReadOnly = false;
  public operation: string;
  public enableReauthPopup = false;
  public subTnxTypeCodes: DropdownObject[];
  public subTnxTypeSelected: DropdownObject;
  parentTnxId: string;
  returnFormValid: boolean;
  public bankDetails: string[] = [];
  private readonly popUpDimensions = 'width=800,height=500,resizable=yes,scrollbars=yes';
  public ruAmt;

  @ViewChild(ReauthDialogComponent) reauthDialogComponent: ReauthDialogComponent;
  @ViewChild(ActionsComponent) actionsComponent: ActionsComponent;
  @ViewChild(IUCommonReturnCommentsComponent) iuCommonReturnCommentsComponent: IUCommonReturnCommentsComponent;

  constructor(public fb: UntypedFormBuilder, public router: Router, public ruService: RUService,
              public activatedRoute: ActivatedRoute, public commonDataService: CommonDataService,
              public tradeCommonDataService: TradeCommonDataService, public validationService: ValidationService,
              public responseService: ResponseService, public commonService: CommonService,
              public auditService: AuditService, public tnxIdGeneratorService: TnxIdGeneratorService,
              public reauthService: ReauthService, public generatePdfService: GeneratePdfService, public translate: TranslateService) { }

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
      masterOrTnx = paramsId.masterOrTnx;
      this.mode = paramsId.mode;
      this.subTnxType = paramsId.subTnxType;
    });
    this.commonService.setTnxType('13');
    if (this.subTnxType === '24' || this.subTnxType === '25') {
      this.option = Constants.OPTION_EXISTING;
    }
    this.messageToBankForm = this.fb.group({
      refId: '',
      boRefId: '',
      issDate: '',
      expDate: '',
      purpose: '',
      subProductCode: '',
      subTnxTypeCode: ['', Validators.required],
      bgCurCode: '',
      bgAmt: ''
    });
    if (this.viewMode) {
      if (masterOrTnx === 'tnx') {
        this.commonService.getTnxDetails(viewRefId, viewTnxId, this.commonDataService.getProductCode(), this.actionCode).subscribe(data => {
          this.ruRecord = data.transactionDetails as string[];
          this.jsonContent = data.transactionDetails as string[];
          this.commonDataService.setDisplayMode('view');
          this.ruAmt = this.commonService.transformAmt(this.ruRecord.bgAmt, this.ruRecord.bgCurCode);
        });
        this.commonService.getBankDetails().subscribe(data => {
          this.bankDetails = data as string[];
        });
      }
    } else if (this.mode === Constants.MODE_UNSIGNED) {
      this.commonService.getTnxDetails(viewRefId, viewTnxId, this.commonDataService.getProductCode(), this.actionCode).subscribe(data => {
        this.ruRecord = data.transactionDetails as string[];
        this.jsonContent = data.transactionDetails as string[];
        this.viewMode = true;
        this.commonDataService.setDisplayMode('view');
        this.commonDataService.setMode(Constants.MODE_UNSIGNED);
        this.ruAmt = this.commonService.transformAmt(this.ruRecord.bgAmt, this.ruRecord.bgCurCode);
      });
    } else if (this.mode === 'DRAFT') {
      this.tnxId = viewTnxId;
      this.commonDataService.setMode(Constants.MODE_DRAFT);
      this.commonDataService.setViewComments(true);
      this.commonDataService.setDisplayMode('edit');
      this.commonDataService.setRefId(viewRefId);
      this.commonDataService.setTnxId(viewTnxId);
      this.commonService.getTnxDetails(viewRefId, viewTnxId, this.commonDataService.getProductCode(), this.actionCode).subscribe(data => {
        this.ruRecord = data.transactionDetails as string[];
        this.jsonContent = data.transactionDetails as string[];
        this.commonDataService.setEntity(this.ruRecord.entity);
        this.prodStatCode = this.ruRecord.prodStatCode;
        this.subTnxType = this.ruRecord.subTnxTypeCode;
        if (this.subTnxType === '24' || this.subTnxType === '25') {
          this.option = Constants.OPTION_EXISTING;
          this.subTnxTypeCodes = [
            { name: this.tradeCommonDataService.getTnxSubTypeCode('24'), value: '24' },
            { name: this.tradeCommonDataService.getTnxSubTypeCode('25'), value: '25' }
          ];
          this.messageToBankForm.get('subTnxTypeCode').setValidators(Validators.required);
        } else if (this.subTnxType === null || this.subTnxType === '' || this.prodStatCode === '12'
          || this.prodStatCode === '81' || this.prodStatCode === '31' || this.subTnxType === '66' || this.subTnxType === '67') {
          this.option = Constants.OPTION_ACTION_REQUIRED;
          this.subTnxTypeCodes = [
            { name: this.tradeCommonDataService.getTnxSubTypeCode('66'), value: '66' },
            { name: this.tradeCommonDataService.getTnxSubTypeCode('67'), value: '67' }
          ];
        }
        this.subTnxTypeCodes.forEach(element => {
          this.getSubTnxTypeCodes(element);
        });
        this.commonDataService.setOption(this.option);
        this.messageToBankForm.patchValue({
          subTnxTypeCode: this.ruRecord.subTnxTypeCode,
          bgCurCode: this.ruRecord.bgCurCode,
          bgAmt: this.commonService.transformAmt(this.ruRecord.bgAmt, this.ruRecord.bgCurCode)
        });
        this.ruAmt = this.commonService.transformAmt(this.ruRecord.bgAmt, this.ruRecord.bgCurCode);
      });
    } else {
      this.commonDataService.setOption(this.option);
      this.commonDataService.setRefId(viewRefId);
      this.tnxIdGeneratorService.getTransactionId().subscribe(data => {
        this.tnxId = data.tnxId as string;
        this.commonDataService.setTnxId(this.tnxId);
      });
      if (this.option === Constants.OPTION_EXISTING) {
        this.commonService.getMasterDetails(viewRefId, this.commonDataService.getProductCode(), this.actionCode).subscribe(data => {
          this.ruRecord = data.masterDetails as string[];
          this.prodStatCode = this.ruRecord.prodStatCode;
          this.commonDataService.setRefId(data.masterDetails.refId);
          this.messageToBankForm.patchValue({
            bgCurCode: this.ruRecord.bgCurCode,
            bgAmt: this.commonService.transformAmt(this.ruRecord.bgAmt, this.ruRecord.bgCurCode)
          });
          this.messageToBankForm.get('subTnxTypeCode').setValidators([Validators.required]);
          this.ruAmt = this.commonService.transformAmt(this.ruRecord.bgAmt, this.ruRecord.bgCurCode);
        });
        this.subTnxTypeCodes = [
          { name: this.tradeCommonDataService.getTnxSubTypeCode('24'), value: '24' },
          { name: this.tradeCommonDataService.getTnxSubTypeCode('25'), value: '25' }
        ];
        this.messageToBankForm.get('subTnxTypeCode').setValue('24');
      } else if (this.option === Constants.OPTION_ACTION_REQUIRED) {
        this.tnxId = viewTnxId;
        this.commonService.getTnxDetails(viewRefId, viewTnxId, this.commonDataService.getProductCode(), this.actionCode).subscribe(data => {
          this.ruRecord = data.transactionDetails as string[];
          this.prodStatCode = this.ruRecord.prodStatCode;
          this.commonDataService.setRefId(this.ruRecord.refId);
          this.ruAmt = this.commonService.transformAmt(this.ruRecord.bgAmt, this.ruRecord.bgCurCode);
        });
        this.subTnxTypeCodes = [
          { name: this.tradeCommonDataService.getTnxSubTypeCode('66'), value: '66' },
          { name: this.tradeCommonDataService.getTnxSubTypeCode('67'), value: '67' }
        ];
        this.parentTnxId = viewTnxId;
        this.messageToBankForm.get('subTnxTypeCode').setValue('66');
      }
      this.subTnxTypeCodes.forEach(element => {
        this.getSubTnxTypeCodes(element);
      });
    }
  }
  getSubTnxTypeCodes(element) {
    const subTnxTypeCode: any = {};
    subTnxTypeCode.label = element.name;
    subTnxTypeCode.value = element.value;
    this.subTnxTypeObj.push(subTnxTypeCode);
  }
  /**
   * After a form is initialized, we link it to our main form
   */
  addToForm(name: string, form: UntypedFormGroup) {
    this.messageToBankForm.setControl(name, form);
  }

  onSave() {
    this.showForm = false;
    this.actionsComponent.showProgressBar = true;
    this.translate.get('PROGRESSBAR_MSG_SAVE').subscribe((value: string) => {
      this.actionsComponent.displayMessage = value;
    });
    this.transformToReceivedUndertaking();
    this.ruService.saveOrSubmitRU(this.contextPath + URLConstants.RU_SAVE,
      this.receivedUndertaking).subscribe(
        data => {
          this.setResponse(data);
          this.router.navigate(['response']);
        });
  }

  transformToReceivedUndertaking() {
    this.rawValuesForm = new UntypedFormGroup({});
    Object.assign(this.rawValuesForm, this.messageToBankForm.getRawValue());
    this.receivedUndertaking = new ReceivedUndertakingRequest();
    this.receivedUndertaking.refId = this.ruRecord.refId;
    this.receivedUndertaking.expDate = this.ruRecord.expDate;
    this.receivedUndertaking.boRefId = this.ruRecord.boRefId;
    this.receivedUndertaking.purpose = this.ruRecord.purpose;
    this.receivedUndertaking.subProductCode = this.ruRecord.subProductCode;
    this.receivedUndertaking.merge(this.messageToBankForm.controls.freeFormatMessageSection.value);
    this.receivedUndertaking.freeFormatText = this.messageToBankForm.controls.freeFormatMessageSection.get('bgFreeFormatText').value;
    this.receivedUndertaking.tnxTypeCode = '13';
    this.receivedUndertaking.tnxId = this.tnxId;
    this.receivedUndertaking.attids = this.commonDataService.getAttIds();
    this.receivedUndertaking.issDate = this.ruRecord.issDate;
    this.receivedUndertaking.subTnxTypeCode = this.rawValuesForm[`subTnxTypeCode`];

    if (this.option === Constants.OPTION_EXISTING) {
      this.receivedUndertaking.prodStatCode = '02';
      if (this.rawValuesForm[`subTnxTypeCode`] === null || this.rawValuesForm[`subTnxTypeCode`] === '') {
        // Set empty value in case of Message Type not selected in Existing Transaction
        this.receivedUndertaking.subTnxTypeCode = '';
      } else {
        this.receivedUndertaking.subTnxTypeCode = this.rawValuesForm[`subTnxTypeCode`];
      }
      this.receivedUndertaking.bgCurCode = this.ruRecord.bgCurCode;
      this.receivedUndertaking.bgAmt = this.rawValuesForm[`bgAmt`];
    } else if (this.option === Constants.OPTION_ACTION_REQUIRED) {
      this.receivedUndertaking.prodStatCode = this.prodStatCode;
      this.receivedUndertaking.parentTnxId = this.parentTnxId;
    }
    if (this.commonService.getTnxToDoListId() != null && this.commonService.getTnxToDoListId() !== '' ) {
      this.receivedUndertaking.todoListId = this.commonService.getTnxToDoListId();
    }
  }

  onSubmit() {
    this.actionsComponent.showProgressBar = true;
    this.translate.get('PROGRESSBAR_MSG_SUBMIT').subscribe((value: string) => {
      this.actionsComponent.displayMessage = value;
    });
    this.showForm = false;
    this.ruService.saveOrSubmitRU(this.contextPath + URLConstants.RU_SUBMIT,
      this.receivedUndertaking).subscribe(
        data => {
          this.response(data);
        });
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
  showDailog(refId): void {
    const host = window.location.origin;
    let url = host + this.commonService.getBaseServletUrl();
    url += Constants.PREVIEW_POPUP_SCREEN;

    const myWindow = window.open(`${url}?option=FULL&referenceid=${refId}&productcode=BR`
      , Constants.TRANSACTION_POPUP, this.popUpDimensions);
    myWindow.focus();
  }

  openPreview() {
    const host = window.location.origin;
    let url = host + this.commonService.getBaseServletUrl();
    url += Constants.PREVIEW_POPUP_SCREEN;
    url += `/?option=FULL&referenceid=${this.commonDataService.getRefId()}`;
    url += `&tnxid=${this.commonDataService.getTnxId()}`;
    url += `&productcode=${this.commonDataService.getProductCode()}`;
    const myWindow = window.open(url,
      Constants.TRANSACTION_POPUP, this.popUpDimensions);
    myWindow.focus();
  }
  onCancel() {
    const host = window.location.origin;
    let url = host + this.commonService.getBaseServletUrl();
    url += Constants.RU_LANDING_SCREEN;
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
    const entity = this.ruRecord.entity;
    const currency = this.ruRecord.bgCurCode;
    const amount = this.ruRecord.bgAmt;
    const subProdCode = this.ruRecord.subProductCode;
    const bank = this.ruRecord.issuingBank.abbvName;
    const tnxTypeCode = this.ruRecord.tnxTypeCode;
    const reauthParams = new Map();
    reauthParams.set('productCode', Constants.PRODUCT_CODE_RU);
    reauthParams.set('subProductCode', subProdCode);
    reauthParams.set('tnxTypeCode', tnxTypeCode);
    reauthParams.set('entity', entity);
    reauthParams.set('currency', currency);
    reauthParams.set('amount', amount);
    reauthParams.set('bankAbbvName', bank);
    reauthParams.set('es_field1', '');
    reauthParams.set('es_field2', '');
    reauthParams.set('tnxData', this.receivedUndertaking);
    reauthParams.set('operation', operation);
    reauthParams.set('mode', this.mode);

    // Call Reauth service to get the re-auth type
    this.reauthService.getReauthType(reauthParams).subscribe(
      data => {
        const reauthType = data.response;
        if (reauthType === Constants.REAUTH_TYPE_PASSWORD) {
          this.reauthDialogComponent.enableReauthPopup = true;
          // setting reauth_password to '' as it has to get cleared when user clicks on submit after reauthentication failure
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
    this.receivedUndertaking.clientSideEncryption = this.messageToBankForm.controls.reauthForm.get('clientSideEncryption').value;
    this.receivedUndertaking.reauthPassword = this.messageToBankForm.controls.reauthForm.get('reauthPassword').value;
    this.receivedUndertaking.reauthPerform = this.messageToBankForm.controls.reauthForm.get('reauthPerform').value;

    if (this.operation === Constants.OPERATION_SUBMIT && this.mode !== Constants.MODE_UNSIGNED) {
      this.onSubmit();
    } else if (this.operation === Constants.OPERATION_SUBMIT && this.mode === Constants.MODE_UNSIGNED) {
      this.onSubmitRetrieveUnsigned();
    } else if (this.operation === 'return') {
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
  transformForUnsignedMode() {
    this.rawValuesForm = new UntypedFormGroup({});
    Object.assign(this.rawValuesForm, this.messageToBankForm.getRawValue());
    this.receivedUndertaking = new ReceivedUndertakingRequest();
    this.receivedUndertaking.tnxTypeCode = Constants.TYPE_INQUIRE;
    this.receivedUndertaking.refId = this.commonDataService.getRefId();
    this.receivedUndertaking.tnxId = this.commonDataService.getTnxId();
    if ((this.operation === Constants.OPERATION_RETURN) || (this.jsonContent[`returnComments`] &&
        this.jsonContent[`returnComments`] !== null && this.jsonContent[`returnComments`] !== '')) {
      const returnComments = this.rawValuesForm[`commentsForm`].returnComments;
      this.receivedUndertaking.returnComments = returnComments;
    }
    if (this.commonService.getTnxToDoListId() != null && this.commonService.getTnxToDoListId() !== '' ) {
      this.receivedUndertaking.todoListId = this.commonService.getTnxToDoListId();
    }
  }
  onSubmitRetrieveUnsigned() {
    this.showForm = false;
    this.actionsComponent.showProgressBar = true;
    this.translate.get('PROGRESSBAR_MSG_SUBMIT').subscribe((value: string) => {
      this.actionsComponent.displayMessage = value;
    });
    this.ruService.submitFromRetrieveUnsigned(this.contextPath + URLConstants.RU_SUBMIT_UNSIGNED, this.receivedUndertaking).subscribe(
      data => {
        this.response(data);
      }
    );
  }

  onReturn() {
    this.actionsComponent.showProgressBar = true;
    this.translate.get('PROGRESSBAR_MSG_RETURN').subscribe((value: string) => {
      this.actionsComponent.displayMessage = value;
    });
    this.ruService.returnIssuedUndertaking(this.contextPath + URLConstants.RU_RETURN, this.receivedUndertaking)
      .subscribe(
        data => {
          this.response(data);
        });
  }

  response(data) {
    this.setResponse(data);
    if (this.enableReauthPopup && data.response === Constants.RESPONSE_REAUTH_FAILURE) {
      this.actionsComponent.showProgressBar = false;
      this.reauthDialogComponent.onReauthSubmitCompletion(data.response);
    } else {
      this.router.navigate(['response']);
    }
  }

  handleEvents(operation) {
    this.operation = operation;
    if (operation === Constants.OPERATION_SAVE) {
      this.onSave();
    } else if (operation === Constants.OPERATION_SUBMIT && this.mode !== Constants.MODE_UNSIGNED) {
      this.validateForm();
      if (this.messageToBankForm.valid && this.commonService.getReauthEnabled()) {
        this.transformToReceivedUndertaking();
        this.enableReauthPopup = this.commonService.getReauthEnabled();
        this.showReauthPopup(Constants.OPERATION_SUBMIT);
      } else if (this.messageToBankForm.valid) {
        this.transformToReceivedUndertaking();
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

  setResponse(data) {
    this.responseMessage = data.message;
    this.responseService.setResponseMessage(data.message);
    this.responseService.setRefId(data.refId);
    this.responseService.setTnxId(data.tnxId);
    this.responseService.setTnxType(data.tnxTypeCode);
    this.responseService.setProductCode(Constants.PRODUCT_CODE_RU);
    if (this.operation === Constants.OPERATION_SUBMIT || this.operation === Constants.OPERATION_SAVE) {
      this.responseService.setOption(this.option);
      this.responseService.setSubTnxType(data.subTnxTypeCode);
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
    let headers: string[] = [];
    let data: any[] = [];
    this.generatePdfService.generateFile(Constants.PRODUCT_CODE_RU, this.bankDetails);
    this.generatePdfService.setSectionDetails('HEADER_EVENT_DETAILS', true, false, 'eventDetails');
    this.generatePdfService.setSectionDetails('', true, true, 'messageToBank');

    // Attachments table
    if (this.ruRecord.attachments && this.ruRecord.attachments !== '') {
      this.generatePdfService.setSubSectionHeader('KEY_HEADER_FILE_UPLOAD', true);
      headers = [];
      headers.push(this.commonService.getTranslation('KEY_FILE_TITLE'));
      headers.push(this.commonService.getTranslation('FILE_NAME'));
      data = [];
      for (const attachment of this.ruRecord.attachments.attachment) {
        const row = [];
        row.push(attachment.title);
        row.push(attachment.fileName);
        data.push(row);
      }
      this.generatePdfService.createTable(headers, data);
    }

    if (this.mode !== Constants.MODE_UNSIGNED && this.commonDataService.getViewComments() && this.iuCommonReturnCommentsComponent) {
      this.iuCommonReturnCommentsComponent.generatePdf(this.generatePdfService);
    }

    if (this.commonDataService.getmasterorTnx() === Constants.MASTER) {
      this.generatePdfService.saveFile(this.jsonContent.refId, '');
    } else {
      this.generatePdfService.saveFile(this.jsonContent.refId, this.jsonContent.tnxId);
    }
  }

  openHelp() {
    const host = window.location.origin;
    let url = host + this.commonService.getBaseServletUrl();
    const userLanguage = this.commonService.getUserLanguage();
    const accessKey = Constants.HELP_RU_MSG_TO_BANK;
    url += URLConstants.ONLINE_HELP;
    url += `/?helplanguage=${userLanguage}`;
    url += `&accesskey=${accessKey}`;
    const myWindow = window.open(url, Constants.TRANSACTION_POPUP, this.popUpDimensions);
    myWindow.focus();
  }
}
