dojo.provide("misys.binding.loan.report_activity_ln");

// dojo.require go here

/**
 * Loan Report JS Binding  
 * 
 * @class report_activity_ln
 * @param d
 * @param dj
 * @param m
 */
(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	// Private functions and variables go here
	function _checkEocDdlpi() {
		alert("_checkEocDdlpi");
	}

	function _checkTnxValDate() {
		alert("_checkTnxValDate");
	}

	function _checkExceptionDate() {
		alert("_checkExceptionDate");
	}

	function _checkLnAmt() {
		alert("_checkLnAmt");
	}
	
	// Public functions & variables follow
	d.mixin(m, {
		/**
    	 * bind validations and connections
    	 * @method bind
    	 */
		bind : function() {
			// Event bindings go here
			m.setValidation(dj.byId("eoc_ddlpi"), _checkEocDdlpi);
			m.setValidation(dj.byId("tnx_val_date"), _checkTnxValDate);
			m.setValidation(dj.byId("exception_date"), _checkExceptionDate);
			m.setValidation(dj.byId("ln_amt"), _checkLnAmt);
			m.setValidation(dj.byId("eoc_ddlpi"), _checkEocDdlpi);
			m.setValidation(dj.byId("eoc_ddlpi"), _checkEocDdlpi);
			m.setValidation(dj.byId("eoc_ddlpi"), _checkEocDdlpi);
			m.setValidation(dj.byId("eoc_ddlpi"), _checkEocDdlpi);
			m.setValidation(dj.byId("eoc_ddlpi"), _checkEocDdlpi);
			m.setValidation(dj.byId("eoc_ddlpi"), _checkEocDdlpi);
			m.setValidation(dj.byId("eoc_ddlpi"), _checkEocDdlpi);
		},

		/**
		 * On Form Load Events
		 * @method onFormLoad
		 */
		onFormLoad : function() {
			// Form onload events go here
		},

		 /**
         * Before Submit Validations
         * 
         * @method beforeSubmitValidations
         */
		beforeSubmitValidations : function() {
			// Custom validations go here
			// NOTE This function must return true or false
			return true;
		}
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.loan.report_activity_ln_client');