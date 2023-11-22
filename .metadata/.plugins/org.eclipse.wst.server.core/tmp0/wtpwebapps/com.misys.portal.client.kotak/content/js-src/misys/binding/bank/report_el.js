dojo.provide("misys.binding.bank.report_el");

dojo.require("dijit.form.DateTextBox");
dojo.require("misys.form.CurrencyTextBox");
dojo.require("dijit.form.FilteringSelect");
dojo.require("dijit.form.NumberTextBox");
dojo.require("misys.form.file");
dojo.require("misys.form.addons");
dojo.require("misys.form.SimpleTextarea");
dojo.require("dijit.layout.TabContainer");
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
dojo.require("misys.widget.Collaboration");
dojo.require("misys.binding.trade.ls_common");
dojo.require("misys.binding.bank.report_el_swift");
dojo.require("misys.widget.Amendments");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode
	var notAllowed = "NOT ALLOWED";
	var allowed ="ALLOWED";
	m._config = m._config || {};
    m._config.lcCurCode = m._config.lcCurCode || {};
    m._config.beneficiary = m._config.beneficiary || {  entity : "",
													name : "",
													abbvName : "",
													addressLine1 : "",
													addressLine2 : "",
													dom : ""
												  };
    m._config.expDate = m._config.expDate || {};
    m._config.lastShipDate = m._config.lastShipDate || {};
	
	// Private functions and variables go here
	d.mixin(m._config, {
		/*
		 * Overriding to add license items in the xml. 
		 */
		xmlTransform : function (/*String*/ xml) {
			var tdXMLStart = "<el_tnx_record>";
			/*
			 * Add license items tags, only in case of LC transaction.
			 * Else pass the input xml, without modification. (Ex : for create beneficiary from popup.)
			 */
			if(xml.indexOf(tdXMLStart) != -1){
				// Setup the root of the XML string
				var xmlRoot = m._config.xmlTagName,
				transformedXml = xmlRoot ? ["<", xmlRoot, ">"] : [],			
						tdXMLEnd   = "</el_tnx_record>",
						subTDXML	= "",
						selectedIndex = -1;
				subTDXML = xml.substring(tdXMLStart.length,(xml.length-tdXMLEnd.length));
				var nodename = "amd_no"; 
				var amdNo = xml.substring(xml.indexOf("<"+nodename+">")+("<"+nodename+">").length,xml.indexOf("</"+nodename+">"));
				var arrayOfNarratives = ["narrative_description_goods","narrative_documents_required","narrative_additional_instructions","narrative_special_beneficiary","narrative_special_recvbank"];
				var tnxTypeCode = xml.substring(xml.indexOf("<tnx_type_code>")+("<tnx_type_code>").length,xml.indexOf("</tnx_type_code>"));
				var prodStatCode = xml.substring(xml.indexOf("<prod_stat_code>")+("<prod_stat_code>").length,xml.indexOf("</prod_stat_code>"));
				var lcType = dj.byId("lc_type") ? dj.byId("lc_type").get("value") : '';
				
				if(m._config.swift2018Enabled && (Number(amdNo) || prodStatCode === '08' || prodStatCode === '31')){ //swift enabled for Amendment form
					var subXML;
					var dataStoreNarrative = [m._config.narrativeDescGoodsDataStore,m._config.narrativeDocsReqDataStore,m._config.narrativeAddInstrDataStore,m._config.narrativeSpBeneDataStore,m._config.narrativeSpRecvbankDataStore];
					var i = 0, verb, text, itr = 0;
					for(itr = 0; itr < 5; itr++){
						subXML = itr == 0 ? subTDXML.substring(0,subTDXML.indexOf("<"+arrayOfNarratives[itr]+">")) : (subXML.indexOf("<"+arrayOfNarratives[itr]+">") > 0 ? subXML.substring(0,subXML.indexOf("<"+arrayOfNarratives[itr]+">")) : subXML);
						if(subTDXML.indexOf("<"+arrayOfNarratives[itr]+">") < 0){continue;}
						if(dataStoreNarrative[itr] && dataStoreNarrative[itr].length > 0){
							i = 0;
							subXML = subXML.concat("<"+arrayOfNarratives[itr]+">");
							subXML = subXML.concat("<![CDATA[");
							subXML = subXML.concat("<amendments>");
							subXML = subXML.concat("<amendment>");
							subXML = subXML.concat("<sequence>");
							subXML = subXML.concat(Number(amdNo));
							subXML = subXML.concat("</sequence>");
							subXML = subXML.concat("<data>");
							d.forEach(dataStoreNarrative[itr], function(){
								if(dataStoreNarrative[itr][i] && dataStoreNarrative[itr][i] != null){
									verb = dataStoreNarrative[itr][i].verb[0];
									text = dojox.html.entities.encode(dataStoreNarrative[itr][i].content[0], dojox.html.entities.html);
									subXML = subXML.concat("<datum>");
									subXML = subXML.concat("<id>");
									subXML = subXML.concat(i);
									subXML = subXML.concat("</id>");
									subXML = subXML.concat("<verb>");
									subXML = subXML.concat(verb);
									subXML = subXML.concat("</verb>");
									subXML = subXML.concat("<text>");
									subXML = subXML.concat(text);
									subXML = subXML.concat("</text>");
									subXML = subXML.concat("</datum>");
								}
								i++;
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
				}  else if(m._config.swift2018Enabled && tnxTypeCode == '01' && lcType !== '02') {//For swift enabled with issuance form
					for(itr = 0; itr < 5; itr++){
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
							subXML = subXML.concat(dojox.html.entities.encode(dj.byId(arrayOfNarratives[itr]).get("value"), dojox.html.entities.html));
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
				else {
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
	
	
	// Public functions & variables follow
	d.mixin(m, {

		bind : function() {
			m.setValidation("iss_date", m.validateMOProdELIssueDate);
			m.setValidation("exp_date", m.validateBankExpiryDate);
			m.setValidation("pstv_tol_pct", m.validateTolerance);
			m.setValidation("neg_tol_pct", m.validateTolerance);
			m.setValidation("max_cr_desc_code", m.validateMaxCreditTerm);
			m.setValidation("last_ship_date", m.validateLastShipmentDate);
			m.setValidation("amd_date", m.validateAmendmentDate);
			m.setValidation("lc_cur_code", m.validateCurrency);
			m.setValidation("latest_answer_date", m.validateLatestAnswerDate);
			m.setValidation("earliest_ship_date", m.validateEarliestShipmentDate);
			// CF See comment in report_lc.js for this validation
			m.connect("prod_stat_code", "onChange", m.validateOutstandingAmount);
			m.connect("prod_stat_code", "onChange", function(){
				var  prodStatCodeValue=dj.byId("prod_stat_code").get("value") ;
				var prodStatCodeField = dj.byId('prod_stat_code');
				var billReferenceField = dj.byId('imp_bill_ref_id');
				if(prodStatCodeField && prodStatCodeField.get('value') && billReferenceField) {
					if(prodStatCodeValue==="04" || prodStatCodeValue==="07" || prodStatCodeValue==="12"||
					 prodStatCodeValue==="13" || prodStatCodeValue==="05"  || prodStatCodeValue==="14" || prodStatCodeValue==="15"    ){
						dj.byId("imp_bill_ref_id").set("disabled", false);
					}
					else{
						dj.byId("imp_bill_ref_id").set("disabled", true);
						dj.byId("imp_bill_ref_id").set("value", "");
					}
				}
				
			});
			
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
			d.forEach(fields, function(id){
				var field= dj.byId(id);
				field.onBlur(field);
			});
			
			// Events
			m.connect("ship_period", "onChange", m.validateShipPeriod);
			m.connect(dj.byId("prod_stat_code"), "onChange", function(){this.validate();});
			m.connect("prod_stat_code", "onChange", m.toggleProdStatCodeFields);
			m.connect("prod_stat_code", "onChange", function(){
				var value = this.get("value");
				m.toggleFields(value && value !== "01" && value !== "18", null,
									["iss_date", "bo_ref_id"]);});
			m.connect("prod_stat_code", "onChange", function(){
				m.updateOutstandingAmount(dj.byId("lc_liab_amt"), dj.byId("org_lc_liab_amt"));
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
			m.connect("lc_available_amt", "onBlur",m.validateLCAvailableAmt);
			m.connect("lc_liab_amt", "onBlur",m.validateLCLiabAmt);
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
			m.connect("irv_flag", "onClick", m.checkIrrevocableFlag);
			m.connect("ntrf_flag", "onClick", m.checkNonTransferableFlag);
			m.connect("stnd_by_lc_flag", "onClick", m.checkStandByFlag);
			
			m.connect("cfm_inst_code_1", "onClick", m.resetConfirmationCharges);
			m.connect("cfm_inst_code_2", "onClick", m.resetConfirmationCharges);
			m.connect("cfm_inst_code_3", "onClick", m.resetConfirmationCharges);
			m.connect("cfm_chrg_brn_by_code_1", "onClick", m.checkConfirmationCharges);
			m.connect("cfm_chrg_brn_by_code_2", "onClick", m.checkConfirmationCharges);
			
			//calling swift2018 specific javascript
			if(m._config.swift2018Enabled){
				m._bindSwift2018();
			}

			//MPS-32046 Porting issue
			m.connect("part_ship_detl_nosend", "onChange", function(){
	 	 	 	var partShipValue = this.get("value");
	 	 	 	dj.byId("part_ship_detl").set("value", this.get("value"));
	 	 	 	if(m._config.swift2018Enabled){
		 	 	 	//SWIFT 2018 changes
					if(partShipValue == 'CONDITIONAL'){
						document.getElementById("infoMessagePartialShipment").style.display = "block";
						document.getElementById("infoMessagePartialShipment").style.paddingLeft = "250px";
					}
					else{
						document.getElementById("infoMessagePartialShipment").style.display = "none";
					}
	 	 	 	}
	 	 	 	m.toggleFields(partShipValue && partShipValue !== allowed &&
	 	 	 	partShipValue !== notAllowed && partShipValue !== "NONE", 
	 	 	 	null, ["part_ship_detl_text_nosend"]);
	 	 	 	});
	 	 	m.connect("part_ship_detl_text_nosend", "onBlur", function(){
	 	 		if(dj.byId("part_ship_detl_nosend").value === "OTHER")
				{
					dj.byId("part_ship_detl").set("value", dj.byId("part_ship_detl_text_nosend").value);
				}
				else
				{
					dj.byId("part_ship_detl").set("value", dj.byId("part_ship_detl_nosend").value);
				}
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
	 	 		if(dj.byId("tran_ship_detl_nosend").value === "OTHER" || dj.byId("tran_ship_detl_nosend").value === "Other")
				{
					dj.byId("tran_ship_detl").set("value", dj.byId("tran_ship_detl_text_nosend").value);
				}
				else
				{
					dj.byId("tran_ship_detl").set("value", dj.byId("tran_ship_detl_nosend").value);
				}
	 	 	 });
			
			var crAvlByFields = ["cr_avl_by_code_1", "cr_avl_by_code_2", "cr_avl_by_code_3",
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
			 var crAvlByCode1Checked =	dj.byId("cr_avl_by_code_1").get("checked");
			 		if(d.byId('draft_term_img_label')){
			 			if(!crAvlByCode1Checked){
			 				m.animate("fadeIn","draft_term_img_label");
			 			}
			 			else{
			 				m.animate("fadeOut","draft_term_img_label");
			 			}
			 			
			 		}
			 
					m.toggleFields(
							crAvlByCode2Checked || crAvlByCode3Checked, 
							["drawee_details_bank_address_line_2", "drawee_details_bank_dom", "drawee_details_bank_address_line_4"],
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
			m.connect("cr_avl_by_code_1", "onChange", function(){
				m.toggleFields(
						!this.get("checked"), 
						null,
						["draft_term"], false);
				if(this.get("checked")) {
					dj.byId("draft_term").set("value", "Sight");
				} else {
					dj.byId("draft_term").set("value", "");
				}
			});
			m.connect("tenor_type_1", "onClick", m.toggleDraftTerm);
			m.connect("tenor_type_2", "onClick", m.toggleDraftTerm);
			m.connect("tenor_type_3", "onClick", m.toggleDraftTerm);
			m.connect("advise_mode_code_1", "onClick", function(){
				m.toggleFields(
						this.get("checked"), 
						null,
						["part_ship_detl_text"]);
			});
			m.connect("charge_details_status_nosend", "onChange",
					function(){
						m.toggleFields(this.get("value") === "01", null,
								["charge_details_settlement_date_nosend"]);
						if(this.get("value") === "01"){
							dj.byId("charge_details_settlement_date_nosend").set("displayedValue",dj.byId("currentDate").get("value"));
						}
					});
			m.connect("advise_mode_code_2", "onClick", function(){
				m.toggleFields(
					this.get("checked"), 
					["advise_thru_bank_name", "advise_thru_bank_address_line_1", 
							"advise_thru_bank_address_line_2", "advise_thru_bank_dom","advise_thru_bank_address_line_4"],
					null);	
			});
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
			m.connect("beneficiary_name", "onFocus", m.enableBeneficiaryFields);
			m.connect("beneficiary_dom", "onFocus", m.enableBeneficiaryFields);
			m.connect("inco_term_year", "onChange", m.getIncoTerm);
			m.connect("inco_term", "onChange", function(){
				m.toggleFields(this.get("value"), null, ["inco_place"], false, false);
			});
			m.connect("inco_term_year", "onChange", function(){
				m.toggleFields(this.get("value"), null, ["inco_term"], false, true);
			});
			// Optional EUCP flag
			m.connect("eucp_flag", "onClick", function(){
				m.toggleFields(this.get("checked"), null,["eucp_details"]);
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
			
			m.connect("advise_mode_code", "onChange", function(){
				m.toggleFields(this.get("value")=="02", [
						"advise_thru_bank_name", "advise_thru_bank_address_line_1",
						"advise_thru_bank_address_line_2", "advise_thru_bank_dom","advise_thru_bank_address_line_4"],
						["advise_thru_bank_name", "advise_thru_bank_address_line_1"]);
			});
			m.connect("tnx_amt", "onChange", function(){
				m.updateOutstandingAmount(dj.byId("lc_liab_amt"), dj.byId("org_lc_liab_amt"));
			});
			m.connect("license_lookup","onClick", function(){
				m.getLicenses("el");
			});
			m.connect("lc_cur_code", "onChange", function(){
				m.clearLicenseGrid(this, m._config.lcCurCode,"el");
			});
			
			m.connect("entity", "onChange", function(){
				m.clearLicenseGrid(this, m._config.beneficiary,"el");
			});
			
			m.connect("beneficiary_name", "onChange", function(){
				m.clearLicenseGrid(this, m._config.beneficiary,"el");
			});
			
			m.connect("exp_date", "onChange", function(){
				m.clearLicenseGrid(this, m._config.expDate,"el");
			});
			
			m.connect("last_ship_date", "onChange", function(){
				m.clearLicenseGrid(this, m._config.lastShipDate,"el");
			});
			m.connect("applicable_rules", "onChange", function(){
				m.toggleFields((this.get("value") == "99"), null, ["applicable_rules_text"]);
			});
			m.connect("maturity_date", "onBlur", function(){
				m.validateEnteredGreaterThanCurrentDate();
				m.validateMaturityDateInMO();
			});
			m.connect("iss_date", "onBlur", m.validateIssueDateInMO);
			m.connect("prod_stat_code", "onChange", function(){
				if (dj.byId("latest_answer_date")){
					dj.byId("latest_answer_date").set("disabled", true);
				}
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
			
			m._config.lcCurCode = dj.byId("lc_cur_code") ? dj.byId("lc_cur_code").get("value") : "";
			m._config.beneficiary.entity = dj.byId("entity") ? dj.byId("entity").get("value") : "";
			m._config.beneficiary.abbvName = dj.byId("beneficiary_abbv_name") ? dj.byId("beneficiary_abbv_name").get("value") : "";
			m._config.beneficiary.name = dj.byId("beneficiary_name") ? dj.byId("beneficiary_name").get("value") : "";
			m._config.beneficiary.addressLine1 = dj.byId("beneficiary_address_line_1") ? dj.byId("beneficiary_address_line_1").get("value") : "";
			m._config.beneficiary.addressLine2 = dj.byId("beneficiary_address_line_2") ? dj.byId("beneficiary_address_line_2").get("value") : "";
			m._config.beneficiary.dom = dj.byId("beneficiary_dom") ? dj.byId("beneficiary_dom").get("value") : "";
			m._config.expDate = dj.byId("exp_date") ? dj.byId("exp_date").get("displayedValue") : "";
			m._config.lastShipDate = dj.byId("last_ship_date") ? dj.byId("last_ship_date").get("displayedValue") : "";
			m.setCurrency(dj.byId("lc_cur_code"), ["tnx_amt", "lc_amt"]);
			if(dj.byId("lc_cur_code")){
				m.setCurrency(dj.byId("lc_cur_code"), ["lc_available_amt","lc_liab_amt"]);
			}
			if(m._config.swift2018Enabled){
				m._onFormLoadSwift2018();
			}

			var crAvlByCode1  = dj.byId("cr_avl_by_code_1");
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
						["drawee_details_bank_address_line_2", "drawee_details_bank_dom","drawee_details_bank_address_line_4"],
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
			
			var eucpFlag = dj.byId("eucp_flag");
			if(eucpFlag) {
				m.toggleFields(
						eucpFlag.get("checked"), 
						null,
						[
						"eucp_details"]);
			}
			
			//MPS-MPS-32046:POrint issue - Partial shipment and Trans shipment values not saved on report and pdf.
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
			
			if (dj.byId("advise_mode_code")) {
				m.toggleFields(dj.byId("advise_mode_code").get("value")=="02", [
						"advise_thru_bank_name", "advise_thru_bank_address_line_1",
						"advise_thru_bank_address_line_2", "advise_thru_bank_dom","advise_thru_bank_address_line_4"],
						["advise_thru_bank_name", "advise_thru_bank_address_line_1"]);
			}
			if (dj.byId("latest_answer_date")){
				m.toggleProdStatCodeFields();
			}
			var prodStatCode = dj.byId("prod_stat_code"),liabAmt = dj.byId("lc_liab_amt") ;
			//maturity date mandatory
			if(prodStatCode.get("value") === "05" || prodStatCode.get("value") === "13" || prodStatCode.get("value") === "15"|| prodStatCode.get("value") === "14" || prodStatCode.get("value") === "04"){
				m.toggleRequired("maturity_date", true);
			} else {
				m.toggleRequired("maturity_date", false);
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
			 var tnxtype = dj.byId("tnx_type_code");
	 	 	 var subtnxtype = dj.byId("sub_tnx_type_code");
	 	 	 if(dj.byId("advise_mode_code") && tnxtype && (tnxtype.get("value") === '13') && subtnxtype && (subtnxtype.get("value") === '19')) {
	 	 	 	
	 	 	 	m.toggleRequired("advise_mode_code", false);
	 	 	 	                
	 	 	 }else
	 	 	 	  {
	 	 	 	m.toggleRequired("advise_mode_code", true);
	 	 	 	  }
			m.populateGridOnLoad("lc");
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
			
			var applRule = dj.byId("applicable_rules");
			if(applRule) {
				m.toggleFields(
						applRule.get("value") == "99",
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
			var incoTerm = dj.byId("inco_term") ? dj.byId("inco_term").get("value") : "";
			if(incoTerm) {
				m.toggleFields(incoTerm, null, ["inco_place"], false, true);
			}
			else{
				m.toggleFields(incoTerm, null, ["inco_place"], false, false);
			}
			var issDateField = dj.byId('iss_date');
			if(issDateField && issDateField.get('value'))
			{
				issDateField.onBlur();
			}
			var prodStatCodeField = dj.byId('prod_stat_code');
			var billReferenceField = dj.byId('imp_bill_ref_id');
			if(prodStatCodeField && prodStatCodeField.get('value') && billReferenceField)
			{
				var prodStatCodeValue=dj.byId("prod_stat_code").get("value");
				if(prodStatCodeValue==="04" || prodStatCodeValue==="07" || prodStatCodeValue==="12"||
					prodStatCodeValue==="13" || prodStatCodeValue==="05"  || prodStatCodeValue==="14" || prodStatCodeValue==="15"){
					dj.byId("imp_bill_ref_id").set("disabled", false);
				}
				else{
					dj.byId("imp_bill_ref_id").set("disabled", true);
					dj.byId("imp_bill_ref_id").set("value", "");
				}
			}
			var shipPeriodField = dj.byId("ship_period");
			if(shipPeriodField && shipPeriodField.get("value"))
			{
				shipPeriodField.onChange();
			}
		},

			beforeSubmitValidations : function() {
	
				var rcfValidation = true;
				// Validate Letter of Credit(LC) amount to be greater than zero
				if(dj.byId("lc_amt"))
				{
					if(!m.validateAmount((dj.byId("lc_amt"))?dj.byId("lc_amt"):0))
					{
						m._config.onSubmitErrorMsg =  m.getLocalization("amountcannotzero");
						dj.byId("lc_amt").set("value", "");
						return false;
					}
				}
				var lcAmt = dj.byId("lc_amt");
				var prodStatCode = dj.byId("prod_stat_code");
				var lcAvailAmt = dj.byId("lc_available_amt");
				var lcLiabAmt = dj.byId("lc_liab_amt");
				if(lcAmt && lcAvailAmt && prodStatCode && prodStatCode.get('value')=="03" && (lcAmt.get("value") != lcAvailAmt.get("value")))
				{
					m._config.onSubmitErrorMsg = m.getLocalization("AvailLCAmtNotEqualToTranAmt");
					lcAvailAmt.set("value", "");
					console.debug("Invalid Available Amount.");
					return false;
				}
				else if(lcAmt && lcAvailAmt && (lcAmt.get("value") < lcAvailAmt.get("value")))
				{
					m._config.onSubmitErrorMsg = m.getLocalization("AvailLCamtcanNotMoreThanTranAmt");
					lcAvailAmt.set("value", "");
					console.debug("Invalid Available Amount.");
					return false;
				}
				if(lcAmt && lcLiabAmt && prodStatCode && prodStatCode.get('value')=="03" && (lcAmt.get("value") > lcLiabAmt.get("value")))
				{
					m._config.onSubmitErrorMsg = m.getLocalization("LiabLCAmtcanNotLessThanTranAmt");
					lcLiabAmt.set("value", "");
					console.debug("Invalid Liability Amount.");
					return false;
				}
				/*else if(lcAmt && lcLiabAmt && (lcAmt < lcLiabAmt.get("value")))
				{
					m._config.onSubmitErrorMsg = m.getLocalization("LiabLCAmtcanNotMoreThanTranAmt");
					lcLiabAmt.set("value", "");
					console.debug("Invalid Liability Amount.");
					return false;
				}*/
				if(dj.byId("tnx_amt") && (dj.byId("tnx_type_code") && 
						dj.byId("tnx_type_code").getValue()!="03" &&
						dj.byId("tnx_type_code").getValue()!="14" &&
						!(dj.byId("tnx_type_code").getValue()=="15" &&
						 (dj.byId("prod_stat_code").get('value')=="03" ||
						  dj.byId("prod_stat_code").get('value')=="06" ||
						  dj.byId("prod_stat_code").get('value')=="08" ||
						  dj.byId("prod_stat_code").get('value')=="81"))))
				{
					if(!m.validateAmount((dj.byId("tnx_amt"))?dj.byId("tnx_amt"):0))
					{
						m._config.onSubmitErrorMsg =  m.getLocalization("amountcannotzero");
						dj.byId("tnx_amt").set("value", "");
						return false;
					}
				}
				//Validate the length of bank name and all the address fields length not to exceed 1024
				if(!(m.validateLength(["beneficiary","applicant","issuing_bank","credit_available_with_bank","drawee"])))
				{
						return false;
				}				
				//calling swift2018 specific javascript
				if(m._config.swift2018Enabled){
					rcfValidation = m._beforeSubmitValidationsSwift2018();
					if(!rcfValidation){
						return rcfValidation;
					}
				}
				//  summary: 
				//            Form-specific validations
				//  description:
				//            Specific pre-submit validations for this form, that are called after
				//            the standard Dojo validations.
				return m.validateLSAmtSumAgainstTnxAmt("lc");
			}
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.bank.report_el_client');