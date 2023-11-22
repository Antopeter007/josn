dojo.provide("misys.binding.trade.amend_bg");

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
dojo.require("dijit.form.DateTextBox");
dojo.require("misys.form.CurrencyTextBox");
dojo.require("dijit.form.FilteringSelect");
dojo.require("misys.form.SimpleTextarea");
dojo.require("misys.widget.Collaboration");
dojo.require("misys.binding.trade.ls_common");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode
	
	// Private functions and variables go here

	// Public functions & variables follow
	
	// dojo.subscribe once a record is deleted from the grid
    var _deleteGridRecord = "deletegridrecord";
    m._config = m._config || {};
    m._config.expDate = m._config.expDate || {};
    m._config.beneficiary = m._config.beneficiary || {	name : "",
		addressLine1 : "",
		addressLine2 : "",
		dom : ""
	  };
	m._config.renewFlag = m._config.renewFlag || {};
	
	d.mixin(m._config, {

		initReAuthParams : function() {
									
			var reAuthParams = {
				productCode : 'BG',	
				subProductCode : '',
				transactionTypeCode : '03',	
				entity : dj.byId("entity") ? dj.byId("entity").get("value") : '',
				currency : dj.byId("bg_cur_code")? dj.byId("bg_cur_code").get("value") : "",				
				amount : dj.byId("bg_amt")? m.trimAmount(dj.byId("bg_amt").get("value")) : "",
				
				es_field1 : '',
				es_field2 : ''				
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
	// Private functions and variables go here

	function validateDecreaseAmount() 
	{
		if(dj.byId("org_bg_liab_amt") && dj.byId("org_bg_liab_amt").get("value") !== null && dj.byId("dec_amt") && dj.byId("dec_amt").get("value")!== null) {
			if(d.number.parse(dijit.byId("org_bg_liab_amt").get("value")) < dijit.byId("dec_amt").get("value")) {
				var bgLiabCurCodeValue = dj.byId("bg_cur_code").get("value");
				var bgLiabAmtValue = dojo.number.parse(dj.byId("org_bg_liab_amt").get("value"));
				dj.byId("dec_amt").invalidMessage = m.getLocalization("decAmountLessThanOutstandingAmt",[ bgLiabCurCodeValue, bgLiabAmtValue.toFixed(2) ]);
				misys.dialog.show("ERROR", dj.byId("dec_amt").invalidMessage, "", function(){
					dj.byId("dec_amt").focus();
					dj.byId("dec_amt").set("state","Error");
				});
				return false;
			}
			return true;
		}
	}
	
	function facilityAmend()
	{
		var facilityDetailsDivId 	= d.byId("facilityLimitDetail");
		if(!isNaN(this.get("value")) && facilityDetailsDivId) 
		{
			m.animate("wipeIn",facilityDetailsDivId);
			if(this.id === "inc_amt")
			{
				setFacilityBookingAmountAmend(this);
				m.toggleFields(
						false, null,
						["limit_id", "booking_amt","facility_id"], true, false);
				m.toggleFields(
						true, null,
						[ "booking_amt"], true, false);
			}
			else
			{
				if(dj.byId("orginal_facility_id") && dj.byId("orginal_limit_id") && dj.byId("facility_id") && dj.byId("limit_id"))
				{
					dj.byId("facility_id").set("value",dj.byId("orginal_facility_id").get("value"));
					dj.byId("limit_id").set("value",dj.byId("orginal_limit_id").get("value"));
				}
				setFacilityBookingAmountAmend(this);
				m.toggleFields(
						false, null,
						["limit_id", "booking_amt","facility_id"], true, false);
			}
			m.toggleFields(
					true, null,
					["limit_id", "booking_amt","facility_id","booking_cur_code"], true, true);
		}
		else if(facilityDetailsDivId)
		{
			m.animate("wipeOut",facilityDetailsDivId);
			m.toggleFields(
					false, null,
					["limit_id", "booking_amt","facility_id","booking_cur_code"], true, false);
		}
	}
	function setFacilityBookingAmountAmend(tnxWidget)
	{
		var tnxCurrencyWidget 	= dj.byId("bg_cur_code"),
		limitCurrencyWidget 		= dj.byId("limit_outstanding_cur_code"),
		limitAmtWidget		= dj.byId("limit_outstanding_amount"),
		facilityCurrencyWidget		= dj.byId("facility_outstanding_cur_code"),
		facilityAmtWidget 	= dj.byId("facility_outstanding_amount"),
		bookingAmountWidget 		= dj.byId("booking_amt"),
		requestCurrency = "";
		if(tnxWidget && tnxWidget.id === "inc_amt" && bookingAmountWidget)
		{
			bookingAmountWidget.set("displayedValue","");
		}
		if(tnxCurrencyWidget && limitCurrencyWidget && limitAmtWidget && facilityCurrencyWidget && facilityAmtWidget && bookingAmountWidget)
		{
			 var limitAmt		= limitAmtWidget.get("value"),
				facilityAmt		= facilityAmtWidget.get("value"),
				limitCurrency	= limitCurrencyWidget.get("value"),
				tnxCurrency		= tnxCurrencyWidget.get("value"),
				facilityCurrency = 	facilityCurrencyWidget.get("value"),
				bookingAmount 	= bookingAmountWidget.get("value"),
				isValid			= true,
				trasactionAmt	= tnxWidget ? tnxWidget.get("value") : "",
				errorMessage	= "";
			//If cross currency get mid rates and validate
			if(limitCurrency !== "" && tnxCurrency !== "" && facilityCurrency !== "" && limitCurrency !== "")
			{
				if(limitCurrency !== tnxCurrency)
				{
					requestCurrency = tnxCurrency+"_"+limitCurrency+"_limit,";
				}
				if(facilityCurrency !== limitCurrency)
				{
					requestCurrency = requestCurrency+facilityCurrency+"_"+limitCurrency+"_facility";
				}
				if(requestCurrency+"S" !== "S")
				{
					m.getCurrencyRateForFacility(requestCurrency);
					if(!tnxWidget || tnxWidget.id === "inc_amt")
					{
						if(m._config.limitRate && trasactionAmt !== "")
						{
							bookingAmount = trasactionAmt*m._config.limitRate;
						}
						bookingAmountWidget.attr("value",bookingAmount,false);
						if(bookingAmount > limitAmt)
						{
							isValid = false;
							if(m._config.limitRate !== 1)
							{
								errorMessage = m.getLocalization("invalidBookingAmountCurrency", ["Limit",tnxCurrency+"/"+limitCurrency]);
							}
							else
							{
								if(m._config.limitRate !== 1)
								{
									errorMessage = m.getLocalization("invalidBookingAmountCurrency", ["Facility",facilityCurrency+"/"+limitCurrency]);
								}
								else
								{
									errorMessage = m.getLocalization("invalidBookingAmount", ["Limit"]);
								}
							}
						}
						if( isValid && bookingAmount > facilityAmt*m._config.facilityRate)
						{
							isValid = false;
							errorMessage = m.getLocalization("invalidBookingAmountCurrency", ["Facility",facilityCurrency+"/"+limitCurrency]);
						}
					}
					else
					{
						if(m._config.limitRate && trasactionAmt !== "")
						{
							bookingAmount = trasactionAmt*m._config.limitRate;
						}
						bookingAmountWidget.attr("value",bookingAmount,false);
					}
				}
				else
				{
					if(trasactionAmt !== "")
					{
						bookingAmount = trasactionAmt;
					}
					bookingAmountWidget.attr("value",bookingAmount,false);
					if(!tnxWidget || tnxWidget.id === "inc_amt")
					{
						if(bookingAmount > limitAmt)
						{
							isValid = false;
							errorMessage = m.getLocalization("invalidBookingAmount", ["Limit"]);
						}
						if(isValid && bookingAmount > facilityAmt)
						{
							isValid = false;
							errorMessage = m.getLocalization("invalidBookingAmount", ["Facility"]);
						}
					}
				}
			}
			if(!isValid)
			{
				if(tnxWidget)
				{
					bookingAmountWidget.focus();
				}
				
				bookingAmountWidget.set("state","Error");
				dj.hideTooltip(bookingAmountWidget.domNode);
				dj.showTooltip(errorMessage, bookingAmountWidget.domNode, 100);
			}
			
		}
	}
		
	d.mixin(m, {

		bind : function() {
			m.setValidation("tender_expiry_date", m.validateTenderExpiryDate);
			m.setValidation("contract_date", m.validateContractDate);
			m.setValidation("contract_cur_code", m.validateCurrency);
			m.setValidation("contract_pct", m.checkContractPercent);
			m.setValidation("exp_date", m.validateTradeExpiryDate);
			m.connect("inc_amt", "onBlur", function(){
				m.validateAmendAmount(true, this, "bg");
			}); 
			m.connect("dec_amt", "onBlur", function(){
				validateDecreaseAmount();
				m.validateAmendAmount(true, this, "bg");
			}); 
			m.setValidation("renew_for_nb", m.validateRenewFor);
			m.setValidation("advise_renewal_days_nb", m.validateDaysNotice);
			m.setValidation("rolling_renewal_nb", m.validateNumberOfRenewals);
			m.setValidation("rolling_cancellation_days", m.validateCancellationNotice);
		//	m.setValidation("final_expiry_date",m.validateTradeFinalExpiryDate);
			//m.connect("bg_release_flag", "onClick", m.toggleAmendmentFields);
			m.connect("inc_amt", "onBlur", m.amendTransaction);
			m.connect("inc_amt", "onBlur", facilityAmend);
			m.setValidation("amd_date", m.validateBGAmendmentDate);
			m.setValidation("exp_date",m.validateAmendBGTradeExpiryDate);
			m.connect("renewal_calendar_date", "onChange", m.validateAmendBGRenewalCalendarDate);
			m.connect("exp_date","onChange", m.calculateRenewalFinalExpiryDate);
			m.connect("rolling_renewal_nb","onBlur", m.calculateRenewalFinalExpiryDate);
			m.connect("renew_on_code","onBlur", m.calculateRenewalFinalExpiryDate);
			m.connect("renewal_calendar_date","onBlur", m.calculateRenewalFinalExpiryDate);
			m.connect("renew_for_nb","onBlur", m.calculateRenewalFinalExpiryDate);
			m.connect("renew_for_period","onBlur", m.calculateRenewalFinalExpiryDate);
			m.connect("rolling_renew_on_code","onChange", m.calculateRenewalFinalExpiryDate);
			m.connect("rolling_renew_for_nb","onChange", m.calculateRenewalFinalExpiryDate);
			m.connect("rolling_renew_for_period","onChange", m.calculateRenewalFinalExpiryDate); 
			m.connect("limit_id", "onChange",m.setLimitFieldsValue);
			m.connect("booking_amt", "onBlur", function()
					{
						setFacilityBookingAmountAmend();
					});
			m.connect("facility_id", "onChange", function()
					{
						m.getLimitDetails(true);
						if(dj.byId("booking_amt"))
						{
							dj.byId("booking_amt").set("displayedValue","");
						}
			});
			m.connect("limit_id", "onChange", function()
			{
				if(dj.byId("inc_amt") && !isNaN(dj.byId("inc_amt").get("value")))
				{
					setFacilityBookingAmountAmend(dj.byId("inc_amt"));
				}
				else if(dj.byId("dec_amt") && !isNaN(dj.byId("dec_amt").get("value")))
				{
					setFacilityBookingAmountAmend(dj.byId("dec_amt"));
							
				}
			});

			/*m.connect("inc_amt", "onBlur", function(){
				m.toggleFields(this.get("value"), null, ["amd_details"]);	
			});*/
			m.connect("dec_amt", "onBlur", m.amendTransaction);
			m.connect("dec_amt", "onBlur", facilityAmend);
			
			/*m.connect("dec_amt", "onBlur", function(){
				m.toggleFields(this.get("value"), null, ["amd_details"]);
			});*/
			m.connect("final_expiry_date", "onBlur", function(){
				if(dj.byId("adv_send_mode").get("value") == "01")
				{  
					var calculatedFinalExpDate = m.calculateFinalExpiryDate();
					var onOkCallback = function(){
		              m.calculateRenewalFinalExpiryDate();
					};
				   if(calculatedFinalExpDate != undefined && dj.byId("final_expiry_date") && dj.byId("final_expiry_date").get("value")!== null && dj.byId("final_expiry_date").get("value").getTime() !== calculatedFinalExpDate.getTime())
				   {
					   var calcFinalExpDate = dojo.date.locale.format(new Date(calculatedFinalExpDate.getTime()), {selector:"date", formatLength:"short", locale:dojo.config.locale, datePattern : m.getLocalization("g_strGlobalDateFormat")});
					   m.dialog.show("DATE-CONFLICT",  m.getLocalization("confirmResetFinalExpDate", [calcFinalExpDate]), "", "", "", "", onOkCallback, "", "");
				   }
				}
			});
			
			m.connect("adv_send_mode", "onChange", function(){
				m.toggleMT798Fields("recipient_bank_abbv_name");
				if(dj.byId("adv_send_mode").get("value") == "01")
				{
					m.toggleRequired("amd_details", true);
					// reset the final expiry date if its changed manually in case of deliver mode as SWIFT (MPS-58505)
					var calculatedRenewalFinalExpDate = m.calculateFinalExpiryDate();
					var okCallback = function(){
		              m.calculateRenewalFinalExpiryDate();
					};
				   if(calculatedRenewalFinalExpDate != undefined && dj.byId("final_expiry_date") && dj.byId("final_expiry_date").get("value") !== null && dj.byId("final_expiry_date").get("value").getTime() !== calculatedRenewalFinalExpDate.getTime())
				   {
					   var calcRenFinalExpDate = dojo.date.locale.format(new Date(calculatedRenewalFinalExpDate.getTime()), {selector:"date", formatLength:"short", locale:dojo.config.locale, datePattern : m.getLocalization("g_strGlobalDateFormat")});
					   m.dialog.show("DATE-CONFLICT",  m.getLocalization("confirmResetFinalExpDate", [calcRenFinalExpDate]), "", "", "", "", okCallback, "", "");
				   }
				}
				else
				{
					m.toggleRequired("amd_details", false);
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
			
			m.connect("renew_on_code","onChange",m.validateRenewalCalendarDate);
		//	m.connect("renew_on_code","onChange", m.setRenewalFinalExpiryDate);
			//Set renewal final expiry date
		/*	m.connect("rolling_renewal_nb","onChange", m.setRenewalFinalExpiryDate);
			m.connect("renew_on_code","onChange", m.setRenewalFinalExpiryDate);
			
			m.connect("renewal_calendar_date","onChange", m.setRenewalFinalExpiryDate);
			m.connect("renew_for_nb","onChange", m.setRenewalFinalExpiryDate);
			m.connect("renew_for_period","onChange", m.setRenewalFinalExpiryDate);
			m.connect("exp_date","onChange", m.setRenewalFinalExpiryDate); */
			m.connect("renew_on_code", "onChange", function(){
				m.toggleFields(
						this.get("value") === "02", 
						null,
						["renewal_calendar_date"]);
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
			
			m.connect("license_lookup","onClick", function(){
				m.getLicenses("bg");
			});
			m.connect("exp_date", "onChange", function(){
				m.clearLicenseGrid(this, m._config.expDate);
			});
			m.connect("beneficiary_name", "onChange", function(){
				m.clearLicenseGrid(this, m._config.beneficiary);
			});
			
			m.connect("renew_flag", "onChange", function(){
				m.clearLicenseGrid(this, m._config.renewFlag);
			});
			//Set 
			m.connect("renew_amt_code_1","onClick",  function(){
				m.setRenewalAmount(this);
				});
			m.connect("renew_amt_code_2","onClick",  function(){
				m.setRenewalAmount(this);
			});
			
			m.connect("contract_cur_code", "onChange", function(){
				m.setCurrency(dj.byId("contract_cur_code"), ["contract_amt"]);
			});
			
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
			m.connect("exp_date_type_code", "onChange", function(){
				if(this.get("value") != "")
					{
					m.toggleFields((this.get("value") != "01"), null, ["exp_date"]);
					m.toggleFields((this.get("value") != "02"), null, ["exp_event"]);
					}
				else
					{
					m.toggleFields((false), null, ["exp_date","exp_event"],null,["exp_date","exp_event"]);
					}
				
				
				});
			m.connect("beneficiary_address_line_4", "onFocus", function(){
				m.showTooltip(m.getLocalization('addressLine4ToolTip', 
						[dj.byId("beneficiary_address_line_4").get("displayedValue"), dj.byId("beneficiary_address_line_4").get("value") ]), d.byId("beneficiary_address_line_4"), [ 'right' ],5000);
			});			
		},

		onFormLoad : function() {
			m._config.expDate = dj.byId("exp_date").get("displayedValue");
			m._config.beneficiary.name = dj.byId("beneficiary_name").get("value");
			m._config.beneficiary.addressLine1 = dj.byId("beneficiary_address_line_1").get("value");
			m._config.beneficiary.addressLine2 = dj.byId("beneficiary_address_line_2").get("value");
			m._config.beneficiary.dom = dj.byId("beneficiary_dom").get("value");
			m._config.renewFlag = dj.byId("renew_flag").get("checked");
			m.setCurrency(dj.byId("bg_cur_code"),
					["inc_amt", "dec_amt", "org_bg_amt", "bg_amt"]);
			if(dj.byId("contract_cur_code") && dj.byId("contract_cur_code").get("value") !== "" )
			{
				m.setCurrency(dj.byId("contract_cur_code"), ["contract_amt"]);
			}
			
			var recipientBankAbbvName = dj.byId("recipient_bank_abbv_name").get("value");
			
			var handle = dojo.subscribe(_deleteGridRecord, function(){
				 m.toggleFields(m._config.customerBanksMT798Channel[recipientBankAbbvName] == true && m.hasAttachments(), null, ["delivery_channel"], false, false);
			});
			 
			var advSendModeSelect = dj.byId("adv_send_mode");
			if(advSendModeSelect)
			{
				advSendModeSelect.onChange();
			}	
			
			var isMT798Enable = m._config.customerBanksMT798Channel[recipientBankAbbvName] === true;
			if(isMT798Enable)
			{
				 m.animate("wipeOut", d.byId("adv_send_mode_row"));
				 m.toggleRequired("adv_send_mode", false);
			}
			else
			{
				 m.animate("wipeIn", d.byId("adv_send_mode_row"));
				 m.toggleRequired("adv_send_mode", true);
			}
			
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
			
			
			if(dj.byId("facility_id"))
			{
				dj.byId("facility_id").onChange();
				if(dj.byId("inc_amt") && !isNaN(dj.byId("inc_amt").get("value")))
				{
					m.toggleFields(
							false, null,
							["limit_id", "booking_amt","facility_id"], true, false);
					m.toggleFields(
							true, null,
							[ "booking_amt"], true, false);
							
				}
				else if(dj.byId("dec_amt") && !isNaN(dj.byId("dec_amt").get("value")))
				{
					m.toggleFields(
							false, null,
							["limit_id", "booking_amt","facility_id"], true, false);
							
				}
				m.toggleFields(
						true, null,
						["limit_id", "booking_amt","facility_id","booking_cur_code"], true, true);
			}
			if(dj.byId("inc_amt") && isNaN(dj.byId("inc_amt").get("value")) && dj.byId("dec_amt") && isNaN(dj.byId("dec_amt").get("value")))
			{
				m.animate("wipeOut",d.byId("facilityLimitDetail"));
			}
			
			m.populateGridOnLoad("bg");
			//Radio field template is reading values from all nodes in the input xml.
            // For ones with multiple transactions, (ex:  create, approve, amend, approve.) the tag values from the root node is not being picked, because of radio-value = //*name in form-templates.
            // To overcome this we are overriding "value" and "checked" params from js.
			m.setRenewalAmountOnFormLoad();
			
			var tender_exp_date = d.byId("tender-exp-date");
			
			if(dj.byId("contract_ref") && dj.byId("contract_ref").get("value")==="TEND")
			{
				m.animate("fadeIn", tender_exp_date);
			}
			else
			{
				dj.byId("tender_expiry_date").set("value", null);
				m.animate("fadeOut", tender_exp_date);
			}
			
			if(dj.byId("inc_amt").get("value") && !dj.byId("dec_amt").get("value"))
			{
				dj.byId("dec_amt").set("disabled",true);
			}
			else if(dj.byId("dec_amt").get("value") && !dj.byId("inc_amt").get("value"))
			{
				dj.byId("inc_amt").set("disabled",true);
			}
		
			 var n1 = dojo.query("#GTPRootPortlet .portlet-title")[0];
			 var modeValue = dj.byId("mode");
			 if((modeValue.get("value")=== "DRAFT") && (n1.innerHTML === "Amend Existing Banker's Guarantee"))
			{
				if (dj.byId("org_contract_narrative"))
				{
					dj.byId("contract_narrative").set("value", "");
				}
				if (dj.byId("org_contract_amt") && dj.byId("org_contract_cur_code"))
				{
					dj.byId("contract_amt").set("value", "");
					dj.byId("contract_cur_code").set("value", "");
				}
				if (dj.byId("org_contract_pct"))
				{
					dj.byId("contract_pct").set("value", "");
				}
			}
			//set the fileds based on exp_date_type_code
			var orgExpDate = dj.byId("org_exp_date");
			var expDateTypeCode =  dj.byId("exp_date_type_code");
			if(orgExpDate)
				{
					if(dj.byId(expDateTypeCode))
						{
						if(expDateTypeCode.get("value") === "01")
							{
								dj.byId("exp_date").set("disabled",true);	
								m.toggleRequired("exp_event", true);
							}
						if(expDateTypeCode.get("value") === "02")
							{
								dj.byId("exp_event").set("disabled",true);
								m.toggleRequired("exp_date", true);
							}
						if(expDateTypeCode.get("value") === "03")
							{
								m.toggleRequired("exp_event", true);
								m.toggleRequired("exp_date", true);
							}
						}
				}
		},
		
		beforeSaveValidations : function(){
			
			var principleAccount = dj.byId("principal_act_no");
			if(principleAccount && principleAccount.get('value')!= "")
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
			if(feeAccount && feeAccount.get('value')!= "")
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

		beforeSubmitValidations : function() {
			// We check that at least one of the field describing the amendment
			// contains data (SWIFT 2006)
			var fieldsToCheck = ["exp_date", "org_exp_date", "exp_date_type_code",
					"org_exp_date_type_code", "inc_amt", "dec_amt", "amd_details", "file"];

			// Check that all fields are present.
			var allFieldsPresent = d.every(fieldsToCheck, function(id){
				if(d.byId(id)){
					return true;
				}
				return false;
			});

			if(allFieldsPresent) {
				// Check non-date values against their org_ values
				var fieldsToCheckAgainstOrg = ["exp_date_type_code"];
				var allFieldsMatch = d.every(fieldsToCheckAgainstOrg, function(id){
					var value = dj.byId(id).get("value") + "";
					var orgValue = dj.byId("org_" + id).get("value") + "";
					
					// For number fields, or other invalid fields, map to an empty string
					if(value == "NaN" || value == "null" || value == "undefined") {
						value = "";
					}

					if(value == orgValue){
						return true;
					}
					return false;
				});
				
				// Check date values against their org_ values
				var dateFieldsToCheckAgainstOrg = ["exp_date"];
				var allDateFieldsMatch = d.every(dateFieldsToCheckAgainstOrg, function(id){
					// org date is a hidden field, so will be in MM/DD/YY
					// We need to get a localized string back to do a compare
					var value = dj.byId(id).get("value") + "";
					var orgValue = d.date.locale.parse(dj.byId("org_" + id).get("displayedValue"), {
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
						!dj.byId("inc_amt").get("value") &&
						!dj.byId("dec_amt").get("value") &&
						(dj.byId("amd_details").get("value") == "")){
					m._config.onSubmitErrorMsg = m.getLocalization("noAmendmentError");
					return false;
				}
			}
			//Check if previous expiry date is less than amendment date in case new expiry date is not set, return false
			var amdDate = dj.byId("amd_date");
         	if(amdDate && dj.byId("exp_date_type_code") && dj.byId("exp_date_type_code").get("value") != "01" && dj.byId("org_exp_date") && dj.byId("exp_date") && dj.byId("exp_date").get("value")=== null)
         	{
         		var prevExpDate = dj.byId("org_exp_date");
         		if(!m.compareDateFields(amdDate, prevExpDate)) 
         		{
         			m._config.onSubmitErrorMsg  = m.getLocalization("amdDateGreaterThanOldExpiryDate",[ amdDate.get("displayedValue"), prevExpDate.get("displayedValue") ]);
         			return false;
         		}
         	}
         	if(dj.byId("inc_amt") && dj.byId("dec_amt") && (!isNaN(dj.byId("inc_amt").get("value")) || !isNaN(dj.byId("dec_amt").get("value"))) && dj.byId("limit_review_date") && dj.byId("facility_date"))
			{
				if(d.date.compare(dj.byId("limit_review_date").get("value"),new Date(),"date") < 0)
				{
					m._config.onSubmitErrorMsg  = m.getLocalization("amendLimitDateExpiry");
         			return false;
				}
				/*if(dj.byId("booking_amt"))
				{
					setFacilityBookingAmountAmend();
				}*/
			}
         	var projectedExp = dj.byId("projected_expiry_date");
			var finalExp = dj.byId("final_expiry_date");
			var expDate = dj.byId("exp_date");
			if(finalExp)
			{
				if(expDate && finalExp && !m.compareDateFields(expDate, finalExp))
				{
					m._config.onSubmitErrorMsg = m.getLocalization('finalExpDateLessThanTransactionExpDtError',[ finalExp.get("displayedValue"), expDate.get("displayedValue") ]);
					m.showTooltip(m.getLocalization('finalExpDateLessThanTransactionExpDtError',[ finalExp.get("displayedValue"), expDate.get("displayedValue") ]), finalExp.domNode);
					finalExp.focus();
					return false;
				}
				else if(projectedExp && finalExp && !m.compareDateFields(projectedExp, finalExp))
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
				
			return m.validateLSAmtSumAgainstTnxAmt("bg");
		},
		
		beforeSubmit : function() {
			m.updateSubTnxTypeCode();
			}
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.trade.amend_bg_client');