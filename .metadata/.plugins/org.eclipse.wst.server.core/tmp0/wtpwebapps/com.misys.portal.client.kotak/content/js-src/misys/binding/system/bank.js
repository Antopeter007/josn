dojo.provide("misys.binding.system.bank");

dojo.require("dojo.data.ItemFileReadStore");
dojo.require("dijit.form.FilteringSelect");
dojo.require("dijit.layout.TabContainer");
dojo.require("misys.validation.login");
dojo.require("misys.validation.password");
dojo.require("misys.form.common");
dojo.require("misys.validation.common");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.CheckBox");
dojo.require("dijit.layout.ContentPane");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode
	
	// Private functions and variables go here
	function _checkConfirmPassword(){
		m.checkConfirmPassword("password_value","password_confirm");
	}
	
	// Public functions & variables follow
	d.mixin(m, {

		bind : function() {
			m.setValidation("iso_code", m.validateBICFormat);
			m.setValidation("email", m.validateEmailAddr);
			m.setValidation("web_address", m.validateWebAddr);
			m.setValidation("password_value", m.validateChangePasswordNP);
			m.setValidation("password_confirm", m.validateChangePasswordCP);
			m.setValidation("abbv_name", m.validateCharactersExcludeSpace);
			m.setValidation("_country", m.validateCountry);
			m.setValidation("base_cur_code", m.validateCurrency);
			m.setValidation("phone", m.validatePhoneOrFax);
			m.setValidation("fax", m.validateFax);
			m.setValidation("telex", m.validateTelex);
			m.setValidation("address_line_1",m.validateSwiftAddressCharacters);
			m.setValidation("address_line_2",m.validateSwiftAddressCharacters);
			m.setValidation("dom",m.validateSwiftAddressCharacters);
			m.setValidation("liquidity_branch_reference", m.validateLiquidityBranchReference);
			m.connect("draftButton","onClick", m.beforeSaveValidations);
			m.setValidation("address_line_1",m.validateSwiftAddressCharacters);
			m.setValidation("address_line_2",m.validateSwiftAddressCharacters);
			m.setValidation("dom",m.validateSwiftAddressCharacters);
			m.connect("create_admin", "onClick", function(){
				m.toggleFields(this.get("checked"), null, ["password_value", "password_confirm"]);
			});
			m.connect('abbv_name', 'onChange', function(){
				m.checkAbbvNameExists();
			});
			m.connect('abbv_name', 'onKeyPress', function(e)
					{
					if(e.keyCode === 32 || e.charCode === 32){
						dojo.stopEvent(e);
					}
					});
			m.connect("password_value", "onBlur", _checkConfirmPassword);
		},

		onFormLoad : function() {
			var createAdmin = dj.byId("create_admin");
			var liqBranchRef = dj.byId("liquidity_branch_reference");
			if(liqBranchRef && liqBranchRef.get("value") !== null){
				misys._config.liqBranchRef = liqBranchRef.get("value");
			}
			if(createAdmin) {
				m.toggleFields(createAdmin.get("checked"),
					null, ["password_value", "password_confirm"]);
			}
			if(dojo.byId("img_view_full_details")){
				dojo.style(dojo.byId("img_view_full_details"), {'display':'none'});
				
			}
			
		},
		beforeSaveValidations: function() {
			var abbv_name = dijit.byId("abbv_name").get("value");
			var name= dijit.byId("name").get("value");
			var address=dijit.byId("address_line_1").get("value");
			console.debug("abbv_name:",abbv_name);
			if(!(abbv_name.length>0))
				{
					m._config.onSubmitErrorMsg = m.getLocalization("custAbbvNameEmptyError");
					dijit.byId("abbv_name").focus();
					return false;
				}
			 if(!(name.length>0))
			{
				m._config.onSubmitErrorMsg = m.getLocalization("mandatoryFieldsError");
				dijit.byId("abbv_name").focus();
				return false;
			}
			 if(!(address.length>0))
			{
				m._config.onSubmitErrorMsg = m.getLocalization("mandatoryFieldsError");
				dijit.byId("abbv_name").focus();
				return false;
			}
			else
				{
					return true;
				}
		}	
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.system.bank_client');