dojo.provide("misys.binding.treasury.create_td_trtd");


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


(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {
'use strict'; // ECMA5 Strict Mode



// insert private functions & variables
var trade_id,
	ref_id,
	rec_id,
	applicant_reference,
	remarks,
	la_cur_code,
	la_amt,
	value_date,
	value_days,
	value_period,
	maturity_date,
	maturity_days,
	maturity_period,
	td_cur_code,
	td_type,
	td_amt,
	input_value_date,
	input_value_days,
	input_value_period,
	input_maturity_date,
	input_maturity_days,
	input_maturity_period;

		
	
	/**[AJAX] Handle errors and display dialog **/
	function  _fncManageErrors(/*String*/ type, /* JSON */ response) 
	{
		var messageError = '';
		switch(type){
		case 3:
			messageError = m.getLocalization('errorTDRejected');
			if (response.trader_remarks != null && response.trader_remarks.length != 0)
			{
				messageError += '<br><br>' + m.getLocalization('traderRemarks') + response.trader_remarks;
			}
			
			break;
		default:
			messageError = m.getCommonMessageError(type, response);
			break;
		}
		console.debug('[INFO] Error (on status '+type+') : '+messageError);
		m.dialog.show('ERROR', messageError);
		m.toggleEnableFields();
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
					"applicant_act_name",
					"input_td_cur_code",
					"input_td_amt",
					"input_value_code",
					"input_maturity_code",
					"remarks",
					"issuing_bank_customer_reference"
					];
			return fieldsToClear;
	}
	
	/**[AJAX] Function for putting data in page elements **/
	function _fncGetData (/*JSON*/ response)
	{
		d.query("#trade_id_report_row .content")[0].innerHTML = response.trade_id;
		d.query("#rate_report_row .content")[0].innerHTML = response.rate;
		d.query("#interest_report_row .content")[0].innerHTML = response.interest;
		d.query("#value_date_report_row .content")[0].innerHTML = response.value_date;
		d.query("#maturity_date_report_row .content")[0].innerHTML = response.maturity_date;
		d.query("#trader_remarks_report_row .content")[0].innerHTML = response.trader_remarks;		
		dj.byId('trade_id').set('value', response.trade_id);
		dj.byId('rec_id').set('value', response.rec_id);
		dj.byId('remarks').set('value', response.remarks);
		
		trade_id = response.trade_id;
		rec_id = response.rec_id;
		
		// hidden fields
		dj.byId('rate').set('value', response.rate);
		dj.byId('maturity_date').set('value', response.maturity_date);
		dj.byId('value_date').set('value', response.value_date);
		dj.byId('td_cur_code').set('value', response.currency);
		dj.byId('td_amt').set('value', response.amount);
		dj.byId('interest').set('value', response.interest);
		dj.byId('trader_remarks').set('value', response.trader_remarks);

		// hide trader remarks from screen if empty
		if (response.trader_remarks === null || response.trader_remarks.length === 0)
		{
			if (dojo.byId('traderRemarksContainer')){
				dojo.style(dojo.byId('traderRemarksContainer'), 'display', 'none');
			}
		}
		else
		{
			if (dojo.byId('traderRemarksContainer')){
				dojo.style(dojo.byId('traderRemarksContainer'), 'display', '');
			}
		}
	}

	d.mixin(m._config, {	
		/**
		 * Validation for Reauthentication 
		 */
		initReAuthParams : function(){
			
			var reAuthParams = { 	productCode : 	'TD',
			         				subProductCode : 'TRTD',
			        				transactionTypeCode : '01',
			        				entity : dj.byId("entity") ? dj.byId("entity").get("value") : "",
			        				currency : dj.byId("td_cur_code") ? dj.byId("td_cur_code").get("value") : "",
			        				amount : dj.byId("td_amt") ? m.trimAmount(dj.byId("td_amt").get("value")) : "",
			        				bankAbbvName :	dj.byId("issuing_bank_abbv_name")? dj.byId("issuing_bank_abbv_name").get("value") : "",			        				
			        				es_field1 : dj.byId("td_amt") ? m.trimAmount(dj.byId("td_amt").get("value")) : "",
			        				es_field2 : ""
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
		
		// action linked to buttons
		m.connect('cancelDelayDialogButton', 'onClick', m.performClear('delayDialog'));
		m.connect('buttonAcceptRequest', 'onClick', m.acceptRate);
		m.connect('buttonCancelRequest', 'onClick', m.fncPerformCancelRequest);
		m.setValidation("remarks", m.validateAlphaNumericRemarks);
		m.setValidation("input_td_cur_code", m.validateCurrency);
		m.connect("input_td_cur_code", "onChange", function(){
			m.setCurrency(this, ["input_td_amt"]);
		});
		
		/**
		 *  Validation for Start and Maturity Date for Term Deposit
		 */
		m.setValidation("input_value_date", function(){			
			return m.validateDate("input_value", "", "startDateLessThanDateOfDayError", false) && m.validateDate("input_value", "input_maturity", "startDateGreaterThanMaturityDateError", true, dj.byId("input_value_date"));
			
		});
		m.setValidation("input_maturity_date", function(){			
			return m.validateDate("input_maturity", "", "maturityDateLessThanDateOfDayError", false) && m.validateDate("input_value", "input_maturity", "maturityDateSmallerThanStartDateError", true, dj.byId("input_value_date"));
			
		});
		
		m.connect("issuing_bank_abbv_name", "onChange", m.populateReferences);
		if(dj.byId("issuing_bank_abbv_name"))
		{
			m.connect("entity", "onChange", function(){
				dj.byId("issuing_bank_abbv_name").onChange();});
		}
		m.connect("issuing_bank_customer_reference", "onChange", m.setApplicantReference);
		
		/**
		 * Validate Start and Maturity TermNumber Date
		 */
		m.setValidation("input_value_number", function(){
				return m.validateTermNumber("input_value", "", "TermCodeError", false);
		});
		m.setValidation("input_maturity_number", function(){
			return m.validateTermNumber("input_maturity", "", "TermCodeError", false);
	});
		
			m.connect("input_td_amt", "onBlur", function(){
			m.amountValidationForZero(dj.byId("input_td_amt"));
		});
			m.connect('entity', 'onChange', _performClear);
	},
	onFormLoad : function() {
		//  summary:
		//          Events to perform on page load.
		//  tags:
		//         public
	
		//initiate type at Scratch 
		dj.byId('td_type').set('value', 'SCRATCH');
		
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
	},
	
	fncPerformRequest : function()
	{
		if(/*isValid && */m.checkFields()) 
		{
			m.doPerformRequest();
		}
	},
	
	/** to init local variables **/
	initVar : function()
	{
		ref_id = dj.byId('ref_id').get('value');
		
		if (dj.byId('applicant_reference'))
		{
			applicant_reference = dj.byId('applicant_reference').get('value');
		}
		else {
			applicant_reference = '';
		}
		remarks = dj.byId('remarks').get('value');
		td_type = 'SCRATCH';
		td_cur_code = dj.byId('input_td_cur_code').get('value');
		td_amt = dj.byId('input_td_amt').get('value');
		input_value_date = dj.byId('input_value').getDate();
		input_value_days = dj.byId('input_value').getNumber();
		input_value_period = dj.byId('input_value').getCode();
		input_maturity_date = dj.byId('input_maturity').getDate();
		input_maturity_days = dj.byId('input_maturity').getNumber();
		input_maturity_period = dj.byId('input_maturity').getCode();

	},
	
	/**Ajax Call *****************/
	
	/**
	 * Request fonction 
	 * fill content object with field information to send in request
	 * replace TD by your product code in error message
	 */
	getRate : function()
	{
		console.debug('[INFO] Begin Ajax call');
		m.xhrPost( {
			url : m.getServletURL("/screen/AjaxScreen/action/TreasuryRequestForQuoteSearchAction"),
			handleAs :"json",
			content : {
				operation: 'REQUEST',
				ref_id: ref_id,
				applicant_reference: applicant_reference,
				td_type: td_type,
				td_cur_code: td_cur_code,
				td_amt: td_amt,
				value_date : input_value_date,
				value_days : input_value_days,
				value_period : input_value_period,
				remarks: remarks,
				maturity_date : input_maturity_date,
				maturity_days : input_maturity_days,
				maturity_period : input_maturity_period,
				bank : dj.byId("issuing_bank_abbv_name").get("value"),
				productcode: "TD",
				subproductcode: "TRTD"
			},
			load : function(response, args){
				console.debug('[INFO] Ajax call success.');
				dj.byId('loadingDialog').hide();
				var status = response.status;
				console.debug('[INFO] Response status is:'+status);
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
					console.debug('[TradeCreateTdAjaxCall] error default case status= '+status+' manage start ');
					_fncManageErrors(status,response);
					break;
				}
			},
			customError : function(response, args){
				console.debug('[TradeCreateTdAjaxCall] error ='+response.status+'manage start ');
				dj.byId('loadingDialog').hide();
				console.debug('[TdAjaxCall] error retrieving quote');
				_fncManageErrors(response.status,response);
			}
		});
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
					ref_id: ref_id,
					rec_id : rec_id,
					applicant_reference: applicant_reference,
					td_type: td_type,
					td_cur_code: td_cur_code,
					td_amt: td_amt,
					value_date : input_value_date,
					value_days : input_value_days,
					value_period : input_value_period,
					remarks: remarks,
					maturity_date : input_maturity_date,
					maturity_days : input_maturity_days,
					maturity_period : input_maturity_period,
					bank : dj.byId("issuing_bank_abbv_name").get("value"),
					productcode: "TD",
					subproductcode: "TRTD"
					
				},
				load : function(response, args){
					var status = response.status;
					console.debug('[TdAjaxCall] Ajax call success.');
					console.debug('[TdAjaxCall] Response status is:'+status);
					switch (status)
					{
					case 5:
						_fncGetData(response);
						// close the delay dialog
						m.closeDelayDialog();
						// Countdown start
						var	validity = response.validity;
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
					console.error('[TradeCreateTdAjaxCall] error retrieving quote');
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
		dj.byId('buttonAcceptRequest').set('disabled', false);
		m.xhrPost( {
			url : m.getServletURL("/screen/AjaxScreen/action/TreasuryRequestForQuoteSearchAction"),
			handleAs :"json",
			content : {
				operation: 'CANCEL',
				ref_id: ref_id,
				applicant_reference: dj.byId('applicant_reference').get('value'),
				trade_id : trade_id,
				td_type: td_type,
				rec_id : rec_id,
				bank : dj.byId("issuing_bank_abbv_name").get("value"),
				productcode: "TD",
				subproductcode: "TRTD"
			},
			load : function(response, args){
				var status = response.status;
				console.debug('[TdAjaxCall] Ajax call success.');
				console.debug('[TdAjaxCall] Response status is:'+status);
				switch (status)
				{
					case 7:
						// confirmation popup
						m.dialog.show('CUSTOM-NO-CANCEL', m.getLocalization('confirmationCancelRequest'), m.getLocalization('confirmationCancelTitle'));
						break;
					default:
						_fncManageErrors(status, response);
						break;
				}
			},
			customError : function(response, args){
				console.error('[TdAjaxCall] error retrieving quote');
				m.dialog.show('ERROR', m.getLocalization('technicalError'));
				m.performClear();
			}
		});
	},
	/** To cancel the request **/
	cancelRequest : function()
	{
		dj.byId('buttonAcceptRequest').set('disabled', false);
		m.xhrPost( {
			url : m.getServletURL("/screen/AjaxScreen/action/TreasuryRequestForQuoteSearchAction"),
			handleAs :"json",
			content : {
				operation: 'REJECT',
				ref_id: ref_id,
				applicant_reference: dj.byId('applicant_reference').get('value'),
				trade_id : trade_id,
				td_type: td_type,
				rec_id : rec_id,
				bank : dj.byId("issuing_bank_abbv_name").get("value"),
				productcode: "TD",
				subproductcode: "TRTD"
			},				
			load : function(response, args){
				m.toggleEnableFields();
				m.performClearDetails();		
				},
			customError : function(response, args){
				console.error('[TdAjaxCall] error retrieving quote');
				m.dialog.show('ERROR', m.getLocalization('technicalError'));
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
				'issuing_bank_customer_reference','trade_id', 
				'issuing_bank_abbv_name','input_td_cur_code','input_td_amt',
				'input_td_amt_img',	'dijit_form_Button_2', 'dijit_form_Button_3',
				'request_button','request_clear_button',
				'input_value','input_maturity','remarks',
				'input_value_number','input_maturity_number','input_value_code','input_maturity_code','entity_img','applicant_name','applicant_address_line_1','applicant_address_line_2','applicant_dom',
				'input_maturity_date','input_value_date'];
		return fieldsToDisable;
	},

	/**
	 * function required by RequestAction File for request pattern
	 * put fields to Enable to renew request if different to field to disable 
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
				'td_cur_code', 'td_amt', 'rate',
				'value_date', 'maturity_date', 'trader_remarks'];
		return hiddenFieldsToClear;
	},

	/**
	 * function required by RequestAction File for request pattern
	 * put fields to clear to renew request 
	 * **/
	getFieldsToClear : function()
	{
		var fieldsToClear = [
				'cust_ref_id', 'trade_id', 
				'issuing_bank_abbv_name',
				'input_td_cur_code','input_td_amt',
				'input_value','input_maturity','remarks'];
		return fieldsToClear;
	},

	/**
	 * function required by RequestAction File for request pattern
	 * put Date term fields to clear to renew request 
	 * **/
	getDateTermFieldsToClear : function()
	{
		var datefieldsToClear = ['input_value', 'input_maturity'];
		return datefieldsToClear;
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
	}
});

})(dojo, dijit, misys);

//Including the client specific implementation
     dojo.require('misys.client.binding.treasury.create_td_trtd_client');
     