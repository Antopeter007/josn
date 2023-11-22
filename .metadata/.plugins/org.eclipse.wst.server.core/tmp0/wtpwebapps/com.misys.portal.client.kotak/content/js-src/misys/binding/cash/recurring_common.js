/*
 * ---------------------------------------------------------- 
 * Event Binding for Recurring Fund Transfer
 * 
 * Copyright (c) 2000-2011 Misys (http://www.misys.com), All Rights Reserved.
 * 
 * version: 1.0 date: 07/03/11
 * ----------------------------------------------------------
 */
dojo.provide("misys.binding.cash.recurring_common");

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

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {
	
	var recurringDisplayed = true;
	
	function _localizeDisplayDate(/*dijit._Widget*/ dateField) 
	{
		//  summary:
	    //        Returns a localized display date for a date field.
		//  description:
		//        Return the date of the field in a standard format, for comparison. If the field 
		//        is hidden, we convert it to a standardized format for comparison, otherwise we 
		//        simply return the value.
		
		if(dateField.get("type") === "hidden") {
			return d.date.locale.format(m.localizeDate(dateField), {
				selector :"date"
			});
		}
		
		return dateField.get("displayedValue");
	}
	
	function _enableDisableFields(field,isEnabled)
	{
		//Summary:
		//Function to enable or disable a field
		if(field)
		{
			if(isEnabled)
			{
				field.set("disabled",false);
			}
			else
			{
				field.set("disabled",true);
			}
		}
	}
	
	d.mixin(m, {
		
		handleMultiBankRecurring : function(/*boolean*/ validationFailedOrDraftMode)
		{
			//this is to handle a special case in which server side validation fails
			if(!validationFailedOrDraftMode)
				{
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
					
					}
					if(dijit.byId("customer_bank").get("value") !== "" && misys._config.perBankRecurringAllowed)
					{
						//Check if the given bank has recurring enabled
						var recurringFlag = misys._config.perBankRecurringAllowed[dijit.byId("customer_bank").get("value")];
						if(recurringFlag === "Y" && d.byId("recurring_payment_checkbox"))
							{
								m.animate("fadeIn", d.byId("recurring_payment_checkbox"));
								if(dj.byId("recurring_flag"))
								{
									dj.byId("recurring_flag").set("checked", false);
									//this is when we are changing the bank so we have to reset the field values
									m.toggleRecurringFields(["recurring_start_date","recurring_frequency","recurring_number_transfers"]);
									//As we are setting the flag to false show the fields accordingly
									m.showRecurring();
								}
							}
							else
							{
								if(dj.byId("recurring_flag"))
									{
										dj.byId("recurring_flag").set("checked", false);
										m.showRecurring();
									}
								
								if(d.byId("recurring_payment_checkbox"))
									{
										m.animate("fadeOut", d.byId("recurring_payment_checkbox"));
									}
								if(dj.byId("recurring_start_date") && dj.byId("recurring_frequency") && dj.byId("recurring_number_transfers"))
									{
										m.toggleFields(false,null, ["recurring_start_date","recurring_frequency","recurring_number_transfers"],false,true);
									}
								if(d.byId("recurring_payment_div"))
								   {
									   d.style("recurring_payment_div","display","none");
								   }
							}
					}
					else
					{
						m.animate("fadeOut", dojo.byId("recurring_payment_checkbox"));
					}
					
				}
	},
	
		showRecurring : function()
		{	
			
			if (dj.byId("recurring_flag") && dj.byId("recurring_flag").get("checked"))
			{	
				dj.byId("recurring_payment_enabled").set("checked", true);
			}
			else
			{
				if(dj.byId("recurring_payment_enabled"))
					{
						dj.byId("recurring_payment_enabled").set("checked", false);
					}
			}
			m.showSavedRecurringDetails(false);
		},
		/**
		 * <h4>Summary:</h4>
		 *  Toggle Recurring specific fields
		 *  <h4>Description:</h4> 
		 *  Pass all the fields which has to be toggled, all fields will be made non mandatory first and then set to valid.
		 *  fieldIDs  - Widget Ids of the fields
		 *  @method toggleRecurringFields
		 * 
		 */
		toggleRecurringFields : function(/*Array*/ fieldIDs) {
			var requiredStartIndex = 0,
				checkboxRegex = /Check/,
				dateRegex = /Date/,
				timeRegex = /Time/;
			
			d.forEach(fieldIDs, function(id, i){
				var field = dj.byId(id);
				if(field) {
						var declaredClass = field.declaredClass;
						var clearValue = "";
						if(checkboxRegex.test(declaredClass)) {
							clearValue = false;
						}
						else if(dateRegex.test(declaredClass) || (timeRegex.test(declaredClass))) {
							clearValue = null;
						}
						field.set("value", clearValue);
						
						// Setup required fields
						if(i >= requiredStartIndex) {
							field.set("required", false);
							// If field is not required, call validate to remove the "error" style from previous calls
							// (Check validate function exists, since it currently doesn't for textareas)
							if(field.validate) {
								field.validate(false);
							}
						}
				}
			});
			
		},
		showSavedRecurringDetails : function(validateStartDate)
		{
			//Summary
			//Common function to show the recurring payment details section of an existing transaction
			var recurringPaymentEnabledCheckBoxField =  dj.byId("recurring_payment_enabled");
			var endDate = dj.byId("recurring_end_date");
			if (recurringPaymentEnabledCheckBoxField)
			{
				var subProdType = dj.byId("sub_product_code").get("value");
				if (recurringPaymentEnabledCheckBoxField.get("checked"))
				{
					if (subProdType === "MT101" || subProdType === "MT103" || subProdType === "FI103" || subProdType === "FI202")
					{
						if(d.byId("process_request_dates_div"))
						{
							d.style("process_request_dates_div","display","none");
						}
						m.toggleRequired("request_date", false);	
					}
					else
					{
						if(d.byId("transfer_date_div"))
						{
							d.style("transfer_date_div","display","none");
						}
					}
					m.animate("fadeIn","recurring_payment_div", function(){});
					//d.style("recurring_payment_div","display","block");
					//Issue Date is a common field for all modules
					m.toggleRequired("iss_date", false);
					if (m._config.clearOnSecondCall)
					{
						m.toggleRequired("recurring_start_date", true);
						m.toggleRequired("recurring_frequency", true);
						var reccuringTransfersNum = dj.byId("recurring_number_transfers");
						if(reccuringTransfersNum)
						{
							m.toggleRequired("recurring_number_transfers", true);
						}
						else if(endDate)
						{
							m.toggleRequired("recurring_end_date", true);
						}
					}
					if(validateStartDate)
					{
						m.validateStartDateWithCurrentDate(dj.byId("recurring_start_date"));
					}
				}
				else
				{
					if (subProdType === "MT101" || subProdType === "MT103" || subProdType === "FI103" || subProdType === "FI202")
					{
						if(d.byId("process_request_dates_div"))
						{
							d.style("process_request_dates_div","display","block");
						}
						m.toggleRequired("request_date", true);
					}
					else
					{
						if(d.byId("transfer_date_div"))
						{
							d.style("transfer_date_div","display","block");
						}
					}
					if(dj.byId("recurring_start_date"))
					{
						dj.byId("recurring_start_date").set("value","");
					}
					if(dj.byId("recurring_frequency"))
					{
						dj.byId("recurring_frequency").set("value","");
					}
					if(dj.byId("recurring_number_transfers")){
						dj.byId("recurring_number_transfers").set("value","");
					}
					m.animate("fadeOut","recurring_payment_div", function(){});
					//d.style("recurring_payment_div","display","none");
					//Issue Date is a common field for all modules
					m.toggleRequired("iss_date", true);
					m.toggleRequired("recurring_start_date", false);
					m.toggleRequired("recurring_frequency", false);
					m.toggleRequired("recurring_end_date", false);
					var transfersNumber = dj.byId("recurring_number_transfers");
					if(transfersNumber)
					{
						m.toggleRequired("recurring_number_transfers", false);
					}
					else if(endDate)
					{
						m.toggleRequired("recurring_end_date", false);
					}
				}				
				//m.validateFrequencyMode();
			m.validateRecurringPaymentDetails();
			}
		},
		
		hasRecurringPayment : function() {
		      
		      var recurringFlagDiv = d.byId("recurring_payment_checkbox_div")|| d.byId("recurring_payment_checkbox"),
		       selectedSubProduct = dj.byId("sub_product_code").get("value"),
		          recurringFlag;
		      
		      
		      if(misys._config.recurring_product)
		      {
		       recurringFlag  = misys._config.recurring_product[selectedSubProduct];
		      }else
		      {
		       recurringFlag = "N";
		      }
		      
		      if(selectedSubProduct !== "" && recurringFlag == "Y")
		      {
		       //m.animate("fadeIn",recurringFlagDiv);
		       d.style(recurringFlagDiv,"display","block");
		      }
		      else if (selectedSubProduct !== "" && (!recurringFlag || recurringFlag == "N"))
		      {
		       dj.byId("recurring_flag").set("checked", false);
		        //m.animate("fadeOut",recurringFlagDiv);
		        d.style(recurringFlagDiv,"display","none");
		      }
		      else if (selectedSubProduct === "")
		      {
		       //m.animate("fadeIn",recurringFlagDiv);
		       d.style(recurringFlagDiv,"display","block");
		      }
		     },
		validateFrequencyMode : function()
		{
			//Clear 'number of transfers' field when frequency mode changes only when end date is not used.
			if(dj.byId("recurring_end_date"))
			{
				dj.byId("recurring_end_date").set("value",null);
			}
			if(dj.byId("recurring_number_transfers"))
			{
			dj.byId("recurring_number_transfers").set("value","");	
			}
			m.validateRecurringPaymentDetails();
			m._config.formLoading = false;
		},
		
		validateTransfersNumber : function() 
		{
			var isValid = true;
			if (dj.byId("recurring_payment_enabled").get("checked"))
			{
			  var transfersNumber = dj.byId("recurring_number_transfers").get("value");
			  var frequencyMode = dj.byId("recurring_frequency").get("value");
			  var recurStartDateValue = dijit.byId("recurring_start_date") ? dijit.byId("recurring_start_date").get('value') : "";
			  var transferLimit;	
			  if(misys._config.isMultiBank && dj.byId("customer_bank") && misys._config.frequency_mode && misys._config.frequency_mode[0][frequencyMode+"_"+dj.byId("customer_bank").get("value")])
			  {
				  transferLimit = misys._config.frequency_mode[0][frequencyMode+"_"+dj.byId("customer_bank").get("value")][2];
			  }
			  else if(!misys._config.isMultiBank && misys._config.frequency_mode && misys._config.frequency_mode[0][frequencyMode])
			  {
				  transferLimit = misys._config.frequency_mode[0][frequencyMode][2];
			  }		 
			  if(frequencyMode === "DAILY" && recurStartDateValue && dojo.date.isLeapYear(recurStartDateValue))
			  {
				  var parsedTransferLimitToInt = transferLimit ? parseInt(transferLimit, 10) : 0;
				  if(parsedTransferLimitToInt !== 'NaN' && parsedTransferLimitToInt && parsedTransferLimitToInt > 0 && (parsedTransferLimitToInt/366 < 1))
				  {
					  // MPS-36884 allowing DAILY frequency mode to enter 366 days in case of LEAP year.
					  transferLimit = parsedTransferLimitToInt + 1;
				  }
			  }
			  if (transfersNumber > transferLimit || transfersNumber < 1)
			  {				   
				  this.invalidMessage = misys.getLocalization('invalidFreqMessage', [transferLimit]);				
				  isValid =  false;
			  }			  
			}
			return isValid;
		},
		
		validateRecurringOn : function() {			
			var recurringStartDate 	= 	dj.byId("recurring_start_date").get("value"),
				recurringFrequency  =   dj.byId("recurring_frequency").get("value"),
				recurringStartDay 	= 	recurringStartDate == null ? null : recurringStartDate.getDate();
			if(dijit.byId("exact_day"))
			{
				var exactDay = dj.byId("exact_day").get("value");
				if ((recurringStartDay === 29 || recurringStartDay === 30) && exactDay === "01" &&
						(recurringFrequency === "MONTHLY" || recurringFrequency === "QUARTERLY"))
				{
					if(recurringDisplayed)
					{
						m.dialog.show("MESSAGE", m.getLocalization("customerMessage"));		    
					}
					recurringDisplayed = true;
				}
			}			
		},
		
		/**
		 *If Recurring Payment checkbox is checked, this will be defaulted to start date and this field will be non editable
		 */
		setTransferDate : function() {		
			if (dj.byId("recurring_payment_enabled"))
			{
				if (dj.byId("recurring_payment_enabled").get("checked"))
				{				
					m.toggleRequired("iss_date", false);
					dj.byId("iss_date").set("value",dj.byId("recurring_start_date").get("value"));
					dj.byId("recurring_frequency").set("value",null);
					if(dj.byId("recurring_end_date"))
					{
						dj.byId("recurring_end_date").set("value",null);
					}
					if(dj.byId("recurring_number_transfers"))
					{
						dj.byId("recurring_number_transfers").set("value","");
					}
				}
			}
		},		
		
		validateRecurringStartDate : function() {
			//  summary:
		    //       Validates the start date.

			if(!this.get("value")){
				return true;
			}
			
			console.debug("[misys.validation.common] Validating Recuuring Start Date, Value", 
					this.get("value"));			
			// Validating the start date against the server current date. If server current date is not available it uses the application date.
			var applDate = dj.byId("appl_date_hidden");
			var applDateValue = dj.byId("appl_date_hidden").get("value");
			if(dj.byId("todays_date") && dj.byId("todays_date").get('value') !== null && dj.byId("todays_date").get('value') !== '' )
			{
				applDate = dj.byId("todays_date");
				applDateValue = dj.byId("todays_date").get("value");
			}
			var subProdType = dj.byId("sub_product_code").get("value");			
			if(dj.byId("recurring_flag") && dj.byId("recurring_flag").get("checked") === true && !m.compareDateFields(applDate, this)) {
				this.invalidMessage = m.getLocalization('startDateLessThanCurrentDateError',
						[_localizeDisplayDate(this),
			             _localizeDisplayDate(applDate)]);
				return false;
			}
			var startDate = dj.byId("recurring_start_date").get("value");
			var recurStartDay = startDate.getDate();
			var minOffset = "";
			var maxOffset = "";
			if(misys._config.isMultiBank && dj.byId("customer_bank") && misys._config.offset[0][subProdType+"_"+dj.byId("customer_bank").get("value")])
			{
				minOffset = misys._config.offset[0][subProdType+"_"+dj.byId("customer_bank").get("value")][0];
				maxOffset = misys._config.offset[0][subProdType+"_"+dj.byId("customer_bank").get("value")][1];
			}
			else if(misys._config.offset[0][subProdType])
			{
				minOffset = misys._config.offset[0][subProdType][0];
				maxOffset = misys._config.offset[0][subProdType][1];
			}	
			var recurMinStDate = new Date(applDateValue.getFullYear(),applDateValue.getMonth(),applDateValue.getDate());
			var recurMaxStDate = new Date(applDateValue.getFullYear(),applDateValue.getMonth(),applDateValue.getDate());
			recurMinStDate.setHours(0,0,0,0);
			recurMaxStDate.setHours(0,0,0,0);
			recurMinStDate.setDate(applDateValue.getDate()+ minOffset);
			recurMaxStDate.setDate(applDateValue.getDate()+ maxOffset);
			if(dj.byId("recurring_flag") && dj.byId("recurring_flag").get("checked") === true && startDate < recurMinStDate || startDate > recurMaxStDate)				
			{
				var minMonth = recurMinStDate.getMonth();
				minMonth = minMonth + 1;
				var minYear = recurMinStDate.getFullYear(); 
				var minDay = recurMinStDate.getDate();
				var minDisplayedValue = minDay +"/"+minMonth+"/"+minYear;
				var maxMonth = recurMaxStDate.getMonth();
				maxMonth = maxMonth + 1;
				var maxYear = recurMaxStDate.getFullYear(); 
				var maxDay = recurMaxStDate.getDate();
				var maxDisplayedValue = maxDay +"/"+maxMonth+"/"+maxYear;
				this.invalidMessage = misys.getLocalization('invalidStartDateMessage', [minDisplayedValue,maxDisplayedValue]);				
				return false;
			}	
			m.validateRecurringPaymentDetails();
			return true;
		},
		
		 validateRecurringPaymentDetails : function(){
			 //Summary:
			 //Function to validate all the recurring payment details
			if(dj.byId("recurring_frequency"))
			{
											
				var frequencyMode 		= 	dj.byId("recurring_frequency").get("value"),
					recurStartDate 		= 	dj.byId("recurring_start_date").get("value"),
					recurringOnDiv 		= 	d.byId('recurring_on_div'),
					exactDayField		=	dj.byId("exact_day"),
					LastDayOfMonthField	=	dj.byId("last_day"),
					recurStartDay 		= 	recurStartDate == null ? null : recurStartDate.getDate();
				
				//this condition requires when the transaction from either template, draft case or unsigned 
				if((frequencyMode === "MONTHLY" || frequencyMode === "QUARTERLY") && 
						(recurStartDay ===29 || recurStartDay === 30 || recurStartDay === 31))
				{
					m._config.clearOnSecondCall = true;
				}
				var exactFlag,LastDayOfMonthFlag;
				if(misys._config.isMultiBank && dj.byId("customer_bank") && misys._config.frequency_mode && misys._config.frequency_mode[0][frequencyMode+"_"+dj.byId("customer_bank").get("value")])
					{
						exactFlag = misys._config.frequency_mode[0][frequencyMode+"_"+dj.byId("customer_bank").get("value")][0];
						LastDayOfMonthFlag = misys._config.frequency_mode[0][frequencyMode+"_"+dj.byId("customer_bank").get("value")][1];
						
					}
				else if(!misys._config.isMultiBank && misys._config.frequency_mode && misys._config.frequency_mode[0][frequencyMode])
					{
						exactFlag 			=	misys._config.frequency_mode[0][frequencyMode][0];
						LastDayOfMonthFlag 	=	misys._config.frequency_mode[0][frequencyMode][1];
					}
				 if(m._config.clearOnSecondCall && exactFlag && LastDayOfMonthFlag)
					{
						//Hide the 'Recurring On Section' DIV if exact day and last Day of the Month flag are set to 'N'
						if(exactFlag === 'N' && LastDayOfMonthFlag === 'N')
						{
							m.animate('fadeOut', recurringOnDiv, function(){});
							exactDayField.set("checked", true);
						}
						else
						{
							//Disable or enable the radio buttons based on param data configuration
							exactDayField.set("checked", false);
							m.animate('fadeIn', recurringOnDiv, function(){});
							_enableDisableFields(exactDayField,(exactFlag === 'Y' ? true : false));
							_enableDisableFields(LastDayOfMonthField,(LastDayOfMonthFlag === 'Y' ? true : false));
						}
						
						if(exactFlag === 'Y')
						{
							if(!(recurStartDate == null || recurStartDate === ""))
							{
								if(frequencyMode === "MONTHLY" || frequencyMode === "QUARTERLY")
								{
									//If start date is 31st then default the option to last day of month.
									if (recurStartDay === 31 && LastDayOfMonthFlag === 'Y')
									{									
										LastDayOfMonthField.set("checked", true);
										_enableDisableFields(exactDayField,false);
									}
									//If start is 29th or 30th then default to exact day and validate feb month
								/*	else if(recurStartDay ===29 || recurStartDay === 30)
									{
										exactDayField.set("checked", true);
										//6413 - CX- (TRJ)-Cash- Recurring alert message shows twice if trx is submitted not filling in the mandatory fields.
										//m.validateRecurringOn();
									}*/
									else 
									{
										//If no option is selected by user then default to exact day
										if(exactDayField.get("checked") === false && LastDayOfMonthField.get("checked") === false)
										{
											exactDayField.set("checked", true);
										}
									}
									m.animate('fadeIn', recurringOnDiv, function(){});
								}
								else
								{
									m.animate('fadeOut', recurringOnDiv, function(){});								
									exactDayField.set("checked", true);
								}
							}
							else
							{
								//If Start Date is null then 
								exactDayField.set("checked", false);
								LastDayOfMonthField.set("checked", false);	
							}
						}
						else if(LastDayOfMonthFlag === 'Y')
						{
							if(!(recurStartDate == null || recurStartDate === ""))
							{
								if (recurStartDay === 31)
								{									
									LastDayOfMonthField.set("checked", true);
								}
							}
						}
					}
				 	else
					 {
				 		if(frequencyMode === "MONTHLY" || frequencyMode === "QUARTERLY")
			 			{
				 			m.animate('fadeIn', recurringOnDiv, function(){});
				 			if(LastDayOfMonthField.get("value") != "")
				 			{
				 				LastDayOfMonthField.set("checked", true);
				 			}
				 			else
				 			{
				 				exactDayField.set("checked", true);
				 			}
			 			}
				 		else
			 			{
				 			m.animate('fadeOut', recurringOnDiv, function(){});
			 			}
					 }
				 m._config.clearOnSecondCall = true;
			}			
		},
		isRecurringDetailsValidForSubmit : function()
		{
			//Summary
			//Function to validate whether all the required fields are set for recurring
			var recurringPaymentEnabledCheckBoxField 	=  	dj.byId("recurring_payment_enabled"),
				recurStartDate 							= 	dj.byId("recurring_start_date"),	
				frequencyModeField 						= 	dj.byId("recurring_frequency"),
				exactDayField							=	dj.byId("exact_day"),
				LastDayOfMonthField						=	dj.byId("last_day"),
				frequencyMode							= 	"";
			if (recurringPaymentEnabledCheckBoxField)
			{
				if (recurringPaymentEnabledCheckBoxField.get("checked"))
				{
					frequencyMode	=	frequencyModeField.get("value");
					//Step1: validate Recurring on whether Exact day or Last day is selected if frequency is set to Monthly or Quarterly
					if(frequencyMode === "MONTHLY" || frequencyMode === "QUARTERLY")
					{	
						if(exactDayField.get("checked") === false && LastDayOfMonthField.get("checked") === false)
						{
							console.debug("[misys.binding.cash.ft_common] Validation Failed [Recurring on], 'Exact Day' or 'Last Day of the month' need to select");
							exactDayField.set("state","Error");
							dj.hideTooltip(exactDayField.domNode);
							dj.showTooltip(misys.getLocalization('recurringOnRequired'), exactDayField.domNode, 0);
							var hideTT = function() {dj.hideTooltip(exactDayField.domNode);};
							setTimeout(hideTT, 3000);
							return false;
						} else if(exactDayField.get("checked") === true) {
							recurringDisplayed = false;
						}
					}
				}
			}
			return true;
		},
		
		validateStartDateWithCurrentDate : function(/**widget**/startDate){
			 var currentDate,
			 isValid;
			if(startDate)
			{
				if(startDate.get("value") != "")
				 {

					console.debug("[misys.validation.common] Begin Validating Transfer Date with current date. Value = ",
							startDate.get("value"));	
					currentDate = new Date();
					// set the hours to 0 to compare the date values
					currentDate.setHours(0, 0, 0, 0);
					// get the localized value in standard format.
					console.debug("[misys.validation.common] Current Date Value = ",
							currentDate);	
					// compare the values of the current date and transfer date
					isValid = d.date.compare(m.localizeDate(startDate), currentDate) < 0 ? false : true;
					if(!isValid)
					{
						startDate.state = "Error"; 
						startDate.set("focusonerror", true);
						startDate.invalidMessage = m.getLocalization("startDateGreaterThanCurrentDateError", [_localizeDisplayDate(startDate)]);
						startDate._setStateClass();
						dj.setWaiState(startDate.focusNode, "invalid", "true");
						return false;
					}
					console.debug("[misys.validation.common] End Validating Transfer Date with current date. Value = ",
							startDate.get("value"));					
				 }
			}
			return true;
		},
		
		bindRecurringFields	: function()
		{
			//Summary:
			//Common method to be invoked where ever the recurring payment details section is shown
			if(dj.byId("recurring_flag") && dj.byId("recurring_flag").get("checked") == false){
				if(dj.byId("recurring_start_date")){
					dj.byId("recurring_start_date").set("value","");
				}
	    		if(dj.byId("recurring_end_date")){
	    			dj.byId("recurring_end_date").set("value","");
				}
	    	 }
			m.setValidation("recurring_start_date", m.validateRecurringStartDate);
			m.setValidation("recurring_number_transfers", m.validateTransfersNumber);
			m.connect("recurring_start_date", "onChange", m.setTransferDate);
			m.connect("recurring_number_transfers", "onClick", function(){
				if(dj.byId("recurring_start_date").get('value') === "" || dj.byId("recurring_start_date").get('value') === null)
				{
					m.dialog.show("ERROR", m.getLocalization("selectStartDateFirst"), "", function(){
						dj.byId('recurring_start_date').focus();
					});
					return;
				}
				if(dj.byId("recurring_frequency").get('value') === "" || dj.byId("recurring_frequency").get('value') === null)
				{
					m.dialog.show("ERROR", m.getLocalization("selectFrequencyModeFirst"), "", function(){
						dj.byId('recurring_frequency').focus();
					});
					return;
				}
			});
			m.connect("recurring_end_date", "onClick", function(){
				if(dj.byId("recurring_start_date").get('value') === "" || dj.byId("recurring_start_date").get('value') === null)
				{
					m.dialog.show("ERROR", m.getLocalization("selectStartDateFirst"), "", function(){
						dj.byId('recurring_start_date').focus();
					});
					return;
				}
				if(dj.byId("recurring_frequency").get('value') === "" || dj.byId("recurring_frequency").get('value') === null)
				{
					m.dialog.show("ERROR", m.getLocalization("selectFrequencyModeFirst"), "", function(){
						dj.byId('recurring_frequency').focus();
					});
					return;
				}
			});
			m.connect("recurring_number_transfers", "onBlur", function(){
				if(misys._config.bothFieldsEnabled === "true"){
					m.getRecurringDetails("2");	
				}
			});
			m.connect("recurring_end_date", "onBlur",function(){
				if(misys._config.bothFieldsEnabled === "true"){
					m.getRecurringDetails("1");
				}
			});
			m.connect("recurring_start_date", "onClick", function(){
				misys._config.dateCache=[];
				var bankName;
				var issuingBankAbbvName = dj.byId("issuing_bank_abbv_name");
				if(dj.byId("customer_bank"))
				{
					bankName = dj.byId("customer_bank").get("value");
				}
				else if(issuingBankAbbvName && issuingBankAbbvName.get("value") !== "")
				{
					bankName = issuingBankAbbvName.get("value");
				}	
				
				if(bankName !== "" && misys && misys._config && misys._config.businessDateForBank && misys._config.businessDateForBank[bankName][0] && misys._config.businessDateForBank[bankName][0].value !== "")
				{
					var yearServer = parseInt(misys._config.businessDateForBank[bankName][0].value.substring(0,4), 10);
					var monthServer = parseInt(misys._config.businessDateForBank[bankName][0].value.substring(5,7), 10);
					var dateServer = parseInt(misys._config.businessDateForBank[bankName][0].value.substring(8,10), 10);
					this.dropDown.currentFocus = new  Date(yearServer, monthServer - 1, dateServer);
				}
			});
			m.connect("exact_day", "onChange", m.validateRecurringOn);
			m.connect("recurring_frequency", "onChange", m.validateFrequencyMode);
			
			m.connect("recurring_end_date", "onChange", function(){
				var startDate = dj.byId("recurring_start_date");
				var endDate = dj.byId("recurring_end_date");
				if(dj.byId("recurring_flag") && dj.byId("recurring_flag").get("checked") === true && !m.compareDateFields(startDate, endDate)) {
					this.invalidMessage = m.getLocalization("endDateLessThanStartDateError", [
									dj.byId('recurring_end_date').get("displayedValue"),
									dj.byId('recurring_start_date').get("displayedValue")]);
					m.showTooltip(m.getLocalization('endDateLessThanStartDateError',
							[dj.byId('recurring_end_date').get("displayedValue"),dj.byId('recurring_start_date').get("displayedValue")]), d.byId('recurring_end_date'), ['after']);
					dj.byId("recurring_end_date").set("value", null);
				}
			});
			
			m.connect("recurring_start_date", "onChange", function(){
				var startDate = dj.byId("recurring_start_date");
				var endDate = dj.byId("recurring_end_date");
				if(endDate && dj.byId("recurring_flag") && dj.byId("recurring_flag").get("checked") === true)
					{
						if(!m.compareDateFields(startDate, endDate)) {
							this.invalidMessage = m.getLocalization("startDateGreaterThanEndDateError", [
											dj.byId('recurring_start_date').get("displayedValue"),
											dj.byId('recurring_end_date').get("displayedValue")]);
							m.showTooltip(m.getLocalization('startDateGreaterThanEndDateError',
									[dj.byId('recurring_start_date').get("displayedValue"),dj.byId('recurring_end_date').get("displayedValue")]), d.byId('recurring_start_date'), ['after']);
							dj.byId("recurring_start_date").set("value", null);
						}
					}
			});
		},
		getRecurringDetails : function(mode){
			var valid = true;
			var startDate = (dj.byId('recurring_start_date').get('displayedValue') !== null)? dj.byId('recurring_start_date').get('displayedValue'):null;
			var endDate = dj.byId('recurring_end_date') ? dj.byId('recurring_end_date').get('displayedValue'): "";
			var numOfTransfers = dj.byId('recurring_number_transfers') ? dj.byId('recurring_number_transfers').get('value'): 0;
			var frequency = dj.byId('recurring_frequency')? dj.byId('recurring_frequency').get('value') : "";
			var exactOrLastDay = (dj.byId('exact_day').checked) ? true : false; 
			if((mode === "1" && endDate !== "") || (mode === "2" && !isNaN(numOfTransfers) && numOfTransfers !== 0)) {
				m.xhrPost({
					url : m.getServletURL("/screen/AjaxScreen/action/CalculateRecurringEndDateAndTransfers"),
					handleAs 	: "json",
					sync 		: true,
					content : {
						mode : mode,	
						startDate : startDate,
						frequencyMode : frequency,
						endDate: endDate,
						transfers:numOfTransfers,
						exactOrLastDay:exactOrLastDay
					},
					load : function(response, args){
						if(mode === "1"){
							var finalTransfers = response.calculatedTransfers;
							dj.byId('recurring_number_transfers').set('value',finalTransfers);
						}else{
							dj.byId('recurring_end_date').set('value',new Date(response.calculatedEndDate));
						}
					}
				});
			}
		}
	});
	d.ready(function(){		
		m._config.clearOnSecondCall = false;
		m._config.checkExactDay = true;
		m._config.formLoading = true;
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.cash.recurring_common_client');