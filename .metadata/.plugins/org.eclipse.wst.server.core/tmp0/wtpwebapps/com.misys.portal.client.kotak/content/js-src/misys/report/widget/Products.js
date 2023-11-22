dojo.provide("misys.report.widget.Products");
dojo.experimental("misys.report.widget.Products"); 

dojo.require("misys.grid.GridMultipleItems");
dojo.require("dojo.data.ItemFileWriteStore");

// our declared class
dojo.declare("misys.report.widget.Products",
        [ misys.grid.GridMultipleItems ],
        // class properties:
        {
		data: { identifier: 'store_id', label: 'store_id', items: [] },
	
        templatePath: null,
        templateString: dojo.byId("products-template").innerHTML,
        dialogId: 'product-dialog-template',
        xmlTagName: 'products',
        xmlSubTagName: 'product',
        
        gridColumns: ['product'],
        
        propertiesMap: {},
        
        layout: [
                 { name: 'Product', field: 'product', formatter: misys.getProductDecode, width: '90%' },
                 { name: ' ', field: 'actions', formatter: misys.grid.formatReportActions, width: '10%' }
                 ],
        
        /*constructor: function(props, node){
			console.debug("[Products] constructor");
    	},
    	
    	postMixInProperties: function(){
			console.debug("[Products] postMixInProperties start");
    		this.inherited(arguments);
			console.debug("[Products] postMixInProperties end");
    	},

    	buildRendering: function(){
			console.debug("[Products] buildRendering start");
    		this.inherited(arguments);
    		
    		//var criteriumItem = new misys.report.widget.Criterium({}, document.createElement("div"));
    		//this.addChild(criteriumItem);
    		
			console.debug("[Products] buildRendering end");
    	},
    	
    	postCreate: function(){
			console.debug("[Products] postCreate start");
    		this.inherited(arguments);
			console.debug("[Products] postCreate end");
    	},*/
    	
    	// Overriden.
    	dialogExecute: function(formContents)
    	{
			console.debug("[Products] dialogExecute execute start 100ms");
			// We need to wait because the grid is not immediatly updated

				setTimeout(function(){
					var multiProductCheckbox = dijit.byId('multi_product');
					if(multiProductCheckbox && multiProductCheckbox.get('checked'))
					{
						// Insert the product in the grid
						dijit.byId('product-dialog-template').gridMultipleItemsWidget.updateData();
					}
				}, 100);

			console.debug("[Products] dialogExecute end");
			document.body.style.overflow = "visible";
		},
		
		addItem: function(event)
    	{
    		console.debug("[Products] addItem start");
    		
    		this.inherited(arguments);
    		
    		this._buildProductDataStore();
    		
    		console.debug("[Products] addItem end");
    		document.body.style.overflow = "hidden";
    	},

    	openDialogFromExistingItem: function(items, request)
    	{
    		console.debug("[Products] openDialogFromExistingItem start");

			// Disable dialog events
    		misys.dialog.isActive = false;

    		this.inherited(arguments);
    		
    		this._buildProductDataStore(items[0].product);
    		
    		console.debug("[Products] openDialogFromExistingItem end");
    	},

    	_buildProductDataStore: function(selectedProductCode)
    	{
    		if (availableProductCodes)
    		{
    			// Retrieve all products already declared in the products' grid
        		var alreadySelectedProducts = {};
    			var areProductsAlreadySelected = false;
				var isTransaction = false;
				var isTemplate = false;
				var isMaster = false;
    			if (this.grid && this.grid.store)
    			{
        			this.grid.store.fetch({query: {store_id: '*'}, onComplete: dojo.hitch(this, function(items, request){
        				if (items.length > 0)
        				{
        					areProductsAlreadySelected = true;
	        				// What is the type of the products already selected?
	        				isTransaction = this._isTransactionProduct(dojo.isArray(items[0].product) ? items[0].product[0] : items[0].product);
	        				isTemplate = this._isTemplateProduct(dojo.isArray(items[0].product) ? items[0].product[0] : items[0].product);
	        				isMaster = this._isMasterProduct(dojo.isArray(items[0].product) ? items[0].product[0] : items[0].product);
	        				// Build the list of already selected products
	        				for (var i = 0; i < items.length; i++)
	        				{
	        					var item = items[i];
	        					alreadySelectedProducts[item.product] = item.product;
	        				}
        				}
        			})});
    			}
    			
    			var productItems = [];
    			for (var i=0; i < availableProductCodes.length; i++) {
    				var product = availableProductCodes[i].product;
    				var description = availableProductCodes[i].description;
    				
    				// If no product is already selected, we display all products
    				if (!areProductsAlreadySelected)
    				{
    					productItems.push({code: product, name: description});
    				}
    				else
    				{
        				if (! alreadySelectedProducts[product] && 
        						((isTransaction && this._isTransactionProduct(product)) ||
        						(isTemplate && this._isTemplateProduct(product)) ||
        						(isMaster && this._isMasterProduct(product))))
        				{
        					productItems.push({code: product, name: description});
        				}
        				else if (selectedProductCode && selectedProductCode == product)
        				{
        					productItems.push({code: product, name: description});
        				}
    				}
    					
    			}
    			
    			var options = new dojo.data.ItemFileReadStore({data: {identifier: 'code', items: productItems}});
    			dijit.byId('product').set('searchAttr', 'name');
    			dijit.byId('product').store = options;
    			if (selectedProductCode)
    			{
    				dijit.byId('product').set('value', selectedProductCode);
    			}
    		}
    		
    	},
    	
    	_isTransactionProduct: function(product)
    	{
    		return (product.match('Tnx$') == 'Tnx');
    	},
    	
    	_isTemplateProduct: function(product)
    	{
    		return (product.match('Template$') == 'Template');
    	},
    	
    	_isMasterProduct: function(product)
    	{
    		return !this._isTransactionProduct(product) && !this._isTemplateProduct(product);
    	},
    	
    	startup: function(){
			console.debug("[Products] startup start");
			
			this.dataList = [];
			if(this.hasChildren())
			{
				dojo.forEach(this.getChildren(), function(child){
					this.dataList.push({ product: child.get('product') });
				}, this);
			}
			
    		this.inherited(arguments);
			console.debug("[Products] startup end");
    	}
       }
);