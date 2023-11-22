dojo.provide("misys.binding.trade.create_si_swift");

//
// Copyright (c) 2007-2018 Finastra
// All Rights Reserved. 
//
//
// Summary: 
// Event Binding for Letter of Credit (SI) Form specific for SWIFT 2018 enhancements
//
// version:   1.0
// date:      11/11/2017
//@author :   Avilash
//

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
dojo.require("misys.form.SimpleTextarea");
dojo.require("misys.widget.Collaboration");
dojo.require("misys.form.common");
dojo.require("misys.form.file");
dojo.require("misys.validation.common");
dojo.require("misys.binding.SessionTimer");
dojo.require("misys.binding.trade.ls_common");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {
	
	function _fetchNarrativeContent() {
		var isSingleFieldValid = true, isCombinedValid = true;
		var descOfGoods, docsRequired, addInstructions, specBeneficiary, specBeneficiaryBank, allNarratives = "", singleNarrative = "", singleLimit, singleEntered, limit, entered;
		if(dj.byId("narrative_description_goods") && dj.byId("narrative_documents_required") && dj.byId("narrative_additional_instructions") && dj.byId("narrative_special_beneficiary")){
			
			if(dj.byId("narrative_description_goods")){
				descOfGoods = dj.byId("narrative_description_goods").get("value") !== "" ? dj.byId("narrative_description_goods").get("value") + "\n" : "";
			}
			if(dj.byId("narrative_documents_required")){
				docsRequired = dj.byId("narrative_documents_required").get("value") !== "" ? dj.byId("narrative_documents_required").get("value") + "\n" : "";
			}
			if(dj.byId("narrative_additional_instructions")){
				addInstructions = dj.byId("narrative_additional_instructions").get("value") !== "" ? dj.byId("narrative_additional_instructions").get("value") + "\n" : "";
			}
			if(dj.byId("narrative_special_beneficiary")){
				specBeneficiary = dj.byId("narrative_special_beneficiary").get("value") !== "" ? dj.byId("narrative_special_beneficiary").get("value") + "\n" : "";
			}			
			if(dj.byId("narrative_special_recvbank")){
				specBeneficiaryBank = dj.byId("narrative_special_recvbank").get("value") !== "" ? dj.byId("narrative_special_recvbank").get("value") + "\n" : "";
			}
			if(!m._config.isBank){
				allNarratives = descOfGoods + docsRequired + addInstructions + specBeneficiary;
			}
			else{
				allNarratives = descOfGoods + docsRequired + addInstructions + specBeneficiary + specBeneficiaryBank;
			}
			if(dj.byId(this.id)) {
				singleLimit = 800 * this.cols;
				singleNarrative = dj.byId(this.id).get("value") !== "" ? dj.byId(this.id).get("value") + "\n" : "";
				singleEntered = singleNarrative.length;
				isSingleFieldValid = m.validateExtNarrativeSwiftInit2018(singleNarrative, true);
			}
			isCombinedValid = m.validateExtNarrativeSwiftInit2018(allNarratives, false);
			
			limit = 1000 * this.cols;
			entered = allNarratives.length;
			if(isSingleFieldValid) {
				this.invalidMessage  = m.getLocalization("invalidFieldSizeError",[limit, entered]);
			}
			else {
				this.invalidMessage  = m.getLocalization("invalidSingleFieldLength",[singleLimit, singleEntered]);
			}
			return isSingleFieldValid && isCombinedValid;
		}
	}
	
	'use strict';

	
	// Public Functions and Variables
	d.mixin(m, {

		/**
		 * <h4>Summary:</h4>
		 * This function binds the UI form elements  event handlers required specifically for SWIFT 2018 enhancements
		 * Executed on SWITCH ON
		 * @method _bindSwift2018
		 */
		_bindSwift2018 : function () {
			m.connect("cfm_inst_code_1", "onClick", m.resetConfirmationChargesLC);
			m.connect("cfm_inst_code_2", "onClick", m.resetConfirmationChargesLC);
			m.connect("cfm_inst_code_3", "onClick", m.resetConfirmationChargesLC);
			//SWIFT 2018
			m.setValidation("advising_bank_iso_code", m.validateBICFormat);	
			m.setValidation("advise_thru_bank_iso_code", m.validateBICFormat);
			m.setValidation("requested_confirmation_party_iso_code", m.validateBICFormat);
			if(misys._config.swiftExtendedNarrativeEnabled){
				m.setValidation("narrative_additional_instructions", _fetchNarrativeContent);
				m.setValidation("narrative_documents_required", _fetchNarrativeContent);
				m.setValidation("narrative_description_goods", _fetchNarrativeContent);
				m.setValidation("narrative_special_beneficiary", _fetchNarrativeContent);
				if(dj.byId("narrative_special_recvbank")){
					m.setValidation("narrative_special_recvbank", _fetchNarrativeContent);
				}
			}
			m.connect("advising_bank_iso_code", "onChange", function(){
				var bicCodeValue = this.get("value");
				if(bicCodeValue.length > 0){
					m.setRequiredFields(["advising_bank_name","advising_bank_address_line_1"] , false);
				}
			});
			m.connect("advise_thru_bank_iso_code", "onChange", function(){
				var bicCodeValue = this.get("value");
				if(bicCodeValue.length > 0){
					m.setRequiredFields(["advise_thru_bank_name","advise_thru_bank_address_line_1"] , false);
				}
			});
			m.connect("requested_confirmation_party_iso_code", "onChange", function(){
				var bicCodeValue = this.get("value");
				if(bicCodeValue.length > 0){
					m.setRequiredFields(["requested_confirmation_party_name","requested_confirmation_party_address_line_1"] , false);

				}
			});
			m.connect("req_conf_party_flag", "onChange" , m.resetBankRequiredFields);
			m.connect("narrative_period_presentation", "onBlur", function(){
				var narrPeriodPresentation = dj.byId("narrative_period_presentation").get("value");
				dj.byId("narrative_period_presentation_nosend").set("value",narrPeriodPresentation);
			});
			m.setValidation("period_presentation_days",m.validatePeriodPresentationDays);
		},
		
		
		/**
		 * <h4>Summary:</h4>
		 * This function runs a set of code specifically required on form load LC for SWIFT 2018 enahancements.
		 * Executed on SWITCH ON
		 * @method _formLoadSwift2018
		 */
		_onFormLoadSwift2018 : function () {
			
			var option = dj.byId("CREATE_OPTION").get("value");
			if(option === "EXISTING" || option === "BACK_TO_BACK"){
				m.dialog.show("CONFIRMATION", m.getLocalization("warningMsgCreateLC"), "", 
						"", "","","",function(){
					var screenURL = "/screen/StandbyIssuedScreen?option="+option+"&tnxtype=01";
					window.location.href = misys.getServletURL(screenURL);
					return;
						}
					);
			}
			
			//While loading the page check if the Transhipment and PartialShipment dropdown has 'CONDITIONAL' set,
			//then the information text must be displayed 
			var transFieldValue = dj.byId("tran_ship_detl").value;
			var partShipFieldValue = dj.byId("part_ship_detl").value;
			var mode = m._config.displayMode;
			//If Confirmation Instructions is not 'Maybe' or 'Confirm' ,disable Requested Confirmation Party
			if(mode ==="edit"){
				m.resetRequestedConfirmationParty();				
			}
			if((transFieldValue != '' && transFieldValue != 'ALLOWED' && transFieldValue != 'NOT ALLOWED' && transFieldValue != 'NONE') && mode ==="edit"){
				d.byId("infoMessageTranshipment").style.display = "block";
				d.byId("infoMessageTranshipment").style.paddingLeft = "250px";
			}
			else{
				d.byId("infoMessageTranshipment").style.display = "none";
			}
			if((partShipFieldValue != '' && partShipFieldValue != 'ALLOWED' && partShipFieldValue != 'NOT ALLOWED' && partShipFieldValue != 'NONE') && mode ==="edit"){
				d.byId("infoMessagePartialShipment").style.display = "block";
				d.byId("infoMessagePartialShipment").style.paddingLeft = "250px";
			}
			else{
				d.byId("infoMessagePartialShipment").style.display = "none";
			}
			if(dj.byId("req_conf_party_flag")){			
				var requestedConfirmationFlag=dj.byId("req_conf_party_flag").value;		
				if(requestedConfirmationFlag === "Other"){
					d.byId("requested-conf-party-bank-details").style.display = "block";
				}else{
					d.byId("requested-conf-party-bank-details").style.display = "none";
				}
			}
			
		},
		/**
		 * <h4>Summary:</h4>
		 * This function runs a set of code specifically required before submit of LC form for SWIFT 2018 enhancements.
		 * Executed on SWITCH ON
		 * @method _formLoadSwift2018
		 */
		_beforeSubmitValidationsSwift2018 : function () {
			
			/*Validate to check if either 'Bank Name' & 'Address' or BIC code is entered for the dropdown selected in
			Requested Confirmation Party
			Perform these validations before form submit only if RQF is not null and not blank
			*/		
			if(dj.byId("req_conf_party_flag") && dj.byId("req_conf_party_flag").get("value") !== ""){
					
				if(dj.byId("req_conf_party_flag").get("value") === "Advising Bank"){
					 return m.validateBankEntry("advising_bank");
				}else if (dj.byId("req_conf_party_flag").get("value") === "Advise Thru Bank"){
					 return m.validateBankEntry("advise_thru_bank");
				}else if (dj.byId("req_conf_party_flag").get("value") === "Other"){
						  if(!m.validateBankEntry("requested_confirmation_party")){
							  m._config.onSubmitErrorMsg =  m.getLocalization("requestedConfirmationPartyError");
							  return false;
						  }else{
							  return true;
						  }
					}				
			}

			if(dj.byId("narrative_period_presentation_nosend") && dj.byId("narrative_period_presentation_nosend").get("value") !== ""){
				var narrative_period_presentation = dj.byId("narrative_period_presentation_nosend").get("value");
				
				if(narrative_period_presentation.indexOf("\n") != -1){
					m._config.onSubmitErrorMsg =  m.getLocalization("periodOfPresentaionError");
					return false;
				}
			}
			//Added the validation for rolling renewal no as part of MPS-50486
			if(dj.byId("rolling_renewal_flag") && dj.byId("rolling_renewal_nb") && dj.byId("rolling_renewal_flag").get("checked") && d.number.parse(dj.byId("rolling_renewal_nb").get("value")) === 1)
			{
				console.debug("Invalid Number of Rolling renewals");
				dj.byId("rolling_renewal_nb").set("state","Error");
				m._config.onSubmitErrorMsg =  m.getLocalization("invalidNumberOfRollingRenewals");
				// clearing the field as part of MPS-50486
				dj.byId("rolling_renewal_nb").set("value"," ");
				return false;
			}
			return true; 
		}
		
	});

	
})(dojo, dijit, misys);//Including the client specific implementation
dojo.require('misys.client.binding.trade.create_si_swift_client');