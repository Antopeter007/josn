/**
 * Timer to periodically check for any asynchronous transaction message
 * DEMO for Unsaved Data Alert
 */
dojo.provide("misys.binding.AsyncMessage");
dojo.require("dijit.form.Button");

(function(/*Dojo*/ d, /*Misys*/m){
	
	"use strict"; // ECMA5 Strict Mode
	
	// Private Methods
	//Dialog for After Max duration over Session
	function _showAsyncMessageDialog(/*XHRResponse*/ response){
		
		var asyncMsgDialog = dijit.byId("asyncSaveDialog");
		var asyncMsgDialogButtons = dojo.byId('asyncSaveDialogButtons');
		var asyncMsgButton = dijit.byId('OkAsyncButton').domNode;
		var asyncMsgDialogContent = dojo.byId('asyncSaveDialogContent');
		var asyncMsgWidgetContainer = dijit.byId('asyncSaveDialog').domNode;
		var asyncMsg = dojo.byId('asyncSaveDialogMsg');

		dojo.style(asyncMsgDialogButtons, 'display', 'block');
		dojo.style(asyncMsgDialogContent, 'display', 'block');
		dojo.style(asyncMsgButton, 'display', 'inline-block');
		dojo.style(asyncMsgWidgetContainer, 'display', 'inline-block');
		dojo.style(asyncMsg, 'display', 'inline-block');
		asyncMsgDialog.set('title', misys.getLocalization('asyncMessage'));
		asyncMsg.innerHTML = response.asyncMessage;
		
		// Disable window closing by using the escape key
		misys.dialog.connect(asyncMsgDialog, 'onKeyPress', function(evt) {
			if (evt.keyCode == dojo.keys.ESCAPE) {
				dojo.stopEvent(evt);
			}
		});
			
		misys.dialog.connect(dijit.byId('OkAsyncButton'), 'onMouseUp', function(){
			misys.dialog.disconnect(asyncMsgDialog);
			asyncMsgDialog.hide();
		}, asyncMsgDialog.id);
		
		misys.dialog.connect(asyncMsgDialog, 'onHide', function() {
				misys.dialog.disconnect(asyncMsgDialog);
		});
		
		asyncMsgDialog.show();
	}
	
	//Public Methods
	d.mixin(m, {
		checkAsyncMessage : function(/*Number*/ counter){
			misys.xhrGet( {
				url : misys.getServletURL("/screen/AjaxScreen/action/PingAction"),
				sync : true,
				handleAs : "json",
				load : function(response, args){
					if(response.asyncMessage)
					{
						console.debug("Message found!");
						_showAsyncMessageDialog(response);
					}	
					else
					{
						counter++;
						setTimeout("misys.checkAsyncMessage("+counter+")", m._config.asyncMessageFreq || 5000);
					}	
				},
				error : function(error) {				
					console.debug("Some error:",error);
				}
			});
		}
	});
})(dojo, misys);	