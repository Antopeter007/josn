dojo.provide("misys.binding.bank.report_freeformat_lc");

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
 *  JavaScript file for Letter Of Credit(Free Format).
 *  <h4>Description:</h4>
 *  This is loaded when the Letter Of Credit(Free Format) is opened.
 *  It contains on form load events, before save validations, before submit validations and widget bindings for various events.
 *  
 * @class report_freeformat_lc
 */

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode
		
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
				if (m._config.enable_to_edit_customer_details_bank_side == "false" && dj.byId("prod_stat_code")	&& dj.byId("prod_stat_code").get('value') !== '')
				{
					if (dj.byId("lc_liab_amt") && dj.byId("tnx_type_code") && dj.byId("tnx_type_code").get("value") !== '15' && dj.byId("tnx_type_code").get("value") !== '13')
					{
						m.toggleRequired("lc_liab_amt", false);
					}
				}
			});
			m.connect("maturity_date", "onBlur", function(){
				m.validateEnteredGreaterThanCurrentDate();
			});
			
			m.connect("applicable_rules", "onChange", function(){
				m.toggleFields((this.get("value") == "99"), null, ["applicable_rules_text"]);
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
			m.setCurrency(dj.byId("lc_cur_code"), ["lc_amt"]);

			var applRule = dj.byId("applicable_rules");
			if(applRule) 
			{
				m.toggleFields(	applRule.get("value") == "99",null, ["applicable_rules_text"]);
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

										
			if (dj.byId("tnx_type_code") && (dj.byId("tnx_type_code").get("value") === '15' || (dj.byId("tnx_type_code").get("value") === '13')) && (m._config.enable_to_edit_customer_details_bank_side == "false"))
			{
				dojo.style('transactionDetails', "display", "none");
			} else
			{
				if (m._config.enable_to_edit_customer_details_bank_side == "false")
				{
					dojo.style('transactionDetails', "display", "none");

					var transactionids = [ "exp_date", "expiry_place", "entity",
							"applicant_name", "applicant_address_line_1",
							"applicant_address_line_2", "applicant_dom",
							"applicant_country", "applicant_reference",
							"applicant_contact_number", "applicant_email",
							"issuing_bank_reference", "beneficiary_name",
							"beneficiary_address_line_1", "beneficiary_address_line_2",
							"beneficiary_dom", "beneficiary_country",
							"beneficiary_reference", "beneficiary_contact_number",
							"beneficiary_email", "issuing_bank_type_code",
							"issuing_bank_name", "issuing_bank_address_line_1",
							"issuing_bank_address_line_2", "advising_bank_name",
							"advising_bank_address_line_1",
							"advising_bank_address_line_2", "advising_bank_dom",
							"advising_bank_iso_code", "advise_thru_bank_iso_code",
							"advise_thru_bank_reference", "advising_bank_reference",
							"advise_thru_bank_name", "advise_thru_bank_address_line_1",
							"advise_thru_bank_address_line_2", "advise_thru_bank_dom",
							"narrative_full_details", "lc_amt", "pstv_tol_pct",
							"neg_tol_pct", "max_cr_desc_code", "lc_liab_amt",
							"lc_cur_code" ];
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
		 * Any before save validation can be added in this method for Letter Of Credit Free format. 
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
       dojo.require("misys.client.binding.bank.report_freeformat_lc_client");