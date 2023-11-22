/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.binding.trade.create_po_folder"]){dojo._hasResource["misys.binding.trade.create_po_folder"]=true;dojo.provide("misys.binding.trade.create_po_folder");(function(d,dj,m){d.mixin(m,{bind:function(){var _1=d.query(".dojoxGrid"),_2;if(_1&&_1.length>0){_2=dj.byId(_1[0].id);if(_2){m.connect(_2,"onRowClick",function(e){m.grid.selectFolderRow(_2,_2.getItem(e.rowIndex),_2.selection.selected);});_2.canSort=function(){return false;};}}}});})(dojo,dijit,misys);dojo.require("misys.client.binding.trade.create_po_folder_client");}