dojo.provide("misys.binding.system.authentication");

dojo.require("dijit.form.Form");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.Button");
dojo.require("misys.widget.Dialog");
dojo.require("misys.validation.login");
dojo.require("misys.validation.password");
dojo.require("misys.form.common");
dojo.require("misys.validation.common");
dojo.require("misys.common");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {
	
	"use strict"; // ECMA5 Strict Mode
	
	function _checkConfirmPassword(){
		m.checkConfirmPassword("password_value","password_confirm");
	}
	
	d.mixin(m, {
		bind : function() {
			m.setValidation("password_value", misys.validateChangePasswordNP);
			m.setValidation("password_confirm", misys.validateChangePasswordCP);
			m.connect("password_value", "onBlur", _checkConfirmPassword);
		},	
		beforeSubmitEncryption: function (){
			// FOR CLIENT SIDE PWD ENCRYPTION
			if(dj.byId("clientSideEncryption"))
			{
				try
				{
					if(dijit.byId('password_value')){dijit.byId('password_value').set('value', misys.encrypt(dijit.byId('password_value').get('value')));}
					if(dijit.byId('password_confirm')){dijit.byId('password_confirm').set('value', misys.encrypt(dijit.byId('password_confirm').get('value')));}
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
	

	d.mixin(m._config, {
		
		initReAuthParams : function(){	
			
			var reAuthParams = { 	productCode : 'UA',
			         				subProductCode : '',
			        				transactionTypeCode : '01',
			        				entity : '',			        			
			        				currency : '',
			        				amount : '',
			        				
			        				es_field1 : '',
			        				es_field2 : ''
								  };
			return reAuthParams;
		}

});
	
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.system.authentication_client');