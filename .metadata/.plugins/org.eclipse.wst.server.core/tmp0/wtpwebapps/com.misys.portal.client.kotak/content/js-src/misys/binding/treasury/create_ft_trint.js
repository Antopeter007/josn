dojo.provide("misys.binding.treasury.create_ft_trint");
/*
 -----------------------------------------------------------------------------
 Scripts for
  
  Foreign Exchange (FX) Form, Ajax Call.
  

 Copyright (c) 2000-2010 Misys (http://www.misys.com),
 All Rights Reserved. 

 version:   1.0
 author:	Pascal Marzin
 date:      10/15/10
 -----------------------------------------------------------------------------
 */

dojo.require("misys.form.common");
dojo.require("misys.validation.common");
dojo.require("misys.form.DateTermField");
dojo.require("misys.form.DateOrTermField");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.Dialog");
dojo.require("dijit.ProgressBar");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.CheckBox");
dojo.require("dijit.layout.ContentPane");
dojo.require("dojo.data.ItemFileReadStore");
dojo.require("dijit.form.DateTextBox");
dojo.require("dijit.form.CurrencyTextBox");
dojo.require("dijit.form.NumberTextBox");
dojo.require("dijit.form.FilteringSelect");
dojo.require("misys.form.SimpleTextarea");
dojo.require("dojo.parser");
dojo.require("dojo.date");
dojo.require("misys.widget.Collaboration");
dojo.require("misys.binding.cash.common.request_action");
dojo.require("misys.binding.treasury.FtPopupManagement");
/*dojo.require("misys.binding.cash.request.RequestAction");*/


(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {
	
	"use strict"; // ECMA5 Strict Mode

	// insert private functions & variables
	var sub_product_code,
		ref_id,
		trade_id,
		rec_id,
		applicant_reference,
		contract_type,
		debit_act_no,
		debit_act_desc,
		remarks,
		fx_cur_code,
		fx_amt,
		counter_cur_code,
		counter_amt,
		near_amt,
		near_counter_amt,
		input_near_date,
		input_near_days,
		input_near_period,
		input_value_date,
		input_value_days,
		input_value_period,
		input_option_date,
		input_option_days,
		input_option_period,
		issuing_bank,
		ordering_account,
		ordering_currency,
		execution_date,
		execution_tenor,
		ft_amount,
		ft_cur_code,
		transfer_account,
		transfer_amount,
		transfer_currency,
		beneficiary_account,
		beneficiary_currency,
		beneficiary_name,
		beneficiary_address,
		beneficiary_address_2,
		beneficiary_city,
		beneficiary_country,
		beneficiary_bank,
		beneficiary_bank_routing_number,
		beneficiary_bank_branch,
		beneficiary_bank_address,
		beneficiary_bank_city,
		beneficiary_bank_country,
		beneficiary_bank_bic,
		mode,
		ordering_cust_name,
		ordering_cust_address,
		ordering_cust_address_2,
		ordering_cust_citystate,
		ordering_cust_country,
		ordering_cust_account,
		payment_currency,
		payment_amount,
		fee_account,
		feeCurCode,
		feeAmt,
		haveABeneficiaryAccount,
		swift_charges_type,
		intermediary_bank,
		intermediary_bank_aba,
		intermediary_bank_bic,
		intermediary_bank_street,
		intermediary_bank_street_2,
		intermediary_bank_city,
		intermediary_bank_country,
		intermediary_bank_instruction_1,
		intermediary_bank_instruction_2,
		intermediary_bank_instruction_3,
		intermediary_bank_instruction_4,
		intermediary_bank_instruction_5,
		intermediary_bank_instruction_6,
		additional_detail_1,
		additional_detail_2,
		additional_detail_3,
		additional_detail_4,
		receipt_instructions_id,
		payment_deal_no,
		fx_deal_no,
		bo_ref_id,
		xfer_deal_no;
		
	/**[AJAX] Handle errors and display dialog **/
	// TODO Continue error management 
	function _fncManageErrors(/*String*/ type, /* JSON */ response){
		
		var messageError = "";
		switch(type){
		case 3:
			messageError = m.getLocalization("errorFXRateRejected");
			if (response.trader_remarks !== undefined && response.trader_remarks.length !== 0)
			{
				messageError += "<br><br>" + m.getLocalization("traderRemarks") + response.trader_remarks;
			}
			
			break;
		case 20:
				if(response.opics_error.substring(0,4)	===	"5473")
				{
					messageError = m.getLocalization("errorFXOverDraftAccountRecordNotFound");
				}
				else if(response.opics_error.substring(0,3) === "486")
				{
					messageError = m.getLocalization("errorDAccountnotfound");
				}				
				else if(response.opics_error.substring(0,4) === "1471")
				{
					messageError = m.getLocalization("errorDeadLineOfPayment");
				}
				else if(response.opics_error.substring(0,4)	===	"7205")
				{
					messageError = messageError = response.opics_error;
				}
				else
				{
					messageError = m.getCommonMessageError(type, response);
				}
			break;
		case 28:
			messageError = m.getLocalization("errorFXRateNoLongerValid");
			break;
		case 29:
			messageError = m.getLocalization("errorFXUnknownCurrency");
			break;
		case 30:
			messageError = m.getLocalization("errorFXUnknownCounterCurrency");
			break;
		case 31:
			messageError = m.getLocalization("errorFXServiceClosed");
			break;
		case 32:
			messageError = m.getLocalization("errorFXServiceNotAuthorized");
			break;
		case 33:
			messageError = m.getLocalization("errorFXDateNotValid");
			break;
		case 34:
			messageError = m.getLocalization("errorFXCurrencyDateNotValid");
			break;
		case 35:
			messageError = m.getLocalization("errorFXCounterCurrencyDateNotValid", [response.errorParam]);
			break;
		case 993:
			messageError = m.getLocalization('errorQuoteExpired');
			break;
		default:
			messageError = m.getCommonMessageError(type, response);
			break;
		}
		console.debug("[INFO] Error (on status "+type+") : "+messageError);
		m.dialog.show("ERROR", messageError);
		
	}
	
	/**
	 * Initiate Counterparty Details for Credit Account and Currency
	 */
	function _initCounterpartyDetails ()
	{
		if(dj.byId('creditAccountNumber'))
		{
			dj.byId('beneficiary_act_no').set('value', dj.byId('creditAccountNumber').get('value'));
		}
		
		if(dj.byId('creditAccountName'))
		{
			dj.byId('beneficiary_act_name').set('value', dj.byId('creditAccountName').get('value'));
		}

		if(dj.byId('counterparty_cur_code'))
		{
			dj.byId('beneficiary_act_cur_code').set('value', dj.byId('counterparty_cur_code').get('value'));
		}
	}

	/**
	 *  Validating Treasury Internal Transfer Currency fields
	 */
	function _validateTrintCurrencies ()
	{
		var curr = dj.byId('ft_cur_code').get('value'),
			firstActName = dj.byId('applicant_act_name').get('value'),
			secondActName = dj.byId('beneficiary_act_name').get('value'),
			invalidMessage = "",
			firstCurr = firstActName.substring(0,3),
			secondCurr = secondActName.substring(0,3);
		if(firstCurr && firstCurr.length >0 && secondCurr && secondCurr.length>0 && curr && curr.length >0)
		{
			console.debug('[INFO] Validate currencies: '+curr+', with: '+firstCurr+' and '+secondCurr);
			if (curr !== firstCurr && curr !== secondCurr)
			{
				invalidMessage =  m.getLocalization('transferCurrencyDifferentThanAccountsCurrencies', [curr, firstCurr, secondCurr]);
				dj.byId('ft_cur_code').set("state","Error");
		 		dj.hideTooltip(dj.byId('ft_cur_code').domNode);
		 		dj.showTooltip(invalidMessage, dj.byId('ft_cur_code').domNode, 0);
			}

		}
	}
	
	/**
	 * Mapping the Debit Account's currency to Fund Transfer's currency
	 */
	function _setFTCurrencyField()
	{
	
		if(dj.byId('applicant_act_cur_code') && dj.byId('applicant_act_cur_code').get("value") !== "")
		{
			var applicantCurrencyCode = dj.byId('applicant_act_cur_code').get("value");
			dj.byId('ft_cur_code').set("value",applicantCurrencyCode);
		}	
	}
	
	/**
	 * To check whether Debit account is selected before selecting Credit Account
	 */
	function _checkDebitAccount()
	{
		if(dj.byId('applicant_act_name') && dj.byId('beneficiary_act_name') && dj.byId('entity'))
		{
			var applicantActNumber = dj.byId('applicant_act_name').get('value');
			var benficiaryActNumber = dj.byId('beneficiary_act_name').get('value');
			var entity = dj.byId('entity').get('value');
			if(entity !== "" &&  applicantActNumber === "" && benficiaryActNumber === "")
			{
				m.showTooltip(m.getLocalization("debitAccountNotSelected"), document.activeElement, ["after"]);
			}
		}
	}
		
	/** 
	 * Get the Rates from Opics side for treasury wires
	 */
	function _fncGetRateFT ()
	{
		dj.byId('loadingDialog').show();
		console.debug('[INFO] Begin Ajax call');
			m.xhrPost( {
				url : m.getServletURL("/screen/AjaxScreen/action/TreasuryRequestForQuoteSearchAction"),
				handleAs :"json",
				content : {
					operation: 'REQUEST',
					ft_type: '01',
					applicant_reference: applicant_reference,
					
					ordering_account: ordering_account,
					ordering_currency: ordering_currency,
					
					transfer_account: transfer_account,
					transfer_amount: transfer_amount,
					transfer_currency: transfer_currency,
					
					beneficiary_account: beneficiary_account,
					beneficiary_name: beneficiary_name,
					beneficiary_address: beneficiary_address,
					beneficiary_address_2 : beneficiary_address_2,
					beneficiary_city: beneficiary_city,
					beneficiary_country:beneficiary_country,
					beneficiary_bank: beneficiary_bank,
					
					beneficiary_bank_routing_number: beneficiary_bank_routing_number,
					beneficiary_bank_branch: beneficiary_bank_branch,
					beneficiary_bank_address: beneficiary_bank_address,
					beneficiary_bank_city: beneficiary_bank_city,
					beneficiary_bank_country: beneficiary_bank_country,
					beneficiary_bank_bic: beneficiary_bank_bic,

					ordering_cust_name: ordering_cust_name,
					ordering_cust_address: ordering_cust_address,
					ordering_cust_address_2: ordering_cust_address_2,
					ordering_cust_citystate: ordering_cust_citystate,
					ordering_cust_country: ordering_cust_country,
					ordering_cust_account: ordering_cust_account,
					
					ft_amount: ft_amount,
					ft_cur_code: ft_cur_code,
					execution_date: execution_date,
					execution_tenor: execution_tenor,
					payment_currency: payment_currency,
					payment_amount: payment_amount,

					remarks: remarks,
					
					fee_account: fee_account,
					feeCurCode: feeCurCode,
					feeAmt: feeAmt,
					
					swift_charges_type: swift_charges_type,

					intermediary_bank: intermediary_bank,
					intermediary_bank_aba: intermediary_bank_aba,
					intermediary_bank_bic: intermediary_bank_bic,
					intermediary_bank_street: intermediary_bank_street,
					intermediary_bank_street_2: intermediary_bank_street_2,
					intermediary_bank_city: intermediary_bank_city,
					intermediary_bank_country: intermediary_bank_country,
					intermediary_bank_instruction_1: intermediary_bank_instruction_1,
					intermediary_bank_instruction_2: intermediary_bank_instruction_2,
					intermediary_bank_instruction_3: intermediary_bank_instruction_3,
					intermediary_bank_instruction_4: intermediary_bank_instruction_4,
					intermediary_bank_instruction_5: intermediary_bank_instruction_5,
					intermediary_bank_instruction_6: intermediary_bank_instruction_6,
					
					additional_detail_1: additional_detail_1,
					additional_detail_2: additional_detail_2,
					additional_detail_3: additional_detail_3,
					additional_detail_4: additional_detail_4,
					receipt_instructions_id: receipt_instructions_id,
					mode: mode,
					bo_ref_id: bo_ref_id,
					payment_deal_no: payment_deal_no,
					fx_deal_no: fx_deal_no,
					xfer_deal_no: xfer_deal_no,
					bank : issuing_bank,
					productcode: "FT",
					subproductcode: sub_product_code
				},
				load : function(response, args){
					console.debug('[INFO] Ajax call success.');
					dj.byId('loadingDialog').hide();
					var status = response.status;
					console.debug('[INFO] Response status is:'+status);
					switch(status){
					/* request return with rate */
					case 5:
						m.showDealSummaryDialog(response);
						var validity = response.validity;
						m.countDown(validity);
						m.showDetailField();
						break;
					// request accepted - mono currency
					case 1:
						m.showDealSummaryDialog(response);
						break;
					// for request with manual rate
					case 6:
						dj.byId('bo_tnx_id').set('value', response.boTnxId);
						dj.byId('bo_ref_id').set('value', response.bo_ref_id);
						dj.byId('rec_id').set('value', response.rec_id);
						m.frequencyStore = response.delay_frequency;
						m.opicsFrequencyResponse = response.delay_frequency;
						m.delayStore = response.delay_timeout;
						m.openDelayDialog(m.frequencyStore, m.delayStore);
						rec_id = response.rec_id;
						break;
					default:
//						var errors = response.error_names;
						_fncManageErrors(status,response);
					break;
					}
				},
				customError : function(response, args){
					dj.byId('loadingDialog').hide();
					console.error('[requestFTAjaxCall] Error on Ajax Call for Request Fund Transfer');
					_fncManageErrors(status,response);
				}
			});
	}

	 /**
	  * Giving the response back to Opics after rejecting the rates
	  */
	 function _fncAjaxCancelFT ()
	 {
		dj.byId('loadingDialog').show();
		console.debug('[INFO] Begin Ajax call');
			m.xhrPost( {
				url : m.getServletURL("/screen/AjaxScreen/action/TreasuryRequestForQuoteSearchAction"),
				handleAs :"json",
				content : {
					operation: 'REJECT',
					ref_id: m.ref_id,
					ft_type: dj.byId('ft_type').get('value'),
					applicant_reference: applicant_reference,
					ordering_account: ordering_account,
					ordering_currency: ordering_currency,

					rec_id: dj.byId('rec_id').get('value'),
					
					beneficiary_account: beneficiary_account,
					beneficiary_name: beneficiary_name,
					beneficiary_address: beneficiary_address,
					beneficiary_address_2: beneficiary_address_2,
					beneficiary_city: beneficiary_city,
					beneficiary_country: beneficiary_country,
					beneficiary_bank: beneficiary_bank,
					
					beneficiary_bank_routing_number: beneficiary_bank_routing_number,
					beneficiary_bank_branch: beneficiary_bank_branch,
					beneficiary_bank_address: beneficiary_bank_address,
					beneficiary_bank_city: beneficiary_bank_city,
					beneficiary_bank_country: beneficiary_bank_country,
					beneficiary_bank_bic: beneficiary_bank_bic,

					ordering_cust_name: ordering_cust_name,
					ordering_cust_address: ordering_cust_address,
					ordering_cust_address_2: ordering_cust_address_2,
					ordering_cust_citystate: ordering_cust_citystate,
					ordering_cust_country: ordering_cust_country,
					ordering_cust_account: ordering_cust_account,
					
					swift_charges_type: swift_charges_type,

					intermediary_bank: intermediary_bank,
					intermediary_bank_aba: intermediary_bank_aba,
					intermediary_bank_bic: intermediary_bank_bic,
					intermediary_bank_street: intermediary_bank_street,
					intermediary_bank_street_2: intermediary_bank_street_2,
					intermediary_bank_city: intermediary_bank_city,
					intermediary_bank_country: intermediary_bank_country,
					intermediary_bank_instruction_1: intermediary_bank_instruction_1,
					intermediary_bank_instruction_2: intermediary_bank_instruction_2,
					intermediary_bank_instruction_3: intermediary_bank_instruction_3,
					intermediary_bank_instruction_4: intermediary_bank_instruction_4,
					intermediary_bank_instruction_5: intermediary_bank_instruction_5,
					intermediary_bank_instruction_6: intermediary_bank_instruction_6,
					
					additional_detail_1: additional_detail_1,
					additional_detail_2: additional_detail_2,
					additional_detail_3: additional_detail_3,
					additional_detail_4: additional_detail_4,
					
					ft_amount: ft_amount,
					ft_cur_code: ft_cur_code,
					execution_date: execution_date,
					execution_tenor: execution_tenor,
					remarks: remarks,
					bo_ref_id: dj.byId('bo_ref_id').get('value'),
					bo_tnx_id: dj.byId('bo_tnx_id').get('value'),
					credit_account_name: dj.byId('creditAccountName').get('value'),
					bank : dj.byId("issuing_bank_abbv_name").get("value"),
					productcode: "FT",
					subproductcode: sub_product_code
					
				},
				load : function(response, args){
					console.debug('[INFO] Ajax call success.');
					dj.byId('loadingDialog').hide();
					var status = response.status;
					console.debug('[INFO] Response status is:'+status);
					switch(status){
					/* request canceled */
					case 3:
						// TODO 
						m.performClearFieldsOnFieldChange();
						m.closeDealSummaryDialog();
						m.dialog.show('CUSTOM-NO-CANCEL', m.getLocalization('confirmationRejectRequest'), m.getLocalization('confirmationRejectTitle'));
						break;
					

					default:
						m.closeDealSummaryDialog();
						_fncManageErrors(status,response);
					break;
					}
				},
				customError : function(response, args){
					console.error('[CancelFTAjaxCall] error canceling FT quote');
					dj.byId('loadingDialog').hide();
					m.performClearFieldsOnFieldChange();
					m.closeDealSummaryDialog();
					_fncManageErrors('',response);
				}
			
			});
		}
	
	d.mixin(m._config, {
		/**
		 * Validation for Reauthentication 
		 */
		initReAuthParams : function() {
			
			var reAuthParams = {
				productCode : 'FT',
				subProductCode : dj.byId("sub_product_code").get("value"),
				transactionTypeCode : '01',
				entity :dj.byId("entity") ? dj.byId("entity").get("value") : "",
				currency : dj.byId("ft_cur_code") ? dj.byId("ft_cur_code").get('value') : "",
        		amount : dj.byId("ft_amt") ? m.trimAmount(dj.byId("ft_amt").get('value')) : "",
        		bankAbbvName :	dj.byId("issuing_bank_abbv_name")? dj.byId("issuing_bank_abbv_name").get("value") : "",	
				es_field1 : dj.byId("ft_amt") ? m.trimAmount(dj.byId("ft_amt").get("value")) : "",
				es_field2 : (dj.byId("applicant_act_no")) ? dj.byId("applicant_act_no").get("value") : ""
			};
			return reAuthParams;
		}
	});
	
	// Public functions & variables follow
	d.mixin(m, {
		/**
		 * Binds validations and events to fields in the form. 
		 */
		bind : function() {

			//  summary:
		    //            Binds validations and events to fields in the form.              
		    //   tags:
		    //            public
			
			// initialization of sub_product_code, use to link event
			if (dj.byId("sub_product_code")){
				sub_product_code = dj.byId("sub_product_code").get("value");
			}
			// all screen
			m.connect("issuing_bank_abbv_name", "onChange", m.populateReferences);
			if(dj.byId("issuing_bank_abbv_name"))
			{
				m.connect("entity", "onChange", function(){
					dj.byId("issuing_bank_abbv_name").onChange();});
			}
			m.connect("issuing_bank_customer_reference", "onChange", m.setApplicantReference);
			m.connect("ft_amt", "onBlur", function(){
				m.setTnxAmt(this.get("value"));
				m.amountValidationForZero(dj.byId("ft_amt"));
			});
			
			// action linked to buttons
			//m.connect("cancelDelayDialogButton", "onClick", m.performClear("delayDialog"));
			m.connect("buttonAcceptRequest", "onClick", m.acceptRate);
			m.connect("buttonCancelRequest", "onClick", m.fncPerformCancelRequest);
		
	
			m.setValidation("request_value_date", function(){
				return m.validateDate("request_value", "", "requestDateLessThanDateOfDayError", false);
			});
		
			m.connect("applicant_act_name", "onChange", _validateTrintCurrencies);
			m.connect("beneficiary_act_name", "onChange", _validateTrintCurrencies);
			m.connect("ft_cur_code", "onBlur", _validateTrintCurrencies);
			m.connect("applicant_act_name", "onChange", _setFTCurrencyField);
			m.connect("beneficiary_img", "onClick", _checkDebitAccount);			
			m.setValidation("ft_cur_code", m.validateCurrency);
			m.setValidation("request_value_number", function(){
				if (sub_product_code === "TRINT"){
					return m.validateTermNumber("request_value", "", "TermCodeError", false);
				}
			});
			m.connect('entity', 'onChange', m.performClearFieldsOnFieldChange);
			m.connect("ft_cur_code", "onChange", function(){
				m.setCurrency(this, ["ft_amt"]);
			});
						
		},
		
		/**
		 *  Events to perform on page load.
		 */
		onFormLoad : function() {
			//  summary:
			//          Events to perform on page load.
			//  tags:
			//         public
		
			// Populate references
			var issuingBankAbbvName = dj.byId("issuing_bank_abbv_name");
			if(issuingBankAbbvName)
			{
				issuingBankAbbvName.onChange();
			}
			
			var issuingBankCustRef = dj.byId("issuing_bank_customer_reference");
			if(issuingBankCustRef)
			{
				issuingBankCustRef.onChange();
				//Set the value selected if any
				issuingBankCustRef.set("value",issuingBankCustRef._resetValue);
			}
			//Disable loadingDialog/waitingDialog closing by using the escape key
			m.fncDisableLoadingDialogClosing();
			_initCounterpartyDetails();
			m.setCurrency(dj.byId("ft_cur_code"), ["ft_amt"]);
			
		},
		
		
		/** to init globals variables **/
		initVar : function()
		{
			ref_id = dj.byId("ref_id").get("value");
			
			if (dj.byId("applicant_reference"))
			{
				applicant_reference = dj.byId("applicant_reference").get("value");
			}
			else {
				applicant_reference="";
			}
			
			if(dj.byId("contract_type_1") && dj.byId("contract_type_1").get("checked") === true)
			{
				contract_type = "01";
			}
			else if(dj.byId("contract_type_2") && dj.byId("contract_type_2").get("checked") === true) 
			{
				contract_type = "02";
			}
			else
			{
				contract_type = dj.byId("contract_type").get("value");
			}
			debit_act_no = (dj.byId("cust_payment_account_act_no")) ? dj.byId("cust_payment_account_act_no").get("value") : "";
			debit_act_desc = (dj.byId("cust_payment_account_act_description")) ? dj.byId("cust_payment_account_act_description").get("value") : "";
			remarks = dj.byId("remarks").get("value");
			
			issuing_bank = dj.byId("issuing_bank_abbv_name").get("value");
		},
		
		/**
		 * Validations for the fields before Save
		 */
	     beforeSaveValidations : function(){
	    	var entity = dj.byId("entity") ;
	    	if(entity && entity.get("value") === "")
           {
                   return false;
           }
           else
           {
                   return true;
           }
        },
        
        /**
		 * Validations for the fields before Submission
		 */
        beforeSubmitValidations : function() {
			
        		console.debug('beforeSubmitValidations');	
        		if(dj.byId('applicant_act_no')){
        			var validDebit = dj.byId('applicant_act_no').get('value') !== '';
        		}
        		if(dj.byId('beneficiary_act_no')){
        			var	validTransfer =  dj.byId('beneficiary_act_no').get('value') !=='';
        		}
        		if(dj.byId('ft_amt')){
        			var validAmt  = document.getElementById('ft_amt').value.length > 0;
        		}
        		if(dj.byId('issuing_bank_customer_reference')){
        			var validIssBank = 	dj.byId('issuing_bank_customer_reference').get('value')!== '';
        		}
        		if(dj.byId('applicant_act_no')	&&	dj.byId('beneficiary_act_no'))
        		{
        			if(dj.byId('applicant_act_no').get('value')	===	dj.byId('beneficiary_act_no').get('value') && dj.byId('beneficiary_act_no').get('value') !== "" && dj.byId('applicant_act_no').get('value') !== "")
        			{
        				m._config.onSubmitErrorMsg =  m.getLocalization("debitAccountDifferentFromCreditAccount");
        				return false;
        			}
        			if(dj.byId('beneficiary_act_no').get('value') === "" && dj.byId('applicant_act_no').get('value') === "")
        			{
        				m._config.onSubmitErrorMsg =  m.getLocalization("mandatoryFieldsToSubmitError");
        				return false;
        			}
        		}
        		if(dj.byId('request_value_date'))
				{
					var validreqDate = dj.byId('request_value_date').get('value') !== null ;
							if(!validreqDate)
							{
								var reqValueCode	=	dj.byId('request_value_code').get('value');
									if(reqValueCode	==	"5"	||	reqValueCode	==	"6"	||	reqValueCode	==	"7")
										{
											validreqDate	=	true;
										}
									
									else if(reqValueCode	==	"1" || reqValueCode	==	"2"	|| reqValueCode	== "3" || reqValueCode	== "4")
										{
											if(isNaN(dj.byId('request_value_number').get('value')))
											{
												validreqDate	=	false;
											}
											else
											{
												validreqDate	=	true;
											}
										}
									else
										{
											var reqValueNum	=	document.getElementById('request_value_number').value.length > 0;
												if(reqValueNum)
												{
													validreqDate	=	true;
												}
												else
												{
													validreqDate	=	false;
												}
											
										}
							}
				}   		
        		if(dj.byId("mode") && dj.byId("mode").get("value") === "UNSIGNED")
    			{
        			return true;
    			}
        		else
    			{
        			if(validDebit && validTransfer && validAmt && validreqDate && validIssBank)
    				{
    					return true;
    				}
    				else
    				{
    					m._config.onSubmitErrorMsg =  m.getLocalization("mandatoryFieldsToSubmitError");
    					return false;
    				}
    			}
		},
		
		/**
		 *  Request to Treasury back office to get Rate. 
		 */
        requestFT : function(){
			console.debug('requestFT');	
			if(m.checkFields() && m.beforeSubmitValidations()) 
			{	
					if(dj.byId("mode") && dj.byId("mode").get("value") === "UNSIGNED")
					{
						m.acceptFT();
					}
						
					else if(dj.byId('ft_type').get('value') === '01')
					{
						m.fillVar();
						_fncGetRateFT();
					}
			}
			else if(dj.byId('beneficiary_act_name') && dj.byId('applicant_act_name') && dj.byId('beneficiary_act_name').get('value') !== "" && dj.byId('applicant_act_name').get('value') !== "" && (dj.byId('beneficiary_act_name').get('value') === dj.byId('applicant_act_name').get('value')))
			{
				m._config.onSubmitErrorMsg =  m.getLocalization("debitAccountDifferentFromCreditAccount");
				m.dialog.show("ERROR", m._config.onSubmitErrorMsg);
			}
			else
			{
				m._config.onSubmitErrorMsg = m.getLocalization("highlightedFieldsRequired");
				m.dialog.show("ERROR", m._config.onSubmitErrorMsg);
			}	
        },
        
      //call ajax service
		performDelayRequest : function()
		{
			console.debug('[INFO] Ajax call.');
			if(m.frequencyStore>0){
				m.xhrPost( {
					url : m.getServletURL("/screen/AjaxScreen/action/TreasuryRequestForQuoteSearchAction"),
					handleAs :"json",
					content : {
						operation: 'DELAY',
						ft_type: '01',
						ref_id: m.ref_id,
						//ft_type: m.ft_type,
						applicant_reference: applicant_reference,
						bo_ref_id: dj.byId('bo_ref_id').get('value'),
						bo_tnx_id: dj.byId('bo_tnx_id').get('value'),
						rec_id: dj.byId('rec_id').get('value'),
						
						ordering_account: ordering_account,
						ordering_currency: ordering_currency,
						
						transfer_account: transfer_account,
						transfer_amount: transfer_amount,
						transfer_currency: transfer_currency,
						
						beneficiary_account: beneficiary_account,
						beneficiary_name: beneficiary_name,
						beneficiary_address: beneficiary_address,
						beneficiary_address_2 : beneficiary_address_2,
						beneficiary_city: beneficiary_city,
						beneficiary_country:beneficiary_country,
						beneficiary_bank: beneficiary_bank,
						
						beneficiary_bank_routing_number: beneficiary_bank_routing_number,
						beneficiary_bank_branch: beneficiary_bank_branch,
						beneficiary_bank_address: beneficiary_bank_address,
						beneficiary_bank_city: beneficiary_bank_city,
						beneficiary_bank_country: beneficiary_bank_country,
						beneficiary_bank_bic: beneficiary_bank_bic,

						ordering_cust_name: ordering_cust_name,
						ordering_cust_address: ordering_cust_address,
						//ordering_cust_address_2: ordering_cust_address_2,
						ordering_cust_citystate: ordering_cust_citystate,
						ordering_cust_country: ordering_cust_country,
						ordering_cust_account: ordering_cust_account,
						
						swift_charges_type: swift_charges_type,

						intermediary_bank: intermediary_bank,
						intermediary_bank_aba: intermediary_bank_aba,
						intermediary_bank_bic: intermediary_bank_bic,
						intermediary_bank_street: intermediary_bank_street,
						//intermediary_bank_street_2: intermediary_bank_street_2,
						intermediary_bank_city: intermediary_bank_city,
						intermediary_bank_country: intermediary_bank_country,
						intermediary_bank_instruction_1: intermediary_bank_instruction_1,
						intermediary_bank_instruction_2: intermediary_bank_instruction_2,
						intermediary_bank_instruction_3: intermediary_bank_instruction_3,
						intermediary_bank_instruction_4: intermediary_bank_instruction_4,
						intermediary_bank_instruction_5: intermediary_bank_instruction_5,
						intermediary_bank_instruction_6: intermediary_bank_instruction_6,
						
						additional_detail_1: additional_detail_1,
						additional_detail_2: additional_detail_2,
						additional_detail_3: additional_detail_3,
						additional_detail_4: additional_detail_4,
						
						ft_amount: ft_amount,
						ft_cur_code: ft_cur_code,
						execution_date: execution_date,
						execution_tenor: execution_tenor,
						payment_currency: payment_currency,
						payment_amount: payment_amount,
						remarks: remarks,
						fee_account: fee_account,
						receipt_instructions_id:  receipt_instructions_id,
						bank : issuing_bank,
						productcode: "FT",
						subproductcode: sub_product_code
					},
					load : function(response, args){
						var status = response.status;
						console.debug('[FtAjaxCall] Ajax call success.');
						console.debug('[FtAjaxCall] Response status is:'+status);
						switch (status)
						{
						case 5:
							m.closeDelayDialog();
							m.showDealSummaryDialog(response);
							// Countdown start
							var validity = response.validity;
							m.countDown(validity);
							m.showDetailField();
							break;
						case 6:
							// update timer
							m.frequencyStore--;
							m.timer=setTimeout("misys.performDelayRequest()",(m.delayStore*1000));
							break;
						default:
							m.closeDelayDialog();
							_fncManageErrors(status, response);
							break;
						}
					},
					customError : function(response, args){
						console.error('[Create_FT] error retrieving quote');
						m.closeDelayDialog();
						_fncManageErrors('', response);
					}
				});
			}
			else
			{
				m.stopCountDown(m.timer);
				m.showContinuationElement();
			}
		},

		performCancelDelayRequest : function()
		{
			dj.byId('loadingDialog').show();
			console.debug('[INFO] Begin Ajax call');
				m.xhrPost( {
					url : m.getServletURL("/screen/AjaxScreen/action/TreasuryRequestForQuoteSearchAction"),
					handleAs :"json",
					content : {
						operation: 'CANCEL',
						ref_id: m.ref_id,
						ft_type: '01',
						applicant_reference: applicant_reference,
						ordering_account: ordering_account,
						ordering_currency: ordering_currency,
						
						beneficiary_account: beneficiary_account,
						beneficiary_name: beneficiary_name,
						beneficiary_address: beneficiary_address,
						beneficiary_address_2 : beneficiary_address_2,
						beneficiary_city: beneficiary_city,
						beneficiary_country:beneficiary_country,
						beneficiary_bank: beneficiary_bank,
						
						beneficiary_bank_routing_number: beneficiary_bank_routing_number,
						beneficiary_bank_branch: beneficiary_bank_branch,
						beneficiary_bank_address: beneficiary_bank_address,
						beneficiary_bank_city: beneficiary_bank_city,
						beneficiary_bank_country: beneficiary_bank_country,
						beneficiary_bank_bic: beneficiary_bank_bic,

						ordering_cust_name: ordering_cust_name,
						ordering_cust_address: ordering_cust_address,
						//ordering_cust_address_2: ordering_cust_address_2,
						ordering_cust_citystate: ordering_cust_citystate,
						ordering_cust_country: ordering_cust_country,
						ordering_cust_account: ordering_cust_account,
						
						swift_charges_type: swift_charges_type,

						intermediary_bank: intermediary_bank,
						intermediary_bank_aba: intermediary_bank_aba,
						intermediary_bank_bic: intermediary_bank_bic,
						intermediary_bank_street: intermediary_bank_street,
						//intermediary_bank_street_2: intermediary_bank_street_2,
						intermediary_bank_city: intermediary_bank_city,
						intermediary_bank_country: intermediary_bank_country,
						intermediary_bank_instruction_1: intermediary_bank_instruction_1,
						intermediary_bank_instruction_2: intermediary_bank_instruction_2,
						intermediary_bank_instruction_3: intermediary_bank_instruction_3,
						intermediary_bank_instruction_4: intermediary_bank_instruction_4,
						intermediary_bank_instruction_5: intermediary_bank_instruction_5,
						intermediary_bank_instruction_6: intermediary_bank_instruction_6,
						
						additional_detail_1: additional_detail_1,
						additional_detail_2: additional_detail_2,
						additional_detail_3: additional_detail_3,
						additional_detail_4: additional_detail_4,
						
						ft_amount: ft_amount,
						ft_cur_code: ft_cur_code,
						execution_date: execution_date,
						execution_tenor: execution_tenor,
						remarks: remarks,
						receipt_instructions_id:  receipt_instructions_id,
						bank : issuing_bank,
						bo_ref_id: dj.byId('bo_ref_id').get('value'),
						bo_tnx_id: dj.byId('bo_tnx_id').get('value'),
						credit_account_name: dj.byId('creditAccountName').get('value'),
						productcode: "FT",
						subproductcode: sub_product_code
						
					},
					load : function(response, args){
						console.debug('[INFO] Ajax call success.');
						dj.byId('loadingDialog').hide();
						var status = response.status;
						console.debug('[INFO] Response status is:'+status);
						switch(status){
						/* request canceled */
						case 3:
							// TODO 
							//fncPerformClear();
							m.closeDealSummaryDialog();
							m.dialog.show('CUSTOM-NO-CANCEL', m.getLocalization('confirmationCancelRequest'), m.getLocalization('confirmationCancelTitle'));
							break;
						

						default:
							_fncManageErrors(status,response);
						break;
						}
					},
					customError : function(response, args){
						console.error('[CancelFTAjaxCall] error canceling FT quote');
						dj.byId('loadingDialog').hide();
						m.closeDealSummaryDialog();
						_fncManageErrors('',response);
					}
				});
		},
		
		requestStandingInstructions : function(){
			console.debug('[DEBUG] requestStandingInstructions');
			m.fillVar();
			_fncGetStandingInstructions();
			
		},	
		
		
		/**
		 * Submitting the Deal/Transaction by accepting it.
		 */
		acceptFT : function(){
			dj.byId('option').set('value', 'ACCEPT');
			m.submit('SUBMIT');
		},
		
		/**
		 * Rejecting the Deal/Transaction by rejecting it.
		 */
		rejectFT : function(){
			if(m.countdown){
				m.stopCountDown(m.countdown);
			}
			_fncAjaxCancelFT();
		},
		
		/**
		 * Setting the values for corresponding fields for Treasury webservice call
		 */
		fillVar : function(){
			var number="";
			ref_id = dj.byId('ref_id').get('value');
			
			// global variable
			if (dj.byId('applicant_reference'))
			{
				applicant_reference = dj.byId('applicant_reference').get('value');
			}
			else {
				applicant_reference = '';
			}
			
			ordering_account = dj.byId('applicant_act_no').get('value');
			
		
			if(dj.byId('ft_type').get('value') === '01'){
				
				ordering_currency = dj.byId('applicant_act_cur_code').get('value');
				execution_date = dj.byId('request_value').getDate();
				if (dj.byId('request_value').getNumber())
				{
					number = dj.byId('request_value').getNumber();
				}
				execution_tenor = number+dj.byId('request_value').getCode();
			}

			// for transfer
			if (dj.byId('ft_type').get('value') === '01'){
				
				ft_amount = dj.byId('ft_amt').get('value');
				ft_cur_code = dj.byId('ft_cur_code').get('value');
				
				
				transfer_account = dj.byId('beneficiary_act_no').get('value');
				transfer_currency = dj.byId('beneficiary_act_cur_code').get('value');
			}


			/*if ((dj.byId('ft_type').get('value') == '01' || m.ft_type == '02')  && (document.getElementById("mode").value == 'DRAFT' || document.getElementById("mode").value == 'UNSIGNED')){
				fee_account = dj.byId('feeAccount').get('value');
				feeCurCode = dj.byId('feeCurCode').get('value');
				feeAmt = dj.byId('feeAmt').get('value');
				
			}*/
			
			// for the fee account 
			// TODO: re-do this part


			if ((dj.byId('ft_type').get('value') === '01' || dj.byId('ft_type').get('value') === '02')  && (document.getElementById("mode").value === 'NEW' || document.getElementById("mode").value === 'UNSIGNED')){
				fee_account = dj.byId('feeAccount').get('value');
				feeCurCode = dj.byId('feeCurCode').get('value');
				feeAmt = dj.byId('feeAmt').get('value');
				
			}
			else{
				if(dj.byId("FTCharge").get('value') == 'true'){
					if (dj.byId('open_chrg_brn_by_code_1').get('value') === '01'){
						fee_account = dj.byId('applicant_act_no').get('value');
					}
					else if (dj.byId('open_chrg_brn_by_code_2').get('value') === '02'){
						if (dj.byId('ft_type').get('value') === '01' || dj.byId('ft_type').get('value') === '05'){
							fee_account = dj.byId('beneficiary_act_no').get('value');
						}
						else if (dj.byId('ft_type').get('value')  === '02'){
							fee_account = dj.byId('beneficiary_account').get('value');
						}
					}
					else if (dj.byId('open_chrg_brn_by_code_3').get('value') === '03'){
						fee_account = dj.byId('beneficiary_account').get('value');
					}
				}
			}
			
			mode = document.getElementById("mode").value;
			/*payment_deal_no = dj.byId('payment_deal_no').get('value');
			fx_deal_no = dj.byId('fx_deal_no').get('value');
			bo_ref_id = dj.byId('bo_ref_id').get('value');
			xfer_deal_no = dj.byId('xfer_deal_no').get('value');*/
			
			issuing_bank = dj.byId("issuing_bank_abbv_name").get("value");
		},
		
		/**
		 * To check if both the currencies are equal 
		 */
		checkEqualsCurrencies : function(/*String*/secundCurrencyField)
		{
			var currency1 = this.get("value");
			var currency2 = dj.byId(secundCurrencyField).get("value");
			
			if (currency1.length === 3 && currency2.length === 3 && (this.state !== "Error" || secundCurrencyField.state !== "Error"))
			{
				console.debug("[INFO] Validate equals currencies :"+currency1+" & "+currency2);
				if (currency1 === currency2)
				{	this.set("value", "");	
					this.focus();
					this.state = "Error";
					this.displayMessage(m.getLocalization("errorFXEqualsCurrencies", [currency1]));
				}
			}
		},		

		/**
		 * Amount Validation for Zero Amount
		 */
		amountValidationForZero : function(amtId)
		{	
			var displayMessage;
			var amtIdValue = amtId.get("value");
			if(amtIdValue === 0 ){
				displayMessage = m.getLocalization("amountcannotzero");
				amtId.set("state","Error");
				dj.hideTooltip(amtId.domNode);
		 		dj.showTooltip(displayMessage, amtId.domNode, 0);
				return false;
			}
						
		},
		/**
		 * Fill the Account name if it is a Debit SETA or CN account 
		 */
		fillAccountField : function(accountType, accountSelected){
			if (accountType === "debitDDAccount"){
				//dj.byId("applicant_reference_hidden").set("value", accountSelected.customer_ref);
				dj.byId("cust_payment_account_act_no").set("value", accountSelected.account_no);
				dj.byId("cust_payment_account_act_description").set("value", accountSelected.description);
			}
		}		
	});
})(dojo, dijit, misys);


//Including the client specific implementation
       dojo.require('misys.client.binding.treasury.create_ft_trint_client');