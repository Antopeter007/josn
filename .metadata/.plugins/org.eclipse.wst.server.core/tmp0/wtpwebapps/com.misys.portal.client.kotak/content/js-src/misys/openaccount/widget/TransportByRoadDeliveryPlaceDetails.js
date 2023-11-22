dojo.provide("misys.openaccount.widget.TransportByRoadDeliveryPlaceDetails");
dojo.experimental("misys.openaccount.widget.TransportByRoadDeliveryPlaceDetails"); 

dojo.require("misys.grid.GridMultipleItems");
dojo.require("misys.openaccount.widget.TransportByRoadDeliveryPlaceDetail");

// our declared class
dojo.declare("misys.openaccount.widget.TransportByRoadDeliveryPlaceDetails",
		[ misys.grid.GridMultipleItems ],
		// class properties:
		{
		data: { identifier: "store_id", label: "store_id", items: [] },
		handle: null,
		templatePath: null,
		templateString: dojo.byId("transport-by-road-delivery-place-details-template") ? dojo.byId("transport-by-road-delivery-place-details-template").innerHTML : "",
		xmlTagName: "road_delivery_places",
		xmlSubTagName: "road_delivery_place", 
		gridColumns: ["road_delivery_place_name","routing_summary_sub_type","ref_id","tnx_id"],
		propertiesMap: {
			ref_id: {_fieldName: 'ref_id'},
			tnx_id: {_fieldName: 'tnx_id'},
			road_delivery_place_name: {_fieldName: "road_delivery_place_name"},
				routing_summary_sub_type: {_fieldName: "road_delivery_place_rs_sub_type"}
				},
		layout:  [
					{ name: "Place Name", field: "road_delivery_place_name", width: "35%" },
					{ name: " ", field: "actions", formatter: misys.grid.formatReportActions, width: "10%" },
					{ name: "Id", field: "store_id", headerStyles: "display:none", cellStyles: "display:none" }
	               ],
		mandatoryFields: ["road_delivery_place_name"],
        
		startup: function(){
			console.debug("[TransportByRoadDeliveryPlaceDetails] startup start");
			
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
			console.debug("[TransportByRoadDeliveryPlaceDetails] startup end");
		},
    	
		openDialogFromExistingItem: function(items, request)
		{
			console.debug("[TransportByRoadDeliveryPlaceDetails] openDialogFromExistingItem start");
			
			this.inherited(arguments);
			
			console.debug("[TransportByRoadDeliveryPlaceDetails] openDialogFromExistingItem end");
		},
		
		resetDialog: function(event)
		{
			console.debug("[TransportByRoadDeliveryPlaceDetails] ResetDialog start");
			
			this.inherited(arguments);
			
			console.debug("[TransportByRoadDeliveryPlaceDetails] ResetDialog end");
		},


		createItem: function()
		{
			if(this.hasChildren && this.hasChildren())
			{
				var type= 'misys.openaccount.widget.TransportByRoadDeliveryPlaceDetails';
				var value= [];
				dojo.forEach(this.getChildren(), function(child){
					if (child.createItem)
					{
						value.push(child.createItem());
						//items.push(obj);
					}
				}, this);
				var obj = {_value : value , _type: type};
				var item = {};
				item["road_delivery_place_details"] = obj;
				return item;
			}
			return null;
		},
		addItem: function(event)
		{
			console.debug("[TransportByRoadDeliveryPlaceDetails] addItem start");
			
			this.inherited(arguments);
			
			console.debug("[TransportByRoadDeliveryPlaceDetails] addItem end");
		},

		createItemsFromJson: function(jsonMsg)
		{
			console.debug("[TransportByRoadDeliveryPlaceDetails] createItemsFromJson start");
			
			this.inherited(arguments);
			
			console.debug("[TransportByRoadDeliveryPlaceDetails] createItemsFromJson end");
		},
		checkDialog: function()
		{
			console.debug("[TransportByRoadDeliveryPlaceDetails] checkDialog start");
			if(!this.dialog)
			{
				var dialogWidget = dijit.byId(this.dialogId); 
				if(dialogWidget)
				{
					this.dialog = dialogWidget; 
				}
				else
				{
					var id = this.dialogId ? this.dialogId : 'dialog-' +
							dojox.uuid.generateRandomUuid();
					var dojoClass = this.dialogClassName ? this.dialogClassName : 'misys.widget.Dialog';
		    		this.dialog = dojo.eval("new " + dojoClass + "({}, dojo.byId('" + id + "'))");
		    		this.dialog.set("refocus", false);
		    		this.dialog.set("draggable", false);
		    		dojo.addClass(this.dialog.domNode, "multipleItemDialog");
		    		this.dialog.startup();
		    		document.body.appendChild(this.dialog.domNode);
				}
			}
			console.debug("[TransportByRoadDeliveryPlaceDetails] checkDialog end");
			
			return this.dialog;
		},
		performValidation: function()
		{
			console.debug("[TransportByRoadDeliveryPlaceDetails] validate start");
			if(this.validateDialog(true))
			{
				this.inherited(arguments);
			}
			console.debug("[TransportByRoadDeliveryPlaceDetails] validate end");
		}
	}
	
);