dojo.provide("misys.binding.loan.ln_pending_list");

dojo.require("dijit.layout.TabContainer");
dojo.require("misys.form.common");
dojo.require("misys.validation.common");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("misys.grid._base");
dojo.require("misys.binding.loan.ln_tnxdropdown_validation_list");
//dojo.require("misys.common");


(function(/*Dojo*/d, /*dj*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode
		
	function _validateFromDateField(widget){
	
		m._config = m._config || {};
		m._config.fromDateValidationinProcess = false;
		var effectiveFromDate = dj.byId(widget);
		//var effectiveFromDate = dj.byId('effective_date');
		var effectiveToDate = dj.byId('effective_date2');
		if(effectiveToDate.get("value")!==null && effectiveFromDate.get("value")===null){		
			m._config.fromDateValidationinProcess = true;
		    var displayMessage = misys.getLocalization('repricingDateRequired');
		    effectiveFromDate.set("state","Error");
	 		dijit.hideTooltip(effectiveFromDate.domNode);
	 		dijit.showTooltip(displayMessage, effectiveFromDate.domNode, 100);
			return false;		 
			}
		m._config.fromDateValidationinProcess = false;
		return true;
	}
	
	function _validateToDateField(widget){
		m._config = m._config || {};
		m._config.toDateValidationinProcess = false;
		var effectiveToDate = dj.byId(widget);
		var effectiveFromDate = dj.byId('effective_date');
		
		if(effectiveFromDate.get("value")!==null && effectiveToDate.get("value")===null){		
			m._config.toDateValidationinProcess = true;
		    var displayMessage = misys.getLocalization('repricingDateRequired');
		    effectiveToDate.set("state","Error");
	 		dijit.hideTooltip(effectiveToDate.domNode);
	 		dijit.showTooltip(displayMessage, effectiveToDate.domNode, 100);
			return false;		 
			}
		m._config.toDateValidationinProcess = false;
		return true;		
	}
	
	/*
	 * check the to date field value wrt from date field
	 * @method _checkToDatesValidation
	 */
	function _checkToDatesValidation(){
		
		console.debug('[Validate] Validating Repricing To Date. Value = '+ this.get('value'));
		var repricingFromDate = dj.byId('effective_date');
		var rep=m.compareDateFields(repricingFromDate, this);
			if (!m.compareDateFields(repricingFromDate, this))
			{
				 this.invalidMessage = m.getLocalization("repricingFromToDateCheckError");
				 return false;
			}
		return true;
    }

	/*checks the from date field wrt to date field 
	 * @method _checkFromoDatesValidation
	 * 
	 */
	function _checkFromoDatesValidation(){
			console.debug('[Validate] Validating Repricing From Date. Value = '+ this.get('value'));
			var repricingToDate = dj.byId('effective_date2');
			var repricingFromDate = dj.byId('effective_date');
			//var rep=m.compareDateFields(repricingToDate, this);
			if(repricingToDate!=null){
				if (!m.compareDateFields(this,repricingToDate))
				{
					 this.invalidMessage = m.getLocalization("repricingFromToDateCompareCheckError");
					 return false;
				}
			}
			return true;
	}

	
	 d.mixin(m, {
			
			bind : function() {
				m.setValidation("cur_code", m.validateCurrency);
				m.setValidation("effective_date2", _checkToDatesValidation);
				m.setValidation("effective_date", _checkFromoDatesValidation);
				m.connect("submitButton","onClick",function()
						{
							if(_validateFromDateField("effective_date") && _validateToDateField("effective_date2"))
							{
							  return true;
							}
							else
							{
								return false;
							}
						
						});
				m.connect("tnx_type_code_dropdown", "onChange", m.validateLoanTransactionTypeDropDown);	
				m.connect("tnx_stat_code_dropdown", "onChange", m.validateLoanTransactionStatusDropDown);
						
				}
		});
	 	
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.loan.ln_pending_list_client');