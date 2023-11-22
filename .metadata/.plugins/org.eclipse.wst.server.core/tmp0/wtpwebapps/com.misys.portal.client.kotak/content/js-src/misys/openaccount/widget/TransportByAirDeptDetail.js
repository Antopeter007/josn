dojo.provide("misys.openaccount.widget.TransportByAirDeptDetail");
dojo.experimental("misys.openacount.widget.TransportByAirDeptDetail"); 

dojo.require("dijit._Contained");
dojo.require("dijit._Widget");
dojo.require("misys.layout.SimpleItem");

// our declared class
dojo.declare("misys.openaccount.widget.TransportByAirDeptDetail",
	[ dijit._Widget, dijit._Contained, misys.layout.SimpleItem ],
	// class properties:
	{

		ref_id: '',
		tnx_id: '',
		departure_airport_code: '',
		departure_air_town: '',
		departure_airport_name: '',
		is_valid: "Y",
		routing_summary_sub_type: '',
		routing_summary_id: '',
			
		createItem: function()
		{
			var item = {
				departure_airport_code: this.get('departure_airport_code'),
				departure_air_town: this.get('departure_air_town'),
				departure_airport_name: this.get('departure_airport_name'),
				tnx_id: this.get('tnx_id'),
				ref_id: this.get('ref_id'),
				is_valid: this.get('is_valid'),
				routing_summary_sub_type: this.get('routing_summary_sub_type'),
				routing_summary_id: this.get('routing_summary_id')
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
			console.debug("[TransportByAirDeptDetail] constructor");
		}
	}
);