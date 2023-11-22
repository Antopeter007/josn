dojo.provide("misys.openaccount.widget.Adjustment");
dojo.experimental("misys.openacount.widget.Adjustment"); 

dojo.require("dijit._Contained");
dojo.require("dijit._Widget");
dojo.require("misys.layout.SimpleItem");

// our declared class
dojo.declare("misys.openaccount.widget.Adjustment",
	[ dijit._Widget, dijit._Contained, misys.layout.SimpleItem ],
	// class properties:
	{
		ref_id: "",
		tnx_id: "",
		allowance_id: "",
		type: "",
		type_label: "",
		other_type: "",
		direction: "",
		direction_label: "",
		cur_code: "",
		amt: "",
		rate: "",
		cn_reference_id : "",
		discount_exp_date : "",
		type_hidden : "",
		is_valid: "Y",
		
		createItem: function()
		{
			var item = {
				ref_id: this.get("ref_id"),
				tnx_id: this.get("tnx_id"),
				allowance_id: this.get("allowance_id"),
				type: this.get("type"),
				type_label: this.get("type_label"),
				other_type: this.get("other_type"),
				direction: this.get("direction"),
				direction_label: this.get("direction_label"),
				cur_code: this.get("cur_code"),
				amt: this.get("amt"),
				rate: this.get("rate"),
				cn_reference_id: this.get("cn_reference_id"),
				discount_exp_date: this.get("discount_exp_date"),
				type_hidden: this.get("type_hidden"),
				is_valid: this.get("is_valid")
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
		}
	}
);