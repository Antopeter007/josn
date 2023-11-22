/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.binding.bank.report_ec"]){dojo._hasResource["misys.binding.bank.report_ec"]=true;dojo.provide("misys.binding.bank.report_ec");dojo.require("dijit.layout.TabContainer");dojo.require("dijit.form.DateTextBox");dojo.require("misys.form.CurrencyTextBox");dojo.require("dijit.form.FilteringSelect");dojo.require("misys.form.file");dojo.require("misys.form.addons");dojo.require("misys.form.SimpleTextarea");dojo.require("dojo.data.ItemFileReadStore");dojo.require("misys.form.common");dojo.require("misys.validation.common");dojo.require("dijit.form.Form");dojo.require("dijit.form.Button");dojo.require("dijit.form.TextBox");dojo.require("misys.widget.Dialog");dojo.require("dijit.ProgressBar");dojo.require("dijit.form.ValidationTextBox");dojo.require("dijit.form.CheckBox");dojo.require("dijit.layout.ContentPane");dojo.require("misys.widget.Collaboration");dojo.require("misys.widget.NoCloseDialog");dojo.require("misys.binding.trade.ls_common");(function(d,dj,m){m._config=m._config||{};m._config.ecCurCode=m._config.ecCurCode||{};m._config.drawer=m._config.drawer||{entity:"",name:"",addressLine1:"",addressLine2:"",dom:""};m._config.drawee=m._config.drawee||{name:"",addressLine1:"",addressLine2:"",dom:""};function _1(_2){var _3=null;var _4;if(dj.byId(_2)){var _5=dj.byId(_2).get("value");if((_5.indexOf("<")!=-1)||(_5.indexOf(">")!=-1)){_3=m.getLocalization("invalidContent");dj.byId(_2).set("state","Error");dj.hideTooltip(dj.byId(_2).domNode);dj.showTooltip(_3,dj.byId(_2).domNode,0);var _6=function(){dj.hideTooltip(dj.byId(_2).domNode);};setTimeout(_6,1500);return false;}if(dj.byId(_2).get("required")&&dj.byId(_2).id!=="documents_details_second_mail_send"){if(_5<=0&&_2!=="documents_details_second_mail_send"){if((d.number.parse(dj.byId(_2).get("value"))>0||d.number.parse(dj.byId("documents_details_second_mail_send").get("value"))>0)&&dj.byId("documents_details_code_nosend").get("value")!=="01"){dj.byId(_2).set("state","");dj.hideTooltip(dj.byId(_2).domNode);dj.byId("documents_details_second_mail_send").set("state","");dj.hideTooltip(dj.byId("documents_details_second_mail_send").domNode);return true;}else{if(d.number.parse(dj.byId(_2).get("value"))<=0){_3=m.getLocalization("valueShouldBeGreaterThanZero");dj.byId(_2).set("state","Error");dj.hideTooltip(dj.byId(_2).domNode);dj.showTooltip(_3,dj.byId(_2).domNode,0);_4=function(){dj.hideTooltip(dj.byId(_2).domNode);};setTimeout(_4,1500);return false;}}}}if(dj.byId(_2).get("required")&&dj.byId(_2).id!=="documents_details_first_mail_send"){if((d.number.parse(dj.byId(_2).get("value"))>0||d.number.parse(dj.byId("documents_details_first_mail_send").get("value"))>0)&&dj.byId("documents_details_code_nosend").get("value")!=="01"){dj.byId(_2).set("state","");dj.hideTooltip(dj.byId(_2).domNode);dj.byId("documents_details_first_mail_send").set("state","");dj.hideTooltip(dj.byId("documents_details_first_mail_send").domNode);return true;}else{if(dj.byId("documents_details_code_nosend").get("value")!=="01"&&_2!=="documents_details_name_nosend"){_3=m.getLocalization("valueShouldBeGreaterThanZero");dj.byId(_2).set("state","Error");dj.hideTooltip(dj.byId(_2).domNode);dj.showTooltip(_3,dj.byId(_2).domNode,0);_4=function(){dj.hideTooltip(dj.byId(_2).domNode);};setTimeout(_4,1500);return false;}else{if(d.number.parse(dj.byId("documents_details_first_mail_send").get("value"))<=0){_3=m.getLocalization("valueShouldBeGreaterThanZero");dj.byId("documents_details_first_mail_send").set("state","Error");dj.hideTooltip(dj.byId("documents_details_first_mail_send").domNode);dj.showTooltip(_3,dj.byId("documents_details_first_mail_send").domNode,0);_4=function(){dj.hideTooltip(dj.byId("documents_details_first_mail_send").domNode);};setTimeout(_4,1500);return false;}}}}}};function _7(_8){if(_9(_8)){var _a=dj.byId("documents_details_total_send");var _b=d.number.parse(dj.byId("documents_details_first_mail_send").get("value"));var _c=d.number.parse(dj.byId("documents_details_second_mail_send").get("value"));_b=!isNaN(_b)?_b:0;_c=!isNaN(_c)?_c:0;_a.set("value",_b+_c);_a.set("readOnly",true);return true;}};function _9(_d){if(dj.byId(_d)){var _e=dj.byId(_d).get("value");var _f=new RegExp("^[0-9]+$");if(_e!=""&&!_f.test(_e)){var _10=m.getLocalization("invalidContent");dj.byId(_d).set("state","Error");dj.hideTooltip(dj.byId(_d).domNode);dj.showTooltip(_10,dj.byId(_d).domNode,0);var _11=function(){dj.hideTooltip(dj.byId(_d).domNode);};setTimeout(_11,1500);return false;}return true;}};d.mixin(m._config,{xmlTransform:function(xml){var _12="<ec_tnx_record>";if(xml.indexOf(_12)!=-1){var _13=m._config.xmlTagName,_14=_13?["<",_13,">"]:[],_15="</ec_tnx_record>",_16="",_17=-1;_16=xml.substring(_12.length,(xml.length-_15.length));_14.push(_16);if(dj.byId("gridLicense")&&dj.byId("gridLicense").store&&dj.byId("gridLicense").store!==null&&dj.byId("gridLicense").store._arrayOfAllItems.length>0){_14.push("<linked_licenses>");dj.byId("gridLicense").store.fetch({query:{REFERENCEID:"*"},onComplete:dojo.hitch(dj.byId("gridLicense"),function(_18,_19){dojo.forEach(_18,function(_1a){_14.push("<license>");_14.push("<ls_ref_id>",_1a.REFERENCEID,"</ls_ref_id>");_14.push("<bo_ref_id>",_1a.BO_REF_ID,"</bo_ref_id>");_14.push("<ls_number>",_1a.LS_NUMBER,"</ls_number>");_14.push("<ls_allocated_amt>",_1a.LS_ALLOCATED_AMT,"</ls_allocated_amt>");_14.push("<ls_amt>",_1a.LS_AMT,"</ls_amt>");_14.push("<ls_os_amt>",_1a.LS_OS_AMT,"</ls_os_amt>");_14.push("<converted_os_amt>",_1a.CONVERTED_OS_AMT,"</converted_os_amt>");_14.push("<allow_overdraw>",_1a.ALLOW_OVERDRAW,"</allow_overdraw>");_14.push("</license>");});})});_14.push("</linked_licenses>");}if(_13){_14.push("</",_13,">");}return _14.join("");}else{return xml;}}});d.mixin(m,{bind:function(){m.setValidation("ec_cur_code",m.validateCurrency);m.setValidation("drawee_country",m.validateCountry);if(dj.byId("tenor_base_date")){m.setValidation("tenor_base_date",m.validateBaseDateWithCurrentSystemDate);}if(dj.byId("tenor_maturity_date")){m.setValidation("tenor_maturity_date",m.validateMaturityDateWithSystemDate);}m.connect("prod_stat_code","onChange",m.validateOutstandingAmount);m.connect("ec_cur_code","onChange",function(){m.setCurrency(this,["ec_amt","ec_liab_amt"]);});m.setValidation("bo_comment",m.bofunction);m.connect("courier_partner","onChange",m.validatecourierPartnerField);m.connect("ec_amt","onBlur",function(){m.setTnxAmt(this.get("value"));});m.connect("ec_liab_amt","onBlur",function(){if(dj.byId("ec_amt")&&(dj.byId("ec_amt").get("value")<dj.byId("ec_liab_amt").get("value"))){var _1b=function(){var _1c=dijit.byId("ec_liab_amt");_1c.set("state","Error");};m.dialog.show("ERROR",m.getLocalization("ECLiabilityAmountCanNotBeGreaterThanECTotalAmount"),"",function(){setTimeout(_1b,0);});}});m.connect("ec_outstanding_amt","onBlur",function(){if(dj.byId("ec_amt")&&(dj.byId("ec_amt").get("value")<dj.byId("ec_outstanding_amt").get("value"))){var _1d=function(){var _1e=dijit.byId("ec_outstanding_amt");_1e.set("state","Error");};m.dialog.show("ERROR",m.getLocalization("ECLiabilityAmountCanNotBeGreaterThanECTotalAmount"),"",function(){setTimeout(_1d,0);});}});m.connect("inco_term_year","onChange",m.getIncoTerm);m.connect("inco_term_year","onChange",function(){m.toggleFields(this.get("value"),null,["inco_term"],false,true);});m.connect("term_code","onChange",function(){if(this.get("value")==="01"){if(dj.byId("protest_non_accpt").get("checked",true)){dj.byId("protest_non_accpt").set("checked",false);}if(dj.byId("accpt_defd_flag").get("checked",true)){dj.byId("accpt_defd_flag").set("checked",false);}dj.byId("accpt_adv_send_mode").set("value","");dj.byId("accpt_adv_send_mode").set("disabled",true);}else{dj.byId("accpt_adv_send_mode").set("disabled",false);}if(this.get("value")==="01"){m.toggleFields(true,null,["tenor_type_1"],false);dj.byId("tenor_type_1").set("checked",true);dj.byId("tenor_type_2").set("disabled",true);dj.byId("tenor_type_2").set("checked",false);if(dj.byId("tenor_type_3")){dj.byId("tenor_type_3").set("disabled",true);dj.byId("tenor_type_3").set("checked",false);}if(dj.byId("tenor_desc")){dj.byId("tenor_desc").set("disabled",true);m.toggleRequired("tenor_desc",false);if(dj.byId("tenor_desc").get("value")==undefined||dj.byId("tenor_desc").get("value")==null){dj.byId("tenor_desc").set("value","");}}m.toggleAllTenorFields();}else{if(this.get("value")==="02"){dj.byId("tenor_type_2").set("disabled",false);dj.byId("tenor_type_2").set("checked",true);dj.byId("tenor_type_1").set("checked",false);if(dj.byId("tenor_type_3")){dj.byId("tenor_type_3").set("disabled",true);dj.byId("tenor_type_3").set("checked",false);}dj.byId("tenor_type_1").set("disabled",true);if(dj.byId("tenor_desc")&&!(dj.byId("tenor_type_3"))){dj.byId("tenor_desc").set("disabled",false);m.toggleRequired("tenor_desc",true);if(dj.byId("tenor_desc").get("value")==undefined||dj.byId("tenor_desc").get("value")==null){dj.byId("tenor_desc").set("value","");}}else{if(dj.byId("tenor_desc")&&dj.byId("tenor_type_3")){dj.byId("tenor_desc").set("disabled",true);m.toggleRequired("tenor_desc",false);if(dj.byId("tenor_desc").get("value")==undefined||dj.byId("tenor_desc").get("value")==null){dj.byId("tenor_desc").set("value","");}}}m.toggleAllTenorFields();}else{if(this.get("value")==="04"){dj.byId("tenor_type_2").set("disabled",true);dj.byId("tenor_type_2").set("checked",false);if(dj.byId("tenor_type_3")){dj.byId("tenor_type_3").set("disabled",false);dj.byId("tenor_type_3").set("checked",true);}dj.byId("tenor_type_1").set("disabled",true);dj.byId("tenor_type_1").set("checked",false);if(dj.byId("tenor_desc")){dj.byId("tenor_desc").set("disabled",true);m.toggleRequired("tenor_desc",false);if(dj.byId("tenor_desc").get("value")==undefined||dj.byId("tenor_desc").get("value")==null){dj.byId("tenor_desc").set("value","");}}m.toggleAllTenorFields();}else{if(this.get("value")==="03"){dj.byId("tenor_type_1").set("disabled",false);dj.byId("tenor_type_2").set("disabled",false);if(dj.byId("tenor_type_3")){dj.byId("tenor_type_3").set("disabled",false);}dj.byId("tenor_type_1").set("checked",true);dj.byId("tenor_type_2").set("checked",false);if(dj.byId("tenor_desc")){dj.byId("tenor_desc").set("disabled",false);m.toggleRequired("tenor_desc",true);}m.toggleAllTenorFields();}}}}});m.connect("tenor_maturity_date","onBlur",function(){var _1f=dj.byId("term_code")?dj.byId("term_code").get("value"):"";if((_1f==="02"||_1f==="03"||_1f==="04")&&dj.byId("tenor_maturity_date")){if(dj.byId("tenor_maturity_date").get("value")){dj.byId("tenor_days").set("value","");if(dj.byId("tenor_desc")){if(dj.byId("tenor_desc").get("value")==undefined||dj.byId("tenor_desc").get("value")==null){dj.byId("tenor_desc").set("value","");}}dj.byId("tenor_period").set("value","");dj.byId("tenor_from_after").set("value","");dj.byId("tenor_days_type").set("value","");dj.byId("tenor_base_date").set("displayedValue","");dj.byId("tenor_days").set("disabled",true);dj.byId("tenor_period").set("disabled",true);dj.byId("tenor_from_after").set("disabled",true);dj.byId("tenor_days_type").set("disabled",true);m.toggleRequired("tenor_days_type",false);dj.byId("tenor_type_details").set("disabled",true);dj.byId("tenor_base_date").set("disabled",true);m.toggleRequired("tenor_base_date",false);m.toggleRequired(dojo.query("label[for=tenor_period_label]")[0].innerHTML=m.getLocalization("tenorPeriod"),false);}else{if(!dj.byId("tenor_maturity_date").get("value")){dj.byId("tenor_days").set("disabled",false);dj.byId("tenor_period").set("disabled",false);dj.byId("tenor_from_after").set("disabled",false);dj.byId("tenor_days_type").set("disabled",false);m.toggleRequired("tenor_days_type",true);dj.byId("tenor_type_details").set("disabled",false);dj.byId("tenor_base_date").set("disabled",false);m.toggleAllTenorFields();}}}});m.connect("tenor_days","onBlur",function(){var _20=dj.byId("term_code")?dj.byId("term_code").get("value"):"";if((_20==="02"||_20==="03"||_20==="04")&&dj.byId("tenor_days")){if(dj.byId("tenor_days").get("value")){dj.byId("tenor_maturity_date").set("displayedValue","");dj.byId("tenor_maturity_date").set("disabled",true);m.toggleRequired(dojo.query("label[for=tenor_maturity_date]")[0].innerHTML=m.getLocalization("tenorMaturitydate"),false);}else{if(!dj.byId("tenor_days").get("value")){dj.byId("tenor_maturity_date").set("disabled",false);m.toggleAllTenorFields();}}}});m.connect("tenor_days_type","onChange",function(){m.toggleFields((this.get("value")==="O"),null,["tenor_type_details"]);if(this.get("value")==="O"||this.get("value")==="G"||this.get("value")==="S"){m.toggleRequired("tenor_base_date",false);}else{m.toggleRequired("tenor_base_date",true);}});m.connect("tenor_type_1","onClick",m.toggleAllTenorFields);m.connect("tenor_type_2","onClick",m.toggleAllTenorFields);if(dj.byId("tenor_type_3")){m.connect("tenor_type_3","onClick",m.toggleAllTenorFields);m.connect("tenor_type_3","onClick",m.clearDataOnclicTenortype2or3);}m.connect("tenor_type_2","onClick",m.clearDataOnclicTenortype2or3);m.connect("protest_non_accpt","onClick",m.disableNonAcceptanceFields);m.connect("accpt_defd_flag","onClick",m.disableNonAcceptanceFields);m.connect("prod_stat_code","onChange",m.toggleProdStatCodeFields);m.connect("prod_stat_code","onChange",function(){var _21=this.get("value");m.toggleFields(_21&&_21!=="01"&&_21!=="18",null,["iss_date","bo_ref_id"]);if(dj.byId("mode")&&dj.byId("mode").get("value")==="RELEASE"){m.toggleRequired("bo_ref_id",false);m.toggleRequired("iss_date",false);m.toggleRequired("ec_outstanding_amt",false);m.toggleRequired("ec_liab_amt",false);}if(_21&&_21==="01"){m.toggleRequired("presenting_bank_name",false);m.toggleRequired("presenting_bank_address_line_1",false);}else{m.toggleRequired("presenting_bank_name",true);m.toggleRequired("presenting_bank_address_line_1",true);}if(_21==="05"||_21==="13"||_21==="15"||_21==="14"||_21==="04"){m.toggleRequired("maturity_date",true);}else{m.toggleRequired("maturity_date",false);}});m.connect("prod_stat_code","onChange",function(){m.updateOutstandingAmount(dj.byId("ec_liab_amt"),dj.byId("org_ec_liab_amt"));});m.connect("tnx_amt","onChange",function(){m.updateOutstandingAmount(dj.byId("ec_liab_amt"),dj.byId("org_ec_liab_amt"));});m.connect("prod_stat_code","onChange",function(){var _22=dj.byId("prod_stat_code").get("value"),_23=dj.byId("ec_liab_amt"),_24=dj.byId("ec_outstanding_amt");if(_23&&(_22==="01"||_22==="10"||_22==="06")){_23.set("readOnly",true);_23.set("disabled",true);_24.set("readOnly",true);_24.set("disabled",true);m.toggleRequired("ec_outstanding_amt",false);m.toggleRequired("ec_liab_amt",false);dj.byId("ec_outstanding_amt").set("value","");dj.byId("ec_liab_amt").set("value","");}else{if(_23){_23.set("readOnly",false);_23.set("disabled",false);_24.set("readOnly",false);_24.set("disabled",false);if(!(dj.byId("mode")&&dj.byId("mode").get("value")==="RELEASE")){m.toggleRequired("ec_outstanding_amt",true);m.toggleRequired("ec_liab_amt",true);}dj.byId("ec_outstanding_amt").set("value",dj.byId("org_ec_outstanding_amt").get("value"));dj.byId("ec_liab_amt").set("value",dj.byId("org_ec_liab_amt").get("value"));}}if(dj.byId("tnx_type_code")&&dj.byId("tnx_type_code").get("value")=="01"){if(_22==="01"){_23.set("value",0);}else{_23.set("value",dj.byId("ec_amt").get("value"));}}if(m._config.enable_to_edit_customer_details_bank_side=="false"&&dj.byId("prod_stat_code")&&dj.byId("prod_stat_code").get("value")!==""&&dj.byId("ec_liab_amt")&&dj.byId("tnx_type_code")&&dj.byId("tnx_type_code").get("value")!=="15"&&dj.byId("tnx_type_code").get("value")!=="13"){m.toggleRequired("ec_liab_amt",false);m.toggleRequired("presenting_bank_name",false);m.toggleRequired("presenting_bank_address_line_1",false);m.toggleRequired("ec_outstanding_amt",false);}});m.connect("license_lookup","onClick",function(){m.getLicenses("ec");});m.connect("ec_cur_code","onChange",function(){m.clearLicenseGrid(this,m._config.ecCurCode,"ec");});m.connect("entity","onChange",function(){m.clearLicenseGrid(this,m._config.drawer,"ec");});m.connect("drawee_name","onChange",function(){m.clearLicenseGrid(this,m._config.drawee,"ec");});m.connect("documents_details_second_mail_send","onBlur",function(){_1("documents_details_second_mail_send");});m.connect("documents_details_first_mail_send","onBlur",function(){_1("documents_details_first_mail_send");});m.connect("documents_details_total_send","onBlur",function(){_1("documents_details_total_send");});m.connect("documents_details_name_nosend","onBlur",function(){_1("documents_details_name_nosend");});m.connect("documents_details_doc_no_send","onBlur",function(){_1("documents_details_doc_no_send");});m.connect("maturity_date","onBlur",function(){m.validateEnteredGreaterThanCurrentDate();});m.connect("documents_details_first_mail_send","onBlur",function(){_7("documents_details_first_mail_send");});m.connect("documents_details_second_mail_send","onBlur",function(){_7("documents_details_second_mail_send");});m.connect("documents_details_code_nosend","onChange",function(){if(dj.byId("documents_details_code_nosend").get("value")==="01"&&d.number.parse(dj.byId("documents_details_first_mail_send").get("value"))<=0){var _25=null;_25=m.getLocalization("valueShouldBeGreaterThanZero");dj.byId("documents_details_first_mail_send").set("state","Error");dj.hideTooltip(dj.byId("documents_details_first_mail_send").domNode);dj.showTooltip(_25,dj.byId("documents_details_first_mail_send").domNode,0);var _26=function(){dj.hideTooltip(dj.byId("documents_details_first_mail_send").domNode);};setTimeout(_26,1500);return false;}else{dj.byId("documents_details_first_mail_send").set("state","");dj.hideTooltip(dj.byId("documents_details_first_mail_send").domNode);return true;}});m.connect("prod_stat_code","onChange",function(){var _27=dj.byId("prod_stat_code");var _28=_27?_27.get("value"):"";var _29=dj.byId("tnx_type_code");var _2a=_29?_29.get("value"):"";var _2b=dj.byId("imp_bill_ref_id");if(_29&&_27&&_2b){if(_2a==="15"){_2b.set("readOnly",!(_28==="07"));_2b.set("disabled",!(_28==="07"));}else{if(_28==="03"){_2b.set("readOnly",false);_2b.set("disabled",false);}else{_2b.set("readOnly",true);_2b.set("disabled",true);_2b.set("value","");}}}});},onFormLoad:function(){m._config.ecCurCode=dj.byId("ec_cur_code").get("value");m._config.isBank=true;m._config.drawee.name=dj.byId("drawee_name").get("value");m._config.drawee.addressLine1=dj.byId("drawee_address_line_1").get("value");m._config.drawee.addressLine2=dj.byId("drawee_address_line_2").get("value");m._config.drawee.dom=dj.byId("drawee_dom").get("value");m._config.drawer.entity=dj.byId("entity")?dj.byId("entity").get("value"):"";m._config.drawer.name=dj.byId("drawer_name").get("value");m._config.drawer.addressLine1=dj.byId("drawer_address_line_1").get("value");m._config.drawer.addressLine2=dj.byId("drawer_address_line_2").get("value");m._config.drawer.dom=dj.byId("drawer_dom").get("value");m.setCurrency(dj.byId("ec_cur_code"),["tnx_amt","ec_amt","ec_liab_amt","ec_outstanding_amt"]);var _2c=dj.byId("presenting_bank_name");if(_2c){_2c.onChange();}var _2d=dj.byId("collecting_bank_name");if(_2d){_2d.onChange();}if(dj.byId("tnx_type_code")&&dj.byId("tnx_type_code").get("value")==="01"){var _2e=dj.byId("prod_stat_code").get("value");m.toggleFields(_2e&&_2e!=="01"&&_2e!=="18",null,["iss_date","bo_ref_id"]);if(dj.byId("mode")&&dj.byId("mode").get("value")==="RELEASE"){m.toggleRequired("bo_ref_id",false);m.toggleRequired("ec_outstanding_amt",false);m.toggleRequired("ec_liab_amt",false);}}var _2f=dj.byId("term_code");if(_2f){if(_2f.get("value")==="01"){if(dj.byId("tenor_desc")){dj.byId("tenor_desc").set("disabled",true);if(dj.byId("tenor_desc").get("value")==undefined||dj.byId("tenor_desc").get("value")==null){dj.byId("tenor_desc").set("value","");}}dj.byId("accpt_adv_send_mode").set("value","");dj.byId("accpt_adv_send_mode").set("disabled",true);m.toggleFields(true,null,["tenor_type_1"]);dj.byId("tenor_type_1").set("checked",true);dj.byId("tenor_type_2").set("disabled",true);if(dj.byId("tenor_type_3")){dj.byId("tenor_type_3").set("disabled",true);}dj.byId("tenor_days").set("disabled",true);if(dj.byId("tenor_desc")){dj.byId("tenor_desc").set("disabled",true);if(dj.byId("tenor_desc").get("value")==undefined||dj.byId("tenor_desc").get("value")==null){dj.byId("tenor_desc").set("value","");}}dj.byId("tenor_period").set("disabled",true);dj.byId("tenor_from_after").set("disabled",true);dj.byId("tenor_days_type").set("disabled",true);dj.byId("tenor_type_details").set("disabled",true);dj.byId("tenor_base_date").set("disabled",true);dj.byId("tenor_days").set("value","");dj.byId("tenor_period").set("value","");dj.byId("tenor_from_after").set("value","");dj.byId("tenor_days_type").set("value","");dj.byId("tenor_base_date").set("displayedValue","");dj.byId("tenor_maturity_date").set("displayedValue","");dj.byId("tenor_maturity_date").set("disabled",true);}else{if(_2f.get("value")==="02"){if(dj.byId("tenor_type_3")){dj.byId("tenor_type_3").set("disabled",true);dj.byId("tenor_type_3").set("checked",false);}dj.byId("tenor_type_2").set("disabled",false);dj.byId("tenor_type_1").set("disabled",true);dj.byId("tenor_type_1").set("checked",false);dj.byId("tenor_type_2").set("checked",true);if(dj.byId("tenor_desc")&&!(dj.byId("tenor_type_3"))){dj.byId("tenor_desc").set("disabled",false);}else{if(dj.byId("tenor_desc")&&dj.byId("tenor_type_3")){dj.byId("tenor_desc").set("disabled",true);}}dj.byId("tenor_maturity_date").set("disabled",false);m.toggleRequired("tenor_maturity_date",false);if(dj.byId("tenor_maturity_date").get("value")){dj.byId("tenor_days").set("disabled",false);dj.byId("tenor_period").set("disabled",false);dj.byId("tenor_from_after").set("disabled",false);dj.byId("tenor_days_type").set("disabled",false);m.toggleAllTenorFields();dj.byId("tenor_type_details").set("disabled",true);dj.byId("tenor_base_date").set("disabled",false);m.toggleRequired("tenor_base_date",false);}else{if(dj.byId("tenor_days")&&dj.byId("tenor_days").get("value")){dj.byId("tenor_maturity_date").set("displayedValue","");m.toggleRequired("tenor_maturity_date",false);dj.byId("tenor_maturity_date").set("disabled",true);}else{dj.byId("tenor_days").set("disabled",false);dj.byId("tenor_period").set("disabled",false);dj.byId("tenor_from_after").set("disabled",false);dj.byId("tenor_days_type").set("disabled",false);m.toggleRequired("tenor_days_type",true);dj.byId("tenor_type_details").set("disabled",false);dj.byId("tenor_base_date").set("disabled",false);m.toggleAllTenorFields();}}}else{if(_2f.get("value")==="04"){if(dj.byId("tenor_type_3")){dj.byId("tenor_type_3").set("disabled",false);dj.byId("tenor_type_3").set("checked",true);}dj.byId("tenor_type_2").set("disabled",true);dj.byId("tenor_type_1").set("disabled",true);dj.byId("tenor_type_1").set("checked",false);dj.byId("tenor_type_2").set("checked",false);if(dj.byId("tenor_desc")){dj.byId("tenor_desc").set("disabled",true);}m.toggleAllTenorFields();if(dj.byId("tenor_maturity_date").get("value")){dj.byId("tenor_days").set("disabled",true);dj.byId("tenor_period").set("disabled",true);dj.byId("tenor_from_after").set("disabled",true);dj.byId("tenor_days_type").set("disabled",true);m.toggleRequired("tenor_days_type",false);dj.byId("tenor_type_details").set("disabled",true);dj.byId("tenor_base_date").set("disabled",true);m.toggleRequired("tenor_base_date",false);m.toggleRequired(dojo.query("label[for=tenor_period_label]")[0].innerHTML=m.getLocalization("tenorPeriod"),false);}else{if(dj.byId("tenor_days")&&dj.byId("tenor_days").get("value")){dj.byId("tenor_maturity_date").set("displayedValue","");m.toggleRequired("tenor_maturity_date",false);dj.byId("tenor_maturity_date").set("disabled",true);}else{dj.byId("tenor_days").set("disabled",false);dj.byId("tenor_period").set("disabled",false);dj.byId("tenor_from_after").set("disabled",false);dj.byId("tenor_days_type").set("disabled",false);m.toggleRequired("tenor_days_type",true);dj.byId("tenor_type_details").set("disabled",false);dj.byId("tenor_base_date").set("disabled",false);m.toggleAllTenorFields();}}}else{dj.byId("tenor_type_1").set("disabled",false);dj.byId("tenor_type_2").set("disabled",false);if(dj.byId("tenor_type_3")){dj.byId("tenor_type_3").set("disabled",false);}if(dj.byId("tenor_desc")){dj.byId("tenor_desc").set("disabled",false);m.toggleRequired("tenor_desc",true);}if(dj.byId("tenor_type_2").get("checked")||(dj.byId("tenor_type_3")&&dj.byId("tenor_type_3").get("checked"))){dj.byId("tenor_type_details").set("disabled",false);m.toggleAllTenorFields();}else{dj.byId("tenor_days").set("disabled",true);dj.byId("tenor_period").set("disabled",true);dj.byId("tenor_from_after").set("disabled",true);dj.byId("tenor_days_type").set("disabled",true);dj.byId("tenor_type_details").set("disabled",true);dj.byId("tenor_base_date").set("disabled",true);dj.byId("tenor_maturity_date").set("disabled",true);m.toggleRequired("tenor_maturity_date",false);m.toggleRequired("tenor_days",false);m.toggleRequired("tenor_period",false);m.toggleRequired("tenor_from_after",false);}}}}var _30=dj.byId("tenor_days_type")?dj.byId("tenor_days_type").get("value"):"";if(_30==="O"){dj.byId("tenor_type_details").set("disabled",false);m.toggleRequired("tenor_type_details",true);m.toggleRequired("tenor_base_date",false);}else{if(_30==="G"||_30==="S"){dj.byId("tenor_type_details").set("disabled",true);m.toggleRequired("tenor_base_date",false);}else{dj.byId("tenor_type_details").set("disabled",true);m.toggleRequired("tenor_base_date",true);}}}else{dj.byId("tenor_type_1").set("disabled",true);dj.byId("tenor_type_2").set("disabled",true);if(dj.byId("tenor_type_3")){dj.byId("tenor_type_3").set("disabled",true);}dj.byId("tenor_maturity_date").set("disabled",true);dj.byId("tenor_days").set("disabled",true);dj.byId("tenor_period").set("disabled",true);dj.byId("tenor_from_after").set("disabled",true);dj.byId("tenor_days_type").set("disabled",true);dj.byId("tenor_type_details").set("disabled",true);dj.byId("tenor_base_date").set("disabled",true);dj.byId("tenor_maturity_date").set("disabled",true);}if(dj.byId("fx_rates_type_temp")&&dj.byId("fx_rates_type_temp").get("value")!==""){m.onloadFXActions();}var _31=dj.byId("prod_stat_code"),_32=dj.byId("ec_liab_amt");if(_31.get("value")==="05"||_31.get("value")==="13"||_31.get("value")==="15"||_31.get("value")==="14"||_31.get("value")==="04"){m.toggleRequired("maturity_date",true);}if(_32&&_31&&(_31.get("value")==="01"||_31.get("value")==="10"||_31.get("value")==="06")){_32.set("readOnly",true);_32.set("disabled",true);}else{if(_32){_32.set("readOnly",false);_32.set("disabled",false);}}m.populateGridOnLoad("ec");if(dj.byId("tnx_type_code")&&(dj.byId("tnx_type_code").get("value")==="15"||(dj.byId("tnx_type_code").get("value")==="13"))&&(m._config.enable_to_edit_customer_details_bank_side=="false")){dojo.style("transactionDetails","display","none");}else{if(m._config.enable_to_edit_customer_details_bank_side=="false"){dojo.style("transactionDetails","display","none");var _33=["term_code","tenor_desc","entity","presenting_bank_name","presenting_bank_address_line_1","presenting_bank_address_line_2","drawer_name","drawer_address_line_1","drawer_address_line_2","drawer_dom","drawer_reference","presenting_bank_dom","drawer_contact_number","drawer_email","drawee_name","drawee_address_line_1","drawee_address_line_2","drawee_dom","drawee_country","drawee_reference","drawee_contact_number","drawee_email","ec_cur_code","ec_amt","ec_liab_amt","presenting_bank_name","presenting_bank_address_line_1","presenting_bank_address_line_2","presenting_bank_dom","collecting_bank_name","collecting_bank_name","collecting_bank_address_line_1","collecting_bank_address_line_2","collecting_bank_dom","bol_number","shipping_by","ship_from","ship_to","inco_term","inco_place","paymt_adv_send_mode","accpt_adv_send_mode","open_chrg_brn_by_code_1","open_chrg_brn_by_code_2","corr_chrg_brn_by_code_1","corr_chrg_brn_by_code_2","waive_chrg_flag","protest_non_paymt","protest_non_accpt","protest_adv_send_mode","accpt_defd_flag","store_goods_flag","needs_refer_to","needs_instr_by_code_1","needs_instr_by_code_2","narrative_additional_instructions","openDocumentDialog","narrative_description_goods","ec_outstanding_amt"];d.forEach(_33,function(id){var _34=dj.byId(id);if(_34){m.toggleRequired(_34,false);}});}}if(dj.byId("inco_term_year")){m.getIncoYear();dijit.byId("inco_term_year").set("value",dj.byId("org_term_year").get("value"));}if(dj.byId("inco_term")){if(dj.byId("inco_term_year")&&dj.byId("inco_term_year").get("value")!=""){m.getIncoTerm();}dijit.byId("inco_term").set("value",dj.byId("org_inco_term").get("value"));}if(dj.byId("tenor_days").get("value")){dj.byId("tenor_maturity_date").set("disabled",true);m.toggleRequired("tenor_maturity_date",false);if(dojo.query("label[for=tenor_maturity_date]")[0].innerHTML.indexOf("*")===-1){dojo.query("label[for=tenor_maturity_date]")[0].innerHTML="<span class='required-field-symbol'></span>"+dojo.query("label[for=tenor_maturity_date]")[0].innerHTML;}if(dojo.query("label[for=tenor_period_label]")[0].innerHTML.indexOf("*")===-1){dojo.query("label[for=tenor_period_label]")[0].innerHTML="<span class='required-field-symbol'>*</span>"+dojo.query("label[for=tenor_period_label]")[0].innerHTML;}m.toggleRequired("tenor_days",true);m.toggleRequired("tenor_days_type",true);}if(dj.byId("prod_stat_code")){dj.byId("prod_stat_code").onChange();}if(dj.byId("tenor_maturity_date").get("value")){dj.byId("tenor_maturity_date").onBlur();}},beforeSubmitValidations:function(){if(dj.byId("ec_amt")&&dj.byId("ec_liab_amt")&&(dj.byId("ec_amt").get("value")<dj.byId("ec_liab_amt").get("value"))){m._config.onSubmitErrorMsg=m.getLocalization("ECLiabilityAmountCanNotBeGreaterThanECTotalAmount");dj.byId("ec_liab_amt").set("value","");return false;}if(dj.byId("ec_amt")&&dj.byId("ec_outstanding_amt")&&(dj.byId("ec_amt").get("value")<dj.byId("ec_outstanding_amt").get("value"))){m._config.onSubmitErrorMsg=m.getLocalization("ECLiabilityAmountCanNotBeGreaterThanECTotalAmount");dj.byId("ec_outstanding_amt").set("value","");return false;}if(dj.byId("tnx_amt")&&(dj.byId("tnx_type_code")&&dj.byId("tnx_type_code").getValue()!="03"&&dj.byId("tnx_type_code").getValue()!="14"&&!(dj.byId("tnx_type_code").getValue()=="15"&&(dj.byId("prod_stat_code").get("value")=="03"||dj.byId("prod_stat_code").get("value")=="06"||dj.byId("prod_stat_code").get("value")=="08"||dj.byId("prod_stat_code").get("value")=="81")))){if(!m.validateAmount((dj.byId("tnx_amt"))?dj.byId("tnx_amt"):0)){m._config.onSubmitErrorMsg=m.getLocalization("amountcannotzero");dj.byId("tnx_amt").set("value","");return false;}}return (m.validateLSAmtSumAgainstTnxAmt("ec"));}});})(dojo,dijit,misys);dojo.require("misys.client.binding.bank.report_ec_client");}