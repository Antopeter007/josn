dojo.provide("misys.binding.cash.ktp.messagecenter.ktp_account_statement");

dojo.require("misys.binding.cash.ktp.common.ktp_common");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode
	
	var invalidMessageError;
	var invalidMessage;
	
	function _retrieveURLParameterValue(/*String*/ url, /*String*/ parameterName){
		var index = url.indexOf("?");
		var urlParameters = (index === -1 ? url.substring(index) : url);
		var parameters = urlParameters.split("&");
		var parameterValue = "";
		d.forEach(parameters, function(parameter){
			if (parameter.indexOf(parameterName) !== -1) {
				index = parameter.indexOf("=");
				if (index !== -1) {
					parameterValue = parameter.substring(index+1);
				}
			}
		});
		
		return parameterValue;
	}
	
	function  validateToDateRange()
	{
		if ((dj.byId("DU").get("value") !== "" && dj.byId("AU").get("value") !== "") && (dj.byId("DU").get("value") !== null && dj.byId("AU").get("value") !== null))
		{
			var from = dj.byId('DU');
			var to = dj.byId('AU');

			if (!m.compareDateFields(from, to))
			{
				invalidMessage = m.getLocalization("toDateGreaterThanFromDateError", [	dj.byId('AU').get("displayedValue"),	dj.byId('DU').get("displayedValue")]);
				dj.byId('AU').set("state","Error");
				dj.hideTooltip(dj.byId('AU').domNode);
				m.showTooltip(invalidMessage ,d.byId('AU'));
				return false;
			}
		}
	}

	function validateFromDateRange()
 	{
		if ((dj.byId("DU").get("value") !== "" && dj.byId("AU").get("value") !== "") && (dj.byId("DU").get("value") !== null && dj.byId("AU").get("value") !== null))
		{
			var from = dj.byId('DU');
			var to = dj.byId('AU');

			if (!m.compareDateFields(from, to)) {
				invalidMessage = m.getLocalization("fromDateLessThanToDateError", [dj.byId('DU').get("displayedValue"),dj.byId('AU').get("displayedValue") ]);
				dj.byId('DU').set("state", "Error");
				dj.hideTooltip(dj.byId('DU').domNode);
				m.showTooltip(invalidMessage, d.byId('DU'));
				return false;
			}
		}
	}
	
	function validateMinMaxvisibleAmt() {
		//  summary:
		 if(dj.byId("MontantMinMaxvisible") && dj.byId("MontantMinMax2visible") && (dj.byId("MontantMinMaxvisible").get("value") > dj.byId("MontantMinMax2visible").get("value")))
			{
				 invalidMessageError = m.getLocalization("maxAmountGreaterThanMinAmountError", [	dj.byId('MontantMinMaxvisible').get("displayedValue"),	dj.byId('MontantMinMax2visible').get("displayedValue")]);
				 dj.byId('MontantMinMaxvisible').set("state","Error");
				 dj.hideTooltip(dj.byId('MontantMinMaxvisible').domNode);
				 m.showTooltip(invalidMessageError ,d.byId('MontantMinMaxvisible'));
				return false;
			}
	}
	
	function validateMinMax2visibleAmt() {
		//  summary:
			if(dj.byId("MontantMinMaxvisible") && dj.byId("MontantMinMax2visible") && (dj.byId("MontantMinMax2visible").get("value") < dj.byId("MontantMinMaxvisible").get("value")))
			{
				invalidMessageError = m.getLocalization("maxAmountGreaterThanMinAmountError", [	dj.byId('MontantMinMax2visible').get("displayedValue"),	dj.byId('MontantMinMaxvisible').get("displayedValue")]);
				 dj.byId('MontantMinMax2visible').set("state","Error");
				 dj.hideTooltip(dj.byId('MontantMinMax2visible').domNode);
				 m.showTooltip(invalidMessageError ,d.byId('MontantMinMax2visible'));
				return false;
			}
	}
	
	d.mixin(m, {
		
		bind: function() {
			setTimeout(function(){
					m.connect("entity", "onChange", function(){
						dj.byId("ACCOUNT_NO").set("value", "");
					});
				}, 3000);
			m.connect("MontantMinMaxvisible", "onBlur", function() {
				validateMinMaxvisibleAmt();
			});
			m.connect("MontantMinMax2visible", "onBlur", function() {
				validateMinMax2visibleAmt();
			});
			m.connect("DU", "onBlur", function() {
				validateFromDateRange();
			});
			m.connect("AU", "onBlur", function() {
				validateToDateRange();
			});
		},
		
		onFormLoad: function() {
			// Set Account Number field value
			var url = window.location.href;
			var accountNumber = _retrieveURLParameterValue(url, "ktpaccountno");
			if (accountNumber !== "")
			{
				var accountNumberField = dj.byId("ACCOUNT_NO");
				accountNumberField.set("value", accountNumber);

				// Disable account search field, so that accounts can only be selected from the list of accounts
				accountNumberField.set("readOnly", true);
				
				// Retrieve entity from account number and populate entity field
				m.xhrPost({
					url: m.getServletURL("/screen/AjaxScreen/action/RetrieveEntityNameFromCustomerReferenceAction"),
					sync : true,
					handleAs : "json",
					content : {
						ktpaccountno : accountNumber
					},
					load: function(response, args)
					{
						if (response.entityAbbvName && response.entityAbbvName !== "")
						{
							dj.byId("entity").set("value", response.entityAbbvName);
							dj.byId("ACCOUNT_NO").set("value", accountNumber);
						}
					},
					error: function(response, args)
					{
						m.dialog.show("ERROR", m.getLocalization("retrieveEntityNameError"), "");
					}
				});
			}
		}
	});
	
	d.ready(function(){
		// Hide report description
		m.hideReportDescription();

		// Set grid cell formatters
		m.setGridCellFormatter();
		
		// Add formatter on LIBELLE field
		var gridLayout = m.searchGridLayout();
		if (gridLayout)
		{
			var cellDefinition = m.searchGridLayoutCellByFieldName(gridLayout, "LIBELLE");
			d.mixin(cellDefinition, {formatter: misys.ibanFormatter});
		}
	});
		
})(dojo, dijit, misys);