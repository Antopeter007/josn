dojo.provide("misys.binding.system.bo_refid");

dojo.require("dijit.form.Button");
dojo.require("dijit.form.RadioButton");
dojo.require("dijit.form.NumberTextBox");
dojo.require("misys.form.common");
dojo.require("misys.validation.common");
dojo.require("misys.openaccount.widget.ReferenceIds");
dojo.require("misys.openaccount.widget.ReferenceId");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode
	
	var _ftSubProducts = new Array();
	
	function _changeSubProductList()
	{
		var productCode = dj.byId('select_prodcode').get('value');
		console.debug("productCode:" + productCode);
		
		var existingSubProductSelectWidget = dj.byId("select_subprodcode");
		var subProductDataStore = productCode === "FT" ? _ftSubProducts : m._config.subProductsCollection[productCode];
		
		// Not not in the scope anymore
		//if(subProductDataStore && productCode !== "SE" && productCode !== "TF" && subProductDataStore.length === 0)
		if(subProductDataStore && productCode !== "TF" && subProductDataStore.length === 0)	
		{
			m.animate("fadeOut",d.byId("select_subprodcode"));
			m.toggleRequired("select_subprodcode", false);
			dj.byId("select_subprodcode").set("value","");
			dj.byId("select_subprodcode").set("disabled",true);
		}
		else
		{
			m.animate("fadeIn",d.byId("select_subprodcode"));
			m.toggleRequired("select_subprodcode", true);
			dj.byId("select_subprodcode").set("disabled",false);
		}
		
				
		if (subProductDataStore) 
		{
			// Load sub product items based on the newly selected Area (sorted by
			// name)
			existingSubProductSelectWidget.store = new dojo.data.ItemFileReadStore({
				data :{
					identifier : "value",
					label : "name",
					items : subProductDataStore
				}
			});
			existingSubProductSelectWidget.fetchProperties = {
				sort : [{attribute : "name" }]
			};
		}
	}
	
	function _showRef() {
		var multipleRefDiv = d.byId("display_multipleRef"),
			uniqueRefDiv = d.byId("display_uniqueRef"),
			isMultiple = dj.byId("uniqueRef_1").get("checked"),
			callback = function() {
				m.toggleFields(isMultiple, null, ["customer_input_center", "from", "to"]);
				m.toggleFields(!isMultiple, null, ["title"]);
			};
		
		if(isMultiple) {
			m.animate("fadeOut", uniqueRefDiv, function(){
				m.animate("fadeIn", multipleRefDiv, callback);
			});
		} else {
			m.animate("fadeOut", multipleRefDiv, function(){
				m.animate("fadeIn", uniqueRefDiv, callback);
			});
		}
	}
	
	function _filterFTSubProducts(){
		_ftSubProducts = dojo.filter(m._config.subProductsCollection["FT"], function(item){
			return (item.value === "TINT" || item.value === "TTPT");
		});
	}
	
	// Public functions & variables follow
	d.mixin(m, {
		bind : function() {
			m.connect("uniqueRef_1", "onClick", _showRef);
			m.connect("uniqueRef_2", "onClick", _showRef);
			
			m.connect("select_customer_reference", "onChange", function(){
				if (dijit.byId('select_customer_reference') && dijit.byId('select_customer_reference').get('value') !== '') 
				{
					var selectedCustReference = dijit.byId('select_customer_reference').get('value');
					dijit.byId("select_back_office_1").set("value",m._config.backOffice1Values[selectedCustReference].value);
				}
			});
			
			m.setValidation("title", m.validateTitleLength);
			m.setValidation("customer_input_center", m.validateCustomerInputCenterLength);
			m.setValidation("from", m.validateFromTo);
			m.setValidation("to", m.validateFromTo);
			
			m.connect("select_prodcode", "onChange", function(){
				if (dijit.byId('select_prodcode') && dijit.byId('select_prodcode').get('value') !== '') 
				{
					_changeSubProductList();
				}
			});
		},
		
		validateTitleLength : function (){
			if(dj.byId("boRefLength") && (this.get("value").length < dj.byId("boRefLength").get("value") ))
			{
				console.debug("[misys.binding.system.bo_refid] Title's Length = ", dj.byId("title").get("value").length + " -- " + m.getLocalization("titleLength", [dj.byId("boRefLength").get("value")]));
				this.invalidMessage = m.getLocalization("titleLength", [dj.byId("boRefLength").get("value")]);
				return false; 
			}
			return true;
		},
		
		validateCustomerInputCenterLength : function (){
			var customerInputCenter = dijit.byId('customer_input_center').get("value");
			if((customerInputCenter.length != 2))
			{
				console.debug("[misys.binding.system.bo_refid] Customer Input Center's Length = ", customerInputCenter.length + " -- " + m.getLocalization("customerInputCenterLength"));
				this.invalidMessage = m.getLocalization("customerInputCenterLength");
				return false; 
			}
			return misys._validateCharacters(customerInputCenter);
		},
		_validateCharacters : function(value) {
			var strValidCharacters = 
				" 0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
			var character;
			var isValid = d.every(value, function(theChar){
				character = theChar;
				return (strValidCharacters.indexOf(theChar) < 0) ? false : true;
			});
			if(!isValid) {
				dijit.byId('customer_input_center').invalidMessage = m.getLocalization("illegalCharError", [ character ]);
			}
			return isValid;
		},
		validateFromTo : function (){
			var from = dijit.byId('from').get("value");
			var to = dijit.byId('to').get("value");
			
			if(to < from)
			{
				console.debug("[misys.binding.system.bo_refid] From = ", from + " -- To= " + to);
				this.invalidMessage = m.getLocalization("FromTo");
				return false; 
			}
			return true;
		},
		
		onFormLoad : function(){
			_filterFTSubProducts();
		}
		
	});
	
	// Dialog functions
	m.dialog = m.dialog || {};
	d.mixin(m.dialog, {
		
		submitBoRefId : function( /*String*/ dialogId) {
			// summary:
			//		TODO
			
			var dialog = dj.byId(dialogId),
				uniqueRefField = dj.byId("uniqueRef_1");
			
			if(!uniqueRefField.get("checked") && !dj.byId("uniqueRef_2").get("checked")) {
				m.showTooltip(m.getLocalization("mandatoryBORefIDType"),
						uniqueRefField.domNode, ["before"]);
			} else {
				if(dialog && dialog.validate()) {
					dialog.execute();
					misys.isFormDirty = true;
					dialog.hide();
				}
			}
		}, 
		
		closeBoRefId : function( /*String*/ dialogId) {
			// summary:
			//		TODO
			
			var dialog = dj.byId(dialogId);
			if(dialog) {
				m.animate("fadeOut", d.byId("display_multipleRef"), function(){
					m.animate("fadeOut", d.byId("display_uniqueRef"), function(){
						dialog.hide();
					});
				});
			}
		}
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.system.bo_refid_client');