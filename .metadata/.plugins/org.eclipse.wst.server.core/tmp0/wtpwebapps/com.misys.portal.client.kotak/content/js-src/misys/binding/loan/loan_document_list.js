dojo.provide("misys.binding.loan.loan_document_list");

dojo.require("dojo.parser");
dojo.require("dijit.layout.TabContainer");
dojo.require("dijit.form.DateTextBox");
dojo.require("misys.form.CurrencyTextBox");
dojo.require("dijit.form.NumberTextBox");
dojo.require("dijit.form.FilteringSelect");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.TextBox");
dojo.require("misys.widget.Dialog");
dojo.require("dijit.ProgressBar");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.CheckBox");
dojo.require("dojo.data.ItemFileReadStore");
dojo.require("misys.form.file");
dojo.require("misys.form.SimpleTextarea");
dojo.require("misys.form.common");
dojo.require("misys.validation.common");
dojo.require("misys.widget.Collaboration");
dojo.require("misys.binding.SessionTimer");
dojo.require("dojox.xml.DomParser");

/**
 * Loan Document Tracking Pending List JS Binding 
 * 
 * @class loan_document_list
 * @param d
 * @param dj
 * @param m
 */
(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {
	
	/**
	 * Validate the Effective Date From
	 * 
	 * @method _validateEffFromDate
	 */
	function _validateEffFromDate() {
		// summary:
		// Validates the data entered for Effective from date
		// tags:
		// public, validation

		// Return true for empty values

		var that = this;
		m._config = m._config || {};
		m._config.effFromDateValidationInprocess = false;
		if (that.get('value') === null) {
			return true;
		}
		console.debug('[Validate] Validating Due From Date. Value = '+ that.get('value'));
		var creationToDate = dj.byId('due_dateTO');
		if(!m._config.effToDateValidationInprocess)
		{
			if (!m.compareDateFields(that, creationToDate)) {
				m._config.effFromDateValidationInprocess = true;
				var widget = dj.byId('due_dateFROM');
					displayMessage = misys.getLocalization('DueDateFromLesserThanDueDateTo');
					widget.focus();
					widget.set("state","Error");
					dj.hideTooltip(widget.domNode);
					dj.showTooltip(displayMessage, widget.domNode, 0);
			}
		}
		m._config.effFromDateValidationInprocess = false;
		return true;
	}
	
	/**
	 * Validate the Effective Date To
	 * 
	 * @method _validateEffToDate
	 */
	function _validateEffToDate() {
		// summary:
		// Validates the data entered for Effective to date
		// tags:
		// public, validation

		// Return true for empty values
		var that = this;
		m._config = m._config || {};
		m._config.effToDateValidationInprocess = false;
		if (that.get('value') === null) {
			return true;
		}
		console.debug('[Validate] Validating Due Date To. Value = '+ that.get('value'));
		var creationFromDate = dj.byId('due_dateFROM');
		if(!m._config.effFromDateValidationInprocess)
		{
			if (!m.compareDateFields(creationFromDate, that)) {
				m._config.effToDateValidationInprocess = true;
				var widget = dj.byId('due_dateTO');
				  	displayMessage = misys.getLocalization('DueDateToGreaterThanDueDateFrom');
			 		widget.focus();
			 		widget.set("state","Error");
			 		dj.hideTooltip(widget.domNode);
			 		dj.showTooltip(displayMessage, widget.domNode, 0);
			 	return false;		
			}
		}
		m._config.effToDateValidationInprocess = false;
		return true;
	}
		
		
	dojo.subscribe('ready',function(){
		m.connect("due_dateFROM", "onBlur", _validateEffFromDate);
		m.connect("due_dateTO", "onBlur", _validateEffToDate);
	});
})(dojo, dijit, misys);
//Including the client specific implementation
dojo.require('misys.client.binding.loan.loan_document_list_client');