dojo.provide("misys.binding.cash.TradeCreateFxAjaxCall");
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

_fncAjaxGetRate = function()
{
	console.debug('[INFO] Begin Ajax call');
	m.xhrPost( {
		url : misys.getServletURL("/screen/AjaxScreen/action/RequestForQuoteSearchActionFX"),
		handleAs : "json",
		content : {
			operation: 'REQUEST',
			applicant_reference: fncGetGlobalVariable('applicant_reference'),
			fx_type: fncGetGlobalVariable('fx_type'),
			contract_type: fncGetGlobalVariable('contract_type'),
			counter_cur_code: fncGetGlobalVariable('counter_cur_code'),
			fx_cur_code: fncGetGlobalVariable('fx_cur_code'),
			fx_amt: fncGetGlobalVariable('fx_amt'),
			value_date : fncGetGlobalVariable('input_value_date'),
			value_days : fncGetGlobalVariable('input_value_days'),
			value_period : fncGetGlobalVariable('input_value_period'),
			near_date : fncGetGlobalVariable('input_near_date'),
			near_days : fncGetGlobalVariable('input_near_days'),
			near_period : fncGetGlobalVariable('input_near_period'),
			near_amt : fncGetGlobalVariable('near_amt'),
			remarks: fncGetGlobalVariable('remarks'),
			option_date : fncGetGlobalVariable('input_option_date'),
			option_days : fncGetGlobalVariable('input_option_days'),
			option_period : fncGetGlobalVariable('input_option_period')
		},
		load : function(response, args){
			console.debug('[FxAjaxCall] Ajax call success.');
			dijit.byId('loadingDialog').hide();
			var status = response.status;
			console.debug('[FxAjaxCall] Response status is: '+status);
			switch(status){
			case 5:
				_fncGetData(response);
				// Countdown start
				validity = response.validity;
				_fncCountdown(validity);
				fncShowDetailField();
				break;
			case 6:
				fncSetGlobalVariable('trade_id', response.trade_id);
				fncSetGlobalVariable('rec_id', response.rec_id);
				misys.frequencyStore = response.delay_frequency;
				misys.delayStore = response.delay_timeout;
				_fncOpenDelayDialog(misys.frequencyStore, misys.delayStore);
				break;
			
			default:
				dijit.byId('loadingDialog').hide();
				_fncManageErrors(status, response);
				break;
			}
		},
		customError : function(response, args){
			dijit.byId('loadingDialog').hide();
			console.error('[TradeCreateFxBinding] error retrieving quote');
			_fncManageErrors(response.status,response);
		}
	});
};

//call ajax service
_fncPerformDelayRequest = function(/*int*/frequency, /*int*/delay)
{
	console.debug('[INFO] Ajax call.');
	if(frequency>0){
		m.xhrPost( {
			url : misys.getServletURL("/screen/AjaxScreen/action/RequestForQuoteSearchActionFX"),
			handleAs : "json",
			content : {
				operation: 'DELAY',
				applicant_reference: dijit.byId('applicant_reference').get('value'),
				trade_id : fncGetGlobalVariable('trade_id'),
				rec_id : fncGetGlobalVariable('rec_id'),
				fx_type: fncGetGlobalVariable('fx_type'),
				contract_type: fncGetGlobalVariable('contract_type'),
				counter_cur_code: fncGetGlobalVariable('counter_cur_code'),
				fx_cur_code: fncGetGlobalVariable('fx_cur_code'),
				fx_amt: fncGetGlobalVariable('fx_amt'),
				value_date : fncGetGlobalVariable('input_value_date'),
				value_days : fncGetGlobalVariable('input_value_days'),
				value_period : fncGetGlobalVariable('input_value_period'),
				near_date : fncGetGlobalVariable('input_near_date'),
				near_days : fncGetGlobalVariable('input_near_days'),
				near_period : fncGetGlobalVariable('input_near_period'),
				near_amt : fncGetGlobalVariable('near_amt'),
				remarks: fncGetGlobalVariable('remarks'),
				option_date : fncGetGlobalVariable('input_option_date'),
				option_days : fncGetGlobalVariable('input_option_days'),
				option_period : fncGetGlobalVariable('input_option_period')
			},
			load : function(response, args){
				var status = response.status;
				console.debug('[FxAjaxCall] Ajax call success.');
				console.debug('[FxAjaxCall] Response status is:'+status);
				switch (status)
				{
				case 5:
					_fncGetData(response);
					// close the delay dialog
					fncCloseDelayDialog();
					// Countdown start
					validity = response.validity;
					_fncCountdown(validity);
					fncShowDetailField();
					break;
				case 6:
					fncSetGlobalVariable('rec_id', response.rec_id);
					// update timer
					frequency--;
					misys.timer=setTimeout("_fncPerformDelayRequest('"+frequency+"','"+delay+"')",(delay*1000));
					break;
				
				default:
					fncCloseDelayDialog();
					_fncManageErrors(status, response);
					break;
				}
			},
			customError : function(response, args){
				console.error('[TradeCreateFxBinding] error retrieving quote');
				_fncManageErrors(response.status,response);
			}
		});
	}
	else
	{
		_stopCountDown(misys.timer);
		_fncShowContinuationElement();
	}
};

/** To cancel the request **/
_fncCancelDelayRequest = function()
{
	m.xhrPost( {
		url : misys.getServletURL("/screen/AjaxScreen/action/RequestForQuoteSearchActionFX"),
		handleAs : "json",
		content : {
			operation: 'CANCEL',
			applicant_reference: dijit.byId('applicant_reference').get('value'),
			trade_id : fncGetGlobalVariable('trade_id'),
			rec_id : fncGetGlobalVariable('rec_id'),
			fx_type: fncGetGlobalVariable('fx_type'),
			contract_type: fncGetGlobalVariable('contract_type'),
			counter_cur_code: fncGetGlobalVariable('counter_cur_code'),
			fx_cur_code: fncGetGlobalVariable('fx_cur_code'),
			fx_amt: fncGetGlobalVariable('fx_amt'),
			value_date : fncGetGlobalVariable('input_value_date'),
			value_days : fncGetGlobalVariable('input_value_days'),
			value_period : fncGetGlobalVariable('input_value_period'),
			near_date : fncGetGlobalVariable('input_near_date'),
			near_days : fncGetGlobalVariable('input_near_days'),
			near_period : fncGetGlobalVariable('input_near_period'),
			near_amt : fncGetGlobalVariable('near_amt'),
			remarks: fncGetGlobalVariable('remarks'),
			option_date : fncGetGlobalVariable('input_option_date'),
			option_days : fncGetGlobalVariable('input_option_days'),
			option_period : fncGetGlobalVariable('input_option_period')
		},
		load : function(response, args){
			var status = response.status;
			console.debug('[FxAjaxCall] Ajax call success.');
			console.debug('[FxAjaxCall] Response status is:'+status);
			switch (status)
			{
				case 7:
					// confirmation popup
					misys.dialog.show('CUSTOM-NO-CANCEL', misys.getLocalization('confirmationCancelRequest'), misys.getLocalization('confirmationCancelTitle'));
					break;
				default:
					_fncManageErrors(status, response);
					break;
			}
		},
		customError : function(response, args){
			console.info('[TradeCreateFxBinding] error retrieving quote');
			misys.dialog.show('ERROR', misys.getLocalization('technicalError'));
			fncPerformClear();
		}
	});
};

/** To cancel the request **/
fncCancelRequest = function()
{
	dijit.byId('buttonAcceptRequest').set('disabled', false);
	m.xhrPost( {
		url : misys.getServletURL("/screen/AjaxScreen/action/RequestForQuoteSearchActionFX"),
		handleAs : "json",
		content : {
			operation: 'REJECT',
			applicant_reference: dijit.byId('applicant_reference').get('value'),
			trade_id : fncGetGlobalVariable('trade_id'),
			rec_id : fncGetGlobalVariable('rec_id'),
			fx_type: fncGetGlobalVariable('fx_type'),
			contract_type: fncGetGlobalVariable('contract_type'),
			counter_cur_code: fncGetGlobalVariable('counter_cur_code'),
			fx_cur_code: fncGetGlobalVariable('fx_cur_code'),
			fx_amt: fncGetGlobalVariable('fx_amt'),
			value_date : fncGetGlobalVariable('input_value_date'),
			value_days : fncGetGlobalVariable('input_value_days'),
			value_period : fncGetGlobalVariable('input_value_period'),
			near_date : fncGetGlobalVariable('input_near_date'),
			near_days : fncGetGlobalVariable('input_near_days'),
			near_period : fncGetGlobalVariable('input_near_period'),
			near_amt : fncGetGlobalVariable('near_amt'),
			remarks: fncGetGlobalVariable('remarks'),
			option_date : fncGetGlobalVariable('input_option_date'),
			option_days : fncGetGlobalVariable('input_option_days'),
			option_period : fncGetGlobalVariable('input_option_period')
		},
		load : fncPerformClear,
		customError : function(response, args){
			console.info('[TradeCreateFxBinding] error retrieving quote');
			misys.dialog.show('ERROR', misys.getLocalization('technicalError'));
			fncPerformClear();
		}
	});
};

/** Function for putting data in page elements **/
_fncGetData = function(/*JSON*/ response)
{
	dojo.query("#trade_id_report_row .content")[0].innerHTML = response.trade_id;
	dijit.byId('trade_id').set('value', response.trade_id);
	dijit.byId('rec_id').set('value', response.rec_id);
	fncSetGlobalVariable('trade_id', response.trade_id);
	fncSetGlobalVariable('rec_id', response.rec_id);
	dijit.byId('remarks').set('value', response.remarks);
	
	if(fx_type == 'SPOT' || fx_type == 'FORWARD'){
		// report
		dojo.query("#rate_report_row .content")[0].innerHTML = response.rate;
		dojo.query("#counter_amt_report_row .content")[0].innerHTML = response.counter_currency + '&nbsp;' + response.counter_amount;
		dojo.query("#maturity_date_report_row .content")[0].innerHTML = response.value_date;
		
		// hidden fields
		dijit.byId('rate').set('value', response.rate);
		dijit.byId('counter_cur_code').set('value', response.counter_currency);
		dijit.byId('counter_amt').set('value', response.counter_amount);
		dijit.byId('maturity_date').set('value', response.value_date);
		dijit.byId('value_date').set('value', response.value_date);
		dijit.byId('fx_cur_code').set('value', response.currency);
		dijit.byId('fx_amt').set('value', response.amount);
	}
		
	else if(fx_type == 'DELIVERY_OPTION'){
		// report
		dojo.query("#rate_report_row .content")[0].innerHTML = response.rate;
		dojo.query("#counter_amt_report_row .content")[0].innerHTML = response.counter_currency + '&nbsp;' + response.counter_amount;
		dojo.query("#maturity_date_report_row .content")[0].innerHTML = response.value_date;
		dojo.query("#option_date_report_row .content")[0].innerHTML = response.option_value_date;
		
		// hidden fields
		dijit.byId('rate').set('value', response.rate);
		dijit.byId('counter_cur_code').set('value', response.counter_currency);
		dijit.byId('counter_amt').set('value', response.counter_amount);
		dijit.byId('maturity_date').set('value', response.value_date);
		dijit.byId('value_date').set('value', response.value_date);
		dijit.byId('fx_cur_code').set('value', response.currency);
		dijit.byId('fx_amt').set('value', response.amount);
		dijit.byId('option_date').set('value', response.option_value_date);
	}
	
	else if (fx_type == 'SWAP')
	{
		// Near
		dojo.query("#near_amt_report_row .content")[0].innerHTML = response.currency + '&nbsp;' + response.near_amount;
		dojo.query("#near_rate_report_row .content")[0].innerHTML = response.near_rate;
		dojo.query("#near_counter_amt_report_row .content")[0].innerHTML = response.counter_currency + '&nbsp;' + response.near_counter_amount;
		dojo.query("#near_date_report_row .content")[0].innerHTML = response.near_value_date;
		
		// hidden fields
		dijit.byId('near_currency_code').set('value', response.currency);
		dijit.byId('near_amt').set('value', response.near_amount);
		dijit.byId('near_rate').set('value', response.near_rate);
		dijit.byId('near_counter_currency_code').set('value', response.counter_currency);
		dijit.byId('near_counter_amt').set('value', response.near_counter_amount);
		dijit.byId('near_date').set('value', response.near_value_date);
		
		// Far
		dojo.query("#far_amt_report_row .content")[0].innerHTML = response.currency + '&nbsp;' + response.amount;
		dojo.query("#far_rate_report_row .content")[0].innerHTML = response.rate;
		dojo.query("#far_counter_amt_report_row .content")[0].innerHTML = response.counter_currency + '&nbsp;' + response.counter_amount;
		dojo.query("#far_date_report_row .content")[0].innerHTML = response.value_date;
		
		// hidden fields
		dijit.byId('fx_cur_code').set('value', response.currency);
		dijit.byId('fx_amt').set('value', response.amount);
		dijit.byId('counter_cur_code').set('value', response.counter_currency);
		dijit.byId('rate').set('value', response.rate);
		dijit.byId('counter_amt').set('value', response.counter_amount);
		dijit.byId('value_date').set('value', response.value_date);
		dijit.byId('maturity_date').set('value', response.value_date);

	}
};
/** Handle errors and display dialog **/
// TODO Continue error management 
_fncManageErrors = function(/*String*/ type, /* JSON */ response){
	
	var messageError = '';
	switch(type){
	case 3:
		messageError = misys.getLocalization('errorFXRateRejected');
		break;
	case 28:
		messageError = misys.getLocalization('errorFXRateNoLongerValid');
		break;
	case 29:
		messageError = misys.getLocalization('errorFXUnknownCurrency');
		break;
	case 30:
		messageError = misys.getLocalization('errorFXUnknownCounterCurrency');
		break;
	case 31:
		messageError = misys.getLocalization('errorFXServiceClosed');
		break;
	case 32:
		messageError = misys.getLocalization('errorFXServiceNotAuthorized');
		break;
	case 33:
		messageError = misys.getLocalization('errorFXDateNotValid');
		break;
	case 34:
		messageError = misys.getLocalization('errorFXCurrencyDateNotValid');
		break;
	case 35:
		messageError = misys.getLocalization('errorFXCounterCurrencyDateNotValid', [response.errorParam]);
		break;
	default:
		messageError = fncGetCommonMessageError(type, response);
		break;
	}
	fncPerformClear();
	console.debug('[INFO] Error (on status '+type+') : '+messageError);
	misys.dialog.show('ERROR', messageError);
	fncPerformClear();
};//Including the client specific implementation
       dojo.require('misys.client.binding.cash.TradeCreateFxAjaxCall_client');