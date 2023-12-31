/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.grid.DataGrid"]){dojo._hasResource["misys.grid.DataGrid"]=true;dojo.provide("misys.grid.DataGrid");dojo.experimental("misys.grid.DataGrid");dojo.require("dojox.grid.DataGrid");dojo.require("misys.grid._ViewManager");dojo.require("misys.grid._View");dojo.declare("misys.grid.DataGrid",[dojox.grid.DataGrid],{showMoveOptions:true,_deleteGridRecord:"deletegridrecord",startup:function(){this.inherited(arguments);misys.connect(this,"onCellClick",this,this.handleGridAction);},handleGridAction:function(_1){if(_1.target.tagName==="IMG"&&_1.target.attributes.type){var _2=_1.target.attributes.type.value.toLowerCase();if(_2==="edit"){this.onEdit(_1);}else{if(_2==="remove"){this.onDelete(_1);}else{if(_2==="view"){this.onView(_1);}else{if(_2==="moveup"){this._moveSelectedRowsUp(_1.grid);}else{if(_2==="movedown"){this._moveSelectedRowsDown(_1.grid);}}}}}}},onEdit:function(_3){var _4=this.store;var id;_4.fetch({query:{store_id:"*"},sort:this.getSortProps(),onComplete:dojo.hitch(this,function(_5,_6){dojo.forEach(_5,function(_7,_8){if(_8===_3.rowIndex){id=_7.store_id[0];}},this);})});if(_3.grid.gridMultipleItemsWidget.name=="amendments"){_4.fetch({query:{store_id:id},onComplete:dojo.hitch(this.gridMultipleItemsWidget,"editGridData")});}else{_4.fetch({query:{store_id:id},onComplete:dojo.hitch(this.gridMultipleItemsWidget,"openDialogFromExistingItem")});}},onView:function(_9){var _a=this.store;var id;_a.fetch({query:{store_id:"*"},sort:this.getSortProps(),onComplete:dojo.hitch(this,function(_b,_c){dojo.forEach(_b,function(_d,_e){if(_e===_9.rowIndex){id=_d.store_id[0];}},this);})});_a.fetch({query:{store_id:id},onComplete:dojo.hitch(this.gridMultipleItemsWidget,"openDialogFromExistingItem")});},onDelete:function(_f){var _10=this;var _11=function(){var _12=_10.selection.getSelected();if(_12.length){dojo.forEach(_12,function(_13){if(_13!==null){_10.selection.setSelected(_13,false);}},_10);}_10.selection.setSelected(_f.rowIndex,true);_12=_10.selection.getSelected();if(_12.length){dojo.forEach(_12,function(_14){if(_14!==null){_10.store.deleteItem(_14);}},_10);_10.store.save();}_12=_10.selection.getSelected();if(_12.length){dojo.forEach(_12,function(_15){if(_15!==null){_10.selection.setSelected(_15,false);}},_10);}setTimeout(dojo.hitch(_10.gridMultipleItemsWidget,"renderSections"),100);dojo.publish(_10._deleteGridRecord);if(_f.grid.gridMultipleItemsWidget.name=="amendments"){_10.gridMultipleItemsWidget.deleteData();}};misys.dialog.show("CONFIRMATION",misys.getLocalization("confirmDeletionGridRecord"),"",_11);},buildViews:function(){for(var i=0,vs;(vs=this.layout.structure[i]);i++){this.createView("misys.grid._View",i).setStructure(vs);}this.scroller.setContentNodes(this.views.getContentNodes());},createViews:function(){this.views=new misys.grid._ViewManager(this);this.views.createView=dojo.hitch(this,"createView");},postresize:function(){if(this._autoHeight){setTimeout(dojo.hitch(this,"_postresize"),120);}},_postresize:function(){if(this.viewsNode){var _16=Math.max(this.views.measureContent())+"px";dojo.attr(this.viewsNode,"style",{height:_16});if(this.views&&this.views.views&&this.views.views[0].contentNode){dojo.attr(this.views.views[0].contentNode,"style",{height:_16});}var _17=0;var _18=(this.viewsHeaderNode.childNodes?this.viewsHeaderNode.childNodes:[]);var _19=new RegExp("/*dojoxGridHeader*");for(var i=0,len=_18.length;i<len;i++){var _1a=_18[i];if(_19.test(dojo.attr(_1a,"classname"))){dojo.attr(this.viewsHeaderNode,"style",{height:_1a.clientHeight+"px"});break;}}}},onHeaderCellClick:function(_1b){var _1c=(_1b.target.attributes.type)?_1b.target.attributes.type.value.toLowerCase():"";if(_1c==="moveup"){this._moveSelectedRowsUp(_1b.grid);}else{if(_1c==="movedown"){this._moveSelectedRowsDown(_1b.grid);}else{this.inherited(arguments);}}},_clone:function(obj){if(obj==null||typeof (obj)!=="object"){return obj;}var _1d=new obj.constructor();for(var key in obj){if(obj.hasOwnProperty(key)){if(key.match("^_")!="_"){_1d[key]=this._clone(obj[key]);}}}return _1d;},_moveSelectedRowsUp:function(_1e){if(_1e.selection.selected.length>0&&!_1e.selection.selected[0]){var _1f=[];for(var i=0,len=_1e.rowCount;i<len;i++){var _20=this._clone(_1e.getItem(i));if(_1e.selection.selected[i+1]){var j=i+1;while(j<len&&_1e.selection.selected[j]){var _21=this._clone(_1e.getItem(j));_1f.push(_21);j++;}i=j-1;}_1f.push(_20);}var _22,_23;for(var m=0,_24=_1e.rowCount;m<_24;m++){var _25=_1e.getItem(m).store_id;_25=dojo.isArray(_25)?_25[0]:_25;_1e.store.fetch({query:{store_id:_25},onComplete:dojo.hitch(this,function(_26,m,_27,_28){for(var _29 in _27[0]){if(_27[0].hasOwnProperty(_29)){_22=_29.match("^_");_23=(dojo.isArray(_22)?_22[0]:_22)==="_";if(_29!=="store_id"&&!_23){var _2a=_26[m][_29];_2a=dojo.isArray(_2a)?_2a[0]:_2a;_1e.store.setValue(_27[0],_29,_2a);}}}},_1f,m)});}for(var k=0,_2b=_1e.rowCount-1;k<_2b;k++){_1e.selection.selected[k]=_1e.selection.selected[k+1];}}for(var l=0;l<_1e.rowCount;l++){_1e.selection.selected[l]=undefined;}},_moveSelectedRowsDown:function(_2c){if(_2c.selection.selected.length>0&&!_2c.selection.selected[_2c.rowCount-1]){var _2d=[];for(var i=0,len=_2c.rowCount;i<len;i++){if(_2c.selection.selected[i]){var j=i;while(j<len&&_2c.selection.selected[j]){j++;}_2d.push(this._clone(_2c.getItem(j)));for(var k=i;k<j;k++){var _2e=this._clone(_2c.getItem(k));_2d.push(_2e);}i=j;}else{_2d.push(this._clone(_2c.getItem(i)));}}var _2f,_30;for(var n=0,_31=_2c.rowCount;n<_31;n++){var _32=_2c.getItem(n).store_id;_32=dojo.isArray(_32)?_32[0]:_32;_2c.store.fetch({query:{store_id:_32},onComplete:dojo.hitch(this,function(_33,n,_34,_35){for(var _36 in _34[0]){if(_34[0].hasOwnProperty(_36)){_2f=_36.match("^_");_30=(dojo.isArray(_2f)?_2f[0]:_2f)==="_";if(_36!=="store_id"&&!_30){var _37=_33[n][_36];_37=dojo.isArray(_37)?_37[0]:_37;_2c.store.setValue(_34[0],_36,_37);}}}},_2d,n)});}for(var m=_2c.rowCount-1;m>=0;m--){_2c.selection.selected[m]=_2c.selection.selected[m-1];}}for(var l=0;l<_2c.rowCount;l++){_2c.selection.selected[l]=undefined;}}});}