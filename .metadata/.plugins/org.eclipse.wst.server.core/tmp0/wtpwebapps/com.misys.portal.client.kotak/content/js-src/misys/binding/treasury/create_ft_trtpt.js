dojo.provide("misys.binding.treasury.create_ft_trtpt");
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
dojo.require("misys.binding.common");
dojo.require("misys.binding.treasury.FtPopupManagement");
dojo.require("misys.binding.cash.common.standing_instruction_action");
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
		xfer_deal_no,
		debit_ccy,
		debit_amt,
		beneficiary_bank_clrc,
		bene_details_clrc,
		order_details_clrc,
		inter_bank_clrc,
		isFirst = false,
	bankPaymentInfo;

	/**
	 * Mapping the Debit Account's currency to Fund Transfer's currency
	 */
	function _setFTCurrencyField()
	{
		dj.byId('applicant_cur_code').set("value",dj.byId('applicant_act_cur_code').get("value")); 
		dj.byId('payment_cur_code').set("value",dj.byId('applicant_act_cur_code').get("value"));
		if(dj.byId('applicant_cur_code') && dj.byId('applicant_cur_code').get("value") !== "") {
			dj.byId('applicant_cur_code').set('disabled',true); 
		}
	}
	
	/**
	 * Function to check whether Bank Instructions radio button is clicked first time and requesting for Bank Instruction grid
	 */
	function _instructionsType1()
	{
		if(isFirst === false)
		{	
			isFirst = true;
			_requestBankInstructions();
		}
		else
		{
			m.dialog.show("CONFIRMATION",
					m.getLocalization("clearMessage"),"",
					// in case of ok
					function(){_requestBankInstructions();});
		}
	
	}
	
	
	
	/**
	 * Function to disable and clear Free Format instruction fields and create a bank instruction grid
	 */
	function _requestBankInstructions()
	{

		dj.byId('instructions_type').set('value', dj.byId("instructions_type_1").value);
		dj.byId('beneficiary_name').set('value', '');							
		dj.byId('beneficiary_address').set('value', '');							
		dj.byId('beneficiary_city').set('value', '');
		dj.byId('beneficiary_country').set('value', '');
		dj.byId('beneficiary_account').set('value', '');
		dj.byId('beneficiary_bank').set('value', '');
		dj.byId('beneficiary_bank_city').set('value', '');

		dj.byId('beneficiary_name').set('disabled', true);
		dj.byId('beneficiary_address').set('disabled', true);
		dj.byId('beneficiary_city').set('disabled', true);
		dj.byId('beneficiary_country').set('disabled', true);
		dj.byId('beneficiary_account').set('disabled', true);
		dj.byId('beneficiary_bank').set('disabled', true);
		dj.byId('beneficiary_bank_city').set('disabled', true);
		
		m.performClear(null,3,false);
		
		m.changeRequiredFieldsOnPaymentTypeChange(null,false);
		d.style('free_format_field',{'display':'none'});
		d.style('bank_instruction_field',{'display':'block'});
		
		m.requestStandingInstructions();
		
	}
	
	/**
	 * Function to check whether FreeFormat Instructions radio button is clicked first time and requesting for Free Format instruction fields
	 */
	function _instructionsType2()
	{	
		
		if(isFirst === false)
		{	
			isFirst = true;
			_requestFreeFormatInstructions();
		}
		else
		{
			m.dialog.show("CONFIRMATION",
					m.getLocalization("clearMessage"),"",
					// in case of ok
					function(){_requestFreeFormatInstructions();});
		}
	}
	
	/**
	 * Function to disable and clear Bank instruction grid fields and create Free Format instruction fields
	 */
	function _requestFreeFormatInstructions()
	{
		dj.byId('instructions_type').set('value', dj.byId("instructions_type_2").value);
		dj.byId('beneficiary_name').set('disabled', false);
		dj.byId('beneficiary_address').set('disabled', false);
		dj.byId('beneficiary_city').set('disabled', false);
		dj.byId('beneficiary_country').set('disabled', false);
		dj.byId('beneficiary_account').set('disabled', false);
		dj.byId('beneficiary_bank').set('disabled', false);
		dj.byId('beneficiary_bank_city').set('disabled', false);
		
		
		
		m.performClear(null,2,false);
		
		m.changeRequiredFieldsOnPaymentTypeChange(null,false);
		console.debug('instructions_type_2 onClick');
		d.style('free_format_field',{'display':'block'});
		d.style('bank_instruction_field',{'display':'none'});	
		d.style('freeformatbeneficiary',{'display':'block'});
		d.style('freeformataddlinstructions',{'display':'block'});
		d.style('freeformatpaymentdetails',{'display':'block'});
		d.style('bankPayment',{'display':'none'});
		
		misys._populateSwiftFields();
				
		if(dj.byId('beneficiary_name').get('state') === "Error")
		{
			dj.byId('beneficiary_name').set('state',"Incomplete");
		}
		if(dj.byId('beneficiary_address').get('state') === "Error")
		{
			dj.byId('beneficiary_address').set('state',"Incomplete");
		}
		if(dj.byId('beneficiary_address_2').get('state') === "Error")
		{
			dj.byId('beneficiary_address_2').set('state',"Incomplete");
		}
		if(dj.byId('beneficiary_city').get('state') === "Error")
		{
			dj.byId('beneficiary_city').set('state',"Incomplete");
		}
		if(dj.byId('beneficiary_account').get('state') === "Error")
		{
			dj.byId('beneficiary_account').set('state',"Incomplete");
		}
		if(dj.byId('beneficiary_bank').get('state') === "Error")
		{
			dj.byId('beneficiary_bank').set('state',"Incomplete");
		}
		if(dj.byId('beneficiary_bank_country').get('state') === "Error")
		{
			dj.byId('beneficiary_bank_country').set('state',"Incomplete");
		}
		if(dj.byId('beneficiary_country').get('state') === "Error")
		{
			dj.byId('beneficiary_country').set('state',"Incomplete");
		}
		if(dj.byId('beneficiary_bank_city').get('state') === "Error")
		{
			dj.byId('beneficiary_bank_city').set('state',"Incomplete");
		}
	}
	
	/** 
	 * Get the Standing Instructions from Opics side for treasury wires
	 */
	function _fncGetStandingInstructions()
	{

		dj.byId('loadingDialog').show();
		console.debug('[INFO] Begin Ajax call ');
			m.xhrPost( {
				url : m.getServletURL("/screen/AjaxScreen/action/TreasuryRequestForQuoteSearchAction"),
				handleAs :"json",
				content : {
					operation: 'REQUESTINSTRUCTIONS',
					ft_type: '02',
					applicant_reference: applicant_reference,
					
					ordering_account: ordering_account,
					
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
					bene_details_clrc:bene_details_clrc,
					
					beneficiary_bank_routing_number: beneficiary_bank_routing_number,
					beneficiary_bank_branch: beneficiary_bank_branch,
					beneficiary_bank_address: beneficiary_bank_address,
					beneficiary_bank_city: beneficiary_bank_city,
					beneficiary_bank_country: beneficiary_bank_country,
					beneficiary_bank_clrc:beneficiary_bank_clrc,
					beneficiary_bank_bic: beneficiary_bank_bic,

					ordering_cust_name: ordering_cust_name,
					ordering_cust_address: ordering_cust_address,
					ordering_cust_address_2: ordering_cust_address_2,
					ordering_cust_citystate: ordering_cust_citystate,
					ordering_cust_country: ordering_cust_country,
					ordering_cust_account: ordering_cust_account,
					order_details_clrc:order_details_clrc,
					
					ft_amount: ft_amount,
					ft_cur_code: ft_cur_code,
					execution_date: execution_date,
					execution_tenor: execution_tenor,
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
					inter_bank_clrc:inter_bank_clrc,
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
					bank : dj.byId("issuing_bank_abbv_name").get("value"),
					ordering_currency : dj.byId("applicant_act_cur_code").get("value"),
					payment_currency : dj.byId("payment_cur_code").get("value"),
					productcode: "FT",
					subproductcode: sub_product_code
					
				},
				load : function(response, args){
					console.debug('[INFO] Ajax call success.');
					dj.byId('loadingDialog').hide();
					var status = response.status;
					console.debug('Response status is:'+status);
					
					switch(status){
					case 7205: 
						m.closeDealSummaryDialog();
						_fncManageErrors(status,response);
						break;
					default:
						var myConfigData = misys._config;		
					
						var bankPaymentJson;
						bankPaymentJson = {items : response.receipts};
						bankPaymentInfo = bankPaymentJson;
						
						var grid = m._fncConstructBankPaymentGrid(bankPaymentJson, 'bankPaymentGrid', 'receipt_instructions_id');			
						
						//If unsigned content is being displayed the grid is filtered based on
						//the instruction_indicator the top row is selected and the row disabled. 
						if(document.getElementById("mode").value == 'UNSIGNED')
						{
							grid.setQuery({instruction_indicator: dj.byId('cpty_instruction_indicator').value});
							grid.selection.select(0);
							grid.rowSelectCell.setDisabled(0,true);
							
						}
						//If draft content is being displayed the grid is not filtered but the array
						//index for the matching instruction_indicator in the store is used to determine
						//the previously selected instruction option in the grid. 
	
						//Using the id is not the sam as the row number.
						//There are always double the number of record
						//in the grid as rows.
						//TODO: This works for now but a better way to do this must be found.
						else if(document.getElementById("mode").value == 'DRAFT'){
							var rowIdx = 0;
							for(var i = 0; i < grid.get('store')._arrayOfAllItems.length; i=i+2)
							{
								rowIdx++;
								/*	dj.byId('cpty_instruction_indicator').value
								if(grid.get('store')._arrayOfAllItems[i].instruction_indicator ==  dj.byId('cpty_instruction_indicator').value)
								{
									grid.scrollToRow(rowIdx-1);
									grid.selection.select(rowIdx-1+"");
								}*/
							}
						}
						break;
					}
				},
				customError : function(response, args){
					dj.byId('loadingDialog').hide();
					console.error('[requestFTAjaxCall] Error on Ajax Call for Request Fund Transfer');
					_fncManageErrors(status,response);
				}
			});
			
			console.debug('[DONE]');
	
	}
	/**
	 * Function to toggle and disable between Debit amount and Payment amount
	 */
	function _togglePaymentOrApplicantAmountFields()
	{
		var applAmount = dj.byId("applicant_act_amt"),
			paymentAmount = dj.byId("payment_amt");
		if(applAmount && paymentAmount)
		{
			if(!isNaN(applAmount.get("value")))
			{
				paymentAmount.set("disabled",true);
				paymentAmount.set("value","");
				m.toggleRequired("payment_amt", false);
				m.amountValidationForZero(applAmount);
				
			}
			else if(!isNaN(paymentAmount.get("value")))
			{
				applAmount.set("disabled",true);
				applAmount.set("value","");
				m.toggleRequired("applicant_act_amt", false);
				m.toggleRequired("applicant_cur_code", false);
				m.amountValidationForZero(paymentAmount);
			}
			else
			{
				paymentAmount.set("disabled",false);
				applAmount.set("disabled",false);
				m.toggleRequired("payment_amt", true);
				m.toggleRequired("applicant_act_amt", true);
				m.toggleRequired("applicant_cur_code", true);
				
			}
		}
	}
	
	
	
	/**[AJAX] Handle errors and display dialog **/	
	 function _fncManageErrors(/*String*/ type, /* JSON */ response)
	 {
		var messageError = '';
		switch(type){
		case 3:
			messageError = m.getLocalization('errorFTRejected');
			if (response.remarks !== null && response.remarks.length !== 0)
			{
				messageError += '<br><br>' + m.getLocalization('traderRemarks') + response.remarks;
			}
			break;
			
		case 7205:
			messageError = m.getLocalization('errorCurrencyCalendar');
			break;
		case 993:
			messageError = m.getLocalization('errorQuoteExpired');
			break;		
		default:
			messageError = m.getCommonMessageError(type, response);
			break;
		}		
		
		m.dialog.show('ERROR', messageError);
		m.performClear();
	}
	
	 /** 
	  * Get the Rates from Opics side for treasury wires
	  */
	 function _fncGetRateFT ()
		{
		 var beneName = (bankPaymentInfo !== undefined && bankPaymentInfo.items.length !==0) ? bankPaymentInfo.items[0].beneficiary_institution:beneficiary_name;
			dj.byId('loadingDialog').show();
			console.debug('[INFO] Begin Ajax call');
				m.xhrPost( {
					url : m.getServletURL("/screen/AjaxScreen/action/TreasuryRequestForQuoteSearchAction"),
					handleAs :"json",
					content : {
						operation: 'REQUEST',
						ft_type: '02',
						applicant_reference: applicant_reference,
						
						ordering_account: ordering_account,
						ordering_currency: ordering_currency,
						
						transfer_account: transfer_account,
						transfer_amount: transfer_amount,
						transfer_currency: transfer_currency,
						
						beneficiary_account: beneficiary_account,
						beneficiary_name: beneName,
						beneficiary_address: beneficiary_address,
						beneficiary_address_2 : beneficiary_address_2,
						beneficiary_city: beneficiary_city,
						beneficiary_country:beneficiary_country,
						bene_details_clrc:bene_details_clrc,
						beneficiary_bank: beneficiary_bank,
						
						
						beneficiary_bank_routing_number: beneficiary_bank_routing_number,
						beneficiary_bank_branch: beneficiary_bank_branch,
						beneficiary_bank_address: beneficiary_bank_address,
						beneficiary_bank_city: beneficiary_bank_city,
						beneficiary_bank_country: beneficiary_bank_country,
						beneficiary_bank_clrc:beneficiary_bank_clrc,
						beneficiary_bank_bic: beneficiary_bank_bic,

						ordering_cust_name: ordering_cust_name,
						ordering_cust_address: ordering_cust_address,
						ordering_cust_address_2: ordering_cust_address_2,
						ordering_cust_citystate: ordering_cust_citystate,
						ordering_cust_country: ordering_cust_country,
						order_details_clrc:order_details_clrc,
						ordering_cust_account: ordering_cust_account,
						
						ft_amount: ft_amount,
						ft_cur_code: ft_cur_code,
						execution_date: execution_date,
						execution_tenor: execution_tenor,
						payment_currency: payment_currency,
						payment_amount: payment_amount,
						debit_ccy : debit_ccy,
						debit_amt : debit_amt,
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
						inter_bank_clrc:inter_bank_clrc,
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
						applicant_act_amt : dj.byId('applicant_act_amt').get('value'),
						applicant_cur_code : dj.byId('applicant_cur_code').get('value'),
						payment_amt : dj.byId('payment_amt').get('value'),
						payment_cur_code : dj.byId('payment_cur_code').get('value'),
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
							break;
						default:
//							var errors = response.error_names;
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
		if(dj.byId("credit_amt"))
		{
			dj.byId("credit_amt").set("value", "");
		}
		if(dj.byId("debit_amt"))
		{
			dj.byId("debit_amt").set("value", "");
		}
		if(dj.byId("rate"))
		{
			dj.byId("rate").set("value", "");
		}
		
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
					bene_details_clrc:bene_details_clrc,
					beneficiary_bank: beneficiary_bank,
					
					beneficiary_bank_routing_number: beneficiary_bank_routing_number,
					beneficiary_bank_branch: beneficiary_bank_branch,
					beneficiary_bank_address: beneficiary_bank_address,
					beneficiary_bank_city: beneficiary_bank_city,
					beneficiary_bank_country: beneficiary_bank_country,
					beneficiary_bank_clrc:beneficiary_bank_clrc,
					beneficiary_bank_bic: beneficiary_bank_bic,

					ordering_cust_name: ordering_cust_name,
					ordering_cust_address: ordering_cust_address,
					ordering_cust_address_2: ordering_cust_address_2,
					ordering_cust_citystate: ordering_cust_citystate,
					ordering_cust_country: ordering_cust_country,
					order_details_clrc:order_details_clrc,
					ordering_cust_account: ordering_cust_account,
					
					swift_charges_type: swift_charges_type,

					intermediary_bank: intermediary_bank,
					intermediary_bank_aba: intermediary_bank_aba,
					intermediary_bank_bic: intermediary_bank_bic,
					intermediary_bank_street: intermediary_bank_street,
					intermediary_bank_street_2: intermediary_bank_street_2,
					intermediary_bank_city: intermediary_bank_city,
					intermediary_bank_country: intermediary_bank_country,
					inter_bank_clrc:inter_bank_clrc,
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
			
			var ft_cur_code = dj.byId('applicant_act_amt') ? dj.byId('applicant_cur_code').get('value') : dj.byId('payment_amt') ? dj.byId('payment_cur_code').get('value') : "";
			
			var ft_amt = dj.byId('applicant_act_amt') ? dj.byId('applicant_act_amt').get('value') : dj.byId('payment_amt') ? dj.byId('payment_amt').get('value') : "";

			var reAuthParams = {
				productCode : 'FT',
				subProductCode : dj.byId("sub_product_code").get("value"),
				transactionTypeCode : '01',
				entity :dj.byId("entity") ? dj.byId("entity").get("value") : "",
				currency : ft_cur_code ,
				amount : m.trimAmount(ft_amt),
        		bankAbbvName :	dj.byId("issuing_bank_abbv_name")? dj.byId("issuing_bank_abbv_name").get("value") : "",	
				es_field1 : m.trimAmount(ft_amt),
				es_field2 : (dj.byId("applicant_act_no")) ? dj.byId("applicant_act_no").get('value') : ''
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
			
			// Allow user to add only BIC Code or bank name and address
			m.connect('beneficiary_bank_bic', 'onBlur', function(){
				var prefix = "beneficiary";
				var bicCode=  dj.byId('beneficiary_bank_bic').value;
				m.toggleBeneficiaryFields(bicCode,prefix,'beneficiary_bank_country_btn_img',true);
			});
			
			m.connect('intermediary_bank_bic', 'onBlur', function(){
				var prefix = "intermediary";
				var bicCode=  dj.byId('intermediary_bank_bic').value;
				m.toggleBeneficiaryFields(bicCode,prefix,'intermediary_bank_country_btn_img',false);
			});
			m.connect('beneficiary_bank', 'onBlur', function(){
				var bankInp=  dj.byId('beneficiary_bank').value;
				var showBICFlag = "false";
				if(dj.byId("show_bic_code"))
					{
						showBICFlag = dj.byId("show_bic_code").get("value");
					}
				if(showBICFlag === "true")
					{
						if(dj.byId("beneficiary_bank_bic") && dj.byId("beneficiary_bank_bic").get("value") === "")
						{
							m.toggleBICFields(bankInp,'beneficiary_bank_bic');
						}
					}
				else
					{
						m.toggleBICFields(bankInp,'beneficiary_bank_bic');
					}
			});
			
			m.connect('intermediary_bank', 'onBlur', function(){				
				var bankInp=  dj.byId('intermediary_bank').value;
				m.toggleBICFields(bankInp,'intermediary_bank_bic');
			});
			
			
			// action linked to buttons
			//m.connect("cancelDelayDialogButton", "onClick", m.performClear("delayDialog"));
			m.connect("buttonAcceptRequest", "onClick", m.acceptRate);
			m.connect("buttonCancelRequest", "onClick", m.fncPerformCancelRequest);
		
	
			m.setValidation("request_value_date", function(){
				return m.validateDate("request_value", "", "requestDateLessThanDateOfDayError", false);
			});

			m.connect("applicant_act_name", "onChange", _setFTCurrencyField);
			m.connect('applicant_act_no', 'onChange', 
					function(){
					console.debug('applicant_act_no');
						dj.byId('instructions_type_1').set('disabled', false);
						dj.byId('instructions_type_2').set('disabled', false);
						
						if(dj.byId("instructions_type_1").checked) {
							dj.byId("instructions_type_1").checked = false;	
						}

						
						if(dj.byId("instructions_type_2").checked) {
							dj.byId("instructions_type_2").checked = false;	
						}
						d.style('bank_instruction_field',{'display':'none'});
						d.style('free_format_field',{'display':'none'});
						
						m.performClear(null,3,false);
						
					});
			
			//When Bank Instructions is selected
			m.connect('instructions_type_1', 'onClick',_instructionsType1);
			m.connect('instructions_type_2', 'onClick',_instructionsType2);
			
			m.setValidation("applicant_cur_code", m.validateCurrency);
			m.setValidation("payment_cur_code", m.validateCurrency);
			m.setValidation("beneficiary_country", m.validateCountry);
			m.setValidation("beneficiary_bank_country", m.validateCountry);
			m.setValidation("ordering_cust_country", m.validateCountry);
			m.setValidation("intermediary_bank_country", m.validateCountry);
			m.connect("payment_amt", "onBlur", _togglePaymentOrApplicantAmountFields);
			m.connect("applicant_act_amt", "onBlur", _togglePaymentOrApplicantAmountFields);
			m.connect('payment_cur_code', 'onChange', function(){
				if(dj.byId("instructions_type_1").checked) 
				{
					dj.byId("instructions_type_1").checked = false;	
				}
				if(dj.byId("instructions_type_2").checked) 
				{
					dj.byId("instructions_type_2").checked = false;
				}
				if(dj.byId('payment_cur_code').value.length === 0)
				{
					dj.byId('instructions_type_1').set('disabled', true);
					dj.byId('instructions_type_2').set('disabled', true);
				}
				if(dj.byId('payment_cur_code').value.length > 0)
				{
					dj.byId('instructions_type_1').set('disabled', false);
					dj.byId('instructions_type_2').set('disabled', false);
				}
				
				d.style('bank_instruction_field',{'display':'none'});
				d.style('free_format_field',{'display':'none'});
				m.performClear(null,3,false);
			});
			m.setValidation("request_value_number", function(){
				if (sub_product_code === "TRTPT"){
					return m.validateTermNumber("request_value", "", "TermCodeError", false);
				}
			});
			m._fncConnectSSIFields("");
			m.connect('entity', 'onChange', m.performClearFieldsOnFieldChange);
			m.connect("applicant_cur_code", "onChange", function(){
				m.setCurrency(this, ["applicant_act_amt"]);
				m.setPaymentDescriptionForCAD();
			});
			m.connect("payment_cur_code", "onChange", function(){
				//m.setCurrency(this, ["payment_amt"]);
				m.setCurrency(this, ["payment_amt"]);
				m.setPaymentDescriptionForCAD();
			});
			m.setValidation("intermediary_bank_bic", m.validateBICFormat);
			m.setValidation("beneficiary_bank_bic", m.validateBICFormat);
			
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
			if(m._config.swift_allowed){
				misys._populateClearingCodes("beneficiary_bank");
				misys._populateClearingCodes("beneficiary");
				misys._populateClearingCodes("intermediary_bank");
				misys._populateClearingCodes("ordering_customer");
			}
			
		/*	if(dj.byId('bank_instruction_field') && dj.byId('free_format_field'))
			{*/
				//set freeformat display if standing instructions module exists
				dojo.style('bank_instruction_field',{'display':'none'});
				dojo.style('free_format_field',{'display':'none'});
				
				if(dj.byId('applicant_act_name').get('value').length === 0)
				{
					dj.byId('instructions_type_2').checked =  false;	
					dj.byId('instructions_type_1').checked =  false;	
					dj.byId('instructions_type_1').set('disabled', true);
					dj.byId('instructions_type_2').set('disabled', true);
				}
				if(dj.byId('applicant_act_name').get('value'))
				{					
					dj.byId('applicant_cur_code').set('disabled',	true);
				}
				m.setCurrency(dj.byId("applicant_cur_code"), ["applicant_act_amt"]);
				m.setCurrency(dj.byId("payment_cur_code"), ["payment_amt"]);
				
				//Amount field disable
				var debitAmount = dj.byId("applicant_act_amt"),
				paymentAmount = dj.byId("payment_amt");
				if(debitAmount && paymentAmount)
				{
				if(!isNaN(debitAmount.get("value")))
				{
					paymentAmount.set("disabled",true);
					m.toggleRequired("payment_amt", false);
					
				}
				else if(!isNaN(paymentAmount.get("value")))
				{
					debitAmount.set("disabled",true);
					m.toggleRequired("applicant_act_amt", false);
					m.toggleRequired("applicant_cur_code", false);
				}
				else
				{
					paymentAmount.set("disabled",false);
					debitAmount.set("disabled",false);
					m.toggleRequired("payment_amt", true);
					m.toggleRequired("applicant_act_amt", true);
					m.toggleRequired("applicant_cur_code", true);
					
				}
				}
				
				if(dj.byId('instructions_type_2').checked){
					dj.byId('instructions_type_1').set('disabled', false);
					dj.byId('instructions_type_2').set('disabled', false);
					dj.byId('instructions_type_2').checked =  true;	
					_instructionsType2();
				}else if(dj.byId('instructions_type_1').checked){
					
					dj.byId('instructions_type_2').set('disabled', false);
					dj.byId('instructions_type_1').set('disabled', false);
					dj.byId('instructions_type_1').checked =  true;	
					_instructionsType1();
				}
				
				var prefix, bicCode, bankInp;
				
				if(dj.byId("beneficiary_bank_bic") && dj.byId("beneficiary_bank_bic").get("value") !== "")
				{
					 prefix = "beneficiary";
					 bicCode=  dj.byId('beneficiary_bank_bic').value;
					m.toggleBeneficiaryFields(bicCode,prefix,'beneficiary_bank_country_btn_img',true);
				}
				else if(dj.byId("beneficiary_bank") && dj.byId("beneficiary_bank").get("value") !== "")
				{
					 bankInp=  dj.byId('beneficiary_bank').value;
					m.toggleBICFields(bankInp,'beneficiary_bank_bic');
				}
				
				
				if(dj.byId("intermediary_bank_bic") && dj.byId("intermediary_bank_bic").get("value") !== "")
				{
					 prefix = "intermediary";
					 bicCode=  dj.byId('intermediary_bank_bic').value;
					m.toggleBeneficiaryFields(bicCode,prefix,'intermediary_bank_country_btn_img',false);
				}
				else if(dj.byId("intermediary_bank") && dj.byId("intermediary_bank").get("value") !== "")
				{
					 bankInp=  dj.byId('intermediary_bank').value;
					m.toggleBICFields(bankInp,'intermediary_bank_bic');
				}
		//	}
			
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
		 * Request to Treasury back office to get Instructions
		 */
        requestStandingInstructions : function(){
			console.debug('[DEBUG] requestStandingInstructions');
			m.fillVar();
			_fncGetStandingInstructions();
			
		},
		
		/**
		 *  Request to Treasury back office to get Rate. 
		 */
		requestFT : function(){
			console.debug('requestFT');
			
			if(dj.byId("mode") && dj.byId("mode").get("value") === "UNSIGNED")
			{
				m.acceptFT();
			}
			else
			{

				if(dj.byId("instructions_type_1") && dj.byId("instructions_type_1").checked) 
				{

					if(m.checkFields() && m.beforeSubmitValidations()) 
					{
						if (dj.byId('sub_product_code').get('value') === 'TRTPT')
						{
							var bankPaymentGridIsValid = dj.byId('bankPaymentGrid').store._arrayOfAllItems.length === 0 || (dj.byId('bankPaymentGrid').store._arrayOfAllItems.length !== 0 && dj.byId('instructions_type_1').checked && dj.byId('bankPaymentGrid').selection.selectedIndex !== -1) || dj.byId('instructions_type_2').checked;
							console.debug('bankPaymentGridIsValid: ' + bankPaymentGridIsValid);

							if (bankPaymentGridIsValid)
							{
								m.fillVar();
								if((dj.byId('bankPaymentGrid').rowCount > 0) && (dj.byId('bankPaymentGrid').selection.selectedIndex > -1))
								{
									receipt_instructions_id = dj.byId('bankPaymentGrid').selection.getSelected()[0].instruction_indicator[0];
								}
								if(dj.byId("effDate"))
								{
									dj.byId("effDate").set("value", dj.byId('bankPaymentGrid').selection.getSelected()[0].eff_date);
								}
								_fncGetRateFT();
							}
							else
							{
								m.dialog.show("ERROR", m.getLocalization("mustChooseBankInstruction"));
							}

						}
					}
				}
				else
				{
					m._config.onSubmitErrorMsg = m.getLocalization("mandatoryFieldsAndInstructionsRequired");
					if(m.checkFields() && m.beforeSubmitValidations()) 
					{
						if (dj.byId('ft_type').get('value') === '02'){
							if((dj.byId("instructions_type_1").checked === false) && (dj.byId("instructions_type_2").checked === false))
							{
								m.dialog.show("ERROR", m.getLocalization("mustChooseInstructionsType"));
							}else{

								m.fillVar();
								_fncGetRateFT();         

							}
						}else if (m.ft_type == '01' || m.ft_type == '05'){
							m.fillVar();
							_fncGetRateFT();       
						}	

					}
					else
					{	
						if(dj.byId("instructions_type_2").checked)
						{
							m._config.onSubmitErrorMsg = m.getLocalization("highlightedFieldsRequired");						
							m.dialog.show("ERROR", m._config.onSubmitErrorMsg);
						}
						else
						{
							m.dialog.show("ERROR", m._config.onSubmitErrorMsg);
						}
					}
				}
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
						ft_type: '02',
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
						bene_details_clrc:bene_details_clrc,
						beneficiary_bank: beneficiary_bank,
						
						beneficiary_bank_routing_number: beneficiary_bank_routing_number,
						beneficiary_bank_branch: beneficiary_bank_branch,
						beneficiary_bank_address: beneficiary_bank_address,
						beneficiary_bank_city: beneficiary_bank_city,
						beneficiary_bank_country: beneficiary_bank_country,
						beneficiary_bank_clrc:beneficiary_bank_clrc,
						beneficiary_bank_bic: beneficiary_bank_bic,
						

						ordering_cust_name: ordering_cust_name,
						ordering_cust_address: ordering_cust_address,
						ordering_cust_address_2: ordering_cust_address_2,
						ordering_cust_citystate: ordering_cust_citystate,
						ordering_cust_country: ordering_cust_country,
						order_details_clrc:order_details_clrc,
						ordering_cust_account: ordering_cust_account,
						
						swift_charges_type: swift_charges_type,

						intermediary_bank: intermediary_bank,
						intermediary_bank_aba: intermediary_bank_aba,
						intermediary_bank_bic: intermediary_bank_bic,
						intermediary_bank_street: intermediary_bank_street,
						intermediary_bank_street_2: intermediary_bank_street_2,
						intermediary_bank_city: intermediary_bank_city,
						intermediary_bank_country: intermediary_bank_country,
						inter_bank_clrc:inter_bank_clrc,
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
						ft_type: '02',
						applicant_reference: applicant_reference,
						ordering_account: ordering_account,
						ordering_currency: ordering_currency,
						
						beneficiary_account: beneficiary_account,
						beneficiary_name: beneficiary_name,
						beneficiary_address: beneficiary_address,
						beneficiary_address_2 : beneficiary_address_2,
						beneficiary_city: beneficiary_city,
						beneficiary_country:beneficiary_country,
						bene_details_clrc:bene_details_clrc,
						beneficiary_bank: beneficiary_bank,
						
						beneficiary_bank_routing_number: beneficiary_bank_routing_number,
						beneficiary_bank_branch: beneficiary_bank_branch,
						beneficiary_bank_address: beneficiary_bank_address,
						beneficiary_bank_city: beneficiary_bank_city,
						beneficiary_bank_country: beneficiary_bank_country,
						beneficiary_bank_clrc:beneficiary_bank_clrc,
						beneficiary_bank_bic: beneficiary_bank_bic,

						ordering_cust_name: ordering_cust_name,
						ordering_cust_address: ordering_cust_address,
						ordering_cust_address_2: ordering_cust_address_2,
						ordering_cust_citystate: ordering_cust_citystate,
						ordering_cust_country: ordering_cust_country,
						order_details_clrc:order_details_clrc,
						ordering_cust_account: ordering_cust_account,
						
						swift_charges_type: swift_charges_type,

						intermediary_bank: intermediary_bank,
						intermediary_bank_aba: intermediary_bank_aba,
						intermediary_bank_bic: intermediary_bank_bic,
						intermediary_bank_street: intermediary_bank_street,
						intermediary_bank_street_2: intermediary_bank_street_2,
						intermediary_bank_city: intermediary_bank_city,
						intermediary_bank_country: intermediary_bank_country,
						inter_bank_clrc:inter_bank_clrc,
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
		 * Validations for the fields before Save
		 */
		beforeSaveValidations : function()
 		{
							if (dj.byId("applicant_act_amt")) {
								dj.byId("debit_amt").set(
										"value",
										dj.byId("applicant_act_amt").get(
												'value'));
							}

							if (dj.byId("payment_amt")) {
								dj.byId("credit_amt").set("value",
										dj.byId("payment_amt").get('value'));
							}

							var entity = dj.byId("entity");
							if (entity && entity.get("value") === "") {
								return false;
							} else {
								return true;
							}
						},
		
		/**
		 * Validations for the fields before Submission
		 */
		beforeSubmitValidations : function()
		{
			if(dj.byId("mode") && dj.byId("mode").get("value") === "UNSIGNED")
			{
				return true;
			}
			
			var validDebitAccount = false;
			var validDebitAmt = false;
			var validPaymentCcy = false;
			var validPaymentAmt = false;
			var validIssBank = false;
			var gridIsInvalid = false; 
			var bankPaymentInstructionNotSelected = false;
			
			console.debug('beforeSubmitValidations');
			
			if(dj.byId('applicant_act_name'))
			{
				validDebitAccount = dj.byId('applicant_act_name').get('value') !== '';
			}
			if(dj.byId('applicant_act_amt'))
			{
				validDebitAmt  = dj.byId('applicant_act_amt').get('value') !== '';
			}
			if(dj.byId('payment_cur_code'))
			{
				validPaymentCcy  = dj.byId('payment_cur_code').value.length > 0;
			}
			if(dj.byId('payment_amt'))
			{
				validPaymentAmt  = dj.byId('payment_amt').get('value') !== '';
			}
			if(dj.byId('issuing_bank_customer_reference'))
			{
				validIssBank = 	dj.byId('issuing_bank_customer_reference').get('value')!== '';
			}
			if(dj.byId("instructions_type_1") &&  dj.byId("instructions_type_1").checked)
			{
				if(dj.byId('bankPaymentGrid'))
				{
					if(dj.byId('bankPaymentGrid').store._arrayOfAllItems.length === 0)
					{
						gridIsInvalid = true;
						var selectFreeFormatInstructionErrorMessage = "";
						selectFreeFormatInstructionErrorMessage = m.getLocalization("selectFreeFormatInstructionsError");
						m._config.onSubmitErrorMsg =  selectFreeFormatInstructionErrorMessage;
						if(selectFreeFormatInstructionErrorMessage && selectFreeFormatInstructionErrorMessage !=="")
						{	
							m.dialog.show("ERROR", selectFreeFormatInstructionErrorMessage);
							return false;
						}
					}
					if(dj.byId('bankPaymentGrid').store._arrayOfAllItems.length !== 0 && dj.byId('bankPaymentGrid').selection.selectedIndex === -1)
					{	
					bankPaymentInstructionNotSelected = true;
					var instructionNotSelectedErrorMessage = "";
					instructionNotSelectedErrorMessage = m.getLocalization("selectInstructionsError");
					m._config.onSubmitErrorMsg =  instructionNotSelectedErrorMessage;
					if(instructionNotSelectedErrorMessage && instructionNotSelectedErrorMessage !=="")
					{	
						m.dialog.show("ERROR", instructionNotSelectedErrorMessage);
						return false;
					}
					}
				}
			}
			if(dj.byId("instructions_type_2") &&  dj.byId("instructions_type_2").checked)
			{
					if(dj.byId('beneficiary_name').get('value') !== '' && dj.byId('beneficiary_address').get('value') !== ''  && dj.byId('beneficiary_city').get('value') !== '' && dj.byId('beneficiary_country').get('value') !== '' && dj.byId('beneficiary_account').get('value') !== '')
					{	
						gridIsInvalid = false;
					}
					else
					{
						gridIsInvalid = true;
					}	
			}
			
			if(validDebitAccount && (validDebitAmt || validPaymentAmt) && validIssBank && !gridIsInvalid && !bankPaymentInstructionNotSelected)
			{
				return true;
			}else
			{
				m._config.onSubmitErrorMsg =  m.getLocalization("errorAccountOrPaymentInformationMissing");
				return false;
			}
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
			ordering_currency = dj.byId('applicant_act_cur_code').get('value');
			execution_date = dj.byId('request_value').getDate();
			if (dj.byId('request_value').getNumber())
			{
				number = dj.byId('request_value').getNumber();
			}
			execution_tenor = number+dj.byId('request_value').getCode();
			mode = document.getElementById("mode").value;
			issuing_bank = dj.byId("issuing_bank_abbv_name").get("value");
			
			if (dj.byId('ft_type').get('value') === "02")
			{
				beneficiary_name = dj.byId('beneficiary_name').get('value');
				beneficiary_address = dj.byId('beneficiary_address').get('value');
				beneficiary_address_2 = dj.byId('beneficiary_address_2').get('value');
				beneficiary_city = dj.byId('beneficiary_city').get('value');
				beneficiary_account = dj.byId('beneficiary_account').get('value');
				beneficiary_bank = dj.byId('beneficiary_bank').get('value');
				beneficiary_country = dj.byId('beneficiary_country').get('value');
				if(m._config.swift_allowed){
					bene_details_clrc = dj.byId('bene_details_clrc').get('value');
				}
				/*if (document.getElementById("mode").value == 'DRAFT' && dj.byId("instructions_type_2").checked)
				{	
					dj.byId("cpty_instruction_indicator").set('value', '');
				}*/
				
				if((document.getElementById("instructions_type_1") &&  dj.byId("instructions_type_1").checked)) {
					receipt_instructions_id = dj.byId('receipt_instructions_id').get('value');
				}
				else
				{
					beneficiary_bank_routing_number = dj.byId('beneficiary_bank_routing_number').get('value');
					beneficiary_bank_branch = dj.byId('beneficiary_bank_branch').get('value');
					beneficiary_bank_address = dj.byId('beneficiary_bank_address').get('value');
					beneficiary_bank_city = dj.byId('beneficiary_bank_city').get('value');
					
					beneficiary_bank_country = dj.byId('beneficiary_bank_country').get('value');					
					if (document.getElementById("mode").value == 'UNSIGNED')
					{	
						dj.byId("beneficiary_bank_country").set('value', dj.byId('beneficiary_bank_country').get('value'));
						
						if(dj.byId("cpty_instruction_indicator").value !== '')
						{
							dj.byId("beneficiary_bank_routing_number").set('value', dj.byId('cpty_benif_account').get('value'));
						}
						else
						{
							dj.byId("beneficiary_bank_routing_number").set('value', dj.byId('cpty_benif_bank_routing_no').get('value'));
						}
					}
					
					beneficiary_bank_bic = dj.byId('beneficiary_bank_bic').get('value');
					ordering_cust_name = dj.byId('ordering_cust_name').get('value');
					ordering_cust_address = dj.byId('ordering_cust_address').get('value');
					ordering_cust_citystate = dj.byId('ordering_cust_citystate').get('value');
					ordering_cust_country = dj.byId('ordering_cust_country').get('value');
					ordering_cust_account = dj.byId('ordering_cust_account').get('value');
					intermediary_bank = dj.byId('intermediary_bank').get('value');
					intermediary_bank_aba = dj.byId('intermediary_bank_aba').get('value');
					intermediary_bank_bic = dj.byId('intermediary_bank_bic').get('value');
					intermediary_bank_street = dj.byId('intermediary_bank_street').get('value');
					intermediary_bank_city = dj.byId('intermediary_bank_city').get('value');
					intermediary_bank_country = dj.byId('intermediary_bank_country').get('value');
					intermediary_bank_instruction_1 = dj.byId('intermediary_bank_instruction_1').get('value');
					intermediary_bank_instruction_2 = dj.byId('intermediary_bank_instruction_2').get('value');
					intermediary_bank_instruction_3 = dj.byId('intermediary_bank_instruction_3').get('value');
					intermediary_bank_instruction_4 = dj.byId('intermediary_bank_instruction_4').get('value');
					intermediary_bank_instruction_5 = dj.byId('intermediary_bank_instruction_5').get('value');
					intermediary_bank_instruction_6 = dj.byId('intermediary_bank_instruction_6').get('value');
					if(m._config.swift_allowed){
						beneficiary_bank_clrc=dj.byId('beneficiary_bank_clrc').get('value');
						ordering_cust_address_2 = dj.byId('ordering_cust_address_2').get('value');
						order_details_clrc = dj.byId('order_details_clrc').get('value');
						intermediary_bank_street_2 = dj.byId('intermediary_bank_street_2').get('value');
						inter_bank_clrc = dj.byId('inter_bank_clrc').get('value');
					}
					if (document.getElementById("mode").value == 'UNSIGNED')
					{
						swift_charges_type = dj.byId('swift_charges_type').get('value');
					}else
					{
						if (dj.byId('swift_charges_type_1').checked){
							swift_charges_type = dj.byId('swift_charges_type_1').get('value');
						}
						else if (dj.byId('swift_charges_type_2').checked){
							swift_charges_type = dj.byId('swift_charges_type_2').get('value');
						}
						else if (dj.byId('swift_charges_type_3').checked){
							swift_charges_type = dj.byId('swift_charges_type_3').get('value');
						}
					}
					
					additional_detail_1 = dj.byId('free_additional_details_line_1_input').get('value');
					additional_detail_2 = dj.byId('free_additional_details_line_2_input').get('value');
					additional_detail_3 = dj.byId('free_additional_details_line_3_input').get('value');
					additional_detail_4 = dj.byId('free_additional_details_line_4_input').get('value');
	
				}
			}
			
			// for the fee account 
			if ((dj.byId('ft_type').get('value') === '01' || dj.byId('ft_type').get('value') === '02')  && (document.getElementById("mode").value === 'NEW' || document.getElementById("mode").value === 'UNSIGNED')){
				fee_account = dj.byId('feeAccount').get('value');
				feeCurCode = dj.byId('feeCurCode').get('value');
				feeAmt = dj.byId('feeAmt').get('value');
				
			}
			else{
				if(dj.byId("FTCharge").get('value') === 'true'){
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
			
			if(dj.byId('payment_cur_code').get('value') !== '' && dj.byId('payment_amt').get('value') !== '' && !isNaN(dj.byId("payment_amt").get('value')))
			{
				payment_currency = dj.byId('payment_cur_code').get('value');
				payment_amount = dj.byId('payment_amt').get('value');
				debit_ccy = dj.byId('applicant_act_cur_code').get('value');
				ft_cur_code = payment_currency; 
				ft_amount = payment_amount;
				debit_amt = dj.byId('applicant_act_amt').set('value',"");
				dj.byId('debit_amt').set('value',"");
			}
			else if(dj.byId('applicant_cur_code').get('value') !== '' && dj.byId('applicant_act_amt').get('value') !== '' && !isNaN(dj.byId("applicant_act_amt").get('value')))
			{
				debit_ccy = dj.byId('applicant_cur_code').get('value');
				debit_amt = dj.byId('applicant_act_amt').get('value');
				payment_currency = dj.byId('payment_cur_code').get('value');
				payment_amount = dj.byId('payment_amt').set('value',"");
				ft_cur_code = debit_ccy;
				ft_amount = debit_amt;
			}
			
			if(dj.byId("instructions_type_1") && dj.byId("instructions_type_1").checked) 
			{
				receipt_instructions_id = dj.byId('receipt_instructions_id').get('value');
			}
			else
			{
				receipt_instructions_id = '';
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
dojo.require('misys.client.binding.treasury.create_ft_trtpt_client');