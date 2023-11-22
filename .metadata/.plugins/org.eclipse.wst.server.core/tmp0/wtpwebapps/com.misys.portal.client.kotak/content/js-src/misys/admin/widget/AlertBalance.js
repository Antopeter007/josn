dojo.provide("misys.admin.widget.AlertBalance");
dojo.experimental("misys.admin.widget.AlertBalance"); 

dojo.require("dijit._Contained");
dojo.require("dijit._Widget");

// our declared class
dojo.declare("misys.admin.widget.AlertBalance",
		[ dijit._Widget, dijit._Contained ],
        // class properties:
        {
        entity: '',
		address: '',
		alertlanguage: '',
		alert_type: '',
		bank_abbv_name: '',
		customer_abbv_name:'',
		account_num:'',
		threshold_cur:'',
		threshold_amt:'',
		threshold_sign:''

       }
);