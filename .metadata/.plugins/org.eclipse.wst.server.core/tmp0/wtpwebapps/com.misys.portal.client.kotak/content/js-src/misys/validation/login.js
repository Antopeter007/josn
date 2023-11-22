dojo.provide("misys.validation.login");

// Copyright (c) 2000-2013 Misys (http://www.misys.com),
// All Rights Reserved. 
//
// summary:
// 		Validations for the login/change password pages.
//
// version:   1.2
// date:      20/04/11
// author:    Cormac Flynn

(function(/* Dojo */ d, /* Misys */ m){
	
	"use strict"; // ECMA5 Strict Mode
	
	// Private functions
	
	function _showExistingUserMsg(response){
		
		// summary:
	    // Validate a change login id, testing if the login id entered is existing in the database.
		// If already exists clear the entered log in id and prompt for new user id.
		
		console.debug("[Validate] Validating Login ID");
		
		var field;
		if(dijit.byId("new_user_name"))
		{
			field = dijit.byId("new_user_name");
		}
		else if(dijit.byId("login_id"))
		{
			field = dijit.byId("login_id");
		}
		var displayMessage = '';
			if(response.items.valid === true)
			{
				if(field!=undefined){
					field.focus();
					displayMessage = m.getLocalization("userNameExists", [field.get("value")]);
					field.set("value", "");
					field.set("state", "Error");
					dijit.hideTooltip(field.domNode);
					dijit.showTooltip(displayMessage,field.domNode, 0);
				}

			}else
			{
				console.debug("message is false");
			}
	}
	d.mixin(m, {
		checkUserExists : function()
		{
			var inputField;
			var newUserName = dijit.byId("new_user_name");
            var passwordValue = dijit.byId("password_value");
            var isValid;
            if(passwordValue && passwordValue.get('value') != "")
            {
                if(newUserName && newUserName != "" && newUserName.get("value") == dijit.byId("password_value").get("value").toUpperCase())
                {
                    passwordValue.set("state", "Error");
                    dijit.showTooltip(m.getLocalization("passwordContainsLoginIdError"), passwordValue.domNode, 0);
                }
                else if(newUserName && newUserName != "" && (passwordValue.get("value").toUpperCase().indexOf(newUserName.get("value").toUpperCase())) !== -1 && "false" === misys._e2ee.allowUserNameInPasswordValue)
                {
                   passwordValue.set("state", "Error");
                    dijit.showTooltip(m.getLocalization("passwordContainsLoginIdError"), passwordValue.domNode, 0);
                  //isValid = false;
                }
           }
            
			if(dijit.byId('new_user_name'))
			{
				inputField = dijit.byId('new_user_name');
			}
			else if(dijit.byId('login_id'))
			{
				inputField = dijit.byId('login_id');
			}
			var newuserName = (inputField!=undefined) ? inputField.get('value'):'';
			var company = dijit.byId('company');
			var companyName = company.get('value');
			if(newuserName != '') {
		
				m.xhrPost( {
					url : m.getServletURL("/screen/AjaxScreen/action/CheckUserNameAction"),
					handleAs 	: "json",
					sync 		: true,
					content : {
						new_user_name : newuserName,
						company_name : companyName
						// bank : todo
					},
					load : _showExistingUserMsg
				});
			}
		},
	
	checkEmailExists : function() {
		
		//var thisField = this.id?dijit.byId(this.id):dijit.byId(fieldId);
		var thisField = dijit.byId("email");
		var login = dijit.byId("login_id");
		var company = dijit.byId("company");
		var emailValue = thisField ? thisField.get("value"):"";
		var loginValue = login ? login.get("value"):"";
		var companyValue = company ? company.get("value"):"";
		var fieldStateValid =  (thisField && (thisField.get("state") === "Error" || thisField.get("state") === "Incomplete" || thisField.readOnly || thisField.disabled)) ? false: true;
		//Call validation only if BIC format is valid and is not one of the above conditions.
		if(emailValue && fieldStateValid)
		{
			//var prodCode = dijit.byId("product_code")? dijit.byId("product_code").get("value"): "";
			
			m.xhrPost({
				url : m.getServletURL("/screen/AjaxScreen/action/CheckEmailUniquenessAction"),
				handleAs : "json",
				sync : true,
				content : {
					emailInContext : emailValue,
					loginInContext : loginValue,
					companyInContext : companyValue
				},
				load : function(response){	
					var displayMessage = "";
					if(!response.items.isEmailUnique)
					{
						fieldStateValid = true;
						displayMessage = m.getLocalization("emailIdExists", [ emailValue ]);
						
						m.dialog.show("CUSTOM-NO-CANCEL", displayMessage, "Email Error", function(){
							dj.hideTooltip(thisField.domNode);
							dj.showTooltip(displayMessage, thisField.domNode, 0);
						});
						setTimeout(function(){
							dj.hideTooltip(thisField.domNode);
							}, 5000);
						
					}
				}
			});
		}
		
		return fieldStateValid;
	}
	});

})(dojo, misys);//Including the client specific implementation
       dojo.require('misys.client.validation.login_client');