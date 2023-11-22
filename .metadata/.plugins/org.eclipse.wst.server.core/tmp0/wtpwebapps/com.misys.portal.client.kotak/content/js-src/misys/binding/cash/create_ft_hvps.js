/*
 * ---------------------------------------------------------- 
 * Event Binding for hvps domestic transfers
 * 
 * Copyright  (c) 2000-2012 Misys (http://www.misys.com), All Rights Reserved.
 * 
 * version: 1.0 date: 13/04/2016
 * 
 * ----------------------------------------------------------
 */
dojo.provide("misys.binding.cash.create_ft_hvps");

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
dojo.require("misys.widget.Collaboration");
dojo.require("misys.form.common");
dojo.require("misys.form.file");
dojo.require("misys.validation.common");
dojo.require("misys.binding.cash.ft_common");
dojo.require("misys.form.BusinessDateTextBox");
dojo.require("misys.binding.core.beneficiary_advice_common");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode
	var fxMsgType = d.byId("fx-message-type");
	var fxSection = "fx-section";
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
	
	function _validateEmailAddr() {
		if(dj.byId("notify_beneficiary_email") && dj.byId("notify_beneficiary_email").get("value") !== "")
		{
			var email = dj.byId("notify_beneficiary_email").get("value");
			var size = email.split(";");
			if(size.length > 10){
				var errorMessage =  m.getLocalization("checkEmailId");
				dj.byId("notify_beneficiary_email").set("state","Error");
				dj.hideTooltip(dj.byId("notify_beneficiary_email").domNode);
				dj.showTooltip(errorMessage, dj.byId("notify_beneficiary_email").domNode, 0);
			}
		 }
	}
	  
    function _validateCNAPSBankCode()
		{
			//  summary: 
			//  If bank code and branch code both are populated then validate bank branch code
			var bank_code_field	=	dj.byId("cnaps_bank_code"),
				bank_name_field	=	dj.byId("cnaps_bank_name"),
				subProdID       =   dj.byId("product_type").get("value"),
				displayMessage  = 	"";
			
			if(bank_code_field)
			{
				if(!(bank_code_field.get("value") === ""))
				{
					m.xhrPost( {
						url 		: misys.getServletURL("/screen/AjaxScreen/action/ValidateCNAPSBankCode") ,
						handleAs 	: "json",
						sync 		: true,
						content 	: {
							cnaps_bank_code : bank_code_field.get("value"),
							sub_product_code: subProdID
						},
						load : function(response, args){
							if (response.items.valid === false)
							{
								displayMessage = misys.getLocalization("invalidCNAPSBankCode", [bank_code_field.get("value")]);
								//focus on the widget and set state to error and display a tooltip indicating the same
								//bank_code_field.focus();
								bank_name_field.set("value","");
								
								bank_code_field.set("state","Error");
								dj.hideTooltip(bank_code_field.domNode);
								dj.showTooltip(displayMessage, bank_code_field.domNode, 0);
							}
							else
							{
								console.debug("Validated CNAPS Bank Code");
								bank_name_field.set("value", response.items.bankName);
							}
						},
						error 		: function(response, args){
							console.error("[Could not validate CNAPS Bank Code] "+ bank_code_field.get("value"));
							console.error(response);
						}
					});
				}
				else
				{
					bank_name_field.set("value", "");
					bank_code_field.set("value", "");
				}
			}
		}
    
	function _preSubmissionFXValidation(){
		var valid = true;
		var error_message = "";
		var boardRateOption = dj.byId("fx_rates_type_2");
		var totalUtiliseAmt = dj.byId("fx_total_utilise_amt");
		var ftAmt = dj.byId("ft_amt");
		var maxNbrContracts = m._config.fxParamData[dj.byId("sub_product_code").get("value")].fxParametersData.maxNbrContracts;
		
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
	beneficiary.fields = [  'beneficiary_name',
	                		'beneficiary_account',
	                		'beneficiary_act_cur_code',	                		
	                		'beneficiary_address',
	                		'beneficiary_city',
	                		'beneficiary_dom',
	                		'cnaps_bank_code',
	                		'cnaps_bank_name',
	                		'cpty_bank_swift_bic_code',
	                		'cpty_bank_address_line_1',
	                		'cpty_bank_address_line_2',
	                		'cpty_bank_dom',
	                		'cpty_branch_code',
	                		'cpty_branch_name',
	                		'pre_approved'];
	
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
			//dj.byId("cpty_branch_name").set("readOnly", true);
			dj.byId("cnaps_bank_name").set("readOnly", true);
			if(dj.byId("bank_img"))
			{
				dj.byId("bank_img").set("disabled", false);
			}
		}
		d.style("PAB", "display", "none");
		beneficiary.clear();
		dj.byId("pre_approved_status").set("value", "N");
		dj.byId("beneficiary_act_cur_code").set("value", "CNY");
		dj.byId("beneficiary_act_cur_code").set("readOnly", true);
		m.clearBeneficiaryAdviceFieldsForDefaultingFromBeneMaster();
		
	}	
	
	function _validateRegexBeneficiary()
	{				
		   		   
		   var regex = dj.byId("regexValue");
		   var products = dj.byId("allowedProducts");
		   		   
		   var regexStr =  regex ? dj.byId("regexValue").get("value") : '';
		   var productsStr = products ? dj.byId("allowedProducts").get("value") : '';
		   
		   var productTypeStr = 'HVPS';
		   		   
		   var beneficiaryId = dj.byId("beneficiary_name");
		   var beneficiaryStr = beneficiaryId? dj.byId("beneficiary_name").get("value") : ''; 
		   		 	   		  			   
		   var accountId = dj.byId("account_no");
		   var accountStr = accountId? dj.byId("account_no").get("value") : '';
		   
		   var beneficiaryRegExp = new RegExp(regexStr);
		   
		   var isValid = false;
		   var errorMessage=null;	  		   		 		   
		   if (  productsStr.indexOf(productTypeStr) < 0  )   
		   {			   
			   if(regexStr !== null && regexStr !== '' && beneficiaryStr !== '' && beneficiaryStr !== null)
			   {			   			   
				   isValid = beneficiaryRegExp.test(beneficiaryStr);				   
				   if(!isValid)
				   {
					   errorMessage =  m.getLocalization("invalidBeneficiaryName");
					   beneficiaryId.set("state","Error");
					   dj.hideTooltip(beneficiaryId.domNode);
					   dj.showTooltip(errorMessage, beneficiaryId.domNode, 0);
				   }				   
			   }				
			}
		   else
		   {
			   m._config.forceSWIFTValidation = false;   
		   }
	}
	/**
	 * called after selecting a beneficiary
	 * No processing done if beneficiary is getting cleared
	 */
	function _beneficiaryChangeHandler()
	{
		var beneficiaryName = dj.byId("beneficiary_name").get("value");
		_validateRegexBeneficiary();
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
				if(dj.byId("bank_img"))
					{
						dj.byId("bank_img").set("disabled", true);
					}
				beneficiary.toggleReadonly(true);						
			}	
			else
			{
				d.style("PAB","display","none");
				if( (dj.byId("pre_approved") && dj.byId("pre_approved").get("value") === "") || (dj.byId("pre_approved") && dj.byId("pre_approved").get("value") === null))
				{
					 beneficiary.toggleReadonly(false);
					 dj.byId("cnaps_bank_name").set("readOnly", false);
						dj.byId("beneficiary_act_cur_code").set("readOnly", true);
				}
				else 
				{
					beneficiary.toggleReadonly(true);
					dj.byId("cnaps_bank_name").set("readOnly", true);
					dj.byId("beneficiary_act_cur_code").set("readOnly", true);
					if(dj.byId("bank_img"))
					{
						dj.byId("bank_img").set("disabled", true);
					}
				}
				
			}
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
				dj.byId("cnaps_bank_name").set("value",'');
				dj.byId("cnaps_bank_code").set("value",'');
				dj.byId("business_type").set("value",'');
				dj.byId("business_detail_type").set("value",'');
				return;
			}
		else
			{
				dj.byId("ft_cur_code").set("value",beneficiary_act_cur_code);
				return;
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
			dj.byId("beneficiary_act_cur_code").set("readOnly", true);
			dj.byId("beneficiary_account").set("readOnly", true);
			dj.byId("cnaps_bank_code").set("readOnly", true);
			dj.byId("cnaps_bank_name").set("readOnly", true);
			if(dj.byId("bank_img"))
			{
				dj.byId("bank_img").set("disabled",true);
			}
		}
		else
		{
			if(m._config.non_pab_allowed)
			{
				dj.byId("beneficiary_name").set("readOnly", false);
				dj.byId("beneficiary_act_cur_code").set("readOnly", true);
				dj.byId("beneficiary_account").set("readOnly", false);
				dj.byId("cnaps_bank_code").set("readOnly", false);
				dj.byId("cnaps_bank_name").set("readOnly", true);
				if(dj.byId("bank_img"))
				{
					dj.byId("bank_img").set("disabled",false);
				}
			}else
			{
				console.log("Adhoc mode is unavailable although selected debit account is non-PAB. Beneficiary is readonly");
				dj.byId("beneficiary_name").set("readOnly", true);
				dj.byId("beneficiary_act_cur_code").set("readOnly", true);
				dj.byId("beneficiary_account").set("readOnly", true);
				dj.byId("cnaps_bank_code").set("readOnly", true);
				dj.byId("cnaps_bank_name").set("readOnly", true);
				if(dj.byId("bank_img"))
				{
					dj.byId("bank_img").set("disabled",true);
				}
			}
		}
		
		// clear all beneficiary fields
		dojo.forEach(['pre_approved', 'ft_amt', 'beneficiary_account', 'beneficiary_address', 'beneficiary_city', '', 'beneficiary_dom', 'pre_approved_status','','', 
		   		   'cpty_bank_name', 'cpty_bank_address_line_1', 'cpty_bank_address_line_2', 'cpty_bank_dom', 'cpty_branch_address_line_1', 'cpty_branch_address_line_2', 'cpty_branch_dom','','', 
		   		   'cpty_bank_swift_bic_code', 'cnaps_bank_code', 'cpty_branch_code', 'cpty_branch_name', '', 'beneficiary_name', '','','bene_adv_beneficiary_id_no_send', 
		   		   'bene_adv_mailing_name_add_1_no_send','bene_adv_mailing_name_add_2_no_send','bene_adv_mailing_name_add_3_no_send','bene_adv_mailing_name_add_4_no_send', 
		   		   'bene_adv_mailing_name_add_5_no_send','bene_adv_mailing_name_add_6_no_send','bene_adv_postal_code_no_send','bene_adv_country_no_send','bene_email_1', 
		   		   'bene_email_2','beneficiary_postal_code','beneficiary_country', 'bene_adv_fax_no_send', 'bene_adv_ivr_no_send', 'bene_adv_phone_no_send', 'cnaps_bank_name'], function(currentField) {
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
		if (applicantActNo === "")
		{
			m.dialog.show("ERROR", m.getLocalization("selectDebitFirst"));
			return;
		}
		var entity = dj.byId("entity") ? dj.byId("entity").get("value") : "";
		var subProdCode = dijit.byId('sub_product_code').get('value');
//		m.showSearchDialog("beneficiary_accounts", 
//		   "['pre_approved','beneficiary_account','beneficiary_act_cur_code', 'beneficiary_address', 'beneficiary_city', '', 'beneficiary_dom', 'pre_approved_status','','', " +
//		   "'cpty_bank_name', 'cpty_bank_address_line_1', 'cpty_bank_address_line_2', 'cpty_bank_dom', 'cpty_branch_address_line_1', 'cpty_branch_address_line_2', 'cpty_branch_dom','','', " +
//		   "'cpty_bank_swift_bic_code', 'cnaps_bank_code', 'cpty_branch_code', 'cpty_branch_name','beneficiary_name', '','','bene_adv_beneficiary_id_no_send', " +
//		   "'bene_adv_mailing_name_add_1_no_send','bene_adv_mailing_name_add_2_no_send','bene_adv_mailing_name_add_3_no_send','bene_adv_mailing_name_add_4_no_send', " +
//		   "'bene_adv_mailing_name_add_5_no_send','bene_adv_mailing_name_add_6_no_send','bene_adv_postal_code_no_send','bene_adv_country_no_send','bene_email_1'," + 
//		   "'bene_email_2','beneficiary_postal_code','beneficiary_country','bene_adv_fax_no_send',  'bene_adv_phone_no_send']",
//		   { product_type: subProdCode, entity_name:entity, pabAccStat: dijit.byId('applicant_act_pab').get('value')}, 
//		   '', 
//		   subProdCode, 
//		   'width:710px;height:350px;', 
//		   m.getLocalization("ListOfBeneficiriesTitleMessage"));
		
		m.showSearchDialog("cnaps_beneficiary_accounts", 
				   "['pre_approved','beneficiary_account','beneficiary_act_cur_code', 'beneficiary_address', 'beneficiary_city', '', 'beneficiary_dom', 'pre_approved_status','','', " +
				   "'cpty_bank_name', 'cpty_bank_address_line_1', 'cpty_bank_address_line_2', 'cpty_bank_dom', 'cpty_branch_address_line_1', 'cpty_branch_address_line_2', 'cpty_branch_dom','','', " +
				   "'cpty_bank_swift_bic_code', 'cpty_bank_code', 'cpty_branch_code', 'cpty_branch_name','beneficiary_name', '','','bene_adv_beneficiary_id_no_send', " +
				   "'bene_adv_mailing_name_add_1_no_send','bene_adv_mailing_name_add_2_no_send','bene_adv_mailing_name_add_3_no_send','bene_adv_mailing_name_add_4_no_send', " +
				   "'bene_adv_mailing_name_add_5_no_send','bene_adv_mailing_name_add_6_no_send','bene_adv_postal_code_no_send','bene_adv_country_no_send','bene_email_1'," + 
				   "'bene_email_2','beneficiary_postal_code','beneficiary_country','bene_adv_fax_no_send',  'bene_adv_phone_no_send','beneficiary_nickname', 'cnaps_bank_code', 'cnaps_bank_name', 'mailing_address']",
				   { product_type: subProdCode, entity_name:entity, pabAccStat: dijit.byId('applicant_act_pab').get('value')}, 
				'', 
				subProdCode, 
				'width:710px;height:350px;', 
				m.getLocalization("LIST_TITLE_SDATA_LIST_OF_BANKS"),'', 'GetStaticData', false, 'GetStaticData');

		
		if(dj.byId("pre_approved_status") && dj.byId("pre_approved_status").get("value")==='Y' )
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
	
	d.mixin(m._config, {

		initReAuthParams : function() {

			var reAuthParams = {
				productCode : 'FT',
				subProductCode : dj.byId("sub_product_code")? dj.byId("sub_product_code").get("value"): '',
				transactionTypeCode : '01',
				entity :dj.byId("entity") ? dj.byId("entity").get("value") : "",
				currency : dj.byId("ft_cur_code")? dj.byId("ft_cur_code").get('value'): '',
				amount : dj.byId("ft_amt")? m.trimAmount(dj.byId("ft_amt").get('value')): '',
				
				es_field1 : dj.byId("ft_amt")? m.trimAmount(dj.byId("ft_amt").get('value')): '',
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
								if(d.byId(fxSection)&&(d.style(d.byId(fxSection),"display") === "none"))
								{
									m.animate("wipeIn", d.byId(fxSection));
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
			m.setValidation("template_id", m.validateTemplateId);
			m.connect("beneficiary_name", "onChange", m.checkBeneficiaryNicknameDiv);
			m.connect("applicant_act_name", "onChange", m.checkNickNameDiv);
			
			m.connect("applicant_act_no", "onChange", _applicantAccountButtonHandler);
			m.connect("entity", "onClick", m.validateRequiredField);
			m.connect("applicant_act_name", "onClick", m.validateRequiredField);
			m.connect("beneficiary_name", "onClick", m.validateRequiredField);
			
			m.connect("beneficiary_act_cur_code", "onClick", m.validateRequiredField);
			m.connect("beneficiary_account", "onClick", m.validateRequiredField);
			
			m.connect("cnaps_bank_code", "onClick", m.validateRequiredField);
			m.connect("cnaps_bank_name", "onClick", m.validateRequiredField);
			
			dj.byId("sub_product_code").set("value", "HVPS");	
					
			//Bind all recurring payment details fields
			m.bindRecurringFields();
			m.connect("ft_cur_code", "onChange", function() {
				m.setCurrency(this, ["ft_amt"]);
			});
			
			m.setValidation("ft_cur_code", m.validateCurrency);
			
			m.connect("beneficiary_account", "onChange", _validateBeneficiaryAccount);
			
			m.connect("applicant_act_name", "onChange", function() {
				_compareApplicantAndBenificiaryCurrency();
        	});
			
			m.connect("beneficiary_act_cur_code", "onChange", function() {	
				if(dj.byId("ft_cur_code") && !dj.byId("ft_cur_code").get("readOnly"))
					{
						dj.byId("ft_cur_code").set("value",dj.byId("beneficiary_act_cur_code").get("value"));
					}
			});
			//m.setValidation("beneficiary_act_cur_code", m.validateCurrency);
			
			m.connect("entity", "onChange", function() {				
				//m.setApplicantReference();
				dj.byId("applicant_act_name").set("value", "");
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
			
			m.connect("cnaps_bank_code", "onBlur", _validateCNAPSBankCode);
			
			m.connect("recurring_flag", "onClick", function(){
				m.showRecurring();
			});
			
			//do not store beneficiary id if not PAB
			m.connect("pre_approved_status","onChange",function() {
				if(dj.byId("pre_approved_status").get("value")==='N' )
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
				}
				var subProdField = dj.byId("sub_product_code");
			});
			
			m.connect("notify_beneficiary", "onClick", _changeBeneficiaryNotification);
			
			m.connect("notify_beneficiary_choice_1", "onClick", _changeBeneficiaryNotificationEmail);
			
			m.connect("notify_beneficiary_choice_2", "onClick", _changeBeneficiaryNotificationEmail);
			
			m.setValidation("notify_beneficiary_email", m.validateEmailAddr);
			
 	 	 	m.connect("notify_beneficiary_email", "onBlur", _validateEmailAddr);
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

		},	
	
		onFormLoad : function(){

			m.setCurrency(dj.byId("ft_cur_code"), ["ft_amt"]);

			if(misys._config.nickname==="true" && dj.byId("applicant_act_nickname") && dj.byId("applicant_act_nickname").get("value")!=="" && d.byId("nickname")){
				m.animate("fadeIn", d.byId("nickname"));
				 d.style("nickname","display","inline");
				d.byId("nickname").innerHTML = dj.byId("applicant_act_nickname").get("value");
			}else{
				m.animate("fadeOut", d.byId("applicant_act_nickname_row"));
			}

			m.initForm();
			
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
			
			m.checkBeneficiaryNicknameOnFormLoad();
			
			//Free Text Field Asterisk Sign(MPS-57517)
			dj.byId("free_format_text").set("required",true);
			if(document.getElementById('mandatorySpan') == undefined)
			{
				var mandatory = dojo.create('span' ,{'id':'mandatorySpan' , 'class' : 'required-field-symbol' ,'innerHTML' : '*' });
				d.parser.parse(mandatory);
				dojo.place(mandatory , dojo.byId('free_format_text') , "before");
			}
           

			//m.setApplicantReference();			

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
			if(d.byId(fxSection))
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
			dj.byId("sub_product_code").set("value", "HVPS");
			if (dj.byId("ft_cur_code") !== undefined) {
				dj.byId("ft_cur_code").set("value", "CNY");
			}
			dj.byId("beneficiary_act_cur_code").set("value", "CNY");
			
			if(document.getElementById('mandatorySpan') == undefined)
			{
				var mandatory = dojo.create('span' ,{'id':'mandatorySpan' , 'class' : 'required-field-symbol' ,'innerHTML' : '*' });
				d.parser.parse(mandatory);
				
			}
			
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
					if( (dj.byId("pre_approved") && dj.byId("pre_approved").get("value") === "") || (dj.byId("pre_approved") && dj.byId("pre_approved").get("value") === null))
					{
						beneficiary.toggleReadonly(false);	
						dj.byId("beneficiary_act_cur_code").set("readOnly", true);
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
					}
					else 
					{
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
			    }

			d.forEach(d.query(".CUR"),function(node, i)
			{
				d.style(node,"display","inline");
			});
			
			dj.byId("beneficiary_mode").set("value","02");

//			m.toggleRequired("beneficiary_act_cur_code", true);
			
			/*if(dj.byId("bank_img"))
			{
				dj.byId("bank_img").set("disabled", true);
			}*/
			
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
	    	if(entity && entity.get("value")== "")
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
	    	//Validate Recurring payment details prior to transaction submit
	    	 if(!m.isRecurringDetailsValidForSubmit())
	   		 {
		    		 return false;
	   		 }
	    	 //Validating if corresponding contract values are entered.
	    	 if(m._config.fxParamData && m._config.fxParamData[dj.byId("sub_product_code").get("value")].fxParametersData.isFXEnabled === "Y"){
					if(!m.fxBeforeSubmitValidation())
					{
						return false;
					}
					if(!_preSubmissionFXValidation())
					{
						return false;
					}
	         }	    	 
	    	 if(dj.byId("notify_beneficiary_email") && dj.byId("notify_beneficiary_email").get("value") !== ""){
					var email = dj.byId("notify_beneficiary_email").get("value");
					var size = email.split(";");
					if(size.length > 10){
						m._config.onSubmitErrorMsg =  m.getLocalization("checkEmailId");
						dj.byId("notify_beneficiary_email").set("value", "");
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
	     
	     showListOfBanks : function(){
	    	var subProdID = dijit.byId("sub_product_code").get("value");
    		m.showSearchDialog('bank',"['cpty_bank_name', 'cpty_bank_address_line_1', 'cpty_bank_address_line_2', 'cpty_bank_dom', 'cpty_bank_swift_bic_code', 'cpty_bank_contact_name', 'cpty_bank_phone', 'bank_country']", {swiftcode: false, bankcode: false}, '', '', 'width:710px;height:350px;', m.getLocalization("ListOfSwiftBanksTitleMessage"));
	     }
	});
})(dojo, dijit, misys);