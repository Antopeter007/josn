dojo.provide("misys.binding.cash.common.request_action");
/*
 -----------------------------------------------------------------------------
 Scripts for

  Request pattern .

  - Request
  - time out
  - submit or cancelled


 Copyright (c) 2000-2010 Misys (http://www.misys.com),
 All Rights Reserved. 

 version:   1.0
 author:	Pillon Gauthier
 date:      12/20/10
 -----------------------------------------------------------------------------
 */

dojo.require("misys.binding.cash.common.timer");



(function(/*Dojo*/ d, /*Dijit*/ dj, /*Misys*/ m) {
	
	"use strict"; // ECMA5 Strict Mode

	// Private functions and variables

	/* Fields to disable during request */
	function _fncDisabledFields()
	{
		var fieldsToDisable = m.getDisabledFields();

		d.forEach(fieldsToDisable, function(id){
			var field = dj.byId(id);
			if(field)
			{
				if(id.indexOf("button")>=0 || id.indexOf("img")>=0 || id.indexOf("image")>=0){
					field.set("disabled", true);
				}
				else{
					field.set("readOnly", true);
				}
			}
		});
	}

	/**
	 * function required by request_action File for request pattern
	 * put fields to clear to renew request 
	 * **/
	function _getFieldsToClear()
	{
		var fieldsToClear;
		var subProdCode = dj.byId("sub_product_code").get("value");
		if("TRINT" === subProdCode)
		{	
			fieldsToClear = [
						/* ALL */
						"applicant_act_name",
						"issuing_bank_customer_reference",
						"beneficiary_act_name",
						"ft_amt",
						"request_value_code",
						"request_value_date",
						"request_value_number",
						"instructions_type_1",
						"instructions_type_2",
						"applicant_act_cur_code",
						"applicant_cur_code",
						"ft_cur_code"
						];
		}
		else if("TRTPT" === subProdCode)
		{
			fieldsToClear = [
	 					/* ALL */
	 					"applicant_act_name",
	 					"issuing_bank_customer_reference",
	 					"applicant_act_amt",
	 					"payment_amt",
	 					"request_value_code",
	 					"request_value_date",
	 					"instructions_type_1",
	 					"instructions_type_2",
	 					"applicant_act_cur_code",
	 					"applicant_cur_code",
	 					"payment_cur_code"
	 					];
		}
		return fieldsToClear;
	}
//	Never Used ?? 
//	_fncEnableFields = function()
//	{
//		var fieldsToEnable = m.getEnabledFields();
//		d.forEach(fieldsToEnable, function(id){
//			var field = dj.byId(id);
//			if(field)
//			{	
//			m.toggleRequired(field,true);
//			field.set("disabled", false);
//			}
//		});
//	};
	
	// stop the manuel mode timer
	function _stopDelayTimer(id)
	{
		clearTimeout(id);
		m.frequencyStore = null;
		m.delayStore = null;
	}
	
	
	
	/** to store the timer &a other for the ajaxcall for the manual mode **/
	m.timer = null;
	m.frequencyStore = null;
	m.opicsFrequencyResponse = null;
	m.delayStore = null;

	
	/************ Public  Function *************************/
	
	d.mixin(m, {
		// TODO Why are all these in functions? Why can't we just call misys.dialog.show directly?
		fncPerformClearWithDialog : function(){
			m.dialog.show("CONFIRMATION", m.getLocalization("clearMessage"), "", m.performClear);
		},

		fncPerformCancelRequest : function(){
			console.debug("[INFO] cancel request with confirmation");
			m.dialog.show("CONFIRMATION",m.getLocalization("cancelRequest"), "", m.cancelRequest);
		},
		
		fncPerformCancelDelayRequest : function(){
			console.error("[INFO] Using default function performCancelDelayRequest. This method has to be overloaded.");
		},

		fncDisableLoadingDialogClosing : function(){
			//	Disable loadingDialog closing by using the escape key
			m.connect(dj.byId("loadingDialog"), "onKeyPress", function (evt){
				if(evt.keyCode === d.keys.ESCAPE){
					d.stopEvent(evt);
				}
			});
			//	Disable waitingDialog closing by using the escape key
			m.connect(dj.byId("delayDialog"), "onKeyPress", function (evt){
				if(evt.keyCode === d.keys.ESCAPE){
					d.stopEvent(evt);
				}
			});
		},
		
		/*Default function for fncPerformClear*/
		getFieldsToClear : function(){
			console.debug("[INFO] Using default function getFieldsToClear. This method has to be overloaded.");
			return [];
		},
		getHiddenFieldsToClear : function(){
			console.debug("[INFO] Using default function getHiddenFieldsToClear. This method has to be overloaded.");
			return [];
		},
		getEnabledFields : function(){
			console.debug("[INFO] Using default function m.getEnabledFields. This method has to be overloaded.");
			return [];
		},
		getDisabledFields : function(){
			console.debug("[INFO] Using default function m.getDisabledFields. This method has to be overloaded.");
			return [];
		},
		getDateTermFieldsToClear : function(){
			console.debug("[INFO] Using default function getDateTermFieldsToClear. This method has to be overloaded.");
			return [];
		},
		
		performClearFieldsOnFieldChange : function(){

			var fieldsToClear = _getFieldsToClear();
			
			d.forEach(fieldsToClear, function(id){
				if(dj.byId(id))
				{
					dj.byId(id).set("value","");
					if(dj.byId(id).get("value") !== "" && !isNaN(dj.byId(id).get("value")))
					{
						dj.byId(id).reset();
					}		
					dj.byId(id).set("disabled",false);
				}
			}
			);
		},

		/** submit form **/
		acceptRate : function()
		{
			var subProdCode = dj.byId("sub_product_code").get("value");
			if(subProdCode === "SPOT")
			{
				dj.byId("option").set("value", "ACCEPT_SPOT");
				m.submit("SUBMIT");
				return false;
			}
			else if(subProdCode === "FWD")
			{
				dj.byId("option").set("value", "ACCEPT_FWD");
				m.submit("SUBMIT");
				return false;
			}
			else if(subProdCode === "WFWD")
			{
				dj.byId("option").set("value", "ACCEPT_WFWD");
				m.submit("SUBMIT");
				return false;
			}
			else if(subProdCode === "TRTD")
			{
				dj.byId("option").set("value", "ACCEPT_TRTD");
				m.submit("SUBMIT");
				return false;
			}
			else
			{
				dj.byId("option").set("value", "ACCEPT");
				m.submit("SUBMIT");
				return false;
			}	
		},

		//button request action 
		doPerformRequest : function()
		{
			// init variable
			m.initVar();
			// disabled fields
			_fncDisabledFields();
			// show the waiting dialog
			dj.byId("loadingDialog").show();
			// call ajax service
			m.getRate();
		},
		
		showDetailField : function()
		{
			// reset the button "accpet"
			if(dj.byId("buttonAcceptRequest"))
				{
					dj.byId("buttonAcceptRequest").set("disabled", false);
				}
			if(dj.byId("sendRequestId"))
				{
					dj.byId("sendRequestId").set("disabled", false);
				}
			// display the field
			m.animate("fadeIn", d.byId("trade-details"));
			
			if(dj.byId("cancelButton2")){
				dj.byId("cancelButton2").focus();
			}
			
			
		},

		/** Function use for checking fields **/
		checkFields : function()
		{
			var doRealValidation = true;
			var returnValue = true;
			d.query(".validate").forEach(
					function(form){
						var formObj = dj.byId(form.id);
						if(!formObj.isValid()) {
							if(doRealValidation)
							{
								formObj.validate();
							}
							returnValue = false;
						}
					}
			);
			return returnValue;
		},

		//close the delay dialog
		closeDelayDialog : function ()
		{
			dj.byId("delayDialog").hide();
			if (m.timer !== null){
				_stopDelayTimer(m.timer);
			}
		},

		fncCancelDelayRequest : function(){
			m.closeDelayDialog();						
			//m.performClear(); // on cancel no need to clear screen. screen should be clear by clear button.
			//enabling field  again
			m.toggleEnableFields();
			m.performCancelDelayRequest();
		},
		
		toggleEnableFields : function(){
			var fieldsToEnable = m.getEnabledFields();
			m.toggleFields(true, fieldsToEnable, null, true, false);
		},
		
		performClearDetails : function(){
			// reset variables
			if (!(m.timer === undefined) && !(m.timer === null)){
				clearTimeout(m.timer);
			}
			if (!(m.countdown === undefined) && !(m.countdown === null)){
				clearTimeout(m.countdown);
				m.initCountdown = true;
			}
			m.countdown = null;
			m.countdownProgess = null;
			m.timer = null;
			m.frequencyStore = null;
			m.delayStore = null;
			// hide details field when page is on edit mode
			// prevent to hide the field on review mode
			if (d.byId("edit")){
				m.animate("fadeOut", d.byId("trade-details"));
			}
		},

		performClear : function(){

			var fieldsToClear = m.getFieldsToClear();
			
			d.forEach(fieldsToClear, function(id){
				if(dj.byId(id))
				{
					dj.byId(id).reset();
				}
			}
			);

			var hiddenFieldsToClear = m.getHiddenFieldsToClear();
			d.forEach(hiddenFieldsToClear, function(id){
				if(dj.byId(id))
				{
					dj.byId(id).value = "";
				}
			});

			//re-enable fields
			m.toggleEnableFields();

			//reset dateTermField
			var fieldsToReset = m.getDateTermFieldsToClear();
			d.forEach(fieldsToReset, function(id){
				if (dj.byId(id+"_rb1"))
				{
					dj.byId(id+"_rb1").set("checked", true);
					fncEnableDateAccordingToContent(/*String*/ (id+"_date"), /*String*/ (id+"_days"), /*String*/ (id+"_period"),(id+"_rb1"),(id+"_rb2"));
				}
			});
			
			//reset timer and fade out details 
			m.performClearDetails();
		},
		
		fncContinueDelayDialog : function()
		{
			d.byId("waitingMessage").style.display = "block";
			d.byId("continueMessage").style.display = "none";
			//d.byId("continueDelayId").style.display = "none";
			d.style(dj.byId("continueDelayId").domNode, "display", "none");
			m.frequencyStore = m.opicsFrequencyResponse;
			m.performDelayRequest();
		},
		
		validateTermNumber : function(/*String*/ idWidgetHitch, /*String*/errorMessage){
			var validateTermNumberFieldHitched = d.hitch(dj.byId(idWidgetHitch), m.validateTermNumberField);
			return validateTermNumberFieldHitched(errorMessage);
		},
		
		validateDate : function(/*String*/ idWidgetHitch, /*String*/ idComparedWidget, /*String*/errorMessage, /*boolean*/ smaller,/*Date*/ startdate){
			var validateDateTermFieldHitched = d.hitch(dj.byId(idWidgetHitch), m.validateDateTermField);
			return validateDateTermFieldHitched(false, idComparedWidget, errorMessage, smaller,startdate);
		},
		
		/**
		 * Fonction use for the manuel mode
		 */
		// open the delay dialog
		openDelayDialog : function(/*int*/frequency, /*int*/delay)
		{
			d.byId("continueMessage").style.display = "none";
			d.style(dj.byId("continueDelayId").domNode, "display", "none");
			d.style(d.byId("waitingMessage"), "display", "block");
			dj.byId("delayDialog").show();
			m.performDelayRequest();
			
		},
		
		showContinuationElement : function()
		{
			d.byId("waitingMessage").style.display = "none";
			d.byId("continueMessage").style.display = "block";
			//d.byId("continueDelayId").style.display = "block";
			d.style(dj.byId("continueDelayId").domNode, "display", "inline-block");
		},


		getCommonMessageError : function(/*String*/ type, /* JSON */ response)
		{

			var messageError = "";
			switch(type){
			case 3:
				messageError = m.getLocalization("errorFXRateRejected");
				break;
			case 20:
				messageError = response.opics_error;
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
			case 36:
				messageError = m.getLocalization("errorDatenotValideInCurrencyCalendar");
				break;
			case 37:
				messageError = m.getLocalization("errorTransactionInInvalideState");
				break;
			case 38:
				messageError = m.getLocalization("errorSameAccount");
				break;
			case 39:
				messageError = m.getLocalization("errorSplitAmountGreaterThanOriginalAmount");
				break;
			case 40:
				messageError = m.getLocalization("errorPaymentAmountGreaterThanTransferAmount");
				break;
			default:
				messageError = m.getLocalization("technicalError");
				break;
			}
			return messageError;

		}
		
	});
})(dojo, dijit, misys);

















