dojo.provide("misys.report.widget.Aggregate");
dojo.experimental("misys.report.widget.Aggregate"); 

dojo.require("dijit._Contained");
dojo.require("dijit._Widget");
dojo.require("misys.layout.SimpleItem");

// our declared class
dojo.declare("misys.report.widget.Aggregate",
		[ dijit._Widget, dijit._Contained, misys.layout.SimpleItem ],
        // class properties:
        {
        
		column: '',
		type: '',
		eqv_cur_code: '',
		label_en: '',
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
		
    	constructor: function()
    	{
			console.debug("[Aggregate] constructor");
    	}
       }
);