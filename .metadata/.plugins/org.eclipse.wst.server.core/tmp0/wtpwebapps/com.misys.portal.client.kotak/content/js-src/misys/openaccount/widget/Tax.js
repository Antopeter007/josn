dojo.provide("misys.openaccount.widget.Tax");
dojo.experimental("misys.openacount.widget.Tax"); 

dojo.require("dijit._Contained");
dojo.require("dijit._Widget");
dojo.require("misys.layout.SimpleItem");

// our declared class
dojo.declare("misys.openaccount.widget.Tax",
	[ dijit._Widget, dijit._Contained, misys.layout.SimpleItem ],
	// class properties:
	{
		tnx_id: '',
		ref_id: '',
		allowance_id: '',
		type: '',
		type_label: '',
		other_type: '',
		cur_code: '',
		amt: '',
		rate: '',
		is_valid: "Y",
		
		createItem: function()
		{
			var item = {
				ref_id: this.get('ref_id'),
				tnx_id: this.get('tnx_id'),
				allowance_id: this.get('allowance_id'),
				type: this.get('type'),
				type_label: this.get('type_label'),
				other_type: this.get('other_type'),
				cur_code: this.get('cur_code'),
				amt: this.get('amt'),
				rate: this.get('rate'),
				is_valid : this.get('is_valid')
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
			console.debug("[Tax] constructor");
		}
	}
);