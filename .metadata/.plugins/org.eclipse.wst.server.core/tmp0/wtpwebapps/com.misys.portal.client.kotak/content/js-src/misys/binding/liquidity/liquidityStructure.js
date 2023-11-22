dojo.provide("misys.binding.liquidity.liquidityStructure");

dojo.require("misys.validation.common");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.Select");
dojo.require("misys.form.common");
dojo.require("dijit.Tooltip");
dojo.require("misys.widget.Dialog");

(function(/* Dojo */d, /* Dijit */dj, /* Misys */m) {

	function  validateToDateRange()
	{
		if ((dj.byId("effective_date_FROM").get("value") !== "" && dj.byId("effective_date_TO").get("value") !== "") && (dj.byId("effective_date_FROM").get("value") !== null && dj.byId("effective_date_TO").get("value") !== null))
		{
			var from = dj.byId('effective_date_FROM');
			var to = dj.byId('effective_date_TO');

			if (!m.compareDateFields(from, to))
			{
				this.invalidMessage = m.getLocalization("toDateGreaterThanFromDateError", [	dj.byId('effective_date_TO').get("displayedValue"),	dj.byId('effective_date_FROM').get("displayedValue")]);
				dj.byId('effective_date_TO').set("state","Error");
				dj.hideTooltip(dj.byId('effective_date_TO').domNode);
				m.showTooltip(invalidMessage ,d.byId('effective_date_TO'));
				return false;
			}
		}
	}

	function validateFromDateRange()
 	{
		if ((dj.byId("effective_date_FROM").get("value") !== "" && dj.byId("effective_date_TO").get("value") !== "") && (dj.byId("effective_date_FROM").get("value") !== null && dj.byId("effective_date_TO").get("value") !== null))
		{
			var from = dj.byId('effective_date_FROM');
			var to = dj.byId('effective_date_TO');

			if (!m.compareDateFields(from, to)) {
				this.invalidMessage = m.getLocalization("fromDateLessThanToDateError", [dj.byId('effective_date_FROM').get("displayedValue"),dj.byId('effective_date_TO').get("displayedValue") ]);
				dj.byId('effective_date_FROM').set("state", "Error");
				dj.hideTooltip(dj.byId('effective_date_FROM').domNode);
				m.showTooltip(invalidMessage, d.byId('effective_date_FROM'));
				return false;
			}
		}
	}

	d.mixin(m, {
		bind : function() {
			m.connect("effective_date_FROM", "onBlur", function() {
				validateFromDateRange();
			});
			m.connect("effective_date_TO", "onBlur", function() {
				validateToDateRange();
			});
		}
	});
})(dojo, dijit, misys);
// Including the client specific implementation
dojo.require('misys.client.binding.liquidity.liquidityStructure_client');