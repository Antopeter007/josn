dojo.provide("misys.binding.cash.ktp.common.ktp_common");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode

	d.mixin(m, {
		// Overwrite standard export function to force PDF landscape
		exportListToFormat : function (/*String*/format)
		{
			if (format === "pdf")
			{
				format = "com.misys.portal.report.viewer.ViewerLandScapePDF";
			}
			dj.byId("export_list").set("value", format);
			dj.byId("TransactionSearchForm").submit();
			dj.byId("export_list").set("value", "screen");
		}
	});
	
	d.mixin(m, {
		
		setGridCellFormatter : function()
		{
			if (window)
			{
				for(var property in window){
					if (property.indexOf("gridLayout") === 0)
					{
						m.ktpGridId = property.substr(10);
						var gridLayout = window[property];
						
						var gridHeaderCells = gridLayout.cells;

						d.forEach(gridHeaderCells[0], function(cellDefinition){
							d.mixin(cellDefinition, {formatter: misys.ktpCellFormatter});
						});
					}
				}				
			}
		},
		
		ktpCellFormatter : function(value, index)
		{
			var formattedValue = misys.grid.formatHTML(value);
			return formattedValue;
		},
		
		searchGridLayoutCellByFieldName : function(/*Dijit GridLayout*/ gridLayout, /*String*/ fieldName)
		{
			var cellDefinition;
			if (gridLayout)
			{
				var gridHeaderCells = gridLayout.cells;
				cellDefinition = m.searchCellDefinitionByName(gridHeaderCells, fieldName);
			}
			return cellDefinition;
		},
		
		searchCellDefinitionByName : function(/*Dijit Grid Layout*/ layoutCells, /*String*/ fieldName)
		{
			var layoutCell;
			for(var i = 0; i < layoutCells.length; i++) {
				layoutCell = layoutCells[i];
				if (d.isArray(layoutCell))
				{
					layoutCell = m.searchCellDefinitionByName(layoutCell, fieldName);
					if (layoutCell)
					{
						break;
					}
				}
				else
				{
					if (layoutCell.field === fieldName)
					{
						break;
					}
				}
			}
			return layoutCell;
		},
		
		searchGridLayout : function()
		{
			var gridLayout;
			if (window)
			{
				for(var property in window){
					if (property.indexOf("gridLayout") === 0)
					{
						gridLayout = window[property];
						break;
					}
				}				
			}
			return gridLayout;
		},

		ibanFormatter : function(value, index)
		{
			var ibanSubStrings, formattedValue;
			if (value.text)
			{
				// Parse IBAN value to insert spacing every 4 characters
				ibanSubStrings = value.text.match(/.{1,4}/g);
				formattedValue = ibanSubStrings.join(" ");
				value.text = formattedValue;
				return "<a href=\"" + value.href + "\">" + value.text + "</a>";
			}
			if(value.split(" ").join("").length == 27 && value.substring(0,2) === "FR")
			{
				// Parse IBAN value to insert spacing every 4 characters
				ibanSubStrings = value.match(/.{1,4}/g);
				formattedValue = "";
				if (ibanSubStrings)
				{
					formattedValue = ibanSubStrings.join(" ");
				}
				return "<a href=\"" + "/portal/screen/CashInquiryScreen?ktpaccountno=" +value.split(' ').join('')+"&operation=KTP_REPORT_2"+ "\">" + formattedValue + "</a>";
			}
			else
			{
				value=value.split("&lt;").join("<");
				return value;
			}
		},
		
		hideReportDescription : function()
		{
			var reportDescription = d.query("#GTPRootPortlet > .portlet-section-body > .widgetContainer > b");
			if (reportDescription && reportDescription.length > 0)
			{
				reportDescription[0].style.display = "none";
			}
		}
	});
	
})(dojo, dijit, misys);