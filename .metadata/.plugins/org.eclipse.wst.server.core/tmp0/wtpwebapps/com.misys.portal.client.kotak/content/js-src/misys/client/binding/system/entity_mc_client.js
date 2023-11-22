dojo.provide('misys.client.binding.system.entity_mc_client');
(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {
	'use strict'; // ECMA5 Strict Mode

	function crnFetchAjax() {
		var crnNo = dj.byId("abbv_name");
		var company = dj.byId("company_abbv_name");
		var crnType = "ENTITY";

		m.xhrPost({
			url: misys.getServletURL("/screen/AjaxScreen/action/CustomerFetchAction"),
			handleAs: "json",
			sync: true,
			content: {
				crn: crnNo.get("value"),
				company_abbv_name: company.get("value"),
				crn_type: crnType,

			},
			load: function(response, args) {
				var data = response;
				console.log("BCIF Reponse Data --------->", data);
				if (data != "" && data.status == "SUCCESS") {
					setEntityDetails(data);
				} else if (data != "" && data.status == "FAIL" && data.error_message != "") {
					var bcifFetch = dj.byId("bcif_fetch_entity_status");
					bcifFetch.set("value", false);
					m.dialog.show("ERROR", data.error_message);
				} else {
					var bcifFetch = dj.byId("bcif_fetch_entity_status");
					bcifFetch.set("value", false);
					m.dialog.show("ERROR", m.getLocalization("technicalError"));
				}
			},
			customError: function(response, args) {
				console.info("Error in crn fetch");
				m.dialog.show("ERROR", m.getLocalization("technicalError"));
			}
		});
	};


	function setEntityDetails(data) {
		if (data.response.Response) {
			
			var bcifFetch = dj.byId("bcif_fetch_entity_status");
			bcifFetch.set("value", true);
			
			var address1 = dj.byId('entity_street_name');
			if (address1) {
				if (data.response.Response.party_address.address1 != "") {
					var address1Value = data.response.Response.party_address.address1;
					address1.set("value", address1Value);
				}
			}

			var address2 = dj.byId('entity_town_name');
			if (address2) {
				if (data.response.Response.party_address.address2 != "") {
					var address2Value = data.response.Response.party_address.address2;
					address2.set("value", address2Value);
				}
			}

			var address3 = dj.byId('entity_country_sub_div');
			if (address3) {
				if (data.response.Response.party_address.address3 != "") {
					var address3Value = data.response.Response.party_address.address3;
					address3.set("value", address3Value);
				}
			}
			
			var email = dj.byId('email');
			if (email) {
				if (data.response.Response.contact_details.pref_email_id != "") {
					var emailValue = data.response.Response.contact_details.pref_email_id;
					email.set("value", emailValue);
				}
			}
			
			var contactPerson = dj.byId('contact_person');
			if (contactPerson) {
				if (data.response.Response.party_demographic.short_name != "") {
					var contactPersonValue = data.response.Response.party_demographic.short_name;
					contactPerson.set("value", contactPersonValue);
				}
			}
			
			var country = dj.byId('entity_country');
			if (country) {
				if (data.response.Response.party_demographic.nationality != "") {
					var countryValue = data.response.Response.party_demographic.nationality;
					country.set("value", countryValue);
				}

			}
			var postCode = dj.byId('entity_post_code');
			if (postCode) {
				if (data.response.Response.party_address.zip != "") {
					var postCodeValue = data.response.Response.party_address.zip;
					postCode.set("value", postCodeValue);
				}

			}
			
		}

	}
	
	function bcifFetchStatus() {
		var bcifFetch = dj.byId("bcif_fetch_entity_status");
		if (bcifFetch) {
			var isFetched = bcifFetch.get("value");
			console.log('isFetched--->' + isFetched);
			if (isFetched == "" || isFetched == undefined) {
				bcifFetch.set("value", false);
			}

		}
	}

	d.mixin(m, {

		client: {
			registerValidations: function() {
				m.connect("crnFetch", "onClick", function() {
					crnFetchAjax();
				});
			},

			prepareScreen: function() {
               bcifFetchStatus(); 
			},
			
			beforeSubmitValidations: function() {
				var bcifFetch = dj.byId("bcif_fetch_entity_status");
				var isSubmitValidation = dj.byId("is_submit_validation");
				if (bcifFetch && isSubmitValidation) {
					var isFetched = bcifFetch.get("value");
					var isSubmitValidationEnable = isSubmitValidation.get("value");
					console.log('isSubmitValidationEnable------>'+isSubmitValidationEnable);
					if (isFetched == "false" && isSubmitValidationEnable == "true") {

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