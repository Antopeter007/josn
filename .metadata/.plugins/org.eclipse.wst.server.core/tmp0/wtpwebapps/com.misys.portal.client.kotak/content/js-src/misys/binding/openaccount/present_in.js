dojo.provide("misys.binding.openaccount.present_in");
/*
 ----------------------------------------------------------
 Event Binding for

   Upload Invoice Presentation (IN) Form, Customer Side.

 Copyright (c) 2000-2011 Misys (http://www.misys.com),
 All Rights Reserved. 

 version:   1.0
 date:      24/07/11
 ----------------------------------------------------------
 */

dojo.require("dijit.layout.TabContainer");
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
dojo.require("misys.widget.Collaboration");

dojo.require("dojo.io.iframe"); 
dojo.require("dijit.ProgressBar");
dojo.require("dojo.behavior");
dojo.require("dojo.date.locale");
dojo.require("dijit.Tooltip");
dojo.require("dojo.parser");

dojo.require("misys.openaccount.FormOpenAccountEvents");
dojo.require("misys.grid.DataGrid");
dojo.require("misys.form.SimpleTextarea");
dojo.require("misys.form.addons");
dojo.require("misys.form.file");
dojo.require("misys.form.common");
dojo.require("misys.validation.common");
dojo.require("misys.layout.FloatingPane");
dojo.require("misys.openaccount.widget.Payments");
dojo.require("misys.openaccount.widget.Payment");
dojo.require("misys.openaccount.widget.InvoicePresentationPayments");





(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	// insert private functions & variables

	// Public functions & variables follow
	d.mixin(m, {
		bind : function() {

			//  summary:
		    //            Binds validations and events to fields in the form.              
		    //   tags:
		    //            public
			
			/*
			m.setValidation('total_cur_code', m.validateCurrency);
			m.setValidation('fake_total_cur_code', m.validateCurrency);
			m.setValidation('total_net_cur_code', m.validateCurrency);
			m.setValidation('line_item_price_cur_code', m.validateCurrency);
			m.setValidation('line_item_total_net_cur_code', m.validateCurrency);
			m.setValidation('adjustment_cur_code', m.validateCurrency);
			m.setValidation('details_cur_code', m.validateCurrency);
			m.setValidation('tax_cur_code', m.validateCurrency);
			m.setValidation('freight_charge_cur_code', m.validateCurrency);
		
			// onChange
			m.connect('total_cur_code', 'onChange', m.manageLineItemButton);
			// Fill currency fields with the Purchase Order Currency
			m.connect('total_cur_code', 'onChange', m.managePOCurrency);
		
			//
			// Other Events
			//
			m.connect('display_other_parties', 'onClick', m.showHideOtherParties);
			m.connect('total_cur_code', 'onFocus', m.saveOldPOCurrency);
		
			m.connect('transport_type', 'onFocus', m.checkRoutingSummaryUnicity);
			m.connect('transport_type', 'onChange', m.onChangeTranportType);
			
			m.connect('payment_terms_type_1', 'onClick', m.onClickCheckPaymentTerms);
			m.connect('payment_terms_type_2', 'onClick', m.onClickCheckPaymentTerms);
			
			m.connect('seller_account_type', 'onChange', function(){
			 	m.onChangeSellerAccountType('form_settlement', 'seller_account_value', 'seller_account_type');
			 	});
			m.connect('seller_account_name', 'onBlur', m.onBlurSellerAccountName);
			m.connect('seller_account_value', 'onFocus', m.onFocusSellerAccount);
			m.connect('seller_account_value', 'onBlur', function(){
				m.onBlurSellerAccount('form_settlement', 'seller_account_value', 'seller_account_type');
			});

			
			m.connect('fin_inst_name', 'onBlur', m.onBlurFinName);
			m.connect('fin_inst_bic', 'onBlur', m.onBlurFinBic);
			m.connect('fin_inst_street_name', 'onBlur', m.onBlurFinBic);
			m.connect('fin_inst_post_code', 'onBlur', m.onBlurFinPostCode);
			m.connect('fin_inst_town_name', 'onBlur', m.onBlurFinPostCode);
			m.connect('fin_inst_country_sub_div', 'onBlur', m.onBlurFinPostCode);
			m.connect('fin_inst_country', 'onBlur', m.onBlurFinPostCode);
			
			m.connect('last_match_date', 'onBlur', m.onBlurMatchDate);
//			m.connect('last_ship_date', 'onFocus', m.checkLastShipDateUnicity('last_ship_date'));
			m.setValidation("last_ship_date", m.validateLastShipmentDate);
//			m.connect('last_ship_date', 'onBlur', m.onBlurShipDate);
			
			m.connect('line_item_qty_val', 'onBlur', m.computeLineItemAmount);
			m.connect('line_item_price_amt', 'onBlur', m.computeLineItemAmount);
			
			m.connect('fake_total_cur_code', 'onChange', function(){
				m.setCurrency(this, ['fake_total_amt']);
			});
			m.connect('total_net_cur_code', 'onChange', function(){
				m.setCurrency(this, ['total_net_amt']);
			});

			m.onClickCheckPaymentTerms();
			// fill in fake fields.
			//m.managePOCurrency();
		//	m.computePOTotalAmount();
		*/
			m.connect(dj.byId('details_code'), 'onChange', m.paymentDetailsChange);
			m.connect("details_code", "onChange", function(){
				m.toggleFields((this.get("value") === "OTHR"),
						null, ["details_other_paymt_terms"]);
			});
			m.onClickCheckPaymentTerms();
			m.connect('tnx_amt', 'onChange', function(){
				if (dj.byId('fin_amt'))
				{
					dj.byId('fin_amt').set('value', dj.byId('tnx_amt').get('value'));
					m.setCurrency(this, ['fin_amt']);
				}
			});
		},

		onFormLoad : function() {
			//  summary:
			//          Events to perform on page load.
			//  tags:
			//         public
			
			/*
			// Show/hide other parties section
			var displayOtherParties = dj.byId('display_other_parties');
			if(displayOtherParties) {
				d.style('other_parties_section', 'display', displayOtherParties.get('checked') ? 'block' : 'none');
			}
		    
			// Enable/disable the add line item button
			m.manageLineItemButton();
			
			// Populate references
			var issuingBankAbbvName = dj.byId('issuing_bank_abbv_name');
			if(issuingBankAbbvName)
			{
				issuingBankAbbvName.onChange();
			}
			
			//compute total amount after load of data if they exist.
			m.computePOTotalAmount();
			
			m.managePOCurrency();
			*/
		},
		
		beforeSubmitValidations : function() {
			
			var invoiceAttachment = dijit.byId("attachment-fileinvoice");
			
			if (dj.byId("attachment-fileinvoice") && dj.byId("attachment-fileinvoice").store) {
				if(dj.byId("attachment-fileinvoice").store._arrayOfAllItems.length > 0) {
					return true;			
				}			
			}
			
			m._config.onSubmitErrorMsg = m.getLocalization("invoiceFileRequired");
			
			return false;
		}
		
	});
})(dojo, dijit, misys);
//Including the client specific implementation
       dojo.require('misys.client.binding.openaccount.present_in_client');