/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.binding.cash.TradeMessageFxBinding"]){dojo._hasResource["misys.binding.cash.TradeMessageFxBinding"]=true;dojo.provide("misys.binding.cash.TradeMessageFxBinding");dojo.require("misys.form.common");dojo.require("misys.validation.common");dojo.require("dijit.form.Form");dojo.require("dijit.form.Button");dojo.require("dijit.form.TextBox");dojo.require("misys.widget.Dialog");dojo.require("dijit.ProgressBar");dojo.require("dijit.form.ValidationTextBox");dojo.require("dijit.form.CheckBox");dojo.require("dijit.layout.ContentPane");dojo.require("dojo.data.ItemFileReadStore");dojo.require("dijit.form.DateTextBox");dojo.require("misys.form.CurrencyTextBox");dojo.require("dijit.form.NumberTextBox");dojo.require("dijit.form.FilteringSelect");dojo.require("misys.form.SimpleTextarea");dojo.require("misys.form.DateTermField");dojo.require("misys.widget.Collaboration");dojo.require("misys.binding.cash.request.RequestAction");dojo.require("misys.binding.cash.TradeMessageFxAjaxCall");dojo.require("dojo.parser");dojo.require("dojo.date");var tabIdRequiredSplit=["input_split_value","input_split_amt","select_split_cur_code_CCY","select_split_cur_code_CTR_CCY"];var tabIdRequiredExtend=["input_extend_value"];var tabIdRequiredUptake=["input_uptake_value"];var tabIdRequiredTakedown=["input_takedown_value","input_takedown_amt"];fncDoBinding=function(){misys.connect("sub_tnx_type_code","onChange",function(){_fncToggleAction(this.get("value"));});misys.connect("select_split_cur_code_CCY","onChange",function(){if(dijit.byId("select_split_cur_code_CCY").checked){dijit.byId("input_split_cur_code").set("value",dijit.byId("fx_cur_code").get("value"));}else{dijit.byId("input_split_cur_code").set("value",dijit.byId("counter_cur_code").get("value"));}});misys.setValidation("input_takedown_amt",function(_1){return _fncValidateAmount(_1,this,"fx","fx_amt");});misys.setValidation("input_split_amt",function(_2){if(dijit.byId("select_split_cur_code_CCY").checked){return _fncValidateAmount(_2,this,"fx","fx_amt");}else{return _fncValidateAmount(_2,this,"fx","counter_amt");}});misys.connect("cancelDelayDialogButton","onClick",fncPerformClear("delayDialog"));misys.connect("buttonAcceptRequest","onClick",fncAcceptRate);misys.connect("buttonCancelRequest","onClick",fncPerformCancelRequest);misys.setValidation("input_extend_value_date",function(){return fncValidateDate("input_extend_value","original_value_date","valueDateGreaterThanOrgValueDate",false);});misys.setValidation("input_uptake_value_date",function(){return fncValidateDate("input_split_value","original_value_date","valueDateGreaterThanOrgValueDate",true);});misys.setValidation("input_takedown_value_date",function(){return fncValidateDate("input_takedown_value","original_value_date","valueDateGreaterThanOrgValueDate",true)&&fncValidateDate("input_takedown_value","option_date","DateLessThanDateOfDayError",false);});};fncDoFormOnLoadEvents=function(){fncDisableLoadingDialogClosing();_fncToggleAction(dijit.byId("sub_tnx_type_code").get("value"));};fncPerformRequest=function(){if(fncCheckFields()){fncDoPerformRequest();misys.animate("fadeOut",dojo.byId("request-button"));}};fncInitVar=function(){fncSetGlobalVariable("applicant_reference",dijit.byId("applicant_reference").get("value"));fncSetGlobalVariable("original_deal_id",dijit.byId("bo_ref_id").get("value"));fncSetGlobalVariable("fx_type","FORWARD");fncSetGlobalVariable("contract_type",dijit.byId("contract_type").get("value"));fncSetGlobalVariable("counter_cur_code",dijit.byId("counter_cur_code").get("value"));if(fncGetGlobalVariable("fx_action")=="SPLIT"){_fncInitUpdateVar();if(dijit.byId("select_split_cur_code_CCY").checked){fncSetGlobalVariable("fx_cur_code",dijit.byId("fx_cur_code").get("value"));}else{fncSetGlobalVariable("fx_cur_code",dijit.byId("counter_cur_code").get("value"));}fncSetGlobalVariable("fx_amt",dijit.byId("input_split_amt").get("value"));fncSetGlobalVariable("remarks",dijit.byId("input_split_remarks").get("value"));fncSetGlobalVariable("input_value_date",dijit.byId("input_split_value").getDate());fncSetGlobalVariable("input_value_days",dijit.byId("input_split_value").getNumber());fncSetGlobalVariable("input_value_period",dijit.byId("input_split_value").getCode());}else{if(fncGetGlobalVariable("fx_action")=="EXTEND"){_fncInitUpdateVar();fncSetGlobalVariable("fx_cur_code",dijit.byId("fx_cur_code").get("value"));fncSetGlobalVariable("remarks",dijit.byId("input_extends_remarks").get("value"));fncSetGlobalVariable("fx_amt",dijit.byId("fx_amt").get("value"));fncSetGlobalVariable("input_value_date",dijit.byId("input_extend_value").getDate());fncSetGlobalVariable("input_value_days",dijit.byId("input_extend_value").getNumber());fncSetGlobalVariable("input_value_period",dijit.byId("input_extend_value").getCode());}else{if(fncGetGlobalVariable("fx_action")=="UPTAKE"){_fncInitUpdateVar();fncSetGlobalVariable("fx_cur_code",dijit.byId("fx_cur_code").get("value"));fncSetGlobalVariable("remarks",dijit.byId("input_uptake_remarks").get("value"));fncSetGlobalVariable("fx_amt",dijit.byId("fx_amt").get("value"));fncSetGlobalVariable("input_value_date",dijit.byId("input_uptake_value").getDate());fncSetGlobalVariable("input_value_days",dijit.byId("input_uptake_value").getNumber());fncSetGlobalVariable("input_value_period",dijit.byId("input_uptake_value").getCode());}}}};var _fncInitUpdateVar=function(){fncSetGlobalVariable("fx_ref_id",dijit.byId("ref_id").get("value"));fncSetGlobalVariable("fx_bo_ref_id",dijit.byId("bo_ref_id").get("value"));fncSetGlobalVariable("fx_contract_type",dijit.byId("contract_type").get("value"));fncSetGlobalVariable("org_fx_amt",dijit.byId("org_fx_amt").get("value"));fncSetGlobalVariable("org_fx_cur_code",dijit.byId("org_fx_cur_code").get("value"));fncSetGlobalVariable("org_counter_amt",dijit.byId("org_counter_amt").get("value"));fncSetGlobalVariable("org_counter_cur_code",dijit.byId("org_counter_cur_code").get("value"));fncSetGlobalVariable("org_rate",dijit.byId("org_rate").get("value"));fncSetGlobalVariable("org_maturity_date",dijit.byId("org_maturity_date").get("value"));};_fncGetDisabledFields=function(){var _3=["issuing_bank_customer_reference","trade_id","issuing_bank_abbv_name","input_split_value","input_split_amt","input_extend_value","input_uptake_value","input_takedown_value","select_takedown_cur_code","select_split_cur_code","input_takedown_amt","input_split_remarks","input_extends_remarks","input_takedown_remarks","input_uptake_remarks","request_button","request_clear_button","dijit_form_Button_2","dijit_form_Button_3"];return _3;};_fncGetEnabledFields=function(){return _fncGetDisabledFields();};_fncGetHiddenFieldsToClear=function(){var _4=[];return _4;};_fncGetFieldsToClear=function(){var _5=["trade_id","input_split_amt","select_takedown_cur_code","select_split_cur_code","input_takedown_amt","input_split_remarks","input_extends_remarks","input_uptake_remarks","input_takedown_remarks"];return _5;};_fncGetDateTermFieldsToClear=function(){var _6=["input_split_value_date","input_split_value_code","input_extend_value_date","input_extend_value_code","input_uptake_value_date","input_uptake_value_code","input_takedown_value_date","input_takedown_value_code"];return _6;};_fncToggleAction=function(_7){misys.animate("fadeOut",dojo.byId("split-details"));misys.animate("fadeOut",dojo.byId("extend-details"));misys.animate("fadeOut",dojo.byId("uptake-details"));misys.animate("fadeOut",dojo.byId("takedown-details"));misys.animate("fadeOut",dojo.byId("request-button"));misys.animate("fadeOut",dojo.byId("submit-button"));misys.animate("fadeOut",dojo.byId("split-trade-details"));fncSetGlobalVariable("sub_tnx_type_code",_7);if(_7=="34"){fncSetGlobalVariable("fx_action","SPLIT");_fncEnableRequiredFields(tabIdRequiredSplit);_fncDisabledRequiredFields(tabIdRequiredExtend);_fncDisabledRequiredFields(tabIdRequiredUptake);_fncDisabledRequiredFields(tabIdRequiredTakedown);misys.animate("fadeIn",dojo.byId("split-details"));misys.animate("fadeIn",dojo.byId("request-button"));misys.animate("fadeIn",dojo.byId("split-trade-details"));}else{if(_7=="33"){fncSetGlobalVariable("fx_action","EXTEND");_fncDisabledRequiredFields(tabIdRequiredSplit);_fncEnableRequiredFields(tabIdRequiredExtend);_fncDisabledRequiredFields(tabIdRequiredUptake);_fncDisabledRequiredFields(tabIdRequiredTakedown);misys.animate("fadeIn",dojo.byId("extend-details"));misys.animate("fadeIn",dojo.byId("request-button"));}else{if(_7=="32"){fncSetGlobalVariable("fx_action","UPTAKE");_fncDisabledRequiredFields(tabIdRequiredSplit);_fncDisabledRequiredFields(tabIdRequiredExtend);_fncEnableRequiredFields(tabIdRequiredUptake);_fncDisabledRequiredFields(tabIdRequiredTakedown);misys.animate("fadeIn",dojo.byId("uptake-details"));misys.animate("fadeIn",dojo.byId("request-button"));}else{if(_7=="31"){fncSetGlobalVariable("fx_action","TAKEDOWN");_fncDisabledRequiredFields(tabIdRequiredSplit);_fncDisabledRequiredFields(tabIdRequiredExtend);_fncDisabledRequiredFields(tabIdRequiredUptake);_fncEnableRequiredFields(tabIdRequiredTakedown);misys.animate("fadeIn",dojo.byId("takedown-details"));misys.animate("fadeIn",dojo.byId("submit-button"));}else{_fncDisabledRequiredFields(tabIdRequiredSplit);_fncDisabledRequiredFields(tabIdRequiredExtend);_fncDisabledRequiredFields(tabIdRequiredUptake);_fncDisabledRequiredFields(tabIdRequiredTakedown);}}}}};_fncEnableRequiredFields=function(_8){var _9=_8;dojo.forEach(_9,function(id){var _a=dijit.byId(id);if(_a){misys.toggleRequired(_a,true);_a.set("disabled",false);}});};_fncDisabledRequiredFields=function(_b){var _c=_b;dojo.forEach(_c,function(id){var _d=dijit.byId(id);if(_d){_d.set("disabled",true);}});};_fncValidateAmount=function(_e,_f,_10,_11){_f.invalidMessage=_f.messages.invalidMessage;if(!_f.validator(_f.textbox.value,_f.constraints)){return false;}var _12=(_f.state=="Error")?false:true;if(false==_e||(true==_e&&!_12)){_12=true;var _13=_f.id;var _14=dojo.number.parse(dijit.byId(_11).get("value"));var _15=_f.get("value");if(!isNaN(_15)){if((_14-_15)<0){_f.invalidMessage=misys.getLocalization("amendAmountLessThanOriginalError");_12=false;}}}return _12;};dojo.require("misys.client.binding.cash.TradeMessageFxBinding_client");}