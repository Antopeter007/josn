/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.openaccount.widget.DatagridBPO"]){dojo._hasResource["misys.openaccount.widget.DatagridBPO"]=true;dojo.provide("misys.openaccount.widget.DatagridBPO");dojo.experimental("misys.openaccount.widget.DatagridBPO");dojo.require("misys.grid.DataGrid");dojo.declare("misys.openaccount.widget.DatagridBPO",[misys.grid.DataGrid],{postresize:function(){this.inherited(arguments);var _1=dijit.byId("bank-payment-obligations");var _2=false;if(_1&&_1.store&&_1.store._arrayOfTopLevelItems){_1.store.fetch({query:{store_id:"*"},onComplete:dojo.hitch(_1,function(_3,_4){dojo.forEach(_3,function(_5){if(_5.buyer_bank_bpo[0]==="Y"){dijit.byId("buyer_bank_bpo_added").set("value",true);_2=true;}});})});if(!_2){dijit.byId("buyer_bank_bpo_added").set("value",false);}}}});}