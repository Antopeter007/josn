dojo.provide("misys.binding.trade.amend_lc_swift2018");

//
// Copyright (c) 2017-2018 (http://www.finastra.com)
// All Rights Reserved. 
//
//
// Summary: 
//      The Main js file for handling events on LC Amendment FO SWIFT 2018 format.
//
// version:   1.0
// date:      09/12/2017
//

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
dojo.require("misys.binding.trade.ls_common");
dojo.require("misys.widget.Amendments");


(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode
	
	//
	// Private functions & variables
	//
    // dojo.subscribe once a record is deleted from the grid
    var _deleteGridRecord = "deletegridrecord";
    var formload = true;
    m._config = m._config || {};
    m._config.lcCurCode = m._config.lcCurCode || {};
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
    m._config.lastShipDate = m._config.lastShipDate || {};
    
    function _clearPrincipalFeeAcc(){
		dj.byId("principal_act_no").set("value", "");
		dj.byId("fee_act_no").set("value", "");	
	}
    function validateDecreaseAmount() 
	{	
			if(d.number.parse(dijit.byId("org_lc_amt").get("displayedValue")) < d.number.parse(dijit.byId("dec_amt").get("displayedValue")))
				{
					m.showTooltip(m.getLocalization('decreaseAmountShouldBeLessThanLCAmount',[ dj.byId("dec_amt").get("displayedValue")]), d.byId("dec_amt"), [ 'after' ],5000);
					misys.dialog.show("ERROR", dj.byId("dec_amt").invalidMessage, "", function(){
					dj.byId("dec_amt").focus();
					dj.byId("dec_amt").set("state","Error");
				});
				return false;
				}
			if(d.number.parse(dijit.byId("dec_amt").get("displayedValue")) < 0 )
			{
				dj.byId("lc_amt").set("value", d.number.parse(dj.byId("org_lc_amt").get("displayedValue")));
				m.showTooltip(m.getLocalization('valueShouldBeGreaterThanZero',[ dj.byId("dec_amt").get("displayedValue")]), d.byId("dec_amt"), [ 'after' ],5000);
				misys.dialog.show("ERROR", dj.byId("dec_amt").invalidMessage, "", function(){
					dj.byId("dec_amt").focus();
					dj.byId("dec_amt").set("state","Error");					
				});
				return false;
			}
			return true;
		}
	//
	// Public functions & variables
	
	d.mixin(m._config, {

		initReAuthParams : function() {
									
			var reAuthParams = {
					productCode : 'LC',	
					subProductCode : '',
					transactionTypeCode : "03",	
					subTransactionTypeCode : dj.byId("sub_tnx_type_code") ? dj.byId("sub_tnx_type_code").get('value') : "",
					entity :dj.byId("entity") ? dj.byId("entity").get("value") : "",
					currency : dj.byId("lc_cur_code") ? dj.byId("lc_cur_code").get('value') : "",
					amount : dj.byId("lc_amt") ? m.trimAmount(dj.byId("lc_amt").get('value')) : "",
					tnxAmt : dj.byId("tnx_amt") ? m.trimAmount(dj.byId("tnx_amt").get('value')) : "",			
					es_field1 : dj.byId("lc_amt") ? m.trimAmount(dj.byId("lc_amt").get('value')) : "",
					es_field2 : ''				
				};
				return reAuthParams;
		},
		
		/*
		 * Overriding to add license items in the xml. 
		 */
		xmlTransform : function (/*String*/ xml) {
			var tdXMLStart = "<lc_tnx_record>";
			/*
			 * Add license items tags, only in case of LC transaction.
			 * Else pass the input xml, without modification. (Ex : for create beneficiary from popup.)
			 */
			if(xml.indexOf(tdXMLStart) != -1){
				// Setup the root of the XML string
				var xmlRoot = m._config.xmlTagName,
				transformedXml = xmlRoot ? ["<", xmlRoot, ">"] : [],			
						tdXMLEnd   = "</lc_tnx_record>",
						subTDXML	= "",
						selectedIndex = -1;
				subTDXML = xml.substring(tdXMLStart.length,(xml.length-tdXMLEnd.length));
				if(m._config.swift2018Enabled){
					var subXML;
					var arrayOfNarratives = ["narrative_description_goods","narrative_documents_required","narrative_additional_instructions","narrative_special_beneficiary"];
					var dataStoreNarrative = [m._config.narrativeDescGoodsDataStore,m._config.narrativeDocsReqDataStore,m._config.narrativeAddInstrDataStore,m._config.narrativeSpBeneDataStore];
					
					for(var itr = 0; itr < 4; itr++){
						subXML = itr == 0 ? subTDXML.substring(0,subTDXML.indexOf("<"+arrayOfNarratives[itr]+">")) : (subXML.indexOf("<"+arrayOfNarratives[itr]+">") > 0 ? subXML.substring(0,subXML.indexOf("<"+arrayOfNarratives[itr]+">")) : subXML);
						if(subTDXML.indexOf("<"+arrayOfNarratives[itr]+">") < 0){continue;}
						var i = 0, verb, text;
						if(dataStoreNarrative[itr]){
							subXML = subXML.concat("<"+arrayOfNarratives[itr]+">");
							subXML = subXML.concat("<![CDATA[");
							subXML = subXML.concat("<amendments>");
							subXML = subXML.concat("<amendment>");
							subXML = subXML.concat("<sequence>");
							subXML = subXML.concat("");
							subXML = subXML.concat("</sequence>");
							subXML = subXML.concat("<data>");
							d.forEach(dataStoreNarrative[itr], function(){
								if(dataStoreNarrative[itr][i] != null){
									verb = dataStoreNarrative[itr][i].verb[0];
									subXML = subXML.concat("<datum>");
									subXML = subXML.concat("<id>");
									subXML = subXML.concat(i);
									subXML = subXML.concat("</id>");
									subXML = subXML.concat("<verb>");
									subXML = subXML.concat(verb);
									subXML = subXML.concat("</verb>");
									subXML = subXML.concat("<text>");
									subXML = subXML.concat("]]><![CDATA[" + dojo.trim(dataStoreNarrative[itr][i].content[0]));
									subXML = subXML.concat("</text>");
									subXML = subXML.concat("</datum>");
								}
								i ++;
							});
							subXML = subXML.concat("</data>");
							subXML = subXML.concat("</amendment>");
							subXML = subXML.concat("</amendments>");
							subXML = subXML.concat("]]>");
							subXML = subXML.concat(subTDXML.substring(subTDXML.indexOf("</"+arrayOfNarratives[itr]+">"),subTDXML.length));
						}
						else{
							subXML = subXML.concat("<"+arrayOfNarratives[itr]+">");
							subXML = subXML.concat(subTDXML.substring(subTDXML.indexOf("</"+arrayOfNarratives[itr]+">"),subTDXML.length));
						}
						
					}
					
					transformedXml.push(subXML);
				}
				else{
					transformedXml.push(subTDXML);
				}
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
				if(xmlRoot) {
					transformedXml.push("</", xmlRoot, ">");
				}
				return transformedXml.join("");
			}else{
				return xml;
			}

		}
	});
		
	//
	d.mixin(m, {
		bind : function() {
			//m.setValidation("template_id", m.validateTemplateId);
			m.setValidation("tenor_maturity_date", m.validateMaturityDate);
			m.setValidation("exp_date", m.validateTradeExpiryDate);
			m.setValidation("amd_date", m.validateAmendmentDate);
			m.setValidation("pstv_tol_pct", m.validateTolerance);
			m.setValidation("neg_tol_pct", m.validateTolerance);
			m.setValidation("max_cr_desc_code", m.validateMaxCreditTerm);
			m.setValidation("last_ship_date", m.validateLastShipmentDate);
			m.setValidation("lc_cur_code", m.validateCurrency);
			m.setValidation('beneficiary_country', m.validateCountry);
			m.setValidation("alt_applicant_country", m.validateCountry);

			m.connect("irv_flag", "onClick", m.checkIrrevocableFlag);
			m.connect("ntrf_flag", "onClick", m.checkNonTransferableFlag);
			m.connect("stnd_by_lc_flag", "onClick", m.checkStandByFlag);
			m.connect("cfm_inst_code_1", "onClick", m.resetConfirmationCharges);
			m.connect("cfm_inst_code_2", "onClick", m.resetConfirmationCharges);
			m.connect("cfm_inst_code_3", "onClick", m.resetConfirmationCharges);
			//SWIFT 2018
			m.connect("amd_chrg_brn_by_code_1", "onClick", m.amendChargesLC);
			m.connect("amd_chrg_brn_by_code_2", "onClick", m.amendChargesLC);
			m.connect("amd_chrg_brn_by_code_3", "onClick", m.amendChargesLC);
			m.connect("amd_chrg_brn_by_code_4", "onClick", m.amendChargesLC);
			m.connect("amd_chrg_brn_by_code_5", "onClick", m.amendChargesLC);
			m.connect("amd_chrg_brn_by_code_9", "onClick", m.amendChargesLC);
			m.connect("lc_amt", "onBlur", m.calculateAmendTransactionAmount);
			m.setValidation("requested_confirmation_party_iso_code", m.validateBICFormat);
			m.connect("requested_confirmation_party_iso_code", "onChange", function(){
				var bicCodeValue = this.get("value");
				if(bicCodeValue.length > 0){
					m.setRequiredFields(["requested_confirmation_party_name","requested_confirmation_party_address_line_1"] , false);

				}
			});
			m.connect("req_conf_party_flag", "onChange", function(){
				var reqConfFlagValue = this.get("value");
				if(reqConfFlagValue == "Other"){
					d.byId("requested-conf-party-bank-details").style.display = "block";
					m.toggleFields(true , 
							["requested_confirmation_party_name","requested_confirmation_party_address_line_1","requested_confirmation_party_address_line_2","requested_confirmation_party_dom","requested_confirmation_party_iso_code"],null,null,true);
				}
				else{
					d.byId("requested-conf-party-bank-details").style.display = "none";
					m.toggleFields(false , 
							["requested_confirmation_party_name","requested_confirmation_party_address_line_1","requested_confirmation_party_address_line_2","requested_confirmation_party_dom","requested_confirmation_party_iso_code"],null,null,false);
				}
	 	 	 });			
			m.connect("cfm_chrg_brn_by_code_1", "onClick", m.checkConfirmationCharges);
			m.connect("cfm_chrg_brn_by_code_2", "onClick", m.checkConfirmationCharges);
			m.connect("cr_avl_by_code_1", "onClick", m.togglePaymentDraftAt);
			m.connect("cr_avl_by_code_1", "onClick", m.setDraftTerm);
			m.connect("cr_avl_by_code_2", "onClick", m.togglePaymentDraftAt);
			m.connect("cr_avl_by_code_3", "onClick", m.togglePaymentDraftAt);
			m.connect("cr_avl_by_code_4", "onClick", m.togglePaymentDraftAt);
			m.connect("cr_avl_by_code_5", "onClick", m.togglePaymentDraftAt);
			m.connect("tenor_type_1", "onClick", m.toggleDraftTerm);
			m.connect("tenor_type_1", "onClick", m.setDraftTerm);
			m.connect("tenor_type_2", "onClick", m.toggleDraftTerm);
			m.connect("tenor_type_3", "onClick", m.toggleDraftTerm);
		
			m.connect("last_ship_date", "onChange", function(){
				m.toggleDependentFields(this, dj.byId("narrative_shipment_period"),
						m.getLocalization("shipmentDateOrPeriodExclusivityError"));
			});
			m.connect("last_ship_date", "onClick", function(){
				m.toggleDependentFields(this, dj.byId("narrative_shipment_period"),
						m.getLocalization("shipmentDateOrPeriodExclusivityError"));
			});
			m.connect("tenor_maturity_date", "onBlur", m.setDraftTerm);
			m.connect("tenor_days_type", "onBlur", m.setDraftTerm);
			m.connect("tenor_type_details", "onBlur", m.setDraftTerm);
			// onChange
			m.connect("lc_cur_code", "onChange", function(){
				m.setCurrency(this, ["lc_amt"]);
			});
			m.connect("credit_available_with_bank_type", "onChange", m.setCreditAvailBy);
			m.connect("tenor_period", "onChange", m.setDraftTerm);
			m.connect("tenor_from_after", "onChange", m.setDraftTerm);
			m.connect("tenor_days", "onChange", m.setDraftTerm);
			m.connect("tenor_days_type", "onChange", function(){
				m.toggleFields((this.get("value") == "99"),
						null, ["tenor_type_details"]);
			});
			m.connect("drawee_details_bank_name", "onChange", m.initDraweeFields);
			m.connect("issuing_bank_abbv_name", "onChange", m.populateReferences);
			m.connect("adv_send_mode", "onChange",  function(){
				m.toggleMT798Fields("issuing_bank_abbv_name");
				if(dj.byId("adv_send_mode").get("value") == "01")
				{
					m.toggleRequired("amd_details", true);
				}
				else
				{
					m.toggleRequired("amd_details", false);
				}
			});
			m.connect("issuing_bank_abbv_name", "onChange",  function(){
				m.toggleMT798Fields("issuing_bank_abbv_name");
			});
			//m.connect("issuing_bank_customer_reference", "onChange", m.setApplicantReference);
			m.connect("part_ship_detl_nosend", "onChange", function(){
				var partShipValue = this.get("value");
				dj.byId("part_ship_detl").set("value", this.get("value"));
				//SWIFT 2018
				if(partShipValue == 'CONDITIONAL'){
					
					document.getElementById("infoMessagePartialShipment").style.display = "block";
					document.getElementById("infoMessagePartialShipment").style.paddingLeft = "250px";
				}
				else{
					document.getElementById("infoMessagePartialShipment").style.display = "none";
				}
				m.toggleFields(partShipValue&& partShipValue !== "ALLOWED" &&
								partShipValue !== "NOT ALLOWED" && partShipValue !== "NONE", 
								null, ["part_ship_detl_text_nosend"]);
			});
			
			m.connect("tran_ship_detl_nosend", "onChange", function(){
				var fieldValue = this.get("value");
				dj.byId("tran_ship_detl").set("value", fieldValue);
				//SWIFT 2018
				if(fieldValue == 'CONDITIONAL'){
					d.byId("infoMessageTranshipment").style.display = "block";
					d.byId("infoMessageTranshipment").style.paddingLeft = "250px";
				}
				else{
					d.byId("infoMessageTranshipment").style.display = "none";
				}
				m.toggleFields(fieldValue && fieldValue !== "ALLOWED" &&
								fieldValue !== "NOT ALLOWED" && fieldValue !== "NONE", 
						null, ["tran_ship_detl_text_nosend"]);
				
			});
			m.connect("tenor_days", "onFocus", m.setDraftDaysReadOnly);
			m.connect("tenor_period", "onFocus", m.setDraftDaysReadOnly);
			m.connect("tenor_from_after", "onFocus", m.setDraftDaysReadOnly);
			m.connect("tenor_days_type", "onFocus", m.setDraftDaysReadOnly);
			m.connect("draft_term", "onFocus", function(){
				this.set("readOnly", !dj.byId("cr_avl_by_code_5").get("checked"));
			});
			m.connect("narrative_shipment_period", "onChange", function(){
				m.toggleDependentFields(this, dj.byId("last_ship_date"),
						m.getLocalization("shipmentDateOrPeriodExclusivityError"));
			});
			m.connect("narrative_shipment_period", "onClick", function(){
				m.toggleDependentFields(this, dj.byId("last_ship_date"),
						m.getLocalization("shipmentDateOrPeriodExclusivityError"));
			});
			m.connect("eucp_flag", "onClick", function(){
				m.toggleFields(this.get("checked"),  null, ["eucp_details"]);
			});
			m.connect("inco_term_year", "onChange", function(){
				m.toggleFields(this.get("value"), null, ["inco_term"], false, true);
			});
			m.connect("inco_term", "onChange", function(){
				m.toggleFields(this.get("value"), null, ["inco_place"], false, false);
			});
			m.connect("inco_term_year", "onChange",m.getIncoTerm);
			m.connect("transport_mode_nosend", "onChange", function(){
				var transportModeFieldValue = this.get("value");
				dj.byId("transport_mode").set("value", transportModeFieldValue);
				m.toggleFields(transportModeFieldValue && transportModeFieldValue !== "AIRT" && transportModeFieldValue !== "SEAT" && transportModeFieldValue !== "RAIL" && transportModeFieldValue !== "ROAD" && transportModeFieldValue !== "MULT", 
						null, ["transport_mode_text_nosend"], false, false);
				
			});
			m.connect("transport_mode_text_nosend", "onBlur", function(){
				dj.byId("transport_mode").set("value", this.get("value"));
			});
			m.connect("entity_img_label","onClick",_clearPrincipalFeeAcc);
			
			m.connect("license_lookup","onClick", function(){
				m.getLicenses("lc");
			});
			
			m.connect("lc_cur_code", "onChange", function(){
				m.clearLicenseGrid(this, m._config.lcCurCode,"lc");
			});
			
			m.connect("entity", "onChange", function(){
				m.clearLicenseGrid(this, m._config.applicant,"lc");
			});
			
			m.connect("beneficiary_name", "onChange", function(){
				m.clearLicenseGrid(this, m._config.beneficiary,"lc");
			});
			
			m.connect("exp_date", "onChange", function(){
				m.clearLicenseGrid(this, m._config.expDate,"lc");
			});
			
			m.connect("last_ship_date", "onChange", function(){
				m.clearLicenseGrid(this, m._config.lastShipDate,"lc");
			});
			m.connect("revolving_flag", "onChange", function(){
				if(this.get("checked")) 
				{
					m.animate("fadeIn", d.byId("revolving-details"));
				}
				else 
				{
					m.animate("fadeOut", d.byId("revolving-details"));
					dj.byId("revolve_period").set("value","");
					dj.byId("revolve_frequency").set("value","");
					dj.byId("revolve_time_no").set("value","");
					dj.byId("cumulative_flag").set("checked",false);
					dj.byId("notice_days").set("value","");
				}
			});
			
			m.connect("for_account_flag", "onChange", function(){
				if(this.get("checked")) 
				{
					m.animate("fadeIn", d.byId("alternate-party-details"));
				}
				else 
				{
					m.animate("fadeOut", d.byId("alternate-party-details"));
					dj.byId("alt_applicant_name").set("value","");
					dj.byId("alt_applicant_address_line_1").set("value","");
					dj.byId("alt_applicant_address_line_2").set("value","");
					dj.byId("alt_applicant_dom").set("value","");
					dj.byId("alt_applicant_country").set("value","");

				}
			});
			m.connect("for_account_flag", "onChange", function(){
				m.toggleFields((this.get("value") === "on"), 
						["alt_applicant_address_line_2", "alt_applicant_dom"],["alt_applicant_name", "alt_applicant_address_line_1", "alt_applicant_country"]);
			});
			m.connect("revolve_period", "onBlur", function(){
				m.validateIntegerValue(dj.byId("revolve_period"));
			});
			m.connect("revolve_time_no", "onBlur", function(){
				m.validateIntegerValue(dj.byId("revolve_time_no"));
			});
			m.connect("notice_days", "onBlur", function(){
				m.validateIntegerValue(dj.byId("notice_days"));
			});
			m.connect("applicable_rules", "onChange", function(){
				m.toggleFields((this.get("value") == "99"), null, ["applicable_rules_text"]);
			});
			m.connect("narrative_period_presentation", "onBlur", function(){
				var narrPeriodPresentation = dj.byId("narrative_period_presentation").get("value");
				dj.byId("narrative_period_presentation_nosend").set("value",narrPeriodPresentation);
			});
			m.setValidation("period_presentation_days",m.validatePeriodPresentationDays);
			m.connect("applicant_address_line_4", "onFocus", function(){
				m.showTooltip(m.getLocalization('addressLine4ToolTip', 
						[dj.byId("applicant_address_line_4").get("displayedValue"), dj.byId("applicant_address_line_4").get("value") ]), d.byId("applicant_address_line_4"), [ 'right' ],5000);
			});
			m.connect("beneficiary_address_line_4", "onFocus", function(){
				m.showTooltip(m.getLocalization('addressLine4ToolTip', 
						[dj.byId("beneficiary_address_line_4").get("displayedValue"), dj.byId("beneficiary_address_line_4").get("value") ]), d.byId("beneficiary_address_line_4"), [ 'right' ],5000);
			});
			m.connect("credit_available_with_bank_address_line_4", "onFocus", function(){
				m.showTooltip(m.getLocalization('addressLine4ToolTip', 
						[dj.byId("credit_available_with_bank_address_line_4").get("displayedValue"), dj.byId("credit_available_with_bank_address_line_4").get("value") ]), d.byId("credit_available_with_bank_address_line_4"), [ 'right' ],5000);
			});
			if(dj.byId("dec_amt") && !isNaN(dj.byId("dec_amt").get("value")))
				{
					dj.byId("inc_amt").set("disabled", true);
				}
			if(dj.byId("inc_amt") && !isNaN(dj.byId("inc_amt").get("value")))
			{
				dj.byId("dec_amt").set("disabled", true);
			}
			m.connect("inc_amt", "onBlur", m.amendTransaction);
			m.connect("dec_amt", "onBlur", m.amendTransaction);
			m.connect("inc_amt", "onBlur", function(){
				m.validateAmendAmount(true, this, "lc");
				if(!isNaN(dj.byId("inc_amt").value) && d.number.parse(dijit.byId("inc_amt").get("displayedValue")) > 0 )
					{
						dj.byId("lc_amt").set("value", d.number.parse(dj.byId("org_lc_amt").get("displayedValue")) + d.number.parse(dj.byId("inc_amt").get("displayedValue")));
						dj.byId("inc_amt").set("disabled", false);
						dj.byId("dec_amt").set("disabled", true);
						dj.byId("dec_amt").set('value',"");
					}
				else if(d.number.parse(dijit.byId("inc_amt").get("displayedValue")) < 0 )
					{
						dj.byId("lc_amt").set("value", d.number.parse(dj.byId("org_lc_amt").get("displayedValue")));	
						m.showTooltip(m.getLocalization('valueShouldBeGreaterThanZero',[ dj.byId("inc_amt").get("displayedValue")]), d.byId("inc_amt"), [ 'after' ],5000);
						misys.dialog.show("ERROR", dj.byId("inc_amt").invalidMessage, "", function(){
							dj.byId("inc_amt").focus();
							dj.byId("inc_amt").set("state","Error");
						});
						return false;
					}
				return true;
			}); 
			m.connect("dec_amt", "onBlur", function(){
				validateDecreaseAmount();
				m.validateAmendAmount(true, this, "lc");
				if(!isNaN(dj.byId("dec_amt").value))
				{
					if(d.number.parse(dj.byId("org_lc_amt").get("displayedValue")) < d.number.parse(dj.byId("dec_amt").get("displayedValue")))
							{
								m.showTooltip(m.getLocalization('decreaseAmountShouldBeLessThanLCAmount',[ dj.byId("dec_amt").get("displayedValue")]), d.byId("dec_amt"), [ 'after' ],5000);
								misys.dialog.show("ERROR", dj.byId("dec_amt").invalidMessage, "", function(){
									dj.byId("dec_amt").focus();
									dj.byId("dec_amt").set("state","Error");
								});
								return false;
							}
					else if(d.number.parse(dijit.byId("dec_amt").get("displayedValue")) < 0 )
							{
								dj.byId("lc_amt").set("value", d.number.parse(dj.byId("org_lc_amt").get("displayedValue")));
								m.showTooltip(m.getLocalization('valueShouldBeGreaterThanZero',[ dj.byId("dec_amt").get("displayedValue")]), d.byId("dec_amt"), [ 'after' ],5000);
								misys.dialog.show("ERROR", dj.byId("dec_amt").invalidMessage, "", function(){
									dj.byId("dec_amt").focus();
									dj.byId("dec_amt").set("state","Error");
								});
								return false;
							}
					else if(d.number.parse(dj.byId("dec_amt").get("displayedValue")) > 0)
						{
							dj.byId("lc_amt").set("value", d.number.parse(dj.byId("org_lc_amt").get("displayedValue")) - d.number.parse(dj.byId("dec_amt").get("displayedValue")));
							dj.byId("dec_amt").set("disabled", false);
							dj.byId("inc_amt").set("disabled", true);
							dj.byId("inc_amt").set('value',"");
						}
				}
				return true;
			});
			m.connect("lc_amt", "onBlur", function(){				
				var oriLcAmt = d.number.parse(dj.byId("org_lc_amt").get("displayedValue")),
					newLcAmt = d.number.parse(dj.byId("lc_amt").get("displayedValue"));
			if(!isNaN(newLcAmt))
			{
				if(oriLcAmt > newLcAmt)
					{
						dj.byId("dec_amt").set('value',oriLcAmt - newLcAmt);
						dj.byId("dec_amt").set("disabled", false);
						dj.byId("inc_amt").set("disabled", true);
						dj.byId("inc_amt").set("value", "");
					}
				if(oriLcAmt < newLcAmt)
					{
						dj.byId("inc_amt").set('value', newLcAmt - oriLcAmt);
						dj.byId("inc_amt").set("disabled", false);
						dj.byId("dec_amt").set("disabled", true);
						dj.byId("dec_amt").set("value", "");
					}
				if(oriLcAmt === newLcAmt)
				{
					dj.byId("inc_amt").set("value", "");
					dj.byId("inc_amt").set("disabled", false);
					dj.byId("dec_amt").set("value", "");
					dj.byId("dec_amt").set("disabled", false);					
				}
			}
				if(d.number.parse(dj.byId("lc_amt").get("displayedValue")) <= 0)
				{
					m.showTooltip(m.getLocalization('valueShouldBeGreaterThanZero',[ dj.byId("lc_amt").get("displayedValue")]), d.byId("lc_amt"), [ 'after' ],5000);
					misys.dialog.show("ERROR", dj.byId("lc_amt").invalidMessage, "", function(){
						dj.byId("dec_amt").set("value", "");
						dj.byId("inc_amt").set("value", "");
						dj.byId("dec_amt").set("disabled", false);
						dj.byId("inc_amt").set("disabled", false);
						dj.byId("lc_amt").set("state","Error");
					});
					return false;
				}
				if(isNaN(d.number.parse(dj.byId("lc_amt").get("displayedValue"))))
				{
					dj.byId("dec_amt").set("value", "");
					dj.byId("inc_amt").set("value", "");
					dj.byId("dec_amt").set("disabled", false);
					dj.byId("inc_amt").set("disabled", false);
					dj.byId("lc_amt").set("state","Error");
					return false;
				}
				return true;
			});
		}, 
		onFormLoad : function() {
			//  summary:
		    //  Events to perform on page load.	
			//AJAX Call
			m.xhrPost({
						url : misys.getServletURL("/screen/AjaxScreen/action/GetAmendmentWarning"),
						handleAs 	: "json",
						sync 		: true,
						content 	: {
										refId  : dj.byId("ref_id").get('value'),
										companyId : dj.byId("company_id").get('value'),
										productCode : 'LC'
									  },
						load		: function(response, args){
										m._config.showWarningBene 	= 	response.showWarningBene ? response.showWarningBene : false;
									  }
			});
	
			if(m._config.showWarningBene)
				{
					m.dialog.show("CONFIRMATION", m.getLocalization("warningMsgAmendLC"), "", 
							"", "","","",function(){
						var amenScreenURL = "/screen/LetterOfCreditScreen?option=EXISTING&tnxtype=03";
						window.location.href = misys.getServletURL(amenScreenURL);
						return;
							}
						);
				}
			// set the controls blank for amendment -- start
			var mode = m._config.displayMode;
			// set the controls blank for amendment -- end		
			m._config.lcCurCode = dj.byId("lc_cur_code").get("value");
			m._config.beneficiary.name = dj.byId("beneficiary_name").get("value");
			m._config.beneficiary.addressLine1 = dj.byId("beneficiary_address_line_1").get("value");
			m._config.beneficiary.addressLine2 = dj.byId("beneficiary_address_line_2").get("value");
			m._config.beneficiary.dom = dj.byId("beneficiary_dom").get("value");
			m._config.expDate = dj.byId("exp_date").get("displayedValue");
			m._config.lastShipDate = dj.byId("last_ship_date").get("displayedValue");
			
			var issuingBankAbbvName = dj.byId("issuing_bank_abbv_name").get('value');
			var isMT798Enable = m._config.customerBanksMT798Channel[issuingBankAbbvName] === true;
			 var handle = dojo.subscribe(_deleteGridRecord, function(){
				 m.toggleFields(m._config.customerBanksMT798Channel[issuingBankAbbvName] === true && m.hasAttachments(), null, ["delivery_channel"], false, false);
			 });
			
			//SWIFT 2018
			//If Confirmation Instructions is not 'Maybe' or 'Confirm' ,disable Requested Confirmation Party
			if(mode =="edit"){
				m.resetRequestedConfirmationParty();				
			}
			//While loading the page check if the Transhipment and PartialShipment dropdown has 'CONDITIONAL' set,
			//then the information text must be displayed 
			var transFieldValue = dj.byId("tran_ship_detl").value;
			var partShipFieldValue = dj.byId("part_ship_detl").value;
			if((transFieldValue === 'CONDITIONAL') && mode ==="edit"){
				d.byId("infoMessageTranshipment").style.display = "block";
				d.byId("infoMessageTranshipment").style.paddingLeft = "250px";
			}
			else{
				d.byId("infoMessageTranshipment").style.display = "none";
			}
			if((partShipFieldValue === 'CONDITIONAL') && mode === "edit"){
				d.byId("infoMessagePartialShipment").style.display = "block";
				d.byId("infoMessagePartialShipment").style.paddingLeft = "250px";
			}
			else{
				d.byId("infoMessagePartialShipment").style.display = "none";
			}
			if(dj.byId("req_conf_party_flag")){			
				var requestedConfirmationFlag=dj.byId("req_conf_party_flag").value;		
				if(requestedConfirmationFlag == "Other"){
					d.byId("requested-conf-party-bank-details").style.display = "block";
				}else{
					d.byId("requested-conf-party-bank-details").style.display = "none";
				}
			}
			if(dj.byId("amd_chrg_brn_by_code_4") || dj.byId("amd_chrg_brn_by_code_5")){
				if(!(dj.byId("amd_chrg_brn_by_code_4").get("value")|| (dj.byId("amd_chrg_brn_by_code_5") && dj.byId("amd_chrg_brn_by_code_5").get("value")))){
					var amdChargesArea = dj.byId("narrative_amend_charges_other");
					if(amdChargesArea){
						amdChargesArea.set("value", "");
						amdChargesArea.set("disabled", true);	
					}
				}
			}		
			// Additional onload events for dynamic fields
			m.setCurrency(dj.byId("lc_cur_code"),
					["inc_amt", "dec_amt", "org_lc_amt", "lc_amt","tnx_amt"]);
			var bankType = dj.byId("credit_available_with_bank_type");
			if(bankType)
			{
				bankType.onChange();
			}
			
			var shipDetlSelect = dj.byId("part_ship_detl_nosend");
			if(shipDetlSelect)
			{
				var shipDetlValue = shipDetlSelect.get("value");
				m.toggleFields(shipDetlValue && shipDetlValue !== "ALLOWED" &&
						shipDetlValue !== "NOT ALLOWED" && shipDetlValue !== "NONE", 
						null, ["part_ship_detl_text_nosend"], true);
			}
			var shipDetl = dj.byId("part_ship_detl");
			if(shipDetl && shipDetl.get("value") === "") {
				shipDetl.set("value", shipDetlSelect.get("value"));
			}

			var tranShipDetlSelect = dj.byId("tran_ship_detl_nosend");
			if(tranShipDetlSelect)
			{
				var fieldValue = tranShipDetlSelect.get("value");
				m.toggleFields(fieldValue && fieldValue !== "ALLOWED" &&
						fieldValue !== "NOT ALLOWED" && fieldValue !== "NONE", 
						null, ["tran_ship_detl_text_nosend"]);
			}
			var tranShipDetl = dj.byId("tran_ship_detl");
			if(tranShipDetl && tranShipDetl.get("value") === "") {
				tranShipDetl.set("value", tranShipDetlSelect.get("value"));
			}
			
			// First activate radio buttons depending on which "Credit/Available By" is selected
			var checkboxes = ["cr_avl_by_code_1", "cr_avl_by_code_2", "cr_avl_by_code_3",
					"cr_avl_by_code_4", "cr_avl_by_code_5"];
			
			d.forEach(checkboxes, function(id){
				var checkbox = dj.byId(id);
				if(checkbox && checkbox.get("checked")) {
					checkbox.onClick();
				}
			});
		
			var eucpFlag = dj.byId("eucp_flag");
			if(eucpFlag) {
				m.toggleFields(eucpFlag.get("checked"), null, ["eucp_details"]);
			}
			
			// display the other field, if we have to
			var tenorDaysType = dj.byId("tenor_days_type") ?
					dj.byId("tenor_days_type").get("value") : "";
			if(tenorDaysType) {
				m.toggleFields(tenorDaysType === "99",null, ["tenor_type_details"], true);
			}
			
			// Populate references
			//When courier is the mode,attachments field must not be enableds
			var issuingBankAbbvNameId = dj.byId("issuing_bank_abbv_name");
			if(issuingBankAbbvNameId) {
				issuingBankAbbvNameId.onChange();
			}
			
			var issuingBankCustRef = dj.byId("issuing_bank_customer_reference");
			if(issuingBankCustRef) {
				issuingBankCustRef.onChange();
			}
			
			var crAvlByCode1Checked = dj.byId("cr_avl_by_code_1").get("checked"),
			crAvlByCode2Checked = dj.byId("cr_avl_by_code_2").get("checked"),
	    	crAvlByCode3Checked = dj.byId("cr_avl_by_code_3").get("checked"),
	    	crAvlByCode5Checked = dj.byId("cr_avl_by_code_5").get("checked");
			if(!crAvlByCode1Checked && !crAvlByCode2Checked && !crAvlByCode3Checked && !crAvlByCode5Checked){
				m.setDraftTerm();
			}
			
			var draweeDetailsBankName = dj.byId("drawee_details_bank_name");
			if(draweeDetailsBankName) {
				draweeDetailsBankName.onChange();
			}
			
			var incoTerm = dj.byId("inco_term") ? dj.byId("inco_term").get("value") : "";
			if(incoTerm) {
				m.toggleFields(incoTerm, null, ["inco_place"], false, true);
			}
			else{
				m.toggleFields(incoTerm, null, ["inco_place"], false, false);
			}
			 
			var transportModeSelect = dj.byId("transport_mode_nosend");
			if(transportModeSelect)
			{
				var transportModeSelectValue = transportModeSelect.get("value");
				m.toggleFields(transportModeSelectValue && transportModeSelectValue !== "AIRT" && transportModeSelectValue !== "SEAT" && transportModeSelectValue !== "RAIL" && transportModeSelectValue !== "ROAD" && transportModeSelectValue !== "MULT", 
						null, ["transport_mode_text_nosend"]);
			}
			var transportMode = dj.byId("transport_mode");
			if(transportMode && transportMode.get("value") === "") {
				transportMode.set("value", transportModeSelect.get("value"));
			}
			if(dj.byId("revolving_flag"))
			{
				if(dj.byId("revolving_flag").get("checked")) 
				{
					m.animate("fadeIn", d.byId("revolving-details"));
				}
				else 
				{
					m.animate("fadeOut", d.byId("revolving-details"));
					dj.byId("revolve_period").set("value","");
					dj.byId("revolve_frequency").set("value","");
					dj.byId("revolve_time_no").set("value","");
					dj.byId("cumulative_flag").set("checked",false);
					dj.byId("notice_days").set("value","");
				}
			}
			if(dj.byId("for_account_flag"))
			{
				if(dj.byId("for_account_flag").get("checked")) 
				
				{
					m.animate("fadeIn", d.byId("alternate-party-details"));
				}
				else 
				{
					m.animate("fadeOut", d.byId("alternate-party-details"));
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
			if(dj.byId("formLoad"))
			{
				dj.byId("formLoad").set("value","false");
			}
			var srRule = dj.byId("applicable_rules");
			if(srRule) {
				m.toggleFields(
						srRule.get("value") == "99",
						null, ["applicable_rules_text"]);
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
			m.populateGridOnLoad("lc");
			m.toggleNarrativeDivStatus(true,'');
		}, 
		
		beforeSaveValidations : function(){
	    	var entity = dj.byId("entity") ;
	    	var feeAccount = dj.byId("fee_act_no");
	    		
	    	var principleAccount = dj.byId("principal_act_no");
			if(principleAccount && principleAccount.get('value')!== "")
			{
				if(!m.validatePricipleAccount(""))
				{
					m._config.onSubmitErrorMsg = m.getLocalization('invalidPrincipleAccountError',[ principleAccount.get("displayedValue")]);
					m.showTooltip(m.getLocalization('invalidPrincipleAccountError',[ principleAccount.get("displayedValue")]), principleAccount.domNode);
					principleAccount.focus();
					return false;
				}
			}
	    	
	    	if(feeAccount && feeAccount.get('value')!== "")
			{
				if(!m.validateFeeAccount(""))
				{
					m._config.onSubmitErrorMsg = m.getLocalization('invalidFeeAccountError',[ feeAccount.get("displayedValue")]);
					m.showTooltip(m.getLocalization('invalidFeeAccountError',[ feeAccount.get("displayedValue")]), feeAccount.domNode);
					feeAccount.focus();
					return false;
				}
			}
	    	if(entity && entity.get("value")== "")
            {
                    return false;
            }
            else
            {
                    return true;
            }
	    
	    	
	    },
		
		beforeSubmitValidations : function(){
			
			//General text form fields comparison
			var generalTextFormFields = ["alt_applicant_name" , "alt_applicant_address_line_1","alt_applicant_address_line_2","alt_applicant_address_line_4",
				"alt_applicant_dom","alt_applicant_country","beneficiary_name","beneficiary_address_line_1",
				"beneficiary_address_line_2","beneficiary_dom","beneficiary_address_line_4","beneficiary_country","beneficiary_reference",
				"ship_from","ship_loading","ship_discharge","ship_to","part_ship_detl","tran_ship_detl",
				"narrative_period_presentation","narrative_shipment_period","narrative_additional_amount","applicable_rules",
				"credit_available_with_bank_name","credit_available_with_bank_role_code","credit_available_with_bank_address_line_1","credit_available_with_bank_address_line_2",
				"req_conf_party_flag","requested_confirmation_party_name","requested_confirmation_party_address_line_1","requested_confirmation_party_address_line_2","requested_confirmation_party_iso_code","drawee_details_bank_name",
				"adv_send_mode","expiry_place","requested_confirmation_party_address_line_4"] ;
			
			var checkboxFields = ["irv_flag","ntrf_flag","stnd_by_lc_flag"];
			var radioButtonFields = ["cfm_inst_code_1","cfm_inst_code_2","cfm_inst_code_3","open_chrg_brn_by_code_1","open_chrg_brn_by_code_2",
									"corr_chrg_brn_by_code_1","corr_chrg_brn_by_code_2","cfm_chrg_brn_by_code_1","cfm_chrg_brn_by_code_2",
									"amd_chrg_brn_by_code_1","amd_chrg_brn_by_code_2","amd_chrg_brn_by_code_3","amd_chrg_brn_by_code_4",
									"cr_avl_by_code_1","cr_avl_by_code_2","cr_avl_by_code_3","cr_avl_by_code_4","cr_avl_by_code_5","tenor_type_1","tenor_type_2","tenor_type_3"];
			var numFieldsToCheckAgainstOrg = [
				"pstv_tol_pct", "neg_tol_pct","lc_amt"];
						
			// Check date values against their org_ values
			var dateFieldsToCheckAgainstOrg = ["exp_date","last_ship_date"];
		//Perform these validations only in edit form	
		if(m._config.displayMode === "edit"){
			//every returns true if the condition is true for every array element,false otherwise
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
			// Check number field values against their org_ values
			var numFieldsMatch = d.every(numFieldsToCheckAgainstOrg, function(id){
				
				var value = dj.byId(id).get("value");
				var orgValue = dj.byId("org_" + id).get("value");
				
				// For number fields, or other invalid fields, map to an empty string
				if(isNaN(value) || value == "null" || value == "undefined") {
					value = "";
				}

				if(value == orgValue){
					return true;
				}
				return false;
			});
			
			var dataStoreNarrative = [m._config.narrativeDescGoodsDataStore,m._config.narrativeDocsReqDataStore,m._config.narrativeAddInstrDataStore,m._config.narrativeSpBeneDataStore,m._config.narrativeSpRecvbankDataStore];
			var narrativesAmended = false;
			for(var itr = 0; itr < 5; itr++){
				d.forEach(dataStoreNarrative[itr], function(){
					if(!(dataStoreNarrative[itr].length == 0 || dataStoreNarrative[itr] == undefined)){
						narrativesAmended = true;
					}
				});
			}
			
			//Compare all text form fields in amendment screen.'generalTextFormFields' array which stores these fields.
			var generalTextFormFieldsCompare=m.compareTransactionMaster(generalTextFormFields , "TXT");	
			var checkBoxFormFieldsCompare=m.compareTransactionMaster(checkboxFields , "CHECK");		
			var radioButtonFormCompare=m.compareTransactionMasterRadio(radioButtonFields);
			if(!generalTextFormFieldsCompare && !checkBoxFormFieldsCompare && !radioButtonFormCompare && allDateFieldsMatch && numFieldsMatch && !narrativesAmended){
				m._config.onSubmitErrorMsg = m.getLocalization("noAmendmentError");
				return false;
			}
			
		}
			
			// Validate LC amount should be greater than zero
			if(dj.byId("lc_amt"))
			{
				if(!m.validateAmount((dj.byId("lc_amt"))?dj.byId("lc_amt"):0))
				{
					m._config.onSubmitErrorMsg =  m.getLocalization("amountcannotzero");
					dj.byId("lc_amt").set("value","");
					return false;
				}
			}           
			
			/*Validates the narrative text content size and includes z-char validation*/
			if(dj.byId("adv_send_mode") && dj.byId("adv_send_mode").get("value") == 1)
			{
				//Commented code is to set the exclamation mark on the narrative tab group titles, in case of validation failure.(To be implemented)
				/*var arrayOfFields = ["Description of Goods","Documents Required","Additional Instructions"];
				for(var itr = 0; itr < arrayOfFields.length; itr++){
					dijit.byId("narrative-details-tabcontainer").selectedChildWidget.set("title","<span class='tabChangeStyle'>"+arrayOfFields[itr]+"</span><img class='errorIcon' src='/content/images/warning.png' alt='This tab contains fields that are in error' title='This tab contains fields that are in error'>");
				}
				dijit.byId("narrative-special-payments-beneficiary-tabcontainer").selectedChildWidget.set("title","<span class='tabChangeStyle'>Special Payment Conditions for Beneficiary</span><img class='errorIcon' src='/content/images/warning.png' alt='This tab contains fields that are in error' title='This tab contains fields that are in error'>");*/
				var issuingBankAbbvName = dj.byId("issuing_bank_abbv_name").get('value');
				var i,itrNarr = 0, msgRows = 0, fieldSize = 0, smoothScrollTab = "narrative-details-tabcontainer", lengthValidationPassed = true, flag, is798 = m._config.customerBanksMT798Channel[issuingBankAbbvName];
				var regex=dj.byId("swiftregexzcharValue").get("value");
				var swiftregexp = new RegExp(regex);
				m._config.isNarrativeZCharValidArray = [true, true, true, true, true]; //To store the status of individual narrative fields. Used in tooltip in common.js
				var singleMsgRows = [0, 0, 0, 0, 0];
				m._config.isSingleNarrativeValid = [true, true, true, true, true];
				var domNodeArray = ["tabNarrativeDescriptionGoods","tabNarrativeDocumentsRequired","tabNarrativeAdditionalInstructions","tabNarrativeSpecialBeneficiary","tabNarrativeSpecialReceivingBank"];
				
				if(document.getElementById("tabNarrativeDescriptionGoods").status == true){
					for(itr = 0; itr < 5; itr++){
						i = 0; flag = true;
						if(dataStoreNarrative && dataStoreNarrative[itr]){
							d.forEach(dataStoreNarrative[itr], function(){
								if(dataStoreNarrative[itr][i] && dataStoreNarrative[itr][i] !== null && flag){
									dataStoreNarrative[itr][i].content[0].replace(/&#xa;/g,'\n');
									fieldSize += dataStoreNarrative[itr][i].content[0].length;
									msgRows += dataStoreNarrative[itr][i].text_size[0];
									singleMsgRows[itr] += dataStoreNarrative[itr][i].text_size[0];
									flag = swiftregexp.test(dataStoreNarrative[itr][i].content[0]);
									m._config.isNarrativeZCharValidArray[itr] = flag;
								}
								i++;
							});
						}
						
						if(!m._config.isNarrativeZCharValidArray[itr] || 
								(dojo.some(singleMsgRows, function(status){ return status > (is798 ? 792 : 800);}))){
							if(!m._config.isNarrativeZCharValidArray[itr]){
								m.toggleNarrativeDivStatus(m._config.isNarrativeZCharValidArray[itr], domNodeArray[itr]);	
							}
							else if(singleMsgRows[itr] > (is798 ? 792 : 800)) {
								m._config.isSingleNarrativeValid[itr] = false;
								m.toggleNarrativeDivStatus(m._config.isSingleNarrativeValid[itr], domNodeArray[itr]);
								lengthValidationPassed = false;
							}
						}
					}
					if(msgRows >  (is798 ? 992 : 1000)) {
						d.forEach(m._config.isSingleNarrativeValid, function(){
							m._config.isSingleNarrativeValid[itrNarr] = true;
						});
						m.toggleNarrativeDivStatus(false);
						lengthValidationPassed = false;
					}
				}
				else if(msgRows > (is798 ? 992 : 1000) || document.getElementById("tabNarrativeDescriptionGoods").status == false){
					itrNarr = 0;
					d.forEach(m._config.isSingleNarrativeValid, function(){
						m._config.isSingleNarrativeValid[itrNarr] = true;
					});
					if(document.getElementById("tabNarrativeDescriptionGoods").status == true){
						m.toggleNarrativeDivStatus(false);
					}
					lengthValidationPassed = false;
				}
				if(!lengthValidationPassed || (dojo.some(m._config.isNarrativeZCharValidArray, function(narrativeStatus){ return narrativeStatus == false; }))){
					if(m._config.isNarrativeZCharValidArray.indexOf(false) > 3){
						smoothScrollTab = "narrative-special-payments-beneficiary-tabcontainer";
					}
					 dojox.fx.smoothScroll({
							node: document.getElementById(smoothScrollTab), 
							win: window
						}).play();
	         	 return false;
				}
			}
			/*Validate to check if either 'Bank Name' & 'Address' or BIC code is entered for the dropdown selected in
			Requested Confirmation Party
			Perform these validations before form submit only if RQF is not null and not blank
		*/		
			if(dj.byId("req_conf_party_flag") && dj.byId("req_conf_party_flag").get("value") !== ""){		
				if (dj.byId("req_conf_party_flag").get("value") === "Other"){
					  if(!m.validateBankEntry("requested_confirmation_party")){
						  m._config.onSubmitErrorMsg =  m.getLocalization("requestedConfirmationPartyError");
						  return false;
					  }
				}				
			}
			if(dj.byId("narrative_period_presentation_nosend") && dj.byId("narrative_period_presentation_nosend").get("value") !== ""){
				var narrative_period_presentation = dj.byId("narrative_period_presentation_nosend").get("value");
				
				if(narrative_period_presentation.indexOf("\n") != -1){
					m._config.onSubmitErrorMsg =  m.getLocalization("periodOfPresentaionError");
					return false;
				}
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
			
			return  m.validateLSAmtSumAgainstTnxAmt("lc");
		},
		
		beforeSubmit : function() {
			m.updateSubTnxTypeCode("lc");
		}
		
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.trade.amend_lc_swift2018_client');