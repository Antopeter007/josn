dojo.provide("misys.binding.bank.report_bg");

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
dojo.require("misys.widget.Collaboration");
dojo.require("misys.binding.trade.ls_common");

function _localizeDisplayDate( /*dijit._Widget*/ dateField) {
	
	if(dateField.get("type") === "hidden") {
		return d.date.locale.format(m.localizeDate(dateField), {
			selector :"date"
		});
	}
	
	return dateField.get("displayedValue");
}
(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode
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
	
	// insert private functions & variables
	
	function _validateReleaseAmount(){
		//  summary:
	    //       Validates the release amount. Must be applied to an input field of 
		//       dojoType dijit.form.CurrencyTextBox.
		
		if(dj.byId("sub_tnx_type_code") && dj.byId("sub_tnx_type_code").get("value") ==="05")
			{
				var bgReleaseAmt = dj.byId("release_amt");
				var orgBGLiab = dj.byId("org_bg_liab_amt");
		
				var bgReleaseValue = dj.byId("release_amt") ? dj.byId("release_amt").get("value"):'';
				var orgBGLiabValue = dojo.number.parse(orgBGLiab.get("value")) || 0;
		
				console.debug("[misys.binding.trade.release_bg] Validating Release Amount, Value = ", bgReleaseValue);
				console.debug("[misys.binding.trade.release_bg] Original Amount, Value = ", orgBGLiabValue);
				console.debug("[misys.binding.trade.release_bg] Content of Error Message = ", m.getLocalization("releaseAmtGreaterThanOrgLiabAmtError"));

				if(bgReleaseAmt && orgBGLiab && (bgReleaseValue <= 0 || bgReleaseValue > orgBGLiabValue))
				{
					m.dialog.show("ERROR", m.getLocalization("canNotReleaseTheTransaction"));
					dj.byId("bg_liab_amt").set("value",orgBGLiabValue);
					return false;
				}
				if(!isNaN(bgReleaseValue))
				{
					var newBgLiabAmt = orgBGLiabValue - bgReleaseValue;
					dj.byId("bg_liab_amt").set("value",newBgLiabAmt);
					return true;
				}
				else
				{
					dj.byId("bg_liab_amt").set("value",orgBGLiabValue);
				}
			}
			return true;
	}
	
	function _validateClaimAmt(){
		var bgOsAmt = dj.byId("bg_liab_amt");
		var bgAmt = dj.byId("bg_amt");
		var claimAmt = dj.byId("claim_amt");
		if(bgAmt && claimAmt)
		{
			if(claimAmt.get("value") <= 0 || claimAmt.get("value") > bgOsAmt.get("value") || claimAmt.get("value") > bgAmt.get("value"))
			{
				var callback = function() {
					var widget = dijit.byId("claim_amt");
				 	widget.focus();
				 	widget.set("state","Error");
				};
				m.dialog.show("ERROR", m.getLocalization("claimAmtGreaterThanOutstandingAmtError", [bgOsAmt.get("value").toFixed(2)]), '', function(){
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
					setTimeout(callback1, 500);
				});
				return false;
     		}
			else if(expDate && !m.compareDateFields(claimDate, expDate)) 
	    	 {
				 var callback2 = function() {
						return true;
					};
				m.dialog.show("WARNING", m.getLocalization("claimDateGreaterThanExpiryDateError",[ claimDate.get("displayedValue"), expDate.get("displayedValue") ]), '', function(){
					setTimeout(callback2, 500);
				});
	    	 }
			 else if(issDate && !m.compareDateFields(issDate, claimDate)) 
	    	 {
				 var callback3 = function() {
					 return true;
					};
				m.dialog.show("WARNING", m.getLocalization("claimDateLessThanIssueDateError",[ claimDate.get("displayedValue"), issDate.get("displayedValue") ]), '', function(){
					setTimeout(callback3, 500);
				});
	    	 }
		}
		return true;
		
	}
	
	function _changeProductStatCode(){
		//  summary:
	    //       Product Status code should change according to the Amount
		//       
		if(dj.byId("sub_tnx_type_code") && dj.byId("sub_tnx_type_code").get("value") ==="05")
	     {
			var outStandingAmount = dj.byId("bg_liab_amt"),
			existingProductStatCodes = dj.byId("prod_stat_code"),
			jsonData=null,
			refsStore=null;
		
			if (existingProductStatCodes)
			{
				jsonData = {"identifier" :"id", "items" : []};
				refsStore = new dojo.data.ItemFileWriteStore( {data : jsonData });
				
				if(outStandingAmount && outStandingAmount.get("value") > 0)
				{
					refsStore.newItem( {"id" : '03', "name" : m.getLocalization("Approved")});
					refsStore.newItem( {"id" : '01', "name" : m.getLocalization("Not_Processed")});
					
					if(existingProductStatCodes.get('value') !== '01' && existingProductStatCodes.get('value') !== '03')
					{
						existingProductStatCodes.set("displayedValue", "");
						existingProductStatCodes.set("value","");
					}
					existingProductStatCodes.store = null;
					existingProductStatCodes.store = refsStore;	
					dj.byId("bg_release_flag").set("value",'N');
				}
				else
				{
					refsStore.newItem( {"id" : '76', "name" : m.getLocalization("Approved")});
					refsStore.newItem( {"id" : '01', "name" : m.getLocalization("Not_Processed")});
					
					if(existingProductStatCodes.get('value') !== '01' && existingProductStatCodes.get('value') !== '76')
					{
						existingProductStatCodes.set("displayedValue", "");
						existingProductStatCodes.set("value","");
					}
					existingProductStatCodes.store = null;
					existingProductStatCodes.store = refsStore;	
					dj.byId("bg_release_flag").set("value",'Y');
				}
			}
	     }
	}
	function _setBGLiabilityAmount(){
			//  summary:
		    //  Calculate the BG liability amount .
			var subTnxTypeCode = dj.byId("sub_tnx_type_code").get("value") ;
			var inc_amt = dj.byId("inc_amt").get('value');
			var dec_amt = dj.byId("dec_amt").get('value');
			var liabAmtcal = dj.byId("bg_liab_amt").get("value");
			if(subTnxTypeCode && (subTnxTypeCode==='01'||subTnxTypeCode==='02')&& (inc_amt||dec_amt)){			
				if(subTnxTypeCode==='01' && inc_amt){
					var inc = dojo.number.parse(liabAmtcal)+ dojo.number.parse(inc_amt);
					dj.byId("bg_liab_amt").set("value",inc );
				}
				else {
					var dec = dojo.number.parse(liabAmtcal)- dojo.number.parse(dec_amt);
					dj.byId("bg_liab_amt").set("value",dec);
				} 
			}
	}

	// Public functions & variables follow

	d.mixin(m._config, {

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

		bind : function() {
			m.setValidation("iss_date", m.validateIssueDate);
			m.setValidation("amd_date", m.validateAmendmentDate);
			m.setValidation("exp_date", m.validateBankExpiryDate);
			m.setValidation("bg_cur_code", m.validateCurrency);
			m.setValidation("contract_cur_code", m.validateCurrency);
			m.setValidation("net_exposure_cur_code", m.validateCurrency);
			m.setValidation("applicant_country", m.validateCountry);
			m.setValidation("beneficiary_country", m.validateCountry);
			m.setValidation("alt_applicant_country", m.validateCountry);
			m.setValidation("contact_country", m.validateCountry);
			m.setValidation("claim_cur_code", m.validateCurrency);
			m.setValidation("claim_reference",m.validateSwiftAddressCharacters);
			m.setValidation("exp_date", m.validateBankExpiryDate);
			m.connect("claim_amt", "onBlur", _validateClaimAmt);
			m.connect("claim_reference", "onBlur", m.checkClaimReferenceExists);
			m.connect("claim_present_date", "onBlur", _validateClaimDate);
			m.setValidation("contract_date", m.validateContractDate);
			m.setValidation("tender_expiry_date", m.validateTenderExpiryDate);
			m.setValidation("contract_pct", m.checkContractPercent);
			m.setValidation("extend_pay_date", m.validateMT777Fields);
			m.setValidation("latest_date_reply", m.validateMT777Fields);
			m.connect("prod_stat_code","onChange",function()
					{
						m.updateOutstandingAmount(dj.byId("bg_liab_amt"), dj.byId("org_bg_liab_amt"));	
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
			m.connect("prod_stat_code", "onChange", function(){
				if(this.get("value") === '84' || this.get("value") === '85')
				{
					m.animate("fadeIn", d.byId("claimDetails"));
					dj.byId("claim_cur_code").set("value", dj.byId("bg_cur_code").get("value"));
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
			});
			m.connect("prod_stat_code" , "onChange" , function(){
				if(this.get("value") === "86" && dj.byId("extend_pay_date") && dj.byId("latest_date_reply"))
				{
					m.animate("fadeIn", d.byId("ExtendPay"));
					dj.byId("extend_pay_date").set("disabled", false);
					dj.byId("latest_date_reply").set("disabled", false);
				}
				else if(dj.byId("extend_pay_date") && dj.byId("latest_date_reply"))
				{
					m.animate("fadeOut", d.byId("ExtendPay"));
					dj.byId("extend_pay_date").set("disabled", true);
					dj.byId("latest_date_reply").set("disabled", true);
					dj.byId("extend_pay_date").set("value", null);
					dj.byId("latest_date_reply").set("value", null);
				}

			});
			
		//	m.setValidation("final_expiry_date", m.validateTradeFinalExpiryDate);
			m.setValidation("renewal_calendar_date",m.validateRenewalCalendarDate);
			m.setValidation("renew_on_code",m.validateRenewalCalendarDate);
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
			
			//Validate Hyphen, allowed no of lines validation on the back-office comment
			m.setValidation("bo_comment", m.bofunction);
			
			m.connect("bg_cur_code", "onChange", function(){
				m.setCurrency(this, ["bg_amt", "bg_liab_amt"]);
			});
			m.connect("bg_amt", "onBlur", function(){
				m.setTnxAmt(this.get("value"));
			});
			m.connect("iss_date_type_code", "onChange", function(){
				m.toggleFields((this.get("value") === "99"), null, [
						"iss_date_type_details"]);
			});
			m.connect("exp_date_type_code", "onChange", function(){
				m.toggleFields((this.get("value") !== "01"), null, [
						"exp_date"]);
				m.toggleFields((this.get("value") !== "02"), null, ["exp_event"]);
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
				m.toggleFields((this.get("value") === "on"), null, ["net_exposure_cur_code", "net_exposure_amt", "consortium_details"], true, true);

				var consortiumDetails = dj.byId("consortium");
				
				if (consortiumDetails.get("value") !== "on")
				{
					dj.byId("net_exposure_cur_code").set("value", "");
					dj.byId("net_exposure_amt").set("value", "");
					dj.byId("consortium_details").set("value", "");
				}				
			});
			m.connect("issuing_bank_type_code", "onChange", function(){
				m.toggleFields((this.get("value") === "02"), 
						["issuing_bank_address_line_2", "issuing_bank_dom","issuing_bank_address_line_4", "issuing_bank_reference"], 
						["issuing_bank_name", "issuing_bank_address_line_1"]);
				if(this.get("value") === "01") {
					dojo.byId("issuing_bank_name_img").style.display = 'display:none';
				}
				else if(this.get("value") === "02") {
					dojo.byId("issuing_bank_name_img").style.display = 'display:block';
				}
			});
			m.connect("bg_type_code", "onChange", m.toggleGuaranteeType);
			m.connect("bg_text_type_code", "onChange", function(){
				m.toggleFields((this.get("value") === "03"), null, ["bg_text_type_details"]);
			});
			m.connect("delivery_to", "onChange", function(){
				m.toggleFields((this.get("value") === "04"), null, ["delivery_to_other"]);
			});
			m.connect("bg_rule", "onChange", function(){
				m.toggleFields((this.get("value") === "99"), null, [
						"bg_rule_other"]);
			});
			m.connect("text_language", "onChange", function(){
				m.toggleFields((this.get("value") === "*"), null, [
						"text_language_other"]);
			});
			m.connect("contract_cur_code", "onChange", function(){
				m.setCurrency(this, ["contract_amt"]);
			});

			m.connect("prod_stat_code", "onChange", m.toggleProdStatCodeFields);
			m.connect("prod_stat_code", "onChange", m.refreshUIforBGAmendment);
			m.connect("prod_stat_code", "onChange", function(){
				var value = this.get("value");
				m.toggleFields(value && value !== "01" && value !== "18", ["action_req_code"],
						["iss_date", "bo_ref_id"]);
				if(dj.byId("mode") && dj.byId("mode").get("value") === 'RELEASE')
				{					
					m.toggleRequired("bo_ref_id",false);
					m.toggleRequired("iss_date",false);
					m.toggleRequired("bg_liab_amt",false);
					m.toggleRequired("bg_available_amt",false);
				}
				if(value === "05" || value === "13" || value === "15"|| value === "14" || value === "04")
				{
					m.toggleRequired("maturity_date", true);
				}	
				else {
					m.toggleRequired("maturity_date", false);
				}
			});
			//making confirming bank mandatory only when the confirmation req checkbox is checked
			m.connect("adv_bank_conf_req", "onClick", function(){
					m.toggleFields(
							this.get("checked") === true,
							["confirming_bank_address_line_2", "confirming_bank_dom"],
							["confirming_bank_name", "confirming_bank_address_line_1"]);
					if(this.get("checked") === true)
					{
						m.animate('fadeIn', d.byId('confirming_bank_name_img'));
					}
					else
					{
						m.animate('fadeOut', d.byId('confirming_bank_name_img'));
					}
			});
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
			// Making outstanding amount as non editable in case of Not Processed,Cancelled,Purged
			m.connect("prod_stat_code","onChange",function(){
				var prodStatCodeValue = dj.byId("prod_stat_code").get('value'),liabAmt = dj.byId("bg_liab_amt");
				if(liabAmt && (prodStatCodeValue === '01' || prodStatCodeValue === '10' || prodStatCodeValue === '06') )
					{
					var subTnxTypeCode = dj.byId("sub_tnx_type_code").get("value") ;
					if(subTnxTypeCode && (subTnxTypeCode==='01'||subTnxTypeCode==='02')&& (prodStatCodeValue === '01')){
						liabAmt.set("value",dj.byId("org_bg_liab_amt").get("value"));
					}
						liabAmt.set("readOnly", true);
						liabAmt.set("disabled", true);
						m.toggleRequired("bg_liab_amt",false);
						dj.byId("bg_liab_amt").set("value", dj.byId("bg_liab_amt").get("value"));
						
					}
				else if(liabAmt)
					{	
						if(prodStatCodeValue === '08' ){
							_setBGLiabilityAmount();
						}
						liabAmt.set("readOnly", false);
						liabAmt.set("disabled", false);
						if(!(dj.byId("mode") && dj.byId("mode").get("value") === 'RELEASE'))
						{
							m.toggleRequired("bg_liab_amt",true);
						}
						dj.byId("bg_liab_amt").set("value", dj.byId("bg_liab_amt").get("value"));
						
						}
				var availableAmt = dj.byId("bg_available_amt");
				if(availableAmt && (prodStatCodeValue === '01' || prodStatCodeValue === '10' || prodStatCodeValue === '06'))
				{
					availableAmt.set("readOnly", true);
					availableAmt.set("disabled", true);
					m.toggleRequired("bg_available_amt",false);
					dj.byId("bg_available_amt").set("value", "");
				}
				else if(availableAmt)
				{
					availableAmt.set("readOnly", false);
					availableAmt.set("disabled", false);
					if(!(dj.byId("mode") && dj.byId("mode").get("value") === 'RELEASE'))
					{
					m.toggleRequired("bg_available_amt",true);	
					}
					dj.byId("bg_available_amt").set("value", "");
				}
				if(dj.byId("tnx_type_code") && dj.byId("tnx_type_code").get('value')=='01')
				{
					if(prodStatCodeValue === '01')
					{
						liabAmt.set("value", dj.byId("bg_liab_amt").get("value"));
					}
					else
					{
						liabAmt.set("value", dj.byId("bg_amt").get('value'));

					}
				}
				
				var actionReq = dj.byId("action_req_code");
				if(actionReq && (prodStatCodeValue === '01' || prodStatCodeValue === '10' || prodStatCodeValue === '06' || prodStatCodeValue === '31'))
				{
					actionReq.set("readOnly", true);
					actionReq.set("disabled", true);
					
				}
				else if(actionReq && prodStatCodeValue === '12')			
				{		
					 actionReq.set("value", "12");			
					 actionReq.set("readOnly", true);			
					 actionReq.set("disabled", true);			
				}
				else
				{
					actionReq.set("readOnly", false);
					actionReq.set("disabled", false);
				}
				
			});
			
			m.connect("release_amt", "onBlur", _validateReleaseAmount);
			m.connect("advising_bank_name", "onBlur", m.setConfirmedRequired);
			
			//for renewal
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
			m.connect("renew_on_code", "onChange", function(){
				m.toggleFields(
						this.get("value") === "02", 
						null,
						["renewal_calendar_date"]);
				dj.byId("final_expiry_date").validate();
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
				if(dj.byId("rolling_day_in_month").get("value")=== 0)
				{
					dj.byId("rolling_day_in_month").set("state","Error");
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
			
			
			
			//Set renewal final expiry date
		/*	m.connect("rolling_renewal_nb","onBlur", m.setRenewalFinalExpiryDate);
			m.connect("renew_on_code","onBlur", m.setRenewalFinalExpiryDate);
			m.connect("renewal_calendar_date","onBlur", m.setRenewalFinalExpiryDate);
			m.connect("renew_for_nb","onBlur", m.setRenewalFinalExpiryDate);
			m.connect("renew_for_period","onBlur", m.setRenewalFinalExpiryDate);
			m.connect("exp_date","onBlur", m.setRenewalFinalExpiryDate); */
			if(!(dj.byId("mode") && dj.byId("mode").get("value") === 'RELEASE'))
			{
			m.connect("bg_liab_amt", "onChange", _changeProductStatCode);
			}
			m.connect("bg_liab_amt", "onBlur", function(){
				if(dj.byId("bg_amt") && (dj.byId("bg_amt").get("value") < dj.byId("bg_liab_amt").get("value")))
				{
					var callback = function() {
						var widget = dijit.byId("bg_liab_amt");
						widget.focus();
					 	widget.set("state","Error");
					};
					m.dialog.show("ERROR", m.getLocalization("canNotMoreThanTranAmt"), '', function(){
							setTimeout(callback, 500);
						});
				}
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
				if(m._config.enable_to_edit_customer_details_bank_side=="false" && dj.byId("prod_stat_code") && dj.byId("prod_stat_code").get('value') !== '')
				{
					if(dj.byId("bg_liab_amt") && dj.byId("tnx_type_code") && dj.byId("tnx_type_code").get("value") !== '15' && dj.byId("tnx_type_code").get("value") !== '13')
					{
						m.toggleRequired("bg_liab_amt", false);
						m.toggleRequired("bg_available_amt", false);
					}
				}
			});
			
			m.connect("facility_id", "onChange", m.getLimitDetails);
			m.connect("limit_id", "onChange", m.setLimitFieldsValue);
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
			m.connect("bg_type_code", "onChange", function(){
				m.clearLicenseGrid(this, m._config.bgTypeCode);
			});
			//Set 
			m.connect("renew_amt_code_1","onClick",  function(){
				m.setRenewalAmount(this);
				});
			m.connect("renew_amt_code_2","onClick",  function(){
				m.setRenewalAmount(this);
				});
			m.connect("issuing_bank_address_line_4", "onFocus", function(){
				m.showTooltip(m.getLocalization('addressLine4ToolTip', 
						[dj.byId("issuing_bank_address_line_4").get("displayedValue"), dj.byId("issuing_bank_address_line_4").get("value") ]), d.byId("issuing_bank_address_line_4"), [ 'after' ],5000);
			});
			m.connect("applicant_address_line_4", "onFocus", function(){
				m.showTooltip(m.getLocalization('addressLine4ToolTip', 
						[dj.byId("applicant_address_line_4").get("displayedValue"), dj.byId("applicant_address_line_4").get("value") ]), d.byId("applicant_address_line_4"), [ 'after' ],5000);
			});
			m.connect("beneficiary_address_line_4", "onFocus", function(){
				m.showTooltip(m.getLocalization('addressLine4ToolTip', 
						[dj.byId("beneficiary_address_line_4").get("displayedValue"), dj.byId("beneficiary_address_line_4").get("value") ]), d.byId("beneficiary_address_line_4"), [ 'after' ],5000);
			});
			m.connect("contact_address_line_4", "onFocus", function(){
				m.showTooltip(m.getLocalization('addressLine4ToolTip', 
						[dj.byId("contact_address_line_4").get("displayedValue"), dj.byId("contact_address_line_4").get("value") ]), d.byId("contact_address_line_4"), [ 'after' ],5000);
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
				}
				else
				{
					confirmationRequired.set("disabled", true);
					confirmationRequired.set("checked", false);
				}
			}
		}, 
		
		onFormLoad : function() {
			if(document.getElementById("amd_no")) {                                       
		         m._config.amendmentNumber = document.getElementById("amd_no").value;  
			}
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
			
			m.setCurrency(dj.byId("net_exposure_cur_code"),[ "net_exposure_amt"]);
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
			if(d.byId("amd_no_date_bg_display_div")){
				if(dj.byId("prod_stat_code").get("value") === '08'){
					m.animate("fadeIn", d.byId("amd_no_date_bg_display_div"));
					d.byId("amd_no_date_bg_display_div").style.display="block";
					dj.byId("amd_date").set("disabled",false);
				}
				else {
					d.byId("amd_no_date_bg_display_div").style.display="none";
				}

			}
			if(d.byId("amd_no_date_display_div")){
						d.byId("amd_no_date_display_div").style.display="none";
					}
						
			// Set the currency of the charge amount field
			m.setCurrency(dj.byId("bg_cur_code"), ["tnx_amt", "bg_amt", "bg_liab_amt" , "bg_available_amt"]);
			if(dj.byId("claim_cur_code") && dj.byId("claim_amt"))
			{
				m.setCurrency(dj.byId("claim_cur_code"), ["claim_amt"]);
			}
			m.setCurrency(dj.byId("contract_cur_code"), ["contract_amt"]);
			
			var advisingBankName = dj.byId("advising_bank_name");
			var confirmationRequired = dj.byId("adv_bank_conf_req");
			if(advisingBankName && advisingBankName.get("value")=== ""){
				confirmationRequired.set("disabled", true);
				confirmationRequired.set("checked", false);
			}
			//making confirming bank mandatory only when the confirmation req checkbox is checked
			m.toggleFields(
					confirmationRequired.get("checked") === true,
					["confirming_bank_address_line_2", "confirming_bank_dom"],
					["confirming_bank_name", "confirming_bank_address_line_1"]);
			if(confirmationRequired.get("checked") === true)
			{
				m.animate('fadeIn', d.byId('confirming_bank_name_img'));
			}
			else
			{
				m.animate('fadeOut', d.byId('confirming_bank_name_img'));
			}

			var issDateTypeCode = dj.byId("iss_date_type_code");
			if(issDateTypeCode)
			{
				m.toggleFields(
						(issDateTypeCode.get("value") === "99"), null,
						["iss_date_type_details"]);
			}
			
			var expDateTypeCode = dj.byId("exp_date_type_code");
			if(expDateTypeCode)
			{
				m.toggleFields(
						(expDateTypeCode.get("value") !== "01"), null,
						["exp_date"]);
				m.toggleFields(
						expDateTypeCode.get("value") !== "02", null,
						["exp_event"]);
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
			}
			
			var issuingBankTypeCode = dj.byId("issuing_bank_type_code");
			if(issuingBankTypeCode)
			{
				m.toggleFields(
						(issuingBankTypeCode.get("value") === "02"),
						["issuing_bank_address_line_2", "issuing_bank_dom","issuing_bank_address_line_4", "issuing_bank_reference"],
						["issuing_bank_name", "issuing_bank_address_line_1"]);
				if(issuingBankTypeCode.get("value") === "01") {
					dojo.byId("issuing_bank_name_img").style.display = 'display:none';
				}
				else if(issuingBankTypeCode.get("value") === "02") {
					dojo.byId("issuing_bank_name_img").style.display = 'display:block';
				}
			}
			
			var bgTypeCode = dj.byId("bg_type_code");
			if(bgTypeCode) {
				bgTypeCode.onChange(bgTypeCode.get("value"));
			}
			
			var deliveryTo = dj.byId("delivery_to");
			if(deliveryTo) {
				m.toggleFields(
						deliveryTo.get("value") === "04",
						null, ["delivery_to_other"]);
			}
			
			var bgRule = dj.byId("bg_rule");
			if(bgRule)
			{
				m.toggleFields((bgRule.get("value") === "99"),
						null, ["bg_rule_other"]);
			}
			
			var textLanguage = dj.byId("text_language");
			if(textLanguage)
			{
				m.toggleFields((textLanguage.get("value") === "*"),
						null, ["text_language_other"]);
			}
			
			var bgTextTypeCode = dj.byId("bg_text_type_code");
			if(bgTextTypeCode)
			{
					m.toggleFields(
						bgTextTypeCode.get("value") === "03",
						null, ["bg_text_type_details"]);
			}
			if(dj.byId("prod_stat_code").get("value") === "79" || dj.byId("prod_stat_code").get("value") === "78") {
				dj.byId("action_req_code").set("value", "07");
				dj.byId("action_req_code").set("readOnly", true);
			}
			
			else if(dj.byId("prod_stat_code").get("value") === "01" || dj.byId("prod_stat_code").get("value") === "10" || dj.byId("prod_stat_code").get("value") === "06") {
				dj.byId("action_req_code").set("readOnly", true);
				dj.byId("action_req_code").set("disabled", true);
			}
			 else if(dj.byId("prod_stat_code").get("value") === "12")	
			{
				dj.byId("action_req_code").set("value", "12");			
				dj.byId("action_req_code").set("readOnly", true);			
				dj.byId("action_req_code").set("disabled", true);			
		    }
			 else if(dj.byId("prod_stat_code").get("value") === "31")	
				{	
					dj.byId("action_req_code").set("readOnly", true);			
					dj.byId("action_req_code").set("disabled", true);			
			    }
			  else{
					dj.byId("action_req_code").set("readOnly", false);
					dj.byId("action_req_code").set("disabled", false);
				}
			
			if(dj.byId("bg_liab_amt") && dj.byId("release_amt")) {
				var orgBgLiabValue = dojo.number.parse(dj.byId("org_bg_liab_amt").get("value")) || 0,
						bgReleaseAmt = dj.byId("release_amt").get("value");
				
				if(bgReleaseAmt > orgBgLiabValue)
					{  	
						m.dialog.show("ERROR", m.getLocalization("canNotReleaseTheTransaction"));
						dj.byId("bg_liab_amt").set("value",orgBgLiabValue);
					}
				else{
					var newBgLiabAmt = orgBgLiabValue - bgReleaseAmt;
					dj.byId("bg_liab_amt").set("value",newBgLiabAmt);
				}
					
			}			
			if(dj.byId("prod_stat_code")) {
				if(dj.byId("mode") && dj.byId("mode").get("value") === 'RELEASE')
				{					
					m.toggleRequired("bo_ref_id",false);
					m.toggleRequired("iss_date",false);
					m.toggleRequired("bg_liab_amt",false);
					m.toggleRequired("bg_available_amt",false);
				}
				else
				{
					_changeProductStatCode();
					var value = dj.byId("prod_stat_code").get("value");
					m.toggleFields(!(value === "01" || value === "18"), null,
							["iss_date", "bo_ref_id"]);
				}
			}
			//for renewal
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
						null,
						["rolling_renewal_nb", "rolling_cancellation_days", "rolling_renew_on_code"], true);
				
				if(d.byId("advise_renewal_days_nb") && d.byId("advise_renewal_days_nb").value===""){
					dj.byId("advise_renewal_flag").set("checked",false);
				}
				var rollingRenewOnCode = dj.byId("rolling_renew_on_code");
				if(rollingRenewOnCode) {
					m.toggleFields(rollingRenewOnCode.get("value") === "03",
							["rolling_day_in_month"], ["rolling_renew_for_nb"], true);
				}
			}
			
			/*var rollingFlag = dj.byId("rolling_renewal_flag");
			if(rollingFlag) {
				m.toggleFields(rollingFlag.get("checked"),
						null, ["rolling_renewal_nb", "rolling_cancellation_days"], true);
			}*/
			
			var prodStatCode = dj.byId("prod_stat_code"),liabAmt = dj.byId("bg_liab_amt");
			//maturity date mandatory
			if(prodStatCode.get("value") === "05" || prodStatCode.get("value") === "13" || prodStatCode.get("value") === "15"|| prodStatCode.get("value") === "14" || prodStatCode.get("value") === "04"){
				m.toggleRequired("maturity_date", true);
			}
			if(liabAmt && prodStatCode && (prodStatCode.get('value') === '01' || prodStatCode.get('value') === '10' || prodStatCode.get('value') === '06'))
				{
					liabAmt.set("readOnly", true);
					liabAmt.set("disabled", true);
				}
			else if(liabAmt)
				{
					if(prodStatCode.get("value")=== '08'){
						_setBGLiabilityAmount();
					}				
					liabAmt.set("readOnly", false);
					liabAmt.set("disabled", false);
				}
			
			var availableAmt = dj.byId("bg_available_amt");
			if(availableAmt && prodStatCode && (prodStatCode.get('value') === '01' || prodStatCode.get('value') === '10' || prodStatCode.get('value') === '06'))
			{
				availableAmt.set("readOnly", true);
				availableAmt.set("disabled", true);
			}
			
			else{
				availableAmt.set("readOnly", false);
				availableAmt.set("disabled", false);
			}
			
			
			if(dj.byId("claim_reference") && dj.byId("claim_present_date") && dj.byId("claim_amt") && dj.byId("claim_cur_code"))
			{
				if(dj.byId("prod_stat_code") && (dj.byId("prod_stat_code").get("value") === '84' || dj.byId("prod_stat_code").get("value") === '85'))
				{
					m.animate("fadeIn", d.byId("claimDetails"));
					dj.byId("claim_reference").set("required", true);
					dj.byId("claim_present_date").set("required", true);
					dj.byId("claim_amt").set("required", true);
					dj.byId("claim_cur_code").set("value", dj.byId("bg_cur_code").get("value"));
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
			
			m.populateGridOnLoad("bg");
			if(dj.byId("lead_bank_flag") && dj.byId("lead_bank_flag").get("value") === "Y")
			{
				m.toggleRequired("processing_bank_name", true);
				m.toggleRequired("processing_bank_address_line_1", true);
			}
			else
			{
				m.toggleRequired("processing_bank_name", false);
				m.toggleRequired("processing_bank_address_line_1", false);
				dijit.byId("dijit_layout_TabContainer_0").removeChild(dijit.byId("dijit_layout_ContentPane_2"));
			}
			if(dj.byId("extend_pay_date") && dj.byId("latest_date_reply"))
			{
				if(dj.byId("prod_stat_code") && (dj.byId("prod_stat_code").get("value") === "86"))
				{
					m.animate("fadeIn", d.byId("ExtendPay"));
					dj.byId("extend_pay_date").set("disabled", false);
					dj.byId("latest_date_reply").set("disabled", false);
				}
				else{
					m.animate("fadeOut", d.byId("ExtendPay"));
					dj.byId("extend_pay_date").set("disabled", true);
					dj.byId("latest_date_reply").set("disabled", true);
					dj.byId("extend_pay_date").set("value", null);
					dj.byId("latest_date_reply").set("value", null);
				}
			}
			
			m.setRenewalAmountOnFormLoad();
			if (dj.byId("tnx_type_code") && (dj.byId("tnx_type_code").get("value") === '15' || (dj.byId("tnx_type_code").get("value") === '13')) && (m._config.enable_to_edit_customer_details_bank_side == "false"))
			{
				dojo.style('transactionDetails', "display", "none");
			} else
			{
				if (m._config.enable_to_edit_customer_details_bank_side == "false")
				{
					dojo.style('transactionDetails', "display", "none");

					var transactionids = [ "iss_date_type_code", "exp_event",
							"reduction_clause", "exp_date_type_code", "exp_date",
							"exp_event,reduction_authorised", "reduction_authorised",
							"iss_date_type_details", "reduction_clause_other", "entity",
							"applicant_name", "applicant_address_line_1",
							"bg_type_details", "applicant_address_line_2",
							"applicant_dom", "applicant_country", "applicant_reference",
							"applicant_contact_number", "applicant_email",
							"business_line", "for_account", "alt_applicant_name",
							"alt_applicant_address_line_1",
							"alt_applicant_address_line_2", "issuing_bank_reference",
							"alt_applicant_dom", "alt_applicant_country",
							"beneficiary_name", "beneficiary_address_line_1",
							"beneficiary_address_line_2", "beneficiary_dom",
							"beneficiary_country", "beneficiary_reference",
							"beneficiary_contact_number", "beneficiary_email",
							"contact_name", "contact_address_line_1",
							"contact_address_line_2", "contact_dom", "contact_email",
							"contact_country", "contact_contact_number", "bg_liab_amt",
							"consortium", "consortium_details", "net_exposure_cur_code",
							"net_exposure_amt", "open_chrg_brn_by_code_1",
							"open_chrg_brn_by_code_2", "corr_chrg_brn_by_code_1",
							"corr_chrg_brn_by_code_2", "bg_release_flag", "renew_flag",
							"renew_on_code", "renewal_calendar_date", "renew_for_nb",
							"renew_for_period", "advise_renewal_flag",
							"rolling_renewal_flag", "rolling_renew_on_code",
							"rolling_renew_for_nb", "rolling_renew_for_period",
							"rolling_day_in_month", "rolling_renewal_nb",
							"rolling_cancellation_days", "renew_amt_code_1",
							"renew_amt_code_2", "projected_expiry_date",
							"final_expiry_date", "issuing_bank_type_code",
							"issuing_bank_name", "issuing_bank_address_line_1",
							"issuing_bank_address_line_2", "bg_type_code", "bg_rule",
							"bg_rule_other", "bg_text_type_code",
							"bg_text_type_details", "text_language",
							"text_language_other", "contract_ref", "contract_date",
							"contract_cur_code", "contract_amt", "contract_pct",
							"narrative_additional_instructions", "license_lookup",
							"bg_amt", "bg_liab_amt", "bg_cur_code",
							"advising_bank_name", "advising_bank_address_line_1",
							"advising_bank_address_line_2", "advising_bank_dom",
							"advising_bank_reference", "adv_bank_conf_req", "bg_available_amt" ];
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
		
		
		beforeSubmitValidations : function(){	
			
		 	 	
		 	 	
			var bgTextTypeCode = dj.byId("bg_text_type_code");
			var loadingBgTextTypeCode = d.byId("loading_bg_text_type_code");
			var loadingFlag = "00";
			if (loadingBgTextTypeCode && (loadingBgTextTypeCode.value === "02" || loadingBgTextTypeCode.value === "04") && loadingBgTextTypeCode.value === bgTextTypeCode.value)
			{
				loadingFlag = "11";
			}
			
			var subTnxTypeCode = dj.byId("sub_tnx_type_code") ? dj.byId("sub_tnx_type_code").get("value") : '';
			 if (loadingFlag === "00" && bgTextTypeCode && (bgTextTypeCode.value === "02" || bgTextTypeCode.value === "04"))
			 {
				 return m.checkForAttachments();
			 }
			 
			 if(subTnxTypeCode ==="05" && dj.byId("prod_stat_code") && dj.byId("prod_stat_code").get("value") !="01")
				{
				 var bgReleaseAmt = dj.byId("release_amt");
					var orgBGLiab = dj.byId("org_bg_liab_amt");
			
					var bgReleaseValue = dj.byId("release_amt") ? dj.byId("release_amt").get("value"):'';
					var orgBGLiabValue = dojo.number.parse(orgBGLiab.get("value")) || 0;
			
					console.debug("[misys.binding.trade.release_bg] Validating Release Amount, Value = ", bgReleaseValue);
					console.debug("[misys.binding.trade.release_bg] Original Amount, Value = ", orgBGLiabValue);
					console.debug("[misys.binding.trade.release_bg] Content of Error Message = ", m.getLocalization("releaseAmtGreaterThanOrgLiabAmtError"));

					if(bgReleaseAmt && orgBGLiab && (bgReleaseValue <= 0 || bgReleaseValue > orgBGLiabValue) && orgBGLiabValue != '0')
					{
						m._config.onSubmitErrorMsg = m.getLocalization("canNotReleaseTheTransaction");
						dj.byId("bg_liab_amt").set("value",orgBGLiabValue);
						return false;
					}
					else if(orgBGLiabValue === '0')
					{
						m._config.onSubmitErrorMsg = m.getLocalization("canNotProceedTheTransaction");
						dj.byId("bg_liab_amt").set("value",orgBGLiabValue);
						return false;
					}
				 }
			 if(dj.byId("tnx_type_code") && dj.byId("tnx_type_code").get("value") ==='03' && subTnxTypeCode != '05' && dj.byId("prod_stat_code") && dj.byId("prod_stat_code").get("value") !="01" && dijit.byId("prv_pod_stat_code") && dijit.byId("prv_pod_stat_code").get("value") === '06')
				{
					m._config.onSubmitErrorMsg = m.getLocalization("canNotProceedTheTransaction");
					dj.byId("bg_liab_amt").set("value",dojo.number.parse(dijit.byId("org_bg_liab_amt").get("value")));
					return false;
				}
			 if(!(_validateClaimAmt()))
			 {
				 return false;
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
				m.dialog.show("ERROR", m.getLocalization("claimDateGreaterThanCurrentDateError",[ claimDate.get("displayedValue"), currentDate.get("displayedValue") ]), '', function(){
					setTimeout(callback, 500);
				});
				return false;
     		 }
			 if(dj.byId("prod_stat_code") && dj.byId("prod_stat_code").get("value") === "84" && dj.byId("claim_amt") && dj.byId("claim_amt").get("value") !== "" && dj.byId("tnx_amt"))
			 {
				 dj.byId("tnx_amt").set("value", dj.byId("claim_amt").get("value"));
			 }
			 if(dj.byId("booking_amt") && !isNaN(dj.byId("booking_amt").get("value")) && dj.byId("limit_review_date") && dj.byId("facility_date"))
				{
					if(d.date.compare(dj.byId("limit_review_date").get("value"),new Date(),"date") < 0)
					{
						m._config.onSubmitErrorMsg  = m.getLocalization("amendLimitDateExpiry");
	         			return false;
					}
				}
		
			 if(dj.byId("bg_amt") && dj.byId("bg_liab_amt") && (dj.byId("bg_amt").get("value") < dj.byId("bg_liab_amt").get("value")))
				{
					m._config.onSubmitErrorMsg = m.getLocalization("canNotMoreThanTranAmt");
					dj.byId("bg_liab_amt").set("value", "");
					console.debug("Invalid Outstanding Amount.");
					return false;
				}
				if(dj.byId("bg_amt") && dj.byId("bg_available_amt") && (dj.byId("bg_amt").get("value") < dj.byId("bg_available_amt").get("value")))
				{
					m._config.onSubmitErrorMsg = m.getLocalization("AvailBGamtcanNotMoreThanTranAmt");
					dj.byId("bg_available_amt").set("value", "");
					console.debug("Invalid Available Amount.");
					return false;
			}
			return m.validateLSAmtSumAgainstTnxAmt("bg");			
		},
		validateMT777Fields : function(){
			var currentDate = dj.byId("current_date");
			var latestDateReply = dj.byId("latest_date_reply");
			var extendPayDate = dj.byId("extend_pay_date");
			var issDate = dj.byId("iss_date");
			var expDate = dj.byId("exp_date");
			if(latestDateReply && extendPayDate){
				if(currentDate && !m.compareDateFields(extendPayDate, currentDate)) 
	     		{
					 this.invalidMessage = m.getLocalization("dateOfExtendDatelessThanCurrentDate", [_localizeDisplayDate(extendPayDate)]);
					 return false;
	     		}else if(issDate && !m.compareDateFields(issDate, extendPayDate)){
	     			 this.invalidMessage = m.getLocalization("dateOfExtendDateGreaterThanIssueDate", [_localizeDisplayDate(extendPayDate), _localizeDisplayDate(issDate)]);
					 return false;
		    	 }
				
				if(currentDate && !m.compareDateFields(currentDate, latestDateReply)) {
					 this.invalidMessage = m.getLocalization("latestDateForReplyGreaterThanCurrentDate", [_localizeDisplayDate(latestDateReply)]);
					 return false;
	     		}else if(expDate && !m.compareDateFields(latestDateReply, expDate)) {
	     			 this.invalidMessage = m.getLocalization("latestDateForReplyLessThanExpiryDate", [_localizeDisplayDate(latestDateReply), _localizeDisplayDate(expDate)]);
					 return false;
	     		}
			}
			return true;
		}
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.bank.report_bg_client');