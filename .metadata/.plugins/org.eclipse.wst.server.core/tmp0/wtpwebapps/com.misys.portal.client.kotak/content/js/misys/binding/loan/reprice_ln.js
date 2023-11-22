/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.binding.loan.reprice_ln"]){dojo._hasResource["misys.binding.loan.reprice_ln"]=true;dojo.provide("misys.binding.loan.reprice_ln");dojo.require("dojo.parser");dojo.require("dijit.layout.TabContainer");dojo.require("dijit.form.DateTextBox");dojo.require("misys.form.CurrencyTextBox");dojo.require("dijit.form.NumberTextBox");dojo.require("dijit.form.FilteringSelect");dojo.require("dijit.form.Form");dojo.require("dijit.form.Button");dojo.require("dijit.form.TextBox");dojo.require("misys.widget.Dialog");dojo.require("dijit.ProgressBar");dojo.require("dijit.form.ValidationTextBox");dojo.require("dijit.form.CheckBox");dojo.require("dojo.data.ItemFileReadStore");dojo.require("misys.form.file");dojo.require("misys.form.SimpleTextarea");dojo.require("misys.form.common");dojo.require("misys.validation.common");dojo.require("misys.widget.Collaboration");dojo.require("misys.binding.SessionTimer");dojo.require("dojox.xml.DomParser");(function(d,dj,m){function _1(){if(this.get("value")==null){return true;}var _2=dj.byId(this.id);var _3=dijit.byId("facility_maturity_date");if(!m.compareDateFields(_2,_3)){this.invalidMessage=misys.getLocalization("loanMatDateGreaterThanFacMatDateError",[m.getLocalizeDisplayDate(this),m.getLocalizeDisplayDate(_3)]);return false;}var _4=dijit.byId("effective_date");if(!m.compareDateFields(_4,_2)){this.invalidMessage=misys.getLocalization("loanMatDateLessThanLoanEffDateError",[m.getLocalizeDisplayDate(this),m.getLocalizeDisplayDate(_4)]);return false;}return true;};function _5(){var _6=dj.byId(this.id);var _7=this;var _8;_6.store.fetch({query:{id:_6.get("value")},onItem:function(_9){_8=parseFloat(_9.limitAmount[0]);}});var _a=dj.byId("risk_type");var _b;if(_8){var _c=dj.byId("ln_cur_code");var _d=dj.byId("ln_amt");var _e=parseFloat(_d.get("value"));if(_e>_8&&_a&&_a.get("value")!==""){if(misys._config.warnFacilityAmtExceeded){misys._config.warningMessages=[];misys._config.warningMessages.push(m.getLocalization("loanFacilityAmtExceeded"));return true;}else{_7.invalidMessage=m.getLocalization("loanRepricingAmountBigThanBorrowerCcyLimitAmtError",[_c.get("value"),_8]);}return false;}else{misys._config.warningMessages=[];return true;}}};function _f(){if(this.get("value")==null){return true;}var _10=dj.byId(this.id);var _11=dijit.byId("effective_date");if(!m.compareDateFields(_11,_10)){this.invalidMessage=misys.getLocalization("loanRepricingDateGreaterThanLoanEffDateError",[m.getLocalizeDisplayDate(this),m.getLocalizeDisplayDate(_11)]);return false;}var _12=dijit.byId("ln_maturity_date");if(!m.compareDateFields(_10,_12)){this.invalidMessage=misys.getLocalization("loanRepricingDateLessThanLoanMatDateError",[m.getLocalizeDisplayDate(this),m.getLocalizeDisplayDate(_12)]);return false;}var _13=dijit.byId("facility_maturity_date");if(!m.compareDateFields(_10,_13)){this.invalidMessage=misys.getLocalization("loanRepricingDateLessThanFacMatDateError",[m.getLocalizeDisplayDate(this),m.getLocalizeDisplayDate(_13)]);return false;}return true;};function _14(){var _15=dijit.byId("pricing_option");var _16=dijit.byId("repricing_frequency");var _17=dj.byId("bo_facility_id").get("value");if(_17){var _18=JSON.parse(misys._config.repricingFrequenciesStores[_17]);_16.set("value","");var _19=_15.get("value");var _1a=_18[_19];if(_1a){_16.set("store",new dojo.data.ItemFileReadStore(_1a));var _1b=0;var _1c=function(_1d,_1e){_1b=_1d;};_16.get("store").fetch({query:{},onBegin:_1c,start:0,count:0});if(_1b==0){misys.toggleRequired("repricing_frequency",false);misys.toggleRequired("repricing_date",false);dj.byId("repricing_date").set("displayedValue","");dj.byId("repricing_date").set("disabled",true);dj.byId("repricing_frequency").set("disabled",true);}else{dj.byId("repricing_frequency").set("disabled",false);misys.toggleRequired("repricing_frequency",true);dj.byId("repricing_date").set("disabled",false);misys.toggleRequired("repricing_date",true);if(dj.byId("repricing_frequency_view")&&dj.byId("repricing_frequency_view").get("value")){dj.byId("repricing_frequency").set("value",dj.byId("repricing_frequency_view").get("value"));_1f();dj.byId("repricing_frequency_view").set("value","");}}}else{dj.byId("repricing_date").set("displayedValue","");}}};function _20(_21){var _22=dijit.byId("pricing_option").get("value");dj.byId("ln_maturity_date").set("disabled",true);if(_22){if(misys._config.maturityMandatoryOptions&&misys._config.maturityMandatoryOptions.data&&misys._config.maturityMandatoryOptions.data.items){dojo.forEach(misys._config.maturityMandatoryOptions.data.items,function(_23){if(_22===_23.id[0]){if(_23.maturityDateMandatory[0]==="Y"){dj.byId("ln_maturity_date").set("disabled",false);m.toggleRequired("ln_maturity_date",true);if(!dj.byId("ln_maturity_date").get("value")&&dj.byId("facility_maturity_date")){dj.byId("ln_maturity_date").set("displayedValue",dj.byId("facility_maturity_date").get("value"));}}else{if(_21){dj.byId("ln_maturity_date").set("displayedValue","");}m.toggleRequired("ln_maturity_date",false);dj.byId("ln_maturity_date").set("disabled",true);}if(dj.byId("match_funding")){if(_23.matchFundedIndicator[0]&&_23.matchFundedIndicator[0]==="Y"){dj.byId("match_funding").set("value","Y");}else{dj.byId("match_funding").set("value","N");}}}});}}else{dj.byId("ln_maturity_date").set("displayedValue","");}};function _24(){var _25=dijit.byId("gridRepricingLoanTransactions");var _26=0;if(_25&&_25.store){_25.store.fetch({query:{loan_ref_id:"*"},onComplete:dojo.hitch(this,function(_27,_28){d.forEach(_27,function(_29){_26=parseFloat(_26)+parseFloat(_29.loan_outstanding_amt[0].split(",").join(""));},this);})});dj.byId("ln_amt").set("value",_26);}};function _2a(){var _2b=dj.byId("bo_facility_id");var _2c=dj.byId("borrower_available_amt");var _2d=dijit.byId("gridRepricingLoanTransactions");var _2e=dj.byId("borrower_available_cur_code");var _2f;var _30;var _31;if(misys._config["currencyLimitAmount"]){_2f=parseFloat(misys._config["currencyLimitAmount"]);}if(misys._config["repricedCurrencyEqvLimitAmount"]){_30=parseFloat(misys._config["repricedCurrencyEqvLimitAmount"]);}if(misys._config["borrowerAvailableLimitAmount"]){_31=parseFloat(misys._config["borrowerAvailableLimitAmount"]);}var _32;var _33=0;if(_2d&&_2d.store&&_2b&&_2b.get("value")!==""){_2d.store.fetch({query:{loan_facility_id:_2b.get("value")},onComplete:dojo.hitch(this,function(_34,_35){d.forEach(_34,function(_36){_33=parseFloat(_33)+parseFloat(_36.loan_outstanding_amt[0].split(",").join(""));},this);})});}if(_2c){var _37=dj.byId("ln_cur_code");var _38=dj.byId("ln_amt");var _39=parseFloat(_38.get("value"));var _3a=_2e?_2e.get("value"):"";var _3b;if(_37&&_30&&_3a!==""&&(_37.get("value")!==_3a)){_3b=_30;}else{_3b=_2c.get("value");}var _3c=_39-_33;if(_3c>_3b&&_2b&&_2b.get("value")!==""){if(misys._config.warnFacilityAmtExceeded){misys._config.warningMessages=[];misys._config.warningMessages.push(m.getLocalization("loanFacilityAmtExceeded"));return true;}else{_32=m.getLocalization("loanRepricingAmountTooBigError",[_37.get("value"),_3b]);_2b.focus();_2b.set("value","");_2b.set("state","Error");dj.hideTooltip(_2b.domNode);dj.showTooltip(_32,_2b.domNode,0);}return false;}else{if(_2f&&(_39>_2f&&_2b&&_2b.get("value")!=="")){if(misys._config.warnFacilityAmtExceeded){misys._config.warningMessages=[];misys._config.warningMessages.push(m.getLocalization("loanBorrowerCcyLimtAmtExceeded"));return true;}else{_32=m.getLocalization("loanRepricingAmountTooBigForCurrencyError",[_37.get("value"),_2f,_2b.get("displayedValue")]);_2b.focus();_2b.set("value","");_2b.set("state","Error");dj.hideTooltip(_2b.domNode);dj.showTooltip(_32,_2b.domNode,0);}return false;}else{if(_31&&(_39>_31&&_2b&&_2b.get("value")!=="")){if(misys._config.warnFacilityAmtExceeded){misys._config.warningMessages=[];misys._config.warningMessages.push(m.getLocalization("loanBorrowerLevelLimtAmtExceeded"));return true;}else{_32=m.getLocalization("loanRepricingAmountTooBigForBorrowerError",[_37.get("value"),_31]);_2b.focus();_2b.set("value","");_2b.set("state","Error");dj.hideTooltip(_2b.domNode);dj.showTooltip(_32,_2b.domNode,0);}return false;}else{misys._config.warningMessages=[];return true;}}}}};function _3d(_3e){var _3f=dj.byId("repricing_frequency");if(_3e.get("value")&&_3f.get("value")){var _40=_3f.get("value"),_41,_42,_43;if(_40.length>0){_41=_40.substring(0,_40.length-1);_42=_40.substring(_40.length-1,_40.length);}if(_42==="W"){_43="week";}else{if(_42==="M"){_43="month";}else{if(_42==="Y"){_43="year";}else{if(_42==="D"){_43="day";}}}}return dojo.date.add(_3e.get("value"),_43,parseInt(_41,10));}};function _44(){var _45=dj.byId("repricing_date");var _46=dj.byId("effective_date");var _47=dj.byId("repricing_frequency");if(_46.get("value")&&_47.get("value")){_45.set("displayedValue","");_45.set("value",_3d(_46));}};function _1f(){var _48=dj.byId("effective_date");var _49=_3d(_48);var _4a=dj.byId("repricing_date").get("value");if(_4a.getDate()===_49.getDate()&&_4a.getMonth()===_49.getMonth()&&_4a.getYear()===_49.getYear()){misys.toggleRequired("repricing_frequency",true);dj.byId("repricing_frequency").set("disabled",false);}else{misys.toggleRequired("repricing_frequency",false);dj.byId("repricing_frequency").set("disabled",true);}};function _4b(){var _4c=dj.byId("bo_facility_id").get("value");var _4d=["bo_facility_name","facility_effective_date","facility_expiry_date","facility_maturity_date","fcn"];var _4e=["fcn_view_row","facility_effective_date_view_row","facility_expiry_date_view_row","facility_maturity_date_view_row","borrower_limit_view_row","borrower_available_view_row"];d.forEach(_4d,function(_4f){if(dj.byId(_4f)){dj.byId(_4f).set("value","");dj.byId(_4f).set("displayedValue","");}});d.forEach(_4e,function(_50){if(d.byId(_50)&&dojo.query("#"+_50+" > .content")&&dojo.query("#"+_50+" > .content")[0]){dojo.query("#"+_50+" > .content")[0].innerHTML="";}});var _51=dijit.byId("pricing_option"),_52=dijit.byId("risk_type");_51.set("value","");_51.set("store",null);_52.set("value","");_52.set("store",null);if(_4c){m._config.facilitiesStore.fetch({query:{id:_4c},onComplete:d.hitch(this,function(_53,_54){var _55=_53[0];dj.byId("bo_facility_name").set("value",_55.name[0]);dj.byId("facility_effective_date").set("displayedValue",_55.effectiveDate[0]);dj.byId("facility_expiry_date").set("displayedValue",_55.expiryDate[0]);dj.byId("facility_maturity_date").set("displayedValue",_55.maturityDate[0]);dj.byId("fcn").set("value",_55.fcn[0]);dojo.query("#fcn_view_row > .content")[0].innerHTML=_55.fcn[0];dojo.query("#facility_effective_date_view_row > .content")[0].innerHTML=_55.effectiveDate[0];dojo.query("#facility_expiry_date_view_row > .content")[0].innerHTML=_55.expiryDate[0];dojo.query("#facility_maturity_date_view_row > .content")[0].innerHTML=_55.maturityDate[0];if(d.byId("borrower_limit_view_row")){dj.byId("borrower_limit_cur_code").set("value",_55.mainCurrency[0]);dj.byId("borrower_limit_amt").set("value",_55.globalLimitAmount[0]);misys.setCurrency(dijit.byId("borrower_limit_cur_code"),["borrower_limit_amt"]);dojo.query("#borrower_limit_view_row > .content")[0].innerHTML=_55.mainCurrency[0]+" "+dj.byId("borrower_limit_amt").get("displayedValue");}if(d.byId("borrower_available_view_row")){dj.byId("borrower_available_cur_code").set("value",_55.mainCurrency[0]);dj.byId("borrower_available_amt").set("value",_55.globalLimitAmount[0]);misys.setCurrency(dijit.byId("borrower_available_cur_code"),["borrower_available_amt"]);dojo.query("#borrower_available_view_row > .content")[0].innerHTML=_55.mainCurrency[0]+" "+dj.byId("borrower_available_amt").get("displayedValue");dj.byId("borrower_available_amt").set("value",_55.globalAvailableAmount[0]);misys.setCurrency(dijit.byId("borrower_available_cur_code"),["borrower_available_amt"]);dojo.query("#borrower_available_view_row > .content")[0].innerHTML=_55.mainCurrency[0]+" "+dj.byId("borrower_available_amt").get("displayedValue");if(_55.currencyLimitAmount){var _56=_55.currencyLimitAmount[0];misys._config["currencyLimitAmount"]=_56;}if(_55.repricedCurrencyEqvLimitAmount){var _57=_55.repricedCurrencyEqvLimitAmount[0];misys._config["repricedCurrencyEqvLimitAmount"]=_57;}if(_55.borrowerAvailableLimitAmount){var _58=_55.borrowerAvailableLimitAmount[0];misys._config["borrowerAvailableLimitAmount"]=_58;}}})});d.style(d.byId("facilityDependentFields"),"display","block");var _59=JSON.parse(misys._config.pricingOptionsStores[_4c]);if(_59){_51.set("store",new dojo.data.ItemFileReadStore(_59));misys._config.maturityMandatoryOptions=_59;misys._config.matchFundingOfPricingOption=_59;}var _5a=JSON.parse(misys._config.riskTypesStores[_4c]);if(_5a){_52.set("store",new dojo.data.ItemFileReadStore(_5a));}}else{d.style(d.byId("facilityDependentFields"),"display","none");misys.toggleRequired("repricing_frequency",false);misys.toggleRequired("repricing_date",false);misys.toggleRequired("ln_maturity_date",false);dj.byId("repricing_date").set("displayedValue","");dj.byId("repricing_frequency").set("displayedValue","");dj.byId("repricing_date").set("disabled",true);dj.byId("repricing_frequency").set("disabled",true);}};function _5b(){var _5c=dijit.byId("ref_id");var _5d=dijit.byId("gridRepricingLoanTransactions");var _5e="",_5f=true,_60;if(_5d&&_5d.store){_5d.store.fetch({query:{loan_ref_id:"*"},onComplete:dojo.hitch(this,function(_61,_62){d.forEach(_61,function(_63){_5e=_5e.concat(_63.loan_ref_id[0]);_5e=_5e.concat(",");},this);})});}m.xhrPost({url:m.getServletURL("/screen/AjaxScreen/action/ValidateRepricingTransaction"),handleAs:"json",preventCache:true,sync:true,content:{ref_id:_5c.get("value"),linkedLoans:_5e},load:function(_64,_65){_5f=_64.isValid;_60=_64.errorMsg;},error:function(_66,_67){console.error(" processRepricingOfRecords error",_66);}});if(!_5f){m._config.onSubmitErrorMsg=_60;return false;}else{return true;}};d.mixin(m._config,{initReAuthParams:function(){var _68={productCode:"LN",subProductCode:"",transactionTypeCode:"01",entity:dj.byId("entity")?dj.byId("entity").get("value"):"",currency:"",amount:"",es_field1:"",es_field2:""};return _68;}});d.mixin(m,{bind:function(){misys.setValidation("ln_maturity_date",_1);misys.setValidation("repricing_date",_f);m.connect("bo_facility_id","onChange",_4b);m.connect("bo_facility_id","onBlur",_2a);misys.connect("pricing_option","onChange",_14);m.connect("pricing_option","onChange",_20);m.connect("repricing_frequency","onChange",_44);m.connect("ln_maturity_date","onChange",_44);m.connect("repricing_date","onChange",_1f);m.connect("ln_amt","onChange",_2a);m.setValidation("risk_type",_5);},onFormLoad:function(){_4b();var _69=dj.byId("bo_facility_id");if(_69&&_69.get("value")){if(dj.byId("pricing_option_view")&&dj.byId("pricing_option_view").get("value")){dj.byId("pricing_option").set("value",dj.byId("pricing_option_view").get("value"));}if(dj.byId("risk_type_view")&&dj.byId("risk_type_view").get("value")){dj.byId("risk_type").set("value",dj.byId("risk_type_view").get("value"));}}if(dijit.byId("pricing_option")&&!dijit.byId("pricing_option").get("value")){dijit.byId("repricing_frequency").set("disabled",true);misys.toggleRequired("repricing_frequency",false);dijit.byId("repricing_date").set("disabled",true);misys.toggleRequired("repricing_date",false);}_24();},beforeSaveValidations:function(){var _6a=dj.byId("entity");if(_6a&&_6a.get("value")===""){return false;}else{if(!_5b()){return false;}return true;}},beforeSubmitValidations:function(){_2a();if(!(_5b())){return false;}return true;},formatLinkedLoanDeleteActions:function(_6b){var _6c=dojo.create("div");var div=dojo.create("div",{"class":"gridActions"},_6c);dojo.create("img",{"src":misys.getContextualURL(misys._config.imagesSrc+m._config.imageStore.deleteIcon),"alt":"Delete","border":"0","type":"remove","onclick":"misys.deleteLinkedLoans(\""+_6b.ref_id+"\")"},div);return _6c.innerHTML;},getLinkedLoansAction:function(_6d,_6e){if(!_6e){return this.defaultValue;}return {ref_id:this.grid.store.getValue(_6e,"loan_ref_id")};},formatLinkedLoanPreviewActions:function(_6f){var _70=dojo.create("a");var id=""+_6f.ref_id+"_details_link";var _71="javascript:misys.popup.showReporting (\"FULL\",\"LN\",\""+_6f.ref_id+"\")";var _72=dojo.create("a",{"id":id,"href":_71},_70);dojo.create("img",{"src":misys.getContextualURL(misys._config.imagesSrc+"preview_large.png"),"alt":"Details of the file","border":"0"},_72);return _70.innerHTML;},deleteLinkedLoans:function(_73){var _74=dijit.byId("gridRepricingLoanTransactions");if(_74&&_74.store){var _75=0;var _76=function(_77,_78){_75=_77;};_74.get("store").fetch({query:{},onBegin:_76,start:0,count:0});if(_75>1){var _79=function(){_74.store.fetch({query:{loan_ref_id:_73},onComplete:dojo.hitch(this,function(_7a,_7b){dojo.forEach(_7a,function(_7c){_74.store.deleteItem(_7c);},this);})});_74.store.save();_24();};m.dialog.show("CONFIRMATION",misys.getLocalization("linkedLoanDeleteAction",[_73]),"",null,null,"",_79);}else{m.dialog.show("CONFIRMATION",misys.getLocalization("lastLoanInlinkedLoanDeleteAction",[_73]));}}}});m._config=m._config||{};d.mixin(m._config,{xmlTransform:function(xml){var _7d=m._config.xmlTagName,_7e=_7d?["<",_7d,">"]:[];var dom=dojox.xml.DomParser.parse(xml);if(xml.indexOf(_7d)!=-1){var _7f=xml.substring(_7d.length+2,(xml.length-_7d.length-3));var _80=dijit.byId("gridRepricingLoanTransactions");if(_80&&_80.store){var _81="";_81=_81.concat("<linked_loans>");_80.store.fetch({query:{loan_ref_id:"*"},onComplete:dojo.hitch(this,function(_82,_83){d.forEach(_82,function(_84){_81=_81.concat("<loan_ref_id>");_81=_81.concat(_84.loan_ref_id[0]);_81=_81.concat("</loan_ref_id>");},this);})});_81=_81.concat("</linked_loans>");}_7f=_7f.concat(_81);_7e.push(_7f);if(_7d){_7e.push("</",_7d,">");}return _7e.join("");}else{return xml;}}});})(dojo,dijit,misys);dojo.require("misys.client.binding.loan.reprice_ln_client");}