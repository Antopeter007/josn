/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.binding.cash.TradeMessageXoBinding"]){dojo._hasResource["misys.binding.cash.TradeMessageXoBinding"]=true;dojo.provide("misys.binding.cash.TradeMessageXoBinding");dojo.require("dojo.parser");dojo.require("dojo.data.ItemFileReadStore");dojo.require("dijit.form.Form");dojo.require("dijit.form.Button");dojo.require("dijit.form.TextBox");dojo.require("dijit.form.ValidationTextBox");dojo.require("dijit.form.CheckBox");dojo.require("dijit.form.DateTextBox");dojo.require("dijit.form.TimeTextBox");dojo.require("misys.form.CurrencyTextBox");dojo.require("dijit.form.NumberTextBox");dojo.require("dijit.form.FilteringSelect");dojo.require("misys.widget.Dialog");dojo.require("dijit.layout.ContentPane");dojo.require("dijit.ProgressBar");dojo.require("misys.form.common");dojo.require("misys.validation.common");dojo.require("misys.form.SimpleTextarea");dojo.require("misys.form.DateTermField");dojo.require("misys.binding.cash.XoActions");var tabIdRequiredUpdate=["expiration_code","expiration_date","counter_cur_code","fx_cur_code","fx_amt","value_date","value_code"];var tabIdRequiredCancel=["reason"];fncDoBinding=function(){fncCommonBindingRules();misys.connect("sub_tnx_type_code","onChange",function(){_fncToggleAction(this.get("value"));});};fncDoFormOnLoadEvents=function(){if(dijit.byId("expiration_code").get("value")!="EXPDAT/TIM"){fncExpirationCodeChange();}fncMarketOrderChange();};function _fncToggleAction(_1){misys.animate("fadeOut",dojo.byId("update-details"));misys.animate("fadeOut",dojo.byId("cancel-details"));if(_1=="18"){misys.animate("fadeIn",dojo.byId("update-details"));dojo.forEach(tabIdRequiredUpdate,function(_2){misys.toggleRequired(_2,true);});dojo.forEach(tabIdRequiredCancel,function(_3){misys.toggleRequired(_3,false);});}else{if(_1=="22"){dojo.forEach(tabIdRequiredUpdate,function(_4){misys.toggleRequired(_4,false);});dojo.forEach(tabIdRequiredCancel,function(_5){misys.toggleRequired(_5,true);});misys.animate("fadeIn",dojo.byId("cancel-details"));}else{dojo.forEach(tabIdRequiredUpdate,function(_6){misys.toggleRequired(_6,false);});dojo.forEach(tabIdRequiredCancel,function(_7){misys.toggleRequired(_7,false);});}}};dojo.require("misys.client.binding.cash.TradeMessageXoBinding_client");}