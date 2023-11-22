/*
 * ---------------------------------------------------------- 
 * Event Binding for Paper Instrument
 * 
 * Copyright (c) 2000-2011 Misys (http://www.misys.com), All Rights Reserved.
 * 
 * version: 1.0 date: 07/03/11
 * 
 * ----------------------------------------------------------
 */
dojo.provide("misys.binding.bank.report_pi");

dojo.require("dojo.parser");
dojo.require("dijit.layout.TabContainer");
dojo.require("dijit.form.DateTextBox");
dojo.require("misys.form.CurrencyTextBox");
dojo.require("dijit.form.NumberTextBox");
dojo.require("dijit.form.FilteringSelect");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.TextBox");
dojo.require("misys.widget.Dialog");
dojo.require("dijit.ProgressBar");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.CheckBox");
dojo.require("misys.form.PercentNumberTextBox");
dojo.require("misys.form.SimpleTextarea");
dojo.require("misys.widget.Collaboration");
dojo.require("misys.form.common");
dojo.require("misys.form.file");
dojo.require("misys.form.addons");
dojo.require("misys.validation.common");
dojo.require("misys.binding.cash.ft_common");
dojo.require("misys.form.BusinessDateTextBox");
dojo.require("misys.binding.core.beneficiary_advice_common");
dojo.require("misys.binding.common.bank_create_fx"); // [MPS-20349]

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {
	
	"use strict"; // ECMA5 Strict Mode
	
	var beneficiary = { };
	beneficiary.fields = [  'beneficiary_name',
	                        'beneficiary_name_2',
	                        'beneficiary_name_3',
	                		'beneficiary_address',
	                		'beneficiary_city',
	                		'beneficiary_dom',
	                		'beneficiary_address_line_4'
	                		];
	
	beneficiary.toggleEditable = function()
	{
		d.forEach(this.fields ,function(node, i)
		{
			if (dj.byId(node))
			{
				dj.byId(node).set("readOnly", false);
			}
		});
	};
	beneficiary.toggleReadonly = function()
	{
		d.forEach(this.fields ,function(node, i)
		{
			if (dj.byId(node))
			{
				dj.byId(node).set("readOnly", true);
			}
		});
	};
	beneficiary.clear = function()
	{
		d.forEach(this.fields ,function(node, i)
		{
			if (dj.byId(node))
			{
				dj.byId(node).set("value", '');
			}
		});
		
		d.style("pre_approved_benificiary","display","none");	
		dj.byId("pre_approved_status").set("value",'');
		
	};
	
	/**
	 * called after selecting a deliveryMode
	 */
	function _deliveryModeChangeHandler() {
		
		if (dj.byId("adv_send_mode").get("value") === '08') {
		
			d.style("delivery_mode_08_div", "display", "block");
			d.style("delivery_mode_09_div", "display", "none"); 
			m.toggleFields(false,null,['mailing_other_name_address','mailing_other_postal_code','mailing_other_country']);
			m.toggleFields(true,null,['collecting_bank_code', 'collecting_branch_code', 'collectors_name','collectors_id']);
			
			dj.byId("collecting_bank_code").set("readOnly",true);
			dj.byId("collecting_branch_code").set("readOnly",true);
		} 
		else if(dj.byId("adv_send_mode").get("value") === '09') {
			
			d.style("delivery_mode_09_div", "display", "block");
			d.style("delivery_mode_08_div", "display", "none"); 
			m.toggleFields(false,null,['collecting_bank_code', 'collecting_branch_code', 'collectors_name','collectors_id']);
			m.toggleFields(true,null,['mailing_other_name_address','mailing_other_postal_code','mailing_other_country']);
			
			dj.byId("mailing_other_country").set("readOnly",true);
			
		} 
		else {
			d.style("delivery_mode_08_div", "display", "none"); 
			d.style("delivery_mode_09_div", "display", "none"); 
			m.toggleFields(false,null,['collecting_bank_code', 'collecting_branch_code', 'collectors_name','collectors_id','mailing_other_name_address','mailing_other_postal_code','mailing_other_country']);
		}
		// The following validation is required as bank ROS system expect a value in the field, bank
		// request us to change on the portal.
		// The following validation is required as bank ROS system expect a value in the field, bank
		// request us to change on the portal.
		// As requested by bank, post code and country is optional and does not depend on delivery mode change.
		/*if(dj.byId("adv_send_mode").get("value") === '07' && dj.byId('beneficiary_country') && dj.byId('beneficiary_postal_code'))
		{
			m.toggleRequired(dj.byId('beneficiary_country'), true);
			m.toggleRequired(dj.byId('beneficiary_postal_code'), true);
		}
		else
		{
			m.toggleRequired(dj.byId('beneficiary_country'), false);
			m.toggleRequired(dj.byId('beneficiary_postal_code'), false);
		}	*/
	}
	

	
	d.mixin(m, {
		
		bind : function()
		{
			/*m.connect("beneficiary_name", "onChange", _beneficiaryChangeHandler);
			m.connect("beneficiary_img", "onClick", _beneficiaryButtonHandler);
			m.connect("clear_img", "onClick", _clearButtonHandler);*/
			//tolerance rate
			m.setValidation("fx_tolerance_rate", m.validateToleranceAndExchangeRate);
			m.setValidation("fx_exchange_rate", m.validateToleranceAndExchangeRate);
			
			m.setValidation("iss_date", m.validateTransferDate);
					
			m.setValidation("ft_cur_code", m.validateCurrency);
		
			m.connect("adv_send_mode", "onChange", _deliveryModeChangeHandler);
			m.connect("prod_stat_code", "onChange", function(){
				var value = this.get("value");
				m.toggleFields(
					value && value !== "01", 
					null,
					["bo_ref_id"]);});
			
			if(dj.byId('fx_rates_type_temp') && dj.byId('fx_rates_type_temp').get('value') !== ''){
				var maxNbrContracts =0;
				if(dj.byId('fx_nbr_contracts') && dj.byId('fx_nbr_contracts').get('value') > 0){
					maxNbrContracts = dj.byId('fx_nbr_contracts').get('value');
				}
				m.bindTheFXTypes(maxNbrContracts, 'Y');
			}
			
			//Bind all recurring payment details fields
			m.bindRecurringFields();
			
		},	
				
		onFormLoad : function() {
			
					m.setCurrency(dj.byId("ft_cur_code"), ["ft_amt"]);				
					
					_deliveryModeChangeHandler();
							
					m.setApplicantReference();	
					
				if(dj.byId("bank_img"))
					{
						d.style("bank_img","display","none");						
					}
				if(dj.byId("bank_iso_img")) 
					{
						d.style("bank_iso_img","display","none");		
					}
				if(dj.byId("prod_stat_code") && dj.byId("prod_stat_code").get("value") === "01")
				{
					dj.byId("bo_ref_id").set("disabled",true);
				}
				/*if(d.byId("fx-section"))
				{
					//show fx section if previously enabled (in case of draft)
					if((dj.byId("fx_exchange_rate_cur_code") && dj.byId("fx_exchange_rate_cur_code").get("value")!== "")|| (dj.byId("fx_total_utilise_cur_code") && dj.byId("fx_total_utilise_cur_code").get("value")!== ""))
					{
							m.animate("wipeIn", d.byId('fx-section'));											
					}
					else
					{
						d.style("fx-section","display","none");
					}
				}*/	
					
				 if(dj.byId('fx_rates_type_temp') && dj.byId('fx_rates_type_temp').get('value') !== ''){
				    m.onloadFXActions();
				 }
				 if(dj.byId("prod_stat_code"))
				 {
					 dj.byId("prod_stat_code").onChange();	
				 }
				//Show Recurring Payment details section and validate start date
				m.showSavedRecurringDetails(false);		
		}
		
	});
	d.ready(function(){		
		m._config.clearOnSecondCall = false;		
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.bank.report_pi_client');