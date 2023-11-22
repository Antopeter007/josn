dojo.provide("misys.binding.trade.freeformat_si");

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

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode
	
	
	d.mixin(m._config, {

		initReAuthParams : function() {
									
			var reAuthParams = {
				productCode : 'SI',	
				subProductCode : '',
				transactionTypeCode : '01',	
				entity :dj.byId("entity") ? dj.byId("entity").get("value") : "",
				currency : dj.byId("lc_cur_code") ? dj.byId("lc_cur_code").get("value") : "",				
				amount : m.trimAmount(dj.byId("lc_amt") ? dj.byId("lc_amt").get("value") : ""),
								
				es_field1 : m.trimAmount(dj.byId("lc_amt") ? dj.byId("lc_amt").get("value") : ""),
				es_field2 : ''				
			};
			return reAuthParams;
		}
	});
		
	// Public functions & variables follow
	d.mixin(m, {

		bind : function() {
			m.setValidation("template_id", m.validateTemplateId);
			m.setValidation("exp_date", m.validateTradeExpiryDate);
			m.setValidation("pstv_tol_pct", m.validateTolerance);
			m.setValidation("neg_tol_pct", m.validateTolerance);
			m.setValidation("max_cr_desc_code", m.validateMaxCreditTerm);
			m.setValidation("lc_cur_code", m.validateCurrency);
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
			m.connect("issuing_bank_customer_reference", "onChange", m.setApplicantReference);
			
			m.connect("adv_send_mode", "onChange",  function(){
				m.toggleMT798Fields("issuing_bank_abbv_name");
			});
			m.connect("issuing_bank_abbv_name", "onChange",  function(){
				m.toggleMT798Fields("issuing_bank_abbv_name");
			});
			
			// Optional EUCP flag 
			m.connect("eucp_flag", "onClick", function(){
				m.toggleFields(
						this.get("checked"), 
						null,
						["eucp_details"]);
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
			m.connect("delv_org", "onChange", function(){
				if(this.get("value") === "99" || this.get("value") === "02")
					{
						if(this.get("value") === "99")
						{
							m.toggleFields((this.get("value") === "99"), null, ["delv_org_text"]);
							m.toggleRequired("delv_org_text", true);
							dj.byId("delv_org_text").set("value", "");
						}
						if(this.get("value") === "02")
						{
							m.toggleFields((this.get("value") === "02"), null, ["delv_org_text"]);
							m.toggleRequired("delv_org_text", true);
							dj.byId("delv_org_text").set("value", "");
						}
					}
				else
					{
						dj.byId("delv_org_text").set("disabled", true);
						dj.byId("delv_org_text").set("value", "");
						m.toggleRequired("delv_org_text", false);
					}
			});
			m.connect("delivery_to", "onChange", function(){
				if(this.get("value") === "" || this.get("value") === "04")
				{
					if(this.get("value") === "")
						{
							dj.byId("narrative_delivery_to").set("disabled", false);
							dj.byId("narrative_delivery_to").set("value", "");
							m.toggleRequired("narrative_delivery_to", false);
							document.getElementById("narrative_delivery_to_img").style.display = "block";
						}
					else
						{
							m.toggleFields((this.get("value") === "04"), null, ["narrative_delivery_to"]);
							m.toggleRequired("narrative_delivery_to", false);
							dj.byId("narrative_delivery_to").set("value", "");
							dj.byId("narrative_delivery_to").set("disabled", true);
							document.getElementById("narrative_delivery_to_img").style.display = "none";	
						}
				}
			else
				{
					dj.byId("narrative_delivery_to").set("disabled", false);
					dj.byId("narrative_delivery_to").set("value", "");
					m.toggleRequired("narrative_delivery_to", true);
					document.getElementById("narrative_delivery_to_img").style.display = "block";
				}
			});
		},

		onFormLoad : function() {
			m.setCurrency(dj.byId("lc_cur_code"), ["lc_amt"]);

			var eucpFlag = dj.byId("eucp_flag");
			if(eucpFlag) {
				m.toggleFields(
						eucpFlag.get("checked"), 
						null,
						["eucp_details"]);
			}

			var issuingBankAbbvName = dj.byId("issuing_bank_abbv_name");
			if(issuingBankAbbvName) {
				issuingBankAbbvName.onChange();
			}
			
			var issuingBankCustRef = dj.byId("issuing_bank_customer_reference");
			if(issuingBankCustRef) {
				issuingBankCustRef.onChange();
			}
			var applRule = dj.byId("applicable_rules");
			if(applRule) {
				m.toggleFields(
						applRule.get("value") == "99",
						null, ["applicable_rules_text"]);
			}
		if(dj.byId("delv_org") && dj.byId("delv_org_text"))
		{
			if(dj.byId("delv_org").value === '99' || dj.byId("delv_org").value === '02')
			{
				dj.byId("delv_org_text").set("disabled", false);
				m.toggleRequired("delv_org_text", true);
			}
			else
			{
				dj.byId("delv_org_text").set("disabled", true);
				m.toggleRequired("delv_org_text", false);
			}
		  }
		if(dj.byId("delivery_to") && dj.byId("narrative_delivery_to"))
			{
				if(dj.byId("delivery_to").get("value") === "04")
					{
							m.toggleFields((dj.byId("delivery_to").get("value") === "04"), null, ["narrative_delivery_to"]);
							m.toggleRequired("narrative_delivery_to", false);
							dj.byId("narrative_delivery_to").set("value", "");
							dj.byId("narrative_delivery_to").set("disabled", true);
							document.getElementById("narrative_delivery_to_img").style.display = "none";
					}
				else
					{
					if(dj.byId("delivery_to").get("value") !== "")
						{
							dj.byId("narrative_delivery_to").set("disabled", false);
							m.toggleRequired("narrative_delivery_to", true);
							document.getElementById("narrative_delivery_to_img").style.display = "block";
						}
					}
			}
		},

		beforeSaveValidations : function(){
			var entity = dj.byId("entity") ;
			if(entity && entity.get("value") == "")
			{
				return false;
			}
			else
			{
				return true;
			}
		},
		
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
       dojo.require('misys.client.binding.trade.freeformat_si_client');