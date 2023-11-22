/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.binding.trade.amend_si"]){dojo._hasResource["misys.binding.trade.amend_si"]=true;dojo.provide("misys.binding.trade.amend_si");dojo.require("dijit.form.DateTextBox");dojo.require("dijit.form.CurrencyTextBox");dojo.require("dijit.form.NumberTextBox");dojo.require("dijit.form.FilteringSelect");dojo.require("misys.form.file");dojo.require("misys.form.SimpleTextarea");dojo.require("misys.form.common");dojo.require("misys.validation.common");dojo.require("dijit.form.Form");dojo.require("dijit.form.Button");dojo.require("dijit.form.TextBox");dojo.require("misys.widget.Dialog");dojo.require("dijit.ProgressBar");dojo.require("dijit.form.ValidationTextBox");dojo.require("dijit.form.CheckBox");dojo.require("dijit.layout.ContentPane");dojo.require("misys.widget.Collaboration");(function(d,dj,m){var _1="deletegridrecord";d.mixin(m._config,{initReAuthParams:function(){var _2={productCode:"SI",subProductCode:"",transactionTypeCode:"03",entity:dj.byId("entity")?dj.byId("entity").get("value"):"",currency:dj.byId("lc_cur_code")?dj.byId("lc_cur_code").get("value"):"",amount:dj.byId("lc_amt")?m.trimAmount(dj.byId("lc_amt").get("value")):"",es_field1:dj.byId("lc_amt")?m.trimAmount(dj.byId("lc_amt").get("value")):"",es_field2:""};return _2;}});function _3(){if(dj.byId("org_lc_cur_code_liab_amt")&&dj.byId("org_lc_cur_code_liab_amt").get("value")!==null&&dj.byId("dec_amt")&&dj.byId("dec_amt").get("value")!==null){if(d.number.parse(dijit.byId("org_lc_cur_code_liab_amt").get("value"))<dijit.byId("dec_amt").get("value")){var _4=dj.byId("lc_cur_code").get("value");var _5=dojo.number.parse(dj.byId("org_lc_cur_code_liab_amt").get("value"));dj.byId("dec_amt").invalidMessage=m.getLocalization("decAmountLessThanOutstandingAmt",[_4,_5.toFixed(2)]);misys.dialog.show("ERROR",dj.byId("dec_amt").invalidMessage,"",function(){dj.byId("dec_amt").focus();dj.byId("dec_amt").set("state","Error");});return false;}else{if(d.number.parse(dijit.byId("org_lc_amt").get("value"))<dijit.byId("dec_amt").get("value")){dijit.byId("dec_amt").invalidMessage=m.getLocalization("decreaseAmountShouldBeLessThanLCAmount");misys.dialog.show("ERROR",dj.byId("dec_amt").invalidMessage,"",function(){dj.byId("dec_amt").focus();dj.byId("dec_amt").set("state","Error");});return false;}}return true;}};d.mixin(m,{bind:function(){m.setValidation("exp_date",m.validateTradeExpiryDate);m.setValidation("amd_date",m.validateAmendmentDate);m.connect("inc_amt","onBlur",function(){m.validateAmendAmount(true,this,"si");});m.connect("dec_amt","onBlur",function(){_3();m.validateAmendAmount(true,this,"si");});m.setValidation("pstv_tol_pct",m.validateTolerance);m.setValidation("neg_tol_pct",m.validateTolerance);m.setValidation("max_cr_desc_code",m.validateMaxCreditTerm);m.setValidation("last_ship_date",m.validateLastShipmentDate);m.setValidation("renew_for_nb",m.validateRenewFor);m.setValidation("advise_renewal_days_nb",m.validateDaysNotice);m.setValidation("rolling_renewal_nb",m.validateNumberOfRenewals);m.setValidation("rolling_cancellation_days",m.validateCancellationNotice);m.setValidation("renewal_calendar_date",m.validateRenewalCalendarDate);m.connect("inc_amt","onBlur",m.amendTransaction);m.connect("dec_amt","onBlur",m.amendTransaction);m.connect("renew_flag","onClick",m.toggleRenewalDetails);m.connect("renew_flag","onClick",function(){if(!this.get("checked")){dj.byId("rolling_renewal_nb").set("value","");}else{if(!dj.byId("rolling_renewal_flag").get("checked")){dj.byId("rolling_renewal_nb").set("value",m.getLocalization("default_rewnewalNumber"));}}});m.connect("product_type_code","onChange",function(){if(dj.byId("product_type_code").get("value")!=="99"){d.style("product_type_details_row","display","none");}else{d.style("product_type_details_row","display","block");}});m.connect("advise_renewal_flag","onClick",function(){m.toggleFields(this.get("checked"),null,["advise_renewal_days_nb"]);});m.connect("advise_renewal_flag","onChange",function(){m.toggleFields(this.get("checked"),null,["advise_renewal_days_nb"]);});m.connect("rolling_renewal_flag","onClick",function(){m.toggleFields(this.get("checked"),null,["rolling_renewal_nb","rolling_cancellation_days","rolling_renew_on_code"]);if(!this.get("checked")){dj.byId("rolling_renew_for_nb").set("value","");dj.byId("rolling_renew_for_period").set("value","");dj.byId("rolling_day_in_month").set("value","");if(dj.byId("renew_flag").get("checked")){dj.byId("rolling_renewal_nb").set("value",m.getLocalization("default_rewnewalNumber"));}}});m.connect("final_expiry_date","onChange",function(){var _6=dj.byId("exp_date");var _7=dj.byId("projected_expiry_date");var _8=function(){dj.hideTooltip(dj.byId("final_expiry_date").domNode);};var _9=this.get("displayedValue");if(_6&&!m.compareDateFields(_6,this)){this.set("state","Error");dj.showTooltip(m.getLocalization("finalExpDateLessThanTransactionExpDtError",[_9,_6.get("displayedValue")]),dj.byId("final_expiry_date").domNode,0);setTimeout(_8,2000);}else{if(_7&&!m.compareDateFields(_7,this)){this.set("value",null);dj.showTooltip(m.getLocalization("finalExpDateLessThanProjectedExpDtError",[_9,_7.get("displayedValue")]),dj.byId("final_expiry_date").domNode,0);setTimeout(_8,2000);}}});m.connect("rolling_renewal_flag","onChange",function(){m.toggleFields(this.get("checked"),null,["rolling_renewal_nb","rolling_cancellation_days","rolling_renew_on_code"]);if(!this.get("checked")){dj.byId("rolling_renew_for_nb").set("value","");dj.byId("rolling_renew_for_period").set("value","");dj.byId("rolling_day_in_month").set("value","");if(dj.byId("renew_flag").get("checked")){dj.byId("rolling_renewal_nb").set("value",m.getLocalization("default_rewnewalNumber"));}}});m.connect("rolling_renew_on_code","onChange",function(){m.toggleFields(this.get("value")==="03",["rolling_day_in_month"],["rolling_renew_for_nb"],true);if(this.get("value")==="01"){dj.byId("rolling_renew_for_nb").set("value","");dj.byId("rolling_renew_for_period").set("value","");dj.byId("rolling_day_in_month").set("value","");}else{if(dj.byId("rolling_renew_on_code").get("value")==="03"&&dj.byId("rolling_renewal_flag").get("checked")&&dj.byId("renew_for_period").get("value")!==""){dj.byId("rolling_renew_for_period").set("value",dj.byId("renew_for_period").get("value"));}}});m.connect("rolling_renew_for_nb","onBlur",function(){m.validateRollingRenewalFrequency(dj.byId("rolling_renew_for_nb"));});m.connect("renew_for_nb","onBlur",function(){m.validateRollingRenewalFrequency(dj.byId("renew_for_nb"));});m.connect("renew_for_period","onChange",function(){if(dj.byId("rolling_renew_on_code").get("value")==="03"&&dj.byId("rolling_renewal_flag").get("checked")&&dj.byId("renew_for_period").get("value")!==""){dj.byId("rolling_renew_for_period").set("value",dj.byId("renew_for_period").get("value"));}});m.connect("rolling_day_in_month","onChange",function(){if(dj.byId("rolling_renew_for_period").get("value")==="D"){this.set("value","");dj.showTooltip(m.getLocalization("dayInMonthNotApplicableForDaysError"),dj.byId("rolling_day_in_month").domNode,0);var _a=function(){dj.hideTooltip(dj.byId("rolling_day_in_month").domNode);};setTimeout(_a,1500);}});m.connect("rolling_renew_for_period","onChange",function(){if(dj.byId("rolling_renew_for_period").get("value")==="D"&&!isNaN(dj.byId("rolling_day_in_month").get("value"))){dj.byId("rolling_day_in_month").set("value","");dj.showTooltip(m.getLocalization("dayInMonthNotApplicableForDaysError"),dj.byId("rolling_renew_for_period").domNode,0);var _b=function(){dj.hideTooltip(dj.byId("rolling_day_in_month").domNode);};setTimeout(_b,1500);}});m.connect("renew_on_code","onChange",function(){m.toggleFields(this.get("value")==="02",null,["renewal_calendar_date"]);});if(m._config.release_flag){m.connect("lc_release_flag","onClick",m.toggleAmendmentFields);}m.connect("narrative_shipment_period","onChange",function(){m.toggleDependentFields(this,dj.byId("last_ship_date"),m.getLocalization("shipmentDateOrPeriodExclusivityError"));});m.connect("narrative_shipment_period","onClick",function(){m.toggleDependentFields(this,dj.byId("last_ship_date"),m.getLocalization("shipmentDateOrPeriodExclusivityError"));});m.connect("last_ship_date","onChange",function(){m.toggleDependentFields(this,dj.byId("narrative_shipment_period"),m.getLocalization("shipmentDateOrPeriodExclusivityError"));});m.connect("last_ship_date","onClick",function(){m.toggleDependentFields(this,dj.byId("narrative_shipment_period"),m.getLocalization("shipmentDateOrPeriodExclusivityError"));});m.connect("renew_amt_code_1","onClick",function(){m.setRenewalAmount(this);});m.connect("renew_amt_code_2","onClick",function(){m.setRenewalAmount(this);});m.connect("rolling_renewal_nb","onBlur",m.calculateRenewalFinalExpiryDate);m.connect("renew_on_code","onBlur",m.calculateRenewalFinalExpiryDate);m.connect("renewal_calendar_date","onBlur",m.calculateRenewalFinalExpiryDate);m.connect("renew_for_nb","onBlur",m.calculateRenewalFinalExpiryDate);m.connect("renew_for_period","onBlur",m.calculateRenewalFinalExpiryDate);m.connect("rolling_renew_on_code","onChange",m.calculateRenewalFinalExpiryDate);m.connect("rolling_renew_for_nb","onChange",m.calculateRenewalFinalExpiryDate);m.connect("rolling_renew_for_period","onChange",m.calculateRenewalFinalExpiryDate);},onFormLoad:function(){m.xhrPost({url:misys.getServletURL("/screen/AjaxScreen/action/GetAmendmentWarning"),handleAs:"json",sync:true,content:{refId:dj.byId("ref_id").get("value"),companyId:dj.byId("company_id").get("value"),productCode:"SI"},load:function(_c,_d){m._config.showWarningBene=_c.showWarningBene?_c.showWarningBene:false;}});if(m._config.showWarningBene){m.dialog.show("CONFIRMATION",m.getLocalization("warningMsgAmendLC"),"","","","","",function(){var _e="/screen/StandbyIssuedScreen?option=EXISTING&tnxtype=03";window.location.href=misys.getServletURL(_e);return;});}var _f=dj.byId("issuing_bank_abbv_name").get("value");var _10=m._config.customerBanksMT798Channel[_f]===true&&dj.byId("adv_send_mode").get("value")==="01";m._config.productCode="lc";m.setCurrency(dj.byId("lc_cur_code"),["inc_amt","dec_amt","org_lc_amt","lc_amt"]);if(_10){m.toggleRequired("amd_details",true);if(dj.byId("delivery_channel").get("value")===""){m.animate("fadeIn",d.byId("delivery_channel_row"));dj.byId("delivery_channel").set("disabled",true);}else{m.animate("fadeIn",d.byId("delivery_channel_row"));}if(dj.byId("delivery_channel")){var _11=dj.byId("issuing_bank_abbv_name")?dj.byId("issuing_bank_abbv_name").get("value"):"";if(!m.hasAttachments()){dj.byId("delivery_channel").set("disabled",true);dj.byId("delivery_channel").set("value",null);}else{m.toggleFields(m._config.customerBanksMT798Channel[_11]===true&&m.hasAttachments(),null,["delivery_channel"],false,false);}m.animate("fadeIn","delivery_channel_row");m.connect("delivery_channel","onChange",function(){if(dj.byId("attachment-file")){if(dj.byId("delivery_channel").get("value")==="FACT"){dj.byId("attachment-file").displayFileAct(true);}else{dj.byId("attachment-file").displayFileAct(false);}}});dj.byId("delivery_channel").onChange();}}else{m.animate("fadeOut",d.byId("delivery_channel_row"));}if(m._config.release_flag){m.animate("fadeOut",d.byId("lc_release_flag_row"));}var _12=dj.byId("product_type_code");if(_12&&_12.get("value")!=="99"){d.style("product_type_details_row","display","none");}var _13=dj.byId("renew_flag");if(_13){d.hitch(_13,m.toggleRenewalDetails,true)();}if(dj.byId("provisional_status")){d.style("provisional_status_row","display","none");}var _14=dj.byId("renew_on_code");if(_14){m.toggleFields(_14.get("value")==="02",null,["renewal_calendar_date"],true);}var _15=dj.byId("advise_renewal_flag");if(_15){m.toggleFields(_15.get("checked"),null,["advise_renewal_days_nb"],true);}var _16=dj.byId("rolling_renewal_flag");if(_16){m.toggleFields(_16.get("checked"),null,["rolling_renewal_nb","rolling_cancellation_days","rolling_renew_on_code"],true);}var _17=dj.byId("rolling_renew_on_code");if(_17){m.toggleFields(_17.get("value")==="03",["rolling_day_in_month"],["rolling_renew_for_nb"],true);}var _18=dojo.subscribe(_1,function(){m.toggleFields(m._config.customerBanksMT798Channel[_f]===true&&m.hasAttachments(),null,["delivery_channel"],false,false);});if(dj.byId("inc_amt")&&!isNaN(dj.byId("inc_amt").get("value"))){dj.byId("inc_amt").onBlur();}else{if(dj.byId("dec_amt")&&!isNaN(dj.byId("dec_amt").get("value"))){dj.byId("dec_amt").onBlur();}}m.setRenewalAmountOnFormLoad();},beforeSaveValidations:function(){var _19=dj.byId("principal_act_no");if(_19&&_19.get("value")!==""){if(!m.validatePricipleAccount()){m._config.onSubmitErrorMsg=m.getLocalization("invalidPrincipleAccountError",[_19.get("displayedValue")]);m.showTooltip(m.getLocalization("invalidPrincipleAccountError",[_19.get("displayedValue")]),_19.domNode);_19.focus();return false;}}var _1a=dj.byId("fee_act_no");if(_1a&&_1a.get("value")!==""){if(!m.validateFeeAccount()){m._config.onSubmitErrorMsg=m.getLocalization("invalidFeeAccountError",[_1a.get("displayedValue")]);m.showTooltip(m.getLocalization("invalidFeeAccountError",[_1a.get("displayedValue")]),_1a.domNode);_1a.focus();return false;}}},beforeSubmitValidations:function(){var _1b=["exp_date","org_exp_date","pstv_tol_pct","org_pstv_tol_pct","neg_tol_pct","org_neg_tol_pct","ship_from","ship_loading","ship_discharge","ship_to","last_ship_date","narrative_shipment_period","narrative_additional_amount","org_narrative_additional_amount","inc_amt","dec_amt","amd_details","file"];var _1c=d.every(_1b,function(id){if(d.byId(id)){return true;}return false;});if(_1c){var _1d=m.trim(dj.byId("narrative_shipment_period").get("value"));var _1e=m.trim(dj.byId("org_narrative_shipment_period").get("value"));var _1f=m.trim(dj.byId("narrative_additional_amount").get("value"));var _20=m.trim(dj.byId("org_narrative_additional_amount").get("value"));var _21=["pstv_tol_pct","neg_tol_pct","ship_from","ship_loading","ship_discharge","ship_to"];var _22=d.every(_21,function(id){var _23=dj.byId(id).get("value")+"";var _24=dj.byId("org_"+id).get("value")+"";if(_23=="NaN"||_23=="null"||_23=="undefined"){_23="";}if(_23==_24){return true;}return false;});var _25=["exp_date","last_ship_date"];var _26=d.every(_25,function(id){var _27=dj.byId(id).get("value")+"";var _28=d.date.locale.parse(dj.byId("org_"+id).get("displayedValue"),{selector:"date",datePattern:m.getLocalization("g_strGlobalDateFormat")})+"";if(_27==_28){return true;}return false;});var _29=(d.query("#edit [id^='file_row_']").length>1);if(_22&&_26&&!_29&&(_1d==_1e)&&(_1f==_20)&&!dj.byId("inc_amt").get("value")&&!dj.byId("dec_amt").get("value")&&(dj.byId("amd_details").get("value")==="")){m._config.onSubmitErrorMsg=m.getLocalization("noAmendmentError");return false;}}var _2a=dj.byId("amd_date");if(dj.byId("exp_date")&&dj.byId("exp_date").get("value")===null){var _2b=dj.byId("org_exp_date");if(!m.compareDateFields(_2a,_2b)){m._config.onSubmitErrorMsg=m.getLocalization("amdDateGreaterThanOldExpiryDate",[_2a.get("displayedValue"),_2b.get("displayedValue")]);return false;}}var _2c=(dj.byId("last_ship_date")&&dj.byId("last_ship_date").get("value")!==null)?dj.byId("last_ship_date"):dj.byId("org_last_ship_date");if(!m.compareDateFields(_2a,_2c)){m._config.onSubmitErrorMsg=m.getLocalization("amdDateGreaterThanOldShipmentDate",[_2a.get("displayedValue"),_2c.get("displayedValue")]);return false;}var _2d=dj.byId("exp_date");if(_2d&&_2d.get("value")!==null){if(!m.compareDateFields(_2c,_2d)){m._config.onSubmitErrorMsg=m.getLocalization("OldShipmentDateGreaterThanexpDate",[_2c.get("displayedValue"),_2d.get("displayedValue")]);return false;}}var _2e=dj.byId("projected_expiry_date");var _2f=dj.byId("final_expiry_date");if(_2f){if(_2d&&!m.compareDateFields(_2d,_2f)){m._config.onSubmitErrorMsg=m.getLocalization("finalExpDateLessThanTransactionExpDtError",[_2f.get("displayedValue"),_2d.get("displayedValue")]);m.showTooltip(m.getLocalization("finalExpDateLessThanTransactionExpDtError",[_2f.get("displayedValue"),_2d.get("displayedValue")]),_2f.domNode);_2f.focus();return false;}else{if(_2e&&!m.compareDateFields(_2e,_2f)){m._config.onSubmitErrorMsg=m.getLocalization("finalExpDateLessThanProjectedExpDtError",[_2f.get("displayedValue"),_2e.get("displayedValue")]);m.showTooltip(m.getLocalization("finalExpDateLessThanProjectedExpDtError",[_2f.get("displayedValue"),_2e.get("displayedValue")]),_2f.domNode);_2f.focus();return false;}}}var _30=dj.byId("principal_act_no");if(_30&&_30.get("value")!==""){if(!m.validatePricipleAccount()){m._config.onSubmitErrorMsg=m.getLocalization("invalidPrincipleAccountError",[_30.get("displayedValue")]);m.showTooltip(m.getLocalization("invalidPrincipleAccountError",[_30.get("displayedValue")]),_30.domNode);_30.focus();return false;}}var _31=dj.byId("fee_act_no");if(_31&&_31.get("value")!==""){if(!m.validateFeeAccount()){m._config.onSubmitErrorMsg=m.getLocalization("invalidFeeAccountError",[_31.get("displayedValue")]);m.showTooltip(m.getLocalization("invalidFeeAccountError",[_31.get("displayedValue")]),_31.domNode);_31.focus();return false;}}if(dj.byId("pstv_tol_pct")&&dj.byId("org_pstv_tol_pct")&&dijit.byId("max_cr_desc_code").get("value")===""&&dijit.byId("org_pstv_tol_pct").get("value")!==""&&isNaN(dijit.byId("pstv_tol_pct").get("value"))){dj.byId("pstv_tol_pct").set("value",dj.byId("org_pstv_tol_pct").get("value"));}if(dj.byId("neg_tol_pct")&&dj.byId("org_neg_tol_pct")&&dijit.byId("max_cr_desc_code").get("value")===""&&dijit.byId("org_neg_tol_pct").get("value")!==""&&isNaN(dijit.byId("neg_tol_pct").get("value"))){dj.byId("neg_tol_pct").set("value",dj.byId("org_neg_tol_pct").get("value"));}if(dj.byId("ship_to")&&dj.byId("org_ship_to")&&dj.byId("org_ship_to").get("value")!==""&&dijit.byId("ship_to").get("value")===""){dj.byId("ship_to").set("value",dj.byId("org_ship_to").get("value"));}if(dj.byId("ship_from")&&dj.byId("org_ship_from")&&dj.byId("org_ship_from").get("value")!==""&&dijit.byId("ship_from").get("value")===""){dj.byId("ship_from").set("value",dj.byId("org_ship_from").get("value"));}if(dj.byId("ship_discharge")&&dj.byId("org_ship_discharge")&&dj.byId("org_ship_discharge").get("value")!==""&&dijit.byId("ship_discharge").get("value")===""){dj.byId("ship_discharge").set("value",dj.byId("org_ship_discharge").get("value"));}if(dj.byId("ship_loading")&&dj.byId("org_ship_loading")&&dj.byId("org_ship_loading").get("value")!==""&&dijit.byId("ship_loading").get("value")===""){dj.byId("ship_loading").set("value",dj.byId("org_ship_loading").get("value"));}if(dj.byId("last_ship_date")&&dj.byId("org_last_ship_date")&&dj.byId("org_last_ship_date").get("value")!==""&&dijit.byId("last_ship_date").get("value")==null){dj.byId("last_ship_date").set("value",dj.byId("org_last_ship_date").get("value"));}if(dj.byId("narrative_shipment_period")&&dj.byId("org_narrative_shipment_period")&&dj.byId("org_narrative_shipment_period").get("value")!==""&&dijit.byId("narrative_shipment_period").get("value")===""){dj.byId("narrative_shipment_period").set("value",dj.byId("org_narrative_shipment_period").get("value"));}return true;},beforeSubmit:function(){m.updateSubTnxTypeCode("lc");}});})(dojo,dijit,misys);dojo.require("misys.client.binding.trade.amend_si_client");}