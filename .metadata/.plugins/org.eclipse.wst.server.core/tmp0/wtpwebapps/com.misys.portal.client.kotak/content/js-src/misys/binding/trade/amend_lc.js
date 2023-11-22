dojo.provide("misys.binding.trade.amend_lc");

dojo.require("dijit.form.DateTextBox");
dojo.require("misys.form.CurrencyTextBox");
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
dojo.require("misys.binding.trade.ls_common");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode
	
	// Private functions and variables go here
    // dojo.subscribe once a record is deleted from the grid
    var _deleteGridRecord = "deletegridrecord";
    m._config = m._config || {};
    m._config.expDate = m._config.expDate || {};
    m._config.lastShipDate = m._config.lastShipDate || {};

	d.mixin(m._config, {

		initReAuthParams : function() {
									
			var reAuthParams = {
				productCode : 'LC',	
				subProductCode : '',
				transactionTypeCode : "03",	
				entity :dj.byId("entity") ? dj.byId("entity").get("value") : "",
				currency : dj.byId("lc_cur_code") ? dj.byId("lc_cur_code").get('value') : "",				
				amount : dj.byId("lc_amt") ? m.trimAmount(dj.byId("lc_amt").get('value')) : "",
								
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
	
	function pstvChange()
	{	

		if(dj.byId("pstv_tol_pct") && dj.byId("org_pstv_tol_pct") && ((dj.byId("pstv_tol_pct").get("value") == dj.byId("org_pstv_tol_pct").get("value")) || (isNaN(dj.byId("pstv_tol_pct").get("value")) && dj.byId("org_pstv_tol_pct").get("value") =="")) && isNaN(dj.byId("dec_amt").get("value") ) && isNaN(dj.byId("inc_amt").get("value") ))
			{

			m.animate("wipeOut",d.byId("facilityLimitDetail"));
			if(dj.byId("booking_amt"))
				{
				dj.byId("booking_amt").set("value",0);
				m.toggleFields(
						false, null,
						["limit_id", "booking_amt","facility_id","booking_cur_code"], true, false);
				}
			
			
		
			
			}
				if(dj.byId("inc_amt") && !isNaN(dj.byId("inc_amt").get("value")))
				{
					dj.byId("inc_amt").onBlur();
				}
				else if(dj.byId("dec_amt") && !isNaN(dj.byId("dec_amt").get("value")))
				{
					dj.byId("dec_amt").onBlur();
							
				}
			
			
	}
	//for only tolerance increase
	function calculateTol(limitRate)
	{
		var pstvTol=dj.byId("pstv_tol_pct"),
		orgPstvTol =dj.byId("org_pstv_tol_pct"),
		pstvTolVal = pstvTol.get("value"),
		orgPstvTolVal =orgPstvTol.get("value"),
		bookingAmount;
		if(isNaN(dj.byId("dec_amt").get("value") ) && isNaN(dj.byId("inc_amt").get("value") ))
			{
			
		if( dj.byId("booking_amt") && pstvTol && orgPstvTol )
		{
			if(orgPstvTolVal > pstvTolVal)
				{				
				bookingAmount = limitRate * dj.byId("org_lc_amt").get("value") *((orgPstvTolVal-pstvTolVal)/100.0);
				}
			else if(orgPstvTolVal < pstvTolVal)
				{
				bookingAmount = limitRate * dj.byId("org_lc_amt").get("value") *((pstvTolVal-orgPstvTolVal)/100.0);
				}
			else
				{
				bookingAmount =0;
				}
			dj.byId("tol_booking_amt").attr("value",bookingAmount,false);
		}
		if((isNaN(pstvTolVal) && (!isNaN(orgPstvTolVal)) && orgPstvTolVal !== "" ))
		{
			bookingAmount = limitRate * dj.byId("org_lc_amt").get("value") *((orgPstvTolVal)/100.0);
			dj.byId("tol_booking_amt").attr("value",bookingAmount,false);
			dj.byId("booking_amt").attr("value",bookingAmount,false);
		}
			}
		
		
	}
	
	function _calculateBookingAmtforInc(tnxAmt,limitRate) 
	{
		var pstvTol=dj.byId("pstv_tol_pct"),
		orgPstvTol =dj.byId("org_pstv_tol_pct"),
		pstvTolVal = pstvTol.get("value"),
		orgPstvTolVal =orgPstvTol.get("value"),
		tnxVal = tnxAmt*limitRate,
		bookingAmount=tnxVal;
		
		if( pstvTol && orgPstvTol )
		{
		if((!isNaN(orgPstvTolVal)) && orgPstvTolVal !== "" )
			{
			if((!isNaN(pstvTolVal)) && pstvTolVal !== "")
				{
				
				if(orgPstvTolVal > pstvTolVal)
					{
					
					bookingAmount = tnxVal + (pstvTolVal/100.0)*tnxVal - dj.byId("org_lc_amt").get("value") *((orgPstvTolVal-pstvTolVal)/100.0);
					}
				else if (orgPstvTolVal < pstvTolVal)
					{
					bookingAmount = tnxVal + (pstvTolVal/100.0)*tnxVal + dj.byId("org_lc_amt").get("value") *((pstvTolVal-orgPstvTolVal)/100.0);
					}
				else
					{
					bookingAmount = tnxVal + (orgPstvTolVal/100.0)*tnxVal ;
					}
				}
			else
				{
				bookingAmount = tnxVal - dj.byId("org_lc_amt").get("value") *((orgPstvTolVal)/100.0);
				}
			}
		else
			{
			if((!isNaN(pstvTolVal)) && pstvTolVal !== "")
				{
				bookingAmount = tnxVal + (pstvTolVal/100.0)*(tnxVal + dj.byId("org_lc_amt").get("value") );
				}
			
			}
	}
		dj.byId("tol_booking_amt").attr("value",bookingAmount,false);
		
	}
	function _calculateBookingAmtforDec(tnxAmt,limitRate) 
	{
		var pstvTol=dj.byId("pstv_tol_pct"),
		orgPstvTol =dj.byId("org_pstv_tol_pct"),
		pstvTolVal = pstvTol.get("value"),
		orgPstvTolVal =orgPstvTol.get("value"),
		tnxVal = tnxAmt*limitRate,
		bookingAmount=tnxVal;
		if( pstvTol && orgPstvTol )
		{
		if((!isNaN(orgPstvTolVal)) && orgPstvTolVal !== "")
			{
			if((!isNaN(pstvTolVal)) && pstvTolVal !== "")
				{
			
				if(orgPstvTolVal > pstvTolVal)
					{
					
					bookingAmount = tnxVal + (pstvTolVal/100.0)*tnxVal + dj.byId("org_lc_amt").get("value")*((orgPstvTolVal-pstvTolVal)/100.0);
					}
				else if (orgPstvTolVal < pstvTolVal)
					{
					bookingAmount = tnxVal + (orgPstvTolVal/100.0)*tnxVal - (dj.byId("org_lc_amt").get("value") - tnxVal) *((pstvTolVal-orgPstvTolVal)/100.0);
					}
				else 
					{
					bookingAmount = tnxVal + (orgPstvTolVal/100.0)*tnxVal ;
					}
				}
			else
			{
				bookingAmount = tnxVal  + dj.byId("org_lc_amt").get("value")*((orgPstvTolVal)/100.0);
			}
			}
		else if((!isNaN(pstvTolVal)) && pstvTolVal !== "")
			{
				bookingAmount = tnxVal - (dj.byId("org_lc_amt").get("value")-tnxVal)*(pstvTolVal/100.0) ;
			}
	}
		dj.byId("tol_booking_amt").attr("value",bookingAmount,false);
		
	}
	
	
	
	
	
	function validateDecreaseAmount() 
	{
		if(dj.byId("lc_liab_amt") && dj.byId("lc_liab_amt").get("value") !== null && dj.byId("dec_amt") && dj.byId("dec_amt").get("value")!== null) {
			if(d.number.parse(dijit.byId("lc_liab_amt").get("value")) < dijit.byId("dec_amt").get("value")) {
				var lcLiabCurCodeValue = dj.byId("lc_cur_code").get("value");
				var lcLiabAmtValue = dojo.number.parse(dj.byId("lc_liab_amt").get("value"));
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
		else if ((dj.byId("pstv_tol_pct") && dj.byId("org_pstv_tol_pct") && ((isNaN(dj.byId("pstv_tol_pct").get('value')) && dj.byId("org_pstv_tol_pct").get('value') != "") ||(!isNaN(dj.byId("pstv_tol_pct").get('value')) && dj.byId("org_pstv_tol_pct").get('value') == "")))  &&  facilityDetailsDivId )
			{
			m.animate("wipeIn",facilityDetailsDivId);
			calculateTol(1);
			dj.byId("booking_amt").attr("value",dj.byId("tol_booking_amt").get('value'),false);
			m.toggleFields(
					true, null,
					["limit_id", "booking_amt","facility_id","booking_cur_code"], true, true);
			
			}
		else if ((dj.byId("pstv_tol_pct") && dj.byId("org_pstv_tol_pct") && dj.byId("pstv_tol_pct").get('value') != dj.byId("org_pstv_tol_pct").get('value')) &&  facilityDetailsDivId) 
			{
			pstvChange();
			
			}
		else if(facilityDetailsDivId)
		{
			m.animate("wipeOut",facilityDetailsDivId);
			dj.byId("booking_amt").set("value",0);
			m.toggleFields(
					false, null,
					["limit_id", "booking_amt","facility_id","booking_cur_code"], true, false);
		}
	}
	function setFacilityBookingAmountAmend(tnxWidget)
	{
		var tnxCurrencyWidget 	= dj.byId("lc_cur_code"),
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
				trasactionAmt	= tnxWidget && tnxWidget.id !== "pstv_tol_pct"  ? tnxWidget.get("value") : "",
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
					if(tnxWidget && tnxWidget.id === "inc_amt")
					{
						if(m._config.limitRate && trasactionAmt !== "")
						{
							bookingAmount = trasactionAmt*m._config.limitRate;
							_calculateBookingAmtforInc(trasactionAmt,m._config.limitRate);
							bookingAmount = dj.byId("tol_booking_amt").get('value');
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
					else if(tnxWidget && tnxWidget.id === "dec_amt")
						{
						if(m._config.limitRate && trasactionAmt !== "")
						{
							bookingAmount = trasactionAmt*m._config.limitRate;
							_calculateBookingAmtforDec(trasactionAmt,m._config.limitRate);
							bookingAmount = dj.byId("tol_booking_amt").get('value');
						}
						bookingAmountWidget.attr("value",bookingAmount,false);
						}
					else 
						{

						if(m._config.limitRate && trasactionAmt !== "")
						{
						bookingAmount = trasactionAmt*m._config.limitRate;
						}
						else if (trasactionAmt === "")
						{
						calculateTol(m._config.limitRate);
						bookingAmount = dj.byId("tol_booking_amt").get('value');
						
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
					
					if(tnxWidget && tnxWidget.id === "inc_amt")
					{
						_calculateBookingAmtforInc(trasactionAmt,1);
						bookingAmount = dj.byId("tol_booking_amt").get('value');
					bookingAmountWidget.attr("value",bookingAmount,false);
						
					}
					else if (tnxWidget && tnxWidget.id === "dec_amt")
						{

						bookingAmount = trasactionAmt;
						_calculateBookingAmtforDec(trasactionAmt,1);
						bookingAmount = dj.byId("tol_booking_amt").get('value');
						bookingAmountWidget.attr("value",bookingAmount,false);
						}
					else
					{
						if(trasactionAmt !== "")
						{
						bookingAmount = trasactionAmt;
						}
						else 
						{
						calculateTol(1);
						bookingAmount = dj.byId("tol_booking_amt").get('value');
						
						}
					bookingAmountWidget.attr("value",bookingAmount,false);
					
				
					
					}
					
				}
			}
			if(!tnxWidget || tnxWidget.id !== "dec_amt")
			{
				if(bookingAmount > dj.byId("tol_booking_amt").get('value'))
					{
					isValid = false;
					errorMessage = m.getLocalization("invalidBookingAmountTnx");
					
					}
			if(isValid && bookingAmount > limitAmt)
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
	// Public functions & variables follow
	d.mixin(m, {

		bind : function() {
			m.setValidation("exp_date", m.validateTradeExpiryDate);
			m.setValidation("amd_date", m.validateAmendmentDate);
			m.setValidation("alt_applicant_country", m.validateCountry);
			m.setValidation('next_revolve_date', m.validateNextRevolveDate);
			m.connect("inc_amt", "onBlur", function(){
				m.validateAmendAmount(true, this, "lc");
				if(dj.byId("dec_amt")){
					dj.byId("dec_amt").set('value',"");
				}
			}); 
			m.connect("dec_amt", "onBlur", function(){
				validateDecreaseAmount();
				m.validateAmendAmount(true, this, "lc");
				if(dj.byId("inc_amt")){
					dj.byId("inc_amt").set('value',"");
				}
			}); 
			m.setValidation("pstv_tol_pct", m.validateTolerance);
			m.setValidation("neg_tol_pct", m.validateTolerance);
			m.setValidation("max_cr_desc_code", m.validateMaxCreditTerm);
			m.setValidation("last_ship_date", m.validateLastShipmentDate);

			m.connect("inc_amt", "onBlur", m.amendTransaction);
			m.connect("inc_amt", "onBlur", facilityAmend);
			m.connect("pstv_tol_pct", "onChange", facilityAmend);
			m.connect("pstv_tol_pct", "onChange", function()
					{
				if(d.byId("facilityLimitDetail"))
					{
					pstvChange();
					}});
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
			m.connect("dec_amt", "onBlur", facilityAmend);
			m.connect("dec_amt", "onBlur", m.amendTransaction);
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
			m.connect("adv_send_mode", "onChange", function(){
				m.toggleMT798Fields("issuing_bank_abbv_name");
			});
			m.connect("license_lookup","onClick", function(){
				m.getLicenses("lc");
			});
			m.connect("exp_date", "onChange", function(){
				m.clearLicenseGrid(this, m._config.expDate,"lc");
			});
			m.connect("last_ship_date", "onChange", function(){
				m.clearLicenseGrid(this, m._config.lastShipDate,"lc");
			});
			m.connect("delivery_channel", "onChange", function(){
				if(dj.byId("delivery_channel") && dj.byId("delivery_channel").get("value")=== "FACT")
					{
						deliveryChannelFileAct = true;
					}
				else
					{
						deliveryChannelFileAct = false;
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
						["alt_applicant_address_line_2", "alt_applicant_dom"],
						["alt_applicant_name", "alt_applicant_address_line_1", "alt_applicant_country"]);
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
			
			m._config.expDate = dj.byId("exp_date").get("displayedValue");
			m._config.lastShipDate = dj.byId("last_ship_date").get("displayedValue");
			m.setCurrency(dj.byId("lc_cur_code"),
					["inc_amt", "dec_amt", "org_lc_amt", "lc_amt","tnx_amt"]);
			
			var issuingBankAbbvName = dj.byId("issuing_bank_abbv_name").get('value');
			var isMT798Enable = m._config.customerBanksMT798Channel[issuingBankAbbvName] === true;
			 var handle = dojo.subscribe(_deleteGridRecord, function(){
				 m.toggleFields(m._config.customerBanksMT798Channel[issuingBankAbbvName] === true && m.hasAttachments(), null, null, false, false);
			 });
			 
			var advSendModeSelect = dj.byId("adv_send_mode");
			if(advSendModeSelect)
			{
				advSendModeSelect.onChange();
			}	
			if(dj.byId("adv_send_mode").value=="01")
				
			{
				dj.byId("delivery_channel").set("disabled",true);
				dj.byId("delivery_channel").set("readOnly",true);
				//dj.byId("delivery_channel").set("value","FACT");
				dj.byId("delivery_channel").onChange();
			}
			
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
				if(dj.byId("booking_amt"))
				{
				dj.byId("booking_amt").set("required", false);
				dj.byId("booking_amt").set("value",0);
				}
					
				m.animate("wipeOut",d.byId("facilityLimitDetail"));
				
				
				
				
			}
			m.populateGridOnLoad("lc");
		},
		
		/**
		 * <h4>Summary:</h4>  Before save validation method.
		 * <h4>Description</h4> : This method is called before saving a transaction.
		 * Any before save validation can be added in this method for LC. 
		 *
		 * @method beforeSaveValidations
		 */
		beforeSaveValidations : function(){
			var feeAccount = dj.byId("fee_act_no");
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
			// We check that at least one of the field describing the amendment
			// contains data (SWIFT 2006)
			var fieldsToCheck = ["exp_date", "org_exp_date", "pstv_tol_pct",
					"org_pstv_tol_pct", "neg_tol_pct", "org_neg_tol_pct", "ship_from", "ship_loading",
					"ship_discharge", "ship_to", "last_ship_date", "narrative_shipment_period",
					"narrative_additional_amount", "org_narrative_additional_amount",
					"inc_amt", "dec_amt", "amd_details", "file","revolve_time_no","revolve_period",
					"revolve_frequency","notice_days","charge_upto","next_revolve_date"];

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
						"ship_loading", "ship_discharge", "ship_to","revolve_time_no","revolve_period",
						"revolve_frequency","notice_days","charge_upto"];
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
				var dateFieldsToCheckAgainstOrg = ["exp_date", "last_ship_date","next_revolve_date"];
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
			
			if(dj.byId("revolve_period") && dj.byId("org_revolve_period") && dj.byId("revolve_period").get("value") === "")
			{
				dj.byId("revolve_period").set("value" , dj.byId("org_revolve_period").get("value"));
			}
			if(dj.byId("revolve_frequency") && dj.byId("org_revolve_frequency") && dj.byId("revolve_frequency").get("value")==="")
			{
				dj.byId("revolve_frequency").set("value" , dj.byId("org_revolve_frequency").get("value"));
			}
			if(dj.byId("revolve_time_no") && dj.byId("org_revolve_time_no") && dj.byId("revolve_time_no").get("value") === "")
			{
				dj.byId("revolve_time_no").set("value" , dj.byId("org_revolve_time_no").get("value"));
			}
			if(dj.byId("next_revolve_date") && dj.byId("org_next_revolve_date") && dj.byId("next_revolve_date").get("value")=== "")
			{
				dj.byId("next_revolve_date").set("value" , dj.byId("org_next_revolve_date").get("value"));
			}	
			if(dj.byId("notice_days") && dj.byId("org_notice_days") && dj.byId("notice_days").get("value")=== "")
			{
				dj.byId("notice_days").set("value" , dj.byId("org_notice_days").get("value"));
			}
			if(dj.byId("charge_upto") && dj.byId("org_charge_upto") && dj.byId("charge_upto").get("value")=== "")
			{
				dj.byId("charge_upto").set("value" , dj.byId("org_charge_upto").get("value"));
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
			if(dj.byId("pstv_tol_pct") && dj.byId('org_pstv_tol_pct') && dijit.byId("org_pstv_tol_pct").get('value') !== "" && dijit.byId("max_cr_desc_code").get('value') === "" && isNaN(dijit.byId("pstv_tol_pct").get('value'))){
				
				dj.byId("pstv_tol_pct").set("value",dj.byId('org_pstv_tol_pct').get('value'));
			}
			if(dj.byId("neg_tol_pct") && dj.byId('org_neg_tol_pct') && dijit.byId("org_neg_tol_pct").get('value') !== "" && dijit.byId("max_cr_desc_code").get('value') === "" && isNaN(dijit.byId("neg_tol_pct").get('value'))){
				
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
			return m.validateLSAmtSumAgainstTnxAmt("lc");
		},
		
		beforeSubmit : function() {
			m.updateSubTnxTypeCode("lc");
		}
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.trade.amend_lc_client');