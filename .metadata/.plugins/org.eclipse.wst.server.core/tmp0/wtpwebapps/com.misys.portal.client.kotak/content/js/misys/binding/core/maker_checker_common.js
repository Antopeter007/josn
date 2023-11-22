/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.binding.core.maker_checker_common"]){dojo._hasResource["misys.binding.core.maker_checker_common"]=true;dojo.provide("misys.binding.core.maker_checker_common");(function(d,dj,m){d.mixin(m.popup,{showMaster:function(){var _1=dj.byId("master_url");if(_1&&"S"+_1.get("value")!="S"){_2(_1.get("value"),"","");}}});function _2(_3,_4,_5){var _6=_4||misys.getLocalization("transactionPopupWindowTitle"),_7=_5||"width=800,height=500,resizable=yes,scrollbars=yes",_8=d.global.open(_3,_6,_7);if(!_8.opener){_8.opener=self;}_8.focus();};})(dojo,dijit,misys);dojo.require("misys.client.binding.core.maker_checker_common_client");}