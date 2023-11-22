/*
 * ---------------------------------------------------------- 
 * Event Binding for Singapore domestic transfer
 * 
 * Copyright (c) 2000-2019 Finastra (http://www.misys.com), All Rights Reserved.
 * 
 * version: 1.0 date: 24/06/2019
 * 
 * ----------------------------------------------------------
 */
dojo.provide("misys.binding.bank.report_ft_rtgs");

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
dojo.require("misys.binding.common.create_fx");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode
	var fxMsgType = d.byId("fx-message-type");
	function _clearRequiredFields(message)
	{
		var callback = function() {
			var widget = dijit.byId("ft_amt");
		 	widget.set("state","Error");
	 		m.defaultBindTheFXTypes();
		 	dj.byId("ft_amt").set("value", "");
		 	if(dj.byId("ft_cur_code") && !dj.byId("ft_cur_code").get("readOnly"))
		 	{
		 		dj.byId("ft_cur_code").set("value", "");
		 	}
		};
		m.dialog.show("ERROR", message, "", function()
		{
			setTimeout(callback, 500);
		});
		
		if(d.byId("fx-section") && (d.style(d.byId("fx-section"),"display") !== "none"))
		{
			m.animate("wipeOut", d.byId("fx-section"));
		}
	}
	
	d.mixin(m._config, {

		initReAuthParams : function() {

			var reAuthParams = {
				productCode : 'FT',
				subProductCode : dj.byId("sub_product_code").get("value"),
				transactionTypeCode : "15",
				entity :dj.byId("entity") ? dj.byId("entity").get("value") : "",
				currency : dj.byId("ft_cur_code").get('value'),
				amount : m.trimAmount(dj.byId("ft_amt").get('value')),
				
				es_field1 : m.trimAmount(dj.byId("ft_amt").get('value')),
				es_field2 : (dj.byId("beneficiary_account")) ? dj.byId("beneficiary_account").get('value') : ''
			};
			return reAuthParams;
		}
	});
	
	d.mixin(m, {		
		
		fireFXAction : function()
		{
			if (m._config.fxParamData && dj.byId("sub_product_code") && dj.byId("sub_product_code").get("value") !== "")
			{
				var fxParamObject = m._config.fxParamData[dj.byId("sub_product_code").get("value")];
				if (m._config.fxParamData && fxParamObject.fxParametersData.isFXEnabled === "Y")
				{
					var fromCurrency,toCurrency;
					var ftCurrency="";
					if(dj.byId("ft_cur_code"))
					{
						ftCurrency = dj.byId("ft_cur_code").get("value");					
					}
					var amount = dj.byId("ft_amt").get("value");
					var ftAcctCurrency = dj.byId("applicant_act_cur_code").get("value");
					var productCode = m._config.productCode;
					var bankAbbvName = "";
					if(dj.byId("issuing_bank_abbv_name") && dj.byId("issuing_bank_abbv_name").get("value")!== "")
					{
						bankAbbvName = dj.byId("issuing_bank_abbv_name").get("value");
					}
					var masterCurrency = dj.byId("applicant_act_cur_code").get("value");
					var isDirectConversion = false;
						if(ftCurrency !== "" && !isNaN(amount) && productCode !== "" && bankAbbvName !== "" )
						{	
							if (ftCurrency !== ftAcctCurrency)
							{
								fromCurrency = ftAcctCurrency;
								toCurrency   = ftCurrency;
								masterCurrency = ftAcctCurrency;
							}
							if(fromCurrency && fromCurrency !== "" && toCurrency && toCurrency !== "")
							{
								if(d.byId("fx-section")&&(d.style(d.byId("fx-section"),"display") === "none"))
								{
									m.animate("wipeIn", d.byId("fx-section"));
								}							
								m.fetchFXDetails(fromCurrency, toCurrency, amount, productCode, bankAbbvName, masterCurrency, isDirectConversion);
								if(dj.byId("fx_rates_type_1") && dj.byId("fx_rates_type_1").get("checked"))
								{
									if(isNaN(dj.byId("fx_exchange_rate").get("value")) || dj.byId("fx_exchange_rate_cur_code").get("value") === "" ||
											isNaN(dj.byId("fx_exchange_rate_amt").get("value")) || (m._config.fxParamData[dj.byId("sub_product_code").get("value")].fxParametersData.toleranceDispInd === "Y" && (isNaN(dj.byId("fx_tolerance_rate").get("value")) || 
											isNaN(dj.byId("fx_tolerance_rate_amt").get("value")) || dj.byId("fx_tolerance_rate_cur_code").get("value") === "")))
									{
										_clearRequiredFields(m.getLocalization("FXDefaultErrorMessage"));
									}
								}
							}
							else
							{
								if(d.byId("fx-section") && (d.style(d.byId("fx-section"),"display") !== "none"))
								{
									m.animate("wipeOut", d.byId("fx-section"));
								}
								m.defaultBindTheFXTypes();
							}
						}
						if (dj.byId("recurring_payment_enabled") && dj.byId("recurring_payment_enabled").get("checked") && dj.byId("fx_rates_type_2"))
						{
							dj.byId("fx_rates_type_2").set("disabled", true);
							m.animate("wipeOut", d.byId("contracts_div"));
						}	
					}
			}
		},		
		
		bind : function()
		{
			// binding for tolerance
			m.setValidation("iss_date", m.validateTransferDateCustomer);
			
			dj.byId("sub_product_code").set("value", "RTGS");	
					
			//Bind all recurring payment details fields
			m.bindRecurringFields();
			
			//Populating Reporting status
			m.connect("prod_stat_code", "onChange", m.populateReportingStatus);
			
			m.connect("ft_cur_code", "onChange", function() {
				m.setCurrency(this, ["ft_amt"]);
			});
			
			m.setValidation("ft_cur_code", m.validateCurrency);
						
			m.connect("beneficiary_act_cur_code", "onChange", function() {	
				if(dj.byId("ft_cur_code") && !dj.byId("ft_cur_code").get("readOnly"))
					{
						dj.byId("ft_cur_code").set("value",dj.byId("beneficiary_act_cur_code").get("value"));
					}
			});
			
			m.connect("entity", "onChange", function() {				
				dj.byId("applicant_act_name").set("value", "");
			});
			
			m.connect("recurring_flag", "onClick", function(){
				m.showRecurring();
			});
			
			var subProduct = dj.byId("sub_product_code").get("value");			
			if(m._config.fxParamData && m._config.fxParamData[subProduct].fxParametersData.isFXEnabled === "Y"){
				//Start FX Actions
				m.connect("ft_cur_code", "onBlur", function(){
					m.setCurrency(this, ["ft_amt"]);
					if(dj.byId("ft_cur_code").get("value") !== "" && !isNaN(dj.byId("ft_amt").get("value"))){
						m.fireFXAction();
					}else{
						m.defaultBindTheFXTypes();
					}
				});
				m.connect("ft_amt", "onBlur", function(){
					
					m.setTnxAmt(this.get("value"));
					var ftCurrency="";
					if(dj.byId("ft_cur_code")){
						ftCurrency = dj.byId("ft_cur_code").get("value");					
					}
					if(!isNaN(dj.byId("ft_amt").get("value")) && ftCurrency !== ""){
						m.fireFXAction();
					}else{
						m.defaultBindTheFXTypes();
					}
				});
			}
			else
			{
				if(d.byId("fx-section") && dj.byId("fx_rates_type_1") && !dj.byId("fx_rates_type_1").get("checked") && dj.byId("fx_rates_type_2") && !dj.byId("fx_rates_type_2").get("checked"))
					{
						d.style("fx-section","display","none");
					}
			}
		},	
	
		onFormLoad : function(){
		
			m.populateReportingStatus();		

			m.setCurrency(dj.byId("ft_cur_code"), ["ft_amt"]);

			m.initForm();
			
			// on form load this value is not getting populated,set this field non mandatory
			if (dj.byId("applicant_act_product_types") && dj.byId("applicant_act_no").get("value") !== "")
			{
				m.toggleRequired("applicant_act_product_types", false);
			}

			if(dj.byId("recurring_payment_enabled") && dj.byId("recurring_payment_enabled").get("checked"))
		    {
				
		        m.showSavedRecurringDetails(false);
		    }
			else
			{
				 if(d.byId("recurring_payment_div"))
				   {
					   d.style("recurring_payment_div","display","none");
				   }
				m.showSavedRecurringDetails(false);
			}
			//hide fx section by default
			
			if(m._config.fxParamData && dj.byId("sub_product_code") && dj.byId("sub_product_code").get("value") !== "" && dj.byId("sub_product_code").get("value") !== "IBG")
			{
				m.initializeFX(dj.byId("sub_product_code").get("value"));
				if(dj.byId("applicant_act_cur_code") && dj.byId("applicant_act_cur_code").get("value") !== "" && dj.byId("ft_cur_code") && dj.byId("ft_cur_code").get("value") !== "" && dj.byId("applicant_act_cur_code").get("value")!== dj.byId("ft_cur_code").get("value") )
				{
					m.onloadFXActions();
				}
				else
				{
					m.defaultBindTheFXTypes();
				}
			}
			else
			{
				m.animate("fadeOut", fxMsgType);
			}
			if(d.byId("fx-section"))
			{
				//In case of bulk, from template will have amount and currency values on load, hence show fx section
				if(dj.byId("bulk_ref_id") && dj.byId("ft_cur_code") && dj.byId("ft_amt") && dj.byId("bulk_ref_id").get("value") !== "" && dj.byId("ft_cur_code").get("value") !== ""&& !isNaN(dj.byId("ft_amt").get("value")))
				{
					m.initializeFX(dj.byId("sub_product_code").get("value"));
					m.fireFXAction();
				}	
				else
				{
					//show fx section if previously enabled (in case of draft)
					if((dj.byId("fx_exchange_rate_cur_code") && dj.byId("fx_exchange_rate_cur_code").get("value")!== "")|| (dj.byId("fx_total_utilise_cur_code") && dj.byId("fx_total_utilise_cur_code").get("value")!== "") || ((dj.byId("fx_rates_type_1") && dj.byId("fx_rates_type_1").get("checked")) || (dj.byId("fx_rates_type_2") && dj.byId("fx_rates_type_2").get("checked"))))
					{
						m.animate("wipeIn", d.byId("fx-section"));
									
					}
					else
					{
						d.style("fx-section","display","none");
					}
				}
			}
					
		},
		
		initForm : function()
		{	
			dj.byId("sub_product_code").set("value", "RTGS");
			
			d.forEach(d.query(".CUR"),function(node, i)
			{
				d.style(node,"display","inline");
			});
			
			dj.byId("beneficiary_mode").set("value","02");

	     }
	          
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.bank.report_ft_rtgs_client');