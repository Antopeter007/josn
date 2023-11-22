dojo.provide("misys.binding.loan.ln_facility_inquiry");


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
	
	/*
	 * checks for borrower reference dropdown and makes that field mandatory for search.
	 * @method _checkBorrowerRefField
	 * 
	 */
	function _checkBorrowerRefField(widget){
		
		m._config = m._config || {};
		m._config.dealValidationinProcess = false;
		var borrowerRef = dj.byId(widget);
		var borrowerRefValue = borrowerRef ? borrowerRef.get("value")  : "";
		//check borrower reference field is empty or not
		
			if (borrowerRefValue.length === 0 || !borrowerRefValue.trim()) {
				
			    var displayMessage = misys.getLocalization('dealFielIsRequired');
			    borrowerRef.set("state","Error");
		 		dijit.hideTooltip(borrowerRef.domNode);
		 		dijit.showTooltip(displayMessage, borrowerRef.domNode, 100);
			}
		
	}
	
	d.mixin(m, {
		
		bind : function() {
			
			m.setValidation('currency', m.validateCurrency);
			
			m.connect("submitButton","onClick",function()
					{
					_checkBorrowerRefField("borrowerid");
					dijit.byId("escape").set("value", "Y");
					});
						
        },
        onFormLoad : function() {
        	dojo.style(dojo.byId("escape_row"), 'display', 'none');
		 }
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.loan.ln_facility_inquiry_client');
       