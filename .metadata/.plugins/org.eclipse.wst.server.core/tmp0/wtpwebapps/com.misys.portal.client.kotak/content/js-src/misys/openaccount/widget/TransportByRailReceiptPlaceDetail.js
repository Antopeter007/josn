dojo.provide("misys.openaccount.widget.TransportByRailReceiptPlaceDetail");
dojo.experimental("misys.openacount.widget.TransportByRailReceiptPlaceDetail"); 

dojo.require("dijit._Contained");
dojo.require("dijit._Widget");
dojo.require("misys.layout.SimpleItem");

/**
 * This widget stores the shipment sub schedule details for the line item.
 */
dojo.declare("misys.openaccount.widget.TransportByRailReceiptPlaceDetail",
	[ dijit._Widget, dijit._Contained, misys.layout.SimpleItem ],
	// class properties:
	{
	ref_id: "",
	tnx_id: "",
	rail_receipt_place_name: "",
	is_valid: "Y",
	routing_summary_sub_type: "",
	routing_summary_id: "",
		
		createItem: function()
		{
			var item = {
					rail_receipt_place_name	: this.get("rail_receipt_place_name"),
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
			console.debug("[TransportByRailReceiptPlaceDetail] constructor");
		}
	}
);