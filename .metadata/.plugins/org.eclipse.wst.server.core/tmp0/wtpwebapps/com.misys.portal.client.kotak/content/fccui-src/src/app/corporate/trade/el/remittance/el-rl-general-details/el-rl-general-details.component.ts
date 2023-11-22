import { Component, OnDestroy, OnInit } from '@angular/core';
import { ElProductComponent } from '../../el-product/el-product.component';
import { ProductStateService } from '../../../lc/common/services/product-state.service';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, DialogService, DynamicDialogRef } from 'primeng';
import { CustomCommasInCurrenciesPipe } from '../../../lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { UtilityService } from '../../../lc/initiation/services/utility.service';
import { FilelistService } from '../../../lc/initiation/services/filelist.service';
import { CurrencyConverterPipe } from '../../../lc/initiation/pipes/currency-converter.pipe';
import { ElProductService } from '../../services/el-product.service';
import { EventEmitterService } from '../../../../../common/services/event-emitter-service';
import { CommonService } from '../../../../../common/services/common.service';
import { SearchLayoutService } from '../../../../../common/services/search-layout.service';
import { ResolverService } from '../../../../../common/services/resolver.service';
import { FccGlobalConstant } from '../../../../../common/core/fcc-global-constants';
import { FCCFormGroup } from '../../../../../base/model/fcc-control.model';
import { DocumentDetailsMap } from '../../../lc/initiation/services/documentmdetails';
import { CodeData } from '../../../../../common/model/codeData';
import { ConfirmationDialogComponent } from '../../../lc/initiation/component/confirmation-dialog/confirmation-dialog.component';
import { LeftSectionService } from '../../../../common/services/leftSection.service';
import { HOST_COMPONENT } from './../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-rl-general-details',
  templateUrl: './../../../../../base/model/form.render.html',
  styleUrls: ['./el-rl-general-details.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: ElRlGeneralDetailsComponent }]
})
export class ElRlGeneralDetailsComponent extends ElProductComponent implements OnInit, OnDestroy {

  form: FCCFormGroup;
  module = `${this.translateService.instant(FccGlobalConstant.RL_GENERAL_DETAILS)}`;
  mode;
  productCode;
  documentModel: DocumentDetailsMap;
  btndisable = 'btndisable';
  codeData = new CodeData();
  name = 'name';
  validationErrorFlag = false;
  btnFlag = false;
  documentFormValid = true;
  dataParam = 'data';
  tnxTypeCode: any;
  option: string;
  subTnxType: any;
  iso: any;
  type = 'type';
  documentDetails: any;
  tnxAmtValue;

  constructor(protected eventEmitterService: EventEmitterService, protected productStateService: ProductStateService,
              protected commonService: CommonService, protected translateService: TranslateService,
              protected confirmationService: ConfirmationService, protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe,
              protected searchLayoutService: SearchLayoutService, protected utilityService: UtilityService,
              protected resolverService: ResolverService, protected fileListSvc: FilelistService, protected dialogRef: DynamicDialogRef,
              protected currencyConverterPipe: CurrencyConverterPipe, protected elProductService: ElProductService,
              public dialogService: DialogService, protected leftSectionService: LeftSectionService) {
    super(eventEmitterService, productStateService, commonService, translateService, confirmationService,
      customCommasInCurrenciesPipe, searchLayoutService, utilityService, resolverService, fileListSvc,
      dialogRef, currencyConverterPipe, elProductService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.initializeFormGroup();
    if (this.commonService.isNonEmptyValue(this.subTnxType) && this.subTnxType !== '') {
      this.form.get(FccGlobalConstant.SUB_TRANSACTION_TYPE_CODE).setValue(this.subTnxType);
    }
    this.iso = this.stateService.getValue(FccGlobalConstant.RL_GENERAL_DETAILS, FccGlobalConstant.CURRENCY, false);
    if (this.mode === FccGlobalConstant.DRAFT_OPTION) {
      this.onBlurTnxAmt();
      this.loadDraftFormAndSetErrors();
      if (this.form.get(FccGlobalConstant.TNX_AMT) && this.form.get(FccGlobalConstant.TNX_AMT).value &&
       this.stateService.getControl(FccGlobalConstant.RL_INSTRUCTIONS, FccGlobalConstant.NAR_TAB_CONTROL_ADD_INST, false) &&
      this.stateService.getControl(FccGlobalConstant.RL_INSTRUCTIONS, FccGlobalConstant.NAR_TAB_CONTROL_ADD_INST, false).value !==
      ('' || null || undefined)){
        this.leftSectionService.reEvaluateProgressBar.next(true);
      } else if (this.stateService.getControl(FccGlobalConstant.RL_INSTRUCTIONS, FccGlobalConstant.NAR_TAB_CONTROL_ADD_INST, false) &&
      this.stateService.getControl(FccGlobalConstant.RL_INSTRUCTIONS, FccGlobalConstant.NAR_TAB_CONTROL_ADD_INST, false).value
       !== ('' || null || undefined)){
        this.leftSectionService.reEvaluateProgressBar.next(true);
      }
    }
  }
  loadDraftFormAndSetErrors() {
    try {
    this.form.get(FccGlobalConstant.documentTableDetails)[this.params][this.dataParam] = this.documentList();
    const documentArr = this.form.get(FccGlobalConstant.documentTableDetails)[FccGlobalConstant.PARAMS][FccGlobalConstant.DATA];
    for (let i = 0; i < documentArr.length; i++) {
      this.onkeyUpTextField('', '', documentArr[i]);
      if (this.validationErrorFlag) {
        break;
      }
    }
    } catch (err) {
      // Do nothing
    }
  }

  initializeFormGroup() {
    this.productCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.PRODUCT);
    this.mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    this.tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    this.subTnxType = this.commonService.getQueryParametersFromKey(FccGlobalConstant.SUB_TRANSACTION_TYPE_CODE);
    const sectionName = FccGlobalConstant.RL_GENERAL_DETAILS;
    this.form = this.stateService.getSectionData(sectionName);
    this.form.get(FccGlobalConstant.ORG_AMOUNT_FIELD).setValue(this.currencyConverterPipe.transform(this.form.get(FccGlobalConstant.AVL_AMT)
    .value.toString(), this.iso));
    if ( FccGlobalConstant.INITIATE !== this.mode && FccGlobalConstant.LENGTH_0 === this.fileListSvc.numberOfDocuments) {
      if ( this.form.get(FccGlobalConstant.DOCUMENTS).value) {
          this.documentDetails = this.form.get(FccGlobalConstant.DOCUMENTS).value;
          if (this.documentDetails) {
            const documentsJSON = JSON.parse(this.documentDetails);
            if (documentsJSON.document.length > FccGlobalConstant.LENGTH_0) {
              documentsJSON.document.forEach(element => {
                const selectedJson: { documentType: any, numOfOriginals: any,
                  numOfPhotocopies: any, documentName: any, total: any} = {
                  documentType: element.doc_code ? element.doc_code : element.code,
                  numOfOriginals: element.first_mail,
                  numOfPhotocopies: element.second_mail,
                  documentName: element.name,
                  total: element.total
                };
                this.documentModel = new DocumentDetailsMap('', '', selectedJson[FccGlobalConstant.DOCUMENT_TYPE],
                  selectedJson[FccGlobalConstant.NUM_OF_ORIGINALS], selectedJson[FccGlobalConstant.NUM_OF_PHOTOCOPIES],
                  '', selectedJson[FccGlobalConstant.DOCUMENT_NAME],
                  selectedJson[FccGlobalConstant.TOTAL_NO_OF_DOCUMENTS], '', false, FccGlobalConstant.LENGTH_0);
                this.fileListSvc.pushDocumentDetailsMap(this.documentModel);
              });
              this.handleDocumentUploadgrid();
              this.form.updateValueAndValidity();
            } else if (Object.keys(documentsJSON[FccGlobalConstant.DOCUMENT]).length > 0 && documentsJSON.constructor === Object) {
                const selectedJson: {documentType: any, numOfOriginals: any,
                  numOfPhotocopies: any, documentName: any, total: any } = {
                  documentType: documentsJSON.document[FccGlobalConstant.CODE],
                  numOfOriginals: documentsJSON.document[FccGlobalConstant.FIRST_MAIL],
                  numOfPhotocopies: documentsJSON.document[FccGlobalConstant.SECOND_MAIL],
                  documentName: documentsJSON.document[FccGlobalConstant.NAME],
                  total: documentsJSON.document[FccGlobalConstant.TOTAL_NO_OF_DOCUMENTS],
                };
                this.documentModel = new DocumentDetailsMap('', '', selectedJson[FccGlobalConstant.DOCUMENT_TYPE],
                selectedJson[FccGlobalConstant.NUM_OF_ORIGINALS], selectedJson[FccGlobalConstant.NUM_OF_PHOTOCOPIES],
                '', selectedJson[FccGlobalConstant.DOCUMENT_NAME], selectedJson[FccGlobalConstant.TOTAL_NO_OF_DOCUMENTS],
                '', false, FccGlobalConstant.LENGTH_0);
                this.fileListSvc.pushDocumentDetailsMap(this.documentModel);
                this.handleDocumentUploadgrid();
                this.form.updateValueAndValidity();
            }
          }
        }
      }
    }

  onClickAddDocumentsBtn() {
    this.documentModel = new DocumentDetailsMap('', '',
    this.form.get(FccGlobalConstant.documentTableDetails)[FccGlobalConstant.PARAMS][
      FccGlobalConstant.SUB_CONTROLS_DETAILS
    ][0][FccGlobalConstant.DOCUMENT_TYPE][FccGlobalConstant.DEFAULT_VALUE],
    null, null , null, null, null, null, false, FccGlobalConstant.LENGTH_0);
    if (FccGlobalConstant.LENGTH_0 !== this.fileListSvc.numberOfDocuments) {
      this.fileListSvc.documentDetailsMap.unshift(this.documentModel);
    } else {
      this.fileListSvc.pushDocumentDetailsMap(this.documentModel);
    }
    this.handleDocumentUploadgrid();
    this.form.get(FccGlobalConstant.ADD_DOCUMENT_BUTTON)[FccGlobalConstant.PARAMS][this.btndisable] = true;
  }
  handleDocumentUploadgrid() {
    this.codeData.codeId = FccGlobalConstant.CODEDATA_DOCUMENT_CODES_C064;
    this.codeData.productCode = this.productCode;
    this.codeData.subProductCode = FccGlobalConstant.SUBPRODUCT_DEFAULT;
    this.codeData.language = localStorage.getItem(FccGlobalConstant.LANGUAGE) !== null ?
    localStorage.getItem(FccGlobalConstant.LANGUAGE) : '';
    const eventDataArray = [];
    this.commonService.getCodeDataDetails(this.codeData).subscribe(response => {
      response.body.items.forEach(responseValue => {
          const eventData: { label: string; value: any } = {
            label: responseValue.longDesc,
            value: responseValue.value
          };
          eventDataArray.push(eventData);
        });
      });
    setTimeout(() => {
        this.form.get(FccGlobalConstant.documentTableDetails)[FccGlobalConstant.PARAMS][FccGlobalConstant.OPTIONS] = eventDataArray;
        this.responseArray = this.documentList();
        this.formModelArray = this.form.get(FccGlobalConstant.documentTableDetails)[FccGlobalConstant.PARAMS][
          FccGlobalConstant.SUB_CONTROLS_DETAILS
        ];
        this.columnsHeader = [];
        this.columnsHeaderData = [];
        this.formateResult();
        this.patchFieldParameters(this.form.get(FccGlobalConstant.documentTableDetails), { columns: this.columnsHeader });
        this.patchFieldParameters(this.form.get(FccGlobalConstant.documentTableDetails), { columnsHeaderData: this.columnsHeaderData });
        this.form.get(FccGlobalConstant.documentTableDetails)[FccGlobalConstant.PARAMS][FccGlobalConstant.DATA] = this.responseArray;
        this.form.get(FccGlobalConstant.documentTableDetails)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
        this.form.get(FccGlobalConstant.documentTableDetails)[FccGlobalConstant.PARAMS][FccGlobalConstant.TRASH_ACTION] = 'pi-trash';
        if (FccGlobalConstant.LENGTH_0 === this.fileListSvc.numberOfDocuments) {
          this.form.get(FccGlobalConstant.documentTableDetails)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
        }
        this.updateDataArray();
        this.form.updateValueAndValidity();
      }, FccGlobalConstant.LENGTH_2000);
  }
  documentList() {
    return this.fileListSvc.getDocumentList();
  }
  formateResult() {
    for (let i = 0; i < this.formModelArray.length; i++) {
      let key: any;
      key = Object.keys(this.formModelArray[i]);
      key = key[0];
      if (key === FccGlobalConstant.DOCUMENT_NAME)
        {
          const documentArr = this.form.get(FccGlobalConstant.documentTableDetails)[FccGlobalConstant.PARAMS][FccGlobalConstant.DATA];
          if (documentArr.length > 0) {
            let count = 0;
            for (let j = 0; j < documentArr.length; j++) {
              if (documentArr[j].documentType === FccGlobalConstant.OTHER_DOCUMENT_TYPE )
              {
                count++;
              }
            }
            if ( count > 0 )
            {
              this.columnsHeader.push(key);
              const headerdata = this.translateService.instant(key);
              this.columnsHeaderData.push(headerdata);
            }
          }
        } else {
          this.columnsHeader.push(key);
          const headerdata = this.translateService.instant(key);
          this.columnsHeaderData.push(headerdata);
        }
    }
    for (let i = 0; i < this.responseArray.length; i++) {
      for (let j = 0; j < this.columnsHeader.length; j++) {
        Object.defineProperty(this.responseArray[i], this.columnsHeader[j],
          { value: this.getValue(this.responseArray[i][this.columnsHeader[j]]), writable: true });
        Object.defineProperty(this.responseArray[i], this.columnsHeader[j] + 'Type',
          { value: this.getType(this.columnsHeader[j]), writable: true });
        Object.defineProperty(this.responseArray[i], this.columnsHeader[j] + 'Options',
          { value: this.getOptions(this.columnsHeader[j]), writable: true });
        Object.defineProperty(this.responseArray[i], this.columnsHeader[j] + 'Status',
          { value: this.getEditStatus(this.columnsHeader[j]), writable: true });
        Object.defineProperty(this.responseArray[i], this.columnsHeader[j] + 'Required',
          { value: this.getRequiredType(this.columnsHeader[j]), writable: true });
        Object.defineProperty(this.responseArray[i], this.columnsHeader[j] + 'Maxlength',
          { value: this.getMaxlength(this.columnsHeader[j]), writable: true });
        if (this.responseArray[i][FccGlobalConstant.DOCUMENT_TYPE] === FccGlobalConstant.OTHER_DOCUMENT_TYPE)
        {
          Object.defineProperty(this.responseArray[i], this.columnsHeader[j] + 'Disabled',
          { value: false, writable: true });
        }
        else
        {
          Object.defineProperty(this.responseArray[i], this.columnsHeader[j] + 'Disabled',
          { value: this.getDisabledStatus(this.columnsHeader[j]), writable: true });
        }
      }
    }
  }

  getValue(val: any) {
    if (val) {
      return val;
    } else {
      return '';
    }
  }

  getType(key: any) {
    let returntype;
    for (let i = 0; i < this.formModelArray.length; i++) {
      try {
        if (key.toString() === this.formModelArray[i][key][this.name].toString()) {
          returntype = this.formModelArray[i][key][this.type];
        }
      } catch (e) {
      }
    }
    return returntype;
  }
  getEditStatus(key) {
    const editStatus = 'editStatus';
    let returntype;
    for (let i = 0; i < this.formModelArray.length; i++) {
      try {
        if (key.toString() === this.formModelArray[i][key][this.name].toString()) {
          returntype = this.formModelArray[i][key][editStatus];
        }
      } catch (e) {
      }
    }
    return returntype;
  }
  getRequiredType(key: any) {
    let returnRequiredType;
    for (let i = 0; i < this.formModelArray.length; i++) {
      try {
        if (key.toString() === this.formModelArray[i][key][this.name].toString()) {
          returnRequiredType = this.formModelArray[i][key][FccGlobalConstant.REQUIRED];
        }
      } catch (e) {
      }
    }
    return returnRequiredType;
  }
  getOptions(key: any) {
    let options = [];
    for (let i = 0; i < this.formModelArray.length; i++) {
      try {
      if (FccGlobalConstant.DOCUMENT_TYPE === this.formModelArray[i][key][this.name].toString()) {
          options = this.form.get(FccGlobalConstant.documentTableDetails)[FccGlobalConstant.PARAMS][FccGlobalConstant.OPTIONS];
        }
      } catch (e) {
      }
    }
    return options;
  }
  getMaxlength(key: any) {
    let returnMaxlength;
    for (let i = 0; i < this.formModelArray.length; i++) {
      try {
        if (key.toString() === this.formModelArray[i][key][this.name].toString()) {
          returnMaxlength = this.formModelArray[i][key][FccGlobalConstant.MAXLENGTH];
        }
      } catch (e) {
      }
    }
    return returnMaxlength;
  }

  getDisabledStatus(key: any) {
    let returnDisabled;
    for (let i = 0; i < this.formModelArray.length; i++) {
      try {
        if (key.toString() === this.formModelArray[i][key][this.name].toString()) {
          returnDisabled = this.formModelArray[i][key][FccGlobalConstant.DISABLED];
        }
      } catch (e) {
      }
    }
    return returnDisabled;
  }

  onkeyUpTextField(event: any, key: any, product: any) {
    const documentTypeRequired = product[FccGlobalConstant.DOCUMENT_TYPE_REQUIRED];
    if ( (documentTypeRequired === true) && !product[FccGlobalConstant.DOCUMENT_TYPE]) {
      this.form.get(FccGlobalConstant.documentTableDetails).setErrors( { invalid: true } );
      this.patchFieldParameters(this.form.get(FccGlobalConstant.documentTableDetails), { hasError: true });
      this.patchFieldParameters(this.form.get(FccGlobalConstant.documentTableDetails),
            { message: `${this.translateService.instant('documentTypeRequired')}` });
      this.form.updateValueAndValidity();
      this.form.get(FccGlobalConstant.ADD_DOCUMENT_BUTTON)[FccGlobalConstant.PARAMS][this.btndisable] = true;
      this.validationErrorFlag = true;
    } else if ( (documentTypeRequired === true) &&
      ( product[FccGlobalConstant.DOCUMENT_TYPE] === FccGlobalConstant.OTHER_DOCUMENT_TYPE &&
      ( product[FccGlobalConstant.DOCUMENT_NAME] === undefined ||
      product[FccGlobalConstant.DOCUMENT_NAME] === null ||
      product[FccGlobalConstant.DOCUMENT_NAME] === '') ) ) {
      this.form.get(FccGlobalConstant.documentTableDetails).setErrors( { invalid: true } );
      this.patchFieldParameters(this.form.get(FccGlobalConstant.documentTableDetails), { hasError: true });
      this.patchFieldParameters(this.form.get(FccGlobalConstant.documentTableDetails),
            { message: `${this.translateService.instant('documentNameRequired')}` });
      this.form.updateValueAndValidity();
      this.form.get(FccGlobalConstant.ADD_DOCUMENT_BUTTON)[FccGlobalConstant.PARAMS][this.btndisable] = true;
      this.validationErrorFlag = true;
    } else {
      this.validateNumberOfOriginals(product);
    }
  }
  validateNumberOfOriginals(product: any) {
    const numOfOriginalsMaxlength = product[FccGlobalConstant.NUM_OF_ORIGINAL_MAX_LENGTH];
    if ( (product[FccGlobalConstant.NUM_OF_ORIGINALS] === undefined ||
        product[FccGlobalConstant.NUM_OF_ORIGINALS] === null || product[FccGlobalConstant.NUM_OF_ORIGINALS] === '')) {
      this.form.get(FccGlobalConstant.documentTableDetails).setErrors( { invalid: true } );
      this.patchFieldParameters(this.form.get(FccGlobalConstant.documentTableDetails), { hasError: true });
      this.patchFieldParameters(this.form.get(FccGlobalConstant.documentTableDetails),
        { message: `${this.translateService.instant('numOfOriginalsRequired')}` });
      this.form.updateValueAndValidity();
      this.form.get(FccGlobalConstant.ADD_DOCUMENT_BUTTON)[FccGlobalConstant.PARAMS][this.btndisable] = true;
      this.validationErrorFlag = true;
    } else if (product[FccGlobalConstant.NUM_OF_ORIGINALS].length > numOfOriginalsMaxlength) {
      this.form.get(FccGlobalConstant.documentTableDetails).setErrors( { invalid: true } );
      this.patchFieldParameters(this.form.get(FccGlobalConstant.documentTableDetails), { hasError: true });
      this.patchFieldParameters(this.form.get(FccGlobalConstant.documentTableDetails),
          { message: `${this.translateService.instant('numOfOriginalsMaxlength')}` });
      this.form.updateValueAndValidity();
      this.form.get(FccGlobalConstant.ADD_DOCUMENT_BUTTON)[FccGlobalConstant.PARAMS][this.btndisable] = true;
      this.validationErrorFlag = true;
    } else if (product[FccGlobalConstant.NUM_OF_ORIGINALS] !== '' &&
     this.commonService.isNonEmptyValue(product[FccGlobalConstant.NUM_OF_ORIGINALS])) {
      const isOriginalFieldValid =
       (product[FccGlobalConstant.NUM_OF_ORIGINALS]).match(FccGlobalConstant.NUMBER_REGEX_INCLUDING_ZERO);
      const numberOfOriginals = parseFloat(product[FccGlobalConstant.NUM_OF_ORIGINALS]);
      if (!isOriginalFieldValid || (numberOfOriginals <= FccGlobalConstant.ZERO)) {
        this.form.get(FccGlobalConstant.documentTableDetails).setErrors( { invalid: true } );
        this.patchFieldParameters(this.form.get(FccGlobalConstant.documentTableDetails), { hasError: true });
        this.patchFieldParameters(this.form.get(FccGlobalConstant.documentTableDetails),
          { message: `${this.translateService.instant('numOfOriginalsRegexFailed')}` });
        this.form.updateValueAndValidity();
        this.form.get(FccGlobalConstant.ADD_DOCUMENT_BUTTON)[FccGlobalConstant.PARAMS][this.btndisable] = true;
        this.validationErrorFlag = true;
      } else {
        this.validateNumberOfPhotocopies(product);
      }
    } else {
      this.validateNumberOfPhotocopies(product);
    }
  }
  validateNumberOfPhotocopies(product: any) {
    const numOfPhotocopiesMaxlength = product[FccGlobalConstant.NUM_OF_PHOTOCOPIES_MAX_LENGTH];
    if ( (product[FccGlobalConstant.NUM_OF_PHOTOCOPIES] === undefined ||
        product[FccGlobalConstant.NUM_OF_PHOTOCOPIES] === null || product[FccGlobalConstant.NUM_OF_PHOTOCOPIES] === '')) {
      this.form.get(FccGlobalConstant.documentTableDetails).setErrors( { invalid: true } );
      this.patchFieldParameters(this.form.get(FccGlobalConstant.documentTableDetails), { hasError: true });
      this.patchFieldParameters(this.form.get(FccGlobalConstant.documentTableDetails),
        { message: `${this.translateService.instant('numOfPhotocopiesRequired')}` });
      this.form.updateValueAndValidity();
      this.form.get(FccGlobalConstant.ADD_DOCUMENT_BUTTON)[FccGlobalConstant.PARAMS][this.btndisable] = true;
      this.validationErrorFlag = true;
    } else if (product[FccGlobalConstant.NUM_OF_PHOTOCOPIES].length > numOfPhotocopiesMaxlength) {
      this.form.get(FccGlobalConstant.documentTableDetails).setErrors( { invalid: true } );
      this.patchFieldParameters(this.form.get(FccGlobalConstant.documentTableDetails), { hasError: true });
      this.patchFieldParameters(this.form.get(FccGlobalConstant.documentTableDetails),
          { message: `${this.translateService.instant('numOfPhotocopiesMaxlength')}` });
      this.form.updateValueAndValidity();
      this.form.get(FccGlobalConstant.ADD_DOCUMENT_BUTTON)[FccGlobalConstant.PARAMS][this.btndisable] = true;
      this.validationErrorFlag = true;
    } else if (product[FccGlobalConstant.NUM_OF_PHOTOCOPIES] !== '' && product[FccGlobalConstant.NUM_OF_PHOTOCOPIES] !== null) {
        const isPhotocopiesFieldValid =
         (product[FccGlobalConstant.NUM_OF_PHOTOCOPIES]).match(FccGlobalConstant.NUMBER_REGEX_INCLUDING_ZERO);
        if (!isPhotocopiesFieldValid) {
          this.form.get(FccGlobalConstant.documentTableDetails).setErrors( { invalid: true } );
          this.patchFieldParameters(this.form.get(FccGlobalConstant.documentTableDetails), { hasError: true });
          this.patchFieldParameters(this.form.get(FccGlobalConstant.documentTableDetails),
            { message: `${this.translateService.instant('numOfPhotocopiesRegexFailed')}` });
          this.form.updateValueAndValidity();
          this.form.get(FccGlobalConstant.ADD_DOCUMENT_BUTTON)[FccGlobalConstant.PARAMS][this.btndisable] = true;
          this.validationErrorFlag = true;
        } else {
          this.invalidateErrorStateForDocumentGrid();
        }
      } else {
      this.invalidateErrorStateForDocumentGrid();
    }
  }
  invalidateErrorStateForDocumentGrid() {
    this.form.get(FccGlobalConstant.documentTableDetails).clearValidators();
    this.patchFieldParameters(this.form.get(FccGlobalConstant.documentTableDetails), { message: '' });
    this.patchFieldParameters(this.form.get(FccGlobalConstant.documentTableDetails), { hasError: false });
    this.form.updateValueAndValidity();
    this.updateDataArray();
    this.checkEachRowValue();
    if (this.btnFlag) {
    this.form.get(FccGlobalConstant.ADD_DOCUMENT_BUTTON)[FccGlobalConstant.PARAMS][this.btndisable] = false;
    }
    this.validationErrorFlag = false;
    this.documentFormValid = true;
  }
  checkEachRowValue() {
    const docArr = this.form.get(FccGlobalConstant.documentTableDetails)[FccGlobalConstant.PARAMS][FccGlobalConstant.DATA];
    this.btnFlag = true;
    for (let i = 0; i < docArr.length; i++) {
      if (!(docArr[i].numOfOriginals && docArr[i].numOfPhotocopies)) {
      this.btnFlag = false;
      break;
      }
    }
  }
  onClickTrashIcon(event: any, key: any, index: any) {
    if (key === FccGlobalConstant.documentTableDetails) {
    this.onClickMinusDocument(event, key, index);
    }
  }
  onClickMinusDocument(event: any, key: any, index: any){
    const dir = localStorage.getItem('langDir');
    const locaKeyValue = this.translateService.instant('deleteDocsConfirmationMsg');
    const dialogRef = this.dialogService.open(ConfirmationDialogComponent, {
      header: `${this.translateService.instant('deletedocs')}`,
      width: '35em',
      styleClass: 'fileUploadClass',
      style: { direction: dir },
      data: { locaKey: locaKeyValue }
    });
    dialogRef.onClose.subscribe((result: any) => {
      if (result.toLowerCase() === 'yes') {
        if (index !== null) {
          this.fileListSvc.documentDetailsMap.splice(index, 1);
          if (this.fileListSvc.numberOfDocuments === 0) {
            this.form.get(FccGlobalConstant.documentTableDetails)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
            this.form.get(FccGlobalConstant.ADD_DOCUMENT_BUTTON)[FccGlobalConstant.PARAMS][this.btndisable] = false;
            this.invalidateErrorStateForDocumentGrid();
          } else {
            this.form.get(FccGlobalConstant.documentTableDetails)[this.params][this.dataParam] = this.documentList();
            const documentArr = this.form.get(FccGlobalConstant.documentTableDetails)[FccGlobalConstant.PARAMS][FccGlobalConstant.DATA];
            let documentFormValidFlag = true;
            for (let i = 0; i < documentArr.length; i++)
            {
              this.onkeyUpTextField('', '', documentArr[i]);
              if (this.validationErrorFlag === true)
              {
                documentFormValidFlag = false;
                break;
              }
            }
            if (documentFormValidFlag === true )
            {
              this.documentFormValid = true;
            }
          }
          this.handleDocumentUploadgrid();
          this.updateDataArray();
          this.setValidations();
        }
      }
    });
  }
  fileList() {
    return this.fileListSvc.getList();
  }
  checkFormMandatoryFields(fieldValue: any, fieldRequired: any) {
    if (!(fieldValue && fieldValue !== null && fieldValue !== '' &&
        fieldRequired && fieldRequired != null && fieldRequired !== '')) {
          this.form.get(FccGlobalConstant.documentTableDetails).setErrors( { invalid: true } );
          this.documentFormValid = false;
        }
  }
  setValidations() {
    const documentArr = this.form.get(FccGlobalConstant.documentTableDetails)[FccGlobalConstant.PARAMS][FccGlobalConstant.DATA];
    if (documentArr.length > FccGlobalConstant.LENGTH_0) {
      for (let i = 0; i < documentArr.length; i++) {
        const numOfOriginals = documentArr[i].numOfOriginals;
        const numOfPhotocopies = documentArr[i].numOfPhotocopies;
        const docType = documentArr[i].documentType;
        const documentTypeRequired = documentArr[i].documentTypeRequired;
        const docname = documentArr[i].documentName;
        const numOfOriginalsRequired = true;
        const numOfPhotocopiesRequired = true;
        const documentnameRequired = true;
        this.checkFormMandatoryFields(docType, documentTypeRequired);
        this.checkFormMandatoryFields(numOfOriginals, numOfOriginalsRequired);
        this.checkFormMandatoryFields(numOfPhotocopies, numOfPhotocopiesRequired);
        this.validateOriginals(numOfOriginals);
        this.validatephotocopies(numOfPhotocopies);
        if (this.documentFormValid) {
          this.form.get(FccGlobalConstant.documentTableDetails).setErrors(null);
          this.form.get(FccGlobalConstant.ADD_DOCUMENT_BUTTON)[FccGlobalConstant.PARAMS][this.btndisable] = false;
        }
        if (docType === FccGlobalConstant.OTHER_DOCUMENT_TYPE)
        {
          this.checkFormMandatoryFields(docname, documentnameRequired);
        }
        else
        {
          this.form.get(FccGlobalConstant.ADD_DOCUMENT_BUTTON)[FccGlobalConstant.PARAMS][this.btndisable] = true;
        }
      }
    } else if (this.tnxTypeCode !== FccGlobalConstant.N002_AMEND ) {
      this.form.get(FccGlobalConstant.documentTableDetails).setErrors( { invalid: true } );
    }
  }
  validateOriginals(Originals: any)
  {
    if (Originals !== '' && this.commonService.isNonEmptyValue(Originals))
    {
      const isOriginalFieldValid =
      (Originals).match(FccGlobalConstant.NUMBER_REGEX_INCLUDING_ZERO);
      const numberOfOriginals = parseFloat(Originals);
      if (!isOriginalFieldValid || (numberOfOriginals <= FccGlobalConstant.ZERO))
      {
        this.form.get(FccGlobalConstant.documentTableDetails).setErrors( { invalid: true } );
        this.documentFormValid = false;
      }
    }
  }
  validatephotocopies(Photocopies: any)
  {
    if (Photocopies !== '' && this.commonService.isNonEmptyValue(Photocopies))
    {
      const isPhotocopiesFieldValid =
      (Photocopies).match(FccGlobalConstant.NUMBER_REGEX_INCLUDING_ZERO);
      if (!isPhotocopiesFieldValid)
      {
        this.form.get(FccGlobalConstant.documentTableDetails).setErrors( { invalid: true } );
        this.documentFormValid = false;
      }
    }
  }
  onBlurTnxAmt(){
    // const amtValue = this.form.get('tnxAmt').value;
    this.tnxAmtValue = this.form.get(FccGlobalConstant.TNX_AMT).value;
    this.tnxAmtValue = this.commonService.replaceCurrency(this.tnxAmtValue);
    if (this.tnxAmtValue !== '' && this.tnxAmtValue !== null && this.tnxAmtValue !== undefined) {
        this.tnxAmtValue = parseFloat(this.tnxAmtValue);
      }
    this.form.get(FccGlobalConstant.TNX_AMT).setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
    this.form.get(FccGlobalConstant.TNX_AMT).setValue(this.tnxAmtValue);
    this.form.get(FccGlobalConstant.TNX_AMT).updateValueAndValidity();
    if (this.form.get(FccGlobalConstant.TNX_AMT) && this.form.get(FccGlobalConstant.TNX_AMT).value <= 0) {
      this.form.get(FccGlobalConstant.TNX_AMT).setErrors({ amountCanNotBeZero: true });
      this.form.updateValueAndValidity();
    }
    else if ((this.tnxAmtValue && this.tnxAmtValue < 0) || !this.tnxAmtValue) {
      this.form.get(FccGlobalConstant.TNX_AMT).setErrors({ invalidAmt: true });
      this.form.updateValueAndValidity();
    }
    else if (this.form.get(FccGlobalConstant.TNX_AMT) && this.form.get(FccGlobalConstant.TNX_AMT).value > 0){
    this.form.get(FccGlobalConstant.TNX_AMT).
    setValue(this.currencyConverterPipe.transform(this.form.get(FccGlobalConstant.TNX_AMT).value.toString(), this.iso));
    const availableAmt = parseFloat(this.commonService.replaceCurrency(this.form.get(FccGlobalConstant.AVL_AMT).value));
    const docAmt = parseFloat(this.commonService.replaceCurrency(this.form.get(FccGlobalConstant.TNX_AMT).value));
    if (docAmt && availableAmt && docAmt > availableAmt){
      const validationError = { documentAmtGreaterThanAvailableAmt:true };
      this.form.addFCCValidators(FccGlobalConstant.TNX_AMT, Validators.compose([() =>validationError]), 0);
      this.form.get(FccGlobalConstant.TNX_AMT).markAsDirty();
      this.form.get(FccGlobalConstant.TNX_AMT).markAsTouched();
      this.form.get(FccGlobalConstant.TNX_AMT).updateValueAndValidity();
      this.form.get(FccGlobalConstant.TNX_AMT).setErrors({ documentAmtGreaterThanAvailableAmt: true });
      this.form.updateValueAndValidity();
    }
  }
  }
  updateDataArray() {
    const finalArr = [];
    const documentArr = this.form.get(FccGlobalConstant.documentTableDetails)[FccGlobalConstant.PARAMS][FccGlobalConstant.DATA];
    for (let i = 0; i < documentArr.length; i++) {
      const obj = {};
      obj[FccGlobalConstant.FIRST_MAIL] = documentArr[i].numOfOriginals;
      obj[FccGlobalConstant.SECOND_MAIL] = documentArr[i].numOfPhotocopies;
      const numOfOriginals = parseInt(documentArr[i].numOfOriginals, 10);
      const numOfPhotocopies = parseInt(documentArr[i].numOfPhotocopies, 10);
      const total = numOfOriginals + numOfPhotocopies;
      obj[FccGlobalConstant.TOTAL_NO_OF_DOCUMENTS] = total.toString();
      obj[FccGlobalConstant.DOC_CODE] = documentArr[i].documentType;
      obj[FccGlobalConstant.NAME] = documentArr[i].documentName;
      finalArr.push(obj);
    }
    let obj2 = {};
    obj2[FccGlobalConstant.DOCUMENT] = finalArr;
    obj2 = JSON.stringify(obj2);
    this.form.get(FccGlobalConstant.DOCUMENTS).setValue(obj2);
    this.form.updateValueAndValidity();
  }
  ngOnDestroy() {
    this.setValidations();
    this.stateService.setStateSection(FccGlobalConstant.RL_GENERAL_DETAILS, this.form);
  }
  onChangeDropdownField(event: any, key: any, editTableRow: any) {
    if (key.toString() === 'documentType')
    {
      if (event && (event.value === FccGlobalConstant.OTHER_DOCUMENT_TYPE ||
        (event.srcElement && event.srcElement.innerText === this.translateService.instant(FccGlobalConstant.CODEDATA_C064_DEFAULT)))) {
      this.handleDocumentUploadgrid();
      setTimeout(() => {
        editTableRow[FccGlobalConstant.DOCUMENT_NAME_DISABLED] = false;
        this.form.updateValueAndValidity();
      }, FccGlobalConstant.LENGTH_2000);
    } else {
      this.handleDocumentUploadgrid();
      setTimeout(() => {
      editTableRow[FccGlobalConstant.DOCUMENT_NAME_DISABLED] = true;
      editTableRow[FccGlobalConstant.DOCUMENT_NAME] = '';
    }, FccGlobalConstant.LENGTH_2000);
    }
      this.onkeyUpTextField(event, key , editTableRow);
  }
  }
}
