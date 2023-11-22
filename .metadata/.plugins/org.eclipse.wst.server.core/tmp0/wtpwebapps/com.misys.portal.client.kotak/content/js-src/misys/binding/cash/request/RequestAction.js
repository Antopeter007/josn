dojo.provide("misys.binding.cash.request.RequestAction");
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

dojo.require("misys.binding.cash.request.Timer");

/** to store the timer &a other for the ajaxcall for the manual mode **/
misys.timer = null;
misys.frequencyStore = null;
misys.delayStore = null;
/*
 * Call this function with this 3 args 
 * 
 * Arrays(String) fieldsToClear  
 * Arrays(String) hiddenFieldsToClear  
 * Arrays(String) fieldsToEnable 
 * 
 */
// TODO Why are all these in functions? Why can't we just call misys.dialog.show directly?
fncPerformClearWithDialog = function(){
	misys.dialog.show('CONFIRMATION', misys.getLocalization('clearMessage'), '', fncPerformClear);
};

fncPerformCancelRequest = function(){
	console.debug('[INFO] cancel request with confirmation');
	misys.dialog.show('CONFIRMATION',misys.getLocalization('cancelRequest'), '', fncCancelRequest);
};

fncDisableLoadingDialogClosing = function(){
	//	Disable loadingDialog closing by using the escape key
	misys.connect(dijit.byId('loadingDialog'), 'onKeyPress', function (evt){
		if(evt.keyCode == dojo.keys.ESCAPE){
			dojo.stopEvent(evt);
		}
	});
	//	Disable waitingDialog closing by using the escape key
	misys.connect(dijit.byId('delayDialog'), 'onKeyPress', function (evt){
		if(evt.keyCode == dojo.keys.ESCAPE){
			dojo.stopEvent(evt);
		}
	});
};

/** submit form **/
fncAcceptRate = function()
{
	dijit.byId('option').set('value', 'ACCEPT');
	misys.submit('SUBMIT');
	return false;
};

//button request action 
fncDoPerformRequest = function()
{
	// init variable
	fncInitVar();
	// disabled fields
	_fncDisabledFields();
	// show the waiting dialog
	dijit.byId('loadingDialog').show();
	// call ajax service
	_fncAjaxGetRate();
};

_fncEnableFields = function()
{
	var fieldsToEnable = _fncGetEnabledFields();
	dojo.forEach(fieldsToEnable, function(id){
		var field = dijit.byId(id);
		if(field)
		{	
		misys.toggleRequired(field,true);
		field.set('disabled', false);
		}
	});
};


fncShowDetailField = function()
{
	// reset the button 'accpet'
	dijit.byId('buttonAcceptRequest').set('disabled', false);
	// display the field
	misys.animate("fadeIn", dojo.byId('trade-details'));
};

/** Function use for checking fields **/
fncCheckFields = function()
{
	doRealValidation = true;
	returnValue = true;
	dojo.query(".validate").forEach(
			function(form){
				var formObj = dijit.byId(form.id);
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
};

//close the delay dialog
fncCloseDelayDialog = function ()
{
	dijit.byId('delayDialog').hide();
	if (misys.timer != null){
		_stopDelayTimer(misys.timer);
	}
};

fncCancelDelayRequest = function(){
	fncCloseDelayDialog();
	fncPerformClear();
	_fncCancelDelayRequest();
};

_fncCancelDelayRequest = function(){
	console.error('[INFO] Using default function _fncCancelDelayRequest. This method has to be overloaded.');
};

/* Fields to disable during request */
_fncDisabledFields = function()
{
	var fieldsToDisable = _fncGetDisabledFields();

	dojo.forEach(fieldsToDisable, function(id){
		var field = dijit.byId(id);
		if(field)
		{
			field.set('disabled', true);
		}
	});
};


fncPerformClear = function(){

	var fieldsToClear = _fncGetFieldsToClear();
	dojo.forEach(fieldsToClear, function(id){
		if(dijit.byId(id))
		{
			dijit.byId(id).reset();
		}
	});

	var hiddenFieldsToClear = _fncGetHiddenFieldsToClear();
	dojo.forEach(hiddenFieldsToClear, function(id){
		if(dijit.byId(id))
		{
			dijit.byId(id).value = '';
		}
	});

	var fieldsToEnable = _fncGetEnabledFields();
	dojo.forEach(fieldsToEnable, function(id){
		//var field = dijit.byId(id);
		if(dijit.byId(id))
		{
			dijit.byId(id).set('disabled', false);
		}
	});

	//reset dateTermField
	var fieldsToReset = _fncGetDateTermFieldsToClear();
	dojo.forEach(fieldsToReset, function(id){
		if (dijit.byId(id+'_rb1'))
		{
			dijit.byId(id+'_rb1').set('checked', true);
			fncEnableDateAccordingToContent(/*String*/ (id+"_date"), /*String*/ (id+"_days"), /*String*/ (id+"_period"),(id+"_rb1"),(id+"_rb2"));
		}
	});

	// reset variables
	if (!(misys.timer === undefined) && !(misys.timer == null)){
		clearTimeout(misys.timer);
	}
	if (!(misys.countdown === undefined) && !(misys.countdown == null)){
		clearTimeout(misys.countdown);
		misys.initCountdown = true;
	}
	misys.countdown = null;
	misys.countdownProgess = null;
	misys.timer = null;
	misys.frequencyStore = null;
	misys.delayStore = null;
	// hide details field when page is on edit mode
	// prevent to hide the field on review mode
	if (dojo.byId('edit')){
		misys.animate("fadeOut", dojo.byId('trade-details'));
	}
};
/*Default function for fncPerformClear*/
_fncGetFieldsToClear = function(){
	console.debug('[INFO] Using default function _fncGetFieldsToClear. This method has to be overloaded.');
	return [];
};
_fncGetHiddenFieldsToClear = function(){
	console.debug('[INFO] Using default function _fncGetHiddenFieldsToClear. This method has to be overloaded.');
	return [];
};
_fncGetEnabledFields = function(){
	console.debug('[INFO] Using default function _fncGetEnabledFields. This method has to be overloaded.');
	return [];
};
_fncGetDateTermFieldsToClear = function(){
	console.debug('[INFO] Using default function _fncGetDateTermFieldsToClear. This method has to be overloaded.');
	return [];
};
/**
 * Fonction use for the manuel mode
 */
// open the delay dialog
_fncOpenDelayDialog = function(/*int*/frequency, /*int*/delay)
{
	dojo.byId('continueMessage').style.display = 'none';
	dojo.style(dijit.byId('continueDelayId').domNode, 'display', 'none');
	dojo.style(dojo.byId('waitingMessage'), 'display', 'block');
	dijit.byId('delayDialog').show();
	_fncPerformDelayRequest(frequency, delay);
	
};

_fncShowContinuationElement = function()
{
	dojo.byId('waitingMessage').style.display = 'none';
	dojo.byId('continueMessage').style.display = 'block';
	//dojo.byId('continueDelayId').style.display = 'block';
	dojo.style(dijit.byId('continueDelayId').domNode, 'display', 'inline-block');
};
fncContinueDelayDialog = function()
{
	dojo.byId('waitingMessage').style.display = 'block';
	dojo.byId('continueMessage').style.display = 'none';
	//dojo.byId('continueDelayId').style.display = 'none';
	dojo.style(dijit.byId('continueDelayId').domNode, 'display', 'none');
	_fncPerformDelayRequest(misys.frequencyStore, misys.delayStore);
};
// stop the manuel mode timer
_stopDelayTimer = function(id)
{
	clearTimeout(id);
	misys.frequencyStore = null;
	misys.delayStore = null;
};

fncValidateDate = function(/*String*/ idWidgetHitch, /*String*/ idComparedWidget, /*String*/errorMessage, /*boolean*/ smaller,/*Date*/ startdate){
	var validateDateTermFieldHitched = dojo.hitch(dijit.byId(idWidgetHitch), misys.validateDateTermField);
	return validateDateTermFieldHitched(false, idComparedWidget, errorMessage, smaller,startdate);
};


fncGetCommonMessageError = function(/*String*/ type, /* JSON */ response)
{

	var messageError = '';
	switch(type){
	case 20:
		messageError = misys.getLocalization('technicalError');
		break;
	case 36:
		messageError = misys.getLocalization('errorDatenotValideInCurrencyCalendar');
		break;
	case 37:
		messageError = misys.getLocalization('errorTransactionInInvalideState');
		break;
	case 38:
		messageError = misys.getLocalization('errorSameAccount');
		break;
	case 39:
		messageError = misys.getLocalization('errorSplitAmountGreaterThanOriginalAmount');
		break;
	default:
		messageError = misys.getLocalization('technicalError');
		break;
	}
	return messageError;

};
