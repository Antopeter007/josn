/*
 * ---------------------------------------------------------- 
 * Event Binding for Trade Internal transfers
 * 
 * Copyright (c) 2000-2012 Misys (http://www.misys.com), All Rights Reserved.
 * 
 * version: 1.0 date: 08/01/2013
 * 
 * ----------------------------------------------------------
 */
dojo.provide("misys.binding.bank.report_ft_tint");

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
dojo.require("misys.binding.trade.ls_common");
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
	
	
	// Public functions & variables follow

	 d.mixin(m._config, {
				/*
				 * Overriding to add license items in the xml.
				 */
			
			xmlTransform : function (/*String*/ xml) {
				var tdXMLStart = "<ft_tnx_record>";
				/*
				 * Add license items tags, only in case of LC transaction.
				 * Else pass the input xml, without modification. (Ex : for create beneficiary from popup.)
				 */
				if(xml.indexOf(tdXMLStart) !== -1){
					// Setup the root of the XML string
					var xmlRoot = m._config.xmlTagName,
					transformedXml = xmlRoot ? ["<", xmlRoot, ">"] : [],
							tdXMLEnd   = "</ft_tnx_record>",
							subTDXML	= "";
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
					
					var beneCur = dj.byId("beneficiary_act_cur_code");
					
					var isDirectConversion = false;
					
						if(ftCurrency !== "" && !isNaN(amount) && productCode !== "" && bankAbbvName !== "" )
						{	
							if (ftCurrency !== ftAcctCurrency)
							{
								fromCurrency = ftAcctCurrency;
								toCurrency   = ftCurrency;
								masterCurrency = ftAcctCurrency;
							}else if(masterCurrency && masterCurrency !== '' && ftCurrency && ftCurrency !== '' && masterCurrency === ftCurrency && (beneCur && beneCur.get("value") !== '' && ftCurrency !== beneCur.get("value")))
							{
								isDirectConversion = true;
								fromCurrency = ftCurrency;
								toCurrency   = beneCur.get("value");
								masterCurrency = toCurrency;
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
			
			m.connect("license_lookup","onClick", function(){
				m.getLicenses("ft");
			});
			
			dj.byId("sub_product_code").set("value", "TINT");
					
			//Bind all recurring payment details fields
			m.bindRecurringFields();
			
			//Validate Hyphen, allowed no of lines validation on the back-office comment
			m.setValidation("bo_comment", m.bofunction);
				
			//Populating Reporting status
			m.connect("prod_stat_code", "onChange", m.populateReportingStatus);	
			
			m.connect("prod_stat_code", "onChange", function(){
				if(dj.byId("mode") && dj.byId("mode").get("value") !== 'RELEASE')
				{
					var value = this.get("value");
					m.toggleFields(value && value !== "01" && value !== "18", null,
									["bo_ref_id"]);
				}
			});
			
			m.connect("ft_cur_code", "onChange", function() {
				m.setCurrency(this, ["ft_amt"]);
			});
			
			m.connect("entity", "onChange", function() {				
				m.setApplicantReference();
				dj.byId("applicant_act_name").set("value", "");
			});
			
			m.connect("recurring_flag", "onClick", m.showRecurring);
			var subProduct = dj.byId("sub_product_code").get("value");			
			if(m._config.fxParamData && m._config.fxParamData[subProduct].fxParametersData.isFXEnabled === "Y"){
				//Start FX Actions
				m.connect("ft_cur_code", "onChange", function(){
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
			
			m.populateGridOnLoad("ft");
		
			m.setCurrency(dj.byId("ft_cur_code"), ["ft_amt"]);

			m.initForm();
			
			if(dj.byId("mode") && dj.byId("mode").get("value") !== 'RELEASE')
				{
					m.toggleFields(dj.byId("prod_stat_code").get("value") && dj.byId("prod_stat_code").get("value") !== "01" && dj.byId("prod_stat_code").get("value") !== "18", null,
					["bo_ref_id"]);
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

			// on form load this value is not getting populated,set this field non mandatory
			if (dj.byId("applicant_act_product_types") && dj.byId("applicant_act_no").get("value") !== "")
			{
				m.toggleRequired("applicant_act_product_types", false);
			}

          //hide fx section by default
			var applicantField = dj.byId("applicant_act_cur_code");
			var beneficiaryField = dj.byId("beneficiary_act_cur_code");
			var ftCurField = dj.byId("ft_cur_code");
			if(m._config.fxParamData && dj.byId("sub_product_code") && dj.byId("sub_product_code").get("value") !== "" )
			{
				m.initializeFX(dj.byId("sub_product_code").get("value"));
				if(applicantField && applicantField.get("value") !== "" && ftCurField && ftCurField.get("value") !== "" && (applicantField.get("value")!== ftCurField.get("value") || ftCurField.get("value") !== beneficiaryField.get("value")))
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
			/*var ftCurrencyField = dj.byId("ft_cur_code");
			if(ftCurrencyField)
			{
			 var tempCurValue = ftCurrencyField.get("displayedValue");
			 //_actionOnAmtCurrencyField();
			 ftCurrencyField.set("displayedValue", tempCurValue);
			}*/
		},
		
		initForm : function()
		{	
			// TODO remove from here, use the one in the product
			dj.byId("sub_product_code").set("value", "TINT");

		}
	     
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.bank.report_ft_tint_client');