/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.binding.openaccount.listdef_ip_financing_request"]){dojo._hasResource["misys.binding.openaccount.listdef_ip_financing_request"]=true;dojo.provide("misys.binding.openaccount.listdef_ip_financing_request");dojo.require("dojo.data.ItemFileReadStore");dojo.require("dojo.data.ItemFileWriteStore");dojo.require("dijit.form.FilteringSelect");dojo.require("misys.form.MultiSelect");dojo.require("dijit.layout.TabContainer");dojo.require("misys.form.common");dojo.require("misys.openaccount.StringUtils");dojo.require("misys.validation.common");dojo.require("dijit.form.Form");dojo.require("dijit.form.Button");dojo.require("dijit.form.TextBox");dojo.require("dijit.form.ValidationTextBox");dojo.require("dijit.form.CheckBox");dojo.require("dijit.layout.ContentPane");dojo.require("misys.form.CurrencyTextBox");(function(d,dj,m){d.subscribe("ready",function(){m._config=(m._config)||{};m._config.cellNodeReference;d.query(".dojoxGrid").forEach(function(_1){if(_1.id!=="nonSignedFolders"){m.connect(_1.id,"onRowClick",m._config.storeCellNodeReference);m.connect(_1.id,"onHeaderCellClick",function(_2){if(m._config.cellNodeReference&&m._config.cellNodeReference.cellNode){dj.hideTooltip(m._config.cellNodeReference.cellNode);m._config.cellNodeReference.cellNode=null;}});}});});d.mixin(m,{bind:function(){m.connect("AmountRangevisible","onChange",_3);m.connect("AmountRange2visible","onChange",_3);m.connect("iss_date","onChange",_4);m.connect("iss_date2","onChange",_5);m.connect("due_date","onChange",_6);m.connect("due_date2","onChange",_7);m.setValidation("cur_code",m.validateCurrency);m.connect("cur_code","onChange",_8);m.connect("cur_code","onChange",function(){misys.setCurrency(this,["AmountRange","AmountRange2"]);});m.connect("submitButton","onClick",_9);}});d.mixin(m._config,{submitOpenAccount:function(_a){var _b=[],_c="",_d="",_e="";if(dj.byId("nonSignedFolders")&&dijit.byId("nonSignedFolders").selection.selectedIndex!==-1){if(dj.byId("referenceid")){_c=dj.byId("referenceid").get("value");}if(dj.byId("tnxid")){_e=dj.byId("tnxid").get("value");}}_d=dj.byId("base_ccy").get("value");d.query(".dojoxGrid").forEach(function(g){_b.push(dj.byId(g.id));});var _f=d.isArray(_b)?_b:[_b],_10=d.byId("batchContainer"),_11=[],_12="",_13=0,_14,_15;d.forEach(_f,function(_16){var _17=_16.selection.preserver._selectedById;_11=_16.selection.getSelected();if(_11&&_11.length){d.forEach(_11,function(_18){_14=_16.store.getValues(_18,"box_ref");if(_12!==""){_12+=", ";}_12+=_14;_13++;});}});if(_12===""){m.dialog.show("ERROR",m.getLocalization("noTransactionsSelectedError"));}else{var URL=window.location.pathname;m.post({action:URL,params:[{name:"list_keys",value:_12},{name:"base_ccy",value:_d},{name:"operation",value:"MULTI_LIST_FINANCING"},{name:"option",value:"IP_FINANCE_REQUEST"},{name:"mode",value:"DRAFT"},{name:"productcode",value:"IP"}]});}},storeCellNodeReference:function(evt){m._config.cellNodeReference=evt;}});function _8(){if(dj.byId("cur_code").value!==""){dj.byId("AmountRangevisible").set("disabled",false);dj.byId("AmountRange2visible").set("disabled",false);}else{if(dj.byId("cur_code").value===""){dj.byId("AmountRangevisible").set("disabled",true);dj.byId("AmountRange2visible").set("disabled",true);dj.byId("AmountRangevisible").reset();dj.byId("AmountRange2visible").reset();}}};function _9(){if(dj.byId("AmountRangevisible")){var _19=dj.byId("AmountRangevisible").value;var _1a=isNaN(_19)?0:_19;dj.byId("AmountRange").set("value",_19);var _1b=dj.byId("AmountRange2visible").value;dj.byId("AmountRange2").set("value",_1b);}};function _3(){var _1c=this.get("value");var _1d=dj.byId("AmountRange2visible").get("value");var _1e=dj.byId("AmountRangevisible").get("value");var _1f=false;var _20=dj.byId("AmountRangevisible");var _21=dj.byId("AmountRange2visible");if(_1e>_1d){var _22=misys.getLocalization("invalidMaxAmountValueError");_1f=true;}else{if(_1d<0){_22=misys.getLocalization("invalidAmountValueError");_1f=true;}else{if(_1e<0){_22=misys.getLocalization("invalidAmountValueError");_20.focus();_20.set("state","Error");dj.hideTooltip(_20.domNode);dj.showTooltip(_22,_20.domNode,0);dj.showTooltip(_22,domNode,0);return false;}}}if(_1f){_21.focus();_21.set("state","Error");dj.hideTooltip(_21.domNode);dj.showTooltip(_22,_21.domNode,0);dj.showTooltip(_22,domNode,0);return false;}return true;};function _4(){if(this.get("value")===null){return true;}var _23=dj.byId("iss_date2");if(!m.compareDateFields(this,_23)){var _24=dj.byId("iss_date");displayMessage=misys.getLocalization("InvoiceIssueDateFromLesserThanInvoiceIssueDateTo");_24.focus();_24.set("state","Error");dj.hideTooltip(_24.domNode);dj.showTooltip(displayMessage,_24.domNode,0);}return true;};function _5(){if(this.get("value")===null){return true;}var _25=dj.byId("iss_date");if(!m.compareDateFields(_25,this)){var _26=dj.byId("iss_date2");displayMessage=misys.getLocalization("InvoiceIssueDateToGreaterThanInvoiceIssueDateFrom");_26.focus();_26.set("state","Error");dj.hideTooltip(_26.domNode);dj.showTooltip(displayMessage,_26.domNode,0);return false;}return true;};function _6(){if(this.get("value")===null){return true;}var _27=dj.byId("due_date2");if(!m.compareDateFields(this,_27)){var _28=dj.byId("due_date"),_29=misys.getLocalization("InvoiceDueDateFromGreaterThanInvoiceDueDateTo");_28.focus();_28.set("state","Error");dj.hideTooltip(_28.domNode);dj.showTooltip(_29,_28.domNode,0);dj.showTooltip(_29,domNode,0);return false;}return true;};function _7(){if(this.get("value")===null){return true;}var _2a=dj.byId("due_date");if(!m.compareDateFields(_2a,this)){var _2b=dj.byId("due_date2");displayMessage=misys.getLocalization("InvoiceDueDateToLesserThanInvoiceDueDateFrom");_2b.focus();_2b.set("state","Error");dj.hideTooltip(_2b.domNode);dj.showTooltip(displayMessage,_2b.domNode,0);}return true;};})(dojo,dijit,misys);dojo.require("misys.client.binding.openaccount.listdef_ip_financing_request_client");}