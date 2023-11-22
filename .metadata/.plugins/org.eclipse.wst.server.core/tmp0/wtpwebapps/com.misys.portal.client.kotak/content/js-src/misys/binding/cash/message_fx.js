dojo.provide("misys.binding.cash.message_fx");

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
dojo.require("misys.form.DateTermField");
dojo.require("misys.form.DateOrTermField");
dojo.require("misys.widget.Collaboration");
dojo.require("misys.binding.cash.common.request_action");
dojo.require("dojo.parser");
dojo.require("dojo.date");


(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {
	
	
	/**
	  * Validation for Reauthentication 
	 */
	d.mixin(m._config, {

		initReAuthParams : function() {

			var reAuthParams = {
				productCode : 'FX',
				subProductCode : dj.byId("sub_product_code") ? dj.byId("sub_product_code").get("value") : "",
				transactionTypeCode : "13",
				entity :dj.byId("entity") ? dj.byId("entity").get("value") : "",
				currency : '',
				amount : '',				
				es_field1 : '',
				es_field2 : ''
			};
			return reAuthParams;
		}
	});
	
	// insert private functions & variables

	//Mandatory fields required based on user operation. eg : Cancel => only "reason" is mandatory)
	var tabIdRequiredSplit = ["input_split_value","input_split_amt","select_split_cur_code_CCY","select_split_cur_code_CTR_CCY"];
	var tabIdRequiredExtend = ["input_extend_value"];
	var tabIdRequiredUptake = ["input_uptake_value"];
	var tabIdRequiredTakedown = ["input_takedown_value","input_takedown_amt"];
	var tabIdRequiredPaymentSplit = ["input_takedown_amt"];

	var trade_id,
		rec_id,
		applicant_reference,
		original_deal_id,
		fx_type,
		contract_type,
		counter_cur_code,
		fx_action,
		fx_amt,
		fx_cur_code,
		remarks,
		input_value_date,
		input_value_days,
		input_value_period,
		input_near_date,
		input_near_days,
		input_near_period,
		near_amt,
		input_option_date,
		input_option_days,
		input_option_period,
		sub_tnx_type_code,
		fx_ref_id,
		fx_bo_ref_id,
		fx_contract_type,
		org_fx_amt,
		org_fx_cur_code,
		org_counter_amt,
		org_counter_cur_code,
		org_rate,
		org_maturity_date;
		
		

	/**
	 * Variables for Update functions (SPLIT, EXTEND, UPTAKE)
	 * 
	 * **/
	_fncInitUpdateVar = function(){
		fx_ref_id = dj.byId("ref_id").get("value");
		fx_bo_ref_id = dj.byId("bo_ref_id").get("value");
		fx_contract_type = dj.byId("contract_type").get("value");
		org_fx_amt = dj.byId("org_fx_amt").get("value");
		org_fx_cur_code = dj.byId("org_fx_cur_code").get("value");
		org_counter_amt = dj.byId("org_counter_amt").get("value");
		org_counter_cur_code = dj.byId("org_counter_cur_code").get("value");
		org_rate = dj.byId("org_rate").get("value");
		org_maturity_date = dj.byId("org_maturity_date").get("value");
	};
		
	_fncToggleAction = function(selectedValue)
	{	

		// specific details for split on rate response
		
		sub_tnx_type_code = selectedValue;
		
		//SPLIT
		if (selectedValue === "34")
		{	
			fx_action = "SPLIT";
			_fncEnableRequiredFields(tabIdRequiredSplit);
			_fncDisabledRequiredFields(tabIdRequiredExtend);
			_fncDisabledRequiredFields(tabIdRequiredUptake);
			_fncDisabledRequiredFields(tabIdRequiredTakedown);
			m.animate("fadeIn", d.byId("split-details"));
			m.animate("fadeIn", d.byId("request-button"));
			m.animate("fadeIn", d.byId("split-trade-details"));
			m.animate("fadeOut", d.byId("extend-details"));
			m.animate("fadeOut", d.byId("submit-button"));
			m.animate("fadeOut", d.byId("uptake-details"));
			m.animate("fadeOut", d.byId("takedown-details"));
		}
		//EXTEND
		else if (selectedValue === "33")
		{	
			fx_action = "EXTEND";
			_fncDisabledRequiredFields(tabIdRequiredSplit);
			_fncEnableRequiredFields(tabIdRequiredExtend);
			_fncDisabledRequiredFields(tabIdRequiredUptake);
			_fncDisabledRequiredFields(tabIdRequiredTakedown);
			m.animate("fadeIn", d.byId("extend-details"));
			m.animate("fadeIn", d.byId("request-button"));
			m.animate("fadeOut", d.byId("uptake-details"));
			m.animate("fadeOut", d.byId("split-details"));
			m.animate("fadeOut", d.byId("split-trade-details"));
			m.animate("fadeOut", d.byId("submit-button"));
			m.animate("fadeOut", d.byId("takedown-details"));
		}
		//UPTAKE
		else if (selectedValue === "32")
		{
			fx_action = "UPTAKE";
			_fncDisabledRequiredFields(tabIdRequiredSplit);
			_fncDisabledRequiredFields(tabIdRequiredExtend);
			_fncEnableRequiredFields(tabIdRequiredUptake);
			_fncDisabledRequiredFields(tabIdRequiredTakedown);
			m.animate("fadeIn", d.byId("uptake-details"));
			m.animate("fadeIn", d.byId("request-button"));
			m.animate("fadeOut", d.byId("split-details"));
			m.animate("fadeOut", d.byId("split-trade-details"));
			m.animate("fadeOut", d.byId("extend-details"));
			m.animate("fadeOut", d.byId("submit-button"));
			m.animate("fadeOut", d.byId("takedown-details"));
		}
		//TAKEDOWN
		else if (selectedValue === "31")
		{
			fx_action = "TAKEDOWN";
			_fncDisabledRequiredFields(tabIdRequiredSplit);
			_fncDisabledRequiredFields(tabIdRequiredExtend);
			_fncDisabledRequiredFields(tabIdRequiredUptake);
			_fncEnableRequiredFields(tabIdRequiredTakedown);
			m.animate("fadeOut", d.byId("uptake-details"));
			m.animate("fadeOut", d.byId("split-details"));
			m.animate("fadeOut", d.byId("split-trade-details"));
			m.animate("fadeOut", d.byId("extend-details"));
			m.animate("fadeOut", d.byId("request-button"));
			m.animate("fadeOut", d.byId("payment_split_legend"));
			m.animate("fadeIn", d.byId("takedown_legend"));
			m.animate("fadeIn", d.byId("takedown-details"));
			m.animate("fadeIn", d.byId("submit-button"));
		}
		//PAYMENT SPLIT
		else if (selectedValue === "93")
		{
			fx_action = "TAKEDOWN";//same behavior
			var payment_split_value_date = dojo.date.locale.parse(dj.byId("value_date").get("value"), {"locale":dojo.locale, "selector":"date"});
			_fncDisabledRequiredFields(tabIdRequiredSplit);
			_fncDisabledRequiredFields(tabIdRequiredExtend);
			_fncDisabledRequiredFields(tabIdRequiredUptake);
			_fncDisabledRequiredFields(tabIdRequiredTakedown);
			_fncEnableRequiredFields(tabIdRequiredPaymentSplit);			
			dj.byId("input_takedown_value_date").set("value", payment_split_value_date);
			m.animate("fadeOut", d.byId("input_takedown_value_row"));
			m.animate("fadeOut", d.byId("uptake-details"));
			m.animate("fadeOut", d.byId("split-details"));
			m.animate("fadeOut", d.byId("split-trade-details"));
			m.animate("fadeOut", d.byId("extend-details"));
			m.animate("fadeOut", d.byId("request-button"));
			m.animate("fadeOut", d.byId("takedown_legend"));
			m.animate("fadeIn", d.byId("payment_split_legend"));
			m.animate("fadeIn", d.byId("takedown-details"));
			m.animate("fadeIn", d.byId("submit-button"));
		}
		else
		{	
			m.animate("fadeOut", d.byId("split-details"));
			m.animate("fadeOut", d.byId("split-trade-details"));
			m.animate("fadeOut", d.byId("submit-button"));
			m.animate("fadeOut", d.byId("takedown-details"));
			m.animate("fadeOut", d.byId("uptake-details"));
			m.animate("fadeOut", d.byId("extend-details"));
			m.animate("fadeOut", d.byId("payment-split-details"));
			m.animate("fadeOut", d.byId("request-button"));
			//default form
			_fncDisabledRequiredFields(tabIdRequiredSplit);
			_fncDisabledRequiredFields(tabIdRequiredExtend);
			_fncDisabledRequiredFields(tabIdRequiredUptake);
			_fncDisabledRequiredFields(tabIdRequiredTakedown);
		}
		
	};


	_fncEnableRequiredFields = function(/*fields*/fields)
	{
		var fieldsToEnable = fields;
		d.forEach(fieldsToEnable, function(id){
			var field = dj.byId(id);
			if(field)
			{	m.toggleRequired(field,true);
			field.set("disabled", false);
			}
		});
	};

	/* Fields to disable during request */
	_fncDisabledRequiredFields = function(/*fields*/fields)
	{
		var fieldsToDisable = fields;

		d.forEach(fieldsToDisable, function(id){
			var field = dj.byId(id);
			if(field)
			{
				field.set("disabled", true);
			}
		});
	};

	_fncValidateAmount = function(/*Boolean*/ isFocused, /*Widget*/ theObj, /*String*/ productCode,/*String*/ orgAmountField )
	{
		//  summary:
		//       Validates the amendment amount.
		//  description:
		//        Format the eventual increase/decrease of amount, set the transaction amount
		//        and compute the new LC amount.
		//  tags:
		//       public, validation

		theObj.invalidMessage = theObj.messages.invalidMessage;
		if(!theObj.validator(theObj.get("value"), theObj.constraints)){
			return false;
		}

		// Validate only when the field is onfocussed or focussed but in error
		var isValid = (theObj.state === "Error") ? false : true;
		if(false === isFocused || (true === isFocused && !isValid)){
			console.debug("[Validate] Validating Amendment Amount, Value = " + theObj.get("value"));

			isValid = true;
			var fieldId = theObj.id;
			var orgAmtVal = d.number.parse(dj.byId(orgAmountField).get("value"));

			var decValue = theObj.get("value");
				if(!isNaN(decValue))
				{
					if((orgAmtVal - decValue) < 0)
					{
						theObj.invalidMessage = m.getLocalization("amendAmountLessThanOriginalError");
						isValid = false;
					}
				}
		}
		return isValid;
	};
	
	
	/** Function for putting data in page elements **/
	_fncGetData = function(/*JSON*/ response)
	{
		d.query("#trade_id_report_row .content")[0].innerHTML = response.trade_id;
		d.query("#org_amount_report_row .content")[0].innerHTML = response.amount;
		d.query("#org_ctr_amount_report_row .content")[0].innerHTML = response.counter_amount;
		d.query("#amount_report_row .content")[0].innerHTML = response.updateAmount;
		d.query("#ctr_amount_report_row .content")[0].innerHTML = response.updateCounterAmount;
		d.query("#rate_report_row .content")[0].innerHTML = response.updateRate;
		d.query("#value_date_report_row .content")[0].innerHTML = response.value_date;
		
		
		dj.byId("trade_id").set("value", response.trade_id);
		dj.byId("rec_id").set("value", response.rec_id);
		dj.byId("remarks").set("value", response.remarks);
		
		trade_id = response.trade_id;
		rec_id = response.rec_id;
		
		// hidden fields
		dj.byId("tnx_ctr_amount").set("value", response.updateCounterAmount);
		dj.byId("rate").set("value", response.rate);
		dj.byId("value_date").set("value", response.value_date);
		
	};

	/** Handle errors and display dialog **/
	// TODO Continue error management 
	_fncManageErrors = function(/*String*/ type, /* JSON */ response){
		var messageError = "";
		var param;
		switch(type){
		case 3:
			messageError = m.getLocalization("errorFXRateRejected");
			break;
		case 28:
			messageError = m.getLocalization("errorFXRateNoLongerValid");
			break;
		case 29:
			messageError = m.getLocalization("errorFXUnknownCurrency");
			break;
		case 30:
			messageError = m.getLocalization("errorFXUnknownCounterCurrency", [response.conter_currency]);
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
			messageError = m.getLocalization("errorFXCounterCurrencyDateNotValid");
			break;
		default:
			messageError = m.getCommonMessageError(type, response);
			break;
		}
		console.debug("[INFO] Error (on status "+type+") : "+messageError);
		m.dialog.show("ERROR", messageError);
		m.performClear();
		m.animate("fadeIn", d.byId("request-button"));
	};
	
//	_setTakeDownAmountConstraints = function()
//	{
//		var tkdccy = dj.byId("input_takedown_cur_code");
//		var tkdamt = dj.byId("input_takedown_amt");
//		var fxccy = dj.byId("fx_cur_code");
//		
//		if (tkdccy.get("value") === fxccy.get("value")) {
//			var fxamt = dj.byId("fx_amt");
//			console.debug("fx_amt: " + fxamt.get("value"));
//			tkdamt.set("constraints", {min: 0.01, max: d.number.parse(fxamt.get("value"))});
//		} else {
//			var ctramt = dj.byId("counter_amt");
//			console.debug("counter_amt: " + ctramt.get("value"));
//			tkdamt.set("constraints", {min: 0.01, max: d.number.parse(ctramt.get("value"))});
//		}
//	};
	
	_setDateTermNumberAndCode = function () {
		dijit.byId("input_takedown_value_number").set("value",dijit.byId("input_takedown_value").getNumber());
		dijit.byId("input_takedown_value_code").set("value",dijit.byId("input_takedown_value").getCode());
	};
	
	_validateinputtakedownamt = function(){
		var displayMessage;
		var orgFxAmt = dojo.number.parse(dj.byId("org_fx_amt").get("value"));
		var inputTakedownAmt = dj.byId("input_takedown_amt").get("value");	
			if(inputTakedownAmt > orgFxAmt)
			{
				if(dojo.number.parse(dj.byId('sub_tnx_type_code').get('value')) === 31){
					displayMessage = m.getLocalization("drawdownamountvalidation");
				}
				else{
					displayMessage = m.getLocalization("paymentsplitvalidation");
				}
				dj.byId("input_takedown_amt").set("state","Error");
		 		dj.hideTooltip(dj.byId("input_takedown_amt").domNode);
		 		dj.showTooltip(displayMessage, dj.byId("input_takedown_amt").domNode, 0);
				return false;
				
			}
			
			else if(inputTakedownAmt === 0 ){
				displayMessage = m.getLocalization("amountcannotzero");
				dj.byId("input_takedown_amt").set("state","Error");
		 		dj.hideTooltip(dj.byId("input_takedown_amt").domNode);
		 		dj.showTooltip(displayMessage, dj.byId("input_takedown_amt").domNode, 0);
				return false;
			}
			return true;
	};
	
	// Public functions & variables follow
	d.mixin(m, {
		bind : function() {
			//
			// Validation Events
			//


			//action linked to Actions SelectBox  
			m.connect("sub_tnx_type_code", "onChange", function(){
				_fncToggleAction(this.get("value"));
			});
			
			//Currency selection
			m.connect("select_split_cur_code_CCY", "onChange", function(){
				if (dj.byId("select_split_cur_code_CCY").checked)
				{
					dj.byId("input_split_cur_code").set("value",dj.byId("fx_cur_code").get("value"));	
				}
				else
				{
					dj.byId("input_split_cur_code").set("value",dj.byId("counter_cur_code").get("value"));	
				}
			});

			// Takedown date type
			//m.connect("input_takedown_value", "onChange", _setDateTermNumberAndCode);
			//m.connect("input_takedown_value_number", "onChange", _setDateTermNumberAndCode);
			
			// Takedown Amount Validation
//			Disable selection of Takedown amt
//			m.connect("input_takedown_cur_code", "onChange", _setTakeDownAmountConstraints);
			
			//Amount Validation
			m.setValidation("input_split_amt", function(isFocused){
				if (dj.byId("select_split_cur_code_CCY").checked){
					return _fncValidateAmount(isFocused, this, "fx","fx_amt");	
				}
				else {
					return _fncValidateAmount(isFocused, this, "fx","counter_amt");	
				}
				
			});
			
			// action linked to request buttons
			m.connect("cancelDelayDialogButton", "onClick", m.performClear("delayDialog"));
			m.connect("buttonAcceptRequest", "onClick", m.acceptRate);
			m.connect("buttonCancelRequest", "onClick", m.performCancelRequest);

//			m.setValidation("input_split_value_date", function(){
//				return m.validateDate("input_split_value", "", "DateLessThanDateOfDayError", false);
//			});
			m.setValidation("input_extend_value_date", function(){
				return /*m.validateDate("input_extend_value", "", "DateLessThanDateOfDayError", false)&&*/ m.validateDate("input_extend_value", "original_value_date", "valueDateGreaterThanOrgValueDate", false);
			});
			
			m.setValidation("input_uptake_value_date", function(){
				return /*m.validateDate("input_uptake_value", "", "DateLessThanDateOfDayError", false)&& */m.validateDate("input_split_value", "original_value_date", "valueDateGreaterThanOrgValueDate", true);
			});
			
			m.setValidation("input_takedown_value_date", function(){
				return m.validateDate("input_takedown_value", "", "DateLessThanDateOfDayError", false)&& m.validateDate("input_takedown_value", "original_value_date", "valueDateGreaterThanOrgValueDate", true) && m.validateDate("input_takedown_value", "option_date", "valueDateSmallerThanOptionDate", false);
			});
			
			m.setValidation("input_takedown_value_number", function(){
				return m.validateTermNumber("input_takedown_value", "", "TermCodeError", false);
			});
			
			m.setValidation("input_split_remarks", m.validateAlphaNumericRemarks);
			m.setValidation("input_uptake_remarks", m.validateAlphaNumericRemarks);
			m.setValidation("input_extends_remarks", m.validateAlphaNumericRemarks);
			m.setValidation("input_takedown_remarks", m.validateAlphaNumericRemarks);
			m.connect("input_takedown_amt", "onBlur", _validateinputtakedownamt);  
			
		},
		onFormLoad : function() {
			//  summary:
			//          Events to perform on page load.
			//  tags:
			//         public
		

			//Disable loadingDialog/waitingDialog closing by using the escape key
			m.fncDisableLoadingDialogClosing();

			//load default forms
			_fncToggleAction( dj.byId("sub_tnx_type_code").get("value"));

			// init constraints on takedown amount
//			_setTakeDownAmountConstraints();
			m.setCurrency(dj.byId("input_takedown_cur_code"), ["input_takedown_amt"]);
		},
		
		performRequest : function()
		{
			if(m.checkFields()) 
			{
				m.doPerformRequest();
				m.animate("fadeOut", d.byId("request-button"));
			}
		},
		
		/** to init local variables **/
		initVar : function()
		{
			applicant_reference = dj.byId("applicant_reference").get("value");

			original_deal_id = dj.byId("bo_ref_id").get("value");

			fx_type = "FORWARD";
			contract_type = dj.byId("contract_type").get("value");
			counter_cur_code = dj.byId("counter_cur_code").get("value");
			
			//specific split
			if (fx_action=="SPLIT"){
				
				_fncInitUpdateVar();
				if (dj.byId("select_split_cur_code_CCY").checked)
				{
					fx_cur_code = dj.byId("fx_cur_code").get("value");	
				}
				else
				{
					fx_cur_code = dj.byId("counter_cur_code").get("value");	
				}
				fx_amt = dj.byId("input_split_amt").get("value");
				remarks = dj.byId("input_split_remarks").get("value");
				input_value_date = dj.byId("input_split_value").getDate();
				input_value_days = dj.byId("input_split_value").getNumber();
				input_value_period = dj.byId("input_split_value").getCode();
			}
			//specific extend
			else if (fx_action=="EXTEND"){
				_fncInitUpdateVar();
				fx_cur_code = dj.byId("fx_cur_code").get("value");
				remarks = dj.byId("input_extends_remarks").get("value");
				fx_amt = dj.byId("fx_amt").get("value");
				input_value_date = dj.byId("input_extend_value").getDate();
				input_value_days = dj.byId("input_extend_value").getNumber();
				input_value_period = dj.byId("input_extend_value").getCode();
			}
			else if (fx_action=="UPTAKE"){
				_fncInitUpdateVar();
				fx_cur_code = dj.byId("fx_cur_code").get("value");
				remarks = dj.byId("input_uptake_remarks").get("value");
				fx_amt = dj.byId("fx_amt").get("value");
				input_value_date = dj.byId("input_uptake_value").getDate();
				input_value_days = dj.byId("input_uptake_value").getNumber();
				input_value_period = dj.byId("input_uptake_value").getCode();
			}
			else if (fx_action=="TAKEDOWN"){
				_fncInitUpdateVar();
				fx_cur_code = dj.byId("input_takedown_cur_code").get("value");
				remarks = dj.byId("input_takedown_remarks").get("value");
				fx_amt = dj.byId("input_takedown_amt").get("value");
				input_value_date = dj.byId("input_takedown_value").getDate();
				input_value_days = dj.byId("input_takedown_value").getNumber();
				input_value_period = dj.byId("input_takedown_value").getCode();
			}
		},
		
		
		/**Ajax Call *****************/
		
		/**
		 * Request fonction 
		 * fill content object with field information to send in request
		 * replace TD by your product code in error message
		 */
		
		getRate : function()
		{
			console.debug("[INFO] Begin Ajax \"Get Rate\" call");
			m.xhrPost( {
				url : m.getServletURL("/screen/AjaxScreen/action/RequestForQuoteSearchActionFX"),
				handleAs: "json",
				content : {
					operation : "REQUESTUPDATE",
					applicant_reference : applicant_reference,
					original_deal_id : original_deal_id,
					ref_id : fx_ref_id,
					bo_ref_id : fx_bo_ref_id,
					fx_contract_type : fx_contract_type,
					sub_tnx_type_code : sub_tnx_type_code,
					fx_amt : fx_amt,
					fx_cur_code : fx_cur_code,
					remarks: remarks,
					value_date : input_value_date,
					value_days : input_value_days,
					value_period : input_value_period,
					//////////
					fx_type: fx_type,
					contract_type: contract_type,
					counter_cur_code: counter_cur_code,
					org_fx_cur_code: org_fx_cur_code,
					org_fx_amt: org_fx_amt,
					org_counter_cur_code: org_counter_cur_code,
					org_counter_amt: org_counter_amt,
					org_rate: org_rate,
					org_maturity_date: org_maturity_date
					///////////
				},
				load : function(response, args){
					console.debug("[INFO] Ajax call success.");
					dj.byId("loadingDialog").hide();
					var status = response.status;
					console.debug("[INFO] Response status is:"+status);
					switch(status){
					case 5:
						_fncGetData(response);
						// Countdown start
						validity = response.validity;
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
						_fncManageErrors(status,response);
						break;
					}
				},
				customError : function(response, args){
					dj.byId("loadingDialog").hide();
					console.error("[FXMessageAjaxCall] error retrieving quote");
					_fncManageErrors("",response);
				}
			});
		},
		//call ajax service
		performDelayRequest : function()
		{
			console.debug("[INFO] Ajax call.");
			if(m.frequencyStore>0){
				m.xhrPost( {
					url : m.getServletURL("/screen/AjaxScreen/action/RequestForQuoteSearchActionFX"),
					handleAs: "json",
					content : {
						operation: "DELAY",
						ref_id : fx_ref_id,
						applicant_reference : applicant_reference,
						rec_id : rec_id,
						fx_amt: fx_amt,
						fx_cur_code: fx_cur_code,
						sub_tnx_type_code : sub_tnx_type_code,
						remarks: remarks,
						value_date : input_value_date,
						value_days : input_value_days,
						value_period : input_value_period,
						trade_id : trade_id,
						//////////
						fx_type: fx_type,
						contract_type: contract_type,
						counter_cur_code: counter_cur_code
						///////////
					},
					load : function(response, args){
						var status = response.status;
						console.debug("[TdAjaxCall] Ajax call success.");
						console.debug("[TdAjaxCall] Response status is:"+status);
						switch (status)
						{
						case 5:
							_fncGetData(response);
							// close the delay dialog
							m.closeDelayDialog();
							// Countdown start
							validity = response.validity;
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
						console.error("[FXMessageAjaxCall] error retrieving quote");
						_fncManageErrors("", response);
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
				url : m.getServletURL("/screen/AjaxScreen/action/RequestForQuoteSearchActionFX"),
				handleAs: "json",
				content : {
					operation: "CANCEL",
					ref_id : fx_ref_id,
					applicant_reference: dj.byId("applicant_reference").get("value"),
					trade_id : trade_id,
					rec_id : rec_id,
					fx_type: fx_type,
					contract_type: contract_type,
					counter_cur_code: counter_cur_code,
					fx_cur_code: fx_cur_code,
					fx_amt: fx_amt,
					value_date : input_value_date,
					value_days : input_value_days,
					value_period : input_value_period,
					near_date : input_near_date,
					near_days : input_near_days,
					near_period : input_near_period,
					near_amt : near_amt,
					remarks: remarks,
					option_date : input_option_date,
					option_days : input_option_days,
					option_period : input_option_period
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
					console.info("[TradeCreateFxBinding] error retrieving quote");
					m.dialog.show("ERROR", m.getLocalization("technicalError"));
					m.performClear();
				}
			});
		},
		/** To cancel the request **/
		cancelRequest : function()
		{
			dj.byId("buttonAcceptRequest").set("disabled", false);
			m.xhrPost( {
				url : m.getServletURL("/screen/AjaxScreen/action/RequestForQuoteSearchActionFX"),
				handleAs: "json",
				content : {
					operation: "CANCEL",
					ref_id : fx_ref_id,
					applicant_reference: dj.byId("applicant_reference").get("value"),
					trade_id : trade_id,
					rec_id : rec_id,
					fx_amt: fx_amt,
					fx_cur_code: fx_cur_code,
					value_date : input_value_date,
					value_days : input_value_days,
					value_period : input_value_period
				},
				load : m.performClear,
				customError : function(response, args){
					console.error("[FXMessageAjaxCall] error retrieving quote");
					m.dialog.show("ERROR", m.getLocalization("technicalError"));
					m.performClear();
				}
			});
		},
		/**
		 * function required by RequestAction File for request pattern
		 *  Fields to disable during request 
		 **/
		getDisabledFields : function()
		{
			var fieldsToDisable = [
					"issuing_bank_customer_reference", "trade_id", 
					"issuing_bank_abbv_name",
					"input_split_value","input_split_amt",
					"input_extend_value","input_uptake_value","input_takedown_value",
					"select_takedown_cur_code","select_split_cur_code",
					"input_takedown_amt","input_split_remarks",
					"input_extends_remarks","input_takedown_remarks",
					"input_uptake_remarks",
					"request_button","request_clear_button",
					"dijit_form_Button_2", "dijit_form_Button_3"];
			return fieldsToDisable;
		},
		
		/**
		 * function required by RequestAction File for request pattern
		 * put fields to Enable to renew request if different to fieldtodisable 
		 * **/
		getEnabledFields : function()
		{
			return m.getDisabledFields();
		},

		/**
		 * function required by RequestAction File for request pattern
		 * put Hidden fields to clear to renew request 
		 * **/
		getHiddenFieldsToClear : function()
		{
			var hiddenFieldsToClear = [];
			return hiddenFieldsToClear;
		},

		/**
		 * function required by RequestAction File for request pattern
		 * put fields to clear to renew request 
		 * **/
		getFieldsToClear : function()
		{
			var fieldsToClear = [
					"trade_id","input_split_amt","select_takedown_cur_code",
					"select_split_cur_code","input_takedown_amt","input_split_remarks", 
					"input_extends_remarks","input_uptake_remarks","input_takedown_remarks"];
			return fieldsToClear;
		},

		/**
		 * function required by RequestAction File for request pattern
		 * put Date term fields to clear to renew request 
		 * **/
		getDateTermFieldsToClear : function()
		{
			var datefieldsToClear = [
					"input_split_value_date", "input_split_value_code","input_extend_value_date", "input_extend_value_code",
					"input_uptake_value_date", "input_uptake_value_code","input_takedown_value_date", "input_takedown_value_code", "input_takedown_value_number"];
			return datefieldsToClear;
		}
		
	});
})(dojo, dijit, misys);


//Including the client specific implementation
       dojo.require('misys.client.binding.cash.message_fx_client');