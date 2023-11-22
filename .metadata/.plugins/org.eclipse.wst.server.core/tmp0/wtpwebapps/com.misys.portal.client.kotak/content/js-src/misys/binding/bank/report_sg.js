dojo.provide("misys.binding.bank.report_sg");

dojo.require("dijit.form.Form");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.TextBox");
dojo.require("misys.widget.Dialog");
dojo.require("dijit.ProgressBar");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.CheckBox");
dojo.require("dijit.layout.ContentPane");
dojo.require("dijit.form.DateTextBox");
dojo.require("misys.form.CurrencyTextBox");
dojo.require("dijit.form.FilteringSelect");
dojo.require("dijit.layout.TabContainer");
dojo.require("misys.form.addons");
dojo.require("misys.form.SimpleTextarea");
dojo.require("dojo.data.ItemFileReadStore");
dojo.require("misys.widget.Collaboration");
dojo.require("misys.form.PercentNumberTextBox");
dojo.require("misys.form.common");
dojo.require("misys.form.file");
dojo.require("misys.validation.common");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode
	
	// insert private functions & variables

	// Public functions & variables follow
	d.mixin(m, {
		bind : function() {
			m.setValidation("iss_date", m.validateIssueDate);
			m.setValidation("exp_date", m.validateBankExpiryDate);
			
			//Validate Hyphen, allowed no of lines validation on the back-office comment
			m.setValidation("bo_comment", m.bofunction);

			m.connect("prod_stat_code", "onChange", m.toggleProdStatCodeFields);
			m.connect("prod_stat_code", "onChange", function(){
				var value = this.get("value");
				m.toggleFields(value && value !== "01" && value !== "18", 
								["action_req_code"], ["iss_date", "bo_ref_id","sg_liab_amt"]);
				if(dj.byId("mode") && dj.byId("mode").get("value") === 'RELEASE')
				{					
					m.toggleRequired("bo_ref_id",false);
					m.toggleRequired("iss_date",false);
					m.toggleRequired("sg_liab_amt",false);
				}
			});
			// Making outstanding amount as non editable in case of Not Processed,Cancelled,Purged
			m.connect("prod_stat_code","onChange",function(){
				var prodStatCodeValue = dj.byId("prod_stat_code").get('value'),liabAmt = dj.byId("sg_liab_amt");
				if(liabAmt && (prodStatCodeValue === '01' || prodStatCodeValue === '10' || prodStatCodeValue === '06'))
					{
						liabAmt.set("readOnly", true);
						liabAmt.set("disabled", true);
					}
				else if(liabAmt)
					{
						liabAmt.set("readOnly", false);
						liabAmt.set("disabled", false);
					}
				if(m._config.enable_to_edit_customer_details_bank_side=="false" && dj.byId("prod_stat_code") && dj.byId("prod_stat_code").get('value') !== '' && dj.byId("sg_liab_amt") && dj.byId("tnx_type_code") && dj.byId("tnx_type_code").get("value") !== '15' && dj.byId("tnx_type_code").get("value") !== '13')
				{
					m.toggleRequired("sg_liab_amt", false);
				}
			});
			m.connect("sg_liab_amt", "onBlur", function(){
				if(dj.byId("sg_amt") && (dj.byId("sg_amt").get("value") < dj.byId("sg_liab_amt").get("value")))
				{
					var callback = function() {
						var widget = dijit.byId("sg_liab_amt");
					 	widget.set("state","Error");
					};
					m.dialog.show("ERROR", m.getLocalization("SGLiabilityAmountCanNotBeGreaterThanSGAmount"), "", function(){
							setTimeout(callback, 500);
						});
				}
			});
			m.connect("sg_cur_code", "onChange", function(){
				m.setCurrency(this, ["sg_amt", "sg_liab_amt"]);
			});
			m.connect("sg_amt", "onBlur", function(){
				m.setTnxAmt(this.get("value"));
			});
		},

		onFormLoad : function() {
			m.setCurrency(dj.byId("charge_details_cur_code_nosend"), ["tnx_amt"]);
			m.setCurrency(dj.byId("sg_cur_code"), ["sg_amt", "sg_liab_amt"]);
			var prodStatCode = dj.byId("prod_stat_code"),liabAmt = dj.byId("sg_liab_amt") ;
			if(dj.byId("mode") && dj.byId("mode").get("value") === 'RELEASE')
			{					
				m.toggleRequired("iss_date",false);
				m.toggleRequired("sg_liab_amt",false);
			}
			//Disabling the issue date, outstanding amount and bank reference fields when new status is not processed
			if(dj.byId("prod_stat_code").get("value") === "01")
			{
				m.toggleFields(	!(prod_stat_code && (sg_liab_amt ||bo_ref_id ||iss_date)) ,null,
						["iss_date", "bo_ref_id","sg_liab_amt"],false,false);
			}
			

			if (dj.byId("tnx_type_code") && (dj.byId("tnx_type_code").get("value") === '15' || (dj.byId("tnx_type_code").get("value") === '13')) && (m._config.enable_to_edit_customer_details_bank_side == "false"))
			{
				dojo.style('transactionDetails', "display", "none");
			} else
			{
				if (m._config.enable_to_edit_customer_details_bank_side == "false")
				{
					dojo.style('transactionDetails', "display", "none");

					var transactionids = [ "exp_date", "entity", "applicant_name",
							"applicant_address_line_1", "applicant_address_line_2",
							"applicant_dom", "applicant_country", "applicant_reference",
							"applicant_contact_number", "applicant_email",
							"beneficiary_name", "beneficiary_address_line_1",
							"beneficiary_address_line_2", "beneficiary_dom",
							"beneficiary_country", "beneficiary_reference",
							"beneficiary_contact_number", "beneficiary_email",
							"goods_desc", "sg_cur_code", "sg_amt", "bol_number",
							"shipping_mode", "shipping_by", "sg_liab_amt" ];
					d.forEach(transactionids, function(id)
					{
						var field = dj.byId(id);
						if (field)
						{
							m.toggleRequired(field, false);
						}
					});

				}
			}
		},
		
		beforeSubmitValidations : function() { 
			if(dj.byId("sg_amt") && dj.byId("sg_liab_amt") && (dj.byId("sg_amt").get("value") < dj.byId("sg_liab_amt").get("value")))
			{
				m._config.onSubmitErrorMsg = m.getLocalization("SGLiabilityAmountCanNotBeGreaterThanSGAmount");
				dj.byId("sg_liab_amt").set("value", "");
				console.debug("Invalid Outstanding Amount.");
				return false;
			}
			return true;
		}
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.bank.report_sg_client');