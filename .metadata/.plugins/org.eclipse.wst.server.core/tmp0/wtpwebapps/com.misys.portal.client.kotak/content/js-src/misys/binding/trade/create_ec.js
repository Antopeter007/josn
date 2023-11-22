dojo.provide("misys.binding.trade.create_ec");

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
dojo.require("misys.form.SimpleTextarea");
dojo.require("misys.form.file");
dojo.require("misys.form.addons");
dojo.require("misys.validation.common");
dojo.require("misys.widget.Collaboration");
dojo.require("misys.form.common");
dojo.require("misys.widget.NoCloseDialog");
dojo.require("misys.binding.trade.ls_common");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode
	var tenorLabel ="label[for=tenor_period_label]";
	
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
	
	function _doDrawerRefAction(){
		//  summary:
	    //        Perform action on issue bank ref change.
		
		dj.byId("drawer_reference").set("value", this.get("value"));
	}
	
	function _clearPrincipalFeeAcc(){
		dj.byId("principal_act_no").set("value", "");
		dj.byId("fee_act_no").set("value", "");	
	}
	
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
					if(dj.byId("documents_details_code_nosend").get("value") !== "01")
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
	
	function _updateDocumentSection(){
		
		var attachmentField = dijit.byId("attachment-file");
		var isUpdateSuccess = true; 
		var tempItems = [];
		var tempAttachmentIds = [];
		var tempAttachmentNames = [];

		if (attachmentField && attachmentField.store && attachmentField.store._arrayOfAllItems && attachmentField.store._arrayOfAllItems.length)
		{
			d.forEach(attachmentField.store._arrayOfAllItems, function(item, index)
			{
				if (item && item.attachment_id && item.file_name)
				{
					tempAttachmentIds.push(item.attachment_id.toString());
					tempAttachmentNames.push(item.file_name.toString());
				}
			});
		}

		d.query("*[id^='documents_details_mapped_attachment_id_']").forEach(function(item, index)
		{
			var docMapId = dijit.byId('documents_details_mapped_attachment_id_' + index);
			var docMapIdValue = docMapId?docMapId.get('value') : "";
			var docMapName = dijit.byId('documents_details_mapped_attachment_name_' + index);
			var docMapNameValue = docMapName?docMapName.get('value') : "";
			var docMapIdNotExistInUploadList = (tempAttachmentIds && docMapIdValue !== "" && tempAttachmentIds.indexOf(docMapIdValue) == -1 && tempAttachmentNames && docMapNameValue !== "" && tempAttachmentNames.indexOf(docMapNameValue) == -1);
			var documentrow = dojo.byId('document_row_' + index);
			
			if (docMapId && docMapName && docMapIdNotExistInUploadList)
			{
				docMapId.set('value', ''); 
				docMapName.set('value','');
				documentrow.cells[6].innerHTML = "";
				isUpdateSuccess = false;
			}
		});
		
		if(!isUpdateSuccess){
			m._config.onSubmitErrorMsg = m.getLocalization("incorrectDocumentMappingError");
		}
		
		return isUpdateSuccess;
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
		if(misys._config.isDocumentMandatory)
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
		return true;
	}
	

	
	d.mixin(m._config, {

		initReAuthParams : function() {
									
			var reAuthParams = {
				productCode : 'EC',	
				subProductCode : '',
				transactionTypeCode : '01',	
				entity :dj.byId("entity") ? dj.byId("entity").get("value") : "",
				currency : dj.byId("ec_cur_code")? dj.byId("ec_cur_code").get('value'): "",				
				amount : dj.byId("ec_amt") ? m.trimAmount(dj.byId("ec_amt").get('value')):"",
								
				es_field1 : dj.byId("ec_amt")? m.trimAmount(dj.byId("ec_amt").get('value')):"",
				es_field2 : ''				
			};
			return reAuthParams;
		},
		/*
		 * Overriding to add license items in the xml. 
		 */
		xmlTransform : function (/*String*/ xml) {
			var tdXMLStart = "<ec_tnx_record>";
			/*
			 * Add license items tags, only in case of LC transaction.
			 * Else pass the input xml, without modification. (Ex : for create drawee from popup.)
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
			m.setValidation("template_id", m.validateTemplateId);
			m.setValidation("ec_cur_code", m.validateCurrency);
			m.setValidation('drawee_country', m.validateCountry);
			m.setValidation("presenting_bank_phone", m.validatePhoneOrFax);
			if(dj.byId("tenor_base_date")){
				m.setValidation("tenor_base_date", m.validateBaseDateWithCurrentSystemDate);
			}
			if(dj.byId("tenor_maturity_date")){
				m.setValidation("tenor_maturity_date", m.validateMaturityDateWithSystemDate);
			}
			m.connect("remitting_bank_abbv_name", "onChange", m.populateReferences);
			m.connect("remitting_bank_abbv_name", "onChange",  m.updateBusinessDate);
			if(dj.byId("remitting_bank_abbv_name"))
			{
				m.connect("entity", "onChange", function(){
					dj.byId("remitting_bank_abbv_name").onChange();});
			}
			m.connect("remitting_bank_customer_reference", "onChange", _doDrawerRefAction);
			m.connect("corr_chrg_brn_by_code_1", "onClick", function(){
			dj.byId("waive_chrg_flag").set('checked', true);
			dj.byId("waive_chrg_flag").set('disabled', true);
			});                      
		    m.connect("corr_chrg_brn_by_code_2", "onClick", function(){
			dj.byId("waive_chrg_flag").set('disabled', false);
			dj.byId("waive_chrg_flag").set('checked', false);
			});
			
			m.connect("term_code", "onChange", function(){
				/* Making advise acceptance and due date as non mandatory field MPS-56919
				  m.toggleFields((this.get("value") != "01"), null, [
						"accpt_adv_send_mode"]);*/
				
				if(this.get("value") != "01")
				{
					dj.byId("accpt_adv_send_mode").set("disabled",false);
				}
				else if(this.get("value") === '01')
				{
					dj.byId("accpt_adv_send_mode").set("value","");
					dj.byId("accpt_adv_send_mode").set("disabled",true);
				}
				if(dj.byId("protest_non_accpt").get("checked",true))
				{
					dj.byId("protest_non_accpt").set("checked",false);
				}
				if(dj.byId("accpt_defd_flag").get("checked",true))
				{
					dj.byId("accpt_defd_flag").set("checked",false);
				}
				if(dj.byId("boe_flag"))
				{
					if(this.get("value") !== "01")
					{
						m.animate("fadeIn", d.byId("boe"));
					}
					else
					{
						m.animate("fadeOut", d.byId("boe"));
						dj.byId("boe_flag").set("checked", false);
					}
				}
			
				if(this.get("value")==="01"){
					
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
					dj.byId("tenor_maturity_date").set("disabled", true);
					dj.byId("tenor_maturity_date").set("readOnly", true);

				}
				else if(this.get("value")==="02"){
					dj.byId("tenor_type_2").set("disabled", false);
					dj.byId("tenor_type_2").set("checked", true);
					dj.byId("tenor_type_3").set("disabled", true);
					dj.byId("tenor_type_3").set("checked", false);
					dj.byId("tenor_type_1").set("disabled", true);
					dj.byId("tenor_type_1").set("checked", false);
					dj.byId("tenor_desc").set("disabled", true);
					dj.byId("tenor_desc").set("value", "");
					m.toggleRequired("tenor_desc", false);
					m.toggleAllTenorFields();
					dj.byId("tenor_maturity_date").set("disabled", false);
					dj.byId("tenor_maturity_date").set("readOnly", false);
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
					dj.byId("tenor_maturity_date").set("disabled", false);
					dj.byId("tenor_maturity_date").set("readOnly", false);
					}
				else if(this.get("value")==="03"){
					dj.byId("tenor_type_1").set("disabled", false);
					dj.byId("tenor_type_2").set("disabled", false);
					dj.byId("tenor_type_3").set("disabled", false);
					dj.byId("tenor_type_1").set("checked", true);
					dj.byId("tenor_type_2").set("checked", false);
					dj.byId("tenor_desc").set("disabled", false);
					m.toggleRequired("tenor_desc", true);
					m.toggleAllTenorFields();
					dj.byId("tenor_maturity_date").set("disabled", true);
					dj.byId("tenor_maturity_date").set("readOnly", true);
					if(dj.byId("tenor_type_1").get("checked") && dj.byId("boe_flag")){
						m.animate("fadeOut", d.byId("boe"));
						dj.byId("boe_flag").set("checked", false);
					}else {
						m.animate("fadeIn", d.byId("boe"));
					}
					
				}
			
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
				m.toggleRequired(dojo.query(tenorLabel)[0].innerHTML = m.getLocalization("tenorPeriod"), false);	
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
				if((termCodeValue === "02" || termCodeValue === "04" || termCodeValue === "03") && dj.byId("tenor_days"))
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
			
			
			/*m.connect("tenor_days", "onBlur", m.calcMaturityDate);
			m.connect("tenor_period", "onBlur", m.calcMaturityDate);
			m.connect("tenor_from_after", "onBlur", m.calcMaturityDate);*/
			//Commented as part of MPSSC-14301 
			//m.connect("tenor_base_date", "onBlur", m.calcMaturityDate);
			m.connect("tenor_days_type", "onChange",function(){
				m.toggleFields((this.get("value") === "O"), null, ["tenor_type_details"]);
				var termCodeValue = dj.byId("term_code") ?
						dj.byId("term_code").get("value") : "";
				if(termCodeValue) {
					if(termCodeValue === "04"){
						if( (this.get("value") === "O") || (this.get("value") === "G") || (this.get("value") === "S")){
						dj.byId("tenor_base_date").set("disabled", true);
						}
						else{
							dj.byId("tenor_base_date").set("disabled", false);
						}
				}
				}
				else{
						dj.byId("tenor_desc").set("disabled", true);
						dj.byId("tenor_type_1").set("disabled", true);
						dj.byId("tenor_type_2").set("disabled", true);
						dj.byId("tenor_type_3").set("disabled", true);
						dj.byId("tenor_days").set("disabled", true);
						dj.byId("tenor_period").set("disabled", true);
						dj.byId("tenor_from_after").set("disabled", true);
						dj.byId("tenor_days_type").set("disabled", true);
						dj.byId("tenor_type_details").set("disabled", true);
						dj.byId("tenor_base_date").set("disabled", true);	
					}
				
			});
			
			m.connect("protest_non_accpt", "onClick", m.disableNonAcceptanceFields);
			m.connect("accpt_defd_flag", "onClick", m.disableNonAcceptanceFields);
			m.connect("tenor_type_1", "onClick",  m.toggleAllTenorFields);
			m.connect("tenor_type_2", "onClick", m.toggleAllTenorFields);
			m.connect("tenor_type_3", "onClick", m.toggleAllTenorFields);
			m.connect("ec_cur_code", "onChange", function(){
				m.setCurrency(this, ["ec_amt"]);
			});
			m.connect("ec_amt", "onBlur", function(){
				m.setTnxAmt(this.get("value"));
			});
			m.connect("presenting_bank_name", "onChange", function(){
				m.toggleFields(dj.byId("presenting_bank_name").get("value") && 
						dj.byId("presenting_bank_address_line_1").get("value"), 
						["presenting_bank_contact_name", "presenting_bank_phone"], null);
				return false;
			});
			m.connect("presenting_bank_address_line_1", "onChange", function(){
				m.toggleFields( dj.byId("presenting_bank_name").get("value") &&
						dj.byId("presenting_bank_address_line_1").get("value"), 
						["presenting_bank_contact_name", "presenting_bank_phone"], null);
				return false;
			});
			
			m.connect("remitting_bank_abbv_name", "onChange",  function(){
				if(dj.byId("remitting_bank_abbv_name").get("value")!="")
			{
					m.getIncoYear();
			}
			});
			m.connect("inco_term_year", "onChange",m.getIncoTerm);
			m.connect("inco_term_year", "onChange", function(){
				m.toggleFields(this.get("value"), null, ["inco_term"], false, true);
			});
			m.connect("inco_term_year", "onClick",function(){
				if(dj.byId("remitting_bank_abbv_name").get("value")=="" &&  (this.store._arrayOfAllItems==undefined || this.store._arrayOfAllItems.length==0))
					{
					m.dialog.show("ERROR", m.getLocalization("selectBankToProceed"), '', '');
					}
			});
			m.connect("inco_term", "onClick",function(){
				if(dj.byId("remitting_bank_abbv_name").get("value")=="" &&  (this.store._arrayOfAllItems==undefined || this.store._arrayOfAllItems.length==0))
					{
					m.dialog.show("ERROR", m.getLocalization("selectBankToProceed"), '', '');
					}
				else if (dj.byId("inco_term_year").get("value")=="" &&  (this.store._arrayOfAllItems==undefined || this.store._arrayOfAllItems.length==0))
					{
					m.dialog.show("ERROR", m.getLocalization("selectIncoYearToProceed"), '', '');
					}
			});
			m.connect("inco_term", "onChange", function(){
				m.toggleFields(this.get("value"), null, ["inco_place"], false, false);
			});
			m.connect("entity_img_label","onClick",_clearPrincipalFeeAcc);
			
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
		},
		

		onFormLoad : function() {
			
			m._config.ecCurCode = dj.byId("ec_cur_code").get("value");
			m._config.isBank = false;
			m._config.drawee.name = dj.byId("drawee_name").get("value");
			m._config.drawee.addressLine1 = dj.byId("drawee_address_line_1").get("value");
			m._config.drawee.addressLine2 = dj.byId("drawee_address_line_2").get("value");
			m._config.drawee.dom = dj.byId("drawee_dom").get("value");
			m._config.drawer.entity = dj.byId("entity") ? dj.byId("entity").get("value") : "";
			m._config.drawer.name = dj.byId("drawer_name").get("value");
			m._config.drawer.addressLine1 = dj.byId("drawer_address_line_1").get("value");
			m._config.drawer.addressLine2 = dj.byId("drawer_address_line_2").get("value");
			m._config.drawer.dom = dj.byId("drawer_dom").get("value");
			// Additional onload events for dynamic fields follow
			dj.byId("tenor_maturity_date").set("disabled", true);
			var termCodeValue = dj.byId("term_code") ?
					dj.byId("term_code").get("value") : "";
			if(termCodeValue) {
				//m.toggleFields(termCodeValue !== "01", null, ["accpt_adv_send_mode"]);
				
				if(termCodeValue != "01")
				{
					dj.byId("accpt_adv_send_mode").set("disabled",false);
				}
				else if(termCodeValue === '01')
				{
					dj.byId("accpt_adv_send_mode").set("value","");
					dj.byId("accpt_adv_send_mode").set("disabled",true);
				}
				
				if(termCodeValue==="01"){
					m.toggleFields(true,null,["tenor_type_1"]);
					dj.byId("tenor_type_1").set("checked", true);
					dj.byId("tenor_type_2").set("disabled", true);
					dj.byId("tenor_type_3").set("disabled", true);
					dj.byId("tenor_days").set("disabled", true);
					dj.byId("tenor_desc").set("disabled", true);
					dj.byId("tenor_period").set("disabled", true);
					dj.byId("tenor_from_after").set("disabled", true);
					dj.byId("tenor_days_type").set("disabled", true);
					dj.byId("tenor_type_details").set("disabled", true);
					dj.byId("tenor_base_date").set("disabled", true);
					dj.byId("tenor_days").set("value", "");
					dj.byId("tenor_desc").set("value", "");
					dj.byId("tenor_period").set("value", "");
					dj.byId("tenor_from_after").set("value", "");
					dj.byId("tenor_days_type").set("value", "");
					dj.byId("tenor_base_date").set("displayedValue", "");
					dj.byId("tenor_maturity_date").set("displayedValue", "");
				}
				else if(termCodeValue==="02"){
					dj.byId("tenor_type_3").set("disabled", true);
					dj.byId("tenor_type_2").set("disabled", false);
					dj.byId("tenor_type_1").set("disabled", true);
					dj.byId("tenor_type_3").set("checked", false);
					dj.byId("tenor_type_1").set("checked", false);
					dj.byId("tenor_type_2").set("checked", true);
					dj.byId("tenor_desc").set("disabled", true);
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
					m.toggleRequired(dojo.query(tenorLabel)[0].innerHTML = m.getLocalization("tenorPeriod"), false);	
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
				else if(termCodeValue==="04"){
					dj.byId("tenor_type_3").set("disabled", false);
					dj.byId("tenor_type_2").set("disabled", true);
					dj.byId("tenor_type_1").set("disabled", true);
					dj.byId("tenor_type_1").set("checked", false);
					dj.byId("tenor_type_2").set("checked", false);
					dj.byId("tenor_type_3").set("checked", true);
					dj.byId("tenor_desc").set("disabled", true);
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
					m.toggleRequired(dojo.query(tenorLabel)[0].innerHTML = m.getLocalization("tenorPeriod"), false);	
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
					dj.byId("tenor_type_1").set("disabled", false);
					dj.byId("tenor_type_2").set("disabled", false);
					dj.byId("tenor_type_3").set("disabled", false);
					dj.byId("tenor_desc").set("disabled", false);
					m.toggleRequired("tenor_desc", true);
					if(dj.byId("tenor_type_2").get("checked")||dj.byId("tenor_type_3").get("checked"))
					{
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
						// Made following field optional and enabled for the issue MPS-42032 
						dj.byId("tenor_maturity_date").set("disabled", true);
						m.toggleRequired("tenor_maturity_date", false);
						m.toggleRequired("tenor_days", false);
						m.toggleRequired("tenor_period", false);
						m.toggleRequired("tenor_from_after", false);
						
						m.animate("fadeOut", d.byId("boe"));
					}
				}
				var termDaysType = dj.byId("tenor_days_type") ?
						dj.byId("tenor_days_type").get("value") : "";
				if (termDaysType === "O") {
					dj.byId("tenor_type_details").set("disabled", false);
					m.toggleRequired("tenor_type_details", true);
				}
				else{
					dj.byId("tenor_type_details").set("disabled", true);

				}
			}
			else {
				dj.byId("tenor_desc").set("disabled", true);
				dj.byId("tenor_type_1").set("disabled", true);
				dj.byId("tenor_type_2").set("disabled", true);
				dj.byId("tenor_type_3").set("disabled", true);
				dj.byId("tenor_days").set("disabled", true);
				dj.byId("tenor_period").set("disabled", true);
				dj.byId("tenor_from_after").set("disabled", true);
				dj.byId("tenor_days_type").set("disabled", true);
				dj.byId("tenor_type_details").set("disabled", true);
				dj.byId("tenor_base_date").set("disabled", true);	
			}
			
			m.setCurrency(dj.byId("ec_cur_code"), ["ec_amt"]);
			
			var remittingBankAbbvName = dj.byId("remitting_bank_abbv_name");
			if(remittingBankAbbvName) {
				remittingBankAbbvName.onChange();
			}
			var remittingBankCustRef = dj.byId("remitting_bank_customer_reference");
			if(remittingBankCustRef) {
				remittingBankCustRef.onChange();
				remittingBankCustRef.set('value',dj.byId("remitting_bank_customer_reference").value);
			}
			m.populateGridOnLoad("ec");
			
			if(dj.byId("ec_type_code") && dj.byId("ec_type_code").get("value") === "03" && dj.byId("dir_coll_letter_flag"))
			{
				dj.byId("dir_coll_letter_flag").set("value","Y");
			}
			if(dj.byId("boe_flag"))
			{
				if(dj.byId("term_code").get("value") !== "01")
				{
					m.animate("fadeIn", d.byId("boe"));
				}
				else
				{
					m.animate("fadeOut", d.byId("boe"));
					dj.byId("boe_flag").set("checked", false);
				}
			}
			if(dj.byId("documents_details_total_send")){
				dj.byId("documents_details_total_send").set("readOnly", true);
			}
			
			if(dj.byId("inco_term_year"))
			{
				m.getIncoYear();
				dijit.byId("inco_term_year").set("value",dj.byId("org_term_year").get("value"));
			}
		if(dj.byId("inco_term"))
		{
			if(dj.byId("remitting_bank_abbv_name") && dj.byId("remitting_bank_abbv_name").get("value")!="" && dj.byId("inco_term_year") && dj.byId("inco_term_year").get("value")!="")
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
		
		beforeSaveValidations : function(){
			var entity = dj.byId("entity");
			if (entity && entity.get("value") === "")
			{
				return false;
			} else
			{
				return true;
			}
		},
		
		beforeSubmitValidations : function(){
			
			var returnValue = _updateDocumentSection();

			if(returnValue){
				
				var boeFlag = dj.byId("boe_flag");
				var dirCollLetterFlag = dj.byId("dir_coll_letter_flag");
				var ecAmt = dj.byId("ec_amt");
				
				// Set the value N in case of when the checkbox is unchecked
				if(dirCollLetterFlag && !(dirCollLetterFlag.get("checked")))
				{
					dirCollLetterFlag.set("value", "N");
				}
				if(boeFlag && !(boeFlag.get("checked")))
				{
					boeFlag.set("value", "N");
				}
				
				//General validation: validate against EC amount which should be greater than zero
				if(ecAmt)
				{
					if(!m.validateAmount(ecAmt))
					{
						m._config.onSubmitErrorMsg =  m.getLocalization("amountcannotzero");
						ecAmt.set("value", "");
						return false;
					}
				}
				
				returnValue = m.validateLSAmtSumAgainstTnxAmt("ec");				
			}

			if(!validateDocumentMandatory())
			{
				m._config.onSubmitErrorMsg = m.getLocalization("documentattachedMustError");
				return false;
			}

			if(!(m.validateLength(["drawer","drawee","presenting_bank","collecting_bank"])))
    		{
    			return false;
    		}

			if(dj.byId("remitting_bank_abbv_name") && !m.validateApplDate(dj.byId("remitting_bank_abbv_name").get("value")))
			{
				m._config.onSubmitErrorMsg = m.getLocalization('changeInApplicationDates');
				m.goToTop();
				return false;
      		}

			return returnValue;

		}
		
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require("misys.client.binding.trade.create_ec_client");