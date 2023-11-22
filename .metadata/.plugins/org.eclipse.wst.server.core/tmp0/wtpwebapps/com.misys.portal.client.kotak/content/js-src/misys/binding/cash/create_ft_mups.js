/*
 * ---------------------------------------------------------- 
 * Event Binding for domestic transfers
 * 
 * Copyright (c) 2000-2o18 Finastra (http://www.misys.com), All Rights Reserved.
 * 
 * version: 1.0 date: 07/11/2018
 * 
 * ----------------------------------------------------------
 */
dojo.provide("misys.binding.cash.create_ft_mups");

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
dojo.require("misys.binding.common.create_fx_multibank"   );

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode
	var fxMsgType = d.byId("fx-message-type");
	var hasCustomerBankValue = false;
	var formLoading = true;
	var validationFailedOrDraftMode = false;
	var fxSection = "fx-section";
	function _clearRequiredFields(message)
	{
		var callback = function() {
			var widget = dijit.byId("ft_amt");
		 	widget.set("state","Error");
	 		m.defaultBindTheFXTypes();
		 	dj.byId("ft_amt").set("value", "");
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
	
	function _validateDescriptionAddress()
	{  
		 var isValid = true;
		   var errorMessage=null;
		   if((dj.byId("mups_description_address_line_4") && dj.byId("mups_description_address_line_4").get("value") !== "") && (((dj.byId("mups_description_address_line_1") && dj.byId("mups_description_address_line_1").get("value") == "")) || ((dj.byId("mups_description_address_line_2") && dj.byId("mups_description_address_line_2").get("value") == "")) || ((dj.byId("mups_description_address_line_3") && dj.byId("mups_description_address_line_3").get("value") == "")))){
	  			errorMessage = m.getLocalization("invaliddescriptionaddress");
	  			isValid = false;
			    if(dj.byId("mups_description_address_line_3").get("value") == ""){
		           dj.byId("mups_description_address_line_3").set("state","Error");
		         }else if(dj.byId("mups_description_address_line_2").get("value") == ""){
			    	dj.byId("mups_description_address_line_2").set("state","Error"); 
			     }else if(dj.byId("mups_description_address_line_1").get("value") == ""){
			    	dj.byId("mups_description_address_line_1").set("state","Error"); 
			     }
			     return isValid;
		 }else if((dj.byId("mups_description_address_line_3") && dj.byId("mups_description_address_line_3").get("value") !== "") && (((dj.byId("mups_description_address_line_1") && dj.byId("mups_description_address_line_1").get("value") == "")) || ((dj.byId("mups_description_address_line_2") && dj.byId("mups_description_address_line_2").get("value") == "")))){
			 errorMessage = m.getLocalization("invaliddescriptionaddress");
			 isValid = false;
			 if(dj.byId("mups_description_address_line_2").get("value") == ""){
			    	dj.byId("mups_description_address_line_2").set("state","Error"); 
			    }else if(dj.byId("mups_description_address_line_1").get("value") == ""){
			    	dj.byId("mups_description_address_line_1").set("state","Error"); 
			     }
			     return isValid;
		 
	 }else if((dj.byId("mups_description_address_line_2") && dj.byId("mups_description_address_line_2").get("value") !== "") && (dj.byId("mups_description_address_line_1") && dj.byId("mups_description_address_line_1").get("value") == "")){
		 errorMessage = m.getLocalization("invaliddescriptionaddress");
		 isValid = false;
		 if(dj.byId("mups_description_address_line_1").get("value") == ""){
		    	dj.byId("mups_description_address_line_1").set("state","Error"); 
		     }
		     return isValid;
  		 
  	 }
		
	   return isValid;
	}
    function _validateBankIFSCCode()
	{
			//  summary: 
			//  If clearing code and bank ifsc code both are populated then validate bank ifsc code
			var clearing_code_field = dj.byId("clearing_code"),
				bank_code_field	=	dj.byId("cpty_bank_swift_bic_code"),
				bank_name_field = dj.byId("cpty_bank_name"),
				bank_address_line_1_field = dj.byId("cpty_bank_address_line_1"),
				bank_address_line_2_field = dj.byId("cpty_bank_address_line_2"),
				bank_dom_field = dj.byId("cpty_bank_dom"),
				displayMessage  = 	"";
			
			if(clearing_code_field && bank_code_field)
			{
				if(clearing_code_field.get("value") !== "" && bank_code_field.get("value") !== "")
				{
					m.xhrPost( {
						url 		: misys.getServletURL("/screen/AjaxScreen/action/ValidateBankIFSCCodeAction") ,
						handleAs 	: "json",
						sync 		: true,
						content 	: {
							clearing_code : clearing_code_field.get("value"),
							bank_code     : bank_code_field.get("value")
						},
						load : function(response, args){
							if (response.items.valid === false){
								if(response.items.clearCode === '02'){
									if(dj.byId("pre_approved") && dj.byId("pre_approved").get("value") !== ""){
										displayMessage = misys.getLocalization("invalidIFSCNEFTbeneficairy");
									}
									else if( (dj.byId("pre_approved") && dj.byId("pre_approved").get("value") === "") || (dj.byId("pre_approved") && dj.byId("pre_approved").get("value") === null)){
										displayMessage = misys.getLocalization("ifscCodeValidationFailed");
									}
									bank_code_field.set("state","Error");
									dj.showTooltip(displayMessage, bank_code_field.domNode, 0);
									var hideTT = function() {
										dj.hideTooltip(bank_code_field.domNode);
									};
									setTimeout(hideTT, 5000);
								}
								else{
									if(dj.byId("pre_approved") && dj.byId("pre_approved").get("value") !== ""){
										displayMessage = misys.getLocalization("invalidIFSCRTGSbeneficairy");
									}
									else if( (dj.byId("pre_approved") && dj.byId("pre_approved").get("value") === "") || (dj.byId("pre_approved") && dj.byId("pre_approved").get("value") === null)){
										displayMessage = misys.getLocalization("ifscCodeValidationFailed");
									}
									bank_code_field.set("state","Error");
									dj.showTooltip(displayMessage, bank_code_field.domNode, 0);
									var hideTTp = function() {
										dj.hideTooltip(bank_code_field.domNode);
									};
									setTimeout(hideTTp, 5000);
								}
							}
							else
							{
								console.debug("Validated Bank IFSC Code");
								if(response.items.valid === true && bank_code_field.state === "Error"){
									bank_code_field.state = "";
									bank_code_field._setStateClass();
								    dj.hideTooltip(bank_code_field.domNode);
								}
								if( (dj.byId("pre_approved") && dj.byId("pre_approved").get("value") === "") || (dj.byId("pre_approved") && dj.byId("pre_approved").get("value") === null)){
									bank_code_field.set("value", response.items.bankCode);
									bank_name_field.set("value", response.items.bankName);
									bank_address_line_1_field.set("value", response.items.bankAddressLine1);
									bank_address_line_2_field.set("value", response.items.bankAddressLine2);
									bank_dom_field.set("value", response.items.bankCity);
								}
							}
						},
						error 		: function(response, args){
							console.error("[Could not validate Bank IFSC Code] "+ bank_code_field.get("value"));
							console.error(response);
						}
					});
				}
			  
			  else
			  {
					bank_name_field.set("value", "");
					bank_address_line_1_field.set("value", "");
					bank_address_line_2_field.set("value", "");
					bank_dom_field.set("value", "");
			  }
			}
	}
    
    function _validateIFSCOnClearingCode(){

		//  summary: 
		//  Ajax action to validate the IFSC code when changing clearing code.
		var clearing_code_field = dj.byId("clearing_code"),
			bank_code_field	=	dj.byId("cpty_bank_swift_bic_code"),
			bank_name_field = dj.byId("cpty_bank_name"),
			bank_address_line_1_field = dj.byId("cpty_bank_address_line_1"),
			bank_address_line_2_field = dj.byId("cpty_bank_address_line_2"),
			bank_dom_field = dj.byId("cpty_bank_dom"),
			displayMessage  = 	"";
		var valid = false;
		
		if(clearing_code_field && bank_code_field)
		{
			if(!(clearing_code_field.get("value") === "" && bank_code_field.get("value") === ""))
			{
				m.xhrPost( {
					url 		: misys.getServletURL("/screen/AjaxScreen/action/ValidateBankIFSCCodeAction") ,
					handleAs 	: "json",
					sync 		: true,
					content 	: {
						clearing_code : clearing_code_field.get("value"),
						bank_code     : bank_code_field.get("value")
					},
					load : function(response, args){
						valid = response.items.valid;
						if (response.items.valid === false){
							if(response.items.clearCode === '02'){
								displayMessage = misys.getLocalization("ifscCodeValidationFailed");
								bank_code_field.set("state","Error");
								dj.showTooltip(displayMessage, bank_code_field.domNode, 0);
								var hideTT = function() {
									dj.hideTooltip(bank_code_field.domNode);
								};
								setTimeout(hideTT, 5000);
							}
							else{
								displayMessage = misys.getLocalization("ifscCodeValidationFailed");
								bank_code_field.set("state","Error");
								dj.hideTooltip(bank_code_field.domNode);
								dj.showTooltip(displayMessage, bank_code_field.domNode, 0);
								var hideTTp = function() {
									dj.hideTooltip(bank_code_field.domNode);
								};
								setTimeout(hideTTp, 5000);

							}
						}
						else
						{
							console.debug("Validated Bank IFSC Code");
							if(response.items.valid === true && bank_code_field.state === "Error"){
								bank_code_field.state = "";
								bank_code_field._setStateClass();
							    dj.hideTooltip(bank_code_field.domNode);
							}
							if((dj.byId("pre_approved") && dj.byId("pre_approved").get("value") === "") || (dj.byId("pre_approved") && dj.byId("pre_approved").get("value") === null)){
								bank_code_field.set("value", response.items.bankCode);
								bank_name_field.set("value", response.items.bankName);
								bank_address_line_1_field.set("value", response.items.bankAddressLine1);
								bank_address_line_2_field.set("value", response.items.bankAddressLine2);
								bank_dom_field.set("value", response.items.bankCity);
							}
						}
					},
					error 		: function(response, args){
						console.error("[Could not validate Bank IFSC Code] "+ bank_code_field.get("value"));
						console.error(response);
					}
				});
			}
		  
		  else
		  {
				bank_name_field.set("value", "");
				bank_address_line_1_field.set("value", "");
				bank_address_line_2_field.set("value", "");
				bank_dom_field.set("value", "");
		  }
		}	
		return valid;
     }
    
	function _validateftAmount(){
		
		var clearing_code_field = dj.byId("clearing_code"),
		    ftAmount_field = dj.byId("ft_amt"),
		    rtgsAllowedAmt_field = dj.byId("rtgsallowedamt"),
		    isValid = true,
		    displayMsg = "";
		if(ftAmount_field && ftAmount_field.get("value") !== "" && clearing_code_field && clearing_code_field.get("value") !== "" && clearing_code_field.get("value") === 'RTGS'){
			if( rtgsAllowedAmt_field && ftAmount_field.get("value") < rtgsAllowedAmt_field.get("value")){
				isValid = false;
				displayMsg =  m.getLocalization("rtgsminimumallowedamountrange", [d.number.parse(dj.byId("rtgsallowedamt").get("value"))]);
				ftAmount_field.set("state","Error");
				dj.showTooltip(displayMsg, ftAmount_field.domNode, 0);
				var hideTT = function() {
				    dj.hideTooltip(ftAmount_field.domNode);
				};
				setTimeout(hideTT, 5000);
			}
		}
		else if(ftAmount_field && ftAmount_field.get("value") !== "" && clearing_code_field && clearing_code_field.get("value") !== "" && clearing_code_field.get("value") === 'NEFT'){
				if(ftAmount_field.state === "Error"){
				ftAmount_field.state = "";
				ftAmount_field._setStateClass();
			    dj.hideTooltip(ftAmount_field.domNode);
			}
		}
		return isValid;
	}
	
	function _validateDescriptionAddressRegex()
	{  
 	   	
	   var regex = dj.byId("decrValue");		  
	   var regexStr = regex ? dj.byId("decrValue").get("value") : '';		 
	   var addressRegExp = new RegExp(regexStr);
	   
	   var isValid = false;
	   var errorMessage=null;
	  				   				   
	   var descriptionAddressId1 = dj.byId("mups_description_address_line_1");
	   var descriptionAddressStr1 = descriptionAddressId1? dj.byId("mups_description_address_line_1").get("value") : '';
			 
	   if(regexStr !== null && regexStr !== ''){
	         if(descriptionAddressStr1 !== '' && descriptionAddressStr1 !== null)
		     {			   			   
				   isValid = addressRegExp.test(descriptionAddressStr1);				   
				   if(!isValid)
				   {
					   errorMessage =  m.getLocalization("invalidDescriptionAddressField");
					   descriptionAddressId1.set("state","Error");
					   dj.showTooltip(errorMessage, descriptionAddressId1.domNode, 0);
					   var hideTT = function() {
						   dj.hideTooltip(descriptionAddressId1.domNode);
						};
						setTimeout(hideTT, 5000);
					   
					   return isValid;
				   }				   
			   }
			   
			   var descriptionAddressId2 = dj.byId("mups_description_address_line_2");
			   var descriptionAddressStr2 = descriptionAddressId2? dj.byId("mups_description_address_line_2").get("value") : '';
			   
			   if(descriptionAddressStr2 !== '' && descriptionAddressStr2 !== null)
			   {			   			   
				   isValid = addressRegExp.test(descriptionAddressStr2);				   
				   if(!isValid)
				   {
					   errorMessage =  m.getLocalization("invalidDescriptionAddressField");
					   descriptionAddressId2.set("state","Error");
					   dj.showTooltip(errorMessage, descriptionAddressId2.domNode, 0);
					   var hideTT1 = function() {
						   dj.hideTooltip(descriptionAddressId2.domNode);
						};
						setTimeout(hideTT1, 5000);
					   return isValid;
				   }				   
			   }
			   
			   var descriptionAddressId3 = dj.byId("mups_description_address_line_3");
			   var descriptionAddressStr3 = descriptionAddressId3? dj.byId("mups_description_address_line_3").get("value") : '';
			   
			   if(descriptionAddressStr3 !== '' && descriptionAddressStr3 !== null)
			   {			   			   
				   isValid = addressRegExp.test(descriptionAddressStr3);				   
				   if(!isValid)
				   {
					   errorMessage =  m.getLocalization("invalidDescriptionAddressField");
					   descriptionAddressId3.set("state","Error");
					   dj.showTooltip(errorMessage, descriptionAddressId3.domNode, 0);
					   var hideTT2 = function() {
						   dj.hideTooltip(descriptionAddressId3.domNode);
						};
						setTimeout(hideTT2, 5000);
					   return isValid;
				   }				   
			   }
			   				   
			   var descriptionAddressId4 = dj.byId("mups_description_address_line_4");
			   var descriptionAddressStr4 = descriptionAddressId4? dj.byId("mups_description_address_line_4").get("value") : '';
			   
			   if(descriptionAddressStr4 !== '' && descriptionAddressStr4 !== null)
			   {			   			   
				   isValid = addressRegExp.test(descriptionAddressStr4);				   
				   if(!isValid)
				   {
					   errorMessage =  m.getLocalization("invalidDescriptionAddressField");
					   descriptionAddressId4.set("state","Error");
					   dj.showTooltip(errorMessage, descriptionAddressId4.domNode, 0);
					   var hideTT3 = function() {
						   dj.hideTooltip(descriptionAddressId4.domNode);
						};
						setTimeout(hideTT3, 5000);
					   return isValid;
				   }				   
			   }
		   }
	   else
	   {   
		   m._config.forceSWIFTValidation = false;   			   			   
	   }
	   return isValid;
	}
	
	function _validateBankDetails()
	{  
 	   	
	   var regex = dj.byId("decrValue");		  
	   var regexStr = regex ? dj.byId("decrValue").get("value") : '';		 
	   var addressRegExp = new RegExp(regexStr);
	   
	   var isValid = false;
	   var errorMessage=null;
	  				   				   
	   var bankName = dj.byId("cpty_bank_name");
	   var bankNameStr = bankName? dj.byId("cpty_bank_name").get("value") : '';
			 
	   if(regexStr !== null && regexStr !== ''){
	         if(bankNameStr !== '' && bankNameStr !== null)
		     {			   			   
				   isValid = addressRegExp.test(bankNameStr);				   
				   if(!isValid)
				   {
					   errorMessage =  m.getLocalization("invalidDescriptionAddressField");
					   bankName.set("state","Error");
					   dj.showTooltip(errorMessage, bankName.domNode, 0);
					   var hideTT = function() {
						   dj.hideTooltip(bankName.domNode);
						};
						setTimeout(hideTT, 5000);
					   return isValid;
				   }				   
			   }
			   
			   var bankAddressId1 = dj.byId("cpty_bank_address_line_1");
			   var bankAddressStr1 = bankAddressId1? dj.byId("cpty_bank_address_line_1").get("value") : '';
			   
			   if(bankAddressStr1 !== '' && bankAddressStr1 !== null)
			   {			   			   
				   isValid = addressRegExp.test(bankAddressStr1);				   
				   if(!isValid)
				   {
					   errorMessage =  m.getLocalization("invalidDescriptionAddressField");
					   bankAddressId1.set("state","Error");
					   dj.showTooltip(errorMessage, bankAddressId1.domNode, 0);
					   var hideTT1 = function() {
						   dj.hideTooltip(bankAddressId1.domNode);
						};
						setTimeout(hideTT1, 5000);
					   return isValid;
				   }				   
			   }
			   
			   var bankAddressId2 = dj.byId("cpty_bank_address_line_2");
			   var bankAddressStr2 = bankAddressId2? dj.byId("cpty_bank_address_line_2").get("value") : '';
			   
			   if(bankAddressStr2 !== '' && bankAddressStr2 !== null)
			   {			   			   
				   isValid = addressRegExp.test(bankAddressStr2);				   
				   if(!isValid)
				   {
					   errorMessage =  m.getLocalization("invalidDescriptionAddressField");
					   bankAddressId2.set("state","Error");
					   dj.showTooltip(errorMessage, bankAddressId2.domNode, 0);
					   var hideTT2 = function() {
						   dj.hideTooltip(bankAddressId2.domNode);
						};
						setTimeout(hideTT2, 5000);
					   return isValid;
				   }				   
			   }
			   				   
			   var bankCity = dj.byId("cpty_bank_dom");
			   var BankCityStr = bankCity? dj.byId("cpty_bank_dom").get("value") : '';
			   
			   if(BankCityStr !== '' && BankCityStr !== null)
			   {			   			   
				   isValid = addressRegExp.test(BankCityStr);				   
				   if(!isValid)
				   {
					   errorMessage =  m.getLocalization("invalidDescriptionAddressField");
					   bankCity.set("state","Error");
					   dj.showTooltip(errorMessage, bankCity.domNode, 0);
					   var hideTT3 = function() {
						   dj.hideTooltip(bankCity.domNode);
						};
						setTimeout(hideTT3, 5000);
					   return isValid;
				   }				   
			   }
		   }
	   else
	   {   
		   m._config.forceSWIFTValidation = false;   			   			   
	   }
	   return isValid;
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
	var displayMessage,	beneficiary = { }, ifsc = { };
	beneficiary.fields = [  'beneficiary_name',
	                		'beneficiary_account',
	                		'cpty_bank_swift_bic_code',
	                		'pre_approved'];
	
	ifsc.fields = [ 'cpty_bank_name',
					'cpty_bank_address_line_1',
					'cpty_bank_address_line_2',
					'cpty_bank_dom'];
	
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
				dj.byId(node).set("value", '');
			}
		});
		d.style("PAB","display","none");
	};
	
	ifsc.clear = function()
	{
		d.forEach(this.fields ,function(node, i)
		{
			if (dj.byId(node))
			{
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
		if(dj.byId("bank_ifsc_img"))
		{
			dj.byId("bank_ifsc_img").set("disabled",false);
		}
		if(dj.byId("currency"))
		{
			dj.byId("currency").set("disabled",false);
		}
		d.style("PAB", "display", "none");
		beneficiary.clear();
		ifsc.clear();
		dj.byId("pre_approved_status").set("value", "N");
		m.clearBeneficiaryAdviceFieldsForDefaultingFromBeneMaster();
	}	
	
	
	/**
	 * called after selecting a beneficiary
	 * No processing done if beneficiary is getting cleared
	 */
	function _beneficiaryChangeHandler()
	{
		var beneficiaryId = dj.byId("beneficiary_name");
		var beneficiaryName = beneficiaryId.get("value");
		var beneficiarylength = beneficiaryName.length;
		var errorMessage=null;
		var clearingCode= dj.byId("clearing_code");

		if (clearingCode.get("value") === "")
		{
			beneficiaryId.set("value", '');
			m.dialog.show("ERROR", m.getLocalization("selectClearingCode"));
			return false;
		}

		if(beneficiaryName !== "")
		{
		   
			   if(dj.byId("pre_approved_status") && dj.byId("pre_approved_status").get("value") === 'Y')
				{
					// Display PAB text only if non-PAB accounts are allowed
					if(m._config.non_pab_allowed)
					{
						d.style("PAB", "display", "inline");
					}else
					{
						console.debug("Non-PAB accounts are not allowed, hiding PAB text");
						d.style("PAB", "display", "none");
					}
					if(dj.byId("bank_ifsc_img"))
						{
							dj.byId("bank_ifsc_img").set("disabled", true);
						}
					beneficiary.toggleReadonly(true);						
				}	
				else
				{
					d.style("PAB","display","none");
					beneficiary.toggleReadonly(true);
					dj.byId("cpty_bank_swift_bic_code").set("readOnly", true);
					if( (dj.byId("pre_approved") && dj.byId("pre_approved").get("value") === "") || (dj.byId("pre_approved") && dj.byId("pre_approved").get("value") === null))
					{
						beneficiary.toggleReadonly(false);
						if(dj.byId("bank_ifsc_img"))
						{
							dj.byId("bank_ifsc_img").set("disabled", false);
						}
					}
					else 
					{
						beneficiary.toggleReadonly(true);
						if(dj.byId("bank_ifsc_img"))
						{
							dj.byId("bank_ifsc_img").set("disabled", true);
						}
					}
				}
			   return true;
		}
	}
	
	
	function _validateBeneName()
	{
		var beneficiaryId = dj.byId("beneficiary_name") ? dj.byId("beneficiary_name") : '';
		var beneficiaryName = beneficiaryId.get("value");
		var beneficiarylength = beneficiaryName.length;
		
		 if(beneficiarylength<12)
		   {
			   /*errorMessage =  m.getLocalization("invalidLengthForBeneficiaryNameMUPS");
			   beneficiaryId.set("state","Error");
			   dj.hideTooltip(beneficiaryId.domNode);
			   dj.showTooltip(errorMessage, beneficiaryId.domNode, 0);*/
			 	this.invalidMessage = m.getLocalization("invalidLengthForBeneficiaryNameMUPS");
			   return false;
		   }
		  if(!_validateBeneficiary(beneficiaryId))
		   {
			   /*errorMessage =  m.getLocalization("invalidBeneficiaryNameforMUPS");
			   beneficiaryId.set("state","Error");
			   dj.hideTooltip(beneficiaryId.domNode);
			   dj.showTooltip(errorMessage, beneficiaryId.domNode, 0);*/
			  this.invalidMessage = m.getLocalization("invalidBeneficiaryNameforMUPS");
			   return false;
		   }
		  return true;
	}

	function _validateBeneficiary(/*String*/field)
	{	
		var regex = dj.byId("beneficiary_acc_name_regex_mups");
		
	    var regexStr = regex ? dj.byId("beneficiary_acc_name_regex_mups").get("value") : '';		 
	    var accountNameRegExp = new RegExp(regexStr);

	    var isValid = false;
		var accNo = dj.byId(field);
		var accountNameString = accNo ? accNo.get("value") : '';

		if(regexStr !== null && regexStr !== ''){
	         if(accountNameString !== '' && accountNameString !== null)
		     {			   			   
				   isValid = accountNameRegExp.test(accountNameString);				   
				   return isValid;
		     }
		}
		return isValid;
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
		var email = dj.byId("bene_email_1").get("value");
		if (!email)
		{
			email = dj.byId("bene_email_2").get("value");
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

	function _changeBeneficiaryNotificationEmail()
	{
		var sendAlternativeChecked = dj.byId("notify_beneficiary_choice_2").get("checked") && !dj.byId("notify_beneficiary_choice_2").get("disabled");
		var notifyEmail = dj.byId("notify_beneficiary_email");
		var notifyRadio1 = dj.byId("notify_beneficiary_choice_1");
		var notifyRadio2 = dj.byId("notify_beneficiary_choice_2");
		
		var notifyEmailDOM = d.byId("notify_beneficiary_email_node");
		var notifyRadio1DOM = d.byId("label_notify_beneficiary_choice_1");
		var notifyRadio2DOM = d.byId("label_notify_beneficiary_choice_2");		
		
		var email = dj.byId("bene_email_1").get("value");
		if (!email)
		{
			email = dj.byId("bene_email_2").get("value");
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
	

	function _applicantAccountButtonHandler()
	{
		
		var applicantAcctPAB = dj.byId("applicant_act_pab").get("value");
		
		if (applicantAcctPAB == "Y")
		{
			dj.byId("beneficiary_name").set("readOnly", true);
			dj.byId("beneficiary_account").set("readOnly", true);
			dj.byId("cpty_bank_swift_bic_code").set("readOnly", true);
			if(dj.byId("bank_ifsc_img"))
			{
				dj.byId("bank_ifsc_img").set("disabled",true);
			}
		}
		else
		{
			if(m._config.non_pab_allowed)
			{
				dj.byId("beneficiary_name").set("readOnly", false);
				dj.byId("beneficiary_account").set("readOnly", false);
				dj.byId("cpty_bank_swift_bic_code").set("readOnly", false);
			}else
			{
				console.log("Adhoc mode is unavailable although selected debit account is non-PAB. Beneficiary is readonly");
				dj.byId("beneficiary_name").set("readOnly", true);
				dj.byId("beneficiary_account").set("readOnly", true);
				dj.byId("cpty_bank_swift_bic_code").set("readOnly", true);
				if(dj.byId("bank_ifsc_img"))
				{
					dj.byId("bank_ifsc_img").set("disabled",true);
				}
			}
		}
		
		// clear all beneficiary fields
		dojo.forEach(['pre_approved', 'ft_amt', 'beneficiary_account','pre_approved_status','','', 
		   		   'cpty_bank_name', 'cpty_bank_address_line_1', 'cpty_bank_address_line_2', 'cpty_bank_dom', 'cpty_branch_address_line_1', 'cpty_branch_address_line_2', 'cpty_branch_dom','','', 
		   		   'cpty_bank_swift_bic_code', 'cpty_bank_code', 'cpty_branch_code', 'cpty_branch_name', '', 'beneficiary_name', '','','bene_adv_beneficiary_id_no_send', 
		   		   'bene_adv_mailing_name_add_1_no_send','bene_adv_mailing_name_add_2_no_send','bene_adv_mailing_name_add_3_no_send','bene_adv_mailing_name_add_4_no_send', 
		   		   'bene_adv_mailing_name_add_5_no_send','bene_adv_mailing_name_add_6_no_send','bene_adv_postal_code_no_send','bene_adv_country_no_send','bene_email_1', 
		   		   'bene_email_2','beneficiary_postal_code','beneficiary_country', 'bene_adv_fax_no_send', 'bene_adv_ivr_no_send', 'bene_adv_phone_no_send','clearing_code'], function(currentField) {
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
		
		// Clear PAB text
		d.style("PAB","display","none");
		
		if(d.byId("clear_img"))
		{
			if(applicantAcctPAB == 'Y' && d.style(d.byId("clear_img"),"display") !== "none")
			{
				m.animate("wipeOut", d.byId('clear_img'));
				console.log("Selected debit account is PAB. Hiding clear button");
			}
			else if(applicantAcctPAB == 'N' && d.style(d.byId("clear_img"),"display") == "none")
			{
				m.animate("wipeIn", d.byId('clear_img'));
				console.log("Selected debit account is non-PAB and adhoc mode is available. Displaying clear button");
			}
		}
	}
		

	/**
	 * Open a popup to select a Master Beneficiary
	 */
	function _beneficiaryButtonHandler()
	{
		var applicantActNo = dj.byId('applicant_act_no').get('value');
		var clearingCode = dj.byId("clearing_code").get("value");
		if (applicantActNo === "")
		{
			m.dialog.show("ERROR", m.getLocalization("selectDebitFirst"));
			return;
		}
		if (clearingCode === "")
		{
			m.dialog.show("ERROR", m.getLocalization("selectClearingCode"));
			return;
		}
		var entity = dj.byId("entity") ? dj.byId("entity").get("value") : "";
		var subProdCode = dijit.byId('sub_product_code').get('value');
		clearingCode = dj.byId("clearing_code").get("value");
		m.showSearchDialog("ifsc_beneficiary_accounts", 
		 "['pre_approved_status','pre_approved', 'beneficiary_name','beneficiary_account','beneficiary_act_cur_code', 'beneficiary_address', 'beneficiary_city', '', 'beneficiary_dom','','', " +
		   "'cpty_bank_name', 'cpty_bank_address_line_1', 'cpty_bank_address_line_2', 'cpty_bank_dom', 'cpty_branch_address_line_1', 'cpty_branch_address_line_2', 'cpty_branch_dom','','', " +
		   "'cpty_bank_swift_bic_code', 'cpty_bank_code','cpty_branch_code', 'cpty_branch_name','','','bene_adv_beneficiary_id_no_send', " +
		   "'bene_adv_mailing_name_add_1_no_send','bene_adv_mailing_name_add_2_no_send','bene_adv_mailing_name_add_3_no_send','bene_adv_mailing_name_add_4_no_send', " +
		   "'bene_adv_mailing_name_add_5_no_send','bene_adv_mailing_name_add_6_no_send','bene_adv_postal_code_no_send','bene_adv_country_no_send','bene_email_1'," + 
		   "'bene_email_2','beneficiary_postal_code','beneficiary_country','bene_adv_fax_no_send',  'bene_adv_phone_no_send','beneficiary_nickname']",
		   { product_type: subProdCode, entity_name:entity, pabAccStat: dijit.byId('applicant_act_pab').get('value'),debitAcctNo: applicantActNo, clearing_code : clearingCode}, 
		   '', subProdCode, 'width:710px;height:350px;', m.getLocalization("ListOfBeneficiriesTitleMessage"));
			
		if(dj.byId("pre_approved_status") && dj.byId("pre_approved_status").get("value")==='Y' )
		{
			
			if(dj.byId("bank_ifsc_img"))
			{
				dj.byId("bank_ifsc_img").set("disabled",true);
			}
		}
		else 
		{
			d.style("PAB","display","none");
			if( (dj.byId("pre_approved_status") && dj.byId("pre_approved_status").get("value") === 'N') && (dj.byId("pre_approved") && dj.byId("pre_approved").get("value") !=="")){
				if(dj.byId("bank_ifsc_img"))
				{
					dj.byId("bank_ifsc_img").set("disabled",true);
				}
			}
			else if( (dj.byId("pre_approved") && dj.byId("pre_approved").get("value") ==="") || (dj.byId("pre_approved") && dj.byId("pre_approved").get("value") === null)){
				if(dj.byId("bank_ifsc_img"))
				{
					dj.byId("bank_ifsc_img").set("disabled",false);
				}
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
			if(dj.byId("option_for_tnx") && dj.byId("option_for_tnx").get("value") === 'SCRATCH_DOM')
			{
				dj.byId("appl_date").set("value", date);
				document.getElementById('appl_date_view_row').childNodes[1].innerHTML = date;
				dj.byId("appl_date_hidden").set("value", date1);
			}
			dj.byId("todays_date").set("value", date1);
		}
		
		if(!hasCustomerBankValue && !formLoading)
		{	
			dj.byId("applicant_act_name").set("value", "");
			dj.byId("beneficiary_name").set("value", "");
			dj.byId("beneficiary_account").set("value", "");
			dj.byId("cpty_bank_swift_bic_code").set("value", "");
			dj.byId("cpty_bank_name").set("value", "");
			dj.byId("cpty_bank_address_line_1").set("value", "");
			dj.byId("cpty_bank_address_line_2").set("value", "");
			dj.byId("cpty_bank_dom").set("value", "");
			dj.byId("ft_amt").set("value", "");
			dj.byId("iss_date").set("value", null);
    		dj.byId("issuing_bank_abbv_name").set("value",customer_bank);
    		bank_desc_name = misys._config.customerBankDetails[customer_bank][0].value;
    		dj.byId("issuing_bank_name").set("value",bank_desc_name);
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
	
	/**
	 * Third Party account validation (call back)
	 **/
	function _validateBeneficiaryAccount()
	{
		// Summary:
		// Validate if the beneficiary master account is a valid TPT account
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
					case 'OK':
						//Populate any values that the validation might be returning into hidden fields
						account_currency_field.set("value", response.items.AcctCur);
						valid = true;
						break;
					case 'ERR_INVALID_ACCOUNT_NUMBER':
						displayMessage = misys.getLocalization('invalidAccountNumber', [account_number_field.get("value")]);
						//focus on the widget and set state to error and display a tool tip indicating the same
						account_number_field.focus();
						account_number_field.set("value","");
						account_number_field.set("state","Error");
						dj.hideTooltip(account_number_field.domNode);
						dj.showTooltip(displayMessage, account_number_field.domNode, 0);
						break;
					case 'ERR_INVALID_INTERFACE_PROCESSING_ERROR':
						displayMessage = misys.getLocalization('accountValidationInterfaceError');
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
				console.error('[Could not validate Beneficiary Account] '+ account_number_field.get("value"));
				console.error(response);
			}
		});
		
		return valid;
	}
	
	function _handleFXAction()
	{
		var subProduct = dj.byId("sub_product_code").get("value");			
		if(m._config.fxParamData && dj.byId("issuing_bank_abbv_name") && dj.byId("issuing_bank_abbv_name").get("value")!=="" && m._config.fxParamData[subProduct][dj.byId("issuing_bank_abbv_name").get("value")].isFXEnabled === "Y"){
			//Start FX Actions
			m.connect("ft_cur_code", "onChange", function(){
				m.setCurrency(this, ["ft_amt"]);
				if(dj.byId("ft_cur_code").get("value") !== "" && !isNaN(dj.byId("ft_amt").get("value"))){
					m.fireFXAction();
				}else{
					if(d.byId(fxSection) && (d.style(d.byId(fxSection),"display") !== "none"))
					{
						m.animate("wipeOut", d.byId(fxSection));
					}
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
	
	function _compareApplicantAndBenificiaryCurrency()	
	{
		var applicant_act_cur_code = dj.byId('applicant_act_cur_code').get('value');
		var beneficiary_act_cur_code = dj.byId('beneficiary_act_cur_code').get('value');
		
		if (applicant_act_cur_code !== "" && beneficiary_act_cur_code != "" && applicant_act_cur_code !== beneficiary_act_cur_code)
			{
				m.dialog.show("ERROR",m.getLocalization("mismatchFrom"));
				dj.byId("applicant_act_pab").set('value','');
				dj.byId('applicant_act_name').set('value','');
				dj.byId('applicant_act_cur_code').set('value','');
				dj.byId('applicant_act_no').set('value','');
				dj.byId('beneficiary_name').set('value','');
				dj.byId('beneficiary_account').set('value','');
				if(dj.byId("cpty_bank_name"))
				{
					dj.byId("cpty_bank_name").set("value",'');
				}
				return;
			}
		else
			{
				dj.byId("ft_cur_code").set("value",beneficiary_act_cur_code);
				return;
			}
	}
	
	d.mixin(m._config, {

		initReAuthParams : function() {

			var reAuthParams = {
				productCode : 'FT',
				subProductCode : dj.byId("sub_product_code")? dj.byId("sub_product_code").get("value"): '',
				transactionTypeCode : '01',
				entity :dj.byId("entity") ? dj.byId("entity").get("value") : "",
				currency : dj.byId("ft_cur_code")? dj.byId("ft_cur_code").get('value'): '',
				amount : dj.byId("ft_amt")? m.trimAmount(dj.byId("ft_amt").get('value')): '',
				bankAbbvName : dj.byId("customer_bank")? dj.byId("customer_bank").get("value") : "",
				
				es_field1 : dj.byId("ft_amt")? m.trimAmount(dj.byId("ft_amt").get('value')): '',
				es_field2 : (dj.byId("beneficiary_account")) ? dj.byId("beneficiary_account").get('value') : ''
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
							if(fromCurrency && fromCurrency !== "" && toCurrency && toCurrency !== "")
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
					}
			}
		},		
		
		bind : function()
		{
			// binding for tolerance
			_validateBankIFSCCode();
			m.setValidation("iss_date", m.validateTransferDateCustomer);
			m.connect("applicant_act_name", "onChange", m.checkNickNameDiv);
			m.connect("beneficiary_name", "onChange", m.checkBeneficiaryNicknameDiv);
			m.setValidation("template_id", m.validateTemplateId);	
			m.connect("clearing_code","onChange",function(){
				if(dj.byId("clearing_code").get("value") != "" && dj.byId("cpty_bank_swift_bic_code").get("value") != ""){
					
					if(_validateIFSCOnClearingCode()){
						_validateftAmount();
					}
				}
			});
									
			m.connect("cpty_bank_swift_bic_code","onBlur", function(){
				
				var ifsccode_field = dj.byId("cpty_bank_swift_bic_code"),
					clearCode_field = dj.byId("clearing_code"),
				     errorMsg = "";
				var isValid = false;
				var regEx = "^[a-zA-z]*$";
				var ifscExp = new RegExp(regEx);
				var ifscCodevalue = ifsccode_field.get("value");
				var ifscCodestr = ifscCodevalue.substring(0,4);
				
				isValid = ifscExp.test(ifscCodestr);				   
				if(!isValid){
					errorMsg = misys.getLocalization("invalidformat");
					dj.hideTooltip(ifsccode_field.domNode);
					ifsccode_field.set("state","Error");
					dj.showTooltip(errorMsg, ifsccode_field.domNode, 0);
				 }
				if( ifsccode_field.get("value") !== "" && ifsccode_field.get("value").length < 11 )
				{
					isValid = false;
					errorMsg = misys.getLocalization("invalidformat");
					dj.hideTooltip(ifsccode_field.domNode);
					ifsccode_field.set("state","Error");
					dj.showTooltip(errorMsg, ifsccode_field.domNode, 0);
				}
				if(isValid &&  ifsccode_field.get("value") !== "" && clearCode_field.get("value") !== ""){
					_validateBankIFSCCode();
				}
			});	
			
			
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
			m.connect("applicant_act_no", "onChange", _applicantAccountButtonHandler);
			m.connect("entity", "onClick", m.validateRequiredField);
			m.connect("applicant_act_name", "onClick", m.validateRequiredField);
			m.connect("beneficiary_name", "onClick", m.validateRequiredField);
			
			m.connect("beneficiary_act_cur_code", "onClick", m.validateRequiredField);
			m.connect("beneficiary_account", "onClick", m.validateRequiredField);
			
			m.connect("cpty_bank_swift_bic_code", "onClick", m.validateRequiredField);
			m.connect("mups_description_address_line_1", "onBlur", function(){
				var errorMsg = null,
				desc_addr_line_1_field = dj.byId("mups_description_address_line_1"),
				desc_addr_line_2_field = dj.byId("mups_description_address_line_2"),
				desc_addr_line_3_field = dj.byId("mups_description_address_line_3"),
				desc_addr_line_4_field = dj.byId("mups_description_address_line_4");
				
				if(desc_addr_line_1_field.get("value") !== "" ){
					desc_addr_line_2_field.set("state","");
					dj.hideTooltip(desc_addr_line_2_field.domNode);
					desc_addr_line_3_field.set("state","");
					dj.hideTooltip(desc_addr_line_3_field.domNode);
					desc_addr_line_4_field.set("state","");
					dj.hideTooltip(desc_addr_line_4_field.domNode);
				}
				
			});
			m.connect("mups_description_address_line_2", "onBlur", function(){
				var errorMsg = null, 
				desc_addr_line_1_field = dj.byId("mups_description_address_line_1"),
				desc_addr_line_2_field = dj.byId("mups_description_address_line_2");
				
				if(desc_addr_line_1_field.get("value") === "" ){
					errorMsg = misys.getLocalization("invaliddescriptionaddressline");
					desc_addr_line_2_field.set("state","Error");
					dj.showTooltip(errorMsg, desc_addr_line_2_field.domNode, 0);
					 var hideTT = function() {
							dj.hideTooltip(desc_addr_line_2_field.domNode);
						};
						setTimeout(hideTT, 5000);
				}
				
			});
			
			m.connect("mups_description_address_line_3", "onBlur", function(){
				
				var errorMsg = null, 
				desc_addr_line_1_field = dj.byId("mups_description_address_line_1"),
				desc_addr_line_2_field = dj.byId("mups_description_address_line_2"),
				desc_addr_line_3_field = dj.byId("mups_description_address_line_3");		
				
				if(desc_addr_line_1_field.get("value") === "" || desc_addr_line_2_field.get("value") === ""){
					errorMsg = misys.getLocalization("invaliddescriptionaddressline");
					desc_addr_line_3_field.set("state","Error");
					dj.showTooltip(errorMsg, desc_addr_line_3_field.domNode, 0);
					var hideTT = function() {
						dj.hideTooltip(desc_addr_line_3_field.domNode);
					};
					setTimeout(hideTT, 5000);
				} 
			});
			
			m.connect("mups_description_address_line_4", "onBlur", function(){
				var errorMsg = null, 
				desc_addr_line_1_field = dj.byId("mups_description_address_line_1"),
				desc_addr_line_2_field = dj.byId("mups_description_address_line_2"),
				desc_addr_line_3_field = dj.byId("mups_description_address_line_3"),		
				desc_addr_line_4_field = dj.byId("mups_description_address_line_4");
				
				if(desc_addr_line_1_field.get("value") === "" || desc_addr_line_2_field.get("value") === "" || desc_addr_line_3_field.get("value") === ""){
					errorMsg = misys.getLocalization("invaliddescriptionaddressline");
					desc_addr_line_4_field.set("state","Error");
					dj.showTooltip(errorMsg, desc_addr_line_4_field.domNode, 0);
					var hideTT = function() {
						dj.hideTooltip(desc_addr_line_4_field.domNode);
					};
					setTimeout(hideTT, 5000);
				
				}
			});
			
			m.connect("mups_description_address_line_1", "onBlur", _validateDescriptionAddressRegex);
			m.connect("mups_description_address_line_2", "onBlur", _validateDescriptionAddressRegex);
			m.connect("mups_description_address_line_3", "onBlur", _validateDescriptionAddressRegex);
			m.connect("mups_description_address_line_4", "onBlur", _validateDescriptionAddressRegex);
						
			dj.byId("sub_product_code").set("value", "MUPS");	
					
			//Bind all recurring payment details fields
			m.bindRecurringFields();
			m.connect("ft_cur_code", "onChange", function() {
				if(dj.byId("iss_date") && dj.byId("iss_date").get("value") !== "")
				{
					dj.byId("iss_date").validate();
				}
				if(dj.byId("recurring_start_date") && dj.byId("recurring_start_date").get("value") !== "")
				{
					dj.byId("recurring_start_date").validate();
				}
				m.setCurrency(this, ["ft_amt"]);
			});
			
			m.setValidation("ft_cur_code", m.validateCurrency);
			
			m.connect("ft_amt","onBlur",_validateftAmount);
			m.connect("beneficiary_account", "onChange", _validateBeneficiaryAccount);
			
			m.connect("entity", "onChange", function() {
				formLoading = true;
				dj.byId("applicant_act_name").set("value", "");
				dj.byId("beneficiary_name").set("value", "");
				dj.byId("beneficiary_nickname").set("value", "");
				dj.byId("applicant_act_nickname").set("value", "");
				dj.byId("beneficiary_account").set("value", "");
				dj.byId("cpty_bank_swift_bic_code").set("value", "");
				dj.byId("cpty_bank_name").set("value", "");
				dj.byId("cpty_bank_address_line_1").set("value", "");
				dj.byId("cpty_bank_address_line_2").set("value", "");
				dj.byId("cpty_bank_dom").set("value", "");
				dj.byId("ft_amt").set("value", "");
				dj.byId("iss_date").set("value", null);
				if(misys._config.isMultiBank && dj.byId("customer_bank")){
					dj.byId("customer_bank").set("value", "");
					m.populateCustomerBanks();
				}
			});
			
			
			/**
			 * This basically deals with the multibank scenarios for recurring
			 */
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
				
				_compareApplicantAndBenificiaryCurrency();
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
					dj.byId("bene_email_1").set("value", "");
					dj.byId("bene_email_2").set("value", "");
				}
			});
			
			m.connect("beneficiary_img", "onClick", _beneficiaryButtonHandler);
			m.setValidation("beneficiary_name", _validateBeneName);
			
			m.connect("beneficiary_name", "onChange", function(){
				_beneficiaryChangeHandler();
				if(dj.byId("notify_beneficiary_email") && dj.byId("notify_beneficiary").get("checked"))
				{
					if(dj.byId("notify_beneficiary_choice_1").get("checked"))
						{
						if(dj.byId("bene_email_1").get("value") !== "")
							{
							dj.byId("notify_beneficiary_email").set("value", dj.byId("bene_email_1").get("value"));
							}
						else if(dj.byId("bene_email_2").get("value") !== "")
							{
							dj.byId("notify_beneficiary_email").set("value", dj.byId("bene_email_2").get("value"));
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
						dj.byId("notify_beneficiary_choice_2").set("disabled", true);
						dj.byId("notify_beneficiary_choice_2").set("checked", false);
						dj.byId("notify_beneficiary").set("checked", false);
						}
				}
			});
			
			m.connect("cpty_bank_swift_bic_code", "onChange", _validateBankDetails);
			
			m.connect("cpty_bank_name", "onBlur", _validateBankDetails);

			m.connect("cpty_bank_address_line_1", "onBlur", _validateBankDetails);

			m.connect("cpty_bank_address_line_2", "onBlur", _validateBankDetails);
			
			m.connect("cpty_bank_dom", "onBlur", _validateBankDetails);
						
			m.connect("recurring_flag", "onClick", function(){
				m.showRecurring();
			});
			
			//do not store beneficiary id if not PAB
		
			
			m.connect("notify_beneficiary", "onClick", _changeBeneficiaryNotification);
			
			m.connect("notify_beneficiary_choice_1", "onClick", _changeBeneficiaryNotificationEmail);
			
			m.connect("notify_beneficiary_choice_2", "onClick", _changeBeneficiaryNotificationEmail);
			
			m.setValidation("notify_beneficiary_email", m.validateEmailAddr);
			
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
					m.setTnxCurCode(dj.byId("ft_cur_code").get("value"));
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

			m.connect("bene_adv_beneficiary_id_no_send","onChange",function(){
				
				var beneficiary_id = dj.byId("bene_adv_beneficiary_id_no_send").get("value");
				if(beneficiary_id){
					dj.byId("bene_adv_beneficiary_id").set("value",beneficiary_id);
				}
			});
		},	
	
		onFormLoad : function(){

			m.setCurrency(dj.byId("ft_cur_code"), ["ft_amt"]);

			if(dj.byId("bulk_ref_id") && dj.byId("bulk_ref_id").get("value") !== "")
			{
				dj.byId("clearing_code").set("readOnly",true);
			}
			
			if(dj.byId("beneficiary_act_cur_code")){
				dj.byId("beneficiary_act_cur_code").set("value","INR");
				dj.byId("beneficiary_act_cur_code").set("readOnly", true);
			}
			
			if(dj.byId("ft_cur_code")){
				dj.byId("ft_cur_code").set("value","INR");
				dj.byId("ft_cur_code").set("readOnly", true);
			}
		
			m.initForm();
			if(misys._config.nickname==="true" && dj.byId("applicant_act_nickname") && dj.byId("applicant_act_nickname").get("value")!=="" && d.byId("nickname"))
			{
				m.animate("fadeIn", d.byId("nickname"));
				 d.style("nickname","display","inline");
				d.byId("nickname").innerHTML = dj.byId("applicant_act_nickname").get("value");
			}else{
				m.animate("fadeOut", d.byId("applicant_act_nickname_row"));
			}
			m.checkBeneficiaryNicknameOnFormLoad();
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
			if(dj.byId("notify_beneficiary").get("checked") && dj.byId("notify_beneficiary_choice_1").get("checked") && (dijit.byId("mode").value === "DRAFT"))
			{
				var notifyEmailDOM = d.byId("notify_beneficiary_email_node");
				var notifyRadio2DOM = d.byId("label_notify_beneficiary_choice_2");	
				_changeBeneficiaryNotificationEmail();
				if (dj.byId("notify_beneficiary_choice_2").get("checked"))
				{
					d.place(notifyEmailDOM, notifyRadio2DOM, "after");
				}
			}
			
	    	if(misys._config.isMultiBank)
			{
	    		m.populateCustomerBanks(true);
				var linkedBankField = dj.byId("customer_bank");
				var linkedBankHiddenField = dj.byId("customer_bank_hidden");
				var entity = dj.byId("entity");
				if(linkedBankField && linkedBankHiddenField)
				{
					linkedBankField.set("value", linkedBankHiddenField.get("value"));
				}
				if(dj.byId("issuing_bank_abbv_name") && dj.byId("issuing_bank_abbv_name").get("value") !== "")
				{
					hasCustomerBankValue = true;
					formLoading = true;
					linkedBankField.set("value", dj.byId("issuing_bank_abbv_name").get("value"));
					linkedBankHiddenField.set("value", dj.byId("issuing_bank_abbv_name").get("value"));
				}
				if(entity && entity.get("value") === "" && linkedBankField)
				{
					linkedBankField.set("disabled",true);
					linkedBankField.set("required",false);
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
				if(d.byId("server_message") && d.byId("server_message").innerHTML !== "" || dijit.byId("option_for_tnx") && (dijit.byId("option_for_tnx").get("value") === "" || dijit.byId("option_for_tnx").get("value") === "TEMPLATE"))
					{
						validationFailedOrDraftMode = true;
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
           
			// on form load this value is not getting populated,set this field non mandatory
			if (dj.byId("applicant_act_product_types") && dj.byId("applicant_act_no").get("value") !== "")
			{
				m.toggleRequired("applicant_act_product_types", false);
			}
			
			// copy the default_email back to the hidden field in the case we're using it
			// this should allow to go back and forth default and alternative email when first
			// loading the page
			var notifyEmail = dj.byId("notify_beneficiary_email");
			var notifyChoice = dj.byId("notify_beneficiary_choice");
			if (notifyEmail && notifyEmail.get("value") !== "" 	&& notifyChoice && (notifyChoice.get("value") == "default_email"))
			{
				dj.byId("bene_email_1").set("value", notifyEmail.get("value"));
			}
			
			if(dj.byId("recurring_payment_enabled") && dj.byId("recurring_payment_enabled").get("checked"))
		    {
				
			   dj.byId("recurring_flag").set("checked", true);
			   //this is to mark recurring fields mandatory if recurring is enabled
			   m._config.clearOnSecondCall = true;   
		       m.showSavedRecurringDetails(false);
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
			//hide fx section by default
			
			if(!m._config.isMultiBank && dj.byId("issuing_bank_abbv_name") && dj.byId("issuing_bank_abbv_name").get("value") !== "" && m._config.fxParamData && dj.byId("sub_product_code") && dj.byId("sub_product_code").get("value") !== "" && dj.byId("sub_product_code").get("value") !== "IBG")
			{
				m.initializeFX(dj.byId("sub_product_code").get("value"), dj.byId("issuing_bank_abbv_name").get("value"));
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
			
		},
		
		initForm : function()
		{	
			// TODO remove from here, use the one in the product
			dj.byId("sub_product_code").set("value", "MUPS");
			
			var applicantAcctPAB = dj.byId("applicant_act_pab").get("value");
			//in case of draft/unsigned, if the beneficiary is pre-approved, display PAB label
			if(applicantAcctPAB === 'Y' || (dj.byId("pre_approved_status") && dj.byId("pre_approved_status").get("value") === 'Y'))
			{
				// DisplayPAB text only if non-PAB are allowed
				if(m._config.non_pab_allowed)
				{
					d.style("PAB","display","inline");
				} else
				{
					console.debug("Non-PAB accounts not allowed. Hide PAB text");
					d.style("PAB","display","none");
				}
				beneficiary.toggleReadonly(true);	
				
				if(dj.byId("bank_iso_img"))
				{
					dj.byId("bank_iso_img").set("disabled",true);
				}
				if(dj.byId("bank_ifsc_img"))
				{
					dj.byId("bank_ifsc_img").set("disabled",true);
				}
				if(dj.byId("currency"))
				{
					dj.byId("currency").set("disabled",true);
				}
			}
			else
				{

				if( (dj.byId("pre_approved") && dj.byId("pre_approved").get("value") === "") || (dj.byId("pre_approved") && dj.byId("pre_approved").get("value") === null))
				{
					beneficiary.toggleReadonly(false);	
					if(dj.byId("bank_iso_img"))
					{
						dj.byId("bank_iso_img").set("disabled",false);
					}
					if(dj.byId("bank_ifsc_img"))
					{
						dj.byId("bank_ifsc_img").set("disabled",false);
					}
					if(dj.byId("currency"))
					{
						dj.byId("currency").set("disabled",false);
					}
				}
				else 
				{
					beneficiary.toggleReadonly(true);
					if(dj.byId("bank_iso_img"))
					{
						dj.byId("bank_iso_img").set("disabled",true);
					}
					if(dj.byId("bank_ifsc_img"))
					{
						dj.byId("bank_ifsc_img").set("disabled",true);
					}
					if(dj.byId("currency"))
					{
						dj.byId("currency").set("disabled",true);
					}
				}
				}
			d.forEach(d.query(".CUR"),function(node, i)
			{
				d.style(node,"display","inline");
			});
			
			dj.byId("beneficiary_mode").set("value","02");

			// Control initial visibility of the Clear button based on selected debit account
			if(d.byId("clear_img"))
			{
				if(applicantAcctPAB == 'Y' && d.style(d.byId("clear_img"),"display") !== "none")
				{
					m.animate("wipeOut", d.byId('clear_img'));
					console.log("Selected debit account is PAB. Hiding clear button");
				}
			}
	     },
     
	     beforeSaveValidations : function(){
	    	
	    	var entity = dj.byId("entity") ;
	    	if(entity && entity.get("value")=== "")
            {
                    return false;
            }
            else
            {
                    return true;
            }
         },
	          
	     beforeSubmitValidations : function()
	     {
	    	 var modeValue = dijit.byId("mode") ? dijit.byId("mode").get("value") : "";
	    	 if(modeValue === "DRAFT")
		     {
	    		 if(! _validateBeneficiaryAccount())
	    		{
	    			 return false;
	    		}	 
	    		 if(! _validateIFSCOnClearingCode()){
	    			 return false;
	    		 }
	    	}
	    	 if((dj.byId("mups_description_address_line_1") && dj.byId("mups_description_address_line_1").get("value") !== "") ||
	    			 (dj.byId("mups_description_address_line_2") && dj.byId("mups_description_address_line_2").get("value") !== "") ||
	    			 	(dj.byId("mups_description_address_line_3") && dj.byId("mups_description_address_line_3").get("value") !== "") ||
	    			 		(dj.byId("mups_description_address_line_4") && dj.byId("mups_description_address_line_4").get("value") !== "")){
	    		 
	    		 if(! _validateDescriptionAddressRegex()){
    				 return false;
	    		 }
	    		 if(! _validateDescriptionAddress()){
    				 return false;
	    		 }
	    	 }	 
	    	 
	    	 if(dj.byId("cpty_bank_swift_bic_code") && dj.byId("cpty_bank_swift_bic_code").get("value") !== "" && (!_validateBankDetails())){
	    		 return false;
	    	 }
		      //validate transfer amount should be greater than zero
	    	 if(dj.byId("ft_amt"))
			{
				if(!m.validateAmount((dj.byId("ft_amt"))))
				{
					m._config.onSubmitErrorMsg =  m.getLocalization("amountcannotzero");
					dj.byId("ft_amt").set("value", "");
					return false;
				}
				if(!_validateftAmount()){
					return false;
				}
			}   
	    	 if(dj.byId("beneficiary_name") && ! _beneficiaryChangeHandler()){
	    	
	    		 return false;
	    		 }
	    	 	    	 
	    	//Validate Recurring payment details prior to transaction submit
	    	 if(!m.isRecurringDetailsValidForSubmit())
	   		 {
		    		 return false;
	   		 }
	    	 //Validating if corresponding contract values are entered.
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
	    	 var accNo = dj.byId("applicant_act_no").get("value");
	    	 var isAccountActive = m.checkAccountStatus(accNo);
	    	 if(!isAccountActive){
	    		 m._config.onSubmitErrorMsg = misys.getLocalization('accountStatusError');
					return false;
	     	 }
	    	 // do not validate holiday and cut off in the transaction for bulks
	    	 // this will be handled in the bulk level
	    	 if (!dj.byId("bulk_ref_id").get("value"))
	    	 {
	    	   var valid = false;
		       if(modeValue === "DRAFT")
		       {		  
		    	   if (dj.byId("recurring_payment_enabled") && dj.byId("recurring_payment_enabled").get("checked"))
		    	  {
		    		  valid =  m.validateHolidaysAndCutOffTimeForMUPS("issuing_bank_abbv_name","sub_product_code",modeValue,["Start Date"],["recurring_start_date"],"entity","ft_cur_code","ft_amt","clearing_code");		    		  
		    	  }
		    	  else
		    	  {
		    		  valid =  m.validateHolidaysAndCutOffTimeForMUPS("issuing_bank_abbv_name","sub_product_code",modeValue,["Transfer Date"],["iss_date"],"entity","ft_cur_code","ft_amt","clearing_code");
		    	  }
		       }
		       else if(modeValue === "UNSIGNED")
		       {
		    	   if (dj.byId("recurring_payment_enabled") && dj.byId("recurring_payment_enabled").get("value") === "Y")
		    	   {		    		   
		    		   valid =  m.validateHolidaysAndCutOffTimeForMUPS("issuing_bank_abbv_name","sub_product_code_unsigned",modeValue,["Start Date"],["recurring_start_date_unsigned"],"display_entity_unsigned","ft_cur_code_unsigned","ft_amt_unsigned","clearing_code");
		    	   }
		    	   else
		    	   {
		    		   valid =  m.validateHolidaysAndCutOffTimeForMUPS("issuing_bank_abbv_name","sub_product_code_unsigned",modeValue,["Transfer Date"],["iss_date_unsigned"],"display_entity_unsigned","ft_cur_code_unsigned","ft_amt_unsigned","clearing_code");
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
	     
	 	showProductBasedListOfBanksforMUPS : function()
		{
	    	var productType = dijit.byId("product_type").get("value");
	    	var clearingSystem=dj.byId("clearing_code") ? dj.byId("clearing_code").get("value") : "";
	    	if(clearingSystem !== ""){
	    		misys.showSearchDialog("ifscCodeMUPS","['cpty_bank_swift_bic_code','cpty_bank_name', 'cpty_bank_address_line_1', 'cpty_bank_address_line_2', 'cpty_bank_dom']", {swiftcode: false, bankcode: false, clearingCode:clearingSystem}, "", "", "width:710px;height:350px;", m.getLocalization("ListOfBanksTitleMessage"),"","",true);
	    	}
	    	else{
				m.dialog.show("ERROR", m.getLocalization("selectClearingCode"));
				return;
	    	}
		}
	     
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.cash.create_ft_mups_client');
