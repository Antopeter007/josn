/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.binding.bank.report_sr_swift"]){dojo._hasResource["misys.binding.bank.report_sr_swift"]=true;dojo.provide("misys.binding.bank.report_sr_swift");dojo.require("misys.form.common");dojo.require("misys.validation.common");dojo.require("misys.form.file");dojo.require("dijit.form.Form");dojo.require("dijit.form.Button");dojo.require("dijit.form.TextBox");dojo.require("misys.widget.Dialog");dojo.require("dijit.ProgressBar");dojo.require("dijit.form.ValidationTextBox");dojo.require("dijit.form.CheckBox");dojo.require("dijit.layout.ContentPane");dojo.require("dijit.layout.TabContainer");dojo.require("dijit.form.DateTextBox");dojo.require("misys.form.CurrencyTextBox");dojo.require("dijit.form.NumberTextBox");dojo.require("dijit.form.FilteringSelect");dojo.require("misys.form.addons");dojo.require("misys.form.SimpleTextarea");dojo.require("dojo.data.ItemFileReadStore");dojo.require("misys.widget.Collaboration");dojo.require("misys.widget.Amendments");(function(d,dj,m){function _1(){var _2=true,_3=true;var _4,_5,_6,_7,_8,_9="",_a="",_b,_c,_d,_e;if(dj.byId("narrative_description_goods")&&dj.byId("narrative_documents_required")&&dj.byId("narrative_additional_instructions")&&dj.byId("narrative_special_beneficiary")){if(dj.byId("narrative_description_goods")){_4=dj.byId("narrative_description_goods").get("value")!==""?dj.byId("narrative_description_goods").get("value")+"\n":"";}if(dj.byId("narrative_documents_required")){_5=dj.byId("narrative_documents_required").get("value")!==""?dj.byId("narrative_documents_required").get("value")+"\n":"";}if(dj.byId("narrative_additional_instructions")){_6=dj.byId("narrative_additional_instructions").get("value")!==""?dj.byId("narrative_additional_instructions").get("value")+"\n":"";}if(dj.byId("narrative_special_beneficiary")){_7=dj.byId("narrative_special_beneficiary").get("value")!==""?dj.byId("narrative_special_beneficiary").get("value")+"\n":"";}if(dj.byId("narrative_special_recvbank")){_8=dj.byId("narrative_special_recvbank").get("value")!==""?dj.byId("narrative_special_recvbank").get("value")+"\n":"";}if(!m._config.isBank){_9=_4+_5+_6+_7;}else{_9=_4+_5+_6+_7+_8;}if(dj.byId(this.id)){_b=800*this.cols;_a=dj.byId(this.id).get("value")!==""?dj.byId(this.id).get("value")+"\n":"";_c=_a.length;_2=m.validateExtNarrativeSwiftInit2018(_a,true);}_3=m.validateExtNarrativeSwiftInit2018(_9,false);_d=1000*this.cols;_e=_9.length;if(_2){this.invalidMessage=m.getLocalization("invalidFieldSizeError",[_d,_e]);}else{this.invalidMessage=m.getLocalization("invalidSingleFieldLength",[_b,_c]);}return _2&&_3;}};d.mixin(m._config,{xmlTransform:function(_f){var _10="<sr_tnx_record>";if(_f.indexOf(_10)!=-1){var _11=m._config.xmlTagName,_12=_11?["<",_11,">"]:[],_13="</sr_tnx_record>",_14="",_15=-1;_14=_f.substring(_10.length,(_f.length-_13.length));var _16="amd_no";var _17=_f.substring(_f.indexOf("<tnx_type_code>")+("<tnx_type_code>").length,_f.indexOf("</tnx_type_code>"));var _18=_f.substring(_f.indexOf("<prod_stat_code>")+("<prod_stat_code>").length,_f.indexOf("</prod_stat_code>"));var _19=_f.substring(_f.indexOf("<"+_16+">")+("<"+_16+">").length,_f.indexOf("</"+_16+">"));var _1a=["narrative_description_goods","narrative_documents_required","narrative_additional_instructions","narrative_special_beneficiary","narrative_special_recvbank"];var _1b=dj.byId("lc_type")?dj.byId("lc_type").get("value"):"";if(m._config.swift2018Enabled&&(Number(_19)||_18==="08"||_18==="31")){var _1c;var _1d=[m._config.narrativeDescGoodsDataStore,m._config.narrativeDocsReqDataStore,m._config.narrativeAddInstrDataStore,m._config.narrativeSpBeneDataStore,m._config.narrativeSpRecvbankDataStore];var i=0,_1e,_1f,itr=0;for(itr=0;itr<5;itr++){_1c=itr==0?_14.substring(0,_14.indexOf("<"+_1a[itr]+">")):(_1c.indexOf("<"+_1a[itr]+">")>0?_1c.substring(0,_1c.indexOf("<"+_1a[itr]+">")):_1c);if(_14.indexOf("<"+_1a[itr]+">")<0){continue;}i=0;if(_1d[itr]&&_1d[itr].length>0){_1c=_1c.concat("<"+_1a[itr]+">");_1c=_1c.concat("<![CDATA[");_1c=_1c.concat("<amendments>");_1c=_1c.concat("<amendment>");_1c=_1c.concat("<sequence>");_1c=_1c.concat(Number(_19));_1c=_1c.concat("</sequence>");_1c=_1c.concat("<data>");d.forEach(_1d[itr],function(){if(_1d[itr][i]&&_1d[itr][i]!=null){_1e=_1d[itr][i].verb[0];_1f=dojox.html.entities.encode(_1d[itr][i].content[0],dojox.html.entities.html);_1c=_1c.concat("<datum>");_1c=_1c.concat("<id>");_1c=_1c.concat(i);_1c=_1c.concat("</id>");_1c=_1c.concat("<verb>");_1c=_1c.concat(_1e);_1c=_1c.concat("</verb>");_1c=_1c.concat("<text>");_1c=_1c.concat(_1f);_1c=_1c.concat("</text>");_1c=_1c.concat("</datum>");}i++;});_1c=_1c.concat("</data>");_1c=_1c.concat("</amendment>");_1c=_1c.concat("</amendments>");_1c=_1c.concat("]]>");_1c=_1c.concat(_14.substring(_14.indexOf("</"+_1a[itr]+">"),_14.length));}else{_1c=_1c.concat("<"+_1a[itr]+">");_1c=_1c.concat(_14.substring(_14.indexOf("</"+_1a[itr]+">"),_14.length));}}_12.push(_1c);}else{if(m._config.swift2018Enabled&&_17=="01"&&_1b!=="02"){for(itr=0;itr<5;itr++){_1c=itr==0?_14.substring(0,_14.indexOf("<"+_1a[itr]+">")):_1c.substring(0,_1c.indexOf("<"+_1a[itr]+">"));_1c=_1c.concat("<"+_1a[itr]+">");if(dj.byId(_1a[itr])){_1c=_1c.concat("<![CDATA[");_1c=_1c.concat("<issuance>");_1c=_1c.concat("<sequence>");_1c=_1c.concat("0");_1c=_1c.concat("</sequence>");_1c=_1c.concat("<data>");_1c=_1c.concat("<datum>");_1c=_1c.concat("<id>");_1c=_1c.concat("0");_1c=_1c.concat("</id>");_1c=_1c.concat("<verb>");_1c=_1c.concat("ISSUANCE");_1c=_1c.concat("</verb>");_1c=_1c.concat("<text>");_1c=_1c.concat(dojox.html.entities.encode(dj.byId(_1a[itr]).get("value"),dojox.html.entities.html));_1c=_1c.concat("</text>");_1c=_1c.concat("</datum>");_1c=_1c.concat("</data>");_1c=_1c.concat("</issuance>");_1c=_1c.concat("]]>");}_1c=_1c.concat(_14.substring(_14.indexOf("</"+_1a[itr]+">"),_14.length));}_12.push(_1c);}else{_12.push(_14);}}if(_11){_12.push("</",_11,">");}return _12.join("");}else{return _f;}}});d.mixin(m,{_bindSwift2018:function(){m.connect(dj.byId("prod_stat_code"),"onChange",function(){this.validate();m.refreshUIforAmendmentMO();});m.connect("amd_chrg_brn_by_code_1","onClick",m.amendChargesLC);m.connect("amd_chrg_brn_by_code_2","onClick",m.amendChargesLC);m.connect("amd_chrg_brn_by_code_3","onClick",m.amendChargesLC);m.connect("amd_chrg_brn_by_code_4","onClick",m.amendChargesLC);m.setValidation("requested_confirmation_party_iso_code",m.validateBICFormat);m.connect("req_conf_party_flag","onChange",function(){var _20=this.get("value");if(_20=="Advise Thru Bank"||_20=="Other"){document.getElementById("requested-conf-party-bank-details").style.display="block";m.toggleFields(true,["requested_confirmation_party_name","requested_confirmation_party_address_line_1","requested_confirmation_party_address_line_2","requested_confirmation_party_dom","requested_confirmation_party_iso_code"],null,null,true);}else{document.getElementById("requested-conf-party-bank-details").style.display="none";m.toggleFields(false,["requested_confirmation_party_name","requested_confirmation_party_address_line_1","requested_confirmation_party_address_line_2","requested_confirmation_party_dom","requested_confirmation_party_iso_code"],null,null,false);}});m.connect("requested_confirmation_party_iso_code","onChange",function(){var _21=this.get("value");if(_21.length>0){m.setRequiredFields(["requested_confirmation_party_name","requested_confirmation_party_address_line_1"],false);}});m.setValidation("period_presentation_days",m.validatePeriodPresentationDays);if(misys._config.swiftExtendedNarrativeEnabled){m.setValidation("narrative_additional_instructions",_1);m.setValidation("narrative_documents_required",_1);m.setValidation("narrative_description_goods",_1);m.setValidation("narrative_special_beneficiary",_1);if(dj.byId("narrative_special_recvbank")){m.setValidation("narrative_special_recvbank",_1);}}},_onFormLoadSwift2018:function(){if(dj.byId("req_conf_party_flag")){var _22=dj.byId("req_conf_party_flag").value;var _23=m._config.displayMode;if(_23=="edit"&&""!=_22){document.getElementById("requested-conf-party").style.display="block";if(_22=="Advise Thru Bank"||_22=="Other"){document.getElementById("requested-conf-party-bank-details").style.display="block";}}if(_22==""){dj.byId("req_conf_party_flag").set("disabled",true);}}m.refreshUIforAmendmentMO();if(dj.byId("amd_chrg_brn_by_code_4")){if(!dj.byId("amd_chrg_brn_by_code_4").get("value")){var _24=dj.byId("narrative_amend_charges_other");if(_24){_24.set("value","");_24.set("disabled",true);}}}m.toggleNarrativeDivStatus(true,"");},_beforeSubmitValidationsSwift2018:function(){if(dj.byId("adv_send_mode")&&dj.byId("adv_send_mode").get("value")==1&&document.getElementById("tabNarrativeDescriptionGoods")){var _25=false;if(dj.byId("is798")&&dj.byId("is798").get("value")!=""){_25=dj.byId("is798").get("value")=="Y"?true:false;}var _26=[m._config.narrativeDescGoodsDataStore,m._config.narrativeDocsReqDataStore,m._config.narrativeAddInstrDataStore,m._config.narrativeSpBeneDataStore,m._config.narrativeSpRecvbankDataStore];var i,_27=0,_28=0,_29=0,_2a="narrative-details-tabcontainer",_2b=true,_2c;var _2d=dj.byId("swiftregexzcharValue").get("value");var _2e=new RegExp(_2d);m._config.isNarrativeZCharValidArray=[true,true,true,true,true];var _2f=[0,0,0,0,0];m._config.isSingleNarrativeValid=[true,true,true,true,true];var _30=["tabNarrativeDescriptionGoods","tabNarrativeDocumentsRequired","tabNarrativeAdditionalInstructions","tabNarrativeSpecialBeneficiary","tabNarrativeSpecialReceivingBank"];if(document.getElementById("tabNarrativeDescriptionGoods").status==true){for(itr=0;itr<5;itr++){i=0;_2c=true;if(_26&&_26[itr]){d.forEach(_26[itr],function(){if(_26[itr][i]&&_26[itr][i]!==null&&_2c){_26[itr][i].content[0].replace(/&#xa;/g,"\n");_29+=_26[itr][i].content[0].length;_27+=_26[itr][i].text_size[0];_2f[itr]+=_26[itr][i].text_size[0];_2c=_2e.test(_26[itr][i].content[0]);m._config.isNarrativeZCharValidArray[itr]=_2c;}i++;});}if(!m._config.isNarrativeZCharValidArray[itr]||(dojo.some(_2f,function(_31){return _31>(_25?792:800);}))){if(!m._config.isNarrativeZCharValidArray[itr]){m.toggleNarrativeDivStatus(m._config.isNarrativeZCharValidArray[itr],_30[itr]);}else{if(_2f[itr]>(_25?792:800)){m._config.isSingleNarrativeValid[itr]=false;m.toggleNarrativeDivStatus(m._config.isSingleNarrativeValid[itr],_30[itr]);_2b=false;}}}}if(_27>(_25?992:1000)){d.forEach(m._config.isSingleNarrativeValid,function(){m._config.isSingleNarrativeValid[_28]=true;});m.toggleNarrativeDivStatus(false);_2b=false;}}else{if(_27>(_25?992:1000)||document.getElementById("tabNarrativeDescriptionGoods").status==false){_28=0;d.forEach(m._config.isSingleNarrativeValid,function(){m._config.isSingleNarrativeValid[_28]=true;});if(document.getElementById("tabNarrativeDescriptionGoods").status==true){m.toggleNarrativeDivStatus(false);}_2b=false;}}if(!_2b||(dojo.some(m._config.isNarrativeZCharValidArray,function(_32){return _32==false;}))){if(m._config.isNarrativeZCharValidArray.indexOf(false)>3){_2a="narrative-special-payments-beneficiary-tabcontainer";}dojox.fx.smoothScroll({node:document.getElementById(_2a),win:window}).play();return false;}}if(dj.byId("req_conf_party_flag")){if(dj.byId("req_conf_party_flag").get("value")==="Advise Thru Bank"||dj.byId("req_conf_party_flag").get("value")==="Other"){if(!m.validateBankEntry("requested_confirmation_party")){m._config.onSubmitErrorMsg=m.getLocalization("requestedConfirmationPartyError");return false;}else{return true;}}}if(dj.byId("narrative_period_presentation_nosend")&&dj.byId("narrative_period_presentation_nosend").get("value")!==""){var _33=dj.byId("narrative_period_presentation_nosend").get("value");if(_33.indexOf("\n")!=-1){m._config.onSubmitErrorMsg=m.getLocalization("periodOfPresentaionError");return false;}}return true;}});})(dojo,dijit,misys);dojo.require("misys.client.binding.bank.report_sr_swift_client");}