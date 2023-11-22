var parmtr ="misys.report.widget.Parameter";
dojo.provide(parmtr);
dojo.experimental(parmtr); 

dojo.require("dijit._Contained");
dojo.require("dijit._Widget");
dojo.require("misys.layout.SimpleItem");

// our declared class
dojo.declare(parmtr,
		[ dijit._Widget, dijit._Contained, misys.layout.SimpleItem ],
        // class properties:
        {
        
	    parameter_name: '',
	    label_en: '',
		label_fr: '',
		label_ar: '',
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
		mandatory: '',
		
		// Default values
		default_string_value: '',
		default_number_value: '',
		default_amount_value: '',
		default_values_set: '',
		
		default_date_type: '',
		current_date_offset_type: '',
		current_date_offset_days: '',
		first_day_offset_type: '',
		first_day_offset_days: '',
		last_day_offset_type: '',
		last_day_offset_days: '',
		default_date_value: ''
	}
);