dojo.provide("misys.openaccount.widget.PaymentCertificateAddtnlInf");
dojo.experimental("misys.openacount.widget.PaymentCertificateAddtnlInf"); 

dojo.require("dijit._Contained");
dojo.require("dijit._Widget");
dojo.require("misys.layout.SimpleItem");

// our declared class
dojo.declare("misys.openaccount.widget.PaymentCertificateAddtnlInf",
	[ dijit._Widget, dijit._Contained, misys.layout.SimpleItem ],
	// class properties:
	{
		payment_ceds_addtl_inf: '',
		is_valid: "Y",
		
		createItem: function()
		{
			var item = {
					payment_ceds_addtl_inf: this.get('payment_ceds_addtl_inf'),
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
			console.debug("[PaymentCertificateAddtnlInf] constructor");
		}
	}
);