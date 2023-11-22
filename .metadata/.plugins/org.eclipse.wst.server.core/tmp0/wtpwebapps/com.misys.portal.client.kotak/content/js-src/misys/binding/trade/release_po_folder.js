dojo.provide("misys.binding.trade.release_po_folder");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode

	// Public functions & variables follow
	d.mixin(m, {
		bind : function() {
			var grids = d.query(".dojoxGrid"),
				grid;
				
			d.forEach(grids, function(div, i){
				grid = dj.byId(div.id);
				if(grid) {
					// TODO Bit brittle this, find general solution
					// Grid with id nonSignedFolders should have all its items selected
					if(grid.id === "nonSignedFolders") {
						m.connect(grid, "_onFetchComplete", function(){
							for(var i = 0; i < this.store._numRows; i++) {
								this.selection.setSelected(i, true);
							}
							m.grid.selectUnsignedFolderRow(this, this.store._items,
									this.selection.selected);
						});
					}

					m.connect(grid, "onRowClick", function(e){
						m.grid.selectUnsignedFolderRow(this, this.getItem(e.rowIndex),
								this.selection.selected);
					});
				}
			});
		}
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.trade.release_po_folder_client');