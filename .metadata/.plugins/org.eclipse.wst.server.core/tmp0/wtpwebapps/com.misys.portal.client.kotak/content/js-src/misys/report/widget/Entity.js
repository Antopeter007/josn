dojo.provide("misys.report.widget.Entity");
dojo.experimental("misys.report.widget.Entity"); 

dojo.require("dijit._Contained");
dojo.require("dijit._Widget");

// our declared class
dojo.declare("misys.report.widget.Entity",
	[ dijit._Widget, dijit._Contained ],
	// class properties:
	{
		abbv_name: '',
	
		constructor: function()
		{
			console.debug("[Entity] constructor");
		}
	}
);