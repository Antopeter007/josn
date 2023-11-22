/*
 * ---------------------------------------------------------- 
 * Event Binding for Remittance
 * 
 * Copyright (c) 2000-2011 Misys (http://www.misys.com), All Rights Reserved.
 * 
 * version: 1.0 date: 07/03/11
 * 
 * ----------------------------------------------------------
 */
dojo.provide("misys.binding.bank.report_remittance");

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
dojo.require("misys.form.BusinessDateTextBox");
dojo.require("misys.binding.cash.ft_common");
dojo.require("misys.binding.core.beneficiary_advice_common");


(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {
	
	"use strict"; // ECMA5 Strict Mode
	
	function _okButtonHandler()
	{
		if (dj.byId('applicant_act_name').get("value") !== '' && dj.byId('applicant_act_product_types').get("value") !== '')
		{
			m.toggleSections();
		}
	}

	var m_supportedBeneficiaryClearingCode = new Array();
	function _populateSupportedClearing()
	{
		var country, currency;
		if(dj.byId("cpty_bank_country"))
		{
			country = dj.byId("cpty_bank_country").get("value");	
		}
		if(dj.byId("ft_cur_code"))
		{
			currency = dj.byId("ft_cur_code").get("value");					
		}
		else if(dj.byId("ft_cur_code_unsigned"))
		{
			currency = dj.byId("ft_cur_code_unsigned").get("value");
		}
		var counCurr = country + currency;
	    var counWildCcy = country + "**";
	    var wildCounCcy = "**" + currency;
	    var counAllCcy = country + "ALL";
	    //var AllCounCcy = "ALL" + currency;
	    var wildCounWildCcy = "**" + "**";
	    var i, prefix;
	    if(m._config.countryCurrencyPair[counCurr] === "Y")
		{
			if(m._config.clearingCodes[counCurr].length >= 1)
			{					
				for(i = 0; i < m._config.clearingCodes[counCurr].length; i++)
				{
					prefix = m._config.clearingCodes[counCurr][i];
					if (m._config.clearingCodesMandatory[prefix] === "Y")
					{
						isMandatoryBeneficiaryClearingCode = true;
					}
					m_supportedBeneficiaryClearingCode.push(prefix);							
				}
			} 				
		}
		if(m._config.countryCurrencyPair[counWildCcy] === "Y")
		{
			if(m._config.clearingCodes[counWildCcy].length >= 1)
			{					
				for(i = 0; i < m._config.clearingCodes[counWildCcy].length; i++)
				{
					prefix = m._config.clearingCodes[counWildCcy][i];
					if (m._config.clearingCodesMandatory[prefix] === "Y")
					{
						isMandatoryBeneficiaryClearingCode = true;
					}
					m_supportedBeneficiaryClearingCode.push(prefix);								
				}
			} 				
		}
		if(m._config.countryCurrencyPair[wildCounCcy] === "Y")
		{
			if(m._config.clearingCodes[wildCounCcy].length >= 1)
			{					
				for(i = 0; i < m._config.clearingCodes[wildCounCcy].length; i++)
				{
					prefix = m._config.clearingCodes[wildCounCcy][i];
					if (m._config.clearingCodesMandatory[prefix] === "Y")
					{
						isMandatoryBeneficiaryClearingCode = true;
					}
					m_supportedBeneficiaryClearingCode.push(prefix);							
				}
			} 				
		}
		if(m._config.countryCurrencyPair[counAllCcy] === "Y")
		{
			if(m._config.clearingCodes[counAllCcy].length >= 1)
			{					
				for(i = 0; i < m._config.clearingCodes[counAllCcy].length; i++)
				{
					prefix = m._config.clearingCodes[counAllCcy][i];
					if (m._config.clearingCodesMandatory[prefix] === "Y")
					{
						isMandatoryBeneficiaryClearingCode = true;
					}
					m_supportedBeneficiaryClearingCode.push(prefix);								
				}
			} 				
		}
		if(m._config.countryCurrencyPair[wildCounWildCcy] === "Y")
		{
			if(m._config.clearingCodes[wildCounWildCcy].length >= 1)
			{					
				for(i = 0; i < m._config.clearingCodes[wildCounWildCcy].length; i++)
				{
					prefix = m._config.clearingCodes[wildCounWildCcy][i];
					if (m._config.clearingCodesMandatory[prefix] === "Y")
					{
						isMandatoryBeneficiaryClearingCode = true;
					}
					m_supportedBeneficiaryClearingCode.push(prefix);								
				}
			} 				
		}
	}

	function _swiftClearOrderingBankDetails(){
		
	    var bankFieldsDisabled	=	true;
	    if(dj.byId("ordering_customer_swift_bic_code").get("value").length ===0)
    	{
	    	bankFieldsDisabled=false;
    	}
		dj.byId("ordering_customer_swift_bic_code").set("disabled", false);	
		dj.byId("ordering_customer_bank_name").set("disabled", bankFieldsDisabled);
		dj.byId("ordering_customer_bank_name").set("value", "");
		dj.byId("ordering_customer_bank_address_line_1").set("disabled", bankFieldsDisabled);
		dj.byId("ordering_customer_bank_address_line_1").set("value", "");
		dj.byId("ordering_customer_bank_address_line_2").set("disabled", bankFieldsDisabled);
		dj.byId("ordering_customer_bank_address_line_2").set("value", "");
		dj.byId("ordering_customer_bank_dom").set("disabled", bankFieldsDisabled);
		dj.byId("ordering_customer_bank_dom").set("value", "");
		dj.byId("ordering_customer_bank_country").set("disabled", bankFieldsDisabled);
		dj.byId("ordering_customer_bank_country").set("value", "");
		dj.byId("ordering_customer_iso_img").set("disabled", false);
		dj.byId("ordering_customer_bank_country_img").set("disabled", bankFieldsDisabled);
		
	}
	
	function _swiftClearIntermediaryBankDetails(){
		
	    var bankFieldsDisabled	=	true;
	    if(dj.byId("intermediary_bank_swift_bic_code").get("value").length ===0)
    	{
	    	bankFieldsDisabled=false;
    	}
		dj.byId("intermediary_bank_swift_bic_code").set("disabled", false);	
		dj.byId("intermediary_bank_name").set("disabled", bankFieldsDisabled);
		dj.byId("intermediary_bank_address_line_1").set("disabled", bankFieldsDisabled);
		dj.byId("intermediary_bank_address_line_2").set("disabled", bankFieldsDisabled);
		dj.byId("intermediary_bank_dom").set("disabled", bankFieldsDisabled);
		dj.byId("intermediary_bank_country").set("disabled", bankFieldsDisabled);
		dj.byId("inter_bank_iso_img").set("disabled", false);
		dj.byId("intermediary_bank_country_img").set("disabled", bankFieldsDisabled);
		
	}
	
	function _swiftClearBeneficiaryAddressFields(){
		
	    var bankFieldsDisabled	=	true;
		if(dj.byId("cpty_bank_swift_bic_code").get("value").length ===0)
    	{
	    	bankFieldsDisabled=false;	    	
    	}
		dj.byId("cpty_bank_swift_bic_code").set("disabled", !bankFieldsDisabled);
		m.toggleRequired("cpty_bank_swift_bic_code", bankFieldsDisabled);
		if(dj.byId("cpty_bank_name")){
			dj.byId("cpty_bank_name").set("readOnly", bankFieldsDisabled);
		}
		m.toggleRequired("cpty_bank_name", !bankFieldsDisabled);
		if(dj.byId("cpty_bank_address_line_1")){
			dj.byId("cpty_bank_address_line_1").set("readOnly", bankFieldsDisabled);
		}
		m.toggleRequired("cpty_bank_address_line_1", !bankFieldsDisabled);		
		if(dj.byId("cpty_bank_address_line_2")){
			dj.byId("cpty_bank_address_line_2").set("readOnly", bankFieldsDisabled);
		}
		if(dj.byId("cpty_bank_dom")){
			dj.byId("cpty_bank_dom").set("readOnly", bankFieldsDisabled);
		}
		if(dj.byId("cpty_bank_country")){
			dj.byId("cpty_bank_country").set("readOnly", bankFieldsDisabled);
		}
		m.toggleRequired("cpty_bank_country", !bankFieldsDisabled);
		if(dj.byId("bank_iso_img")){
			dj.byId("bank_iso_img").set("disabled", !bankFieldsDisabled);
		}
	}
	
	function _swiftClearOrderingAddressFields(){
		
	    var bankFieldsDisabled	=	true;
	    if(dj.byId("ordering_bank_swift_bic_code").get("value").length ===0)
    	{
	    	bankFieldsDisabled=false;
    	}
		dj.byId("ordering_bank_swift_bic_code").set("readOnly", true);	
		dj.byId("ordering_institution_name").set("disabled", bankFieldsDisabled);
		dj.byId("ordering_institution_name").set("value", "");
		dj.byId("ordering_institution_address_line_1").set("disabled", bankFieldsDisabled);
		dj.byId("ordering_institution_address_line_1").set("value", "");
		dj.byId("ordering_institution_address_line_2").set("disabled", bankFieldsDisabled);
		dj.byId("ordering_institution_address_line_2").set("value", "");
		dj.byId("ordering_institution_dom").set("disabled", bankFieldsDisabled);
		dj.byId("ordering_institution_dom").set("value", "");
		dj.byId("ordering_institution_country").set("disabled", bankFieldsDisabled);
		dj.byId("ordering_institution_country").set("value", "");
		dj.byId("bank_iso_img").set("disabled", false);
		dj.byId("ordering_institution_country_img").set("disabled", bankFieldsDisabled);	
		m.toggleRequired("ordering_bank_swift_bic_code", false);
		m.toggleRequired("ordering_institution_name", false);	
		m.toggleRequired("ordering_institution_address_line_1", false);	
		m.toggleRequired("ordering_institution_address_line_2", false);	
		m.toggleRequired("ordering_institution_dom", false);	
		m.toggleRequired("ordering_institution_country", false);		
	}
	
	var isMandatoryBeneficiaryClearingCode = false;
	function _populateBeneficiaryClearingCodes() {
		
		var clearingCodeSelectWidget;
		dj.byId("beneficiary_bank_clearing_code_desc").reset();
		clearingCodeSelectWidget = dj.byId('beneficiary_bank_clearing_code_desc');	
		var counCurr, clearingCodesPair, i, j, prefix;
		var clearingCodesCollection = [];
		for(i = 0; i < m._config.countryCcy.length; i++)
		{
			counCurr = m._config.countryCcy[i];
			if(m._config.countryCurrencyPair[counCurr] === "Y")
			{
				if(m._config.clearingCodes[counCurr].length >= 1)
				{					
					for(j= 0; j < m._config.clearingCodes[counCurr].length; j++)
					{
						prefix = m._config.clearingCodes[counCurr][j];
						clearingCodesPair = {"name": m._config.clearingCodesDescription[counCurr][j], "value": prefix};
						clearingCodesCollection.push(clearingCodesPair);							
					}
				} 				
			}
		}
		clearingCodeSelectWidget.store =  new dojo.data.ItemFileReadStore({	data: {	identifier: "value",label: "name",items: clearingCodesCollection}});
		if (dj.byId("beneficiary_bank_clearing_code_desc_no_send").get("value") !== "")
		{
			clearingCodeSelectWidget.set("value", dj.byId("beneficiary_bank_clearing_code_desc_no_send").get("value"));
			dj.byId("beneficiary_bank_clearing_code_desc_no_send").set("value", "");
		}
	}
	
	function _populateIntermediaryClearingCodes() {
		
		var clearingCodeSelectWidget;
		clearingCodeSelectWidget = dj.byId('intermediary_bank_clearing_code_desc');	
		if(dj.byId("intermediary_bank_clearing_code_desc")){
			dj.byId("intermediary_bank_clearing_code_desc").reset();	
		}
		var counCurr, clearingCodesPair, prefix, i, j;
		var clearingCodesCollection = [];
		if(dj.byId('intermediary_bank_clearing_code_desc'))					
		{
			for(i = 0; i < m._config.countryCcy.length; i++)
			{
				counCurr = m._config.countryCcy[i];
				if(m._config.countryCurrencyPair[counCurr] === "Y")
				{
					if(m._config.clearingCodes[counCurr].length >= 1)
					{					
						for(j= 0; j < m._config.clearingCodes[counCurr].length; j++)
						{
							prefix = m._config.clearingCodes[counCurr][j];
							clearingCodesPair = {"name": m._config.clearingCodesDescription[counCurr][j], "value": prefix};
							clearingCodesCollection.push(clearingCodesPair);							
						}
					} 				
				}
			}
			clearingCodeSelectWidget.store =  new dojo.data.ItemFileReadStore({	data: {	identifier: "value",label: "name",items: clearingCodesCollection}});
			if (dj.byId("intermediary_bank_clearing_code_desc_no_send").get("value") !== "")
			{
				clearingCodeSelectWidget.set("value", dj.byId("intermediary_bank_clearing_code_desc_no_send").get("value"));
				dj.byId("intermediary_bank_clearing_code_desc_no_send").set("value", "");
			}
		}
	}
	
	function _setDebitChargeAccount()
	{
		if (dj.byId("charge_act_name") && dj.byId("debit_account_for_charges"))
		{
			dj.byId("debit_account_for_charges").set("value", dj.byId("charge_act_name").get("value"));
		}
	}

	d.mixin(m, {
		
		bind : function()
		{
			// tolerance binding for validation
			m.setValidation("fx_tolerance_rate", m.validateToleranceAndExchangeRate);
			m.setValidation("fx_exchange_rate", m.validateToleranceAndExchangeRate);
			m.connect('charge_act_name',"onChange", _setDebitChargeAccount);
			//Bind all recurring payment details fields
			m.bindRecurringFields();
			
			//Populating Reporting status
			m.connect("prod_stat_code", "onChange", m.populateReportingStatus);
			
			m.connect("entity", "onChange", function(){				
				dj.byId("display_entity").set("value", dj.byId("entity").get("value"));	
				m.setApplicantReference();
			}); 
			
			m.connect("beneficiary_name", "onBlur", function(){				
				dj.byId("counterparty_details_name_1").set("value", dj.byId("beneficiary_name").get("value"));				
			});
			
			m.connect("applicant_act_name", "onChange", function(){				
				d.query('#display_account_row div')[0].innerHTML = dj.byId("applicant_act_name").get("value");				
			});
			
			m.connect("button_intrmdt_ok", "onClick", _okButtonHandler);
			
			m.setValidation("iss_date", m.validateCashProcessingDate);
			m.setValidation("request_date", m.validateCashRequestDate);
			
			m.setValidation("cpty_bank_country", m.validateCountry);
			
			m.setValidation("intermediary_bank_country", m.validateCountry);
			
			m.setValidation("ordering_institution_country", m.validateCountry);
			
			m.setValidation("ordering_customer_bank_country", m.validateCountry);
			
			m.connect("branch_address_flag", "onClick", function(){
				if(this.get("checked")){
					m.animate("wipeIn", d.byId('bankBranchContent'));
				} else {
					dj.byId("beneficiary_bank_branch_address_line_1").set("value", "");
					dj.byId("beneficiary_bank_branch_address_line_2").set("value", "");				
					dj.byId("beneficiary_bank_branch_dom").set("value", "");
					dj.byId("beneficiary_bank_branch_address_line_1").set("required", false);
					dj.byId("beneficiary_bank_branch_address_line_2").set("required", false);	
					dj.byId("beneficiary_bank_branch_dom").set("required", false);
					
					m.animate("wipeOut", d.byId('bankBranchContent'));
				}
			});		
			
			m.connect("ordering_customer_swift_bic_code", "onChange", function(){	
				var bicvalue = this.get("value");
				m.toggleFields((bicvalue != ""),null,["ordering_customer_bank_account"]);
				dj.byId("ordering_customer_bank_account").set("disabled", false);
			});

			m.connect("ordering_institution_swift_bic_code", "onChange", function(){	
				var bicvalue = this.get("value");
				m.toggleFields((bicvalue != ""),null,["ordering_institution_account"]);
				dj.byId("ordering_institution_account").set("disabled", false);
			});
			
			m.connect("processing_date", "onChange", function(){	
				var dateValue = this.get("value");
				if(dj.byId("request_date")) {		
					dj.byId("request_date").set("value", dateValue);
				}
			});
			
			m.connect("beneficiary_bank_clearing_code", "onChange", function(){
				var val = this.get("value");
				dj.byId("beneficiary_bank_clearing_code_desc").set("value" , "");
				if (val !== "" && val.length > 0)
				{
					dj.byId("beneficiary_bank_clearing_code_desc").set("value" , val.substring(0, 2)); // Populate corresponding value to clearing code description
					if (dj.byId("beneficiary_bank_clearing_code_desc").get("value") === "")
					{
						this.set("value" , "");
						this.focus();
						this.set("state", "Error");
			  			dj.hideTooltip(this.domNode);
						dj.showTooltip(m.getLocalization("CCValidationUnmatchedPrefixError"), this.domNode, 0);
						return false;
					}
				}
			});
			
			m.connect("intermediary_bank_clearing_code", "onChange", function(){	
				var val = this.get("value");
				dj.byId("intermediary_bank_clearing_code_desc").set("value" , "");
				if (val !== "")
				{
					dj.byId("intermediary_bank_clearing_code_desc").set("value" , val.substring(0, 2)); // Populate corresponding value to clearing code description
					if (dj.byId("intermediary_bank_clearing_code_desc").get("value") === "")
					{
						this.set("value" , "");
						this.focus();
						this.set("state", "Error");
			  			dj.hideTooltip(this.domNode);
						dj.showTooltip(m.getLocalization("CCValidationUnmatchedPrefixError"), this.domNode, 0);
						return false;
					}
				}
				
			});
			m.connect("beneficiary_bank_clearing_code_desc", "onChange", function(){
				var clearindCodeDesc = this.get("value");
				var clearingCodeField = dj.byId("beneficiary_bank_clearing_code");
				if (clearingCodeField)
				{
					var clearingCode = clearingCodeField.get("value");
					if (clearingCode !== "" && clearingCode.substring(0, 2) != clearindCodeDesc)
					{
						clearingCodeField.focus();
						clearingCodeField.set("state", "Error");
			  			dj.hideTooltip(clearingCodeField.domNode);
						dj.showTooltip(m.getLocalization("CCValidationUnmatchedPrefixError"), clearingCodeField.domNode, 0);
						return false;
					}
				}
			});

			m.connect("intermediary_bank_clearing_code_desc", "onChange", function(){
				var clearindCodeDesc = this.get("value");
				var clearingCodeField = dj.byId("intermediary_bank_clearing_code");
				if (clearingCodeField)
				{
					var clearingCode = clearingCodeField.get("value");
					if (clearingCode !== "" && clearingCode.substring(0, 2) != clearindCodeDesc)
					{
						clearingCodeField.focus();
						clearingCodeField.set("state", "Error");
			  			dj.hideTooltip(clearingCodeField.domNode);
						dj.showTooltip(m.getLocalization("CCValidationUnmatchedPrefixError"), clearingCodeField.domNode, 0);
						return false;
					}
				}
			});

			if(dj.byId('fx_rates_type_temp') && dj.byId('fx_rates_type_temp').get('value') !== ''){
				var maxNbrContracts =0;
				if(dj.byId('fx_nbr_contracts') && dj.byId('fx_nbr_contracts').get('value') > 0){
					maxNbrContracts = dj.byId('fx_nbr_contracts').get('value');
					m.bindTheFXTypes(maxNbrContracts, 'Y');
				}
				
			}
		},
		
		showbeneficiary_bankClearingCodeFormat: function() {
			var clearingCodeDesc = dj.byId("beneficiary_bank_clearing_code_desc").get("value");
			if(clearingCodeDesc !== "")
			{
				var format = m._config.clearingCodesFormat[clearingCodeDesc];
				var regularExpression = m._config.clearingCodesRegExp[clearingCodeDesc];
				if(format !== "") {			
					m.dialog.show('ALERT', m.getLocalization('clearingCodeFormatMessage', [format, regularExpression]));
				}
			}
		},
		
		showintermediary_bankClearingCodeFormat: function() {
			var clearingCodeDesc = dj.byId("intermediary_bank_clearing_code_desc").get("value");
			if(clearingCodeDesc !== "")
			{
				var format = m._config.clearingCodesFormat[clearingCodeDesc];
				var regularExpression = m._config.clearingCodesRegExp[clearingCodeDesc];
				if(format !== "")
				{			
					m.dialog.show('ALERT', m.getLocalization('clearingCodeFormatMessage', [format, regularExpression]));
				}
			}
		},
		
		showFields : function() {
			var domNode = dj.byId("entity").domNode;
			if(dj.byId("entity").get("value") === ""){
				dj.showTooltip(m.getLocalization('remittanceToolTip'), domNode, 0);
				var hideTT = function() {
					dj.hideTooltip(domNode);
				};
				var timeoutInMs = 1000;
				setTimeout(hideTT, timeoutInMs);
				return false;
			}	
			
			var domNode2 = dj.byId("applicant_act_name").domNode;
			if(dj.byId("applicant_act_name").get("value") === ""){
				dj.showTooltip(m.getLocalization('remittanceToolTip'), domNode2, 0);
				var hideTT2 = function() {
					dj.hideTooltip(domNode2);
				};
				var timeoutInMs2 = 1000;
				setTimeout(hideTT2, timeoutInMs2);
				return false;
			}
			m.animate("wipeOut", d.byId('content1'),_showContent2);
			return true;
		},
				
		onFormLoad : function() {
			
			 m.populateReportingStatus();
			if(dj.byId("beneficiary_bank_clearing_code_desc")){
				_populateBeneficiaryClearingCodes();
			}
			
			_populateIntermediaryClearingCodes();
			
			if(dj.byId("cpty_bank_swift_bic_code"))
		    {
				_swiftClearBeneficiaryAddressFields();
		    }
			
			if(dj.byId("ordering_bank_swift_bic_code")){
			
				_swiftClearOrderingAddressFields();
			}
			
			if(dj.byId("ordering_customer_swift_bic_code")){
				_swiftClearOrderingBankDetails();	
			}
			if(dj.byId("intermediary_bank_swift_bic_code")){			
				_swiftClearIntermediaryBankDetails();
			}
			
			m.setApplicantReference();
			//Show Recurring Payment details section and validate start date
			m.showSavedRecurringDetails(false);
			
			if(dj.byId('fx_rates_type_temp') && dj.byId('fx_rates_type_temp').get('value') !== ''){
				if(dj.byId('fx_nbr_contracts') && dj.byId('fx_nbr_contracts').get('value') > 0){
					m.onloadFXActions();
				}
				
			}
		},
		initForm : function(){

			/**
			if(dj.byId("recurring_flag").get("checked")){
				m.animate("wipeIn", d.byId('recurringContent'));
			} else {
				m.animate("wipeOut", d.byId('recurringContent'));
			}**/
			
			if(dj.byId("branch_address_flag")) {			
				if(dj.byId("branch_address_flag").get("checked")){
					m.animate("wipeIn", d.byId('bankBranchContent'));
				} else {
					dj.byId("beneficiary_bank_branch_address_line_1").set("value", "");
					dj.byId("beneficiary_bank_branch_address_line_2").set("value", "");				
					dj.byId("beneficiary_bank_branch_dom").set("value", "");
					dj.byId("beneficiary_bank_branch_address_line_1").set("required", false);
					dj.byId("beneficiary_bank_branch_address_line_2").set("required", false);	
					dj.byId("beneficiary_bank_branch_dom").set("required", false);
					
					m.animate("wipeOut", d.byId('bankBranchContent'));
				}
			}
		},
		
		beforeSubmitValidations : function() {	
			if(dj.byId("beneficiary_account")) {
					//Clearing code validation
					//To make sure validation does not happen during unsigned mode
					var account = dj.byId("beneficiary_account").get("value"),
						clearingCodeDesc = "",
						clearingCode = "";
					//Clearing code validation
					if(dj.byId("beneficiary_bank_clearing_code_desc"))
					{
						clearingCodeDesc = dj.byId("beneficiary_bank_clearing_code_desc").get("value");
					}
					var clearingCodeField = dj.byId("beneficiary_bank_clearing_code");
					var intermediateBankclearingCodeDescField = dj.byId("intermediary_bank_clearing_code_desc");
					var intermediateBankclearingCodeField = dj.byId("intermediary_bank_clearing_code");
					_populateSupportedClearing();
					var displayMessage;
					if ((clearingCodeDesc === "" && clearingCodeField && clearingCodeField.get("value") !== "") || (clearingCodeDesc !== "" && clearingCodeField && clearingCodeField.get("value") === ""))
					{
						displayMessage = m.getLocalization("CCValidationInvalidClearingCodeDescriptionError", [clearingCode, clearingCodeDesc]);
			  			m._config.onSubmitErrorMsg = displayMessage;
			  			clearingCodeField.focus();
			  			clearingCodeField .set("state", "Error");
			  			return false;
					}
					else if ((intermediateBankclearingCodeDescField && intermediateBankclearingCodeDescField.get("value") === "" && intermediateBankclearingCodeField && intermediateBankclearingCodeField.get("value") !== "") || (intermediateBankclearingCodeDescField && intermediateBankclearingCodeDescField.get("value") !== "" && intermediateBankclearingCodeField && intermediateBankclearingCodeField.get("value") === ""))
					{
						displayMessage = m.getLocalization("CCValidationInvalidClearingCodeDescriptionError", [clearingCode, clearingCodeDesc]);
			  			m._config.onSubmitErrorMsg = displayMessage;
			  			intermediateBankclearingCodeField.focus();
			  			intermediateBankclearingCodeField.set("state", "Error");
			  			return false;
					}
					if(clearingCodeDesc !== "")
					{
					    if(dj.byId("beneficiary_bank_clearing_code"))
						{
							clearingCode = dj.byId("beneficiary_bank_clearing_code").get("value");
						}
					    if (m_supportedBeneficiaryClearingCode && m_supportedBeneficiaryClearingCode.indexOf(clearingCodeDesc) < 0)
				    	{
				    		displayMessage = m.getLocalization("beneAccountCCValidationUnsupportedClearingCodeError");
				  			m._config.onSubmitErrorMsg = displayMessage;
				  			clearingCodeField.focus();
				  			clearingCodeField .set("state", "Error");
				  			return false;
				    	}
				    	// Special case: United Kingdom/GBP/SC -- 
				    	//Mandatory clearing code validation if account number is not IBAN
					  	var check = "N";
					  	if(clearingCodeDesc === "SC") {
					  		if(!m.isIBAN(account)) {
								check = "Y";
							}
					  	}
					  	var regExpInput = m._config.clearingCodesRegExp[clearingCodeDesc];
					  	var regExp;
					  	var clearingCodeDescFieldValue;
					  	if(check === "Y") {
					  		if (clearingCodeDesc !== clearingCode.substring(0, clearingCodeDesc.length))
					  		{
					  			displayMessage = m.getLocalization("beneAccountCCValidationPrefixStartsWithError", [clearingCode, clearingCodeDesc]);
					  			m._config.onSubmitErrorMsg = displayMessage;
					  			clearingCodeField.focus();
					  			clearingCodeField .set("state", "Error");
					  			return false;
					  		}
					  		clearingCode = clearingCode.substring(clearingCodeDesc.length, clearingCode.length);
					  		try
						  	{
						  		regExp = new RegExp(regExpInput);
						  	}
						  	catch (error)
						  	{
						  		clearingCodeDescFieldValue = dj.byId("beneficiary_bank_clearing_code_desc").store._itemsByIdentity[clearingCodeDesc].name;
						  		displayMessage = m.getLocalization("invalidRegularExpressionError", [clearingCodeDescFieldValue]);
					  			m._config.onSubmitErrorMsg = displayMessage;
						  		return false;
						  	}
					  		if (!regExp.test(clearingCode))
					  		{
					  			displayMessage = m.getLocalization("beneAccountCCValidationError");
					  			m._config.onSubmitErrorMsg = displayMessage;
					  			clearingCodeField.focus();
					  			clearingCodeField .set("state", "Error");
					  			return false;
					  		} 
					  	}
					  	if(m._config.clearingCodesMandatory[clearingCodeDesc] === "Y")
						{
							if (clearingCode + "S" === "S")
							{
								displayMessage = m.getLocalization("beneAccountCCValidationMandatoryError");
					  			m._config.onSubmitErrorMsg =  displayMessage;
					  			clearingCodeField.focus();
					  			clearingCodeField .set("state", "Error");
								return false;
							}
							if (clearingCodeDesc !== clearingCode.substring(0, clearingCodeDesc.length))
					  		{
					  			displayMessage = m.getLocalization("beneAccountCCValidationPrefixStartsWithError", [clearingCode, clearingCodeDesc]);
					  			m._config.onSubmitErrorMsg = displayMessage;
					  			clearingCodeField.focus();
					  			clearingCodeField .set("state", "Error");
					  			return false;
					  		}
							clearingCode = clearingCode.substring(clearingCodeDesc.length, clearingCode.length);
							try
						  	{
						  		regExp = new RegExp(regExpInput);
						  	}
						  	catch (error)
						  	{
						  		clearingCodeDescFieldValue = dj.byId("beneficiary_bank_clearing_code_desc").store._itemsByIdentity[clearingCodeDesc].name;
						  		displayMessage = m.getLocalization("invalidRegularExpressionError", [clearingCodeDescFieldValue]);
					  			m._config.onSubmitErrorMsg = displayMessage;
						  		return false;
						  	}
							if (!regExp.test(clearingCode))
							{
								displayMessage = m.getLocalization("beneAccountCCValidationError");
					  			m._config.onSubmitErrorMsg =  displayMessage;
					  			clearingCodeField.focus();
					  			clearingCodeField .set("state", "Error");
								return false;
							}
						 }
						 else if(m._config.clearingCodesMandatory[clearingCodeDesc] === "N")
						 {
							if ((clearingCode + "S" !== "S"))
							{
								if (clearingCodeDesc !== clearingCode.substring(0, clearingCodeDesc.length))
						  		{
						  			displayMessage = m.getLocalization("beneAccountCCValidationPrefixStartsWithError", [clearingCode, clearingCodeDesc]);
						  			m._config.onSubmitErrorMsg = displayMessage;
						  			clearingCodeField.focus();
						  			clearingCodeField .set("state", "Error");
						  			return false;
						  		}
								clearingCode = clearingCode.substring(clearingCodeDesc.length, clearingCode.length);
								try
							  	{
							  		regExp = new RegExp(regExpInput);
							  	}
							  	catch (error)
							  	{
							  		clearingCodeDescFieldValue = dj.byId("beneficiary_bank_clearing_code_desc").store._itemsByIdentity[clearingCodeDesc].name;
							  		displayMessage = m.getLocalization("invalidRegularExpressionError", [clearingCodeDescFieldValue]);
						  			m._config.onSubmitErrorMsg = displayMessage;
							  		return false;
							  	}
								if (!regExp.test(clearingCode))
								{
									displayMessage = m.getLocalization("beneAccountCCValidationError");
						  			m._config.onSubmitErrorMsg =  displayMessage;
						  			clearingCodeField.focus();
						  			clearingCodeField .set("state", "Error");
									return false;
								}
							}
						 }
						 else if (clearingCode + "S" !== "S" || clearingCodeDesc + "S" !== "S") 
						 {
							displayMessage = m.getLocalization("beneAccountCCValidationNoRequiredError");
				  			m._config.onSubmitErrorMsg =  displayMessage;
				  			clearingCodeField.focus();
				  			clearingCodeField .set("state", "Error");
							return false;
						 }
					  	 
				  }
				  else if (isMandatoryBeneficiaryClearingCode)
				  {
				    	displayMessage = m.getLocalization("beneAccountCCValidationMandatoryError");
				    	m._config.onSubmitErrorMsg = displayMessage;
				    	clearingCodeField.focus();
			  			clearingCodeField .set("state", "Error");
				    	return false;
				  }
				  if(dj.byId("sub_product_code").get("value") === "FI103" || dj.byId("sub_product_code").get("value") === "MT103")
			  	  {
				     if(dj.byId("charge_act_cur_code") && dj.byId("base_cur_code") && dj.byId("ft_cur_code") && ("S" + dj.byId("charge_act_cur_code").get("value")) !== "S" && (dj.byId("charge_act_cur_code").get("value") !== dj.byId("base_cur_code").get("value") &&
							dj.byId("charge_act_cur_code").get("value") !== dj.byId("ft_cur_code").get("value")))
					 {
					 	  m._config.onSubmitErrorMsg =  m.getLocalization("invalidDebitChargeAccount", [ dj.byId("charge_act_name").get("value") ]);
					 	  return false;
					 }
				  }
				  //IBAN validation
				if(dj.byId("cpty_bank_country")){
				
					var country = dj.byId("cpty_bank_country").get("value");
				}
				if(dj.byId("ft_cur_code"))
				{
				var currency = dj.byId("ft_cur_code").get("value");	
				}		
				if(country !== "" && currency !== "")					
				{	
					var counCurr = country + currency;
					var counAllCurr = country + "ALL";
					if(m._config.ibanMandatory[counCurr] === "Y" || 
							m._config.ibanMandatory[counAllCurr] === "Y") {			
						if(!m.isIBAN(account)) {
							m._config.onSubmitErrorMsg =  m.getLocalization("invalidIBANAccNoError", [ account ]);
							return false;
						}
					}
				}	
			}
			return true;
		}
		
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.bank.report_remittance_client');