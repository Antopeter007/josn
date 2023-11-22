/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.binding.trade.create_sr"]){dojo._hasResource["misys.binding.trade.create_sr"]=true;dojo.provide("misys.binding.trade.create_sr");dojo.require("misys.form.common");dojo.require("misys.validation.common");dojo.require("misys.widget.Collaboration");(function(d,dj,m){d.mixin(m._config,{initReAuthParams:function(){var _1={productCode:"SR",subProductCode:"",transactionTypeCode:"01",entity:dj.byId("entity")?dj.byId("entity").get("value"):"",currency:dj.byId("lc_cur_code")?dj.byId("lc_cur_code").get("value"):"",amount:dj.byId("lc_amt")?m.trimAmount(dj.byId("lc_amt").get("value")):"",es_field1:dj.byId("lc_amt")?m.trimAmount(dj.byId("lc_amt").get("value")):"",es_field2:""};return _1;}});d.mixin(m,{bind:function(){m.connect("eucp_flag","onClick",function(){m.toggleFields(this.get("checked"),null,["eucp_details"]);});},onFormLoad:function(){var _2=dj.byId("eucp_flag");if(_2){m.toggleFields(_2.get("checked"),null,["eucp_details"]);}}});})(dojo,dijit,misys);dojo.require("misys.client.binding.trade.create_sr_client");}