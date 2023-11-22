import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { FccGlobalConstantService } from '../core/fcc-global-constant.service';
import { FccGlobalConstant } from '../core/fcc-global-constants';
import { CommonService } from './common.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MultiBankService {

  constructor(protected http: HttpClient, protected fccGlobalConstantService: FccGlobalConstantService,
              protected commonService: CommonService) { }

  private readonly ENTITY_SHORT_NAME = 'entityShortName';
  private readonly ENTITY_NAME = 'entityName';
  private readonly BANK_NAME = 'bankName';
  private readonly BANK_SHORT_NAME = 'bankShortName';
  private readonly BANKS = 'banks';
  private readonly REFERENCES = 'references';
  private readonly REFERENCE_DESCRIPTION = 'referenceDescription';
  private readonly REFERENCE_KEY = 'referenceKey';
  private readonly BORROWER_REFERENCE_ID = 'referenceKey';
  private readonly BORROWER_REFERENCE_DESC = 'referenceDescription';
  private readonly BORROWER_REFERENCE = 'backOfficeReference3';
  private readonly NO_ENTITY = 'NO_ENTITY';
  private readonly ADDRESS = 'Address';
  private readonly ADDRESS_TYPE = 'addressType';
  private readonly VALUE = 'value';

  private selectedEntityName: string;
  private selectedRef: string;

  private isEntity = false;

  private entityList: EntityDropDown[] = [];
  private lendingEntityList: Set<EntityDropDown> = new Set<EntityDropDown>();
  private bankList: MultiBankServiceDropDown[] = [];
  private referenceList: MultiBankServiceDropDown[] = [];
  private borrowerReferenceList: MultiBankServiceDropDown[] = [];
  private borrowerReferenceInternalList: BorrowerRefDropDown[] = [];

  private entityBankMap: Map<string, MultiBankServiceDropDown[]> = new Map();
  private refBankMap: Map<string, MultiBankServiceDropDown[]> = new Map();
  private bankReferenceMap: Map<string, MultiBankServiceDropDown[]> = new Map();
  private refEntityMap: Map<string, Set<EntityDropDown>> = new Map();
  private addressMap: Map<string, any> = new Map();
  updateRefonEntityChange = false;
  updateRefonEntityChangeSub = new BehaviorSubject(false);
  myUpdateRefonEntityChangeSub: any;
  nameOrDesc: any;
 // private bankListProvisional = [];
  bankListProvisional: Set<string> = new Set<string>();
  entityFetched = new BehaviorSubject(false);

  // API Call
  getCustomerBankDetails(productCode: string, subProductCode: string): Observable<any> {
    const reqURL = 'customer-Banks';
    const URL = this.fccGlobalConstantService.baseUrl + reqURL;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      params: new HttpParams()
        .set('productCode', productCode)
        .set('subProductCode', subProductCode)
      // .set('entityShortName', entityShortName)
    };
    return this.http.get<any>(URL, httpOptions);
  }

  public getCustomerBankDetailsAPI(
    productCode: string,
    subProductCode: string,
    additionalheader: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'REQUEST-FROM': additionalheader
      }),
      params: new HttpParams()
        .set('productCode', productCode)
        .set('subProductCode', subProductCode)
      // .set('entityShortName', entityShortName)
    };
    return this.http.get<any>(this.fccGlobalConstantService.corporateBank, httpOptions);
  }

  getCustomerEntities(): Map<string, Set<EntityDropDown>> {
    return this.refEntityMap;
  }

  clearIssueRef() {
    this.updateRefonEntityChange = true;
  }

  getIsEntity(): boolean {
    return this.isEntity;
  }
  // Incase of non-entity: returns Empty Array
  getEntityList(): EntityDropDown[] {
    return this.entityList;
  }
  // Incase of non-entity: returns Empty Array
  getLendingEntityList(): Set<EntityDropDown> {
    return this.lendingEntityList;
  }
  getAddress(entity: string): any {
    return this.addressMap.has(entity) ? this.addressMap.get(entity) : undefined;
  }
  // Returns Bank[] for an Entity
  // Incase of non-entity: Params can be null/ undefined
  getBankList(): MultiBankServiceDropDown[] {
    return this.bankList;
  }
  // Returns Reference[] for a Bank
  getReferenceList(): MultiBankServiceDropDown[] {
    return this.referenceList;
  }

  // Returns Borrowers Reference[] for a Bank
  getBorrowerReferenceList(): MultiBankServiceDropDown[] {
    return this.borrowerReferenceList;
  }

  // Returns Borrowers Reference[] for a Bank
  getBorrowerReferenceInternalList(): BorrowerRefDropDown[] {
    return this.borrowerReferenceInternalList;
  }

  // Returns Entity Map
  getEntityBankMap() {
    return this.entityBankMap;
  }

  getRefBankMap() {
    return this.refBankMap;
  }

  async multiBankAPI(productCode, subProductCode) {
    const finalSubProductCode = subProductCode ? subProductCode : '';
    await this.getCustomerBankDetails(productCode, finalSubProductCode).toPromise().then(
      res => {
        this.initializeProcess(res);
      }
    ).catch(
      () => {
        this.clearAllData();
      }
    );
  }

  // entity = EntityDropDown.value.name
  setCurrentEntity(entityName?: string) {
    this.selectedEntityName = entityName ? entityName : this.NO_ENTITY;
    if (this.getIsEntity()) {
      this.bankList = this.entityBankMap.has(entityName) ? this.entityBankMap.get(entityName) : [];
    } else {
      this.bankList = this.entityBankMap.has(this.NO_ENTITY) ? this.entityBankMap.get(this.NO_ENTITY) : [];
    }
  }

  // bankName = DropDown.value
  setCurrentBank(bankName: string , selectEntity ?: string) {
    this.selectedEntityName = (this.selectedEntityName !== undefined) ? this.selectedEntityName : selectEntity;
    if (this.getIsEntity()) {
      this.referenceList = this.bankReferenceMap.has(this.selectedEntityName + bankName) ?
      this.bankReferenceMap.get(this.selectedEntityName + bankName) : [];
    } else {
      this.referenceList = this.bankReferenceMap.has(this.NO_ENTITY + bankName) ?
      this.bankReferenceMap.get(this.NO_ENTITY + bankName) : [];
    }
  }

  setCurrentBorrowerRefBank(refName: string) {
    this.lendingEntityList = new Set<EntityDropDown>();
    this.selectedRef = refName;
    this.bankList = this.refBankMap.has(refName) ? this.refBankMap.get(refName) : [];
    this.lendingEntityList = this.refEntityMap.has(refName) ? this.refEntityMap.get(refName) : new Set<EntityDropDown>();
  }

  // Initialize process
  initializeProcess(objs: any) {
    this.clearAllData();
    Object.keys(objs.items).forEach(item => {
      const itemObj = objs.items[item];
      if (itemObj[this.ENTITY_SHORT_NAME]) {
        this.isEntity = true;
        this.populateEntityList(itemObj);
      } else {
        this.selectedEntityName = this.NO_ENTITY;
        this.populateEntityList(itemObj, this.NO_ENTITY);
      }
    });
    this.entityFetched.next(true);
  }

  // Initialize process
  initializeLendingProcess(objs: any) {
    this.clearAllData();
    Object.keys(objs.items).forEach(item => {
      const itemObj = objs.items[item];
      if (itemObj[this.ENTITY_SHORT_NAME]) {
        this.isEntity = true;
        this.populateLendingRefList(itemObj);
      } else {
        this.selectedEntityName = this.NO_ENTITY;
        this.populateLendingRefList(itemObj, this.NO_ENTITY);
      }
    });
  }

  protected populateEntityList(itemObj: any, noEntityHeader?: string) {
    // to be revisited and refactored to consider ENTITY_ABBV_NAME and not ENTITY_NAME
    const tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    const prodCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.PRODUCT);
    if (this.getIsEntity()) {
      const entityObj: EntityDropDown = {
        label: itemObj[this.ENTITY_SHORT_NAME],
        value: {
          label: itemObj[this.ENTITY_SHORT_NAME],
          name: itemObj[this.ENTITY_NAME],
          shortName: itemObj[this.ENTITY_SHORT_NAME]
        }
      };
      this.entityList.push(entityObj);
      this.populateAddressMap(entityObj.value.shortName, itemObj[this.ADDRESS_TYPE], itemObj[this.ADDRESS]);
      if (tnxTypeCode === FccGlobalConstant.N002_AMEND && (prodCode === FccGlobalConstant.PRODUCT_SI
        || prodCode === FccGlobalConstant.PRODUCT_BG || prodCode === FccGlobalConstant.PRODUCT_EC)) {
        this.populateEntityBankMap(entityObj.value.shortName, itemObj[this.BANKS]);
      } else {
        this.populateEntityBankMap(entityObj.value.shortName, itemObj[this.BANKS]);
      }
    } else {
      this.populateEntityBankMap(noEntityHeader, itemObj[this.BANKS]);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected populateLendingRefList(itemObj: any, noEntityHeader?: string) {
    if (itemObj && itemObj[this.BANKS]) {
      const bankLists: MultiBankServiceDropDown[] = [];
      if (itemObj[this.BANKS]) {
        Object.keys(itemObj[this.BANKS]).forEach(index => {
          const bank = itemObj[this.BANKS][index];
          const bankList: MultiBankServiceDropDown = {
            label: bank[this.BANK_NAME],
            value: bank[this.BANK_SHORT_NAME]
          };
          bankLists.push(bankList);
          if (itemObj[this.BANKS][index][this.REFERENCES]) {
            Object.keys(itemObj[this.BANKS][index][this.REFERENCES]).forEach(num => {
              let refFlag = false;
              this.lendingEntityList = new Set<EntityDropDown>();
              const reference = itemObj[this.BANKS][index][this.REFERENCES][num];
              const referencesList: MultiBankServiceDropDown = {
                label: reference[this.BORROWER_REFERENCE_ID],
                value: reference[this.BORROWER_REFERENCE_ID]
              };
              const referencesInternalList: BorrowerRefDropDown = {
                label: reference[this.BORROWER_REFERENCE_DESC],
                value: reference[this.BORROWER_REFERENCE_ID],
                id: reference[this.BORROWER_REFERENCE]
              };
              Object.keys(this.borrowerReferenceList).forEach(keys => {
                if (this.borrowerReferenceList[keys][this.VALUE] === referencesList.value) {
                  refFlag = true;
                }
              });
              if (!refFlag) {
                this.borrowerReferenceList.push(referencesList);
                this.borrowerReferenceInternalList.push(referencesInternalList);
              }
              this.refBankMap.set(reference[this.BORROWER_REFERENCE_ID], bankLists);
              if (this.getIsEntity()) {
                const entityObj: EntityDropDown = {
                  label: itemObj[this.ENTITY_SHORT_NAME],
                  value: {
                    label: itemObj[this.ENTITY_SHORT_NAME],
                    name: itemObj[this.ENTITY_NAME],
                    shortName: itemObj[this.ENTITY_SHORT_NAME]
                  }
                };
                if (this.refEntityMap.has(reference[this.BORROWER_REFERENCE_ID])) {
                  for (const entityList of this.refEntityMap.get(reference[this.BORROWER_REFERENCE_ID])) {
                    this.lendingEntityList.add(entityList);
                    this.lendingEntityList.add(entityObj);
                  }
                  this.refEntityMap.set(reference[this.BORROWER_REFERENCE_ID], this.lendingEntityList);
                } else {
                  this.lendingEntityList.add(entityObj);
                  this.refEntityMap.set(reference[this.BORROWER_REFERENCE_ID], this.lendingEntityList);
                }
                this.populateAddressMap(entityObj.value.shortName, itemObj[this.ADDRESS_TYPE], itemObj[this.ADDRESS]);
              }
            });
          }
        });
      }
    }
  }

  protected populateAddressMap(entityShortName: string, addressType: any, address: any) {
    if (address) {
      const addressObj = {};
      addressObj[this.ADDRESS_TYPE] = addressType;
      addressObj[this.ADDRESS] = address;
      this.addressMap.set(entityShortName, addressObj);
    }
  }

  protected populateEntityBankMap(entityName: string, bankObj) {
    const bankLists: MultiBankServiceDropDown[] = [];
    if (bankObj) {
      Object.keys(bankObj).forEach(index => {
        const bank = bankObj[index];
        const bankList: MultiBankServiceDropDown = {
          label: bank[this.BANK_NAME],
          value: bank[this.BANK_SHORT_NAME],
          timezone: bank['timezone']
        };
        bankLists.push(bankList);
        this.bankListProvisional.add(bank[this.BANK_SHORT_NAME]);
        this.populateBankRefenceMap(entityName, bankList.value, bank[this.REFERENCES]);
      });
      this.entityBankMap.set(entityName, bankLists);
    }

    if (!this.getIsEntity()) {
      this.setCurrentEntity();
    }
  }

getProvisionalBankList() {
  return this.bankListProvisional;
}

  protected populateBankRefenceMap(entityName: string, bankName: string, referenceObj) {
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.nameOrDesc = response.DisplayIssuerRefName;
      }
    });
    const referencesLists: MultiBankServiceDropDown[] = [];
    if (referenceObj) {
      if(this.nameOrDesc == false) {
      Object.keys(referenceObj).forEach(index => {
        const reference = referenceObj[index];
        const referencesList: MultiBankServiceDropDown = {
          label: reference[this.REFERENCE_DESCRIPTION],
          value: reference[this.REFERENCE_KEY]
        };

        referencesLists.push(referencesList);
        });
      }
        else {
          Object.keys(referenceObj).forEach(index => {
          const reference = referenceObj[index];
          const referencesList: MultiBankServiceDropDown = {
            label: reference[this.REFERENCE_KEY],
            value: reference[this.REFERENCE_KEY]
          };
        referencesLists.push(referencesList);
      });
    }
    this.bankReferenceMap.set(entityName + bankName, referencesLists);
    }
  }

  clearAllData() {
    this.selectedEntityName = undefined;
    this.selectedRef = undefined;

    this.isEntity = false;
    this.updateRefonEntityChange = false;
    this.entityBankMap = new Map();
    this.refBankMap = new Map();
    this.bankReferenceMap = new Map();
    this.refEntityMap = new Map();
    this.addressMap = new Map();

    this.entityList = [];
    this.lendingEntityList = new Set<EntityDropDown>();
    this.bankList = [];
    this.referenceList = [];
    this.borrowerReferenceList = [];
    this.borrowerReferenceInternalList = [];
  }

  public getBankListAPI(entity?: string[]): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
      if(this.commonService.isnonEMptyString(entity)){
        const entityString = entity.join(',');
        httpOptions['params'] = new HttpParams().set('entity', entityString);
      }
    return this.http.get<any>(this.fccGlobalConstantService.baseUrl + 'customer-bank-list', httpOptions);
  }
}

export interface MultiBankServiceDropDown {
  label: string;
  value: string;
  timezone?: string;
}

export interface BorrowerRefDropDown {
  label: string;
  value: string;
  id: string;
}

export interface EntityDropDown {
  label: string;
  value: {
    label: string;
    name: string;
    shortName: string;
  };
}
