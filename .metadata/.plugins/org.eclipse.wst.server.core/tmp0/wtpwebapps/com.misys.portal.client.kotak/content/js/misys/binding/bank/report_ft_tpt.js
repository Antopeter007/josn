/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.binding.bank.report_ft_tpt"]){dojo._hasResource["misys.binding.bank.report_ft_tpt"]=true;dojo.provide("misys.binding.bank.report_ft_tpt");dojo.require("dojo.parser");dojo.require("dijit.layout.TabContainer");dojo.require("dijit.form.DateTextBox");dojo.require("misys.form.CurrencyTextBox");dojo.require("dijit.form.NumberTextBox");dojo.require("dijit.form.FilteringSelect");dojo.require("dijit.form.Form");dojo.require("dijit.form.Button");dojo.require("dijit.form.TextBox");dojo.require("misys.widget.Dialog");dojo.require("dijit.ProgressBar");dojo.require("dijit.form.ValidationTextBox");dojo.require("dijit.form.CheckBox");dojo.require("misys.form.PercentNumberTextBox");dojo.require("misys.form.SimpleTextarea");dojo.require("misys.widget.Collaboration");dojo.require("misys.form.common");dojo.require("misys.form.file");dojo.require("misys.form.addons");dojo.require("misys.validation.common");dojo.require("misys.binding.cash.ft_common");dojo.require("misys.form.BusinessDateTextBox");dojo.require("misys.binding.common.create_fx");(function(d,dj,m){var _1=d.byId("fx-message-type");function _2(_3){var _4=function(){var _5=dijit.byId("ft_amt");_5.set("state","Error");m.defaultBindTheFXTypes();dj.byId("ft_amt").set("value","");if(dj.byId("ft_cur_code")&&!dj.byId("ft_cur_code").get("readOnly")){dj.byId("ft_cur_code").set("value","");}};m.dialog.show("ERROR",_3,"",function(){setTimeout(_4,500);});if(d.byId("fx-section")&&(d.style(d.byId("fx-section"),"display")!=="none")){m.animate("wipeOut",d.byId("fx-section"));}};function _6(){var _7=true;var _8="";var _9=dj.byId("fx_rates_type_2");var _a=dj.byId("fx_total_utilise_amt");var _b=dj.byId("ft_amt");if(_9.get("checked")&&_a&&!isNaN(_a.get("value"))&&_b&&!isNaN(_b.get("value"))){if(_b.get("value")<_a.get("value")){_8+=m.getLocalization("FXUtiliseAmtGreaterMessage");_7=false;}}m._config.onSubmitErrorMsg=_8;return _7;};var _c,_d={};_d.fields=["beneficiary_name","beneficiary_account","beneficiary_act_cur_code","beneficiary_address","beneficiary_city","beneficiary_dom","cpty_bank_code","cpty_bank_name","cpty_bank_swift_bic_code","cpty_bank_address_line_1","cpty_bank_address_line_2","cpty_bank_dom","cpty_branch_code","cpty_branch_name","pre_approved"];_d.toggleReadonly=function(_e){m.toggleFieldsReadOnly(this.fields,_e);};_d.clear=function(){d.forEach(this.fields,function(_f,i){if(dj.byId(_f)){dj.byId(_f).set("value","");}});d.style("PAB","display","none");};function _10(){var _11=dj.byId("sub_product_code"),_12=dj.byId("beneficiary_account"),_13=dj.byId("beneficiary_act_cur_code");var _14=false;m.xhrPost({url:misys.getServletURL("/screen/AjaxScreen/action/ValidateBeneficiaryMasterAccount"),handleAs:"json",sync:true,content:{account_number:_12.get("value"),account_cur_code:_13.get("value"),sub_product_code:_11.get("value")},load:function(_15,_16){switch(_15.items.StatusCode){case "OK":_13.set("value",_15.items.AcctCur);_14=true;break;case "ERR_INVALID_ACCOUNT_NUMBER":_c=misys.getLocalization("invalidAccountNumber",[_12.get("value")]);_12.focus();_12.set("value","");_12.set("state","Error");dj.hideTooltip(_12.domNode);dj.showTooltip(_c,_12.domNode,0);break;case "ERR_INVALID_INTERFACE_PROCESSING_ERROR":_c=misys.getLocalization("accountValidationInterfaceError");_12.focus();_12.set("value","");_12.set("state","Error");dj.hideTooltip(_12.domNode);dj.showTooltip(_c,_12.domNode,0);break;default:_c=_15.items.StatusCodeMessage;_12.focus();_12.set("value","");_12.set("state","Error");dj.hideTooltip(_12.domNode);dj.showTooltip(_c,_12.domNode,0);break;}},error:function(_17,_18){console.error("[Could not validate Beneficiary Account] "+_12.get("value"));console.error(_17);}});return _14;};d.mixin(m._config,{initReAuthParams:function(){var _19={productCode:"FT",subProductCode:dj.byId("sub_product_code").get("value"),transactionTypeCode:"15",entity:dj.byId("entity")?dj.byId("entity").get("value"):"",currency:dj.byId("ft_cur_code").get("value"),amount:m.trimAmount(dj.byId("ft_amt").get("value")),es_field1:m.trimAmount(dj.byId("ft_amt").get("value")),es_field2:(dj.byId("beneficiary_account"))?dj.byId("beneficiary_account").get("value"):""};return _19;}});d.mixin(m,{fireFXAction:function(){if(m._config.fxParamData&&dj.byId("sub_product_code")&&dj.byId("sub_product_code").get("value")!==""){var _1a=m._config.fxParamData[dj.byId("sub_product_code").get("value")];if(m._config.fxParamData&&_1a.fxParametersData.isFXEnabled==="Y"){var _1b,_1c;var _1d="";if(dj.byId("ft_cur_code")){_1d=dj.byId("ft_cur_code").get("value");}var _1e=dj.byId("ft_amt").get("value");var _1f=dj.byId("applicant_act_cur_code").get("value");var _20=m._config.productCode;var _21="";if(dj.byId("issuing_bank_abbv_name")&&dj.byId("issuing_bank_abbv_name").get("value")!==""){_21=dj.byId("issuing_bank_abbv_name").get("value");}var _22=dj.byId("applicant_act_cur_code").get("value");var _23=false;if(_1d!==""&&!isNaN(_1e)&&_20!==""&&_21!==""){if(_1d!==_1f){_1b=_1f;_1c=_1d;_22=_1f;}if(_1b&&_1b!==""&&_1c&&_1c!==""){if(d.byId("fx-section")&&(d.style(d.byId("fx-section"),"display")==="none")){m.animate("wipeIn",d.byId("fx-section"));}m.fetchFXDetails(_1b,_1c,_1e,_20,_21,_22,_23);if(dj.byId("fx_rates_type_1")&&dj.byId("fx_rates_type_1").get("checked")){if(isNaN(dj.byId("fx_exchange_rate").get("value"))||dj.byId("fx_exchange_rate_cur_code").get("value")===""||isNaN(dj.byId("fx_exchange_rate_amt").get("value"))||(m._config.fxParamData[dj.byId("sub_product_code").get("value")].fxParametersData.toleranceDispInd==="Y"&&(isNaN(dj.byId("fx_tolerance_rate").get("value"))||isNaN(dj.byId("fx_tolerance_rate_amt").get("value"))||dj.byId("fx_tolerance_rate_cur_code").get("value")===""))){_2(m.getLocalization("FXDefaultErrorMessage"));}}}else{if(d.byId("fx-section")&&(d.style(d.byId("fx-section"),"display")!=="none")){m.animate("wipeOut",d.byId("fx-section"));}m.defaultBindTheFXTypes();}}if(dj.byId("recurring_payment_enabled")&&dj.byId("recurring_payment_enabled").get("checked")&&dj.byId("fx_rates_type_2")){dj.byId("fx_rates_type_2").set("disabled",true);m.animate("wipeOut",d.byId("contracts_div"));}}}},bind:function(){m.setValidation("iss_date",m.validateTransferDateCustomer);dj.byId("sub_product_code").set("value","TPT");m.bindRecurringFields();m.connect("prod_stat_code","onChange",m.populateReportingStatus);m.connect("ft_cur_code","onChange",function(){m.setCurrency(this,["ft_amt"]);});m.setValidation("ft_cur_code",m.validateCurrency);m.connect("beneficiary_account","onChange",_10);m.connect("beneficiary_act_cur_code","onChange",function(){dj.byId("ft_cur_code").set("value",dj.byId("beneficiary_act_cur_code").get("value"));});m.setValidation("beneficiary_act_cur_code",m.validateCurrency);m.connect("entity","onChange",function(){m.setApplicantReference();dj.byId("applicant_act_name").set("value","");});m.connect("pre_approved_status","onChange",function(){if(dj.byId("pre_approved_status").get("value")==="N"){if(dj.byId("bank_img")){dj.byId("bank_img").set("disabled",false);}if(dj.byId("bank_iso_img")){dj.byId("bank_iso_img").set("disabled",false);}if(dj.byId("currency")){dj.byId("currency").set("disabled",false);}}var _24=dj.byId("sub_product_code");});m.connect("recurring_flag","onClick",m.showRecurring);var _25=dj.byId("sub_product_code").get("value");if(m._config.fxParamData&&m._config.fxParamData[_25].fxParametersData.isFXEnabled==="Y"){m.connect("ft_cur_code","onBlur",function(){m.setCurrency(this,["ft_amt"]);if(dj.byId("ft_cur_code").get("value")!==""&&!isNaN(dj.byId("ft_amt").get("value"))){m.fireFXAction();}else{m.defaultBindTheFXTypes();}});m.connect("ft_amt","onBlur",function(){m.setTnxAmt(this.get("value"));var _26="";if(dj.byId("ft_cur_code")){_26=dj.byId("ft_cur_code").get("value");}if(!isNaN(dj.byId("ft_amt").get("value"))&&_26!==""){m.fireFXAction();}else{m.defaultBindTheFXTypes();}});}else{if(d.byId("fx-section")&&dj.byId("fx_rates_type_1")&&!dj.byId("fx_rates_type_1").get("checked")&&dj.byId("fx_rates_type_2")&&!dj.byId("fx_rates_type_2").get("checked")){d.style("fx-section","display","none");}}},onFormLoad:function(){m.populateReportingStatus();m.setCurrency(dj.byId("ft_cur_code"),["ft_amt"]);m.initForm();m.setApplicantReference();if(dj.byId("recurring_payment_enabled")&&dj.byId("recurring_payment_enabled").get("checked")){m.showSavedRecurringDetails(false);}else{if(d.byId("recurring_payment_div")){d.style("recurring_payment_div","display","none");}m.showSavedRecurringDetails(false);}if(dj.byId("applicant_act_product_types")&&dj.byId("applicant_act_no").get("value")!==""){m.toggleRequired("applicant_act_product_types",false);}if(m._config.fxParamData&&dj.byId("sub_product_code")&&dj.byId("sub_product_code").get("value")!==""&&dj.byId("sub_product_code").get("value")!=="IBG"){m.initializeFX(dj.byId("sub_product_code").get("value"));if(dj.byId("applicant_act_cur_code")&&dj.byId("applicant_act_cur_code").get("value")!==""&&dj.byId("ft_cur_code")&&dj.byId("ft_cur_code").get("value")!==""&&dj.byId("applicant_act_cur_code").get("value")!==dj.byId("ft_cur_code").get("value")){m.onloadFXActions();}else{m.defaultBindTheFXTypes();}}else{m.animate("fadeOut",_1);}if(d.byId("fx-section")){if(dj.byId("bulk_ref_id")&&dj.byId("ft_cur_code")&&dj.byId("ft_amt")&&dj.byId("bulk_ref_id").get("value")!==""&&dj.byId("ft_cur_code").get("value")!==""&&!isNaN(dj.byId("ft_amt").get("value"))){m.initializeFX(dj.byId("sub_product_code").get("value"));m.fireFXAction();}else{if((dj.byId("fx_exchange_rate_cur_code")&&dj.byId("fx_exchange_rate_cur_code").get("value")!=="")||(dj.byId("fx_total_utilise_cur_code")&&dj.byId("fx_total_utilise_cur_code").get("value")!=="")||((dj.byId("fx_rates_type_1")&&dj.byId("fx_rates_type_1").get("checked"))||(dj.byId("fx_rates_type_2")&&dj.byId("fx_rates_type_2").get("checked")))){m.animate("wipeIn",d.byId("fx-section"));}else{d.style("fx-section","display","none");}}}},initForm:function(){dj.byId("sub_product_code").set("value","TPT");if(dj.byId("pre_approved_status")&&dj.byId("pre_approved_status").get("value")==="Y"){d.style("PAB","display","inline");_d.toggleReadonly(true);if(dj.byId("bank_img")){dj.byId("bank_img").set("disabled",true);}if(dj.byId("bank_iso_img")){dj.byId("bank_iso_img").set("disabled",true);}if(dj.byId("currency")){dj.byId("currency").set("disabled",true);}}d.forEach(d.query(".CUR"),function(_27,i){d.style(_27,"display","inline");});dj.byId("beneficiary_mode").set("value","02");m.toggleRequired("beneficiary_act_cur_code",true);if(dj.byId("bank_img")){dj.byId("bank_img").set("disabled",true);}}});})(dojo,dijit,misys);dojo.require("misys.client.binding.bank.report_ft_tpt_client");}