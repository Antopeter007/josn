/*
 * ---------------------------------------------------------- 
 * Event Binding for paperinstrument
 * 
 * Copyright (c) 2000-2011 Misys (http://www.misys.com), All Rights Reserved.
 * 
 * version: 1.0 date: 07/03/11
 * 
 * author: Lithwin
 * ----------------------------------------------------------
 */
dojo.provide("misys.binding.cash.create_pi");
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

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {
	
	"use strict"; // ECMA5 Strict Mode
	var hasCustomerBankValue = false;
	var formLoading = true;
	var validationFailedOrDraftMode = false;
/*	_destroyWidgets: function()
	{
		if (misys._widgetsToDestroy) {
			dojo.forEach(misys._widgetsToDestroy, function(widgetIdToDestroy){
				if (dijit.byId(widgetIdToDestroy))
				{
					dijit.byId(widgetIdToDestroy).destroyRecursive();
				}
			});
		}
	}*/
	
	function _populateResponse(response, ioArgs)
	{ 
		//alert("Response: "+response);
		/*alert("Response items 0: "+response.items[0].get('value');*/
		/*alert("Response items 1: "+response.items[0].reauth_required);*/
		if(response){
		//var reauth2 = dj.byId("reauth_dialog"); 
		//dijit.byId("reauth_mode").set('value', 'Yahoooo');
		if(dj.byId('reauth_dialog_content'))
	    {
	     dj.byId('reauth_dialog_content').destroyRecursive();
	    }
		//display_es_field1_row
		dojo.byId("reauth_dialog_content").innerHTML = response;
		dojo.parser.parse("reauth_dialog_content");
		
		var reauth2 = dj.byId("reauth_dialog"); 
		reauth2.show();
		
		
		}else{
			alert('no need of reauth dialog');
		}
		//alert(response);
		/*if(dijit.byId("entityId")) 
		{
			dojo.byId("entityIdTrancheDiv").innerHTML = dijit.byId("entityId").get("value");
		}*/
		
		/*m.animate("wipeOut", "loan_summary_div", function(){
			var loanTrancheGrid = dijit.byId("loanTrancheGrid");
			var store = new dojo.data.ItemFileReadStore({data: response});
			loanTrancheGrid.setStore(store);
			d.byId("accountNumberTrancheDiv").innerHTML = response.items[0].ACCOUNT_NUMBER;
			d.byId("lineOfCreditTrancheDiv").innerHTML =  response.items[0].LINE_OF_CREDIT;
			d.byId("branchTrancheDiv").innerHTML =  response.items[0].BRANCH_NUMBER;	
			d.byId("accountNameTrancheDiv").innerHTML =  response.items[0].ACCOUNT_NAME;
			misys.animate("wipeIn", "loan_tranche_summary_div");
			loanTrancheGrid.resize();
		});*/
	}
	
	function _clearRequiredFields(message){
		var callback = function() {
			var widget = dijit.byId("ft_amt");
		 	widget.set("state","Error");
	 		m.defaultBindTheFXTypes();
		 	dj.byId('ft_amt').set('value', '');
		 	if(dj.byId('ft_cur_code') && !dj.byId('ft_cur_code').get('readOnly')){
		 		dj.byId('ft_cur_code').set('value', '');
		 	}
		};
		m.dialog.show("ERROR", message, '', function(){
			setTimeout(callback, 500);
		});
		if(d.byId("fx-section") && (d.style(d.byId("fx-section"),"display") !== "none"))
		{
			m.animate("wipeOut", d.byId('fx-section'));
		}
	}
	
	function _preSubmissionFXValidation(){
		var valid = true;
		var error_message = "";
		var boardRateOption = dj.byId("fx_rates_type_2");
		var totalUtiliseAmt = dj.byId("fx_total_utilise_amt");
		var ftAmt = dj.byId("ft_amt");
		
		if (boardRateOption.get('checked') && totalUtiliseAmt && !isNaN(totalUtiliseAmt.get('value')) && ftAmt && !isNaN(ftAmt.get('value'))) {
			if(ftAmt.get('value') < totalUtiliseAmt.get('value')){
			error_message += m.getLocalization("FXUtiliseAmtGreaterMessage");
			valid = false;
			}
		}
		
		m._config.onSubmitErrorMsg =  error_message;
		return valid;
	}

	function _okButtonHandler()
	{   
		var entity_field	=	dj.byId("entity") ? dj.byId("entity").get("value") : "",
		applicant_act_field	=	dj.byId("applicant_act_name"),
		displayMessage  = 	"";
		// displaying the tool tip error message if the value is not entered.
		if (entity_field.get("value") === '' || applicant_act_field.get("value") === '')
		{
			displayMessage = misys.getLocalization('remittanceToolTip', [entity_field.get("value"),applicant_act_field.get("value")]);
			//focus on the widget and set state to error and display a tool tip indicating the same
			if("S" + entity_field.get("value") === "S")
			{
				entity_field.focus();
				entity_field.set("state","Error");
				dj.hideTooltip(entity_field.domNode);
				dj.showTooltip(displayMessage, entity_field.domNode, 0);
			}
			if("S" + applicant_act_field.get("value") === "S")
			{
				applicant_act_field.focus();
				applicant_act_field.set("state","Error");
				dj.hideTooltip(applicant_act_field.domNode);
				dj.showTooltip(displayMessage, applicant_act_field.domNode, 0);
			}
		}
		
		if (dj.byId('applicant_act_name').get("value") !== '' /*|| dj.byId('applicant_act_product_types').get("value") !== ''*/)
		{
			m.toggleSections();
			
			//Beneficiary Advice Field's Parameter Configurations
			m.handleParametersConfigurations();
			// recuring payments
			m.showRecurring();
		}
		d.forEach(dojo.query(".piDisclaimer"),function(node){
			m.animate("fadeOut",node);		
	});
	}
	
	var beneficiary = { };
	beneficiary.fields = [  'beneficiary_name',
	                        'beneficiary_name_2',
	                        'beneficiary_name_3',
	                		'beneficiary_address',
	                		'beneficiary_city',
	                		'beneficiary_dom',
	                		'beneficiary_address_line_4',
	                		'beneficiary_postal_code',
	                		'beneficiary_country',
	                		'pre_approved'
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
		if(dj.byId("beneficiary_country_btn_img"))
		{
			dj.byId("beneficiary_country_btn_img").set("disabled", false);
		}
		d.style("pre_approved_benificiary","display","none");	
		
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
		d.style("pre_approved_benificiary", "display", "none");
		beneficiary.clear();
		dj.byId("pre_approved_status").set("value", "N");
		m.clearBeneficiaryAdviceFieldsForDefaultingFromBeneMaster();
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
		   
		   var beneficiaryId2 = dj.byId("beneficiary_name_2");
		   var beneficiaryStr2 = beneficiaryId2? dj.byId("beneficiary_name_2").get("value") : '';
		   
		   var beneficiaryId3 = dj.byId("beneficiary_name_3");
		   var beneficiaryStr3 = beneficiaryId3? dj.byId("beneficiary_name_3").get("value") : '';
		   
		   		 	   		  			   
		   var beneficiaryRegExp = new RegExp(regexStr);
		   
		   var isValid = false;
		   var isValid2 = false;
		   var isValid3 = false;
		   var errorMessage =  m.getLocalization("invalidBeneficiaryName");
		   
		   if (  productsStr.indexOf(productTypeStr) < 0  )   
		   {			   
			   if(regexStr !== null && regexStr !== '' && beneficiaryStr !== '' && beneficiaryStr !== null)
			   {			   			   
				   isValid = beneficiaryRegExp.test(beneficiaryStr);
				   
				   if(!isValid)
				   {					   					   
					   beneficiaryId.set("state","Error");
					   dj.hideTooltip(beneficiaryId.domNode);
					   dj.showTooltip(errorMessage, beneficiaryId.domNode, 0);
				   }				   
			   }
			   if(regexStr !== null && regexStr !== '' && beneficiaryStr2 !== '' && beneficiaryStr2 !== null)
			   {			   			   
				   isValid2 = beneficiaryRegExp.test(beneficiaryStr2);
				   
				   if(!isValid2)
				   {					   
					   beneficiaryId2.set("state","Error");
					   dj.hideTooltip(beneficiaryId2.domNode);
					   dj.showTooltip(errorMessage, beneficiaryId2.domNode, 0);
				   }				   
			   }
			   if(regexStr !== null && regexStr !== '' && beneficiaryStr3 !== '' && beneficiaryStr3 !== null)
			   {			   			   
				   isValid3 = beneficiaryRegExp.test(beneficiaryStr3);
				   
				   if(!isValid3)
				   {					   
					   beneficiaryId3.set("state","Error");
					   dj.hideTooltip(beneficiaryId3.domNode);
					   dj.showTooltip(errorMessage, beneficiaryId3.domNode, 0);
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
					d.style("pre_approved_benificiary","display","inline");
					beneficiary.toggleReadonly(true);
				}
				else
				{
					console.debug("Non-PAB accounts are not allowed, hiding PAB text");
					d.style("pre_approved_benificiary","display","none");
				}
				if(dj.byId("beneficiary_country_btn_img"))
				{
					dj.byId("beneficiary_country_btn_img").set("disabled", true);
				}
			}
			else
			{
				d.style("pre_approved_benificiary","display","none");
				if( (dj.byId("pre_approved") && dj.byId("pre_approved").get("value") === "") || dj.byId("pre_approved").get("value") === null)
				{
					 beneficiary.toggleReadonly(false);
					 if(dj.byId("beneficiary_country_btn_img"))
						{
							dj.byId("beneficiary_country_btn_img").set("disabled", false);
						}
				}
				else 
				{
					beneficiary.toggleReadonly(true);	
					if(dj.byId("beneficiary_country_btn_img"))
					{
						dj.byId("beneficiary_country_btn_img").set("disabled", true);
					}
				}
			}
		}
	}	

	
	/**
	 * called after selecting a deliveryMode
	 */
	function _deliveryModeChangeHandler() {
		if(dj.byId("adv_send_mode")){
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
				
				//dj.byId("mailing_other_country").set("readOnly",true);
				
			} 
			else {
				d.style("delivery_mode_08_div", "display", "none"); 
				d.style("delivery_mode_09_div", "display", "none"); 
				m.toggleFields(false,null,['collecting_bank_code', 'collecting_branch_code', 'collectors_name','collectors_id','mailing_other_name_address','mailing_other_postal_code','mailing_other_country']);
			} 
			
		}
	}
	
	function _applicantAccountButtonHandler()
	{
		
		var applicantAcctPAB = dj.byId("applicant_act_pab").get("value");
		
		if (applicantAcctPAB == "Y")
		{
			dj.byId("beneficiary_name").set("readOnly", true);
			if(dj.byId("beneficiary_country_btn_img"))
			{
				dj.byId("beneficiary_country_btn_img").set("disabled", true);
			}
		}
		else
		{
			if(m._config.non_pab_allowed)
			{
				dj.byId("beneficiary_name").set("readOnly", false);
			}else
			{
				console.log("Adhoc mode is unavailable although selected debit account is non-PAB. Beneficiary is readonly");
				dj.byId("beneficiary_name").set("readOnly", true);
			}
			if(dj.byId("beneficiary_country_btn_img"))
			{
				dj.byId("beneficiary_country_btn_img").set("disabled", false);
			}
		}
		
		// clear all beneficiary fields
		dojo.forEach(["pre_approved", "ft_amt", "beneficiary_account", "beneficiary_address", "beneficiary_city", "", "beneficiary_dom", "pre_approved_status","","", "cpty_bank_name", 
					"cpty_bank_address_line_1", "cpty_bank_address_line_2", "cpty_bank_dom", "cpty_branch_address_line_1", "cpty_branch_address_line_2", "cpty_branch_dom","","", 
					"cpty_bank_swift_bic_code", "cpty_bank_code", "cpty_branch_code", "cpty_branch_name", "", "beneficiary_name", "beneficiary_name_2","beneficiary_name_3","beneficiary_address_line_4","bene_adv_beneficiary_id_no_send", 
					"bene_adv_mailing_name_add_1_no_send","bene_adv_mailing_name_add_2_no_send","bene_adv_mailing_name_add_3_no_send","bene_adv_mailing_name_add_4_no_send", 
					"bene_adv_mailing_name_add_5_no_send","bene_adv_mailing_name_add_6_no_send","bene_adv_postal_code_no_send","bene_adv_country_no_send","bene_email_1", 
					"bene_email_2","beneficiary_postal_code","beneficiary_country", "bene_adv_fax_no_send", "bene_adv_ivr_no_send", "bene_adv_phone_no_send"], function(currentField) {
			if (dj.byId(currentField)) 
			{
				dj.byId(currentField).set("value", "");
			}
		});
		// clear fx section
		if(d.byId("fx-section") && (d.style(d.byId("fx-section"),"display") !== "none"))
		{
			m.animate("wipeOut", d.byId('fx-section'));
		}
		
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
	 * Either open a popup to select a Master Beneficiary or a user Account
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
		//beneficiary_name
		m.showSearchDialog('beneficiary_accounts', 
				   "['beneficiary_name','beneficiary_account','change_cur_code', 'beneficiary_address', 'beneficiary_city', 'beneficiary_address_line_4', 'beneficiary_dom', 'pre_approved_status', 'beneficiary_name_2', 'beneficiary_name_3', 'beneficiary_bank_name', 'beneficiary_bank_address_line_1', 'beneficiary_bank_address_line_2', 'beneficiary_bank_dom', 'beneficiary_branch_address_line_1', 'beneficiary_branch_address_line_2', 'beneficiary_branch_dom', 'beneficiary_bank_country', 'change_iso_code', 'beneficiary_bank_swift_bic_code', 'beneficiary_bank_code', 'beneficiary_branch_code', 'beneficiary_branch_name','pre_approved', 'change_threshold','change_threshold_curcode'" +
				   ",'bene_adv_beneficiary_id_no_send','bene_adv_mailing_name_add_1_no_send','bene_adv_mailing_name_add_2_no_send','bene_adv_mailing_name_add_3_no_send','bene_adv_mailing_name_add_4_no_send'" +
				   ",'bene_adv_mailing_name_add_5_no_send','bene_adv_mailing_name_add_6_no_send','bene_adv_postal_code_no_send','bene_adv_country_no_send','','','beneficiary_postal_code','beneficiary_country']",
				   {product_type: dijit.byId('sub_product_code').get('value'), entity_name: entity, pabAccStat: dijit.byId('applicant_act_pab').get('value'), debitAcctNo: applicantActNo},
				   '', 
				   dijit.byId('sub_product_code').get('value'),
				   'width:710px;height:350px;',
				   m.getLocalization("ListOfBeneficiriesTitleMessage"));			
		
		//Beneficiary Advice fields which are defaulted must be cleared
		m.clearBeneficiaryAdviceFieldsForDefaultingFromBeneMaster();
	}

	/**
	 * Customer Bank Field onChange handler
	 * 
	 * @method _handleCusomterBankOnChangeFields
	 * @private 
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
			if(dj.byId("option_for_app_date") && (dj.byId("option_for_app_date").get("value") === 'PIDD' || dj.byId("option_for_app_date").get("value") === 'PICO'))
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
			dj.byId("applicant_act_no").set("value", "");
			dj.byId("applicant_act_cur_code").set("value", "");
			dj.byId("applicant_act_description").set("value", "");
			dj.byId("applicant_act_pab").set("value", "");
			dj.byId("applicant_reference").set("value", "");
			dj.byId("adv_send_mode").set("value", "");
			
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
			if(d.byId("fx-section"))
				{
					d.style("fx-section","display","none");
				}
		}
		
		if(dijit.byId("ft_cur_code") && dijit.byId("ft_amt"))
		{
			misys.setCurrency(dijit.byId("ft_cur_code"), ["ft_amt"]);
		}
	}
	
	/**
	 * Update Customer Bank dependent fields.
	 * 
	 * @method _updateCustomerBankDependentFields
	 * @private 
	 */
	function _updateCustomerBankDependentFields()
	{
		var customerBankField = dj.byId("customer_bank");
		var customerBankFieldValue = customerBankField?customerBankField.get('value'):"";
		var subProdCodeValue = dj.byId("sub_product_code") ? dj.byId("sub_product_code").get("value"):"";
		var advSendModeField = dj.byId("adv_send_mode");
		var issuingBankAbbvNameField = dj.byId("issuing_bank_abbv_name");
		var issuingBankDescNameField = dj.byId("issuing_bank_name");
		
		if(customerBankFieldValue !== "")
		{
			if (issuingBankAbbvNameField)
			{
				issuingBankAbbvNameField.set("value", customerBankFieldValue);
			}
			if (misys._config.customerBankDetails && issuingBankDescNameField)
			{
				issuingBankDescNameField.set("value",
						misys._config.customerBankDetails[customerBankFieldValue][0].value);
			}
		}
		
		if(misys._config.isMultiBank && customerBankFieldValue !== "" && subProdCodeValue !== ""){
			
				m.xhrPost( {
					url : m.getServletURL("/screen/AjaxScreen/action/GetParamDataForPIAction"),
					handleAs 	: "json",
					sync 		: true,
					content : {
						customer_bank : customerBankFieldValue,
						sub_product_code : subProdCodeValue
					},
					load : function(response, args){
						console.debug("[Checked] whether the parameter configuration exists.");
						advSendModeField.set('store', new dojo.data.ItemFileReadStore({data: response.deliveryModes}));
					}
				});
			}
		}

	/**
	 * Update Base currency field on selection of Customer Bank.
	 * 
	 * @method _updateBaseCurrencyPerCustomerBank
	 * @private 
	 */
	function _updateBaseCurrencyPerCustomerBank()
	{
		var customerBankField = dj.byId("customer_bank");
		var customerBankFieldValue = customerBankField ? customerBankField.get('value') : "";
		var ftCurCodeField = dj.byId("ft_cur_code");
		var subProdCodeField = dijit.byId("sub_product_code");
		
		if (customerBankField)
		{
			if (customerBankFieldValue === "")
			{
				// if no customer bank clear FT currency code.
				ftCurCodeField.set('value', "");
			}
			else if (customerBankFieldValue !== "" && ftCurCodeField && subProdCodeField && subProdCodeField.get('value') === "PICO" && misys._config.bankBaseCurCode)
			{
				// if there is customer bank and PICO transaction, map it's base currency to the FT currency code.
				ftCurCodeField.set('value', misys._config.bankBaseCurCode[customerBankFieldValue]);
			}
		}
	}
	
	/**
	 * Update Recurring Payment fields on selection of Customer Bank.
	 * 
	 * @method _updateRecurringPaymentPerCustomerBank
	 * @private 
	 */
	function _updateRecurringPaymentPerCustomerBank()
	{
		var customerBankField = dj.byId("customer_bank");
		var recurringPaymentChkBox = d.byId("recurring_payment_checkbox");
		if(customerBankField && customerBankField.get("value") !== "" && misys._config.perBankRecurringAllowed)
		{
			var recurringFlag = misys._config.perBankRecurringAllowed[customerBankField.get("value")];
			
			if(recurringFlag === "Y" && recurringPaymentChkBox)
			{
				m.animate("fadeIn", recurringPaymentChkBox);
			}
			else
			{
				if(dj.byId("recurring_flag"))
				{
					dj.byId("recurring_flag").set("checked", false);
				}
				if(recurringPaymentChkBox)
				{
					m.animate("fadeOut", recurringPaymentChkBox);
				}
				if(d.byId("recurring_payment_div"))
			   {
				   d.style("recurring_payment_div","display","none");
			   }
			}
		}
		else
		{
			m.animate("fadeOut", recurringPaymentChkBox);
		}
	}
	function _compareApplicantAndBenificiaryCurrency()
	{
		var applicant_act_cur_code = dj.byId('applicant_act_cur_code').get('value');
		var ft_cur_code = dj.byId('ft_cur_code').get('value');
		if (applicant_act_cur_code !== '' && ft_cur_code !== '' && applicant_act_cur_code !== ft_cur_code  )
			{
				if(dj.byId("sub_product_code").get("value") === "PICO")
				{
					m.dialog.show("ERROR",m.getLocalization("mismatchFrom"));
				}
				else
				{
					m.dialog.show("ERROR",m.getLocalization("crossCurrency"));
				}
				dj.byId('applicant_act_name').set('value','');
				dj.byId('applicant_act_cur_code').set('value','');
				if(dj.byId("sub_product_code").get("value") !== "PICO")
				{
					dj.byId("ft_cur_code").set("value",'');
				}
				dj.byId("ft_amt").set("value",'');
				return;
			}
	}
	
	d.mixin(m._config, {

		initReAuthParams : function() {

			var reAuthParams = {
				productCode : 'FT',
				subProductCode : dj.byId("sub_product_code")? dj.byId("sub_product_code").get("value"): '',
				transactionTypeCode : '01',
				entity : dj.byId("entity") ? dj.byId("entity").get("value") : "",
				currency : dj.byId("ft_cur_code")? dj.byId("ft_cur_code").get('value'): '',
				amount : dj.byId("ft_amt")? m.trimAmount(dj.byId("ft_amt").get('value')): '',
				bankAbbvName : dj.byId("customer_bank")? dj.byId("customer_bank").get("value") : "",
				es_field1 : dj.byId("ft_amt")? m.trimAmount(dj.byId("ft_amt").get('value')): '',
				es_field2 : (dj.byId("beneficiary_account")) ? dj.byId(
						"beneficiary_account").get('value') : ''
			};
			return reAuthParams;
		}
	});
	
	d.mixin(m, {
		
		fireFXAction : function(){
			if(m._config.fxParamData && dj.byId("sub_product_code") && dj.byId("sub_product_code").get("value") !== "" && dj.byId("issuing_bank_abbv_name") && dj.byId("issuing_bank_abbv_name").get("value") !== ""){
				   var fxParamObject = m._config.fxParamData[dj.byId("sub_product_code").get("value")][dj.byId("issuing_bank_abbv_name").get("value")];
				if(m._config.fxParamData && fxParamObject.isFXEnabled === 'Y'){
					var fromCurrency,toCurrency;
					var ftCurrency = dj.byId("ft_cur_code").get("value");
					var amount = dj.byId("ft_amt").get("value");
					var ftAcctCurrency = dj.byId("applicant_act_cur_code").get("value");
					var productCode = m._config.productCode;
					var bankAbbvName = "";
					if(dj.byId("issuing_bank_abbv_name") && dj.byId("issuing_bank_abbv_name").get("value")!== ""){
						bankAbbvName = dj.byId('issuing_bank_abbv_name').get('value');
					}
					var masterCurrency = dj.byId("applicant_act_cur_code").get("value");
					var isDirectConversion = false;
						if(ftCurrency !== "" && productCode !== "" && bankAbbvName !== "" ){
							if(ftCurrency !== ftAcctCurrency){
								fromCurrency = ftAcctCurrency;
								toCurrency   = ftCurrency;
								masterCurrency = ftAcctCurrency;
							}
							if(fromCurrency && fromCurrency !== "" && toCurrency && toCurrency !== "" && !isNaN(amount)){
								if(d.byId("fx-section") &&(d.style(d.byId("fx-section"),"display") === "none"))
								{
									m.animate("wipeIn", d.byId("fx-section"));
								}
								var subProduct = dj.byId("sub_product_code").get("value");
								m.fetchFXDetails(fromCurrency, toCurrency, amount, productCode, bankAbbvName, masterCurrency, isDirectConversion);
								if(dj.byId("fx_rates_type_1") && dj.byId("fx_rates_type_1").get("checked")){
									if(isNaN(dj.byId("fx_exchange_rate").get("value")) || dj.byId("fx_exchange_rate_cur_code").get("value") === "" ||
											isNaN(dj.byId("fx_exchange_rate_amt").get("value")) || (fxParamObject.toleranceDispInd === "Y" && (isNaN(dj.byId("fx_tolerance_rate").get("value")) || 
											isNaN(dj.byId("fx_tolerance_rate_amt").get("value")) || dj.byId("fx_tolerance_rate_cur_code").get("value") === ""))){
										_clearRequiredFields(m.getLocalization("FXDefaultErrorMessage"));
									}
								}
							}else{
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
		
		bind : function() {
			
			// binding
			m.setValidation("fx_tolerance_rate", m.validateToleranceAndExchangeRate);
			m.setValidation("fx_exchange_rate", m.validateToleranceAndExchangeRate);
			m.setValidation("template_id", m.validateTemplateId);
			m.connect("applicant_act_name", "onChange", m.checkNickNameDiv);
			m.connect("beneficiary_name", "onChange", m.checkBeneficiaryNicknameDiv);			
			m.connect("applicant_act_no", "onChange", _applicantAccountButtonHandler);
			
			m.connect("entity", "onClick", m.validateRequiredField);
			m.connect("applicant_act_name", "onClick", m.validateRequiredField);
			m.connect("beneficiary_name", "onClick", m.validateRequiredField);
			m.connect("beneficiary_address", "onClick", m.validateRequiredField);
			m.connect("drawn_on_country", "onClick", m.validateRequiredField);
			m.connect("customer_bank", "onChange", function(){
				m.handleMultiBankRecurring(validationFailedOrDraftMode);
				//this is to handle an onchange event which was getting triggered while onformload
				validationFailedOrDraftMode = false;
			});
			//Bind all recurring payment details fields
			m.bindRecurringFields();
			
			m.connect("entity", "onChange", function(){				
				dj.byId("applicant_act_name").set("value", "");
				dj.byId("applicant_act_nickname").set("value", "");
				formLoading = true;
				if(misys._config.isMultiBank && dj.byId("customer_bank")){
					dj.byId("customer_bank").set("value", "");
					m.populateCustomerBanks();
					_updateBaseCurrencyPerCustomerBank();
				}
			});
			m.connect("applicant_act_name", "onChange", function()
			{
				var check_currency = dj.byId('currency_res').get('value');
				if(check_currency==="true")
		        {
					_compareApplicantAndBenificiaryCurrency();
		        }
			});
			if (misys._config.isMultiBank)
			{
				m.connect("customer_bank", "onChange", function()
				{
					_updateBaseCurrencyPerCustomerBank();
					_handleCusomterBankOnChangeFields();
					_updateCustomerBankDependentFields();
					_updateRecurringPaymentPerCustomerBank();
				});
				
				m.connect("applicant_act_name", "onChange", function()
				{
					var customerBankField = dj.byId("customer_bank");
					var customerBankFieldValue = customerBankField ? customerBankField.get('value') : "";
					var applicantActNameField = dj.byId("applicant_act_name");
					if (customerBankFieldValue !== m._config.customerBankName && applicantActNameField && applicantActNameField.get("value") !== "")
					{
						customerBankField.set("value", m._config.customerBankName);
					}
					var check_currency = dj.byId('currency_res').get('value');
					if(check_currency==="true")
	        		{
					_compareApplicantAndBenificiaryCurrency();
	        		}
				});
			}
			
			m.connect("button_intrmdt_ok", "onClick", _okButtonHandler);
						
			m.connect("beneficiary_img", "onClick", _beneficiaryButtonHandler);
			
			m.connect("clear_img", "onClick", _clearButtonHandler);
			
			m.connect("beneficiary_name", "onChange", _beneficiaryChangeHandler);
			
			/*m.connect("beneficiary_postal_code", "onKeyPress", _validatePostalCodeLength);
			m.connect("beneficiary_country", "onBlur", _validatePostalCodeLength);
			m.connect("mailing_other_postal_code", "onKeyPress", _validatePostalCodeLength);
			m.connect("mailing_other_country", "onBlur", _validatePostalCodeLength);*/
			m.setValidation("beneficiary_country", m.validateCountry);
			m.setValidation("mailing_other_country", m.validateCountry);
			
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
			
			m.setValidation("drawn_on_country", m.validateCountry);
			
			m.setValidation("legal_country", m.drawn_on_country);
			
			m.connect("recurring_flag", "onClick", m.showRecurring);
			
			m.connect("adv_send_mode", "onChange", _deliveryModeChangeHandler);

			var subProduct = dj.byId("sub_product_code").get("value");			
			if(dj.byId("issuing_bank_abbv_name") && dj.byId("issuing_bank_abbv_name").get("value") !== "" && m._config.fxParamData && m._config.fxParamData[subProduct][dj.byId("issuing_bank_abbv_name").get("value")].isFXEnabled === 'Y'){
				//Start FX Actions
				m.connect('ft_cur_code', 'onBlur', function(){
					m.setCurrency(this, ['ft_amt']);
					if(dj.byId('ft_cur_code').get('value') !== '' && !isNaN(dj.byId('ft_amt').get('value'))){
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
					if(check_currency==="true" && dj.byId("sub_product_code").get("value") === "PIDD")
		    		{
						_compareApplicantAndBenificiaryCurrency();
		    		}
				});
				m.connect('ft_amt', 'onBlur', function(){
					m.setTnxAmt(this.get('value'));
					if(!isNaN(dj.byId('ft_amt').get('value')) && dj.byId('ft_cur_code').get('value') !== ''){
						m.fireFXAction();
					}else{
						m.defaultBindTheFXTypes();
					}
				});
			}
			
			//Binding for Beneficiary Advice
			m.beneAdvBinding();
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
			//m.animate("wipeOut", d.byId('content1'),_showContent2);
			return true;
		},

		onFormLoad : function() {
			
			m.initForm();
			
			if(misys._config.nickname==="true" && dj.byId("applicant_act_nickname") && dj.byId("applicant_act_nickname").get("value")!=="" && d.byId("nickname")){
				m.animate("fadeIn", d.byId("nickname"));
				 d.style("nickname","display","inline");
				d.byId("nickname").innerHTML = dj.byId("applicant_act_nickname").get("value");
			}else{
				m.animate("fadeOut", d.byId("applicant_act_nickname_row"));
			}
			
	    	if(misys._config.isMultiBank)
			{
	    		m.populateCustomerBanks(true);
				var customerBankField = dj.byId("customer_bank");
				var customerBankHiddenField = dj.byId("customer_bank_hidden");
				var entity = dj.byId("entity");
				var issuingBankAbbvNameField = dj.byId("issuing_bank_abbv_name");
				var issuingBankDescNameField = dj.byId("issuing_bank_name");
				var recurringPaymentChkBox = dojo.byId("recurring_payment_checkbox");
				if(customerBankField && customerBankHiddenField)
				{
					customerBankField.set("value", customerBankHiddenField.get("value"));
				}
				if(issuingBankAbbvNameField && issuingBankAbbvNameField.get("value") !== "")
				{
					hasCustomerBankValue = true;
					formLoading = true;
					customerBankField.set("value", issuingBankAbbvNameField.get("value"));
					customerBankHiddenField.set("value", issuingBankAbbvNameField.get("value"));
				}
				if(entity && entity.get("value") === "" && customerBankField)
				{
					customerBankField.set("disabled",true);
					customerBankField.set("required",false);
				}
				if(misys._config.perBankRecurringAllowed && recurringPaymentChkBox && customerBankField)
				{
					if (customerBankField.get("value") === "")
					{
						m.animate("fadeOut", recurringPaymentChkBox);
					}
					else if (customerBankField.get("value") !== "" && misys._config.perBankRecurringAllowed[customerBankField.get("value")] !== "Y")
					{
						m.animate("fadeOut", recurringPaymentChkBox);
					}
				}
			}
	    	m.checkBeneficiaryNicknameOnFormLoad();
			m.setCurrency(dj.byId("ft_cur_code"), ["ft_amt"]);
			_deliveryModeChangeHandler();
		
			/*if(dj.byId('applicant_act_no') && dj.byId('applicant_act_no').get('value') === '')
			{
				d.style('content1','display','block');
				d.style('content2','display','none');							
			}
			else
			{
				d.style('content1','display','none');
				d.style('content2','display','block');
				
			}*/
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
			d.forEach(d.query(".piDisclaimer"),function(node){
				var productDisclaimer = dj.byId("sub_product_code").get("value")+'_'+'DISCLAIMER';
				if(dj.byId("sub_product_code") && (node.id == productDisclaimer))
				{
					m.animate("fadeIn", productDisclaimer);
				}
			});
			//m.setApplicantReference();
			
    		var subProduct = dj.byId("sub_product_code").get("value");
			if(!m._config.isMultiBank && dj.byId("issuing_bank_abbv_name") && dj.byId("issuing_bank_abbv_name").get("value") !== "" && m._config.fxParamData && m._config.fxParamData[subProduct][dj.byId("issuing_bank_abbv_name").get("value")].isFXEnabled === 'Y'){
				m.initializeFX(dj.byId("sub_product_code").get("value"), dj.byId("issuing_bank_abbv_name").get("value"));
				//Start FX Actions	
				if(dj.byId('applicant_act_cur_code') && dj.byId('applicant_act_cur_code').get('value') !== '' && dj.byId('ft_cur_code') && dj.byId('ft_cur_code').get('value') !== '' && dj.byId('applicant_act_cur_code').get('value')!== dj.byId('ft_cur_code').get('value') )
				{
					m.onloadFXActions();
				}
				else
				{
					m.defaultBindTheFXTypes();
				}
				//End FX Actions
			}
			//hide fx section by default
			if(d.byId("fx-section"))
				{
					//In case of bulk, from template will have amount and currency values on load, hence show fx section
					if(dj.byId("bulk_ref_id").get("value") !== '' && dj.byId('ft_cur_code').get('value') !== '' && !isNaN(dj.byId('ft_amt').get('value')))
					{
						m.initializeFX(dj.byId("sub_product_code").get("value"), dj.byId("issuing_bank_abbv_name").get("value"));
						m.fireFXAction();
					}
					else
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
					}
				}
			//Beneficiary Advice Form Load Actions 
			m.beneAdvFormLoad();
			//show recurring payment check box based on configuration
			m.hasRecurringPayment();
			//Show Recurring Payment details section and validate start date
			m.showSavedRecurringDetails(true);
			
			// Control initial visibility of the Clear button based on selected debit account
			var applicantAcctPAB = dj.byId("applicant_act_pab").get("value");

			if(d.byId("clear_img"))
			{
				if(applicantAcctPAB == 'Y' && d.style(d.byId("clear_img"),"display") !== "none")
				{
					m.animate("wipeOut", d.byId('clear_img'));
					console.log("Selected debit account is PAB. Hiding clear button");
				}
			}
		}, 
		
		initForm : function()
		{	
			// TODO remove from here, use the one in the product
			
			var applicantAcctPAB = dj.byId("applicant_act_pab");
			//in case of draft/unsigned, if the beneficiary is pre-approved, display PAB label
			if(applicantAcctPAB && dj.byId("pre_approved_status") && (applicantAcctPAB.get("value") === 'Y' || dj.byId("pre_approved_status").get("value") === 'Y'))
			{
				// DisplayPAB text only if non-PAB are allowed
				if(m._config.non_pab_allowed)
				{
					d.style("pre_approved_benificiary","display","inline");
				} else
				{
					console.debug("Non-PAB accounts not allowed. Hide PAB text");
					d.style("pre_approved_benificiary","display","none");
				}
				beneficiary.toggleReadonly(true);	
				if(dj.byId("beneficiary_country_btn_img"))
				{
					dj.byId("beneficiary_country_btn_img").set("disabled",true);
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

				if(dj.byId("pre_approved") && (dj.byId("pre_approved").get("value") === "" || (dj.byId("pre_approved") && dj.byId("pre_approved").get("value") === null)))
				{
					beneficiary.toggleReadonly(false);	
					if(dj.byId("beneficiary_country_btn_img"))
					{
						dj.byId("beneficiary_country_btn_img").set("disabled",false);
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
					if(dj.byId("beneficiary_country_btn_img"))
					{
						dj.byId("beneficiary_country_btn_img").set("disabled",true);
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
			// Control initial visibility of the Clear button based on selected debit account
			if(d.byId("clear_img"))
			{
				if(applicantAcctPAB === 'Y' && d.style(d.byId("clear_img"),"display") !== "none")
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
		
		beforeSubmitValidations : function() {
			
			//validate transfer amount should be greater than zero
			if(dj.byId("ft_amt"))
			{
				if(!m.validateAmount((dj.byId("ft_amt"))?dj.byId("ft_amt"):0))
				{
					m._config.onSubmitErrorMsg =  m.getLocalization("amountcannotbezero");
					dj.byId("ft_amt").set("value", "");
					return false;
				}
			}   
	 		
			if(dj.byId("issuing_bank_abbv_name") && dj.byId("issuing_bank_abbv_name").get("value") !== "" && m._config.fxParamData && m._config.fxParamData[dj.byId("sub_product_code").get("value")][dj.byId("issuing_bank_abbv_name").get("value")].isFXEnabled === 'Y'){				
				if(!m.fxBeforeSubmitValidation())
				{
					return false;
				}
				if(!_preSubmissionFXValidation())
					{
						return false;
					}
			}
			
			 //Validate Recurring payment details prior to transaction submit
	    	 if(!m.isRecurringDetailsValidForSubmit())
	   		 {
		    		 return false;
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
	    		if(!m.beneAdvBeforeSubmitValidation())
				{
					return false;
				}
	    	   var valid = false;
		       var modeValue = dijit.byId("mode") ? dijit.byId("mode").get("value") : "";
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
       dojo.require('misys.client.binding.cash.create_pi_client');