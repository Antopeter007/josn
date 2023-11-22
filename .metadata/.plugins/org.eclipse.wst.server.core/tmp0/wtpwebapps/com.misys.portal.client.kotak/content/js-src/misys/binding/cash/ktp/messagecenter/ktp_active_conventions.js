dojo.provide("misys.binding.cash.ktp.messagecenter.ktp_active_conventions");

dojo.require("misys.binding.cash.ktp.common.ktp_common");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode
	
	// The id of the search form on list pages (it is always the same)
	var _transactionSearchFormId = "TransactionSearchForm";

	d.mixin(m, {
			// Overwrite standard export function to force PDF landscape
			exportListToFormat : function (/*String*/format)
			{
				if(d.byId(_transactionSearchFormId)) 
				{
					if (format === "pdf")
					{
						format = "com.misys.portal.report.viewer.ViewerLandScapePDF";
					}
					dj.byId("export_list").set("value", format);
					dj.byId("TransactionSearchForm").submit();
					dj.byId("export_list").set("value", "screen");
				}
			}
		}
	);
	
	d.mixin(m, {
		
		setMultiRowHeader : function() {
			if (window)
			{
				for(var property in window){
					if (property.indexOf("gridLayout") === 0)
					{
						// Locate grid
						m.ktpGridId = property.substr(10);
						var gridLayout = window[property];
						var gridHeaderCells = gridLayout.cells;
						
						// Clone header rows
						var fakeFirstRowHeader = d.clone(gridHeaderCells[0]);
						d.forEach(fakeFirstRowHeader, function(cellDefinition){
							delete cellDefinition.field;
							delete cellDefinition.name;
							delete cellDefinition.formatter;
						});
						
						// Insert additional header rows
						gridHeaderCells.unshift([{name: m.getLocalization("comptesCentralisateurs"), colSpan: 1}, {name: m.getLocalization("comptesCentralises"), colSpan: 7}]);
						gridHeaderCells.unshift(fakeFirstRowHeader);
						break;
					}
				}
			}
		},

		hideFirstHeaderRow : function() {
			d.forEach(
				d.query(".dojoxGridHeader tr:first-child .dojoxGridCell", d.byId("grid" + m.ktpGridId)), function(trNode) {
					d.attr(trNode, "style", "background-color: white");
			});
		},
		
		onFormLoad : function(value, index)
		{
			var gridId = "grid" + m.ktpGridId;
			var grid = dj.byId(gridId);

			// Hide empty rows
			grid.onStyleRow = function(row){
				console.log(row.index);
				d.style(row.node.children[0].children[0].rows[0], "display", "none");
				d.style(row.node.children[0].children[0].rows[1], "display", "none");
			};
		}
	});


	d.ready(function(){
		// Hide report description
		m.hideReportDescription();

		// Set grid cell formatters
		m.setGridCellFormatter();
		m.setMultiRowHeader();
		
		// Hide empty header row
		d.place("<div style='width=:100%;height:12px;position:relative;top:37px;z-index:255;background-color:white'></div>", d.query("#GTPRootPortlet > .portlet-section-body > .widgetContainer > div > .widgetContainer")[0], "first");
	});
		
})(dojo, dijit, misys);