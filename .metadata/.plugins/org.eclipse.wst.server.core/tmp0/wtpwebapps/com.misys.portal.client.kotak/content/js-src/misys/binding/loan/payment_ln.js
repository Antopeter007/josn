dojo.provide("misys.binding.loan.payment_ln");

dojo.require("dojo.parser");

dojo.require("misys.widget.Dialog");
dojo.require("dijit.form.Button");
dojo.require("misys.form.CurrencyTextBox");
dojo.require("dijit.form.DateTextBox");
dojo.require("dijit.form.Form");

dojo.require("misys.form.common");
dojo.require("misys.validation.common");
dojo.require("misys.widget.Collaboration");

/**
 * Loan Payment Screen JS Binding  
 * 
 * @class payment_ln
 * @param d
 * @param dj
 * @param m
 */
(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {
	 
	"use strict"; // ECMA5 Strict Mode
	
    // private functions and variables go here
	
	/**
	 * Update the Loan Liability Amount with original Liablity amount
	 * 
	 * @method _updateLnLiabAmt
	 */
	function _updateLnLiabAmt(tnxAmt){
		var lnLiabAmt = dijit.byId('org_ln_liab_amt').get('value');
		var readyToSetLnLiabAmt = parseFloat(lnLiabAmt) - parseFloat(tnxAmt);
		if(dijit.byId('ln_liab_amt') && readyToSetLnLiabAmt > -1)
		{
			dijit.byId('ln_liab_amt').set('value', readyToSetLnLiabAmt);
		}
	}

	/**
	 * Validate the Loan Payment Date
	 * 
	 * @method _validateLoanPaymentDate
	 */
	function _validateLoanPaymentDate(/*Boolean*/ isFocused){
		//  summary:
	    //        Validates the data entered as the payment Date.
	    //  tags:
	    //         public, validation
		
		// This validation is for non-required fields
		if(!this.get("value")) {
			return true;
		}
		
		// Test that the expiry date is greater than or equal to the current date
		var paymentDate = this.get("value");
		
		var currentDate = new Date();
		// set the hours to 0 to compare the date values
		currentDate.setHours(0, 0, 0, 0);
		
		// compare the values of the current date and transfer date
		var isValid = d.date.compare(m.localizeDate(this), currentDate) < 0 ? false : true;
		if(!isValid)
		{
			 this.invalidMessage = m.getLocalization("paymentDateSmallerThanSystemDate", [m.getLocalizeDisplayDate(this)]);
			 return false;
		}
		
		var thisObjLocalized = m.localizeDate(dj.byId(this.id));
		var facMaturityDate = dj.byId('facility_maturity_date');
		if(facMaturityDate){
			var facMaturityDateLocalized = m.localizeDate(facMaturityDate);
			if(d.date.compare(thisObjLocalized, facMaturityDateLocalized) > 0){
				this.invalidMessage = m.getLocalization('repaymentDateGreaterThanFacilityMaturityDate', [m.getLocalizeDisplayDate(this),m.getLocalizeDisplayDate(facMaturityDate)]);
				 return false;
			}
		}
		
		var effLoanDate = dj.byId('effective_date');
		if(effLoanDate){
			var effLoanDateLocalized = m.localizeDate(effLoanDate);
			if(d.date.compare(effLoanDateLocalized, thisObjLocalized) > 0){
				this.invalidMessage = m.getLocalization('repaymentDateSmallerThanLoanEffectiveDate', [m.getLocalizeDisplayDate(this),m.getLocalizeDisplayDate(effLoanDate)]);
				 return false;
			}
		}
		
		var loanMaturityDate = dj.byId('ln_maturity_date');
		if(loanMaturityDate){
			var loanMaturityDateLocalized = m.localizeDate(loanMaturityDate);
			if(d.date.compare(thisObjLocalized, loanMaturityDateLocalized) > 0){
				this.invalidMessage = m.getLocalization('repaymentDateGreaterThanLoanMaturityDate', [m.getLocalizeDisplayDate(this),m.getLocalizeDisplayDate(loanMaturityDate)]);
				 return false;
			}	
		}
		
		var applDate = dj.byId('appl_date');
		if(applDate){
			var applDateLocalized = m.localizeDate(applDate);
			if(d.date.compare(applDateLocalized, thisObjLocalized) > 0){
				this.invalidMessage = m.getLocalization('loanRepaymentDateLesserThanLoanApplDateError', [
							this.getDisplayedValue(),
							applDate.getDisplayedValue()]);
				return false;
			}
		}
		return true;
	}
	
	
	
	function checkValidations(){

		// Validate for Loan Increase Transaction amount to be Greater than Zero.
		if(dj.byId("tnx_amt"))
		{
			if(!m.validateAmount((dj.byId("tnx_amt"))?dj.byId("tnx_amt"):0))
			{
				m._config.onSubmitErrorMsg =  m.getLocalization("amountcannotzero");
				dj.byId("tnx_amt").set("value","");
				return false;
			}
		}     

    	return false;  	 	 
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
	 * Validate the Loan Payment Amount.
	 * Must be applied to an input field of dojoType `misys.form.CurrencyTextBox`.
	 * 
	 * @method _validateLoanPaymentAmount
	 */
	function _validateLoanPaymentAmount(/*Boolean*/ isFocused)
	{
		var tnxAmtField = this;
		var tnxValue = this.get('value');
		var lnLiabAmt = dj.byId('ln_liab_amt');
		var orgLnLiabAmt = dj.byId('org_ln_liab_amt');
		var orgValue = d.number.parse(orgLnLiabAmt.get('value'));

		console.debug("[misys.validation.common] Validating Payment Amount, Value = ", 
				tnxValue);

		if(tnxValue && orgValue && orgValue < tnxValue)
		{
			tnxAmtField.focus();
			var displayMessage = m.getLocalization("paymentAmtGreaterThanLiabAmtError");
			tnxAmtField.set("value", "");
			tnxAmtField.set("state", "Error");
			dj.hideTooltip(tnxAmtField.domNode);
			dj.showTooltip(displayMessage,tnxAmtField.domNode, 0);
		
			return false;
		}

		// Update ln_liab_amt amount upon tnx_amt value is a Number and greater-than '0'(Zero)
		// and tnx_amt <= ln_liab_amt, here ln_liab_amt is 'New Outstanding Amount'. 
		if(tnxValue !== null && (!isNaN(tnxValue)) && (tnxValue >= 0) && lnLiabAmt)
		{
			_updateLnLiabAmt(tnxValue);
		}
		// Retain ln_liab_amt amount upon tnx_amt value is Not-a-Number Or lesser-than '0'(Zero).
		// Or, tnx_amt > ln_liab_amt, here ln_liab_amt is 'New Outstanding Amount'. 
		else if((isNaN(tnxValue) || (tnxValue < 0)) && lnLiabAmt && orgLnLiabAmt)
		{
			lnLiabAmt.set('value', orgLnLiabAmt.get('value'));
		}
		
		if(tnxValue <= 0) {
			return false;
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
				transactionTypeCode : '13',	
				entity : dj.byId("entity") ? dj.byId("entity").get("value") : '',
				currency : dj.byId("ln_cur_code") ? dj.byId("ln_cur_code").get("value") : "",
				amount : dj.byId("ln_amt") ? m.trimAmount(dj.byId("ln_amt").get("value")) : "",
				
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
        	m.setValidation('maturity_date', _validateLoanPaymentDate);
        	
        	m.connect('tnx_amt', 'onChange', _validateLoanPaymentAmount);
        	
        },
        
        /**
		 * On Form Load Events
		 * @method onFormLoad
		 */
        onFormLoad : function() {
                  // form onload events go here
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
			var cancelButtonURL = ["/screen/LoanScreen?mode=PAYMENT&tnxtype=13", "&option=EXISTING"];
			targetUrl = misys.getServletURL(cancelButtonURL.join(""));
			return targetUrl;
		},
		
        /**
         * Before Submit Validations
         * 
         * @method beforeSubmitValidations
         */
        beforeSubmitValidations : function() 
        {
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
       dojo.require('misys.client.binding.loan.payment_ln_client');