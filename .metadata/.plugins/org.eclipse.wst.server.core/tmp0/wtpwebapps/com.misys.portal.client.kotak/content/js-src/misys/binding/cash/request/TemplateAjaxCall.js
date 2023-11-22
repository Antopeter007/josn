dojo.provide("misys.binding.cash.request.TDAjaxCall");
/**
 * Replace TD by your productCode in dojo.provide path  
 */


/**
 * Request fonction 
 * fill content object with field information to send in request
 * replace TD by your product code in error message
 */
_fncAjaxGetRate = function()
{
	console.debug('[INFO] Begin Ajax call');
	misys.xhrPost(
			{
			url: misys.getServletURL("/screen/AjaxScreen/action/RequestForQuoteSearchActionTD"),
			handleAs: "json",
			load: function(response, args){
				console.debug('[INFO] Ajax call success.');
				dijit.byId('loadingDialog').hide();
				var status = response.status;
				console.debug('[INFO] Response status is:'+status);
				switch(status){
				/* request return with rate */
				case 5:
					_fncGetData(response);
					// Countdown start
					validity = response.validity;
					_fncCountdown(validity);
					fncShowDetailField();
					break;
					/*  ??   */
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
			  content: {
				  operation: 'REQUEST'
						/* Add requested field 
						 * Exemple : 
						 *	applicant_reference: fncGetGlobalVariable('applicant_reference'),
						 *	td_cur_code: fncGetGlobalVariable('td_cur_code'),
						 *	td_amt: fncGetGlobalVariable('td_amt')
						 */
			  }, 
			  customError: function(response, args){
					dijit.byId('loadingDialog').hide();
					console.error('[TDAjaxCall] error retrieving quote');
					_fncManageErrors();
			  }
			}
		);
	
	/*dojo.xhrGet( {
		url : misys.getServletURL("/screen/AjaxScreen/action/RequestForQuoteSearchActionTD"),
		content : {
			operation: 'REQUEST'
		},
		handleAs : "json",
		contentType : "application/json; charset=utf-8",
		sync : false,
		timeout : 300000,
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
				frenquencyStore = response.delay_frequency;
				delayStore = response.delay_timeout;
				_fncOpenDelayDialog(frenquencyStore, delayStore);
				break;

			default:
				_fncManageErrors(status);
			break;
			}
		},
		error : function(response, args){
			dijit.byId('loadingDialog').hide();
			console.error('[TDAjaxCall] error retrieving quote');
			_fncManageErrors();
		}
	});*/
};

/** To cancel the request 
 * fill content object with field information to send in cancel request
 * replace TD by your product code in error message
 * 
 * **/
fncCancelRequest = function()
{
	dijit.byId('buttonAcceptRequest').set('disabled', false);
	
	misys.xhrPost(
		{
			url: misys.getServletURL("/screen/AjaxScreen/action/RequestForQuoteSearchActionTD"),
			handleAs: "json",
			load: fncPerformClear,
			content: {
				operation: 'CANCEL'
				/* Add requested field 
				 * Exemple : 
				 *	applicant_reference: fncGetGlobalVariable('applicant_reference'),
				 *	td_cur_code: fncGetGlobalVariable('td_cur_code'),
				 *	td_amt: fncGetGlobalVariable('td_amt')
				 */
			},
			customError: function(response, args){
				console.error('[TdAjaxCall] error retrieving quote');
				misys.dialog.show('ERROR', misys.getLocalization('technicalError'));
				fncPerformClear();
			}
		}
	);
	
	/*dojo.xhrGet( {
		url : misys.getServletURL("/screen/AjaxScreen/action/RequestForQuoteSearchActionTD"),
		content : {
			operation: 'CANCEL'
				
		},
		handleAs : "json",
		contentType : "application/json; charset=utf-8",
		sync : false,
		timeout : 300000,
		load : function(response, args){
			fncPerformClear();
			return;
		},
		error : function(response, args){
			console.error('[TdAjaxCall] error retrieving quote');
			misys.dialog.show('ERROR', misys.getLocalization('technicalError'));
			fncPerformClear();
		}
	});*/
};

/** Function for putting data in page elements 
 * fill your page element
 * **/

_fncGetData = function(/*JSON*/ response)
{
	dojo.query("#trade_id_report_row .content")[0].innerHTML = response.trade_id;
	dijit.byId('trade_id').set('value', response.trade_id);
	dijit.byId('rec_id').set('value', response.rec_id);
	fncSetGlobalVariable('trade_id', response.trade_id);
	fncSetGlobalVariable('rec_id', response.rec_id);
	dojo.query("#rate_report_row .content")[0].innerHTML = response.rate;

	// hidden fields
	/* put your hidden field 
	 * exemple : 
	 *  dijit.byId('rate').set('value', response.rate);
	 *	dijit.byId('maturity_date').set('value', response.maturity_date);
	 *	dijit.byId('value_date').set('value', response.value_date);
	 *	dijit.byId('td_cur_code').set('value', response.currency);
	 *	dijit.byId('td_amt').set('value', response.amount); 
	 * 
	 * */


};

/** Handle errors and display dialog **/
// TODO Continue error management 
_fncManageErrors = function(/*String*/ type, /* JSON */ response){
	var messageError = '';
	switch(type){
	case 0:
		messageError = misys.getLocalization('errorFXRateRejected');
		break;
	case 3:
		messageError = misys.getLocalization('errorFXRateRejected');
		break;
	case 8:
		messageError = misys.getLocalization('errorFXRateNoLongerValid', [response.rate]);
		break;
	case 9:
		messageError = misys.getLocalization('errorFXUnknownCurrency', [response.currency]);
		break;
	case 10:
		messageError = misys.getLocalization('errorFXUnknownCounterCurrency', [response.conter_currency]);
		break;
	case 11:
		messageError = misys.getLocalization('errorFXServiceClosed');
		break;
	case 12:
		messageError = misys.getLocalization('errorFXServiceNotAuthorized');
		break;
	case 13:
		messageError = misys.getLocalization('errorFXDateNotValid', [response.value_date]);
		break;
	case 14:
		messageError = misys.getLocalization('errorFXCurrencyDateNotValid', [response.value_date]);
		break;
	case 15:
		messageError = misys.getLocalization('errorFXCounterCurrencyDateNotValid', [response.value_date]);
		break;
	default:
		messageError = misys.getLocalization('technicalError');
		break;
	}
	fncPerformClear();
	console.debug('[INFO] Error (on status '+type+') : '+messageError);
	misys.dialog.show('ERROR', messageError, '', fncPerformClear);
	
};