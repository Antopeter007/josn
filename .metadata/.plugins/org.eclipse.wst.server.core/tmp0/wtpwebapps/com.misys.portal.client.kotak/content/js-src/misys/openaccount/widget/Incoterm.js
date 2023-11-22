dojo.provide("misys.openaccount.widget.Incoterm");
dojo.experimental("misys.openacount.widget.Incoterm"); 

dojo.require("dijit._Contained");
dojo.require("dijit._Widget");
dojo.require("misys.layout.SimpleItem");

/**
 * This class defines the widget to store the incoterm detail for the transactions.
 */
dojo.declare("misys.openaccount.widget.Incoterm",
	[ dijit._Widget, dijit._Contained, misys.layout.SimpleItem ],
	// class properties:
	{
		ref_id: '',
		tnx_id: '',
		//company_id: '',
		inco_term_id: '',
		code: '',
		code_label: '',
		other: '',
		location: '',
		is_valid: "Y",
		
		createItem: function()
		{
			var item = {
				ref_id: this.get('ref_id'),
				tnx_id: this.get('tnx_id'),
				//company_id: this.('company_id'),
				inco_term_id: this.get('inco_term_id'),
				code: this.get('code'),
				code_label: this.get('code_label'),
				other: this.get('other'),
				location: this.get('location'),
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
			console.debug("[Incoterm] constructor");
		}
	}
);