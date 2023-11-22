dojo.provide("misys.openaccount.widget.ShipmentSubSchedules");
dojo.experimental("misys.openaccount.widget.ShipmentSubSchedules"); 

dojo.require("misys.openaccount.FormOpenAccountEvents");
dojo.require("misys.grid.GridMultipleItems");
dojo.require("misys.openaccount.widget.ShipmentSubSchedule");

/**
 * This widget stores the shipment sub schedule details for the line item.
 */
dojo.declare("misys.openaccount.widget.ShipmentSubSchedules",
		[ misys.grid.GridMultipleItems ],
		// class properties:
		{
		data: { identifier: "store_id", label: "store_id", items: [] },
		templatePath: null,
		templateString: dojo.byId("sub-shipment-schedule-template")? dojo.byId("sub-shipment-schedule-template").innerHTML : '',
		dialogId: "sub-shipment-schedule-dialog-template",
		xmlTagName: "shipmentSchedules",
		xmlSubTagName: "shipmentSchedule",
		
		gridColumns: ["sub_shipment_quantity_value", "schedule_earliest_ship_date", "schedule_latest_ship_date"],
        
		propertiesMap: {
			ref_id: {_fieldName: "ref_id"},
			tnx_id: {_fieldName: "tnx_id"},
			shipment_id : {_fieldName: "shipment_id"},
			sub_shipment_quantity_value: {_fieldName: "sub_shipment_quantity_value"},
			schedule_earliest_ship_date: {_fieldName: "schedule_earliest_ship_date"},
			schedule_latest_ship_date: {_fieldName: "schedule_latest_ship_date"}
			},

		layout: [
				{ name: "Sub Quantity Value",field: "sub_shipment_quantity_value", width: "35%" },
				{ name: "Earliest Shipment Date", field: "schedule_earliest_ship_date", width: "15%" },
				{ name: "Latest Shipment Date", field: "schedule_latest_ship_date", width: "15%" },
				{ name: " ", field: "actions", formatter: misys.grid.formatReportActions, width: "10%" }
				],
				
		getMandatoryProperties: function(item){
			var mandatoryProperties = [];
			mandatoryProperties.push("sub_shipment_quantity_value");
			return mandatoryProperties;
		},
        
		startup: function(){
			console.debug("[ShipmentSubSchedules] startup start");
			
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
			console.debug("[ShipmentSubSchedules] startup end");
		},
    	
		openDialogFromExistingItem: function(items, request)
		{
			console.debug("[ShipmentSubSchedules] openDialogFromExistingItem start");
			
			this.inherited(arguments);

			console.debug("[ShipmentSubSchedules] openDialogFromExistingItem end");
		},
		
		resetDialog: function(items, request)
		{
			console.debug("[ShipmentSubSchedules] resetDialog start");
			
			this.inherited(arguments);
			
			console.debug("[ShipmentSubSchedules] resetDialog end");
		},
		
		addItem: function(event)
		{
			console.debug("[ShipmentSubSchedules] addItem start");

			this.inherited(arguments);			
			console.debug("[ShipmentSubSchedules] addItem end");
		},
		
		createDataGrid: function()
		{
			this.inherited(arguments);
			var grid = this.grid;
			var gridLineItemShipmentSchedules=dijit.byId("line_item_shipment_schedules");
			misys.connect(grid, "onDelete",
					function(){
						misys.dialog.connect(dijit.byId("okButton"), "onMouseUp", function(){
							gridLineItemShipmentSchedules.addButtonNode.set("disabled", false);
						}, "alertDialog");
			});
		},
		
		performValidation: function()
		{
			console.debug("[ShipmentSubSchedules] validate start");
			if(this.validateDialog(true))
			{
				this.inherited(arguments);
			}
			
			console.debug("[ShipmentSubSchedules] validate end");
		},
		
		updateData: function(event)
		{
			console.debug("[ShipmentSubSchedules] updateData start");
			
			this.inherited(arguments);
			
			if(dijit.byId("tran_ship_2") && dijit.byId("tran_ship_2").get("checked") === true){
				var gridLineItemShipmentSchedules=dijit.byId("line_item_shipment_schedules");
				if(gridLineItemShipmentSchedules && gridLineItemShipmentSchedules.store && gridLineItemShipmentSchedules.store._arrayOfTopLevelItems.length > 0){
					gridLineItemShipmentSchedules.addButtonNode.set("disabled", true);
				}
				}
			if(dijit.byId("line_item_shipment_schedules") && dijit.byId("line_item_shipment_schedules").store && dijit.byId("line_item_shipment_schedules").store._arrayOfTopLevelItems.length > 0) {
				dijit.byId("line_item_last_ship_date").set("disabled",true);
				dijit.byId("line_item_earliest_ship_date").set("disabled",true);
			}
			else if(dijit.byId("line_item_last_ship_date") && dijit.byId("line_item_earliest_ship_date")){
				dijit.byId("line_item_last_ship_date").set("disabled",false);
				dijit.byId("line_item_earliest_ship_date").set("disabled",false);
			}
			
			console.debug("[ShipmentSubSchedules] updateData end");
		},
		
		renderSections: function()
		{
			console.debug("[ShipmentSubSchedules] renderSections start");
			this.inherited(arguments);
			if (this.itemsNode && !(this.grid && this.grid.rowCount > 0) && (dijit.byId("part_ship_2") && dijit.byId("part_ship_2").get("checked") !== true) && !((dijit.byId("last_ship_date") && dijit.byId("last_ship_date").get("value")!== null) || (dijit.byId("earliest_ship_date") && dijit.byId("earliest_ship_date").get("value")!== null)))
			{
				if(dijit.byId("line_item_last_ship_date")) {
					dijit.byId("line_item_last_ship_date").set("disabled",false);
				}
				if(dijit.byId("line_item_earliest_ship_date")) {
					dijit.byId("line_item_earliest_ship_date").set("disabled",false);
				}
			}
			console.debug("[ShipmentSubSchedules] renderSections end");
		}
	}
);