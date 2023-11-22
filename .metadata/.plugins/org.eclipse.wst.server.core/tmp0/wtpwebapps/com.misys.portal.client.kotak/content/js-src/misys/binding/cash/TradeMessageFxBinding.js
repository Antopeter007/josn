dojo.provide("misys.binding.cash.TradeMessageFxBinding");
/*
 -----------------------------------------------------------------------------
 Scripts for

  Term Deposit (TD) Message Form, Customer Side.


 Copyright (c) 2000-2011 Misys (http://www.misys.com),
 All Rights Reserved. 

 version:   1.0
 date:      27/12/10
 -----------------------------------------------------------------------------
 */

dojo.require("misys.form.common");
dojo.require("misys.validation.common");
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
dojo.require("misys.form.DateTermField");
dojo.require("misys.widget.Collaboration");
dojo.require("misys.binding.cash.request.RequestAction");
dojo.require("misys.binding.cash.TradeMessageFxAjaxCall");
dojo.require("dojo.parser");
dojo.require("dojo.date");

//Mandatory fields required based on user operation. eg : Cancel => only "reason" is mandatory)
var tabIdRequiredSplit = ['input_split_value','input_split_amt','select_split_cur_code_CCY','select_split_cur_code_CTR_CCY'];
var tabIdRequiredExtend = ['input_extend_value'];
var tabIdRequiredUptake = ['input_uptake_value'];
var tabIdRequiredTakedown = ['input_takedown_value','input_takedown_amt'];

fncDoBinding = function(){
	//  summary:
	//            Binds validations and events to fields in the form.              
	//   tags:
	//            public

	//
	// Validation Events
	//


	//action linked to Actions SelectBox  
	misys.connect('sub_tnx_type_code', 'onChange', function(){
		_fncToggleAction(this.get('value'));
	});
	
	//Currency selection
	misys.connect('select_split_cur_code_CCY', 'onChange', function(){
		if (dijit.byId('select_split_cur_code_CCY').checked)
		{
			dijit.byId('input_split_cur_code').set('value',dijit.byId('fx_cur_code').get('value'));	
		}
		else
		{
			dijit.byId('input_split_cur_code').set('value',dijit.byId('counter_cur_code').get('value'));	
		}
	});

	//Amount Validation
	misys.setValidation('input_takedown_amt', function(isFocused){
		return _fncValidateAmount(isFocused, this, 'fx','fx_amt');	
	});
	
	//Amount Validation
	misys.setValidation('input_split_amt', function(isFocused){
		if (dijit.byId('select_split_cur_code_CCY').checked){
			return _fncValidateAmount(isFocused, this, 'fx','fx_amt');	
		}
		else {
			return _fncValidateAmount(isFocused, this, 'fx','counter_amt');	
		}
		
	});
	
	// action linked to request buttons
	misys.connect('cancelDelayDialogButton', 'onClick', fncPerformClear('delayDialog'));
	misys.connect('buttonAcceptRequest', 'onClick', fncAcceptRate);
	misys.connect('buttonCancelRequest', 'onClick', fncPerformCancelRequest);

//	misys.setValidation('input_split_value_date', function(){
//		return fncValidateDate('input_split_value', '', 'DateLessThanDateOfDayError', false);
//	});
	misys.setValidation('input_extend_value_date', function(){
		return /*fncValidateDate('input_extend_value', '', 'DateLessThanDateOfDayError', false)&&*/ fncValidateDate('input_extend_value', 'original_value_date', 'valueDateGreaterThanOrgValueDate', false);
	});
	
	misys.setValidation('input_uptake_value_date', function(){
		return /*fncValidateDate('input_uptake_value', '', 'DateLessThanDateOfDayError', false)&& */fncValidateDate('input_split_value', 'original_value_date', 'valueDateGreaterThanOrgValueDate', true);
	});
	
	misys.setValidation('input_takedown_value_date', function(){
		return /*fncValidateDate('input_takedown_value', '', 'DateLessThanDateOfDayError', false)&& */fncValidateDate('input_takedown_value', 'original_value_date', 'valueDateGreaterThanOrgValueDate', true) && fncValidateDate('input_takedown_value', 'option_date', 'DateLessThanDateOfDayError', false);
	});
};

fncDoFormOnLoadEvents = function(){
	//  summary:
	//          Events to perform on page load.
	//  tags:
	//         public

	//Disable loadingDialog/waitingDialog closing by using the escape key
	fncDisableLoadingDialogClosing();

	//load default forms
	_fncToggleAction( dijit.byId('sub_tnx_type_code').get('value'));


};

/**
 * Call by button request 
 * require :
 * fncInitVar
 * Request xsl Template 
 **/
fncPerformRequest = function()
{

	if(fncCheckFields()) 
	{
		fncDoPerformRequest();
		misys.animate("fadeOut", dojo.byId('request-button'));
	}
	
};

/** to init globals variables 
 * function required by fncPerformRequest for request pattern
 * set in global variable your field information required in the request send
 * 
 * **/
fncInitVar = function()
{
	fncSetGlobalVariable('applicant_reference', dijit.byId('applicant_reference').get('value'));

	fncSetGlobalVariable('original_deal_id', dijit.byId('bo_ref_id').get('value'));

	fncSetGlobalVariable('fx_type', 'FORWARD');
	fncSetGlobalVariable('contract_type', dijit.byId('contract_type').get('value'));
	fncSetGlobalVariable('counter_cur_code', dijit.byId('counter_cur_code').get('value'));
	
	//specific split
	if (fncGetGlobalVariable('fx_action')=='SPLIT'){
		
		_fncInitUpdateVar();
		if (dijit.byId('select_split_cur_code_CCY').checked)
		{
			fncSetGlobalVariable('fx_cur_code',dijit.byId('fx_cur_code').get('value'));	
		}
		else
		{
			fncSetGlobalVariable('fx_cur_code',dijit.byId('counter_cur_code').get('value'));	
		}
		fncSetGlobalVariable('fx_amt', dijit.byId('input_split_amt').get('value'));
		fncSetGlobalVariable('remarks', dijit.byId('input_split_remarks').get('value'));
		fncSetGlobalVariable('input_value_date', dijit.byId('input_split_value').getDate());
		fncSetGlobalVariable('input_value_days', dijit.byId('input_split_value').getNumber());
		fncSetGlobalVariable('input_value_period', dijit.byId('input_split_value').getCode());
	}
	//specific extend
	else if (fncGetGlobalVariable('fx_action')=='EXTEND'){
		_fncInitUpdateVar();
		fncSetGlobalVariable('fx_cur_code', dijit.byId('fx_cur_code').get('value'));
		fncSetGlobalVariable('remarks', dijit.byId('input_extends_remarks').get('value'));
		fncSetGlobalVariable('fx_amt', dijit.byId('fx_amt').get('value'));
		fncSetGlobalVariable('input_value_date', dijit.byId('input_extend_value').getDate());
		fncSetGlobalVariable('input_value_days', dijit.byId('input_extend_value').getNumber());
		fncSetGlobalVariable('input_value_period', dijit.byId('input_extend_value').getCode());
	}
	else if (fncGetGlobalVariable('fx_action')=='UPTAKE'){
		_fncInitUpdateVar();
		fncSetGlobalVariable('fx_cur_code', dijit.byId('fx_cur_code').get('value'));
		fncSetGlobalVariable('remarks', dijit.byId('input_uptake_remarks').get('value'));
		fncSetGlobalVariable('fx_amt', dijit.byId('fx_amt').get('value'));
		fncSetGlobalVariable('input_value_date', dijit.byId('input_uptake_value').getDate());
		fncSetGlobalVariable('input_value_days', dijit.byId('input_uptake_value').getNumber());
		fncSetGlobalVariable('input_value_period', dijit.byId('input_uptake_value').getCode());
	}
};

/**
 * Variables for Update functions (SPLIT, EXTEND, UPTAKE)
 * 
 * **/
var _fncInitUpdateVar = function(){
	fncSetGlobalVariable('fx_ref_id', dijit.byId('ref_id').get('value'));
	fncSetGlobalVariable('fx_bo_ref_id', dijit.byId('bo_ref_id').get('value'));
	fncSetGlobalVariable('fx_contract_type', dijit.byId('contract_type').get('value'));
	fncSetGlobalVariable('org_fx_amt', dijit.byId('org_fx_amt').get('value'));
	fncSetGlobalVariable('org_fx_cur_code', dijit.byId('org_fx_cur_code').get('value'));
	fncSetGlobalVariable('org_counter_amt', dijit.byId('org_counter_amt').get('value'));
	fncSetGlobalVariable('org_counter_cur_code', dijit.byId('org_counter_cur_code').get('value'));
	fncSetGlobalVariable('org_rate', dijit.byId('org_rate').get('value'));
	fncSetGlobalVariable('org_maturity_date', dijit.byId('org_maturity_date').get('value'));
};


/**
 * function required by RequestAction File for request pattern
 *  Fields to disable during request 
 **/
_fncGetDisabledFields = function()
{
	var fieldsToDisable = [
			'issuing_bank_customer_reference', 'trade_id', 
			'issuing_bank_abbv_name',
			'input_split_value','input_split_amt',
			'input_extend_value','input_uptake_value','input_takedown_value',
			'select_takedown_cur_code','select_split_cur_code',
			'input_takedown_amt','input_split_remarks',
			'input_extends_remarks','input_takedown_remarks',
			'input_uptake_remarks',
			'request_button','request_clear_button',
			'dijit_form_Button_2', 'dijit_form_Button_3'];
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
	var hiddenFieldsToClear = [];
	return hiddenFieldsToClear;
};

/**
 * function required by RequestAction File for request pattern
 * put fields to clear to renew request 
 * **/
_fncGetFieldsToClear = function()
{
	var fieldsToClear = [
			'trade_id','input_split_amt','select_takedown_cur_code',
			'select_split_cur_code','input_takedown_amt','input_split_remarks', 
			'input_extends_remarks','input_uptake_remarks','input_takedown_remarks'];
	return fieldsToClear;
};

/**
 * function required by RequestAction File for request pattern
 * put Date term fields to clear to renew request 
 * **/
_fncGetDateTermFieldsToClear = function()
{
	var datefieldsToClear = [
			'input_split_value_date', 'input_split_value_code','input_extend_value_date', 'input_extend_value_code',
			'input_uptake_value_date', 'input_uptake_value_code','input_takedown_value_date', 'input_takedown_value_code'];
	return datefieldsToClear;
};

_fncToggleAction = function(selectedValue)
{	

	
	misys.animate("fadeOut", dojo.byId('split-details'));
	misys.animate("fadeOut", dojo.byId('extend-details'));
	misys.animate("fadeOut", dojo.byId('uptake-details'));
	misys.animate("fadeOut", dojo.byId('takedown-details'));
	misys.animate("fadeOut", dojo.byId('request-button'));
	misys.animate("fadeOut", dojo.byId('submit-button'));
	// specific details for split on rate response
	misys.animate("fadeOut", dojo.byId('split-trade-details'));
	
	fncSetGlobalVariable('sub_tnx_type_code',selectedValue);
		
	//SPLIT
	if (selectedValue == '34')
	{	
		fncSetGlobalVariable('fx_action','SPLIT');
		_fncEnableRequiredFields(tabIdRequiredSplit);
		_fncDisabledRequiredFields(tabIdRequiredExtend);
		_fncDisabledRequiredFields(tabIdRequiredUptake);
		_fncDisabledRequiredFields(tabIdRequiredTakedown);
		misys.animate("fadeIn", dojo.byId('split-details'));
		misys.animate("fadeIn", dojo.byId('request-button'));
		misys.animate("fadeIn", dojo.byId('split-trade-details'));
	}
	//EXTEND
	else if (selectedValue == '33')
	{	
		fncSetGlobalVariable('fx_action','EXTEND');
		_fncDisabledRequiredFields(tabIdRequiredSplit);
		_fncEnableRequiredFields(tabIdRequiredExtend);
		_fncDisabledRequiredFields(tabIdRequiredUptake);
		_fncDisabledRequiredFields(tabIdRequiredTakedown);
		misys.animate("fadeIn", dojo.byId('extend-details'));
		misys.animate("fadeIn", dojo.byId('request-button'));	
	}
	//UPTAKE
	else if (selectedValue == '32')
	{
		fncSetGlobalVariable('fx_action','UPTAKE');
		_fncDisabledRequiredFields(tabIdRequiredSplit);
		_fncDisabledRequiredFields(tabIdRequiredExtend);
		_fncEnableRequiredFields(tabIdRequiredUptake);
		_fncDisabledRequiredFields(tabIdRequiredTakedown);
		misys.animate("fadeIn", dojo.byId('uptake-details'));
		misys.animate("fadeIn", dojo.byId('request-button'));
	}
	//TAKEDOWN
	else if (selectedValue == '31')
	{
		fncSetGlobalVariable('fx_action','TAKEDOWN');
		_fncDisabledRequiredFields(tabIdRequiredSplit);
		_fncDisabledRequiredFields(tabIdRequiredExtend);
		_fncDisabledRequiredFields(tabIdRequiredUptake);
		_fncEnableRequiredFields(tabIdRequiredTakedown);
		misys.animate("fadeIn", dojo.byId('takedown-details'));
		misys.animate("fadeIn", dojo.byId('submit-button'));	
	}
	else
	{	
		//default form
		_fncDisabledRequiredFields(tabIdRequiredSplit);
		_fncDisabledRequiredFields(tabIdRequiredExtend);
		_fncDisabledRequiredFields(tabIdRequiredUptake);
		_fncDisabledRequiredFields(tabIdRequiredTakedown);
	}
	
};


_fncEnableRequiredFields = function(/*fields*/fields)
{
	var fieldsToEnable = fields;
	dojo.forEach(fieldsToEnable, function(id){
		var field = dijit.byId(id);
		if(field)
		{	misys.toggleRequired(field,true);
		field.set('disabled', false);
		}
	});
};

/* Fields to disable during request */
_fncDisabledRequiredFields = function(/*fields*/fields)
{
	var fieldsToDisable = fields;

	dojo.forEach(fieldsToDisable, function(id){
		var field = dijit.byId(id);
		if(field)
		{
			field.set('disabled', true);
		}
	});
};






_fncValidateAmount = function(/*Boolean*/ isFocused, /*Widget*/ theObj, /*String*/ productCode,/*String*/ orgAmountField )
{
	//  summary:
	//       Validates the amendment amount.
	//  description:
	//        Format the eventual increase/decrease of amount, set the transaction amount
	//        and compute the new LC amount.
	//  tags:
	//       public, validation

	theObj.invalidMessage = theObj.messages.invalidMessage;
	if(!theObj.validator(theObj.textbox.value, theObj.constraints)){
		return false;
	}

	// Validate only when the field is onfocussed or focussed but in error
	var isValid = (theObj.state == 'Error') ? false : true;
	if(false == isFocused || (true == isFocused && !isValid)){
		console.debug('[Validate] Validating Amendment Amount, Value = ' + theObj.get('value'));

		isValid = true;
		var fieldId = theObj.id;
		var orgAmtVal = dojo.number.parse(dijit.byId(orgAmountField).get('value'));

		var decValue = theObj.get('value');
			if(!isNaN(decValue))
			{
				if((orgAmtVal - decValue) < 0)
				{
					theObj.invalidMessage = misys.getLocalization('amendAmountLessThanOriginalError');
					isValid = false;
				}
			}
	}
	return isValid;
};
//Including the client specific implementation
       dojo.require('misys.client.binding.cash.TradeMessageFxBinding_client');