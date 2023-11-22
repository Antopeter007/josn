dojo.provide("misys.binding.cash.ktp.common.ktp_home_account_balances");

dojo.require("misys.binding.cash.ktp.common.ktp_common");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode
	
	var dojoxGridClass = ".dojoxGrid";
	
	d.mixin(m, {
		
		disactivateReloadForNonKTPGrids : function() {
			// First, search KTP home page grid
			var ktpGrids = d.query(dojoxGridClass, d.byId("KTPHomeAccountSummaryListPortlet"));
			var ktpAccountBalancesGridId = ktpGrids.length === 1 ? ktpGrids[0].id : "";
			
			// if found, mark all other grids as non reloadable (attach CSS class noReload)
			if (ktpAccountBalancesGridId !== "")
			{
				d.forEach(d.query(dojoxGridClass, d.byId("layout")), function(grid) {
					if (grid.id !== ktpAccountBalancesGridId)
					{
						d.addClass(grid, "noReload");
					}
				});
			}
		},
		
		bind: function() {
			m.disactivateReloadForNonKTPGrids();
			
			// Add formatter on LIBELLE field
			var ktpGrids = d.query(dojoxGridClass, d.byId("KTPHomeAccountSummaryListPortlet"));
			var ktpAccountBalancesGridId = ktpGrids.length === 1 ? ktpGrids[0].id : "";
			if (ktpAccountBalancesGridId !== "")
			{
				var gridLayout = dj.byId(ktpAccountBalancesGridId).layout;
				var cellDefinition = m.searchGridLayoutCellByFieldName(gridLayout, "COMPTE");
				d.mixin(cellDefinition, {formatter: misys.ibanFormatter});
			}
		}
	});
		
})(dojo, dijit, misys);