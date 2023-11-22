/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.binding.cash.account_statement"]){dojo._hasResource["misys.binding.cash.account_statement"]=true;dojo.provide("misys.binding.cash.account_statement");dojo.require("misys.form.common");dojo.require("misys.validation.common");dojo.require("dijit.form.ValidationTextBox");dojo.require("misys.widget.Dialog");dojo.require("dojo.data.ItemFileReadStore");dojo.require("dojo.data.ItemFileWriteStore");dojo.require("dijit.form.FilteringSelect");(function(d,dj,m){d.mixin(m,{openAdditionalPostingDetails:function(_1,_2,_3){var _4="/screen/AjaxScreen/action/AdditionalPostingDetailsAction";var _5={};var _6=m.getLocalization("additionalPostingDetailsTitle");_5.ref_id=_2;_5.line_id=_1;_5.statement_id=_3;var _7=new dj.Dialog({id:"account_details_dialog",title:_6,ioMethod:misys.xhrPost,ioArgs:{content:_5},href:m.getServletURL(_4),style:"width: 640px;height:auto"});_7.connect(_7,"hide",function(e){dj.byId("account_details_dialog").destroy();});_7.show();}});})(dojo,dijit,misys);dojo.require("misys.client.binding.cash.account_statement_client");}