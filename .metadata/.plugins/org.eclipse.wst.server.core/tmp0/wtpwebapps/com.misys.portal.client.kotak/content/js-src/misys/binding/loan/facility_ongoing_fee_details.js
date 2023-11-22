dojo.provide("misys.binding.loan.facility_ongoing_fee_details");

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
dojo.require("dijit.layout.ContentPane");
dojo.require("misys.common");
dojo.require("misys.grid._base");


/**
 * Create Facility Fee Details Screen JS Binding 
 * 
 * @class  reprice_ln
 * @param d
 * @param dj
 * @param m
 */
(function(/* Dojo */d, /* Dijit */dj, /* Misys */m)
	{

	"use strict"; // ECMA5 Strict Mode
	function _validateDueFromDate() {
		// summary:
		// Validates the data entered for Due from date
		// tags:
		// public, validation
		// Return true for empty values
		var that = this;
		m._config = m._config || {};
		m._config.dueDateFromValidationInprocess = false;
		if (that.get('value') === null) {
			return true;
		}
		console.debug('[Validate] Validating Due From Date. Value = '+ that.get('value'));
		//Test that Due date should not be earlier than effective date.
		var effectiveDate = dj.byId("effectiveDate");
		if(!m._config.dueDateToValidationInprocess)
		{
			if (!m.compareDateFields(effectiveDate, that)) {
				m._config.dueDateFromValidationInprocess = true;
				var widget = dj.byId("due_date"),
				displayMessage = misys.getLocalization('dueDateFromGreaterThanEffectiveDate', [m.getLocalizeDisplayDate(this), m.getLocalizeDisplayDate(effectiveDate)]);
				widget.focus();
				widget.set("state","Error");
		 		dj.hideTooltip(widget.domNode);
		 		dj.showTooltip(displayMessage, widget.domNode, 0);
		 		return false;
			}
		}
		m._config.dueDateFromValidationInprocess = false;
		return true;

	}
	function _validateDueDateTo() {

		// summary:
		// Validates the data entered for Due to date
		// tags:
		// public, validation

		// Return true for empty values
		var dueDateTo = dj.byId('due_date2');
		m._config = m._config || {};
		m._config.dueDateToValidationInprocess = false;
		if (dueDateTo.get('value') === null) {
			return true;
		}
		console.debug('[Validate] Validating Due Date To. Value = '+ dueDateTo.get('value'));
		var dueDate = dj.byId('dueDate');
		if(!m._config.dueDateFromValidationInprocess)
		{
			if (!m.compareDateFields(dueDateTo, dueDate)) {
				m._config.dueDateToValidationInprocess = true;
				var widget = dj.byId('due_date2'),
				displayMessage = misys.getLocalization('dueDateToGreaterThanDueDate', [m.getLocalizeDisplayDate(dueDate)]);
				widget.focus();
				widget.set("state","Error");
		 		dj.hideTooltip(widget.domNode);
		 		dj.showTooltip(displayMessage, widget.domNode, 0);
		 		return false;
			}
		}	
		m._config.dueDateToValidationInprocess = false;
		return true;
	}
	
	/*
	 * This method checks whether the to date is greater than from date.
	 * @method _checkToDatesValidation
	 */
	
	function _checkToDatesValidation(){
		
					console.debug('[Validate] Validating Due To Date. Value = '+ this.get('value'));
					var dueDateFrom = dj.byId('due_date');
					var dueDateTo = dj.byId('due_date2');
					/*var rep=m.compareDateFields(dueDateFrom, this);*/
						if (!m.compareDateFields(dueDateFrom, this))
						{
							 this.invalidMessage = m.getLocalization("DueDateFromToDateCheckError");
							 this.set("state","Error");
					 		 dj.hideTooltip(this.domNode);
					 		 dj.showTooltip(this.invalidMessage, this.domNode, 100);
							 return false;
						}
						else{
							_validateDueDateTo();
						}
					return true;
	}

	/*
	 * This method checks whether the from date is lesser than to date.
	 * @method _checkFromDatesValidation
	 */
	
	function _checkFromDatesValidation(){
		
					var dueDateFrom = dj.byId('due_date');
					var dueDateTo = dj.byId('due_date2');
					/*var rep=m.compareDateFields(dueDateFrom, this);*/
						if (!m.compareDateFields(dueDateFrom, dueDateTo))
						{
							 this.invalidMessage = m.getLocalization("DueDateCheckErrorForFromToDate");
							 this.set("state","Error");
					 		 dj.hideTooltip(this.domNode);
					 		 dj.showTooltip(this.invalidMessage, this.domNode, 100);
							 return false;
						}
					return true;
	}
	
	d.mixin(m,
			{
		
		bind : function() {

			 m.connect("due_date", "onBlur", _validateDueFromDate);
			 m.connect("due_date2", "onBlur", _checkToDatesValidation);
			 m.connect("due_date", "onBlur", _checkFromDatesValidation);
		},
		onFormLoad : function() {
			m.animate("fadeOut","fee_RID_row");
			},
			
		goToFacFeeInquiry: function(){
			 
			var facilityId=decodeURIComponent(dj.byId("facilityId").get("value"));
			 var borrowerId=decodeURIComponent(dj.byId("borrowerId").get("value"));
			 misys.popup.showPopup("facilityid="+facilityId + "&borrowerId=" + borrowerId,'FEE_DETAILS');
			
		}
		
	});
	
})(dojo, dijit, misys);
