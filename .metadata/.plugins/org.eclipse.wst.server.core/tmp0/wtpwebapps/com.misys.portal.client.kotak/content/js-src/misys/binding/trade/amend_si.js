dojo.provide("misys.binding.trade.amend_si");

dojo.require("dijit.form.DateTextBox");
dojo.require("dijit.form.CurrencyTextBox");
dojo.require("dijit.form.NumberTextBox");
dojo.require("dijit.form.FilteringSelect");
dojo.require("misys.form.file");
dojo.require("misys.form.SimpleTextarea");
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
// d.require go here

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode
	
	// dojo.subscribe once a record is deleted from the grid
    var _deleteGridRecord = "deletegridrecord";

	d.mixin(m._config, {

		initReAuthParams : function() {
									
			var reAuthParams = {
				productCode : 'SI',	
				subProductCode : '',
				transactionTypeCode : "03",	
				entity :dj.byId("entity") ? dj.byId("entity").get("value") : "",
				currency : dj.byId("lc_cur_code")? dj.byId("lc_cur_code").get('value') : "",				
				amount : dj.byId("lc_amt") ? m.trimAmount(dj.byId("lc_amt").get('value')) : "",
								
				es_field1 : dj.byId("lc_amt")? m.trimAmount(dj.byId("lc_amt").get('value')) : "",
				es_field2 : ''				
			};
			return reAuthParams;
		}
	});
	
	// Private functions and variables go here

	function validateDecreaseAmount() 
	{
		if(dj.byId("org_lc_cur_code_liab_amt") && dj.byId("org_lc_cur_code_liab_amt").get("value") !== null && dj.byId("dec_amt") && dj.byId("dec_amt").get("value")!== null) {
			if(d.number.parse(dijit.byId("org_lc_cur_code_liab_amt").get("value")) < dijit.byId("dec_amt").get("value")) {
				var lcLiabCurCodeValue = dj.byId("lc_cur_code").get("value");
				var lcLiabAmtValue = dojo.number.parse(dj.byId("org_lc_cur_code_liab_amt").get("value"));
				dj.byId("dec_amt").invalidMessage = m.getLocalization("decAmountLessThanOutstandingAmt",[ lcLiabCurCodeValue, lcLiabAmtValue.toFixed(2) ]);
				misys.dialog.show("ERROR", dj.byId("dec_amt").invalidMessage, "", function(){
					dj.byId("dec_amt").focus();
					dj.byId("dec_amt").set("state","Error");
				});
				return false;
			}
			else if(d.number.parse(dijit.byId("org_lc_amt").get("value")) < dijit.byId("dec_amt").get("value"))
				{
				dijit.byId("dec_amt").invalidMessage = m.getLocalization("decreaseAmountShouldBeLessThanLCAmount");
				misys.dialog.show("ERROR", dj.byId("dec_amt").invalidMessage, "", function(){
					dj.byId("dec_amt").focus();
					dj.byId("dec_amt").set("state","Error");
				});
				return false;
				}
			return true;
		}
	}
	
	// Public functions & variables follow
	d.mixin(m, {

		bind : function() {
			m.setValidation("exp_date", m.validateTradeExpiryDate);
			m.setValidation("amd_date", m.validateAmendmentDate);
			m.connect("inc_amt", "onBlur", function(){
				m.validateAmendAmount(true, this, "si");
			}); 
			m.connect("dec_amt", "onBlur", function(){
				validateDecreaseAmount();
				m.validateAmendAmount(true, this, "si");
			}); 
			m.setValidation("pstv_tol_pct", m.validateTolerance);
			m.setValidation("neg_tol_pct", m.validateTolerance);
			m.setValidation("max_cr_desc_code", m.validateMaxCreditTerm);
			m.setValidation("last_ship_date", m.validateLastShipmentDate);
			m.setValidation("renew_for_nb", m.validateRenewFor);
			m.setValidation("advise_renewal_days_nb", m.validateDaysNotice);
			m.setValidation("rolling_renewal_nb", m.validateNumberOfRenewals);
			m.setValidation("rolling_cancellation_days", m.validateCancellationNotice);
			//m.setValidation("final_expiry_date",m.validateTradeFinalExpiryDate);
			m.setValidation("renewal_calendar_date",m.validateRenewalCalendarDate);
			
			m.connect("inc_amt", "onBlur", m.amendTransaction);
			m.connect("dec_amt", "onBlur", m.amendTransaction);
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
			//Set renewal final expiry date
			/*m.connect("rolling_renewal_nb","onChange", m.setRenewalFinalExpiryDate);
			m.connect("renew_on_code","onChange", m.setRenewalFinalExpiryDate);
			m.connect("renewal_calendar_date","onChange", m.setRenewalFinalExpiryDate);
			m.connect("renew_on_code","onChange",m.validateRenewalCalendarDate);
			m.connect("renew_for_nb","onChange", m.setRenewalFinalExpiryDate);
			m.connect("renew_for_period","onChange", m.setRenewalFinalExpiryDate);
			m.connect("exp_date","onChange", m.setRenewalFinalExpiryDate);
			m.connect("rolling_renew_on_code","onChange", m.setRenewalFinalExpiryDate);
			m.connect("rolling_renew_for_nb","onChange", m.setRenewalFinalExpiryDate);
			m.connect("rolling_renew_for_period","onChange", m.setRenewalFinalExpiryDate);*/
			
			m.connect("product_type_code","onChange",function(){
				if(dj.byId("product_type_code").get("value")!== "99"){
					d.style("product_type_details_row","display","none");
				}
				else {
					d.style("product_type_details_row","display","block");
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
			m.connect("final_expiry_date", "onChange", function(){
				var expDate = dj.byId("exp_date");
				var projectedExp = dj.byId("projected_expiry_date");
				var hideTT = function() {
					dj.hideTooltip(dj.byId("final_expiry_date").domNode);
				};
				var finalExpDtVal = this.get("displayedValue");
				if(expDate && !m.compareDateFields(expDate, this))
				{
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
			m.connect("renew_on_code", "onChange", function(){
				m.toggleFields(
						this.get("value") === "02", 
						null,
						["renewal_calendar_date"]);
			});
			if(m._config.release_flag){
			m.connect("lc_release_flag", "onClick", m.toggleAmendmentFields);
			}
			m.connect("narrative_shipment_period", "onChange", function(){
				m.toggleDependentFields(this, dj.byId("last_ship_date"),
						m.getLocalization("shipmentDateOrPeriodExclusivityError"));
			});
			m.connect("narrative_shipment_period", "onClick", function(){
				m.toggleDependentFields(this, dj.byId("last_ship_date"),
						m.getLocalization("shipmentDateOrPeriodExclusivityError"));
			});
			m.connect("last_ship_date", "onChange", function(){
				m.toggleDependentFields(this, dj.byId("narrative_shipment_period"),
						m.getLocalization("shipmentDateOrPeriodExclusivityError"));
			});
			m.connect("last_ship_date", "onClick", function(){
				m.toggleDependentFields(this, dj.byId("narrative_shipment_period"),
						m.getLocalization("shipmentDateOrPeriodExclusivityError"));
			});
			
			//Set 
			m.connect("renew_amt_code_1","onClick",  function(){
				m.setRenewalAmount(this);
				});
			m.connect("renew_amt_code_2","onClick",  function(){
				m.setRenewalAmount(this);
				});
			m.connect("rolling_renewal_nb","onBlur", m.calculateRenewalFinalExpiryDate);
			m.connect("renew_on_code","onBlur", m.calculateRenewalFinalExpiryDate);
			m.connect("renewal_calendar_date","onBlur", m.calculateRenewalFinalExpiryDate);
			m.connect("renew_for_nb","onBlur", m.calculateRenewalFinalExpiryDate);
			m.connect("renew_for_period","onBlur", m.calculateRenewalFinalExpiryDate);
			m.connect("rolling_renew_on_code","onChange", m.calculateRenewalFinalExpiryDate);
			m.connect("rolling_renew_for_nb","onChange", m.calculateRenewalFinalExpiryDate);
			m.connect("rolling_renew_for_period","onChange", m.calculateRenewalFinalExpiryDate); 
			
			
			
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
			
			var issuingBankAbbvName = dj.byId("issuing_bank_abbv_name").get("value");
			var isMT798Enable = m._config.customerBanksMT798Channel[issuingBankAbbvName] === true && dj.byId("adv_send_mode").get("value") === "01";
			// setting product code to LC for amt validations.
			m._config.productCode = "lc";
			// set final expiry date 
			//m.setRenewalFinalExpiryDate();
			console.debug("[amend_si] productCode>> ", m._config.productCode.toLowerCase());
			// Set currency on amount fields
			m.setCurrency(dj.byId("lc_cur_code"), [
						"inc_amt", "dec_amt", "org_lc_amt", "lc_amt"]);
			if(isMT798Enable)
			{
				m.toggleRequired("amd_details", true);
				if(dj.byId("delivery_channel").get("value") === "")
				{
					m.animate("fadeIn", d.byId("delivery_channel_row"));
					dj.byId("delivery_channel").set("disabled", true);
				}
				else
				{
					m.animate("fadeIn", d.byId("delivery_channel_row"));
				}
				// MT798 File Act attachment selection service
				if (dj.byId("delivery_channel")){
					var mainBankAbbvName = dj.byId("issuing_bank_abbv_name") ? dj.byId("issuing_bank_abbv_name").get("value") : "";
					if(!m.hasAttachments())
					{
						dj.byId("delivery_channel").set("disabled", true);
						dj.byId("delivery_channel").set("value", null);
					}
					else
						{
							m.toggleFields(m._config.customerBanksMT798Channel[mainBankAbbvName] === true && m.hasAttachments(), null, ["delivery_channel"], false, false);
						}
					m.animate("fadeIn", "delivery_channel_row");
					m.connect("delivery_channel", "onChange",  function(){
						if(dj.byId('attachment-file'))
						{
							if(dj.byId("delivery_channel").get('value') === 'FACT')
							{
								dj.byId('attachment-file').displayFileAct(true);
							}
							else
							{
								dj.byId('attachment-file').displayFileAct(false);
							}
						}
					});
					dj.byId("delivery_channel").onChange();
				}
			}
			else
			{
				m.animate("fadeOut", d.byId("delivery_channel_row"));
			}	
			
			if(m._config.release_flag){
				m.animate("fadeOut", d.byId("lc_release_flag_row"));
			}
			// Show an input field when Issued Stand by LC type "Other" is selected
			var standByLCType = dj.byId("product_type_code");
			if(standByLCType && standByLCType.get("value") !== "99"){
				d.style("product_type_details_row","display","none");
			}
			
			var renewFlag = dj.byId("renew_flag");
			if(renewFlag) {
			 d.hitch(renewFlag, m.toggleRenewalDetails, true)();
			}
			if(dj.byId("provisional_status")) {
				d.style("provisional_status_row","display","none");
			}
			var renewOnCode = dj.byId("renew_on_code");
			if(renewOnCode) {
				m.toggleFields(
						renewOnCode.get("value") === "02", 
						null, ["renewal_calendar_date"],true);
			}
			
			var adviseRenewalFlag = dj.byId("advise_renewal_flag");
			if(adviseRenewalFlag) {
				m.toggleFields(adviseRenewalFlag.get("checked"), null,
						["advise_renewal_days_nb"], true);
			}
			
			var rollingFlag = dj.byId("rolling_renewal_flag");
			if(rollingFlag) {
				m.toggleFields(rollingFlag.get("checked"),
						null, ["rolling_renewal_nb", "rolling_cancellation_days", "rolling_renew_on_code"], true);
			}
			
			var rollingRenewOnCode = dj.byId("rolling_renew_on_code");
			if(rollingRenewOnCode) {
				m.toggleFields(rollingRenewOnCode.get("value") === "03",
						["rolling_day_in_month"], ["rolling_renew_for_nb"], true);
			}
			 var handle = dojo.subscribe(_deleteGridRecord, function(){
				 m.toggleFields(m._config.customerBanksMT798Channel[issuingBankAbbvName] === true && m.hasAttachments(), null, ["delivery_channel"], false, false);
			 });
			
		 	if(dj.byId("inc_amt") && !isNaN(dj.byId("inc_amt").get("value")))
			{
				dj.byId("inc_amt").onBlur();
			}
			else if(dj.byId("dec_amt") && !isNaN(dj.byId("dec_amt").get("value")))
			{
				dj.byId("dec_amt").onBlur();
			}
		 	//Radio field template is reading values from all nodes in the input xml.
            // For ones with multiple transactions, (ex:  create, approve, amend, approve.) the tag values from the root node is not being picked, because of radio-value = //*name in form-templates.
            // To overcome this we are overriding "value" and "checked" params from js.
		 	m.setRenewalAmountOnFormLoad();
		},
		
		/**
		 * <h4>Summary:</h4>  Before save validation method.
		 * <h4>Description</h4> : This method is called before saving a transaction.
		 * Any before save validation can be added in this method for SI. 
		 *
		 * @method beforeSaveValidations
		 */
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
			
			
		},

		beforeSubmitValidations : function() {
			var fieldsToCheck = ["exp_date", "org_exp_date", "pstv_tol_pct",
			         			"org_pstv_tol_pct", "neg_tol_pct", "org_neg_tol_pct", "ship_from", "ship_loading",
			         			"ship_discharge", "ship_to", "last_ship_date", "narrative_shipment_period", 
			         			"narrative_additional_amount", "org_narrative_additional_amount",
			         			"inc_amt", "dec_amt", "amd_details", "file"];

			 // Check that all fields are present.
         	var allFieldsPresent = d.every(fieldsToCheck, function(id){
         		if(d.byId(id)){
         			return true;
         		}
         		return false;
         	});

         	if(allFieldsPresent){
         		// Strip CRLF from textarea values.
         		var strShipmentPeriod = 
         			m.trim(dj.byId("narrative_shipment_period").get("value"));
         		var strOrgShipmentPeriod = 
         			m.trim(dj.byId("org_narrative_shipment_period").get("value"));
         		var strAdditionalAmount = 
         			m.trim(dj.byId("narrative_additional_amount").get("value"));
         		var strOrgAdditionalAmount = 
         			m.trim(dj.byId("org_narrative_additional_amount").get("value"));

         		// Check non-date values against their org_ values
         		var fieldsToCheckAgainstOrg = [
         				"pstv_tol_pct", "neg_tol_pct", "ship_from",
         				"ship_loading", "ship_discharge", "ship_to"];
         		var allFieldsMatch = d.every(fieldsToCheckAgainstOrg, function(id){
         			var value = dj.byId(id).get("value") + "";
         			var orgValue = dj.byId("org_" + id).get("value") + "";
         			
         			// For number fields, or other invalid fields, map to an empty string
         			if(value == "NaN" || value == "null" || value == "undefined")
         			{
         				value = "";
         			}

         			if(value == orgValue){
         				return true;
         			}
         			return false;
         		});

         		// Check date values against their org_ values
         		var dateFieldsToCheckAgainstOrg = ["exp_date", "last_ship_date"];
         		var allDateFieldsMatch = d.every(dateFieldsToCheckAgainstOrg, function(id){
         				// org date is a hidden field, so will be in MM/DD/YY
         				// We need to get a localized string back to do a compare
         				var value = dj.byId(id).get("value") + "";
         				var orgValue = d.date.locale.parse(
         						dj.byId("org_" + id).get("displayedValue"), {
         					selector : "date",
         					datePattern : m.getLocalization("g_strGlobalDateFormat")
         				}) + "";

         				
         				if(value == orgValue){
         					return true;
         				}
         				return false;
         			});

         		// See if a file has been attached
         		var hasAttachedFile = (d.query("#edit [id^='file_row_']").length > 1);
         		
         		// Check textarea and remaining fields
         		if(allFieldsMatch && allDateFieldsMatch && !hasAttachedFile && 
         				(strShipmentPeriod == strOrgShipmentPeriod) &&
         				(strAdditionalAmount == strOrgAdditionalAmount) &&
         				!dj.byId("inc_amt").get("value") &&
         				!dj.byId("dec_amt").get("value") &&
         				(dj.byId("amd_details").get("value") === "")){
         			m._config.onSubmitErrorMsg = m.getLocalization("noAmendmentError");
         			return false;
         		}
         	}  
         	
         	var amdDate = dj.byId("amd_date");
        	//Check if previous expiry date is less than amendment date in case new expiry date is not set, return false
         	if(dj.byId("exp_date") && dj.byId("exp_date").get("value")=== null)
         	{
         		var prevExpDate = dj.byId("org_exp_date");
         		if(!m.compareDateFields(amdDate, prevExpDate)) 
         		{
         			m._config.onSubmitErrorMsg  = m.getLocalization("amdDateGreaterThanOldExpiryDate",[ amdDate.get("displayedValue"), prevExpDate.get("displayedValue") ]);
         			return false;
         		}
         	}
         	
         	//Check if previous shipment date is less than amendment date in case new shipment date is not set, return false
         	var shipDate=(dj.byId("last_ship_date") && dj.byId("last_ship_date").get("value")!== null)?dj.byId("last_ship_date"):dj.byId("org_last_ship_date");
     		if(!m.compareDateFields(amdDate, shipDate)) 
     		{
     			m._config.onSubmitErrorMsg  = m.getLocalization("amdDateGreaterThanOldShipmentDate",[ amdDate.get("displayedValue"), shipDate.get("displayedValue") ]);
      			return false;
     		}
         		
         	//Check if Expiry date is less than shipment date in case new shipment date is not set, return false
             var expDate = dj.byId("exp_date");
             if(expDate && expDate.get("value") !== null)
             {
            	if(!m.compareDateFields(shipDate, expDate))
            	{
             		m._config.onSubmitErrorMsg  = m.getLocalization("OldShipmentDateGreaterThanexpDate",[ shipDate.get("displayedValue"), expDate.get("displayedValue") ]);
    	      		return false;
             	}	
             }
			var projectedExp = dj.byId("projected_expiry_date");
			var finalExp = dj.byId("final_expiry_date");
			if(finalExp)
			{
				if(expDate && !m.compareDateFields(expDate, finalExp))
				{
					m._config.onSubmitErrorMsg = m.getLocalization('finalExpDateLessThanTransactionExpDtError',[ finalExp.get("displayedValue"), expDate.get("displayedValue") ]);
					m.showTooltip(m.getLocalization('finalExpDateLessThanTransactionExpDtError',[ finalExp.get("displayedValue"), expDate.get("displayedValue") ]), finalExp.domNode);
					finalExp.focus();
					return false;
				}
				else if(projectedExp && !m.compareDateFields(projectedExp, finalExp))
				{
					m._config.onSubmitErrorMsg = m.getLocalization('finalExpDateLessThanProjectedExpDtError',[ finalExp.get("displayedValue"), projectedExp.get("displayedValue") ]);
					m.showTooltip(m.getLocalization('finalExpDateLessThanProjectedExpDtError',[ finalExp.get("displayedValue"), projectedExp.get("displayedValue") ]), finalExp.domNode);
					finalExp.focus();
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
			
					
			
			if(dj.byId("pstv_tol_pct") && dj.byId('org_pstv_tol_pct') && dijit.byId("max_cr_desc_code").get('value') === "" && dijit.byId("org_pstv_tol_pct").get('value') !== "" && isNaN(dijit.byId("pstv_tol_pct").get('value'))){
				
				dj.byId("pstv_tol_pct").set("value",dj.byId('org_pstv_tol_pct').get('value'));
			}
			if(dj.byId("neg_tol_pct") && dj.byId('org_neg_tol_pct') && dijit.byId("max_cr_desc_code").get('value') === "" && dijit.byId("org_neg_tol_pct").get('value') !== "" && isNaN(dijit.byId("neg_tol_pct").get('value'))){
				
				dj.byId("neg_tol_pct").set("value",dj.byId('org_neg_tol_pct').get('value'));
			}
			if(dj.byId("ship_to") && dj.byId('org_ship_to') && dj.byId('org_ship_to').get('value') !== "" && dijit.byId("ship_to").get('value')===""){
				
				dj.byId("ship_to").set("value",dj.byId('org_ship_to').get('value'));
			}
			if(dj.byId("ship_from") && dj.byId('org_ship_from') && dj.byId('org_ship_from').get('value') !== "" && dijit.byId("ship_from").get('value')===""){
					
					dj.byId("ship_from").set("value",dj.byId('org_ship_from').get('value'));
			}
			if(dj.byId("ship_discharge") && dj.byId('org_ship_discharge') && dj.byId('org_ship_discharge').get('value') !== "" && dijit.byId("ship_discharge").get('value') ===""){
				
				dj.byId("ship_discharge").set("value",dj.byId('org_ship_discharge').get('value'));
			}
			if(dj.byId("ship_loading") && dj.byId('org_ship_loading') && dj.byId('org_ship_loading').get('value') !== "" && dijit.byId("ship_loading").get('value') ===""){
				
				dj.byId("ship_loading").set("value",dj.byId('org_ship_loading').get('value'));
			}
			
			if(dj.byId("last_ship_date") && dj.byId('org_last_ship_date') && dj.byId('org_last_ship_date').get('value') !== "" && dijit.byId("last_ship_date").get('value') == null){
				
				dj.byId("last_ship_date").set("value",dj.byId('org_last_ship_date').get('value'));
			}
			if(dj.byId("narrative_shipment_period") && dj.byId('org_narrative_shipment_period') && dj.byId('org_narrative_shipment_period').get('value') !== "" &&  dijit.byId("narrative_shipment_period").get('value') ===""){

				dj.byId("narrative_shipment_period").set("value",dj.byId('org_narrative_shipment_period').get('value'));
			}
		
         	return true;
		},
		
		beforeSubmit : function() {
			m.updateSubTnxTypeCode("lc");
		}
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.trade.amend_si_client');