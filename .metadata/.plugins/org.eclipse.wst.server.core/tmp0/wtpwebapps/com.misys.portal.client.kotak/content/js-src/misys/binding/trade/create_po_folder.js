dojo.provide("misys.binding.trade.create_po_folder");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode
	
	// Private functions and variables go here

	// Public functions & variables follow
	d.mixin(m, {

		bind : function() {
			var grids = d.query(".dojoxGrid"),
				grid;
				
			if(grids && grids.length > 0) {
				grid = dj.byId(grids[0].id);
				if(grid) {
					m.connect(grid, "onRowClick", function(e){
						m.grid.selectFolderRow(grid, grid.getItem(e.rowIndex), grid.selection.selected);
					});
					
					// Disable sorting, as it messes up the grouping
					grid.canSort = function(){
						return false;
					};
					
				}
			}
		}
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.trade.create_po_folder_client');