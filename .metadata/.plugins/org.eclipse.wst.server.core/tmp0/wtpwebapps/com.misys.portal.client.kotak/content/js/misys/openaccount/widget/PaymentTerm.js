/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.openaccount.widget.PaymentTerm"]){dojo._hasResource["misys.openaccount.widget.PaymentTerm"]=true;dojo.provide("misys.openaccount.widget.PaymentTerm");dojo.experimental("misys.openacount.widget.PaymentTerm");dojo.require("dijit._Contained");dojo.require("dijit._Widget");dojo.require("misys.layout.SimpleItem");dojo.declare("misys.openaccount.widget.PaymentTerm",[dijit._Widget,dijit._Contained,misys.layout.SimpleItem],{ref_id:"",tnx_id:"",payment_id:"",code:"",other_paymt_terms:"",nb_days:"",cur_code:"",amt:"",pct:"",code_desc:"",is_valid:"Y",itp_payment_amt:"",itp_payment_date:"",createItem:function(){var _1={ref_id:this.get("ref_id"),tnx_id:this.get("tnx_id"),payment_id:this.get("payment_id"),code:this.get("code"),other_paymt_terms:this.get("other_paymt_terms"),nb_days:this.get("nb_days"),cur_code:this.get("cur_code"),amt:this.get("amt"),pct:this.get("pct"),code_desc:this.get("code_desc"),is_valid:this.get("is_valid"),itp_payment_amt:this.get("itp_payment_amt"),itp_payment_date:this.get("itp_payment_date")};if(this.hasChildren&&this.hasChildren()){dojo.forEach(this.getChildren(),function(_2){if(_2.createItem){_1.push(_2.createItem());}},this);}return _1;},constructor:function(){}});}