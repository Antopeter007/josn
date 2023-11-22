/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.binding.trade.awb_tracking"]){dojo._hasResource["misys.binding.trade.awb_tracking"]=true;dojo.provide("misys.binding.trade.awb_tracking");(function(d,dj,m){d.mixin(m,{goToDHLTracking:function(){window.open(d.byId("dhlUrl").value,"_blank");dj.byId("AWBDialog").hide();},onCancelAWB:function(){document.body.style.overflow="visible";},showAWB:function(){var _1=dj.byId("AWBDialog");if(!_1){d.require("misys.widget.Dialog");d.require("dijit.form.Button");d.parser.parse("AWBDialogContainer");_1=dj.byId("AWBDialog");d.addClass(_1.domNode,"dialog");}_1.set("title",m.getLocalization("confirmationMessage"));m.dialog.connect(_1,"onKeyPress",function(_2){if(_2.keyCode==d.keys.ESCAPE){d.stopEvent(_2);}});m.dialog.connect(d.byId("cancelButtonAWB1"),"onMouseUp",function(){_1.hide();},_1.id);m.dialog.connect(_1,"onHide",function(){m.dialog.disconnect(_1);});_1.show();}});})(dojo,dijit,misys);dojo.require("misys.client.binding.trade.awb_tracking_client");}