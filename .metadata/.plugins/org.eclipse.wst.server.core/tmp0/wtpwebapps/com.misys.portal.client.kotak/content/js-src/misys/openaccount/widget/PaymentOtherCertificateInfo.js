dojo.provide("misys.openaccount.widget.PaymentOtherCertificateInfo");
dojo.experimental("misys.openacount.widget.PaymentOtherCertificateInfo"); 

dojo.require("dijit._Contained");
dojo.require("dijit._Widget");
dojo.require("misys.layout.SimpleItem");

// our declared class
dojo.declare("misys.openaccount.widget.PaymentOtherCertificateInfo",
	[ dijit._Widget, dijit._Contained, misys.layout.SimpleItem ],
	// class properties:
	{
		payment_other_cert_info: "",
		
		createItem: function()
		{
			var item = {
					payment_other_cert_info: this.get("payment_other_cert_info")
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
			console.debug("[PaymentOtherCertificateInfo] constructor");
		}
	}
);