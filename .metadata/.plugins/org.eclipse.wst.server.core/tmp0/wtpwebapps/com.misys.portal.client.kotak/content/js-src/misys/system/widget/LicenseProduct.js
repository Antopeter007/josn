dojo.provide("misys.system.widget.LicenseProduct");
dojo.experimental("misys.system.widget.LicenseProduct"); 

dojo.require("dijit._Contained");
dojo.require("dijit._Container");
dojo.require("dijit._Widget");
dojo.require("misys.layout.SimpleItem");

// our declared class
dojo.declare("misys.system.widget.LicenseProduct",
	[ dijit._Widget, dijit._Contained, misys.layout.SimpleItem ],
	// class properties:
	{
		product_code: '',
		sub_product_code: '',
		product_type_code: '',
		product_code_hidden: '',
		sub_product_code_hidden: '',
		product_type_code_hidden: '',
		
		constructor: function()
		{
			console.debug("[LicenseProduct] constructor");
		},

		createItem: function()
		{
			var item = {
				product_code: this.get('product_code'),
				sub_product_code: this.get('sub_product_code'),
				product_type_code: this.get('product_type_code'),
				product_code_hidden: this.get('product_code_hidden'),
				sub_product_code_hidden: this.get('sub_product_code_hidden'),
				product_type_code_hidden: this.get('product_type_code_hidden')
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