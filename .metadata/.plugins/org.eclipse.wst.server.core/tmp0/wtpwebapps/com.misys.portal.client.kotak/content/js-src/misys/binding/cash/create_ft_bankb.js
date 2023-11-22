/*
 * ---------------------------------------------------------- 
date : 17/01/2017
author : gyapatel
 * 
 * ----------------------------------------------------------
 */
dojo.provide("misys.binding.cash.create_ft_bankb");

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
		var maxNbrContracts = m._config.fxParamData[dj.byId("sub_product_code").get("value")].fxParametersData.maxNbrContracts;
		
		if (boardRateOption && boardRateOption.get("checked") && totalUtiliseAmt && !isNaN(totalUtiliseAmt.get("value")) && ftAmt && !isNaN(ftAmt.get("value")) && ftAmt.get("value") < totalUtiliseAmt.get("value"))
		{
				error_message += m.getLocalization("FXUtiliseAmtGreaterMessage");
				valid = false;
		}
		
		m._config.onSubmitErrorMsg =  error_message;
		
		var totalAmt = 0;
			for(var j = 1; j<=maxNbrContracts; j++)
			{
				var contractAmt = "fx_contract_nbr_amt_"+j;
				totalAmt = totalAmt + dj.byId(contractAmt).get("value");
				if(dj.byId(contractAmt).get("state") === "Error" || totalAmt.toFixed(2) > totalUtiliseAmt.get("value"))
				{
					dj.byId(contractAmt).set("state", "Error");
					dj.byId(contractAmt).focus();
					valid = false;
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
		var typeItems 	= [],
        typeValues 	= [],
        array  = [],
	    curTypes =  "";
		
		var fromCurCode;
		if(dj.byId("applicant_act_cur_code") && dj.byId("applicant_act_cur_code").get("value") !== "")
		{
			fromCurCode = dj.byId("applicant_act_cur_code").get("value");
		}
		if(fromCurCode && dj.byId("ft_cur_code"))
		{
				curTypes = dj.byId("ft_cur_code");
				curTypes.store = null;
					
				var jsonData = {"identifier" :"id", "items" : []};
				var  productStore = new dojo.data.ItemFileWriteStore( {data : jsonData });
				productStore.newItem( {"id" :  fromCurCode, "name" : fromCurCode});
				curTypes.store = productStore;
			
		}
	}
	
	/**
	 * validate transfer date with invoice due date
	 */
	function validateTransferDateWithInvoiceDueDate()
	{
		if(dj.byId("invoice_due_date_hidden") && dj.byId("iss_date"))
		{
			var invoiceDueDate = dj.byId("invoice_due_date_hidden").get("value");
			var iss_date = dj.byId("iss_date").get("value");
			
			invoiceDueDate =invoiceDueDate.split('/');
			invoiceDueDate = new Date(invoiceDueDate[2],invoiceDueDate[1]-1,invoiceDueDate[0]); 
			
			if(invoiceDueDate < iss_date)
			{
				m.dialog.show("ERROR", m.getLocalization("issDateGreaterThanInvoiceDate"));
				return false;
			}
		}
		return true;
	}
	
	/**
	 * validate transfer amount with invoice due amount
	 */
	function validateTransferAmtWithInvoiceDueAmt()
	{
		if(dj.byId("invoice_due_amt_hidden") && dj.byId("ft_amt"))
		{
			var invoiceDueAmt = dj.byId("invoice_due_amt_hidden").get("value");
			var ft_amt = dj.byId("ft_amt").get("value");
			
			
			if(ft_amt > invoiceDueAmt)
			{
				m.dialog.show("ERROR", m.getLocalization("ftAmtLesserThanInvoiceAmt"));
				return false;
			}
		}
		return true;
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
		var subProdCode = dijit.byId("sub_product_code").get("value");
		var proSubProdCode = "FT:"+subProdCode;
		m.showSearchUserAccountsDialog("useraccount", "['beneficiary_name', 'beneficiary_account', 'beneficiary_account_id', 'beneficiary_act_cur_code', 'beneficiary_id','beneficiary_act_pab','beneficiary_act_product_types']",
					'applicant_act_no', 'entity', 'credit', proSubProdCode, 'width:750px;height:400px;', m.getLocalization("ListOfAccountsTitleMessage"),'','','','','','','');
	}
	
	/*
	 Clear certain fields on change of entity
	 */
	function _onEntityChange()
	{
		dojo.forEach(["applicant_act_name", "beneficiary_name", "beneficiary_act_cur_code", "beneficiary_account"], function(currentField) {
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
	}
	
	function _accountSelectionHandler()
	{
		var applicantActNo = dj.byId('applicant_act_no').get('value');
		_actionOnAmtCurrencyField();
	
        dojo.forEach(["beneficiary_name","beneficiary_act_cur_code"], function(currentField) {
            
            if (dj.byId(currentField)) 
                    {
                            dj.byId(currentField).set("value", "");
                    }
            });

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
								if(d.byId("fx-section")&&(d.style(d.byId("fx-section"),"display") === "none"))
								{
									m.animate("wipeIn", d.byId("fx-section"));
								}							
								m.fetchFXDetails(fromCurrency, toCurrency, amount, productCode, bankAbbvName, masterCurrency, isDirectConversion);
								if ((dj.byId("fx_rates_type_1") && dj.byId("fx_rates_type_1").get("checked")) && (isNaN(dj.byId("fx_exchange_rate").get("value")) || dj.byId("fx_exchange_rate_cur_code").get("value") === "" || isNaN(dj.byId("fx_exchange_rate_amt").get("value")) || (m._config.fxParamData[dj.byId("sub_product_code").get("value")].fxParametersData.toleranceDispInd === "Y" && (isNaN(dj.byId("fx_tolerance_rate").get("value")) || isNaN(dj.byId("fx_tolerance_rate_amt").get("value")) || dj.byId("fx_tolerance_rate_cur_code").get("value") === ""))))
								{
										_clearRequiredFields(m.getLocalization("FXDefaultErrorMessage"));
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
					}
			}
		},
		bind : function()
		{
			// binding for tolerance
			m.setValidation("iss_date", m.validateTransferDateCustomer);
			m.setValidation("template_id", m.validateTemplateId);
			m.connect("applicant_act_no", "onChange", _accountSelectionHandler);

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

			//Bind all recurring payment details fields
			m.bindRecurringFields();
			m.connect("ft_cur_code", "onChange", function() {
				m.setCurrency(this, ["ft_amt"]);
			});

			m.setValidation("beneficiary_act_cur_code", m.validateCurrency);

			m.connect("entity", "onChange", function() {
				_onEntityChange();
				m.setApplicantReference();		
			});

			m.connect("beneficiary_img", "onClick", _beneficiaryButtonHandler);

			m.connect("notify_beneficiary", "onClick", _changeBeneficiaryNotification);

			m.connect("notify_beneficiary_choice_1", "onClick", _changeBeneficiaryNotificationEmail);

			m.connect("notify_beneficiary_choice_2", "onClick", _changeBeneficiaryNotificationEmail);
			m.connect("recurring_flag", "onClick", m.showRecurring);
			m.setValidation("notify_beneficiary_email", m.validateEmailAddr);
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
				m.connect("applicant_act_cur_code", "onChange", function(){
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

		},	
		
		onFormLoad : function(){

			if(dj.byId("entity") && dj.byId("entity").get("value") !== "")
			{
				dj.byId("applicant_name").set("value", dj.byId("entity").get("value"));
			}
			m.setCurrency(dj.byId("ft_cur_code"), ["ft_amt"]);

			m.initForm();
			
			var modeValue = dijit.byId("mode") ? dijit.byId("mode").get("value") : "";

			//m.setApplicantReference();
            
			
			
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
			if(m._config.fxParamData && dj.byId("sub_product_code") && dj.byId("sub_product_code").get("value") !== "" )
			{
				m.initializeFX(dj.byId("sub_product_code").get("value"));
				if(applicantField && applicantField.get("value") !== "" && ftCurField && ftCurField.get("value") !== "" && beneficiaryField && (applicantField.get("value")!== ftCurField.get("value") || ftCurField.get("value") !== beneficiaryField.get("value")))
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
			var ftCurrencyField = dj.byId("ft_cur_code");
			if(ftCurrencyField)
			{
				var tempCurValue = ftCurrencyField.get("displayedValue");
				_actionOnAmtCurrencyField();
				ftCurrencyField.set("displayedValue", tempCurValue);
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
					if((dj.byId("fx_exchange_rate_cur_code") && dj.byId("fx_exchange_rate_cur_code").get("value")!== "")|| (dj.byId("fx_total_utilise_cur_code") && dj.byId("fx_total_utilise_cur_code").get("value")!== ""))
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
			//dj.byId("sub_product_code").set("value", "INT");

		},
	     
		beforeSaveValidations : function(){
			var entity = dj.byId("entity") ;
			if(entity && entity.get("value")=== "")
			{
				return false;
			}
			else
			{
				if(!validateTransferDateWithInvoiceDueDate())
		    	 {
		    		 m._config.onSubmitErrorMsg =  m.getLocalization("issDateGreaterThanInvoiceDate");
		    		 dj.byId("iss_date").set("value", null);
		    		 return false;
		    	 }
				if(!validateTransferAmtWithInvoiceDueAmt())
		    	 {
		    		 m._config.onSubmitErrorMsg =  m.getLocalization("ftAmtLesserThanInvoiceAmt");
		    		 dj.byId("ft_amt").set("value", null);
		    		 return false;
		    	 }
				return true;
			}
		},
	      
	     beforeSubmitValidations : function()
	     {
	    	 if(!validateTransferAmtWithInvoiceDueAmt())
	    	 {
	    		 m._config.onSubmitErrorMsg =  m.getLocalization("ftAmtLesserThanInvoiceAmt");
	    		 dj.byId("ft_amt").set("value", null);
	    		 return false;
	    	 }
	    	 var modeValue = dijit.byId("mode") ? dijit.byId("mode").get("value") : "";
	    	 var valid = false;
	    	 // Validate Recurring payment details prior to transaction submit
	    	 if(!m.isRecurringDetailsValidForSubmit())
	    	 {
	    		 return valid;
	    	 }

	    	 // Validate transfer amount should be greater than zero
	    	 if(dj.byId("ft_amt") && !m.validateAmount((dj.byId("ft_amt"))?dj.byId("ft_amt"):0))
	    	 {
	    			 m._config.onSubmitErrorMsg =  m.getLocalization("amountcannotzero");
	    			 dj.byId("ft_amt").set("value", "");
	    			 return valid;
	    	 }          
	    	 if(m._config.fxParamData && m._config.fxParamData[dj.byId("sub_product_code").get("value")].fxParametersData.isFXEnabled === "Y"){
	    		 if(!m.fxBeforeSubmitValidation())
	    		 {
	    			 return valid;
	    		 }
	    		 if(!_preSubmissionFXValidation())
	    		 {
	    			 return valid;
	    		 }
	    	 }

	    	 // do not validate holiday and cut off in the transaction for bulks
	    	 // this will be handled in the bulk level
	    	 if (!dj.byId("bulk_ref_id").get("value"))
	    	 {
	    		 valid = false;
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
	    	var subProdID = dijit.byId("sub_product_code").get("value");
    		m.showSearchDialog('bank',"['cpty_bank_name', 'cpty_bank_address_line_1', 'cpty_bank_address_line_2', 'cpty_bank_dom', 'cpty_bank_swift_bic_code', 'cpty_bank_contact_name', 'cpty_bank_phone', 'bank_country']", {swiftcode: false, bankcode: false}, '', '', 'width:710px;height:350px;', m.getLocalization("ListOfSwiftBanksTitleMessage"));
	     }
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.cash.create_ft_bankb_client');