dojo.provide("misys.openaccount.widget.ProductCategories");
dojo.experimental("misys.openaccount.widget.ProductCategories"); 

dojo.require("misys.grid.GridMultipleItems");
dojo.require("misys.openaccount.widget.ProductCategory");

/**
 * This widget stores the product categories details for the line item.
 */
dojo.declare("misys.openaccount.widget.ProductCategories",
		[ misys.grid.GridMultipleItems ],
		// class properties:
		{
		data: { identifier: 'store_id', label: 'store_id', items: [] },
		templatePath: null,
		templateString: dojo.byId("product-categories-template").innerHTML,
		dialogId: 'product-category-dialog-template',
		xmlTagName: 'productCategories',
		xmlSubTagName: 'productCategory',
		
		gridColumns: ['type', 'type_label' , 'other_type', 'description', 'goods_id', 'ref_id', 'tnx_id'],
        
		propertiesMap: {
			goods_id: {_fieldName: 'goods_id'},
			ref_id: {_fieldName: 'ref_id'},
			tnx_id: {_fieldName: 'tnx_id'},
			type: {_fieldName: 'product_category_code'},
			type_label: {_fieldName: 'product_category_code_label'},
			other_type: {_fieldName: 'product_category_other_code'},
			description: {_fieldName: 'product_category_description'}
			},

		layout: [
				{ name: 'Code', field: 'type_label', get: misys.grid.formatOpenAccountProductType, width: '30%' },
				{ name: 'Description', field: 'description', width: '60%' },
				{ name: ' ', field: 'actions', formatter: misys.grid.formatReportActions, width: '10%' },
				{ name: 'Id', field: 'store_id', headerStyles: 'display:none', cellStyles: 'display:none' }
				],
        
		mandatoryFields: ["type", "description"],
        
		startup: function(){
			console.debug("[ProductCategories] startup start");
			
			// Prepare data store
			this.dataList = [];
			if(this.hasChildren())
			{
				dojo.forEach(this.getChildren(), function(child){
					// Mark the child as started.
					// This will prevent Dojo from parsing the child
					// as we don't want to make it appear on the form now.
					if (child.createItem)
					{
						var item = child.createItem();
						this.dataList.push(item);
					}
				}, this);
			}
			
			this.inherited(arguments);
			console.debug("[ProductCategories] startup end");
		},
    	
		openDialogFromExistingItem: function(items, request)
		{
			console.debug("[ProductCategories] openDialogFromExistingItem start");
			
			this.inherited(arguments);

			console.debug("[ProductCategories] openDialogFromExistingItem end");
		},
		
		addItem: function(event)
		{
			console.debug("[ProductCategories] addItem start");
			
			this.inherited(arguments);
			
			console.debug("[ProductCategories] addItem end");
		},

		createItemsFromJson: function(jsonMsg)
		{
			console.debug("[ProductCategories] createItemsFromJson start");
			
			this.inherited(arguments);
			
			console.debug("[ProductCategories] createItemsFromJson end");
		},
		
		performValidation: function()
		{
			console.debug("[ProductCategories] validate start");
			if(this.validateDialog(true))
			{
				this.inherited(arguments);
			}
			
			console.debug("[ProductCategories] validate end");
		}
	}
);