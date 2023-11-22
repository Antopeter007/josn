/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.liquidity.widget.BalAccount"]){dojo._hasResource["misys.liquidity.widget.BalAccount"]=true;dojo.provide("misys.liquidity.widget.BalAccount");dojo.require("dijit._Contained");dojo.require("dijit._Container");dojo.require("dijit._Widget");dojo.require("misys.layout.SimpleItem");dojo.declare("misys.liquidity.widget.BalAccount",[dijit._Widget,dijit._Contained,misys.layout.SimpleItem],{sub_group_code:"",account_no:"",account_id:"",company_id:"",sub_group_id:"",sub_group_pivot:"",acctsubgrppivot_label:"",description:"",constructor:function(){},createItem:function(){var _1={sub_group_code:this.get("sub_group_code"),account_no:this.get("account_no"),account_id:this.get("account_id"),company_id:this.get("company_id"),sub_group_id:this.get("sub_group_id"),sub_group_pivot:this.get("sub_group_pivot"),acctsubgrppivot_label:this.get("acctsubgrppivot_label"),description:this.get("acctdesc")};if(this.hasChildren&&this.hasChildren()){dojo.forEach(this.getChildren(),function(_2){if(_2.createItem){_1.push(_2.createItem());}},this);}return _1;}});}