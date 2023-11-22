dojo.provide("misys.binding.cash.TradeCreateFtPopupManagement");
/*
 -----------------------------------------------------------------------------
 Scripts for
  
  Fund Transfer (FT) Popup Management, Customer Side
  

 Copyright (c) 2000-2010 Misys (http://www.misys.com),
 All Rights Reserved. 

 version:   1.0
 date:      28/01/11
 author:    Marzin Pascal
 -----------------------------------------------------------------------------
*/

//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
// Summary PopUp
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*

fncShowDealSummaryDialog = function(/*JSON*/ data){
	var status = data.status;
	dijit.byId('dealSummaryDialog').show();
	// when we have a rate
	if (status != 5){
		dojo.style(dojo.byId('rateField'), 'display', 'none');
	}
	
	// hidden fields
	
	dijit.byId('deal_type').set('value', data.dealType);
	dijit.byId('request_number').set('value', data.requestNumber);
	dijit.byId('bo_tnx_id').set('value', data.boTnxId);
	
	//dijit.byId('applicant_reference').set('value', data.applicantReference);
	// populate fields
	fncDoDisplay('applicantName', data.company_name);
	fncDoDisplay('debitAccountNumber', data.debitAccountNumber);
	fncDoDisplay('debitAccountName', data.debitAccountName);
	fncDoDisplay('debitAmount', data.currency+' '+data.amount);
	
	if (fncGetGlobalVariable('ft_type') == '01'){
		dojo.style(dojo.byId("paymentDetailsId"), 'display', 'none');
		dijit.byId('beneficiary_reference').set('value', data.transferReference);
		fncDoDisplay('beneficiaryName', data.transferReference);
		fncDoDisplay('creditAccountNumber', data.transferAccountNumber);
		fncDoDisplay('creditAccountName', data.transferAccountName);
		fncDoDisplay('transferAmount', data.transferCurrency+' '+data.transferAmount);
		
		dijit.byId('counterparty_amt').set('value', data.transferAmount);
		dijit.byId('counterparty_cur_code').set('value', data.transferCurrency);
		
	}
	if (fncGetGlobalVariable('ft_type') == '02'){
		dojo.style(dojo.byId("transferDetailsId"), 'display', 'none');
		fncDoDisplay('beneficiary_name', data.paymentBeneficiaryName);
		fncDoDisplay('counterparty_details_act_no', data.paymentBeneficiaryAccount);
		fncDoDisplay('beneficiary_address', data.paymentBeneficiaryAddress);
		fncDoDisplay('beneficiary_city', data.beneficiaryCity);
		fncDoDisplay('beneficiary_country', data.beneficiaryCountry);
		fncDoDisplay('account_with_bank_name', data.beneficiaryBank);
		fncDoDisplay('beneficiary_bank_account', data.beneficiaryBankAccount);
		fncDoDisplay('account_with_bank_dom', data.beneficiaryBankCity);
		fncDoDisplay('beneficiary_bank_country', data.beneficiaryBankCountry);
		fncDoDisplay('beneficiary_bank_routing_number', data.beneficiaryBankRoutingNumber);
		fncDoDisplay('beneficiary_bank_branch', data.beneficiaryBankBranch);
		fncDoDisplay('beneficiary_bank_address', data.beneficiaryBankAddress);
		fncDoDisplay('paymentAmount', data.paymentCurrency+' '+data.paymentAmount);
		
		dijit.byId('payment_amt').set('value', data.paymentAmount);
		//dijit.byId('payment_cur_code').set('value', data.paymentCurrency);
	}
	if (fncGetGlobalVariable('ft_type') == '05'){
		dijit.byId('beneficiary_reference').set('value', data.transferReference);
		fncDoDisplay('beneficiaryName', data.transferReference);
		fncDoDisplay('creditAccountNumber', data.transferAccountNumber);
		fncDoDisplay('creditAccountName', data.transferAccountName);
		fncDoDisplay('transferAmount', data.transferCurrency+' '+data.transferAmount);
		
		dijit.byId('counterparty_amt').set('value', data.transferAmount);
		dijit.byId('counterparty_cur_code').set('value', data.transferCurrency);
		
		fncDoDisplay('beneficiary_name', data.paymentBeneficiaryName);
		fncDoDisplay('counterparty_details_act_no', data.paymentBeneficiaryAccount);
		fncDoDisplay('beneficiary_address', data.paymentBeneficiaryAddress);
		fncDoDisplay('beneficiary_city', data.beneficiaryCity);
		fncDoDisplay('beneficiary_country', data.beneficiaryCountry);
		fncDoDisplay('account_with_bank_name', data.beneficiaryBank);
		fncDoDisplay('beneficiary_bank_account', data.beneficiaryBankAccount);
		fncDoDisplay('account_with_bank_dom', data.beneficiaryBankCity);
		fncDoDisplay('beneficiary_bank_country', data.beneficiaryBankCountry);
		fncDoDisplay('beneficiary_bank_routing_number', data.beneficiaryBankRoutingNumber);
		fncDoDisplay('beneficiary_bank_branch', data.beneficiaryBankBranch);
		fncDoDisplay('beneficiary_bank_address', data.beneficiaryBankAddress);
		fncDoDisplay('paymentAmount', data.paymentCurrency+' '+data.paymentAmount);
		
		//dijit.byId('payment_amt').set('value', data.paymentAmount);
		//dijit.byId('payment_cur_code').set('value', data.paymentCurrency);
	}
	fncDoDisplay('amount', data.debitCurrency+' '+data.amount);
	//fncDoDiplay('summaryCurrency', data.creditCurrency);
	fncDoDisplay('executionDate', data.executionDate);
	fncDoDisplay('bo_ref_id', data.bo_ref_id);
	fncDoDisplay('feeAccount', data.feeAccount);
	fncDoDisplay('feeAmount', data.feeCurrency+' '+data.feeAmount);
	dijit.byId('feeAmt').set('value', data.feeAmount);
	dijit.byId('feeCurCode').set('value', data.feeCurrency);
	fncDoDisplay('rate', data.rate);
	
	if (status == 5){
		_fncCountdown(data.validity);
		
	}
	
};

fncDoDisplay = function(/*String*/ field, /*String*/ data){
	if (data && data != ''){
		dojo.query('#summary_'+field+'_row div.content').forEach(function(div){div.innerHTML = data;});
	}
	else{
		dojo.style(dojo.byId('summary_'+field+'_row'), 'display', 'none');
	}
	if (dijit.byId(field)){
		dijit.byId(field).set('value', data);
	}
};

fncCloseDealSummaryDialog = function(){
	dijit.byId('dealSummaryDialog').hide();
};

//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
// Account PopUp
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
fillAccountField = function(accountType, accountSelected){
	if (accountType == 'orderingAccount'){
		dijit.byId('applicant_reference_hidden').set('value', accountSelected.customer_ref);
		dijit.byId('applicant_act_no').set('value', accountSelected.account_no);
		dijit.byId('applicant_act_cur_code').set('value', accountSelected.cur_code);
		if (fncGetGlobalVariable('ft_type') == '02'){
			dijit.byId('payment_cur_code').set('value', accountSelected.cur_code);
		}
		else {
			dijit.byId('ft_cur_code').set('value', accountSelected.cur_code);
		}
		
	}
	else if (accountType == 'beneficiaryAccount'){
		dijit.byId('transfer_account').set('value', accountSelected.account_no);
		dijit.byId('transfer_account_cur_code').set('value', accountSelected.cur_code);
	}
};
//Including the client specific implementation
       dojo.require('misys.client.binding.cash.TradeCreateFtPopupManagement_client');