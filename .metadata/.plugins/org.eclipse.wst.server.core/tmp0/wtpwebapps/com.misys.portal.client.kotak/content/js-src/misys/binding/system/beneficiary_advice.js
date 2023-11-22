dojo.provide("misys.binding.system.beneficiary_advice");

dojo.require("dijit.form.Form");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.CheckBox");
dojo.require("dijit.layout.ContentPane");
dojo.require("dijit.form.FilteringSelect");
dojo.require("misys.widget.Dialog");
dojo.require("misys.system.widget.Customers");
dojo.require("misys.system.widget.BeneficiaryAdvicesTemplateColumns");
dojo.require("misys.common");
dojo.require("misys.form.common");
dojo.require("misys.validation.common");
dojo.require("misys.form.PercentNumberTextBox");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {
	
	"use strict"; // ECMA5 Strict Mode
	
	function _checkAllCustomers() {
		// summary: Show and Hide the Customers selection grid based on checkbox selection
		var customers = d.byId("customers-section");
		if(dj.byId("all_entities").get("checked"))
		{
			dojo.style(customers,"display","none");
			var customersGrid = dj.byId("customers");
		}
		else
		{
			dojo.style(customers,"display","block");
		}
	}
	
	function _validateCustomerPopup(){
		// summary: Validates the Customers Dialog for mandatory fields
		
		dj.byId("customerOkButton").set("disabled", true);
		//var mandatoryFields = ["customer_entity","customer_abbv_name","customer_name"],
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
			d.forEach(mandatoryFields, function(id){
				field = dj.byId(id);
				if(field){
					value = field.get("value");
					if(!value || field.state === "Error"){
						field.state = "Error";
						field._setStateClass();
						dj.setWaiState(field.focusNode, "invalid", "true");
					}
				}
			});
			return false;
		} else {
			dj.byId("customer-dialog-template").gridMultipleItemsWidget.updateData();
			dj.byId("customers").dialog.hide();
			return true;
		}
	}
	
	function _validateColumnsPopup(){
		// summary: Validates the Columns Dialog for mandatory fields
		
		dj.byId("columnOkButton").set("disabled", true);
		var mandatoryFields = ["column_label","column_type","column_alignment","column_width"],
			valid = false,
			field, value;
		if(dj.byId("column_type").get("value") === "03")
		{
			mandatoryFields = ["column_label","column_type","column_alignment"];
		}
		
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
		
		dj.byId("columnOkButton").set("disabled",false);
		if(!valid){
			d.forEach(mandatoryFields, function(id){
				field = dj.byId(id);
				if(field){
					value = field.get("value");
					if(!value || field.state === "Error"){
						field.state = "Error";
						field._setStateClass();
						dj.setWaiState(field.focusNode, "invalid", "true");
					}
				}
			});
			return false;
		} else {
			dj.byId("column-dialog-template").gridMultipleItemsWidget.updateData();
			dj.byId("columns").dialog.hide();
			return true;
		}
	}
	
	function _validateColumnExists()
	{
		console.debug("[beneficiary_advice_templates] Start : _validateColumnExists");
		var grid = dj.byId("columns-grid");
		var field = dj.byId("column_label");
		console.debug("[beneficiary_advice_templates] Inside : _validateColumnExists, beneAdvColumnsDialogStoreId = ",m._config.beneAdvColumnsDialogStoreId);
		if(grid && grid.store && grid.store._arrayOfAllItems)
		{
			d.forEach(grid.store._arrayOfAllItems,function(node){
				var nodeLabel = (dojo.isArray(node.label) ? node.label[0] : node.label);
				var storeId = (dojo.isArray(node.store_id) ? node.store_id[0] : node.store_id);
				if(nodeLabel)
				{
					var existingName = nodeLabel.replace(/\s/g,'');
					var newName = field.get("value").replace(/\s/g,'');
					if(m._config && m._config.beneAdvColumnsDialogStoreId)
					{
						if(storeId && storeId !== m._config.beneAdvColumnsDialogStoreId && existingName === newName)
						{
							console.debug("[beneficiary_advice_templates] Inside : storeIds are not same and labels are duplicated hence error");
							m.showTooltip(m.getLocalization("beneAdvColumnExists"),
									field.domNode, ["above","before"]);
							field.state = "Error";
							field._setStateClass();
							dj.setWaiState(field.focusNode, "invalid", "true");
						}
					}
					else
					{
						if(existingName === newName)
						{
							console.debug("[beneficiary_advice_templates] Inside : labels are duplicated hence error");
							m.showTooltip(m.getLocalization("beneAdvColumnExists"),
									field.domNode, ["above","before"]);
							field.state = "Error";
							field._setStateClass();
							dj.setWaiState(field.focusNode, "invalid", "true");
						}
					}
				}
			});
		}
		console.debug("[beneficiary_advice_templates] End : _validateColumnExists");
	}
	
	// Public functions & variables follow
	d.mixin(m, {
		bind : function() {
			m.connect("customerOkButton", "onMouseUp", _validateCustomerPopup);
			m.connect("all_entities", "onClick", _checkAllCustomers);
			m.connect("columnOkButton", "onMouseUp",_validateColumnsPopup);
			m.connect("column_type", "onChange",function(){
				dj.byId("column_type_label").set("value",dj.byId("column_type").get("displayedValue"));
				if(dj.byId("column_type").get("value") === "03")
				{
					dj.byId("column_width").set("value","");
					dj.byId("column_width").set("required",false);
					dj.byId("column_width").set("readOnly",true);
				}
				else
				{
					dj.byId("column_width").set("required",true);
					dj.byId("column_width").set("readOnly",false);
				}
				
				if(dj.byId("column_type").get("value") === "01")
				{
					dj.byId("column_width").set("constraints",{min:5});
				}
				else
				{
					dj.byId("column_width").set("constraints",{min:1});
				}
				
			});
			m.setValidation("column_label", m.validateAlphaNumericBeneAdv);
			m.connect("column_label", "onBlur",_validateColumnExists);
			m.connect(dj.byId("columns").dialog, "onHide",function(){
				if(misys._config && misys._config.beneAdvColumnsDialogStoreId)
				{
					misys._config.beneAdvColumnsDialogStoreId = null;
				}
			});
		},
		onFormLoad : function(){
			_checkAllCustomers();
		},
		beforeSubmitValidations : function(){
			var columnsGrid = dj.byId("columns").grid;
			if (!columnsGrid || columnsGrid.rowCount < 1) 
			{
				m._config.onSubmitErrorMsg = m.getLocalization("columnsMandatory");
				return false;
			}
			if(!dj.byId("all_entities").get("checked"))
			{
				var customersGrid = dj.byId("customers").grid;
				if (!customersGrid || customersGrid.rowCount < 1) 
				{
					m._config.onSubmitErrorMsg = m.getLocalization("associatedCustomersMandatory");
					return false;
				}
			}
			return true;
		},
		validateAlphaNumericBeneAdv : function(){
				//  summary:
			    //       Validates that no invalid characters and spaces are present.
				
			var strValidCharacters = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_ ";
			var character;
			var isValid = d.every(this.get("value"), function(theChar){
				character = theChar;
				return (strValidCharacters.indexOf(theChar) < 0) ? false : true;
			});
			
			if(!isValid) {
				this.invalidMessage = m.getLocalization("illegalCharError", [ character ]);
			}
	
			return isValid;
		}
		
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.system.beneficiary_advice_client');