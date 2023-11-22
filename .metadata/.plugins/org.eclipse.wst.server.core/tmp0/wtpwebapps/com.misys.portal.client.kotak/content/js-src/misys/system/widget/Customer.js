dojo.provide("misys.system.widget.Customer");
dojo.experimental("misys.system.widget.Customer"); 

dojo.require("dijit._Contained");
dojo.require("dijit._Widget");

// our declared class
dojo.declare("misys.system.widget.Customer",
	[ dijit._Widget, dijit._Contained ],
	// class properties:
	{
		company_id: '',
		abbv_name: '',
		name_: '',
		entity: '',
		entity_id: '',
	
		constructor: function()
		{
			console.debug("[Customer] constructor");
		}
	}
);