dojo.provide("misys.admin.widget.AlertCalendar");
dojo.experimental("misys.admin.widget.AlertCalendar"); 

dojo.require("dijit._Contained");
dojo.require("dijit._Widget");

// our declared class
dojo.declare("misys.admin.widget.AlertCalendar",
		[ dijit._Widget, dijit._Contained ],
        // class properties:
        {
        
		prod_code: '',
		customer_abbv_name:'',
		address: '',
		alertlanguage: '',
		alert_type: '',
		date_code: '',
		offset: '',
		offsetsign: '',
		issuer_abbv_name: ''

       }
);