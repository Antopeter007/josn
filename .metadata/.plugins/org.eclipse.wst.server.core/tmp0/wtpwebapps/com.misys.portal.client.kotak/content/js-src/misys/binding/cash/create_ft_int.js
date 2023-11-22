/*
 * ----------------------------------------------------------
 * Event Binding for Internal transfers
 * Copyright (c) 2000-2012 Misys (http://www.misys.com), All Rights Reserved.
 * version: 1.0 date: 23/10/2012
 * ----------------------------------------------------------
 */
dojo.provide("misys.binding.cash.create_ft_int");
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
		var bank_desc_name= null;
		var customer_bank = dj.byId("customer_bank").get("value");
		if(misys && misys._config && misys._config.businessDateForBank && misys._config.businessDateForBank[customer_bank] && misys._config.businessDateForBank[customer_bank][0] && misys._config.businessDateForBank[customer_bank][0].value !== '')
		{
			var date = misys._config.businessDateForBank[customer_bank][0].value;
			var yearServer = date.substring(0,4);
			var monthServer = date.substring(5,7);
			var dateServer = date.substring(8,10);
			date = dateServer + "/" + monthServer + "/" + yearServer;
			var date1 = new Date(yearServer, monthServer - 1, dateServer);
			if(dj.byId("option_for_tnx") && dj.byId("option_for_tnx").get("value") === 'SCRATCH_INT')
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
			dj.byId("beneficiary_name").set("value", "");
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
			dj.byId("issuing_bank_abbv_name").set("value",dj.byId("customer_bank").get("value"));
			bank_desc_name = misys._config.customerBankDetails[dj.byId("customer_bank").get("value")][0].value;
    		dj.byId("issuing_bank_name").set("value",bank_desc_name);
		}
		
		hasCustomerBankValue = false;
		if(dj.byId("customer_bank") && dj.byId("customer_bank").get("value") !== "")
		{
			formLoading = false;
			if(dj.byId("issuing_bank_abbv_name").get("value")!== "")
			{
				bank_desc_name = misys._config.customerBankDetails[dj.byId("customer_bank").get("value")][0].value;
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
	function _changeBeneficiaryNotification()
	{
		var sendNotifyChecked = dj.byId("notify_beneficiary").get("checked");
		var choice1 = dj.byId("notify_beneficiary_choice_1");
		var choice2 = dj.byId("notify_beneficiary_choice_2");
		var notifyEmail = dj.byId("notify_beneficiary_email");
		choice1.set("disabled", !sendNotifyChecked);
		choice2.set("disabled", !sendNotifyChecked);
		notifyEmail.set("disabled",!sendNotifyChecked);
		choice1.set("checked", false);
		choice2.set("checked", false);
		notifyEmail.set("value","");
		var notifyEmailDOM = d.byId("notify_beneficiary_email_node");
		var notifyRadio2DOM = d.byId("label_notify_beneficiary_choice_2");		
		d.place(notifyEmailDOM, notifyRadio2DOM, "after");
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
		}
		else
		{
			if (!email)
			{
				m.dialog.show("ERROR", m.getLocalization("noBeneficiaryEmail"));
				notifyRadio2.set("checked", true);
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
		}
	}
	function _actionOnAmtCurrencyField()
	{
		var curTypes =  "";
		var fromCurCode, toCurCode;
		if(dj.byId("applicant_act_cur_code") && dj.byId("applicant_act_cur_code").get("value") !== '')
		{
			fromCurCode = dj.byId("applicant_act_cur_code").get("value");
		}
		if(dj.byId("beneficiary_act_cur_code") && dj.byId("beneficiary_act_cur_code").get("value"))
		{
			toCurCode = dj.byId("beneficiary_act_cur_code").get("value");
		}
		if(fromCurCode && toCurCode)
		{
			if(dj.byId('ft_cur_code')){
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
		var subProdCode = dijit.byId('sub_product_code').get('value');
		var proSubProdCode = "FT:"+subProdCode;
		m.showSearchUserAccountsDialog("useraccount", "['beneficiary_name', 'beneficiary_account', 'beneficiary_account_id'," +
				"'beneficiary_act_cur_code', 'beneficiary_id','beneficiary_act_pab','beneficiary_act_product_types','','','','','beneficiary_account_nickname']",
				'applicant_act_no', 'entity', 'credit', proSubProdCode, 'width:750px;height:400px;',
				m.getLocalization("ListOfAccountsTitleMessage"),'','','','','','','');
	}
	/*
	 Clear certain fields on change of entity
	 */
	function _onEntityChange()
	{
		dojo.forEach(["applicant_act_name","applicant_act_nickname","beneficiary_act_nickname", "beneficiary_name", "ft_cur_code", "beneficiary_act_cur_code", "ft_amt", "beneficiary_account"], function(currentField) {
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
	}
	function _accountSelectionHandler()
	{
		var applicantActNo = dj.byId("applicant_act_no").get("value");
		var beneficiaryActNo = dj.byId("beneficiary_account").get("value");
		if (applicantActNo!=="" && beneficiaryActNo!=="" && applicantActNo === beneficiaryActNo)
		{
			m.dialog.show("ERROR", m.getLocalization("sameBeneficiaryApplicantError"));
			dj.byId("applicant_act_no").set("value", "");
			dj.byId("applicant_act_name").set("value", "");
			dj.byId("beneficiary_name").set("value", "");
			dj.byId("beneficiary_account").set("value", "");
			return;
		} else {
			_actionOnAmtCurrencyField();
		}
        dojo.forEach(["beneficiary_name","ft_amt","beneficiary_act_cur_code"], function(currentField) {
            if (dj.byId(currentField)) 
                    {
                            dj.byId(currentField).set("value", "");
                    }
            });
	}
	
	function _getFeeforGPP(){	
		var accountNo = dj.byId("applicant_act_no") ? dj.byId("applicant_act_no").get("value") : "";	
		var accountCur = dj.byId("applicant_act_cur_code") ? dj.byId("applicant_act_cur_code").get("value") : "";	
		var amt = dj.byId("ft_amt") ? dj.byId("ft_amt").get("value") : "";	
		var cur = dj.byId("ft_cur_code") ? dj.byId("ft_cur_code").get("value") : "";	
		var iss_date = dj.byId("iss_date") ? dj.byId("iss_date").get("value") : "";	
		if(iss_date){	
			iss_date = iss_date.toISOString();	
		}	
		var product_code = dj.byId("productcode") ? dj.byId("productcode").get("value") : "";	
		var sub_prod_code = dj.byId("sub_product_code") ? dj.byId("sub_product_code").get("value") : "";	
		var bankAbbvName = dj.byId("issuing_bank_abbv_name") ? dj.byId("issuing_bank_abbv_name").get("value") : "";	
		var companyId = dj.byId("company_id") ? dj.byId("company_id").get("value") : "";	
		var paymentType;	
		var onlineResponse = "";	
		if(dj.byId("sub_product_code") && dj.byId("sub_product_code").get("value") === 'INT')	
		{	
			paymentType ="BOOK";	
		}	
		else if(dj.byId("sub_product_code") && dj.byId("sub_product_code").get("value") === 'MT101')	
		{	
			paymentType ="SWIFT";	
		}	
		var charge_bearer = "SLEV";	
		var bicCode = dj.byId("issuing_bank_iso_code") ? dj.byId("issuing_bank_iso_code").get("value") : "";	
			m.xhrPost({	
				url : m.getServletURL("/screen/AjaxScreen/action/GetFeeAPIAction"),	
				handleAs : "json",	
				sync : true,	
				content : {	
					accountIdentification : accountNo,	
					accountCurrency : accountCur,	
					bic:bicCode,	
					amount:amt,	
					currency:cur,	
					valueDate:iss_date,	
					clearingScheme:paymentType,	
					ChargeBearer:charge_bearer,	
					productcode:product_code,	
					sub_product_code:sub_prod_code,	
					bank_abbv_name:bankAbbvName,	
					company_id:companyId	
				},	
				load : function(response, args)	
				{	
					if(response.getFeeFlag === true && response.statusCode === "200")	
					{	
						dj.byId("payment_fee_amt").set("value", response.totalFeeAmount);	
						dj.byId("payment_fee_cur_code").set("value", response.debitAccountCurrency);	
						dj.byId("payment_fee_debit_amt").set("value", response.debitFeeAmount);	
						dj.byId("payment_tax_debit_fees").set("value", response.taxOnDebitFees);	
						dj.byId("payment_tax_debit_fees_tax").set("value", response.taxOnTaxOnDebitFees);	
						dj.byId("payment_fee_agent_amt").set("value", response.agentFees);	
						onlineResponse = response;	
					}	
					else	
					{	
						if(dj.byId("payment_fee_amt") && dj.byId("payment_fee_cur_code") && dj.byId("payment_fee_amt").get("value") !=="")	
						{	
							dj.byId("payment_fee_amt").set("value", "");	
							dj.byId("payment_fee_cur_code").set("value", "");	
							dj.byId("payment_fee_debit_amt").set("value", "");	
							dj.byId("payment_tax_debit_fees").set("value", "");	
							dj.byId("payment_tax_debit_fees_tax").set("value", "");	
							dj.byId("payment_fee_agent_amt").set("value", "");	
						}	
						onlineResponse = response;	
					}	
				},	
				error : function(response, args){	
					console.error("[misys.grid._base] GetProductConfirmPopUp error", response);	
				}	
			});	
			return onlineResponse;	
	}
	
	function _compareApplicantAndBenificiaryCurrency()
	{
		var applicant_act_cur_code = dj.byId('applicant_act_cur_code').get('value');
		var beneficiary_act_cur_code = dj.byId('beneficiary_act_cur_code').get('value');
		if (applicant_act_cur_code !== "" && beneficiary_act_cur_code !== "" && applicant_act_cur_code !== beneficiary_act_cur_code)
			{
				m.dialog.show("ERROR",m.getLocalization("crossCurrency"));
				dj.byId('beneficiary_name').set('value','');
				dj.byId('beneficiary_account').set('value','');
				dj.byId('beneficiary_act_cur_code').set('value','');
				dj.byId("ft_cur_code").set("value",'');
				return;
			}
	}
		/*function _validateFeesForms( Boolean doRealValidation,
						 Array forms) {

			console.debug("[misys.common] Validating forms in the page ...");
			var _feesFormToValidateSelector = ".validate";
			var 
			// Forms to validate. Reverse sort it so "fakeform0" is validated first
			formsToValidate = (forms || d.query(_feesFormToValidateSelector)).reverse(),
			draftTerm = dj.byId("draft_term"),
			result = true;
			
			if(draftTerm) {
			draftTerm.validate();
			}
			
			d.forEach(formsToValidate, function(form) {
			console.debug("[misys.common] Validating form", form.id);
			var formObj = dj.byId(form.id);
			
			// TODO Workaround, GridMultipleItems are not hooking into the validation for
			// some reason. Despite their state being Error, the overall form state is 
			// empty. Calling _getState() explicitly seems to fix it.
			if(formObj._getState() !== ""|| formObj.state !== "") {
				if(doRealValidation) {
					formObj.validate();
				}
				result = false;
			}
			}
			);
			console.debug("[misys.common] Validation result", result);
			
			return result;
			}*/
	d.mixin(m._config, {
		initReAuthParams : function() {
			var reAuthParams = {
				productCode : 'FT',
				subProductCode : dj.byId("sub_product_code").get("value"),
				transactionTypeCode : '01',
				entity :dj.byId("entity") ? dj.byId("entity").get("value") : "",
				currency : dj.byId("ft_cur_code")? dj.byId("ft_cur_code").get('value'): "",
				amount : dj.byId("ft_amt")? m.trimAmount(dj.byId("ft_amt").get('value')): "",
				bankAbbvName : dj.byId("customer_bank")? dj.byId("customer_bank").get("value") : "",
				es_field1 : dj.byId("ft_amt")? m.trimAmount(dj.byId("ft_amt").get('value')): "",
				es_field2 : (dj.byId("beneficiary_account")) ? dj.byId("beneficiary_account").get('value') : ''
			};
			return reAuthParams;
		}
	});
	d.mixin(m, {
		fireFXAction : function()
		{
			if (dj.byId("issuing_bank_abbv_name") && dj.byId("issuing_bank_abbv_name").get("value") !== "" && m._config.fxParamData && dj.byId("sub_product_code") && dj.byId("sub_product_code").get("value") !== "")
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
								if(d.byId(fxSection)&&(d.style(d.byId(fxSection),"display") === "none"))
								{
									m.animate("wipeIn", d.byId(fxSection));
								}							
								m.fetchFXDetails(fromCurrency, toCurrency, amount, productCode, bankAbbvName, masterCurrency, isDirectConversion);
								if(dj.byId("fx_rates_type_1") && dj.byId("fx_rates_type_1").get("checked"))
								{
									if(isNaN(dj.byId("fx_exchange_rate").get("value")) || dj.byId("fx_exchange_rate_cur_code").get("value") === "" ||
											isNaN(dj.byId("fx_exchange_rate_amt").get("value")) ||
											(m._config.fxParamData[dj.byId("sub_product_code").get("value")][dj.byId("issuing_bank_abbv_name").get("value")].toleranceDispInd === "Y" && 
											(isNaN(dj.byId("fx_tolerance_rate").get("value")) || 
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
			m.connect("beneficiary_name", "onChange", function(){
				if(misys._config.nickname==="true"){
					if(dj.byId("beneficiary_act_nickname") && dj.byId("beneficiary_act_nickname").get("value")!=="" && 
							d.byId("beneficiary_name_nickname_row") && d.byId("ben_nickname")){
						d.style("ben_label", "display", "inline-block");
						d.byId("ben_nickname").innerHTML = dj.byId("beneficiary_act_nickname").get("value");
						d.byId("ben_nickname").value = dj.byId("beneficiary_act_nickname").get("value");
						d.style("ben_nickname", "display", "inline");
						m.animate("fadeIn", d.byId("beneficiary_name_nickname_row"));
					}else{
						if(d.byId("ben_nickname")){
							d.style("ben_nickname", "display", "none");
						}
					}
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
					if(customer_bank !== "" && misys && misys._config && misys._config.businessDateForBank && 
							misys._config.businessDateForBank[customer_bank][0] && misys._config.businessDateForBank[customer_bank][0].value !== "")
					{
						var yearServer = parseInt(misys._config.businessDateForBank[customer_bank][0].value.substring(0,4), 10);
						var monthServer = parseInt(misys._config.businessDateForBank[customer_bank][0].value.substring(5,7), 10);
						var dateServer = parseInt(misys._config.businessDateForBank[customer_bank][0].value.substring(8,10), 10);
						this.dropDown.currentFocus = new  Date(yearServer, monthServer - 1, dateServer);
					}
				}
			});
			m.setValidation("template_id", m.validateTemplateId);
			m.connect("applicant_act_no", "onChange", _accountSelectionHandler);
			m.connect("customer_bank", "onChange", function(){
				m.handleMultiBankRecurring(validationFailedOrDraftMode);
				//this is to handle an onchange event which was getting triggered while onformload
				validationFailedOrDraftMode = false;
			});
			if(dj.byId("bulk_ref_id") && dj.byId("bulk_ref_id").get("value") !== "" && dj.byId("issuing_bank_abbv_name") && 
					dj.byId("issuing_bank_abbv_name").get('value') !== "")
			{
				m.initializeFX(dj.byId("sub_product_code").get("value"), dj.byId("issuing_bank_abbv_name").get("value"));
				if(dj.byId('applicant_act_cur_code') && dj.byId('applicant_act_cur_code').get('value') !== '' && dj.byId('ft_cur_code') && 
						dj.byId('ft_cur_code').get('value') !== '' && dj.byId('applicant_act_cur_code').get('value')!== dj.byId('ft_cur_code').get('value') && 
						!isNaN(dj.byId("ft_amt").get("value")))
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
			m.connect("entity", "onClick", m.validateRequiredField);
			m.connect("applicant_act_name", "onClick", m.validateRequiredField);
			m.connect("beneficiary_name", "onClick", m.validateRequiredField);
			m.connect("beneficiary_name", "onChange", function(){
				if(dj.byId("ft_cur_code") && !dj.byId("ft_cur_code").get("readOnly"))
				{
					_actionOnAmtCurrencyField();
				}
			});
			m.connect("beneficiary_act_cur_code", "onChange", function() {	
				if(dj.byId("ft_cur_code") && !dj.byId("ft_cur_code").get("readOnly"))
				{
					dj.byId("ft_cur_code").set("value",dj.byId("beneficiary_act_cur_code").get("value"));	
					dj.byId("ft_amt").set("value","");
					_actionOnAmtCurrencyField();
				}
			});
			m.connect("beneficiary_name", "onChange", m.validateMandatoryRemarks);
			dj.byId("sub_product_code").set("value", "INT");
			//Bind all recurring payment details fields
			m.bindRecurringFields();
			m.connect("ft_cur_code", "onChange", function() {
				m.setCurrency(this, ["ft_amt"]);
				 m.validateMandatoryRemarks();
			});
			m.setValidation("beneficiary_act_cur_code", m.validateCurrency);
			m.connect("entity", "onChange", function() {
				_onEntityChange();
				formLoading = true;
				dj.byId("applicant_act_name").set("value", "");
				dj.byId("ft_cur_code").set("value", "");
				dj.byId("ft_amt").set("value", "");
				dj.byId("iss_date").set("value", null);
				if(misys._config.isMultiBank && dj.byId("customer_bank")){
					dj.byId("customer_bank").set('disabled', false);
					dj.byId("customer_bank").set("value", "");
					m.populateCustomerBanks();
				}
				if(!misys._config.isMultiBank) {
					m.setApplicantReference();
				}
			});
			m.connect("beneficiary_name", "onChange", function() {
				var check_currency = dj.byId('currency_res').get('value');
				if(check_currency==="true" )
        		{
					_compareApplicantAndBenificiaryCurrency();
        		}
			});	
			m.connect("beneficiary_img", "onClick", _beneficiaryButtonHandler);
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
			m.connect("applicant_act_name", "onChange",function(){
				if(dj.byId("ft_cur_code") && dj.byId("ft_cur_code").get("value") !== "")
				{
					dj.byId("ft_cur_code").set("value","");
					var jsonData = {"identifier" :"id", "items" : []};
					var currencyStore = new dojo.data.ItemFileWriteStore( {data : jsonData });
					dj.byId("ft_cur_code").set('store', currencyStore);
				}
			});
			m.setValidation("notify_beneficiary_email", m.validateEmailAddr);
			var subProduct = dj.byId("sub_product_code").get("value");			
			if(dj.byId("issuing_bank_abbv_name") && dj.byId("issuing_bank_abbv_name").get("value") !== "" && 
					m._config.fxParamData && m._config.fxParamData[subProduct][dj.byId("issuing_bank_abbv_name").get("value")].isFXEnabled === "Y"){
				//Start FX Actions
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
			
			m.connect("ft_amt", "onChange", function(){
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
			
			m.connect("ft_cur_code", "onChange", function(){
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
			m.setCurrency(dj.byId("ft_cur_code"), ["ft_amt"]);
			m.initForm();
			var modeValue = dijit.byId("mode") ? dijit.byId("mode").get("value") : "";
			if(misys._config.nickname==="true" && dj.byId("applicant_act_nickname") && 
					dj.byId("applicant_act_nickname").get("value")!=="" && d.byId("nickname")){
				m.animate("fadeIn", d.byId("nickname"));
				d.style("nickname","display","inline");
				d.byId("nickname").innerHTML = dj.byId("applicant_act_nickname").get("value");
			}else if(misys._config.nickname==="true" && dj.byId("beneficiary_act_nickname") && 
					dj.byId("beneficiary_act_nickname").get("value")!=="" && d.byId("ben_nickname")){
				m.animate("fadeIn", d.byId("ben_nickname"));
				d.style("ben_nickname","display","inline");
				d.byId("ben_nickname").innerHTML = dj.byId("beneficiary_act_nickname").get("value");
			}else{
				m.animate("fadeOut", d.byId("applicant_act_nickname_row"));
				m.animate("fadeOut", d.byId("beneficiary_name_nickname_row"));
			}
			if(dj.byId("customer_bank") && dj.byId("customer_bank").get("value") !== '' && misys && 
					misys._config && misys._config.businessDateForBank && misys._config.businessDateForBank[dj.byId("customer_bank").get("value")] && 
					misys._config.businessDateForBank[dj.byId("customer_bank").get("value")][0] && 
					misys._config.businessDateForBank[dj.byId("customer_bank").get("value")][0].value !== '')
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
				if(dj.byId("issuing_bank_abbv_name") && dj.byId("issuing_bank_abbv_name").get("value") !== "")
				{
					hasCustomerBankValue = true;
					formLoading = true;
					linkedBankField.set("value", dj.byId("issuing_bank_abbv_name").get("value"));
					linkedBankHiddenField.set("value", dj.byId("issuing_bank_abbv_name").get("value"));
				}
				if(entityField && entityField.get("value") === "" && linkedBankField)
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
			else {
				m.setApplicantReference();
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
          //hide fx section by default
			var applicantField = dj.byId("applicant_act_cur_code");
			var beneficiaryField = dj.byId("beneficiary_act_cur_code");
			var ftCurField = dj.byId("ft_cur_code");
			if(!m._config.isMultiBank && dj.byId("issuing_bank_abbv_name") && dj.byId("issuing_bank_abbv_name").get("value") !== "" && m._config.fxParamData && dj.byId("sub_product_code") && dj.byId("sub_product_code").get("value") !== "" )
			{
				m.initializeFX(dj.byId("sub_product_code").get("value"), dj.byId("issuing_bank_abbv_name").get("value"));
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
					if((dj.byId("fx_exchange_rate_cur_code") && dj.byId("fx_exchange_rate_cur_code").get("value")!== "")|| 
							(dj.byId("fx_total_utilise_cur_code") && dj.byId("fx_total_utilise_cur_code").get("value")!== ""))
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
			dj.byId("sub_product_code").set("value", "INT");		
		},
		setCustomConfirmMessage : function(){
	     	var modeValue = dijit.byId("mode") ? dijit.byId("mode").get("value") : "";
	     	 if(modeValue === "DRAFT")
    		 {	
	     		var  hostResponse  =  _getFeeforGPP();	
	    		 if(hostResponse.getFeeFlag == true && hostResponse.statusCode !== "200")
	    		 {	
		    			var submitGetFee = m.getLocalization("getFeeErrorResponse");	
		    			m._config.globalSubmitConfirmationMsg = submitGetFee;	
		    	}
	    		 else if(hostResponse.getFeeFlag && hostResponse.statusCode === "200")
	    		{
	    			 	var amountMsg = m.getLocalization("submitTransactionConfirmation");
	    			 	m._config.globalSubmitConfirmationMsg = amountMsg+
						_paymentGeneralDetailsPopUpBlock()+
						_paymentTransfertoDetailsPopUpBlock()+
						_paymentTransactionDetailsPopUpBlock()+
						_paymentFeesDetailsPopUpBlock(hostResponse);
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
			if(entity && entity.get("value")=== "")
			{
				return false;
			}
			return true;
		},
	     beforeSubmitValidations : function()
	     {
	    	 var modeValue = dijit.byId("mode") ? dijit.byId("mode").get("value") : "";
	    	 // Validate Recurring payment details prior to transaction submit
	    	 if(!m.isRecurringDetailsValidForSubmit())
	    	 {
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

	    	 if(dj.byId("issuing_bank_abbv_name") && dj.byId("issuing_bank_abbv_name").get("value") !== "" && m._config.fxParamData && m._config.fxParamData[dj.byId("sub_product_code").get("value")][dj.byId("issuing_bank_abbv_name").get("value")].isFXEnabled === "Y")
	    	 {
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
    		m.showSearchDialog('bank',"['cpty_bank_name', 'cpty_bank_address_line_1', 'cpty_bank_address_line_2', 'cpty_bank_dom'," +
    				" 'cpty_bank_swift_bic_code', 'cpty_bank_contact_name', 'cpty_bank_phone', 'bank_country']", {swiftcode: false, bankcode: false},
    				'', '', 'width:710px;height:350px;', m.getLocalization("ListOfSwiftBanksTitleMessage"));
	     }
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.cash.create_ft_int_client');