dojo.provide("misys.openaccount.FormOpenAccountEvents");
dojo.require("misys.validation.common");
/*
 -----------------------------------------------------------------------------
 Scripts common across Open Account forms (PO, IN).

 Copyright (c) 2000-2009 Misys (http://www.misys.com),
 All Rights Reserved. 

 version:   1.0
 date:      25/09/09
 author:    Gilles Weber
 -----------------------------------------------------------------------------
 */

(function(/*Dojo*/ d, /*Dijit*/ dj, /*Misys*/ m) {

	// Private functions and variables

	// Compute PO Net Amount from Total Amount and PO Allowances
	_fncComputePONetAmount = function ()
	{
		console.debug("Start Execute _fncComputePONetAmount");
	    var totalAmt = dj.byId("fake_total_amt").get("value");
		var netAmt = _getValueAsNumber(totalAmt);
		var cashCustomizationEnable = dj.byId("cashCustomizationEnable").get("value");

		// Compute PO Adjustments
		console.debug("Computing Adjustments");
		var adjustments = dijit.byId("po-adjustments");
		if(adjustments && adjustments.grid)
		{
		   adjustments.grid.store.fetch({query: {store_id: '*'}, onComplete: d.hitch(this, function(items, request){
				for(var item in items){
					var adj = items[item];
					if (adj.amt && adj.amt.toString().trim().length != 0 && !(cashCustomizationEnable === "true" && adj.type.toString() === "DISC"))
				  	{
				  	  if (adj.direction[0] === "ADDD")
				  	  {
				  	    netAmt = netAmt + _getValueAsNumber(dojo.isArray(adj.amt) ? adj.amt[0] : adj.amt);
				  	  }
				  	  else
			  	 	  {
			  	        netAmt = netAmt - _getValueAsNumber(dojo.isArray(adj.amt) ? adj.amt[0] : adj.amt);
		 	  	 	  }
				  	}
				  	// case of percentage
				  	else if(adj.rate && adj.rate.toString().trim().length != 0 && !(cashCustomizationEnable === "true" && adj.type.toString() === "DISC"))
				    {
				      if (adj.direction[0] === "ADDD")
				  	  {
				  	    netAmt = netAmt + eval(_fncDoPercentage(totalAmt, (dojo.isArray(adj.rate)?adj.rate[0]:adj.rate)));
				  	  }
				  	  else
				  	  {
				  	    netAmt = netAmt - eval(_fncDoPercentage(totalAmt, (dojo.isArray(adj.rate)?adj.rate[0]:adj.rate)));
				  	  }
				    }
				}
			})});
		}
		
		console.debug("Computing Taxes");
		var totalAdjustedAmt = netAmt;
		// Compute PO Taxes
		var taxes = dijit.byId("po-taxes");
		if(taxes && taxes.grid)
		{
		   taxes.grid.store.fetch({query: {store_id: '*'}, onComplete: d.hitch(this, function(items, request){
				for(var item in items){
					var tax = items[item];
					if (tax.amt && tax.amt.toString().trim().length != 0)
				  	{
						netAmt = netAmt + _getValueAsNumber(dojo.isArray(tax.amt) ? tax.amt[0] : tax.amt);
				  	}
				  	// case of percentage
				  	else if(tax.rate && tax.rate.toString().trim().length != 0)
				    {
				  		netAmt = netAmt + eval(_fncDoPercentage(totalAdjustedAmt, (dojo.isArray(tax.rate)?tax.rate[0]:tax.rate)));
				    }
				}
			})});
		}
		
		console.debug("Computing Freight Charges");
		// Compute PO FreightCharges
		var freights = dijit.byId("po-freight-charges");
		if(freights && freights.grid)
		{
			freights.grid.store.fetch({query: {store_id: '*'}, onComplete: d.hitch(this, function(items, request){
				for(var item in items){
					var freight = items[item];
					if (freight.amt && freight.amt.toString().trim().length != 0)
				  	{
						netAmt = netAmt + _getValueAsNumber(dojo.isArray(freight.amt) ? freight.amt[0] : freight.amt);
				  	}
				  	// case of percentage
				  	else if(freight.rate && freight.rate.toString().trim().length != 0)
				    {
				  		netAmt = netAmt + eval(_fncDoPercentage(totalAdjustedAmt, (dojo.isArray(freight.rate)?freight.rate[0]:freight.rate)));
				    }
				}
			})});
		}

		var totalNetAmtField = dj.byId("total_net_amt");
		if (netAmt >= 0 && totalNetAmtField){
			
			totalNetAmtField.set("value", netAmt);
			
		}else if(totalNetAmtField){
			
			totalNetAmtField.set("value", "");
		}

		console.debug("End Execute _fncComputePONetAmount");
	};
	
	// Compute Line Item Net Amount from Total Amount and Adjustments.
	_fncComputeLineItemNetAmount = function ()
	{
		var nbDec = dj.byId("line_item_total_cur_code").get("value");
	    var totalAmt = dj.byId("line_item_total_amt").get("value");
	    if ("S"+totalAmt=="S")
		{
		  return;
		}
	  
	    var netAmt = _getValueAsNumber(totalAmt);
		var adjustments = dj.byId("line_item_adjustments");
		var cashCustomizationEnable = dj.byId("cashCustomizationEnable").get("value");
		if(adjustments && adjustments.grid)
		{
		   adjustments.grid.store.fetch({query: {store_id: '*'}, onComplete: d.hitch(this, function(items, request){
				for(var item in items){
					var adj = items[item];
					if (adj.amt && adj.amt.toString().trim().length != 0 && !(cashCustomizationEnable === "true" && adj.type.toString() === "DISC"))
				  	{
				  	  if (adj.direction[0] === "ADDD")
				  	  {
				  	    netAmt = netAmt + _getValueAsNumber(dojo.isArray(adj.amt) ? adj.amt[0] : adj.amt);
				  	  }
				  	  else
			  	 	  {
			  	        netAmt = netAmt - _getValueAsNumber(dojo.isArray(adj.amt) ? adj.amt[0] : adj.amt);
		 	  	 	  }
				  	}
				  	// case of percentage
				  	else if(adj.rate && adj.rate.toString().trim().length != 0 && !(cashCustomizationEnable === "true" && adj.type.toString() === "DISC"))
				    {
				      if (adj.direction[0] === "ADDD")
				  	  {
				  	    netAmt = netAmt + eval(_fncDoPercentage(totalAmt, (dojo.isArray(adj.rate)?adj.rate[0]:adj.rate)));
				  	  }
				  	  else
				  	  {
				  	    netAmt = netAmt - eval(_fncDoPercentage(totalAmt, (dojo.isArray(adj.rate)?adj.rate[0]:adj.rate)));
				  	  }
				    }
				}
			})});
		}
	    
		var totalAdjustedAmt = netAmt;
		// Compute LineItem Taxes
		var taxes = dj.byId("line_item_taxes");
		if(taxes && taxes.grid)
		{
		   taxes.grid.store.fetch({query: {store_id: '*'}, onComplete: d.hitch(this, function(items, request){
				for(var item in items){
					var tax = items[item];
					if (tax.amt && tax.amt.toString().trim().length != 0)
				  	{
						netAmt = netAmt + _getValueAsNumber(dojo.isArray(tax.amt) ? tax.amt[0] : tax.amt);
				  	}
				  	// case of percentage
				  	else if(tax.rate && tax.rate.toString().trim().length != 0)
				    {
				  		netAmt = netAmt + eval(_fncDoPercentage(totalAdjustedAmt, (dojo.isArray(tax.rate)?tax.rate[0]:tax.rate)));
				    }
				}
			})});
		}

		// Compute LineItem FreightCharges
		var freights = dj.byId("line_item_freight_charges");
		if(freights && freights.grid)
		{
			freights.grid.store.fetch({query: {store_id: '*'}, onComplete: d.hitch(this, function(items, request){
				for(var item in items){
					var freight = items[item];
					if (freight.amt && freight.amt.toString().trim().length != 0)
				  	{
						netAmt = netAmt + _getValueAsNumber(dojo.isArray(freight.amt) ? freight.amt[0] : freight.amt);
				  	}
				  	// case of percentage
				  	else if(freight.rate && freight.rate.toString().trim().length != 0)
				    {
				  		netAmt = netAmt + eval(_fncDoPercentage(totalAdjustedAmt, (dojo.isArray(freight.rate)?freight.rate[0]:freight.rate)));
				    }
				}
			})});
		}

		if (netAmt < 0)
		{
		  netAmt = 0;
		}
		if(dj.byId("line_item_total_net_amt"))
		{
		dj.byId("line_item_total_net_amt").set("readOnly",true);
		 dj.byId("line_item_total_net_amt").set("value", netAmt);
		}
		m.computePOTotalAmount();
	};

	_fncDoPercentage = function (total, percentage) 
	{
		var one = eval(total);
		var two = eval(percentage)/100;  
		var prod = one * two;
		return prod;
	};
	
	_fncCheckIBANAccountFormat = function(strAccount)
	{
	  // If the string is empty, we return true
	  if ("S" + strAccount.value == "S") {
	    return true;
	  }
	  
	  var regExp = /^[a-zA-Z]{2,2}[0-9]{2,2}[a-zA-Z0-9]{1,30}$/;
	  if (regExp.test(strAccount.value))
	  {
	    return true;
	  }

	  misys.dialog.show('ERROR', misys.getLocalization('invalidIBANAccNoError',[strAccount.value]));
	  strAccount.value = "";
	  return false;
	};

	// Check BBAN format
	_fncCheckBBANAccountFormat = function(account)
	{
	  // If the string is empty, we return true
	  if ("S" + account.value == "S") {
	    return true;
	  }
	  
	  var regExp = /^[a-zA-Z0-9]{1,30}$/;
	  if (regExp.test(account.value))
	  {
	    return true;
	  }
	  
	  misys.dialog.show('ERROR', misys.getLocalization('invalidBBANAccNoError',[account.value]));
	  account.value = "";
	  return false;
	};

	// Check UPIC format
	_fncCheckUPICAccountFormat = function(account)
	{
	  // If the string is empty, we return true
	  if ("S" + account.value === "S") {
	    return true;
	  }
	  
	  var regExp = /^[0-9]{8,17}$/;
	  if (regExp.test(account.value))
	  {
	    return true;
	  }
	  
	  misys.dialog.show('ERROR', misys.getLocalization('invalidUPICAccNoError',[account.value]));
	  account.value = "";
	  return false;
	};

	_fncCheckLastMatchDate = function(theObj)
	{
		if (theObj && theObj.value) 
		{
			theObj.value = fncFormatDate(theObj.value, "");
			// Check that is it greater than the application date
			if ("S" + theObj.value != "S")
			{
				if (fncFormatDate(theObj.value,"yyyy/mm/dd") < fncFormatDate(document.forms["fakeform1"].appl_date.value,"yyyy/mm/dd"))
				{
					misys.dialog.show('ERROR', misys.getLocalization('lastMatchDateLessThanAppDateError',[theObj.value,document.forms["fakeform1"].appl_date.value]));
					theObj.value = "";
					theObj.focus();
				}
			}
				// Check that is it greater than the issue date
			if ("S" + theObj.value !== "S" && document.forms["fakeform1"].iss_date.value !== "")
			{
				if (fncFormatDate(theObj.value,"yyyy/mm/dd") < fncFormatDate(document.forms["fakeform1"].iss_date.value,"yyyy/mm/dd"))
				{
					misys.dialog.show('ERROR', misys.getLocalization('lastMatchDateLessThanIssDateError',[theObj.value,document.forms["fakeform1"].iss_date.value]));
					theObj.value = "";
					theObj.focus();
				}
			}
		}
		else
		{
			theObj.value = "";
			theObj.focus();
		}
		return true;
	};

	
	_fncCheckAccountFormat = function(strAccountFormatForm, strAccountName, strAccountFormatSelect)
	{
	  accountNumber = d.byId(strAccountName);
	  accountFormatSelect = d.byId(strAccountFormatSelect);
	  var format = dj.byId(strAccountFormatSelect).get("value");
	  if(format)
	  {
		  if (format === "IBAN")
		  {
		      return _fncCheckIBANAccountFormat(accountNumber);
			}
		  else if (format === "BBAN")
			{
		      return _fncCheckBBANAccountFormat(accountNumber);
			}
		  else if (format === "UPIC")
			{
		      return _fncCheckUPICAccountFormat(accountNumber);
			}
		  else if (format === "OTHER")
		  {
		      return true;
		  }
		  else
		  {
			  // Unknown format
			  misys.dialog.show('ALERT', misys.getLocalization('mandatoryAccountMessage'));
			  accountNumber.value = '';
			  
			  return false;
		  }
	  }
	};
	
	_fncRemoveItemsWithCurrency = function()
	{
		// Remove line items
		dj.byId("line-items").clear();
		
		// Delete adjustments, taxes and freight charges.
		dj.byId("po-adjustments").clear();
		dj.byId("po-taxes").clear();
		dj.byId("po-freight-charges").clear();
		
		// Update total goods amount
		dj.byId("fake_total_cur_code").set("value", "");
		// Update total net amount
		dj.byId("total_net_cur_code").set("value", "");
	};
	
	
	// Function that changes the routing summary divs display and empty all the field populated
	// in the old div.
	_fncProcessDivRtgSummary = function(multimodalDivId, individualModalDivId, oldTypeId, selectBoxId)
	{
		  oldValue = dj.byId(oldTypeId).get("value");
		  selectBoxValue = dj.byId(selectBoxId).get("value");
	  if (oldValue != '' && oldValue != '0' && oldValue != selectBoxValue){
		m.dialog.show('CONFIRMATION', misys.getLocalization('deleteRoutingSummariesConfirmation'),null,function()
				{  
					switch (oldValue) {
						case '0' :break;
						case '01':
							misys.animate("fadeOut", dojo.byId(individualModalDivId));
							break;
						case '02':
							misys.animate("fadeOut", dojo.byId(multimodalDivId));
							break;
						default:break;
					}
					switch (selectBoxValue) {
						case '0' : break;
						case '01':
							misys.animate("fadeIn", dojo.byId(individualModalDivId));
							break;
						case '02':
							misys.animate("fadeIn", dojo.byId(multimodalDivId));
							break;
						default:break;
					}
					dj.byId(oldTypeId).set("value",selectBoxValue);
					_fncClearAllTransportsGrid();
				
				}
			);
		m.dialog.connect(dj.byId("cancelButton"), "onMouseUp", function(){
			dj.byId("transport_type").set("value",dj.byId("transport_type_old").get("value"));
			}
		, 'alertDialog');
	  }
	  else if (oldValue != selectBoxValue ){
				switch (oldValue) {
					case '0' :break;
					case '01':
						misys.animate("fadeOut", dojo.byId(individualModalDivId));
						break;
					case '02':
						misys.animate("fadeOut", dojo.byId(multimodalDivId));
						break;
					default:break;
				}
				switch (selectBoxValue) {
					case '0' : break;
					case '01':
						misys.animate("fadeIn", dojo.byId(individualModalDivId));
						break;
					case '02':
						misys.animate("fadeIn", dojo.byId(multimodalDivId));
						break;
					default:break;
				}
				dj.byId(oldTypeId).set('value',selectBoxValue);
	  }
	  return true;
	};
	
	_fncClearAllTransportsGrid = function(){
		
		var gridsId= ['po-air-routing-summary','po-sea-routing-summary','po-road-routing-summary',
		              'po-rail-routing-summary','po-multimodal-air-routing-summary','po-multimodal-sea-routing-summary',
		              'po-multimodal-place-routing-summary','po-multimodal-taking-in-routing-summary','po-multimodal-final-destination-routing-summary'];
		dojo.forEach(gridsId, function(id){
			var field = dijit.byId(id);
			if(field)
			{
				field.clear();
			}
		});
		
		
	};
	
	_getValueAsNumber = function(value){
		if (d.isString(value))
		{
			var convertedValue = d.number.parse(value);
			return convertedValue; 
		}
		return value;
	};

	_fncCheckPaymentTerms = function(formName, structureName)
	{
	if (dj.byId("payment_terms_type_1")||dj.byId("payment_terms_type_2")){
	  // enabled add payment term button
	  if(dj.byId("add_payment_term_button")){
		dj.byId("add_payment_term_button").set("disabled", false);
	  }
	  var paymentTermsType;
	  if (dj.byId("payment_terms_type_1").checked)
	  {
	    paymentTermsType = "AMNT";
	  }
	  else
	  {
	    paymentTermsType = "PRCT";
	  }
		  	
	  var previousPaymentTermsType = "";
	  if (d.byId(structureName+"_details_pct_section").style.display === "block")
	  {
	    previousPaymentTermsType = "PRCT";
	  }
	  else if (d.byId(structureName+"_details_amt_section").style.display === "block")
	  {
	    previousPaymentTermsType = "AMNT";    
	  }
	  
	  // Modify payment template
	  if (paymentTermsType === "PRCT")
	  {
		  d.byId(structureName+"_details_pct_section").style.display = "block";
		  d.byId(structureName+"_details_amt_section").style.display = "none";
	  }
	  else if (paymentTermsType === "AMNT")
	  {
		  d.byId(structureName+"_details_pct_section").style.display = "none";
		  d.byId(structureName+"_details_amt_section").style.display = "block";
	  }
	  var payGrid;
	  var containerWidget;
	  d.query("div[id^=po-payments]").forEach(
		function(container) {
		  containerWidget = dj.byId(container.id);
	    }
	  );
	  
	  // Display confirmation dialog only if entries exist. Note that simply checking the length of _arrayOfAllItems is not enough
	  // because ItemFileWriteStore keeps a null value when a value is deleted (see comments on deleteItem method of ItemFileWriteStore) 
	  var valuesExist = false;
	  if(containerWidget && containerWidget.grid && dojo.some(containerWidget.store._arrayOfAllItems, function(item){ return item !== null; })){
		  valuesExist = true;  
	  }
	 
	 // Get payments data grid and delete content if needed.
	  if (previousPaymentTermsType !== paymentTermsType && valuesExist)
	  {
	    // Delete existing items
	    if (previousPaymentTermsType !== "")
	    {
	    	// TODO : how to uncheck if the confirmation is canceled
//	    	misys.dialog.show('CONFIRMATION',
//	    			misys.getLocalization('changePaymentTermsConfirmation'), '',
//	    			function(){
//	    		 		payGrid = containerWidget.grid;
//			       	    if(payGrid.store)
//			   			{
//			       		   containerWidget.clear();
//			       		   payGrid.store.save();
//			       		   containerWidget.renderSections();
//			       		   payGrid.render();
//			   			}
//	    			}
//	    		);

	    	misys.dialog.show("CONFIRMATION", 
	    			misys.getLocalization("changePaymentTermsConfirmation"),
	    			'', '', '', '',
	    			function(){
	    				// OK callback
	    				payGrid = containerWidget.grid;
	    				if(payGrid.store)
						{
			    		   containerWidget.clear();
			    		   payGrid.store.save();
			    		   containerWidget.renderSections();
			    		   payGrid.render();
						}
	    			},
			    	function(){
	    				// Cancel callback
	    		        if (previousPaymentTermsType === "AMNT")
	    		        {
    		        		dj.byId("payment_terms_type_1").set("checked", true);
    		        		dj.byId("payment_terms_type_2").set("checked", false);
		    		        d.byId(structureName+"_details_pct_section").style.display = "none";
		    				d.byId(structureName+"_details_amt_section").style.display = "block";
	    		          
	    		        }
	    		        else if (previousPaymentTermsType === "PRCT")
	    		        {
	    		        	dj.byId("payment_terms_type_1").set("checked", false);
	    		        	dj.byId("payment_terms_type_2").set("checked", true);
	    		        	d.byId(structureName+"_details_pct_section").style.display = 'block';
   		   		  			d.byId(structureName+"_details_amt_section").style.display = 'none';
	    		        }
	    		        else
	    		        {
	    		        	 dj.byId("payment_terms_type_1").set("checked", false);
	    		        	 dj.byId("payment_terms_type_2").set("checked", false);
	    		        }
			    	},
			    	'');
		    }
		  }
		}
	};
	
	/**
	 * <h4>Summary:</h4> Returns a localized display date for a date field.
	 * 
	 * <h4>Description:</h4> 
	 * Return the date of the field in a standard format, for
	 * comparison. If the field is hidden, we convert it to a standardized
	 * format for comparison, otherwise we simply return the value.
	 * Internally it uses dojo functions to do this
	 * @param {dijit._Widget} dateField
	 * 	Date field which we want to format to localise date.
	 * @method _localizeDisplayDate
	 */
	function _localizeDisplayDate( /*dijit._Widget*/ dateField) {
		
		if(dateField.get("type") === "hidden") {
			return d.date.locale.format(m.localizeDate(dateField), {
				selector :"date"
			});
		}
		
		return dateField.get("displayedValue");
	}
		
/*
 * Value constants for the field credit_available_with_bank_type 
 */
//var ADVISING_BANK = 'Advising Bank';
//var ANY_BANK = 'Any Bank';
//var ISSUING_BANK = 'Issuing Bank';
//var OTHER = 'Other';
//var NAMED_BANK = 'Named Bank';

	
	/************ Public  Function *************************/
	
	d.mixin(m, {
		paymentDetailsChange : function() {
			dj.byId("details_label")?dj.byId("details_label").set("value", this.get("displayedValue")):"";			
		},

		enableRequiredTab : function() {
			var idF = this.get("id"), prefix ='';
			
			if (idF.lastIndexOf("bill_to") !== -1)
			{
				prefix="bill_to";
			}
			else 
			{
				if (idF.lastIndexOf("ship_to")!== -1){
					prefix="ship_to";
				}
				else if(idF.lastIndexOf("consgn")!== -1)
				{
					prefix="consgn";
				}
			}

			var tabRequired = !((dj.byId(prefix+'_name').get('value')==='')&&(dj.byId(prefix+'_country').get('value')===''));
			misys.toggleFields(tabRequired,null,[prefix+'_name'],false,true);					
			misys.toggleCountryFields(tabRequired,[prefix+'_country']);
		},

		toggleCountryFields : function(guardPassed,allFields) {
			var requiredPrefix = m._config.requiredFieldPrefix || "*";
			d.forEach(allFields, function(id, i)
			{
				var field = dj.byId(id);
				field.set("required", guardPassed);
				if(!guardPassed && field.validate) 
				{
					field.validate(false);
				}
				// Set the fields row class attribute and required prefix,
				// to signal a required field.
				var row = id + "_row";
				if(row) 
				{
					var fieldLabel = d.query("label[for="+id+"]")[0];
					
					// Add required class to row
					d.toggleClass(row, "required", guardPassed);
		
					// Add the required prefix
					var labelString = "";
					if(guardPassed) 
					{
						if(fieldLabel && fieldLabel.innerHTML.indexOf(requiredPrefix) === -1)
						{
							d.place(d.create("span", {"class" : "required-field-symbol", innerHTML : requiredPrefix}), fieldLabel, "first");
						}
					} 
					else 
					{
						if(fieldLabel && fieldLabel.innerHTML.indexOf(requiredPrefix) !== -1) 
						{
							// TODO We should show/hide the span, cause this probably
							// causes a reflow
							d.query("span", fieldLabel).orphan();
						}
					}
				}
			});
		},

		showHideOtherParties : function() {
			var checked = dj.byId("display_other_parties").get("value");
			var otherPartiesSection = d.byId("other_parties_section");
			var fieldsRequired =[];
			
			if (checked){
				m.animate("fadeIn",otherPartiesSection);
				m.toggleFields(true,null,fieldsRequired,false,false);
			}else{
				m.animate("fadeOut", otherPartiesSection);
				m.toggleFields(false,null,fieldsRequired,false,false);
			}
//			otherPartiesSection.style.display = checked ? 'block' : 'none';
			if(!checked){
				// init otherPartiesSection fields.
				dj.byId("bill_to_name").set("value", "");
				dj.byId("bill_to_street_name").set("value", "");
				dj.byId("bill_to_post_code").set("value", "");
				dj.byId("bill_to_town_name").set("value", "");
				dj.byId("bill_to_country_sub_div").set("value", "");
				dj.byId("bill_to_country").set("value", "");
				
				dj.byId("ship_to_name").set("value", "");
				dj.byId("ship_to_street_name").set("value", "");
				dj.byId("ship_to_post_code").set("value", "");
				dj.byId("ship_to_town_name").set("value", "");
				dj.byId("ship_to_country_sub_div").set("value", "");
				dj.byId("ship_to_country").set("value", "");
				
				dj.byId("consgn_name").set("value", "");
				dj.byId("consgn_street_name").set("value", "");
				dj.byId("consgn_post_code").set("value", "");
				dj.byId("consgn_town_name").set("value", "");
				dj.byId("consgn_country_sub_div").set("value", "");
				dj.byId("consgn_country").set("value", "");
			}
		},
		onChangeTranportType : function() {
			return _fncProcessDivRtgSummary('routing-summary-multimodal-div',
					'routing-summary-individuals-div','transport_type_old', this.id);
		},
		onFocusSellerAccount : function(){
			//fncAccountFormatReadOnly('form_settlement', 'seller_account_type', 'seller_account_value');
		},
		onBlurSellerAccount : function(form, sellerAccountVal, sellerAccountType){
			_fncCheckAccountFormat(form, sellerAccountVal, sellerAccountType);
		},
		onClickCheckPaymentTerms : function(){
			_fncCheckPaymentTerms('form_payments','po_payment');
		},
		onChangeSellerAccountType : function(form, sellerAccountVal, sellerAccountType){
			_fncCheckAccountFormat(form, sellerAccountVal, sellerAccountType);
		},
		onBlurMatchDate : function(){
			_fncCheckLastMatchDate(this);
		},
		onBlurShipDate : function(){
			//m.checkLastShipDate(this);
		},
		
		saveOldFreightChargeType : function() {
			var oldFreightChargesType = dj.byId('freight_charges_type');
			var oldFreightChargeTypeValue = oldFreightChargesType.get('value');
			oldFreightChargesType.set('old_value', oldFreightChargeTypeValue);
		},
		
		manageFreightButton : function() {
			
			var freightChargesTypeValue = dj.byId("freight_charges_type") ? dj.byId("freight_charges_type").get("value") : "";
			var oldFreightChargesTypeValue = dj.byId("freight_charges_type") ? dj.byId("freight_charges_type").get("old_value") :"";
			
			var totalCurCodeField = dj.byId("total_cur_code");
			var pofreight = dj.byId("po-freight-charges");
			var productStatCode = dj.byId("prodstatus");
			if (pofreight && pofreight.addButtonNode && totalCurCodeField && productStatCode) {
				pofreight.addButtonNode.set("disabled", totalCurCodeField.get("value") === "" || dj.byId("freight_charges_type").get("value") === "" || productStatCode.get("value") === "A6");
			}
			var items=[];
			if (pofreight && pofreight.store && oldFreightChargesTypeValue && freightChargesTypeValue !== oldFreightChargesTypeValue) {
				pofreight.clear();
			}
			
		},
		
		toggleDisableButtons : function() {
			var totalCurCodeField = dj.byId("total_cur_code");
			var productStatCode = dj.byId("prodstatus");
			var widget = dj.byId("line-items");
			if (widget && widget.addButtonNode && totalCurCodeField) {
				widget.addButtonNode.set("disabled", totalCurCodeField.get("value") === "");
			}
			widget = dj.byId("po-adjustments");
			if (widget && widget.addButtonNode && totalCurCodeField) {
				widget.addButtonNode.set("disabled", totalCurCodeField.get("value") === "");
			}
			widget = dj.byId("po-taxes");
			if (widget && widget.addButtonNode && totalCurCodeField) {
				widget.addButtonNode.set("disabled", totalCurCodeField.get("value") === "");
			}
			
			//Disable buttons for Payment initiaion screen 
			if(productStatCode && productStatCode.get("value") === "A6")
			{
				widget = dj.byId("line-items");
				if (widget && widget.addButtonNode) {
					widget.addButtonNode.set("disabled", true);
				}
				widget = dj.byId("po-adjustments");
				if (widget && widget.addButtonNode) {
					widget.addButtonNode.set("disabled", true);
				}
				widget = dj.byId("po-taxes");
				if (widget && widget.addButtonNode) {
					widget.addButtonNode.set("disabled", true);
				}
			}
			m.manageFreightButton();
			
		},
		saveOldPOCurrency : function() {
			var poCurCodeField = dj.byId('total_cur_code');
			var poCurCode = poCurCodeField.get('value');
			poCurCodeField.set('old_value', poCurCode);
		},
		setEAAmounts : function() {
			
			var orderedTtlAmt = dj.byId('order_total_amt');
			var acceptedTtlAmt = dj.byId('accpt_total_amt');
			var outstandingTtlAmt = dj.byId('outstanding_total_amt');
			var orderedTtlNetAmt = dj.byId('order_total_net_amt');
			var acceptedTtlNetAmt = dj.byId('accpt_total_net_amt');
			var outstandingTtlNetAmt = dj.byId('outstanding_total_net_amt');
			var totalNetAmt = dj.byId("total_net_amt").get("value");
			var amt = dj.byId("fake_total_amt").get("value");
			var accpt_amt = 0;
			var accpt_net_amt = 0;
			if(acceptedTtlAmt)
			{
				accpt_amt = acceptedTtlAmt.get("value");
			}
			if(acceptedTtlNetAmt)
			{
				accpt_net_amt = acceptedTtlNetAmt.get("value");
			} 
			
			if (dj.byId("original_total_amt")){
				var originalAmt = Number(dijit.byId("original_total_amt").get("value").replace(",",""));
				
				if(orderedTtlAmt)
				{
					orderedTtlAmt.set("value",originalAmt);
				}
				if(outstandingTtlAmt)
				{
					outstandingTtlAmt.set("value",originalAmt - (amt + accpt_amt));
				}
			}
			if (dj.byId("original_total_net_amt")){
				//Converting the amt(String to Number). The comma is replaced for this purpose
				var originalNetAmt = Number(dijit.byId("original_total_net_amt").get("value").replace(",",""));
				
				if(orderedTtlNetAmt)
				{
					orderedTtlNetAmt.set("value",originalNetAmt);
				}
				if(outstandingTtlNetAmt)
				{
					outstandingTtlNetAmt.set("value",originalNetAmt - (totalNetAmt + accpt_net_amt));
				}
			}
		},
		managePOCurrency : function() {
			console.debug("Start Execute managePOCurrency");
			var poCurCode = dj.byId("total_cur_code") ? dj.byId("total_cur_code").get("value") : "";
			var oldPoCurCode = dj.byId("total_cur_code") ? dj.byId("total_cur_code").get("old_value") :"";
			
			if (poCurCode == "")
			{
				//no message at form opening
				if (oldPoCurCode){
					misys.dialog.show('CONFIRMATION', misys.getLocalization('resetCurrencyConfirmation'), '', _fncRemoveItemsWithCurrency);
					// Revert to the old value of the PO currency when the user clicks on Cancel
					misys.connect(dj.byId('cancelButton'), 'onClick', function(){
						dj.byId('total_cur_code').set('value', oldPoCurCode);
					});
				}
			}
			else
			{
				// Update total goods amount
				if(dj.byId('fake_total_cur_code'))
				{
					dj.byId('fake_total_cur_code').set('value', poCurCode);
				}
				if(dj.byId('face_total_cur_code'))
				{
					dj.byId('face_total_cur_code').set('value', poCurCode);
				}
				
				// Update total adjustment amount
				if(dj.byId('adjustment_cur_code'))
				{
					dj.byId('adjustment_cur_code').set('value', poCurCode);
				}
				// Update total net amount
				if(dj.byId("total_net_cur_code"))
				{
					dj.byId("total_net_cur_code").set("value", poCurCode);
				}
				
				// Update transaction amount currency (used in Invoice on the bank side)
				if(dj.byId('tnx_cur_code')){
					dj.byId('tnx_cur_code').set('value', poCurCode);
				}
				// Update Outstanding amount currency (used in Invoice on the bank side)
				if(dj.byId('liab_total_cur_code')){
					dj.byId('liab_total_cur_code').set('value', poCurCode);
				}
				// Update total amount currency (used in Invoice on the bank side)
				if(dj.byId('total_net_inv_cur_code')){
					dj.byId('total_net_inv_cur_code').set('value', poCurCode);
				}
				if(dj.byId("order_total_cur_code"))
				{
					dj.byId("order_total_cur_code").set("value",poCurCode);
				}
				if(dj.byId("accpt_total_cur_code"))
				{
					dj.byId("accpt_total_cur_code").set("value",poCurCode);
				}
				if(dj.byId("outstanding_total_cur_code"))
				{
					dj.byId("outstanding_total_cur_code").set("value",poCurCode);
				}
				if(dj.byId("pending_total_cur_code"))
				{
					dj.byId("pending_total_cur_code").set("value",poCurCode);
				}
				if(dj.byId("order_total_net_cur_code"))
				{
					dj.byId("order_total_net_cur_code").set("value",poCurCode);
				}
				if(dj.byId("accpt_total_net_cur_code"))
				{
					dj.byId("accpt_total_net_cur_code").set("value",poCurCode);
				}
				if(dj.byId("outstanding_total_net_cur_code"))
				{
					dj.byId("outstanding_total_net_cur_code").set("value",poCurCode);
				}
				if(dj.byId("pending_total_net_cur_code"))
				{
					dj.byId("pending_total_net_cur_code").set("value",poCurCode);
				}
			}
			console.debug("End Execute managePOCurrency");
		},
		
		managePOCurrencyAndAmt : function() {
			console.debug("Start Execute managePOCurrencyAndAmt");
			m.managePOCurrency();
			if(dj.byId("total_amt"))
			{
				dj.byId("total_amt").set("value",'');
			}
			if(dj.byId('total_adjustments'))
			{
				dj.byId('total_adjustments').set("value",'');
			}
			console.debug("End Execute managePOCurrencyAndAmt");
		},
		
		calculateTotalAmount : function() {
			var cashCustomizationEnable = dj.byId("cashCustomizationEnable").get("value");
			var productCode = dj.byId("product_code").get("value");
			if(dj.byId('total_amt'))
			{
				var fakeAmount = parseFloat(dj.byId('total_amt').get('value'));
			}
			if(dj.byId('total_adjustments'))
			{
				var adjustment_amt = parseFloat(dj.byId('total_adjustments').get('value'));
			}
			if(!isNaN(adjustment_amt))
			{
				if(dj.byId('adjustment_direction_1').get('checked'))
				{
					fakeAmount = fakeAmount + adjustment_amt;
				}
				else
				{   if(productCode === "IN")
					{
						if (cashCustomizationEnable === "false" || (cashCustomizationEnable === "true" && dj.byId("discount_exp_date") && dj.byId("discount_exp_date").get("value") == null))
						{
						    fakeAmount = fakeAmount - adjustment_amt;
						}
					}
					else
					{
						fakeAmount = fakeAmount - adjustment_amt;
					}
				}
			}
			dj.byId('total_net_amt').set('value',fakeAmount);
		},
		
		/**
		 * <h4>Summary:</h4>
		 * The method toggles the transaction details for IN/IP on the MO, Existing and Pending Records.
		 */
		toggleFSCMTransactionDetails : function(prod_stat_code_field)
		{
			var tnxAmtField = dj.byId("tnx_amt");
			if(prod_stat_code_field && prod_stat_code_field.get("value") === "07"){			
				d.style(d.byId("transactionDetails"), "display", "block");
				/*
				 * Resizing all the grids, because the grids are not displayed on showing the "transactionDetails" block.
				 */
				if(dj.byId("line-items") && dj.byId("line-items").grid)
				{
					dj.byId("line-items").grid.resize();
				}
				if(dj.byId("po-payments") && dj.byId("po-payments").grid)
				{
					dj.byId("po-payments").grid.resize();
				}
				if(dj.byId("po-adjustments") && dj.byId("po-adjustments").grid)
				{
					dj.byId("po-adjustments").grid.resize();
				}
				if(dj.byId("po-taxes") && dj.byId("po-taxes").grid)
				{
					dj.byId("po-taxes").grid.resize();
				}
				if(dj.byId("po-freight-charges") && dj.byId("po-freight-charges").grid)
				{
					dj.byId("po-freight-charges").grid.resize();
				}
				if(dj.byId("po-incoterms") && dj.byId("po-incoterms").grid)
				{
					dj.byId("po-incoterms").grid.resize();
				}
				if(dj.byId("po-air-routing-summary") && dj.byId("po-air-routing-summary").grid)
				{
					dj.byId("po-air-routing-summary").grid.resize();
				}
				if(dj.byId("po-sea-routing-summary") && dj.byId("po-sea-routing-summary").grid)
				{
					dj.byId("po-sea-routing-summary").grid.resize();
				}
				if(dj.byId("po-rail-routing-summary") && dj.byId("po-rail-routing-summary").grid)
				{
					dj.byId("po-rail-routing-summary").grid.resize();
				}
				if(dj.byId("po-road-routing-summary") && dj.byId("po-road-routing-summary").grid)
				{
					dj.byId("po-road-routing-summary").grid.resize();
				}
				if(dj.byId("po-multimodal-air-routing-summary") && dj.byId("po-multimodal-air-routing-summary").grid)
				{
					dj.byId("po-multimodal-air-routing-summary").grid.resize();
				}
				if(dj.byId("po-multimodal-sea-routing-summary") && dj.byId("po-multimodal-sea-routing-summary").grid)
				{
					dj.byId("po-multimodal-sea-routing-summary").grid.resize();
				}
				if(dj.byId("po-multimodal-place-routing-summary") && dj.byId("po-multimodal-place-routing-summary").grid)
				{
					dj.byId("po-multimodal-place-routing-summary").grid.resize();
				}
				if(dj.byId("po-multimodal-taking-in-routing-summary") && dj.byId("po-multimodal-taking-in-routing-summary").grid)
				{
					dj.byId("po-multimodal-taking-in-routing-summary").grid.resize();
				}
				if(dj.byId("po-multimodal-final-destination-routing-summary") && dj.byId("po-multimodal-final-destination-routing-summary").grid)
				{
					dj.byId("po-multimodal-final-destination-routing-summary").grid.resize();
				}
				if(dj.byId("po-buyer-user-informations") && dj.byId("po-buyer-user-informations").grid)
				{
					dj.byId("po-buyer-user-informations").grid.resize();
				}
				if(dj.byId("po-seller-user-informations") && dj.byId("po-seller-user-informations").grid)
				{
					dj.byId("po-seller-user-informations").grid.resize();
				}
				if(tnxAmtField)
				 {
					tnxAmtField.set("value",0);
					tnxAmtField.set('readOnly',true);
				 }
			}else{
				d.style(d.byId("transactionDetails"), "display", "none");
				if(tnxAmtField && prod_stat_code_field && prod_stat_code_field.get("value") !== "47")
				 {
					tnxAmtField.set("value",dj.byId("total_net_amt"));
					tnxAmtField.set("readOnly",false);
				 }
			}
		},
		//
		// Manage the display of adjustment type
		//
		getAdjustmentType : function(rowIndex, item)
		{
			var value = '';
			if(item)
			{
				if (item.other_type[0] !== "")
				{
					value = item.other_type;
				}
				else if(item.type[0] !== "")
				{
					value = item.type_label;
				}
			}
			return value;
		},
		
		/**
		 * <h4>Summary:</h4>
		 * The method gets the Freight charges type based on the type or othertype is specified.
		 */
		getTransportFreightChargesType : function(rowIndex, item)
		{
			var value = '';
			if(item)
			{
				if (item.other_type[0] !== "")
				{
					value = item.other_type;
				}
				else if(item.type[0] !== "")
				{
					value = item.type_label;
				}
			}
			return value;
		},
		// Manage the display of the amount/rate
		//
		getAdjustmentAmountRate : function(rowIndex, item)
		{
			var value = '';
			if(item)
			{
				var plusChecked = item.direction[0];
				var operator = plusChecked==="ADDD" ? '+' : '-'; 
				if(item.rate[0] !== "")
				{
					value = operator + item.rate +'%';
				}
				else if (item.amt !== "")
				{
					// Check if the "item" object have a "amt" parameter as string (come from server as string) or not
					if (typeof item.amt[0] === "string") {
						value = operator + item.amt;
					}
					else if (typeof item.amt[0] === "number" && isFinite(item.amt[0])){
						value = operator+dojo.currency.format(item.amt, {currency: dj.byId("adjustment_cur_code").get("value")});
						value = value.replace(/[A-Za-z]+/g, '');
					}
				}
			}
			return value;
		},
		// Get and format the total Net Amount of a Command Line
		getTotalNetAmount : function(rowIndex, item)
		{
			var value = '';
			if (item && item.total_net_amt !== '')
			{
				// Check if the "item" object have a "total_net_amt" parameter as string (come from server as string) or not
				if (typeof item.total_net_amt[0] === "string") {
					value = item.total_net_amt;
				}
				else if (typeof item.total_net_amt[0] === "number" && isFinite(item.total_net_amt[0])){
					value = dojo.currency.format(item.total_net_amt, {currency: dj.byId("line_item_total_net_cur_code").get("value")});
					value = value.replace(/[A-Za-z]+/g, '');
				}
			}
			return value;
		},
		getQuantity : function(rowIndex, item)
		{
			var value = "";
			if(item)
			{
				var unity = item.qty_unit_measr_label[0];
				var quantity = item.qty_val[0]; 
				value = quantity + ' ' +unity;
			}
			return value;
		},
		getPaymentType : function(rowIndex, item)
		{
			var value = "";
			var paymentDays='';
			
			
			if(item)
			{
				if ( item.nb_days !==""){
					paymentDays= ' (+'+item.nb_days +' ' + m.getLocalization('paymentDays')+ ')';
				}
				if(item.code !== '')
				{
					value = item.label +  paymentDays;
				}
				else if (item.other_paymt_terms !== "")
				{
					value = item.other_paymt_terms + paymentDays;
				}
			}
			return value;
		},
		getContactName : function(rowIndex, item)
		{
			var value = '';
			if(item)
			{
				return m.getLocalization(item.name_prefix) + ' ' + item.name_value;
			}
			return value;
		},
		//
		// Manage the display of the amount/rate
		//
		getPaymentAmountRate : function(rowIndex, item)
		{
			var value = "";
			if(item)
			{
				if(item.pct != "")
				{
					value = "+"+item.pct+"%";
				}
				else if (item.amt != "")
				{
					// Check if the "item" object have a "amt" parameter as string (come from server as string) or not
					if (typeof item.amt[0] ==="string")
					{
						value = "+"+item.amt;
					}
					else if (typeof item.amt[0] === "number" && isFinite(item.amt[0]))
					{
						value = "+"+dojo.currency.format(item.amt);
					}
				}
			}
			return value;
		},
		//
		// Manage the display of the amount/rate
		//
		getAmountRate : function(rowIndex, item)
		{
			var value = "";
			if(item)
			{
				if(item.rate != "")
				{
					value = '+' + item.rate+'%';
				}
				else if (item.amt != "")
				{
					// Check if the "item" object have a "amt" parameter as string (come from server as string) or not
					if (typeof item.amt[0] === "string") {
						value = "+" + item.amt;
					}
					else if (typeof item.amt[0] === "number" && isFinite(item.amt[0])){
						value = "+"+dojo.currency.format(item.amt, {currency: dj.byId("adjustment_cur_code").get("value")});
						value = value.replace(/[A-Za-z]+/g, '');
					}
				}
			}
			return value;
		},
		
		/**
		 * <h4>Summary:</h4>
		 * The method manages the freight amount
		 */
		getFreightAmount : function(rowIndex, item)
		{
			var value = "";
			if((item) && (item.amt !== ""))
			{
					// Check if the "item" object have a "amt" parameter as string (come from server as string) or not
					if (typeof item.amt[0] === "string") {
						value = "+" + item.amt;
					}
					else if (typeof item.amt[0] === "number" && isFinite(item.amt[0])){
						value = "+"+dojo.currency.format(item.amt);
					}
			}
			return value;
		},
		//Routing Summaries may be present either in Purchase Order section 
		//or in Line Items details but not in both.
		checkRoutingSummaryUnicity : function(theObj)
		{
			// Check into PO
			if ((dj.byId("transport_type").get("value") === "0") && theObj !== d.byId("transport_type"))
			{
				return true;
			}
			else if (theObj !== d.byId("transport_type"))
			{
				dj.byId("transport_type").set("value", "0");
				return false; 
			}
				  // else compare with Line Item Details
			var regex = new RegExp("po_line_item_display_details_([1-9]{1}[0-9]*)");
			var divs = document.forms["form_goods"].getElementsByTagName("div");
				// Go throughout the divs
			for (var i = 0; i < divs.length; i++)
			{
				var aDivId = divs[i].getAttribute("id");
				var aDivStyle = divs[i].getAttribute("style");
				// Do not process the divs without id or style since they does not contain the targeted content.
				if (aDivId === null)
			{
				continue;
			}
			//hack for I.E to retrieve the style attribute as text value
			if (aDivStyle !== null && typeof aDivStyle === "object")
				{
					aDivStyle = aDivStyle.cssText;
				}		
				
				var res = aDivId.match(regex); 
				if (res)
				{
				  var structureIndex = res[1];
				  if (document.forms["form_goods"].elements["transport_type_"+structureIndex].selectedIndex !== 0)
				  {
					misys.dialog.show('ERROR', misys.getLocalization('tooManyRoutingSummariesError'));
					theObj.selectedIndex = 0;
					theObj.blur();
					return false;
				  }
				}
			} 

			return true;
		},
		checkLastShipDateUnicity : function(theObj)
		{
			console.debug(theObj);
		  // Check into PO
		  if ((dj.byId("last_ship_date").get("value") === "") && theObj !== d.byId("last_ship_date"))
		  {
		    return true;
		  }
		  else if (d.byId(theObj) !== d.byId("last_ship_date"))
		  {
		    //fncShowError(77);
		    dj.byId("last_ship_date").set("value", null);
		    dj.byId(theObj).blur();
		    return false; 
		  }

			  // else compare with Line Item Details
		  var regex = new RegExp("po_line_item_display_details_([1-9]{1}[0-9]*)");
		  //var divs = document.forms["form_goods"].getElementsByTagName("div");
		  d.query("#form_goods > div");
				// Go throughout the divs
		  for (var i = 0; i < divs.length; i++)
		  {
				var aDivId = divs[i].getAttribute("id");
				var aDivStyle = divs[i].getAttribute("style");
				// Do not process the divs without id or style since they does not contain the targeted content.
				if (aDivId == null)
			  	{
			  		continue;
			  	}
				// hack for I.E to retrieve the style attribute as text value
				if (aDivStyle !== null && typeof aDivStyle === "object")
			  	{
			  		aDivStyle = aDivStyle.cssText;
			  	}		
			  	
		 		var res = aDivId.match(regex); 
		 		if (res)
		 		{
		 		  var structureIndex = res[1];
		 		  if ("S" + document.forms["form_goods"].elements["po_line_item_details_last_ship_date_"+structureIndex].value !== "S")
		 		  {
		 			misys.dialog.show('ERROR', misys.getLocalization('tooManyLastShipmentDatesError'));  
			      	theObj.value = "";
			      	theObj.blur();
			      	return false;
		 		  }
		 		}
			} 
			
			return true;
		},
		checkLastShipDate : function(theObj)
		{
		var invalidMessage;
		  if (theObj && theObj.value) 
		  {
			 var applDate=document.forms["fakeform1"].appl_date.value;
			 if(!m.compareDateFields(applDate, theObj.value)) {
					invalidMessage = m.getLocalization("lastShipmentDateLessThanAppDateError", [
									_localizeDisplayDate(theObj.value),
									_localizeDisplayDate(applDate)]);
					misys.dialog.show('ERROR', invalidMessage);  
			        theObj.value = "";
			        theObj.focus();
				}  
			  
			  
//			  theObj.value = fncFormatDate(theObj.value,"");
//		    // Check that is it greater than the application date and before the expiry date
//		    if ("S" + theObj.value != "S")
//		    {
//		      if (fncFormatDate(theObj.value,"yyyy/mm/dd") < fncFormatDate(,"yyyy/mm/dd"))
//		      {
//		    	misys.dialog.show('ERROR', misys.getLocalization('lastShipmentDateLessThanAppDateError',[theObj.value,document.forms["fakeform1"].appl_date.value]));  
//		        theObj.value = "";
//		        theObj.focus();
//		      }
//		    }
		  
			var expDate=document.forms["fakeform1"].exp_date.value;
		    if(!m.compareDateFields(theObj.value,expDate )) {
		    	invalidMessage = m.getLocalization("expiryDateLessThanLastShipmentError", [
								_localizeDisplayDate(expDate),
								_localizeDisplayDate(theObj.value)]);
				misys.dialog.show('ERROR',invalidMessage);  
		        theObj.value = "";
		        theObj.focus();
			}
		    
//		    if (("S" + document.forms["fakeform1"].exp_date.value != "S") && ("S" + theObj.value != "S"))
//		    {
//		      if (fncFormatDate(theObj.value,"yyyy/mm/dd") > fncFormatDate(document.forms["fakeform1"].exp_date.value,"yyyy/mm/dd"))
//		      {
//		    	misys.dialog.show('ERROR', misys.getLocalization('expiryDateLessThanLastShipmentError',[document.forms["fakeform1"].exp_date.value,theObj.value]));
//		        theObj.value = "";
//		        theObj.focus();
//		      }
//		    }
		  }
		  else
		  {
		    theObj.value = "";
		    theObj.focus();
		  }    
		  
		  return true;
		},
		//Compute Line Item Amount from Unit Price and Quantity
		computeLineItemAmount : function ()
		{
			console.debug('[m.computeLineItemAmount]');
			var nbDec = dj.byId("line_item_total_cur_code").get("value");
			var widget = dj.byId("line_item_qty_val");
			var quantity = widget ? widget.get("value"):"";
		    if(quantity == 0)
		 		{   
		    	    m.dialog.show("ERROR", m.getLocalization("lineItemQuantityInvalidValue"));
			  		widget.set("value", "");
			  		return;
				}
			var measureUnit = dj.byId("line_item_qty_unit_measr_code").get("value");
			var basePriceMeasureUnit = dj.byId("line_item_price_unit_measr_code").get("value");
			var basePrice = dj.byId("line_item_price_amt").get("value");
			var tempAmount = dj.byId("line_item_total_amt").get("value");
			if (basePrice && quantity)
			{
				tempAmount=(quantity * basePrice);
				if(tempAmount.toString().split(".")[0].length >13) {
					m.dialog.show("ERROR", m.getLocalization("lineItemNetAmountOutOfRange"));
					dj.byId("line_item_total_amt").set("value", "");
					return;
				}
				dj.byId("line_item_total_amt").set("readOnly",true);
			}
			else
			{
				tempAmount = "";
				dj.byId("line_item_total_amt").set("readOnly",false);
			}

			dj.byId("line_item_total_amt").set("value", tempAmount);

			// Compute Line Item Total Net Amount
			_fncComputeLineItemNetAmount();
		},
		//Compute PO Total Amount from Line Items Net Amounts
		computePOTotalAmount : function ()
		{
			console.debug("Start Execute computePOTotalAmount");
		    var totalAmt = 0;
		    var lineItems = dj.byId("line-items");
			if(lineItems && lineItems.grid)
			{
				lineItems.grid.store.fetch({query: {store_id: '*'}, onComplete: d.hitch(this, function(items, request){
					for(var item in items){
						var line = items[item];
						var lineAmt = dojo.isArray(line.total_net_amt)?line.total_net_amt[0]:line.total_net_amt;
						totalAmt = _getValueAsNumber(totalAmt) + _getValueAsNumber(lineAmt);
					}
				})});
			}

			if (totalAmt >= 0 && dj.byId('fake_total_amt'))
			{
				dj.byId("fake_total_amt").set("value", totalAmt);
				
				_fncComputePONetAmount();
			}
			else
			{
				if(dj.byId("fake_total_amt"))
				{
					dj.byId("fake_total_amt").set("value", "");
				}
				if(dj.byId("total_net_amt"))
				{
					dj.byId("total_net_amt").set("value", "");
				}
			}

			console.debug("End Execute computePOTotalAmount");
		},
		
		setContactDetails :function(){
			dj.byId("contact_type_decode").set("value", this.get("displayedValue"));

			if(this.get("value") === "08" && dj.byId("contact_bic"))
			{
				dj.byId("contact_bic").set("disabled", false);
				m.toggleRequired("contact_bic", true);
			}
			else
			{
				dj.byId("contact_bic").set("value", "");
				dj.byId("contact_bic").set("disabled", true);
				m.toggleRequired("contact_bic", false);
			}
		},
		
		isValidContact : function()
		{
			var dispMsg = '';
			var sellerBankFound = false;
			var buyerBankFound = false;
			var gridContact = dj.byId("contact-details");
			if(gridContact && gridContact.grid)
			{
			gridContact.grid.store.fetch({
				query:{type:"*"},
				onComplete: dojo.hitch(gridContact, function(items, request){
					dojo.forEach(items, function(item){
						if(item.type[0] === "03")
						{
							sellerBankFound = true;
						}
						else if(item.type[0] === "04")
						{
							buyerBankFound = true;
						}	
					});
				})
			});
		
			
			if((sellerBankFound && buyerBankFound))
			{
				dispMsg = misys.getLocalization("contactEitherBuyerbankOrSellerbank");
			}
			else if(!sellerBankFound && !buyerBankFound)
			{
				dispMsg = misys.getLocalization("contactDetailsError");
			}
			}
			return dispMsg;
		},
		
		checkLineItemChildrens : function(){

			var exist = false;
			var lineItems = dj.byId("line-items");
			if(lineItems && lineItems.grid)
			{
				lineItems.grid.store.fetch({query: {store_id: '*'}, onComplete: d.hitch(this, function(items, request){
					for(var item in items){
						if(items[item].taxes[0]._values.length > 0)
						{exist = true;}
						if(items[item].adjustments[0]._values.length > 0)
						{exist = true;}
						if(items[item].freight_charges[0]._values.length > 0)
						{exist = true;}
						if(items[item].incoterms[0]._values.length > 0)
						{exist = true;}
						if((items[item].air_routing_summaries && items[item].air_routing_summaries[0]._values.length > 0) || (items[item].sea_routing_summaries && items[item].sea_routing_summaries[0]._values.length > 0) || 
								(items[item].road_routing_summaries && items[item].road_routing_summaries[0]._values.length > 0) || (items[item].rail_routing_summaries && items[item].rail_routing_summaries[0]._values.length > 0) || 
								(items[item].final_dest_place && items[item].final_dest_place[0].length > 0) || (items[item].taking_in_charge && items[item].taking_in_charge[0].length > 0))
						{exist = true;}
					}
				})});
			}
			
			return exist;
		},
		checkPOChildrens : function(){

			var exist = false;
			var adjustments = dj.byId("po-adjustments");
			if(adjustments && adjustments.store && adjustments.store._arrayOfTopLevelItems.length > 0)
			{
				exist = true;
			}

			// PO Taxes
			var taxes = dj.byId("po-taxes");
			if(taxes && taxes.store && taxes.store._arrayOfTopLevelItems.length > 0)
			{
				exist = true;
			}

			// PO FreightCharges
			var freights = dj.byId("po-freight-charges");
			if(freights && freights.store && freights.store._arrayOfTopLevelItems.length > 0)
			{
				exist = true;
			}
			
			var incoterms = dj.byId("misys_openaccount_widget_Incoterms_0");
			if(incoterms && incoterms.store && incoterms.store._arrayOfTopLevelItems.length > 0)
			{
				exist = true;
			}
			
			//Routing Summary
			var airRoutingSummaries = dj.byId("air_routing_summaries");
			var seaRoutingSummaries = dj.byId("sea_routing_summaries");
			var roadRoutingSummaries = dj.byId("road_routing_summaries");
			var railRoutingSummaries = dj.byId("rail_routing_summaries");
			var multimodalTic = dj.byId("taking_in_charge");
			var multimodalFdp = dj.byId("final_dest_place");
			if((airRoutingSummaries && airRoutingSummaries.store && airRoutingSummaries.store._arrayOfTopLevelItems.length > 0) || (seaRoutingSummaries && seaRoutingSummaries.store && seaRoutingSummaries.store._arrayOfTopLevelItems.length > 0) || (roadRoutingSummaries && roadRoutingSummaries.store && roadRoutingSummaries.store._arrayOfTopLevelItems.length > 0) || (railRoutingSummaries && railRoutingSummaries.store && railRoutingSummaries.store._arrayOfTopLevelItems.length > 0) || (multimodalTic && multimodalTic.value !== "") || (multimodalFdp && multimodalFdp.value !== "")) 
			{
				exist = true;
			}
			return exist;
		},
		
		validateIBANAccountNo : function()
		{
			var strAccount = this.get("value");
		  // If the string is empty, we return true
		  if ("S" + strAccount == "S") {
		    return true;
		  }
		  
		  var regExp = /^[a-zA-Z]{2,2}[0-9]{2,2}[a-zA-Z0-9]{1,30}$/;
		  if (regExp.test(strAccount))
		  {
		    return true;
		  }

		  misys.dialog.show('ERROR', misys.getLocalization('invalidIBANAccNoError',[strAccount]));
		  this.set("value","");
		  return false;
		},
		
		validateBBANAccountNo : function()
		{
		  var account = this.get("value");
		  // If the string is empty, we return true
		  if ("S" + account == "S") {
		    return true;
		  }
		  
		  var regExp = /^[a-zA-Z0-9]{1,30}$/;
		  if (regExp.test(account))
		  {
		    return true;
		  }
		  
		  misys.dialog.show('ERROR', misys.getLocalization('invalidBBANAccNoError',[account]));
		  this.set("value","");
		  return false;
		},
		
		validateUPICAccountNo : function()
		{
			var account = this.get("value");
		  // If the string is empty, we return true
		  if ("S" + account === "S") {
		    return true;
		  }
		  
		  var regExp = /^[0-9]{8,17}$/;
		  if (regExp.test(account))
		  {
		    return true;
		  }
		  
		  misys.dialog.show('ERROR', misys.getLocalization('invalidUPICAccNoError',[account]));
		  this.set("value","");
		  return false;
		},
		
		
		
		/**
		 * <h4>Summary:</h4>
		 * This method is used to fetch the max BPO expiry date if present.
		 * 
		 */
		getMaxBPOExpDate : function()
		{
			var maxExpiryDate = null;
			var gridPaymentObligation = dj.byId("bank-payment-obligations");
			if(gridPaymentObligation && gridPaymentObligation.store && gridPaymentObligation.store._arrayOfTopLevelItems.length > 0) {
				gridPaymentObligation.store.fetch({
					query:{store_id:"*"},
					onComplete: dojo.hitch(gridPaymentObligation, function(items, request){
						dojo.forEach(items, function(item){
							if(item.payment_expiry_date[0] !== "")
							{
								var paymentExpiry = dojo.date.locale.parse(item.payment_expiry_date[0],{locale:dojo.config.locale, formatLength:"short", selector:"date" });
								
								if(maxExpiryDate == null)
								{
									maxExpiryDate = paymentExpiry;
								}
								else if(maxExpiryDate < paymentExpiry ) {
									maxExpiryDate = paymentExpiry;
								}
								
							}
						});
					})
				});
			}
			return maxExpiryDate;
		},
		
		/**
		 * <h4>Summary:</h4>
		 * This method is used to fetch the max BPO expiry date if present.
		 * 
		 */
		getMaxBPOExpiryDate : function () {
			var maxExpiryDate = new Date();
			maxExpiryDate.setHours(0, 0, 0, 0);
			var flag = false;
			var gridPaymentObligation = dj.byId("bank-payment-obligations");
			if(gridPaymentObligation && gridPaymentObligation.store && gridPaymentObligation.store._arrayOfTopLevelItems.length > 0) {
				gridPaymentObligation.store.fetch({
					query:{store_id:"*"},
					onComplete: dojo.hitch(gridPaymentObligation, function(items, request){
						dojo.forEach(items, function(item){
							if(item.payment_expiry_date[0] !== "")
							{
								var paymentExpiry = dojo.date.locale.parse(item.payment_expiry_date[0],{locale:dojo.config.locale, formatLength:"short", selector:"date" });
								if(maxExpiryDate < paymentExpiry ) {
									maxExpiryDate = paymentExpiry;
									flag= true;
								}
							}
						});
					})
				});
			}
			return flag?maxExpiryDate:"";
		},
		
		/**
		 * <h4>Summary:</h4>
		 * This method is used to fetch the least BPO expiry date if present.
		 * 
		 */
		getLeastBPOExpiryDate : function () {
			var leastExpiryDate = "";
			var gridPaymentObligation = dj.byId("bank-payment-obligations");
			if(gridPaymentObligation && gridPaymentObligation.store && gridPaymentObligation.store._arrayOfTopLevelItems.length > 0) {
				gridPaymentObligation.store.fetch({
					query:{store_id:"*"},
					onComplete: dojo.hitch(gridPaymentObligation, function(items, request){
						dojo.forEach(items, function(item){
							if(item.payment_expiry_date[0] !== "")
							{
								var paymentExpiry = dojo.date.locale.parse(item.payment_expiry_date[0],{locale:dojo.config.locale, formatLength:"short", selector:"date" });
								if(leastExpiryDate == ""){
									leastExpiryDate = paymentExpiry;
								}
								else if(paymentExpiry < leastExpiryDate ) {
									leastExpiryDate = paymentExpiry;
								}
							}
						});
					})
				});
			}
			return leastExpiryDate;
		},
		
		/**
		 * <h4>Summary:</h4>
		 * This method is used to update the Open Account expiry date with the max BPO expiry date if present.
		 * 
		 */
		updateOpenAccountExpiryDate: function() {
			
			var maxExpiryDate;
			if(dj.byId("exp_date") && dj.byId("exp_date").get("value") !== "") {
				maxExpiryDate = dj.byId("exp_date").get("value");
			}
			var maxPmtOblgtnExpiryDate = m.getMaxBPOExpiryDate();
			if(maxPmtOblgtnExpiryDate !== "" && maxExpiryDate!== "") {
				if(maxExpiryDate < maxPmtOblgtnExpiryDate ) {
					dj.byId("exp_date").set("value", maxPmtOblgtnExpiryDate);
				}
			}
			
		},
		
		/**
		 * <h4>Summary:</h4>
		 * This method is used to perform the partial shipment validations, on the openaccount form.
		 * 
		 */
		performPartialShipmentActions : function() {
			var lineItems = dj.byId("line-items");
			if(lineItems && lineItems.grid)
			{
				lineItems.grid.store.fetch({query: {store_id: '*'}, onComplete: d.hitch(this, function(items, request){
					for(var item in items){
						if(items[item].taxes[0]._values.length > 0)
						{exist = true;}
						if(items[item].adjustments[0]._values.length > 0)
						{exist = true;}
						if(items[item].freight_charges[0]._values.length > 0)
						{exist = true;}
						if(items[item].incoterms[0]._values.length > 0)
						{exist = true;}
					}
				})});
			}
		},
		
		/**
		 * <h4>Summary:</h4>
		 * This method is used to get the payment term code or other term description, on the openaccount form.
		 * 
		 */
		getPaymentDisplayedValue : function(rowIndex, item)
		{
			var value = "";
			if(item)
			{
				if(item.code_desc && item.code_desc[0] && item.code_desc[0] !== "")
				{
					value = item.code_desc[0];
				}
				else if((item.code && item.code[0] && item.code[0] !== "") || (item.payment_code && item.payment_code[0] && item.payment_code[0] !== ""))
				{
					value = (item.code && item.code[0] && item.code[0] !== "") ? item.code[0]: (item.payment_code && item.payment_code[0] && item.payment_code[0] !== "")?item.payment_code[0]:"";
				}
				else if ((item.other_paymt_terms && item.other_paymt_terms[0] && item.other_paymt_terms[0] !== "") || (item.payment_other_term && item.payment_other_term[0] && item.payment_other_term[0] !== ""))
				{
					value = (item.other_paymt_terms && item.other_paymt_terms[0] && item.other_paymt_terms[0] !== "")?item.other_paymt_terms[0]: (item.payment_other_term && item.payment_other_term[0] && item.payment_other_term[0] !== "")?item.payment_other_term[0]:"";
				}
			}
			return value;
		},
		
		/**
		 * <h4>Summary:</h4>
		 * This method is used to perform the action srequired on form load, on the openaccount fields.
		 * 
		 */
		oaOnLoadActions : function()
		{	
			var gridAirRoutingSummary = dj.byId("air_routing_summaries");
			var gridSeaRoutingSummary = dj.byId("sea_routing_summaries");
			var gridRoadRoutingSummary = dj.byId("road_routing_summaries");
			var gridRailRoutingSummary = dj.byId("rail_routing_summaries");
			var gridLineAirRoutingSummary = dj.byId("line_item_air_routing_summaries");
			var gridLineSeaRoutingSummary = dj.byId("line_item_sea_routing_summaries");
			var gridLineRoadRoutingSummary = dj.byId("line_item_road_routing_summaries");
			var gridLineRailRoutingSummary = dj.byId("line_item_rail_routing_summaries");
			//-------------------- Line Items --------------------
			/*
			 * - IF line item earliest ship date is present, then disable OA earliset ship date, OA latest ship date and line item add shipment schedule button.
			 * - ELSE IF line item shipment schedule button is present, then
			 *   	->enable OA earliset ship date, OA latest ship date
			 * 	 	->IF partial shipment is allowed, then enable line item add shipment schedule button.
			 * 	
			 */
			if(dj.byId("line_item_earliest_ship_date") && dj.byId("line_item_earliest_ship_date").get("value") !== null && dj.byId("dijit_form_Button_8")) {
				// Shipment schedule button
					dj.byId("dijit_form_Button_8").set("disabled", true);
					dj.byId("earliest_ship_date")?dj.byId("earliest_ship_date").set("disabled", true):"";
					dj.byId("last_ship_date")?dj.byId("last_ship_date").set("disabled", true):"";
					
			}
			else if(dj.byId("dijit_form_Button_8")) {
				if(dj.byId("part_ship_2") && dj.byId("part_ship_2").get("checked") !== true ) {
					// Shipment schedule button
					dj.byId("dijit_form_Button_8").set("disabled", false);
				}
				dj.byId("earliest_ship_date")?dj.byId("earliest_ship_date").set("disabled", false):"";
				dj.byId("last_ship_date")?dj.byId("last_ship_date").set("disabled", false):"";
			}
			/*
			 * - IF line item last ship date is present, then disable OA earliset ship date, OA latest ship date and line item add shipment schedule button.
			 * - ELSE IF line item shipment schedule button is present, then
			 * 		->enable OA earliset ship date, OA latest ship date
			 * 	 	->IF partial shipment is allowed, then enable line item add shipment schedule button.
			 */
			if(dj.byId("line_item_last_ship_date") && dj.byId("line_item_last_ship_date").get("value") !== null && dj.byId("dijit_form_Button_8")) {
				// Shipment schedule button
					dj.byId("dijit_form_Button_8").set("disabled", true);
					dj.byId("earliest_ship_date")?dj.byId("earliest_ship_date").set("disabled", true):"";
					dj.byId("last_ship_date")?dj.byId("last_ship_date").set("disabled", true):"";
			}
			else if(dj.byId("dijit_form_Button_8")) {
				if(dj.byId("part_ship_2") && dj.byId("part_ship_2").get("checked") !== true ) {
					// Shipment schedule button
					dj.byId("dijit_form_Button_8").set("disabled", false);
				}
				dj.byId("earliest_ship_date")?dj.byId("earliest_ship_date").set("disabled", false):"";
				dj.byId("last_ship_date")?dj.byId("last_ship_date").set("disabled", false):"";
			}
			// Disable shipment dates if shipment sub schedule exists
			if(dj.byId("line_item_shipment_schedules") && dj.byId("line_item_last_ship_date") && dj.byId("line_item_earliest_ship_date")) {
				var gridSchedules = dj.byId("line_item_shipment_schedules");
				var flag = false;
				if(gridSchedules && gridSchedules.store && gridSchedules.store._arrayOfTopLevelItems.length > 0) {
					flag= true;
				}
				dj.byId("line_item_last_ship_date").set("disabled",flag);
				dj.byId("line_item_earliest_ship_date").set("disabled",flag);
			}
			else if(dj.byId("line_item_last_ship_date") && dj.byId("line_item_earliest_ship_date")){
				dj.byId("line_item_last_ship_date").set("disabled",false);
				dj.byId("line_item_earliest_ship_date").set("disabled",false);
			}
			
			//-------------------- Line Items --------------------
			// Clear Routing Individual Summaries, when Partial Shipment is not allowed
			if(dj.byId("part_ship_2") && dj.byId("part_ship_2").get("checked") === true)
				{
				gridLineAirRoutingSummary.clear();
				gridLineSeaRoutingSummary.clear();
				gridLineRoadRoutingSummary.clear();
				gridLineRailRoutingSummary.clear();
				
				
				}
			
			// Disable add payment term button if partial shipment is not allowed and one payment term exists
			if(dj.byId("part_ship_2") && dj.byId("part_ship_2").get("checked") === true && dj.byId("add_payment_term_button")) {
				var gridPayments = dj.byId("po-payments");
				var bool = false;
				if(gridPayments && gridPayments.store && gridPayments.store._arrayOfTopLevelItems.length > 0) {
					bool= true;
				}
				dj.byId("add_payment_term_button").set("disabled",bool);
			}
			else {
				dj.byId("add_payment_term_button").set("disabled",false);
			}
			/*
			 * - IF Transhipment is not allowed , then 
			 * 		->disable multimodal transport,
			 * 		->Disable add button for the individual routing summaries, if any value is already present.
			 * - ELSE IF multimodal is present, enable it.
			 */
			if(dj.byId("tran_ship_2") && dj.byId("tran_ship_2").get("checked") === true && dj.byId("taking_in_charge") && dj.byId("final_dest_place")) {
				dj.byId("taking_in_charge").set("value","");
				dj.byId("final_dest_place").set("value","");
				dj.byId("taking_in_charge").set("disabled",true);
				dj.byId("final_dest_place").set("disabled",true);
				
				if((gridAirRoutingSummary && gridAirRoutingSummary.store && gridAirRoutingSummary.store._arrayOfTopLevelItems.length > 0)||
						(gridSeaRoutingSummary && gridSeaRoutingSummary.store && gridSeaRoutingSummary.store._arrayOfTopLevelItems.length > 0)||
						(gridRoadRoutingSummary && gridRoadRoutingSummary.store && gridRoadRoutingSummary.store._arrayOfTopLevelItems.length > 0)||
						(gridRailRoutingSummary && gridRailRoutingSummary.store && gridRailRoutingSummary.store._arrayOfTopLevelItems.length > 0)) 
				{
				
				gridAirRoutingSummary.addButtonNode.set("disabled",true);
				gridSeaRoutingSummary.addButtonNode.set("disabled",true);
				gridRoadRoutingSummary.addButtonNode.set("disabled",true);
				gridRailRoutingSummary.addButtonNode.set("disabled",true);
				
				}
			
			}
			else if (dj.byId("taking_in_charge") && dj.byId("final_dest_place")){
				dj.byId("taking_in_charge").set("disabled",false);
				dj.byId("final_dest_place").set("disabled",false);
			}
			//Payment Terms
			if(dj.byId("pmt_term_other_code") && dj.byId("pmt_term_other_code").get("checked")=== true) {
				dojo.style(dojo.byId("details_other_paymt_terms_row"), "display", "block");
				dj.byId("details_other_paymt_terms").set("required",true);
			}
			else if(dj.byId("pmt_term_other_code")) {
				dojo.style(dojo.byId("details_other_paymt_terms_row"), "display", "none");
				dj.byId("details_other_paymt_terms").set("required",false);
			}
			if(dj.byId("pmt_term_code") && dj.byId("pmt_term_code").get("checked")=== true) {
				dojo.style(dojo.byId("paymentTermCode"), "display", "block");
				dj.byId("details_code").set("required",true);
			}
			else if(dj.byId("pmt_term_code")) {
				dojo.style(dojo.byId("paymentTermCode"), "display", "none");
				dj.byId("details_code").set("required",false);
			}
			
			//Settlement Terms
			if(dj.byId("credtr_name_address").get("checked")=== true && d.byId("settlement_creditor_agent_name")) {
				d.style(d.byId("settlement_creditor_agent_name"),"display","block");
				dj.byId("fin_inst_name").set("required",true);
				dj.byId("fin_inst_post_code").set("required",true);
				dj.byId("fin_inst_town_name").set("required",true);
				dj.byId("fin_inst_country").set("required",true);
			}
			else if(d.byId("settlement_creditor_agent_name")){
				d.style(d.byId("settlement_creditor_agent_name"),"display","none");
				dj.byId("fin_inst_name").set("required",false);
				dj.byId("fin_inst_post_code").set("required",false);
				dj.byId("fin_inst_town_name").set("required",false);
				dj.byId("fin_inst_country").set("required",false);
				dj.byId("fin_inst_name").set("value","");
				dj.byId("fin_inst_post_code").set("value","");
				dj.byId("fin_inst_town_name").set("value","");
				dj.byId("fin_inst_country").set("value","");
			}
			if(dj.byId("credtr_bic").get("checked")=== true && d.byId("settlement_creditor_agent_bic")) {
				d.style(d.byId("settlement_creditor_agent_bic"),"display","block");
				dj.byId("fin_inst_bic").set("required",true);
			}
			else if (d.byId("settlement_creditor_agent_bic")){
				d.style(d.byId("settlement_creditor_agent_bic"),"display","none");
				dj.byId("fin_inst_bic").set("required",false);
				dj.byId("fin_inst_bic").set("value","");
			}
			if(dj.byId("fin_account_iban").get("checked")=== true && d.byId("seller_account_iban_row")) {
				d.style(d.byId("seller_account_iban_row"),"display","block");
				dj.byId("seller_account_iban").set("required",true);
			}
			else if (d.byId("seller_account_iban_row")){
				d.style(d.byId("seller_account_iban_row"),"display","none");
				dj.byId("seller_account_iban").set("required",false);
			}
			if(dj.byId("fin_account_bban").get("checked")=== true && d.byId("seller_account_bban_row")) {
				d.style(d.byId("seller_account_bban_row"),"display","block");
				dj.byId("seller_account_bban").set("required",true);
			}
			else if (d.byId("seller_account_bban_row")) {
				d.style(d.byId("seller_account_bban_row"),"display","none");
				dj.byId("seller_account_bban").set("required",false);
			}
			if(dj.byId("fin_account_upic").get("checked")=== true && d.byId("seller_account_upic_row")) {
				d.style(d.byId("seller_account_upic_row"),"display","block");
				dj.byId("seller_account_upic").set("required",true);
			}
			else if (d.byId("seller_account_upic_row")) {
				d.style(d.byId("seller_account_upic_row"),"display","none");
				dj.byId("seller_account_upic").set("required",false);
			}
			if(dj.byId("fin_account_prop").get("checked")=== true && d.byId("seller_account_id_row")) {
				d.style(d.byId("seller_account_id_row"),"display","block");
				dj.byId("seller_account_id").set("required",true);
			}
			else if(d.byId("seller_account_id_row")) {
				d.style(d.byId("seller_account_id_row"),"display","none");
				dj.byId("seller_account_id").set("required",false);
			}
			if(dj.byId("crdtr_act_code").get("checked")=== true && d.byId("seller_account_type_code_row")) {
				d.style(d.byId("seller_account_type_code_row"),"display","block");
				dj.byId("seller_account_type_code").set("required",true);
			}
			else if (d.byId("seller_account_type_code")) {
				d.style(d.byId("seller_account_type_code_row"),"display","none");
				dj.byId("seller_account_type_code").set("required",false);
			}
			if(dj.byId("crdtr_act_prop").get("checked")=== true && d.byId("seller_account_type_prop_row")) {
				d.style(d.byId("seller_account_type_prop_row"),"display","block");
				dj.byId("seller_account_type_prop").set("required",true);
			}
			else if (d.byId("seller_account_type_prop_row")) {
				d.style(d.byId("seller_account_type_prop_row"),"display","none");
				dj.byId("seller_account_type_prop").set("required",false);
			}
			/*
			 * IF, earliest shipment date or latest shipment date on OA form is present, then disable line item shipment details.
			 * ELSE IF, earliest ship date and latest shipment dates are both empty on OA form, 
			 * 		- enable line item earliest ship date and latest shipment dates.
			 * 		- IF Partial Shipment is NOT ALLOWED, enable add shipment schedule button.
			 * 		
			 */
			if((dj.byId("last_ship_date") && dj.byId("last_ship_date").get("value")!== null) || (dj.byId("earliest_ship_date") && dj.byId("earliest_ship_date").get("value")!== null)) 
			{
				if(dj.byId("line_item_earliest_ship_date") && dj.byId("line_item_last_ship_date") && dj.byId("dijit_form_Button_8")) {
					dj.byId("line_item_earliest_ship_date").set("value", null);
					dj.byId("line_item_earliest_ship_date").set("disabled", true);
					dj.byId("line_item_last_ship_date").set("value",null);
					dj.byId("line_item_last_ship_date").set("disabled",true);
					dj.byId("dijit_form_Button_8").set("disabled", true);
				}
			}
			// enable line item shipment schedule when earliest ship date and latest shipment dates are both empty
			else if((dj.byId("last_ship_date") && dj.byId("last_ship_date").get("value")=== null) && (dj.byId("earliest_ship_date") && dj.byId("earliest_ship_date").get("value")=== null)) {
				if(dj.byId("line_item_last_ship_date") && dj.byId("line_item_earliest_ship_date") && dj.byId("dijit_form_Button_8")) {
					dj.byId("line_item_earliest_ship_date").set("disabled", false);
					dj.byId("line_item_last_ship_date").set("disabled",false);
					if(dj.byId("part_ship_2") && dj.byId("part_ship_2").get("checked") !== true ) {
						// Shipment schedule button
						dj.byId("dijit_form_Button_8").set("disabled", false);
					}
				}
			}
			if((dj.byId("tnxtype") && (dj.byId("tnxtype").get("value") !== "38")) || 
			    	(dj.byId("close_tnx") && (dj.byId("close_tnx").get("checked") === false)))
			{
				m.updateOpenAccountExpiryDate();
			}
			
			/*
			 * IF, line items shipment dates/schedule is present, disable OA shipment dates, 
			 * ELSE, enable them.
			 */
			if(m.hasLineItemShipmentPeriodDefined()) {
				dj.byId("last_ship_date")? dj.byId("last_ship_date").set("disabled", true):"";
				dj.byId("earliest_ship_date")? dj.byId("earliest_ship_date").set("disabled", true):"";
			}
			else{
				dj.byId("last_ship_date")? dj.byId("last_ship_date").set("disabled", false):"";
				dj.byId("earliest_ship_date")? dj.byId("earliest_ship_date").set("disabled", false):"";
			}
			
			// diasble commercial dataset , transport dataset and insurance dataset and payment transport dataset for EA add button if one dataset alreeady present
			var gridCommercialDs =dj.byId("commercial-ds");
			if((gridCommercialDs && gridCommercialDs.store && gridCommercialDs.store._arrayOfTopLevelItems.length > 0)) {
				dj.byId("add_commercial_ds_button").set("disabled",true);
			}
			var gridInsurance = dj.byId("insurance-ds-details");
			if((gridInsurance && gridInsurance.store && gridInsurance.store._arrayOfTopLevelItems.length > 0)) {
				dj.byId("add_insurance_ds_button").set("disabled",true);
			}
			var gridTransportDs = dj.byId("transport-ds-details");
			if((gridTransportDs && gridTransportDs.store && gridTransportDs.store._arrayOfTopLevelItems.length > 0)) {
				dj.byId("add_transport_ds_button").set("disabled",true);
			}
			var gridPmtTransportDs = dj.byId("payment-transport-ds-details");
			if((gridPmtTransportDs && gridPmtTransportDs.store && gridPmtTransportDs.store._arrayOfTopLevelItems.length > 0)) {
				dj.byId("add_pymt_transport_ds_button").set("disabled",true);
			}
			
			var widgetConsgQty = dijit.byId("consignment_qty_details_id");
			if(widgetConsgQty)
			{
				widgetConsgQty.updateData();
				if(widgetConsgQty.store && widgetConsgQty.store._arrayOfTopLevelItems && widgetConsgQty.store._arrayOfTopLevelItems.length > 0)
				{
					var qtyArray = widgetConsgQty.store._arrayOfTopLevelItems;
					if(qtyArray && qtyArray[0] &&  qtyArray[0].pmt_tds_qty_unit_measr_code && qtyArray[0].pmt_tds_qty_unit_measr_code[0] !== "" && 
							qtyArray[0].pmt_tds_qty_val && qtyArray[0].pmt_tds_qty_val[0] !== "")
					{
						widgetConsgQty.addButtonNode.set("disabled", true);						
					}
					else
					{
						widgetConsgQty.addButtonNode.set("disabled", false);
					}					
				}
				else
				{
					widgetConsgQty.addButtonNode.set("disabled", false);
				}
			}
			
			var widgetConsgVol = dijit.byId("consignment_vol_details_id");
			if(widgetConsgVol)
			{
				widgetConsgVol.updateData();
				if(widgetConsgVol.store && widgetConsgVol.store._arrayOfTopLevelItems && widgetConsgVol.store._arrayOfTopLevelItems.length > 0)
				{
					var volArray = widgetConsgVol.store._arrayOfTopLevelItems;
					if(volArray && volArray[0] &&  volArray[0].pmt_tds_vol_unit_measr_code && volArray[0].pmt_tds_vol_unit_measr_code[0] !== "" && 
							volArray[0].pmt_tds_vol_val && volArray[0].pmt_tds_vol_val[0] !== "")
					{
						widgetConsgVol.addButtonNode.set("disabled", true);						
					}
					else
					{
						widgetConsgVol.addButtonNode.set("disabled", false);
					}
				}
				else
				{
					widgetConsgVol.addButtonNode.set("disabled", false);
				}
			}
			
			var widgetConsgWeight = dijit.byId("consignment_weight_details_id");
			if(widgetConsgWeight)
			{
				widgetConsgWeight.updateData();
				if(widgetConsgWeight.store && widgetConsgWeight.store._arrayOfTopLevelItems && widgetConsgWeight.store._arrayOfTopLevelItems.length > 0)
				{
					var weightArray = widgetConsgWeight.store._arrayOfTopLevelItems;
					if(weightArray && weightArray[0] &&  weightArray[0].pmt_tds_weight_unit_measr_code && weightArray[0].pmt_tds_weight_unit_measr_code[0] !== "" && 
							weightArray[0].pmt_tds_weight_val && weightArray[0].pmt_tds_weight_val[0] !== "")
					{
						widgetConsgWeight.addButtonNode.set("disabled", true);						
					}
					else
					{
						widgetConsgWeight.addButtonNode.set("disabled", false);
					}
				}
				else
				{
					widgetConsgWeight.addButtonNode.set("disabled", false);
				}
			}
			// To Clear the line item details when partial shipment is not allowed.
			if(dj.byId("part_ship_2") && dj.byId("part_ship_2").get("checked") === true) {
				m.clearLineItemDetail();
				dj.byId("last_ship_date")? dj.byId("last_ship_date").set("disabled", false):"";
				dj.byId("earliest_ship_date")? dj.byId("earliest_ship_date").set("disabled", false):"";
			}
			
			
		},
		
		/**
		 * <h4>Summary:</h4>
		 * This method is used to bind the actions required on the respective openaccount fields.
		 * 
		 */
		oaCommonBindEvents : function()
		{
			m.setValidation("earliest_ship_date", m.validateEarliestShipDate);
			//---------------------- Line Items ----------------------
			m.setValidation("line_item_last_ship_date", m.validateOALastShipmentDate);
		    m.setValidation("line_item_earliest_ship_date", m.validateEarliestShipDate); 
		    m.setValidation("schedule_earliest_ship_date", m.validateEarliestShipDate);
		    m.setValidation("schedule_latest_ship_date",m.validateOALastShipmentDate);
		    m.setValidation("exp_date", m.validateOpenAccountExpiryDate);
		    m.setValidation("payment_expiry_date", m.validateBPOExpiryDate);
		    m.setValidation("last_match_date", m.validateLastMatchDate);
		    
		   //---------------------- Settlement Terms ----------------------
		    m.connect("creditor_account_id_iban","onChange", m.validateIBANAccountNo);
			m.connect("creditor_account_id_bban","onChange", m.validateBBANAccountNo);
			m.connect("creditor_account_id_upic","onChange", m.validateUPICAccountNo);
			m.connect("line_item_earliest_ship_date", "onChange", function() {
				if(dj.byId("line_item_earliest_ship_date").get("value") !== null && dj.byId("dijit_form_Button_8") && dj.byId("last_ship_date") && dj.byId("earliest_ship_date")) {
					dj.byId("last_ship_date").set("disabled",true);
					dj.byId("earliest_ship_date").set("disabled",true);
					// Shipment schedule button
					dj.byId("dijit_form_Button_8").set("disabled", true);
				}
				else if(dj.byId("line_item_last_ship_date") && dj.byId("line_item_last_ship_date").get("value") === null && dj.byId("dijit_form_Button_8") && dj.byId("last_ship_date") && dj.byId("earliest_ship_date")) {
					dj.byId("last_ship_date").set("disabled",false);
					dj.byId("earliest_ship_date").set("disabled",false);
					if(dj.byId("part_ship_2") && dj.byId("part_ship_2").get("checked") !== true ) {
						// Shipment schedule button
						dj.byId("dijit_form_Button_8").set("disabled", false);
					}
				}
			});
			m.connect("line_item_last_ship_date", "onChange", function() {
				if(dj.byId("line_item_last_ship_date").get("value") !== null && dj.byId("dijit_form_Button_8") && dj.byId("last_ship_date") && dj.byId("earliest_ship_date")) {
					// Shipment schedule button
					dj.byId("dijit_form_Button_8").set("disabled", true);
					dj.byId("last_ship_date").set("disabled",true);
					dj.byId("earliest_ship_date").set("disabled",true);
				}
				else if(dj.byId("line_item_earliest_ship_date") && dj.byId("line_item_earliest_ship_date").get("value") === null && dj.byId("dijit_form_Button_8") && dj.byId("last_ship_date") && dj.byId("earliest_ship_date")) {
					dj.byId("last_ship_date").set("disabled",false);
					dj.byId("earliest_ship_date").set("disabled",false);
					if(dj.byId("part_ship_2") && dj.byId("part_ship_2").get("checked") !== true ) {
						// Shipment schedule button
						dj.byId("dijit_form_Button_8").set("disabled", false);
					}
				}
			});
			//---------------------- Line Items ----------------------
			
			//---------------------- Shipment Details ----------------------
			m.setValidation("last_ship_date", m.validateOALastShipmentDate);
			
			m.connect("part_ship_2","onChange", function() {
				var bool = false;
				if(dj.byId("part_ship_2") && dj.byId("part_ship_2").get("checked") === true) {
					var gridPayments = dj.byId("po-payments");
					if(gridPayments && gridPayments.store && gridPayments.store._arrayOfTopLevelItems.length > 0) {
						gridPayments.store.fetch({
							query:{store_id:"*"},
							onComplete: dojo.hitch(gridPayments, function(items, request){
								dojo.forEach(items, function(item){
									bool= true;
								});
							})
						});
					}
					// Show confirmation dialog on selection of partial shipment not allowed and revert to allowed if pressed cancel
					if(dj.byId("line-items") && dj.byId("line-items").store && dj.byId("line-items").store._arrayOfTopLevelItems.length > 0) {
						m.dialog.show("CONFIRMATION",m.getLocalization("clearLineItemShipmentDetails"),'','','','',function () {
						// To Clear the line item details when partial shipment is not allowed.
						m.clearLineItemDetail();
						
						},function () {
							dj.byId("part_ship_2").set("checked",false);
							dj.byId("part_ship_1").set("checked", true);
						});
					}
				}
				dj.byId("last_ship_date")?dj.byId("last_ship_date").set("disabled",false):"";
				dj.byId("earliest_ship_date")?dj.byId("earliest_ship_date").set("disabled", false):"";
				dj.byId("add_payment_term_button")?dj.byId("add_payment_term_button").set("disabled",bool):"";
			});
			
			//---------------------- Shipment Details ----------------------
			// Disable multimodal transport when trans shipment is not allowed
			
			m.connect("tran_ship_2","onChange", function() {
				
				var gridAirRoutingSummary = dj.byId("air_routing_summaries");
				var gridSeaRoutingSummary = dj.byId("sea_routing_summaries");
				var gridRoadRoutingSummary = dj.byId("road_routing_summaries");
				var gridRailRoutingSummary = dj.byId("rail_routing_summaries");
				var gridLineAirRoutingSummary = dj.byId("line_item_air_routing_summaries");
				var gridLineSeaRoutingSummary = dj.byId("line_item_sea_routing_summaries");
				var gridLineRoadRoutingSummary = dj.byId("line_item_road_routing_summaries");
				var gridLineRailRoutingSummary = dj.byId("line_item_rail_routing_summaries");
				
				if(dj.byId("tran_ship_2") && dj.byId("tran_ship_2").get("checked") === true) {
					
					if((gridAirRoutingSummary && gridAirRoutingSummary.store && gridAirRoutingSummary.store._arrayOfTopLevelItems.length > 0)||
							(gridSeaRoutingSummary && gridSeaRoutingSummary.store && gridSeaRoutingSummary.store._arrayOfTopLevelItems.length > 0)||
							(gridRoadRoutingSummary && gridRoadRoutingSummary.store && gridRoadRoutingSummary.store._arrayOfTopLevelItems.length > 0)||
							(gridRailRoutingSummary && gridRailRoutingSummary.store && gridRailRoutingSummary.store._arrayOfTopLevelItems.length > 0)) {

						m.dialog.show("CONFIRMATION",m.getLocalization("clearTransShipmentDetails"),'','','','',function () {
							
							gridAirRoutingSummary.clear();
							gridSeaRoutingSummary.clear();
							gridRoadRoutingSummary.clear();
							gridRailRoutingSummary.clear();
												
							if(dj.byId("taking_in_charge") && dj.byId("final_dest_place") ){
								dj.byId("taking_in_charge").set("value","");
								dj.byId("final_dest_place").set("value","");
								dj.byId("taking_in_charge").set("disabled",true);
								dj.byId("final_dest_place").set("disabled",true);
								
							}
						},function () {
							dj.byId("tran_ship_2").set("checked",false);
							dj.byId("tran_ship_1").set("checked", true);
							
						});
					
					}
							
					
					// Show confirmation dialog on selection of partial shipment not allowed and revert to allowed if pressed cancel
					if((dj.byId("line-items") && dj.byId("line-items").store && dj.byId("line-items").store._arrayOfTopLevelItems.length > 0)||
							dj.byId("taking_in_charge").get("value")!=="" ||dj.byId("final_dest_place").get("value")!=="") {
						m.dialog.show("CONFIRMATION",m.getLocalization("clearTransShipmentDetails"),'','','','',function () {
							var lineItems = dj.byId("line-items");
							if(lineItems && lineItems.store && lineItems.store._arrayOfTopLevelItems.length > 0) {
								lineItems.store.fetch({
									query:{store_id:"*"},
									onComplete: dojo.hitch(lineItems, function(items, request){
										dojo.forEach(items, function(item){
											/*dj.byId("line-items").store.deleteItem(item.shipment_schedules);*/
											if(item.air_routing_summaries && item.air_routing_summaries[0])
											{
												item.air_routing_summaries[0]._values= [];
											}
											if(item.sea_routing_summaries && item.sea_routing_summaries[0])
											{
												item.sea_routing_summaries[0]._values= [];
											}
											if(item.rail_routing_summaries && item.rail_routing_summaries[0])
											{
												item.rail_routing_summaries[0]._values= [];
											}
											if(item.road_routing_summaries && item.road_routing_summaries[0])
											{
												item.road_routing_summaries[0]._values= [];
											}
											if(item.taking_in_charge && item.taking_in_charge[0])
											{
												item.taking_in_charge[0] = "";
											}
											if(item.final_dest_place && item.final_dest_place[0])
											{
												item.final_dest_place[0] = "";
											}
										});
									})
								});
							}
							if(dj.byId("taking_in_charge") && dj.byId("final_dest_place") ){
								dj.byId("taking_in_charge").set("value","");
								dj.byId("final_dest_place").set("value","");
								dj.byId("taking_in_charge").set("disabled",true);
								dj.byId("final_dest_place").set("disabled",true);
								
							}
						},function () {
							dj.byId("tran_ship_2").set("checked",false);
							dj.byId("tran_ship_1").set("checked", true);
							
						});
					
					}
							
					
					dj.byId("taking_in_charge")?dj.byId("taking_in_charge").set("disabled",true):"";
					dj.byId("final_dest_place")?dj.byId("final_dest_place").set("disabled",true):"";	
				}
				else{	
						dj.byId("taking_in_charge")?dj.byId("taking_in_charge").set("disabled",false):"";
						dj.byId("final_dest_place")?dj.byId("final_dest_place").set("disabled",false):"";
						dj.byId("line_item_taking_in_charge")?dj.byId("line_item_taking_in_charge").set("disabled",false):"";
						dj.byId("line_item_final_dest_place")?dj.byId("line_item_final_dest_place").set("disabled",false):"";
						gridAirRoutingSummary.addButtonNode.set("disabled",false);
						gridSeaRoutingSummary.addButtonNode.set("disabled",false);
						gridRoadRoutingSummary.addButtonNode.set("disabled",false);
						gridRailRoutingSummary.addButtonNode.set("disabled",false);
						gridLineAirRoutingSummary.addButtonNode.set("disabled",false);
						gridLineSeaRoutingSummary.addButtonNode.set("disabled",false);
						gridLineRoadRoutingSummary.addButtonNode.set("disabled",false);
						gridLineRailRoutingSummary.addButtonNode.set("disabled",false);
				}
			});
			
			
			
			m.connect("earliest_ship_date", "onBlur", function() {
				if(dj.byId("line_item_earliest_ship_date") && dj.byId("line_item_last_ship_date") && dj.byId("dijit_form_Button_8") && this.get("value")!== null) {
					dj.byId("line_item_earliest_ship_date").set("value", null);
					dj.byId("line_item_earliest_ship_date").set("disabled", true);
					dj.byId("line_item_last_ship_date").set("value",null);
					dj.byId("line_item_last_ship_date").set("disabled",true);
					dj.byId("dijit_form_Button_8").set("disabled", true);
				}else if(dj.byId("line_item_last_ship_date") && dj.byId("line_item_earliest_ship_date") && dj.byId("dijit_form_Button_8") && this.get("value")=== null) {
					dj.byId("line_item_earliest_ship_date").set("disabled", false);
					dj.byId("line_item_last_ship_date").set("disabled",false);
					dj.byId("dijit_form_Button_8").set("disabled", false);
				}
			});
			
			m.connect("last_ship_date", "onBlur", function() {
				if(dj.byId("line_item_earliest_ship_date") && dj.byId("line_item_last_ship_date") && dj.byId("dijit_form_Button_8") && this.get("value")!== null) {
					dj.byId("line_item_earliest_ship_date").set("value", null);
					dj.byId("line_item_earliest_ship_date").set("disabled", true);
					dj.byId("line_item_last_ship_date").set("value",null);
					dj.byId("line_item_last_ship_date").set("disabled",true);
					dj.byId("dijit_form_Button_8").set("disabled", true);
				}else if(dj.byId("line_item_last_ship_date") && dj.byId("line_item_earliest_ship_date") && dj.byId("dijit_form_Button_8") && this.get("value")=== null) {
					dj.byId("line_item_earliest_ship_date").set("disabled", false);
					dj.byId("line_item_last_ship_date").set("disabled",false);
					dj.byId("dijit_form_Button_8").set("disabled", false);
				}
			});
			
			//------------------------ Payment Terms -----------------------
			m.setValidation("details_cur_code", m.validateCurrency);
			m.setValidation('fin_inst_country', m.validateCountry);
			m.connect("details_cur_code", "onChange", function(){
				m.setCurrency(this, ["details_amt"]);
			});
			m.connect("details_amt","onChange", function() {
				m.toggleMutuallyExclusiveMandatoryFields(["details_amt","details_pct"]);
			});
			m.connect("details_amt","onBlur", function() {
				m.toggleMutuallyExclusiveMandatoryFields(["details_amt","details_pct"]);
			});
			m.connect("details_pct","onChange", function() {
				m.toggleMutuallyExclusiveMandatoryFields(["details_amt","details_pct"]);
			});
			m.connect("details_pct","onBlur", function() {
				m.toggleMutuallyExclusiveMandatoryFields(["details_amt","details_pct"]);
			});
			//On Change of Code radio button
			m.connect("pmt_term_code","onChange", function() {
				if(dj.byId("pmt_term_code") && dj.byId("pmt_term_code").get("checked")=== true) {
					dojo.style(dojo.byId("paymentTermCode"), "display", "block");
					dj.byId("details_code").set("disabled",false);
					dj.byId("details_nb_days").set("disabled",false);
					dj.byId("details_code").set("required",true);
					dj.byId("details_other_paymt_terms").set("value","");
					dj.byId("details_other_paymt_terms").set("required",false);
					dojo.style(dojo.byId("details_other_paymt_terms_row"), "display", "none");
				}
			});
			m.connect("pmt_term_other_code","onChange", function() {
				if(dj.byId("pmt_term_other_code") && dj.byId("pmt_term_other_code").get("checked")=== true) {
					dojo.style(dojo.byId("paymentTermCode"), "display", "none");
					dj.byId("details_code").set("value","");
					dj.byId("details_nb_days").set("value","");
					dj.byId("details_code").set("required",false);
					dojo.style(dojo.byId("details_other_paymt_terms_row"), "display", "block");
					dj.byId("details_other_paymt_terms").set("disabled",false);
					dj.byId("details_other_paymt_terms").set("required",true);
				}
			});
			m.connect("details_code","onChange", function() {
				if(dj.byId("code_desc")) {
					dj.byId("code_desc").set("value",dj.byId("details_code").displayedValue);
				}
			});
			//Decode type code in widgets
			m.connect(dj.byId("details_code"), "onChange", m.paymentDetailsChange);
			//------------------------ Payment Terms -----------------------
			
			//---------------------- Settlement Terms ----------------------
			m.setValidation("fin_inst_bic", m.validateBICFormat);
			m.connect("seller_account_iban", "onChange" ,m.validateIBANAccountNo);
			m.connect("seller_account_bban","onChange" , m.validateBBANAccountNo);
			m.connect("seller_account_upic","onChange" , m.validateUPICAccountNo);
			m.connect("seller_account_cur_code",m.validateCurrency);
			
			m.connect("credtr_bic","onChange", function() {
				if(dj.byId("credtr_bic").get("checked")=== true && d.byId("settlement_creditor_agent_bic")) {
					d.style(d.byId("settlement_creditor_agent_bic"),"display","block");
					dj.byId("fin_inst_bic").set("required",true);
				}
				else if (d.byId("settlement_creditor_agent_bic")){
					d.style(d.byId("settlement_creditor_agent_bic"),"display","none");
					dj.byId("fin_inst_bic").set("required",false);
					dj.byId("fin_inst_bic").set("value","");
				}
			});
			
			m.connect("credtr_name_address","onChange", function() {
				if(dj.byId("credtr_name_address").get("checked")=== true && d.byId("settlement_creditor_agent_name")) {
					d.style(d.byId("settlement_creditor_agent_name"),"display","block");
					dj.byId("fin_inst_name").set("required",true);
					dj.byId("fin_inst_post_code").set("required",true);
					dj.byId("fin_inst_town_name").set("required",true);
					dj.byId("fin_inst_country").set("required",true);
				}
				else if(d.byId("settlement_creditor_agent_name")){
					d.style(d.byId("settlement_creditor_agent_name"),"display","none");
					dj.byId("fin_inst_name").set("required",false);
					dj.byId("fin_inst_post_code").set("required",false);
					dj.byId("fin_inst_town_name").set("required",false);
					dj.byId("fin_inst_country").set("required",false);
					dj.byId("fin_inst_name").set("value","");
					dj.byId("fin_inst_street_name").set("value","");
					dj.byId("fin_inst_post_code").set("value","");
					dj.byId("fin_inst_town_name").set("value","");
					dj.byId("fin_inst_country_sub_div").set("value","");
					dj.byId("fin_inst_country").set("value","");
				}
			});
			
			m.connect("fin_account_iban","onChange", function() {
				if(dj.byId("fin_account_iban").get("checked")=== true && d.byId("seller_account_iban_row")) {
					d.style(d.byId("seller_account_iban_row"),"display","block");
					dj.byId("seller_account_iban").set("required",true);
				}
				else if(d.byId("seller_account_iban_row")){
					d.style(d.byId("seller_account_iban_row"),"display","none");
					dj.byId("seller_account_iban").set("required",false);
					dj.byId("seller_account_iban").set("value","");
				}
			});
			m.connect("fin_account_bban","onChange", function() {
				if(dj.byId("fin_account_bban").get("checked")=== true && d.byId("seller_account_bban_row")) {
					d.style(d.byId("seller_account_bban_row"),"display","block");
					dj.byId("seller_account_bban").set("required",true);
				}
				else if (d.byId("seller_account_bban_row")) {
					d.style(d.byId("seller_account_bban_row"),"display","none");
					dj.byId("seller_account_bban").set("required",false);
					dj.byId("seller_account_bban").set("value","");
				}
			});
			m.connect("fin_account_upic","onChange", function() {
				if(dj.byId("fin_account_upic").get("checked")=== true && d.byId("seller_account_upic_row")) {
					d.style(d.byId("seller_account_upic_row"),"display","block");
					dj.byId("seller_account_upic").set("required",true);
				}
				else if (d.byId("seller_account_upic_row")) {
					d.style(d.byId("seller_account_upic_row"),"display","none");
					dj.byId("seller_account_upic").set("required",false);
					dj.byId("seller_account_upic").set("value","");
				}
			});
			m.connect("fin_account_prop","onChange", function() {
				if(dj.byId("fin_account_prop").get("checked")=== true && d.byId("seller_account_id_row")) {
					d.style(d.byId("seller_account_id_row"),"display","block");
					dj.byId("seller_account_id").set("required",true);
				}
				else if(d.byId("seller_account_id_row")) {
					d.style(d.byId("seller_account_id_row"),"display","none");
					dj.byId("seller_account_id").set("required",false);
					dj.byId("seller_account_id").set("value","");
				}
			});
			
			m.connect("crdtr_act_code","onChange", function() {
				if(dj.byId("crdtr_act_code").get("checked")=== true && d.byId("seller_account_type_code_row")) {
					d.style(d.byId("seller_account_type_code_row"),"display","block");
					dj.byId("seller_account_type_code").set("required",true);
				}
				else if (d.byId("seller_account_type_code")) {
					d.style(d.byId("seller_account_type_code_row"),"display","none");
					dj.byId("seller_account_type_code").set("required",false);
					dj.byId("seller_account_type_code").set("value","");
				}
			});
			
			m.connect("crdtr_act_prop","onChange", function() {
				if(dj.byId("crdtr_act_prop").get("checked")=== true && d.byId("seller_account_type_prop_row")) {
					d.style(d.byId("seller_account_type_prop_row"),"display","block");
					dj.byId("seller_account_type_prop").set("required",true);
				}
				else if (d.byId("seller_account_type_prop_row")) {
					d.style(d.byId("seller_account_type_prop_row"),"display","none");
					dj.byId("seller_account_type_prop").set("required",false);
					dj.byId("seller_account_type_prop").set("value","");
				}
			});
			
			//---------------------- Settlement Terms ----------------------
			
			//---------------------- Routing Summary -----------------------
			
			m.connect("taking_in_charge" , "onBlur", function() {
				if (misys.checkLineItemChildrens()){
					misys.dialog.show("ERROR", misys.getLocalization("tooManyPODetailsError"));
					dj.byId("taking_in_charge").set("value","");
					return;
				}
			});
			
			m.connect("final_dest_place" , "onBlur", function() {
				if (misys.checkLineItemChildrens()){
					misys.dialog.show("ERROR", misys.getLocalization("tooManyPODetailsError"));
					dj.byId("final_dest_place").set("value","");
					return;
				}
			});
			
			m.connect("taking_in_charge" , "onChange", function() {
				if (misys.checkLineItemChildrens()){
					misys.dialog.show("ERROR", misys.getLocalization("tooManyPODetailsError"));
					dj.byId("taking_in_charge").set("value","");
					return;
				}
			});
			
			m.connect("final_dest_place" , "onChange", function() {
				if (misys.checkLineItemChildrens()){
					misys.dialog.show("ERROR", misys.getLocalization("tooManyPODetailsError"));
					dj.byId("final_dest_place").set("value","");
					return;
				}
			});
			
			m.connect("departure_airport_code","onChange", function() {
				m.toggleMutuallyExclusiveMandatoryFields(["departure_airport_code","departure_air_town"]);
				m.toggleMutuallyInclusiveFields("departure_air_town","departure_airport_name", "disabled");
			});
			m.connect("departure_airport_code","onBlur", function() {
				m.toggleMutuallyExclusiveMandatoryFields(["departure_airport_code","departure_air_town"]);
				m.toggleMutuallyInclusiveFields("departure_air_town","departure_airport_name", "disabled");
			});
			m.connect("departure_air_town","onChange", function() {
				m.toggleMutuallyExclusiveMandatoryFields(["departure_airport_code","departure_air_town"]);
				m.toggleMutuallyInclusiveFields("departure_air_town","departure_airport_name", "disabled");
			});
			m.connect("departure_air_town","onBlur", function() {
				m.toggleMutuallyExclusiveMandatoryFields(["departure_airport_code","departure_air_town"]);
				m.toggleMutuallyInclusiveFields("departure_air_town","departure_airport_name", "disabled");
			});
			m.connect("destination_airport_code","onChange", function() {
				m.toggleMutuallyExclusiveMandatoryFields(["destination_airport_code","destination_air_town"]);
				m.toggleMutuallyInclusiveFields("destination_air_town","destination_airport_name", "disabled");
			});
			m.connect("destination_airport_code","onBlur", function() {
				m.toggleMutuallyExclusiveMandatoryFields(["destination_airport_code","destination_air_town"]);
				m.toggleMutuallyInclusiveFields("destination_air_town","destination_airport_name", "disabled");
			});
			m.connect("destination_air_town","onChange", function() {
				m.toggleMutuallyExclusiveMandatoryFields(["destination_airport_code","destination_air_town"]);
				m.toggleMutuallyInclusiveFields("destination_air_town","destination_airport_name", "disabled");
			});
			m.connect("destination_air_town","onBlur", function() {
				m.toggleMutuallyExclusiveMandatoryFields(["destination_airport_code","destination_air_town"]);
				m.toggleMutuallyInclusiveFields("destination_air_town","destination_airport_name", "disabled");
			});
			m.connect("taking_in_charge","onBlur",function(){
				m.toggleMutuallyInclusiveFields("taking_in_charge", "final_dest_place", "required");
			});
			m.connect("taking_in_charge","onChange",function(){
				m.toggleMutuallyInclusiveFields("taking_in_charge", "final_dest_place", "required");
			});
			m.connect("final_dest_place","onBlur",function(){
				m.toggleMutuallyInclusiveFields("final_dest_place", "taking_in_charge", "required");
			});
			m.connect("final_dest_place","onChange",function(){
				m.toggleMutuallyInclusiveFields("final_dest_place", "taking_in_charge", "required");
			});
			
			//Line Items Routing Summary
			m.connect("line_item_taking_in_charge" , "onBlur", function() {
				if(this.id.match("^line_item_") == "line_item_" && misys.checkPOChildrens()){
					misys.dialog.show("ERROR", misys.getLocalization("tooManyPODetailsError"));
					dj.byId("line_item_taking_in_charge").set("value","");
					return;
				}
			});
			
			m.connect("line_item_final_dest_place" , "onBlur", function() {
				if(this.id.match("^line_item_") == "line_item_" && misys.checkPOChildrens()){
					misys.dialog.show("ERROR", misys.getLocalization("tooManyPODetailsError"));
					dj.byId("line_item_final_dest_place").set("value","");
					return;
				}
			});
			
			m.connect("line_item_taking_in_charge" , "onChange", function() {
				if(this.id.match("^line_item_") == "line_item_" && misys.checkPOChildrens()){
					misys.dialog.show("ERROR", misys.getLocalization("tooManyPODetailsError"));
					dj.byId("line_item_taking_in_charge").set("value","");
					return;
				}
			});
			
			m.connect("line_item_final_dest_place" , "onChange", function() {
				if(this.id.match("^line_item_") == "line_item_" && misys.checkPOChildrens()){
					misys.dialog.show("ERROR", misys.getLocalization("tooManyPODetailsError"));
					dj.byId("line_item_final_dest_place").set("value","");
					return;
				}
			});
			m.connect("line_item_taking_in_charge","onBlur",function(){
				m.toggleMutuallyInclusiveFields("line_item_taking_in_charge", "line_item_final_dest_place", "required");
			});
			m.connect("line_item_taking_in_charge","onChange",function(){
				m.toggleMutuallyInclusiveFields("line_item_taking_in_charge", "line_item_final_dest_place", "required");
			});
			m.connect("line_item_final_dest_place","onBlur",function(){
				m.toggleMutuallyInclusiveFields("line_item_final_dest_place", "line_item_taking_in_charge", "required");
			});
			m.connect("line_item_final_dest_place","onChange",function(){
				m.toggleMutuallyInclusiveFields("line_item_final_dest_place", "line_item_taking_in_charge", "required");
			});
			//Line Items Routing Summary
			
			//---------------------- Routing Summary -----------------------
			
		},
		
		validateLastMatchDate : function(){
			
			//Do not validate for Close event
			if((dj.byId("tnxtype") && (dj.byId("tnxtype").get("value") === "38")) || 
			    	(dj.byId("close_tnx") && (dj.byId("close_tnx").get("checked") === true)))
			{
				  return true;
			}
			console.debug("[misys.openaccount.formOpenAccountEvents] Validating Last Match Date, Value", 
					this.get("value"));
			var lastMatchDate = dj.byId("last_match_date");
			var lastShipDate = dj.byId("last_ship_date");
			var maxBpoExpiryDate= m.getMaxBPOExpiryDate();
			// Validate against the greatest of latest shipment date and schedule latest ship date
			var lineItemLastShipDate = m.getMaxLineItemLatestShipmentDate();
			var shipmentLatestShipDate = m.getMaxShipemntSubScheduleLatestShipmentDate();
			if(((shipmentLatestShipDate && shipmentLatestShipDate!== "")|| (lineItemLastShipDate && lineItemLastShipDate!== ""))&& lastMatchDate){
			if(d.date.compare(shipmentLatestShipDate, lineItemLastShipDate) < 0 ) {
				// validate against the max line item last shipment date
				if(lastMatchDate && lastMatchDate.get("value") !== "" && lineItemLastShipDate !== "") {
					if(d.date.compare(lastMatchDate.get("value"), lineItemLastShipDate) > 0 ) {
						lastMatchDate.invalidMessage = m.getLocalization("LastMatchDateGreaterThanShipmentDateError",[
	                                lastMatchDate.get("displayedValue"),
	                                dojo.date.locale.format(lineItemLastShipDate,{locale:dojo.config.locale, formatLength:"short", selector:"date" })]);
						return false;
					}	
				}
				}
			else{
				// Validate against the Shipment sub schdeules latest shipment date
				 if(d.date.compare(shipmentLatestShipDate, lineItemLastShipDate) > 0 ){
					if(d.date.compare(lastMatchDate.get("value"), shipmentLatestShipDate) > 0 ) {
						lastMatchDate.invalidMessage = m.getLocalization("LastMatchDateGreaterThanShipmentDateError",[
	                                lastMatchDate.get("displayedValue"),
	                                dojo.date.locale.format(shipmentLatestShipDate,{locale:dojo.config.locale, formatLength:"short", selector:"date" })]);
						return false;
					}	
				
				 }
			}
			}
			if(lastShipDate && lastShipDate.get("value")!==null){
					if(d.date.compare(lastMatchDate.get("value"), lastShipDate.get("value")) > 0 ) {
						lastMatchDate.invalidMessage = m.getLocalization("LastMatchDateGreaterThanShipmentDateError",[
	                                lastMatchDate.get("displayedValue"),lastShipDate.get("displayedValue")]);
						return false;
					}
				}	
			
			if(lastMatchDate && lastMatchDate.get("value") !== null && maxBpoExpiryDate && maxBpoExpiryDate !== ""){
				if(d.date.compare(lastMatchDate.get("value"), maxBpoExpiryDate) > 0 ) {
					this.invalidMessage = m.getLocalization("LastMatchDateGreaterThanBPOExpiryDateError",[
					                 lastMatchDate.get("displayedValue"),dojo.date.locale.format(maxBpoExpiryDate,{locale:dojo.config.locale, formatLength:"short", selector:"date" })]);
					return false;
				}
			}
			
			var expDate = dj.byId("exp_date");
			if(lastMatchDate && lastMatchDate.get("value")!== null && expDate &&  expDate.get("value")!== null) {
				if(d.date.compare(lastMatchDate.get("value"), m.localizeDate(expDate)) > 0 ) {
					this.invalidMessage = m.getLocalization("lastMatchDateGreaterThanExpiryDateError",[
					                 lastMatchDate.get("displayedValue"),expDate.get("displayedValue")]);
					return false;
				}	
			}
			
			var issDate = dj.byId("iss_date");
			if(lastMatchDate && lastMatchDate.get("value")!== null && issDate &&  issDate.get("value")!== null) {
				if(d.date.compare(lastMatchDate.get("value"), m.localizeDate(issDate)) < 0 ) {
					this.invalidMessage = m.getLocalization("lastMatchDateLessThanIssueDateError",[
					                  lastMatchDate.get("displayedValue"),issDate.get("displayedValue")]);
					return false;
				}	
			}
			
			var applDate = dj.byId("appl_date");
			if(lastMatchDate && lastMatchDate.get("value")!== null && applDate &&  applDate.get("value")!== null) {
				if(d.date.compare(lastMatchDate.get("value"), m.localizeDate(applDate)) < 0 ) {
					this.invalidMessage = m.getLocalization("lastMatchDateLessThanApplicationDateError",[ 
					                 lastMatchDate.get("displayedValue"),applDate.get("displayedValue")]);
					return false;
				}	
			}
			return true;
		
		},
		
	
		
		
		/**
		 * <h4>Summary:</h4>
		 * This method is used to validate the Open account expiry date with various date fields for the Open Account transactions.
		 */
		validateOpenAccountExpiryDate : function() {
			if(dj.byId("close_tnx") && (dj.byId("close_tnx").get("checked") !== true))
			{
				var expDate = dj.byId("exp_date");
			if(expDate && !expDate.get("value")) {
					var currDate = new Date();
		    		currDate.setHours(0, 0, 0, 0);
		    		var maxBpoExpiryDate= m.getMaxBPOExpiryDate();
		    		if(d.date.compare(maxBpoExpiryDate ,currDate) >0 ) {
		    			this.invalidMessage = m.getLocalization("expiryDateEmptyBpoExpiryExistsError",[
	   	                    dojo.date.locale.format(maxBpoExpiryDate,{locale:dojo.config.locale, formatLength:"short", selector:"date" })]);
		    			return false;
		    		}
					return true;
				}
				
				// Test that the expiry date is greater than or
				// equal to the issue date
				var issueDate = dj.byId("iss_date");
			if (issueDate && issueDate.get("value"))
			{
				if (d.date.compare(expDate.get("value"), m.localizeDate(issueDate)) <= 0)
				{
					expDate.invalidMessage = m.getLocalization(
							"issDateSmallerThanFutureDate", [
									expDate.get("displayedValue"),
									issueDate.get("displayedValue") ]);
					return false;
				}
			}

			// Test that the expiry date is greater than the
			// application date
			var applDate = dj.byId("appl_date");
			if (applDate)
			{
				if (d.date.compare(expDate.get("value"), m.localizeDate(applDate)) <= 0)
				{
					this.invalidMessage = m.getLocalization(
							"futureDateSmallerThanAppDate", [
									expDate.get("displayedValue"),
									applDate.get("displayedValue") ]);
					return false;
				}
			}
			// Test that the exp date is greater than or equal to the 
			// max BPO expiry date.
			if(dj.byId("product_code") && ((dj.byId("product_code").get("value") === "IO") || (dj.byId("product_code").get("value") === "EA"))) {
				var maxBPOExpiryDate = m.getMaxBPOExpiryDate();
				if(expDate.get("value") !== null && maxBPOExpiryDate !== "") {
					if(d.date.compare(expDate.get("value"), maxBPOExpiryDate) < 0 ) {
						expDate.invalidMessage = m.getLocalization("expiryDateLessThanBpoExpiryDateError",[
	                                expDate.get("displayedValue"),
	                                dojo.date.locale.format(maxBPOExpiryDate,{locale:dojo.config.locale, formatLength:"short", selector:"date" })]);
						return false;
					}	
				}
			}
			//validate against the latest shipment date : should be greater than latest shipment date
			var lastShipDate = dj.byId("last_ship_date");
			if(expDate.get("value") !== null && lastShipDate && lastShipDate.get("value") !== null) {
				if(d.date.compare(expDate.get("value"), lastShipDate.get("value")) < 0 ) {
					expDate.invalidMessage = m.getLocalization("expiryDateLessThanLastShipDateError",[
                               	expDate.get("displayedValue"),
                               	lastShipDate.get("displayedValue")]);
					return false;
				}
			}
			//validate against the latest match date : should be greater than latest match date
			var lastMatchDate = dj.byId("last_match_date");
			if(expDate.get("value") !== null && lastMatchDate && lastMatchDate.get("value") !== null) {
				if(d.date.compare(expDate.get("value"), lastMatchDate.get("value")) < 0 ) {
					expDate.invalidMessage = m.getLocalization("expiryDateLessThanLastMatchDateError",[
                            	expDate.get("displayedValue"),
                            	lastMatchDate.get("displayedValue")]);
					return false;
				}
			}
			
			// validate against the earliest shipment date : should be greater than the earliest shipment date
			var earliestShipDate = dj.byId("earliest_ship_date");
			if(expDate.get("value") !== null && earliestShipDate && earliestShipDate.get("value") !== null) {
				if(d.date.compare(expDate.get("value"), earliestShipDate.get("value")) < 0 ) {
					expDate.invalidMessage = m.getLocalization("expiryDateLessThanEarliestShipDateError",[
								expDate.get("displayedValue"),
								earliestShipDate.get("displayedValue")]);
					return false;
				}
			}
			
			// Validate against the greatest of latest shipment date and schedule latest ship date
			var lineItemLastShipDate = m.getMaxLineItemLatestShipmentDate();
			var shipmentLatestShipDate = m.getMaxShipemntSubScheduleLatestShipmentDate();
			if(d.date.compare(shipmentLatestShipDate, lineItemLastShipDate) < 0 ) {
				// validate against the max line item last shipment date
				if(expDate.get("value") !== null && lineItemLastShipDate !== "") {
					if(d.date.compare(expDate.get("value"), lineItemLastShipDate) < 0 ) {
						expDate.invalidMessage = m.getLocalization("expiryDateLessThanLastShipDateError",[
	                                expDate.get("displayedValue"),
	                                dojo.date.locale.format(lineItemLastShipDate,{locale:dojo.config.locale, formatLength:"short", selector:"date" })]);
						return false;
					}	
				}
			}
			else{
				// Validate against the Shipment sub schdeules latest shipment date
				if(expDate.get("value") !== null && shipmentLatestShipDate !== "") {
					if(d.date.compare(expDate.get("value"), shipmentLatestShipDate) < 0 ) {
						expDate.invalidMessage = m.getLocalization("expiryDateLessThanLastShipDateError",[
	                                expDate.get("displayedValue"),
	                                dojo.date.locale.format(shipmentLatestShipDate,{locale:dojo.config.locale, formatLength:"short", selector:"date" })]);
						return false;
					}	
				}
			}
			
			
			// Validate against the least of earliest shipment date and schedule earliest ship date
			var lineItemEarliestShipDate = m.getLeastLineItemEarliestShipmentDate();
			var shipmentEarliestShipDate = m.getLeastShipmentSubScheduleEarliestShipmentDate();
			var leastDate = "";
			//If both least dates are available, compare the two and get the least, else set the available one as the least.
			if(lineItemEarliestShipDate !== "" && shipmentEarliestShipDate !== "" && d.date.compare(lineItemEarliestShipDate, shipmentEarliestShipDate) < 0){
				leastDate = lineItemEarliestShipDate;
			}else if(lineItemEarliestShipDate !== "" && shipmentEarliestShipDate !== "" && d.date.compare(shipmentEarliestShipDate, lineItemEarliestShipDate) < 0) {
				leastDate = lineItemEarliestShipDate;
			}else if(lineItemEarliestShipDate !== ""){
				leastDate = lineItemEarliestShipDate;
			}else if(shipmentEarliestShipDate !== ""){
				leastDate = shipmentEarliestShipDate;
			}
				
			if(expDate.get("value") !== null && leastDate !== "") {
				if(d.date.compare(expDate.get("value"), leastDate) < 0 ) {
					expDate.invalidMessage = m.getLocalization("expiryDateLessThanEarliestShipDateError",[
                                expDate.get("displayedValue"),
                                dojo.date.locale.format(leastDate,{locale:dojo.config.locale, formatLength:"short", selector:"date" })]);
					return false;
				}	
			}
			}
			
			return true;
		},
		
		/**
		 * <h4>Summary:</h4>
		 * This method is used to validate the BPO expiry date with various date fields for the Open Account transactions.
		 */
		validateBPOExpiryDate : function() {
			var expDate = dj.byId("payment_expiry_date");

			//Do not validate for Close event
			if((dj.byId("tnxtype") && (dj.byId("tnxtype").get("value") === "38")) || 
			    	(dj.byId("close_tnx") && (dj.byId("close_tnx").get("checked") === true)))
			{
				  return true;
			}
			// Test that the BPO expiry date is greater than or
			// equal to the issue date
			var issueDate = dj.byId("iss_date");
			if (issueDate && issueDate.get("value"))
			{
				if (d.date.compare(expDate.get("value"), m.localizeDate(issueDate)) <= 0)
				{
					expDate.invalidMessage = m.getLocalization(
							"issDateSmallerThanFutureDate", [
									expDate.get("displayedValue"),
									issueDate.get("displayedValue") ]);
					return false;
				}
			}

			// Test that the BPO expiry date is greater than the
			// application date
			var applDate = dj.byId("appl_date");
			if (applDate)
			{
				if (d.date.compare(expDate.get("value"), m.localizeDate(applDate)) <= 0)
				{
					this.invalidMessage = m.getLocalization(
							"futureDateSmallerThanAppDate", [
									expDate.get("displayedValue"),
									applDate.get("displayedValue") ]);
					return false;
				}
			}

			//validate against the latest shipment date : should be greater than latest shipment date
			var lastShipDate = dj.byId("last_ship_date");
			if(expDate.get("value") !== null && lastShipDate && lastShipDate.get("value") !== null) {
				if(d.date.compare(expDate.get("value"), lastShipDate.get("value")) < 0 ) {
					expDate.invalidMessage = m.getLocalization("bpoExpiryDateLessThanLastShipDateError",[
                               	expDate.get("displayedValue"),
                               	lastShipDate.get("displayedValue")]);
					return false;
				}
			}
			//validate against the latest match date : should be greater than latest match date
			var lastMatchDate = dj.byId("last_match_date");
			if(expDate.get("value") !== null && lastMatchDate && lastMatchDate.get("value") !== null) {
				if(d.date.compare(expDate.get("value"), lastMatchDate.get("value")) < 0 ) {
					expDate.invalidMessage = m.getLocalization("bpoExpiryDateLessThanLastMatchDateError",[
                            	expDate.get("displayedValue"),
                            	lastMatchDate.get("displayedValue")]);
					return false;
				}
			}
			
			// validate against the earliest shipment date : should be greater than the earliest shipment date
			var earliestShipDate = dj.byId("earliest_ship_date");
			if(expDate.get("value") !== null && earliestShipDate && earliestShipDate.get("value") !== null) {
				if(d.date.compare(expDate.get("value"), earliestShipDate.get("value")) < 0 ) {
					expDate.invalidMessage = m.getLocalization("bpoExpiryDateLessThanEarliestShipDateError",[
								expDate.get("displayedValue"),
								earliestShipDate.get("displayedValue")]);
					return false;
				}
			}
			
			// Validate against the greatest of latest shipment date and schedule latest ship date
			var lineItemLastShipDate = m.getMaxLineItemLatestShipmentDate();
			var shipmentLatestShipDate = m.getMaxShipemntSubScheduleLatestShipmentDate();
			if(d.date.compare(shipmentLatestShipDate, lineItemLastShipDate) < 0 ) {
				// validate against the max line item last shipment date
				if(expDate.get("value") !== null && lineItemLastShipDate !== "") {
					if(d.date.compare(expDate.get("value"), lineItemLastShipDate) < 0 ) {
						expDate.invalidMessage = m.getLocalization("bpoExpiryDateLessThanLastShipDateError",[
	                                expDate.get("displayedValue"),
	                                dojo.date.locale.format(lineItemLastShipDate,{locale:dojo.config.locale, formatLength:"short", selector:"date" })]);
						return false;
					}	
				}
			}
			else{
				// Validate against the Shipment sub schdeules latest shipment date
				if(expDate.get("value") !== null && shipmentLatestShipDate !== "") {
					if(d.date.compare(expDate.get("value"), shipmentLatestShipDate) < 0 ) {
						expDate.invalidMessage = m.getLocalization("bpoExpiryDateLessThanLastShipDateError",[
	                                expDate.get("displayedValue"),
	                                dojo.date.locale.format(shipmentLatestShipDate,{locale:dojo.config.locale, formatLength:"short", selector:"date" })]);
						return false;
					}	
				}
			}
			
			// Validate against the least of earliest shipment date and schedule earliest ship date
			var lineItemEarliestShipDate = m.getLeastLineItemEarliestShipmentDate();
			var shipmentEarliestShipDate = m.getLeastShipmentSubScheduleEarliestShipmentDate();
			var leastDate = "";
			//If both least dates are available, compare the two and get the least, else set the available one as the least.
			if(lineItemEarliestShipDate !== "" && shipmentEarliestShipDate !== "" && d.date.compare(lineItemEarliestShipDate, shipmentEarliestShipDate) < 0){
				leastDate = lineItemEarliestShipDate;
			}else if(lineItemEarliestShipDate !== "" && shipmentEarliestShipDate !== "" && d.date.compare(shipmentEarliestShipDate, lineItemEarliestShipDate) < 0) {
				leastDate = lineItemEarliestShipDate;
			}else if(lineItemEarliestShipDate !== ""){
				leastDate = lineItemEarliestShipDate;
			}else if(shipmentEarliestShipDate !== ""){
				leastDate = shipmentEarliestShipDate;
			}
				
			if(expDate.get("value") !== null && leastDate !== "") {
				if(d.date.compare(expDate.get("value"), leastDate) < 0 ) {
					expDate.invalidMessage = m.getLocalization("bpoExpiryDateLessThanEarliestShipDateError",[
                                expDate.get("displayedValue"),
                                dojo.date.locale.format(leastDate,{locale:dojo.config.locale, formatLength:"short", selector:"date" })]);
					return false;
				}	
			}
			
			
			return true;
		},

		/**
		 * <h4>Summary:</h4>
		 * This method is used to toggle the shipment details section under the Line items when partial shipment is not allowed.
		 */
		toggleShipmentDetails : function() {
			
			var gridLineAirRoutingSummary = dj.byId("line_item_air_routing_summaries");
			var gridLineSeaRoutingSummary = dj.byId("line_item_sea_routing_summaries");
			var gridLineRoadRoutingSummary = dj.byId("line_item_road_routing_summaries");
			var gridLineRailRoutingSummary = dj.byId("line_item_rail_routing_summaries");
			// disable the line item shipment details when partial shipment is not allowed.
			if(dj.byId("part_ship_2") && dj.byId("part_ship_2").get("checked") === true ) {
				if(dj.byId("line_item_earliest_ship_date") && dj.byId("line_item_last_ship_date") && dj.byId("dijit_form_Button_8")) {
					dj.byId("line_item_last_ship_date").set("disabled",true);
					dj.byId("line_item_earliest_ship_date").set("disabled",true);
					dj.byId("line_item_last_ship_date").set("value",null);
					dj.byId("line_item_earliest_ship_date").set("value",null);
					//shipment sub schedule button
					dj.byId("dijit_form_Button_8").set("disabled", true);
					//Incoterm buttton
					if(dj.byId("dijit_form_Button_7")) {
						dj.byId("dijit_form_Button_7").set("disabled", true);
					}
				}
					//Routing Summary
					if(gridLineAirRoutingSummary && gridLineSeaRoutingSummary && gridLineRoadRoutingSummary && gridLineRailRoutingSummary){
						gridLineAirRoutingSummary.addButtonNode.set("disabled",true);
						gridLineSeaRoutingSummary.addButtonNode.set("disabled",true);
						gridLineRoadRoutingSummary.addButtonNode.set("disabled",true);
						gridLineRailRoutingSummary.addButtonNode.set("disabled",true);
					}
						
					if(dj.byId("dijit_form_Button_6")){
						dj.byId("dijit_form_Button_6").set("disabled", true);
					}
					if(dj.byId("dijit_form_Button_5")){
						dj.byId("dijit_form_Button_5").set("disabled", true);
					}
					if(dj.byId("dijit_form_Button_4")){
						dj.byId("dijit_form_Button_4").set("disabled", true);
					}
					if(dj.byId("line_item_taking_in_charge") && dj.byId("line_item_final_dest_place")) {
						dj.byId("line_item_taking_in_charge")?dj.byId("line_item_taking_in_charge").set("disabled",true):"";
						dj.byId("line_item_final_dest_place")?dj.byId("line_item_final_dest_place").set("disabled",true):"";
					}
					
				
			}
			// disable line item shipment details when earliest shipment date or latest shipment date on IO form is present
			else if(dj.byId("part_ship_2") && dj.byId("part_ship_2").get("checked") !== true && ((dj.byId("last_ship_date") && dj.byId("last_ship_date").get("value")!== null) || (dj.byId("earliest_ship_date") && dj.byId("earliest_ship_date").get("value")!== null))) {
				if(dj.byId("line_item_earliest_ship_date") && dj.byId("line_item_last_ship_date") && dj.byId("dijit_form_Button_8")) {
					dj.byId("line_item_last_ship_date").set("disabled",true);
					dj.byId("line_item_earliest_ship_date").set("disabled",true);
					dj.byId("line_item_last_ship_date").set("value",null);
					dj.byId("line_item_earliest_ship_date").set("value",null);
					//shipment sub schedule button
					dj.byId("dijit_form_Button_8").set("disabled", true);
					//Incoterm buttton
					if(dj.byId("dijit_form_Button_7")) {
						dj.byId("dijit_form_Button_7").set("disabled", true);
					}
				}
			}
			// enable line item shipment schedule when earliest ship date and latest shipment dates are both empty
			else if(dj.byId("part_ship_2") && dj.byId("part_ship_2").get("checked") !== true && (dj.byId("last_ship_date") && dj.byId("last_ship_date").get("value")=== null) && (dj.byId("earliest_ship_date") && dj.byId("earliest_ship_date").get("value")=== null)) {
				// Disable shipment dates if shipment sub schedule exists
				if(dj.byId("line_item_shipment_schedules") && dj.byId("line_item_shipment_schedules").store && dj.byId("line_item_shipment_schedules").store._arrayOfTopLevelItems.length > 0) {
					dj.byId("line_item_last_ship_date")? dj.byId("line_item_last_ship_date").set("disabled",true):"";
					dj.byId("line_item_earliest_ship_date")? dj.byId("line_item_earliest_ship_date").set("disabled",true):"";
				}
				else if((dj.byId("line_item_last_ship_date") && dj.byId("line_item_last_ship_date").get("value")!== null) || (dj.byId("line_item_earliest_ship_date") && dj.byId("line_item_earliest_ship_date").get("value")!== null)){
					//shipment sub schedule button
					dj.byId("dijit_form_Button_8")?dj.byId("dijit_form_Button_8").set("disabled", true):"";
				}
				else {
					dj.byId("line_item_last_ship_date")? dj.byId("line_item_last_ship_date").set("disabled",false):"";
					dj.byId("line_item_earliest_ship_date")? dj.byId("line_item_earliest_ship_date").set("disabled",false):"";
					//shipment sub schedule button
					dj.byId("dijit_form_Button_8")?dj.byId("dijit_form_Button_8").set("disabled", false):"";
				}
				//Incoterm buttton
				dj.byId("dijit_form_Button_7")?dj.byId("dijit_form_Button_7").set("disabled", false):"";
				dj.byId("dijit_form_Button_9")?dj.byId("dijit_form_Button_9").set("disabled", false):"";
				dj.byId("dijit_form_Button_10")?dj.byId("dijit_form_Button_10").set("disabled", false):"";
				dj.byId("dijit_form_Button_11")?dj.byId("dijit_form_Button_11").set("disabled", false):"";
				dj.byId("dijit_form_Button_12")?dj.byId("dijit_form_Button_12").set("disabled", false):"";
				dj.byId("dijit_form_Button_6")?dj.byId("dijit_form_Button_6").set("disabled", false):"";
				dj.byId("dijit_form_Button_5")?dj.byId("dijit_form_Button_5").set("disabled", false):"";
				dj.byId("dijit_form_Button_4")?dj.byId("dijit_form_Button_4").set("disabled", false):"";
			}
		},
		
		/**
		 * <h4>Summary:</h4>
		 * This method is used to toggle the Multimodal transport details section under the Line items when partial shipment is not allowed.
		 */
		toggleMultimodalTransportDetails : function() {
			// Disable multimodal transport when trans shipment is not allowed
			var gridLineAirRoutingSummary = dj.byId("line_item_air_routing_summaries");
			var gridLineSeaRoutingSummary = dj.byId("line_item_sea_routing_summaries");
			var gridLineRoadRoutingSummary = dj.byId("line_item_road_routing_summaries");
			var gridLineRailRoutingSummary = dj.byId("line_item_rail_routing_summaries");

			// Disable multimodal transport when trans shipment is not allowed
			if(dj.byId("tran_ship_2") && dj.byId("tran_ship_2").get("checked") === true && dj.byId("line_item_taking_in_charge") && dj.byId("line_item_final_dest_place")) {
				dj.byId("line_item_taking_in_charge").set("value","");
				dj.byId("line_item_final_dest_place").set("value","");
				dj.byId("line_item_taking_in_charge").set("disabled",true);
				dj.byId("line_item_final_dest_place").set("disabled",true);
				dj.byId("line_item_taking_in_charge").set("disabled",true);
				dj.byId("line_item_final_dest_place").set("disabled",true);
				if(gridLineAirRoutingSummary && gridLineAirRoutingSummary.store && gridLineAirRoutingSummary.store._arrayOfTopLevelItems.length > 0)
					{
						
						gridLineSeaRoutingSummary.clear();
						gridLineRoadRoutingSummary.clear();
						gridLineRailRoutingSummary.clear();
						gridLineAirRoutingSummary.addButtonNode.set("disabled",true);
						gridLineSeaRoutingSummary.addButtonNode.set("disabled",true);
						gridLineRoadRoutingSummary.addButtonNode.set("disabled",true);
						gridLineRailRoutingSummary.addButtonNode.set("disabled",true);
					}
				if(gridLineSeaRoutingSummary && gridLineSeaRoutingSummary.store && gridLineSeaRoutingSummary.store._arrayOfTopLevelItems.length > 0)
					{
						gridLineAirRoutingSummary.clear();
						gridLineRoadRoutingSummary.clear();
						gridLineRailRoutingSummary.clear();
						gridLineAirRoutingSummary.addButtonNode.set("disabled",true);
						gridLineSeaRoutingSummary.addButtonNode.set("disabled",true);
						gridLineRoadRoutingSummary.addButtonNode.set("disabled",true);
						gridLineRailRoutingSummary.addButtonNode.set("disabled",true);
					}
				if(gridLineRoadRoutingSummary && gridLineRoadRoutingSummary.store && gridLineRoadRoutingSummary.store._arrayOfTopLevelItems.length > 0 )
					{
					gridLineAirRoutingSummary.clear();
					gridLineSeaRoutingSummary.clear();
					gridLineRailRoutingSummary.clear();
					gridLineAirRoutingSummary.addButtonNode.set("disabled",true);
					gridLineSeaRoutingSummary.addButtonNode.set("disabled",true);
					gridLineRoadRoutingSummary.addButtonNode.set("disabled",true);
					gridLineRailRoutingSummary.addButtonNode.set("disabled",true);
					}
				if(gridLineRailRoutingSummary && gridLineRailRoutingSummary.store && gridLineRailRoutingSummary.store._arrayOfTopLevelItems.length > 0)
					{
						gridLineAirRoutingSummary.clear();
						gridLineSeaRoutingSummary.clear();
						gridLineRoadRoutingSummary.clear();
						gridLineAirRoutingSummary.addButtonNode.set("disabled",true);
						gridLineSeaRoutingSummary.addButtonNode.set("disabled",true);
						gridLineRoadRoutingSummary.addButtonNode.set("disabled",true);
						gridLineRailRoutingSummary.addButtonNode.set("disabled",true);
					
					}
			}
			else if (dj.byId("part_ship_2") && dj.byId("part_ship_2").get("checked") === true && dj.byId("line_item_final_dest_place") && dj.byId("line_item_taking_in_charge")){
				dj.byId("line_item_taking_in_charge").set("disabled",true);
				dj.byId("line_item_final_dest_place").set("disabled",true);
			}
			else if (dj.byId("line_item_final_dest_place") && dj.byId("line_item_taking_in_charge")){
				dj.byId("line_item_taking_in_charge").set("disabled",false);
				dj.byId("line_item_final_dest_place").set("disabled",false);
			}
				
		},
		
		/**
		 * <h4>Summary:</h4>
		 * This method is used to fetch the max Line item last shipment date.
		 */
		getMaxLineItemLatestShipmentDate : function() {
			var lineItems = dj.byId("line-items");
			var maxLastShipDate = new Date();
			maxLastShipDate.setHours(0, 0, 0, 0);
			if(lineItems && lineItems.store && lineItems.store._arrayOfTopLevelItems.length > 0) {
				lineItems.store.fetch({
					query:{store_id:"*"},
					onComplete: dojo.hitch(lineItems, function(items, request){
						dojo.forEach(items, function(item){
							if(item.last_ship_date[0] !== "")
							{
								var lastShipDate = dojo.date.locale.parse(item.last_ship_date[0],{locale:dojo.config.locale, formatLength:"short", selector:"date" });
								if(maxLastShipDate < lastShipDate) {
									maxLastShipDate = lastShipDate;
								}
							}
						});
					})
				});
			}
			return maxLastShipDate;
		},
		
		/**
		 * <h4>Summary:</h4>
		 * This method is used to fetch the max Line item Shipment sub schedule last shipment date.
		 */
		getMaxShipemntSubScheduleLatestShipmentDate : function() {
			var lineItems = dj.byId("line-items");
			var maxLastShipDate = new Date();
			maxLastShipDate.setHours(0, 0, 0, 0);
			if(lineItems && lineItems.store && lineItems.store._arrayOfTopLevelItems.length > 0) {
				lineItems.store.fetch({
					query:{store_id:"*"},
					onComplete: dojo.hitch(lineItems, function(items, request){
						dojo.forEach(items, function(item){
							if(item.shipment_schedules[0]._values.length > 0)
							{
								for(var i=0;i<item.shipment_schedules[0]._values.length ;i++) {
									var scheduleLastShipDate = dojo.date.locale.parse(item.shipment_schedules[0]._values[i].schedule_latest_ship_date,{locale:dojo.config.locale, formatLength:"short", selector:"date" });
									if(maxLastShipDate < scheduleLastShipDate) {
										maxLastShipDate = scheduleLastShipDate;
									}
								}
							}
						});
					})
				});
			}
			return maxLastShipDate;			
		},
		
		/**
		 * <h4>Summary:</h4>
		 * This method is used to fetch the least Line item ealiest shipment date.
		 */
		getLeastLineItemEarliestShipmentDate : function() {
			var lineItems = dj.byId("line-items");
			var leastEarliestShipDate = "";
			
			if(lineItems && lineItems.store && lineItems.store._arrayOfTopLevelItems.length > 0) {
				lineItems.store.fetch({
					query:{store_id:"*"},
					onComplete: dojo.hitch(lineItems, function(items, request){
						dojo.forEach(items, function(item){
							if(item.earliest_ship_date[0] !== "")
							{
								var earliestShipDate = dojo.date.locale.parse(item.earliest_ship_date[0],{locale:dojo.config.locale, formatLength:"short", selector:"date" });
								if(leastEarliestShipDate == ""){
									leastEarliestShipDate = earliestShipDate;
								}
								else if(earliestShipDate < leastEarliestShipDate) {
									leastEarliestShipDate = earliestShipDate;
								}
							}
						});
					})
				});
			}
			return leastEarliestShipDate;
		},
		
		/**
		 * <h4>Summary:</h4>
		 * This method is used to fetch the least Line item Shipment sub schedule earliest shipment date.
		 */
		getLeastShipmentSubScheduleEarliestShipmentDate : function() {
			var lineItems = dj.byId("line-items");
			var leastEarliestShipDate = "";
			
			if(lineItems && lineItems.store && lineItems.store._arrayOfTopLevelItems.length > 0) {
				lineItems.store.fetch({
					query:{store_id:"*"},
					onComplete: dojo.hitch(lineItems, function(items, request){
						dojo.forEach(items, function(item){
							if(item.shipment_schedules[0]._values.length > 0)
							{
								for(var i=0;i<item.shipment_schedules[0]._values.length ;i++) {
									var scheduleEarliestShipDate = dojo.date.locale.parse(item.shipment_schedules[0]._values[i].schedule_earliest_ship_date,{locale:dojo.config.locale, formatLength:"short", selector:"date" });
									if(leastEarliestShipDate == ""){
										leastEarliestShipDate = scheduleEarliestShipDate;
									}
									else if(scheduleEarliestShipDate < leastEarliestShipDate) {
										leastEarliestShipDate = scheduleEarliestShipDate;
									}
								}
							}
						});
					})
				});
			}
			return leastEarliestShipDate;			
		},
		
		/**
		 * <h4>Summary:</h4>
		 * This method is used to check if any Line item has shipment period defined.
		 */
		hasLineItemShipmentPeriodDefined : function() {
			var lineItems = dj.byId("line-items");
			var shipFlag = false;
			if(lineItems && lineItems.store && lineItems.store._arrayOfTopLevelItems.length > 0) {
				lineItems.store.fetch({
					query:{store_id:"*"},
					onComplete: dojo.hitch(lineItems, function(items, request){
						dojo.forEach(items, function(item){
							if((item && item.last_ship_date && item.last_ship_date[0] !== "") || (item && item.earliest_ship_date && item.earliest_ship_date[0] !== ""))
							{
								shipFlag= true;
							}
							else if(item && item.shipment_schedules && item.shipment_schedules[0]._values.length > 0)
							{
								for(var i=0;i<item.shipment_schedules[0]._values.length ;i++) {
									if(item.shipment_schedules[0]._values[i].schedule_latest_ship_date !== "" || item.shipment_schedules[0]._values[i].schedule_earliest_ship_date !== "" || item.shipment_schedules[0]._values[i].sub_shipment_quantity_value !=="") {
										shipFlag=  true;
									}
								}
							}
						});
					})
				});
			}
			return shipFlag;
		},
		
		hasLastShipmentInAllLineItems : function(){
			var ctr=0;
			
			var lineItems = dj.byId("line-items");
			
			if(lineItems){
			if(lineItems && lineItems.store && lineItems.store._arrayOfTopLevelItems.length > 0) {
				lineItems.store.fetch({
					query:{store_id:"*"},
					onComplete: dojo.hitch(lineItems, function(items, request){
						dojo.forEach(items, function(item){
							if(item.last_ship_date[0] !== "" || item.earliest_ship_date[0] !== "")
							{
								ctr++;
							}
							else if(item.shipment_schedules[0]._values.length > 0)
							{
								for(var i=0;i<item.shipment_schedules[0]._values.length ;i++) {
									if(item.shipment_schedules[0]._values[i].schedule_latest_ship_date !== "" || item.shipment_schedules[0]._values[i].schedule_earliest_ship_date !== "" || item.shipment_schedules[0]._values[i].sub_shipment_quantity_value !=="") {
										shipFlag=  true;
									}
								} ctr++;
							}
						});
					})
				});
			}
			
			
			if(ctr ==lineItems.store._arrayOfTopLevelItems.length || ctr ==0){
				return false;
			}
			}
			return true;
			
		},
		
		
		hasIncotermsInAllLineItems : function(){
			var ctr=0;
			
			var lineItems = dj.byId("line-items");
			if(lineItems){
			if(lineItems && lineItems.store && lineItems.store._arrayOfTopLevelItems.length > 0) {
				lineItems.store.fetch({
					query:{store_id:"*"},
					onComplete: dojo.hitch(lineItems, function(items, request){
						dojo.forEach(items, function(item){
							
							 if(item.incoterms[0]._values.length > 0)
							{
								 ctr++;
							}
						});
					})
				});
			}
			
			if(lineItems.store && (ctr==lineItems.store._arrayOfTopLevelItems.length || ctr==0)){
				return false;
			}
			}
			
			return true;
			
		},
		
		hasRoutingSummaryInAllLineItems : function(){
			var ctr=0;
			
			var lineItems = dj.byId("line-items");
			if(lineItems){
			if(lineItems && lineItems.store && lineItems.store._arrayOfTopLevelItems.length > 0) {
				lineItems.store.fetch({
					query:{store_id:"*"},
					onComplete: dojo.hitch(lineItems, function(items, request){
						dojo.forEach(items, function(item){
							
							if((item.air_routing_summaries && item.air_routing_summaries[0]._values.length > 0) || (item.sea_routing_summaries && item.sea_routing_summaries[0]._values.length > 0) || 
									(item.road_routing_summaries && item.road_routing_summaries[0]._values.length > 0) || (item.rail_routing_summaries && item.rail_routing_summaries[0]._values.length > 0) || 
									item.final_dest_place[0].length > 0 || item.taking_in_charge[0].length > 0  )
							{
								 ctr++;
							}
						});
					})
				});
			}
			
			if(ctr==lineItems.store._arrayOfTopLevelItems.length || ctr==0){
				return false;
			}
			}
			return true;
			
		},
		
		validateCreditorAccountIdType : function(){
			if(dj.byId("seller_account_iban")&&dj.byId("seller_account_bban")&&dj.byId("seller_account_upic")&&dj.byId("seller_account_id")){
				if((dj.byId("seller_account_iban").get("value")==="")&&(dj.byId("seller_account_bban").get("value")==="")&&(dj.byId("seller_account_upic").get("value")==="")&&(dj.byId("seller_account_id").get("value")===""))
					{
					 return false;
					}
				}
			return true;
			
			
		},
		
		/**
		 * <h4>Summary:</h4>
		 * This method checks the resubmission count and throws a warning if the count exceeds.
		 */
		validateResubmissionCount : function(){
			
			misys._config.warningMessages = [];
			
			if(dj.byId("tnxtype") && dj.byId("tnxtype").get("value") !== "38")
			{			
				if(dj.byId("allowed_resubmission_count") && dj.byId("resubmission_count"))
				{
					var allowedVal = parseInt(dj.byId("allowed_resubmission_count").get("value"),10);
					if(parseInt(dj.byId("resubmission_count").get("value"),10) == allowedVal)
					{
						misys._config.warningMessages = [];
						misys._config.warningMessages.push(m.getLocalization('lastresubmissionCountWarning',[allowedVal]));
					}
					else if(parseInt(dj.byId("resubmission_count").get("value"),10) > allowedVal)
					{
						misys._config.warningMessages = [];
						misys._config.warningMessages.push(m.getLocalization('resubmissionCountExceededWarning',[allowedVal]));
					}
				}
			}
			
			return true;
			
		},
		
				 
		/**
		 * <h4>Summary:</h4>
		 * This method clears the expiry date of all the BPO's on the screen.
		 */
		clearBpoExpiryDateOnLoad : function(){
			var bpo = dj.byId("bank-payment-obligations");
			
			if(bpo && bpo.store && bpo.store._arrayOfTopLevelItems.length > 0) {
				bpo.store.fetch({
					query:{store_id:"*"},
					onComplete: dojo.hitch(bpo, function(items, request){
						dojo.forEach(items, function(item){
							if(item.payment_expiry_date[0] !== "")
							{
								item.payment_expiry_date[0] = "";
							}
						});
					})
				});
			}
		},
		
		/**
		 * <h4>Summary:</h4>
		 * This function validates the data entered as the Last shipment date
		 * @method validateOALastShipmentDate
		 * <h4>Description:</h4> 
		 * </br>Last shipment date should be greater than the application date
		 * </br>Last shipment date should be  less than the expiry date
		 * </br>Last shipment date should be less than the Amend date 
		 * </br>Last shipment date should be less than due date
		 * </br>Last shipment date should be greater than the earliest shipment date
		 * @method validateOALastShipmentDate
		 * @return {booelan} 
		 *  True if valid otherwise false.
		 */
		validateOALastShipmentDate : function() {
			//  summary:
		    //        Validates the data entered as the Last Shipment Date.
			// 
			// TODO Add business logic explanation
			
			//Do not validate for Close event
			if((dj.byId("tnxtype") && (dj.byId("tnxtype").get("value") === "38")) || 
			    	(dj.byId("close_tnx") && (dj.byId("close_tnx").get("checked") === true)))
			{
				  return true;
			}
			
			// Return true for empty values
			if(!this.get("value")){
				return true;
			}
			
			console.debug("[misys.openaccount.FormOpenAccountEvents] Validating Last Ship Date. Value = ", 
					this.get("value"));
			
			// Test that the last shipment date is greater than or equal to
			// the application date
			var applDate = dj.byId("appl_date");
			if(!m.compareDateFields(applDate, this)) {
				this.invalidMessage = m.getLocalization("lastShipmentDateLessThanAppDateError",[
								_localizeDisplayDate(this),
								_localizeDisplayDate(applDate)]);
				return false;
			}
			
			// Test that the Latest Ship Date is greater than or
			// equal to the issue date
			var issueDate = dj.byId("iss_date");
			if (issueDate && issueDate.get("value"))
			{
				if (d.date.compare(this.get("value"), m.localizeDate(issueDate)) < 0)
				{
					this.invalidMessage = m.getLocalization(
							"issDateSmallerThanLatestShipDate", [
									_localizeDisplayDate(this),
									_localizeDisplayDate(issueDate) ]);
					return false;
				}
			}
			
			// Test that the last shipment date is less than or equal to the 
			// max BPO expiry date, if present
			// Else test that the last shipment date is less than or equal to the 
			// expiry date.
			var expDate = dj.byId("exp_date");
			
				var maxBpoExpiryDate = m.getMaxBPOExpiryDate();
				if(this.get("value") !== "" && maxBpoExpiryDate && maxBpoExpiryDate !== "") {
					if(d.date.compare(this.get("value"), maxBpoExpiryDate) > 0 ) {
						this.invalidMessage = m.getLocalization("lastShipmentDateGreaterThanBpoExpiryDateError",[
	                                _localizeDisplayDate(this),
	                                dojo.date.locale.format(maxBpoExpiryDate,{locale:dojo.config.locale, formatLength:"short", selector:"date" })]);
						return false;
					}	
				}
			
			if(expDate && !m.compareDateFields(this, expDate)) {
				this.invalidMessage = m.getLocalization("latestShipDateLessThanExpiryDateError",[
				                _localizeDisplayDate(this),
								_localizeDisplayDate(expDate)]);
				return false;
			}
			// Test that the last shipment date is less than or equal to the 
			// amendment date.
			var amdDate = dj.byId("amd_date");
			if(!m.compareDateFields(amdDate,this)) {
				this.invalidMessage = m.getLocalization("lastShipDateGreaterThanAmdDateError",[
								_localizeDisplayDate(this),
								_localizeDisplayDate(amdDate)]);
				return false;
			}
			// Test that the last shipment date is less than or equal to the 
			// due date (used in IN product).
			var dueDate = dj.byId("due_date");
			if(!m.compareDateFields(this, dueDate)) {
				this.invalidMessage = m.getLocalization("dueDateLessThanLastShipmentError",[
								_localizeDisplayDate(dueDate),
								_localizeDisplayDate(this)]);
				return false;
			}
			
			// Test that the last ship date is greater than the
			// Earliest Ship Date
			var earliestShipDate = dj.byId("earliest_ship_date");
			if (earliestShipDate && earliestShipDate.get("value") !== null)
			{
				if (d.date.compare(this.get("value"), m.localizeDate(earliestShipDate)) < 0)
				{
					this.invalidMessage = m.getLocalization(
							"lastShipDateLessThanEarliestShipDateError", [
									_localizeDisplayDate(this),
									_localizeDisplayDate(earliestShipDate) ]);
					return false;
				}
			}
			
			// Test that the line item latest ship date is greater than the
			// line item Earliest Ship Date
			var lineItemEarliestShipDate = dj.byId("line_item_earliest_ship_date");
			if (lineItemEarliestShipDate && lineItemEarliestShipDate.get("value") !== null)
			{
				if (d.date.compare(this.get("value"), m.localizeDate(lineItemEarliestShipDate)) < 0)
				{
					this.invalidMessage = m.getLocalization(
							"lastShipDateLessThanEarliestShipDateError", [
									_localizeDisplayDate(this),
									_localizeDisplayDate(lineItemEarliestShipDate) ]);
					return false;
				}
			}
			
			// Test that the line item shipment sub schedule latest ship date is greater than the
			// line item shipment sub schedule Earliest Ship Date
			var scheduleEarliestShipDate = dj.byId("schedule_earliest_ship_date");
			var schedule = dj.byId("line_item_shipment_schedules");
			if(schedule && schedule.store  && schedule.store._arrayOfTopLevelItems.length > 0 && scheduleEarliestShipDate && scheduleEarliestShipDate.get("value") !== null) 
			{
				if (d.date.compare(this.get("value"), m.localizeDate(scheduleEarliestShipDate)) < 0)
				{
					this.invalidMessage = m.getLocalization(
							"lastShipDateLessThanEarliestShipDateError", [
									_localizeDisplayDate(this),
									_localizeDisplayDate(scheduleEarliestShipDate) ]);
					return false;
				}
			}
			return true;
		},
		
		/**
		 * <h4>Summary:</h4>
		 * If Full Financing flag is selected,the Eligible amount and Finance Amount is set equal to Invoice amount and outstanding amount becomes zero.All fields readonly 
		 * @method _handleFullFinancingFlag
		 * <h4>Description:</h4> 
		 * </br>The Eligible amount and Finance Amount is set to Invoice Amount
		 * </br>All amount fields are made readonly.
		 * </br>When unchecked they are reverted back.
		 * @return {} 
		 *  
		 */
		handleFullFinancingFlag : function() {
		
			var	full_finance_accepted_flag_field =	dj.byId("full_finance_accepted_flag"),
				total_net_amt_field		=	dj.byId("total_net_amt"),
				inv_eligible_amt_field =	dj.byId("inv_eligible_amt"),
				finance_amt_field 		=	dj.byId("finance_amt"),
				finance_cur_code_field 		=	dj.byId("finance_cur_code"),
				prod_stat_code_field = dj.byId("prod_stat_code");
			
			if (full_finance_accepted_flag_field.get('checked') && prod_stat_code_field && prod_stat_code_field.get("value") !== "01")
			{
				inv_eligible_amt_field.set("readOnly", true);
				finance_amt_field.set("readOnly", true);
				finance_cur_code_field.set("readOnly", true);
				inv_eligible_amt_field.set("value",total_net_amt_field.value);
			}
			else if((isNaN(inv_eligible_amt_field.value) || parseFloat(inv_eligible_amt_field.value) === parseFloat(total_net_amt_field.value)) && (prod_stat_code_field && prod_stat_code_field.get("value") !== "01"))
			{
				inv_eligible_amt_field.set("readOnly", false);
				finance_amt_field.set("readOnly", false);
				finance_cur_code_field.set("readOnly", false);
				if(dj.byId("org_inv_eligible_amt") && dj.byId("org_inv_eligible_amt").get("value") !== null)
				{
					inv_eligible_amt_field.set("value",dj.byId("org_inv_eligible_amt").get("value"));
				}
				else
				{
					inv_eligible_amt_field.set("value",null);
				}
			} 
		},
		
		/**
		 * <h4>Summary:</h4>
		 * This method clears the fields specified.
		 */
		clearFields : function(fieldId) {
			
			dojo.forEach(fieldId, function(id){
				var field = dijit.byId(id);
				if(field)
				{
					dijit.byId(field).set('value','');
				}
			});
		},
		
		/**
		 *  Amount Format Select field is changed based on Delimiter.
		 *  The Amount Format Select field will return the default options, comma and dot, if the fixed size radio button is selected.
		 * @method changeAmountFormatSelectField
		 */
		
		changeAmountFormatSelectField : function() 
		{
			var delimiter 				= dj.byId("delimiter").get("value"), 
				existingAmountFormatWidget 	= dj.byId("amount_format_select"),
				mappingDelimitedField = dj.byId("mapping_delimited"),				
				amountFormatOptions = m._config.amountFormatOptions,				
				amountFormatCodeStore		= m._config.amountFormatSelectOptions[delimiter];
			if(mappingDelimitedField.get("checked"))
			{
	
				if (!amountFormatCodeStore)
				{
					var delimiterText = dj.byId("delimiter_text").get("value");
					amountFormatCodeStore		= m._config.amountFormatSelectOptions[delimiterText];
				}
				if(amountFormatCodeStore)
				{
					existingAmountFormatWidget.store = new dojo.data.ItemFileReadStore(
					{
						data :
						{
							identifier : "value",
							label : "name",
							items : amountFormatCodeStore
						}
					});
				}
			}
			else
			{
				existingAmountFormatWidget.store = new dojo.data.ItemFileReadStore(
						{
							data :
							{
								identifier : "value",
								label : "name",								
								items: amountFormatOptions
							}
						});
			}
				
				
		},
		
		/**
		 * <h4>Summary:</h4>
		 * This method clears the shipment details,Incoterms,Routing Summary,Freight Charges,Taxes and Adjustments at the line item level
		 */
		clearLineItemDetail : function() {

			var lineItems = dj.byId("line-items");
			if(lineItems && lineItems.store && lineItems.store._arrayOfTopLevelItems.length > 0) {
				lineItems.store.fetch({
					query:{store_id:"*"},
					onComplete: dojo.hitch(lineItems, function(items, request){
						dojo.forEach(items, function(item){
							/*dj.byId("line-items").store.deleteItem(item.shipment_schedules);*/
							if(item.last_ship_date && item.shipment_schedules[0])
							{
								item.last_ship_date[0] = "";
							}
							if(item.earliest_ship_date && item.earliest_ship_date[0])
							{
								item.earliest_ship_date[0] = "";
							}
							if(item.freight_charges_type && item.freight_charges_type[0])
							{
								item.freight_charges_type[0]="";
							}
							if(item.shipment_schedules && item.shipment_schedules[0])
							{
								item.shipment_schedules[0]._values= [];
							}
							if(item.incoterms && item.incoterms[0])
							{
								item.incoterms[0]._values= [];
							}
							if(item.air_routing_summaries && item.air_routing_summaries[0])
							{	
								item.air_routing_summaries[0]._values= [];
							}
							if(item.sea_routing_summaries && item.sea_routing_summaries[0])
							{	
								item.sea_routing_summaries[0]._values= [];
							}
							if(item.rail_routing_summaries && item.rail_routing_summaries[0])
							{	
								item.rail_routing_summaries[0]._values= [];
							}
							if(item.road_routing_summaries && item.road_routing_summaries[0])
							{	
								item.road_routing_summaries[0]._values= [];
							}
							if(item.taking_in_charge && item.taking_in_charge[0])
							{
								item.taking_in_charge[0] = "";
							}
							if(item.final_dest_place && item.final_dest_place[0])
							{
								item.final_dest_place[0] = "";
							}
							if(item.freight_charges && item.freight_charges[0])
							{
								item.freight_charges[0]._values= [];
							}
							if(item.taxes && item.taxes[0])
							{
								item.taxes[0]._values= [];
							}
							if(item.adjustments && item.adjustments[0])
							{
								item.adjustments[0]._values= [];
							}
							
						});
					})
				});
			}						
		},
		/**
		 * <h4>Summary:</h4>
		 * This function validates that From Amount is lesser than To Amount.
		 * @method validateFromAmount
		 * <h4>Description:</h4> 
		 * </br>Checks if From Amount is greater than To Amount and sets an error on From Amount.
		 * @return {} 
		 * 
		 */
		validateFromAmount : function()
		{
			var widget = dj.byId("amount_from");
			var amountFrom = widget ? widget.get("value") : "";
			var amountTo = dj.byId("amount_to") ? dj.byId("amount_to").get("value") : "";
			var displayMessage;
			if(amountFrom !== "" && amountFrom <= 0)
			{
				displayMessage = misys.getLocalization('invalidAmountError');
				widget.focus();
				widget.set("state","Error");
		 		dj.hideTooltip(widget.domNode);
		 		dj.showTooltip(displayMessage, widget.domNode, 0);
		 		dj.showTooltip(displayMessage, domNode, 0);
				 
			}
			if(amountFrom !== "" && amountTo !== "" && amountFrom > amountTo)
			{
				displayMessage = misys.getLocalization('invalidMinAmountValueError');
				widget.focus();
				widget.set("state","Error");
		 		dj.hideTooltip(widget.domNode);
		 		dj.showTooltip(displayMessage, widget.domNode, 0);
		 		dj.showTooltip(displayMessage, domNode, 0);
			}
		},
		/**
		 * <h4>Summary:</h4>
		 * This function validates that To Amount is greater than From Amount.
		 * @method validateToAmount
		 * <h4>Description:</h4> 
		 * </br>Checks if To Amount is lesser than From Amount and sets an error on To Amount.
		 * @return {} 
		 * 
		 */
		validateToAmount : function()
		{
			var widget = dj.byId("amount_to");
			var amountTo = widget ? widget.get("value") : "";
			var amountFrom = dj.byId("amount_from") ? dj.byId("amount_from").get("value") : "";
			var displayMessage;
			if(amountTo !== "" && amountTo <= 0)
			{
				displayMessage = misys.getLocalization('invalidAmountError');
				widget.focus();
				widget.set("state","Error");
		 		dj.hideTooltip(widget.domNode);
		 		dj.showTooltip(displayMessage, widget.domNode, 0);
		 		dj.showTooltip(displayMessage, domNode, 0);
				 
			}
			if(amountTo !== "" && amountFrom !== "" && amountTo < amountFrom)
			{
				displayMessage = misys.getLocalization('invalidMaxAmountValueError');
				widget.focus();
				widget.set("state","Error");
		 		dj.hideTooltip(widget.domNode);
		 		dj.showTooltip(displayMessage, widget.domNode, 0);
		 		dj.showTooltip(displayMessage, domNode, 0);
			}
		},
		/**
		 * <h4>Summary:</h4>
		 * This function validates that From Date is lesser than To Date.
		 * @method validateInvoiceFromDate
		 * <h4>Description:</h4> 
		 * </br>Checks if From Date is greater than To Date and sets an error on From Date.
		 * @return {} 
		 * 
		 */
		validateInvoiceFromDate : function(fromDate, toDate)
		{
			if(!m.compareDateFields(fromDate, toDate)) {
				var displayMessage = m.getLocalization("fromDateLessThanToDateError", [_localizeDisplayDate(fromDate),_localizeDisplayDate(toDate)]);
				//fromDate.focus();
				fromDate.set("state","Error");
		 		dj.hideTooltip(fromDate.domNode);
		 		dj.showTooltip(displayMessage, fromDate.domNode, 0);
		 		dj.showTooltip(displayMessage, domNode, 0);
			}
		},
		/**
		 * <h4>Summary:</h4>
		 * This function validates that To Date is greater than From Date.
		 * @method validateInvoiceToDate
		 * <h4>Description:</h4> 
		 * </br>Checks if To Date is lesser than From Date and sets an error on To Date.
		 * @return {} 
		 * 
		 */
		validateInvoiceToDate : function(fromDate, toDate)
		{
			if(!m.compareDateFields(fromDate, toDate)) {
				var displayMessage = m.getLocalization("toDateLessThanFromDateError", [_localizeDisplayDate(toDate),_localizeDisplayDate(fromDate)]);
				//toDate.focus();
				toDate.set("state","Error");
		 		dj.hideTooltip(toDate.domNode);
		 		dj.showTooltip(displayMessage, toDate.domNode, 0);
		 		dj.showTooltip(displayMessage, domNode, 0);
			}
		},
		
		validateDateAmountFormatFields : function()
		{
			var selectToList			=	dj.byId("user_list"),
				isValid					=	true,
				dateFormatSelectField	=	dj.byId("date_format_select"),
				amountFormatSelectField =	dj.byId("amount_format_select"),
				dateTextField			=	dj.byId("date_format_other"),
				amountTextField			=	dj.byId("amount_format_other"),
				breakLoop				=	false;
				
			d.some(d.query("option", selectToList.domNode), function(option,index)
			{
				var errorFields			=	[];
				if(m._config.mappedColumns[option.value].dataType === "Date")
				{
					if("S" + m._config.mappedColumns[option.value].dateFormat === "S")
					{
						errorFields.push(dateFormatSelectField);
						breakLoop	= true;
						isValid	= false;
					}
					else if(m._config.mappedColumns[option.value].dateFormat === "OTHER" && ("S" + m._config.mappedColumns[option.value].dateFormatText === "S"))
					{
						errorFields.push(dateTextField);
						breakLoop	= true;
						isValid	= false;
					}
				}
				else if(m._config.mappedColumns[option.value].dataType === "Number" && option.value !== "payment_term_nb_days")
				{
					if("S" + m._config.mappedColumns[option.value].amountFormat === "S")
					{
						errorFields.push(amountFormatSelectField);
						breakLoop	= true;
						isValid	= false;
					}
					else if(m._config.mappedColumns[option.value].amountFormat === "OTHER" && ("S" + m._config.mappedColumns[option.value].amountFormatText === "S"))
					{
						errorFields.push(amountTextField);
						breakLoop	= true;
						isValid	= false;
					}
				}
				if(breakLoop)
				{
					dj.byId("user_list").domNode.options.selectedIndex = index;
					dj.byId("user_list").onClick();
					m.markErrorFields(errorFields);
				}
				return breakLoop;
			});
			return isValid;
		},
		
		markErrorFields : function(errorFields)
		{
			var displayMessage = misys.getLocalization('uploadTemplateValueRequired');
			d.forEach(errorFields,function(field){
				field.set("state","Error");
				dj.hideTooltip(field.domNode);
				dj.showTooltip(displayMessage, field.domNode, 0);
			});
		},
		
		
		getInvoicesForBulk : function(productCode)
		{
			var customerRef;
			
			if(dj.byId("issuing_bank_customer_reference"))
			{
				customerRef = dj.byId("issuing_bank_customer_reference").get("value");
			}
			
			m.showSearchDialog("invoice_item_bulk","['invoice_ref_id', 'entity', 'program_code','seller_name','buyer_name', 'total_net_cur_code', 'total_net_amt', 'liab_total_net_amt', 'iss_date', 'due_date','prod_stat_code']",
					{product_code: productCode, issuing_bank_customer_reference: customerRef},"",
					productCode,"width:1250px;height:400px;", m.getLocalization("ListOfInvoicesTitleMessage"));
		},
		
		/**
		 * <h4>Summary:</h4>
		 * This function is to get the invoices eligible for bulk financing based on the criteria
		 * <h4>Description:</h4> 
		 * @method getInvoicesForBulkFiltered
		 * 
		 */
		getInvoicesForBulkFiltered : function()
		{
			
			// Check if program name has been populated in search options, if not, return an error
			var program_code;
			if(dj.byId("program"))
			{
				program_code = dj.byId("program").get("value");
			}
			
			if (!program_code)
			{
				misys.dialog.show("ERROR", misys.getLocalization("programNameRequiredForBulkFinancingSearch"));
				return;
			}
			
			var customerRef;			
			if(dj.byId("issuing_bank_customer_reference"))
			{
				customerRef = dj.byId("issuing_bank_customer_reference").get("value");
			}
			
			if (!customerRef)
			{
				misys.dialog.show("ERROR", misys.getLocalization("customerReferenceRequiredForBulkFinancingSearch"));
				return;
			}
			
			var curcode;
			if(dj.byId("curCode"))
			{
				curcode = dj.byId("curCode").get("value");
			}
			if ( !m.validateCurrencyCode(curcode)){
				misys.dialog.show("ERROR", misys.getLocalization("invalidCurrencyError",[curcode]));
				return;
			}
			
			var invoice_date_from;
			var invoice_date_to;
			var invoice_due_date_from;
			var invoice_due_date_to;
			if(dj.byId("amount_from"))
			{
				amount_from = dj.byId("amount_from");
			}
			if(dj.byId("amount_to"))
			{
				amount_to = dj.byId("amount_to");
			}
			if(dj.byId("invoice_date_from"))
			{
				invoice_date_from = dj.byId("invoice_date_from");
			}
			if(dj.byId("invoice_date_to"))
			{
				invoice_date_to = dj.byId("invoice_date_to");
			}
			if(dj.byId("invoice_due_date_from"))
			{
				invoice_due_date_from = dj.byId("invoice_due_date_from");
			}
			if(dj.byId("invoice_due_date_to"))
			{
				invoice_due_date_to = dj.byId("invoice_due_date_to");
			}
			
			if((amount_to && amount_to.get("value")!== null && amount_from &&  amount_from.get("value")!== null) && amount_to.get("value") < amount_from.get("value"))
            {
					misys.dialog.show("ERROR", misys.getLocalization("invalidMaxAmountValueError",[amount_to.get("displayedValue"),amount_from.get("displayedValue")]));
			}
			
			if((invoice_date_to && invoice_date_to.get("value")!== null && invoice_date_from &&  invoice_date_from.get("value")!== null) && ( d.date.compare(invoice_date_to.get("value"), invoice_date_from.get("value")) < 0 ))
			{
					misys.dialog.show("ERROR", misys.getLocalization("invoiceDateToGreaterThanDateFromError",[invoice_date_to.get("displayedValue"),invoice_date_from.get("displayedValue")]));
			}
			
			if((invoice_due_date_to && invoice_due_date_to.get("value")!== null && invoice_due_date_from &&  invoice_due_date_from.get("value")!== null) && ( d.date.compare(invoice_due_date_to.get("value"), invoice_due_date_from.get("value")) < 0 ))
			{
					misys.dialog.show("ERROR", misys.getLocalization("invoiceDueDateToGreaterThanDueDateFromError",[invoice_due_date_to.get("displayedValue"),invoice_due_date_from.get("displayedValue")]));
			}
			// Get list of invoice reference IDs from the main screen
			var invoiceRefIDList = "";
			if(dj.byId("invoicesGrid") && dj.byId("invoicesGrid").store && dj.byId("invoicesGrid").store._arrayOfAllItems &&  dj.byId("invoicesGrid").store._arrayOfAllItems.length)
			{
				var currentItems = dj.byId("invoicesGrid").store._arrayOfAllItems;
				for(var i=0; i < currentItems.length; i++)
					{
						if(currentItems[i] && currentItems[i]["REFERENCEID"])
						{
							invoiceRefIDList = invoiceRefIDList + currentItems[i]["REFERENCEID"] + ",";
						}
					}
			}	
			
			// Get the values of search options to be passed for query		
			var bulk_ref_id;
			var invoice_ref_id;
			var buyer_name;			
			var amount_from;
			var amount_to;
			var entity;
			
			if(dj.byId("ref_id"))
			{
				bulk_ref_id = dj.byId("ref_id").get("value");
			}
			if(dj.byId("invoice_ref_id"))
			{
				invoice_ref_id = dj.byId("invoice_ref_id").get("value");
			}
			
			if(dj.byId("buyer_name"))
			{
				buyer_name = dj.byId("buyer_name").get("value");
			}
			if(dj.byId("amount_from"))
			{
				amount_from = dj.byId("amount_from");
			}
			if(dj.byId("amount_to"))
			{
				amount_to = dj.byId("amount_to");
			}
			if(dj.byId("entity"))
			{
				entity = dj.byId("entity").get("value");
			}
			
		
			
					m.xhrPost( {
						url : m.getServletURL("/screen/AjaxScreen/action/GetStaticData"),
						handleAs 	: "json",
						sync 		: true,
						content : {
							option : "invoice_item_bulk",
							product_code : "IN",
							//bulk_ref_id : bulk_ref_id,
							invoice_ref_id : invoice_ref_id,
							buyer_name : buyer_name,
							curcode : curcode,
							program_code : program_code,
							amount_from : amount_from,
							amount_to : amount_to,
							invoice_date_from : invoice_date_from,
							invoice_date_to : invoice_date_to,
							invoice_due_date_from : invoice_due_date_from,
							invoice_due_date_to : invoice_due_date_to,
							invoiceRefIDList : invoiceRefIDList,
							entity : entity,
							customer_reference: customerRef
						},
						load : function(response){
							m._showFilteredInvoicesForBulk(response);
						}
					});
		},
		
		/**
		 * <h4>Summary:</h4>
		 * This function is to get the invoices linked to bulk financing based on the bulk ref id
		 * <h4>Description:</h4> 
		 * @method getInvoicesForBulkLinkedFiltered
		 * 
		 */
		getInvoicesForBulkLinkedFiltered : function()
		{
			// Get the values of search options to be passed for query			
			var bulk_ref_id;
			
			if(dj.byId("ref_id"))
			{
				bulk_ref_id = dj.byId("ref_id").get("value");
			}
			
					m.xhrPost( {
						url : m.getServletURL("/screen/AjaxScreen/action/GetStaticData"),
						handleAs 	: "json",
						sync 		: true,
						content :
						{
							option : "invoice_item_bulk_linked",
							product_code : "IN",
							bulk_ref_id : bulk_ref_id						
						},
						load : function(response){
							m._showFilteredInvoicesForBulkLinked(response);
						}
					});
		},
		
		/**
		 * <h4>Summary:</h4>
		 * This function is to get the invoice payables linked to bulk financing based on the bulk ref id
		 * <h4>Description:</h4> 
		 * @method getInvoicePayablesForBulkLinkedFiltered
		 * 
		 */
		getInvoicePayablesForBulkLinkedFiltered : function()
		{
			// Get the values of search options to be passed for query			
			var bulk_ref_id;
			
			if(dj.byId("ref_id"))
			{
				bulk_ref_id = dj.byId("ref_id").get("value");
			}
			
					m.xhrPost( {
						url : m.getServletURL("/screen/AjaxScreen/action/GetStaticData"),
						handleAs 	: "json",
						sync 		: true,
						content : {
							option : "invoice_payable_item_bulk_linked",
							product_code : "IP",
							bulk_ref_id : bulk_ref_id						},
						load : function(response){
							m._showFilteredInvoicePayablesForBulkLinked(response);
						}
					});
		},

		/**
		 * <h4>Summary:</h4>
		 * This function displays the invoices filtered to the main screen of invoice bulk financing
		 * <h4>Description:</h4> 
		 * @method _showFilteredInvoicesForBulk
		 * 
		 */
		_showFilteredInvoicesForBulk : function(response){
			var invoiceData = dj.byId("invoice_item_bulkdata_grid");
			//set an empty store
			var emptyStore = new dojo.data.ItemFileWriteStore({data:{"identifier":"REFERENCEID","items" :[]}});
			if(response.items.length > 0)
			{
				var selItems = response.items;
				//add - update
				if(selItems.length > 0) {
					for(var i = 0 ; i<selItems.length ; i++) {
						var item=selItems[i];
						if(item !== null)
						{
							var newInvoicesItem = m.createInvoiceItem(item);
							emptyStore.newItem(newInvoicesItem);
						}
					}
				}
				
				
				if(invoiceData)
				{
					invoiceData.setStore(emptyStore);
					dojo.style(invoiceData.domNode, "display", "");
					invoiceData.resize();
				}

			}
			else
			{
				invoiceData.setStore(emptyStore);
				dojo.style(invoiceData.domNode, "display", "");
				invoiceData.resize();
				invoiceData.render();
			}
			
		},
		
		/**
		 * <h4>Summary:</h4>
		 * This function displays the invoices filtered to the main screen of invoice bulk financing
		 * <h4>Description:</h4> 
		 * @method _showFilteredInvoicesForBulkLinked
		 * 
		 */
		_showFilteredInvoicesForBulkLinked : function(response){
			var invoiceData = dj.byId("invoicesGrid");
			//set an empty store
			var emptyStore = new dojo.data.ItemFileWriteStore({data:{"identifier":"REFERENCEID","items" :[]}});
			if(response.items.length > 0)
			{
				var selItems = response.items;
				//add - update
				if(selItems.length > 0) {
					for(var i = 0 ; i<selItems.length ; i++) {
						var item=selItems[i];
						if(item !== null)
						{
							var newInvoicesItem = m.createInvoiceItem(item);
							emptyStore.newItem(newInvoicesItem);
						}
					}
				}
				if(invoiceData)
				{
					invoiceData.setStore(emptyStore);
					dojo.style(invoiceData.domNode, "display", "");
					invoiceData.resize();
				}
			}
			else
			{
				invoiceData.setStore(emptyStore);
				dojo.style(invoiceData.domNode, "display", "");
				invoiceData.resize();
				invoiceData.render();
			}
		},
		
		/**
		 * <h4>Summary:</h4>
		 * This function displays the invoices filtered to the main screen of invoice payable bulk financing
		 * <h4>Description:</h4> 
		 * @method _showFilteredInvoicePayablesForBulkLinked
		 * 
		 */
		_showFilteredInvoicePayablesForBulkLinked : function(response){
			var invoiceData = dj.byId("invoicePayablesGrid");
			//set an empty store
			var emptyStore = new dojo.data.ItemFileWriteStore({data:{"identifier":"REFERENCEID","items" :[]}});
			if(response.items.length > 0)
			{
				var selItems = response.items;
				//add - update
				if(selItems.length > 0) {
					for(var i = 0 ; i<selItems.length ; i++) {
						var item=selItems[i];
						if(item !== null)
						{
							var newInvoicesItem = m.createInvoicePayableItem(item);
							emptyStore.newItem(newInvoicesItem);
						}
					}
				}
				
				
				if(invoiceData)
				{
					invoiceData.setStore(emptyStore);
					dojo.style(invoiceData.domNode, "display", "");
					invoiceData.resize();
				}

			}
			else
			{
				invoiceData.setStore(emptyStore);
				dojo.style(invoiceData.domNode, "display", "");
				invoiceData.resize();
				invoiceData.render();
			}
			
		},

		/**
		 * <h4>Summary:</h4>
		 * This function is used to validate the selected
		 * @param {Object} Grid
		 * Popup Grid
		 * @param {Object} curCode
		 * currency Code Object
		 * @method fetchLicenseRecords
		 */
		createInvoiceItem: function(/* Object */ item) {
			
			var refId = item.REFERENCEID.slice().toString();
			var issuerRefId = item.INVOICE_REFERENCE_LABEL.slice().toString();
			var program = item.PROGRAM_NAME.slice().toString();
			var buyerName = item.BUYER_NAME.slice().toString();
			var curCode = item.CURCODE.slice().toString();
			var amount = item.AMOUNT;
			var osAmount = item.OS_AMOUNT;
			var invoiceDate = item.INVOICE_DATE.slice().toString();
			var invoiceDueDate = item.INVOICE_DUE_DATE.slice().toString();
			var status = item.STATUS;
			var financeReqPercent = item.FIN_REQUESTED_PERCENT;
			var deleteIconPath = "";
			if(d.byId("delete_icon") != null && d.byId("delete_icon"))
			{
				deleteIconPath = d.byId("delete_icon").value;
			}
			var actn= "<img src="+deleteIconPath+" onClick =\"javascript:misys.deleteInvoiceRecord('" + item.REFERENCEID + "')\"/>";
			var invoiceItem = {"REFERENCEID" : refId, "INVOICE_REFERENCE_LABEL" : issuerRefId, "PROGRAM_NAME" : program, "ACTION" : actn, "BUYER_NAME" : buyerName, "CURCODE" : curCode, "AMOUNT" : amount, "OS_AMOUNT" : osAmount, "INVOICE_DATE" : invoiceDate, "INVOICE_DUE_DATE": invoiceDueDate, "STATUS" : status, "FIN_REQUESTED_PERCENT" : financeReqPercent};
			
			return invoiceItem;
		},
		
		/**
		 * <h4>Summary:</h4>
		 * This function is used to create the invoice item grid after selection of a set of invoices is done.
		 * This function is also used to validate the license allocated amount widgets with the license actual amount.
		 * @param {Object} Grid
		 * Popup Grid
		 * @param {Object} curCode
		 * currency Code Object
		 * @method processLicenseRecords
		 */
		processInvoiceRecords : function( /*Dojox Grid*/ grid) {
			//Grid of selected records on the main screen.
			var invoiceData = dj.byId("invoicesGrid");
			
			//set an empty store
			var emptyStore = new dojo.data.ItemFileWriteStore({data:{"identifier":"REFERENCEID","items" :[]}});
			// Object to save grid data already present
			var existingGridObj= [];
			if(invoiceData && invoiceData.store && invoiceData.store._arrayOfTopLevelItems.length >0) {
				invoiceData.store.fetch({
					query: {REFERENCEID: '*'},
					onComplete: function(items, request){
						dojo.forEach(items, function(item){
							var newItem1 = m.createInvoiceItem(item);
							emptyStore.newItem(newItem1);
							existingGridObj.push(item);
						});
					}
				});
			}
			
			var selItems = grid.selection.getSelected();
			//add - update
			if(selItems.length > 0) {
				for(var i = 0 ; i<selItems.length ; i++) {
					var isDup= false;
					var amount = "";
					var newItem = {};
					var item=selItems[i];
					if(item !== null)
					{
						var newInvoicesItem = m.createInvoiceItem(item);
						//If Invoices have already been selected, check the selected record is not in the list and then add.
						if(existingGridObj.length > 0) {
							for(var t=0;t<existingGridObj.length ; t++) {
								if(existingGridObj[t].REFERENCEID.slice().toString() === item.REFERENCEID.slice().toString())	{
									isDup = true;
								}
							}
							if(!isDup) {
								emptyStore.newItem(newInvoicesItem);
							}
						}
						else {
							emptyStore.newItem(newInvoicesItem);
						}
					}
				}
				
				if(invoiceData)
				{
					invoiceData.setStore(emptyStore);
					dojo.style(invoiceData.domNode, "display", "");
					invoiceData.resize();
				}
				dj.byId("xhrDialog").hide();
			}
			else
			{
				misys.dialog.show("ERROR", misys.getLocalization("invoiceShouldBeSelected"));
			}
			
			
		},
		
		/**
		 * <h4>Summary:</h4>
		 * This function is used to close the pop up in bulk financing
		 * @param {Object} Grid
		 * Popup Grid
		 * @method closeInvoiceGrid
		 */
		closeInvoiceGrid : function( /*Dojox Grid*/ grid) {
			dj.byId("xhrDialog").hide();
		},
		
		/**
		 * <h4>Summary:</h4>
		 * This function is used to delete a particular invoice record, from the list added to bulk.
		 * @param {String} Reference
		 * Reference Id of the row to be deleted
		 * @method deleteInvoiceRecord
		 */
		deleteInvoiceRecord : function(/*String*/ ref) {
			var items=[];
			dj.byId("invoicesGrid").store.fetch({
				query: {REFERENCEID: '*'},
				onComplete: dojo.hitch(dj.byId("invoicesGrid"), function(items, request){
					dojo.forEach(items, function(item){
						if(item.REFERENCEID.slice().toString() === ref.slice().toString())
						{
							dj.byId("invoicesGrid").store.deleteItem(item);
						}
					});
				})
			});
			
			dj.byId("invoicesGrid").resize();
			dj.byId("invoicesGrid").render();
		},
		
		getInvoicePayablesForBulk : function(productCode)
		{
			m.showSearchDialog("invoice_payable_item_bulk","['invoice_payable_ref_id', 'entity', 'program_code','seller_name','buyer_name', 'total_net_cur_code', 'total_net_amt', 'liab_total_net_amt', 'iss_date', 'due_date','prod_stat_code']",
					{product_code: productCode},"",
					productCode,"width:1250px;height:400px;", m.getLocalization("ListOfInvoicePayablesTitleMessage"));
		},
		
		/**
		 * <h4>Summary:</h4>
		 * This function is to get the invoice payables eligible for bulk financing based on the criteria
		 * <h4>Description:</h4> 
		 * @method getInvoicePayablesForBulkFiltered
		 * 
		 */
		getInvoicePayablesForBulkFiltered : function()
		{
			
			// Check if program name has been populated in search options, if not, return an error
			var program_code;
			if(dj.byId("program"))
			{
				program_code = dj.byId("program").get("value");
			}
			
			if (!program_code)
			{
				misys.dialog.show("ERROR", misys.getLocalization("programNameRequiredForBulkFinancingSearch"));
				return;
			}			
			
			var customerRef;			
			if(dj.byId("issuing_bank_customer_reference"))
			{
				customerRef = dj.byId("issuing_bank_customer_reference").get("value");
			}
			
			if (!customerRef)
			{
				misys.dialog.show("ERROR", misys.getLocalization("customerReferenceRequiredForBulkFinancingSearch"));
				return;
			}
			
			var curcode;
			if(dj.byId("curCode"))
			{
				curcode = dj.byId("curCode").get("value");
			}
			if ( !m.validateCurrencyCode(curcode)){
				misys.dialog.show("ERROR", misys.getLocalization("invalidCurrencyError",[curcode]));
				return;
			}
						
			var invoice_date_from;
			var invoice_date_to;
			var invoice_due_date_from;
			var invoice_due_date_to;
			if(dj.byId("amount_from"))
			{
				amount_from = dj.byId("amount_from");
			}
			if(dj.byId("amount_to"))
			{
				amount_to = dj.byId("amount_to");
			}
			if(dj.byId("invoice_date_from"))
			{
				invoice_date_from = dj.byId("invoice_date_from");
			}
			if(dj.byId("invoice_date_to"))
			{
				invoice_date_to = dj.byId("invoice_date_to");
			}
			if(dj.byId("invoice_due_date_from"))
			{
				invoice_due_date_from = dj.byId("invoice_due_date_from");
			}
			if(dj.byId("invoice_due_date_to"))
			{
				invoice_due_date_to = dj.byId("invoice_due_date_to");
			}

			if((amount_to && amount_to.get("value")!== null && amount_from &&  amount_from.get("value")!== null) && amount_to.get("value") < amount_from.get("value"))
            {
					misys.dialog.show("ERROR", misys.getLocalization("invalidMaxAmountValueError",[amount_to.get("displayedValue"),amount_from.get("displayedValue")]));
			}
			
			if((invoice_date_to && invoice_date_to.get("value")!== null && invoice_date_from &&  invoice_date_from.get("value")!== null) && ( d.date.compare(invoice_date_to.get("value"), invoice_date_from.get("value")) < 0 ))
            {
					misys.dialog.show("ERROR", misys.getLocalization("invoiceDateToGreaterThanDateFromError",[invoice_date_to.get("displayedValue"),invoice_date_from.get("displayedValue")]));
			}
			
			if((invoice_due_date_to && invoice_due_date_to.get("value")!== null && invoice_due_date_from &&  invoice_due_date_from.get("value")!== null) && ( d.date.compare(invoice_due_date_to.get("value"), invoice_due_date_from.get("value")) < 0 ))
            {
					misys.dialog.show("ERROR", misys.getLocalization("invoiceDueDateToGreaterThanDueDateFromError",[invoice_due_date_to.get("displayedValue"),invoice_due_date_from.get("displayedValue")]));
			}
			
			
			// Get list of invoice reference IDs from the main screen
			var invoiceRefIDList = "";
			if(dj.byId("invoicePayablesGrid") && dj.byId("invoicePayablesGrid").store && dj.byId("invoicePayablesGrid").store._arrayOfAllItems &&  dj.byId("invoicePayablesGrid").store._arrayOfAllItems.length)
			{
				var currentItems = dj.byId("invoicePayablesGrid").store._arrayOfAllItems;
				for(var i=0; i < currentItems.length; i++)
					{
						if(currentItems[i] && currentItems[i]["REFERENCEID"])
						{
							invoiceRefIDList = invoiceRefIDList + currentItems[i]["REFERENCEID"] + ",";
						}
					}
			}	
			
			// Get the values of search options to be passed for query			
			var bulk_ref_id;
			var invoice_payable_ref_id;
			var seller_name;
			var amount_from;
			var amount_to;
			var entity;
			
			if(dj.byId("ref_id"))
			{
				bulk_ref_id = dj.byId("ref_id").get("value");
			}
			if(dj.byId("invoice_payable_ref_id"))
			{
				invoice_payable_ref_id = dj.byId("invoice_payable_ref_id").get("value");
			}
			if(dj.byId("seller_name"))
			{
				seller_name = dj.byId("seller_name").get("value");
			}
			if(dj.byId("amount_from"))
			{
				amount_from = dj.byId("amount_from");
			}
			if(dj.byId("amount_to"))
			{
				amount_to = dj.byId("amount_to");
			}
			if(dj.byId("entity"))
			{
				entity = dj.byId("entity").get("value");
			}
			
					m.xhrPost( {
						url : m.getServletURL("/screen/AjaxScreen/action/GetStaticData"),
						handleAs 	: "json",
						sync 		: true,
						content : {
							option : "invoice_payable_item_bulk",
							product_code : "IP",
							//bulk_ref_id : bulk_ref_id,
							invoice_ref_id : invoice_payable_ref_id,
							seller_name : seller_name,
							curcode : curcode,
							program_code : program_code,
							amount_from : amount_from,
							amount_to : amount_to,
							invoice_date_from : invoice_date_from,
							invoice_date_to : invoice_date_to,
							invoice_due_date_from : invoice_due_date_from,
							invoice_due_date_to : invoice_due_date_to,
							invoiceRefIDList : invoiceRefIDList,
							entity : entity,
							customer_reference: customerRef
						},
						load : function(response){
							m._showFilteredInvoicePayablesForBulk(response);
						}
					});
		},

	     /**
		 * <h4>Summary:</h4>
		 * This function displays the invoice payables filtered to the main screen of invoice payable bulk financing
		 * <h4>Description:</h4> 
		 * @method _showFilteredInvoicePayablesForBulk
		 * 
		 */
		_showFilteredInvoicePayablesForBulk : function(response){
			var invoiceData = dj.byId("invoice_payable_item_bulkdata_grid");
			//set an empty store
			var emptyStore = new dojo.data.ItemFileWriteStore({data:{"identifier":"REFERENCEID","items" :[]}});
			if(response.items.length > 0)
			{
				var selItems = response.items;
				//add - update
				if(selItems.length > 0) {
					for(var i = 0 ; i<selItems.length ; i++) {
						var item=selItems[i];
						if(item !== null)
						{
							var newInvoicesItem = m.createInvoicePayableItem(item);
							emptyStore.newItem(newInvoicesItem);
						}
					}
				}
				
				
				if(invoiceData)
				{
					invoiceData.setStore(emptyStore);
					dojo.style(invoiceData.domNode, "display", "");
					invoiceData.resize();
				}

			}
			else
			{
				invoiceData.setStore(emptyStore);
				dojo.style(invoiceData.domNode, "display", "");
				invoiceData.resize();
				invoiceData.render();
			}
			
		},	

		/**
		 * <h4>Summary:</h4>
		 * This function is used to create an invoice payable record for the grid
		 * @method createInvoicePayableItem
		 */
		createInvoicePayableItem: function(/* Object */ item) {
			
			var refId = item.REFERENCEID.slice().toString();
			var issuerRefId = item.INVOICE_REFERENCE_LABEL.slice().toString();
			var program = item.PROGRAM_NAME.slice().toString();
			var sellerName = item.SELLER_NAME.slice().toString();
			var curCode = item.CURCODE.slice().toString();
			var amount = item.AMOUNT;
			var osAmount = item.OS_AMOUNT;
			var invoiceDate = item.INVOICE_DATE.slice().toString();
			var invoiceDueDate = item.INVOICE_DUE_DATE.slice().toString();
			var status = item.STATUS;
			var financeReqPercent = item.FIN_REQUESTED_PERCENT;
			var deleteIconPath = "";
			if(d.byId("delete_icon") != null && d.byId("delete_icon"))
			{
				deleteIconPath = d.byId("delete_icon").value;
			}
			var actn= "<img src="+deleteIconPath+" onClick =\"javascript:misys.deleteInvoicePayableRecord('" + item.REFERENCEID + "')\"/>";
			var invoiceItem = {"REFERENCEID" : refId, "INVOICE_REFERENCE_LABEL" : issuerRefId, "PROGRAM_NAME" : program, "ACTION" : actn, "SELLER_NAME" : sellerName, "CURCODE" : curCode, "AMOUNT" : amount, "OS_AMOUNT" : osAmount, "INVOICE_DATE" : invoiceDate, "INVOICE_DUE_DATE": invoiceDueDate, "STATUS" : status, "FIN_REQUESTED_PERCENT" : financeReqPercent};
			
			return invoiceItem;
		},
		
		/**
		 * <h4>Summary:</h4>
		 * This function is used to create the invoice item grid after selection of a set of invoices is done.
		 * This function is also used to validate the license allocated amount widgets with the license actual amount.
		 * @param {Object} Grid
		 * Popup Grid
		 * @param {Object} curCode
		 * currency Code Object
		 * @method processLicenseRecords
		 */
		processInvoicePayableRecords : function( /*Dojox Grid*/ grid) {
			//Grid of selected records on the main screen.
			var invoiceData = dj.byId("invoicePayablesGrid");
			
			//set an empty store
			var emptyStore = new dojo.data.ItemFileWriteStore({data:{"identifier":"REFERENCEID","items" :[]}});
			// Object to save grid data already present
			var existingGridObj= [];
			if(invoiceData && invoiceData.store && invoiceData.store._arrayOfTopLevelItems.length >0) {
				invoiceData.store.fetch({
					query: {REFERENCEID: '*'},
					onComplete: function(items, request){
						dojo.forEach(items, function(item){
							var newItem1 = m.createInvoicePayableItem(item);
							emptyStore.newItem(newItem1);
							existingGridObj.push(item);
						});
					}
				});
			}
			
			var selItems = grid.selection.getSelected();
			//add - update
			if(selItems.length > 0) {
				for(var i = 0 ; i<selItems.length ; i++) {
					var isDup= false;
					var amount = "";
					var newItem = {};
					var item=selItems[i];
					if(item !== null)
					{
						var newInvoicesItem = m.createInvoicePayableItem(item);
						//If Invoices have already been selected, check the selected record is not in the list and then add.
						if(existingGridObj.length > 0) {
							for(var t=0;t<existingGridObj.length ; t++) {
								if(existingGridObj[t].REFERENCEID.slice().toString() === item.REFERENCEID.slice().toString())	{
									isDup = true;
								}
							}
							if(!isDup) {
								emptyStore.newItem(newInvoicesItem);
							}
						}
						else {
							emptyStore.newItem(newInvoicesItem);
						}
					}
				}
				
				if(invoiceData)
				{
					invoiceData.setStore(emptyStore);
					dojo.style(invoiceData.domNode, "display", "");
					invoiceData.resize();
				}
				dj.byId("xhrDialog").hide();
			}
			else
			{
				misys.dialog.show("ERROR", misys.getLocalization("invoicePayableShouldBeSelected"));
			}
			
			
		},
		
		/**
		 * <h4>Summary:</h4>
		 * This function is used to delete a particular invoice record, from the list added to bulk.
		 * @param {String} Reference
		 * Reference Id of the row to be deleted
		 * @method deleteInvoiceRecord
		 */
		deleteInvoicePayableRecord : function(/*String*/ ref) {
			var items=[];
			dj.byId("invoicePayablesGrid").store.fetch({
				query: {REFERENCEID: '*'},
				onComplete: dojo.hitch(dj.byId("invoicePayablesGrid"), function(items, request){
					dojo.forEach(items, function(item){
						if(item.REFERENCEID.slice().toString() === ref.slice().toString())
						{
							dj.byId("invoicePayablesGrid").store.deleteItem(item);
						}
					});
				})
			});
			
			dj.byId("invoicePayablesGrid").resize();
			dj.byId("invoicePayablesGrid").render();
		},
		
		resetBulkInvoiceOnEntityChange : function(invoiceRefIDList)
		{	
			// Get the values of search options to be passed for query			
			var bulk_ref_id;
			var invoice_ref_id;
			var seller_name;
			var entity;
			var tnxID;
			var product_code;
			var sub_product_code;
			if(dj.byId("tnx_id"))
			{
				tnxID = dj.byId("tnx_id").get("value");
			}
			if(dj.byId("ref_id"))
			{
				bulk_ref_id = dj.byId("ref_id").get("value");
			}
			if(dj.byId("invoice_ref_id"))
			{
				invoice_ref_id = dj.byId("invoice_ref_id").get("value");
			}
			if(dj.byId("entity"))
			{
				entity = dj.byId("entity").get("value");
			}
			if(dj.byId("child_product_code"))
			{
				product_code = dj.byId("child_product_code").get("value");
			}
			if(dj.byId("sub_product_code"))
			{
				sub_product_code = dj.byId("sub_product_code").get("value");
			}
			
					m.xhrPost( {
						url : m.getServletURL("/screen/AjaxScreen/action/GetStaticData"),
						handleAs 	: "json",
						sync 		: true,
						content : {
							option : "reset_invoice_on_entity_change",
							product_code : product_code,
							sub_product_code : sub_product_code,
							bulk_ref_id : bulk_ref_id,
							tnxID : tnxID,
							invoice_ref_id : invoice_ref_id,
							invoiceRefIDList : invoiceRefIDList,
							entity : entity
						},
						load : function(response){
							m._showFilteredInvoicePayablesForBulk(response);
						}
					});
		},
		
		clearInvoicePayablesGrid : function(){
			var invoicePayablesData = dj.byId("invoicePayablesGrid");
			// Get list of invoice reference IDs from the main screen
			var invoicePayablesRefIDList = "";
			if(dj.byId("invoicePayablesGrid") && dj.byId("invoicePayablesGrid").store && dj.byId("invoicePayablesGrid").store._arrayOfAllItems &&  dj.byId("invoicePayablesGrid").store._arrayOfAllItems.length)
			{
				var currentItems = dj.byId("invoicePayablesGrid").store._arrayOfAllItems;
				for(var i=0; i < currentItems.length; i++)
					{
						if(currentItems[i] && currentItems[i]["REFERENCEID"])
						{
							invoicePayablesRefIDList = invoicePayablesRefIDList + currentItems[i]["REFERENCEID"] + ",";
						}
					}
			}	
			//set an empty store
			var emptyStore = new dojo.data.ItemFileWriteStore({data:{"identifier":"REFERENCEID","items" :[]}});
			invoicePayablesData.setStore(emptyStore);
			invoicePayablesData.resize();
			m.resetBulkInvoiceOnEntityChange(invoicePayablesRefIDList);
		},
		
		clearInvoiceGrid : function(){
			var invoiceData = dj.byId("invoicesGrid");
			
			var invoiceRefIDList = "";
			if(dj.byId("invoicesGrid") && dj.byId("invoicesGrid").store && dj.byId("invoicesGrid").store._arrayOfAllItems &&  dj.byId("invoicesGrid").store._arrayOfAllItems.length)
			{
				var currentItems = dj.byId("invoicesGrid").store._arrayOfAllItems;
				for(var i=0; i < currentItems.length; i++)
					{
						if(currentItems[i] && currentItems[i]["REFERENCEID"])
						{
							invoiceRefIDList = invoiceRefIDList + currentItems[i]["REFERENCEID"] + ",";
						}
					}
			}	
			//set an empty store
			
			//set an empty store
			var emptyStore = new dojo.data.ItemFileWriteStore({data:{"identifier":"REFERENCEID","items" :[]}});
			invoiceData.setStore(emptyStore);
			invoiceData.resize();
			m.resetBulkInvoiceOnEntityChange(invoiceRefIDList);
		},
		// clears the invoice grid in CR and CN form when fscm_programme_code and buyer_abbv_name changes
		clearLinkedInvoiceGrid : function(){
			var invoiceData = dj.byId("gridInvoice");
			var emptyCells = { items: "" };
			var items=[];
			
			if(dj.byId("gridInvoice") && dj.byId("gridInvoice").store && dj.byId("gridInvoice").store._arrayOfAllItems &&  dj.byId("gridInvoice").store._arrayOfAllItems.length !==0)
			{
				var message = misys.getLocalization("resetLinkedInvoiceGrid");
				var emptyStore = new dojo.data.ItemFileWriteStore({data: emptyCells});
				var okCallback = function()
				{
					items = invoiceData.store._arrayOfTopLevelItems;
					for(var i=0; i < items.length; i++)
					{
						if(dj.byId("invoiceAmt_"+i))
						{
							dj.byId("invoiceAmt_"+i).destroy(true);
						}
					}
					//set an empty store
					invoiceData.setStore(emptyStore);
				};
				m.dialog.show("CONFIRMATION", message, "", "", "", "", okCallback, function(){});
			}	
		
		},
		
		clearRepaymentAmt : function () {
			var repaymentAmount = dj.byId("finance_repayment_amt");
			var repaymentPercentage = dj.byId("finance_repayment_percentage");
			
			repaymentAmount.attr("disabled", false);
			repaymentPercentage.attr("disabled", false);
			repaymentAmount.set("value",'');
			repaymentPercentage.set("value",'');
		},
		
		setRepaymentDetails : function(){
			
			var repaymentAction = dj.byId("finance_repayment_action").value;
			var outstandingRepaymentAmt = dj.byId("outstanding_repayment_amt");
			var outstandingRepaymentCur = dj.byId("outstanding_repayment_cur_code");
			var interests = dj.byId("interest_flag");
			var charges = dj.byId("charge_flag");
			var repaymentAmount = dj.byId("finance_repayment_amt");
			var repaymentCur = dj.byId("finance_repayment_cur_code");
			var repaymentPercentage = dj.byId("finance_repayment_percentage");
			
			//reset values
			outstandingRepaymentAmt.set("disabled", true);
			outstandingRepaymentCur.set("disabled", true);
			interests.set("checked", false);
			interests.set("disabled", true);
			charges.set("checked", false);
			charges.set("disabled", true);
			repaymentAmount.attr("disabled", false);
			repaymentPercentage.attr("disabled", false);
			repaymentCur.set("value", outstandingRepaymentCur.value);
			repaymentCur.set("disabled", true);
			
			if (repaymentAction === "01")
			{
				interests.set("checked", true);
				charges.set("checked", true);					
				repaymentAmount.set("value", outstandingRepaymentAmt.value);				
				this.setRepaymentCurrency("finance_repayment_cur_code", ["finance_repayment_amt"]);
				repaymentPercentage.set("value", '');
				repaymentAmount.attr("disabled", true);
				repaymentPercentage.attr("disabled", true);
			}
			else if (repaymentAction === "02")
			{
				interests.set("checked", true);
			}
			else if (repaymentAction === "03")
			{
				if(repaymentAmount.displayedValue === "")
				{
					repaymentAmount.set("value", outstandingRepaymentAmt.value);
				}
				if(repaymentCur.displayedValue === "")
				{
					repaymentCur.set("value", outstandingRepaymentCur.value);
					this.setRepaymentCurrency("finance_repayment_cur_code", ["finance_repayment_amt"]);
				}					
				interests.set("checked", true);
				charges.set("checked", true);
			}
			else if (repaymentAction === "04")
			{
				interests.set("checked", true);
				charges.set("checked", true);
			}

		},
		
		setRepaymentAmtAndCurCode : function() {			

			var repayAmt = dj.byId("finance_repayment_amt");
			var percentage = dj.byId("finance_repayment_percentage").value;
			
				
			if (repayAmt.value === 0)
			{
				misys.dialog.show("ERROR", misys.getLocalization("repaymentAmtCantBeZero"));
				repayAmt.set("value",'');				
			}
			else if(dj.byId("finance_repayment_amt").displayedValue === "") 
			{
				dj.byId("finance_repayment_percentage").attr("disabled", false);
			}			
		},
		
		setRepaymentPercentage : function () {
			
			var outstandingRepaymentAmt = dj.byId("outstanding_repayment_amt");
			var percentage = dj.byId("finance_repayment_percentage").value;
			var repayAmt = ( percentage/100 ) * outstandingRepaymentAmt;
			
			dj.byId("finance_repayment_amt").set("value", repayAmt);	
			
			if(dj.byId("finance_repayment_percentage").displayedValue === "") 
			{
				dj.byId("finance_repayment_amt").attr("disabled", false);
			}
			else 
			{
				dj.byId("finance_repayment_amt").attr("disabled", true);
			}
			
		},
		
		/**
		 * <h4>Summary:</h4>
		 * This function is used to validate the from amount.	 
		 * 
		 * @method validateFSCMFromAmount
		 */
		
		validateFSCMFromAmount : function(idFrom, idTo)
		{
			var widget = dj.byId(idFrom);
			var amountFrom = widget ? widget.get("value") : "";
			var amountTo = dj.byId(idTo) ? dj.byId(idTo).get("value") : "";
			var displayMessage;
			if(amountFrom !== "" && amountFrom <= 0)
			{
				displayMessage = misys.getLocalization("invalidAmountError");
				widget.focus();
				widget.set("state","Error");
		 		dj.hideTooltip(widget.domNode);
		 		dj.showTooltip(displayMessage, widget.domNode, 0);
		 		dj.showTooltip(displayMessage, domNode, 0);
				 
			}
			if(amountFrom !== "" && amountTo !== "" && amountFrom > amountTo)
			{
				displayMessage = misys.getLocalization("invalidMinAmountValueError");
				widget.focus();
				widget.set("state","Error");
		 		dj.hideTooltip(widget.domNode);
		 		dj.showTooltip(displayMessage, widget.domNode, 0);
		 		dj.showTooltip(displayMessage, domNode, 0);
			}
		},
		
		/**
		 * <h4>Summary:</h4>
		 * This function is used to validate the to amount.	 
		 * 
		 * @method validateFSCMToAmount
		 */
		validateFSCMToAmount : function(idTo, idFrom)
		{
			var widget = dj.byId(idTo);
			var amountTo = widget ? widget.get("value") : "";
			var amountFrom = dj.byId(idFrom) ? dj.byId(idFrom).get("value") : "";
			var displayMessage;
			if(amountTo !== "" && amountTo <= 0)
			{
				displayMessage = misys.getLocalization("invalidAmountError");
				widget.focus();
				widget.set("state","Error");
		 		dj.hideTooltip(widget.domNode);
		 		dj.showTooltip(displayMessage, widget.domNode, 0);
		 		dj.showTooltip(displayMessage, domNode, 0);
				 
			}
			if(amountTo !== "" && amountFrom !== "" && amountTo < amountFrom)
			{
				displayMessage = misys.getLocalization("invalidMaxAmountValueError");
				widget.focus();
				widget.set("state","Error");
		 		dj.hideTooltip(widget.domNode);
		 		dj.showTooltip(displayMessage, widget.domNode, 0);
		 		dj.showTooltip(displayMessage, domNode, 0);
			}		
		},		
		/**
		 * <h4>Summary:</h4>
		 * This function is used to validate the to invoice date.	 
		 * 
		 * @method validateInvoiceDateTo
		 */
		validateInvoiceDateTo : function()
		{
			var invoice_date_from;
			var invoice_date_to;
			if(dj.byId("invoice_date_from"))
			{
				invoice_date_from = dj.byId("invoice_date_from");
			}
			
			if(dj.byId("invoice_date_to"))
			{
				invoice_date_to = dj.byId("invoice_date_to");
			}
			
			if ((invoice_date_to && invoice_date_to.get("value")!== null && invoice_date_from &&  invoice_date_from.get("value")!== null) && ( d.date.compare(invoice_date_to.get("value"), invoice_date_from.get("value")) < 0 ))
			{
				var finDate2 = dj.byId("invoice_date_to");
			 	displayMessage = misys.getLocalization("invoiceDateToGreaterThanDateFromError");
			 	//finDate2.focus();	 		
			 	finDate2.set("state","Error");
		 		dj.hideTooltip(finDate2.domNode);
		 		dj.showTooltip(displayMessage, finDate2.domNode, 0);
			}
		},
		
		/**
		 * <h4>Summary:</h4>
		 * This function is used to validate the from invoice date.	 
		 * 
		 * @method validateInvoiceDateFrom
		 */
		validateInvoiceDateFrom : function()
		{
			var invoice_date_from;
			var invoice_date_to;
			if(dj.byId("invoice_date_from"))
			{
				invoice_date_from = dj.byId("invoice_date_from");
			}
			
			if(dj.byId("invoice_date_to"))
			{
				invoice_date_to = dj.byId("invoice_date_to");
			}
			
			if ((invoice_date_to && invoice_date_to.get("value")!== null && invoice_date_from &&  invoice_date_from.get("value")!== null) && ( d.date.compare(invoice_date_to.get("value"), invoice_date_from.get("value")) < 0 ))
			{
				var finDate = dj.byId("invoice_date_from");
			 	displayMessage = misys.getLocalization("invoiceDateFromGreaterThanDateToError");
			 	//finDate.focus();	 		
			 	finDate.set("state","Error");
		 		dj.hideTooltip(finDate.domNode);
		 		dj.showTooltip(displayMessage, finDate.domNode, 0);
			}
		},
		
		/**
		 * <h4>Summary:</h4>
		 * This function is used to validate the from invoice due date.	 
		 * 
		 * @method validateInvoiceDueDateFrom
		 */
		validateInvoiceDueDateFrom : function()
		{
			var invoice_date_from;
			var invoice_date_to;
			if(dj.byId("invoice_due_date_from"))
			{
				invoice_date_from = dj.byId("invoice_due_date_from");
			}
			
			if(dj.byId("invoice_due_date_to"))
			{
				invoice_date_to = dj.byId("invoice_due_date_to");
			}
			
			if ((invoice_date_to && invoice_date_to.get("value")!== null && invoice_date_from &&  invoice_date_from.get("value")!== null) && ( d.date.compare(invoice_date_to.get("value"), invoice_date_from.get("value")) < 0 ))
			{
				var finDate = dj.byId("invoice_due_date_from");
			 	displayMessage = misys.getLocalization("invoiceDueDateFromGreaterThanDueDateToError");
			 	//finDate.focus();	 		
			 	finDate.set("state","Error");
		 		dj.hideTooltip(finDate.domNode);
		 		dj.showTooltip(displayMessage, finDate.domNode, 0);
			}
		},		
		/**
		 * <h4>Summary:</h4>
		 * This function is used to validate the to invoice due date.	 
		 * 
		 * @method validateInvoiceDueDateTo
		 */
		validateInvoiceDueDateTo : function()
		{
			var invoice_date_from;
			var invoice_date_to;
			if(dj.byId("invoice_due_date_from"))
			{
				invoice_date_from = dj.byId("invoice_due_date_from");
			}
			
			if(dj.byId("invoice_due_date_to"))
			{
				invoice_date_to = dj.byId("invoice_due_date_to");
			}
			
			if ((invoice_date_to && invoice_date_to.get("value")!== null && invoice_date_from &&  invoice_date_from.get("value")!== null) && ( d.date.compare(invoice_date_to.get("value"), invoice_date_from.get("value")) < 0 ))
			{
				var finDate2 = dj.byId("invoice_due_date_to");
			 	displayMessage = misys.getLocalization("invoiceDueDateToGreaterThanDueDateFromError");
			 	//finDate2.focus();	 		
			 	finDate2.set("state","Error");
		 		dj.hideTooltip(finDate2.domNode);
		 		dj.showTooltip(displayMessage, finDate2.domNode, 0);
			}
		},
		/**
		 * <h4>Summary:</h4>
		 * This function is used to validate the due date from.	 
		 * 
		 * @method _validateDueDateFrom
		 */
		repayValidateDueDateFrom : function() 
		{
			var invoice_date_from;
			var invoice_date_to;

			if(dj.byId("fin_due_date"))
			{
				due_date_from = dj.byId("fin_due_date");
			}
			
			if(dj.byId("fin_due_date2"))
			{
				due_date_to = dj.byId("fin_due_date2");
			}
			
			if ((due_date_to && due_date_to.get("value")!== null && due_date_from && due_date_from.get("value")!== null) && (d.date.compare(due_date_from.get("value"), due_date_to.get("value")) > 0 ))
			{			
				var dueDate = dj.byId("fin_due_date");
			 	displayMessage = misys.getLocalization("FinanceDueDateFromLesserThanFinanceDueDateTo");
		 		//dueDate.focus();	 		
		 		dueDate.set("state","Error");
		 		dj.hideTooltip(dueDate.domNode);
		 		dj.showTooltip(displayMessage, dueDate.domNode, 0);
			}					
		},

		/**
		 * <h4>Summary:</h4>
		 * This function is used to validate the due date to.	 
		 * 
		 * @method _validateDueDateTo
		 */
		repayValidateDueDateTo : function()
		{
			var invoice_date_from;
			var invoice_date_to;

			if(dj.byId("fin_due_date"))
			{
				due_date_from = dj.byId("fin_due_date");
			}
			
			if(dj.byId("fin_due_date2"))
			{
				due_date_to = dj.byId("fin_due_date2");
			}		
			if ((due_date_to && due_date_to.get("value")!== null && due_date_from && due_date_from.get("value")!== null) && ( d.date.compare(due_date_to.get("value"), due_date_from.get("value")) < 0 ))
			{			
				var dueDate2 = dj.byId("fin_due_date2");
			 	displayMessage = misys.getLocalization("FinanceDueDateToGreaterThanFinanceDueDateFrom");
			 	//dueDate2.focus();	 		
			 	dueDate2.set("state","Error");
		 		dj.hideTooltip(dueDate2.domNode);
		 		dj.showTooltip(displayMessage, dueDate2.domNode, 0);
			}				
		},
		
		/**
		 * <h4>Summary:</h4>
		 * This function is used to validate the invoice date from.	 
		 * 
		 * @method _validateInvoiceDateFrom
		 */
		repayValidateFinanceInvoiceDateFrom : function()
		{
			var invoice_date_from;
			var invoice_date_to;

			if(dj.byId("fin_date"))
			{
				invoice_date_from = dj.byId("fin_date");
			}
			
			if(dj.byId("fin_date2"))
			{
				invoice_date_to = dj.byId("fin_date2");
			}
			
			if ((invoice_date_to && invoice_date_to.get("value")!== null && invoice_date_from && invoice_date_from.get("value")!== null) && (d.date.compare(invoice_date_from.get("value"), invoice_date_to.get("value")) > 0 ))
			{			
				var finDate = dj.byId("fin_date");
			 	displayMessage = misys.getLocalization("FinanceIssueDateFromLesserThanFinanceIssueDateTo");
			 	//finDate.focus();	 		
			 	finDate.set("state","Error");
		 		dj.hideTooltip(finDate.domNode);
		 		dj.showTooltip(displayMessage, finDate.domNode, 0);		 		
			}			
		},
		
		/**
		 * <h4>Summary:</h4>
		 * This function is used to validate the invoice date to.	 
		 * 
		 * @method _validateInvoiceDateTo
		 */
		repayValidateFinanceInvoiceDateTo : function() 
		{
			var invoice_date_from;
			var invoice_date_to;

			if(dj.byId("fin_date"))
			{
				invoice_date_from = dj.byId("fin_date");
			}
			
			if(dj.byId("fin_date2"))
			{
				invoice_date_to = dj.byId("fin_date2");
			}
		
			if ((invoice_date_to && invoice_date_to.get("value")!== null && invoice_date_from && invoice_date_from.get("value")!== null) && ( d.date.compare(invoice_date_to.get("value"), invoice_date_from.get("value")) < 0 ))
			{			
				var finDate2 = dj.byId("fin_date2");
			 	displayMessage = misys.getLocalization("FinanceIssueDateToGreaterThanFinanceIssueDateFrom");
			 	//finDate2.focus();	 		
			 	finDate2.set("state","Error");
		 		dj.hideTooltip(finDate2.domNode);
		 		dj.showTooltip(displayMessage, finDate2.domNode, 0);		 		
			}			
		},
		
		setRepaymentCurrency : function (node, arr, constraints) {
	//  summary:
//	        Set the currency of a set of amount fields
//		description:
//			  This function takes two parameters - a node (or id) of a Dijit containing
//			  a currency code, and a single ID or array of IDs for fields on which this
//			  currency should be set as a constraint

			var currencyField = dj.byId(node),
					targetFieldIds = d.isArray(arr) ? arr : [arr],
					currency, field, cldrMonetary;
			
			if(currencyField && currencyField.get("value") !== "" &&
						currencyField.state !== "Error") {
				currency = currencyField.get("value");
				d.forEach(targetFieldIds, function(id){
						field  = dj.byId(id);
						if(field){
							console.debug("[misys.form.common] Setting currency code", currency, 
											"on field", id);
							cldrMonetary = d.cldr.monetary.getData(currency);						
							
							//Client specific (FIX ME : Need to find a solution to override common 
							//function's for client specific requirement)
							var monetaryConst = {round: cldrMonetary.round, 
												places: cldrMonetary.places,
												max:999999999999.99,
												min: 0.01};
							
							if(cldrMonetary.places === 2)
							{
								monetaryConst = {
									round: cldrMonetary.round,
									places: cldrMonetary.places,
									min:0.00,
									max:999999999999.99
								};
							}
							else if(cldrMonetary.places === 3)
							{
								monetaryConst = {
									round: cldrMonetary.round,
									places: cldrMonetary.places,
									min:0.000,
									max:999999999999.999
								};
							}
							else if(cldrMonetary.places === 0)
							{
								monetaryConst = {
									round: cldrMonetary.round,
									places: cldrMonetary.places,
									min:0,
									max:9999999999999
								};
							}
						
							// Mixin any provided constraints
							d.mixin(monetaryConst, constraints);
						
							field.set("constraints", monetaryConst);
							field.set("value",field.get("value"));
						}
					});
				}
			},
			/**
			 * <h4>Summary:</h4>
			 * This function is used to validate the invoice date from.	 
			 * 
			 * @method collectionValidateInvoiceDateFrom
			 */
			collectionValidateInvoiceDateFrom : function()
			{
				console.debug("Start Execute collectionValidateInvoiceDateFrom");
				if (this.get("value") === null) {
					return true;
				}
				console.debug("[Validate] Validating Issue From Date. Value = "+ this.get("value"));
				var creationToDate = dj.byId("iss_date2");
				if (!m.compareDateFields(this, creationToDate)) {
					var widget = dj.byId("iss_date");
						displayMessage = misys.getLocalization("InvoiceIssueDateFromLesserThanInvoiceIssueDateTo");
						widget.focus();
						widget.set("state","Error");
						dj.hideTooltip(widget.domNode);
						dj.showTooltip(displayMessage, widget.domNode, 0);
				}
				console.debug("End collectionValidateInvoiceDateFrom");
				return true;
			},		
			
			/**
			 * <h4>Summary:</h4>
			 * This function is used to validate the invoice date to.	 
			 * 
			 * @method collectionValidateInvoiceDateTo
			 */
			collectionValidateInvoiceDateTo : function() 
			{
				console.debug("Start Execute collectionValidateInvoiceDateTo");
				if (this.get("value") === null) {
					return true;
				}
				console.debug("[Validate] Validating Creation To Date. Value = "+ this.get("value"));
				var creationFromDate = dj.byId("iss_date");
				if (!m.compareDateFields(creationFromDate, this)) {
					var widget = dj.byId("iss_date2");
					  	displayMessage = misys.getLocalization("InvoiceIssueDateToGreaterThanInvoiceIssueDateFrom");
				 		widget.focus();
				 		widget.set("state","Error");
				 		dj.hideTooltip(widget.domNode);
				 		dj.showTooltip(displayMessage, widget.domNode, 0);
				 	return false;		
				}
				console.debug("End collectionValidateInvoiceDateTo");
				return true;
				
			},
			
				/**
			 * <h4>Summary:</h4>
			 * This function is used to validate the due date from.	 
			 * 
			 * @method collectionValidateDueDateFrom
			 */
			collectionValidateDueDateFrom : function() 
			{
				console.debug("Start Execute collectionValidateDueDateFrom");

				if (this.get("value") === null) {
					return true;
				}
				console.debug("[Validate] Validating Maturity From Date. Value = "+ this.get("value"));
				var maturityToDate = dj.byId("due_date2");
				if (!m.compareDateFields(this, maturityToDate)) {
					var widget = dj.byId("due_date"),
					    displayMessage = misys.getLocalization("InvoiceDueDateFromGreaterThanInvoiceDueDateTo");
				 		widget.focus();
				 		widget.set("state","Error");
				 		dj.hideTooltip(widget.domNode);
				 		dj.showTooltip(displayMessage, widget.domNode, 0);
				 		dj.showTooltip(displayMessage,
							domNode, 0);
				 		return false;
				}
				console.debug("End collectionValidateDueDateFrom");
				return true;
			},

			/**
			 * <h4>Summary:</h4>
			 * This function is used to validate the due date to.	 
			 * 
			 * @method collectionValidateDueDateTo
			 */
			collectionValidateDueDateTo : function()
			{
				console.debug("Start Execute collectionValidateDueDateTo");
				if (this.get("value") === null) {
					return true;
				}
				console.debug("[Validate] Validating Maturity To Date. Value = "+ this.get("value"));
				// Test that the last shipment date is greater than or equal to
				// the application date
				var maturityFromDate = dj.byId("due_date");
				if (!m.compareDateFields(maturityFromDate, this)) {
					var widget = dj.byId("due_date2");
					 	displayMessage = misys.getLocalization("InvoiceDueDateToLesserThanInvoiceDueDateFrom");
				 		widget.focus();
				 		widget.set("state","Error");
				 		dj.hideTooltip(widget.domNode);
				 		dj.showTooltip(displayMessage, widget.domNode, 0);
				}
				console.debug("End collectionValidateDueDateTo");
				return true;
			},
			/**
			 * <h4>Summary:</h4>
			 * This function is used to set Invoice Settlement Percentage.	 
			 * 
			 * @method setSettlementPercentage
			 */
			setSettlementPercentage : function () 
			{
				console.debug("Start Execute setSettlementPercentage");
				
				var invoiceAmt = dj.byId("collections_amt").value;
				var percentage = dj.byId("settlement_percentage").value;
				var settleAmt = ( percentage/100 ) * invoiceAmt;
				
				dj.byId("settlement_amt").set("value", settleAmt);	
				
				console.debug("End setSettlementPercentage");
			},
			/**
			 * <h4>Summary:</h4>
			 * This function is used to set Invoice Settlement Amount .	 
			 * 
			 * @method setSettlementPercentage
			 */
			setSettlementAmt : function () 
			{
				console.debug("Start Execute setSettlementAmt");
				
				var invoiceAmt = dj.byId("collections_amt").value;
				var settlementAmt = dj.byId("settlement_amt").value;
				var percentage = ( settlementAmt * 100 ) /invoiceAmt;
				
				dj.byId("settlement_percentage").set("value", percentage);	
				
				console.debug("End setSettlementPercentage");
			},
			/**
			 * <h4>Summary:</h4>
			 * This function is used to set Invoice Settlement Amount and Currency Code.	 
			 * 
			 * @method setSettlementAmtAndCurCode
			 */
			setSettlementAmtAndCurCode : function() 
			{			
				console.debug("Start Execute setSettlementAmtAndCurCode");
				var settleAmt = dj.byId("settlement_amt");
				var percentage = dj.byId("settlement_percentage");
								
				if (settleAmt.value === 0)
				{
					misys.dialog.show("ERROR", misys.getLocalization("settlementAmtCantBeZero"));
					settleAmt.set("value",'');				
				}
				else if(dj.byId("settlement_amt").displayedValue === "") 
				{
					percentage.attr("disabled", false);
				}	
				console.debug("End setSettlementAmtAndCurCode");
			},
			/**
			 * <h4>Summary:</h4>
			 * This function is used to set Invoice Settlement Currency Code.	 
			 * 
			 * @method setSettlementCurrency
			 */
			setSettlementCurrency : function (node, arr, constraints) {
				//  summary:
//				        Set the currency of a set of amount fields
//					description:
//						  This function takes two parameters - a node (or id) of a Dijit containing
//						  a currency code, and a single ID or array of IDs for fields on which this
//						  currency should be set as a constraint
				console.debug("Start Execute setSettlementCurrency");
						var currencyField = dj.byId(node),
								targetFieldIds = d.isArray(arr) ? arr : [arr],
								currency, field, cldrMonetary;
						
						if(currencyField && currencyField.get("value") !== "" &&
									currencyField.state !== "Error") {
							currency = currencyField.get("value");
							d.forEach(targetFieldIds, function(id){
									field  = dj.byId(id);
									if(field){
										console.debug("[misys.form.common] Setting currency code", currency, 
														"on field", id);
										cldrMonetary = d.cldr.monetary.getData(currency);						
										
										//Client specific (FIX ME : Need to find a solution to override common 
										//function's for client specific requirement)
										var monetaryConst = {round: cldrMonetary.round, 
															places: cldrMonetary.places,
															max:999999999999.99,
															min: 0.01};
										
										if(cldrMonetary.places === 2)
										{
											monetaryConst = {
												round: cldrMonetary.round,
												places: cldrMonetary.places,
												min:0.00,
												max:999999999999.99
											};
										}
										else if(cldrMonetary.places === 3)
										{
											monetaryConst = {
												round: cldrMonetary.round,
												places: cldrMonetary.places,
												min:0.000,
												max:999999999999.999
											};
										}
										else if(cldrMonetary.places === 0)
										{
											monetaryConst = {
												round: cldrMonetary.round,
												places: cldrMonetary.places,
												min:0,
												max:9999999999999
											};
										}
									
										// Mixin any provided constraints
										d.mixin(monetaryConst, constraints);
									
										field.set("constraints", monetaryConst);
										field.set("value",field.get("value"));
									}
								});
							}
						console.debug("End setSettlementCurrency");
						},
						
			/**
			 * <h4>Summary:</h4>
			 * This function is used to set Invoice Settlement Details for IP Collections.	 
			 * 
			 * @method setSettlementDetails
			 */
			setSettlementDetails : function()
			{

				console.debug("Start Execute setSettlementDetails");
				var outstandingSettlementAmt = dj.byId("liab_total_net_amt");
				var outstandingSettlementCur = dj.byId("liab_total_net_cur_code");
				var settlementAmount = dj.byId("settlement_amt");
				var settlementCur = dj.byId("settlement_cur_code");
				var settlementPercentage = dj.byId("settlement_percentage");
				var invoiceAmt = dj.byId("collections_amt");
				
				outstandingSettlementAmt.set("disabled", true);
				outstandingSettlementCur.set("disabled", true);
				settlementAmount.set("disabled", false);
				settlementPercentage.set("disabled", false);
				settlementCur.set("value", outstandingSettlementCur.value);
				settlementCur.set("disabled", true);
				m.calculateOutstandingSettlementAmt();
				console.debug("End setSettlementDetails");
			},
			/**
			 * <h4>Summary:</h4>
			 * This function is used to calculate Invoice outstanding Settlement amount Details for IP Collections.	 
			 * 
			 * @method calculateOutstandingSettlementAmt
			 */
			calculateOutstandingSettlementAmt : function()
			{
				console.debug("Start Execute calculateOutstandingSettlementAmt");
				var outstandingSettlementAmt = dj.byId("liab_total_net_amt");
				var invoiceAmount = Number(dijit.byId("collections_amt").get("value"));
				var settlementAmount = Number(dijit.byId("settlement_amt").get("value"));
				if(outstandingSettlementAmt)
				{
					outstandingSettlementAmt.set("value",invoiceAmount - (settlementAmount));
				}
				console.debug("End calculateOutstandingSettlementAmt");
			},
			/**
			 * validate Settlement date with invoice due date and invoice dates
			 */
			validateSettlementDateWithInvoiceDates : function()
			{
				if(!this.get("value")){
					return true;
				}
				console.debug("Start Execute validateSettlementDateWithInvoiceDates");

				// Test that the due date is greater than the application date
				var invoiceDueDate = dj.byId("due_date");
				if(!m.compareDateFields(this,invoiceDueDate)) {
					this.invalidMessage = m.getLocalization("settlementDateSmallerThanInvoiceDueDate",
							[_localizeDisplayDate(this),
				             _localizeDisplayDate(invoiceDueDate)]);
					return false;
				}
				var invoiceDate = dj.byId("iss_date");
				if(!m.compareDateFields(invoiceDate, this)) {
					this.invalidMessage = m.getLocalization("settlementDateGreaterThanInvoiceDate",
							[_localizeDisplayDate(this),
				             _localizeDisplayDate(invoiceDate)]);
					return false;
				}
				console.debug("End validateSettlementDateWithInvoiceDates");
				return true;
			}
		
	}); 
})(dojo, dijit, misys);