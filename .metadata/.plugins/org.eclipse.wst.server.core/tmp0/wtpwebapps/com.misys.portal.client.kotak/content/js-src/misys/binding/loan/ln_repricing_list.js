dojo.provide("misys.binding.loan.ln_repricing_list");


dojo.require("dojo.data.ItemFileReadStore");
dojo.require('dojo.data.ItemFileWriteStore');
dojo.require("dijit.form.FilteringSelect");
dojo.require("misys.form.MultiSelect");
dojo.require("dijit.layout.TabContainer");
dojo.require("misys.form.common");
dojo.require("misys.validation.common");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.CheckBox");
dojo.require("dijit.layout.ContentPane");
dojo.require("misys.form.CurrencyTextBox");
dojo.require("dijit.form.RadioButton");
dojo.require("misys.grid._base");
//dojo.require("misys.common");


(function(/*Dojo*/d, /*dj*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode
	var debugMsg = "[INFO] No deals for the borrower found.";
	
	function _validateRepricingFromDate() {
		// summary:
		// Validates the data entered for repricing from date
		// tags:
		// public, validation
		// Return true for empty values
		var that = this;
		m._config = m._config || {};
		m._config.repricingFromDateValidationInprocess = false;
		if (that.get('value') === null) {
			return true;
		}
		console.debug('[Validate] Validating Repricing From Date. Value = '+ that.get('value'));
		// Test that the last shipment date is greater than or equal to
		// the application date
		var repricingToDate = dj.byId('repricing_date2');
		if(!m._config.repricingToDateValidationInprocess)
		{
			if (!m.compareDateFields(that, repricingToDate)) {
				m._config.repricingFromDateValidationInprocess = true;
				var widget = dj.byId("repricing_date"),
			    displayMessage = misys.getLocalization('repricingFromGreaterThanRepricingTo');
				widget.focus();
				widget.set("state","Error");
		 		dj.hideTooltip(widget.domNode);
		 		dj.showTooltip(displayMessage, widget.domNode, 0);
		 		return false;
			}
		}
		m._config.repricingFromDateValidationInprocess = false;
		return true;

	}
	function _validateRepricingToDate() {

		// summary:
		// Validates the data entered for repricing to date
		// tags:
		// public, validation

		// Return true for empty values
		var that = this;
		m._config = m._config || {};
		m._config.repricingToDateValidationInprocess = false;
		if (that.get('value') === null) {
			return true;
		}
		console.debug('[Validate] Validating Repricing To Date. Value = '+ that.get('value'));
		var repricingFromDate = dj.byId('repricing_date');
		if(!m._config.repricingFromDateValidationInprocess)
		{
			if (!m.compareDateFields(repricingFromDate, that)) {
				m._config.repricingToDateValidationInprocess = true;
				var widget = dj.byId('repricing_date2'),
				displayMessage = misys.getLocalization('repricingToLesserThanRepricingFrom');
				widget.focus();
				widget.set("state","Error");
		 		dj.hideTooltip(widget.domNode);
		 		dj.showTooltip(displayMessage, widget.domNode, 0);
		 		return false;
			}
		}	
		m._config.repricingToDateValidationInprocess = false;
		return true;
	}
	
	/*
	 * This method checks and restrict the user to select a past date w.r.t CBD.
	 * @method _checkPastDatesValidation
	 */
	
	function _checkPastDatesValidation(){

		if(dj.byId("intend_notice_validation_flag"))
	  	{
				if(dj.byId("intend_notice_validation_flag").get("value")!=="Y")
				{
					if(!this.get("value")) {
							return true;
						}
						m._config = m._config || {};
						m._config.repricingDatesValidationInprocess = false;
						console.debug('[Validate] Validating Past date selection on from date field= ' + this.get('value'));
						//checks the current date
						 var currentDate = new Date();
						 var repricingToDate2 = dj.byId('repricing_date2');
						 if(!m._config.repricingDatesValidationInprocess)
							{
								 var isValid = d.date.compare(currentDate,m.localizeDate(this),"date") >0 ? false : true;
								 //restrict user to select past dates w.r.t CBD.
								 if(!isValid)
								{
									m._config.repricingDatesValidationInprocess = true;
									var localizedDateToday = d.date.locale.format(new Date(), {
										selector :"date"
									});
									 this.invalidMessage = m.getLocalization("repricingPastDateCheckError",[localizedDateToday]);
										 return false;
								}
								 //checks the fromdate is smaller or equals to todate.
								 else if(!m.compareDateFields(this,repricingToDate2))
									 {
									 		m._config.repricingDatesValidationInprocess = true;
									 		 this.invalidMessage = m.getLocalization("repricingFromToDateCompareCheckError");
											 return false;
			
									 }
							}
						m._config.repricingDatesValidationInprocess = false;
						return true;
				}
	  	}
	}
	
	
	
	
	
	function _checkPastDatesBasedOnIntendNoticeValidation(){
		
		if(dj.byId("intend_notice_validation_flag"))
	  	{
				if(dj.byId("intend_notice_validation_flag").get("value")==="Y")
				{
						if(!this.get("value")) {
								return true;
							}
							m._config = m._config || {};
							m._config.repricingDatesValidationInprocess = false;
							console.debug('[Validate] Validating Past date selection on from date field= ' + this.get('value'));
							//checks the current date
							 var currentDate = new Date();
							 var repricingToDate2 = dj.byId('repricing_to_date_field');
							 var pricingOptionValue = dj.byId('facility_pricing_option');
							 var currencyValue = dj.byId('deal_currency');
							 if(!m._config.repricingDatesValidationInprocess)
								{
									 //checks the fromdate is smaller or equals to todate.
									if(!m.compareDateFields(repricingToDate2,this))
										 {
										 		m._config.repricingDatesValidationInprocess = true;
										 		
										 		this.invalidMessage = m.getLocalization("intendNoticeDaysErrorMsg", [ pricingOptionValue.get("value"),currencyValue.get("value"),
										 		                                                  								_localizeDisplayDate(repricingToDate2)]);
										 	
												 return false;
				
										 }
								}
							m._config.repricingDatesValidationInprocess = false;
							return true;
				}
	  	}
	}
	
	/*
	 * This method checks whether the to date is greater than from date.
	 * @method _checkToDatesValidation
	 */
	
	function _checkToDatesValidation(){
		
					console.debug('[Validate] Validating Repricing To Date. Value = '+ this.get('value'));
					var repricingFromDate = dj.byId('repricing_date');
					var rep=m.compareDateFields(repricingFromDate, this);
						if (!m.compareDateFields(repricingFromDate, this))
						{
							 this.invalidMessage = m.getLocalization("repricingFromToDateCheckError");
							 return false;
						}
					return true;
	}

	/*
	 * This method sets the default value for repricing date fields,for from date its CBD
	 * and for to date is CBD month+1.
	 * @method _setDefaultDates
	 */
	function _setDefaultDates(){

		var currentDate = new Date();
		var repriceFromDate = dj.byId('repricing_date');
	
		var month = currentDate.getMonth();
		var year = currentDate.getFullYear(); 
		var day = currentDate.getDate();
		var toDate=new  Date(year, month + 1, day-1);
		var repriceToDate = dj.byId('repricing_date2');
		repriceToDate.set("value",toDate);	
		repriceFromDate.set("value",currentDate);
	
		
	}
	
	
	/**
	 * This method disable the date search on loading of page 
	 * @method _disableDateFieldOnFormLoad
	 */
	
	function _disableDateFieldOnFormLoad(){
		
		var repriceFromDate = dj.byId('repricing_date');
		var repriceToDate = dj.byId('repricing_date2');
		
		repriceFromDate.set("disabled",true);
		repriceToDate.set("disabled",true);
	}
	
	
function _localizeDisplayDate( /*dijit._Widget*/ dateField) {
		
		if(dateField.get("type") === "hidden") {
			return d.date.locale.format(m.localizeDate(dateField), {
				selector :"date"
			});
		}
		
		return dateField.get("displayedValue");
	}
	
	/*
	 * Makes the call and fetch the store response for deals.
	 * @method _getBorrowerDeals
	 */
	function _getIntendNoticeCountBasedOnPricingOption()
	{
		var borrowerid =  dj.byId("borrowerid").get("value");
		var dealId =  dj.byId("bo_deal_id").get("value");
		var facilityWidget = dijit.byId('bo_facility_id');
		//console.debug('[Loan Drawdown] Checking for Borrower deals');
		if(facilityWidget && facilityWidget.get("value") != ''){
		m.xhrPost({
			url : m.getServletURL("/screen/AjaxScreen/action/GetPricingOptionsIntendNoticeDays"),
			handleAs : "json",
			sync : true,
			content : {
				borrowerid : borrowerid,
				dealId : dealId
			},				
			load : function(response)
			{
				console.log("success");
				misys._config.pricingOption = response;
			},
			error : function(response) 
		    {
				console.log("error");
		    	console.debug(debugMsg);
		    			
		    }		    
		});
		}
	}
	
	/*
	 * Makes the call and validate intend and business days.
	 * @method _getBusinessDayValidated
	 */
	function _getBusinessDayValidated()
	{
		var boFacilityId =  dj.byId("bo_facility_id").get("value");
		var currency = dj.byId("deal_currency").get("value");
		var dealId = dj.byId("bo_deal_id").get("value");
		var isRepricingDate = 'N';
		var pricingOptionValue = dijit.byId('facility_pricing_option').get('value');
		var repriceDateFrom = dj.byId('repricing_date');
		var toDateField = dj.byId('repricing_date2');
		var toDateHiddenField = dj.byId('repricing_to_date_field');
		var operation = dj.byId('operation').get('value');
		
		if(currency != ""){
				m.xhrPost({
					url : m.getServletURL("/screen/AjaxScreen/action/GetBusinessDayValidatedDate"),
					handleAs : "json",
					preventCache : true,
					sync : true,
					content : {
						dealId : dealId,
						boFacilityId : boFacilityId,
						pricingOptionName : pricingOptionValue,
						dateToValidate : repriceDateFrom.get("displayedValue"),
						currency : currency,
						isRepricingDate : isRepricingDate,
						operation : operation
					},				
					load : function(response)
					{
						console.log("success");
						misys._config.dateValuesResponse = response;
						var businessDateValues = misys._config.dateValuesResponse["items"];
						repriceDateFrom.store = new dojo.data.ItemFileReadStore(
								 {
									 data :
									 {
									 	 identifier : "id",
										 label : "name",
										 items : businessDateValues['dateValues']
									 }
								 });
					
						var storeSize = 0;
						var getSize = function(size, request){
										storeSize = size;
									};
						repriceDateFrom.get('store').fetch({query: {}, onBegin: getSize, start: 0, count: 0});
						if(storeSize!==0){
						var dateResponse=repriceDateFrom.store._arrayOfTopLevelItems[0].name[0];
						if(dateResponse !=""){
						var darr = dateResponse.split("/");
						var dateObject = new Date(parseInt(darr[2],10),parseInt(darr[1],10)-1,parseInt(darr[0],10));
						var month = dateObject.getMonth();
						var year = dateObject.getFullYear(); 
						var day = dateObject.getDate();
						var toDate=new  Date(year, month+1, day);
						if(!toDateHiddenField.get("value")){
							toDateHiddenField.set("value",dateObject);
						}
						if(repriceDateFrom.get("value") && !m.compareDateFields(toDateHiddenField,repriceDateFrom)){
							this.invalidMessage = m.getLocalization("intendNoticeDaysErrorMsg", [ pricingOptionValue ,currency,
			 		                                                  								_localizeDisplayDate(toDateHiddenField)]);
						}
						else if(repriceDateFrom.get("value") && (dateObject>repriceDateFrom.get("value") || dateObject<repriceDateFrom.get("value")))
						{
							var displayMessage = m.getLocalization("repricingDateBusinessDayValidationErrorMsg", [ repriceDateFrom.get("displayedValue") ]);
							m.dialog.show('CUSTOM-NO-CANCEL',displayMessage,"Info");
							repriceDateFrom.set('value',dateObject);
						}
						
						else{
							repriceDateFrom.set('value',dateObject);
							toDateField.set("value",toDate);
							repriceDateFrom.set("disabled",false);
							toDateField.set("disabled",false);
						 }
						}else{
							repriceDateFrom.set("disabled",true);
							toDateField.set("disabled",true);
						}
						}	
						
					},
					error : function(response) 
				    {
						console.log("error");
				    	console.debug(debugMsg);
				    			
				    }		    
				});
				}
	}
	
	
	
	d.mixin(m, {
		bind : function() {

//			// validate the repricing date search fields
//			m.connect("repricing_date", "onBlur", _validateRepricingFromDate);
//			m.connect("repricing_date2", "onBlur", _validateRepricingToDate);
		},

		processRepricingOfRecords : function( /*Dojox Grid*/ grid) {
			
			var targetNode = d.byId("batchContainer"), 
			items = grid.selection.getSelected(),
			strListKeys = "",
			intNbKeys = 0,
			reference, xhr,
			isValid = true;
			var hasAutoRollOverLoans =false;
			var blockedFacilities = [];
			var repricingDates = [];
			var isFacilityMatured = false;
			var errorMsg;
			//var isRepricingLoansHasSameFacCurrency=false; //Removed as part of MPS-42557
			
			m.animate("wipeOut", targetNode);
			
			var repriceOption=	dj.byId('repriceOption').get('value');
			
			var borrower_id = dj.byId("borrowerid") ? dj.byId("borrowerid").get("value")  : "";
			var deal_id =  dj.byId("bo_deal_id") ? dj.byId("bo_deal_id").get("value"): "";
			var facility_id = dj.byId("bo_facility_id") ? dj.byId("bo_facility_id").get("value"): "";
			var currency = dj.byId("deal_currency") ? dj.byId("deal_currency").get("value"): "";
			
			var pricingOptionStore = misys._config.pricingOption["items"];
			var facilityStore = JSON.stringify(pricingOptionStore['facilityStore']);
			
			if(items.length===0){
				m.dialog.show("ERROR",m.getLocalization("selectLoanForRepricingError"));
			}
			
			if(items.length) 
			{
				// Iterate through the list of selected items.
				d.forEach(items, function(selectedItem) {
					// extract the reference
					reference = grid.store.getValues(selectedItem, "box_ref");
					var accessType=grid.store.getValues(selectedItem, "ln_access_type");
					var facilityName=grid.store.getValues(selectedItem, "bo_facility_name");					
					
					var repricingDate= grid.store.getValues(selectedItem, "repricing_date");
					if(accessType[0] !== "A"){
						if(!(blockedFacilities.indexOf(facilityName[0])>-1)){
							blockedFacilities.push(facilityName[0]);
						} 					
					}
					
					if(repricingDate !== ""){
						repricingDates.push(repricingDate[0]);
					}
					// separator
					if("S" + strListKeys != "S"){ strListKeys = strListKeys + ",";}
					strListKeys = strListKeys + reference;
					intNbKeys++;
				}); // end forEach
				
				
				for(var j = 1; j < repricingDates.length ; j++){
					if(repricingDates[j-1] !== repricingDates[j]){
						m.dialog.show('ERROR',m.getLocalization("repringingdatesnotsame"));
						return;	
					}
				}
				if(blockedFacilities.length>0){
					
					var facilites="";
					for (var i = 0; i < blockedFacilities.length; i++) {						
						facilites=facilites+blockedFacilities[i]+",";
					}
					var invalidMessage1 = misys.getLocalization('repricingListfacilityBlockError',[facilites.substring(0, facilites.length-1)]);	
					
					m.dialog.show('ERROR',invalidMessage1);
					
					return;					
				}
				
				m.xhrPost({
					url : m.getServletURL("/screen/AjaxScreen/action/ValidateRepricingCurrency"),
					handleAs : "json",
					preventCache : true,
					sync : true,
					content: {
						borrowerid:borrower_id,
						facilityid:facility_id,
						currency:currency
						},
					load : function(response, args){
						isValid = response.isValid;
					},
					error : function(response, args){
						isValid = false;
						m.dialog.show("ERROR", m.getLocalization("technicalError"));
						console.error(" processRepricingOfRecord error", response);
					}
				});
				if(!isValid)
				{
					m.dialog.show("ERROR", m.getLocalization("currencyValidationError"));
					return;
				}
				
				//checks for simple rollover condition
				if(intNbKeys > 0)
				{
				    if(intNbKeys>1 && repriceOption.localeCompare("simple")===0){
						
						m.dialog.show("ERROR",m.getLocalization("repricingSimpleRollOverTransactionsError"));
						
					}
				    else{
					
					m.xhrPost({
						url : m.getServletURL("/screen/AjaxScreen/action/ValidateRepricingBatchCriteria"),
						handleAs : "json",
						preventCache : true,
						sync : true,
						content: {
							list_keys: strListKeys,
							borrowerid:borrower_id,
							deal_id:deal_id,
							facilitydata:facilityStore
							},
						load : function(response, args){
							isValid = response.isValid;
							hasAutoRollOverLoans=response.hasAutoRollOverLoans;
							isFacilityMatured=response.isFacilityMatured;
							errorMsg=response.errorMsg;
							//isRepricingLoansHasSameFacCurrency=response.isRepricingLoansHasSameFacCurrency;
						},
						error : function(response, args){
							console.error(" processRepricingOfRecords error", response);
						}
					});
				
					if(!isValid)
					{
						m.dialog.show("ERROR",m.getLocalization("repricingBatchTransactionsError"));
					}
					else if(isFacilityMatured){
						m.dialog.show("ERROR", errorMsg);
					}
					else
					{ 	
						/*if(!isRepricingLoansHasSameFacCurrency){
							m.dialog.show("ERROR",m.getLocalization("repricingDiffFacilityCurrencyMsg"));
						}else{*/
							if(hasAutoRollOverLoans){							
								_checkRepricingAutoRollOver(strListKeys);
								
							}else{
								initiateRepricing(strListKeys);
							}
						//}
					}
				  }
					
				}
			}
		}
	});
	
	function initiateRepricing(strListKeys){
		
		if(dj.byId('repriceOption').get('value')==="new"){
			var pricingOptionStore = misys._config.pricingOption["items"];
			// TODO: Open up the repricing screen
			var params = [
							{name:'list_keys',value:strListKeys},
							{name:'borrowerid',value:dj.byId('borrowerid').get('value')},
							{name:'operation',value:'NEW_REPRICING'},
							{name:'mode',value:dj.byId('repriceOption').get('value')},
							{name:'tnxtype',value:'01'},
							{name:'facilityStore', value:JSON.stringify(pricingOptionStore['facilityStore'])}
					];
					
					var initiateParams = {
							action : m.getServletURL("/screen/LoanScreen"),
							params: params
						};
					m.post(initiateParams);
			}else{
				m.dialog.show("ERROR",m.getLocalization("repriceOptionsWarning",[dj.byId('repriceOption').get('displayedValue')]));
				
			}
	}
	
	
	d.mixin(m, {
		bind : function() {
					
		},
		_cancelSubmit : function() {
			
			var cancelButtonURL = ["/screen/LoanScreen?tnxtype=01", "&operation=LIST_REPRICING"];
			window.location.href = misys.getServletURL(cancelButtonURL.join(""));
					
		}
	});

	/*
	 * Makes the call and fetch the store response for deals.
	 * @method _getBorrowerDeals
	 */
	function _getBorrowerDeals(widget)
	{
		var borrowerid = dj.byId(widget) ? dj.byId(widget).get("value")  : "";
		
		console.debug('[Loan Drawdown] Checking for Borrower deals');
		m.xhrPost({
			url : m.getServletURL("/screen/AjaxScreen/action/GetBorrowerDealsAndFacilitiesForRepricing"),
			handleAs : "json",
			sync : true,
			content : {
				borrowerid : borrowerid
			},				
			load : function(response)
			{
				console.log("success");
				misys._config.facilityListResponse = response;
				
				_populateDealsDropDown();
				
			},
			error : function(response) 
		    {
				console.log("error");
		    	console.debug(debugMsg);
		    	
		    	var displayMessage = m.getLocalization('requiredToolTip');		
				var hideTT = function() {
					dj.hideTooltip(dj.byId("bo_deal_id").domNode);
				};
				dj.showTooltip(displayMessage, dj.byId("bo_deal_id").domNode, 0);
	 		   // dijit.byId('submitButton').set('disabled', true);
		 		setTimeout(hideTT, 5000);	
			
		    }		    
		});
	}
	
	

	/**
	 * method fetches the deals  and renders on a deal dropdown.
	 * @method _populateDealsDropDown
	 */
	
	function _populateDealsDropDown() 
	{	
		var borrowerid = dj.byId("borrowerid") ? dj.byId("borrowerid").get("value")  : "";
		if(borrowerid !== " "){
			var dealName = dijit.byId("bo_deal_id");
			// clear
			dealName.set('value', '');
			dealName.set("state", "");
			
			var dealsDropDown = misys._config.facilityListResponse["items"];	
			
			// get associated store
			if(dealsDropDown)
			{
			  dealName.store = new dojo.data.ItemFileReadStore(
					 {
						 data :
						 {
						 	 identifier : "id",
							 label : "name",
							 items : dealsDropDown['dealNames']
						 }
					 });
			}
			
			var storeSize = 0;
			var getSize = function(size, request){
							storeSize = size;
						};
	
			dealName.get('store').fetch({query: {}, onBegin: getSize, start: 0, count: 0});
				
			//if there is no deals found in Loan IQ show a tooltip on borrower reference text box
			if(storeSize === 0)
			{
				//MPS-44804 - Remove the previously populated data by clearing grid content 
				dojo.query(".dojoxGridContent").forEach(function(node, index, nodelist){
				    // for each node in the array returned by dojo.query,
				    // execute the following code
					dojo.empty(node);
				});
				//Reset the grid height & width to 0
				dojo.query(".dojoxGridContent").style({
			         height:"0px",
			         width:"0px"
				});
				var displayMessage = m.getLocalization('noActiveLoans',[borrowerid]);	
				m.dialog.show('CUSTOM-NO-CANCEL',displayMessage,"Info");
	//			var displayMessage = m.getLocalization('requiredToolTip');		
	//			var hideTT = function() {
	//				dj.hideTooltip(dj.byId("bo_deal_name").domNode);
	//			};
	//			dj.showTooltip(displayMessage, dj.byId("bo_deal_name").domNode, 0);
	// 			setTimeout(hideTT, 5000);		
			}
			else
			{
				dealName.set('disabled', false);
			//	dijit.byId('submitButton').set('disabled', false);
			}
			
			if((storeSize === 1 && dealName.store && dealName.store._arrayOfTopLevelItems.length) || (m.getLocalization('loanBorrowerReferenceDefault') === "true" && storeSize !== 0)) 
			{
				
				// Default the deal - if the drop-down contains only one deal item or "loanBorrowerReferenceDefault" flag is set to true
				dealName.set('value', dealName.store._arrayOfTopLevelItems[0].name[0]);
				dealName.set('displayedValue', dealName.store._arrayOfTopLevelItems[0].name[0]);
			}
		}

	}
	
	/**
	 * method fetches the facility level currencies and renders on a currency dropdown.
	 * @method _populateCurrencyDropDown
	 */

	
	function _populateCurrencyDropDown()
	{ 
		//var dealNamevalue = dj.byId(widget) ? dj.byId(widget).get("value")  : "";
		//var dealNamevalue = this.get("value");
		var dealNamevalue = dijit.byId("bo_deal_id").get("value");
		var dealCurrency = dj.byId("deal_currency");
		if(dealCurrency.get("value").length>1)
		{
			dealCurrency.set('value', '');
		//	dealCurrency.set("state", "");
		}
		
		var facilitiesStore = misys._config.facilityListResponse["items"];
		var facilitiesCurrency = facilitiesStore['currency'];
		var store;
		
		if(facilitiesStore && dealNamevalue !== "")
		{
			 store = new dojo.data.ItemFileReadStore(
					 {
						 data :
						 {
						 	 identifier : "id",
							 label : "name",
							 items : facilitiesCurrency[dealNamevalue]
						 }
					 });							
		}
				//set the store in currency dropdown
			dealCurrency.set('store', store);
	}
	
	
	/**
	 * method fetches the facilities w.r.t to the deal.
	 * @method _populateFacilityDropDown
	 */

	function _populateFacilityDropDown()
	{ 
		
		var dealNamevalue = dj.byId("bo_deal_id").get("value");
		var dealFacility = dj.byId("bo_facility_id");
		
		if(dealFacility.get("value").length>1)
		{
			dj.byId("bo_facility_id").set('value', '');
			dj.byId("bo_facility_id").set('displayedValue', '');
			dealFacility.set("required",false);
	
	   	}
		var facilitiesStore = misys._config.facilityListResponse["items"];
		var dealFacilityStore= facilitiesStore['facilities'];
		var store;
		
		if(facilitiesStore && dealNamevalue !== "")
		{
			 store = new dojo.data.ItemFileReadStore(
					 {
						 data :
						 {
						 	 identifier : "id",
							 label : "name",
							 items : dealFacilityStore[dealNamevalue]
						 }
					 });							
		}
		var storeSize = 0;
		
		//set the store in currency dropdown
		dealFacility.set('store', store);
		
		//set blank date field
		var repriceFromDate = dj.byId('repricing_date');
		var repriceToDate = dj.byId('repricing_date2');
		repriceFromDate.set('value', '');
		repriceFromDate.set('displayedValue', '');
		repriceFromDate.set('disabled', true);
		repriceToDate.set('value', '');
		repriceToDate.set('displayedValue', '');
		repriceToDate.set('disabled', true);
	
	}
	
	/**
	 * method make  the pricing options field non manadatory.
	 * @method _makeNonMandatoryPricingOptionField
	 */
	
	function _makeNonMandatoryPricingOptionField(){
		var pricingOptionField = dj.byId("facility_pricing_option");
		pricingOptionField.set("required",false);
		
	}
	
	/**
	 * method fetches the pricing options w.r.t to the facilities.
	 * @method _populateFacilityPricingOptions
	 */
	
	function _populateFacilityPricingOptions(){
		var dealFacility = dj.byId("bo_facility_id");
		 dealFacility.set("required",false);
		var facilityNamevalue = dealFacility.get("value");
		var dealNamevalue = dj.byId("bo_deal_id").get("value");
		var facilityPricingOptions = dj.byId("facility_pricing_option");
		if(facilityPricingOptions.get("value").length>1)
		{
			facilityPricingOptions.set('value', '');
			facilityPricingOptions.set("required",false);
		}
		
		var facilitiesStore = misys._config.facilityListResponse["items"];
		var dealPricingOptionsStore= facilitiesStore['facilityPricingOptions'];
		var store;
		
		if(facilitiesStore && facilityNamevalue !== "")
		{
			 store = new dojo.data.ItemFileReadStore(
					 {
						 data :
						 {
						 	 identifier : "id",
							 label : "name",
							 items : dealPricingOptionsStore[dealNamevalue][facilityNamevalue]
						 }
					 });							
		}
		facilityPricingOptions.set('store', store);	
		
		if(facilityNamevalue<=1)
		{		
			_populatePricingOptionDropDown();
		}
		
		//set blank date field
		var repriceFromDate = dj.byId('repricing_date');
		var repriceToDate = dj.byId('repricing_date2');
		repriceFromDate.set('value', '');
		repriceFromDate.set('displayedValue', '');
		repriceFromDate.set('disabled', true);
		repriceToDate.set('value', '');
		repriceToDate.set('displayedValue', '');
		repriceToDate.set('disabled', true);

	}
	
	
	/**
	 * method fetches the currencies w.r.t to the facilities.
	 * @method _populateFacilityCurrency
	 */
	
	function _populateFacilityCurrency(){
		var facilityNamevalue = dj.byId("bo_facility_id").get("value");
		var dealNamevalue = dj.byId("bo_deal_id").get("value");
		var facilityCurrency = dj.byId("deal_currency");
		if(facilityCurrency.get("value").length>1)
		{
			facilityCurrency.set('value', '');
	
		}
		
		var facilitiesStore = misys._config.facilityListResponse["items"];
		var dealPricingOptionsStore= facilitiesStore['facilityCurrency'];
		var store;
		
		if(facilitiesStore && facilityNamevalue !== "")
		{
			 store = new dojo.data.ItemFileReadStore(
					 {
						 data :
						 {
						 	 identifier : "id",
							 label : "name",
							 items : dealPricingOptionsStore[dealNamevalue][facilityNamevalue]
						 }
					 });							
		}
		facilityCurrency.set('store', store);
		
		if(facilityNamevalue<=1)
		{
		_populateCurrencyDropDown();
		}
	}
	
	/**
	 * method fetches the currencies w.r.t to the pricing options.
	 * @method _populatePricingOptionCurrency
	 */
	
	function _populatePricingOptionCurrency() {
		var pricingOptionNameValue = dj.byId("facility_pricing_option").get("value");
		var facilityIdValue = (dj.byId("bo_facility_id") && dj.byId("bo_facility_id").get("value")) ? dj.byId("bo_facility_id").get("value").trim() : "";
		var dealIdValue = dj.byId("bo_deal_id").get("value");
		var facilityCurrency = dj.byId("deal_currency");
		
		if(dealIdValue && pricingOptionNameValue)
		{
			if(facilityCurrency.get("value").length>1)
			{
				facilityCurrency.set('value', '');
			}
			
			var facilitiesStore = misys._config.facilityListResponse["items"];
			var store;
			if (facilityIdValue === '') {
				var dealPricingOptionsStore = facilitiesStore['dealPricingOptionCurrencies'];
				if(dealPricingOptionsStore && pricingOptionNameValue !== "")
				{
					store = new dojo.data.ItemFileReadStore({
								data :
								{
									identifier : "id",
									label : "name",
									items : dealPricingOptionsStore[dealIdValue][pricingOptionNameValue]
								}
							});							
				}
			} else {
				var facilityPricingOptionsStore= facilitiesStore['facilityPricingOptionCurrencies'];
				if(facilityPricingOptionsStore && pricingOptionNameValue !== "")
				{
					store = new dojo.data.ItemFileReadStore({
								data :
								{
									identifier : "id",
									label : "name",
									items : facilityPricingOptionsStore[dealIdValue][facilityIdValue][pricingOptionNameValue]
								}
							});							
				}
			}
			facilityCurrency.set('store', store);
			dijit.byId('deal_currency').set('disabled', false);
		}
		else{
			facilityCurrency.set('value', '');
			facilityCurrency.set('disabled', true);
		}
	}
	
	/**
	 * method fetches the pricing options w.r.t to the deal.
	 * @method _populatePricingOptionDropDown
	 */
	
	function _populatePricingOptionDropDown()
	{ 
		var dealNamevalue = dj.byId("bo_deal_id").get("value");
		var dealPricingOptions = dj.byId("facility_pricing_option");
		if(dealPricingOptions.get("value").length>1)
		{
			dealPricingOptions.set('value', '');
			dealPricingOptions.set("required",false);
			
		}
		
		var facilitiesStore = misys._config.facilityListResponse["items"];
		var dealPricingOptionsStore= facilitiesStore['pricingOptions'];
		var store;
		
		if(facilitiesStore && dealNamevalue !== "")
		{
			 store = new dojo.data.ItemFileReadStore(
					 {
						 data :
						 {
						 	 identifier : "id",
							 label : "name",
							 items : dealPricingOptionsStore[dealNamevalue]
						 }
					 });							
		}
		//set the store in currency dropdown
		dealPricingOptions.set('store', store);
	}
	
	/*
	 * checks for currency dropdown and makes that field mandatory for search.
	 * @method _checkCurrencyField
	 */
  function _checkCurrencyField(widget){
		
		m._config = m._config || {};
		m._config.currencyValidationinProcess = false;
		var dealCurrency = dj.byId(widget);
		var currencyNamevalue = dealCurrency ? dealCurrency.get("value")  : "";
		
		//check currency field is empty or not
			if (currencyNamevalue.length === 0 || !currencyNamevalue.trim()) {
				
				m._config.currencyValidationinProcess = true;
			    var displayMessage = misys.getLocalization('dealFielIsRequired');
			    //dealCurrency.focus();
			    dealCurrency.set("state","Error");
		 		dj.hideTooltip(dealCurrency.domNode);
		 		dj.showTooltip(displayMessage, dealCurrency.domNode, 100);
		 		return false;
			}
		
		m._config.currencyValidationinProcess = false;
		return true;
	}
  
  
  	/*
	 * checks for pricing option dropdown and makes that field mandatory for search.
	 * @method _checkPricingOptionField
	 */
  function _checkPricingOptionField(widget){
	  
	  	if(dj.byId("intend_notice_validation_flag"))
	  	{
				if(dj.byId("intend_notice_validation_flag").get("value")==="Y")
				{
	  					m._config = m._config || {};
						m._config.pricingOptionValidationinProcess = false;
						var pricingOptionField = dj.byId(widget);
						var pricingOptionvalue = pricingOptionField ? pricingOptionField.get("value")  : "";
						
						//check pricing option field is empty or not
							if (pricingOptionvalue.length === 0 || !pricingOptionvalue.trim()) {
								
								m._config.pricingOptionValidationinProcess = true;
							    var displayMessage = misys.getLocalization('dealFielIsRequired');
							    //dealCurrency.focus();
							    pricingOptionField.set("state","Error");
						 		dj.hideTooltip(pricingOptionField.domNode);
						 		dj.showTooltip(displayMessage, pricingOptionField.domNode, 100);
						 		return false;
							}
						
						m._config.pricingOptionValidationinProcess = false;
						return true;
				}
				else
				{
					return true;
				}
	  }		
	  else
		{
			
			return true;
		}
	}
	/*
	 * checks for facility option dropdown and makes that field mandatory for search.
	 * @method _checkFacilityOptionField
	 */
  function _checkFacilityOptionField(widget){
	  
			m._config = m._config || {};
			m._config.facilityOptionValidationinProcess = false;
			var facilityOptionField = dj.byId(widget);
			var facilityOptionvalue = facilityOptionField ? facilityOptionField.get("value")  : "";
			
			//check pricing option field is empty or not
				if (facilityOptionvalue.length === 0 || !facilityOptionvalue.trim()) {
					
					m._config.facilityOptionValidationinProcess = true;
				    var displayMessage = misys.getLocalization('facilityFieldIsRequired');
				    //dealCurrency.focus();
				    facilityOptionField.set("state","Error");
			 		dj.hideTooltip(facilityOptionField.domNode);
			 		dj.showTooltip(displayMessage, facilityOptionField.domNode, 100);
			 		return false;
				}
			
			m._config.facilityOptionValidationinProcess = false;
			return true;
	}

  
  /*
	 * checks for from date and makes that field mandatory for search.
	 * @method _checkReprcingFromDateField
	 */
function _checkReprcingFromDateField(widget){
	  
	  	if(dj.byId("intend_notice_validation_flag"))
	  	{
				if(dj.byId("intend_notice_validation_flag").get("value")==="Y")
				{
	  					m._config = m._config || {};
						m._config.reprcingDateValidationinProcess = false;
						var fromDateField = dj.byId(widget);
						var fromDatevalue = fromDateField ? fromDateField.get("value")  : "";
						//check pricing option field is empty or not
							if (fromDatevalue===null) {
								m._config.reprcingDateValidationinProcess = true;
							    var displayMessage = misys.getLocalization('dealFielIsRequired');
							    //dealCurrency.focus();
							    fromDateField.set("state","Error");
						 		dj.hideTooltip(fromDateField.domNode);
						 		dj.showTooltip(displayMessage, fromDateField.domNode, 100);
						 		return false;
							}
						
						m._config.reprcingDateValidationinProcess = false;
						return true;
				}
				else
				{
					return true;
				}
	  }		
	  else
		{		
			return true;
		}
	}

  
  
  
  function _checkRepricingAutoRollOver(strListKeys){		
			var onOkCallback = function(){	
				initiateRepricing(strListKeys);
			};		
		m.dialog.show("CONFIRMATION", misys.getLocalization('repricingAutoRollOverMsg'),
				"", null, null, "", onOkCallback);
	}
	
    /*
	 * checks for deal dropdown and makes that field mandatory for search.
	 * @method _checkDealField
	 * 
	 */
	function _checkDealField(widget){
		
		m._config = m._config || {};
		m._config.dealValidationinProcess = false;
		var deal = dj.byId(widget);
		var dealNamevalue = deal ? deal.get("value")  : "";
		//check deal field is empty or not
		
			if (dealNamevalue.length === 0 || !dealNamevalue.trim()) {
				
				m._config.dealValidationinProcess = true;
			    var displayMessage = misys.getLocalization('dealFielIsRequired');
				//deal.focus();
				deal.set("state","Error");
		 		dijit.hideTooltip(deal.domNode);
		 		dijit.showTooltip(displayMessage, deal.domNode, 100);
		 		return false;
			}
		
		m._config.dealValidationinProcess = false;
		return true;
	}
		

	
	 d.mixin(m, {
			
			bind : function() {
				
				if(dj.byId("intend_notice_validation_flag"))
			  	{
						if(dj.byId("intend_notice_validation_flag").get("value")==="Y")
						{

				            m.setValidation("repricing_date", _checkPastDatesBasedOnIntendNoticeValidation);
						}
						else
							{
							m.setValidation("repricing_date", _checkPastDatesValidation);
							}
			  	}

			       
			   
			    
				m.setValidation("repricing_date2", _checkToDatesValidation);
				m.connect("submitButton", "onClick", function(){
					//_checkDealField("bo_deal_name");	
					if(_checkDealField("bo_deal_id") && _checkFacilityOptionField("bo_facility_id") && _checkPricingOptionField("facility_pricing_option") && _checkCurrencyField("deal_currency"))
					{
						_checkReprcingFromDateField("repricing_date");
					}			
				
				});
							
				m.connect("borrowerid", "onChange", function() {
				    //Clear deal Name drop down and disable search button
				
					var dealid = dijit.byId('bo_deal_id');
					dealid.set('value', '');
					dealid.set('state', '');
					dealid.set('disabled', true);
					//dijit.byId('submitButton').set('disabled', true);
					dijit.byId('bo_facility_id').set('disabled', true);
			    	dijit.byId('bo_facility_id').set('displayedValue', "");
			    	dijit.byId('facility_pricing_option').set('disabled', true);
			    	dijit.byId('facility_pricing_option').set('displayedValue', "");
		    		dijit.byId('deal_currency').set('disabled', true);
		    		dijit.byId('deal_currency').set('displayedValue', "");
		    		
					if(dj.byId("borrowerid").get("value"))
					{
						_getBorrowerDeals("borrowerid");
					}
					
				});
				
				m.connect("bo_deal_id", "onChange", function(){
					dijit.byId('bo_facility_id').set('disabled', true);
					dijit.byId('bo_facility_id').set('displayedValue', "");
			    	dijit.byId('facility_pricing_option').set('disabled', true);
			    	dijit.byId('facility_pricing_option').set('displayedValue', "");
		    		dijit.byId('deal_currency').set('disabled', true);
		    		dijit.byId('deal_currency').set('displayedValue', "");

		    		if(this.get("value").length > 1){
		    			dijit.byId('bo_facility_id').set('disabled', false);		
					}

			    });
				m.connect("bo_deal_id", "onChange", _populateFacilityDropDown);
				m.connect("bo_deal_id", "onChange", _populatePricingOptionDropDown);
			    m.connect("bo_deal_id", "onChange", _populateCurrencyDropDown);
				
		    	m.connect("bo_facility_id", "onChange", function(){
		    		dijit.byId('facility_pricing_option').set('disabled', true);
		    		dijit.byId('deal_currency').set('disabled', true);
		    		dijit.byId('deal_currency').set('displayedValue', "");
		    		if(this.get("value").length > 1){
		    			dijit.byId('facility_pricing_option').set('disabled', false);		
					}
			    });
			    m.connect("bo_facility_id", "onChange", _populateFacilityPricingOptions);
				m.connect("bo_facility_id", "onChange" ,_populateFacilityCurrency);
				
				m.connect("facility_pricing_option", "onChange", _makeNonMandatoryPricingOptionField);
				m.connect("facility_pricing_option", "onChange", _populatePricingOptionCurrency);
				m.connect("facility_pricing_option", "onChange", _getIntendNoticeCountBasedOnPricingOption);
			    m.connect("deal_currency", "onChange", function() {
			    	dj.byId("repricing_date").set("disabled",true);
			    	dj.byId("repricing_date2").set("disabled",true);	
			    	if(this.get("value").lenght >1){
			    		dj.byId("repricing_date").set("disabled",false);
				    	dj.byId("repricing_date2").set("disabled",false);	
			    	}
			    	if(dj.byId("repricing_date").get("value") !== ""){
			    		dj.byId("repricing_date").set("value", "");
			    		dj.byId("repricing_date").set("displayedValue", "");
			    		dj.byId('repricing_date2').set("value", "");
			    		dj.byId('repricing_date2').set("displayedValue", "");
			    	}
			    	_getBusinessDayValidated();
				});
			    
			    m.connect("repricing_date", "onChange", function() {
					_getBusinessDayValidated();
				});
			},
			
			onFormLoad : function() {
				if(dj.byId("intend_notice_validation_flag"))
			  	{
						if(dj.byId("intend_notice_validation_flag").get("value")!=="Y")
						{
								_setDefaultDates();
								
						}
						else
						{
							
							_disableDateFieldOnFormLoad();
						}
			  	}
				dijit.byId('bo_deal_id').set('disabled', true);
				dijit.byId('bo_facility_id').set('disabled', true);
				dijit.byId('facility_pricing_option').set('disabled', true);
				dijit.byId('deal_currency').set('disabled', true);
				
				//always disable the auto roll over search parameter
				
				m.animate("fadeOut","is_auto_rollover_row");
				
				m.animate("fadeOut","intend_notice_validation_flag_row");
				m.animate("fadeOut","pricing_option_field_row");
				m.animate("fadeOut","repricing_to_date_field_row");
				
				
				//dijit.byId('submitButton').set('disabled', true);
		       	
				//If Borrower reference in populated on form load call on change event
	        	if(dijit.byId('borrowerid') && dijit.byId('borrowerid').get('value') !== "")
	        	{
	        	  dijit.byId('borrowerid').onChange();
	        	}
	        }
		});
	 	
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.loan.ln_repricing_list_client');