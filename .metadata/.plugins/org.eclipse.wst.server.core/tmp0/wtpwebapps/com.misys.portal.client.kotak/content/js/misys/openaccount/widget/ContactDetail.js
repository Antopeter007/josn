/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.openaccount.widget.ContactDetail"]){dojo._hasResource["misys.openaccount.widget.ContactDetail"]=true;dojo.provide("misys.openaccount.widget.ContactDetail");dojo.experimental("misys.openacount.widget.ContactDetail");dojo.require("dijit._Contained");dojo.require("dijit._Widget");dojo.require("misys.layout.SimpleItem");dojo.declare("misys.openaccount.widget.ContactDetail",[dijit._Widget,dijit._Contained,misys.layout.SimpleItem],{ctcprsn_id:"",type:"",type_decode:"",bic:"",name_prefix:"",name_value:"",given_name:"",role:"",phone_number:"",fax_number:"",email:"",is_valid:"Y",createItem:function(){var _1={ctcprsn_id:this.get("ctcprsn_id"),type:this.get("type"),type_decode:this.get("type_decode"),bic:this.get("bic"),name_prefix:this.get("name_prefix"),name_value:this.get("name_value"),given_name:this.get("given_name"),role:this.get("role"),phone_number:this.get("phone_number"),fax_number:this.get("fax_number"),email:this.get("email"),is_valid:this.get("is_valid")};if(this.hasChildren&&this.hasChildren()){dojo.forEach(this.getChildren(),function(_2){if(_2.createItem){_1.push(_2.createItem());}},this);}return _1;},constructor:function(){}});}