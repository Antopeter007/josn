dojo.provide("misys.binding.bank.report_br");

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
dojo.require("misys.editor.plugins.ProductFieldChoice");
dojo.require("dojo.data.ItemFileReadStore");
dojo.require("dijit.layout.TabContainer");
dojo.require("dijit.form.DateTextBox");
dojo.require("dijit.form.FilteringSelect");
dojo.require("misys.form.addons");
dojo.require("misys.form.SimpleTextarea");
dojo.require("dijit.Editor");
dojo.require("dijit._editor.plugins.FontChoice");
dojo.require("dojox.editor.plugins.ToolbarLineBreak");
dojo.require("misys.widget.Collaboration");
dojo.require("misys.binding.trade.ls_common");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode
	var _deleteGridRecord = "deletegridrecord";
	m._config = m._config || {};
    m._config.bgCurCode = m._config.bgCurCode || {};
    m._config.beneficiary = m._config.beneficiary || {	entity : "",
    													name : "",
    													abbvName : "",
														addressLine1 : "",
														addressLine2 : "",
														dom : ""
													  };
    m._config.expDate = m._config.expDate || {};
    m._config.renewFlag = m._config.renewFlag || {};
    m._config.bgTypeCode = m._config.bgTypeCode || {};
	
	    d.mixin(m._config, {
		/*
		 * Overriding to add license items in the xml. 
		 */
			xmlTransform : function (/*String*/ xml) {
			var tdXMLStart = "<br_tnx_record>";
			/*
			 * Add license items tags, only in case of BR transaction.
			 * Else pass the input xml, without modification. (Ex : for create beneficiary from popup.)
			 */
			if(xml.indexOf(tdXMLStart) != -1){
				// Setup the root of the XML string
				var xmlRoot = m._config.xmlTagName,
				transformedXml = xmlRoot ? ["<", xmlRoot, ">"] : [],			
						tdXMLEnd   = "</br_tnx_record>",
						subTDXML	= "",
						selectedIndex = -1;
				subTDXML = xml.substring(tdXMLStart.length,(xml.length-tdXMLEnd.length));
				transformedXml.push(subTDXML);
				if(dj.byId("gridLicense") && dj.byId("gridLicense").store && dj.byId("gridLicense").store !== null && dj.byId("gridLicense").store._arrayOfAllItems.length >0) {
					transformedXml.push("<linked_licenses>");
					dj.byId("gridLicense").store.fetch({
						query: {REFERENCEID: '*'},
						onComplete: dojo.hitch(dj.byId("gridLicense"), function(items, request){
							dojo.forEach(items, function(item){
								transformedXml.push("<license>");
								transformedXml.push("<ls_ref_id>",item.REFERENCEID,"</ls_ref_id>");
								transformedXml.push("<bo_ref_id>",item.BO_REF_ID,"</bo_ref_id>");
								transformedXml.push("<ls_number>",item.LS_NUMBER,"</ls_number>");
								transformedXml.push("<ls_allocated_amt>",item.LS_ALLOCATED_AMT,"</ls_allocated_amt>");
								transformedXml.push("<ls_amt>",item.LS_AMT,"</ls_amt>");
								transformedXml.push("<ls_os_amt>",item.LS_OS_AMT,"</ls_os_amt>");
								transformedXml.push("<converted_os_amt>",item.CONVERTED_OS_AMT,"</converted_os_amt>");
								transformedXml.push("<allow_overdraw>",item.ALLOW_OVERDRAW,"</allow_overdraw>");
								transformedXml.push("</license>");
							});
						})
					});
					transformedXml.push("</linked_licenses>");
				}
				if(xmlRoot) {
					transformedXml.push("</", xmlRoot, ">");
				}
				return transformedXml.join("");
			}else{
				return xml;
			}

		}
});
	// Private functions and variables go here

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
			m.setValidation("iss_date", m.validateMOProdIssueDate);
			m.setValidation("amd_date", m.validateAmendmentDate);
			m.setValidation("exp_date", m.validateBankExpiryDate);
			m.setValidation("bg_cur_code", m.validateCurrency);
			m.setValidation("contract_cur_code", m.validateCurrency);
			m.setValidation("renew_for_nb", m.validateRenewFor);
			m.setValidation("advise_renewal_days_nb", m.validateDaysNotice);
			m.setValidation("rolling_renewal_nb", m.validateNumberOfRenewals);
			m.setValidation("rolling_cancellation_days", m.validateCancellationNotice);
			m.setValidation("renewal_calendar_date",m.validateRenewalCalendarDate);
			m.setValidation('applicant_country', m.validateCountry);
			m.setValidation('beneficiary_country', m.validateCountry);
			m.setValidation('alt_applicant_country', m.validateCountry);
			m.connect("prod_stat_code", "onChange", m.validateOutstandingAmount);
			m.setValidation("contract_date", m.validateContractDate);
			m.setValidation("tender_expiry_date", m.validateTenderExpiryDate);
			m.setValidation("contract_pct", m.checkContractPercent);
			// Making outstanding amount as non editable in case of Not Processed,Cancelled,Purged
			m.connect("prod_stat_code","onChange",function(){
				var prodStatCodeValue = dj.byId("prod_stat_code").get('value'),liabAmt = dj.byId("bg_liab_amt");
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
			m.connect("contract_ref","onChange", function(){
				var dojoTenderExpDate = d.byId("tender-exp-date");
				var dijitTenderExpDate = dj.byId("tender_expiry_date");
				
				if(this.get("value")==="TEND")
				{
					m.animate("fadeIn", dojoTenderExpDate);
				}
				else
				{
					if (dijitTenderExpDate)
					{
						dijitTenderExpDate.set("value", null);
					}
					m.animate("fadeOut", dojoTenderExpDate);
				}
				
			});
			
			//Validate Hyphen, allowed no of lines validation on the back-office comment
			m.setValidation("bo_comment", m.bofunction);
			
			//validation to check row count doesn't exceed the maximum rows
			var fields = ["narrative_additional_instructions"];
			d.forEach(fields, function(id){
				var field= dj.byId(id);
				if(field) {
					field.onBlur(field);
				}
			});
			
			m.connect("bg_cur_code", "onChange", function(){
				m.setCurrency(this, ["bg_amt"]);
				m.setCurrency(this, ["bg_available_amt", "bg_liab_amt"]);
			});
			
			// validation on available amt
			m.connect("bg_available_amt", "onBlur", function(){
				if(dj.byId("bg_amt") && (dj.byId("bg_amt").get("value") < dj.byId("bg_available_amt").get("value")))
				{
					var callback = function() {
						var widget = dijit.byId("bg_available_amt");
						widget.focus();
					 	widget.set("state","Error");
					};
					m.dialog.show("ERROR", m.getLocalization("AvailBGamtcanNotMoreThanTranAmt"), '', function(){
							setTimeout(callback, 500);
						});
				}
			});
			m.connect("bg_amt", "onBlur", function(){
				m.setTnxAmt(this.get("value"));
			});
			m.connect("bg_liab_amt", "onBlur", function(){
				if(dj.byId("bg_amt") && (dj.byId("bg_amt").get("value") < dj.byId("bg_liab_amt").get("value")))
				{
					var callback = function() {
						var widget = dijit.byId("bg_liab_amt");
					 	widget.set("state","Error");
					};
					m.dialog.show("ERROR", m.getLocalization("BRLiabilityAmountCanNotBeGreaterThanBRTotalAmount"), '', function(){
							setTimeout(callback, 0);
						});
				}
			});
			m.connect("iss_date_type_code", "onChange", function(){
				m.toggleFields((this.get("value") == "99"), null, [
						"iss_date_type_details"]);
			});
			m.connect("exp_date_type_code", "onChange", function(){
				m.toggleFields((this.get("value") != "01"), null, [
						"exp_date"]);
			});
			m.connect("issuing_bank_type_code", "onChange", function(){
				m.toggleFields((this.get("value") == "02"), [
						"issuing_bank_address_line_2", "issuing_bank_dom"], [
						"issuing_bank_name", "issuing_bank_address_line_1"]);
			});
			m.connect("bg_type_code", "onChange", function(){
				m.toggleFields((this.get("value") == "99"), null, [
						"bg_type_details"]);
			});
			m.connect("bg_text_type_code", "onChange", m.toggleGuaranteeText);
			m.connect("text_language", "onChange", function(){
				m.toggleFields((this.get("value") == "*"), null, [
						"text_language_other"]);
			});
			m.connect("contract_cur_code", "onChange", function(){
				m.setCurrency(this, ["contract_amt"]);
			});
			
			m.connect("renew_on_code","onChange",m.validateRenewalCalendarDate);
			
			m.connect("renew_flag", "onClick", m.toggleRenewalDetails);
			m.connect("renew_flag", "onClick", function(){
				if(!this.get("checked"))
				{
					dj.byId("rolling_renewal_nb").set("value", "");
				}
				else if(!dj.byId("rolling_renewal_flag").get("checked"))
				{
					dj.byId("rolling_renewal_nb").set("value", m.getLocalization("default_rewnewalNumber"));
				}
			});
			m.connect("advise_renewal_flag", "onClick", function(){
				m.toggleFields(this.get("checked"), null, [
						"advise_renewal_days_nb"]);
			});
			m.connect("advise_renewal_flag", "onChange", function(){
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
					if(dj.byId("renew_flag").get("checked"))
					{
						dj.byId("rolling_renewal_nb").set("value", m.getLocalization("default_rewnewalNumber"));
					}
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
					if(dj.byId("renew_flag").get("checked"))
					{
						dj.byId("rolling_renewal_nb").set("value", m.getLocalization("default_rewnewalNumber"));
					}
				}
			});
			m.connect("rolling_renewal_nb", "onBlur", function(){
				if(dj.byId("rolling_renewal_flag").get("checked") && d.number.parse(this.get("value")) === 1)
				{
					console.debug("Invalid Number of Rolling renewals");
					m.showTooltip(m.getLocalization("invalidNumberOfRollingRenewals"),
							this.domNode, ["after"]);
					this.state = "Error";
					this._setStateClass();
					dj.setWaiState(this.focusNode, "invalid", "true");
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
					setTimeout(hideTT, 10000);
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
					setTimeout(hideTT, 10000);
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
			m.connect("renew_on_code", "onChange", function(){
				m.toggleFields(
						this.get("value") === "02", 
						null,
						["renewal_calendar_date"]);
				//dj.byId("final_expiry_date").validate();
			});
			
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
					setTimeout(hideTT, 10000);
				}
				else if(finalExp && !m.compareDateFields(this, finalExp))
				{
					this.set("value",null);
					dj.showTooltip(m.getLocalization('projectedExpDateGreaterThanFinalExpDtError',[ projectedExpDtVal, finalExp.get("displayedValue") ]), dj.byId("projected_expiry_date").domNode, 0);
					setTimeout(hideTT, 10000);
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
					setTimeout(hideTT, 10000);
				}
				else if(projectedExp && !m.compareDateFields(projectedExp, this))
				{
					this.set("value",null);
					dj.showTooltip(m.getLocalization('finalExpDateLessThanProjectedExpDtError',[ finalExpDtVal, projectedExp.get("displayedValue") ]), dj.byId("final_expiry_date").domNode, 0);
					setTimeout(hideTT, 10000);
				}
			});
			
			m.connect("prod_stat_code", "onChange", m.toggleProdStatCodeFields);
			m.connect("prod_stat_code", "onChange", function(){
				var value = this.get("value");
				m.toggleFields(value && value !== "01" && value !== "18", null,
									["iss_date", "bo_ref_id"]);
			if(value === "05" || value === "13" || value === "15"|| value === "14" || value === "04")
				{
					m.toggleRequired("maturity_date", true);
				}
				else {
					m.toggleRequired("maturity_date", false);
				}						
			});
			//Enable doc_ref_no in case of  Request for settlement and Notification of charges
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
				if (m._config.enable_to_edit_customer_details_bank_side == "false" && dj.byId("prod_stat_code")	&& dj.byId("prod_stat_code").get('value') !== '' && dj.byId("bg_liab_amt") && dj.byId("tnx_type_code")	&& dj.byId("tnx_type_code").get("value") !== '15' && dj.byId("tnx_type_code").get("value") !== '13')
				{
					m.toggleRequired("bg_liab_amt", false);
				}
			});
			m.connect("contract_cur_code", "onBlur",
					function(){
					            if(dj.byId("contract_cur_code").get("value")!=="" || !isNaN(dj.byId("contract_amt").get("value")))
					            {
					                 m.toggleRequired("contract_amt", true);
					                 m.toggleRequired("contract_cur_code", true);
					            }
					            else
					            {
					                 m.toggleRequired("contract_amt", false);
					                 m.toggleRequired("contract_cur_code", false);
					            }
					          });
			m.connect("contract_amt", "onBlur",
			         function(){
			                       if(dj.byId("contract_cur_code").get("value")!=="" || !isNaN(dj.byId("contract_amt").get("value")))
			                       {
					                    m.toggleRequired("contract_amt", true);
					                    m.toggleRequired("contract_cur_code", true);
					               }
					               else
					               {
					                    m.toggleRequired("contract_amt", false);
					                    m.toggleRequired("contract_cur_code", false);
					               }
					            });
			m.connect("license_lookup","onClick", function(){
				m.getLicenses("br");
			});
			
			m.connect("bg_cur_code", "onChange", function(){
				m.clearLicenseGrid(this, m._config.bgCurCode,"bg");
			});
			
			m.connect("entity", "onChange", function(){
				m.clearLicenseGrid(this, m._config.beneficiary,"br");
			});
			
			m.connect("beneficiary_name", "onChange", function(){
				m.clearLicenseGrid(this, m._config.beneficiary,"br");
			});
			
			m.connect("exp_date", "onChange", function(){
				m.clearLicenseGrid(this, m._config.expDate,"br");
			});
			
			 m.connect("renew_flag", "onClick", function(){
				 m.clearLicenseGrid(this, m._config.renewFlag);
	 	 	 });
			 
			 m.connect("bg_type_code", "onChange", function(){
					m.clearLicenseGrid(this, m._config.bgTypeCode);
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
			m.setCurrency(dj.byId("bg_cur_code"), ["tnx_amt", "bg_amt", "bg_liab_amt","bg_available_amt"]);
			if(dj.byId("bg_cur_code")){
				m.setCurrency(dj.byId("bg_cur_code"), ["bg_available_amt","bg_liab_amt"]);
			}
			
			m.setCurrency(dj.byId("contract_cur_code"), ["contract_amt"]); 

			m._config.bgCurCode = dj.byId("bg_cur_code") ? dj.byId("bg_cur_code").get("value") : "";
			m._config.beneficiary.entity = dj.byId("entity") ? dj.byId("entity").get("value") : "";
			m._config.beneficiary.abbvName = dj.byId("beneficiary_abbv_name") ? dj.byId("beneficiary_abbv_name").get("value") : "";
			m._config.beneficiary.name = dj.byId("beneficiary_name") ? dj.byId("beneficiary_name").get("value") : "";
			m._config.beneficiary.addressLine1 = dj.byId("beneficiary_address_line_1") ? dj.byId("beneficiary_address_line_1").get("value") : "";
			m._config.beneficiary.addressLine2 = dj.byId("beneficiary_address_line_2") ? dj.byId("beneficiary_address_line_2").get("value") : "";
			m._config.beneficiary.dom = dj.byId("beneficiary_dom") ? dj.byId("beneficiary_dom").get("value") : "";
			m._config.expDate = dj.byId("exp_date") ? dj.byId("exp_date").get("displayedValue") : "";
			m._config.renewFlag = dj.byId("renew_flag") ? dj.byId("renew_flag").get("checked") : "";
			m._config.bgTypeCode = dj.byId("bg_type_code") ? dj.byId("bg_type_code").get("value") : "";
			
			
			var dojoTenderExpDate = d.byId("tender-exp-date");
			var dijitTenderExpDate = dj.byId("tender_expiry_date");
			var contractRef = dj.byId("contract_ref");
			
			if(contractRef && contractRef.get("value")==="TEND")
			{
				m.animate("fadeIn", dojoTenderExpDate);
			}
			else if(contractRef)
			{
				if(dijitTenderExpDate){
					dijitTenderExpDate.set("value", null);
				}
				m.animate("fadeOut", dojoTenderExpDate);
			}
			
			var issDateTypeCode = dj.byId("iss_date_type_code");
			if(issDateTypeCode) 
			{
				m.toggleFields(
						(issDateTypeCode.get("value") == "99"), null,
						["iss_date_type_details"]);
			}

			var expDateTypeCode = dj.byId("exp_date_type_code");
			if(expDateTypeCode) 
			{
				m.toggleFields(
						(expDateTypeCode.get("value") != "01"), null,
						["exp_date"]);
			}

			var issuingBankTypeCode = dj.byId("issuing_bank_type_code");
			if(issuingBankTypeCode) 
			{
				m.toggleFields(
						(issuingBankTypeCode.get("value") == "02"),
						["issuing_bank_address_line_2", "issuing_bank_dom"],
						["issuing_bank_name", "issuing_bank_address_line_1"]);
			}

			var bgTypeCode = dj.byId("bg_type_code");
			if(bgTypeCode) 
			{
				m.toggleFields((bgTypeCode.get("value") == "99"),
						null, ["bg_type_details"]);
			}

			var textLanguage = dj.byId("text_language");
			if(textLanguage) 
			{
				m.toggleFields((textLanguage.get("value") == "*"),
						null, ["text_language_other"]);
			}

			var bgTextTypeCode = dj.byId("bg_text_type_code");
			if(bgTextTypeCode)
			{
				bgTextTypeCode.onChange(bgTextTypeCode.get("value"));
			}
			var prodStatCode = dj.byId("prod_stat_code"),liabAmt = dj.byId("bg_liab_amt") ;
			//maturity date mandatory
			if(prodStatCode.get("value") === "05" || prodStatCode.get("value") === "13" || prodStatCode.get("value") === "15"|| prodStatCode.get("value") === "14" || prodStatCode.get("value") === "04"){
				m.toggleRequired("maturity_date", true);
			}
			if(liabAmt && prodStatCode && (prodStatCode.get('value') === '01' || prodStatCode.get('value') === '10' || prodStatCode.get('value') === '06')){
				liabAmt.set("readOnly", true);
				liabAmt.set("disabled", true);
			}
			else if(liabAmt)
			{
				liabAmt.set("readOnly", false);
				liabAmt.set("disabled", false);
			}
			
			//Enable doc_ref_no in case of  Request for settlement and Notification of charges
			var prodStatCodeValue = dj.byId("prod_stat_code");
			if(dj.byId("doc_ref_no") && prodStatCode && (prodStatCode.get('value')=== '16' || prodStatCode.get('value') === '24'))
			{
				dj.byId("doc_ref_no").set("disabled", false);
			}
			else if(dj.byId("doc_ref_no"))
			{
				dj.byId("doc_ref_no").set("disabled", true);
			}
			
			var renewFlag = dj.byId("renew_flag");
			if(renewFlag) {
			 d.hitch(renewFlag, m.toggleRenewalDetails, true)();
			 m.toggleFields(
						(dj.byId("renew_on_code").get("value") === "02"), 
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
			
			var renewOnCode = dj.byId("renew_on_code");
			if(renewOnCode) {
				m.toggleFields(
						renewOnCode.get("value") === "02", 
						null, ["renewal_calendar_date"], true);
			}
			var adviseRenewalFlag = dj.byId("advise_renewal_flag");
			if(adviseRenewalFlag) {
				m.toggleFields(adviseRenewalFlag.get("checked"), null,
						["advise_renewal_days_nb"], true);
			}
			m.populateGridOnLoad("bg");
			if (dj.byId("tnx_type_code") && (dj.byId("tnx_type_code").get("value") === '15' || (dj.byId("tnx_type_code").get("value") === '13')) && (m._config.enable_to_edit_customer_details_bank_side == "false"))
			{
				dojo.style('transactionDetails', "display", "none");
			} else
			{
				if (m._config.enable_to_edit_customer_details_bank_side == "false" && dojo.byId("release_dttm_view_row"))
				{
					dojo.style('transactionDetails', "display", "none");
					
					var transactionids = [ "bg_liab_amt"];
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
		 * <h4>Summary:</h4>  Before submit validation method.
		 * <h4>Description</h4> : This method is called before submitting a transaction.
		 * Any before submit validation can be added in this method for Banker Guarantee Received. 
		 *
		 * @method beforeSubmitValidations
		 */
		beforeSubmitValidations : function() {
			//validate transfer amount should be greater than zero
			if(dj.byId("bg_amt"))
			{
				if(!m.validateAmount((dj.byId("bg_amt"))?dj.byId("bg_amt"):0))
				{
					m._config.onSubmitErrorMsg =  m.getLocalization("amountcannotzero");
					dj.byId("bg_amt").set("value", "");
					return false;
				}
			}
			if(dj.byId("bg_amt") && dj.byId("bg_available_amt") && (dj.byId("bg_amt").get("value") < dj.byId("bg_available_amt").get("value")))
			{
				m._config.onSubmitErrorMsg = m.getLocalization("AvailBGamtcanNotMoreThanTranAmt");
				dj.byId("bg_available_amt").set("value", "");
				console.debug("Invalid Available Amount.");
				return false;
			}
			if(dj.byId("rolling_renewal_flag") && dj.byId("rolling_renewal_nb") && dj.byId("rolling_renewal_flag").get("checked") && d.number.parse(dj.byId("rolling_renewal_nb").get("value")) === 1)
			{
				console.debug("Invalid Number of Rolling renewals");
				m._config.onSubmitErrorMsg =  m.getLocalization("invalidNumberOfRollingRenewals");
				dj.byId("rolling_renewal_nb").focus();
				return false;
			}
			if(dj.byId("bg_amt") && dj.byId("bg_liab_amt") && (dj.byId("bg_amt").get("value") < dj.byId("bg_liab_amt").get("value")))
			{
				m._config.onSubmitErrorMsg = m.getLocalization("BRLiabilityAmountCanNotBeGreaterThanBRTotalAmount");
				dj.byId("bg_liab_amt").set("value", "");
				console.debug("Invalid Outstanding Amount.");
				return false;
			}
			
			//Validate the length of bank name and all the address fields length not to exceed 1024
			if(!(m.validateLength(["beneficiary","applicant","advising_bank","issuing_bank","confirming_bank"])))
    		{
    			return false;
    		}
			
			return m.validateLSAmtSumAgainstTnxAmt("bg");
		}
		
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require("misys.client.binding.bank.report_br_client");