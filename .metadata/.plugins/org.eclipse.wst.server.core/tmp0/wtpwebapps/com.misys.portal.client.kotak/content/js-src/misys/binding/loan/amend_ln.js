dojo.provide("misys.binding.loan.amend_ln");

dojo.require("dojo.parser");

dojo.require("misys.widget.Dialog");
dojo.require("dijit.form.Button");
dojo.require("misys.form.CurrencyTextBox");
dojo.require("dijit.form.DateTextBox");
dojo.require("dijit.form.Form");

dojo.require("misys.form.common");
dojo.require("misys.validation.common");
dojo.require("misys.widget.Collaboration");
dojo.require("misys.binding.SessionTimer");

/**
 * Amend Loan Screen JS Binding 
 * 
 * @class amend_ln
 * @param d
 * @param dj
 * @param m
 */
(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode
	
	
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
				transactionTypeCode : '03',	
				entity : dj.byId("entity") ? dj.byId("entity").get("value") : '',
				currency : dj.byId("ln_cur_code") ? dj.byId("ln_cur_code").get("value") : "",
				amount : dj.byId("ln_amt") ? m.trimAmount(dj.byId("ln_amt").get("value")) : "",								
				es_field1 : '',
				es_field2 : ''				
			};
			return reAuthParams;
		}
	});
	
	/**
	 * Update the Loan Amount with original amount
	 * 
	 * @method _updateLoanAmount
	 */
	function _updateLoanAmount(tnxAmt) {
		dj.byId('org_ln_amt').set('value',dj.byId('org_ln_liab_amt').get('value'));
		var origAmt = dj.byId('org_ln_amt').get('value');
		var incrLoanAmt = parseFloat(origAmt) + parseFloat(tnxAmt);
		if(incrLoanAmt != null && dj.byId('ln_amt'))
		{
			dj.byId('ln_amt').set('value', incrLoanAmt);
		}
	}

	/**
	 * Update the Loan Liability Amount with original liability amount
	 * 
	 * @method _updateLnLiabAmt
	 */
	function _updateLnLiabAmt(tnxAmt){
		var lnLiabAmt = dj.byId('org_ln_liab_amt').get('value');
		var newLiabAmt = parseFloat(lnLiabAmt) + parseFloat(tnxAmt);
		if(newLiabAmt != null && dj.byId('ln_liab_amt'))
		{
			dj.byId('ln_liab_amt').set('value', newLiabAmt);
			console.debug("New Liability amount" + newLiabAmt +" is set.");
		}
	}

	/**
	 * Validate the Loan Amount
	 * 
	 * @method _validateLoanAmount
	 */
	function _validateLoanAmount(){
		//  summary:
	    //        Validates the data entered as the Effective Date.
	    //  tags:
	    //         public, validation
			
		// This validation is for non-required fields
		if(this.get('value') == null){
			return true;
		}

		console.debug('[Validate] Validating Loan Increase Amount ' + this.get('value'));

		if (this.get('value') <= 0) {
			// let Dojo handle the constraints
			return false;
		}
		
		_warnAboutFacilityLimitAmount();
		
		return true;
	}
	
	function _validateSublimitDate() {
		
		// Test that the sublimit_expiry_date date is greater than or equal to
		// the application date
		var d1 = dj.byId('sublimit_expiry_date');
		var d2 = dj.byId('appl_date');
		var displayMessage;
		
		if(d1.get('value')!=null && d1.get('value')!=""){
			if (m.compareDateFields(d1, d2)) {
			    displayMessage = misys.getLocalization('sublimitExpired');
				m.dialog.show('ERROR',displayMessage);
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
	 * Validate the Loan Amount and, if it exceeds Facility Available amount just WARN.
	 * 
	 * WARN is based on configuration. 
	 * 
	 * @method _warnAboutFacilityLimitAmount
	 */
	function _warnAboutFacilityLimitAmount()
  	{
		// MPS-43846 : Logic changed as per LIQ QA inputs. 
		//The validation for loan increase is same as for new loan drawdown
		
		if (dj.byId("facility_available_amt") && dj.byId("tnx_amt") && dj.byId('ln_cur_code') && dj.byId('org_ln_liab_amt')) {

			var currency = dijit.byId('ln_cur_code');
			var tnxAmt = dj.byId("tnx_amt");
			var cldrMonetary = d.cldr.monetary.getData(currency.get("value"));

			if (currency && currency.get('value')) {
				// Below variables are arrays
				var limit = 0;
				var borrowerCcylimitAmt = 0;
				var riskTypeLimitAmt = 0;
				var borrowerLevelLimitAmt = 0;
				var limitWithPendingLoans = 0;
				var swinglineRiskTypeLimitAmt = 0;

				//Display the limit error message which is the least.
				// Below variables for display purpose
				var isLoanAmountLimitExceeded = false;
				var limitAmountToDiaplay = 0; // used to display on screen
				var lnAmtInvalidErrorMsg;
				var lnAmtInvalidWarningMsg;

				misys._config.currenciesStore.fetch({
					query : {
						id : currency.get('value')
					},
					onItem : function(item) {
						limit = item.limit;
						borrowerCcylimitAmt = item.borrowerCcylimit;
						borrowerLevelLimitAmt = item.borrowerlimit;
						riskTypeLimitAmt = item.LOANS;
						limitWithPendingLoans=item.limitWithPend;
						swinglineRiskTypeLimitAmt = item.SWNG;
					}
				});
				
				limitAmountToDiaplay = limit[0]; //Set the max limit initially.
				
				if (tnxAmt && tnxAmt.get('value') && parseFloat(tnxAmt.get('value')) > borrowerLevelLimitAmt){
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
							lnAmtInvalidErrorMsg = misys.getLocalization('loanAmountTooBigThanBorrowerLimitAmtError',[ currency.get('value'), d.currency.format((Math.floor(limitAmountToDiaplay * 100) / 100), {round: cldrMonetary.round,places: cldrMonetary.places}) ]);
						  lnAmtInvalidWarningMsg = m.getLocalization('loanBorrowerLevelLimtAmtExceeded');
						}
					}
				}
				if (tnxAmt && tnxAmt.get('value') && parseFloat(tnxAmt.get('value')) > riskTypeLimitAmt){
					//validate risk type limit
					isLoanAmountLimitExceeded = true;
					if(riskTypeLimitAmt[0] < limitAmountToDiaplay){
						limitAmountToDiaplay = riskTypeLimitAmt[0];
						if(riskTypeLimitAmt[0]<=0){
							lnAmtInvalidErrorMsg = misys.getLocalization('noAmountForRiskLimitError');
							lnAmtInvalidWarningMsg = m.getLocalization('loanBorrowerRiskTypeLimtAmtExceeded');	
						}
						else
						{
							lnAmtInvalidErrorMsg = misys.getLocalization('loanAmountTooBigThanBorrowerRiskTypeLimitAmtError',[ currency.get('value'), d.currency.format((Math.floor(limitAmountToDiaplay * 100) / 100), {round: cldrMonetary.round,places: cldrMonetary.places}) ]);
							lnAmtInvalidWarningMsg = m.getLocalization('loanBorrowerRiskTypeLimtAmtExceeded');
						}
					}
				}
				if (tnxAmt && tnxAmt.get('value') && parseFloat(tnxAmt.get('value')) > swinglineRiskTypeLimitAmt){
					//validate swingline risk type limit
					isLoanAmountLimitExceeded = true;
					if(swinglineRiskTypeLimitAmt[0] < limitAmountToDiaplay){
						limitAmountToDiaplay = swinglineRiskTypeLimitAmt[0];
						if(swinglineRiskTypeLimitAmt[0]<=0){
							lnAmtInvalidErrorMsg = misys.getLocalization('noAmountForRiskLimitError');
							lnAmtInvalidWarningMsg = m.getLocalization('loanBorrowerRiskTypeLimtAmtExceeded');	
						}
						else
						{
							lnAmtInvalidErrorMsg = misys.getLocalization('loanAmountTooBigThanBorrowerRiskTypeLimitAmtError',[ currency.get('value'), d.currency.format((Math.floor(limitAmountToDiaplay * 100) / 100), {round: cldrMonetary.round,places: cldrMonetary.places}) ]);
							lnAmtInvalidWarningMsg = m.getLocalization('loanBorrowerRiskTypeLimtAmtExceeded');
						}
					}
				}
				if (tnxAmt && tnxAmt.get('value') && parseFloat(tnxAmt.get('value')) > borrowerCcylimitAmt){
					//validate currency limit
					isLoanAmountLimitExceeded = true;
					if(borrowerCcylimitAmt[0] < limitAmountToDiaplay){
						limitAmountToDiaplay = borrowerCcylimitAmt[0];
						if(borrowerCcylimitAmt[0]<=0){
							lnAmtInvalidErrorMsg = misys.getLocalization('noAmountForCurrencyLimitError',[currency.get('value')]);
							lnAmtInvalidWarningMsg = m.getLocalization('loanBorrowerCcyLimtAmtExceeded');	
						}
						else
						{	
							lnAmtInvalidErrorMsg = misys.getLocalization('loanAmountTooBigThanBorrowerCcyLimitAmtError',[ currency.get('value'), d.currency.format((Math.floor(limitAmountToDiaplay * 100) / 100), {round: cldrMonetary.round,places: cldrMonetary.places}) ]);
					    	lnAmtInvalidWarningMsg = m.getLocalization('loanBorrowerCcyLimtAmtExceeded');																									
						}
					}				
				}
				if (tnxAmt && tnxAmt.get('value') && parseFloat(tnxAmt.get('value')) > limit){
					//validate global limit
					isLoanAmountLimitExceeded = true;
					if(limit[0] <= limitAmountToDiaplay){
						limitAmountToDiaplay = limit[0];
						lnAmtInvalidErrorMsg = misys.getLocalization('loanAmountTooBigError',[ currency.get('value'), d.currency.format((Math.floor(limitAmountToDiaplay * 100) / 100), {round: cldrMonetary.round,places: cldrMonetary.places}) ]);
						lnAmtInvalidWarningMsg = m.getLocalization('loanFacilityAmtExceeded');
					}
				}
				if (tnxAmt && tnxAmt.get('value') && parseFloat(tnxAmt.get('value')) > limitWithPendingLoans){
					//validate global limit with pending
					isLoanAmountLimitExceeded = true;
					if(limitWithPendingLoans[0] <= limitAmountToDiaplay){
						limitAmountToDiaplay = limitWithPendingLoans[0];
						if(limitAmountToDiaplay <= 0)
						{
							lnAmtInvalidErrorMsg = misys.getLocalization('facilityFullyDrawnErrorWithPend');
						}
						else
						{
							lnAmtInvalidErrorMsg = misys.getLocalization('loanAmountTooBigWithPendError',[ currency.get('value'), d.currency.format((Math.floor((limitAmountToDiaplay * 100).toFixed(2)) / 100), {round: cldrMonetary.round,places: cldrMonetary.places}) ]);
						}
						lnAmtInvalidWarningMsg = m.getLocalization('loanFacilityAmtWithPendExceeded');
					}
				}
				
				if(isLoanAmountLimitExceeded){
					if(misys._config.warnFacilityAmtExceeded)
					{
						misys._config.warningMessages = [];
						misys._config.warningMessages.push(lnAmtInvalidWarningMsg);
						return true;
					}
					else
					{
                        tnxAmt.set("state","Error");
                        dj.hideTooltip(tnxAmt.domNode);
                        dj.showTooltip(lnAmtInvalidErrorMsg, tnxAmt.domNode, 0);
                        setTimeout(function(){dj.hideTooltip(tnxAmt.domNode);}, 5000);
					}
					return false;
				}else{
					misys._config.warningMessages = [];
					return true;
				}
			}
		}
	}

	
	// Public functions & variables follow
    d.mixin(m, {
 
    	/**
		 * bind validations and connections
		 * 
		 * @method bind
		 */
        bind : function() {
        	
        	m.setValidation('amd_date', m.validateLoanIncreaseDate);
    		// m.setValidation('ln_amt', fncValidateLoanAmendmentAmount);
        	
        	m.connect('tnx_amt','onBlur', _validateLoanAmount);
        	
        	m.connect('tnx_amt', 'onChange', function(){
				console.debug("Handle the consequences in case of value is null, undefined, and NaN especially.");
				
				var tnxValue = this.get('value');
				
				// Update Loan amount and ln_liab_amt amount upon tnx_amt value is a Number and greater-than (-1). 
				if(tnxValue !== null && (!isNaN(tnxValue)) && (tnxValue > -1))
    			{
    				_updateLoanAmount(this.get('value'));
        			_updateLnLiabAmt(this.get('value'));
    			}
				// Retain ln_liab_amt amount upon tnx_amt value is Not-a-Number Or lesser-than '0' (Zero). 
    			else if((isNaN(tnxValue) || tnxValue < 0 ) && dj.byId('ln_liab_amt') && dj.byId('org_ln_liab_amt'))
    			{
    				var oldLiabAmt = dj.byId('org_ln_liab_amt').get('value');
    				dj.byId('ln_liab_amt').set('value', oldLiabAmt);
    			}
				
				//_warnAboutFacilityLimitAmount();
    		});
        	
        },
 
        /**
		 * On Form Load Events
		 * @method onFormLoad
		 */
        onFormLoad : function() {
                  // form onload events go here
        	
        	_warnAboutFacilityLimitAmount();  
        	_validateSublimitDate();
        	
        	if(dijit.byId("ln_cur_code")){
        		misys.setCurrency(dijit.byId('ln_cur_code'), ['org_ln_liab_amt','tnx_amt','ln_liab_amt']);
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
				dj.byId('LegalTextDetailsGrid').resize();
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
			var cancelButtonURL = ["/screen/LoanScreen?tnxtype=03", "&option=EXISTING"];
			targetUrl = misys.getServletURL(cancelButtonURL.join(""));
			return targetUrl;
		},
 
        /**
         * Before Submit Validations
         * 
         * @method beforeSubmitValidations
         */
        beforeSubmitValidations : function() {
    		var validCheck = false;
		
			if(dj.byId("tnx_amt"))
			{
				if(!m.validateAmount((dj.byId("tnx_amt"))?dj.byId("tnx_amt"):0))
				{
					m._config.onSubmitErrorMsg =  m.getLocalization("amountcannotzero");
					dj.byId("tnx_amt").set("value","");
					m._config.legalTextEnabled = false;
					return false;
				}
			}
			
			if(dj.byId("amd_date_unsinged") && dj.byId("repricing_date") && dj.byId("mode").value === "UNSIGNED")
			{
				var amd_date = dj.byId("amd_date_unsinged").value;
				var repricing_date = dj.byId("repricing_date").value;
				var amdDateObject = dojo.date.locale.parse(amd_date, {"locale":dojo.locale, "selector":"date"});
				var repricingDateObject = dojo.date.locale.parse(repricing_date, {"locale":dojo.locale, "selector":"date"});
				
				if(dj.byId('sub_product_code').get("value") === "SWG"){
					if(d.date.compare(repricingDateObject,amdDateObject) <= 0){
						m._config.onSubmitErrorMsg = m.getLocalization('loanAmendDateLesserThanRepricingDateError', [amd_date,repricing_date]);
						return false;
					}
				}	
			}
			
			validCheck = validateAccess() ;
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
				
				
				// Push the entire XML into the new one
				var subXML = xml.substring(xmlRoot.length+2,(xml.length-xmlRoot.length-3));
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
       dojo.require('misys.client.binding.loan.amend_ln_client');