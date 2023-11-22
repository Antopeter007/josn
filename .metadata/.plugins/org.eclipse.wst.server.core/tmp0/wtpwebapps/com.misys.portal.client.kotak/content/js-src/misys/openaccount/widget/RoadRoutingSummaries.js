dojo.provide("misys.openaccount.widget.RoadRoutingSummaries");
dojo.experimental("misys.openaccount.widget.RoadRoutingSummaries"); 

dojo.require("misys.grid.GridMultipleItems");
dojo.require("misys.openaccount.widget.RoutingSummary");

// our declared class
dojo.declare("misys.openaccount.widget.RoadRoutingSummaries",
		[ misys.grid.GridMultipleItems ],
		// class properties:
		{
	data: { identifier: "store_id", label: "store_id", items: [] },
	templatePath: null,
	templateString: dojo.byId("routing-summary-road-template") ? dojo.byId('routing-summary-road-template').innerHTML : "",
			dialogId: 'routing-summary-road-dialog-template',
			xmlTagName: "routingSummaries",
			xmlSubTagName: "routingSummary",
			
			gridColumns: ["routing_summary_mode", "routing_summary_type", "linked_ref_id", "linked_tnx_id", "road_carrier_name","transport_by_road_receipt_places", "transport_by_road_delivery_places"],
	        
			propertiesMap: {
				tnx_id: {_fieldName: 'tnx_id'},
				ref_id: {_fieldName: 'ref_id'},
				routing_summary_mode: {_fieldName: 'road_routing_summary_mode'},
				routing_summary_type: {_fieldName: 'road_routing_summary_type'},
				linked_ref_id: {_fieldName: 'linked_ref_id'},
				linked_tnx_id: {_fieldName: 'linked_tnx_id'},
				road_carrier_name: {_fieldName: 'road_carrier_name'},
				transport_by_road_receipt_places: {_fieldName: 'transport_by_road_receipt_places', _type: 'misys.openaccount.widget.TransportByRoadReceiptPlaceDetails'},
				transport_by_road_delivery_places: {_fieldName: 'transport_by_road_delivery_places', _type: 'misys.openaccount.widget.TransportByRoadDeliveryPlaceDetails'}
				},

		layout: [
				{ name: "Road Carrier Name", field: "road_carrier_name", width: "75%" },
				{ name: " ", field: "actions", formatter: misys.grid.formatReportActions, width: "10%" },
				{ name: "Id", field: "store_id", headerStyles: "display:none", cellStyles: "display:none" }
				],
				
		typeMap: {
			'misys.openaccount.widget.TransportByRoadReceiptPlaceDetails' : {
				'type': Array,
				'deserialize': function(value) {
					var item = {};
					item._type = 'misys.openaccount.widget.TransportByRoadReceiptPlaceDetails';
					item._values = value;
					return item;
				}
			},
			
			'misys.openaccount.widget.TransportByRoadDeliveryPlaceDetails' : {
				'type': Array,
				'deserialize': function(value) {
					var item = {};
					item._type = 'misys.openaccount.widget.TransportByRoadDeliveryPlaceDetails';
					item._values = value;
					return item;
				}
			}
		},
        
		mandatoryFields: [],

		startup: function(){
			console.debug("[RoadRoutingSummaries] startup start");

			this.inherited(arguments);
			
			console.debug("[RoadRoutingSummaries] startup end");
		},
    	
		openDialogFromExistingItem: function(items, request)
		{
			console.debug("[RoadRoutingSummaries] openDialogFromExistingItem start");
			
			this.inherited(arguments);

			console.debug("[RoadRoutingSummaries] openDialogFromExistingItem end");
		},
		
		resetDialog: function(items, request)
		{
			console.debug("[RoadRoutingSummaries] resetDialog start");
			
			this.inherited(arguments);

			console.debug("[RoadRoutingSummaries] resetDialog end");
		},

		addItem: function(event)
		{
			console.debug("[RoadRoutingSummaries] addItem start");
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
			
			console.debug("[RoadRoutingSummaries] addItem end");
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
			console.debug("[RoadRoutingSummaries] validate start");
			var widget = dijit.byId("transport_by_road_delivery_places");
			if(widget && 
					(widget.store === null || 
						(widget.store && 
							(widget.store._arrayOfAllItems.length === 0 || (widget.store._arrayOfAllItems.length === 1 && widget.store._arrayOfAllItems[0] === null)))))
			{
				misys.dialog.show('ERROR', misys.getLocalization('transportByRailDelMandatoryError'));
				return;
			}
			if(this.validateDialog(true))
			{
				this.inherited(arguments);
			}
			console.debug("[RoadRoutingSummaries] validate end");
		},
		updateData : function()
		{    
			console.debug("[Road routing Summary Multimode] updateData start");
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
				var gridLineItemRoadRoutingSummary=dijit.byId("line_item_road_routing_summaries");
				if(gridLineItemRoadRoutingSummary && gridLineItemRoadRoutingSummary.store && gridLineItemRoadRoutingSummary.store._arrayOfTopLevelItems.length > 0){
					
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
			console.debug("[Road routing Summary Multimode] updateData end");
		}
	}
);