dojo.provide("misys.binding.listdef.message_center.listdef_batch_inquiry_mc_list");
/*
-----------------------------------------------------------------------------
Scripts for the list def binding for Message Center Page


Copyright (c) 2000-2010 Misys (http://www.misys.com),
All Rights Reserved. 

version:   1.0
date:      06/11/11
-----------------------------------------------------------------------------
*/

dojo.require("dojo.data.ItemFileReadStore");
dojo.require('dojo.data.ItemFileWriteStore');
dojo.require("dijit.form.FilteringSelect");
dojo.require("misys.form.MultiSelect");
dojo.require("dijit.layout.TabContainer");
dojo.require("misys.form.common");
dojo.require("misys.validation.common");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.CheckBox");
dojo.require("dijit.layout.ContentPane");
dojo.require("misys.form.CurrencyTextBox");
dojo.require("dijit.form.RadioButton");

(function(/*Dojo*/d, /*dj*/dj, /*Misys*/m) {

	/**
	 * <h4>Summary:</h4>
	 * Function to validate that batch date is less than or equal to current date.
	 * @method _validateBatchDate
	 *
	 */
	function _validateBatchDate() {
		// Return true for empty values
		var that = this;
		if (that.get('value') == null || that.get('value') === "") {
			return true;
		}
		console.debug('[Validate] Validating Batch Date. Value = '+ that.get('value'));
		// Test that the batch date is less than or equal to
		// current date
		var currentDate = new Date();
		// set the hours to 0 to compare the date values
		currentDate.setHours(0, 0, 0, 0);
		var isValid = d.date.compare(currentDate, m.localizeDate(this)) < 0 ? false : true;
		if (!isValid) {
			var widget = dj.byId('batch_dttm');
			 	displayMessage = m.getLocalization("batchDateGreaterThanCurrentDateError");
		 		widget.set("state","Error");
		 		dj.hideTooltip(widget.domNode);
		 		dj.showTooltip(displayMessage, widget.domNode, 0);
		}

		return true;
	}

	d.mixin(m, {
		bind : function() {

			m.connect("batch_dttm", "onBlur", _validateBatchDate);
			m.connect("submitButton", "onClick", _validateBatchDate);

		}
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.listdef.message_center.listdef_batch_inquiry_mc_list_client');