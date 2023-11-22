dojo.provide("misys.report.widget.Column");
dojo.experimental("misys.report.widget.Column"); 

dojo.require("dijit._Contained");
dojo.require("dijit._Widget");
dojo.require("misys.layout.SimpleItem");

// our declared class
dojo.declare("misys.report.widget.Column",
	[ dijit._Widget, dijit._Contained, misys.layout.SimpleItem ],
	// class properties:
	{
        
		column: '',
		label_en: '',
		label_ar: '',
		label_fr: '',
		label_us: '',
		label_it: '',
		label_nl: '',
		label_pt: '',
		label_br: '',
		label_de: '',
		label_zh: '',
		label_ca: '',
		label_es: '',
		label_th: '',
		alignment: '',
		width: '',
		eqv_cur_code: '',
		open_details_window: '',
		abbreviation: '',
		computed_field_id: '',
		operation: '',
		operand: '',
		
		constructor: function()
		{
			console.debug("[Column] constructor");
		}
	}
);