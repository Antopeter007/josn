dojo.provide("misys.binding.openaccount.create_ea");
/*
 ----------------------------------------------------------
 Event Binding for

 Export Open Account (EA) Form.

 Copyright (c) 2000-2009 Misys (http://www.misys.com),
 All Rights Reserved. 

 version:   1.0
 date:      18/08/14
 ----------------------------------------------------------
 */
dojo.require("dojo.parser");
dojo.require("dijit.layout.BorderContainer");
dojo.require("dijit.Dialog");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.TextBox");
dojo.require("dojo.data.ItemFileWriteStore");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.DateTextBox");
dojo.require("misys.form.CurrencyTextBox");
dojo.require("dijit.form.NumberTextBox");
dojo.require("dijit.form.CheckBox");
dojo.require("dijit.form.FilteringSelect");
dojo.require("dijit.form.Form");
dojo.require("dijit.layout.ContentPane");
dojo.require("dijit.layout.TabContainer");
dojo.require("dojo.io.iframe"); 
dojo.require("dijit.ProgressBar");
dojo.require("dojo.behavior");
dojo.require("dojo.date.locale");
dojo.require("dijit.Tooltip");

dojo.require("misys.openaccount.FormOpenAccountEvents");
dojo.require("misys.grid.DataGrid");
dojo.require("misys.form.SimpleTextarea");
dojo.require("misys.form.common");
dojo.require("misys.validation.common");
dojo.require("misys.layout.FloatingPane");

dojo.require("misys.openaccount.widget.LineItems");
dojo.require("misys.openaccount.widget.LineItem");
dojo.require("misys.openaccount.widget.ProductIdentifiers");
dojo.require("misys.openaccount.widget.ProductIdentifier");
dojo.require("misys.openaccount.widget.ProductCategories");
dojo.require("misys.openaccount.widget.ProductCategory");
dojo.require("misys.openaccount.widget.ProductCharacteristics");
dojo.require("misys.openaccount.widget.ProductCharacteristic");
dojo.require("misys.openaccount.widget.Adjustments");
dojo.require("misys.openaccount.widget.Adjustment");
dojo.require("misys.openaccount.widget.PaymentTerms");
dojo.require("misys.openaccount.widget.PaymentTerm");
dojo.require("misys.openaccount.widget.Taxes");
dojo.require("misys.openaccount.widget.Tax");
dojo.require("misys.openaccount.widget.FreightCharges");
dojo.require("misys.openaccount.widget.FreightCharge");
dojo.require("misys.openaccount.widget.Incoterms");
dojo.require("misys.openaccount.widget.Incoterm");
dojo.require("misys.openaccount.widget.CommercialDatasetDetails");
dojo.require("misys.openaccount.widget.CommercialDatasetDetail");
dojo.require("misys.openaccount.widget.TransportDatasetDetails");
dojo.require("misys.openaccount.widget.TransportDatasetDetail");
dojo.require("misys.openaccount.widget.PaymentTransportDatasetDetails");
dojo.require("misys.openaccount.widget.PaymentTransportDatasetDetail");
dojo.require("misys.openaccount.widget.InsuranceDatasetDetails");
dojo.require("misys.openaccount.widget.InsuranceDatasetDetail");
dojo.require("misys.openaccount.widget.PaymentObligations");
dojo.require("misys.openaccount.widget.PaymentObligation");
dojo.require("misys.openaccount.widget.CertificateDatasetDetails");
dojo.require("misys.openaccount.widget.CertificateDatasetDetail");
dojo.require("misys.openaccount.widget.OtherCertificateDatasetDetails");
dojo.require("misys.openaccount.widget.OtherCertificateDatasetDetail");
dojo.require("misys.openaccount.widget.ContactDetails");
dojo.require("misys.openaccount.widget.ContactDetail");
dojo.require("misys.openaccount.widget.SUserInformations");
dojo.require("misys.openaccount.widget.SUserInformation");
dojo.require("misys.openaccount.widget.BUserInformations");
dojo.require("misys.openaccount.widget.BUserInformation");
dojo.require("misys.openaccount.widget.TransportByAirDeptDetails");
dojo.require("misys.openaccount.widget.TransportByAirDeptDetail");
dojo.require("misys.openaccount.widget.TransportByAirDestDetails");
dojo.require("misys.openaccount.widget.TransportByAirDestDetail");
dojo.require("misys.openaccount.widget.TransportBySeaLoadingPortDetails");
dojo.require("misys.openaccount.widget.TransportBySeaLoadingPortDetail");
dojo.require("misys.openaccount.widget.TransportBySeaDischargePortDetails");
dojo.require("misys.openaccount.widget.TransportBySeaDischargePortDetail");
dojo.require("misys.openaccount.widget.TransportByRailReceiptPlaceDetail");
dojo.require("misys.openaccount.widget.TransportByRailReceiptPlaceDetails");
dojo.require("misys.openaccount.widget.TransportByRailDeliveryPlaceDetail");
dojo.require("misys.openaccount.widget.TransportByRailDeliveryPlaceDetails");
dojo.require("misys.openaccount.widget.TransportByRoadReceiptPlaceDetail");
dojo.require("misys.openaccount.widget.TransportByRoadReceiptPlaceDetails");
dojo.require("misys.openaccount.widget.TransportByRoadDeliveryPlaceDetail");
dojo.require("misys.openaccount.widget.TransportByRoadDeliveryPlaceDetails");
dojo.require("misys.openaccount.widget.RoutingSummary");
dojo.require("misys.openaccount.widget.AirRoutingSummaries");
dojo.require("misys.openaccount.widget.SeaRoutingSummaries");
dojo.require("misys.openaccount.widget.RailRoutingSummaries");
dojo.require("misys.openaccount.widget.RoadRoutingSummaries");


(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	// insert private functions & variables
	// This variable controls the validation for Buyer Bank Bpo while changing issuing bank.
	var _validateBuyerBankBpo = "false";
	var origialFieldState = {};
	var formXml = "";
	d.mixin(m._config, {
		xmlTransform : function (/*String*/ xml) {
			var close = dj.byId("close_tnx")?dj.byId("close_tnx").get("checked"):false;
			var comments = dj.byId("close_comments")?dj.byId("close_comments").get("value"):"";
			var startIndex= formXml.indexOf("<close_comments>");
			var endIndex= formXml.indexOf("</close_comments>")+17;
			var str1 = formXml.substring(0, startIndex);
			var str2 = formXml.substring(endIndex, formXml.length);
			var reauthPasswrd,reauthPass,xmlString;
			if(xml.indexOf("<reauth_password>") > -1)
			{
				reauthPasswrd = xml.substring(xml.indexOf("<reauth_password>")+17,xml.indexOf("</reauth_password>"));
				xmlString = str1+reauthPasswrd+str2;
			}
			else
			{
				xmlString = str1+str2;
			}
			
			if(close && xmlString!=="" && comments !== "" ) {
				var comment = xml.substring(xml.indexOf("<close_comments>"),xml.indexOf("</close_comments>")+17);
				if(xml.indexOf("<reauth_password>") > -1)
				{
					reauthPass = xml.substring(xml.indexOf("<reauth_password>"),xml.indexOf("</reauth_password>")+18);
					//reauth password
					startIndex = xmlString.indexOf("<reauth_password>");
					endIndex = xmlString.indexOf("</reauth_password>")+18;
					xmlString = xmlString.substring(0,startIndex) + xmlString.substring(endIndex, xmlString.length);
					
				}
				var issDt = xml.substring(xml.indexOf("<iss_date>")+10,xml.indexOf("</iss_date>"));
				var expDt = xml.substring(xml.indexOf("<exp_date>")+10,xml.indexOf("</exp_date>"));
				
				var xmlRoot = "<ea_tnx_record>",
				transformedXml = [xmlRoot],			
						eaXMLEnd   = "</ea_tnx_record>",
						subEAXML	= "" ;
				//Issue date
				startIndex = xmlString.indexOf("<iss_date>")+10;
				endIndex = xmlString.indexOf("</iss_date>");
				xmlString = xmlString.substring(0,startIndex) + issDt +  xmlString.substring(endIndex, xmlString.length);
				
				//Expiry Date date
				startIndex = xmlString.indexOf("<exp_date>")+10;
				endIndex = xmlString.indexOf("</exp_date>");
				xmlString = xmlString.substring(0,startIndex) + expDt +  xmlString.substring(endIndex, xmlString.length);
				
				subEAXML = xmlString.substring(xmlRoot.length,(xmlString.length-eaXMLEnd.length));
				transformedXml.push(subEAXML);
				transformedXml.push(comment);
				if(reauthPass && reauthPass !== "")
				{
					transformedXml.push(reauthPass);
				}
				transformedXml.push(eaXMLEnd);
				
				return transformedXml.join("");
				
			}
			else {
				return xml;
			}
		}
	}
	);
	
	/**
	 * This function checks whether the Obligor Bank's BIC and Recipient Bank's BIC are different.
	 * If both BICs are alike Error marks that Field
	 * 
	 * @method _obligorAndRecipientBICsShouldBeDiff
	 */
	 _obligorAndRecipientBICsShouldBeDiff = function (obligorOrRecipientBank){
		var recipientBank = dj.byId("recipient_bank");
		var obligorBank = dj.byId("obligor_bank");
		var displayMessage = "";
		displayMessage = m.getLocalization("obligorRecipientSameBICError");
		if(obligorBank && (obligorOrRecipientBank === true)){
			if (obligorBank.get("value") && recipientBank.get("value") && recipientBank.get("value") === obligorBank.get("value"))
			{
				obligorBank.set("state", "Error");
				dj.hideTooltip(obligorBank.domNode);
				dj.showTooltip(displayMessage, obligorBank.domNode, 0);
				setTimeout(function(){dj.hideTooltip(obligorBank.domNode);}, 5000);
			} else
			{
				obligorBank.set("state", "");
				recipientBank.set("state", "");
			}

			if(recipientBank.get("disabled"))
			{
				recipientBank.set("state", "");
				recipientBank.set("required", false);
			}
			if(obligorBank.get("disabled"))
			{
				obligorBank.set("state", "");
				obligorBank.set("required", false);
			}
		}
		if (recipientBank && (obligorOrRecipientBank === false))
		{
			if (obligorBank.get("value") && recipientBank.get("value") && recipientBank.get("value") === obligorBank.get("value"))
			{
				recipientBank.set("state", "Error");
				dj.hideTooltip(recipientBank.domNode);
				dj.showTooltip(displayMessage, recipientBank.domNode, 0);
				setTimeout(function(){dj.hideTooltip(recipientBank.domNode);}, 5000);
			} else
			{
				obligorBank.set("state", "");
				recipientBank.set("state", "");
			}

			if(recipientBank.get("disabled"))
			{
				recipientBank.set("state", "");
				recipientBank.set("required", false);
			}
			if(obligorBank.get("disabled"))
			{
				obligorBank.set("state", "");
				obligorBank.set("required", false);
			}
		}
		
	};

	d.mixin(m._config, {
		/**
		 * This function initiates productCode,subProductCode,transactionTypeCode,entity,currency,amount etc and returns it
		 * @method initReAuthParams
		 */
		initReAuthParams : function() {
									
			var reAuthParams = {
				productCode : "EA",	
				subProductCode : "",
				transactionTypeCode : "01",	
				entity : dj.byId("entity") ? dj.byId("entity").get("value") : "",
				currency : "",				
				amount : "",
								
				es_field1 : "",
				es_field2 : ""				
			};
			return reAuthParams;
			
		},
		/**
		 * This function checks for line item shipment data,if it has,last_ship_date field is enabled 
		 * @method _hasLineItemShipmentDate
		 */
		_hasLineItemShipmentDate : function () {
			if(dj.byId("line-items").store != null) {
				var arrayLineItems=dj.byId("line-items").store._arrayOfAllItems;
				
				for(i=0;i<arrayLineItems.length;i++) {
					if(arrayLineItems[i] && (arrayLineItems[i].last_ship_date!="" || arrayLineItems[i].earliest_ship_date!="") ) {
						dj.byId("earliest_ship_date").set("value", null);
						dj.byId("earliest_ship_date").set("disabled", true);
						dj.byId("last_ship_date").set("value",null);
						dj.byId("last_ship_date").set("disabled",true);
						break;
					}
					else {
						dj.byId("earliest_ship_date").set("disabled", false);
						dj.byId("last_ship_date").set("disabled",false);
					}
				}	
			}
		}
	});	
					
	// Public functions & variables follow
	d.mixin(m, {
		/**
		 * This function binds validation and events to fields to the form.
		 * @method bind
		 */
		bind : function() {

			//  summary:
		    //            Binds validations and events to fields in the form.              
		    //   tags:
		    //            public

		    m.setValidation("ids_match_issuer_country_country", m.validateCountry);
		    m.setValidation("ceds_match_issuer_country_country", m.validateCountry);
		    m.setValidation("ceds_match_mf_issuer_country_country", m.validateCountry);
		    m.setValidation('creditor_country', m.validateCountry);
		    m.setValidation('buyer_country', m.validateCountry);
		    m.setValidation('seller_country', m.validateCountry);
		    m.setValidation('line_item_product_orgn_country', m.validateCountry);
		    m.setValidation("applicable_law_country",m.validateCountry);
		    m.setValidation('payment_jurisdiction_country', m.validateCountry);
		    m.setValidation("payment_tds_country", m.validateCountry);
		    m.setValidation("invoice_iss_date", m.validateIssueDate);
		    m.setValidation("pymnt_due_date", m.validatePaymentDueDate);
		    
		    if((dj.byId("tnxtype") && (dj.byId("tnxtype").get("value") !== "38")) || 
		    	(dj.byId("close_tnx") && (dj.byId("close_tnx").get("checked") === false)))
		    {
		    	m.setValidation("exp_date", m.validateFutureDate);
		    	m.setValidation("iss_date", m.validateIssueDate);
		    	m.oaCommonBindEvents();
		    }
	
			m.connect("bill_to_name", "onChange", m.enableRequiredTab);
			m.connect("ship_to_name", "onChange", m.enableRequiredTab);
			m.connect("consgn_name", "onChange", m.enableRequiredTab);
			m.connect("bill_to_post_code", "onChange", m.enableRequiredTab);
			m.connect("ship_to_post_code", "onChange", m.enableRequiredTab);
			m.connect("consgn_post_code", "onChange", m.enableRequiredTab);
			m.connect("bill_to_town_name", "onChange", m.enableRequiredTab);
			m.connect("ship_to_town_name", "onChange", m.enableRequiredTab);
			m.connect("consgn_town_name", "onChange", m.enableRequiredTab);
			m.connect("bill_to_country", "onChange", m.enableRequiredTab);
			m.connect("ship_to_country", "onChange", m.enableRequiredTab);
			m.connect("consgn_country", "onChange", m.enableRequiredTab);
			
			m.setValidation("line_item_last_ship_date", m.validateOALastShipmentDate);
			m.setValidation("template_id", m.validateTemplateId);
			m.setValidation("contact_email", m.validateEmailAddr);
			m.setValidation("buyer_bei", m.validateBEIFormat);
			m.setValidation("buyer_submitting_bank_bic",m.validateBICFormat);
			m.setValidation("seller_submitting_bank_bic",m.validateBICFormat);			
			m.setValidation("total_cur_code", m.validateCurrency);
			m.setValidation("fake_total_cur_code", m.validateCurrency);
			m.setValidation("total_net_cur_code", m.validateCurrency);
			m.setValidation("line_item_price_cur_code", m.validateCurrency);
			m.setValidation("line_item_total_net_cur_code", m.validateCurrency);
			m.setValidation("adjustment_cur_code", m.validateCurrency);
			m.setValidation("tax_cur_code", m.validateCurrency);
			m.setValidation("freight_charge_cur_code", m.validateCurrency);
			//m.setValidation("last_match_date", m.validateOpenAccountLastMatchDate);
			// Bindings for Payment Obligation Datasets
			m.setValidation("contact_bic", m.validateBICFormat);
			// BIC code validation for Buyer bank and seller bank
			m.setValidation("seller_bank_bic", m.validateBICFormat);
			m.setValidation("buyer_bank_bic", m.validateBICFormat);
			m.setValidation("creditor_account_cur_code",m.validateCurrency);
			m.setValidation("seller_account_cur_code", m.validateCurrency);
			m.connect("buyer_bank_bic","onBlur", m.checkBICExistence);
			m.connect("buyer_submitting_bank_bic","onBlur", m.checkBICExistence);
			m.connect("seller_submitting_bank_bic","onBlur", m.checkBICExistence);
			m.connect("fin_inst_bic","onBlur", m.checkBICExistence);
			m.connect("obligor_bank","onBlur", m.checkBICExistenceForWidgets);
			m.connect("recipient_bank","onBlur", m.checkBICExistenceForWidgets);
			m.connect("creditor_agent_bic","onBlur", m.checkBICExistenceForWidgets);
			m.connect("contact_bic","onBlur", m.checkBICExistenceForWidgets);
			m.connect("cds_bic","onBlur", m.checkBICExistenceForWidgets);
			m.connect("tds_bic","onBlur", m.checkBICExistenceForWidgets);
			m.connect("ids_bic","onBlur", m.checkBICExistenceForWidgets);
			m.connect("ceds_bic","onBlur", m.checkBICExistenceForWidgets);
			m.connect("ocds_bic","onBlur", m.checkBICExistenceForWidgets);
			
			m.connect("buyer_bank_bic","onChange", m.checkBICExistence);
			m.connect("buyer_submitting_bank_bic","onChange", m.checkBICExistence);
			m.connect("seller_submitting_bank_bic","onChange", m.checkBICExistence);
			m.connect("fin_inst_bic","onChange", m.checkBICExistence);
			m.connect("obligor_bank","onChange", m.checkBICExistenceForWidgets);
			m.connect("recipient_bank","onChange", m.checkBICExistenceForWidgets);
			m.connect("creditor_agent_bic","onChange", m.checkBICExistenceForWidgets);
			m.connect("contact_bic","onChange", m.checkBICExistenceForWidgets);
			m.connect("cds_bic","onChange", m.checkBICExistenceForWidgets);
			m.connect("tds_bic","onChange", m.checkBICExistenceForWidgets);
			m.connect("ids_bic","onChange", m.checkBICExistenceForWidgets);
			m.connect("ceds_bic","onChange", m.checkBICExistenceForWidgets);
			m.connect("ocds_bic","onChange", m.checkBICExistenceForWidgets);
			
			// onChange
			m.connect("total_cur_code", "onChange", m.toggleDisableButtons);
			m.connect("freight_charges_type", "onChange", m.manageFreightButton);
			// Fill currency fields with the Purchase Order Currency
			m.connect("total_cur_code", "onChange", m.managePOCurrency);
			m.connect("total_cur_code", "onBlur", function()
			{
				var productStatus = dj.byId("prodstatus");
				var tnxtype = dj.byId("tnxtype");		
				if((productStatus && productStatus.get("value") !== "43" && productStatus.get("value") !== "") || (tnxtype && tnxtype.get("value") !== "03"))
				{
					_checkLineItemsCurrencyTotalCurrency();
				}
			});

			// Adjustment - Amount and Rate fields are mutually exclusive
			m.connect("adjustment_type", "onChange", function(){m.toggleMutuallyExclusiveMandatoryFields(["adjustment_rate","adjustment_amt"]);});
			m.connect("adjustment_amt", "onChange", function(){m.toggleMutuallyExclusiveMandatoryFields(["adjustment_rate","adjustment_amt"]);});
			m.connect("adjustment_rate", "onChange", function(){m.toggleMutuallyExclusiveMandatoryFields(["adjustment_rate","adjustment_amt"]);});
			
			//FREIGHT CHARGES: amount XOR rate
			m.connect("freight_charge_type", "onChange", function(){m.toggleMutuallyExclusiveMandatoryFields(["freight_charge_rate","freight_charge_amt"]);});
			m.connect("freight_charge_amt", "onChange", function(){m.toggleMutuallyExclusiveMandatoryFields(["freight_charge_rate","freight_charge_amt"]);});
			m.connect("freight_charge_rate", "onChange", function(){m.toggleMutuallyExclusiveMandatoryFields(["freight_charge_rate","freight_charge_amt"]);});
			
			//TAXES: amount XOR rate
			//Instead of toggleFields,toggleMutuallyExclusiveMandatoryFields is used
			m.connect("tax_type", "onChange", function(){m.toggleMutuallyExclusiveMandatoryFields(["tax_amt","tax_rate"]);});
			m.connect("tax_amt", "onChange", function(){m.toggleMutuallyExclusiveMandatoryFields(["tax_amt","tax_rate"]);});
			m.connect("tax_rate", "onChange", function(){m.toggleMutuallyExclusiveMandatoryFields(["tax_amt","tax_rate"]);});
			
			//
			// Other Events
			//
			m.connect("display_other_parties", "onClick", m.showHideOtherParties);
			m.connect("total_cur_code", "onFocus", m.saveOldPOCurrency);
		
//			m.connect("transport_type", "onFocus", m.checkRoutingSummaryUnicity);
			m.connect("transport_type", "onChange", m.onChangeTranportType);
			
			m.connect("payment_terms_type_1", "onClick", m.onClickCheckPaymentTerms);
			m.connect("payment_terms_type_2", "onClick", m.onClickCheckPaymentTerms);
			
			m.connect("seller_account_type", "onChange", function(){
				m.onChangeSellerAccountType("form_settlement", "seller_account_value", "seller_account_type");
			});
			m.connect("seller_account_value", "onFocus", m.onFocusSellerAccount);
			
			
			//m.connect("last_match_date", "onBlur", m.onBlurMatchDate);
			m.connect("line_item_qty_val", "onBlur", m.computeLineItemAmount);
			m.connect("line_item_price_amt", "onBlur", m.computeLineItemAmount);
			//Hide the other field when the dialogBox is displayed
			if (d.byId("line_item_qty_unit_measr_other_row") && d.byId("line_item_qty_unit_measr_code")) {
				if (dj.byId("line_item_qty_unit_measr_code").get("value") === "OTHR") {
					m.animate("fadeIn", "line_item_qty_unit_measr_other_row");
				}
				else {
					m.animate("fadeOut", "line_item_qty_unit_measr_other_row");
				}
			}
			m.connect("line_item_qty_unit_measr_code", "onChange", function(){
				m.toggleFields((this.get("value") === "OTHR"),null, ["line_item_qty_unit_measr_other"]);
				if (d.byId("line_item_qty_unit_measr_other_row")) {
					if (this.get("value") === "OTHR") {
						m.animate("fadeIn", "line_item_qty_unit_measr_other_row");
					}
					else {
						m.animate("fadeOut", "line_item_qty_unit_measr_other_row");
					}
				}
			});
						
			m.connect("fake_total_cur_code", "onChange", function(){
				m.setCurrency(this, ["fake_total_amt"]);
			});
			m.connect("total_net_cur_code", "onChange", function(){
				m.setCurrency(this, ["total_net_amt"]);
			});
			m.connect("line_item_price_cur_code", "onChange", function(){
				m.setCurrency(this, ["line_item_price_amt"]);
			});
			m.connect("details_cur_code", "onChange", function(){
				m.setCurrency(this, ["details_amt"]);
			});
			m.connect("fake_total_amt", "onChange", function(){
				m.setTnxAmt(this.get("value"));
			});
			m.connect("fake_total_amt", "onChange", m.setEAAmounts);
			m.connect("total_net_amt", "onChange", m.setEAAmounts);
			m.connect('line_item_total_cur_code', 'onChange', function(){
				m.setCurrency(this, ['line_item_total_amt']);
			});
			m.connect('line_item_total_net_cur_code', 'onChange', function(){
				m.setCurrency(this, ['line_item_total_net_amt']);
			});
			m.connect('adjustment_cur_code', 'onChange', function(){
				m.setCurrency(this, ['adjustment_amt']);
			});
			m.connect('tax_cur_code', 'onChange', function(){
				m.setCurrency(this, ['tax_amt']);
			});
			m.connect('freight_charge_cur_code', 'onChange', function(){
				m.setCurrency(this, ['freight_charge_amt']);
			});
			//populate issuing reference
			m.connect("issuing_bank_abbv_name", "onChange", m.populateReferences);
			m.connect("issuing_bank_abbv_name", "onChange", function(){
				var gridPaymentObligation = dj.byId("bank-payment-obligations");
				if(_validateBuyerBankBpo === "true" && dj.byId("issuing_bank_abbv_name").get("value") != "" && gridPaymentObligation && gridPaymentObligation.store)
				{
					m.dialog.show("ALERT", m.getLocalization("alertDeleteBuyerBankRow"), "",null,null,"", function(){
						if(gridPaymentObligation && gridPaymentObligation.store && gridPaymentObligation.store._arrayOfTopLevelItems.length > 0)
						{
							gridPaymentObligation.store.fetch({
								query:{store_id:"*"},
								onComplete: dojo.hitch(gridPaymentObligation, function(items, request){
									dojo.forEach(items, function(item){
										if(item.buyer_bank_bpo[0] === "Y")
										{
											item.buyer_bank_bpo[0] = "N";
											dj.byId("buyer_bank_bpo_added").set("value","false");
										}
									});
								})
							});
							if(dj.byId("buyer_bank_bic") && dj.byId("buyer_bank_bic").get("value") != "")
							{
								gridPaymentObligation.store.fetch({
									query:{store_id:"*"},
									onComplete: dojo.hitch(gridPaymentObligation, function(items, request){
										dojo.forEach(items, function(item){
											if(item.obligor_bank[0] === dj.byId("buyer_bank_bic").get("value"))
											{
												item.buyer_bank_bpo[0] = "Y";
												dj.byId("buyer_bank_bpo_added").set("value","true");
											}
										});
									})
								});
							}
						}
				}, function(){
					dj.byId("issuing_bank_abbv_name").set("value","");
					dj.byId("buyer_bank_bic").set("value","");
				});
				}
				});
			if(dj.byId("issuing_bank_abbv_name"))
			{
				m.connect("entity", "onChange", function(){
					dj.byId("issuing_bank_abbv_name").onChange();});
			}
			m.connect("issuing_bank_customer_reference", "onChange", m.setSellerReference);
			
			//Lineitems quantity codes
			m.connect(dj.byId("line_item_qty_unit_measr_code"), "onChange",  function(){dj.byId("line_item_price_unit_measr_code").set("value", this.get("value"));});
			

			//Decode type code in widgets
			m.connect(dj.byId("line_item_qty_unit_measr_code"), "onChange", function(){dj.byId("line_item_qty_unit_measr_label").set("value", this.get("displayedValue"));});
			m.connect(dj.byId("product_identifier_code"), "onChange", function(){dj.byId("product_identifier_code_label").set("value", this.get("displayedValue"));});
			m.connect(dj.byId("product_category_code"), "onChange", function(){dj.byId("product_category_code_label").set("value", this.get("displayedValue"));});
			m.connect(dj.byId("product_characteristic_code"), "onChange", function(){dj.byId("product_characteristic_code_label").set("value", this.get("displayedValue"));});
			m.connect(dj.byId("adjustment_type"), "onChange", function(){dj.byId("adjustment_type_label").set("value", this.get("displayedValue"));});
			m.connect(dj.byId("tax_type"), "onChange", function(){dj.byId("tax_type_label").set("value", this.get("displayedValue"));});
			m.connect(dj.byId("freight_charge_type"), "onChange", function(){dj.byId("freight_charge_type_label").set("value", this.get("displayedValue"));});
			m.connect(dj.byId("incoterm_code"), "onChange", function(){dj.byId("incoterm_code_label").set("value", this.get("displayedValue"));});
			m.connect(dj.byId("pmt_tds_qty_unit_measr_code"), "onChange", function(){dj.byId("pmt_tds_qty_unit_measr_label").set("value", this.get("displayedValue"));});
			m.connect(dj.byId("pmt_tds_vol_unit_measr_code"), "onChange", function(){dj.byId("pmt_tds_vol_unit_measr_label").set("value", this.get("displayedValue"));});
			m.connect(dj.byId("pmt_tds_weight_unit_measr_code"), "onChange", function(){dj.byId("pmt_tds_weight_unit_measr_label").set("value", this.get("displayedValue"));});

			if (d.byId("adjustment_other_type_row") && d.byId("adjustment_type")) {
				if (dj.byId("adjustment_type").get("value") === "OTHR") {
					m.animate("fadeIn", "adjustment_other_type_row");
				}
				else {
					m.animate("fadeOut", "adjustment_other_type_row");
				}
			}
			
			if (d.byId("tax_other_type_row") && d.byId("tax_type")) {
				if (dj.byId("tax_type").get("value") === "OTHR") {
					m.animate("fadeIn", "tax_other_type_row");
				}
				else {
					m.animate("fadeOut", "tax_other_type_row");
				}
			}
			
			m.connect("adjustment_type", "onChange", function(){
				m.toggleFields((this.get("value") === "OTHR"),
						null, ["adjustment_other_type"]);
				if (dojo.byId("adjustment_other_type_row")) {
					if (this.get("value") === "OTHR") {
						m.animate("fadeIn", "adjustment_other_type_row");
					}
					else {
						m.animate("fadeOut", "adjustment_other_type_row");
					}
				}
			});
			m.connect("ceds_cert_type", "onChange", function(){
				if (dj.byId("ceds_cert_type_hidden")) {
					dj.byId("ceds_cert_type_hidden").set("value", this.get("displayedValue"));
				}
			});
			m.connect("ocds_cert_type", "onChange", function(){
				if (dj.byId("ocds_cert_type_hidden")) {
					dj.byId("ocds_cert_type_hidden").set("value", this.get("displayedValue"));
				}
			});
			m.connect("ids_clauses_required", "onChange", function(){
				if (dj.byId("ids_clauses_required_hidden")) {
					dj.byId("ids_clauses_required_hidden").set("value", this.get("displayedValue"));
				}
			});
			m.connect("tax_type", "onChange", function(){
				m.toggleFields((this.get("value") === "OTHR"),
						null, ["tax_other_type"]);
				if (dojo.byId("tax_other_type_row")) {
					if (this.get("value") === "OTHR")
					{
						m.animate("fadeIn", "tax_other_type_row");
					}
					else
					{
						m.animate("fadeOut", "tax_other_type_row");
					}
				}
			});
			
			if (d.byId("product_category_other_code_row") && d.byId("product_category_code")) {
				if (dj.byId("product_category_code").get("value") === "OTHR") {
					m.animate("fadeIn", "product_category_other_code_row");
				}
				else {
					m.animate("fadeOut", "product_category_other_code_row");
				}
			}
			if (d.byId("product_characteristic_other_code_row") && d.byId("product_characteristic_code")) {
				if (dj.byId("product_characteristic_code").get("value") === "OTHR") {
					m.animate("fadeIn", "product_characteristic_other_code_row");
				}
				else {
					m.animate("fadeOut", "product_characteristic_other_code_row");
				}
			}
			if (d.byId("product_identifier_other_code_row") && d.byId("product_identifier_code")) {
				if (dj.byId("product_identifier_code").get("value") === "OTHR") {
					m.animate("fadeIn", "product_identifier_other_code_row");
				}
				else {
					m.animate("fadeOut", "product_identifier_other_code_row");
				}
			}
			if (d.byId("incoterm_other_row") && d.byId("incoterm_code")) {
				if (dj.byId("incoterm_code").get("value") === "OTHR") {
					m.animate("fadeIn", "incoterm_other_row");
				}
				else {
					m.animate("fadeOut", "incoterm_other_row");
				}
			}
			
			if (d.byId("freight_charge_other_type_row") && d.byId("freight_charge_type")) {
				if (dj.byId("freight_charge_type").get("value") === "OTHR") {
					m.animate("fadeIn", "freight_charge_other_type_row");
				}
				else {
					m.animate("fadeOut", "freight_charge_other_type_row");
				}
			}
			
			if (d.byId("pmt_tds_qty_unit_measr_other_row") && d.byId("pmt_tds_qty_unit_measr_code")) {
				if (dj.byId("pmt_tds_qty_unit_measr_code").get("value") === "OTHR") {
					m.animate("fadeIn", "pmt_tds_qty_unit_measr_other_row");
				}
				else {
					m.animate("fadeOut", "pmt_tds_qty_unit_measr_other_row");
				}
			}
			
			if (d.byId("pmt_tds_vol_unit_measr_other_row") && d.byId("pmt_tds_vol_unit_measr_code")) {
				if (dj.byId("pmt_tds_vol_unit_measr_code").get("value") === "OTHR") {
					m.animate("fadeIn", "pmt_tds_vol_unit_measr_other_row");
				}
				else {
					m.animate("fadeOut", "pmt_tds_vol_unit_measr_other_row");
				}
			}
			
			if (d.byId("pmt_tds_weight_unit_measr_other_row") && d.byId("pmt_tds_weight_unit_measr_code")) {
				if (dj.byId("pmt_tds_weight_unit_measr_code").get("value") === "OTHR") {
					m.animate("fadeIn", "pmt_tds_weight_unit_measr_other_row");
				}
				else {
					m.animate("fadeOut", "pmt_tds_weight_unit_measr_other_row");
				}
			}
			
			m.connect("pmt_tds_qty_unit_measr_code", "onChange", function(){
				m.toggleFields((this.get("value") === "OTHR"),null, ["pmt_tds_qty_unit_measr_other"]);
				if (d.byId("pmt_tds_qty_unit_measr_other_row")) {
					if (this.get("value") === "OTHR") {
						m.animate("fadeIn", "pmt_tds_qty_unit_measr_other_row");
					}
					else {
						m.animate("fadeOut", "pmt_tds_qty_unit_measr_other_row");
					}
				}
			});
			
			m.connect("pmt_tds_vol_unit_measr_code", "onChange", function(){
				m.toggleFields((this.get("value") === "OTHR"),null, ["pmt_tds_vol_unit_measr_other"]);
				if (d.byId("pmt_tds_vol_unit_measr_other_row")) {
					if (this.get("value") === "OTHR") {
						m.animate("fadeIn", "pmt_tds_vol_unit_measr_other_row");
					}
					else {
						m.animate("fadeOut", "pmt_tds_vol_unit_measr_other_row");
					}
				}
			});
			
			m.connect("pmt_tds_weight_unit_measr_code", "onChange", function(){
				m.toggleFields((this.get("value") === "OTHR"),null, ["pmt_tds_weight_unit_measr_other"]);
				if (d.byId("pmt_tds_weight_unit_measr_other_row")) {
					if (this.get("value") === "OTHR") {
						m.animate("fadeIn", "pmt_tds_weight_unit_measr_other_row");
					}
					else {
						m.animate("fadeOut", "pmt_tds_weight_unit_measr_other_row");
					}
				}
			});
			
			m.connect("freight_charge_type", "onChange", function(){
				m.toggleFields((this.get("value") === "OTHR"),
						null, ["freight_charge_other_type"]);
				if (dojo.byId("freight_charge_other_type_row")) {
					if (this.get("value") === "OTHR") {
						m.animate("fadeIn", "freight_charge_other_type_row");
					}
					else {
						m.animate("fadeOut", "freight_charge_other_type_row");
					}
				}
			});
			
			m.connect("incoterm_code", "onChange", function(){
				m.toggleFields((this.get("value") === "OTHR"),
						null, ["incoterm_other"]);
				if (dojo.byId("incoterm_other_row")) {
					if (this.get("value") === "OTHR")
					{
						m.animate("fadeIn", "incoterm_other_row");
					}
					else
					{
						m.animate("fadeOut", "incoterm_other_row");
					}
				}
			});
			m.connect("product_identifier_code", "onChange", function(){
				m.toggleFields((this.get("value") === "OTHR"),
						null, ["product_identifier_other_code"]);
				if (dojo.byId("product_identifier_other_code_row")) {
					if (this.get("value") === "OTHR")
					{
						m.animate("fadeIn", "product_identifier_other_code_row");
					}
					else
					{
						m.animate("fadeOut", "product_identifier_other_code_row");
					}
				}
			});
			m.connect("product_characteristic_code", "onChange", function(){
				m.toggleFields((this.get("value") === "OTHR"),
						null, ["product_characteristic_other_code"]);
				if (dojo.byId("product_characteristic_other_code_row")) {
					if (this.get("value") === "OTHR")
					{
						m.animate("fadeIn", "product_characteristic_other_code_row");
					}
					else
					{
						m.animate("fadeOut", "product_characteristic_other_code_row");
					}
				}
			});
			m.connect("product_category_code", "onChange", function(){
				m.toggleFields((this.get("value") === "OTHR"),
						null, ["product_category_other_code"]);
				if (d.byId("product_characteristic_other_code_row")) {
					if (this.get("value") === "OTHR")
					{
						m.animate("fadeIn", "product_category_other_code_row");
					}
					else
					{
						m.animate("fadeOut", "product_category_other_code_row");
					}
				}
			});
			
			m.connect("contact_type", "onChange", m.setContactDetails);
			
			m.connect(dj.byId("obligor_bank"), "onBlur", function(){ 
				var duplicateBankBicFound = false,
					gridPaymentObligation = dj.byId("bank-payment-obligations");
				m.validateBpoBICFormat(dj.byId("obligor_bank"));
				var obligorBankBic = this.get("value");
				var obligorBankBicOriginal = dj.byId("obligor_bank_hidden").get("value");
				if(obligorBankBic != obligorBankBicOriginal)
				{
					if(gridPaymentObligation && gridPaymentObligation.store && gridPaymentObligation.store._arrayOfTopLevelItems.length > 0 && obligorBankBic != "")
					{
						gridPaymentObligation.store.fetch({
							query:{store_id:"*"},
							onComplete: dojo.hitch(gridPaymentObligation, function(items, request){
								dojo.forEach(items, function(item){
									if(item.obligor_bank[0] === obligorBankBic)
									{
										duplicateBankBicFound = true;
									}
								});
							})
						});
						if(duplicateBankBicFound)
						{
							this.set("value","");
							displayMessage = misys.getLocalization("duplicateBicIdImportOpenAccount",[this.get("value") ]);
							this.focus();
							this.set("state", "Error");
							dj.hideTooltip(this.domNode);
							dj.showTooltip(displayMessage,this.domNode, 0);
						}
					}
				}
				
				// Validation to check that Obligor bank BIC and recipient bank BIC must be different.
				_obligorAndRecipientBICsShouldBeDiff(true);
				
			});
			
			
			//m.onClickCheckPaymentTerms();
			// BPO and other data sets related fields bindings
			// Settlement Terms
			m.connect("settlement_bic","onClick", function() {
				if(dj.byId("creditor_agent_name") && dj.byId("creditor_agent_bic") && dj.byId("creditor_street_name") && 
						dj.byId("creditor_post_code_identification") && dj.byId("creditor_town_name") &&
						 dj.byId("creditor_country_sub_div") && dj.byId("creditor_country") &&
						 dj.byId("settlement_bic") && dj.byId("settlement_bic").get("checked") == true) 
				{
					dj.byId("creditor_agent_bic").set("disabled",false);
					//clear and disable other field
					dj.byId("creditor_agent_name").set("value","");
					dj.byId("creditor_street_name").set("value","");
					dj.byId("creditor_post_code_identification").set("value","");
					dj.byId("creditor_town_name").set("value","");
					dj.byId("creditor_country_sub_div").set("value","");
					dj.byId("creditor_country").set("value","");
					dj.byId("creditor_street_name").set("disabled",true);
					dj.byId("creditor_post_code_identification").set("disabled",true);
					dj.byId("creditor_town_name").set("disabled",true);
					dj.byId("creditor_country_sub_div").set("disabled",true);
					dj.byId("creditor_country").set("disabled",true);
					dj.byId("creditor_agent_name").set("disabled",true);
					
				}
			});
			m.connect("settlement_name_address","onClick", function() {
				if(dj.byId("creditor_agent_name") && dj.byId("creditor_agent_bic") && dj.byId("creditor_street_name") &&
						dj.byId("creditor_post_code_identification") && dj.byId("creditor_town_name") &&
						dj.byId("creditor_country_sub_div") && dj.byId("creditor_country") &&
						 dj.byId("settlement_name_address") && dj.byId("settlement_name_address").get("checked") == true) 
				{
					dj.byId("creditor_agent_name").set("disabled",false);
					dj.byId("creditor_street_name").set("disabled",false);
					dj.byId("creditor_post_code_identification").set("disabled",false);
					dj.byId("creditor_town_name").set("disabled",false);
					dj.byId("creditor_country_sub_div").set("disabled",false);
					dj.byId("creditor_country").set("disabled",false);
					//clear and disable other field
					dj.byId("creditor_agent_bic").set("value","");
					dj.byId("creditor_agent_bic").set("disabled",true);
				}
			});
			m.connect("payment_obligation_amount", "onBlur", function() {
				if(dj.byId("total_net_amt") && dj.byId("oblg_amt")) {
					var totalNetAmt = dj.byId("total_net_amt").get("value");
					var oblgtnAmt = dj.byId("payment_obligation_amount").get("value");
					if(oblgtnAmt > totalNetAmt ) {
						errorMessage =  m.getLocalization("bpoAmountGreaterThanTotalAmtError");
						dj.byId("payment_obligation_amount").set("state","Error");
					    dj.hideTooltip(dj.byId("payment_obligation_amount").domNode);
					    dj.showTooltip(errorMessage, dj.byId("payment_obligation_amount").domNode, 0);
					}
				}
			});
			
			m.connect("bpo_used_status", "onChange", function() {
				if(dj.byId("bpo_used_status") && dj.byId("add_bpo_button") && dj.byId("bpo_used_status").get("checked")=== true)
				{
					dj.byId("add_bpo_button").set("disabled",false);
				}
				else if(dj.byId("bpo_used_status") && dj.byId("add_bpo_button") && dj.byId("bpo_used_status").get("checked")=== false)
				{
					dj.byId("add_bpo_button").set("disabled",true);
					
					// Clear BPO 
					if(dj.byId("bank-payment-obligations")) {
						dj.byId("bank-payment-obligations").clear();
					}
				}		
			});
			// Validations for amount and percentage fields
			m.connect("payment_obligation_amount","onChange",function() {
				m.validateAmount(dj.byId("payment_obligation_amount"));
			});
			m.connect("payment_obligation_percent","onChange",function() {
				m.validateAmount(dj.byId("payment_obligation_percent"));
			});
			m.connect("payment_charges_amount","onChange",function() {
				m.validateAmount(dj.byId("payment_charges_amount"));
			});
			m.connect("payment_charges_percent","onChange",function() {
				m.validateAmount(dj.byId("payment_charges_percent"));
			});
			m.connect("payment_amount","onChange",function() {
				m.validateAmount(dj.byId("payment_amount"));
			});
			m.connect("payment_percent","onChange",function() {
				m.validateAmount(dj.byId("payment_percent"));
			});
			m.connect("cds_bic","onBlur",function() {
				m.validateBpoBICFormat(dj.byId("cds_bic"));
			});
			m.connect("tds_bic","onBlur",function() {
				m.validateBpoBICFormat(dj.byId("tds_bic"));
			});
			m.connect("payment_tds_bic","onBlur",function() {
				m.validateBpoBICFormat(dj.byId("payment_tds_bic"));
			});
			m.connect("ids_bic","onBlur",function() {
				m.validateBpoBICFormat(dj.byId("ids_bic"));
			});
			m.connect("ceds_bic","onBlur",function() {
				m.validateBpoBICFormat(dj.byId("ceds_bic"));
			});
			m.connect("ocds_bic","onBlur",function() {
				m.validateBpoBICFormat(dj.byId("ocds_bic"));
			});
			m.connect("recipient_bank","onBlur",function() {
				m.validateBpoBICFormat(dj.byId("recipient_bank"));
				// Validation that Obligor bank BIC and recipient bank BIC must not be same 
				_obligorAndRecipientBICsShouldBeDiff(false);
			});
			m.connect("creditor_agent_bic","onBlur",function() {
				m.validateBpoBICFormat(dj.byId("creditor_agent_bic"));
			});
			m.connect("buyer_bank_bpo","onClick",function() {
				if(dj.byId("buyer_bank_bpo_added") && dj.byId("buyer_bank_bpo_added").get("value") != "true" && dj.byId("buyer_bank_bpo").get("checked") === true)
				{
					if(dj.byId("obligor_bank") && dj.byId("buyer_bank_bic") && dj.byId("issuing_bank_abbv_name") && dj.byId("issuing_bank_abbv_name").get("value") != "")
					{
						dj.byId("obligor_bank").set("value",dj.byId("buyer_bank_bic").get("value"));
						dj.byId("obligor_bank").set("disabled",true);
					}
					else if(dj.byId("obligor_bank") && dj.byId("buyer_bank_bic") && dj.byId("issuing_bank_abbv_name") && dj.byId("issuing_bank_abbv_name").get("value") === "")
					{
						dj.byId("buyer_bank_bpo").set("checked",false);
						m.dialog.show("ERROR", m.getLocalization("selectBuyerBank"), "", function(){});
					}
				}
				else if(dj.byId("buyer_bank_bpo_added") && dj.byId("buyer_bank_bpo_added").get("value") != "true" && dj.byId("buyer_bank_bpo").get("checked") === false)
				{
					dj.byId("obligor_bank").set("value","");
					dj.byId("obligor_bank").set("disabled",false);
				}
				else if(dj.byId("buyer_bank_bpo_added") && dj.byId("buyer_bank_bpo_added").get("value") != "false" && dj.byId("buyer_bank_bpo").get("checked") === false)
				{
					dj.byId("buyer_bank_bpo_added").set("value",false);
					dj.byId("obligor_bank").set("value","");
					dj.byId("obligor_bank").set("disabled",false);
				}
			});
			// Bank Payment Obligation section ends--
			
			//Edit Mode of CLose
			if(dj.byId("tnxtype") && dj.byId("tnxtype").get("value") === "38" && dj.byId("close_tnx"))
			{
				dj.byId("close_tnx").set("checked", true); 
				d.style(d.byId("transactionDetails"), "display", "none");
				d.style(d.byId("buyerSellerDetails"), "display", "none");
				d.style(d.byId("closeComments"), "display", "block");
				if(dj.byId("exp_date"))
				{
					dj.byId("exp_date").set("readOnly", true);
				}
				if(dj.byId("bpo_used_status"))
				{
					dj.byId("bpo_used_status").set("disabled", true);
				}
			}
			//Unsigned
			if(dj.byId("tnxtype") && dj.byId("tnxtype").get("value") === "38")
			{
				d.style(d.byId("transactionDetails"), "display", "none");
				d.style(d.byId("buyerSellerDetails"), "display", "none");
				d.style(d.byId("closeComments"), "display", "block");
			}
			
			m.connect("close_tnx","onClick",function() {
				var fieldsToToggle = ["bill_to_name","bill_to_town_name","bill_to_post_code","bill_to_country",
				                      "ship_to_name","ship_to_town_name","ship_to_post_code","ship_to_country",
				                      "consgn_name","consgn_town_name","consgn_post_code","consgn_country",
				                      "issuing_bank_customer_reference","total_cur_code","total_net_amt","fin_inst_bic",
				                      "fin_inst_name","fin_inst_post_code","fin_inst_town_name","fin_inst_country",
				                      "seller_account_iban","seller_account_bban","seller_account_upic","seller_account_id",
				                      "seller_account_type_code","seller_account_type_prop"];
				//Close checked
				if(dj.byId("close_tnx") && (dj.byId("close_tnx").get("checked") === true)) 
				{
					origialFieldState = {};
					d.style(d.byId("transactionDetails"), "display", "none");
					d.style(d.byId("buyerSellerDetails"), "display", "none");
					d.style(d.byId("closeComments"), "display", "block");
					dj.byId("tnxtype").set("value", "38");
					dj.byId("exp_date").set("readOnly", true);
					dj.byId("exp_date").set("value", null);
					dj.byId("bpo_used_status").set("disabled", true);
					
					for(var i in fieldsToToggle)
					{
						if(dj.byId(fieldsToToggle[i]))
						{
							origialFieldState[fieldsToToggle[i]] = dj.byId(fieldsToToggle[i]).get("required"); 
							m.toggleRequired(fieldsToToggle[i],false);
						}				
					}
					//Reset the warnings. 
					misys._config.warningMessages = [];
				}
				//Re-submit
				else if(dj.byId("close_tnx") && (dj.byId("close_tnx").get("checked") === false))
				{
					var maxBpodate = m.getMaxBPOExpDate();
					d.style(d.byId("transactionDetails"), "display", "block");
					d.style(d.byId("buyerSellerDetails"), "display", "block");
					d.style(d.byId("closeComments"), "display", "none");
					dj.byId("tnxtype").set("value", "31");
					dj.byId("exp_date").set("readOnly", false);
					dj.byId("exp_date").set("value",maxBpodate);
					dj.byId("bpo_used_status").set("disabled", false);
					
					for(var j in origialFieldState)
					{
						if(dj.byId(j))
						{
							m.toggleRequired(j,origialFieldState[j]);						
						}
					}
					
					//Validate the resubmission count
					m.validateResubmissionCount();
					
					//Call this to display all the dojo grid multiple items, like line-items, payment terms etc.
					m.resizeGrids();
					
				}
			});
			m.connect("settlement_bic" , "onChange", function() {
				if(dj.byId("settlement_bic") && dj.byId("settlement_bic").get("checked") === true)
				{
					d.style(d.byId("CreditorAgentBIC"), "display", "block");
					dj.byId("creditor_agent_bic").set("required",true);
					d.style(d.byId("CreditorAgentName"), "display", "none");
					dj.byId("creditor_agent_name").set("required",false);
					dj.byId("creditor_post_code_identification").set("required",false);
					dj.byId("creditor_town_name").set("required",false);
					dj.byId("creditor_country").set("required",false);
				}
			});
			m.connect("settlement_name_address" , "onChange", function() {
				if(dj.byId("settlement_name_address") && dj.byId("settlement_name_address").get("checked")=== true)
				{
					d.style(d.byId("CreditorAgentName"), "display", "block");
					dj.byId("creditor_agent_name").set("required",true);
					dj.byId("creditor_post_code_identification").set("required",true);
					dj.byId("creditor_town_name").set("required",true);
					dj.byId("creditor_country").set("required",true);
					d.style(d.byId("CreditorAgentBIC"), "display", "none");
					dj.byId("creditor_agent_bic").set("required",false);
				}
			});
			m.connect("creditor_account_iban","onChange", function() {
				if(dj.byId("creditor_account_iban") && dj.byId("creditor_account_iban").get("checked")=== true) {
					dojo.style(dojo.byId("creditor_account_id_iban_row"), "display", "block");
					dj.byId("creditor_account_id_prop").set("required",true);
					dojo.style(dojo.byId("creditor_account_id_bban_row"), "display", "none");
					dj.byId("creditor_account_id_bban").set("value","");
					dj.byId("creditor_account_id_bban").set("required",false);
					dojo.style(dojo.byId("creditor_account_id_upic_row"), "display", "none");
					dj.byId("creditor_account_id_upic").set("value","");
					dj.byId("creditor_account_id_upic").set("required",false);
					dojo.style(dojo.byId("creditor_account_id_prop_row"), "display", "none");
					dj.byId("creditor_account_id_prop").set("value","");
					dj.byId("creditor_account_id_prop").set("required",false);
				}
			});
			m.connect("creditor_account_bban","onChange", function() {
				if(dj.byId("creditor_account_bban") && dj.byId("creditor_account_bban").get("checked")=== true) {
					d.style(d.byId("creditor_account_id_iban_row"), "display", "none");
					dj.byId("creditor_account_id_iban").set("value","");
					dj.byId("creditor_account_id_iban").set("required",false);
					d.style(d.byId("creditor_account_id_bban_row"), "display", "block");
					dj.byId("creditor_account_id_bban").set("required",true);
					dj.byId("creditor_account_id_upic").set("value","");
					dj.byId("creditor_account_id_upic").set("required",false);
					d.style(d.byId("creditor_account_id_upic_row"), "display", "none");
					dj.byId("creditor_account_id_prop").set("value","");
					dj.byId("creditor_account_id_prop").set("required",false);
					dojo.style(dojo.byId("creditor_account_id_prop_row"), "display", "none");
				}
			});
			m.connect("creditor_account_upic","onChange", function() {
				if(dj.byId("creditor_account_upic") && dj.byId("creditor_account_upic").get("checked")=== true) {
					d.style(dojo.byId("creditor_account_id_iban_row"), "display", "none");
					dj.byId("creditor_account_id_iban").set("value","");
					dj.byId("creditor_account_id_iban").set("required",false);
					d.style(d.byId("creditor_account_id_bban_row"), "display", "none");
					dj.byId("creditor_account_id_bban").set("value","");
					dj.byId("creditor_account_id_bban").set("required",false);
					d.style(d.byId("creditor_account_id_upic_row"), "display", "block");
					dj.byId("creditor_account_id_upic").set("required",true);
					d.style(d.byId("creditor_account_id_prop_row"), "display", "none");
					dj.byId("creditor_account_id_prop").set("value","");
					dj.byId("creditor_account_id_prop").set("required",false);
				}
			});
			m.connect("creditor_account_prop","onChange", function() {
				if(dj.byId("creditor_account_prop") && dj.byId("creditor_account_prop").get("checked")=== true) {
					dojo.style(dojo.byId("creditor_account_id_iban_row"), "display", "none");
					dj.byId("creditor_account_id_iban").set("value","");
					dj.byId("creditor_account_id_iban").set("required",false);
					dojo.style(dojo.byId("creditor_account_id_bban_row"), "display", "none");
					dj.byId("creditor_account_id_bban").set("value","");
					dj.byId("creditor_account_id_bban").set("required",false);
					dojo.style(dojo.byId("creditor_account_id_upic_row"), "display", "none");
					dj.byId("creditor_account_id_upic").set("value","");
					dj.byId("creditor_account_id_upic").set("required",false);
					dojo.style(dojo.byId("creditor_account_id_prop_row"), "display", "block");
					dj.byId("creditor_account_id_prop").set("required",true);
				}
			});
			m.connect("creditor_act_type_code","onChange", function() {
				if(dj.byId("creditor_act_type_code") && dj.byId("creditor_act_type_code").get("checked")=== true) {
					dojo.style(dojo.byId("creditor_account_type_prop_row"), "display", "none");
					dj.byId("creditor_account_type_prop").set("value","");
					dj.byId("creditor_account_type_prop").set("required",false);
					dojo.style(dojo.byId("creditor_account_type_code_row"), "display", "block");
					dj.byId("creditor_account_type_code").set("required",true);
				}
			});
			m.connect("creditor_act_type_prop","onChange", function() {
				if(dj.byId("creditor_act_type_prop") && dj.byId("creditor_act_type_prop").get("checked")=== true) {
					dojo.style(dojo.byId("creditor_account_type_prop_row"), "display", "block");
					dj.byId("creditor_account_type_prop").set("required",true);
					dj.byId("creditor_account_type_code").set("value","");
					dj.byId("creditor_account_type_code").set("required",false);
					dojo.style(dojo.byId("creditor_account_type_code_row"), "display", "none");
				}
			});
			m.connect("pmt_code","onChange", function() {
				if(dj.byId("pmt_code") && dj.byId("pmt_code").get("checked")=== true) {
					dojo.style(dojo.byId("paymentCode"), "display", "block");
					dj.byId("payment_nb_days").set("disabled",false);
					dj.byId("payment_code").set("disabled",false);
					dj.byId("payment_code").set("required",true);
					dj.byId("payment_other_term").set("required",false);
					dj.byId("payment_other_term").set("value","");
					dojo.style(dojo.byId("payment_other_term_row"), "display", "none");
				}
			});
			m.connect("pmt_other_term_code","onChange", function() {
				if(dj.byId("pmt_other_term_code") && dj.byId("pmt_other_term_code").get("checked")=== true) {
					dojo.style(dojo.byId("paymentCode"), "display", "none");
					dj.byId("payment_code").set("value","");
					dj.byId("payment_nb_days").set("value","");
					dojo.style(dojo.byId("payment_other_term_row"), "display", "block");
					dj.byId("payment_other_term").set("disabled",false);
					dj.byId("payment_code").set("required",false);
					dj.byId("payment_other_term").set("required",true);
				}
			});
			
			m.connect("payment_obligation_amount","onChange", function() {
				m.toggleMutuallyExclusiveMandatoryFields(["payment_obligation_amount","payment_obligation_percent"]);
			});
			m.connect("payment_obligation_amount","onBlur", function() {
				m.toggleMutuallyExclusiveMandatoryFields(["payment_obligation_amount","payment_obligation_percent"]);
			});
			m.connect("payment_obligation_percent","onChange", function() {
				m.toggleMutuallyExclusiveMandatoryFields(["payment_obligation_amount","payment_obligation_percent"]);
			});
			m.connect("payment_obligation_percent","onBlur", function() {
				m.toggleMutuallyExclusiveMandatoryFields(["payment_obligation_amount","payment_obligation_percent"]);
			});
			m.connect("payment_charges_amount","onChange", function() {
				m.toggleMutuallyExclusiveFields(["payment_charges_amount","payment_charges_percent"]);
			});
			m.connect("payment_charges_amount","onBlur", function() {
				m.toggleMutuallyExclusiveFields(["payment_charges_amount","payment_charges_percent"]);
			});
			m.connect("payment_charges_percent","onChange", function() {
				m.toggleMutuallyExclusiveFields(["payment_charges_amount","payment_charges_percent"]);
			});
			m.connect("payment_charges_percent","onBlur", function() {
				m.toggleMutuallyExclusiveFields(["payment_charges_amount","payment_charges_percent"]);
			});
			m.connect("payment_amount","onChange", function() {
				m.toggleMutuallyExclusiveMandatoryFields(["payment_amount","payment_percent"]);
			});
			m.connect("payment_amount","onBlur", function() {
				m.toggleMutuallyExclusiveMandatoryFields(["payment_amount","payment_percent"]);
			});
			m.connect("payment_percent","onChange", function() {
				m.toggleMutuallyExclusiveMandatoryFields(["payment_amount","payment_percent"]);
			});
			m.connect("payment_percent","onBlur", function() {
				m.toggleMutuallyExclusiveMandatoryFields(["payment_amount","payment_percent"]);
			});
			
			/*m.connect("pmt_term_code","onChange", function() {
				if(d.byId("paymentTermCode") && dijit.byId("details_code") && dijit.byId("details_code").get("value") !== "") {
					dijit.byId("details_code").set("disabled",false);
					dijit.byId("details_nb_days").set("disabled",false);
				}
				else if(dijit.byId("details_code") && dijit.byId("details_nb_days") && dijit.byId("pmt_term_code")) {
					dijit.byId("details_code").set("disabled",false);
					dijit.byId("details_nb_days").set("disabled",false);
				}
			});*/
			
			m.connect("seller_name","onChange", function() {
				if(dj.byId("seller_name") && dj.byId("seller_name").get("value") !== "" && (dj.byId("tnxtype") && dj.byId("tnxtype").get("value") ==="01")) {
					dj.byId("seller_name").set("readOnly",false);
					dj.byId("seller_street_name").set("readOnly", false);
					dj.byId("seller_town_name").set("readOnly", false);
					dj.byId("seller_country_sub_div").set("readOnly", false);
					dj.byId("seller_post_code").set("readOnly", false);
				}
			});
			
			//Validate the resubmission count
			if(dj.byId("tnxtype") && dj.byId("tnxtype").get("value") !== "38")
			{
				m.validateResubmissionCount();				
			}
		},

		/**
		 * This function performs several events when page loads
		 * @method onFormLoad
		 */
		onFormLoad : function() {
			//  summary:
			//          Events to perform on page load.
			//  tags:
			//         public
			//Checking product status and transaction type code to make some buyer and seller details readOnly for IO amendment.
			formXml = m.formToXML();
			var productStatus = dj.byId("prodstatus");
			var tnxtype = dj.byId("tnxtype");
			if((productStatus && productStatus.get("value") === "43") || (tnxtype && tnxtype.get("value") === "03"))
			{
				//Making the provisional as true for amendment by default.
				//TODO Scenario- Handle amendment is not provisional
				if(dj.byId("provisional_status"))
				{
					dj.byId("provisional_status").set("value","Y");
				}
				if(dj.byId("buyer_name"))
				{
					dj.byId("buyer_name").set("readOnly",true);
				}
				if(dj.byId("buyer_country"))
				{
					dj.byId("buyer_country").set("readOnly",true);
				}
				if(dj.byId("seller_country"))
				{
					dj.byId("seller_country").set("readOnly",true);
				}
				if(dj.byId("seller_name"))
				{
					dj.byId("seller_name").set("readOnly",true);
				}
			}
			
			// Show/hide other parties section
			var displayOtherParties = dj.byId("display_other_parties");
			if(displayOtherParties) {
				m.showHideOtherParties();
				misys.toggleCountryFields(false,["bill_to_country","ship_to_country","consgn_country"]);
			}
		    
			// Enable/disable the add line item button
			m.toggleDisableButtons();
			// disabled the add payment term button
			if (dj.byId("add_payment_term_button") && !((dj.byId("payment_terms_type_1") && dj.byId("payment_terms_type_1").get("checked"))||(dj.byId("payment_terms_type_2") && dj.byId("payment_terms_type_2").get("checked")))){
				dj.byId("add_payment_term_button").set("disabled", true);
			}
			// Populate references
			var issuingBankAbbvName = dj.byId("issuing_bank_abbv_name");
			if(issuingBankAbbvName)
			{
				issuingBankAbbvName.onChange();
				//Set the value selected if any

			}
			var issuingBankCustRef = dj.byId("issuing_bank_customer_reference");
			if(issuingBankCustRef)
			{
				issuingBankCustRef.onChange();
				//Set the value selected if any
				issuingBankCustRef.set("value",issuingBankCustRef._resetValue);
			}
			
			var acceptedTtlAmt = dj.byId('accpt_total_amt');
			var acceptedTtlNetAmt = dj.byId('accpt_total_net_amt');
			var pendingTtlAmt = dj.byId('pending_total_amt');
			var pendingTtlNetAmt = dj.byId('pending_total_net_amt');
			
			var acceptedAmt = dj.byId('accpted_amt');
			var pendingAmt = dj.byId('pending_amt');
			var paidAmt = dj.byId('paid_total_net_amt');
			var outstandingAmt = dj.byId('outstanding_amt');
			var outstandingAmtCurCode = dj.byId('outstanding_amt_cur_code');
			var acceptedAmtCurCode = dj.byId('accpted_amt_cur_code');
			var paidAmtCurCode = dj.byId('pending_amt_cur_code');
			var pendingAmtCurCode = dj.byId('paid_amt_cur_code');
			
			
			if(acceptedTtlAmt)
			{
				if(isNaN(acceptedTtlAmt.get("value")))
				{
					acceptedTtlAmt.set("value",0);
				}
				else
				{
					acceptedTtlAmt.set("value",acceptedTtlAmt.get("value"));
				}
			}
			if(acceptedTtlNetAmt)
			{
				if(isNaN(acceptedTtlNetAmt.get("value")))
				{
					acceptedTtlNetAmt.set("value",0);
				}
				else
				{
					acceptedTtlNetAmt.set("value",acceptedTtlNetAmt.get("value"));
				}
			}
			if(pendingTtlAmt)
			{
				pendingTtlAmt.set("value",0);
			}	
			if(pendingTtlNetAmt)
			{
				pendingTtlNetAmt.set("value",0);
			}
			if(acceptedAmt)
			{
				acceptedAmt.set("value",0);
			}	
			if(pendingAmt)
			{
				pendingAmt.set("value",0);
			}	
			if(paidAmt)
			{
				paidAmt.set("value",0);
			}	
			if(outstandingAmt)
			{
				outstandingAmt.set("value",0);
			}
			if(outstandingAmtCurCode)
			{
				outstandingAmtCurCode.set("value",dj.byId("total_net_cur_code").get("value"));
			}
			if(acceptedAmtCurCode)
			{
				acceptedAmtCurCode.set("value",dj.byId("total_net_cur_code").get("value"));
			}
			if(paidAmtCurCode)
			{
				paidAmtCurCode.set("value",dj.byId("total_net_cur_code").get("value"));
			}
			if(pendingAmtCurCode)
			{
				pendingAmtCurCode.set("value",dj.byId("total_net_cur_code").get("value"));
			}
			
			//compute total amount after load of data if they exist.
			m.computePOTotalAmount();
			
			m.managePOCurrency();
			
			if(dj.byId("finance_cur_code") && dj.byId("finance_amt") && isNaN(dj.byId("finance_amt").get("value")))
			{
				if(dj.byId("intent_to_pay_amt") && dj.byId("intent_to_pay_amt").get("value") != "")
				{
					dj.byId("finance_cur_code").set("value",dj.byId("total_net_cur_code").get("value"));
					dj.byId("finance_amt").set("value",dj.byId("intent_to_pay_amt").get("value"));
				}
				else
				{
					dj.byId("finance_cur_code").set("value",dj.byId("total_net_cur_code").get("value"));
					dj.byId("finance_amt").set("value",dj.byId("total_net_amt").get("value"));
				}
			}
				
			// Onload event handling for Bank Payment Obligation section
			// BPO section
			if(dj.byId("payment_obligation_amount") && dj.byId("payment_obligation_amount").get("value") !== "") {
				dj.byId("payment_obligation_amount").set("disabled",false);
			}
			else {
				dj.byId("payment_obligation_amount").set("disabled",true);
			}
			if(dj.byId("payment_obligation_percent") && dj.byId("payment_obligation_percent").get("value") !== "") {
				dj.byId("payment_obligation_percent").set("disabled",false);
			}
			else {
				dj.byId("payment_obligation_percent").set("disabled",true);
			}
			
			//Clear the BPO Expiry Date on form load for Copy From EA.
			if(dj.byId("isCopyFrom") && dj.byId("isCopyFrom").get("value") === "Y"){
				m.clearBpoExpiryDateOnLoad();
			}
			
			// BPO Settlement Terms
			if(dj.byId("creditor_agent_bic") && dj.byId("settlement_bic") && (dj.byId("settlement_bic").get("checked") != true)) {
				dj.byId("creditor_agent_bic").set("disabled",true);
				dj.byId("creditor_agent_bic").set("required",false);
			} 
			else if(dj.byId("creditor_agent_bic")) {
				dj.byId("creditor_agent_bic").set("disabled",false);
			}
			if(dj.byId("creditor_agent_name") && dj.byId("creditor_street_name") &&
					dj.byId("creditor_post_code_identification") && dj.byId("creditor_town_name") &&
					dj.byId("creditor_country_sub_div") && dj.byId("creditor_country") &&
					dj.byId("settlement_name_address") && (dj.byId("settlement_name_address").get("checked") != true)) {
				dj.byId("creditor_agent_name").set("disabled",true);
				dj.byId("creditor_street_name").set("disabled",true);
				dj.byId("creditor_post_code_identification").set("disabled",true);
				dj.byId("creditor_town_name").set("disabled",true);
				dj.byId("creditor_country_sub_div").set("disabled",true);
				dj.byId("creditor_country").set("disabled",true);
				dj.byId("creditor_agent_name").set("required",false);
				dj.byId("creditor_post_code_identification").set("required",false);
				dj.byId("creditor_town_name").set("required",false);
				dj.byId("creditor_country").set("required",false);
			} 
			else if(dj.byId("creditor_agent_name") && dj.byId("creditor_street_name") &&
					 dj.byId("creditor_post_code_identification") && dj.byId("creditor_town_name") &&
					 dj.byId("creditor_country_sub_div") && dj.byId("creditor_country")) {
				dj.byId("creditor_agent_name").set("disabled",false);
				dj.byId("creditor_street_name").set("disabled",false);
				dj.byId("creditor_post_code_identification").set("disabled",false);
				dj.byId("creditor_town_name").set("disabled",false);
				dj.byId("creditor_country_sub_div").set("disabled",false);
				dj.byId("creditor_country").set("disabled",false);
			}
			
			if(dj.byId("creditor_account_iban") && dj.byId("creditor_account_iban").get("checked")=== true) {
				dojo.style(dojo.byId("creditor_account_id_iban_row"), "display", "block");
				dj.byId("creditor_account_id_iban").set("required",true);
			}
			else if(dj.byId("creditor_account_iban")) {
				dojo.style(dojo.byId("creditor_account_id_iban_row"), "display", "none");
				dj.byId("creditor_account_id_iban").set("required",false);
			}
			if(dj.byId("creditor_account_bban") && dj.byId("creditor_account_bban").get("checked")=== true) {
				dojo.style(dojo.byId("creditor_account_id_bban_row"), "display", "block");
				dj.byId("creditor_account_id_bban").set("required",true);
			}
			else if(dj.byId("creditor_account_bban")) {
				dojo.style(dojo.byId("creditor_account_id_bban_row"), "display", "none");
				dj.byId("creditor_account_id_bban").set("required",false);
			}
			if(dj.byId("creditor_account_upic") && dj.byId("creditor_account_upic").get("checked")=== true) {
				dojo.style(dojo.byId("creditor_account_id_upic_row"), "display", "block");
				dj.byId("creditor_account_id_upic").set("required",true);
			}
			else if(dj.byId("creditor_account_upic")) {
				dojo.style(dojo.byId("creditor_account_id_upic_row"), "display", "none");
				dj.byId("creditor_account_id_upic").set("required",false);
			}
			if(dj.byId("creditor_account_prop") && dj.byId("creditor_account_prop").get("checked")=== true) {
				dojo.style(dojo.byId("creditor_account_id_prop_row"), "display", "block");
				dj.byId("creditor_account_id_prop").set("required",true);
			}
			else if(dj.byId("creditor_account_prop")) {
				dojo.style(dojo.byId("creditor_account_id_prop_row"), "display", "none");
				dj.byId("creditor_account_id_prop").set("required",false);
			}
			if(dj.byId("pmt_other_term_code") && dj.byId("pmt_other_term_code").get("checked")=== true) {
				dojo.style(dojo.byId("payment_other_term_row"), "display", "block");
				dj.byId("payment_other_term").set("required",true);
			}
			else if(dj.byId("pmt_other_term_code")) {
				dojo.style(dojo.byId("payment_other_term_row"), "display", "none");
				dj.byId("payment_other_term").set("required",false);
			}
			if(dj.byId("pmt_code") && dj.byId("pmt_code").get("checked")=== true) {
				dojo.style(dojo.byId("paymentCode"), "display", "block");
				dj.byId("payment_code").set("required",true);
			}
			else if(dj.byId("pmt_code")) {
				dojo.style(dojo.byId("paymentCode"), "display", "none");
				dj.byId("payment_code").set("required",false);
			}
			if(dj.byId("creditor_act_type_prop") && dj.byId("creditor_act_type_prop").get("checked")=== true) {
				dojo.style(dojo.byId("creditor_account_type_prop_row"), "display", "block");
				dj.byId("creditor_account_type_prop").set("required",true);
			}
			else if(dj.byId("creditor_act_type_prop")) {
				dojo.style(dojo.byId("creditor_account_type_prop_row"), "display", "none");
				dj.byId("creditor_account_type_prop").set("required",false);
			}
			if(dj.byId("creditor_act_type_code") && dj.byId("creditor_act_type_code").get("checked")=== true) {
				dojo.style(dojo.byId("creditor_account_type_code_row"), "display", "block");
				dj.byId("creditor_account_type_code").set("required",true);
			}
			else if(dj.byId("creditor_act_type_code")) {
				dojo.style(dojo.byId("creditor_account_type_code_row"), "display", "none");
				dj.byId("creditor_account_type_code").set("required",false);
			}
			
			// Settlement terms 
			m.oaOnLoadActions();
			
			// Enable disable buttons to add BPO
			if(dj.byId("bpo_used_status") && dj.byId("add_bpo_button") && dj.byId("bpo_used_status").get("checked")=== true)
			{
				dj.byId("add_bpo_button").set("disabled",false);
			}
			else if(dj.byId("bpo_used_status") && dj.byId("add_bpo_button") && dj.byId("bpo_used_status").get("checked")=== false)
			{
				dj.byId("add_bpo_button").set("disabled",true);
			}
			var gridPaymentObligation = dj.byId("bank-payment-obligations");
			var bpoAddedFlag = false;
			if(gridPaymentObligation && gridPaymentObligation.store && gridPaymentObligation.store._arrayOfTopLevelItems)
			{
				gridPaymentObligation.store.fetch({
					query:{store_id:"*"},
					onComplete: dojo.hitch(gridPaymentObligation, function(items, request){
						dojo.forEach(items, function(item){
							if(item.buyer_bank_bpo[0] === "Y")
							{
								dj.byId("buyer_bank_bpo_added").set("value",true);
								bpoAddedFlag = true;
							}
						});
					})
				});
				if(!bpoAddedFlag)
				{
					dj.byId("buyer_bank_bpo_added").set("value",false);
				}
			}
			
			// Validation that Obligor bank BIC and recipient bank BIC must not be same.
			_obligorAndRecipientBICsShouldBeDiff(true);
			
			// Setting it as true in onFormLoad so that it skips the issuing_bank_abbv_name onchange event which is called before onFormLoad. 
			_validateBuyerBankBpo = "true";
		},
		/**
		 * This function performs validation on entity before saving the page.
		 * @method beforeSaveValidations
		 * @returns boolean(valid=true/false)
		 */
		beforeSaveValidations : function(){
			
			var valid = true;
			var error_message = "";
			var entity = dj.byId("entity") ;
			
			 if(entity && entity.get("value") === "")
			 	{
				 valid =  false;
			 	}
			 return valid; 

		},
		
		/**
		 * This function performs different validation on mandatory fields before submitting the form.
		 * @method beforeSubmitValidation
		 * @returns boolean(valid=true/false)
		 */
		beforeSubmitValidations : function() {
			
			var valid = true,
				error_message = "",
				payments = dj.byId("po-payments"),
				lineItems = dj.byId("line-items"),
				gridPaymentObligation = dj.byId("bank-payment-obligations"),
				commercialDs =dj.byId("commercial-ds"),
				sumAmt = 0,
				totalAmtField = dj.byId("total_net_amt"),
				contactDetails = dj.byId("contact-details"),
			    bpoExpiryError = false,
			    bpoCreditorAccountIdError = false,
		        partialShipNotAllowed = dj.byId('part_ship_2') ? dj.byId('part_ship_2').get('checked') : false,
		        buyerbic = dj.byId("buyer_bank_bic"),
				sellerbic= dj.byId("seller_bank_bic");
			
			//Validate close comments only, for close EA.
			if(dj.byId("tnxtype") && dj.byId("tnxtype").get("value") === "38" ){
				closeComments = dj.byId("close_comments");
				 if(closeComments && dojo.string.trim(closeComments.get("value")) === ""){
					 closeComments.set("required",true);
					 valid = false;
					 error_message = m.getLocalization("closeCommentsMandatory");
				 }
				 m._config.onSubmitErrorMsg =  error_message;
				 return valid;
			}
			else
			{
				//Don't include any of the following validations for close.
					m.checkPoReferenceExistsIO();
					if(dj.byId("issuer_ref_id") && dj.byId("issuer_ref_id").get("state") === "Error"){
						error_message += m.getLocalization("mandatoryPOReferenceError");
						valid = false;
					}
					
					if (!payments || !payments.store || payments.store._arrayOfTopLevelItems.length <= 0) {
						error_message += m.getLocalization("mandatoryPaymentTermError");
						valid = false;
					}
					
					if(!lineItems || !lineItems.store || lineItems.store._arrayOfTopLevelItems.length <= 0 ) {
						if (error_message !== ""){
							error_message += "<br>";
						}
						error_message += misys.getLocalization("mandatoryLineItemError");
						valid = false;
					}
					
					if(dj.byId("tnxtype") && dj.byId("tnxtype").get("value") !== "61" )
					{
						if(!contactDetails || !contactDetails.store || contactDetails.store._arrayOfTopLevelItems.length <= 0 ) 
						{
							if (error_message !== ""){
								error_message += "<br>";
							}
							error_message += misys.getLocalization("mandatoryContactBuyerOrSellerBankError");
							valid = false;
						}
						
						if(contactDetails && contactDetails.store !== null && contactDetails.store._arrayOfTopLevelItems.length >0)
						{ 
							var flag = true;
							var length = contactDetails.store._arrayOfTopLevelItems.length;
							for (var i = 0 ; i <length ; i++ )
							{
								var currentObject = contactDetails.store._arrayOfTopLevelItems[i];
								if(currentObject !== null && (currentObject.type[0] === "04" || currentObject.type[0] === "03")){
									flag = false;
								}
			                }
							if(flag === true){
								if (error_message !== ""){
									error_message += "<br>";
								}
								error_message += misys.getLocalization("mandatoryContactBuyerOrSellerBankError");
								valid = false;
							}
						}
					}
					
                   //Sum of Payment Amount/Percentage should be equal to Total Net Amount								
					if(totalAmtField && payments.store && payments.store._arrayOfTopLevelItems.length > 0)
						{
							var sumPaymentAmt = 0;
							var	Amt= 0;
							var totalNetAmt = parseFloat(dijit.byId("total_net_amt").get("value"));
							//Payment amount/percentage check with the total net amount.
							
							payments.store.fetch({
									query:{store_id:"*"},
									onComplete: dojo.hitch(payments, function(items, request){
										dojo.forEach(items, function(item){
											
											if(item.amt[0] != "")
												{
												sumPaymentAmt = sumPaymentAmt + parseFloat(item.amt[0].replace(",",""));
												}
												else if(item.pct[0] != "")
												{
													Amt = (parseFloat(item.pct[0])/100)*totalNetAmt ;
													sumPaymentAmt = sumPaymentAmt + Amt;
												}
											});
									    })
								    });
								
								if(sumPaymentAmt != totalNetAmt)
								{
									if (error_message !== ""){
										error_message += "<br>";
									}
									error_message += misys.getLocalization("paymentAmtOrPercentage");
									valid = false;
								}
						}
					if(dj.byId("tnxtype") && dj.byId("tnxtype").get("value") !== "61" )
					{
						// Multiple payment terms should not be present when Partial Shipments is Not Allowed
						if(partialShipNotAllowed && payments.store && payments.store._arrayOfTopLevelItems.length > 1)
						{
								if (error_message !== ""){
									error_message += "<br>";
								}
									error_message += misys.getLocalization("multiplePaymentTermsError");
									valid = false;
						}					
					
						if(!commercialDs || !commercialDs.store || commercialDs.store._arrayOfTopLevelItems.length <= 0) {
							if (error_message !== ""){
								error_message += "<br>";
							}
							error_message += misys.getLocalization("mandatoryCommercialDatasetError");
							valid = false;
						}
						
						// check for commercial data set bic should be same as seller bank bic
						if(dj.byId("seller_bank_bic") && commercialDs && commercialDs.store && commercialDs.store._arrayOfTopLevelItems.length > 0) {
							var sellerBankBic = dj.byId("seller_bank_bic").get("value");
							commercialDs.store.fetch({
								query:{store_id:"*"},
								onComplete: dojo.hitch(commercialDs, function(items, request){
									dojo.forEach(items, function(item){
										if(item.BIC[0] !== sellerBankBic) {
											error_message += misys.getLocalization("commercialDatasetBicSellerBicError");
											valid = false;
										}
									});
								})
							});
						}
					}
					//Check if the total amount for BPO is greater than IO amount.
					if(totalAmtField && gridPaymentObligation && gridPaymentObligation.store && gridPaymentObligation.store._arrayOfTopLevelItems)
					{
						var totalAmt= totalAmtField.get("value");
						gridPaymentObligation.store.fetch({
							query:{store_id:"*"},
							onComplete: dojo.hitch(gridPaymentObligation, function(items, request){
								dojo.forEach(items, function(item){
								//If Amount is given add the amount to calculate total amount.
									if(item.payment_obligation_amount[0] !== "")
									{
										sumAmt = sumAmt + parseInt(item.payment_obligation_amount[0],10);
									}
									//If Percentage is given, convert it to amount add it to calculate total amount.
									else if(item.payment_obligation_percent[0] !== "")
									{
										paymentOblgAmt = (parseInt(item.payment_obligation_percent[0],10)/100)*parseInt(totalAmt,10);
										sumAmt = sumAmt + paymentOblgAmt;
									}
									// check for BPO expiry date if present (copy from scenario)
									if(item.payment_expiry_date[0] === "")
									{
										bpoExpiryError = true;
									}
									// check for BPO creditor account Id type
									if(item.creditor_account_id_iban[0] === "" && item.creditor_account_id_bban[0] === "" && item.creditor_account_id_upic[0] === "" && item.creditor_account_id_prop[0] === "")
									{
										bpoCreditorAccountIdError= true;
									}
								});
							})
						});
						if(sumAmt > totalAmt)
						{
							valid = false;
							error_message = m.getLocalization("BpoSumMoreThanEaAmount");
						}
						if(bpoExpiryError) {
							if (error_message !== ""){
								error_message += "<br>";
							}
							error_message += m.getLocalization("bpoExpiryDateNotPresent");
							valid = false;
						}
						if(bpoCreditorAccountIdError) {
							if (error_message !== ""){
								error_message += "<br>";
							}
							error_message += m.getLocalization("bpoCreditorAccIdTypeError");
							valid = false;
						}
					}
					
					// validation for BIC. buyer BIC and seller BIC should be different
					 if(buyerbic && sellerbic && (buyerbic.get("value") === sellerbic.get("value"))){
						if (error_message !== ""){
							error_message += "<br>";
						}
						error_message += m.getLocalization("buyerAndSellerBicSameError");
						valid = false;
					 }
					//Validate expiry date greater than current date and appl date and issue date.
					if(dj.byId("tnxtype") && dj.byId("tnxtype").get("value") === "31")
					{
						var validExpiryDate =m.compareDateIsGreater("exp_date",["iss_date","appl_date"]);
						if(!validExpiryDate)
						{
							error_message += m._config.onSubmitErrorMsg;
							valid= false;
						}
					}
					//If one of the multimodal fields has value, the other also should be entered
					var widget1 = dj.byId("taking_in_charge");
					var widget2 = dj.byId("final_dest_place");
					if((widget1 &&  widget1.value !== "") && (widget2 &&  widget2.value === ""))
					{
						error_message += misys.getLocalization("multimodalDetMandatoryError");
						valid = false;
					}
					else if((widget2 &&  widget2.value !== "") && (widget1 &&  widget1.value === ""))
					{
						error_message += misys.getLocalization("multimodalDetMandatoryError");
						valid = false;
					}
					if(!m.validateCreditorAccountIdType()){
						if (error_message !== ""){
							error_message += "<br>";
						}
						error_message += misys.getLocalization("creditorAccIdTypeError");
						valid = false;
					}
					
					if((lineItems && lineItems.store && lineItems.store._arrayOfTopLevelItems.length > 0) && (m.hasIncotermsInAllLineItems()||m.hasLastShipmentInAllLineItems()||m.hasRoutingSummaryInAllLineItems()))
					{
							if (error_message !== "")
							{
								error_message += "<br>";
							}
						error_message += misys.getLocalization("incotermRoutingShipmentDateNotInAllLineItemError");
						valid = false;
					}
					var dispMsg = m.isValidContact();
					if(dispMsg != '')
					{ 
						error_message = dispMsg;
						valid = false;
					}
					 
				m._config.onSubmitErrorMsg =  error_message;
			}
			return valid;
		}
		
	});
	/**
	 * This function checks the change in invoice currency against line items currency, if changed then prompts the user.
	 * @method _checkLineItemsCurrencyTotalCurrency
	 */
	function _checkLineItemsCurrencyTotalCurrency()
	{
		//  summary:
		//  Checks the change in invoice currency against line items currency, if changed then  prompts the user 
		//  private
		var message = misys.getLocalization("resetExportOpenAccountCurrency");
		
		if(dj.byId("line-items") && dj.byId("line-items").store && dj.byId("line-items").store != null && dj.byId("line-items").store._arrayOfAllItems.length >0)
		{
			console.debug("[misys.binding.openaccount.create_ip] Size of the table dj.byId(line-items).store._arrayOfAllItems.length = ",
					dj.byId("line-items").store._arrayOfAllItems.length);
			
			for (var i = 0, length = dj.byId("line-items").store._arrayOfAllItems.length ; i <length ; i++ )
			{
				var currentObject = dj.byId("line-items").store._arrayOfAllItems[i];
				if(currentObject != null && currentObject.price_cur_code !== dj.byId("total_cur_code").get("value"))
				{
					var okCallback = function() {
						if(dj.byId("line-items").grid && dj.byId("line-items").grid.store)
						{
							dj.byId("line-items").grid.store.fetch(
									{
										query: {store_id: "*"},
										onComplete: dojo.hitch(dj.byId("total_cur_code"), function(items, request){
											d.forEach(items, function(item){
												/*dj.byId("line-items").grid.store.deleteItem(item);*/
												dj.byId("line-items").grid.store.setValue(item, "price_cur_code", dj.byId("total_cur_code").get("value"));
												dj.byId("line-items").grid.store.setValue(item, "total_cur_code", dj.byId("total_cur_code").get("value"));
												dj.byId("line-items").grid.store.setValue(item, "total_net_cur_code", dj.byId("total_cur_code").get("value"));
												
												//Checking for taxes and updating currency for existing taxes if any 
												if(item.taxes && item.taxes.length >0 )
												{
													dj.byId("tax_cur_code").set("value",dj.byId("total_cur_code").get("value"));
												
													if(item.taxes[0]._values != "" && item.taxes[0]._values.length >0 ) {
														for(i=0;i<item.taxes[0]._values.length;i++) {
															item.taxes[0]._values[i].cur_code= dj.byId("total_cur_code").get("value");
														}
													}
												}
												//Checking for adjustments and updating currency for existing adjustments if any
												if(item.adjustments && item.adjustments.length >0 )
												{
													dj.byId("adjustment_cur_code").set("value",dj.byId("total_cur_code").get("value"));
												
													if(item.adjustments[0]._values != "" && item.adjustments[0]._values.length >0 ) {
														for(i=0;i<item.adjustments[0]._values.length;i++) {
															item.adjustments[0]._values[i].cur_code= dj.byId("total_cur_code").get("value");
														}
													}
												}
												//Checking for freight charges and updating currency for existing freight charges if any
												if(item.freight_charges && item.freight_charges.length >0 )
												{
													dj.byId("freight_charge_cur_code").set("value",dj.byId("total_cur_code").get("value"));
												
													if(item.freight_charges[0]._values != "" && item.freight_charges[0]._values.length >0 ) {
														for(i=0;i<item.freight_charges[0]._values.length;i++) {
															item.freight_charges[0]._values[i].cur_code= dj.byId("total_cur_code").get("value");
														}
													}
												}
												}, dj.byId("line-items"));
										})
									}
							);
							dj.byId("line-items").grid.store.save();
							var that = dj.byId("line-items");
							setTimeout(function(){
								that.renderSections();
								that.grid.render();	
							}, 200);
						}
						if(dj.byId("po-adjustments") && dj.byId("po-adjustments").store && dj.byId("po-adjustments").store != null && dj.byId("po-adjustments").store._arrayOfAllItems.length >0)
						{
							if(dj.byId("po-adjustments").grid && dj.byId("po-adjustments").grid.store) {
								dj.byId("po-adjustments").grid.store.fetch(
										{
											query: {store_id: "*"},
											onComplete: dojo.hitch(dj.byId("total_cur_code"), function(items, request){
												d.forEach(items, function(item){
													dj.byId("po-adjustments").grid.store.setValue(item, "cur_code", dj.byId("total_cur_code").get("value"));
												},dj.byId("po-adjustments"));
										})
									}
								);
							}
						}
						if(dj.byId("po-taxes") && dj.byId("po-taxes").store && dj.byId("po-taxes").store != null && dj.byId("po-taxes").store._arrayOfAllItems.length >0)
						{
							if(dj.byId("po-taxes").grid && dj.byId("po-taxes").grid.store) {
								dj.byId("po-taxes").grid.store.fetch(
										{
											query: {store_id: "*"},
											onComplete: dojo.hitch(dj.byId("total_cur_code"), function(items, request){
												d.forEach(items, function(item){
													dj.byId("po-taxes").grid.store.setValue(item, "cur_code", dj.byId("total_cur_code").get("value"));
												},dj.byId("po-taxes"));
										})
									}
								);
							}
						}
						if(dj.byId("po-freight-charges") && dj.byId("po-freight-charges").store && dj.byId("po-freight-charges").store != null && dj.byId("po-freight-charges").store._arrayOfAllItems.length >0)
						{
							if(dj.byId("po-freight-charges").grid && dj.byId("po-freight-charges").grid.store) {
								dj.byId("po-freight-charges").grid.store.fetch(
										{
											query: {store_id: "*"},
											onComplete: dojo.hitch(dj.byId("total_cur_code"), function(items, request){
												d.forEach(items, function(item){
													dj.byId("po-freight-charges").grid.store.setValue(item, "cur_code", dj.byId("total_cur_code").get("value"));
												},dj.byId("po-freight-charges"));
										})
									}
								);
							}
						}
						//dj.byId("fake_total_amt").set("value","");
						//dj.byId("total_net_amt").set("value","");
					};
					
					var onCancelCallback = function() {
						dj.byId("total_cur_code").set("value",dj.byId("line-items").store._arrayOfAllItems[0].price_cur_code);
					};
					m.dialog.show("CONFIRMATION", message, "", "", "", "", okCallback, onCancelCallback);
				}
			}
		}
		/*if(dj.byId("po-adjustments") && dj.byId("po-adjustments").store && dj.byId("po-adjustments").store != null && dj.byId("po-adjustments").store._arrayOfAllItems.length >0)
		{
			if(dj.byId("po-adjustments").grid && dj.byId("po-adjustments").grid.store) {
				dj.byId("po-adjustments").grid.store.fetch(
						{
							query: {store_id: "*"},
							onComplete: dojo.hitch(dj.byId("total_cur_code"), function(items, request){
								d.forEach(items, function(item){
									dj.byId("po-adjustments").grid.store.setValue(item, "cur_code", dj.byId("total_cur_code").get("value"));
								},dj.byId("po-adjustments"));
						})
					}
				);
			}
		}*/
		/*if(dj.byId("po-taxes") && dj.byId("po-taxes").store && dj.byId("po-taxes").store != null && dj.byId("po-taxes").store._arrayOfAllItems.length >0)
		{
			if(dj.byId("po-taxes").grid && dj.byId("po-taxes").grid.store) {
				dj.byId("po-taxes").grid.store.fetch(
						{
							query: {store_id: "*"},
							onComplete: dojo.hitch(dj.byId("total_cur_code"), function(items, request){
								d.forEach(items, function(item){
									dj.byId("po-taxes").grid.store.setValue(item, "cur_code", dj.byId("total_cur_code").get("value"));
								},dj.byId("po-taxes"));
						})
					}
				);
			}
		}
		if(dj.byId("po-freight-charges") && dj.byId("po-freight-charges").store && dj.byId("po-freight-charges").store != null && dj.byId("po-freight-charges").store._arrayOfAllItems.length >0)
		{
			if(dj.byId("po-freight-charges").grid && dj.byId("po-freight-charges").grid.store) {
				dj.byId("po-freight-charges").grid.store.fetch(
						{
							query: {store_id: "*"},
							onComplete: dojo.hitch(dj.byId("total_cur_code"), function(items, request){
								d.forEach(items, function(item){
									dj.byId("po-freight-charges").grid.store.setValue(item, "cur_code", dj.byId("total_cur_code").get("value"));
								},dj.byId("po-freight-charges"));
						})
					}
				);
			}
		}*/
	}
})(dojo, dijit, misys);
//Including the client specific implementation
       dojo.require('misys.client.binding.openaccount.create_ea_client');