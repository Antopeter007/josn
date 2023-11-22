dojo.provide("misys.liquidity.widget.BalAccount");
dojo.require("dijit._Contained");
dojo.require("dijit._Container");
dojo.require("dijit._Widget");
dojo.require("misys.layout.SimpleItem");

/**
 * This class define the widget to store the Balancing Account details.  
 */
dojo.declare("misys.liquidity.widget.BalAccount",
	[ dijit._Widget, dijit._Contained, misys.layout.SimpleItem ],
	// class properties:
	{
        sub_group_code:"",
        account_no: "",
        account_id: "",
	    company_id: "",
	    sub_group_id: "",
	    sub_group_pivot: "",
	    acctsubgrppivot_label:"",
	    description: "",
	    		   	
	    constructor: function()
		{
			console.debug("[BalAccount] constructor");
		//	this.inherited(arguments);
		},
		
		createItem: function()
		{
			var item = {
				sub_group_code: this.get("sub_group_code"),
				account_no: this.get("account_no"),
				account_id: this.get('account_id'),
				company_id: this.get("company_id"),
				sub_group_id:  this.get("sub_group_id"),
				sub_group_pivot: this.get("sub_group_pivot"),
				acctsubgrppivot_label: this.get("acctsubgrppivot_label"),
				description: this.get("acctdesc")
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
		}
	}
);