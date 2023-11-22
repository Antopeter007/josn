import { Component, OnDestroy, OnInit } from '@angular/core';
import { FccGlobalConstant } from './../../../../../common/core/fcc-global-constants';
import { CommonService } from './../../../../../common/services/common.service';
import { HOST_COMPONENT } from './../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, DialogService, DynamicDialogRef } from 'primeng';
import { FCCFormGroup } from './../../../../../base/model/fcc-control.model';
import { ElProductComponent } from '../../el-product/el-product.component';
import { EventEmitterService } from './../../../../../common/services/event-emitter-service';
import { ProductStateService } from '../../../lc/common/services/product-state.service';
import { CustomCommasInCurrenciesPipe } from '../../../lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { UtilityService } from '../../../lc/initiation/services/utility.service';
import { SearchLayoutService } from '../../../../../common/services/search-layout.service';
import { ResolverService } from '../../../../../common/services/resolver.service';
import { CurrencyConverterPipe } from '../../../lc/initiation/pipes/currency-converter.pipe';
import { FilelistService } from '../../../lc/initiation/services/filelist.service';
import { ElProductService } from '../../services/el-product.service';
import { LeftSectionService } from './../../../../common/services/leftSection.service';
import { EntityDropDown, MultiBankService, MultiBankServiceDropDown } from '../../../../../common/services/multi-bank.service';
import { DropDownAPIService } from '../../../../../common/services/dropdownAPI.service';
import { FccTaskService } from '../../../../../common/services/fcc-task.service';
import { LcConstant } from '../../../lc/common/model/constant';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FccGlobalConstantService } from './../../../../../common/core/fcc-global-constant.service';
import { Validators } from '@angular/forms';


@Component({
  selector: 'app-el-mt700-general-details',
  templateUrl: './el-mt700-general-details.component.html',
  styleUrls: ['./el-mt700-general-details.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: ElMT700GeneralDetailsComponent }]
})
export class ElMT700GeneralDetailsComponent extends ElProductComponent implements OnInit, OnDestroy {
  mode: any;
  module = `${this.translateService.instant(FccGlobalConstant.LI_GENERAL_DETAILS)}`;
  form: FCCFormGroup;
  lcConstant = new LcConstant();
  entities: EntityDropDown[] = [];
  corporateBanks = [];
  readonly = this.lcConstant.readonly;
  disabled = this.lcConstant.disabled;
  rendered = this.lcConstant.rendered;
  tnxTypeCode: any;
  corporateReferences = [];
  entityName: any;
  parameters: any;
  private readonly VALUE = 'value';
  private readonly ENTITY_SHORT_NAME = 'entityShortName';
  private readonly ENTITY_NAME = 'entityName';
  private readonly BANKS = 'banks';
  private readonly BANK_NAME = 'bankName';
  private readonly BANK_SHORT_NAME = 'bankShortName';
  private readonly REFERENCES = 'references';
  private readonly REFERENCE_DESCRIPTION = 'referenceDescription';
  private readonly REFERENCE_KEY = 'referenceKey';
  private bankReferenceMap: Map<string, MultiBankServiceDropDown[]> = new Map();
  private entityBankMap: Map<string, MultiBankServiceDropDown[]> = new Map();
  responseStatusCode = 200;
  custRefRegex: any;
  custRefLength: any;

  constructor(protected eventEmitterService: EventEmitterService, protected productStateService: ProductStateService,
              protected commonService: CommonService, protected translateService: TranslateService,
              protected confirmationService: ConfirmationService, protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe,
              protected searchLayoutService: SearchLayoutService, protected utilityService: UtilityService,
              protected resolverService: ResolverService, protected fileListSvc: FilelistService, protected dialogRef: DynamicDialogRef,
              protected currencyConverterPipe: CurrencyConverterPipe, protected taskService: FccTaskService,
              protected multiBankService: MultiBankService, protected http: HttpClient,
              protected elProductService: ElProductService, protected dropDownAPIservice: DropDownAPIService,
              public dialogService: DialogService, protected leftSectionService: LeftSectionService,
              protected fccGlobalConstantService: FccGlobalConstantService) {
super(eventEmitterService, productStateService, commonService, translateService, confirmationService,
customCommasInCurrenciesPipe, searchLayoutService, utilityService, resolverService, fileListSvc,
dialogRef, currencyConverterPipe, elProductService);
    }

  ngOnInit(): void {
    this.hideNavigation(FccGlobalConstant.NO.toLowerCase());
    this.mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    this.tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    this.initializeFormGroup();
    this.setEntity();
  }
  initializeFormGroup() {
    const sectionName = FccGlobalConstant.EL_MT700_GENERAL_DETAILS;
    this.form = this.stateService.getSectionData(sectionName);
    const entity = this.form.get('entity').value;
    if (this.commonService.isEmptyValue(entity)) {
      this.fileListSvc.resetList();
      this.fileListSvc.resetELMT700List();
    }

    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.custRefRegex = response.customerReferenceRegex;
        this.custRefLength = response.customerReferenceLength;
        this.form.addFCCValidators(FccGlobalConstant.CUSTOMER_REF, Validators.pattern(this.custRefRegex), 0);
        this.form.addFCCValidators(FccGlobalConstant.CUSTOMER_REF, Validators.maxLength(this.custRefLength), 0);
        this.form.get(FccGlobalConstant.CUSTOMER_REF).updateValueAndValidity();
      }
    });
  }

  public getParameters(): Observable<any> {
    const URL = this.fccGlobalConstantService.corporateBank;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': FccGlobalConstant.APP_JSON,
      }),
      params: new HttpParams()
        .set('productCode', FccGlobalConstant.PRODUCT_EL)
        .set('subProductCode', FccGlobalConstant.EMPTY_STRING)
    };
    return this.http.get<any>(URL, httpOptions);
  }

  async setEntity() {
    this.entities = [];
    await this.getParameters().toPromise().then(res => {
      this.parameters = res.items;
      Object.keys(res.items).forEach(item => {
          const itemObj = res.items[item];
          if (itemObj[this.ENTITY_SHORT_NAME]) {
            const entityObj: EntityDropDown = {
              label: itemObj[this.ENTITY_SHORT_NAME],
              value: {
                label: itemObj[this.ENTITY_SHORT_NAME],
                name: itemObj[this.ENTITY_NAME],
                shortName: itemObj[this.ENTITY_SHORT_NAME]
              }
            };
            this.entities.push(entityObj);
          }
        });
    });
    this.form.get('entity')[FccGlobalConstant.PARAMS][FccGlobalConstant.OPTIONS] = this.entities;
    this.patchFieldParameters(this.form.get('entity'), { options: this.entities });
    const valObj = this.dropDownAPIservice.getDropDownFilterValueObj(this.entities, 'entity', this.form);
    if (valObj) {
      this.form.get('entity').patchValue(valObj[this.VALUE]);
      this.multiBankService.setCurrentEntity(valObj[this.VALUE].shortName);
    }
    if (this.entities.length === 0) {
      if (this.form.get('entity')) {
        this.form.get('entity')[this.params][this.rendered] = false;
        this.setMandatoryField(this.form, 'entity', false);
        this.form.get('entity').clearValidators();
        this.form.get('entity').updateValueAndValidity();
      }
    } else if (this.entities.length === 1) {
      this.form.get('entity')[this.params][FccGlobalConstant.REQUIRED] = true;
      this.form.get('entity')[this.params][FccGlobalConstant.RENDERED] = true;
      this.form.get('entity')[this.params][FccGlobalConstant.DISABLED] = true;
      this.form.get('entity').setValue({ label: this.entities[0].value.label, name: this.entities[0].value.name,
        shortName: this.entities[0].value.shortName });
      this.form.get('entity').patchValue(this.entities[0].value);
      this.form.get('entity')[this.params][this.readonly] = true;
      this.multiBankService.setCurrentEntity(this.entities[0].value.shortName);
      this.form.get('entity').updateValueAndValidity();
    } else if (this.entities.length > 1) {
      this.form.get('entity')[this.params][FccGlobalConstant.REQUIRED] = true;
      this.form.get('entity')[this.params][FccGlobalConstant.RENDERED] = true;
    }
    this.setAdvisingBanks();
    this.setReference();
  }
  setReference() {
    const entityVal = this.form.get('entity').value;
    const advBankVal = this.form.get('advisingBankNameList').value;
    let refList: any;
    if (entityVal){
      refList = this.bankReferenceMap.get(entityVal.name + advBankVal);
    } else {
      refList = this.bankReferenceMap.get(advBankVal);
    }
    this.form.get('issuerReferenceList')[FccGlobalConstant.PARAMS][FccGlobalConstant.OPTIONS] = refList;
    this.patchFieldParameters(this.form.get('issuerReferenceList'), { options: refList });
    if (refList.length === 1) {
      this.form.get('issuerReferenceList')[this.params][this.disabled] = true;
      this.form.get('issuerReferenceList').setValue(refList[0].value);
      this.form.get('issuerReferenceList').patchValue(refList[0].value);
      this.form.get('issuerReferenceList')[this.params][this.readonly] = true;
      this.form.get('issuerReferenceList').updateValueAndValidity();
    } else {
      this.form.get('issuerReferenceList')[this.params][this.disabled] = false;
    }
    this.form.get('issuerReferenceList').updateValueAndValidity();
  }

  setAdvisingBanks() {
    let bankLists: MultiBankServiceDropDown[] = [];
    this.parameters.forEach(item => {
      Object.keys(item[this.BANKS]).forEach(ele => {
        const bank = item[this.BANKS][ele];
        const bankList: MultiBankServiceDropDown = {
          label: bank[this.BANK_NAME],
          value: bank[this.BANK_SHORT_NAME]
        };
        bankLists.push(bankList);
        this.populateBankRefenceMap(item[this.ENTITY_NAME], bankList.value, bank[this.REFERENCES]);
      });
      this.entityBankMap.set(item[this.ENTITY_NAME], bankLists);
      bankLists = [];
    });
    this.setAdvisingBank();
  }
  populateBankRefenceMap(entityName: string, bankName: string, referenceObj) {
    const referencesLists: MultiBankServiceDropDown[] = [];
    if (referenceObj) {
      Object.keys(referenceObj).forEach(index => {
        const reference = referenceObj[index];
        const referencesList: MultiBankServiceDropDown = {
          label: reference[this.REFERENCE_DESCRIPTION],
          value: reference[this.REFERENCE_KEY]
        };
        referencesLists.push(referencesList);
      });
      if (!this.commonService.isEmptyValue(entityName)){
        this.bankReferenceMap.set(entityName + bankName, referencesLists);
      } else {
        this.bankReferenceMap.set(bankName, referencesLists);
      }
    }
  }

  onKeyupEntity(event) {
    const keycodeIs = event.which || event.keyCode;
    if (keycodeIs === this.lcConstant.thirtyEight || keycodeIs === this.lcConstant.forty) {
      this.onClickEntityForAccessibility(this.form.get('entity').value);
    }
  }

  onClickEntityForAccessibility(values) {
    if (values) {
      this.multiBankService.setCurrentEntity(values.shortName);
      // sync with task entity TODO: revisit
      this.taskService.setTaskEntity(values);
      this.patchFieldValueAndParameters(this.form.get('entity'), values.name, {});
      this.form.get('entity').setValue(values);
      this.form.get('entity').patchValue(values);
      this.form.get('entity').updateValueAndValidity();
      this.setAdvisingBank();
      this.setReference();
    }
  }

  onClickEntity(event) {
    if (event.value) {
      this.multiBankService.setCurrentEntity(event.value.shortName);
      // sync with task entity TODO: revisit
      this.taskService.setTaskEntity(event.value);
      this.patchFieldValueAndParameters(this.form.get('entity'), event.value.name, {});
      this.form.get('entity').setValue(event.value);
      this.form.get('entity').patchValue(event.value);
      this.form.get('entity').updateValueAndValidity();
      this.setAdvisingBank();
      this.setReference();
    }
  }
  setAdvisingBank() {
    let AdvBankList: any;
    const entityVal = this.form.get('entity').value;
    if (entityVal){
      AdvBankList = this.entityBankMap.get(entityVal.name);
    } else {
      const newMap: Map<string, MultiBankServiceDropDown[]> = new Map();
      for (const value of this.entityBankMap.values()){
        newMap.set('nonEntity', value);
      }
      AdvBankList = newMap.get('nonEntity');
    }
    this.form.get('advisingBankNameList')[FccGlobalConstant.PARAMS][FccGlobalConstant.OPTIONS] = AdvBankList;
    this.patchFieldParameters(this.form.get('advisingBankNameList'), { options: AdvBankList });
    const valObj = this.dropDownAPIservice.getDropDownFilterValueObj(AdvBankList, 'advisingBankNameList', this.form);
    if (valObj) {
      this.form.get('advisingBankNameList').patchValue(valObj[this.VALUE]);
      this.multiBankService.setCurrentEntity(valObj[this.VALUE].shortName);
    }
    if (AdvBankList.length === 1) {
      this.form.get('advisingBankNameList')[this.params][FccGlobalConstant.REQUIRED] = true;
      this.form.get('advisingBankNameList')[this.params][FccGlobalConstant.RENDERED] = true;
      this.form.get('advisingBankNameList')[this.params][FccGlobalConstant.DISABLED] = true;
      this.form.get('advisingBankNameList').setValue(AdvBankList[0].value);
      this.form.get('advisingBankNameList').patchValue(AdvBankList[0].value);
      this.form.get('advisingBankNameList')[this.params][this.readonly] = true;
      this.form.get('advisingBankNameList').updateValueAndValidity();
    } else if (AdvBankList.length > 1) {
      this.form.get('advisingBankNameList')[this.params][FccGlobalConstant.REQUIRED] = true;
      this.form.get('advisingBankNameList')[this.params][FccGlobalConstant.RENDERED] = true;
    }
  }

  onKeyupAdvisingBankNameList(event) {
    const keycodeIs = event.which || event.keyCode;
    if (keycodeIs === this.lcConstant.thirtyEight || keycodeIs === this.lcConstant.forty) {
      this.onClickAdvisingBankNameListForAccessibility(this.form.get('advisingBankNameList').value);
    }
  }

  onClickAdvisingBankNameListForAccessibility(values) {
    if (values) {
      this.patchFieldValueAndParameters(this.form.get('advisingBankNameList'), values.value, {});
      this.form.get('advisingBankNameList').updateValueAndValidity();
    }
  }

  onClickAdvisingBankNameList(event) {
    if (event.value) {
      // sync with task entity TODO: revisit
      this.patchFieldValueAndParameters(this.form.get('advisingBankNameList'), event.value.value, {});
      this.form.get('advisingBankNameList').setValue(event.value.value);
      this.form.get('advisingBankNameList').patchValue(event.value.value);
      this.form.get('advisingBankNameList').updateValueAndValidity();
      this.setReference();
    }
  }

  onClickIssuerReferenceList(event) {
    if (event.value) {
      // sync with task entity TODO: revisit
      this.patchFieldValueAndParameters(this.form.get('issuerReferenceList'), event.value, {});
      this.form.get('issuerReferenceList').setValue(event.value);
      this.form.get('issuerReferenceList').patchValue(event.value);
      this.form.get('issuerReferenceList').updateValueAndValidity();
    }
  }

  ngOnDestroy() {
    this.stateService.setStateSection(FccGlobalConstant.EL_MT700_GENERAL_DETAILS, this.form, false);
  }

  hideNavigation(mission: string) {
    setTimeout(() => {
      const ele = document.getElementById('next');
      if (ele) {
        this.commonService.announceMission(mission);
      } else {
        this.hideNavigation(mission);
      }
    }, FccGlobalConstant.LENGTH_100);
  }
}
