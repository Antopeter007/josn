/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.binding.system.submit_templates"]){dojo._hasResource["misys.binding.system.submit_templates"]=true;dojo.provide("misys.binding.system.submit_templates");dojo.require("misys.widget.Dialog");dojo.require("dijit.form.Button");dojo.require("dijit.form.TextBox");dojo.require("dijit.form.ValidationTextBox");dojo.require("dijit.form.CheckBox");dojo.require("dijit.form.FilteringSelect");dojo.require("dijit.form.Form");dojo.require("dijit.form.NumberTextBox");dojo.require("misys.form.CurrencyTextBox");dojo.require("dijit.form.DateTextBox");dojo.require("misys.grid.DataGrid");dojo.require("misys.form.common");dojo.require("misys.validation.common");dojo.require("misys.report.common");(function(d,dj,m){d.mixin(m._config,{fncSubmitMultipleTemplates:function(){var _1=[],_2="",_3="";d.query(".dojoxGrid").forEach(function(g){_1.push(dj.byId(g.id));});var _4="/screen/AjaxScreen/action/ReportDesignerMultipleTemplateSubmission";if(_1&&_1[0].selection.getSelected().length>0){m.grid.processRecords(_1,_4);}else{m.dialog.show("ERROR",m.getLocalization("noTransactionsSelectedError"));}}});})(dojo,dijit,misys);dojo.require("misys.client.binding.system.submit_templates_client");}