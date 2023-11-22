/*
 * ---------------------------------------------------------- 
 * Event Binding for BP and DDA
 * 
 * Copyright (c) 2000-2011 Misys (http://www.misys.com), All Rights Reserved.
 * 
 * version: 1.0 date: 07/03/11
 * 
 * ----------------------------------------------------------
 */
dojo.provide("misys.binding.bank.report_bp_dda");

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
dojo.require("misys.form.PercentNumberTextBox");
dojo.require("misys.form.SimpleTextarea");
dojo.require("misys.widget.Collaboration");
dojo.require("misys.form.common");
dojo.require("misys.form.file");
dojo.require("misys.form.addons");
dojo.require("misys.validation.common");
dojo.require("misys.binding.cash.ft_common");

dojo.require("misys.form.BusinessDateTextBox");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {
	
	"use strict"; // ECMA5 Strict Mode
	
	d.mixin(m, {
		
		bind : function()
		{

			m.setValidation("iss_date", m.validateTransferDate);
			m.setValidation("start_date", m.validateStartDate);
			m.setValidation("end_date", m.validateEndDate);

			//Bind all recurring payment details fields
			m.bindRecurringFields();
			
			m.connect("action", "onChange", function() {
				if(this.get("value") == "MODIFY") {
					m.animate("wipeIn", d.byId('dda-update-amount'));
				} else {
					m.animate("wipeOut", d.byId('dda-update-amount'));
				}
			});
			
			//Populating Reporting status
			m.connect("prod_stat_code", "onChange", m.populateReportingStatus);
			
		},	
		
		showReference: function(/*String*/ helpText) {
			m.dialog.show('Alert', helpText);
		},
				
		onFormLoad : function() {	
			//Show Recurring Payment details section and validate start date
			m.showSavedRecurringDetails(false);			
			m.initForm();
			m.populateReportingStatus();
		},
		
		initForm : function()
		{	
			if(dj.byId("action")) {
				if(dj.byId("action").get("value") == "MODIFY") {
					m.animate("wipeIn", d.byId('dda-update-amount'));
				} else {
					m.animate("wipeOut", d.byId('dda-update-amount'));
				}
			}	
		}
		
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.bank.report_bp_dda_client');