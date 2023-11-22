dojo.provide("misys.system.widget.Customers");
dojo.experimental("misys.system.widget.Customers"); 

dojo.require("misys.grid.GridMultipleItems");
dojo.require("misys.system.widget.Customer");

// our declared class
dojo.declare("misys.system.widget.Customers",
		[ misys.grid.GridMultipleItems ],
		// class properties:
		{
		data: { identifier: 'store_id', label: 'store_id', items: [] },
		
		templatePath: null,
		templateString: dojo.byId("customers-template").innerHTML,
		dialogId: 'customer-dialog-template',
		xmlTagName: 'customers',
		xmlSubTagName: 'customer',
		
		gridColumns: ['abbv_name','name_', 'entity', 'entity_id', 'company_id'],
        
		propertiesMap: {
			company_id: {_fieldName: 'company_id'},
			abbv_name: {_fieldName: 'customer_abbv_name'},
			name_: {_fieldName: 'customer_name'},
			entity: {_fieldName: 'customer_entity'},
			entity_id: {_fieldName: 'entity_id'}
			},
        
		layout: [
				{ name: 'Abbreviated Name', field: 'abbv_name', width: '20%' ,noresize:true},
				{ name: 'Name', field: 'name_', width: '30%',noresize:true },
				{ name: 'Entity', field: 'entity', width: '30%',noresize:true },
				{ name: ' ', field: 'actions', formatter: misys.grid.formatReportActions, width: '10%',noresize:true },
				{ name: 'Id', field: 'store_id', headerStyles: 'display:none', cellStyles: 'display:none' ,noresize:true}
				],
        
		startup: function(){
			console.debug("[Customers] startup start");
			
			// Prepare data store
			this.dataList = [];
			if(this.hasChildren())
			{
				dojo.forEach(this.getChildren(), function(child){
					var item = { company_id:child.get('company_id'), abbv_name: child.get('abbv_name'), name_: child.get('name_'),  entity: child.get('entity'), entity_id: child.get('entity_id') };
					this.dataList.push(item);
				}, this);
			}
			
			this.inherited(arguments);
			console.debug("[Customers] startup end");
		},
    	
		openDialogFromExistingItem: function(items, request)
		{
			console.debug("[Customers] openDialogFromExistingItem start");
			
			this.inherited(arguments);
			
			if(dijit.byId("customer_abbv_name"))
			{
				dijit.byId("customer_abbv_name").set("readOnly",true);
			}
			if(dijit.byId("customer_name"))
			{
				dijit.byId("customer_name").set("readOnly",true);
			}

			console.debug("[Customers] openDialogFromExistingItem end");
		},
		
		addItem: function(event)
		{
			console.debug("[Customers] addItem start");
			
			this.inherited(arguments);
			
			console.debug("[Customers] addItem end");
		}
	}
);