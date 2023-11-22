dojo.provide("misys.binding.bank.amend_lc");

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
	
	function validateDecreaseAmount() 
	{
		if(dj.byId("org_lc_liab_amt") && dj.byId("org_lc_liab_amt").get("value") !== null && dj.byId("dec_amt") && dj.byId("dec_amt").get("value")!== null) {
			if(d.number.parse(dijit.byId("org_lc_liab_amt").get("value")) < dijit.byId("dec_amt").get("value")) {
				var lcLiabCurCodeValue = dj.byId("lc_cur_code").get("value");
				var lcLiabAmtValue = dojo.number.parse(dj.byId("org_lc_liab_amt").get("value"));
				dj.byId("dec_amt").invalidMessage = m.getLocalization("decAmountLessThanOutstandingAmt",[ lcLiabCurCodeValue, lcLiabAmtValue.toFixed(2) ]);
				misys.dialog.show("ERROR", dj.byId("dec_amt").invalidMessage, "", function(){
					dj.byId("dec_amt").focus();
					dj.byId("dec_amt").set("state","Error");
				});
				return false;
			}
			else if(d.number.parse(dijit.byId("org_lc_amt").get("value")) < dijit.byId("dec_amt").get("value"))
				{
				dijit.byId("dec_amt").invalidMessage = m.getLocalization("decreaseAmountShouldBeLessThanLCAmount");
				misys.dialog.show("ERROR", dj.byId("dec_amt").invalidMessage, "", function(){
					dj.byId("dec_amt").focus();
					dj.byId("dec_amt").set("state","Error");
				});
				return false;
				}
			return true;
		}
	}
	
	// Public functions & variables follow
	d.mixin(m, {

		bind : function() {
			m.connect("inc_amt", "onBlur", function(){
				m.validateAmendAmount(true, this, "lc");
				if(dj.byId("dec_amt")){
					dj.byId("dec_amt").set('value',"");
				}
			});
			
			m.connect("dec_amt", "onBlur", function(){
				validateDecreaseAmount();
				m.validateAmendAmount(true, this, "lc");
				if(dj.byId("inc_amt")){
					dj.byId("inc_amt").set('value',"");
				}
			});
			
			m.setValidation("exp_date", m.validateBankExpiryDate);
			m.setValidation("amd_date", m.validateAmendmentDate);
			m.connect("inc_amt", "onBlur", m.amendTransaction);
			m.connect("dec_amt", "onBlur", m.amendTransaction);
			m.connect("org_lc_cur_code_liab_amt", "onBlur", m.amendTransactionLiabAmt);
			m.setValidation("max_cr_desc_code", m.validateMaxCreditTerm);
			m.setValidation("last_ship_date", m.validateLastShipmentDate);
			m.connect("last_ship_date", "onClick", function(){
			m.toggleDependentFields(this, dj.byId("narrative_shipment_period"),
						m.getLocalization("shipmentDateOrPeriodExclusivityError"));
			});
			m.connect("last_ship_date", "onChange", function(){
				m.toggleDependentFields(this, dj.byId("narrative_shipment_period"),
						m.getLocalization("shipmentDateOrPeriodExclusivityError"));
			});
			m.connect("narrative_shipment_period", "onChange", function(){
				m.toggleDependentFields(this, dj.byId("last_ship_date"),
						m.getLocalization("shipmentDateOrPeriodExclusivityError"));
			});
			m.connect("narrative_shipment_period", "onClick", function(){
				m.toggleDependentFields(this, dj.byId("last_ship_date"),
						m.getLocalization("shipmentDateOrPeriodExclusivityError"));
			});
			m.connect("dec_amt", "onBlur", function(){
				var	liabAmt = dj.byId("org_lc_cur_code_liab_amt").get('value');
				var updatedLiabAmt;
					if(!isNaN(dj.byId("dec_amt").get('value')))
						{
						updatedLiabAmt=	dojo.number.parse(liabAmt) - dojo.number.parse(dj.byId("dec_amt").get('value'));
						dj.byId("lc_liab_amt").set("value",updatedLiabAmt);
						if(dj.byId("lc_amt") && dj.byId("org_lc_amt")){
							dj.byId("lc_amt").set("value",dojo.number.parse(dj.byId("org_lc_amt").get('value')) - dojo.number.parse(dj.byId("dec_amt").get('value')));
						}
						if(dj.byId("tnx_amt")){
							dj.byId("tnx_amt").set("value",dojo.number.parse(dj.byId("dec_amt").get('value')));
						}
						}
					else
						{
						dj.byId("lc_liab_amt").set("value",dj.byId("org_lc_cur_code_liab_amt").get('value'));
						if(dj.byId("lc_amt") && dj.byId("org_lc_amt")){
							dj.byId("lc_amt").set("value",dojo.number.parse(dj.byId("org_lc_amt").get('value')));
						}
						}
					
			});
			m.connect("inc_amt", "onBlur", function(){
				var	liabAmt = dj.byId("org_lc_cur_code_liab_amt").get('value');
					var updatedLiabAmt;
					if(!isNaN(dj.byId("inc_amt").get('value')))
					{
					updatedLiabAmt=	dojo.number.parse(liabAmt) + dojo.number.parse(dj.byId("inc_amt").get('value'));
					dj.byId("lc_liab_amt").set("value",updatedLiabAmt);
					if(dj.byId("lc_amt") && dj.byId("org_lc_amt")){
						dj.byId("lc_amt").set("value",dojo.number.parse(dj.byId("org_lc_amt").get('value')) + dojo.number.parse(dj.byId("inc_amt").get('value')));
					}
					if(dj.byId("tnx_amt")){
						dj.byId("tnx_amt").set("value",dojo.number.parse(dj.byId("inc_amt").get('value')));
					}
					}
				else
					{
					dj.byId("lc_liab_amt").set("value",dj.byId("org_lc_cur_code_liab_amt").get('value'));
					if(dj.byId("lc_amt") && dj.byId("org_lc_amt")){
						dj.byId("lc_amt").set("value",dojo.number.parse(dj.byId("org_lc_amt").get('value')));
					}
					}
			
			});
		},

		onFormLoad : function() {
			if(dj.byId("lc_liab_amt"))
			{
			var	liabAmt = dj.byId("org_lc_liab_amt").get('value');
			var updatedLiabAmt;
			
			if(!isNaN(dj.byId("dec_amt").get('value')))
				{
				updatedLiabAmt=	dojo.number.parse(liabAmt) - dojo.number.parse(dj.byId("dec_amt").get('value'));
				dj.byId("lc_liab_amt").set("value",updatedLiabAmt);
				}
			else if(!isNaN(dj.byId("inc_amt").get('value')))
			{
			updatedLiabAmt=	dojo.number.parse(liabAmt) + dojo.number.parse(dj.byId("inc_amt").get('value'));
			dj.byId("lc_liab_amt").set("value",updatedLiabAmt);
			}
		else
			{
			dj.byId("lc_liab_amt").set("value",dj.byId("org_lc_liab_amt").get('value'));
			}
			}
			m.setCurrency(dj.byId("lc_cur_code"), ["tnx_amt"]);
			if (dj.byId("tnx_type_code") && (dj.byId("tnx_type_code").get("value") === '15' || (dj.byId("tnx_type_code").get("value") === '13')) && (m._config.enable_to_edit_customer_details_bank_side == "false"))
			{
				dojo.style('transactionDetails', "display", "none");
			} else
			{
				if (m._config.enable_to_edit_customer_details_bank_side == "false" && dojo.byId("release_dttm_view_row"))
				{
					dojo.style('transactionDetails', "display", "none");

					var transactionids = [ "exp_date", "org_lc_amt", "inc_amt", "dec_amt", "lc_amt",
							"pstv_tol_pct", "neg_tol_pct", "max_cr_desc_code",
							"narrative_additional_amount", "ship_from", "ship_loading",
							"ship_discharge", "ship_to", "last_ship_date", "narrative_shipment_period",
							"amd_details", "adv_send_mode", "advising_bank_lc_ref_id",
							"narrative_sender_to_receiver" ];
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
			if(dj.byId("pstv_tol_pct") && dj.byId('org_pstv_tol_pct') && dijit.byId("org_pstv_tol_pct").get('value') !== "" && dijit.byId("max_cr_desc_code").get('value') === "" && isNaN(dijit.byId("pstv_tol_pct").get('value'))){
				
				dj.byId("pstv_tol_pct").set("value",dj.byId('org_pstv_tol_pct').get('value'));
			}
			if(dj.byId("neg_tol_pct") && dj.byId('org_neg_tol_pct') && dijit.byId("org_neg_tol_pct").get('value') !== "" && dijit.byId("max_cr_desc_code").get('value') === "" && isNaN(dijit.byId("neg_tol_pct").get('value'))){
				
				dj.byId("neg_tol_pct").set("value",dj.byId('org_neg_tol_pct').get('value'));
			}
			if(dj.byId("ship_to") && dj.byId('org_ship_to') && dj.byId('org_ship_to').get('value') !== "" && dijit.byId("ship_to").get('value')===""){
				
				dj.byId("ship_to").set("value",dj.byId('org_ship_to').get('value'));
			}
			if(dj.byId("ship_from") && dj.byId('org_ship_from') && dj.byId('org_ship_from').get('value') !== "" && dijit.byId("ship_from").get('value')===""){
				
				dj.byId("ship_from").set("value",dj.byId('org_ship_from').get('value'));
			}
			if(dj.byId("ship_discharge") && dj.byId('org_ship_discharge') && dj.byId('org_ship_discharge').get('value') !== "" && dijit.byId("ship_discharge").get('value') ===""){
				
				dj.byId("ship_discharge").set("value",dj.byId('org_ship_discharge').get('value'));
			}
			if(dj.byId("ship_loading") && dj.byId('org_ship_loading') && dj.byId('org_ship_loading').get('value') !== "" && dijit.byId("ship_loading").get('value') ===""){
				
				dj.byId("ship_loading").set("value",dj.byId('org_ship_loading').get('value'));
			}
			
			if(dj.byId("last_ship_date") && dj.byId('org_last_ship_date') && dj.byId('org_last_ship_date').get('value') !== "" && dijit.byId("last_ship_date").get('value') == null){
				
				dj.byId("last_ship_date").set("value",dj.byId('org_last_ship_date').get('value'));
			}
			if(dj.byId("narrative_shipment_period") && dj.byId('org_narrative_shipment_period') && dj.byId('org_narrative_shipment_period').get('value') !== "" &&  dijit.byId("narrative_shipment_period").get('value') ===""){

				dj.byId("narrative_shipment_period").set("value",dj.byId('org_narrative_shipment_period').get('value'));
			}
			return true;
		},
		beforeSubmit : function() {
			m.updateSubTnxTypeCode("lc");
		}
	});
	
	
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.bank.amend_lc_client');