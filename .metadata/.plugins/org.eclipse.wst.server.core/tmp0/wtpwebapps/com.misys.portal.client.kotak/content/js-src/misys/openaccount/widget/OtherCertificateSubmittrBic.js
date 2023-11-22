dojo.provide("misys.openaccount.widget.OtherCertificateSubmittrBic");
dojo.experimental("misys.openacount.widget.OtherCertificateSubmittrBic"); 

dojo.require("dijit._Contained");
dojo.require("dijit._Widget");
dojo.require("misys.layout.SimpleItem");

// our declared class
dojo.declare("misys.openaccount.widget.OtherCertificateSubmittrBic",
	[ dijit._Widget, dijit._Contained, misys.layout.SimpleItem ],
	// class properties:
	{
	ocds_bic: '',
		is_valid: "Y",
		
		createItem: function()
		{
			var item = {
					ocds_bic: this.get('ocds_bic'),
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
			console.debug("[OtherCertificateSubmittrBic] constructor");
		}
	}
);