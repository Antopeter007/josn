dojo.provide("misys.binding.trade.release_si");

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
dojo.require("dijit.form.DateTextBox");
dojo.require("dijit.form.CurrencyTextBox");
dojo.require("dijit.form.FilteringSelect");
dojo.require("misys.form.SimpleTextarea");
dojo.require("misys.widget.Collaboration");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode
	
	// Private functions and variables go here
	 var _deleteGridRecord = "deletegridrecord";
	
	function _validateReleaseAmount(){
		//  summary:
	    //       Validates the release amount. Must be applied to an input field of 
		//       dojoType dijit.form.CurrencyTextBox.
		
		var siReleaseAmt = dj.byId("release_amt");
		var SiAmount = dj.byId("lc_amt");
		
		if(siReleaseAmt && SiAmount)
		{
			var siAmtValue = dj.byId("lc_amt").get("value");
			var siReleaseAmtValue = dj.byId("release_amt").get("value");
			
			// set tnx_amt
			dj.byId("tnx_amt").set("value", siReleaseAmtValue);
			
			console.debug("[misys.binding.trade.release_bg] Validating Release Amount, Value = ", siReleaseAmtValue);
			console.debug("[misys.binding.trade.release_bg] Original Amount, Value = ", siAmtValue);
			console.debug("[misys.binding.trade.release_bg] Tnx Amount, Value = ", dj.byId("tnx_amt").get("value"));
			console.debug("[misys.binding.trade.release_bg] utilized Amount, Value = ", dj.byId("utilized_amt").get("value"));
			console.debug("[misys.binding.trade.release_bg] Content of Error Message = ", m.getLocalization("releaseAmtGreaterThanLCAmtError"));
	
			var relFlag = dj.byId("lc_release_flag");
			if((siReleaseAmtValue == siAmtValue) && !(relFlag.get("checked")))
			{
				m.dialog.show("ERROR", m.getLocalization("selectReleaseFull"));
				m._config.onSubmitErrorMsg = m.getLocalization("selectReleaseFull");
				return false;
			}
		}
		return true;
	}
	
	function _isReleaseAmtEmptyOrZero(){
		var isReleaseAmtEmptyOrZero = true;
		// Validate release amount should be greater than zero
		var relAmt = dj.byId("release_amt") ? dj.byId("release_amt").get("value") : "";
		if(isNaN(relAmt) || (relAmt === 0))
		{
			dj.byId("release_amt").set("value","");
			isReleaseAmtEmptyOrZero =  false;
		}
		return isReleaseAmtEmptyOrZero;
	}

	d.mixin(m._config, {

		initReAuthParams : function() {
									
			var reAuthParams = {
				productCode : 'SI',	
				subProductCode : '',
				transactionTypeCode : "03",	
				entity : dj.byId("entity") ? dj.byId("entity").get("value") : '',
				currency : dj.byId("lc_cur_code")? dj.byId("lc_cur_code").get('value') : '',				
				amount : dj.byId("lc_amt")? m.trimAmount(dj.byId("lc_amt").get('value')) : '',
												
				es_field1 : '',
				es_field2 : ''				
			};
			return reAuthParams;
		}
	});
	
	// Public functions & variables follow
	d.mixin(m, {

		bind : function() {
			
			m.connect("lc_release_flag", "onClick", function(){
				var siLiabAmtField = dj.byId("release_amt"),
					siAmtValue = dj.byId("lc_amt").get("value");
				if(this.get("checked")){
					siLiabAmtField.set("readOnly", true);
					siLiabAmtField.reset();
					siLiabAmtField.set("value", siAmtValue);
				} else {
					siLiabAmtField.set("readOnly", false);
					siLiabAmtField.reset();
					siLiabAmtField.set("value", siAmtValue);
				}
			});
			m.connect("release_amt", "onBlur", _validateReleaseAmount);
			m.setValidation("amd_date",m.validateAmendmentDate);
			m.connect("delv_org", "onChange", function(){
				if(this.get("value") === "99" || this.get("value") === "02")
					{
						if(this.get("value") === "99")
						{
							m.toggleFields((this.get("value") === "99"), null, ["delv_org_text"]);
							m.toggleRequired("delv_org_text", true);
							dj.byId("delv_org_text").set("value", "");
						}
						if(this.get("value") === "02")
						{
							m.toggleFields((this.get("value") === "02"), null, ["delv_org_text"]);
							m.toggleRequired("delv_org_text", true);
							dj.byId("delv_org_text").set("value", "");
						}
					}
				else
					{
						dj.byId("delv_org_text").set("disabled", true);
						dj.byId("delv_org_text").set("value", "");
						m.toggleRequired("delv_org_text", false);
					}
			});
			m.connect("delivery_to", "onChange", function(){
				if(this.get("value") === "" || this.get("value") === "04")
				{
					if(this.get("value") === "")
						{
							dj.byId("narrative_delivery_to").set("disabled", false);
							dj.byId("narrative_delivery_to").set("value", "");
							m.toggleRequired("narrative_delivery_to", false);
							document.getElementById("narrative_delivery_to_img").style.display = "block";
						}
					else
						{
							m.toggleFields((this.get("value") === "04"), null, ["narrative_delivery_to"]);
							m.toggleRequired("narrative_delivery_to", false);
							dj.byId("narrative_delivery_to").set("value", "");
							dj.byId("narrative_delivery_to").set("disabled", true);
							document.getElementById("narrative_delivery_to_img").style.display = "none";	
						}
				}
			else
				{
					dj.byId("narrative_delivery_to").set("disabled", false);
					dj.byId("narrative_delivery_to").set("value", "");
					m.toggleRequired("narrative_delivery_to", true);
					document.getElementById("narrative_delivery_to_img").style.display = "block";
				}
			});
			m.connect("release_amt", "onChange", function(){
			var utilizedAmt = dj.byId("utilized_amt").get("value");
			var siAmtValue = dj.byId("lc_amt").get("value");
			var siReleaseAmtValue = dj.byId("release_amt").get("value");
			var lcCurCode = dj.byId("lc_cur_code") ? dj.byId("lc_cur_code").get("value") : "";
	        
			 var availableAmt= (siAmtValue-utilizedAmt);
				if(siReleaseAmtValue > availableAmt)
				{
				var displayMessage = m.getLocalization("releaseAmtGreaterThanLCAmtError", [lcCurCode,availableAmt]);
	              dj.byId("release_amt").set("state","Error"); 
	              dj.showTooltip(displayMessage, dj.byId("release_amt").domNode, 0); 
				}
		});
		},

		onFormLoad : function() {
			var _lclibamtDiv = d.byId('org-lc-lib-amt');
			var isMT798Enable = m._config.customerBanksMT798Channel[dj.byId("issuing_bank_abbv_name").get("value")] === true && dj.byId("adv_send_mode").get("value") === "01";
					m.animate('fadeOut', _lclibamtDiv);
			m._config.productCode = "lc";
			/*console.debug("[amend_si] productCode>> ", m._config.productCode.toLowerCase());*/
			
			var tnxAmt = dj.byId("tnx_amt");
			
			m.setCurrency(dj.byId("lc_cur_code"),[ "release_amt","lc_amt"]);
			
			var releaseFlag = dj.byId("lc_release_flag"),
								siAmtValue =	dj.byId("lc_amt") ? dj.byId("lc_amt").get("value") : '';
			if(releaseFlag) {
				var siReleaseAmtField = dj.byId("release_amt");
				if(releaseFlag.get("value") == "on"){
					siReleaseAmtField.set("readOnly", true);
					siReleaseAmtField.set("value", siAmtValue);
				} 
				else if(tnxAmt && tnxAmt.get("value") != '' &&  tnxAmt.get("value") != null  && releaseFlag.get("value") != "on"){
					siReleaseAmtField.set("readOnly", false);
					siReleaseAmtField.set("value", tnxAmt.get("value"));
				}
				else{
					siReleaseAmtField.set("readOnly", false);
					siReleaseAmtField.set("value", siAmtValue);
				}
			}
			if(tnxAmt)
			{
				var siReleaseAmtValue = dj.byId("release_amt").get("value");			
				// set tnx_amt
				tnxAmt.set("value", siReleaseAmtValue);
			}
			
			var subTnxTypeCode = dj.byId("sub_tnx_type_code");
			var mainBankAbbvName = dj.byId("issuing_bank_abbv_name") ? dj.byId("issuing_bank_abbv_name").get("value") : "";
			if(subTnxTypeCode.get("value") == "05" && isMT798Enable)
			{
				if(dj.byId("delivery_channel").get("value") === "")
				{
					m.animate("fadeIn", d.byId("delivery_channel_row"));
					dj.byId("delivery_channel").set("disabled", true);
				}
				else
				{
					m.animate("fadeIn", d.byId("delivery_channel_row"));
				}
				// MT798 FileAct checkbox appears upon selection of 
				// File Act(FACT) 'option' from delivery_channel Combo Box
				if (dj.byId("delivery_channel")){
					
					if(!m.hasAttachments())
					{
						dj.byId("delivery_channel").set("disabled", true);
						dj.byId("delivery_channel").set("value", null);
					}
					else
						{
							m.toggleFields(m._config.customerBanksMT798Channel[mainBankAbbvName] === true && m.hasAttachments(), null, ["delivery_channel"], false, false);
						}
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
				m.animate("fadeOut", d.byId("delivery_channel_row"));
			}
			var handle = dojo.subscribe(_deleteGridRecord, function(){
				 m.toggleFields(m._config.customerBanksMT798Channel[mainBankAbbvName] === true && m.hasAttachments(), null, ["delivery_channel"], false, false);
			 });
			
			
			if(dj.byId("delv_org") && dj.byId("delv_org_text"))
			{
				if(dj.byId("delv_org").value === '99' || dj.byId("delv_org").value === '02')
				{
					dj.byId("delv_org_text").set("disabled", false);
					m.toggleRequired("delv_org_text", true);
				}
				else
				{
					dj.byId("delv_org_text").set("disabled", true);
					m.toggleRequired("delv_org_text", false);
				}
			}
			if(dj.byId("delivery_to") && dj.byId("narrative_delivery_to"))
			{
				if(dj.byId("delivery_to").get("value") === "04")
					{
							m.toggleFields((dj.byId("delivery_to").get("value") === "04"), null, ["narrative_delivery_to"]);
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
						
		},
		
		/**
		 * <h4>Summary:</h4>  Before save validation method.
		 * <h4>Description</h4> : This method is called before saving a transaction.
		 * Any before save validation can be added in this method for SI. 
		 *
		 * @method beforeSaveValidations
		 */
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
			
			if(!_isReleaseAmtEmptyOrZero())
			{
				m._config.onSubmitErrorMsg = m.getLocalization("releaseAmountEmptyZero");
				return false;
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
			var utilizedAmt = dj.byId("utilized_amt").get("value");
			var siAmtValue = dj.byId("lc_amt").get("value");
			var siReleaseAmtValue = dj.byId("release_amt").get("value");
			var siReleaseAmount = dj.byId("release_amt");
			var lcCurCode = dj.byId("lc_cur_code") ? dj.byId("lc_cur_code").get("value") : "";
	        
			 var availableAmt= (siAmtValue-utilizedAmt);
				if(siReleaseAmtValue > availableAmt)
				{
				  m._config.onSubmitErrorMsg = m.getLocalization("releaseAmtGreaterThanLCAmtError", [lcCurCode,availableAmt]);
				  m.showTooltip(m.getLocalization('releaseAmtGreaterThanLCAmtError',[ lcCurCode,availableAmt]), siReleaseAmount.domNode);
				  siReleaseAmount.focus();
	              return false;
				}
			return true;
			
		},

		beforeSubmitValidations : function() {
			// We check that at least one of the field describing the amendment
			// contains data (SWIFT 2006)
			var fieldsToCheck = ["lc_liab_amt", "amd_details", "file"];

			// Check that all fields are present.
			var allFieldsPresent = d.every(fieldsToCheck, function(id){
				if(d.byId(id)){
					return true;
				}
				return false;
			});
			

			if(!_isReleaseAmtEmptyOrZero())
			{
				m._config.onSubmitErrorMsg = m.getLocalization("releaseAmountEmptyZero");
				return false;
			}

			if(allFieldsPresent) {
				
				// See if a file has been attached
				var hasAttachedFile = (d.query("#edit [id^='file_row_']").length > 1);
				
				// Check textarea and remaining fields
				if(!hasAttachedFile && 
						!dj.byId("lc_liab_amt").get("value") &&
						(dj.byId("amd_details").get("value") == "")){
					m._config.onSubmitErrorMsg = m.getLocalization("noAmendmentError");
					return false;
				}
			}
			//Check if previous expiry date is less than amendment date in case new expiry date is not set, return false
			var amdDate = dj.byId("amd_date"),prevExpDate = dj.byId("org_exp_date");
         	if(amdDate && prevExpDate && prevExpDate.get("value")!== null)
         	{
         		if(!m.compareDateFields(amdDate, prevExpDate)) 
         		{
         			m._config.onSubmitErrorMsg  = m.getLocalization("amendDateGreaterThanOldExpiryDate",[ amdDate.get("displayedValue"), prevExpDate.get("displayedValue") ]);
         			return false;
         		}
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
			
			var utilizedAmt = dj.byId("utilized_amt").get("value");
			var siAmtValue = dj.byId("lc_amt").get("value");
			var siReleaseAmtValue = dj.byId("release_amt").get("value");
			var siReleaseAmount = dj.byId("release_amt");
			var lcCurCode = dj.byId("lc_cur_code") ? dj.byId("lc_cur_code").get("value") : "";
	        
			var availableAmt= (siAmtValue-utilizedAmt);
			if(siReleaseAmtValue > availableAmt)
			{
			     m._config.onSubmitErrorMsg = m.getLocalization("releaseAmtGreaterThanLCAmtError", [lcCurCode,availableAmt]);
			     m.showTooltip(m.getLocalization('releaseAmtGreaterThanLCAmtError',[ lcCurCode,availableAmt]), siReleaseAmount.domNode);
			     siReleaseAmount.focus();
	             return false;
			}
						
			var siReleaseAmt = dj.byId("release_amt");
			if(siReleaseAmt && siReleaseAmt.get("value") === 0)
			{
				m._config.onSubmitErrorMsg = m.getLocalization("canNotProceedTheTransaction");
				return false;
			}
			else{
				return _validateReleaseAmount();
			}
		}
		
		
		
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.trade.release_si_client');