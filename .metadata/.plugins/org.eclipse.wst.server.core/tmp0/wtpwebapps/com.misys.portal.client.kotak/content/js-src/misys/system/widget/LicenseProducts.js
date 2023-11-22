dojo.provide("misys.system.widget.LicenseProducts");
dojo.experimental("misys.system.widget.LicenseProducts"); 

dojo.require("misys.grid.GridMultipleItems");
dojo.require("misys.system.widget.LicenseProduct");

// our declared class
dojo.declare("misys.system.widget.LicenseProducts",
		[ misys.grid.GridMultipleItems ],
		// class properties:
		{
		data: { identifier: 'store_id', label: 'store_id', items: [] },
		handle: null,
		templatePath: null,
		templateString: dojo.byId("ls-products-template").innerHTML,
		dialogId: 'ls-products-dialog-template',
		xmlTagName: 'products',
		xmlSubTagName: 'product',
		
		gridColumns: ['product_code', 'sub_product_code', 'product_type_code', 'product_code_hidden', 'sub_product_code_hidden', 'product_type_code_hidden'],
        
		propertiesMap: {
			/*ls_def_id: {_fieldName: 'ls_def_id'},*/
			product_code: {_fieldName: 'product_code'},
			sub_product_code: {_fieldName: 'sub_product_code'},
			product_type_code: {_fieldName: 'product_type_code'},
			product_code_hidden: {_fieldName: 'product_code_hidden'},
			sub_product_code_hidden: {_fieldName: 'sub_product_code_hidden'},
			product_type_code_hidden: {_fieldName: 'product_type_code_hidden'}
			},

		layout: [
				{ name: 'Product', field: 'product_code_hidden', width: '30%' },
				{ name: 'Sub Product', field: 'sub_product_code_hidden', width: '30%' },
				{ name: 'Product Type', field: 'product_type_code_hidden', width: '30%' },
				{ name: ' ', field: 'actions', formatter: misys.grid.formatReportActions, width: '10%' },
				{ name: 'Id', field: 'store_id', headerStyles: 'display:none', cellStyles: 'display:none' }
				],
        
        mandatoryFields: ["product_code", "sub_product_code"],
        
		startup: function(){
			console.debug("[LicenseProducts] startup start");
			
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
			console.debug("[LicenseProducts] startup end");
		},
    	
		openDialogFromExistingItem: function(items, request)
		{
			console.debug("[LicenseProducts] openDialogFromExistingItem start");
			misys._config = misys._config || {};
			misys._config.isModified = true;
			this.inherited(arguments);

			console.debug("[LicenseProducts] openDialogFromExistingItem end");
		},
		
		addItem: function(event)
		{
			console.debug("[LicenseProducts] addItem start");
			
			misys._config = misys._config || {};
			misys._config.isModified = false;
			
			this.inherited(arguments);
			
			console.debug("[LicenseProducts] addItem end");
		},

		createItemsFromJson: function(jsonMsg)
		{
			console.debug("[LicenseProducts] createItemsFromJson start");
			
			this.inherited(arguments);
			
			console.debug("[LicenseProducts] createItemsFromJson end");
		}
	}
);