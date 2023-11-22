dojo.provide("misys.binding.cash.TradeCreateTdAjaxCall");

/**
 * Request fonction 
 * fill content object with field information to send in request
 * replace TD by your product code in error message
 */
_fncAjaxGetRate = function()
{
	console.debug('[INFO] Begin Ajax call');
	m.xhrPost( {
		url : misys.getServletURL("/screen/AjaxScreen/action/RequestForQuoteSearchActionTD"),
		handleAs : "json",
		content : {
			operation: 'REQUEST',
			applicant_reference: fncGetGlobalVariable('applicant_reference'),
			td_type: fncGetGlobalVariable('td_type'),
			td_cur_code: fncGetGlobalVariable('td_cur_code'),
			td_amt: fncGetGlobalVariable('td_amt'),
			value_date : fncGetGlobalVariable('input_value_date'),
			value_days : fncGetGlobalVariable('input_value_days'),
			value_period : fncGetGlobalVariable('input_value_period'),
			remarks: fncGetGlobalVariable('remarks'),
			maturity_date : fncGetGlobalVariable('input_maturity_date'),
			maturity_days : fncGetGlobalVariable('input_maturity_days'),
			maturity_period : fncGetGlobalVariable('input_maturity_period')			
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
				console.error('[TradeCreateTdAjaxCall] error default case status= '+status+' manage start ');
				_fncManageErrors(status);
				break;
			}
		},
		customError : function(response, args){
			console.error('[TradeCreateTdAjaxCall] error ='+response.status+'manage start ');
			dijit.byId('loadingDialog').hide();
			console.error('[TdAjaxCall] error retrieving quote');
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
			url : misys.getServletURL("/screen/AjaxScreen/action/RequestForQuoteSearchActionTD"),
			handleAs : "json",
			content : {
				operation: 'DELAY',
				rec_id : fncGetGlobalVariable('rec_id'),
				applicant_reference: fncGetGlobalVariable('applicant_reference'),
				td_type: fncGetGlobalVariable('td_type'),
				td_cur_code: fncGetGlobalVariable('td_cur_code'),
				td_amt: fncGetGlobalVariable('td_amt'),
				value_date : fncGetGlobalVariable('input_value_date'),
				value_days : fncGetGlobalVariable('input_value_days'),
				value_period : fncGetGlobalVariable('input_value_period'),
				remarks: fncGetGlobalVariable('remarks'),
				maturity_date : fncGetGlobalVariable('input_maturity_date'),
				maturity_days : fncGetGlobalVariable('input_maturity_days'),
				maturity_period : fncGetGlobalVariable('input_maturity_period')
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
				console.error('[TradeCreateTdAjaxCall] error retrieving quote');
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

fncRejectTdRequest = function()
{
	dijit.byId('buttonAcceptRequest').set('disabled', false);
	m.xhrPost( {
		url : misys.getServletURL("/screen/AjaxScreen/action/RequestForQuoteSearchActionTD"),
		handleAs : "json",
		content : {
			operation: 'REJECT',
			applicant_reference: dijit.byId('applicant_reference').get('value'),
			trade_id : fncGetGlobalVariable('trade_id'),
			td_type: fncGetGlobalVariable('td_type'),
			rec_id : fncGetGlobalVariable('rec_id')
		},
		load : fncPerformClear,
		customError : function(response, args){
			console.error('[TdAjaxCall] error retrieving quote');
			misys.dialog.show('ERROR', misys.getLocalization('technicalError'));
			fncPerformClear();
		}
	});
};

_fncCancelDelayRequest = function()
{
	dijit.byId('buttonAcceptRequest').set('disabled', false);
	m.xhrPost( {
		url : misys.getServletURL("/screen/AjaxScreen/action/RequestForQuoteSearchActionTD"),
		handleAs : "json",
		content : {
			operation: 'CANCEL',
			applicant_reference: dijit.byId('applicant_reference').get('value'),
			trade_id : fncGetGlobalVariable('trade_id'),
			td_type: fncGetGlobalVariable('td_type'),
			rec_id : fncGetGlobalVariable('rec_id')
		},
		load : fncPerformClear,
		customError : function(response, args){
			console.error('[TdAjaxCall] error retrieving quote');
			misys.dialog.show('ERROR', misys.getLocalization('technicalError'));
			fncPerformClear();
		}
	});
};

/** Function for putting data in page elements **/
_fncGetData = function(/*JSON*/ response)
{
	dojo.query("#trade_id_report_row .content")[0].innerHTML = response.trade_id;
	dojo.query("#rate_report_row .content")[0].innerHTML = response.rate;
	dojo.query("#interest_report_row .content")[0].innerHTML = response.interest;
	dojo.query("#value_date_report_row .content")[0].innerHTML = response.value_date;
	dojo.query("#maturity_date_report_row .content")[0].innerHTML = response.maturity_date;
	
	dijit.byId('trade_id').set('value', response.trade_id);
	dijit.byId('rec_id').set('value', response.rec_id);
	dijit.byId('remarks').set('value', response.remarks);
	
	fncSetGlobalVariable('trade_id', response.trade_id);
	fncSetGlobalVariable('rec_id', response.rec_id);
	
	// hidden fields
	dijit.byId('rate').set('value', response.rate);
	dijit.byId('maturity_date').set('value', response.maturity_date);
	dijit.byId('value_date').set('value', response.value_date);
	dijit.byId('td_cur_code').set('value', response.currency);
	dijit.byId('td_amt').set('value', response.amount);
	dijit.byId('interest').set('value', response.interest);
};

/** Handle errors and display dialog **/
// TODO Continue error management 
_fncManageErrors = function(/*String*/ type, /* JSON */ response){
	var messageError = '';
	switch(type){
	case 20:
		messageError = misys.getLocalization('technicalError');
		break;
	default:
		messageError = fncGetCommonMessageError(type, response);
		break;
	}
	console.debug('[INFO] Error (on status '+type+') : '+messageError);
	misys.dialog.show('ERROR', messageError);
	fncPerformClear();
};//Including the client specific implementation
       dojo.require('misys.client.binding.cash.TradeCreateTdAjaxCall_client');