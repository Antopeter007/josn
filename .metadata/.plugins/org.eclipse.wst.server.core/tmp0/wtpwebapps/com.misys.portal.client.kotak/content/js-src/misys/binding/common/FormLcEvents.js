dojo.provide("misys.common.FormLcEvents");
/*
 -----------------------------------------------------------------------------
 Scripts common across Letter of Credit forms (LC, SI, SR, EL).

 Copyright (c) 2000-2010 Misys (http://www.misys.com),
 All Rights Reserved. 

 version:   1.0
 date:      15/02/08
 author:    Cormac Flynn
 -----------------------------------------------------------------------------
 */

// TODO Needs to be reworked entirely, spec of payment/draft at behaviour drawn up

/*
 * Value constants for the field credit_available_with_bank_type 
 */

misys._config = misys._config || {};
dojo.mixin(misys._config, {
	ADVISING_BANK : 'Advising Bank',
	ANY_BANK : 'Any Bank',
	ISSUING_BANK : 'Issuing Bank',
	OTHER :  'Other',
	NAMED_BANK : 'Named Bank',
	FIRST_PAGE_LOAD : false
});

fncSetCreditAvailBy = function(){
	//  summary:
    //        Set the value for the credit bank name, and perform other actions.
    //  tags:
    //        public
	
	console.debug('[LcEvent] Setting Credit/Available By Values');
	var theObjValue = this.get('value');
	fncToggleDynamicFields((theObjValue === fncGetGlobalVariable('OTHER')), 
			[
			'credit_available_with_bank_address_line_1',
			'credit_available_with_bank_address_line_2',
			'credit_available_with_bank_dom',
			'credit_available_with_bank_address_line_4'], 
			['credit_available_with_bank_name']);

	var crAvlBankName = dijit.byId('credit_available_with_bank_name');
	switch(theObjValue){
	 case fncGetGlobalVariable('ADVISING_BANK'):
		crAvlBankName.set('value', fncGetGlobalVariable('ADVISING_BANK'));
		break;
	 case fncGetGlobalVariable('ANY_BANK'):
		crAvlBankName.set('value', fncGetGlobalVariable('ANY_BANK'));
		break;
	 case fncGetGlobalVariable('ISSUING_BANK'):
		crAvlBankName.set('value', fncGetGlobalVariable('ISSUING_BANK'));
		break;
	 case fncGetGlobalVariable('OTHER'):
		var crAvlBankNameValue = crAvlBankName.get('value');
		if(crAvlBankNameValue === fncGetGlobalVariable('ADVISING_BANK') ||
			crAvlBankNameValue === fncGetGlobalVariable('ANY_BANK') ||
			crAvlBankNameValue === fncGetGlobalVariable('ISSUING_BANK')){
			crAvlBankName.reset();
		}
		break;
	 default:
		break;
	}
	console.debug('[LcEvent] credit_available_with_bank_name now has the value ' + crAvlBankName.get('value'));
	
	// Drawee Bank Details
	var crlAvlBy = '';
	if(dijit.byId('cr_avl_by_code_1').get('checked'))
	{
		crlAvlBy = '01';
	}
	else if(dijit.byId('cr_avl_by_code_2').get('checked'))
	{
		crlAvlBy = '02';
	}
	else if(dijit.byId('cr_avl_by_code_3').get('checked'))
	{
		crlAvlBy = '03';
	}
	else if(dijit.byId('cr_avl_by_code_4').get('checked'))
	{
		crlAvlBy = '04';
	}
	else if(dijit.byId('cr_avl_by_code_5').get('checked'))
	{
		crlAvlBy = '05';
	}
	
	_fncToggleDraweeBankDetails(crlAvlBy, this);
};

// TODO Switch this to use the function fncToggleDynamicFields
fncTogglePaymentDraftAt = function(){
	//  summary:
    //        Shows the particular form fields depending on the selection made in 'Credit Available By'.
    //  tags:
    //        public
	var tenorType1 = dijit.byId('tenor_type_1');
	var tenorType2 = dijit.byId('tenor_type_2');
	var tenorType3 = dijit.byId('tenor_type_3');
	var draftTerm = dijit.byId('draft_term');
	var theObjValue = this.get('value');
	
	tenorType1.set("checked", false);
	tenorType1.set("disabled", true);
	tenorType2.set("disabled", true);
	tenorType2.set("checked", false);
	tenorType3.set("disabled", true);
	tenorType3.set("checked", true);

	// Everything disabled and cleared by default
	var FIRST_PAGE_LOAD = (fncGetGlobalVariable('FIRST_PAGE_LOAD') === 'true') ? true : false;
	if(FIRST_PAGE_LOAD && theObjValue !=='05')
	{
		draftTerm.set('value','');
	}
	var paymentDraftDiv = dojo.byId('payment-draft');
	var draftTermDiv = dojo.byId('draft-term');
	
	// By default, display payment draft
	if(theObjValue !=='05' && dojo.style(paymentDraftDiv, 'opacity') !== 1){
		misys.animate("fadeOut", draftTermDiv);
		misys.animate("fadeIn", paymentDraftDiv);
	}

	switch(theObjValue){
	 case '01':
		tenorType1.set("disabled", false);
		tenorType1.set("checked", true);
		fncToggleDraftTerm('01');
		break;
	 case '02':
		tenorType2.set("disabled", false);
		tenorType3.set("disabled", false);
		tenorType3.set("checked", true);
		fncToggleDraftTerm('03');
		break;
	 case '03':
		tenorType2.set("disabled", true);
		tenorType3.set("disabled", false);
		tenorType3.set("checked", true);
		fncToggleDraftTerm('03');
		break;
	 case '04':
		tenorType2.set("disabled", false);
		tenorType3.set("disabled", false);
		tenorType3.set("checked", true);
		fncToggleDraftTerm('03');
		break;
	 case '05':
		misys.animate("fadeOut", paymentDraftDiv);
		misys.animate("fadeIn", draftTermDiv);
		tenorType1.set("checked", false);
		tenorType2.set("checked", false);
		tenorType3.set("checked", false);
		fncToggleDraftTerm('99');
		break;
	 default:
		break;
	}

	var creditAvlBankType = dijit.byId('credit_available_with_bank_type');
	if(creditAvlBankType)
	{
		_fncToggleDraweeBankDetails(theObjValue, creditAvlBankType);
	}
	fncDraweeReadOnlyByCredit();
};

fncToggleBankPaymentDraftAt = function()
{
	//  summary:
    //        Toggles bank-side 'payment draft at' fields.
    //  tags:
    //        public
	
	var fieldsToClear = ['draft_term', 'drawee_details_bank_name', 'drawee_details_bank_address_line_1',
			'drawee_details_bank_address_line_2', 'drawee_details_bank_dom', 'drawee_details_bank_iso_code',
			'drawee_details_bank_reference'];

	dojo.forEach(fieldsToClear, function(id){
		var field = dijit.byId(id);
		if(field)
		{
			field.reset();
		}
	});
};

fncToggleDraftTerm = function(strDraftTermType){
	//  summary:
    //        Toggles the display of the draft term
    //  tags:
    //        public
	
	if(dojo.isObject(strDraftTermType)){
		strDraftTermType = this.get('value');
	}

	var tenorType1 = dijit.byId('tenor_type_1');
	var tenorType2 = dijit.byId('tenor_type_2');
	var tenorType3 = dijit.byId('tenor_type_3');
	var FIRST_PAGE_LOAD = (fncGetGlobalVariable('FIRST_PAGE_LOAD') === 'true') ? true : false;
	
	var keepFieldValues = false;
	if((dijit.byId('tenor_maturity_date').get('displayedValue') !== "") && !FIRST_PAGE_LOAD)
	{
		keepFieldValues = true;
	}
	//dijit.byId('draft_term').set('value', '');
	fncToggleDynamicFields((strDraftTermType === '02'), null, ['tenor_maturity_date'], keepFieldValues);  // Hide maturity date
	_fncTogglePaymentDraftDate((strDraftTermType === '03'));
};

fncWriteDraftTerm = function()
{
	//  summary:
    //        Write the draft term value.
    //  tags:
    //        public
	
	var draftTerm = dijit.byId('draft_term'),
		tenorPeriodLabels = misys._config.tenorPeriodLabels,
		tenorFromAfterLabels = misys._config.tenorFromAfterLabels,
		tenorDaysTypeLabels = misys._config.tenorDaysTypeLabels;
	
	if(draftTerm)
	{
		//draftTerm.set('value', '');
		if(dijit.byId('tenor_type_1').get('checked'))
		{
			draftTerm.set('value','Sight');
		}
		else if(dijit.byId('tenor_type_2').get('checked') && dijit.byId('tenor_maturity_date').get('displayedValue') !== "")
		{
			draftTerm.set('value', 'Maturity date: ' + dijit.byId('tenor_maturity_date').get('displayedValue'));
		}
		else
		{
			var period = dijit.byId('tenor_period').get('value');
			var fromAfter = dijit.byId('tenor_from_after').get('value');
			var days = dijit.byId('tenor_days').get('value');
			var daysType = dijit.byId('tenor_days_type').get('value');
	
			if(!isNaN(days) && days !== 0)
			{
			 if(daysType !== '99'){
				draftTerm.set('value', days + ' ' + tenorPeriodLabels[period] + ' ' + tenorFromAfterLabels[fromAfter] +
				' ' + tenorDaysTypeLabels[daysType]);
			 } else{
				draftTerm.set('value', days + ' ' + tenorPeriodLabels[period] + ' ' + tenorFromAfterLabels[fromAfter] +
				' ' + dijit.byId('tenor_type_details').get('value'));
			 }
			} 
		}
		console.debug('[LcEvent] draft_term value is now \'' + draftTerm.get('value') + '\'');
	}
};

fncDraweeReadOnlyByCredit = function(){
	//  summary:
    //        Control the drawee details value.
    //  tags:
    //        public
	
	var crAvlByCode2Checked = dijit.byId('cr_avl_by_code_2').get('checked');
	var crAvlByCode3Checked = dijit.byId('cr_avl_by_code_3').get('checked');

	if(!crAvlByCode2Checked && !crAvlByCode3Checked){
		dijit.byId('drawee_details_bank_name').set('value', '');
		if(dijit.byId('drawee_details_bank_address_line_1')) {
			dijit.byId('drawee_details_bank_address_line_1').set('value', '');
			dijit.byId('drawee_details_bank_address_line_2').set('value', '');
			dijit.byId('drawee_details_bank_dom').set('value', '');
		}
	}
	
	fncToggleDynamicFields(
			crAvlByCode2Checked || crAvlByCode3Checked,
			['drawee_details_bank_address_line_2', 'drawee_details_bank_dom'],
			['drawee_details_bank_name', 'drawee_details_bank_address_line_1'],
			true);
};

fncDraftDaysReadOnly = function(){
	//  summary:
    //        Control draft days read only.
    //  tags:
    //        public
	this.set('readOnly', !dijit.byId('tenor_type_3').get('checked'));
};

fncCheckIrrevocableFlag = function(){
	//  summary:
    //        Validate the Irrevocable flag against the Transferable and Stand By flags (if required).
    //  tags:
    //        public
	
	var ntrfFlag = dijit.byId('ntrf_flag');
	var stndByLcFlag = dijit.byId('stnd_by_lc_flag');

	if((ntrfFlag && stndByLcFlag) && (!this.checked && !ntrfFlag.checked && stndByLcFlag.checked))
	{
			this.set('checked', true);
			fncShowTooltip(fncGetLocalizationString('irrevocableStandByError'), this.domNode, ['before']);
	} 
};

fncCheckNonTransferableFlag = function(){
	//  summary:
    //        Check the Non Transferable flag against the Irrevocable and Stand By flags.
    //  tags:
    //        public
	
	var irvFlag = dijit.byId('irv_flag');
	var stndByLcFlag = dijit.byId('stnd_by_lc_flag');

	if((irvFlag && stndByLcFlag) && (!this.checked && !irvFlag.checked && stndByLcFlag.checked))
	{
			this.set('checked', false);
			irvFlag.set('checked', true);
			fncShowTooltip(fncGetLocalizationString('irrevocableStandByError'), irvFlag.domNode, ['before']);
	}
};

fncCheckStandByFlag = function(){
	//  summary:
    //        Check the Non Transferable flag against the Irrevocable and Stand By flags.
    //  tags:
    //        public
	
	var irvFlag = dijit.byId('irv_flag');
	var ntrfFlag = dijit.byId('ntrf_flag');

	if((ntrfFlag && irvFlag) &&(this.checked && !ntrfFlag.checked && !irvFlag.checked))
	{
			this.set('checked', true);
			irvFlag.set('checked', true);
			fncShowTooltip(fncGetLocalizationString('irrevocableStandByError'), irvFlag.domNode, ['before']);
	} 
};

fncResetConfirmationCharges = function(){
	//  summary:
    //        Reset the confirmation charges according to the confirmation instructions.
    //  tags:
    //        public
	
	dijit.byId('cfm_chrg_brn_by_code_1').set('checked', false);
	var chrgBrn2 = dijit.byId('cfm_chrg_brn_by_code_2');
	
	if(this.get('value') === '03'){
		chrgBrn2.set('checked', false);
	} else{
		chrgBrn2.set('checked', true);
	}
};

fncCheckConfirmationCharges = function(){
	//  summary:
    //        If the confirmation instructions say Without, always uncheck the confirmation charges.
    //  tags:
    //        public
	
	if(dijit.byId('cfm_inst_code_3').checked){
		this.set('checked', false);
		fncShowTooltip(fncGetLocalizationString('confirmationInstructionsError'), dojo.byId('cfm_chrg_brn_by_code_1'), ['before']);
	}
};

fncToggleRenewDetails = function(theObj, keepFieldValues){
	//  summary:
    //        Toggle the display of the renewal details.
    //  tags:
    //        public
	
	fncToggleDynamicFields(theObj.checked, ['advise_renewal_flag',
			'rolling_renewal_flag', 'renew_amt_code_1', 'renew_amt_code_2'],
			['renew_on_code', 'renew_for_nb', 'renew_for_period'], keepFieldValues);

	// Reset other fields
	if(!keepFieldValues)
	{
		dijit.byId('renewal_calendar_date').reset();
		dijit.byId('advise_renewal_days_nb').reset();
		dijit.byId('rolling_renewal_nb').reset();
		dijit.byId('rolling_cancellation_days').reset();
	
		dijit.byId('advise_renewal_flag').set('checked', false);
		dijit.byId('rolling_renewal_flag').set('checked', false);
	}
};

fncToggleDependentFields = function(/*Widget*/ field, /*Widget*/ dependentField, /*String*/ tooltipLocalizationString) {
	//  summary:
    //        The object field cannot have a value if the object dependentField already has one
    //  tags:
    //        public
	field.set('readOnly', false);
	dependentField.set('readOnly', false);
	if(dependentField.get('displayedValue') !== "" && field.get('displayedValue') !== "")
	{
		field.set('displayedValue', '');
		field.set('readOnly', true);
		if(tooltipLocalizationString)
		{
			fncShowTooltip(tooltipLocalizationString, field.domNode);
		}
	}
};

// Private methods follow

_fncToggleDraweeBankDetails = function(theObjValue, creditAvlBankType)
{
	//  summary:
    //        Set the value of drawee details.
    //  tags:
    //        private
	
	var creditAvlBankTypeVal = creditAvlBankType.get('value');
	var draweeDetailsBankName = dijit.byId('drawee_details_bank_name');
	
	switch(creditAvlBankTypeVal){
	 case fncGetGlobalVariable('ISSUING_BANK'):
		draweeDetailsBankName.set('value', fncGetGlobalVariable('ISSUING_BANK'));
		break;
	 case fncGetGlobalVariable('ADVISING_BANK'):
		if(theObjValue !== '03'){
			draweeDetailsBankName.set('value', fncGetGlobalVariable('ADVISING_BANK'));
		} else{
			draweeDetailsBankName.set('value', fncGetGlobalVariable('ISSUING_BANK'));
		}
		break;
	 case fncGetGlobalVariable('ANY_BANK'):
		draweeDetailsBankName.set('value', fncGetGlobalVariable('ISSUING_BANK'));
		break;
	 default:
		if(theObjValue === '01' || (theObjValue !== '02' && theObjValue !== '03'))
		{
			/*jsl:pass*/
			// TODO error in original script
			// draweeDetailsBankName.set('value',fncGetGlobalVariable('NAMED_BANK'));
		} 
		else 
		{
			draweeDetailsBankName.set('value', fncGetGlobalVariable('ISSUING_BANK'));
		}
		break;
	}
};

_fncTogglePaymentDraftDate = function(doToggle){
	//  summary:
    //       Toggle payment draft date.
    //  tags:
    //        private
	
	fncToggleDynamicFields(doToggle, null, ['tenor_days',
			'tenor_period', 'tenor_from_after', 'tenor_days_type']);
	dijit.byId('tenor_type_details').set('value', '');
};//Including the client specific implementation
       dojo.require('misys.client.binding.common.FormLcEvents_client');