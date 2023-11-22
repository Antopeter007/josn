dojo.provide("misys.openaccount.widget.ProductCharacteristics");
dojo.experimental("misys.openaccount.widget.ProductCharacteristics"); 

dojo.require("misys.grid.GridMultipleItems");
dojo.require("misys.openaccount.widget.ProductCharacteristic");

/**
 * This widget stores the product characteristics details for the line item.
 */
dojo.declare("misys.openaccount.widget.ProductCharacteristics",
		[ misys.grid.GridMultipleItems ],
		// class properties:
		{
		data: { identifier: 'store_id', label: 'store_id', items: [] },
		templatePath: null,
		templateString: dojo.byId("product-characteristics-template").innerHTML,
		dialogId: 'product-characteristic-dialog-template',
		xmlTagName: 'productCharacteristics',
		xmlSubTagName: 'productCharacteristic',
		
		gridColumns: ['type','type_label', 'other_type', 'description', 'goods_id', 'ref_id', 'tnx_id'],
        
		propertiesMap: {
			goods_id: {_fieldName: 'goods_id'},
			ref_id: {_fieldName: 'ref_id'},
			tnx_id: {_fieldName: 'tnx_id'},
			type: {_fieldName: 'product_characteristic_code'},
			type_label: {_fieldName: 'product_characteristic_code_label'},
			other_type: {_fieldName: 'product_characteristic_other_code'},
			description: {_fieldName: 'product_characteristic_description'}
			},

		layout: [
				{ name: 'Code', field: 'type_label', get: misys.grid.formatOpenAccountProductType, width: '30%' },
				{ name: 'Description', field: 'description', width: '60%' },
				{ name: ' ', field: 'actions', formatter: misys.grid.formatReportActions, width: '10%' },
				{ name: 'Id', field: 'store_id', headerStyles: 'display:none', cellStyles: 'display:none' }
				],
        
		mandatoryFields: ["type", "description"],
        
		startup: function(){
			console.debug("[ProductCharacteristics] startup start");
			
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
			console.debug("[ProductCharacteristics] startup end");
		},
    	
		openDialogFromExistingItem: function(items, request)
		{
			console.debug("[ProductCharacteristics] openDialogFromExistingItem start");
			
			this.inherited(arguments);

			console.debug("[ProductCharacteristics] openDialogFromExistingItem end");
		},
		
		addItem: function(event)
		{
			console.debug("[ProductCharacteristics] addItem start");
			
			this.inherited(arguments);
			
			console.debug("[ProductCharacteristics] addItem end");
		},

		createItemsFromJson: function(jsonMsg)
		{
			console.debug("[ProductCharacteristics] createItemsFromJson start");
			
			this.inherited(arguments);
			
			console.debug("[ProductCharacteristics] createItemsFromJson end");
		},
		
		performValidation: function()
		{
			console.debug("[ProductCharacteristics] validate start");
			if(this.validateDialog(true))
			{
				this.inherited(arguments);
			}
			
			console.debug("[ProductCharacteristics] validate end");
		}
	}
);