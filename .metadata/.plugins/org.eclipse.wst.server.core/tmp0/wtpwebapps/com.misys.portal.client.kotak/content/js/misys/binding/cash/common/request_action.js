/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.binding.cash.common.request_action"]){dojo._hasResource["misys.binding.cash.common.request_action"]=true;dojo.provide("misys.binding.cash.common.request_action");dojo.require("misys.binding.cash.common.timer");(function(d,dj,m){function _1(){var _2=m.getDisabledFields();d.forEach(_2,function(id){var _3=dj.byId(id);if(_3){if(id.indexOf("button")>=0||id.indexOf("img")>=0||id.indexOf("image")>=0){_3.set("disabled",true);}else{_3.set("readOnly",true);}}});};function _4(){var _5;var _6=dj.byId("sub_product_code").get("value");if("TRINT"===_6){_5=["applicant_act_name","issuing_bank_customer_reference","beneficiary_act_name","ft_amt","request_value_code","request_value_date","request_value_number","instructions_type_1","instructions_type_2","applicant_act_cur_code","applicant_cur_code","ft_cur_code"];}else{if("TRTPT"===_6){_5=["applicant_act_name","issuing_bank_customer_reference","applicant_act_amt","payment_amt","request_value_code","request_value_date","instructions_type_1","instructions_type_2","applicant_act_cur_code","applicant_cur_code","payment_cur_code"];}}return _5;};function _7(id){clearTimeout(id);m.frequencyStore=null;m.delayStore=null;};m.timer=null;m.frequencyStore=null;m.opicsFrequencyResponse=null;m.delayStore=null;d.mixin(m,{fncPerformClearWithDialog:function(){m.dialog.show("CONFIRMATION",m.getLocalization("clearMessage"),"",m.performClear);},fncPerformCancelRequest:function(){m.dialog.show("CONFIRMATION",m.getLocalization("cancelRequest"),"",m.cancelRequest);},fncPerformCancelDelayRequest:function(){console.error("[INFO] Using default function performCancelDelayRequest. This method has to be overloaded.");},fncDisableLoadingDialogClosing:function(){m.connect(dj.byId("loadingDialog"),"onKeyPress",function(_8){if(_8.keyCode===d.keys.ESCAPE){d.stopEvent(_8);}});m.connect(dj.byId("delayDialog"),"onKeyPress",function(_9){if(_9.keyCode===d.keys.ESCAPE){d.stopEvent(_9);}});},getFieldsToClear:function(){return [];},getHiddenFieldsToClear:function(){return [];},getEnabledFields:function(){return [];},getDisabledFields:function(){return [];},getDateTermFieldsToClear:function(){return [];},performClearFieldsOnFieldChange:function(){var _a=_4();d.forEach(_a,function(id){if(dj.byId(id)){dj.byId(id).set("value","");if(dj.byId(id).get("value")!==""&&!isNaN(dj.byId(id).get("value"))){dj.byId(id).reset();}dj.byId(id).set("disabled",false);}});},acceptRate:function(){var _b=dj.byId("sub_product_code").get("value");if(_b==="SPOT"){dj.byId("option").set("value","ACCEPT_SPOT");m.submit("SUBMIT");return false;}else{if(_b==="FWD"){dj.byId("option").set("value","ACCEPT_FWD");m.submit("SUBMIT");return false;}else{if(_b==="WFWD"){dj.byId("option").set("value","ACCEPT_WFWD");m.submit("SUBMIT");return false;}else{if(_b==="TRTD"){dj.byId("option").set("value","ACCEPT_TRTD");m.submit("SUBMIT");return false;}else{dj.byId("option").set("value","ACCEPT");m.submit("SUBMIT");return false;}}}}},doPerformRequest:function(){m.initVar();_1();dj.byId("loadingDialog").show();m.getRate();},showDetailField:function(){if(dj.byId("buttonAcceptRequest")){dj.byId("buttonAcceptRequest").set("disabled",false);}if(dj.byId("sendRequestId")){dj.byId("sendRequestId").set("disabled",false);}m.animate("fadeIn",d.byId("trade-details"));if(dj.byId("cancelButton2")){dj.byId("cancelButton2").focus();}},checkFields:function(){var _c=true;var _d=true;d.query(".validate").forEach(function(_e){var _f=dj.byId(_e.id);if(!_f.isValid()){if(_c){_f.validate();}_d=false;}});return _d;},closeDelayDialog:function(){dj.byId("delayDialog").hide();if(m.timer!==null){_7(m.timer);}},fncCancelDelayRequest:function(){m.closeDelayDialog();m.toggleEnableFields();m.performCancelDelayRequest();},toggleEnableFields:function(){var _10=m.getEnabledFields();m.toggleFields(true,_10,null,true,false);},performClearDetails:function(){if(!(m.timer===undefined)&&!(m.timer===null)){clearTimeout(m.timer);}if(!(m.countdown===undefined)&&!(m.countdown===null)){clearTimeout(m.countdown);m.initCountdown=true;}m.countdown=null;m.countdownProgess=null;m.timer=null;m.frequencyStore=null;m.delayStore=null;if(d.byId("edit")){m.animate("fadeOut",d.byId("trade-details"));}},performClear:function(){var _11=m.getFieldsToClear();d.forEach(_11,function(id){if(dj.byId(id)){dj.byId(id).reset();}});var _12=m.getHiddenFieldsToClear();d.forEach(_12,function(id){if(dj.byId(id)){dj.byId(id).value="";}});m.toggleEnableFields();var _13=m.getDateTermFieldsToClear();d.forEach(_13,function(id){if(dj.byId(id+"_rb1")){dj.byId(id+"_rb1").set("checked",true);fncEnableDateAccordingToContent((id+"_date"),(id+"_days"),(id+"_period"),(id+"_rb1"),(id+"_rb2"));}});m.performClearDetails();},fncContinueDelayDialog:function(){d.byId("waitingMessage").style.display="block";d.byId("continueMessage").style.display="none";d.style(dj.byId("continueDelayId").domNode,"display","none");m.frequencyStore=m.opicsFrequencyResponse;m.performDelayRequest();},validateTermNumber:function(_14,_15){var _16=d.hitch(dj.byId(_14),m.validateTermNumberField);return _16(_15);},validateDate:function(_17,_18,_19,_1a,_1b){var _1c=d.hitch(dj.byId(_17),m.validateDateTermField);return _1c(false,_18,_19,_1a,_1b);},openDelayDialog:function(_1d,_1e){d.byId("continueMessage").style.display="none";d.style(dj.byId("continueDelayId").domNode,"display","none");d.style(d.byId("waitingMessage"),"display","block");dj.byId("delayDialog").show();m.performDelayRequest();},showContinuationElement:function(){d.byId("waitingMessage").style.display="none";d.byId("continueMessage").style.display="block";d.style(dj.byId("continueDelayId").domNode,"display","inline-block");},getCommonMessageError:function(_1f,_20){var _21="";switch(_1f){case 3:_21=m.getLocalization("errorFXRateRejected");break;case 20:_21=_20.opics_error;break;case 28:_21=m.getLocalization("errorFXRateNoLongerValid");break;case 29:_21=m.getLocalization("errorFXUnknownCurrency");break;case 30:_21=m.getLocalization("errorFXUnknownCounterCurrency");break;case 31:_21=m.getLocalization("errorFXServiceClosed");break;case 32:_21=m.getLocalization("errorFXServiceNotAuthorized");break;case 33:_21=m.getLocalization("errorFXDateNotValid");break;case 34:_21=m.getLocalization("errorFXCurrencyDateNotValid");break;case 35:_21=m.getLocalization("errorFXCounterCurrencyDateNotValid",[_20.errorParam]);break;case 36:_21=m.getLocalization("errorDatenotValideInCurrencyCalendar");break;case 37:_21=m.getLocalization("errorTransactionInInvalideState");break;case 38:_21=m.getLocalization("errorSameAccount");break;case 39:_21=m.getLocalization("errorSplitAmountGreaterThanOriginalAmount");break;case 40:_21=m.getLocalization("errorPaymentAmountGreaterThanTransferAmount");break;default:_21=m.getLocalization("technicalError");break;}return _21;}});})(dojo,dijit,misys);}