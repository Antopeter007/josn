dojo.provide("misys.openaccount.widget.AirRoutingSummaries");
dojo.experimental("misys.openaccount.widget.AirRoutingSummaries"); 

dojo.require("misys.grid.GridMultipleItems");
dojo.require("misys.openaccount.widget.RoutingSummary");
dojo.require("misys.openaccount.widget.TransportByAirDeptDetails");
dojo.require("misys.openaccount.widget.TransportByAirDestDetails");

// our declared class
dojo.declare("misys.openaccount.widget.AirRoutingSummaries",
		[ misys.grid.GridMultipleItems ],
		// class properties:
		{
		data: { identifier: "store_id", label: "store_id", items: [] },
		templatePath: null,
		templateString: dojo.byId("routing-summary-air-template") ? dojo.byId("routing-summary-air-template").innerHTML : "",
		dialogId: "routing-summary-air-dialog-template",
		xmlTagName: "routingSummaries",
		xmlSubTagName: "routingSummary",
		
		gridColumns: ["routing_summary_mode", "routing_summary_type", "linked_ref_id", "linked_tnx_id", "air_carrier_name", "transport_by_air_departures",
		              "transport_by_air_destinations"],
        
		propertiesMap: {
			tnx_id: {_fieldName: "tnx_id"},
			ref_id: {_fieldName: "ref_id"},
			routing_summary_mode: {_fieldName: "air_routing_summary_mode"},
			routing_summary_type: {_fieldName: "air_routing_summary_type"},
			linked_ref_id: {_fieldName: "linked_ref_id"},
			linked_tnx_id: {_fieldName: "linked_tnx_id"},
			air_carrier_name: {_fieldName: "air_carrier_name"},
			transport_by_air_departures: {_fieldName: 'transport_by_air_departures', _type: 'misys.openaccount.widget.TransportByAirDeptDetails'},
			transport_by_air_destinations: {_fieldName: 'transport_by_air_destinations', _type: 'misys.openaccount.widget.TransportByAirDestDetails'}
		},
        
		layout: [
				{ name: "Air Carrier Name", field: "air_carrier_name", width: "75%" },
				{ name: " ", field: "actions", formatter: misys.grid.formatReportActions, width: "10%" },
				{ name: "Id", field: "store_id", headerStyles: "display:none", cellStyles: "display:none" }
				],
				
		typeMap: {
			'misys.openaccount.widget.TransportByAirDeptDetails' : {
				'type': Array,
				'deserialize': function(value) {
					var item = {};
					item._type = 'misys.openaccount.widget.TransportByAirDeptDetails';
					item._values = value;
					return item;
				}
			},
			'misys.openaccount.widget.TransportByAirDestDetails' : {
				'type': Array,
				'deserialize': function(value) {
					var item = {};
					item._type = 'misys.openaccount.widget.TransportByAirDestDetails';
					item._values = value;
					return item;
				}
			}
		},
        
		mandatoryFields: [],

		startup: function(){
			console.debug("[AirRoutingSummaries] startup start");

			this.inherited(arguments);
			
			console.debug("[AirRoutingSummaries] startup end");
		},
    	
		openDialogFromExistingItem: function(items, request)
		{
			console.debug("[AirRoutingSummaries] openDialogFromExistingItem start");
			
			this.inherited(arguments);

			console.debug("[AirRoutingSummaries] openDialogFromExistingItem end");
		},
		
		resetDialog: function(items, request)
		{
			console.debug("[AirRoutingSummaries] resetDialog start");
			
			this.inherited(arguments);

			console.debug("[AirRoutingSummaries] resetDialog end");
		},

		addItem: function(event)
		{
			console.debug("[AirRoutingSummaries] addItem start");
			if(this.id.match('^line_item_')=='line_item_'){
				if(misys.checkPOChildrens()){
					misys.dialog.show('ERROR', misys.getLocalization('tooManyPODetailsError'));
					return;
				}
			}else if(misys.checkLineItemChildrens()){
				misys.dialog.show('ERROR', misys.getLocalization('tooManyPODetailsError'));
				return;
			}
			this.inherited(arguments);
			
			console.debug("[AirRoutingSummaries] addItem end");
		},
		
		createDataGrid: function()
		{
			this.inherited(arguments);
			var grid = this.grid;
			var widgetAir = dijit.byId("air_routing_summaries");
			var widgetSea = dijit.byId("sea_routing_summaries");
			var widgetRoad = dijit.byId("road_routing_summaries");
			var widgetRail = dijit.byId("rail_routing_summaries");
			var widgetLineAir = dijit.byId("line_item_air_routing_summaries");
			var widgetLineSea = dijit.byId("line_item_sea_routing_summaries");
			var widgetLineRoad = dijit.byId("line_item_road_routing_summaries");
			var widgetLineRail = dijit.byId("line_item_rail_routing_summaries");
			misys.connect(grid, "onDelete",
					function(){
						misys.dialog.connect(dijit.byId("okButton"), "onMouseUp", function(){
							widgetLineAir.addButtonNode.set("disabled", false);
							widgetLineSea.addButtonNode.set("disabled", false);
							widgetLineRoad.addButtonNode.set("disabled", false);
							widgetLineRail.addButtonNode.set("disabled", false);
							widgetAir.addButtonNode.set("disabled", false);
							widgetSea.addButtonNode.set("disabled", false);
							widgetRoad.addButtonNode.set("disabled", false);
							widgetRail.addButtonNode.set("disabled", false);
						}, "alertDialog");
			});
		},
		
		performValidation: function()
		{
			console.debug("[AirRoutingSummaries] validate start");
			var widget = dijit.byId("transport_by_air_destinations");
			if(widget && 
					(widget.store === null || 
						(widget.store && 
							(widget.store._arrayOfAllItems.length === 0 || (widget.store._arrayOfAllItems.length === 1 && widget.store._arrayOfAllItems[0] === null)))))
				{
					misys.dialog.show('ERROR', misys.getLocalization('transportByAirDestMandatoryError'));
					return;
				}
			if(this.validateDialog(true))
			{
				this.inherited(arguments);
			}
			console.debug("[AirRoutingSummaries] validate end");
		},
		
		updateData : function()
		{    
			console.debug("[Air routing Summary Multimode] updateData start");
			this.inherited(arguments);
			var widgetAir = dijit.byId("air_routing_summaries");
			var widgetSea = dijit.byId("sea_routing_summaries");
			var widgetRoad = dijit.byId("road_routing_summaries");
			var widgetRail = dijit.byId("rail_routing_summaries");
			var widgetLineAir = dijit.byId("line_item_air_routing_summaries");
			var widgetLineSea = dijit.byId("line_item_sea_routing_summaries");
			var widgetLineRoad = dijit.byId("line_item_road_routing_summaries");
			var widgetLineRail = dijit.byId("line_item_rail_routing_summaries");
			if(dijit.byId("tran_ship_2") && dijit.byId("tran_ship_2").get("checked") === true){
				var gridLineItemAirRoutingSummary=dijit.byId("line_item_air_routing_summaries");
				if(gridLineItemAirRoutingSummary && gridLineItemAirRoutingSummary.store && gridLineItemAirRoutingSummary.store._arrayOfTopLevelItems.length > 0){
						 
					if (widgetLineAir && widgetLineAir.addButtonNode) {
						widgetLineAir.addButtonNode.set("disabled", true);
					}
					if (widgetLineSea && widgetLineSea.addButtonNode) {
						widgetLineSea.addButtonNode.set("disabled", true);
					}
					if (widgetLineRoad && widgetLineRoad.addButtonNode) {
						widgetLineRoad.addButtonNode.set("disabled", true);
					}
					if (widgetLineRail && widgetLineRail.addButtonNode) {
						widgetLineRail.addButtonNode.set("disabled", true);
					}	
				}
				
				else{
							if (widgetAir && widgetAir.addButtonNode) {
									widgetAir.addButtonNode.set("disabled", true);
							}
							if (widgetSea && widgetSea.addButtonNode) {
									widgetSea.addButtonNode.set("disabled", true);
							}
							if (widgetRoad && widgetRoad.addButtonNode) {
									widgetRoad.addButtonNode.set("disabled", true);
							}
							if (widgetRail && widgetRail.addButtonNode) {
									widgetRail.addButtonNode.set("disabled", true);
							}
				}
			}
			
			console.debug("[Air routing Summary Multimode] updateData end");
		}
	}
);