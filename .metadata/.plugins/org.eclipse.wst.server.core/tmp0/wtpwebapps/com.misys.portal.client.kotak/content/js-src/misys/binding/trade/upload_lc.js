dojo.provide("misys.binding.trade.upload_lc");

dojo.require("dojo.data.ItemFileReadStore");
dojo.require("dijit.layout.TabContainer");
dojo.require("dijit.form.DateTextBox");
dojo.require("misys.form.CurrencyTextBox");
dojo.require("dijit.form.FilteringSelect");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.TextBox");
dojo.require("misys.widget.Dialog");
dojo.require("dijit.ProgressBar");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.CheckBox");
dojo.require("dijit.layout.ContentPane");
dojo.require("misys.widget.Collaboration");
dojo.require("misys.form.file");
dojo.require("misys.form.common");
dojo.require("misys.validation.common");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode
	 var attFile='attachment-file';
	// insert private functions & variables

	// Public functions & variables follow
	d.mixin(m._config, {

		initReAuthParams : function() {
									
			var reAuthParams = {
				productCode : 'LC',	
				subProductCode : '',
				transactionTypeCode : '01',	
				entity : dj.byId("entity") ? dj.byId("entity").get("value") : '',
				currency : dj.byId("lc_cur_code")? dj.byId("lc_cur_code").get("value") : "",				
				amount : dj.byId("lc_amt")? m.trimAmount(dj.byId("lc_amt").get("value")) : "",
				bankAbbvName :	dj.byId("issuing_bank_abbv_name")? dj.byId("issuing_bank_abbv_name").get("value") : "",
								
				es_field1 : '',
				es_field2 : ''				
			};
			return reAuthParams;
		}
	});
	
	d.mixin(m, {

		bind : function() {
			
			m.setValidation('exp_date', m.validateTradeExpiryDate);
			m.setValidation('lc_cur_code', m.validateCurrency);
			m.connect('issuing_bank_abbv_name', 'onChange', m.populateReferences);
			m.connect("issuing_bank_abbv_name", "onChange", m.updateBusinessDate);
			m.connect('issuing_bank_customer_reference', 'onChange', m.setApplicantReference);
			m.connect("issuing_bank_abbv_name", "onChange", m.updateBusinessDate);
			if(dj.byId('issuing_bank_abbv_name')) {
				m.connect('entity', 'onChange', function(){
					dj.byId('issuing_bank_abbv_name').onChange();});
			}
			
			m.connect('lc_cur_code', 'onChange', function(){
				m.setCurrency(this, ['lc_amt']);
			});
			m.connect('lc_amt', 'onBlur', function(){
				m.setTnxAmt(this.get('value'));
			});
			
			// Optional EUCP flag 
			m.connect('eucp_flag', 'onClick', function(){
				m.toggleFields(
						this.get("checked"), 
						null,
						['eucp_details']);
			});
		},
		
		onFormLoad : function() {
			var eucpFlag = dj.byId('eucp_flag');
			if(eucpFlag) {
				m.toggleFields(
						eucpFlag.get("checked"), 
						null,
						['eucp_details']);
			}
			
			m.setCurrency(dj.byId('lc_cur_code'), ['lc_amt']);
			var issuingBankAbbvName = dj.byId('issuing_bank_abbv_name');
			if(issuingBankAbbvName) {
				issuingBankAbbvName.onChange();
			}
			
			var issuingBankCustRef = dj.byId('issuing_bank_customer_reference');
			if(issuingBankCustRef) {
				issuingBankCustRef.onChange();
			}
		},

		beforeSaveValidations : function(){
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
			// Validate LC amount should be greater than zero
			if(dj.byId("lc_amt"))
			{
				if(!m.validateAmount(dj.byId("lc_amt")))
				{
					m._config.onSubmitErrorMsg =  m.getLocalization("amountcannotzero");
					dj.byId("lc_amt").set("value","");
					return false;
				}
			}            
			
			if (dj.byId(attFile) && dj.byId(attFile).store) {
				if(dj.byId(attFile).store._arrayOfAllItems.length > 0) {
					return true;			
				}			
			}
			if(dj.byId("issuing_bank_abbv_name") && !m.validateApplDate(dj.byId("issuing_bank_abbv_name").get("value")))
			{
				m._config.onSubmitErrorMsg = m.getLocalization('changeInApplicationDates');
				m.goToTop();
				return false;
      		}
			m._config.onSubmitErrorMsg =  m.getLocalization("mandatoryMinimumFileUploadTypeError");
			return false;
		}
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.trade.upload_lc_client');