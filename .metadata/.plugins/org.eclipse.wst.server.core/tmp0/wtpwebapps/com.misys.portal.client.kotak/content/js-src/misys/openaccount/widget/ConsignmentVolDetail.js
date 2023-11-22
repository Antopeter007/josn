dojo.provide("misys.openaccount.widget.ConsignmentVolDetail");
dojo.experimental("misys.openacount.widget.ConsignmentVolDetail"); 

dojo.require("dijit._Contained");
dojo.require("dijit._Widget");
dojo.require("misys.layout.SimpleItem");

dojo.declare("misys.openaccount.widget.ConsignmentVolDetail",
	[ dijit._Widget, dijit._Contained, misys.layout.SimpleItem ],
	// class properties:
	{
	pmt_tds_vol_unit_measr_code: "",
	pmt_tds_vol_unit_measr_other: "",
	pmt_tds_vol_val:"",
	type: '',
	type_label: '',
	other_type: '',
		is_valid: "Y",
		
		createItem: function()
		{
			var item = {
					pmt_tds_vol_unit_measr_code: this.get("pmt_tds_vol_unit_measr_code"),
					pmt_tds_vol_unit_measr_other: this.get("pmt_tds_vol_unit_measr_other"),
					pmt_tds_vol_val:this.get("pmt_tds_vol_val"),
					type: this.get('type'),
					type_label: this.get('type_label'),
					other_type: this.get('other_type'),
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
			console.debug("[ConsignmentVolDetail] constructor");
		}
	}
);