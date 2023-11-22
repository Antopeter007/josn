
dojo.provide("misys.binding.system.submit_entity_migration");
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

	function _validateFromDateLesserThanToDate(fromDateWidget, toDateWidget){
		if (fromDateWidget && toDateWidget && fromDateWidget.get("value") == null && toDateWidget.get("value") == null)
		{
			return true;
		}
		var displayMessage;
		if (!m.compareDateFields(fromDateWidget, toDateWidget))
		{
			displayMessage = misys.getLocalization("validFromDateGreaterThanValidToDateError", 
					[fromDateWidget.get("displayedValue"), toDateWidget.get("displayedValue")]);
			fromDateWidget.set("state", "Error");
			dj.hideTooltip(fromDateWidget.domNode);
			dj.showTooltip(displayMessage, fromDateWidget.domNode, 0);
			return false;
		}
		return true;
	}
	
	function _validateToDateGreaterThanFromDate(fromDateWidget, toDateWidget){
		if (fromDateWidget && toDateWidget && fromDateWidget.get("value") == null && toDateWidget.get("value") == null)
		{
			return true;
		}
		var displayMessage;
		if (!m.compareDateFields(fromDateWidget, toDateWidget))
		{
			displayMessage = misys.getLocalization("validFromDateGreaterThanValidToDateError", 
					[fromDateWidget.get("displayedValue"), toDateWidget.get("displayedValue")]);
			toDateWidget.set("state", "Error");
			dj.hideTooltip(toDateWidget.domNode);
			dj.showTooltip(displayMessage, toDateWidget.domNode, 0);
			return false;
		}
		return true;
	}
	
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
				var entityMigrationTnxGridWidget = dj.byId("entityMigrationTnxGrid");
				if(entityMigrationTnxGridWidget && entityMigrationTnxGridWidget.selection.getSelected().length === 0)
				{
					m.dialog.show("ERROR", m.getLocalization("noTransactionsSelectedError"));
					return;
				}
				grids.push(entityMigrationTnxGridWidget);
				var url = "/screen/AjaxScreen/action/EntityMigrationMultipleSubmission?entity="+entityWidget.get("value");
				m.dialog.show("CONFIRMATION", 
						m.getLocalization("submitTransactionsConfirmation", 
								[entityMigrationTnxGridWidget.selection.getSelected().length]), "",
					function() {
						m.grid.processRecords(grids, url);
					}
				);
			}
		}
	});

	d.mixin(m,
	{
		bind : function()
		{
			// validate the currency
			m.setValidation("currency", m.validateCurrency);
			m.setValidation("facility_ccy", m.validateCurrency);
			m.connect("creation_date_FROM", "onBlur", function(){
				_validateFromDateLesserThanToDate(this, dj.byId("creation_date_TO"));
			});
			m.connect("creation_date_TO", "onBlur", function(){
				_validateToDateGreaterThanFromDate(dj.byId("creation_date_FROM"),this);
			});
			m.connect("facilityReviewFromDate", "onBlur", function(){
				_validateFromDateLesserThanToDate(this, dj.byId("facilityReviewToDate"));
			});
			m.connect("facilityReviewToDate", "onBlur", function(){
				_validateToDateGreaterThanFromDate(dj.byId("facilityReviewFromDate"),this);
			});
		}
	});
	
})(dojo, dijit, misys);