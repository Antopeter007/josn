dojo.provide("misys.openaccount.widget.PaymentObligation");
dojo.experimental("misys.openacount.widget.PaymentObligation"); 

dojo.require("dijit._Contained");
dojo.require("dijit._Container");
dojo.require("dijit._Widget");
dojo.require("misys.layout.SimpleItem");

/**
 * This class defines the widget to store the payment obligation detail for the transactions.
 */
dojo.declare("misys.openaccount.widget.PaymentObligation",
	[ dijit._Widget, dijit._Contained, dijit._Container, misys.layout.SimpleItem ],
	// class properties:
	{
		obligor_bank : "",
		recipient_bank : "",
		payment_obligation_amount : "",
		payment_obligation_percent : "",
		payment_charges_amount : "",
		payment_charges_percent : "",
		payment_expiry_date : "",
		applicable_law_country : "",
		creditor_agent_bic : "",
		creditor_agent_name : "",
		creditor_street_name : "",
		creditor_post_code_identification: "",
		creditor_town_name : "",
		creditor_country_sub_div : "",
		creditor_country : "",
		creditor_account_type_code :"",
		creditor_account_type_prop : "",
		creditor_account_id_iban : "",
		creditor_account_id_bban : "",
		creditor_account_id_upic : "",
		creditor_account_id_prop : "",
		creditor_account_cur_code : "",
		creditor_account_name: "",
		
		creditor_account_iban : "",
		creditor_account_bban : "",
		creditor_account_upic : "",
		creditor_account_prop : "",
		creditor_act_type_code : "",
		creditor_act_type_prop : "",
		
		oblg_amt :"",
		oblg_prct : "",
        settlement_bic :"",
        settlement_name_address : "",
        payment_obligations_paymnt_terms:"",
        buyer_bank_bpo:"",
		
		constructor: function()
		{
			console.debug("[PaymentObligation] constructor");
		},

		buildRendering: function()
		{
			console.debug("[PaymentObligation] buildRendering start");
			this.inherited(arguments);
			var children = this.getChildren();
			dojo.forEach(children, function(child){
				dojo.attr(child.domNode, 'style', {display: 'none'});
			});
			console.debug("[PaymentObligation] buildRendering end");
		},
		
		startup: function()
		{
			console.debug("[PaymentObligation] startup start");
			
			this.inherited(arguments);
			console.debug("[PaymentObligation] startup end");
		},
		
		createItem: function()
		{
			var paymntTermsText = this.get("payment_obligations_paymnt_terms");
			var paymntTermsObj = "";
			if(paymntTermsText){
				paymntTermsObj = new misys.openaccount.widget.BpoPaymentTerms();
				paymntTermsObj.createItemsFromJson(paymntTermsText);
			}
			
			var item = {
					
					obligor_bank											: this.get("obligor_bank"),
					recipient_bank  										: this.get("recipient_bank"),
					payment_obligation_amount								: this.get("payment_obligation_amount"),
					payment_obligation_percent								: this.get("payment_obligation_percent"),
					payment_charges_amount									: this.get("payment_charges_amount"),
					payment_charges_percent									: this.get("payment_charges_percent"),
					payment_expiry_date										: this.get("payment_expiry_date"),
					applicable_law_country									: this.get("applicable_law_country"),
					creditor_agent_bic										: this.get("creditor_agent_bic"),
					creditor_agent_name										: this.get("creditor_agent_name"),
					creditor_street_name									: this.get("creditor_street_name"),
					creditor_post_code_identification						: this.get("creditor_post_code_identification"),
					creditor_town_name										: this.get("creditor_town_name"),
					creditor_country_sub_div 								: this.get("creditor_country_sub_div"),
					creditor_country										: this.get("creditor_country"),
					creditor_account_type_code								: this.get("creditor_account_type_code"),
					creditor_account_type_prop								: this.get("creditor_account_type_prop"),
					creditor_account_id_iban 								: this.get("creditor_account_id_iban"),
					creditor_account_id_bban 								: this.get("creditor_account_id_bban"),
					creditor_account_id_upic 								: this.get("creditor_account_id_upic"),
					creditor_account_id_prop 								: this.get("creditor_account_id_prop"),
					creditor_account_cur_code								: this.get("creditor_account_cur_code"),
					creditor_account_name									: this.get("creditor_account_name"),
					buyer_bank_bpo											: this.get("buyer_bank_bpo"),
					
					settlement_bic 		: this.get("settlement_bic"),
			        settlement_name_address 	: this.get("settlement_name_address"),
			        creditor_account_iban		: this.get("creditor_account_iban"),
					creditor_account_bban 		: this.get("creditor_account_bban"),
					creditor_account_upic	 	: this.get("creditor_account_upic"),
					creditor_account_prop	 	: this.get("creditor_account_prop"),
					creditor_act_type_code 		: this.get("creditor_act_type_code"),
					creditor_act_type_prop 		: this.get("creditor_act_type_prop"),
					payment_obligations_paymnt_terms:""
			};
			if(this.hasChildren && this.hasChildren())
    		{
				dojo.forEach(this.getChildren(), function(child){
					if (child.createItem)
					{
						var items = child.createItem();
						if (items != null)
						{
							dojo.mixin(item, items);
						}
					}
				}, this);
    		}
    		return item;
		}
	}
);