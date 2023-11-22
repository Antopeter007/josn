dojo.provide("misys.binding.bank.report_lc");

dojo.require("dojo.data.ItemFileReadStore");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.TextBox");
dojo.require("misys.widget.Dialog");
dojo.require("dijit.ProgressBar");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.CheckBox");
dojo.require("dijit.layout.ContentPane");
dojo.require("dijit.form.DateTextBox");
dojo.require("misys.form.CurrencyTextBox");
dojo.require("dijit.form.FilteringSelect");
dojo.require("dijit.layout.TabContainer");
dojo.require("misys.form.SimpleTextarea");
dojo.require("misys.widget.Collaboration");

dojo.require("misys.form.addons");
dojo.require("misys.form.common");
dojo.require("misys.form.file");
dojo.require("misys.validation.common");
dojo.require("misys.binding.trade.ls_common");
dojo.require("misys.binding.bank.report_lc_swift");
dojo.require("misys.widget.Amendments");

/**
 * <h4>Summary:</h4>
 *  JavaScript file for Letter Of Credit(Bank Side Reporting).
 *  <h4>Description:</h4>
 *  This javascript is loaded on the Bank side reporting of Letter Of Credit.
 *  It contains on form load events, before save validations, before submit validations and widget bindings for various events.
 *  
 * @class report_lc
 */
(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode
	var notAllowed="NOT ALLOWED";
	var revolvingDetails="revolving-details";
	var alternatePartyDetails="alternate-party-details";
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
    m._config.lcMandatoryFields = [];
    
    function _validateClaimAmt(){
		var lcOsAmt = dj.byId("lc_liab_amt");
		var lcAmt = dj.byId("lc_amt");
		var claimAmt = dj.byId("claim_amt");
		if(lcAmt && claimAmt)
		{
			if(claimAmt.get("value") <= 0 || claimAmt.get("value") > lcOsAmt.get("value") || claimAmt.get("value") > lcAmt.get("value"))
			{
				var callback = function() {
					var widget = dijit.byId("claim_amt");
				 	widget.focus();
				 	widget.set("state","Error");
				};
				m.dialog.show("ERROR", m.getLocalization("claimAmtGreaterThanOutstandingAmtError", [lcOsAmt.get("value").toFixed(2)]), '', function(){
					setTimeout(callback, 500);
				});
				return false;
			}
		}
		return true;		
	}
	
	function _validateClaimDate(){
		var currentDate = dj.byId("current_date");
		var expDate = dj.byId("exp_date");
		var issDate = dj.byId("iss_date");
		var claimDate = dj.byId("claim_present_date");
		if(claimDate)
		{
			if(currentDate && !m.compareDateFields(claimDate, currentDate)) 
     		{
				var callback1 = function() {
					var widget = dijit.byId("claim_present_date");
				 	widget.focus();
				 	widget.set("state","Error");
				};
				m.dialog.show("ERROR", m.getLocalization("claimDateGreaterThanCurrentDateError",[ claimDate.get("displayedValue"), currentDate.get("displayedValue") ]), '', function(){
					setTimeout(callback1, 100);
				});
				return false;
     		}
			else if(expDate && !m.compareDateFields(claimDate, expDate)) 
	    	 {
				 var callback2 = function() {
						return true;
				};
				m.dialog.show("WARNING", m.getLocalization("claimDateGreaterThanExpiryDateError",[ claimDate.get("displayedValue"), expDate.get("displayedValue") ]), '', function(){
					setTimeout(callback2, 100);
				});
	    	 }
			 else if(issDate && !m.compareDateFields(issDate, claimDate)) 
	    	 {
				 var callback3 = function() {
					 return true;
				};
				m.dialog.show("WARNING", m.getLocalization("claimDateLessThanIssueDateError",[ claimDate.get("displayedValue"), issDate.get("displayedValue") ]), '', function(){
					setTimeout(callback3, 100);
				});
	    	 }
		}
		return true;
		
	}
	function validateDecreaseAmount() 
	{	
			if(d.number.parse(dijit.byId("org_lc_amt").get("value")) < dijit.byId("dec_amt_value").get("value"))
				{
					m.showTooltip(m.getLocalization('decreaseAmountShouldBeLessThanLCAmount',[ dj.byId("dec_amt_value").get("displayedValue")]), d.byId("dec_amt_value"), [ 'after' ],5000);
					misys.dialog.show("ERROR", dj.byId("dec_amt_value").invalidMessage, "", function(){
					dj.byId("dec_amt_value").focus();
					dj.byId("dec_amt_value").set("state","Error");
				});
				return false;
				}
			if(d.number.parse(dijit.byId("dec_amt_value").get("value")) < 0 )
			{
				dj.byId("lc_amt").set("value", d.number.parse(dj.byId("org_lc_amt").value));
				m.showTooltip(m.getLocalization('valueShouldBeGreaterThanZero',[ dj.byId("dec_amt_value").get("displayedValue")]), d.byId("dec_amt_value"), [ 'after' ],5000);
				misys.dialog.show("ERROR", dj.byId("dec_amt_value").invalidMessage, "", function(){
					dj.byId("dec_amt_value").focus();
					dj.byId("dec_amt_value").set("state","Error");					
				});
				return false;
			}
			return true;
		}
	
	// Public functions & variables
	
	d.mixin(m._config, {

		/**
		 * <h4>Summary:</h4>  This method transforms the xml.
		 * <h4>Description</h4> : This method overrides the xmlTransform method to add license items in the xml.
		 * Add license items tags, only in case of LC transaction.
		 * Else pass the input xml, without modification. (Example : for create beneficiary from popup.) 
		 *
		 * @param {String} xml
		 * XML String to transform.
		 * @method xmlTransform
		 */
		xmlTransform : function (/*String*/ xml) {
			var lcXMLStart = "<lc_tnx_record>";
			/*
			 * Add license items tags, only in case of LC transaction.
			 * Else pass the input xml, without modification. (Ex : for create beneficiary from popup.)
			 */
			if(xml.indexOf(lcXMLStart) != -1){
				// Setup the root of the XML string
				var xmlRoot = m._config.xmlTagName,
				transformedXml = xmlRoot ? ["<", xmlRoot, ">"] : [],			
						lcXMLEnd   = "</lc_tnx_record>",
						subLcXML	= "",
						selectedIndex = -1;
				subLcXML = xml.substring(lcXMLStart.length,(xml.length-lcXMLEnd.length));
				var i = 0, verb, text, itr = 0;
				var nodename = "amd_no"; 
				var amdNo = xml.substring(xml.indexOf("<"+nodename+">")+("<"+nodename+">").length,xml.indexOf("</"+nodename+">"));
				var tnxTypeCode = xml.substring(xml.indexOf("<tnx_type_code>")+("<tnx_type_code>").length,xml.indexOf("</tnx_type_code>"));
				var subTnxTypeCode = xml.substring(xml.indexOf("<sub_tnx_type_code>")+("<sub_tnx_type_code>").length,xml.indexOf("</sub_tnx_type_code>"));
				var lcType = xml.substring(xml.indexOf("<lc_type>")+("<lc_type>").length,xml.indexOf("</lc_type>"));
				var prodStatCode = xml.substring(xml.indexOf("<prod_stat_code>")+("<prod_stat_code>").length,xml.indexOf("</prod_stat_code>"));
				var arrayOfNarratives = ["narrative_description_goods","narrative_documents_required","narrative_additional_instructions","narrative_special_beneficiary","narrative_special_recvbank"];
				if(m._config.swift2018Enabled && (Number(amdNo) || prodStatCode === '08' || prodStatCode === '31') && lcType !== '04'){ //swift enabled for Amendment form
					var subXML;
					var dataStoreNarrative = [m._config.narrativeDescGoodsDataStore,m._config.narrativeDocsReqDataStore,m._config.narrativeAddInstrDataStore,m._config.narrativeSpBeneDataStore,m._config.narrativeSpRecvbankDataStore];
					for(itr = 0; itr < 5; itr++){
						subXML = itr == 0 ? subLcXML.substring(0,subLcXML.indexOf("<"+arrayOfNarratives[itr]+">")) : (subXML.indexOf("<"+arrayOfNarratives[itr]+">") > 0 ? subXML.substring(0,subXML.indexOf("<"+arrayOfNarratives[itr]+">")) : subXML);
						if(subLcXML.indexOf("<"+arrayOfNarratives[itr]+">") < 0){continue;}
						if(dataStoreNarrative[itr] && dataStoreNarrative[itr].length > 0){
							i = 0;
							subXML = subXML.concat("<"+arrayOfNarratives[itr]+">");
							subXML = subXML.concat("<![CDATA[");
							subXML = subXML.concat("<amendments>");
							subXML = subXML.concat("<amendment>");
							subXML = subXML.concat("<sequence>");
							subXML = subXML.concat("");
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
							subXML = subXML.concat(subLcXML.substring(subLcXML.indexOf("</"+arrayOfNarratives[itr]+">"),subLcXML.length));
						}
						else{
							subXML = subXML.concat("<"+arrayOfNarratives[itr]+">");
							subXML = subXML.concat(subLcXML.substring(subLcXML.indexOf("</"+arrayOfNarratives[itr]+">"),subLcXML.length));
						}
						
					}
					
					transformedXml.push(subXML);
				} else if(m._config.swift2018Enabled && tnxTypeCode === '01' && subTnxTypeCode !== '04' && lcType !== '04') { //For swift enabled with issuance form
					for(itr = 0; itr < 5; itr++){
						subXML = itr == 0 ? subLcXML.substring(0,subLcXML.indexOf("<"+arrayOfNarratives[itr]+">")) : subXML.substring(0,subXML.indexOf("<"+arrayOfNarratives[itr]+">"));
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
						subXML = subXML.concat(subLcXML.substring(subLcXML.indexOf("</"+arrayOfNarratives[itr]+">"),subLcXML.length));
					}
					transformedXml.push(subXML);
				}
				else{
					transformedXml.push(subLcXML);
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
			m.setValidation("iss_date", m.validateIssueDate);
			m.setValidation("amd_date", m.validateAmendmentDate);
			m.setValidation("exp_date", m.validateBankExpiryDate);
			m.setValidation("tenor_maturity_date", m.validateMaturityDate);
			m.setValidation("pstv_tol_pct", m.validateTolerance);
			m.setValidation("neg_tol_pct", m.validateTolerance);
			m.setValidation("max_cr_desc_code", m.validateMaxCreditTerm);
			m.setValidation("earliest_ship_date", m.validateEarliestShipmentDate);
			m.setValidation("last_ship_date", m.validateLastShipmentDate);
			m.setValidation("lc_cur_code", m.validateCurrency);
			m.setValidation("latest_answer_date", m.validateLatestAnswerDate);
			m.setValidation('next_revolve_date', m.validateNextRevolveDate);
			m.setValidation("alt_applicant_country", m.validateCountry);
			m.setValidation("maturity_date", m.validateEnteredDateGreaterThanCurrentDate);
			m.setValidation("renew_for_nb", m.validateRenewFor);
			m.setValidation("advise_renewal_days_nb", m.validateDaysNotice);
			m.setValidation("rolling_renewal_nb", m.validateNumberOfRenewals);
			m.setValidation("rolling_cancellation_days", m.validateCancellationNotice);
			m.setValidation("renewal_calendar_date",m.validateRenewalCalendarDate);
			m.setValidation("renew_on_code",m.validateRenewalCalendarDate);
			m.setValidation("rolling_renew_for_nb", m.validateRollingFrequency);
			//Validate Hyphen, allowed no of lines validation on the back-office comment
			m.setValidation("bo_comment", m.bofunction);
			m.connect("renew_flag", "onClick", m.toggleRenewalDetails);	
			m.connect("ship_period", "onChange", m.validateShipPeriod);
			m.connect("courier_partner","onChange", m.validatecourierPartnerField);
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
			m.connect("renew_on_code", "onChange", function(){	
				m.toggleFields(this.get("value") === "02", null, ["renewal_calendar_date"]);	
			});
			m.connect("inco_term_year", "onChange", m.getIncoTerm);
			m.connect("inco_term", "onChange", function(){
				m.toggleFields(this.get("value"), null, ["inco_place"], false, false);
			});
			m.connect("inco_term_year", "onChange", function(){
				m.toggleFields(this.get("value"), null, ["inco_term"], false, true);
			});
			
			// CF The following validation originally passed the third variable set to 'true',
			// which means that it was not wrapped in code that calls the default validation 
			// and hence it is the responsibility of the replacement function to manage that. 
			// As it was not managed, form validation was not working correctly 
			// (try submitting the form once, canceling the submission and then doing it again, for example)
			//
			// If this produces other unexpected behavior, then consult setValidation and tweak
			// your implementation.
			
			m.connect("prod_stat_code", "onChange", m.validateOutstandingAmount);
			m.connect("prod_stat_code", "onChange", function(){
				var prodStatCodeField = dj.byId('prod_stat_code');
				var prodStatCodeValue = dj.byId("prod_stat_code").get("value");
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
			m.connect(dj.byId("prod_stat_code"), "onChange", function(){
				this.validate();
				if(m._config.swift2018Enabled){ 
					m.refreshUIforAmendment();
				}
			});	
			m.connect("irv_flag", "onClick", m.checkIrrevocableFlag);
			m.connect("ntrf_flag", "onClick", m.checkNonTransferableFlag);
			m.connect("ntrf_flag", "onClick", m.toggleTransferIndicatorFlag);
			m.connect("stnd_by_lc_flag", "onClick", m.checkStandByFlag);
			if(m._config.swift2018Enabled){ 
				
				m._bindSwift2018();
			}
			else{
				m.connect("cfm_inst_code_1", "onClick", m.resetConfirmationCharges);
				m.connect("cfm_inst_code_2", "onClick", m.resetConfirmationCharges);
				m.connect("cfm_inst_code_3", "onClick", m.resetConfirmationCharges);	
			}
			
			m.connect("lc_exp_date_type_code", "onChange", function(){	
				if(this.get("value") === "02")	
					{	
						m.toggleRequired("exp_date", false);	
						m.animate("fadeIn", d.byId("exp-event"));	
						m.toggleRequired("exp_event", true);
						dj.byId("exp_date").set("disabled", false);
						m.toggleRequired("exp_date", false);
					}	
				else if(this.get("value") === "03")	
					{	
						m.toggleRequired("exp_date", false);
						dj.byId("exp_date").set("disabled", true);
						m.animate("fadeOut", d.byId("exp-event"));	
						dj.byId("exp_event").set("value" , "");	
						m.toggleRequired("exp_event", false);	
						dj.byId("exp_date").set("value" , null);
					}
				else {
					m.toggleRequired("exp_date", true);
					dj.byId("exp_date").set("disabled", false);
					m.animate("fadeOut", d.byId("exp-event"));	
					dj.byId("exp_event").set("value" , "");	
					m.toggleRequired("exp_event", false);
					
				}
				});	
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
			m.connect("cr_avl_by_code_3", "onClick", m.setDraftTerm);
			m.connect("cr_avl_by_code_4", "onClick", m.setDraftTerm);
			m.connect("adv_send_mode", "onClick", m.setDraftTerm);
			m.connect("tenor_type_1", "onClick", m.toggleDraftTerm);
			m.connect("tenor_type_1", "onClick", m.setDraftTerm);
			m.connect("tenor_type_2", "onClick", m.toggleDraftTerm);
			m.connect("tenor_type_3", "onClick", m.toggleDraftTerm);
			
			if(!m._config.swift2018Enabled){
				m.connect("lc_amt", "onBlur", function(){
					var amendTransaction = (dj.byId("tnx_type_code") && dj.byId("tnx_type_code").get("value")==="03") || (dj.byId("prod_stat_code") && (dj.byId("prod_stat_code").get("value")==="08" || dj.byId("prod_stat_code").get("value")==="31"));
					if(amendTransaction)
					{
						var diff = dj.byId("lc_amt").getValue() - dojo.number.parse(dj.byId("org_lc_amt").getValue());
						var tnxAmt = Math.abs(diff);
						if(tnxAmt !== 0)
						{
							m.setTnxAmt(tnxAmt);
						}
					}
					else
					{
						m.setTnxAmt(this.get("value"));
					}
				});
			}
			var existingRecordsScreen = !dj.byId("tnx_stat_code") || !(dj.byId("tnx_stat_code").get("value") && (dj.byId("tnx_stat_code").get("value") === "03" || dj.byId("tnx_stat_code").get("value") === "07"));
			if(existingRecordsScreen)
			{
				m.connect("lc_amt", "onBlur", function(){
					m.validateDocumentAmtAndLCAmt();
				});
				m.connect("tnx_amt", "onBlur", function(){
					m.validateDocumentAmtAndLCAmt();
				});
				 
			}
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
			m.connect("tenor_maturity_date", "onBlur", m.setDraftTerm);
			m.connect("tenor_days_type", "onBlur", m.setDraftTerm);
			m.connect("tenor_type_details", "onBlur", m.setDraftTerm);

			m.connect("lc_cur_code", "onChange", function(){
				m.setCurrency(this, ["lc_amt"]);
				m.setCurrency(this, ["lc_available_amt", "lc_liab_amt"]);
			});
			m.connect("tenor_period", "onChange", m.setDraftTerm);
			m.connect("tenor_from_after", "onChange", m.setDraftTerm);
			m.connect("tenor_days", "onChange", m.setDraftTerm);
			m.connect("tenor_days_type", "onChange", function(){
				m.toggleFields((this.get("value") == "99"),
						null, ["tenor_type_details"]);
			});
			m.connect("drawee_details_bank_name", "onChange", m.initDraweeFields);
			m.connect("issuing_bank_abbv_name", "onChange", m.populateReferences);
			if(dj.byId("issuing_bank_abbv_name"))
			{
				m.connect("entity", "onChange", function(){
					dj.byId("issuing_bank_abbv_name").onChange();
				});
			}
			m.connect("issuing_bank_customer_reference", "onChange", m.setApplicantReference);
			m.connect("part_ship_detl_nosend", "onChange", function(){
				var partShipValue = dj.byId("part_ship_detl_nosend").value;
				dj.byId("part_ship_detl").set("value", partShipValue);
				//SWIFT 2018 changes
				if(m._config.swift2018Enabled){
					
					if(partShipValue == 'CONDITIONAL'){
						document.getElementById("infoMessagePartialShipment").style.display = "block";
						document.getElementById("infoMessagePartialShipment").style.paddingLeft = "250px";
					}
					else{
						document.getElementById("infoMessagePartialShipment").style.display = "none";
					}
				}
				
				m.toggleFields(
						partShipValue && partShipValue !== "ALLOWED" &&
							partShipValue !== notAllowed && partShipValue !== "NONE", null, ["part_ship_detl_text_nosend"]);
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
				var fieldValue = dj.byId("tran_ship_detl_nosend").value;
				dj.byId("tran_ship_detl").set("value", fieldValue);
				//SWIFT 2018 changes
				if(m._config.swift2018Enabled){
					
					if(fieldValue == 'CONDITIONAL'){
						document.getElementById("infoMessageTranshipment").style.display = "block";
						document.getElementById("infoMessageTranshipment").style.paddingLeft = "250px";
					}
					else{
						document.getElementById("infoMessageTranshipment").style.display = "none";
					}
				}
				
				m.toggleFields(
						fieldValue  && fieldValue !== "ALLOWED" && fieldValue !== notAllowed && fieldValue !== "NONE", 
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
					m.toggleRequired("lc_liab_amt",false);
					m.toggleRequired("lc_available_amt",false);
				}
			});
			
			m.connect("cr_avl_by_code_2", "onClick",  function(){
				if(dj.byId("mode") && dj.byId("mode").get("value") === 'RELEASE')
				{
					m.toggleRequired("drawee_details_bank_address_line_1",false);
				}
				});
				m.connect("cr_avl_by_code_3", "onClick",  function(){
				if(dj.byId("mode") && dj.byId("mode").get("value") === 'RELEASE')
				{
					m.toggleRequired("drawee_details_bank_address_line_1",false);
				}
				});
			
			m.connect("prod_stat_code","onChange",function(){
				// Making outstanding amount as non editable in case of Not Processed,Cancelled,Purged
				m.updateOutstandingAmount(dj.byId("lc_liab_amt"), dj.byId("org_lc_liab_amt"));
				
				var prodStatCodeValue = dj.byId("prod_stat_code").get('value'),liabAmt = dj.byId("lc_liab_amt");
				if(liabAmt && (prodStatCodeValue === '01' || prodStatCodeValue === '10' || prodStatCodeValue === '06'))
				{
					liabAmt.set("readOnly", true);
					liabAmt.set("disabled", true);
					m.toggleRequired("lc_liab_amt",false);
				}
				else if(prodStatCodeValue === "05" || prodStatCodeValue === "13" || prodStatCodeValue === "15"|| prodStatCodeValue === "14")
				{
					if(liabAmt)
					{
						liabAmt.set("readOnly", true);
						liabAmt.set("disabled", true);
						liabAmt.set("value", "");
						m.toggleRequired("lc_liab_amt",false);
					}
				}
				else if(liabAmt)
				{
					liabAmt.set("readOnly", false);
					liabAmt.set("disabled", false);
					if(!(dj.byId("mode") && dj.byId("mode").get("value") === 'RELEASE'))
					{
					m.toggleRequired("lc_liab_amt",true);	
					}
					if(prodStatCodeValue !== "07")
					{
					dj.byId("lc_liab_amt").set("value", dj.byId("org_lc_liab_amt").get('value'));
					}
				}
				if(dj.byId("tnx_type_code") && dj.byId("tnx_type_code").get('value')=='01')
				{
					if(prodStatCodeValue === '01')
					{
						liabAmt.set("value", 0);
					}
					else
					{
						liabAmt.set("value", dj.byId("lc_amt").get('value'));
					}
				}
				var availableAmt = dj.byId("lc_available_amt");
				if(availableAmt && (prodStatCodeValue === '01' || prodStatCodeValue === '10' || prodStatCodeValue === '06'))
				{
					availableAmt.set("readOnly", true);
					availableAmt.set("disabled", true);
					m.toggleRequired("lc_available_amt",false);
				}
				else if(availableAmt)
				{
					availableAmt.set("readOnly", false);
					availableAmt.set("disabled", false);
					if(!(dj.byId("mode") && dj.byId("mode").get("value") === 'RELEASE'))
					{
					m.toggleRequired("lc_available_amt",true);	
					}
				}
				if(dj.byId("doc_ref_no"))
				{
					if(prodStatCodeValue === '16' || prodStatCodeValue === '24' || prodStatCodeValue === 'A9' || prodStatCodeValue === '12')
					{
						dj.byId("doc_ref_no").set("disabled", false);
					}
					else
					{
						dj.byId("doc_ref_no").set("disabled", true);
					}
				}
				
				if(dj.byId("lc_type") && dj.byId("lc_type").get("value") === "02")
				{
					if(prodStatCodeValue === "01")
					{
						dojo.forEach(dj.byId("fakeform1").getChildren(), function(widget){
							var id = widget.id;
							if(widget.required === true)
							{
								m._config.lcMandatoryFields.push(id);
								m.toggleRequired(id, false);
							}
						});
						m._config.lcMandatoryFields.push("narrative_description_goods");
						m._config.lcMandatoryFields.push("narrative_documents_required");
						m.toggleRequired("narrative_description_goods", false);
						m.toggleRequired("narrative_documents_required", false);
						//m.toggleTransaction(false);
					}
					else if(prodStatCodeValue === "03")
					{
						for (var i in m._config.lcMandatoryFields) {
							m.toggleRequired(m._config.lcMandatoryFields[i], true);
							}
						m.toggleTransaction(true);
					}
				}
				if (m._config.enable_to_edit_customer_details_bank_side == "false" && dj.byId("prod_stat_code") && dj.byId("prod_stat_code").get('value') !== '' && dj.byId("lc_liab_amt") && dj.byId("lc_available_amt") && dj.byId("tnx_type_code") && dj.byId("tnx_type_code").get("value") !== '15' && dj.byId("tnx_type_code").get("value") !== '13')
				{
					m.toggleRequired("lc_liab_amt", false);
					m.toggleRequired("lc_available_amt", false);
					m.toggleRequired("applicable_rules", false);
				}
			});
			
			m.connect("prod_stat_code", "onChange", function(){
				m.toggleProdStatCodeFields();
				//Client wording changes
				var value = this.get("value");
				if(value === "78" || value === "79")
				{
					dj.byId("action_req_code").set("value", "07");
					dj.byId("action_req_code").set("readOnly", true);
					dj.byId("action_req_code").set("disabled", false);
				}
				else if(value =="01")
				{
					dj.byId("action_req_code").set("value", "");
					dj.byId("action_req_code").set("readOnly", true);
					dj.byId("action_req_code").set("disabled", true);
				}
				else if(value =="03")
				{
					dj.byId("action_req_code").set("value", "");
					dj.byId("action_req_code").set("readOnly", false);
					dj.byId("action_req_code").set("disabled", false);
				}
				else if(value =="A9")
				{
					m.toggleRequired("tnx_amt", true);
					m.toggleRequired("maturity_date", true);
					dj.byId("latest_answer_date").set("disabled", true);
				}
				else if(value =="26")
				{
					m.toggleRequired("tnx_amt", true);
					m.toggleRequired("maturity_date", false);
				}
				else if(value =="12" || value === "05" || value === "13" || value === "15"|| value === "14" || value === "04")
				{
					m.toggleRequired("tnx_amt", true);
				}  
				else
				{
					m.toggleRequired("tnx_amt", false);
					m.toggleRequired("maturity_date", false);
				}
			});
			// for Maturity Date
			m.connect("prod_stat_code", "onChange", function(){
				m.toggleProdStatCodeFields();
				var value = this.get("value");
				if(value === "05" || value === "13" || value === "15"|| value === "14" || value === "04")
				{
					m.toggleRequired("maturity_date", true);
				}
				
			});
			
			m.connect("prod_stat_code", "onChange", function(){
				if(this.get("value") === '12')
				{
					m.toggleRequired("bo_comment", true);
				}else{
					m.toggleRequired("bo_comment", false);
				}
			});
			
			m.connect("prod_stat_code", "onChange", function(){
				if(this.get("value") === '84' || this.get("value") === '85')
				{
					m.animate("fadeIn", d.byId("claimDetails"));
					dj.byId("claim_cur_code").set("value", dj.byId("lc_cur_code").get("value"));
					dj.byId("claim_reference").set("disabled", false);
					dj.byId("claim_present_date").set("disabled", false);
					dj.byId("claim_amt").set("disabled", false);
					dj.byId("claim_cur_code").set("disabled", false);
					if(dj.byId("prod_stat_code").get("value") === '85' && dj.byId("claim_reference_hidden") &&  dj.byId("claim_amt_hidden") && d.byId("claimPresentDate"))
					{
						m.animate("fadeOut", d.byId("claimPresentDate"));
						dj.byId("claim_reference").set("value", dj.byId("claim_reference_hidden").get("value"));
						dj.byId("claim_amt").set("value", dj.byId("claim_amt_hidden").get("value"));
					}
					else
					{
						m.animate("fadeIn", d.byId("claimPresentDate"));
						dj.byId("claim_reference").set("value", "");
						dj.byId("claim_amt").set("value", "");
					}
				}
				else if(dj.byId("claim_reference") && dj.byId("claim_present_date") && dj.byId("claim_amt"))
				{
					m.animate("fadeOut", d.byId("claimDetails"));
					dj.byId("claim_reference").set("disabled", true);
					dj.byId("claim_present_date").set("disabled", true);
					dj.byId("claim_amt").set("disabled", true);
					dj.byId("claim_cur_code").set("disabled", true);
					dj.byId("claim_reference").set("value", "");
					dj.byId("claim_present_date").set("value", null);
					dj.byId("claim_amt").set("value", "");
					dj.byId("claim_cur_code").set("value", "");
				}
				
				var tnxAmtField = dj.byId("tnx_amt");
				if(tnxAmtField)
				{
					m.validateDocumentAmtAndCalcLiabAmt();
				}
								
			});
			m.connect("facility_id", "onChange", m.getLimitDetails);
			m.connect("limit_id", "onChange", m.setLimitFieldsValue);
			// Optional EUCP flag 
			m.connect("eucp_flag", "onClick", function(){
				m.toggleFields(
						this.get("checked"), 
						null,
						["eucp_details"]);
			});
			
			m.connect("credit_available_with_bank_name", "onChange", function(){
				m.toggleFields( 
						!((d.string.trim(this.value)).toLowerCase() === m.getLocalization("xslCrAnyBank") || 
						(d.string.trim(this.value)).toLowerCase() === m.getLocalization("xslCrAdvisingBank") || 
						(d.string.trim(this.value)).toLowerCase() === m.getLocalization("xslCrIssuingBank")), 
						null, null, false, false);
				if((d.string.trim(this.value)).toLowerCase() === m.getLocalization("xslCrAnyBank"))
				{
					dj.byId("credit_available_with_bank_type").set('value', "Any Bank");
				}
				else if((d.string.trim(this.value)).toLowerCase() === m.getLocalization("xslCrAdvisingBank"))
				{
					dj.byId("credit_available_with_bank_type").set('value', "Advising Bank");
				}
				else if((d.string.trim(this.value)).toLowerCase() === m.getLocalization("xslCrIssuingBank"))
				{
					dj.byId("credit_available_with_bank_type").set('value', "Issuing Bank");
				}
				
			});
			
			m.connect("tnx_amt", "onChange", function(){
				m.validateDocumentAmtAndCalcLiabAmt();
			});
			
			m.connect("transport_mode_nosend", "onChange", function(){
				var transModeValue = this.get("value");
				dj.byId("transport_mode").set("value", transModeValue);
				m.toggleFields(transModeValue && transModeValue !== "AIRT" && transModeValue !== "SEAT" && transModeValue !== "RAIL" && transModeValue !== "ROAD" && transModeValue !== "MULT", 
						null, ["transport_mode_text_nosend"], false, false);
				
			});
			m.connect("transport_mode_text_nosend", "onBlur", function(){
				dj.byId("transport_mode").set("value", this.get("value"));
			});
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
					dj.byId("next_revolve_date").set("displayedValue","");
					dj.byId("notice_days").set("value","");
					dj.byId("charge_upto").set("value","");
				}
			});
			m.connect("stnd_by_lc_flag", "onChange", function(){	
				if(dj.byId("stnd_by_lc_flag"))	
				{	
					if(dj.byId("stnd_by_lc_flag").get("checked")) 	
					{	
						m.animate("fadeIn", d.byId("expiryType"));	
						m.animate("fadeIn", d.byId("deliveryInstructions"));	
						m.animate("fadeIn", d.byId("renewalDetails"));	
						m.animate("fadeIn", d.byId("governingLawDetails"));	
						if(dj.byId("lc_exp_date_type_code")){
							m.toggleRequired("lc_exp_date_type_code", true);	
							}
						if(dj.byId("delv_org")){
							m.toggleRequired("delv_org", true);	
						}
					}	
					else 	
					{	
						m.animate("fadeOut", d.byId("expiryType"));	
						m.animate("fadeOut", d.byId("deliveryInstructions"));	
						m.animate("fadeOut", d.byId("renewalDetails"));	
						m.animate("fadeOut", d.byId("governingLawDetails"));
						if(dj.byId("lc_exp_date_type_code")){
						dj.byId("lc_exp_date_type_code").set("value","");
						m.toggleRequired("lc_exp_date_type_code", false);	
						}
						if(dj.byId("delv_org")){
						dj.byId("delv_org").set("value","");
						m.toggleRequired("delv_org", false);	
						}
						if(dj.byId("delv_org_text")){
						dj.byId("delv_org_text").set("value","");
						}
						if(dj.byId("delivery_to")){
						dj.byId("delivery_to").set("value","");	
						}
						if(dj.byId("narrative_delivery_to")){
						dj.byId("narrative_delivery_to").set("value","");
						}	
						if(dj.byId("renew_flag"))
						{
						dj.byId("renew_flag").set("checked", false);	
						d.hitch(dj.byId("renew_flag"), m.toggleRenewalDetails, true)();	
						m.connect("renew_flag", "onClick", m.toggleRenewalDetails);	
						}
						if(dj.byId("lc_govern_country")){
						dj.byId("lc_govern_country").set("value","");	
						}
						if(dj.byId("lc_govern_text")){
						dj.byId("lc_govern_text").set("value","");
						}	
					}	
				}	
				});
			m.connect("for_account_flag", "onChange", function(){
				if(this.get("checked")) 
				{
					m.animate("fadeIn", d.byId(alternatePartyDetails));
				}
				else 
				{
					m.animate("fadeOut", d.byId(alternatePartyDetails));
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

			m.setValidation("claim_cur_code", m.validateCurrency);
			m.setValidation("claim_reference",m.validateSwiftAddressCharacters);
			
			m.connect("claim_amt", "onBlur", _validateClaimAmt);
			m.connect("claim_present_date", "onBlur", _validateClaimDate);
			m.connect("claim_reference", "onBlur", m.checkClaimReferenceExists);
			
			m.connect("applicable_rules", "onChange", function(){
				m.toggleFields((this.get("value") == "99"), null, ["applicable_rules_text"]);
			});
			
			m.connect("adv_send_mode", "onChange", function(){
				m.toggleFields((this.get("value") == "99"), null, ["adv_send_mode_text"]);
			});
			
			m.connect("lc_available_amt", "onBlur", function(){
				if(dj.byId("lc_amt") && (dj.byId("lc_amt").get("value") < dj.byId("lc_available_amt").get("value")))
				{
					var callback = function() {
						var widget = dijit.byId("lc_available_amt");
						widget.focus();
					 	widget.set("state","Error");
					};
					m.dialog.show("ERROR", m.getLocalization("AvailLCamtcanNotMoreThanTranAmt"), '', function(){
							setTimeout(callback, 500);
						});
				}
			});
			m.connect("applicant_address_line_4", "onFocus", function(){
				m.showTooltip(m.getLocalization('addressLine4ToolTip', 
						[dj.byId("applicant_address_line_4").get("displayedValue"), dj.byId("applicant_address_line_4").get("value") ]), d.byId("applicant_address_line_4"), [ 'after' ],5000);
			});
			m.connect("beneficiary_address_line_4", "onFocus", function(){
				m.showTooltip(m.getLocalization('addressLine4ToolTip', 
						[dj.byId("beneficiary_address_line_4").get("displayedValue"), dj.byId("beneficiary_address_line_4").get("value") ]), d.byId("beneficiary_address_line_4"), [ 'after' ],5000);
			});
			m.connect("credit_available_with_bank_address_line_4", "onFocus", function(){
				m.showTooltip(m.getLocalization('addressLine4ToolTip', 
						[dj.byId("credit_available_with_bank_address_line_4").get("displayedValue"), dj.byId("credit_available_with_bank_address_line_4").get("value") ]), d.byId("credit_available_with_bank_address_line_4"), [ 'after' ],5000);
			});
			m.connect("advising_bank_address_line_4", "onFocus", function(){
				m.showTooltip(m.getLocalization('addressLine4ToolTip', 
						[dj.byId("advising_bank_address_line_4").get("displayedValue"), dj.byId("advising_bank_address_line_4").get("value") ]), d.byId("advising_bank_address_line_4"), [ 'after' ],5000);
			});
			m.connect("advise_thru_bank_address_line_4", "onFocus", function(){
				m.showTooltip(m.getLocalization('addressLine4ToolTip', 
						[dj.byId("advise_thru_bank_address_line_4").get("displayedValue"), dj.byId("advise_thru_bank_address_line_4").get("value") ]), d.byId("advise_thru_bank_address_line_4"), [ 'after' ],5000);
			});
			m.connect("requested_confirmation_party_address_line_4", "onFocus", function(){
				m.showTooltip(m.getLocalization('addressLine4ToolTip', 
						[dj.byId("requested_confirmation_party_address_line_4").get("displayedValue"), dj.byId("requested_confirmation_party_address_line_4").get("value") ]), d.byId("requested_confirmation_party_address_line_4"), [ 'after' ],5000);
			});
			m.connect("drawee_details_bank_address_line_4", "onFocus", function(){
				m.showTooltip(m.getLocalization('addressLine4ToolTip', 
						[dj.byId("drawee_details_bank_address_line_4").get("displayedValue"), dj.byId("drawee_details_bank_address_line_4").get("value") ]), d.byId("drawee_details_bank_address_line_4"), [ 'after' ],5000);
			});
			m.connect("inc_amt_value", "onBlur", m.amendTransactionBank);
			m.connect("dec_amt_value", "onBlur", m.amendTransactionBank);
			m.connect("inc_amt_value", "onBlur", function(){
				m.validateAmendAmount(true, this, "lc");
				if(!isNaN(dj.byId("inc_amt_value").value) && d.number.parse(dijit.byId("inc_amt_value").get("value")) > 0 )
					{
						dj.byId("lc_amt").set("value", d.number.parse(dj.byId("org_lc_amt").value) + d.number.parse(dj.byId("inc_amt_value").value));
						dj.byId("inc_amt_value").set("disabled", false);
						dj.byId("dec_amt_value").set("disabled", true);
						dj.byId("dec_amt_value").set('value',"");
					}
				else if(d.number.parse(dijit.byId("inc_amt_value").get("value")) < 0 )
					{
						dj.byId("lc_amt").set("value", d.number.parse(dj.byId("org_lc_amt").value));	
						m.showTooltip(m.getLocalization('valueShouldBeGreaterThanZero',[ dj.byId("inc_amt_value").get("displayedValue")]), d.byId("inc_amt_vlue"), [ 'after' ],5000);
						misys.dialog.show("ERROR", dj.byId("inc_amt_value").invalidMessage, "", function(){
							dj.byId("inc_amt_value").focus();
							dj.byId("inc_amt_value").set("state","Error");
						});
						return false;
					}
				return true;
			});
			m.connect("dec_amt_value", "onBlur", function(){
				validateDecreaseAmount();
				m.validateAmendAmount(true, this, "lc");
				if(!isNaN(dj.byId("dec_amt_value").value))
				{
					if(d.number.parse(dj.byId("org_lc_amt").value) < d.number.parse(dj.byId("dec_amt_value").value))
							{
								m.showTooltip(m.getLocalization('decreaseAmountShouldBeLessThanLCAmount',[ dj.byId("dec_amt_value").get("displayedValue")]), d.byId("dec_amt_value"), [ 'after' ],5000);
								misys.dialog.show("ERROR", dj.byId("dec_amt_value").invalidMessage, "", function(){
									dj.byId("dec_amt_value").focus();
									dj.byId("dec_amt_value").set("state","Error");
								});
								return false;
							}
					else if(d.number.parse(dijit.byId("dec_amt_value").get("value")) < 0 )
							{
								dj.byId("lc_amt").set("value", d.number.parse(dj.byId("org_lc_amt").value));
								m.showTooltip(m.getLocalization('valueShouldBeGreaterThanZero',[ dj.byId("dec_amt_value").get("displayedValue")]), d.byId("dec_amt_value"), [ 'after' ],5000);
								misys.dialog.show("ERROR", dj.byId("dec_amt_value").invalidMessage, "", function(){
									dj.byId("dec_amt_value").focus();
									dj.byId("dec_amt_value").set("state","Error");
								});
								return false;
							}
					else if(d.number.parse(dj.byId("dec_amt_value").value) > 0)
						{
							dj.byId("lc_amt").set("value", d.number.parse(dj.byId("org_lc_amt").value) - d.number.parse(dj.byId("dec_amt_value").value));
							dj.byId("dec_amt_value").set("disabled", false);
							dj.byId("inc_amt_value").set("disabled", true);
							dj.byId("inc_amt_value").set('value',"");
						}
				}
				return true;
			});
			m.connect("lc_amt", "onBlur", function(){				
				var oriLcAmt = d.number.parse(dj.byId("org_lc_amt_value").value),
					newLcAmt = d.number.parse(dj.byId("lc_amt").value);
			if(!isNaN(newLcAmt))
			{	
				if(oriLcAmt > newLcAmt)
					{
						dj.byId("dec_amt_value").set('value',oriLcAmt - newLcAmt);
						dj.byId("dec_amt_value").set("disabled", false);
						dj.byId("inc_amt_value").set("disabled", true);
						dj.byId("inc_amt_value").set("value", "");
					}
				if(oriLcAmt < newLcAmt)
					{
						dj.byId("inc_amt_value").set('value', newLcAmt - oriLcAmt);
						dj.byId("inc_amt_value").set("disabled", false);
						dj.byId("dec_amt_value").set("disabled", true);
						dj.byId("dec_amt_value").set("value", "");
					}
				if(oriLcAmt === newLcAmt)
				{
					dj.byId("inc_amt_value").set("value", "");
					dj.byId("inc_amt_value").set("disabled", false);
					dj.byId("dec_amt_value").set("value", "");
					dj.byId("dec_amt_value").set("disabled", false);					
				}
			}
				if(d.number.parse(dj.byId("lc_amt").value) <= 0)
				{
					m.showTooltip(m.getLocalization('valueShouldBeGreaterThanZero',[ dj.byId("lc_amt").get("displayedValue")]), d.byId("lc_amt"), [ 'after' ],5000);
					misys.dialog.show("ERROR", dj.byId("lc_amt").invalidMessage, "", function(){
						dj.byId("dec_amt_value").set("value", "");
						dj.byId("inc_amt_value").set("value", "");
						dj.byId("dec_amt_value").set("disabled", false);
						dj.byId("inc_amt_value").set("disabled", false);
						dj.byId("lc_amt").set("state","Error");
					});
					return false;
				}
				if(isNaN(d.number.parse(dj.byId("lc_amt").value)))
				{
					dj.byId("dec_amt_value").set("value", "");
					dj.byId("inc_amt_value").set("value", "");
					dj.byId("dec_amt_value").set("disabled", false);
					dj.byId("inc_amt_value").set("disabled", false);
					dj.byId("lc_amt").set("state","Error");
					return false;
				}
				return true;
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
				m.toggleFields(this.get("checked"), null, [	
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
				m.toggleFields(this.get("checked"), null, [	
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
			m.connect("maturity_date", "onBlur", m.validateMaturityDateInMO);
		}, 
		
		/**
		 * <h4>Summary:</h4>  This method validates the maturity date with the current date.
		 * <h4>Description</h4> : This method validates the maturity date with the current date.
		 * Validation - The maturity date should be greater than the current date else an error will be thrown.
		 *
		 * @method validateEnteredDateGreaterThanCurrentDate
		 */
		validateEnteredDateGreaterThanCurrentDate : function() {
						
			if(!m._config.isBank || (m._config.isBank && dj.byId("prod_stat_code") && dj.byId("prod_stat_code").get("value") === '03' || dj.byId("prod_stat_code").get("value") === '08'))
			{
				var maturityDate = dj.byId("maturity_date");
				var currentDate = new Date();
													
				var maturityDateValue = new Date(maturityDate);
				var currentDateValue = new Date();
				currentDateValue.setTime(currentDateValue.getTime() - (1000*3600*24));
				
				if(d.date.compare(maturityDateValue, currentDateValue) < 0)
				{					
					console.debug("[misys.binding.trade.message_bg] Result of comparison = ", m.getLocalization("lessthanCurrentDate"));					
					m.dialog.show("ERROR", m.getLocalization("lessthanCurrentDate"));					
					maturityDate.set("value", " ");
					return false;
				}	
			}
			
			return true;												
		},
		
		
		
		/**
		 * <h4>Summary:</h4>  This method validates that Document Amount is greater than 0 and lesser than equal lc_amt. If Document amount is valid, then liab amount is calculated as (original outstanding amt - Document amt).
		 * <h4>Description</h4> : This method validates that Document Amount is greater than 0 and lesser than equal lc_amt. If Document amount is valid, then liab amount is calculated as (original outstanding amt - Document amt)
		 *
		 * @method validateDocumentAmtAndCalcLiabAmt
		 */
		validateDocumentAmtAndCalcLiabAmt : function() {
			var orgLcLiabAmt = dj.byId("org_lc_liab_amt").get("value");
			var tnxAmtField = dj.byId("tnx_amt");
			var tnxAmt = tnxAmtField.get("value");
			var valid = true;
			var displayMessage;
			if(!m.validateAmount((tnxAmtField)?tnxAmtField:0))
			{
				displayMessage = m.getLocalization("amountcannotzero");
				tnxAmtField.set("state","Error");
		 		dj.hideTooltip(tnxAmtField.domNode);
		 		dj.showTooltip(displayMessage, tnxAmtField.domNode, 100);
		 		tnxAmtField.invalidMessage = displayMessage;
		 		valid =  false;
			}
			var convertedAmt;
			if (d.isString(orgLcLiabAmt))
			{
				convertedAmt = d.number.parse(orgLcLiabAmt);
			}
			
			if(valid && (dj.byId("prod_stat_code").get("value")==="05" || dj.byId("prod_stat_code").get("value")==="15" || dj.byId("prod_stat_code").get("value")==="14" || dj.byId("prod_stat_code").get("value")==="13") && tnxAmt > convertedAmt)
			{
				console.debug("Document amount is greater than the Original LC Liab amount.");
				displayMessage = m.getLocalization("documentAmtGreaterThanLCAmt",[ dj.byId("lc_cur_code").getValue(), tnxAmt, orgLcLiabAmt ]);
				tnxAmtField.set("state","Error");
		 		dj.hideTooltip(tnxAmtField.domNode);
		 		dj.showTooltip(displayMessage, tnxAmtField.domNode, 100);
		 		tnxAmtField.invalidMessage = displayMessage;
		 		valid =  false;
			}
			if(valid)
			{
				m.updateOutstandingAmount(dj.byId("lc_liab_amt"), dj.byId("org_lc_liab_amt"));
			}
			return valid;
		},
		
		/**
		 * <h4>Summary:</h4>  This method sets the changes on the page on form load.
		 * <h4>Description</h4> : This method is called on form load.
		 * If user wants any changes in the property of a widget on form load, that change can be added in this method. 
		 *
		 * @method onFormLoad
		 */
		onFormLoad : function(){
			if(document.getElementById("amd_no")) {                                       
		         m._config.amendmentNumber = document.getElementById("amd_no").value;  
			}
			
			m._config.lcCurCode = dj.byId("lc_cur_code").get("value");
			m._config.beneficiary.name = dj.byId("beneficiary_name")? dj.byId("beneficiary_name").get("value"):"";
			m._config.beneficiary.addressLine1 =dj.byId("beneficiary_address_line_1")? dj.byId("beneficiary_address_line_1").get("value") : "";
			m._config.beneficiary.addressLine2 = dj.byId("beneficiary_address_line_2")?dj.byId("beneficiary_address_line_2").get("value"):"";
			m._config.beneficiary.dom = dj.byId("beneficiary_dom")?dj.byId("beneficiary_dom").get("value"):"";
			m._config.applicant.entity = dj.byId("entity") ? dj.byId("entity").get("value") : "";
			m._config.applicant.name = dj.byId("applicant_name")?dj.byId("applicant_name").get("value"):"";
			m._config.applicant.addressLine1 = dj.byId("applicant_address_line_1")?dj.byId("applicant_address_line_1").get("value"):"";
			m._config.applicant.addressLine2 = dj.byId("applicant_address_line_2")?dj.byId("applicant_address_line_2").get("value"): "";
			m._config.applicant.dom = dj.byId("applicant_dom")? dj.byId("applicant_dom").get("value") : "";
			m._config.expDate = dj.byId("exp_date")? dj.byId("exp_date").get("displayedValue") : "";
			m._config.lastShipDate = dj.byId("last_ship_date") ? dj.byId("last_ship_date").get("displayedValue") : "";
			if (m._config.shipment_period_standard === false) {
				m._config.earliestShipDate = dj.byId("earliest_ship_date") ? dj.byId("earliest_ship_date").get("displayedValue") : "";
				m._config.shipPeriod = dj.byId("ship_period") ? dj.byId("ship_period").get("displayedValue") : "";
				m._config.shipName = dj.byId("ship_name") ? dj.byId("ship_name").get("displayedValue") : "";
				if (dj.byId("narrative_shipment_period")) {
					m._config.narrativeShipPeriod = dj.byId("narrative_shipment_period").get("displayedValue") ? dj.byId("narrative_shipment_period").get("displayedValue") : "";
				}
			
					
				//}
			}
			
			if(dj.byId("mode") && dj.byId("mode").get("value") === 'RELEASE')
			{					
				m.toggleRequired("iss_date",false);
				m.toggleRequired("lc_liab_amt",false);
				m.toggleRequired("lc_available_amt",false);
			}
			
			m.toggleRequired("credit_available_with_bank_address_line_1", false);
			
			//_formLoadSwift2018 function executes only for SWIFT 2018 Switch ON
			//Switch ON is controlled by swift.version key in portal.properties
			if(m._config.swift2018Enabled){
				m._formLoadSwift2018();
			}
			
			m.setCurrency(dj.byId("lc_cur_code"), ["tnx_amt", "lc_amt"]);
			m.setCurrency(dj.byId("lc_cur_code"), ["lc_available_amt","lc_liab_amt"]);
			m.setCurrency(dj.byId("lc_cur_code"), ["org_lc_amt_value","inc_amt_value","dec_amt_value"]);
			if(dj.byId("inc_amt") && dj.byId("inc_amt_value") && dj.byId("dec_amt_value"))
				{
				if(dj.byId("inc_amt").get("value"))
					{
						dj.byId("inc_amt_value").set("value", dj.byId("inc_amt").get("value"));
						dj.byId("dec_amt_value").set("disabled", true);
					}
				}
			if(dj.byId("dec_amt") && dj.byId("inc_amt_value") && dj.byId("dec_amt_value"))
			{
				if(dj.byId("dec_amt").get("value"))
				{
					dj.byId("dec_amt_value").set("value", dj.byId("dec_amt").get("value"));
					dj.byId("inc_amt_value").set("disabled", true);
				}
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
				m.toggleFields(
				   shipDetlValue && shipDetlValue !== "ALLOWED" && shipDetlValue !== notAllowed && shipDetlValue !== "NONE", 
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
				m.toggleFields(
						fieldValue && fieldValue !== "ALLOWED" && fieldValue !== notAllowed && fieldValue !== "NONE", 
						null,
						["tran_ship_detl_text_nosend"]);
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
			
			// Next, choose which of the activated buttons to select based on the 
			// values of one of the date fields
			/*
			var tenorType2 = dj.byId("tenor_type_2");
			if(tenorType2)
			{
				var tenorType3 = dj.byId("tenor_type_3");
				if(!tenorType2.get("disabled") && !tenorType3.get("disabled"))
				{
					if(dj.byId("tenor_maturity_date").get("value"))
					{
						tenorType2.set("checked", true);
						tenorType2.onClick(tenorType2.get("value"));
					} else {
						tenorType3.set("checked", true);
						tenorType3.onClick(tenorType3.get("value"));
					}
				}
			}
			*/
			
			// Set "toggle renew details" fields	
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
						null,	
						["rolling_renewal_nb", "rolling_cancellation_days", "rolling_renew_on_code"], true);	
					
				if(d.byId("advise_renewal_days_nb") && d.byId("advise_renewal_days_nb").value==""){	
					dj.byId("advise_renewal_flag").set("checked",false);	
				}	
				var rollingRenewOnCode = dj.byId("rolling_renew_on_code");	
				if(rollingRenewOnCode) {	
					m.toggleFields(rollingRenewOnCode.get("value") === "03",	
							["rolling_day_in_month"], ["rolling_renew_for_nb"], true);	
				}	
			}
			
			var eucpFlag = dj.byId("eucp_flag");
			if(eucpFlag)
			{
				m.toggleFields(eucpFlag.get("checked"), null, ["eucp_details"]);
			}

			var crAvlByCode1Checked = dj.byId("cr_avl_by_code_1").get("checked"),
				crAvlByCode2Checked = dj.byId("cr_avl_by_code_2").get("checked"),
		    	crAvlByCode3Checked = dj.byId("cr_avl_by_code_3").get("checked"),
		    	crAvlByCode5Checked = dj.byId("cr_avl_by_code_5").get("checked");
			if(!crAvlByCode1Checked && !crAvlByCode2Checked && !crAvlByCode3Checked && !crAvlByCode5Checked){
				m.setDraftTerm();
			}
			
			var issuingBankAbbvName = dj.byId("issuing_bank_abbv_name");
			if(issuingBankAbbvName)
			{
				issuingBankAbbvName.onChange();
			}
			
			var draweeDetailsBankName = dj.byId("drawee_details_bank_name");
			if(draweeDetailsBankName)
			{
				draweeDetailsBankName.onChange();
				m.setDraweeDetailBankName();
			}
			if(dj.byId("prod_stat_code").get("value") === "01")
			{
				m.toggleFields(	false, 
							["action_req_code"],
						["iss_date", "bo_ref_id"]);
				dojo.forEach(dj.byId("fakeform1").getChildren(), function(widget){
					var id = widget.id;
					if(widget.required === true)
					{
						m._config.lcMandatoryFields.push(id);
						m.toggleRequired(id, false);
					}
				});
				m._config.lcMandatoryFields.push("narrative_description_goods");
				m._config.lcMandatoryFields.push("narrative_documents_required");
				m.toggleRequired("narrative_description_goods", false);
				m.toggleRequired("narrative_documents_required", false);
				//Inconsistent behaviour with other products
				//m.toggleTransaction(false);
			}
						
			if(dj.byId("facility_id"))
			{
				m._config.isLoading = true;
				dj.byId("facility_id").onChange();
				m.connect("limit_id", "onChange", m.validateLimitBookingAmount);
				m.connect("booking_amt", "onBlur",m.validateLimitBookingAmount);
			}
			if(dj.byId("facility_mandatory") && dj.byId("facility_mandatory").get("value") === "true")
			{
				m.toggleRequired("facility_id", true);
			}
			if (dj.byId("latest_answer_date")){
				m.toggleProdStatCodeFields();
				if(dj.byId("prod_stat_code").get("value") === "A9")
				{
					dj.byId("latest_answer_date").set("disabled", true);
				}
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
			var prodStatCode = dj.byId("prod_stat_code"),liabAmt = dj.byId("lc_liab_amt") ;
			if(liabAmt && prodStatCode && (prodStatCode.get("value") === "01" || prodStatCode.get("value") === "10" || prodStatCode.get("value") === "06"))
				{
					liabAmt.set("readOnly", true);
					liabAmt.set("disabled", true);
				}
			else if(liabAmt)
				{
					liabAmt.set("readOnly", false);
					liabAmt.set("disabled", false);
				}
			
			var availableAmt = dj.byId("lc_available_amt");
			if(availableAmt && prodStatCode && (prodStatCode.get("value") === "01" || prodStatCode.get("value") === "10" || prodStatCode.get("value") === "06"))
			{
				availableAmt.set("readOnly", true);
				availableAmt.set("disabled", true);
			}			
			else if(availableAmt){
				availableAmt.set("readOnly", false);
				availableAmt.set("disabled", false);
			}
			var prodStatCodeValue = dj.byId("prod_stat_code");
			if(dj.byId("doc_ref_no"))
			{
				if(prodStatCode && (prodStatCode.get("value")=== "16" || prodStatCode.get("value") === "24" || prodStatCode.get("value") === "A9"))
				{
					dj.byId("doc_ref_no").set("disabled", false);
				}
				else
				{
					dj.byId("doc_ref_no").set("disabled", true);
				}
				// removing the document reference number
				if(dj.byId("option") && dj.byId("option").get("value") === "EXISTING" && dj.byId("doc_ref_no").get("value") !== "" && dj.byId("doc_ref_no").get("disabled"))
				{
					dj.byId("doc_ref_no").set("value", "");
				}
			}
			if(dj.byId("mode") && dj.byId("mode").get("value") !== "DRAFT" && dj.byId("action_req_code"))
			{
				dijit.byId("action_req_code").set("value","");
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
	
						var transactionids = [ "stnd_by_lc_flag", "transport_mode_nosend",
								"transport_mode_text_nosend", "cfm_chrg_brn_by_code_2",
								"cfm_chrg_brn_by_code_1", "open_chrg_brn_by_code_1",
								"open_chrg_brn_by_code_2", "corr_chrg_brn_by_code_1",
								"corr_chrg_brn_by_code_2", "max_cr_desc_code",
								"neg_tol_pct", "pstv_tol_pct", "lc_liab_amt", "lc_amt_img",
								"lc_amt", "lc_cur_code", "cfm_inst_code_3",
								"cfm_inst_code_2", "cfm_inst_code_1", "ntrf_flag",
								"irv_flag", "max_expiry_date", "expiry_place", "exp_date",
								"exp_date_type_code", "entity", "applicant_name",
								"applicant_address_line_1", "applicant_address_line_2",
								"applicant_dom", "applicant_country", "applicant_reference",
								"applicant_contact_number", "applicant_email",
								"alt_applicant_name", "drawee_details_bank_dom",
								"issuing_bank_reference", "tenor_days", "tenor_period",
								"tenor_from_after", "beneficiary_name",
								"beneficiary_address_line_1", "tenor_days_type",
								"drawee_details_bank_name",
								"drawee_details_bank_address_line_1",
								"beneficiary_address_line_2", "beneficiary_dom",
								"beneficiary_country", "beneficiary_reference",
								"beneficiary_contact_number", "beneficiary_email",
								"issuing_bank_type_code",
								"drawee_details_bank_address_line_2", "issuing_bank_name",
								"issuing_bank_address_line_1",
								"issuing_bank_address_line_2",
								"narrative_additional_instructions", "advising_bank_name",
								"advising_bank_address_line_1",
								"advising_bank_address_line_2", "advising_bank_dom",
								"advising_bank_iso_code", "advise_thru_bank_iso_code",
								"advise_thru_bank_reference", "advising_bank_reference",
								"narrative_additional_amount",
								"narrative_payment_instructions",
								"narrative_sender_to_receiver", "narrative_charges",
								"narrative_period_presentation",
								"narrative_shipment_period", "tenor_type_3",
								"narrative_description_goods",
								"narrative_documents_required", "advise_thru_bank_name",
								"advise_thru_bank_address_line_1",
								"advise_thru_bank_address_line_2", "advise_thru_bank_dom",
								"inco_place", "inco_term", "last_ship_date", "ship_name", "ship_period",
								"earliest_ship_date", "template_id", "mlt_ship_detl",
								"tran_ship_detl_text_nosend", "tran_ship_detl_nosend",
								"part_ship_detl_text_nosend", "purchase_order",
								"part_ship_detl_nosend", "ship_to", "ship_discharge",
								"ship_loading", "ship_from", "draft_term_free_format_text",
								"tenor_type_details", "tenor_days_type", "tenor_type_99",
								"tenor_days", "tenor_period", "tenor_from_after",
								"tenor_type_2", "tenor_maturity_date", "tenor_type_1",
								"cr_avl_by_code_6", "cr_avl_by_code_5", "draft_term",
								"cr_avl_by_code_4", "cr_avl_by_code_3", "cr_avl_by_code_2",
								"cr_avl_by_code_1", "carrier_detl",
								"credit_available_with_bank_name",
								"credit_available_with_bank_address_line_1",
								"credit_available_with_bank_address_line_2",
								"credit_available_with_bank_dom", "lc_available_amt",
								"applicable_rules"];
	
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
			if(dj.byId("stnd_by_lc_flag"))	
			{	
				if(dj.byId("stnd_by_lc_flag").get("checked")) 	
				{	
					m.animate("fadeIn", d.byId("expiryType"));	
					m.animate("fadeIn", d.byId("deliveryInstructions"));	
					m.animate("fadeIn", d.byId("renewalDetails"));	
					m.animate("fadeIn", d.byId("governingLawDetails"));	
					if(dj.byId("lc_exp_date_type_code")){
						m.toggleRequired("lc_exp_date_type_code", true);	
						}
					if(dj.byId("delv_org")){
						m.toggleRequired("delv_org", true);	
					}
				}	
				else 	
				{	
					m.animate("fadeOut", d.byId("expiryType"));	
					m.animate("fadeOut", d.byId("deliveryInstructions"));	
					m.animate("fadeOut", d.byId("renewalDetails"));	
					m.animate("fadeOut", d.byId("governingLawDetails"));
					if(dj.byId("lc_exp_date_type_code")){
					dj.byId("lc_exp_date_type_code").set("value","");
					m.toggleRequired("lc_exp_date_type_code", false);	
					}
					if(dj.byId("delv_org")){
					dj.byId("delv_org").set("value","");
					m.toggleRequired("delv_org", false);	
					}
					if(dj.byId("delv_org_text")){
					dj.byId("delv_org_text").set("value","");
					}
					if(dj.byId("delivery_to")){
					dj.byId("delivery_to").set("value","");	
					}
					if(dj.byId("narrative_delivery_to")){
					dj.byId("narrative_delivery_to").set("value","");
					}	
					if(dj.byId("renew_flag"))
					{
					dj.byId("renew_flag").set("checked", false);	
					d.hitch(dj.byId("renew_flag"), m.toggleRenewalDetails, true)();	
					m.connect("renew_flag", "onClick", m.toggleRenewalDetails);	
					}
					if(dj.byId("lc_govern_country")){
					dj.byId("lc_govern_country").set("value","");	
					}
					if(dj.byId("lc_govern_text")){
					dj.byId("lc_govern_text").set("value","");
					}
				}	
			}
			m.connect("lc_exp_date_type_code", "onChange", function(){	
			if(this.get("value") === "02")	
				{	
					m.toggleRequired("exp_date", false);	
					m.animate("fadeIn", d.byId("exp-event"));	
					m.toggleRequired("exp_event", true);
					dj.byId("exp_date").set("disabled", false);
					m.toggleRequired("exp_date", false);
				}	
			else if(this.get("value") === "03")	
				{	
					dj.byId("exp_date").set("disabled", true);
					m.toggleRequired("exp_date", false);
					dj.byId("exp_date").set("value" , null);
					m.animate("fadeOut", d.byId("exp-event"));	
					dj.byId("exp_event").set("value" , "");	
					m.toggleRequired("exp_event", false);	
				}
			else {
				m.toggleRequired("exp_date", true);
				dj.byId("exp_date").set("disabled", false);
				m.animate("fadeOut", d.byId("exp-event"));	
				dj.byId("exp_event").set("value" , "");	
				m.toggleRequired("exp_event", false);
				
			}
			});	
			m.connect("delv_org", "onChange", function(){	
				m.toggleFields((this.get("value") === "99"), null, ["delv_org_text"]);	
			});
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
					dj.byId("next_revolve_date").set("displayedValue","");
					dj.byId("notice_days").set("value","");
					dj.byId("charge_upto").set("value","");
				}
			}
			
			if(dj.byId("for_account_flag"))
			{
				if(dj.byId("for_account_flag").get("checked")) 
				
				{
					m.animate("fadeIn", d.byId(alternatePartyDetails));
				}
				else 
				{
					m.animate("fadeOut", d.byId(alternatePartyDetails));
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
			if(prodStatCodeValue.get("value") === "79" || prodStatCodeValue.get("value") === "78") 
			{
				dj.byId("action_req_code").set("value", "07");
				dj.byId("action_req_code").set("readOnly", true);
			}
			else if(prodStatCodeValue.get("value") =="A9")
			{
				m.toggleRequired("tnx_amt", true);
				m.toggleRequired("maturity_date", true);
			}
			else if(prodStatCodeValue.get("value") === "05" || prodStatCodeValue.get("value") === "13" || prodStatCodeValue.get("value") === "15"|| prodStatCodeValue.get("value") === "14" || prodStatCodeValue.get("value") === "04"){
				m.toggleRequired("maturity_date", true);
			}
			if(dj.byId("claim_reference") && dj.byId("claim_present_date") && dj.byId("claim_amt") && dj.byId("claim_cur_code"))
			{
				if(dj.byId("prod_stat_code") && (dj.byId("prod_stat_code").get("value") === '84' || dj.byId("prod_stat_code").get("value") === '85'))
				{
					m.animate("fadeIn", d.byId("claimDetails"));
					dj.byId("claim_reference").set("required", true);
					dj.byId("claim_present_date").set("required", true);
					dj.byId("claim_amt").set("required", true);
					dj.byId("claim_cur_code").set("value", dj.byId("lc_cur_code").get("value"));
					if(dj.byId("prod_stat_code").get("value") === '85' && dj.byId("claim_reference_hidden") && dj.byId("claim_present_date_hidden") &&  dj.byId("claim_amt_hidden"))
					{
						dj.byId("claim_reference").set("value", dj.byId("claim_reference_hidden").get("value"));
						dj.byId("claim_present_date").set("value", dj.byId("claim_present_date_hidden").get("value"));
						dj.byId("claim_amt").set("value", dj.byId("claim_amt_hidden").get("value"));
					}
				}
				else
				{
					m.animate("fadeOut", d.byId("claimDetails"));
					dj.byId("claim_reference").set("disabled", true);
					dj.byId("claim_present_date").set("disabled", true);
					dj.byId("claim_amt").set("disabled", true);
					dj.byId("claim_cur_code").set("disabled", true);
					dj.byId("claim_reference").set("value", "");
					dj.byId("claim_present_date").set("value", null);
					dj.byId("claim_amt").set("value", "");
					dj.byId("claim_cur_code").set("value", "");
				}
			}
			
			if((crAvlByCode2Checked || crAvlByCode3Checked) && dj.byId("mode").get("value") === 'RELEASE')
			{
				m.toggleRequired("drawee_details_bank_address_line_1",false);
			}
			
			var applRule = dj.byId("applicable_rules");
			if(applRule) 
			{
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
			if(dj.byId('stnd_by_lc_flag') && dj.byId('stnd_by_lc_flag').get("checked"))
			{
				dj.byId('stnd_by_lc_flag').disabled =  true;
			}
			else
			{
				m.animate("fadeOut", d.byId("standByLcFlagDetails"));
			}
			var maturityDateField = dj.byId("maturity_date");
			if(maturityDateField && maturityDateField.get("value"))
			{
				maturityDateField.onBlur();
			}
			var prodStatCodeField = dj.byId("prod_stat_code");
			var billReferenceField = dj.byId('imp_bill_ref_id');
			if(prodStatCodeField && prodStatCodeField.get('value') && billReferenceField)
			{
				var prodStatValue = dj.byId("prod_stat_code").get("value");
				if(prodStatValue==="04" || prodStatValue==="07" || prodStatValue==="12"||
						prodStatValue==="13" || prodStatValue==="05"  || prodStatValue==="14" || prodStatValue==="15"){
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

		/**
		 * <h4>Summary:</h4>  Before save validation method.
		 * <h4>Description</h4> : This method is called before saving a transaction. Applicant name should be selected before saving 
		 *
		 * @method beforeSaveValidations
		 */
		beforeSaveValidations : function(){
			var applicantdetails = dj.byId("applicant_abbv_name") ;
			m.setDraftTerm();
			if(applicantdetails && applicantdetails.get("value") === "")
			{
				return false;
			}
			else
			{
				return true;
			}
		},
		
		/**
		 * <h4>Summary:</h4>  Before submit validation method.
		 * <h4>Description</h4> : This method is called before submitting a transaction.
		 * Any before submit validation can be added in this method for Letter Of Credit (Bank Side Reporting). 
		 *
		 * @method beforeSubmitValidations
		 */
		beforeSubmitValidations : function() { 
			var rcfValidation = true;
			
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
			
			// Validate LC available amount to be non negative
			if(dj.byId("lc_available_amt"))
			{
				if(!m.validateLCAvailablelAmount((dj.byId("lc_available_amt"))?dj.byId("lc_available_amt"):0))
				{
					m._config.onSubmitErrorMsg =  m.getLocalization("invalidMessage");
					dj.byId("lc_available_amt").set("value","");
					return false;
				}
			}
			
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
			if(dj.byId("prod_stat_code") && dj.byId("prod_stat_code").get("value") === "84" && dj.byId("claim_amt") && dj.byId("claim_amt").get("value") !== "" && dj.byId("tnx_amt"))
			{
				dj.byId("tnx_amt").set("value", dj.byId("claim_amt").get("value"));
			}
			m.setDraftTerm();
			
			var tnxAmtField = dj.byId("tnx_amt");
			if(tnxAmtField)
			{
				var tnxAmt = tnxAmtField.get("value");
				if(!m.validateAmount(tnxAmtField))
				{
					m._config.onSubmitErrorMsg =  m.getLocalization("amountcannotzero");
					tnx_amt.set("value","");
					return false;
				}
				
				var orgLcLiabAmt = dj.byId("org_lc_liab_amt").get("value");
				
				var convertedAmt;
				if (d.isString(orgLcLiabAmt))
				{
					convertedAmt = d.number.parse(orgLcLiabAmt);
				}
				var valid = true;
				if(dj.byId("prod_stat_code") && (dj.byId("prod_stat_code").get("value")==="05" || dj.byId("prod_stat_code").get("value")==="15" || dj.byId("prod_stat_code").get("value")==="14" || dj.byId("prod_stat_code").get("value")==="13") && tnxAmt > convertedAmt)
				{
					console.debug("Document amount is greater than the Original LC Liab amount.");
				    var displayMessage = m.getLocalization("documentAmtGreaterThanLCAmt",[ dj.byId("lc_cur_code").getValue(), tnxAmt, orgLcLiabAmt ]);
					tnxAmtField.set("state","Error");
			 		dj.hideTooltip(tnxAmtField.domNode);
			 		dj.showTooltip(displayMessage, tnxAmtField.domNode, 100);
			 		tnxAmtField.invalidMessage = displayMessage;
			 		m._config.onSubmitErrorMsg = m.getLocalization("documentAmtGreaterThanLCAmt",[ dj.byId("lc_cur_code").getValue(), tnxAmt, orgLcLiabAmt ]);
			 		valid =  false;
			 		return valid;
				} 
			  if(valid && !(dj.byId("product_code") && dj.byId("product_code").get("value")== "LC" && dj.byId("tnx_type_code") && (dj.byId("tnx_type_code").get("value") == "01" || dj.byId("tnx_type_code").get("value") == "03") && dj.byId("mode") && dj.byId("mode").get("value") === "UNSIGNED") && dj.byId("prod_stat_code").get("value") != "12")
				{
					m.updateOutstandingAmount(dj.byId("lc_liab_amt"), dj.byId("org_lc_liab_amt"));
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
			if(dj.byId("lc_amt") && dj.byId("lc_available_amt") && (dj.byId("lc_amt").get("value") < dj.byId("lc_available_amt").get("value")))
			{
				m._config.onSubmitErrorMsg = m.getLocalization("AvailLCamtcanNotMoreThanTranAmt");
				dj.byId("lc_available_amt").set("value", "");
				console.debug("Invalid Available Amount.");
				return false;
			}
			if(dj.byId("lc_amt") && dj.byId("lc_liab_amt") && dj.byId("prod_stat_code") && dj.byId("prod_stat_code").get('value')=="03" && (dj.byId("lc_amt").get("value") > dj.byId("lc_liab_amt").get("value")))
			{
				m._config.onSubmitErrorMsg = m.getLocalization("LiabLCAmtcanNotLessThanTranAmt");
				dj.byId("lc_liab_amt").set("value", "");
				console.debug("Invalid Liability Amount.");
				return false;
			}
			//For rejected transactions skip the validations.
			if(dj.byId("prod_stat_code") && dj.byId("prod_stat_code").get("value") === "01")
			{
				return true;
			}
			else
			{
				 var hideTT = function() {	
						dj.hideTooltip(dj.byId("tnx_amt").domNode);	
					};	
					setTimeout(hideTT, 0);
			if(dj.byId("booking_amt") && !isNaN(dj.byId("booking_amt").get("value")) && dj.byId("limit_review_date") && dj.byId("facility_date"))
			{
				if(d.date.compare(dj.byId("limit_review_date").get("value"),new Date(),"date") < 0)
				{
					m._config.onSubmitErrorMsg  = m.getLocalization("amendLimitDateExpiry");
         			return false;
				}
			}
			var existingRecordsScreen = !dj.byId("tnx_stat_code") || !(dj.byId("tnx_stat_code").get("value") && (dj.byId("tnx_stat_code").get("value") === "03" || dj.byId("tnx_stat_code").get("value") === "07"));
			if(existingRecordsScreen)
			{
				rcfValidation = m.validateDocumentAmtAndLCAmt();
				if(!rcfValidation)
				{
					var lcAmtWidget = dj.byId("lc_amt");
			 		lcAmtWidget.focus();
			 		lcAmtWidget.set("state", "Error");
					return false;
				}
			}
				return m.validateLSAmtSumAgainstTnxAmt("lc");
			}
		},
		beforeSubmit : function(){
			if(m._config.swift2018Enabled)
			{
				m._beforeSubmit2018();
			}
		}
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.bank.report_lc_client');