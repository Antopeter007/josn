/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.binding.cash.XoActions"]){dojo._hasResource["misys.binding.cash.XoActions"]=true;dojo.provide("misys.binding.cash.XoActions");var listOfTriggers=["trigger_pos","trigger_stop","trigger_limit"];fncCommonBindingRules=function(){misys.setValidation("counter_cur_code",misys.validateCurrency);misys.setValidation("fx_cur_code",misys.validateCurrency);misys.setValidation("value_date",function(){if(dijit.byId("value").isBlankSelected()){misys.validateDateGreaterThanHitched=dojo.hitch(this,misys.validateDateGreaterThan);if(!dijit.byId("expiration_date").get("disabled")&&dijit.byId("expiration_date").isBlankSelected()){misys.validateDateSmallerThanHitched=dojo.hitch(this,misys.validateDateSmallerThan);return misys.validateDateSmallerThanHitched(false,"expiration_date_date","valueDateGreaterThanExpirationDate");}else{return true;}}else{return true;}});misys.setValidation("expiration_date_date",function(){if(dijit.byId("expiration_date").isBlankSelected()&&dijit.byId("value").isBlankSelected()){misys.validateDateGreaterThanHitched=dojo.hitch(this,misys.validateDateGreaterThan);return misys.validateDateGreaterThanHitched(false,"value_date","expirationDateLessThanValueDate");}else{return true;}});misys.connect("fx_cur_code","onChange",function(){misys.setCurrency(this,["fx_amt"]);});misys.connect("fx_amt","onBlur",function(){misys.setTnxAmt(this.get("value"));});misys.connect("issuing_bank_customer_reference","onChange",misys.setApplicantReference);misys.connect("expiration_code","onChange",fncExpirationCodeChange);misys.connect("market_order_1","onChange",fncMarketOrderChange);misys.connect("market_order_2","onChange",fncMarketOrderChange);dojo.forEach(listOfTriggers,function(_1){misys.connect(_1,"onChange",_fncTriggerFieldsChange);dijit.byId(_1).missingMessage=misys.getLocalization("errorXOTriggersNotValid");});};fncExpirationCodeChange=function(){var _2=dijit.byId("expiration_code").get("value")=="EXPDAT/TIM"?true:false;var _3=["expiration_date","expiration_time"];misys.toggleFields(_2,null,_3,false,false);};fncMarketOrderChange=function(){var _4=dijit.byId("market_order_1").checked;misys.toggleFields(!_4,null,listOfTriggers,true,false);};var _fncTriggerFieldsChange=function(){var _5=dijit.byId("market_order_1").checked||!(isEmptyField(dijit.byId("trigger_pos"))&&isEmptyField(dijit.byId("trigger_stop"))&&isEmptyField(dijit.byId("trigger_limit")));misys.toggleFields(!_5,null,listOfTriggers,true,true);};dojo.require("misys.client.binding.cash.XoActions_client");}