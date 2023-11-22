dojo.provide("misys.openaccount.widget.ReferenceIds");
dojo.experimental("misys.openaccount.widget.ReferenceIds"); 

dojo.require("misys.grid.GridMultipleItems");
dojo.require("misys.openaccount.widget.ReferenceId");

// our declared class
dojo.declare("misys.openaccount.widget.ReferenceIds",
		[ misys.grid.GridMultipleItems ],
		// class properties:
		{
		data: { identifier: 'store_id', label: 'store_id', items: [] },
		handle: null,
		templatePath: null,
		templateString: dojo.byId("bo-reference-ids-template").innerHTML,
		dialogId: 'bo-reference-ids-dialog-template',
		xmlTagName: 'references',
		xmlSubTagName: 'bo_reference',
		gridColumns: ['cust_reference', 'back_office_1', 'customer_input_center', 'prodcode', 'subprodcode', 'uniqueRef', 'from', 'to', 'title'],

		propertiesMap: {
			cust_reference: {_fieldName: 'select_customer_reference'},
			back_office_1: {_fieldName: 'select_back_office_1'},
			customer_input_center: {_fieldName: 'customer_input_center'},
			prodcode: {_fieldName: 'select_prodcode'},
			subprodcode: {_fieldName: 'select_subprodcode'},
			uniqueRef: {_fieldName: 'uniqueRef'},
			from: {_fieldName: 'from'},
			to: {_fieldName: 'to'},
			title: {_fieldName: 'title'}
		},

		layout: [
				{ name: 'Customer_Reference', field: 'cust_reference', width: '15%' },
				{ name: 'Back_Office_1', field: 'back_office_1', width: '15%' },
				{ name: 'Customer_Input_Center', field: 'customer_input_center', width: '10%' },
				{ name: 'Product', field: 'prodcode', width: '10%' },
				{ name: 'Product_Type', field: 'subprodcode', width: '10%' },
				{ name: 'From', field: 'from', width: '10%' },
				{ name: 'To', field: 'to', width: '10%' },
				{ name: 'Title', field: 'title', width: '15%' },
				{ name: ' ', field: 'actions', formatter: misys.grid.formatReportActions, width: '5%' },
				{ name: 'Id', field: 'store_id', headerStyles: 'display:none', cellStyles: 'display:none' }
				],

		startup: function(){
			console.debug("[BoReferenceIds] startup start");
			
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
			console.debug("[BoReferenceIds] startup end");
		},

		openDialogFromExistingItem: function(items, request)
		{
			console.debug("[BoReferenceIds] openDialogFromExistingItem start");
			
			this.inherited(arguments);
			
			fncOnClickShowRef();
			
			console.debug("[BoReferenceIds] openDialogFromExistingItem end");
		},

		addItem: function(event)
		{
			console.debug("[BoReferenceIds] addItem start");

			this.inherited(arguments);
			
			console.debug("[BoReferenceIds] addItem end");
		},

		createItemsFromJson: function(jsonMsg)
		{
			console.debug("[BoReferenceIds] createItemsFromJson start");
			
			this.inherited(arguments);
			
			console.debug("[BoReferenceIds] createItemsFromJson end");
		}
	}
);