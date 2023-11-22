dojo.provide("misys.openaccount.widget.ProductIdentifiers");
dojo.experimental("misys.openaccount.widget.ProductIdentifiers"); 

dojo.require("misys.grid.GridMultipleItems");
dojo.require("misys.openaccount.widget.ProductIdentifier");

/**
 * This widget stores the product identifier details for the line item.
 */
dojo.declare("misys.openaccount.widget.ProductIdentifiers",
		[ misys.grid.GridMultipleItems ],
		// class properties:
		{
		data: { identifier: 'store_id', label: 'store_id', items: [] },
		templatePath: null,
		templateString: dojo.byId("product-identifiers-template").innerHTML,
		dialogId: 'product-identifier-dialog-template',
		xmlTagName: 'productIdentifiers',
		xmlSubTagName: 'productIdentifier',
		
		gridColumns: ['type','type_label', 'other_type', 'description'],
        
		propertiesMap: {
			goods_id: {_fieldName: 'goods_id'},
			ref_id: {_fieldName: 'ref_id'},
			tnx_id: {_fieldName: 'tnx_id'},
			type: {_fieldName: 'product_identifier_code'},
			type_label: {_fieldName: 'product_identifier_code_label'},
			other_type: {_fieldName: 'product_identifier_other_code'},
			description: {_fieldName: 'product_identifier_description'}
		},

		layout: [
				{ name: 'Code', field: 'type_label', get: misys.grid.formatOpenAccountProductType, width: '30%' },
				{ name: 'Description', field: 'description', width: '60%' },
				{ name: ' ', field: 'actions', formatter: misys.grid.formatReportActions, width: '10%' },
				{ name: 'Id', field: 'store_id', headerStyles: 'display:none', cellStyles: 'display:none' }
				],
        
		mandatoryFields: ["type", "description"],
        
		startup: function(){
			console.debug("[ProductIdentifiers] startup start");
			this.inherited(arguments);
			
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
			
			console.debug("[ProductIdentifiers] startup end");
		},
		
		performValidation: function()
		{
			console.debug("[ProductIdentifiers] validate start");
			if(this.validateDialog(true))
			{
				this.inherited(arguments);
			}
			
			console.debug("[ProductIdentifiers] validate end");
		}
	}
);