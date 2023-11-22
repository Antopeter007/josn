dojo.provide("misys.binding.trade.create_si");

dojo.require("dijit.form.Form");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.TextBox");
dojo.require("misys.widget.Dialog");
dojo.require("dijit.ProgressBar");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.CheckBox");
dojo.require("dijit.layout.ContentPane");
dojo.require("dojo.data.ItemFileReadStore");
dojo.require("dijit.layout.TabContainer");
dojo.require("dijit.form.DateTextBox");
dojo.require("misys.form.CurrencyTextBox");
dojo.require("dijit.form.NumberTextBox");
dojo.require("dijit.form.FilteringSelect");
dojo.require("misys.form.SimpleTextarea");
dojo.require("misys.widget.Collaboration");
dojo.require("misys.validation.common");
dojo.require("misys.form.common");
dojo.require("misys.form.file");
dojo.require("misys.form.static_document");
dojo.require("misys.binding.trade.create_si_swift");
dojo.require("misys.purchaseorder.widget.PurchaseOrder");
dojo.require("misys.purchaseorder.widget.PurchaseOrders");
dojo.require("misys.purchaseorder.FormPurchaseOrderEvents");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode
	
	var  notAllowed="NOT ALLOWED";
	// dojo.subscribe once a record is deleted from the grid
    var _deleteGridRecord = "deletegridrecord";
    
    function _clearPrincipalFeeAcc(){
		dj.byId("principal_act_no").set("value", "");
		dj.byId("fee_act_no").set("value", "");	
	}
	
	d.mixin(m._config, {

		initReAuthParams : function() {
									
			var reAuthParams = {
			    productCode : 'SI', 
			    subProductCode : '',
			    transactionTypeCode : '01', 
			    entity : dj.byId("entity") ? dj.byId("entity").get("value") : '',
			    bankAbbvName : dj.byId("issuing_bank_abbv_name")? dj.byId("issuing_bank_abbv_name").get("value") : "",
			    currency : dj.byId("lc_cur_code") ? dj.byId("lc_cur_code").get("value"): "",
			    amount : dj.byId("lc_amt") ? m.trimAmount(dj.byId("lc_amt").get("value")): "",
								
				es_field1 : '',
				es_field2 : ''				
			};
			return reAuthParams;
		},
	
	/*
	 * Overriding to add narrative data in the xml. 
	 */
	xmlTransform : function (/*String*/ xml) {
		var tdXMLStart = "<si_tnx_record>";
		
		if(xml.indexOf(tdXMLStart) != -1){
			// Setup the root of the XML string
			var xmlRoot = m._config.xmlTagName,
			transformedXml = xmlRoot ? ["<", xmlRoot, ">"] : [],			
					tdXMLEnd   = "</si_tnx_record>",
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
	// Private functions & variables
	//

	//
	// Public functions & variables
	//
	d.mixin(m, {
		bind: function() {
			m.setValidation("template_id", m.validateTemplateId);
			m.setValidation("exp_date", m.validateTradeExpiryDate);
			m.setValidation("pstv_tol_pct", m.validateTolerance);
			m.setValidation("neg_tol_pct", m.validateTolerance);
			m.setValidation("max_cr_desc_code", m.validateMaxCreditTerm);
			m.setValidation('beneficiary_country', m.validateCountry);
			m.setValidation("last_ship_date", m.validateLastShipmentDate);
			m.setValidation("lc_cur_code", m.validateCurrency);
			m.setValidation("renew_for_nb", m.validateRenewFor);
			m.setValidation("advise_renewal_days_nb", m.validateDaysNotice);
			m.setValidation("rolling_renewal_nb", m.validateNumberOfRenewals);
			m.setValidation("rolling_cancellation_days", m.validateCancellationNotice);
			//Lineitems
			m.setValidation('lc_cur_code', m.validateCurrency);
			m.setValidation('fake_total_cur_code', m.validateCurrency);
			m.setValidation('total_net_cur_code', m.validateCurrency);
			m.setValidation('line_item_price_cur_code', m.validateCurrency);
			m.setValidation('line_item_total_net_cur_code', m.validateCurrency);
			//m.setValidation("final_expiry_date",m.validateTradeFinalExpiryDate);
			m.setValidation("renewal_calendar_date",m.validateRenewalCalendarDate);	
			m.setValidation('lc_govern_country', m.validateCountry);
			m.connect("irv_flag", "onClick", m.checkIrrevocableFlag);
			m.connect("ntrf_flag", "onClick", m.checkNonTransferableFlag);
			m.connect("stnd_by_lc_flag", "onClick", m.checkStandByFlag);			
			m.connect("cfm_chrg_brn_by_code_1", "onClick", m.checkConfirmationCharges);
			m.connect("cfm_chrg_brn_by_code_2", "onClick", m.checkConfirmationCharges);
			m.connect("cr_avl_by_code_1", "onClick", m.togglePaymentDraftAt);
			m.connect("cr_avl_by_code_1", "onClick", m.setDraftTerm);
			m.connect("cr_avl_by_code_2", "onClick", m.togglePaymentDraftAt);
			m.connect("cr_avl_by_code_2", "onClick", m.setDraweeDetailBankName);
			m.connect("cr_avl_by_code_3", "onClick", m.togglePaymentDraftAt);
			m.connect("cr_avl_by_code_3", "onClick", m.setDraweeDetailBankName);
			m.connect("cr_avl_by_code_4", "onClick", m.togglePaymentDraftAt);
			m.connect("cr_avl_by_code_5", "onClick", m.togglePaymentDraftAt);
			m.connect("cr_avl_by_code_6", "onClick", m.togglePaymentDraftAt);
			if(!misys._config.makeDescOfGoodsMandatory){
			m.connect("ship_from","onChange", _validateShipDetails);
			m.connect("part_ship_detl_nosend","onChange", _validateShipDetails);
			m.connect("tran_ship_detl_nosend","onChange", _validateShipDetails);
			m.connect("ship_to","onChange", _validateShipDetails);
			m.connect("ship_loading","onChange", _validateShipDetails);
			m.connect("ship_discharge","onChange", _validateShipDetails);
			m.connect("inco_term","onChange", _validateShipDetails);
			m.connect("last_ship_date","onChange", _validateShipDetails);
			m.connect("narrative_shipment_period","onChange", _validateShipDetails);
			}
			m.connect("cr_avl_by_code_5", "onChange", function(){
				dj.byId("draft_term").set("value" , "");
			});
			m.connect("tenor_type_1", "onClick", m.toggleDraftTerm);
			m.connect("tenor_type_1", "onClick", m.setDraftTerm);
			m.connect("tenor_type_2", "onClick",m.toggleDraftTerm);
			m.connect("tenor_type_3", "onClick",m.toggleDraftTerm);
			m.connect("renew_flag", "onClick", m.toggleRenewalDetails);
			m.connect("ntrf_flag", "onClick", m.toggleTransferIndicatorFlag);
			
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
			m.connect("lc_exp_date_type_code", "onChange", function(){
				m.toggleFields((this.get("value") === "01" || this.get("value") === "02"), null, ["exp_date"]);
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
			m.connect("delivery_to", "onChange", function(){
				if(this.get("value") === "" || this.get("value") === "01" || this.get("value") === "03")
				{
							m.toggleFields((this.get("value") === "" || this.get("value") === "01" || this.get("value") === "03"), null, ["narrative_delivery_to"]);
							m.toggleRequired("narrative_delivery_to", false);
							dj.byId("narrative_delivery_to").set("value", "");
							dj.byId("narrative_delivery_to").set("disabled", true);
							document.getElementById("narrative_delivery_to_img").style.display = "none";	
				}
			else
				{
					dj.byId("narrative_delivery_to").set("disabled", false);
					dj.byId("narrative_delivery_to").set("value", "");
					m.toggleRequired("narrative_delivery_to", true);
					document.getElementById("narrative_delivery_to_img").style.display = "block";
				}
			});
			m.connect("renew_flag", "onClick", function(){
				if(!this.get("checked"))
				{
					dj.byId("rolling_renewal_nb").set("value", "");
					dj.byId("renew_amt_code_1").set("checked", false);
					dj.byId("renew_amt_code_2").set("checked", false);
				}
				else if(this.get("checked"))
				{
					dj.byId("renew_amt_code_2").set("checked", true);
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
			//Set renewal final expiry date
			/*m.connect("rolling_renewal_nb","onChange", m.setRenewalFinalExpiryDate);
			m.connect("renew_on_code","onChange", m.setRenewalFinalExpiryDate);
			m.connect("renew_on_code","onChange",m.validateRenewalCalendarDate);
			m.connect("renewal_calendar_date","onChange", m.setRenewalFinalExpiryDate);
			m.connect("renew_for_nb","onChange", m.setRenewalFinalExpiryDate);
			m.connect("renew_for_period","onChange", m.setRenewalFinalExpiryDate);
			m.connect("exp_date","onChange", m.setRenewalFinalExpiryDate);
			m.connect("rolling_renew_on_code","onChange", m.setRenewalFinalExpiryDate);
			m.connect("rolling_renew_for_nb","onChange", m.setRenewalFinalExpiryDate);
			m.connect("rolling_renew_for_period","onChange", m.setRenewalFinalExpiryDate);*/
			
			m.connect("exp_date","onChange", m.calculateRenewalFinalExpiryDate);
			m.connect("rolling_renewal_nb","onBlur", m.calculateRenewalFinalExpiryDate);
			m.connect("renew_on_code","onBlur", m.calculateRenewalFinalExpiryDate);
			m.connect("renewal_calendar_date","onBlur", m.calculateRenewalFinalExpiryDate);
			m.connect("renew_for_nb","onBlur", m.calculateRenewalFinalExpiryDate);
			m.connect("renew_for_period","onBlur", m.calculateRenewalFinalExpiryDate);
			m.connect("rolling_renew_on_code","onChange", m.calculateRenewalFinalExpiryDate);
			m.connect("rolling_renew_for_nb","onChange", m.calculateRenewalFinalExpiryDate);
			m.connect("rolling_renew_for_period","onChange", m.calculateRenewalFinalExpiryDate);
			
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
			m.connect("adv_send_mode", "onChange", function(){
				m.toggleFields((this.get("value") == "99"), null, ["adv_send_mode_text"]);
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
			
			m.connect("lc_amt", "onBlur", function(){
				m.setTnxAmt(this.get("value"));
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
			m.connect("product_type_code", "onChange", function(){
				var _provisionalDiv = d.byId('pro-check-box');
				if(m._config.provisionalProductTypes[this.get("value")] && dj.byId("provisional_status"))
					{
						m.animate('fadeIn', _provisionalDiv);
						dj.byId("provisional_status").set("checked", true);
					}
				else
					{
						dj.byId("provisional_status").set("checked", false);
						m.animate('fadeOut', _provisionalDiv);
					}
			});

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
			if(dj.byId("issuing_bank_abbv_name")) {
				m.connect("entity", "onChange", function(){
					dj.byId("issuing_bank_abbv_name").onChange();
				});
			}
			m.connect("issuing_bank_customer_reference", "onChange", m.setApplicantReference);
			m.connect("part_ship_detl_nosend", "onChange", function(){
				var partShipValue = this.get("value");
				dj.byId("part_ship_detl").set("value", this.get("value"));
				//Execute this construct only in case of Swift 2018 Switch ON.
				//Switch ON is controlled by swift.version key in portal.properties
				if(m._config.swift2018Enabled){ 
					if(partShipValue === 'CONDITIONAL'){
						d.byId("infoMessagePartialShipment").style.display = "block";
						d.byId("infoMessagePartialShipment").style.paddingLeft = "250px";
					}
					else{
						d.byId("infoMessagePartialShipment").style.display = "none";
					}				
				}
				m.toggleFields(partShipValue && partShipValue !== "ALLOWED" &&
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
				var fieldValue = this.get("value");
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
				m.toggleFields(fieldValue && fieldValue !== "ALLOWED" &&
						fieldValue !== notAllowed && fieldValue !== "NONE", 
						null, ["tran_ship_detl_text_nosend"]);
				
			});
			m.connect("tran_ship_detl_text_nosend", "onBlur", function(){
				dj.byId("tran_ship_detl").set("value", this.get("value"));
			});
			m.connect("renew_on_code", "onChange", function(){
				m.toggleFields(
						this.get("value") === "02", 
						null,
						["renewal_calendar_date"]);
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
			
			// Optional EUCP flag 
			m.connect("eucp_flag", "onClick", function(){
				m.toggleFields(this.get("checked"), null, ["eucp_details"]);
			});
			
			m.connect("inco_term", "onChange", function(){
				m.toggleFields(this.get("value"), null, ["inco_place"], false, false);
			});
			m.connect("inco_term_year", "onChange", function(){
				m.toggleFields(this.get("value"), null, ["inco_term"], false, true);
			});
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
			
			m.connect("transport_mode_nosend", "onChange", function(){
				var transportModeFieldValue = this.get("value");
				dj.byId("transport_mode").set("value", transportModeFieldValue);
				m.toggleFields(transportModeFieldValue && transportModeFieldValue !== "AIRT" && transportModeFieldValue !== "SEAT" && transportModeFieldValue !== "RAIL" && transportModeFieldValue !== "ROAD" && transportModeFieldValue !== "MULT", 
						null, ["transport_mode_text_nosend"], false, false);
				
			});
			
			m.connect("transport_mode_text_nosend", "onBlur", function(){
				dj.byId("transport_mode").set("value", this.get("value"));
			});
			
			m.connect("product_type_code","onChange",function(){
				if(dj.byId("product_type_code").get("value")!== "99"){
					d.style("product_type_details_row","display","none");
				}
				else {
					d.style("product_type_details_row","display","block");
					//m.animate('fadeIn', d.byId("product_type_details_row"));
				}
			});
			
			m.connect("standby_rule_code", "onChange", function(){
				m.toggleFields((this.get("value") == "99"), null, ["standby_rule_other"]);
			});
			
			m.connect("entity_img_label","onClick",_clearPrincipalFeeAcc);
			//Set 
			m.connect("renew_amt_code_1","onClick",  function(){
				m.setRenewalAmount(this);
				});
			m.connect("renew_amt_code_2","onClick",  function(){
				m.setRenewalAmount(this);
				});
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
			
			m.connect(dj.byId('line_item_qty_unit_measr_code'), 'onChange', function(){dj.byId('line_item_qty_unit_measr_label').set('value', this.get('displayedValue'));});
			
		
			//Execute this construct only in case of Swift 2018 Switch ON.
			//Switch ON is controlled by swift.version key in portal.properties
			if(m._config.swift2018Enabled){ 
				m._bindSwift2018();
			}else{
				m.connect("cfm_inst_code_1", "onClick", m.resetConfirmationCharges);
				m.connect("cfm_inst_code_2", "onClick", m.resetConfirmationCharges);
				m.connect("cfm_inst_code_3", "onClick", m.resetConfirmationCharges);
			}
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
			m.connect("advising_bank_address_line_4", "onFocus", function(){
				m.showTooltip(m.getLocalization('addressLine4ToolTip', 
						[dj.byId("advising_bank_address_line_4").get("displayedValue"), dj.byId("advising_bank_address_line_4").get("value") ]), d.byId("advising_bank_address_line_4"), [ 'right' ],5000);
			});
			m.connect("advise_thru_bank_address_line_4", "onFocus", function(){
				m.showTooltip(m.getLocalization('addressLine4ToolTip', 
						[dj.byId("advise_thru_bank_address_line_4").get("displayedValue"), dj.byId("advise_thru_bank_address_line_4").get("value") ]), d.byId("advise_thru_bank_address_line_4"), [ 'right' ],5000);
			});			
		},
		
		onFormLoad : function() {
			m.setCurrency(dj.byId("lc_cur_code"), ["lc_amt"]);
			// set final expiry date
			//m.setRenewalFinalExpiryDate();
			
			/*descofGoods.set("required", false);*/
			var creditAvlWithBankType = dj.byId("credit_available_with_bank_type");
			if(creditAvlWithBankType) {
				creditAvlWithBankType.onChange(creditAvlWithBankType.get("value"));
			}

			var shipDetlSelect = dj.byId("part_ship_detl_nosend");
			if(shipDetlSelect) {
				var shipDetlValue = shipDetlSelect.get("value");
				m.toggleFields(shipDetlValue && shipDetlValue !== "ALLOWED" &&
						   	shipDetlValue !== notAllowed && shipDetlValue !== "NONE", 
					null, ["part_ship_detl_text_nosend"], true);
			}
			var shipDetl = dj.byId("part_ship_detl");
			if(shipDetl && shipDetl.get("value") === "") {
				shipDetl.set("value", shipDetlSelect.get("value"));
			}
			var advSendMode = dj.byId("adv_send_mode");
			if(advSendMode) {
				m.toggleFields(
						advSendMode.get("value") == "99",
						null, ["adv_send_mode_text"]);
			}
			var tranShipDetlSelect = dj.byId("tran_ship_detl_nosend");
			if(tranShipDetlSelect) {
				var fieldValue = tranShipDetlSelect.get("value");
				m.toggleFields(fieldValue && fieldValue !== "ALLOWED" &&
						fieldValue !== notAllowed && fieldValue !== "NONE", 
						null, ["tran_ship_detl_text_nosend"]);
			}
			var tranShipDetl = dj.byId("tran_ship_detl");
			if(tranShipDetl && tranShipDetl.get("value") === "") {
				tranShipDetl.set("value", tranShipDetlSelect.get("value"));
			}
						
			// First activate radio buttons depending on which "Credit/Available By" is selected
			var checkboxes = [
					"cr_avl_by_code_1", "cr_avl_by_code_2", "cr_avl_by_code_3",
					"cr_avl_by_code_4", "cr_avl_by_code_5", "cr_avl_by_code_6"];
			
			// Show an input field when Issued Stand by LC type "Other" is selected
			var standByLCType = dj.byId("product_type_code");
			if(standByLCType && standByLCType.get("value") !== "99"){
				d.style("product_type_details_row","display","none");
			}			
			if(dj.byId("stand_by_lc_code") && dj.byId("stand_by_lc_code").get("value") != null) {
				dj.byId("product_type_code").set("disabled",true);
			}
			//_formLoadSwift2018 function executes only for SWIFT 2018 Switch ON
			//Switch ON is controlled by swift.version key in portal.properties
			if(m._config.swift2018Enabled){
				m._onFormLoadSwift2018();
			}
			d.forEach(checkboxes, function(id){
				var checkbox = dj.byId(id);
				if(checkbox && checkbox.get("checked")) {
					checkbox.onClick();
				}
			});
			
			/**
			 * Next, choose which of the activated buttons to selected based on the values of 
			 * one of the date fields
			 */
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
						["final_expiry_date"], ["rolling_renewal_nb", "rolling_cancellation_days", "rolling_renew_on_code"], true);
			}
			
			var rollingRenewOnCode = dj.byId("rolling_renew_on_code");
			if(rollingRenewOnCode) {
				m.toggleFields(rollingRenewOnCode.get("value") === "03",
						["rolling_day_in_month"], ["rolling_renew_for_nb"], true);
			}
			

			var eucpFlag = dj.byId("eucp_flag");
			if(eucpFlag) {
				m.toggleFields(eucpFlag.get("checked"), null, ["eucp_details"]);
			}

		    // display the other field, if we have to
			var tenorDaysType = dj.byId("tenor_days_type") ?
									dj.byId("tenor_days_type").get("value") : "";
			if(tenorDaysType) {
				m.toggleFields(tenorDaysType === "99", null, ["tenor_type_details"], true);
				m.setDraftTerm();
			}

			var issuingBankAbbvName = dj.byId("issuing_bank_abbv_name");
			if(issuingBankAbbvName) {
				issuingBankAbbvName.onChange();
			}
			if(issuingBankAbbvName && issuingBankAbbvName.get("value") !== "" && dj.byId("stand_by_lc_code") &&  dj.byId("stand_by_lc_code").get("value") !== "") {
				issuingBankAbbvName.set("disabled",true);
			}
			
			var issuingBankCustRef = dj.byId("issuing_bank_customer_reference");
			if(issuingBankCustRef) {
				issuingBankCustRef.onChange();
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
				 m.toggleFields(m._config.customerBanksMT798Channel[issuingBankAbbvName] === true && m.hasAttachments(), null, ["delivery_channel"], false, false);
			 });
			
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
			var _provisionalDiv = d.byId('pro-check-box');
			if(m._config.provisionalProductTypes[dj.byId("product_type_code") ? dj.byId("product_type_code").get("value") : ''])
				{
					m.animate('fadeIn', _provisionalDiv);
				}
			else
				{
					dj.byId("provisional_status") ? dj.byId("provisional_status").set("checked", false) : "";
					m.animate('fadeOut', _provisionalDiv);
				}
			var siRule = dj.byId("standby_rule_code");
			if(siRule) {
				m.toggleFields(
						siRule.get("value") == "99",
						null, ["standby_rule_other"]);
			}
			
			m.setCurrency(dj.byId('total_net_cur_code'), ['total_net_amt']);
			m.toggleDisableButtons();
			if (d.byId('line_item_qty_unit_measr_other_row')) {
				m.animate("fadeOut", 'line_item_qty_unit_measr_other_row');
			}
			 var lineItem = "line-items";
				if(dj.byId(lineItem) && dj.byId(lineItem).grid)
				{
					dj.byId(lineItem).grid._refresh();
				}
				if(m._config.purchase_order_assistant=="true")
				{
				m.animate("fadeIn", d.byId(lineItem));
				m.animate("fadeIn", d.byId("fake_total_cur_code_row"));
				m.animate("fadeIn", d.byId("total_net_cur_code_row"));
				
				}
			else
				{
				m.animate("fadeOut", d.byId(lineItem));
				m.animate("fadeOut", d.byId("fake_total_cur_code_row"));
				m.animate("fadeOut", d.byId("total_net_cur_code_row"));
				}
			// Radio field template is reading values from all nodes in the input xml.
            // For ones with multiple transactions, (ex:  create, approve, amend, approve.) the tag values from the root node is not being picked, because of radio-value = //*name in form-templates.
            // To overcome this we are overriding "value" and "checked" params from js.
			m.setRenewalAmountOnFormLoad();
			if(!misys._config.makeDescOfGoodsMandatory){
			var shipFrom = dj.byId("ship_from");
			var shipLoad = dj.byId("ship_loading");
			var shipDisch = dj.byId("ship_discharge");
			var shipTo = dj.byId("ship_to");
			var shipTerm = dj.byId("inco_term");
			var shipLastDate = dj.byId("last_ship_date");
			var shipPeriod = dj.byId("narrative_shipment_period");
			var descofGoods = dj.byId("narrative_description_goods");
			if((shipFrom && shipFrom.get('value') !== "") || (shipLoad && shipLoad.get('value') !== "") || (shipDisch && shipDisch.get('value') !== "") || (shipTo && shipTo.get('value') !== "") ||  (shipTerm && shipTerm.get('value') !== "") || (shipLastDate && shipLastDate.get('value') !== null) || (shipPeriod && shipPeriod.get('value') !== "")) {
				descofGoods.set("required", true);
			}
			else
				{
				descofGoods.set("required", false);
				}
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
			if(dj.byId("lc_exp_date_type_code") && dj.byId("lc_exp_date_type_code").value == '02')
				{
					m.animate("fadeIn", d.byId("exp-event"));
					m.toggleRequired("exp_event", true);
				}
			else
				{
					m.animate("fadeOut", d.byId("exp-event"));
					m.toggleRequired("exp_event", false);
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
					if(dj.byId("delivery_to").get("value") === "" ||
							dj.byId("delivery_to").get("value") === "01" || dj.byId("delivery_to").get("value") === "03")
						{
								m.toggleFields((dj.byId("delivery_to").get("value") === "" || dj.byId("delivery_to").get("value") === "01" ||
										dj.byId("delivery_to").get("value") === "03" ), null, ["narrative_delivery_to"]);
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
			 if(entity && entity.get("value") === "")
			 	{
				 	return false;
			 	}
			 else
			 {
				 return true;
			 }
		 },
		
		beforeSubmitValidations: function() {
			
			var rcfValidation = true;
			//_beforeSubmitValidationsSwift2018 function executes only for SWIFT 2018 Switch ON
			//Switch ON is controlled by swift.version key in portal.properties
			if(m._config.swift2018Enabled){
				rcfValidation = m._beforeSubmitValidationsSwift2018();
				if(!rcfValidation){
					return rcfValidation;
				}
			}
		
			 var dayInMonth  = dj.byId('rolling_day_in_month') ;
			
			//Generic validation: transfer amount should be greater than zero
			if(dj.byId("lc_amt"))
			{
				if(!m.validateAmount((dj.byId("lc_amt"))?dj.byId("lc_amt"):0))
				{
					m._config.onSubmitErrorMsg =  m.getLocalization("amountcannotzero");
					dj.byId("lc_amt").set("value", "");
					return false;
				}
			} 
			 //Zero not allowed for Day in month for Renewal Details
			 if(dayInMonth && dayInMonth.get("value")=== 0)
			 {
				    m._config.onSubmitErrorMsg =  m.getLocalization("dayInMonthZeroNotApplicableError");
				   	dayInMonth.set("value", "");
				 	return false;
			 }
			 
			//  summary: 
			//            Form-specific validations
			//  description:
		    //            Specific pre-submit validations for this form, that are called after
			//            the standard Dojo validations.
			//
			//            Here we check if at least one of the payment/draft at radio buttons have
			// 			  been checked. Also, we check that at least the last shipment date or the 
			//            shipment period is populated. (TI Disable)

			var tenorType1 = dj.byId("tenor_type_1"),
				draftTerm = dj.byId("draft_term");		
			if(draftTerm && draftTerm.get("value") === "")
			{
				draftTerm.set("value",document.getElementById("draft_term").innerHTML);
			}
			if (tenorType1 && !tenorType1.get("checked") && !dj.byId("tenor_type_2").get("checked") && !dj.byId("tenor_type_3").get("checked") && draftTerm && draftTerm.get("value") === "")
			{
				m._config.onSubmitErrorMsg = m.getLocalization("mandatoryPaymentTypeError");
				m.showTooltip(m.getLocalization("mandatoryPaymentTypeError"), tenorType1.domNode);
				return false;
			}
			var expDate = dj.byId("exp_date");
			var projectedExp = dj.byId("projected_expiry_date");
			var finalExp = dj.byId("final_expiry_date");
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
			if(dj.byId("rolling_renewal_flag") && dj.byId("rolling_renewal_nb") && dj.byId("rolling_renewal_flag").get("checked") && d.number.parse(dj.byId("rolling_renewal_nb").get("value")) === 1)
			{
				console.debug("Invalid Number of Rolling renewals");
				dj.byId("rolling_renewal_nb").set("state","Error");
				m._config.onSubmitErrorMsg =  m.getLocalization("invalidNumberOfRollingRenewals");
				// clearing the field as part of MPS-50486
				dj.byId("rolling_renewal_nb").set("value"," ");
				return false;
			}
			
			//Validate the length of bank name and all the address fields length not to exceed 1024
			if(!(m.validateLength([ "applicant", "beneficiary", "credit_available_with_bank", "advising_bank","advise_thru_bank" ]))) 
			{
				return false;
			}
			if(dj.byId("issuing_bank_abbv_name") && !m.validateApplDate(dj.byId("issuing_bank_abbv_name").get("value")))
			{
				m._config.onSubmitErrorMsg = m.getLocalization('changeInApplicationDates');
				m.goToTop();
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
			if(dj.byId("issuing_bank_abbv_name") && !m.validateApplDate(dj.byId("issuing_bank_abbv_name").get("value")))
			{
				m._config.onSubmitErrorMsg = m.getLocalization('changeInApplicationDates');
				m.goToTop();
				return false;
      		}
			return true;
			
		},
		generateGTEEFromNew : function(){

			var xmlString = m.formToXML();
			
			dj.byId('transactiondata_download_project').set('value', xmlString);
		    dj.byId('gteeName_download_project').set('value', dj.byId('standby_text_type_code').get('value'));
		    dj.byId('company_download_project').set('value', dj.byId('company_name').get('value'));
		   /* dj.byId('bank_download_project').set('value', dj.byId('recipient_bank_abbv_name').get('value'));*/
		    if (dj.byId('entity'))
		    {
		    	dj.byId('entity_download_project').set('value', dj.byId('entity').get('value'));
		    }
		    if (dj.byId('parent_entity'))
		    {
		    	dj.byId('parentEntity_download_project').set('value', dj.byId('parent_entity').get('value'));
		    }
		    if(!dj.byId("downloadgteetext")) {
				d.parser.parse();
			}
		    dj.byId("downloadgteetext").submit();
		    return false;
		}
	});
	function _validateShipDetails(){
		var shipFrom = dj.byId("ship_from");
		var shipLoad = dj.byId("ship_loading");
		var shipDisch = dj.byId("ship_discharge");
		var shipTo = dj.byId("ship_to");
		var shipTerm = dj.byId("inco_term");
		var shipLastDate = dj.byId("last_ship_date");
		var shipPeriod = dj.byId("narrative_shipment_period");
		var descofGoods = dj.byId("narrative_description_goods");
		var shipDetlSelect = dj.byId("part_ship_detl_nosend");
		var tranDetlSelect = dj.byId("tran_ship_detl_nosend");		
		var requiredPrefix = "*";
		var title;
		var descofGoodsTab = dijit.byId(descofGoods.parentTab);
		
		if((shipFrom && shipFrom.get('value') !== "") || (shipLoad && shipLoad.get('value') !== "") || 
			(shipDisch && shipDisch.get('value') !== "") || (shipTo && shipTo.get('value') !== "") || 
			(shipTerm && shipTerm.get('value') !== "") || (shipLastDate && shipLastDate.get('value') !== null) || 
			(shipDetlSelect.get('value') == "ALLOWED" || shipDetlSelect.get('value') == "OTHER") ||
			(tranDetlSelect.get('value') == "ALLOWED" || tranDetlSelect.get('value') == "OTHER")) {
				descofGoods.set("required", true);
				title = descofGoodsTab.get('title');
				if((title.indexOf(requiredPrefix) === -1)) {
					requiredPrefix += " ";
					title = requiredPrefix + title;
					descofGoodsTab.set('title', title);
				}
		}
			else
			{
				descofGoods.set("required", false);
				title = descofGoodsTab.get('title');
				if((title.indexOf(requiredPrefix) !== -1)) {
					title = title.split(requiredPrefix)[1];
					if (title.indexOf("<img") !== -1) {
						title = title.substr(0,	title.indexOf("<img"));
						descofGoodsTab.set('title', title);
					}
					descofGoodsTab.set('title', title);
					
				}
			}
			
		}
	
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.trade.create_si_client');
