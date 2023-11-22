dojo.provide("misys.binding.dialog.reauth");
dojo.require("misys.validation.common");
(function( /*Dojo*/d,
		   /*Dijit*/dj, 
		   /*Misys*/ m) {

	"use strict"; // ECMA5 Strict Mode

	//
	// Private functions & variables
	//
	var _reauthDialogID = "reauth_dialog";
	var cancelFocused = false;
	
	function _cancelReAuth(dialog)
	{
		cancelFocused = false;
		dialog.hide();
		// Destroy all previous widgets and containers
		var widgets = dj.findWidgets(dojo.byId("reauth_dialog_content"));
		dojo.forEach(widgets, function(w)
		{
			w.destroyRecursive(false);
		});

		// Destroy all the Children
		dojo.empty("reauth_dialog_content");
		if(dj.byId("realform_operation"))
		{
			var realformOperation = dj.byId("realform_operation");
			realformOperation.set("value",originalOperationValue);
		}
		/*if (realformOperation && realformOperation.get("value") !== "") 
		{
			realformOperation.set("value", "");
		}*/
		if(dj.byId("alertDialog"))
		{
			dj.byId("alertDialog").hide();
		}
	}
	
	function _proceedReAuth(dialog ,count)
	{
		if (dialog.validate())
		{
			//If it is not a normal 'realform' for submission
			//that means multiple submission from ListDef screen or action from normal list screen
		    if(d.isFunction(m._config.reauthSubmit))
		    {   
		    	dialog.hide();
		    	m._config.reauthSubmit();
		    }
		    else
		    {
		    	dj.byId("reauth_otp_response") ?  dj.byId("reauth_otp_response").set("value", dj.byId("reauth_password").get("value")) : "";
		    	dj.byId("TransactionData") ? dj.byId("TransactionData").set("value", misys.formToXML()) : "" ;
		    	if(dijit.byId("doReauthentication"))
				{
					dijit.byId("doReauthentication").set("disabled",true);
				}
				dialog.hide();
				dj.byId("realform").submit();
		    }
			count++;
		}
	}
	
	d.mixin(m, {
		beforeSubmitEncryptionReauth: function (){
			// FOR CLIENT SIDE PWD ENCRYPTION
			if(dj.byId("clientSideEncryption"))
			{
				try
				{
					if(dijit.byId('reauth_password') && dijit.byId('reauth_password').get("value") !== "")
					{
						dijit.byId('reauth_password').set('value', misys.encrypt(dijit.byId('reauth_password').get('value')));
						if(dijit.byId("doReauthentication"))
						{
							dijit.byId("doReauthentication").set("disabled",true);
						}
					}
					return true; 
				}
				catch(error){
		     	/* show error to user */
					misys.dialog.show("ERROR", misys.getLocalization("passwordNotEncrypted"), "", function(){});
					if(dijit.byId("doReauthentication"))
					{
						dijit.byId("doReauthentication").set("disabled",false);
					}
					return false;
				}
			}
		}
	});

	
	// Onload/Unload/onWidgetLoad Events
	d.subscribe("ready", function()
	{
		var dialog = dj.byId(_reauthDialogID),count = 0;
		m.setValidation("reauth_password", m.validatePassword);
		if(dialog)
		{
			var pwd = dj.byId("reauth_password");
			m.dialog.connect(dialog, "onShow", function()
			{
				pwd.set("required", true);				
			});
			m.dialog.connect(dialog, "onHide", function()
			{
				pwd.set("value", "");
				pwd.set("required", false);
			});
		
			m.dialog.connect(dialog, "onKeyPress", function(evt)
			{
				switch (evt.keyCode)
				{
					case d.keys.ESCAPE: 
						d.stopEvent(evt);
						_cancelReAuth(dialog);
						break;
					case d.keys.ENTER:
						if(dijit.byId("doReauthentication")&& !cancelFocused)
						{
							dijit.byId("doReauthentication").focus();
						}
						if(dj.byId("clientSideEncryption"))
						{// for client side password encryption 
							misys.encryptBeforeSubmitReauth();
						}
						if(count === 0 && !cancelFocused)
						{
							_proceedReAuth(dialog , count);
							d.stopEvent(evt);
							break;
						}
						default:
							break;
				}
			});
		
			m.dialog.connect("doReauthentication", "onClick", function()
			{
				if(dj.byId("clientSideEncryption"))
				{// for client side password encryption 
					misys.encryptBeforeSubmitReauth();
				}
				if(m.isFormDirty && m.isFormDirty === true )
				{
					m.isFormDirty = false;
				}
				if(count === 0)
				{
					_proceedReAuth(dialog , count);
				}
			}, _reauthDialogID);
			m.dialog.connect("cancelReauthentication", "onClick", function()
			{
				_cancelReAuth(dialog);
			}, _reauthDialogID);
			
			m.dialog.connect("doReauthentication", "onFocus", function()
			{
				cancelFocused = false;
			}, _reauthDialogID);
			m.dialog.connect("cancelReauthentication", "onFocus", function()
			{
				cancelFocused = true;
			}, _reauthDialogID);
		}
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.dialog.reauth_client');