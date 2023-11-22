dojo.provide("misys.binding.trade.amend_si_swift2018");

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
dojo.require("misys.widget.Amendments");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode
	
	// dojo.subscribe once a record is deleted from the grid
    var _deleteGridRecord = "deletegridrecord";
    
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
	
    d.mixin(m._config, {

		initReAuthParams : function() {
									
			var reAuthParams = {
				productCode : 'SI',	
				subProductCode : '',
				transactionTypeCode : "03",
				subTransactionTypeCode : dj.byId("sub_tnx_type_code") ? dj.byId("sub_tnx_type_code").get('value') : "",
				entity :dj.byId("entity") ? dj.byId("entity").get("value") : "",
				currency : dj.byId("lc_cur_code")? dj.byId("lc_cur_code").get('value') : "",
				amount : dj.byId("lc_amt") ? m.trimAmount(dj.byId("lc_amt").get('value')) : "",
				tnxAmt : dj.byId("tnx_amt") ? m.trimAmount(dj.byId("tnx_amt").get('value')) : "",
				es_field1 : dj.byId("lc_amt")? m.trimAmount(dj.byId("lc_amt").get('value')) : "",
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
			m.setValidation("amd_date", m.validateAmendmentDate);
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
			//m.setValidation("final_expiry_date",m.validateTradeFinalExpiryDate);
			m.setValidation("renewal_calendar_date",m.validateRenewalCalendarDate);
			m.connect("ntrf_flag", "onClick", m.toggleTransferIndicatorFlag);
			m.connect("irv_flag", "onClick", m.checkIrrevocableFlag);
			m.connect("ntrf_flag", "onClick", m.checkNonTransferableFlag);
			m.connect("stnd_by_lc_flag", "onClick", m.checkStandByFlag);
			m.connect("cfm_inst_code_1", "onClick", m.resetConfirmationChargesLC);
			m.connect("cfm_inst_code_2", "onClick", m.resetConfirmationChargesLC);
			m.connect("cfm_inst_code_3", "onClick", m.resetConfirmationChargesLC);
			//SWIFT 2018
			m.connect("amd_chrg_brn_by_code_1", "onClick", m.amendChargesLC);
			m.connect("amd_chrg_brn_by_code_2", "onClick", m.amendChargesLC);
			m.connect("amd_chrg_brn_by_code_3", "onClick", m.amendChargesLC);
			m.connect("amd_chrg_brn_by_code_4", "onClick", m.amendChargesLC);
			m.setValidation("advising_bank_iso_code", m.validateBICFormat);	
			m.setValidation("advise_thru_bank_iso_code", m.validateBICFormat);
			m.connect("inco_term_year", "onChange",m.getIncoTerm);
			m.setValidation("requested_confirmation_party_iso_code", m.validateBICFormat);
			m.connect("advising_bank_iso_code", "onChange", function(){
				var bicCodeValue = this.get("value");
				if(bicCodeValue.length > 0){
					m.setRequiredFields(["advising_bank_name","advising_bank_address_line_1"] , false);
				}
			});
			m.connect("advise_thru_bank_iso_code", "onChange", function(){
				var bicCodeValue = this.get("value");
				if(bicCodeValue.length > 0){
					m.setRequiredFields(["advise_thru_bank_name","advise_thru_bank_address_line_1"] , false);
				}
			});
			m.connect("requested_confirmation_party_iso_code", "onChange", function(){
				var bicCodeValue = this.get("value");
				if(bicCodeValue.length > 0){
					m.setRequiredFields(["requested_confirmation_party_name","requested_confirmation_party_address_line_1"] , false);

				}
			});
			//m.connect("req_conf_party_flag", "onChange" , m.resetBankRequiredFields);	
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
			m.connect("cr_avl_by_code_6", "onClick", m.togglePaymentDraftAt);
			m.connect("tenor_type_1", "onClick", m.toggleDraftTerm);
			m.connect("tenor_type_1", "onClick", m.setDraftTerm);
			m.connect("tenor_type_2", "onClick",m.toggleDraftTerm);
			m.connect("tenor_type_3", "onClick",m.toggleDraftTerm);
			m.connect("renew_flag", "onClick", function(){
//		        Toggle the display of the renewal details.
				
				if(dj.byId("is_bank") && dj.byId("is_bank").get("value") === "N")
				{
					m.toggleFields(this.get("checked"), ["advise_renewal_flag",
					           "rolling_renewal_flag", "final_expiry_date",
					           "renew_on_code", "renew_for_nb", "renew_for_period"],["renew_on_code","renew_for_nb","renew_for_period"]);
				}
				else
				{
					m.toggleFields(this.get("checked"), ["advise_renewal_flag",
	  				           "rolling_renewal_flag", "projected_expiry_date", "final_expiry_date", 
	  				           "renew_on_code", "renew_for_nb", "renew_for_period"],["renew_on_code","renew_for_nb","renew_for_period"]);
				}

				// Reset other fields
				if(!this.get("checked")) {
					dj.byId("renew_on_code").set("value", "");
					dj.byId("renew_for_nb").set("value", "");
					dj.byId("renew_for_period").set("value", "");
					dj.byId("advise_renewal_flag").set("checked", false);
					dj.byId("rolling_renewal_flag").set("checked", false);
					dj.byId("renew_amt_code_1").set("disabled", true);
					dj.byId("renew_amt_code_2").set("disabled", true);
					if(dj.byId("projected_expiry_date"))
					{
						dj.byId("projected_expiry_date").set("value", null);
					}
					dj.byId("final_expiry_date").set("value", null);
				}
				else
				{
				  dj.byId("renew_amt_code_1").set("disabled", false);
				  dj.byId("renew_amt_code_2").set("disabled", false);
				  dj.byId("renew_amt_code_2").set("checked", true);
				}
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
			
			m.connect("advise_renewal_flag", "onClick", function(){
				m.toggleFields(this.get("checked"),["advise_renewal_days_nb"],["advise_renewal_days_nb"]);
			});
			m.connect("advise_renewal_flag", "onChange", function(){
				m.toggleFields(this.get("checked"), [
						"advise_renewal_days_nb"],["advise_renewal_days_nb"]);
			});
			m.connect("rolling_renewal_flag", "onClick", function(){
				m.toggleFields(this.get("checked"), ["final_expiry_date",
						"rolling_renewal_nb", "rolling_cancellation_days", "rolling_renew_on_code"],["rolling_renew_on_code","rolling_renewal_nb","rolling_cancellation_days"]);
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
				m.toggleFields(this.get("checked"),["final_expiry_date",
						"rolling_renewal_nb", "rolling_cancellation_days", "rolling_renew_on_code"],["rolling_renew_on_code","rolling_renewal_nb","rolling_cancellation_days"]);
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
			m.connect("rolling_renew_on_code", "onChange", function(){
				m.toggleFields(this.get("value") === "03",
						["rolling_day_in_month", "rolling_renew_for_nb"], ["rolling_renew_for_nb"], true);
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
			
			m.connect("lc_amt", "onBlur", m.calculateAmendTransactionAmount);
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
			m.connect("issuing_bank_abbv_name", "onChange", m.populateReferences);
			if(dj.byId("issuing_bank_abbv_name")) {
				m.connect("entity", "onChange", function(){
					dj.byId("issuing_bank_abbv_name").onChange();
				});
			}
			m.connect("issuing_bank_customer_reference", "onChange", m.setApplicantReference);
			m.connect("part_ship_detl_nosend", "onChange", function(){
				var partShipValue = this.get("value");
				dj.byId("part_ship_detl").set("value", this.get("value"));
				//SWIFT 2018 changes
				if(partShipValue == 'CONDITIONAL'){
					document.getElementById("infoMessagePartialShipment").style.display = "block";
					document.getElementById("infoMessagePartialShipment").style.paddingLeft = "250px";
				}
				else{
					document.getElementById("infoMessagePartialShipment").style.display = "none";
				}
				m.toggleFields(partShipValue && partShipValue !== "ALLOWED" &&
								partShipValue !== "NOT ALLOWED" && partShipValue !== "NONE", 
								null, ["part_ship_detl_text_nosend"]);
			});
			m.connect("part_ship_detl_text_nosend", "onBlur", function(){
				dj.byId("part_ship_detl").set("value", this.get("value"));
			});
			m.connect("tran_ship_detl_nosend", "onChange", function(){
				var fieldValue = this.get("value");
				dj.byId("tran_ship_detl").set("value", fieldValue);
				//SWIFT 2018 changes
				if(fieldValue == 'CONDITIONAL'){
					document.getElementById("infoMessageTranshipment").style.display = "block";
					document.getElementById("infoMessageTranshipment").style.paddingLeft = "250px";
				}
				else{
					document.getElementById("infoMessageTranshipment").style.display = "none";
				}
				m.toggleFields(fieldValue && fieldValue !== "ALLOWED" &&
						fieldValue !== "NOT ALLOWED" && fieldValue !== "NONE", 
						null, ["tran_ship_detl_text_nosend"]);
				
			});
			m.connect("tran_ship_detl_text_nosend", "onBlur", function(){
				dj.byId("tran_ship_detl").set("value", this.get("value"));
			});
			m.connect("renew_on_code", "onChange", function(){
				m.toggleFields(
						this.get("value") === "02",
						["renewal_calendar_date"], ["renewal_calendar_date"]);
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
			m.connect("inco_term_year", "onChange", function(){
				m.toggleFields(this.get("value"), null, ["inco_term"], false, true);
			});
			m.connect("inco_term", "onChange", function(){
				m.toggleFields(this.get("value"), null, ["inco_place"], false, false);
			});
			
			m.connect("adv_send_mode", "onChange",  function(){
				m.toggleMT798Fields("issuing_bank_abbv_name");
			});
			m.connect("issuing_bank_abbv_name", "onChange",  function(){
				m.toggleMT798Fields("issuing_bank_abbv_name");
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
				m.toggleFields((this.get("value") == "99"), ["standby_rule_other"], null);
			});
			
			m.connect("entity_img_label","onClick",_clearPrincipalFeeAcc);
			//Set 
			m.connect("renew_amt_code_1","onClick",  function(){
				m.setRenewalAmount(this);
				});
			m.connect("renew_amt_code_2","onClick",  function(){
				m.setRenewalAmount(this);
				});
			m.connect("narrative_period_presentation", "onBlur", function(){
				var narrPeriodPresentation = dj.byId("narrative_period_presentation").get("value");
				dj.byId("narrative_period_presentation_nosend").set("value",narrPeriodPresentation);
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
						m.toggleRequired("delv_org_text", false);
						dj.byId("delv_org_text").set("value", "");
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
			
			//AJAX Call
			m.xhrPost({
						url : misys.getServletURL("/screen/AjaxScreen/action/GetAmendmentWarning"),
						handleAs 	: "json",
						sync 		: true,
						content 	: {
										refId  : dj.byId("ref_id").get('value'),
										companyId : dj.byId("company_id").get('value'),
										productCode : 'SI'
									  },
						load		: function(response, args){
										m._config.showWarningBene 	= 	response.showWarningBene ? response.showWarningBene : false;
									  }
			});
	
			if(m._config.showWarningBene)
				{
					m.dialog.show("CONFIRMATION", m.getLocalization("warningMsgAmendLC"), "", 
							"", "","","",function(){
						var amenScreenURL = "/screen/StandbyIssuedScreen?option=EXISTING&tnxtype=03";
						window.location.href = misys.getServletURL(amenScreenURL);
						return;
							}
						);
				}
			
			m.setCurrency(dj.byId("lc_cur_code"), ["inc_amt", "dec_amt","lc_amt","org_lc_amt"]);
			// setting product code to LC for amt validations.
			m._config.productCode = "lc";
			// set final expiry date
			//m.setRenewalFinalExpiryDate();
			var creditAvlWithBankType = dj.byId("credit_available_with_bank_type");
			if(creditAvlWithBankType) {
				creditAvlWithBankType.onChange(creditAvlWithBankType.get("value"));
			}
			var shipDetlSelect = dj.byId("part_ship_detl_nosend");
			if(shipDetlSelect) {
				var shipDetlValue = shipDetlSelect.get("value");
				//SWIFT 2018 changes
				if(shipDetlValue == 'CONDITIONAL'){
					document.getElementById("infoMessagePartialShipment").style.display = "block";
					document.getElementById("infoMessagePartialShipment").style.paddingLeft = "250px";
				}
				else{
					document.getElementById("infoMessagePartialShipment").style.display = "none";
				}
				m.toggleFields(shipDetlValue && shipDetlValue !== "ALLOWED" &&
						   	shipDetlValue !== "NOT ALLOWED" && shipDetlValue !== "NONE", 
					null, ["part_ship_detl_text_nosend"], true);
			}
			var shipDetl = dj.byId("part_ship_detl");
			if(shipDetl && shipDetl.get("value") === "") {
				shipDetl.set("value", shipDetlSelect.get("value"));
			}
			
			var crAvlByCode1Checked = dj.byId("cr_avl_by_code_1").get("checked"),
			crAvlByCode2Checked = dj.byId("cr_avl_by_code_2").get("checked"),
	    	crAvlByCode3Checked = dj.byId("cr_avl_by_code_3").get("checked"),
	    	crAvlByCode5Checked = dj.byId("cr_avl_by_code_5").get("checked");
			if(!crAvlByCode1Checked && !crAvlByCode2Checked && !crAvlByCode3Checked && !crAvlByCode5Checked){
				m.setDraftTerm();
			}

			var tranShipDetlSelect = dj.byId("tran_ship_detl_nosend");
			if(tranShipDetlSelect) {
				var fieldValue = tranShipDetlSelect.get("value");
				//SWIFT 2018 changes
				if(fieldValue == 'CONDITIONAL'){
					document.getElementById("infoMessageTranshipment").style.display = "block";
					document.getElementById("infoMessageTranshipment").style.paddingLeft = "250px";
				}
				else{
					document.getElementById("infoMessageTranshipment").style.display = "none";
				}
				m.toggleFields(fieldValue && fieldValue !== "ALLOWED" &&
						fieldValue !== "NOT ALLOWED" && fieldValue !== "NONE", 
						null, ["tran_ship_detl_text_nosend"]);
			}
			var tranShipDetl = dj.byId("tran_ship_detl");
			if(tranShipDetl && tranShipDetl.get("value") === "") {
				tranShipDetl.set("value", tranShipDetlSelect.get("value"));
			}
						
			m.resetRequestedConfirmationParty();							
			if(dj.byId("req_conf_party_flag")){			
				var requestedConfirmationFlag=dj.byId("req_conf_party_flag").value;		
				if(requestedConfirmationFlag == "Other"){
					d.byId("requested-conf-party-bank-details").style.display = "block";
				}else{
					d.byId("requested-conf-party-bank-details").style.display = "none";
				}
			}
			
			if(dj.byId("amd_chrg_brn_by_code_4")){
				if(!dj.byId("amd_chrg_brn_by_code_4").get("value")){
					var amdChargesArea = dj.byId("narrative_amend_charges_other");
					if(amdChargesArea){
						amdChargesArea.set("value", "");
						amdChargesArea.set("disabled", true);	
					}
				}
			}
			/*if(dj.byId("amd_chrg_brn_by_code_1") && !dj.byId("amd_chrg_brn_by_code_1").get("value") && !dj.byId("amd_chrg_brn_by_code_2").get("value") && !dj.byId("amd_chrg_brn_by_code_3").get("value")){
				dj.byId("amd_chrg_brn_by_code_2").set("checked",true);
			}*/
			
			// First activate radio buttons depending on which "Credit/Available By" is selected
			var checkboxes = [
					"cr_avl_by_code_1", "cr_avl_by_code_2", "cr_avl_by_code_3",
					"cr_avl_by_code_4", "cr_avl_by_code_5", "cr_avl_by_code_6"];
			
			// Show an input field when Issued Stand by LC type "Other" is selected
			var standByLCType = dj.byId("product_type_code");
			if(standByLCType && standByLCType.get("value") !== "99"){
				d.style("product_type_details_row","display","none");
			}
			else
			{
				d.style("product_type_details_row","display","block");
				dj.byId("product_type_details").set("disabled",true);
			}
			if(dj.byId("stand_by_lc_code") && dj.byId("stand_by_lc_code").get("value") != null) {
				dj.byId("product_type_code").set("disabled",true);
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
			 //d.hitch(renewFlag, m.toggleRenewalDetails, true)();

//		        Toggle the display of the renewal details.
				
				if(dj.byId("is_bank") && dj.byId("is_bank").get("value") === "N")
				{
					m.toggleFields(renewFlag.get("checked"), ["advise_renewal_flag",
					           "rolling_renewal_flag", "final_expiry_date",
					           "renew_on_code", "renew_for_nb", "renew_for_period"],["renew_on_code","renew_for_nb","renew_for_period"]);
				}
				else
				{
					m.toggleFields(renewFlag.get("checked"), ["advise_renewal_flag",
	  				           "rolling_renewal_flag", "projected_expiry_date", "final_expiry_date", 
	  				           "renew_on_code", "renew_for_nb", "renew_for_period"],["renew_on_code","renew_for_nb","renew_for_period"]);
				}

				// Reset other fields
				if(!renewFlag.get("checked")) {
					dj.byId("renew_on_code").set("value", "");
					dj.byId("renew_for_nb").set("value", "");
					dj.byId("renew_for_period").set("value", "");
					dj.byId("advise_renewal_flag").set("checked", false);
					dj.byId("rolling_renewal_flag").set("checked", false);
					dj.byId("renew_amt_code_1").set("disabled", true);
					dj.byId("renew_amt_code_2").set("disabled", true);
					if(dj.byId("projected_expiry_date"))
					{
						dj.byId("projected_expiry_date").set("value", null);
					}
					dj.byId("final_expiry_date").set("value", null);
				}
				else
				{
				  dj.byId("renew_amt_code_1").set("disabled", false);
				  dj.byId("renew_amt_code_2").set("disabled", false);
				  dj.byId("renew_amt_code_2").set("checked", true);
				}
			
				
			}
			
			var renewOnCode = dj.byId("renew_on_code");
			if(renewOnCode) {
				m.toggleFields(
						renewOnCode.get("value") === "02", ["renewal_calendar_date"], ["renewal_calendar_date"], true);
			}
			
			var adviseRenewalFlag = dj.byId("advise_renewal_flag");
			if(adviseRenewalFlag) {
				m.toggleFields(adviseRenewalFlag.get("checked"), ["advise_renewal_days_nb"], ["advise_renewal_days_nb"], true);
			}
			
			var rollingFlag = dj.byId("rolling_renewal_flag");
			if(rollingFlag) {
				m.toggleFields(rollingFlag.get("checked"),
						["final_expiry_date","rolling_renewal_nb", "rolling_cancellation_days", "rolling_renew_on_code"], ["rolling_renew_on_code","rolling_renewal_nb","rolling_cancellation_days"], true);
			}
			
			var rollingRenewOnCode = dj.byId("rolling_renew_on_code");
			if(rollingRenewOnCode) {
				m.toggleFields(rollingRenewOnCode.get("value") === "03",
						["rolling_day_in_month","rolling_renew_for_nb"], ["rolling_renew_for_nb"], true);
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
			
			var siRule = dj.byId("standby_rule_code");
			if(siRule) {
				m.toggleFields((siRule.get("value") == "99"), ["standby_rule_other"], null);
			}
			// Radio field template is reading values from all nodes in the input xml.
            // For ones with multiple transactions, (ex:  create, approve, amend, approve.) the tag values from the root node is not being picked, because of radio-value = //*name in form-templates.
            // To overcome this we are overriding "value" and "checked" params from js.
			m.setRenewalAmountOnFormLoad();
			m.toggleNarrativeDivStatus(true,'');
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
			if(dj.byId("dec_amt") && !isNaN(dj.byId("dec_amt").get("value")))
			{
				dj.byId("inc_amt").set("disabled", true);
			}
			if(dj.byId("inc_amt") && !isNaN(dj.byId("inc_amt").get("value")))
			{
				dj.byId("dec_amt").set("disabled", true);
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
					dj.byId("delv_org_text").set("value", "");
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
			

			
			//General text form fields comparison
			var generalTextFormFields = ["renew_on_code","adv_send_mode","applicant_name","applicant_address_line_1","applicant_address_line_2","applicant_dom","applicant_address_line_4","beneficiary_name","beneficiary_address_line_1",
				"beneficiary_address_line_2","beneficiary_address_line_4","beneficiary_dom","beneficiary_country","beneficiary_reference",
				"ship_from","ship_loading","ship_discharge","ship_to","part_ship_detl","tran_ship_detl",
				"narrative_period_presentation","narrative_shipment_period","narrative_additional_amount","standby_rule_code",
				"req_conf_party_flag","requested_confirmation_party_name","requested_confirmation_party_address_line_1",
				"requested_confirmation_party_address_line_2","requested_confirmation_party_address_line_4","requested_confirmation_party_iso_code","drawee_details_bank_name","product_type_code",
				"inco_place","amd_details"] ;
			
			var checkboxFields = ["irv_flag","ntrf_flag","renew_flag"];
			var radioButtonFields = ["cfm_inst_code_1","cfm_inst_code_2","cfm_inst_code_3","open_chrg_brn_by_code_1","open_chrg_brn_by_code_2",
									"corr_chrg_brn_by_code_1","corr_chrg_brn_by_code_2","cfm_chrg_brn_by_code_1","cfm_chrg_brn_by_code_2",
									"amd_chrg_brn_by_code_1","amd_chrg_brn_by_code_3","amd_chrg_brn_by_code_4",
									"cr_avl_by_code_1","cr_avl_by_code_2","cr_avl_by_code_3","cr_avl_by_code_4","cr_avl_by_code_5","tenor_type_1","tenor_type_2","tenor_type_3"];
			var numFieldsToCheckAgainstOrg = ["pstv_tol_pct", "neg_tol_pct", "lc_amt"];
						
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
				var org = dj.byId("org_" + id);
				var orgValue = "";
				if(org)
					{
						orgValue = dj.byId("org_" + id).get("value");
					}
				
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
				var i, msgRows = 0, itrNarr = 0, fieldSize = 0, smoothScrollTab = "narrative-details-tabcontainer", lengthValidationPassed = true, flag, is798 = m._config.customerBanksMT798Channel[issuingBankAbbvName];
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
			//return  m.validateLSAmtSumAgainstTnxAmt("lc");
		//create changes
			
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

			/*var tenorType1 = dj.byId("tenor_type_1"),
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
			}*/
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
				m._config.onSubmitErrorMsg =  m.getLocalization("invalidNumberOfRollingRenewals");
				dj.byId("rolling_renewal_nb").focus();
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
			
					
			return true;
			
		},
		
		beforeSubmit : function() {
			//m.setDraftTerm();
			m.updateSubTnxTypeCode("lc");
		}
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.trade.amend_si_swift2018_client');	