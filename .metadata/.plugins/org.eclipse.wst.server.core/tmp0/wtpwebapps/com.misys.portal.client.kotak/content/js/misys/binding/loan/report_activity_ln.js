/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.binding.loan.report_activity_ln"]){dojo._hasResource["misys.binding.loan.report_activity_ln"]=true;dojo.provide("misys.binding.loan.report_activity_ln");(function(d,dj,m){function _1(){alert("_checkEocDdlpi");};function _2(){alert("_checkTnxValDate");};function _3(){alert("_checkExceptionDate");};function _4(){alert("_checkLnAmt");};d.mixin(m,{bind:function(){m.setValidation(dj.byId("eoc_ddlpi"),_1);m.setValidation(dj.byId("tnx_val_date"),_2);m.setValidation(dj.byId("exception_date"),_3);m.setValidation(dj.byId("ln_amt"),_4);m.setValidation(dj.byId("eoc_ddlpi"),_1);m.setValidation(dj.byId("eoc_ddlpi"),_1);m.setValidation(dj.byId("eoc_ddlpi"),_1);m.setValidation(dj.byId("eoc_ddlpi"),_1);m.setValidation(dj.byId("eoc_ddlpi"),_1);m.setValidation(dj.byId("eoc_ddlpi"),_1);m.setValidation(dj.byId("eoc_ddlpi"),_1);},onFormLoad:function(){},beforeSubmitValidations:function(){return true;}});})(dojo,dijit,misys);dojo.require("misys.client.binding.loan.report_activity_ln_client");}