dojo.provide("misys.binding.trade.amend_ec");

dojo.require("dijit.form.DateTextBox");
dojo.require("misys.form.CurrencyTextBox");
dojo.require("dijit.form.NumberTextBox");
dojo.require("dijit.form.FilteringSelect");
dojo.require("misys.form.file");
dojo.require("misys.form.SimpleTextarea");
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
dojo.require("misys.form.addons");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode
	
	// Private functions and variables go here
    // dojo.subscribe once a record is deleted from the grid
    var _deleteGridRecord = "deletegridrecord";
    var labl= "label[for=tenor_period_label]";
	
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
	
	function validateDecreaseAmount() 
	{
		if(dj.byId("org_ec_amt") && dj.byId("org_ec_amt").get("value") !== null && dj.byId("dec_amt") && dj.byId("dec_amt").get("value")!== null) {
			if(d.number.parse(dijit.byId("org_ec_amt").get("displayedValue")) < d.number.parse(dijit.byId("dec_amt").get("displayedValue"))) {
				var ecCurCodeValue = dj.byId("ec_cur_code").get("value");
				var ecAmtValue = dojo.number.parse(dj.byId("org_ec_amt").get("displayedValue"));
				dj.byId("dec_amt").invalidMessage = m.getLocalization("decAmountLessThanECAmt",[ ecCurCodeValue, ecAmtValue.toFixed(2) ]);
				misys.dialog.show("ERROR", dj.byId("dec_amt").invalidMessage, "", function(){
					dj.byId("dec_amt").focus();
					dj.byId("dec_amt").set("state","Error");
				});
				return false;
			}
		}return true;
	}

	d.mixin(m._config, {

		initReAuthParams : function() {
									
			var reAuthParams = {
				productCode : 'EC',	
				subProductCode : '',
				transactionTypeCode : "03",	
				entity :dj.byId("entity") ? dj.byId("entity").get("value") : "",
				currency : dj.byId("ec_cur_code") ? dj.byId("ec_cur_code").get('value') : "",				
				amount : dj.byId("ec_amt") ? m.trimAmount(dj.byId("ec_amt").get('value')) : "",
								
				es_field1 : dj.byId("ec_amt") ? m.trimAmount(dj.byId("ec_amt").get('value')) : "",
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
			 * Add license items tags, only in case of EC transaction.
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
	
	// Public functions & variables follow
	d.mixin(m, {

		bind : function() {
			m.setValidation("amd_date", m.validateAmendmentDate);
			m.connect("inc_amt", "onBlur", function(){
				m.validateAmendAmount(true, this, "ec");
			});
			
			m.connect("dec_amt", "onBlur", function(){
				validateDecreaseAmount();
				m.validateAmendAmount(true, this, "ec");
			});
			if(dj.byId("tenor_base_date")){
				m.setValidation("tenor_base_date", m.validateBaseDateWithCurrentSystemDate);
			}
			if(dj.byId("tenor_maturity_date")){
				m.setValidation("tenor_maturity_date", m.validateMaturityDateWithSystemDate);
			}
			m.connect("inc_amt", "onBlur", m.amendTransaction);
			m.connect("dec_amt", "onBlur", m.amendTransaction);
			m.connect("ec_amt", "onBlur", function(){				
				var oriEcAmt = d.number.parse(dj.byId("org_ec_amt").get("displayedValue")),
					newEcAmt = d.number.parse(dj.byId("ec_amt").get("displayedValue"));
			if(!isNaN(newEcAmt))
			{
				if(oriEcAmt > newEcAmt)
					{
						dj.byId("dec_amt").set('value',oriEcAmt - newEcAmt);
						dj.byId("dec_amt").set("disabled", false);
						dj.byId("inc_amt").set("disabled", true);
						dj.byId("inc_amt").set("value", "");
					}
				if(oriEcAmt < newEcAmt)
					{
						dj.byId("inc_amt").set('value', newEcAmt - oriEcAmt);
						dj.byId("inc_amt").set("disabled", false);
						dj.byId("dec_amt").set("disabled", true);
						dj.byId("dec_amt").set("value", "");
					}
				if(oriEcAmt === newEcAmt)
				{
					dj.byId("inc_amt").set("value", "");
					dj.byId("inc_amt").set("disabled", false);
					dj.byId("dec_amt").set("value", "");
					dj.byId("dec_amt").set("disabled", false);					
				}
			}
				if(d.number.parse(dj.byId("ec_amt").get("displayedValue")) <= 0)
				{
					m.showTooltip(m.getLocalization('valueShouldBeGreaterThanZero',[ dj.byId("ec_amt").get("displayedValue")]), d.byId("ec_amt"), [ 'after' ],5000);
					misys.dialog.show("ERROR", dj.byId("ec_amt").invalidMessage, "", function(){
						dj.byId("dec_amt").set("value", "");
						dj.byId("inc_amt").set("value", "");
						dj.byId("dec_amt").set("disabled", false);
						dj.byId("inc_amt").set("disabled", false);
						dj.byId("ec_amt").set("state","Error");
					});
					return false;
				}
				if(isNaN(d.number.parse(dj.byId("ec_amt").get("displayedValue"))))
				{
					dj.byId("dec_amt").set("value", "");
					dj.byId("inc_amt").set("value", "");
					dj.byId("dec_amt").set("disabled", false);
					dj.byId("inc_amt").set("disabled", false);
					dj.byId("ec_amt").set("state","Error");
					return false;
				}
				return true;
			});
			m.connect("license_lookup","onClick", function(){
				m.getLicenses("ec");
			});
			m.connect("inco_term_year", "onChange",m.getIncoTerm);
			m.connect("inco_term_year", "onChange", function(){
				m.toggleFields(this.get("value"), null, ["inco_term"], false, true);
			});
			m.connect("inco_term", "onChange", function(){
				m.toggleFields(this.get("value"), null, ["inco_place"], false, false);
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
				else if(this.get("value")==="03"){
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
			
			m.connect("protest_non_accpt", "onClick", m.disableNonAcceptanceFields);
			m.connect("accpt_defd_flag", "onClick", m.disableNonAcceptanceFields);
			/*m.connect("tenor_days", "onBlur", m.calcMaturityDate);
			m.connect("tenor_period", "onBlur", m.calcMaturityDate);
			m.connect("tenor_from_after", "onBlur", m.calcMaturityDate);
			m.connect("tenor_base_date", "onBlur", m.calcMaturityDate);*/
			m.connect("tenor_days_type", "onChange",function(){
				m.toggleFields((this.get("value") === "O"), null, ["tenor_type_details"]);	
			});
			m.connect("tenor_type_1", "onClick",  m.toggleAllTenorFields);
			m.connect("tenor_type_2", "onClick", m.toggleAllTenorFields);
			m.connect("tenor_type_3", "onClick", m.toggleAllTenorFields);
			
			m.connect("tenor_maturity_date", "onBlur", function(){
				var termCodeValue = dj.byId("term_code") ? dj.byId("term_code").get("value") : "";
				if((termCodeValue === "02" || termCodeValue === "04") && dj.byId("tenor_maturity_date"))
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
				m.toggleRequired(dojo.query(labl)[0].innerHTML = m.getLocalization("tenorPeriod"), false);	
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
			m.setCurrency(dj.byId("ec_cur_code"),
					["inc_amt", "dec_amt", "org_ec_amt", "ec_amt","tnx_amt"]);
			m._config.isBank = false;
			dj.byId("tenor_maturity_date").set("disabled", true);
			if(dj.byId("inc_amt") && !isNaN(dj.byId("inc_amt").get("value")))
			{
				dj.byId("dec_amt").set("disabled", true);
			}
			else if(dj.byId("dec_amt") && !isNaN(dj.byId("dec_amt").get("value")))
			{
				dj.byId("inc_amt").set("disabled", true);
			}
			m.populateGridOnLoad("ec");
			
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
					m.toggleRequired("tenor_maturity_date", true);

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
						m.toggleRequired(dojo.query(labl)[0].innerHTML = m.getLocalization("tenorPeriod"), false);	
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
					m.toggleRequired("tenor_maturity_date", true);
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
						m.toggleRequired(dojo.query(labl)[0].innerHTML = m.getLocalization("tenorPeriod"), false);	
					}
					else if(dj.byId("tenor_days") && dj.byId("tenor_days").get("value"))
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
						m.toggleRequired("tenor_days", false);
						m.toggleRequired("tenor_period", false);
						m.toggleRequired("tenor_from_after", false);
						m.toggleRequired("tenor_maturity_date", false);
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
				dj.byId("tenor_type_1").set("disabled", true);
				dj.byId("tenor_type_2").set("disabled", true);
				dj.byId("tenor_type_3").set("disabled", true);
				dj.byId("tenor_days").set("disabled", true);
				dj.byId("tenor_desc").set("disabled", true);
				dj.byId("tenor_period").set("disabled", true);
				dj.byId("tenor_from_after").set("disabled", true);
				dj.byId("tenor_days_type").set("disabled", true);
				dj.byId("tenor_type_details").set("disabled", true);
				dj.byId("tenor_base_date").set("disabled", true);	
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
			var returnValue = _updateDocumentSection();
	
			if(returnValue){
				
				//General validation: validate against EC amount which should be greater than zero
				if(dj.byId("ec_amt"))
				{
					if(!m.validateAmount((dj.byId("ec_amt"))?dj.byId("ec_amt"):0))
					{
						m._config.onSubmitErrorMsg =  m.getLocalization("amountcannotzero");
						dj.byId("dec_amt").set("value", "");
						dj.byId("dec_amt").onBlur();
						return false;
					}
				}
				
				returnValue = m.validateLSAmtSumAgainstTnxAmt("ec");				
			}
			return returnValue;
		},
		
		beforeSubmit : function() {
			m.updateSubTnxTypeCode("ec");
		}
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.trade.amend_ec_client');