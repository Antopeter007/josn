dojo.provide("misys.binding.treasury.FtPopupManagement");
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

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {
	// insert private functions & variables
	
	_fncDoDisplay = function(/*String*/ field, /*String*/ data){
		if (data && data !== ''){
			dojo.query('#summary_'+field+'_row div.content').forEach(function(div){div.innerHTML = data;});
			
			if (dojo.byId('summary_'+field+'_row')){
				dojo.style(dojo.byId('summary_'+field+'_row'), 'display', '');
			}
		}
		else{
			dojo.query('#summary_'+field+'_row div.content').forEach(function(div){div.innerHTML = null;});
			if (dojo.byId('summary_'+field+'_row')){
				dojo.style(dojo.byId('summary_'+field+'_row'), 'display', 'none');
			}
		}
		if (dijit.byId(field)){
			dijit.byId(field).set('value', data);
		}
	};
	
	_fncDoDisplayFieldNameForEmptyValue = function(/*String*/ field, /*String*/ data){
		if (data && data !== ''){
			dojo.query('#summary_'+field+'_row div.content').forEach(function(div){div.innerHTML = data;});
			
			if (dojo.byId('summary_'+field+'_row')){
				dojo.style(dojo.byId('summary_'+field+'_row'), 'display', '');
			}
		}
		else{
			dojo.query('#summary_'+field+'_row div.content').forEach(function(div){div.innerHTML = '';});
		}
		if (dijit.byId(field)){
			dijit.byId(field).set('value', data);
		}
	};
	
	_fncBlankSummaryStyle = function(/*String*/ field){
			
		if (dojo.byId('summary_'+field+'_row')){
			dojo.style(dojo.byId('summary_'+field+'_row'), 'display', 'none');
		}
	};
		
	// Public functions & variables follow
	d.mixin(m, {
	
	
		//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
		// Summary PopUp
		//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*

		showDealSummaryDialog : function(/*JSON*/ data){
			var status = data.status;
			dijit.byId('dealSummaryDialog').show();
			// when we have a rate
			if (status === 5){
				dojo.style(dojo.byId('rateField'), 'display', '');
			}
			else{
				dojo.style(dojo.byId('rateField'), 'display', 'none');
				dj.byId("sendRequestId").set("disabled", false);
			}
			
			// hidden fields
			
			dijit.byId('deal_type').set('value', data.dealType);
			dijit.byId('request_number').set('value', data.requestNumber);
			dijit.byId('bo_tnx_id').set('value', data.boTnxId);
			dijit.byId('rec_id').set('value', data.rec_id);
			
			/*if (document.getElementById("mode").value != 'DRAFT')
			{*/
				dijit.byId('debit_amt').set('value', data.amount);
				dijit.byId('debit_ccy').set('value', data.currency);
				if((data.ft_type === '02' || dijit.byId('sub_product_code') === 'TRTPT') && dijit.byId('payment_amt') && data.paymentAmount !== null)
				{	
					dijit.byId('payment_amt').set('value', data.paymentAmount);
					dijit.byId('payment_cur_code').set('value', data.paymentCurrency);
					_fncDoDisplay('paymentAmount', data.paymentCurrency+''+data.paymentAmount);
				}
				_fncDoDisplay('applicant_name', data.company_name);
				_fncDoDisplay('debitAccountNumber', data.debitAccountNumber);
				_fncDoDisplay('debitAccountName1', data.debitAccountName);
				_fncDoDisplay('debitAmount', data.currency+' '+data.amount);
				
			/*}
			else{
				_fncDoDisplay('applicant_name', data.debitAccountName);
				_fncDoDisplay('debitAccountNumber', dijit.byId('applicant_act_no').value);
				_fncDoDisplay('debitAccountName', dijit.byId('debitAccountName').value);
				_fncDoDisplay('debitAmount', dijit.byId('debit_ccy').value +' '+dijit.byId('debit_amt').value);
			}*/
			
			//dijit.byId('applicant_reference').set('value', data.applicantReference);
			// populate fields
			
			if (data.ft_type === '01')
			{
					/*dojo.style(dojo.byId("paymentDetailsId"), 'display', 'none');*/
					dojo.style(dojo.byId("transferDetailsId"), 'display', '');
					
					/*if (document.getElementById("mode").value != 'DRAFT')
					{*/
						dijit.byId('beneficiary_reference').set('value', data.transferReference);
						_fncDoDisplay('beneficiaryName', data.transferReference);
						_fncDoDisplay('creditAccountNumber', data.transferAccountNumber);
						_fncDoDisplay('creditAccountName', data.transferAccountName);
						_fncDoDisplay('transferAmount', data.transferCurrency+' '+data.transferAmount);
						
						dijit.byId('counterparty_amt').set('value', data.transferAmount);
						dijit.byId('counterparty_cur_code').set('value', data.transferCurrency);
					/*}else{
						
						dijit.byId('beneficiary_reference').set('value', dijit.byId('beneficiary_reference').value);
						_fncDoDisplay('beneficiaryName', dijit.byId('beneficiaryName').value);
						_fncDoDisplay('creditAccountNumber', dijit.byId('transfer_account').value);
						_fncDoDisplay('creditAccountName', dijit.byId('transfer_account_name').value);
						_fncDoDisplay('transferAmount', data.transferCurrency+' '+data.transferAmount);
						
						dijit.byId('counterparty_amt').set('value', data.transferAmount);
						//TODO:In the case of the fund transfer the counter party name is being set the transfer account name.
						//This is consistent with the creation of new Fund Transfer
						dijit.byId('counterparty_name').set('value', dijit.byId('transfer_account_name').value);
						dijit.byId('counterparty_cur_code').set('value', data.transferCurrency);
					}*/
			}
			if (data.ft_type === '02'){
				dojo.style(dojo.byId("transferDetailsId"), 'display', 'none');
				dojo.style(dojo.byId("paymentDetailsId"), 'display', '');
				if (document.getElementById("mode").value !== 'DRAFT'){
					
					// MPS-29351 
					if(dijit.byId('applicant_act_amt') !== null){
						dijit.byId('applicant_act_amt').set('value', data.amount);
					}
					
					dijit.byId('applicant_act_cur_code').set("disabled",true);
				}
				if(dijit.byId('credit_amt'))
				{
					dijit.byId('credit_amt').set('value', data.paymentAmount);
				}

				//dijit.byId('payment_cur_code').set('value', data.paymentCurrency);
			}
			if (data.ft_type === '05'){
				dojo.style(dojo.byId("transferDetailsId"), 'display', '');
				dojo.style(dojo.byId("paymentDetailsId"), 'display', '');
				
				dijit.byId('beneficiary_reference').set('value', data.transferReference);
				
				_fncDoDisplay('beneficiaryName', data.transferReference);
				_fncDoDisplay('creditAccountNumber', data.transferAccountNumber);
				_fncDoDisplay('creditAccountName', data.transferAccountName);
				_fncDoDisplay('transferAmount', data.transferCurrency+' '+data.transferAmount);
				
				dijit.byId('counterparty_amt').set('value', data.transferAmount);
				dijit.byId('counterparty_cur_code').set('value', data.transferCurrency);
				
				//dijit.byId('payment_amt').set('value', data.paymentAmount);
				//dijit.byId('payment_cur_code').set('value', data.paymentCurrency);
			}
			
			if (data.ft_type === '02' || data.ft_type === '05')
			{
				if(dj.byId("instructions_type_1") && dj.byId("instructions_type_1").checked) 
				{
					
//					if(dj.byId("paymentDetailsIdBankInstructions"))
//					{
						dojo.byId('paymentDetailsIdBankInstructions').style.display= 'block';						
//					}
//					if(dj.byId("paymentDetailsIdFreeFormat"))
//					{
						dojo.byId('paymentDetailsIdFreeFormat').style.display= 'none';
//					}					


					if ((data.intermediaryBankAccountNumber && data.intermediaryBankAccountNumber !== '') ||
								(data.intermediaryBankName && data.intermediaryBankName !== '') ||
								(data.intermediaryBankBICcodeSWIFT && data.intermediaryBankBICcodeSWIFT !== '') ||
								(data.intermediary_bank_aba && data.intermediary_bank_aba !== '') ||
								(data.intermediaryBankAddress && data.intermediaryBankAddress !== '') ||
								(data.intermediaryBankCityState && data.intermediaryBankCityState !== '') ||
								(data.intermediaryBankCountry && data.intermediaryBankCountry !== '') ||
								(data.intermediary_bank_instruction_1 && data.intermediary_bank_instruction_1 !== '') ||
								(data.intermediary_bank_instruction_2 && data.intermediary_bank_instruction_2 !== '') ||
								(data.intermediary_bank_instruction_3 && data.intermediary_bank_instruction_3 !== '') ||
								(data.intermediary_bank_instruction_4 && data.intermediary_bank_instruction_4 !== '') ||
								(data.intermediary_bank_instruction_5 && data.intermediary_bank_instruction_5 !== '') ||
								(data.intermediary_bank_instruction_6 && data.intermediary_bank_instruction_6 !== '')) {
						     if(d.byId("additionalDetailsBankFormat"))
						     {
								d.style(d.byId("additionalDetailsBankFormat"), "display", "block");
						     }
						}
						else {
						     if(d.byId("additionalDetailsBankFormat"))
						     {
								d.style(d.byId("additionalDetailsBankFormat"), "display", "none");
						     }
						}						
						
						if ((data.additional_detail_1 && data.additional_detail_1 !== '') ||
								(data.additional_detail_2 && data.additional_detail_2 !== '') ||		
								(data.additional_detail_3 && data.additional_detail_3 !== '') ||
								(data.additional_detail_4 && data.additional_detail_4 !== '')) {							
							if(d.byId("paymentDetailsBankFormat"))
							{
								d.style(d.byId("paymentDetailsBankFormat"), "display", "block");
							}
						}
						else {
							if(d.byId("paymentDetailsBankFormat"))
							{
								d.style(d.byId("paymentDetailsBankFormat"), "display", "none");
							}
						}									 				
	     				_fncDoDisplay('bi_beneficiary_name', data.beneficiaryName);	
	     				
		     				_fncDoDisplay('bi_beneficiary_address', data.beneficiaryAddress);
		     				if(data.beneficiaryAddress2 && data.beneficiaryAddress2 !== ''){
		     					_fncDoDisplay('bi_beneficiary_address_2', data.beneficiaryAddress2);
		     				}else{
		     					_fncBlankSummaryStyle('bi_beneficiary_address_2');
		     				}
		     				_fncDoDisplay('bi_beneficiary_city', data.beneficiaryCityState);	
		     				_fncDoDisplay('bi_beneficiary_country', data.beneficiaryCountry);
		     				_fncDoDisplay('bi_beneficiary_bank_bic', data.beneficiaryBICCodeSWIFT);
		     				_fncDoDisplay('bi_counterparty_details_act_no', data.beneficiaryAccountNumber); 
		     				_fncDoDisplay('bi_beneficiary_bank', data.accountWithInstitutionName);
		     				_fncDoDisplay('bi_beneficiary_bank_branch', null); // 	
		    				if((data.accountWithInstitutionAddress && data.accountWithInstitutionAddress !== '') ||
		    						(data.accountWithInstitutionCityState && data.accountWithInstitutionCityState !== '') ||
		    						(data.accountWithInstitutionCountry && data.accountWithInstitutionCountry !== '')){
			     				_fncDoDisplayFieldNameForEmptyValue('bi_beneficiary_bank_address', data.accountWithInstitutionAddress);
			    				_fncDoDisplay('bi_account_with_bank_dom', data.accountWithInstitutionCityState);	
			     				_fncDoDisplay('bi_beneficiary_bank_country', data.accountWithInstitutionCountry);
		    				}else{
		    					_fncBlankSummaryStyle('bi_beneficiary_bank_address');
		    					_fncBlankSummaryStyle('bi_account_with_bank_dom');	
		    					_fncBlankSummaryStyle('bi_beneficiary_bank_country');
		    				}
		     				_fncDoDisplay('bi_beneficiary_bank_aba', null); //
		     				_fncDoDisplay('bi_beneficiary_bank_routing_number', null); //
		     				_fncDoDisplay('bi_account_with_institution_BIC', data.accountWithInstitutionBICcodeSWIFT);
		     				_fncDoDisplay('bi_beneficiary_bank_account', data.accountWithInstitutionAccountNumber);
		     				
		     				_fncDoDisplay('bi_ordering_cust_name', data.orderingCustomerName);	
		    				if((data.orderingCustomerAddress && data.orderingCustomerAddress !== '')  ||
		    						(data.orderingCustomerCityState && data.orderingCustomerCityState !== '')  ||
		    						(data.orderingCustomerCountry && data.orderingCustomerCountry !== '')){
		    					_fncDoDisplayFieldNameForEmptyValue('bi_ordering_cust_address', data.orderingCustomerAddress);
		    					if(data.orderingCustAddress2 && data.orderingCustAddress2 !== ''){
		    						_fncDoDisplay('bi_ordering_cust_address_2', data.orderingCustAddress2);
		    					}
			     				_fncDoDisplay('bi_ordering_cust_citystate', data.orderingCustomerCityState);	
			     				_fncDoDisplay('bi_ordering_cust_country', data.orderingCustomerCountry);
		    				}else{
		    					_fncBlankSummaryStyle('bi_ordering_cust_address');
		    					_fncBlankSummaryStyle('bi_ordering_cust_address_2');
		    					_fncBlankSummaryStyle('bi_ordering_cust_citystate');	
		    					_fncBlankSummaryStyle('bi_ordering_cust_country');
		    				}
		    				_fncDoDisplay('bi_ordering_cust_account', data.orderingCustAccount);
		     				_fncDoDisplay('bi_intermediary_bank_account_number', data.intermediaryBankAccountNumber);
		    				_fncDoDisplay('bi_intermediary_bank', data.intermediaryBankName);
		    				_fncDoDisplay('bi_intermediary_bank_bic', data.intermediaryBankBICcodeSWIFT);
		    				_fncDoDisplay('bi_intermediary_bank_aba', data.intermediary_bank_aba); // this need to stay here othewise intemediary bank routing number will not dsiplay
		    				if((data.intermediaryBankAddress && data.intermediaryBankAddress !== '')  ||
		    						(data.intermediaryBankCityState && data.intermediaryBankCityState !== '')  ||
		    						(data.intermediaryBankCountry && data.intermediaryBankCountry !== '')){
			    				_fncDoDisplayFieldNameForEmptyValue('bi_intermediary_bank_street', data.intermediaryBankAddress);
			    				if(data.intermediaryBankAddress2 && data.intermediaryBankAddress2 !== ''){
									_fncDoDisplay('bi_intermediary_bank_street_2', data.intermediaryBankAddress2);
								}
			    				_fncDoDisplay('bi_intermediary_bank_city', data.intermediaryBankCityState);
			    				_fncDoDisplay('bi_intermediary_bank_country', data.intermediaryBankCountry);
		    				}else{
		    					_fncBlankSummaryStyle('bi_intermediary_bank_street');
		    					_fncBlankSummaryStyle('bi_intermediary_bank_street_2');
		    					_fncBlankSummaryStyle('bi_intermediary_bank_city');	
		    					_fncBlankSummaryStyle('bi_intermediary_bank_country');
		    				}
		    				_fncDoDisplay('bi_intermediary_bank_instruction_1', data.intermediary_bank_instruction_1);
		    				_fncDoDisplay('bi_intermediary_bank_instruction_2', data.intermediary_bank_instruction_2);
		    				_fncDoDisplay('bi_intermediary_bank_instruction_3', data.intermediary_bank_instruction_3);
		    				_fncDoDisplay('bi_intermediary_bank_instruction_4', data.intermediary_bank_instruction_4);
		    				_fncDoDisplay('bi_intermediary_bank_instruction_5', data.intermediary_bank_instruction_5);
		    				_fncDoDisplay('bi_intermediary_bank_instruction_6', data.intermediary_bank_instruction_6);
		    				_fncDoDisplay('bi_additional_detail_1', data.additional_detail_1);
		    				_fncDoDisplay('bi_additional_detail_2', data.additional_detail_2);
		    				_fncDoDisplay('bi_additional_detail_3', data.additional_detail_3);
		    				_fncDoDisplay('bi_additional_detail_4', data.additional_detail_4);

		    				_fncDoDisplay('bi_paymentAmount', data.paymentCurrency+' '+data.paymentAmount);	
		    				
		    				_fncDoDisplay('bi_settlement_account', data.settlement_account);	
		    				_fncDoDisplay('bi_settlement_means', data.settlement_means);	
		    				
					if (dijit.byId('swift_charges_type_' + data.swift_charges_type))
					{
					_fncDoDisplay('bi_swift_charges_type', dijit.byId('swift_charges_type_' + data.swift_charges_type).get('value'));			
					} else {
						_fncDoDisplay('bi_swift_charges_type', null);
					}
				}
				else
				{
					
//					if(dj.byId("paymentDetailsIdBankInstructions"))
//					{
						dojo.byId('paymentDetailsIdBankInstructions').style.display= 'none';
//					}
//					if(dj.byId("paymentDetailsIdFreeFormat"))
//					{
						dojo.byId('paymentDetailsIdFreeFormat').style.display= 'block';
//					}			
				_fncDoDisplay('settlement_account', data.settlement_account);	
	    		_fncDoDisplay('settlement_means', data.settlement_means);
				_fncDoDisplay('beneficiary_name', data.paymentBeneficiaryName);
				_fncDoDisplay('counterparty_details_act_no', data.paymentBeneficiaryAccount);
				if((data.paymentBeneficiaryAddress && data.paymentBeneficiaryAddress !== '')  ||
						(data.beneficiaryCity && data.beneficiaryCity !== '')  ||
						(data.beneficiaryCountry && data.beneficiaryCountry !== '')){
					_fncDoDisplayFieldNameForEmptyValue('beneficiary_address', data.paymentBeneficiaryAddress);
					if(data.paymentBeneficiaryAddress2 && data.paymentBeneficiaryAddress2 !== '')
					{
						_fncDoDisplay('beneficiary_address_2', data.paymentBeneficiaryAddress2);
					}
					else
					{
						_fncBlankSummaryStyle('beneficiary_address_2');
					}
					_fncDoDisplay('beneficiary_city', data.beneficiaryCity);
					_fncDoDisplay('beneficiary_country', data.beneficiaryCountry);
				}else{
					_fncBlankSummaryStyle('beneficiary_address');
					_fncBlankSummaryStyle('beneficiary_address_2');
					_fncBlankSummaryStyle('beneficiary_city');
					_fncBlankSummaryStyle('beneficiary_country');
				}
				_fncDoDisplay('beneficiary_bank', data.beneficiaryBank);
				_fncDoDisplay('beneficiary_bank_account', data.beneficiaryBankAccount);
				if((data.beneficiaryBankAddress && data.beneficiaryBankAddress !== '') ||
						(data.beneficiaryBankCity && data.beneficiaryBankCity !== '') ||
						(data.beneficiaryBankCountry && data.beneficiaryBankCountry !== '')){
					_fncDoDisplayFieldNameForEmptyValue('beneficiary_bank_address', data.beneficiaryBankAddress);
					_fncDoDisplay('account_with_bank_dom', data.beneficiaryBankCity);
					_fncDoDisplay('beneficiary_bank_country', data.beneficiaryBankCountry);
				}else{
					_fncBlankSummaryStyle('beneficiary_bank_address');
					_fncBlankSummaryStyle('account_with_bank_dom');	
					_fncBlankSummaryStyle('beneficiary_bank_country');
				}
				_fncDoDisplay('beneficiary_bank_aba', data.beneficiaryBankAba);
				_fncDoDisplay('beneficiary_bank_routing_number', data.beneficiaryBankRoutingNumber);
				_fncDoDisplay('beneficiary_bank_branch', data.beneficiaryBankBranch);

				
				_fncDoDisplay('beneficiary_bank_bic', data.beneficiaryBic);
				
				_fncDoDisplay('ordering_cust_name', data.orderingCustName);
				if((data.orderingCustAddress && data.orderingCustAddress !== '')  ||
						(data.orderingCustCityState && data.orderingCustCityState !== '')  ||
						(data.orderingCustCountry && data.orderingCustCountry !== '')){
					_fncDoDisplayFieldNameForEmptyValue('ordering_cust_address', data.orderingCustAddress);
					
					if(data.orderingCustAddress2 && data.orderingCustAddress2 !== '')
					{
						_fncDoDisplay('ordering_cust_address_2', data.orderingCustAddress2);
					}
					else
					{
						_fncBlankSummaryStyle('ordering_cust_address_2');
					}
					_fncDoDisplay('ordering_cust_citystate', data.orderingCustCityState);
					_fncDoDisplay('ordering_cust_country', data.orderingCustCountry);
				}else{
					_fncBlankSummaryStyle('ordering_cust_address');
					_fncBlankSummaryStyle('ordering_cust_address_2');
					_fncBlankSummaryStyle('ordering_cust_citystate');	
					_fncBlankSummaryStyle('ordering_cust_country');
				}
				
				_fncDoDisplay('ordering_cust_account', data.orderingCustAccount);
				
				_fncDoDisplay('paymentAmount', data.paymentCurrency+' '+data.paymentAmount);	
				
				_fncDoDisplay('beneficiary_name', data.paymentBeneficiaryName);
				
				if((!data.intermediary_bank_bic || 0 ===  data.intermediary_bank_bic.length) &&
				   (!data.intermediary_bank || 0 ===  data.intermediary_bank.length) &&
				   (!data.intermediary_bank_street || 0 ===  data.intermediary_bank_street.length)	 &&
				   (!data.intermediary_bank_city || 0 ===  data.intermediary_bank_city.length)	 &&
				   (!data.intermediary_bank_country || 0 ===  data.intermediary_bank_country.length)	 &&
				   (!data.intermediary_bank_aba || 0 ===  data.intermediary_bank_aba.length)	 &&
				   (!data.intermediary_bank_instruction_1 || 0 ===  data.intermediary_bank_instruction_1.length)	 &&
				   (!data.intermediary_bank_instruction_2 || 0 ===  data.intermediary_bank_instruction_2.length)	 &&
				   (!data.intermediary_bank_instruction_3 || 0 ===  data.intermediary_bank_instruction_3.length)	 &&
				   (!data.intermediary_bank_instruction_4 || 0 ===  data.intermediary_bank_instruction_4.length)	 &&
				   (!data.intermediary_bank_instruction_5 || 0 ===  data.intermediary_bank_instruction_5.length)	 &&
				   (!data.intermediary_bank_instruction_6 || 0 ===  data.intermediary_bank_instruction_.length)){
					d.style(d.byId("additionalDetailsFreeFormat"), "display", "none");
				}
				else
				{
					d.style(d.byId("additionalDetailsFreeFormat"), "display", "block");
				}

				if((!data.additional_detail_1 || 0 ===  data.additional_detail_1.length) &&
				   (!data.additional_detail_2 || 0 ===  data.additional_detail_2.length) &&
				   (!data.additional_detail_3 || 0 ===  data.additional_detail_3.length) &&				   
				   (!data.additional_detail_4 || 0 ===  data.additional_detail_4.length)){
							d.style(d.byId("paymentDetailsFreeFormat"), "display", "none");
				}
				else
				{
							d.style(d.byId("paymentDetailsFreeFormat"), "display", "block");
				}	
				
				_fncDoDisplay('intermediary_bank', data.intermediary_bank);
				_fncDoDisplay('intermediary_bank_bic', data.intermediary_bank_bic);
				_fncDoDisplay('intermediary_bank_aba', data.intermediary_bank_aba);
				if((data.intermediary_bank_street && data.intermediary_bank_street !== '') ||
						(data.intermediary_bank_city && data.intermediary_bank_city !== '') ||
						(data.intermediary_bank_country && data.intermediary_bank_country !== '')){
					_fncDoDisplayFieldNameForEmptyValue('intermediary_bank_street', data.intermediary_bank_street);
					if(data.intermediary_bank_street_2 && data.intermediary_bank_street_2 !== ''){
						_fncDoDisplay('intermediary_bank_street_2', data.intermediary_bank_street_2);
					}
					else
					{
						_fncBlankSummaryStyle('intermediary_bank_street_2');
					}
					_fncDoDisplay('intermediary_bank_city', data.intermediary_bank_city);
					_fncDoDisplay('intermediary_bank_country', data.intermediary_bank_country);
				}else{
					_fncBlankSummaryStyle('intermediary_bank_street');
					_fncBlankSummaryStyle('intermediary_bank_street_2');
					_fncBlankSummaryStyle('intermediary_bank_city');	
					_fncBlankSummaryStyle('intermediary_bank_country');
				}
				_fncDoDisplay('account_with_institution_BIC', null);
				_fncDoDisplay('intermediary_bank_instruction_1', data.intermediary_bank_instruction_1);
				_fncDoDisplay('intermediary_bank_instruction_2', data.intermediary_bank_instruction_2);
				_fncDoDisplay('intermediary_bank_instruction_3', data.intermediary_bank_instruction_3);
				_fncDoDisplay('intermediary_bank_instruction_4', data.intermediary_bank_instruction_4);
				_fncDoDisplay('intermediary_bank_instruction_5', data.intermediary_bank_instruction_5);
				_fncDoDisplay('intermediary_bank_instruction_6', data.intermediary_bank_instruction_6);
				_fncDoDisplay('additional_detail_1', data.additional_detail_1);
				_fncDoDisplay('additional_detail_2', data.additional_detail_2);
				_fncDoDisplay('additional_detail_3', data.additional_detail_3);
				_fncDoDisplay('additional_detail_4', data.additional_detail_4);
				
				if (dijit.byId('swift_charges_type_' + data.swift_charges_type))
					{
					_fncDoDisplay('swift_charges_type', dijit.byId('swift_charges_type_' + data.swift_charges_type).get('value'));			
					}
				}
//			     if(data.paysidecode)
//			     {
//				     if(data.paysidecode.length>0)
//			     	 {
//				    	 
//		     				_fncDoDisplay('beneficiaryName', data.beneficiaryName);	
//			     				_fncDoDisplay('beneficiaryAddress', data.beneficiaryAddress);	
//			     				_fncDoDisplay('beneficiaryCityState', data.beneficiaryCityState);	
//			     				_fncDoDisplay('beneficiaryCountry', data.beneficiaryCountry);
//			     				_fncDoDisplay('beneficiaryBICCodeSWIFT', data.beneficiaryBICCodeSWIFT);
//			     				_fncDoDisplay('beneficiaryAccountNumber', data.beneficiaryAccountNumber); 	 				     				
//			     				
//			     				_fncDoDisplay('accountWithInstitutionName', data.accountWithInstitutionName);	
//			     				_fncDoDisplay('accountWithInstitutionAddress', data.accountWithInstitutionAddress);	
//			     				_fncDoDisplay('accountWithInstitutionCityState', data.accountWithInstitutionCityState);	
//			     				_fncDoDisplay('accountWithInstitutionCountry', data.accountWithInstitutionCountry);
//			     				_fncDoDisplay('accountWithInstitutionBICcodeSWIFT', data.accountWithInstitutionBICcodeSWIFT);
//			     				_fncDoDisplay('accountWithInstitutionAccountNumber', data.accountWithInstitutionAccountNumber);
//			     				
//			     				_fncDoDisplay('orderingCustomerName', data.orderingCustomerName);	
//			     				_fncDoDisplay('orderingCustomerAddress', data.orderingCustomerAddress);	
//			     				_fncDoDisplay('orderingCustomerCityState', data.orderingCustomerCityState);	
//			     				_fncDoDisplay('orderingCustomerCountry', data.orderingCustomerCountry);	
//			     				
//			     				_fncDoDisplay('intermediaryBankName', data.intermediaryBankName);
//			     				_fncDoDisplay('intermediaryBankAddress', data.intermediaryBankAddress);
//			     				_fncDoDisplay('intermediaryBankCityState', data.intermediaryBankCityState);
//			     				_fncDoDisplay('intermediaryBankCountry', data.intermediaryBankCountry);
//			     				_fncDoDisplay('intermediaryBankBICcodeSWIFT', data.intermediaryBankBICcodeSWIFT);
//			     				_fncDoDisplay('intermediaryBankAccountNumber', data.intermediaryBankAccountNumber);
//  	 				     				
//			     	 }
//			     	 else
//			     	 {
//			     	 			         
//			     	 					_fncDoDisplay('ordering_cust_name', data.orderingCustName);
//			     	 					_fncDoDisplay('ordering_cust_address', data.orderingCustAddress);
//			     	 					_fncDoDisplay('ordering_cust_citystate', data.orderingCustCityState);
//			     	 					_fncDoDisplay('ordering_cust_country', data.orderingCustCountry);
//			     	 }
//			     }
					

//			} else  {
//						dojo.byId('paymentDetailsIdBankInstructions').style.display= 'none';						
//						dojo.byId('paymentDetailsIdFreeFormat').style.display= 'none';
			}
			

			_fncDoDisplay('amount', data.debitCurrency+' '+data.amount);
			//fncDoDiplay('summaryCurrency', data.creditCurrency);
			_fncDoDisplay('executionDate', data.executionDate);
			dijit.byId('iss_date').set('value', data.executionDate); //save the execution date return by opics in table common row iss_date 
			_fncDoDisplay('bo_ref_id', data.bo_ref_id);
			
			/*if (document.getElementById("mode").value != 'DRAFT')
			{*/
				_fncDoDisplay('feeAccount', data.feeAccount);
				_fncDoDisplay('feeAmount', data.feeCurrency+' '+data.feeAmount);
				dijit.byId('feeAmt').set('value', data.feeAmount);
				dijit.byId('feeCurCode').set('value', data.feeCurrency);
				_fncDoDisplay('rate', data.rate);
				
			/*}else{
				
				_fncDoDisplay('feeAccount', dijit.byId('feeAccount').value);
				_fncDoDisplay('feeAmount', dijit.byId('feeCurCode').value +' '+  dijit.byId('feeAmt').value);
				dijit.byId('feeAmt').set('value',  dijit.byId('feeAmt').value);
				dijit.byId('feeCurCode').set('value',  dijit.byId('feeCurCode').value);
				_fncDoDisplay('rate',  dijit.byId('rate').value);	
			}*/
			
			_fncDoDisplay('remarks', data.remarks);
			
			if (status === 5 && document.getElementById("mode").value !== 'DRAFT'){
				m.countDown(data.validity);
				
			}
			
		},

		
		closeDealSummaryDialog : function(){
			dijit.byId('dealSummaryDialog').hide();
		},

		//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
		// Account PopUp
		//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
		fillAccountField : function(accountType, accountSelected){
			if (accountType === 'orderingAccount'){
				dijit.byId('applicant_reference_hidden').set('value', accountSelected.customer_ref);
				dijit.byId('applicant_act_no').set('value', accountSelected.account_no);
				dijit.byId('applicant_act_cur_code').set('value', accountSelected.cur_code);
				if (m.ft_type === '02'){
					dijit.byId('payment_cur_code').set('value', accountSelected.cur_code);
					/*if (document.getElementById("mode").value != 'DRAFT')
                    {*/
                           //Set Issuing bank/Main Bank details
                           dijit.byId('issuing_bank_abbv_name').set('value', accountSelected.bank_abbv_name);
                           dijit.byId('issuing_bank_name').set('value', accountSelected.bank_name);
                           dijit.byId('issuing_bank_iso_code').set('value', accountSelected.iso_code);
                //    }					
				}
				else {
					dijit.byId('ft_cur_code').set('value', accountSelected.cur_code);
				}
				
			}
			else if (accountType === 'beneficiaryAccount'){
				dijit.byId('transfer_account').set('value', accountSelected.account_no);
				dijit.byId('transfer_account_cur_code').set('value', accountSelected.cur_code);
				dijit.byId('transfer_account_name').set('value', accountSelected.name);
			}
		}

	});
})(dojo, dijit, misys);
