dojo.provide("misys.openaccount.widget.PaymentRoadRoutingSummaries");
dojo.experimental("misys.openaccount.widget.PaymentRoadRoutingSummaries"); 

dojo.require("misys.grid.GridMultipleItems");
dojo.require("misys.openaccount.widget.PaymentRoutingSummary");

// our declared class
dojo.declare("misys.openaccount.widget.PaymentRoadRoutingSummaries",
		[ misys.grid.GridMultipleItems ],
		// class properties:
		{
	data: { identifier: "store_id", label: "store_id", items: [] },
	templatePath: null,
	templateString: dojo.byId("payment-routing-summary-road-template") ? dojo.byId('payment-routing-summary-road-template').innerHTML : "",
			dialogId: 'payment-routing-summary-road-dialog-template',
			xmlTagName: "",
			xmlSubTagName: "",
			
			gridColumns: ["payment_transport_road_carrier_name", "payment_transport_road_place_of_receipt", "payment_transport_road_place_of_delivery"],
	        
			propertiesMap: {
				payment_transport_road_carrier_name: {_fieldName: 'payment_transport_road_carrier_name'},
				payment_transport_road_place_of_receipt: {_fieldName: 'payment_transport_road_place_of_receipt'},
				payment_transport_road_place_of_delivery: {_fieldName: 'payment_transport_road_place_of_delivery'}
				},

		layout: [
				{ name: "Road Carrier Name", field: "payment_transport_road_carrier_name", width: "75%" },
				{ name: " ", field: "actions", formatter: misys.grid.formatReportActions, width: "10%" },
				{ name: "Id", field: "store_id", headerStyles: "display:none", cellStyles: "display:none" }
				],
				
        
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

			this.inherited(arguments);
			
			console.debug("[RoadRoutingSummaries] addItem end");
		},
		
		createDataGrid: function()
		{
			this.inherited(arguments);
			var grid = this.grid;
			var widgetAir = dijit.byId("payment_air_routing_summaries");
			var widgetSea = dijit.byId("payment_sea_routing_summaries");
			var widgetRoad = dijit.byId("payment_road_routing_summaries");
			var widgetRail = dijit.byId("payment_rail_routing_summaries");
			misys.connect(grid, "onDelete",
					function(){
						misys.dialog.connect(dijit.byId("okButton"), "onMouseUp", function(){
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
			var widgetAir = dijit.byId("payment_air_routing_summaries");
			var widgetSea = dijit.byId("payment_sea_routing_summaries");
			var widgetRoad = dijit.byId("payment_road_routing_summaries");
			var widgetRail = dijit.byId("payment_rail_routing_summaries");
			
			if(dijit.byId("tran_ship_2") && dijit.byId("tran_ship_2").get("checked") === true){
				
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
			console.debug("[Road routing Summary Multimode] updateData end");
		}
	}
);