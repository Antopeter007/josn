dojo.provide("misys.binding.cash.ktp.bank.global_conventions");

dojo.require("misys.binding.cash.ktp.common.ktp_common");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode
	
	d.ready(function(){
		
		// Add formatter on FILENAME field
		var gridLayout = m.searchGridLayout();
		if (gridLayout)
		{
			var cellDefinition = m.searchGridLayoutCellByFieldName(gridLayout, "Attachment@file_name");
			d.mixin(cellDefinition, {formatter: function(value, index) {
				// Add _blank target to filename anchor
				return "<a href=\"" + value.href + "\" target=\"_blank\">" + value.text + "</a>";
			}});
		}
	});
		
})(dojo, dijit, misys);