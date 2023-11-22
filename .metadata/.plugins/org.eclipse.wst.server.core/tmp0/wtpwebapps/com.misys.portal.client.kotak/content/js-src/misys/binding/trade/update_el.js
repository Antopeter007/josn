dojo.provide("misys.binding.trade.update_el");

dojo.require("dijit.form.DateTextBox");
dojo.require("misys.form.CurrencyTextBox");
dojo.require("dijit.form.FilteringSelect");
dojo.require("dijit.form.NumberTextBox");
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
	
	// Public functions & variables follow
	d.mixin(m, {

		bind : function() {
			m.setValidation('exp_date', m.validateBankExpiryDate);
			m.setValidation('pstv_tol_pct', m.validateTolerance);
			m.setValidation('neg_tol_pct', m.validateTolerance);
			m.setValidation('max_cr_desc_code', m.validateMaxCreditTerm);
			m.setValidation('last_ship_date', m.validateLastShipmentDate);
			m.setValidation('amd_date', m.validateAmendmentDate);
			m.setValidation('lc_cur_code', m.validateCurrency);
			
			// Events	
			m.connect('irv_flag', 'onClick', m.checkIrrevocableFlag);
			m.connect('ntrf_flag', 'onClick', m.checkNonTransferableFlag);
			m.connect('stnd_by_lc_flag', 'onClick', m.checkStandByFlag);
			
			m.connect('cfm_inst_code_1', 'onClick', m.resetConfirmationCharges);
			m.connect('cfm_inst_code_2', 'onClick', m.resetConfirmationCharges);
			m.connect('cfm_inst_code_3', 'onClick', m.resetConfirmationCharges);
			m.connect('cfm_chrg_brn_by_code_1', 'onClick', m.checkConfirmationCharges);
			m.connect('cfm_chrg_brn_by_code_2', 'onClick', m.checkConfirmationCharges);
			
			var crAvlByFields = [
					'cr_avl_by_code_1', 'cr_avl_by_code_2', 'cr_avl_by_code_3',
					'cr_avl_by_code_4', 'cr_avl_by_code_5'];
			d.forEach(crAvlByFields, function(id){
				m.connect(id, 'onClick', m.toggleBankPaymentDraftAt);
				m.connect(id, 'onClick', function(){
					m.toggleFields(
							!dj.byId('cr_avl_by_code_1').get("checked"), 
							null,
							['draft_term', 'drawee_details_bank_name']);
				});
			});
			m.connect('tenor_type_1', 'onClick', m.toggleDraftTerm);
			m.connect('tenor_type_2', 'onClick', m.toggleDraftTerm);
			m.connect('tenor_type_3', 'onClick', m.toggleDraftTerm);
			m.connect('advise_mode_code_1', 'onClick', function(){
				m.toggleFields(
						this.get("checked"), 
						null,
						['part_ship_detl_text']);
			});
			m.connect('advise_mode_code_2', 'onClick', function(){
				m.toggleFields(
					this.get("checked"), 
					['advise_thru_bank_name', 'advise_thru_bank_address_line_1', 
							'advise_thru_bank_address_line_2', 'advise_thru_bank_dom'],
					null);	
			});
			m.connect('lc_cur_code', 'onChange', function(){
				m.setCurrency(this, ['lc_amt', 'lc_liab_amt']);
			});
			m.connect('lc_amt', 'onBlur', function(){
				m.setTnxAmt(this.get('value'));
			});
			m.connect('last_ship_date', 'onClick', function(){
				m.toggleDependentFields(this, dj.byId('narrative_shipment_period'),
						m.getLocalization('shipmentDateOrPeriodExclusivityError'));
			});
			m.connect('last_ship_date', 'onChange', function(){
				m.toggleDependentFields(this, dj.byId('narrative_shipment_period'),
						m.getLocalization('shipmentDateOrPeriodExclusivityError'));
			});
			m.connect('beneficiary_name', 'onFocus', m.enableBeneficiaryFields);
			m.connect('beneficiary_dom', 'onFocus', m.enableBeneficiaryFields);
			
			// Optional EUCP flag
			m.connect('eucp_flag', 'onClick', function(){
				m.toggleFields(this.get("checked"), null,['eucp_details']);
			});
			
			m.connect('narrative_shipment_period', 'onClick', function(){
				m.toggleDependentFields(this, dj.byId('last_ship_date'),
						m.getLocalization('shipmentDateOrPeriodExclusivityError'));
			});
			m.connect('narrative_shipment_period', 'onChange', function(){
				m.toggleDependentFields(this, dj.byId('last_ship_date'),
						m.getLocalization('shipmentDateOrPeriodExclusivityError'));
			});
			m.connect("applicable_rules", "onChange", function(){
				m.toggleFields((this.get("value") == "99"), null, ["applicable_rules_text"]);
			});
		},

		onFormLoad : function() {
			m.setCurrency(dj.byId('lc_cur_code'), ['tnx_amt', 'lc_amt', 'lc_liab_amt']);

			var crAvlByCode1  = dj.byId('cr_avl_by_code_1');
			if(crAvlByCode1) {
				m.toggleFields(
					!crAvlByCode1.get("checked"), 
					null,
					['draft_term', 'drawee_details_bank_name'],
					true);
				if(crAvlByCode1.get("checked")){
					dj.byId('draft_term').set('value', '');
				}
			}
			
			var eucpFlag = dj.byId('eucp_flag');
			if(eucpFlag) {
				m.toggleFields(
						eucpFlag.get("checked"), 
						null,
						['eucp_details']);
			}
			var applRule = dj.byId("applicable_rules");
			if(applRule) {
				m.toggleFields(
						applRule.get("value") == "99",
						null, ["applicable_rules_text"]);
			}
		},

		beforeSubmitValidations : function() {
			return true;
		}
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.trade.update_el_client');