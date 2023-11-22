dojo.provide('misys.client.binding.system.beneficiary_master_mc_client');
(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {
	'use strict'; // ECMA5 Strict Mode


	function _showExistingBeneficiaryNickName(response) {
		var field = dijit.byId("counterparty_nickname");
		var displayMessage = '';
		var timeoutInMs = 5000;
		var hideTT = function() {
			dj.hideTooltip(field.domNode);
		};
		if (response.items.valid === true && (dijit.byId("counterparty_nickname").get("_lastValueReported") !== dijit.byId("counterparty_nickname").get("_resetValue"))) {
			displayMessage = m.getLocalization("BeneficiaryNickNameExists", [field.get("value")]);
			field.set("value", "");
			field.set("state", "Error");
			dijit.hideTooltip(field.domNode);
			dijit.showTooltip(displayMessage, field.domNode, 0);
			setTimeout(hideTT, timeoutInMs);
		}
		else {
			console.debug("message is false");
		}
	}


	function _validateBeneficiaryNickName() {


		var companyid = null;
		if (dijit.byId('company')) {
			companyid = dijit.byId('company').get("_lastValueReported");
		}

		var newNickName = dijit.byId("counterparty_nickname").value;
		//var duplicateBeneficiaryValidation = dj.byId("DUPLICATE_BENEFICIARY_NAME_VALIDATION_FLAG");
		if (newNickName != '') {

			m.xhrPost({
				url: m.getServletURL("/screen/AjaxScreen/action/CheckBeneficiaryNickNameAction"),
				handleAs: "json",
				sync: true,
				content: {
					new_user_name: newNickName,
					company_name: companyid
				},
				load: _showExistingBeneficiaryNickName
			});
		}
	}




	d.mixin(m, {

		client: {
			registerValidations: function() {
				m.connect("counterparty_nickname", "onBlur", _validateBeneficiaryNickName);
			},

			prepareScreen: function() {
                if(dj.byId("counterparty_nickname")){
					m.toggleRequired("counterparty_nickname", true);
				}
			}

		}

	});

})(dojo, dijit, misys);