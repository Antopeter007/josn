dojo.provide("misys.binding.cash.XoActions");
/*
 -----------------------------------------------------------------------------
 Scripts for
  
  Foreign Exchange Order (XO) Form, .
  

 Copyright (c) 2000-2010 Misys (http://www.misys.com),
 All Rights Reserved. 

 version:   1.0
 date:      12/21/10
 -----------------------------------------------------------------------------
 */

//Trigger fields
var listOfTriggers = ['trigger_pos', 'trigger_stop', 'trigger_limit'];

/**
 * Binding rules common to all screens (Add/Retrieve/Update...)
 * (To avoid repetition) 
 */
fncCommonBindingRules = function(){
	
	/*
	 * Validation Events
	 */
	misys.setValidation('counter_cur_code', misys.validateCurrency);
	misys.setValidation('fx_cur_code', misys.validateCurrency);
	
	//Expiration date
	misys.setValidation('value_date', function(){
		if (dijit.byId('value').isBlankSelected())
		{
			misys.validateDateGreaterThanHitched = dojo.hitch(this, misys.validateDateGreaterThan);
			if (!dijit.byId('expiration_date').get('disabled') && dijit.byId('expiration_date').isBlankSelected()){
				misys.validateDateSmallerThanHitched = dojo.hitch(this, misys.validateDateSmallerThan);
				return /*misys.validateDateGreaterThanHitched(false, '', 'DateLessThanDateOfDayError') && */misys.validateDateSmallerThanHitched(false, 'expiration_date_date', 'valueDateGreaterThanExpirationDate');
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
	
	misys.setValidation('expiration_date_date', function(){
		if (dijit.byId('expiration_date').isBlankSelected() && dijit.byId('value').isBlankSelected())
		{
			misys.validateDateGreaterThanHitched = dojo.hitch(this, misys.validateDateGreaterThan);
			return misys.validateDateGreaterThanHitched(false, 'value_date', 'expirationDateLessThanValueDate');
		}
		else {
			return true;
		}
	});

	/*
	 * onChange Events
	 */ 
	misys.connect('fx_cur_code', 'onChange', function(){
		misys.setCurrency(this, ['fx_amt']);
	});
	misys.connect('fx_amt', 'onBlur', function(){
		misys.setTnxAmt(this.get('value'));
	});
	misys.connect('issuing_bank_customer_reference', 'onChange', misys.setApplicantReference);
	
	misys.connect('expiration_code', 'onChange', fncExpirationCodeChange);
	misys.connect('market_order_1', 'onChange', fncMarketOrderChange);
	misys.connect('market_order_2', 'onChange', fncMarketOrderChange);

	dojo.forEach(listOfTriggers, function(field){
		misys.connect(field, 'onChange', _fncTriggerFieldsChange);
		dijit.byId(field).missingMessage = misys.getLocalization('errorXOTriggersNotValid');
	});

};
	

/**
 * enable/disable the Expiration date/time fields depending on the Expiration code
 */
fncExpirationCodeChange = function(){
	var value = dijit.byId('expiration_code').get('value') == "EXPDAT/TIM" ? true : false;
	var requiredFieldIDs = ['expiration_date','expiration_time'];
	
	misys.toggleFields(value, null, requiredFieldIDs, false, false);
};

/**
 * enable/disable the three trigger fields depending on the market order radio button
 */
fncMarketOrderChange = function(){
	var marketOrder = dijit.byId('market_order_1').checked;

	misys.toggleFields(!marketOrder, null, listOfTriggers, true, false);
};

/**
 * changes the status of the trigger fields (required/not required) when at least one of the trigger fields is filled in
 */
var _fncTriggerFieldsChange = function(){
	var isValid = dijit.byId('market_order_1').checked || !(isEmptyField(dijit.byId('trigger_pos')) && isEmptyField(dijit.byId('trigger_stop')) && isEmptyField(dijit.byId('trigger_limit')));

	misys.toggleFields(!isValid, null, listOfTriggers, true, true);
};	
//Including the client specific implementation
       dojo.require('misys.client.binding.cash.XoActions_client');