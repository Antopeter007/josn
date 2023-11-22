/*
 * ---------------------------------------------------------- 
 * Event Binding for Third Party transfers
 * 
 * Copyright (c) 2000-2012 Misys (http://www.misys.com), All Rights Reserved.
 * 
 * version: 1.0 date: 23/10/2012
 * 
 * ----------------------------------------------------------
 */
dojo.provide("misys.binding.cash.create_ft_tpt");

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
dojo.require("misys.binding.common.create_fx_multibank");
dojo.require("misys.binding.cash.paymentFees");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode
	var fxMsgType = d.byId("fx-message-type");
	var hasCustomerBankValue = false;
	var formLoading = true;
	var validationFailedOrDraftMode = false;
	var styeConst = "<style='width:800px;height:1000px;overflow:auto;'>";
	var spanConst = "<b><span class='legend'>";
	var spanConstEnd = "</span></b>";
	var fxSection = "fx-section";
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
			if(dj.byId("option_for_tnx") && dj.byId("option_for_tnx").get("value") === 'SCRATCH_TPT')
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
			dj.byId("beneficiary_act_cur_code").set("value", "");
			dj.byId("beneficiary_account").set("value", "");
			dj.byId("ft_cur_code").set("value", "");
			dj.byId("ft_amt").set("value", "");
			dj.byId("iss_date").set("value", null);
			dj.byId("issuing_bank_abbv_name").set("value",customer_bank);
    		bank_desc_name = misys._config.customerBankDetails[customer_bank][0].value;
    		dj.byId("issuing_bank_name").set("value",bank_desc_name);
    		m.setApplicantReference();
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
	
	function _handleFXAction()
	{
		var subProduct = dj.byId("sub_product_code").get("value");			
		if(dj.byId("issuing_bank_abbv_name") && dj.byId("issuing_bank_abbv_name").get("value") !== "" && m._config.fxParamData && m._config.fxParamData[subProduct][dj.byId("issuing_bank_abbv_name").get("value")].isFXEnabled === "Y"){
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
	 * bound to the Clear button
	 */
	function _clearButtonHandler()
	{
		var applicantAcctPAB = dj.byId("applicant_act_pab").get("value");
		if (applicantAcctPAB === "Y")
		{
			beneficiary.toggleReadonly(true);
		}
		else
		{
			beneficiary.toggleReadonly(false);
			
		}
		if(document.getElementById("FTCurrSrch"))
		{
			d.style("FTCurrSrch", "display", "inline");
		}
		d.style("PAB", "display", "none");
		beneficiary.clear();
		dj.byId("pre_approved_status").set("value", "N");
		m.clearBeneficiaryAdviceFieldsForDefaultingFromBeneMaster();		
	}	
	
	function _validateRegexBeneficiary()
	{				
				   
		   var regex = dj.byId("regexValue");
		   var products = dj.byId("allowedProducts");
		   		   
		   var regexStr =  regex ? dj.byId("regexValue").get("value") : '';
		   var productsStr = products ? dj.byId("allowedProducts").get("value") : '';
		   
		   var productTypeStr = 'TPT';
		   		   
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
		
	
	/**
	 * called after selecting a beneficiary
	 * No processing done if beneficiary is getting cleared
	 */
	function _beneficiaryChangeHandler()
	{
		var beneficiaryName = dj.byId("beneficiary_name").get("value");
		//_validateRegexBeneficiary();
		if(beneficiaryName !== "")
		{
			if(dj.byId("pre_approved_status") && dj.byId("pre_approved_status").get("value") === "Y")
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
				if(dj.byId("bank_img"))
					{
						dj.byId("bank_img").set("disabled", true);
					}
				beneficiary.toggleReadonly(true);						
			}	
			else
			{
				d.style("PAB","display","none");
				//beneficiary.toggleReadonly(false);
				if( (dj.byId("pre_approved") && dj.byId("pre_approved").get("value") === "") || (dj.byId("pre_approved") && dj.byId("pre_approved").get("value") === null))
				{
					 beneficiary.toggleReadonly(false);
					 if(dj.byId("bank_img"))
						{
							dj.byId("bank_img").set("disabled", false);
						}
				}
				else 
				{
					beneficiary.toggleReadonly(true);	
					if(dj.byId("bank_img"))
					{
						dj.byId("bank_img").set("disabled", true);
					}
				}
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
		
		if (applicantAcctPAB === "Y")
		{
			dj.byId("beneficiary_name").set("readOnly", true);
			dj.byId("beneficiary_act_cur_code").set("readOnly", true);
			dj.byId("beneficiary_account").set("readOnly", true);
		}
		else
		{
			if(m._config.non_pab_allowed)
			{
				dj.byId("beneficiary_name").set("readOnly", false);
				dj.byId("beneficiary_act_cur_code").set("readOnly", false);
				dj.byId("beneficiary_account").set("readOnly", false);
			}else
			{
				console.log("Adhoc mode is unavailable although selected debit account is non-PAB. Beneficiary is readonly");
				dj.byId("beneficiary_name").set("readOnly", true);
				dj.byId("beneficiary_act_cur_code").set("readOnly", true);
				dj.byId("beneficiary_account").set("readOnly", true);
			}
		}
		
		// clear all beneficiary fields
		dojo.forEach(["pre_approved", "beneficiary_account", "beneficiary_act_cur_code", "beneficiary_address", "beneficiary_city", "", "beneficiary_dom", "pre_approved_status","","", "cpty_bank_name", 
					"cpty_bank_address_line_1", "cpty_bank_address_line_2", "cpty_bank_dom", "cpty_branch_address_line_1", "cpty_branch_address_line_2", "cpty_branch_dom","","", 
					"cpty_bank_swift_bic_code", "cpty_bank_code", "cpty_branch_code", "cpty_branch_name", "", "beneficiary_name", "","","bene_adv_beneficiary_id_no_send", 
					"bene_adv_mailing_name_add_1_no_send","bene_adv_mailing_name_add_2_no_send","bene_adv_mailing_name_add_3_no_send","bene_adv_mailing_name_add_4_no_send", 
					"bene_adv_mailing_name_add_5_no_send","bene_adv_mailing_name_add_6_no_send","bene_adv_postal_code_no_send","bene_adv_country_no_send","bene_email_1", 
					"bene_email_2","beneficiary_postal_code","beneficiary_country", "bene_adv_fax_no_send", "bene_adv_ivr_no_send", "bene_adv_phone_no_send"], function(currentField) {
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
		dj.byId("beneficiary_act_cur_code").set("value", dj.byId("applicant_act_cur_code").get("value"));
		// Clear PAB text
		d.style("PAB","display","none");
		
		if(d.byId("clear_img"))
		{
			if(applicantAcctPAB === 'Y' && d.style(d.byId("clear_img"),"display") !== "none")
			{
				m.animate("wipeOut", d.byId('clear_img'));
				console.log("Selected debit account is PAB. Hiding clear button");
			}
			else if(applicantAcctPAB === 'N' && d.style(d.byId("clear_img"),"display") === "none")
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
		var applicantActNo = dj.byId("applicant_act_no").get("value");
		if (applicantActNo === "")
		{
			m.dialog.show("ERROR", m.getLocalization("selectDebitFirst"));
			return;
		}
		
		var entity = dj.byId("entity") ? dj.byId("entity").get("value") : "";
		var subProdCode = dijit.byId("sub_product_code").get("value");
		m.showSearchDialog("beneficiary_accounts", 
		   "['beneficiary_name','beneficiary_account','beneficiary_act_cur_code', 'beneficiary_address', 'beneficiary_city', '', 'beneficiary_dom', 'pre_approved_status','','', " +
		   "'cpty_bank_name', 'cpty_bank_address_line_1', 'cpty_bank_address_line_2', 'cpty_bank_dom', 'cpty_branch_address_line_1', 'cpty_branch_address_line_2', 'cpty_branch_dom','','', " +
		   "'cpty_bank_swift_bic_code', 'cpty_bank_code', 'cpty_branch_code', 'cpty_branch_name', 'pre_approved', '','','bene_adv_beneficiary_id_no_send', " +
		   "'bene_adv_mailing_name_add_1_no_send','bene_adv_mailing_name_add_2_no_send','bene_adv_mailing_name_add_3_no_send','bene_adv_mailing_name_add_4_no_send', " +
		   "'bene_adv_mailing_name_add_5_no_send','bene_adv_mailing_name_add_6_no_send','bene_adv_postal_code_no_send','bene_adv_country_no_send','bene_email_1'," + 
		   "'bene_email_2','beneficiary_postal_code','beneficiary_country', 'bene_adv_fax_no_send', 'bene_adv_phone_no_send', 'beneficiary_nickname']",
		   { product_type: subProdCode, entity_name: entity, pabAccStat: dijit.byId("applicant_act_pab").get("value"), debitAcctNo: applicantActNo}, 
		   "", subProdCode, "width:710px;height:350px;", m.getLocalization("ListOfBeneficiriesTitleMessage"));
			
		if(dj.byId("pre_approved_status") && dj.byId("pre_approved_status").get("value")==="Y" )
		{
			if(dj.byId("bank_img"))
			{
				dj.byId("bank_img").set("disabled",true);
			}
			if(dj.byId("bank_iso_img"))
			{
				dj.byId("bank_iso_img").set("disabled",true);
			}
		}
		else
		{
			d.style("PAB","display","none");
		}
		// Added for MPS18871 on 04/04/2013 	
		d.style("FTCurrSrch", "display", "none");
	}
	
	/**
	 * Method to get the currency code on change of the DR account
	 * Display the transaction Currency list with DR and CR account currency with 
	 * CR Account currency being selected as default.
	 * Added for MPS18871 on 04/04/2013 
	 */
	
	function _actionOnAmtCurrencyField(){	
		
		var curTypes =  "";
		var fromCurCode, toCurCode;
		if(dj.byId("applicant_act_cur_code") && dj.byId("applicant_act_cur_code").get("value") !== '')
		{
			fromCurCode = dj.byId("applicant_act_cur_code").get("value");
		}
		if(dj.byId("beneficiary_act_cur_code") && dj.byId("beneficiary_act_cur_code").get("value")!== '')
		{
			toCurCode = dj.byId("beneficiary_act_cur_code").get("value");
		}
		
		if(fromCurCode && toCurCode && dj.byId('ft_cur_code'))
		{
				curTypes = dj.byId('ft_cur_code');
				curTypes.store = null;
					
				var jsonData = {"identifier" :"id", "items" : []};
				var  productStore = new dojo.data.ItemFileWriteStore( {data : jsonData });
				
				if(fromCurCode !== toCurCode)
				{
					productStore.newItem( {"id" :  fromCurCode, "name" : fromCurCode});
					 productStore.newItem( {"id" :  toCurCode, "name" : toCurCode});
					 curTypes.store = productStore;
				}else{
					productStore.newItem( {"id" :  toCurCode, "name" : toCurCode});
					 curTypes.store = productStore;
				}
				 dj.byId("ft_cur_code").set("displayedValue", toCurCode);
		}	
		
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
	function _compareApplicantAndBenificiaryCurrency(){
		var applicant_act_cur_code = dj.byId('applicant_act_cur_code').get('value');
		var beneficiary_act_cur_code = dj.byId('beneficiary_act_cur_code').get('value');
	    
		if (beneficiary_act_cur_code && beneficiary_act_cur_code !== "")
		{
			if (applicant_act_cur_code !== beneficiary_act_cur_code)
			{
				m.dialog.show("ERROR",m.getLocalization("crossCurrency"));
				dj.byId('beneficiary_name').set('value','');
				dj.byId('beneficiary_account').set('value','');
				setTimeout(function() {dj.byId('beneficiary_act_cur_code').set('value',  dj.byId('applicant_act_cur_code').get('value'));}, 0);
				dj.byId("ft_cur_code").set("value",'');
				dj.byId('pre_approved').set('value','');
				dj.byId('pre_approved_status').set('value','');

				//Notify Email flag and email, all should be unchecked and cleared
				dj.byId("notify_beneficiary_choice_1").set("checked", false);
				dj.byId("notify_beneficiary_choice_2").set("checked", false);	
				dj.byId("notify_beneficiary_choice_1").set("disabled", true);
				dj.byId("notify_beneficiary_choice_2").set("disabled", true);
				dj.byId("bene_email_1").set('value','');
				dj.byId("bene_email_2").set('value','');
				dj.byId("notify_beneficiary").set("checked",false);
				
				d.place(d.byId("notify_beneficiary_email_node"), d.byId("label_notify_beneficiary_choice_2"), "after");
				dj.byId("notify_beneficiary_email").set('value','');
				dj.byId("notify_beneficiary_email").set("disabled", true);
				
				if (dj.byId("applicant_act_pab").get("value") !== 'Y')
				{
					m.toggleFieldsReadOnly(['beneficiary_name','beneficiary_act_cur_code','beneficiary_account'], false);
				}
				else if (dj.byId("applicant_act_pab").get("value") === 'Y')
				{
					m.toggleFieldsReadOnly(['beneficiary_name','beneficiary_act_cur_code','beneficiary_account'], true);
				}
				d.style("PAB","display","none");
				return;
			}
		}
	}
	d.mixin(m._config, {

		initReAuthParams : function() {

			var reAuthParams = {
				productCode : "FT",
				subProductCode : dj.byId("sub_product_code")? dj.byId("sub_product_code").get("value"): '',
				transactionTypeCode : "01",
				entity : dj.byId("entity") ? dj.byId("entity").get("value") : "",
				currency : dj.byId("ft_cur_code")? dj.byId("ft_cur_code").get("value"): '',
				amount : dj.byId("ft_amt")? m.trimAmount(dj.byId("ft_amt").get("value")): '',
				bankAbbvName : dj.byId("customer_bank")? dj.byId("customer_bank").get("value") : "",
				
				es_field1 : dj.byId("ft_amt")? m.trimAmount(dj.byId("ft_amt").get("value")): '',
				es_field2 : (dj.byId("beneficiary_account")) ? dj.byId("beneficiary_account").get("value") : ""
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
					var beneCur = dj.byId("beneficiary_act_cur_code"); 
					//added newly for MPS18871 to include the CR Account Currency Code
					
					var isDirectConversion = false;
						if(ftCurrency !== "" && !isNaN(amount) && productCode !== "" && bankAbbvName !== "" )
						{	
							if (ftCurrency !== ftAcctCurrency)
							{
								fromCurrency = ftAcctCurrency;
								toCurrency   = ftCurrency;
								masterCurrency = ftAcctCurrency;
							}
							else if(masterCurrency && masterCurrency !== '' && ftCurrency && ftCurrency !== '' && masterCurrency === ftCurrency && (beneCur && beneCur.get("value") !== '' && ftCurrency !== beneCur.get("value")))
							{
								isDirectConversion = true;
								fromCurrency = ftCurrency;
								toCurrency   = beneCur.get("value");
								masterCurrency = toCurrency;
							}
							//else if block newly added to include the beneficiary currency MPS18871
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
										isNaN(dj.byId("fx_exchange_rate_amt").get("value")) || (m._config.fxParamData[dj.byId("sub_product_code").get("value")].toleranceDispInd === "Y" && (isNaN(dj.byId("fx_tolerance_rate").get("value")) || 
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
			m.setValidation("iss_date", m.validateTransferDateCustomer);
			m.connect("applicant_act_name", "onChange", m.checkNickNameDiv);
			m.connect("beneficiary_name", "onChange", m.checkBeneficiaryNicknameDiv);
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
			m.setValidation("template_id", m.validateTemplateId);
		
			m.connect("applicant_act_no", "onChange", _applicantAccountButtonHandler);
			m.connect("entity", "onClick", m.validateRequiredField);
			m.connect("applicant_act_name", "onClick", m.validateRequiredField);
			m.connect("beneficiary_name", "onClick", m.validateRequiredField);
			m.connect("beneficiary_act_cur_code", "onClick", m.validateRequiredField);
			m.connect("beneficiary_account", "onClick", m.validateRequiredField);
			dj.byId("sub_product_code").set("value", "TPT");		
			//Bind all recurring payment details fields
			m.bindRecurringFields();
			m.connect("ft_cur_code", "onChange", function() {
				m.setCurrency(this, ["ft_amt"]);
			});
			
			m.setValidation("beneficiary_act_cur_code", m.validateCurrency);
			
			m.connect("beneficiary_account", "onChange", _validateBeneficiaryAccount);
			
			m.connect("beneficiary_act_cur_code", "onChange", function() {	
				if(dj.byId("ft_cur_code") && !dj.byId("ft_cur_code").get("readOnly"))
				{
					dj.byId("ft_cur_code").set("value",dj.byId("beneficiary_act_cur_code").get("value"));	
					dj.byId("ft_amt").set("value","");
					//Added for MPS 18871
					_actionOnAmtCurrencyField();
				}
			});
			
			m.connect("beneficiary_name", "onChange", m.validateMandatoryRemarks);
			m.setValidation("beneficiary_act_cur_code", m.validateCurrency);
			
			m.connect("entity", "onChange", function() {
				if(!misys._config.isMultiBank)
				{	
					m.setApplicantReference();
				}
				formLoading = true;
				dj.byId("applicant_act_name").set("value", "");
				dj.byId("applicant_act_nickname").set("value","");
				dj.byId("beneficiary_nickname").set("value","");
				dj.byId("beneficiary_name").set("value", "");
				dj.byId("beneficiary_act_cur_code").set("value", "");
				dj.byId("beneficiary_account").set("value", "");
				dj.byId("ft_cur_code").set("value", "");
				dj.byId("ft_amt").set("value", "");
				dj.byId("iss_date").set("value", null);
				if(misys._config.isMultiBank && dj.byId("customer_bank")){
					dj.byId("customer_bank").set("value", "");
					m.populateCustomerBanks();
				}
			});
			
			m.connect("beneficiary_name", "onChange", function() {
				
				var check_currency = dj.byId('currency_res').get('value');
				if(check_currency==="true")
        		{
				_compareApplicantAndBenificiaryCurrency();
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
					dj.byId("bene_email_1").set("value", "");
					dj.byId("bene_email_2").set("value", "");
				}
			});
			
			//Added for MPS 18871	start		
			m.connect("applicant", "onChange", _actionOnAmtCurrencyField);			
			//Added for MPS 18871	end	
			
			m.connect("beneficiary_img", "onClick", _beneficiaryButtonHandler);
			m.setValidation("beneficiary_name", _validateRegexBeneficiary);
			m.connect("beneficiary_name", "onChange", function(){
				_beneficiaryChangeHandler();
				if(dj.byId("notify_beneficiary") && dj.byId("notify_beneficiary").get("checked"))
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
			});
			
			m.connect("notify_beneficiary", "onClick", _changeBeneficiaryNotification);
			
			m.connect("notify_beneficiary_choice_1", "onClick", _changeBeneficiaryNotificationEmail);
			
			m.connect("notify_beneficiary_choice_2", "onClick", _changeBeneficiaryNotificationEmail);
			
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
			m.setValidation("notify_beneficiary_email", m.validateEmailAddr);
			m.connect("applicant_act_name", "onChange",function(){
				if(dj.byId("ft_cur_code") && dj.byId("ft_cur_code").get("value") !== "")
				{
					dj.byId("ft_cur_code").set("value","");
					
					var jsonData = {"identifier" :"id", "items" : []};
					var currencyStore = new dojo.data.ItemFileWriteStore( {data : jsonData });
					dj.byId("ft_cur_code").set('store', currencyStore);
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
			
			var subProduct = dj.byId("sub_product_code").get("value");			
			if(dj.byId("issuing_bank_abbv_name").get("value") && dj.byId("issuing_bank_abbv_name").get("value") !== "" && m._config.fxParamData && m._config.fxParamData[subProduct][dj.byId("issuing_bank_abbv_name").get("value")].isFXEnabled === "Y"){
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
					m.validateMandatoryRemarks();
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
		},	
		
		onFormLoad : function(){

			m.initForm();
			var modeValue = dijit.byId("mode") ? dijit.byId("mode").get("value") : "";
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
			
			if(modeValue === "DRAFT" && dj.byId("beneficiary_name") && dj.byId("applicant_act_pab") && dj.byId("applicant_act_pab").get("value") === "Y" && dj.byId("beneficiary_name").value !== "")
		    {
				if(!m.validateBeneficiaryStatus())
				{	
					dj.byId("beneficiary_name").set("state", "Error");
					dj.showTooltip(m.getLocalization("beneficiaryIsInactive"), dj.byId("beneficiary_name").domNode, 0);
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
				var customerBankField = dj.byId("customer_bank");
				var customerBankHiddenField = dj.byId("customer_bank_hidden");
				var entity = dj.byId("entity");
				var issuingBankAbbvNameValue = dj.byId("issuing_bank_abbv_name") ? dj.byId("issuing_bank_abbv_name").get('value') : "";
				if(customerBankField)
				{
					if(customerBankHiddenField)
					{
						customerBankField.set("value", customerBankHiddenField.get("value"));
					}
					if(issuingBankAbbvNameValue !== "")
					{
						hasCustomerBankValue = true;
						formLoading = true;
						customerBankField.set("value", issuingBankAbbvNameValue);
						customerBankHiddenField.set("value", issuingBankAbbvNameValue);
					}
					if(entity && entity.get("value") === "")
					{
						customerBankField.set("disabled",true);
						customerBankField.set("required",false);
					}
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
				if(d.byId("server_message") && d.byId("server_message").innerHTML !== "" || (dijit.byId("option_for_tnx").get("value") === "" || dijit.byId("option_for_tnx").get("value") === "TEMPLATE"))
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
			
			if(misys._config.nickname==="true" && misys._config.option_for_app_date!=="SCRATCH")
			{
				if(dj.byId("applicant_act_nickname") && dj.byId("applicant_act_nickname").get("value")==="")
				{
					m.animate("wipeOut", d.byId("applicant_act_nickname_row"));
					m.animate("wipeOut", d.byId("nickname"));
				}
			}else{
				m.animate("fadeOut", d.byId("applicant_act_nickname_row"));
			}
			
			if (dj.byId("recurring_payment_enabled") && dj.byId("recurring_payment_enabled").get("checked"))
		    {
				dj.byId("recurring_flag").set("checked", true);    
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
			if (notifyEmail && notifyEmail.get("value") !== "" 	&& notifyChoice && (notifyChoice.get("value") === "default_email"))
			{
				dj.byId("bene_email_1").set("value", notifyEmail.get("value"));
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
			if (d.byId(fxSection))
			{
				//In case of bulk, from template will have amount and currency values on load, hence show fx section
				if(!m._config.fxParamData && dj.byId("bulk_ref_id").get("value") !== "" && dj.byId("ft_cur_code").get("value") !== ""&& !isNaN(dj.byId("ft_amt").get("value")))
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
			var ftCurrencyField = dj.byId("ft_cur_code");
			if(ftCurrencyField)
			{
			 var tempCurValue = ftCurrencyField.get("displayedValue");
			 _actionOnAmtCurrencyField();
			 ftCurrencyField.set("displayedValue", tempCurValue);
			}
			m.validateMandatoryRemarks();
			var gppFeeConfigFlag = dj.byId("gpp_fee_config_flag") ? dj.byId("gpp_fee_config_flag").get("value") : "false";
			//var modeValue = dijit.byId("mode") ? dijit.byId("mode").get("value") : "";
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
		},
		
		initForm : function()
		{	
			// TODO remove from here, use the one in the product
			dj.byId("sub_product_code").set("value", "TPT");

			var applicantAcctPAB = dj.byId("applicant_act_pab").get("value");
			//in case of draft/unsigned, if the beneficiary is pre-approved, display PAB label
			if(applicantAcctPAB === 'Y' || (dj.byId("pre_approved_status") && dj.byId("pre_approved_status").get("value") === "Y"))
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
			else{
				if( (dj.byId("pre_approved") && dj.byId("pre_approved") == null) || (dj.byId("pre_approved") && dj.byId("pre_approved").get("value") === "") || (dj.byId("pre_approved") && dj.byId("pre_approved").get("value") === null))
				{
					beneficiary.toggleReadonly(false);		
				}
				else 
				{
					beneficiary.toggleReadonly(true);	
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
			
			// Control initial visibility of the Clear button based on selected debit account
			if(d.byId("clear_img") && (applicantAcctPAB === 'Y' && d.style(d.byId("clear_img"),"display") !== "none"))
			{
				m.animate("wipeOut", d.byId('clear_img'));
				console.log("Selected debit account is PAB. Hiding clear button");
			}
	     },
	     
	     setCustomConfirmMessage : function(){
		     	
		     	var modeValue = dijit.byId("mode") ? dijit.byId("mode").get("value") : "";
		     	 if(modeValue === "DRAFT")
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
	     beforeSaveValidations : function()
	     {	
	    	 if(dj.byId("payment_fee_details")) {
					dj.byId("payment_fee_details").set("value", "");
				}
	    	var entity = dj.byId("entity") ;
	    	if(entity && entity.get("value")=== "")
            {
                    return false;
            }
                    return true;
	     },
	     
	     beforeSubmitValidations : function()
	     {
	    	 var modeValue = dijit.byId("mode") ? dijit.byId("mode").get("value") : "";
	    	 if(modeValue === "DRAFT" && ! _validateBeneficiaryAccount())
		     {
	    			 return false;
		     }
	    	
	    	// Validate the beneficiary only in case the account is PAB
	    	if(modeValue === "DRAFT" && dj.byId("applicant_act_pab") && dj.byId("applicant_act_pab").get("value") === "Y" && !m.validateBeneficiaryStatus())
		    {
	    		 m._config.onSubmitErrorMsg =  m.getLocalization("beneficiaryIsInactive");
	    		 dj.byId("beneficiary_name").set("state", "Error");
	    		 return false;
		    }
	    	 
	    	 //validate transfer amount should be greater than zero
	    	 if(dj.byId("ft_amt") && !m.validateAmount((dj.byId("ft_amt"))?dj.byId("ft_amt"):0))
			{
					m._config.onSubmitErrorMsg =  m.getLocalization("amountcannotzero");
					dj.byId("ft_amt").set("value", "");
					return false;
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
	       //Validating if corresponding contract values are entered.
	         if(dj.byId("issuing_bank_abbv_name") && dj.byId("issuing_bank_abbv_name") !== "" && m._config.fxParamData && m._config.fxParamData[dj.byId("sub_product_code").get("value")][dj.byId("issuing_bank_abbv_name").get("value")].isFXEnabled === "Y"){
					if(!m.fxBeforeSubmitValidation())
					{
						return false;
					}
					if(!_preSubmissionFXValidation())
					{
						return false;
					}
	         }
	         /**	MPS-59385 : Mandatory payment narrative blank spaces validation		*/
	    	 if(dijit.byId("free_format_text"))
	    	 {
	    		 if(dijit.byId("free_format_text").get("required")){
	    			 var value = dijit.byId("free_format_text").get("value").trim();
	    			 if(value.length === 0){
						 dj.byId("free_format_text").set("value", "");
	    				 dj.byId("free_format_text").set("state", "Error");
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
	    	 // do not validate holiday and cut off in the transaction for bulks
	    	 // this will be handled in the bulk level
	    	 if (!dj.byId("bulk_ref_id").get("value"))
	    	 {
	    	   var valid = false;
	    	   if(modeValue === "DRAFT")
		       {		  
		    	   if (dj.byId("recurring_payment_enabled") && dj.byId("recurring_payment_enabled").get("checked"))
		    	  {
		    		  valid =  m.validateHolidaysAndCutOffTime("issuing_bank_abbv_name","sub_product_code",modeValue,["Start Date"],["recurring_start_date"],"entity","ft_cur_code","ft_amt");		    		  
		    	  }
		    	  else
		    	  {
		    		  valid =  m.validateHolidaysAndCutOffTime("issuing_bank_abbv_name","sub_product_code",modeValue,["Transfer Date"],["iss_date"],"entity","ft_cur_code","ft_amt");
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
		    		   valid =  m.validateHolidaysAndCutOffTime("issuing_bank_abbv_name","sub_product_code_unsigned",modeValue,["Transfer Date"],["iss_date_unsigned"],"display_entity_unsigned","ft_cur_code_unsigned","ft_amt_unsigned");
		    	   }
		       }
		       else
	    		 {
	    			 m._config.onSubmitErrorMsg = m.getLocalization("technicalErrorWhileValidatingBusinessDays");
	    			 console.debug("Mode is unknown to validate Holidays and Cut-Off Time");
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
	     
	     showListOfBanks : function(){
    		m.showSearchDialog("bank","['cpty_bank_name', 'cpty_bank_address_line_1', 'cpty_bank_address_line_2', 'cpty_bank_dom', 'cpty_bank_swift_bic_code', 'cpty_bank_contact_name', 'cpty_bank_phone', 'bank_country']", {swiftcode: false, bankcode: false}, "", "", "width:710px;height:350px;", m.getLocalization("ListOfSwiftBanksTitleMessage"));
	     }
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.cash.create_ft_tpt_client');