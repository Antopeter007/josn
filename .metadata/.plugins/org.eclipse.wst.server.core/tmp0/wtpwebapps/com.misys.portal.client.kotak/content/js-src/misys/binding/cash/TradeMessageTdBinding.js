dojo.provide("misys.binding.cash.TradeMessageTdBinding");
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

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {
	
	
	/**
	  * Validation for Reauthentication 
	 */
	d.mixin(m._config, {

		initReAuthParams : function() {

			var reAuthParams = {
				productCode : 'TD',
				subProductCode : dj.byId("sub_product_code")? dj.byId("sub_product_code").get("value"): '',
				transactionTypeCode : '01',
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
	var tabIdRequiredRollover = ["input_maturity"];
	var tabIdRequiredReversal = ["reversal_reason"];
	var tabIdRequiredRebook = ["rebook_input_value","rebook_input_maturity",
			"rebook_reason","rebook_input_td_amt","rebook_input_td_cur_code"];

	var applicant_reference,
		rec_id,
		ref_id,
		original_trade_id,
		td_type,
		interest_capitalisation,
		remarks,
		td_cur_code,
		td_amt,
		inc_amt,
		dec_amt,
		input_maturity_date,
		input_maturity_days,
		input_maturity_period,
		input_value_date,
		input_value_days,
		input_value_period,
		reason;
	
	
	 _fncToggleAction= function(selectedValue){	
		
		td_type = selectedValue;
		
		if ("ROLLOVER" === selectedValue.toUpperCase())
		{	
			//Rollover form
			_fncEnableRequiredFields(tabIdRequiredRollover);
			_fncDisabledRequiredFields(tabIdRequiredReversal);
			_fncDisabledRequiredFields(tabIdRequiredRebook);
			m.animate("fadeIn", d.byId("rollover-details"));
			m.animate("fadeIn", d.byId("request-button"));
			m.animate("fadeOut", d.byId("reverse-details"));
			m.animate("fadeOut", d.byId("rebook-details"));
			m.animate("fadeOut", d.byId("submit-button"));
		}
		else if ("REVERSE" === selectedValue.toUpperCase())
		{	
			//REVERSE form
			_fncDisabledRequiredFields(tabIdRequiredRollover);
			_fncEnableRequiredFields(tabIdRequiredReversal);
			_fncDisabledRequiredFields(tabIdRequiredRebook);
			m.animate("fadeIn", d.byId("reverse-details"));
			m.animate("fadeIn", d.byId("submit-button"));
			m.animate("fadeOut", d.byId("rollover-details"));
			m.animate("fadeOut", d.byId("rebook-details"));
			m.animate("fadeOut", d.byId("request-button"));
		}
		else if ("REBOOK" === selectedValue.toUpperCase())
		{
			//REBOOK form
			_fncDisabledRequiredFields(tabIdRequiredRollover);
			_fncDisabledRequiredFields(tabIdRequiredReversal);
			_fncEnableRequiredFields(tabIdRequiredRebook);
			m.animate("fadeIn", d.byId("rebook-details"));
			m.animate("fadeIn", d.byId("request-button"));
			m.animate("fadeOut", d.byId("rollover-details"));
			m.animate("fadeOut", d.byId("reverse-details"));
			m.animate("fadeOut", d.byId("submit-button"));
		}
		else
		{	
			m.animate("fadeOut", d.byId("rollover-details"));
			m.animate("fadeOut", d.byId("reverse-details"));
			m.animate("fadeOut", d.byId("rebook-details"));
			m.animate("fadeOut", d.byId("submit-button"));
			m.animate("fadeOut", d.byId("request-button"));
			//default form
			_fncDisabledRequiredFields(tabIdRequiredRollover);
			_fncDisabledRequiredFields(tabIdRequiredReversal);
			_fncDisabledRequiredFields(tabIdRequiredRebook);
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

	_fncTDCalculateNewAmt = function(/*Widget*/ theObj){
		//  summary:
		//        Calculate the new amt.
		//  tags:
		//        private
		var amt = dj.byId( "rollover_td_amt");
		var orgAmt = dj.byId("org_reminder_td_amt");
		var orgAmtWithInterest = dojo.number.parse(dj.byId("total_with_interest").get("value"));
		var orgAmtValue = !isNaN(orgAmt.get("value")) ? orgAmt.get("value") : 0;
		
		
		if (dj.byId("interest_capitalisation_Y").checked){
			orgAmtValue = !isNaN(orgAmtWithInterest) ? orgAmtWithInterest : 0;
		}
		// Check that the values are a number
	
		var amendAmtValue = !isNaN(theObj.get("value")) ? theObj.get("value") : 0;

		if(theObj.id == "inc_amt"){
			console.debug("[FormEvents] Incrementing amount from " + amt.get("value") + " to " + (orgAmtValue + amendAmtValue));
			amt.set("value", orgAmtValue + amendAmtValue);
			m.setTnxAmt(amendAmtValue);
		} 
		else 
		{
			// Decrement or restore
			if(amendAmtValue <= orgAmtValue)
			{
				console.debug("[FormEvents] Changing amount from " + amt.get("value") + " to " + (orgAmtValue - amendAmtValue));
				amt.set("value", orgAmtValue - amendAmtValue);
				m.setTnxAmt(amendAmtValue);
			}
		}
	};

	_fncTDAmendIncAmt = function(/*Widget*/ theObj){
		//  summary:
		//        Amend the inc amount
		//  tags:
		//         public

		var otherField = ("inc_amt" == theObj.id) ? dj.byId("dec_amt") : dj.byId("inc_amt");
		if(!isNaN(theObj.get("value")))
		{
			otherField.set("disabled", true);
		} else {
			theObj.set("disabled", false);
			otherField.set("disabled", false);
		}
		m.toggleFields(
				(theObj.get("value") && theObj.get("value") !== ""), 
				null,
				["amd_details"]);
		_fncTDCalculateNewAmt(theObj);
		return _fncTDValidateAmendAmount(true, theObj, null);
	};

	_fncTDValidateAmendAmount = function(/*Boolean*/ isFocused, /*Widget*/ theObj, /*String*/ productCode){
		//  summary:
		//       Validates the amendment amount.
		//  description:
		//        Format the eventual increase/decrease of amount, set the transaction amount
		//        and compute the new LC amount.
		//  tags:
		//       public, validation


		// Validate only when the field is onfocussed or focussed but in error
		var isValid = (theObj.state == "Error") ? false : true;		
		console.debug("[Validate] Validating Amendment Amount, Value = " + theObj.get("value"));

		isValid = true;
		var fieldId = theObj.id;
		var orgAmtVal = d.number.parse(dj.byId("org_reminder_td_amt").get("value"));

		if(fieldId == "inc_amt")
		{
			var incValue = theObj.get("value");
			if(!isNaN(incValue))
			{
				if((incValue + orgAmtVal) > Number.MAX_VALUE)
				{
					displayMessage = m.getLocalization("maximumValueError");
			 		dj.showTooltip(displayMessage, theObj.domNode, 0);
					theObj.set("state","Error");
					isValid = false;
				}
				else if (incValue === 0)
				{
					displayMessage = m.getLocalization("increaseAmtCannotbeZero");
			 		dj.showTooltip(displayMessage, theObj.domNode, 0);
					theObj.set("state","Error");
					isValid = false;
				}
			}
		}
		else if(fieldId == "dec_amt")
		{
			var decValue = theObj.get("value");
			if(!isNaN(decValue))
			{
				if((orgAmtVal - decValue) < 0)
				{
					displayMessage = m.getLocalization("decreaseAmtCannotMoreThanRolloverAmt");
			 		dj.showTooltip(displayMessage, theObj.domNode, 0);
					theObj.set("state","Error");
					isValid = false;
				}
				else if((orgAmtVal - decValue) ===	0)
				{
					displayMessage = m.getLocalization("rollOverAmtCannotbeZero");
			 		dj.showTooltip(displayMessage, theObj.domNode, 0);
					theObj.set("state","Error");
					isValid = false;
				}
				else if (decValue === 0)
				{
					displayMessage = m.getLocalization("decreaseAmtCannotbeZero");
			 		dj.showTooltip(displayMessage, theObj.domNode, 0);
					theObj.set("state","Error");
					isValid = false;
				}
			}
		}
		return isValid;
	};

	m.updateSubTnxTypeCode = function(){
		var subTnxTypeCode = dj.byId("sub_tnx_type_code");
		var incAmtField = dj.byId("inc_amt");
		var decAmtField = dj.byId("dec_amt");
		var amendDetails = dj.byId("amd_details");


		if (dj.byId("td_type").get("value") == "ROLLOVER"){
			if(!isNaN(incAmtField.get("value")))
			{
				subTnxTypeCode.set("value", "26");
			}
			else if(!isNaN(decAmtField.get("value")))
			{
				subTnxTypeCode.set("value", "27");
			}
			else
			{
				subTnxTypeCode.set("value", "28");
			}
		}
		else if (dj.byId("td_type").get("value") == "REVERSE"){
			subTnxTypeCode.set("value", "29");
		}
		else if (dj.byId("td_type").get("value") == "REBOOK"){
			subTnxTypeCode.set("value", "30");
		}
	};

	
	
	/** Function for putting data in page elements **/
	_fncGetData = function(/*JSON*/ response)
	{
		d.query("#trade_id_report_row .content")[0].innerHTML = response.trade_id;
		d.query("#maturity_report_row .content")[0].innerHTML = response.maturity_date;
		d.query("#rate_report_row .content")[0].innerHTML = response.rate;
		d.query("#interest_report_row .content")[0].innerHTML = response.interest;
		
		dj.byId("trade_id").set("value", response.trade_id);
		dj.byId("rec_id").set("value", response.rec_id);
		dj.byId("remarks").set("value", response.remarks);
		dj.byId("reversal_reason").set("value", response.reason);
		
		trade_id = response.trade_id;
		rec_id = response.rec_id;
		
		// hidden fields
		dj.byId("rate").set("value", response.rate);
		dj.byId("maturity_date").set("value", response.maturity_date);
		dj.byId("value_date").set("value", response.value_date);
		dj.byId("td_cur_code").set("value", response.currency);
		dj.byId("td_amt").set("value", response.amount);
		dj.byId("interest").set("value", response.interest);
		
	};

	/** Handle errors and display dialog **/
	// TODO Continue error management 
	_fncManageErrors = function(/*String*/ type, /* JSON */ response){
		var messageError = "";
		switch(type){
		default:
			messageError = m.getCommonMessageError(type, response);
			break;
		}
		console.debug("[INFO] Error (on status "+type+") : "+messageError);
		m.dialog.show("ERROR", messageError, "", function(){
			m.performClear(); return;
		});
		m.performClear();
	};
	
	
	// Public functions & variables follow
	
	d.mixin(m, {
		bind : function() {
		//  summary:
			//            Binds validations and events to fields in the form.              
			//   tags:
			//            public

			//
			// Validation Events
			//
						
			//action linked to Actions SelectBox  
			m.connect("td_type", "onChange", function(){
				_fncToggleAction(this.get("value"));
			});

			// action linked to request buttons
			m.connect("cancelDelayDialogButton", "onClick", m.performClear("delayDialog"));
			m.connect("delayDialog", "onHide", m.closeDelayDialog());
			m.connect("buttonAcceptRequest", "onClick", m.acceptRate);
			m.connect("buttonCancelRequest", "onClick", m.fncPerformCancelRequest);

			m.connect("inc_amt", "onBlur", function(){
				_fncTDAmendIncAmt(this);
			});
			m.connect("dec_amt", "onBlur", function(){
				_fncTDAmendIncAmt(this);
			});
			
			m.connect("interest_capitalisation_Y", "onChange", function(){
				if (dj.byId("inc_amt").getValue()>=0 ){
					_fncTDAmendIncAmt(dj.byId("inc_amt"));
				}
				else {
					_fncTDAmendIncAmt(dj.byId("dec_amt"));
				}
			});
			
			
			// for rollover
			var dateFieldValue = dj.byId("input_value_date").get("value");
			var startDate = d.date.locale.parse(dateFieldValue, {
				selector :"date",
				datePattern : m.getLocalization("g_strGlobalDateFormat")
			});
			console.debug("startdate : "+startDate);
			
			m.setValidation("input_maturity_date", function(){
				return m.validateDate("input_maturity", "input_value_date", "errorUpdateTDMaturityGreaterStartDate", false,startDate);
			});
			// for revere and rebook
			m.setValidation("rebook_input_value_date", function(){
				return /*m.validateDate("rebook_input_value", "", "DateLessThanDateOfDayError", false) && */m.validateDate("rebook_input_value", "rebook_input_maturity", "valueDateGreaterThanMaturityDate", true);
			});
			m.setValidation("rebook_input_maturity_date", function(){
				return m.validateDate("rebook_input_maturity", "rebook_input_value", "maturityDateLessThanValueDate", false) /*&& m.validateDate("rebook_input_maturity", "", "maturityDateLessThanDateOfDate", false)*/;
			});
			
			m.setValidation("input_rebook_remarks", m.validateAlphaNumericRemarks);
			m.setValidation("input_rollover_remarks", m.validateAlphaNumericRemarks);
			
			// Validate input_maturity_number date 
			m.setValidation("input_maturity_number", function(){
				return m.validateTermNumber("input_maturity", "", "TermCodeError", false);
			});
		},
		onFormLoad : function() {
		//  summary:
			//          Events to perform on page load.
			//  tags:
			//         public

			//Disable loadingDialog/waitingDialog closing by using the escape key
			
			//m.disableLoadingDialogClosing();

			//load default forms
			_fncToggleAction( dj.byId("td_type").get("value"));

			
			//init rollover amt
			dj.byId("rollover_td_amt").set("value", dj.byId("td_amt").get("value"));
			
			if(dj.byId("org_reminder_td_amt") && dj.byId("org_reminder_td_amt").get("value") !== "")
			{
				m.setCurrency(dj.byId("org_reminder_td_amt"), ["org_reminder_td_amt"]);
			}	
			if(dj.byId("inc_amt") && dj.byId("inc_amt").get("value") !== "")
			{
				m.setCurrency(dj.byId("inc_amt"), ["inc_amt"]);
			}
			if(dj.byId("dec_amt") && dj.byId("dec_amt").get("value") !== "")
			{
				m.setCurrency(dj.byId("dec_amt"), ["dec_amt"]);
			}
			if(dj.byId("rollover_td_amt") && dj.byId("rollover_td_amt").get("value") !== "")
			{
				m.setCurrency(dj.byId("rollover_td_amt"), ["rollover_td_amt"]);
			}
			
			
			//init Original Total Amount
//			dj.byId("total_td_amt").set("value", (dj.byId("interest_td_amt").get("value")
//			+dj.byId("org_td_amt").get("value")));
		},
		beforeSubmit : function() {
			// Set the sub tnx type code that depends on the type of amendment
			m.updateSubTnxTypeCode();
		},
		
		
		fncPerformRequest : function()
		{
			m.doPerformRequest();
			
		},
		
		initVar : function()
		{
			ref_id = dj.byId("ref_id").get("value");
			
			if (dj.byId("applicant_reference"))
			{
				applicant_reference = dj.byId("applicant_reference").get("value");
			}
			else {
				applicant_reference = "";
			}
			original_trade_id = dj.byId("bo_ref_id").get("value");

			//specific rollover
			if (td_type=="ROLLOVER"){

				if (dj.byId("interest_capitalisation_Y").checked)
				{
					interest_capitalisation = "Y";	
				}
				else
				{
					interest_capitalisation = "N";	
				}
				remarks = dj.byId("input_rollover_remarks").get("value");
				td_cur_code = dj.byId("td_cur_code").get("value");
				td_amt = dj.byId("org_reminder_td_amt").get("value");
				inc_amt = dj.byId("inc_amt").get("value");
				dec_amt = dj.byId("dec_amt").get("value");
				input_maturity_date = dj.byId("input_maturity").getDate();
				input_maturity_days = dj.byId("input_maturity").getNumber();
				input_maturity_period = dj.byId("input_maturity").getCode();
				input_value_date = dj.byId("input_value_date").get("value");
				input_value_days = "" ;
				input_value_period = "";

			}
			//specific rebook
			else if (td_type=="REBOOK"){
				reason = dj.byId("rebook_reason").get("value");
				remarks = dj.byId("input_rebook_remarks").get("value");
				interest_capitalisation = "";
				td_cur_code = dj.byId("rebook_input_td_cur_code").get("value");
				td_amt = dj.byId("rebook_input_td_amt").get("value");
				inc_amt = "";
				dec_amt = "";
				input_maturity_date = dj.byId("rebook_input_maturity").getDate();
				input_maturity_days = dj.byId("rebook_input_maturity").getNumber();
				input_maturity_period = dj.byId("rebook_input_maturity").getCode();
				input_value_date = dj.byId("rebook_input_value").getDate();
				input_value_days = dj.byId("rebook_input_value").getNumber();
				input_value_period = dj.byId("rebook_input_value").getCode();

			}
			issuing_bank = dj.byId("issuing_bank_abbv_name").get("value");
		},
		
			/**Ajax Call *****************/
		
		/**
		 * Request fonction 
		 * fill content object with field information to send in request
		 * replace TD by your product code in error message
		 */
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
					interest_capitalisation: interest_capitalisation,
					reason: reason,
					original_trade_id: original_trade_id,
					td_type: td_type,
					td_cur_code: td_cur_code,
					td_amt: td_amt,
					inc_amt: inc_amt,
					dec_amt: dec_amt,
					value_date : input_value_date,
					value_days : input_value_days,
					remarks: remarks,
					value_period : input_value_period,
					maturity_date : input_maturity_date,
					maturity_days : input_maturity_days,
					maturity_period : input_maturity_period,
					bank : issuing_bank,
					productcode: "TD",
					subproductcode: "TRTD"
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
						_fncManageErrors(status, response);
						break;
					}
				},
				customError : function(response, args){
					dj.byId("loadingDialog").hide();
					console.error("[TdAjaxCall] error retrieving quote");
					_fncManageErrors("", response);
				}
			});
		},
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
						rec_id : rec_id,
						applicant_reference: applicant_reference,
						interest_capitalisation: interest_capitalisation,
						reason: reason,
						original_trade_id: original_trade_id,
						td_type: td_type,
						td_cur_code: td_cur_code,
						td_amt: td_amt,
						inc_amt: inc_amt,
						dec_amt: dec_amt,
						value_date : input_value_date,
						value_days : input_value_days,
						value_period : input_value_period,
						remarks: remarks,
						maturity_date : input_maturity_date,
						maturity_days : input_maturity_days,
						maturity_period : input_maturity_period,	
						trade_id : trade_id,
						bank : issuing_bank,
						productcode: "TD",
						subproductcode: "TRTD"
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
						console.error("[TradeCreateTdAjaxCall] error retrieving quote");
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
			dj.byId("buttonAcceptRequest").set("disabled", false);
			m.xhrPost( {
				url : m.getServletURL("/screen/AjaxScreen/action/TreasuryRequestForQuoteSearchAction"),
				handleAs: "json",
				content : {
					operation: "CANCEL",
					ref_id: ref_id,
					applicant_reference: dj.byId("applicant_reference").get("value"),
					trade_id : trade_id,
					rec_id : rec_id,
					td_type: td_type,
					td_cur_code: td_cur_code,
					td_amt: td_amt,
					value_date : input_value_date,
					value_days : input_value_days,
					value_period : input_value_period,
					maturity_date : input_maturity_date,
					maturity_days : input_maturity_days,
					maturity_period : input_maturity_period,
					bank : issuing_bank,
					productcode: "TD",
					subproductcode: "TRTD"
				},
				load : function(response, args){
					var status = response.status;
					console.debug("[TdAjaxCall] Ajax call success.");
					console.debug("[TdAjaxCall] Response status is:"+status);
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
					console.error("[TdAjaxCall] error retrieving quote");
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
				url : m.getServletURL("/screen/AjaxScreen/action/TreasuryRequestForQuoteSearchAction"),
				handleAs: "json",
				content : {
					operation: "REJECT",
					ref_id: ref_id,
					applicant_reference: dj.byId("applicant_reference").get("value"),
					trade_id : trade_id,
					td_type: td_type,
					rec_id : rec_id,
					td_cur_code: td_cur_code,
					td_amt: td_amt,
					value_date : input_value_date,
					value_days : input_value_days,
					value_period : input_value_period,
					maturity_date : input_maturity_date,
					maturity_days : input_maturity_days,
					maturity_period : input_maturity_period,
					bank : issuing_bank,
					productcode: "TD",
					subproductcode: "TRTD"
				},
				load : function(response, args){
					m.toggleEnableFields();
					m.performClearDetails();		
				},
				customError : function(response, args){
					console.error("[TdAjaxCall] error retrieving quote");
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
					"input_td_cur_code","input_td_amt","td_type",
					"input_td_amt_img",
					"input_rollover_remarks","input_rebook_remarks",
					"dijit_form_Button_2", "dijit_form_Button_3",
					"input_maturity","interest_capitalisation_Y","interest_capitalisation_N",
					"reversal_reason","rebook_reason","rebook_input_td_cur_code","rebook_input_td_amt","rebook_input_value",
					"request_button","request_clear_button",
					"inc_amt","dec_amt","rebook_input_maturity","input_maturity_number","input_maturity_code"];
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
			var hiddenFieldsToClear = [
					"td_cur_code", "td_amt", "rate",
					"input_rollover_remarks","input_rebook_remarks",
					"value_date", "maturity_date"];
			return hiddenFieldsToClear;
		},

		/**
		 * function required by RequestAction File for request pattern
		 * put fields to clear to renew request 
		 * **/
		getFieldsToClear : function()
		{	dj.byId("rollover_td_amt").set("value", dj.byId("td_amt").get("value"));
			dj.byId("interest_capitalisation_N").attr("checked", true);
			var fieldsToClear = [
					"trade_id","reversal_reason","rebook_input_td_cur_code","input_maturity_code","input_maturity_date",
					"input_td_cur_code","input_td_amt","rebook_reason",
					"inc_amt","dec_amt","rebook_input_td_amt","input_rollover_remarks",
					"rebook_input_value_date","rebook_input_maturity_date","input_rebook_remarks", "interest_capitalisation_Y"];
			return fieldsToClear;
		},

		/**
		 * function required by RequestAction File for request pattern
		 * put Date term fields to clear to renew request 
		 * **/
		getDateTermFieldsToClear : function()
		{
			var datefieldsToClear = ["input_value", "input_maturity"];
			return datefieldsToClear;
		}

	});
})(dojo, dijit, misys);

//Including the client specific implementation
dojo.require("misys.client.binding.cash.TradeMessageTdBinding_client");
