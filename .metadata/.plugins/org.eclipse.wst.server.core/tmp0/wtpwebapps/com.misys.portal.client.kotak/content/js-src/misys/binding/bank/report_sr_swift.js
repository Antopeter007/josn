dojo.provide("misys.binding.bank.report_sr_swift");

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
dojo.require("misys.widget.Amendments");

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
	
	"use strict"; // ECMA5 Strict Mode
	
	// Private functions and variables go here
	
	
	d.mixin(m._config, {

		/**
		 * <h4>Summary:</h4>  This method transforms the xml.
		 * <h4>Description</h4> : This method overrides the xmlTransform method to add license items in the xml.
		 * Add license items tags, only in case of LC transaction.
		 * Else pass the input xml, without modification. (Example : for create beneficiary from popup.) 
		 *
		 * @param {String} xml
		 * XML String to transform.
		 * @method xmlTransform
		 */
		xmlTransform : function (/*String*/ xml) {
			var lcXMLStart = "<sr_tnx_record>";
			/*
			 * Add license items tags, only in case of LC transaction.
			 * Else pass the input xml, without modification. (Ex : for create beneficiary from popup.)
			 */
			if(xml.indexOf(lcXMLStart) != -1){
				// Setup the root of the XML string
				var xmlRoot = m._config.xmlTagName,
				transformedXml = xmlRoot ? ["<", xmlRoot, ">"] : [],			
						lcXMLEnd   = "</sr_tnx_record>",
						subLcXML	= "",
						selectedIndex = -1;
				subLcXML = xml.substring(lcXMLStart.length,(xml.length-lcXMLEnd.length));
				var nodename = "amd_no"; 
				var tnxTypeCode = xml.substring(xml.indexOf("<tnx_type_code>")+("<tnx_type_code>").length,xml.indexOf("</tnx_type_code>"));
				var prodStatCode = xml.substring(xml.indexOf("<prod_stat_code>")+("<prod_stat_code>").length,xml.indexOf("</prod_stat_code>"));
				var amdNo = xml.substring(xml.indexOf("<"+nodename+">")+("<"+nodename+">").length,xml.indexOf("</"+nodename+">"));
				var arrayOfNarratives = ["narrative_description_goods","narrative_documents_required","narrative_additional_instructions","narrative_special_beneficiary","narrative_special_recvbank"];
				var lcType = dj.byId("lc_type") ? dj.byId("lc_type").get("value") : '';
				if(m._config.swift2018Enabled && (Number(amdNo) || prodStatCode === '08' || prodStatCode === '31')){ //swift enabled for Amendment form 
					var subXML;
					var dataStoreNarrative = [m._config.narrativeDescGoodsDataStore,m._config.narrativeDocsReqDataStore,m._config.narrativeAddInstrDataStore,m._config.narrativeSpBeneDataStore,m._config.narrativeSpRecvbankDataStore];
					var i = 0, verb, text, itr = 0;
					for(itr = 0; itr < 5; itr++){
						subXML = itr == 0 ? subLcXML.substring(0,subLcXML.indexOf("<"+arrayOfNarratives[itr]+">")) : (subXML.indexOf("<"+arrayOfNarratives[itr]+">") > 0 ? subXML.substring(0,subXML.indexOf("<"+arrayOfNarratives[itr]+">")) : subXML);
						if(subLcXML.indexOf("<"+arrayOfNarratives[itr]+">") < 0){continue;}
						i = 0;
						if(dataStoreNarrative[itr] && dataStoreNarrative[itr].length > 0){
							subXML = subXML.concat("<"+arrayOfNarratives[itr]+">");
							subXML = subXML.concat("<![CDATA[");
							subXML = subXML.concat("<amendments>");
							subXML = subXML.concat("<amendment>");
							subXML = subXML.concat("<sequence>");
							subXML = subXML.concat(Number(amdNo));
							subXML = subXML.concat("</sequence>");
							subXML = subXML.concat("<data>");
							d.forEach(dataStoreNarrative[itr], function(){
								if(dataStoreNarrative[itr][i] && dataStoreNarrative[itr][i] != null){
									verb = dataStoreNarrative[itr][i].verb[0];
									text = dojox.html.entities.encode(dataStoreNarrative[itr][i].content[0], dojox.html.entities.html);
									subXML = subXML.concat("<datum>");
									subXML = subXML.concat("<id>");
									subXML = subXML.concat(i);
									subXML = subXML.concat("</id>");
									subXML = subXML.concat("<verb>");
									subXML = subXML.concat(verb);
									subXML = subXML.concat("</verb>");
									subXML = subXML.concat("<text>");
									subXML = subXML.concat(text);
									subXML = subXML.concat("</text>");
									subXML = subXML.concat("</datum>");
								}
								i++;
							});
							subXML = subXML.concat("</data>");
							subXML = subXML.concat("</amendment>");
							subXML = subXML.concat("</amendments>");
							subXML = subXML.concat("]]>");
							subXML = subXML.concat(subLcXML.substring(subLcXML.indexOf("</"+arrayOfNarratives[itr]+">"),subLcXML.length));
						}
						else{
							subXML = subXML.concat("<"+arrayOfNarratives[itr]+">");
							subXML = subXML.concat(subLcXML.substring(subLcXML.indexOf("</"+arrayOfNarratives[itr]+">"),subLcXML.length));
						}
						
					}
					
					transformedXml.push(subXML);
				} else if(m._config.swift2018Enabled && tnxTypeCode == '01' && lcType !== '02') { //For swift enabled with issuance form
					for(itr = 0; itr < 5; itr++){
						subXML = itr == 0 ? subLcXML.substring(0,subLcXML.indexOf("<"+arrayOfNarratives[itr]+">")) : subXML.substring(0,subXML.indexOf("<"+arrayOfNarratives[itr]+">"));
						subXML = subXML.concat("<"+arrayOfNarratives[itr]+">");
						if(dj.byId(arrayOfNarratives[itr])){
							subXML = subXML.concat("<![CDATA[");
							subXML = subXML.concat("<issuance>");
							subXML = subXML.concat("<sequence>");
							subXML = subXML.concat("0");
							subXML = subXML.concat("</sequence>");
							subXML = subXML.concat("<data>");
							subXML = subXML.concat("<datum>");
							subXML = subXML.concat("<id>");
							subXML = subXML.concat("0");
							subXML = subXML.concat("</id>");
							subXML = subXML.concat("<verb>");
							subXML = subXML.concat("ISSUANCE");
							subXML = subXML.concat("</verb>");
							subXML = subXML.concat("<text>");
							subXML = subXML.concat(dojox.html.entities.encode(dj.byId(arrayOfNarratives[itr]).get("value"), dojox.html.entities.html));
							subXML = subXML.concat("</text>");
							subXML = subXML.concat("</datum>");
							subXML = subXML.concat("</data>");
							subXML = subXML.concat("</issuance>");
							subXML = subXML.concat("]]>");
						}
						subXML = subXML.concat(subLcXML.substring(subLcXML.indexOf("</"+arrayOfNarratives[itr]+">"),subLcXML.length));
					}
					transformedXml.push(subXML);
				}
				else{
					transformedXml.push(subLcXML);
				}
				
				if(xmlRoot) {
					transformedXml.push("</", xmlRoot, ">");
				}
				return transformedXml.join("");
			}else{
				return xml;
			}

		}
	});

	// Public functions & variables follow
	d.mixin(m, {

		_bindSwift2018 : function() {
			
			m.connect(dj.byId("prod_stat_code"), "onChange", function(){
				this.validate();
				m.refreshUIforAmendmentMO();
				
			});
			m.connect("amd_chrg_brn_by_code_1", "onClick" ,m.amendChargesLC);
			m.connect("amd_chrg_brn_by_code_2", "onClick" ,m.amendChargesLC);
			m.connect("amd_chrg_brn_by_code_3", "onClick" ,m.amendChargesLC);
			m.connect("amd_chrg_brn_by_code_4", "onClick" ,m.amendChargesLC);
	 	 	
			//SWIFT 2018
			m.setValidation("requested_confirmation_party_iso_code", m.validateBICFormat);
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
			if(misys._config.swiftExtendedNarrativeEnabled){
				m.setValidation("narrative_additional_instructions", _fetchNarrativeContent);
				m.setValidation("narrative_documents_required", _fetchNarrativeContent);
				m.setValidation("narrative_description_goods", _fetchNarrativeContent);
				m.setValidation("narrative_special_beneficiary", _fetchNarrativeContent);
				if(dj.byId("narrative_special_recvbank")){
					m.setValidation("narrative_special_recvbank", _fetchNarrativeContent);
				}
			}
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
			if(dj.byId("amd_chrg_brn_by_code_4")){
				if(!dj.byId("amd_chrg_brn_by_code_4").get("value")){
					var amdChargesArea = dj.byId("narrative_amend_charges_other");
					if(amdChargesArea){
						amdChargesArea.set("value", "");
						amdChargesArea.set("disabled", true);	
					}
				}
			}
			m.toggleNarrativeDivStatus(true,'');
		},

		_beforeSubmitValidationsSwift2018 : function() {
			
			//SWIFT 2018
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
       dojo.require('misys.client.binding.bank.report_sr_swift_client');