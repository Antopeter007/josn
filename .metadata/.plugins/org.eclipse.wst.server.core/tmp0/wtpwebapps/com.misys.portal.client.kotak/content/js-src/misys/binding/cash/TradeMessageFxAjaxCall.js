dojo.provide("misys.binding.cash.TradeMessageFxAjaxCall");

/**
 * Request fonction 
 * fill content object with field information to send in request
 * replace FX by your product code in error message
 */
_fncAjaxGetRate = function()
{
	console.debug('[INFO] Begin Ajax "Get Rate" call');
	m.xhrPost( {
		url : misys.getServletURL("/screen/AjaxScreen/action/RequestForQuoteSearchActionFX"),
		handleAs : "json",
		content : {
			operation : 'REQUESTUPDATE',
			applicant_reference : fncGetGlobalVariable('applicant_reference'),
			original_deal_id : fncGetGlobalVariable('original_deal_id'),
			ref_id : fncGetGlobalVariable('fx_ref_id'),
			bo_ref_id : fncGetGlobalVariable('fx_bo_ref_id'),
			fx_contract_type : fncGetGlobalVariable('fx_contract_type'),
			sub_tnx_type_code : fncGetGlobalVariable('sub_tnx_type_code'),
			fx_amt : fncGetGlobalVariable('fx_amt'),
			fx_cur_code : fncGetGlobalVariable('fx_cur_code'),
			remarks: fncGetGlobalVariable('remarks'),
			value_date : fncGetGlobalVariable('input_value_date'),
			value_days : fncGetGlobalVariable('input_value_days'),
			value_period : fncGetGlobalVariable('input_value_period'),
			//////////
			fx_type: fncGetGlobalVariable('fx_type'),
			contract_type: fncGetGlobalVariable('contract_type'),
			counter_cur_code: fncGetGlobalVariable('counter_cur_code'),
			org_fx_cur_code: fncGetGlobalVariable('org_fx_cur_code'),
			org_fx_amt: fncGetGlobalVariable('org_fx_amt'),
			org_counter_cur_code: fncGetGlobalVariable('org_counter_cur_code'),
			org_counter_amt: fncGetGlobalVariable('org_counter_amt'),
			org_rate: fncGetGlobalVariable('org_rate'),
			org_maturity_date: fncGetGlobalVariable('org_maturity_date')
			///////////
		},
		load : function(response, args){
			console.debug('[INFO] Ajax call success.');
			dijit.byId('loadingDialog').hide();
			var status = response.status;
			console.debug('[INFO] Response status is:'+status);
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
				_fncManageErrors(status);
				break;
			}
		},
		customError : function(response, args){
			dijit.byId('loadingDialog').hide();
			console.error('[FXMessageAjaxCall] error retrieving quote');
			_fncManageErrors();
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
				applicant_reference : fncGetGlobalVariable('applicant_reference'),
				rec_id : fncGetGlobalVariable('rec_id'),
				fx_amt: fncGetGlobalVariable('fx_amt'),
				fx_cur_code: fncGetGlobalVariable('fx_cur_code'),
				sub_tnx_type_code : fncGetGlobalVariable('sub_tnx_type_code'),
				remarks: fncGetGlobalVariable('remarks'),
				value_date : fncGetGlobalVariable('input_value_date'),
				value_days : fncGetGlobalVariable('input_value_days'),
				value_period : fncGetGlobalVariable('input_value_period'),
				trade_id : fncGetGlobalVariable('trade_id'),
				//////////
				fx_type: fncGetGlobalVariable('fx_type'),
				contract_type: fncGetGlobalVariable('contract_type'),
				counter_cur_code: fncGetGlobalVariable('counter_cur_code')
				///////////
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
				console.error('[FXMessageAjaxCall] error retrieving quote');
				_fncManageErrors('', response);
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
			operation: 'CANCEL',
			applicant_reference: dijit.byId('applicant_reference').get('value'),
			trade_id : fncGetGlobalVariable('trade_id'),
			rec_id : fncGetGlobalVariable('rec_id'),
			fx_amt: fncGetGlobalVariable('fx_amt'),
			fx_cur_code: fncGetGlobalVariable('fx_cur_code'),
			value_date : fncGetGlobalVariable('input_value_date'),
			value_days : fncGetGlobalVariable('input_value_days'),
			value_period : fncGetGlobalVariable('input_value_period')
		},
		load : fncPerformClear,
		customError : function(response, args){
			console.error('[FXMessageAjaxCall] error retrieving quote');
			misys.dialog.show('ERROR', misys.getLocalization('technicalError'));
			fncPerformClear();
		}
	});
};

/** Function for putting data in page elements **/
_fncGetData = function(/*JSON*/ response)
{
	dojo.query("#trade_id_report_row .content")[0].innerHTML = response.trade_id;
	dojo.query("#org_amount_report_row .content")[0].innerHTML = response.amount;
	dojo.query("#org_ctr_amount_report_row .content")[0].innerHTML = response.counter_amount;
	dojo.query("#amount_report_row .content")[0].innerHTML = response.updateAmount;
	dojo.query("#ctr_amount_report_row .content")[0].innerHTML = response.updateCounterAmount;
	dojo.query("#rate_report_row .content")[0].innerHTML = response.updateRate;
	dojo.query("#value_date_report_row .content")[0].innerHTML = response.value_date;
	
	
	dijit.byId('trade_id').set('value', response.trade_id);
	dijit.byId('rec_id').set('value', response.rec_id);
	dijit.byId('remarks').set('value', response.remarks);
	
	fncSetGlobalVariable('trade_id', response.trade_id);
	fncSetGlobalVariable('rec_id', response.rec_id);
	
	// hidden fields
	dijit.byId('rate').set('value', response.rate);
	dijit.byId('value_date').set('value', response.value_date);
	
};

/** Handle errors and display dialog **/
// TODO Continue error management 
_fncManageErrors = function(/*String*/ type, /* JSON */ response){
	var messageError = '';
	var param;
	switch(type){
	case 20:
		messageError = misys.getLocalization('errorFXRateRejected');
		break;
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
		messageError = misys.getLocalization('errorFXUnknownCounterCurrency', [response.conter_currency]);
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
		messageError = misys.getLocalization('errorFXCounterCurrencyDateNotValid');
		break;
	default:
		messageError = fncGetCommonMessageError(type, response);
		break;
	}
	console.debug('[INFO] Error (on status '+type+') : '+messageError);
	misys.dialog.show('ERROR', messageError);
	fncPerformClear();
	misys.animate("fadeIn", dojo.byId('request-button'));
};//Including the client specific implementation
       dojo.require('misys.client.binding.cash.TradeMessageFxAjaxCall_client');