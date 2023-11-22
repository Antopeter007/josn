/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.widget.Dialog"]){dojo._hasResource["misys.widget.Dialog"]=true;dojo.provide("misys.widget.Dialog");dojo.experimental("misys.widget.Dialog");dojo.require("dijit.Dialog");dojo.declare("misys.widget.Dialog",[dijit.Dialog],{_onKey:function(_1){var _2=_1.keyCode||_1.charCode;var k=dojo.keys;if(_2==k.ESCAPE){_1.preventDefault();dojo.stopEvent(_1);}else{this.inherited(arguments);}},onLoad:function(){this.inherited(arguments);},onCancel:function(){document.body.style.overflow="visible";},show:function(){var _3=body.style;_3.overflow="hidden";if(!window.isAccessibilityEnabled){this.inherited(arguments);return;}if(window.isAccessibilityEnabled){if(dojo.query(".errorDialog",this.domNode)&&dojo.query(".errorDialog",this.domNode).length>0){dojo.attr(dojo.query(".errorDialog",this.domNode)[0],"role","alert");dojo.attr(dojo.query("#alertDialog_title",this.domNode)[0],"role","alert");}if(dojo.query(".informationDialog",this.domNode)&&dojo.query(".informationDialog",this.domNode).length>0){dojo.attr(dojo.query(".informationDialog",this.domNode)[0],"role","alert");dojo.attr(dojo.query("#alertDialog_title",this.domNode)[0],"role","alert");}if(dojo.query("#okButton",this.domNode)&&dojo.query("#okButton",this.domNode).length>0&&dojo.query("#alertDialogContent",this.domNode)&&dojo.query("#alertDialogContent",this.domNode).length>0){dojo.attr(dojo.query("#okButton",this.domNode)[0],"aria-describedby","alertDialogContent");}dojo.query(".dijitButtonNode",this.domNode).forEach(function(_4){dojo.attr(_4,"role","application");});}this.inherited(arguments);},_getFocusItems:function(){this.inherited(arguments);var _5=body.style;_5.overflow="hidden";if(this.closeButtonNode){if(dojo.style(this.closeButtonNode,"display")!=="none"){this._firstFocusItem=this.closeButtonNode;}}},_onBlur:function(by){var _6=body.style;_6.overflow="";this.inherited(arguments);if(!window.isAccessibilityEnabled){return;}var _7=dojo.hitch(this,function(){if(this.open&&!this._destroyed&&dijit._DialogLevelManager.isTop(this)){this._getFocusItems(this.domNode);dijit.focus(this._firstFocusItem);}});if(by=="mouse"){if(dojo.isChrome||dojo.isFF||dojo.isMozilla){_6.overflow="auto";}else{_6.overflow="hidden";}var _8=dojo.connect(this.ownerDocument,"mouseup",_7);dojo.disconnect(_8);}else{_7();}}});}