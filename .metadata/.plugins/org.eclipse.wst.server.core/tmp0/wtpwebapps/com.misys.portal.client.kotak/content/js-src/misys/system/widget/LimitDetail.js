dojo.provide("misys.system.widget.LimitDetail");
dojo.experimental("misys.system.widget.LimitDetail"); 

dojo.require("dijit._Contained");
dojo.require("dijit._Widget");
dojo.require("misys.layout.SimpleItem");

// our declared class
dojo.declare("misys.system.widget.LimitDetail",
	[ dijit._Widget, dijit._Contained, misys.layout.SimpleItem ],
	// class properties:
	{
		product_code: "",
		product_code_label: "",
		sub_product_code: "",
		sub_product_code_label: "",
		product_type_code: "",
		product_type_code_label: "",
		product_template: "",

		beneficiary_name: "",
		beneficiary_country: "",
		limit_ref: "",
		limit_amt: "",
		limit_cur_code: "",
		limit_review_date: "",
		limit_pricing: "",
		
		limit_outstanding_amt: "",
		limit_pending_bank_amt: "",
		limit_pending_customer_amt: "",
		limit_utilised_amt: "",
		limit_utilised_percent: "",
		
		entity_avail_list_limit: "",
		entity_select_list_limit: "",
		existing_limit : "",
		limit_status :"",
		limit_status_label :"",
		limit_id :"",
		linked_entities_number :"",
				
		createItem: function()
		{
			var item = {
					product_code: this.get("product_code"),
					product_code_label: this.get("product_code_label"),
					sub_product_code: this.get("sub_product_code"),
					sub_product_code_label: this.get("sub_product_code_label"),
					product_type_code: this.get("product_type_code"),
					product_type_code_label: this.get("product_type_code_label"),
					product_template: this.get("product_template"),

					beneficiary_name: this.get("beneficiary_name"),
					beneficiary_country: this.get("beneficiary_country"),
					limit_ref: this.get("limit_ref"),
					limit_amt: this.get("limit_amt"),
					limit_cur_code: this.get("limit_cur_code"),
					limit_review_date: this.get("limit_review_date"),
					limit_pricing: this.get("limit_pricing"),
					
					limit_outstanding_amt: this.get("limit_outstanding_amt"),
					limit_pending_bank_amt: this.get("limit_pending_bank_amt"),
					limit_pending_customer_amt: this.get("limit_pending_customer_amt"),
					limit_utilised_amt: this.get("limit_utilised_amt"),
					limit_utilised_percent: this.get("limit_utilised_percent"),
					
					entity_avail_list_limit: this.get("entity_avail_list_limit"),
					entity_select_list_limit: this.get("entity_select_list_limit"),
					existing_limit : this.get("existing_limit"),
					limit_status : this.get("limit_status"),
					limit_status_label: this.get("limit_status_label"),
					limit_id : this.get("limit_id"),
					linked_entities_number : this.get("linked_entities_number")
				
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
			console.debug("[Limit Definition] constructor");
		}
	}
);