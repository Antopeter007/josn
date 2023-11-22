dojo.provide("misys.layout.SingleItem");
dojo.experimental("misys.layout.SingleItem"); 

dojo.require("dijit._Widget");
dojo.require("dijit._Contained");

// our declared class
dojo.declare("misys.layout.SingleItem",
	[ dijit._Widget, dijit._Contained ],
	// class properties:
	{
		//widgetsInTemplate: true,
		
		xmlTagName: '',
		
		startup: function()
		{
			console.debug("[SingleItem] startup start");
			this.inherited(arguments);

			var children = this.getChildren();
			dojo.forEach(children,
					function(child, index, arr){
						child.startup();
					}
			);
			
			console.debug("[SingleItem] startup end");
		},
		
    	removeItem: function()
    	{
    		var that = this;
    		var callBack = function(){
    		
    		var parent = that.getParent();
			// Destroy all descendant widgets 
    			that.destroyRecursive(false);

			// Render updated section
    		parent.renderSections();
    		};
    		
    		misys.dialog.show("CONFIRMATION",misys.getLocalization("confirmDeletionGridRecord"),'',callBack);
    	},
    	
		toXML: function()
	    {
	    	var xmlString = ['<', this.xmlTagName, '>'],
	    		fieldName;
	    	
	    	var fields = this.getChildren();
	    	dojo.forEach(fields,
					function(field){
						xmlString.push(misys.fieldToXML(field));
					}
			);
	    	xmlString.push('</', this.xmlTagName, '>');
	    	
	    	return xmlString.join('');
	    }
	}
);