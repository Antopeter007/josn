dojo.provide("misys.binding.trade.create_sg");

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
dojo.require("dojo.data.ItemFileReadStore");
dojo.require("dijit.form.DateTextBox");
dojo.require("misys.form.CurrencyTextBox");
dojo.require("dijit.form.CheckBox");
dojo.require("dijit.form.FilteringSelect");
dojo.require("misys.form.SimpleTextarea");
dojo.require("misys.widget.Collaboration");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode
	
	function _clearPrincipalFeeAcc(){
		dj.byId("principal_act_no").set("value", "");
		dj.byId("fee_act_no").set("value", "");	
	}
	
	d.mixin(m._config, {

		initReAuthParams : function() {
									
			var reAuthParams = {
				productCode : 'SG',	
				subProductCode : '',
				transactionTypeCode : '01',	
				entity :dj.byId("entity") ? dj.byId("entity").get("value") : "",
				currency : dj.byId("sg_cur_code")? dj.byId("sg_cur_code").get('value') : "",				
				amount : dj.byId("sg_amt")? m.trimAmount(dj.byId("sg_amt").get('value')) : "",
				bankAbbvName :	dj.byId("issuing_bank_abbv_name")? dj.byId("issuing_bank_abbv_name").get("value") : "",
								
				es_field1 : dj.byId("sg_amt")? m.trimAmount(dj.byId("sg_amt").get('value')) : "",
				es_field2 : ''				
			};
			return reAuthParams;
		}
	});
		
	// insert private functions & variables

	// Public functions & variables follow
	d.mixin(m, {

		bind : function() {
			m.setValidation("exp_date", m.validateTradeExpiryDate);
			m.setValidation("sg_cur_code", m.validateCurrency);
			m.setValidation("sg_amt", _validateAmount);
			m.connect("issuing_bank_abbv_name", "onChange", m.populateReferences);
			m.connect("issuing_bank_abbv_name", "onChange", m.updateBusinessDate);
			if(dj.byId("issuing_bank_abbv_name")) {
				m.connect("entity", "onChange", function(){
					dj.byId("issuing_bank_abbv_name").onChange();});
			}
			m.connect("sg_cur_code", "onChange", function(){
				m.setCurrency(this, ["sg_amt"]);
			});
			m.connect("sg_amt", "onBlur", function(){
				m.setTnxAmt(this.get("value"));
			});
			m.connect("issuing_bank_customer_reference", "onChange",
					m.setApplicantReference);
			m.connect("entity_img_label","onClick",_clearPrincipalFeeAcc);
		},

		onFormLoad : function() {
			m.setCurrency(dj.byId("sg_cur_code"), ["sg_amt"]);
			//cur code for SG is made non-editable in order to validate sg amt against lc_amt from existing LC 
			// sg cur code should be editable for SG from SCRATCH and copy from SG
			if(dj.byId("isfromExistingLC") && dj.byId("isfromExistingLC").get("value") === "Y")
			{
				if(dj.byId("sg_cur_code"))
				{
					dj.byId("sg_cur_code").set('readOnly',true);
				}
				if (dj.byId('sg_amt_img'))
				{
					m.animate("fadeOut","sg_amt_img");
				}
			}
			
			var issuingBankAbbvName = dj.byId("issuing_bank_abbv_name");
			if(issuingBankAbbvName) {
				issuingBankAbbvName.onChange();
			}
			
			var issuingBankCustRef = dj.byId("issuing_bank_customer_reference");
			if(issuingBankCustRef) {
				issuingBankCustRef.onChange();
				//Set the value selected if any
				//issuingBankCustRef.set('value',issuingBankCustRef._resetValue);
			}
		},

		beforeSaveValidations : function(){
			var principleAccount = dj.byId("principal_act_no");
			if(principleAccount && principleAccount.get('value')!== "")
			{
				if(!m.validatePricipleAccount())
				{
					m._config.onSubmitErrorMsg = m.getLocalization('invalidPrincipleAccountError',[ principleAccount.get("displayedValue")]);
					m.showTooltip(m.getLocalization('invalidPrincipleAccountError',[ principleAccount.get("displayedValue")]), principleAccount.domNode);
					principleAccount.focus();
					return false;
				}
			}
			
			var feeAccount = dj.byId("fee_act_no");
			if(feeAccount && feeAccount.get('value')!== "")
			{
				if(!m.validateFeeAccount())
				{
					m._config.onSubmitErrorMsg = m.getLocalization('invalidFeeAccountError',[ feeAccount.get("displayedValue")]);
					m.showTooltip(m.getLocalization('invalidFeeAccountError',[ feeAccount.get("displayedValue")]), feeAccount.domNode);
					feeAccount.focus();
					return false;
				}
			}
			var entity = dj.byId("entity") ;
			if(entity && entity.get("value") == "")
			{
				return false;
			}
			else
			{
				return true;
			}
		},
		
		beforeSubmitValidations : function() {

			//Validate the length of bank name and all the address fields length not to exceed 1024
			if(!(m.validateLength(["applicant","beneficiary"])))
			{
				return false;
			}
			var principleAccount = dj.byId("principal_act_no");
			if(principleAccount && principleAccount.get('value')!== "")
			{
				if(!m.validatePricipleAccount())
				{
					m._config.onSubmitErrorMsg = m.getLocalization('invalidPrincipleAccountError',[ principleAccount.get("displayedValue")]);
					m.showTooltip(m.getLocalization('invalidPrincipleAccountError',[ principleAccount.get("displayedValue")]), principleAccount.domNode);
					principleAccount.focus();
					return false;
				}
			}
			
			var feeAccount = dj.byId("fee_act_no");
			if(feeAccount && feeAccount.get('value')!== "")
			{
				if(!m.validateFeeAccount())
				{
					m._config.onSubmitErrorMsg = m.getLocalization('invalidFeeAccountError',[ feeAccount.get("displayedValue")]);
					m.showTooltip(m.getLocalization('invalidFeeAccountError',[ feeAccount.get("displayedValue")]), feeAccount.domNode);
					feeAccount.focus();
					return false;
				}
			}
			if(dj.byId("issuing_bank_abbv_name") && !m.validateApplDate(dj.byId("issuing_bank_abbv_name").get("value")))
			{
				m._config.onSubmitErrorMsg = m.getLocalization('changeInApplicationDates');
				m.goToTop();
				return false;
      		}

			return true;  
		}
	});
	
	function _validateAmount(){
		//  summary:
	    //       Validates the SG amount. If the currency of the amount is the same as the iniatial LC, then we compare amounts.
		//		 The Shipping Guarantee amount must not exceed the outstanding amount of the LC.
		//
		
		var sgAmt = dj.byId("sg_amt");
		var sgAmtValue = sgAmt ? sgAmt.get("value") : "";
		var lcLiab = dj.byId("parent_lc_liab_amt");
		var lcLiabValue =  d.number.parse(lcLiab? lcLiab.get("value"): "");
		
		if(sgAmt && sgAmtValue !== null)
		{
			if(!m.validateAmount(dj.byId("sg_amt") ? sgAmt : 0 ))
			{
				m._config.onSubmitErrorMsg =  m.getLocalization("amountcannotzero");
				sgAmt.set("value", "");
				return false;
			}
			if((dj.byId("sg_amt") && sgAmtValue != null) && (lcLiab && lcLiabValue != null) && (sgAmtValue > lcLiabValue))
			{
				m.dialog.show("ERROR", m.getLocalization("sgAmtGreaterThanLcLiabAmtError"));
				sgAmt.set("value", "");
				return false;
			}
		}
		return true;
	}
	
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.trade.create_sg_client');