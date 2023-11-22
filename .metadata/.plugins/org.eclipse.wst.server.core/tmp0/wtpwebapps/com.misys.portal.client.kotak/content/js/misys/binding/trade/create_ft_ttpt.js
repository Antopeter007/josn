/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.binding.trade.create_ft_ttpt"]){dojo._hasResource["misys.binding.trade.create_ft_ttpt"]=true;dojo.provide("misys.binding.trade.create_ft_ttpt");dojo.require("misys.form.common");dojo.require("misys.validation.common");dojo.require("dijit.form.Form");dojo.require("dijit.form.Button");dojo.require("dijit.form.TextBox");dojo.require("misys.widget.Dialog");dojo.require("dijit.ProgressBar");dojo.require("dijit.form.ValidationTextBox");dojo.require("dijit.form.CheckBox");dojo.require("dijit.layout.ContentPane");dojo.require("dojo.data.ItemFileReadStore");dojo.require("dojo.parser");dojo.require("dijit.form.DateTextBox");dojo.require("dijit.form.CurrencyTextBox");dojo.require("dijit.form.FilteringSelect");dojo.require("misys.form.SimpleTextarea");dojo.require("misys.form.addons");dojo.require("misys.form.file");dojo.require("dijit.layout.TabContainer");dojo.require("dojox.grid.DataGrid");dojo.require("dojox.grid.cells.dijit");dojo.require("misys.widget.Collaboration");dojo.require("misys.binding.trade.ls_common");dojo.require("misys.form.BusinessDateTextBox");(function(d,dj,m){fncGetGlobalVariable=function(_1){var _2="";if(dojo.global.mtpGlobals){_2=dojo.global.mtpGlobals[_1]||"";}return _2;};fncSetGlobalVariable=function(_3,_4){if(!dojo.global.mtpGlobals){dojo.global.mtpGlobals={};}dojo.global.mtpGlobals[_3]=_4;};function _5(){dj.byId("fee_act_no").set("value","");};function _6(){var _7=dj.byId("applicant_act_no").get("value");if(_7===""){m.dialog.show("ERROR",m.getLocalization("selectDebitFirst"));return;}var _8=dj.byId("entity")?dj.byId("entity").get("value"):"";var _9=dijit.byId("sub_product_code").get("value");m.showSearchDialog("beneficiary_accounts","['counterparty_name','counterparty_act_no','counterparty_cur_code', 'counterparty_address_line_1', 'counterparty_address_line_2', '', 'counterparty_dom', 'pre_approved_status', '', '',"+"'cpty_bank_name', 'cpty_bank_address_line_1', 'cpty_bank_address_line_2', 'cpty_bank_dom', 'cpty_branch_address_line_1', 'cpty_branch_address_line_2', 'cpty_branch_dom','','', "+"'cpty_bank_swift_bic_code', 'cpty_bank_code', 'cpty_branch_code', 'cpty_branch_name','pre_approved', '','','bene_adv_beneficiary_id_no_send', "+"'bene_adv_mailing_name_add_1_no_send','bene_adv_mailing_name_add_2_no_send','bene_adv_mailing_name_add_3_no_send','bene_adv_mailing_name_add_4_no_send', "+"'bene_adv_mailing_name_add_5_no_send','bene_adv_mailing_name_add_6_no_send','bene_adv_postal_code_no_send','bene_adv_country_no_send','bene_email_1',"+"'bene_email_2','counterparty_postal_code','counterparty_country', 'bene_adv_fax_no_send','bene_adv_phone_no_send','beneficiary_nickname']",{product_type:_9,entity_name:_8},"",_9,"width:710px;height:350px;",m.getLocalization("ListOfBeneficiriesTitleMessage"));};function _a(){var _b=dijit.byId("product_code").get("value");misys.showSearchDialog("account","['applicant_act_no','', '', '', '','applicant_act_cur_code', '']","","",_b,"width:650px;height:350px;",m.getLocalization("ListOfAccountsTitleMessage"));};d.mixin(m._config,{initReAuthParams:function(){var _c={productCode:"FT",subProductCode:dj.byId("sub_product_code").get("value"),transactionTypeCode:"01",entity:dj.byId("entity")?dj.byId("entity").get("value"):"",currency:dj.byId("ft_cur_code").get("value"),amount:m.trimAmount(dj.byId("ft_amt").get("value")),bankAbbvName:dj.byId("issuing_bank_abbv_name")?dj.byId("issuing_bank_abbv_name").get("value"):"",es_field1:m.trimAmount(dj.byId("ft_amt").get("value")),es_field2:(dj.byId("counterparty_act_no"))?dj.byId("counterparty_act_no").get("value"):""};return _c;},xmlTransform:function(_d){var _e="<ft_tnx_record>";if(_d.indexOf(_e)!==-1){var _f=m._config.xmlTagName,_10=_f?["<",_f,">"]:[],_11="</ft_tnx_record>",_12="";_12=_d.substring(_e.length,(_d.length-_11.length));_10.push(_12);if(dj.byId("gridLicense")&&dj.byId("gridLicense").store&&dj.byId("gridLicense").store!==null&&dj.byId("gridLicense").store._arrayOfAllItems.length>0){_10.push("<linked_licenses>");dj.byId("gridLicense").store.fetch({query:{REFERENCEID:"*"},onComplete:dojo.hitch(dj.byId("gridLicense"),function(_13,_14){dojo.forEach(_13,function(_15){_10.push("<license>");_10.push("<ls_ref_id>",_15.REFERENCEID,"</ls_ref_id>");_10.push("<bo_ref_id>",_15.BO_REF_ID,"</bo_ref_id>");_10.push("<ls_number>",_15.LS_NUMBER,"</ls_number>");_10.push("<ls_allocated_amt>",_15.LS_ALLOCATED_AMT,"</ls_allocated_amt>");_10.push("<ls_allocated_add_amt>",_15.LS_ALLOCATED_ADD_AMT,"</ls_allocated_add_amt>");_10.push("<ls_amt>",_15.LS_AMT,"</ls_amt>");_10.push("<ls_os_amt>",_15.LS_OS_AMT,"</ls_os_amt>");_10.push("<converted_os_amt>",_15.CONVERTED_OS_AMT,"</converted_os_amt>");_10.push("<allow_overdraw>",_15.ALLOW_OVERDRAW,"</allow_overdraw>");_10.push("</license>");});})});_10.push("</linked_licenses>");}if(_f){_10.push("</",_f,">");}return _10.join("");}else{return _d;}}});d.mixin(m,{bind:function(){var _16;var _17;m.setValidation("account_with_bank_iso_code",m.validateBICFormat);m.setValidation("pay_through_bank_iso_code",m.validateBICFormat);m.connect("counterparty_name","onChange",m.checkBeneficiaryNicknameDiv);m.setValidation("counterparty_cur_code",m.validateCurrency);m.setValidation("applicant_act_cur_code",m.validateCurrency);m.connect("counterparty_img","onClick",_6);m.connect("ft_amt","onBlur",function(){m.setCurrency(dj.byId("ft_cur_code"),["ft_amt"]);});m.connect("counterparty_name","onChange",function(){if(dj.byId("counterparty_cur_code").get("value")!==""){dj.byId("ft_cur_code").set("value",dj.byId("counterparty_cur_code").get("value"));}});m.connect("counterparty_cur_code","onChange",function(){if(dj.byId("counterparty_cur_code").get("value")!==""){dj.byId("ft_cur_code").set("value",dj.byId("counterparty_cur_code").get("value"));}});m.connect("license_lookup","onClick",function(){m.getLicenses("ft");});m.connect("pay_through_bank_name","onChange",function(){if(dj.byId("pay_through_bank_name").get("value")!==""){m.toggleRequired("pay_through_bank_iso_code",true);m.toggleRequired("account_with_bank_name",true);m.toggleRequired("account_with_bank_iso_code",true);}else{m.toggleRequired("pay_through_bank_iso_code",false);m.toggleRequired("account_with_bank_name",false);m.toggleRequired("account_with_bank_iso_code",false);_17=dj.byId("pay_through_bank_iso_code").parentTab;m.resetTabState(dijit.byId(_17));}});m.connect("account_with_bank_name","onChange",function(){if(dj.byId("account_with_bank_name").get("value")!==""){m.toggleRequired("account_with_bank_iso_code",true);}else{m.toggleRequired("account_with_bank_iso_code",false);_16=dj.byId("account_with_bank_iso_code").parentTab;m.resetTabState(dijit.byId(_16));}});m.connect("applicant_act_no_img","onClick",_a);var _18="";if(dijit.byId("ft_type")){_18=dijit.byId("ft_type").get("value");}fncSetGlobalVariable("ft_type",_18);misys.setValidation("template_id",misys.validateTemplateId);misys.setValidation("iss_date",misys.validateExecDate);misys.connect("issuing_bank_abbv_name","onChange",misys.populateReferences);m.connect("issuing_bank_abbv_name","onChange",m.updateBusinessDate);if(dijit.byId("issuing_bank_abbv_name")){misys.connect("entity","onChange",function(){dijit.byId("issuing_bank_abbv_name").onChange();});}misys.connect("issuing_bank_customer_reference","onChange",misys.setApplicantReference);misys.setValidation("iss_date",function(){misys.validateDateGreaterThanHitched=dojo.hitch(this,misys.validateDateGreaterThan);return misys.validateDateGreaterThanHitched(false,"","executionDateLessThanDateofDay");});if(_18=="01"){misys.setValidation("applicant_act_no",function(){fncValidateAccountHitched=dojo.hitch(this,fncValidateAccount);return fncValidateAccountHitched("transfer_account");});misys.setValidation("transfer_account",function(){fncValidateAccountHitched=dojo.hitch(this,fncValidateAccount);return fncValidateAccountHitched("applicant_act_no");});}m.connect("entity_img_label","onClick",_5);},onFormLoad:function(){var _19=fncGetGlobalVariable("ft_type");misys.setCurrency(dijit.byId("counterparty_details_ft_cur_code_nosend"),["counterparty_details_ft_amt_nosend"]);m.setCurrency(dj.byId("ft_cur_code"),["ft_amt"]);var _1a=dijit.byId("issuing_bank_abbv_name");if(_1a){_1a.onChange();}var _1b=dijit.byId("issuing_bank_customer_reference");if(_1b){_1b.onChange();_1b.set("value",_1b._resetValue);}m.checkBeneficiaryNicknameOnFormLoad();m.populateGridOnLoad("ft");d.mixin(m,{isTransactionDataBeingSigned:false,originalRealFormSubmitFunction:function(){return;}});},beforeSaveValidations:function(){var _1c=dj.byId("entity");if(_1c&&_1c.get("value")==""){return false;}else{return true;}},beforeSubmitValidations:function(){if(!m.validateAmount((dj.byId("ft_amt"))?dj.byId("ft_amt"):0)){m._config.onSubmitErrorMsg=m.getLocalization("amountcannotzero");dj.byId("ft_amt").set("value","");return false;}if(dj.byId("issuing_bank_abbv_name")&&!m.validateApplDate(dj.byId("issuing_bank_abbv_name").get("value"))){m._config.onSubmitErrorMsg=m.getLocalization("changeInApplicationDates");m.goToTop();return false;}return m.validateLSAmtSumAgainstTnxAmt("ft");}});})(dojo,dijit,misys);fncRequestFT=function(){if(fncCheckFields()&&fncDoPreSubmitValidations()){if(fncGetGlobalVariable("ft_type")=="01"){fncFillVar();_fncAjaxRequestFT();}else{if(fncGetGlobalVariable("ft_type")=="02"){fncFillVar();_fncAjaxRequestFT();}else{if(fncGetGlobalVariable("ft_type")=="05"){fncFillVar();_fncAjaxRequestFT();}}}}};fncAcceptFT=function(){dijit.byId("option").set("value","ACCEPT");misys.submit("SUBMIT");};fncRejectFT=function(){if(misys.countdown){_stopCountDown(misys.countdown);}_fncAjaxCancelFT();};_fncOpenCounterPartyDialog=function(){if(dojo.byId("counterparty_row_0")===null){fncSetGlobalVariable("haveABeneficiaryAccount","false");}if(fncGetGlobalVariable("haveABeneficiaryAccount")==="false"){misys.penCounterpartyDialog("counterparty");}};_fncDoAddCounterpartyActions=function(){dijit.byId("counterparty_acct_no").set("value",dijit.byId("counterparty_details_act_no_nosend").get("value"));dijit.byId("counterparty_name").set("value",dijit.byId("counterparty_details_name_nosend").get("value"));dijit.byId("counterparty_cur_code").set("value",dijit.byId("counterparty_details_ft_cur_code_nosend").get("value"));var _1d=fncDoAddCounterpartyActions("counterparty");if(_1d){fncSetGlobalVariable("haveABeneficiaryAccount","true");}};fncValidateAccount=function(_1e){var _1f;if(_1e=="applicant_act_no"){_1f="creditAcctEqualsToDebitAcct";}else{_1f="debitAcctEqualsToCreditAcct";}var _20=this.get("value");var _21=dijit.byId(_1e).get("value");if(_21!==""&&(this.state!=="Error"||dijit.byId(_1e).state!=="Error")){if(_20==_21){this.displayMessage(misys.getLocalization(_1f,[_20,_21]));return false;}else{if(dijit.byId(_1e).state=="Error"){dijit.byId(_1e).validate();}}}return true;};_fncValidateCurrencies=function(){var _22=dijit.byId("ft_cur_code").get("value");var _23=dijit.byId("applicant_act_cur_code").get("value");var _24=dijit.byId("transfer_account_cur_code").get("value");if(_23!==""&&_24!==""&&this.state!=="Error"){if(_22!=_23&&_22!=_24){dijit.byId("ft_cur_code").invalidMessage=misys.getLocalization("transferCurrencyDifferentThanAccountsCurrencies",[_22,_23,_24]);return false;}}return true;};fncFillVar=function(){if(dijit.byId("applicant_reference_hidden")){fncSetGlobalVariable("applicant_reference",dijit.byId("applicant_reference_hidden").get("value"));}else{fncSetGlobalVariable("applicant_reference","");}fncSetGlobalVariable("ordering_account",dijit.byId("applicant_act_no").get("value"));fncSetGlobalVariable("ordering_currency",dijit.byId("applicant_act_cur_code").get("value"));fncSetGlobalVariable("execution_date",dijit.byId("iss_date").getDisplayedValue());fncSetGlobalVariable("remarks",dijit.byId("narrative_additional_instructions").get("value"));if(fncGetGlobalVariable("ft_type")=="01"){fncSetGlobalVariable("ft_amount",dijit.byId("ft_amt").get("value"));fncSetGlobalVariable("ft_cur_code",dijit.byId("ft_cur_code").get("value"));fncSetGlobalVariable("transfer_account",dijit.byId("transfer_account").get("value"));fncSetGlobalVariable("transfer_currency",dijit.byId("transfer_account_cur_code").get("value"));fncSetGlobalVariable("beneficiary_currency","");fncSetGlobalVariable("beneficiary_name","");fncSetGlobalVariable("beneficiary_address","");fncSetGlobalVariable("beneficiary_city","");fncSetGlobalVariable("beneficiary_country","");fncSetGlobalVariable("beneficiary_bank","");fncSetGlobalVariable("beneficiary_bank_routing_number","");fncSetGlobalVariable("beneficiary_bank_branch","");fncSetGlobalVariable("beneficiary_bank_address","");fncSetGlobalVariable("beneficiary_bank_city","");fncSetGlobalVariable("beneficiary_bank_country","");fncSetGlobalVariable("beneficiary_bank_account","");fncSetGlobalVariable("payment_currency","");fncSetGlobalVariable("payment_amount","");}if(fncGetGlobalVariable("ft_type")=="02"){fncSetGlobalVariable("ft_amount",dijit.byId("payment_amt").get("value"));fncSetGlobalVariable("ft_cur_code",dijit.byId("payment_cur_code").get("value"));fncSetGlobalVariable("transfer_account","");fncSetGlobalVariable("transfer_currency","");fncSetGlobalVariable("payment_currency","");fncSetGlobalVariable("payment_amount","");fncSetGlobalVariable("beneficiary_name",dijit.byId("beneficiary_name").get("value"));fncSetGlobalVariable("beneficiary_address",dijit.byId("beneficiary_address").get("value"));fncSetGlobalVariable("beneficiary_city",dijit.byId("beneficiary_city").get("value"));fncSetGlobalVariable("beneficiary_account",dijit.byId("counterparty_details_act_no").get("value"));fncSetGlobalVariable("beneficiary_bank",dijit.byId("account_with_bank_name").get("value"));fncSetGlobalVariable("beneficiary_country",dijit.byId("beneficiary_country").get("value"));fncSetGlobalVariable("beneficiary_bank_routing_number",dijit.byId("beneficiary_bank_routing_number").get("value"));fncSetGlobalVariable("beneficiary_bank_branch",dijit.byId("beneficiary_bank_branch").get("value"));fncSetGlobalVariable("beneficiary_bank_address",dijit.byId("beneficiary_bank_address").get("value"));fncSetGlobalVariable("beneficiary_bank_city",dijit.byId("account_with_bank_dom").get("value"));fncSetGlobalVariable("beneficiary_bank_country",dijit.byId("beneficiary_bank_country").get("value"));fncSetGlobalVariable("beneficiary_bank_account",dijit.byId("beneficiary_bank_account").get("value"));}if(fncGetGlobalVariable("ft_type")=="05"){fncSetGlobalVariable("ft_amount",dijit.byId("ft_amt").get("value"));fncSetGlobalVariable("ft_cur_code",dijit.byId("ft_cur_code").get("value"));fncSetGlobalVariable("transfer_currency",dijit.byId("transfer_account_cur_code").get("value"));fncSetGlobalVariable("transfer_account",dijit.byId("transfer_account").get("value"));fncSetGlobalVariable("payment_currency",dijit.byId("payment_cur_code").get("value"));fncSetGlobalVariable("payment_amount",dijit.byId("payment_amt").get("value"));fncSetGlobalVariable("beneficiary_name",dijit.byId("beneficiary_name").get("value"));fncSetGlobalVariable("beneficiary_address",dijit.byId("beneficiary_address").get("value"));fncSetGlobalVariable("beneficiary_city",dijit.byId("beneficiary_city").get("value"));fncSetGlobalVariable("beneficiary_account",dijit.byId("counterparty_details_act_no").get("value"));fncSetGlobalVariable("beneficiary_bank",dijit.byId("account_with_bank_name").get("value"));fncSetGlobalVariable("beneficiary_country",dijit.byId("beneficiary_country").get("value"));fncSetGlobalVariable("beneficiary_bank_routing_number",dijit.byId("beneficiary_bank_routing_number").get("value"));fncSetGlobalVariable("beneficiary_bank_branch",dijit.byId("beneficiary_bank_branch").get("value"));fncSetGlobalVariable("beneficiary_bank_address",dijit.byId("beneficiary_bank_address").get("value"));fncSetGlobalVariable("beneficiary_bank_city",dijit.byId("account_with_bank_dom").get("value"));fncSetGlobalVariable("beneficiary_bank_country",dijit.byId("beneficiary_bank_country").get("value"));fncSetGlobalVariable("beneficiary_bank_account",dijit.byId("beneficiary_bank_account").get("value"));}if(dijit.byId("open_chrg_brn_by_code_1").get("value")=="01"){fncSetGlobalVariable("fee_account",dijit.byId("applicant_act_no").get("value"));}else{if(dijit.byId("open_chrg_brn_by_code_2").get("value")=="02"){if(fncGetGlobalVariable("ft_type")=="01"||fncGetGlobalVariable("ft_type")=="05"){fncSetGlobalVariable("fee_account",dijit.byId("transfer_account").get("value"));}else{if(fncGetGlobalVariable("ft_type")=="02"){fncSetGlobalVariable("fee_account",dijit.byId("counterparty_details_act_no").get("value"));}}}else{if(dijit.byId("open_chrg_brn_by_code_3").get("value")=="03"){fncSetGlobalVariable("fee_account",dijit.byId("counterparty_details_act_no").get("value"));}}}};dojo.require("misys.client.binding.trade.create_ft_ttpt_client");}