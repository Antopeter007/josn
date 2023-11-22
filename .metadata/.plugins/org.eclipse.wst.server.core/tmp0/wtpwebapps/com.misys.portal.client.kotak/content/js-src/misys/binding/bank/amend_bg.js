dojo.provide("misys.binding.bank.amend_bg");

dojo.require("dijit.layout.TabContainer");
dojo.require("dijit.form.DateTextBox");
dojo.require("misys.form.CurrencyTextBox");
dojo.require("dijit.form.FilteringSelect");
dojo.require("misys.form.file");
dojo.require("misys.form.addons");
dojo.require("misys.form.SimpleTextarea");
dojo.require("dijit.Editor");
dojo.require("dojo.data.ItemFileReadStore");
dojo.require("misys.form.common");
dojo.require("misys.validation.common");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.TextBox");
dojo.require("misys.widget.Dialog");
dojo.require("dijit.ProgressBar");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.CheckBox");
dojo.require("dijit.layout.ContentPane");
dojo.require("misys.widget.Collaboration");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode
	
	// Private functions and variables go here
	function _validateReleaseAmount(){
		//  summary:
	    //       Validates the release amount. Must be applied to an input field of 
		//       dojoType dijit.form.CurrencyTextBox.
		if(dj.byId("sub_tnx_type_code") && dj.byId("sub_tnx_type_code").get("value") =="05" && dj.byId("prod_stat_code") && dj.byId("prod_stat_code").get("value") !=="01")
			{
				var bgReleaseAmt = dj.byId("release_amt");
				var orgBGLiab = dj.byId("org_bg_liab_amt");
				var bgReleaseValue = dj.byId("release_amt") ? dj.byId("release_amt").get("value"):'';
				var orgBGLiabValue = dojo.number.parse(orgBGLiab.get("value")) || 0;
				console.debug("[misys.binding.trade.release_bg] Validating Release Amount, Value = ", bgReleaseValue);
				console.debug("[misys.binding.trade.release_bg] Original Amount, Value = ", orgBGLiabValue);
				console.debug("[misys.binding.trade.release_bg] Content of Error Message = ", m.getLocalization("releaseAmtGreaterThanOrgLiabAmtError"));
				if(bgReleaseAmt && orgBGLiab && (bgReleaseValue <= 0 || bgReleaseValue > orgBGLiabValue))
				{
					misys.dialog.show("ERROR", misys.getLocalization("canNotReleaseTheTransaction"), "", function(){
						dj.byId("release_amt").focus();
					 	dj.byId("release_amt").set("state","Error");
					});
					dj.byId("bg_liab_amt").set("value",orgBGLiabValue);
					return false;
				}
				if(!isNaN(bgReleaseValue))
				{
					var newBgLiabAmt = orgBGLiabValue - bgReleaseValue;
					dj.byId("bg_liab_amt").set("value",newBgLiabAmt);
					return true;
				}
				else
				{
					dj.byId("bg_liab_amt").set("value",orgBGLiabValue);
				}
			}
			return true;
	}
	// Public functions & variables follow
	d.mixin(m, {

		// TODO Can't find a reference to functions fncValidateAdditionalAmendAmount,
		//		fncToggleAdditionalIncAmt and fncUtilisationAmount
		
		bind : function() {
			m.setValidation("iss_date", m.validateIssueDate);
			m.setValidation("amd_date", m.validateAmendmentDate);
			m.setValidation("exp_date", m.validateBankExpiryDate);
			m.setValidation("inc_amt", function(isFocused){
				return m.validateAmendAmount(isFocused, this, "bg");
			}, true);
			m.setValidation("dec_amt", function(isFocused){
				return m.validateAmendAmount(isFocused, this, "bg");
			}, true);
			
			if(dj.byId("renew_flag"))
			{
				dj.byId("renew_flag").set("readOnly", true);
			}
			if(dj.byId("final_expiry_date"))
			{
				dj.byId("final_expiry_date").set("readOnly", true);
			}
			if(dj.byId("renew_amt_code_1"))
			{
				dj.byId("renew_amt_code_1").set("readOnly", true);
			}
			if(dj.byId("renew_amt_code_2"))
			{
				dj.byId("renew_amt_code_2").set("readOnly", true);
			}
			
			/*m.setValidation("renew_flag", m.validateBankExpiryDate);*/
			
			var amtFields = [
					"inc_amt_2", "inc_amt_3", "inc_amt_4",
					"dec_amt_2", "dec_amt_3", "dec_amt_4"];
			d.forEach(amtFields, function(id){
				//m.setValidation(id, fncValidateAdditionalAmendAmount);
				//m.connect(id, "onFocus", fncToggleAdditionalIncAmt);
			});

			//m.connect("tnx_amt", "onBlur", fncUtilisationAmount);
			m.connect("inc_amt", "onBlur", m.amendTransaction);
			m.connect("dec_amt", "onBlur", m.amendTransaction);

			amtFields.push("inc_amt");
			amtFields.push("dec_amt");
			d.forEach(amtFields, function(id){
				m.connect(id, "onBlur", function(){
				 // If any of the fields are non-empty, amd_details is required.
				 m.toggleFields(dj.byId(id).get("value"), null, ["amd_details"]);
				});
			});
			m.connect("dec_amt", "onBlur", function(){
				var	liabAmt = dj.byId("org_bg_liab_amt").get('value');
				var updatedLiabAmt;
					if(!isNaN(dj.byId("dec_amt").get('value')))
						{
						updatedLiabAmt=	dojo.number.parse(liabAmt) - dojo.number.parse(dj.byId("dec_amt").get('value'));
						dj.byId("bg_liab_amt").set("value",updatedLiabAmt);
						}
					else
						{
						dj.byId("bg_liab_amt").set("value",dj.byId("org_bg_liab_amt").get('value'));
						}
					
			});
			m.connect("inc_amt", "onBlur", function(){
				var	liabAmt = dj.byId("org_bg_liab_amt").get('value');
					var updatedLiabAmt;
					if(!isNaN(dj.byId("inc_amt").get('value')))
					{
					updatedLiabAmt=	dojo.number.parse(liabAmt) + dojo.number.parse(dj.byId("inc_amt").get('value'));
					dj.byId("bg_liab_amt").set("value",updatedLiabAmt);
					}
				else
					{
					dj.byId("bg_liab_amt").set("value",dj.byId("org_bg_liab_amt").get('value'));
					}
			
			});
			m.connect("release_amt", "onBlur", _validateReleaseAmount);
			m.connect("prod_stat_code", "onChange", function(){
				if(dj.byId("sub_tnx_type_code") && dj.byId("sub_tnx_type_code").get("value") === "05")
					{
						var prodStatCode = dj.byId("prod_stat_code");
						if( prodStatCode && prodStatCode.get("value") === "01" ){
							dj.byId("release_amt").set("readOnly", true);
						} else {
							dj.byId("release_amt").set("readOnly", false);
						}
					}
				if(dj.byId("prod_stat_code") && (dj.byId("prod_stat_code").get("value") !== "" && dj.byId("prod_stat_code").get("value") !== "01" && dj.byId("prod_stat_code").get("value") !== "08"))
					{
						if(!(dj.byId("sub_tnx_type_code") && dj.byId("sub_tnx_type_code").get("value") === "05" && dj.byId("prod_stat_code").get("value") === "76")) {
						//	m.updateOutstandingAmount(dj.byId("bg_liab_amt"), dj.byId("org_bg_liab_amt"),"",dj.byId("bg_available_amt"));
							m.updateOutstandingAmount(dj.byId("bg_liab_amt"), dj.byId("org_bg_liab_amt"));
						}
					}
			});
			//m.connect("prod_stat_code", "onChange", fncResetDocAmount);
			//m.connect("prod_stat_code", "onChange", fncToggleDocumentAmt);
			//m.connect("prod_stat_code", "onChange", fncResetBankReference);
			//m.connect("prod_stat_code", "onChange", fncResetDocPresentation);
			//m.connect("prod_stat_code", "onChange", fncDiscrepancyActionRequired);
			//m.connect("action_req_code", "onChange", fncDiscrepancyActionRequired);
			m.connect("bg_release_flag", "onClick", m.toggleAmendmentFields);
		},

		onFormLoad : function() {
		
				
				if(dj.byId("bg_liab_amt"))
					{
					var	liabAmt = dj.byId("org_bg_liab_amt").get('value');
					var updatedLiabAmt;
					
					if(!isNaN(dj.byId("dec_amt").get('value')))
						{
						updatedLiabAmt=	dojo.number.parse(liabAmt) - dojo.number.parse(dj.byId("dec_amt").get('value'));
						dj.byId("bg_liab_amt").set("value",updatedLiabAmt);
						}
					else if(!isNaN(dj.byId("inc_amt").get('value')))
					{
					updatedLiabAmt=	dojo.number.parse(liabAmt) + dojo.number.parse(dj.byId("inc_amt").get('value'));
					dj.byId("bg_liab_amt").set("value",updatedLiabAmt);
					}
				else
					{
					dj.byId("bg_liab_amt").set("value",dj.byId("org_bg_liab_amt").get('value'));
					}
					}
			if(dj.byId("bg_liab_amt") && dj.byId("release_amt")) {
				var orgBgLiabValue = dojo.number.parse(dj.byId("org_bg_liab_amt").get("value")) || 0,
						bgReleaseAmt = dj.byId("release_amt").get("value");
			
				if(bgReleaseAmt > orgBgLiabValue)
					{  	
						m.dialog.show("ERROR", m.getLocalization("canNotReleaseTheTransaction"));
						dj.byId("bg_liab_amt").set("value",orgBgLiabValue);
					}
				else{
						var newBgLiabAmt = orgBgLiabValue - bgReleaseAmt;
						dj.byId("bg_liab_amt").set("value",newBgLiabAmt);
					}
			}			
			
			m.setCurrency(dj.byId("bg_cur_code"), ["tnx_amt","bg_liab_amt"]);
			if (dj.byId("tnx_type_code") && (dj.byId("tnx_type_code").get("value") === '15' || (dj.byId("tnx_type_code").get("value") === '13')) && (m._config.enable_to_edit_customer_details_bank_side == "false"))
			{
				dojo.style('transactionDetails', "display", "none");
			} else
			{
				if (m._config.enable_to_edit_customer_details_bank_side == "false")
				{
					dojo.style('transactionDetails', "display", "none");

					var transactionids = [ "exp_date", "beneficiary_name",
							"beneficiary_address_line_1", "beneficiary_address_line_2",
							"beneficiary_dom", "beneficiary_country",
							"beneficiary_reference", "beneficiary_contact_number",
							"renew_flag", "renew_on_code", "renewal_calendar_date",
							"renew_for_nb", "renew_for_period", "advise_renewal_flag",
							"rolling_renewal_flag", "rolling_renew_on_code",
							"rolling_renew_for_nb", "rolling_renew_for_period",
							"rolling_day_in_month", "rolling_renewal_nb",
							"rolling_cancellation_days", "renew_amt_code_1",
							"renew_amt_code_2", "projected_expiry_date",
							"final_expiry_date", "advise_renewal_days_nb", "bg_amt",
							"amd_details", "org_bg_amt", "inc_amt", "dec_amt" ];
					d.forEach(transactionids, function(id)
					{
						var field = dj.byId(id);
						if (field)
						{
							m.toggleRequired(field, false);
						}
					});

				}
			}
		},

		beforeSubmitValidations : function() {
			
			if(dj.byId("sub_tnx_type_code") && dj.byId("sub_tnx_type_code").get("value") ==="05" && dj.byId("prod_stat_code") && dj.byId("prod_stat_code").get("value") !=="01")
			{
			 var bgReleaseAmt = dj.byId("release_amt");
				var orgBGLiab = dj.byId("org_bg_liab_amt");
				var bgReleaseValue = dj.byId("release_amt") ? dj.byId("release_amt").get("value"):'';
				var orgBGLiabValue = dojo.number.parse(orgBGLiab.get("value")) || 0;
				console.debug("[misys.binding.trade.release_bg] Validating Release Amount, Value = ", bgReleaseValue);
				console.debug("[misys.binding.trade.release_bg] Original Amount, Value = ", orgBGLiabValue);
				console.debug("[misys.binding.trade.release_bg] Content of Error Message = ", m.getLocalization("releaseAmtGreaterThanOrgLiabAmtError"));
				if(bgReleaseAmt && orgBGLiab && (bgReleaseValue <= 0 || bgReleaseValue > orgBGLiabValue) && orgBGLiabValue != '0')
				{
					m._config.onSubmitErrorMsg = m.getLocalization("canNotReleaseTheTransaction");
					dj.byId("bg_liab_amt").set("value",orgBGLiabValue);
					return false;
				}
				else if(orgBGLiabValue === '0')
				{
					m._config.onSubmitErrorMsg = m.getLocalization("canNotProceedTheTransaction");
					dj.byId("bg_liab_amt").set("value",orgBGLiabValue);
					return false;
				}
			 }
			// We check that at least one of the field describing the amendment
			// contains data (SWIFT 2006)
			var fieldsToCheck = [
					"exp_date", "org_exp_date", "exp_date_type_code",
					"org_exp_date_type_code", "inc_amt", "dec_amt", "amd_details", "file"];

			// Check that all fields are present.
			var allFieldsPresent = d.every(fieldsToCheck, dj.byId);

			// Check that 
			if(allFieldsPresent) {
				fieldsToCheck = [
						"inc_amt_2", "inc_amt_3", "inc_amt_4",
						"dec_amt_2", "dec_amt_3", "dec_amt_4"];
				
				var allAdditionalFieldsEmpty = d.every(fieldsToCheck, dj.byId);
				
				// Check non-date values against their org_ values
				var fieldsToCheckAgainstOrg = ["exp_date_type_code"];
				var allFieldsMatch = d.every(fieldsToCheckAgainstOrg, function(id){
					var value = dj.byId(id).get("value") + "";
					var orgValue = dj.byId("org_" + id).get("value") + "";
					
					// For number fields, or other invalid fields, map to an empty string
					if(value == "NaN" || value == "null" || value == "undefined") {
						value = "";
					}

					if(value == orgValue){
						return true;
					}
					return false;
				});
				
				// Check date values against their org_ values
				var dateFieldsToCheckAgainstOrg = ["exp_date"];
				var allDateFieldsMatch = d.every(dateFieldsToCheckAgainstOrg, function(id){
					// org date is a hidden field, so will be in MM/DD/YY
					// We need to get a localized string back to do a compare
					var value = dj.byId(id).get("value") + "";
					var orgValue = d.date.locale.parse(dj.byId("org_" + id).get("displayedValue"), {
						selector : "date",
						datePattern : m.getLocalization("g_strGlobalDateFormat")
					}) + "";

					if(value === orgValue){
						return true;
					}
					return false;
				});
				
				// See if a file has been attached
				var hasAttachedFile = (d.query("#edit [id^='file_row_']").length > 1);
				
				// Check textarea and remaining fields
				if(allAdditionalFieldsEmpty && allFieldsMatch && allDateFieldsMatch && !hasAttachedFile && 
						!dj.byId("inc_amt").get("value") &&
						!dj.byId("dec_amt").get("value") &&
						(dj.byId("amd_details").get("value") == "")){
					m._config.onSubmitErrorMsg = m.getLocalization("noAmendmentError");
					return false;
				}
			}
			
			return true;
		}
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.bank.amend_bg_client');