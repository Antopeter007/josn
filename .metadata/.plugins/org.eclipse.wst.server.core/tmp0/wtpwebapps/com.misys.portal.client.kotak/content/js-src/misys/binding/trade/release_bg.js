dojo.provide("misys.binding.trade.release_bg");

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
	
	// dojo.subscribe once a record is deleted from the grid
    var _deleteGridRecord = "deletegridrecord";
	
	// Private functions and variables go here
	
	function _validateReleaseAmount(){
		//  summary:
	    //       Validates the release amount. Must be applied to an input field of 
		//       dojoType dijit.form.CurrencyTextBox.
		
		var bgReleaseAmt = dj.byId("release_amt");
		var orgBgLiabAmt = dj.byId("org_bg_liab_amt");
		
		var bgReleaseAmtValue = bgReleaseAmt ? bgReleaseAmt.get("value") : "";
		var orgBgLiabAmtValue = orgBgLiabAmt ? orgBgLiabAmt.get("value") : "";
		
		// set tnx_amt
		dj.byId("tnx_amt").set("value", bgReleaseAmt);
		
		console.debug("[misys.binding.trade.release_bg] Validating Release Amount, Value = ", bgReleaseAmtValue);
		console.debug("[misys.binding.trade.release_bg] Original Amount, Value = ", orgBgLiabAmtValue);
		console.debug("[misys.binding.trade.release_bg] Tnx Amount, Value = ", dj.byId("tnx_amt").get("value"));
		console.debug("[misys.binding.trade.release_bg] Content of Error Message = ", m.getLocalization("releaseAmtGreaterThanOrgLiabAmtError"));

		if(bgReleaseAmt && orgBgLiabAmt && (bgReleaseAmtValue <= 0 || bgReleaseAmtValue > orgBgLiabAmtValue))
		{
			m.dialog.show("ERROR", m.getLocalization("releaseAmtGreaterThanOrgLiabAmtError"));
			return false;
		}
	
		return true;
	}

	d.mixin(m._config, {

		initReAuthParams : function() {
									
			var reAuthParams = {
				productCode : 'BG',	
				subProductCode : '',
				transactionTypeCode : '03',	
				entity : dj.byId("entity") ? dj.byId("entity").get("value") : '',
				currency : dj.byId("bg_cur_code")? dj.byId("bg_cur_code").get('value') : '',				
				amount : dj.byId("bg_amt")? m.trimAmount(dj.byId("bg_amt").get('value')) : '',
												
				es_field1 : '',
				es_field2 : ''				
			};
			return reAuthParams;
		}
	});
	
	// Public functions & variables follow
	d.mixin(m, {

		bind : function() {
			
			m.connect("bg_release_flag", "onClick", function(){
				var bgReleaseAmtField = dj.byId("release_amt"),
					orgBgLiabAmtValue = dj.byId("org_bg_liab_amt").get("value");
				if(this.get("checked")){
					bgReleaseAmtField.set("readOnly", true);
					bgReleaseAmtField.set("value", orgBgLiabAmtValue);
				} else {
					bgReleaseAmtField.set("readOnly", false);
					bgReleaseAmtField.set("value", orgBgLiabAmtValue);
				}
			});
			m.connect("release_amt", "onBlur", _validateReleaseAmount);
			m.setValidation("amd_date",m.validateAmendmentDate);
		},

		onFormLoad : function() {
			var recipientBankAbbvName = dj.byId("recipient_bank_abbv_name").get("value");
			var isMT798Enable = m._config.customerBanksMT798Channel[recipientBankAbbvName] === true && dj.byId("adv_send_mode").get("value") === "01";
			var _bglibamtDiv = d.byId('org-bg-lib-amt');
			m.animate('fadeOut', _bglibamtDiv);
			m.setCurrency(dj.byId("bg_cur_code"),[ "release_amt"]);
			m.setCurrency(dj.byId("bg_cur_code"),[ "org_bg_liab_amt"]);
			m.setCurrency(dj.byId("bg_cur_code"),[ "bg_os_amt"]);
			var tnxAmt = dj.byId("tnx_amt");			
			var releaseFlag = dj.byId("bg_release_flag");
			if(releaseFlag) {
				var bgReleaseAmtField = dj.byId("release_amt"),
						orgBgLiabAmtValue = dj.byId("org_bg_liab_amt") ? dj.byId("org_bg_liab_amt").get("value") :"";	
				if(releaseFlag.get("value") == "on"){
					bgReleaseAmtField.set("readOnly", true);
					bgReleaseAmtField.set("value", orgBgLiabAmtValue);
				} 
				else if(tnxAmt && tnxAmt.get("value") !== '' &&  tnxAmt.get("value") !== null  && releaseFlag.get("value") !== "on"){
					bgReleaseAmtField.set("readOnly", false);
					bgReleaseAmtField.set("value", tnxAmt.get("value"));
				}
				else {
					bgReleaseAmtField.set("readOnly", false);
					bgReleaseAmtField.set("value", orgBgLiabAmtValue);
				}
			}
			var subTnxTypeCode = dj.byId("sub_tnx_type_code");
			if(subTnxTypeCode.get("value") == "05" && isMT798Enable)
			{
				if(dj.byId("delivery_channel") && dj.byId("adv_send_mode") && dj.byId("adv_send_mode").get("value") === "01" && m.hasAttachments())
				{
							misys.toggleFields(true, null, ["delivery_channel"], false, false);
				}
				if(dj.byId("delivery_channel").get("value") === "" && !m.hasAttachments())
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
				if(dj.byId("delivery_channel"))
				{
					dj.byId("delivery_channel").set("required", false);
				}	
			}
			if(tnxAmt)
				{
					var bgReleaseAmtValue = dj.byId("release_amt") ? dj.byId("release_amt").get("value"): '';			
					// set tnx_amt
					tnxAmt.set("value", bgReleaseAmtValue);
				}
			
			 var handle = dojo.subscribe(_deleteGridRecord, function(){
				 m.toggleFields(m._config.customerBanksMT798Channel[recipientBankAbbvName] === true && m.hasAttachments(), null, ["delivery_channel"], false, false);
			 });
		},

		beforeSubmitValidations : function() {
			// We check that at least one of the field describing the amendment
			// contains data (SWIFT 2006)
			var fieldsToCheck = ["bg_liab_amt", "amd_details", "file"];

			// Check that all fields are present.
			var allFieldsPresent = d.every(fieldsToCheck, function(id){
				if(d.byId(id)){
					return true;
				}
				return false;
			});

			if(allFieldsPresent) {
				
				// See if a file has been attached
				var hasAttachedFile = (d.query("#edit [id^='file_row_']").length > 1);
				
				// Check textarea and remaining fields
				if(!hasAttachedFile && 
						!dj.byId("bg_liab_amt").get("value") &&
						(dj.byId("amd_details").get("value") === "")){
					m._config.onSubmitErrorMsg = m.getLocalization("noAmendmentError");
					return false;
				}
			}
			
			//Check if previous expiry date is less than amendment date in case new expiry date is not set, return false
			var amdDate = dj.byId("amd_date");
         	if(amdDate && dj.byId("org_exp_date") && dj.byId("org_exp_date").get("value")!== null)
         	{
         		var prevExpDate = dj.byId("org_exp_date");
         		if(!m.compareDateFields(amdDate, prevExpDate)) 
         		{
         			m._config.onSubmitErrorMsg  = m.getLocalization("amendDateGreaterThanOldExpiryDate",[ amdDate.get("displayedValue"), prevExpDate.get("displayedValue") ]);
         			return false;
         		}
         	}
			var bgReleaseAmt = dj.byId("release_amt");
			if(bgReleaseAmt) {
				return _validateReleaseAmount();
			}
			return true;
		}
		
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.trade.release_bg_client');