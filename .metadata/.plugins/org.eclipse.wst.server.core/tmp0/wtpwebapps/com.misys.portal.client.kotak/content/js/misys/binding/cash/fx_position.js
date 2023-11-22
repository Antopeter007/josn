/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.binding.cash.fx_position"]){dojo._hasResource["misys.binding.cash.fx_position"]=true;dojo.provide("misys.binding.cash.fx_position");(function(d,dj,m){d.ready(function(){dojo.query("label[for=customer]")[0].innerHTML="<span class='required-field-symbol'>*</span>"+dojo.query("label[for=customer]")[0].innerHTML;dojo.query("label[for=start_date]")[0].innerHTML="<span class='required-field-symbol'>*</span>"+dojo.query("label[for=start_date]")[0].innerHTML;});function _1(){var _2=this.get("value");if(_2){if(d.date.compare(_2,new Date(),"date")>=0){return true;}else{var _3=d.date.locale.format(m.localizeDate(this),{selector:"date"});var _4=d.date.locale.format(new Date(),{selector:"date"});this.invalidMessage=m.getLocalization("startDateLessThanDateOfDayError",[_3,_4]);return false;}}return true;};d.mixin(m,{bind:function(){m.setValidation("start_date",_1);}});})(dojo,dijit,misys);dojo.require("misys.client.binding.cash.fx_position_client");}