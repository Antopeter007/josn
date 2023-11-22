dojo.provide("misys.binding.openaccount.create_po");
/*
 ----------------------------------------------------------
 Event Binding for

   Purchase Order (PO) Form, Customer Side.

 Copyright (c) 2000-2009 Misys (http://www.misys.com),
 All Rights Reserved. 

 version:   1.0
 date:      12/09/08
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
		
	d.mixin(m._config, {

		initReAuthParams : function() {
									
			var reAuthParams = {
				productCode : 'PO',	
				subProductCode : '',
				transactionTypeCode : '01',	
				entity : dj.byId("entity") ? dj.byId("entity").get("value") : '',
				currency : dj.byId("total_net_cur_code")? dj.byId("total_net_cur_code").get("value") : "",				
				amount : dj.byId("total_net_amt")? m.trimAmount(dj.byId("total_net_amt").get("value")) : "",
				bankAbbvName :	dj.byId("issuing_bank_abbv_name")? dj.byId("issuing_bank_abbv_name").get("value") : "",
				
				es_field1 : '',
				es_field2 : ''				
			};
			return reAuthParams;
			
		},
		_hasLineItemShipmentDate : function () {
			if(dj.byId('line-items').store != null) {
				var arrayLineItems=dj.byId('line-items').store._arrayOfAllItems;
				
				for(i=0;i<arrayLineItems.length;i++) {
					if(arrayLineItems[i] && arrayLineItems[i].last_ship_date!="") {
						dj.byId('last_ship_date').set("value",null);
						dj.byId('last_ship_date').set("disabled",true);
						break;
					}
					else {
						dj.byId('last_ship_date').set("disabled",false);
					}
				}	
			}
		}
	});	
					
	// Public functions & variables follow
	d.mixin(m, {
		bind : function() {

			//  summary:
		    //            Binds validations and events to fields in the form.              
		    //   tags:
		    //            public
			m.connect('bill_to_name', 'onChange', m.enableRequiredTab);
			m.connect('ship_to_name', 'onChange', m.enableRequiredTab);
			m.connect('consgn_name', 'onChange', m.enableRequiredTab);
			m.connect('bill_to_post_code', 'onChange', m.enableRequiredTab);
			m.connect('ship_to_post_code', 'onChange', m.enableRequiredTab);
			m.connect('consgn_post_code', 'onChange', m.enableRequiredTab);
			m.connect('bill_to_town_name', 'onChange', m.enableRequiredTab);
			m.connect('ship_to_town_name', 'onChange', m.enableRequiredTab);
			m.connect('consgn_town_name', 'onChange', m.enableRequiredTab);
			m.connect('bill_to_country', 'onChange', m.enableRequiredTab);
			m.connect('ship_to_country', 'onChange', m.enableRequiredTab);
			m.connect('consgn_country', 'onChange', m.enableRequiredTab);
			
			m.setValidation("line_item_last_ship_date", m.validateOALastShipmentDate);
			m.setValidation("template_id", m.validateTemplateId);
			m.setValidation("contact_email", m.validateEmailAddr);
			m.setValidation("buyer_bei", m.validateBEIFormat);
			m.setValidation("fin_inst_bic", m.validateBICFormat);
			
			m.setValidation('total_cur_code', m.validateCurrency);
			m.setValidation('fake_total_cur_code', m.validateCurrency);
			m.setValidation('total_net_cur_code', m.validateCurrency);
			m.setValidation('line_item_price_cur_code', m.validateCurrency);
			m.setValidation('line_item_total_net_cur_code', m.validateCurrency);
			m.setValidation('adjustment_cur_code', m.validateCurrency);
			m.setValidation('details_cur_code', m.validateCurrency);
			m.setValidation('tax_cur_code', m.validateCurrency);
			m.setValidation('freight_charge_cur_code', m.validateCurrency);
			m.setValidation("buyer_country", m.validateCountry);
			m.setValidation("seller_country", m.validateCountry);
			m.setValidation("line_item_product_orgn_country", m.validateCountry);
			m.setValidation("fin_inst_country", m.validateCountry);
		
			// onChange
			m.connect('total_cur_code', 'onChange', m.toggleDisableButtons);
			m.connect('freight_charges_type', 'onFocus', m.saveOldFreightChargeType);
			m.connect('freight_charges_type', 'onChange', m.manageFreightButton);
			// Fill currency fields with the Purchase Order Currency
			m.connect('total_cur_code', 'onChange', m.managePOCurrency);
			m.connect('total_cur_code', 'onBlur', _checkLineItemsCurrencyTotalCurrency);

			// Adjustment - Amount and Rate fields are mutually exclusive
			m.connect('adjustment_amt', 'onChange', function(){m.toggleFields(isNaN(this.get("value")), null ,["adjustment_rate"],false,false);});
			m.connect('adjustment_rate', 'onChange', function(){m.toggleFields(isNaN(this.get("value")), null ,["adjustment_amt","adjustment_cur_code"],false,false);});
			
			//FREIGHT CHARGES: amount XOR rate
			m.connect('freight_charge_amt', 'onChange', function(){m.toggleFields(isNaN(this.get("value")), null ,["freight_charge_rate"],false,false);});
			m.connect('freight_charge_rate', 'onChange', function(){m.toggleFields(isNaN(this.get("value")), null ,["freight_charge_amt","freight_charge_cur_code"],false,false);});
			
			//TAXES: amount XOR rate
			m.connect('tax_amt', 'onChange', function(){m.toggleFields(isNaN(this.get("value")), null ,["tax_rate"],false,false);});
			m.connect('tax_rate', 'onChange', function(){m.toggleFields(isNaN(this.get("value")), null ,["tax_amt","tax_cur_code"],false,false);});
			
			//
			// Other Events
			//
			m.connect('display_other_parties', 'onClick', m.showHideOtherParties);
			m.connect('total_cur_code', 'onFocus', m.saveOldPOCurrency);
			
			//m.connect('payment_terms_type_1', 'onClick', m.onClickCheckPaymentTerms);
			//m.connect('payment_terms_type_2', 'onClick', m.onClickCheckPaymentTerms);
			
			m.connect('seller_account_type', 'onChange', function(){
				m.onChangeSellerAccountType('form_settlement', 'seller_account_value', 'seller_account_type');
			});
			m.connect('seller_account_value', 'onFocus', m.onFocusSellerAccount);
			
			
			m.connect('last_match_date', 'onBlur', m.onBlurMatchDate);
//			m.connect('last_ship_date', 'onFocus', m.checkLastShipDateUnicity('last_ship_date'));
			m.setValidation("last_ship_date", m.validateOALastShipmentDate);
//			m.connect('last_ship_date', 'onBlur', m.onBlurShipDate);
			
			m.connect('line_item_qty_val', 'onBlur', m.computeLineItemAmount);
			m.connect('line_item_price_amt', 'onBlur', m.computeLineItemAmount);
			//Hide the other field when the dialogBox is displayed
			if (dojo.byId('line_item_qty_unit_measr_other_row') && dojo.byId('line_item_qty_unit_measr_code')) {
				if (dj.byId('line_item_qty_unit_measr_code') && dj.byId('line_item_qty_unit_measr_code').get('value') === "OTHR") {
					m.animate("fadeIn", 'line_item_qty_unit_measr_other_row');
				}
				else {
					m.animate("fadeOut", 'line_item_qty_unit_measr_other_row');
				}
			}
			m.connect("line_item_qty_unit_measr_code", "onChange", function(){
				m.toggleFields((this.get("value") === "OTHR"),null, ["line_item_qty_unit_measr_other"]);
				if (dojo.byId('line_item_qty_unit_measr_other_row')) {
					if (this.get("value") === "OTHR") {
						m.animate("fadeIn", 'line_item_qty_unit_measr_other_row');
					}
					else {
						m.animate("fadeOut", 'line_item_qty_unit_measr_other_row');
					}
				}
			});
						
			m.connect('fake_total_cur_code', 'onChange', function(){
				m.setCurrency(this, ['fake_total_amt']);
			});
			m.connect('total_net_cur_code', 'onChange', function(){
				m.setCurrency(this, ['total_net_amt']);
			});
			m.connect('line_item_price_cur_code', 'onChange', function(){
				m.setCurrency(this, ['line_item_price_amt']);
			});
			m.connect('details_cur_code', 'onChange', function(){
				m.setCurrency(this, ['details_amt']);
			});
			m.connect('fake_total_amt', 'onChange', function(){
				m.setTnxAmt(this.get('value'));
			});
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
			if(dj.byId("issuing_bank_abbv_name"))
			{
				m.connect("entity", "onChange", function(){
					dj.byId("issuing_bank_abbv_name").onChange();});
			}
			m.connect("issuing_bank_customer_reference", "onChange", m.setBuyerReference);
			
			//Lineitems quantity codes
			m.connect(dj.byId('line_item_qty_unit_measr_code'), 'onChange',  function(){dj.byId('line_item_price_unit_measr_code').set('value', this.get('value'));});
			

			//Decode type code in widgets
			m.connect(dj.byId('details_code'), 'onChange', m.paymentDetailsChange);
			m.connect(dj.byId('line_item_qty_unit_measr_code'), 'onChange', function(){dj.byId('line_item_qty_unit_measr_label').set('value', this.get('displayedValue'));});
			m.connect(dj.byId('contact_type'), 'onChange', function(){dj.byId('contact_type_decode').set('value', this.get('displayedValue'));});
			m.connect(dj.byId('product_identifier_code'), 'onChange', function(){dj.byId('product_identifier_code_label').set('value', this.get('displayedValue'));});
			m.connect(dj.byId('product_category_code'), 'onChange', function(){dj.byId('product_category_code_label').set('value', this.get('displayedValue'));});
			m.connect(dj.byId('product_characteristic_code'), 'onChange', function(){dj.byId('product_characteristic_code_label').set('value', this.get('displayedValue'));});
			m.connect(dj.byId('adjustment_type'), 'onChange', function(){dj.byId('adjustment_type_label').set('value', this.get('displayedValue'));});
			m.connect(dj.byId('tax_type'), 'onChange', function(){dj.byId('tax_type_label').set('value', this.get('displayedValue'));});
			m.connect(dj.byId('freight_charge_type'), 'onChange', function(){dj.byId('freight_charge_type_label').set('value', this.get('displayedValue'));});
			m.connect(dj.byId('incoterm_code'), 'onChange', function(){dj.byId('incoterm_code_label').set('value', this.get('displayedValue'));});
//			m.connect(dj.byId('air_transport_sub_type'), 'onChange', function(){dj.byId('air_transport_sub_type_label').set('value', this.get('displayedValue'));});
//			m.connect(dj.byId('sea_transport_sub_type'), 'onChange', function(){dj.byId('sea_transport_sub_type_label').set('value', this.get('displayedValue'));});
//			m.connect(dj.byId('rail_transport_sub_type'), 'onChange', function(){dj.byId('rail_transport_sub_type_label').set('value', this.get('displayedValue'));});
//			m.connect(dj.byId('road_transport_sub_type'), 'onChange', function(){dj.byId('road_transport_sub_type_label').set('value', this.get('displayedValue'));});
//			m.connect(dj.byId('place_transport_sub_type'), 'onChange', function(){dj.byId('place_transport_sub_type_label').set('value', this.get('displayedValue'));});
//			
			if (dojo.byId('adjustment_other_type_row') && dojo.byId('adjustment_type')) {
				if (dj.byId('adjustment_type').get("value") === "OTHR") {
					m.animate("fadeIn", 'adjustment_other_type_row');
				}
				else {
					m.animate("fadeOut", 'adjustment_other_type_row');
				}
			}
			
			if (dojo.byId('tax_other_type_row') && dojo.byId('tax_type')) {
				if (dj.byId('tax_type').get("value") === "OTHR") {
					m.animate("fadeIn", 'tax_other_type_row');
				}
				else {
					m.animate("fadeOut", 'tax_other_type_row');
				}
			}
			
			m.connect("adjustment_type", "onChange", function(){
				m.toggleFields((this.get("value") === "OTHR"),
						null, ["adjustment_other_type"]);
				if (dojo.byId('adjustment_other_type_row')) {
					if (this.get("value") === "OTHR") {
						m.animate("fadeIn", 'adjustment_other_type_row');
					}
					else {
						m.animate("fadeOut", 'adjustment_other_type_row');
					}
				}
			});
			m.connect("tax_type", "onChange", function(){
				m.toggleFields((this.get("value") === "OTHR"),
						null, ["tax_other_type"]);
				if (dojo.byId('tax_other_type_row')) {
					if (this.get("value") === "OTHR")
					{
						m.animate("fadeIn", 'tax_other_type_row');
					}
					else
					{
						m.animate("fadeOut", 'tax_other_type_row');
					}
				}
			});
			
			if (dojo.byId('product_category_other_code_row') && dojo.byId('product_category_code')) {
				if (dj.byId('product_category_code').get("value") === "OTHR") {
					m.animate("fadeIn", 'product_category_other_code_row');
				}
				else {
					m.animate("fadeOut", 'product_category_other_code_row');
				}
			}
			if (dojo.byId('product_characteristic_other_code_row') && dojo.byId('product_characteristic_code')) {
				if (dj.byId('product_characteristic_code').get("value") === "OTHR") {
					m.animate("fadeIn", 'product_characteristic_other_code_row');
				}
				else {
					m.animate("fadeOut", 'product_characteristic_other_code_row');
				}
			}
			if (dojo.byId('product_identifier_other_code_row') && dojo.byId('product_identifier_code')) {
				if (dj.byId('product_identifier_code').get("value") === "OTHR") {
					m.animate("fadeIn", 'product_identifier_other_code_row');
				}
				else {
					m.animate("fadeOut", 'product_identifier_other_code_row');
				}
			}
			if (dojo.byId('incoterm_other_row') && dojo.byId('incoterm_code')) {
				if (dj.byId('incoterm_code').get("value") === "OTHR") {
					m.animate("fadeIn", 'incoterm_other_row');
				}
				else {
					m.animate("fadeOut", 'incoterm_other_row');
				}
			}
			if (dojo.byId('freight_charge_other_type_row') && dojo.byId('freight_charge_type')) {
				if (dj.byId('freight_charge_type').get("value") === "OTHR") {
					m.animate("fadeIn", 'freight_charge_other_type_row');
				}
				else {
					m.animate("fadeOut", 'freight_charge_other_type_row');
				}
			}
			m.connect("freight_charge_type", "onChange", function(){
				m.toggleFields((this.get("value") === "OTHR"),
						null, ["freight_charge_other_type"]);
				if (dojo.byId('freight_charge_other_type_row')) {
					if (this.get("value") === "OTHR") {
						m.animate("fadeIn", 'freight_charge_other_type_row');
					}
					else {
						m.animate("fadeOut", 'freight_charge_other_type_row');
					}
				}
			});
			m.connect("incoterm_code", "onChange", function(){
				m.toggleFields((this.get("value") === "OTHR"),
						null, ["incoterm_other"]);
				if (dojo.byId('incoterm_other_row')) {
					if (this.get("value") === "OTHR")
					{
						m.animate("fadeIn", 'incoterm_other_row');
					}
					else
					{
						m.animate("fadeOut", 'incoterm_other_row');
					}
				}
			});
			m.connect("product_identifier_code", "onChange", function(){
				m.toggleFields((this.get("value") === "OTHR"),
						null, ["product_identifier_other_code"]);
				if (dojo.byId('product_identifier_other_code_row')) {
					if (this.get("value") === "OTHR")
					{
						m.animate("fadeIn", 'product_identifier_other_code_row');
					}
					else
					{
						m.animate("fadeOut", 'product_identifier_other_code_row');
					}
				}
			});
			m.connect("product_characteristic_code", "onChange", function(){
				m.toggleFields((this.get("value") === "OTHR"),
						null, ["product_characteristic_other_code"]);
				if (dojo.byId('product_characteristic_other_code_row')) {
					if (this.get("value") === "OTHR")
					{
						m.animate("fadeIn", 'product_characteristic_other_code_row');
					}
					else
					{
						m.animate("fadeOut", 'product_characteristic_other_code_row');
					}
				}
			});
			m.connect("product_category_code", "onChange", function(){
				m.toggleFields((this.get("value") === "OTHR"),
						null, ["product_category_other_code"]);
				if (dojo.byId('product_characteristic_other_code_row')) {
					if (this.get("value") === "OTHR")
					{
						m.animate("fadeIn", 'product_category_other_code_row');
					}
					else
					{
						m.animate("fadeOut", 'product_category_other_code_row');
					}
				}
			});
	
			
			m.onClickCheckPaymentTerms();
			
			m.oaCommonBindEvents();
		},

		
		onFormLoad : function() {
			//  summary:
			//          Events to perform on page load.
			//  tags:
			//         public
			
			// Show/hide other parties section
			var displayOtherParties = dj.byId('display_other_parties');
			if(displayOtherParties) {
				m.showHideOtherParties();
				misys.toggleCountryFields(false,['bill_to_country','ship_to_country','consgn_country']);
			}
		    
			// Enable/disable the add line item button
			m.toggleDisableButtons();
			// disabled the add payment term button
			/*if (dj.byId('add_payment_term_button')){
				dj.byId('add_payment_term_button').set('disabled', true);
			}*/
			// Populate references
			var issuingBankAbbvName = dj.byId('issuing_bank_abbv_name');
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
				issuingBankCustRef.set('value',issuingBankCustRef._resetValue);
			}
			
			
			//compute total amount after load of data if they exist.
			m.computePOTotalAmount();
			
			m.managePOCurrency();
			
			// Openaccount fields
			m.oaOnLoadActions();
			m.setCurrency(dj.byId("total_net_cur_code"), ["total_net_amt"]);
			
		},
		
		beforeSaveValidations : function(){
			var entity = dj.byId("entity") ;
			if(entity && entity.get("value") == "")
			{
				return false;
			}
			else
			{
				return true;
			}
		},
		
		beforeSubmitValidations : function() {
			
			var valid = true;
			var error_message = "";
			var payments = dj.byId("po-payments");
			var lineItems = dj.byId("line-items");
			
			m.checkPoReferenceExists();
			if(dj.byId("issuer_ref_id") && (dj.byId("issuer_ref_id").get("state") === "Error" || dj.byId("issuer_ref_id").get("value") === "")){
				error_message += m.getLocalization("mandatoryPOReferenceError");
				valid = false;
			}
			
			if (!payments || !payments.store || payments.store._arrayOfTopLevelItems.length <= 0) {
				error_message += m.getLocalization("mandatoryPaymentTermError");
				valid = false;
			}
			
			if(!lineItems || !lineItems.store || lineItems.store._arrayOfTopLevelItems.length <= 0 ) {
				if (error_message != ""){
					error_message += "<br>";
				}
				error_message += misys.getLocalization("mandatoryLineItemError");
				valid = false;
			}
			m._config.onSubmitErrorMsg =  error_message;
			return valid;
		}
		
	});
	
	function _checkLineItemsCurrencyTotalCurrency()
	{
		//  summary:
		//  Checks the change in invoice currency against line items currency, if changed then  prompts the user 
		//  private
		var message = misys.getLocalization('resetPurchaseOrderCurrency');
		
		if(dj.byId("line-items") && dj.byId("line-items").store && dj.byId("line-items").store != null && dj.byId("line-items").store._arrayOfAllItems.length >0)
		{
			console.debug("[misys.binding.openaccount.create_ip] Size of the table dj.byId(line-items).store._arrayOfAllItems.length = ",
					dj.byId("line-items").store._arrayOfAllItems.length);
			
			for (var i = 0, length = dj.byId("line-items").store._arrayOfAllItems.length ; i <length ; i++ )
			{
				var currentObject = dj.byId("line-items").store._arrayOfAllItems[i];
				if(currentObject != null && currentObject.price_cur_code !== this.get("value"))
				{
					var okCallback = function() {
						if(dj.byId("line-items").grid && dj.byId("line-items").grid.store)
						{
							dj.byId("line-items").grid.store.fetch(
									{
										query: {store_id: '*'},
										onComplete: dojo.hitch(this, function(items, request){
											d.forEach(items, function(item){
												/*dj.byId("line-items").grid.store.deleteItem(item);*/
												dj.byId("line-items").grid.store.setValue(item, 'price_cur_code', dj.byId('total_cur_code').get('value'));
												dj.byId("line-items").grid.store.setValue(item, 'total_cur_code', dj.byId('total_cur_code').get('value'));
												dj.byId("line-items").grid.store.setValue(item, 'total_net_cur_code', dj.byId('total_cur_code').get('value'));
												
												//Checking for taxes and updating currency for existing taxes if any 
												if(item.taxes && item.taxes.length >0 )
												{
													dj.byId("tax_cur_code").set("value",dj.byId('total_cur_code').get('value'));
												
													if(item.taxes[0]._values != "" && item.taxes[0]._values.length >0 ) {
														for(i=0;i<item.taxes[0]._values.length;i++) {
															item.taxes[0]._values[i].cur_code= dj.byId('total_cur_code').get('value');
														}
													}
												}
												//Checking for adjustments and updating currency for existing adjustments if any
												if(item.adjustments && item.adjustments.length >0 )
												{
													dj.byId("adjustment_cur_code").set("value",dj.byId('total_cur_code').get('value'));
												
													if(item.adjustments[0]._values != "" && item.adjustments[0]._values.length >0 ) {
														for(i=0;i<item.adjustments[0]._values.length;i++) {
															item.adjustments[0]._values[i].cur_code= dj.byId('total_cur_code').get('value');
														}
													}
												}
												//Checking for freight charges and updating currency for existing freight charges if any
												if(item.freight_charges && item.freight_charges.length >0 )
												{
													dj.byId("freight_charge_cur_code").set("value",dj.byId('total_cur_code').get('value'));
												
													if(item.freight_charges[0]._values != "" && item.freight_charges[0]._values.length >0 ) {
														for(i=0;i<item.freight_charges[0]._values.length;i++) {
															item.freight_charges[0]._values[i].cur_code= dj.byId('total_cur_code').get('value');
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
						//dj.byId("fake_total_amt").set("value","");
						//dj.byId("total_net_amt").set("value","");
					};
					
					var onCancelCallback = function() {
						dj.byId("total_cur_code").set("value",dj.byId("line-items").store._arrayOfAllItems[0].price_cur_code);
					};
					m.dialog.show("CONFIRMATION", message, '', '', '', '', okCallback, onCancelCallback);
				}
			}
		}
		if(dj.byId("po-adjustments") && dj.byId("po-adjustments").store && dj.byId("po-adjustments").store != null && dj.byId("po-adjustments").store._arrayOfAllItems.length >0)
		{
			if(dj.byId("po-adjustments").grid && dj.byId("po-adjustments").grid.store) {
				dj.byId("po-adjustments").grid.store.fetch(
						{
							query: {store_id: '*'},
							onComplete: dojo.hitch(this, function(items, request){
								d.forEach(items, function(item){
									dj.byId("po-adjustments").grid.store.setValue(item, 'cur_code', dj.byId('total_cur_code').get('value'));
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
							query: {store_id: '*'},
							onComplete: dojo.hitch(this, function(items, request){
								d.forEach(items, function(item){
									dj.byId("po-taxes").grid.store.setValue(item, 'cur_code', dj.byId('total_cur_code').get('value'));
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
							query: {store_id: '*'},
							onComplete: dojo.hitch(this, function(items, request){
								d.forEach(items, function(item){
									dj.byId("po-freight-charges").grid.store.setValue(item, 'cur_code', dj.byId('total_cur_code').get('value'));
								},dj.byId("po-freight-charges"));
						})
					}
				);
			}
		}
		
		if(dj.byId("po-payments") && dj.byId("po-payments").store && dj.byId("po-payments").store !== null && dj.byId("po-payments").store._arrayOfAllItems.length > 0 && 
				dj.byId("po-payments").grid && dj.byId("po-payments").grid.store)
		{
				dj.byId("po-payments").grid.store.fetch(
						{
							query: {store_id: '*'},
							onComplete: dojo.hitch(this, function(items, request){
								d.forEach(items, function(item){
									var poPaymentStore = dj.byId("po-payments").grid.store;
									var totalCurCode = dj.byId("total_cur_code") ?  dj.byId("total_cur_code").get("value") :"";
									poPaymentStore.setValue(item, 'cur_code', totalCurCode);
									if (dijit.byId("details_pct") && dijit.byId("details_pct").get("value") === "")
									{
									var formattedValue = dojo.currency.format(item.amt, {currency: totalCurCode});
									if(null !== formattedValue && formattedValue !== '') {
									formattedValue = formattedValue.replace((/[^\d\.\,]/g), '');
									}
									poPaymentStore.setValue(item, 'amt',formattedValue);
									}
								},dj.byId("po-payments"));
						})
					}
				);
		}
	}
})(dojo, dijit, misys);
//Including the client specific implementation
       dojo.require('misys.client.binding.openaccount.create_po_client');