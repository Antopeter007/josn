dojo.provide("misys.admin.widget.AlertTransaction");
dojo.experimental("misys.admin.widget.AlertTransaction"); 

dojo.require("dijit._Contained");
dojo.require("dijit._Widget");

// our declared class
dojo.declare("misys.admin.widget.AlertTransaction",
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
		credit_cur:'',
		credit_amt:'',
		debit_cur:'',
		debit_amt:''

       }
);