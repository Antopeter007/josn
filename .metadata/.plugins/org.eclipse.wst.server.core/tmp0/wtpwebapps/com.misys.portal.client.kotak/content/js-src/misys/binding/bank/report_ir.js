dojo.provide("misys.binding.bank.report_ir");

dojo.require("misys.form.common");
dojo.require("misys.validation.common");
dojo.require("misys.form.file");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.TextBox");
dojo.require("misys.widget.Dialog");
dojo.require("dijit.ProgressBar");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.CheckBox");
dojo.require("dijit.layout.ContentPane");
dojo.require("dijit.layout.TabContainer");
dojo.require("dijit.form.DateTextBox");
dojo.require("misys.form.CurrencyTextBox");
dojo.require("dijit.form.NumberTextBox");
dojo.require("dijit.form.FilteringSelect");
dojo.require("misys.form.addons");
dojo.require("misys.form.SimpleTextarea");
dojo.require("dojo.data.ItemFileReadStore");
dojo.require("misys.widget.Collaboration");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode
	
	// Private functions and variables go here

	// Public functions & variables follow
	d.mixin(m, {

		bind : function() {
			m.setValidation("ir_cur_code", m.validateCurrency);
			m.connect("prod_stat_code", "onChange", m.validateOutstandingAmount);
			m.setValidation("remittance_date", m.validateRemittanceDate);
			m.connect("ir_cur_code", "onChange", function(){
				m.setCurrency(this, ["ir_amt", "ir_liab_amt"]);
			});
			m.connect("ir_amt", "onBlur", function(){
				m.setTnxAmt(this.get("value"));
			});
			m.connect("ir_liab_amt", "onBlur", function(){
				if(dj.byId("ir_amt") && (dj.byId("ir_amt").get("value") < dj.byId("ir_liab_amt").get("value")))
				{
					var callback = function() {
						var widget = dijit.byId("ir_liab_amt");
					 	widget.set("state","Error");
					};
					m.dialog.show("ERROR", m.getLocalization("IRLiabilityAmountCanNotBeGreaterThanIRTotalAmount"), "", function(){
							setTimeout(callback, 500);
						});
				}
			});
			m.connect("beneficiary_abbv_name", "onFocus", m.enableBeneficiaryFields);
			m.connect("beneficiary_name", "onFocus", m.enableBeneficiaryFields);
			m.connect("beneficiary_address_line_1", "onFocus", m.enableBeneficiaryFields);
			m.connect("beneficiary_address_line_2", "onFocus", m.enableBeneficiaryFields);
			m.connect("beneficiary_dom", "onFocus", m.enableBeneficiaryFields);
			m.connect("prod_stat_code", "onChange", m.toggleProdStatCodeFields);
			m.connect("prod_stat_code", "onChange", function(){
				var value = this.get("value");
				m.toggleFields(value && value !== "01" && value !== "18", null,
								["iss_date", "bo_ref_id"]);});
			m.connect("prod_stat_code", "onChange", function(){
				m.toggleFields(this.get("value") !== "01", ["action_req_code"], null, false, false);
				});
			// Making outstanding amount as non editable in case of Not Processed,Cancelled,Purged
			m.connect("prod_stat_code","onChange",function(){
				var prodStatCodeValue = dj.byId("prod_stat_code").get('value'),liabAmt = dj.byId("ir_liab_amt");
				if(liabAmt && (prodStatCodeValue === '01' || prodStatCodeValue === '10' || prodStatCodeValue === '06') )
					{
						liabAmt.set("readOnly", true);
						liabAmt.set("disabled", true);
					}
				else if(liabAmt)
					{
						liabAmt.set("readOnly", false);
						liabAmt.set("disabled", false);
					}
			});
		},

		onFormLoad : function() {
			m.setCurrency(dj.byId("ir_cur_code"), ["tnx_amt", "ir_amt", "ir_liab_amt"]);
			var prodStatCode = dj.byId("prod_stat_code"),liabAmt = dj.byId("ir_liab_amt") ;
			if(liabAmt && prodStatCode && (prodStatCode.get('value') === '01' || prodStatCode.get('value') === '10' || prodStatCode.get('value') === '06'))
				{
					liabAmt.set("readOnly", true);
					liabAmt.set("disabled", true);
				}
			else if(liabAmt)
				{
					liabAmt.set("readOnly", false);
					liabAmt.set("disabled", false);
				}
			if (dj.byId("tnx_type_code") && (dj.byId("tnx_type_code").get("value") === '15' || (dj.byId("tnx_type_code").get("value") === '13')) && (m._config.enable_to_edit_customer_details_bank_side == "false"))
			{
				dojo.style('transactionDetails', "display", "none");
			} else
			{
				if (m._config.enable_to_edit_customer_details_bank_side == "false" && dojo.byId("release_dttm_view_row"))
				{
					dojo.style('transactionDetails', "display", "none");
				}
			}
		},

		beforeSubmitValidations : function() {
			// Validate Inward Remittance(IR) amount should be greater than zero
			if(dj.byId("ir_amt"))
			{
				if(!m.validateAmount((dj.byId("ir_amt"))?dj.byId("ir_amt"):0))
				{
					m._config.onSubmitErrorMsg =  m.getLocalization("amountcannotzero");
					dj.byId("ir_amt").set("value", "");
					return false;
				}
			} 
			if(dj.byId("ir_amt") && dj.byId("ir_liab_amt") && (dj.byId("ir_amt").get("value") < dj.byId("ir_liab_amt").get("value")))
			{
				m._config.onSubmitErrorMsg = m.getLocalization("IRLiabilityAmountCanNotBeGreaterThanIRTotalAmount");
				dj.byId("ir_liab_amt").set("value", "");
				console.debug("Invalid Outstanding Amount.");
				return false;
			}
			
			return true;
		}
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.bank.report_ir_client');