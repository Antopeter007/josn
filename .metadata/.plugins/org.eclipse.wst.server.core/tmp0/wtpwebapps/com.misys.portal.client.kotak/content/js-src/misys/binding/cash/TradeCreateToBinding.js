dojo.provide("misys.binding.cash.TradeCreateToBinding");
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
dojo.require("misys.binding.cash.request.AccountPopup");
dojo.require("dojo.parser");





fncDoBinding = function(){
	//  summary:
	//            Binds validations and events to fields in the form.              
	//   tags:
	//            public
	
	//actions linked to Actions on period radio button  
	misys.connect('periode_once', 'onChange', function(){
		_fncTogglePeriode('periode_once');
	});
	misys.connect('periode_weekly', 'onChange', function(){
		_fncTogglePeriode('periode_weekly');
	});
	misys.connect('periode_fortnightly', 'onChange', function(){
		_fncTogglePeriode('periode_fortnightly');
	});
	misys.connect('periode_daily', 'onChange', function(){
		_fncTogglePeriode('periode_daily');
	});
	misys.connect('periode_monthly', 'onChange', function(){
		_fncTogglePeriode('fully');
	});
	misys.connect('periode_quaterly', 'onChange', function(){
		_fncTogglePeriode('fully');
	});
	misys.connect('periode_semi_annual', 'onChange', function(){
		_fncTogglePeriode('fully');
	});
	misys.connect('periode_annual', 'onChange', function(){
		_fncTogglePeriode('fully');
	});
	
	//set payment day to active payment list value
	misys.connect('payement_day_weeks', 'onChange', function(){
		_fncSetPayementDay(dijit.byId('payement_day_weeks').get('value'));
	});
	misys.connect('payement_day_days', 'onChange', function(){
		dijit.byId('payement_day').set('value',dijit.byId('payement_day_days').get('value'));
	});
	
	// for the account popup, only on edit mode
	if (dijit.byId('displaymode').get('value')=='edit'){
		fncSetGlobalVariable('orderingAccountPopupFirstOpening', 'true');
		dijit.byId('applicant_act_no_img').set('onClick', 
				function()
				{
					fncOpenAccountPopup('orderingAccount', 'ACT_INTERNAL_ORDERING');
				}
		);
	}
	misys.setValidation('first_payement_date', function(){
		misys.validateDateGreaterThanHitched = dojo.hitch(this, misys.validateDateGreaterThan);
		return misys.validateDateGreaterThanHitched(false, '', 'firstDateGreaterThanDateofDay');
	});
	misys.setValidation('next_payement_date', function(){
		misys.validateDateGreaterThanHitched = dojo.hitch(this, misys.validateDateGreaterThan);
		if (dijit.byId('first_payement_date').get('value') != null && dijit.byId('first_payement_date').get('value') != ''){
			return misys.validateDateGreaterThanHitched(false, 'first_payement_date', 'nextDateGreaterThanFirstDate');
		}
		else {
			return misys.validateDateGreaterThanHitched(false, '', 'nextDateGreaterThanDateofDay');
		}
	});
	misys.setValidation('final_payement_date', function(){
		misys.validateDateGreaterThanHitched = dojo.hitch(this, misys.validateDateGreaterThan);
		if (dijit.byId('next_payement_date').get('value') != null && dijit.byId('next_payement_date').get('value') != ''){
			return misys.validateDateGreaterThanHitched(false, 'next_payement_date', 'finalDateGreaterThanNexttDate');
		}
		else {
			return misys.validateDateGreaterThanHitched(false, '', 'finalDateGreaterThanNexttDate');
		}
	});
	//action linked to Actions SelectBox  
	misys.connect('to_action', 'onChange', function(){
		_fncToggleAction(this.get('value'));
	});
	misys.connect('next_payement_date', 'onChange', function(){
		_fncSetPaymentDayfromDate();
	});
};

fncDoFormOnLoadEvents = function(){
	//  summary:
	//          Events to perform on page load.
	//  tags:
	//         public
	if (dijit.byId('tnxtype').get('value') == '01'){
		_fncTogglePeriode('periode_daily');
	}
	else if (dijit.byId('tnxtype').get('value') == '02')
	{
		_fncCheckPaymentDay();
		_fncInitReview();
		misys.animate("fadeOut", 'to-transfer-details');
	}
	else if (dijit.byId('displaymode').get('value')=='view')
	{
		_fncInitViewMode();
	}
};

 _fncTogglePeriode = function(selectedValue){
	
	// period once call
	if (selectedValue == 'periode_once' && dijit.byId('periode_once').checked)
	{
		// set non mandatory other fields
		_fncRequiredFalse(['payement_day_weeks', 'payement_day_days', 'to_cur_code', 'to_cur_code', 'to_amt', 'next_payement_date']);
		// we clear fields only for period 'once'
		_clearFields(['next_payement_date', 'to_amt', 'final_payement_date', 'final_payement_amt']);
		// hide other fields
		misys.animate("fadeOut", 'periode-div');
		misys.animate("fadeOut", 'final-payement-div');
		// set mandatory fields
		_fncRequiredTrue(['first_payement_date', 'first_payement', 'first_payement_cur_code', 'first_payement_amt']);

	}
	else if ((selectedValue == 'periode_weekly' ||selectedValue == 'periode_fortnightly') && (dijit.byId('periode_weekly').checked || dijit.byId('periode_fortnightly').checked))
	{
		// set non mandatory fields
		_fncRequiredFalse(['first_payement_date', 'first_payement', 'first_payement_cur_code', 'first_payement_amt', 'payement_day_days']);
		// show fields
		misys.animate("fadeIn", 'periode-div');
		misys.animate("fadeIn", 'final-payement-div');
		misys.animate("fadeOut", 'payement-day-days');
		misys.animate("fadeIn", 'payement-day-weeks');
		// mandatory fields
		_fncRequiredTrue(['to_cur_code', 'to_cur_code', 'to_amt', 'next_payement_date', 'payement_day_weeks']);
		//set payement day to active payment list value
		_fncSetPayementDay(dijit.byId('payement_day_weeks').get('value'));
	
	}
	else if (selectedValue == 'periode_daily' && dijit.byId('periode_daily').checked)
	{
		// set non mandatory fields
		_fncRequiredFalse(['first_payement_date', 'first_payement', 'first_payement_cur_code', 'first_payement_amt', 'payement_day_weeks']);
		// show fields
		misys.animate("fadeIn", 'periode-div');
		misys.animate("fadeIn", 'final-payement-div');
		misys.animate("fadeOut", 'payement-day-weeks');
		misys.animate("fadeIn", 'payement-day-days');
		dijit.byId('payement_day_days').set('requiered',false);
		dijit.byId('payement_day_days').set('disabled',true);
		// mandatory fields
		_fncRequiredTrue(['to_cur_code', 'to_cur_code', 'to_amt', 'next_payement_date', 'payement_day_days']);
		//set payement day to active payment list value
		_fncSetPayementDay(dijit.byId('payement_day_weeks').get('value'));

	}
	else if (selectedValue == 'fully' && (dijit.byId('periode_annual').checked || dijit.byId('periode_semi_annual').checked ||dijit.byId('periode_monthly').checked ||dijit.byId('periode_quaterly').checked) )
	{
		misys.animate("fadeIn", 'periode-div');
		misys.animate("fadeIn", 'final-payement-div');
		misys.animate("fadeOut", 'payement-day-weeks');
		misys.animate("fadeIn", 'payement-day-days');
		// only for the creation mode
		if (dijit.byId('tnxtype').get('value') == '01'){dijit.byId('payement_day_days').set('disabled',false);}
		// enabled and set mandatory fields
		_fncRequiredTrue(['to_cur_code', 'to_cur_code', 'to_amt', 'next_payement_date', 'payement_day_days']);
		// set non mandatory fields
		_fncRequiredFalse(['first_payement_date', 'first_payement', 'first_payement_cur_code', 'first_payement_amt', 'payement_day_weeks']);
	}
};

_clearFields = function(/*String[]*/ fields){
	dojo.forEach(fields, function(id){
		fncClearField(id);
	});
};

/*
 * Clear a field (including Textbox, Checkbox, dateTextBox or TimeTextBox)
 */
// TODO You can usually just call .reset() on a field
// If you can't, probably better to keep this function here and not encourage
// its use, otherwise we have to keep a list of all new declaredClass values 
fncClearField = function(/*Dijit|String*/ node){
	var field = dijit.byId(node);
	if (field) {
	    var declaredClass = field.declaredClass;
		if (declaredClass == 'dijit.form.CheckBox') {
			field.set('checked', false);
		}
		else if (declaredClass == 'dijit.form.DateTextBox' || declaredClass == 'dijit.form.TimeTextBox') {
			field.set('value', null);
		}
		else {
			field.set('value', '');
		}
	}
};

_fncRequiredTrue = function(fields)
{
	dojo.forEach(fields, function(id){
		var field = dijit.byId(id);
		if(field)
		{	
			misys.toggleRequired(field,true);
		}
	});
};

_fncRequiredFalse = function(fields)
{
	dojo.forEach(fields, function(id){
		var field = dijit.byId(id);
		if(field)
		{	
			misys.toggleRequired(field,false);
		}
	});
};

_fncSetPayementDay = function(value)
{
	if (value=='MO')
	{
		value='01';
	}
	else if (value=='TU')
	{
		value='02';
	}
	else if (value=='WE')
	{
		value='03';
	}
	else if (value=='TH')
	{
		value='04';
	}
	else if (value=='FR')
	{
		value='05';
	}
	else if (value=='SA')
	{
		value='06';
	}
	else if (value=='SU')
	{
		value='07';
	}
	dijit.byId('payement_day').set('value',value);
};

_fncSetPaymentDayfromDate = function()
{
	if (dijit.byId('periode_annual').checked || dijit.byId('periode_semi_annual').checked ||dijit.byId('periode_monthly').checked ||dijit.byId('periode_quaterly').checked)
	{
		dijit.byId('payement_day_days').set('value', dijit.byId('next_payement_date').get('displayedValue').split('/')[0]);
	}
};

fillAccountField = function(accountType, accountSelected){
	if (accountType == 'orderingAccount'){
		dijit.byId('applicant_reference').set('value', accountSelected.customer_ref);
		dijit.byId('applicant_act_no').set('value', accountSelected.account_no);
		dijit.byId('applicant_act_name').set('value', accountSelected.name);
		dijit.byId('applicant_act_cur_code').set('value', accountSelected.cur_code);
		dijit.byId('to_cur_code').set('value', accountSelected.cur_code);
		dijit.byId('first_payement_cur_code').set('value', accountSelected.cur_code);
		dijit.byId('final_payement_cur_code').set('value', accountSelected.cur_code);
		
	}
	else if (accountType == 'beneficiaryAccount'){
		dijit.byId('transfer_account').set('value', accountSelected.account_no);
		dijit.byId('transfer_account_cur_code').set('value', accountSelected.cur_code);
	}
};
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
// FUNCTIONS FOR OPENING AN ORDER
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
_fncInitReview = function(){
	dijit.byId('applicant_act_no_img').set('style', 'display:none');
	if (dijit.byId('periode_once').checked)
	{
		_fncTogglePeriode('periode_once');
	}
	else if (dijit.byId('periode_weekly').checked)
	{
		_fncTogglePeriode('periode_weekly');
		dijit.byId('payement_day_weeks').setDisplayedValue(_fncSetPaymentDayWeeks(dijit.byId('payement_day').get('value')));
	}
	else if (dijit.byId('periode_fortnightly').checked)
	{
		_fncTogglePeriode('periode_fortnightly');
		//_fncSetPaymentDayWeeks(dijit.byId('payement_day').get('value'));
		dijit.byId('payement_day_weeks').setDisplayedValue(_fncSetPaymentDayWeeks(dijit.byId('payement_day').get('value')));
	}
	else if (dijit.byId('periode_daily').checked)
	{
		_fncTogglePeriode('periode_daily');
	}
	else if (dijit.byId('periode_monthly').checked || dijit.byId('periode_quaterly').checked || dijit.byId('periode_semi_annual').checked || dijit.byId('periode_annual').checked)
	{
		_fncTogglePeriode('fully');
		dijit.byId('payement_day_days').setDisplayedValue(dijit.byId('payement_day').get('value'));
	}
	// disabled first payment date & amount if needed
	// variables use for the date comparaison
	var dateOfDay = new Date();
	var dod = new dijit.form.DateTextBox({id:'dateOfDay',value:dateOfDay},'myDate');
	if (_fncCompareDateFields(dijit.byId('first_payement_date'), dijit.byId('dateOfDay')))
	{
		dijit.byId('first_payement_date').set('disabled', true);
		dijit.byId('first_payement_amt').set('disabled', true);
	}
	// disabled next payment date & amount if needed
	if (_fncCompareDateFields(dijit.byId('next_payement_date'), dijit.byId('dateOfDay')))
	{
		dijit.byId('next_payement_date').set('disabled', true);
		dijit.byId('to_amt').set('disabled', true);
		dijit.byId('payement_day_days').set('disabled', true);
		dijit.byId('payement_day_weeks').set('disabled', true);
	}
};
_fncCheckPaymentDay = function(){
	value = dijit.byId('payement_day').get('value');
	if(value.length == '1'){
		dijit.byId('payement_day').set('value', '0'+value);
	}
};

_fncSetPaymentDayWeeks = function(value)
{
	if (value=='01')
	{
		value='Monday';
	}
	else if (value=='02')
	{
		value='Tuedsay';
	}
	else if (value=='03')
	{
		value='Wednesday';
	}
	else if (value=='04')
	{
		value='Thursday';
	}
	else if (value=='05')
	{
		value='Friday';
	}
	else if (value=='06')
	{
		value='Saturday';
	}
	else if (value=='07')
	{
		value='Sunday';
	}
	//dijit.byId('payement_day_weeks').setDisplayedValue(value);
	return value;
};

_fncToggleAction = function(/*String*/ value){
	if (value == '18'){
		misys.animate("fadeIn", 'to-transfer-details');
		_fncInitReview();
	}
	else if (value == '22'){
		_fncRequiredFalse(['payement_day_weeks', 'payement_day_days', 'to_cur_code', 'to_cur_code', 'to_amt', 'next_payement_date', 'first_payement_date', 'first_payement', 'first_payement_cur_code', 'first_payement_amt']);
		misys.animate("fadeOut", 'to-transfer-details');
	}
	dijit.byId('sub_tnx_type_code').set('value', value);
};

//*-*-*-*-*-*-*-*-*-*-*-*
//FUNCTIONS FOR REVIEW
//*-*-*-*-*-*-*-*-*-*-*-*
_fncInitViewMode = function(){
	dojo.query('#periodicity-div .content').forEach(function(field){
		var content = field.innerHTML;
		if (content == "Once")
		{
			dojo.style('payement-day-weeks', 'display', 'none');
			dojo.style('payement-day-days', 'display', 'none');
		}
		else if (content == 'Weekly' || content == 'Fortnighly')
		{
			dojo.style('payement-day-days', 'display', 'none');
			dojo.query('#payement-day-weeks .content').forEach(function(content){content.innerHTML = _fncSetPaymentDayWeeks(dijit.byId('payement_day').get('value'));});
		}
		else 
		{
			dojo.style('payement-day-weeks', 'display', 'none');
			dojo.query('#payement-day-days .content').forEach(function(content){content.innerHTML = dijit.byId('payement_day').get('value');});
		}
	});	
};//Including the client specific implementation
       dojo.require('misys.client.binding.cash.TradeCreateToBinding_client');