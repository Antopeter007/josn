dojo.provide("misys.admin.widget.Alert");
dojo.experimental("misys.admin.widget.Alert"); 

dojo.require("dijit._Contained");
dojo.require("dijit._Widget");

// our declared class
dojo.declare("misys.admin.widget.Alert",
		[ dijit._Widget, dijit._Contained ],
        // class properties:
        {
        	entity: '',
        	prod_code: '',
        	sub_prod_code: '',
        	address: '',
        	alertlanguage: '',
        	alert_type: '',
        	tnx_type_code: '',
        	issuer_abbv_name: '',
        	customer_abbv_name:'',
        	tnx_amount_sign:'',
        	tnx_currency:'',
        	tnx_amount:'',
        	prod_stat_code:''
       }
);