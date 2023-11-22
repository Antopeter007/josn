dojo.provide("misys.binding.system.generic_parameter");
/*
 * -----------------------------------------------------------------------------
 * Scripts for the Parameter Maintenance .
 * 
 * Note: the function fncFormSpecificValidation is required Copyright (c)
 * 2000-2010 Misys (http://www.misys.com), All Rights Reserved. version: 1.0
 * date: 10/02/2011
 * -----------------------------------------------------------------------------
 */
dojo.require("dijit.form.NumberTextBox");
dojo.require("misys.form.common");
dojo.require("misys.validation.common");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.CheckBox");
dojo.require("dijit.layout.ContentPane");
dojo.require('dojo.data.ItemFileReadStore');
dojo.require("dojo.data.ItemFileWriteStore");
dojo.require("dojox.grid.cells.dijit");
dojo.require("dojox.grid.cells");
dojo.require("misys.common");


(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {
	
	"use strict"; // ECMA5 Strict Mode
	
	/**
	 * <h4>Summary:</h4> The function returns true or false based on the weekly holidays selected.
	 * 
	 * <h4>Description:</h4>
	 * Returns true if the two weekly holidays are different,
	 * else returns false.
	 * 
	 * @method validateWeeklyHolidays
	 *
	 */
	function validateWeeklyHolidays(){
		var weeklyHol1 = dj.byId("key_8") ? dj.byId("key_8").get("value") : "";
		var weeklyHol2 = dj.byId("key_9") ? dj.byId("key_9").get("value") : "";
		if(weeklyHol1 && weeklyHol2 && weeklyHol1 == weeklyHol2){
			this.invalidMessage = m.getLocalization("bothWeeklyHolidaySameError");
			return false;
		}
		return true;
	}
	
	/**
	 * This method disable the key6 ,if the param id is p108 on form load
	 * @method checkForDownTimeParm
	 */
	function checkForDownTimeParm(){
		var key2=dj.byId("key_2");
		key2.set("disabled",true);		
	}
	
	
	/**This method checks the start hour value w.r.t end hour
	 * @method checkForStartHour
	 */
	function checkForStartHour(){
		var data1=dj.byId("data_1");
		var data2=dj.byId("data_2");
		if(data2.get("value")!==null || data2.get("value")!==""){
			if(parseInt(data1.get("value"), 10)>=parseInt(data2.get("value"), 10)){
				this.invalidMessage = m.getLocalization("startHourErrorMsgForParameter");
				return false;
			}
			
		}
		
		return true;
	}
	/**
	 * This method checks the end hour value w.r.t start hour
	 * @method checkForEndHour
	 */
	function checkForEndHour(){
		var data1=dj.byId("data_1");
		var data2=dj.byId("data_2");
		if(parseInt(data2.get("value"), 10)===0){
			
			return true;
		}
		else if(parseInt(data2.get("value"), 10)<=parseInt(data1.get("value"), 10)){
			this.invalidMessage = m.getLocalization("endHourErrorMsgForParameter");
			return false;
		}
		return true;
	}
	
	
	/**This method checks the start hour value and end hour are same or not
	 * @method checkForStartHour
	 */
	function checkForSameHour(){
		var data1=dj.byId("data_1");
		var data2=dj.byId("data_2");
		if(data1.get("value")===data2.get("value")){
			
			this.invalidMessage = m.getLocalization("sameStartAndEndHourErrorMsg");
			return false;
		}
		
		return true;
	}
	
	/**This method checks the start hour value and end hour are same or not
	 * @method checkForStartHour
	 */
	function checkForSameTime(){
		var data1=dj.byId("data_1");
		var data2=dj.byId("data_2");
		var data5=dj.byId("data_5");
		var data6=dj.byId("data_6");
		
		if((data1.get("value")===data2.get("value")) && (data5.get("value")===data6.get("value"))){
			this.set("state", "Error");
			dj.showTooltip(m.getLocalization("sameStartAndEndTimeErrorMsg"),this.domNode, 0);
			var hideTT = function() {
				dj.hideTooltip(this.domNode);
			};
			var timeoutInMs = 2000;
			setTimeout(hideTT, timeoutInMs);
		}
		
	}
	
	/**
	 * This method checks the holiday1 filed value w.r.t holiday2
	 * @method checkHoliday1Field
	 */
	function checkForHolidayField(){
		var data3=dj.byId("data_3");
		var data4=dj.byId("data_4");
		if ((data4.get("value") !== null && data4.get("value") !== "") && (data3.get("value") !== null && data3.get("value") !== "")){
			
			if(data4.get("value")===data3.get("value")){
				this.set("state", "Error");
				dj.showTooltip(m.getLocalization("sameHolidayErrorMsg"),this.domNode, 0);
				var hideTT = function() {
					dj.hideTooltip(this.domNode);
				};
				var timeoutInMs = 2000;
				setTimeout(hideTT, timeoutInMs);
			}
		}
	}
	
	
		
	d.mixin(m, {
		bind : function(){
			m.connect("product_code","onChange",function(){
				var storeValues = new dojo.data.ItemFileReadStore({
	                data: {identifier: "value",label:"name", items:misys._config.subProductCodes[dijit.byId("product_code").get("value")]}
	            });
				
				if(dijit.byId("sub_product_code"))
				{
					dijit.byId("sub_product_code").set("value","");
					dijit.byId("sub_product_code").set("displayedValue","");
					dijit.byId("sub_product_code").store = storeValues;
				}
			});
			
			
			m.connect("sub_product_code","onChange",function(){
				var key3 = dj.byId("sub_product_code");
				var key9=d.byId("clearing_value_row");
				var key8 = d.byId("key_8_row");
				var key5= d.byId("_cur_code_row");
				var clearing_value=dj.byId("clearing_value");
				if(dijit.byId("parm_id").get("value")=="P110")
	            {
					if(key3 && (key3.get("value")== "MUPS"  || key3.get("value")== "MLMUM" || key3.get("value")== "ULMUM" || key3.get("value")== "MLMUX" || key3.get("value")== "ULMUX" || key3.get("value")== "MPMUP" || key3.get("value")== "UPMUP"))
					{
						m.animate("fadeIn", key9);
						m.toggleRequired("clearing_value", true);
	 					dijit.byId("key_8").set("value","INR");
	 					dj.byId("key_8").set("disabled",true);
	 					d.style(d.byId('_amt_img_label'), "display", "none");
					    m.setValidation("key_8", m.validateCurrency);
					}
					else
					{
						m.animate("fadeOut", key9);
						m.toggleRequired("clearing_value", false);
					    dj.byId('clearing_value').set("value", "");
					    if(dijit.byId("key_8") && (dijit.byId("key_8").get("value") != null))
					    {
					    	//MPS-56358 - To retain currency value
					    	//dijit.byId("key_8").set("value","");
					    	dj.byId("key_8").set("disabled",false);
					    	d.style(d.byId('_amt_img_label'), "display", "");
					    }
					    if(key3 && (key3.get("value")== "HVPS" || key3.get("value")== "HVXB" || key3.get("value")== "MPHXB" || key3.get("value")== "MPHVP" ||
					    		key3.get("value")== "MLHXM" || key3.get("value")== "MLHXX" || key3.get("value")== "MLHVM" || key3.get("value")== "MLHVX" ||
					    		key3.get("value")== "UPHXB" || key3.get("value")== "UPHVP" || key3.get("value")== "ULHXM" || key3.get("value")== "ULHXX" || 
					    		key3.get("value")== "ULHVM" || key3.get("value")== "ULHVX"))
					    {
					    	dijit.byId("key_8").set("value","CNY");
							dj.byId("key_8").set("disabled",true);
							d.style(d.byId('_amt_img_label'), "display", "none");
							
					    }
					    else if(key3 && (key3.get("value") === "MEPS" || key3.get("value") === "UPMEP" || key3.get("value") === "MPMEP" ||
					    		key3.get("value") === "ULMEX" || key3.get("value") === "MLMEX" || key3.get("value") === "MLMEM"))
					    {
					    	dijit.byId("key_8").set("value","SGD");
					    	dj.byId("key_8").set("disabled",true);
					    	d.style(d.byId('_amt_img_label'), "display", "none");
					    }
					     m.setValidation("key_8", m.validateCurrency);		
					 }
				}
				else if(dijit.byId("parm_id").get("value") === "P109")
				{
					if(dijit.byId("key_5") && (dijit.byId("key_5").get("value") != null))
					{
					    	dj.byId("key_5").set("disabled",false);
					    	d.style(d.byId('_amt_img_label'), "display", "");
					}
					if(key3 && (key3.get("value") === "MEPS" || key3.get("value") === "UPMEP" || key3.get("value") === "MPMEP" ||
				    		key3.get("value") === "ULMEX" || key3.get("value") === "MLMEX" || key3.get("value") === "MLMEM"))
					{
						dijit.byId("key_5").set("value","SGD");
				    	dj.byId("key_5").set("disabled",true);
				    	d.style(d.byId('_amt_img_label'), "display", "none");
					}
					 m.setValidation("key_5", m.validateCurrency);
				}
			});

			//validaing currency 
			var paramid = dijit.byId("parm_id").get("value");		
			if(paramid === "P109")
			{
				m.setValidation("key_5", m.validateCurrency);
			}
			if(!(paramid== "P110")){
	        	m.setValidation("key_9",validateWeeklyHolidays);
	   			m.setValidation("key_8",validateWeeklyHolidays);
	        }	

			if(paramid === "P110")
			{
				var key3 = dj.byId("sub_product_code");
				if(key3 && (key3.get("value")== "MUPS"||key3.get("value")== "MLMUM" || key3.get("value")== "ULMUM" || key3.get("value")== "MLMUX" || key3.get("value")== "ULMUX" || key3.get("value")== "MPMUP" || key3.get("value")== "UPMUP"))
				{
					dijit.byId("key_8").set("value","INR");
					dj.byId("key_8").set("disabled",true);
				}
       
				else
				{
					m.setValidation("key_8", m.validateCurrency);
				}
				
				m.connect("data_4","onChange",function(){
					var offsetValue = dijit.byId("data_4").get("value");	
					if ( !m.validateOffset(offsetValue)){
						dijit.byId("data_4").set("state","Error");
						misys.dialog.show("ERROR",misys.getLocalization("invalidOffsetField"));
						
						return;
					}
				});
			}		
			if(paramid === "P108")
			{
				
				m.connect("data_3","onBlur",checkForHolidayField);
				m.connect("data_4","onBlur",checkForHolidayField);
				m.connect("data_1","onBlur",checkForSameTime);
				m.connect("data_2","onBlur",checkForSameTime);
				m.connect("data_5","onBlur",checkForSameTime);
				m.connect("data_6","onBlur",checkForSameTime);
				
			}
			if(paramid === "P261")
			{
				m.setValidation("data_1", m.validateEmailAddr);
				m.setValidation("data_2", m.validateGroupName);
				m.setValidation("key_2", m.validateGroupId);
				
			}
		},
		onFormLoad : function(){
			
			if(dj.byId("parm_id").get("value") == "P110")
			{
				d.style(d.byId('clearing_value_row'), "display", "none");
				if(dj.byId("sub_product_code").get("value") == "MUPS" || dj.byId("sub_product_code").get("value") == "MLMUM" || dj.byId("sub_product_code").get("value") == "ULMUM" || dj.byId("sub_product_code").get("value") == "MLMUX" || dj.byId("sub_product_code").get("value") == "ULMUX" || dj.byId("sub_product_code").get("value") == "MPMUP"|| dj.byId("sub_product_code").get("value") == "UPMUP"){
					m.toggleRequired("clearing_value", true);
				}
				else{
					m.toggleRequired("clearing_value", false);
				}
			}
			if(m._config.amountField)
			{
				console.debug("Formatting Amount");
				m.setCurrency(dj.byId("cur_code_"+m._config.amountField), [m._config.amountField]);
			}
			
			if(dijit.byId("product_code") && dijit.byId("product_code").get("value") !== "")
			{
				var productCode = dijit.byId("product_code").get("value");
				
				var storeValues = new dojo.data.ItemFileReadStore({
	                data: {identifier: "value",label:"name", items:misys._config.subProductCodes[productCode]}
	            });
				
				if(dijit.byId("sub_product_code"))
				{
					dijit.byId("sub_product_code").store = storeValues;
					dijit.byId("sub_product_code").set("value",dijit.byId("sub_product_code_hidden").get("value"));
				}
				
			}
			if(dj.byId("parm_id") && dj.byId("parm_id").get("value") == "P109")
				{
			var currentDate = new Date();
			currentDate.setDate(currentDate.getDate());
			dj.byId('data_1').constraints.min = currentDate;
				}
			
			if(dijit.byId("parm_id") && dijit.byId("parm_id").get("value")==="P108")
			{
				checkForDownTimeParm();
			}
			if(dijit.byId("parm_id") && dijit.byId("parm_id").get("value")==="P261")
			{
				var rmGroupName=dj.byId("key_2");
				if(rmGroupName.get("value") !==""){
					rmGroupName.set('disabled',true);
				}
			}
			
		},
		
		setCustomConfirmMessage : function()
		{		
			if(dijit.byId("parm_id") && dijit.byId("parm_id").get("value")==="P108" ){
				 m._config.globalSubmitConfirmationMsg=m.getLocalization("acccessbilityHourSubmitionWarningMsg");
			}
	        

		},
		
		/**
		 * <h4>Summary:</h4>
		 * 
		 *  	This methods could be used to navigate to Product specific listing screens.
		 *   
		 *  <h4>Description:</h4>
		 *  
		 * 		This onCancelNavigation is a standard action method.
		 * 		Any Product specific navigations will be coded in this method.
		 *
		 * @method onCancelNavigation
		 * @return {String}, the product specific target URL will be returned.
		 **/
		onCancelNavigation : function()
		{
			var targetUrl = m._config.homeUrl;
			var cancelButtonURL = null;
			if(dj.byId("featureid") && dj.byId("featureid").get('value'))
			{
				cancelButtonURL = ["/screen/BankSystemFeaturesScreen?option=GENERIC_PARAMETER_MAINTENANCE", "&featureid="+dijit.byId("featureid").get('value'), "&operation=SELECT_PARAMETER"];
			}
			else
			{
				cancelButtonURL = ["/screen/BankSystemFeaturesScreen?option=GENERIC_PARAMETER_MAINTENANCE"];
			}
			targetUrl = m.getServletURL(cancelButtonURL.join(""));
			return targetUrl;
		},
		beforeSaveValidations : function() {
			var featureId = dj.byId("featureid");
			var isValid = true;
			var configurableItems = dj.byId("configurable_grid_items");
			if(featureId && featureId.get("value") === "P108")
			{
				var mandatoryFieldsForSave = ["data_1","data_2","data_5","data_6"];
				d.forEach(mandatoryFieldsForSave, function(field){
					if(dj.byId(field) && dj.byId(field).state === "Error")
					{
						m._config.onSubmitErrorMsg = m.getLocalization("mandatoryStartAndEndTimeErrorMsg");
						isValid =  false;
					}
				});
			}
			
			//closing date formatting
			if(configurableItems && configurableItems.store && configurableItems.store._arrayOfTopLevelItems)
			{
				for(var i=0; i < configurableItems.store._arrayOfTopLevelItems.length; i++)
				{
				var closingDate = configurableItems.store._arrayOfTopLevelItems[i].data_1;
				var localDate = null;
					if(closingDate && closingDate[0])
					{
					if(!isNaN(closingDate[0]))
						{
							var dateTimeMillis = parseInt(closingDate[0], 10);
							localDate =	dojo.date.locale.format(new Date(dateTimeMillis), {datePattern: m.getLocalization("g_strGlobalDateFormat"), selector: "date"});
							configurableItems.store._arrayOfTopLevelItems[i].data_1 = localDate;
						}
					}
				}
			}
			return isValid;
		},
		beforeSubmitValidations : function() {
			var isValid = true;
			if(dijit.byId('tnxTypeCode') && dijit.byId('tnxTypeCode').get("value") !== "12"){
				var configurableItems = dj.byId("configurable_grid_items");
				var currentDate = new Date();
				// set the hours to 0 to compare the date values
				currentDate.setHours(0, 0, 0, 0);
				// Test that the closing date is greater than the
				// current date.
				if(configurableItems && configurableItems.store && configurableItems.store._arrayOfTopLevelItems)
				{
					for(var i=0; i < configurableItems.store._arrayOfTopLevelItems.length; i++)
					{
					var closingDate = configurableItems.store._arrayOfTopLevelItems[i].data_1;
					var localDate = null;
					if(closingDate && closingDate[0])
					{
						if(!isNaN(closingDate[0]))
						{
							var dateTimeMillis = parseInt(closingDate[0], 10);
							localDate =	dojo.date.locale.format(new Date(dateTimeMillis), {datePattern: m.getLocalization("g_strGlobalDateFormat"), selector: "date"});
							configurableItems.store._arrayOfTopLevelItems[i].data_1 = localDate;
						}
						else
						{
							localDate = closingDate[0];
						}
					}
					var cd = dojo.date.locale.parse(localDate, {datePattern: m.getLocalization("g_strGlobalDateFormat"),selector:"date", formatLength:"short", locale:dojo.config.locale});
					var validationFlag =  configurableItems.store._arrayOfTopLevelItems[i].edit;
					if((closingDate.value !== "" || closingDate.value!== null) && cd < currentDate && validationFlag[0] === "Y")
						{
							isValid = false;
							misys._config.onSubmitErrorMsg = m.getLocalization("closingDateLessThanCurrentDateError", [closingDate]);
							return isValid;
						}
					if(closingDate[0] === "")
					{
						isValid = false;
						misys._config.onSubmitErrorMsg = m.getLocalization("closingdayblank", [closingDate]);
						return isValid;
					}
					}
				}
			}
			
			
			// verify grid is present
			var multi_data = dijit.byId('configurable_grid_items');
			if (multi_data) {
				// if it is multi data make sure that at least one data is there
				if (!multi_data.grid) {
					isValid = false;
				} else {
					multi_data.grid.store.fetch({
						query : {
							store_id : '*'
						},
						onComplete : function(items, request) {
							if (items.length < 1) {
								isValid = false;
							}
						}
					});
				}
				if (!isValid) {
					misys._config.onSubmitErrorMsg =
							misys.getLocalization('mandatoryData');
					multi_data.invalidMessage = misys.getLocalization('mandatoryData');
					misys.showTooltip(misys.getLocalization('mandatoryData'),
							multi_data.domNode);
				}
			}
			
			if(dijit.byId("parm_id"))
			{
			var paramid = dijit.byId("parm_id").get("value");	
			if(paramid === "P110")
				{
				var offsetValue = dijit.byId("data_4").get("value");	
			if ( !m.validateOffset(offsetValue)){
				dijit.byId("data_4").set("state","Error");
				isValid=false;

				}
				}
				}
			
			return isValid;
		}
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.system.generic_parameter_client');