dojo.provide("misys.openaccount.widget.TransportByRailDeliveryPlaceDetails");
dojo.experimental("misys.openaccount.widget.TransportByRailDeliveryPlaceDetails"); 

dojo.require("misys.grid.GridMultipleItems");
dojo.require("misys.openaccount.widget.TransportByRailDeliveryPlaceDetail");

// our declared class
dojo.declare("misys.openaccount.widget.TransportByRailDeliveryPlaceDetails",
		[ misys.grid.GridMultipleItems ],
		// class properties:
		{
		data: { identifier: "store_id", label: "store_id", items: [] },
		handle: null,
		templatePath: null,
		templateString: dojo.byId("transport-by-rail-delivery-place-details-template") ? dojo.byId("transport-by-rail-delivery-place-details-template").innerHTML : "",
		xmlTagName: "rail_delivery_places",
		xmlSubTagName: "rail_delivery_place", 
		gridColumns: ["rail_delivery_place_name","routing_summary_sub_type","ref_id","tnx_id"],
		propertiesMap: {
			ref_id: {_fieldName: 'ref_id'},
			tnx_id: {_fieldName: 'tnx_id'},
			rail_delivery_place_name: {_fieldName: "rail_delivery_place_name"},
				routing_summary_sub_type: {_fieldName: "rail_delivery_place_rs_sub_type"}
				},
		layout:  [
					{ name: "Place Name", field: "rail_delivery_place_name", width: "35%" },
					{ name: " ", field: "actions", formatter: misys.grid.formatReportActions, width: "10%" },
					{ name: "Id", field: "store_id", headerStyles: "display:none", cellStyles: "display:none" }
	               ],
		mandatoryFields: ["rail_delivery_place_name"],
        
		startup: function(){
			console.debug("[TransportByRailDeliveryPlaceDetails] startup start");
			
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
			console.debug("[TransportByRailDeliveryPlaceDetails] startup end");
		},
    	
		openDialogFromExistingItem: function(items, request)
		{
			console.debug("[TransportByRailDeliveryPlaceDetails] openDialogFromExistingItem start");
			
			this.inherited(arguments);
			
			console.debug("[TransportByRailDeliveryPlaceDetails] openDialogFromExistingItem end");
		},
		
		resetDialog: function(event)
		{
			console.debug("[TransportByRailDeliveryPlaceDetails] ResetDialog start");
			
			this.inherited(arguments);
			
			console.debug("[TransportByRailDeliveryPlaceDetails] ResetDialog end");
		},


		createItem: function()
		{
			if(this.hasChildren && this.hasChildren())
			{
				var type= 'misys.openaccount.widget.TransportByRailDeliveryPlaceDetails';
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
				item["rail_receipt_place_details"] = obj;
				return item;
			}
			return null;
		},
		addItem: function(event)
		{
			console.debug("[TransportByRailDeliveryPlaceDetails] addItem start");
			
			this.inherited(arguments);
			
			console.debug("[TransportByRailDeliveryPlaceDetails] addItem end");
		},

		createItemsFromJson: function(jsonMsg)
		{
			console.debug("[TransportByRailDeliveryPlaceDetails] createItemsFromJson start");
			
			this.inherited(arguments);
			
			console.debug("[TransportByRailDeliveryPlaceDetails] createItemsFromJson end");
		},
		checkDialog: function()
		{
			console.debug("[TransportByRailDeliveryPlaceDetails] checkDialog start");
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
			console.debug("[TransportByRailDeliveryPlaceDetails] checkDialog end");
			
			return this.dialog;
		},
		performValidation: function()
		{
			console.debug("[TransportByRailDeliveryPlaceDetails] validate start");
			if(this.validateDialog(true))
			{
				this.inherited(arguments);
			}
			console.debug("[TransportByRailDeliveryPlaceDetails] validate end");
		}
	}
);