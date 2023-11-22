dojo.provide("misys.binding.cash.TradeCreateLaBinding");
/*
 -----------------------------------------------------------------------------
 Scripts for
  
  Loan (LA) Form, Customer Side.

 Copyright (c) 2000-2011 Misys (http://www.misys.com),
 All Rights Reserved. 

 version:   1.0
 date:      13/01/2011
 
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
dojo.require("misys.binding.cash.TradeCreateLaAjaxCall");

fncDoBinding = function(){
	//  summary:
	//            Binds validations and events to fields in the form.              
	//   tags:
	//            public

	
	misys.connect('issuing_bank_customer_reference', 'onChange', misys.setApplicantReference);
	// action linked to request buttons
	misys.connect('cancelDelayDialogButton', 'onClick', fncPerformClear('delayDialog'));
	misys.connect('buttonAcceptRequest', 'onClick', fncAcceptRate);
	misys.connect('buttonCancelRequest', 'onClick', fncPerformCancelRequest);
	misys.setValidation('value_date_date', function(){
		if (dijit.byId('value_date').isBlankSelected())
		{
			misys.validateDateGreaterThanHitched = dojo.hitch(this, misys.validateDateGreaterThan);
			if (!dijit.byId('maturity_date').get('disabled') && dijit.byId('maturity_date').isBlankSelected()){
				misys.validateDateSmallerThanHitched = dojo.hitch(this, misys.validateDateSmallerThan);
				return /*misys.validateDateGreaterThanHitched(false, '', 'DateLessThanDateOfDayError') && */misys.validateDateSmallerThanHitched(false, 'maturity_date_date', 'valueDateGreaterThanMaturityDate');
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

	misys.setValidation('maturity_date_date', function(){
		if (dijit.byId('maturity_date').isBlankSelected() && dijit.byId('value_date').isBlankSelected())
		{
			misys.validateDateGreaterThanHitched = dojo.hitch(this, misys.validateDateGreaterThan);
			return misys.validateDateGreaterThanHitched(false, 'value_date_date', 'maturityDateLessThanValueDate');
		}
		else {
			return true;
		}

	});
};

fncDoFormOnLoadEvents = function(){
	//  summary:
	//          Events to perform on page load.
	//  tags:
	//         public

	//Disable loadingDialog/waitingDialog closing by using the escape key
	fncDisableLoadingDialogClosing();
};

fncPerformRequest = function(){
	if(fncCheckFields()) 
	{
		fncDoPerformRequest();
	}
};

fncPerformClearWithDialog = function(){
	return;
};

fncInitVar = function(){
	if (dijit.byId('applicant_reference'))
	{
		fncSetGlobalVariable('applicant_reference', dijit.byId('applicant_reference').get('value'));
	}
	else {
		fncSetGlobalVariable('applicant_reference', '');
	}
	fncSetGlobalVariable('remarks', dijit.byId('remarks').get('value'));
	fncSetGlobalVariable('la_cur_code', dijit.byId('la_cur_code').get('value'));
	fncSetGlobalVariable('la_amt', dijit.byId('la_amt').get('value'));
	fncSetGlobalVariable('value_date', dijit.byId('value_date').getDate());
	fncSetGlobalVariable('value_days', dijit.byId('value_date').getNumber());
	fncSetGlobalVariable('value_period', dijit.byId('value_date').getCode());
	fncSetGlobalVariable('maturity_date', dijit.byId('maturity_date').getDate());
	fncSetGlobalVariable('maturity_days', dijit.byId('maturity_date').getNumber());
	fncSetGlobalVariable('maturity_period', dijit.byId('maturity_date').getCode());
	return;
};

_fncGetDisabledFields = function(){
	return [
			'issuing_bank_customer_reference', 'trade_id', 
			'issuing_bank_abbv_name',
			'la_cur_code','la_amt',
			'request_button','request_clear_button',
			/*'value_date_amt_img',*/
			/*'dijit_form_Button_2', 'dijit_form_Button_3',*/
			'value_date','maturity_date','remarks'];
};

_fncGetFieldsToClear = function(){
	return [
			'issuing_bank_customer_reference', 'trade_id', 
			'issuing_bank_abbv_name',
			'la_cur_code','la_amt',
			/*'loan_amt_img',*/
			/*'dijit_form_Button_2', 'dijit_form_Button_3',*/
			'value_date','maturity_date','remarks'];
};

_fncGetEnabledFields = function()
{
	return _fncGetDisabledFields();
};

_fncGetHiddenFieldsToClear = function()
{
	var hiddenFieldsToClear = [

			/* insert fields
			 * 
			 * */
	];
	return hiddenFieldsToClear;
};

_fncGetDateTermFieldsToClear = function()
{
	var datefieldsToClear = ['value_date', 'maturity_date'];
	return datefieldsToClear;
};
//Including the client specific implementation
       dojo.require('misys.client.binding.cash.TradeCreateLaBinding_client');