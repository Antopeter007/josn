dojo.provide("misys.binding.cash.create_fx");
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
		issuing_bank;
		
		
	
	
	/**[AJAX] Function for putting data in page elements **/
	function _fncGetData(/*JSON*/ response)
	{
		d.query("#trade_id_report_row .content")[0].innerHTML = response.trade_id;
		dj.byId("trade_id").set("value", response.trade_id);
		dj.byId("rec_id").set("value", response.rec_id);
		trade_id = response.trade_id;
		rec_id = response.rec_id;
		dj.byId("remarks").set("value", response.remarks);
		
		if(sub_product_code === "SPOT" || sub_product_code === "FWD"){
			// report
			d.query("#rate_report_row .content")[0].innerHTML = response.rate;
			d.query("#counter_amt_report_row .content")[0].innerHTML =response.counter_currency + "&nbsp;" + response.counter_amount;

			d.query("#fx_amt_report_row .content")[0].innerHTML =  response.currency + "&nbsp;" + response.amount;

			d.query("#maturity_date_report_row .content")[0].innerHTML = response.value_date;
			d.query("#trader_remarks_report_row .content")[0].innerHTML = response.trader_remarks;
			
			// hidden fields
			dj.byId("rate").set("value", response.rate);
			dj.byId("counter_cur_code").set("value", response.counter_currency);
			dj.byId("counter_amt").set("value", response.counter_amount);
			dj.byId("maturity_date").set("value", response.value_date);
			dj.byId("trader_remarks").set("value", response.trader_remarks);
			dj.byId("value_date").set("value", response.value_date);
			dj.byId("fx_cur_code").set("value", response.currency);
			dj.byId("fx_amt").set("value", response.amount);
		}
			
		else if(sub_product_code === "DOPT"){
			// report
			d.query("#rate_report_row .content")[0].innerHTML = response.rate;
			d.query("#counter_amt_report_row .content")[0].innerHTML = response.counter_currency + "&nbsp;" + response.counter_amount;

			d.query("#fx_amt_report_row .content")[0].innerHTML = response.currency + "&nbsp;" + response.amount;

			d.query("#maturity_date_report_row .content")[0].innerHTML = response.value_date;
			d.query("#option_date_report_row .content")[0].innerHTML = response.option_value_date;
			d.query("#trader_remarks_report_row .content")[0].innerHTML = response.trader_remarks;
			
			// hidden fields
			dj.byId("rate").set("value", response.rate);
			dj.byId("counter_cur_code").set("value", response.counter_currency);
			dj.byId("counter_amt").set("value", response.counter_amount);
			dj.byId("maturity_date").set("value", response.value_date);
			dj.byId("trader_remarks").set("value", response.trader_remarks);
			dj.byId("value_date").set("value", response.value_date);
			dj.byId("fx_cur_code").set("value", response.currency);
			dj.byId("fx_amt").set("value", response.amount);
			dj.byId("option_date").set("value", response.option_value_date);
		}
		else if(sub_product_code === "WFWD"){
			// report
			d.query("#rate_report_row .content")[0].innerHTML = response.rate;
			d.query("#counter_amt_report_row .content")[0].innerHTML = response.counter_currency + "&nbsp;" + response.counter_amount;

			d.query("#fx_amt_report_row .content")[0].innerHTML = response.currency + "&nbsp;" + response.amount;

			d.query("#maturity_date_report_row .content")[0].innerHTML = response.value_date;
			d.query("#option_date_report_row .content")[0].innerHTML = response.option_value_date;
			d.query("#trader_remarks_report_row .content")[0].innerHTML = response.trader_remarks;
			
			// hidden fields
			dj.byId("rate").set("value", response.rate);
			dj.byId("counter_cur_code").set("value", response.counter_currency);
			dj.byId("counter_amt").set("value", response.counter_amount);
			dj.byId("maturity_date").set("value", response.value_date);
			dj.byId("trader_remarks").set("value", response.trader_remarks);
			dj.byId("value_date").set("value", response.value_date);
			dj.byId("fx_cur_code").set("value", response.currency);
			dj.byId("fx_amt").set("value", response.amount);
			dj.byId("option_date").set("value", response.option_value_date);
		}
		
		else if (sub_product_code === "SWAP")
		{
			// Near
			d.query("#near_amt_report_row .content")[0].innerHTML = response.currency + "&nbsp;" + response.near_amount;
			d.query("#near_rate_report_row .content")[0].innerHTML = response.near_rate;
			d.query("#near_counter_amt_report_row .content")[0].innerHTML = response.counter_currency + "&nbsp;" + response.near_counter_amount;
			d.query("#near_date_report_row .content")[0].innerHTML = response.near_value_date;
			
			// hidden fields
			dj.byId("near_currency_code").set("value", response.currency);
			dj.byId("near_amt").set("value", response.near_amount);
			dj.byId("near_rate").set("value", response.near_rate);
			dj.byId("near_counter_currency_code").set("value", response.counter_currency);
			dj.byId("near_counter_amt").set("value", response.near_counter_amount);
			dj.byId("near_date").set("value", response.near_value_date);
			
			// Far
			d.query("#far_amt_report_row .content")[0].innerHTML = response.currency + "&nbsp;" + response.amount;
			d.query("#far_rate_report_row .content")[0].innerHTML = response.rate;
			d.query("#far_counter_amt_report_row .content")[0].innerHTML = response.counter_currency + "&nbsp;" + response.counter_amount;
			d.query("#far_date_report_row .content")[0].innerHTML = response.value_date;
			
			d.query("#trader_remarks_report_row .content")[0].innerHTML = response.trader_remarks;
			
			// hidden fields
			dj.byId("fx_cur_code").set("value", response.currency);
			dj.byId("fx_amt").set("value", response.amount);
			dj.byId("counter_cur_code").set("value", response.counter_currency);
			dj.byId("rate").set("value", response.rate);
			dj.byId("counter_amt").set("value", response.counter_amount);
			dj.byId("value_date").set("value", response.value_date);
			dj.byId("maturity_date").set("value", response.value_date);
			dj.byId("trader_remarks").set("value", response.trader_remarks);
		}
		
		// hide trader remarks from screen if empty
		if (response.trader_remarks === undefined || response.trader_remarks.length === 0)
		{
			if (dojo.byId("traderRemarksContainer")){
				dojo.style(dojo.byId("traderRemarksContainer"), "display", "none");
			}
		} 
		else
		{
			if (dojo.byId("traderRemarksContainer")){
				dojo.style(dojo.byId("traderRemarksContainer"), "display", "");
			}
		}
	}
	
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
		case 41:
			messageError = m.getLocalization("errorQuoteNotReceived");
			break;
		case 993:
			messageError = m.getLocalization("errorQuoteExpired");
			break;
		default:
			messageError = m.getCommonMessageError(type, response);
			break;
		}
		console.debug("[INFO] Error (on status "+type+") : "+messageError);
		m.dialog.show("ERROR", messageError);
		_fxToggleEnableReadOnlyFields();
	}

	/**
	 * Function to clear the fields
	 */
	function _performClear()
	{
		var fieldsToClear = _getFieldsToClear();
		
		d.forEach(fieldsToClear, function(id){
			if(dj.byId(id))
			{
				dj.byId(id).reset();
			}
		}
		);
	}
	
	/**
	 * function required by request_action File for request pattern
	 * put fields to clear to renew request 
	 * **/
	function _getFieldsToClear()
	{
		var fieldsToClear = [
					/* ALL */
					"input_fx_cur_code",
					"input_fx_amt",
					"input_counter_amt",
					"cust_payment_account_act_name",
					"remarks",
					"issuing_bank_customer_reference"
					];
			return fieldsToClear;
	}
	
	function _fxToggleEnableFields(){
		// Summary:
		// To manage the case of counter currency amount to be disabled in FX
		m.toggleEnableFields();
		m.hideOtherCurrency();
	}
	
	function _fxToggleEnableReadOnlyFields(){
		var fieldsToEnable = m.getEnabledFields();
		d.forEach(fieldsToEnable, function(id){
			var field = dj.byId(id);
			if(field)
			{	
				if(id.indexOf("button")>=0 || id.indexOf("img")>=0 || id.indexOf("image")>=0 ){
					field.set("disabled", false);
				}
				else{
					field.set("readOnly", false);
				}
			}
		});
		m.hideOtherCurrency();
	}
	
	function _fncAnimateDebitAccountRow(){
		//check the presence of all involved fields
		if(!dj.byId("contract_type_1") || !dj.byId("contract_type_2") || !dj.byId("input_fx_cur_code") || !dj.byId("input_counter_cur_code") ) {
			return;
		}
		
		var actCurCode = dj.byId("cust_payment_cur_code").get("value"); //default currency
		var showAct = (dj.byId("contract_type_1").checked && dj.byId("input_counter_cur_code").get("value") === actCurCode) || (dj.byId("contract_type_2").checked && dj.byId("input_fx_cur_code").get("value") === actCurCode);
		
		misys.toggleFields(showAct, null, ["cust_payment_account_act_name"], false, true);
		if(showAct){
			misys.animate("wipeIn", "cust_payment_account_act_name_row");
		} else {
			misys.animate("wipeOut", "cust_payment_account_act_name_row");
			dj.byId("cust_payment_account_act_name").set("value","");
			dj.byId("cust_payment_account_act_cur_code").set("value","");
			dj.byId("cust_payment_account_act_no").set("value","");
			dj.byId("cust_payment_account_act_description").set("value","");
		}
	}

	
	d.mixin(m._config, {

		initReAuthParams : function() {

			var reAuthParams = {
				productCode : 'FX',
				subProductCode : dj.byId("sub_product_code")? dj.byId("sub_product_code").get("value"): '',
				transactionTypeCode : '01',
				entity :dj.byId("entity") ? dj.byId("entity").get("value") : "",
				currency : dj.byId("input_fx_cur_code") ? dj.byId("input_fx_cur_code").get("value") : "",
				amount : dj.byId("input_fx_amt") ? m.trimAmount(dj.byId("input_fx_amt").get("value")) : "",
				bankAbbvName :	dj.byId("issuing_bank_abbv_name")? dj.byId("issuing_bank_abbv_name").get("value") : "",				
				es_field1 : dj.byId("input_fx_amt") ? m.trimAmount(dj.byId("input_fx_amt").get("value")) : "",
				es_field2 : (dj.byId("cust_payment_account_act_no")) ? dj.byId("cust_payment_account_act_no").get("value") : ""
			};
			return reAuthParams;
		}
	});
	
	// Public functions & variables follow
	d.mixin(m, {
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
			m.connect("fx_amt", "onBlur", function(){
				m.setTnxAmt(this.get("value"));
			});
			
			// action linked to buttons
			//m.connect("cancelDelayDialogButton", "onClick", m.performClear("delayDialog"));
			m.connect("buttonAcceptRequest", "onClick", m.acceptRate);
			m.connect("buttonCancelRequest", "onClick", m.fncPerformCancelRequest);
			
			m.connect("input_counter_cur_code", "onBlur", function(){
				var checkEqualsCurrenciesHitched = d.hitch(dj.byId("input_counter_cur_code"), m.checkEqualsCurrencies);
				return checkEqualsCurrenciesHitched("input_fx_cur_code");
				});
			
			if(dj.byId("enableCounterCurrency").get("value") === "true")
			{
				if (sub_product_code !== "SWAP"){
				m.connect("input_fx_cur_code", "onBlur",m.hideOtherCurrency);
				m.connect("input_fx_amt", "onBlur",m.hideOtherCurrency);
				m.connect("input_counter_cur_code", "onBlur",m.hideOtherCurrency);
				m.connect("input_counter_amt", "onBlur",m.hideOtherCurrency);
				}
				if (sub_product_code === "SWAP"){
				m.connect("input_near_amt", "onBlur",m.hideOtherswapCurrency);
				m.connect("input_near_counter_amt", "onBlur",m.hideOtherswapCurrency);
				//m.connect("input_fx_cur_code", "onBlur",m.hideOtherswapCurrency);
				m.connect("input_far_amt", "onBlur",m.hideFarswapCurrency);
				m.connect("input_far_counter_amt", "onBlur",m.hideFarswapCurrency);
				//m.connect("input_counter_cur_code", "onBlur",m.hideOtherswapCurrency);
				}
			}
			
			m.connect("contract_type_1", "onClick", function(){
				//dj.byId("input_value_period").value = "SPOT";
				dj.byId("input_value_period").set("value","SPOT");
			});			
			
			m.connect("contract_type_2", "onClick", function(){
				//dj.byId("input_value_period").value = "CASH";
				dj.byId("input_value_period").set("value","CASH");
			});						
			
			m.connect("input_fx_cur_code", "onBlur", function(){
				var checkEqualsCurrenciesHitched = d.hitch(dj.byId("input_fx_cur_code"), m.checkEqualsCurrencies);
				return checkEqualsCurrenciesHitched("input_counter_cur_code");
				});
			
			// all screen except swap
			if (sub_product_code !== "SWAP")
			{
				m.setValidation("input_counter_cur_code", m.validateCurrency);
				m.setValidation("input_fx_cur_code", m.validateCurrency);
				
				m.connect("input_fx_amt", "onChange", function(){
					dj.byId("input_fx_amt").focus();	
					m.setCurrency(this, ["input_fx_amt"]);
					m.amountValidationForZero(dj.byId("input_fx_amt"));
				});
				if(dj.byId("enableCounterCurrency").get("value") === "true")
			{
				m.connect("input_counter_amt", "onChange", function(){
					dj.byId("input_counter_amt").focus();	
					m.setCurrency(this, ["input_counter_amt"]);
					m.amountValidationForZero(dj.byId("input_counter_amt"));
				});
				}
			}
			// swap screen
			else {
				m.setValidation("input_fx_cur_code", m.validateCurrency);
				m.setValidation("input_counter_cur_code", m.validateCurrency);
				
				
				
				// validation of the far date
				m.setValidation("input_near_date", function(){
					return /*m.validateDate("input_near", "", "errorFXNearDateGreaterDateOfDay", false) && */m.validateDate("input_near", "input_value", "errorFXNearDateGreaterFarDate", true);
				});
//				m.setValidation("input_near_code", function(){
//					return m.validateDate("input_near", "", "errorFXNearDateGreaterDateOfDay", false) 
//							&& m.validateDate("input_near", "input_value", "errorFXNearDateGreaterFarDate", true);
//				});
				// linked field amount to field currency
				m.connect("input_fx_cur_code", "onChange", function(){
					m.setCurrency(this, ["input_near_amt"]);
				});
				m.connect("input_fx_cur_code", "onChange", function(){
					m.setCurrency(this, ["input_far_amt"]);
				});
				if(dj.byId("enableCounterCurrency").get("value") === "true")
				{
				m.connect("input_counter_cur_code", "onChange", function(){
					m.setCurrency(this, ["input_far_counter_amt"]);
				});
				m.connect("input_counter_cur_code", "onChange", function(){
					m.setCurrency(this, ["input_near_counter_amt"]);
				});
				}
			}			

			//option date for Window Forward screen
			if (sub_product_code === "WFWD")
			{				
				m.setValidation("input_option_number", function(){
					return m.validateTermNumber("input_option", "", "TermCodeError", false);
				});
			}
			
			// all screen except spot
			if (sub_product_code !== "SPOT")
			{
				m.setValidation("input_value_date", function(){
					if(sub_product_code === "SWAP"){
						return m.validateDate("input_value", "", "errorFXFarDateGreaterDateOfDay", false) && m.validateDate("input_value", "input_near", "errorFXFarDateGreaterNearDate", false);
					}
					else if (sub_product_code === "DOPT"){
						return m.validateDate("input_value", "", "DateLessThanDateOfDayError", false) && m.validateDate("input_value", "input_option", "valueDateSmallerThanOptionDate", false);
					}
					
					else if (sub_product_code === "WFWD"){
						return m.validateDate("input_value", "", "DateLessThanDateOfDayError", false) && m.validateDate("input_value", "input_option", "valueDateSmallerThanOptionDate", false);
					} 
					else{
						return m.validateDate("input_value", "", "DateLessThanDateOfDayError", false);
					}
				});
				m.setValidation("input_value_number", function(){
					if (sub_product_code === "FWD" || sub_product_code === "WFWD"){
						return m.validateTermNumber("input_value", "", "TermCodeError", false);
					}
				});
			}
			else 
			{
				//Direct Debit Account(DDA) logic
				m.connect("contract_type_1", "onChange", _fncAnimateDebitAccountRow);
				m.connect("contract_type_2", "onChange", _fncAnimateDebitAccountRow);
				m.connect("input_fx_cur_code", "onChange", _fncAnimateDebitAccountRow);
				m.connect("input_counter_cur_code", "onChange", _fncAnimateDebitAccountRow);
			}
			
			// delivery option screen
			if (sub_product_code === "DOPT")
			{
				m.setValidation("input_option_date", function(){
					return/* m.validateDate("input_option", "", "optionDateLessThanDateOfDay", false) && */m.validateDate("input_option", "input_value", "optionDateGreaterThanValueDate", true);
				});
			}
				
				if (sub_product_code === "WFWD")
				{
					m.setValidation("input_option_date", function(){
						return m.validateDate("input_option", "", "optionDateLessThanDateOfDay", false) && m.validateDate("input_option", "input_value", "optionDateGreaterThanValueDate", true);
					});
//				m.setValidation("input_option_code", function(){
//					return m.validateDate("input_option", "", "optionDateLessThanDateOfDay", false) 
//					&& m.validateDate("input_option", "input_value", "optionDateGreaterThanValueDate", true);
//				});
			}
			m.setValidation("remarks", m.validateAlphaNumericRemarks);
			m.connect('entity', 'onChange', _performClear);
		},
		
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
			
			if(dj.byId("enableCounterCurrency").get("value") === "true")
			{
				if(sub_product_code === "SWAP"){	
					m.setCurrency("input_counter_cur_code", ["input_far_counter_amt"]);
					m.setCurrency("input_counter_cur_code", ["input_near_counter_amt"]);
				}
			}
			
			m.setCurrency(dj.byId("input_fx_cur_code"), ["input_fx_amt"]);
			m.amountValidationForZero(dj.byId("input_fx_amt"));
			m.setCurrency(dj.byId("input_counter_cur_code"), ["input_counter_amt"]);
			m.amountValidationForZero(dj.byId("input_counter_amt"));
			
			if(dj.byId("contract_type_2") && dj.byId("contract_type_2").get("value") === "02" && dj.byId("cust_payment_account_act_name"))
			{
				misys.animate("wipeOut", "cust_payment_account_act_name_row");
				dj.byId("cust_payment_account_act_name").set("required", false);
			}
			if(dj.byId('input_fx_amt'))
			{
				dj.byId('input_fx_amt').set('value', '');
			}
			if(dj.byId('input_counter_amt'))
			{
				dj.byId('input_counter_amt').set('value', '');
			}

			
				
		},
		
		
		/** first ajax call -> to get a rate **/
		fncPerformRequest : function()
		{

			/*
			 * add your validation before do Perform Request
			 * 
			 * exemple :
				var listDateField = ["input_value", "input_near", "input_option"];
				isValid = true;
				d.forEach(listDateField, function(id){
					if (!_fncValidateDateDaysPeriod(id)){
						isValid = false;
					}
				});
			 */
			
			if(/*isValid && */m.checkFields()) 
			{
				m.doPerformRequest();
			}
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
			
			// swap use particular fields
			if (sub_product_code === "SWAP")
			{
				fx_cur_code = dj.byId("input_fx_cur_code").get("value");
				fx_amt = dj.byId("input_far_amt").get("value");
				counter_cur_code = dj.byId("input_counter_cur_code").get("value");
				near_amt = dj.byId("input_near_amt").get("value");
				input_near_date = dj.byId("input_near").getDate();
				input_near_days = dj.byId("input_near").getNumber();
				input_near_period = dj.byId("input_near").getCode();
				if(dj.byId("enableCounterCurrency").get("value") === "true")
				{
					counter_amt = dj.byId("input_far_counter_amt").get("value");
					near_counter_amt = dj.byId("input_near_counter_amt").get("value");
				}
			}
			else {
				counter_cur_code = dj.byId("input_counter_cur_code").get("value");
				if(dj.byId("enableCounterCurrency").get("value") === "true")
				{
					counter_amt = dj.byId("input_counter_amt").get("value");
				}
				fx_cur_code = dj.byId("input_fx_cur_code").get("value");
				fx_amt = dj.byId("input_fx_amt").get("value");
				input_near_date = "";
				input_near_days = "";
				input_near_period = "";
			}
			// value date is use by all except by spot
			if (sub_product_code !== "SPOT")
			{
				input_value_date = dj.byId("input_value").getDate();
				input_value_days = dj.byId("input_value").getNumber();
				input_value_period = dj.byId("input_value").getCode();
			}
			else
			{
				input_value_date = "";
				input_value_days = "";
				input_value_period = dj.byId("input_value_period").get("value");
				
			}
			// option date is use only by delivery option
			if (sub_product_code === "DOPT")
			{
				input_option_date = dj.byId("input_option").getDate();
				input_option_days = dj.byId("input_option").getNumber();
				input_option_period = dj.byId("input_option").getCode();
			}
			
			if (sub_product_code === "WFWD")
			{
				input_option_date = dj.byId("input_option").getDate();
				input_option_days = dj.byId("input_option").getNumber();
				input_option_period = dj.byId("input_option").getCode();
			}
			else
			{
				input_option_date = "";
				input_option_days = "";
				input_option_period = "";
			}
			
			issuing_bank = dj.byId("issuing_bank_abbv_name").get("value");
		},
		
		/**Ajax Call *****************/
		getRate : function()
		{
			console.debug("[INFO] Begin Ajax call");
			m.xhrPost( {
				url : m.getServletURL("/screen/AjaxScreen/action/TreasuryRequestForQuoteSearchAction"),
				handleAs: "json",
				content : {
					operation: "REQUEST",
					ref_id: ref_id,
					applicant_reference: applicant_reference,
					fx_type: sub_product_code,
					contract_type: contract_type,
					counter_cur_code: counter_cur_code,
					counter_amt: counter_amt,
					fx_cur_code: fx_cur_code,
					fx_amt: fx_amt,
					value_date : input_value_date,
					value_days : input_value_days,
					value_period : input_value_period,
					near_date : input_near_date,
					near_days : input_near_days,
					near_period : input_near_period,
					near_amt : near_amt,
					near_counter_amt : near_counter_amt,
					remarks: remarks,
					option_date : input_option_date,
					option_days : input_option_days,
					option_period : input_option_period,
					debit_act_no : debit_act_no,
					debit_act_desc : debit_act_desc,
					bank : issuing_bank,
					productcode : "FX",
					subproductcode : sub_product_code
				},
				load : function(response, args){
					console.debug("[FxAjaxCall] Ajax call success.");
					dj.byId("loadingDialog").hide();
					var status = response.status;
					console.debug("[FxAjaxCall] Response status is: "+status);
					switch(status){
					case 5:
						_fncGetData(response);
						// Countdown start
						var validity = response.validity;
						m.countDown(validity);
						m.showDetailField();
						break;
					case 6:
						trade_id = response.trade_id;
						rec_id = response.rec_id;
						m.frequencyStore = response.delay_frequency;
						m.opicsFrequencyResponse = response.delay_frequency;
						m.delayStore = response.delay_timeout;
						m.openDelayDialog(m.frequencyStore, m.delayStore);
						break;
					
					default:
						dj.byId("loadingDialog").hide();
						_fncManageErrors(status, response);
						break;
					}
				},
				customError : function(response, args){
					dj.byId("loadingDialog").hide();
					console.error("[create_Fx] error retrieving quote");
					_fncManageErrors(response.status,response);
				}
			});
		},
		
		//call ajax service
		performDelayRequest : function()
		{
			console.debug("[INFO] Ajax call.");
			if(m.frequencyStore>0){
				m.xhrPost( {
					url : m.getServletURL("/screen/AjaxScreen/action/TreasuryRequestForQuoteSearchAction"),
					handleAs: "json",
					content : {
						operation: "DELAY",
						ref_id: ref_id,
						applicant_reference: applicant_reference,
						trade_id : trade_id,
						rec_id : rec_id,
						fx_type: sub_product_code,
						contract_type: contract_type,
						counter_cur_code: counter_cur_code,
						counter_amt: counter_amt,
						fx_cur_code: fx_cur_code,
						fx_amt: fx_amt,
						value_date : input_value_date,
						value_days : input_value_days,
						value_period : input_value_period,
						near_date : input_near_date,
						near_days : input_near_days,
						near_period : input_near_period,
						near_amt : near_amt,
						near_counter_amt : near_counter_amt,
						remarks: remarks,
						option_date : input_option_date,
						option_days : input_option_days,
						option_period : input_option_period,
						bank : issuing_bank,
						productcode : "FX",
						subproductcode : sub_product_code
					},
					load : function(response, args){
						var status = response.status;
						console.debug("[FxAjaxCall] Ajax call success.");
						console.debug("[FxAjaxCall] Response status is:"+status);
						switch (status)
						{
						case 5:
							_fncGetData(response);
							// close the delay dialog
							m.closeDelayDialog();
							// Countdown start
							var validity = response.validity;
							m.countDown(validity);
							m.showDetailField();
							break;
						case 6:
							rec_id = response.rec_id;
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
						console.error("[create_Fx] error retrieving quote");
						_fncManageErrors(response.status,response);
					}
				});
			}
			else
			{
				m.stopCountDown(m.timer);
				m.showContinuationElement();
			}
		},
		
		/** To cancel the request **/
		performCancelDelayRequest : function()
		{
			m.xhrPost( {
				url : m.getServletURL("/screen/AjaxScreen/action/TreasuryRequestForQuoteSearchAction"),
				handleAs: "json",
				content : {
					operation: "CANCEL",
					ref_id: ref_id,
					applicant_reference: applicant_reference,
					trade_id : trade_id,
					rec_id : rec_id,
					fx_type: sub_product_code,
					contract_type: contract_type,
					counter_cur_code: counter_cur_code,
					counter_amt: counter_amt,
					fx_cur_code: fx_cur_code,
					fx_amt: fx_amt,
					value_date : input_value_date,
					value_days : input_value_days,
					value_period : input_value_period,
					near_date : input_near_date,
					near_days : input_near_days,
					near_period : input_near_period,
					near_amt : near_amt,
					near_counter_amt : near_counter_amt,
					remarks: remarks,
					option_date : input_option_date,
					option_days : input_option_days,
					option_period : input_option_period,
					bank : issuing_bank,
					productcode : "FX",
					subproductcode : sub_product_code
				},
				load : function(response, args){
					var status = response.status;
					console.debug("[FxAjaxCall] Ajax call success.");
					console.debug("[FxAjaxCall] Response status is:"+status);
					switch (status)
					{
						case 7:
							// confirmation popup
							m.dialog.show("CUSTOM-NO-CANCEL", m.getLocalization("confirmationCancelRequest"), m.getLocalization("confirmationCancelTitle"));
							break;
						default:
							_fncManageErrors(status, response);
							break;
					}
				},
				customError : function(response, args){
					console.info("[create_Fx] error retrieving quote");
					m.dialog.show("ERROR", m.getLocalization("technicalError"));
					_fxToggleEnableFields();
				}
			});
		},
		
		/** To cancel the request **/
		cancelRequest : function()
		{
			dj.byId("buttonAcceptRequest").set("disabled", false);
			m.xhrPost( {
				url : m.getServletURL("/screen/AjaxScreen/action/TreasuryRequestForQuoteSearchAction"),
				handleAs: "json",
				content : {
					operation: "REJECT",
					ref_id: ref_id,
					applicant_reference: applicant_reference,
					trade_id : trade_id,
					rec_id : rec_id,
					fx_type: sub_product_code,
					contract_type: contract_type,
					counter_cur_code: counter_cur_code,
					counter_amt: counter_amt,
					fx_cur_code: fx_cur_code,
					fx_amt: fx_amt,
					value_date : input_value_date,
					value_days : input_value_days,
					value_period : input_value_period,
					near_date : input_near_date,
					near_days : input_near_days,
					near_period : input_near_period,
					near_amt : near_amt,
					near_counter_amt : near_counter_amt,
					remarks: remarks,
					option_date : input_option_date,
					option_days : input_option_days,
					option_period : input_option_period,
					bank : issuing_bank,
					productcode : "FX",
					subproductcode : sub_product_code
				},
				load : function(response, args){
					var status = response.status;
					if(status == 993){
						_fncManageErrors(status, response);
					}
					//_fxToggleEnableFields();
					_fxToggleEnableReadOnlyFields();
					m.performClearDetails();		
				},
				customError : function(response, args){
					console.info("[create_Fx] error retrieving quote");
					m.dialog.show("ERROR", m.getLocalization("technicalError"));
					_fxToggleEnableFields();
				}
			});
		},
		
		/**
		 * function required by request_action File for request pattern
		 *  Fields to disable during request 
		 **/
		getDisabledFields : function()
		{
			var fieldsToDisable = [
					/* ALL */
					"issuing_bank_customer_reference", "trade_id", 
					"issuing_bank_abbv_name",
					"input_counter_cur_code", "input_fx_cur_code", 
					"input_fx_amt", "input_counter_amt",
					"input_fx_amt_img", "input_counter_amt_img",
					"contract_type_1", "contract_type_2",
					"dijit_form_Button_2", "dijit_form_Button_3","remarks",
					"request_button","request_clear_button",
					"input_value_period","cust_payment_account_act_name","cust_payment_account_img","entity_img","applicant_name","applicant_address_line_1","applicant_address_line_2","applicant_dom",
					/* ALL except SPOT */
					"input_value",
					/* SWAP */
					"input_near", 
					"input_near_amt", "input_far_amt",
					"input_near_counter_amt","input_far_counter_amt",
					"near_amt_img","far_amt_img",
					"input_option_date","input_option_code","input_option_number","input_value_date","input_value_code","input_value_number"
					/* DELIVERY OPTION */
					];
			return fieldsToDisable;
		},

		/**
		 * function required by request_action File for request pattern
		 * put fields to Enable to renew request if different to fieldtodisable 
		 * **/
		getEnabledFields : function()
		{
			return m.getDisabledFields();
		},

		/**
		 * function required by request_action File for request pattern
		 * put Hidden fields to clear to renew request 
		 * **/
		getHiddenFieldsToClear : function()
		{
			var hiddenFieldsToClear = [
					"fx_cur_code", "fx_amt", "counter_cur_code", "rate",
					"counter_amt", "near_counter_amount", "value_date", "maturity_date", "trader_remarks"];
			return hiddenFieldsToClear;
		},

		/**
		 * function required by request_action File for request pattern
		 * put fields to clear to renew request 
		 * **/
		getFieldsToClear : function()
		{
			var fieldsToClear = [
					/* ALL */
					"trade_id",
					"issuing_bank_abbv_name",
					"input_counter_cur_code", "input_fx_cur_code", 
					"input_fx_amt", "input_counter_amt","remarks",
					"input_option_date","input_option_code",
					/* ALL except SPOT */
					"input_value", 
					/* SWAP */
					"input_near", 
					"input_near_amt", "input_far_amt", "input_value_period",
					"input_near_counter_amt","input_far_counter_amt",
					"cust_payment_account_act_name"
					];
			return fieldsToClear;
		},

		/**
		 * function required by request_action File for request pattern
		 * put Date term fields to clear to renew request 
		 * **/
		getDateTermFieldsToClear : function()
		{
			return ["value", "maturity",
			        /* DELIVERY OPTION */
			        "input_option"];
		},
		
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

		hideOtherCurrency : function()
		{
			//if(sub_product_code === "SWAP") return;
			if(dj.byId("input_fx_amt") && !isNaN(dj.byId("input_fx_amt").get("value")))
			{
				dj.byId("input_counter_amt").set("value","");
				dj.byId("input_counter_amt").set("disabled",true);
				dj.byId("input_counter_amt").set("required", false);
				m.setCurrency("input_fx_cur_code", ["input_fx_amt"]);
				m.amountValidationForZero(dj.byId("input_fx_amt"));
			}
			else if(dj.byId("input_counter_amt") &&  !isNaN(dj.byId("input_counter_amt").get("value")))
			{
				dj.byId("input_fx_amt").set("value","");
				dj.byId("input_fx_amt").set("disabled",true);
				dj.byId("input_fx_amt").set("required", false);
				m.setCurrency("input_counter_cur_code", ["input_counter_amt"]);
				m.amountValidationForZero(dj.byId("input_counter_amt"));
			}
			else
			{
				dj.byId("input_counter_amt").set("disabled",false);
				dj.byId("input_fx_amt").set("disabled",false);
				dj.byId("input_counter_amt").set("required", true);
				dj.byId("input_fx_amt").set("required", true);
			}
		},
		hideOtherswapCurrency : function()
		{
			 if(dj.byId("input_near_amt") &&  !isNaN(dj.byId("input_near_amt").get("value")))
			{
				dj.byId("input_near_counter_amt").set("value","");
				dj.byId("input_near_counter_amt").set("disabled",true);
				dj.byId("input_near_counter_amt").set("required", false);
				m.setCurrency("input_fx_cur_code", ["input_near_amt"]);
			}
			else if(dj.byId("input_near_counter_amt") &&  !isNaN(dj.byId("input_near_counter_amt").get("value")))
			{
				dj.byId("input_near_amt").set("value","");
				dj.byId("input_near_amt").set("disabled",true);
				dj.byId("input_near_amt").set("required", false);
				m.setCurrency("input_counter_cur_code", ["input_near_counter_amt"]);
			}
			else
			{
				dj.byId("input_near_amt").set("disabled",false);
				dj.byId("input_near_counter_amt").set("disabled",false);
				dj.byId("input_near_amt").set("required", true);
				dj.byId("input_near_counter_amt").set("required", true);
			}
		},
		hideFarswapCurrency : function()
		{
			 
			if(dj.byId("input_far_amt") &&  !isNaN(dj.byId("input_far_amt").get("value")))
			{
				dj.byId("input_far_counter_amt").set("value","");
				dj.byId("input_far_counter_amt").set("disabled",true);
				dj.byId("input_far_counter_amt").set("required", false);
				m.setCurrency("input_fx_cur_code", ["input_far_amt"]);
			}
			else if(dj.byId("input_far_counter_amt") &&  !isNaN(dj.byId("input_far_counter_amt").get("value")))
			{
				dj.byId("input_far_amt").set("value","");
				dj.byId("input_far_amt").set("disabled",true);
				dj.byId("input_far_amt").set("required", false);
				m.setCurrency("input_counter_cur_code", ["input_far_counter_amt"]);
			}
			else
			{
				dj.byId("input_far_amt").set("disabled",false);
				dj.byId("input_far_counter_amt").set("disabled",false);
				dj.byId("input_far_amt").set("required", true);
				dj.byId("input_far_counter_amt").set("required", true);
			}
		},
		//Amount Validation for Zero Amount
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
		//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
		// Account PopUp
		//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
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
       dojo.require('misys.client.binding.cash.create_fx_client');