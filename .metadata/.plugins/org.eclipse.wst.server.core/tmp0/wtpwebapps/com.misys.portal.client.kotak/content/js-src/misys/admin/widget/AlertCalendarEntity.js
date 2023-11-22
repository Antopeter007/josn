dojo.provide("misys.admin.widget.AlertCalendarEntity");
dojo.experimental("misys.admin.widget.AlertCalendarEntity"); 

dojo.require("dijit._Contained");
dojo.require("dijit._Widget");

// our declared class
dojo.declare("misys.admin.widget.AlertCalendarEntity",
		[ dijit._Widget, dijit._Contained ],
        // class properties:
        {
        entity: '',
		prod_code: '',
		address: '',
		alertlanguage: '',
		alert_type: '',
		date_code: '',
		offset: '',
		offsetsign: '',
		issuer_abbv_name: ''

       }
);