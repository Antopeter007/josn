dojo.provide("misys.binding.loan.create_ln");

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
dojo.require("dojo.data.ItemFileReadStore");
dojo.require("misys.form.file");
dojo.require("misys.form.SimpleTextarea");
dojo.require("misys.form.common");
dojo.require("misys.validation.common");
dojo.require("misys.widget.Collaboration");
dojo.require("misys.binding.SessionTimer");
dojo.require("dojox.xml.DomParser");

/**
 * Create Loan Screen JS Binding 
 * 
 * @class create_ln
 * @param d
 * @param dj
 * @param m
 */
(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {
	 
	"use strict"; // ECMA5 Strict Mode
	misys._config.isDirtyFlag=false;
	misys._config.isValid=false;
	misys._config.isEffectiveDateFlag=false;
	misys._config.isRepricingDateFlag=false;

    // private functions and variables go here
	var urls = "/screen/AjaxScreen/action/GetBusinessDayValidatedDate";
	var CNC = 'CUSTOM-NO-CANCEL';
	var debugMsg = "[INFO] No deals for the borrower found.";
	/**
	 * Validates the data entered as the Effective Date.
	 * 
	 * @method _validateLoanEffectiveDate
	 */
	function _validateLoanEffectiveDate(){
		//  summary:
	    //        Validates the data entered as the Effective Date.
	    //  tags:
	    //         public, validation
		
		// This validation is for non-required fields
		if(!this.get("value")) {
			return true;
		}
		
		console.debug('[Validate] Validating Loan Effective Date. Value = ' + this.get('value'));
		
		var thisObject  = dj.byId(this.id);
		
		// Test that the loan effective date is greater than or equal to the
		// current date
		var value = thisObject.get("value");
		
		var currentDate = new Date();
		// set the hours to 0 to compare the date values
		currentDate.setHours(0, 0, 0, 0);
		
		// compare the values of the current date and transfer date
		var isValid = d.date.compare(m.localizeDate(this), currentDate) < 0 ? false : true;
		if(!isValid)
		{
			 this.invalidMessage = m.getLocalization("effectiveDateGreaterThanSystemDate", [m.getLocalizeDisplayDate(this)]);
			 return false;
		}
		
		// Test that the loan effective date is greater than or equal to the
		// facility effective date
		var facEffDate = dijit.byId('facility_effective_date');
		if(!m.compareDateFields(facEffDate, thisObject))
		{
			this.invalidMessage = misys.getLocalization('loanEffDateGreaterThanFacEffDateError', [
							m.getLocalizeDisplayDate(this),
							m.getLocalizeDisplayDate(facEffDate)]);
			return false;
		}
		
		// Test that the loan effective date is less than or equal to the
		// facility expiry date
		var facExpDate = dijit.byId('facility_expiry_date');
		if(!m.compareDateFields(thisObject, facExpDate))
		{
			this.invalidMessage = misys.getLocalization('loanEffDateLessThanFacExpDateError', [
							m.getLocalizeDisplayDate(this),
							m.getLocalizeDisplayDate(facExpDate)]);
			return false;
		}
		
		// Test that the loan effective date is less than or equal to the
		// facility maturity date
		var facMaturityDate = dijit.byId('facility_maturity_date');
		if(!m.compareDateFields(thisObject, facMaturityDate))
		{
			this.invalidMessage = misys.getLocalization('loanEffDateLessThanFacMatDateError', [
							m.getLocalizeDisplayDate(this),
							m.getLocalizeDisplayDate(facMaturityDate)]);
			return false;
		}
		
		// Test that the loan effective date is less than loan maturity date
		var loanMaturityDate = dijit.byId('ln_maturity_date');
		if(thisObject && loanMaturityDate && thisObject.displayedValue && loanMaturityDate.displayedValue)
		{
			if(d.date.compare(m.localizeDate(thisObject), m.localizeDate(loanMaturityDate)) >= 0)
			{
				this.invalidMessage = misys.getLocalization('loanEffDateLessThanLoanMatDateError', [
										m.getLocalizeDisplayDate(this),
										m.getLocalizeDisplayDate(loanMaturityDate)]);
				return false;
			}
		}
		_pastDateValidationForEffectiveDate();
		return true;
	}
	
	function convertStringToDate(/*String*/ dateString)
	{
		var dateFormat = dj.byId("date_format").get("value");
		var dateSplit = dateString.split("/");    // ["29", "1", "2016"]
		var dateObject;
		if(dateFormat === "MM/dd/yyyy"){
			dateObject = new Date(parseInt(dateSplit[2],10),parseInt(dateSplit[0],10)-1,parseInt(dateSplit[1],10));
		}else if(dateFormat === "dd/MM/yyyy"){
			dateObject = new Date(parseInt(dateSplit[2],10),parseInt(dateSplit[1],10)-1,parseInt(dateSplit[0],10));	
		}
		return dateObject;
	}
	
	/** 
	 * This method check and validate the different type of limits
	* @method _validateDrawdownLoanLimitAmt
	* 
	 */
	function _validateDrawdownLoanLimitAmt(){
		
		var isValid = true;
		var errorMsg;
		
		m.xhrPost({
			url : m.getServletURL("/screen/AjaxScreen/action/ValidateDrawdownLoanLimitAmount"),
			handleAs : "json",
			preventCache : true,
			sync : true,
			content: { xml : misys.formToXML() },
			load : function(response, args){
				isValid = response.isValid;
				errorMsg = response.errorMsg;
			},
			error : function(response, args){
				isValid = false;
				console.error("Process drawdown error due to limit violation", response);
			}
		});
		
		if(!isValid)
		{
			m._config.onSubmitErrorMsg = errorMsg;
			return false;
		}
		else
		{
			return true;
		}
	}
	
	function checkValidations(){

		if(validateAccess() && _validateLoanAmount()){
				if(_pastDateValidationForEffectiveDate()){
					if(dj.byId('screenMode').get('value') === 'UNSIGNED'){
					_setEffectiveDateAsPerTheBusinessDayRule();
					_validateDrawdownLoanLimitAmt();
					if(m._config.onSubmitErrorMsg && m._config.onSubmitErrorMsg !== ""){
						return false;
			         }
					else{
						return true;
					}
				}
					else{
						return true;
					}
				}
		}
		return false;
	}
/**
 * This method checks whether user selected the remittance or not in case of mandatory
 * This method also allows to submit those transaction for which currency does not have any remittance instruction when remittance is mandatory
 */
	function checkRemittanceIsSelected(){
		var data = {
        		identifier : 'description',
    			label : 'description',
    			items : misys._config.remittanceInstructions
		};
		var currencyValue;
		if(dj.byId('screenMode').get('value') === 'UNSIGNED')
		{
			currencyValue=dj.byId("ln_cur_code_unsigned").get("value");
		}
		else{
			currencyValue=dj.byId("ln_cur_code").get("value");	
		}
		var dataLength = 0;
		if(data.items && data.items.length){

		  dataLength=data.items.length;

		}
		var isEmpty = true;
		var y;
		for(y=0 ; y<dataLength ; y++){
			
			if(currencyValue===data.items[y].currency[0]){
				isEmpty = false;
				break;
			}
		}
		if(dijit.byId('remittance_flag').get("value")==="mandatory" && !isEmpty){
			var remInst = dijit.byId('gridRemittanceInstruction');
			
			var selectedRemttiance=remInst.selection.getSelected();
			if(selectedRemttiance.length!==0){
				
				return true;
			}
			else{				
					if(dj.byId('screenMode').get('value') === 'UNSIGNED')
					{
						m._config.onSubmitErrorMsg =  misys.getLocalization('ErrorForMandatoryRemittanceForCheckerUser');
					}
				    else
					{
						m._config.onSubmitErrorMsg =  misys.getLocalization('ErrorForMandatoryRemittance');
					}
				return false; 
			}
		}
		return true;
	}
	/**
	 * Validates the access type for the facility, if facility does not have transaction access then throw error.
	 */
	function validateAccess(){
		
		var ln_access_type =dj.byId('ln_access_type');
		if(ln_access_type){
			
			if(ln_access_type.get('value')==='A'){
				return true;
			}else{				
				m._config.onSubmitErrorMsg =  misys.getLocalization('facilityBlockError',[dj.byId('bo_facility_name').get('value')]);
			}
			
		}	
		return false;		
	}

	/**
	 * Validates the data entered as the Maturity Date.
	 * 
	 * @method _validateLoanMaturityDate
	 */
	function _validateLoanMaturityDate(){
		//  summary:
	    //        Validates the data entered as the Maturity Date.
	    //  tags:
	    //         public, validation
			
		// This validation is for non-required fields
		if(this.get('value') == null){
			return true;
		}

		console.debug('[Validate] Validating Loan Maturity Date. Value = ' + this.get('value'));
		
		var thisObject  = dj.byId(this.id);
		
		// Test that the loan maturity date is less than or equal to the
		// facility maturity date
		var facMatDate = dijit.byId('facility_maturity_date');
		if(!m.compareDateFields(thisObject, facMatDate))
		{
			this.invalidMessage = misys.getLocalization('loanMatDateGreaterThanFacMatDateError', [
							m.getLocalizeDisplayDate(this),
							m.getLocalizeDisplayDate(facMatDate)]);
			return false;
		}
		
	
		// Test that the loan maturity date is greater than or equal to the loan
		// effective date
		var loanEffDate = dijit.byId('effective_date');
		if(thisObject && loanEffDate && thisObject.value && loanEffDate.value)
		{
			if(d.date.compare(m.localizeDate(thisObject),m.localizeDate(loanEffDate)) <= 0){
				this.invalidMessage = misys.getLocalization('loanMatDateLessThanLoanEffDateError', [
										m.getLocalizeDisplayDate(this),
										m.getLocalizeDisplayDate(loanEffDate)]);
				return false;
			}
		}
		//Test that the loan maturity date is greater than  or equal to the repricing date 
		var repricingDate = dijit.byId('repricing_date');
		if(!m.compareDateFields(repricingDate, thisObject))
		{
			this.invalidMessage = misys.getLocalization('loanMatDateGreaterThanLoanRepDateError', [
							m.getLocalizeDisplayDate(thisObject),
							m.getLocalizeDisplayDate(repricingDate)]);
			return false;
		}
		return true;
	}
	/**
	 * Method to populate the fx details.
	 */
	function populateFXDetails(){
		var facilityCurrency=dijit.byId('borrower_limit_cur_code');
		var lnCurCode=dijit.byId("ln_cur_code");
		var facFXRateDiv=dojo.byId('facFXRateId');
   		if(facilityCurrency && lnCurCode.get('value')!=="" &&(lnCurCode.get('value') !==facilityCurrency.get('value'))){
   			
			var lnCurCodeVal = lnCurCode.get('value');
   			
			lnCurCode.store.fetch({
				query: {id: lnCurCode.get('value')},
				onComplete: dojo.hitch(this, function(items, request){ 
					dojo.forEach(items,function(item){
						dijit.byId('fx_display').set('value',"1 " + facilityCurrency.get('value') + " = " + item.limitFXRate[0] +" "+lnCurCode.get('value'));
						dijit.byId('fx_conversion_rate').set('value',item.limitFXRate[0]);
						dojo.style(facFXRateDiv, "display", "block");
					}, this);
				})
			});
   		}else{
   			dojo.style(facFXRateDiv, "display", "none");
   		}
	}
	
	
	/**
	 * this method makes the ajax call to get the business date from loan iq
	 * @method _setEffectiveDateAsPerTheBusinessDayRule
	 */
	function _setEffectiveDateAsPerTheBusinessDayRule()
	{
		var boFacilityId =  dj.byId("bo_facility_id").get("value");
		var currency = dj.byId("ln_cur_code");
		var currencyUnsigned = dj.byId("ln_cur_code_unsigned");
		var isRepricingDate = 'N';
		var effectiveDateField = dj.byId('effective_date');
		var effectiveDateUnsignedField = dj.byId('effective_date_unsigned');
		var currentServerDate;
		var pricingOptionValue;
		var checkEffectiveDate;
		var selectedEffectiveDate;
		var selectedCurCode;
		if(dj.byId('screenMode').get('value') === 'UNSIGNED'){
			selectedEffectiveDate=effectiveDateUnsignedField.get("value");
			pricingOptionValue = dijit.byId('pricing_option_unsigned').get('value');
			selectedCurCode = currencyUnsigned.get("value");
			
		}else{
			selectedEffectiveDate=effectiveDateField.get("displayedValue");
			pricingOptionValue = dijit.byId('pricing_option').get('value');	
			selectedCurCode = currency.get("value");
		}
		
	 		//console.debug('[Loan Drawdown] Checking for Borrower deals');
			m.xhrPost({
				url : m.getServletURL(urls),
				handleAs : "json",
				preventCache : true,
				sync : true,
				content : {
					boFacilityId : boFacilityId,
					pricingOptionName : pricingOptionValue,
					dateToValidate : selectedEffectiveDate,
					currency : selectedCurCode,
					isRepricingDate : isRepricingDate
				},				
				load : function(response)
				{
					console.log("success");
					misys._config.dateValuesResponse = response;
					if(misys._config.displayMode === "edit"){
						if(response.items.dateValues && dj.byId("effective_date").get("displayedValue") === response.items.dateValues[0].localizedDate){
						misys._config.isEffectiveDateFlag=true;
						}
						else{
							misys._config.isEffectiveDateFlag=false;
						}
						_populateBusinessDateForEffectiveDateField();
						}
					else{
						if(response.items.dateValues && dj.byId("effective_date_unsigned").get("value") !== response.items.dateValues[0].localizedDate){
							m._config.onSubmitErrorMsg=m.getLocalization("unsignedEffectiveDateNonBusinessDayError", [response.items.dateValues[0].localizedDate]);
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
	
	/**
	 * this method makes the ajax call to get the business date from loan iq
	 * @method _setRepricingDateAsPerTheBusinessDayRule
	 */
	
	function _setRepricingDateAsPerTheBusinessDayRule()
	{
		var boFacilityId =  dj.byId("bo_facility_id").get("value");
		var pricingOptionName =  dj.byId("pricing_option").get("value");
		var repricingDate =  dj.byId("repricing_date").get("displayedValue");
		var currency = dj.byId("ln_cur_code").get("value");
		var isRepricingDate = 'Y';

		//console.debug('[Loan Drawdown] Checking for Borrower deals');
			m.xhrPost({
				url : m.getServletURL(urls),
				handleAs : "json",
				preventCache : true,
				sync : true,
				content : {
					boFacilityId : boFacilityId,
					pricingOptionName : pricingOptionName,
					dateToValidate : repricingDate,
					currency : currency,
					isRepricingDate : isRepricingDate
				},				
				load : function(response)
				{
					console.log("success");
					misys._config.dateValuesResponse = response;
					if(response.items.dateValues && dj.byId("repricing_date").get("displayedValue") === response.items.dateValues[0].localizedDate){
						misys._config.isRepricingDateFlag=true;
						}
						else{
							misys._config.isRepricingDateFlag=false;
						}
					_populateBusinessDateForRepricing();
					
				},
				error : function(response) 
			    {
					console.log("error");
			    	console.debug(debugMsg);
			    			
			    }		    
			});
	}
	
	/**
	 * This method render the loan iq business date for repricing 
	 * @method _populateBusinessDateForRepricing
	 */
	
	function _populateBusinessDateForRepricing() 
	{	
		var repricingDate = dj.byId("repricing_date");

		var repricingDateStringForDisplay = dj.byId("repricing_date").get("displayedValue");
		var repricingDateValue =  (dj.byId("repricing_date").get("value") !== null) ? dj.byId("repricing_date").get("value") : "";
		
		var store;
		var businessDateValues = misys._config.dateValuesResponse["items"];	
		// get associated store
		 repricingDate.store = new dojo.data.ItemFileReadStore(
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
					repricingDate.get('store').fetch({query: {}, onBegin: getSize, start: 0, count: 0});
					var dateResponse=repricingDate.store._arrayOfTopLevelItems[0].name[0];
					var darr = dateResponse.split("/");    // ["29", "1", "2016"]
					var dateObject = new Date(parseInt(darr[2],10),parseInt(darr[1],10)-1,parseInt(darr[0],10));					
					repricingDate.set('value',dateObject);
					
					var repricingDateObject = new Date(repricingDateValue);	
				
					repricingDate.set('value',dateObject);
					
					if(dateObject.valueOf()>repricingDateObject.valueOf() || dateObject.valueOf()<repricingDateObject.valueOf())
					{
						var displayMessage = m.getLocalization("repricingDateBusinessDayValidationErrorMsg", [ repricingDateStringForDisplay ]);
						setTimeout(function(){m.dialog.show(CNC,displayMessage,"Info");}, 2000);
					}
					
					//_setRepricingDateAsPerTheBusinessDayRule();
	}
	
	
	/**
	 * This method render the loan iq business date for effective date 
	 * @method _populateBusinessDateForEffectiveDateField
	 */
	
	function _populateBusinessDateForEffectiveDateField() 
	{	
		var effectiveDate = dj.byId("effective_date");	
		var effectiveDateStringForDisplay =  dj.byId("effective_date").get("displayedValue");
		var effectiveDateValue =  (dj.byId("effective_date").get("value") !== null) ? dj.byId("effective_date").get("value") : "";
		
		var store;
		var businessDateValues = misys._config.dateValuesResponse["items"];	
		var dateResponse;
		// get associated store
		 effectiveDate.store = new dojo.data.ItemFileReadStore(
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
					effectiveDate.get('store').fetch({query: {}, onBegin: getSize, start: 0, count: 0});
					if(storeSize!==0){
						
						dateResponse=effectiveDate.store._arrayOfTopLevelItems[0].name[0];
						var darr = dateResponse.split("/");
						var dateObject = new Date(parseInt(darr[2],10),parseInt(darr[1],10)-1,parseInt(darr[0],10));		
						
					    // ["29", "1", "2016"]
						var effectiveDateObject = new Date(effectiveDateValue);	
					
						
						
						var defaultEffectiveDate=dijit.byId('default_effective_date');
						var appDateField=dijit.byId('appl_date');
						var effectiveDateField=dijit.byId('effective_date');
						var that=effectiveDateField;
						if ((m.compareDateFields(appDateField, that))&& !(m.compareDateFields(defaultEffectiveDate, that))) {
							var displayMessage = m.getLocalization("defaultEffectiveDateErrorMsg", [ defaultEffectiveDate.get('displayedValue') ]);
							m.dialog.show(CNC,displayMessage,"Info");
							effectiveDate.set('value',dateObject);
							 return true;				
						}

						if(!((m.compareDateFields(appDateField, that))&& !(m.compareDateFields(defaultEffectiveDate, that)))){
							if(dateObject.valueOf()>effectiveDateObject.valueOf() || dateObject.valueOf()<effectiveDateObject.valueOf())
							{
								var displayMessage1 = m.getLocalization("effectiveDateBusinessDayValidationErrorMsg", [ effectiveDateStringForDisplay ]);
								m.dialog.show(CNC,displayMessage1,"Info");
								effectiveDate.set('value',dateObject);
								 return true;
							}	
						}
						effectiveDate.set('value',dateObject);
						return true;	
			}					
	}
	
	/*
	 * @method _populateDefaultEffectiveDate
	 * This method gets the effective date and set the value in default effective date hidden field.
	 */
	
	function _populateDefaultEffectiveDate(response){
		
		var dateValue=response.dateValues[0].localizedDate;
		var defaultEffectiveDate = dj.byId("default_effective_date");							
		defaultEffectiveDate.set('value',dateValue);					
	}
	
	
	/**
	 * This method set the effective date base on intend notice and non business day rule.
	 * In UNSIGNED mode it does not set the effective_date field but just set the 
	 * effective_date_hidden_field which will be used for T+X validation.
	 * 
	 * @method _setEffectiveBasedOnNoticeAdvanceDaysForPricingOptions
	 */	
		function _setEffectiveBasedOnNoticeAdvanceDaysForPricingOptions(){
			var pricingOptionValue;
			if(dj.byId('screenMode').get('value') === 'UNSIGNED'){
				pricingOptionValue = dijit.byId('pricing_option_unsigned').get('value');
			}else{
				pricingOptionValue = dijit.byId('pricing_option').get('value');	
			}
			var store = misys._config.pricingOptionsStore;
			
			store.fetch({
				query: {id: pricingOptionValue},
				onComplete: dojo.hitch(this, function(items, request){
					var item = items[0];	
					if(item)
					{
					        var serverDate= item.serverDate;	 
					        var currentDate=new Date(serverDate);
							if(dj.byId('screenMode').get('value') != 'UNSIGNED'){
								dj.byId('effective_date').set("value",currentDate);
							}
					}
				})
			});	
		}
		

		/**
		 * this method covert the iso date in dd/mm/yyyy
		 * @method convert
		 */		
			
		function convert(str) {
		    var date = new Date(str),
		        mnth = ("0" + (date.getMonth()+1)).slice(-2),
		        day  = ("0" + date.getDate()).slice(-2);
		    return [ day, mnth, date.getFullYear() ].join("/");
		}

		/**
		 * sets the effective date and based on that sets repricing date
		 * @method _setEffectiveDateHiddenFieldValueOnLoad
		 */
		
		function _setEffectiveDateHiddenFieldValueOnLoad()
		{
			
			var effectiveDateField = dj.byId('effective_date');
			if(effectiveDateField.get("value")!==null)
				{			     
				     //_setEffectiveBasedOnNoticeAdvanceDaysForPricingOptions();
				     
				     _setRepricingDateAsPerTheBusinessDayRule();
				}
		}
		
/*
 * this method check the past dates validations for effective date
 * @method _checkPastDatesBasedOnIntendNoticeValidationForEffectiveDate
 */
	function _checkPastDatesBasedOnIntendNoticeValidationForEffectiveDate()
 	{
		
		var calculatedEffectiveDate = dijit.byId('effective_date_hidden_field');
		if(dj.byId('screenMode').get('value') === 'UNSIGNED'){
			//Extract the date form DOM and set it back, it creates Dojo widget. This is required as m.compareDateFields() compares Dojo widgets 
			dijit.byId('effective_date_unsigned').set("value",dijit.byId('effective_date_unsigned').get('value'));
			var effectiveDate = dijit.byId('effective_date_unsigned');
			//calculates and sets effective_date_hidden_field
			//_setEffectiveBasedOnNoticeAdvanceDaysForPricingOptions();
		
			
			if (!m.compareDateFields(calculatedEffectiveDate, effectiveDate)) {
				m._config.onSubmitErrorMsg = m.getLocalization("intendNoticeDaysErrorMsgForDrawDown",
						[m.getLocalizeDisplayDate(calculatedEffectiveDate)]);
				return false;
			}
		}else{
			if (!this.get("value")) {
				return true;
			}
			m._config = m._config || {};
			m._config.repricingDatesValidationInprocess = false;
			console.debug('[Validate] Validating Past date selection on from date field= '+ this.get('value'));

			if (!m._config.repricingDatesValidationInprocess) {
				// checks the calculated effecitbe dtae is smaller or equals to entered date.
				if (!m.compareDateFields(calculatedEffectiveDate, this)) {
					m._config.repricingDatesValidationInprocess = true;
					this.invalidMessage = m.getLocalization("intendNoticeDaysErrorMsgForDrawDown",
							[m.getLocalizeDisplayDate(calculatedEffectiveDate) ]);
					return false;

				}

			}
			m._config.repricingDatesValidationInprocess = false;
		}
		return true;
	}
	
	/**
	 * Validate the data entered as the Repricing Date.
	 * 
	 * @method _validateLoanRepricingDate
	 */
	function _validateLoanRepricingDate(){
		// summary:
	    // Validates the data entered as the Repricing Date.
	    //  tags:
	    //         public, validation
			
		// This validation is for non-required fields
		if(this.get('value') == null){
			return true;
		}

		console.debug('[Validate] Validating Loan Repricing Date. Value = ' + this.get('value'));
		
		var thisObject  = dj.byId(this.id);
		var repricingDate = dj.byId('repricing_date');
		
		console.debug('[Validate] Validating Loan Repricing Date. Value = ' + repricingDate.get('value'));
		
		// Test that the loan Repricing date is greater than or equal to the loan effective date
		var loanEffDate = dijit.byId('effective_date');
		if(m.compareDateFields(repricingDate, loanEffDate))
		{
			this.invalidMessage = misys.getLocalization('loanRepricingDateGreaterThanLoanEffDateError', [
							m.getLocalizeDisplayDate(repricingDate),
							m.getLocalizeDisplayDate(loanEffDate)]);
			return false;
		}
		
		// Test that the loan Repricing date is less than or equal to the loan maturity date
		var lnMatDate = dijit.byId('ln_maturity_date');
		if(!m.compareDateFields(repricingDate, lnMatDate))
		{
			this.invalidMessage = misys.getLocalization('loanRepricingDateLessThanLoanMatDateError', [
							m.getLocalizeDisplayDate(repricingDate),
							m.getLocalizeDisplayDate(lnMatDate)]);
			return false;
		}
		
		var facMatDate = dijit.byId('facility_maturity_date');
		if(!m.compareDateFields(repricingDate, facMatDate))
		{
			this.invalidMessage = misys.getLocalization('loanRepricingDateLessThanFacMatDateError', [
							m.getLocalizeDisplayDate(repricingDate),
							m.getLocalizeDisplayDate(facMatDate)]);
			return false;
		}
		return true;
	}

	/**
	 * Validates the data entered as the Loan Amount.
	 * 
	 * @method _validateLoanAmount
	 */
	
	function _validateLoanAmount(){
		//  summary:
	    //        Validates the data entered as the Loan Amount.
	    //  tags:
	    //         public, validation
			
		// This validation is for non-required fields
		if(dj.byId('ln_amt')){
		var loanAmountWidget = dj.byId('ln_amt');
		if(loanAmountWidget.get('value') == null){
			return true;
		}

		console.debug('[Validate] Validating Loan Amount ' + loanAmountWidget.get('value'));

		if (loanAmountWidget.get('value') <= 0) {
			// let Dojo handle the constraints
			loanAmountWidget.set("state","Error");
			dj.hideTooltip(loanAmountWidget.domNode);
			var loanAmountZeroError = misys.getLocalization('loanAmountZeroError');
			dj.showTooltip(loanAmountZeroError, loanAmountWidget.domNode,['after'], 0);
			setTimeout(function(){dj.hideTooltip(loanAmountWidget.domNode);}, 5000);
			return false;
		}
		
		var currency = dijit.byId('ln_cur_code');
		var riskType = dijit.byId('risk_type');
		var cldrMonetary = d.cldr.monetary.getData(currency.get("value"));
		if (currency && currency.get('value'))
		{
			//Below variables are arrays
			var limit = 0;
			var borrowerCcylimitAmt = 0;
			var riskTypeLimitAmt = 0;
			var borrowerLevelLimitAmt = 0;
			var limitWithPendingLoans = 0;
			var swinglineLimit = 0;
			
			//MPS-43846: Display the limit error message whihc is the least. 
			//Below variables for display purpose
			var isLoanAmountLimitExceeded = false;
			var limitAmountToDiaplay = 0; //used to diaplay on screen
			var lnAmtInvalidErrorMsg;
			var lnAmtInvalidWarningMsg;
			
			misys._config.currenciesStore.fetch({
				query: {
					id: currency.get('value')
				},
				onItem: function(item) {
					limit = item.limit;
					borrowerCcylimitAmt = item.borrowerCcylimit;
					borrowerLevelLimitAmt = item.borrowerlimit;
					swinglineLimit = item.swinglineLimit;
					limitWithPendingLoans=item.limitWithPend;
					if ((riskType && riskType.get('value'))) {
						var value = riskType.get('value'); //USD
						riskTypeLimitAmt =  item[value];
					}
				}
			});
			
			limitAmountToDiaplay = limit[0]; //Set the max limit initially.
			
			if (loanAmountWidget.get('value') > borrowerLevelLimitAmt){
				//validate borrower level limit
				isLoanAmountLimitExceeded = true;
				if(borrowerLevelLimitAmt[0] < limitAmountToDiaplay){
					limitAmountToDiaplay = borrowerLevelLimitAmt[0];
					
					if(borrowerLevelLimitAmt[0]<=0){
						lnAmtInvalidErrorMsg = misys.getLocalization('noAmountForBorrowerLimitError');
						lnAmtInvalidWarningMsg = m.getLocalization('loanBorrowerLevelLimtAmtExceeded');	
					}
					else
					{
					  lnAmtInvalidErrorMsg = misys.getLocalization('loanAmountTooBigThanBorrowerLimitAmtError',[ currency.get('value'),  d.currency.format((Math.floor(limitAmountToDiaplay * 100) / 100), {round: cldrMonetary.round,places: cldrMonetary.places}) ]);
					  lnAmtInvalidWarningMsg = m.getLocalization('loanBorrowerLevelLimtAmtExceeded');
					}
				}
			}			  
			//MPS-46844 :Risk type null check for limit validation as a part issue fix.
			if(riskType && riskType.get('value')){
                if (loanAmountWidget.get('value') > riskTypeLimitAmt){
                      //validate risk type limit
                      isLoanAmountLimitExceeded = true;
                      if(riskTypeLimitAmt[0] < limitAmountToDiaplay){
                            limitAmountToDiaplay = riskTypeLimitAmt[0];
                            if(riskTypeLimitAmt[0]<=0){
                                  lnAmtInvalidErrorMsg = misys.getLocalization('noAmountForRiskLimitError');
                                  lnAmtInvalidWarningMsg = m.getLocalization('loanBorrowerRiskTypeLimtAmtExceeded');   
                            }
                            else{
                            	lnAmtInvalidErrorMsg = misys.getLocalization('loanAmountTooBigThanBorrowerRiskTypeLimitAmtError',[ currency.get('value'), d.currency.format((Math.floor(limitAmountToDiaplay * 100) / 100), {round: cldrMonetary.round,places: cldrMonetary.places}) ]);
                                  lnAmtInvalidWarningMsg = m.getLocalization('loanBorrowerRiskTypeLimtAmtExceeded');
                            }
                      }
                }
			}
			if (loanAmountWidget.get('value') > swinglineLimit){
				//validate Swingline global limit
				isLoanAmountLimitExceeded = true;
				if(swinglineLimit[0] < limitAmountToDiaplay){
					limitAmountToDiaplay = swinglineLimit[0];
					if(swinglineLimit[0]<=0){
						lnAmtInvalidErrorMsg = misys.getLocalization('noAmountForLoanSublimitLimitError');
						lnAmtInvalidWarningMsg = m.getLocalization('noAmountForLoanSublimitLimitError');	
					}
					else{
						lnAmtInvalidErrorMsg = misys.getLocalization('loanAmountTooBigLoanSublimitAmtError',[ currency.get('value'),d.currency.format((Math.floor(limitAmountToDiaplay * 100) / 100), {round: cldrMonetary.round,places: cldrMonetary.places}) ]);
					    lnAmtInvalidWarningMsg = m.getLocalization('loanBorrowerCcyLimtAmtExceeded');
					}
				}				
			}
			if (loanAmountWidget.get('value') > borrowerCcylimitAmt){
				//validate currency limit
				isLoanAmountLimitExceeded = true;
				if(borrowerCcylimitAmt[0] < limitAmountToDiaplay){
					limitAmountToDiaplay = borrowerCcylimitAmt[0];
					if(borrowerCcylimitAmt[0]<=0){
						lnAmtInvalidErrorMsg = misys.getLocalization('noAmountForCurrencyLimitError',[currency.get('value')]);
						lnAmtInvalidWarningMsg = m.getLocalization('loanBorrowerCcyLimtAmtExceeded');	
					}
					else{
						lnAmtInvalidErrorMsg = misys.getLocalization('loanAmountTooBigThanBorrowerCcyLimitAmtError',[ currency.get('value'),d.currency.format((Math.floor(limitAmountToDiaplay * 100) / 100), {round: cldrMonetary.round,places: cldrMonetary.places}) ]);
					    lnAmtInvalidWarningMsg = m.getLocalization('loanBorrowerCcyLimtAmtExceeded');
					}
				}				
			}
			if (loanAmountWidget.get('value') > limit){
				//validate global limit
				isLoanAmountLimitExceeded = true;
				if(limit[0] <= limitAmountToDiaplay){
					limitAmountToDiaplay = limit[0];
					if(limitAmountToDiaplay === 0)
					{
						lnAmtInvalidErrorMsg = misys.getLocalization('facilityFullyDrawnError');
					}
					else
					{
						lnAmtInvalidErrorMsg = misys.getLocalization('loanAmountTooBigError',[ currency.get('value'), d.currency.format((Math.floor(limitAmountToDiaplay * 100) / 100), {round: cldrMonetary.round,places: cldrMonetary.places})]);
					}
					lnAmtInvalidWarningMsg = m.getLocalization('loanFacilityAmtExceeded');
				}
			}
			
			if (loanAmountWidget.get('value') > limitWithPendingLoans){
				//validate facility available limit with pending loans.
				isLoanAmountLimitExceeded = true;
				if(limitWithPendingLoans[0] <= limitAmountToDiaplay){
					limitAmountToDiaplay = limitWithPendingLoans[0];
					if(limitAmountToDiaplay <= 0)
					{
						lnAmtInvalidErrorMsg = misys.getLocalization('facilityFullyDrawnErrorWithPend');
					}
					else
					{
						lnAmtInvalidErrorMsg = misys.getLocalization('loanAmountTooBigWithPendError',[ currency.get('value'), d.currency.format((Math.floor((limitAmountToDiaplay * 100).toFixed(2)) / 100), {round: cldrMonetary.round,places: cldrMonetary.places})]);
					}
					lnAmtInvalidWarningMsg = m.getLocalization('loanFacilityAmtWithPendExceeded');
				}
			}
			if(dijit.byId('repricingdate_validation').value == 'true'){
				var commitmentData = _isLoanAmountGreaterThanCommitmentAmount();
				if (commitmentData.get('limitViolated'))
				{
					isLoanAmountLimitExceeded = true;
					var commitmentAmount = commitmentData.get('limitAmount');
					var repricing_date = dj.byId('repricing_date').get('displayedValue'); 
					if(commitmentAmount <= limitAmountToDiaplay)
					{
						limitAmountToDiaplay = commitmentAmount;
						if(limitAmountToDiaplay <= 0)
						{
							lnAmtInvalidErrorMsg = misys.getLocalization('commitmentScheduleFullyDrawnError');
						}
						else
						{
							lnAmtInvalidErrorMsg = misys.getLocalization('commitmentScheduleAmountErrorForDrawdown',[ currency.get('value'), d.currency.format((Math.floor((limitAmountToDiaplay * 100).toFixed(2)) / 100), {round: cldrMonetary.round,places: cldrMonetary.places})]);
						}
						lnAmtInvalidWarningMsg = misys.getLocalization('commitmentScheduleAmountWarningForDrawdown');
					}
				}	
			}
			
			
			if(isLoanAmountLimitExceeded){
				if(misys._config.warnFacilityAmtExceeded)
				{
					dj.hideTooltip(loanAmountWidget.domNode);
					dj.showTooltip(lnAmtInvalidWarningMsg, loanAmountWidget.domNode, 2000);
					setTimeout(function(){dj.hideTooltip(loanAmountWidget.domNode);}, 5000);
					return true;
				}
				else
				{
					loanAmountWidget.set("state","Error");
					dj.hideTooltip(loanAmountWidget.domNode);
					dj.showTooltip(lnAmtInvalidErrorMsg, loanAmountWidget.domNode,['after'], 0);
					setTimeout(function(){dj.hideTooltip(loanAmountWidget.domNode);}, 5000);
					return false;
				}
			}else{
				misys._config.warningMessages = [];
				return true;
			}
		}
		return true;
	}
	return true;
}

	function _isLoanAmountGreaterThanCommitmentAmount()
	{
		var repricing_date = dj.byId("repricing_date").displayedValue;
		var loanAmount = dj.byId("ln_amt").value;
		var returnData = new Map();
		returnData.set("limitViolated",false);
		if (repricing_date !== '' && !isNaN(loanAmount))
		{
			var commitmentData = _getCommitmentScheduleAmount();
			if(commitmentData !== null){
				var commitmentAmount = commitmentData.get('commitmentSchAmount');
				var commitmentScheduled = commitmentData.get('commitmentScheduled');

				if(commitmentScheduled && (loanAmount > commitmentAmount))

				{
					returnData.set("limitViolated",true);
					returnData.set("limitAmount",commitmentAmount);
				}	
			}
		}	
		return returnData;
	}
	
	function _getCommitmentScheduleAmount()
	{
		   var boFacilityId =  dj.byId("bo_facility_id").get("value");
		   var repricing_date_value = dj.byId("repricing_date").get('displayedValue');
		   var fac_cur_code = dijit.byId('borrower_limit_cur_code').value;
		   var loan_currency = dijit.byId('ln_cur_code').value;
		   var loan_amount = dijit.byId('ln_amt').value;
		   var commitmentData = new Map();
		   if(!isNaN(loan_amount) && loan_amount >= 0 && repricing_date_value !== "" )
		   {
				m.xhrPost({
					url : m.getServletURL("/screen/AjaxScreen/action/ValidateAmountWithCommitmentSchedule"),
					handleAs : "json",
					preventCache : true,
					sync : true,
					content: { 
							   facilityid 		: boFacilityId,
							   repricing_date	: repricing_date_value,
							   loanAmount		: loan_amount,
							   facilityCurrency	: fac_cur_code,
						       loanCurrency		: loan_currency
						      },
					load : function(response, args){
						commitmentData.set("commitmentSchAmount",response.commitmentSchAmount);
						commitmentData.set("commitmentViolated",response.commitmentViolated);
						commitmentData.set("commitmentScheduled",response.commitmentScheduled);
					},
					error : function(response, args){
						console.log(" Error in validating loan amount with commitment schedule amount", response);
						return null;
					}
				});
		   }else{
			   return null;
		   }
		   return commitmentData;
	}
	
	/**
	 * This method set the effective dat base on intend notice and non business day rule.
	 * @method _setEffectiveDateInHiddenFieldBasedOnNoticeAdvanceDaysForPricingOptions
	 */	
		function _setEffectiveDateInHiddenFieldBasedOnNoticeAdvanceDaysForPricingOptions(){			
			var pricingOptionValue = dijit.byId('pricing_option').get('value');		
			var store = misys._config.pricingOptionsStore;
			store.fetch({
				query: {id: pricingOptionValue},
				onComplete: dojo.hitch(this, function(items, request){
					var item = items[0];	
					if(item)
					{
						     // Pricing option intial notice days count
					        var NoticeDaysCount= item.intentDaysInAdvance;					        
					        var currentDate = new Date();					        
					    	var effectiveDateField = dj.byId('effective_date');
							var month = currentDate.getMonth();
							var year = currentDate.getFullYear(); 
							var day = currentDate.getDate();							
							day=parseInt(day,10)+parseInt(NoticeDaysCount,10);							
							var currentDateForWeekend=new  Date(year, month, day);
						      	//1 for monday,0 for sunday range{0,6}
				        	var dayNumber=currentDateForWeekend.getDay();			        	
				        	if(dayNumber===0 )
			        		{
			        		     //if sunday the increment by 1,
			    		        day=parseInt(day,10)+parseInt(1,10);
			        		
			        		}
				        	else if(dayNumber===6)
				        	{
				        		//If saturday then increment by 2;
				        		day=parseInt(day,10)+parseInt(2,10);
				        	}					        		
							var effectiveDate=new  Date(year, month, day);
							//set the same date in hidden field
							var effectiveDateHiddenField = dj.byId('effective_date_hidden_field');							
							   year = effectiveDate.getFullYear();
							   month = (1 + effectiveDate.getMonth()).toString();
							   month = month.length > 1 ? month : '0' + month;
							   day = effectiveDate.getDate().toString();
							   day = day.length > 1 ? day : '0' + day;
							  //return month + '/' + day + '/' + year;
							effectiveDateHiddenField.set("value",day + '/' +month  + '/' + year);
					}
				})
			});	
		}
	
		/*
		 * This method validates the past dates for effective date field.
		 * @method _pastDateValidationForEffectiveDate
		 */
		
		function _pastDateValidationForEffectiveDate(){
			
			
			var effectiveDateField = dj.byId('effective_date');
			var effectiveDateUnsignedField = dj.byId('effective_date_unsigned');
			var currentServerDate;
			var pricingOptionValue;
			var checkEffectiveDate;
			var selectedEffectiveDate;
			var serverDate;
			if(dj.byId('screenMode').get('value') === 'UNSIGNED'){
				selectedEffectiveDate = convertStringToDate(effectiveDateUnsignedField.get("value"));
				pricingOptionValue = dijit.byId('pricing_option_unsigned').get('value');
			}else{
				selectedEffectiveDate=effectiveDateField.get("value");
				pricingOptionValue = dijit.byId('pricing_option').get('value');	
			}
			var store = misys._config.pricingOptionsStore;
			
			store.fetch({
				query: {id: pricingOptionValue},
				onComplete: dojo.hitch(this, function(items, request){
					var item = items[0];	
					if(item)
					{
				          serverDate= item.serverDate;	
				          currentServerDate=new Date(serverDate);
				          checkEffectiveDate = dijit.byId('effective_date_hidden_field');
				          checkEffectiveDate.set("value",currentServerDate);
					}
				})
			});		
			
			m._config = m._config || {};
			m._config.repricingDatesValidationInprocess = false;

			if (!m._config.repricingDatesValidationInprocess) {
				// checks the calculated effecitbe dtae is smaller or equals to entered date.
					if (misys._config.displayMode === "edit" && selectedEffectiveDate<currentServerDate) {
						m._config.repricingDatesValidationInprocess = true;
						this.invalidMessage = m.getLocalization("intendNoticeDaysErrorMsgForDrawDown");
						return false;
	
					}
					else {
						if(dj.byId('screenMode').get('value') === "UNSIGNED" && selectedEffectiveDate<currentServerDate){
							m._config.onSubmitErrorMsg=m.getLocalization("unsignedEffectiveDateLesserThanApplDate");
							return false;
					}
					}
			}
			m._config.repricingDatesValidationInprocess = false;
			return true;
		}
		
		/*
		 * This method validates the past dates for effective date field wr.t applcation date.
		 * @method checkPastDateOfCalenderForEffectiveDate
		 */
		
		function checkPastDateOfCalenderForEffectiveDate(){

			//var selectedDate= dijit.byId('repricing_date').get("value");
			var selectedEffectiveDate= dijit.byId('effective_date').get("value");
			var pricingOptionValue;
			var serverDate;
			var applicationDateObject;
			//get the application date
			if(dj.byId('screenMode').get('value') === 'UNSIGNED'){
				pricingOptionValue = dijit.byId('pricing_option_unsigned').get('value');
			}else{
				pricingOptionValue = dijit.byId('pricing_option').get('value');	
			}
			var store = misys._config.pricingOptionsStore;
			
			store.fetch({
				query: {id: pricingOptionValue},
				onComplete: dojo.hitch(this, function(items, request){
					var item = items[0];	
					if(item)
					{
					           serverDate= item.serverDate;	
					           applicationDateObject=new Date(serverDate);
					}
				})
			});	
				
			if(selectedEffectiveDate>=applicationDateObject){
				
				return true;
			}
			else{
				return false;
			}
			
			
		}
		
		/*
		 * This method validates the past dates for repricing date field wr.t effective date.
		 * @method checkPastDateOfCalenderForRepricingDate
		 */
		
		function checkPastDateOfCalenderForRepricingDate(){
			
			var selectedDate= dijit.byId('repricing_date').get("value");
			var selectedEffectiveDate= dijit.byId('effective_date').get("value");
			if(selectedDate>selectedEffectiveDate){	
				return true;
			}
			else{
				return false;
			}
		}
		
		
	/**
	 * Populates the Repricing Frequency Drop Down based on the Pricing Options
	 * 
	 * @method _populateRepricingFrequency
	 */
	function _populateRepricingFrequency() {
		
		var pricingOption = dijit.byId('pricing_option');
		var repricingFrequency = dijit.byId('repricing_frequency');
		
		// clear
		repricingFrequency.set('value', '');
		
		var pricingOptionValue = pricingOption.get('value');
		
		// get associated store
		var store = misys._config.repricingFrequenciesStores[pricingOptionValue];
		
		if (store) 
		{
			repricingFrequency.set('store', new dojo.data.ItemFileReadStore(store));

			var storeSize = 0;
			var getSize = function(size, request){
							storeSize = size;
						};

			repricingFrequency.get('store').fetch({query: {}, onBegin: getSize, start: 0, count: 0});
		
			// if Store is empty (pricing option has no repricing frequency)
			// remove required attribute
			if (storeSize == 0)
			{
				misys.toggleRequired('repricing_frequency', false);
				misys.toggleRequired('repricing_date', false);
				dj.byId("repricing_date").set('displayedValue','');
				dj.byId("repricing_date").set('disabled', true);
				dj.byId("repricing_frequency").set('disabled', true);
			}
			else
			{
				//if there is only one repricing frequency associated with pricing option set this as default selected in the select box
				if(storeSize == 1){
					repricingFrequency.store.fetch({
						onComplete: function(items, request){ 
							dojo.forEach(items,function(item){
								repricingFrequency.set('value',item.id);
								repricingFrequency.set('displayedValue', item.name[0]);
							});
						}});
				}
			}
		}
		
	}
	
	/**
	 * Populates the Facility Currencies in Drop Down based on the Pricing Options.
	 * 
	 * @method _populatePricingOptionCurrencies
	 */
	function _populatePricingOptionCurrencies(onload) {
		
		var pricingOption = dijit.byId('pricing_option');
		var lnCurCode = dijit.byId('ln_cur_code');
		var lnAmt = dijit.byId('ln_amt');
		var pricingOptionValue = pricingOption.get('value');
		
		// get associated store based on pricing option
		var store = misys._config.facCurrencyStores[pricingOptionValue];
		
		if(store)
		{
			if(store.data && store.data.items && store.data.items.length === 0)
			{
				lnCurCode.set('store', misys._config.currenciesStore);
				misys._config.isValid=false;
				
			}
			else 
			{
				//MPS-45363 case,check the currciesstore is having the value consist in faccurrencystore?If Yes then display
				//the value else no need to display anything.
				var isValid=false;
				var facCurrenciesStoreItem;
				var currencyStoreItem;
				var currencyStoreValues;
				for(var j=0;j<store.data.items.length;j++){
					facCurrenciesStoreItem=store.data.items[j].name;
				}
				if(misys._config.currenciesStore._jsonData!==null)
				{
					 currencyStoreItem=misys._config.currenciesStore._jsonData.items;
					
					for(var i=0;i<currencyStoreItem.length;i++)
					{
						currencyStoreValues=currencyStoreItem[i].name;	
						if ((facCurrenciesStoreItem instanceof Array && 
								facCurrenciesStoreItem[0]===currencyStoreValues) || facCurrenciesStoreItem===currencyStoreValues)
						{
							isValid=true;
							break;									
						}
					}
				}
				if(misys._config.currenciesStore._arrayOfAllItems!==null)
				{
					currencyStoreItem=misys._config.currenciesStore._arrayOfAllItems;
					for(var k=0;k<currencyStoreItem.length;k++)
					{
						currencyStoreValues=currencyStoreItem[k].name;	
						if (facCurrenciesStoreItem instanceof Array)
						{
							if(facCurrenciesStoreItem[0]===currencyStoreValues[0].trim())
							{
								isValid=true;
								break;									
							}								
						}
						else
						{
							if(facCurrenciesStoreItem===currencyStoreValues[0].trim())
							{
								isValid=true;
								break;									
							}							
					    }
					}
					
				}
				if(isValid){				
				    lnCurCode.set('store', new dojo.data.ItemFileReadStore(store));
				    misys._config.isValid=false;
				}
				else
				{					
					lnCurCode.set('value', '');
					lnCurCode.set('store', null);
					misys._config.isValid=true;
			
				}		
			}
				
			var storeSize = 0;
			var getSize = function(size, request){
				storeSize = size;
			};
			
			if(lnCurCode.get('store')){
				lnCurCode.get('store').fetch({query: {}, onBegin: getSize, start: 0, count: 0});
			}
		
			// if Store is empty (pricing option has no related currency)
			// remove required attribute
			if (storeSize === 0)
			{
				misys.toggleRequired('ln_cur_code', false);
				lnCurCode.set('displayedValue','');
				lnCurCode.set('disabled', true);
				
				misys.toggleRequired('ln_amt', false);
				lnAmt.set('displayedValue','');
				lnAmt.set('disabled', true);
			}
			else
			{
				// clear existing value
				if(onload !== true)
				{
				lnCurCode.set('value', '');
				lnCurCode.set("state", "Incomplete");
				}
				/*lnCurCode.set('disabled', false);
				misys.toggleRequired('ln_cur_code', true);*/
				
				if(storeSize === 1 && lnCurCode.store && lnCurCode.store._arrayOfAllItems.length) 
				{
					// Default the currency - as the drop-down contains only one currency item.  
					lnCurCode.set('value', lnCurCode.store._arrayOfAllItems[0].id[0]);
					lnCurCode.set('displayedValue', lnCurCode.store._arrayOfAllItems[0].id[0]);
					/*lnAmt.set('disabled', false);
					misys.toggleRequired('ln_amt', true);
					lnAmt.set("state", "");*/
				}
			}
		}
		if(misys._config.isValid){
			m.dialog.show('ERROR',misys.getLocalization('ErrorMessageForLoanCurrency'));
		}		
	}
	
	/**
	 * Update all the pricing option dependent fields
	 * 
	 * @method _updatePricingOptionDependentFields
	 */
	function _updatePricingOptionDependentFields(onload)
	{
		var pricingOptionValue = dijit.byId('pricing_option').get('value');
		dj.byId("ln_maturity_date").set('disabled', true);
		if(misys._config.maturityMandatoryOptions && misys._config.maturityMandatoryOptions.data && misys._config.maturityMandatoryOptions.data.items)
		{
			dojo.forEach(misys._config.maturityMandatoryOptions.data.items,function(item){
				if(pricingOptionValue === item.id)
				{
					// Pricing option based Loan Maturity Date
					if(item.maturityDateMandatory === 'Y')
					{
						dj.byId("ln_maturity_date").set('disabled', false);
						m.toggleRequired("ln_maturity_date", true);
						if(!dj.byId('ln_maturity_date').get('value') && dj.byId('facility_maturity_date'))
						{
							dj.byId('ln_maturity_date').set('displayedValue',dj.byId('facility_maturity_date').get('value'));
						}
					}
					else
					{
						if(onload)
						{
							dj.byId('ln_maturity_date').set('displayedValue','');
						}
						m.toggleRequired("ln_maturity_date", false);
						dj.byId("ln_maturity_date").set('disabled', true);
					}

					// Pricing Option based Match Funding
					if(dj.byId('match_funding'))
					{
						if(item.matchFundedIndicator && item.matchFundedIndicator === 'Y')
						{
							dj.byId('match_funding').set('value', 'Y');
						}
						else
						{
							dj.byId('match_funding').set('value', 'N');
						}
					}					
				}
			});
		}
		// Populates the Facility Currencies in Drop Down based on the Pricing Options.
		_populatePricingOptionCurrencies(onload);
	} 
	
	/**
	 * Setup the Remittance Instructions for Loan
	 * 
	 * @method _setupRemittanceInstructions
	 */
	function _setupRemittanceInstructions(/*boolean*/disabledSelection){
		var data = {
        		identifier : 'description',
    			label : 'description',
    			items : misys._config.remittanceInstructions
		};
		var remittanceInstStore = new dojo.data.ItemFileReadStore({data : data});
		
		var remInst = dijit.byId('gridRemittanceInstruction');
		if(remInst)
		{
			remInst.set('store', remittanceInstStore);
			remInst.startup();
			remInst.render();
			var remittanceInstDescriptionHiddenValue = dj.byId('rem_inst_description_view'),
			remittanceInstLocationCodeHiddenValue = dj.byId('rem_inst_location_code_view'),
			remittanceInstServicingGrpHiddenValue = dj.byId('rem_inst_servicing_group_alias_view');
			remInst.store.fetch({
				query: {preferred: '*'}, 
				onComplete: dojo.hitch(this, function(items, request){
					dojo.forEach(items, function(item, index){
						if(item.preferred[0] === 'Y' && remittanceInstDescriptionHiddenValue.get('value') === '')
						{
							remInst.selection.select(index);
						}
						else if(remittanceInstDescriptionHiddenValue.get('value') === item.description[0] && remittanceInstLocationCodeHiddenValue.get('value') === item.locationCode[0] && remittanceInstServicingGrpHiddenValue.get('value') === item.servicingGroupAlias[0])
						{
							remInst.selection.select(index);
						}
						else
						{
							remInst.selection.deselect(index);
						}
						if(disabledSelection)
						{
							remInst.rowSelectCell.setDisabled(index, true);
						}else{
							remInst.rowSelectCell.setDisabled(index, false);
						}
					}, this);
				})
			});
		}
	}
	
	
	
	
	/**
	 * Setup the Remittance Instructions for Loan based on currency
	 * 
	 * @method _setupRemittanceInstructionsBasedOnCurrency
	 */
	function _setupRemittanceInstructionsBasedOnCurrency(){
		var data = {
        		identifier : 'description',
    			label : 'description',
    			items : misys._config.remittanceInstructions
		};
		var currencyValue;
		var count = 0 ;
		var operation = dj.byId('operationValue').get("value") ;
		var remittanceFlag = dijit.byId('remittance_flag').get("value") ;
		
		if(dj.byId('screenMode').get('value') === 'UNSIGNED')
		{
			currencyValue=dj.byId("ln_cur_code_unsigned").get("value");
		}
		else{
			currencyValue=dj.byId("ln_cur_code").get("value");	
		}
		var dataLength = 0;
		if(data.items && data.items.length){

		  dataLength=data.items.length;

		}
		var y;
		var FilterData=new Array();
		for(y=0 ; y<dataLength ; y++){
			
			if(currencyValue===data.items[y].currency[0]){
				count++ ;
				FilterData.push(data.items[y]);
			}
		}
			var FilterDataValues = {
        		identifier : 'description',
    			label : 'description',
    			items : FilterData
		};
		var remittanceInstStore = new dojo.data.ItemFileReadStore({data : FilterDataValues});
		var remInst = dijit.byId('gridRemittanceInstruction');
		if(remInst)
		{
			remInst.set('store', remittanceInstStore);
			/*remInst.startup();*/
			/*remInst.render();*/
			window.setTimeout(function(){
				remInst.startup();
			}, 300);
			console.log("Remittance Intructions Grid Started");
			
			window.setTimeout(function(){
				remInst.render();
			}, 600);
			console.log("Remittance Intructions Grid Rendered");
			var remittanceInstDescriptionHiddenValue = dj.byId('rem_inst_description_view'),
			remittanceInstLocationCodeHiddenValue = dj.byId('rem_inst_location_code_view'),
			remittanceInstServicingGrpHiddenValue = dj.byId('rem_inst_servicing_group_alias_view');
			remInst.store.fetch({
				query: {preferred: '*'}, 
				onComplete: dojo.hitch(this, function(items, request){
					dojo.forEach(items, function(item, index){
						if(item.preferred[0] === 'Y' && remittanceInstDescriptionHiddenValue.get('value') === '')
						{
							remInst.selection.select(index);
						}
						else if(remittanceInstDescriptionHiddenValue.get('value') === item.description[0] && remittanceInstLocationCodeHiddenValue.get('value') === item.locationCode[0] && remittanceInstServicingGrpHiddenValue.get('value') === item.servicingGroupAlias[0])
						{
							remInst.selection.select(index);
						}
					
						 var modeValue = dijit.byId("mode") ? dijit.byId("mode").get("value") : "";
						 if((remittanceFlag === "mandatory" && count > 1 && operation === "NEW_DRAWDOWN") || (remittanceFlag === "true" && operation === "NEW_DRAWDOWN")){
							 remInst.selection.deselect(index) ;
							}else if(dijit.byId('remittance_flag').get("value")==="mandatory"){
								if(FilterData.length===parseInt("1",10)){
									remInst.selection.select(index);
								}
							}	
						
					}, this);
				})
			});
		}
	}
	
	/**
	 * Date addition utility
	 * 
	 * @method _addDates
	 */
	function _addDates(date)
	{
		var repFreq = dj.byId('repricing_frequency');
		if(date.get('value') && repFreq.get('value'))
		{
			var frequency = repFreq.get('value'),
			frequencyNo,
			frequencyMultiplier,
			frequencyMultiplierFullForm;
			
			if(frequency.length > 0)
			{
				frequencyNo = frequency.substring(0, frequency.length - 1);
				frequencyMultiplier = frequency.substring(frequency.length - 1, frequency.length);
			}
			
			if(frequencyMultiplier === 'W')
			{
				frequencyMultiplierFullForm = 'week';
			}
			else if (frequencyMultiplier === 'M')
			{
				frequencyMultiplierFullForm = 'month';
			}
			else if(frequencyMultiplier === 'Y')
			{
				frequencyMultiplierFullForm = 'year';
			}
			else if(frequencyMultiplier === 'D')
			{
				frequencyMultiplierFullForm = 'day';
			}
			
			return dojo.date.add(date.get('value'), frequencyMultiplierFullForm, parseInt(frequencyNo, 10));
		}
	}
	
	/**
	 * Calculate the Repricing Date
	 * 
	 * @method _calculateRepricingDate
	 */
	function _calculateRepricingDate(){
		
		 var repricingDate = dj.byId('repricing_date');
		 var effDate = dj.byId('effective_date');
		 var repFreq = dj.byId('repricing_frequency');
		 var pricingOption = dj.byId("pricing_option");
			if(effDate.get('value'))
			{
				if(misys._config.repricingFrequenciesStores[pricingOption.get("value")].data.items.length !== 0)
				{
					repFreq.set('disabled', false);
					misys.toggleRequired('repricing_frequency', true);
					if(repFreq.get("value"))
					{
						dj.byId("repricing_date").set('disabled', false);
						misys.toggleRequired('repricing_date', true);
						repricingDate.set('displayedValue','');
						repricingDate.set('value', _addDates(effDate));
						
						if(misys._config.isRepricingDateFlag){            		
		            		_setRepricingDateAsPerTheBusinessDayRule();
		            		misys._config.isRepricingDateFlag=false;
		            	}else{
		            		misys._config.isRepricingDateFlag=true;
		            	} 
					}
				}
			}
	}
	
	/**
	 * Update the Repricing Frequency
	 * 
	 * @method _controlRepricingFrequency
	 */
	function _controlRepricingFrequency(){
		var effDate = dj.byId('effective_date');
        var calculatedRepricingDate = _addDates(effDate);
        var repriceDate = dj.byId('repricing_date').get('value');
        
		if(repriceDate.getDate() === calculatedRepricingDate.getDate() &&
				repriceDate.getMonth() === calculatedRepricingDate.getMonth() && 
				repriceDate.getYear() === calculatedRepricingDate.getYear())
		{
			misys.toggleRequired('repricing_frequency', true);
			dj.byId('repricing_frequency').set('disabled', false);
		}
		else
		{
			misys.toggleRequired('repricing_frequency', false);
			dj.byId('repricing_frequency').set('disabled', true);
		}
		
	}
	/*
	 * @method _setDefaultEffectiveDate
	 * This method sets the value of effective date in hidden field on change of currency.
	 */
	function _setDefaultEffectiveDate(){
		var effectiveDateField=dijit.byId('effective_date');
		var defaultEffectiveDate=dijit.byId('default_effective_date');
		if(effectiveDateField && effectiveDateField.get('value')!=""){
			defaultEffectiveDate.set("value",effectiveDateField.get('displayedValue'));			
		}		
	}
	
	/*
	 * @method _setDefaultEffectiveDateOnLoad
	 * This method make the ajax call on load of screen  and sets the default effective date.
	 * 
	 */
	
	function _setDefaultEffectiveDateOnLoad(){
		var boFacilityId =  dj.byId("bo_facility_id").get("value");
		var pricingOptionName =  dj.byId("pricing_option").get("value");
		var effectiveDate =  dj.byId("appl_date").get("value");
		var currency = dj.byId("ln_cur_code").get("value");
		var isRepricingDate = 'N';
		
		if(pricingOptionName!=="" && effectiveDate!=="" && currency!=="" ){	
			
			
		 		//console.debug('[Loan Drawdown] Checking for Borrower deals');
				m.xhrPost({
					url : m.getServletURL(urls),
					handleAs : "json",
					preventCache : true,
					sync : true,
					content : {
						boFacilityId : boFacilityId,
						pricingOptionName : pricingOptionName,
						dateToValidate : effectiveDate,
						currency : currency,
						isRepricingDate : isRepricingDate
					},				
					load : function(response)
					{
						console.log("success");
						misys._config.dateValuesResponse = response;						
						_populateDefaultEffectiveDate(response['items']);
						
					},
					error : function(response) 
				    {
						console.log("error");
				    	console.debug(debugMsg);
				    			
				    }		    
				});		
		}	
	} 
	
	/**
	 * If there is only one pricing option associated with the selected facility set 
	 * this as default selected in the select box
	 *  
	 * @method setPricingOptionDefaultValue
	 */
	function setPricingOptionDefaultValue(onload){
		
		var pricingOptionsStore = misys._config.pricingOptionsStore;
		var storeSize = 0;
		var sizeFunc = function (size, request){
			storeSize = size;
			};
		pricingOptionsStore.fetch({query: {}, onBegin: sizeFunc, start: 0, count: 0});
		if(onload){
			if(storeSize === 1){
				pricingOptionsStore.fetch({
					onComplete: function(items, request){ 
						dojo.forEach(items,function(item){
							
							dijit.byId('pricing_option').set('value',item.name[0]);
							dijit.byId('pricing_option').set('displayedValue', item.name[0]);
						});
					}});
			}
		}
	}
	
	/**
	 * If there is only one risk type associated set 
	 * this as default selected in the select box
	 *  
	 * @method setRiskTypeDefaultValue
	 */
	function setRiskTypeDefaultValue(onload){
		
		var riskTypesStore = misys._config.riskTypesStore;
		var storeSize = 0;
		var sizeFunc = function (size, request){
			storeSize = size;
			};
		riskTypesStore.fetch({query: {}, onBegin: sizeFunc, start: 0, count: 0});
		var risktype = dijit.byId('risk_type');
		if(onload){
			if(storeSize === 1){
				riskTypesStore.fetch({
					onComplete: function(items, request){ 
						dojo.forEach(items,function(item){
							dijit.byId('risk_type').set('value',item.name[0]);
							dijit.byId('risk_type').set('displayedValue',item.name[0]);
							dijit.byId('risk_type').set('disabled',true);

						});
					}});
			}
		}
	}
	
	//Config 
	d.mixin(m._config, {

		/**
		 * Initialize Reauth Parameters
		 * 
		 * @method initReAuthParams
		 */
		initReAuthParams : function() {
									
			var reAuthParams = {
				productCode : 'LN',	
				subProductCode : '',
				transactionTypeCode : '01',	
				entity : dj.byId("entity") ? dj.byId("entity").get("value") : '',
				currency : dj.byId("ln_cur_code") ? dj.byId("ln_cur_code").get('value') : '',
				amount : dj.byId("ln_amt") ? m.trimAmount(dj.byId("ln_amt").get('value')) : '',
				
				es_field1 : '',
				es_field2 : ''				
			};
			return reAuthParams;
		}
	});
	
	// Public functions & variables follow
    d.mixin(m, {
 
    	/**
    	 * bind validations and connections
    	 * @method bind
    	 */
    	bind : function() {
            // event bindings go here
    		if(d.isIE){
	        		window.isDrawdown = true;
	        	}
	        	else{
	        		window.isDrawdown = false;
	        }
    		m.connect('ln_amt', 'onBlur', _validateLoanAmount);
    		m.connect('pricing_option','onChange',function(){
    			dijit.byId('ln_cur_code').set("disabled", false);
    			misys.toggleRequired('ln_cur_code', true);
    			//dijit.byId('ln_cur_code').focus();
    			if(dijit.byId('ln_cur_code') && dijit.byId('ln_cur_code').get('value') !== null){
    				dijit.byId('ln_amt').set('disabled', true);
					misys.toggleRequired('ln_amt', false);
    				dijit.byId('effective_date').set("disabled", true);
					misys.toggleRequired('effective_date', false);
    			}
    			if(dijit.byId('effective_date') && dijit.byId('effective_date').get('value') !== null){
    				dijit.byId('effective_date').set('value',"");
    				dijit.byId('effective_date').set('displayedValue',"");
    			}
    			if(dijit.byId('repricing_date') && dijit.byId('repricing_date').get('value') !== null){
    				dijit.byId('repricing_date').set('value',"");
    				dijit.byId('repricing_date').set('displayedValue',"");
    			}});
        	m.connect('pricing_option','onChange', _updatePricingOptionDependentFields);
        	misys.connect('pricing_option', 'onChange', _populateRepricingFrequency);
        	
            m.connect('effective_date','onChange', function(){
	            	if(misys._config.isEffectiveDateFlag && checkPastDateOfCalenderForEffectiveDate()){            		
	            		_setEffectiveDateAsPerTheBusinessDayRule();
	            	}else{
	            		misys._config.isEffectiveDateFlag=true;
	            	}            	
            	});
            m.connect('effective_date','onChange', _calculateRepricingDate);
         //   m.connect('repricing_date','onChange',_setRepricingDateAsPerTheBusinessDayRule);
            m.connect('repricing_date','onChange', function(){
            	if(misys._config.isRepricingDateFlag && checkPastDateOfCalenderForRepricingDate()){            		
            		_setRepricingDateAsPerTheBusinessDayRule();
            	}else{
            		misys._config.isRepricingDateFlag=true;
            	}
            	if(dijit.byId('repricingdate_validation').value == 'true'){
            		if(_validateLoanAmount()){
            			dijit.byId('ln_amt').set("state","");
            		}
            	}
            	
        	});
            m.connect('repricing_frequency','onChange', _calculateRepricingDate);
            m.connect('ln_maturity_date','onChange', _calculateRepricingDate);
            misys.connect('issuing_bank_abbv_name', 'onChange', misys.populateReferences);
            misys.setValidation('effective_date', _validateLoanEffectiveDate);
        	misys.setValidation('ln_maturity_date', _validateLoanMaturityDate);
        	m.connect('repricing_frequency','onChange', _validateLoanRepricingDate);
//        	misys.setValidation('repricing_frequency', _validateLoanRepricingDate);
            
            
        	if(dijit.byId('issuing_bank_abbv_name'))
        	{
        		misys.connect('entity', 'onChange', function(){dijit.byId('issuing_bank_abbv_name').onChange();});
        	}	
        	
        	misys.connect('ln_cur_code', 'onChange', function(){
        		misys.setCurrency(this, ['ln_amt']);
        		var lnAmt = dijit.byId('ln_amt');
        		var lnCurCode = dijit.byId('ln_cur_code');
        		lnAmt.focus();
        		lnAmt.onBlur();
        		if(lnCurCode && lnCurCode.get('value') !== "")
        		{
        			lnAmt.set('disabled', false);
					misys.toggleRequired('ln_amt', true);
					dijit.byId('effective_date').set("disabled", false);
					misys.toggleRequired('effective_date', true);
					if(dijit.byId('effective_date') && dijit.byId('effective_date').get('value') !== null){
	    				dijit.byId('effective_date').set('value',"");
	    				dijit.byId('effective_date').set('displayedValue',"");
	    			}
					_setEffectiveDateAsPerTheBusinessDayRule();
					_setDefaultEffectiveDate();
        		}
        		else if(lnCurCode && lnCurCode.get('value') === "")
        		{
        			lnAmt.set('disabled', true);
					misys.toggleRequired('ln_amt', false);
					dijit.byId('effective_date').set("disabled", true);
					misys.toggleRequired('effective_date', false);
        		}
      		
        		populateFXDetails();
        		_setupRemittanceInstructions(false);
        		_setupRemittanceInstructionsBasedOnCurrency();
        		
        	});
        	
        	if(dj.byId('screenMode').get('value') === 'UNSIGNED')
        	{
        		_setupRemittanceInstructions(true);
        		_setupRemittanceInstructionsBasedOnCurrency();
        	}
        	m.connect("cancelReauthentication", "onClick", function(){
        	dijit.byId('fx_conversion_rate').set('disabled', true);
        	});
        	
        	//Enable ln_cur_code & ln_amt field on change of risk_type
        	//Commenting this as a part of 	MPS-44298
        	/*m.connect("risk_type", "onChange", function(){
        		dijit.byId('ln_cur_code').set('disabled', false);
				misys.toggleRequired('ln_cur_code', true);
        		dijit.byId('ln_amt').set('disabled', false);
        		misys.toggleRequired('ln_amt', true);
        		dijit.byId('ln_amt').set("state", "");
        		
        		if(misys._config.isValid){
        			m.dialog.show('ERROR',misys.getLocalization('ErrorMessageForLoanCurrency'));
        		}
            });*/
        	var interestDetailsGridLayout = dj.byId("gridLoanInterestDetails");
        	if(interestDetailsGridLayout){
				var interestDetailsStore = interestDetailsGridLayout.store;
				interestDetailsStore.comparatorMap = {};
				interestDetailsStore.comparatorMap['interest_cycle'] = misys.grid.sortAmountColumn;
				interestDetailsStore.comparatorMap['start_date'] = misys.grid.sortDateColumn;
				interestDetailsStore.comparatorMap['end_date'] = misys.grid.sortDateColumn;
				interestDetailsStore.comparatorMap['adjusted_due_date'] = misys.grid.sortDateColumn;
				interestDetailsStore.comparatorMap['projected_cycleDue_amt'] = misys.grid.sortAmountColumn;
				interestDetailsStore.comparatorMap['accrued_toDate_amt'] = misys.grid.sortAmountColumn;
				interestDetailsStore.comparatorMap['paid_toDate_amt'] = misys.grid.sortAmountColumn;
				interestDetailsStore.comparatorMap['billed_interest_amt'] = misys.grid.sortAmountColumn;
        	}
        },
        
        /**
         * Toggle Remittance Instructions
         * 
         * @method toggleRemittanceInst
         */
        toggleRemittanceInst : function(){
			var downArrow = d.byId("actionDown");
			var upArrow = d.byId("actionUp");
			var remittanceInstDiv = d.byId("remittanceInstContainer");
			if(d.style("remittanceInstContainer","display") === "none")
			{
				m.animate('wipeIn',remittanceInstDiv);
				d.style('actionDown',"display","none");
				d.style('actionUp',"display","block");
				d.style('actionUp', "cursor", "pointer");
				dijit.byId('gridRemittanceInstruction')._refresh(); 
			}
			else
			{
				m.animate('wipeOut',remittanceInstDiv);
				d.style('actionUp',"display","none");
				d.style('actionDown',"display","block");
				d.style('actionDown', "cursor", "pointer");
			}
		},
		
        /**
         * Toggle Loan Interest Details Grid
         * 
         * @method toggleLoanInterestDetails
         */
		toggleLoanInterestDetails : function(){
			var downArrow = d.byId("actionDown");
			var upArrow = d.byId("actionUp");
			var loanInterestDetailstDiv = d.byId("loanInterestDetailsContainer");
			if(d.style("loanInterestDetailsContainer","display") === "none")
			{
				m.animate('wipeIn',loanInterestDetailstDiv);
				dj.byId('gridLoanInterestDetails').resize();
				d.style('actionDown',"display","none");
				d.style('actionUp',"display","block");
				d.style('actionUp', "cursor", "pointer");
			}
			else
			{
				m.animate('wipeOut',loanInterestDetailstDiv);
				d.style('actionUp',"display","none");
				d.style('actionDown',"display","block");
				d.style('actionDown', "cursor", "pointer");
			}
		},
 
		/**
		 * On Form Load Events
		 * @method onFormLoad
		 */
        onFormLoad : function() {
        	if(misys._config.displayMode=== "view")
        	{
        		populateFXDetails();
        	}
        	if(dj.byId('effective_date') && misys._config.displayMode!== "edit")
        	{
        	  _setEffectiveDateHiddenFieldValueOnLoad();
        	}
        	_setDefaultEffectiveDateOnLoad();
        	if(misys._config.displayMode=== "edit")
        	{
//        		if(dj.byId('effective_date') && dj.byId('effective_date').get("value") !== ""){
//        			dj.byId('effective_date').set("value", "");
//        			dj.byId('effective_date').set("displayedValue", "");
//        		}
        		_setEffectiveDateAsPerTheBusinessDayRule();
        	}
        	
        	misys._config.warningMessages = [];
        	
            // form onload events go here
        	misys.setCurrency(dijit.byId('ln_cur_code'), ['ln_amt']);
        	
        	// Populate references
        	var issuingBankAbbvName = dijit.byId('issuing_bank_abbv_name');
        	if(issuingBankAbbvName)
        	{
        		issuingBankAbbvName.onChange();
        	}
        	
        	var issuingBankCustRef = dijit.byId('issuing_bank_customer_reference');
        	if(issuingBankCustRef)
        	{
        		issuingBankCustRef.onChange();
        		//Set the value selected if any
        		//issuingBankCustRef.set('value',issuingBankCustRef._resetValue);
        	}
        	
        	if(dj.byId('repricing_frequency_view') && dj.byId('repricing_frequency'))
        	{
        		_populateRepricingFrequency();
        		dj.byId('repricing_frequency').set('value',dj.byId('repricing_frequency_view').get('value'),false);
        		var repricingDate = dj.byId('repricing_date');
       		 	var effDate = dj.byId('effective_date');
       		 	var repFreq = dj.byId('repricing_frequency');
       		
       		 if(effDate.get('value') && repFreq.get('value') && repricingDate.get('value'))
       		 {
        	 	dj.byId('repricing_date').onChange();
           	 }
        	}   
        	
      	    if(dijit.byId('operationValue') && dijit.byId('operationValue').get('value') === 'NEW_DRAWDOWN')
			{
				setPricingOptionDefaultValue(true);
			}
        	
	        setRiskTypeDefaultValue(true);
	        _updatePricingOptionDependentFields(true);
	          
               	
        	if(!dijit.byId('ln_cur_code').get('value'))
        	{
       			dijit.byId('ln_amt').set('disabled', true);
       			misys.toggleRequired('ln_amt', false);
       		}

        	if(!dijit.byId('pricing_option').get('value'))
        	{
        		dijit.byId("ln_cur_code").set('disabled', true);
				misys.toggleRequired('ln_cur_code', false);
				
				dijit.byId("ln_amt").set('disabled', true);
				misys.toggleRequired('ln_amt', false);
				
				dj.byId('effective_date').set('disabled', true);
				misys.toggleRequired('effective_date', false);
				
        		// Repricing Frequency is Disabled, so it should also be marked as Not-required 
        		dijit.byId("repricing_frequency").set('disabled', true);
        		misys.toggleRequired('repricing_frequency', false);
        		
        		// Repricing Date is Disabled, so it should also be marked as Not-required 
				dijit.byId("repricing_date").set('disabled', true);
				misys.toggleRequired('repricing_date', false);
				dijit.byId("ln_cur_code").set('disabled', true);
				misys.toggleRequired('ln_cur_code', false);
				
				dijit.byId("ln_amt").set('disabled', true);
				misys.toggleRequired('ln_amt', false);
				dijit.byId("ln_maturity_date").set('disabled', true);
				misys.toggleRequired('ln_maturity_date', false);
        	}

        	if(dijit.byId('operationValue') && dijit.byId('operationValue') !== '' && dijit.byId('operationValue').get('value') === 'NEW_DRAWDOWN'){
				_setupRemittanceInstructions(true);
        	}else{
        		_setupRemittanceInstructions(false);
        	}
        	
        	if(dijit.byId('ln_cur_code').get('value')!=="")
        	{
         		_setupRemittanceInstructionsBasedOnCurrency();
        	}
        	

			if(dijit.byId('remittance_flag').get("value")==="mandatory" ){
			//	d.byId("remittanceInstContainer").setStyle("display","block");
				dojo.style(d.byId("remittanceInstContainer"), "display", "block");
				dijit.byId('gridRemittanceInstruction')._refresh(); 
				}
        	
        	populateFXDetails();
        	if(!dj.byId("repricing_frequency").get("value")){
				dj.byId("repricing_date").set("disabled", true);
				m.toggleRequired("repricing_date", false);
			}
        	
        	_validateLoanAmount();
        	//To set a hidden aria-label for the address fields 
        	try {
        		var borrowerAddressLine2 = "#borrower_address_line_2";
        		var borrowerDom = "#borrower_dom";
        		var ariaLabel = 'aria-label';
				if(dojo.query(borrowerAddressLine2) && dojo.query(borrowerAddressLine2)[0] !== undefined ) {
					var addressLine2Field = dojo.query(borrowerAddressLine2)[0]; 
					dojo.attr(addressLine2Field, ariaLabel, misys.getLocalization('ADDRESS_LINE_2_LABEL'));
				}
				if(dojo.query(borrowerDom) && dojo.query(borrowerDom)[0] !== undefined ) {
					var addressLine3Field = dojo.query(borrowerDom)[0]; 
					dojo.attr(addressLine3Field, ariaLabel, misys.getLocalization('ADDRESS_LINE_3_LABEL'));
				}
				if(dojo.query("#ln_amt") && dojo.query("#ln_amt")[0] !== undefined ) {
					var lnAmtField = dojo.query("#ln_amt")[0]; 
					dojo.attr(lnAmtField, ariaLabel, misys.getLocalization('LOAN_AMOUNT_AMOUNT_FIELD_LABEL'));
				}				
				
			} catch (exc) {
				//Do nothing
			}
        },
        
        /**
         * Before Save Validations
         * 
         * @method beforeSaveValidations
         */
		beforeSaveValidations : function(){
	    	var entity = dj.byId("entity") ;
	    	if(entity && entity.get("value") === "")
            {
                    return false;
            }
            else
            {
                    return true;
            }
        },
 
        
        /**
         * Toggle Legal Text Details Grid
         * 
         * @method toggleLegalTextDetails
         */
		toggleLegalTextDetails : function(){
			var downArrow = d.byId("actionDown");
			var upArrow = d.byId("actionUp");
			var LegalDetailsDiv = d.byId("LegalTextContainer");
			if(d.style("LegalTextContainer","display") === "none")
			{
				m.animate('wipeIn',LegalDetailsDiv);
				d.style('actionDown',"display","none");
				d.style('actionUp',"display","block");
				d.style('actionUp', "cursor", "pointer");
			}
			else
			{
				m.animate('wipeOut',LegalDetailsDiv);
				d.style('actionUp',"display","none");
				d.style('actionDown',"display","block");
				d.style('actionDown', "cursor", "pointer");
			}
		},		
		
		/**
		 * <h4>Summary:</h4>
		 * 
		 *  	This methods could be used navigate to Product specific listing screens.
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
			var targetUrl = misys._config.homeUrl;
			var cancelButtonURL = ["/screen/LoanScreen?", "operation=LIST_DEALS"];
			targetUrl = misys.getServletURL(cancelButtonURL.join(""));
			return targetUrl;
		},
		
		 setCustomConfirmMessage : function(){
		    	console.log('In custom confirmation');
		    	var currency = null, amount = null;
		    	
		    	if(dj.byId('screenMode').get('value') === 'UNSIGNED'){
		    		currency = dj.byId('ln_cur_code_unsigned') && dj.byId('ln_cur_code_unsigned').get('value') != null ? dj.byId('ln_cur_code_unsigned').get('value') : "";
		    		amount = dj.byId('ln_amt_unsigned') && dj.byId('ln_amt_unsigned').get('value') != null ? dj.byId('ln_amt_unsigned').get('value') : "";
		    	}
		    	else{
		    		currency = dj.byId('ln_cur_code') && dj.byId('ln_cur_code').get('value') != null ? dj.byId('ln_cur_code').get('value') : "";
		    		amount = (dj.byId('ln_amt') && dj.byId('ln_amt').get('value') != null && !isNaN(dj.byId('ln_amt').get('value'))) ? dj.byId('ln_amt').get('value') : "";
		    		var cldrMonetary = d.cldr.monetary.getData(currency);
		    		amount = amount !== "" ? d.currency.format((Math.floor((parseFloat(amount) * 100).toFixed(2)) / 100), {round: cldrMonetary.round,places: cldrMonetary.places}): "" ;
		    	}
		    	m._config.globalSubmitConfirmationMsg = m.getLocalization("submitTransactionConfirmationForLoan", ["Drawdown", currency, amount]);
		},
		
        /**
         * Before Submit Validations
         * 
         * @method beforeSubmitValidations
         */
        beforeSubmitValidations : function() {
    		var validCheck = false;
    		if(checkRemittanceIsSelected()){
    			validCheck =  checkValidations();
    		}
    		
    		if(!validCheck){
    			m._config.legalTextEnabled = false;
    			return false;
    		}
    		var ajaxCallCheck  = m.isLegalTextAcceptedForAuthorizer() ;
    		if(validCheck && !(ajaxCallCheck)){
    			m._config.legalTextEnabled = true;
    			return false;
    		}else if(validCheck && (ajaxCallCheck)){
    			return true;
    		}
        		
        	return false;
        }
    });
    
    // Setup the XML transform function
	m._config = m._config || {};
	d.mixin(m._config, {
		/**
         * XML Custom Transformation 
         * 
         * @method xmlTransform
         */
		xmlTransform : function(/*String*/ xml) {
		
			var xmlRoot = m._config.xmlTagName,
			
			transformedXml = xmlRoot ? ["<", xmlRoot, ">"] : [];
			if(xml.indexOf(xmlRoot) != -1)
			{
				// Representation of existing XML
				var dom = dojox.xml.DomParser.parse(xml);
				
				// Push the entire XML into the new one
				var subXML = xml.substring(xmlRoot.length+2,(xml.length-xmlRoot.length-3));
				var remInst = dijit.byId('gridRemittanceInstruction');
				if(remInst && remInst.selection && 
						remInst.selection.getSelected() && 
						remInst.selection.getSelected()[0] && 
						remInst.selection.getSelected()[0].description && 
						remInst.selection.getSelected()[0].description[0])
				{
					subXML = subXML.concat("<rem_inst_description>");
					subXML = subXML.concat(remInst.selection.getSelected()[0].description[0]);
					subXML = subXML.concat("</rem_inst_description>");
					subXML = subXML.concat("<rem_inst_location_code>");
					subXML = subXML.concat(remInst.selection.getSelected()[0].locationCode[0]);
					subXML = subXML.concat("</rem_inst_location_code>");
					subXML = subXML.concat("<rem_inst_servicing_group_alias>");
					subXML = subXML.concat(remInst.selection.getSelected()[0].servicingGroupAlias[0]);
					subXML = subXML.concat("</rem_inst_servicing_group_alias>");
					subXML = subXML.concat("<rem_inst_account_no>");
					subXML = subXML.concat(remInst.selection.getSelected()[0].accountNo[0]);
					subXML = subXML.concat("</rem_inst_account_no>");
				}
				else
				{
					subXML = subXML.concat("<rem_inst_description>");
					subXML = subXML.concat("</rem_inst_description>");
					subXML = subXML.concat("<rem_inst_location_code>");
					subXML = subXML.concat("</rem_inst_location_code>");
					subXML = subXML.concat("<rem_inst_servicing_group_alias>");
					subXML = subXML.concat("</rem_inst_servicing_group_alias>");
					subXML = subXML.concat("<rem_inst_account_no>");
					subXML = subXML.concat("</rem_inst_account_no>");
				}
				if(dijit.byId("legalDialog") && dijit.byId('accept_legal_text') && dijit.byId('accept_legal_text').get('checked')){
					subXML = subXML.concat("<accept_legal_text>");
					subXML = subXML.concat("Y");
					subXML = subXML.concat("</accept_legal_text>");
				}else if(dijit.byId("legalDialog") && dijit.byId('accept_legal_text') && !(dijit.byId('accept_legal_text').get('checked'))){
					subXML = subXML.concat("<accept_legal_text>");
					subXML = subXML.concat("N");
					subXML = subXML.concat("</accept_legal_text>");
				}
				
				
				transformedXml.push(subXML);
				if(xmlRoot) {
					transformedXml.push("</", xmlRoot, ">");
				}
				return transformedXml.join("");
			}
			else
			{
				return xml;
			}
		}
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.loan.create_ln_client');