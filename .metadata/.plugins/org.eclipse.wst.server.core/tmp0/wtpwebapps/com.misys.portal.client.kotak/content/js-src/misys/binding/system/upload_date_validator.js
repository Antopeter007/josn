
dojo.provide("misys.binding.system.upload_date_validator");
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
		m._config = m._config || {};
		m._config.effFromDateValidationInprocess = false;
		
		if (fromDateWidget && toDateWidget && fromDateWidget.get("value") == null && toDateWidget.get("value") == null)
		{
			return true;
		}
		var displayMessage;
		if(!m._config.effToDateValidationInprocess)
		{
			if (!m.compareDateFields(fromDateWidget, toDateWidget))
			{
				m._config.effFromDateValidationInprocess = true;
				displayMessage = misys.getLocalization("validFromDateGreaterThanValidToDateError", 
						[fromDateWidget.get("displayedValue"), toDateWidget.get("displayedValue")]);
				// fromDateWidget.focus();
				fromDateWidget.set("state", "Error");
				dj.hideTooltip(fromDateWidget.domNode);
				dj.showTooltip(displayMessage, fromDateWidget.domNode, 0);
				return false;
			}
		}
		m._config.effFromDateValidationInprocess = false;
		return true;
	}
	
	function _validateToDateGreaterThanFromDate(fromDateWidget, toDateWidget){
		
		m._config = m._config || {};
		m._config.effToDateValidationInprocess = false;
		if (fromDateWidget && toDateWidget && fromDateWidget.get("value") == null && toDateWidget.get("value") == null)
		{
			return true;
		}
		var displayMessage;
		if(!m._config.effFromDateValidationInprocess)
		{
			if (!m.compareDateFields(fromDateWidget, toDateWidget))
			{
				m._config.effToDateValidationInprocess = true;
				displayMessage = misys.getLocalization("validFromDateGreaterThanValidToDateError", 
						[fromDateWidget.get("displayedValue"), toDateWidget.get("displayedValue")]);
				// toDateWidget.focus();
				toDateWidget.set("state", "Error");
				dj.hideTooltip(toDateWidget.domNode);
				dj.showTooltip(displayMessage, toDateWidget.domNode, 0);
				return false;
			}
		}
		m._config.effToDateValidationInprocess = false;
		return true;
	}

	d.mixin(m,
	{
		bind : function()
		{
			// validate the date range
			m.connect("creation_date_FROM", "onBlur", function(){
				_validateFromDateLesserThanToDate(this, dj.byId("creation_date_TO"));
			});
			m.connect("creation_date_TO", "onBlur", function(){
				_validateToDateGreaterThanFromDate(dj.byId("creation_date_FROM"),this);
			});
			m.connect("fromDate", "onBlur", function(){
				_validateFromDateLesserThanToDate(this, dj.byId("toDate"));
			});
			m.connect("toDate", "onBlur", function(){
				_validateToDateGreaterThanFromDate(dj.byId("fromDate"),this);
			});
		}
	});
	
})(dojo, dijit, misys);