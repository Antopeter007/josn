dojo.provide("misys.binding.trade.message_transfer_el");

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
dojo.require("misys.widget.Collaboration");
dojo.require("misys.binding.trade.ls_common");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode
	// dojo.subscribe once a record is deleted from the grid
    var _deleteGridRecord = "deletegridrecord";
    
    m._config = m._config || {};
    m._config.expDate = m._config.expDate || {};
    m._config.lastShipDate = m._config.lastShipDate || {};
	
	d.mixin(m._config, {

		initReAuthParams : function() {
									
			var reAuthParams = {
				productCode : 'EL',	
				subProductCode : '',
				transactionTypeCode : "13",	
				entity :'',
				currency :'',				
				amount : '',
								
				es_field1 : '',
				es_field2 : ''				
			};
			return reAuthParams;
		},
		
		/*
		 * Overriding to add license items in the xml. 
		 */
		xmlTransform : function (/*String*/ xml) {
			var tdXMLStart = "<el_tnx_record>";
			/*
			 * Add license items tags, only in case of LC transaction.
			 * Else pass the input xml, without modification. (Ex : for create beneficiary from popup.)
			 */
			if(xml.indexOf(tdXMLStart) != -1){
				// Setup the root of the XML string
				var xmlRoot = m._config.xmlTagName,
				transformedXml = xmlRoot ? ["<", xmlRoot, ">"] : [],			
						tdXMLEnd   = "</el_tnx_record>",
						subTDXML	= "",
						selectedIndex = -1;
				subTDXML = xml.substring(tdXMLStart.length,(xml.length-tdXMLEnd.length));
				transformedXml.push(subTDXML);
				if(dj.byId("gridLicense") && dj.byId("gridLicense").store && dj.byId("gridLicense").store !== null && dj.byId("gridLicense").store._arrayOfAllItems.length >0) {
					transformedXml.push("<linked_licenses>");
					dj.byId("gridLicense").store.fetch({
						query: {REFERENCEID: '*'},
						onComplete: dojo.hitch(dj.byId("gridLicense"), function(items, request){
							dojo.forEach(items, function(item){
								transformedXml.push("<license>");
								transformedXml.push("<ls_ref_id>",item.REFERENCEID,"</ls_ref_id>");
								transformedXml.push("<bo_ref_id>",item.BO_REF_ID,"</bo_ref_id>");
								transformedXml.push("<ls_number>",item.LS_NUMBER,"</ls_number>");
								transformedXml.push("<ls_allocated_amt>",item.LS_ALLOCATED_AMT,"</ls_allocated_amt>");
								transformedXml.push("<ls_amt>",item.LS_AMT,"</ls_amt>");
								transformedXml.push("<ls_os_amt>",item.LS_OS_AMT,"</ls_os_amt>");
								transformedXml.push("<converted_os_amt>",item.CONVERTED_OS_AMT,"</converted_os_amt>");
								transformedXml.push("<allow_overdraw>",item.ALLOW_OVERDRAW,"</allow_overdraw>");
								transformedXml.push("</license>");
							});
						})
					});
					transformedXml.push("</linked_licenses>");
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
	
	// Private functions and variables go here
	
	function _fetchNarrativeContent(){
		var isValid = true;
		var descOfGoods, docsRequired, addInstructions, specBeneficiary, allNarratives = "";
		if(dj.byId("narrative_description_goods") && dj.byId("narrative_special_beneficiary")){
			
			if(dj.byId("narrative_description_goods")){
				descOfGoods = dj.byId("narrative_description_goods").get("value") !== "" ? dj.byId("narrative_description_goods").get("value") + "\n" : "";
			}
			if(dj.byId("narrative_special_beneficiary")){
				specBeneficiary = dj.byId("narrative_special_beneficiary").get("value") !== "" ? dj.byId("narrative_special_beneficiary").get("value") + "\n" : "";
			}			
			allNarratives = descOfGoods + specBeneficiary;
			var limit = 800 * this.cols;
			var entered = allNarratives.length;
			this.invalidMessage  = m.getLocalization("invalidFieldSizeError",[limit, entered]);
			return isValid = m.validateExtNarrativeSwiftInit2018(allNarratives);
		}
	}
	
	// Public functions & variables follow
	d.mixin(m, {

		bind : function() {
			
			m.setValidation("exp_date", m.validateMessageTransferTradeExpiryDate);
		
			m.setValidation("last_ship_date", m.validateMessageTransferLastShipmentDate);

			m.setValidation("free_format_text", m.validateFreeFormatMessage);
			
			if(m._config.swift2018Enabled && misys._config.swiftExtendedNarrativeEnabled){
				m.setValidation("narrative_description_goods", _fetchNarrativeContent);
				m.setValidation("narrative_special_beneficiary", _fetchNarrativeContent);
			}
						
			m.connect("last_ship_date", "onClick", function(){
				m.toggleDependentFields(this, dj.byId("narrative_shipment_period"),
						m.getLocalization("shipmentDateOrPeriodExclusivityError"));
			});
			
			m.connect("last_ship_date", "onChange", function(){
				m.toggleDependentFields(this, dj.byId("narrative_shipment_period"),
						m.getLocalization("shipmentDateOrPeriodExclusivityError"));
			});
			
			m.connect("narrative_shipment_period", "onClick", function(){
				m.toggleDependentFields(this, dj.byId("last_ship_date"),
						m.getLocalization("shipmentDateOrPeriodExclusivityError"));
			});
			
			m.connect("narrative_shipment_period", "onChange", function(){
				m.toggleDependentFields(this, dj.byId("last_ship_date"),
						m.getLocalization("shipmentDateOrPeriodExclusivityError"));
			});
			
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
			m.connect("advise_mode_code", "onChange", function(){
				m.toggleFields(this.get("value")=="02", [
						"advise_thru_bank_name", "advise_thru_bank_address_line_1",
						"advise_thru_bank_address_line_2", "advise_thru_bank_dom"],
						[
								"advise_thru_bank_name", "advise_thru_bank_address_line_1"]);

				if (this.get("value")=="02")
				{
					m.animate("wipeIn", d.byId('advise_thru_bank_name_img'));
				}
				else
				{
					m.animate("wipeOut", d.byId('advise_thru_bank_name_img'));
				}
			});
			m.connect("license_lookup","onClick", function(){
				m.getLicenses("el");
			});
			
			m.connect("exp_date", "onChange", function(){
				m.clearLicenseGrid(this, m._config.expDate,"el");
			});
			
			m.connect("last_ship_date", "onChange", function(){
				m.clearLicenseGrid(this, m._config.lastShipDate,"el");
			});
			
			m.connect("tnx_amt", "onBlur", function(){
				if(dj.byId("org_lc_amt") && dj.byId("tnx_amt") && dj.byId("full_trf_flag")){
					var orgLcAmt = dj.byId("org_lc_amt").get("value");
					var tnxAmt = dj.byId("tnx_amt").get("value");
					if(orgLcAmt===tnxAmt){
						dijit.byId("full_trf_flag").set("checked", true);
					}
					else {
						dijit.byId("full_trf_flag").set("checked", false);
					}
				}
			});
			
			m.connect("applicable_rules", "onChange", function(){
				m.toggleFields((this.get("value") == "99"), null, ["applicable_rules_text"]);
			});
			
			m.connect("tnx_amt", "onChange", function(){
                var tnxAmt = dj.byId("tnx_amt") ? dj.byId("tnx_amt").get("value") : "";
                var utilizedAmt = dj.byId("utilized_amt") ? dj.byId("utilized_amt").get("value") : "";
                var utilizedAmtCurCode = dj.byId("utilized_amt_cur_code") ? dj.byId("utilized_amt_cur_code").get("value") : "";
                
                var lcAmt = dj.byId("org_lc_amt").get("value");
                var availableAmt=0.00;
                if(tnxAmt !== ""){
                	availableAmt= (lcAmt-utilizedAmt);
                
                 if(tnxAmt > availableAmt) {
                  availableAmt=  availableAmt<0?dojo.currency.format(0):dojo.currency.format(availableAmt);
                  var displayMessage = m.getLocalization("transferAmtGreaterThanAvailableLCAmtWarning", [utilizedAmtCurCode,availableAmt]);

                  dj.byId("tnx_amt").set("state","Error"); 
                  dj.showTooltip(displayMessage, dj.byId("tnx_amt").domNode, 0); 
                  }
                }
        });
			m.connect("inco_term", "onChange", function(){
				m.toggleFields(this.get("value"), null, ["inco_place"], false, false);
			});
		
			m.connect("inco_term_year", "onChange",m.getIncoTerm);
	
			m.connect("inco_term", "onClick",function(){
				if(dj.byId("issuing_bank_abbv_name").get("value")=="" &&  (this.store._arrayOfAllItems==undefined || this.store._arrayOfAllItems.length==0))
					{
					m.dialog.show("ERROR", m.getLocalization("selectBankToProceed"), '', '');
					}
				else if (dj.byId("inco_term_year").get("value")=="" &&  (this.store._arrayOfAllItems==undefined || this.store._arrayOfAllItems.length==0))
					{
					m.dialog.show("ERROR", m.getLocalization("selectIncoYearToProceed"), '', '');
					}
			});
			m.connect("inco_term_year", "onChange", function(){
				m.toggleFields(this.get("value"), null, ["inco_term"], false, true);
			});
		},

		onFormLoad : function() {
			
			m._config.expDate = dj.byId("exp_date") ? dj.byId("exp_date").get("displayedValue") : "";
			m._config.lastShipDate = dj.byId("last_ship_date") ? dj.byId("last_ship_date").get("displayedValue") : "";
			
			var mainBankAbbvName = dj.byId("advising_bank_abbv_name").get('value');
			var isMT798Enable = m._config.customerBanksMT798Channel[mainBankAbbvName] === true && dj.byId("adv_send_mode").get("value") === "01";
			m.setCurrency(dj.byId("lc_cur_code"), ["org_lc_amt", "tnx_amt"]);
			
			if (dj.byId("advise_mode_code"))
			{
				m.toggleFields(dj.byId("advise_mode_code").get("value")=="02", [
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
				if (dj.byId("delivery_channel")){
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
				m.toggleFields(m._config.customerBanksMT798Channel[mainBankAbbvName] === true && m.hasAttachments(), null, ["delivery_channel"], false, false);
			}
			else
			{
				m.animate("fadeOut", d.byId("bankInst"));
			}
			
			 var handle = dojo.subscribe(_deleteGridRecord, function(){
				 m.toggleFields(m._config.customerBanksMT798Channel[mainBankAbbvName] === true && m.hasAttachments(), null, ["delivery_channel"], false, false);
			 });
			 m.populateGridOnLoad("lc");
			 
			if(dj.byId("full_trf_flag"))
			{
				var tnxAmt = dj.byId("tnx_amt");
				if(dj.byId("full_trf_flag").get("checked")) {
					m.setTnxAmt(dj.byId("org_lc_amt").get("value"));
					tnxAmt.set("readOnly", true);
				} else {
					//tnxAmt.reset();
					tnxAmt.set("readOnly", false);
				}
			}
			
			var applRule = dj.byId("applicable_rules");
			if(applRule) {
				m.toggleFields(
						applRule.get("value") == "99",
						null, ["applicable_rules_text"]);
			}
			if(dj.byId("inco_term_year"))
			{
				m.getIncoYear();
				dijit.byId("inco_term_year").set("value",dj.byId("org_term_year").get("value"));
			
			}
		if(dj.byId("inco_term"))
		{
			if(dj.byId("inco_term_year") && dj.byId("inco_term_year").get("value")!="")
			{
				m.getIncoTerm();
			}
			
			dijit.byId("inco_term").set("value",dj.byId("org_inco_term").get("value"));	
			}
			var incoTerm = dj.byId("inco_term") ? dj.byId("inco_term").get("value") : "";
			if(incoTerm) {
				m.toggleFields(incoTerm, null, ["inco_place"], false, true);
			}
			else{
				m.toggleFields(incoTerm, null, ["inco_place"], false, false);
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

			return m.validateLSAmtSumAgainstTnxAmt("tnx");
		}
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.trade.message_transfer_el_client');