dojo.provide("misys.liquidity.widget.BalGroup");
dojo.require("dijit._Contained");
dojo.require("dijit._Container");
dojo.require("dijit._Widget");
dojo.require("misys.layout.SimpleItem");
/**
 * This class defines the widget to store the line item detail for the transactions.
 */
dojo.declare("misys.liquidity.widget.BalGroup",
	[ dijit._Widget, dijit._Contained, dijit._Container, misys.layout.SimpleItem ],
	// class properties:
	{
	    group_code: "",
	    structure_code: "",
	    description: "",
	    frequency: "",
	    frequency_label:"",
	    balance_type: "",
	    balance_type_label:"",
	    currency: "",
	    currency_label:"",
	    minimum: "",
	    rounding: "",
	    group_order: "",	
	    company_id:"",
	    structure_id: "",
	    group_id: "",		
	    sub_group_identifiers:"",
	   
		constructor: function()
		{
			console.debug("[BalGroup] constructor");
		},

		buildRendering: function()
		{
			console.debug("[BalGroup] buildRendering start");
			this.inherited(arguments);
			var children = this.getChildren();
			dojo.forEach(children, function(child){
				dojo.attr(child.domNode, "style", {display: "none"});
			});
			console.debug("[BalGroup] buildRendering end");
		},
		
		startup: function()
		{
			console.debug("[BalGroup] startup start");
			
			this.inherited(arguments);
			console.debug("[BalGroup] startup end");
		},
		
		createItem: function()
		{
			
			var subgrpText = this.get("sub_group_identifiers");
			var sungrpIdObj = "";
			if(subgrpText){
				sungrpIdObj = new misys.liquidity.widget.BalSubGroups();
				sungrpIdObj.createItemsFromJson(subgrpText);

			}
			
			var item = {
				group_code: this.get("group_code"),
			    structure_code: this.get("structure_code"),
			    description: this.get("description"),
			    frequency:  this.get("frequency"),
			    frequency_label:this.get("frequency_label"),
			    balance_type: this.get("balance_type"),
			    balance_type_label:this.get("balance_type_label"),
			    currency: this.get("currency"),
			    currency_label: this.get("currency_label"),
			    minimum: this.get("minimum"),
			    rounding: this.get("rounding"),
			    group_order: this.get("group_order"),
			    company_id: this.get("company_id"),
			    structure_id: this.get("structure_id"),
			    group_id:this.get("group_id"),
			    sub_group_identifiers:""
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