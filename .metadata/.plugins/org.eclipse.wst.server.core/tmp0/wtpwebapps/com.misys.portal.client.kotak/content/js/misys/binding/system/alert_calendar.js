/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.binding.system.alert_calendar"]){dojo._hasResource["misys.binding.system.alert_calendar"]=true;dojo.provide("misys.binding.system.alert_calendar");dojo.require("misys.form.addons");dojo.require("misys.form.common");dojo.require("misys.validation.common");dojo.require("dijit.form.Form");dojo.require("dijit.form.Button");dojo.require("dijit.form.FilteringSelect");dojo.require("dijit.form.TextBox");dojo.require("dijit.form.RadioButton");dojo.require("dijit.form.ValidationTextBox");dojo.require("misys.widget.Dialog");dojo.require("dijit.TooltipDialog");dojo.require("dojo.data.ItemFileWriteStore");(function(d,dj,m){d.mixin(m._config,{initReAuthParams:function(){var _1={productCode:"CA",subProductCode:"",transactionTypeCode:"01",entity:"",currency:"",amount:"",es_field1:"",es_field2:""};return _1;}});function _2(_3){var _4=dj.byId("issuer_abbv_name"+_3+"_1"),_5=dj.byId("issuer_abbv_name"+_3+"_2"),_6=dj.byId("issuer_abbv_name"+_3+"_3"),_7=dj.byId("issuer_abbv_name"+_3+"_4");if(!_4){return true;}if(!_4.get("checked")&&!_5.get("checked")&&!_6.get("checked")&&!_7.get("checked")){m.showTooltip(m.getLocalization("recipientMandatory"),_4.domNode,["before"]);return false;}return true;};function _8(){if(dj.byId("offset01")){var _9=dj.byId("offset01");if(!isNaN(dj.byId("offset01").get("value"))){if(!(dj.byId("offsetsign01_0").get("checked")||dj.byId("offsetsign01_1").get("checked"))){m.showTooltip(m.getLocalization("offsetMandatory"),dj.byId("offsetsign01_0").domNode,["before"]);return false;}}}return true;};function _a(_b,_c){var _d=[],_e=[],_f=[],_10="";if(dj.byId("date_code"+_c)){var _11={"identifier":"id","items":[]},_12=new dojo.data.ItemFileWriteStore({data:_11});_10=dj.byId("date_code"+_c);_10.store=null;if(misys._config&&misys._config.productDates&&misys._config.productDates[_b]){_f=misys._config.productDates[_b];}dojo.forEach(_f,function(_13,_14){var _15=_13.split(";");_d[_14]=_15[0];_e[_14]=_15[1];});for(var j=0;j<_d.length;j++){_12.newItem({"id":_d[j],"name":_e[j]});}_10.store=_12;if(misys._config.currentSelectedCalendarAlertItem&&misys._config.currentSelectedCalendarAlertItem!==null){_10.set("value",misys._config.currentSelectedCalendarAlertItem.date_code);misys._config.currentSelectedCalendarAlertItem=null;}else{_10.set("value",null);}}};d.mixin(m,{bind:function(){m.setValidation("address01",m.validateEmailAddr);m.setValidation("address02",m.validatePhoneOrFax);m.connect("issuer_abbv_name01_4","onChange",function(){m.toggleFields(this.get("checked"),["alertlanguage01","address01"],["alertlanguage01","address01"]);if(this.get("value")=="*"){m.animate("fadeIn",d.byId("language-address-id-01"));}else{m.animate("fadeOut",d.byId("language-address-id-01"));}});m.connect("issuer_abbv_name02_4","onChange",function(){m.toggleFields((this.get("value")==="*"),["alertlanguage02","address02"],["alertlanguage02","address02"]);if(this.get("value")=="*"){m.animate("fadeIn",d.byId("language-address-id-02"));}else{m.animate("fadeOut",d.byId("language-address-id-02"));}});m.connect("offsetsign01_0","onClick",function(){var _16=dj.byId("offset01");if(dj.byId("offsetsign01_0").get("checked")){_16.attr("required",true);}});m.connect("offsetsign01_1","onClick",function(){var _17=dj.byId("offset01");if(dj.byId("offsetsign01_1").get("checked")){_17.attr("required",true);}});d.query("input[id^=\"prod_code\"]").forEach(function(_18){m.connect(_18.id,"onChange",function(){_a(dj.byId(_18.id).get("value"),_18.id.substring("prod_code".length));});});},getProductLabel:function(_19,_1a){if(!_1a){return "*";}if((m._config.productsCollection[_1a.prod_code])){return m._config.productsCollection[_1a.prod_code];}return "*";},getAddressLabel:function(_1b,_1c){if(!_1c){return "*";}return _1c.issuer_abbv_name!="*"?m._config.recipientCollection[_1c.issuer_abbv_name]:_1c.address;},getDateLabel:function(_1d,_1e){if(!_1e){return "*";}var _1f=_1e.offsetsign;_1f=_1e.offsetsign=="0"?"-":"+";return m._config.datesCollection[_1e.date_code]+" ("+_1f+_1e.offset+")";}});m.dialog=m.dialog||{};d.mixin(m.dialog,{submitCalendarAlert:function(_20,_21){var _22=dj.byId(_20);if(!(dj.byId("offsetsign01_0").get("checked")||dj.byId("offsetsign01_1").get("checked"))){dj.byId("offset01").attr("required",false);}if(_22&&_22.validate()&&_8()&&_2(_21)){_22.execute();_22.hide();m.isFormDirty=true;}}});function _23(_24){var _25=dj.byId(_24);_25.fetchProperties={sort:[{attribute:"name"}]};};d.ready(function(){d.require("misys.admin.widget.AlertsCalendar");d.require("misys.admin.widget.AlertCalendar");d.require("misys.admin.widget.AlertCalendarEntity");});d.subscribe("ready",function(){if(dijit.byId("prod_code01")){_23("prod_code01");}if(dijit.byId("prod_code02")){_23("prod_code02");}if(dijit.byId("tnx_type_code01")){_23("tnx_type_code01");}if(dijit.byId("tnx_type_code02")){_23("tnx_type_code02");}if(dijit.byId("prod_stat_code01")){_23("prod_stat_code01");}if(dijit.byId("prod_stat_code02")){_23("prod_stat_code02");}if(dijit.byId("date_code01")){_23("date_code01");}if(dijit.byId("date_code02")){_23("date_code02");}});})(dojo,dijit,misys);dojo.require("misys.client.binding.system.alert_calendar_client");}