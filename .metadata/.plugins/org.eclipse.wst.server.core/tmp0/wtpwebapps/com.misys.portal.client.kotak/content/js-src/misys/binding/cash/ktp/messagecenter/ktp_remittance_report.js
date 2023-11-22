dojo.provide("misys.binding.cash.ktp.messagecenter.ktp_remittance_report");

dojo.require("misys.binding.cash.ktp.common.ktp_common");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode
	var invalidMessage;
	function  validateToDateRange()
	{
		if ((dj.byId("DU").get("value") !== "" && dj.byId("AU").get("value") !== "") && (dj.byId("DU").get("value") !== null && dj.byId("AU").get("value") !== null))
		{
			var from = dj.byId('DU');
			var to = dj.byId('AU');

			if (!m.compareDateFields(from, to))
			{
				invalidMessage = m.getLocalization("toDateGreaterThanFromDateError", [	dj.byId('AU').get("displayedValue"),	dj.byId('DU').get("displayedValue")]);
				dj.byId('AU').set("state","Error");
				dj.hideTooltip(dj.byId('AU').domNode);
				m.showTooltip(invalidMessage ,d.byId('AU'));
				return false;
			}
		}
	}

	function validateFromDateRange()
 	{
		if ((dj.byId("DU").get("value") !== "" && dj.byId("AU").get("value") !== "") && (dj.byId("DU").get("value") !== null && dj.byId("AU").get("value") !== null))
		{
			var from = dj.byId('DU');
			var to = dj.byId('AU');

			if (!m.compareDateFields(from, to)) {
				invalidMessage = m.getLocalization("fromDateLessThanToDateError", [dj.byId('DU').get("displayedValue"),dj.byId('AU').get("displayedValue") ]);
				dj.byId('DU').set("state", "Error");
				dj.hideTooltip(dj.byId('DU').domNode);
				m.showTooltip(invalidMessage, d.byId('DU'));
				return false;
			}
		}
	}
	
	d.ready(function(){
		// Hide report description
		m.hideReportDescription();

		// Set grid cell formatters
		m.setGridCellFormatter();
	});
	d.mixin(m, {
		
		bind : function(){
			m.connect("DU", "onBlur", function() {
				validateFromDateRange();
			});
			m.connect("AU", "onBlur", function() {
				validateToDateRange();
			});
		}
	});
	
		
})(dojo, dijit, misys);