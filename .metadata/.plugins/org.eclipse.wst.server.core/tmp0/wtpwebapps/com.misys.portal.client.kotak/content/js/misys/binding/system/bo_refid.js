/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.binding.system.bo_refid"]){dojo._hasResource["misys.binding.system.bo_refid"]=true;dojo.provide("misys.binding.system.bo_refid");dojo.require("dijit.form.Button");dojo.require("dijit.form.RadioButton");dojo.require("dijit.form.NumberTextBox");dojo.require("misys.form.common");dojo.require("misys.validation.common");dojo.require("misys.openaccount.widget.ReferenceIds");dojo.require("misys.openaccount.widget.ReferenceId");(function(d,dj,m){var _1=new Array();function _2(){var _3=dj.byId("select_prodcode").get("value");var _4=dj.byId("select_subprodcode");var _5=_3==="FT"?_1:m._config.subProductsCollection[_3];if(_5&&_3!=="TF"&&_5.length===0){m.animate("fadeOut",d.byId("select_subprodcode"));m.toggleRequired("select_subprodcode",false);dj.byId("select_subprodcode").set("value","");dj.byId("select_subprodcode").set("disabled",true);}else{m.animate("fadeIn",d.byId("select_subprodcode"));m.toggleRequired("select_subprodcode",true);dj.byId("select_subprodcode").set("disabled",false);}if(_5){_4.store=new dojo.data.ItemFileReadStore({data:{identifier:"value",label:"name",items:_5}});_4.fetchProperties={sort:[{attribute:"name"}]};}};function _6(){var _7=d.byId("display_multipleRef"),_8=d.byId("display_uniqueRef"),_9=dj.byId("uniqueRef_1").get("checked"),_a=function(){m.toggleFields(_9,null,["customer_input_center","from","to"]);m.toggleFields(!_9,null,["title"]);};if(_9){m.animate("fadeOut",_8,function(){m.animate("fadeIn",_7,_a);});}else{m.animate("fadeOut",_7,function(){m.animate("fadeIn",_8,_a);});}};function _b(){_1=dojo.filter(m._config.subProductsCollection["FT"],function(_c){return (_c.value==="TINT"||_c.value==="TTPT");});};d.mixin(m,{bind:function(){m.connect("uniqueRef_1","onClick",_6);m.connect("uniqueRef_2","onClick",_6);m.connect("select_customer_reference","onChange",function(){if(dijit.byId("select_customer_reference")&&dijit.byId("select_customer_reference").get("value")!==""){var _d=dijit.byId("select_customer_reference").get("value");dijit.byId("select_back_office_1").set("value",m._config.backOffice1Values[_d].value);}});m.setValidation("title",m.validateTitleLength);m.setValidation("customer_input_center",m.validateCustomerInputCenterLength);m.setValidation("from",m.validateFromTo);m.setValidation("to",m.validateFromTo);m.connect("select_prodcode","onChange",function(){if(dijit.byId("select_prodcode")&&dijit.byId("select_prodcode").get("value")!==""){_2();}});},validateTitleLength:function(){if(dj.byId("boRefLength")&&(this.get("value").length<dj.byId("boRefLength").get("value"))){this.invalidMessage=m.getLocalization("titleLength",[dj.byId("boRefLength").get("value")]);return false;}return true;},validateCustomerInputCenterLength:function(){var _e=dijit.byId("customer_input_center").get("value");if((_e.length!=2)){this.invalidMessage=m.getLocalization("customerInputCenterLength");return false;}return misys._validateCharacters(_e);},_validateCharacters:function(_f){var _10=" 0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";var _11;var _12=d.every(_f,function(_13){_11=_13;return (_10.indexOf(_13)<0)?false:true;});if(!_12){dijit.byId("customer_input_center").invalidMessage=m.getLocalization("illegalCharError",[_11]);}return _12;},validateFromTo:function(){var _14=dijit.byId("from").get("value");var to=dijit.byId("to").get("value");if(to<_14){this.invalidMessage=m.getLocalization("FromTo");return false;}return true;},onFormLoad:function(){_b();}});m.dialog=m.dialog||{};d.mixin(m.dialog,{submitBoRefId:function(_15){var _16=dj.byId(_15),_17=dj.byId("uniqueRef_1");if(!_17.get("checked")&&!dj.byId("uniqueRef_2").get("checked")){m.showTooltip(m.getLocalization("mandatoryBORefIDType"),_17.domNode,["before"]);}else{if(_16&&_16.validate()){_16.execute();misys.isFormDirty=true;_16.hide();}}},closeBoRefId:function(_18){var _19=dj.byId(_18);if(_19){m.animate("fadeOut",d.byId("display_multipleRef"),function(){m.animate("fadeOut",d.byId("display_uniqueRef"),function(){_19.hide();});});}}});})(dojo,dijit,misys);dojo.require("misys.client.binding.system.bo_refid_client");}