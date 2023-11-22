/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.system.widget.Account"]){dojo._hasResource["misys.system.widget.Account"]=true;dojo.provide("misys.system.widget.Account");dojo.experimental("misys.system.widget.Account");dojo.require("dijit._Contained");dojo.require("dijit._Widget");dojo.declare("misys.system.widget.Account",[dijit._Widget,dijit._Contained],{account_number:"",nickname:"",account_name:"",bank_abbv_name:"",type:"",ccy:"",nra:"",description:"",account_product_type:"",cust_account_type:"",bank_id:"",branch_code:"",account_type:"",created_dttm:"",routing_bic:"",customer_reference:"",actv_flag:"",start_date:"",end_date:"",principal_amount:"",maturity_amount:"",interest_rate_credit:"",interest_rate_debit:"",interest_rate_maturity:"",owner_type:"",displayed_owner_type:"",settlement_means:"",sweeping_enabled:"",pooling_enabled:"",charge_account_for_liq:"",startup:function(){if(this._started){return;}this.inherited(arguments);}});}