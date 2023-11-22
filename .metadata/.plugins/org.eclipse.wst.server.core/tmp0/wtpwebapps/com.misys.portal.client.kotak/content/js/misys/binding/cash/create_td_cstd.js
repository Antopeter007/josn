/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.binding.cash.create_td_cstd"]){dojo._hasResource["misys.binding.cash.create_td_cstd"]=true;dojo.provide("misys.binding.cash.create_td_cstd");dojo.require("dijit.form.Form");dojo.require("dijit.form.Button");dojo.require("dijit.form.TextBox");dojo.require("misys.widget.Dialog");dojo.require("dijit.ProgressBar");dojo.require("dijit.form.ValidationTextBox");dojo.require("dijit.form.CheckBox");dojo.require("dijit.layout.ContentPane");dojo.require("dojo.data.ItemFileReadStore");dojo.require("dijit.form.DateTextBox");dojo.require("misys.form.CurrencyTextBox");dojo.require("dijit.form.NumberTextBox");dojo.require("dijit.form.FilteringSelect");dojo.require("misys.form.file");dojo.require("misys.form.SimpleTextarea");dojo.require("misys.form.common");dojo.require("misys.widget.Collaboration");dojo.require("misys.validation.common");dojo.require("misys.binding.cash.ft_common");dojo.require("misys.form.BusinessDateTextBox");dojo.require("dojox.xml.DomParser");dojo.require("misys.binding.common.create_fx_multibank");(function(d,dj,m){var _1=d.byId("fx-message-type");var _2=false;var _3=true;function _4(_5,_6){if(dj.byId(_5)){dj.byId(_5).set("value",_6);}};function _7(){if(dj.byId("display_interest")){dj.byId("interest").set("value","");dj.byId("display_interest").set("value","");if(dj.byId("contract_amt")){dj.byId("contract_amt").set("value","");}if(dj.byId("fx_total_utilise_amt")){dj.byId("fx_total_utilise_amt").set("value","");}}};function _8(){var _9=false;var _a=dijit.byId("sub_product_code")?dijit.byId("sub_product_code").get("value"):"";var _b=dijit.byId("mode")?dijit.byId("mode").get("value"):"";if(_b==="DRAFT"){_9=m.validateHolidaysAndCutOffTime("issuing_bank_abbv_name","sub_product_code",_b,["value Date"],["value_date"],"entity","td_cur_code","td_amt");}else{if(_b==="UNSIGNED"){_9=m.validateHolidaysAndCutOffTime("issuing_bank_abbv_name","sub_product_code_unsigned",_b,["value Date"],["value_date_unsigned"],"display_entity_unsigned","td_cur_code_unsigned","td_amt_unsigned");}else{m._config.onSubmitErrorMsg=m.getLocalization("technicalErrorWhileValidatingBusinessDays");_9=false;}}if(_9){m._config.holidayCutOffEnabled=false;}return _9;};function _c(_d){if(("S"+_d!=="S")&&_d.length>7){var _e="",_f="",_10="";_e=_d.substring(0,2);_f=_d.substring(2,4);_10=_d.substring(4);return _e+"/"+_f+"/"+_10;}else{return _d;}};function _11(_12){var _13=function(){var _14=dijit.byId("td_amt");_14.set("state","Error");m.defaultBindTheFXTypes();dj.byId("td_amt").set("value","");if(dj.byId("td_cur_code")&&!dj.byId("td_cur_code").get("readOnly")){dj.byId("td_cur_code").set("value","");}};m.dialog.show("ERROR",_12,"",function(){setTimeout(_13,500);});if(d.byId("fx-section")&&(d.style(d.byId("fx-section"),"display")!=="none")){m.animate("wipeOut",d.byId("fx-section"));}};function _15(_16){var _17=[],_18=[],_19=[],_1a="";if(dj.byId("tenor_term_code")){_1a=dj.byId("tenor_term_code");_1a.store=null;if(misys._config.depositTypes){_19=misys._config.depositTypes[_16].tenor;dojo.forEach(_19,function(_1b,_1c){_17[_1c]=misys._config.depositTypes[_16].tenor[_1b].key;_18[_1c]=misys._config.depositTypes[_16].tenor[_1b].value;});jsonData={"identifier":"id","items":[]};productStore=new dojo.data.ItemFileWriteStore({data:jsonData});for(var j=0;j<_17.length;j++){productStore.newItem({"id":_17[j],"name":_18[j]});}_1a.store=productStore;}_1a.set("value","");}};function _1d(){m.animate("wipeIn",d.byId("fx-section"));};function _1e(){if(!isNaN(dj.byId("td_amt").get("value"))&&dj.byId("td_cur_code").get("value")!==""){m.fireFXAction();}else{if(d.byId("fx-section")&&(d.style(d.byId("fx-section"),"display")!=="none")){m.animate("wipeOut",d.byId("fx-section"));}m.defaultBindTheFXTypes();}};function _1f(_20,_21){var _22=[],_23=[],_24=[],_25="",_26,_27=false;if(dj.byId("td_cur_code")){_25=dj.byId("td_cur_code");_25.store=null;if(dj.byId("td_cur_code")){_26=dj.byId("td_cur_code").get("value");}if(misys._config.depositTypes&&misys._config.depositTypes[_20]&&misys._config.depositTypes[_20].tenor[_21]){_24=misys._config.depositTypes[_20].tenor[_21].currency;_24.sort();dojo.forEach(_24,function(_28,_29){_22[_29]=_28;_23[_29]=_28;if(_26===_28){_27=true;}});jsonData={"identifier":"id","items":[]};productStore=new dojo.data.ItemFileWriteStore({data:jsonData});for(var j=0;j<_22.length;j++){productStore.newItem({"id":_22[j],"name":_23[j]});}_25.store=productStore;}if(!_27&&dj.byId("td_cur_code")){dj.byId("td_cur_code").set("value","");}}};function _2a(_2b){var _2c=[],_2d=[],_2e="";if(dj.byId("maturity_instruction")){_2e=dj.byId("maturity_instruction");_2e.store=null;var _2f=misys._config.maturityCodes[_2b];var _30=misys._config.maturityCodesDescription[_2b];for(var i=0;i<_2f.length;i++){_2c[i]=_2f[i];}for(var k=0;k<_30.length;k++){_2d[k]=_30[k];}jsonData={"identifier":"id","label":"name","items":[]};productStore=new dojo.data.ItemFileWriteStore({data:jsonData});for(var j=0;j<_2c.length;j++){productStore.newItem({"id":_2c[j],"name":_2d[j]});}_2e.store=productStore;_2e.set("value","");}};function _31(_32){var _33=[],_34=[],_35="";if(dj.byId("maturity_mandatory")){_35=dj.byId("maturity_mandatory");_35.store=null;var _36=misys._config.maturityCodes[_32];var _37=misys._config.maturityMandatoryFlag[_32];for(var i=0;(_36&&i<_36.length);i++){_33[i]=_36[i];}for(var k=0;(_37&&k<_37.length);k++){_34[k]=_37[k];}jsonData={"identifier":"id","label":"name","items":[]};productStore1=new dojo.data.ItemFileWriteStore({data:jsonData});for(var j=0;(_33&&j<_33.length);j++){productStore1.newItem({"id":_33[j],"name":_34[j]});}_35.store=productStore1;_35.set("value","");}};function _38(){if(dj.byId("fx_rates_type_2")&&dj.byId("fx_rates_type_2").get("checked")){m.animate("wipeIn",d.byId("equivalent-contract-amt"));}else{m.animate("wipeOut",d.byId("equivalent-contract-amt"));if(dj.byId("contract_amt")){dj.byId("contract_amt").set("value","");}d.forEach(d.query(".amtUtiliseDiv"),function(_39){d.style(_39,"display","none");});}};function _3a(){if(dj.byId("service_enabled")&&dj.byId("service_enabled").get("value")==="Y"){if((dj.byId("tenor_term_code")&&dj.byId("tenor_term_code").get("value")!=="")&&(dj.byId("td_cur_code")&&dj.byId("td_cur_code").get("value")!=="")&&(dj.byId("td_amt")&&!isNaN(dj.byId("td_amt").get("value")))&&(dj.byId("maturity_instruction")&&dj.byId("maturity_instruction").get("value")!=="")&&(dj.byId("applicant_act_name")&&dj.byId("applicant_act_name").get("value")!=="")&&(dj.byId("credit_act_name")&&dj.byId("credit_act_name").get("value")!=="")){d.style("interestLink","display","inline");_38();}else{d.style("interestLink","display","none");_38();}}};function _3b(){var _3c=dj.byId("tenor_term_code").getValue(),_3d=dj.byId("td_cur_code").getValue(),_3e=dj.byId("td_amt").getValue(),_3f=dj.byId("ref_id").getValue(),_40=dj.byId("placement_act_no").getValue(),_41="TD",_42="",_43="",_44=dj.byId("applicant_act_no").getValue(),_45=dj.byId("applicant_act_cur_code").getValue(),_46=dj.byId("maturity_instruction").getValue(),_47=dj.byId("credit_act_no").getValue(),_48=dj.byId("credit_act_cur_code").getValue(),_49=dj.byId("tnx_id").getValue(),_4a=dj.byId("entity")?dj.byId("entity").get("value"):"",_4b=dj.byId("applicant_reference").getValue(),_4c=dj.byId("td_type").getValue(),_4d="",_4e="",_4f="",_50="",_51="",_52="",_53="";if(dj.byId("fx_rates_type_1")&&dj.byId("fx_rates_type_1").get("checked")){_4d=dj.byId("fx_rates_type_1").get("value");}else{if(dj.byId("fx_rates_type_2")&&dj.byId("fx_rates_type_2").get("checked")){_4d=dj.byId("fx_rates_type_2").get("value");}}if(_4d&&_4d!==""&&_4d==="01"&&dj.byId("fx_exchange_rate")){_4e=dj.byId("fx_exchange_rate").getValue();_4f=dj.byId("fx_exchange_rate_cur_code").getValue();_50=dj.byId("fx_exchange_rate_amt").getValue();}else{if(_4d&&_4d!==""&&_4d==="02"){_51=dj.byId("fx_contract_nbr_1").getValue();if(dj.byId("fx_contract_nbr_cur_code_1")){_52=dj.byId("fx_contract_nbr_cur_code_1").getValue();}else{_52=dj.byId("td_cur_code").getValue();}if(dj.byId("fx_contract_nbr_amt_1")){_53=dj.byId("fx_contract_nbr_amt_1").getValue();}else{_53=dj.byId("td_amt").getValue();}}}_7();if(isNaN(_50)){_50="";}m.xhrPost({url:misys.getServletURL("/screen/AjaxScreen/action/TDInterestRateInquiryDetails"),handleAs:"json",sync:true,content:{tenor:_3c,placementAmtCur:_3d,placementAmt:_3e,refId:_3f,placementAcct:_40,productCode:_41,renewal:_42,debitAcctNbr:_44,debitAcctCur:_45,maturityInstruction:_46,creditAcctNbr:_47,creditAcctCur:_48,tnxId:_49,entity:_4a,fxRatesType:_4d,fxExchangeRate:_4e,fxExchangeRateCur:_4f,fxExchangeRateAmt:_50,fxContractNbr1:_51,fxContractNbrCur1:_52,fxContractNbrAmt1:_53,applicantReference:_4b,tdType:_4c},load:function(_54,_55){var _56=dj.byId("display_interest"),_57=dj.byId("td_amt");switch(_54.StatusCode){case "0000000":_4("DueWtdrwDt",_54.DueWtdrwDt);_4("bank_value_date",_c(_54.bank_value_date));_4("HoldCode",_54.HoldCode);_4("display_interest",_54.display_interest);_4("interest",_54.interest);_4("PledgeBranchCode",_54.PledgeBranchCode);_4("FundValDate",_54.FundValDate);_4("ReplCost",_54.ReplCost);_4("SibidSibor",_54.SibidSibor);_4("WaiveIndicator",_54.WaiveIndicator);_4("TranchNum",_54.TranchNum);_4("MinAmt",_54.MinAmt);_4("SgdDepAmt",_54.SgdDepAmt);_4("SgdXchgRate",_54.SgdXchgRate);_4("ConvertedAmt",_54.ConvertedAmt);_4("CtrRate",_54.CtrRate);_4("contract_amt",_54.contract_amt);_4("FcfdAmt",_54.FcfdAmt);_4("interestToken",_54.Interest_Token);break;case "0002001":_57.focus();_57.set("value","");_57.set("state","Error");dj.hideTooltip(_57.domNode);dj.showTooltip(_54.ErrorDesc,_57.domNode,0);break;case "TECHNICAL_ERROR":var _58=misys.getLocalization("technicalErrorWhileInterestRateFetch");_56.focus();_56.set("value","");_56.set("state","Error");dj.hideTooltip(_56.domNode);dj.showTooltip(_58,_56.domNode,0);break;default:_56.focus();_56.set("value","");_56.set("state","Error");dj.hideTooltip(_56.domNode);dj.showTooltip(_54.ErrorDesc,_56.domNode,0);break;}},error:function(_59,_5a){console.error("[] ");console.error(_59);}});};function _5b(_5c){var _5d=_5c?true:false;var _5e=dj.byId("entity");var _5f=dj.byId("entity")?dj.byId("entity").get("value"):"";var _60=dj.byId("customer_bank");if(_5f&&_60){var _61=null;if(_5f!==""){_61=m._config.entityBanksCollection[_5f];}_60.set("disabled",false);_60.set("required",true);if(!_5d){_60.set("value","");}if(_61){_60.store=new dojo.data.ItemFileReadStore({data:{identifier:"value",label:"name",items:_61}});_60.fetchProperties={sort:[{attribute:"name"}]};}else{_60.store=new dojo.data.ItemFileReadStore({data:{identifier:"value",label:"name",items:[{value:"*",name:"*"}]}});_60.set("value","*");}}else{if(_60&&_60.get("value")===""){var _62=null;_62=m._config.wildcardLinkedBanksCollection["customerBanksForWithoutEntity"];if(_62){_60.store=new dojo.data.ItemFileReadStore({data:{identifier:"value",label:"name",items:_62}});_60.fetchProperties={sort:[{attribute:"name"}]};}}else{if(_60){_60.set("disabled",true);_60.set("required",false);_60.set("value","");}}}};function _63(){var _64=null;var _65=dj.byId("customer_bank").get("value");if(misys&&misys._config&&misys._config.businessDateForBank&&misys._config.businessDateForBank[_65]&&misys._config.businessDateForBank[_65][0]&&misys._config.businessDateForBank[_65][0].value!==""){var _66=misys._config.businessDateForBank[_65][0].value;var _67=_66.substring(0,4);var _68=_66.substring(5,7);var _69=_66.substring(8,10);_66=_69+"/"+_68+"/"+_67;var _6a=new Date(_67,_68-1,_69);if(misys&&misys._config&&misys._config.option_for_app_date==="SCRATCH"){dj.byId("appl_date").set("value",_66);document.getElementById("appl_date_view_row").childNodes[1].innerHTML=_66;if(dj.byId("appl_date_hidden")){dj.byId("appl_date_hidden").set("value",_6a);}}if(dj.byId("todays_date")){dj.byId("todays_date").set("value",_6a);}}if(!_2&&!_3){dj.byId("applicant_act_name").set("value","");dj.byId("credit_act_name").set("value","");dj.byId("td_type").set("value","");dj.byId("tenor_term_code").set("value","");dj.byId("maturity_instruction").set("value","");dj.byId("td_cur_code").set("value","");dj.byId("td_amt").set("value","");dj.byId("value_date").set("value",null);dj.byId("issuing_bank_abbv_name").set("value",_65);_64=misys._config.customerBankDetails[_65][0].value;dj.byId("issuing_bank_name").set("value",_64);}if(!_2){dj.byId("issuing_bank_abbv_name").set("value",_65);_64=misys._config.customerBankDetails[_65][0].value;dj.byId("issuing_bank_name").set("value",_64);}_2=false;if(dj.byId("customer_bank")&&_65!==""){_3=false;if(dj.byId("issuing_bank_abbv_name").get("value")!==""){_64=misys._config.customerBankDetails[_65][0].value;dj.byId("issuing_bank_name").set("value",_64);}}if(dj.byId("issuing_bank_abbv_name")&&dj.byId("issuing_bank_abbv_name").get("value")!==""){m.initializeFX(m._config.subProductCode,dj.byId("issuing_bank_abbv_name").get("value"));if(dj.byId("applicant_act_cur_code")&&dj.byId("applicant_act_cur_code").get("value")!==""&&dj.byId("selected_td_cur")&&dj.byId("selected_td_cur").get("value")!==""&&dj.byId("applicant_act_cur_code").get("value")!==dj.byId("selected_td_cur").get("value")&&!isNaN(dj.byId("td_amt").get("value"))){m.onloadFXActions();}else{m.defaultBindTheFXTypes();}_6b();}};function _6b(){if(m._config.fxParamData&&dj.byId("issuing_bank_abbv_name")&&dj.byId("issuing_bank_abbv_name").get("value")!==""&&m._config.fxParamData[m._config.subProductCode][dj.byId("issuing_bank_abbv_name").get("value")].isFXEnabled==="Y"){m.connect("td_cur_code","onChange",function(){m.setCurrency(this,["td_amt"]);if(dj.byId("td_cur_code").get("value")!==""&&!isNaN(dj.byId("td_amt").get("value"))){if(dj.byId("selected_td_cur")&&dj.byId("selected_td_cur").get("value")!==dj.byId("td_cur_code").get("value")){m.fireFXAction();dj.byId("selected_td_cur").set("value","");}}else{if(d.byId("fx-section")&&(d.style(d.byId("fx-section"),"display")!=="none")){m.animate("wipeOut",d.byId("fx-section"));}m.defaultBindTheFXTypes();}});m.connect("td_amt","onBlur",function(){m.setTnxAmt(this.get("value"));_1e();});m.connect("fx_rates_type_2","onChange",function(){if(dj.byId("fx_rates_type_2").get("checked")){m.animate("wipeIn",d.byId("equivalent-contract-amt"));if(dj.byId("contract_cur_code")){dj.byId("contract_cur_code").set("value",dj.byId("applicant_act_cur_code").get("value"));}}else{m.animate("wipeOut",d.byId("equivalent-contract-amt"));if(dj.byId("contract_cur_code")){dj.byId("contract_cur_code").set("value","");}dj.byId("fx_contract_nbr_1").reset();}if(dj.byId("interest")){dj.byId("interest").reset();}if(dj.byId("display_interest")){dj.byId("display_interest").reset();}if(dj.byId("contract_amt")){dj.byId("contract_amt").reset();}if(dj.byId("fx_total_utilise_amt")&&dj.byId("fx_total_utilise_amt").get("value")===""){dj.byId("fx_total_utilise_amt").reset();}});m.connect("contract_amt","onChange",function(){if(dj.byId("contract_cur_code")){dj.byId("contract_cur_code").set("value",dj.byId("applicant_act_cur_code").get("value"));}});m.setCurrency(dj.byId("applicant_act_cur_code"),["contract_amt"]);m.connect("contract_amt","onChange",function(){if(dj.byId("fx_total_utilise_cur_code")){dj.byId("fx_total_utilise_cur_code").set("value",dj.byId("contract_cur_code").get("value"));}if(dj.byId("fx_total_utilise_amt")){dj.byId("fx_total_utilise_amt").set("value",dj.byId("contract_amt").get("value"));}});}};function _6c(){var _6d=dj.byId("applicant_act_cur_code").get("value");var _6e=dj.byId("credit_act_cur_code").get("value");if(_6d!=""&&_6e!=""&&_6d!==_6e){m.dialog.show("ERROR",m.getLocalization("crossCurrency"));dj.byId("credit_act_name").set("value","");dj.byId("credit_act_cur_code").set("value","");dj.byId("credit_act_no").set("value","");dj.byId("credit_act_description").set("value","");dj.byId("td_amt").set("value","");return false;}return true;};d.mixin(m,{getInterestDetails:function(){if(dj.byId("service_enabled")&&dj.byId("service_enabled").get("value")==="Y"){_3b();}},fireFXAction:function(){if(m._config.fxParamData&&m._config.fxParamData[m._config.subProductCode][dj.byId("issuing_bank_abbv_name").get("value")].isFXEnabled==="Y"){var _6f,_70;var _71=dj.byId("td_cur_code").get("value");var _72=dj.byId("td_amt").get("value");var _73=dj.byId("applicant_act_cur_code").get("value");var _74=m._config.productCode;var _75="";if(dj.byId("issuing_bank_abbv_name")&&dj.byId("issuing_bank_abbv_name").get("value")!==""){_75=dj.byId("issuing_bank_abbv_name").get("value");}var _76=dj.byId("applicant_act_cur_code").get("value");var _77=false;if(_71!==""&&!isNaN(_72)&&_74!==""&&_75!==""){if(_71!==_73){_6f=_73;_70=_71;_76=_73;}if(_6f&&_6f!==""&&_70&&_70!==""&&_6f!==_70){if(d.byId("fx-section")&&(d.style(d.byId("fx-section"),"display")==="none")){_1d();}m.fetchFXDetails(_6f,_70,_72,_74,_75,_76,_77);if(dj.byId("fx_rates_type_1")&&dj.byId("fx_rates_type_1").get("checked")&&(isNaN(dj.byId("fx_exchange_rate").get("value"))||dj.byId("fx_exchange_rate_cur_code").get("value")===""||isNaN(dj.byId("fx_exchange_rate_amt").get("value"))||(m._config.fxParamData[m._config.subProductCode][dj.byId("issuing_bank_abbv_name").get("value")].toleranceDispInd==="Y"&&(isNaN(dj.byId("fx_tolerance_rate").get("value"))||isNaN(dj.byId("fx_tolerance_rate_amt").get("value"))||dj.byId("fx_tolerance_rate_cur_code").get("value")==="")))){_11(m.getLocalization("FXDefaultErrorMessage"));}}else{if(d.byId("fx-section")&&(d.style(d.byId("fx-section"),"display")!=="none")){m.animate("wipeOut",d.byId("fx-section"));}m.defaultBindTheFXTypes();}}}},bind:function(){m.connect("value_date","onClick",function(){m.clearDateCache();if(misys._config.isMultiBank){var _78;if(dijit.byId("customer_bank")){_78=dijit.byId("customer_bank").get("value");}if(_78!==""&&misys&&misys._config&&misys._config.businessDateForBank&&misys._config.businessDateForBank[_78][0]&&misys._config.businessDateForBank[_78][0].value!==""){var _79=parseInt(misys._config.businessDateForBank[_78][0].value.substring(0,4),10);var _7a=parseInt(misys._config.businessDateForBank[_78][0].value.substring(5,7),10);var _7b=parseInt(misys._config.businessDateForBank[_78][0].value.substring(8,10),10);this.dropDown.currentFocus=new Date(_79,_7a-1,_7b);}}});m.connect("applicant_act_name","onChange",m.checkNickNameDiv);m.setValidation("value_date",m.validateValueApplicationDate);if(dj.byId("tnxId")&&dj.byId("tnxId").getValue()==="01"){m.connect("tenor_term_code","onChange",function(){_7();_3a();});m.connect("td_cur_code","onChange",function(){m.setCurrency(this,["td_amt"]);_7();_3a();});m.connect("td_amt","onBlur",function(){m.setTnxAmt(this.get("value"));_7();_3a();});m.connect("credit_act_name","onChange",function(){_7();_3a();var _7c=dj.byId("currency_res").get("value");if(_7c==="true"){_6c();}});m.connect("maturity_instruction","onChange",function(){_7();_3a();});m.connect("applicant_act_name","onChange",function(){_7();_3a();if(dj.byId("applicant_act_name").get("value")&&dj.byId("applicant_act_name").get("value")!==""&&dj.byId("maturity_instruction")&&(dj.byId("maturity_instruction").get("value")==="D"||dj.byId("maturity_instruction").get("value")==="X")&&dj.byId("credit_act_name")){dj.byId("credit_act_name").set("value",dj.byId("applicant_act_name").get("value"));dj.byId("credit_img").set("disabled",true);}if(dj.byId("customer_bank")&&dj.byId("applicant_act_name")&&dj.byId("applicant_act_name").get("value")!==""){dj.byId("customer_bank").set("value",m._config.customerBankName);}if(m._config.fxParamData&&dj.byId("issuing_bank_abbv_name")&&dj.byId("issuing_bank_abbv_name").get("value")!==""&&m._config.fxParamData[m._config.subProductCode][dj.byId("issuing_bank_abbv_name").get("value")].isFXEnabled==="Y"){_1e();}dj.byId("td_type").set("value","");dj.byId("tenor_term_code").set("value","");dj.byId("maturity_instruction").set("value","");dj.byId("td_cur_code").set("value","");dj.byId("td_amt").set("value","");dj.byId("credit_act_no").set("value","");dj.byId("credit_act_name").set("value","");dj.byId("credit_act_cur_code").set("value","");dj.byId("credit_act_description").set("value","");dj.byId("credit_act_pab").set("value","");});}m.connect("entity","onClick",m.validateRequiredField);m.connect("applicant_act_name","onClick",m.validateRequiredField);m.connect("credit_act_name","onClick",m.validateRequiredField);m.connect("entity","onChange",function(){if(dj.byId("tnx_type_code")){if(dj.byId("tnx_type_code").get("value")==="01"){dj.byId("applicant_act_no").set("value","");dj.byId("applicant_act_name").set("value","");dj.byId("applicant_act_cur_code").set("value","");dj.byId("applicant_act_description").set("value","");dj.byId("applicant_act_pab").set("value","");dj.byId("placement_act_no").set("value","");dj.byId("placement_act_name").set("value","");dj.byId("placement_act_cur_code").set("value","");dj.byId("placement_act_description").set("value","");dj.byId("placement_act_pab").set("value","");}dj.byId("credit_act_no").set("value","");dj.byId("credit_act_name").set("value","");dj.byId("credit_act_cur_code").set("value","");dj.byId("credit_act_description").set("value","");dj.byId("credit_act_pab").set("value","");}dj.byId("td_type").set("value","");dj.byId("tenor_term_code").set("value","");dj.byId("maturity_instruction").set("value","");dj.byId("td_cur_code").set("value","");dj.byId("td_amt").set("value","");_3=true;if(misys._config.isMultiBank&&dj.byId("customer_bank")){dj.byId("customer_bank").set("value","");_5b();}});m.connect("customer_bank","onChange",_63);if(dj.byId("td_type")){m.connect("td_type","onChange",function(){var _7d=d.byId("placment-div");if(dj.byId("td_type")&&dj.byId("td_type").get("value")!==""){var _7e=dijit.byId("td_type").get("value");_15(_7e);_2a(_7e);_31(_7e);if(dj.byId("placement_act_name")){if(dj.byId("placement_account_enabled")&&dj.byId("placement_account_enabled").get("value")==="Y"){m.animate("fadeIn",_7d,function(){});}else{m.animate("fadeOut",_7d,function(){});}}}else{if(dj.byId("placement_act_name")){dj.byId("placement_act_name").set("value","");if(dj.byId("placement_account_enabled")&&dj.byId("placement_account_enabled").get("value")==="Y"){m.animate("fadeIn",_7d,function(){});}else{m.animate("fadeOut",_7d,function(){});}}}});}else{if(dj.byId("selected_td_type")&&dj.byId("selected_td_type").get("value")!==""){var _7f=dj.byId("selected_td_type").get("value");_2a(_7f);_31(_7f);}}if(dj.byId("selected_td_type")&&dj.byId("selected_td_type").get("value")===""&&dj.byId("tenor_term_code")===undefined){dj.byId("selected_td_type").set("value","*");var _80=dj.byId("selected_td_type").get("value");_2a(_80);_31(_80);}if(dj.byId("tenor_term_code")){m.connect("tenor_term_code","onChange",function(){if(dj.byId("td_type")&&dj.byId("td_type").get("value")!==""&&dj.byId("tenor_term_code")&&dj.byId("tenor_term_code").get("value")!==""){_1f(dj.byId("td_type").get("value"),dijit.byId("tenor_term_code"));}});}m.connect("maturity_instruction","onChange",function(){var _81=dj.byId("maturity_instruction").get("value");if(dj.byId("maturity_mandatory")&&dj.byId("maturity_mandatory").store){for(var i=0;i<dj.byId("maturity_mandatory").store._arrayOfAllItems.length;i++){if(dj.byId("maturity_mandatory").store._arrayOfAllItems[i].id[0]===_81){if(dj.byId("maturity_mandatory").store._arrayOfAllItems[i].name[0]==="Y"&&dj.byId("credit_act_name")){if((!m._config.preSelectedAccExist)&&dj.byId("tnx_type_code")&&dj.byId("tnx_type_code").get("value")!=="03"){dj.byId("credit_act_name").set("value",dj.byId("applicant_act_name").get("value"));dj.byId("credit_act_no").set("value",dj.byId("applicant_act_no").get("value"));dj.byId("credit_act_cur_code").set("value",dj.byId("applicant_act_cur_code").get("value"));}dj.byId("credit_img").set("disabled",false);m.toggleRequired("credit_act_name",true);m._config.preSelectedAccExist=false;return;}else{if(dj.byId("credit_act_name")){m.toggleRequired("credit_act_name",false);if((!m._config.preSelectedAccExist)&&dj.byId("credit_act_name").get("value")===dj.byId("applicant_act_name").get("value")){dj.byId("credit_act_name").set("value","");}dj.byId("credit_img").set("disabled",false);m._config.preSelectedAccExist=false;return;}}}}}});},onFormLoad:function(){var _82=[],_83=[],_84=true,_85="",_86="",_87="",_88="",_89=-1,_8a="",_8b="",_8c="";if(misys._config.isMultiBank){_5b(true);var _8d=dj.byId("customer_bank");var _8e=dj.byId("customer_bank_hidden");var _8f=dj.byId("entity");if(_8d&&_8e){_8d.set("value",_8e.get("value"));}if(dj.byId("issuing_bank_abbv_name")&&dj.byId("issuing_bank_abbv_name").get("value")!==""){_2=true;_3=true;_8d.set("value",dj.byId("issuing_bank_abbv_name").get("value"));_8e.set("value",dj.byId("issuing_bank_abbv_name").get("value"));}if(_8f&&_8f.get("value")===""&&_8d){_8d.set("disabled",true);_8d.set("required",false);}}else{if(dj.byId("issuing_bank_abbv_name")&&dj.byId("issuing_bank_abbv_name").get("value")!==""){m.initializeFX(m._config.subProductCode,dj.byId("issuing_bank_abbv_name").get("value"));if(dj.byId("applicant_act_cur_code")&&dj.byId("applicant_act_cur_code").get("value")!==""&&dj.byId("selected_td_cur")&&dj.byId("selected_td_cur").get("value")!==""&&dj.byId("applicant_act_cur_code").get("value")!==dj.byId("selected_td_cur").get("value")&&!isNaN(dj.byId("td_amt").get("value"))){m.onloadFXActions();}else{m.defaultBindTheFXTypes();}_6b();}}if(dj.byId("tnxId")&&dj.byId("tnxId").getValue()==="01"){_8c=dj.byId("issuing_bank_abbv_name");if(_8c){_8c.onChange();}_8b=dj.byId("issuing_bank_customer_reference");if(_8b){_8b.onChange();}_3a();m.setCurrency(dj.byId("td_cur_code"),["td_amt"]);}if(dj.byId("td_type")){_85=dj.byId("td_type");_85.store=null;m.setCurrency(dj.byId("td_cur_code"),["td_amt"]);dojo.forEach(misys._config.depositTypes,function(_90,_91){var _92=_90.split(",");_82[_91]=_92[0];_83[_91]=_92[1];});if(dj.byId("td_type")){jsonData={"identifier":"id","label":"name","items":[]};productStore=new dojo.data.ItemFileWriteStore({data:jsonData});for(var j=0;j<_82.length;j++){productStore.newItem({"id":_82[j],"name":_83[j]});}_85.store=productStore;if(dj.byId("selected_td_type")&&!("S"+dj.byId("selected_td_type").get("value")==="S")){_86=dj.byId("selected_td_type").get("value");dj.byId("td_type").set("value",_86);if((dj.byId("selected_tenor_type")&&!("S"+dj.byId("selected_tenor_type").get("value")==="S"))){tempTenorType=dj.byId("selected_tenor_type").get("value");_15(_86);_8a=function(){dj.byId("tenor_term_code").set("value",tempTenorType);};_89=1000;setTimeout(_8a,_89);}if((dj.byId("selected_td_cur")&&!("S"+dj.byId("selected_td_cur").get("value")==="S"))){_88=dj.byId("selected_td_cur").get("value");_86=dj.byId("selected_td_type").get("value");tempTenorType=dj.byId("selected_tenor_type").get("value");_1f(_86,tempTenorType);dj.byId("td_cur_code").set("value",_88);}if((dj.byId("selected_maturity_type")&&!("S"+dj.byId("selected_maturity_type").get("value")==="S"))){_87=dj.byId("selected_maturity_type").get("value");if(dj.byId("maturity_instruction")){_2a(_86);_31(_86);_8a=function(){dj.byId("maturity_instruction").set("value",_87);};_89=1000;setTimeout(_8a,_89);}}}else{_85.set("displayedValue","");}}}else{if(dj.byId("selected_td_type")&&dj.byId("maturity_instruction")&&(dj.byId("selected_maturity_type").get("value")!==""||dj.byId("selected_td_type").get("value")!=="")){_87=dj.byId("selected_maturity_type").get("value");if(!_87||_87===""){_87=dj.byId("selected_td_type").get("value");}if(dj.byId("maturity_instruction")){_8a=function(){dj.byId("maturity_instruction").set("value",_87);};_89=1000;setTimeout(_8a,_89);}}}if(dj.byId("placement_act_name")){var _93=d.byId("placment-div");if((dj.byId("td_type")&&dj.byId("td_type").getValue()!=="")&&(dj.byId("placement_account_enabled")&&dj.byId("placement_account_enabled").get("value")==="Y")){m.animate("fadeIn",_93,function(){});}else{m.animate("fadeOut",_93,function(){});}}if(m._config.fxParamData&&dj.byId("issuing_bank_abbv_name")&&dj.byId("issuing_bank_abbv_name").get("value")!==""){m.initializeFX(m._config.subProductCode,dj.byId("issuing_bank_abbv_name").get("value"));if(dj.byId("applicant_act_cur_code")&&dj.byId("applicant_act_cur_code").get("value")!==""&&dj.byId("selected_td_cur")&&dj.byId("selected_td_cur").get("value")!==""&&dj.byId("applicant_act_cur_code").get("value")!==dj.byId("selected_td_cur").get("value")&&!isNaN(dj.byId("td_amt").get("value"))){m.onloadFXActions();}else{m.defaultBindTheFXTypes();}}else{m.animate("fadeOut",_1);}if(d.byId("fx-section")){if((dj.byId("fx_exchange_rate_cur_code")&&dj.byId("fx_exchange_rate_cur_code").get("value")!=="")||(dj.byId("fx_total_utilise_cur_code")&&dj.byId("fx_total_utilise_cur_code").get("value")!=="")){_1d();if((dj.byId("fx_rates_type"))&&(dj.byId("fx_rates_type").get("value")==="02")){_38();}}else{d.style("fx-section","display","none");}}if(d.byId("totalUtiliseDiv")){m.animate("wipeOut",d.byId("totalUtiliseDiv"));}m._config.preSelectedAccExist=(dj.byId("credit_act_name")&&dj.byId("credit_act_name").get("value")!=="")?true:false;},beforeSaveValidations:function(){var _94=dj.byId("entity");if(_94&&_94.get("value")===""){return false;}else{return true;}},beforeSubmitValidations:function(){if(dj.byId("fx_rates_type_2")&&dj.byId("fx_rates_type_2").get("checked")&&dj.byId("fx_contract_nbr_1")&&dj.byId("fx_contract_nbr_1").get("value")===""){dj.byId("fx_contract_nbr_1").focus();return false;}if(dj.byId("applicant_act_name")&&dj.byId("applicant_act_name").get("value")===""){m._config.onSubmitErrorMsg=m.getLocalization("debitAccountTDMessage");dj.byId("applicant_act_name").focus();dj.byId("applicant_act_name").set("state","Error");return false;}if(dj.byId("td_amt")&&!m.validateAmount((dj.byId("td_amt"))?dj.byId("td_amt"):0)){m._config.onSubmitErrorMsg=m.getLocalization("amountcannotzero");dj.byId("td_amt").set("value","");return false;}var _95=dj.byId("tnx_type_code").get("value");if(!(_95=="13"||_95=="03")){return _8();}return true;}});m._config=m._config||{};d.mixin(m._config,{preSelectedAccExist:false,xmlTransform:function(xml){var _96=m._config.xmlTagName,_97=_96?["<",_96,">"]:[],_98="<td_tnx_record>",_99="</td_tnx_record>",_9a="",_9b="",_9c=-1,_9d=[],_9e=[],_9f="",_a0="",_a1="",_a2=-1,_a3="",_a4=[];if(xml.indexOf(_98)!==-1){_9b=xml.substring(_98.length,(xml.length-_99.length));_97.push(_9b);if(dj.byId("maturity_instruction")&&dj.byId("maturity_instruction").get("value")!==""&&dj.byId("td_type")&&!("S"+dj.byId("td_type").get("value")==="S")){_9a=dj.byId("maturity_instruction").get("value");_9f=dijit.byId("td_type").get("value");_9d=misys._config.maturityCodes[_9f];_9e=misys._config.maturityCodesDescription[_9f];for(var i=0;i<_9d.length;i++){if(_9a===_9d[i]){_9c=i;break;}}_97.push("<maturity_instruction>",_9a,"</maturity_instruction>");_a0=_9e[_9c];_97.push("<maturity_instruction_name>",_a0,"</maturity_instruction_name>");}else{if(dj.byId("maturity_instruction")&&dj.byId("maturity_instruction").get("value")!==""&&!dj.byId("td_type")){_9a=dj.byId("maturity_instruction").get("value");if(dj.byId("selected_td_type")){_9f=dj.byId("selected_td_type").get("value");_9d=misys._config.maturityCodes[_9f];_9e=misys._config.maturityCodesDescription[_9f];for(var j=0;j<_9d.length;j++){if(_9a===_9d[j]){_9c=j;break;}}_97.push("<maturity_instruction>",_9a,"</maturity_instruction>");_a0=_9e[_9c];_97.push("<maturity_instruction_name>",_a0,"</maturity_instruction_name>");if(dj.byId("tnx_type_code")&&dj.byId("tnx_type_code").get("value")==="03"){_97.push("<td_type>",_9f,"</td_type>");}}}}if(dj.byId("tenor_term_code")&&dj.byId("tenor_term_code").get("value")!==""&&dj.byId("td_type")&&!("S"+dj.byId("td_type").get("value")==="S")){_a1=dj.byId("tenor_term_code").get("value");_a4=_a1.split("_");_a2=_a4[0];_a3=_a4[1];_97.push("<value_date_term_number>",_a2,"</value_date_term_number>");_a0=_9e[_9c];_97.push("<value_date_term_code>",_a3,"</value_date_term_code>");}if(_96){_97.push("</",_96,">");}return _97.join("");}else{return xml;}}});d.mixin(m._config,{initReAuthParams:function(){var _a5={productCode:"TD",subProductCode:"",transactionTypeCode:"01",entity:dj.byId("entity")?dj.byId("entity").get("value"):"",currency:dj.byId("td_cur_code")?dj.byId("td_cur_code").get("value"):"",amount:dj.byId("td_amt")?m.trimAmount(dj.byId("td_amt").get("value")):"",bankAbbvName:dj.byId("customer_bank")?dj.byId("customer_bank").get("value"):"",es_field1:dj.byId("td_amt")?m.trimAmount(dj.byId("td_amt").get("value")):"",es_field2:""};return _a5;}});})(dojo,dijit,misys);dojo.require("misys.client.binding.cash.create_td_cstd_client");}