/*
 * ---------------------------------------------------------- 
 * Event Binding for Bill Payment and DDA
 * 
 * Copyright (c) 2000-2011 Misys (http://www.misys.com), All Rights Reserved.
 * 
 * version: 1.0 date: 28/09/11
 * 
 * author: Lithwin
 * ----------------------------------------------------------
 */
dojo.provide("misys.binding.cash.create_bp_dda");

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
dojo.require("misys.validation.common");
dojo.require("misys.binding.cash.ft_common");
dojo.require("misys.form.BusinessDateTextBox");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {
	
	"use strict"; // ECMA5 Strict Mode

	function _setTnxAmount()
	{
		m.setTnxAmt(dj.byId("ft_amt").get("value"));
	}
	function _okButtonHandler()
	{	
		var entity_field	=	dj.byId("entity"),
		applicant_act_field	=	dj.byId("applicant_act_name"),
		displayMessage = 	"";
		// displaying the tool tip error message if the value is not entered.
		if (entity_field && (entity_field.get("value") === '' || applicant_act_field.get("value") === ''))
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
		else if (dj.byId("applicant_act_name").get("value") !== "")
		{
			m.toggleSections();
			m.showRecurring();
		}
		
		if(misys._config.nickname==="true"){
			if(dj.byId("applicant_act_nickname") && dj.byId("applicant_act_nickname").get("value")!==""){
				d.style("label", "display", "inline-block");
				m.animate("fadeIn", d.byId("nickname"));
				 d.style("nickname","display","inline");
				d.byId("nickname").innerHTML = dj.byId("applicant_act_nickname").get("value");
			}else{
				m.animate("wipeOut", d.byId("applicant_act_nickname_row"));
			}
		}
		
		if(misys._config.isMultiBank && dj.byId("issuing_bank") && dj.byId("issuing_bank").get("value")!==""){
			dj.byId("issuing_bank_name").set("value", dj.byId("issuing_bank").get("value"));
			dj.byId("issuing_bank_abbv_name").set("value", dj.byId("issuing_bank").get("value"));
		}
		if(dj.byId("applicant_name") && dj.byId("applicant_name").get("value")===""){
			dj.byId("applicant_name").set("value", entity_field.get("value"));
		}
		d.forEach(dojo.query(".bpddaDisclaimer"),function(node){
			m.animate("fadeOut",node);		
	});
	}
	
	d.mixin(m._config, {

		initReAuthParams : function() {

			var reAuthParams = {
				productCode : 'FT',
				subProductCode : dj.byId("sub_product_code").get("value"),
				transactionTypeCode : '01',
				entity : (dj.byId("entity")) ? dj.byId("entity").get('value') : '',
				currency : dj.byId("ft_cur_code")? dj.byId("ft_cur_code").get('value'): '',
				amount : dj.byId("ft_amt")? m.trimAmount(dj.byId("ft_amt").get('value')): '',

				es_field1 : dj.byId("ft_amt")? m.trimAmount(dj.byId("ft_amt").get('value')): '',
				es_field2 : (dj.byId("beneficiary_account")) ? dj.byId(
						"beneficiary_account").get('value') : ''
						
			};
			return reAuthParams;
		}
	});
	
	d.mixin(m, {
		bind : function() {

			m.setValidation("iss_date", m.validateTransferDateCustomer);
			
			m.connect("application_act_name", "onChange", function(){
				if(dj.byId("application_act_nickname_row") && dj.byId("application_act_nickname_row").get("value")!==""){
					m.animate("fadeId", d.byId("nickname"));
					d.byId("nickname").innerHTML = dj.byId("applicant_act_nickname").get("value");
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
	
			m.setValidation("start_date", m.validateStartDate);
			m.setValidation("end_date", m.validateEndDate);
			
			m.connect("customer_bank", "onChange", function(){
				var customer_bank = dj.byId("customer_bank").get("value"); 
				dj.byId("customer_bank_hidden").set("value", dj.byId("customer_bank").get("value"));
				dj.byId("issuing_bank_abbv_name").set("value",dj.byId("customer_bank").get("value"));
				var bank_desc_name = misys._config.customerBankDetails[customer_bank][0].value;
				dj.byId("issuing_bank_name").set("value",bank_desc_name);
				
				
				if(misys && misys._config && misys._config.businessDateForBank && misys._config.businessDateForBank[customer_bank] && misys._config.businessDateForBank[customer_bank][0] && misys._config.businessDateForBank[customer_bank][0].value !== '')
				{
					var date = misys._config.businessDateForBank[customer_bank][0].value;
					var yearServer = date.substring(0,4);
					var monthServer = date.substring(5,7);
					var dateServer = date.substring(8,10);
					date = dateServer + "/" + monthServer + "/" + yearServer;
					var date1 = new Date(yearServer, monthServer - 1, dateServer);
					if(misys && misys._config && misys._config.option_for_app_date === "SCRATCH")
					{
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
				
			});

			//Bind all recurring payment details fields
			m.bindRecurringFields();
			
			m.connect("ft_amt", "onChange", _setTnxAmount);
			m.connect("entity", "onClick", m.validateRequiredField);
			m.connect("applicant_act_name", "onClick", m.validateRequiredField);
			
			m.connect("entity", "onChange", function(){				
				d.query('#display_entity_row div')[0].innerHTML = dj.byId("entity").get("value");
				//m.setApplicantReference();
				dj.byId("applicant_act_name").set("value", '');
			});
			
			m.connect("applicant_act_name", "onChange", function(){				
				d.query('#display_account_row div')[0].innerHTML = dj.byId("applicant_act_name").get("value");					
			});			
			
			m.connect("button_intrmdt_ok", "onClick", _okButtonHandler);
			
			m.connect("action", "onChange", function() {
				if(this.get("value") == "MODIFY") {
					m.animate("wipeIn", d.byId('dda-update-amount'));
				} else {
					m.animate("wipeOut", d.byId('dda-update-amount'));
				}
			});
			
			if(dijit.byId("ft_cur_code") && dijit.byId("ft_amt"))
			{
				 misys.setCurrency(dijit.byId("ft_cur_code"), ["ft_amt"]);
			}
			m.connect("recurring_flag", "onClick", m.showRecurring);
		},
		
		showReference: function(/*String*/ helpText) {
			m.dialog.show('Alert', helpText);
		},
		
		showFields : function() {
			
			if(dj.byId("entity")) {
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
			}
			
			var domNode2 = dj.byId("transfer_from").domNode;
			if(dj.byId("transfer_from").get("value") === ""){
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

		cancelAction : function() {
			if(dj.byId("entity")) {
				dj.byId("entity").reset();
			}
			dj.byId("transfer_from").reset();
			dj.byId("recurring_flag").reset();
		},
		
		onFormLoad : function() {
			if (dj.byId("action"))
			{
				dj.byId("action").set("value", "MODIFY");
			}
			if(misys._config.isMultiBank)
			{
				
				if(dj.byId("customer_bank")){
					var customer_bank = dj.byId("customer_bank").get("value"); 
				}
				dj.byId("customer_bank").set("value", dj.byId("customer_bank_hidden").get("value"));
				dj.byId("issuing_bank_abbv_name").set("value",dj.byId("customer_bank").get("value"));
				var bank_desc_name = misys._config.customerBankDetails[dj.byId("customer_bank").get("value")][0].value;
				dj.byId("issuing_bank_name").set("value",bank_desc_name);
				if(customer_bank !== "" && misys && misys._config && misys._config.businessDateForBank && misys._config.businessDateForBank[customer_bank] && misys._config.businessDateForBank[customer_bank][0] && misys._config.businessDateForBank[customer_bank][0].value !== "")
				{
					var date = misys._config.businessDateForBank[customer_bank][0].value;
					var yearServer = date.substring(0,4);
					var monthServer = date.substring(5,7);
					var dateServer = date.substring(8,10);
					date = dateServer + "/" + monthServer + "/" + yearServer;
					var date1 = new Date(yearServer, monthServer - 1, dateServer);
					if(misys && misys._config && misys._config.option_for_app_date === "SCRATCH")
					{
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
				if(misys._config.perBankRecurringAllowed && misys._config.perBankRecurringAllowed[dj.byId("customer_bank").get("value")]==="Y")
				{
					m.animate("fadeIn", dojo.byId("recurring_payment_checkbox_div"));
				}
				else{
					m.animate("fadeOut", dojo.byId("recurring_payment_checkbox_div"));
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
			
			if(misys._config.nickname==="true" && misys._config.option_for_app_date!=="SCRATCH"){
				if(dj.byId("applicant_act_nickname") && dj.byId("applicant_act_nickname").get("value")===""){
					m.animate("wipeOut", d.byId("applicant_act_nickname_row"));
					m.animate("wipeOut", d.byId("nickname"));
				}
			}
			
			/*single bank recurring flag*/
			if(misys._config.singleBankRecurring && misys._config.singleBankRecurring[dj.byId("sub_product_code").get("value")]==="Y")
			{
				m.animate("fadeIn", dojo.byId("recurring_payment_checkbox_div"));
			}
			else{
				m.animate("fadeOut", dojo.byId("recurring_payment_checkbox_div"));
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
			if(dj.byId("recurring_payment_enabled") && dj.byId("recurring_payment_enabled").get("checked"))
			{
				 m.toggleFields(true,null,["recurring_start_date","recurring_frequency","recurring_end_date"],true,false);
			}
			m.setCurrency(dj.byId("ft_cur_code"), ["ft_amt"]);
			m.setTnxAmt(dj.byId("ft_amt").get("value"));
		//	m.setApplicantReference();	
			if(dj.byId('applicant_act_name') && dj.byId('applicant_act_name').get('value') === '')
			{
				d.style('content1','display','block');
				d.style('content2','display','none');
			}
			else
			{
				if(!dj.byId("action")) {
					d.style('content1','display','none');
					d.style('content2','display','block');
				}
				m.initForm();
				var modeValue = dijit.byId("mode") ? dijit.byId("mode").get("value") : "";
				if(dj.byId("sub_product_code").get("value") === "DDA" && modeValue === "DRAFT" && dj.byId("tnxtype").get("value") !== "03") 
				{
					m.showRecurring();
				}
			}
			d.forEach(d.query(".bpddaDisclaimer"),function(node){
				var productDisclaimer = dj.byId("sub_product_code").get("value")+'_'+m.getLocalization("disclaimer");
					if(dj.byId("sub_product_code") && (node.id == productDisclaimer))
					{
						m.animate("fadeIn", productDisclaimer);
					}					
				});
			//Show Recurring Payment details section and validate start date
			m.showSavedRecurringDetails(true);
		}, 

		initForm : function(){
			if(dj.byId("action")) {
				if(dj.byId("action").get("value") === "MODIFY") {
					m.animate("wipeIn", d.byId('dda-update-amount'));
				} else {
					m.animate("wipeOut", d.byId('dda-update-amount'));
				}
			}
		},
		
		beforeSaveValidations : function(){
		      var entity = dj.byId("entity") ;
		      var returnValue = false;
		      if(entity && entity.get("value")== "")
	          {
	                  return returnValue;
	          }
	          else
	          {
	                  return !returnValue;
	          }
	      },

		beforeSubmitValidations : function() {
			//holiday cutoff validation
			var subProdCode = dj.byId("sub_product_code").get('value');
			var holidayNCutOffResult = false;
			var modeValue = dijit.byId("mode") ? dijit.byId("mode").get("value") : "";
			
			//validate transfer amount should be greater than zero
			if(dj.byId("ft_amt"))
			{
				if(!m.validateAmount((dj.byId("ft_amt"))?dj.byId("ft_amt"):0))
				{
					m._config.onSubmitErrorMsg =  m.getLocalization("amountcannotzero");
					dj.byId("ft_amt").set("value","");
					return false;
				}
			}
			
	    	 var accNo = dj.byId("applicant_act_no").get("value");
	    	 var isAccountActive = m.checkAccountStatus(accNo);
	    	 if(!isAccountActive){
	    		 m._config.onSubmitErrorMsg = misys.getLocalization('accountStatusError');
					return false;
	     	 }
			if(subProdCode === "BILLP" ||subProdCode === "BILLS") 
			{
				//Validate Recurring payment details prior to transaction submit
		    	if(!m.isRecurringDetailsValidForSubmit())
	    		{
		    		 return false;
	    		}
				if(modeValue === "DRAFT")
				{
					if (dj.byId("recurring_payment_enabled") && dj.byId("recurring_payment_enabled").get("checked"))
			    	  {
			    		  holidayNCutOffResult =  m.validateHolidaysAndCutOffTime("issuing_bank_abbv_name","sub_product_code",modeValue,["Start Date"],["recurring_start_date"],"entity","ft_cur_code","ft_amt");		    		  
			    	  }
			    	  else
			    	  {
			    		  holidayNCutOffResult =  m.validateHolidaysAndCutOffTime("issuing_bank_abbv_name","sub_product_code",modeValue,["Transfer Date"],["iss_date"],"entity","ft_cur_code","ft_amt");		    		  
			    	  }
				}
				else if(modeValue === "UNSIGNED")
				{
					if (dj.byId("recurring_payment_enabled") && dj.byId("recurring_payment_enabled").get("value") === "Y")
			    	   {		    		   
			    		   holidayNCutOffResult =  m.validateHolidaysAndCutOffTime("issuing_bank_abbv_name","sub_product_code_unsigned",modeValue,["Start Date"],["recurring_start_date_unsigned"],"display_entity_unsigned","ft_cur_code_unsigned","ft_amt_unsigned");
			    	   }
			    	   else
			    	   {
			    		   holidayNCutOffResult =  m.validateHolidaysAndCutOffTime("issuing_bank_abbv_name","sub_product_code_unsigned",modeValue,["Transfer Date"],["iss_date_unsigned"],"display_entity_unsigned","ft_cur_code_unsigned","ft_amt_unsigned");		    		   
			    	   }					
				}
				else
				{
					m._config.onSubmitErrorMsg = m.getLocalization("technicalErrorWhileValidatingBusinessDays");
					console.error("Mode is unknown to validate Holidays and Cut-Off Time");
				}
				return holidayNCutOffResult;
			}
			else if(subProdCode === "DDA")
			{
				if(modeValue === "DRAFT")
				{
					if (dj.byId("tnxtype").get("value") !== "03")
					{
						holidayNCutOffResult =  m.validateHolidaysAndCutOffTime("issuing_bank_abbv_name","sub_product_code",modeValue,["Start Date","End Date"],["start_date","end_date"],"entity","ft_cur_code","ft_amt");
					}
					else
					{
						holidayNCutOffResult = true;
					}
				}
				else if(modeValue === "UNSIGNED")
				{
					 holidayNCutOffResult =  m.validateHolidaysAndCutOffTime("issuing_bank_abbv_name","sub_product_code_unsigned",modeValue,["Start Date","End Date"],["start_date_unsigned","end_date_unsigned"],"display_entity_unsigned","ft_cur_code_unsigned","ft_amt_unsigned");		    		   
				}
				else
				{
					m._config.onSubmitErrorMsg = m.getLocalization("technicalErrorWhileValidatingBusinessDays");
					console.error("Mode is unknown to validate Holidays and Cut-Off Time");
				}
				return holidayNCutOffResult;
			}
			
		}
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.cash.create_bp_dda_client');