/*
 * ---------------------------------------------------------- 
 * Event Binding for Trade Third Party transfers
 * 
 * Copyright (c) 2000-2012 Misys (http://www.misys.com), All Rights Reserved.
 * 
 * version: 1.0 date: 08/01/2013
 * 
 * ----------------------------------------------------------
 */
dojo.provide("misys.binding.bank.report_ft_ttpt");

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
dojo.require("misys.binding.trade.ls_common");
dojo.require("misys.binding.cash.ft_common");
dojo.require("misys.form.BusinessDateTextBox");

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
	
	function _preSubmissionFXValidation(){
		var valid = true;
		var error_message = "";
		var boardRateOption = dj.byId("fx_rates_type_2");
		var totalUtiliseAmt = dj.byId("fx_total_utilise_amt");
		var ftAmt = dj.byId("ft_amt");
		
		if (boardRateOption.get("checked") && totalUtiliseAmt && !isNaN(totalUtiliseAmt.get("value")) && ftAmt && !isNaN(ftAmt.get("value")))
		{
			if (ftAmt.get("value") < totalUtiliseAmt.get("value"))
			{
				error_message += m.getLocalization("FXUtiliseAmtGreaterMessage");
				valid = false;
			}
		}
		
		m._config.onSubmitErrorMsg =  error_message;
		return valid;
	}
	
	var displayMessage,	beneficiary = { };
	beneficiary.fields = [  "beneficiary_name",
	                		"beneficiary_account",
	                		"beneficiary_act_cur_code",	                		
	                		"beneficiary_address",
	                		"beneficiary_city",
	                		"beneficiary_dom",
	                		"cpty_bank_code",
	                		"cpty_bank_name",
	                		"cpty_bank_swift_bic_code",
	                		"cpty_bank_address_line_1",
	                		"cpty_bank_address_line_2",
	                		"cpty_bank_dom",
	                		"cpty_branch_code",
	                		"cpty_branch_name",
	                		"pre_approved"];
	
	beneficiary.toggleReadonly = function(/*boolean*/ flag)
	{
		m.toggleFieldsReadOnly(this.fields,flag);
	};
	
	beneficiary.clear = function()
	{
		d.forEach(this.fields ,function(node, i)
		{
			if (dj.byId(node))
			{
				dj.byId(node).set("value", "");
			}
		});
		d.style("PAB","display","none");
	};
	
	/**
	 * Third Party account validation (call back)
	 **/
	function _validateBeneficiaryAccount()
	{
		// Summary:
		// Validate if the beneficiary master account is a valid TTPT account
		var sub_product_code_field	=	dj.byId("sub_product_code"),
			account_number_field	=	dj.byId("beneficiary_account"),
			account_currency_field	= 	dj.byId("beneficiary_act_cur_code");
		var valid = false;
		
		m.xhrPost({
			url 		: misys.getServletURL("/screen/AjaxScreen/action/ValidateBeneficiaryMasterAccount") ,
			handleAs 	: "json",
			sync 		: true,
			content 	: { account_number : account_number_field.get("value"), 
							account_cur_code: account_currency_field.get("value"), 
							sub_product_code: sub_product_code_field.get("value") },
			load : function(response, args)
			{
				switch (response.items.StatusCode)
				{
					case "OK":
						//Populate any values that the validation might be returning into hidden fields
						account_currency_field.set("value", response.items.AcctCur);
						valid = true;
						break;
					case "ERR_INVALID_ACCOUNT_NUMBER":
						displayMessage = misys.getLocalization("invalidAccountNumber", [account_number_field.get("value")]);
						//focus on the widget and set state to error and display a tool tip indicating the same
						account_number_field.focus();
						account_number_field.set("value","");
						account_number_field.set("state","Error");
						dj.hideTooltip(account_number_field.domNode);
						dj.showTooltip(displayMessage, account_number_field.domNode, 0);
						break;
					case "ERR_INVALID_INTERFACE_PROCESSING_ERROR":
						displayMessage = misys.getLocalization("accountValidationInterfaceError");
						//focus on the widget and set state to error and display a tool tip indicating the same
						account_number_field.focus();
						account_number_field.set("value","");
						account_number_field.set("state","Error");
						dj.hideTooltip(account_number_field.domNode);
						dj.showTooltip(displayMessage, account_number_field.domNode, 0);
						break;
					default:
						displayMessage = response.items.StatusCodeMessage;
						//focus on the widget and set state to error and display a tool tip indicating the same
						account_number_field.focus();
						account_number_field.set("value","");
						account_number_field.set("state","Error");
						dj.hideTooltip(account_number_field.domNode);
						dj.showTooltip(displayMessage, account_number_field.domNode, 0);
						break;
				}
			},
			error : function(response, args) 
			{
				console.error("[Could not validate Beneficiary Account] " + account_number_field.get("value"));
				console.error(response);
			}
		});
		
		return valid;
	}
	
	d.mixin(m._config, {

		initReAuthParams : function() {

			var reAuthParams = {
				productCode : "FT",
				subProductCode : dj.byId("sub_product_code").get("value"),
				transactionTypeCode : "15",
				entity : dj.byId("entity") ? dj.byId("entity").get("value") : "",
				currency : dj.byId("ft_cur_code").get("value"),
				amount : m.trimAmount(dj.byId("ft_amt").get("value")),
				
				es_field1 : m.trimAmount(dj.byId("ft_amt").get("value")),
				es_field2 : (dj.byId("beneficiary_account")) ? dj.byId("beneficiary_account").get("value") : ""
			};
			return reAuthParams;
		},
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
			
			dj.byId("sub_product_code").set("value", "TTPT");		
			//Bind all recurring payment details fields
			m.bindRecurringFields();
			
			//Populating Reporting status
			m.connect("prod_stat_code", "onChange", m.populateReportingStatus);
			
			m.connect("prod_stat_code", "onChange", function(){
				if(dj.byId("mode") && dj.byId("mode").get("value") !== 'RELEASE'){
					var value = this.get("value");
					m.toggleFields(value && value !== "01" && value !== "18", null,
							["bo_ref_id"]);
				}
			});
			m.connect("ft_cur_code", "onChange", function() {
				m.setCurrency(this, ["ft_amt"]);
			});
			
			m.setValidation("ft_cur_code", m.validateCurrency);
			
			m.connect("beneficiary_account", "onChange", _validateBeneficiaryAccount);
			
			m.connect("beneficiary_act_cur_code", "onChange", function() {	
				dj.byId("ft_cur_code").set("value",dj.byId("beneficiary_act_cur_code").get("value"));	
			});
			m.setValidation("beneficiary_act_cur_code", m.validateCurrency);
			
			m.connect("license_lookup","onClick", function(){
				m.getLicenses("ft");
			});
			
			m.connect("entity", "onChange", function() {				
				m.setApplicantReference();
				dj.byId("applicant_act_name").set("value", "");
			});
			
			//do not store beneficiary id if not PAB
			m.connect("pre_approved_status","onChange",function() {
				if (dj.byId("pre_approved_status").get("value") === "N" )
				{
					if(dj.byId("bank_img"))
					{
						dj.byId("bank_img").set("disabled", false);
					}
					if(dj.byId("bank_iso_img"))
					{
						dj.byId("bank_iso_img").set("disabled", false);
					}
					if(dj.byId("currency"))
					{
						dj.byId("currency").set("disabled", false);
					}
				}
				var subProdField = dj.byId("sub_product_code");
			});
			
			m.connect("recurring_flag", "onClick", m.showRecurring);
			
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
			
			m.populateGridOnLoad("ft");

			m.initForm();

			m.setApplicantReference();	
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
				if(dj.byId("bulk_ref_id").get("value") !== "" && dj.byId("ft_cur_code").get("value") !== ""&& !isNaN(dj.byId("ft_amt").get("value")))
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
			// TODO remove from here, use the one in the product
			dj.byId("sub_product_code").set("value", "TTPT");

			//in case of draft/unsigned, if the beneficiary is pre-approved, display PAB label
			if(dj.byId("pre_approved_status") && dj.byId("pre_approved_status").get("value") === "Y")
			{
				d.style("PAB","display","inline");
				beneficiary.toggleReadonly(true);	
				if(dj.byId("bank_img"))
				{
					dj.byId("bank_img").set("disabled",true);
				}
				if(dj.byId("bank_iso_img"))
				{
					dj.byId("bank_iso_img").set("disabled",true);
				}
				if(dj.byId("currency"))
				{
					dj.byId("currency").set("disabled",true);
				}
			}

			d.forEach(d.query(".CUR"),function(node, i)
			{
				d.style(node,"display","inline");
			});
			
			dj.byId("beneficiary_mode").set("value","02");

			m.toggleRequired("beneficiary_act_cur_code", true);
			
			if(dj.byId("bank_img"))
			{
				dj.byId("bank_img").set("disabled", true);
			}

	     }
	     
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.bank.report_ft_ttpt_client');