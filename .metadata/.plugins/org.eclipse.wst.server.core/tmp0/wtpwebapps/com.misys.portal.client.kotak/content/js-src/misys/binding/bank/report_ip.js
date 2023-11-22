dojo.provide("misys.binding.bank.report_ip");
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

dojo.require("misys.openaccount.FormOpenAccountEvents");
dojo.require("misys.grid.DataGrid");
dojo.require("misys.form.SimpleTextarea");
dojo.require("misys.form.common");
dojo.require("misys.form.file");
dojo.require("misys.validation.common");
dojo.require("misys.layout.FloatingPane");
dojo.require("dojo.data.ItemFileWriteStore");

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

	"use strict"; // ECMA5 Strict Mode
	
	// Public functions & variables follow
	d.mixin(m._config, {

		initReAuthParams : function() {

			var reAuthParams = {
				productCode : dj.byId("product_code").get("value"),
				subProductCode : '',
				transactionTypeCode : '15',
				entity : dj.byId("entity") ? dj.byId("entity").get("value") : '',
				currency : '',
				amount : '',

				es_field1 : '',
				es_field2 : ''
			};
			return reAuthParams;
		},
		_hasLineItemShipmentDate : function () {
			var lineItems = dj.byId("line-items");
			if(lineItems && lineItems.store != null) {
				var arrayLineItems = lineItems.store._arrayOfAllItems;
				
				for(var i=0;i<arrayLineItems.length;i++) {
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
	// Public functions & variables
	d.mixin(m, {
		bind : function() {
			var tnx_cur_code_field			=	dj.byId("tnx_cur_code"),
				total_net_field				=	dj.byId("total_net_cur_code"),
				liab_total_cur_code_field	=	dj.byId("liab_total_cur_code"),
				finance_cur_code			=	dj.byId("finance_cur_code"),
				inv_eligible_cur_code      	=   dj.byId("inv_eligible_cur_code"),
				total_net_amt_field		=	dj.byId("total_net_amt"),
				inv_eligible_amt_field =	dj.byId("inv_eligible_amt"),
				liab_total_amt_field	=	dj.byId("liab_total_amt"),
				tnx_amt_field 			=	dj.byId("tnx_amt"),
				finance_amt_field		=	dj.byId("finance_amt");
			
			m.setCurrency(tnx_cur_code_field, ["tnx_amt"]);
			m.setCurrency(total_net_field, ["total_net_amt"]);
			m.setCurrency(liab_total_cur_code_field, ["liab_total_amt"]);
			if(finance_cur_code){
			m.setCurrency(finance_cur_code, ["finance_amt"]);
			}
			if(inv_eligible_cur_code){
			m.setCurrency(inv_eligible_cur_code, ["inv_eligible_amt"]);
			}

			m.connect("prod_stat_code", "onChange", _handleStatusChange);
			if (dj.byId("inv_eligible_amt")) 
			{
				if (dj.byId("full_finance_accepted_flag")) 
				{
					m.connect("full_finance_accepted_flag", "onChange", m.handleFullFinancingFlag);
				}
				m.connect("inv_eligible_amt", "onChange", _handleEligibileAmt);
				m.connect("finance_amt", "onChange", _handleFinanceAmt);
				m.connect("finance_cur_code", "onChange", _handleFinanceAmt);
				if (inv_eligible_amt_field.get("value") && liab_total_amt_field) 
				{
					liab_total_amt_field.set("value",total_net_amt_field.get("value")-inv_eligible_amt_field.get("value"));
				}
				else if(liab_total_amt_field)
				{
					liab_total_amt_field.set("value",total_net_amt_field.get("value"));	
				}
			}
			else if (tnx_amt_field)
			{
				m.connect("tnx_amt", "onChange", _computeOutStandingAmount);
				if (tnx_amt_field && tnx_amt_field.get("value") && liab_total_amt_field ) 
				{
					liab_total_amt_field.set("value",total_net_amt_field.get("value")-tnx_amt_field.get("value"));
				}
				else if(liab_total_amt_field )
				{
					liab_total_amt_field.set("value",total_net_amt_field.get("value"));	
				}
			}
			if(total_net_amt_field){
				m.connect("total_net_amt", "onChange", _computeOutStandingAmount);
			}
			m.setValidation("iss_date", m.validateIPInvoiceDate);
			m.setValidation("due_date", m.validateIPDueDate);
			m.setValidation("contact_email", m.validateEmailAddr);
			m.setValidation("buyer_bei", m.validateBEIFormat);
			m.setValidation("seller_bei", m.validateBEIFormat);
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

			m.setValidation('buyer_country', m.validateCountry);
			m.setValidation('seller_country', m.validateCountry);
			m.setValidation('bill_to_country', m.validateCountry);
			m.setValidation('ship_to_country', m.validateCountry);
			m.setValidation('consgn_country', m.validateCountry);
			m.setValidation('line_item_product_orgn_country', m.validateCountry);
					
			// onChange
			m.connect('total_cur_code', 'onChange', m.toggleDisableButtons);
			m.connect('total_cur_code', 'onBlur', _checkLineItemsCurrencyTotalCurrency);
			
			m.connect('freight_charges_type', 'onChange', m.manageFreightButton);
			// Fill currency fields with the Purchase Order Currency
			m.connect('total_cur_code', 'onChange', m.managePOCurrency);

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
						
			m.connect('fake_total_cur_code', 'onChange', function(){
				m.setCurrency(this, ['fake_total_amt']);
			});
			m.connect('total_net_cur_code', 'onChange', function(){
				m.setCurrency(this, ['total_net_amt']);
			});
			m.connect('total_net_inv_cur_code', 'onChange', function(){
				m.setCurrency(this, ['total_net_inv_amt']);
			});
			
			m.connect('line_item_price_cur_code', 'onChange', function(){
				m.setCurrency(this, ['line_item_price_amt']);
			});
			m.connect('details_cur_code', 'onChange', function(){
				m.setCurrency(this, ['details_amt']);
			});
			m.connect('fake_total_amt', 'onChange', function(){
				var tnxAmtfield = dj.byId("tnx_amt");
				if(tnxAmtfield && (tnxAmtfield.get("value") === "" || isNaN(tnxAmtfield.get("value")))){
					tnxAmtfield.set("value", dj.byId("fake_total_amt").get("value"));
				}
			});
			m.connect('total_net_amt', 'onChange', function(){
				var totalNetAmt = dj.byId("total_net_inv_amt");
				if(totalNetAmt){
					totalNetAmt.set("value", dj.byId("total_net_amt").value);
				}
			});
			if(dj.byId("issuing_bank_abbv_name"))
			{
				m.connect("entity", "onChange", function(){
					dj.byId("issuing_bank_abbv_name").onChange();});
			}
			var productCode = m._config.productCode.toLowerCase();
			if(productCode == 'ip'){
			  m.connect("issuing_bank_customer_reference", "onChange", m.setBuyerReference);
			}
			if(productCode == 'in'){
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
			m.connect(dj.byId('line_item_qty_unit_measr_code'), 'onChange', function(){dj.byId('line_item_qty_unit_measr_label').set('value', this.get('displayedValue'));});
			m.connect(dj.byId('contact_type'), 'onChange', function(){dj.byId('contact_type_decode').set('value', this.get('displayedValue'));});
			m.connect(dj.byId('product_identifier_code'), 'onChange', function(){dj.byId('product_identifier_code_label').set('value', this.get('displayedValue'));});
			m.connect(dj.byId('product_category_code'), 'onChange', function(){dj.byId('product_category_code_label').set('value', this.get('displayedValue'));});
			m.connect(dj.byId('product_characteristic_code'), 'onChange', function(){dj.byId('product_characteristic_code_label').set('value', this.get('displayedValue'));});
			m.connect(dj.byId('adjustment_type'), 'onChange', function(){dj.byId('adjustment_type_label').set('value', this.get('displayedValue'));});
			m.connect(dj.byId('tax_type'), 'onChange', function(){dj.byId('tax_type_label').set('value', this.get('displayedValue'));});
			m.connect(dj.byId('freight_charge_type'), 'onChange', function(){dj.byId('freight_charge_type_label').set('value', this.get('displayedValue'));});
			m.connect(dj.byId('incoterm_code'), 'onChange', function(){dj.byId('incoterm_code_label').set('value', this.get('displayedValue'));});
		
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
				var tnx_cur_code_field			=	dj.byId("tnx_cur_code"),
				total_net_field				=	dj.byId("total_net_cur_code"),
				total_net_inv_field			=	dj.byId("total_net_inv_cur_code"),
				liab_total_cur_code_field	=	dj.byId("liab_total_cur_code"),
				prod_stat_code_field 		=	dj.byId("prod_stat_code"),
				total_net_amount_field		= 	dj.byId("total_net_amt"),
				total_net_inv_amount_field	= 	dj.byId("total_net_inv_amt"),
				inv_eligible_amt_field		=   dj.byId("inv_eligible_amt"),
				inv_eligible_ccy_field	=	dj.byId("inv_eligible_cur_code"),
				finance_amt_field		=	dj.byId("finance_amt"),
				finance_ccy_field		=	dj.byId("finance_cur_code"),
				full_finance_accepted_flag_field = dj.byId("full_finance_accepted_flag");
			var actionReqCodeField = dj.byId("action_req_code");
			
			m.setCurrency(liab_total_cur_code_field, ["liab_total_amt"]);
			m.setCurrency(tnx_cur_code_field, ["tnx_amt"]);
			m.setCurrency(total_net_field, ["total_net_amt"]);
			m.setCurrency(total_net_inv_field, ["total_net_inv_amt"]);

			if(total_net_inv_amount_field)
			{
				total_net_inv_amount_field.set("value", total_net_amount_field.get('value'));
			}
			        
			if (d.byId('inv_eligible_cur_code_row')  && !dj.byId("full_finance_accepted_flag"))
			{
				if(prod_stat_code_field.get('value') === "14" || prod_stat_code_field.get('value') === "15")
				{
					m.animate("wipeOut", d.byId('tnx_cur_code_row'));
				}
				else
				{
					m.animate("wipeOut", d.byId('inv_eligible_cur_code_row'));
					m.animate("wipeOut", d.byId('finance_cur_code_row'));
					m.connect("tnx_amt", "onBlur", _computeOutStandingAmount);
				}
			}
			if (d.byId("eligibility_content"))
			{
				 if (dj.byId("prod_stat_code").get("value") === "46")
				 {
					 if(dj.byId("tnx_amt") && (dj.byId("tnx_amt").get("value") === "" || isNaN(dj.byId("tnx_amt").get("value"))))
					 {
						 dj.byId("tnx_amt").set("value","");
						 dj.byId("tnx_amt").set("readOnly",true);
					 }
				 }
					
			}
			if(parseFloat(inv_eligible_amt_field) < parseFloat(total_net_amount_field))
			{
				dj.byId("full_finance_accepted_flag").set("checked", false);
				inv_eligible_amt_field.set("readOnly", false);
			}
			if (actionReqCodeField)
			{
				//sub_tnx_type_code 91 means acceptance of finance offer by the customer
				 if (prod_stat_code_field.get('value') === "01" || (dj.byId("sub_tnx_type_code") && dj.byId("sub_tnx_type_code").get("value") === "91"))
				 {	 
					 actionReqCodeField.set("value", "");				
					 m.animate("wipeOut", d.byId('action_req_code_row'));
				 }
				 else if (prod_stat_code_field.get('value') === "04" || prod_stat_code_field.get('value') === "07")
				 {
					actionReqCodeField.set("value", "07");
					actionReqCodeField.set("readOnly", true);				
					m.animate("wipeIn", d.byId('action_req_code_row'));
				 }
			}
		
			//From create_ip :

			//  summary:
			//          Events to perform on page load.
			//  tags:
			//         public
			m.setCurrency(dj.byId('total_net_cur_code'), ['total_net_amt']);
			m.setCurrency(dj.byId('total_net_inv_cur_code'), ['total_net_inv_amt']);

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
			if (full_finance_accepted_flag_field && prod_stat_code_field && prod_stat_code_field.get("value") === "01")
			 {
				 if(inv_eligible_amt_field)
					{
						 inv_eligible_amt_field.set("disabled", true);
						 inv_eligible_amt_field.set("value",null);
					}
				 if(inv_eligible_ccy_field)
					 {
						 inv_eligible_ccy_field.set("disabled", true);
						 inv_eligible_ccy_field.set("value",null);
					 }
				 if(full_finance_accepted_flag_field)
					{
						 full_finance_accepted_flag_field.set("disabled", true);
						 full_finance_accepted_flag_field.set("checked",false);
					}
				 if(finance_amt_field)
					 {
						 finance_amt_field.set("disabled", true);
						 finance_amt_field.set("value",null);
					 }
				 if(finance_ccy_field)
					 {
						 finance_ccy_field.set("disabled", true);
						 finance_ccy_field.set("value",null);
					 }
			 }
			/*
			 * Display the entire form for 07(updated). 
			 */			
			//Display only reporting section for Pending records.
			m.toggleFSCMTransactionDetails(prod_stat_code_field);
		}
	});
	
	function _computeOutStandingAmount()
	{
		var	tnx_amt_field			=	dj.byId("tnx_amt"),
			total_net_amt_field		=	dj.byId("total_net_amt"),
			liab_total_amt_field	=	dj.byId("liab_total_amt");
		
			if(tnx_amt_field && !isNaN(tnx_amt_field.get("value")))
			{
				if((tnx_amt_field.get("value") > total_net_amt_field.get("value")) && liab_total_amt_field)
				{
					tnx_amt_field.set("value","");
					liab_total_amt_field.set("value",total_net_amt_field.get("value"));
				}
				else if(liab_total_amt_field)
				{
					liab_total_amt_field.set("value",total_net_amt_field.get("value")-tnx_amt_field.get("value"));
				}
			}
			else if(liab_total_amt_field)
			{
				liab_total_amt_field.set("value",total_net_amt_field.get("value"));
			}
	}

	function _handleStatusChange()
	{
		var	prod_stat_code_field =	dj.byId("prod_stat_code"),
		eligibility_flag_field =	d.byId("eligibility_content"),
		org_eligibility_flag_field =	dj.byId("org_eligibility_content"),
		full_finance_accepted_flag_field =	dj.byId("full_finance_accepted_flag"),
		inv_eligible_amt_field  =	dj.byId("inv_eligible_amt"),
		finance_amt_field		=	dj.byId("finance_amt"),
		inv_eligible_ccy_field	=	dj.byId("inv_eligible_cur_code"),
		finance_ccy_field		=	dj.byId("finance_cur_code"),
		total_net_amt_field		=	dj.byId("total_net_amt"),
		total_net_cur_code_field	=	dj.byId("total_net_cur_code"),
	    finance_requested_flag_field = d.byId("finance_requested_flag");
	 var actionReqCodeField = dj.byId("action_req_code");
	 var liabTotalAmtField = dj.byId("liab_total_amt");

	 /*
	  * If Status is Eligible, the transaction amount field should be editable.
	  * If Status is Not Eligible,
	  * 	- the transaction amount field should be readonly, and equal to 0.
	  * 	- Total Outstanding should be equal to Invoice Amount.
	  */
	if (eligibility_flag_field)
	{
		 if (prod_stat_code_field.get('value') === "46" && dj.byId('tnx_amt'))
		 {
			 eligibility_flag_field.innerHTML = m.getLocalization("eligibleForFinancing");
			 dj.byId("tnx_amt").set("readOnly",false);
		 }
		 else if(prod_stat_code_field.get("value") === "47" )
		 {
			 eligibility_flag_field.innerHTML = m.getLocalization("notEligibleForFinancing");
			 dj.byId("tnx_amt").set("value",0);
			 dj.byId("tnx_amt").set("readOnly",true);
			 if(liabTotalAmtField && total_net_amt_field)
			 {
				 liabTotalAmtField.set("value",total_net_amt_field);
			 }
		 }
		 else
		 {
			 eligibility_flag_field.innerHTML = org_eligibility_flag_field.value;
			 dj.byId("tnx_amt").set("readOnly",false);
		 }
	}
	if (full_finance_accepted_flag_field)
	{
		 if (prod_stat_code_field.get('value') === "01")
		 {
			 inv_eligible_amt_field.set("disabled", true);
			 inv_eligible_amt_field.set("value",null);
			 inv_eligible_ccy_field.set("disabled", true);
			 inv_eligible_ccy_field.set("value",null);
			 full_finance_accepted_flag_field.set("disabled", true);
			 full_finance_accepted_flag_field.set("checked",false);
			 finance_amt_field.set("disabled", true);
			 finance_amt_field.set("value",null);
			 finance_ccy_field.set("disabled", true);
			 finance_ccy_field.set("value",null);
		 }
		 else if (prod_stat_code_field.get('value') === "04")
		 {
			 inv_eligible_amt_field.set("disabled", false);		
			 inv_eligible_ccy_field.set("disabled", false);
			 inv_eligible_ccy_field.set("value",total_net_cur_code_field.get("value"));
			 full_finance_accepted_flag_field.set("disabled", false);			 
			 finance_amt_field.set("disabled", false);		 
			 finance_ccy_field.set("disabled", false);
			 finance_ccy_field.set("value",total_net_cur_code_field.get("value"));
			 
			 /*
			  * - If org_inv_eligible_amt i.e. requested amount is equal to total net amount, then check the full finance box and set the amount fields to total net amount.
			  * - else, set it to the org_inv_eligible_amt.
			  */
			 if(dj.byId("org_inv_eligible_amt") && (dj.byId("org_inv_eligible_amt").get("value") == total_net_amt_field.get("value")))
				 {
				 	full_finance_accepted_flag_field.set("checked",true);
				 	inv_eligible_amt_field.set("value",total_net_amt_field.get("value"));
					finance_amt_field.set("value",total_net_amt_field.get("value"));
				 }
			 else
				 {
				 	inv_eligible_amt_field.set("value",dj.byId("org_inv_eligible_amt").get("value"));
					finance_amt_field.set("value",dj.byId("org_inv_eligible_amt").get("value"));
				 }
		 }
	}
	else if (finance_amt_field)
	{
		 if (prod_stat_code_field.get('value') === "14" || prod_stat_code_field.get('value') === "15")
		 {
				m.animate("wipeIn", d.byId('inv_eligible_cur_code_row'));
				m.animate("wipeIn", d.byId('finance_cur_code_row'));
				m.animate("wipeOut", d.byId('tnx_cur_code_row'));

				if (prod_stat_code_field.get('value') === "15")
				{
					inv_eligible_amt_field.set("readOnly", true);
					inv_eligible_amt_field.set("value",total_net_amt_field.value);
					finance_amt_field.set("value",total_net_amt_field.value);
					finance_ccy_field.set("value",inv_eligible_ccy_field.value);
				}
				else 
				{
					inv_eligible_amt_field.set("readOnly", false);
					inv_eligible_amt_field.set("value",total_net_amt_field.value);
					finance_amt_field.set("value",total_net_amt_field.value);
					finance_ccy_field.set("value",inv_eligible_ccy_field.value);
				}
		 }
		 else
		 {
			inv_eligible_amt_field.set("value",null);
			finance_amt_field.set("value",null);
			finance_ccy_field.set("value",null);
			m.animate("wipeOut", d.byId('inv_eligible_cur_code_row'));
			m.animate("wipeOut", d.byId('finance_cur_code_row'));
			m.animate("wipeIn", d.byId('tnx_cur_code_row'));
		 }
	}
	
	
	//Showing Action Required  only on  approved status
	if (actionReqCodeField)
	{
		 if (prod_stat_code_field.get('value') === "01" || (dj.byId("sub_tnx_type_code") && dj.byId("sub_tnx_type_code").get("value") === "91"))
		 {	 
			 actionReqCodeField.set("value", "");				
			 m.animate("wipeOut", d.byId('action_req_code_row'));
		 }
		 else if (prod_stat_code_field.get('value') === "04" || prod_stat_code_field.get('value') === "07")
		 {
			actionReqCodeField.set("value", "07");
			actionReqCodeField.set("readOnly", true);				
			m.animate("wipeIn", d.byId('action_req_code_row'));
		 }
	}
	
	if(finance_requested_flag_field)
	{
		if (prod_stat_code_field.get('value') === "01")
		 {
			 finance_requested_flag_field.value = "N";
		 }
		 else if (prod_stat_code_field.get('value') === "04")
		 {
			 finance_requested_flag_field.value = "Y";
		 }
	}
	
	//If Updated is selected, then enable/display complete form for update.Else display only reporting section.    
	m.toggleFSCMTransactionDetails(prod_stat_code_field);
}

	/**
	 * <h4>Summary:</h4>
	 * This function validates the Eligible amount with Invoice Amount, updates Finance Amount and outstanding amount.
	 * @method _handleEligibileAmt
	 * <h4>Description:</h4> 
	 * </br>The Eligible amount should be less than or Equal to Invoice Amount
	 * </br>The Finance amount is set to Eligible amount.
	 * </br>The Outstanding amount is set to (Invoice Amount - Eligible amount).
	 * @return {} 
	 *  
	 */
	function _handleEligibileAmt()
	{
		var	total_net_amt_field		=	dj.byId("total_net_amt"),
			inv_eligible_amt_field =	dj.byId("inv_eligible_amt"),
			liab_total_amt_field	=	dj.byId("liab_total_amt"),
			finance_amt_field 		= 	dj.byId("finance_amt");
		
		if(inv_eligible_amt_field.get("value") > total_net_amt_field.get("value"))
		{
			inv_eligible_amt_field.set("value","");
			m.dialog.show("ERROR", m.getLocalization("errorInvoiceElgibleAmountGreaterThanInvoiceAmount"));
		}
		else 
		{
			if (inv_eligible_amt_field.get("value")) 
			{
				finance_amt_field.set("value",inv_eligible_amt_field.get("value"));
				liab_total_amt_field.set("value",total_net_amt_field.get("value")-inv_eligible_amt_field.get("value"));
			}
			else 
			{
				liab_total_amt_field.set("value",total_net_amt_field.get("value"));	
			}
		}
		_handleFinanceAmt();
	}
	//
	
	function _handleFinanceAmt()
	{
		var	total_net_amt_field		=	dj.byId("total_net_amt"),
			inv_eligible_amt_field  =	dj.byId("inv_eligible_amt"),
			finance_amt_field		=	dj.byId("finance_amt"),
			inv_eligible_ccy_field	=	dj.byId("inv_eligible_cur_code"),
			finance_ccy_field		=	dj.byId("finance_cur_code"),
			full_finance_flag_field =   dj.byId("full_finance_accepted_flag"),
			liab_total_amt_field	=	dj.byId("liab_total_amt"),
			errorMessage;

		if (finance_amt_field.get("value") && finance_ccy_field.get("value")&& finance_ccy_field.get("value") == inv_eligible_ccy_field.get("value"))
		{
			if (finance_amt_field.get("value") > total_net_amt_field.get("value"))
			{
				finance_amt_field.set("value", "");
				errorMessage = full_finance_flag_field ? m.getLocalization("errorFinanceAmountGreaterThanInvoiceAmount"): m.getLocalization("errorPaymentAmountGreaterThanInvoiceAmount");
				m.dialog.show("ERROR",errorMessage);
			} 
			else if (inv_eligible_amt_field.get("value")&& finance_amt_field.get("value") > inv_eligible_amt_field.get("value"))
			{
				finance_amt_field.set("value", inv_eligible_amt_field.get("value"));
				errorMessage = full_finance_flag_field ? m.getLocalization("errorFinanceAmountGreaterThanInvoiceEligibleAmount"): m.getLocalization("errorPaymentAmountGreaterThanInvoiceEligibleAmount");
				m.dialog.show("ERROR",errorMessage);
			}
		}
		//If finance amount is updated to non null value, set outstanding amount to invoice amount - finance amount
		if(finance_amt_field && !isNaN(finance_amt_field.value))
		{
			liab_total_amt_field.set("value",total_net_amt_field.get("value")-finance_amt_field.get("value"));
		}
	}
	
	function _checkLineItemsCurrencyTotalCurrency()
	{
		//  summary:
		//  Checks the change in invoice currency against line items currency, if changed then  prompts the user, and sets the invoice global currency value to all the currencies. 
		//  private
		var message = misys.getLocalization('resetInvoicePayableCurrency');
		
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
	}
	})(dojo, dijit, misys);	//Including the client specific implementation
       dojo.require('misys.client.binding.bank.report_ip_client');