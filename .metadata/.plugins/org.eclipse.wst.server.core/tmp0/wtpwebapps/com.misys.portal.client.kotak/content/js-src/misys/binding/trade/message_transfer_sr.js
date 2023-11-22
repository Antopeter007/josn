dojo.provide("misys.binding.trade.message_transfer_sr");

dojo.require("dijit.layout.TabContainer");
dojo.require("dijit.form.DateTextBox");
dojo.require("misys.form.CurrencyTextBox");
dojo.require("dijit.form.NumberTextBox");
dojo.require("dijit.form.FilteringSelect");
dojo.require("misys.form.SimpleTextarea");
dojo.require("misys.form.file");
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
dojo.require("misys.binding.trade.ls_common");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode
	
	// dojo.subscribe once a record is deleted from the grid
    var _deleteGridRecord = "deletegridrecord";
		
	d.mixin(m._config, {

		initReAuthParams : function() {
									
			var reAuthParams = {
				productCode : 'SR',	
				subProductCode : '',
				transactionTypeCode : "13",	
				entity :'',
				currency :'',				
				amount : '',
								
				es_field1 : '',
				es_field2 : ''				
			};
			return reAuthParams;
		}
	});
			
	// Public functions & variables follow
	d.mixin(m, {

		bind : function() {
			
			m.setValidation("free_format_text", m.validateFreeFormatMessage);
			m.connect("full_trf_flag", "onClick", function(){
				var tnxAmt = dj.byId("tnx_amt");
				if(this.get("checked")) {
					m.setTnxAmt(dj.byId("org_lc_amt").get("value"));
					tnxAmt.set("readOnly", true);
				} else {
					tnxAmt.reset();
					tnxAmt.set("readOnly", false);
				}
			});
			m.connect("advise_mode_code_1", "onClick", function(){
				m.toggleFields(!this.get("checked"), [
						"advise_thru_bank_name", "advise_thru_bank_address_line_1",
						"advise_thru_bank_address_line_2", "advise_thru_bank_dom"],
						null);
			});
			m.connect("advise_mode_code_2", "onClick", function(){
				m.toggleFields(this.get("checked"), ["advise_thru_bank_name",
						"advise_thru_bank_address_line_1",
						"advise_thru_bank_address_line_2", "advise_thru_bank_dom"],
						null);
			});
			m.connect("tnx_amt", "onFocus", function(){
				this.set("readOnly", dj.byId("full_trf_flag").get("checked"));
			});
			
			m.connect("advise_mode_code", "onChange", function(){
				m.toggleFields(this.get("value")==="02", [
						"advise_thru_bank_name", "advise_thru_bank_address_line_1",
						"advise_thru_bank_address_line_2", "advise_thru_bank_dom"],
						["advise_thru_bank_name", "advise_thru_bank_address_line_1"]);

				if (this.get("value")=="02")
				{
					m.animate("wipeIn", d.byId('advise_thru_bank_name_img'));
				}
				else
				{
					m.animate("wipeOut", d.byId('advise_thru_bank_name_img'));
				}
			});

			m.connect("delv_org", "onChange", function(){
				m.toggleFields((this.get("value") === "99"), null, ["delv_org_text"]);
			});
			
			m.connect("license_lookup","onClick", function(){
				m.getLicenses("el");
			});
			m.connect("applicable_rules", "onChange", function(){
				m.toggleFields((this.get("value") == "99"), null, ["applicable_rules_text"]);
			});

			m.connect("delivery_to", "onChange", function(){
				if(this.get("value") === "" || this.get("value") === "01" || this.get("value") === "03")
				{
							m.toggleFields((this.get("value") === "" || this.get("value") === "01" || this.get("value") === "03"), null, ["narrative_delivery_to"]);
							m.toggleRequired("narrative_delivery_to", false);
							dj.byId("narrative_delivery_to").set("value", "");
							dj.byId("narrative_delivery_to").set("disabled", true);
							document.getElementById("narrative_delivery_to_img").style.display = "none";	
				}
			else
				{
					dj.byId("narrative_delivery_to").set("disabled", false);
					dj.byId("narrative_delivery_to").set("value", "");
					m.toggleRequired("narrative_delivery_to", true);
					document.getElementById("narrative_delivery_to_img").style.display = "block";
				}
			});
			m.connect("tnx_amt", "onChange", function(){
                var tnxAmt = dj.byId("tnx_amt") ? dj.byId("tnx_amt").get("value") : "";
                var utilizedAmt = dj.byId("utilized_amt") ? dj.byId("utilized_amt").get("value") : "";
                var utilizedAmtCurCode = dj.byId("utilized_amt_cur_code") ? dj.byId("utilized_amt_cur_code").get("value") : "";
                
                var lcAmt = dj.byId("org_lc_amt") ? dj.byId("org_lc_amt").get("value") : "";
                var availableAmt=0.00;
                if(tnxAmt !== ""){
                	availableAmt= (lcAmt-utilizedAmt);
                
                 if(tnxAmt > availableAmt) {
                	 availableAmt=  availableAmt<0?dojo.currency.format(0):dojo.currency.format(availableAmt);
                  //availableAmt= dojo.currency.format(availableAmt, this.options);
                  var displayMessage = m.getLocalization("transferAmtGreaterThanAvailableLCAmtWarning", [utilizedAmtCurCode,availableAmt]);
                  dj.byId("tnx_amt").focus();
                  dj.byId("tnx_amt").set("state","Error"); 
                  dj.showTooltip(displayMessage, dj.byId("tnx_amt").domNode, 0); 
                  
                  }
                }

			});
			m.connect("sec_beneficiary_address_line_4", "onFocus", function(){
				m.showTooltip(m.getLocalization('addressLine4ToolTip', 
						[dj.byId("sec_beneficiary_address_line_4").get("displayedValue"), dj.byId("sec_beneficiary_address_line_4").get("value") ]), d.byId("sec_beneficiary_address_line_4"), [ 'right' ],5000);
			});
			m.connect("assignee_address_line_4", "onFocus", function(){
				m.showTooltip(m.getLocalization('addressLine4ToolTip', 
						[dj.byId("assignee_address_line_4").get("displayedValue"), dj.byId("assignee_address_line_4").get("value") ]), d.byId("assignee_address_line_4"), [ 'right' ],5000);
			});
		},

		onFormLoad : function() {			
			var mainBankAbbvName = dj.byId("advising_bank_abbv_name").get('value');
			var isMT798Enable = m._config.customerBanksMT798Channel[mainBankAbbvName] === true;
			m.setCurrency(dj.byId("lc_cur_code"), ["tnx_amt", "org_lc_amt"]);

			if(isMT798Enable)
			{
				if(dj.byId("delivery_channel").get("value") === "")
				{
					m.animate("fadeIn", d.byId("bankInst"));
					dj.byId("delivery_channel").set("disabled", true);
				}
				else
				{
					m.animate("fadeIn", d.byId("bankInst"));
				}
				if(dj.byId("delivery_channel"))
				{
					m.animate("fadeIn", "delivery_channel_row");
					m.connect("delivery_channel", "onChange",  function(){
						if(dj.byId('attachment-file'))
						{
							if(dj.byId("delivery_channel").get('value') === 'FACT')
							{
								dj.byId('attachment-file').displayFileAct(true);
							}
							else
							{
								dj.byId('attachment-file').displayFileAct(false);
							}
						}
					});
					dj.byId("delivery_channel").onChange();
				}
			}
			else
			{
				m.animate("fadeOut", d.byId("bankInst"));
			}
			
			 var handle = dojo.subscribe(_deleteGridRecord, function(){
				 m.toggleFields(m._config.customerBanksMT798Channel[dj.byId("advising_bank_abbv_name")] === true && m.hasAttachments(), null, ["delivery_channel"], false, false);
			 });
			 
			if (dj.byId("advise_mode_code"))
			{
				m.toggleFields(dj.byId("advise_mode_code").get("value")==="02", [
			                       "advise_thru_bank_name", "advise_thru_bank_address_line_1",
			                       "advise_thru_bank_address_line_2", "advise_thru_bank_dom"],
			                       ["advise_thru_bank_name", "advise_thru_bank_address_line_1"]);

				if (dj.byId("advise_mode_code").get("value")=="02")
				{
					m.animate("wipeIn", d.byId('advise_thru_bank_name_img'));
				}
				else
				{
					m.animate("wipeOut", d.byId('advise_thru_bank_name_img'));
				}
			}
			if(dj.byId("sec_beneficiary_country"))
			{
				dj.byId("sec_beneficiary_country").set("required", false);
			}
			// wipe out the secondary beneficiary country row
			m.animate("wipeOut", d.byId('sec_beneficiary_country_row'));

			if(dj.byId("delivery_to") && dj.byId("narrative_delivery_to"))
			{
				if(dj.byId("delivery_to").get("value") === "" ||
						dj.byId("delivery_to").get("value") === "01" || dj.byId("delivery_to").get("value") === "03")
					{
							m.toggleFields((dj.byId("delivery_to").get("value") === "" || dj.byId("delivery_to").get("value") === "01" ||
									dj.byId("delivery_to").get("value") === "03" ), null, ["narrative_delivery_to"]);
							m.toggleRequired("narrative_delivery_to", false);
							dj.byId("narrative_delivery_to").set("value", "");
							dj.byId("narrative_delivery_to").set("disabled", true);
							document.getElementById("narrative_delivery_to_img").style.display = "none";
					}
				else
					{
					if(dj.byId("delivery_to").get("value") !== "")
						{
							dj.byId("narrative_delivery_to").set("disabled", false);
							m.toggleRequired("narrative_delivery_to", true);
							document.getElementById("narrative_delivery_to_img").style.display = "block";
						}
					}
			}			
			if(dj.byId("full_trf_flag"))
			{
				var tnxAmt = dj.byId("tnx_amt");
				if(dj.byId("full_trf_flag").get("checked")) {
					m.setTnxAmt(dj.byId("org_lc_amt").get("value"));
					tnxAmt.set("readOnly", true);
				} else {
					tnxAmt.reset();
					tnxAmt.set("readOnly", false);
				}
			}
			var applRule = dj.byId("applicable_rules");
			if(applRule) {
				m.toggleFields(
						applRule.get("value") == "99",
						null, ["applicable_rules_text"]);
			}
		},
		
		
		beforeSaveValidations : function() {
			// Validate transfer amount should be greater than zero
			var tnxAmt = dj.byId("tnx_amt") ? dj.byId("tnx_amt").get("value") : "";
			if(isNaN(tnxAmt) || (tnxAmt === 0))
			{
				m._config.onSubmitErrorMsg = m.getLocalization("transferAmountEmptyZero");
				dj.byId("tnx_amt").set("value","");
				return false;
			}
			// Check that transfer amount is not greater than LC amount
			if(tnxAmt !== ""){
				var lcAmt = dj.byId("org_lc_amt").get("value");
				if(lcAmt < tnxAmt) {
					//dj.byId("tnx_amt").reset();
					m._config.onSubmitErrorMsg =
						m.getLocalization("transferAmtGreaterThanLCAmtError");
					  dj.byId("tnx_amt").focus();
					return false;
				}
			}
			
			// Check that transfer amount is not greater than Available amount
            var utilizedAmt = dj.byId("utilized_amt") ? dj.byId("utilized_amt").get("value") : "";
            var utilizedAmtCurCode = dj.byId("utilized_amt_cur_code") ? dj.byId("utilized_amt_cur_code").get("value") : "";
            
            var lc_Amt = dj.byId("org_lc_amt") ? dj.byId("org_lc_amt").get("value") : "";
            var availableAmt=0.00;
            if(tnxAmt !== ""){
            	availableAmt= (lc_Amt-utilizedAmt);
            
             if(tnxAmt > availableAmt) {
              availableAmt=  availableAmt<0?dojo.currency.format(0):dojo.currency.format(availableAmt);
              
              m._config.onSubmitErrorMsg = m.getLocalization('transferAmtGreaterThanAvailableLCAmtWarning',[utilizedAmtCurCode,availableAmt]);
           
              dj.byId("tnx_amt").focus();
				return false;
             }
            }
			
			
			if(m._config.swift2018Enabled){
				if(dj.byId("narrative_period_presentation_nosend") && dj.byId("narrative_period_presentation_nosend").get("value") !== ""){
					var narrative_period_presentation = dj.byId("narrative_period_presentation_nosend").get("value");
					
					if(narrative_period_presentation.indexOf("\n") != -1){
						m._config.onSubmitErrorMsg =  m.getLocalization("periodOfPresentaionError");
						return false;
					}
				}
			}
			return true;
		},

		beforeSubmitValidations : function() {

			// Validate transfer amount should be greater than zero
			var tnxAmt = dj.byId("tnx_amt") ? dj.byId("tnx_amt").get("value") : "";
			if(isNaN(tnxAmt) || (tnxAmt === 0))
			{
				m._config.onSubmitErrorMsg = m.getLocalization("transferAmountEmptyZero");
				dj.byId("tnx_amt").set("value","");
				return false;
			}

			// Check that transfer amount is not greater than LC amount
			if(tnxAmt !== ""){
				var lcAmt = dj.byId("org_lc_amt").get("value");
				if(lcAmt < tnxAmt) {
					dj.byId("tnx_amt").reset();
					m._config.onSubmitErrorMsg =
						m.getLocalization("transferAmtGreaterThanLCAmtError");
					return false;
				}
			}
			
			// Check that transfer amount is not greater than Available amount
            var utilizedAmt = dj.byId("utilized_amt") ? dj.byId("utilized_amt").get("value") : "";
            var utilizedAmtCurCode = dj.byId("utilized_amt_cur_code") ? dj.byId("utilized_amt_cur_code").get("value") : "";
            
            var lc_Amt = dj.byId("org_lc_amt") ? dj.byId("org_lc_amt").get("value") : "";
            var availableAmt=0.00;
            if(tnxAmt !== ""){
            	availableAmt= (lc_Amt-utilizedAmt);
            
             if(tnxAmt > availableAmt) {
              availableAmt=  availableAmt<0?dojo.currency.format(0):dojo.currency.format(availableAmt);
              
              m._config.onSubmitErrorMsg = m.getLocalization('transferAmtGreaterThanAvailableLCAmtWarning',[utilizedAmtCurCode,availableAmt]);
           
              dj.byId("tnx_amt").focus();
				return false;
             }
            }
				
			if(m._config.swift2018Enabled){
				if(dj.byId("narrative_period_presentation_nosend") && dj.byId("narrative_period_presentation_nosend").get("value") !== ""){
					var narrative_period_presentation = dj.byId("narrative_period_presentation_nosend").get("value");
					
					if(narrative_period_presentation.indexOf("\n") != -1){
						m._config.onSubmitErrorMsg =  m.getLocalization("periodOfPresentaionError");
						return false;
					}
				}
			}

			return true;
		}
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.trade.message_transfer_sr_client');