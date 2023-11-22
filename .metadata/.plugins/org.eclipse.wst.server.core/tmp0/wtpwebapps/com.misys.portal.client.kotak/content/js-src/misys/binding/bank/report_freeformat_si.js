dojo.provide("misys.binding.bank.report_freeformat_si");

dojo.require("dojo.data.ItemFileReadStore");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.TextBox");
dojo.require("misys.widget.Dialog");
dojo.require("dijit.ProgressBar");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.CheckBox");
dojo.require("dijit.layout.ContentPane");
dojo.require("dijit.form.DateTextBox");
dojo.require("misys.form.CurrencyTextBox");
dojo.require("dijit.form.FilteringSelect");
dojo.require("dijit.layout.TabContainer");
dojo.require("misys.form.SimpleTextarea");
dojo.require("misys.widget.Collaboration");

dojo.require("misys.form.addons");
dojo.require("misys.form.common");
dojo.require("misys.form.file");
dojo.require("misys.validation.common");

/**
 * <h4>Summary:</h4>
 *  JavaScript file for Issued Standby Letter Of Credit(Free Format) Bank side reporting.
 *  <h4>Description:</h4>
 *  This is loaded when the Issued Standby Letter Of Credit(Free Format) is opened.
 *  It contains on form load events, before save validations, before submit validations and widget bindings for various events.
 *  
 * @class report_freeformat_si
 */

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode
	var text, value;
	/**
	 * <h4>Summary:</h4>  This method validates the claim amount.
	 * <h4>Description</h4> : This method validates the claim amount with SI outstanding amount.
	 * Validation - The claim amount should be less than the SI outstanding amount and greater than 0.
	 *
	 * @method _validateClaimAmt
	 */
	function _validateClaimAmt(){
		var lcOsAmt = dj.byId("lc_liab_amt");
		var lcAmt = dj.byId("lc_amt");
		var claimAmt = dj.byId("claim_amt");
		if(lcAmt && claimAmt)
		{
			if(claimAmt.get("value") <= 0 || claimAmt.get("value") > lcOsAmt.get("value") || claimAmt.get("value") > lcAmt.get("value"))
			{
				var callback = function() {
					var widget = dijit.byId("claim_amt");
				 	widget.focus();
				 	widget.set("state","Error");
				};
				m.dialog.show("ERROR", m.getLocalization("claimAmtGreaterThanOutstandingAmtError", [lcOsAmt.get("value").toFixed(2)]), "", function(){
					setTimeout(callback, 500);
				});
				return false;
			}
		}
		return true;
		
	}

	/**
	 * <h4>Summary:</h4>  This method validates the claim date.
	 * <h4>Description</h4> : This method validates the claim date with current date, expiry date and issue date.
	 * Validation -
	 * <ul> 
	 * <li>The claim date should be before current date.</li>
	 * <li>The claim date should be before expiry date.</li>
	 * <li>The claim date should be after issue date.</li>
	 * </ul>
	 * 
	 * @method _validateClaimAmt
	 */
	function _validateClaimDate(){
		var currentDate = dj.byId("current_date");
		var expDate = dj.byId("exp_date");
		var issDate = dj.byId("iss_date");
		var claimDate = dj.byId("claim_present_date");
		if(claimDate)
		{
			if(currentDate && !m.compareDateFields(claimDate, currentDate)) 
     		{
				var callback1 = function() {
					var widget = dijit.byId("claim_present_date");
				 	widget.focus();
				 	widget.set("state","Error");
				};
				m.dialog.show("ERROR", m.getLocalization("claimDateGreaterThanCurrentDateError",[ claimDate.get("displayedValue"), currentDate.get("displayedValue") ]), "", function(){
					setTimeout(callback1, 500);
				});
				return false;
     		}
			else if(expDate && !m.compareDateFields(claimDate, expDate)) 
	    	 {
				 var callback2 = function() {
						return true;
					};
				m.dialog.show("WARNING", m.getLocalization("claimDateGreaterThanExpiryDateError",[ claimDate.get("displayedValue"), expDate.get("displayedValue") ]), "", function(){
					setTimeout(callback2, 500);
				});
	    	 }
			 else if(issDate && !m.compareDateFields(issDate, claimDate)) 
	    	 {
				 var callback3 = function() {
					 return true;
					};
				m.dialog.show("WARNING", m.getLocalization("claimDateLessThanIssueDateError",[ claimDate.get("displayedValue"), issDate.get("displayedValue") ]), "", function(){
					setTimeout(callback3, 500);
				});
	    	 }
		}
		return true;
		
	}
		
	// Public functions & variables follow
	d.mixin(m, {
		/**
		 * <h4>Summary:</h4>  This method sets widget validations on various events.
		 * <h4>Description</h4> : This method binds the widgets with the various events (Example- onBlur, onChange, onFocus etc.).
		 * Whenever the event is triggered on a widget it calls the defined function on that event.
		 * It also sets client side validations for the widgets(Example- validating dates, currency etc.). 
		 *
		 * @method bind
		 */
		bind : function() {
			m.setValidation("template_id", m.validateTemplateId);
			m.setValidation("exp_date", m.validateTradeExpiryDate);
			m.setValidation("lc_cur_code", m.validateCurrency);

			m.connect("lc_cur_code", "onChange", function(){
				m.setCurrency(this, ["lc_amt"]);
				if(dj.byId("lc_outstanding_amt")){
					m.setCurrency("lc_cur_code", ["lc_outstanding_amt"]);
				}
			});
			m.connect("lc_amt", "onBlur", function(){
				m.setTnxAmt(this.get("value"));
			});
			m.connect("issuing_bank_abbv_name", "onChange", m.populateReferences);
			if(dj.byId("issuing_bank_abbv_name"))
			{
				m.connect("entity", "onChange", function(){
					dj.byId("issuing_bank_abbv_name").onChange();});
			}
			m.connect("issuing_bank_customer_reference", "onChange", m.setApplicantReference);
			//Claim Validations
			m.setValidation("claim_cur_code", m.validateCurrency);
			m.setValidation("claim_reference",m.validateSwiftAddressCharacters);
			m.connect("claim_amt", "onBlur", _validateClaimAmt);
			m.connect("claim_reference", "onBlur", m.checkClaimReferenceExists);
			m.connect("claim_present_date", "onBlur", _validateClaimDate);
			m.connect("prod_stat_code", "onChange", function(){
				if(this.get("value") === "84")
				{
					m.animate("fadeIn", d.byId("claimDetails"));
					m.animate("fadeOut", d.byId("doc-details"));
					dj.byId("claim_cur_code").set("value", dj.byId("lc_cur_code").get("value"));
					dj.byId("claim_reference").set("disabled", false);
					dj.byId("claim_present_date").set("disabled", false);
					dj.byId("claim_amt").set("disabled", false);
					dj.byId("claim_cur_code").set("disabled", false);
					dj.byId("action_req_code").store.root.options.remove(4);
					m.setCurrency(dj.byId("claim_cur_code"), ["claim_amt"]);
				}
				else if(dj.byId("claim_reference") && dj.byId("claim_present_date") && dj.byId("claim_amt") && dj.byId("claim_cur_code"))
				{
					m.animate("fadeOut", d.byId("claimDetails"));
					m.animate("fadeIn", d.byId("doc-details"));
					dj.byId("claim_reference").set("disabled", true);
					dj.byId("claim_present_date").set("disabled", true);
					dj.byId("claim_amt").set("disabled", true);
					dj.byId("claim_cur_code").set("disabled", true);
					dj.byId("claim_reference").set("value", "");
					dj.byId("claim_present_date").set("value", null);
					dj.byId("claim_amt").set("value", "");
					dj.byId("claim_cur_code").set("value", "");
					if((!dj.byId("action_req_code").store.root.options[4]) ||(dj.byId("action_req_code").store.root.options[4] && dj.byId("action_req_code").store.root.options[4].value !== value))
					{
						dj.byId("action_req_code").store.root.options.add(new Option(text,value,false,false));
					}
				}
			});
			m.connect("prod_stat_code", "onChange", m.validateOutstandingAmount);
			m.connect(dj.byId("prod_stat_code"), "onChange", function(){this.validate();});
			m.connect("prod_stat_code", "onChange", m.toggleProdStatCodeFields);
			m.connect("prod_stat_code", "onChange", function(){
				var value = this.get("value");
				m.toggleFields(
					value && value !== "01" && value !== "18", 
					["action_req_code"],
					["iss_date", "bo_ref_id"]);
			});
			m.connect("prod_stat_code", "onChange", function(){
				m.updateOutstandingAmount(dj.byId("lc_liab_amt"), dj.byId("org_lc_liab_amt"));
			});
			// Making outstanding amount as non editable in case of Not Processed,Cancelled,Purged
			m.connect("prod_stat_code","onChange",function(){
				var prodStatCodeValue = dj.byId("prod_stat_code").get("value"),
					liabAmt = dj.byId("lc_liab_amt");
				if(liabAmt && (prodStatCodeValue === "01" || prodStatCodeValue === "10" || prodStatCodeValue === "06"))
					{
						liabAmt.set("readOnly", true);
						liabAmt.set("disabled", true);
					}
				else if(liabAmt)
					{
						liabAmt.set("readOnly", false);
						liabAmt.set("disabled", false);
					}
			});
			
			m.connect("applicable_rules", "onChange", function(){
				m.toggleFields((this.get("value") == "99"), null, ["applicable_rules_text"]);
			});
			m.connect("maturity_date", "onBlur", function(){
				m.validateEnteredGreaterThanCurrentDate();
			});
			m.connect("lc_exp_date_type_code", "onChange", function(){
				m.toggleFields((this.get("value") === "01" || this.get("value") === "02"), null, ["exp_date"]);
				if(this.get("value") === "02")
					{
						m.toggleRequired("exp_date", false);
					}
			});
		},
		
		/**
		 * <h4>Summary:</h4>  This method sets the changes on the page on loading.
		 * <h4>Description</h4> : This method is called on form load.
		 * If user wants any changes in the property of a widget on form load, that change can be added in this method. 
		 *
		 * @method onFormLoad
		 */
		onFormLoad : function() {
			if(dijit.byId("action_req_code"))
			{
				text = dijit.byId("action_req_code").store.root.options[4].text;
				value = dijit.byId("action_req_code").store.root.options[4].value;
			}
			
			m.setCurrency(dj.byId("lc_cur_code"), ["lc_amt"]);
			if(dj.byId("lc_outstanding_amt")){
				m.setCurrency("lc_cur_code", ["lc_outstanding_amt"]);
			}

			var issuingBankAbbvName = dj.byId("issuing_bank_abbv_name");
			if(issuingBankAbbvName) {
				issuingBankAbbvName.onChange();
			}
			
			var issuingBankCustRef = dj.byId("issuing_bank_customer_reference");
			if(issuingBankCustRef) {
				issuingBankCustRef.onChange();
			}
			var prodStatCode = dj.byId("prod_stat_code"),
			liabAmt = dj.byId("lc_liab_amt") ;
			if(prodStatCode && prodStatCode.get("value") === "01")
			{
				m.toggleFields(	false, 
							["action_req_code"],
						["iss_date", "bo_ref_id"]);
			}
			if(liabAmt && prodStatCode && (prodStatCode.get("value") === "01" || prodStatCode.get("value") === "10" || prodStatCode.get("value") === "06"))
				{
					liabAmt.set("readOnly", true);
					liabAmt.set("disabled", true);
				}
			else if(liabAmt)
				{
					liabAmt.set("readOnly", false);
					liabAmt.set("disabled", false);
				}
			if(dj.byId("doc_ref_no") && prodStatCode && (prodStatCode.get("value")=== "16" || prodStatCode.get("value") === "24"))
				{
					dj.byId("doc_ref_no").set("disabled", false);
				}
			else if(dj.byId("doc_ref_no"))
				{
					dj.byId("doc_ref_no").set("disabled", true);
				}
			
			var applRule = dj.byId("applicable_rules");
			if(applRule) {
				m.toggleFields(
						applRule.get("value") == "99",
						null, ["applicable_rules_text"]);
			}
			
			if(dj.byId("claim_cur_code") && dj.byId("claim_amt"))
			{
				m.setCurrency(dj.byId("claim_cur_code"), ["claim_amt"]);
			}
			if(dj.byId("claim_reference") && dj.byId("claim_present_date") && dj.byId("claim_amt") && dj.byId("claim_cur_code"))
			{
				if(dj.byId("prod_stat_code") && dj.byId("prod_stat_code").get("value") === "84")
				{
					m.animate("fadeOut", d.byId("doc-details"));
					m.animate("fadeIn", d.byId("claimDetails"));
					dj.byId("claim_reference").set("required", true);
					dj.byId("claim_present_date").set("required", true);
					dj.byId("claim_amt").set("required", true);
					dj.byId("claim_cur_code").set("value", dj.byId("lc_cur_code").get("value"));
				}
				else
				{
					m.animate("fadeOut", d.byId("claimDetails"));
					m.animate("fadeIn", d.byId("doc-details"));
					dj.byId("claim_reference").set("disabled", true);
					dj.byId("claim_present_date").set("disabled", true);
					dj.byId("claim_amt").set("disabled", true);
					dj.byId("claim_cur_code").set("disabled", true);
					dj.byId("claim_reference").set("value", "");
					dj.byId("claim_present_date").set("value", null);
					dj.byId("claim_amt").set("value", "");
					dj.byId("claim_cur_code").set("value", "");
				}
			}
			if (dj.byId("tnx_type_code") && (dj.byId("tnx_type_code").get("value") === '15' || (dj.byId("tnx_type_code").get("value") === '13')) && (m._config.enable_to_edit_customer_details_bank_side == "false"))
			{
				dojo.style('transactionDetails', "display", "none");
			} else
			{
				if (m._config.enable_to_edit_customer_details_bank_side == "false")
				{
					dojo.style('transactionDetails', "display", "none");

					var transactionids = [ "standby_rule_other", "standby_rule_code",
							"product_type_code", "cfm_chrg_brn_by_code_2",
							"cfm_chrg_brn_by_code_1", "open_chrg_brn_by_code_1",
							"open_chrg_brn_by_code_2", "corr_chrg_brn_by_code_1",
							"corr_chrg_brn_by_code_2", "max_cr_desc_code",
							"neg_tol_pct", "pstv_tol_pct", "lc_liab_amt", "lc_amt",
							"lc_cur_code", "cfm_inst_code_3", "cfm_inst_code_2",
							"cfm_inst_code_1", "stnd_by_lc_flag", "ntrf_flag",
							"irv_flag", "expiry_place", "exp_date",
							"iss_date_type_code", "exp_date_type_code", "entity",
							"applicant_name", "applicant_address_line_1",
							"applicant_address_line_2", "applicant_dom",
							"applicant_country", "applicant_reference",
							"applicant_contact_number", "applicant_email",
							"alt_applicant_name", "issuing_bank_reference",
							"beneficiary_name", "beneficiary_address_line_1",
							"beneficiary_address_line_2", "beneficiary_dom",
							"beneficiary_country", "beneficiary_reference",
							"beneficiary_contact_number", "beneficiary_email",
							"issuing_bank_type_code", "issuing_bank_name",
							"issuing_bank_address_line_1",
							"issuing_bank_address_line_2", "advising_bank_name",
							"advising_bank_address_line_1",
							"advising_bank_address_line_2", "advising_bank_dom",
							"advising_bank_iso_code", "advise_thru_bank_iso_code",
							"advise_thru_bank_reference", "advising_bank_reference",
							"advise_thru_bank_name", "advise_thru_bank_address_line_1",
							"advise_thru_bank_address_line_2", "advise_thru_bank_dom",
							"narrative_full_details" ];
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
		
		/**
		 * <h4>Summary:</h4>  Before save validation method.
		 * <h4>Description</h4> : This method is called before saving a transaction.
		 * Any before save validation can be added in this method for Issued Standby Letter Of Credit Free format. 
		 *
		 * @method beforeSaveValidations
		 */
		beforeSaveValidations : function(){
			var entity = dj.byId("entity") ;
			if(entity && entity.get("value") === "")
			{
				return false;
			}
			else
			{
				return true;
			}
			
		},
		
		/**
		 * <h4>Summary:</h4>  Before submit validation method.
		 * <h4>Description</h4> : This method is called before submitting a transaction.
		 * Any before submit validation can be added in this method for Letter Of Credit Free format. 
		 *
		 * @method beforeSubmitValidations
		 */
		beforeSubmitValidations: function() {

			var currentDate = dj.byId("current_date");
			var claimDate = dj.byId("claim_present_date");
			if(claimDate && currentDate && !m.compareDateFields(claimDate, currentDate)) 
    		{
				var callback = function() {
					var widget = dijit.byId("claim_present_date");
				 	widget.focus();
				 	widget.set("state","Error");
				};
				m.dialog.show("ERROR", m.getLocalization("claimDateGreaterThanCurrentDateError",[ claimDate.get("displayedValue"), currentDate.get("displayedValue") ]), "", function(){
					setTimeout(callback, 500);
				});
				return false;
    		}
			//validate transfer amount should be greater than zero
			if(dj.byId("lc_amt"))
			{
				if(!m.validateAmount((dj.byId("lc_amt"))?dj.byId("lc_amt"):0))
				{
					m._config.onSubmitErrorMsg =  m.getLocalization("amountcannotzero");
					dj.byId("lc_amt").set("value", "");
					return false;
				}
			}  
			return true; 
		}
		
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require("misys.client.binding.bank.report_freeformat_si_client");