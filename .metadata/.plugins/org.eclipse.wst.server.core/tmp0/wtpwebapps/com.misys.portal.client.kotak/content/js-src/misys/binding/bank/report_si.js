dojo.provide("misys.binding.bank.report_si");

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
dojo.require("dijit.form.NumberTextBox");
dojo.require("dijit.form.FilteringSelect");
dojo.require("dijit.layout.TabContainer");
dojo.require("misys.form.SimpleTextarea");
dojo.require("dojo.data.ItemFileReadStore");
dojo.require("misys.widget.Collaboration");
dojo.require("misys.form.file");
dojo.require("misys.form.common");
dojo.require("misys.validation.common");
dojo.require("misys.form.addons");
dojo.require("misys.binding.bank.report_si_swift");
dojo.require("misys.widget.Amendments");


/**
 * <h4>Summary:</h4>
 *  JavaScript file for Issued Standby Letter Of Credit(Bank Side Reporting).
 *  <h4>Description:</h4>
 *  This javascript is loaded on the Bank side reporting of Issued Standby Letter Of Credit.
 *  It contains on form load events, before save validations, before submit validations and widget bindings for various events.
 *  
 * @class report_si
 */
(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode..
	 m._config.siMandatoryFields = [];
	var text, value;
	var docDetails="doc-details";
	var notAllowed="NOT ALLOWED";
	
	/**
	 * <h4>Summary:</h4>  This method validates the release amount.
	 * <h4>Description</h4> : This method validates the release amount with SI outstanding amount.
	 * Validation - The release amount should be less than the SI outstanding amount and greater than 0.
	 *
	 * @method _validateReleaseAmount
	 */
	function _validateReleaseAmount(){
		//  summary:
	    //       Validates the release amount. Must be applied to an input field of 
		//       dojoType dijit.form.CurrencyTextBox.
		
		if(dj.byId("sub_tnx_type_code") && dj.byId("sub_tnx_type_code").get("value") =="05" && dj.byId("prod_stat_code") && dj.byId("prod_stat_code").get("value") !=="01")
			{
		
				var siReleaseAmt = dj.byId("release_amt");
				var orgSiLiab = dj.byId("org_lc_liab_amt");
		
				var siReleaseValue = dj.byId("release_amt") ? dj.byId("release_amt").get("value"):"";
				var orgSiLiabValue = dojo.number.parse(orgSiLiab.get("value")) || 0;
		
				console.debug("[misys.binding.trade.release_bg] Validating Release Amount, Value = ", siReleaseAmt);
				console.debug("[misys.binding.trade.release_bg] Original Amount, Value = ", orgSiLiabValue);
				console.debug("[misys.binding.trade.release_bg] Content of Error Message = ", m.getLocalization("releaseAmtGreaterThanOrgLiabAmtError"));

				if(siReleaseAmt && orgSiLiab && (siReleaseValue <= 0 || siReleaseValue > orgSiLiabValue))
				{
					m.dialog.show("ERROR", m.getLocalization("canNotReleaseTheTransaction"));
					dj.byId("lc_liab_amt").set("value",orgSiLiabValue);
					return false;
				}
				if(!isNaN(siReleaseValue))
				{
					var newLcLiabAmt = orgSiLiabValue - siReleaseValue;
					dj.byId("lc_liab_amt").set("value",newLcLiabAmt);
					return true;
				}
				else
				{
					dj.byId("lc_liab_amt").set("value",orgSiLiabValue);
				}
			}
			return true;
	}

	/**
	 * <h4>Summary:</h4>  This method validates the claim amount.
	 * <h4>Description</h4> : This method validates the claim amount with SI outstanding amount.
	 * Validation - The claim amount should be less than the SI outstanding amount and greater than 0.
	 *
	 * @method _validateClaimAmt
	 */
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
				m.dialog.show("ERROR", m.getLocalization("claimAmtGreaterThanOutstandingAmtError", [lcOsAmt.get("value").toFixed(2)]), "", function(){
					setTimeout(callback, 500);
				});
				return false;
			}
		}
		return true;
		
	}
	
	/**
	 * <h4>Summary:</h4>  This method validates the claim date.
	 * <h4>Description</h4> : This method validates the claim date with current date, expiry date and issue date.
	 * Validation -
	 * <ul> 
	 * <li>The claim date should be before current date.</li>
	 * <li>The claim date should be before expiry date.</li>
	 * <li>The claim date should be after issue date.</li>
	 * </ul>
	 * 
	 * @method _validateClaimAmt
	 */
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
				m.dialog.show("ERROR", m.getLocalization("claimDateGreaterThanCurrentDateError",[ claimDate.get("displayedValue"), currentDate.get("displayedValue") ]), "", function(){
					setTimeout(callback1, 500);
				});
				return false;
     		}
			else if(expDate && !m.compareDateFields(claimDate, expDate)) 
	    	 {
				 var callback2 = function() {
						return true;
					};
				m.dialog.show("WARNING", m.getLocalization("claimDateGreaterThanExpiryDateError",[ claimDate.get("displayedValue"), expDate.get("displayedValue") ]), "", function(){
					setTimeout(callback2, 500);
				});
	    	 }
			 else if(issDate && !m.compareDateFields(issDate, claimDate)) 
	    	 {
				 var callback3 = function() {
					 return true;
					};
				m.dialog.show("WARNING", m.getLocalization("claimDateLessThanIssueDateError",[ claimDate.get("displayedValue"), issDate.get("displayedValue") ]), "", function(){
					setTimeout(callback3, 500);
				});
	    	 }
		}
		return true;
		
	}
	
	/**
	 * <h4>Summary:</h4>  This method changes the product status code based on the transaction status selected.
	 * <h4>Description</h4> : This method changes the product status code based on the transaction status chosen
	 * For example- Not Processed, Approved, Cancelled etc.
	 *
	 * @method _changeProductStatCode
	 */
	function _changeProductStatCode(){
		//  summary:
	    //       Product Status code should change according to the Amount
		//       
		if(dj.byId("sub_tnx_type_code") && dj.byId("sub_tnx_type_code").get("value") ==="05")
	     {
			var existingProductStatCodes = dj.byId("prod_stat_code"),
			jsonData=null,
			refsStore=null;
			
			if(dj.byId("lc_liab_amt"))
			{
				var outStandingAmount = dojo.number.parse(dj.byId("lc_liab_amt"));
			}
			if (existingProductStatCodes)
			{
				jsonData = {"identifier" :"id", "items" : []};
				refsStore = new dojo.data.ItemFileWriteStore( {data : jsonData });
				
				if(outStandingAmount && outStandingAmount > 0)
				{
					refsStore.newItem( {"id" : "76", "name" : m.getLocalization("Approved")});
					refsStore.newItem( {"id" : "01", "name" : m.getLocalization("Not_Processed")});
					
					if(existingProductStatCodes.get("value") !== "01" && existingProductStatCodes.get("value") !== "76")
					{
						existingProductStatCodes.set("displayedValue", "");
						existingProductStatCodes.set("value","");
					}
					existingProductStatCodes.store = null;
					existingProductStatCodes.store = refsStore;	
					dj.byId("lc_release_flag").set("value","N");
				}
				else
				{
					refsStore.newItem( {"id" : "76", "name" : m.getLocalization("Approved")});
					refsStore.newItem( {"id" : "01", "name" : m.getLocalization("Not_Processed")});
					
					if(existingProductStatCodes.get("value") !== "01" && existingProductStatCodes.get("value") !== "76")
					{
						existingProductStatCodes.set("displayedValue", "");
						existingProductStatCodes.set("value","");
					}
					existingProductStatCodes.store = null;
					existingProductStatCodes.store = refsStore;	
					dj.byId("lc_release_flag").set("value","Y");
				}
			}
	     }
	}
	//
	// Public functions & variables
	//
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
			var siXMLStart = "<si_tnx_record>";
			/*
			 * Add license items tags, only in case of LC transaction.
			 * Else pass the input xml, without modification. (Ex : for create beneficiary from popup.)
			 */
			if(xml.indexOf(siXMLStart) != -1){
				// Setup the root of the XML string
				var xmlRoot = m._config.xmlTagName,
				transformedXml = xmlRoot ? ["<", xmlRoot, ">"] : [],			
						siXMLEnd   = "</si_tnx_record>",
						subSiXML	= "",
						selectedIndex = -1;
				subSiXML = xml.substring(siXMLStart.length,(xml.length-siXMLEnd.length));
				var i = 0, verb, text, itr = 0;
				var nodename = "amd_no"; 
				var amdNo = xml.substring(xml.indexOf("<"+nodename+">")+("<"+nodename+">").length,xml.indexOf("</"+nodename+">"));
				var tnxTypeCode = xml.substring(xml.indexOf("<tnx_type_code>")+("<tnx_type_code>").length,xml.indexOf("</tnx_type_code>"));
				var prodStatCode = xml.substring(xml.indexOf("<prod_stat_code>")+("<prod_stat_code>").length,xml.indexOf("</prod_stat_code>"));
				var arrayOfNarratives = ["narrative_description_goods","narrative_documents_required","narrative_additional_instructions","narrative_special_beneficiary","narrative_special_recvbank"];
				if(m._config.swift2018Enabled && (Number(amdNo) || prodStatCode === '08' || prodStatCode === '31')){ //swift enabled for Amendment form
					var subXML;
					var dataStoreNarrative = [m._config.narrativeDescGoodsDataStore,m._config.narrativeDocsReqDataStore,m._config.narrativeAddInstrDataStore,m._config.narrativeSpBeneDataStore,m._config.narrativeSpRecvbankDataStore];
					for(itr = 0; itr < 5; itr++){
						subXML = itr == 0 ? subSiXML.substring(0,subSiXML.indexOf("<"+arrayOfNarratives[itr]+">")) : (subXML.indexOf("<"+arrayOfNarratives[itr]+">") > 0 ? subXML.substring(0,subXML.indexOf("<"+arrayOfNarratives[itr]+">")) : subXML);
						if(subSiXML.indexOf("<"+arrayOfNarratives[itr]+">") < 0){continue;}
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
							subXML = subXML.concat(subSiXML.substring(subSiXML.indexOf("</"+arrayOfNarratives[itr]+">"),subSiXML.length));
						}
						else{
							subXML = subXML.concat("<"+arrayOfNarratives[itr]+">");
							subXML = subXML.concat(subSiXML.substring(subSiXML.indexOf("</"+arrayOfNarratives[itr]+">"),subSiXML.length));
						}
						
					}
					
					transformedXml.push(subXML);
				} else if(m._config.swift2018Enabled && tnxTypeCode === '01') { //For swift enabled with issuance form
					for(itr = 0; itr < 5; itr++){
						subXML = itr == 0 ? subSiXML.substring(0,subSiXML.indexOf("<"+arrayOfNarratives[itr]+">")) : subXML.substring(0,subXML.indexOf("<"+arrayOfNarratives[itr]+">"));
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
						subXML = subXML.concat(subSiXML.substring(subSiXML.indexOf("</"+arrayOfNarratives[itr]+">"),subSiXML.length));
					}
					transformedXml.push(subXML);
				}
				else{
					transformedXml.push(subSiXML);
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
		bind: function() {
			m.setValidation("iss_date", m.validateIssueDate);
			m.setValidation("amd_date", m.validateAmendmentDate);
			m.setValidation("exp_date", m.validateBankExpiryDate);
			m.setValidation("pstv_tol_pct", m.validateTolerance);
			m.setValidation("neg_tol_pct", m.validateTolerance);
			m.setValidation("max_cr_desc_code", m.validateMaxCreditTerm);
			m.setValidation("last_ship_date", m.validateLastShipmentDate);
			m.setValidation("lc_cur_code", m.validateCurrency);
			m.setValidation("latest_answer_date", m.validateLatestAnswerDate);
			m.setValidation("renew_for_nb", m.validateRenewFor);
			m.setValidation("advise_renewal_days_nb", m.validateDaysNotice);
			m.setValidation("rolling_renewal_nb", m.validateNumberOfRenewals);
			m.setValidation("rolling_cancellation_days", m.validateCancellationNotice);
			m.setValidation("rolling_renew_for_nb", m.validateRollingFrequency);
			//m.setValidation("final_expiry_date",m.validateTradeFinalExpiryDate);
			m.setValidation("renewal_calendar_date",m.validateRenewalCalendarDate);
			m.setValidation("renew_on_code",m.validateRenewalCalendarDate);
			m.setValidation("lc_govern_country", m.validateCountry);
			m.connect("ntrf_flag", "onClick", m.toggleTransferIndicatorFlag);
			m.setValidation("earliest_ship_date", m.validateEarliestShipmentDate);
			m.connect("ship_period", "onChange", m.validateShipPeriod);
			m.connect("courier_partner","onChange", m.validatecourierPartnerField);
			
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
			
			//Validate Hyphen, allowed no of lines validation on the back-office comment
			m.setValidation("bo_comment", m.bofunction);
			
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
					dj.showTooltip(m.getLocalization("projectedExpDateLessThanTransactionExpDtError",[ projectedExpDtVal, expDate.get("displayedValue") ]), dj.byId("projected_expiry_date").domNode, 0);
					setTimeout(hideTT, 2000);
				}
				else if(finalExp && !m.compareDateFields(this, finalExp))
				{
					this.set("value",null);
					dj.showTooltip(m.getLocalization("projectedExpDateGreaterThanFinalExpDtError",[ projectedExpDtVal, finalExp.get("displayedValue") ]), dj.byId("projected_expiry_date").domNode, 0);
					setTimeout(hideTT, 2000);
				}
			});
			m.connect("inco_term_year", "onChange", m.getIncoTerm);
			m.connect("inco_term_year", "onChange", function(){
				m.toggleFields(this.get("value"), null, ["inco_term"], false, true);
			});
			m.connect("inco_term", "onChange", function(){
				m.toggleFields(this.get("value"), null, ["inco_place"], false, false);
			});
			m.connect("delivery_to", "onChange", m.getDeliveryTo);
			m.connect("delivery_to", "onChange", function(){
				m.toggleFields((this.get("value") === "02" || this.get("value") === "04" || this.get("value") === "05" ), null, ["narrative_delivery_to"]);
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
					dj.showTooltip(m.getLocalization("finalExpDateLessThanTransactionExpDtError",[ finalExpDtVal, expDate.get("displayedValue") ]), dj.byId("final_expiry_date").domNode, 0);
					setTimeout(hideTT, 2000);
				}
				else if(projectedExp && !m.compareDateFields(projectedExp, this))
				{
					this.set("value",null);
					dj.showTooltip(m.getLocalization("finalExpDateLessThanProjectedExpDtError",[ finalExpDtVal, projectedExp.get("displayedValue") ]), dj.byId("final_expiry_date").domNode, 0);
					setTimeout(hideTT, 2000);
				}
			});
			
			//Claim Validations
			m.setValidation("claim_cur_code", m.validateCurrency);
			m.setValidation("claim_reference",m.validateSwiftAddressCharacters);
			m.connect("claim_amt", "onBlur", _validateClaimAmt);
			m.connect("claim_reference", "onBlur", m.checkClaimReferenceExists);
			m.connect("claim_present_date", "onBlur", _validateClaimDate);
			m.connect("prod_stat_code", "onChange", function(){
				if(this.get("value") === "84")
				{
					m.animate("fadeIn", d.byId("claimDetails"));
					m.animate("fadeOut", d.byId(docDetails));
					dj.byId("claim_cur_code").set("value", dj.byId("lc_cur_code").get("value"));
					dj.byId("claim_reference").set("disabled", false);
					dj.byId("claim_present_date").set("disabled", false);
					dj.byId("claim_amt").set("disabled", false);
					dj.byId("claim_cur_code").set("disabled", false);
					dj.byId("action_req_code").store.root.options.remove(4);
					m.setCurrency(dj.byId("claim_cur_code"), ["claim_amt"]);
				}
				else if(dj.byId("claim_reference") && dj.byId("claim_present_date") && dj.byId("claim_amt") && dj.byId("claim_cur_code"))
				{
					m.animate("fadeOut", d.byId("claimDetails"));
					m.animate("fadeIn", d.byId(docDetails));
					dj.byId("claim_reference").set("disabled", true);
					dj.byId("claim_present_date").set("disabled", true);
					dj.byId("claim_amt").set("disabled", true);
					dj.byId("claim_cur_code").set("disabled", true);
					dj.byId("claim_reference").set("value", "");
					dj.byId("claim_present_date").set("value", null);
					dj.byId("claim_amt").set("value", "");
					dj.byId("claim_cur_code").set("value", "");
					if((!dj.byId("action_req_code").store.root.options[4]) ||(dj.byId("action_req_code").store.root.options[4] && dj.byId("action_req_code").store.root.options[4].value !== value))
					{
						dj.byId("action_req_code").store.root.options.add(new Option(text,value,false,false));
					}
				}
			});
			// CF See comment in report_lc.js for this validation
			m.connect("prod_stat_code", "onChange", m.validateOutstandingAmount);
			m.connect(dj.byId("prod_stat_code"), "onChange", function(){
				this.validate();
				if(m._config.swift2018Enabled){
					m.refreshUIforAmendment();
				}
				var prodStatCodeField = dj.byId('prod_stat_code');
				var billReferenceField = dj.byId('imp_bill_ref_id');
				if(prodStatCodeField && prodStatCodeField.get('value') && billReferenceField) {
					var prodStatCodeValue = dj.byId("prod_stat_code").get("value");
					if(prodStatCodeValue==="04" || prodStatCodeValue==="07" || prodStatCodeValue==="12"||
					    prodStatCodeValue==="13" || prodStatCodeValue==="05"  || prodStatCodeValue==="14" || prodStatCodeValue==="15"){
						dj.byId("imp_bill_ref_id").set("disabled", false);
					}
					else{
						dj.byId("imp_bill_ref_id").set("disabled", true);
						dj.byId("imp_bill_ref_id").set("value", "");
					}
				}
				
			});				m.connect("irv_flag", "onClick", m.checkIrrevocableFlag);
			m.connect("ntrf_flag", "onClick", m.toggleTransferIndicatorFlag);
			m.connect("ntrf_flag", "onClick", m.checkNonTransferableFlag);
			m.connect("stnd_by_lc_flag", "onClick", m.checkStandByFlag);
						
			if(m._config.swift2018Enabled){ 
				
				m._bindSwift2018();
			}
			else{
				m.connect("cfm_inst_code_1", "onClick", m.resetConfirmationCharges);
				m.connect("cfm_inst_code_2", "onClick", m.resetConfirmationCharges);
				m.connect("cfm_inst_code_3", "onClick", m.resetConfirmationCharges);	
			}
			
			m.connect("cfm_chrg_brn_by_code_1", "onClick", m.checkConfirmationCharges);
			m.connect("cfm_chrg_brn_by_code_2", "onClick", m.checkConfirmationCharges);
			m.connect("cr_avl_by_code_1", "onClick", m.togglePaymentDraftAt);
			m.connect("cr_avl_by_code_1", "onClick", m.setDraftTerm);
			m.connect("cr_avl_by_code_2", "onClick", m.togglePaymentDraftAt);
			m.connect("cr_avl_by_code_3", "onClick", m.togglePaymentDraftAt);
			m.connect("cr_avl_by_code_4", "onClick", m.togglePaymentDraftAt);
			m.connect("cr_avl_by_code_5", "onClick", m.togglePaymentDraftAt);
			m.connect("cr_avl_by_code_6", "onClick", m.togglePaymentDraftAt);
			m.connect("cr_avl_by_code_5", "onChange", function(){
			        dj.byId("draft_term").set("value" , "");
			});
			m.connect("tenor_type_1", "onClick", m.toggleDraftTerm);
			m.connect("tenor_type_1", "onClick", m.setDraftTerm);
			m.connect("tenor_type_2", "onClick", m.toggleDraftTerm);
			m.connect("tenor_type_3", "onClick", m.toggleDraftTerm);
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
			m.connect("lc_liab_amt", "onChange", _changeProductStatCode);
			//Set renewal final expiry date
			/*m.connect("rolling_renewal_nb","onChange", m.setRenewalFinalExpiryDate);
			m.connect("renew_on_code","onChange", m.setRenewalFinalExpiryDate);
			m.connect("renewal_calendar_date","onChange", m.setRenewalFinalExpiryDate);
			m.connect("renew_for_nb","onChange", m.setRenewalFinalExpiryDate);
			m.connect("renew_for_period","onChange", m.setRenewalFinalExpiryDate);
			m.connect("exp_date","onChange", m.setRenewalFinalExpiryDate);
			m.connect("rolling_renew_on_code","onChange", m.setRenewalFinalExpiryDate);
			m.connect("rolling_renew_for_nb","onChange", m.setRenewalFinalExpiryDate);
			m.connect("rolling_renew_for_period","onChange", m.setRenewalFinalExpiryDate);*/
			m.connect("prod_stat_code", "onChange", function(){
				if(dj.byId("sub_tnx_type_code") && dj.byId("sub_tnx_type_code").get("value") =="05")
					{
						var prodStatCode = dj.byId("prod_stat_code");
						if( prodStatCode && prodStatCode.get("value") === "01" ){
							dj.byId("release_amt").set("readOnly", true);
							dj.byId("amd_date").set("readOnly", true);
						} else {
							dj.byId("release_amt").set("readOnly", false);
							dj.byId("amd_date").set("readOnly", false);
						}
					}
			});
			m.connect("release_amt", "onBlur", _validateReleaseAmount);
			
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
			if(!m._config.swift2018Enabled){
				m.connect("lc_amt", "onBlur", function(){
					m.setTnxAmt(this.get("value"));
				});
			}
			var existingRecordsScreen = !dj.byId("tnx_stat_code") || !(dj.byId("tnx_stat_code").get("value") && (dj.byId("tnx_stat_code").get("value") === "03" || dj.byId("tnx_stat_code").get("value") === "07"));
			if(existingRecordsScreen)
			{
				m.connect("lc_amt", "onBlur", m.validateDocumentAmtAndLCAmt);
				m.connect("tnx_amt", "onBlur", m.validateDocumentAmtAndLCAmt);
			}
			m.connect("last_ship_date", "onClick", function(){
				m.toggleDependentFields(this, dj.byId("narrative_shipment_period"),
						m.getLocalization("shipmentDateOrPeriodExclusivityError"));
			});
			m.connect("last_ship_date", "onChange", function(){
				m.toggleDependentFields(this, dj.byId("narrative_shipment_period"),
						m.getLocalization("shipmentDateOrPeriodExclusivityError"));
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
				var partShipValue = this.get("value");
				if(m._config.swift2018Enabled){
					//SWIFT 2018 changes
					if(partShipValue == 'CONDITIONAL'){
						d.byId("infoMessagePartialShipment").style.display = "block";
						d.byId("infoMessagePartialShipment").style.paddingLeft = "250px";
					}
					else{
						d.byId("infoMessagePartialShipment").style.display = "none";
					}
				}
				
				dj.byId("part_ship_detl").set("value", this.get("value"));
				m.toggleFields(partShipValue && partShipValue !== "ALLOWED" && partShipValue !== notAllowed && partShipValue !== "NONE", 
						null, ["part_ship_detl_text_nosend"]);
			});
			m.connect("part_ship_detl_text_nosend", "onBlur", function(){
				dj.byId("part_ship_detl").set("value", this.get("value"));
			});
			m.connect("tran_ship_detl_nosend", "onChange", function(){
				var fieldValue = this.get("value");
				if(m._config.swift2018Enabled){					
					//SWIFT 2018 changes
					if(fieldValue == 'CONDITIONAL'){
						d.byId("infoMessageTranshipment").style.display = "block";
						d.byId("infoMessageTranshipment").style.paddingLeft = "250px";
					}
					else{
						d.byId("infoMessageTranshipment").style.display = "none";
					}
				}
				
				dj.byId("tran_ship_detl").set("value", fieldValue);
				m.toggleFields(fieldValue && fieldValue !== "ALLOWED" &&
								fieldValue !== notAllowed && fieldValue !== "NONE", 
								null, ["tran_ship_detl_text_nosend"]);
				
			});
			m.connect("tran_ship_detl_text_nosend", "onBlur", function(){
				dj.byId("tran_ship_detl").set("value", this.get("value"));
			});
			m.connect("renew_on_code", "onChange", function(){
				m.toggleFields(this.get("value") === "02", null, ["renewal_calendar_date"]);
			});
			m.connect("tenor_days", "onFocus", m.setDraftDaysReadOnly);
			m.connect("tenor_period", "onFocus", m.setDraftDaysReadOnly);
			m.connect("tenor_from_after", "onFocus", m.setDraftDaysReadOnly);
			m.connect("tenor_days_type", "onFocus", m.setDraftDaysReadOnly);
			m.connect("draft_term", "onFocus", function(){
				this.set("readOnly", !dj.byId("cr_avl_by_code_5").get("checked"));
			});
			m.connect("narrative_shipment_period", "onChange", function(){
				if (m._config.shipment_period_standard === true) {
					m.toggleDependentFields(this, dj.byId("last_ship_date"),
					m.getLocalization("shipmentDateOrPeriodExclusivityError"));
				}
			});
			m.connect("narrative_shipment_period", "onClick", function(){
				if (m._config.shipment_period_standard === true) {
					m.toggleDependentFields(this, dj.byId("last_ship_date"),
					m.getLocalization("shipmentDateOrPeriodExclusivityError"));
				}
			});
			
			m.connect("prod_stat_code", "onChange",  function(){
				m.toggleProdStatCodeFields();
				var value = this.get("value");
				if(value =="07")
				{
				   m.toggleRequired("tnx_amt", false);
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
				if(value === "05" || value === "13" || value === "15"|| value === "14" || value === "04")
				{
					m.toggleRequired("maturity_date", true);
				}	
				else {
					m.toggleRequired("maturity_date", false);
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
				
			m.connect("prod_stat_code", "onChange", function(){
				if(!(dj.byId("sub_tnx_type_code") && dj.byId("sub_tnx_type_code").get("value") ==="05" && dj.byId("prod_stat_code").get("value") ==="76")) {
				m.updateOutstandingAmount(dj.byId("lc_liab_amt"),
						dj.byId("org_lc_liab_amt"),dj.byId("lc_amt"));
				}
			});
			
			// Optional EUCP flag 
			m.connect("eucp_flag", "onClick", function(){
				m.toggleFields(this.get("checked"), null, ["eucp_details"]);
			});
			m.connect("tnx_amt", "onChange", function(){
				if(!(dj.byId("sub_tnx_type_code") && dj.byId("sub_tnx_type_code").get("value") ==="05" && dj.byId("prod_stat_code").get("value") ==="76")) {
				m.updateOutstandingAmount(dj.byId("lc_liab_amt"),
						dj.byId("org_lc_liab_amt"));
				}
			});
			m.connect("product_type_code","onChange",function(){
				if(dj.byId("product_type_code").get("value")!== "99"){
					d.style("product_type_details_row","display","none");
				}
				else {
					d.style("product_type_details_row","display","block");
				}
			});
			m.connect("standby_rule_code", "onChange", function(){
				m.toggleFields((this.get("value") == "99"), null, [
						"standby_rule_other"]);
			});
			m.connect("credit_available_with_bank_type", "onChange", function(){
				var creditBankType = 
					d.trim(dj.byId(
							"credit_available_with_bank_type").get("value")).toLowerCase();
				if(creditBankType === m.getLocalization("xslCrAnyBank") || creditBankType === m.getLocalization("xslCrAdvisingBank") || creditBankType === m.getLocalization("xslCrIssuingBank"))
				{
				m.toggleFields(!(creditBankType === m.getLocalization("xslCrAnyBank") || 
						creditBankType === m.getLocalization("xslCrAdvisingBank") ||
						creditBankType === m.getLocalization("xslCrIssuingBank")),
										["credit_available_with_bank_name",
										 "credit_available_with_bank_address_line_1",
				                        "credit_available_with_bank_address_line_2",
				                        "credit_available_with_bank_dom",
				                        "credit_available_with_bank_address_line_4"], null);
				dj.byId("credit_available_with_bank_name_img").set("disabled",true);
				}
				else
				{
					m.toggleFields(creditBankType === m._config.other, null,
							["credit_available_with_bank_name",
							 "credit_available_with_bank_address_line_1",
							"credit_available_with_bank_address_line_2",
							"credit_available_with_bank_dom",
							"credit_available_with_bank_address_line_4"],true,true);
					dj.byId("credit_available_with_bank_name_img").set("disabled",false);
				}
				
				dj.byId("credit_available_with_bank_name").set("value", d.trim(dj.byId(
				"credit_available_with_bank_type").get("value")));
			});
			// Making outstanding amount as non editable in case of Not Processed,Cancelled,Purged
			m.connect("prod_stat_code","onChange",function(){
				var prodStatCodeValue = dj.byId("prod_stat_code").get("value"),liabAmt = dj.byId("lc_liab_amt");
				if(liabAmt && (prodStatCodeValue === "01" || prodStatCodeValue === "10" || prodStatCodeValue === "06"))
					{
						liabAmt.set("readOnly", true);
						liabAmt.set("disabled", true);
						m.toggleRequired("lc_liab_amt",false);
						//dj.byId("lc_liab_amt").set("value", "", false);
						dojo.attr(dj.byId("lc_liab_amt"),"value","");
					}
				else if(liabAmt)
					{
						liabAmt.set("readOnly", false);
						liabAmt.set("disabled", false);
						if(!(dj.byId("mode") && dj.byId("mode").get("value") === 'RELEASE'))
						{
							m.toggleRequired("lc_liab_amt",true);
						}
						dojo.attr(dj.byId("lc_liab_amt"),"value","");
						//dj.byId("lc_liab_amt").set("value", "", false);
					}
				var availableAmt = dj.byId("lc_available_amt");
				if(availableAmt && (prodStatCodeValue === "01" || prodStatCodeValue === "10" || prodStatCodeValue === "06"))
				{
					availableAmt.set("readOnly", true);
					availableAmt.set("disabled", true);
					m.toggleRequired("lc_available_amt",false);
					dj.byId("lc_available_amt").set("value", "");
				}
				else if(availableAmt)
				{
					availableAmt.set("readOnly", false);
					availableAmt.set("disabled", false);
					if(!(dj.byId("mode") && dj.byId("mode").get("value") === 'RELEASE'))
					{
						m.toggleRequired("lc_available_amt",true);
					}
					dj.byId("lc_available_amt").set("value", "");
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
				
				var actionReq = dj.byId("action_req_code");
				if(actionReq && prodStatCodeValue === '12')			
				{		
					 actionReq.set("value", "12");			
					 actionReq.set("readOnly", true);			
					 actionReq.set("disabled", true);			
				}
				if(dj.byId("prod_stat_code") && prodStatCodeValue === '31' && actionReq) 	
				{		
					 actionReq.set("readOnly", true);			
					 actionReq.set("disabled", true);			
				}
			});
			m.connect("prod_stat_code", "onChange", function(){
				if(dj.byId("tnx_type_code").get('value')=='03')
					{
					var	liabAmt = dj.byId("lc_liab_amt").get('value');
					var updatedLiabAmt;
					if(dj.byId("prod_stat_code").get('value')=='08')
						{
						if(dj.byId("sub_tnx_type_code").get('value') ==='01')
							{
							updatedLiabAmt=	liabAmt + dojo.number.parse(dj.byId("org_inc_amt").get('value'));
							dj.byId("lc_liab_amt").set("value",updatedLiabAmt);
								if(dj.byId("tnx_amt")){
									dj.byId("tnx_amt").set("value",dojo.number.parse(dj.byId("org_inc_amt").get('value')));	
								}
							}
						else if (dj.byId("sub_tnx_type_code").get('value') ==='02')
							{
							updatedLiabAmt=	liabAmt - dojo.number.parse(dj.byId("org_dec_amt").get('value'));
							dj.byId("lc_liab_amt").set("value",updatedLiabAmt);
								if(dj.byId("tnx_amt")){
									dj.byId("tnx_amt").set("value",dojo.number.parse(dj.byId("org_dec_amt").get('value')));	
								}
							}
						}
					else if (dj.byId("prod_stat_code").get('value')=='01' )
						{
						dj.byId("lc_liab_amt").set("value",dj.byId("org_lc_liab_amt").get('value'));
							if (dj.byId("org_dec_amt").get('value'))
							{
								if(dj.byId("tnx_amt")){
									dj.byId("tnx_amt").set("value",dojo.number.parse(dj.byId("org_dec_amt").get('value')));	
								}
							}
							if (dj.byId("org_inc_amt").get('value'))
							{
								if(dj.byId("tnx_amt")){
									dj.byId("tnx_amt").set("value",dojo.number.parse(dj.byId("org_inc_amt").get('value')));									
								}
							}
						}
					else if (dj.byId("prod_stat_code").get('value') === '76' && dj.byId("sub_tnx_type_code").get('value') === '05')
					{
						if (dj.byId("release_amt"))
						{
							dj.byId("lc_liab_amt").set("value",dojo.number.parse(dj.byId("org_lc_liab_amt").get('value')) - dojo.number.parse(dj.byId("release_amt").get('value')));
						}
					}
				}
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
			//Enable doc_ref_no in case of  Request for settlement and Notification of charges
			m.connect("prod_stat_code","onChange",function(){
				var prodStatCodeValue = dj.byId("prod_stat_code").get("value");
				if(dj.byId("doc_ref_no") &&(prodStatCodeValue === "16" || prodStatCodeValue === "24"))
					{
						dj.byId("doc_ref_no").set("disabled", false);
					}
				else if(dj.byId("doc_ref_no"))
					{
						dj.byId("doc_ref_no").set("disabled", true);
					}
			});
			m.connect("prod_stat_code", "onChange", function(){
				if(dj.byId("lc_type") && dj.byId("lc_type").get("value") === "02")
				{
					if(this.get("value") === "01")
					{
						dojo.forEach(dj.byId("fakeform1").getChildren(), function(widget){
							var id = widget.id;
							if(widget.required === true)
							{
								m._config.siMandatoryFields.push(id);
								m.toggleRequired(id, false);
							}
						});
						m._config.siMandatoryFields.push("narrative_description_goods");
						m._config.siMandatoryFields.push("narrative_documents_required");
						m._config.siMandatoryFields.push("advising_bank_name");
						m._config.siMandatoryFields.push("advising_bank_address_line_1");
						m.toggleRequired("narrative_description_goods", false);
						m.toggleRequired("narrative_documents_required", false);
						m.toggleRequired("advising_bank_name", false);
						m.toggleRequired("advising_bank_address_line_1", false);
						//m.toggleTransaction(false);
					}
					else if(this.get("value") === "03")
					{
						for (var i in m._config.siMandatoryFields) {
							m.toggleRequired(m._config.siMandatoryFields[i], true);
							}
						m.toggleTransaction(true);
					}
				}
				if (m._config.enable_to_edit_customer_details_bank_side == "false" && dj.byId("prod_stat_code") && dj.byId("prod_stat_code").get('value') !== '' && dj.byId("lc_liab_amt") && dj.byId("lc_available_amt") && dj.byId("tnx_type_code") && dj.byId("tnx_type_code").get("value") !== '15' && dj.byId("tnx_type_code").get("value") !== '13')
				{
					m.toggleRequired("lc_liab_amt", false);
					m.toggleRequired("lc_available_amt", false);
					m.toggleRequired("applicable_rules", false);
					m.toggleRequired("applicable_rules_text", false);
				}
			});
			m.connect("product_type_code","onChange",function(){
				if(dj.byId("lc_type") && dj.byId("lc_type").get("value") === '02' && dj.byId("product_type_code"))
				{
					if(dj.byId("product_type_code").get("value")!== "99"){
						d.style("product_type_details_row","display","none");
					}
					else {
						d.style("product_type_details_row","display","block");
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
			m.connect("lc_liab_amt", "onChange", function(){
			if(dj.byId("tnx_type_code") && dj.byId("sub_tnx_type_code") && (dj.byId("tnx_type_code").get('value')=='03' || dj.byId("tnx_type_code").get('value')=='01') && dj.byId("sub_tnx_type_code").get('value')!=='05')
			{

				if (dj.byId("prod_stat_code").get('value') === '08' && dj.byId("lc_liab_amt").get("value") < dj.byId("lc_amt").get("value") && dj.byId("sub_tnx_type_code").get('value') === '01')
				{
					dj.byId("lc_liab_amt").set("value",dojo.number.parse(dj.byId("lc_liab_amt").get("value")) + dojo.number.parse(dj.byId("org_inc_amt").get('value')));
				}
				if(dj.byId("prod_stat_code").get('value')!=='' && dj.byId("prod_stat_code").get('value')!=='08' && dj.byId("prod_stat_code").get('value')!=='01' && dj.byId("lc_liab_amt").get("value") < dj.byId("lc_amt").get("value"))
				{
					m.dialog.show("ERROR", m.getLocalization("outstandingAmountShouldBeGraterThanLCAmount"));					
					dj.byId("lc_liab_amt").set("value", "");
					dj.byId("lc_liab_amt").set("state", "Error");
				}
			}
			if (dj.byId("tnx_type_code") && dj.byId("tnx_type_code").get('value')=='03' && dj.byId("prod_stat_code") && dj.byId("prod_stat_code").get("value") !=="01" && dj.byId("prod_stat_code").get('value') === '08' && dj.byId("sub_tnx_type_code") && (dj.byId("sub_tnx_type_code").get('value') ==='02'))
			{
				dj.byId("lc_liab_amt").set("value",dojo.number.parse(dj.byId("org_lc_liab_amt").get("value")) - dojo.number.parse(dj.byId("org_dec_amt").get('value')));
			}
			if (dj.byId("tnx_type_code") && dj.byId("tnx_type_code").get('value')=='03' && dj.byId("prod_stat_code") && dj.byId("prod_stat_code").get("value") !=="01" && dj.byId("prod_stat_code").get('value') === '08' && dj.byId("sub_tnx_type_code") && (dj.byId("sub_tnx_type_code").get('value') ==='01'))
			{
				dj.byId("lc_liab_amt").set("value",dojo.number.parse(dj.byId("org_lc_liab_amt").get("value")) + dojo.number.parse(dj.byId("org_inc_amt").get('value')));
			}	
			});
			m.connect("maturity_date", "onBlur", function(){
				m.validateEnteredGreaterThanCurrentDate();
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
			m.connect("delv_org", "onChange", function(){
				m.toggleFields((this.get("value") === "99"), null, ["delv_org_text"]);
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
		},

		/**
		 * <h4>Summary:</h4>  This method sets the changes on the page on form load.
		 * <h4>Description</h4> : This method is called on form load.
		 * If user wants any changes in the property of a widget on form load, that change can be added in this method. 
		 *
		 * @method onFormLoad
		 */
		onFormLoad: function() {
			if(document.getElementById("amd_no")) {                                       
		         m._config.amendmentNumber = document.getElementById("amd_no").value;  
			}
			
			if (m._config.shipment_period_standard === false) {
				m._config.earliestShipDate = dj.byId("earliest_ship_date") ? dj.byId("earliest_ship_date").get("displayedValue") : "";
				m._config.shipPeriod = dj.byId("ship_period") ? dj.byId("ship_period").get("displayedValue") : "";
				m._config.shipName = dj.byId("ship_name") ? dj.byId("ship_name").get("displayedValue") : "";
				m._config.narrativeShipPeriod = dj.byId("narrative_shipment_period").get("displayedValue") ? dj.byId("narrative_shipment_period").get("displayedValue") : "";
				
		}
			
			m._config.expDate =  dj.byId("exp_date")? dj.byId("exp_date").get("displayedValue"): "";
			
			if(dj.byId("mode") && dj.byId("mode").get("value") === 'RELEASE')
			{					
				m.toggleRequired("iss_date",false);
				m.toggleRequired("lc_liab_amt",false);
				m.toggleRequired("lc_available_amt",false);
			}
			
			if(dijit.byId("action_req_code"))
			{
				text = dijit.byId("action_req_code").store.root.options[4].text;
				value = dijit.byId("action_req_code").store.root.options[4].value;
			}
			
			//_formLoadSwift2018 function executes only for SWIFT 2018 Switch ON
			//Switch ON is controlled by swift.version key in portal.properties
			if(m._config.swift2018Enabled){
				m._formLoadSwift2018();
			}
			
			if(dj.byId("credit_available_with_bank_name")) {
				var creditBankName = 
					d.trim(dj.byId("credit_available_with_bank_type").get("value")).toLowerCase();
			if(creditBankName === m.getLocalization("xslCrAnyBank") || creditBankName === m.getLocalization("xslCrAdvisingBank") || creditBankName === m.getLocalization("xslCrIssuingBank"))
			{
			m.toggleFields(
					!(creditBankName === m.getLocalization("xslCrAnyBank") || 
					creditBankName === m.getLocalization("xslCrAdvisingBank") || 
					creditBankName === m.getLocalization("xslCrIssuingBank")),
					null, 
					["credit_available_with_bank_name","credit_available_with_bank_address_line_1","credit_available_with_bank_address_line_2","credit_available_with_bank_dom","credit_available_with_bank_address_line_4","credit_available_with_bank_iso_code"], 
					true, false);
			
				dj.byId("credit_available_with_bank_name_img").set("disabled",true);
			}
			else
			{
				m.toggleFields(creditBankName === m._config.other, null,
						["credit_available_with_bank_name",
						 "credit_available_with_bank_address_line_1",
						"credit_available_with_bank_address_line_2",
						"credit_available_with_bank_dom",
						"credit_available_with_bank_address_line_4"],true,true);
			}
		}
			if(dj.byId("claim_cur_code") && dj.byId("claim_amt"))
			{
				m.setCurrency(dj.byId("claim_cur_code"), ["claim_amt"]);
			}
			if(dj.byId("lc_liab_amt") && dj.byId("release_amt")) {
				var orgSiLiabValue = dojo.number.parse(dj.byId("org_lc_liab_amt").get("value")) || 0,
						siReleaseAmt = dj.byId("release_amt").get("value");
				
				if(siReleaseAmt > orgSiLiabValue)
					{  	
						m.dialog.show("ERROR", m.getLocalization("canNotReleaseTheTransaction"));
						dj.byId("lc_liab_amt").set("value",orgSiLiabValue);
					}
				else{
						var newLcLiabAmt = orgSiLiabValue - siReleaseAmt;
						dj.byId("lc_liab_amt").set("value",newLcLiabAmt);
					}
					
			}
			if(dj.byId("prod_stat_code"))
			{
				_changeProductStatCode();
			}
			// Additional onload events for dynamic fields follow
			m.setCurrency(dj.byId("lc_cur_code"), ["tnx_amt", "lc_amt"]);
			m.setCurrency(dj.byId("lc_cur_code"), ["lc_available_amt","lc_liab_amt"]);

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
			
			// First activate radio buttons depending on which "Credit/Available By" is selected
			var checkboxes = ["cr_avl_by_code_1", "cr_avl_by_code_2", "cr_avl_by_code_3",
					"cr_avl_by_code_4", "cr_avl_by_code_5", "cr_avl_by_code_6"];
			
			d.forEach(checkboxes, function(id){
				var checkbox = dj.byId(id);
				if(checkbox && checkbox.get("checked")) {
					checkbox.onClick();
				}
			});
			
			var eucpFlag = dj.byId("eucp_flag");
			if(eucpFlag) {
				m.toggleFields(
						eucpFlag.get("checked"), 
						null,
						["eucp_details"]);
			}
			
			var crAvlByCode1Checked,crAvlByCode2Checked,crAvlByCode3Checked,crAvlByCode5Checked;
			if(dj.byId("cr_avl_by_code_1"))
			{	
				crAvlByCode1Checked= dj.byId("cr_avl_by_code_1").get("checked");
			}
			if(dj.byId("cr_avl_by_code_2"))
			{	
				crAvlByCode1Checked= dj.byId("cr_avl_by_code_2").get("checked");
			}
			if(dj.byId("cr_avl_by_code_3"))
			{	
				crAvlByCode1Checked=dj.byId("cr_avl_by_code_3").get("checked");
			}
			if(dj.byId("cr_avl_by_code_5"))
			{	
				crAvlByCode1Checked= dj.byId("cr_avl_by_code_5").get("checked");
			}
			if(!crAvlByCode1Checked && !crAvlByCode2Checked && !crAvlByCode3Checked && !crAvlByCode5Checked){
				m.setDraftTerm();
			}
			
			var issuingBankAbbvName = dj.byId("issuing_bank_abbv_name");
			if(issuingBankAbbvName) {
				issuingBankAbbvName.onChange();
			}
			
			var draweeDetailsBankName = dj.byId("drawee_details_bank_name");
			if(draweeDetailsBankName) {
				draweeDetailsBankName.onChange();
				m.setDraweeDetailBankName();
			}

			var shipDetlSelect = dj.byId("part_ship_detl_nosend");
			if(shipDetlSelect) {
				var shipDetlValue = shipDetlSelect.get("value");
				if(m._config.swift2018Enabled){					
					//SWIFT 2018 changes
					if(shipDetlValue == 'CONDITIONAL'){
						d.byId("infoMessageTranshipment").style.display = "block";
						d.byId("infoMessageTranshipment").style.paddingLeft = "250px";
					}
					else{
						d.byId("infoMessageTranshipment").style.display = "none";
					}
				}
				m.toggleFields(
				   shipDetlValue && shipDetlValue !== "ALLOWED" && shipDetlValue !== notAllowed && shipDetlValue !== "NONE", 
				   null, ["part_ship_detl_text_nosend"], true);
			}
			var shipDetl = dj.byId("part_ship_detl");
			if(shipDetl && shipDetlSelect && shipDetl.get("value") === "" ) {
				shipDetl.set("value", shipDetlSelect.get("value"));
			}
			
			var tranShipDetlSelect = dj.byId("tran_ship_detl_nosend");
			if(tranShipDetlSelect) {
				var fieldValue = tranShipDetlSelect.get("value");
				if(m._config.swift2018Enabled){					
					//SWIFT 2018 changes
					if(fieldValue == 'CONDITIONAL'){
						d.byId("infoMessageTranshipment").style.display = "block";
						d.byId("infoMessageTranshipment").style.paddingLeft = "250px";
					}
					else{
						d.byId("infoMessageTranshipment").style.display = "none";
					}
				}
				m.toggleFields(
						fieldValue && fieldValue !== "ALLOWED" && fieldValue !== notAllowed && fieldValue !== "NONE", 
						null, ["tran_ship_detl_text_nosend"]);
			}
			var tranShipDetl = dj.byId("tran_ship_detl");
			if(tranShipDetl && tranShipDetlSelect && tranShipDetl.get("value") === "") {
				tranShipDetl.set("value", tranShipDetlSelect.get("value"));
			}
			if (dj.byId("latest_answer_date")){
				m.toggleProdStatCodeFields();
			}
			if(dj.byId("prod_stat_code").get("value") === "79" || dj.byId("prod_stat_code").get("value") === "78") {
				dj.byId("action_req_code").set("value", "07");
				dj.byId("action_req_code").set("readOnly", true);
			}
			var siRule = dj.byId("standby_rule_code");
			if(siRule)
			{
				m.toggleFields((siRule.get("value") == "99"),
						null, ["standby_rule_other"]);
			}
			var prodStatCode = dj.byId("prod_stat_code"),liabAmt = dj.byId("lc_liab_amt") ;
			if(liabAmt && prodStatCode && (prodStatCode.get("value") === "01" || prodStatCode.get("value") === "10" || prodStatCode.get("value") === "06"))
			{
				liabAmt.set("readOnly", true);
				liabAmt.set("disabled", true);
			}
			else if(liabAmt)
			{
				if(prodStatCode.get("value")=== '08'){
					var updatedLiabAmt;
					if(dj.byId("sub_tnx_type_code").get('value') ==='01')
					{
					updatedLiabAmt=	liabAmt.get('value') + dojo.number.parse(dj.byId("org_inc_amt").get('value'));
					dj.byId("lc_liab_amt").set("value",updatedLiabAmt);
					}
				else if (dj.byId("sub_tnx_type_code").get('value') ==='02')
					{
					updatedLiabAmt=	liabAmt.get('value') - dojo.number.parse(dj.byId("org_dec_amt").get('value'));
					dj.byId("lc_liab_amt").set("value",updatedLiabAmt);
					}
				
				}

				liabAmt.set("readOnly", false);
				liabAmt.set("disabled", false);
			}
			
			var availableAmt = dj.byId("lc_available_amt");
			if(availableAmt)
			{
				if(prodStatCode && (prodStatCode.get('value') === '01' || prodStatCode.get('value') === '10' || prodStatCode.get('value') === '06'))
					{
					availableAmt.set("readOnly", true);
					availableAmt.set("disabled", true);
					}
				else
					{
					availableAmt.set("readOnly", false);
					availableAmt.set("disabled", false);
					}
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
						m._config.siMandatoryFields.push(id);
						m.toggleRequired(id, false);
					}
				});
				m._config.siMandatoryFields.push("narrative_description_goods");
				m._config.siMandatoryFields.push("narrative_documents_required");
				m._config.siMandatoryFields.push("advising_bank_name");
				m._config.siMandatoryFields.push("advising_bank_address_line_1");
				m.toggleRequired("narrative_description_goods", false);
				m.toggleRequired("narrative_documents_required", false);
				m.toggleRequired("advising_bank_name", false);
				m.toggleRequired("advising_bank_address_line_1", false);
				//m.toggleTransaction(false);
			}
			if(dj.byId("product_code") && dj.byId("product_code").get("value") === "SI")
			{
				m.connect("prod_stat_code","onChange", function(){
					if(dj.byId("prod_stat_code") && dj.byId("prod_stat_code").get("value") == "86")
					{
						dj.byId("action_req_code").set("value", "07");
					}
				});
			}
			if(dj.byId("claim_reference") && dj.byId("claim_present_date") && dj.byId("claim_amt") && dj.byId("claim_cur_code"))
			{
				if(dj.byId("prod_stat_code") && dj.byId("prod_stat_code").get("value") === "84")
				{
					m.animate("fadeOut", d.byId(docDetails));
					m.animate("fadeIn", d.byId("claimDetails"));
					dj.byId("claim_reference").set("required", true);
					dj.byId("claim_present_date").set("required", true);
					dj.byId("claim_amt").set("required", true);
					dj.byId("claim_cur_code").set("value", dj.byId("lc_cur_code").get("value"));
				}
				else
				{
					m.animate("fadeOut", d.byId("claimDetails"));
					m.animate("fadeIn", d.byId(docDetails));
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
			//Enable doc_ref_no in case of  Request for settlement and Notification of charges
			var prodStatCodeValue = dj.byId("prod_stat_code");
			if(dj.byId("doc_ref_no") && prodStatCode && (prodStatCode.get("value")=== "16" || prodStatCode.get("value") === "24"))
				{
					dj.byId("doc_ref_no").set("disabled", false);
				}
			else if(dj.byId("doc_ref_no"))
				{
					dj.byId("doc_ref_no").set("disabled", true);
				}
			if(dj.byId("product_type_code") && dj.byId("product_type_code").get("value") !== "99"){
				d.style("product_type_details_row","display","none");
			}
			else 
			{
				d.style("product_type_details_row","display","block");
			}
			if((crAvlByCode2Checked || crAvlByCode3Checked) && dj.byId("mode").get("value") === 'RELEASE'){
				m.toggleRequired("drawee_details_bank_address_line_1",false);
			}
			//maturity date mandatory
			if(prodStatCodeValue.get("value") === "05" || prodStatCodeValue.get("value") === "13" || prodStatCodeValue.get("value") === "15"|| prodStatCodeValue.get("value") === "14" || prodStatCodeValue.get("value") === "04"){
				m.toggleRequired("maturity_date", true);
			}
			
			//Radio field template is reading values from all nodes in the input xml.
			// For ones with multiple transactions, (ex:  create, approve, amend, approve.) the tag values from the root node is not being picked, because of radio-value = //*name in form-templates.
			// To overcome this we are overriding "value" and "checked" params from js.
			
			m.setRenewalAmountOnFormLoad();
			if (dj.byId("tnx_type_code") && (dj.byId("tnx_type_code").get("value") === '15' || (dj.byId("tnx_type_code").get("value") === '13')) && (m._config.enable_to_edit_customer_details_bank_side == "false"))
			{
				dojo.style('transactionDetails', "display", "none");
			} else
			{
				if (m._config.enable_to_edit_customer_details_bank_side == "false")
				{
					dojo.style('transactionDetails', "display", "none");

					var transactionids = [ "standby_rule_other", "standby_rule_code",
							"product_type_code", "product_type_details",
							"cfm_chrg_brn_by_code_2", "cfm_chrg_brn_by_code_1",
							"open_chrg_brn_by_code_1",
							"credit_available_with_bank_name",
							"credit_available_with_bank_address_line_1",
							"credit_available_with_bank_address_line_2",
							"credit_available_with_bank_dom", "open_chrg_brn_by_code_2",
							"corr_chrg_brn_by_code_1", "corr_chrg_brn_by_code_2",
							"max_cr_desc_code", "neg_tol_pct", "pstv_tol_pct",
							"lc_liab_amt", "lc_amt", "lc_cur_code", "cfm_inst_code_3",
							"cfm_inst_code_2", "cfm_inst_code_1", "stnd_by_lc_flag",
							"ntrf_flag", "irv_flag", "expiry_place", "exp_date",
							"iss_date_type_code", "exp_date_type_code", "entity",
							"applicant_name", "applicant_address_line_1",
							"tenor_type_3", "applicant_address_line_2", "applicant_dom",
							"applicant_country", "applicant_reference",
							"applicant_contact_number", "applicant_email",
							"alt_applicant_name", "issuing_bank_reference",
							"drawee_details_bank_dom",
							"drawee_details_bank_address_line_2", "beneficiary_name",
							"beneficiary_address_line_1", "tenor_days", "tenor_period",
							"tenor_from_after", "beneficiary_address_line_2",
							"beneficiary_dom", "beneficiary_country",
							"beneficiary_reference", "beneficiary_contact_number",
							"beneficiary_email", "issuing_bank_type_code",
							"tenor_days_type", "drawee_details_bank_name",
							"drawee_details_bank_address_line_1", "issuing_bank_name",
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
							"narrative_shipment_period", "narrative_description_goods",
							"narrative_documents_required", "advise_thru_bank_name",
							"advise_thru_bank_address_line_1",
							"advise_thru_bank_address_line_2", "advise_thru_bank_dom",
							"inco_place", "inco_term", "last_ship_date", "ship_name", "ship_period",
							"earliest_ship_date", "mlt_ship_detl",
							"tran_ship_detl_text_nosend", "tran_ship_detl_nosend",
							"part_ship_detl_text_nosend", "part_ship_detl_nosend",
							"ship_to", "ship_discharge", "ship_loading", "ship_from",
							"draft_term_free_format_text", "tenor_type_details",
							"tenor_days_type", "tenor_type_99", "tenor_days",
							"tenor_period", "tenor_from_after", "tenor_type_2",
							"tenor_maturity_date", "tenor_type_1", "cr_avl_by_code_6",
							"cr_avl_by_code_5", "draft_term", "cr_avl_by_code_4",
							"cr_avl_by_code_3", "cr_avl_by_code_2", "cr_avl_by_code_1",
							"carrier_detl", "applicable_rules", "applicable_rules_text",
							"lc_available_amt" ];
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
			if(dj.byId("lc_liab_amt") && dj.byId("release_amt")) {
				var orglcLiabValue = dojo.number.parse(dj.byId("org_lc_liab_amt").get("value")) || 0,
						lcReleaseAmt = dj.byId("release_amt").get("value");
				if(lcReleaseAmt > orglcLiabValue)
					{  	
						m.dialog.show("ERROR", m.getLocalization("canNotReleaseTheTransaction"));
						dj.byId("lc_liab_amt").set("value",orglcLiabValue);
					}
				else{
						var newlcLiabAmt = orglcLiabValue - lcReleaseAmt;
						dj.byId("lc_liab_amt").set("value",newlcLiabAmt);
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
			if(dj.byId("delivery_to")) {
				m.getDeliveryTo();
				dijit.byId("delivery_to").set("value",dj.byId("org_delivery_to").get("value"));
				m.toggleFields((dj.byId("delivery_to").get("value") === "02" || dj.byId("delivery_to").get("value") === "04" || dj.byId("delivery_to").get("value") === "05" ), null, ["narrative_delivery_to"]);
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
			var prodStatCodeField = dj.byId("prod_stat_code");
			var billReferenceField = dj.byId('imp_bill_ref_id');
			if(prodStatCodeField && prodStatCodeField.get('value') && billReferenceField)
			{
				var  prodStatValue=dj.byId("prod_stat_code").get("value") ;
				if(prodStatValue==="04" || prodStatValue==="07" || prodStatValue==="12"||
						prodStatValue==="13" || prodStatValue==="05"  || prodStatValue==="14" || prodStatValue==="15"    ){
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
		 * <h4>Summary:</h4>  Before submit validation method.
		 * <h4>Description</h4> : This method is called before submitting a transaction.
		 * Any before submit validation can be added in this method for Issued Standby Letter Of Credit (Bank Side Reporting). 
		 *
		 * @method beforeSubmitValidations
		 */
		beforeSubmitValidations: function() {
			//  summary: 
			//            Form-specific validations
			//  description:
		    //            Specific pre-submit validations for this form, that are called after
			//            the standard Dojo validations.
			//For rejected transactions skip the validations. 
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
			var rcfValidation = true;
			
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
			
		 	if(dj.byId("prod_stat_code") && dj.byId("prod_stat_code").get("value") === "01")
			{
				return true;
			}
			else
			{
				
				var subTnxTypeCode = dj.byId("sub_tnx_type_code") ? dj.byId("sub_tnx_type_code").get("value") : "";
				if(subTnxTypeCode =="05" && dj.byId("prod_stat_code") && dj.byId("prod_stat_code").get("value") !="01")
					{
					
						var siReleaseAmt = dj.byId("release_amt");
						var orgSiLiab = dj.byId("org_lc_liab_amt");
			
						var siReleaseValue = dj.byId("release_amt") ? dj.byId("release_amt").get("value"):"";
						var orgSiLiabValue = dojo.number.parse(orgSiLiab.get("value")) || 0;
			
						console.debug("[misys.binding.trade.release_bg] Validating Release Amount, Value = ", siReleaseAmt);
						console.debug("[misys.binding.trade.release_bg] Original Amount, Value = ", orgSiLiabValue);
						console.debug("[misys.binding.trade.release_bg] Content of Error Message = ", m.getLocalization("canNotReleaseTheTransaction"));
	
						if(siReleaseAmt && orgSiLiab && (siReleaseValue <= 0 || siReleaseValue > orgSiLiabValue) && orgSiLiabValue != "0")
						{
							m._config.onSubmitErrorMsg = m.getLocalization("canNotReleaseTheTransaction");
							dj.byId("lc_liab_amt").set("value",orgSiLiabValue);
							return false;
						}
						else if(orgSiLiabValue == "0")
						{
							m._config.onSubmitErrorMsg = m.getLocalization("canNotProceedTheTransaction");
							dj.byId("lc_liab_amt").set("value",orgSiLiabValue);
							return false;
						}
					}
				if(dj.byId("tnx_type_code") && dj.byId("tnx_type_code").get("value") =="03" && subTnxTypeCode != "05" && dj.byId("prod_stat_code") && dj.byId("prod_stat_code").get("value") !="01" && dijit.byId("prv_pod_stat_code") && dijit.byId("prv_pod_stat_code").get("value") == "06")
					{
						m._config.onSubmitErrorMsg = m.getLocalization("canNotProceedTheTransaction");
						dj.byId("lc_liab_amt").set("value",dojo.number.parse(dijit.byId("org_lc_liab_amt").get("value")));
						return false;
					}
				if(dj.byId("prod_stat_code") && dj.byId("prod_stat_code").get("value") === "84" && dj.byId("claim_amt") && dj.byId("claim_amt").get("value") !== "" && dj.byId("tnx_amt"))
				 {
					 dj.byId("tnx_amt").set("value", dj.byId("claim_amt").get("value"));
				 }
				var currentDate = dj.byId("current_date");
				var claimDate = dj.byId("claim_present_date");
				if(claimDate && currentDate && !m.compareDateFields(claimDate, currentDate)) 
	    		{
					var callback = function() {
						var widget = dijit.byId("claim_present_date");
					 	widget.focus();
					 	widget.set("state","Error");
					};
					m.dialog.show("ERROR", m.getLocalization("claimDateGreaterThanCurrentDateError",[ claimDate.get("displayedValue"), currentDate.get("displayedValue") ]), "", function(){
						setTimeout(callback, 500);
					});
					return false;
	    		}
				/*if(dj.byId("lc_liab_amt"))
				{
					var outstandingAmount = dojo.number.parse(dj.byId("lc_liab_amt").get("value")) || 0;
					if(outstandingAmount === 0)
					{
						var widget = dijit.byId("lc_liab_amt");
						var displayMessage = m.getLocalization("outstandingAmountZeroError");
						widget.focus();
						widget.set("state","Error");
						widget.set("value","");
						dj.hideTooltip(widget.domNode);
						dj.showTooltip(displayMessage, widget.domNode, 0);
						m._config.onSubmitErrorMsg = m.getLocalization("outstandingAmountZeroError");
					 	return false;
					}
				}*/
				var expDate = dj.byId("exp_date");
				var projectedExp = dj.byId("projected_expiry_date");
				var finalExp = dj.byId("final_expiry_date");
				if(projectedExp)
				{
					if(expDate && !m.compareDateFields(expDate, projectedExp))
					{
						m._config.onSubmitErrorMsg = m.getLocalization("projectedExpDateLessThanTransactionExpDtError",[ projectedExp.get("displayedValue"), expDate.get("displayedValue") ]);
						m.showTooltip(m.getLocalization("projectedExpDateLessThanTransactionExpDtError",[ projectedExp.get("displayedValue"), expDate.get("displayedValue") ]), projectedExp.domNode);
						return false;
					}
					else if(finalExp && !m.compareDateFields(projectedExp, finalExp))
					{
						m._config.onSubmitErrorMsg = m.getLocalization("projectedExpDateGreaterThanFinalExpDtError",[ projectedExp.get("displayedValue"), finalExp.get("displayedValue") ]);
						m.showTooltip(m.getLocalization("projectedExpDateGreaterThanFinalExpDtError",[ projectedExp.get("displayedValue"), finalExp.get("displayedValue") ]), projectedExp.domNode);
						return false;
					}
				}
				if(finalExp)
				{
					if(expDate && !m.compareDateFields(expDate, finalExp))
					{
						m._config.onSubmitErrorMsg = m.getLocalization("finalExpDateLessThanTransactionExpDtError",[ finalExp.get("displayedValue"), expDate.get("displayedValue") ]);
						m.showTooltip(m.getLocalization("finalExpDateLessThanTransactionExpDtError",[ finalExp.get("displayedValue"), expDate.get("displayedValue") ]), finalExp.domNode);
						return false;
					}
					else if(projectedExp && !m.compareDateFields(projectedExp, finalExp))
					{
						m._config.onSubmitErrorMsg = m.getLocalization("finalExpDateLessThanProjectedExpDtError",[ finalExp.get("displayedValue"), projectedExp.get("displayedValue") ]);
						m.showTooltip(m.getLocalization("finalExpDateLessThanProjectedExpDtError",[ finalExp.get("displayedValue"), projectedExp.get("displayedValue") ]), finalExp.domNode);
						return false;
					}
				}
				return _validateClaimAmt();
				
			}
		}
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require("misys.client.binding.bank.report_si_client");
