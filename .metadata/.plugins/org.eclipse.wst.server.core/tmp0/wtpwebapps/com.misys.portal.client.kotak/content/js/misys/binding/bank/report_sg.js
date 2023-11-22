/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.binding.bank.report_sg"]){dojo._hasResource["misys.binding.bank.report_sg"]=true;dojo.provide("misys.binding.bank.report_sg");dojo.require("dijit.form.Form");dojo.require("dijit.form.Button");dojo.require("dijit.form.TextBox");dojo.require("misys.widget.Dialog");dojo.require("dijit.ProgressBar");dojo.require("dijit.form.ValidationTextBox");dojo.require("dijit.form.CheckBox");dojo.require("dijit.layout.ContentPane");dojo.require("dijit.form.DateTextBox");dojo.require("misys.form.CurrencyTextBox");dojo.require("dijit.form.FilteringSelect");dojo.require("dijit.layout.TabContainer");dojo.require("misys.form.addons");dojo.require("misys.form.SimpleTextarea");dojo.require("dojo.data.ItemFileReadStore");dojo.require("misys.widget.Collaboration");dojo.require("misys.form.PercentNumberTextBox");dojo.require("misys.form.common");dojo.require("misys.form.file");dojo.require("misys.validation.common");(function(d,dj,m){d.mixin(m,{bind:function(){m.setValidation("iss_date",m.validateIssueDate);m.setValidation("exp_date",m.validateBankExpiryDate);m.setValidation("bo_comment",m.bofunction);m.connect("prod_stat_code","onChange",m.toggleProdStatCodeFields);m.connect("prod_stat_code","onChange",function(){var _1=this.get("value");m.toggleFields(_1&&_1!=="01"&&_1!=="18",["action_req_code"],["iss_date","bo_ref_id","sg_liab_amt"]);if(dj.byId("mode")&&dj.byId("mode").get("value")==="RELEASE"){m.toggleRequired("bo_ref_id",false);m.toggleRequired("iss_date",false);m.toggleRequired("sg_liab_amt",false);}});m.connect("prod_stat_code","onChange",function(){var _2=dj.byId("prod_stat_code").get("value"),_3=dj.byId("sg_liab_amt");if(_3&&(_2==="01"||_2==="10"||_2==="06")){_3.set("readOnly",true);_3.set("disabled",true);}else{if(_3){_3.set("readOnly",false);_3.set("disabled",false);}}if(m._config.enable_to_edit_customer_details_bank_side=="false"&&dj.byId("prod_stat_code")&&dj.byId("prod_stat_code").get("value")!==""&&dj.byId("sg_liab_amt")&&dj.byId("tnx_type_code")&&dj.byId("tnx_type_code").get("value")!=="15"&&dj.byId("tnx_type_code").get("value")!=="13"){m.toggleRequired("sg_liab_amt",false);}});m.connect("sg_liab_amt","onBlur",function(){if(dj.byId("sg_amt")&&(dj.byId("sg_amt").get("value")<dj.byId("sg_liab_amt").get("value"))){var _4=function(){var _5=dijit.byId("sg_liab_amt");_5.set("state","Error");};m.dialog.show("ERROR",m.getLocalization("SGLiabilityAmountCanNotBeGreaterThanSGAmount"),"",function(){setTimeout(_4,500);});}});m.connect("sg_cur_code","onChange",function(){m.setCurrency(this,["sg_amt","sg_liab_amt"]);});m.connect("sg_amt","onBlur",function(){m.setTnxAmt(this.get("value"));});},onFormLoad:function(){m.setCurrency(dj.byId("charge_details_cur_code_nosend"),["tnx_amt"]);m.setCurrency(dj.byId("sg_cur_code"),["sg_amt","sg_liab_amt"]);var _6=dj.byId("prod_stat_code"),_7=dj.byId("sg_liab_amt");if(dj.byId("mode")&&dj.byId("mode").get("value")==="RELEASE"){m.toggleRequired("iss_date",false);m.toggleRequired("sg_liab_amt",false);}if(dj.byId("prod_stat_code").get("value")==="01"){m.toggleFields(!(prod_stat_code&&(sg_liab_amt||bo_ref_id||iss_date)),null,["iss_date","bo_ref_id","sg_liab_amt"],false,false);}if(dj.byId("tnx_type_code")&&(dj.byId("tnx_type_code").get("value")==="15"||(dj.byId("tnx_type_code").get("value")==="13"))&&(m._config.enable_to_edit_customer_details_bank_side=="false")){dojo.style("transactionDetails","display","none");}else{if(m._config.enable_to_edit_customer_details_bank_side=="false"){dojo.style("transactionDetails","display","none");var _8=["exp_date","entity","applicant_name","applicant_address_line_1","applicant_address_line_2","applicant_dom","applicant_country","applicant_reference","applicant_contact_number","applicant_email","beneficiary_name","beneficiary_address_line_1","beneficiary_address_line_2","beneficiary_dom","beneficiary_country","beneficiary_reference","beneficiary_contact_number","beneficiary_email","goods_desc","sg_cur_code","sg_amt","bol_number","shipping_mode","shipping_by","sg_liab_amt"];d.forEach(_8,function(id){var _9=dj.byId(id);if(_9){m.toggleRequired(_9,false);}});}}},beforeSubmitValidations:function(){if(dj.byId("sg_amt")&&dj.byId("sg_liab_amt")&&(dj.byId("sg_amt").get("value")<dj.byId("sg_liab_amt").get("value"))){m._config.onSubmitErrorMsg=m.getLocalization("SGLiabilityAmountCanNotBeGreaterThanSGAmount");dj.byId("sg_liab_amt").set("value","");return false;}return true;}});})(dojo,dijit,misys);dojo.require("misys.client.binding.bank.report_sg_client");}