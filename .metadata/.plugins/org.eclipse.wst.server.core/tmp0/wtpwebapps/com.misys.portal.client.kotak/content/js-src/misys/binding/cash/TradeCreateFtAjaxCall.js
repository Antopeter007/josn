dojo.provide("misys.binding.cash.TradeCreateFtAjaxCall");
/*
 -----------------------------------------------------------------------------
 Scripts for
  
  Fund Transfer (FT) Ajax Call, Customer Side
  

 Copyright (c) 2000-2010 Misys (http://www.misys.com),
 All Rights Reserved. 

 version:   1.0
 date:      28/01/11
 author:    Marzin Pascal
 -----------------------------------------------------------------------------
*/

//*-*-*-*-*-*-*-*-*-*-*-*
// FT Call Ajax 
//*-*-*-*-*-*-*-*-*-*-*-*

_fncAjaxRequestFT = function()
{
	dijit.byId('loadingDialog').show();
	console.debug('[INFO] Begin Ajax call');
		m.xhrPost( {
			url : misys.getServletURL("/screen/AjaxScreen/action/FTProcessingAction"),
			handleAs : "json",
			content : {
				operation: 'REQUEST',
				ft_type: fncGetGlobalVariable('ft_type'),
				applicant_reference: fncGetGlobalVariable('applicant_reference'),
				
				ordering_account: fncGetGlobalVariable('ordering_account'),
				ordering_currency: fncGetGlobalVariable('ordering_currency'),
				
				transfer_account: fncGetGlobalVariable('transfer_account'),
				transfer_amount: fncGetGlobalVariable('transfer_amount'),
				transfer_currency: fncGetGlobalVariable('transfer_currency'),
				
				beneficiary_account: fncGetGlobalVariable('beneficiary_account'),
				beneficiary_name: fncGetGlobalVariable('beneficiary_name'),
				beneficiary_address: fncGetGlobalVariable('beneficiary_address'),
				beneficiary_city: fncGetGlobalVariable('beneficiary_city'),
				beneficiary_country: fncGetGlobalVariable('beneficiary_country'),
				beneficiary_bank: fncGetGlobalVariable('beneficiary_bank'),
				
				beneficiary_bank_routing_number: fncGetGlobalVariable('beneficiary_bank_routing_number'),
				beneficiary_bank_branch: fncGetGlobalVariable('beneficiary_bank_branch'),
				beneficiary_bank_address: fncGetGlobalVariable('beneficiary_bank_address'),
				beneficiary_bank_city: fncGetGlobalVariable('beneficiary_bank_city'),
				beneficiary_bank_country: fncGetGlobalVariable('beneficiary_bank_country'),
				beneficiary_bank_account: fncGetGlobalVariable('beneficiary_bank_account'),
				
				ft_amount: fncGetGlobalVariable('ft_amount'),
				ft_cur_code: fncGetGlobalVariable('ft_cur_code'),
				execution_date: fncGetGlobalVariable('execution_date'),
				payment_currency: fncGetGlobalVariable('payment_currency'),
				payment_amount: fncGetGlobalVariable('payment_amount'),
				
				remarks: fncGetGlobalVariable('remarks'),
				
				fee_account: fncGetGlobalVariable('fee_account')
				
			},
			load : function(response, args){
				console.debug('[INFO] Ajax call success.');
				dijit.byId('loadingDialog').hide();
				var status = response.status;
				console.debug('[INFO] Response status is:'+status);
				switch(status){
				/* request return with rate */
				case 5:
					fncShowDealSummaryDialog(response);
					break;
				// request accepted - mono currency
				case 1:
					fncShowDealSummaryDialog(response);
					break;
				// for request with manual rate
				case 6:
					dijit.byId('bo_tnx_id').set('value', response.boTnxId);
					dijit.byId('bo_ref_id').set('value', response.bo_ref_id);
					misys.frequencyStore = response.delay_frequency;
					misys.delayStore = response.delay_timeout;
					_fncOpenDelayDialog(misys.frequencyStore, misys.delayStore);
					break;
				default:
					var errors = response.error_names;
					_fncManageErrors(errors);
				break;
				}
			},
			customError : function(response, args){
				dijit.byId('loadingDialog').hide();
				console.error('[requestFTAjaxCall] Error on Ajax Call for Request Fund Transfer');
				_fncManageErrors();
			}
		});
};

_fncAjaxCancelFT = function()
{
	dijit.byId('loadingDialog').show();
	console.debug('[INFO] Begin Ajax call');
		m.xhrPost( {
			url : misys.getServletURL("/screen/AjaxScreen/action/FTProcessingAction"),
			handleAs : "json",
			content : {
				operation: 'REJECT',
				ft_type: fncGetGlobalVariable('ft_type'),
				applicant_reference: fncGetGlobalVariable('applicant_reference'),
				ordering_account: fncGetGlobalVariable('ordering_account'),
				ordering_currency: fncGetGlobalVariable('ordering_currency'),
				
				beneficiary_account: fncGetGlobalVariable('beneficiary_account'),
				beneficiary_name: fncGetGlobalVariable('beneficiary_name'),
				beneficiary_address: fncGetGlobalVariable('beneficiary_address'),
				beneficiary_city: fncGetGlobalVariable('beneficiary_city'),
				beneficiary_country: fncGetGlobalVariable('beneficiary_country'),
				beneficiary_bank: fncGetGlobalVariable('beneficiary_bank'),
				
				beneficiary_bank_routing_number: fncGetGlobalVariable('beneficiary_bank_routing_number'),
				beneficiary_bank_branch: fncGetGlobalVariable('beneficiary_bank_branch'),
				beneficiary_bank_address: fncGetGlobalVariable('beneficiary_bank_address'),
				beneficiary_bank_city: fncGetGlobalVariable('beneficiary_bank_city'),
				beneficiary_bank_country: fncGetGlobalVariable('beneficiary_bank_country'),
				beneficiary_bank_account: fncGetGlobalVariable('beneficiary_bank_account'),
				
				ft_amount: fncGetGlobalVariable('ft_amount'),
				ft_cur_code: fncGetGlobalVariable('ft_cur_code'),
				execution_date: fncGetGlobalVariable('execution_date'),
				remarks: fncGetGlobalVariable('remarks'),
				bo_ref_id: dijit.byId('bo_ref_id').get('value'),
				bo_tnx_id: dijit.byId('bo_tnx_id').get('value'),
				credit_account_name: dijit.byId('creditAccountName').get('value')
				
			},
			load : function(response, args){
				console.debug('[INFO] Ajax call success.');
				dijit.byId('loadingDialog').hide();
				var status = response.status;
				console.debug('[INFO] Response status is:'+status);
				switch(status){
				/* request canceled */
				case 3:
					// TODO 
					//fncPerformClear();
					fncCloseDealSummaryDialog();
					misys.dialog.show('CUSTOM-NO-CANCEL', misys.getLocalization('confirmationRejectRequest'), misys.getLocalization('confirmationRejectTitle'));
					break;
				

				default:
					_fncManageErrors(status);
				break;
				}
			},
			customError : function(response, args){
				console.error('[CancelFTAjaxCall] error canceling FT quote');
				dijit.byId('loadingDialog').hide();
				fncCloseDealSummaryDialog();
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
			url : misys.getServletURL("/screen/AjaxScreen/action/FTProcessingAction"),
			handleAs : "json",
			content : {
				operation: 'DELAY',
				ft_type: fncGetGlobalVariable('ft_type'),
				applicant_reference: fncGetGlobalVariable('applicant_reference'),
				bo_ref_id: dijit.byId('bo_ref_id').get('value'),
				bo_tnx_id: dijit.byId('bo_tnx_id').get('value'),
				
				ordering_account: fncGetGlobalVariable('ordering_account'),
				ordering_currency: fncGetGlobalVariable('ordering_currency'),
				
				transfer_account: fncGetGlobalVariable('transfer_account'),
				transfer_amount: fncGetGlobalVariable('transfer_amount'),
				transfer_currency: fncGetGlobalVariable('transfer_currency'),
				
				beneficiary_account: fncGetGlobalVariable('beneficiary_account'),
				beneficiary_name: fncGetGlobalVariable('beneficiary_name'),
				beneficiary_address: fncGetGlobalVariable('beneficiary_address'),
				beneficiary_city: fncGetGlobalVariable('beneficiary_city'),
				beneficiary_country: fncGetGlobalVariable('beneficiary_country'),
				beneficiary_bank: fncGetGlobalVariable('beneficiary_bank'),
				
				beneficiary_bank_routing_number: fncGetGlobalVariable('beneficiary_bank_routing_number'),
				beneficiary_bank_branch: fncGetGlobalVariable('beneficiary_bank_branch'),
				beneficiary_bank_address: fncGetGlobalVariable('beneficiary_bank_address'),
				beneficiary_bank_city: fncGetGlobalVariable('beneficiary_bank_city'),
				beneficiary_bank_country: fncGetGlobalVariable('beneficiary_bank_country'),
				beneficiary_bank_account: fncGetGlobalVariable('beneficiary_bank_account'),
				
				ft_amount: fncGetGlobalVariable('ft_amount'),
				ft_cur_code: fncGetGlobalVariable('ft_cur_code'),
				execution_date: fncGetGlobalVariable('execution_date'),
				payment_currency: fncGetGlobalVariable('payment_currency'),
				payment_amount: fncGetGlobalVariable('payment_amount'),
				remarks: fncGetGlobalVariable('remarks'),
				fee_account: fncGetGlobalVariable('fee_account')
			},
			load : function(response, args){
				var status = response.status;
				console.debug('[FtAjaxCall] Ajax call success.');
				console.debug('[FtAjaxCall] Response status is:'+status);
				switch (status)
				{
				case 5:
					fncCloseDelayDialog();
					fncShowDealSummaryDialog(response);
					break;
				case 6:
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
				fncCloseDelayDialog();
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

_fncCancelDelayRequest = function()
{
	dijit.byId('loadingDialog').show();
	console.debug('[INFO] Begin Ajax call');
		m.xhrPost( {
			url : misys.getServletURL("/screen/AjaxScreen/action/FTProcessingAction"),
			handleAs : "json",
			content : {
				operation: 'CANCEL',
				ft_type: fncGetGlobalVariable('ft_type'),
				applicant_reference: fncGetGlobalVariable('applicant_reference'),
				ordering_account: fncGetGlobalVariable('ordering_account'),
				ordering_currency: fncGetGlobalVariable('ordering_currency'),
				
				beneficiary_account: fncGetGlobalVariable('beneficiary_account'),
				beneficiary_name: fncGetGlobalVariable('beneficiary_name'),
				beneficiary_address: fncGetGlobalVariable('beneficiary_address'),
				beneficiary_city: fncGetGlobalVariable('beneficiary_city'),
				beneficiary_country: fncGetGlobalVariable('beneficiary_country'),
				beneficiary_bank: fncGetGlobalVariable('beneficiary_bank'),
				
				beneficiary_bank_routing_number: fncGetGlobalVariable('beneficiary_bank_routing_number'),
				beneficiary_bank_branch: fncGetGlobalVariable('beneficiary_bank_branch'),
				beneficiary_bank_address: fncGetGlobalVariable('beneficiary_bank_address'),
				beneficiary_bank_city: fncGetGlobalVariable('beneficiary_bank_city'),
				beneficiary_bank_country: fncGetGlobalVariable('beneficiary_bank_country'),
				beneficiary_bank_account: fncGetGlobalVariable('beneficiary_bank_account'),
				
				ft_amount: fncGetGlobalVariable('ft_amount'),
				ft_cur_code: fncGetGlobalVariable('ft_cur_code'),
				execution_date: fncGetGlobalVariable('execution_date'),
				remarks: fncGetGlobalVariable('remarks'),
				bo_ref_id: dijit.byId('bo_ref_id').get('value'),
				bo_tnx_id: dijit.byId('bo_tnx_id').get('value'),
				credit_account_name: dijit.byId('creditAccountName').get('value')
				
			},
			load : function(response, args){
				console.debug('[INFO] Ajax call success.');
				dijit.byId('loadingDialog').hide();
				var status = response.status;
				console.debug('[INFO] Response status is:'+status);
				switch(status){
				/* request canceled */
				case 3:
					// TODO 
					//fncPerformClear();
					fncCloseDealSummaryDialog();
					misys.dialog.show('CUSTOM-NO-CANCEL', misys.getLocalization('confirmationCancelRequest'), misys.getLocalization('confirmationCancelTitle'));
					break;
				

				default:
					_fncManageErrors(status);
				break;
				}
			},
			customError : function(response, args){
				console.error('[CancelFTAjaxCall] error canceling FT quote');
				dijit.byId('loadingDialog').hide();
				fncCloseDealSummaryDialog();
				_fncManageErrors();
			}
		});
};

//*-*-*-*-*-*-*-*-*-*-*-*
// Errors Management
//*-*-*-*-*-*-*-*-*-*-*-*
/** Handle errors and display dialog **/
// TODO Continue error management 
_fncManageErrors = function(/*Array String*/ errors, /* JSON */ response){
	var errorMessage = '';
	for(var i=0, len=errors.length; i<len; i++){	
		errorMessage += misys.getLocalization(errors[i]);
	}

	misys.dialog.show('ERROR', errorMessage);
	fncPerformClear();
};//Including the client specific implementation
       dojo.require('misys.client.binding.cash.TradeCreateFtAjaxCall_client');