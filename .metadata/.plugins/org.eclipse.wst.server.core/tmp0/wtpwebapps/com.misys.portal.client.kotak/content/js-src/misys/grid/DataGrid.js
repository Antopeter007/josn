dojo.provide("misys.grid.DataGrid");
dojo.experimental("misys.grid.DataGrid"); 

dojo.require("dojox.grid.DataGrid");
dojo.require("misys.grid._ViewManager");
dojo.require("misys.grid._View");

// our declared class
dojo.declare("misys.grid.DataGrid",
	[ dojox.grid.DataGrid ],
	// class properties:
	{
		// Whether to show the arrow icons that allow grid items to be moved up and down
		showMoveOptions : true,
		
	    // dojo.publish once a record is deleted from the grid
	    _deleteGridRecord : "deletegridrecord",

		startup: function(){
			console.debug("[misys.grid.DataGrid] startup start");
			this.inherited(arguments);
			
    		// Handle cell click on grid
    		misys.connect(this, 'onCellClick', this, this.handleGridAction);
    		
			console.debug("[DataGrid] startup end");
		},

		handleGridAction: function(event)
    	{
    		console.debug("[misys.grid.DataGrid] handleGridAction start");
    		console.debug("[misys.grid.DataGrid] handleGridAction grid id: " + this.id);
    		if(event.target.tagName === "IMG" && event.target.attributes.type)
    		{
    			var typeValue = event.target.attributes.type.value.toLowerCase();
    			// Edit details
    			if(typeValue === 'edit')
    			{
    				this.onEdit(event);
    			}
    			// Remove row
    			else if(typeValue === 'remove')
    			{
    				this.onDelete(event);
    			}
    			else if(typeValue === 'view')
    			{
    				this.onView(event);
    			}
    			// Move row(s) Up
    			else if(typeValue === "moveup")
    			{
    				this._moveSelectedRowsUp(event.grid);
    			}
    			// Move row(s) down
    			else if (typeValue === "movedown")
    			{
    				this._moveSelectedRowsDown(event.grid);
    			}
    		}
    		console.debug("[misys.grid.DataGrid] handleGridAction end");
    	},
    	
    	onEdit: function(event)
    	{
    		console.debug("[misys.grid.DataGrid] onEdit");
    		
			// Pass in values to dialog
			var store = this.store;
			var id;
			store.fetch(
					{
						query: {store_id: '*'},
						sort: this.getSortProps(),
						onComplete: dojo.hitch(this, function(items, request){
							dojo.forEach(items, function(item, index){
								if(index === event.rowIndex)
								{
									console.debug("Here is the item:", item );
									id = item.store_id[0];
								}
							}, this);
						})
					}
			);
			if(event.grid.gridMultipleItemsWidget.name == "amendments"){
				store.fetch({
					query: {store_id: id},
					onComplete: dojo.hitch(this.gridMultipleItemsWidget, "editGridData")
				});
			}
			else{
				store.fetch({
					query: {store_id: id},
					onComplete: dojo.hitch(this.gridMultipleItemsWidget, "openDialogFromExistingItem")
				});
			}
    	},
    	
    	onView: function(event)
    	{
    		console.debug("[misys.grid.DataGrid] onView");
    		
			// Pass in values to dialog
			var store = this.store;
			var id;
			store.fetch(
					{
						query: {store_id: '*'},
						sort: this.getSortProps(),
						onComplete: dojo.hitch(this, function(items, request){
							dojo.forEach(items, function(item, index){
								if(index === event.rowIndex)
								{
									console.debug("Here is the item:", item );
									id = item.store_id[0];
								}
							}, this);
						})
					}
			);
			
			store.fetch({
				query: {store_id: id},
				onComplete: dojo.hitch(this.gridMultipleItemsWidget, "openDialogFromExistingItem")
			});
    	},
    	
    	onDelete: function(event)
    	{
			console.debug("[misys.grid.DataGrid] onDelete");
			var that = this;
			var callBack = function(){
					// Unselect all rows
		            var items = that.selection.getSelected();
		            if (items.length) {
		                // Iterate through the list of selected items and unselect them
		                dojo.forEach(items, function(selectedItem) {
		                    if (selectedItem !== null) {
		                        // Delete the item from the data store:
		                    	that.selection.setSelected(selectedItem, false);
		                    }
		                }, that);
		            }
		            
					// Then, select row to be removed
		            that.selection.setSelected(event.rowIndex, true);
					// Get all selected items from the Grid:
		            items = that.selection.getSelected();
		            if (items.length) {
		                // Iterate through the list of selected items
		            	// and remove them from the store
		                dojo.forEach(items, function(selectedItem) {
		                    if (selectedItem !== null) {
		                        // Delete the item from the data store:
		                    	that.store.deleteItem(selectedItem);
		                    }
		                }, that);
		                that.store.save();
		            }
		            
		            // Unselect all rows
		            items = that.selection.getSelected();
		            if (items.length) {
		                // Iterate through the list of selected items
		            	// and unselect them
		                dojo.forEach(items, function(selectedItem) {
		                    if (selectedItem !== null) {
		                        // Delete the item from the data store:
		                    	that.selection.setSelected(selectedItem, false);
		                    }
		                }, that);
		            }    
		            
					setTimeout(dojo.hitch(that.gridMultipleItemsWidget, "renderSections"), 100);
					// Publish a deleteGrid Record event to be able to take some actions in the page
					dojo.publish(that._deleteGridRecord);
					if(event.grid.gridMultipleItemsWidget.name == "amendments"){
						that.gridMultipleItemsWidget.deleteData();
					}
			};
			misys.dialog.show("CONFIRMATION",misys.getLocalization("confirmDeletionGridRecord"),'',callBack);
    	},
    	
		// Build custom views
		buildViews: function(){
			console.debug("[misys.grid.DataGrid] buildViews");
			for(var i=0, vs; (vs=this.layout.structure[i]); i++){
				this.createView("misys.grid._View", i).setStructure(vs);
			}
			this.scroller.setContentNodes(this.views.getContentNodes());
		},

		// views
		createViews: function(){
			console.debug("[misys.grid.DataGrid] createViews");
			this.views = new misys.grid._ViewManager(this);
			this.views.createView = dojo.hitch(this, "createView");
		},
		
		postresize: function(){
			// views are position absolute, so they do not inflate the parent
			console.debug("[misys.grid.DataGrid] postresize");
			if(this._autoHeight){
				setTimeout(dojo.hitch(this, "_postresize"), 120);
			}
		},
		
		_postresize: function()
		{
			console.debug("[misys.grid.DataGrid] _postresize");
			// Resize grid view
			if (this.viewsNode)
			{
				var size = Math.max(this.views.measureContent()) + 'px';
				
				dojo.attr(this.viewsNode, 'style', { height: size });
				if (this.views && this.views.views && this.views.views[0].contentNode)
				{
					dojo.attr(this.views.views[0].contentNode, 'style', { height: size });
				}
	
				// Resize header view
				var headerHeight = 0;
				var children = (this.viewsHeaderNode.childNodes ? this.viewsHeaderNode.childNodes : []);
				var regExp = new RegExp('/*dojoxGridHeader*');
				for(var i=0, len = children.length; i < len; i++)
				{
					var child = children[i];					
					if(regExp.test(dojo.attr(child, 'classname')))
					{
						dojo.attr(this.viewsHeaderNode, 'style', { height: child.clientHeight + 'px' });
						break;
					}
				}
			}
		},
		
		onHeaderCellClick: function(event){
			// Move row(s) up
			console.debug("[misys.grid.DataGrid] onHeaderCellClick");
			var typeValue = (event.target.attributes.type) ?
					event.target.attributes.type.value.toLowerCase() : "";
			
			if(typeValue === "moveup")
			{
				this._moveSelectedRowsUp(event.grid);
			}
			// Move row(s) down
			else if(typeValue === "movedown")
			{
				this._moveSelectedRowsDown(event.grid);
			}
			else
			{	
				this.inherited(arguments);
			}
		},

		// Clone function
		_clone: function(obj){
			console.debug("[misys.grid.DataGrid] _clone");
			if(obj == null || typeof(obj) !== "object")
			{
				return obj;
			}
			var temp = new obj.constructor();
			for(var key in obj)
			{
				if(obj.hasOwnProperty(key)) {
					if(key.match('^_') != '_')
					{
						temp[key] = this._clone(obj[key]);
					}
				}
			}
			return temp;
		},
		
		// Move rows up
		_moveSelectedRowsUp: function(grid)
		{
			// If a row or several rows have been selected and
			// the first row of the grid is not selected
			console.debug("[misys.grid.DataGrid] _moveSelectedRowsUp");
			if (grid.selection.selected.length > 0 && !grid.selection.selected[0])
			{
				var targetItems = [];
				for (var i = 0, len = grid.rowCount; i < len; i++)
				{
					var currentItem = this._clone(grid.getItem(i));

					// Build the array of items in the correct order
					if (grid.selection.selected[i+1])
					{
						var j = i+1;
						while(j < len && grid.selection.selected[j])
						{
							var item = this._clone(grid.getItem(j));
							targetItems.push(item);
							j++;
						}
						i = j-1;
					}
					targetItems.push(currentItem);
				}
				
				// Replace the items content in the grid
				var matchInternalProperty, isInternalProperty;
				for (var m = 0, mlen = grid.rowCount; m < mlen; m++)
				{
					var storeId = grid.getItem(m).store_id;
					storeId = dojo.isArray(storeId) ? storeId[0] : storeId;
					grid.store.fetch({
						query: {store_id: storeId},
						onComplete: dojo.hitch(this, function(targetItems, m, items, request){
		    				for(var property in items[0])
		    				{
		    					if(items[0].hasOwnProperty(property)) {
		    						matchInternalProperty = property.match("^_");
		    						isInternalProperty = (dojo.isArray(matchInternalProperty) ? matchInternalProperty[0] : matchInternalProperty) === "_";
			    					if(property !== "store_id" && !isInternalProperty)
			    					{
			    						var value = targetItems[m][property];
			    						value = dojo.isArray(value) ? value[0] : value;
			    						grid.store.setValue(items[0], property, value);
			    					}
		    					}
		    				}
						}, targetItems, m)
					});
				}
				
				// Change the grid selection one row up
				for (var k = 0, klen = grid.rowCount - 1; k < klen; k++)
				{
					grid.selection.selected[k] = grid.selection.selected[k+1];
				}
			}
			for(var l = 0 ; l<grid.rowCount ; l++)
			{
				grid.selection.selected[l] = undefined;
			}
		},
		
		// Move rows down
		_moveSelectedRowsDown: function(grid)
		{
			// If a row or several rows have been selected and
			// the first row of the grid is not selected
			console.debug("[misys.grid.DataGrid] _moveSelectedRowsDown");
			if (grid.selection.selected.length > 0 && !grid.selection.selected[grid.rowCount-1])
			{
				var targetItems = [];
				for (var i = 0, len = grid.rowCount; i < len; i++)
				{
					if (grid.selection.selected[i])
					{
						var j=i;
						while(j < len && grid.selection.selected[j])
						{
							j++;
						}
						targetItems.push(this._clone(grid.getItem(j)));
						for (var k = i; k < j; k++)
						{
							var item = this._clone(grid.getItem(k));
							targetItems.push(item);
						}
						i = j;
					}
					else
					{
						targetItems.push(this._clone(grid.getItem(i)));
					}
				}
				
				// Replace the items content in the grid
				var matchInternalProperty, isInternalProperty;
				for (var n = 0, nlen = grid.rowCount; n < nlen; n++)
				{
					var storeId = grid.getItem(n).store_id;
					storeId = dojo.isArray(storeId) ? storeId[0] : storeId;
					grid.store.fetch({
						query: {store_id: storeId},
						onComplete: dojo.hitch(this, function(targetItems, n, items, request){
		    				for(var property in items[0])
		    				{
		    					if(items[0].hasOwnProperty(property)) {
		    						matchInternalProperty = property.match("^_");
		    						isInternalProperty = (dojo.isArray(matchInternalProperty) ? matchInternalProperty[0] : matchInternalProperty) === "_";
			    					if(property !== "store_id" && !isInternalProperty)
			    					{
			    						var value = targetItems[n][property];
			    						value = dojo.isArray(value) ? value[0] : value;
			    						grid.store.setValue(items[0], property, value);
			    					}
		    					}
		    				}
						}, targetItems, n)
					});
				}
				
				// Change the grid selection one row down
				for (var m = grid.rowCount-1; m >= 0; m--)
				{
					grid.selection.selected[m] = grid.selection.selected[m-1];
				}
			}
			for(var l = 0 ; l<grid.rowCount ; l++)
			{
				grid.selection.selected[l] = undefined;
			}
		}
	}
);