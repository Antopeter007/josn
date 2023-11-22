dojo.provide("misys.binding.system.reset_password");
/*
 -----------------------------------------------------------------------------
 Scripts for the login page.
 
 Note: the function fncFormSpecificValidation is required

 Copyright (c) 2000-2013 Misys (http://www.misys.com),
 All Rights Reserved. 

 version:   1.0
 date:      19/03/08
 -----------------------------------------------------------------------------
*/

dojo.require("dojo.parser");
dojo.require("dijit.form.CheckBox");
dojo.require("dijit.form.FilteringSelect");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("misys.validation.password");
dojo.require("misys.validation.login");
dojo.require("misys.form.common");
dojo.require("misys.validation.common");
dojo.require("dojo._base.json");

(function(/*Dojo*/ d, /*Dijit*/dj, /*Misys*/m){

	function _checkConfirmPassword(){
		m.checkConfirmPassword("password_value","password_confirm");
	}
	
	d.mixin(m, {
		bind : function(){
			//  summary:
		    //            Binds validations and events to fields in the form.              
		    //   tags:
		    //            public
			
			//m.setValidation('username', m.validateLoginId);
			//m.setValidation('company', m.validateLoginId);
			m.setValidation('password_value', m.validateChangePasswordNP);
			m.setValidation('password_confirm', m.validateChangePasswordCP);	
			m.connect("password_value", "onBlur", _checkConfirmPassword);
			
			//TODO write the validation for answers to the questions. 
		},
		clearFields : function (){
			dojo.forEach(dojo.query('.dijitInputInner'),function(node){dijit.byId(node.id).set('value','');});
		},
		beforeSubmitEncryption: function (){
			// FOR CLIENT SIDE PWD ENCRYPTION
			if(dj.byId("clientSideEncryption"))
			{
				try
				{
					dijit.byId('password').set('value', misys.encrypt(dijit.byId('password').get('value')));
					return true; 
				}
				catch(error){
		     	/* show error to user */
					misys.dialog.show("ERROR", misys.getLocalization("passwordNotEncrypted"), "", function(){});
					return false;
				}
			}
		}
	});
})(dojo, dijit, misys);






//Including the client specific implementation
       dojo.require('misys.client.binding.system.reset_password_client');