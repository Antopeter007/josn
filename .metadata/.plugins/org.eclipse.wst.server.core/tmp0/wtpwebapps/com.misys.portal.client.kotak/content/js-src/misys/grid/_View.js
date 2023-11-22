dojo.provide("misys.grid._View");
dojo.experimental("misys.grid._View"); 

dojo.require("dojox.grid._View");

// our declared class
dojo.declare("misys.grid._View",
	[ dojox.grid._View ],
	// class properties:
	{
		// note: not called in 'view' context
		_getHeaderContent: function(inCell){
			var ret = "";
			if (inCell.grid.showMoveOptions && inCell.field && inCell.field === 'actions')
			{
				ret = [ "<div align='center'>" ];
				ret = ret.concat(
						[ "<img src='" + 
						  	misys.getContextualURL("/content/images/pic_arrowdown.gif") + 
						  	"' alt='Move Down' border='0' type='moveDown'/>" ],
						[ "&nbsp;" ],
						[ "<img src='" + 
						  misys.getContextualURL("/content/images/pic_arrowup.gif") + 
						  		"' alt='Move Up' border='0' type='moveUp'/>" ],
						[ "</div>"]);
				return ret.join('');
			}
			else
			{
				var n = inCell.name || inCell.grid.getCellName(inCell);
				ret = [ '<div class="dojoxGridSortNode' ];
				
				if(inCell.index != inCell.grid.getSortIndex()){
					ret.push('">');
				} else {
					ret = ret.concat([ ' ',
								inCell.grid.sortInfo > 0 ? 'dojoxGridSortUp' : 'dojoxGridSortDown',
								'"><div class="dojoxGridArrowButtonChar">',
								inCell.grid.sortInfo > 0 ? '&#9650;' : '&#9660;',
								'</div><div class="dojoxGridArrowButtonNode" role="'+(dojo.isFF<3 ? "wairole:" : "")+'presentation"></div>' ]);
				}
				ret = ret.concat([n, '</div>']);
				return ret.join('');
			}
		}
	}
);