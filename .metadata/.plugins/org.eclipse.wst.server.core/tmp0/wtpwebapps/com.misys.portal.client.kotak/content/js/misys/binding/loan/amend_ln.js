/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.binding.loan.amend_ln"]){dojo._hasResource["misys.binding.loan.amend_ln"]=true;dojo.provide("misys.binding.loan.amend_ln");dojo.require("dojo.parser");dojo.require("misys.widget.Dialog");dojo.require("dijit.form.Button");dojo.require("misys.form.CurrencyTextBox");dojo.require("dijit.form.DateTextBox");dojo.require("dijit.form.Form");dojo.require("misys.form.common");dojo.require("misys.validation.common");dojo.require("misys.widget.Collaboration");dojo.require("misys.binding.SessionTimer");(function(d,dj,m){d.mixin(m._config,{initReAuthParams:function(){var _1={productCode:"LN",subProductCode:"",transactionTypeCode:"03",entity:dj.byId("entity")?dj.byId("entity").get("value"):"",currency:dj.byId("ln_cur_code")?dj.byId("ln_cur_code").get("value"):"",amount:dj.byId("ln_amt")?m.trimAmount(dj.byId("ln_amt").get("value")):"",es_field1:"",es_field2:""};return _1;}});function _2(_3){dj.byId("org_ln_amt").set("value",dj.byId("org_ln_liab_amt").get("value"));var _4=dj.byId("org_ln_amt").get("value");var _5=parseFloat(_4)+parseFloat(_3);if(_5!=null&&dj.byId("ln_amt")){dj.byId("ln_amt").set("value",_5);}};function _6(_7){var _8=dj.byId("org_ln_liab_amt").get("value");var _9=parseFloat(_8)+parseFloat(_7);if(_9!=null&&dj.byId("ln_liab_amt")){dj.byId("ln_liab_amt").set("value",_9);}};function _a(){if(this.get("value")==null){return true;}if(this.get("value")<=0){return false;}_b();return true;};function _c(){var d1=dj.byId("sublimit_expiry_date");var d2=dj.byId("appl_date");var _d;if(d1.get("value")!=null&&d1.get("value")!=""){if(m.compareDateFields(d1,d2)){_d=misys.getLocalization("sublimitExpired");m.dialog.show("ERROR",_d);return false;}}return true;};function _e(){var _f=dj.byId("ln_access_type");if(_f){if(_f.get("value")==="A"){return true;}else{m._config.onSubmitErrorMsg=misys.getLocalization("facilityBlockError",[dj.byId("bo_facility_name").get("value")]);}}return false;};function _b(){if(dj.byId("facility_available_amt")&&dj.byId("tnx_amt")&&dj.byId("ln_cur_code")&&dj.byId("org_ln_liab_amt")){var _10=dijit.byId("ln_cur_code");var _11=dj.byId("tnx_amt");var _12=d.cldr.monetary.getData(_10.get("value"));if(_10&&_10.get("value")){var _13=0;var _14=0;var _15=0;var _16=0;var _17=0;var _18=0;var _19=false;var _1a=0;var _1b;var _1c;misys._config.currenciesStore.fetch({query:{id:_10.get("value")},onItem:function(_1d){_13=_1d.limit;_14=_1d.borrowerCcylimit;_16=_1d.borrowerlimit;_15=_1d.LOANS;_17=_1d.limitWithPend;_18=_1d.SWNG;}});_1a=_13[0];if(_11&&_11.get("value")&&parseFloat(_11.get("value"))>_16){_19=true;if(_16[0]<_1a){_1a=_16[0];if(_16[0]<=0){_1b=misys.getLocalization("noAmountForBorrowerLimitError");_1c=m.getLocalization("loanBorrowerLevelLimtAmtExceeded");}else{_1b=misys.getLocalization("loanAmountTooBigThanBorrowerLimitAmtError",[_10.get("value"),d.currency.format((Math.floor(_1a*100)/100),{round:_12.round,places:_12.places})]);_1c=m.getLocalization("loanBorrowerLevelLimtAmtExceeded");}}}if(_11&&_11.get("value")&&parseFloat(_11.get("value"))>_15){_19=true;if(_15[0]<_1a){_1a=_15[0];if(_15[0]<=0){_1b=misys.getLocalization("noAmountForRiskLimitError");_1c=m.getLocalization("loanBorrowerRiskTypeLimtAmtExceeded");}else{_1b=misys.getLocalization("loanAmountTooBigThanBorrowerRiskTypeLimitAmtError",[_10.get("value"),d.currency.format((Math.floor(_1a*100)/100),{round:_12.round,places:_12.places})]);_1c=m.getLocalization("loanBorrowerRiskTypeLimtAmtExceeded");}}}if(_11&&_11.get("value")&&parseFloat(_11.get("value"))>_18){_19=true;if(_18[0]<_1a){_1a=_18[0];if(_18[0]<=0){_1b=misys.getLocalization("noAmountForRiskLimitError");_1c=m.getLocalization("loanBorrowerRiskTypeLimtAmtExceeded");}else{_1b=misys.getLocalization("loanAmountTooBigThanBorrowerRiskTypeLimitAmtError",[_10.get("value"),d.currency.format((Math.floor(_1a*100)/100),{round:_12.round,places:_12.places})]);_1c=m.getLocalization("loanBorrowerRiskTypeLimtAmtExceeded");}}}if(_11&&_11.get("value")&&parseFloat(_11.get("value"))>_14){_19=true;if(_14[0]<_1a){_1a=_14[0];if(_14[0]<=0){_1b=misys.getLocalization("noAmountForCurrencyLimitError",[_10.get("value")]);_1c=m.getLocalization("loanBorrowerCcyLimtAmtExceeded");}else{_1b=misys.getLocalization("loanAmountTooBigThanBorrowerCcyLimitAmtError",[_10.get("value"),d.currency.format((Math.floor(_1a*100)/100),{round:_12.round,places:_12.places})]);_1c=m.getLocalization("loanBorrowerCcyLimtAmtExceeded");}}}if(_11&&_11.get("value")&&parseFloat(_11.get("value"))>_13){_19=true;if(_13[0]<=_1a){_1a=_13[0];_1b=misys.getLocalization("loanAmountTooBigError",[_10.get("value"),d.currency.format((Math.floor(_1a*100)/100),{round:_12.round,places:_12.places})]);_1c=m.getLocalization("loanFacilityAmtExceeded");}}if(_11&&_11.get("value")&&parseFloat(_11.get("value"))>_17){_19=true;if(_17[0]<=_1a){_1a=_17[0];if(_1a<=0){_1b=misys.getLocalization("facilityFullyDrawnErrorWithPend");}else{_1b=misys.getLocalization("loanAmountTooBigWithPendError",[_10.get("value"),d.currency.format((Math.floor((_1a*100).toFixed(2))/100),{round:_12.round,places:_12.places})]);}_1c=m.getLocalization("loanFacilityAmtWithPendExceeded");}}if(_19){if(misys._config.warnFacilityAmtExceeded){misys._config.warningMessages=[];misys._config.warningMessages.push(_1c);return true;}else{_11.set("state","Error");dj.hideTooltip(_11.domNode);dj.showTooltip(_1b,_11.domNode,0);setTimeout(function(){dj.hideTooltip(_11.domNode);},5000);}return false;}else{misys._config.warningMessages=[];return true;}}}};d.mixin(m,{bind:function(){m.setValidation("amd_date",m.validateLoanIncreaseDate);m.connect("tnx_amt","onBlur",_a);m.connect("tnx_amt","onChange",function(){var _1e=this.get("value");if(_1e!==null&&(!isNaN(_1e))&&(_1e>-1)){_2(this.get("value"));_6(this.get("value"));}else{if((isNaN(_1e)||_1e<0)&&dj.byId("ln_liab_amt")&&dj.byId("org_ln_liab_amt")){var _1f=dj.byId("org_ln_liab_amt").get("value");dj.byId("ln_liab_amt").set("value",_1f);}}});},onFormLoad:function(){_b();_c();if(dijit.byId("ln_cur_code")){misys.setCurrency(dijit.byId("ln_cur_code"),["org_ln_liab_amt","tnx_amt","ln_liab_amt"]);}},toggleLegalTextDetails:function(){var _20=d.byId("actionDown");var _21=d.byId("actionUp");var _22=d.byId("LegalTextContainer");if(d.style("LegalTextContainer","display")==="none"){m.animate("wipeIn",_22);dj.byId("LegalTextDetailsGrid").resize();d.style("actionDown","display","none");d.style("actionUp","display","block");d.style("actionUp","cursor","pointer");}else{m.animate("wipeOut",_22);d.style("actionUp","display","none");d.style("actionDown","display","block");d.style("actionDown","cursor","pointer");}},onCancelNavigation:function(){var _23=misys._config.homeUrl;var _24=["/screen/LoanScreen?tnxtype=03","&option=EXISTING"];_23=misys.getServletURL(_24.join(""));return _23;},beforeSubmitValidations:function(){var _25=false;if(dj.byId("tnx_amt")){if(!m.validateAmount((dj.byId("tnx_amt"))?dj.byId("tnx_amt"):0)){m._config.onSubmitErrorMsg=m.getLocalization("amountcannotzero");dj.byId("tnx_amt").set("value","");m._config.legalTextEnabled=false;return false;}}if(dj.byId("amd_date_unsinged")&&dj.byId("repricing_date")&&dj.byId("mode").value==="UNSIGNED"){var _26=dj.byId("amd_date_unsinged").value;var _27=dj.byId("repricing_date").value;var _28=dojo.date.locale.parse(_26,{"locale":dojo.locale,"selector":"date"});var _29=dojo.date.locale.parse(_27,{"locale":dojo.locale,"selector":"date"});if(dj.byId("sub_product_code").get("value")==="SWG"){if(d.date.compare(_29,_28)<=0){m._config.onSubmitErrorMsg=m.getLocalization("loanAmendDateLesserThanRepricingDateError",[_26,_27]);return false;}}}_25=_e();if(!_25){m._config.legalTextEnabled=false;return false;}var _2a=m.isLegalTextAcceptedForAuthorizer();if(_25&&!(_2a)){m._config.legalTextEnabled=true;return false;}else{if(_25&&(_2a)){return true;}}return false;}});m._config=m._config||{};d.mixin(m._config,{xmlTransform:function(xml){var _2b=m._config.xmlTagName,_2c=_2b?["<",_2b,">"]:[];if(xml.indexOf(_2b)!=-1){var _2d=xml.substring(_2b.length+2,(xml.length-_2b.length-3));if(dijit.byId("legalDialog")&&dijit.byId("accept_legal_text")&&dijit.byId("accept_legal_text").get("checked")){_2d=_2d.concat("<accept_legal_text>");_2d=_2d.concat("Y");_2d=_2d.concat("</accept_legal_text>");}else{if(dijit.byId("legalDialog")&&dijit.byId("accept_legal_text")&&!(dijit.byId("accept_legal_text").get("checked"))){_2d=_2d.concat("<accept_legal_text>");_2d=_2d.concat("N");_2d=_2d.concat("</accept_legal_text>");}}_2c.push(_2d);if(_2b){_2c.push("</",_2b,">");}return _2c.join("");}else{return xml;}}});})(dojo,dijit,misys);dojo.require("misys.client.binding.loan.amend_ln_client");}