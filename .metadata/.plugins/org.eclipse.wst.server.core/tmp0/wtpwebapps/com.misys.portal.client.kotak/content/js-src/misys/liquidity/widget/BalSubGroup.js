dojo.provide("misys.liquidity.widget.BalSubGroup");
dojo.require("dijit._Contained");
dojo.require("dijit._Container");
dojo.require("dijit._Widget");
dojo.require("misys.layout.SimpleItem");

/**
 * This class defines the widget to store the Balancing Sub Group  detail .
 */
dojo.declare("misys.liquidity.widget.BalSubGroup",
		[ dijit._Widget, dijit._Contained, dijit._Container, misys.layout.SimpleItem ],
	// class properties:
	{
	    sub_group_code: "",
	    group_code: "",
	    company_id: "",
	    subgrp_description: "",
	    subGrpPivot: "",
	    subgrppivot_label:"",
	    subGrpType: "",
	    subGrp_label:"",
	    balance_target: "",
	    low_balance_target: "",
	    high_balance_target: "",	
	    low_target: "",
	    high_target: "",	
	    sub_group_id:"",
	    group_id: "",
	    indirect: "",	    
	    bal_account_identifiers:"",
		
	    constructor: function()
		{
			console.debug("[BalSubGroup] constructor");
			this.inherited(arguments);
		},
		
		buildRendering: function()
		{
			console.debug("[BalSubGroup] buildRendering start");
			this.inherited(arguments);
			var children = this.getChildren();
			dojo.forEach(children, function(child){
				dojo.attr(child.domNode, 'style', {display: 'none'});
			});
			console.debug("[BalSubGroup] buildRendering end");
		},
		
		startup: function()
		{
			console.debug("[BalSubGroup] startup start");
			
			this.inherited(arguments);
			console.debug("[BalSubGroup] startup end");
		},
		
		createItem: function()
		{
			var balAccountText = this.get("bal_account_identifiers");
			var balAccountObj = "";
			if(balAccountText){
				balAccountObj = new misys.liquidity.widget.BalAccounts();
				balAccountObj.createItemsFromJson(balAccountText);
			}
			var item = {
				sub_group_code: this.get("sub_group_code"),
				group_code: this.get("group_code"),
				company_id: this.get("company_id"),
				subgrp_description:  this.get("subgrp_description"),
				subGrpPivot: this.get("subGrpPivot"),
				subgrppivot_label: this.get("subgrppivot_label"),
				subGrpType: this.get("subGrpType"),
				subGrp_label:this.get("subGrp_label"),
				balance_target: this.get("balance_target"),
				low_balance_target: this.get("low_balance_target"),
				high_balance_target: this.get("high_balance_target"),
				low_target: this.get("low_target"),
				high_target: this.get("high_target"),
				sub_group_id: this.get("sub_group_id"),
				group_id: this.get("group_id"),
				indirect: this.get("indirect"),
			    bal_account_identifiers:""			  	
			};
			if(this.hasChildren && this.hasChildren())
    		{
				dojo.forEach(this.getChildren(), function(child){
					if (child.createItem)
					{
						var items = child.createItem();
						if (items !== null)
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