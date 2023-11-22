dojo.provide("misys.HelpdeskCrmBinding");
/*
 ----------------------------------------------------------
 Event Binding for

 UserTools portlet to send a mail to CRM or HelpDesk

 Copyright (c) 2000-2010 Misys (http://www.misys.com),
 All Rights Reserved. 

 version:   1.0
 date:      12/09/08
 ----------------------------------------------------------
 */
dojo.require("misys.form.common");
dojo.require("misys.validation.common");
dojo.require("dijit.form.Form");
dojo.require("misys.widget.Dialog");

fncDoBinding = function() {

};

fncShowDialog = function(dialogContainerId, dialogId, dialogContentId,
		cancelButton) {
	var dialog = dijit.byId(dialogId);
	
	if (!dialog) {
		dojo.require('misys.widget.Dialog');
		dojo.require('dijit.form.Button');
		dojo.parser.parse(dialogContainerId);
		dialog = dijit.byId(dialogId);
		dojo.addClass(dialog.domNode, 'dialog');
	} 
	
	var dialogButtons = dojo.byId('dialogButtons'),
	    cancelButtonNode = dijit.byId(cancelButton).domNode,
	    alertDialogContent = dojo.byId('alertDialogContent'); 

	dojo.style(dialogButtons, 'display', 'block');
	dojo.style(cancelButtonNode, 'display', 'inline-block');
	dojo.style(alertDialogContent, 'display', 'block');

	var title = "" + dialogId + "Title";
	dialog.set('title', misys.getLocalization(title));
	
	misys.dialog.connect(dialogId, 'onKeyPress', function (evt){
		 if(evt.keyCode == dojo.keys.ESCAPE){
			 dojo.stopEvent(evt);
		 }
	});
	misys.dialog.connect(cancelButton, 'onMouseUp', function(){
		misys.dialog.disconnect(dialog);
		dialog.hide();
	});
	dialog.show();
};