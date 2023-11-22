import { FccTradeFieldConstants } from './../../fcc-trade-field-constants';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, DynamicDialogRef } from 'primeng';
import { BehaviorSubject } from 'rxjs';
import { FCCFormGroup } from '../../../../../base/model/fcc-control.model';

import { FCCBase } from '../../../../../base/model/fcc-base';
import { FccGlobalConstant } from '../../../../../common/core/fcc-global-constants';
import { CommonService } from '../../../../../common/services/common.service';
import { ResolverService } from '../../../../../common/services/resolver.service';
import { SearchLayoutService } from '../../../../../common/services/search-layout.service';
import { ProductStateService } from '../../../lc/common/services/product-state.service';
import { CustomCommasInCurrenciesPipe } from '../../../lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { FilelistService } from '../../../lc/initiation/services/filelist.service';
import { FileMap } from '../../../lc/initiation/services/mfile';
import { UtilityService } from '../../../lc/initiation/services/utility.service';
import { CurrencyConverterPipe } from './../../../lc/initiation/pipes/currency-converter.pipe';
import { Validators } from '@angular/forms';
import { validateAmountLength } from '../../../ui/common/validators/ui-validators';
import { ELMT700FileMap } from '../../../lc/initiation/services/elMT700mfile';
import { compareExpiryDateToCurrentDate, compareTransportDocDateEqualToCurrentDate } from '../../../../trade/lc/initiation/validator/ValidateDates';
export class TransactionComponent extends FCCBase {

  params = FccGlobalConstant.PARAMS;
  label = FccGlobalConstant.LABEL;
  fileUploadError = 'fileUploadError';
  contextPath = window[FccGlobalConstant.CONTEXT_PATH];
  isValidSize;
  isUploadEnable = true;
  form = this[FccGlobalConstant.FORM];
  fileModel;
  validFileExtensions;
  errorMsgFileExtensions;
  sizeOfFileRegex;
  erroreMsgMaxFile;
  ORIGINAL_VALUE = 'originalValue';


  PRODUCT_CODE;
  LICENSE_DETAILS;
  lcResponse;
  responseArray;
  formModelArray;
  columnsHeader;
  currency;
  tnxAmount;
  columnsHeaderData;
  statuses;
  allowOverDraw;
  licenseOutStandingAmt;
  errorMsg;
  beneficiary;
  expiryDate;
  applicant;
  convertedAmountConstant;
  operation;
  fileUploadMaxSize;
  fileUploadRegex;
  isFileNameValid;
  numberOfFilesRegex = 0;
  decimalDigits = 2;
  nonNumericCurrencyValidator: any = false;
  currencyDecimalplacesThree: any;
  currencyDecimalplacesZero: any;

  constructor(protected translateService: TranslateService, protected confirmationService: ConfirmationService,
              protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe, protected searchLayoutService: SearchLayoutService,
              protected commonService: CommonService, protected utilityService: UtilityService, protected resolverService: ResolverService,
              protected stateService: ProductStateService, protected fileArray: FilelistService, protected dialogRef: DynamicDialogRef,
              protected currencyConverterPipe: CurrencyConverterPipe) {
    super();
    const language = localStorage.getItem('language');
    this.translateService.use(language ? language : 'en');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    this.translateService.get('corporatechannels').subscribe((translated: string) => {
         // eslint-disable-next-line no-console
        console.log('to ensure that the translations are loaded via making this sequential call');
    });
    // Load the default values
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.numberOfFilesRegex = response.FileUploadMaxLimit;
        this.sizeOfFileRegex = response.FileUploadMaxSize;
        this.fileUploadMaxSize = response.FileUploadMaxSize;
        this.nonNumericCurrencyValidator = response.nonNumericCurrencyValidator;
        this.currencyDecimalplacesThree = response.currencyDecimalplacesThree;
        this.currencyDecimalplacesZero = response.currencyDecimalplacesZero;
        this.fileUploadRegex = this.commonService.decodeHtml(response.FileUploadRegex);
        this.validFileExtensions = [];
        if (localStorage.getItem(FccGlobalConstant.MT700_UPLOAD) === FccGlobalConstant.OTHER){
          const allFileExtensions = response.MT700AllowedFileExtensions.split(',');
          allFileExtensions.forEach(element => {
            //eslint-disable-next-line no-useless-escape
            if (this.validFileExtensions.indexOf(element.replace(/[\[\]"]/g, '').toUpperCase()) === -1) {
              //eslint-disable-next-line no-useless-escape
              this.validFileExtensions.push(element.replace(/[\[\]"]/g, '').toUpperCase());
            }
          });
        } else {
          const allFileExtensions = response.validFileExtensions.split(',');
          allFileExtensions.forEach(element => {
            //eslint-disable-next-line no-useless-escape
            if (this.validFileExtensions.indexOf(element.replace(/[\[\]"]/g, '').toUpperCase()) === -1) {
              //eslint-disable-next-line no-useless-escape
              this.validFileExtensions.push(element.replace(/[\[\]"]/g, '').toUpperCase());
            }
          });
        }
      }
    });
  }
  // file Upload dialog Generic methods

  onChangeFilebrowseButton(event) {
    const mt700Upload = localStorage.getItem('mt700Upload');
    this.commonService.fileUploadHandlerService.onChangeFilebrowseButton(event, this.form, this.fileModel,
      this.fileUploadMaxSize, this.sizeOfFileRegex, mt700Upload, this.validFileExtensions,
      this.errorMsgFileExtensions, this.getFileExt(event.files[0].name), this.fileUploadRegex);
    if (mt700Upload === FccGlobalConstant.OTHER) {
      this.fileModel = new ELMT700FileMap(event.files[0], event.files[0].name,
        this.form.get(FccTradeFieldConstants.FILE_UPLOAD_TITLE).value,
        this.getFileExt(event.files[0].name), this.getFileExtPath(event.files[0].name),
        this.getFileSize(event.files[0].size), null, null, null, null, null);
    } else {
    this.fileModel = new FileMap(event.files[0], event.files[0].name, this.form.get(FccTradeFieldConstants.FILE_UPLOAD_TITLE).value,
      this.getFileExt(event.files[0].name), this.getFileExtPath(event.files[0].name),
      this.getFileSize(event.files[0].size), null, null, null, null, null, event.files[0].type);
    }
    this.commonService.setIsMT700Upload(null);
  }

  checkTitle(): boolean {
    return this.commonService.fileUploadHandlerService.checkTitle(this.form);
  }

  onUploadHandler(event) {
    let referenceId = this.commonService.referenceId;
    let eventId = this.commonService.eventId;
    if (this.commonService.isEmptyValue(referenceId)) {
      referenceId = this.commonService.getQueryParametersFromKey(FccGlobalConstant.REF_ID);
    }
    if (this.commonService.isEmptyValue(eventId)) {
      eventId = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_ID);
    }
    this.checkFileSize(event);
    this.checkValidFileNameLength(event);
    let checkMT700File;
    if (localStorage.getItem('mt700Upload') === FccGlobalConstant.OTHER) {
      checkMT700File = FccGlobalConstant.OTHER;
    } else {
      checkMT700File = null;
    }
    if (this.isUploadEnable && this.isValidSize && this.isFileNameValid && this.checkTitle()
    && this.checkValidFileExtension(event) && this.checkValidFileNameRegex(event)) {
      this.isUploadEnable = false;
      this.fileModel.title = this.form.get('fileUploadTitle').value;
      this.fileModel.file = new File([this.fileModel.file], encodeURIComponent(this.fileModel.fileName),
      { type: this.fileModel.file.type, lastModified: this.fileModel.file.lastModified });
      this.commonService.uploadAttachments(this.fileModel.file, this.fileModel.title, referenceId, eventId, checkMT700File).subscribe(
        response => {
          this.isUploadEnable = true;
          this.setDocId(response);
          this.process();
        },
        (error: HttpErrorResponse) => {
          this.isUploadEnable = true;
          if (error.status === FccGlobalConstant.HTTP_RESPONSE_BAD_REQUEST
             || error.status === FccGlobalConstant.HTTP_RESPONSE_SUCCESS) {
            if (error.error && error.error.causes && error.error.causes.length){
              this.erroreMsgMaxFile = error.error.causes[0].title;
            } else if (error.error && (error.error.detail && error.error.detail.indexOf(FccGlobalConstant.MALICIOUS) > -1)
                || (error.error.text && error.error.text.indexOf(FccGlobalConstant.MALICIOUS) > -1)
                || (error.error.text && error.error.text.indexOf('message') > -1)){
              return this.commonService.fileUploadHandlerService.antiVirusCheck(true, this.form);
            }
            this.form.get('fileUploadError')[this.params][this.label] = this.erroreMsgMaxFile;
            this.form.get('fileUploadError')[this.params][FccGlobalConstant.RENDERED] = true;
            this.form.updateValueAndValidity();
          }
        },
        () => this.dialogRef.close(this.fileModel)
        );
    } else {
      this.form.get('fileUploadTitle').markAsTouched();
    }
  }

  process() {
    if (localStorage.getItem('mt700Upload') === FccGlobalConstant.OTHER) {
      this.fileArray.pushELMT700File(this.fileModel);
    } else {
      this.fileArray.pushFile(this.fileModel);
    }
    this.dialogRef.close(this.fileModel);
    localStorage.removeItem('mt700Upload');
  }

  checkFileSize(event, fileUploadMaxSize?: any) {
    this.isValidSize =
    this.commonService.fileUploadHandlerService.checkFileSize(event, this.form,
      fileUploadMaxSize ? fileUploadMaxSize : this.fileUploadMaxSize);
  }

  validateOtherSectionDates(sectionNames, timezoneString) {
    if (sectionNames && sectionNames.length > 0) {
      sectionNames.forEach(function(section) {
        const formControls = Object.entries(this.stateService.getSectionData(section).controls);
        formControls.forEach(function(data) {
          const control = data[1];
          if(data[1] && data[1]['controls']) {
            const formControlData = Object.entries(data[1]['controls']);
            // console.log('form control data',formControlData);
            formControlData.forEach(rec => {
              const dateControl = rec[1];
              this.validateDateInnerControl(dateControl, data[0], section, timezoneString);
            });
          } else {
            this.validateDateControl(control, section, timezoneString);
          }

        }, this);
      }, this);
    }
  }

  validateDateControl(control, section, timezoneString) {
    if(control['type'] === 'input-date'){
      const fieldName = control['params']['key'];
      control['params']['minDate'] = new Date(new Date(new Date().toLocaleString("en-US", {
        timeZone: timezoneString
      })).setHours(0, 0, 0, 0));
      if(control && control['value'] && control['params']['minDate']
      && control['params']['minDate'] > control['value']
      ) {
        this.stateService.getSectionData(section).get(fieldName)?.setErrors([compareExpiryDateToCurrentDate]);
      } else {
        this.stateService.getSectionData(section).get(fieldName)?.setErrors(null);
        this.stateService.getSectionData(section).get(fieldName)?.clearValidators();
      }
    } else if(control['type'] === 'input-backdate'){
      const fieldName = control['params']['key'];
      control['params']['maxDate'] = new Date(new Date(new Date().toLocaleString("en-US", {
        timeZone: timezoneString
      })).setHours(0, 0, 0, 0));
      if(control && control['value'] && control['params']['maxDate']
      && control['value'] > control['params']['maxDate']
      ) {
        this.stateService.getSectionData(section).get(fieldName)?.setErrors([compareTransportDocDateEqualToCurrentDate]);
      } else {
        this.stateService.getSectionData(section).get(fieldName)?.setErrors(null);
        this.stateService.getSectionData(section).get(fieldName)?.clearValidators();
      }
    }
  }

  validateDateInnerControl(control, innerSection, section, timezoneString) {
    if(control['type'] === 'input-date'){
      const fieldName = control['params']['key'];
      control['params']['minDate'] = new Date(new Date(new Date().toLocaleString("en-US", {
        timeZone: timezoneString
      })).setHours(0, 0, 0, 0));
      if(control && control['value'] && control['params']['minDate']
      && control['params']['minDate'] > control['value']
      ) {
        this.stateService.getSectionData(section).get(innerSection).get(fieldName).setErrors([compareExpiryDateToCurrentDate]);
        this.stateService.getSectionData(section).get(innerSection).get(fieldName).markAsDirty();
        this.stateService.getSectionData(section).get(innerSection).get(fieldName).markAsTouched();
      } else {
        // alert('1');
        this.stateService.getSectionData(section).get(innerSection).get(fieldName)?.setErrors(null);
        this.stateService.getSectionData(section).get(innerSection).get(fieldName)?.clearValidators();
      }
    }
  }

  checkValidFileNameLength(event) {
    this.isFileNameValid =
    this.commonService.fileUploadHandlerService.checkValidFileNameLength(event, this.form);
  }
  checkValidFileName(event, length: any){
    this.isFileNameValid = this.commonService.fileUploadHandlerService.checkValidFileName(event, length);
  }
  checkValidFileExtension(event): boolean {
    return this.commonService.fileUploadHandlerService.checkValidFileExtension(this.form, this.validFileExtensions,
      this.errorMsgFileExtensions, this.getFileExt(event.files[0].name));
  }

  getFileExtPath(fileName: string) {
    return this.commonService.getFileExtPath(fileName);
  }

  onClearHandler() {
    this.patchFieldParameters(this.form.get('fileUploadError'), { label: '' });
    this.patchFieldParameters(this.form.get('fileUploadError'), { rendered: false });
  }

  getFileSize(fileSize: any) {
    return this.commonService.fileUploadHandlerService.getFileSize(fileSize);
  }

  setDocId(response) {
    this.fileModel.attachmentId = response.docId;
  }

  getData() {
    return this.fileModel;
  }
  getFileExt(fileName: string) {
    return this.commonService.fileUploadHandlerService.getFileExt(fileName);
  }

  // License Details Generic Methods

  ValidateMultipleLicense() {
    this.commonService.licenseDetailsHandlerService.ValidateMultipleLicense(this.form, this.currency, this.tnxAmount);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onEventClickTrashLicense(ele, a, b) {
    const sessionArr = this.form.get(FccGlobalConstant.LICENSE)[FccGlobalConstant.PARAMS][FccGlobalConstant.SESSIONCOLS];
    for (let i = 0; i < sessionArr.length; i++) {
      if (ele.REF_ID === sessionArr[i].REF_ID) {
        sessionArr.splice(i, 1);
        this.form.get(FccGlobalConstant.LICENSE)[FccGlobalConstant.PARAMS][FccGlobalConstant.SESSIONCOLS] = sessionArr;
        this.form.updateValueAndValidity();
        this.stateService.setStateSection(this.LICENSE_DETAILS, this.form);
      }
    }
    this.form.get(FccGlobalConstant.LICENSE)[FccGlobalConstant.PARAMS][FccGlobalConstant.SESSIONCOLS] = sessionArr;
    this.stateService.setStateSection(this.LICENSE_DETAILS, this.form);
    this.form.updateValueAndValidity();
    this.stateService.setStateSection(this.LICENSE_DETAILS, this.form);
    if (sessionArr.length === 0) {
      const data = 'data';
      this.lcResponse = '';
      this.responseArray = [];
      this.form.get(FccGlobalConstant.LICENSE)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      this.form.get(FccGlobalConstant.LICENSE)[FccGlobalConstant.PARAMS][FccGlobalConstant.SESSIONCOLS] = [];
      this.form.get(FccGlobalConstant.LICENSE)[FccGlobalConstant.PARAMS][data] = [];
      this.form.updateValueAndValidity();
      this.stateService.setStateSection(this.LICENSE_DETAILS, this.form);
    }
  }

  formateResult() {
    for (let i = 0; i < this.formModelArray.length; i++) {
      let key: any;
      key = Object.keys(this.formModelArray[i]);
      key = key[0];
      this.columnsHeader.push(key);
      const headerdata = this.translateService.instant(key);
      this.columnsHeaderData.push(headerdata);
    }
    this.responseArray = this.form.get(FccGlobalConstant.LICENSE)[FccGlobalConstant.PARAMS][FccGlobalConstant.SESSIONCOLS];
    for (let i = 0; i < this.responseArray.length; i++) {
      for (let j = 0; j < this.columnsHeader.length; j++) {
        Object.defineProperty(this.responseArray[i], this.columnsHeader[j],
          { value: this.getValue(this.responseArray[i][this.columnsHeader[j]]), writable: true });
        Object.defineProperty(this.responseArray[i], this.columnsHeader[j] + 'Type',
          { value: this.getType(this.columnsHeader[j], this.responseArray[i]), writable: false });
        Object.defineProperty(this.responseArray[i], this.columnsHeader[j] + 'Status',
          { value: this.getEditStatus(this.columnsHeader[j], this.responseArray[i]), writable: false });
      }
    }
  }

  getValue(val: any) {
    return this.commonService.licenseDetailsHandlerService.getValue(val);
  }

  getType(key, typeVal) {
    return this.commonService.licenseDetailsHandlerService.getType(key, typeVal, this.formModelArray);
  }

  getEditStatus(key, status) {
    return this.commonService.licenseDetailsHandlerService.getEditStatus(key, status, this.formModelArray);
  }

  onBlurLicense(event: any, key: any) {
    this.commonService.licenseDetailsHandlerService.onBlurLicense(event, key, this.form, this.currency);
    this.updateDataArray();
    this.ValidateMultipleLicense();
  }

  updateDataArray() {
    this.commonService.licenseDetailsHandlerService.updateDataArray(this.form, this.operation, this.currency);
  }

  onkeyUpTextField(event, key, product) {
    const arr = [];
    const valArr = product.amount.split();
    const OverDrawStatus = 'OverDrawStatus';
    const tnsAmountStatus = 'tnsAmountStatus';
    for (let i = 0; i < valArr.length; i++) {
      const amount = this.commonService.replaceCurrency(valArr[i]);
      if (isNaN(amount)) {
        valArr[i] = '';
      } else {
        arr.push(amount);
      }
    }
    this.getLicenseList();
    product.amount = arr.toString();
    const overdra = product[FccGlobalConstant.ALLOW_OVERDRAW];
    this.form.get(FccGlobalConstant.LICENSE)[FccGlobalConstant.PARAMS][OverDrawStatus] = false;
    if (overdra === 'N') {
      if (parseInt(product.amount, 10) > parseInt(this.licenseOutStandingAmt, 10)) {
        this.form.get(FccGlobalConstant.LICENSE)[FccGlobalConstant.PARAMS][OverDrawStatus] = true;
      }
    } else {
      this.form.get(FccGlobalConstant.LICENSE)[FccGlobalConstant.PARAMS][OverDrawStatus] = false;
    }
    let check = product.amount;
    check = check.trim();
    check = check.length;

    if (check === 0) {
      this.form.get(FccGlobalConstant.LICENSE)[FccGlobalConstant.PARAMS][tnsAmountStatus] = false;
    } else {
      this.form.get(FccGlobalConstant.LICENSE)[FccGlobalConstant.PARAMS][tnsAmountStatus] = true;
    }
    this.ValidateMultipleLicense();
    this.form.updateValueAndValidity();
    this.updateDataArray();
  }

  getLicenseList() {
    this.lcResponse = this.searchLayoutService.searchLayoutDataSubject.subscribe((response) => {

      if (response) {
        this.columnsHeader = [];
        this.columnsHeaderData = [];
        this.responseArray = response.responseData;
        this.handleLicenseGrid(response);
      }
    });
  }

  onClickLinkLicense() {
    if (this.beneficiary !== undefined && this.currency !== undefined && this.applicant !== undefined && this.expiryDate !== undefined
      && this.expiryDate !== '' && this.expiryDate !== null) {
      if (this.lcResponse !== undefined) {
        this.searchLayoutService.searchLayoutDataSubject.unsubscribe();
        this.lcResponse = null;
        this.searchLayoutService.searchLayoutDataSubject = new BehaviorSubject(null);
      }
      const header = `${this.translateService.instant('licenseList')}`;
      const obj = {};
      this.commonService.defaultLicenseFilter = true;
      const subProduct = this.commonService.getQueryParametersFromKey(FccGlobalConstant.SUB_PRODUCT_CODE);
      obj[FccGlobalConstant.PRODUCT] = this.commonService.getQueryParametersFromKey(FccGlobalConstant.PRODUCT);
      obj[FccGlobalConstant.SUB_PRODUCT_CODE] = (subProduct !== undefined && subProduct !== null) ? subProduct : '';
      obj[FccGlobalConstant.OPTION] = '';
      obj[FccGlobalConstant.BUTTONS] = false;
      obj[FccGlobalConstant.SAVED_LIST] = false;
      obj[FccGlobalConstant.EXPIRY_DATE_FIELD] = this.utilityService.transformDateFormat(this.expiryDate);
      obj[FccGlobalConstant.CURRENCY] = this.currency;
      obj[FccGlobalConstant.BENEFICIARY_NAME] = this.beneficiary;
      obj[FccGlobalConstant.HEADER_DISPLAY] = false;
      obj[FccGlobalConstant.DOWNLOAD_ICON_ENABLED] = false;
      obj[FccGlobalConstant.LISTDEF] = FccGlobalConstant.LIST_LICENSE_SCREEN;
      obj[FccGlobalConstant.DEFAULT_LICENSE_FILTER] = true;
      const urlOption = this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPTION);
      if (urlOption === FccGlobalConstant.TEMPLATE) {
        const templateCreation = 'templateCreation';
        obj[templateCreation] = true;
      }
      this.resolverService.getSearchData(header, obj);
      this.getLicenseList();
    } else {
      this.errorMsg = `${this.translateService.instant('lcLicenseUploadError')}`;
      this.form.get(FccGlobalConstant.LICENSE_UPLOAD_ERROR)[FccGlobalConstant.PARAMS][FccGlobalConstant.LABEL] = this.errorMsg;
      this.form.get(FccGlobalConstant.LICENSE_UPLOAD_ERROR)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      this.form.updateValueAndValidity();
    }
  }

  handleLicenseGrid(response: any, master?: boolean) {
    this.operation = this.commonService.getQueryParametersFromKey('operation');
    const mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    let existingArr = [];
    this.allowOverDraw = response.responseData[0]['LICENSEDEFINITION@ALLOW_OVERDRAW'];
    this.licenseOutStandingAmt = response.responseData[0][this.convertedAmountConstant];
    existingArr = this.form.get(FccGlobalConstant.LICENSE)[FccGlobalConstant.PARAMS][FccGlobalConstant.SESSIONCOLS];
    if (existingArr?.length > 0) {
      for (let i = 0; i < response.responseData.length; i++) {
        for (let j = 0; j < existingArr.length; j++) {
          if (response.responseData[i].REF_ID === existingArr[j].REF_ID) {
            if (mode === FccGlobalConstant.DRAFT_OPTION && response.responseData[i].amount !== existingArr[j].amount) {
              existingArr[j].amount = response.responseData[i].amount;
            }
            break;
          } else if (j === existingArr.length - 1) {
            existingArr.push(response.responseData[i]);
          }
        }
      }

      this.form.get(FccGlobalConstant.LICENSE)[FccGlobalConstant.PARAMS][FccGlobalConstant.SESSIONCOLS] = existingArr;
      this.stateService.setStateSection(this.LICENSE_DETAILS, this.form, master);
      this.form.updateValueAndValidity();
    } else {
      this.form.get(FccGlobalConstant.LICENSE)[FccGlobalConstant.PARAMS][FccGlobalConstant.SESSIONCOLS] = response.responseData;
      this.stateService.setStateSection(this.LICENSE_DETAILS, this.form, master);
      this.form.updateValueAndValidity();
    }

    this.stateService.getSectionData(this.LICENSE_DETAILS);
    this.statuses = [{ label: 'In Stock', value: 'INSTOCK' },
    { label: 'Low Stock', value: 'LOWSTOCK' }, { label: 'Out of Stock', value: 'OUTOFSTOCK' }];
    this.form.get(FccGlobalConstant.LICENSE)[FccGlobalConstant.PARAMS][FccGlobalConstant.OPTIONS] = this.statuses;
    this.formModelArray = this.form.get(FccGlobalConstant.LICENSE)[FccGlobalConstant.PARAMS][FccGlobalConstant.SUBCONTROLSDETAILS];
    this.columnsHeader = [];
    this.columnsHeaderData = [];
    this.formateResult();
    this.patchFieldParameters(this.form.get(FccGlobalConstant.LICENSE), { columns: this.columnsHeader });
    this.patchFieldParameters(this.form.get(FccGlobalConstant.LICENSE), { columnsHeaderData: this.columnsHeaderData });
    if (this.operation !== 'LIST_INQUIRY') {
      this.form.get(FccGlobalConstant.LICENSE)[FccGlobalConstant.PARAMS][FccGlobalConstant.DATA] = this.responseArray;
    }
    this.updateDataArray();
    this.form.get(FccGlobalConstant.LICENSE)[FccGlobalConstant.PARAMS][FccGlobalConstant.MESSAGE1] =
      `${this.translateService.instant('Allocatedamountexceed')}`;
    this.form.get(FccGlobalConstant.LICENSE)[FccGlobalConstant.PARAMS][FccGlobalConstant.MESSAGE2] =
      `${this.translateService.instant('SumofAllocatedLicenseamount')}`;
    this.form.get(FccGlobalConstant.LICENSE)[FccGlobalConstant.PARAMS][FccGlobalConstant.TRASH_ACTION] = 'pi-trash';
    this.form.updateValueAndValidity();
    this.form.get(FccGlobalConstant.LICENSE)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
    const sessionArr = this.form.get(FccGlobalConstant.LICENSE)[FccGlobalConstant.PARAMS][FccGlobalConstant.SESSIONCOLS];
    if (sessionArr.length === 0) {
      this.form.get(FccGlobalConstant.LICENSE)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
    }
  }

  public handleSubTnxTypecode(form: FCCFormGroup, tnxTypeCode, subTnxTypeSection) {
    if (tnxTypeCode && tnxTypeCode === FccGlobalConstant.N002_AMEND) {
      if (form && form.get(FccGlobalConstant.INCREASE_AMT) && form.get(FccGlobalConstant.INCREASE_AMT).value !== '' &&
        form.get(FccGlobalConstant.INCREASE_AMT).value !== undefined && form.get(FccGlobalConstant.INCREASE_AMT).value !== null) {
        this.stateService.getSectionData(subTnxTypeSection).get(FccGlobalConstant.SUB_TRANSACTION_TYPE_CODE).
          patchValue(FccGlobalConstant.AMEND_INC);
      } else if (form && form.get(FccGlobalConstant.DECREASE_AMT) && form.get(FccGlobalConstant.DECREASE_AMT).value !== '' &&
        form.get(FccGlobalConstant.DECREASE_AMT).value !== undefined && form.get(FccGlobalConstant.DECREASE_AMT).value !== null) {
        this.stateService.getSectionData(subTnxTypeSection).get(FccGlobalConstant.SUB_TRANSACTION_TYPE_CODE).
          patchValue(FccGlobalConstant.AMEND_DEC);
      } else {
        this.stateService.getSectionData(subTnxTypeSection).get(FccGlobalConstant.SUB_TRANSACTION_TYPE_CODE).
          patchValue(FccGlobalConstant.AMEND_TERM);
      }
    }
  }

  // unSelectButton Handler
  unSelectButton(isEvent: boolean, buttonfieldName: string, presentValue: string, previousValue: string,
                 hideFieldsArray?: string[], setDefaultFieldArray?: string[]) {
    if (this.isUnSelectButton(isEvent, presentValue, previousValue)) {
      // Hide all fields
      this.hideFieldsUnSelectButton(hideFieldsArray);
      // Reset fields
      this.resetDefaultValuesUnSelectButton(setDefaultFieldArray);
      // Remove Validation
      this.removeValidationUnSelectButton();
      // Unselect Control
      this.form.get(buttonfieldName).setValue(null);
    }
  }

  hideFieldsUnSelectButton(hideFieldsArray?: string[]) {
    if (hideFieldsArray) {
      this.toggleControls(this.form, hideFieldsArray, false);
    }
  }

  resetDefaultValuesUnSelectButton(setDefaultFieldArray?: string[]) {
    if (setDefaultFieldArray) {
      this.resetDefaultValues(this.form, setDefaultFieldArray);
    }
  }

  removeValidationUnSelectButton() {
    // Override for custom implementation
  }

  isUnSelectButton(isEvent: boolean, presentValue, previousValue): boolean {
    return isEvent && (presentValue === previousValue);
  }

  isChipEvent(event, previousValue): boolean {
    return event && event[FccGlobalConstant.SOURCE][FccGlobalConstant.VALUE] && previousValue;
  }

  setCurrencyAndAmountField(amtControl, currencyControl, amountValueControl) {
    const amount = this.form.get(amtControl);
    const curCode = this.form.get(currencyControl);
    if (amount && this.commonService.isnonEMptyString(amount.value) &&
      curCode && this.commonService.isnonEMptyString(curCode.value)) {
      this.form.get(amountValueControl)[this.params][FccGlobalConstant.RENDERED] = true;
      const amountValue = curCode.value.concat(FccGlobalConstant.BLANK_SPACE_STRING).concat(amount.value);
      this.form.get(amountValueControl).setValue(amountValue);
    }
}
  getBoReleaseDateValue(){
    if(this.form.get('boReleaseDate') && this.commonService.isnonEMptyString(this.form.get('boReleaseDate').value)) {
      this.form.get('boReleaseDateValue')[this.params][FccGlobalConstant.RENDERED] = true;
      this.form.get('boReleaseDateValue').setValue(this.form.get('boReleaseDate').value.split(" ")[0]);
    }
  }

  setAttachmentIds(fileList, form) {
    const docIds = [];
    const files = fileList;
    for (const index in files) {
      if (files[index]) {
        docIds.push(files[index][FccGlobalConstant.ATTACHMENT_ID]);
      }
    }
    const attachments = { docId: docIds };
    if (attachments.docId.length >= 0){
      form.get(FccGlobalConstant.ATTACHMENTS).setValue(attachments);
      form.get(FccGlobalConstant.ATTACHMENTS).updateValueAndValidity();
    }
    if (this.PRODUCT_CODE === undefined || this.PRODUCT_CODE === null || this.PRODUCT_CODE === ''){
      this.PRODUCT_CODE = this.commonService.getQueryParametersFromKey(FccGlobalConstant.PRODUCT);
    }
    this.fileArray.setAttachmentValidations(fileList, form, this.PRODUCT_CODE);
    form.updateValueAndValidity();
  }

  markFieldTouchedandDirty(sectionForm, fieldNames: string[]) {
    fieldNames.forEach(fieldName => {
      sectionForm.get(fieldName).markAsDirty();
      sectionForm.get(fieldName).markAsTouched();
      sectionForm.get(fieldName).updateValueAndValidity();
    });
  }

  OnClickAmtFieldHandler(controlName: string) {
    if (this.getAmountOriginalValue(controlName)) {
      this.form.get(controlName).setValue(this.getAmountOriginalValue(controlName));
      this.form.get(controlName).updateValueAndValidity();
      this.form.updateValueAndValidity();
    }
  }

  OnClickAmountFieldHandler(controlName: string) {
    const iso = this.commonService.getISO(controlName, this.form);
    if(this.nonNumericCurrencyValidator){
      let amountVal = this.form.get(controlName).value;
      if(this.commonService.isNonEmptyValue(amountVal)){
        const seprator = `${this.translateService.instant('groupSeprator')}`;
        amountVal = amountVal.split(seprator).join('');
        if(this.commonService.isNonEmptyValue(amountVal.match(this.commonService.getRegexBasedOnlanguage()))){
          this.form.get(controlName).setValue(amountVal);
          this.form.get(controlName).updateValueAndValidity();
          this.form.updateValueAndValidity();
        } else {
          if (this.getAmountOriginalValue(controlName)) {
            this.form.get(controlName).setValue(this.getAmountOriginalValue(controlName));
            this.form.get(controlName).updateValueAndValidity();
            this.form.updateValueAndValidity();
          }
        }
        if(!this.commonService.isValidAmountValue(this.form, controlName, amountVal, iso,
          this.currencyDecimalplacesZero,
          this.currencyDecimalplacesThree)){
          return;
        }
      }
    }
    if (this.getAmountOriginalValue(controlName)) {
      const amount = this.getAmountOriginalValue(controlName);
      if(amount !== null && amount !== undefined && amount !== ''){
        const valueUpdated = this.currencyConverterPipe.transform(amount.toString(), iso);
        this.form.get('amount').setValue(valueUpdated);
        this.form.get(controlName).updateValueAndValidity();
        this.form.updateValueAndValidity();
      }
    }
  }

  setAmountOriginalValue(controlName: string) {
    if (this.form.get(controlName)) {
      this.form.get(controlName)[this.params][this.ORIGINAL_VALUE] = this.commonService.replaceCurrency(this.form.get(controlName).value);
    }
  }

  getAmountOriginalValue(controlName: string): string{
    return this.form.get(controlName)[this.params][this.ORIGINAL_VALUE];
  }

  setAmountLengthValidatorList(controlNames: string[]) {
    controlNames.forEach(controlName => {
      if (this.form.get(controlName) && this.form.get(controlName)[this.params][FccGlobalConstant.RENDERED] === true) {
        this.setAmountLengthValidator(controlName);
      }
    });
  }

  setAmountLengthValidator(controlName: string) {
    this.setAmountValidator(controlName);
  }

  setAmountValidator(controlName: string) {
    this.setAmountOriginalValue(controlName);
    let amountValue = this.getAmountOriginalValue(controlName);
    const amountMaxLength = this.form.get(controlName)[this.params][FccGlobalConstant.MAXLENGTH];
    if (amountValue.split('.')[1] === FccGlobalConstant.EMPTY_DECIMAL ||
    amountValue.split('.')[1] === FccGlobalConstant.EMPTY_DECIMAL_ZERO) {
      amountValue = amountValue.split('.')[0];
    }
    this.form.addFCCValidators(controlName, Validators.compose([validateAmountLength(amountValue, amountMaxLength)]), 0);
    this.form.get(controlName).updateValueAndValidity();
    this.form.updateValueAndValidity();
  }

  onClickSummary() {
    const tnxId = '';
    const tnxTypeCode = '';
    const eventTnxStatCode = '';
    const subTnxTypeCode = '';
    let parentTnxObj;
    let parentRefID = '';
    let parentProductCode = '';
    let subProductCode = '';
    this.commonService.getParentTnxInformation().subscribe(
      (parentTnx: string) => {
        parentTnxObj = parentTnx;
      }
    );
    if (parentTnxObj) {
      parentProductCode = parentTnxObj[FccGlobalConstant.PRODUCTCODE];
      parentRefID = parentTnxObj[FccGlobalConstant.CHANNELREF];
      subProductCode = parentTnxObj[FccGlobalConstant.subProductCode] == null ? '' : parentTnxObj[FccGlobalConstant.subProductCode];
    } else {
      this.commonService.getParentReferenceAsObservable().subscribe(
        (parentRef: string) => {
          parentRefID = parentRef;
        }
      );
    }
    this.commonService.openParentTransactionPopUp(parentProductCode, parentRefID, subProductCode,
      tnxId, tnxTypeCode, eventTnxStatCode, subTnxTypeCode);
  }

  // TODO :: Move these to a common file upload component - START
  showUploadedFiles() {
    const noOfFiles = this.fileArray.numberOfFiles;
    this.renderBrowseButton(noOfFiles);
    if (noOfFiles !== 0) {
      this.patchFieldParameters(this.form.get('fileUploadTable'), { columns: this.getColumns() });
      this.patchFieldParameters(this.form.get('fileUploadTable'), { data: this.getFileList() });
      this.patchFieldParameters(this.form.get('fileUploadTable'), { hasData: true });
      this.form.updateValueAndValidity();
      this.form.get('fileUploadTable').updateValueAndValidity();
      this.setAttachmentIds(this.getFileList(), this.form);
    } else {
      this.patchFieldParameters(this.form.get('fileUploadTable'), { hasData: false });
    }
}

renderBrowseButton(numberOfFiles) {
  if (numberOfFiles < this.numberOfFilesRegex) {
    this.form.get('browseButton')[this.params]['btndisable'] = false;
  }
}

onClickDownloadIcon(event, key, index) {
  const id = this.getFileList()[index].attachmentId;
  const fileName = this.getFileList()[index].fileName;
  this.commonService.downloadAttachments(id).subscribe(
    response => {
      let fileType;
      if (response.type) {
        fileType = response.type;
      } else {
        fileType = 'application/octet-stream';
      }
      const newBlob = new Blob([response.body], { type: fileType });

      // IE doesn't allow using a blob object directly as link href
      // instead it is necessary to use msSaveOrOpenBlob
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveOrOpenBlob(newBlob, fileName);
          return;
      }

      const data = window.URL.createObjectURL(newBlob);
      const link = document.createElement('a');
      link.href = data;
      link.download = fileName;
      // this is necessary as link.click() does not work on the latest firefox
      link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));

      window.URL.revokeObjectURL(data);
      link.remove();
  });
}
  protected getFileList() {
    return this.fileArray.getList();
  }

  getColumns() {
    const tableColumns = [
      {
        field: 'typePath',
        header: `${this.translateService.instant('fileType')}`,
        width: '10%'
      },
      {
        field: 'title',
        header: `${this.translateService.instant('title')}`,
        width: '30%'
      },
      {
        field: 'fileName',
        header: `${this.translateService.instant('fileName')}`,
        width: '30%'
      },
      {
        field: 'fileSize',
        header: `${this.translateService.instant('fileSize')}`,
        width: '10%'
      }];
    return tableColumns;
  }

  checkValidFileNameRegex(event) {
    return this.commonService.fileUploadHandlerService.checkAllowedCharInFileName(event, this.form, this.fileUploadRegex);
  }

  updateAmountLenghtValidation(event, controlName){
    const amountBox = this.form.get(controlName);
    if (event.key === FccGlobalConstant.DOT || event.key === FccGlobalConstant.COMMA) {
      if(!this.isDecimalNumber(amountBox.value)){
        amountBox[this.params][FccGlobalConstant.MAXLENGTH] = amountBox.value.length + (this.decimalDigits + 1);
        this.setAmountLengthValidator(controlName);
        if(event.key === FccGlobalConstant.DOT){
          amountBox.setValue(amountBox.value + FccGlobalConstant.DOT);
        } else if(event.key === FccGlobalConstant.COMMA){
          amountBox.setValue(amountBox.value + FccGlobalConstant.COMMA);
        }
      } else if(amountBox.value.length <= amountBox[this.params][FccGlobalConstant.MAXLENGTH]){
        amountBox[this.params][FccGlobalConstant.MAXLENGTH] = amountBox.value.length + this.decimalDigits;
        this.setAmountLengthValidator(controlName);
      }
    } else if (event.key === FccGlobalConstant.BACKSPACE){
      if(!this.isDecimalNumber(amountBox.value)){
        amountBox[this.params][FccGlobalConstant.MAXLENGTH] = amountBox[this.params][FccGlobalConstant.ORIGNAL_MAX_LENGTH];
        this.setAmountLengthValidator(controlName);
      } else if(this.isDecimalNumber(this.commonService.replaceCurrency(amountBox.value))){
        if(amountBox.value.length >= (amountBox[this.params][FccGlobalConstant.ORIGNAL_MAX_LENGTH] + this.decimalDigits + 1)){
          amountBox[this.params][FccGlobalConstant.MAXLENGTH] = amountBox.value.length;
        }
      }
    }
  }

  isDecimalNumber(value){
    return (value.indexOf(FccGlobalConstant.DOT) > -1 || value.indexOf(FccGlobalConstant.COMMA) > -1);
  }

  updateOriginalAmountMaxLength(controlName){
    const controlParams = this.form.get(controlName)[this.params];
    controlParams[FccGlobalConstant.ORIGNAL_MAX_LENGTH] = controlParams[FccGlobalConstant.MAXLENGTH];
  }

  updateAmountControlLength(controlName){
    const amountBox = this.form.get(controlName);
    if(this.isDecimalNumber(this.commonService.replaceCurrency(amountBox.value))){
      if(amountBox.value.length >= (amountBox[this.params][FccGlobalConstant.ORIGNAL_MAX_LENGTH] + this.decimalDigits + 1)){
        amountBox[this.params][FccGlobalConstant.MAXLENGTH] = amountBox.value.length;
      }
    }
  }
}
