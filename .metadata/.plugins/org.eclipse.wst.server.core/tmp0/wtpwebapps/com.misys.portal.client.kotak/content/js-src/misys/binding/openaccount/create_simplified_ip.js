dojo.provide("misys.binding.openaccount.create_simplified_ip");
/*
 ----------------------------------------------------------
 Event Binding for

   Simplified Invoice Payable (IP) Form, Customer Side.

 Copyright (c) 2000-2009 Misys (http://www.misys.com),
 All Rights Reserved. 

 version:   1.0
 date:      22/08/16
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

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {
//
//	// insert private functions & variables
//	
//	// Public functions & variables follow
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
		}
		
	});

	d.mixin(m, {
		bind : function() {
//
//			//  summary:
//		    //            Binds validations and events to fields in the form.              
//		    //   tags:
//		    //            public
//			
			m.setValidation("iss_date", m.validateIPInvoiceDate);
			m.setValidation("due_date", m.validateIPDueDate);
			m.setValidation("buyer_bei", m.validateBEIFormat);
			m.setValidation("seller_bei", m.validateBEIFormat);
			
			m.setValidation('total_cur_code', m.validateCurrency);
			m.setValidation('face_total_cur_code', m.validateCurrency);
			m.setValidation('total_net_cur_code', m.validateCurrency);
			m.connect('total_cur_code', 'onChange', m.managePOCurrencyAndAmt);
		
			m.connect("adjustment_direction_1", "onClick", function(){
				m.calculateTotalAmount();	
			});
			
			m.connect("adjustment_direction_2", "onClick", function(){
				m.calculateTotalAmount();		
			});

//			// Adjustment - Amount and Rate fields are mutually exclusive
			m.connect('total_adjustments', 'onChange', function(){
				m.calculateTotalAmount();
			});
			m.connect('adjustment_rate', 'onChange', function(){
				m.toggleFields(isNaN(this.get("value")), null ,["total_adjustments","adjustment_cur_code"],false,false);
			});
			m.connect('face_total_cur_code', 'onChange', function(){
				m.setCurrency(this, ['total_amt']);
			});
			m.connect('total_net_cur_code', 'onChange', function(){	
				m.setCurrency(this, ['total_net_amt']);
			});
			m.connect('total_amt', 'onChange', function(){
				m.calculateTotalAmount();
				m.setTnxAmt(this.get('value'));
			});
			m.connect('adjustment_cur_code', 'onChange', function(){
				m.setCurrency(this, ['total_adjustments']);
			});
			
			m.connect('issuer_ref_id', 'onChange', m.checkInvoiceReferenceExists);
			m.connect('cust_ref_id', 'onChange', m.checkInvoiceCustReferenceExists);
			m.connect('seller_abbv_name', 'onChange', m.checkInvoiceReferenceExists);
			m.connect('seller_abbv_name', 'onChange', m.checkInvoiceCustReferenceExists);
			m.connect('fscm_programme_code', 'onChange', function(){
				var fieldId= ['seller_name','seller_abbv_name','seller_bei', 'seller_street_name','seller_post_code', 'seller_town_name','seller_country_sub_div', 
				              'seller_country','seller_account_type','seller_account_value','fin_inst_bic','fin_inst_name','fin_inst_street_name',
				              'fin_inst_town_name','fin_inst_country_sub_div'];
				m.clearFields(fieldId);
			});
			
			//populate issuing reference
			m.connect("issuing_bank_abbv_name", "onChange", m.populateReferences);
			if(dj.byId("issuing_bank_abbv_name"))
			{
				m.connect("entity", "onChange", function(){
					dj.byId("issuing_bank_abbv_name").onChange();});
			}
			m.connect("issuing_bank_customer_reference", "onChange", m.setBuyerReference);
			// Other Events
			//
			m.connect('display_other_parties', 'onClick', m.showHideOtherParties);
		},
	
		onFormLoad : function() {
			// Show/hide other parties section
			var displayOtherParties = dj.byId('display_other_parties');
			if(displayOtherParties) {
				m.showHideOtherParties();
			}
			
			// Additional onload events for dynamic fields
			m.setCurrency(dj.byId("face_total_cur_code"), ["total_amt"]);
			m.setCurrency(dj.byId("adjustment_cur_code"), ["total_adjustments"]);
			m.setCurrency(dj.byId("total_net_cur_code"), ["total_net_amt"]);
			
			// Populate references
			var issuingBankAbbvName = dj.byId("issuing_bank_abbv_name");
			if(issuingBankAbbvName) {
				issuingBankAbbvName.onChange();
			}
			
			var issuingBankCustRef = dj.byId("issuing_bank_customer_reference");
			if(issuingBankCustRef) {
				issuingBankCustRef.onChange();
			}
			
			if(dj.byId("adjustment_direction_1") && !dj.byId("adjustment_direction_1").checked && dj.byId("adjustment_direction_2") && !dj.byId("adjustment_direction_2").checked)
			{
				dj.byId("adjustment_direction_1").set("checked", true);
			}
		},
		beforeSubmitValidations : function(){
			var valid = true;
			// Outstanding amount should not be zero.
			if(dj.byId("adjustment_direction_2") && dj.byId("adjustment_direction_2").checked && dj.byId("total_net_amt") && dj.byId("total_net_amt").get("value") === 0)
			{
				dj.byId('total_adjustments').set("state","Error");
				dj.showTooltip(m.getLocalization("outstandingAmountZeroNotApplicableError"), dj.byId("total_adjustments").domNode, 0);
				var hideTT = function() {
					dj.hideTooltip(dj.byId("total_adjustments").domNode);
				};
				setTimeout(hideTT, 4500);
				valid = false;
			}
			return valid;
		},
		
		beforeSaveValidations : function(){
	    	var entity = dj.byId("entity") ;
	    	if(entity && entity.get("value") === "")
	        {
	                return false;
	        }
	        else
	        {
	                return true;
	        }
	    }

		});

})(dojo, dijit, misys);
////Including the client specific implementation
       dojo.require('misys.client.binding.openaccount.create_simplified_ip_client');