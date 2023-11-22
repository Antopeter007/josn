dojo.provide("misys.binding.cash.TradeCreateTdBinding");

/*
 -----------------------------------------------------------------------------
 Scripts for
  
  Term Design (TD) Form, Customer Side.
  
 Note: the function fncFormSpecificValidation is required

 Copyright (c) 2000-2010 Misys (http://www.misys.com),
 All Rights Reserved. 

 version:   1.0
 date:      22/09/10
  
 -----------------------------------------------------------------------------
 */

dojo.require("misys.form.common");
dojo.require("misys.validation.common");
dojo.require("misys.form.SimpleTextarea");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.Button");
dojo.require("misys.widget.Dialog");
dojo.require("dijit.ProgressBar");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.CheckBox");
dojo.require("dijit.layout.ContentPane");
dojo.require("dijit.form.DateTextBox");
dojo.require("misys.form.CurrencyTextBox");
dojo.require("dijit.form.NumberTextBox");
dojo.require("dijit.form.FilteringSelect");
dojo.require("dojo.data.ItemFileReadStore");
dojo.require("misys.form.DateTermField");
dojo.require("misys.binding.cash.request.RequestAction");
dojo.require("misys.binding.cash.TradeCreateTdAjaxCall");
dojo.require("dojo.parser");



fncDoBinding = function(){
	//  summary:
    //            Binds validations and events to fields in the form.              
    //   tags:
    //            public
	
	// action linked to buttons
	misys.connect('cancelDelayDialogButton', 'onClick', fncPerformClear('delayDialog'));
	misys.connect('buttonAcceptRequest', 'onClick', fncAcceptRate);
	misys.connect('buttonCancelRequest', 'onClick', fncPerformCancelRequest);
	misys.setValidation('input_value_date', function(){
		if (dijit.byId('input_value').isBlankSelected())
		{
			misys.validateDateGreaterThanHitched = dojo.hitch(this, misys.validateDateGreaterThan);
			if (!dijit.byId('input_value').get('disabled') && dijit.byId('input_value').isBlankSelected()){
				misys.validateDateSmallerThanHitched = dojo.hitch(this, misys.validateDateSmallerThan);
				return /*misys.validateDateGreaterThanHitched(false, '', 'DateLessThanDateOfDayError') && */misys.validateDateSmallerThanHitched(false, 'input_maturity_date', 'valueDateGreaterThanMaturityDate');
			}
			else{
				//return misys.validateDateGreaterThanHitched(false, '', 'DateLessThanDateOfDayError');
				return true;
			}
		}
		else {
			return true;
		}

	});

	misys.setValidation('input_maturity_date', function(){
		if (dijit.byId('input_maturity').isBlankSelected() && dijit.byId('input_value').isBlankSelected())
		{
			misys.validateDateGreaterThanHitched = dojo.hitch(this, misys.validateDateGreaterThan);
			return misys.validateDateGreaterThanHitched(false, 'input_value_date', 'maturityDateLessThanValueDate');
		}
		else {
			return true;
		}
	});
	
	misys.connect('issuing_bank_customer_reference', 'onChange', misys.setApplicantReference);
};

fncDoFormOnLoadEvents = function(){
	//  summary:
    //          Events to perform on page load.
    //  tags:
    //         public
	
	//initiate type at Scratch 
	dijit.byId('td_type').set('value', 'SCRATCH');
	
	//Disable loadingDialog/waitingDialog closing by using the escape key
	fncDisableLoadingDialogClosing();
	
	
};

/**
 * Call by button request 
 * require :
 * fncInitVar
 * Request xsl Template 
 **/
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

/** to init globals variables 
 * function required by fncPerformRequest for request pattern
 * set in global variable your field information required in the request send
 * 
 * **/
fncInitVar = function()
{
	if (dijit.byId('applicant_reference'))
	{
		fncSetGlobalVariable('applicant_reference', dijit.byId('applicant_reference').get('value'));
	}
	else {
		fncSetGlobalVariable('applicant_reference', '');
	}
	fncSetGlobalVariable('remarks', dijit.byId('remarks').get('value'));
	fncSetGlobalVariable('td_type', 'SCRATCH');
	fncSetGlobalVariable('td_cur_code', dijit.byId('input_td_cur_code').get('value'));
	fncSetGlobalVariable('td_amt', dijit.byId('input_td_amt').get('value'));
	fncSetGlobalVariable('input_value_date', dijit.byId('input_value').getDate());
	fncSetGlobalVariable('input_value_days', dijit.byId('input_value').getNumber());
	fncSetGlobalVariable('input_value_period', dijit.byId('input_value').getCode());
	fncSetGlobalVariable('input_maturity_date', dijit.byId('input_maturity').getDate());
	fncSetGlobalVariable('input_maturity_days', dijit.byId('input_maturity').getNumber());
	fncSetGlobalVariable('input_maturity_period', dijit.byId('input_maturity').getCode());

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
			'input_td_cur_code','input_td_amt',
			'input_td_amt_img',
			'dijit_form_Button_2', 'dijit_form_Button_3',
			'request_button','request_clear_button',
			'input_value','input_maturity','remarks'];
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
			'td_cur_code', 'td_amt', 'rate',
			'value_date', 'maturity_date'];
	return hiddenFieldsToClear;
};

/**
 * function required by RequestAction File for request pattern
 * put fields to clear to renew request 
 * **/
_fncGetFieldsToClear = function()
{
	var fieldsToClear = [
			'issuing_bank_customer_reference', 'trade_id', 
			'issuing_bank_abbv_name',
			'input_td_cur_code','input_td_amt',
			'input_value','input_maturity','remarks'];
	return fieldsToClear;
};

/**
 * function required by RequestAction File for request pattern
 * put Date term fields to clear to renew request 
 * **/
_fncGetDateTermFieldsToClear = function()
{
	var datefieldsToClear = ['input_value', 'input_maturity'];
	return datefieldsToClear;
};//Including the client specific implementation
       dojo.require('misys.client.binding.cash.TradeCreateTdBinding_client');