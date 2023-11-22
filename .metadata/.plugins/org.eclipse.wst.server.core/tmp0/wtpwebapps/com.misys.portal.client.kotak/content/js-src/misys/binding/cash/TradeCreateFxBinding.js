dojo.provide("misys.binding.cash.TradeCreateFxBinding");
/*
 -----------------------------------------------------------------------------
 Scripts for
  
  Foreign Exchange (FX) Form, Customer Side.
  
 Note: the function fncFormSpecificValidation is required

 Copyright (c) 2000-2010 Misys (http://www.misys.com),
 All Rights Reserved. 

 version:   1.0
 date:      22/09/10
 
 TODO reorganize functions (put some in fxAction.js or fxTimer.js)
 -----------------------------------------------------------------------------
 */

dojo.require("misys.form.common");
dojo.require("misys.validation.common");
dojo.require("misys.form.DateTermField");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.TextBox");
dojo.require("misys.widget.Dialog");
dojo.require("dijit.ProgressBar");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.CheckBox");
dojo.require("dijit.layout.ContentPane");
dojo.require("dojo.data.ItemFileReadStore");
dojo.require("dijit.form.DateTextBox");
dojo.require("misys.form.CurrencyTextBox");
dojo.require("dijit.form.NumberTextBox");
dojo.require("dijit.form.FilteringSelect");
dojo.require("misys.form.SimpleTextarea");
dojo.require("dojo.parser");
dojo.require("dojo.date");
dojo.require("misys.widget.Collaboration");
dojo.require("misys.binding.cash.request.RequestAction");
dojo.require("misys.binding.cash.TradeCreateFxAjaxCall");

fncDoBinding = function(){
	//  summary:
    //            Binds validations and events to fields in the form.              
    //   tags:
    //            public
	// initialization of fx_type, use to link event
	if (dijit.byId('fx_type')){
		fx_type = dijit.byId('fx_type').get('value');
	}
	else{
		fx_type = null;
	}
	fncSetGlobalVariable('fx_type', fx_type);
	// all screen
	misys.connect('issuing_bank_customer_reference', 'onChange', misys.setApplicantReference);
	misys.connect('fx_amt', 'onBlur', function(){
		misys.setTnxAmt(this.get('value'));
	});
	// action linked to buttons
	misys.connect('cancelDelayDialogButton', 'onClick', fncPerformClear('delayDialog'));
	misys.connect('buttonAcceptRequest', 'onClick', fncAcceptRate);
	misys.connect('buttonCancelRequest', 'onClick', fncPerformCancelRequest);
	
	misys.connect('input_counter_cur_code', 'onBlur', function(){
		var fncCheckEqualsCurrenciesHitched = dojo.hitch(this, fncCheckEqualsCurrencies);
		return fncCheckEqualsCurrenciesHitched('input_fx_cur_code');
		});

	misys.connect('input_fx_cur_code', 'onBlur', function(){
		var fncCheckEqualsCurrenciesHitched = dojo.hitch(this, fncCheckEqualsCurrencies);
		return fncCheckEqualsCurrenciesHitched('input_counter_cur_code');
		});
	
	// all screen except swap
	if (fx_type != 'SWAP')
	{
		misys.setValidation('input_counter_cur_code', misys.validateCurrency);
		misys.setValidation('input_fx_cur_code', misys.validateCurrency);
		
		misys.connect('input_fx_cur_code', 'onChange', function(){
			misys.setCurrency(this, ['input_fx_amt']);
		});
	}
	// swap screen
	else {
		misys.setValidation('input_fx_cur_code', misys.validateCurrency);
		misys.setValidation('input_counter_cur_code', misys.validateCurrency);
		
		
		
		// validation of the far date
		misys.setValidation('input_near_date', function(){
			return /*fncValidateDate('input_near', '', 'errorFXNearDateGreaterDateOfDay', false) && */fncValidateDate('input_near', 'input_value', 'errorFXNearDateGreaterFarDate', true);
		});
//		misys.setValidation('input_near_code', function(){
//			return fncValidateDate('input_near', '', 'errorFXNearDateGreaterDateOfDay', false) 
//					&& fncValidateDate('input_near', 'input_value', 'errorFXNearDateGreaterFarDate', true);
//		});
		// linked field amount to field currency
		misys.connect('input_fx_cur_code', 'onChange', function(){
			misys.setCurrency(this, ['input_near_amt']);
		});
		misys.connect('input_fx_cur_code', 'onChange', function(){
			misys.setCurrency(this, ['input_far_amt']);
		});
	}
	// all screen except spot
	if (fx_type != 'SPOT')
	{
		misys.setValidation('input_value_date', function(){
			if(fx_type == 'SWAP'){
				return /*fncValidateDate('input_value', '', 'errorFXFarDateGreaterDateOfDay', false) && */fncValidateDate('input_value', 'input_near', 'errorFXFarDateGreaterNearDate', false);
			}
			else if (fx_type == 'DELIVERY_OPTION'){
				return /*fncValidateDate('input_value', '', 'DateLessThanDateOfDayError', false) && */fncValidateDate('input_value', 'input_option', 'valueDateSmallerThanOptionDate', false);
			}
			else{
				//return fncValidateDate('input_value', '', 'DateLessThanDateOfDayError', false);
				return true;
			}
		});
		// this is comment because validation for inputdatetermfield widget not working correctly
//		misys.setValidation('input_value_code', function(){
//			if(fx_type == 'SWAP'){
//				return fncValidateDate('input_value', '', 'errorFXFarDateGreaterDateOfDay', false) 
//						&& fncValidateDate('input_value', 'input_near', 'errorFXFarDateGreaterNearDate', false);
//			}
//			else if (fx_type == 'DELIVERY_OPTION'){
//				return fncValidateDate('input_value', '', 'DateLessThanDateOfDayError', false) 
//						&& fncValidateDate('input_value', 'input_option', 'valueDateSmallerThanOptionDate', true);
//			}
//			else{
//				return fncValidateDate('input_value', '', 'DateLessThanDateOfDayError', false);
//			}
//		});
	}
	// delivery option screen
	if (fx_type == 'DELIVERY_OPTION')
	{
		misys.setValidation('input_option_date', function(){
			return/* fncValidateDate('input_option', '', 'optionDateLessThanDateOfDay', false) && */fncValidateDate('input_option', 'input_value', 'optionDateGreaterThanValueDate', true);
		});
//		misys.setValidation('input_option_code', function(){
//			return fncValidateDate('input_option', '', 'optionDateLessThanDateOfDay', false) 
//			&& fncValidateDate('input_option', 'input_value', 'optionDateGreaterThanValueDate', true);
//		});
	}
};

fncDoFormOnLoadEvents = function(){
	//  summary:
    //          Events to perform on page load.
    //  tags:
    //         public
	
	//Disable loadingDialog/waitingDialog closing by using the escape key
	fncDisableLoadingDialogClosing();
	
};

/** to init globals variables **/
fncInitVar = function()
{
	if (dijit.byId('applicant_reference'))
	{
		fncSetGlobalVariable('applicant_reference', dijit.byId('applicant_reference').get('value'));
	}
	else {
		fncSetGlobalVariable('applicant_reference', '');
	}
	if(dijit.byId('contract_type_1').get('checked') == true){
		fncSetGlobalVariable('contract_type', '01');
	}else {
		fncSetGlobalVariable('contract_type', '02');
	}
	fncSetGlobalVariable('remarks', dijit.byId('remarks').get('value'));
	
	// swap use particular fields
	if (fx_type == 'SWAP')
	{
		fncSetGlobalVariable('fx_cur_code', dijit.byId('input_fx_cur_code').get('value'));
		fncSetGlobalVariable('fx_amt', dijit.byId('input_far_amt').get('value'));
		fncSetGlobalVariable('counter_cur_code', dijit.byId('input_counter_cur_code').get('value'));
		fncSetGlobalVariable('near_amt', dijit.byId('input_near_amt').get('value'));
		fncSetGlobalVariable('input_near_date', dijit.byId('input_near').getDate());
		fncSetGlobalVariable('input_near_days', dijit.byId('input_near').getNumber());
		fncSetGlobalVariable('input_near_period', dijit.byId('input_near').getCode());
	}
	else {
		fncSetGlobalVariable('counter_cur_code', dijit.byId('input_counter_cur_code').get('value'));
		fncSetGlobalVariable('fx_cur_code', dijit.byId('input_fx_cur_code').get('value'));
		fncSetGlobalVariable('fx_amt', dijit.byId('input_fx_amt').get('value'));
		fncSetGlobalVariable('input_near_date', '');
		fncSetGlobalVariable('input_near_days', '');
		fncSetGlobalVariable('input_near_period', '');
	}
	// value date is use by all except by spot
	if (fx_type != 'SPOT')
	{
		fncSetGlobalVariable('input_value_date', dijit.byId('input_value').getDate());
		fncSetGlobalVariable('input_value_days', dijit.byId('input_value').getNumber());
		fncSetGlobalVariable('input_value_period', dijit.byId('input_value').getCode());
	}
	else
	{
		fncSetGlobalVariable('input_value_date','');
		fncSetGlobalVariable('input_value_days', '');
		fncSetGlobalVariable('input_value_period', '');
	}
	// option date is use only by delivery option
	if (fx_type == 'DELIVERY_OPTION')
	{
		fncSetGlobalVariable('input_option_date', dijit.byId('input_option').getDate());
		fncSetGlobalVariable('input_option_days', dijit.byId('input_option').getNumber());
		fncSetGlobalVariable('input_option_period', dijit.byId('input_option').getCode());
	}
	else
	{
		fncSetGlobalVariable('input_option_date', '');
		fncSetGlobalVariable('input_option_days', '');
		fncSetGlobalVariable('input_option_period', '');
	}
};
/** first ajax call -> to get a rate **/
fncPerformRequest = function()
{

	/*
	 * add your validation before do Perform Request
	 * 
	 * exemple :
		var listDateField = ["input_value", "input_near", "input_option"];
		isValid = true;
		dojo.forEach(listDateField, function(id){
			if (!_fncValidateDateDaysPeriod(id)){
				isValid = false;
			}
		});
	 */
	
	if(/*isValid && */fncCheckFields()) 
	{
		fncDoPerformRequest();
	}
};

/**
 * function required by RequestAction File for request pattern
 *  Fields to disable during request 
 **/
_fncGetDisabledFields = function()
{
	var fieldsToDisable = [
			/* ALL */
			'issuing_bank_customer_reference', 'trade_id', 
			'issuing_bank_abbv_name',
			'input_counter_cur_code', 'input_fx_cur_code', 
			'input_fx_amt', 'input_counter_amt',
			'input_fx_amt_img', 'input_counter_amt_img',
			'contract_type_1', 'contract_type_2',
			'dijit_form_Button_2', 'dijit_form_Button_3','remarks',
			'request_button','request_clear_button',
			/* ALL except SPOT */
			'input_value',
			/* SWAP */
			'input_near', 
			'input_near_amt', 'input_far_amt',
			'near_amt_img','far_amt_img',
			/* DELIVERY OPTION */
			'input_option'];
	return fieldsToDisable;
};

/**
 * function required by RequestAction File for request pattern
 * put fields to Enable to renew request if different to fieldtodisable 
 * **/
_fncGetEnabledFields = function()
{
	return _fncGetDisabledFields();
};

/**
 * function required by RequestAction File for request pattern
 * put Hidden fields to clear to renew request 
 * **/
_fncGetHiddenFieldsToClear = function()
{
	var hiddenFieldsToClear = [
			'fx_cur_code', 'fx_amt', 'counter_cur_code', 'rate',
			'counter_amt', 'value_date', 'maturity_date'];
	return hiddenFieldsToClear;
};

/**
 * function required by RequestAction File for request pattern
 * put fields to clear to renew request 
 * **/
_fncGetFieldsToClear = function()
{
	var fieldsToClear = [
			/* ALL */
			'issuing_bank_customer_reference', 'trade_id', 
			'issuing_bank_abbv_name',
			'input_counter_cur_code', 'input_fx_cur_code', 
			'input_fx_amt', 'input_counter_amt','remarks',
			/* ALL except SPOT */
			'input_value', 
			/* SWAP */
			'input_near', 
			'input_near_amt', 'input_far_amt',
			/* DELIVERY OPTION */
			'input_option'];
	return fieldsToClear;
};

/**
 * function required by RequestAction File for request pattern
 * put Date term fields to clear to renew request 
 * **/
_fncGetDateTermFieldsToClear = function()
{
	return ['value', 'maturity'];
};

fncCheckEqualsCurrencies = function(/*String*/secundCurrencyField)
{
	var currency1 = this.get('value');
	var currency2 = dijit.byId(secundCurrencyField).get('value');
	
	if (currency1.length == 3 && currency2.length == 3 && (this.state != 'Error' || secundCurrencyField.state != 'Error'))
	{
		console.debug('[INFO] Validate equals currencies :'+currency1+' & '+currency2);
		if (currency1 == currency2)
		{		
			this.focus();
			this.state = 'Error';
			this.displayMessage(misys.getLocalization('errorFXEqualsCurrencies', [currency1]));
		}
	}
};
//Including the client specific implementation
       dojo.require('misys.client.binding.cash.TradeCreateFxBinding_client');