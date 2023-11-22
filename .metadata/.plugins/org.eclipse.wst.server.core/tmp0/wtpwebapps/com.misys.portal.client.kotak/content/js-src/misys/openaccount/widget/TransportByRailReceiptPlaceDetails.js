dojo.provide("misys.openaccount.widget.TransportByRailReceiptPlaceDetails");
dojo.experimental("misys.openaccount.widget.TransportByRailReceiptPlaceDetails"); 

dojo.require("misys.grid.GridMultipleItems");
dojo.require("misys.openaccount.widget.TransportByRailReceiptPlaceDetail");

// our declared class
dojo.declare("misys.openaccount.widget.TransportByRailReceiptPlaceDetails",
		[ misys.grid.GridMultipleItems ],
		// class properties:
		{
		data: { identifier: "store_id", label: "store_id", items: [] },
		handle: null,
		templatePath: null,
		templateString: dojo.byId("transport-by-rail-receipt-place-details-template") ? dojo.byId("transport-by-rail-receipt-place-details-template").innerHTML : "",
		xmlTagName: "rail_receipt_places",
		xmlSubTagName: "rail_receipt_place", 
		gridColumns: ["rail_receipt_place_name","routing_summary_sub_type"],
		propertiesMap: {
			rail_receipt_place_name: {_fieldName: "rail_receipt_place_name"},
				routing_summary_sub_type: {_fieldName: "rail_receipt_place_rs_sub_type"}
				},
		layout:  [
					{ name: "Place Name", field: "rail_receipt_place_name", width: "35%" },
					{ name: " ", field: "actions", formatter: misys.grid.formatReportActions, width: "10%" },
					{ name: "Id", field: "store_id", headerStyles: "display:none", cellStyles: "display:none" }
	               ],
		mandatoryFields: [],
        
		startup: function(){
			console.debug("[TransportByRailReceiptPlaceDetails] startup start");
			
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
			console.debug("[TransportByRailReceiptPlaceDetails] startup end");
		},
    	
		openDialogFromExistingItem: function(items, request)
		{
			console.debug("[TransportByRailReceiptPlaceDetails] openDialogFromExistingItem start");
			
			this.inherited(arguments);
			
			console.debug("[TransportByRailReceiptPlaceDetails] openDialogFromExistingItem end");
		},
		
		resetDialog: function(event)
		{
			console.debug("[TransportByRailReceiptPlaceDetails] ResetDialog start");
			
			this.inherited(arguments);
			
			console.debug("[TransportByRailReceiptPlaceDetails] ResetDialog end");
		},


		createItem: function()
		{
			if(this.hasChildren && this.hasChildren())
			{
				var type= 'misys.openaccount.widget.TransportByRailReceiptPlaceDetails';
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
			console.debug("[TransportByRailReceiptPlaceDetails] addItem start");
			
			this.inherited(arguments);
			
			console.debug("[TransportByRailReceiptPlaceDetails] addItem end");
		},

		createItemsFromJson: function(jsonMsg)
		{
			console.debug("[TransportByRailReceiptPlaceDetails] createItemsFromJson start");
			
			this.inherited(arguments);
			
			console.debug("[TransportByRailReceiptPlaceDetails] createItemsFromJson end");
		},
		checkDialog: function()
		{
			console.debug("[TransportByRailReceiptPlaceDetails] checkDialog start");
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
			console.debug("[TransportByRailReceiptPlaceDetails] checkDialog end");
			
			return this.dialog;
		},
		
		performValidation: function()
		{
			console.debug("[TransportByRailReceiptPlaceDetails] validate start");
			if(this.validateDialog(true))
			{
				if(dijit.byId("rail_receipt_place_name") && dijit.byId("rail_receipt_place_name").get("value") === "")
				{
					misys.dialog.show("ERROR", misys.getLocalization("emptyDialogSubmitError"));
				}
				else
				{
					this.inherited(arguments);
				}
			}
			
			console.debug("[TransportByRailReceiptPlaceDetails] validate end");
		}
	
	}
);