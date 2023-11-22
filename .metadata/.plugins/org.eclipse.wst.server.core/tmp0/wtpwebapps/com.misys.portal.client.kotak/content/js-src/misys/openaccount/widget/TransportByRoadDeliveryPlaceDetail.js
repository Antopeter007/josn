dojo.provide("misys.openaccount.widget.TransportByRoadDeliveryPlaceDetail");
dojo.experimental("misys.openacount.widget.TransportByRoadDeliveryPlaceDetail"); 

dojo.require("dijit._Contained");
dojo.require("dijit._Widget");
dojo.require("misys.layout.SimpleItem");

// our declared class
dojo.declare("misys.openaccount.widget.TransportByRoadDeliveryPlaceDetail",
	[ dijit._Widget, dijit._Contained, misys.layout.SimpleItem ],
	// class properties:
	{
	ref_id: '',
	tnx_id: '',
	road_delivery_place_name: '',
	is_valid: "Y",
	routing_summary_sub_type: '',
	routing_summary_id: '',
		
		createItem: function()
		{
			var item = {
					road_delivery_place_name	: this.get("road_delivery_place_name"),
					tnx_id: this.get('tnx_id'),
					ref_id: this.get('ref_id'),
					is_valid: this.get('is_valid'),
					routing_summary_sub_type: this.get('routing_summary_sub_type'),
					routing_summary_id: this.get('routing_summary_id')
			};
    		return item;
		},

		constructor: function()
		{
			console.debug("[TransportByRoadDeliveryPlaceDetail] constructor");
		}
	}
);