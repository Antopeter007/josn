dojo.provide("misys.openaccount.widget.TransportDatasetDetails");
dojo.experimental("misys.openaccount.widget.TransportDatasetDetails"); 

dojo.require("misys.grid.GridMultipleItems");
dojo.require("misys.openaccount.widget.TransportDatasetDetail");

// our declared class
dojo.declare("misys.openaccount.widget.TransportDatasetDetails",
		[ misys.grid.GridMultipleItems ],
		// class properties:
		{
		data: { identifier: "store_id", label: "store_id", items: [] },
		handle: null,
		templatePath: null,
		templateString: dojo.byId("transport-ds-details-template").innerHTML,
		dialogId: "transport-ds-details-dialog-template",
		xmlTagName: "TrnsprtDataSetReqrd",
		xmlSubTagName: "Submitr",
		
		gridColumns: ["BIC"],
        
		propertiesMap: {
			BIC: {_fieldName: "tds_bic"}
			},
			
		bicMap : {
			BIC: {_fieldName: "BIC"}
		},

		layout: [
				{ name: "Bic", field: "BIC", width: "90%" },
				{ name: " ", field: "actions", formatter: misys.grid.formatReportActions, width: "10%" },
				{ name: "Id", field: "store_id", headerStyles: "display:none", cellStyles: "display:none" }
				],
        
        mandatoryFields: ["tds_bic"],
        
		startup: function(){
			console.debug("[transport Dataset] startup start");
			
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
			console.debug("[transport Dataset] startup end");
		},
    	
		openDialogFromExistingItem: function(items, request)
		{
			console.debug("[transport Dataset] openDialogFromExistingItem start");
			
			this.inherited(arguments);

			console.debug("[transport Dataset] openDialogFromExistingItem end");
		},
		
		addItem: function(event)
		{
			console.debug("[transport Dataset] addItem start");

			this.inherited(arguments);
			
			console.debug("[transport Dataset] addItem end");
		},
		
		createDataGrid: function()
		{
			this.inherited(arguments);
			var grid = this.grid;
			var widgetTransportDs = dijit.byId("transport-ds-details");
			misys.connect(grid, "onDelete",
					function(){
						misys.dialog.connect(dijit.byId("okButton"), "onMouseUp", function(){
							widgetTransportDs.addButtonNode.set("disabled", false);
						}, "alertDialog");
			});
		},
		
		toXML: function(){
			var xml = [];
			
			xml.push("<transport_dataset>");
			xml.push("<![CDATA[");
			if(this.grid)
			{
				this.grid.store.fetch({query: {store_id: '*'}, 
						onComplete: dojo.hitch(this, function(items, request){
					xml.push(this.itemToXML(items, this.xmlSubTagName));
				})});
			}
			xml.push("]]>");
			xml.push("</transport_dataset>");
			
			return xml.join("");
		},
		
		itemToXML: function(items, xmlSubTagName)
		{
			var xml = [];
			
			dojo.forEach(items, function(item){
				if(item) {
					if(this.xmlTagName) {
						xml.push("<", this.xmlTagName, ">");
					}
					if(xmlSubTagName) {
						xml.push("<", xmlSubTagName, ">");
					}
					for(var property in item)
					{
						// Process a sub-grid included in this item
						var value = dojo.isArray(item[property]) ? item[property][0] : item[property];
						if (dojo.isObject(value) && value._type)
						{
							var classname = value._type;
							var clazz = dojo.eval(classname);
							var multipleItems = new clazz({});
							xml.push('<', multipleItems.xmlTagName, '>');
							xml.push(this.itemToXML(value._values, multipleItems.xmlSubTagName, xml));
							xml.push('</', multipleItems.xmlTagName ,'>');
						}
						// Otherwise, process a property of the item 
						else if(property != 'store_id' && property.match('^_') != '_')
						{
							value = dojo.isArray(item[property]) ? item[property][0] : item[property];
							value += '';
							
							for(var property1 in this.bicMap) {
								if(this.bicMap[property1]._fieldName === property)
								{
									xml.push('<', property1, '>', dojox.html.entities.encode(value, dojox.html.entities.html), '</', property1, '>');
									break;
								}
							}
						}
					}
					
					if(xmlSubTagName) {
						xml.push('</', xmlSubTagName, '>');
					}
					if(this.xmlTagName) {
						xml.push("</", this.xmlTagName, ">");
					}
				}
			}, this);
							
			return xml.join("");
		},

		
		createItemsFromJson: function(jsonMsg)
		{
			console.debug("[transport Dataset] createItemsFromJson start");
			
			this.inherited(arguments);
			
			console.debug("[transport Dataset] createItemsFromJson end");
		},
		
		performValidation: function()
		{
			console.debug("[Transport Data Set] validate start");
			if(this.validateDialog(true))
			{
				this.inherited(arguments);
			}
				
			console.debug("[Transport Data Set] validate end");
		},
		
		updateData: function()
		{
			console.debug("[Transport Data Set] updateData start");
			this.inherited(arguments);
			//Disable Add transport data set button, after transport data set is added.
			dijit.byId("add_transport_ds_button").set("disabled",true);
			
			console.debug("[Transport Data Set] updateData end");
		}
	}
);