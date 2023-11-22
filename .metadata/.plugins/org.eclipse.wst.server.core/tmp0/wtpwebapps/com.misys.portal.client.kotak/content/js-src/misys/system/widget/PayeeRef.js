dojo.provide("misys.system.widget.PayeeRef");
dojo.experimental("misys.system.widget.PayeeRef"); 
dojo.require("dijit._Contained");
dojo.require("dijit._Container");
dojo.require("dijit._Widget");
dojo.require("misys.layout.SimpleItem");
// our declared class
dojo.declare("misys.system.widget.PayeeRef",
		[ dijit._Widget, dijit._Contained, dijit._Container, misys.layout.SimpleItem ],
	// class properties:
	{
		reference_id: '',	
		label: '',
		local_label: '',
		help_message: '',
		local_help_message: '',
		optional: '',
		validation_format: '',
		external_validation: '',
		input_in_type: '',
		field_type: '',
		constructor: function()
		{
			console.debug("[PayeeRef] constructor");
		}
	}
);