/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.binding.trade.release_po_folder"]){dojo._hasResource["misys.binding.trade.release_po_folder"]=true;dojo.provide("misys.binding.trade.release_po_folder");(function(d,dj,m){d.mixin(m,{bind:function(){var _1=d.query(".dojoxGrid"),_2;d.forEach(_1,function(_3,i){_2=dj.byId(_3.id);if(_2){if(_2.id==="nonSignedFolders"){m.connect(_2,"_onFetchComplete",function(){for(var i=0;i<this.store._numRows;i++){this.selection.setSelected(i,true);}m.grid.selectUnsignedFolderRow(this,this.store._items,this.selection.selected);});}m.connect(_2,"onRowClick",function(e){m.grid.selectUnsignedFolderRow(this,this.getItem(e.rowIndex),this.selection.selected);});}});}});})(dojo,dijit,misys);dojo.require("misys.client.binding.trade.release_po_folder_client");}