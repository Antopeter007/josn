dojo.provide("misys.widget.Amendment");
dojo.experimental("misys.widget.Amendment"); 

dojo.require("dijit._Contained");
dojo.require("dijit._Widget");
dojo.require("dijit._Templated");

// our declared class
dojo.declare("misys.widget.Amendment",
	[ dijit._Widget, dijit._Contained ],
	// class properties:
	{
		content: '',
		verb: '',
	
		constructor: function()
		{
			console.debug("[Amendment] constructor");
		}
	}
);