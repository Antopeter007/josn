dojo.provide("misys.binding.bank.report_el_swift");

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
	
	// Public functions & variables follow
	d.mixin(m, {

		_bindSwift2018 : function() {
			//SWIFT 2018
			m.connect(dj.byId("prod_stat_code"), "onChange", function(){
				this.validate();
				m.refreshUIforAmendmentMO();
				
			});
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
			m.connect("req_conf_party_flag", "onChange", function(){
				var reqConfFlagValue = this.get("value");
				if(reqConfFlagValue == "Advise Thru Bank" || reqConfFlagValue == "Other"){
					document.getElementById("requested-conf-party-bank-details").style.display = "block";
					m.toggleFields(true , 
							["requested_confirmation_party_name","requested_confirmation_party_address_line_1","requested_confirmation_party_address_line_2","requested_confirmation_party_dom","requested_confirmation_party_iso_code"],null,null,true);
				}
				else{
					document.getElementById("requested-conf-party-bank-details").style.display = "none";		
					m.toggleFields(false , 
							["requested_confirmation_party_name","requested_confirmation_party_address_line_1","requested_confirmation_party_address_line_2","requested_confirmation_party_dom","requested_confirmation_party_iso_code"],null,null,false);
				}
	 	 	 });
			m.connect("requested_confirmation_party_iso_code", "onChange", function(){
				var bicCodeValue = this.get("value");
				if(bicCodeValue.length > 0){
					m.setRequiredFields(["requested_confirmation_party_name","requested_confirmation_party_address_line_1"] , false);

				}
			});
			m.setValidation("period_presentation_days",m.validatePeriodPresentationDays);
		},

		_onFormLoadSwift2018 : function() {			
			//SWIFT 2018
			if(dj.byId("req_conf_party_flag")){			
				var requestedConfirmationFlag=dj.byId("req_conf_party_flag").value;
				var mode = m._config.displayMode;
				if(mode =="edit" && ""!= requestedConfirmationFlag){
					document.getElementById("requested-conf-party").style.display = "block";
					if(requestedConfirmationFlag == "Advise Thru Bank" || requestedConfirmationFlag == "Other"){
						document.getElementById("requested-conf-party-bank-details").style.display = "block";
					}
				}
				//If user does not select 'Confirmation instructions' as 'Confirm' or May add',then requestedConfirmation must be disabled.
				if(requestedConfirmationFlag ==""){
					dj.byId("req_conf_party_flag").set("disabled",true);
				}
				
			}
			m.refreshUIforAmendmentMO();			
			m.toggleNarrativeDivStatus(true,'');
			if(dj.byId("adv_send_mode") && dj.byId("adv_send_mode").get("value") === '01' && dj.byId("narrative_charges")) {
				dj.byId("narrative_charges").maxSize = 6;
			}
		},

		_beforeSubmitValidationsSwift2018 : function() {
			//SWIFT 2018
			/*Validates the narrative text content size and includes z-char validation*/
			if(dj.byId("adv_send_mode") && dj.byId("adv_send_mode").get("value") == 1 && document.getElementById("tabNarrativeDescriptionGoods"))
			{
				//Commented code is to set the exclamation mark on the narrative tab group titles, in case of validation failure.(To be implemented)
				/*var arrayOfFields = ["Description of Goods","Documents Required","Additional Instructions"];
				for(var itr = 0; itr < arrayOfFields.length; itr++){
					dijit.byId("narrative-details-tabcontainer").selectedChildWidget.set("title","<span class='tabChangeStyle'>"+arrayOfFields[itr]+"</span><img class='errorIcon' src='/content/images/warning.png' alt='This tab contains fields that are in error' title='This tab contains fields that are in error'>");
				}
				dijit.byId("narrative-special-payments-beneficiary-tabcontainer").selectedChildWidget.set("title","<span class='tabChangeStyle'>Special Payment Conditions for Beneficiary</span><img class='errorIcon' src='/content/images/warning.png' alt='This tab contains fields that are in error' title='This tab contains fields that are in error'>");*/
				var is798 = false;
				if(dj.byId("is798") && dj.byId("is798").get("value") != ''){
					is798 = dj.byId("is798").get("value") == 'Y' ? true : false;
				}
				var dataStoreNarrative = [m._config.narrativeDescGoodsDataStore,m._config.narrativeDocsReqDataStore,m._config.narrativeAddInstrDataStore,m._config.narrativeSpBeneDataStore,m._config.narrativeSpRecvbankDataStore];
				
				var i, msgRows = 0, itrNarr = 0, fieldSize = 0, smoothScrollTab = "narrative-details-tabcontainer", lengthValidationPassed = true, flag;
				var regex=dj.byId("swiftregexzcharValue").get("value");
				var swiftregexp = new RegExp(regex);
				m._config.isNarrativeZCharValidArray = [true, true, true, true, true]; //To store the status of individual narrative fields. Used in tooltip in common.js
				var singleMsgRows = [0, 0, 0, 0, 0];
				m._config.isSingleNarrativeValid = [true, true, true, true, true];
				var domNodeArray = ["tabNarrativeDescriptionGoods","tabNarrativeDocumentsRequired","tabNarrativeAdditionalInstructions","tabNarrativeSpecialBeneficiary","tabNarrativeSpecialReceivingBank"];
				
				if(document.getElementById("tabNarrativeDescriptionGoods").status == true){
					for(itr = 0; itr < 5; itr++){
						i = 0; flag = true;
						if(dataStoreNarrative && dataStoreNarrative[itr]){
							d.forEach(dataStoreNarrative[itr], function(){
								if(dataStoreNarrative[itr][i] && dataStoreNarrative[itr][i] !== null && flag){
									dataStoreNarrative[itr][i].content[0].replace(/&#xa;/g,'\n');
									fieldSize += dataStoreNarrative[itr][i].content[0].length;
									msgRows += dataStoreNarrative[itr][i].text_size[0];
									singleMsgRows[itr] += dataStoreNarrative[itr][i].text_size[0];
									flag = swiftregexp.test(dataStoreNarrative[itr][i].content[0]);
									m._config.isNarrativeZCharValidArray[itr] = flag;
								}
								i++;
							});
						}
						
						if(!m._config.isNarrativeZCharValidArray[itr] || 
								(dojo.some(singleMsgRows, function(status){ return status > (is798 ? 792 : 800);}))){
							if(!m._config.isNarrativeZCharValidArray[itr]){
								m.toggleNarrativeDivStatus(m._config.isNarrativeZCharValidArray[itr], domNodeArray[itr]);	
							}
							else if(singleMsgRows[itr] > (is798 ? 792 : 800)) {
								m._config.isSingleNarrativeValid[itr] = false;
								m.toggleNarrativeDivStatus(m._config.isSingleNarrativeValid[itr], domNodeArray[itr]);
								lengthValidationPassed = false;
							}
						}
					}
					if(msgRows >  (is798 ? 992 : 1000)) {
						d.forEach(m._config.isSingleNarrativeValid, function(){
							m._config.isSingleNarrativeValid[itrNarr] = true;
						});
						m.toggleNarrativeDivStatus(false);
						lengthValidationPassed = false;
					}
				}
				else if(msgRows > (is798 ? 992 : 1000) || document.getElementById("tabNarrativeDescriptionGoods").status == false){
					itrNarr = 0;
					d.forEach(m._config.isSingleNarrativeValid, function(){
						m._config.isSingleNarrativeValid[itrNarr] = true;
					});
					if(document.getElementById("tabNarrativeDescriptionGoods").status == true){
						m.toggleNarrativeDivStatus(false);
					}
					lengthValidationPassed = false;
				}
				if(!lengthValidationPassed || (dojo.some(m._config.isNarrativeZCharValidArray, function(narrativeStatus){ return narrativeStatus == false; }))){
					if(m._config.isNarrativeZCharValidArray.indexOf(false) > 3){
						smoothScrollTab = "narrative-special-payments-beneficiary-tabcontainer";
					}
					 dojox.fx.smoothScroll({
							node: document.getElementById(smoothScrollTab), 
							win: window
						}).play();
	         	 return false;
				}
			}
			
			//Validate to check if either 'Bank Name' & 'Address' or BIC code is entered for RequestedConfirmationParty
			if(dj.byId("req_conf_party_flag")){
				if(dj.byId("req_conf_party_flag").get("value") === "Advise Thru Bank" || dj.byId("req_conf_party_flag").get("value") === "Other"){
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
			return true;
		}
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.bank.report_el_swift_client');