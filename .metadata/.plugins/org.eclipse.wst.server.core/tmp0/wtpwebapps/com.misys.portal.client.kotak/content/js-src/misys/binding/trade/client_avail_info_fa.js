dojo.provide("misys.binding.trade.client_avail_info_fa");
/*
 * ---------------------------------------------------------- Event Binding for
 * 
 * Factor Pro Inquiry , Customer Side.
 * 
 * Copyright (c) 2000-2011 Misys (http://www.misys.com), All Rights Reserved.
 * 
 * version: 1.0 date: 09/06/2011
 * 
 * Author Ramesh M
 * 
 * ----------------------------------------------------------
 */

dojo.require("misys.form.common");
dojo.require("misys.validation.common");
dojo.require("misys.form.file");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.TextBox");
dojo.require("misys.widget.Dialog");
dojo.require("dijit.ProgressBar");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.CheckBox");
dojo.require("dijit.layout.ContentPane");
dojo.require("misys.editor.plugins.ProductFieldChoice");
dojo.require("dojo.data.ItemFileReadStore");
dojo.require("dijit.layout.TabContainer");
dojo.require("dijit.form.DateTextBox");
dojo.require("misys.form.CurrencyTextBox");
dojo.require("dijit.form.FilteringSelect");
dojo.require("misys.form.SimpleTextarea");
dojo.require("dijit.Editor");
dojo.require("dijit._editor.plugins.FontChoice");
dojo.require("dojox.editor.plugins.ToolbarLineBreak");
dojo.require("misys.widget.Collaboration");
dojo.require("misys.form.static_document");

(function(/* Dojo */d, /* Dijit */dj, /* Misys */m) {
	
	d.mixin(m, {
		viewExposureEnquiry : function(){
			m.animate('fadeOut', d.byId("clientActInfo"), function(){});
			m.animate('fadeIn', d.byId("clientExpoInfo"), function(){});
			dojo.query('#GTPRootPortlet .portlet-title')[0].innerHTML = m.getLocalization("FAClientExpoTitleMessage");
		},
		hideDebtorDetails : function(){
			m.animate('fadeOut', d.byId("clientExpoInfo"), function(){});
			m.animate('fadeIn', d.byId("clientActInfo"), function(){});
			dojo.query('#GTPRootPortlet .portlet-title')[0].innerHTML =  m.getLocalization("FAClientAvailTitleMessage");
		},
		bind : function() {
		}, 
	onFormLoad : function() {	
			m.animate('fadeOut', d.byId("clientExpoInfo"), function(){});
			dojo.query('#GTPRootPortlet .portlet-title')[0].innerHTML = m.getLocalization("FAClientAvailTitleMessage");
	}
	});
	})(dojo, dijit, misys);	//Including the client specific implementation
       dojo.require('misys.client.binding.trade.client_avail_info_fa_client');