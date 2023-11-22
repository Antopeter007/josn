/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.binding.system.fscm_program"]){dojo._hasResource["misys.binding.system.fscm_program"]=true;dojo.provide("misys.binding.system.fscm_program");dojo.require("dojo.data.ItemFileWriteStore");dojo.require("dojox.xml.DomParser");dojo.require("dijit.form.Button");dojo.require("misys.form.CurrencyTextBox");dojo.require("dijit.form.CheckBox");dojo.require("dijit.form.FilteringSelect");dojo.require("dijit.form.Form");dojo.require("dijit.form.NumberTextBox");dojo.require("dijit.form.RadioButton");dojo.require("dijit.form.TextBox");dojo.require("dijit.form.ValidationTextBox");dojo.require("dijit.Editor");dojo.require("dijit.layout.ContentPane");dojo.require("dojox.xml.DomParser");dojo.require("misys.validation.common");dojo.require("misys.form.common");dojo.require("misys.validation.common");dojo.require("misys.form.SimpleTextarea");dojo.require("misys.grid.DataGrid");dojo.require("misys.form.static_document");dojo.require("misys.system.widget.CounterpartyPrograms");dojo.require("misys.system.widget.CounterpartyProgram");dojo.require("misys.widget.Dialog");(function(d,dj,m){d.mixin(m,{bind:function(){m.connect("pc_lookup","onClick",function(){var _1=dj.byId("program_id").get("value");var _2=dj.byId("status").get("value");if(_2==="I"){m.dialog.show("ERROR",m.getLocalization("counterpartyCannotBeAddedToInactiveFscmProgram"));}else{m.getPrgmCpty(_1);}});},fetchPrgmCptyRecords:function(_3){var _4=_3.selection.getSelected();dj.byId("xhrDialog").hide();var _5=m._config.xmlTransform(_4);if(dj.byId("prgrmCptySubmit")){dj.byId("prgrmCptySubmit").set("disabled",true);}m.xhrPost({url:m.getServletURL("/screen/AjaxScreen/action/FSCMProgramCounterPartyAction"),handleAs:"json",sync:true,content:{option:"fscm_program_counterparty",transactiondata:_5},load:function(_6){m.processSaveCounterPartyResponse(_6);}});},closeCounterPartiesListGrid:function(_7){dj.byId("xhrDialog").hide();},processSaveCounterPartyResponse:function(_8){var _9=_8.items;if(_9.valid===true){window.location.reload();}else{misys.dialog.show("ERROR",misys.getLocalization("errorAddingProgramCounterParty"));}},onCancelNavigation:function(){var _a=misys._config.homeUrl;if(misys._config.xmlTagName&&misys._config.xmlTagName==="program_counterparty"){var _b=["/screen/CustomerSystemFeaturesScreen?","option=DISPLAY_FSCMPROG_LIST"];_a=misys.getServletURL(_b.join(""));}return _a;},onFormLoad:function(){}});m.dialog=m.dialog||{};d.mixin(m.dialog,{});d.mixin(m._config,{xmlTransform:function(_c){var _d=dj.byId("program_id").get("value");var _e=dj.byId("operationtype").get("value");var _f=m._config.xmlTagName,_10=_f?["<",_f,">"]:[];_10.push("<program_id>",_d,"</program_id>");_10.push("<operation_type>",_e,"</operation_type>");if(_c&&_c.length>0){_10.push("<associated_counterparties>");for(var i=0,len=_c.length;i<len;i++){_10.push("<associated_counterparty>");_10.push("<abbv_name>",_c[i].ABBVNAME,"</abbv_name>");_10.push("<name>",_c[i].NAME,"</name>");_10.push("</associated_counterparty>");}_10.push("</associated_counterparties>");}if(_f){_10.push("</",_f,">");}return _10.join("");}});d.mixin(m,{});d.ready(function(){d.require("misys.system.widget.CounterpartyProgram");d.require("misys.system.widget.CounterpartyPrograms");});})(dojo,dijit,misys);}