import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import {
  FCCFormGroup, FCCMVFormControl,
} from './../../../base/model/fcc-control.model';
import { ActivatedRoute } from '@angular/router';
import { FccGlobalConstant } from '../../core/fcc-global-constants';
import { TranslateService } from '@ngx-translate/core';
import { FCCBase } from './../../../base/model/fcc-base';
import { IDataEmittterModel, IUpdateFccBase } from './../../../shared/FCCform/form-controls/form-control-resolver/form-control-resolver.model';
import { DashboardService } from '../../services/dashboard.service';
import { FormControlService } from '../../../corporate/trade/lc/initiation/services/form-control.service';
import { Validators } from '@angular/forms';
import { CurrencyConverterPipe } from '../../../corporate/trade/lc/initiation/pipes/currency-converter.pipe';
import { FccConstants } from '../../core/fcc-constants';
import { ParamInitializerService } from '../../services/param-initializer.service';

@Component({
  selector: 'app-exchange-rate-details',
  templateUrl: './exchange-rate-details.component.html',
  styleUrls: ['./exchange-rate-details.component.scss']
})
export class ExchangeRateDetailsComponent extends FCCBase implements OnInit,IUpdateFccBase {

	@Input() form!: FCCFormGroup;
	productCode : string;
	subProductCode : string;
	exchangeRateConfig : any;
	controlDataEmitter: EventEmitter<IDataEmittterModel>;
	control: FCCMVFormControl;
	transactionCurrency;
	transactionAmount;
	debitAccount;
	loggedInUserDetails;
	boardRateFields = ['exchangeRateNote','exchangeRate', 'exchangeRateEquiCurrency', 'exchangeRateEquiAmount'];
	tolerenceRateArray = ['toleranceRate','toleranceRateEquiCurrency','toleranceRateEquiAmount'];
	fxContractFields = ['contractNumber1','amountToUtilise1'];
	totalFxContractFields = ['totalAmountToUtilise','totalAmountToUtiliseCurrency','space4'];
	boardRateValField = ['exchangeRate','exchangeRateEquiCurrency',
	'exchangeRateEquiAmount'];
	fxContractValField = ['amountToUtilise1','contractNumber1','amountToUtiliseCurrency1',
	'totalAmountToUtiliseCurrency','totalAmountToUtilise'];
	fxContractRequiredField = ['amountToUtilise1','contractNumber1'];
	amountFields = [];
	extraBoardRateFields = [];
	triggerAmountSubs = true;
	mode : string;
	iso;
	currency;
	amount;
	account;
	accountCurrency;
	amtUtiliseErrorMap = new Map();
	totalAmtUtilesd;
	fxContractValidFalg = true;

	constructor(protected commonService : CommonService, protected activatedRoute : ActivatedRoute,
	protected translateService: TranslateService, protected dashboardService: DashboardService,
	protected formControlService : FormControlService,
	protected currencyConverterPipe : CurrencyConverterPipe, protected paramInitializerService: ParamInitializerService) {
		super();
		}

	ngOnInit(): void {
		this.activatedRoute.queryParams.subscribe(params => {
			this.commonService.putQueryParameters(FccGlobalConstant.PRODUCT,params[FccGlobalConstant.PRODUCT]);
			this.productCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.PRODUCT);
			this.commonService.putQueryParameters(FccGlobalConstant.SUB_PRODUCT_CODE,params[FccGlobalConstant.SUB_PRODUCT_CODE]);
			this.subProductCode =this.commonService.getQueryParametersFromKey(FccGlobalConstant.SUB_PRODUCT_CODE);
			this.commonService.putQueryParameters(FccGlobalConstant.MODE,params[FccGlobalConstant.MODE]);
			this.mode =this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);

		});
		this.dashboardService.getUserDetails().subscribe(response => {
			this.loggedInUserDetails = response;
		});
		const params = {
			productCode : this.productCode,
			subProductCode : this.subProductCode
		};
		if(this.commonService.getExchangeRateConfiguration() === undefined){
			this.commonService.getExchangeRateConfig(params).subscribe(res => {
				this.exchangeRateConfig = res;
				this.commonService.setExchangeRateConfiguration(res);
			});
		} else {
			this.exchangeRateConfig = this.commonService.getExchangeRateConfiguration();
		}
		const fxParameterObject = this.exchangeRateConfig?.fxBankProperties[0];
		const maxNbrContracts = fxParameterObject?.fxNbrContract.maxNbrContracts;
		if(this.form.get('fxNbrContracts')){
			this.form.get('fxNbrContracts').setValue(maxNbrContracts);
		}
		const fieldObj = FccConstants.PRODUCT_FIELD_MAP[this.productCode];
		this.currency = fieldObj['currency'];
		this.amount = fieldObj['amount'];
		this.account = fieldObj['account'];
		this.accountCurrency = fieldObj['accountCurrency'];
		this.form.get('foreignExchangeRates').valueChanges.subscribe(value => {
			this.onClickForeignExchangeRates(value);
		});
		if(this.mode === FccGlobalConstant.VIEW_MODE){
			this.onClickForeignExchangeRates(this.form.get('foreignExchangeRates').value);
		}
		if (this.mode === FccGlobalConstant.DRAFT_OPTION) {
			this.transactionCurrency = this.form.get(this.currency).value;
		}
		this.form.get(this.currency).valueChanges.subscribe(value => {
			this.transactionCurrency = value;
			if(value && this.validateBoardRate() && this.form.get('foreignExchangeRates').value === "01"){
				this.showExchangeRate();
			} else if(value && (!this.validateBoardRate() || this.form.get('foreignExchangeRates').value === "02")
				&& this.mode !== FccGlobalConstant.VIEW_MODE){
				this.showFxRate();
			}
		});
		this.form.get(this.amount).valueChanges.subscribe(value => {
			this.transactionAmount = value;
			if(value && this.validateBoardRate() && this.form.get('foreignExchangeRates').value === "01"){
				this.showExchangeRate();
			} else if(value && (!this.validateBoardRate() || this.form.get('foreignExchangeRates').value === "02")
				&& this.mode !== FccGlobalConstant.VIEW_MODE){
				this.showFxRate();
			}
		});
		this.form.get(this.account).valueChanges.subscribe(value => {
			let tempObj = {};
			if(value?.currency === undefined){
				tempObj = {
					currency:this.form.get(this.accountCurrency).value,
					accountNo:value
				};
			} else {
				tempObj = value;
			}
		this.debitAccount = tempObj;
			if(value && this.validateBoardRate() && this.form.get('foreignExchangeRates').value === "01"){
				if(this.mode === FccGlobalConstant.DRAFT_OPTION && this.transactionAmount === undefined){
					this.transactionAmount = this.form.get(this.amount).value;
				}
				this.showExchangeRate();
			} else if(value && (!this.validateBoardRate() || this.form.get('foreignExchangeRates').value === "02")
				&& this.mode !== FccGlobalConstant.VIEW_MODE){
				this.showFxRate();
			}
		});
	}

	showExchangeRate(){
		const transactionAmount = this.transactionAmount ? this.transactionAmount : this.form.get(this.amount).value;
		const transactionCurrency = this.transactionCurrency ? this.transactionCurrency : this.form.get(this.currency).value;
		this.transactionCurrency = transactionCurrency;
		let debitAccount = this.debitAccount;
		if(this.mode === FccGlobalConstant.VIEW_MODE && debitAccount === undefined) {
			let tempObj = {};
			const value = this.form.get(this.account)?.value;
			tempObj = {
				currency:this.form.get(this.accountCurrency)?.value,
				accountNo:value
			};
			debitAccount = tempObj;
		}

		if(transactionCurrency && transactionAmount && debitAccount
			&& this.exchangeRateConfig?.fxBankProperties[0]
			&& transactionCurrency.shortName !== debitAccount.currency){
			const fxParameterObject = this.exchangeRateConfig.fxBankProperties[0];
			const amtValue = this.commonService.replaceCurrency(transactionAmount);
			const amountValue = parseFloat(amtValue);
			const requestParams = {
				fromCur: transactionCurrency.shortName,
				toCur: debitAccount.currency,
				amount: amountValue,
				productCode: this.productCode,
				bankAbbvName: this.loggedInUserDetails.parentBankShortName,
				tolerancePercent: fxParameterObject.fxToleranceRate?.tolerancePercentage,
				isDirectConversion: true
			};
			this.commonService.getFxDetails(requestParams).subscribe(response => {
				if(this.commonService.isnonEMptyString(response.boardExchangeRate)){
                    this.renderBoardRateFields();
					this.form.get('exchangeRateNote').setValue(this.translateService.instant('broadRateNote'));
                    this.form.get('exchangeRate').setValue(parseFloat(parseFloat(response.boardExchangeRate).toFixed(7)));
                    this.form.get('exchangeRateEquiCurrency').setValue(debitAccount.currency);
                    this.form.get('exchangeRateEquiAmount').setValue(this.currencyConverterPipe.transform(
                        this.commonService.replaceCurrency(response.equivalentRateAmt.toString()),
                        this.transactionCurrency?.shortName));
                    if(fxParameterObject?.fxToleranceRate?.toleranceDispInd === 'Y'){
                        this.form.get('toleranceRate').setValue(parseFloat(parseFloat(response.toleranceRate).toFixed(7)));
                        this.form.get('toleranceRateEquiCurrency').setValue(debitAccount.currency);
                        this.form.get('toleranceRateEquiAmount').setValue(this.currencyConverterPipe.transform(
                            this.commonService.replaceCurrency(response.toleranceEquiAmount.toString()),
                            this.transactionCurrency?.shortName));
                    }
					this.setRenderOnlyFields(this.fxContractFields,false);
					this.setRenderOnlyFields(this.extraBoardRateFields,false);
					this.setRenderOnlyFields(this.totalFxContractFields,false);
				} else {
					if(this.mode !== FccGlobalConstant.DRAFT_OPTION && this.mode !== FccGlobalConstant.VIEW){
						this.form.get('foreignExchangeRates').setValue('02');
						this.onClickForeignExchangeRates("02");
					}
				}
			});
		} else {
			this.setRenderOnly(this.form, 'exchangeRateDetailsLabel', false);
			this.setRenderOnly(this.form, 'foreignExchangeRates', false);
			this.setRenderOnlyFields(this.boardRateFields,false);
			this.setRenderOnlyFields(this.tolerenceRateArray,false);
			this.setRenderOnlyFields(this.fxContractFields,false);
			this.setRenderOnlyFields(this.extraBoardRateFields,false);
			this.setRenderOnlyFields(this.totalFxContractFields,false);
			this.form.get('exchangeRate').setValue('');
			this.form.get('exchangeRateEquiCurrency').setValue('');
			this.form.get('exchangeRateEquiAmount').setValue('');
			this.removeExchangeRateFieldVal(this.boardRateFields);
			this.removeExchangeRateFieldVal(this.fxContractFields);
			this.removeExchangeRateFieldVal(this.extraBoardRateFields);
			this.form.updateValueAndValidity();
		}
	}

	renderBoardRateFields(){
		if(this.form.get('foreignExchangeRates').value === '01'){
			this.form.get('exchangeRateDetailsLabel')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
			this.setRenderOnly(this.form, 'foreignExchangeRates', true);
			this.form.get('foreignExchangeRates')[FccGlobalConstant.PARAMS]['previewScreen'] = false;
			this.setRenderOnlyFields(this.boardRateFields, true);
			this.setTolerenceValues(true);
		}
	}

	setRenderOnlyFields(arr, flag) {
		arr.forEach((id) => this.setRenderOnly(this.form, id, flag));
	}

	setRenderOnly(form, id, flag) {
		if(form.get(id)){
			form.get(id)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = flag;
		}
	}

	showFxRate(){
		const transactionAMount = this.transactionAmount ? this.transactionAmount : this.form.get(this.amount).value;
		const transactionCurrency = this.transactionCurrency ? this.transactionCurrency : this.form.get(this.currency).value;
		if(this.commonService.isnonEMptyString(this.transactionAmount)){
			let amtValue = this.commonService.replaceCurrency(this.transactionAmount);
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			amtValue = parseFloat(amtValue);
			if(this.transactionAmount>=this.totalAmtUtilesd){
				this.form.get('amountToUtilise1').clearValidators();
				this.form.get('amountToUtilise1').updateValueAndValidity();
				this.clearExtraFieldValidator('amountToUtilise1');
			}
		}
		if(transactionCurrency && transactionAMount && this.debitAccount
			&& this.exchangeRateConfig?.fxBankProperties[0]
			&& this.transactionCurrency?.currencyCode !== this.debitAccount.currency && this.fxContractValidFalg){
			this.setRenderOnly(this.form, 'exchangeRateDetailsLabel', true);
			this.setRenderOnly(this.form, 'foreignExchangeRates', true);
			if(this.mode === FccGlobalConstant.DRAFT_OPTION && this.form.get('foreignExchangeRates').value === '01'){
				this.onClickForeignExchangeRates(this.form.get('foreignExchangeRates').value);
			} else {
				this.form.get('foreignExchangeRates').setValue('02');
				this.onClickForeignExchangeRates('02');
			}
		} else {
			this.setRenderOnly(this.form, 'exchangeRateDetailsLabel', false);
			this.setRenderOnly(this.form, 'foreignExchangeRates', false);
			this.setRenderOnlyFields(this.boardRateFields,false);
			this.setRenderOnlyFields(this.tolerenceRateArray,false);
			this.setRenderOnlyFields(this.fxContractFields,false);
			this.setRenderOnlyFields(this.extraBoardRateFields,false);
			this.setRenderOnlyFields(this.totalFxContractFields,false);
			this.removeExchangeRateFieldVal(this.boardRateFields);
			this.removeExchangeRateFieldVal(this.fxContractFields);
			this.removeExchangeRateFieldVal(this.extraBoardRateFields);
			this.setRequiredFlag(this.fxContractRequiredField, false);
			this.form.updateValueAndValidity();
		}
	}
	onClickForeignExchangeRates(value): void {
		if(value === '02'){
			this.renderFxRateFields(this.extraBoardRateFields);
		} else if( value === '01') {
			this.showExchangeRate();
		}else {
			this.setRenderOnlyFields(this.fxContractFields, false);
			this.setRenderOnlyFields(this.extraBoardRateFields, false);
			this.setRenderOnlyFields(this.totalFxContractFields, false);
			this.setRenderOnlyFields(this.boardRateFields, true);
			this.setTolerenceValues(true);
		}
	}

	renderFxRateFields(extraBoardRateFields){
		const fxParameterObject = this.exchangeRateConfig?.fxBankProperties[0];
		const maxNbrContracts = fxParameterObject?.fxNbrContract.maxNbrContracts;
		this.setRenderOnlyFields(this.boardRateFields, false);
		this.setTolerenceValues(false);
		this.setRenderOnlyFields(this.fxContractFields, true);
		this.amountFields = [];
		extraBoardRateFields = [];
		this.amountFields.push('amountToUtilise1');
		for(let i=2 ; i <= maxNbrContracts ; i++){
			const contractNumber = this.jsonObject(this.form.get('contractNumber1'), 'contractNumber'+ i);
			this.form.addControl('contractNumber'+ i, this.formControlService.getControl(contractNumber));
			const amountToUtiliseCurrency = this.jsonObject(this.form.get('amountToUtiliseCurrency1'),'amountToUtiliseCurrency'+ i);
			this.form.addControl('amountToUtiliseCurrency'+ i, this.formControlService.getControl(amountToUtiliseCurrency));
			this.form.get('amountToUtiliseCurrency'+i).setValue(this.transactionCurrency?.currencyCode);
			const amountToUtilise = this.jsonObject(this.form.get('amountToUtilise1'), 'amountToUtilise'+ i);
			this.form.addControl('amountToUtilise'+ i, this.formControlService.getControl(amountToUtilise));
			extraBoardRateFields.push('contractNumber'+ i);
			extraBoardRateFields.push('amountToUtilise'+ i);
			this.amountFields.push('amountToUtilise'+i);
		}
		this.commonService.fxAmountFieldList = this.amountFields;
		extraBoardRateFields.forEach(field => {
			const groupHead = this.form.get('contractNumber1')[FccGlobalConstant.PARAMS][FccGlobalConstant.GROUP_HEAD];
			if (this.commonService.isnonEMptyString(groupHead)
			&& !this.form.controls[groupHead][FccGlobalConstant.PARAMS][FccGlobalConstant.GROUP_CHILDREN].includes(field)) {
				this.form.controls[groupHead][FccGlobalConstant.PARAMS][FccGlobalConstant.GROUP_CHILDREN].push(field);
			}
		});
		this.form.get('amountToUtiliseCurrency1').setValue(this.transactionCurrency?.currencyCode);
		const curCode = this.transactionCurrency?.currencyCode ? this.transactionCurrency?.currencyCode :
		this.form.get(this.currency).value;
		this.form.get('totalAmountToUtiliseCurrency').setValue(curCode);
		this.form.get('contractNumber1')[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
		this.form.get('amountToUtilise1')[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
		//adding note
		const note = this.jsonObject(this.form.get('exchangeRateNote'), 'exchangeRateFXContractNote');
		this.form.addControl('exchangeRateFXContractNote', this.formControlService.getControl(note));
		extraBoardRateFields.push('exchangeRateFXContractNote');
		this.form.get('exchangeRateFXContractNote').setValue(this.translateService.instant('fxRateNote'));
		//setting control for total utilised amount
		let amtUtiliseTempVal = null;
		if(this.commonService.isnonEMptyString(this.form.get('totalAmountToUtilise').value)){
			amtUtiliseTempVal = this.form.get('totalAmountToUtilise').value;
		}
		const totalAmountToUtiliseTemp = this.jsonObject(this.form.get('totalAmountToUtilise'), 'totalAmountToUtilise');
		this.form.removeControl('totalAmountToUtilise');
		this.form.addControl('totalAmountToUtilise', this.formControlService.getControl(totalAmountToUtiliseTemp));
		this.form.get('totalAmountToUtilise')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
		this.form.get('totalAmountToUtilise').setValue(amtUtiliseTempVal);
		// const totalAmountToUtiliseCurrency = this.jsonObject(this.form.get('amountToUtiliseCurrency1'), 'totalAmountToUtiliseCurrency');
		// this.form.addControl('totalAmountToUtiliseCurrency', this.formControlService.getControl(totalAmountToUtiliseCurrency));
		// this.form.get('totalAmountToUtiliseCurrency').setValue(this.transactionCurrency.currencyCode);
		// const totalAmountToUtilise = this.jsonObject(this.form.get('amountToUtilise1'), 'totalAmountToUtilise');
		// this.form.addControl('totalAmountToUtilise', this.formControlService.getControl(totalAmountToUtilise));
		if(this.triggerAmountSubs){
			this.addAmountFieldSubcriptions();
			this.triggerAmountSubs = false;
		}
		this.setRenderOnlyFields(this.totalFxContractFields, true);
		this.form.updateValueAndValidity();
		this.extraBoardRateFields = extraBoardRateFields;
		this.setRenderOnlyFields(extraBoardRateFields, true);
	}

	validateBoardRate(){
		if(this.commonService.isnonEMptyString(this.form.get(this.currency)?.value?.currencyCode)
			&& this.commonService.isnonEMptyString(this.form.get(this.amount).value)
			&& this.commonService.isnonEMptyString(this.debitAccount?.currency)){
			let minAmt;
			let maxAmt;
			const amtValue = this.commonService.replaceCurrency(this.form.get(this.amount).value);
			const amountValue = parseFloat(amtValue);
			const boardRateConfig = this.exchangeRateConfig?.fxBankProperties[0]?.fxBoardRate;
			let isBrdRateCurr = false;
			const valid = boardRateConfig?.some(config =>{
				minAmt = config.minAmt;
				maxAmt = config.maxAmt;
				if(this.form.get(this.currency).value.currencyCode === config.currencyCode){
					isBrdRateCurr = true;
				}
				return this.form.get(this.currency).value.currencyCode === config.currencyCode
				&& (amountValue) <= ((config.maxAmt)*1);
			}
			);

			for(const element of this.exchangeRateConfig?.fxBankProperties[0]?.contractOptCurrency){
				if(element.currencyCode === this.form.get(this.currency).value.currencyCode){
					this.fxContractValidFalg = true;
					break;
				} else {
					this.fxContractValidFalg = false;
				}
			}
			const fxRateTooltip = `${this.translateService.instant('fxRateTooltip')}`;
			if(!this.fxContractValidFalg){
				this.setTooltipRadioButton('foreignExchangeRates', FccConstants.FX_CONTRACT_OPTION_VALUE, fxRateTooltip);
			} else {
				this.setTooltipRadioButton('foreignExchangeRates', FccConstants.FX_CONTRACT_OPTION_VALUE, '');
			}
			if(valid){
				this.form.get('foreignExchangeRates')[FccGlobalConstant.PARAMS][FccGlobalConstant.READONLY] = false;
				this.form.get('foreignExchangeRates')[FccGlobalConstant.PARAMS]['showTitle'] = false;
				this.setTooltipRadioButton('foreignExchangeRates', FccConstants.BOARD_RATE_OPTION_VALUE, '');
			} else {
				this.form.get('foreignExchangeRates')[FccGlobalConstant.OPTIONS].forEach(opt => {
					if (opt.value === FccConstants.BOARD_RATE_OPTION_VALUE) {
						if(!isBrdRateCurr){
							this.setTooltipRadioButton('foreignExchangeRates',
							FccConstants.BOARD_RATE_OPTION_VALUE, fxRateTooltip);
						} else {
							opt.title = `${this.translateService.instant('exchangeRateTooltip',
							{ min: minAmt + ' ' + this.transactionCurrency?.currencyCode, max: maxAmt + ' '
							+ this.transactionCurrency?.currencyCode })}`;
						}
					}
				});
			}
			if(valid && this.fxContractValidFalg){
				this.form.get('foreignExchangeRates')[FccGlobalConstant.PARAMS][FccGlobalConstant.READONLY] = false;
				this.form.get('foreignExchangeRates')[FccGlobalConstant.PARAMS]['showTitle'] = false;
			} else {
				this.form.get('foreignExchangeRates')[FccGlobalConstant.PARAMS][FccGlobalConstant.READONLY] = true;
				this.form.get('foreignExchangeRates')[FccGlobalConstant.PARAMS]['showTitle'] = true;
				if(valid){
					this.form.get('foreignExchangeRates').setValue('01');
				}
			}
			if(!valid && !this.fxContractValidFalg){
				this.hideExchangeRateField();
				const validationError = { invalidFXamount: true };
				this.form.addFCCValidators(this.amount, Validators.compose([() => validationError]), 0);
			}
			return valid;
		}
	}

	jsonObject(field, key): any {
		const obj = {};
		const nameStr = 'name';
		const typeStr = 'type';
		const renderedStr = 'rendered';
		const layoutClassStr = 'layoutClass';
		const styleClassStr = 'styleClass';
		const previewScreenStr = 'previewScreen';
		const requiredStr = 'required';
		const showLabelStr = 'showLabel';
		const dynamicFieldStr = 'dynamicField';
		const parentFieldStr = 'parentField';
		const groupheadStr = 'grouphead';
		if(field !== null){
			obj[nameStr] = field.key ;
			obj[nameStr] = key;
			obj[typeStr] = field.type;
			obj[renderedStr] = field.params.rendered;
			obj[layoutClassStr] = field.params.layoutClass;
			obj[styleClassStr] = field.params.styleClass;
			obj[previewScreenStr] = field.params.previewScreen;
			obj[requiredStr] = field.params.required;
			obj[showLabelStr] = field.params.showLabel;
			obj[dynamicFieldStr] = field.params.dynamicField;
			obj[parentFieldStr] = field.params.parentField;
			obj['dynamicCriteria'] = field.params.dynamicCriteria;
			obj['clubbedHeaderText'] = field.params.clubbedHeaderText;
			obj['clubbedList'] = field.params.clubbedList;
			obj['clubbed'] = field.params.clubbed;
			obj[groupheadStr] = field.params.grouphead;
			obj['positionEnd'] = field.params.positionEnd;
		}
		return obj;
	}

	addAmountFieldSubcriptions(){
		for(let i=0 ; i < this.amountFields.length ; i++){
			this.form.get(this.amountFields[i]).valueChanges.subscribe(() => {
				this.calculateSum(this.amountFields[i]);
			});
		}
	}

	calculateSum(key){
		let sum = 0;
		for(let i=0 ; i < this.amountFields.length ; i++){
			if(this.commonService.isnonEMptyString(this.form.get(this.amountFields[i]).value)){
        const amtValue = this.commonService.replaceCurrency(this.form.get(this.amountFields[i]).value);
        const amountValue = parseFloat(amtValue);
        sum = sum + ((amountValue)*1);
			}
		}
		const amtValue = this.commonService.replaceCurrency(this.transactionAmount);
		const amountValue = parseFloat(amtValue);
		const amountCurrCode = this.form.get('totalAmountToUtiliseCurrency').value.value ?
		this.form.get('totalAmountToUtiliseCurrency').value.value :
		this.form.get('totalAmountToUtiliseCurrency').value;
		this.commonService.curCode = amountCurrCode ?
		amountCurrCode : this.commonService.curCode;
		const curCode = this.commonService.curCode;
		let curSymbol;
		if(this.paramInitializerService.getCurrencySymbolDisplayEnabled()){
			curSymbol = this.commonService.getCurrSymbol(curCode);
		} else {
			curSymbol = '';
		}
		if(curSymbol === curCode){
			curSymbol = '';
		}
		this.totalAmtUtilesd = sum;
		const totalSum = this.currencyConverterPipe.transform(sum.toString(),curCode);
		const totalAmtVal = curCode +' '+curSymbol+' '+totalSum;
		this.form.get('totalAmountToUtilise').setValue(totalAmtVal);
		if(this.form.get('totalAmountToUtiliseCurrency').value == undefined){
			this.form.get('totalAmountToUtiliseCurrency').setValue(this.commonService.curCode);
		}
		if(sum > amountValue){
			const validationError = {
				totalAmountMaxLimit: { field: "Total Amount", maxAmount: amountValue } };
			this.form.addFCCValidators(key, Validators.compose([() => validationError]), 0);
			this.form.get(key).markAsDirty;
			this.form.get(key).markAsTouched;
			if(!this.amtUtiliseErrorMap.get(key)){
				this.amtUtiliseErrorMap.set(key,true);
				this.form.get(key).updateValueAndValidity();
			}
			this.form.updateValueAndValidity();
		} else if(amountValue > sum){
			this.form.get(key).clearValidators();
			if(this.amtUtiliseErrorMap.get(key)){
				this.amtUtiliseErrorMap.set(key,false);
				this.form.get(key).updateValueAndValidity();
			}
		} else {
			this.amtUtiliseErrorMap.set(key,false);
		}
	}

	setTolerenceValues(flag){
		if(this.exchangeRateConfig?.fxBankProperties[0]?.fxToleranceRate?.toleranceDispInd === 'Y' && flag){
			this.setRenderOnlyFields(this.tolerenceRateArray,true);
		} else {
			this.setRenderOnlyFields(this.tolerenceRateArray,false);
		}
	}

	removeExchangeRateFieldVal(arr){
		arr.forEach((id) => {
			if(this.form.get(id)){
				this.form.get(id).setValue('');
			}
		});
	}

	setRequiredFlag(arr, flag){
		arr.forEach((id) => {
			if(this.form.get(id)){
				this.form.get(id)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = flag;
			}
		});
	}

	clearExtraFieldValidator(field){
		const fieldName = field.substring(0, field.length - 1);
		this.extraBoardRateFields.forEach(key =>{
			if(key.includes(fieldName)){
				this.form.get(key).clearValidators();
				if(this.amtUtiliseErrorMap.get(key)){
					this.amtUtiliseErrorMap.set(key,false);
					this.form.get(key).updateValueAndValidity();
				}
			}
		});
	}

	hideExchangeRateField() {
		this.setRenderOnly(this.form, 'exchangeRateDetailsLabel', false);
		this.setRenderOnly(this.form, 'foreignExchangeRates', false);
		this.setRenderOnlyFields(this.boardRateFields, false);
		this.setRenderOnlyFields(this.tolerenceRateArray, false);
		this.setRenderOnlyFields(this.fxContractFields, false);
		this.setRenderOnlyFields(this.extraBoardRateFields, false);
		this.setRenderOnlyFields(this.totalFxContractFields, false);
		this.form.get('exchangeRate').setValue('');
		this.form.get('exchangeRateEquiCurrency').setValue('');
		this.form.get('exchangeRateEquiAmount').setValue('');
		this.removeExchangeRateFieldVal(this.boardRateFields);
		this.removeExchangeRateFieldVal(this.fxContractFields);
		this.removeExchangeRateFieldVal(this.extraBoardRateFields);
		this.form.updateValueAndValidity();
	}

	setTooltipRadioButton(control, optValue, title){
		this.form.get(control)[FccGlobalConstant.OPTIONS].forEach(opt =>{
			if(opt.value === optValue){
				opt.title = title;
			}
		});

	}
}
