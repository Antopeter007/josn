dojo.provide("misys.binding.bank.report_sr");

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
dojo.require("dijit.layout.TabContainer");
dojo.require("dijit.form.DateTextBox");
dojo.require("misys.form.CurrencyTextBox");
dojo.require("dijit.form.NumberTextBox");
dojo.require("dijit.form.FilteringSelect");
dojo.require("misys.form.addons");
dojo.require("misys.form.SimpleTextarea");
dojo.require("dojo.data.ItemFileReadStore");
dojo.require("misys.widget.Collaboration");
dojo.require("misys.binding.bank.report_sr_swift");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode
	var notAllowed = "NOT ALLOWED";
	var allowed ="ALLOWED";
	// Private functions and variables go here

	// Public functions & variables follow
	d.mixin(m, {

		bind : function() {
			m.setValidation("iss_date", m.validateMOProdIssueDate);
			m.setValidation("exp_date", m.validateBankExpiryDate);
			m.setValidation("pstv_tol_pct", m.validateTolerance);
			m.setValidation("neg_tol_pct", m.validateTolerance);
			m.setValidation("max_cr_desc_code", m.validateMaxCreditTerm);
			m.setValidation("last_ship_date", m.validateLastShipmentDate);
			m.setValidation("lc_cur_code", m.validateCurrency);
			m.setValidation("latest_answer_date", m.validateLatestAnswerDate);
			m.setValidation("lc_govern_country", m.validateCountry);
			m.connect("ntrf_flag", "onClick", m.toggleTransferIndicatorFlag);
			m.connect("lc_available_amt", "onBlur",m.validateLCAvailableAmt);
			m.connect("lc_liab_amt", "onBlur",m.validateLCLiabAmt);
		    m.setValidation("earliest_ship_date", m.validateEarliestShipmentDate);
			m.setValidation("renew_for_nb", m.validateRenewFor);
			m.setValidation("advise_renewal_days_nb", m.validateDaysNotice);
			m.setValidation("rolling_renewal_nb", m.validateNumberOfRenewals);
			m.setValidation("rolling_cancellation_days", m.validateCancellationNotice);
			m.setValidation("renewal_calendar_date",m.validateRenewalCalendarDate);
			
			/*m.connect("rolling_renewal_nb","onChange", m.setRenewalFinalExpiryDate);
			m.connect("rolling_renew_on_code","onChange", m.setRenewalFinalExpiryDate);
			m.connect("rolling_renew_for_nb","onChange", m.setRenewalFinalExpiryDate);
			m.connect("rolling_renew_for_period","onChange", m.setRenewalFinalExpiryDate);*/
			
			
			//Validate Hyphen, allowed no of lines validation on the back-office comment
			m.setValidation("bo_comment", m.bofunction);
			m.connect("courier_partner","onChange", m.validatecourierPartnerField);
			
			//validation to check row count doesn't exceed the maximum rows
			var textfields = ["draft_term","narrative_description_goods","narrative_documents_required","narrative_additional_instructions",
				"narrative_special_beneficiary","narrative_special_recvbank", "narrative_charges", "narrative_period_presentation", "narrative_shipment_period",
				"narrative_sender_to_receiver", "narrative_payment_instructions","narrative_additional_amount"];
			var fields = [];
			for(var i=0; i <= textfields.length ; i++)
				{
					if(dj.byId(textfields[i]) && dj.byId(textfields[i]) !== null)
						{
							fields.push(textfields[i]);
						}						
				}
			if(dj.byId("exp_event"))
			{
				fields.push("exp_event");
			}
			d.forEach(fields, function(id){
				var field= dj.byId(id);
				field.onBlur(field);
			});
			m.connect("ship_period", "onChange", m.validateShipPeriod);
			m.connect("projected_expiry_date", "onChange", function(){
				var expDate = dj.byId("exp_date");
				var finalExp = dj.byId("final_expiry_date");
				var hideTT = function() {
					dj.hideTooltip(dj.byId("projected_expiry_date").domNode);
				};
				var projectedExpDtVal = this.get("displayedValue");
				if(expDate && !m.compareDateFields(expDate, this))
				{
					this.set("value",null);
					dj.showTooltip(m.getLocalization('projectedExpDateLessThanTransactionExpDtError',[ projectedExpDtVal, expDate.get("displayedValue") ]), dj.byId("projected_expiry_date").domNode, 0);
					setTimeout(hideTT, 2000);
				}
				else if(finalExp && !m.compareDateFields(this, finalExp))
				{
					this.set("value",null);
					dj.showTooltip(m.getLocalization('projectedExpDateGreaterThanFinalExpDtError',[ projectedExpDtVal, finalExp.get("displayedValue") ]), dj.byId("projected_expiry_date").domNode, 0);
					setTimeout(hideTT, 2000);
				}
			});
			m.connect("final_expiry_date", "onChange", function(){
				var expDate = dj.byId("exp_date");
				var projectedExp = dj.byId("projected_expiry_date");
				var hideTT = function() {
					dj.hideTooltip(dj.byId("final_expiry_date").domNode);
				};
				var finalExpDtVal = this.get("displayedValue");
				if(expDate && !m.compareDateFields(expDate, this))
				{
					this.set("value",null);
					this.set("state","Error");
					dj.showTooltip(m.getLocalization('finalExpDateLessThanTransactionExpDtError',[ finalExpDtVal, expDate.get("displayedValue") ]), dj.byId("final_expiry_date").domNode, 0);
					setTimeout(hideTT, 2000);
				}
				else if(projectedExp && !m.compareDateFields(projectedExp, this))
				{
					this.set("value",null);
					dj.showTooltip(m.getLocalization('finalExpDateLessThanProjectedExpDtError',[ finalExpDtVal, projectedExp.get("displayedValue") ]), dj.byId("final_expiry_date").domNode, 0);
					setTimeout(hideTT, 2000);
				}
			});
			
			// CF See comment in report_lc.js for this validation
			m.connect("prod_stat_code", "onChange", m.validateOutstandingAmount);
			m.connect(dj.byId("prod_stat_code"), "onChange", function(){this.validate();});
			m.connect("prod_stat_code", "onChange", m.toggleProdStatCodeFields);
			m.connect("prod_stat_code", "onChange", function(){
				var value = this.get("value");
				m.toggleFields(value && value !== "01" && value !== "18", 
					null, ["iss_date", "bo_ref_id"]);});
			m.connect("prod_stat_code", "onChange", function(){
				if(dj.byId("lc_liab_amt")){
				m.updateOutstandingAmount(dj.byId("lc_liab_amt"), dj.byId("org_lc_liab_amt"));
				}
			});
			// Making outstanding amount as non editable in case of Not Processed,Cancelled,Purged
			m.connect("prod_stat_code","onChange",function(){
				var prodStatCodeValue = dj.byId("prod_stat_code").get('value'),liabAmt = dj.byId("lc_liab_amt");
				if(liabAmt && (prodStatCodeValue === '01' || prodStatCodeValue === '10' || prodStatCodeValue === '06'))
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
			m.connect("cfm_inst_code_1", "onClick", m.resetConfirmationCharges);
			m.connect("cfm_inst_code_2", "onClick", m.resetConfirmationCharges);
			m.connect("cfm_inst_code_3", "onClick", m.resetConfirmationCharges);
			m.connect("cfm_chrg_brn_by_code_1", "onClick", m.checkConfirmationCharges);
			m.connect("cfm_chrg_brn_by_code_2", "onClick", m.checkConfirmationCharges);
					
			//calling swift2018 specific javascript
			if(m._config.swift2018Enabled){
				m._bindSwift2018();
			}
			
			var crAvlByFields = [
					"cr_avl_by_code_1", "cr_avl_by_code_2", "cr_avl_by_code_3",
					"cr_avl_by_code_4", "cr_avl_by_code_5"];
			d.forEach(crAvlByFields, function(id){
				m.connect(id, "onClick", m.toggleBankPaymentDraftAt);
				m.connect(id, "onClick", function(){
					var crAvlByCode2Checked = dj.byId("cr_avl_by_code_2").get("checked"),
				    crAvlByCode3Checked = dj.byId("cr_avl_by_code_3").get("checked");
					if(d.byId('drawee_details_bank_img'))
					{
						if(!crAvlByCode2Checked && !crAvlByCode3Checked)
						{
							m.animate("fadeOut","drawee_details_bank_img");
						}
						else
						{
							m.animate("fadeIn","drawee_details_bank_img");
						}
					}
					m.toggleFields(
							crAvlByCode2Checked || crAvlByCode3Checked, 
							["drawee_details_bank_address_line_2", "drawee_details_bank_dom","drawee_details_bank_address_line_4"],
							["drawee_details_bank_name", "drawee_details_bank_address_line_1"]);
					if(dj.byId("cr_avl_by_code_1").get("checked")) {
						dj.byId("draft_term").set("value", "Sight");
						dj.byId("draft_term").set("disabled", true);
						m.animate("fadeOut","draft_term_img_label");
					}
					if(!dj.byId("cr_avl_by_code_1").get("checked")) {
						dj.byId("draft_term").set("value", "");
						dj.byId("draft_term").set("disabled", false);
						dj.byId("draft_term_img").set("disabled", false);
						m.animate("fadeIn","draft_term_img_label");
					}
					m.toggleRequired("draft_term", true);
				});
			});
			m.connect("cr_avl_by_code_6", "onClick", function() {
				dj.byId("draft_term").set("value", "");
				dj.byId("draft_term").set("disabled", true);
				dj.byId("draft_term_img").set("disabled", true);
				m.animate("fadeOut","draft_term_img_label");
				m.toggleRequired("draft_term", false);			
				dj.byId("drawee_details_bank_name").set("value", "");
				var ids = ["drawee_details_bank_name", "drawee_details_bank_address_line_1",
				           		"drawee_details_bank_address_line_2", "drawee_details_bank_dom",
				           		"drawee_details_bank_address_line_4"];
				d.forEach(ids, function(id){
					var field = dj.byId(id);
					if(field) {
						field.set("disabled", true);
						m.toggleRequired(id, false);
					}
				});
			});
			m.connect("advise_mode_code_1", "onClick", function(){
				m.toggleFields(
						this.get("checked"), 
						null,
						["part_ship_detl_text"]);
			});
			m.connect("advise_mode_code_2", "onClick", function(){
				m.toggleFields(
					this.get("checked"), 
					["advise_thru_bank_name", "advise_thru_bank_address_line_1", 
							"advise_thru_bank_address_line_2", "advise_thru_bank_dom","advise_thru_bank_address_line_4"],
					null);	
			});
			m.connect("advise_mode_code", "onChange", function(){
				m.toggleFields(this.get("value")=="02", [
						"advise_thru_bank_name", "advise_thru_bank_address_line_1",
						"advise_thru_bank_address_line_2", "advise_thru_bank_dom","advise_thru_bank_address_line_4"],
						["advise_thru_bank_name", "advise_thru_bank_address_line_1"]);
			});
			m.connect("cr_avl_by_code_1", "onChange", function(){
				if(!dj.byId("cr_avl_by_code_6") || !dj.byId("cr_avl_by_code_6").get("checked")) {
					m.toggleFields(
							!this.get("checked"), 
							null,
							["draft_term"], false);
				}
				if(this.get("checked")) {
					dj.byId("draft_term").set("value", "Sight");
				} else {
					dj.byId("draft_term").set("value", "");
				}
			});

			// Onblur
			m.connect("lc_cur_code", "onChange", function(){
				m.setCurrency(this, ["lc_amt"]);
				m.setCurrency(this, ["lc_available_amt", "lc_liab_amt"]);
			});
			m.connect("lc_amt", "onBlur", function(){
				m.setTnxAmt(this.get("value"));
			});
			m.connect("tnx_amt", "onBlur", function(){
				m.validateDocumentAmtAndLCAmt();
			});
			m.connect("last_ship_date", "onClick", function(){
				if (m._config.shipment_period_standard === true) {
				m.toggleDependentFields(this, dj.byId("narrative_shipment_period"), 
						m.getLocalization("shipmentDateOrPeriodExclusivityError"));
						}
			});
			m.connect("last_ship_date", "onChange", function(){
				if (m._config.shipment_period_standard === true) {
				m.toggleDependentFields(this, dj.byId("narrative_shipment_period"), 
						m.getLocalization("shipmentDateOrPeriodExclusivityError"));
						}
			});
			m.connect("narrative_shipment_period", "onClick", function(){
				if (m._config.shipment_period_standard === true) {
				m.toggleDependentFields(this, dj.byId("last_ship_date"), 
						m.getLocalization("shipmentDateOrPeriodExclusivityError"));
						}
			});
			m.connect("narrative_shipment_period", "onChange", function(){
				if (m._config.shipment_period_standard === true) {
				m.toggleDependentFields(this, dj.byId("last_ship_date"), 
						m.getLocalization("shipmentDateOrPeriodExclusivityError"));
						}
			});
			m.connect("inco_term_year", "onChange", m.getIncoTerm);
			m.connect("delivery_to", "onChange", m.getDeliveryTo);
	 		m.connect("delivery_to", "onChange", function(){
				m.toggleFields((this.get("value") === "02" || this.get("value") === "04" || this.get("value") === "05" ), null, ["narrative_delivery_to"]);
			});
			m.connect("inco_term_year", "onChange", function(){
				m.toggleFields(this.get("value"), null, ["inco_term"], false, true);
			});
			m.connect("inco_term", "onChange", function(){
				m.toggleFields(this.get("value"), null, ["inco_place"], false, false);
			});
			m.connect("beneficiary_name", "onFocus", m.enableBeneficiaryFields);
			
			m.connect("renew_flag", "onClick", m.toggleRenewalDetails);
			m.connect("renew_flag", "onClick", function(){
				if(!this.get("checked"))
				{
					dj.byId("rolling_renewal_nb").set("value", "");
				}
			});
			m.connect("advise_renewal_flag", "onClick", function(){
				m.toggleFields(this.get("checked"), null, [
						"advise_renewal_days_nb"]);
			});
			m.connect("rolling_renewal_flag", "onClick", function(){
				m.toggleFields(this.get("checked"), ["final_expiry_date"], [
						"rolling_renewal_nb", "rolling_cancellation_days", "rolling_renew_on_code"]);
				if(!this.get("checked"))
				{
					dj.byId("rolling_renew_for_nb").set("value", "");
					dj.byId("rolling_renew_for_period").set("value", "");
					dj.byId("rolling_day_in_month").set("value", "");
				}
			});
			m.connect("rolling_renewal_flag", "onChange", function(){
				m.toggleFields(this.get("checked"), ["final_expiry_date"], [
						"rolling_renewal_nb", "rolling_cancellation_days", "rolling_renew_on_code"]);
				if(!this.get("checked"))
				{
					dj.byId("rolling_renew_for_nb").set("value", "");
					dj.byId("rolling_renew_for_period").set("value", "");
					dj.byId("rolling_day_in_month").set("value", "");
				}
			});
			m.connect("rolling_renew_on_code", "onChange", function(){
				m.toggleFields(this.get("value") === "03",
						["rolling_day_in_month"], ["rolling_renew_for_nb"], true);
				if(this.get("value") === "01")
				{
					dj.byId("rolling_renew_for_nb").set("value", "");
					dj.byId("rolling_renew_for_period").set("value", "");
					dj.byId("rolling_day_in_month").set("value", "");
				}
				else if(dj.byId("rolling_renew_on_code").get("value") === "03" && dj.byId("rolling_renewal_flag").get("checked") && dj.byId("renew_for_period").get("value") !== "")
				{
					dj.byId("rolling_renew_for_period").set("value", dj.byId("renew_for_period").get("value"));
				}
			});
			m.connect("rolling_renew_for_nb", "onBlur", function(){
				m.validateRollingRenewalFrequency(dj.byId("rolling_renew_for_nb"));
			});
			m.connect("renew_for_nb", "onBlur", function(){
				m.validateRollingRenewalFrequency(dj.byId("renew_for_nb"));
			});
			
			m.connect("renew_for_period", "onChange", function(){
				if(dj.byId("rolling_renew_on_code").get("value") === "03" && dj.byId("rolling_renewal_flag").get("checked") && dj.byId("renew_for_period").get("value") !== "")
				{
					dj.byId("rolling_renew_for_period").set("value", dj.byId("renew_for_period").get("value"));
				}
			});
			m.connect("rolling_renewal_nb", "onBlur", function(){
				if(dj.byId("rolling_renewal_flag").get("checked") && d.number.parse(this.get("value")) === 1)
				{
					dj.byId('rolling_renewal_nb').set("state","Error");
					dj.showTooltip(m.getLocalization("invalidNumberOfRollingRenewals"), dj.byId("rolling_renewal_nb").domNode, 0);
					var hideTT = function() {
						dj.hideTooltip(dj.byId("rolling_renewal_nb").domNode);
					};
					setTimeout(hideTT, 50000);
				}
			});
			m.connect("rolling_renewal_nb", "onChange", function(){
				if(dj.byId("rolling_renewal_flag").get("checked") && d.number.parse(this.get("value")) === 1)
				{
					dj.byId('rolling_renewal_nb').set("state","Error");
					dj.showTooltip(m.getLocalization("invalidNumberOfRollingRenewals"), dj.byId("rolling_renewal_nb").domNode, 0);
					var hideTT = function() {
						dj.hideTooltip(dj.byId("rolling_renewal_nb").domNode);
					};
					setTimeout(hideTT, 50000);
				}
			});
			m.connect("rolling_day_in_month", "onBlur", function(){
				if(dj.byId('rolling_day_in_month').get("value")=== 0)
				{
					dj.byId('rolling_day_in_month').set("state","Error");
					dj.showTooltip(m.getLocalization("dayInMonthZeroNotApplicableError"), dj.byId("rolling_day_in_month").domNode, 0);
					var hideTT = function() {
						dj.hideTooltip(dj.byId("rolling_day_in_month").domNode);
					};
					setTimeout(hideTT, 4500);
				}
			});
			m.connect("rolling_day_in_month", "onChange", function(){
				if(dj.byId("rolling_renew_for_period").get("value") === "D")
				{
					this.set("value","");
					dj.showTooltip(m.getLocalization('dayInMonthNotApplicableForDaysError'), dj.byId("rolling_day_in_month").domNode, 0);
					var hideTT = function() {
						dj.hideTooltip(dj.byId("rolling_day_in_month").domNode);
					};
					setTimeout(hideTT, 1500);
				}
			});
			m.connect("rolling_renew_for_period", "onChange", function(){
				if(dj.byId("rolling_renew_for_period").get("value") === "D" && !isNaN(dj.byId("rolling_day_in_month").get("value")))
				{
					dj.byId("rolling_day_in_month").set("value","");
					dj.showTooltip(m.getLocalization('dayInMonthNotApplicableForDaysError'), dj.byId("rolling_renew_for_period").domNode, 0);
					var hideTT = function() {
						dj.hideTooltip(dj.byId("rolling_day_in_month").domNode);
					};
					setTimeout(hideTT, 1500);
				}
			});
			m.connect("renew_on_code", "onChange", function(){
				m.toggleFields(
						(this.get("value") == "02"), 
						null,
						["renewal_calendar_date"]);
			});
			
			// Optional EUCP flag 
			m.connect("eucp_flag", "onClick", function(){
				m.toggleFields(
						this.get("checked"), 
						null,
						["eucp_details"]);
			});
			m.connect("tnx_amt", "onChange", function(){
				m.updateOutstandingAmount(dj.byId("lc_liab_amt"), dj.byId("org_lc_liab_amt"));
			});
			
			m.connect("applicable_rules", "onChange", function(){
				m.toggleFields((this.get("value") == "99"), null, ["applicable_rules_text"]);
			});
			m.connect("prod_stat_code","onChange",function(){
				var prodStatCodeValue = dj.byId("prod_stat_code").get('value');
				if(dj.byId("doc_ref_no") &&(prodStatCodeValue === '16' || prodStatCodeValue === '24'))
					{
						dj.byId("doc_ref_no").set("disabled", false);
					}
				else if(dj.byId("doc_ref_no"))
					{
						dj.byId("doc_ref_no").set("disabled", true);
					}
				if (m._config.enable_to_edit_customer_details_bank_side == "false" && dj.byId("prod_stat_code") && dj.byId("prod_stat_code").get('value') !== '' && dj.byId("lc_liab_amt") && dj.byId("tnx_type_code") && dj.byId("tnx_type_code").get("value") !== '15' && dj.byId("tnx_type_code").get("value") !== '13')
				{
					m.toggleRequired("lc_liab_amt", false);
					m.toggleRequired("credit_available_with_bank_address_line_1", false);
					m.toggleRequired("draft_term", false);
				}
			});
						// for Maturity Date
			m.connect("prod_stat_code", "onChange", function(){
				m.toggleProdStatCodeFields();
				var value = this.get("value");
				if(value === "05" || value === "13" || value === "15"|| value === "14" || value === "04")
				{
					m.toggleRequired("maturity_date", true);
				} else {
					m.toggleRequired("maturity_date", false);
				}
				
			});
			// Bill Reference Enable Disable toggle on Product Change of Updated, Discrepant, Accepted, Partially Settled, Settled, Partial sight paid & Sight payment
			m.connect("prod_stat_code", "onChange", function(){
				var  prodStatCodeValue=dj.byId("prod_stat_code").get("value") ;
				var billReferenceField = dj.byId("imp_bill_ref_id");
				if(billReferenceField && prodStatCodeValue)
				{
				if(prodStatCodeValue==="04" || prodStatCodeValue==="07" || prodStatCodeValue==="12"|| prodStatCodeValue==="13" ||
				 prodStatCodeValue==="05"  || prodStatCodeValue==="14" || prodStatCodeValue==="15"    )
				 {
					billReferenceField.set("disabled", false);
				} else{
					billReferenceField.set("disabled", true);
					billReferenceField.set("value", "");
				}
				}
			});
	
			
			//Set 
			m.connect("renew_amt_code_1","onClick",  function(){
				m.setRenewalAmount(this);
				});
			m.connect("renew_amt_code_2","onClick",  function(){
				m.setRenewalAmount(this);
				});
			m.connect("part_ship_detl_nosend", "onChange", function(){
				var partShipValue = this.get("value");
				dj.byId("part_ship_detl").set("value", this.get("value")); 
				if(m._config.swift2018Enabled){	
					//SWIFT 2018 changes
					if(partShipValue == 'CONDITIONAL'){
						d.byId("infoMessagePartialShipment").style.display = "block";
						d.byId("infoMessagePartialShipment").style.paddingLeft = "250px";
					}
					else{
						document.getElementById("infoMessagePartialShipment").style.display = "none";
					}
				}
				m.toggleFields(
						partShipValue && partShipValue !== allowed &&
							partShipValue !== notAllowed && partShipValue !== "NONE", null, ["part_ship_detl_text_nosend"]);
			  });
			m.connect("part_ship_detl_text_nosend", "onBlur", function(){
	 	 	 	dj.byId("part_ship_detl").set("value", this.get("value"));
	 	 	 	});
	 	 	m.connect("tran_ship_detl_nosend", "onChange", function(){
	 	 	 	var fieldValue = this.get("value");
	 	 	 	dj.byId("tran_ship_detl").set("value", fieldValue);
	 	 	 	if(m._config.swift2018Enabled){	
		 	 	 	//SWIFT 2018 changes
					if(fieldValue == 'CONDITIONAL'){
						document.getElementById("infoMessageTranshipment").style.display = "block";
						document.getElementById("infoMessageTranshipment").style.paddingLeft = "250px";
					}
					else{
						document.getElementById("infoMessageTranshipment").style.display = "none";
					}
	 	 	 	}
	 	 	 	m.toggleFields(fieldValue && fieldValue !== allowed &&
	 	 	 	fieldValue !== notAllowed && fieldValue !== "NONE", 
	 	 	 	null, ["tran_ship_detl_text_nosend"]);
	 	 	 	
	 	 	});
	 	 	m.connect("tran_ship_detl_text_nosend", "onBlur", function(){
	 	 	 	dj.byId("tran_ship_detl").set("value", this.get("value"));
	 	 	 });
	 	 	m.connect("maturity_date", "onBlur", function(){
				m.validateEnteredGreaterThanCurrentDate();
			});
	 		m.connect("lc_exp_date_type_code", "onChange", function(){
				m.toggleFields((this.get("value") !== "03"), null, ["exp_date"]);
				if(this.get("value") === "02")
					{
						m.toggleRequired("exp_date", false);
						m.animate("fadeIn", d.byId("exp-event"));
						m.toggleRequired("exp_event", true);
					}
				else
					{
						m.animate("fadeOut", d.byId("exp-event"));
						dj.byId("exp_event").set("value" , "");
						m.toggleRequired("exp_event", false);
					}
			});
	 		m.connect("delv_org", "onChange", function(){
				m.toggleFields((this.get("value") === "99"), null, ["delv_org_text"]);
			});
		},

		onFormLoad : function() {		
			if(d.byId("amend_narratives_display")) {
				d.byId("amend_narratives_display").style.display="none";
			}
				
			if(d.byId("view-narrative-swift")) {
				d.byId("view-narrative-swift").style.display="block";
			}
			
			if(document.getElementById("amd_no")) {
				m._config.amendmentNumber = document.getElementById("amd_no").value;
				document.getElementById("amd_no").value ='';
			}
			
			
			m.setCurrency(dj.byId("lc_cur_code"), ["tnx_amt", "lc_amt"]);
			if(dj.byId("lc_cur_code")){
				m.setCurrency(dj.byId("lc_cur_code"), ["lc_available_amt","lc_liab_amt"]);
			}
			
			
			//calling swift2018 specific javascript
			if(m._config.swift2018Enabled){
				m._onFormLoadSwift2018();
			}
		
			var crAvlByCode1 = dj.byId("cr_avl_by_code_1");
		    
			if(crAvlByCode1) {
				var crAvlByCode2Checked = dj.byId("cr_avl_by_code_2").get("checked"),
			    crAvlByCode3Checked = dj.byId("cr_avl_by_code_3").get("checked");
				if(d.byId('drawee_details_bank_img'))
				{
					if(!crAvlByCode2Checked && !crAvlByCode3Checked)
					{
						m.animate("fadeOut","drawee_details_bank_img");
					}
					else
					{
						m.animate("fadeIn","drawee_details_bank_img");
					}
				}
				m.toggleFields(
						crAvlByCode2Checked || crAvlByCode3Checked, 
						["drawee_details_bank_address_line_2", "drawee_details_bank_dom", "drawee_details_bank_address_line_4"],
						["drawee_details_bank_name", "drawee_details_bank_address_line_1"]);
				
				m.toggleFields(
					!crAvlByCode1.get("checked"), 
					null,
					["draft_term"],
					true, true);
				if(crAvlByCode1.get("checked")){
					dj.byId("draft_term").set("value", "Sight");
					dj.byId("draft_term").set("disabled", true);
					m.animate("fadeOut","draft_term_img_label");
				}
			}

			var renewFlag = dj.byId("renew_flag");
			if(renewFlag) {
				d.hitch(renewFlag, m.toggleRenewalDetails, true)();
				m.toggleFields(
						(dj.byId("renew_on_code").get("value") == "02"), 
						null,
						["renewal_calendar_date"], true);

				m.toggleFields(
						dj.byId("advise_renewal_flag").get("checked"),
						null,
						["advise_renewal_days_nb"], true);

				m.toggleFields(
						dj.byId("rolling_renewal_flag").get("checked"),
						["final_expiry_date"],
						["rolling_renewal_nb", "rolling_cancellation_days", "rolling_renew_on_code"], true);
				var rollingRenewOnCode = dj.byId("rolling_renew_on_code");
				if(rollingRenewOnCode) {
					m.toggleFields(rollingRenewOnCode.get("value") === "03",
							["rolling_day_in_month"], ["rolling_renew_for_nb"], true);
				}
			}
			
			var eucpFlag = dj.byId("eucp_flag");
			if(eucpFlag) {
				m.toggleFields(
						eucpFlag.get("checked"), 
						null,
						["eucp_details"]);
			}
			if (dj.byId("latest_answer_date")){
				m.toggleProdStatCodeFields();
			}
			var applRule = dj.byId("applicable_rules");
			if(applRule) {
				m.toggleFields(
						applRule.get("value") == "99",
						null, ["applicable_rules_text"]);
			}
			var prodStatCode = dj.byId("prod_stat_code"),liabAmt = dj.byId("lc_liab_amt") ;
			//maturity date mandatory
			if(prodStatCode.get("value") === "05" || prodStatCode.get("value") === "13" || prodStatCode.get("value") === "15"|| prodStatCode.get("value") === "14" || prodStatCode.get("value") === "04"){
				m.toggleRequired("maturity_date", true);
			}
			// Bill reference enabled on Form Load
			var billReferenceField = dj.byId("imp_bill_ref_id");
			if(billReferenceField && prodStatCode && prodStatCode.get("value"))
			{
			if(prodStatCode.get("value") === "04" || prodStatCode.get("value") === "05" || prodStatCode.get("value") === "07"|| prodStatCode.get("value") === "12" || prodStatCode.get("value") === "13" || prodStatCode.get("value") === "14" || prodStatCode.get("value") === "15"){
				billReferenceField.set("disabled", false);
			}
			else
			{
				billReferenceField.set("disabled", true);
				billReferenceField.set("value", "");
			}
			}
			if(liabAmt && prodStatCode && (prodStatCode.get('value') === '01' || prodStatCode.get('value') === '10' || prodStatCode.get('value') === '06'))
				{
					liabAmt.set("readOnly", true);
					liabAmt.set("disabled", true);

				}
			else if(liabAmt)
				{
					liabAmt.set("readOnly", false);
					liabAmt.set("disabled", false);
				}
			//Enable doc_ref_no only in case of settlement and charges
			var prodStatCodeValue = dj.byId("prod_stat_code");
			if(dj.byId("doc_ref_no") && prodStatCode && (prodStatCode.get('value')=== '16' || prodStatCode.get('value') === '24'))
				{
					dj.byId("doc_ref_no").set("disabled", false);
				}
			else if(dj.byId("doc_ref_no"))
				{
					dj.byId("doc_ref_no").set("disabled", true);
				}
			//Radio field template is reading values from all nodes in the input xml.
			// For ones with multiple transactions, (ex:  create, approve, amend, approve.) the tag values from the root node is not being picked, because of radio-value = //*name in form-templates.
			// To overcome this we are overriding "value" and "checked" params from js.
			m.setRenewalAmountOnFormLoad();
			var shipDetlSelect = dj.byId("part_ship_detl_nosend");
 	 	 	if(shipDetlSelect)
 	 	 	{
	 	 	 	var shipDetlValue = shipDetlSelect.get("value");
	 	 	 	if(m._config.swift2018Enabled){	
		 	 	 	//SWIFT 2018 changes
		 	 	 	if(shipDetlSelect == 'CONDITIONAL'){
						document.getElementById("infoMessagePartialShipment").style.display = "block";
						document.getElementById("infoMessagePartialShipment").style.paddingLeft = "250px";
					}
					else{
						document.getElementById("infoMessagePartialShipment").style.display = "none";
					}
	 	 	 	}
	 	 	 	m.toggleFields(shipDetlValue && shipDetlValue !== allowed &&
	 	 	 	shipDetlValue !== notAllowed && shipDetlValue !== "NONE", 
	 	 	 	null, ["part_ship_detl_text_nosend"], true);
 	 	 	}
 	 	 	var shipDetl = dj.byId("part_ship_detl");
 	 	 	if(shipDetl && shipDetl.get("value") === "") {
 	 	 		if(shipDetlSelect)
 	 	 			{
 	 	 				shipDetl.set("value", shipDetlSelect.get("value"));
 	 	 			}
 	 	 	}
 	
 	 	 	if (dj.byId("advise_mode_code")) {
				m.toggleFields(dj.byId("advise_mode_code").get("value")=="02", [
						"advise_thru_bank_name", "advise_thru_bank_address_line_1",
						"advise_thru_bank_address_line_2", "advise_thru_bank_dom","advise_thru_bank_address_line_4"],
						["advise_thru_bank_name", "advise_thru_bank_address_line_1"]);
			}
			var tranShipDetlSelect = dj.byId("tran_ship_detl_nosend");
			if(tranShipDetlSelect)
			{
				var fieldValue = tranShipDetlSelect.get("value");
				if(m._config.swift2018Enabled){				
					//SWIFT 2018 changes
					if(fieldValue == 'CONDITIONAL'){
						document.getElementById("infoMessageTranshipment").style.display = "block";
						document.getElementById("infoMessageTranshipment").style.paddingLeft = "250px";
					}
					else{
						document.getElementById("infoMessageTranshipment").style.display = "none";
					}
				}
				m.toggleFields(fieldValue && fieldValue !== allowed &&
			 	 	 	fieldValue !== notAllowed && fieldValue !== "NONE", 
			 	 	 	null, ["tran_ship_detl_text_nosend"]);
			}
			var tranShipDetl = dj.byId("tran_ship_detl");
			if(tranShipDetl && tranShipDetl.get("value") === "") {
				if(tranShipDetlSelect)
					{
						tranShipDetl.set("value", tranShipDetlSelect.get("value"));
					}
			}
			if (dj.byId("tnx_type_code") && (dj.byId("tnx_type_code").get("value") === '15' || (dj.byId("tnx_type_code").get("value") === '13')) && (m._config.enable_to_edit_customer_details_bank_side == "false"))
			{
				dojo.style('transactionDetails', "display", "none");
			} else
			{
				if (m._config.enable_to_edit_customer_details_bank_side == "false" && dojo.byId("release_dttm_view_row"))
				{
					dojo.style('transactionDetails', "display", "none");
					
					var transactionids = [ "lc_liab_amt", "credit_available_with_bank_address_line_1",
						"draft_term"];
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
				m._config.lastShipDate = dj.byId("last_ship_date") ? dj.byId("last_ship_date").get("displayedValue") : "";
			if (m._config.shipment_period_standard === false) {
				m._config.earliestShipDate = dj.byId("earliest_ship_date") ? dj.byId("earliest_ship_date").get("displayedValue") : "";
				m._config.shipPeriod = dj.byId("ship_period") ? dj.byId("ship_period").get("displayedValue") : "";
				m._config.shipName = dj.byId("ship_name") ? dj.byId("ship_name").get("displayedValue") : "";
				m._config.narrativeShipPeriod = dj.byId("narrative_shipment_period") ? dj.byId("narrative_shipment_period").get("displayedValue") : "";
				
			}
			if(dj.byId("ntrf_flag") && dj.byId("narrative_transfer_conditions"))
			{
				if(dj.byId("ntrf_flag").get("checked"))
				{
					dj.byId("narrative_transfer_conditions").set("disabled", true);
					dj.byId("narrative_transfer_conditions").set("value", "");
					document.getElementById("narrative_transfer_conditions_img").style.display = "none";
				}
				else
				{
					dj.byId("narrative_transfer_conditions").set("disabled", false);
					document.getElementById("narrative_transfer_conditions_img").style.display = "block";
				}
			}
			
			if(dj.byId("lc_exp_date_type_code"))
			{
				m.toggleFields((dj.byId("lc_exp_date_type_code").get("value") !== "03"), null, ["exp_date"]);
				
				if(dj.byId("lc_exp_date_type_code").get("value") == '02')
					{
					m.toggleRequired("exp_date", false);
					m.animate("fadeIn", d.byId("exp-event"));
					m.toggleRequired("exp_event", true);
					}
					else
					{
						m.animate("fadeOut", d.byId("exp-event"));
						m.toggleRequired("exp_event", false);
					}
			}
			
			if(dj.byId("delv_org"))
			{
				m.toggleFields((dj.byId("delv_org").get("value") === "99"), null, ["delv_org_text"]);
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
			var incoTerm = dj.byId("inco_term") ? dj.byId("inco_term").get("value") : "";
			if(incoTerm) {
				m.toggleFields(incoTerm, null, ["inco_place"], false, true);
			}
			else{
				m.toggleFields(incoTerm, null, ["inco_place"], false, false);
			}
			if(dj.byId("delivery_to"))
			{
				m.getDeliveryTo();
				dijit.byId("delivery_to").set("value",dj.byId("org_delivery_to").get("value"));
				m.toggleFields((dj.byId("delivery_to").get("value") === "02" || dj.byId("delivery_to").get("value") === "04" || dj.byId("delivery_to").get("value") === "05" ), null, ["narrative_delivery_to"]);
			}
			var shipPeriodField = dj.byId("ship_period");
			if(shipPeriodField && shipPeriodField.get("value"))
			{
				shipPeriodField.onChange();
			}
		
		},

		beforeSubmitValidations : function() {

			var rcfValidation = true;
			//General validation: validate against LC amount which should be greater than zero
			if(dj.byId("lc_amt"))
			{
				if(!m.validateAmount((dj.byId("lc_amt"))?dj.byId("lc_amt"):0))
				{
					m._config.onSubmitErrorMsg =  m.getLocalization("amountcannotzero");
					dj.byId("lc_amt").set("value", "");
					return false;
				}
			} 
			//calling swift2018 specific javascript
			if(m._config.swift2018Enabled){
				rcfValidation = m._beforeSubmitValidationsSwift2018();
				if(!rcfValidation){
					return rcfValidation;
				}
			}
			
			if(dj.byId("rolling_renewal_flag") && dj.byId("rolling_renewal_nb") && dj.byId("rolling_renewal_flag").get("checked") && d.number.parse(dj.byId("rolling_renewal_nb").get("value")) === 1)
			{
				console.debug("Invalid Number of Rolling renewals");
				dj.byId("rolling_renewal_nb").set("state","Error");
				m._config.onSubmitErrorMsg =  m.getLocalization("invalidNumberOfRollingRenewals");
				// clearing the field as part of MPS-47475
				dj.byId("rolling_renewal_nb").set("value"," ");
				return false;
			}
			var lcAmt = dj.byId("lc_amt");
			var prodStatCode = dj.byId("prod_stat_code");
			var lcAvailAmt = dj.byId("lc_available_amt");
			var lcLiabAmt = dj.byId("lc_liab_amt");
			if(lcAmt && lcAvailAmt && prodStatCode && prodStatCode.get('value')=="03" && (lcAmt.get("value") != lcAvailAmt.get("value")))
			{
				m._config.onSubmitErrorMsg = m.getLocalization("AvailLCAmtNotEqualToTranAmt");
				lcAvailAmt.set("value", "");
				return false;
			}
			else if(lcAmt && lcAvailAmt && (lcAmt.get("value") < lcAvailAmt.get("value")))
			{
				m._config.onSubmitErrorMsg = m.getLocalization("AvailLCamtcanNotMoreThanTranAmt");
				lcAvailAmt.set("value", "");
				return false;
			}
			if(lcAmt && lcLiabAmt && prodStatCode && prodStatCode.get('value')=="03" && (lcAmt.get("value") > lcLiabAmt.get("value")))
			{
				m._config.onSubmitErrorMsg = m.getLocalization("LiabLCAmtcanNotLessThanTranAmt");
				lcLiabAmt.set("value", "");
				return false;
			}
			/*else if(lcAmt && lcLiabAmt && (lcAmt < lcLiabAmt.get("value")))
			{
				m._config.onSubmitErrorMsg = m.getLocalization("LiabLCAmtcanNotMoreThanTranAmt");
				lcLiabAmt.set("value", "");
				return false;
			}*/
			
			//Product specific validations
			var expDate = dj.byId("exp_date");
			var projectedExp = dj.byId("projected_expiry_date");
			var finalExp = dj.byId("final_expiry_date");
			if(projectedExp)
			{
				if(expDate && !m.compareDateFields(expDate, projectedExp))
				{
					m._config.onSubmitErrorMsg = m.getLocalization('projectedExpDateLessThanTransactionExpDtError',[ projectedExp.get("displayedValue"), expDate.get("displayedValue") ]);
					m.showTooltip(m.getLocalization('projectedExpDateLessThanTransactionExpDtError',[ projectedExp.get("displayedValue"), expDate.get("displayedValue") ]), projectedExp.domNode);
					return false;
				}
				else if(finalExp && !m.compareDateFields(projectedExp, finalExp))
				{
					m._config.onSubmitErrorMsg = m.getLocalization('projectedExpDateGreaterThanFinalExpDtError',[ projectedExp.get("displayedValue"), finalExp.get("displayedValue") ]);
					m.showTooltip(m.getLocalization('projectedExpDateGreaterThanFinalExpDtError',[ projectedExp.get("displayedValue"), finalExp.get("displayedValue") ]), projectedExp.domNode);
					return false;
				}
			}
			if(finalExp)
			{
				if(expDate && !m.compareDateFields(expDate, finalExp))
				{
					m._config.onSubmitErrorMsg = m.getLocalization('finalExpDateLessThanTransactionExpDtError',[ finalExp.get("displayedValue"), expDate.get("displayedValue") ]);
					m.showTooltip(m.getLocalization('finalExpDateLessThanTransactionExpDtError',[ finalExp.get("displayedValue"), expDate.get("displayedValue") ]), finalExp.domNode);
					return false;
				}
				else if(projectedExp && !m.compareDateFields(projectedExp, finalExp))
				{
					m._config.onSubmitErrorMsg = m.getLocalization('finalExpDateLessThanProjectedExpDtError',[ finalExp.get("displayedValue"), projectedExp.get("displayedValue") ]);
					m.showTooltip(m.getLocalization('finalExpDateLessThanProjectedExpDtError',[ finalExp.get("displayedValue"), projectedExp.get("displayedValue") ]), finalExp.domNode);
					return false;
				}
			}
			if(dj.byId("lc_amt") && dj.byId("lc_available_amt") && (dj.byId("lc_amt").get("value") < dj.byId("lc_available_amt").get("value")))
			{
				m._config.onSubmitErrorMsg = m.getLocalization("AvailLCamtcanNotMoreThanTranAmt");
				dj.byId("lc_available_amt").set("value", "");
				console.debug("Invalid Available Amount.");
				return false;
			}
			//Validate the length of bank name and all the address fields length not to exceed 1024
			if(!(m.validateLength(["beneficiary","applicant","issuing_bank","credit_available_with_bank","drawee"])))
			{
				return false;
			}
			return true;
		}
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.bank.report_sr_client');