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
		
		xmlTagName: '',
		
		name: '',
		
		startup: function(){
			console.debug("[MultipleItems] startup start");
			// Object with empty name are ignored in forms xml generation.
			this.name = this.id;

			this.inherited(arguments);

			/*var children = this.getChildren();
			dojo.forEach(children,
					function(child, index, arr){
						child.startup();
					}
			);*/
			
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
		},
		
		clear: function()
		{
			// Destroy all descendant widgets 
			this.destroyDescendants(false);
			
			// Render sections
			this.renderSections();
		},
	    
	    toXML: function()
	    {
	    	var xmlString = ['<', this.xmlTagName, '>'];
	    	var children = this.getChildren();
	    	if(children && children.length > 0)
	    	{
	    		dojo.forEach(children, function(field){
		    		xmlString.push(field.toXML());
				});
	    	}
	    	
	    	xmlString.push('</', this.xmlTagName, '>');
	    	return xmlString.join('');
	    }
	}
);