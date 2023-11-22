dojo.provide("misys.binding.bank.report_ic");

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
dojo.require("misys.widget.NoCloseDialog");
dojo.require("misys.binding.trade.ls_common");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode
	m._config = m._config || {};
    m._config.icCurCode = m._config.icCurCode || {};
	m._config.drawee = m._config.drawee || {	entity : "",
												name : "",
												addressLine1 : "",
												addressLine2 : "",
												dom : ""
											  };
													  
													  
	// Private functions and variables go here
	function validateContent(widget)
	{
		var errorMessage= null;
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
			
			if(dj.byId(widget).get("required"))
			{
				if(widgetContent <= 0) 
				{
					errorMessage =  m.getLocalization("valueShouldBeGreaterThanZero");
					dj.byId(widget).set("state","Error");
					dj.hideTooltip(dj.byId(widget).domNode);
					dj.showTooltip(errorMessage, dj.byId(widget).domNode, 0);
					var hideTT2 = function() {
						dj.hideTooltip(dj.byId(widget).domNode);
					};
					setTimeout(hideTT2, 1500);
					return false;
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
	
	function validateDocumentMandatory()
	{
	  		   var documentAttached = false;
               var documentTableTrLength = d.query('#document-master-table > tbody > tr').length;
               if(documentTableTrLength == 0)
               {
                      return documentAttached;
               }
               for (var i = 0; i<documentTableTrLength; i++){
               if(dojo.query('#document-master-table > tbody > tr')[i].id){
                      documentAttached = true;
                      return documentAttached;
               }
             }
            return documentAttached;
	}

	// Public functions & variables follow

 d.mixin(m._config, {
			/*
			 * Overriding to add license items in the xml. 
			 */
		
		xmlTransform : function (/*String*/ xml) {
			var tdXMLStart = "<ic_tnx_record>";
			/*
			 * Add license items tags, only in case of LC transaction.
			 * Else pass the input xml, without modification. (Ex : for create beneficiary from popup.)
			 */
			if(xml.indexOf(tdXMLStart) != -1){
				// Setup the root of the XML string
				var xmlRoot = m._config.xmlTagName,
				transformedXml = xmlRoot ? ["<", xmlRoot, ">"] : [],			
						tdXMLEnd   = "</ic_tnx_record>",
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
								/*transformedXml.push("<ls_allocated_add_amt>",item.LS_ALLOCATED_ADD_AMT,"</ls_allocated_add_amt>");*/
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
			m.setValidation("ic_cur_code", m.validateCurrency);
			m.setValidation("latest_answer_date", m.validateLatestAnswerDate);
			m.setValidation("tenor_base_date", m.validateBaseDate);
			
			//Validate Hyphen, allowed no of lines validation on the back-office comment
			m.setValidation("bo_comment", m.bofunction);
			m.connect("courier_partner","onChange", m.validatecourierPartnerField);
			
			//validation to check row count doesn't exceed the maximum rows
			var fields = ["narrative_description_goods","narrative_additional_instructions"];
			d.forEach(fields, function(id){
				var field= dj.byId(id);
				if(typeof field!='undefined'){
                    field.onBlur(field);
				}
			});
			
			// CF See comment in report_lc.js for this validation
			m.connect("prod_stat_code", "onChange", m.validateOutstandingAmount);
			m.connect("prod_stat_code", "onChange", function(){
				var  prodStatCodeValue=dj.byId("prod_stat_code").get("value") ;
				if(prodStatCodeValue==="07"){
				dj.byId("imp_bill_ref_id").set("disabled", false);
					m.toggleRequired("imp_bill_ref_id", false);
				}
				else{
					dj.byId("imp_bill_ref_id").set("disabled", true);
					m.toggleRequired("imp_bill_ref_id", false);
					dj.byId("imp_bill_ref_id").set("value", m._config.billRefVal);
				}
				
			});		
			m.connect("ic_cur_code", "onChange", function(){
				m.setCurrency(this, ["ic_amt"]);
				m.setCurrency(this, ["ic_outstanding_amt", "ic_liab_amt"]);
			});
			
			m.connect("ic_outstanding_amt", "onBlur", function(){
				if(dj.byId("ic_amt") && (dj.byId("ic_amt").get("value") < dj.byId("ic_outstanding_amt").get("value")))
				{
					var callback = function() {
						var widget = dijit.byId("ic_outstanding_amt");
					 	widget.set("state","Error");
					};
					m.dialog.show("ERROR", m.getLocalization("ICLiabilityAmountCanNotBeGreaterThanICTotalAmount"), '', function(){
							setTimeout(callback, 0);
						});
				}
			});
			
			m.connect("term_code", "onChange", function(){
				m.toggleFields(
						(this.get("value") !== "01"), null, ["tenor_desc"]);
				m.toggleFields(
						(this.get("value") === "02"),["tenor_maturity_date"]);

				var termCodeValue = this.get("value");
				
				if(termCodeValue === "01")
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
				if(termCodeValue ==="01"){
					
					m.toggleFields(true,null,["tenor_type_1"], false);					
					dj.byId("tenor_type_1").set("checked", true);	
					dj.byId("tenor_type_2").set("disabled", true);
					dj.byId("tenor_type_2").set("checked", false);
					dj.byId("tenor_type_3").set("disabled", true);
					dj.byId("tenor_type_3").set("checked", false);
					dj.byId("tenor_desc").set("disabled", true);
					dj.byId("tenor_desc").set("value", "");
					m.toggleRequired("tenor_desc", false);
					m.toggleAllTenorFields();

				}
				else if(this.get("value")==="02"){
					dj.byId("tenor_type_2").set("disabled", false);
					dj.byId("tenor_type_2").set("checked", true);
					dj.byId("tenor_type_1").set("disabled", true);
					dj.byId("tenor_type_3").set("disabled", true);
					dj.byId("tenor_type_3").set("checked", false);
					dj.byId("tenor_type_1").set("checked", false);
					dj.byId("tenor_desc").set("disabled", true);
					dj.byId("tenor_desc").set("value", "");
					m.toggleRequired("tenor_desc", false);
					m.toggleAllTenorFields();	
				}
				else if(this.get("value")==="04")
				{
				dj.byId("tenor_type_2").set("disabled", true);
				dj.byId("tenor_type_2").set("checked", false);
				dj.byId("tenor_type_3").set("disabled", false);
				dj.byId("tenor_type_3").set("checked", true);
				dj.byId("tenor_type_1").set("disabled", true);
				dj.byId("tenor_type_1").set("checked", false);
				dj.byId("tenor_desc").set("disabled", true);
				dj.byId("tenor_desc").set("value", "");
				m.toggleRequired("tenor_desc", false);
				m.toggleAllTenorFields();	
				}
				else if(termCodeValue ==="03"){
					dj.byId("tenor_type_1").set("disabled", false);
					dj.byId("tenor_type_2").set("disabled", false);
					dj.byId("tenor_type_3").set("disabled", false);
					dj.byId("tenor_type_1").set("checked", true);
					dj.byId("tenor_type_2").set("checked", false);
					dj.byId("tenor_desc").set("disabled", false);
					m.toggleRequired("tenor_desc", true);
					m.toggleAllTenorFields();
				}
			});
			
			m.connect("tenor_days", "onBlur", m.calcMaturityDate);
			m.connect("tenor_period", "onBlur", m.calcMaturityDate);
			m.connect("tenor_from_after", "onBlur", m.calcMaturityDate);
			m.connect("tenor_base_date", "onBlur", m.calcMaturityDate);
			m.connect("tenor_type_1", "onClick",  m.toggleAllTenorFields);
			m.connect("tenor_type_2", "onClick", m.toggleAllTenorFields);
			m.connect("tenor_type_3", "onClick", m.toggleAllTenorFields);
			m.connect("tenor_days_type", "onChange",function(){
				m.toggleFields((this.get("value") === "O"), null, ["tenor_type_details"]);	
			});
			m.connect("protest_non_accpt", "onClick", m.disableNonAcceptanceFields);
			m.connect("accpt_defd_flag", "onClick", m.disableNonAcceptanceFields);
			m.connect("ic_amt", "onBlur", function(){
				m.setTnxAmt(this.get("value"));
			});
			m.connect("inco_term_year", "onChange", m.getIncoTerm);
			m.connect("inco_term_year", "onChange", function(){
				m.toggleFields(this.get("value"), null, ["inco_term"], false, true);
			});
			m.connect("inco_term", "onChange", function(){
				m.toggleFields(this.get("value"), null, ["inco_place"], false, false);
			});
			m.connect("ic_liab_amt", "onBlur", function(){
				if(dj.byId("ic_amt") && (dj.byId("ic_amt").get("value") < dj.byId("ic_liab_amt").get("value")))
				{
					var callback = function() {
						var widget = dijit.byId("ic_liab_amt");
					 	widget.set("state","Error");
					};
					m.dialog.show("ERROR", m.getLocalization("ICLiabilityAmountCanNotBeGreaterThanICTotalAmount"), '', function(){
							setTimeout(callback, 0);
						});
				}
			});
			m.connect("prod_stat_code", "onChange", m.toggleProdStatCodeFields);
			m.connect("prod_stat_code", "onChange", function(){
				var value = this.get("value");
				m.toggleFields(value && value !== "" && value !== "01" && value !== "18", null,
									["iss_date", "bo_ref_id"]);
				if(value === "05" || value === "13" || value === "15"|| value === "14" || value === "04")
				{
					m.toggleRequired("maturity_date", true);
				}
				else {
					m.toggleRequired("maturity_date", false);
				}
			});
			// Making outstanding amount as non editable in case of Not Processed,Cancelled,Purged
			m.connect("prod_stat_code","onChange",function(){
				var prodStatCodeValue = dj.byId("prod_stat_code").get('value'),liabAmt = dj.byId("ic_liab_amt");
				if(liabAmt && (prodStatCodeValue === '01' || prodStatCodeValue === '10' || prodStatCodeValue === '06'))
					{
						liabAmt.set("readOnly", true);
						liabAmt.set("disabled", true);
					}
				else if(liabAmt)
					{
						liabAmt.set("readOnly", false);
						liabAmt.set("disabled", false);
					}
			});

			m.connect(dj.byId("prod_stat_code"), "onChange", function(){this.validate();});			
			
			m.connect("collecting_bank_iso_code", "onBlur", function(){
				m.setSwiftBankDetailsForOnBlurEvent(true, "collecting_bank_iso_code", null, null, "collecting_bank_", true, false, true);
			});
			m.setValidation("collecting_bank_iso_code", m.validateBICFormat);
			m.connect("remitting_bank_iso_code", "onBlur", function(){
				m.setSwiftBankDetailsForOnBlurEvent(true, "remitting_bank_iso_code", null, null, "remitting_bank_", true, false, true);
			});
			m.setValidation("remitting_bank_iso_code", m.validateBICFormat);
			
			m.connect("license_lookup","onClick", function(){
			m.getLicenses("ic");
			});
			
			m.connect("ic_cur_code", "onChange", function(){
				m.clearLicenseGrid(this, m._config.icCurCode,"ic");
			});
			
			m.connect("entity", "onChange", function(){
				m.clearLicenseGrid(this, m._config.drawee,"ic");
			});
			
			m.connect("drawee_name", "onChange", function(){
				m.clearLicenseGrid(this, m._config.drawee,"ic");
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
			
			m.connect("tenor_maturity_date", "onBlur", function(){
				var termCodeValue = dj.byId("term_code") ? dj.byId("term_code").get("value") : "";
				if((termCodeValue === "02" || termCodeValue === "04" || termCodeValue === "03") && dj.byId("tenor_maturity_date"))
				{
				if(dj.byId("tenor_maturity_date").get("value"))
				{
				dj.byId("tenor_days").set("value", "");
				dj.byId("tenor_desc").set("value", "");
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
				if((termCodeValue === "02" || termCodeValue === "04") && dj.byId("tenor_days"))
				{
				if(dj.byId("tenor_days").get("value"))
				{
				dj.byId("tenor_maturity_date").set("displayedValue", "");
				dj.byId("tenor_maturity_date").set("disabled", true);
				}
				else if(!dj.byId("tenor_days").get("value"))
				{
				dj.byId("tenor_maturity_date").set("disabled", false);
				m.toggleAllTenorFields();
				}
				}
				});
			
			m.connect("documents_details_first_mail_send","onBlur",
					function(){
				validateTotalDoc("documents_details_first_mail_send");
					});
			m.connect("documents_details_second_mail_send","onBlur",
					function(){
				validateTotalDoc("documents_details_second_mail_send");
					});
		},

		onFormLoad : function() {
			
			m._config.icCurCode = dj.byId("ic_cur_code") ? dj.byId("ic_cur_code").get("value"):"";
			m._config.isBank = true;
			m._config.drawee.name = dj.byId("drawee_name") ? dj.byId("drawee_name").get("value") : "";
			m._config.drawee.addressLine1 = dj.byId("drawee_address_line_1") ? dj.byId("drawee_address_line_1").get("value") : "";
			m._config.drawee.addressLine2 = dj.byId("drawee_address_line_2") ? dj.byId("drawee_address_line_2").get("value") : "";
			m._config.drawee.dom = dj.byId("drawee_dom") ? dj.byId("drawee_dom").get("value"):"";
			m._config.drawee.entity = dj.byId("entity") ? dj.byId("entity").get("value") : "";
			
			m.setCurrency(dj.byId("ic_cur_code"), ["tnx_amt", "ic_amt", "ic_liab_amt","ic_outstanding_amt"]);
			if(dj.byId("ic_cur_code")){
				m.setCurrency(dj.byId("ic_cur_code"), ["ic_outstanding_amt","ic_liab_amt"]);
			}
			
			var  prodStatCodeValue=dj.byId("prod_stat_code").get("value") ;
			var termCode = dj.byId("term_code");
			if(termCode) {
				if(termCode.get("value") === "01" || termCode.get("value") === "03")
				{
					if(termCode.get("value") === "01")
					{
						dj.byId("accpt_adv_send_mode").set("value", "");
						dj.byId("accpt_adv_send_mode").set("disabled", true);
					}
				} 
						
			}
			var termCodeValue = dj.byId("term_code") ?
					dj.byId("term_code").get("value") : "";
					
			var tenorType01 = dj.byId("tenor_type_1"),
				tenorType02 = dj.byId("tenor_type_2"),
				tenorType03 = dj.byId("tenor_type_3"),
				tenorDays = dj.byId("tenor_days"),
				tenorDesc = dj.byId("tenor_desc"),
				tenorPeriod = dj.byId("tenor_period"),
				tenorFromAfter = dj.byId("tenor_from_after"),
				tenorDaysType = dj.byId("tenor_days_type"),
				tenorTypeDetails = dj.byId("tenor_type_details"),
				tenorBaseDate = dj.byId("tenor_base_date"),
				tenorMaturityDate = dj.byId("tenor_maturity_date");
			
			if(termCodeValue){
				
			if(termCodeValue==="01"){
						m.toggleFields(true,null,["tenor_type_1"]);
						tenorType01.set("checked", true);
						tenorType02.set("disabled", true);
						tenorType03.set("disabled", true);
						tenorDays.set("disabled", true);
						tenorDesc.set("disabled", true);
						tenorPeriod.set("disabled", true);
						tenorFromAfter.set("disabled", true);
						tenorDaysType.set("disabled", true);
						tenorTypeDetails.set("disabled", true);
						tenorBaseDate.set("disabled", true);
						tenorDays.set("value", "");
						tenorDesc.set("value", "");
						tenorPeriod.set("value", "");
						tenorFromAfter.set("value", "");
						tenorDaysType.set("value", "");
						tenorBaseDate.set("displayedValue", "");
						tenorMaturityDate.set("displayedValue", "");
						tenorMaturityDate.set("disabled", true);	
					}
					else if(termCodeValue ==="02"){
						tenorType03.set("disabled", true);
						tenorType02.set("disabled", false);
						tenorType01.set("disabled", true);
						tenorType01.set("checked", false);
						tenorType02.set("checked", true);
						tenorType03.set("checked", false);
						tenorDesc.set("disabled", true);
						tenorMaturityDate.set("disabled", false);
						m.toggleRequired("tenor_maturity_date", true);
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
					else if(termCodeValue ==="04"){
						tenorType03.set("disabled", false);
						tenorType02.set("disabled", true);
						tenorType01.set("disabled", true);
						tenorType01.set("checked", false);
						tenorType02.set("checked", false);
						tenorType03.set("checked", true);
						tenorDesc.set("disabled", true);
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
					else {
						tenorType01.set("disabled", false);
						tenorType02.set("disabled", false);
						tenorType03.set("disabled", false);
						tenorDesc.set("disabled", false);
						m.toggleRequired("tenor_desc", true);
						if(tenorType02.get("checked")||tenorType03.get("checked"))
						{
							tenorTypeDetails.set("disabled", false);
							m.toggleAllTenorFields();	
						}
						else
						{
							tenorDays.set("disabled", true);
							tenorPeriod.set("disabled", true);
							tenorFromAfter.set("disabled", true);
							tenorDaysType.set("disabled", true);
							tenorTypeDetails.set("disabled", true);
							tenorBaseDate.set("disabled", true);
							tenorMaturityDate.set("disabled", true);
							m.toggleRequired("tenor_maturity_date", false);
							m.toggleRequired("tenor_days", false);
							m.toggleRequired("tenor_period", false);
							m.toggleRequired("tenor_from_after", false);
						}
					}
					var termDaysType = tenorDaysType ?
							tenorDaysType.get("value") : "";
					if (termDaysType === "O") {
						tenorTypeDetails.set("disabled", false);
						m.toggleRequired("tenor_type_details", true);
					}
					else{
						tenorTypeDetails.set("disabled", true);

					}
			}
			else if(tenorType01 || tenorType02 || tenorType03 || tenorDays || tenorDesc || tenorPeriod || tenorFromAfter || tenorDaysType || tenorTypeDetails || tenorBaseDate || tenorMaturityDate)
			{
				tenorType01.set("disabled", true);
				tenorType02.set("disabled", true);
				tenorType03.set("disabled", true);
				tenorDays.set("disabled", true);
				tenorDesc.set("disabled", true);
				tenorPeriod.set("disabled", true);
				tenorFromAfter.set("disabled", true);
				tenorDaysType.set("disabled", true);
				tenorTypeDetails.set("disabled", true);
				tenorBaseDate.set("disabled", true);
				tenorMaturityDate.set("disabled", true);	
			}
			if (dj.byId("latest_answer_date")){
				m.toggleProdStatCodeFields();
			}
			m.getSwiftBankDetails(true, "collecting_bank_iso_code", null, null, "collecting_bank_", false, false, true);
			m.getSwiftBankDetails(true, "remitting_bank_iso_code", null, null, "remitting_bank_", false, false, true);
			var prodStatCode = dj.byId("prod_stat_code"),liabAmt = dj.byId("ic_liab_amt") ;
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
			m.populateGridOnLoad("ic");
			if(dj.byId("documents_details_total_send")){
				dj.byId("documents_details_total_send").set("readOnly", true);
			}
			if (dj.byId("tnx_type_code") && (dj.byId("tnx_type_code").get("value") === '15' || (dj.byId("tnx_type_code").get("value") === '13')) && (m._config.enable_to_edit_customer_details_bank_side == "false"))
			{
				dojo.style('transactionDetails', "display", "none");
			} else
			{
				if (m._config.enable_to_edit_customer_details_bank_side == "false" && dojo.byId("release_dttm_view_row"))
				{
					dojo.style('transactionDetails', "display", "none");
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
			var incoTerm = dj.byId("inco_term") ? dj.byId("inco_term").get("value") : "";
			if(incoTerm) {
				m.toggleFields(incoTerm, null, ["inco_place"], false, true);
			}
			else{
				m.toggleFields(incoTerm, null, ["inco_place"], false, false);
			}
		}, 
		
		beforeSubmitValidations : function() {
			//General validation: validate against Import collection amount which should be greater than zero
			if(dj.byId("ic_amt"))
			{
				if(!m.validateAmount((dj.byId("ic_amt"))?dj.byId("ic_amt"):0))
				{
					m._config.onSubmitErrorMsg =  m.getLocalization("amountcannotzero");
					dj.byId("ic_amt").set("value", "");
					return false;
				}
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
			if(dj.byId("ic_amt") && dj.byId("ic_liab_amt") && (dj.byId("ic_amt").get("value") < dj.byId("ic_liab_amt").get("value")))
			{
				m._config.onSubmitErrorMsg = m.getLocalization("ICLiabilityAmountCanNotBeGreaterThanICTotalAmount");
				dj.byId("ic_liab_amt").set("value", "");
				console.debug("Invalid Outstanding Amount.");
				return false;
			}
			if(dj.byId("ic_amt") && dj.byId("ic_outstanding_amt") && (dj.byId("ic_amt").get("value") < dj.byId("ic_outstanding_amt").get("value")))
			{
				m._config.onSubmitErrorMsg = m.getLocalization("ICLiabilityAmountCanNotBeGreaterThanICTotalAmount");
				dj.byId("ic_outstanding_amt").set("value", "");
				console.debug("Invalid Outstanding Amount.");
				return false;
			}
			//Validate the length of bank name and all the address fields length not to exceed 1024
			if(!(m.validateLength(["drawer","drawee","remitting_bank","collecting_bank"])))
    		{
    			return false;
    		}
			if(!validateDocumentMandatory())
			{
				m._config.onSubmitErrorMsg = m.getLocalization("documentattachedMustError");
				return false;
			}

			return (m.validateLSAmtSumAgainstTnxAmt("ic"));
		}

	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.bank.report_ic_client');