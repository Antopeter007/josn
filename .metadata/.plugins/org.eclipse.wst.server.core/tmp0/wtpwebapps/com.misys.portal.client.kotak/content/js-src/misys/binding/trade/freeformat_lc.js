dojo.provide("misys.binding.trade.freeformat_lc");

dojo.require("misys.form.common");
dojo.require("misys.validation.common");
dojo.require("misys.form.file");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.TextBox");
dojo.require("misys.widget.Dialog");
dojo.require("dijit.ProgressBar");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.CheckBox");
dojo.require("dijit.layout.ContentPane");
dojo.require("dojo.data.ItemFileReadStore");
dojo.require("dijit.form.DateTextBox");
dojo.require("misys.form.CurrencyTextBox");
dojo.require("dijit.form.FilteringSelect");
dojo.require("misys.form.SimpleTextarea");

/**
 * <h4>Summary:</h4>
 *  JavaScript file for Letter Of Credit(Free Format).
 *  <h4>Description:</h4>
 *  This is loaded when the Letter Of Credit(Free Format) is opened.
 *  It contains on form load events, before save validations, before submit validations and widget bindings for various events.
 *  
 * @class freeformat_lc
 */

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode
	
	var altPartyDetails="alternate-party-details";
	d.mixin(m._config, {

		initReAuthParams : function() {
									
			var reAuthParams = {
				productCode : "LC",	
				subProductCode : "",
				transactionTypeCode : "01",	
				entity :dj.byId("entity") ? dj.byId("entity").get("value") : "",
				currency : dj.byId("lc_cur_code") ? dj.byId("lc_cur_code").get("value") : "",				
				amount : m.trimAmount(dj.byId("lc_amt") ? dj.byId("lc_amt").get("value") : ""),
								
				es_field1 : m.trimAmount(dj.byId("lc_amt") ? dj.byId("lc_amt").get("value") : ""),
				es_field2 : ""				
			};
			return reAuthParams;
		}
	});
		
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
			m.setValidation("pstv_tol_pct", m.validateTolerance);
			m.setValidation("neg_tol_pct", m.validateTolerance);
			m.setValidation("max_cr_desc_code", m.validateMaxCreditTerm);
			m.setValidation("lc_cur_code", m.validateCurrency);
			m.setValidation("alt_applicant_country", m.validateCountry);
			
			m.connect("adv_send_mode", "onClick", m.setDraftTerm);
			

			m.connect("lc_cur_code", "onChange", function(){
				m.setCurrency(this, ["lc_amt"]);
			});
			m.connect("lc_amt", "onBlur", function(){
				m.setTnxAmt(this.get("value"));
			});
			
			m.connect("pstv_tol_pct", "onChange", function(){
				if(dj.byId("booking_amt"))
					{
					
					m.validateLimitBookingAmount("true");
					}
				
				});
			m.connect("issuing_bank_abbv_name", "onChange", m.populateReferences);
			m.connect("issuing_bank_abbv_name", "onChange", m.updateBusinessDate);
			if(dj.byId("issuing_bank_abbv_name"))
			{
				m.connect("entity", "onChange", function(){
					dj.byId("issuing_bank_abbv_name").onChange();});
			}
			
			m.connect("adv_send_mode", "onChange",  function(){
				m.toggleMT798Fields("issuing_bank_abbv_name");
			});
			m.connect("issuing_bank_abbv_name", "onChange",  function(){
				m.toggleMT798Fields("issuing_bank_abbv_name");
			});
			m.connect("issuing_bank_customer_reference", "onChange", m.setApplicantReference);
			m.connect("for_account_flag", "onChange", function(){
				if(this.get("checked")) 
				{
					m.animate("fadeIn", d.byId(altPartyDetails));
				}
				else 
				{
					m.animate("fadeOut", d.byId(altPartyDetails));
					dj.byId("alt_applicant_name").set("value","");
					dj.byId("alt_applicant_address_line_1").set("value","");
					dj.byId("alt_applicant_address_line_2").set("value","");
					dj.byId("alt_applicant_dom").set("value","");
					dj.byId("alt_applicant_country").set("value","");

				}
			});
			m.connect("for_account_flag", "onChange", function(){
				m.toggleFields((this.get("value") === "on"), 
						["alt_applicant_address_line_2", "alt_applicant_dom"],
						["alt_applicant_name", "alt_applicant_address_line_1", "alt_applicant_country"]);
			});
			m.connect("applicable_rules", "onChange", function(){
				m.toggleFields((this.get("value") == "99"), null, ["applicable_rules_text"]);
			});
			m.connect("applicant_address_line_4", "onFocus", function(){
				m.showTooltip(m.getLocalization('addressLine4ToolTip', 
						[dj.byId("applicant_address_line_4").get("displayedValue"), dj.byId("applicant_address_line_4").get("value") ]), d.byId("applicant_address_line_4"), [ 'right' ],5000);
			});
			m.connect("beneficiary_address_line_4", "onFocus", function(){
				m.showTooltip(m.getLocalization('addressLine4ToolTip', 
						[dj.byId("beneficiary_address_line_4").get("displayedValue"), dj.byId("beneficiary_address_line_4").get("value") ]), d.byId("beneficiary_address_line_4"), [ 'right' ],5000);
			});
			m.connect("advising_bank_address_line_4", "onFocus", function(){
				m.showTooltip(m.getLocalization('addressLine4ToolTip', 
						[dj.byId("advising_bank_address_line_4").get("displayedValue"), dj.byId("advising_bank_address_line_4").get("value") ]), d.byId("advising_bank_address_line_4"), [ 'right' ],5000);
			});
			m.connect("advise_thru_bank_address_line_4", "onFocus", function(){
				m.showTooltip(m.getLocalization('addressLine4ToolTip', 
						[dj.byId("advise_thru_bank_address_line_4").get("displayedValue"), dj.byId("advise_thru_bank_address_line_4").get("value") ]), d.byId("advise_thru_bank_address_line_4"), [ 'right' ],5000);
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

			var issuingBankAbbvName = dj.byId("issuing_bank_abbv_name");
			if(issuingBankAbbvName) {
				issuingBankAbbvName.onChange();
			}
			
			var issuingBankCustRef = dj.byId("issuing_bank_customer_reference");
			if(issuingBankCustRef) {
				issuingBankCustRef.onChange();
			}
			
			if(dj.byId("for_account_flag"))
			{
				if(dj.byId("for_account_flag").get("checked")) 
				
				{
					m.animate("fadeIn", d.byId(altPartyDetails));
				}
				else 
				{
					m.animate("fadeOut", d.byId(altPartyDetails));
					dj.byId("alt_applicant_name").set("value","");
					dj.byId("alt_applicant_address_line_1").set("value","");
					dj.byId("alt_applicant_address_line_2").set("value","");
					dj.byId("alt_applicant_dom").set("value","");
					dj.byId("alt_applicant_country").set("value","");
				}
			}
			
			var forAccount = dj.byId("for_account_flag");
			if(forAccount) {
				m.toggleFields(
						forAccount.get("value") === "on", 
						["alt_applicant_address_line_2", "alt_applicant_dom"],
						["alt_applicant_name", "alt_applicant_address_line_1", "alt_applicant_country"]);
			}
			var srRule = dj.byId("applicable_rules");
			if(srRule) {
				m.toggleFields(
						srRule.get("value") == "99",
						null, ["applicable_rules_text"]);
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
			if(dj.byId("issuing_bank_abbv_name") && !m.validateApplDate(dj.byId("issuing_bank_abbv_name").get("value")))
			{
				m._config.onSubmitErrorMsg = m.getLocalization('changeInApplicationDates');
				m.goToTop();
				return false;
      		}
			return true; 
		}
		
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require("misys.client.binding.trade.freeformat_lc_client");