dojo.provide("misys.binding.bank.report_li");

dojo.require("dijit.form.DateTextBox");
dojo.require("misys.form.CurrencyTextBox");
dojo.require("dijit.form.FilteringSelect");
dojo.require("misys.form.file");
dojo.require("misys.form.addons");
dojo.require("misys.form.SimpleTextarea");
dojo.require("dijit.layout.TabContainer");
dojo.require("dojo.data.ItemFileReadStore");
dojo.require("misys.form.common");
dojo.require("misys.validation.common");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.TextBox");
dojo.require("misys.widget.Dialog");
dojo.require("dijit.ProgressBar");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.CheckBox");
dojo.require("dijit.layout.ContentPane");
dojo.require("misys.widget.Collaboration");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode
	
	// insert private functions & variables

	// Public functions & variables follow
	d.mixin(m, {

		bind : function() {
			m.setValidation("iss_date", m.validateIssueDate);
			m.setValidation("exp_date", m.validateFutureDate);
			m.setValidation("bol_date", m.validateTransportDocumentDate);
			
			//Validate Hyphen, allowed no of lines validation on the back-office comment
			m.setValidation("bo_comment", m.bofunction);
			
			m.connect("prod_stat_code", "onChange", m.toggleOutstandingAmount);
			m.setValidation("li_cur_code", m.validateCurrency);
			m.connect("li_cur_code", "onChange", function(){
				m.setCurrency(this, ["li_amt"]);
			});
			m.connect("li_amt", "onBlur", function(){
				m.setTnxAmt(this.get("value"));
			});
			
			m.connect("li_liab_amt", "onBlur", function(){
				if(dj.byId("li_amt") && (dj.byId("li_amt").get("value") < dj.byId("li_liab_amt").get("value")))
				{
					var callback = function() {
						var widget = dijit.byId("li_liab_amt");
					 	widget.set("state","Error");
					};
					m.dialog.show("ERROR", m.getLocalization("LILiabilityAmountCanNotBeGreaterThanLITotalAmount"), '', function(){
							setTimeout(callback, 0);
						});
				}
			});
			m.connect("bene_type_code", "onChange", function(){
				var liTypeValue = this.get("value");
				m.toggleFields(liTypeValue && liTypeValue !== "01" && liTypeValue !== "02", 
									null, ["bene_type_other"]);
			});
			m.connect("prod_stat_code", "onChange", m.toggleProdStatCodeFields);
			m.connect("prod_stat_code", "onChange", function(){
				var value = this.get("value");
				m.toggleFields(value && value !== "01" && value !== "18", null,
									["iss_date", "bo_ref_id", "li_liab_amt"]);
				if(dj.byId("mode") && dj.byId("mode").get("value") === 'RELEASE')
				{					
					m.toggleRequired("bo_ref_id",false);
					m.toggleRequired("iss_date",false);
					m.toggleRequired("li_liab_amt",false);
				}	
			});
			
			m.connect("trans_doc_type_code","onChange",function(){
				if(dj.byId("trans_doc_type_code").get("value")!== "99"){
					d.style("trans_doc_type_other_row","display","none");
					m.toggleRequired("trans_doc_type_other", false);
				}
				else {
					d.style("trans_doc_type_other_row","display","block");
					m.toggleRequired("trans_doc_type_other", true);
				}
			});
			// Making outstanding amount as non editable in case of Not Processed,Cancelled,Purged
			m.connect("prod_stat_code","onChange",function(){
				var prodStatCodeValue = dj.byId("prod_stat_code").get('value'),liabAmt = dj.byId("li_liab_amt");
				if(liabAmt && (prodStatCodeValue === '01' || prodStatCodeValue === '10' || prodStatCodeValue === '06'))
					{
						liabAmt.set("readOnly", true);
						liabAmt.set("disabled", true);
						m.toggleRequired("li_liab_amt",false);
						dj.byId("li_liab_amt").set("value", "");
					}
				else if(liabAmt)
					{
						liabAmt.set("readOnly", false);
						liabAmt.set("disabled", false);
						if(!(dj.byId("mode") && dj.byId("mode").get("value") === 'RELEASE'))
						{
							m.toggleRequired("li_liab_amt",true);
						}
						dj.byId("li_liab_amt").set("value", "");
					}
				if(m._config.enable_to_edit_customer_details_bank_side=="false" && dj.byId("prod_stat_code") && dj.byId("prod_stat_code").get('value') !== '' && dj.byId("li_liab_amt") && dj.byId("tnx_type_code") && dj.byId("tnx_type_code").get("value") !== '15' && dj.byId("tnx_type_code").get("value") !== '13')
				{
					m.toggleRequired("li_liab_amt", false);
				}
			});
		},

		toggleOutstandingAmount : function(){
		
			var fields = d.query(".outstanding");
			if(fields.length === 2) {
				var outstandingAmount = 
					dj.byId(d.attr(fields[1], "widgetid")).get("value") || 0;
				if (this.get("value") === "10" || this.get("value") === "06") {
					dj.byId(d.attr(fields[1], "widgetid")).set("value",0);
					dj.byId(d.attr(fields[1], "widgetid")).set("disabled",true);
				}
				else
				{
					dj.byId(d.attr(fields[1], "widgetid")).set("disabled",false);
				}
			}
		},
		onFormLoad : function() {
			m.setCurrency(dj.byId("li_cur_code"), ["tnx_amt", "li_amt", "li_liab_amt"]);
			if(dj.byId("mode") && dj.byId("mode").get("value") === 'RELEASE')
			{					
				m.toggleRequired("iss_date",false);
				m.toggleRequired("li_liab_amt",false);
			}	
			var liType = dj.byId("bene_type_code");
			if(liType) {
				var liTypeValue = liType.get("value");
				m.toggleFields(liTypeValue && liTypeValue !== "01" && liTypeValue !== "02", 
								null, ["bene_type_other"], true);
			}
			
			// Show an input field when Transport Document type "Other" is selected
			var transportDocType = dj.byId("trans_doc_type_code");
			if(transportDocType && transportDocType.get("value") !== "99"){
				d.style("trans_doc_type_other_row","display","none");
				m.toggleRequired("trans_doc_type_other", false);
			}
			else
			{
				m.toggleRequired("trans_doc_type_other", true);
			}
			//Disabling the issue date, outstanding amount and bank reference fields when new status is not processed
			if(dj.byId("prod_stat_code").get("value") === "01")
			{
				m.toggleFields(	!(prod_stat_code && (li_liab_amt ||bo_ref_id ||iss_date)) ,null,
						["iss_date", "bo_ref_id","li_liab_amt"],false,false);
			}
			if (dj.byId("tnx_type_code") && (dj.byId("tnx_type_code").get("value") === '15' || (dj.byId("tnx_type_code").get("value") === '13')) && (m._config.enable_to_edit_customer_details_bank_side == "false"))
			{
				dojo.style('transactionDetails', "display", "none");
			} else
			{
				if (m._config.enable_to_edit_customer_details_bank_side == "false")
				{
					dojo.style('transactionDetails', "display", "none");

					var transactionids = [ "exp_date", "deal_ref_id", "bene_type_code",
							"bene_type_other", "entity", "applicant_name",
							"applicant_address_line_1", "applicant_address_line_2",
							"applicant_dom", "applicant_country", "applicant_reference",
							"applicant_contact_number", "applicant_email",
							"countersign_flag", "shipping_by", "trans_doc_type_code",
							"bol_number", "bol_date", "narrative_description_goods",
							"beneficiary_name", "beneficiary_address_line_1",
							"beneficiary_address_line_2", "beneficiary_dom",
							"beneficiary_country", "beneficiary_reference",
							"beneficiary_contact_number", "beneficiary_email",
							"goods_desc", "li_cur_code", "li_amt", "li_liab_amt" ];
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
			if(dj.byId("li_amt") && dj.byId("li_liab_amt") && (dj.byId("li_amt").get("value") < dj.byId("li_liab_amt").get("value")))
			{
				m._config.onSubmitErrorMsg = m.getLocalization("LILiabilityAmountCanNotBeGreaterThanLITotalAmount");
				dj.byId("li_liab_amt").set("value", "");
				console.debug("Invalid Outstanding Amount.");
				return false;
			}
			return true;
		}
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.bank.report_li_client');