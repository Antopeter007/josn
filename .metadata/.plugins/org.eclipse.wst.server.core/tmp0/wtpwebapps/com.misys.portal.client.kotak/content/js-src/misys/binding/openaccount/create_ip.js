dojo.provide("misys.binding.openaccount.create_ip");
/*
 ----------------------------------------------------------
 Event Binding for

   Purchase Order (PO) Form, Customer Side.

 Copyright (c) 2000-2009 Misys (http://www.misys.com),
 All Rights Reserved. 

 version:   1.0
 date:      29/11/11
 ----------------------------------------------------------
 */
dojo.require("dojo.parser");
dojo.require("dijit.layout.BorderContainer");
dojo.require("misys.widget.Dialog");
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
dojo.require("misys.form.file");
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
dojo.require("misys.openaccount.widget.Payments");
dojo.require("misys.openaccount.widget.Payment");
dojo.require("misys.openaccount.widget.Taxes");
dojo.require("misys.openaccount.widget.Tax");
dojo.require("misys.openaccount.widget.AirTransports");
dojo.require("misys.openaccount.widget.SeaTransports");
dojo.require("misys.openaccount.widget.RoadTransports");
dojo.require("misys.openaccount.widget.RailTransports");
dojo.require("misys.openaccount.widget.TakingInTransports");
dojo.require("misys.openaccount.widget.PlaceTransports");
dojo.require("misys.openaccount.widget.FinalDestinationTransports");
dojo.require("misys.openaccount.widget.Transport");
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


(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	// insert private functions & variables
	
	// Public functions & variables follow
	d.mixin(m._config, {

		initReAuthParams : function() {

			var reAuthParams = {
				productCode : dj.byId("product_code").get("value"),
				subProductCode : '',
				transactionTypeCode : '01',
				entity : dj.byId("entity") ? dj.byId("entity").get("value") : '',
				currency : dj.byId("total_net_cur_code")? dj.byId("total_net_cur_code").get("value") : "",				
				amount : dj.byId("total_net_amt")? m.trimAmount(dj.byId("total_net_amt").get("value")) : "",
				bankAbbvName : dj.byId("issuing_bank_abbv_name") ? dj.byId("issuing_bank_abbv_name").get("value") : "",	

				es_field1 : '',
				es_field2 : ''
			};
			return reAuthParams;
		},
		_hasLineItemShipmentDate : function () {
			if(dj.byId('line-items').store !== null) {
				var arrayLineItems=dj.byId('line-items').store._arrayOfAllItems;
				
				for(i=0;i<arrayLineItems.length;i++) {
					if(arrayLineItems[i] && arrayLineItems[i].last_ship_date!=="") {
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
	
	d.mixin(m, {
		bind : function() {

			//  summary:
		    //            Binds validations and events to fields in the form.              
		    //   tags:
		    //            public
			
			m.setValidation("iss_date", m.validateIPInvoiceDate);
			m.setValidation("due_date", m.validateIPDueDate);
			m.setValidation("last_ship_date", m.validateLastShipmentDate);
			m.setValidation("line_item_earliest_ship_date", m.validateEarliestShipDate);
			m.setValidation("line_item_last_ship_date", m.validateLastShipmentDate);
			m.setValidation("discount_exp_date", m.validateDiscountExpDate);
			m.setValidation("contact_email", m.validateEmailAddr);
			m.setValidation("buyer_bei", m.validateBEIFormat);
			m.setValidation("seller_bei", m.validateBEIFormat);
			m.setValidation("fin_inst_bic", m.validateBICFormat);
			
			m.setValidation('total_cur_code', m.validateCurrency);
			m.setValidation('face_total_cur_code', m.validateCurrency);
			m.setValidation('total_net_cur_code', m.validateCurrency);
			m.setValidation('line_item_price_cur_code', m.validateCurrency);
			m.setValidation('line_item_total_net_cur_code', m.validateCurrency);
			m.setValidation('adjustment_cur_code', m.validateCurrency);
			m.setValidation('details_cur_code', m.validateCurrency);
			m.setValidation('tax_cur_code', m.validateCurrency);
			m.setValidation('freight_charge_cur_code', m.validateCurrency);

			m.setValidation('buyer_country', m.validateCountry);
			m.setValidation('seller_country', m.validateCountry);
			m.setValidation('bill_to_country', m.validateCountry);
			m.setValidation('ship_to_country', m.validateCountry);
			m.setValidation('consgn_country', m.validateCountry);
			m.setValidation('line_item_product_orgn_country', m.validateCountry); 
			m.setValidation('fin_inst_country', m.validateCountry);					
			// onChange
			m.connect('total_cur_code', 'onChange', m.toggleDisableButtons);
			m.connect('total_cur_code', 'onBlur', _checkLineItemsCurrencyTotalCurrency);
			m.connect('issuer_ref_id', 'onChange', m.checkInvoiceReferenceExists);
			m.connect('cust_ref_id', 'onChange', m.checkInvoiceCustReferenceExists);
			m.connect('buyer_abbv_name', 'onChange', m.checkInvoiceReferenceExists);
			m.connect('buyer_abbv_name', 'onChange', m.checkInvoiceCustReferenceExists);
			m.connect('seller_abbv_name', 'onChange', m.checkInvoiceReferenceExists);
			m.connect('seller_abbv_name', 'onChange', m.checkInvoiceCustReferenceExists);
			m.connect('total_cur_code', 'onChange',function(){
				m.setCurrency(this, ['line_item_total_net_amt','line_item_total_amt',
					'line_item_price_amt','tax_amt','adjustment_amt','details_amt','freight_charge_amt']);
				this.set("readOnly",false);
			});
			
			var productCode = m._config.productCode.toLowerCase();
			if(productCode === "ip"){
				m.connect('fscm_programme_code', 'onChange', function(){
					var fieldId= ['seller_name','seller_abbv_name','seller_bei', 'seller_street_name','seller_post_code', 'seller_town_name','seller_country_sub_div', 
					              'seller_country','seller_account_type','seller_account_value','fin_inst_bic','fin_inst_name','fin_inst_street_name',
					              'fin_inst_town_name','fin_inst_country_sub_div'];
					m.clearFields(fieldId);
				});
					
			}
			if(productCode === 'in'){
					m.connect('fscm_programme_code', 'onChange', function(){
						var fieldId= ['buyer_name','buyer_abbv_name','buyer_bei', 'buyer_street_name','buyer_post_code', 'buyer_town_name','buyer_country_sub_div', 
						              'buyer_country','buyer_account_type','buyer_account_value','fin_inst_bic','fin_inst_name','fin_inst_street_name',
						              'fin_inst_town_name','fin_inst_country_sub_div','access_opened','transaction_counterparty_email','ben_company_abbv_name'];
						m.clearFields(fieldId);
			 });
			}
			
			m.connect('freight_charges_type', 'onFocus', m.saveOldFreightChargeType);
			m.connect('freight_charges_type', 'onChange', m.manageFreightButton);
			// Fill currency fields with the Purchase Order Currency
			m.connect('total_cur_code', 'onChange', m.managePOCurrency);
			// Adjustment - Amount and Rate fields are mutually exclusive
			m.connect('adjustment_amt', 'onChange', function(){
				m.toggleFields(isNaN(this.get("value")), null ,["adjustment_rate"],false,false);
			});
			m.connect('adjustment_rate', 'onChange', function(){
				m.toggleFields(isNaN(this.get("value")), null ,["adjustment_amt","adjustment_cur_code"],false,false);
			});
			//FREIGHT CHARGES: amount XOR rate
			m.connect('freight_charge_amt', 'onChange', function(){
				m.toggleFields(isNaN(this.get("value")), null ,["freight_charge_rate"],false,false);
			});
			m.connect('freight_charge_rate', 'onChange', function(){
				m.toggleFields(isNaN(this.get("value")), null ,["freight_charge_amt","freight_charge_cur_code"],false,false);
			});
			//TAXES: amount XOR rate
			m.connect('tax_amt', 'onChange', function(){
				m.toggleFields(isNaN(this.get("value")), null ,["tax_rate"],false,false);
			});
			m.connect('tax_rate', 'onChange', function(){
				m.toggleFields(isNaN(this.get("value")), null ,["tax_amt","tax_cur_code"],false,false);
			});

			m.connect('display_other_parties', 'onClick', m.showHideOtherParties);
			m.connect('total_cur_code', 'onFocus', m.saveOldPOCurrency);
			m.connect('transport_type', 'onChange', m.onChangeTranportType);
			m.connect('payment_terms_type_1', 'onClick', m.onClickCheckPaymentTerms);
			m.connect('payment_terms_type_2', 'onClick', m.onClickCheckPaymentTerms);
			
			m.connect('seller_account_type', 'onChange', function(){
				m.onChangeSellerAccountType('form_settlement', 'seller_account_value', 'seller_account_type');
			});
			m.connect('seller_account_value', 'onBlur', function(){
				m.onBlurSellerAccount('form_settlement', 'seller_account_value', 'seller_account_type');
			});
			m.connect('last_match_date', 'onBlur', m.onBlurMatchDate);	
			m.connect('line_item_qty_val', 'onBlur', m.computeLineItemAmount);
			m.connect('line_item_price_amt', 'onBlur', m.computeLineItemAmount);
			m.connect("line_item_qty_unit_measr_code", "onChange", function(){
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
						
			m.connect('face_total_cur_code', 'onChange', function(){
				m.setCurrency(this, ['face_total_amt']);
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
			m.connect('face_total_amt', 'onChange', function(){
				m.setTnxAmt(this.get('value'));
			});
			m.connect('line_item_total_cur_code', 'onChange', function(){
				m.setCurrency(this, ['line_item_total_amt']);
			});
			m.connect('line_item_total_net_cur_code', 'onChange', function(){
				m.setCurrency(this, ['line_item_total_net_amt']);
			});
			m.connect('fake_total_cur_code', 'onChange', function(){
				m.setCurrency(this, ['fake_total_amt']);
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
			
			if(productCode === "ip"){
			  m.connect("issuing_bank_customer_reference", "onChange", m.setBuyerReference);
			}
			if(productCode === "in"){
			  m.connect("issuing_bank_customer_reference", "onChange", m.setSellerReference);
			}
			
			var issuingBankCustRef = dj.byId('issuing_bank_customer_reference'),
				issuingBankAbbvName = dj.byId('issuing_bank_abbv_name'),
				tempReferenceValue;
			
			if(issuingBankCustRef){
				tempReferenceValue = issuingBankCustRef.value;
			}
			if(issuingBankAbbvName)
			{
				issuingBankAbbvName.onChange();
			}
			if(issuingBankCustRef)
			{
				issuingBankCustRef.onChange();
				issuingBankCustRef.set('value',tempReferenceValue);
			}
			//Lineitems quantity codes
			m.connect(dj.byId('line_item_qty_unit_measr_code'), 'onChange',  function(){
				
				dj.byId('line_item_price_unit_measr_code').set('value', this.get('value'));
			});
			

			//Decode type code in widgets
			m.connect(dj.byId('details_code'), 'onChange', m.paymentDetailsChange);
			m.connect(dj.byId('line_item_qty_unit_measr_code'), 'onChange', function(){
				dj.byId('line_item_qty_unit_measr_label').set('value', this.get('displayedValue'));
			});
			m.connect(dj.byId('contact_type'), 'onChange', function(){
				dj.byId('contact_type_decode').set('value', this.get('displayedValue'));
			});
			m.connect(dj.byId('product_identifier_code'), 'onChange', function(){
				dj.byId('product_identifier_code_label').set('value', this.get('displayedValue'));
			});
			m.connect(dj.byId('product_category_code'), 'onChange', function(){
				dj.byId('product_category_code_label').set('value', this.get('displayedValue'));
			});
			m.connect(dj.byId('product_characteristic_code'), 'onChange', function(){
				dj.byId('product_characteristic_code_label').set('value', this.get('displayedValue'));
			});
			m.connect(dj.byId('adjustment_type'), 'onChange', function(){
				dj.byId('adjustment_type_label').set('value', this.get('displayedValue'));
			});
			m.connect(dj.byId('tax_type'), 'onChange', function(){
				dj.byId('tax_type_label').set('value', this.get('displayedValue'));
			});
			m.connect(dj.byId('freight_charge_type'), 'onChange', function(){
				dj.byId('freight_charge_type_label').set('value', this.get('displayedValue'));
			});
			m.connect(dj.byId('incoterm_code'), 'onChange', function(){
				dj.byId('incoterm_code_label').set('value', this.get('displayedValue'));
			});
			m.connect(dj.byId('iss_date'), 'onChange', function(){
				var detailsCode = dj.byId('details_code');
				if (detailsCode && detailsCode.get("value") === "OTHR")
				{
					var dueDate = dj.byId('due_date').value;
					var issueDate = dj.byId('iss_date').value;
					var days = dojo.date.difference(issueDate,dueDate, "day");
					dj.byId('details_nb_days').set('value', days);
				}
			});
			m.connect(dj.byId('due_date'), 'onChange', function(){
				var detailsCode = dj.byId('details_code');
				if (detailsCode && detailsCode.get("value") === "OTHR")
				{
					var dueDate = dj.byId('due_date').value;
					var issueDate = dj.byId('iss_date').value;
					var days = dojo.date.difference(issueDate,dueDate, "day");
					dj.byId('details_nb_days').set('value', days);
				}
			});
			m.connect(dj.byId('details_code'), 'onChange', function(){
				var detailsCode = dj.byId('details_code');
				var dueDate = dj.byId('due_date').value;
				var issueDate = dj.byId('iss_date').value;
				if (detailsCode && issueDate && dueDate &&
						detailsCode.get("value") === "OTHR")
				{
					var days = dojo.date.difference(issueDate,dueDate, "day");
					dj.byId('details_nb_days').set('value', days);
					dj.byId('details_nb_days').set('disabled', true);	
				}
				else {
					var fieldId = ['details_nb_days'];
					m.clearFields(fieldId);
					dj.byId('details_nb_days').set('disabled', false);
				}
			});
			
			m.connect(dj.byId('adjustment_type'), "onChange", function(){
				var adjustmentType = dj.byId("adjustment_type").get("value");
				if(adjustmentType === "REBA" || adjustmentType === "CREN" || adjustmentType === "DISC")
				{
					dj.byId("adjustment_direction_1").set("disabled",true);
					dj.byId("adjustment_direction_2").set("checked",true);
					dj.byId("adjustment_direction_2").set("disabled",false);
				}
				else if(adjustmentType === "DEBN")
				{
					dj.byId("adjustment_direction_1").set("disabled",false);
					dj.byId("adjustment_direction_1").set("checked",true);
					dj.byId("adjustment_direction_2").set("disabled",true);
				}
				else
				{
					dj.byId("adjustment_direction_1").set("checked",false);
					dj.byId("adjustment_direction_1").set("disabled",false);
					dj.byId("adjustment_direction_2").set("disabled",false);
					dj.byId("adjustment_direction_2").set("checked",false);
				}	
			});
			
			if (d.byId('adjustment_other_type_row') && d.byId('adjustment_type')) {
				if (dj.byId('adjustment_type').get("value") === "OTHR") {
					m.animate("fadeIn", 'adjustment_other_type_row');
				}
				else {
					m.animate("fadeOut", 'adjustment_other_type_row');
				}
			}
			
			if (d.byId('tax_other_type_row') && d.byId('tax_type')) {
				if (dj.byId('tax_type').get("value") === "OTHR") {
					m.animate("fadeIn", 'tax_other_type_row');
				}
				else {
					m.animate("fadeOut", 'tax_other_type_row');
				}
			}
			
			if (d.byId('discount_exp_date_row') && d.byId('adjustment_type')) {
				if (dj.byId('adjustment_type').get("value") === "DISC") {
					m.animate("fadeIn", 'discount_exp_date_row');
				}
				else {
					m.animate("fadeOut", 'discount_exp_date_row');
				}
			}
			
			m.connect("adjustment_type", "onChange", function(){
				m.toggleFields((this.get("value") === "OTHR"),
						null, ["adjustment_other_type"]);
				if (d.byId('adjustment_other_type_row')) {
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
				if (d.byId('tax_other_type_row')) {
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
			m.connect("adjustment_type", "onChange", function(){
				m.toggleFields((this.get("value") === "DISC"),
						null, ["discount_exp_date"]);
				if (d.byId('discount_exp_date_row')) {
					if (this.get("value") === "DISC")
					{
						m.animate("fadeIn", 'discount_exp_date_row');
					}
					else
					{
						m.animate("fadeOut", 'discount_exp_date_row');
					}
				}
			});
			
			if (d.byId('product_category_other_code_row') && d.byId('product_category_code')) {
				if (dj.byId('product_category_code').get("value") === "OTHR") {
					m.animate("fadeIn", 'product_category_other_code_row');
				}
				else {
					m.animate("fadeOut", 'product_category_other_code_row');
				}
			}
			if (d.byId('product_characteristic_other_code_row') && d.byId('product_characteristic_code')) {
				if (dj.byId('product_characteristic_code').get("value") === "OTHR") {
					m.animate("fadeIn", 'product_characteristic_other_code_row');
				}
				else {
					m.animate("fadeOut", 'product_characteristic_other_code_row');
				}
			}
			if (d.byId('product_identifier_other_code_row') && d.byId('product_identifier_code')) {
				if (dj.byId('product_identifier_code').get("value") === "OTHR") {
					m.animate("fadeIn", 'product_identifier_other_code_row');
				}
				else {
					m.animate("fadeOut", 'product_identifier_other_code_row');
				}
			}
			if (d.byId('incoterm_other_row') && d.byId('incoterm_code')) {
				if (dj.byId('incoterm_code').get("value") === "OTHR") {
					m.animate("fadeIn", 'incoterm_other_row');
				}
				else {
					m.animate("fadeOut", 'incoterm_other_row');
				}
			}
			if (d.byId('details_other_paymt_terms_row') && d.byId('details_code')) {
				if (dj.byId('details_code').get("value") === "OTHR") {
					m.animate("fadeIn", 'details_other_paymt_terms_row');
				}
				else {
					m.animate("fadeOut", 'details_other_paymt_terms_row');
				}
			}
			if (d.byId('freight_charge_other_type_row') && d.byId('freight_charge_type')) {
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
				if (d.byId('freight_charge_other_type_row')) {
					if (this.get("value") === "OTHR") {
						m.animate("fadeIn", 'freight_charge_other_type_row');
					}
					else {
						m.animate("fadeOut", 'freight_charge_other_type_row');
					}
				}
			});
			m.connect("details_code", "onChange", function(){
				m.toggleFields((this.get("value") === "OTHR"),
						null, ["details_other_paymt_terms"]);
				if (d.byId('details_other_paymt_terms_row')) {
					if (this.get("value") === "OTHR") {
						m.animate("fadeIn", 'details_other_paymt_terms_row');
					}
					else {
						m.animate("fadeOut", 'details_other_paymt_terms_row');
					}
				}
			});
			m.connect("incoterm_code", "onChange", function(){
				m.toggleFields((this.get("value") === "OTHR"),
						null, ["incoterm_other"]);
				if (d.byId('incoterm_other_row')) {
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
				if (d.byId('product_identifier_other_code_row')) {
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
				if (d.byId('product_characteristic_other_code_row')) {
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
				if (d.byId('product_characteristic_other_code_row')) {
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
		},

		
		onFormLoad : function() {
			//  summary:
			//          Events to perform on page load.
			//  tags:
			//         public
			m.setCurrency(dj.byId('total_net_cur_code'), ['total_net_amt']);

			// Show/hide other parties section
			var displayOtherParties = dj.byId('display_other_parties');
			if(displayOtherParties) {
				m.showHideOtherParties();
			}
		    
			// Enable/disable the add line item button
			m.toggleDisableButtons();
			// disabled the add payment term button
			if (dj.byId('add_payment_term_button') && !(dj.byId('payment_terms_type_1').get('checked')||dj.byId('payment_terms_type_2').get('checked'))){
				dj.byId('add_payment_term_button').set('disabled', true);
			}
			// Populate references
			var issuingBankCustRef 	= dj.byId("issuing_bank_customer_reference"),
				issuingBankAbbvName = dj.byId("issuing_bank_abbv_name"),
				tempReferenceValue;
			if(issuingBankCustRef)
			{
				tempReferenceValue = issuingBankCustRef.value;
			}
			if(issuingBankAbbvName)
			{
				issuingBankAbbvName.onChange();
			}
			if(issuingBankCustRef)
			{
				issuingBankCustRef.onChange();
				issuingBankCustRef.set('value',tempReferenceValue);
			}
			
			//compute total amount after load of data if they exist.
			m.computePOTotalAmount();
			m._config._hasLineItemShipmentDate();
			m.managePOCurrency();
			
			if (d.byId('line_item_qty_unit_measr_other_row')) {
				m.animate("fadeOut", 'line_item_qty_unit_measr_other_row');
			}
		},
		
		beforeSubmitValidations : function() {
			
			var valid = true;
			var error_message = "";
			var payments = dj.byId("po-payments");
			var lineItems = dj.byId("line-items");
			var totalAmtField = dj.byId("total_net_amt");
			
			// Test that the due date is greater than the application date
			var applDate = dj.byId("appl_date");
			var dueDate = dj.byId("due_date");
			if(!m.compareDateFields(applDate, dueDate)) {
				error_message = m.getLocalization("dueDateLessThanAppDateError",
						[m.localizeDate(dueDate),
						 m.localizeDate(applDate)]);
				valid = false;
			}
			// Test that the due date is greater than the issue date
			var issDate = dj.byId("iss_date");
			if(!m.compareDateFields(issDate, dueDate)) {
				if (error_message !== ""){
					error_message += "<br>";
				}
				error_message += m.getLocalization("dueDateLessThanInvoiceDateError",
						[m.localizeDate(dueDate),
						 m.localizeDate(issDate)]);
				valid = false;
			}
			
			// Alteast one line item is expected.
			if(!lineItems || !lineItems.store || lineItems.store._arrayOfTopLevelItems.length <= 0 ) {
				if (error_message !== ""){
					error_message += "<br>";
				}
				error_message += misys.getLocalization("mandatoryLineItemError");
				valid = false;
			}
			// Alteast one Payment Term is expected.
			if (!payments || !payments.grid || payments.grid.rowCount <= 0) {
				if (error_message !== ""){
					error_message += "<br>";
				}
				error_message += m.getLocalization("mandatoryPaymentTermError");
				valid = false;
			} 
			
			//Payment amount/percentage check with the total net amount.
			if(totalAmtField && payments.store && payments.store._arrayOfTopLevelItems.length > 0)
			{
				var sumPaymentAmt = 0;
				var	Amt= 0;
				var totalNetAmt = parseFloat(dijit.byId("total_net_amt").get("value"));
				payments.store.fetch({
						query:{store_id:"*"},
						onComplete: dojo.hitch(payments, function(items, request){
							dojo.forEach(items, function(item){
								
								if(item.amt[0] !== "")
									{
									sumPaymentAmt = sumPaymentAmt + parseFloat(item.amt[0].replace(/[^\d.]/g, ""));
									}
									else if(item.pct[0] !== "")
									{
										Amt = (parseFloat(item.pct[0])/100)*totalNetAmt ;
										sumPaymentAmt = sumPaymentAmt + Amt;
									}
								});
						    })
					    });
					
					if(sumPaymentAmt !== totalNetAmt)
					{
						if (error_message !== ""){
							error_message += "<br>";
						}
						error_message += misys.getLocalization("paymentAmtOrPercentage");
						valid = false;
					}
			}
			
			m._config.onSubmitErrorMsg = error_message;
			return valid;
		},

		beforeSaveValidations : function(){
			 var entity = dj.byId("entity") ;
			 var valid = false;
			 
			 if( (entity && entity.get("value") === ""))
		 	 {
			 	valid = false;
		 	 }
			 else if (dj.byId("total_net_amt") && dj.byId("total_net_amt").state === "Error")
			 {
				 m._config.onSubmitErrorMsg = m.getLocalization("totalNetAmountExceeded");
				 valid = false;
			 }
			 else
			 {
				 valid = true;
			 }
			 return valid;
			 }
		});
	
	function _checkLineItemsCurrencyTotalCurrency()
	{
		//  summary:
		//  Checks the change in invoice currency against line items currency, if changed then  prompts the user 
		//  private
		var message = misys.getLocalization('resetInvoicePayableCurrency');
		var that = this,
		curCodeDiffFlag = false,
		oldCurCode;
		
		if(dj.byId("line-items") && dj.byId("line-items").store && dj.byId("line-items").store !== null && dj.byId("line-items").store._arrayOfAllItems.length >0)
		{
			if(dj.byId("line-items").grid && dj.byId("line-items").grid.store)
			{
				dj.byId("line-items").grid.store.fetch({
					query: {store_id: '*'},
					onComplete: dojo.hitch(this, function(items, request){
						 d.some(items, function(item){
							 var currentObject = item;
							if(currentObject !== null && currentObject.price_cur_code !== that.get("value"))
							{
								curCodeDiffFlag = true;
								oldCurCode = currentObject.price_cur_code;
								return false;
							}
						 });
						
						if(curCodeDiffFlag)
						{
							var okCallback = function() {
								d.forEach(items, function(item){
									var lineItemStore = dj.byId("line-items").grid.store;
									var  totalCurCode = dj.byId('total_cur_code')?dj.byId('total_cur_code').get('value'):"";
									lineItemStore.setValue(item, 'price_cur_code', totalCurCode);
									lineItemStore.setValue(item, 'total_cur_code', totalCurCode);
									lineItemStore.setValue(item, 'total_net_cur_code', totalCurCode);
									
									var totalNetFormattedValue = dojo.currency.format(item.total_net_amt, {currency: totalCurCode});
									if(null !== totalNetFormattedValue && totalNetFormattedValue !== '') {
									totalNetFormattedValue = totalNetFormattedValue.replace((/[^\d\.\,]/g), '');
									}
									lineItemStore.setValue(item, 'total_net_amt',totalNetFormattedValue);
									
									var totalAmtFormattedValue = dojo.currency.format(item.total_amt, {currency: totalCurCode});
									if(null !== totalAmtFormattedValue && totalAmtFormattedValue !== '') {
									totalAmtFormattedValue = totalAmtFormattedValue.replace((/[^\d\.\,]/g), '');
									}
									lineItemStore.setValue(item, 'total_amt', totalAmtFormattedValue);
									
									var priceAmtFormattedValue = dojo.currency.format(item.price_amt, {currency: totalCurCode});
									if(null !== priceAmtFormattedValue && priceAmtFormattedValue !== '') {
									priceAmtFormattedValue = priceAmtFormattedValue.replace((/[^\d\.\,]/g), '');
									}
									lineItemStore.setValue(item, 'price_amt', priceAmtFormattedValue);
									
									
									//Checking for taxes and updating currency  and amount format for existing taxes if any 
									if(item.taxes && item.taxes.length >0 )
									{
										dj.byId("tax_cur_code").set("value",totalCurCode);
										if(item.taxes[0]._values !== "" && item.taxes[0]._values.length >0 ) 
										{
											for(i=0;i<item.taxes[0]._values.length;i++) 
											{
												item.taxes[0]._values[i].cur_code= totalCurCode;
												var taxFormattedValue = dojo.currency.format(item.taxes[0]._values[i].amt, {currency: dj.byId("total_cur_code").get("value")});
												if(null !== taxFormattedValue && taxFormattedValue !== '') {
												taxFormattedValue = taxFormattedValue.replace((/[^\d\.\,]/g), ''); 
												}
												item.taxes[0]._values[i].amt = taxFormattedValue;
											}
										}
									}
									//Checking for adjustments and updating currency and amount format for existing adjustments if any
									if(item.adjustments && item.adjustments.length >0 )
									{
										dj.byId("adjustment_cur_code").set("value",totalCurCode);
										if(item.adjustments[0]._values !== "" && item.adjustments[0]._values.length >0 ) 
										{
											for(i=0;i<item.adjustments[0]._values.length;i++) 
											{
												item.adjustments[0]._values[i].cur_code= totalCurCode;
												var adjustmentFormattedValue = dojo.currency.format(item.adjustments[0]._values[i].amt, {currency: dj.byId("total_cur_code").get("value")});
												if(null !== adjustmentFormattedValue && adjustmentFormattedValue !== '') {
												adjustmentFormattedValue = adjustmentFormattedValue.replace((/[^\d\.\,]/g), ''); 
												}
												item.adjustments[0]._values[i].amt = adjustmentFormattedValue;
											}
										}
									}
									//Checking for freight charges and updating currency  and amount format for existing freight charges if any
									if(item.freight_charges && item.freight_charges.length >0 )
									{
										dj.byId("freight_charge_cur_code").set("value",totalCurCode);
										
										if(item.freight_charges[0]._values !== "" && item.freight_charges[0]._values.length >0 ) 
										{
											for(i=0;i<item.freight_charges[0]._values.length;i++) 
											{
												item.freight_charges[0]._values[i].cur_code= totalCurCode;
												var freightFormattedValue = dojo.currency.format(item.freight_charges[0]._values[i].amt, {currency: totalCurCode});
												if(null !== freightFormattedValue && freightFormattedValue !== '') {
												freightFormattedValue = freightFormattedValue.replace((/[^\d\.\,]/g), ''); 
												}
												item.freight_charges[0]._values[i].amt = freightFormattedValue;
											}
										}
									}
								}, dj.byId("line-items"));
								dj.byId("line-items").grid.store.save();
								setTimeout(function(){
									dj.byId("line-items").renderSections();
									dj.byId("line-items").grid.render();	
								}, 200);
								
								if(dj.byId("po-adjustments") && dj.byId("po-adjustments").store && dj.byId("po-adjustments").store !== null && dj.byId("po-adjustments").store._arrayOfAllItems.length >0 && 
										dj.byId("po-adjustments").grid && dj.byId("po-adjustments").grid.store)
								{

									d.forEach( dj.byId("po-adjustments").grid.store, function(item)
									{
										var poAdjustmentStore = dj.byId("po-adjustments").grid.store;
										var totalCurCode = dj.byId("total_cur_code") ?  dj.byId("total_cur_code").get("value") :"";
										poAdjustmentStore.setValue(item, 'cur_code', totalCurCode);
										var formattedValue = dojo.currency.format(item.amt, {currency: totalCurCode});
										if(null !== formattedValue && formattedValue !== '') {
										formattedValue = formattedValue.replace((/[^\d\.\,]/g), '');
										}
										poAdjustmentStore.setValue(item, 'amt',formattedValue);
										
									},dj.byId("po-adjustments"));
									
									dj.byId("po-adjustments").grid.store.save();
										setTimeout(function(){
											dj.byId("po-adjustments").renderSections();
											dj.byId("po-adjustments").grid.render();	
										}, 200);
								}
								
								if(dj.byId("po-taxes") && dj.byId("po-taxes").store && dj.byId("po-taxes").store !== null && dj.byId("po-taxes").store._arrayOfAllItems.length >0 && 
										dj.byId("po-taxes").grid && dj.byId("po-taxes").grid.store)
								{
									d.forEach( dj.byId("po-taxes").grid.store, function(item)
									{
										var poTaxestore = dj.byId("po-taxes").grid.store;
										var totalCurCode = dj.byId("total_cur_code") ?  dj.byId("total_cur_code").get("value") :"";
										poTaxestore.setValue(item, 'cur_code', totalCurCode);
										var formattedValue = dojo.currency.format(item.amt, {currency: totalCurCode});
										if(null !== formattedValue && formattedValue !== '') {
										formattedValue = formattedValue.replace((/[^\d\.\,]/g), '');
										}
										poTaxestore.setValue(item, 'amt',formattedValue);
										},dj.byId("po-taxes"));
									
									dj.byId("po-taxes").grid.store.save();
									setTimeout(function(){
										dj.byId("po-taxes").renderSections();
										dj.byId("po-taxes").grid.render();	
									}, 200);
									
								}
								if(dj.byId("po-freight-charges") && dj.byId("po-freight-charges").store && dj.byId("po-freight-charges").store !== null && dj.byId("po-freight-charges").store._arrayOfAllItems.length >0 && 
										dj.byId("po-freight-charges").grid && dj.byId("po-freight-charges").grid.store)
								{
									d.forEach( dj.byId("po-freight-charges").grid.store, function(item)
									{
										var poFreightstore = dj.byId("po-freight-charges").grid.store;
										var totalCurCode = dj.byId("total_cur_code") ?  dj.byId("total_cur_code").get("value") :"";
										poFreightstore.setValue(item, 'cur_code', totalCurCode);
										var formattedValue = dojo.currency.format(item.amt, {currency: totalCurCode});
										if(null !== formattedValue && formattedValue !== '') {
										formattedValue = formattedValue.replace((/[^\d\.\,]/g), '');
										}
										poFreightstore.setValue(item, 'amt',formattedValue);
										},dj.byId("po-freight-charges"));
									
									dj.byId("po-freight-charges").grid.store.save();
									setTimeout(function(){
										dj.byId("po-freight-charges").renderSections();
										dj.byId("po-freight-charges").grid.render();	
									}, 200);
								}
							};
							
							var onCancelCallback = function() {
								dj.byId("total_cur_code").set("value", oldCurCode);
							};
							m.dialog.show("CONFIRMATION", message, '', '', '', '', okCallback, onCancelCallback);
						}
					})
				});
		}
			
		if(dj.byId("po-adjustments") && dj.byId("po-adjustments").store && dj.byId("po-adjustments").store !== null && dj.byId("po-adjustments").store._arrayOfAllItems.length >0 && 
				dj.byId("po-adjustments").grid && dj.byId("po-adjustments").grid.store)
		{
				dj.byId("po-adjustments").grid.store.fetch(
						{
							query: {store_id: '*'},
							onComplete: dojo.hitch(this, function(items, request)
							{
								d.forEach(items, function(item)
								{
									var totalCurCode =  dj.byId("total_cur_code") ?  dj.byId("total_cur_code").get("value") :"";
									var poAdjustmentStore = dj.byId("po-adjustments").grid.store;
									poAdjustmentStore.setValue(item, 'cur_code',totalCurCode);
									var formattedValue = dojo.currency.format(item.amt, {currency: totalCurCode});
									if(null !== formattedValue && formattedValue !== '') {
									formattedValue = formattedValue.replace((/[^\d\.\,]/g), '');
									}
									poAdjustmentStore.setValue(item, 'amt',formattedValue);
								},dj.byId("po-adjustments"));
						})
					}
				);
		}
		if(dj.byId("po-taxes") && dj.byId("po-taxes").store && dj.byId("po-taxes").store !== null && dj.byId("po-taxes").store._arrayOfAllItems.length >0 && 
				dj.byId("po-taxes").grid && dj.byId("po-taxes").grid.store)
		{
				dj.byId("po-taxes").grid.store.fetch(
						{
							query: {store_id: '*'},
							onComplete: dojo.hitch(this, function(items, request)
							{
								d.forEach(items, function(item)
								{
									var poTaxstore = dj.byId("po-taxes").grid.store;
									var totalCurCode = dj.byId("total_cur_code") ?  dj.byId("total_cur_code").get("value") :"";
									poTaxstore.setValue(item, 'cur_code', totalCurCode);
									var formattedValue = dojo.currency.format(item.amt, {currency: totalCurCode});
									if(null !== formattedValue && formattedValue !== '') {
									formattedValue = formattedValue.replace((/[^\d\.\,]/g), '');
									}
									poTaxstore.setValue(item, 'amt',formattedValue);
								},dj.byId("po-taxes"));
						})
					}
				);
		}
		if(dj.byId("po-freight-charges") && dj.byId("po-freight-charges").store && dj.byId("po-freight-charges").store !== null && dj.byId("po-freight-charges").store._arrayOfAllItems.length >0 && 
				dj.byId("po-freight-charges").grid && dj.byId("po-freight-charges").grid.store)
		{
				dj.byId("po-freight-charges").grid.store.fetch(
						{
							query: {store_id: '*'},
							onComplete: dojo.hitch(this, function(items, request)
							{
								d.forEach(items, function(item)
								{
									var poFreightstore = dj.byId("po-freight-charges").grid.store;
									var totalCurCode = dj.byId("total_cur_code") ?  dj.byId("total_cur_code").get("value") :"";
									poFreightstore.setValue(item, 'cur_code', totalCurCode);
									var formattedValue = dojo.currency.format(item.amt, {currency: totalCurCode});
									if(null !== formattedValue && formattedValue !== '') {
									formattedValue = formattedValue.replace((/[^\d\.\,]/g), '');
									}
									poFreightstore.setValue(item, 'amt',formattedValue);
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
									var formattedValue = dojo.currency.format(item.amt, {currency: totalCurCode});
									if(null !== formattedValue && formattedValue !== '') {
									formattedValue = formattedValue.replace((/[^\d\.\,]/g), '');
									}
									poPaymentStore.setValue(item, 'amt',formattedValue);
								},dj.byId("po-payments"));
						})
					}
				);
		}
	}
})(dojo, dijit, misys);
//Including the client specific implementation
       dojo.require('misys.client.binding.openaccount.create_ip_client');