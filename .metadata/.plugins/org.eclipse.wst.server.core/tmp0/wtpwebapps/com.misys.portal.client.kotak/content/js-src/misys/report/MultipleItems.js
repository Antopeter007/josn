dojo.provide("misys.layout.MultipleItems");
dojo.experimental("misys.layout.MultipleItems"); 

dojo.require("dijit._Templated");
dojo.require("dijit._Widget");
dojo.require("dijit._Container");

// our declared class
dojo.declare("misys.layout.MultipleItems",
        [ dijit._Widget, dijit._Templated, dijit._Container ],
        // class properties:
        {

		widgetsInTemplate: true,
        
        noItemLabel: "",
        addItemLabel: "",
        
    	/*constructor: function()
    	{
			console.debug("[MultipleItems] constructor");
    	},
    	
		postCreate: function(){
			console.debug("[MultipleItems] postCreate start");
    		this.inherited(arguments);
			console.debug("[MultipleItems] postCreate end");
    	},
    	
    	buildRendering: function(){
			console.debug("[MultipleItems] buildRendering start");
    		this.inherited(arguments);
    		console.debug("[MultipleItems] buildRendering end");
    	},*/

    	startup: function(){
			console.debug("[MultipleItems] startup start");
			this.inherited(arguments);
			
			this.renderSections();
			console.debug("[MultipleItems] startup end");
    	},
    	
    	renderSections: function()
    	{
    		var children = this.getChildren();
    		if(children.length !== 0)
    		{
    			this.noItemLabelNode.style.display = "none";
    			this.itemsNode.style.display = "";
    		}
    		else
    		{
    			this.noItemLabelNode.style.display = "";
    			this.itemsNode.style.display = "none";
    		}
    	}
    	
       }
);