dojo.provide("misys.binding.bank.report_ec");

dojo.require("dijit.layout.TabContainer");
dojo.require("dijit.form.DateTextBox");
dojo.require("misys.form.CurrencyTextBox");
dojo.require("dijit.form.FilteringSelect");
dojo.require("misys.form.file");
dojo.require("misys.form.addons");
dojo.require("misys.form.SimpleTextarea");
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
dojo.require("misys.widget.NoCloseDialog");
dojo.require("misys.binding.trade.ls_common");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode
	m._config = m._config || {};
    m._config.ecCurCode = m._config.ecCurCode || {};
    m._config.drawer = m._config.drawer || {	entity : "",
													name : "",
													addressLine1 : "",
													addressLine2 : "",
													dom : ""
												  };
	m._config.drawee = m._config.drawee || {	name : "",
														addressLine1 : "",
														addressLine2 : "",
														dom : ""
													  };
	
	// insert private functions & variables
	function validateContent(widget)
	{
		var errorMessage= null;
		var hideTT2;
		if(dj.byId(widget))
		{
			var widgetContent = dj.byId(widget).get("value");
			if((widgetContent.indexOf("<") != -1) || (widgetContent.indexOf(">") != -1)) 
			{
				errorMessage =  m.getLocalization("invalidContent");
				dj.byId(widget).set("state","Error");
				dj.hideTooltip(dj.byId(widget).domNode);
				dj.showTooltip(errorMessage, dj.byId(widget).domNode, 0);
				var hideTT1 = function() {
					dj.hideTooltip(dj.byId(widget).domNode);
				};
				setTimeout(hideTT1, 1500);
				return false;
			}
			
			if(dj.byId(widget).get("required") && dj.byId(widget).id !== "documents_details_second_mail_send")
			{
				if(widgetContent <= 0 && widget !== 'documents_details_second_mail_send') 
				{
					if((d.number.parse(dj.byId(widget).get("value")) > 0 || 
							d.number.parse(dj.byId("documents_details_second_mail_send").get("value")) > 0) &&
							dj.byId("documents_details_code_nosend").get("value") !== "01")
						{
							dj.byId(widget).set("state","");
							dj.hideTooltip(dj.byId(widget).domNode);
							dj.byId("documents_details_second_mail_send").set("state","");
							dj.hideTooltip(dj.byId("documents_details_second_mail_send").domNode);
							return true;
						}
					else
					{
						if(d.number.parse(dj.byId(widget).get("value")) <= 0)
							{
								errorMessage =  m.getLocalization("valueShouldBeGreaterThanZero");
								dj.byId(widget).set("state","Error");
								dj.hideTooltip(dj.byId(widget).domNode);
								dj.showTooltip(errorMessage, dj.byId(widget).domNode, 0);
								hideTT2 = function() {
									dj.hideTooltip(dj.byId(widget).domNode);
								};
								setTimeout(hideTT2, 1500);
								return false;
							}
					}
				}
			}
			if(dj.byId(widget).get("required") && dj.byId(widget).id !== "documents_details_first_mail_send")
			{
				if((d.number.parse(dj.byId(widget).get("value")) > 0 || 
						d.number.parse(dj.byId("documents_details_first_mail_send").get("value")) > 0) && 
						dj.byId("documents_details_code_nosend").get("value") !== "01")
					{
						dj.byId(widget).set("state","");
						dj.hideTooltip(dj.byId(widget).domNode);
						dj.byId("documents_details_first_mail_send").set("state","");
						dj.hideTooltip(dj.byId("documents_details_first_mail_send").domNode);
						return true;
					}
				else
				{	
					if(dj.byId("documents_details_code_nosend").get("value") !== "01" && widget !== "documents_details_name_nosend")
						{
							errorMessage =  m.getLocalization("valueShouldBeGreaterThanZero");
							dj.byId(widget).set("state","Error");
							dj.hideTooltip(dj.byId(widget).domNode);
							dj.showTooltip(errorMessage, dj.byId(widget).domNode, 0);
							hideTT2 = function() {
								dj.hideTooltip(dj.byId(widget).domNode);
							};
							setTimeout(hideTT2, 1500);
							return false;
						}
					else
						{
							if(d.number.parse(dj.byId("documents_details_first_mail_send").get("value")) <= 0)
							{
								errorMessage =  m.getLocalization("valueShouldBeGreaterThanZero");
								dj.byId("documents_details_first_mail_send").set("state","Error");
								dj.hideTooltip(dj.byId("documents_details_first_mail_send").domNode);
								dj.showTooltip(errorMessage, dj.byId("documents_details_first_mail_send").domNode, 0);
								hideTT2 = function() {
									dj.hideTooltip(dj.byId("documents_details_first_mail_send").domNode);
								};
								setTimeout(hideTT2, 1500);
								return false;
							}
						}
				}
			}
		}
	}
	
	function validateTotalDoc(widget)
	{
		if(validateDocumentDetails(widget))
		{
			var field = dj.byId("documents_details_total_send");
			var num_of_originals = d.number.parse(dj.byId("documents_details_first_mail_send").get("value"));
			var num_of_copies = d.number.parse(dj.byId("documents_details_second_mail_send").get("value"));
			
			num_of_originals = !isNaN(num_of_originals) ? num_of_originals : 0;
			num_of_copies = !isNaN(num_of_copies) ? num_of_copies : 0;
			
			field.set("value", num_of_originals + num_of_copies);
			field.set("readOnly", true);
			return true;
		}
	}
	function validateDocumentDetails(widget)
	{
		if(dj.byId(widget))
		{
			var widgetContent = dj.byId(widget).get("value");
			var regex = new RegExp("^[0-9]+$");
			if(widgetContent!="" && !regex.test(widgetContent)){
				
				var errorMessage =  m.getLocalization("invalidContent");
				dj.byId(widget).set("state","Error");
				dj.hideTooltip(dj.byId(widget).domNode);
				dj.showTooltip(errorMessage, dj.byId(widget).domNode, 0);
				var hideTT = function() {
					dj.hideTooltip(dj.byId(widget).domNode);
				};
				setTimeout(hideTT, 1500);
				return false;
			}
		return true;
	}
	}

	// Public functions & variables follow
	d.mixin(m._config, {
		/*
		 * Overriding to add license items in the xml. 
		 */
		xmlTransform : function (/*String*/ xml) {
			var tdXMLStart = "<ec_tnx_record>";
			/*
			 * Add license items tags, only in case of LC transaction.
			 * Else pass the input xml, without modification. (Ex : for create beneficiary from popup.)
			 */
			if(xml.indexOf(tdXMLStart) != -1){
				// Setup the root of the XML string
				var xmlRoot = m._config.xmlTagName,
				transformedXml = xmlRoot ? ["<", xmlRoot, ">"] : [],			
						tdXMLEnd   = "</ec_tnx_record>",
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
	
	d.mixin(m, {
		bind : function() {
			//  summary:
		    //            Binds validations and events to fields in the form.              
			
			m.setValidation("ec_cur_code", m.validateCurrency);
			m.setValidation('drawee_country', m.validateCountry);
			if(dj.byId("tenor_base_date")){
				m.setValidation("tenor_base_date", m.validateBaseDateWithCurrentSystemDate);
			}
			if(dj.byId("tenor_maturity_date")){
				m.setValidation("tenor_maturity_date", m.validateMaturityDateWithSystemDate);
			}
			// CF See comment in report_lc.js for this validation
			m.connect("prod_stat_code", "onChange", m.validateOutstandingAmount);
			m.connect("ec_cur_code", "onChange", function(){
				m.setCurrency(this, ["ec_amt", "ec_liab_amt"]);
			});
			
			//Validate Hyphen, allowed no of lines validation on the back-office comment
			m.setValidation("bo_comment", m.bofunction);
			m.connect("courier_partner","onChange", m.validatecourierPartnerField);
			
			m.connect("ec_amt", "onBlur", function(){
				m.setTnxAmt(this.get("value"));
			});
			
			m.connect("ec_liab_amt", "onBlur", function(){
				if(dj.byId("ec_amt") && (dj.byId("ec_amt").get("value") < dj.byId("ec_liab_amt").get("value")))
				{
					var callback = function() {
						var widget = dijit.byId("ec_liab_amt");
					 	widget.set("state","Error");
					};
					m.dialog.show("ERROR", m.getLocalization("ECLiabilityAmountCanNotBeGreaterThanECTotalAmount"), '', function(){
							setTimeout(callback, 0);
						});
				}
			});
			m.connect("ec_outstanding_amt", "onBlur", function(){
				if(dj.byId("ec_amt") && (dj.byId("ec_amt").get("value") < dj.byId("ec_outstanding_amt").get("value")))
				{
					var callback = function() {
						var widget = dijit.byId("ec_outstanding_amt");
					 	widget.set("state","Error");
					};
					m.dialog.show("ERROR", m.getLocalization("ECLiabilityAmountCanNotBeGreaterThanECTotalAmount"), '', function(){
							setTimeout(callback, 0);
						});
				}
			});
			m.connect("inco_term_year", "onChange", m.getIncoTerm);
			m.connect("inco_term_year", "onChange", function(){
				m.toggleFields(this.get("value"), null, ["inco_term"], false, true);
			});
			m.connect("term_code", "onChange", function(){
								//m.toggleFields((this.get("value") !== "01"), null, [
				     // "accpt_adv_send_mode"]);
				if(this.get("value") === "01")
				{
					if(dj.byId("protest_non_accpt").get("checked",true))
					{
					dj.byId("protest_non_accpt").set("checked",false);
					}
					if(dj.byId("accpt_defd_flag").get("checked",true))
					{
					dj.byId("accpt_defd_flag").set("checked",false);
					}
					dj.byId("accpt_adv_send_mode").set("value","");
					dj.byId("accpt_adv_send_mode").set("disabled",true);
				}
				else
				{
					dj.byId("accpt_adv_send_mode").set("disabled",false);
				}
				
				if(this.get("value")==="01")
				{
					m.toggleFields(true,null,["tenor_type_1"], false);					
					dj.byId("tenor_type_1").set("checked", true);	
					dj.byId("tenor_type_2").set("disabled", true);
					dj.byId("tenor_type_2").set("checked", false);
					if (dj.byId("tenor_type_3")) {	
						dj.byId("tenor_type_3").set("disabled", true);
						dj.byId("tenor_type_3").set("checked", false);
					}
					if(dj.byId("tenor_desc")) {
						dj.byId("tenor_desc").set("disabled", true);
						m.toggleRequired("tenor_desc", false);
						if(dj.byId("tenor_desc").get("value") == undefined || dj.byId("tenor_desc").get("value") == null){
							dj.byId("tenor_desc").set("value", "");
						}
					}
					
					m.toggleAllTenorFields();
				}
				else if(this.get("value")==="02")
				{
					dj.byId("tenor_type_2").set("disabled", false);
					dj.byId("tenor_type_2").set("checked", true);
					dj.byId("tenor_type_1").set("checked", false);
					if (dj.byId("tenor_type_3")) {	
						dj.byId("tenor_type_3").set("disabled", true);
						dj.byId("tenor_type_3").set("checked", false);
					}
					dj.byId("tenor_type_1").set("disabled", true);
					if(dj.byId("tenor_desc") && !(dj.byId("tenor_type_3"))) {
						dj.byId("tenor_desc").set("disabled", false);
						m.toggleRequired("tenor_desc", true);
						if(dj.byId("tenor_desc").get("value") == undefined || dj.byId("tenor_desc").get("value") == null){
							dj.byId("tenor_desc").set("value", "");
						}
					} else if(dj.byId("tenor_desc") && dj.byId("tenor_type_3")) {
						dj.byId("tenor_desc").set("disabled", true);
						m.toggleRequired("tenor_desc", false);
						if(dj.byId("tenor_desc").get("value") == undefined || dj.byId("tenor_desc").get("value") == null){
							dj.byId("tenor_desc").set("value", "");
						}
					}
					m.toggleAllTenorFields();
				}
				else if(this.get("value")==="04")
				{
				dj.byId("tenor_type_2").set("disabled", true);
				dj.byId("tenor_type_2").set("checked", false);
				if (dj.byId("tenor_type_3")) {	
					dj.byId("tenor_type_3").set("disabled", false);
					dj.byId("tenor_type_3").set("checked", true);
				}
				dj.byId("tenor_type_1").set("disabled", true);
				dj.byId("tenor_type_1").set("checked", false);
				if(dj.byId("tenor_desc")) {
					dj.byId("tenor_desc").set("disabled", true);
					m.toggleRequired("tenor_desc", false);
					if(dj.byId("tenor_desc").get("value") == undefined || dj.byId("tenor_desc").get("value") == null){
							dj.byId("tenor_desc").set("value", "");
					}
				}
				m.toggleAllTenorFields();	
				}
				else if(this.get("value")==="03"){
					dj.byId("tenor_type_1").set("disabled", false);
					dj.byId("tenor_type_2").set("disabled", false);
					if (dj.byId("tenor_type_3")) {	
						dj.byId("tenor_type_3").set("disabled", false);
					}
					dj.byId("tenor_type_1").set("checked", true);
					dj.byId("tenor_type_2").set("checked", false);
					if(dj.byId("tenor_desc")) {
						dj.byId("tenor_desc").set("disabled", false);
						m.toggleRequired("tenor_desc", true);
					}
					m.toggleAllTenorFields();
				}
			});
			
			m.connect("tenor_maturity_date", "onBlur", function(){
				var termCodeValue = dj.byId("term_code") ? dj.byId("term_code").get("value") : "";
				if((termCodeValue === "02" || termCodeValue === "03" || termCodeValue === "04") && dj.byId("tenor_maturity_date"))
				{
				if(dj.byId("tenor_maturity_date").get("value"))
				{
				dj.byId("tenor_days").set("value", "");
				if(dj.byId("tenor_desc")) {
					if(dj.byId("tenor_desc").get("value") == undefined || dj.byId("tenor_desc").get("value") == null){
						dj.byId("tenor_desc").set("value", "");
					}
				}
				dj.byId("tenor_period").set("value", "");
				dj.byId("tenor_from_after").set("value", "");
				dj.byId("tenor_days_type").set("value", "");
				dj.byId("tenor_base_date").set("displayedValue", "");
				dj.byId("tenor_days").set("disabled", true);
				dj.byId("tenor_period").set("disabled", true);
				dj.byId("tenor_from_after").set("disabled", true);
				dj.byId("tenor_days_type").set("disabled", true);
				m.toggleRequired("tenor_days_type", false);
				dj.byId("tenor_type_details").set("disabled", true);
				dj.byId("tenor_base_date").set("disabled", true);
				m.toggleRequired("tenor_base_date", false);
				m.toggleRequired(dojo.query("label[for=tenor_period_label]")[0].innerHTML = m.getLocalization("tenorPeriod"), false);	
				}
				else if(!dj.byId("tenor_maturity_date").get("value"))
				{
				dj.byId("tenor_days").set("disabled", false);
				dj.byId("tenor_period").set("disabled", false);
				dj.byId("tenor_from_after").set("disabled", false);
				dj.byId("tenor_days_type").set("disabled", false);
				m.toggleRequired("tenor_days_type", true);
				dj.byId("tenor_type_details").set("disabled", false);
				dj.byId("tenor_base_date").set("disabled", false);
				m.toggleAllTenorFields();
				}
				}
				});
			m.connect("tenor_days", "onBlur", function(){
				var termCodeValue = dj.byId("term_code") ? dj.byId("term_code").get("value") : "";
				if((termCodeValue === "02" || termCodeValue === "03" || termCodeValue === "04") && dj.byId("tenor_days"))
				{
				if(dj.byId("tenor_days").get("value"))
				{
				dj.byId("tenor_maturity_date").set("displayedValue", "");
				dj.byId("tenor_maturity_date").set("disabled", true);
				m.toggleRequired(dojo.query("label[for=tenor_maturity_date]")[0].innerHTML = m.getLocalization("tenorMaturitydate"), false);
				}
				else if(!dj.byId("tenor_days").get("value"))
				{
				dj.byId("tenor_maturity_date").set("disabled", false);
				m.toggleAllTenorFields();
				}
				}
				});
			
			/*m.connect("tenor_days", "onBlur", m.calcMaturityDate);
			m.connect("tenor_period", "onBlur", m.calcMaturityDate);
			m.connect("tenor_from_after", "onBlur", m.calcMaturityDate);
			m.connect("tenor_base_date", "onBlur", m.calcMaturityDate);*/
			m.connect("tenor_days_type", "onChange",function(){
				m.toggleFields((this.get("value") === "O"), null, ["tenor_type_details"]);	
				if(this.get("value") === "O" || this.get("value") === "G" || this.get("value") === "S"){
					m.toggleRequired("tenor_base_date", false);
				}else{
					m.toggleRequired("tenor_base_date", true);
				}
			});
			m.connect("tenor_type_1", "onClick",  m.toggleAllTenorFields);
			m.connect("tenor_type_2", "onClick", m.toggleAllTenorFields);
			if (dj.byId("tenor_type_3")) {	
				m.connect("tenor_type_3", "onClick", m.toggleAllTenorFields);
				m.connect("tenor_type_3", "onClick", m.clearDataOnclicTenortype2or3);
			}
			m.connect("tenor_type_2", "onClick", m.clearDataOnclicTenortype2or3);
			m.connect("protest_non_accpt", "onClick", m.disableNonAcceptanceFields);
			m.connect("accpt_defd_flag", "onClick", m.disableNonAcceptanceFields);
			m.connect("prod_stat_code", "onChange", m.toggleProdStatCodeFields);
			m.connect("prod_stat_code", "onChange", function(){
				var value = this.get("value");
				m.toggleFields(value && value !== "01" && value !== "18", null,
								["iss_date", "bo_ref_id"]);
				if(dj.byId("mode") && dj.byId("mode").get("value") === 'RELEASE')
				{					
					m.toggleRequired("bo_ref_id",false);
					m.toggleRequired("iss_date",false);
					m.toggleRequired("ec_outstanding_amt",false);	
					m.toggleRequired("ec_liab_amt",false);
				}
				if(value && value === "01")
	            {
	                 m.toggleRequired("presenting_bank_name", false);
	                 m.toggleRequired("presenting_bank_address_line_1", false);
	            }
				else
					{
					m.toggleRequired("presenting_bank_name", true);
	                 m.toggleRequired("presenting_bank_address_line_1", true);
					}
				if(value === "05" || value === "13" || value === "15"|| value === "14" || value === "04")
				{
					m.toggleRequired("maturity_date", true);
				}
				else {
					m.toggleRequired("maturity_date", false);
				}
				
			});
			m.connect("prod_stat_code", "onChange", function(){
				m.updateOutstandingAmount(dj.byId("ec_liab_amt"),
						dj.byId("org_ec_liab_amt"));
			});
			
			m.connect("tnx_amt", "onChange", function(){
				m.updateOutstandingAmount(dj.byId("ec_liab_amt"), dj.byId("org_ec_liab_amt"));
			});
			// Making outstanding amount as non editable in case of Not Processed,Cancelled,Purged
			m.connect("prod_stat_code","onChange",function(){
				var prodStatCodeValue = dj.byId("prod_stat_code").get('value'),liabAmt = dj.byId("ec_liab_amt"),osAmt=dj.byId("ec_outstanding_amt");
				if(liabAmt && (prodStatCodeValue === '01' || prodStatCodeValue === '10' || prodStatCodeValue === '06'))
					{
						liabAmt.set("readOnly", true);
						liabAmt.set("disabled", true);
						osAmt.set("readOnly", true);
						osAmt.set("disabled", true);
						m.toggleRequired("ec_outstanding_amt",false);
						m.toggleRequired("ec_liab_amt",false);
						dj.byId("ec_outstanding_amt").set("value", "");
						dj.byId("ec_liab_amt").set("value", "");
					}
				else if(liabAmt)
					{
						liabAmt.set("readOnly", false);
						liabAmt.set("disabled", false);
						osAmt.set("readOnly", false);
						osAmt.set("disabled", false);
						if(!(dj.byId("mode") && dj.byId("mode").get("value") === 'RELEASE'))
						{
						m.toggleRequired("ec_outstanding_amt",true);
						m.toggleRequired("ec_liab_amt",true);
						}
						dj.byId("ec_outstanding_amt").set("value",  dj.byId("org_ec_outstanding_amt").get('value'));
						dj.byId("ec_liab_amt").set("value", dj.byId("org_ec_liab_amt").get('value'));
					}
				if(dj.byId("tnx_type_code") && dj.byId("tnx_type_code").get('value')=='01')
				{
					if(prodStatCodeValue === '01')
					{
						liabAmt.set("value", 0);
					}
					else
					{
						liabAmt.set("value", dj.byId("ec_amt").get('value'));
					}
				}
				if (m._config.enable_to_edit_customer_details_bank_side == "false" && dj.byId("prod_stat_code") && dj.byId("prod_stat_code").get('value') !== '' && dj.byId("ec_liab_amt") && dj.byId("tnx_type_code")	&& dj.byId("tnx_type_code").get("value") !== '15' && dj.byId("tnx_type_code").get("value") !== '13')
				{
					m.toggleRequired("ec_liab_amt", false);
					m.toggleRequired("presenting_bank_name", false);
					m.toggleRequired("presenting_bank_address_line_1", false);
					m.toggleRequired("ec_outstanding_amt", false);
				}
			});
			m.connect("license_lookup","onClick", function(){
			m.getLicenses("ec");
				
			});
			m.connect("ec_cur_code", "onChange", function(){
				m.clearLicenseGrid(this, m._config.ecCurCode,"ec");
			});
			m.connect("entity", "onChange", function(){
				m.clearLicenseGrid(this, m._config.drawer,"ec");
			});
			
			m.connect("drawee_name", "onChange", function(){
				m.clearLicenseGrid(this, m._config.drawee,"ec");
			});
			
			m.connect("documents_details_second_mail_send","onBlur",
					function(){
				validateContent("documents_details_second_mail_send");
					});
			
			m.connect("documents_details_first_mail_send","onBlur",
					function(){
				validateContent("documents_details_first_mail_send");
					});
			
			m.connect("documents_details_total_send","onBlur",
					function(){
				validateContent("documents_details_total_send");
					});
			
			m.connect("documents_details_name_nosend","onBlur",
					function(){
				validateContent("documents_details_name_nosend");
					});
			
			m.connect("documents_details_doc_no_send","onBlur",
					function(){
				validateContent("documents_details_doc_no_send");
					});
			m.connect("maturity_date", "onBlur", function(){
				m.validateEnteredGreaterThanCurrentDate();
			});
			
			m.connect("documents_details_first_mail_send","onBlur",
					function(){
				validateTotalDoc("documents_details_first_mail_send");
					});
			m.connect("documents_details_second_mail_send","onBlur",
					function(){
				validateTotalDoc("documents_details_second_mail_send");
					});
			m.connect("documents_details_code_nosend", "onChange", function(){
				if(dj.byId("documents_details_code_nosend").get("value") === "01" && 
						d.number.parse(dj.byId("documents_details_first_mail_send").get("value")) <= 0)
				{
					var errorMessage= null;
					errorMessage =  m.getLocalization("valueShouldBeGreaterThanZero");
					dj.byId("documents_details_first_mail_send").set("state","Error");
					dj.hideTooltip(dj.byId("documents_details_first_mail_send").domNode);
					dj.showTooltip(errorMessage, dj.byId("documents_details_first_mail_send").domNode, 0);
					var hideTT2 = function() {
						dj.hideTooltip(dj.byId("documents_details_first_mail_send").domNode);
					};
					setTimeout(hideTT2, 1500);
					return false;
				}
				else
				{
					dj.byId("documents_details_first_mail_send").set("state","");
					dj.hideTooltip(dj.byId("documents_details_first_mail_send").domNode);
					return true;
				}
			});
			m.connect("prod_stat_code", "onChange", function(){
				var prodStatCode = dj.byId("prod_stat_code");
				var prodStatCodeValue = prodStatCode ? prodStatCode.get("value") : "";
				var tnxTypeCode = dj.byId("tnx_type_code");
				var tnxTypeCodeValue = tnxTypeCode ? tnxTypeCode.get("value") : "";
				var impBillRefIdField = dj.byId("imp_bill_ref_id");
				if(tnxTypeCode && prodStatCode && impBillRefIdField)
				{
					if(tnxTypeCodeValue === "15")
					{
						impBillRefIdField.set("readOnly", !(prodStatCodeValue === "07"));
						impBillRefIdField.set("disabled", !(prodStatCodeValue === "07"));
					}
					else 
					{
						if(prodStatCodeValue === "03")
						{
							impBillRefIdField.set("readOnly", false);
							impBillRefIdField.set("disabled", false);
						}
						else
						{
							impBillRefIdField.set("readOnly", true);
							impBillRefIdField.set("disabled", true);
							impBillRefIdField.set("value", "");
						}
					}
				}
			});
		},

		onFormLoad : function() {
			
			m._config.ecCurCode = dj.byId("ec_cur_code").get("value");
			m._config.isBank = true;
			m._config.drawee.name = dj.byId("drawee_name").get("value");
			m._config.drawee.addressLine1 = dj.byId("drawee_address_line_1").get("value");
			m._config.drawee.addressLine2 = dj.byId("drawee_address_line_2").get("value");
			m._config.drawee.dom = dj.byId("drawee_dom").get("value");
			m._config.drawer.entity = dj.byId("entity") ? dj.byId("entity").get("value") : "";
			m._config.drawer.name = dj.byId("drawer_name").get("value");
			m._config.drawer.addressLine1 = dj.byId("drawer_address_line_1").get("value");
			m._config.drawer.addressLine2 = dj.byId("drawer_address_line_2").get("value");
			m._config.drawer.dom = dj.byId("drawer_dom").get("value");
			
			m.setCurrency(dj.byId("ec_cur_code"), ["tnx_amt", "ec_amt", "ec_liab_amt", "ec_outstanding_amt"]);
			
			
			var presentingBankAbbvName = dj.byId("presenting_bank_name");
			if(presentingBankAbbvName)
			{
				presentingBankAbbvName.onChange();
			}
			
			var collectingBankName = dj.byId("collecting_bank_name");
			if(collectingBankName)
			{
				collectingBankName.onChange();
			}
			
			if(dj.byId("tnx_type_code") && dj.byId("tnx_type_code").get("value") === "01")
			{
				var pro_stat = dj.byId("prod_stat_code").get("value");
				m.toggleFields(pro_stat && pro_stat !== "01" && pro_stat !== "18", null,
								["iss_date", "bo_ref_id"]);
				if(dj.byId("mode") && dj.byId("mode").get("value") === 'RELEASE')
				{					
					m.toggleRequired("bo_ref_id",false);
					m.toggleRequired("ec_outstanding_amt",false);	
					m.toggleRequired("ec_liab_amt",false);
				}
			}
			var termCode = dj.byId("term_code");
			if(termCode) {
				//m.toggleFields(termCode.get('value') !== "01", null, ["accpt_adv_send_mode"]);
				if(termCode.get("value") === "01")
				{
					if(dj.byId("tenor_desc")){
						dj.byId("tenor_desc").set("disabled", true);
						if(dj.byId("tenor_desc").get("value") == undefined || dj.byId("tenor_desc").get("value") == null){
							dj.byId("tenor_desc").set("value", "");
						}
					}
					dj.byId("accpt_adv_send_mode").set("value", "");
					dj.byId("accpt_adv_send_mode").set("disabled", true);
					
					m.toggleFields(true,null,["tenor_type_1"]);
					dj.byId("tenor_type_1").set("checked", true);
					dj.byId("tenor_type_2").set("disabled", true);
					if(dj.byId("tenor_type_3")) {
						dj.byId("tenor_type_3").set("disabled", true);
					}
					dj.byId("tenor_days").set("disabled", true);
					if(dj.byId("tenor_desc")) {
						dj.byId("tenor_desc").set("disabled", true);
						if(dj.byId("tenor_desc").get("value") == undefined || dj.byId("tenor_desc").get("value") == null){
							dj.byId("tenor_desc").set("value", "");
						}
					}
					dj.byId("tenor_period").set("disabled", true);
					dj.byId("tenor_from_after").set("disabled", true);
					dj.byId("tenor_days_type").set("disabled", true);
					dj.byId("tenor_type_details").set("disabled", true);
					dj.byId("tenor_base_date").set("disabled", true);
					dj.byId("tenor_days").set("value", "");
					dj.byId("tenor_period").set("value", "");
					dj.byId("tenor_from_after").set("value", "");
					dj.byId("tenor_days_type").set("value", "");
					dj.byId("tenor_base_date").set("displayedValue", "");
					dj.byId("tenor_maturity_date").set("displayedValue", "");
					dj.byId("tenor_maturity_date").set("disabled", true);
				}
				else if(termCode.get("value")==="02"){
					if (dj.byId("tenor_type_3")) {
						dj.byId("tenor_type_3").set("disabled", true);
						dj.byId("tenor_type_3").set("checked", false);
					}
					dj.byId("tenor_type_2").set("disabled", false);
					dj.byId("tenor_type_1").set("disabled", true);
					dj.byId("tenor_type_1").set("checked", false);
					dj.byId("tenor_type_2").set("checked", true);
					if(dj.byId("tenor_desc") && !(dj.byId("tenor_type_3"))) {
						dj.byId("tenor_desc").set("disabled", false);
					} else if(dj.byId("tenor_desc") && dj.byId("tenor_type_3")) {
						dj.byId("tenor_desc").set("disabled", true);
					}
					dj.byId("tenor_maturity_date").set("disabled", false);
					m.toggleRequired("tenor_maturity_date", false);
					if(dj.byId("tenor_maturity_date").get("value"))
					{
					dj.byId("tenor_days").set("disabled", false);
					dj.byId("tenor_period").set("disabled", false);
					dj.byId("tenor_from_after").set("disabled", false);
					dj.byId("tenor_days_type").set("disabled", false);
					m.toggleAllTenorFields();
					dj.byId("tenor_type_details").set("disabled", true);
					dj.byId("tenor_base_date").set("disabled", false);
					m.toggleRequired("tenor_base_date", false);	
					}
					else if (dj.byId("tenor_days") && dj.byId("tenor_days").get("value"))
					{
					dj.byId("tenor_maturity_date").set("displayedValue", "");
					m.toggleRequired("tenor_maturity_date", false);
				    dj.byId("tenor_maturity_date").set("disabled", true);
					}
					else
					{
					dj.byId("tenor_days").set("disabled", false);
					dj.byId("tenor_period").set("disabled", false);
					dj.byId("tenor_from_after").set("disabled", false);
					dj.byId("tenor_days_type").set("disabled", false);
					m.toggleRequired("tenor_days_type", true);
					dj.byId("tenor_type_details").set("disabled", false);
					dj.byId("tenor_base_date").set("disabled", false);
					m.toggleAllTenorFields();
					}
				}
				else if(termCode.get("value")==="04"){
					if (dj.byId("tenor_type_3")) {
						dj.byId("tenor_type_3").set("disabled", false);
						dj.byId("tenor_type_3").set("checked", true);
					}
					dj.byId("tenor_type_2").set("disabled", true);
					dj.byId("tenor_type_1").set("disabled", true);
					dj.byId("tenor_type_1").set("checked", false);
					dj.byId("tenor_type_2").set("checked", false);
					if (dj.byId("tenor_desc")) {
						dj.byId("tenor_desc").set("disabled", true);
					}
					m.toggleAllTenorFields();
					if(dj.byId("tenor_maturity_date").get("value"))
					{
					dj.byId("tenor_days").set("disabled", true);
					dj.byId("tenor_period").set("disabled", true);
					dj.byId("tenor_from_after").set("disabled", true);
					dj.byId("tenor_days_type").set("disabled", true);
					m.toggleRequired("tenor_days_type", false);
					dj.byId("tenor_type_details").set("disabled", true);
					dj.byId("tenor_base_date").set("disabled", true);
					m.toggleRequired("tenor_base_date", false);
					m.toggleRequired(dojo.query("label[for=tenor_period_label]")[0].innerHTML = m.getLocalization("tenorPeriod"), false);	
					}
					else if (dj.byId("tenor_days") && dj.byId("tenor_days").get("value"))
					{
					dj.byId("tenor_maturity_date").set("displayedValue", "");
					m.toggleRequired("tenor_maturity_date", false);
				    dj.byId("tenor_maturity_date").set("disabled", true);
					}
					else
					{
					dj.byId("tenor_days").set("disabled", false);
					dj.byId("tenor_period").set("disabled", false);
					dj.byId("tenor_from_after").set("disabled", false);
					dj.byId("tenor_days_type").set("disabled", false);
					m.toggleRequired("tenor_days_type", true);
					dj.byId("tenor_type_details").set("disabled", false);
					dj.byId("tenor_base_date").set("disabled", false);
					m.toggleAllTenorFields();
					}
				}
				else{
					dj.byId("tenor_type_1").set("disabled", false);
					dj.byId("tenor_type_2").set("disabled", false);
					if (dj.byId("tenor_type_3")) {
						dj.byId("tenor_type_3").set("disabled", false);
					}
					if (dj.byId("tenor_desc")) {
						dj.byId("tenor_desc").set("disabled", false);
						m.toggleRequired("tenor_desc", true);
					}
					if(dj.byId("tenor_type_2").get("checked")||(dj.byId("tenor_type_3")  && dj.byId("tenor_type_3").get("checked")))
					{
						dj.byId("tenor_type_details").set("disabled", false);
						m.toggleAllTenorFields();	
					}
					else
					{
						dj.byId("tenor_days").set("disabled", true);
						dj.byId("tenor_period").set("disabled", true);
						dj.byId("tenor_from_after").set("disabled", true);
						dj.byId("tenor_days_type").set("disabled", true);
						dj.byId("tenor_type_details").set("disabled", true);
						dj.byId("tenor_base_date").set("disabled", true);
						dj.byId("tenor_maturity_date").set("disabled", true);
						m.toggleRequired("tenor_maturity_date", false);
						m.toggleRequired("tenor_days", false);
						m.toggleRequired("tenor_period", false);
						m.toggleRequired("tenor_from_after", false);
					}
				}
				var termDaysType = dj.byId("tenor_days_type") ?
						dj.byId("tenor_days_type").get("value") : "";
				if (termDaysType === "O") {
					dj.byId("tenor_type_details").set("disabled", false);
					m.toggleRequired("tenor_type_details", true);
					m.toggleRequired("tenor_base_date", false);
				}else if (termDaysType === "G" || termDaysType === "S") {
					dj.byId("tenor_type_details").set("disabled", true);
					m.toggleRequired("tenor_base_date", false);
				}
				else{
					dj.byId("tenor_type_details").set("disabled", true);
					m.toggleRequired("tenor_base_date", true);

				}
			}
			else {
				dj.byId("tenor_type_1").set("disabled", true);
				dj.byId("tenor_type_2").set("disabled", true);
				if (dj.byId("tenor_type_3")) {
					dj.byId("tenor_type_3").set("disabled", true);
				}
				dj.byId("tenor_maturity_date").set("disabled", true);
				dj.byId("tenor_days").set("disabled", true);
				dj.byId("tenor_period").set("disabled", true);
				dj.byId("tenor_from_after").set("disabled", true);
				dj.byId("tenor_days_type").set("disabled", true);
				dj.byId("tenor_type_details").set("disabled", true);
				dj.byId("tenor_base_date").set("disabled", true);
				dj.byId("tenor_maturity_date").set("disabled", true);
			}
				
			if(dj.byId('fx_rates_type_temp') && dj.byId('fx_rates_type_temp').get('value') !== ''){
				m.onloadFXActions();
			}
			var prodStatCode = dj.byId("prod_stat_code"),liabAmt = dj.byId("ec_liab_amt") ;
			//maturity date mandatory
			if(prodStatCode.get("value") === "05" || prodStatCode.get("value") === "13" || prodStatCode.get("value") === "15"|| prodStatCode.get("value") === "14" || prodStatCode.get("value") === "04"){
				m.toggleRequired("maturity_date", true);
			}
			if(liabAmt && prodStatCode && (prodStatCode.get('value') === '01' || prodStatCode.get('value') === '10' || prodStatCode.get('value') === '06'))
				{
					liabAmt.set("readOnly", true);
					liabAmt.set("disabled", true);

				}
			else if(liabAmt)
				{
					liabAmt.set("readOnly", false);
					liabAmt.set("disabled", false);
				}
			m.populateGridOnLoad("ec");
			if (dj.byId("tnx_type_code") && (dj.byId("tnx_type_code").get("value") === '15' || (dj.byId("tnx_type_code").get("value") === '13')) && (m._config.enable_to_edit_customer_details_bank_side == "false"))
			{
				dojo.style('transactionDetails', "display", "none");
			} else
			{
				if (m._config.enable_to_edit_customer_details_bank_side == "false")
				{
					dojo.style('transactionDetails', "display", "none");

					var transactionids = [ "term_code", "tenor_desc", "entity",
							"presenting_bank_name", "presenting_bank_address_line_1",
							"presenting_bank_address_line_2", "drawer_name",
							"drawer_address_line_1", "drawer_address_line_2",
							"drawer_dom", "drawer_reference", "presenting_bank_dom",
							"drawer_contact_number", "drawer_email", "drawee_name",
							"drawee_address_line_1", "drawee_address_line_2",
							"drawee_dom", "drawee_country", "drawee_reference",
							"drawee_contact_number", "drawee_email", "ec_cur_code",
							"ec_amt", "ec_liab_amt", "presenting_bank_name",
							"presenting_bank_address_line_1",
							"presenting_bank_address_line_2", "presenting_bank_dom",
							"collecting_bank_name", "collecting_bank_name",
							"collecting_bank_address_line_1",
							"collecting_bank_address_line_2", "collecting_bank_dom",
							"bol_number", "shipping_by", "ship_from", "ship_to",
							"inco_term", "inco_place", "paymt_adv_send_mode",
							"accpt_adv_send_mode", "open_chrg_brn_by_code_1",
							"open_chrg_brn_by_code_2", "corr_chrg_brn_by_code_1",
							"corr_chrg_brn_by_code_2", "waive_chrg_flag",
							"protest_non_paymt", "protest_non_accpt",
							"protest_adv_send_mode", "accpt_defd_flag",
							"store_goods_flag", "needs_refer_to",
							"needs_instr_by_code_1", "needs_instr_by_code_2",
							"narrative_additional_instructions", "openDocumentDialog",
							"narrative_description_goods", "ec_outstanding_amt" ];
					d.forEach(transactionids, function(id)
					{
						var field = dj.byId(id);
						if (field)
						{
							m.toggleRequired(field, false);
						}
					});

				}
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
			if(dj.byId("tenor_days").get("value"))
			{
			 	dj.byId("tenor_maturity_date").set("disabled", true);
			 	m.toggleRequired("tenor_maturity_date", false);
			 	if(dojo.query("label[for=tenor_maturity_date]")[0].innerHTML.indexOf("*")=== -1){
					dojo.query("label[for=tenor_maturity_date]")[0].innerHTML = "<span class='required-field-symbol'></span>"+dojo.query("label[for=tenor_maturity_date]")[0].innerHTML;
				}
			 	if(dojo.query("label[for=tenor_period_label]")[0].innerHTML.indexOf("*")=== -1){
					dojo.query("label[for=tenor_period_label]")[0].innerHTML = "<span class='required-field-symbol'>*</span>"+dojo.query("label[for=tenor_period_label]")[0].innerHTML;
				}
			 	m.toggleRequired("tenor_days", true);
			 	m.toggleRequired("tenor_days_type", true);
			}
			if(dj.byId("prod_stat_code"))
			{
				dj.byId("prod_stat_code").onChange();
			}
			if(dj.byId("tenor_maturity_date").get("value"))
			{
				dj.byId("tenor_maturity_date").onBlur();
			}
		},
		
		
		beforeSubmitValidations : function() {
			if(dj.byId("ec_amt") && dj.byId("ec_liab_amt") && (dj.byId("ec_amt").get("value") < dj.byId("ec_liab_amt").get("value")))
			{
				m._config.onSubmitErrorMsg = m.getLocalization("ECLiabilityAmountCanNotBeGreaterThanECTotalAmount");
				dj.byId("ec_liab_amt").set("value", "");
				console.debug("Invalid Outstanding Amount.");
				return false;
			}
			
			if(dj.byId("ec_amt") && dj.byId("ec_outstanding_amt") && (dj.byId("ec_amt").get("value") < dj.byId("ec_outstanding_amt").get("value")))
			{
				m._config.onSubmitErrorMsg = m.getLocalization("ECLiabilityAmountCanNotBeGreaterThanECTotalAmount");
				dj.byId("ec_outstanding_amt").set("value", "");
				console.debug("Invalid Outstanding Amount.");
				return false;
			}
			if(dj.byId("tnx_amt") && (dj.byId("tnx_type_code") && 
					dj.byId("tnx_type_code").getValue()!="03" &&
					dj.byId("tnx_type_code").getValue()!="14" &&
					!(dj.byId("tnx_type_code").getValue()=="15" &&
					 (dj.byId("prod_stat_code").get('value')=="03" ||
					  dj.byId("prod_stat_code").get('value')=="06" ||
					  dj.byId("prod_stat_code").get('value')=="08" ||
					  dj.byId("prod_stat_code").get('value')=="81"))))
			{
				if(!m.validateAmount((dj.byId("tnx_amt"))?dj.byId("tnx_amt"):0))
				{
					m._config.onSubmitErrorMsg =  m.getLocalization("amountcannotzero");
					dj.byId("tnx_amt").set("value", "");
					return false;
				}
			}
			return (m.validateLSAmtSumAgainstTnxAmt("ec"));
		}
	});


	

		
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.bank.report_ec_client');