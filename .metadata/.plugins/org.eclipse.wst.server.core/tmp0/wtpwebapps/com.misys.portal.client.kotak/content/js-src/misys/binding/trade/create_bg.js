dojo.provide("misys.binding.trade.create_bg");

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
dojo.require("misys.editor.plugins.ProductFieldChoice");
dojo.require("dojo.data.ItemFileReadStore");
dojo.require("dijit.layout.TabContainer");
dojo.require("dijit.form.DateTextBox");
dojo.require("misys.form.CurrencyTextBox");
dojo.require("dijit.form.FilteringSelect");
dojo.require("misys.form.SimpleTextarea");
dojo.require("dijit.Editor");
dojo.require("dijit._editor.plugins.FontChoice");
dojo.require("dojox.editor.plugins.ToolbarLineBreak");
dojo.require("misys.widget.Collaboration");
dojo.require("misys.form.static_document");
dojo.require("misys.binding.trade.ls_common");


(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {
	
	function _clearPrincipalFeeAcc(){
		dj.byId("principal_act_no").set("value", "");
		dj.byId("fee_act_no").set("value", "");	
	}
	
	"use strict"; // ECMA5 Strict Mode
	
	var requiredPrefix = m._config.requiredFieldPrefix || "*"; 
	
	// dojo.subscribe once a record is deleted from the grid
	var _deleteGridRecord = "deletegridrecord", removedBanks = [];
	m._config = m._config || {};
    m._config.bgCurCode = m._config.bgCurCode || {};
    m._config.applicant = m._config.applicant || {	entity : "",
													name : "",
													addressLine1 : "",
													addressLine2 : "",
													dom : ""
												  };
    m._config.beneficiary = m._config.beneficiary || {	name : "",
														addressLine1 : "",
														addressLine2 : "",
														dom : ""
													  };
    m._config.expDate = m._config.expDate || {};
    m._config.renewFlag = m._config.renewFlag || {};
    m._config.bgTypeCode = m._config.bgTypeCode || {};
    
    function bgTextTypeChange()
    {
    	
    	if( (dj.byId("bg_text_type_code").get("value") == "02" || dj.byId("bg_text_type_code").get("value") == "04"))
    	{
    		dj.byId("narrative_additional_instructions").set("value", "NOT APPLICABLE");
    		dj.byId("narrative_additional_instructions").set("disabled", true);
    		dj.byId("narrative_additional_instructions_img").set("disabled", true);
    	}
    	else
    	{
    	if(dj.byId("narrative_additional_instructions").get("disabled"))
    		{
    		dj.byId("narrative_additional_instructions").set("value", "");
    		dj.byId("narrative_additional_instructions").set("disabled", false);
    		dj.byId("narrative_additional_instructions_img").set("disabled", false);
    		m.toggleRequired("narrative_additional_instructions", true);
    		}
    	
    	}
    	
    }
    
	d.mixin(m._config, {

		initReAuthParams : function() {
									
			var reAuthParams = {
				productCode : "BG",	
				subProductCode : "",
				transactionTypeCode : "01",	
				entity : dj.byId("entity") ? dj.byId("entity").get("value") : "",
				currency : dj.byId("bg_cur_code")? dj.byId("bg_cur_code").get("value") : "",				
				amount : dj.byId("bg_amt")? m.trimAmount(dj.byId("bg_amt").get("value")) : "",
				bankAbbvName : dj.byId("recipient_bank_abbv_name") ? dj.byId("recipient_bank_abbv_name").get("value") : "", 		
								
				es_field1 : "",
				es_field2 : ""				
			};
			return reAuthParams;
		},
		/*
		 * Overriding to add license items in the xml. 
		 */
		xmlTransform : function (/*String*/ xml) {
			var tdXMLStart = "<bg_tnx_record>";
			/*
			 * Add license items tags, only in case of LC transaction.
			 * Else pass the input xml, without modification. (Ex : for create beneficiary from popup.)
			 */
			if(xml.indexOf(tdXMLStart) != -1){
				// Setup the root of the XML string
				var xmlRoot = m._config.xmlTagName,
				transformedXml = xmlRoot ? ["<", xmlRoot, ">"] : [],			
						tdXMLEnd   = "</bg_tnx_record>",
						subTDXML	= "",
						selectedIndex = -1;
				subTDXML = xml.substring(tdXMLStart.length,(xml.length-tdXMLEnd.length));
				transformedXml.push(subTDXML);
				if(dj.byId("gridLicense") && dj.byId("gridLicense").store && dj.byId("gridLicense").store !== null && dj.byId("gridLicense").store._arrayOfAllItems.length >0) {
					transformedXml.push("<linked_licenses>");
					dj.byId("gridLicense").store.fetch({
						query: {REFERENCEID: "*"},
						onComplete: dojo.hitch(dj.byId("gridLicense"), function(items, request){
							dojo.forEach(items, function(item){
								transformedXml.push("<license>");
								transformedXml.push("<ls_ref_id>",item.REFERENCEID,"</ls_ref_id>");
								transformedXml.push("<bo_ref_id>",item.BO_REF_ID,"</bo_ref_id>");
								transformedXml.push("<ls_number>",item.LS_NUMBER,"</ls_number>");
								transformedXml.push("<ls_allocated_amt>",item.LS_ALLOCATED_AMT,"</ls_allocated_amt>");
								/*transformedXml.push("<ls_allocated_add_amt>",item.LS_ALLOCATED_ADD_AMT,"</ls_allocated_add_amt>");*/
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
				if(dj.byId("lead_bank_flag") && !dj.byId("lead_bank_flag").get("checked"))
				{
					transformedXml.push("<processing_bank_name></processing_bank_name>");
					transformedXml.push("<processing_bank_address_line_1></processing_bank_address_line_1>");
					transformedXml.push("<processing_bank_address_line_2></processing_bank_address_line_2>");
					transformedXml.push("<processing_bank_dom></processing_bank_dom>");
					transformedXml.push("<processing_bank_reference></processing_bank_reference>");
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
		
	
	d.mixin(m, {
		bind : function() {
			m.setValidation("template_id", m.validateTemplateId);
			m.setValidation("exp_date", m.validateTradeExpiryDate);
			m.setValidation("tender_expiry_date", m.validateTenderExpiryDate);
			m.setValidation("contract_date", m.validateContractDate);
			m.setValidation("bg_cur_code", m.validateCurrency);
			m.setValidation("contract_cur_code", m.validateCurrency);
			m.setValidation("applicant_country", m.validateCountry);
			m.setValidation("beneficiary_country", m.validateCountry);
			m.setValidation("alt_applicant_country", m.validateCountry);
			m.setValidation("contact_country", m.validateCountry);
			m.setValidation("net_exposure_cur_code", m.validateCurrency);
			m.setValidation("contract_pct", m.checkContractPercent);
			m.setValidation("renew_for_nb", m.validateRenewFor);
			m.setValidation("advise_renewal_days_nb", m.validateDaysNotice);
			m.setValidation("rolling_renewal_nb", m.validateNumberOfRenewals);
			m.setValidation("rolling_cancellation_days", m.validateCancellationNotice);
		//	m.setValidation("final_expiry_date", m.validateTradeFinalExpiryDate);
			m.setValidation("renewal_calendar_date",m.validateRenewalCalendarDate);
			m.setValidation("final_expiry_date",m.validateFinalExpiryDate);
			
			m.setValidation("iss_date_type_details",m.validateEffectiveIssueDate);
			
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
					dj.showTooltip(m.getLocalization("finalExpDateLessThanTransactionExpDtError",[ finalExpDtVal, expDate.get("displayedValue") ]), dj.byId("final_expiry_date").domNode, 0);
					setTimeout(hideTT, 10000);
				}
				else if(projectedExp && !m.compareDateFields(projectedExp, this))
				{
					this.set("value",null);
					dj.showTooltip(m.getLocalization("finalExpDateLessThanProjectedExpDtError",[ finalExpDtVal, projectedExp.get("displayedValue") ]), dj.byId("final_expiry_date").domNode, 0);
					setTimeout(hideTT, 10000);
				}
			});
		

			m.connect("iss_date_type_code", "onChange", function(){
				m.toggleFields((this.get("value") === "99"), null, ["iss_date_type_details"]);
			});
			m.connect("exp_date_type_code", "onChange", function(){
				m.toggleFields((this.get("value") !== "01"), null, ["exp_date"]);
				m.toggleFields((this.get("value") !== "02"), null, ["exp_event"]);
				if(this.get("value") === "01" && dj.byId("renew_flag")) {
					//If renewal flag is checked, then renewal section needs to be disabled.
					dj.byId("renew_flag").set("checked", false);
					dj.byId("renew_flag").set("disabled", true);
				}else if(dj.byId("renew_flag")) {					
					dj.byId("renew_flag").set("disabled", false);
					//If renewal flag is checked, then renewal section needs to be enabled.
					dj.byId("renew_flag").set("checked", false);

				}
			});
			m.connect("reduction_authorised", "onChange", function(){
				m.toggleFields((this.get("value") === "on"), null, ["reduction_clause"]);
			});
			m.connect("reduction_clause", "onChange", function(){
				m.toggleFields((this.get("value") === "03"), null, ["reduction_clause_other"]);
			});
			m.connect("for_account", "onChange", function(){
				m.toggleFields((this.get("value") === "on"), 
						["alt_applicant_address_line_2", "alt_applicant_dom", "alt_applicant_address_line_4"],
						["alt_applicant_name", "alt_applicant_address_line_1", "alt_applicant_country"]);
			});
			m.connect("consortium", "onChange", function(){
				m.toggleFields((this.get("value") === "on"),null,["net_exposure_cur_code", "net_exposure_amt", "consortium_details"],true,true);	
				
				var consortium = dj.byId("consortium");
				var consortiumDetails = dj.byId("consortium_details");
					
				if (consortium.get("value") !== "on")
				{
					dj.byId("net_exposure_cur_code").set("value", "");
					dj.byId("net_exposure_amt").set("value", "");
					consortiumDetails.set("value", "");
					consortiumDetails.set("disabled", true);
				}
				else
				{
					consortiumDetails.set("disabled", false);
				}
				
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
				m.toggleFields(this.get("checked"),["final_expiry_date"], [
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
					dj.showTooltip(m.getLocalization("dayInMonthNotApplicableForDaysError"), dj.byId("rolling_day_in_month").domNode, 0);
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
					dj.showTooltip(m.getLocalization("dayInMonthNotApplicableForDaysError"), dj.byId("rolling_renew_for_period").domNode, 0);
					var hideTT = function() {
						dj.hideTooltip(dj.byId("rolling_day_in_month").domNode);
					};
					setTimeout(hideTT, 1500);
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
			
			var rollingFlag = dj.byId("rolling_renewal_flag");
			if(rollingFlag) {
				m.toggleFields(rollingFlag.get("checked"),
						["final_expiry_date"], ["rolling_renewal_nb", "rolling_cancellation_days", "rolling_renew_on_code"], true);
			}
			
			var rollingRenewOnCode = dj.byId("rolling_renew_on_code");
			if(rollingRenewOnCode) {
				m.toggleFields(rollingRenewOnCode.get("value") === "03",
						["rolling_day_in_month"], ["rolling_renew_for_nb"], true);
			}
			
			m.connect("issuing_bank_type_code", "onChange", function(){
				m.toggleFields((this.get("value") === "02"), [
						"issuing_bank_address_line_2", "issuing_bank_dom", "issuing_bank_address_line_4"], [
						"issuing_bank_name", "issuing_bank_address_line_1"]);
				if(this.get("value") === "01") {
					m.animate("fadeOut", d.byId("issuing_bank_name_img"));
				}
				else if(this.get("value") === "02") {
					m.animate("fadeIn", d.byId("issuing_bank_name_img"));
				}
			});
			m.connect("bg_type_code", "onChange", m.toggleGuaranteeType);
			m.connect("bg_type_code", "onChange", function(){
				var _provisionalDiv = d.byId("pro-check-box");
				if(m._config.provisionalProductTypes[this.get("value")])
					{
						dj.byId("provisional_status").set("checked", true);
						m.animate("fadeIn", _provisionalDiv);
					}
				else
					{
						dj.byId("provisional_status").set("checked", false);
						m.animate("fadeOut", _provisionalDiv);
					}
			});
			
			m.connect("contract_ref","onChange", function(){
				var tender_exp_date = d.byId("tender-exp-date");
				
				if(this.get("value")==="TEND")
				{
					m.animate("fadeIn", tender_exp_date);
				}
				else
				{
					dj.byId("tender_expiry_date").set("value", null);
					m.animate("fadeOut", tender_exp_date);
				}
				
			});
			m.connect("bg_text_type_code", "onChange", function(){
				m.toggleFields((this.get("value") === "03"), null, ["bg_text_type_details"]);
				bgTextTypeChange();
			});
			m.connect("delivery_to", "onChange", function(){
				m.toggleFields((this.get("value") === "04"), null, ["delivery_to_other"]);
			});
			m.connect("text_language", "onChange", function(){
				m.toggleFields((this.get("value") === "*"), null, ["text_language_other"]);
			});
			m.connect("bg_rule", "onChange", function(){
				m.toggleFields((this.get("value") === "99"), null, ["bg_rule_other"]);
			});
			m.connect("bg_cur_code", "onChange",
					function(){
						m.setCurrency(this, ["bg_amt"]);
			});
			m.connect("contract_cur_code", "onChange",
					function(){
						m.setCurrency(this, ["contract_amt"]);
			});
			m.connect("net_exposure_cur_code", "onChange",
					function(){
						m.setCurrency(this, ["net_exposure_amt"]);
			});
			
			m.connect("bg_amt", "onBlur", function(){
				m.setTnxAmt(this.get("value"));
			});
			m.connect("recipient_bank_abbv_name", "onChange", m.populateReferences);
			m.connect("recipient_bank_abbv_name", "onChange",m.updateBusinessDate);
			m.connect("recipient_bank_abbv_name", "onClick", m.selectEntityBeforeBank);
			//making confirming bank mandatory only when the confirmation req checkbox is checked
			m.connect("adv_bank_conf_req", "onClick", function(){
					m.toggleFields(
							this.get("checked") === true,
							["confirming_bank_address_line_2", "confirming_bank_dom", "confirming_bank_address_line_4"],
							["confirming_bank_name", "confirming_bank_address_line_1"]);
					var title= d.byId("dijit_layout_TabContainer_0_tablist_dijit_layout_ContentPane_2").innerHTML;
					if(this.get("checked") === true)
					{
						m.animate("fadeIn", d.byId("confirming_bank_name_img"));
						d.byId("dijit_layout_TabContainer_0_tablist_dijit_layout_ContentPane_2").innerHTML= requiredPrefix + title;
					}
					else
					{
						m.animate("fadeOut", d.byId("confirming_bank_name_img"));
						d.byId("dijit_layout_TabContainer_0_tablist_dijit_layout_ContentPane_2").innerHTML = title.replace(requiredPrefix,'');
					}
			});
			
			m.connect("entity", "onChange", function(){
				var recipientBankAbbvName = dj.byId("recipient_bank_abbv_name");
				if(recipientBankAbbvName) {
					recipientBankAbbvName.onChange();
					if(dj.byId("recipient_bank_customer_reference"))
						{
						m.populateFacilityReference(dj.byId("recipient_bank_customer_reference"));
						}
					if(misys._config.entityBankMap && Object.keys(misys._config.entityBankMap).length > 1) {
						m.populateBankAsPerEntity("recipient_bank_abbv_name");
					}
				}
			});
			m.connect("recipient_bank_customer_reference", "onChange", m.setApplicantReference);
			
			m.connect("renew_on_code","onChange",m.validateRenewalCalendarDate);
			
			m.connect("advising_bank_name", "onBlur", m.setConfirmedRequired);
			m.connect("final_expiry_date", "onBlur", function(){
				if(dj.byId("adv_send_mode").get("value") == "01")
				{  
					var calculatedFinalExpDate = m.calculateFinalExpiryDate();
					var onOkCallback = function(){
		              m.calculateRenewalFinalExpiryDate();
					};
				   if(calculatedFinalExpDate != undefined && dj.byId("final_expiry_date") && dj.byId("final_expiry_date").get("value")!=null && dj.byId("final_expiry_date").get("value").getTime() !== calculatedFinalExpDate.getTime())
				   {
					   var calcFinalExpDate = dojo.date.locale.format(new Date(calculatedFinalExpDate.getTime()), {selector:"date", formatLength:"short", locale:dojo.config.locale, datePattern : m.getLocalization("g_strGlobalDateFormat")});
					   m.dialog.show("DATE-CONFLICT",  m.getLocalization("confirmResetFinalExpDate", [calcFinalExpDate]), "", "", "", "", onOkCallback, "", "");
				   }
				}
			});
			
			m.connect("adv_send_mode", "onChange",  function(){
				m.toggleMT798Fields("recipient_bank_abbv_name");
				if(dj.byId("adv_send_mode").get("value") === "01")
				{
					m.toggleRequired("narrative_additional_instructions", true);
					// reset the final expiry date if its changed manually in case of deliver mode as SWIFT (MPS-58505)
					var calculatedRenewalFinalExpDate = m.calculateFinalExpiryDate();
					var okCallback = function(){
		              m.calculateRenewalFinalExpiryDate();
					};
				   if(calculatedRenewalFinalExpDate != undefined  && dj.byId("final_expiry_date") && dj.byId("final_expiry_date").get("value")!=null && dj.byId("final_expiry_date").get("value").getTime() !== calculatedRenewalFinalExpDate.getTime())
				   {
					   var calcRenFinalExpDate = dojo.date.locale.format(new Date(calculatedRenewalFinalExpDate.getTime()), {selector:"date", formatLength:"short", locale:dojo.config.locale, datePattern : m.getLocalization("g_strGlobalDateFormat")});
					   m.dialog.show("DATE-CONFLICT",  m.getLocalization("confirmResetFinalExpDate", [calcRenFinalExpDate]), "", "", "", "", okCallback, "", "");
				   }
				}
				else
				{
					m.toggleRequired("narrative_additional_instructions", false);
				}	
				bgTextTypeChange();
			});
			m.connect("adv_send_mode", "onChange", function(){
				m.toggleFields((this.get("value") == "99"), null, ["adv_send_mode_text"]);
			});
			m.connect("recipient_bank_abbv_name", "onChange",  function(){
				m.toggleMT798Fields("recipient_bank_abbv_name");
			});
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
			m.connect("renew_on_code", "onChange", function(){
				m.toggleFields(
						this.get("value") === "02", 
						null,
						["renewal_calendar_date"]);
				//dj.byId("final_expiry_date").validate();
			});
			
			//Set renewal final expiry date
			m.connect("exp_date","onChange", m.calculateRenewalFinalExpiryDate);
			m.connect("rolling_renewal_nb","onBlur", m.calculateRenewalFinalExpiryDate);
			m.connect("renew_on_code","onBlur", m.calculateRenewalFinalExpiryDate);
			m.connect("renewal_calendar_date","onBlur", m.calculateRenewalFinalExpiryDate);
			m.connect("renew_for_nb","onBlur", m.calculateRenewalFinalExpiryDate);
			m.connect("renew_for_period","onBlur", m.calculateRenewalFinalExpiryDate);
			m.connect("entity_img_label","onClick",_clearPrincipalFeeAcc);
			m.connect("rolling_renew_on_code","onChange", m.calculateRenewalFinalExpiryDate);
			m.connect("rolling_renew_for_nb","onChange", m.calculateRenewalFinalExpiryDate);
			m.connect("rolling_renew_for_period","onChange", m.calculateRenewalFinalExpiryDate); 
			
			m.connect("recipient_bank_customer_reference", "onChange", function()
					{
				if(dj.byId("recipient_bank_customer_reference"))
				{	
				m.populateFacilityReference(dj.byId("recipient_bank_customer_reference"));
				}
					});

			m.connect("facility_id", "onChange", m.getLimitDetails);
			m.connect("beneficiary_country", "onChange", function()
					{
				if(dj.byId("recipient_bank_customer_reference"))
				{
				m.populateFacilityReference(dj.byId("recipient_bank_customer_reference"));}
			});
			m.connect("bg_type_code", "onChange", function()
					{
				if(dj.byId("recipient_bank_customer_reference"))
				{
				m.populateFacilityReference(dj.byId("recipient_bank_customer_reference"));}
			});
			m.connect("facility_id", "onChange", function(){
				if(this && this.get("value")+"S" !== "S")
				{
					m.toggleFields(
							true, null,
							["limit_id", "booking_amt","booking_cur_code"], true, true);
				}
				else
				{
					m.toggleFields(
							false, null,
							["limit_id", "booking_amt","booking_cur_code"], true, true);
				}
			});
		
			m.connect("limit_id", "onChange",m.setLimitFieldsValue);
			m.setValidation("booking_cur_code", m.validateCurrency);
			m.connect("facility_id", "onChange", m.validateLimitBookingAmount);
			m.connect("limit_id", "onChange", m.validateLimitBookingAmount);
			m.connect("bg_amt", "onChange", m.validateLimitBookingAmount);
			m.connect("bg_cur_code", "onChange",m.validateLimitBookingAmount);
			m.connect("booking_amt", "onBlur", m.validateLimitBookingAmount);
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
				m.getLicenses("bg");
			});
			
			m.connect("bg_cur_code", "onChange", function(){
				m.clearLicenseGrid(this, m._config.bgCurCode);
			});
			
			m.connect("entity", "onChange", function(){
				m.clearLicenseGrid(this, m._config.applicant);
			});
			
			m.connect("beneficiary_name", "onChange", function(){
				m.clearLicenseGrid(this, m._config.beneficiary);
			});
			
			m.connect("exp_date", "onChange", function(){
				m.clearLicenseGrid(this, m._config.expDate);
			});
			
			m.connect("renew_flag", "onClick", function(){
				m.clearLicenseGrid(this, m._config.renewFlag);
			});
			
			m.connect("renew_flag", "onChange", function(){
				m.clearLicenseGrid(this, m._config.renewFlag);
			});
			
			m.connect("bg_type_code", "onChange", function(){
				m.clearLicenseGrid(this, m._config.bgTypeCode);
			});
			m.connect("applicant_address_line_4", "onFocus", function(){
				m.showTooltip(m.getLocalization('addressLine4ToolTip', 
						[dj.byId("applicant_address_line_4").get("displayedValue"), dj.byId("applicant_address_line_4").get("value") ]), d.byId("applicant_address_line_4"), [ 'right' ],5000);
			});
			m.connect("beneficiary_address_line_4", "onFocus", function(){
				m.showTooltip(m.getLocalization('addressLine4ToolTip', 
						[dj.byId("beneficiary_address_line_4").get("displayedValue"), dj.byId("beneficiary_address_line_4").get("value") ]), d.byId("beneficiary_address_line_4"), [ 'right' ],5000);
			});
			m.connect("alt_applicant_address_line_4", "onFocus", function(){
				m.showTooltip(m.getLocalization('addressLine4ToolTip', 
						[dj.byId("alt_applicant_address_line_4").get("displayedValue"), dj.byId("alt_applicant_address_line_4").get("value") ]), d.byId("alt_applicant_address_line_4"), [ 'right' ],5000);
			});
			m.connect("contact_address_line_4", "onFocus", function(){
				m.showTooltip(m.getLocalization('addressLine4ToolTip', 
						[dj.byId("contact_address_line_4").get("displayedValue"), dj.byId("contact_address_line_4").get("value") ]), d.byId("contact_address_line_4"), [ 'right' ],5000);
			});
			m.connect("advising_bank_address_line_4", "onFocus", function(){
				m.showTooltip(m.getLocalization('addressLine4ToolTip', 
						[dj.byId("advising_bank_address_line_4").get("displayedValue"), dj.byId("advising_bank_address_line_4").get("value") ]), d.byId("advising_bank_address_line_4"), [ 'right' ],5000);
			});
			m.connect("issuing_bank_address_line_4", "onFocus", function(){
				m.showTooltip(m.getLocalization('addressLine4ToolTip', 
						[dj.byId("issuing_bank_address_line_4").get("displayedValue"), dj.byId("issuing_bank_address_line_4").get("value") ]), d.byId("issuing_bank_address_line_4"), [ 'right' ],5000);
			});
			m.connect("advising_bank_address_line_4", "onFocus", function(){
				m.showTooltip(m.getLocalization('addressLine4ToolTip', 
						[dj.byId("advising_bank_address_line_4").get("displayedValue"), dj.byId("advising_bank_address_line_4").get("value") ]), d.byId("advising_bank_address_line_4"), [ 'right' ],5000);
			});
			m.connect("confirming_bank_address_line_4", "onFocus", function(){
				m.showTooltip(m.getLocalization('addressLine4ToolTip', 
						[dj.byId("confirming_bank_address_line_4").get("displayedValue"), dj.byId("confirming_bank_address_line_4").get("value") ]), d.byId("confirming_bank_address_line_4"), [ 'right' ],5000);
			});
			var processingBankWidget = dj.byId("dijit_layout_ContentPane_3");
			
			m.connect("lead_bank_flag", "onClick", function(){
				
				var recipientLabel = d.byId("recipient_bank_abbv_name_label");
				var recipientBankAbbvName = dj.byId("recipient_bank_abbv_name");
				var isEntityUser = false;
				if(dj.byId("entity")) {
					isEntityUser = true;
					var recipientBankStore = recipientBankAbbvName.store._arrayOfAllItems;
				} else {
					recipientBankStore = recipientBankAbbvName.store.root.options;
				}
 				if(this.get("checked"))
 				{
 					if (processingBankWidget != null)
 					{
 					    dijit.byId("dijit_layout_TabContainer_0").addChild(processingBankWidget, 3);
 					    if(dj.byId("org_lead_bank_flag") && dj.byId("org_lead_bank_flag").get("value") !== "Y")
 					    {
	 					    d.place(d.create("span", {
	 							innerHTML : requiredPrefix
	 						}), d.byId("dijit_layout_TabContainer_0_tablist_dijit_layout_ContentPane_3"), "first");
 					    }
 					}
 					recipientLabel.innerHTML = dj.byId("lead_bank_label").get("value");
 					for(var i=0; i<recipientBankStore.length; i++)
					{
 						var value = isEntityUser ? recipientBankStore[i].value[0] : recipientBankStore[i].value;
 						if(!misys._config.leadBankAccess[value])
						{
 							removedBanks.push(recipientBankStore[i]);
 							if(isEntityUser) {
 								dj.byId("recipient_bank_abbv_name").store._arrayOfAllItems.remove(i);
 							} else {
 								dj.byId("recipient_bank_abbv_name").store.root.options.remove(i);
 							}
 						
						}
					}
 					m.toggleRequired("processing_bank_name", true);
 					m.toggleRequired("processing_bank_address_line_1", true);
 				}
 				else
 				{
 					m.toggleRequired("processing_bank_name", false);
 					m.toggleRequired("processing_bank_address_line_1", false);
 					dj.byId("processing_bank_name").set("value", "");
 					dj.byId("processing_bank_address_line_1").set("value", "");
 					dj.byId("processing_bank_address_line_2").set("value", "");
 					dj.byId("processing_bank_dom").set("value", "");
 					dj.byId("processing_bank_address_line_4").set("value", "");
 					dijit.byId("dijit_layout_TabContainer_0").removeChild(dijit.byId("dijit_layout_ContentPane_3"));
 					recipientLabel.innerHTML = dj.byId("recipient_bank_label").get("value");
 					for(var j=0; j<removedBanks.length; j++)
					{
 						recipientBankStore.add(removedBanks[j]);
					}
 					removedBanks = [];
 				}
 				d.place(d.create("span", {
					"class" : "required-field-symbol",
					innerHTML : requiredPrefix
				}), recipientLabel, "first");
 				if(!recipientBankAbbvName.get("disabled"))
 				{
 					recipientBankAbbvName.set("value", "");
 				}
				dj.byId("recipient_bank_customer_reference").set("value", "");
			});
			
		},
		
		setConfirmedRequired : function() {
			//  summary:
		    //        Write the draft term value.
			
			var advisingBankName = dj.byId("advising_bank_name");
			var confirmationRequired = dj.byId("adv_bank_conf_req");
			
			if (advisingBankName)
			{
				var advisingBankNameValue = dj.byId("advising_bank_name").get("value");
				if(advisingBankNameValue !== "")
				{
					confirmationRequired.set("disabled", false);
					confirmationRequired.set("checked", false);
					if(d.byId("span_id"))
					{
						d.empty("span_id");
					}
					
				}
				else
				{
					confirmationRequired.set("disabled", true);
					confirmationRequired.set("checked", false);
				}
			}
		}, 

		onFormLoad : function() {

			m._config.bgCurCode = dj.byId("bg_cur_code").get("value");
			m._config.beneficiary.name = dj.byId("beneficiary_name").get("value");
			m._config.beneficiary.addressLine1 = dj.byId("beneficiary_address_line_1").get("value");
			m._config.beneficiary.addressLine2 = dj.byId("beneficiary_address_line_2").get("value");
			m._config.beneficiary.dom = dj.byId("beneficiary_dom").get("value");
			m._config.applicant.entity = dj.byId("entity") ? dj.byId("entity").get("value") : "";
			m._config.applicant.name = dj.byId("applicant_name").get("value");
			m._config.applicant.addressLine1 = dj.byId("applicant_address_line_1").get("value");
			m._config.applicant.addressLine2 = dj.byId("applicant_address_line_2").get("value");
			m._config.applicant.dom = dj.byId("applicant_dom").get("value");
			m._config.expDate = dj.byId("exp_date").get("displayedValue");
			m._config.renewFlag = dj.byId("renew_flag").get("checked");
			m._config.bgTypeCode = dj.byId("bg_type_code") ? dj.byId("bg_type_code").get("value") : "";
			if(dj.byId("entity") && dj.byId("entity").readOnly && dj.byId("entity").get("value") !== "") {
				if(misys._config.entityBankMap && Object.keys(misys._config.entityBankMap).length > 1) {
					m.populateBankAsPerEntity("recipient_bank_abbv_name");
				}
			}
			var issDateTypeCode = dj.byId("iss_date_type_code");
			if(issDateTypeCode) {
				m.toggleFields(
						issDateTypeCode.get("value") === "99", null,
						["iss_date_type_details"]);
			}
			
			var expDateTypeCode = dj.byId("exp_date_type_code");
			if(expDateTypeCode) {
				m.toggleFields(
						expDateTypeCode.get("value") != "01", null,
						["exp_date"]);
				m.toggleFields(
						expDateTypeCode.get("value") != "02", null,
						["exp_event"]);
				if(expDateTypeCode.get("value") === "01" && dj.byId("renew_flag")) {
					dj.byId("renew_flag").set("checked", false);
					dj.byId("renew_flag").set("disabled", true);
				} 
			}
			
			var advSendMode = dj.byId("adv_send_mode");
			if(advSendMode) {
				m.toggleFields(
						advSendMode.get("value") == "99",
						null, ["adv_send_mode_text"]);
			}
			var reductionAuthorised = dj.byId("reduction_authorised");
			if(reductionAuthorised) {
				m.toggleFields(
						reductionAuthorised.get("value") === "on", null,
						["reduction_clause"]);
			}
			
			var reductionClause = dj.byId("reduction_clause");
			if(reductionClause) {
				m.toggleFields(
						reductionClause.get("value") === "03", null,
						["reduction_clause_other"]);
			}
			
			var forAccount = dj.byId("for_account");
			if(forAccount) {
				m.toggleFields(
						forAccount.get("value") === "on", 
						["alt_applicant_address_line_2", "alt_applicant_dom", "alt_applicant_address_line_4"],
						["alt_applicant_name", "alt_applicant_address_line_1", "alt_applicant_country"]);
			}
			
			var consortium = dj.byId("consortium");
			if(consortium) {
				m.toggleFields(
						consortium.get("value") === "on", null,
						["net_exposure_cur_code", "net_exposure_amt", "consortium_details"], true, true);
				var consortiumDetails = dj.byId("consortium_details");
				consortiumDetails.set("disabled", (consortium.get("value") != "on"));
			}

			var issuingBankTypeCode = dj.byId("issuing_bank_type_code");
			if(issuingBankTypeCode) {
				m.toggleFields(
						issuingBankTypeCode.get("value") === "02",
						["issuing_bank_address_line_2", "issuing_bank_dom", "issuing_bank_address_line_4"],
						["issuing_bank_name", "issuing_bank_address_line_1"]);
				if(issuingBankTypeCode.get("value") === "01") {
					m.animate("fadeOut", d.byId("issuing_bank_name_img"));
				}
				else if(issuingBankTypeCode.get("value") === "02") {
					m.animate("fadeIn", d.byId("issuing_bank_name_img"));
				}
			}

			var deliveryTo = dj.byId("delivery_to");
			if(deliveryTo) {
				m.toggleFields(
						deliveryTo.get("value") === "04",
						null, ["delivery_to_other"]);
			}

			var textLanguage = dj.byId("text_language");
			if(textLanguage) {
				m.toggleFields(
						textLanguage.get("value") === "*",
						null, ["text_language_other"]);
			}
			
			var bgRule = dj.byId("bg_rule");
			if(bgRule) {
				m.toggleFields(
						bgRule.get("value") === "99",
						null, ["bg_rule_other"]);
			}
			
			/**
			 * If the bg_text_details_code is 'WYSIWYG Editor' then
			 * bg_text_type_code should be 'Standard' and non editable
			 */
			var bgTextTypeCode = dj.byId("bg_text_type_code"),
				bgTextDetailsCode = dj.byId("bg_text_details_code");
			if(bgTextDetailsCode && bgTextTypeCode && bgTextDetailsCode.get("value") === "02"){
				bgTextTypeCode.set("disabled", true);
				bgTextTypeCode.set("value", "01");
			}
			if(bgTextTypeCode) {
				/*bgTextTypeCode.onChange(bgTextTypeCode.get("value"));*/
				m.toggleFields(
						bgTextTypeCode.get("value") === "03",
						null, ["bg_text_type_details"]);
			}

			m.setCurrency(dj.byId("bg_cur_code"), ["bg_amt"]);
			m.setCurrency(dj.byId("contract_cur_code"), ["contract_amt"]);
			m.setCurrency(dj.byId("booking_cur_code"), ["booking_amt"]);
			m.setCurrency(dj.byId("net_exposure_cur_code"), ["net_exposure_amt"]);

			var recipientBankAbbvName = dj.byId("recipient_bank_abbv_name");
			if(recipientBankAbbvName) {
				recipientBankAbbvName.onChange();
			}
			
			var recipientBankCustRef = dj.byId("recipient_bank_customer_reference");
			if(recipientBankCustRef) {
				recipientBankCustRef.onChange();
			}
			var bgTypeCode = dj.byId("bg_type_code"),
				guaranteeTypeCode = dj.byId("guarantee_type_code");
			//Making the guarantee type as not editable in case of other as well
			if(bgTypeCode) {
				bgTypeCode.onChange(bgTypeCode.get("value"));
			}
			var facilityWidget			= dj.byId("facility_id"),
	    		facilityReference		= dj.byId("facility_reference");
			if(facilityReference && facilityWidget.get("value") + "S" === "S")
			{
				if(facilityReference.get("value") + "S" !== "S")
				{
					m._config.isLoading = true;
				}
				facilityWidget.set("displayedValue",facilityReference.get("value"));
			}
			var advisingBankName = dj.byId("advising_bank_name");
			var confirmationRequired = dj.byId("adv_bank_conf_req");
			if(advisingBankName && advisingBankName.get("value")=== ""){
				confirmationRequired.set("disabled", true);
				confirmationRequired.set("checked", false);
			}
			//making confirming bank mandatory only when the confirmation req checkbox is checked
			if(confirmationRequired){
				m.toggleFields(
						confirmationRequired.get("checked") === true,
					["confirming_bank_address_line_2", "confirming_bank_dom", "confirming_bank_address_line_4"],
						["confirming_bank_name", "confirming_bank_address_line_1"]);
			}
			
			if(confirmationRequired && confirmationRequired.get("checked") === true)
			{
				m.animate("fadeIn", d.byId("confirming_bank_name_img"));
			}
			else
			{
				m.animate("fadeOut", d.byId("confirming_bank_name_img"));
			}
		
			var handle = dojo.subscribe(_deleteGridRecord, function(){
				 m.toggleFields(m._config.customerBanksMT798Channel[recipientBankAbbvName] === true && m.hasAttachments(), null, ["delivery_channel"], false, false);
			});
			
			var _provisionalDiv = d.byId("pro-check-box");
			if(m._config.provisionalProductTypes[dj.byId("bg_type_code").get("value")])
				{
					m.animate("fadeIn", _provisionalDiv);
				}
			else
				{
					dj.byId("provisional_status").set("checked", false);
					m.animate("fadeOut", _provisionalDiv);
				}
			var tender_exp_date = d.byId("tender-exp-date");
			
			if(dj.byId("contract_ref").get("value")==="TEND")
			{
				m.animate("fadeIn", tender_exp_date);
			}
			else
			{
				dj.byId("tender_expiry_date").set("value", null);
				m.animate("fadeOut", tender_exp_date);
			}
			
			var renewFlag = dj.byId("renew_flag");
			if(renewFlag) {
			 d.hitch(renewFlag, m.toggleRenewalDetails, true)();
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
			
			var rollingFlag = dj.byId("rolling_renewal_flag");
			if(rollingFlag) {
				m.toggleFields(rollingFlag.get("checked"),
						["final_expiry_date"], ["rolling_renewal_nb", "rolling_cancellation_days"], true);
			}
			m.populateGridOnLoad("bg");
			
			if(recipientBankAbbvName && dj.byId("bg_code"))
			{
				if(recipientBankAbbvName.get("value") !== "" && misys._config.leadBankAccess[recipientBankAbbvName.get("value")])
				{
					m.animate("fadeIn", d.byId("lead-bank-check-box"));
				}
				else
				{
					m.animate("fadeOut", d.byId("lead-bank-check-box"));
				}
			}
			
			if(dj.byId("lead_bank_flag") && recipientBankAbbvName)
			{
				var recipientLabel = d.byId("recipient_bank_abbv_name_label");
				
				var isEntityUser = false;
				if(dj.byId("entity")) {
					isEntityUser = true;
					var recipientBankStore = recipientBankAbbvName.store._arrayOfAllItems;
				} else {
					recipientBankStore = recipientBankAbbvName.store.root.options;
				}
 				if(dj.byId("lead_bank_flag").get("checked"))
 				{
 					recipientLabel.innerHTML = dj.byId("lead_bank_label").get("value");
 					for(var i=0; i<recipientBankStore.length; i++)
					{
 						var value = isEntityUser ? recipientBankStore[i].value[0] : recipientBankStore[i].value;
 						if(!misys._config.leadBankAccess[value])
						{
 							removedBanks.push(recipientBankStore[i]);
 							if(isEntityUser) {
 								dj.byId("recipient_bank_abbv_name").store._arrayOfAllItems.remove(i);
 							} else {
 								dj.byId("recipient_bank_abbv_name").store.root.options.remove(i);
 							}
						}
					}
 					m.toggleRequired("processing_bank_name", true);
 					m.toggleRequired("processing_bank_address_line_1", true);
 				}
 				else
 				{
 					m.toggleRequired("processing_bank_name", false);
 					m.toggleRequired("processing_bank_address_line_1", false);
 					dj.byId("processing_bank_name").set("value", "");
 					dj.byId("processing_bank_address_line_1").set("value", "");
 					dj.byId("processing_bank_address_line_2").set("value", "");
 					dj.byId("processing_bank_dom").set("value", "");
 					dj.byId("processing_bank_address_line_4").set("value", "");
 					dijit.byId("dijit_layout_TabContainer_0").removeChild(dijit.byId("dijit_layout_ContentPane_3"));
 					recipientLabel.innerHTML = dj.byId("recipient_bank_label").get("value");
 					for(var j=0; j<removedBanks.length; j++)
					{
 						recipientBankStore.add(removedBanks[j]);
					}
 					removedBanks = [];
 				}
 				d.place(d.create("span", {
					"class" : "required-field-symbol",
					innerHTML : requiredPrefix
				}), recipientLabel, "first");
			}
			// No lead bank access permission scenario
			else
			{
				// Remove processing bank tab
				m.toggleRequired("processing_bank_name", false);
				m.toggleRequired("processing_bank_address_line_1", false);
				dj.byId("dijit_layout_TabContainer_0").removeChild(dj.byId("dijit_layout_ContentPane_3"));
			}
			if(dj.byId("adv_send_mode") && dj.byId("adv_send_mode").get("value") === "01")
			{
				m.toggleRequired("narrative_additional_instructions", true);
			}
			else
			{
				m.toggleRequired("narrative_additional_instructions", false);
			}
			
			//Radio field template is reading values from all nodes in the input xml.
            // For ones with multiple transactions, (ex:  create, approve, amend, approve.) the tag values from the root node is not being picked, because of radio-value = //*name in form-templates.
            // To overcome this we are overriding "value" and "checked" params from js.
			m.setRenewalAmountOnFormLoad();
			if(dj.byId("bg_text_type_code"))
			{
			bgTextTypeChange();
			}
		},
		
		beforeSaveValidations : function(){
			if(dj.byId("bg_type_code").get("value") !== '99'){
				dj.byId("bg_type_details").set("value", "");
			}
			
			var principleAccount = dj.byId("principal_act_no");
			if(principleAccount && principleAccount.get('value')!== "")
			{
				if(!m.validatePricipleAccount())
				{
					m._config.onSubmitErrorMsg = m.getLocalization('invalidPrincipleAccountError',[ principleAccount.get("displayedValue")]);
					m.showTooltip(m.getLocalization('invalidPrincipleAccountError',[ principleAccount.get("displayedValue")]), principleAccount.domNode);
					principleAccount.focus();
					return false;
				}
			}
			
			var feeAccount = dj.byId("fee_act_no");
			if(feeAccount && feeAccount.get('value')!== "")
			{
				if(!m.validateFeeAccount())
				{
					m._config.onSubmitErrorMsg = m.getLocalization('invalidFeeAccountError',[ feeAccount.get("displayedValue")]);
					m.showTooltip(m.getLocalization('invalidFeeAccountError',[ feeAccount.get("displayedValue")]), feeAccount.domNode);
					feeAccount.focus();
					return false;
				}
			}
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
		
		beforeSubmitValidations : function(){
			//General validation: validate against BG amount which should be greater than zero
			var validation_flag = true;
			if(dj.byId("bg_amt"))
			{
				if(!m.validateAmount((dj.byId("bg_amt"))?dj.byId("bg_amt"):0))
				{
					m._config.onSubmitErrorMsg =  m.getLocalization("amountcannotzero");
					dj.byId("bg_amt").set("value", "");
					return false;
				}
			}
			if(validation_flag === true && dj.byId("booking_amt"))
			{
				validation_flag = m.validateLimitBookingAmount();
			}
			if(dj.byId("rolling_renewal_flag") && dj.byId("rolling_renewal_nb") && dj.byId("rolling_renewal_flag").get("checked") && d.number.parse(dj.byId("rolling_renewal_nb").get("value")) === 1)
			{
				console.debug("Invalid Number of Rolling renewals");
				m._config.onSubmitErrorMsg =  m.getLocalization("invalidNumberOfRollingRenewals");
				dj.byId("rolling_renewal_nb").set("value","");
				dj.byId("rolling_renewal_nb").focus();
				return false;
			}
			var bgTextTypeCode = dj.byId("bg_text_type_code")? dj.byId("bg_text_type_code").value : "";
			if (validation_flag === true && (bgTextTypeCode === "02" || bgTextTypeCode === "04"))
			 {
				validation_flag = m.checkForAttachments();
			 }
			
			if(validation_flag === true)
			{
				validation_flag = m.validateLSAmtSumAgainstTnxAmt("bg");
			}
			
			//Validate the length of bank name and all the address fields length not to exceed 1024
			if(!(m.validateLength(["applicant","alt_applicant","beneficiary","contact","advising_bank","confirming_bank"])))
			{
				return false;
			}	
			
			var bgTypeCode = dj.byId("bg_type_code");
			if(bgTypeCode && (dj.byId("bg_type_code").get("value") != '99')){
				dj.byId("bg_type_details").set("value", "");
			}
			var principleAccount = dj.byId("principal_act_no");
			if(principleAccount && principleAccount.get('value')!== "")
			{
				if(!m.validatePricipleAccount())
				{
					m._config.onSubmitErrorMsg = m.getLocalization('invalidPrincipleAccountError',[ principleAccount.get("displayedValue")]);
					m.showTooltip(m.getLocalization('invalidPrincipleAccountError',[ principleAccount.get("displayedValue")]), principleAccount.domNode);
					principleAccount.focus();
					return false;
				}
			}
			if(dj.byId("recipient_bank_abbv_name") && !m.validateApplDate(dj.byId("recipient_bank_abbv_name").get("value")))
			{
				m._config.onSubmitErrorMsg = m.getLocalization('changeInApplicationDates');
				m.goToTop();
				return false;
      		}
			var feeAccount = dj.byId("fee_act_no");
			if(feeAccount && feeAccount.get('value')!== "")
			{
				if(!m.validateFeeAccount())
				{
					m._config.onSubmitErrorMsg = m.getLocalization('invalidFeeAccountError',[ feeAccount.get("displayedValue")]);
					m.showTooltip(m.getLocalization('invalidFeeAccountError',[ feeAccount.get("displayedValue")]), feeAccount.domNode);
					feeAccount.focus();
					return false;
				}
			}
			
			return validation_flag;
		},
		 
			generateGTEEFromNew : function(){

				var xmlString = m.formToXML();
				dj.byId("transactiondata_download_project").set("value", xmlString);
			    dj.byId("gteeName_download_project").set("value", dj.byId("bg_text_type_code").get("value"));
			    dj.byId("company_download_project").set("value", dj.byId("company_name").get("value"));
			    dj.byId("bank_download_project").set("value", dj.byId("recipient_bank_abbv_name").get("value"));
			    if (dj.byId("entity"))
			    {
			    	dj.byId("entity_download_project").set("value", dj.byId("entity").get("value"));
			    }
			    if (dj.byId("parent_entity"))
			    {
			    	dj.byId("parentEntity_download_project").set("value", dj.byId("parent_entity").get("value"));
			    }
			    if(!dj.byId("downloadgteetext")) {
					d.parser.parse();
				}
			    dj.byId("downloadgteetext").submit();
			    return false;
			}
	
		
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require("misys.client.binding.trade.create_bg_client");