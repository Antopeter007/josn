/*
 * ---------------------------------------------------------- 

 * Event Binding for Remittance
 * 
 * Copyright (c) 2000-2012 Misys (http://www.misys.com), All Rights Reserved.
 * 
 * version: 1.0 date: 07/03/11
 * 
 * author: Lithwin
 * ----------------------------------------------------------
 */
dojo.provide("misys.binding.cash.create_remittance");
dojo.require("dojo.parser");
dojo.require("dijit.layout.TabContainer");
dojo.require("dijit.form.DateTextBox");
dojo.require("misys.form.CurrencyTextBox");
dojo.require("dijit.form.NumberTextBox");
dojo.require("dijit.form.FilteringSelect");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.Dialog");
dojo.require("dijit.ProgressBar");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.CheckBox");
dojo.require("misys.form.PercentNumberTextBox");
dojo.require("misys.form.SimpleTextarea");
dojo.require("misys.widget.Collaboration");
dojo.require("misys.form.common");
dojo.require("misys.form.file");
dojo.require("misys.validation.common");
dojo.require("misys.binding.cash.ft_common");
dojo.require("misys.form.BusinessDateTextBox");
dojo.require("misys.binding.core.beneficiary_advice_common");
dojo.require("misys.validation.common");
dojo.require("misys.binding.common.create_fx_multibank");
dojo.require("misys.binding.cash.paymentFees");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {
	
	"use strict"; // ECMA5 Strict Mode	
	var fxMsgType = d.byId("fx-message-type");
	var hasCustomerBankValue = false;
	var validationFailedOrDraftMode = false;
	var formLoading = true;
	var hasIntermediaryBankDetails=false;
	var fxSection = "fx-section";
	var processingDate = "Processing Date";
	var styeConst = "<style='width:800px;height:1000px;overflow:auto;'>";
	var spanConst = "<b><span class='legend'>";
	var spanConstEnd = "</span></b>";
	var mt103_intermediary_fields = ["intermediary_bank_swift_bic_code","intermediary_bank_name","intermediary_bank_address_line_1","intermediary_bank_address_line_2","intermediary_bank_dom","intermediary_bank_country"];
	var orderinginstitutionswiftbiccode = {}, orderingswiftbiccode = {}, beneficiaryswiftbiccode = {};
	orderinginstitutionswiftbiccode.fields = [ "ordering_institution_swift_bic_code",
	    "ordering_institution_name",
	    "ordering_institution_address_line_1", 
	    "ordering_institution_address_line_2",
	    "ordering_institution_dom",
	     "ordering_institution_country",
	     "ordering_institution_account"];
	orderinginstitutionswiftbiccode.clear = function() {
	d.forEach(this.fields, function(node, i) {
	if (dj.byId(node)) {
	dj.byId(node).set("value", '');
	}
	});
	};
	
	orderingswiftbiccode.fields = [ "ordering_customer_bank_swift_bic_code",
	    "ordering_customer_bank_name",
	    "ordering_customer_bank_address_line_1", 
	    "ordering_customer_bank_address_line_2",
	    "ordering_customer_bank_dom",
	     "ordering_customer_bank_country",
	     "ordering_customer_bank_account"];
	orderingswiftbiccode.clear = function() {
	d.forEach(this.fields, function(node, i) {
	if (dj.byId(node)) {
	dj.byId(node).set("value", '');
	}
	});
	};
	
	beneficiaryswiftbiccode.fields = [ "beneficiary_swift_bic_code",
	    "beneficiary_name",
	    "beneficiary_address", 
	    "beneficiary_city",
	    "beneficiary_dom",
	     "beneficiary_account"];
	beneficiaryswiftbiccode.clear = function() {
	d.forEach(this.fields, function(node, i) {
	if (dj.byId(node)) {
	dj.byId(node).set("value", '');
	}
	});
	};

	function _paymentGeneralDetailsPopUpBlock()
	{
		var generalDetails = "";
		generalDetails = generalDetails.concat(styeConst);
		generalDetails =  generalDetails.concat(spanConst + m.getLocalization("generalDetails")+spanConstEnd);
		var entityVal = dijit.byId("entity") ? dijit.byId("entity").get("value") : "";
		var entityDetail = m.getLocalization("entityDetails", [entityVal]);
		var debitAct = dijit.byId("applicant_act_name") ? dijit.byId("applicant_act_name").get("value") : "";
		var debitActDetail = m.getLocalization("debitActDetails", [debitAct]);
		generalDetails = generalDetails + entityDetail + debitActDetail;
		return generalDetails;
	}
	function _paymentTransfertoDetailsPopUpBlock()
	{
		var transferToDetails = "";
		transferToDetails = transferToDetails.concat(styeConst);
		transferToDetails =  transferToDetails.concat(spanConst+m.getLocalization("transferToDetails")+spanConstEnd);
		var creditAct = dijit.byId("beneficiary_name") ? dijit.byId("beneficiary_name").get("value") : "";
		var creditActDetail = m.getLocalization("creditActDetails", [creditAct]);
		transferToDetails = transferToDetails + creditActDetail;
		return transferToDetails;
	}
	function _paymentTransactionDetailsPopUpBlock()
	{
		var transactionDetails = "";
		transactionDetails = transactionDetails.concat(styeConst);
		transactionDetails =  transactionDetails.concat(spanConst+m.getLocalization("transactionDetails")+spanConstEnd);
		var ftAmtVal = dijit.byId("ft_amt") ? dijit.byId("ft_amt").get("value") : "";
		var ftCurVal = dijit.byId("ft_cur_code") ? dijit.byId("ft_cur_code").get("value") : "";
		var transferAmtDetail = m.getLocalization("transferAmtDetail", [ftCurVal,ftAmtVal]);
		var transferDateVal = dijit.byId("iss_date") ? dijit.byId("iss_date").get("value") : "";
		var transferDateDetail = m.getLocalization("transferDateDetails", [transferDateVal]);
		transactionDetails = transactionDetails + transferAmtDetail + transferDateDetail;
		return transactionDetails;
	}
	function _paymentFeesDetailsPopUpBlock(hostResponse)
	{
		var amt = hostResponse.totalFeeAmount;
		var ccy = hostResponse.debitAccountCurrency;
		var debitFeeAmount = hostResponse.debitFeeAmount;
		var taxOnDebitFees = hostResponse.taxOnDebitFees;
		var taxOnTaxOnDebitFees = hostResponse.taxOnTaxOnDebitFees;
		var agentFees = hostResponse.agentFees;
		var totalCharges = m.getLocalization("totalCharges", [ccy,amt]);
		var debitFeeAmountCharges = m.getLocalization("debitFeeAmountCharges", [ccy,debitFeeAmount]);
		var taxOnDebitFeesCharges = m.getLocalization("taxOnDebitFeesCharges", [ccy,taxOnDebitFees]);
		var taxOnTaxOnDebitFeesCharges = m.getLocalization("taxOnTaxOnDebitFeesCharges", [ccy,taxOnTaxOnDebitFees]);
		var agentFeesCharges = m.getLocalization("agentFeesCharges", [ccy,agentFees]);
		var feesDetails = "";
		feesDetails = feesDetails.concat(styeConst);
		feesDetails =  feesDetails.concat(spanConst+m.getLocalization("feesDetails")+spanConstEnd);
		feesDetails = feesDetails+totalCharges+debitFeeAmountCharges+taxOnDebitFeesCharges+taxOnTaxOnDebitFeesCharges+agentFeesCharges;
		return feesDetails;
	}
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
		
		if(d.byId(fxSection) && (d.style(d.byId(fxSection),"display") !== "none"))
		{
			m.animate("wipeOut", d.byId(fxSection));
		}
	}
	function _truncateBankName(){
		m.setSwiftBankDetailsForOnBlurEvent(false ,"intermediary_bank_swift_bic_code","", null, null, "intermediary_bank_", true,true,true,"");
		if(dj.byId("intermediary_bank_swift_bic_code").get("value").length !== 0 && dj.byId("pre_approved_status") && dj.byId("pre_approved_status").get("value") === "Y" && hasIntermediaryBankDetails)
    	{
			dj.byId("intermediary_bank_country_img").set("disabled", true);
	    }
		else
		{
			if(dj.byId("intermediary_bank_swift_bic_code").get("value").length !== 0)
				{
			
			dj.byId("intermediary_bank_country_img").set("disabled", true);
		}
			else
				{
				dj.byId("intermediary_bank_country_img").set("disabled", false);

				}
		}
	}
	function _truncateBankNameForCounterparty(){
		
		var cptyBankCountryImg = dj.byId("cpty_bank_country_img");
		
		if(!m._config.isBeneficiaryAccountsPopulated && this.get("value") !== "")
		{
			m.setSwiftBankDetailsForOnBlurEvent(false ,"cpty_bank_swift_bic_code","", null, null, "cpty_bank_", true,false,true,"");
			
		}
		if(!m._config.isBeneficiaryAccountsPopulated && (dijit.byId("pre_approved") && dijit.byId("pre_approved").get("value") != ""))
		{
			_onLoadBranchAddress();
		}
		
		if (dj.byId("beneficiary_bank_swift_bic_code"))
		{
			dj.byId("beneficiary_bank_swift_bic_code").set("value", dj.byId("cpty_bank_swift_bic_code").get("value"));
		}
		
		if(dj.byId("pre_approved_status") && dj.byId("pre_approved_status").get("value") === "Y"){

			var mt101_fields = ["cpty_bank_name","cpty_bank_address_line_1","cpty_bank_address_line_2","cpty_bank_dom"];
			m.toggleFieldsReadOnly(mt101_fields, true);
		}
		else{

			mt101_fields = ["cpty_bank_name","cpty_bank_address_line_1","cpty_bank_address_line_2","cpty_bank_dom"];
			m.toggleFieldsReadOnly(mt101_fields, true);
		}		
		
		if (cptyBankCountryImg)
		{
			if (dj.byId("cpty_bank_swift_bic_code").get("value").length === 0)
			{
				cptyBankCountryImg.set("disabled", false);
			} else
			{
				cptyBankCountryImg.set("disabled", true);
			}
		}
	}
	
	function _truncateOrderingInstitutionDetails(){
		m.setSwiftBankDetailsForOnBlurEvent(false ,"ordering_institution_swift_bic_code","", null, ["ordering_institution_name","ordering_institution_address_line_1","ordering_institution_country","ordering_institution_account"], "ordering_institution_", true,false,true,"");
		if(dj.byId("ordering_institution_swift_bic_code").get("value").length === 0)
	    {
			dj.byId("ordering_institution_country_img").set("disabled", false);
			orderinginstitutionswiftbiccode.clear();

		}
		else
		{
			dj.byId("ordering_institution_country_img").set("disabled", true);
		}
	}
	
	function _truncateBeneficiaryInstitutionDetails(){ 
		m.setSwiftBankDetailsForOnBlurEvent(false ,"","beneficiary_swift_bic_code", ["beneficiary_name",
		     				                                                     "beneficiary_address","beneficiary_city","beneficiary_dom",
		     				                                                     "beneficiary_contact_name","beneficiary_phone","beneficiary_country"], 
		     				                                                     ["beneficiary_name", "beneficiary_address"],
		     				                                                     "beneficiary_", true,false,false,"");
	}
	
	function _truncateOrderingCustomerBankDetails(){
		m.setSwiftBankDetailsForOnBlurEvent(false ,"ordering_customer_bank_swift_bic_code", "",null, ["ordering_customer_bank_name","ordering_customer_bank_address_line_1","ordering_customer_bank_country","ordering_customer_bank_account"], "ordering_customer_bank_", true,false,true);
		if(dj.byId("ordering_customer_bank_swift_bic_code").get("value").length === 0)
	    {
			dj.byId("ordering_customer_bank_country_img").set("disabled", false);
			orderingswiftbiccode.clear();
		}
		else
		{
			dj.byId("ordering_customer_bank_country_img").set("disabled", true);
		}
	}
	
	function _preSubmissionFXValidation(){
		var valid = true;
		var error_message = "";
		var boardRateOption = dj.byId("fx_rates_type_2");
		var totalUtiliseAmt = dj.byId("fx_total_utilise_amt");
		var ftAmt = dj.byId("ft_amt");
		var maxNbrContracts = m._config.fxParamData[dj.byId("sub_product_code").get("value")][dj.byId("issuing_bank_abbv_name").get("value")].maxNbrContracts;
		
		if (boardRateOption.get("checked") && totalUtiliseAmt && !isNaN(totalUtiliseAmt.get("value")) && ftAmt && !isNaN(ftAmt.get("value")))
		{
			if (ftAmt.get("value") < totalUtiliseAmt.get("value"))
			{
				error_message += m.getLocalization("FXUtiliseAmtGreaterMessage");
				valid = false;
			}
		}
		m._config.onSubmitErrorMsg =  error_message;
		
		if(boardRateOption.get("checked") && totalUtiliseAmt  && ftAmt)
		{
			var totalAmt = 0;
			for(var j = 1; j<=maxNbrContracts; j++)
			{
				var contractAmt = "fx_contract_nbr_amt_"+j;
				totalAmt = totalAmt + dj.byId(contractAmt).get("value");
				if(dj.byId(contractAmt).get("state") === 'Error' || totalAmt.toFixed(2) > totalUtiliseAmt.get("value"))
				{
					dj.byId(contractAmt).set("state", "Error");
					dj.byId(contractAmt).focus();
					valid = false;
				}
			}
		}

		return valid;
	}
	
	function _handleFXAction()
	{
		var subProduct = dj.byId("sub_product_code").get("value");			
		if(dj.byId("issuing_bank_abbv_name") && dj.byId("issuing_bank_abbv_name").get("value") !== "" && m._config.fxParamData && m._config.fxParamData[subProduct][dj.byId("issuing_bank_abbv_name").get("value")].isFXEnabled === "Y"){
			//Start FX Actions
			m.connect("ft_cur_code", "onBlur", function(){
				m.setCurrency(this, ["ft_amt"]);
				if(dj.byId("ft_cur_code").get("value") !== "" && !isNaN(dj.byId("ft_amt").get("value"))){
					m.fireFXAction();
				}else{
					m.defaultBindTheFXTypes();
				}
			});
			m.connect("ft_cur_code", "onChange", function(){
				if(dj.byId("iss_date") && dj.byId("iss_date").get("value") !== "")
				{
					dj.byId("iss_date").validate();
				}
				if(dj.byId("recurring_start_date") && dj.byId("recurring_start_date").get("value") !== "")
				{
					dj.byId("recurring_start_date").validate();
				}
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
			if(d.byId(fxSection))
				{
					d.style(fxSection,"display","none");
				}
		}
		
		if(dijit.byId("ft_cur_code") && dijit.byId("ft_amt"))
		{
			misys.setCurrency(dijit.byId("ft_cur_code"), ["ft_amt"]);
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
	
	function _matchBicCodes()
	{
		var intermediaryBankCountryImg = dj.byId("intermediary_bank_country_img");
		var intermediary_swift_code_field	=	dj.byId("intermediary_bank_swift_bic_code");
		var valid = true;
		if(dj.byId("intermediary_bank_swift_bic_code").get("value") !== "" && dj.byId("cpty_bank_swift_bic_code").get("value") !== "" &&  (dj.byId("intermediary_bank_swift_bic_code").get("value") === dj.byId("cpty_bank_swift_bic_code").get("value"))) {
			var displayMessageInter  = 	"";
			displayMessageInter = misys.getLocalization("invalidIntermeditaryCode");
	  		intermediary_swift_code_field.set("state","Error");
			dj.hideTooltip(intermediary_swift_code_field.domNode);
			dj.showTooltip(displayMessageInter, intermediary_swift_code_field.domNode, 0);
			intermediaryBankCountryImg.set("disabled", false);
			valid = false;
		}
		return valid;
	}
	function _validateRegexBeneficiary()
	{				
		   		      
		   var regex = dj.byId("regexValue");
		   var products = dj.byId("allowedProducts");
		   var productType = dj.byId("product_type");		   		   
		   var regexStr =  regex ? dj.byId("regexValue").get("value") : '';
		   var productsStr = products ? dj.byId("allowedProducts").get("value") : '';		   
		   var productTypeStr = productType ? dj.byId("product_type").get("value") : '';
		   		   
		   var beneficiaryId = dj.byId("beneficiary_name");
		   var beneficiaryStr = beneficiaryId? dj.byId("beneficiary_name").get("value") : ''; 
		   		 	   		  			   
		   var beneficiaryRegExp = new RegExp(regexStr);
		   
		   var isValid = false;
		   		  		   		 		   
		   if (  productsStr.indexOf(productTypeStr) < 0  )   
		   {			   
			   if(regexStr !== null && regexStr !== '' && beneficiaryStr !== '' && beneficiaryStr !== null)
			   {			   			   
				   isValid = beneficiaryRegExp.test(beneficiaryStr);				   
				   if(!isValid)
				   {
					   /*var errorMessage =  m.getLocalization("invalidBeneficiaryName");
					   beneficiaryId.set("state","Error");
					   dj.hideTooltip(beneficiaryId.domNode);
					   dj.showTooltip(errorMessage, beneficiaryId.domNode, 0);*/
					   this.invalidMessage = m.getLocalization("invalidBeneficiaryName");
					   return false;
				   }				   
			   }
			}
		   else
		   {
			   m._config.forceSWIFTValidation = false;   
		   }
		   return true;				
		    
	}
	
	function populateDebitAccountDetails(){
		m.xhrPost(
				{
					url 		: misys.getServletURL("/screen/AjaxScreen/action/GetUserAccountList") ,
					handleAs : "json",
					sync : true,
					content :
					{
						context_value : "FT:MEPS",
						entity        : dj.byId("entity") ? dj.byId("entity").get("value") : ""
						
					},
					load : function(response, args)
					{
						if (response.items.valid === true)
						{	
							dj.byId("applicant_act_cur_code").set("value", response.items.currency);
							dj.byId("applicant_act_pab").set("value", response.items.PAB);
							dj.byId("applicant_act_no").set("value", response.items.accountNo);
							dj.byId("applicant_act_name").set("value", response.items.accountName);
							_applicantAccountPABHandler();
							
						} 
					},
					error : function(response, args)
					{
						console.error("[Could not fetch userAccounts] " );
						console.error(response);
					}
				});
	}
	
	function _okButtonHandler()
	{
		var entity_field	=	dj.byId("entity"),
		applicant_act_field	=	dj.byId("applicant_act_name"),
		displayMessage  = 	"";
		// displaying the tool tip error message if the value is not entered.
		if ((entity_field && (entity_field.get("value") === "") )|| applicant_act_field.get("value") === "")
		{
			displayMessage = misys.getLocalization("remittanceToolTip", [entity_field.get("value"),applicant_act_field.get("value")]);
			//focus on the widget and set state to error and display a tool tip indicating the same
			if (entity_field && entity_field.get("value") === "")
			{
				entity_field.focus();
				entity_field.set("state","Error");
				dj.hideTooltip(entity_field.domNode);
				dj.showTooltip(displayMessage, entity_field.domNode, 0);
			}
			if (applicant_act_field.get("value") === "")
			{
				applicant_act_field.focus();
				applicant_act_field.set("state","Error");
				dj.hideTooltip(applicant_act_field.domNode);
				dj.showTooltip(displayMessage, applicant_act_field.domNode, 0);
			}
		}
		else if (dj.byId("applicant_act_name").get("value") !== "" || dj.byId("applicant_act_product_types").get("value") !== "")
		{
			m.toggleSections();
			m.showRecurring();
			
			//Beneficiary Advice Field's Parameter Configurations
			m.handleParametersConfigurations();
		}
		d.forEach(dojo.query(".remittanceDisclaimer"),function(node){
				m.animate("fadeOut",node);		
		});
	}

	var beneficiary = { };
	beneficiary.fields = [  "beneficiary_name",
	                		"beneficiary_address",
	                		"beneficiary_city",
	                		"beneficiary_dom",
	                		"beneficiary_account",
	                		"cpty_bank_name",
	                		"cpty_bank_address_line_1",
	                		"cpty_bank_address_line_2",
	                		"cpty_bank_dom",
	                		"cpty_bank_country",
	                		"cpty_bank_swift_bic_code",
	                		"bank_iso_img",
	                		"cpty_bank_country_img",
	                		"pre_approved",
							"intermediary_bank_swift_bic_code",
							"intermediary_bank_name",
							"intermediary_bank_address_line_1",
							"intermediary_bank_address_line_2",
							"intermediary_bank_dom",
							"intermediary_bank_country"];
	                		
	beneficiary.toggleReadonly = function(/*boolean*/ flag)
	{
		m.toggleFieldsReadOnly(this.fields, flag);
	};
	
	beneficiary.initMT101 = function()
	{
		d.forEach(d.query(".MT101"),function(node)
		{
			d.style(node,"display","block");
		});
		
		if( dj.byId("pre_approved_status") && dj.byId("pre_approved_status").get("value") === "Y")
		{
			
			beneficiary.toggleReadonly(true);
			if(dj.byId("cpty_bank_country_img"))
			{
				dj.byId("cpty_bank_country_img").set("disabled",true);
			}
			if(dj.byId("bank_iso_img"))
			{
				dj.byId("bank_iso_img").set("disabled",true);
			}
		}
		else{
			if( (dj.byId("pre_approved") && dj.byId("pre_approved").get("value") === "") || (dj.byId("pre_approved") && dj.byId("pre_approved").get("value") === null))
			{
				var mt101_fields = ["beneficiary_name","beneficiary_address","beneficiary_city","beneficiary_dom","beneficiary_account","intermediary_bank_swift_bic_code"];
				m.toggleFieldsReadOnly(mt101_fields, false);
				if(dj.byId("cpty_bank_country_img"))
				{
					dj.byId("cpty_bank_country_img").set("disabled",false);
				}
				if(dj.byId("bank_iso_img"))
				{
					dj.byId("bank_iso_img").set("disabled",false);
				}
			}
			else 
			{
				beneficiary.toggleReadonly(true);	
				if(dj.byId("cpty_bank_country_img"))
				{
					dj.byId("cpty_bank_country_img").set("disabled",true);
				}
				if(dj.byId("bank_iso_img"))
				{
					dj.byId("bank_iso_img").set("disabled",true);
				}
			}
			
		}
	};
		
	beneficiary.initMT103 = function()
	{
		d.forEach(d.query(".MT103"),function(node)
		{
			d.style(node,"display","block");
		});
		
		var applicantAcctPAB = dj.byId("applicant_act_pab").get("value");
		
		if(applicantAcctPAB === 'Y' || (dj.byId("pre_approved_status") && dj.byId("pre_approved_status").get("value") === "Y")){
			
			beneficiary.toggleReadonly(true);
			if(dj.byId("cpty_bank_country_img"))
			{
				dj.byId("cpty_bank_country_img").set("disabled",true);
			}
			if(dj.byId("bank_iso_img"))
			{
				dj.byId("bank_iso_img").set("disabled",true);
			}
			
			m.toggleFieldsReadOnly(["branch_address_flag", "beneficiary_bank_branch_address_line_1","beneficiary_bank_branch_address_line_2","beneficiary_bank_branch_dom"], true);
			if(dj.byId("intermediary_bank_swift_bic_code").get("value").length !== 0)
			{
		
				dj.byId("inter_bank_iso_img").set("disabled",true);

				dj.byId("intermediary_bank_country_img").set("disabled",true);

				
			}
		}
		else{
			if( (dj.byId("pre_approved") && dj.byId("pre_approved").get ("value") === "") || (dj.byId("pre_approved") && dj.byId("pre_approved").get("value") === null))
			{
				var mt103_fields = ["beneficiary_name","beneficiary_address","beneficiary_city","beneficiary_dom","beneficiary_account","intermediary_bank_swift_bic_code"];
				m.toggleFieldsReadOnly(mt103_fields, false);
				if(dj.byId("cpty_bank_country_img"))
				{
					dj.byId("cpty_bank_country_img").set("disabled",false);
				}
				if(dj.byId("bank_iso_img"))
				{
					dj.byId("bank_iso_img").set("disabled",false);
				}
				if(dj.byId("inter_bank_iso_img"))
				{
					dj.byId("inter_bank_iso_img").set("disabled",false);
				}
				if(dj.byId("intermediary_bank_country_img"))
				{
					dj.byId("intermediary_bank_country_img").set("disabled",false);
				}
				m.toggleFieldsReadOnly(["branch_address_flag", "beneficiary_bank_branch_address_line_1","beneficiary_bank_branch_address_line_2","beneficiary_bank_branch_dom"], false);
			}
			else 
			{
				beneficiary.toggleReadonly(true);	
				if(dj.byId("cpty_bank_country_img"))
				{
					dj.byId("cpty_bank_country_img").set("disabled",true);
				}
				if(dj.byId("bank_iso_img"))
				{
					dj.byId("bank_iso_img").set("disabled",true);
				}
				
				m.toggleFieldsReadOnly(["branch_address_flag", "beneficiary_bank_branch_address_line_1","beneficiary_bank_branch_address_line_2","beneficiary_bank_branch_dom"], true);
				if(dj.byId("intermediary_bank_swift_bic_code").get("value").length !== 0)
				{
			
					dj.byId("inter_bank_iso_img").set("disabled",true);
					dj.byId("intermediary_bank_country_img").set("disabled",true);

					
				}
			}
			
			
			
			
		}
		
	};
	
	var beneficiaryFI202 = { }, bicCode = { }, interBicCode = { }, originationgBicCode = {};
	beneficiaryFI202.fields = [  "beneficiary_name",
	                		"beneficiary_address",
	                		"beneficiary_city",
	                		"beneficiary_dom",
	                		"beneficiary_account",
	                		"cpty_bank_swift_bic_code",
	                		"cpty_bank_name",
	                		"cpty_bank_address_line_1",
	                		"cpty_bank_address_line_2",
	                		"cpty_bank_dom",
	                		"cpty_bank_country",
	                		"pre_approved"];
	beneficiaryFI202.toggleReadonly = function(/*boolean*/ flag)
	{
		m.toggleFieldsReadOnly(this.fields, flag);
	};

	
	beneficiaryFI202.initFI202 = function()
	{
		d.forEach(d.query(".FI202"),function(node)
				{
					d.style(node,"display","block");
				});
				if(dj.byId("pre_approved_status") && dj.byId("pre_approved_status").get("value") === "Y"){

					var mt202_fields = ["beneficiary_swift_bic_code","beneficiary_name","beneficiary_address","beneficiary_city","beneficiary_dom"];
					m.toggleFieldsReadOnly(mt202_fields, true);
					
					if(dj.byId("cpty_bank_country_img"))
					{
						dj.byId("cpty_bank_country_img").set("disabled",true);
					}
					if(dj.byId("bank_iso_img"))
					{
						dj.byId("bank_iso_img").set("disabled",true);
					}
					
				}
				else
				{
					if( (dj.byId("pre_approved") && dj.byId("pre_approved").get("value") === "") || (dj.byId("pre_approved") && dj.byId("pre_approved").get("value") === null))
					{
						mt202_fields = ["beneficiary_swift_bic_code","beneficiary_name","beneficiary_address","beneficiary_city","beneficiary_dom"];
						m.toggleFieldsReadOnly(mt202_fields, false);
						
						if(dj.byId("cpty_bank_country_img"))
						{
							dj.byId("cpty_bank_country_img").set("disabled",false);
						}
						if(dj.byId("bank_iso_img"))
						{
							dj.byId("bank_iso_img").set("disabled", false);
						}
					}
					else
					{
						mt202_fields = ["beneficiary_swift_bic_code","beneficiary_name","beneficiary_address","beneficiary_city","beneficiary_dom"];
						m.toggleFieldsReadOnly(mt202_fields, true);
						
						if(dj.byId("cpty_bank_country_img"))
						{
							dj.byId("cpty_bank_country_img").set("disabled",true);
						}
						if(dj.byId("bank_iso_img"))
						{
							dj.byId("bank_iso_img").set("disabled", true);
						}
					}
				}
	};
	
	beneficiary.clear = function()
	{
	//	m.toggleFieldsReadOnly(this.fields, false, true);
		d.forEach(this.fields ,function(node, i)
		{
			if (dj.byId(node))
			{
				dj.byId(node).set("value", '');
			}
		});
		if (dj.byId("branch_address_flag"))
		{
			dj.byId("branch_address_flag").set("checked", false);
			dj.byId("branch_address_flag").set("readOnly", true);
		}
		if (dj.byId("cpty_bank_country_img"))
		{
			dj.byId("cpty_bank_country_img").set("disabled", false);
		}
		if(dj.byId("beneficiary_swift_bic_code"))
		{
			m.toggleFieldsReadOnly(["beneficiary_swift_bic_code"], false, true);
		}
		d.style("REMITTANCE","display","none");
	};
	
	bicCode.fields = [  "cpty_bank_swift_bic_code",
		"cpty_bank_name",
		"cpty_bank_address_line_1",
		"cpty_bank_address_line_2",
		"cpty_bank_dom",
		"cpty_bank_country",
		"intermediary_bank_swift_bic_code",
		"intermediary_bank_name",
		"intermediary_bank_address_line_1",
		"intermediary_bank_address_line_2",
		"intermediary_bank_dom",
		"intermediary_bank_country"];
bicCode.clear = function()
{
d.forEach(this.fields ,function(node, i)
{
if (dj.byId(node))
{
dj.byId(node).set("value", '');
}
});
};

interBicCode.fields = [ "intermediary_bank_name",
    "intermediary_bank_address_line_1",
    "intermediary_bank_address_line_2", 
    "intermediary_bank_dom",
     "intermediary_bank_country" ];
interBicCode.clear = function() {
d.forEach(this.fields, function(node, i) {
if (dj.byId(node)) {
dj.byId(node).set("value", '');
}
});
};

originationgBicCode.fields = [ "ordering_customer_bank_swift_bic_code",
    "ordering_customer_bank_name",
    "ordering_customer_bank_address_line_1", 
    "ordering_customer_bank_address_line_2",
    "ordering_customer_bank_dom",
     "ordering_customer_bank_country",
     "ordering_customer_bank_account"];
originationgBicCode.clear = function() {
d.forEach(this.fields, function(node, i) {
if (dj.byId(node)) {
dj.byId(node).set("value", '');
}
});
};
	/**
	 * bound to the Clear button
	 */
	function _clearButtonHandler()
	{
		var applicantAcctPAB = dj.byId("applicant_act_pab").get("value");
		if (applicantAcctPAB == "Y")
		{
			beneficiary.toggleReadonly(true);
		}
		else
		{
			beneficiary.toggleReadonly(false);
			
		}
		dj.byId("pre_approved_status").set("value", "N");
		beneficiary.clear();	
		m.clearBeneficiaryAdviceFieldsForDefaultingFromBeneMaster();
		d.style("REMITTANCE","display","none");
	}
	
	/**
	 * called after selecting a beneficiary
	 * No processing done if beneficiary is getting cleared
	 */
	function _beneficiaryChangeHandler()
	{
		var beneficiaryName = dj.byId("beneficiary_name").get("value");
		hasIntermediaryBankDetails=false;
		//_validateRegexBeneficiary();
		if(beneficiaryName !== "")
		{
			dj.byId('ft_amt').set('displayedValue','');
			if(dj.byId("pre_approved_status") && dj.byId("pre_approved_status").get("value") === "Y")
			{
				// Display PAB text only if non-PAB accounts are allowed
				if(m._config.non_pab_allowed)
				{
					d.style("REMITTANCE","display","inline");
				}else
				{
					console.debug("Non-PAB accounts are not allowed, hiding PAB text");
					d.style("REMITTANCE","display","none");
				}
				if(dj.byId("intermediary_bank_swift_bic_code") && dj.byId("intermediary_bank_swift_bic_code").get("value") !== "" && dj.byId("intermediary_bank_swift_bic_code").get("value") !== null)
				{
					hasIntermediaryBankDetails=true;
					if(dj.byId("inter_bank_iso_img"))
					{
						dj.byId("inter_bank_iso_img").set("disabled", true);
					}
					if(dj.byId("intermediary_bank_country_img"))
					{
						dj.byId("intermediary_bank_country_img").set("disabled", true);
					}
					dj.byId("has_intermediary").set("value","true");

				}
				else
					{
					dj.byId("has_intermediary").set("value","false");

					}
				
				
				if(dj.byId("bank_iso_img"))
				{
					dj.byId("bank_iso_img").set("disabled", true);
				}
				if(dj.byId("cpty_bank_country_img"))
				{
					dj.byId("cpty_bank_country_img").set("disabled", true);
				}
				
				beneficiary.toggleReadonly(true);
				if(dj.byId("has_intermediary"))
				{
				if(dj.byId("has_intermediary").get("value")=="true")
					{
					m.toggleFieldsReadOnly(mt103_intermediary_fields, true);

					}
				else if(dj.byId("has_intermediary").get("value")=="false")
					{
					m.toggleFieldsReadOnly(mt103_intermediary_fields, false);

					}
				}
				m.toggleFieldsReadOnly(["beneficiary_bank_branch_address_line_1","beneficiary_bank_branch_address_line_2","beneficiary_bank_branch_dom"], true);
				m.toggleFieldsReadOnly(["beneficiary_swift_bic_code"], true);
				if(dj.byId("beneficiary_iso_img"))
				{
					dj.byId("beneficiary_iso_img").set("disabled",true);
				}
			}	
			else
			{
				beneficiary.toggleReadonly(false);
				d.style("REMITTANCE","display","none");
				m.toggleFieldsReadOnly(["beneficiary_swift_bic_code"], false);
				if(dj.byId("intermediary_bank_swift_bic_code") && dj.byId("intermediary_bank_swift_bic_code").get("value") !== "" && dj.byId("intermediary_bank_swift_bic_code").get("value") !== null)
				{
					hasIntermediaryBankDetails=true;
					if(dj.byId("inter_bank_iso_img"))
					{
						dj.byId("inter_bank_iso_img").set("disabled", true);
					}
					if(dj.byId("intermediary_bank_country_img"))
					{
						dj.byId("intermediary_bank_country_img").set("disabled", true);
					}
					dj.byId("has_intermediary").set("value","true");
					m.toggleFieldsReadOnly(mt103_intermediary_fields, true);

				}
				else
				{
				dj.byId("has_intermediary").set("value","false");
				m.toggleFieldsReadOnly(mt103_intermediary_fields, false);


				}
			
				if( (dj.byId("pre_approved") && dj.byId("pre_approved").get("value") === "") || (dj.byId("pre_approved") && dj.byId("pre_approved").get("value") === null))
				{
					beneficiary.toggleReadonly(false);		
					if(dj.byId("bank_iso_img"))
					{
						dj.byId("bank_iso_img").set("disabled",false);
					}
					if(dj.byId("intermediary_bank_country_img"))
					{
						dj.byId("intermediary_bank_country_img").set("disabled",false);
					}
					m.toggleFieldsReadOnly(["branch_address_flag","beneficiary_bank_branch_address_line_1","beneficiary_bank_branch_address_line_2","beneficiary_bank_branch_dom"], false);
				}	
				else
				{
					beneficiary.toggleReadonly(true);	
					if(dj.byId("has_intermediary"))
					{
					if(dj.byId("has_intermediary").get("value")=="true")
						{
						m.toggleFieldsReadOnly(mt103_intermediary_fields, true);

						}
					else if(dj.byId("has_intermediary").get("value")=="false")
						{
						m.toggleFieldsReadOnly(mt103_intermediary_fields, false);

						}
					}
					if(dj.byId("bank_iso_img"))
					{
						dj.byId("bank_iso_img").set("disabled",true);
					}
					if(dj.byId("intermediary_bank_country_img"))
					{
						dj.byId("intermediary_bank_country_img").set("disabled",true);
					}
					m.toggleFieldsReadOnly(["branch_address_flag","beneficiary_bank_branch_address_line_1","beneficiary_bank_branch_address_line_2","beneficiary_bank_branch_dom"], true);
				}
				
				if(dj.byId("beneficiary_swift_bic_code") && dj.byId("beneficiary_swift_bic_code").get("value") !== "")
				{
					var beneficieryReadOnlyArray = ["beneficiary_name","beneficiary_address","beneficiary_city", "beneficiary_dom"];
					// if beneficiary account is not null then make it read only else editable
					if(dj.byId("beneficiary_account").get("value").length != 0)
					{
						beneficieryReadOnlyArray.push("beneficiary_account");
					}
					m.toggleFieldsReadOnly(beneficieryReadOnlyArray, true);
				}
				
				if(dj.byId("intermediary_bank_swift_bic_code") && dj.byId("intermediary_bank_swift_bic_code").get("value") !== "")
				{
					m.toggleFieldsReadOnly(["intermediary_bank_name","intermediary_bank_address_line_1","intermediary_bank_address_line_2", "intermediary_bank_dom", "intermediary_bank_country"], true);
				}
				
				if(dj.byId("cpty_bank_swift_bic_code").get("value").length !== 0)
			    {
					if(dj.byId("inter_bank_iso_img"))
					{
						if(dj.byId("intermediary_bank_swift_bic_code").get("value").length !== 0)
					    {
							dj.byId("inter_bank_iso_img").set("disabled",true);
							dj.byId("intermediary_bank_country_img").set("disabled",true);

					    }
						else
							{
							dj.byId("inter_bank_iso_img").set("disabled",false);
							dj.byId("intermediary_bank_country_img").set("disabled",false);

							}
							}
			    }
				else {
					if(dj.byId("inter_bank_iso_img"))
					{
						dj.byId("inter_bank_iso_img").set("disabled",false);

					}
					if(dj.byId("intermediary_bank_country_img"))
					{
						dj.byId("intermediary_bank_country_img").set("disabled",false);

					}
			}
				
				if(dj.byId("beneficiary_iso_img"))
				{
					dj.byId("beneficiary_iso_img").set("disabled",false);
				}
				if(dj.byId("cpty_bank_swift_bic_code") && dj.byId("cpty_bank_swift_bic_code").get("value").length !==0)
		    	{
					m.toggleFieldsReadOnly( ["cpty_bank_name","cpty_bank_address_line_1","cpty_bank_address_line_2","cpty_bank_dom","cpty_bank_country"], true);
				}
				
				if(dj.byId("intermediary_bank_swift_bic_code") && dj.byId("intermediary_bank_swift_bic_code").get("value").length !==0)
		    	{
					m.toggleFieldsReadOnly( ["intermediary_bank_name","intermediary_bank_address_line_1","intermediary_bank_address_line_2","intermediary_bank_dom","intermediary_bank_country"], true);
		    	}
				
			}
		}
	}	

	var isMandatoryBeneficiaryClearingCode = false;
	function _populateClearingCodes(/*String*/type) 
	{
		var clearingCodeSelectWidget;
		
		if (type === "beneficiary")
		{
			clearingCodeSelectWidget = dj.byId("beneficiary_bank_clearing_code_desc");
		}
		else 
		{
			clearingCodeSelectWidget = dj.byId("intermediary_bank_clearing_code_desc");	
		}
		if (clearingCodeSelectWidget) 
		{
			clearingCodeSelectWidget.reset();
		    var counCurr, clearingCodesPair;
		    var i,j;
			var clearingCodesCollection = [];
			var prefix;
			//If the country currency pair exists then, the drop down list will be populated else will be cleared
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
			
			if (clearingCodesCollection.length < 1)
			{
				var sectionId = (type === "beneficiary") ? "beneficiary_bank_clearing_code_section" : "intermediary_bank_clearing_code_section";
				d.style(d.byId(sectionId), {visibility: "hidden", display: "none"});
			}
			else
			{
				var store = new dojo.data.ItemFileReadStore({data: {identifier: "value", label: "name", items: clearingCodesCollection}});
				clearingCodeSelectWidget.store = store;
				if (type === "beneficiary")
				{
					if (dj.byId("beneficiary_bank_clearing_code_desc_no_send") != undefined && dj.byId("beneficiary_bank_clearing_code_desc_no_send").get("value") !== "")
					{
						clearingCodeSelectWidget.set("value", dj.byId("beneficiary_bank_clearing_code_desc_no_send").get("value"));
						dj.byId("beneficiary_bank_clearing_code_desc_no_send").set("value", "");
					}
				}
				else
				{
					if (dj.byId("intermediary_bank_clearing_code_desc_no_send") != undefined && dj.byId("intermediary_bank_clearing_code_desc_no_send").get("value") !== "")
					{				
						clearingCodeSelectWidget.set("value", dj.byId("intermediary_bank_clearing_code_desc_no_send").get("value"));
						dj.byId("intermediary_bank_clearing_code_desc_no_send").set("value", "");
					}
				}
			}
		}
		

	}
	
	/**
	 * Either open a popup to select a Master Beneficiary or a user Account
	 */
	function _beneficiaryButtonHandler()
	{
		var applicantActNo = dj.byId("applicant_act_no").get("value");
		var entity = dj.byId("entity") ? dj.byId("entity").get("value") : "";
		if (applicantActNo === "")
		{
			m.dialog.show("ERROR", m.getLocalization("selectDebitFirst"));
			return;
		}
		m.showSearchDialog("beneficiary_accounts", 
							   "['beneficiary_name','beneficiary_account','ft_cur_code', 'beneficiary_address', 'beneficiary_city', 'change_address_line_3', 'beneficiary_dom', " +
							   "'pre_approved_status', 'change_counterparty_name_2', 'change_counterparty_name_3', 'cpty_bank_name', 'cpty_bank_address_line_1', 'cpty_bank_address_line_2', " +
							   "'cpty_bank_dom', 'beneficiary_bank_branch_address_line_1', 'beneficiary_bank_branch_address_line_2', 'beneficiary_bank_branch_dom', 'cpty_bank_country', " +
							   "'beneficiary_swift_bic_code', 'cpty_bank_swift_bic_code', 'beneficiary_bank_code', 'beneficiary_branch_code', 'beneficiary_branch_name', " +
							   "'pre_approved', 'change_threshold','change_threshold_curcode','bene_adv_beneficiary_id_no_send','bene_adv_mailing_name_add_1_no_send'," +
							   "'bene_adv_mailing_name_add_2_no_send','bene_adv_mailing_name_add_3_no_send','bene_adv_mailing_name_add_4_no_send','bene_adv_mailing_name_add_5_no_send'," +
							   "'bene_adv_mailing_name_add_6_no_send','bene_adv_postal_code_no_send','bene_adv_country_no_send','bene_adv_email_no_send','bene_adv_email_no_send1', 'beneficiary_postal_code','beneficiary_country'," +
							   "'bene_adv_fax_no_send', 'bene_adv_ivr_no_send','beneficiary_nickname', 'bene_adv_phone_no_send','intermediary_bank_swift_bic_code','intermediary_bank_name','intermediary_bank_address_line_1'," +
							   "'intermediary_bank_address_line_2','intermediary_bank_dom','intermediary_bank_country']",
							   {product_type: dijit.byId("sub_product_code").get("value"), entity_name: entity, pabAccStat: dijit.byId("applicant_act_pab").get("value"),debitAcctNo: applicantActNo},
							   "", 
							   dijit.byId("sub_product_code").get("value"),
							   "width:710px;height:350px;",
							   m.getLocalization("ListOfBeneficiriesTitleMessage"));	
		
		//Beneficiary Advice fields which are defaulted must be cleared
		m.clearBeneficiaryAdviceFieldsForDefaultingFromBeneMaster();
 
	}
	
	function _swiftClearBeneficiaryAddressFields()
	{
		var bankFieldsDisabled = true;
	    if(dj.byId("cpty_bank_swift_bic_code") && dj.byId("cpty_bank_swift_bic_code").get("value").length ===0)
    	{
	    	bankFieldsDisabled=false;
	    }
	    changePropertyIfPresent("cpty_bank_name", "readOnly", bankFieldsDisabled);
	    changePropertyIfPresent("cpty_bank_address_line_1", "readOnly", bankFieldsDisabled);
	    changePropertyIfPresent("cpty_bank_address_line_2", "readOnly", bankFieldsDisabled);
	    changePropertyIfPresent("cpty_bank_dom", "readOnly", bankFieldsDisabled);
	    changePropertyIfPresent("cpty_bank_country", "readOnly", bankFieldsDisabled);
	    changePropertyIfPresent("bank_iso_img", "disabled", false);
	    changePropertyIfPresent("cpty_bank_country_img", "disabled", bankFieldsDisabled);
		m.toggleRequired("cpty_bank_name", true);
		m.toggleRequired("cpty_bank_address_line_1", true);
		m.toggleRequired("cpty_bank_country", true);
	}

	function changePropertyIfPresent(id, property, value)
	{
		var field = dj.byId(id);
		if (field)
		{
			field.set(property, value);
		}
	}
		
	function _swiftClearIntermediaryBankDetails()
	{
		var bankFieldsDisabled	=	true;
	    if(dj.byId("intermediary_bank_swift_bic_code") && dj.byId("intermediary_bank_swift_bic_code").get("value").length === 0)
    	{
	    	bankFieldsDisabled=false;
	    }
	    changePropertyIfPresent("intermediary_bank_swift_bic_code", "readOnly", bankFieldsDisabled);
	    changePropertyIfPresent("intermediary_bank_name", "readOnly", bankFieldsDisabled);
	    changePropertyIfPresent("intermediary_bank_address_line_1", "readOnly", bankFieldsDisabled);
	    changePropertyIfPresent("intermediary_bank_address_line_2", "readOnly", bankFieldsDisabled);
	    changePropertyIfPresent("intermediary_bank_dom", "readOnly", bankFieldsDisabled);
	    changePropertyIfPresent("intermediary_bank_country", "readOnly", bankFieldsDisabled);
	    changePropertyIfPresent("inter_bank_iso_img", "disabled", false);
	    changePropertyIfPresent("intermediary_bank_country_img", "disabled", bankFieldsDisabled);	    
		m.toggleRequired("intermediary_bank_name", bankFieldsDisabled);
		m.toggleRequired("intermediary_bank_address_line_1", bankFieldsDisabled);
		m.toggleRequired("intermediary_bank_address_line_2", false);
		m.toggleRequired("intermediary_bank_dom", false);
		m.toggleRequired("intermediary_bank_country", bankFieldsDisabled);	
	}
		
	function _swiftClearOrderingBankDetails()
	{
		var bankFieldsDisabled	=	true;
	    if(dj.byId("ordering_customer_bank_swift_bic_code").get("value").length ===0)
    	{
	    	bankFieldsDisabled=false;
	    }
	    dj.byId("ordering_customer_bank_name").set("readOnly", bankFieldsDisabled);
    	dj.byId("ordering_customer_bank_address_line_1").set("readOnly", bankFieldsDisabled);
    	dj.byId("ordering_customer_bank_address_line_2").set("readOnly", bankFieldsDisabled);
    	dj.byId("ordering_customer_bank_dom").set("readOnly", bankFieldsDisabled);
		dj.byId("ordering_customer_bank_country").set("readOnly", bankFieldsDisabled);
		dj.byId("ordering_customer_iso_img").set("disabled", false);
		dj.byId("ordering_customer_bank_country_img").set("disabled", bankFieldsDisabled);
		m.toggleRequired("ordering_customer_bank_name", true);
		m.toggleRequired("ordering_customer_bank_address_line_1", true);
		m.toggleRequired("ordering_customer_bank_address_line_2", false);
		m.toggleRequired("ordering_customer_bank_dom", false);
		m.toggleRequired("ordering_customer_bank_country", true);	
		m.toggleRequired("ordering_customer_bank_account", true);
	}	

	function _swiftClearOrderingInstitutionDetails()
	{
		
	    var bankFieldsDisabled	=	true;
	    if(dj.byId("ordering_institution_swift_bic_code").get("value").length ===0)
    	{
	    	bankFieldsDisabled=false;
    	}
		dj.byId("ordering_institution_name").set("readOnly", bankFieldsDisabled);
		dj.byId("ordering_institution_address_line_1").set("readOnly", bankFieldsDisabled);
		dj.byId("ordering_institution_address_line_2").set("readOnly", bankFieldsDisabled);
		dj.byId("ordering_institution_dom").set("readOnly", bankFieldsDisabled);
		dj.byId("ordering_institution_country").set("readOnly", bankFieldsDisabled);
		dj.byId("ordering_iso_img").set("disabled", false);
		dj.byId("ordering_institution_country_img").set("disabled", bankFieldsDisabled);
		m.toggleRequired("ordering_institution_name", true);
		m.toggleRequired("ordering_institution_address_line_1", true);
		m.toggleRequired("ordering_institution_address_line_2", false);
		m.toggleRequired("ordering_institution_dom", false);
		m.toggleRequired("ordering_institution_country", true);
		m.toggleRequired("ordering_institution_account", true);
	}
	
	function _swiftClearBeneficiaryInstitutionDetails()
	{
	    var bankFieldsDisabled	=	true;
	    if(dj.byId("beneficiary_name").get("value").length === 0)
    	{
	    	bankFieldsDisabled=false;
    	}
		dj.byId("beneficiary_name").set("readOnly", bankFieldsDisabled);
		dj.byId("beneficiary_address").set("readOnly", bankFieldsDisabled);
		dj.byId("beneficiary_city").set("readOnly", bankFieldsDisabled);
		dj.byId("beneficiary_dom").set("readOnly", bankFieldsDisabled);
		if(dj.byId("beneficiary_account").get("value").length != 0)
		{
			dj.byId("beneficiary_account").set("readOnly", true);
		}
		m.toggleRequired("beneficiary_name", true);
		m.toggleRequired("beneficiary_address", true);
		m.toggleRequired("beneficiary_city", false);
		m.toggleRequired("beneficiary_dom", false);
		m.toggleRequired("beneficiary_account", true);
		if(dj.byId("pre_approved_status") && dj.byId("pre_approved_status").get("value") === "Y")
		{
			m.toggleFieldsReadOnly(["beneficiary_swift_bic_code"], true);
			if(dj.byId("beneficiary_iso_img"))
			{
				dj.byId("beneficiary_iso_img").set("disabled",true);
			}
		}	
		else
		{
			m.toggleFieldsReadOnly(["beneficiary_swift_bic_code"], false);
			if(dj.byId("beneficiary_iso_img"))
			{
				dj.byId("beneficiary_iso_img").set("disabled",false);
			}
		}
	}
	
	function _onLoadBranchAddress()
	{
		if(dj.byId("branch_address_flag"))
		{
			if(dj.byId("cpty_bank_swift_bic_code").get("value").length === 0)
			{
				dj.byId("branch_address_flag").set("checked", false);
				dj.byId("branch_address_flag").set("readOnly", true);
			}
			else
			{
				dj.byId("branch_address_flag").set("readOnly", false);
				if(dj.byId("applicant_act_pab").get("value") == "Y")
				{
					dj.byId("beneficiary_bank_branch_address_line_1").set("value","");
					dj.byId("beneficiary_bank_branch_address_line_2").set("value","");
					dj.byId("beneficiary_bank_branch_dom").set("value","");
				}
			}
		}
	}
	
	function _toggleBranchAddress(/*boolean*/enable)
	{
		var array = ["beneficiary_bank_branch_address_line_1","beneficiary_bank_branch_address_line_2","beneficiary_bank_branch_dom"];
		var isBeneficiaryReadOnly = (dj.byId("beneficiary_name") && dj.byId("beneficiary_name").get('readOnly')) ? true : false;
		if(enable)
		{
			if( ( (dj.byId("pre_approved_status") && dj.byId("pre_approved_status").get("value") === "Y") || (dj.byId("pre_approved_status") && dj.byId("pre_approved_status").get("value") === "N")) && isBeneficiaryReadOnly)
			{
				m.toggleFieldsReadOnly(array, true);
			}
			else
			{
				m.toggleFieldsReadOnly(array, false);
				dj.byId("branch_address_flag").set("disabled", false);
				dj.byId("branch_address_flag").set("readOnly", false);
			}
			m.toggleRequired("beneficiary_bank_branch_address_line_1", true);
		}
		else
		{
			m.toggleFieldsReadOnly(array, true, true);
			m.toggleRequired("beneficiary_bank_branch_address_line_1", false);
		}
	}
	
	function _onPreApprovedChangeToggleBranchAdress()
	{
		if(dj.byId("branch_address_flag"))
		{
			if(dj.byId("pre_approved_status") && dj.byId("pre_approved_status").get("value") === "Y")
			{
				m.toggleFieldsReadOnly(["branch_address_flag","beneficiary_bank_branch_address_line_1","beneficiary_bank_branch_address_line_2","beneficiary_bank_branch_dom"], true);
			}
			else
			{
				if( (dj.byId("pre_approved") && dj.byId("pre_approved").get("value") === "") || (dj.byId("pre_approved") && dj.byId("pre_approved").get("value") === null))
				{
					m.toggleFieldsReadOnly(["branch_address_flag","beneficiary_bank_branch_address_line_1","beneficiary_bank_branch_address_line_2","beneficiary_bank_branch_dom"], false);
				}
				else
				{
					m.toggleFieldsReadOnly(["branch_address_flag","beneficiary_bank_branch_address_line_1","beneficiary_bank_branch_address_line_2","beneficiary_bank_branch_dom"], true);
				}
			    //_onLoadBranchAddress();
			}
	    }
	}
	
	function _changeBeneficiaryNotification()
	{
		var sendNotifyChecked = dj.byId("notify_beneficiary").get("checked");

		var choice1 = dj.byId("notify_beneficiary_choice_1");
		var choice2 = dj.byId("notify_beneficiary_choice_2");
		var notifyEmail = dj.byId("notify_beneficiary_email");

		choice1.set("disabled", !sendNotifyChecked);
		choice2.set("disabled", !sendNotifyChecked);
		notifyEmail.set("disabled",true);
		choice1.set("checked", sendNotifyChecked);
		choice2.set("checked", false);
		notifyEmail.set("value","");

		var notifyEmailDOM = d.byId("notify_beneficiary_email_node");
		var notifyRadio1DOM = d.byId("label_notify_beneficiary_choice_1");		
		d.place(notifyEmailDOM, notifyRadio1DOM, "after");
		var email = dj.byId("bene_adv_email_no_send").get("value");
		if (!email)
		{
			email = dj.byId("bene_adv_email_no_send1").get("value");
		}
		if (email && sendNotifyChecked)
		{
			notifyEmail.set("value", email);
			notifyEmail.set("readOnly", true);
		}
		if (!email && sendNotifyChecked)
		{
			if(dj.byId("beneficiary_name") && dj.byId("beneficiary_name").get("value")==="")
			{	
				m.dialog.show("ERROR", m.getLocalization("noBeneficiaryEmail"));
			}
			choice2.set("checked", true);
			var notifyRadio2DOM = d.byId("label_notify_beneficiary_choice_2");		
			d.place(notifyEmailDOM, notifyRadio2DOM, "after");
			notifyEmail.set("disabled",false);
		}
		
		m.toggleRequired("notify_beneficiary_email", sendNotifyChecked);
		m.toggleRequired("notify_beneficiary_choice_1", sendNotifyChecked);
		m.toggleRequired("notify_beneficiary_choice_2", sendNotifyChecked);
		
	}
	
	function _fillRemittanceCode() 
	{
		
			var remittanceDescription = dj.byId("remittance_description").get("value");
			dj.byId("remittance_code").set("value", m._config.remittanceArray[remittanceDescription].name);
				
	}
	
	function _changeBeneficiaryNotificationEmail()
	{
		var sendAlternativeChecked = dj.byId("notify_beneficiary_choice_2").get("checked") && !dj.byId("notify_beneficiary_choice_2").get("disabled");
		var notifyEmail = dj.byId("notify_beneficiary_email");
		var notifyRadio2 = dj.byId("notify_beneficiary_choice_2");
		
		var notifyEmailDOM = d.byId("notify_beneficiary_email_node");
		var notifyRadio1DOM = d.byId("label_notify_beneficiary_choice_1");
		var notifyRadio2DOM = d.byId("label_notify_beneficiary_choice_2");		
		
		var email = dj.byId("bene_adv_email_no_send").get("value");
		if (!email)
		{
			email = dj.byId("bene_adv_email_no_send1").get("value");
		}

		if (sendAlternativeChecked)
		{
			d.place(notifyEmailDOM, notifyRadio2DOM, "after");
			notifyEmail.set("disabled", false);
		}
		else
		{
			if (!email)
			{
				m.dialog.show("ERROR", m.getLocalization("noBeneficiaryEmail"));
				notifyRadio2.set("checked", true);
				notifyEmail.set("disabled", false);
			}
			else
			{
				d.place(notifyEmailDOM, notifyRadio1DOM, "after");
			}
		}
		
		if (email && !sendAlternativeChecked)
		{
			notifyEmail.set("value", email);
			notifyEmail.set("readOnly", true);
		}
		else
		{
			notifyEmail.set("value", "");
			notifyEmail.set("readOnly", false);
			notifyEmail.set("disabled", false);
		}
	}
	
	function _applicantAccountPABHandler()
	{
		
		var applicantAcctPAB = dj.byId("applicant_act_pab").get("value");
		if (applicantAcctPAB == "Y")
		{
			beneficiary.toggleReadonly(true);
		}
		else
		{
			if(m._config.non_pab_allowed)
			{
				beneficiary.toggleReadonly(false);
			}else
			{
				console.log("Adhoc mode is unavailable although selected debit account is non-PAB. Beneficiary is readonly");
				beneficiary.toggleReadonly(true);
			}
		}
		
		if(d.byId("clear_img"))
		{
			if(applicantAcctPAB == 'Y' && d.style(d.byId("clear_img"),"display") !== "none")
			{
				m.animate("wipeOut", d.byId('clear_img'));
				dj.byId("clear_img").setAttribute('disabled', true);
				console.log("Selected debit account is PAB. Hiding and Disabling clear button");
			}
			else if(applicantAcctPAB == 'N' && d.style(d.byId("clear_img"),"display") == "none")
			{
				m.animate("wipeIn", d.byId('clear_img'));
				dj.byId("clear_img").setAttribute('disabled', false);
				console.log("Selected debit account is non-PAB and adhoc mode is available. Displaying and enabling clear button");
			}
		}		
		if(d.byId("beneficiary_iso_img"))
		{
			if(applicantAcctPAB === 'Y' && d.style(d.byId("beneficiary_iso_img"),"display") !== "none")
			{
				m.animate("wipeOut", d.byId('beneficiary_iso_img'));
				dj.byId("beneficiary_iso_img").setAttribute('disabled', true);
				console.log("Selected debit account is PAB. Hiding and Disabling the select button");
			}
			else if(applicantAcctPAB === 'N' && d.style(d.byId("beneficiary_iso_img"),"display") == "none")
			{
				m.animate("wipeIn", d.byId('beneficiary_iso_img'));
				dj.byId("beneficiary_iso_img").setAttribute('disabled', false);
				console.log("Selected debit account is non-PAB and adhoc mode is available. Displaying and enabling beneficiary iso select button");
			}
		}	
	}
	
	/**
	 * Customer Bank Field onChange handler
	 */
	function _handleCusomterBankOnChangeFields()
	{
		var bank_desc_name = null;
		var customer_bank = dj.byId("customer_bank").get("value"); 
		
		if(misys && misys._config && misys._config.businessDateForBank && misys._config.businessDateForBank[customer_bank] && misys._config.businessDateForBank[customer_bank][0] && misys._config.businessDateForBank[customer_bank][0].value !== '')
		{
			var date = misys._config.businessDateForBank[customer_bank][0].value;
			var yearServer = date.substring(0,4);
			var monthServer = date.substring(5,7);
			var dateServer = date.substring(8,10);
			date = dateServer + "/" + monthServer + "/" + yearServer;
			var date1 = new Date(yearServer, monthServer - 1, dateServer);
			if(dj.byId("option_for_app_date") && dj.byId("option_for_app_date").get("value") === "SCRATCH"){
				dj.byId("appl_date").set("value", date);
				document.getElementById('appl_date_view_row').childNodes[1].innerHTML = date;
				if(dj.byId("appl_date_hidden")){
					dj.byId("appl_date_hidden").set("value", date1);
				}
			}
			if(dj.byId("todays_date")){
				dj.byId("todays_date").set("value", date1);
			}
		}
		if(!hasCustomerBankValue && !formLoading)
		{	
			if(dj.byId("applicant_act_name")){
				dj.byId("applicant_act_name").set("value", "");
			}
			if(dj.byId("applicant_act_no"))
			{
				dj.byId("applicant_act_no").set("value", "");
			}
			if(dj.byId("beneficiary_name")){
				dj.byId("beneficiary_name").set("value", "");
			}
			if(dj.byId("beneficiary_act_cur_code")){
				dj.byId("beneficiary_act_cur_code").set("value", "");
			}
			if(dj.byId("beneficiary_account")){
				dj.byId("beneficiary_account").set("value", "");
			}
			if(dj.byId("cpty_bank_code")){
				dj.byId("cpty_bank_code").set("value", "");
			}
			if(dj.byId("cpty_branch_code")){
				dj.byId("cpty_branch_code").set("value", "");
			}
			if(dj.byId("cpty_bank_name")){
				dj.byId("cpty_bank_name").set("value", "");
			}
			if(dj.byId("cpty_branch_name")){
				dj.byId("cpty_branch_name").set("value", "");
			}
			if(dj.byId("ft_cur_code")){
				dj.byId("ft_cur_code").set("value", "");
			}
			if(dj.byId("ft_amt")){
				dj.byId("ft_amt").set("value", "");
			}
			if(dj.byId("iss_date")){
				dj.byId("iss_date").set("value", null);
			}
    		if(dj.byId("issuing_bank_abbv_name")){
    			dj.byId("issuing_bank_abbv_name").set("value",customer_bank);
    		}
    		bank_desc_name = misys._config.customerBankDetails[customer_bank][0].value;
    		if(dj.byId("issuing_bank_name")){
    			dj.byId("issuing_bank_name").set("value",bank_desc_name);
    		}
		}
		
		if(!hasCustomerBankValue)
		{
			dj.byId("issuing_bank_abbv_name").set("value",customer_bank);
			bank_desc_name = misys._config.customerBankDetails[customer_bank][0].value;
    		dj.byId("issuing_bank_name").set("value",bank_desc_name);
		}
		hasCustomerBankValue = false;
		if(dj.byId("customer_bank") && customer_bank !== "")
		{
			formLoading = false;
			if(dj.byId("issuing_bank_abbv_name").get("value")!== "")
			{
				bank_desc_name = misys._config.customerBankDetails[customer_bank][0].value;
	    		dj.byId("issuing_bank_name").set("value",bank_desc_name);
			}	
		}
		
		m.initializeFX(dj.byId("sub_product_code").get("value"), dj.byId("issuing_bank_abbv_name").get("value"));
		if(dj.byId("applicant_act_cur_code") && dj.byId("applicant_act_cur_code").get("value") !== '' && dj.byId("ft_cur_code") && dj.byId("ft_cur_code").get("value") !== "" && dj.byId("applicant_act_cur_code").get("value")!== dj.byId("ft_cur_code").get("value") && !isNaN(dj.byId("ft_amt").get("value")))
		{
			m.onloadFXActions();
		}
		else
		{
			m.defaultBindTheFXTypes();
		}
		
		_handleFXAction();
	}
	
	function _applicantAccountChangeHandler()
	{
		
		// clear all beneficiary fields
		dojo.forEach(["pre_approved", "beneficiary_account", "beneficiary_act_cur_code", "beneficiary_address", "beneficiary_city", "beneficiary_dom", "pre_approved_status", "cpty_bank_name", 
					"cpty_bank_address_line_1", "cpty_bank_address_line_2", "cpty_bank_dom", "cpty_branch_address_line_1", "cpty_branch_address_line_2", "cpty_branch_dom", "cpty_bank_country",
					"cpty_bank_swift_bic_code", "cpty_bank_code", "cpty_branch_code", "cpty_branch_name", "beneficiary_name", "bene_adv_beneficiary_id_no_send", 
					"bene_adv_mailing_name_add_1_no_send","bene_adv_mailing_name_add_2_no_send","bene_adv_mailing_name_add_3_no_send","bene_adv_mailing_name_add_4_no_send", 
					"bene_adv_mailing_name_add_5_no_send","bene_adv_mailing_name_add_6_no_send","bene_adv_postal_code_no_send","bene_adv_country_no_send","bene_email_1", 
					"bene_email_2","beneficiary_postal_code","beneficiary_country", "bene_adv_fax_no_send", "bene_adv_ivr_no_send", "bene_adv_phone_no_send", "bene_adv_email_no_send1", "bene_adv_email_no_send", "ft_amt", "ft_cur_code",
					"intermediary_bank_swift_bic_code","intermediary_bank_name","intermediary_bank_address_line_1","intermediary_bank_address_line_2","intermediary_bank_dom","intermediary_bank_country","intermediary_bank_clearing_code","intermediary_bank_clearing_code_desc"], function(currentField) {
			if (dj.byId(currentField)) 
			{
				dj.byId(currentField).set("value", "");
			}
		});
		// clear fx section
		if(d.byId(fxSection) && (d.style(d.byId(fxSection),"display") !== "none"))
		{
			m.animate("wipeOut", d.byId(fxSection));
		}
		dj.byId("ft_cur_code").set("value", dj.byId("applicant_act_cur_code").get("value"));
		// Clear PAB label
		d.style("REMITTANCE","display","none");
		m.setApplicantReference();
	}
	function _compareApplicantAndBenificiaryCurrency()
	{
		var applicant_act_cur_code = dj.byId('applicant_act_cur_code').get('value');
		var beneficiary_ft_cur_code = dj.byId('ft_cur_code').get('value');

		if ( applicant_act_cur_code !== beneficiary_ft_cur_code)
			{
				m.dialog.show("ERROR",m.getLocalization("crossCurrency"));
				dj.byId('beneficiary_name').set('value','');
				dj.byId('beneficiary_address').set('value','');
				dj.byId('beneficiary_city').set('value','');
				dj.byId('beneficiary_account').set('value','');		
				dj.byId('beneficiary_dom').set('value','');
				dj.byId('cpty_bank_swift_bic_code').set('value','');
				dj.byId('cpty_bank_address_line_1').set('value','');
				dj.byId('cpty_bank_name').set('value','');
				dj.byId('cpty_bank_country').set('value','');
				dj.byId('cpty_bank_address_line_2').set('value','');
				dj.byId('cpty_bank_dom').set('value','');
				dj.byId('cpty_bank_country').set('value','');
				setTimeout(function() {dj.byId("ft_cur_code").set("value",applicant_act_cur_code);}, 0);		
				dj.byId('beneficiary_bank_branch_address_line_1').set('value','');
				dj.byId('beneficiary_bank_branch_address_line_2').set('value','');
				dj.byId('beneficiary_bank_branch_dom').set('value','');
				dj.byId('pre_approved').set('value','');
				dj.byId('pre_approved_status').set('value','');
				dj.byId('branch_address_flag').set("checked", false);
				//Notify Email flag and email, all should be unchecked and cleared
				dj.byId("notify_beneficiary_choice_1").set("checked", false);
				dj.byId("notify_beneficiary_choice_2").set("checked", false);	
				dj.byId("notify_beneficiary_choice_1").set("disabled", true);
				dj.byId("notify_beneficiary_choice_2").set("disabled", true);
				dj.byId("notify_beneficiary").set("checked",false);
				dj.byId("bene_adv_email_no_send1").set('value','');
				dj.byId("bene_adv_email_no_send").set('value','');
				d.place(d.byId("notify_beneficiary_email_node"), d.byId("label_notify_beneficiary_choice_2"), "after");
				dj.byId("notify_beneficiary_email").set('value','');
				dj.byId("notify_beneficiary_email").set("disabled",true);	
				if (dj.byId("applicant_act_pab").get("value") !== 'Y')
				{
					m.toggleFieldsReadOnly(['beneficiary_name','beneficiary_address','beneficiary_city', 'beneficiary_dom','beneficiary_account','cpty_bank_swift_bic_code','cpty_bank_address_line_1','cpty_bank_name',
				                        'cpty_bank_country','cpty_bank_address_line_2','cpty_bank_dom','cpty_bank_country','ft_cur_code'], false);
				}else{
					m.toggleFieldsReadOnly(['beneficiary_name','beneficiary_address','beneficiary_city', 'beneficiary_dom','beneficiary_account','cpty_bank_swift_bic_code','cpty_bank_address_line_1','cpty_bank_name',
				                        'cpty_bank_country','cpty_bank_address_line_2','cpty_bank_dom','cpty_bank_country','ft_cur_code'], true);
				}
				d.style("REMITTANCE","display","none");
				//code added for JIRA: MPG-4569
				if(dj.byId("bank_iso_img"))
				{
					dj.byId("bank_iso_img").set("disabled",false);
				}
				return;
			}
		else
		{
			dj.byId("ft_cur_code").set("displayedValue", beneficiary_ft_cur_code);
			if (dj.byId("applicant_act_pab").get("value") !== 'Y')
			{
				m.toggleFieldsReadOnly(['beneficiary_name','beneficiary_address','beneficiary_city', 'beneficiary_dom','beneficiary_account','cpty_bank_swift_bic_code','cpty_bank_address_line_1','cpty_bank_name',
			                        'cpty_bank_country','cpty_bank_address_line_2','cpty_bank_dom','cpty_bank_country','ft_cur_code'], false);
			}else{
				m.toggleFieldsReadOnly(['beneficiary_name','beneficiary_address','beneficiary_city', 'beneficiary_dom','beneficiary_account','cpty_bank_swift_bic_code','cpty_bank_address_line_1','cpty_bank_name',
			                        'cpty_bank_country','cpty_bank_address_line_2','cpty_bank_dom','cpty_bank_country','ft_cur_code'], true);
			}
			return;
		}
	}
	
    d.ready(function(){
		
		m._config.forceSWIFTValidation = true;

	});	
			
	d.mixin(m._config, {

		initReAuthParams : function() {
			var entityValue = dj.byId("entity") ? dj.byId("entity").get("value") : "";
			var reAuthParams = {
				productCode : "FT",
				subProductCode : dj.byId("sub_product_code")? dj.byId("sub_product_code").get("value"): '',
				transactionTypeCode : "01",
				entity : entityValue,
				currency : dj.byId("ft_cur_code")? dj.byId("ft_cur_code").get("value"): '',
				amount : dj.byId("ft_amt")? m.trimAmount(dj.byId("ft_amt").get("value")): '',
				bankAbbvName : dj.byId("customer_bank")? dj.byId("customer_bank").get("value") : "",
				es_field1 : dj.byId("ft_amt")? m.trimAmount(dj.byId("ft_amt").get("value")): '',
				es_field2 : (dj.byId("beneficiary_account")) ? dj.byId(
						"beneficiary_account").get("value") : ""
			};
			return reAuthParams;
		}
	});
	
	d.mixin(m, {
		
		fireFXAction : function()
		{
			if (m._config.fxParamData && dj.byId("sub_product_code") && dj.byId("sub_product_code").get("value") !== "" && dj.byId("issuing_bank_abbv_name") && dj.byId("issuing_bank_abbv_name").get("value") !== "")
			{
				var fxParamObject = m._config.fxParamData[dj.byId("sub_product_code").get("value")][dj.byId("issuing_bank_abbv_name").get("value")];
				if (m._config.fxParamData && fxParamObject.isFXEnabled === "Y")
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
							if(fromCurrency && toCurrency)
							{
								if(d.byId(fxSection)&&(d.style(d.byId(fxSection),"display") === "none"))
								{
									m.animate("wipeIn", d.byId(fxSection));
								}							
								m.fetchFXDetails(fromCurrency, toCurrency, amount, productCode, bankAbbvName, masterCurrency, isDirectConversion);
								if(dj.byId("fx_rates_type_1") && dj.byId("fx_rates_type_1").get("checked"))
								{
									if(isNaN(dj.byId("fx_exchange_rate").get("value")) || dj.byId("fx_exchange_rate_cur_code").get("value") === "" ||
											isNaN(dj.byId("fx_exchange_rate_amt").get("value")) || (m._config.fxParamData[dj.byId("sub_product_code").get("value")][dj.byId("issuing_bank_abbv_name").get("value")].toleranceDispInd === "Y" && (isNaN(dj.byId("fx_tolerance_rate").get("value")) || 
											isNaN(dj.byId("fx_tolerance_rate_amt").get("value")) || dj.byId("fx_tolerance_rate_cur_code").get("value") === "")))
									{
										_clearRequiredFields(m.getLocalization("FXDefaultErrorMessage"));
									}
								}
							}
							else
							{
								if(d.byId(fxSection) && (d.style(d.byId(fxSection),"display") !== "none"))
								{
									m.animate("wipeOut", d.byId(fxSection));
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
		
		bind : function() {
			
			
			
			m.setValidation("fx_tolerance_rate",m.validateToleranceAndExchangeRate);

			m.connect("beneficiary_name", "onChange", m.checkBeneficiaryNicknameDiv);
			m.connect("applicant_act_name", "onChange", m.checkNickNameDiv);
			m.setValidation("template_id", m.validateTemplateId);
			m.setValidation("request_date", m.validateCashRequestDate);
			m.setValidation("iss_date", m.validateCashProcessingDate);
			// clear the date array to make ajax call for BusinessDate to get holidays and cutoff details		
			m.connect("iss_date","onClick", function(){
				m.clearDateCache();
				if(misys._config.isMultiBank){
					var customer_bank;
					if(dijit.byId("customer_bank"))
					{
						customer_bank = dijit.byId("customer_bank").get("value");
					}
					if(customer_bank !== "" && misys && misys._config && misys._config.businessDateForBank && misys._config.businessDateForBank[customer_bank][0] && misys._config.businessDateForBank[customer_bank][0].value !== "")
					{
						var yearServer = parseInt(misys._config.businessDateForBank[customer_bank][0].value.substring(0,4), 10);
						var monthServer = parseInt(misys._config.businessDateForBank[customer_bank][0].value.substring(5,7), 10);
						var dateServer = parseInt(misys._config.businessDateForBank[customer_bank][0].value.substring(8,10), 10);
						this.dropDown.currentFocus = new  Date(yearServer, monthServer - 1, dateServer);
					}
				}
			});
			m.setValidation("ft_cur_code", m.validateCurrency);
			m.setValidation("cpty_bank_country", m.validateCountry);
			m.setValidation("intermediary_bank_country", m.validateCountry);
			m.setValidation("ordering_institution_country", m.validateCountry);
			m.setValidation("ordering_customer_bank_country", m.validateCountry);
			m.setValidation("beneficiary_country", m.validateCountry);
			m.setValidation("fx_exchange_rate", m.validateToleranceAndExchangeRate);
			m.setValidation("notify_beneficiary_email", m.validateEmailAddr);
			
			m.setValidation("cpty_bank_swift_bic_code", m.validateBICFormat);
			m.setValidation("intermediary_bank_swift_bic_code", m.validateBICFormat);
			m.setValidation("ordering_customer_bank_swift_bic_code", m.validateBICFormat);
			m.setValidation("ordering_institution_swift_bic_code", m.validateBICFormat);
			m.setValidation("beneficiary_swift_bic_code", m.validateBICFormat);

			
			// binding
			m.connect("charge_act_name","onChange", function(){
				if (dj.byId("charge_act_name") && dj.byId("debit_account_for_charges"))
				{
					dj.byId("debit_account_for_charges").set("value", dj.byId("charge_act_name").get("value"));
				}
			});
			m.connect("entity", "onClick", m.validateRequiredField);
			m.connect("applicant_act_name", "onClick", m.validateRequiredField);
			
			m.connect("beneficiary_name", "onClick", m.validateRequiredField);
 	 	 	m.connect("beneficiary_address", "onClick", m.validateRequiredField);
 	 	 	m.connect("beneficiary_account", "onClick", m.validateRequiredField);
 	 	 	m.connect("cpty_bank_name", "onClick", m.validateRequiredField);
 	 	 	m.connect("cpty_bank_address_line_1", "onClick", m.validateRequiredField);
 	 	 	m.connect("cpty_bank_country", "onClick", m.validateRequiredField);
			
			m.connect("recurring_flag", "onClick", m.showRecurring);
			m.connect("recurring_flag", "onClick", function(){
				 var gppFeeConfigFlag = dj.byId("gpp_fee_config_flag") ? dj.byId("gpp_fee_config_flag").get("value") : "false";
				 var gppFeeConfigAmtCur = dj.byId("gpp_fee_config_amt_cur_code") ? dj.byId("gpp_fee_config_amt_cur_code").get("value") : "",
				 gppFeeConfigAmtValue = dj.byId("gpp_fee_config_amt_val") ? dj.byId("gpp_fee_config_amt_val").get("value") : "";
					if(dj.byId("response_status")) {
						dj.byId("response_status").set("value", "");
					}
				 if(dj.byId("recurring_flag").get("checked") === true){
	           			 if(dj.byId("payment_fee_details")) {
	                		dj.byId("payment_fee_details").set("value", "");
	           			 }
	           		if((gppFeeConfigFlag === "true")) {
	            		if(document.getElementById('NO_FEES_FOR_RECCURING_PAYMENT')) {
	                		document.getElementById('NO_FEES_FOR_RECCURING_PAYMENT').style.display = "block";
	            		}
	            		m.hideFeeDetailsForError();
	           		}
	        
				} else{
						
					if((gppFeeConfigFlag === "true")) {
						
							m.hideAllDisclaimerMessages();
		                    dj.byId("add_fee_details_button").set('disabled', false);
		                    document.getElementById('FEE_DETAILS_CONFIRMATION_DISCLAIMER').style.display = "block";
		                    if(dj.byId("is_view_fees_btn")) {
		    					dj.byId("is_view_fees_btn").set("value","false");
		    				}
						}
					}          
	 			});
			m.connect("button_intrmdt_ok", "onClick", _okButtonHandler);
			m.setValidation("beneficiary_name", _validateRegexBeneficiary);
			m.connect("beneficiary_name", "onChange", function(){
				_beneficiaryChangeHandler();
				if(dj.byId("notify_beneficiary_email") && dj.byId("notify_beneficiary").get("checked"))
				{
					if(dj.byId("notify_beneficiary_choice_1").get("checked"))
						{
						if(dj.byId("bene_adv_email_no_send").get("value") !== "")
							{
							dj.byId("notify_beneficiary_email").set("value", dj.byId("bene_adv_email_no_send").get("value"));
							}
						else if(dj.byId("bene_adv_email_no_send1").get("value") !== "")
							{
							dj.byId("notify_beneficiary_email").set("value", dj.byId("bene_adv_email_no_send1").get("value"));
							}
						else
							{
							dj.byId("notify_beneficiary").set("checked", false);
							dj.byId("notify_beneficiary_choice_1").set("checked", false);
							dj.byId("notify_beneficiary_email").set("value", "");
							dj.byId("notify_beneficiary_email").set("disabled", true);
							}
						}
					else if(dj.byId("notify_beneficiary_choice_2").get("checked"))
						{
						dj.byId("notify_beneficiary_email").set("value", "");
						}
				}
			});
			
			if (dj.byId("sub_product_code") && dj.byId("sub_product_code").get("value") === "MT103") {
				
				  m.connect("beneficiary_name", "onChange", m.validateRemittanceReasonCode); 			   
            
			} 
			m.connect("beneficiary_img", "onClick", _beneficiaryButtonHandler);
			
			m.connect("notify_beneficiary", "onClick", _changeBeneficiaryNotification);
			m.connect("notify_beneficiary_choice_1", "onClick", _changeBeneficiaryNotificationEmail);
			m.connect("notify_beneficiary_choice_2", "onClick", _changeBeneficiaryNotificationEmail);
			
			if(dj.byId("remittance_description") && dj.byId("remittance_description").get("value") === "")
			{
				dj.byId("remittance_code").set("value", "");
			}
		
			m.connect("remittance_description", "onChange", _fillRemittanceCode);
			
			m.connect("cpty_bank_swift_bic_code","onChange", _truncateBankNameForCounterparty);
			m.connect("cpty_bank_swift_bic_code","onChange",_matchBicCodes);

			//m.connect("cpty_bank_name","onChange", _truncateBankNameForCounterparty);
			m.connect("cpty_bank_swift_bic_code","onChange",function() {
				if (dj.byId("cpty_bank_swift_bic_code") && dj.byId("cpty_bank_swift_bic_code").get("value").length === 0)
				{		
					if( (dj.byId("pre_approved") && dj.byId("pre_approved").get("value") === "") || (dj.byId("pre_approved") && dj.byId("pre_approved").get("value") === null)){
						m.toggleFieldsReadOnly(["cpty_bank_swift_bic_code","cpty_bank_name","cpty_bank_address_line_1","cpty_bank_address_line_2","cpty_bank_dom","cpty_bank_country"], false);
						if(dj.byId("beneficiary_bank_branch_address_line_1"))
						{
							dj.byId("beneficiary_bank_branch_address_line_1").set("readOnly", true);
						}
						if(dj.byId("branch_address_flag"))
						{
							dj.byId("branch_address_flag").set("checked", false);
						}
						dj.byId("cpty_bank_country_img").set("disabled",false);
					}
					bicCode.clear();
				}
			});
			m.connect("ordering_institution_swift_bic_code","onBlur",function(){
				
				if(dj.byId("ordering_institution_swift_bic_code").get("value").length === 0)
				{
					m.toggleFieldsReadOnly(["ordering_institution_swift_bic_code","ordering_institution_name","ordering_institution_address_line_1","ordering_institution_address_line_2","ordering_customer_bank_dom","ordering_customer_bank_country","ordering_customer_bank_account"], false);
					orderinginstitutionswiftbiccode.clear();
				}
				});
m.connect("intermediary_bank_swift_bic_code","onBlur",function(){
				
				if(dj.byId("intermediary_bank_swift_bic_code").get("value").length === 0)
		    	{
					m.toggleFieldsReadOnly(["intermediary_bank_swift_bic_code","intermediary_bank_name","intermediary_bank_address_line_1","intermediary_bank_address_line_2","intermediary_bank_dom","intermediary_bank_country"], false);
					interBicCode.clear();
		    	}
				});
		m.connect("beneficiary_swift_bic_code","onChange",function(){
	
			if(dj.byId("beneficiary_swift_bic_code").get("value").length === 0)
				{
				m.toggleFieldsReadOnly(["beneficiary_swift_bic_code","beneficiary_name","beneficiary_address","beneficiary_city","beneficiary_dom","beneficiary_account"], false);
				beneficiaryswiftbiccode.clear();
				}
				});
		
		m.connect("ordering_institution_swift_bic_code","onBlur",function(){
			
			if(dj.byId("ordering_institution_swift_bic_code").get("value").length === 0)
			{
				m.toggleFieldsReadOnly(["ordering_institution_swift_bic_code","ordering_institution_name","ordering_institution_address_line_1","ordering_institution_address_line_2","ordering_customer_bank_dom","ordering_customer_bank_country","ordering_customer_bank_account"], false);
				orderinginstitutionswiftbiccode.clear();
			}
			});
			m.connect("intermediary_bank_swift_bic_code","onChange",function(){
				var intermediaryBankCountryImg = dj.byId("intermediary_bank_country_img");

				if(!m._config.isBeneficiaryAccountsPopulated && this.get("value") !== "")
				{
					m.setSwiftBankDetailsForOnBlurEvent(false ,"intermediary_bank_swift_bic_code", null, null, "intermediary_bank_", true,false,true);

				}
				

				if (dj.byId("intermediary_bank_swift_bic_code"))
				{
					dj.byId("beneficiary_bank_swift_bic_code").set("value", dj.byId("intermediary_bank_swift_bic_code").get("value"));
				}

				if(dj.byId("pre_approved_status") && dj.byId("pre_approved_status").get("value") === "Y"){

					var mt101_fields = ["intermediary_bank_name","intermediary_bank_address_line_1","intermediary_bank_address_line_2","intermediary_bank_dom","intermediary_bank_country"];
					m.toggleFieldsReadOnly(mt101_fields, true);
				}
				else{

					mt101_fields = ["intermediary_bank_name","intermediary_bank_address_line_1","intermediary_bank_address_line_2","intermediary_bank_dom","intermediary_bank_country"];
					m.toggleFieldsReadOnly(mt101_fields, true);
				}		

				if (intermediaryBankCountryImg)
				{
					if (dj.byId("intermediary_bank_swift_bic_code").get("value").length !== 0 &&dj.byId("pre_approved_status").get("value") === "Y" && hasIntermediaryBankDetails)
					{
						intermediaryBankCountryImg.set("disabled", true);
					} else
					{
						if(dj.byId("intermediary_bank_swift_bic_code").get("value").length !== 0)
							{
							intermediaryBankCountryImg.set("disabled", true);
							}
						else
							{
						intermediaryBankCountryImg.set("disabled", false);
							}
					}
				}
			});
			
			m.connect("branch_address_flag", "onChange", function(){
				_toggleBranchAddress(this.get("checked"));
			});	
			
			m.connect("beneficiary_bank_branch_address_line_1", "onChange", function(){
				if(this.get("value") !== "")
				{
					if(!dj.byId("branch_address_flag").get("checked"))
					{
						dj.byId("branch_address_flag").set("checked", true);
					}
				}
				if(m._config.isBeneficiaryAccountsPopulated)
				{
					if(this.get("value") === "")
					{
						dj.byId("branch_address_flag").set("checked", false);
					}
				}
			});	
			
				m.connect("cpty_bank_country", "onChange", function(){
					if (dj.byId("sub_product_code") && dj.byId("sub_product_code").get("value") === "MT103") {
					m.MT103ValidCountryCode(); // ft_cur_code
					}
				});
			m.connect("pre_approved_status","onChange",function(){
				_onPreApprovedChangeToggleBranchAdress();
				if(dj.byId("pre_approved_status").get("value")==="N" )
				{
						if(dj.byId("bank_img"))
						{
							dj.byId("bank_img").set("disabled",false);
						}
						if(dj.byId("bank_iso_img"))
						{
							dj.byId("bank_iso_img").set("disabled",false);
						}
						if(dj.byId("currency"))
						{
							dj.byId("currency").set("disabled",false);
						}
						if(dj.byId("cpty_bank_country_img"))
						{
							if(dj.byId("cpty_bank_swift_bic_code").get("value").length === 0)
						    {
								dj.byId("cpty_bank_country_img").set("disabled", false);
							}
							else
							{
								dj.byId("cpty_bank_country_img").set("disabled", true);
								if(dj.byId("bank_iso_img"))
								{
									dj.byId("bank_iso_img").set("disabled",true);
								}
								if(dj.byId("inter_bank_iso_img"))
								{
									if(dj.byId("intermediary_bank_swift_bic_code").get("value").length !== 0)
									{
								dj.byId("inter_bank_iso_img").set("disabled", true);
								dj.byId("intermediary_bank_country_img").set("disabled", true);
									}
								}
							}
						}
				}
			});
			
			m.connect("ft_cur_code", "onChange", function(){
				m._validateCurrencyCode(dj.byId("sub_product_code"),
						dj.byId("ft_cur_code"));
			});
			m.connect("ft_cur_code", "onChange",m.MT103ValidCountryCode);
			m.connect("ft_cur_code", "onChange",m.MT103Intermediarydetailvalidation);
			
			m.connect("intermediary_bank_swift_bic_code","onBlur",function(){
				m.setSwiftBankDetailsForOnBlurEvent(false ,"intermediary_bank_swift_bic_code", null, null, "intermediary_bank_", true,true,true);
				if(dj.byId("intermediary_bank_swift_bic_code").get("value").length !== 0 && dj.byId("pre_approved_status") && dj.byId("pre_approved_status").get("value") === "Y" && hasIntermediaryBankDetails)
		    	{
					dj.byId("intermediary_bank_country_img").set("disabled", true);
					dj.byId("inter_bank_iso_img").set("disabled",true);
			    }
				else
				{
				
					dj.byId("intermediary_bank_country_img").set("disabled", false);
					if(dj.byId("intermediary_bank_swift_bic_code").get("value").length !== 0 && (hasIntermediaryBankDetails || (dj.byId("has_intermediary") && dj.byId("has_intermediary").get("value")=="true")))
						{
						dj.byId("intermediary_bank_country_img").set("disabled", true);

					dj.byId("inter_bank_iso_img").set("disabled",true);
						}
					else
						{
						dj.byId("intermediary_bank_country_img").set("disabled", false);

						dj.byId("inter_bank_iso_img").set("disabled",false);

						}
				}
			});
			m.connect("intermediary_bank_swift_bic_code","onChange",_truncateBankName);
			m.connect("intermediary_bank_swift_bic_code","onChange",_matchBicCodes);

			//m.connect("intermediary_bank_name","onChange",_truncateBankName);
			
			m.connect("ordering_customer_bank_swift_bic_code","onChange", _truncateOrderingCustomerBankDetails);
			m.connect("ordering_customer_bank_name","onChange", _truncateOrderingCustomerBankDetails);

			
			m.connect("ordering_institution_swift_bic_code","onChange", _truncateOrderingInstitutionDetails);
			m.connect("ordering_institution_name","onChange", _truncateOrderingInstitutionDetails);

			if(dj.byId("sub_product_code") && dj.byId("sub_product_code").get("value") === "FI202")
			{
				m.connect("beneficiary_swift_bic_code","onChange", _truncateBeneficiaryInstitutionDetails);
				m.connect("beneficiary_name","onChange", _truncateBeneficiaryInstitutionDetails);
			}

			if (dj.byId("sub_product_code")	&& dj.byId("sub_product_code").get("value") === "MT103") {
				m.connect("ft_cur_code", "onChange", m.MT103DetailsBeneficiary);
			}
			if (dj.byId("sub_product_code") && dj.byId("sub_product_code").get("value") === "MT103") {
				m.connect("cpty_bank_country", "onChange", m.MT103ValidCountryCode); // ft_cur_code
			}
			if (dj.byId("sub_product_code") && dj.byId("sub_product_code").get("value") === "MT103") {
				m.connect("intermediary_bank_country", "onChange", m.MT103Intermediarydetailvalidation); //ft_cur_code
			}
			    
			m.connect("entity", "onChange", function(){				
				if(!misys._config.isMultiBank) {
					m.setApplicantReference();
				}
				formLoading = true;
				
				dj.byId("applicant_act_name").set("value", "");
				if(dj.byId("recurring_flag"))
				{
					dj.byId("recurring_flag").set("checked", false);
				}
				
				if(misys._config.isMultiBank && dj.byId("customer_bank")){
					dj.byId("customer_bank").set('disabled', false);
					dj.byId("customer_bank").set("value", "");
					m.populateCustomerBanks();
				}
				if(!misys._config.isMultiBank) {
					m.setApplicantReference();
				}
			});
			
			m.connect("customer_bank", "onChange", function(){
				m.handleMultiBankRecurring(validationFailedOrDraftMode);
				//this is to handle an onchange event which was getting triggered while onformload
				validationFailedOrDraftMode = false;
			});
			
			if(dj.byId("bulk_ref_id") && dj.byId("bulk_ref_id").get("value") !== "" && dj.byId("issuing_bank_abbv_name") && dj.byId("issuing_bank_abbv_name").get('value') !== "")
			{
				m.initializeFX(dj.byId("sub_product_code").get("value"), dj.byId("issuing_bank_abbv_name").get("value"));
				if(dj.byId('applicant_act_cur_code') && dj.byId('applicant_act_cur_code').get('value') !== '' && dj.byId('ft_cur_code') && dj.byId('ft_cur_code').get('value') !== '' && dj.byId('applicant_act_cur_code').get('value')!== dj.byId('ft_cur_code').get('value') && !isNaN(dj.byId("ft_amt").get("value")))
				{
					m.onloadFXActions();
				}
				else
				{
					m.defaultBindTheFXTypes();
				}
				
				_handleFXAction();
			}
			else
			{
				m.connect("customer_bank", "onChange", _handleCusomterBankOnChangeFields);
			}
			
			m.connect("applicant_act_name", "onChange", function() {
				if(dj.byId("customer_bank") && dj.byId("applicant_act_name") && dj.byId("applicant_act_name").get("value") !== "")
				{	
					dj.byId("customer_bank").set("value", m._config.customerBankName);
				}
			});
			
			m.connect("applicant_act_name", "onChange", function(){				
				//d.query("#display_account_row div")[0].innerHTML = dj.byId("applicant_act_name").get("value");
				_applicantAccountChangeHandler();				
			});
			
			m.connect("beneficiary_name", "onBlur", function(){
				var ctpyDetailsName1 = dj.byId("counterparty_details_name_1");
				if (ctpyDetailsName1)
				{
					ctpyDetailsName1.set("value", dj.byId("beneficiary_name").get("value"));	
				}
			});
			
			m.connect("clear_img", "onClick", function(){
				_clearButtonHandler();
				if(dj.byId("notify_beneficiary_email"))
					{
					dj.byId("notify_beneficiary").set("checked", false);
					dj.byId("notify_beneficiary_choice_1").set("checked", false);
					dj.byId("notify_beneficiary_choice_2").set("checked", false);
					dj.byId("notify_beneficiary_choice_1").set("disabled", true);
					dj.byId("notify_beneficiary_choice_2").set("disabled", true);
					dj.byId("notify_beneficiary_email").set("value", "");
					dj.byId("notify_beneficiary_email").set("disabled", true);
					dj.byId("bene_adv_email_no_send").set("value", "");
					dj.byId("bene_adv_email_no_send1").set("value", "");
					}
			});
			
			m.connect("iss_date", "onChange", function(){	
				var dateValue = this.get("value");
				if(dj.byId("request_date")) 
				{
					if(dj.byId("request_date").get("value") === null || m.compareDateFields(dj.byId("request_date"), this)) 
					{
						dj.byId("request_date").set("value", dateValue);
					}
				}
			});
			
			m.connect("ft_cur_code", "onChange", function() {				
				if (dj.byId("charge_act_name"))
				{
					dj.byId("charge_act_name").set("value", "");
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
				m.toggleRequired("beneficiary_bank_clearing_code", false);
				if (clearingCodeField)
				{
					m.toggleRequired("beneficiary_bank_clearing_code", true);
					var clearingCode = clearingCodeField.get("value");
					if (clearindCodeDesc === "")
					{
						m.toggleRequired("beneficiary_bank_clearing_code", false);
					}
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
				m.toggleRequired("intermediary_bank_clearing_code", false);
				if (clearingCodeField)
				{
					m.toggleRequired("intermediary_bank_clearing_code", true);
					var clearingCode = clearingCodeField.get("value");
					if (clearindCodeDesc === "")
					{
						m.toggleRequired("intermediary_bank_clearing_code", false);
					}
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
			
						
			m.connect("applicant_act_pab", "onChange", _applicantAccountPABHandler);
			
			//Bind all recurring payment details fields
			m.bindRecurringFields();
			
			//Binding for Beneficiary Advice
			m.beneAdvBinding();
			m.connect("ft_cur_code", "onBlur", function(){
				m.setCurrency(this, ["ft_amt"]);
			});
			var subProduct = dj.byId("sub_product_code").get("value");
			if(dj.byId("issuing_bank_abbv_name") && dj.byId("issuing_bank_abbv_name").get("value") !== "" && m._config.fxParamData && m._config.fxParamData[subProduct][dj.byId("issuing_bank_abbv_name").get("value")].isFXEnabled === "Y"){
				//Start FX Actions
				m.connect("ft_cur_code", "onBlur", function(){
					m.setCurrency(this, ["ft_amt"]);
					if(dj.byId("ft_cur_code").get("value") !== "" && !isNaN(dj.byId("ft_amt").get("value"))){
						m.fireFXAction();
					}else{
						m.defaultBindTheFXTypes();
					}
				});
				m.connect("ft_cur_code", "onChange", function(){
					m.setCurrency(this, ["ft_amt"]);
					if(dj.byId("ft_cur_code").get("value") !== "" && !isNaN(dj.byId("ft_amt").get("value"))){
						m.fireFXAction();
					}else{
						m.defaultBindTheFXTypes();
					}
					var check_currency = dj.byId('currency_res').get('value');
					if(check_currency==="true")
	        		{
					_compareApplicantAndBenificiaryCurrency();
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
				if(d.byId(fxSection))
					{
						d.style(fxSection,"display","none");
					}
			}
			
			if(dijit.byId("ft_cur_code") && dijit.byId("ft_amt"))
			{
				misys.setCurrency(dijit.byId("ft_cur_code"), ["ft_amt"]);
            }
			m.connect("ft_amt", "onChange", function(){
				var gppFeeConfigFlag = dj.byId("gpp_fee_config_flag") ? dj.byId("gpp_fee_config_flag").get("value") : "false";
				var gppFeeConfigAmtCur = dj.byId("gpp_fee_config_amt_cur_code") ? dj.byId("gpp_fee_config_amt_cur_code").get("value") : "",
				gppFeeConfigAmtValue = dj.byId("gpp_fee_config_amt_val") ? dj.byId("gpp_fee_config_amt_val").get("value") : "";
				if(gppFeeConfigFlag === "true") {
				if(dj.byId("payment_fee_details")) {
					dj.byId("payment_fee_details").set("value", "");
				}
				if(dj.byId("is_view_fees_btn")) {
					dj.byId("is_view_fees_btn").set("value","false");
				}
				if(dj.byId("response_status")) {
					dj.byId("response_status").set("value", "");
				}
				document.getElementById('ft_fee_details_div').style.display = "none";
				m.hideAllDisclaimerMessages();
				
				if(!(dj.byId("recurring_payment_enabled")) || (dj.byId("recurring_payment_enabled") && dj.byId("recurring_payment_enabled").get("checked") === false)) {
				dj.byId("add_fee_details_button").set('disabled', false);
				document.getElementById('FEE_DETAILS_CONFIRMATION_DISCLAIMER').style.display = "block";
				} else if((dj.byId("recurring_payment_enabled") && dj.byId("recurring_payment_enabled").get("checked") === true)) {
					document.getElementById('NO_FEES_FOR_RECCURING_PAYMENT').style.display = "block";	
				}
				}
			});
			
			m.connect("ft_cur_code", "onChange", function(){
				var gppFeeConfigFlag = dj.byId("gpp_fee_config_flag") ? dj.byId("gpp_fee_config_flag").get("value") : "false";
				var gppFeeConfigAmtCur = dj.byId("gpp_fee_config_amt_cur_code") ? dj.byId("gpp_fee_config_amt_cur_code").get("value") : "",
				gppFeeConfigAmtValue = dj.byId("gpp_fee_config_amt_val") ? dj.byId("gpp_fee_config_amt_val").get("value") : "";
				if(gppFeeConfigFlag === "true") {
				if(dj.byId("payment_fee_details")) {
					dj.byId("payment_fee_details").set("value", "");
				}
				if(dj.byId("is_view_fees_btn")) {
					dj.byId("is_view_fees_btn").set("value","false");
				}
				if(dj.byId("response_status")) {
					dj.byId("response_status").set("value", "");
				}
				document.getElementById('ft_fee_details_div').style.display = "none";
				document.getElementById('fee_agent_details_div').style.display = "none";
			    document.getElementById('grand_total_fee_details').style.display = "none";
				m.hideAllDisclaimerMessages();
				
				if(!(dj.byId("recurring_payment_enabled")) || (dj.byId("recurring_payment_enabled") && dj.byId("recurring_payment_enabled").get("checked") === false)) {
				dj.byId("add_fee_details_button").set('disabled', false);
				document.getElementById('FEE_DETAILS_CONFIRMATION_DISCLAIMER').style.display = "block";
				} else if((dj.byId("recurring_payment_enabled") && dj.byId("recurring_payment_enabled").get("checked") === true)) {
					document.getElementById('NO_FEES_FOR_RECCURING_PAYMENT').style.display = "block";	
				}
				}
			});
			
			m.connect("charge_option", "onChange", function(){
				var gppFeeConfigFlag = dj.byId("gpp_fee_config_flag") ? dj.byId("gpp_fee_config_flag").get("value") : "false";
				var gppFeeConfigAmtCur = dj.byId("gpp_fee_config_amt_cur_code") ? dj.byId("gpp_fee_config_amt_cur_code").get("value") : "",
				gppFeeConfigAmtValue = dj.byId("gpp_fee_config_amt_val") ? dj.byId("gpp_fee_config_amt_val").get("value") : "";
				if(gppFeeConfigFlag === "true") {
				if(dj.byId("payment_fee_details")) {
					dj.byId("payment_fee_details").set("value", "");
				}
				if(dj.byId("response_status")) {
					dj.byId("response_status").set("value", "");
				}
				if(dj.byId("is_view_fees_btn")) {
					dj.byId("is_view_fees_btn").set("value","false");
				}
				document.getElementById('ft_fee_details_div').style.display = "none";
				m.hideAllDisclaimerMessages();
				
				if(!(dj.byId("recurring_payment_enabled")) || (dj.byId("recurring_payment_enabled") && dj.byId("recurring_payment_enabled").get("checked") === false)) {
				dj.byId("add_fee_details_button").set('disabled', false);
				document.getElementById('FEE_DETAILS_CONFIRMATION_DISCLAIMER').style.display = "block";
				} else if((dj.byId("recurring_payment_enabled") && dj.byId("recurring_payment_enabled").get("checked") === true)) {
					document.getElementById('NO_FEES_FOR_RECCURING_PAYMENT').style.display = "block";	
				}
				}
			});
		},
		
		showbeneficiary_bankClearingCodeFormat: function() {
			var clearingCodeDesc = dj.byId("beneficiary_bank_clearing_code_desc").get("value");
			if(clearingCodeDesc !== "") 
			{
				var format = m._config.clearingCodesFormat[clearingCodeDesc];
				var regularExpression = m._config.clearingCodesRegExp[clearingCodeDesc];
				if(format !== "") {			
					m.dialog.show("ALERT", m.getLocalization("clearingCodeFormatMessage", [format, regularExpression]));
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
					m.dialog.show("ALERT", m.getLocalization("clearingCodeFormatMessage", [format, regularExpression]));
				}
			}
		},
		
		/*
		showFields : function() {
			var domNode = dj.byId("entity").domNode;
			if(dj.byId("entity").get("value") === "")
			{
				dj.showTooltip(m.getLocalization("remittanceToolTip"), domNode, 0);
				var hideTT = function() {
					dj.hideTooltip(domNode);
				};
				var timeoutInMs = 1000;
				setTimeout(hideTT, timeoutInMs);
				return false;
			}	

			var domNode2 = dj.byId("applicant_act_name").domNode;
			if(dj.byId("applicant_act_name").get("value") === "")
			{
				dj.showTooltip(m.getLocalization("remittanceToolTip"), domNode2, 0);
				var hideTT2 = function() {
					dj.hideTooltip(domNode2);
				};
				var timeoutInMs2 = 1000;
				setTimeout(hideTT2, timeoutInMs2);
				return false;
			}
			m.animate("wipeOut", d.byId("content1"),_showContent2);
			return true;
		},
		*/

		onFormLoad : function() {
			m.setCurrency(dj.byId("ft_cur_code"), ["ft_amt"]);
			
			if(misys._config.nickname==="true" && dj.byId("applicant_act_nickname") && dj.byId("applicant_act_nickname").get("value")!=="" && d.byId("nickname")){
				m.animate("fadeIn", d.byId("nickname"));
				 d.style("nickname","display","inline");
				d.byId("nickname").innerHTML = dj.byId("applicant_act_nickname").get("value");
			}else{
				m.animate("fadeOut", d.byId("applicant_act_nickname_row"));
			}
			
			var modeValue = dijit.byId("mode") ? dijit.byId("mode").get("value") : "";
			if(modeValue === "DRAFT" && dj.byId("beneficiary_name") && dj.byId("applicant_act_pab") && dj.byId("applicant_act_pab").get("value") === "Y" && dj.byId("beneficiary_name").value !== "")
		    {
				if(!m.validateBeneficiaryStatus())
				{	
					dj.byId("beneficiary_name").set("state", "Error");
					dj.showTooltip(m.getLocalization("beneficiaryIsInactive"), dj.byId("beneficiary_name").domNode, 0);
				}
		    }
			
			if(d.byId("recurring_on_div"))
			{
				d.style("recurring_on_div","display","none");
			}
			if(dj.byId("notify_beneficiary") && dj.byId("notify_beneficiary").get("checked") && (modeValue === "DRAFT"))
			{
				var sendNotifyChecked = dj.byId("notify_beneficiary").get("checked");
				m.toggleRequired("notify_beneficiary_email", sendNotifyChecked);
				m.toggleRequired("notify_beneficiary_choice_1", sendNotifyChecked);
				m.toggleRequired("notify_beneficiary_choice_2", sendNotifyChecked);
				if(dj.byId("notify_beneficiary_choice_1").get("checked"))
				{
					var notifyEmailDOM = d.byId("notify_beneficiary_email_node");
					var notifyRadio2DOM = d.byId("label_notify_beneficiary_choice_2");	
					_changeBeneficiaryNotificationEmail();
					if (dj.byId("notify_beneficiary_choice_2").get("checked"))
					{
						d.place(notifyEmailDOM, notifyRadio2DOM, "after");
					}
				}
			}
			
			if(dj.byId("customer_bank") && dj.byId("customer_bank").get("value") !== '' && misys && misys._config && misys._config.businessDateForBank && misys._config.businessDateForBank[dj.byId("customer_bank").get("value")] && misys._config.businessDateForBank[dj.byId("customer_bank").get("value")][0] && misys._config.businessDateForBank[dj.byId("customer_bank").get("value")][0].value !== '')
			{
				var date = misys._config.businessDateForBank[dj.byId("customer_bank").get("value")][0].value;
				var yearServer = date.substring(0,4);
				var monthServer = date.substring(5,7);
				var dateServer = date.substring(8,10);
				date = dateServer + "/" + monthServer + "/" + yearServer;
				var date1 = new Date(yearServer, monthServer - 1, dateServer);
				if(dj.byId("option_for_tnx") && dj.byId("option_for_tnx").get("value") === 'SCRATCH')
				{
					dj.byId("appl_date").set("value", date);
					document.getElementById('appl_date_view_row').childNodes[1].innerHTML = date;
					if(dj.byId("appl_date_hidden")){
						dj.byId("appl_date_hidden").set("value", date1);
					}
				}
				if(dj.byId("todays_date"))
				{
					dj.byId("todays_date").set("value", date1);
				}
			}
			
			m.checkBeneficiaryNicknameOnFormLoad();
			
			if(misys._config.isMultiBank)
			{
				m.populateCustomerBanks(true);
				
				var entityField = dj.byId("entity");
				var linkedBankField = dj.byId("customer_bank");
				//Enable bank name drop down if it is non entity multi bank customer
				if(!entityField && linkedBankField)
				{
					linkedBankField.set('disabled', false);
					linkedBankField.set('required', true);
				}
								
				var linkedBankHiddenField = dj.byId("customer_bank_hidden");
				if(linkedBankField && linkedBankHiddenField)
				{
					linkedBankField.set("value", linkedBankHiddenField.get("value"));
				}
				if(d.byId("server_message") && d.byId("server_message").innerHTML !== "" || dijit.byId("option_for_tnx") && (dijit.byId("option_for_tnx").get("value") === "REMITTANCE_CORP" || dijit.byId("option_for_tnx").get("value") === "REMITTANCE_FI" || dijit.byId("option_for_tnx").get("value") === "TEMPLATE"))
				{
					validationFailedOrDraftMode = true;
				}
				if(dj.byId("issuing_bank_abbv_name") && dj.byId("issuing_bank_abbv_name").get("value") !== "")
				{
					hasCustomerBankValue = true;
					formLoading = true;
					linkedBankField.set("value", dj.byId("issuing_bank_abbv_name").get("value"));
					linkedBankHiddenField.set("value", dj.byId("issuing_bank_abbv_name").get("value"));
				}
				if(misys._config.perBankRecurringAllowed && dojo.byId("recurring_payment_checkbox") && dj.byId("customer_bank"))
				{
					if(dj.byId("customer_bank").get("value") === "")
						{
							m.animate("fadeOut", dojo.byId("recurring_payment_checkbox"));
						}
					else if(dj.byId("customer_bank").get("value") !== "" && misys._config.perBankRecurringAllowed[dj.byId("customer_bank").get("value")] !== "Y")
						{
							m.animate("fadeOut", dojo.byId("recurring_payment_checkbox"));
						}
				}
				if(entityField && entityField.get("value") === "" && linkedBankField)
				{
					linkedBankField.set("disabled",true);
					linkedBankField.set("required",false);
				}
				if(dijit.byId("recurring_frequency") && dijit.byId("customer_bank").get("value") !== "" && misys._config.perBankFrequency)
				{
					var frequencyStore = misys._config.perBankFrequency[dijit.byId("customer_bank").get("value")];
					if(frequencyStore)
						{
							dijit.byId("recurring_frequency").store = new dojo.data.ItemFileReadStore(
									{
										data :
										{
											identifier : "value",
											label : "name",
											items : frequencyStore
										}
									});
							dijit.byId("recurring_frequency").fetchProperties =
							{
								sort : [
								{
									attribute : "name"
								} ]
							};
						
						}
					dijit.byId("recurring_frequency").set("value",dijit.byId("recurring_frequency")._lastQuery);
				}
			}	
			else {
				m.setApplicantReference();
			}
			
			d.forEach(d.query(".remittanceDisclaimer"),function(node){
				var productDisclaimer = dj.byId("sub_product_code").get("value")+"_"+m.getLocalization("disclaimer");
					if(dj.byId("sub_product_code") && (node.id == productDisclaimer))
					{
						m.animate("fadeIn", productDisclaimer);
					}					
				});
			_populateClearingCodes("beneficiary");
			_populateClearingCodes("intermediary");
			_swiftClearBeneficiaryAddressFields();
			
			if(dj.byId("ordering_institution_swift_bic_code")){
				_swiftClearOrderingInstitutionDetails();
			}
			
			if(dj.byId("ordering_customer_bank_swift_bic_code")){
				_swiftClearOrderingBankDetails();	
			}
			
			_swiftClearIntermediaryBankDetails();
			
			//_onLoadBranchAddress();
			if(dj.byId("branch_address_flag"))
			{
				if(dj.byId("cpty_bank_swift_bic_code") && dj.byId("cpty_bank_swift_bic_code").get("value").length === 0)
				{
					dj.byId("branch_address_flag").set("checked", false);
					dj.byId("branch_address_flag").set("readOnly", true);
				}
				else
				{
					dj.byId("branch_address_flag").set("readOnly", false);
					if(dj.byId("branch_address_flag").get("checked"))
					{
						m.toggleRequired("beneficiary_bank_branch_address_line_1", true);
					}
					else
					{
						m.toggleRequired("beneficiary_bank_branch_address_line_1", false);
					}
					
				}
			}
			_onPreApprovedChangeToggleBranchAdress();

			

			m.initForm();
			
			if (dj.byId("beneficiary_swift_bic_code")){
				_swiftClearBeneficiaryInstitutionDetails();
			}

			if (dj.byId("recurring_payment_enabled") && dj.byId("recurring_payment_enabled").get("checked"))
			{
				dj.byId("recurring_flag").set("checked", true);
			    //this is to mark recurring fields mandatory if recurring is enabled
				m._config.clearOnSecondCall = true; 
				m.showSavedRecurringDetails(false);
				d.style("recurring_payment_div","display","block");
			}
			else
			{
				if(d.byId("recurring_payment_div"))
				{
					d.style("recurring_payment_div","display","none");
				}
				m.hasRecurringPayment();
				m.showSavedRecurringDetails(false);
			}
			
			m.toggleSections();
			m.showRecurring();
			
			//Beneficiary Advice Field's Parameter Configurations
			m.handleParametersConfigurations();
			
			//Beneficiary Advice Form Load Actions
			m.beneAdvFormLoad();
			
			//hide fx section by default
			
			if (!m._config.isMultiBank && dj.byId("issuing_bank_abbv_name") && dj.byId("issuing_bank_abbv_name").get("value") !== "" && m._config.fxParamData && dj.byId("sub_product_code") && dj.byId("sub_product_code").get("value") !== "" && dj.byId("sub_product_code").get("value") !== "IBG")
			{
				m.initializeFX(dj.byId("sub_product_code").get("value"), dj.byId("issuing_bank_abbv_name").get("value"));
				if(dj.byId("applicant_act_cur_code") && dj.byId("applicant_act_cur_code").get("value") !== "" && dj.byId("ft_cur_code") && dj.byId("ft_cur_code").get("value") !== "" && dj.byId("applicant_act_cur_code").get("value")!== dj.byId("ft_cur_code").get("value") && dj.byId("ft_amt") && !isNaN(dj.byId("ft_amt").get("value")))
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
			if(d.byId(fxSection))
			{
				//In case of bulk, from template will have amount and currency values on load, hence show fx section
				if(dj.byId("bulk_ref_id").get("value") !== "" && dj.byId("ft_cur_code").get("value") !== ""&& !isNaN(dj.byId("ft_amt").get("value")))
				{
					m.initializeFX(dj.byId("sub_product_code").get("value"), dj.byId("issuing_bank_abbv_name").get("value"));
					m.fireFXAction();
				}	
				else
				{
					//show fx section if previously enabled (in case of draft)
					if((dj.byId("fx_exchange_rate_cur_code") && dj.byId("fx_exchange_rate_cur_code").get("value")!== "")|| (dj.byId("fx_total_utilise_cur_code") && dj.byId("fx_total_utilise_cur_code").get("value")!== ""))
					{
						m.animate("wipeIn", d.byId(fxSection));
									
					}
					else
					{
						d.style(fxSection,"display","none");
					}
				}
			}
		
			
			//validate processing date 
			if ((dj.byId("iss_date") && dj.byId("iss_date").get("value") !== "") && (dj.byId("iss_date").get("value") !== null))
			{
				m.validateTransferDateWithCurrentDate(dj.byId("iss_date"));
			}
			
			if (dj.byId("sub_product_code") && dj.byId("sub_product_code").get("value") === "MT103"){
				m.MT103DetailsBeneficiary();
			}
			if (dj.byId("sub_product_code") && dj.byId("sub_product_code").get("value") === "MT103"){
				m.MT103ValidCountryCode();
			}
			if (dj.byId("sub_product_code") && dj.byId("sub_product_code").get("value") === "MT103" && misys._config.mt103_intermediary_details){
				m.MT103Intermediarydetailvalidation();
			}
			if (dj.byId("sub_product_code") && dj.byId("sub_product_code").get("value") === "MT103"){
				m.validateRemittanceReasonCode();			   
			}	
			
			populateDebitAccountDetails();
			if (dj.byId("sub_product_code") && dj.byId("sub_product_code").get("value") === "MT103"){
				var gppFeeConfigFlag = dj.byId("gpp_fee_config_flag") ? dj.byId("gpp_fee_config_flag").get("value") : "false";
				if(dj.byId("ft_amt") && dj.byId("ft_amt").get("value") != "")
		    	 {
					var ftAmt = (dojo.number.parse(dj.byId("ft_amt").get("value")) > 0)?dojo.number.parse(dj.byId("ft_amt").get("value")):0 ;
		    	 }
				 if((dj.byId("recurring_payment_enabled") && dj.byId("recurring_payment_enabled").get("checked") == true) && gppFeeConfigFlag === "true") {
					 document.getElementById('ftFeeFetails').style.display = "block";
					 document.getElementById('ft-fee-details-template').style.display = "block";
					 document.getElementById('NO_FEES_FOR_RECCURING_PAYMENT').style.display = "block";
					 m.hideFeeDetailsForError();
				} else {
				if(gppFeeConfigFlag === "true") {
					document.getElementById('ftFeeFetails').style.display = "block";
					document.getElementById('ft-fee-details-template').style.display = "block";
					document.getElementById('FEE_DETAILS_CONFIRMATION_DISCLAIMER').style.display = "block";
					 if(modeValue === "DRAFT" && ftAmt > 0) {
						if(dj.byId("is_view_fees_btn")) {
							dj.byId("is_view_fees_btn").set("value","false");
						}
					}
				}
				}
			}
		}, 

		initForm : function(){
			//To make "SHA" as default charging option
			if(dj.byId("charge_option") && dj.byId("charge_option").get("value") === "")
			{
				dj.byId("charge_option").set("value","SHA");
			}
			if(dj.byId("sub_product_code").get("value") === "MT101"){
				beneficiary.initMT101();
			}
			if(dj.byId("sub_product_code").get("value") === "MT103" && misys._config.mt103_intermediary_details){
				beneficiary.initMT103();
			}
			if(dj.byId("sub_product_code").get("value") === "FI202"){
				beneficiaryFI202.initFI202();
			}
			// Control initial visibility of the Clear button based on selected debit account
			var applicantAcctPAB = dj.byId("applicant_act_pab").get("value");
			if(d.byId("clear_img"))
			{
				if(applicantAcctPAB == 'Y' && d.style(d.byId("clear_img"),"display") !== "none")
				{
					m.animate("wipeOut", d.byId('clear_img'));
					dj.byId("clear_img").setAttribute('disabled', true);
					console.log("Selected debit account is PAB. Hiding and Disabling clear button ");
				}
			}
			if(d.byId("beneficiary_iso_img"))
			{
				if(applicantAcctPAB === 'Y' && d.style(d.byId("beneficiary_iso_img"),"display") !== "none")
				{
					m.animate("wipeOut", d.byId('beneficiary_iso_img'));
					dj.byId("beneficiary_iso_img").setAttribute('disabled', true);
					console.log("Selected debit account is PAB. Hiding and Disabling clear button ");
				}
			}
		},
		setCustomConfirmMessage : function(){
	     	var modeValue = dijit.byId("mode") ? dijit.byId("mode").get("value") : "";
	     	var subPdtCode = dj.byId("sub_product_code") ? dj.byId("sub_product_code").get("value") : "";
	     	 if(modeValue === "DRAFT" && subPdtCode === "MT103")
    		 {	
	     		var  hostResponse ;
	     		var gppFeeConfigFlag = dj.byId("gpp_fee_config_flag") ? dj.byId("gpp_fee_config_flag").get("value") : "false";
	     		if(dj.byId("response_status")) {
	     			hostResponse = dj.byId("response_status").get("value");
				}
	     		if(gppFeeConfigFlag === "true" && (hostResponse != "200") && hostResponse != "")
	    		{
	    			var amountMsg = m.getLocalization("getFeeErrorResponse");
					m._config.globalSubmitConfirmationMsg = amountMsg;
	    		}
	    		else
	    		{
	    			var submitMsg = m.getLocalization("submitTransactionConfirmation");
	    			m._config.globalSubmitConfirmationMsg = submitMsg;
	    		}
    		 }
		},
		beforeSaveValidations : function(){
			if(dj.byId("payment_fee_details")) {
				dj.byId("payment_fee_details").set("value", "");
			}
		      var entity = dj.byId("entity") ;
		      if(entity && entity.get("value")== "")
	          {
	                  return false;
	          }
	                  return true;
	      },
		
		beforeSubmitValidations : function() 
		{
			var modeValue = dijit.byId("mode") ? dijit.byId("mode").get("value") : "";
			
			var field2 = dj.byId("ft_cur_code");
			if(field2 && modeValue == "DRAFT" && !m.MT103Intermediarydetailvalidation()){
				var countryField = dj.byId("intermediary_bank_country");
				var	errorMsg = countryField.value+": is not valid Country Code";
					countryField.set("state", "Error");
					dj.showTooltip(errorMsg,countryField.domNode, 0);
                  return false;
			}
			var displayMessage = "";
			if( modeValue == "DRAFT" && !m._validateCurrencyCode(dj.byId("sub_product_code"),dj.byId("ft_cur_code")))
            {
				displayMessage = m.getLocalization("invalidCurrencyConfigured", [dj.byId("ft_cur_code").get("value")]);
				
                 //  field2.focus();
                   field2.set("state", "Error");
					dj.showTooltip(displayMessage,dj.byId("ft_cur_code").domNode, 0);
                   return false;
            }
			if(dj.byId("intermediary_bank_swift_bic_code") && dj.byId("intermediary_bank_swift_bic_code").get("value") !== "" && !_matchBicCodes()) {
				return false;
			}
			if((dj.byId("beneficiary_account")) && (dj.byId("beneficiary_account").get("value") !== "")) 
			{
				//To make sure validation does not happen during unsigned mode
				var account 		= dj.byId("beneficiary_account").get("value"),
					clearingCodeDesc 	= "",
					clearingCode 	= "";
				//Clearing code validation
				if(dj.byId("beneficiary_bank_clearing_code_desc"))
				{
					clearingCodeDesc = dj.byId("beneficiary_bank_clearing_code_desc").get("value");
				}
				var clearingCodeField = dj.byId("beneficiary_bank_clearing_code");
				var intermediateBankclearingCodeDescField = dj.byId("intermediary_bank_clearing_code_desc");
				var intermediateBankclearingCodeField = dj.byId("intermediary_bank_clearing_code");
				_populateSupportedClearing();
				if ((clearingCodeDesc === "" && clearingCodeField && clearingCodeField.get("value") !== "") || (clearingCodeDesc !== "" && clearingCodeField && clearingCodeField.get("value") === ""))
				{
					displayMessage = m.getLocalization("CCValidationInvalidClearingCodeDescriptionError");
		  			m._config.onSubmitErrorMsg = displayMessage;
		  			clearingCodeField.focus();
		  			clearingCodeField .set("state", "Error");
		  			return false;
				}
				else if ((intermediateBankclearingCodeDescField && intermediateBankclearingCodeDescField.get("value") === "" && intermediateBankclearingCodeField && intermediateBankclearingCodeField.get("value") !== "") || (intermediateBankclearingCodeDescField && intermediateBankclearingCodeDescField.get("value") !== "" && intermediateBankclearingCodeField && intermediateBankclearingCodeField.get("value") === ""))
				{
					displayMessage = m.getLocalization("CCValidationInvalidClearingCodeDescriptionError");
		  			m._config.onSubmitErrorMsg = displayMessage;
		  			intermediateBankclearingCodeField.focus();
		  			dj.byId("intermediary_bank_clearing_code").set("state", "Error");
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
					  	catch (err)
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
						if (clearingCode === "")
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
					  	catch (err)
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
						if ((clearingCode !== ""))
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
						  	catch (err)
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
					 else if (clearingCode !== "" || clearingCodeDesc !== "") 
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
			    	m._config.onSubmitErrorMsg =  displayMessage;
		  			clearingCodeField.focus();
		  			clearingCodeField .set("state", "Error");
			    	return false;
			    }
					  
				//IBAN validation
				if(dj.byId("cpty_bank_country"))
				{
					var country = dj.byId("cpty_bank_country").get("value");
					var currency = dj.byId("ft_cur_code").get("value");			
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
			}
			// Validate the beneficiary only in case the account is PAB
			if(modeValue === "DRAFT" && dj.byId("applicant_act_pab") && dj.byId("applicant_act_pab").get("value") === "Y" && !m.validateBeneficiaryStatus())
		    {
	    		 m._config.onSubmitErrorMsg =  m.getLocalization("beneficiaryIsInactive");
	    		 dj.byId("beneficiary_name").set("state", "Error");
	    		 return false;
		    }
			
			// Validate transfer amount should be greater than zero
			if(dj.byId("ft_amt"))
			{
				if(!m.validateAmount((dj.byId("ft_amt"))?dj.byId("ft_amt"):0))
				{
					m._config.onSubmitErrorMsg =  m.getLocalization("amountcannotzero");
					dj.byId("ft_amt").set("value", "");
					return false;
				}
			}   
			
	    	 var toCurrencyAmount = 0,toCurrency = "" ;
		    	if(dj.byId("to_currency_amount")) {
					toCurrencyAmount = dj.byId("to_currency_amount").get("value");
				}	
		    	if(dj.byId("to_currency")) {
					toCurrency = dj.byId("to_currency").get("value");
				}
	    	 var gppFeeConfigFlag = dj.byId("gpp_fee_config_flag") ? dj.byId("gpp_fee_config_flag").get("value") : "false";
			 	var gppFeeConfigAmtCur = dj.byId("gpp_fee_config_amt_cur_code") ? dj.byId("gpp_fee_config_amt_cur_code").get("value") : "",
		    	gppFeeConfigAmtValue = dj.byId("gpp_fee_config_amt_val") ? dj.byId("gpp_fee_config_amt_val").get("value") : "";
		    	if(gppFeeConfigFlag === "true" && ((((gppFeeConfigAmtCur === dj.byId("ft_cur_code").get("value"))|| gppFeeConfigAmtCur === '*') && (gppFeeConfigAmtValue >= dj.byId("ft_amt").get("value"))) || ((gppFeeConfigAmtCur === toCurrency) && ((dojo.number.parse(gppFeeConfigAmtValue)) >= toCurrencyAmount))))	
		    	{
					if(dj.byId("payment_fee_details")) {
						dj.byId("payment_fee_details").set("value", "");
					}
				}
		    		
		if((dj.byId("recurring_flag") && dj.byId("recurring_flag").get("checked") === false) && gppFeeConfigFlag === "true"){
	    	 if(dj.byId("is_view_fees_btn") && dj.byId("is_view_fees_btn").get("value") != "true") {
				if(((gppFeeConfigAmtCur === dj.byId("ft_cur_code").get("value"))|| gppFeeConfigAmtCur === '*') || (gppFeeConfigAmtCur != dj.byId("ft_cur_code").get("value"))) {
					if((dj.byId("payment_fee_details")) && dj.byId("payment_fee_details").get("value") === "") {
						m._config.onSubmitErrorMsg =  m.getLocalization("feeChargesAreNotAccurate");
						return false;
					}
				}
	    	 }
	    	 }
			 //Validate Recurring payment details prior to transaction submit
	    	 if(!m.isRecurringDetailsValidForSubmit())
	   		 {
	    		 return false;
	   		 }
			
			if(dj.byId("issuing_bank_abbv_name") && dj.byId("issuing_bank_abbv_name").get("value") !== "" && m._config.fxParamData && m._config.fxParamData[dj.byId("sub_product_code").get("value")][dj.byId("issuing_bank_abbv_name").get("value")].isFXEnabled === "Y"){
				if(!m.fxBeforeSubmitValidation())
				{
					return false;
				}
				if(!_preSubmissionFXValidation())
				{
					return false;
				}
			}
			
				
			if(dj.byId("sub_product_code").get("value") === "FI103" || dj.byId("sub_product_code").get("value") === "MT103"){
				if(dj.byId("charge_act_cur_code") && dj.byId("base_cur_code") && (dj.byId("charge_act_cur_code").get("value")) !== "" && (dj.byId("charge_act_cur_code").get("value") !== dj.byId("base_cur_code").get("value") &&
						dj.byId("charge_act_cur_code").get("value") !== dj.byId("ft_cur_code").get("value")))
				{
					m._config.onSubmitErrorMsg =  m.getLocalization("invalidDebitChargeAccount", [ dj.byId("charge_act_name").get("value") ]);
					return false;
				}
			}
			
			/*
			 * Mandatory remittance description common fix given
			 * 
			 */
			
			if(dijit.byId("remittance_description"))
				{
				 if(dijit.byId("remittance_description").get("required")){
					 var val = dijit.byId("remittance_description").get("displayedValue").trim();
					 if(val.length === 0)
						 {
						 dj.byId("remittance_description").set("value", "");
	    				 dj.byId("remittance_description").set("state", "Error");
	    				 return false;
						 }
				}
				}
			
			 /**	MPS-59385 : Mandatory payment narrative blank spaces validation		*/
	    	 if(dijit.byId("payment_details_to_beneficiary"))
	    	 {
	    		 if(dijit.byId("payment_details_to_beneficiary").get("required")){
	    			 var value = dijit.byId("payment_details_to_beneficiary").get("value").trim();
	    			 if(value.length === 0){
						 dj.byId("payment_details_to_beneficiary").set("value", "");
	    				 dj.byId("payment_details_to_beneficiary").set("state", "Error");
	    				 return false;
	    			 }
	    		 }
	    	 }
	    	 var accNo = dj.byId("applicant_act_no").get("value");
	    	 var isAccountActive = m.checkAccountStatus(accNo);
	    	 if(!isAccountActive){
	    		 m._config.onSubmitErrorMsg = misys.getLocalization('accountStatusError');
					return false;
	     	 }
			if (!dj.byId("bulk_ref_id").get("value"))
			{
				if(!m.beneAdvBeforeSubmitValidation())
				{
					return false;
				}
				
				var valid = false;
		        if(modeValue === "DRAFT")
		        {
		        	if (dj.byId("recurring_payment_enabled") && dj.byId("recurring_payment_enabled").get("checked"))
		        	{
		        		valid =  m.validateHolidaysAndCutOffTime("issuing_bank_abbv_name","sub_product_code",modeValue,["Start Date"],["recurring_start_date"],"entity","ft_cur_code","ft_amt");
		        	}
		        	else
		        	{
		        		if(dijit.byId("sub_product_code_unsigned").get("value") === "MT101")
		        		{
		        			valid =  m.validateHolidaysAndCutOffTime("issuing_bank_abbv_name","sub_product_code",modeValue,[processingDate,"Request Date"],["iss_date","request_date"],"entity","ft_cur_code","ft_amt");
		        		}
		        		else
		        		{
		        			valid =  m.validateHolidaysAndCutOffTime("issuing_bank_abbv_name","sub_product_code",modeValue,[processingDate],["iss_date"],"entity","ft_cur_code","ft_amt");
		        		}
		        	}
		    	    
		        }
		        else if(modeValue === "UNSIGNED")
		        {
		        	if (dj.byId("recurring_payment_enabled") && dj.byId("recurring_payment_enabled").get("value") === "Y")
		        	{
		        		valid =  m.validateHolidaysAndCutOffTime("issuing_bank_abbv_name","sub_product_code_unsigned",modeValue,["Start Date"],["recurring_start_date_unsigned"],"display_entity_unsigned","ft_cur_code_unsigned","ft_amt_unsigned");
		        	}
		        	else
		        	{
		        		if(dijit.byId("sub_product_code_unsigned").get("value") === "MT101")
		        		{
		        			valid =  m.validateHolidaysAndCutOffTime("issuing_bank_abbv_name","sub_product_code_unsigned",modeValue,[processingDate,"Request Date"],["iss_date_unsigned","request_date_unsigned"],"display_entity_unsigned","ft_cur_code_unsigned","ft_amt_unsigned");
		        		}
		        		else
		        		{
		        			valid =  m.validateHolidaysAndCutOffTime("issuing_bank_abbv_name","sub_product_code_unsigned",modeValue,[processingDate],["iss_date_unsigned"],"display_entity_unsigned","ft_cur_code_unsigned","ft_amt_unsigned");
		        		}
		        			
		           	}	    	   
		        }
		        else
		        {
		    	    m._config.onSubmitErrorMsg = m.getLocalization("technicalErrorWhileValidatingBusinessDays");
					console.debug("Mode is unknown to validate Holidays and Cut-Off Time");
					valid =  false;
		        }
		        //Beneficiary Advice Before Submit Validations 
		        if(valid)
		        {
		    	   m._config.holidayCutOffEnabled = false;
		        }
		        return valid;
			}
			else
			{
				return true;
			}
		},
		
		preDisplayAssigneeType : function(/*Array of Objects*/ assigneeTypeFields){
	    	 var taskMode = m._config.task_mode || "userandbank";
	    	 dojo.forEach(assigneeTypeFields, function(fieldObj){
	    		if(fieldObj.description === "user_to_bank" && dj.byId(fieldObj.id))
	    		{
	    			if(taskMode === "userandbank")
	    			{
	    				dj.byId(fieldObj.id).set('disabled', false);
	    			}
	    			else
	    			{
	    				dj.byId(fieldObj.id).set('disabled', true);
	    				console.info("Tasks for Bank is not allowed. Disabling the radio button.");
	    			}	
	    		}	 
	    	});
	     }
	});

})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.cash.create_remittance_client');