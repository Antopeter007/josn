dojo.provide("misys.openaccount.widget.PaymentTransportFreightCharge");
dojo.experimental("misys.openacount.widget.PaymentTransportFreightCharge"); 

dojo.require("dijit._Contained");
dojo.require("dijit._Widget");
dojo.require("misys.layout.SimpleItem");

// our declared class
dojo.declare("misys.openaccount.widget.PaymentTransportFreightCharge",
	[ dijit._Widget, dijit._Contained, misys.layout.SimpleItem ],
	// class properties:
	{
		type: "",
		type_label: "",
		other_type: "",
		cur_code: "",
		type_hidden : "",
		amt: "",
		
		createItem: function()
		{
			var item = {
				type: this.get("type"),
				type_label : this.get("type_label"),
				other_type: this.get("other_type"),
				cur_code: this.get("cur_code"),
				type_hidden: this.get("type_hidden"),
				amt: this.get("amt")
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
			console.debug("[PaymentTransportFreightCharge] constructor");
		}
	}
);