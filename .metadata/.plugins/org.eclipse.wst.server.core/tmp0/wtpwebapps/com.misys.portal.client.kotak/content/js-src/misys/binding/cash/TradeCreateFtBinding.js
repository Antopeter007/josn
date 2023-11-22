dojo.provide("misys.binding.cash.TradeCreateFtBinding");
/*
 -----------------------------------------------------------------------------
 Scripts for
  
  Fund Transfer (FT) Form, Customer Side
  
 Note: the function fncFormSpecificValidation is required

 Copyright (c) 2000-2010 Misys (http://www.misys.com),
 All Rights Reserved. 

 version:   1.0
 date:      19/03/08
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
dojo.require("dojo.parser");
dojo.require("dijit.form.DateTextBox");
dojo.require("misys.form.CurrencyTextBox");
dojo.require("dijit.form.FilteringSelect");
dojo.require("misys.form.SimpleTextarea");
dojo.require("misys.form.addons");
dojo.require("misys.form.file");
dojo.require("dijit.layout.TabContainer");
dojo.require("dojox.grid.DataGrid");
dojo.require("dojox.grid.cells.dijit");
dojo.require("misys.widget.Collaboration");
dojo.require("misys.binding.cash.request.RequestAction");
dojo.require("misys.binding.cash.request.AccountPopup");
dojo.require("misys.binding.cash.TradeCreateFtAjaxCall");
dojo.require("misys.binding.cash.TradeCreateFtPopupManagement");


fncDoBinding = function(){
	//  summary:
    //            Binds validations and events to fields in the form.              
    //   tags:
    //            public
	var ft_type = '';
	if (dijit.byId('ft_type')){
		ft_type = dijit.byId('ft_type').get('value');
	}
	fncSetGlobalVariable('ft_type', ft_type);
	
	misys.setValidation('template_id', misys.validateTemplateId);
	misys.setValidation('iss_date', misys.validateExecDate);
	if(ft_type === '01' || ft_type === '05'){
		misys.setValidation('ft_cur_code', function(){
			return _fncValidateCurrencies();
		});

		misys.connect('ft_amt', 'onBlur', function(){
			misys.setTnxAmt(this.get('value'));
		});
	}
	if(ft_type === '02' || ft_type === '05'){
		misys.setValidation('payment_cur_code', misys.validateCurrency);
		misys.connect('payment_cur_code', 'onChange', function(){
			misys.setCurrency(this, ['ft_amt']);
		});
		misys.connect('payment_amt', 'onBlur', function(){
			misys.setTnxAmt(this.get('value'));
		});
	}
	
	// set currency for payment if need
	if (dijit.byId('ft_type').get('value') === '05'){
		misys.connect('transfer_account_cur_code', 'onChange', function(){
			dijit.byId('payment_cur_code').set('value', dijit.byId('transfer_account_cur_code').get('value'));
		});
	}
	// this is done when an account is chosen
	misys.connect('input_cur_code', 'onBlur', misys.initFTCounterparties);
	misys.connect('issuing_bank_abbv_name', 'onChange', misys.populateReferences);
	if(dijit.byId('issuing_bank_abbv_name'))
	{
		misys.connect('entity', 'onChange', function(){
			 dijit.byId('issuing_bank_abbv_name').onChange();});
	}
	misys.connect('issuing_bank_customer_reference', 'onChange', misys.setApplicantReference);
	
	misys.setValidation('iss_date', function(){
		misys.validateDateGreaterThanHitched = dojo.hitch(this, misys.validateDateGreaterThan);
		return misys.validateDateGreaterThanHitched(false, '', 'executionDateLessThanDateofDay');
	});
	if(ft_type === '01'){
		misys.setValidation('applicant_act_no', function(){
			fncValidateAccountHitched = dojo.hitch(this, fncValidateAccount);
			return fncValidateAccountHitched('transfer_account');
		});
		misys.setValidation('transfer_account', function(){
			fncValidateAccountHitched = dojo.hitch(this, fncValidateAccount);
			return fncValidateAccountHitched('applicant_act_no');
		});
	}
	
};

fncDoFormOnLoadEvents = function(){
	//  summary:
    //          Events to perform on page load.
    //  tags:
    //         public
	var ft_type = fncGetGlobalVariable('ft_type');
	
//	if(ft_type == '01' || ft_type == '05'){
//		//misys.setCurrency(dijit.byId('ft_cur_code'), ['ft_amt']);
//		dijit.byId('ft_cur_code').set('disabled', true);
//	}
//	if(ft_type == '02' || ft_type == '05'){
//		//misys.setCurrency(dijit.byId('ft_cur_code'), ['ft_amt']);
//		dijit.byId('payment_cur_code').set('disabled', true);
//	}
	
	misys.setCurrency(dijit.byId('counterparty_details_ft_cur_code_nosend'), ['counterparty_details_ft_amt_nosend']);
	
	var issuingBankAbbvName = dijit.byId('issuing_bank_abbv_name');
	if(issuingBankAbbvName)
	{
		issuingBankAbbvName.onChange();
	}
	
	var issuingBankCustRef = dijit.byId('issuing_bank_customer_reference');
	if(issuingBankCustRef)
	{
		issuingBankCustRef.onChange();
	}
	
	// modify onclick for submit button
	if (dijit.byId('submitButton')){
		dijit.byId('submitButton').set('onClick', 
				function()
				{
					fncRequestFT();
				}
		);
	}
	if (dijit.byId('submitButton2')){
		dijit.byId('submitButton2').set('onClick', 
				function()
				{
					fncRequestFT();
				}
		);
	}
	// modify popup for account search
	fncSetGlobalVariable('orderingAccountPopupFirstOpening', 'true');
	if (dijit.byId('applicant_act_no_img')){
		dijit.byId('applicant_act_no_img').set('onClick', 
				function()
				{
					if(ft_type === '01'){
						fncOpenAccountPopup('orderingAccount', 'ACT_INTERNAL_ORDERING');
					}
					else if(ft_type === '02'){
						fncOpenAccountPopup('orderingAccount', 'ACT_EXTERNAL_ORDERING');
					}
					else if(ft_type === '05'){
						fncOpenAccountPopup('orderingAccount', 'ACT_EXTERNAL_ORDERING');
					} 
				}
		);
	}
	// only for transfer
	if(ft_type === '01' || ft_type === '05'){ 
		fncSetGlobalVariable('beneficiaryAccountPopupFirstOpening', 'true');
		dijit.byId('transfer_account_img').set('onClick', 
				function()
				{
					if(ft_type === '01'){
						fncOpenAccountPopup('beneficiaryAccount', 'ACT_INTERNAL_BENEFICIARY');
					}
					else if(ft_type === '05'){
						fncOpenAccountPopup('beneficiaryAccount', 'ACT_EXTERNAL_BENEFICIARY');
					} 
				}
		);
	}
	// disabled closing popup with the escape key
	misys.connect(dijit.byId('dealSummaryDialog'), 'onKeyPress', function (evt){
		 if(evt.keyCode === dojo.keys.ESCAPE){
			 dojo.stopEvent(evt);
		 }
	});
	misys.connect(dijit.byId('ft-waiting-Dialog'), 'onKeyPress', function (evt){
		 if(evt.keyCode === dojo.keys.ESCAPE){
			 dojo.stopEvent(evt);
		 }
	});
//	 to add only one beneficiary
};

fncDoPreSubmitValidations = function(){
	//  summary: 
	//            Form-specific validations
	//  description:
    //            Specific pre-submit validations for this form, that are called after
	//            the standard Dojo validations.
	//
	//            Here we check if disabled fields aren't empty.
    //  tags:
    //            public
	
	var ft_type = fncGetGlobalVariable('ft_type');
	var validDebit = dijit.byId('applicant_act_no').get('value') != '';
	var validTransfer = true;
	var validPayment = true;
	if (ft_type === '01' || ft_type === '05'){
		validTransfer =  dijit.byId('transfer_account').get('value') != '';
	}
	if (ft_type === '02' || ft_type === '05'){
		validPayment =  dijit.byId('beneficiary_country').get('value') != '' && dijit.byId('beneficiary_bank_country').get('value') !== "" &&  dijit.byId('payment_cur_code').get('value') !== "" && dijit.byId('payment_amt').get('value') !== "";
	}
	return validDebit && validTransfer && validPayment;
 };

//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
// Submission functions
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-* 
fncRequestFT = function(){
	if(fncCheckFields() && fncDoPreSubmitValidations()) 
	{
		if (fncGetGlobalVariable('ft_type') === '01'){
			fncFillVar();
			_fncAjaxRequestFT();
		}
		else if (fncGetGlobalVariable('ft_type') === '02'){
			fncFillVar();
			_fncAjaxRequestFT();
		}
		else if (fncGetGlobalVariable('ft_type') === '05'){
			fncFillVar();
			_fncAjaxRequestFT();
		}
	}
};
fncAcceptFT = function(){
	dijit.byId('option').set('value', 'ACCEPT');
	misys.submit('SUBMIT');
};
fncRejectFT = function(){
	if(misys.countdown){
		_stopCountDown(misys.countdown);
	}
	_fncAjaxCancelFT();
};

//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
// Function use to add a counter party
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
// TODO: TO IMPLEMENTS, not used yet
_fncOpenCounterPartyDialog = function(){
	console.debug('_fncOpenCounterPartyDialog>>'+fncGetGlobalVariable('haveABeneficiaryAccount'));
	if (dojo.byId('counterparty_row_0') == null){fncSetGlobalVariable('haveABeneficiaryAccount', 'false');}
	if (fncGetGlobalVariable('haveABeneficiaryAccount') === 'false'){
		// call the original function to open counterpartyDialog
		misys.showCounterpartyDialog('counterparty');
	}
};

_fncDoAddCounterpartyActions = function(){
	console.debug('_fncDoAddCounterpartyActions>>'+fncGetGlobalVariable('haveABeneficiaryAccount'));
	// fill hidden field
	dijit.byId('counterparty_acct_no').set('value', dijit.byId('counterparty_details_act_no_nosend').get('value'));
	dijit.byId('counterparty_name').set('value',  dijit.byId('counterparty_details_name_nosend').get('value'));
	dijit.byId('counterparty_cur_code').set('value', dijit.byId('counterparty_details_ft_cur_code_nosend').get('value'));
	// call the original function to add a counterparty
	var isOk = fncDoAddCounterpartyActions('counterparty');
	if (isOk){
		console.debug('_fncDoAddCounterpartyActions>> IsOk');
		fncSetGlobalVariable('haveABeneficiaryAccount', 'true');
	}
};
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
// Validation Functions
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
fncValidateAccount = function(secondAccountField){
	var messageError;
	if (secondAccountField === "applicant_act_no"){
		messageError = 'creditAcctEqualsToDebitAcct';
	}
	else {
		messageError = 'debitAcctEqualsToCreditAcct';
	}
	var firstAcct = this.get('value');
	var secondAcct = dijit.byId(secondAccountField).get('value');
	console.debug('[INFO] Validate account:'+this.id);
	if (secondAcct !== "" && (this.state !== 'Error' || dijit.byId(secondAccountField).state !== 'Error'))
	{
		console.debug('[INFO] Validate equals account :'+firstAcct+' & '+secondAcct);
		if (firstAcct === secondAcct)
		{		
			this.displayMessage(misys.getLocalization(messageError, [firstAcct, secondAcct]));
			return false;
		}
		else if (dijit.byId(secondAccountField).state === 'Error'){
			dijit.byId(secondAccountField).validate();
		}
	}
	return true;
};

_fncValidateCurrencies = function(){
	var curr = dijit.byId('ft_cur_code').get('value');
	var firstCurr = dijit.byId('applicant_act_cur_code').get('value');
	var secondCurr = dijit.byId('transfer_account_cur_code').get('value');
	if (firstCurr !== "" && secondCurr !== "" && this.state !== 'Error')
	{
		console.debug('[INFO] Validate currencies: '+curr+', with: '+firstCurr+' and '+secondCurr);
		if (curr !== firstCurr && curr !== secondCurr)
		{
			dijit.byId('ft_cur_code').invalidMessage = misys.getLocalization('transferCurrencyDifferentThanAccountsCurrencies', [curr, firstCurr, secondCurr]);
			return false;
		}
	}
	return true;
};

//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
//  Miscellaneous Functions
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-* 

fncFillVar = function(){
	
	// global variable
	if (dijit.byId('applicant_reference_hidden'))
	{
		fncSetGlobalVariable('applicant_reference', dijit.byId('applicant_reference_hidden').get('value'));
	}
	else {
		fncSetGlobalVariable('applicant_reference', '');
	}
	fncSetGlobalVariable('ordering_account', dijit.byId('applicant_act_no').get('value'));
	fncSetGlobalVariable('ordering_currency', dijit.byId('applicant_act_cur_code').get('value'));
	fncSetGlobalVariable('execution_date', dijit.byId('iss_date').getDisplayedValue());
	fncSetGlobalVariable('remarks', dijit.byId('narrative_additional_instructions').get('value'));
	// for tansfer
	if (fncGetGlobalVariable('ft_type') === '01'){
		
		fncSetGlobalVariable('ft_amount', dijit.byId('ft_amt').get('value'));
		fncSetGlobalVariable('ft_cur_code', dijit.byId('ft_cur_code').get('value'));
		
		fncSetGlobalVariable('transfer_account', dijit.byId('transfer_account').get('value'));
		fncSetGlobalVariable('transfer_currency', dijit.byId('transfer_account_cur_code').get('value'));
		// initialize other variable to empty
		fncSetGlobalVariable('beneficiary_currency', '');
		fncSetGlobalVariable('beneficiary_name', '');
		fncSetGlobalVariable('beneficiary_address', '');
		fncSetGlobalVariable('beneficiary_city', '');
		fncSetGlobalVariable('beneficiary_country', '');
		fncSetGlobalVariable('beneficiary_bank', '');
		
		fncSetGlobalVariable('beneficiary_bank_routing_number', '');
		fncSetGlobalVariable('beneficiary_bank_branch', '');
		fncSetGlobalVariable('beneficiary_bank_address', '');
		fncSetGlobalVariable('beneficiary_bank_city', '');
		fncSetGlobalVariable('beneficiary_bank_country', '');
		fncSetGlobalVariable('beneficiary_bank_account', '');
		
		fncSetGlobalVariable('payment_currency', '');
		fncSetGlobalVariable('payment_amount', '');
	}
	// for payment
	if (fncGetGlobalVariable('ft_type') === '02'){
		
		fncSetGlobalVariable('ft_amount', dijit.byId('payment_amt').get('value'));
		fncSetGlobalVariable('ft_cur_code', dijit.byId('payment_cur_code').get('value'));
		
		fncSetGlobalVariable('transfer_account', '');
		fncSetGlobalVariable('transfer_currency', '');
		
		fncSetGlobalVariable('payment_currency', '');
		fncSetGlobalVariable('payment_amount', '');
		
		fncSetGlobalVariable('beneficiary_name', dijit.byId('beneficiary_name').get('value'));
		fncSetGlobalVariable('beneficiary_address', dijit.byId('beneficiary_address').get('value'));
		fncSetGlobalVariable('beneficiary_city', dijit.byId('beneficiary_city').get('value'));
		fncSetGlobalVariable('beneficiary_account', dijit.byId('counterparty_details_act_no').get('value'));
		fncSetGlobalVariable('beneficiary_bank', dijit.byId('account_with_bank_name').get('value'));
		fncSetGlobalVariable('beneficiary_country', dijit.byId('beneficiary_country').get('value'));
		
		fncSetGlobalVariable('beneficiary_bank_routing_number', dijit.byId('beneficiary_bank_routing_number').get('value'));
		fncSetGlobalVariable('beneficiary_bank_branch', dijit.byId('beneficiary_bank_branch').get('value'));
		fncSetGlobalVariable('beneficiary_bank_address', dijit.byId('beneficiary_bank_address').get('value'));
		fncSetGlobalVariable('beneficiary_bank_city', dijit.byId('account_with_bank_dom').get('value'));
		fncSetGlobalVariable('beneficiary_bank_country', dijit.byId('beneficiary_bank_country').get('value'));
		fncSetGlobalVariable('beneficiary_bank_account', dijit.byId('beneficiary_bank_account').get('value'));
		
	}
	if (fncGetGlobalVariable('ft_type') === '05'){
		
		fncSetGlobalVariable('ft_amount', dijit.byId('ft_amt').get('value'));
		fncSetGlobalVariable('ft_cur_code', dijit.byId('ft_cur_code').get('value'));
		fncSetGlobalVariable('transfer_currency', dijit.byId('transfer_account_cur_code').get('value'));
		fncSetGlobalVariable('transfer_account', dijit.byId('transfer_account').get('value'));
		
		fncSetGlobalVariable('payment_currency', dijit.byId('payment_cur_code').get('value'));
		fncSetGlobalVariable('payment_amount', dijit.byId('payment_amt').get('value'));
		
		fncSetGlobalVariable('beneficiary_name', dijit.byId('beneficiary_name').get('value'));
		fncSetGlobalVariable('beneficiary_address', dijit.byId('beneficiary_address').get('value'));
		fncSetGlobalVariable('beneficiary_city', dijit.byId('beneficiary_city').get('value'));
		fncSetGlobalVariable('beneficiary_account', dijit.byId('counterparty_details_act_no').get('value'));
		fncSetGlobalVariable('beneficiary_bank', dijit.byId('account_with_bank_name').get('value'));
		fncSetGlobalVariable('beneficiary_country', dijit.byId('beneficiary_country').get('value'));
		
		fncSetGlobalVariable('beneficiary_bank_routing_number', dijit.byId('beneficiary_bank_routing_number').get('value'));
		fncSetGlobalVariable('beneficiary_bank_branch', dijit.byId('beneficiary_bank_branch').get('value'));
		fncSetGlobalVariable('beneficiary_bank_address', dijit.byId('beneficiary_bank_address').get('value'));
		fncSetGlobalVariable('beneficiary_bank_city', dijit.byId('account_with_bank_dom').get('value'));
		fncSetGlobalVariable('beneficiary_bank_country', dijit.byId('beneficiary_bank_country').get('value'));
		fncSetGlobalVariable('beneficiary_bank_account', dijit.byId('beneficiary_bank_account').get('value'));
		
	}
	// for the fee account 
	// TODO: re-do this part
	if (dijit.byId('open_chrg_brn_by_code_1').get('value') === '01'){
		fncSetGlobalVariable('fee_account', dijit.byId('applicant_act_no').get('value'));
	}
	else if (dijit.byId('open_chrg_brn_by_code_2').get('value') === '02'){
		if (fncGetGlobalVariable('ft_type') == '01' || fncGetGlobalVariable('ft_type') === '05'){
			fncSetGlobalVariable('fee_account', dijit.byId('transfer_account').get('value'));
		}
		else if (fncGetGlobalVariable('ft_type') === '02'){
			fncSetGlobalVariable('fee_account', dijit.byId('counterparty_details_act_no').get('value'));
		}
	}
	else if (dijit.byId('open_chrg_brn_by_code_3').get('value') === '03'){
		fncSetGlobalVariable('fee_account', dijit.byId('counterparty_details_act_no').get('value'));
	}
};
//Including the client specific implementation
       dojo.require('misys.client.binding.cash.TradeCreateFtBinding_client');