dojo.provide("misys.admin.widget.AlertEntity");
dojo.experimental("misys.admin.widget.AlertEntity"); 

dojo.require("dijit._Contained");
dojo.require("dijit._Widget");

// our declared class
dojo.declare("misys.admin.widget.AlertEntity",
		[ dijit._Widget, dijit._Contained ],
        // class properties:
        {
	
        entity: '',
		prod_code: '',
		address: '',
		alertlanguage: '',
		alert_type: '',
		tnx_type_code: '',
		issuer_abbv_name: ''

       }
);