dojo.provide("misys.binding.cash.ktp.messagecenter.ktp_accounts_synthesis");

dojo.require("misys.binding.cash.ktp.common.ktp_common");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode
	
	d.ready(function(){
		// Hide report description
		m.hideReportDescription();

		// Set grid cell formatters
		m.setGridCellFormatter();
		
		// Add formatter on LIBELLE field
		var gridLayout = m.searchGridLayout();
		if (gridLayout)
		{
			var cellDefinition = m.searchGridLayoutCellByFieldName(gridLayout, "COMPTE");
			d.mixin(cellDefinition, {formatter: misys.ibanFormatter});
		}
	});
		
})(dojo, dijit, misys);