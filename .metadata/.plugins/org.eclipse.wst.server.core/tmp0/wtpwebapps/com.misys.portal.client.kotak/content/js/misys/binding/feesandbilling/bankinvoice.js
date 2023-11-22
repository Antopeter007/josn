/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.binding.feesandbilling.bankinvoice"]){dojo._hasResource["misys.binding.feesandbilling.bankinvoice"]=true;dojo.provide("misys.binding.feesandbilling.bankinvoice");dojo.require("misys.validation.common");dojo.require("dijit.form.Button");dojo.require("dijit.form.TextBox");dojo.require("dijit.form.Select");dojo.require("misys.form.common");dojo.require("misys.widget.Dialog");dojo.require("dijit.form.ValidationTextBox");dojo.require("misys.form.CurrencyTextBox");(function(d,dj,m){function _1(){var _2=null;var _3={};if(dj.byId("bank")){_3=dj.byId("bank");}if(dj.byId("entity")&&dj.byId("entity").get("value")===""){_2="wildCard";}else{if(dj.byId("entity")&&dj.byId("entity").get("value")!==""){_2=dj.byId("entity").get("value");if("*"===_2){_2="wildCard";}}else{_2="All";}}if(misys._config.entityBanksMap){var _4=null;_4=m._config.entityBanksMap[_2];if(_4){_3.store=new dojo.data.ItemFileReadStore({data:{identifier:"value",label:"name",items:_4}});_3.fetchProperties={sort:[{attribute:"name"}]};}else{_3.store=null;}}};function _5(){var _6=null;var _7={};var _8="";if(dj.byId("applicant_reference")){_7=dj.byId("applicant_reference");}if(dj.byId("entity")&&dj.byId("entity").get("value")===""){_6="wildCard";}if(dj.byId("entity")&&dj.byId("entity").get("value")!==""){_6=dj.byId("entity").get("value");if("*"===_6){_6="wildCard";}}if(dj.byId("bank")){if(dj.byId("bank").get("value")!==""){_8=dj.byId("bank").get("value");}else{dj.byId("bank_abbv_name").set("value","wildCard");_8=dj.byId("bank_abbv_name").get("value");}}else{if(dj.byId("bank_abbv_name")&&dj.byId("bank_abbv_name").get("value")!==""){_8=dj.byId("bank_abbv_name").get("value");}}if(_8!==""&&misys._config.entityBanksRefJson){var _9=null;if(null===_6){_9=m._config.entityBanksRefJson[_8];}else{_9=m._config.entityBanksRefJson[_6+"_"+_8];}if(_9){_7.store=new dojo.data.ItemFileReadStore({data:{identifier:"value",label:"name",items:_9}});_7.fetchProperties={sort:[{attribute:"name"}]};}else{_7.store=null;}}};function _a(){if(dj.byId("bank")&&dj.byId("bank").get("value")!==""){dj.byId("bank").set("value","");}_1();if(dj.byId("applicant_reference")&&dj.byId("applicant_reference").get("value")!==""){dj.byId("applicant_reference").set("value","");}_5();};function _b(){if(dj.byId("applicant_reference")){dj.byId("applicant_reference").set("value","");}_5();};function _c(){var _d=this;var _e=dj.byId("create_date");var _f=dj.byId("create_date2");if(_d.get("value")===null){return true;}if(_d.get("id")==="create_date"){m._config=m._config||{};m._config.effFromDateValidationInprocess=false;if(!m._config.effToDateValidationInprocess&&!m.compareDateFields(_d,_f)){m._config.effFromDateValidationInprocess=true;displayMessage=misys.getLocalization("InvoiceDateFromLesserThanInvoiceDateTo");_e.set("state","Error");dj.hideTooltip(_e.domNode);dj.showTooltip(displayMessage,_e.domNode,0);}m._config.effFromDateValidationInprocess=false;return true;}if(_d.get("id")==="create_date2"){if(!m._config.effFromDateValidationInprocess&&!m.compareDateFields(_e,_d)){m._config.effToDateValidationInprocess=true;displayMessage=misys.getLocalization("InvoiceDateToGreaterThanInvoiceDateFrom");_f.set("state","Error");dj.hideTooltip(_f.domNode);dj.showTooltip(displayMessage,_f.domNode,0);return false;}m._config.effToDateValidationInprocess=false;return true;}};function _10(){var _11=this;var _12=dj.byId("inv_due_date2");var _13=dj.byId("inv_due_date");if(_11.get("value")===null){return true;}m._config=m._config||{};m._config.effToDateValidationInprocess=false;if(_11.get("id")==="inv_due_date"){m._config=m._config||{};m._config.effFromDateValidationInprocess=false;if(!m._config.effToDateValidationInprocess&&!m.compareDateFields(_11,_12)){m._config.effFromDateValidationInprocess=true;displayMessage=misys.getLocalization("DueDateFromLesserThanDueDateTo");_13.set("state","Error");dj.hideTooltip(_13.domNode);dj.showTooltip(displayMessage,_13.domNode,0);}m._config.effFromDateValidationInprocess=false;return true;}if(_11.get("id")==="inv_due_date2"){if(!m._config.effFromDateValidationInprocess&&!m.compareDateFields(_13,_11)){m._config.effToDateValidationInprocess=true;displayMessage=misys.getLocalization("DueDateToGreaterThanDueDateFrom");_12.set("state","Error");dj.hideTooltip(_12.domNode);dj.showTooltip(displayMessage,_12.domNode,0);return false;}m._config.effToDateValidationInprocess=false;return true;}};function _14(){var _15=this.get("value"),_16=this;m._config=m._config||{};m._config.effFromAmountValidationInprocess=false;var _17=dj.byId("AmountRange2visible").get("value");if(!m._config.effToAmountValidationInprocess&&(_15<0||_15>_17)){m._config.effFromAmountValidationInprocess=true;var _18=dj.byId("AmountRangevisible");if(_15>_17){displayMessage=misys.getLocalization("invalidMinAmountValueError");}if(_15<0){displayMessage=misys.getLocalization("invalidAmountValueError");}_18.set("state","Error");dj.hideTooltip(_18.domNode);dj.showTooltip(displayMessage,_18.domNode,0);return false;}m._config.effFromAmountValidationInprocess=false;return true;};function _19(){var _1a=this.get("value"),_1b=this;m._config=m._config||{};m._config.effToAmountValidationInprocess=false;var _1c=dj.byId("AmountRangevisible").get("value");if(!m._config.effFromAmountValidationInprocess&&(_1a<0||_1a<_1c)){m._config.effToAmountValidationInprocess=true;var _1d=dj.byId("AmountRange2visible");if(_1a<_1c){displayMessage=misys.getLocalization("invalidMaxAmountValueError");}if(_1a<0){displayMessage=misys.getLocalization("invalidAmountValueError");}_1d.set("state","Error");dj.hideTooltip(_1d.domNode);dj.showTooltip(displayMessage,_1d.domNode,0);return false;}m._config.effToAmountValidationInprocess=false;return true;};function _1e(){if(dj.byId("AmountRangevisible")){var _1f=dj.byId("AmountRangevisible").value;var _20=isNaN(_1f)?0:_1f;dj.byId("AmountRange").set("value",_1f);var _21=dj.byId("AmountRange2visible").value;dj.byId("AmountRange2").set("value",_21);}};d.mixin(m,{bind:function(){m.connect("entity","onChange",_a);_1();m.connect("bank","onChange",_b);m.connect("create_date","onBlur",_c);m.connect("create_date2","onBlur",_c);m.connect("inv_due_date","onBlur",_10);m.connect("inv_due_date2","onBlur",_10);m.connect("AmountRangevisible","onBlur",_14);m.connect("AmountRange2visible","onBlur",_19);m.connect("submitButton","onClick",function(){m._config.fieldValidationinProcess=false;_1e();});},onFormLoad:function(){if(dijit.byId("bank")){dijit.byId("bank").set("value","");}_5();if(dijit.byId("applicant_reference")){dijit.byId("applicant_reference").set("value","");}if(dijit.byId("payment_status")){dijit.byId("payment_status").set("value","Not Paid");}if(dijit.byId("status")){dijit.byId("status").set("value","A");}}});})(dojo,dijit,misys);dojo.require("misys.client.binding.feesandbilling.bankinvoice_client");}