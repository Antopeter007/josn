dojo.provide("misys.binding.cash.TradeCreateTdBinding");
/*
 -----------------------------------------------------------------------------
 Scripts for

  Template for request pattern screenbinding 


 Copyright (c) 2000-2010 Misys (http://www.misys.com),
 All Rights Reserved. 

 version:   1.0
 date:      22/09/10

 -----------------------------------------------------------------------------
 */

dojo.require("misys.form.common");
dojo.require("misys.validation.common");
dojo.require("misys.form.file");
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
//replace TD by your product code
dojo.require("misys.binding.cash.request.TDAjaxCall");
dojo.require("misys.binding.cash.request.RequestAction");
dojo.require("misys.binding.cash.request.Timer");
//dojo.require("misys.form.DateTermField");
dojo.require("dojo.parser");


fncDoBinding = function(){
	//  summary:
	//            Binds validations and events to fields in the form.              
	//   tags:
	//            public

	// action linked to request buttons
	misys.connect('cancelDelayDialogButton', 'onClick', fncPerformClear('delayDialog'));
	misys.connect('delayDialog', 'onHide', fncCloseDelayDialog);
	misys.connect('buttonAcceptRequest', 'onClick', fncAcceptRate);
	misys.connect('buttonCancelRequest', 'onClick', fncPerformCancelRequest);

};

fncDoFormOnLoadEvents = function(){
	//  summary:
	//          Events to perform on page load.
	//  tags:
	//         public

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
	if (dijit.byId("applicant_reference")){
		fncSetGlobalVariable('applicant_reference', dijit.byId('applicant_reference').get('value'));
	}
	else {
		fncSetGlobalVariable('applicant_reference', '');
	}

	/*
	 * Exemple
	fncSetGlobalVariable('td_cur_code', dijit.byId('input_td_cur_code').get('value'));
	fncSetGlobalVariable('td_amt', dijit.byId('input_td_amt').get('value'));
	fncSetGlobalVariable('input_value_date', dijit.byId('input_value_date').get('displayedValue'));
	fncSetGlobalVariable('input_value_days', dijit.byId('input_value_code').get('value'));
	fncSetGlobalVariable('input_value_period', dijit.byId('input_value_number').get('value'));
	 */
};

/**
 * function required by RequestAction File for request pattern
 *  Fields to disable during request 
 **/
_fncGetDisabledFields = function()
{
	var fieldsToDisable = ['issuing_bank_customer_reference', 'trade_id', 
			'issuing_bank_abbv_name',
			'input_td_cur_code','input_td_amt',
			'input_td_amt_img',
			'dijit_form_Button_2', 'dijit_form_Button_3'];
			/*add your personal fields 
			 * 'input_value_date', 'input_value_code', 'input_value_number',
			 * */
	
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

			/* insert fields
			 * 
			 * */
	];
	return hiddenFieldsToClear;
};

/**
 * function required by RequestAction File for request pattern
 * put fields to clear to renew request 
 * **/
_fncGetFieldsToClear = function()
{
	var fieldsToClear = [

			/*insert fields
			 * 
			 * */
	];
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
};