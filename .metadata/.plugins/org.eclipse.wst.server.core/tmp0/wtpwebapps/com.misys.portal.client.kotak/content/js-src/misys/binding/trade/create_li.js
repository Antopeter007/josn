dojo.provide("misys.binding.trade.create_li");

dojo.require("dojo.parser");
dojo.require("dijit.layout.TabContainer");
dojo.require("dijit.form.DateTextBox");
dojo.require("misys.form.CurrencyTextBox");
dojo.require("dijit.form.NumberTextBox");
dojo.require("dijit.form.FilteringSelect");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.TextBox");
dojo.require("misys.widget.Dialog");
dojo.require("dijit.ProgressBar");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.CheckBox");
dojo.require("misys.form.file");
dojo.require("misys.form.SimpleTextarea");
dojo.require("misys.form.common");
dojo.require("misys.validation.common");
dojo.require("misys.widget.Collaboration");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode
	
	function _clearPrincipalFeeAcc(){
		dj.byId("principal_act_no").set("value", "");
		dj.byId("fee_act_no").set("value", "");	
	}
	
	// insert private functions & variables
	d.mixin(m._config, {

		initReAuthParams : function() {
									
			var reAuthParams = {
				productCode : 'LI',	
				subProductCode : '',
				transactionTypeCode : '01',	
				entity : dj.byId("entity") ? dj.byId("entity").get("value") : '',
				bankAbbvName :	dj.byId("issuing_bank_abbv_name")? dj.byId("issuing_bank_abbv_name").get("value") : "",
				currency : dj.byId("li_cur_code") ? dj.byId("li_cur_code").get("value") : "",
				amount : dj.byId("li_amt") ? m.trimAmount(dj.byId("li_amt").get("value")) : "",
								
				es_field1 : '',
				es_field2 : ''				
			};
			return reAuthParams;
		}
	});

	// Public functions & variables follow
	d.mixin(m, {
		bind : function() {
			m.setValidation("li_cur_code", m.validateCurrency);
			m.setValidation("exp_date", m.validateFutureDate);
			m.setValidation("bol_date", m.validateTransportDocumentDate);
			m.connect("li_amt", "onBlur", function() {
				m.setTnxAmt(this.get("value"));
				if(dj.byId("org_li_amt"))
				{
					m.checkIndemnityAmount();
				}
			});
			
			// onChange
			m.connect("li_cur_code", "onChange", function() {
				m.setCurrency(this, ["li_amt"]);
			});
			
			m.connect("bene_type_code", "onChange", function() {
				var liTypeValue = this.get("value");
				if(liTypeValue !== "99"){
					d.style("bene_type_other_row","display","none");
					m.toggleRequired("bene_type_other", false);
				}
				else {
					d.style("bene_type_other_row","display","block");
					m.toggleRequired("bene_type_other", true);
				}
			});
			
			m.connect("issuing_bank_abbv_name", "onChange", m.populateReferences);
			m.connect("issuing_bank_abbv_name", "onChange",  m.updateBusinessDate);
			if(dj.byId("issuing_bank_abbv_name")) {
				m.connect("entity", "onChange", function(){
					dj.byId("issuing_bank_abbv_name").onChange();});
			}
			
			m.connect("issuing_bank_customer_reference", "onChange", m.setApplicantReference);
			
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
			m.connect("entity_img_label","onClick",_clearPrincipalFeeAcc);
		},

		onFormLoad : function() {
			
			if(m._config.swift2018Enabled){
				var option = dj.byId("CREATE_OPTION").get("value");
				if(option === "EXISTING_LC" || option === "EXISTING_EL"){
					m.dialog.show("CONFIRMATION", m.getLocalization("warningMsgCreateLI"), "", 
							"", "","","",function(){
						var screenURL = "/screen/LetterOfIndemnityScreen?option="+option+"&tnxtype=01";
						window.location.href = misys.getServletURL(screenURL);
						return;
							}
						);
				}
			}
			// Additional onload events for dynamic fields
			m.setCurrency(dj.byId("li_cur_code"), ["li_amt"]);
			var liType = dj.byId("bene_type_code");
			if(liType && liType.get("value") !== "99") 
			{
				d.style("bene_type_other_row","display","none");
				m.toggleRequired("bene_type_other", false);
			}
			else
			{
				m.toggleRequired("bene_type_other", true);
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
			
			// Populate references
			var issuingBankAbbvName = dj.byId("issuing_bank_abbv_name");
			if(issuingBankAbbvName) {
				issuingBankAbbvName.onChange();
			}
			
			var issuingBankCustRef = dj.byId("issuing_bank_customer_reference");
			if(issuingBankCustRef) {
				issuingBankCustRef.onChange();
			}
		},
		beforeSaveValidations : function(){
	    	var entity = dj.byId("entity") ;
	    	if(entity && entity.get("value") === "")
            {
                    return false;
            }
            else
            {
                    return true;
            }
        },
        
		beforeSubmitValidations : function(){
			
			//General validation: validate against EC amount which should be greater than zero
			if(dj.byId("li_amt"))
			{
				if(!m.validateAmount((dj.byId("li_amt"))?dj.byId("li_amt"):0))
				{
					m._config.onSubmitErrorMsg =  m.getLocalization("amountcannotzero");
					dj.byId("li_amt").set("value", "");
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
		},
		
        checkIndemnityAmount : function(){
    	var liAmt = dj.byId("li_amt"),
    		orgLiAmt = dj.byId("org_li_amt");
    	if(liAmt && orgLiAmt)
    	{
    		if(liAmt.get("value") > orgLiAmt.get("value"))
    		{
    			var invalidMessage = m.getLocalization("AmtGreaterThanOrgOutstandingAmtError", [orgLiAmt.get("value")]);
    			liAmt.set("state","Error");
    			dj.hideTooltip(liAmt.domNode);
				m.showTooltip(invalidMessage, liAmt.domNode, 0);
    		}
    	}
    }
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.trade.create_li_client');