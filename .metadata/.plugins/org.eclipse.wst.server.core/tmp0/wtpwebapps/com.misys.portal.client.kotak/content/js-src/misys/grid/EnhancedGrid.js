dojo.provide("misys.grid.EnhancedGrid");
dojo.experimental("misys.grid.EnhancedGrid"); 

dojo.require("dojox.grid.EnhancedGrid");

//our declared class
dojo.declare("misys.grid.EnhancedGrid",[ dojox.grid.EnhancedGrid ],
// class properties:
{
	
	//keepSelection: Boolean
	//		Whether keep selection after sort, filter, pagination etc.
	//We will have to make this true in the future by implementing submission of multiple records across pages
	//MPS-26048 , MPS-30237
	keepSelection: false,
	
	/*
	 * Invoked to print the tags of selected item of grid in XML form. 
	 *  - name attribute of grid needs to be declared
	 *  - invoked via formToXml() method in common.js on submit
	 */
	toXML: function(){
		console.debug('[INFO] Outputing xml of grid of selected row.');
		
		var params = {
				xmlRoot: this.xmlTagName,
				ignoreDisabled: true
			},
			xml = [];
						
		var items = this.selection.getSelected();		
		
	      if(items.length > 0){
	    	  if(params.xmlRoot) 
	    	  { 
	    		  xml = ["<", params.xmlRoot, ">"]; 
	    	  }
	    	  
	    	  this._parseGridNode(xml, items, this);
	    	
	    	  if(params.xmlRoot) 
	    	  { 
	    		  xml.push("</", params.xmlRoot, ">");  
	    	  }

			  console.debug('[INFO] XML -' + xml.join(""));
			  return xml.join("");
	      } 
	},
	
	test: function(){
		console.debug('[INFO] test call');    
	},
	
	
	/*
	 * Parses and prints out node in XML tagged format. 
	 */
	_parseGridNode: function(xml, node, grid){
		console.debug('[DEBUG]is Array-' + dojo.isArray(node));
		if(dojo.isArray(node) && node !==null){

			// Iterate through the list of selected items.
	        // The current item is available in the variable
	        // "selectedItem" within the following function:
			//node = array
	        dojo.forEach(node, function(selectedItem){
	        	console.debug('[DEBUG] selectedItem loop');
	            if(selectedItem !== null){
	                // Iterate through the list of attributes of each
					// item.
	            	this._parseGridNode(xml, selectedItem, grid);
	            } // end if 
	        }, this); // end forEach selectionItem        
		}
		else 
		{
		//node not array
    		dojo.forEach(grid.store.getAttributes(node), function(attribute){
                if(attribute !== null){
	        		console.debug('[DEBUG] attribute before loop');  
	        		
                    dojo.forEach(grid.store.getValues(node, attribute), function(value){
    	        		console.debug('[DEBUG] array-'+dojo.isArray(value) + ' string-' + dojo.isString(value));  
                    	if(value!== null && (dojo.isArray(value) || !dojo.isString(value))){
                        	console.debug('[DEBUG] innerArray in : ' + attribute + ', value: ' + value);
                       		xml.push("<", attribute, ">");
                       		xml.push(this._parseGridNode(xml, value, grid));
                       		xml.push("</", attribute, ">");  
                        	console.debug('[DEBUG] inner call done' + attribute);
                    	}else{
                    		console.debug('[DEBUG] attribute: ' + attribute + ', value: ' + value);
                    		xml.push("<", attribute, ">", dojox.html.entities.encode(value, dojox.html.entities.html), "</", attribute, ">"); 
                    	}
                    }, this); // end foreach
                    
	        		console.debug('[DEBUG] attribute after loop');    
                } // end if	
    		}, this); // end foreach
		}		
	}
	
});