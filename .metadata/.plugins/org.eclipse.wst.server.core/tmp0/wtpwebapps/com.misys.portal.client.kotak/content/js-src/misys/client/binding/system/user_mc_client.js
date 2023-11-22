dojo.provide('misys.client.binding.system.user_mc_client');
(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {
'use strict'; // ECMA5 Strict Mode

function crnFetchAjax(){
	  var crnNo;
	  
	  var loginId = dj.byId("login_id");
	  if(loginId != undefined)
	  {
	   crnNo = dj.byId("login_id");
	  }
	   var loginIdView = dj.byId("featureid");
	  if(loginIdView != undefined)
	  {
	   crnNo = dj.byId("featureid");
	  }
	 
		var company = dj.byId("company_abbv_name");
		var crnType = "USER";
		
		m.xhrPost({
			url : misys.getServletURL("/screen/AjaxScreen/action/CustomerFetchAction"),
			handleAs 	: "json",
			sync 		: true,
			content 	: {
				crn  :crnNo.get("value"),
				company_abbv_name :company.get("value"),
				crn_type :crnType,
				
						  },
			load		: function(response, args){
							var data = 	response;
							console.log("BCIF Reponse Data --------->",data);
							if(data != "" && data.status == "SUCCESS"){
								setUserDetails(data);
							} else if(data != "" && data.status == "FAIL" && data.error_message != ""){
								var bcifFetch = dj.byId("bcif_fetch_user_status");
					            bcifFetch.set("value", false);
								m.dialog.show("ERROR", data.error_message);
							} else{
								var bcifFetch = dj.byId("bcif_fetch_user_status");
					            bcifFetch.set("value", false);
								m.dialog.show("ERROR", m.getLocalization("technicalError"));
							}
							
						  },
				 customError : function(response, args){
					console.info("Error in crn fetch");
					m.dialog.show("ERROR", m.getLocalization("technicalError"));
				}
	});
	};
	
	function setUserDetails(data) {
		if (data.response.Response) {
			
			var bcifFetch = dj.byId("bcif_fetch_user_status");
			bcifFetch.set("value", true);
			
			var firstName = dj.byId('first_name');
			if (firstName) {
				if(data.response.Response.party_demographic.first_name != ""){
					var firstNameValue = data.response.Response.party_demographic.first_name;
				    firstName.set("value", firstNameValue);
				}
			}
			
			var lastName = dj.byId('last_name');
			if (lastName) {
				if(data.response.Response.party_demographic.last_name != ""){
					var lastNameValue = data.response.Response.party_demographic.last_name;
				    lastName.set("value", lastNameValue);
				}
			}
			
			
			var address1 = dj.byId('address_line_1');
			if (address1) {
				if(data.response.Response.party_address.address1 != ""){
					var address1Value = data.response.Response.party_address.address1;
				    address1.set("value", address1Value);
				}
			}
			
			var address2 = dj.byId('address_line_2');
			if (address2) {
				if(data.response.Response.party_address.address2 != ""){
					var address2Value = data.response.Response.party_address.address2;
				    address2.set("value", address2Value);
				}
			}
			
			var countrySubDivision = dj.byId('country_sub_div');
			if (countrySubDivision) {
				if(data.response.Response.party_address.state != ""){
					var countrySubDivisionValue = data.response.Response.party_address.state;
				    countrySubDivision.set("value", countrySubDivisionValue);
				}
			}
			
			var countryName = dj.byId('country_name');
			if (countryName) {
				if(data.response.Response.party_address.country != ""){
					var countryNameValue = data.response.Response.party_address.country;
				    countryName.set("value", countryNameValue);
				}
			}
			
			var dom = dj.byId('dom');
			if (dom) {
				if(data.response.Response.party_address.zip != ""){
					var domValue = data.response.Response.party_address.zip;
				    dom.set("value", domValue);
				}
			}
			
			var phone = dj.byId('phone');
			if (phone) {
				if(data.response.Response.contact_details.phone1 != ""){
					var phoneValue = data.response.Response.contact_details.phone1;
				    phone.set("value", phoneValue);
				}
			}
			
			var email = dj.byId('email');
			if (phone) {
				if(data.response.Response.contact_details.phone1 != ""){
					var emailValue = data.response.Response.contact_details.pref_email_id;
				    email.set("value", emailValue);
				}
			}
			
			}
		}
	
	function bcifFetchStatus() {
		var bcifFetch = dj.byId("bcif_fetch_user_status");
		if (bcifFetch) {
			var isFetched = bcifFetch.get("value");
			console.log('isFetched--->' + isFetched);
			if (isFetched == "" || isFetched == undefined) {
				bcifFetch.set("value", false);
			}

		}
	}
	
	//Check user name duplicate across DB
	function duplicateUserExists()
	{
		var inputField;
		var newUserName = dijit.byId("new_user_name");
        var passwordValue = dijit.byId("password_value");
        var isValid;
        if(passwordValue && passwordValue.get('value') != "")
        {
            if(newUserName.get("value") == dijit.byId("password_value").get("value").toUpperCase())
            {
                passwordValue.set("state", "Error");
                dijit.showTooltip(m.getLocalization("passwordContainsLoginIdError"), passwordValue.domNode, 0);
            }
            else if((passwordValue.get("value").toUpperCase().indexOf(newUserName.get("value").toUpperCase())) !== -1 && "false" === misys._e2ee.allowUserNameInPasswordValue)
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
				url : m.getServletURL("/screen/AjaxScreen/action/DuplicateUserNameCheckAction"),
				handleAs 	: "json",
				preventCache : true,
				sync 		: true,
				content : {
					new_user_name : newuserName,
					company_name : companyName
				},
				load : _showDuplicateUserMsg
			});
		}
	}
	
	function _showDuplicateUserMsg(response){
		
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
					displayMessage = m.getLocalization("duplicateUserNameExists", [field.get("value")]);
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

		client : {
			registerValidations : function() {
				
				m.connect('login_id', 'onChange', function(){
					duplicateUserExists();
				});	
			  m.connect("crnFetch", "onClick", function() {
					crnFetchAjax();
				});
			},
			
			prepareScreen : function(){
				bcifFetchStatus(); 		
			},
			
			beforeSubmitValidations: function() {
				var bcifFetch = dj.byId("bcif_fetch_user_status");
				var bcifCompanyType = dj.byId("bcif_company_type");
				var isSubmitValidation = dj.byId("is_submit_validation");
				console.log('bcifCompanyType------->'+bcifCompanyType);
				if (bcifFetch && bcifCompanyType && isSubmitValidation) {
					var isFetched = bcifFetch.get("value");
					var companyType = bcifCompanyType.get("value");
					var isSubmitValidationEnable = isSubmitValidation.get("value");
					console.log('isSubmitValidationEnable------>'+isSubmitValidationEnable);
					if (isFetched == "false" && companyType == '03' && isSubmitValidationEnable == "true") {

						var timeoutInMs = 4000;
						var hideTT = function() { dj.hideTooltip(dijit.byId("crnFetch").domNode); };
						var displayMessage = misys.getLocalization("bcifFetchError");

						dj.byId("crnFetch").focus();
						dj.hideTooltip(dijit.byId("crnFetch").domNode);
						dijit.showTooltip(displayMessage, dijit.byId("crnFetch").domNode, 0);
						setTimeout(hideTT, timeoutInMs);
						
						return false;
					}
				}
				return true;
			}
		}

	});

})(dojo, dijit, misys);