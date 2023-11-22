/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.binding.cash.cancel_post_dated"]){dojo._hasResource["misys.binding.cash.cancel_post_dated"]=true;dojo.provide("misys.binding.cash.cancel_post_dated");dojo.require("dojo.parser");dojo.require("dijit.form.Form");dojo.require("misys.widget.Collaboration");dojo.require("misys.form.common");dojo.require("misys.form.file");dojo.require("misys.validation.common");(function(d,dj,m){d.mixin(m._config,{initReAuthParams:function(){var _1={productCode:"FT",subProductCode:dj.byId("sub_product_code").get("value"),transactionTypeCode:"14",entity:dj.byId("entity")?dj.byId("entity").get("value"):"",currency:dj.byId("ft_cur_code")?dj.byId("ft_cur_code").get("value"):"",amount:dj.byId("ft_amt")?m.trimAmount(dj.byId("ft_amt").get("value")):"",es_field1:dj.byId("ft_amt")?m.trimAmount(dj.byId("ft_amt").get("value")):"",es_field2:(dj.byId("beneficiary_account"))?dj.byId("beneficiary_account").get("value"):""};return _1;}});})(dojo,dijit,misys);dojo.require("misys.client.binding.cash.cancel_post_dated_client");}