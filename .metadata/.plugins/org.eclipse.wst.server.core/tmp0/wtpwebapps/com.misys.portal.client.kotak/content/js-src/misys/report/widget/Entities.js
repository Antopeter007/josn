dojo.provide("misys.report.widget.Entities");
dojo.experimental("misys.report.widget.Entities"); 

dojo.require("misys.grid.GridMultipleItems");
dojo.require("misys.report.widget.Entity");

// our declared class
dojo.declare("misys.report.widget.Entities",
		[ misys.grid.GridMultipleItems ],
		// class properties:
		{
		data: { identifier: 'store_id', label: 'store_id', items: [] },
		
		templatePath: null,
		templateString: dojo.byId("entities-template").innerHTML,
		dialogId: 'entity-dialog-template',
		xmlTagName: 'entities',
		xmlSubTagName: 'entity',
		
		gridColumns: ['abbv_name'],
        
		propertiesMap: {
			abbv_name: {_fieldName: 'entity'}
			},
        
		layout: [
				{ name: 'Abbreviated Name', field: 'abbv_name', width: '90%' ,noresize:true},
				{ name: ' ', field: 'actions', formatter: misys.grid.formatReportActions, width: '5%',noresize:true },
				{ name: 'Id', field: 'store_id', headerStyles: 'display:none', cellStyles: 'display:none' ,noresize:true}
				],
        
		startup: function(){
			console.debug("[Customers] startup start");
			
			// Prepare data store
			this.dataList = [];
			if(this.hasChildren())
			{
				dojo.forEach(this.getChildren(), function(child){
					var item = { abbv_name: child.get('abbv_name')};
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

			console.debug("[Customers] openDialogFromExistingItem end");
		},
		
		addItem: function(event)
		{
			console.debug("[Customers] addItem start");
			
			this.inherited(arguments);
			
			console.debug("[Customers] addItem end");
		},
		updateData: function()
		{
			var noupdate = true;
			if (this.grid && this.grid.store && this.grid.store._arrayOfAllItems && this.grid.store._arrayOfAllItems.length > 0)
			{
				var currententity = this.dialog.value.entity;
				
				dojo.forEach(this.grid.store._arrayOfAllItems, function(item){
					if(item && item.abbv_name && currententity === item.abbv_name[0]){
						noupdate =  false;
						}
			});
		         	            
			}
			if(!noupdate){
				misys.dialog.show("ERROR", misys.getLocalization("duplicateEntity"));
				return;
			}
			console.debug("[Customers] updateData start");
			
			this.inherited(arguments);
			
			console.debug("[Customers] updateData end");
			
		}
	}
);