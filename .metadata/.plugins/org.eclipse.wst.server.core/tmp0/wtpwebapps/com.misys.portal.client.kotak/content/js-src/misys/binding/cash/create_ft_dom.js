/*
 * ---------------------------------------------------------- 
 * Event Binding for domestic transfers
 * 
 * Copyright (c) 2000-2012 Misys (http://www.misys.com), All Rights Reserved.
 * 
 * version: 1.0 date: 23/10/2012
 * 
 * ----------------------------------------------------------
 */
dojo.provide("misys.binding.cash.create_ft_dom");

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

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode
	var fxMsgType = d.byId("fx-message-type");
	var hasCustomerBankValue = false;
	var formLoading = true;
	var validationFailedOrDraftMode = false;
	var fxSection="fx-section";
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
	
	  
    function _validateBankBranchCode()
		{
			//  summary: 
			//  If bank code and branch code both are populated then validate bank branch code
			var brch_code_field	=	dj.byId("cpty_branch_code"),
				bank_code_field	=	dj.byId("cpty_bank_code"),
				bank_name_field		=	dj.byId("cpty_bank_name"),
				branch_name_field		=	dj.byId("cpty_branch_name"),
				displayMessage  = 	"";
			
			if(bank_code_field && brch_code_field)
			{
				if(!(bank_code_field.get("value") === "") && !(brch_code_field.get("value") === ""))
				{
					m.xhrPost( {
						url 		: misys.getServletURL("/screen/AjaxScreen/action/ValidateBankBranchCodeAction") ,
						handleAs 	: "json",
						sync 		: true,
						content 	: {
							bank_code : bank_code_field.get("value"),
							brnch_code : brch_code_field.get("value"),
							internal : "N"
						},
						load : function(response, args){
							if (response.items.valid === false)
							{
								displayMessage = misys.getLocalization("invalidBankCodeBranchCode", [bank_code_field.get("value"),brch_code_field.get("value")]);
								//focus on the widget and set state to error and display a tooltip indicating the same
								//brch_code_field.focus();
								bank_name_field.set("value","");
								branch_name_field.set("value","");
								
								bank_code_field.set("state","Error");
								brch_code_field.set("state","Error");
								dj.hideTooltip(brch_code_field.domNode);
								dj.showTooltip(displayMessage, brch_code_field.domNode, 0);
							}
							else
							{
								console.debug("Validated Bank Branch Code");
								bank_name_field.set("value", response.items.bankName);
								branch_name_field.set("value", response.items.branchName);
								brch_code_field.set("readOnly", true);
								bank_code_field.set("readOnly", true);
								bank_name_field.set("readOnly", true);
								branch_name_field.set("readOnly", true);
								
							}
						},
						error 		: function(response, args){
							console.error("[Could not validate Bank Code Branch Code] "+ bank_code_field.get("value") + "," + brch_code_field.get("value"));
							console.error(response);
						}
					});
				}
				else
				{
					bank_name_field.set("value", "");
					branch_name_field.set("value", "");
					if(dj.byId("bank_img"))
					{
						dj.byId("bank_img").set("disabled",false);
					}
				}
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
	beneficiary.fields = [  'beneficiary_name',
	                		'beneficiary_account',
	                		'beneficiary_act_cur_code',	                		
	                		'beneficiary_address',
	                		'beneficiary_city',
	                		'beneficiary_dom',
	                		'cpty_bank_code',
	                		'cpty_bank_name',
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
			dj.byId("cpty_branch_name").set("readOnly", true);
			dj.byId("cpty_bank_name").set("readOnly", true);
		}
		d.style("PAB", "display", "none");
		beneficiary.clear();
		if(dj.byId("bank_img"))
		{
			dj.byId("bank_img").set("disabled",false);
		}
		dj.byId("pre_approved_status").set("value", "N");
		m.clearBeneficiaryAdviceFieldsForDefaultingFromBeneMaster();
	}	
	
	function _validateRegexBeneficiary()
	{				
		   		   
		   var regex = dj.byId("regexValue");
		   var products = dj.byId("allowedProducts");
		   		   
		   var regexStr =  regex ? dj.byId("regexValue").get("value") : '';
		   var productsStr = products ? dj.byId("allowedProducts").get("value") : '';
		   
		   var productTypeStr = 'DOM';
		   		   
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
					   /*errorMessage =  m.getLocalization("invalidBeneficiaryName");
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
			dj.byId("cpty_bank_code").set("readOnly", true);
			dj.byId("cpty_branch_code").set("readOnly", true);
			dj.byId("cpty_branch_name").set("readOnly", true);
			dj.byId("cpty_bank_name").set("readOnly", true);
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
				dj.byId("beneficiary_act_cur_code").set("readOnly", false);
				dj.byId("beneficiary_account").set("readOnly", false);
				dj.byId("cpty_bank_code").set("readOnly", false);
				dj.byId("cpty_branch_code").set("readOnly", false);
				dj.byId("cpty_branch_name").set("readOnly", true);
				dj.byId("cpty_bank_name").set("readOnly", true);
			}else
			{
				console.log("Adhoc mode is unavailable although selected debit account is non-PAB. Beneficiary is readonly");
				dj.byId("beneficiary_name").set("readOnly", true);
				dj.byId("beneficiary_act_cur_code").set("readOnly", true);
				dj.byId("beneficiary_account").set("readOnly", true);
				dj.byId("cpty_bank_code").set("readOnly", true);
				dj.byId("cpty_branch_code").set("readOnly", true);
				dj.byId("cpty_branch_name").set("readOnly", true);
				dj.byId("cpty_bank_name").set("readOnly", true);
				if(dj.byId("bank_img"))
				{
					dj.byId("bank_img").set("disabled",true);
				}
			}
		}
		
		// clear all beneficiary fields
		dojo.forEach(['pre_approved', 'ft_amt', 'beneficiary_account','beneficiary_act_cur_code', 'beneficiary_address', 'beneficiary_city', '', 'beneficiary_dom', 'pre_approved_status','','', 
		   		   'cpty_bank_name', 'cpty_bank_address_line_1', 'cpty_bank_address_line_2', 'cpty_bank_dom', 'cpty_branch_address_line_1', 'cpty_branch_address_line_2', 'cpty_branch_dom','','', 
		   		   'cpty_bank_swift_bic_code', 'cpty_bank_code', 'cpty_branch_code', 'cpty_branch_name', '', 'beneficiary_name', '','','bene_adv_beneficiary_id_no_send', 
		   		   'bene_adv_mailing_name_add_1_no_send','bene_adv_mailing_name_add_2_no_send','bene_adv_mailing_name_add_3_no_send','bene_adv_mailing_name_add_4_no_send', 
		   		   'bene_adv_mailing_name_add_5_no_send','bene_adv_mailing_name_add_6_no_send','bene_adv_postal_code_no_send','bene_adv_country_no_send','bene_email_1', 
		   		   'bene_email_2','beneficiary_postal_code','beneficiary_country', 'bene_adv_fax_no_send', 'bene_adv_ivr_no_send', 'bene_adv_phone_no_send'], function(currentField) {
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
		m.showSearchDialog("beneficiary_accounts", 
		   "['beneficiary_name','beneficiary_account','beneficiary_act_cur_code', 'beneficiary_address', 'beneficiary_city', '', 'beneficiary_dom', 'pre_approved_status','','', " +
		   "'cpty_bank_name', 'cpty_bank_address_line_1', 'cpty_bank_address_line_2', 'cpty_bank_dom', 'cpty_branch_address_line_1', 'cpty_branch_address_line_2', 'cpty_branch_dom','','', " +
		   "'cpty_bank_swift_bic_code', 'cpty_bank_code', 'cpty_branch_code', 'cpty_branch_name','pre_approved', '','','bene_adv_beneficiary_id_no_send', " +
		   "'bene_adv_mailing_name_add_1_no_send','bene_adv_mailing_name_add_2_no_send','bene_adv_mailing_name_add_3_no_send','bene_adv_mailing_name_add_4_no_send', " +
		   "'bene_adv_mailing_name_add_5_no_send','bene_adv_mailing_name_add_6_no_send','bene_adv_postal_code_no_send','bene_adv_country_no_send','bene_email_1'," + 
		   "'bene_email_2','beneficiary_postal_code','beneficiary_country','bene_adv_fax_no_send', 'bene_adv_phone_no_send', 'beneficiary_nickname']",
		   { product_type: subProdCode, entity_name:entity, pabAccStat: dijit.byId('applicant_act_pab').get('value'),debitAcctNo: applicantActNo}, 
		   '', subProdCode, 'width:710px;height:350px;', m.getLocalization("ListOfBeneficiriesTitleMessage"));
			
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
			dj.byId("beneficiary_act_cur_code").set("value", "");
			dj.byId("beneficiary_account").set("value", "");
			dj.byId("cpty_bank_code").set("value", "");
			dj.byId("cpty_branch_code").set("value", "");
			dj.byId("cpty_bank_name").set("value", "");
			dj.byId("cpty_branch_name").set("value", "");
			dj.byId("ft_cur_code").set("value", "");
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
				m.dialog.show("ERROR",m.getLocalization("crossCurrency"));
				dj.byId('beneficiary_name').set('value','');
				dj.byId('beneficiary_account').set('value','');
				dj.byId('beneficiary_act_cur_code').set('value','');
				dj.byId("ft_cur_code").set("value",'');
				dj.byId("cpty_bank_name").set("value",'');
				dj.byId("cpty_bank_code").set("value",'');
				dj.byId("cpty_branch_code").set("value",'');
				dj.byId("cpty_branch_name").set("value",'');
				return;
			}
		}
	
	d.mixin(m._config, {

		initReAuthParams : function() {

			var reAuthParams = {
				productCode : 'FT',
				subProductCode : dj.byId("sub_product_code").get("value"),
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
			m.setValidation("iss_date", m.validateTransferDateCustomer);
			m.connect("applicant_act_name", "onChange", m.checkNickNameDiv);
			m.connect("beneficiary_name", "onChange", m.checkBeneficiaryNicknameDiv);
			m.setValidation("template_id", m.validateTemplateId);	
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
			
			m.connect("cpty_bank_code", "onClick", m.validateRequiredField);
			m.connect("cpty_branch_code", "onClick", m.validateRequiredField);
			m.connect("cpty_bank_name", "onClick", m.validateRequiredField);
			m.connect("cpty_branch_name", "onClick", m.validateRequiredField);
			
			dj.byId("sub_product_code").set("value", "DOM");	
					
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
			
			m.connect("beneficiary_account", "onChange", _validateBeneficiaryAccount);
			
			m.connect("beneficiary_act_cur_code", "onChange", function() {	
				if(dj.byId("ft_cur_code") && !dj.byId("ft_cur_code").get("readOnly"))
					{
						dj.byId("ft_cur_code").set("value",dj.byId("beneficiary_act_cur_code").get("value"));
						dj.byId("ft_amt").set("value","");
					}
			});
			
			m.connect("entity", "onChange", function() {
				formLoading = true;
				dj.byId("applicant_act_name").set("value", "");
				dj.byId("beneficiary_nickname").set("value", "");
				dj.byId("beneficiary_name").set("value", "");
				dj.byId("applicant_act_nickname").set("value", "");
				dj.byId("beneficiary_act_cur_code").set("value", "");
				dj.byId("beneficiary_account").set("value", "");
				dj.byId("cpty_bank_code").set("value", "");
				dj.byId("cpty_branch_code").set("value", "");
				dj.byId("cpty_bank_name").set("value", "");
				dj.byId("cpty_branch_name").set("value", "");
				dj.byId("ft_cur_code").set("value", "");
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
			m.setValidation("beneficiary_name", _validateRegexBeneficiary);
			
			m.connect("beneficiary_name", "onChange", function(){
				_beneficiaryChangeHandler();
				var check_currency = dj.byId('currency_res').get('value');
				if(check_currency==="true")
        		{
				_compareApplicantAndBenificiaryCurrency();
        		}
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
			
			m.connect("cpty_bank_code", "onBlur", _validateBankBranchCode);
			
			m.connect("cpty_branch_code", "onBlur", _validateBankBranchCode);
			
			m.connect("recurring_flag", "onClick", function(){
				m.showRecurring();
			});
			
			//do not store beneficiary id if not PAB
			m.connect("pre_approved_status","onChange",function() {
				var beneficiaryName = dj.byId("beneficiary_name").get("value");
				
				if(dj.byId("pre_approved_status").get("value")==='N' )
				{
					if(beneficiaryName !== "")
						{
						if(dj.byId("bank_img"))
						{
							dj.byId("bank_img").set("disabled",true);
						}
						}
			else
				{
				if(dj.byId("bank_img"))
				{
					dj.byId("bank_img").set("disabled",false);
				}
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
			
			m.connect("notify_beneficiary_email", "onChange", m.validateNoOfEmails);
			
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

		},	
	
		onFormLoad : function(){
			var modeValue = dijit.byId("mode") ? dijit.byId("mode").get("value") : "";
			m.setCurrency(dj.byId("ft_cur_code"), ["ft_amt"]);
			
			m.initForm();
			if(modeValue === "DRAFT" && dj.byId("beneficiary_name") && dj.byId("applicant_act_pab") && dj.byId("applicant_act_pab").get("value") === "Y" && dj.byId("beneficiary_name").value !== "")
		    {
				if(!m.validateBeneficiaryStatus())
				{	
					dj.byId("beneficiary_name").set("state", "Error");
					dj.showTooltip(m.getLocalization("beneficiaryIsInactive"), dj.byId("beneficiary_name").domNode, 0);
				}
		    }

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
			dj.byId("sub_product_code").set("value", "DOM");
			
			var applicantAcctPAB = dj.byId("applicant_act_pab").get("value");
			//in case of draft/unsigned, if the beneficiary is pre-approved, display PAB label
			if(applicantAcctPAB === 'Y' || 
				(dj.byId("pre_approved_status") && dj.byId("pre_approved_status").get("value") === 'Y'))
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
			else
			{

				if((dj.byId("pre_approved") && dj.byId("pre_approved").get("value") === "") || (dj.byId("pre_approved") && dj.byId("pre_approved").get("value") === null))
				{
					beneficiary.toggleReadonly(false);	
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

			// Control initial visibility of the Clear button based on selected debit account
			if(d.byId("clear_img"))
			{
				if(applicantAcctPAB == 'Y' && d.style(d.byId("clear_img"),"display") !== "none")
				{
					m.animate("wipeOut", d.byId('clear_img'));
					console.log("Selected debit account is PAB. Hiding clear button");
				}
			}
			
			_validateBankBranchCode();
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
		     }
	    	// Validate the beneficiary only in case the account is PAB 
	    	if(modeValue === "DRAFT" && dj.byId("applicant_act_pab") && dj.byId("applicant_act_pab").get("value") === "Y" && !m.validateBeneficiaryStatus())
		    {
	    		 m._config.onSubmitErrorMsg =  m.getLocalization("beneficiaryIsInactive");
	    		 dj.byId("beneficiary_name").set("state", "Error");
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
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.cash.create_ft_dom_client');