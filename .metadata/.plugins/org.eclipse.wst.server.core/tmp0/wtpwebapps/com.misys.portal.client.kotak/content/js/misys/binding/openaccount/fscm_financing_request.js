/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.binding.openaccount.fscm_financing_request"]){dojo._hasResource["misys.binding.openaccount.fscm_financing_request"]=true;dojo.provide("misys.binding.openaccount.fscm_financing_request");dojo.require("misys.form.CurrencyTextBox");dojo.require("dijit.form.NumberTextBox");dojo.require("dijit.form.FilteringSelect");dojo.require("misys.form.common");dojo.require("misys.validation.common");dojo.require("dijit.form.Form");dojo.require("dijit.form.Button");dojo.require("dijit.form.TextBox");dojo.require("dijit.form.ValidationTextBox");dojo.require("dijit.form.CheckBox");dojo.require("dijit.layout.ContentPane");dojo.require("dijit.TooltipDialog");dojo.require("dojo.data.ItemFileReadStore");dojo.require("misys.form.SimpleTextarea");dojo.require("misys.form.file");dojo.require("misys.widget.Collaboration");dojo.require("misys.form.PercentNumberTextBox");dojo.require("misys.openaccount.FormOpenAccountEvents");(function(d,dj,m){d.mixin(m._config,{initReAuthParams:function(){var _1={productCode:dj.byId("product_code").get("value"),transactionTypeCode:"63",entity:dj.byId("entity")?dj.byId("entity").get("value"):"",currency:dj.byId("base_cur_code")?dj.byId("base_cur_code").get("value"):"",amount:m.trimAmount(dj.byId("grand_total")?dj.byId("grand_total").get("value"):""),es_field1:m.trimAmount(dj.byId("grand_total")?dj.byId("grand_total").get("value"):""),es_field2:""};return _1;}});d.mixin(m,{bind:function(){var _2=document.realform;m.connect("request_no","onClick",function(){if(dj.byId("inv_eligible_pct")){dj.byId("inv_eligible_pct").set("value","100");dj.byId("inv_eligible_pct").set("required",true);_2.percentage_value.value=dj.byId("inv_eligible_pct").get("value");}});m.connect("inv_eligible_pct","onBlur",function(){if(this.get("value")!==null&&!isNaN(this.get("value"))){if(parseFloat(this.get("value"))<=100&&(parseFloat(this.get("value"))>0)){var _3=(parseFloat(this.get("value"))*parseFloat(dj.byId("grand_total").get("value").replace(",","")))/100;dj.byId("requested_amt").set("value",_3);}else{displayMessage=misys.getLocalization("incorrectPercentage");this.set("value","");this.set("state","Error");m.dialog.show("ERROR",m.getLocalization("focusOnErrorAlert"));m._config.onSubmitErrorMsg=m.getLocalization("focusOnErrorAlert");dj.hideTooltip(this.domNode);dj.showTooltip(displayMessage,this.domNode,0);dj.showTooltip(displayMessage,domNode,0);}_2.percentage_value.value=this.get("value");}else{dj.byId("requested_amt").set("value","");}m.setCurrency(dj.byId("base_cur_code"),["requested_amt"]);});},onFormLoad:function(){var _4;if(dj.byId("inv_eligible_pct").get("value")===null||isNaN(dj.byId("inv_eligible_pct").get("value"))){dj.byId("inv_eligible_pct").set("value","100");_4=dj.byId("grand_total").get("value").replace(",","");}else{_4=(parseFloat(dj.byId("inv_eligible_pct").get("value"))*parseFloat(dj.byId("grand_total").get("value").replace(",","")))/100;}document.realform.percentage_value.value=dj.byId("inv_eligible_pct").get("value");dj.byId("requested_amt").set("value",_4);m.setCurrency(dj.byId("base_cur_code"),["requested_amt"]);},initForm:function(){}});})(dojo,dijit,misys);dojo.require("misys.client.binding.openaccount.fscm_financing_request_client");}