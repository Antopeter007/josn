dojo.provide("misys.system.widget.BeneficiaryAdvicesTemplateColumn");
dojo.experimental("misys.system.widget.BeneficiaryAdvicesTemplateColumn"); 

dojo.require("dijit._Contained");
dojo.require("dijit._Widget");

// our declared class
dojo.declare("misys.system.widget.BeneficiaryAdvicesTemplateColumn",
	[ dijit._Widget, dijit._Contained ],
	// class properties:
	{
		label: '',
		type: '',
		type_label: '',
		alignment: '',
		width: '',
	
		constructor: function()
		{
			console.debug("[Customer] BeneficiaryAdvicesTemplateColumn.js constructor");
		}
	}
);