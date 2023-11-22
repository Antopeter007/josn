dojo.provide("misys.openaccount.widget.EntitiesToBeReportedDetail");
dojo.experimental("misys.openacount.widget.EntitiesToBeReportedDetail"); 

dojo.require("dijit._Contained");
dojo.require("dijit._Widget");
dojo.require("misys.layout.SimpleItem");

// our declared class
dojo.declare("misys.openaccount.widget.EntitiesToBeReportedDetail",
	[ dijit._Widget, dijit._Contained, misys.layout.SimpleItem ],
	// class properties:
	{
		BIC: "",
				
		createItem: function()
		{
			var item = {
				BIC: this.get("BIC")
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
			console.debug("[Entities To Be Reported] constructor");
		}
	}
);