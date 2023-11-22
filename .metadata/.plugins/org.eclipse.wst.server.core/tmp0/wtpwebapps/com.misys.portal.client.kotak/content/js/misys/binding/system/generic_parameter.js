/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.binding.system.generic_parameter"]){dojo._hasResource["misys.binding.system.generic_parameter"]=true;dojo.provide("misys.binding.system.generic_parameter");dojo.require("dijit.form.NumberTextBox");dojo.require("misys.form.common");dojo.require("misys.validation.common");dojo.require("dijit.form.Form");dojo.require("dijit.form.Button");dojo.require("dijit.form.TextBox");dojo.require("dijit.form.ValidationTextBox");dojo.require("dijit.form.CheckBox");dojo.require("dijit.layout.ContentPane");dojo.require("dojo.data.ItemFileReadStore");dojo.require("dojo.data.ItemFileWriteStore");dojo.require("dojox.grid.cells.dijit");dojo.require("dojox.grid.cells");dojo.require("misys.common");(function(d,dj,m){function _1(){var _2=dj.byId("key_8")?dj.byId("key_8").get("value"):"";var _3=dj.byId("key_9")?dj.byId("key_9").get("value"):"";if(_2&&_3&&_2==_3){this.invalidMessage=m.getLocalization("bothWeeklyHolidaySameError");return false;}return true;};function _4(){var _5=dj.byId("key_2");_5.set("disabled",true);};function _6(){var _7=dj.byId("data_1");var _8=dj.byId("data_2");if(_8.get("value")!==null||_8.get("value")!==""){if(parseInt(_7.get("value"),10)>=parseInt(_8.get("value"),10)){this.invalidMessage=m.getLocalization("startHourErrorMsgForParameter");return false;}}return true;};function _9(){var _a=dj.byId("data_1");var _b=dj.byId("data_2");if(parseInt(_b.get("value"),10)===0){return true;}else{if(parseInt(_b.get("value"),10)<=parseInt(_a.get("value"),10)){this.invalidMessage=m.getLocalization("endHourErrorMsgForParameter");return false;}}return true;};function _c(){var _d=dj.byId("data_1");var _e=dj.byId("data_2");if(_d.get("value")===_e.get("value")){this.invalidMessage=m.getLocalization("sameStartAndEndHourErrorMsg");return false;}return true;};function _f(){var _10=dj.byId("data_1");var _11=dj.byId("data_2");var _12=dj.byId("data_5");var _13=dj.byId("data_6");if((_10.get("value")===_11.get("value"))&&(_12.get("value")===_13.get("value"))){this.set("state","Error");dj.showTooltip(m.getLocalization("sameStartAndEndTimeErrorMsg"),this.domNode,0);var _14=function(){dj.hideTooltip(this.domNode);};var _15=2000;setTimeout(_14,_15);}};function _16(){var _17=dj.byId("data_3");var _18=dj.byId("data_4");if((_18.get("value")!==null&&_18.get("value")!=="")&&(_17.get("value")!==null&&_17.get("value")!=="")){if(_18.get("value")===_17.get("value")){this.set("state","Error");dj.showTooltip(m.getLocalization("sameHolidayErrorMsg"),this.domNode,0);var _19=function(){dj.hideTooltip(this.domNode);};var _1a=2000;setTimeout(_19,_1a);}}};d.mixin(m,{bind:function(){m.connect("product_code","onChange",function(){var _1b=new dojo.data.ItemFileReadStore({data:{identifier:"value",label:"name",items:misys._config.subProductCodes[dijit.byId("product_code").get("value")]}});if(dijit.byId("sub_product_code")){dijit.byId("sub_product_code").set("value","");dijit.byId("sub_product_code").set("displayedValue","");dijit.byId("sub_product_code").store=_1b;}});m.connect("sub_product_code","onChange",function(){var _1c=dj.byId("sub_product_code");var _1d=d.byId("clearing_value_row");var _1e=d.byId("key_8_row");var _1f=d.byId("_cur_code_row");var _20=dj.byId("clearing_value");if(dijit.byId("parm_id").get("value")=="P110"){if(_1c&&(_1c.get("value")=="MUPS"||_1c.get("value")=="MLMUM"||_1c.get("value")=="ULMUM"||_1c.get("value")=="MLMUX"||_1c.get("value")=="ULMUX"||_1c.get("value")=="MPMUP"||_1c.get("value")=="UPMUP")){m.animate("fadeIn",_1d);m.toggleRequired("clearing_value",true);dijit.byId("key_8").set("value","INR");dj.byId("key_8").set("disabled",true);d.style(d.byId("_amt_img_label"),"display","none");m.setValidation("key_8",m.validateCurrency);}else{m.animate("fadeOut",_1d);m.toggleRequired("clearing_value",false);dj.byId("clearing_value").set("value","");if(dijit.byId("key_8")&&(dijit.byId("key_8").get("value")!=null)){dj.byId("key_8").set("disabled",false);d.style(d.byId("_amt_img_label"),"display","");}if(_1c&&(_1c.get("value")=="HVPS"||_1c.get("value")=="HVXB"||_1c.get("value")=="MPHXB"||_1c.get("value")=="MPHVP"||_1c.get("value")=="MLHXM"||_1c.get("value")=="MLHXX"||_1c.get("value")=="MLHVM"||_1c.get("value")=="MLHVX"||_1c.get("value")=="UPHXB"||_1c.get("value")=="UPHVP"||_1c.get("value")=="ULHXM"||_1c.get("value")=="ULHXX"||_1c.get("value")=="ULHVM"||_1c.get("value")=="ULHVX")){dijit.byId("key_8").set("value","CNY");dj.byId("key_8").set("disabled",true);d.style(d.byId("_amt_img_label"),"display","none");}else{if(_1c&&(_1c.get("value")==="MEPS"||_1c.get("value")==="UPMEP"||_1c.get("value")==="MPMEP"||_1c.get("value")==="ULMEX"||_1c.get("value")==="MLMEX"||_1c.get("value")==="MLMEM")){dijit.byId("key_8").set("value","SGD");dj.byId("key_8").set("disabled",true);d.style(d.byId("_amt_img_label"),"display","none");}}m.setValidation("key_8",m.validateCurrency);}}else{if(dijit.byId("parm_id").get("value")==="P109"){if(dijit.byId("key_5")&&(dijit.byId("key_5").get("value")!=null)){dj.byId("key_5").set("disabled",false);d.style(d.byId("_amt_img_label"),"display","");}if(_1c&&(_1c.get("value")==="MEPS"||_1c.get("value")==="UPMEP"||_1c.get("value")==="MPMEP"||_1c.get("value")==="ULMEX"||_1c.get("value")==="MLMEX"||_1c.get("value")==="MLMEM")){dijit.byId("key_5").set("value","SGD");dj.byId("key_5").set("disabled",true);d.style(d.byId("_amt_img_label"),"display","none");}m.setValidation("key_5",m.validateCurrency);}}});var _21=dijit.byId("parm_id").get("value");if(_21==="P109"){m.setValidation("key_5",m.validateCurrency);}if(!(_21=="P110")){m.setValidation("key_9",_1);m.setValidation("key_8",_1);}if(_21==="P110"){var _22=dj.byId("sub_product_code");if(_22&&(_22.get("value")=="MUPS"||_22.get("value")=="MLMUM"||_22.get("value")=="ULMUM"||_22.get("value")=="MLMUX"||_22.get("value")=="ULMUX"||_22.get("value")=="MPMUP"||_22.get("value")=="UPMUP")){dijit.byId("key_8").set("value","INR");dj.byId("key_8").set("disabled",true);}else{m.setValidation("key_8",m.validateCurrency);}m.connect("data_4","onChange",function(){var _23=dijit.byId("data_4").get("value");if(!m.validateOffset(_23)){dijit.byId("data_4").set("state","Error");misys.dialog.show("ERROR",misys.getLocalization("invalidOffsetField"));return;}});}if(_21==="P108"){m.connect("data_3","onBlur",_16);m.connect("data_4","onBlur",_16);m.connect("data_1","onBlur",_f);m.connect("data_2","onBlur",_f);m.connect("data_5","onBlur",_f);m.connect("data_6","onBlur",_f);}if(_21==="P261"){m.setValidation("data_1",m.validateEmailAddr);m.setValidation("data_2",m.validateGroupName);m.setValidation("key_2",m.validateGroupId);}},onFormLoad:function(){if(dj.byId("parm_id").get("value")=="P110"){d.style(d.byId("clearing_value_row"),"display","none");if(dj.byId("sub_product_code").get("value")=="MUPS"||dj.byId("sub_product_code").get("value")=="MLMUM"||dj.byId("sub_product_code").get("value")=="ULMUM"||dj.byId("sub_product_code").get("value")=="MLMUX"||dj.byId("sub_product_code").get("value")=="ULMUX"||dj.byId("sub_product_code").get("value")=="MPMUP"||dj.byId("sub_product_code").get("value")=="UPMUP"){m.toggleRequired("clearing_value",true);}else{m.toggleRequired("clearing_value",false);}}if(m._config.amountField){m.setCurrency(dj.byId("cur_code_"+m._config.amountField),[m._config.amountField]);}if(dijit.byId("product_code")&&dijit.byId("product_code").get("value")!==""){var _24=dijit.byId("product_code").get("value");var _25=new dojo.data.ItemFileReadStore({data:{identifier:"value",label:"name",items:misys._config.subProductCodes[_24]}});if(dijit.byId("sub_product_code")){dijit.byId("sub_product_code").store=_25;dijit.byId("sub_product_code").set("value",dijit.byId("sub_product_code_hidden").get("value"));}}if(dj.byId("parm_id")&&dj.byId("parm_id").get("value")=="P109"){var _26=new Date();_26.setDate(_26.getDate());dj.byId("data_1").constraints.min=_26;}if(dijit.byId("parm_id")&&dijit.byId("parm_id").get("value")==="P108"){_4();}if(dijit.byId("parm_id")&&dijit.byId("parm_id").get("value")==="P261"){var _27=dj.byId("key_2");if(_27.get("value")!==""){_27.set("disabled",true);}}},setCustomConfirmMessage:function(){if(dijit.byId("parm_id")&&dijit.byId("parm_id").get("value")==="P108"){m._config.globalSubmitConfirmationMsg=m.getLocalization("acccessbilityHourSubmitionWarningMsg");}},onCancelNavigation:function(){var _28=m._config.homeUrl;var _29=null;if(dj.byId("featureid")&&dj.byId("featureid").get("value")){_29=["/screen/BankSystemFeaturesScreen?option=GENERIC_PARAMETER_MAINTENANCE","&featureid="+dijit.byId("featureid").get("value"),"&operation=SELECT_PARAMETER"];}else{_29=["/screen/BankSystemFeaturesScreen?option=GENERIC_PARAMETER_MAINTENANCE"];}_28=m.getServletURL(_29.join(""));return _28;},beforeSaveValidations:function(){var _2a=dj.byId("featureid");var _2b=true;var _2c=dj.byId("configurable_grid_items");if(_2a&&_2a.get("value")==="P108"){var _2d=["data_1","data_2","data_5","data_6"];d.forEach(_2d,function(_2e){if(dj.byId(_2e)&&dj.byId(_2e).state==="Error"){m._config.onSubmitErrorMsg=m.getLocalization("mandatoryStartAndEndTimeErrorMsg");_2b=false;}});}if(_2c&&_2c.store&&_2c.store._arrayOfTopLevelItems){for(var i=0;i<_2c.store._arrayOfTopLevelItems.length;i++){var _2f=_2c.store._arrayOfTopLevelItems[i].data_1;var _30=null;if(_2f&&_2f[0]){if(!isNaN(_2f[0])){var _31=parseInt(_2f[0],10);_30=dojo.date.locale.format(new Date(_31),{datePattern:m.getLocalization("g_strGlobalDateFormat"),selector:"date"});_2c.store._arrayOfTopLevelItems[i].data_1=_30;}}}}return _2b;},beforeSubmitValidations:function(){var _32=true;if(dijit.byId("tnxTypeCode")&&dijit.byId("tnxTypeCode").get("value")!=="12"){var _33=dj.byId("configurable_grid_items");var _34=new Date();_34.setHours(0,0,0,0);if(_33&&_33.store&&_33.store._arrayOfTopLevelItems){for(var i=0;i<_33.store._arrayOfTopLevelItems.length;i++){var _35=_33.store._arrayOfTopLevelItems[i].data_1;var _36=null;if(_35&&_35[0]){if(!isNaN(_35[0])){var _37=parseInt(_35[0],10);_36=dojo.date.locale.format(new Date(_37),{datePattern:m.getLocalization("g_strGlobalDateFormat"),selector:"date"});_33.store._arrayOfTopLevelItems[i].data_1=_36;}else{_36=_35[0];}}var cd=dojo.date.locale.parse(_36,{datePattern:m.getLocalization("g_strGlobalDateFormat"),selector:"date",formatLength:"short",locale:dojo.config.locale});var _38=_33.store._arrayOfTopLevelItems[i].edit;if((_35.value!==""||_35.value!==null)&&cd<_34&&_38[0]==="Y"){_32=false;misys._config.onSubmitErrorMsg=m.getLocalization("closingDateLessThanCurrentDateError",[_35]);return _32;}if(_35[0]===""){_32=false;misys._config.onSubmitErrorMsg=m.getLocalization("closingdayblank",[_35]);return _32;}}}}var _39=dijit.byId("configurable_grid_items");if(_39){if(!_39.grid){_32=false;}else{_39.grid.store.fetch({query:{store_id:"*"},onComplete:function(_3a,_3b){if(_3a.length<1){_32=false;}}});}if(!_32){misys._config.onSubmitErrorMsg=misys.getLocalization("mandatoryData");_39.invalidMessage=misys.getLocalization("mandatoryData");misys.showTooltip(misys.getLocalization("mandatoryData"),_39.domNode);}}if(dijit.byId("parm_id")){var _3c=dijit.byId("parm_id").get("value");if(_3c==="P110"){var _3d=dijit.byId("data_4").get("value");if(!m.validateOffset(_3d)){dijit.byId("data_4").set("state","Error");_32=false;}}}return _32;}});})(dojo,dijit,misys);dojo.require("misys.client.binding.system.generic_parameter_client");}