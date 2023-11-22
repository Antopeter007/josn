dojo.provide("misys.openaccount.widget.InsuranceRequiredClause");
dojo.experimental("misys.openacount.widget.InsuranceRequiredClause"); 

dojo.require("dijit._Contained");
dojo.require("dijit._Widget");
dojo.require("misys.layout.SimpleItem");

// our declared class
dojo.declare("misys.openaccount.widget.InsuranceRequiredClause",
	[ dijit._Widget, dijit._Contained, misys.layout.SimpleItem ],
	// class properties:
	{
	ids_clauses_required: "",
	ids_clauses_required_hidden: "",
		is_valid: "Y",
		
		createItem: function()
		{
			var item = {
					ids_clauses_required: this.get("ids_clauses_required"),
					ids_clauses_required_hidden: this.get("ids_clauses_required_hidden"),
				is_valid: this.get('is_valid')
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
			console.debug("[InsuranceRequiredClause] constructor");
		}
	}
);