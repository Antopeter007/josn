dojo.provide("misys.binding.bank.report_ls");

dojo.require("dijit.layout.TabContainer");
dojo.require("dijit.form.DateTextBox");
dojo.require("misys.form.CurrencyTextBox");
dojo.require("dijit.form.NumberTextBox");
dojo.require("dijit.form.FilteringSelect");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.TextBox");
dojo.require("misys.widget.Dialog");
dojo.require("dijit.ProgressBar");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.CheckBox");
dojo.require("misys.form.SimpleTextarea");
dojo.require("misys.widget.Collaboration");
dojo.require("misys.form.common");
dojo.require("misys.form.file");
dojo.require("misys.validation.common");
dojo.require("misys.binding.SessionTimer");
dojo.require("misys.form.addons");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode
	
	// Public functions & variables

	d.mixin(m, {
		bind : function() {
			m.setValidation("template_id", m.validateTemplateId);
			m.setValidation("pstv_tol_pct", m.validateTolerance);
			m.setValidation("neg_tol_pct", m.validateTolerance);
			m.setValidation("ls_cur_code", m.validateCurrency);
			m.setValidation("beneficiary_country", m.validateCountry);
			m.setValidation("iss_date", m.validateIssueDate);
			m.setValidation("valid_from_date", m.validateValidFromDate);
			m.setValidation("valid_to_date", m.validateValidToDate);
			m.setValidation("latest_payment_date", m.validateLatestPaymentDate);
			m.setValidation("origin_country", m.validateCountry);
			m.setValidation("supply_country", m.validateCountry);
			
			//Validate Hyphen, allowed no of lines validation on the back-office comment
			m.setValidation("bo_comment", m.bofunction);

			// onChange
			m.connect("ls_cur_code", "onChange", function(){
				dj.byId("additional_cur_code").set("value",this.get("value"));
				dj.byId("total_cur_code").set("value",this.get("value"));
				m.setCurrency(this, ["ls_amt","additional_amt","total_amt", "ls_liab_amt"]);
			});
			m.connect("prod_stat_code", "onChange", m.validateOutstandingAmount);
			m.connect(dj.byId("prod_stat_code"), "onChange", function(){this.validate();});	
			// Making outstanding amount as non editable in case of Not Processed,Cancelled,Purged
			m.connect("prod_stat_code","onChange",function(){
				var prodStatCodeValue = dj.byId("prod_stat_code").get("value"),liabAmt = dj.byId("ls_liab_amt");
				if(liabAmt && (prodStatCodeValue === "01" || prodStatCodeValue === "10" || prodStatCodeValue === "06"))
					{
						liabAmt.set("readOnly", true);
						liabAmt.set("disabled", true);
						m.toggleRequired("ls_liab_amt",false);
						dj.byId("ls_liab_amt").set("value", "");
					}
				else if(liabAmt)
					{
						liabAmt.set("readOnly", false);
						liabAmt.set("disabled", false);
						if(!(dj.byId("mode") && dj.byId("mode").get("value") === 'RELEASE'))
						{
							m.toggleRequired("ls_liab_amt",true);
						}
						dj.byId("ls_liab_amt").set("value", "");
					}
			});
			m.connect("issuing_bank_abbv_name", "onChange", m.populateReferences);
			if(dj.byId("issuing_bank_abbv_name"))
			{
				m.connect("entity", "onChange", function(){
					dj.byId("issuing_bank_abbv_name").onChange();});
			}
			m.connect("issuing_bank_customer_reference", "onChange", m.setApplicantReference);
			m.connect("inco_term_year", "onChange", function(){
				m.toggleFields(this.get("value"), null, ["inco_term"], false, true);
			});
			m.connect("inco_term", "onChange", function(){
				m.toggleFields(this.get("value"), null, ["inco_place"], false, false);
			});
			m.connect("inco_term_year", "onChange", m.getIncoTerm);
			m.connect("ls_amt", "onBlur", function(){
				m.calculateTotalAmt();
			});
			m.connect("additional_amt", "onBlur", function(){
				if(dj.byId("narrative_additional_amount") && (this.get("value") !== "" && !isNaN(this.get("value")) && this.get("value") !== 0))
				{
					dj.byId("narrative_additional_amount").set("disabled", false);
					m.toggleRequired("narrative_additional_amount", true);
					dojo.byId("narrative_additional_amount_img").style.display = "block";
					dijit.byId("narrative_additional_amount_img").set("disabled", false);
				}
				else
				{
					dj.byId("narrative_additional_amount").set("disabled", true);
					dj.byId("narrative_additional_amount").set("value", "");
					m.toggleRequired("narrative_additional_amount", false);
					dojo.byId("narrative_additional_amount_img").style.display = "none";
					dijit.byId("narrative_additional_amount_img").set("disabled", true);
				}
				m.calculateTotalAmt();
			});
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
			m.connect("ls_liab_amt", "onBlur", function(){
				if(dj.byId("total_amt") && (dj.byId("total_amt").get("value") < dj.byId("ls_liab_amt").get("value")))
				{
					var callback = function() {
						var widget = dijit.byId("ls_liab_amt");
					 	widget.set("state","Error");
					};
					m.dialog.show("ERROR", m.getLocalization("licenseLiabilityAmountCanNotBeGreaterThanLicenseTotalAmount"), "", function(){
							setTimeout(callback, 500);
						});
				}
			});
			m.connect("prod_stat_code", "onChange", function(){
				if(m._config.enable_to_edit_customer_details_bank_side=="false" && dj.byId("prod_stat_code") && dj.byId("prod_stat_code").get('value') !== '')
				{
					if(dj.byId("ls_liab_amt") && dj.byId("tnx_type_code") && dj.byId("tnx_type_code").get("value") !== '15' && dj.byId("tnx_type_code").get("value") !== '13')
					{
						m.toggleRequired("ls_liab_amt", false);
					}
				}
			});
			m.connect("prod_stat_code", "onChange", m.toggleProdStatCodeFields);
			m.connect("prod_stat_code", "onChange", function(){
				var value = this.get("value");
				m.toggleFields(
					value && value !== "01" && value !== "18", 
					["action_req_code"],
					["iss_date", "bo_ref_id"]);
				if(dj.byId("mode") && dj.byId("mode").get("value") === 'RELEASE')
				{					
					m.toggleRequired("bo_ref_id",false);
					m.toggleRequired("iss_date",false);
					m.toggleRequired("ls_liab_amt",false);
				}
				if(dj.byId("prod_stat_code") && dj.byId("prod_stat_code").get("value")==="08")
				{
					dj.byId("ls_clear").set("checked", true);
					m.animate("fadeIn", d.byId("clear-check-box"));
				}
				else
				{
					dj.byId("ls_clear").set("checked", false);
					m.animate("fadeOut", d.byId("clear-check-box"));
				}
				});
			m.connect("ls_amt", "onBlur", function(){
				//Validate amount in case of settlement request.
				if(dj.byId("org_ls_amt") && dj.byId("tnx_type_code").get("value") === "13" && dj.byId("sub_tnx_type_code").get("value") === "25")
				{
					var lsAmt = d.number.parse(dj.byId("ls_amt").get("value"));
					var orgLsAmt = d.number.parse(dj.byId("org_ls_amt").get("value"));
					lsAmt = !isNaN(lsAmt) ? lsAmt : 0;
					orgLsAmt = !isNaN(orgLsAmt) ? orgLsAmt : 0;
					if(lsAmt > orgLsAmt)
					{
						console.debug("License Amount cannot be made greater than the Amount in master in case of settlement.");
						m.showTooltip(m.getLocalization("lsAmtGreaterThanMasterLSAmtError", [lsAmt, orgLsAmt]),
								this.domNode, ["after"]);
						this.state = "Error";
						this._setStateClass();
						dj.setWaiState(this.focusNode, "invalid", "true");
					}
				}
			});
			m.connect("additional_amt", "onBlur", function(){
				//Validate amount in case of settlement request.
				if(dj.byId("org_additional_amt") && dj.byId("tnx_type_code").get("value") === "13" && dj.byId("sub_tnx_type_code").get("value") === "25")
				{
					var addAmt = d.number.parse(dj.byId("additional_amt").get("value"));
					var orgAddAmt = d.number.parse(dj.byId("org_additional_amt").get("value"));
					addAmt = !isNaN(addAmt) ? addAmt : 0;
					orgAddAmt = !isNaN(orgAddAmt) ? orgAddAmt : 0;
					if(addAmt > orgAddAmt)
					{
						console.debug("License Additional Amount cannot be made greater than the Amount in master in case of settlement.");
						m.showTooltip(m.getLocalization("lsAddAmtGreaterThanMasterLSAddAmtError", [addAmt, orgAddAmt]),
								this.domNode, ["after"]);
						this.state = "Error";
						this._setStateClass();
						dj.setWaiState(this.focusNode, "invalid", "true");
					}
				}
			});
		
		}, 
		
		calculateTotalAmt: function() {
			if(dj.byId("additional_amt") && dj.byId("ls_amt") && dj.byId("total_amt"))
			{
				var additionalAmount = isNaN(dj.byId("additional_amt").get("value")) ? 0 : dj.byId("additional_amt").get("value"); 
				var licenseAmount = isNaN(dj.byId("ls_amt").get("value")) ? 0 : dj.byId("ls_amt").get("value"); 
				dj.byId("total_amt").set("value", licenseAmount + additionalAmount);
			}
		},
		
		setValidToDate: function() {
			var validFromDate 			= dj.byId("valid_from_date"),
				validForNb    			= dj.byId("valid_for_nb"),
				validForPeriod  		= dj.byId("valid_for_period"),
				validToDate 			= dj.byId("valid_to_date"),
				milliSecTillValidity	= null,
				isPreCondStsfd 			= true;
			if(validFromDate && (validFromDate.get("value") === null || validFromDate.get("value") ===""))
			{
				isPreCondStsfd = false;
			}
			if(validForNb && (validForNb.get("value") === null || validForNb.get("value") ==="" || isNaN(validForNb.get("value"))))
			{
				isPreCondStsfd = false;
			}
			if(validForPeriod && (validForPeriod.get("value") === null || validForPeriod.get("value") ===""))
			{
				isPreCondStsfd = false;
			}
			if(validToDate && isPreCondStsfd)
			{
				 switch (validForPeriod.get("value")) {
					case "01":	 
						milliSecTillValidity = d.date.add(validFromDate.get("value"), "day", validForNb.get("value"));
						break;
					case "02":	
						milliSecTillValidity = d.date.add(validFromDate.get("value"), "week", validForNb.get("value"));		
						break;
					case "03":	
						milliSecTillValidity = d.date.add(validFromDate.get("value"), "month", validForNb.get("value"));
						break;
					case "04":	
						milliSecTillValidity = d.date.add(validFromDate.get("value"), "year", validForNb.get("value"));		
						break;
					default:
						break;
				}
				 validToDate.set("value", milliSecTillValidity);
			}
		},
		
		onFormLoad : function() {
			//  summary:
		    //          Events to perform on page load.

			// Additional onload events for dynamic fields
			m.setCurrency(dj.byId("ls_cur_code"), ["ls_amt","additional_amt","total_amt", "ls_liab_amt"]);
			
			if(dj.byId("mode") && dj.byId("mode").get("value") === 'RELEASE')
			{					
				m.toggleRequired("iss_date",false);
				m.toggleRequired("ls_liab_amt",false);
			}
			
			if(dj.byId("ls_cur_code") && dj.byId("ls_cur_code").get("value") !== "")
			{
				dj.byId("additional_cur_code").set("value",dj.byId("ls_cur_code").get("value"));
				dj.byId("total_cur_code").set("value",dj.byId("ls_cur_code").get("value"));
			}
			m.calculateTotalAmt();
			
			if(dj.byId("additional_amt") && dj.byId("narrative_additional_amount") && dj.byId("additional_amt").get("value") !== "" && !isNaN(dj.byId("additional_amt").get("value")) && dj.byId("additional_amt").get("value") !== 0)
			{
				dj.byId("narrative_additional_amount").set("disabled", false);
				m.toggleRequired("narrative_additional_amount", true);
				if(d.byId("narrative_additional_amount_img")){
				dojo.byId("narrative_additional_amount_img").style.display = "block";
				dijit.byId("narrative_additional_amount_img").set("disabled", false);
				}
			}
			else
			{
				dj.byId("narrative_additional_amount").set("disabled", true);
				dj.byId("narrative_additional_amount").set("value", "");
				m.toggleRequired("narrative_additional_amount", false);
				if(d.byId("narrative_additional_amount_img")){
				dojo.byId("narrative_additional_amount_img").style.display = "none";
				dijit.byId("narrative_additional_amount_img").set("disabled", true);
				}
			}
			
			if(dj.byId("valid_for_nb") && dj.byId("valid_for_period") && dj.byId("valid_for_nb").get("value") !== "" && !isNaN(dj.byId("valid_for_nb").get("value")))
			{
				dj.byId("valid_for_period").set("disabled", false);
				dj.byId("valid_for_period").set("required", true);
			}
			else
			{
				dj.byId("valid_for_period").set("disabled", true);
				dj.byId("valid_for_period").set("required", false);
			}
			// Populate references
			var issuingBankAbbvName = dj.byId("issuing_bank_abbv_name");
			if(issuingBankAbbvName) {
				issuingBankAbbvName.onChange();
			}
			
			var issuingBankCustRef = dj.byId("issuing_bank_customer_reference");
			if(issuingBankCustRef) {
				issuingBankCustRef.onChange();
			}
			
			var incoTerm = dj.byId("inco_term") ? dj.byId("inco_term").get("value") : "";
			if(incoTerm) {
				m.toggleFields(incoTerm, null, ["inco_place"], false, true);
			}
			else{
				m.toggleFields(incoTerm, null, ["inco_place"], false, false);
			}
			if(dj.byId("prod_stat_code").get("value") === "01")
			{
				m.toggleFields(	false, 
							["action_req_code"],
						["iss_date", "bo_ref_id"]);
				m.toggleRequired("bo_ref_id",false);
				
			}
			var prodStatCodeValue = dj.byId("prod_stat_code").get("value"),liabAmt = dj.byId("ls_liab_amt");
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
			m.toggleProdStatCodeFields();
			//Validate amount in case of settlement request.
			if(dj.byId("tnx_type_code").get("value") === "13" && dj.byId("sub_tnx_type_code").get("value") === "25")
			{
				if(dj.byId("org_ls_amt"))
				{
					var lsAmt = d.number.parse(dj.byId("ls_amt").get("value"));
					var orgLsAmt = d.number.parse(dj.byId("org_ls_amt").get("value"));
					lsAmt = !isNaN(lsAmt) ? lsAmt : 0;
					orgLsAmt = !isNaN(orgLsAmt) ? orgLsAmt : 0;
					if(lsAmt > orgLsAmt)
					{
						console.debug("License Amount cannot be made greater than the Amount in master in case of settlement.");
						m.showTooltip(m.getLocalization("lsAmtGreaterThanMasterLSAmtError", [lsAmt, orgLsAmt]),
								dj.byId("ls_amt").domNode, ["after"]);
						dj.byId("ls_amt").state = "Error";
						dj.byId("ls_amt")._setStateClass();
						dj.setWaiState(dj.byId("ls_amt").focusNode, "invalid", "true");
					}
				}
				if(dj.byId("org_additional_amt"))
				{
					var addAmt = d.number.parse(dj.byId("additional_amt").get("value"));
					var orgAddAmt = d.number.parse(dj.byId("org_additional_amt").get("value"));
					addAmt = !isNaN(addAmt) ? addAmt : 0;
					orgAddAmt = !isNaN(orgAddAmt) ? orgAddAmt : 0;
					if(addAmt > orgAddAmt)
					{
						console.debug("License Additional Amount cannot be made greater than the Amount in master in case of settlement.");
						m.showTooltip(m.getLocalization("lsAddAmtGreaterThanMasterLSAddAmtError", [addAmt, orgAddAmt]),
								dj.byId("additional_amt").domNode, ["after"]);
						dj.byId("additional_amt").state = "Error";
						dj.byId("additional_amt")._setStateClass();
						dj.setWaiState(dj.byId("additional_amt").focusNode, "invalid", "true");
					}
				}
			}
			
			if(dj.byId("prod_stat_code") && dj.byId("prod_stat_code").get("value")==="08")
			{
				m.animate("fadeIn", d.byId("clear-check-box"));
			}
			else
			{
				m.animate("fadeOut", d.byId("clear-check-box"));
			}
			if (dj.byId("tnx_type_code") && (dj.byId("tnx_type_code").get("value") === '15' || (dj.byId("tnx_type_code").get("value") === '13')) && (m._config.enable_to_edit_customer_details_bank_side == "false"))
			{
				dojo.style('transactionDetails', "display", "none");
			} else
			{
				if (m._config.enable_to_edit_customer_details_bank_side == "false" && dojo.byId("release_dttm_view_row"))
				{
					dojo.style('transactionDetails', "display", "none");
				}
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
		
		/**
         * Before Save Validations
         * 
         * @method beforeSaveValidations
         */
		beforeSaveValidations : function(){
			if(dj.byId("sub_tnx_type_code") && dj.byId("ls_clear"))
			{
				if(dj.byId("ls_clear").get("checked", true))
				{
					dj.byId("sub_tnx_type_code").set("value","84");
				}
				else
				{
					dj.byId("sub_tnx_type_code").set("value",null);
				}
			}
			return true;
		},
		
		beforeSubmitValidations : function(){
			
			if(dj.byId("sub_tnx_type_code") && dj.byId("ls_clear"))
			{
				if(dj.byId("ls_clear").get("checked", true))
				{
					dj.byId("sub_tnx_type_code").set("value","84");
				}
				else
				{
					dj.byId("sub_tnx_type_code").set("value",null);
				}
			}
			
			var valid = true;
			if(dj.byId("total_amt"))
			{
				m.setTnxAmt(dj.byId("total_amt").get("value"));
			}
			if(dj.byId("total_amt") && dj.byId("ls_liab_amt") && (dj.byId("total_amt").get("value") < dj.byId("ls_liab_amt").get("value")))
			{
				m._config.onSubmitErrorMsg = m.getLocalization("licenseLiabilityAmountCanNotBeGreaterThanLicenseTotalAmount");
				dj.byId("ls_liab_amt").set("value", "");
				console.debug("Invalid Outstanding Amount.");
				valid = false;
			}
			if(dj.byId('bo_ref_id') && dj.byId('bo_ref_id') != "")
			{
				valid = m.checkBankReference();
				if(!valid)
				{
					var field = dj.byId("bo_ref_id");	
					field.focus();
					field.set("state", "Error");
					dj.hideTooltip(field.domNode);
					dj.showTooltip(m.getLocalization("boRefIdExists", [field.get("value")]),field.domNode, 0);
					m._config.onSubmitErrorMsg = m.getLocalization("boRefIdExists", [field.get("value")]);
					field.set("value", "");
				}
			}
	    	 return valid;
	     }
		
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.bank.report_ls_client');