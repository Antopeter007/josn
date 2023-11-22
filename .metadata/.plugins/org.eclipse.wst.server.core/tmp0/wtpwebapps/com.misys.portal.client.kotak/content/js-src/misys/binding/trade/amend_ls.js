dojo.provide("misys.binding.trade.amend_ls");

dojo.require("dijit.form.DateTextBox");
dojo.require("misys.form.CurrencyTextBox");
dojo.require("dijit.form.NumberTextBox");
dojo.require("dijit.form.FilteringSelect");
dojo.require("misys.form.file");
dojo.require("misys.form.SimpleTextarea");
dojo.require("misys.form.common");
dojo.require("misys.validation.common");
dojo.require("misys.binding.trade.ls_common");
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
    // dojo.subscribe once a record is deleted from the grid
    var _deleteGridRecord = "deletegridrecord";
		
	d.mixin(m._config, {

		initReAuthParams : function() {
									
			var reAuthParams = {
				productCode : "LS",	
				subProductCode : "",
				transactionTypeCode : "03",	
				entity :dj.byId("entity") ? dj.byId("entity").get("value") : "",
				currency : dj.byId("ls_cur_code") ? dj.byId("ls_cur_code").get("value") : "",				
				amount : dj.byId("ls_amt") ? m.trimAmount(dj.byId("ls_amt").get("value")) : "",
								
				es_field1 : dj.byId("ls_amt") ? m.trimAmount(dj.byId("ls_amt").get("value")) : "",
				es_field2 : ""				
			};
			return reAuthParams;
		}
	});
	
	// Public functions & variables follow
	d.mixin(m, {

		bind : function() {
			m.setValidation("amd_date", m.validateAmendmentDate);
			m.connect("inc_amt", "onBlur", function(){
				m.validateIncAmount(this, "ls");
			}); 
			m.connect("dec_amt", "onBlur", function(){
				m.validateDecAmount(this, "ls");
			});
			m.connect("additional_inc_amt", "onBlur", function(){
				m.validateIncAmount(this, "additional");
			}); 
			m.connect("additional_dec_amt", "onBlur", function(){
				m.validateDecAmount(this, "additional");
			});
			m.setValidation("origin_country", m.validateCountry);
			m.setValidation("supply_country", m.validateCountry);
			m.setValidation("pstv_tol_pct", m.validateTolerance);
			m.setValidation("neg_tol_pct", m.validateTolerance);
			m.connect("inc_amt", "onBlur", m.amendLicenseTransaction);
			m.connect("dec_amt", "onBlur", m.amendLicenseTransaction);
			m.connect("additional_inc_amt", "onBlur", m.amendLicenseTransaction);
			m.connect("additional_dec_amt", "onBlur", m.amendLicenseTransaction);
			m.connect("additional_inc_amt", "onBlur", m.handleAdditionalAmountDetails);
			m.connect("additional_dec_amt", "onBlur", m.handleAdditionalAmountDetails);
			m.connect("inco_term", "onChange", function(){
				m.toggleFields(this.get("value"), null, ["inco_place"], false, false);
			});
			m.connect("inco_term_year", "onChange", function(){
				m.toggleFields(this.get("value"), null, ["inco_term"], false, true);
			});
			m.connect("inco_term_year", "onChange",m.getIncoTerm);
			m.setValidation("valid_from_date", m.validateValidFromDate);
			m.setValidation("valid_to_date", m.validateValidToDate);
			m.setValidation("latest_payment_date", m.validateLatestPaymentDate);
			m.connect("valid_from_date", "onChange", m.setValidToDate);
			m.connect("valid_for_nb", "onBlur", m.setValidToDate);
			m.connect("valid_for_nb", "onBlur",function(){
				if(dj.byId("valid_for_period") && (this.get("value") !== "" && !isNaN(this.get("value"))))
				{
					dj.byId("valid_for_period").set("disabled", false);
					dj.byId("valid_for_period").set("required", true);
				}
				else
				{
					dj.byId("valid_for_period").set("disabled", true);
					dj.byId("valid_for_period").set("required", false);
					dj.byId("valid_for_period").set("value", "");
				}
			});
			m.connect("valid_for_period", "onChange", m.setValidToDate);
		},
		
		onFormLoad : function() {
			m.setCurrency(dj.byId("ls_cur_code"),
					["inc_amt", "dec_amt", "org_ls_amt", "ls_amt", "additional_inc_amt", "additional_dec_amt", "additional_amt", "org_additional_amt", "org_total_amt", "total_amt"]);
			
			var incoTerm = dj.byId("inco_term") ? dj.byId("inco_term").get("value") : "";
			if(incoTerm) {
				m.toggleFields(incoTerm, null, ["inco_place"], false, true);
			}
			else{
				m.toggleFields(incoTerm, null, ["inco_place"], false, false);
			}
			
			if(d.byId("org_narrative_additional_amount_img"))
			{
				d.byId("org_narrative_additional_amount_img").style.display = "none";
				dj.byId("org_narrative_additional_amount_img").set("disabled", true);
			}
			
			m.handleAdditionalAmountDetails();
			var addIncAmtNotEntered = dj.byId("additional_inc_amt") && isNaN(dj.byId("additional_inc_amt").get("value"));
			var addDecAmtNotEntered = dj.byId("additional_dec_amt") && isNaN(dj.byId("additional_dec_amt").get("value"));
			if(dj.byId("additional_amt") && dj.byId("org_additional_amt") && addIncAmtNotEntered && addDecAmtNotEntered)
			{
				dj.byId("additional_amt").set("value", dj.byId("org_additional_amt").get("value"));
			}
			
			//Initialization of original total ls_amt and new total ls_amt
			if(dj.byId("org_ls_amt") && dj.byId("org_ls_amt").get("value") !== "" && !isNaN(dj.byId("org_ls_amt").get("value")))
			{
				dj.byId("org_total_amt").set("value", dj.byId("org_ls_amt").get("value"));
			}
			if(dj.byId("ls_amt") && dj.byId("ls_amt").get("value") !== "" && !isNaN(dj.byId("ls_amt").get("value")))
			{
				dj.byId("total_amt").set("value", dj.byId("ls_amt").get("value"));
			}
			
			if(dj.byId("valid_for_nb") && dj.byId("valid_for_period") && dj.byId("valid_for_nb").get("value") !== "" && !isNaN(dj.byId("valid_for_nb").get("value")))
			{
				dj.byId("valid_for_period").set("disabled", false);
				dj.byId("valid_for_period").set("required", true);
				if(dj.byId("valid_for_period").get("value") !== "" && dj.byId("valid_to_date"))
				{
					dj.byId("valid_to_date").set("disabled", true);
				}
			}
			else
			{
				dj.byId("valid_for_period").set("disabled", true);
				dj.byId("valid_for_period").set("required", false);
			}
			if(dj.byId("inc_amt") && !isNaN(dj.byId("inc_amt").get("value")))
			{
				dj.byId("dec_amt").set("disabled", true);
			}
			else if(dj.byId("dec_amt") && !isNaN(dj.byId("dec_amt").get("value")))
			{
				dj.byId("inc_amt").set("disabled", true);
			}
			
			if(dj.byId("additional_inc_amt") && !isNaN(dj.byId("additional_inc_amt").get("value")))
			{
				dj.byId("additional_dec_amt").set("disabled", true);
			}
			else if(dj.byId("additional_dec_amt") && !isNaN(dj.byId("additional_dec_amt").get("value")))
			{
				dj.byId("additional_inc_amt").set("disabled", true);
			}
			if(dj.byId("inco_term_year"))
			{
				m.getIncoYear();
				dijit.byId("inco_term_year").set("value",dj.byId("org_term_year").get("value"));
			}
			if(dj.byId("inco_term"))
			{
				if(dj.byId("inco_term_year") && dj.byId("inco_term_year").get("value")!="")
				{
					m.getIncoTerm();
				}
				dijit.byId("inco_term").set("value",dj.byId("org_inco_term").get("value"));	
			}
		
		},
		
		beforeSaveValidations : function() {
			var incAmt = dj.byId("inc_amt"),
			decAmt = dj.byId("dec_amt"),
			additionalIncAmt = dj.byId("additional_inc_amt"),
			additionalDecAmt = dj.byId("additional_dec_amt");
			if(incAmt && decAmt && additionalIncAmt && additionalDecAmt)
			{
				var amendAmt = isNaN(incAmt.get("value")) ? -(d.number.parse(decAmt.get("value"))) : d.number.parse(incAmt.get("value")),
				amendAdditionalAmt = isNaN(additionalIncAmt.get("value")) ? -(d.number.parse(additionalDecAmt.get("value"))) : d.number.parse(additionalIncAmt.get("value"));
				amendAmt = !isNaN(amendAmt) ? amendAmt : 0;
				amendAdditionalAmt = !isNaN(amendAdditionalAmt) ? amendAdditionalAmt : 0;
				var tnxAmt = amendAmt + amendAdditionalAmt;
				tnxAmt = tnxAmt >=0 ? tnxAmt : -tnxAmt;
				m.setTnxAmt(tnxAmt);
			}
			return true;
		},

		beforeSubmitValidations : function() {
			//Set Tnx Amount
			var incAmt = dj.byId("inc_amt"),
			decAmt = dj.byId("dec_amt"),
			additionalIncAmt = dj.byId("additional_inc_amt"),
			additionalDecAmt = dj.byId("additional_dec_amt");
			if(incAmt && decAmt && additionalIncAmt && additionalDecAmt)
			{
				var amendAmt = isNaN(incAmt.get("value")) ? -(d.number.parse(decAmt.get("value"))) : d.number.parse(incAmt.get("value")),
				amendAdditionalAmt = isNaN(additionalIncAmt.get("value")) ? -(d.number.parse(additionalDecAmt.get("value"))) : d.number.parse(additionalIncAmt.get("value"));
				amendAmt = !isNaN(amendAmt) ? amendAmt : 0;
				amendAdditionalAmt = !isNaN(amendAdditionalAmt) ? amendAdditionalAmt : 0;
				var tnxAmt = amendAmt + amendAdditionalAmt;
				tnxAmt = tnxAmt >=0 ? tnxAmt : -tnxAmt;
				m.setTnxAmt(tnxAmt);
			}
			
			// We check that at least one of the field describing the amendment
			var fieldsToCheck = ["narrative_additional_amount", "org_narrative_additional_amount", "origin_country",
					"org_origin_country", "supply_country", "org_supply_country", "inco_term",
					"org_inco_term", "inco_place", "org_inco_place", "org_valid_from_date", 
					"org_valid_for_nb", "valid_from_date", "valid_for_nb", "valid_for_period",
					"org_valid_for_period", "valid_to_date", "org_valid_to_date",
					"latest_payment_date", "org_latest_payment_date", "additional_dec_amt",
					"additional_inc_amt", "inc_amt", "dec_amt", "amd_details", "file"];

			// Check that all fields are present.
			var allFieldsPresent = d.every(fieldsToCheck, function(id){
				if(d.byId(id)){
					return true;
				}
				return false;
			});

			if(allFieldsPresent){
				// Strip CRLF from textarea values.
				var strAddAmtDetails = 
					m.trim(dj.byId("narrative_additional_amount").get("value"));
				var strOrgAddAmtDetails = 
					m.trim(dj.byId("org_narrative_additional_amount").get("value"));
				
				// Check non-date values against their org_ values
				var fieldsToCheckAgainstOrg = [
						"origin_country", "supply_country", "inco_term",
						"inco_place", "valid_for_nb", "valid_for_period"];
				var allFieldsMatch = d.every(fieldsToCheckAgainstOrg, function(id){
					var value = dj.byId(id).get("value") + "";
					var orgValue = dj.byId("org_" + id).get("value") + "";
					
					// For number fields, or other invalid fields, map to an empty string
					if(value === "NaN" || value === "null" || value === "undefined") {
						value = "";
					}

					if(value === orgValue){
						return true;
					}
					return false;
				});

				// Check date values against their org_ values
				var dateFieldsToCheckAgainstOrg = ["valid_from_date", "valid_to_date", "latest_payment_date"];
				var allDateFieldsMatch = d.every(dateFieldsToCheckAgainstOrg, function(id){
					// org date is a hidden field, so will be in MM/DD/YY
					// We need to get a localized string back to do a compare
					var value = dj.byId(id).get("value") + "";
					var orgValue = d.date.locale.parse(dj.byId("org_" + id).get("displayedValue"), {
						selector : "date",
						datePattern : m.getLocalization("g_strGlobalDateFormat")
					}) + "";

					if(value === "null" || value === orgValue){
						return true;
					}
					return false;
				});

				// See if a file has been attached
				var hasAttachedFile = (d.query("#edit [id^='file_row_']").length > 1);
				
				// Check textarea and remaining fields
				if(allFieldsMatch && allDateFieldsMatch && !hasAttachedFile && 
						(strAddAmtDetails === strOrgAddAmtDetails) &&
						!dj.byId("inc_amt").get("value") &&
						!dj.byId("dec_amt").get("value") &&
						!dj.byId("additional_inc_amt").get("value") &&
						!dj.byId("additional_dec_amt").get("value") &&
						(dj.byId("amd_details").get("value") === "")){
					m._config.onSubmitErrorMsg = m.getLocalization("noAmendmentError");
					return false;
				}
			}
			
			//Check the decreased amount again the outstanding amount.
			if(dj.byId("ls_liab_amt") && dj.byId("sub_tnx_type_code") && dj.byId("tnx_amt"))
			{
				var liabAmtVal = d.number.parse(dj.byId("ls_liab_amt").get("value")),
				tnxAmtVal = d.number.parse(dj.byId("tnx_amt").get("value"));
				liabAmtVal = !isNaN(liabAmtVal) ? liabAmtVal : 0;
				tnxAmtVal = !isNaN(tnxAmtVal) ? tnxAmtVal : 0;
				
				if(dj.byId("sub_tnx_type_code").get("value") === "02" && tnxAmtVal > liabAmtVal)
				{
					m._config.onSubmitErrorMsg = m.getLocalization("cannotDecreaseMoreThanLiabilityAmount", [dj.byId("ls_liab_amt").get("value")]);
					console.debug("Total Amount Cannot be decreased more than the Outstanding Amount.");
					return false;
				}
			}
			
			return true;
		},
		
		beforeSubmit : function() {
			var totalAmt = dj.byId("total_amt"),
			orgTotalamt = dj.byId("org_total_amt"),
			subTnxTypeCodeField = dj.byId("sub_tnx_type_code"),
			subTnxTypeCode = "03"; // default value
	
			if(totalAmt && orgTotalamt)
			{
				var totalAmtVal = d.number.parse(totalAmt.get("value")),
				orgTotalAmtVal = d.number.parse(orgTotalamt.get("value"));
				totalAmtVal = !isNaN(totalAmtVal) ? totalAmtVal : 0;
				orgTotalAmtVal = !isNaN(orgTotalAmtVal) ? orgTotalAmtVal : 0;
				if(totalAmtVal > orgTotalAmtVal)
				{
					subTnxTypeCode = "01";
				}
				else if(totalAmtVal < orgTotalAmtVal)
				{
					subTnxTypeCode = "02";
				}
			}
			
			if(subTnxTypeCodeField) {
				subTnxTypeCodeField.set("value", subTnxTypeCode);
			}
		}
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.trade.amend_ls_client');