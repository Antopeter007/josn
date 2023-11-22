dojo.provide("misys.binding.core.maker_checker_common");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {
	
	"use strict"; // ECMA5 Strict Mode
	d.mixin(m.popup, {
		showMaster: function()
		{
			var	master_url_field= dj.byId("master_url");
			if(master_url_field && "S" + master_url_field.get("value") != "S")
			{
				_openPopup(master_url_field.get("value"),'','');
			}
		}
	});
	
	function _openPopup( /*String*/ url,
			 /*String*/ name,
			 /*String*/ props) {
			// summary:
			//	Opens a new popup window
			//
			// description:
			//		We distinguish between Dialogs, which are in-page overlays (see misys.dialog.*) and
			//		popups, which are simply new windows (see misys.popup.*);
			//
			//		Note: Don't change the popup window name without also changing the SELENIUM
			// 		test; name is used to select the window
			
			var windowName = name || misys.getLocalization("transactionPopupWindowTitle"),
			windowProps = props || "width=800,height=500,resizable=yes,scrollbars=yes",
			popupWindow = d.global.open(url, windowName, windowProps);
			
			console.debug("[misys.common] Opening a standard popup with name", windowName, "at URL", url);
			if(!popupWindow.opener){
			popupWindow.opener = self;
			}
			
			popupWindow.focus();
			}
})(dojo, dijit, misys);	//Including the client specific implementation
       dojo.require('misys.client.binding.core.maker_checker_common_client');