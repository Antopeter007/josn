dojo.provide("misys.binding.system.submit_templates");
/*
 ----------------------------------------------------------
 Event Binding for

 Report Designer Multiple Submit.

 Copyright (c) 2000-2012 Misys (http://www.misys.com),
 All Rights Reserved. 

 version:   1.0
 date:      24/04/2012
 Author:    Ramesh Babu M
 ----------------------------------------------------------
 */

dojo.require("misys.widget.Dialog");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.CheckBox");
dojo.require("dijit.form.FilteringSelect");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.NumberTextBox");
dojo.require("misys.form.CurrencyTextBox");
dojo.require("dijit.form.DateTextBox");
dojo.require("misys.grid.DataGrid");
dojo.require("misys.form.common");
dojo.require("misys.validation.common");
dojo.require("misys.report.common");


(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode

	// Public functions & variables follow
	d.mixin(m._config, {
		
		fncSubmitMultipleTemplates : function() {
			var grids = [],referenceid = "",tnxid	= "";

			d.query(".dojoxGrid").forEach(function(g){
			grids.push(dj.byId(g.id));
		});
		var url = "/screen/AjaxScreen/action/ReportDesignerMultipleTemplateSubmission";
		
		if(grids && grids[0].selection.getSelected().length > 0)
		{
			m.grid.processRecords(grids, url);
		}
		else
		{
			m.dialog.show('ERROR', m.getLocalization('noTransactionsSelectedError'));
		}
	}
	});
})(dojo, dijit, misys);








//Including the client specific implementation
       dojo.require('misys.client.binding.system.submit_templates_client');