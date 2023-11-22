dojo.provide("misys.binding.loan.loan_activity_inquiry");

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
 * Loan Activity List Portlet Binding
 * 
 * @class loan_activity_inquiry
 * @param d
 * @param dj
 * @param m
 */
(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {
	
	/**
	 * Reload the Grid Data based on the search criteria
	 * 
	 * @method _reloadGridWithSearchCriteria
	 */
	function _reloadGridWithSearchCriteria(){
		
		var form = dj.byId("TransactionSearchForm1"),
		grid = dj.byId('actualActivitiesHistoryGrid'),
		dateRegex = /Date/,
		timeRegex = /Time/,
		queryOptions = {},
		store, baseURL;

		if(grid && form) {
			// Collect the search form field values as a JSON object
			if(d.byId('divResults')){
				   d.style("divResults", "margin", 0);
			}
	
			store = grid.get("store");
			m.connect(grid, "_onFetchComplete", function(){
				setTimeout(function(){
					grid.resize();
				}, 500);		 			
			});
			baseURL = store.url;
			if(baseURL.indexOf("&") !== -1) {
				baseURL = baseURL.substring(0, baseURL.indexOf("&"));
			}
			if(baseURL.indexOf("EventsSearchAction") !== -1)
			{
			   if(baseURL.indexOf("?") !== -1) 
			   {
				   baseURL = baseURL.substring(0, baseURL.indexOf("?"));
			   }
			}
			
			form.getDescendants().forEach(function(field, i){
				if(field.name) {
					var value = field.get("value");
					if(dateRegex.test(field.declaredClass) || (timeRegex.test(field.declaredClass))) {
						value = field.get("displayedValue");
					}
					if(value === " ") {
						value = "";
					}
					queryOptions[field.get("name")] = value;
				}
			});
			
			//On search action the clean script should be call.
			var script = grid.onSelectionClearedScript;
			if (script){
				console.debug("[misys.grid._base] eval:", script);
				d.eval(script);
			}
			
			// If selectionMode not null, deselect all first then load new store
			// It is important to deselect first because listener may need store before 
			// it is discarded
			if (grid.selection && grid.get("selectionMode") != "") {
				grid.selection.clear();
			}
					
			store.close();
			store.url = baseURL;
			console.debug("[misys.grid._base] Resetting grid store URL to", store.url, queryOptions);
			grid.setStore(store, null, queryOptions);					
		}
	}
	
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
		if (that.get('value') === null) {
			return true;
		}
		console.debug('[Validate] Validating Effective From Date. Value = '+ that.get('value'));
		var creationToDate = dj.byId('effective_date_TO');
		if (!m.compareDateFields(that, creationToDate)) {
			var widget = dj.byId('effective_date_FROM');
				displayMessage = misys.getLocalization('EffectiveDateFromLesserThanEffectiveDateTo');
				widget.set("state","Error");
				dj.hideTooltip(widget.domNode);
				dj.showTooltip(displayMessage, widget.domNode, 0);
				misys._config.validSearchCheck = false;
				return false;	
		}
		misys._config.validSearchCheck = true;
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
		if (that.get('value') === null) {
			return true;
		}
		console.debug('[Validate] Validating Effective To Date. Value = '+ that.get('value'));
		var creationFromDate = dj.byId('effective_date_FROM');
		var currentDate = new Date();
		
		if ((!m.compareDateFields(creationFromDate, that)) || (that.get('value') > currentDate)) {
			var widget = dj.byId('effective_date_TO');
			  	displayMessage = misys.getLocalization('EffDateToLessThanCurrentAndGtrThanEffDateFrom');
		 		widget.set("state","Error");
		 		dj.hideTooltip(widget.domNode);
		 		dj.showTooltip(displayMessage, widget.domNode, 0);
		 		misys._config.validSearchCheck = false;
		 	return false;		
		}
		misys._config.validSearchCheck = true;
		return true;
	}
		
		
	dojo.subscribe('ready',function(){
		
		misys._config.validSearchCheck = true;
		m.connect("effective_date_FROM", "onBlur", _validateEffFromDate);
		m.connect("effective_date_TO", "onBlur", _validateEffToDate);
		
		if(d.byId('TransactionSearchForm1')) {
			m.connect('TransactionSearchForm1', "onSubmit",  function(/*Event*/ e){
				e.preventDefault();
				if(misys._config.validSearchCheck){
					_reloadGridWithSearchCriteria();
				}
				
				return false;
			});
			
		}
	});
})(dojo, dijit, misys);
//Including the client specific implementation
dojo.require('misys.client.binding.loan.loan_activity_inquiry_client');