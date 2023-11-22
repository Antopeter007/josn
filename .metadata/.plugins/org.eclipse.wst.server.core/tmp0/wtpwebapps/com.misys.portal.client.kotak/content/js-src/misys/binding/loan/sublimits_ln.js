dojo.provide("misys.binding.loan.sublimits_ln");


dojo.require("dijit.layout.TabContainer");

dojo.require("dijit.form.Form");
dojo.require("misys.form.common");
dojo.require("misys.validation.common");
dojo.require("misys.widget.Collaboration");

/**
 * Create loan sublimits JS Binding 
 * 
 * @class sublimits_ln
 * @param d
 * @param dj
 * @param m
 */
(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m)
{

	/*
	 * hides the risk and currency limits while loading a popup
	 * @method hideRiskAndCurrencyLimit
	 */
	function hideRiskAndCurrencyLimit()
	{

		//var gridRiskSublimits = d.byId("gridRiskSublimits");
		var riskSublimitInstDiv = d.byId("riskSublimitInstContainer");
		m.animate('wipeOut', riskSublimitInstDiv);
		var currencySublimitInstDiv = d.byId("currencySublimitInstContainer");
		m.animate('wipeOut', currencySublimitInstDiv);
	}

	
	// Public functions & variables follow
	d.mixin(m,
	{
		/**
		 * Toggle Sublimits section
		 * 
		 * @method toggleRemittanceInst
		 */
		togglesublimitsInst : function()
		{
			var downArrow = d.byId("actionDown");
			var upArrow = d.byId("actionUp");
			var sublimitInstDiv = d.byId("sublimitInstContainer");
			if (d.style("sublimitInstContainer", "display") === "none")
			{
				m.animate('wipeIn', sublimitInstDiv);
				dj.byId('gridsublimits').resize();
				d.style('actionDown', "display", "none");
				d.style('actionUp', "display", "block");
				d.style('actionUp', "cursor", "pointer");
			} else
			{
				m.animate('wipeOut', sublimitInstDiv);
				d.style('actionUp', "display", "none");
				d.style('actionDown', "display", "block");
				d.style('actionDown', "cursor", "pointer");
			}
		},

		/*
		 * toggle risk limit section
		 * @method toggleRiskSublimitsInst
		 */
		toggleRiskSublimitsInst : function()
		{
			var downArrow = d.byId("actionDownRisk");
			var upArrow = d.byId("actionUpRisk");
			var riskSublimitInstDiv = d.byId("riskSublimitInstContainer");
			if (d.style("riskSublimitInstContainer", "display") === "none")
			{
				m.animate('wipeIn', riskSublimitInstDiv);
				dj.byId('gridRiskSublimits').resize();
				d.style('actionDownRisk', "display", "none");
				d.style('actionUpRisk', "display", "block");
				d.style('actionUpRisk', "cursor", "pointer");
			} else
			{
				m.animate('wipeOut', riskSublimitInstDiv);
				d.style('actionUpRisk', "display", "none");
				d.style('actionDownRisk', "display", "block");
				d.style('actionDownRisk', "cursor", "pointer");
			}
		},
		
		/*
		 * toggle currency limits section
		 *@method  toggleCurrencySublimitsInst
		 * 
		 */

		toggleCurrencySublimitsInst : function()
		{
			var downArrow = d.byId("actionDownCurrency");
			var upArrow = d.byId("actionUpCurrency");
			var currencySublimitInstDiv = d.byId("currencySublimitInstContainer");
			if (d.style("currencySublimitInstContainer", "display") === "none")
			{
				m.animate('wipeIn', currencySublimitInstDiv);
				dj.byId('gridCurrencySublimits').resize();
				d.style('actionDownCurrency', "display", "none");
				d.style('actionUpCurrency', "display", "block");
				d.style('actionUpCurrency', "cursor", "pointer");
			} else
			{
				m.animate('wipeOut', currencySublimitInstDiv);
				d.style('actionUpCurrency', "display", "none");
				d.style('actionDownCurrency', "display", "block");
				d.style('actionDownCurrency', "cursor", "pointer");
			}
		}		

	});

})(dojo, dijit, misys);//Including the client specific implementation
dojo.require('misys.client.binding.loan.sublimits_ln_client');