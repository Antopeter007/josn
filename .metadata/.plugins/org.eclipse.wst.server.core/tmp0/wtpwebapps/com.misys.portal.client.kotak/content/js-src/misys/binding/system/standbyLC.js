dojo.provide("misys.binding.system.standbyLC");

dojo.require("dijit.form.Form");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.CheckBox");
dojo.require("dijit.layout.ContentPane");
dojo.require("dijit.form.FilteringSelect");
dojo.require("misys.form.MultiSelect");
dojo.require("dijit.Editor");
dojo.require("dijit._editor._Plugin");
dojo.require("dijit._editor.plugins.AlwaysShowToolbar");
dojo.require("dijit._editor.plugins.FontChoice");  // 'fontName','fontSize','formatBlock'
dojo.require("dijit._editor.plugins.TextColor");
dojo.require("dijit._editor.plugins.LinkDialog");
dojo.require("dojox.editor.plugins.ToolbarLineBreak");
dojo.require("misys.editor.plugins.ProductFieldChoice");
dojo.require("misys.form.SimpleTextarea");
dojo.require("dojo.data.ItemFileWriteStore");
dojo.require("misys.grid.DataGrid");
dojo.require("misys.widget.Dialog");
dojo.require("misys.form.static_document");
dojo.require("misys.system.widget.Customers");
dojo.require("misys.report.widget.Column");
dojo.require("misys.common");
dojo.require("misys.form.common");
dojo.require("misys.validation.common");


(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {
	
	"use strict"; // ECMA5 Strict Mode

	function _toggleStandbyLCTextType(){
		// summary:
		//		TODO
		
		var documentEditor = d.byId("document-editor"),
			value = this.get("value");
		
		if(value === "02") {
			m.animate("fadeIn", documentEditor, function(){
				_loadCandidateResources();
				m.createRteEditor("SI","si_document");
			});
		}
		else {
			m.animate("fadeOut", documentEditor);
		}
		
		m.toggleFields(value === "02", null,["si_document"]);
		_toggleSpecimenXSL();

		setTimeout(function(){
			var siDocument = dj.byId("si_document");
			if (siDocument) {
				siDocument.focus();
			}
		}, 1000);
	}
	
	function _toggleSpecimenXSL()
	{
		var specimenSection = d.byId("specimen-section"),
			autoSpecimenDiv = d.byId('autoSpecimen-section'),
			standardRadio = dj.byId("text_type_code_1"),
			specimenCheckbox = dj.byId("specimen"),
			autoSpecimenName = dj.byId("auto_specimen_name"),
			specimenName = dj.byId("specimen_name"),
			specimenCheckboxDiv = d.byId("specimen-checkbox-div");
			dj.byId("specimen_name").set("readOnly", true);
		// Standard
		if(standardRadio && standardRadio.get("checked"))
		{
			//m.animate("fadeIn", specimenCheckboxDiv);	
			if(specimenCheckbox && specimenCheckbox.get("checked"))
			{
				autoSpecimenName.set("value", "");
				autoSpecimenName.set("required", false);
				specimenName.set("required", true);
				m.animate("fadeOut", autoSpecimenDiv);
				m.animate("fadeIn", specimenSection);
				m.animate("fadeIn", specimenCheckboxDiv);
			}
			else
			{
				specimenName.set("value", "");
				m.animate("fadeOut", specimenSection);
				m.animate("fadeIn", specimenCheckboxDiv);	
				m.animate("fadeIn", autoSpecimenDiv);
				autoSpecimenName.set("readonly", false);
				autoSpecimenName.set("required", true);
				m.toggleFields(true, null,['auto_specimen_name']);
			}
		}
		// WYSIWYG editor
		else
		{
			autoSpecimenName.set("value", "");
			specimenName.set("value", "");
			
			standardRadio.set("checked", false);
			
			specimenName.set("required", false);
			autoSpecimenName.set("required", false);
			
			m.animate("fadeOut", specimenSection);
			m.animate("fadeOut", autoSpecimenDiv);
			m.animate("fadeOut", specimenCheckboxDiv);	
		}
	}
	
	function _toggleSpecimen(){
		// summary:
		//		TODO
		
		var specimenSection = d.byId("specimen-section"),
			value = this.get("value");
		if(value === "on"){
			m.animate("fadeIn", specimenSection);
		} 
		else {
			m.animate("fadeOut", specimenSection);
		}
		m.toggleFields(value === "on", null,["specimen_name"]);
		_toggleSpecimenXSL();
	}
	
	function _loadCandidateResources() {
		// summary:
		//		TODO
		
		d.require("misys.report.definitions.report_all_candidates");
		d.require("misys.report.definitions.report_audit_candidate");
		d.require("misys.report.definitions.report_lt_candidate");
		// BG
		d.require("misys.report.definitions.report_bg_candidate");
		initialiseProductArrays("bg");
		
		// BN
		d.require("misys.report.definitions.report_bn_candidate");
		initialiseProductArrays("bn");
		
		// EC
		d.require("misys.report.definitions.report_ec_candidate");
		initialiseProductArrays("ec");
		
		// EL
		d.require("misys.report.definitions.report_el_candidate");
		initialiseProductArrays("el");
		
		// FT
		d.require("misys.report.definitions.report_ft_candidate");
		initialiseProductArrays("ft");

		// IC
		d.require("misys.report.definitions.report_ic_candidate");
		initialiseProductArrays("ic");
		
		// IN
		d.require("misys.report.definitions.report_in_candidate");
		initialiseProductArrays("in");
		
		// IP
		d.require("misys.report.definitions.report_ip_candidate");
		initialiseProductArrays("ip");
		
		// IR
		d.require("misys.report.definitions.report_ir_candidate");
		initialiseProductArrays("ir");
		
		// LC
		d.require("misys.report.definitions.report_lc_candidate");
		initialiseProductArrays("lc");
		
		// LI
		d.require("misys.report.definitions.report_li_candidate");
		initialiseProductArrays("li");
		
		// RI
		d.require("misys.report.definitions.report_ri_candidate");
		initialiseProductArrays("ri");
		
		// SE
		d.require("misys.report.definitions.report_se_candidate");
		initialiseProductArrays("se");
		
		// LT
		initialiseProductArrays("lt");
		
		// PO
		d.require("misys.report.definitions.report_po_candidate");
		initialiseProductArrays("po");
		
		// SG
		d.require("misys.report.definitions.report_sg_candidate");
		initialiseProductArrays("sg");
		
		// SI
		d.require("misys.report.definitions.report_si_candidate");
		initialiseProductArrays("si");
		
		// SO
		d.require("misys.report.definitions.report_so_candidate");
		initialiseProductArrays("so");
		
		// SR
		d.require("misys.report.definitions.report_sr_candidate");
		initialiseProductArrays("sr");
		
		// TF
		d.require("misys.report.definitions.report_tf_candidate");
		initialiseProductArrays("tf");
		
		// TU
		d.require("misys.report.definitions.report_tu_candidate");
		initialiseProductArrays("tu");
		
		// BG Template
		d.require("misys.report.definitions.report_bg_template_candidate");
		initialiseProductArrays("bg_template");
		
		// EC Template
		d.require("misys.report.definitions.report_ec_template_candidate");
		initialiseProductArrays("ec_template");
		
		// FT Template
		d.require("misys.report.definitions.report_ft_template_candidate");
		initialiseProductArrays("ft_template");
		
		// LC Template
		d.require("misys.report.definitions.report_lc_template_candidate");
		initialiseProductArrays("lc_template");
			
		// LT Template
		d.require("misys.report.definitions.report_lt_template_candidate");
		initialiseProductArrays("lt_template");
		
		// PO Template
		d.require("misys.report.definitions.report_po_template_candidate");
		initialiseProductArrays("po_template");
		
		// SI Template
		d.require("misys.report.definitions.report_si_template_candidate");
		initialiseProductArrays("si_template");
	}
	
	function _checkStandardGuarantee() {
		// summary:
		//		TODO
		
		var customers = d.byId("customers-section");
		customers.style.display = (this.get("checked") ? "none" : "block");
		if (this.get("checked")) {
			var customersGrid = dj.byId("customers");
			if (customersGrid) {
				customersGrid.clear();
			}
		}
	}
	
	function _validateCustomerPopup(){
		// summary:
		//		TODO
		
		dj.byId("customerOkButton").set("disabled", true);
		var mandatoryFields = ["customer_abbv_name","customer_name"],
			valid = false,
			field, value;
		
		valid = d.every(mandatoryFields, function(id){
			field = dj.byId(id);
			if(field){
				value = field.get("value");
				if(!value || field.state === "Error"){
					m.showTooltip(m.getLocalization("mandatoryFieldsError"),
							field.domNode, ["above","before"]);
					field.state = "Error";
					field._setStateClass();
					dj.setWaiState(field.focusNode, "invalid", "true");
					return false;
				}
			}
			return true;
		});
		
		dj.byId("customerOkButton").set("disabled",false);
		if(!valid){
			return false;
		} else {
			dj.byId("customer-dialog-template").gridMultipleItemsWidget.updateData();
			dj.byId("customers").dialog.hide();
			return true;
		}
	}
	
	// Public functions & variables follow
	d.mixin(m, {
		bind : function() {
			m.setValidation("customer_abbv_name", m.validateCharacters);
			m.connect("customerOkButton", "onMouseUp", _validateCustomerPopup);
			m.connect("staticDocumentAddButton", "onClick", m.openStaticDocumentDialog);
		},
		
		resetStaticDocument : function() {
			dj.byId("staticDocumentUploadDialog").hide();
			dj.byId("static_title").reset();
			dj.byId("static_file").reset();
		},
		onFormLoad : function(){
			var autoSpecimenDiv = d.byId('autoSpecimen-section'),
			autoSpecimenName = dj.byId("auto_specimen_name"),
			specimenCheckboxDiv = d.byId("specimen-checkbox-div"),
			specimenSection = d.byId("specimen-section");
			autoSpecimenName.set("value", "");
			autoSpecimenName.set("required", false);
			if(dj.byId("text_type_code_1").get("checked") && dj.byId("specimen").get("checked"))
			{
				m.animate("fadeOut", autoSpecimenDiv);
				m.animate("fadeIn", specimenSection);
				m.animate("fadeIn", specimenCheckboxDiv);
			}
			else if(dj.byId("text_type_code_1").get("checked") && !(dj.byId("specimen").get("checked")))
			{
				m.animate("fadeIn", autoSpecimenDiv);
				m.animate("fadeOut", specimenSection);
				m.animate("fadeIn", specimenCheckboxDiv);
				autoSpecimenName.set("value",autoSpecimenName._resetValue);
			}
			else if(dj.byId("text_type_code_2").get("checked"))
			{
				m.animate("fadeOut", autoSpecimenDiv);
				m.animate("fadeOut", specimenSection);
				m.animate("fadeOut", specimenCheckboxDiv);
			}
			
		},
		beforeSubmitValidations : function(){
			if(dj.byId("text_type_code_2") && dj.byId("text_type_code_2").get("checked"))
			{
				var	textValue = dj.byId("si_document").get("value");
				if(textValue === "")
				{
					console.debug("[misys.binding.system.standbyLC] Empty Text in Editor = ",
							m.getLocalization("enterValueInWYSIWYGEditor"));					
					m._config.onSubmitErrorMsg =  m.getLocalization("enterValueInWYSIWYGEditor");
					return false;
				}
			}
			return true;
		}
	});
	
	d.ready(function(){
		//  summary:
	    //          Events to perform on page load.
		//			TODO Because of the manner in which the page and
		//          widgets have been implemented with mutual dependencies, it breaks the loading pattern
		//          established in other pages, hence this widget ready call. This should be addressed.
		
		// TODO Refactor to remove this
		dojo.parser.parse("edit");
		
		m.animate("fadeIn", d.byId("specimen-checkbox-div"));
		
		m.connect("text_type_code_1", "onClick", _toggleStandbyLCTextType);
		m.connect("text_type_code_2", "onClick", _toggleStandbyLCTextType);
		m.connect("standard", "onClick", _checkStandardGuarantee);
		m.connect("specimen", "onClick", _toggleSpecimen);
		
		var standardField = dj.byId("standard");
		if(standardField && standardField.get("checked")) {
			standardField.onClick();
		}
		

		// Default the text type to Standard if no choice has been made yet
		if (!dj.byId("text_type_code_2").get("checked")) {
			dj.byId("text_type_code_1").set("checked", true);
		}
		
		// Open the Auto generate specimen section editor,if Auto Generate Specimen is checked
		/*		var standardRadioButton = dj.byId('text_type_code_1').get('checked');
		var specimen1 = dj.byId("specimen");
		
		var displayAutoSpecimen = dj.byId('text_type_code_1').get('checked') &&  dj.byId("specimen").get('checked');
		d.style('autoSpecimen-section', 'display', displayAutoSpecimen ? 'block' : 'none');
		m.toggleFields(displayAutoSpecimen, null,['auto_specimen_name']);
*/		
		// Open the specimen section editor section if Specimen is checked
		
		var displayRTE = dj.byId("text_type_code_2").get("checked");
		if(displayRTE)
		{
			d.style("document-editor", "display","block");
			m.toggleFields(displayRTE, null,["si_document"]);
			if (displayRTE) {
				_loadCandidateResources();
				m.createRteEditor("SI","si_document");
			}
		}
		else
		{
			var displaySpecimenSection = dj.byId('text_type_code_1').get('checked');
			var specimen = dj.byId("specimen");
			var specimen_name = dj.byId("specimen_name");
			var auto_specimen_name = dj.byId("auto_specimen_name");
			
			//If auto specimen value is not null, then set auto specimen section
			if(auto_specimen_name.value)
			{
				d.style('autoSpecimen-section', 'display','block');
				m.toggleFields(true, null,['auto_specimen_name']);
			}
			else 
			{
				specimen.set("checked", displaySpecimenSection);
				d.style("specimen-section", "display", displaySpecimenSection ? "block" : "none");
				m.toggleFields(displaySpecimenSection, null,["specimen_name"]);
				dj.byId("specimen_name").set("readOnly", true);
			}			
			
		}
		//_toggleSpecimenXSL();
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.system.standbyLC_client');