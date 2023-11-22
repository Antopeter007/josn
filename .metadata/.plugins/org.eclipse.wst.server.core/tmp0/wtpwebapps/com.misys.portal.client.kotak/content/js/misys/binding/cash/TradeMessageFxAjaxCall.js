/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.binding.cash.TradeMessageFxAjaxCall"]){dojo._hasResource["misys.binding.cash.TradeMessageFxAjaxCall"]=true;dojo.provide("misys.binding.cash.TradeMessageFxAjaxCall");_fncAjaxGetRate=function(){m.xhrPost({url:misys.getServletURL("/screen/AjaxScreen/action/RequestForQuoteSearchActionFX"),handleAs:"json",content:{operation:"REQUESTUPDATE",applicant_reference:fncGetGlobalVariable("applicant_reference"),original_deal_id:fncGetGlobalVariable("original_deal_id"),ref_id:fncGetGlobalVariable("fx_ref_id"),bo_ref_id:fncGetGlobalVariable("fx_bo_ref_id"),fx_contract_type:fncGetGlobalVariable("fx_contract_type"),sub_tnx_type_code:fncGetGlobalVariable("sub_tnx_type_code"),fx_amt:fncGetGlobalVariable("fx_amt"),fx_cur_code:fncGetGlobalVariable("fx_cur_code"),remarks:fncGetGlobalVariable("remarks"),value_date:fncGetGlobalVariable("input_value_date"),value_days:fncGetGlobalVariable("input_value_days"),value_period:fncGetGlobalVariable("input_value_period"),fx_type:fncGetGlobalVariable("fx_type"),contract_type:fncGetGlobalVariable("contract_type"),counter_cur_code:fncGetGlobalVariable("counter_cur_code"),org_fx_cur_code:fncGetGlobalVariable("org_fx_cur_code"),org_fx_amt:fncGetGlobalVariable("org_fx_amt"),org_counter_cur_code:fncGetGlobalVariable("org_counter_cur_code"),org_counter_amt:fncGetGlobalVariable("org_counter_amt"),org_rate:fncGetGlobalVariable("org_rate"),org_maturity_date:fncGetGlobalVariable("org_maturity_date")},load:function(_1,_2){dijit.byId("loadingDialog").hide();var _3=_1.status;switch(_3){case 5:_fncGetData(_1);validity=_1.validity;_fncCountdown(validity);fncShowDetailField();break;case 6:fncSetGlobalVariable("trade_id",_1.trade_id);fncSetGlobalVariable("rec_id",_1.rec_id);misys.frequencyStore=_1.delay_frequency;misys.delayStore=_1.delay_timeout;_fncOpenDelayDialog(misys.frequencyStore,misys.delayStore);break;default:_fncManageErrors(_3);break;}},customError:function(_4,_5){dijit.byId("loadingDialog").hide();console.error("[FXMessageAjaxCall] error retrieving quote");_fncManageErrors();}});};_fncPerformDelayRequest=function(_6,_7){if(_6>0){m.xhrPost({url:misys.getServletURL("/screen/AjaxScreen/action/RequestForQuoteSearchActionFX"),handleAs:"json",content:{operation:"DELAY",applicant_reference:fncGetGlobalVariable("applicant_reference"),rec_id:fncGetGlobalVariable("rec_id"),fx_amt:fncGetGlobalVariable("fx_amt"),fx_cur_code:fncGetGlobalVariable("fx_cur_code"),sub_tnx_type_code:fncGetGlobalVariable("sub_tnx_type_code"),remarks:fncGetGlobalVariable("remarks"),value_date:fncGetGlobalVariable("input_value_date"),value_days:fncGetGlobalVariable("input_value_days"),value_period:fncGetGlobalVariable("input_value_period"),trade_id:fncGetGlobalVariable("trade_id"),fx_type:fncGetGlobalVariable("fx_type"),contract_type:fncGetGlobalVariable("contract_type"),counter_cur_code:fncGetGlobalVariable("counter_cur_code")},load:function(_8,_9){var _a=_8.status;switch(_a){case 5:_fncGetData(_8);fncCloseDelayDialog();validity=_8.validity;_fncCountdown(validity);fncShowDetailField();break;case 6:fncSetGlobalVariable("rec_id",_8.rec_id);_6--;misys.timer=setTimeout("_fncPerformDelayRequest('"+_6+"','"+_7+"')",(_7*1000));break;default:fncCloseDelayDialog();_fncManageErrors(_a,_8);break;}},customError:function(_b,_c){console.error("[FXMessageAjaxCall] error retrieving quote");_fncManageErrors("",_b);}});}else{_stopCountDown(misys.timer);_fncShowContinuationElement();}};_fncCancelDelayRequest=function(){m.xhrPost({url:misys.getServletURL("/screen/AjaxScreen/action/RequestForQuoteSearchActionFX"),handleAs:"json",content:{operation:"CANCEL",applicant_reference:dijit.byId("applicant_reference").get("value"),trade_id:fncGetGlobalVariable("trade_id"),rec_id:fncGetGlobalVariable("rec_id"),fx_type:fncGetGlobalVariable("fx_type"),contract_type:fncGetGlobalVariable("contract_type"),counter_cur_code:fncGetGlobalVariable("counter_cur_code"),fx_cur_code:fncGetGlobalVariable("fx_cur_code"),fx_amt:fncGetGlobalVariable("fx_amt"),value_date:fncGetGlobalVariable("input_value_date"),value_days:fncGetGlobalVariable("input_value_days"),value_period:fncGetGlobalVariable("input_value_period"),near_date:fncGetGlobalVariable("input_near_date"),near_days:fncGetGlobalVariable("input_near_days"),near_period:fncGetGlobalVariable("input_near_period"),near_amt:fncGetGlobalVariable("near_amt"),remarks:fncGetGlobalVariable("remarks"),option_date:fncGetGlobalVariable("input_option_date"),option_days:fncGetGlobalVariable("input_option_days"),option_period:fncGetGlobalVariable("input_option_period")},load:function(_d,_e){var _f=_d.status;switch(_f){case 7:misys.dialog.show("CUSTOM-NO-CANCEL",misys.getLocalization("confirmationCancelRequest"),misys.getLocalization("confirmationCancelTitle"));break;default:_fncManageErrors(_f,_d);break;}},customError:function(_10,_11){misys.dialog.show("ERROR",misys.getLocalization("technicalError"));fncPerformClear();}});};fncCancelRequest=function(){dijit.byId("buttonAcceptRequest").set("disabled",false);m.xhrPost({url:misys.getServletURL("/screen/AjaxScreen/action/RequestForQuoteSearchActionFX"),handleAs:"json",content:{operation:"CANCEL",applicant_reference:dijit.byId("applicant_reference").get("value"),trade_id:fncGetGlobalVariable("trade_id"),rec_id:fncGetGlobalVariable("rec_id"),fx_amt:fncGetGlobalVariable("fx_amt"),fx_cur_code:fncGetGlobalVariable("fx_cur_code"),value_date:fncGetGlobalVariable("input_value_date"),value_days:fncGetGlobalVariable("input_value_days"),value_period:fncGetGlobalVariable("input_value_period")},load:fncPerformClear,customError:function(_12,_13){console.error("[FXMessageAjaxCall] error retrieving quote");misys.dialog.show("ERROR",misys.getLocalization("technicalError"));fncPerformClear();}});};_fncGetData=function(_14){dojo.query("#trade_id_report_row .content")[0].innerHTML=_14.trade_id;dojo.query("#org_amount_report_row .content")[0].innerHTML=_14.amount;dojo.query("#org_ctr_amount_report_row .content")[0].innerHTML=_14.counter_amount;dojo.query("#amount_report_row .content")[0].innerHTML=_14.updateAmount;dojo.query("#ctr_amount_report_row .content")[0].innerHTML=_14.updateCounterAmount;dojo.query("#rate_report_row .content")[0].innerHTML=_14.updateRate;dojo.query("#value_date_report_row .content")[0].innerHTML=_14.value_date;dijit.byId("trade_id").set("value",_14.trade_id);dijit.byId("rec_id").set("value",_14.rec_id);dijit.byId("remarks").set("value",_14.remarks);fncSetGlobalVariable("trade_id",_14.trade_id);fncSetGlobalVariable("rec_id",_14.rec_id);dijit.byId("rate").set("value",_14.rate);dijit.byId("value_date").set("value",_14.value_date);};_fncManageErrors=function(_15,_16){var _17="";var _18;switch(_15){case 20:_17=misys.getLocalization("errorFXRateRejected");break;case 3:_17=misys.getLocalization("errorFXRateRejected");break;case 28:_17=misys.getLocalization("errorFXRateNoLongerValid");break;case 29:_17=misys.getLocalization("errorFXUnknownCurrency");break;case 30:_17=misys.getLocalization("errorFXUnknownCounterCurrency",[_16.conter_currency]);break;case 31:_17=misys.getLocalization("errorFXServiceClosed");break;case 32:_17=misys.getLocalization("errorFXServiceNotAuthorized");break;case 33:_17=misys.getLocalization("errorFXDateNotValid");break;case 34:_17=misys.getLocalization("errorFXCurrencyDateNotValid");break;case 35:_17=misys.getLocalization("errorFXCounterCurrencyDateNotValid");break;default:_17=fncGetCommonMessageError(_15,_16);break;}misys.dialog.show("ERROR",_17);fncPerformClear();misys.animate("fadeIn",dojo.byId("request-button"));};dojo.require("misys.client.binding.cash.TradeMessageFxAjaxCall_client");}