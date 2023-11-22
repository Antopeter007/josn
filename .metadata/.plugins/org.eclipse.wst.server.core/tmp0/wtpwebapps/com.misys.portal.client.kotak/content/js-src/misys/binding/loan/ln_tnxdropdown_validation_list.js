/**
 * 
 */
dojo.provide("misys.binding.loan.ln_tnxdropdown_validation_list");


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
	
	 d.mixin(m, {
			
			bind : function() {
				m.connect("tnx_type_code_dropdown", "onChange", m.validateLoanTransactionTypeDropDown);
				m.connect("tnx_stat_code_dropdown", "onChange", m.validateLoanTransactionStatusDropDown);
				m.setValidation('cur_code', m.validateCurrency);
		},
			       
	onFormLoad : function() {
		if(dojo.byId("tnx_type_code_parameter_row") && dojo.byId("tnx_type_code_parameter_row")!== ""){
			dojo.style(dojo.byId("tnx_type_code_parameter_row"), 'display', 'none');						
		}
		if(dojo.byId("sub_tnx_type_code_parameter_row") && dojo.byId("sub_tnx_type_code_parameter_row") !== ""){
			dojo.style(dojo.byId("sub_tnx_type_code_parameter_row"), 'display', 'none');		
		}
		if(dojo.byId("sub_product_code_parameter_row") && dojo.byId("sub_product_code_parameter_row")!== ""){
			dojo.style(dojo.byId("sub_product_code_parameter_row"), 'display', 'none');			
		}
		if(dojo.byId("tnx_stat_code_parameter_row") && dojo.byId("tnx_stat_code_parameter_row")!== "" ){
			dojo.style(dojo.byId("tnx_stat_code_parameter_row"), 'display', 'none');
		}
		if(dojo.byId("sub_tnx_stat_code_parameter_row") && dojo.byId("sub_tnx_stat_code_parameter_row")!== "" ){
			dojo.style(dojo.byId("sub_tnx_stat_code_parameter_row"), 'display', 'none');
		}
	}
		});
	 	
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.loan.ln_tnxdropdown_validation_list_client');