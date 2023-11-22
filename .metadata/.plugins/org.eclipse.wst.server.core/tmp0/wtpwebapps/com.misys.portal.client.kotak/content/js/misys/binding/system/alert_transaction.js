/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.binding.system.alert_transaction"]){dojo._hasResource["misys.binding.system.alert_transaction"]=true;dojo.provide("misys.binding.system.alert_transaction");dojo.require("dijit.form.Form");dojo.require("dijit.form.Button");dojo.require("dijit.form.FilteringSelect");dojo.require("dijit.form.TextBox");dojo.require("dijit.form.RadioButton");dojo.require("dijit.form.ValidationTextBox");dojo.require("misys.widget.Dialog");dojo.require("dijit.TooltipDialog");dojo.require("dojo.data.ItemFileWriteStore");dojo.require("misys.binding.cash.request.AccountPopup");dojo.require("misys.form.addons");dojo.require("misys.form.common");dojo.require("misys.validation.common");(function(d,dj,m){function _1(_2){var _3=dj.byId("issuer_abbv_name"+_2+"_1"),_4=dj.byId("issuer_abbv_name"+_2+"_2"),_5=dj.byId("issuer_abbv_name"+_2+"_3"),_6=dj.byId("issuer_abbv_name"+_2+"_4");if(!_3){return true;}if(!_3.get("checked")&&!_4.get("checked")&&!_5.get("checked")&&!_6.get("checked")){m.showTooltip(m.getLocalization("recipientMandatory"),_3.domNode,["before"]);return false;}return true;};d.mixin(m._config,{emailAccountPopupFirstOpening:true,smsAccountPopupFirstOpening:true,onlineAccountPopupFirstOpening:true});d.mixin(m,{bind:function(){m.connect("account_num01_img","onClick",function(){fncOpenAccountPopup("emailAccount","ACT_BALANCE_ALERT");});m.connect("account_num02_img","onClick",function(){fncOpenAccountPopup("smsAccount","ACT_BALANCE_ALERT");});m.connect("account_num03_img","onClick",function(){fncOpenAccountPopup("onlineAccount","ACT_BALANCE_ALERT");});m.setValidation("address01",m.validateEmailAddr);},populateAccountFields:function(_7,_8){switch(_7){case "emailAccount":dj.byId("account_num01").set("value",_8.account_no);dj.byId("debit01_cur_code").set("value",_8.cur_code);dj.byId("credit01_cur_code").set("value",_8.cur_code);dj.byId("bank_abbv_name01").set("value",_8.bank_abbv_name);break;case "smsAccount":dj.byId("account_num02").set("value",_8.account_no);dj.byId("debit02_cur_code").set("value",_8.cur_code);dj.byId("credit02_cur_code").set("value",_8.cur_code);dj.byId("bank_abbv_name02").set("value",_8.bank_abbv_name);break;case "onlineAccount":dj.byId("account_num03").set("value",_8.account_no);dj.byId("debit03_cur_code").set("value",_8.cur_code);dj.byId("credit03_cur_code").set("value",_8.cur_code);dj.byId("bank_abbv_name03").set("value",_8.bank_abbv_name);break;default:break;}},getAccountLabel:function(_9,_a){return _a.account_num;},getCredit:function(_b,_c){return _c.credit_cur+" "+_c.credit_amt;},getDebit:function(_d,_e){return _e.debit_cur+" "+_e.debit_amt;},getAddressLabel:function(_f,_10){return _10.address;}});m.dialog=m.dialog||{};d.mixin(m.dialog,{submitTransactionAlert:function(_11,_12){var _13=dj.byId(_11);if(_13&&_13.validate()&&_1(_12)){_13.execute();_13.hide();}}});d.ready(function(){d.require("misys.admin.widget.AlertsTransaction");d.require("misys.admin.widget.AlertTransaction");});})(dojo,dijit,misys);dojo.require("misys.client.binding.system.alert_transaction_client");}