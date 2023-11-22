dojo.provide("misys.openaccount.widget.SUserInformation");
dojo.experimental("misys.openacount.widget.SUserInformation"); 

dojo.require("dijit._Contained");
dojo.require("dijit._Widget");
dojo.require("misys.layout.SimpleItem");

// our declared class
dojo.declare("misys.openaccount.widget.SUserInformation",
	[ dijit._Widget, dijit._Contained, misys.layout.SimpleItem ],
	// class properties:
	{
	user_id: '',
	info_id: '',
	label: '',
	information: '',
	is_valid: "Y",
	
	createItem: function()
	{
		var item = {
			user_id: this.get('user_id'),
			info_id: this.get('info_id'),
			label: this.get('label'),
			information: this.get('information'),
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
			console.debug("[SUserInformation] constructor");
		}
	}
);