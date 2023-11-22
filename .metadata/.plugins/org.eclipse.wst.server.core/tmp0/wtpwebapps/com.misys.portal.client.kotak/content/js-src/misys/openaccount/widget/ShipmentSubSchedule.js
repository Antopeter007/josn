dojo.provide("misys.openaccount.widget.ShipmentSubSchedule");
dojo.experimental("misys.openacount.widget.ShipmentSubSchedule"); 

dojo.require("dijit._Contained");
dojo.require("dijit._Widget");
dojo.require("misys.layout.SimpleItem");

/**
 * This class defines the widget to store the shipment sub schedule detail for the transactions.
 */
dojo.declare("misys.openaccount.widget.ShipmentSubSchedule",
	[ dijit._Widget, dijit._Contained, misys.layout.SimpleItem ],
	// class properties:
	{
		ref_id: "",
		tnx_id: "",
		shipment_id: "",
		sub_shipment_quantity_value: "",
		schedule_earliest_ship_date: "",
		schedule_latest_ship_date: "",
		is_valid: "Y",
		
		createItem: function()
		{
			var item = {
				ref_id: this.get('ref_id'),
				tnx_id: this.get('tnx_id'),
				shipment_id: this.get('shipment_id'),
				sub_shipment_quantity_value: this.get('sub_shipment_quantity_value'),
				schedule_earliest_ship_date: this.get('schedule_earliest_ship_date'),
				schedule_latest_ship_date: this.get('schedule_latest_ship_date'),
				is_valid: this.get('is_valid')
			};
			if(this.hasChildren && this.hasChildren())
    		{
				dojo.forEach(this.getChildren(), function(child){
					if (child.createItem)
					{
						item.push(child.createItem());
					}
				}, this);
    		}
    		return item;
		},

		constructor: function()
		{
			console.debug("[ShipmentSubSchedule] constructor");
		}
	}
);