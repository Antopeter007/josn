dojo.provide("misys.system.widget.Account");
dojo.experimental("misys.system.widget.Account"); 

dojo.require("dijit._Contained");
dojo.require("dijit._Widget");

// our declared class
dojo.declare("misys.system.widget.Account",
	[ dijit._Widget, dijit._Contained ],
	// class properties:
	{
		account_number: '',
		nickname:'',
		account_name:'',
		bank_abbv_name: '',
		type:'',
		ccy:'',
		nra:'',
		description:'',
		account_product_type:'',
		cust_account_type:'',
		bank_id:'',
		branch_code:'',
		account_type:'',
		created_dttm:'',
		routing_bic:'',
		customer_reference:'',
		actv_flag:'',
		start_date:'',
		end_date:'',
		principal_amount:'',
		maturity_amount:'',
		interest_rate_credit:'',
		interest_rate_debit:'',
		interest_rate_maturity:'',
		owner_type:'',
		displayed_owner_type:'',
		settlement_means:'',
		sweeping_enabled:'',
		pooling_enabled:'',
		charge_account_for_liq:'',
		
		startup: function()
		{
			if(this._started) { return; }
			console.debug("[Account] startup start");
			this.inherited(arguments);
			console.debug("[Account] startup end");
		}
		
	
	}
);