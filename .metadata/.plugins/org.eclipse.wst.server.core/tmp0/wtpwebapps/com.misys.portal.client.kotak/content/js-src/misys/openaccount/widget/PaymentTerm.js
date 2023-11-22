dojo.provide("misys.openaccount.widget.PaymentTerm");
dojo.experimental("misys.openacount.widget.PaymentTerm"); 

dojo.require("dijit._Contained");
dojo.require("dijit._Widget");
dojo.require("misys.layout.SimpleItem");

// our declared class
dojo.declare("misys.openaccount.widget.PaymentTerm",
	[ dijit._Widget, dijit._Contained, misys.layout.SimpleItem ],
	// class properties:
	{
		ref_id: '',
		tnx_id: '',
		payment_id: '',
		code: '',
		other_paymt_terms: '',
		nb_days: '',
		cur_code: '',
		amt: '',
		pct: '',
		code_desc: '',
		is_valid: "Y",
		itp_payment_amt: '',
		itp_payment_date: '',
		
		createItem: function()
		{
			var item = {
				ref_id: this.get('ref_id'),
				tnx_id: this.get('tnx_id'),
				payment_id: this.get('payment_id'),
				code: this.get('code'),
				other_paymt_terms: this.get('other_paymt_terms'),
				nb_days: this.get('nb_days'),
				cur_code: this.get('cur_code'),
				amt: this.get('amt'),
				pct: this.get('pct'),
				code_desc:this.get('code_desc'),
				is_valid: this.get('is_valid'),
				itp_payment_amt: this.get('itp_payment_amt'),
				itp_payment_date: this.get('itp_payment_date')
			};
			if(this.hasChildren && this.hasChildren())
    		{
				dojo.forEach(this.getChildren(), function(child){
					if (child.createItem)
					{
						item.push(child.createItem());
					}
				}, this);
    		}
    		return item;
		},

		constructor: function()
		{
			console.debug("[PaymentTerm] constructor");
		}
	}
);