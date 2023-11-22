dojo.provide("misys.openaccount.widget.Payment");
dojo.experimental("misys.openacount.widget.Payment"); 

dojo.require("dijit._Contained");
dojo.require("dijit._Widget");
dojo.require("misys.layout.SimpleItem");

// our declared class
dojo.declare("misys.openaccount.widget.Payment",
	[ dijit._Widget, dijit._Contained, misys.layout.SimpleItem ],
	// class properties:
	{
		ref_id: '',
		tnx_id: '',
		payment_id: '',
		payment_date: '',
		code: '',
		label: '',
		other_paymt_terms: '',
		nb_days: '',
		cur_code: '',
		amt: '',
		pct: '',
		is_valid: "Y",
		
		createItem: function()
		{
			var item = {
				ref_id: this.get('ref_id'),
				tnx_id: this.get('tnx_id'),
				payment_id: this.get('payment_id'),
				payment_date:this.get('payment_date'),
				code: this.get('code'),
				label: this.get('label'),
				other_paymt_terms: this.get('other_paymt_terms'),
				nb_days: this.get('nb_days'),
				cur_code: this.get('cur_code'),
				amt: this.get('amt'),
				pct: this.get('pct'),
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
			console.debug("[Payment] constructor");
		}
	}
);