/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.binding.trade.select_tf"]){dojo._hasResource["misys.binding.trade.select_tf"]=true;dojo.provide("misys.binding.trade.select_tf");dojo.require("dijit.form.FilteringSelect");dojo.require("dijit.form.Form");dojo.require("misys.form.file");dojo.require("dijit.form.Button");dojo.require("dijit.form.TextBox");dojo.require("misys.widget.Dialog");dojo.require("dijit.ProgressBar");dojo.require("dijit.form.ValidationTextBox");dojo.require("dijit.layout.ContentPane");dojo.require("misys.form.common");dojo.require("misys.widget.Collaboration");dojo.require("misys.validation.common");(function(d,dj,m){d.mixin(m,{select:function(_1){switch(_1){case "OK":var _2=dj.byId("sub_product_code").get("value");if(_2!=""){dj.byId("realform_featureid").set("value",_2);dj.byId("realform").submit();}else{m.dialog.show("ERROR",m.getLocalization("mustChooseFinanceType"));}break;case "CANCEL":document.location.href=m._config.homeUrl;return;break;default:break;}},onBeforeLoad:function(){m.excludedMethods.push({object:m,method:"select"});}});})(dojo,dijit,misys);dojo.require("misys.client.binding.trade.select_tf_client");}