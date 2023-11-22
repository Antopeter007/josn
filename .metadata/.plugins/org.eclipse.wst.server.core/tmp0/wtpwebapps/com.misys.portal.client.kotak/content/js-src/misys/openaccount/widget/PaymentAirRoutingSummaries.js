dojo.provide("misys.openaccount.widget.PaymentAirRoutingSummaries");
dojo.experimental("misys.openaccount.widget.PaymentAirRoutingSummaries"); 

dojo.require("misys.grid.GridMultipleItems");
dojo.require("misys.openaccount.widget.PaymentRoutingSummary");

// our declared class
dojo.declare("misys.openaccount.widget.PaymentAirRoutingSummaries",
		[ misys.grid.GridMultipleItems ],
		// class properties:
		{
		data: { identifier: "store_id", label: "store_id", items: [] },
		templatePath: null,
		templateString: dojo.byId("payment-routing-summary-air-template") ? dojo.byId("payment-routing-summary-air-template").innerHTML : "",
		dialogId: "payment-routing-summary-air-dialog-template",
		xmlTagName: "",
		xmlSubTagName: "",
		
		gridColumns: ["payment_transport_air_carrier_name","payment_transport_dept_airport_code","payment_transport_dept_air_town","payment_transport_dept_airport_name",
		              "payment_transport_dest_airport_code","payment_transport_dest_air_town","payment_transport_dest_airport_name"],
        
		propertiesMap: {
			payment_transport_air_carrier_name: {_fieldName: "payment_transport_air_carrier_name"},
			payment_transport_dept_airport_code: {_fieldName: "payment_transport_dept_airport_code"},
			payment_transport_dept_air_town: {_fieldName: "payment_transport_dept_air_town"},
			payment_transport_dept_airport_name: {_fieldName: "payment_transport_dept_airport_name"},
			payment_transport_dest_airport_code: {_fieldName: "payment_transport_dest_airport_code"},
			payment_transport_dest_air_town: {_fieldName: "payment_transport_dest_air_town"},
			payment_transport_dest_airport_name: {_fieldName: "payment_transport_dest_airport_name"}
		},
        
		layout: [
				{ name: "Air Carrier Name", field: "payment_transport_air_carrier_name", width: "75%" },
				{ name: " ", field: "actions", formatter: misys.grid.formatReportActions, width: "10%" },
				{ name: "Id", field: "store_id", headerStyles: "display:none", cellStyles: "display:none" }
				],
				
        
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

			this.inherited(arguments);
			
			console.debug("[AirRoutingSummaries] addItem end");
		},
		
		createDataGrid: function()
		{
			this.inherited(arguments);
			var grid = this.grid;
			var widgetAir = dijit.byId("payment_air_routing_summaries");
			/*var widgetSea = dijit.byId("sea_routing_summaries");
			var widgetRoad = dijit.byId("road_routing_summaries");
			var widgetRail = dijit.byId("rail_routing_summaries");*/

		},
		
		performValidation: function()
		{
			console.debug("[AirRoutingSummaries] validate start");

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
			var widgetAir = dijit.byId("payment_air_routing_summaries");
			/*var widgetSea = dijit.byId("sea_routing_summaries");
			var widgetRoad = dijit.byId("road_routing_summaries");
			var widgetRail = dijit.byId("rail_routing_summaries");
*/
			
			console.debug("[Air routing Summary Multimode] updateData end");
		}
	}
);