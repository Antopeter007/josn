dojo.provide("misys.report.widget.Filters");
dojo.experimental("misys.report.widget.Filters"); 

dojo.require("misys.layout.MultipleItems");

// our declared class
dojo.declare("misys.report.widget.Filters",
        [ misys.layout.MultipleItems ],
        // class properties:
        {
		templatePath: null,
		templateString: dojo.byId("filters-template").innerHTML,
		
		xmlTagName: 'filters',

    	addItem: function(event)
    	{
    		console.debug("[Filters] addItem start");
    		var filterItem = new misys.report.widget.Filter({createdByUser: true}, document.createElement("div"));
    		this.addChild(filterItem);
    		this.renderSections();
    		console.debug("[Filters] addItem end");
    	},
    	
		startup: function()
		{
			console.debug("[Filters] startup start");
			this.inherited(arguments);
			console.debug("[Filters] startup end");
		}

    	
    }
);