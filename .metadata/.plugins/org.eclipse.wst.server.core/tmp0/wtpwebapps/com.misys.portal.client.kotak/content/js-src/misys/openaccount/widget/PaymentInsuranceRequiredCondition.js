dojo.provide("misys.openaccount.widget.PaymentInsuranceRequiredCondition");
dojo.experimental("misys.openacount.widget.PaymentInsuranceRequiredCondition"); 

dojo.require("dijit._Contained");
dojo.require("dijit._Widget");
dojo.require("misys.layout.SimpleItem");

// our declared class
dojo.declare("misys.openaccount.widget.PaymentInsuranceRequiredCondition",
	[ dijit._Widget, dijit._Contained, misys.layout.SimpleItem ],
	// class properties:
	{
	payment_ids_conditions_required:"",
	payment_ids_conditions_required_hidden:"",
		
		createItem: function()
		{
			var item = {
					payment_ids_conditions_required: this.get("payment_ids_conditions_required"),
					payment_ids_conditions_required_hidden: this.get("payment_ids_conditions_required_hidden")
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
			console.debug("[PaymentInsuranceRequiredCondition] constructor");
		}
	}
);