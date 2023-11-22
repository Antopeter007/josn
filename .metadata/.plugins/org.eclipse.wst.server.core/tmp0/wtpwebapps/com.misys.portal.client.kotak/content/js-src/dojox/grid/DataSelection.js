dojo.provide("dojox.grid.DataSelection");
dojo.require("dojox.grid.Selection");

dojo.declare("dojox.grid.DataSelection", dojox.grid.Selection, {
	getFirstSelected: function(){
		var idx = dojox.grid.Selection.prototype.getFirstSelected.call(this);

		if(idx == -1){ return null; }
		return this.grid.getItem(idx);
	},

	getNextSelected: function(inPrev){
		var old_idx = this.grid.getItemIndex(inPrev);
		var idx = dojox.grid.Selection.prototype.getNextSelected.call(this, old_idx);

		if(idx == -1){ return null; }
		return this.grid.getItem(idx);
	},

    getSelected: function(){
        var result = [];
     // Object.keys is undefined for IE<9 
        if (!Object.keys) {
        	  Object.keys = (function() {
        	    'use strict';
        	    var hasOwnProperty = Object.prototype.hasOwnProperty,
        	        hasDontEnumBug = !({ toString: null }).propertyIsEnumerable('toString'),
        	        dontEnums = [
        	          'toString',
        	          'toLocaleString',
        	          'valueOf',
        	          'hasOwnProperty',
        	          'isPrototypeOf',
        	          'propertyIsEnumerable',
        	          'constructor'
        	        ],
        	        dontEnumsLength = dontEnums.length;

        	    return function(obj) {
        	      if (typeof obj !== 'function' && (typeof obj !== 'object' || obj === null)) {
        	        throw new TypeError('Object.keys called on non-object');
        	      }

        	      var result = [], prop, i;

        	      for (prop in obj) {
        	        if (hasOwnProperty.call(obj, prop)) {
        	          result.push(prop);
        	        }
        	      }

        	      if (hasDontEnumBug) {
        	        for (i = 0; i < dontEnumsLength; i++) {
        	          if (hasOwnProperty.call(obj, dontEnums[i])) {
        	            result.push(dontEnums[i]);
        	          }
        	        }
        	      }
        	      return result;
        	    };
        	  }());
        	}
        // Object.entries is undefined for IE (all versions) 
        if (!Object.entries){
        	  Object.entries = function( obj ){
        	    var ownProps = Object.keys( obj ),
        	        i = ownProps.length,
        	        resArray = new Array(i); // preallocate the Array
        	    while (i--){
        	      resArray[i] = [ownProps[i], obj[ownProps[i]]];
        	    }
        	    return resArray;
        	  };
        }
        // for rest of the Browsers including Edge
        if(this.grid.multipleSelectItems && 
        		Object.entries(this.grid.multipleSelectItems).length != 0)
        {
               for(var mapKey in this.grid.multipleSelectItems)
               {
                     result.push(this.grid.multipleSelectItems[mapKey]);
               }
        }
        else
        {
               for(var i=0, l=this.selected.length; i<l; i++){
                     if(this.selected[i]){
                            result.push(this.grid.getItem(i));
                     }
               }
        }
        return result;
 },


 addToSelection: function(inItemOrIndex){
		if(this.mode == 'none'){ return; }
		var idx = null, 
		mapKey = "";
		if(typeof inItemOrIndex == "number" || typeof inItemOrIndex == "string"){
			idx = inItemOrIndex;
		}else{
			idx = this.grid.getItemIndex(inItemOrIndex);
		}
		dojox.grid.Selection.prototype.addToSelection.call(this, idx);
		if(this.grid.getItem(idx) &&  this.grid.getItem(idx).i)
		{
			if(this.grid.getItem(idx).i.ref_id)
			{
				mapKey = this.grid.getItem(idx).i.ref_id;
			}
			if(this.grid.getItem(idx).i.tnx_id)
			{
				mapKey += "_" + this.grid.getItem(idx).i.tnx_id;
			}
			if(this.grid.getItem(idx).loan_alias)
			{
				mapKey = this.grid.getItem(idx).loan_alias;
			}
		}
		if(this.grid.multipleSelectItems && 
				!this.grid.multipleSelectItems.hasOwnProperty(mapKey) && this.grid.getItem(idx).i)
		{
			this.grid.multipleSelectItems[mapKey] = this.grid.getItem(idx);
		}
	},

	deselect: function(inItemOrIndex){
		if(this.mode == 'none'){ return; }
		var idx = null;
		var idx = null, 
		mapKey = "";
		if(typeof inItemOrIndex == "number" || typeof inItemOrIndex == "string"){
			idx = inItemOrIndex;
		}else{
			idx = this.grid.getItemIndex(inItemOrIndex);
		}
		dojox.grid.Selection.prototype.deselect.call(this, idx);
		if(this.grid.getItem(idx) &&  this.grid.getItem(idx).i)
		{
			if(this.grid.getItem(idx).i.ref_id)
			{
				mapKey = this.grid.getItem(idx).i.ref_id;
			}
			if(this.grid.getItem(idx).i.tnx_id)
			{
				mapKey += "_" + this.grid.getItem(idx).i.tnx_id;
			}
			if(this.grid.getItem(idx).loan_alias)
			{
				mapKey = this.grid.getItem(idx).loan_alias;
			}
		}
		if(!this.selected[idx] && this.grid.multipleSelectItems &&
				this.grid.multipleSelectItems.hasOwnProperty(mapKey))
		{
			delete this.grid.multipleSelectItems[mapKey];
		}
	},

	deselectAll: function(inItemOrIndex){
		var idx = null;
		if(inItemOrIndex || typeof inItemOrIndex == "number"){
			if(typeof inItemOrIndex == "number" || typeof inItemOrIndex == "string"){
				idx = inItemOrIndex;
			}else{
				idx = this.grid.getItemIndex(inItemOrIndex);
			}
			dojox.grid.Selection.prototype.deselectAll.call(this, idx);
		}else{
			this.inherited(arguments);
		}
	}
});
