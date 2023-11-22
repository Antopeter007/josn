dojo.provide("misys.collaboration.collaborationUtils");
dojo.require("dijit.form.CheckBox");

/*
-----------------------------------------------------------------------------
Scripts for Collaboration pages.

Copyright (c) 2000-2013 Misys (http://www.misys.com),
All Rights Reserved. 

version:   1.0
date:      20/02/13
-----------------------------------------------------------------------------
*/

formatTaskCheckbox = function (value) {
	if (value === "Y" || value === "N")
	{
		var obj = new dijit.form.CheckBox({disabled: true, checked: value === "Y"});
		return obj;
	}
	return "";
};

formatRefIdAnchor = function (value) {
	dojo.eval("jsObj = " + value);
	var obj = misys.grid.formatURL(jsObj);
	return obj;
};
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
			m.connect("POSTDATEFROM", "onBlur", function(){
				_validateFromDateLesserThanToDate(this, dj.byId("POSTDATETO"));
			});
			m.connect("POSTDATETO", "onBlur", function(){
				_validateToDateGreaterThanFromDate(dj.byId("POSTDATEFROM"),this);
			});
			// validate the date range
			m.connect("range", "onBlur", function(){
				_validateFromDateLesserThanToDate(this, dj.byId("range2"));
			});
			m.connect("range2", "onBlur", function(){
				_validateToDateGreaterThanFromDate(dj.byId("range"),this);
			});
		}
	});
	
})(dojo, dijit, misys);