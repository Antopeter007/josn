dojo.provide("misys.binding.system.license");

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
dojo.require("misys.system.widget.LicenseProducts");
dojo.require("misys.report.widget.Column");
dojo.require("misys.common");
dojo.require("misys.form.common");
dojo.require("misys.validation.common");


(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {
	
	"use strict"; // ECMA5 Strict Mode
	
	function _togglePrincipalLabelByLicenseType(){
		var licenseType = dj.byId("ls_type").get("value");
		if(licenseType === "02")
		{
			dj.byId("principal_label").set("value",m.getLocalization("exporter"));
		}
		else if(licenseType === "01")
		{
			dj.byId("principal_label").set("value",m.getLocalization("applicant"));
		}
		else if(licenseType === "03")
		{
			dj.byId("principal_label").set("value",m.getLocalization("payer"));
		}
	}
	
	function _toggleNonPrincipalLabelByLicenseType(){
		var licenseType = dj.byId("ls_type").get("value");
		if(licenseType === "02")
		{
			dj.byId("non_principal_label").set("value",m.getLocalization("consignee"));
		}
		else if(licenseType === "01")
		{
			dj.byId("non_principal_label").set("value",m.getLocalization("beneficiary"));
		}
		else if(licenseType === "03")
		{
			dj.byId("non_principal_label").set("value",m.getLocalization("payee"));
		}
	}
	
	function _togglePrincipalDetails(){
		var principalOverride = dj.byId("principal_override");
		var principalLabel = dj.byId("principal_label");
		if(principalOverride && principalLabel)
		{
			if(principalOverride.get("checked"))
			{
				m.toggleRequired(principalLabel, true);
				principalLabel.set("disabled",false);
			}
			else
			{
				_togglePrincipalLabelByLicenseType();
				m.toggleRequired(principalLabel, false);
				principalLabel.set("disabled",true);
			}
		}
		
	}
	
	function _toggleNonPrincipalDetails(){
		var nonPrincipalOverride = dj.byId("non_principal_override");
		var nonPrincipalLabel = dj.byId("non_principal_label");
		if(nonPrincipalOverride && nonPrincipalLabel)
		{
			if(nonPrincipalOverride.get("checked"))
			{
				m.toggleRequired(nonPrincipalLabel, true);
				nonPrincipalLabel.set("disabled",false);
			}
			else
			{
				_toggleNonPrincipalLabelByLicenseType();
				m.toggleRequired(nonPrincipalLabel, false);
				nonPrincipalLabel.set("disabled",true);
			}
		}
		
	}
	
	function _checkValidForAll() {
		
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
	
	function _validateProductPopup(){
		
		var productCode = dj.byId('product_code').get('value'), 
		productCodeKey = (productCode === '*') ? 'ALL' : productCode,
		productTypeCodeStore = m._config.productTypeCodeList[productCodeKey];
		
		dj.byId("productOkButton").set("disabled", true);
		var mandatoryFields, valid = false, field, value;
		if(productTypeCodeStore)
		{
			mandatoryFields = ["product_code","sub_product_code", "product_type_code"];
		}
		else
		{
			mandatoryFields = ["product_code","sub_product_code"];
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
		
		dj.byId("productOkButton").set("disabled",false);
		if(!valid){
			return false;
		} else {
			dj.byId("ls-products-dialog-template").gridMultipleItemsWidget.updateData();
			dj.byId("products").dialog.hide();
			return true;
		}
	}
	
	function _changeProductTypeCode()
	{
		var productCode = dj.byId('product_code').get('value'), 
			existingProductTypetWidget = dj.byId('product_type_code'), 
			productCodeKey = (productCode === '*') ? 'ALL' : productCode,
			productTypeCodeStore = m._config.productTypeCodeList[productCodeKey],
			productTypeCodeHidden = dj.byId('product_type_code_hidden').get('value');

		// Remove the existing Product Type
		if(misys._config.isModified)
		{
			existingProductTypetWidget.set("value", "");
		}
			
		if(productCodeKey !== '')
		{
			if (productTypeCodeStore)
			{
				// Load sub product items based on the newly selected Area (sorted by
				// name)
				existingProductTypetWidget.store = new dojo.data.ItemFileReadStore(
				{
					data :
					{
						identifier : "value",
						label : "name",
						items : productTypeCodeStore
					}
				});
				existingProductTypetWidget.fetchProperties =
				{
					sort : [
					{
						attribute : "value"
					} ]
				};
				m.animate("wipeIn", d.byId("productTypeDiv"));
				m.toggleFields(true, null, ["product_type_code"]);
			}
			else
			{
				m.animate("wipeOut", d.byId("productTypeDiv"));
				existingProductTypetWidget.store = null;
			}
			// if the hidden values are set, the page is in modify mode:
			// set if it is the first time:
			if (productTypeCodeHidden !== '')
			{
				existingProductTypetWidget.set("displayedValue", productTypeCodeHidden);
			}
		}
	}
	
	// Client needs a custom version of this method.
	// We keep separate lists of product codes and sub product
	// but don't show them to the user, who has the impression
	// that sub products and products are the same thing.
	// on the storage and in the validation though the difference
	// still apply.
	function _changeSubProductList()
	{

		var productCode = dj.byId('product_code').get('value'), 
			existingSubProductSelectWidget = dj.byId('sub_product_code'), 
			productCodeKey = (productCode === '*') ? 'ALL' : productCode,
			subProductDataStore = m._config.subProductsCollection[productCodeKey],
			subProductHidden = dj.byId('sub_product_code_hidden').get('value');

		// Remove the existing product and sub product entries
		if(!misys._config.isModified)
		{
			existingSubProductSelectWidget.set("value", "");
		}

		if (subProductDataStore)
		{
			// Load sub product items based on the newly selected Area (sorted by
			// name)
			existingSubProductSelectWidget.store = new dojo.data.ItemFileReadStore(
			{
				data :
				{
					identifier : "value",
					label : "name",
					items : subProductDataStore
				}
			});
			existingSubProductSelectWidget.fetchProperties =
			{
				sort : [
				{
					attribute : "name"
				} ]
			};
		}
		
		// if the hidden values are set, the page is in modify mode:
		// set if it is the first time:
		if (subProductHidden !== '')
		{
			existingSubProductSelectWidget.set("displayedValue", subProductHidden);
		}
		
	}
	
	function _changeProductList()
	{

		var lsType = dj.byId('ls_type').get('value'), 
			existingProductSelectWidget = dj.byId('product_code'), 
			productDataStore = m._config.lsTypesProductMapping[lsType],
			productHidden = dj.byId('product_code_hidden').get('value');

		// Remove the existing product and sub product entries
		existingProductSelectWidget.set("value", "");

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
		
		// if the hidden values are set, the page is in modify mode:
		// set if it is the first time:
		if (productHidden !== '')
		{
			existingProductSelectWidget.set("displayedValue", productHidden);
		}
	}
	
	// Public functions & variables follow
	d.mixin(m, {
		bind : function() {
			m.setValidation("customer_abbv_name", m.validateCharacters);
			m.connect("customerOkButton", "onMouseUp", _validateCustomerPopup);
			m.connect("ls_type", "onChange", _togglePrincipalLabelByLicenseType);
			m.connect("ls_type", "onChange", _toggleNonPrincipalLabelByLicenseType);
			m.connect("addCustomerButton", "onClick", function(){
				dj.byId("customer_abbv_name").set("readOnly",true);
				dj.byId("customer_name").set("readOnly",true);
			});
			m.connect("principal_override", "onClick", _togglePrincipalDetails);
			m.connect("non_principal_override", "onClick", _toggleNonPrincipalDetails);
			m.connect("ls_type", "onChange", function(){
				if(dj.byId("ls_type").get("value") !== '')
				{
					dj.byId("addProductsButton").set("disabled", false);
				}
				else
				{
					dj.byId("addProductsButton").set("disabled", true);
				}
				_changeProductList();
				var productsGrid = dj.byId("products");
				if (productsGrid) {
					productsGrid.clear();
				}
			});
			m.connect("product_code",  "onChange", function(){
					_changeSubProductList();
					if(dj.byId("product_type_code"))
					{
						_changeProductTypeCode();
					}
					else
					{
						m.animate("wipeOut", d.byId("productTypeDiv"));
					}
				});
			m.connect("addProductsButton", "onClick", function(){
				if(dj.byId("product_code").get("value") === '')
				{
					m.animate("wipeIn", d.byId("productTypeDiv"));
					dj.byId('product_type_code').store = null;
					dj.byId('sub_product_code').store = null;
					if(dj.byId('product_type_code_hidden'))
					{
						dj.byId('product_type_code_hidden').set("value", "");
					}
					if(dj.byId('sub_product_code_hidden'))
					{
						dj.byId('sub_product_code_hidden').set("value", "");
					}
				}
			});
			m.connect("productOkButton", "onClick", _validateProductPopup);
			m.connect("product_code",  "onChange", function(){
				dj.byId("product_code_hidden").set("value", dj.byId("product_code").get("displayedValue"));
			});
			m.connect("sub_product_code",  "onChange", function(){
				dj.byId("sub_product_code_hidden").set("value", dj.byId("sub_product_code").get("displayedValue"));
			});
			m.connect("product_type_code",  "onChange", function(){
				dj.byId("product_type_code_hidden").set("value", dj.byId("product_type_code").get("displayedValue"));
			});
			m.connect('ls_name', 'onBlur', m.checkLicenseNameExists);
		},
		
		onFormLoad : function(){
			if(dj.byId("principal_override") && dj.byId("principal_override").get("checked"))
			{
				dj.byId("principal_label").set("disabled",false);
			}
			else
			{
				dj.byId("principal_label").set("disabled",true);
			}
			if(dj.byId("non_principal_override") && dj.byId("non_principal_override").get("checked"))
			{
				dj.byId("non_principal_label").set("disabled",false);
			}
			else
			{
				dj.byId("non_principal_label").set("disabled",true);
			}
			if(dj.byId("ls_type") && dj.byId("ls_type").get("value") !== '')
			{
				dj.byId("addProductsButton").set("disabled", false);
			}
			else
			{
				dj.byId("addProductsButton").set("disabled", true);
			}
			if(dj.byId("ls_operation") && dj.byId("ls_operation").get("value") === 'MODIFY_FEATURES')
			{
				dj.byId("ls_type").set("disabled", true);
				dj.byId("ls_name").set("disabled", true);
			}
			else
			{
				dj.byId("multi_cur").set("checked", true);
				dj.byId("allow_overdraw").set("checked", true);
				dj.byId("allow_multi_ls").set("checked", true);
			}
			_changeProductList();
			_changeSubProductList();
			_changeProductTypeCode();
			
		}
	});
	
	d.ready(function(){
		
		dojo.parser.parse("edit");
		m.connect("valid_for_all", "onClick", _checkValidForAll);
		var validForAll = dj.byId("valid_for_all");
		if(validForAll && validForAll.get("checked")) {
			validForAll.onClick();
		}
		
		
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.system.license_client');