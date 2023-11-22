dojo.provide("misys.openaccount.widget.ContactDetail");
dojo.experimental("misys.openacount.widget.ContactDetail"); 

dojo.require("dijit._Contained");
dojo.require("dijit._Widget");
dojo.require("misys.layout.SimpleItem");

// our declared class
dojo.declare("misys.openaccount.widget.ContactDetail",
	[ dijit._Widget, dijit._Contained, misys.layout.SimpleItem ],
	// class properties:
	{
		ctcprsn_id: '',
		type: '',
		type_decode: '',
		bic: '',
		name_prefix: '',
		name_value: '',
		given_name: '',
		role: '',
		phone_number: '',
		fax_number: '',
		email: '',
		is_valid: "Y",
		
		createItem: function()
		{
			var item = {
				ctcprsn_id: this.get('ctcprsn_id'),
				type: this.get('type'),
				type_decode: this.get('type_decode'),
				bic: this.get('bic'),
				name_prefix: this.get('name_prefix'),
				name_value: this.get('name_value'),
				given_name: this.get('given_name'),
				role: this.get('role'),
				phone_number: this.get('phone_number'),
				fax_number: this.get('fax_number'),
				email: this.get('email'),
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
			console.debug("[ContactDetail] constructor");
		}
	}
);