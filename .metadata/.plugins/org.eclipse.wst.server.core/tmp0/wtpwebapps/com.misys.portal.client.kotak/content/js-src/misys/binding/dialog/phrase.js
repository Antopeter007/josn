dojo.provide("misys.binding.dialog.phrase");

dojo.require("misys.form.common");
dojo.require("misys.validation.common");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.CheckBox");
dojo.require("dijit.layout.ContentPane");
dojo.require("dojo.data.ItemFileReadStore");
dojo.require("misys.form.SimpleTextarea");
dojo.require("misys.editor.plugins.ProductFieldChoice");


(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {
	"use strict"; // ECMA5 Strict Mode
	
	/**
	 * Method sets the category list on the basis of product code selected
	 */
	function _changeCategoryList()
	{
		var productCode = dj.byId("popup_product_code").get("value"), 
			existingCategoryWidget = dj.byId("popup_category"), 
			categoryStore = m._config.productCategoryMap[productCode];

		// Remove the existing Product Type
		if(!misys._config.isModified)
		{
			existingCategoryWidget.set("value", "");
		}
			
		if(productCode !== "")
		{
			if (categoryStore)
			{
				// Load sub product items based on the newly selected Area (sorted by
				// name)
				existingCategoryWidget.store = new dojo.data.ItemFileReadStore(
				{
					data :
					{
						identifier : "value",
						label : "name",
						items : categoryStore
					}
				});
				existingCategoryWidget.fetchProperties =
				{
					sort : [
					{
						attribute : "value"
					} ]
				};
			}
			else
			{
				categoryStore = m._config.productCategoryMap["ALL"];
				existingCategoryWidget.store = new dojo.data.ItemFileReadStore(
				{
					data :
					{
						identifier : "value",
						label : "name",
						items : categoryStore
					}
				});
				existingCategoryWidget.fetchProperties =
				{
					sort : [
					{
						attribute : "value"
					} ]
				};
			}
		}
	}
	
	/**
	 * Method sets the product list on the basis of phrase type selected
	 */
	function _changeProductList()
	{

		var phraseType = dj.byId("popup_phrase_type").get("value"), 
			existingProductSelectWidget = dj.byId("popup_product_code"), 
			productDataStore = m._config.phraseTypesProductMap[phraseType];

		// Remove the existing product and sub product entries
		if(!misys._config.isModified)
		{
			existingProductSelectWidget.set("value", "");
		}

		if (productDataStore)
		{
			// Load sub product items based on the newly selected Area (sorted by
			// name)
			existingProductSelectWidget.store = new dojo.data.ItemFileReadStore(
			{
				data :
				{
					identifier : "value",
					label : "name",
					items : productDataStore
				}
			});
			existingProductSelectWidget.fetchProperties =
			{
				sort : [
				{
					attribute : "name"
				} ]
			};
		}
	}
	
	function _loadCandidateResources(productCode) {
		
		d.require("misys.report.definitions.report_all_candidates");
		
		// LC
		d.require("misys.report.definitions.report_lc_phrase_candidate");
		initialiseProductArrays("lc");
		
		// SI
		d.require("misys.report.definitions.report_si_phrase_candidate");
		initialiseProductArrays("si");
	}
	
	/**
	 * Get the rich text editor if dynamic phrase is selected
	 */
	function _getRTE()
	{
		var phraseType = dj.byId("popup_phrase_type");
		var productCode = dj.byId("popup_product_code")? dj.byId("popup_product_code").get("value") : "" ;
		var staticEditorDiv = d.byId("static-text-editor");
		var richTextEditorDiv = d.byId("rich-text-editor");
		if(phraseType && phraseType.get("value") === "02" && productCode !== "")
		{
			
			_loadCandidateResources(productCode);
			createRteEditor(productCode+"Tnx","dynamic_text");
			m.animate("fadeOut", staticEditorDiv);
			m.animate("fadeIn", richTextEditorDiv);
			dj.byId("static_text").set("required",false);
		}
		else
		{
			m.animate("fadeOut", richTextEditorDiv);
			m.animate("fadeIn", staticEditorDiv);
			dj.byId("dynamic_text")?dj.byId("dynamic_text").set("required",false):"";
		}
	}
	
	/**
	 * Create the rich text editor for the product code selected
	 */
	function createRteEditor(productCode,editorId) 
	{
		var editor = dj.byId(editorId);
		if (!editor) {
			var attachPoint = d.byId(editorId);
			var	rteContent = d.byId("rteContent").innerHTML;
				
			editor = new dj.Editor({
				id:editorId,
				name:editorId,
				rows:"13",
				cols:"40",
				maxSize:"300",
				plugins:[
					/*"undo", "redo", "|", "bold", "italic", "underline", "strikethrough", "|",
					"insertOrderedList", "insertUnorderedList", "|",
					"indent", "outdent", "|",
					"justifyLeft", "justifyRight", "justifyCenter", "justifyFull", "||",*/
					/*{name: "dijit._editor.plugins.FontChoice", command: "fontName"},*/
					{name: "misys.editor.plugins.ProductFieldChoice", command: "misysEditorPluginsProductFieldChoice", product: productCode}
					]
			}, attachPoint);
			
			rteContent = rteContent.replace(/&lt;/g, "<");
			rteContent = rteContent.replace(/&gt;/g, ">");
			rteContent = rteContent.replace(/&amp;/g, "&");
			rteContent = rteContent.replace(/&quot;/g, '"');
			editor.set("value", rteContent ? rteContent : "");
		}
	}
	// Public functions & variables follow
	d.mixin(m.dialog, {
		bind : function() {
			m.setValidation("popup_abbv_name", m.validateCharactersExcludeSpace);
			m.setValidation("popup_description", m.validateBlackListChar);
			m.setValidation("static_text", m.validateBlackListChar);			
			m.connect("popup_phrase_type", "onChange", function() {
				_changeProductList();
			});
			m.connect("popup_product_code", "onChange", _getRTE);
			m.connect("popup_product_code", "onChange", _changeCategoryList);
		},
		
		onFormLoad : function(){
			if(dj.byId("popup_phrase_type") && dj.byId("popup_phrase_type").get("value")==="02")
			{
				var staticEditorDiv = d.byId("static-text-editor");
				var richTextEditorDiv = d.byId("rich-text-editor");
				m.animate("fadeOut", staticEditorDiv);
				m.animate("fadeIn", richTextEditorDiv);
				dj.byId("static_text").set("required",false);
			}
			_changeProductList();
			_changeCategoryList();
		},
		
		beforeSaveValidations : function() {
			m.setValidation("popup_abbv_name", m.validateCharactersExcludeSpace);
			m.setValidation("popup_description", m.validateBlackListChar);
			m.setValidation("static_text", m.validateBlackListChar);			
			if((dj.byId("phrase_type") && dj.byId("phrase_type").get("value")==="02" && dj.byId("dynamic_text") && dj.byId("dynamic_text").get("value") === "")) {
				m._config.onSubmitErrorMsg = m.getLocalization("dynamicTextEmptyError");
				return false;
			}
			else if(dj.byId("phrase_type") && dj.byId("phrase_type").get("value")==="01" && dj.byId("static_text") && dj.byId("static_text").get("value") === "" ) {
				m._config.onSubmitErrorMsg = m.getLocalization("dynamicTextEmptyError");
				return false;
			}
			else{
				return true;
			}
		},
		
		beforeSubmitValidations : function() {
			m.setValidation("popup_abbv_name", m.validateCharactersExcludeSpace);
			m.setValidation("popup_description", m.validateBlackListChar);
			m.setValidation("static_text", m.validateBlackListChar);			
			if((dj.byId("phrase_type") && dj.byId("phrase_type").get("value")==="02" && dj.byId("dynamic_text") && dj.byId("dynamic_text").get("value") === "")) {
				m._config.onSubmitErrorMsg = m.getLocalization("dynamicTextEmptyError");
				return false;
			}
			else if(dj.byId("phrase_type") && dj.byId("phrase_type").get("value")==="01" && dj.byId("static_text") && dj.byId("static_text").get("value") === "" ) {
				m._config.onSubmitErrorMsg = m.getLocalization("dynamicTextEmptyError");
				return false;
			}
			else{
				return true;
			}
		}
	});
	
	
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.dialog.phrase_client');