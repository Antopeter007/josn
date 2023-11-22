dojo.provide("misys.binding.tma.create_tm");

//
// Copyright (c) 2000-2015 Misys (http://www.m.com),
// All Rights Reserved. 
//
//
// Summary: 
//      Event Binding for TM Console (LC) TM.
//
//

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
dojo.require("misys.form.SimpleTextarea");
dojo.require("misys.widget.Collaboration");
dojo.require("misys.form.common");
dojo.require("misys.form.file");
dojo.require("misys.validation.common");
dojo.require("misys.binding.SessionTimer");
dojo.require("misys.binding.trade.ls_common");


(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode
	
	//
	// Private functions & variables
	//

	//
	// Public functions & variables
	
	d.mixin(m, {
		bind : function() {
		}, 
		
		onFormLoad : function() {
			//  summary:
		    //          Events to perform on page load.
			
		}, 
		
		beforeSaveValidations : function(){
        },
		
		beforeSubmitValidations : function(){
		}
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.tma.create_tm_client');