dojo.provide("misys.binding.system.linked_product_select");

dojo.require("dojo.data.ItemFileReadStore");
dojo.require("dijit.form.FilteringSelect");

(function(/* Dojo */d, /* Dijit */dj, /* Misys */m)
{

	"use strict"; // ECMA5 Strict Mode

	function _setInitialFilters()
	{
		dj.byId('BusinessArea').set("value","*");
	}
	
	
	
	
	// Client needs a custom version of this method.
	// We keep separate lists of product codes and sub product
	// but don't show them to the user, who has the impression
	// that sub products and products are the same thing.
	// on the storage and in the validation though the difference
	// still apply.
	function _changeSubProductList(selectedProduct)
	{
		var existingSubProductSelectWidget = dj.byId('sub_product_code'),
			selectedProductKey = selectedProduct == "*" ? "ALL" : selectedProduct,
			subProductsData = m._config.SubProductsCollection[selectedProductKey] ;

		// Load product items based on the newly selected Area (sorted by name)
  		existingSubProductSelectWidget.store = new dojo.data.ItemFileReadStore(
		{
			data :
			{
				identifier : "value",
				label : "name",
				items : subProductsData
			}
		});
  		existingSubProductSelectWidget.fetchProperties =
		{
			sort : [{attribute : "name"}],
			queryOptions : {deep: false}
		};
		dj.byId('sub_product_code').set("value", "*");
	}
	
	function _addSortedProductList()
	{
		var existingProductSelectWidget = dj.byId('product_code');
		var	productsData = m._config.ProductsCollection;

		// Load product items based on the newly selected Area (sorted by name)
		existingProductSelectWidget.store = new dojo.data.ItemFileReadStore(
		{
			data :
			{
				identifier : "value",
				label : "name",
				items : productsData
			}
		});
		existingProductSelectWidget.fetchProperties =
		{
			sort : [{attribute : "name"}],
			queryOptions : {deep: false}
		};
		dj.byId('product_code').set("value", "*");
	}
	//
	// Public functions & variables
	//
	d.mixin(m,
	{
		bind : function()
		{
			m.connect("product_code", "onChange", _changeSubProductList);
		},
		onFormLoad : function()
		{
			_addSortedProductList();
		}
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.system.linked_product_select_client');