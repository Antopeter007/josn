/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.binding.system.master_payee"]){dojo._hasResource["misys.binding.system.master_payee"]=true;dojo.provide("misys.binding.system.master_payee");dojo.require("dojo.data.ItemFileWriteStore");dojo.require("dojox.xml.DomParser");dojo.require("dijit.form.Button");dojo.require("misys.form.CurrencyTextBox");dojo.require("dijit.form.CheckBox");dojo.require("dijit.form.FilteringSelect");dojo.require("dijit.form.Form");dojo.require("dijit.form.NumberTextBox");dojo.require("dijit.form.RadioButton");dojo.require("dijit.form.TextBox");dojo.require("dijit.form.ValidationTextBox");dojo.require("dijit.Editor");dojo.require("dijit.layout.ContentPane");dojo.require("dojox.xml.DomParser");dojo.require("misys.validation.common");dojo.require("misys.form.common");dojo.require("misys.validation.common");dojo.require("misys.form.SimpleTextarea");dojo.require("misys.grid.DataGrid");dojo.require("misys.form.static_document");(function(d,dj,m){var _1=true;function _2(_3){if(dj.byId("featureid")&&dj.byId("registrations_made").get("value")==="Y"){_4(_3);}else{misys.submit(_3);}};function _4(_5){if(!dj.byId("invalidateRegistrationDialog")){d.require("misys.widget.Dialog");d.require("dijit.form.Button");var _6=new dj.Dialog({id:"invalidateRegistrationDialog",title:m.getLocalization("alertMessage")});var _7=d.create("div",{id:"invRegDialogContent"});var _8=d.create("div",{id:"dialogInvRegText"},_7,"first");var _9=d.create("div",{id:"invalidateRegistrationDialogButtons",style:"text-align:center;"},_7,"last");var _a=new dj.form.Button({label:m.getLocalization("yesMessage"),id:"invalidateRegistrationButtonId"});var _b=new dj.form.Button({label:m.getLocalization("noMessage"),id:"noinvalidateRegistrationButtonId"});var _c=new dj.form.Button({label:m.getLocalization("cancelMessage"),id:"cancelinvalidateRegistrationButtonId"});d.place(_a.domNode,_9);d.place(_b.domNode,_9);d.place(_c.domNode,_9);_6.attr("content",_7);}var _d=dj.byId("invalidateRegistrationDialog");if(d.byId("dialogInvRegText")){d.byId("dialogInvRegText").innerHTML=m.getLocalization("invalidateRegistrationDialogText");}m.dialog.connect(_d,"onKeyPress",function(_e){if(_e.keyCode==d.keys.ESCAPE){d.stopEvent(_e);}});m.dialog.connect(dj.byId("invalidateRegistrationButtonId"),"onClick",function(){dj.byId("invalidate_payee").set("value","Y");_d.hide();misys.submit(_5);},_d.id);m.dialog.connect(dj.byId("noinvalidateRegistrationButtonId"),"onClick",function(){dj.byId("invalidate_payee").set("value","N");_d.hide();misys.submit(_5);},_d.id);m.dialog.connect(dj.byId("cancelinvalidateRegistrationButtonId"),"onClick",function(){_d.hide();},_d.id);m.dialog.connect(_d,"onHide",function(){m.dialog.disconnect(_d);});_d.show();};function _f(){var _10=dj.byId("input_in_type_1"),_11=dj.byId("input_in_type_2");if(!_10.get("checked")&&!_11.get("checked")){m.showTooltip(m.getLocalization("inputInMandatory"),_10.domNode,["before"]);return false;}return true;};function _12(){var _13=true;var _14=dj.byId("validation_format");if(_14){var fmt=_14.get("value");if(fmt!==""){try{var re=new RegExp(fmt);}catch(e){var _15=m.getLocalization("invalidRegExpression");_14.focus();_14.set("state","Error");dijit.hideTooltip(_14.domNode);dijit.showTooltip(_15,_14.domNode,0);_13=false;}}}return _13;};function _16(){var _17=true;var _18=dijit.byId("payee_refs_grid");var _19=dj.byId("reference_id");var _1a;if(_19){_1a=_19.get("value");}if(_18){if(!_18.grid){_17=true;}else{var _1b=_18.dialog.storeId;_18.grid.store.fetch({query:{reference_id:_1a},onComplete:function(_1c,_1d){if(_1c.length>0){if(_1c.length>1){_17=false;}else{if(_1c[0].store_id!=_1b){_17=false;}}}}});}if(!_17){misys._config.onSubmitErrorMsg=misys.getLocalization("payeeRefExist",[_1a]);misys.showTooltip(misys.getLocalization("payeeRefExist",[_1a]),_19.domNode);}}return _17;};function _1e(){if(m._config.isMultiBank){var _1f=_20();if(_1f==="N"){dj.byId("reg_required").set("value","N");dj.byId("service_code").set("required",true);dj.byId("service_name").set("required",true);m.animate("fadeIn",d.byId("service_section"));}else{dj.byId("reg_required").set("value","");dj.byId("service_code").set("value","");dj.byId("service_name").set("value","");dj.byId("local_service_name").set("value","");dj.byId("service_code").set("required",false);dj.byId("service_name").set("required",false);m.animate("fadeOut",d.byId("service_section"));}}else{var _21=m._config.billp.registrationArr[dj.byId("payee_category").get("value")];if(_21==="N"){dj.byId("reg_required").set("value","N");dj.byId("service_code").set("required",true);dj.byId("service_name").set("required",true);m.animate("fadeIn",d.byId("service_section"));}else{dj.byId("reg_required").set("value","");dj.byId("service_code").set("value","");dj.byId("service_name").set("value","");dj.byId("local_service_name").set("value","");dj.byId("service_code").set("required",false);dj.byId("service_name").set("required",false);m.animate("fadeOut",d.byId("service_section"));}}};function _20(){var _22=[];var cat;var _23=dj.byId("bank_abbv_name").get("value");var _24=dj.byId("payee_category").get("value");dojo.forEach(misys._config.perBankPayeeCategoryRegistrationRequired[_23],function(_25,key){_22.push(_25);});dojo.forEach(_22,function(_26,key){if(_26.cat===_24){cat=_26.reg;}});return cat;};function _27(){var _28=null;dj.byId("payee_category").set("disabled",false);var _29=dj.byId("payee_category");var _2a=dj.byId("bank_abbv_name")?dj.byId("bank_abbv_name").get("value"):"";if(dj.byId("payee_category").get("value")!==""){dj.byId("payee_category").set("value","");}if(dj.byId("bank_abbv_name")!==""){_28=misys._config.perBankPayeeCategory[_2a];}if(_28){_29.store=new dojo.data.ItemFileReadStore({data:{identifier:"value",label:"name",items:_28}});_29.fetchProperties={sort:[{attribute:"name"}]};}};function _2b(){var _2c=true;if(dj.byId("payee_name")){var _2d=dj.byId("payee_name").get("value");var n=_2d.length;if(n>35){var _2e=m.getLocalization("invalidPayeeName");dj.byId("payee_name").focus();dj.byId("payee_name").set("state","Error");dijit.hideTooltip(dj.byId("payee_name").domNode);dijit.showTooltip(_2e,dj.byId("payee_name").domNode,0);_2c=false;}}return _2c;};function _2f(_30){if(!_30){if(dj.byId("service_code")&&dj.byId("service_code").get("value")!==""){dj.byId("service_code").set("value","");}if(dj.byId("service_name")&&dj.byId("service_name").get("value")!==""){dj.byId("service_name").set("value","");}if(dj.byId("local_service_name")&&dj.byId("local_service_name").get("value")!==""){dj.byId("local_service_name").set("value","");}if(dj.byId("end_date")&&dj.byId("end_date").get("value")!==""){dj.byId("end_date").set("value",null);}if(dj.byId("base_cur_code")&&dj.byId("base_cur_code").get("value")!==""){dj.byId("base_cur_code").set("value","");}if(dj.byId("samp_bill_path")&&dj.byId("samp_bill_path").get("value")!==""){dj.byId("samp_bill_path").set("value","");}if(dj.byId("additional_Info")&&dj.byId("additional_Info").get("value")!==""){dj.byId("additional_Info").set("value","");}if(dj.byId("local_additional_Info")&&dj.byId("local_additional_Info").get("value")!==""){dj.byId("local_additional_Info").set("value","");}if(dj.byId("description")&&dj.byId("description").get("value")!==""){dj.byId("description").set("value","");}if(dj.byId("local_description")&&dj.byId("local_description").get("value")!==""){dj.byId("local_description").set("value","");}if(dj.byId("payee_refs_grid").store&&dj.byId("payee_refs_grid").store._arrayOfAllItems.length>0){for(var i=0,_31=dj.byId("payee_refs_grid").store._arrayOfAllItems.length;i<_31;i++){var _32=dj.byId("payee_refs_grid").store._arrayOfAllItems[i];dj.byId("payee_refs_grid").store.deleteItem(_32);}dj.byId("payee_refs_grid").store._arrayOfAllItems.length=0;dj.byId("payee_refs_grid").store.close();dj.byId("payee_refs_grid").store.fetch();}}};d.mixin(m,{bind:function(){m.setValidation("base_cur_code",m.validateCurrency);m.setValidation("payee_code",m.checkNumericOnlyValue);m.setValidation("reference_id",m.checkNumericOnlyValue);m.connect("end_date","onClick",function(){if(misys._config.isMultiBank){var _33;if(dijit.byId("bank_abbv_name")){_33=dijit.byId("bank_abbv_name").get("value");}if(_33!==""&&misys&&misys._config&&misys._config.businessDateForBank&&misys._config.businessDateForBank[_33][0]&&misys._config.businessDateForBank[_33][0].value!==""){var _34=parseInt(misys._config.businessDateForBank[_33][0].value.substring(0,4),10);var _35=parseInt(misys._config.businessDateForBank[_33][0].value.substring(5,7),10);var _36=parseInt(misys._config.businessDateForBank[_33][0].value.substring(8,10),10);this.dropDown.currentFocus=new Date(_34,_35-1,_36);}}});m.connect("bank_abbv_name","onChange",function(){dj.byId("payee_category").set("value","");dj.byId("payee_category").store="";_2f(_1);_27();if(m._config.currencyCodes&&m._config.currencyCodes.length!==0){m._config.currencyCodes=[];}_1=false;});m.setValidation("end_date",m.validateEndDateWithCurrentDate);m.connect("payee_category","onChange",function(){_1e();_2f(_1);_1=false;});m.connect("payee_name","onBlur",_2b);m.connect("field_type_1","onChange",function(){if(dj.byId("field_type_1").get("checked")){m.animate("fadeOut","format_div",function(){});}});m.connect("field_type_2","onChange",function(){if(dj.byId("field_type_2").get("checked")){m.animate("fadeIn","format_div",function(){});}});m.connect("payee_category","onChange",function(){if(dj.byId("payee_category").get("value")!==""){if(dj.byId("dijit_form_Button_1")){dj.byId("dijit_form_Button_1").set("disabled",false);}}else{dj.byId("dijit_form_Button_1").set("disabled",false);}});m.connect("end_date","onChange",m.validateEndDateWithCurrentDate);if(dijit.byId("approveButton")){dijit.byId("approveButton").set("onClick",function(){_2("APPROVE");});}},onFormLoad:function(){if(misys._config.isMultiBank){if(dj.byId("bank_abbv_name")&&dj.byId("payee_category")&&dj.byId("bank_abbv_name").get("value")===""){dj.byId("payee_category").set("disabled",true);}else{if(dj.byId("bank_abbv_name")&&dj.byId("payee_category")&&dj.byId("bank_abbv_name").get("value")!==""){_27();dj.byId("payee_category").set("disabled",false);dj.byId("payee_category").set("value",dj.byId("payee_category_hidden").get("value"));_1e();}}}_1e();m.setValidation("base_cur_code",m.validateCurrency);m.setValidation("service_code",m.checkNumericOnlyValue);m.setValidation("end_date",m.validateEndDateWithCurrentDate);if(dijit.byId("sySubmitButton")){dijit.byId("sySubmitButton").set("onClick",function(){_2("SUBMIT");});}if(dj.byId("payee_category")&&dj.byId("payee_category").get("value")===""){dj.byId("dijit_form_Button_1").set("disabled",true);}}});m.dialog=m.dialog||{};d.mixin(m.dialog,{submitPayeeRef:function(_37){var _38=dj.byId(_37);if(_38&&_38.validate()&&_f()&&_16()&&_12()){_38.execute();_38.hide();}}});m._config=m._config||{};d.mixin(m,{beforeSubmitValidations:function(){var _39=true;var _3a=dijit.byId("payee_refs_grid");if(_3a){if(!_3a.grid){_39=false;}else{_3a.grid.store.fetch({query:{store_id:"*"},onComplete:function(_3b,_3c){if(_3b.length<1||_3b.length>5){_39=false;}}});}if(!_39){misys._config.onSubmitErrorMsg=misys.getLocalization("noOfPayeeRef");_3a.invalidMessage=misys.getLocalization("noOfPayeeRef");}}if(dj.byId("end_date")&&dj.byId("current_date")){var _3d=false;var _3e=new Date();var _3f=dj.byId("end_date");if(d.date.compare(_3e,_3f.get("value"))===1){_3e=_3e.getDate()+"/"+_3e.getMonth()+1+"/"+_3e.getFullYear();var msg=m.getLocalization("endDateSmallerThanCurrentDate",[_3f.get("displayedValue")]);_3f.set("state","Error");dj.hideTooltip(_3f.domNode);dj.showTooltip(msg,_3f.domNode,0);var _40=function(){dj.hideTooltip(_3f.domNode);};setTimeout(_40,5000);_3d=true;}}if(!_3d){return _39;}}});d.ready(function(){d.require("misys.system.widget.PayeeRef");d.require("misys.system.widget.PayeeRefs");});})(dojo,dijit,misys);dojo.require("misys.client.binding.system.master_payee_client");}