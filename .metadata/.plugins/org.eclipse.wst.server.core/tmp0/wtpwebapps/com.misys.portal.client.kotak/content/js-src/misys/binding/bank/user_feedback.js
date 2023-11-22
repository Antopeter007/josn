dojo.provide("misys.binding.bank.user_feedback");

dojo.require("dijit.layout.TabContainer");
dojo.require("misys.form.common");
dojo.require("misys.validation.common");
dojo.require("dijit.form.Form");
dojo.require("dijit.layout.ContentPane");
dojo.require("misys.common");


(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode

	function _validateFromDateLesserThanToDate(fromDate, toDateId, toolTipMsgKey, toolTipDateLabel, currentDateMsgKey) {
		if (fromDate.get('value') == null) {
			return true;
		}
		m._config = m._config || {};
		m._config.effFromDateValidationInprocess = false;
		var displayMessage;
		var toDate = dj.byId(toDateId);
		var today = new Date();
		var fromDateValue = fromDate.get('value');
		var hideTT = function() {
			dj.hideTooltip(fromDate.domNode);
		};
		if (!m._config.effToDateValidationInprocess) {
			if (!m.compareDateFields(fromDate, toDate)) {
				m._config.effFromDateValidationInprocess = true;
				displayMessage = misys.getLocalization(toolTipMsgKey,
					[toolTipDateLabel, _localizeDisplayDate(fromDate), _localizeDisplayDate(toDate)]);
				fromDate.focus();
				fromDate.set("displayedValue", "");
				fromDate.set("state", "Error");
				dj.showTooltip(displayMessage, fromDate.domNode, 0);
				m._config.effFromDateValidationInprocess = false;
				setTimeout(hideTT, 5000);
				return false;
			}
			if (fromDateValue > today) {
				m._config.effFromDateValidationInprocess = true;
				displayMessage = misys.getLocalization(currentDateMsgKey,
					[toolTipDateLabel, _localizeDisplayDate(fromDate)]);
				fromDate.focus();
				fromDate.set("displayedValue", "");
				fromDate.set("state", "Error");
				dj.showTooltip(displayMessage, fromDate.domNode, 0);
				setTimeout(hideTT, 5000);
				m._config.effFromDateValidationInprocess = false;
				return false;
			}
		}
		m._config.effFromDateValidationInprocess = false;
		return true;
	}

	function _localizeDisplayDate( /* dijit._Widget */dateField) {
		if (dateField.get("type") === "hidden") {
			return d.date.locale.format(m.localizeDate(dateField), { selector: "date" });
		}
		return dateField.get("displayedValue");
	}

	function _validateToDateGreaterThanFromDate(toDate, fromDateId, toolTipMsgKey, toolTipDateLabel, currentDateMsgKey) {
		var displayMessage;
		m._config = m._config || {};
		m._config.effToDateValidationInprocess = false;
		var fromDate = dj.byId(fromDateId);
		var today = new Date();
		var toDateValue = toDate.get('value');
		var hideTT = function() {
			dj.hideTooltip(toDate.domNode);
		};
		if (!m._config.effFromDateValidationInprocess) {
			if (!m.compareDateFields(fromDate, toDate)) {
				m._config.effToDateValidationInprocess = true;
				displayMessage = misys.getLocalization(toolTipMsgKey,
					[toolTipDateLabel, _localizeDisplayDate(toDate), _localizeDisplayDate(fromDate)]);
				toDate.focus();
				toDate.set("displayedValue", "");
				toDate.set("state", "Error");
				dj.showTooltip(displayMessage, toDate.domNode, 0);
				setTimeout(hideTT, 5000);
				m._config.effToDateValidationInprocess = false;
				return false;
			}
			if (toDateValue > today) {
				m._config.effToDateValidationInprocess = true;
				displayMessage = misys.getLocalization(currentDateMsgKey,
					[toolTipDateLabel, _localizeDisplayDate(toDate)]);
				toDate.focus();
				toDate.set("displayedValue", "");
				toDate.set("state", "Error");
				dj.showTooltip(displayMessage, toDate.domNode, 0);
				setTimeout(hideTT, 5000);
				m._config.effToDateValidationInprocess = false;
				return false;
			}
		}
		m._config.effToDateValidationInprocess = false;
		return true;
	}

	d.mixin(m, {

		bind: function() {
			m.connect("feedback_time", "onBlur", function() {
				var that = this;
				_validateFromDateLesserThanToDate(that, "feedback_time2",
					"generalFromDateGreaterThanToDate", misys.getLocalization('CreatedDate'), "thisDateGreaterThanCurrentDateFrom");
			});

			m.connect("feedback_time2", "onBlur", function() {
				var that = this;
				_validateToDateGreaterThanFromDate(that, "feedback_time",
					"generalToDateGreaterThanFromDate", misys.getLocalization('CreatedDate'), "thisDateGreaterThanCurrentDateTo");
			});
		}
	});

})(dojo, dijit, misys);//Including the client specific implementation
dojo.require('misys.client.binding.bank.user_feedback_client');
