dojo.provide("misys.binding.report_parameters");

dojo.require("misys.form.addons");
dojo.require("dijit.form.FilteringSelect");
dojo.require("dijit.layout.TabContainer");
dojo.require("misys.form.MultiSelect");
dojo.require("misys.form.common");
dojo.require("misys.validation.common");
dojo.require('misys.widget.Dialog');
dojo.require("dijit.form.Form");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.CheckBox");
dojo.require("dijit.layout.ContentPane");
dojo.require("dojo.io.iframe");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode
	
	// Public functions & variables follow
	d.mixin(m, {

		bind : function() {
			misys.setValidation("openUploadLogoDialog", m.validateImage);
		},
		
		beforeSubmitValidations : function() {
			return m.validateImage();
		},
		
		populateLogoFeedBack : function(){
			dijit.byId("data_1").set("value", m._config.logoData.details.id);
		}
	});
})(dojo, dijit, misys);