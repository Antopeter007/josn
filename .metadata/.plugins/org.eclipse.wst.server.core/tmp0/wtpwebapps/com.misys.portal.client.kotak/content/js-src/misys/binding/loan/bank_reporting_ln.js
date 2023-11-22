dojo.provide("misys.binding.loan.bank_reporting_ln");

dojo.require("misys.widget.Dialog");
dojo.require("dijit.form.Button");
dojo.require("misys.form.CurrencyTextBox");
dojo.require("dijit.form.DateTextBox");
dojo.require("dijit.form.FilteringSelect");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.TextBox");
dojo.require("misys.form.common");
dojo.require("misys.form.SimpleTextarea");
dojo.require("misys.widget.Collaboration");

/**
 * Loan Bank Reporting Screen JS Binding  
 * 
 * @class bank_reporting_ln
 * @param d
 * @param dj
 * @param m
 */
(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {
	
	"use strict"; // ECMA5 Strict Mode
	
    // private functions and variables go here
 
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
			content: { xml : m.formToXML() },
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
	
	/** 
	 * This method check and validate the different type of limits
	* @method _validateRepricingLoanLimitAmt
	* 
	 */
	function _validateRepricingLoanLimitAmt (){
		
		var isValid = true;
		var errorMsg;
		
		m.xhrPost({
			url : m.getServletURL("/screen/AjaxScreen/action/ValidateRepricingLoanLimitAmount"),
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
				console.error("Process repricing error due to limit violation", response);
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
	
    // Public functions & variables follow
    d.mixin(m, {
 
    	/**
    	 * bind validations and connections
    	 * @method bind
    	 */
        bind : function() {
                   // event bindings go here
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
		 * On Form Load Events
		 * @method onFormLoad
		 */
        onFormLoad : function() {
                  // form onload events go here
        },
 
        /**
         * Before Submit Validations
         * 
         * @method beforeSubmitValidations
         */
        beforeSubmitValidations : function() {
                 // custom validations go here
        	if(dj.byId('product_code').get("value") === "LN" && dj.byId('prod_stat_code').get("value") === "02"){
	        	if(!_validateDrawdownLoanLimitAmt()){
	        		return false;
	        	}
        	}
        	else if(dj.byId('product_code').get("value") === "BK" && dj.byId('prod_stat_code').get("value") === "02"){
	        	if(!_validateRepricingLoanLimitAmt()){
	        		return false;
	        	}
        	}
        	return true;
        }
    });
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.loan.bank_reporting_ln_client');