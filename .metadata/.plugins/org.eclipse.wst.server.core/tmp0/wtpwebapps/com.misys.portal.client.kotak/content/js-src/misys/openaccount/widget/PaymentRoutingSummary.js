dojo.provide("misys.openaccount.widget.PaymentRoutingSummary");
dojo.experimental("misys.openacount.widget.PaymentRoutingSummary"); 

dojo.require("dijit._Contained");
dojo.require("dijit._Container");
dojo.require("dijit._Widget");
dojo.require("misys.layout.SimpleItem");

// our declared class
dojo.declare("misys.openaccount.widget.PaymentRoutingSummary",
	[ dijit._Widget, dijit._Contained, dijit._Container, misys.layout.SimpleItem ],
	// class properties:
	{
		payment_transport_air_carrier_name: "",
		payment_transport_dept_airport_code: "",
		payment_transport_dept_air_town: "",
		payment_transport_dept_airport_name: "",
		payment_transport_dest_airport_code: "",
		payment_transport_dest_air_town: "",
		payment_transport_dest_airport_name: "",
		payment_transport_sea_carrier_name: "",
		payment_transport_sea_loading_port: "",
		payment_transport_sea_discharge_port: "",
		payment_transport_sea_vessel_name: "",
		payment_transport_rail_carrier_name: "",
		payment_transport_rail_place_of_receipt: "",
		payment_transport_rail_place_of_delivery: "",
		payment_transport_road_carrier_name: "",
		payment_transport_road_place_of_receipt: "",
		payment_transport_road_place_of_delivery: "",
		
		constructor: function()
		{
			console.debug("[PaymentRoutingSummary] constructor");
		},

		buildRendering: function()
		{
			console.debug("[PaymentRoutingSummary] buildRendering start");
			this.inherited(arguments);
			var children = this.getChildren();
			dojo.forEach(children, function(child){
				dojo.attr(child.domNode, 'style', {display: 'none'});
			});
			console.debug("[PaymentRoutingSummary] buildRendering end");
		},
		
		startup: function()
		{
			console.debug("[PaymentRoutingSummary] startup start");
			this.inherited(arguments);
			console.debug("[PaymentRoutingSummary] startup end");
		},
		
		createItem: function()
		{
			
			var item = {
					
					payment_transport_air_carrier_name: this.get("payment_transport_air_carrier_name"),
					payment_transport_dept_airport_code: this.get("payment_transport_dept_airport_code"),
					payment_transport_dept_air_town: this.get("payment_transport_dept_air_town"),
					payment_transport_dept_airport_name: this.get("payment_transport_dept_airport_name"),
					payment_transport_dest_airport_code: this.get("payment_transport_dest_airport_code"),
					payment_transport_dest_air_town: this.get("payment_transport_dest_air_town"),
					payment_transport_dest_airport_name: this.get("payment_transport_dest_airport_name"),
					payment_transport_sea_carrier_name: this.get("payment_transport_sea_carrier_name"),
					payment_transport_sea_loading_port: this.get("payment_transport_sea_loading_port"),
					payment_transport_sea_discharge_port: this.get("payment_transport_sea_discharge_port"),
					payment_transport_sea_vessel_name: this.get("payment_transport_sea_vessel_name"),
					payment_transport_rail_carrier_name: this.get("payment_transport_rail_carrier_name"),
					payment_transport_rail_place_of_receipt: this.get("payment_transport_rail_place_of_receipt"),
					payment_transport_rail_place_of_delivery: this.get("payment_transport_rail_place_of_delivery"),
					payment_transport_road_carrier_name: this.get("payment_transport_road_carrier_name"),
					payment_transport_road_place_of_receipt: this.get("payment_transport_road_place_of_receipt"),
					payment_transport_road_place_of_delivery: this.get("payment_transport_road_place_of_delivery")
		
				};
			if(this.hasChildren && this.hasChildren())
    		{
				dojo.forEach(this.getChildren(), function(child){
					if (child.createItem)
					{
						var items = child.createItem();
						if (items != null)
						{
							dojo.mixin(item, items);
						}
					}
				}, this);
    		}
    		return item;
		}
	}
);