/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.binding.cash.TradeCreateFxBinding"]){dojo._hasResource["misys.binding.cash.TradeCreateFxBinding"]=true;dojo.provide("misys.binding.cash.TradeCreateFxBinding");dojo.require("misys.form.common");dojo.require("misys.validation.common");dojo.require("misys.form.DateTermField");dojo.require("dijit.form.Form");dojo.require("dijit.form.Button");dojo.require("dijit.form.TextBox");dojo.require("misys.widget.Dialog");dojo.require("dijit.ProgressBar");dojo.require("dijit.form.ValidationTextBox");dojo.require("dijit.form.CheckBox");dojo.require("dijit.layout.ContentPane");dojo.require("dojo.data.ItemFileReadStore");dojo.require("dijit.form.DateTextBox");dojo.require("misys.form.CurrencyTextBox");dojo.require("dijit.form.NumberTextBox");dojo.require("dijit.form.FilteringSelect");dojo.require("misys.form.SimpleTextarea");dojo.require("dojo.parser");dojo.require("dojo.date");dojo.require("misys.widget.Collaboration");dojo.require("misys.binding.cash.request.RequestAction");dojo.require("misys.binding.cash.TradeCreateFxAjaxCall");fncDoBinding=function(){if(dijit.byId("fx_type")){fx_type=dijit.byId("fx_type").get("value");}else{fx_type=null;}fncSetGlobalVariable("fx_type",fx_type);misys.connect("issuing_bank_customer_reference","onChange",misys.setApplicantReference);misys.connect("fx_amt","onBlur",function(){misys.setTnxAmt(this.get("value"));});misys.connect("cancelDelayDialogButton","onClick",fncPerformClear("delayDialog"));misys.connect("buttonAcceptRequest","onClick",fncAcceptRate);misys.connect("buttonCancelRequest","onClick",fncPerformCancelRequest);misys.connect("input_counter_cur_code","onBlur",function(){var _1=dojo.hitch(this,fncCheckEqualsCurrencies);return _1("input_fx_cur_code");});misys.connect("input_fx_cur_code","onBlur",function(){var _2=dojo.hitch(this,fncCheckEqualsCurrencies);return _2("input_counter_cur_code");});if(fx_type!="SWAP"){misys.setValidation("input_counter_cur_code",misys.validateCurrency);misys.setValidation("input_fx_cur_code",misys.validateCurrency);misys.connect("input_fx_cur_code","onChange",function(){misys.setCurrency(this,["input_fx_amt"]);});}else{misys.setValidation("input_fx_cur_code",misys.validateCurrency);misys.setValidation("input_counter_cur_code",misys.validateCurrency);misys.setValidation("input_near_date",function(){return fncValidateDate("input_near","input_value","errorFXNearDateGreaterFarDate",true);});misys.connect("input_fx_cur_code","onChange",function(){misys.setCurrency(this,["input_near_amt"]);});misys.connect("input_fx_cur_code","onChange",function(){misys.setCurrency(this,["input_far_amt"]);});}if(fx_type!="SPOT"){misys.setValidation("input_value_date",function(){if(fx_type=="SWAP"){return fncValidateDate("input_value","input_near","errorFXFarDateGreaterNearDate",false);}else{if(fx_type=="DELIVERY_OPTION"){return fncValidateDate("input_value","input_option","valueDateSmallerThanOptionDate",false);}else{return true;}}});}if(fx_type=="DELIVERY_OPTION"){misys.setValidation("input_option_date",function(){return fncValidateDate("input_option","input_value","optionDateGreaterThanValueDate",true);});}};fncDoFormOnLoadEvents=function(){fncDisableLoadingDialogClosing();};fncInitVar=function(){if(dijit.byId("applicant_reference")){fncSetGlobalVariable("applicant_reference",dijit.byId("applicant_reference").get("value"));}else{fncSetGlobalVariable("applicant_reference","");}if(dijit.byId("contract_type_1").get("checked")==true){fncSetGlobalVariable("contract_type","01");}else{fncSetGlobalVariable("contract_type","02");}fncSetGlobalVariable("remarks",dijit.byId("remarks").get("value"));if(fx_type=="SWAP"){fncSetGlobalVariable("fx_cur_code",dijit.byId("input_fx_cur_code").get("value"));fncSetGlobalVariable("fx_amt",dijit.byId("input_far_amt").get("value"));fncSetGlobalVariable("counter_cur_code",dijit.byId("input_counter_cur_code").get("value"));fncSetGlobalVariable("near_amt",dijit.byId("input_near_amt").get("value"));fncSetGlobalVariable("input_near_date",dijit.byId("input_near").getDate());fncSetGlobalVariable("input_near_days",dijit.byId("input_near").getNumber());fncSetGlobalVariable("input_near_period",dijit.byId("input_near").getCode());}else{fncSetGlobalVariable("counter_cur_code",dijit.byId("input_counter_cur_code").get("value"));fncSetGlobalVariable("fx_cur_code",dijit.byId("input_fx_cur_code").get("value"));fncSetGlobalVariable("fx_amt",dijit.byId("input_fx_amt").get("value"));fncSetGlobalVariable("input_near_date","");fncSetGlobalVariable("input_near_days","");fncSetGlobalVariable("input_near_period","");}if(fx_type!="SPOT"){fncSetGlobalVariable("input_value_date",dijit.byId("input_value").getDate());fncSetGlobalVariable("input_value_days",dijit.byId("input_value").getNumber());fncSetGlobalVariable("input_value_period",dijit.byId("input_value").getCode());}else{fncSetGlobalVariable("input_value_date","");fncSetGlobalVariable("input_value_days","");fncSetGlobalVariable("input_value_period","");}if(fx_type=="DELIVERY_OPTION"){fncSetGlobalVariable("input_option_date",dijit.byId("input_option").getDate());fncSetGlobalVariable("input_option_days",dijit.byId("input_option").getNumber());fncSetGlobalVariable("input_option_period",dijit.byId("input_option").getCode());}else{fncSetGlobalVariable("input_option_date","");fncSetGlobalVariable("input_option_days","");fncSetGlobalVariable("input_option_period","");}};fncPerformRequest=function(){if(fncCheckFields()){fncDoPerformRequest();}};_fncGetDisabledFields=function(){var _3=["issuing_bank_customer_reference","trade_id","issuing_bank_abbv_name","input_counter_cur_code","input_fx_cur_code","input_fx_amt","input_counter_amt","input_fx_amt_img","input_counter_amt_img","contract_type_1","contract_type_2","dijit_form_Button_2","dijit_form_Button_3","remarks","request_button","request_clear_button","input_value","input_near","input_near_amt","input_far_amt","near_amt_img","far_amt_img","input_option"];return _3;};_fncGetEnabledFields=function(){return _fncGetDisabledFields();};_fncGetHiddenFieldsToClear=function(){var _4=["fx_cur_code","fx_amt","counter_cur_code","rate","counter_amt","value_date","maturity_date"];return _4;};_fncGetFieldsToClear=function(){var _5=["issuing_bank_customer_reference","trade_id","issuing_bank_abbv_name","input_counter_cur_code","input_fx_cur_code","input_fx_amt","input_counter_amt","remarks","input_value","input_near","input_near_amt","input_far_amt","input_option"];return _5;};_fncGetDateTermFieldsToClear=function(){return ["value","maturity"];};fncCheckEqualsCurrencies=function(_6){var _7=this.get("value");var _8=dijit.byId(_6).get("value");if(_7.length==3&&_8.length==3&&(this.state!="Error"||_6.state!="Error")){if(_7==_8){this.focus();this.state="Error";this.displayMessage(misys.getLocalization("errorFXEqualsCurrencies",[_7]));}}};dojo.require("misys.client.binding.cash.TradeCreateFxBinding_client");}