dojo.provide("misys.binding.trade.create_lc");

//
// Copyright (c) 2000-2011 Misys (http://www.m.com),
// All Rights Reserved. 
//
//
// Summary: 
//      Event Binding for Letter of Credit (LC) Form, Customer Side.
//
// version:   1.2
// date:      08/04/11
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
dojo.require("misys.binding.trade.create_lc_swift");
dojo.require("misys.purchaseorder.widget.PurchaseOrder");
dojo.require("misys.purchaseorder.widget.PurchaseOrders");
dojo.require("misys.purchaseorder.FormPurchaseOrderEvents");




(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode
	var notAllowed = "NOT ALLOWED";
	var allowed ="ALLOWED";
	var revolvingDetails ="revolving-details";
	var altPartyDetails ="alternate-party-details";
	//
	// Private functions & variables
	//
    // dojo.subscribe once a record is deleted from the grid
	
	function _validateDescOfGoods()
	{
		if((dj.byId("adv_send_mode") && dj.byId("adv_send_mode").get("value")==='01') && (dj.byId("inco_term") && dj.byId("inco_term").get("value")!='') )
		{
			var maxSize=98;
			if(m._config.swiftExtendedNarrativeEnabled){
				maxSize=798;	
			}
			if(dj.byId("narrative_description_goods") && dj.byId("narrative_description_goods").get("value")!== "" && dijit.byId("narrative_description_goods").rowCount > maxSize)
			{

				misys.dialog.show("ERROR", misys.getLocalization("descOfGoodsExceedMaxWhenIncoTermSelected"), "", function(){
					dj.byId("narrative_description_goods").focus();
				 	dj.byId("narrative_description_goods").set("state","Error");
				});
				return false;
			} 	
			else
			{
				return true;
			}
		}
		return true;		
	}
	
	
	
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

	//
	// Public functions & variables
	
	d.mixin(m._config, {

		initReAuthParams : function() {
									
			var reAuthParams = {
				productCode : 'LC',	
				subProductCode : '',
				transactionTypeCode : '01',	
				entity : dj.byId("entity") ? dj.byId("entity").get("value") : '',
				currency : dj.byId("lc_cur_code")? dj.byId("lc_cur_code").get("value") : "",				
				amount : dj.byId("lc_amt")? m.trimAmount(dj.byId("lc_amt").get("value")) : "",
				bankAbbvName :	dj.byId("issuing_bank_abbv_name")? dj.byId("issuing_bank_abbv_name").get("value") : "",
								
				
				es_field1 : '',
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
					var i = 0, verb, text, subXML;
					var arrayOfNarratives = ["narrative_description_goods","narrative_documents_required","narrative_additional_instructions","narrative_special_beneficiary"];
					for(var itr = 0; itr < 4; itr++){
						subXML = itr == 0 ? subTDXML.substring(0,subTDXML.indexOf("<"+arrayOfNarratives[itr]+">")) : subXML.substring(0,subXML.indexOf("<"+arrayOfNarratives[itr]+">"));
						subXML = subXML.concat("<"+arrayOfNarratives[itr]+">");
						if(dj.byId(arrayOfNarratives[itr])){
							subXML = subXML.concat("<![CDATA[");
							subXML = subXML.concat("<issuance>");
							subXML = subXML.concat("<sequence>");
							subXML = subXML.concat("0");
							subXML = subXML.concat("</sequence>");
							subXML = subXML.concat("<data>");
							subXML = subXML.concat("<datum>");
							subXML = subXML.concat("<id>");
							subXML = subXML.concat("0");
							subXML = subXML.concat("</id>");
							subXML = subXML.concat("<verb>");
							subXML = subXML.concat("ISSUANCE");
							subXML = subXML.concat("</verb>");
							subXML = subXML.concat("<text>");
							subXML = subXML.concat("]]><![CDATA[" + dojo.trim(dj.byId(arrayOfNarratives[itr]).get("value")));
							subXML = subXML.concat("</text>");
							subXML = subXML.concat("</datum>");
							subXML = subXML.concat("</data>");
							subXML = subXML.concat("</issuance>");
							subXML = subXML.concat("]]>");
						}
						subXML = subXML.concat(subTDXML.substring(subTDXML.indexOf("</"+arrayOfNarratives[itr]+">"),subTDXML.length));
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
			m.setValidation("template_id", m.validateTemplateId);
			m.setValidation("tenor_maturity_date", m.validateMaturityDate);
			m.setValidation("exp_date", m.validateTradeExpiryDate);
			m.setValidation("pstv_tol_pct", m.validateTolerance);
			m.setValidation("neg_tol_pct", m.validateTolerance);
			m.setValidation("max_cr_desc_code", m.validateMaxCreditTerm);
			m.setValidation("last_ship_date", m.validateLastShipmentDate);
			m.setValidation("lc_cur_code", m.validateCurrency);
			m.setValidation('beneficiary_country', m.validateCountry);
			m.setValidation("alt_applicant_country", m.validateCountry);
			
			//Lineitems
			m.setValidation('lc_cur_code', m.validateCurrency);
			m.setValidation('fake_total_cur_code', m.validateCurrency);
			m.setValidation('total_net_cur_code', m.validateCurrency);
			m.setValidation('line_item_price_cur_code', m.validateCurrency);
			m.setValidation('line_item_total_net_cur_code', m.validateCurrency);

			m.connect("irv_flag", "onClick", m.checkIrrevocableFlag);
			m.connect("ntrf_flag", "onClick", m.checkNonTransferableFlag);
			m.connect("stnd_by_lc_flag", "onClick", m.checkStandByFlag);
						
			if(m._config.charge_splitting_lc){
				if(dj.byId("open_chrg_brn_by_code_3")){ // if defined					
					dj.byId("open_chrg_brn_by_code_3").set("disabled", false);
					dj.byId("corr_chrg_brn_by_code_3").set("disabled", false);
					
					m.connect("open_chrg_brn_by_code_1", "onClick", m.checkApplBeneCharges);
					m.connect("open_chrg_brn_by_code_2", "onClick", m.checkApplBeneCharges);
					m.connect("open_chrg_brn_by_code_3", "onClick", m.checkApplBeneCharges);
					
					m.connect("corr_chrg_brn_by_code_1", "onClick", m.checkApplBeneCharges);
					m.connect("corr_chrg_brn_by_code_2", "onClick", m.checkApplBeneCharges);
					m.connect("corr_chrg_brn_by_code_3", "onClick", m.checkApplBeneCharges);
							
					if(dj.byId("open_chrg_brn_by_code_3").get("checked")) {
						dj.byId("open_chrg_applicant").set("disabled", false).set("required", true);
						dj.byId("open_chrg_beneficiary").set("disabled", false).set("required", true);
					}
					if(dj.byId("corr_chrg_brn_by_code_3").get("checked")) {
						dj.byId("corr_chrg_applicant").set("disabled", false).set("required", true);
						dj.byId("corr_chrg_beneficiary").set("disabled", false).set("required", true);
					}
				}
				if(dj.byId("cfm_chrg_brn_by_code_3")){ // if defined
					dj.byId("cfm_chrg_brn_by_code_3").set("disabled", false);
					m.connect("cfm_chrg_brn_by_code_3", "onClick", m.checkConfirmationCharges);
					if(dj.byId("cfm_chrg_brn_by_code_3").get("checked")) {
						dj.byId("cfm_chrg_applicant").set("disabled", false).set("required", true);
						dj.byId("cfm_chrg_beneficiary").set("disabled", false).set("required", true);
					}					
				}
			}
			m.connect("cfm_chrg_brn_by_code_1", "onClick", m.checkConfirmationCharges);
			m.connect("cfm_chrg_brn_by_code_2", "onClick", m.checkConfirmationCharges);
			m.connect("cr_avl_by_code_1", "onClick", m.togglePaymentDraftAt);
			m.connect("cr_avl_by_code_1", "onClick", m.setDraftTerm);
			m.connect("cr_avl_by_code_2", "onClick", m.togglePaymentDraftAt);
			m.connect("cr_avl_by_code_3", "onClick", m.togglePaymentDraftAt);
			m.connect("cr_avl_by_code_4", "onClick", m.togglePaymentDraftAt);
			m.connect("cr_avl_by_code_5", "onClick", m.togglePaymentDraftAt);
			m.connect("cr_avl_by_code_5", "onChange", function(){
				dj.byId("draft_term").set("value" , "");
			});	
			m.connect("cr_avl_by_code_2", "onClick", m.setDraftTerm);
			m.connect("cr_avl_by_code_2", "onClick", m.setDraweeDetailBankName);
			m.connect("cr_avl_by_code_3", "onClick", m.setDraftTerm);
			m.connect("cr_avl_by_code_3", "onClick", m.setDraweeDetailBankName);
			m.connect("cr_avl_by_code_4", "onClick", m.setDraftTerm);
			m.connect("adv_send_mode", "onClick", m.setDraftTerm);
			m.connect("tenor_type_1", "onClick", m.toggleDraftTerm);
			m.connect("tenor_type_1", "onClick", m.setDraftTerm);
			m.connect("tenor_type_2", "onClick", m.toggleDraftTerm);
			m.connect("tenor_type_3", "onClick", m.toggleDraftTerm);
			
			m.connect("pstv_tol_pct", "onChange", function(){
				if(dj.byId("booking_amt"))
					{
					
					m.validateLimitBookingAmount("true");
					}
				
				});
			
			m.connect("lc_amt", "onBlur", function(){
				m.setTnxAmt(this.get("value"));
				m.validateLimitBookingAmount("true");
			});
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
			m.connect("issuing_bank_abbv_name", "onChange", m.updateBusinessDate);
			if(dj.byId("issuing_bank_abbv_name"))
			{
				m.connect("entity", "onChange", function(){
					dj.byId("issuing_bank_abbv_name").onChange();
					if(dj.byId("issuing_bank_customer_reference"))
					{
					m.populateFacilityReference(dj.byId("issuing_bank_customer_reference"));
					}
					});
			}
			m.connect("adv_send_mode", "onChange",  function(){
				m.toggleMT798Fields("issuing_bank_abbv_name");
			});
			m.connect("issuing_bank_abbv_name", "onChange",  function(){
				m.toggleMT798Fields("issuing_bank_abbv_name");
			});
			
			m.connect("issuing_bank_abbv_name", "onChange",  function(){
				if(dj.byId("issuing_bank_abbv_name").get("value")!="")
			{
					m.getIncoYear();
			}
			});
			m.connect("inco_term_year", "onChange",m.getIncoTerm);
	
			m.connect("inco_term_year", "onClick",function(){
				if(dj.byId("issuing_bank_abbv_name").get("value")=="" &&  (this.store._arrayOfAllItems==undefined || this.store._arrayOfAllItems.length==0))
					{
					m.dialog.show("ERROR", m.getLocalization("selectBankToProceed"), '', '');
					}
			});
			m.connect("inco_term", "onClick",function(){
				if(dj.byId("issuing_bank_abbv_name").get("value")=="" &&  (this.store._arrayOfAllItems==undefined || this.store._arrayOfAllItems.length==0))
					{
					m.dialog.show("ERROR", m.getLocalization("selectBankToProceed"), '', '');
					}
				else if (dj.byId("inco_term_year").get("value")=="" &&  (this.store._arrayOfAllItems==undefined || this.store._arrayOfAllItems.length==0))
					{
					m.dialog.show("ERROR", m.getLocalization("selectIncoYearToProceed"), '', '');
					}
			});
			
			
			
			m.connect("issuing_bank_customer_reference", "onChange", m.setApplicantReference);
			m.connect("issuing_bank_customer_reference", "onChange", function()
					{
				if(dj.byId("issuing_bank_customer_reference"))
				{	
				m.populateFacilityReference(dj.byId("issuing_bank_customer_reference"));
				}
					});
			m.connect("part_ship_detl_nosend", "onChange", function(){
				var partShipValue = dj.byId("part_ship_detl_nosend").value;
				dj.byId("part_ship_detl").set("value", partShipValue);
				//Execute this construct only in case of Swift 2018 Switch ON-Controlled in portal.properties swift.version field
				if(m._config.swift2018Enabled){ 
					if(partShipValue === 'CONDITIONAL'){
						
						d.byId("infoMessagePartialShipment").style.display = "block";
						d.byId("infoMessagePartialShipment").style.paddingLeft = "250px";
					}
					else{
						d.byId("infoMessagePartialShipment").style.display = "none";
					}
				}			
				m.toggleFields(partShipValue&& partShipValue !== allowed &&
								partShipValue !== notAllowed && partShipValue !== "NONE", 
								null, ["part_ship_detl_text_nosend"]);
			});
			
			m.connect("part_ship_detl_text_nosend", "onBlur", function(){
				var partShipValue = dj.byId("part_ship_detl_nosend").value;
				if(partShipValue === "OTHER")
				{
					dj.byId("part_ship_detl").set("value", dj.byId("part_ship_detl_text_nosend").value);
				}
				else
				{
					dj.byId("part_ship_detl").set("value", dj.byId("part_ship_detl_nosend").value);
				}
			});
			m.connect("tran_ship_detl_nosend", "onChange", function(){
				var fieldValue = dj.byId("tran_ship_detl_nosend").value;
				dj.byId("tran_ship_detl").set("value", fieldValue);
				//Execute this construct only in case of Swift 2018 Switch ON.
				//Switch ON is controlled by swift.version key in portal.properties
				if(m._config.swift2018Enabled){ 
					if(fieldValue === 'CONDITIONAL'){
						d.byId("infoMessageTranshipment").style.display = "block";
						d.byId("infoMessageTranshipment").style.paddingLeft = "250px";
					}
					else{
						d.byId("infoMessageTranshipment").style.display = "none";
					}
				}
				m.toggleFields(fieldValue && fieldValue !== allowed &&
								fieldValue !== notAllowed && fieldValue !== "NONE", 
						null, ["tran_ship_detl_text_nosend"]);
				
			});
			m.connect("tran_ship_detl_text_nosend", "onBlur", function(){
				if(dj.byId("tran_ship_detl_nosend").value === "OTHER" || dj.byId("tran_ship_detl_nosend").value === "Other")
				{
					dj.byId("tran_ship_detl").set("value", dj.byId("tran_ship_detl_text_nosend").value);
				}
				else
				{
					dj.byId("tran_ship_detl").set("value", dj.byId("tran_ship_detl_nosend").value);
				}		
			});
			m.connect("tenor_days", "onFocus", m.setDraftDaysReadOnly);
			m.connect("tenor_period", "onFocus", m.setDraftDaysReadOnly);
			m.connect("tenor_from_after", "onFocus", m.setDraftDaysReadOnly);
			m.connect("tenor_days_type", "onFocus", m.setDraftDaysReadOnly);
			m.connect("draft_term", "onFocus", function(){
				this.set("readOnly", !dj.byId("cr_avl_by_code_5").get("checked"));
			});
			m.connect("narrative_description_goods", "onBlur", function(){
				_validateDescOfGoods();
				
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
			m.connect("inco_term", "onChange", function(){
				m.toggleFields(this.get("value"), null, ["inco_place"], false, false);
			});
			m.connect("inco_term_year", "onChange", function(){
				m.toggleFields(this.get("value"), null, ["inco_term"], false, true);
			});
			
			
			m.connect("adv_send_mode", "onChange",function(){
				if(dj.byId("adv_send_mode") && dj.byId("adv_send_mode").get("value")==='01')
				{
				_validateDescOfGoods();
				}
			});
			
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
					m.animate("fadeIn", d.byId(revolvingDetails));
				}
				else 
				{
					m.animate("fadeOut", d.byId(revolvingDetails));
					dj.byId("revolve_period").set("value","");
					dj.byId("revolve_frequency").set("value","");
					dj.byId("revolve_time_no").set("value","");
					dj.byId("cumulative_flag").set("checked",false);
					dj.byId("notice_days").set("value","");
				}
			});
			
			m.connect("revolving_flag", "onChange", function(){
				m.toggleFields((this.get("value") === "on"),null, 
						["revolve_period", "revolve_frequency"]);
			});

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
			m.connect("revolve_period", "onBlur", function(){
				m.validateIntegerValue(dj.byId("revolve_period"));
			});
			m.connect("revolve_time_no", "onBlur", function(){
				m.validateIntegerValue(dj.byId("revolve_time_no"));
			});
			m.connect("notice_days", "onBlur", function(){
				m.validateIntegerValue(dj.byId("notice_days"));
			});
			//Connect the following event handlers only for SWIFT 2018 Switch ON
			//Switch ON is controlled by swift.version key in portal.properties
			if(m._config.swift2018Enabled){
				m._bindSwift2018();
			}else{
				m.connect("cfm_inst_code_1", "onClick", m.resetConfirmationCharges);
				m.connect("cfm_inst_code_2", "onClick", m.resetConfirmationCharges);
				m.connect("cfm_inst_code_3", "onClick", m.resetConfirmationCharges);
			}
			m.connect("applicable_rules", "onChange", function(){
				m.toggleFields((this.get("value") == "99"), null, ["applicable_rules_text"]);
			});
			m.connect("adv_send_mode", "onChange", function(){
				m.toggleFields((this.get("value") == "99"), null, ["adv_send_mode_text"]);
			});
			m.connect("facility_id", "onChange", m.getLimitDetails);
			m.connect("beneficiary_country", "onChange", function()
					{
				if(dj.byId("issuing_bank_customer_reference"))
				{
				m.populateFacilityReference(dj.byId("issuing_bank_customer_reference"));
				}
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
			m.connect("lc_amt", "onChange", m.validateLimitBookingAmount);
			m.connect("lc_cur_code", "onChange",m.validateLimitBookingAmount);
			m.connect("booking_amt", "onBlur", m.validateLimitBookingAmount);
			
			// onChange
			m.connect('po_activated', 'onChange', m.toggleDisableButtons);
			m.connect('lc_cur_code', 'onBlur', m.checkLineItemsCurrencyTotalCurrency);
			// Fill currency fields with the Purchase Order Currency
			m.connect('lc_cur_code', 'onChange', m.managePOCurrency);
			m.connect('lc_cur_code', 'onFocus', m.saveOldPOCurrency);
			
			m.connect('line_item_qty_val', 'onBlur', m.computeLineItemAmount);
			m.connect('line_item_price_amt', 'onBlur', m.computeLineItemAmount);
			
			
			m.connect(dj.byId('line_item_qty_unit_measr_code'), 'onChange',  function(){
				
				dj.byId('line_item_price_unit_measr_code').set('value', this.get('value'));
			});
			
			
			m.connect("line_item_qty_unit_measr_code", "onChange", function(){
				//m.toggleFields((this.get("value") === "OTHR"),null, ["line_item_qty_unit_measr_other"]);
				if (dojo.byId('line_item_qty_unit_measr_other_row')) {
					if (this.get("value") === "OTHR") {
						m.animate("fadeIn", 'line_item_qty_unit_measr_other_row');
						dj.byId("line_item_qty_unit_measr_other").set("readOnly",false);
						m.toggleRequired("line_item_qty_unit_measr_other", true);
					}
					else {
						m.animate("fadeOut", 'line_item_qty_unit_measr_other_row');
						dj.byId("line_item_qty_unit_measr_other").set("readOnly",true);
						dj.byId("line_item_qty_unit_measr_other").set("value","");
						m.toggleRequired("line_item_qty_unit_measr_other", false);
					}
				}
			});
			
			m.connect('fake_total_cur_code', 'onChange', function(){
				m.setCurrency(this, ['fake_total_amt']);
			});
			
			m.connect('fake_total_amt', 'onChange', function(){
				m.setTnxAmt(this.get('value'));
			});
			
			m.connect('total_net_cur_code', 'onChange', function(){
				m.setCurrency(this, ['total_net_amt']);
			});
			m.connect('line_item_price_cur_code', 'onChange', function(){
				m.setCurrency(this, ['line_item_price_amt']);
			});
			
			m.connect('line_item_total_cur_code', 'onChange', function(){
				m.setCurrency(this, ['line_item_total_amt']);
			});
			m.connect('line_item_total_net_cur_code', 'onChange', function(){
				m.setCurrency(this, ['line_item_total_net_amt']);
			});
			
			m.connect('lc_cur_code', 'onChange', function(){
				m.setCurrency(this, ['lc_amt']);
			});
			
			m.connect('lc_amt', 'onChange', function(){
				m.setTnxAmt(this.get('value'));
			});
				
			m.connect(dijit.byId("dialogPOSubmit"), "onClick", function(){
				
				var nbDec = dj.byId("line_item_total_cur_code").get("value");
				var quantity =  dj.byId("line_item_qty_val").get("value");
				var measureUnit = dj.byId("line_item_qty_unit_measr_code").get("displayedValue");
				var basePriceMeasureUnit = dj.byId("line_item_price_unit_measr_code").get("displayedValue");
				var basePrice = dj.byId("line_item_price_amt").get("value");
				var desc = dj.byId("line_item_product_name").get("value");
				var posTol = '';
				var negTol = '';
				if(dj.byId("line_item_qty_tol_pstv_pct") && dj.byId("line_item_qty_tol_pstv_pct").get("value") != null && !isNaN(dj.byId("line_item_qty_tol_pstv_pct").get("value"))) {
					posTol  =  "(Tolerance: +" + dj.byId("line_item_qty_tol_pstv_pct").get("value") + ")";
				}
				if(dj.byId("line_item_qty_tol_neg_pct") && dj.byId("line_item_qty_tol_neg_pct").get("value") != null && !isNaN(dj.byId("line_item_qty_tol_neg_pct").get("value"))) {
					negTol = "(Tolerance: -" + dj.byId("line_item_qty_tol_neg_pct").get("value") + ")";
				}
				
				if (quantity && measureUnit && basePriceMeasureUnit && basePrice && desc) {
					var oldnarrative = "";
					oldnarrative = dj.byId("narrative_description_goods").get("value");
					var narrative = oldnarrative + "\n\r+" + quantity+" "+ measureUnit +" of "+desc+"\n\r+"+posTol + negTol+" at "+basePrice+" "+nbDec +" per "+basePriceMeasureUnit;
					dj.byId("narrative_description_goods").set("value" , narrative);
				}
				
			});
			
			m.connect(dj.byId('line_item_qty_unit_measr_code'), 'onChange', function()
					{dj.byId('line_item_qty_unit_measr_label').set('value', this.get('displayedValue'));});
			
			m.connect("applicant_address_line_4", "onFocus", function(){
				m.showTooltip(m.getLocalization('addressLine4ToolTip', 
						[dj.byId("applicant_address_line_4").get("displayedValue"), dj.byId("applicant_address_line_4").get("value") ]), d.byId("applicant_address_line_4"), [ 'right' ],5000);
			});
			m.connect("alt_applicant_address_line_4", "onFocus", function(){
				m.showTooltip(m.getLocalization('addressLine4ToolTip', 
						[dj.byId("alt_applicant_address_line_4").get("displayedValue"), dj.byId("alt_applicant_address_line_4").get("value") ]), d.byId("alt_applicant_address_line_4"), [ 'right' ],5000);
			});
			m.connect("beneficiary_address_line_4", "onFocus", function(){
				m.showTooltip(m.getLocalization('addressLine4ToolTip', 
						[dj.byId("beneficiary_address_line_4").get("displayedValue"), dj.byId("beneficiary_address_line_4").get("value") ]), d.byId("beneficiary_address_line_4"), [ 'right' ],5000);
			});
			m.connect("credit_available_with_bank_address_line_4", "onFocus", function(){
				m.showTooltip(m.getLocalization('addressLine4ToolTip', 
						[dj.byId("credit_available_with_bank_address_line_4").get("displayedValue"), dj.byId("credit_available_with_bank_address_line_4").get("value") ]), d.byId("credit_available_with_bank_address_line_4"), [ 'right' ],5000);
			});
			m.connect("advising_bank_address_line_4", "onFocus", function(){
				m.showTooltip(m.getLocalization('addressLine4ToolTip', 
						[dj.byId("advising_bank_address_line_4").get("displayedValue"), dj.byId("advising_bank_address_line_4").get("value") ]), d.byId("advising_bank_address_line_4"), [ 'right' ],5000);
			});
			m.connect("advise_thru_bank_address_line_4", "onFocus", function(){
				m.showTooltip(m.getLocalization('addressLine4ToolTip', 
						[dj.byId("advise_thru_bank_address_line_4").get("displayedValue"), dj.byId("advise_thru_bank_address_line_4").get("value") ]), d.byId("advise_thru_bank_address_line_4"), [ 'right' ],5000);
			});
			m.connect("requested_confirmation_party_address_line_4", "onFocus", function(){
				m.showTooltip(m.getLocalization('addressLine4ToolTip', 
						[dj.byId("requested_confirmation_party_address_line_4").get("displayedValue"), dj.byId("requested_confirmation_party_address_line_4").get("value") ]), d.byId("requested_confirmation_party_address_line_4"), [ 'right' ],5000);
			});			
		}, 
		onFormLoad : function() {
			//  summary:
		    //          Events to perform on page load.
			m._config.lcCurCode = dj.byId("lc_cur_code").get("value");
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
			m._config.lastShipDate = dj.byId("last_ship_date").get("displayedValue");
			
			// Additional onload events for dynamic fields
			m.setCurrency(dj.byId("lc_cur_code"), ["lc_amt"]);
			m.setCurrency(dj.byId('total_net_cur_code'), ['total_net_amt']);
			m.toggleDisableButtons();
			if (d.byId('line_item_qty_unit_measr_other_row')) {
				m.animate("fadeOut", 'line_item_qty_unit_measr_other_row');
			}
			 var lineItem ="line-items"; 
				if(dj.byId(lineItem) && dj.byId(lineItem).grid)
				{
					lineItem.grid._refresh();
				}
			var bankType = dj.byId("credit_available_with_bank_type");
			if(bankType)
			{
				bankType.onChange();
			}
			var srRule = dj.byId("applicable_rules");
			if(srRule) {
				m.toggleFields(
						srRule.get("value") == "99",
						null, ["applicable_rules_text"]);
			}
			var advSendMode = dj.byId("adv_send_mode");
			if(advSendMode) {
				m.toggleFields(
						advSendMode.get("value") == "99",
						null, ["adv_send_mode_text"]);
			}
			var shipDetlSelect = dj.byId("part_ship_detl_nosend");
			if(shipDetlSelect)
			{
				var shipDetlValue = shipDetlSelect.get("value");
				m.toggleFields(shipDetlValue && shipDetlValue !== allowed &&
						shipDetlValue !== notAllowed && shipDetlValue !== "NONE", 
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
				m.toggleFields(fieldValue && fieldValue !== allowed &&
						fieldValue !== notAllowed && fieldValue !== "NONE", 
						null, ["tran_ship_detl_text_nosend"]);
			}
			var tranShipDetl = dj.byId("tran_ship_detl");
			if(tranShipDetl && tranShipDetl.get("value") === "") {
				tranShipDetl.set("value", tranShipDetlSelect.get("value"));
			}
			//_formLoadSwift2018 function executes only for SWIFT 2018 Switch ON
			//Switch ON is controlled by swift.version key in portal.properties
			if(m._config.swift2018Enabled){
				m._onFormLoadSwift2018();
			}
			if(m._config.purchase_order_assistant == "true")
				{
				m.animate("fadeIn", d.byId(lineItem));
				m.animate("fadeIn", d.byId("fake_total_cur_code_row"));
				m.animate("fadeIn", d.byId("total_net_cur_code_row"));
				
				}
			else
				{
				m.animate("fadeOut",d.byId(lineItem));
				m.animate("fadeOut", d.byId("fake_total_cur_code_row"));
				m.animate("fadeOut", d.byId("total_net_cur_code_row"));
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
			
			// Next, choose which of the activated buttons to selected based on the values of 
			// one of the date fields.
			/*
			var tenorType2  = dj.byId("tenor_type_2");
			var tenorType3 = dj.byId("tenor_type_3");
			if(tenorType2 && tenorType3 && !tenorType2.get("disabled") &&
					!tenorType3.get("disabled")) {
				if(dj.byId("tenor_maturity_date").get("displayedValue")) {
					tenorType2.set("checked", true);
					tenorType2.onClick(tenorType2.get("value"));
				} else {
					tenorType3.set("checked", true);
					tenorType3.onClick(tenorType3.get("value"));
				}
			}
			*/
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
			var issuingBankAbbvName = dj.byId("issuing_bank_abbv_name");
			if(issuingBankAbbvName) {
				issuingBankAbbvName.onChange();
			}
			
			var issuingBankCustRef = dj.byId("issuing_bank_customer_reference");
			if(issuingBankCustRef) {
				issuingBankCustRef.onChange();
			}
			if(dj.byId("inco_term_year"))
				{
					m.getIncoYear();
					dijit.byId("inco_term_year").set("value",dj.byId("org_term_year").get("value"));
				
				}
			if(dj.byId("inco_term"))
			{
				if(dj.byId("issuing_bank_abbv_name") && dj.byId("issuing_bank_abbv_name").get("value")!="" && dj.byId("inco_term_year") && dj.byId("inco_term_year").get("value")!="")
				{
					m.getIncoTerm();
				}
				dijit.byId("inco_term").set("value",dj.byId("org_inco_term").get("value"));	
			
			
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
			
			 var handle = dojo.subscribe(_deleteGridRecord, function(){
				 m.toggleFields(m._config.customerBanksMT798Channel[issuingBankAbbvName] == true && m.hasAttachments(), null, ["delivery_channel"], false, false);
			 });
			 
				var transportModeValue = dj.byId("transport_mode").get("value");
				if(transportModeValue != "" && transportModeValue !== "AIRT" && transportModeValue !== "SEAT" && transportModeValue !== "RAIL" && transportModeValue !== "ROAD" && transportModeValue !== "MULT")
					{
					dj.byId("transport_mode_nosend").set("value", "OTHR");
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
			var facilityWidget			= dj.byId("facility_id"),
    		facilityReference		= dj.byId("facility_reference");
			if(dj.byId("issuing_bank_customer_reference"))
			{
			m.populateFacilityReference(dj.byId("issuing_bank_customer_reference"));
			}
				
		if(facilityReference && facilityWidget.get("value") + "S" === "S")
		{
			if(facilityReference.get("value") + "S" !== "S")
			{
				m._config.isLoading = true;
			}
			facilityWidget.set("displayedValue",facilityReference.get("value"));
		}
	
			m.populateGridOnLoad("lc");
			
			if(dj.byId("revolving_flag"))
			{
				if(dj.byId("revolving_flag").get("checked")) 
				{
					m.animate("fadeIn", d.byId(revolvingDetails));
				}
				else 
				{
					m.animate("fadeOut", d.byId(revolvingDetails));
					dj.byId("revolve_period").set("value","");
					dj.byId("revolve_frequency").set("value","");
					dj.byId("revolve_time_no").set("value","");
					dj.byId("cumulative_flag").set("checked",false);
					dj.byId("notice_days").set("value","");
				}
			}
			var revolvingFlag = dj.byId("revolving_flag");
			if(revolvingFlag) {
				m.toggleFields(
						revolvingFlag.get("value") === "on", 
						null,["revolve_period", "revolve_frequency"]);
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
			if(dj.byId("formLoad"))
			{
				dj.byId("formLoad").set("value","false");
			}
		}, 
		
		beforeSaveValidations : function(){
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
	    	m.setDraftTerm();
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
			
			//Validate the length of bank name and all the address fields length not to exceed 1024
			if(!(m.validateLength(["applicant","alt_applicant","beneficiary","credit_available_with_bank","advising_bank","advise_thru_bank"])))
    		{
    			return false;
    		}
			
			var rcfValidation = true;
			var validation_flag = true;
			if(!_validateDescOfGoods())
				{
				m._config.onSubmitErrorMsg =  m.getLocalization("descOfGoodsExceedMaxWhenIncoTermSelected");
				return false;
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
			//_beforeSubmitValidationsSwift2018 function executes only for SWIFT 2018 Switch ON
			//Switch ON is controlled by swift.version key in portal.properties
			if(m._config.swift2018Enabled){
				rcfValidation = m._beforeSubmitValidationsSwift2018();
				if(!rcfValidation){
					return rcfValidation;
				}
			}
			if(validation_flag === true && dj.byId("booking_amt"))
			{
				validation_flag = m.validateLimitBookingAmount();
			}
			
			if(	!m.validateAmountField("open_chrg_applicant") 	||
				!m.validateAmountField("open_chrg_beneficiary") ||
				!m.validateAmountField("corr_chrg_applicant") 	||
				!m.validateAmountField("corr_chrg_beneficiary")	||
				!m.validateAmountField("cfm_chrg_applicant") 	||
				!m.validateAmountField("cfm_chrg_beneficiary") 	){
				return false;
			}
				
			if((dj.byId("tenor_type_1") && dj.byId("tenor_type_2") && 
					dj.byId("tenor_type_3")) &&
					   !dj.byId("tenor_type_1").get("checked") &&
					   !dj.byId("tenor_type_2").get("checked") &&
					   !dj.byId("tenor_type_3").get("checked") &&
					   dj.byId("draft_term").get("value") === ""){
				m._config.onSubmitErrorMsg =  m.getLocalization("mandatoryPaymentTypeError");
				return false;
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
			
			m.setDraftTerm();
			if(validation_flag === true)
			{
				validation_flag = m.validateLSAmtSumAgainstTnxAmt("lc");
			}

			if(dj.byId("issuing_bank_abbv_name") && !m.validateApplDate(dj.byId("issuing_bank_abbv_name").get("value")))
			{
				m._config.onSubmitErrorMsg = m.getLocalization('changeInApplicationDates');
				m.goToTop();
				return false;
      		}
			return validation_flag;
		},
		
		validateAmountField : function(amtFldId){
			var amtFld = dj.byId(amtFldId);
			if(amtFld){ //if defined
				if(!amtFld.get("disabled") && amtFld.get("required")){ // if enabled and required
					if(!m.validateAmount(amtFld)){					
						m._config.onSubmitErrorMsg =  m.getLocalization("amountcannotzero");
						amtFld.set("value","");
						return false;
					}
				}
			}
			return true;
		}
	});
	
	
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.trade.create_lc_client');