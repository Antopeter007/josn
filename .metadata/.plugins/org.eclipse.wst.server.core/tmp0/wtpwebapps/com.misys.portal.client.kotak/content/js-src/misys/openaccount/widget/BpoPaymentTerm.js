dojo.provide("misys.openaccount.widget.BpoPaymentTerm");
dojo.experimental("misys.openacount.widget.BpoPaymentTerm"); 

dojo.require("dijit._Contained");
dojo.require("dijit._Widget");
dojo.require("misys.layout.SimpleItem");

// our declared class
dojo.declare("misys.openaccount.widget.BpoPaymentTerm",
	[ dijit._Widget, dijit._Contained, misys.layout.SimpleItem ],
	// class properties:
	{
	 	pmt_code :'',
	 	pmt_other_term_code : '',
	 	payment_code : '',
	 	payment_nb_days : '',
	 	payment_other_term : '',
	 	payment_amount : '',
	 	payment_percent : '',
		is_valid: "Y",
		
		createItem: function()
		{
			var item = {
					pmt_code				: this.get('pmt_code'),
					pmt_other_term_code		: this.get('pmt_other_term_code'),
					payment_code			: this.get('payment_code'),
					payment_nb_days			: this.get('payment_nb_days'),
					payment_amount			: this.get('payment_amount'),
					payment_percent			: this.get('payment_percent'),
					payment_other_term		: this.get('payment_other_term'),
					is_valid				: this.get('is_valid')
			};
    		return item;
		},

		constructor: function()
		{
			console.debug("[BpoPaymentTerm] constructor");
		}
	}
);