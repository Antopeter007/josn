dojo.provide("misys.binding.loan.ln_facility_outstanding_details");

dojo.require("dojo.parser");
dojo.require("dijit.layout.TabContainer");
dojo.require("dijit.form.DateTextBox");
dojo.require("misys.form.CurrencyTextBox");
dojo.require("dijit.form.NumberTextBox");
dojo.require("dijit.form.FilteringSelect");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.TextBox");
dojo.require("misys.widget.Dialog");
dojo.require("dijit.ProgressBar");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.CheckBox");
dojo.require("dojo.data.ItemFileReadStore");
dojo.require("misys.form.file");
dojo.require("misys.form.SimpleTextarea");
dojo.require("misys.form.common");
dojo.require("misys.validation.common");
dojo.require("misys.widget.Collaboration");
dojo.require("misys.binding.SessionTimer");
dojo.require("dojox.xml.DomParser");
dojo.require("dijit.layout.ContentPane");
dojo.require("misys.common");
dojo.require("misys.grid._base");


/**
 * Create Facility Fee Details Screen JS Binding 
 * 
 * @class  reprice_ln
 * @param d
 * @param dj
 * @param m
 */
(function(/* Dojo */d, /* Dijit */dj, /* Misys */m)
	{
	"use strict"; // ECMA5 Strict Mode
	d.mixin(m,
			{
		onFormLoad : function() {
			dijit.byId("escape").set("value", "Y");
			m.animate("fadeOut","bo_deal_name_row");
			m.animate("fadeOut","bo_facility_name_row");
			dojo.style(dojo.byId("escape_row"), 'display', 'none');
		 }
	});
	
})(dojo, dijit, misys);//Including the client specific implementation
dojo.require('misys.client.binding.loan.ln_facility_outstanding_client');