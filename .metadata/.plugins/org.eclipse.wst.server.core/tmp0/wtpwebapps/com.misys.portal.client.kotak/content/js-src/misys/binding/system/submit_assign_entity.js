
dojo.provide("misys.binding.system.submit_assign_entity");
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


(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode
	
	// Public functions & variables follow
	d.mixin(m._config, {
		
		fncSubmitMultipleEntityMigration : function() {
			var grids = [],
			referenceid = "",
			entityWidget = dj.byId("entityId")	;
			if(entityWidget && entityWidget.get("value")+"S" === "S")
			{
				entityWidget.state = "Error";
				entityWidget.focus();
				misys.dialog.show("ERROR", misys.getLocalization("entityNotSelectedError"));
			}
			else if(entityWidget)
			{
				var assignEntityGridWidget = dj.byId("assignEntityGrid");
				if(assignEntityGridWidget && assignEntityGridWidget.selection.getSelected().length === 0)
				{
					m.dialog.show("ERROR", m.getLocalization("noTransactionsSelectedError"));
					return;
				}
				grids.push(assignEntityGridWidget);
				var url = "/screen/AjaxScreen/action/AssignEntityMultipleSubmission?entity="+entityWidget.get("value");
				m.dialog.show("CONFIRMATION", 
						m.getLocalization("submitTransactionsConfirmation", 
								[assignEntityGridWidget.selection.getSelected().length]), "",
					function() {
						m.grid.processRecords(grids, url);
					}
				);
			}
		}
	});

})(dojo, dijit, misys);