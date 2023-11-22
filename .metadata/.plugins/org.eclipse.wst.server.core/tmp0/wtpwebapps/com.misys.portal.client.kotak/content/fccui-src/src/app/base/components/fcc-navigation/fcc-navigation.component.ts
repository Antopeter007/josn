import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonService } from '../../../common/services/common.service';
import { FccGlobalConstant } from '../../../common/core/fcc-global-constants';
import { FCCBase } from '../../model/fcc-base';
import { TranslateService } from '@ngx-translate/core';
import { FccConstants } from '../../../common/core/fcc-constants';
import { CurrencyRequest } from '../../../common/model/currency-request';
import { FCCFormGroup } from '../../model/fcc-control.model';
import { FccGlobalConstantService } from '../../../common/core/fcc-global-constant.service';
import { HOST_COMPONENT } from '../../../shared/FCCform/form/form-resolver/form-resolver.directive';
import { FormControlService } from '../../../corporate/trade/lc/initiation/services/form-control.service';
import { DropDownAPIService } from '../../../common/services/dropdownAPI.service';
import { MultiBankService } from '../../../common/services/multi-bank.service';


@Component({
  selector: 'app-fcc-navigation',
  templateUrl: './fcc-navigation.component.html',
  styleUrls: ['./fcc-navigation.component.scss'],
  providers: [
    { provide: HOST_COMPONENT, useExisting: FccNavigationComponent }
  ]
})
export class FccNavigationComponent extends FCCBase implements OnInit  {

  @Output()
  filterApplied: EventEmitter<any> = new EventEmitter<any>();
  module = ``;
  form: FCCFormGroup;
  isEntityDataLoaded = false;
  isBankDataLoaded = false;
  isCurrencyDataLoaded = false;
  options = 'options';
  useOnChange = true;
  nudgeData = [];
  curRequest: CurrencyRequest = new CurrencyRequest();
  baseCurrency = this.commonService.getBaseCurrency();
  @Output() coruoselClick:EventEmitter<any> = new EventEmitter<any>();


  constructor(protected commonService: CommonService,
              protected router: Router,
              protected http: HttpClient,
              protected formControlService: FormControlService,
              protected corporateCommonService: CommonService,
              protected fccGlobalConstantService: FccGlobalConstantService,
              protected translateService: TranslateService,
              protected dropdownAPIService: DropDownAPIService,
              protected multiBankService : MultiBankService,
              public translate: TranslateService) {
    super();
   }

  ngOnInit(): void {
    this.translate.get('corporatechannels').subscribe(() => {
      this.initializeFormGroup();
      this.mode = this.commonService.getQueryParametersFromKey(
        FccGlobalConstant.MODE
      );
    });
  }

  initializeFormGroup() {
    const params = {
      type: FccGlobalConstant.NAVIGATION,
      productCode: 'accountsummary'
    };
    this.commonService.getProductModel(params).subscribe(
      response => {
        const navigation = response[FccGlobalConstant.NAVIGATION_MODEL];
        this.form = this.formControlService.getFormControls(navigation);
        this.loadEntity('');
        this.loadBankList('');
        this.onClickEquiCurCode();
      });
      const filter = {};
      filter[FccGlobalConstant.ACCOUNT_CURRENCY] = this.baseCurrency;
      filter['skippagination']=true;
      this.commonService.setAccountSummaryFilter(filter);
      this.filterApplied.emit();
  }

  loadEntity(event: any) {
    const elementId = 'entity';
    this.isEntityDataLoaded = false;
    let elementValue = this.form.get(elementId).value;
    if (elementValue === null) {
      elementValue = FccGlobalConstant.EMPTY_STRING;
    }
    if ( !elementValue.length) {
          const entityDataArray = [];
          if (this.form.get(elementId)[this.options].length === 0) {
          this.corporateCommonService.getFormValues(
            this.fccGlobalConstantService.getStaticDataLimit(), this.fccGlobalConstantService.userEntities)
            .subscribe(result => {
              result.body.items.forEach(value => {
                const entity: { label: string; value: any } = {
                  label: value.shortName,
                  value: value.shortName
                };
                entityDataArray.push(entity);
              });
              entityDataArray.sort((a, b) => {
                const x = a.label.toLowerCase();
                const y = b.label.toLowerCase();
                if (x < y) {
                  return -1;
                }
                if (x > y) {
                  return 1;
                }
                return 0;
              });
              this.patchFieldParameters(this.form.get(elementId), { options: entityDataArray });
              if(entityDataArray.length === 0){
                this.form.get(elementId)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED]=false;
                this.loadBankList('');
              } else if(entityDataArray.length === 1){
                this.form.get(elementId)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED]=true;
                const entityValueArray = [];
                entityValueArray.push(entityDataArray[0].value);
                this.form.get(elementId).setValue(entityValueArray);
              } else {
                this.form.get(elementId)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED]=true;
              }
              
            },
            () => {
              this.isEntityDataLoaded = false;
            });
          this.isEntityDataLoaded = true;
          }
        }
  }

  loadBankList(event: any) {
    const elementId = 'bank';
    this.isBankDataLoaded = false;
    let elementValue = this.form.get(elementId).value;
    if (elementValue === null) {
      elementValue = FccGlobalConstant.EMPTY_STRING;
    }
    if ( !elementValue.length) {
          const bankList = [];
          this.multiBankService.getBankListAPI(this.form.get('entity').value)
            .subscribe(result => {
              result.items.forEach(value => {
                const entity: { label: string; value: any } = {
                  label: value.label,
                  value: value.value
                };
                bankList.push(entity);
              });
              bankList.sort((a, b) => {
                const x = a.label.toLowerCase();
                const y = b.label.toLowerCase();
                if (x < y) {
                  return -1;
                }
                if (x > y) {
                  return 1;
                }
                return 0;
              });
              this.patchFieldParameters(this.form.get(elementId), { options: bankList });
              if(bankList.length === 0){
                this.form.get(elementId)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED]=false;
              } else if(bankList.length === 1){
                this.form.get(elementId)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED]=true;
                const bankValueArray = [];
                bankValueArray.push(bankList[0].value);
                this.form.get(elementId).setValue(bankValueArray);
              } else {
                this.form.get(elementId)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED]=true;
              }
              
            },
            () => {
              this.isBankDataLoaded = false;
            });
          this.isBankDataLoaded = true;
          
        }
  }

  onKeydownEntity(){
    this.applyFilter();
  }

  onChangeequiCurCode() {
    const elementId = FccGlobalConstant.EQUIVALENT_CURRENCY;
    let elementValue = this.form.get(elementId).value;
    if (elementValue === null) {
      elementValue = FccGlobalConstant.EMPTY_STRING;
    }
    this.form.get(elementId).updateValueAndValidity();
    this.applyFilter();
  }

  onChangeentity() {
    const elementId = 'entity';
    this.isEntityDataLoaded = false;
    let elementValue = this.form.get(elementId).value;
    if (elementValue === null) {
      elementValue = FccGlobalConstant.EMPTY_STRING;
    }
    this.form.get(elementId).updateValueAndValidity();
    this.loadBankList('');
    this.applyFilter();
  }

  onClickEquiCurCode() {
    const elementId = FccGlobalConstant.EQUIVALENT_CURRENCY;
    this.isCurrencyDataLoaded = false;
    let elementValue = this.form.get(elementId).value;
    if (elementValue === null) {
      elementValue = FccGlobalConstant.EMPTY_STRING;
    }
    if (!elementValue.length) {
    const currencyDataArray = [];
    this.commonService.bankCurrencies(this.curRequest).subscribe(
        response => {
            response.items.forEach(
              value => {
                const ccy: { label: string, value: any } = {
                  label: value.isoCode,
                  value: {
                    label: value.isoCode,
                    iso: `${value.isoCode} - ${this.toTitleCase(value.name)}`,
                    country: value.principalCountryCode,
                    currencyCode: value.isoCode,
                    shortName: value.isoCode,
                    name: value.name
                  }
                };
                currencyDataArray.push(ccy);
              });
            this.patchFieldParameters(this.form.get(elementId), { options: currencyDataArray });
            this.baseCurrency = response.baseCurrency;
            const valObj = this.dropdownAPIService.getValueObj(response.baseCurrency, currencyDataArray);
            if (valObj && this.commonService.isEmptyValue(this.form.get(elementId).value)) {
              this.form.get(elementId).patchValue(valObj[`value`]);
            }
          },
          () => {
            this.isCurrencyDataLoaded = false;
          }
        );
        this.isCurrencyDataLoaded = true;
    }
  }

  toTitleCase(value) {
    return value.replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  }

  onChangebank() {
    const elementId = 'bank';
    this.isEntityDataLoaded = false;
    let elementValue = this.form.get(elementId).value;
    if (elementValue === null) {
      elementValue = FccGlobalConstant.EMPTY_STRING;
    }
    this.form.get(elementId).updateValueAndValidity();
    this.applyFilter();
  }


  applyFilter(){ 
    if((this.form.get(FccGlobalConstant.ENTITY).value !== null && this.form.get(FccGlobalConstant.ENTITY).value.length > 0) &&
        this.commonService.isNonEmptyValue(this.form.get(FccGlobalConstant.EQUIVALENT_CURRENCY).value.currencyCode)){
        const filter = {};
        if(this.form.get(FccGlobalConstant.EQUIVALENT_CURRENCY).value.currencyCode != ''){
          filter[FccGlobalConstant.ACCOUNT_CURRENCY] = this.form.get(FccGlobalConstant.EQUIVALENT_CURRENCY).value.currencyCode;
        } else {
          filter[FccGlobalConstant.ACCOUNT_CURRENCY] = this.baseCurrency;
        }
        const entityVal = this.form.get(FccGlobalConstant.ENTITY).value;
        let consolidatedSelectedEntity = '';
        let index = 1;
        entityVal.forEach(value => {
          if (index === entityVal.length){
            consolidatedSelectedEntity = consolidatedSelectedEntity + value;
          } else {
            consolidatedSelectedEntity = consolidatedSelectedEntity + value + '|';
          }
          index++;
        });
        filter[FccGlobalConstant.ENTITY] = consolidatedSelectedEntity;
        this.applyBankFilter(filter);
        filter['skippagination']=true;
        this.commonService.setAccountSummaryFilter(filter);
        this.commonService.refreshAccountSummaryCarousel.next(true);
        this.filterApplied.emit();
    } else if ((this.form.get(FccGlobalConstant.ENTITY).value !== null && this.form.get(FccGlobalConstant.ENTITY).value.length > 0) &&
              !this.commonService.isNonEmptyValue(this.form.get(FccGlobalConstant.EQUIVALENT_CURRENCY).value.currencyCode)){
        const filter = {};
        filter[FccGlobalConstant.ACCOUNT_CURRENCY] = this.baseCurrency;
        const entityVal = this.form.get(FccGlobalConstant.ENTITY).value;
        let consolidatedSelectedEntity = '';
        let index = 1;
        entityVal.forEach(value => {
          if (index === entityVal.length){
            consolidatedSelectedEntity = consolidatedSelectedEntity + value;
          } else {
            consolidatedSelectedEntity = consolidatedSelectedEntity + value + '|';
          }
          index++;
        });
        filter[FccGlobalConstant.ENTITY] = consolidatedSelectedEntity;
        this.applyBankFilter(filter);
        filter['skippagination']=true;
        this.commonService.setAccountSummaryFilter(filter);
        this.commonService.refreshAccountSummaryCarousel.next(true);
        this.filterApplied.emit();
    } else if ((this.form.get(FccGlobalConstant.ENTITY).value === null || this.form.get(FccGlobalConstant.ENTITY).value.length <= 0) &&
              this.commonService.isNonEmptyValue(this.form.get(FccGlobalConstant.EQUIVALENT_CURRENCY).value.currencyCode)){
        const filter = {};
        if(this.form.get(FccGlobalConstant.EQUIVALENT_CURRENCY).value.currencyCode != ''){
          filter[FccGlobalConstant.ACCOUNT_CURRENCY] = this.form.get(FccGlobalConstant.EQUIVALENT_CURRENCY).value.currencyCode;
        } else {
          filter[FccGlobalConstant.ACCOUNT_CURRENCY] = this.baseCurrency;
        }
        this.applyBankFilter(filter);
        filter['skippagination']=true;
        this.commonService.setAccountSummaryFilter(filter);
        this.commonService.refreshAccountSummaryCarousel.next(true);
        this.filterApplied.emit();
    } else {
      const filter = {};
      filter[FccGlobalConstant.ACCOUNT_CURRENCY] = this.baseCurrency;
      filter['skippagination']=true;
      this.commonService.setAccountSummaryFilter(filter);
    }
  }

  onClickThreeDots(event, buttonName, formObj) {
    const nudge = {
      text: buttonName,
      productProcessor: FccGlobalConstant.FCC,
			urlKey: formObj.get(buttonName)[FccConstants.PARAMS]?.nudgeKey,
			active: true
    };
    this.commonService.getHyperLink(nudge).then((data) => {
      if(data.urlKey === formObj.get(buttonName)[FccGlobalConstant.PARAMS].nudgeKey) {
        formObj.get(buttonName)[FccGlobalConstant.PARAMS] = { ...formObj.get(buttonName)[FccGlobalConstant.PARAMS], ...data };
        this.navigateToLink(formObj.get(buttonName)[FccConstants.PARAMS]);
      }
    });
  }

  onKeyupThreeDots(event, buttonName, formObj) {
    this.onClickThreeDots(event, buttonName, formObj);
  }

  navigateToLink(item) {
    if (item.httpMethod?.toUpperCase() === FccConstants.POST){
      this.commonService.generateToken().subscribe(response => {
        if (response) {
          const ssoToken = response.SSOTOKEN;
          const queryParameter = item.queryParameter;
          const headerType = item.headerParameters as string;
          if (headerType.toUpperCase() === FccConstants.HEADER && queryParameter){
              const headerObject = {
                [queryParameter] : ssoToken
              };
              const headers = new HttpHeaders(headerObject);
              return this.http.post<any>(item.url, item.bodyParameters, { headers });
          } else if (item.headerParameters === 'url' && queryParameter){
            const url = item.url + '?' + queryParameter + '=' + ssoToken;
            return this.http.post<any>(url, item.bodyParameters);
          }
        }
    });
   } else if (item.urlType === FccGlobalConstant.INTERNAL && this.commonService.isNonEmptyValue(item.urlScreenType)
    && item.urlScreenType !== '') {
      const urlScreenType = item.urlScreenType as string;
      if (urlScreenType.toUpperCase() === FccGlobalConstant.ANGULAR_UPPER_CASE) {
        this.commonService.redirectToLink(item.url);
      } else {
        const urlContext = this.commonService.getContextPath();
        const dojoUrl = urlContext + this.fccGlobalConstantService.servletName + item.url;
        this.router.navigate([]).then(() => {
          window.open(dojoUrl, FccGlobalConstant.SELF);
        });
      }
    } else if (item.urlType === FccGlobalConstant.EXTERNAL) {
      if (item.securityType === FccGlobalConstant.SSO) {
        this.commonService.generateToken().subscribe(response => {
          if (response) {
            const ssoToken = response.SSOTOKEN;
            const queryParameter = item.queryParameter;
            const headerObject = {
              [queryParameter] : ssoToken
            };
            const headers = new HttpHeaders(headerObject);
            this.http.get<any>(item.url, { headers }).subscribe( () => {
              window.open(item.url, FccGlobalConstant.BLANK);
            },
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            (error) => {
              window.open(item.url, FccGlobalConstant.BLANK);
            }
            );
          }
        });
      }
    } else if (item.urlType === FccGlobalConstant.IFRAME) {
      if (item.securityType === FccGlobalConstant.SSO) {
        this.commonService.iframeURL = item.url;
        this.commonService.deepLinkingQueryParameter = item.queryParameter;
        this.router.navigate(['/sso-deeplink-url']);
      } else{
        this.commonService.iframeURL = item.url;
        this.router.navigate(['/iframe']);
      }
    }
  }

  onKeydownAccountList() {
    this.coruoselClick.emit();
  }

  onClickAccountList() {
    this.coruoselClick.emit();
  }

  ngOnDestroy() {
    this.commonService.setAccountSummaryFilter(null);
  }

  applyBankFilter(filter){
    if(this.commonService.isNonEmptyValue(this.form.get('bank'))){
      const bankVal = this.form.get('bank').value;
      let consolidatedSelectedBank = '';
        let index = 1;
        if(this.commonService.isnonEMptyString(bankVal)){
          bankVal.forEach(value => {
            if (index === bankVal.length){
              consolidatedSelectedBank = consolidatedSelectedBank + value;
            } else {
              consolidatedSelectedBank = consolidatedSelectedBank + value + '|';
            }
            index++;
          });
          filter['bank'] = consolidatedSelectedBank;
        }
    }
  }
}
