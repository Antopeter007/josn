dojo.provide("misys.openaccount.widget.CertificateSubmittrBic");
dojo.experimental("misys.openacount.widget.CertificateSubmittrBic"); 

dojo.require("dijit._Contained");
dojo.require("dijit._Widget");
dojo.require("misys.layout.SimpleItem");

// our declared class
dojo.declare("misys.openaccount.widget.CertificateSubmittrBic",
	[ dijit._Widget, dijit._Contained, misys.layout.SimpleItem ],
	// class properties:
	{
		ceds_bic: '',
		is_valid: "Y",
		
		createItem: function()
		{
			var item = {
				ceds_bic: this.get('ceds_bic'),
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
			console.debug("[InsuranceSubmittrBic] constructor");
		}
	}
);