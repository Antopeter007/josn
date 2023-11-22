dojo.provide("misys.binding.cash.ktp.messagecenter.ktp_outstanding_loan");

dojo.require("dojo.data.ItemFileReadStore");
dojo.require("misys.binding.cash.ktp.common.ktp_common");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode

	d.mixin(m, {
		
		bind: function() {
			m.connect("centralizedEntity", "onChange", function(){
				var centralizedEntity = dj.byId("centralizedEntity").get("value");
				if (centralizedEntity && centralizedEntity != "")
				{
					// Retrieve list of centralizing entities from centralized entity
					m.xhrPost({
						url: m.getServletURL("/screen/AjaxScreen/action/RetrieveCentralizingEntities"),
						sync : true,
						handleAs : "json",
						content : {
							centralizedentity : centralizedEntity
						},
						load: function(response, args)
						{
							var entitiesStore = new d.data.ItemFileReadStore({data: response});
							entitiesStore.fetch();
							dj.byId("centralizingEntity").set("value", null);
							dj.byId("centralizingEntity").store.close();
							dj.byId("centralizingEntity").set("store", entitiesStore);
						},
						error: function(response, args)
						{
							m.dialog.show("ERROR", m.getLocalization("retrieveEntityNameError"), "");
						}
					});
				}
				else
				{
					// Set centralizing entities list with empty value only
					var entitiesJson = {"identifier": "value", "label": "name", "items": [{ "value": "", "name": ""}]};
					var centralizingEntitiesStore = new d.data.ItemFileReadStore({data: entitiesJson});
					centralizingEntitiesStore.fetch();
					dj.byId("centralizingEntity").set("value", null);
					dj.byId("centralizingEntity").store.close();
					dj.byId("centralizingEntity").set("store", centralizingEntitiesStore);
				}
			});
		},
				
		onFormLoad: function() {
			// Set entity fields to mandatory
			m.toggleRequired("centralizedEntity", true);
			m.toggleRequired("centralizingEntity", true);
			
			// Set centralizing entities list with empty value only
			var entitiesJson = {"identifier": "value", "label": "name", "items": [{ "value": "", "name": ""}]};
			var centralizingEntitiesStore = new d.data.ItemFileReadStore({data: entitiesJson});
			centralizingEntitiesStore.fetch();
			dj.byId("centralizingEntity").set("value", null);
			dj.byId("centralizingEntity").store.close();
			dj.byId("centralizingEntity").set("store", centralizingEntitiesStore);
			
			// Set default centralizing entities if applicable
			dj.byId("centralizedEntity").onChange();
			
			// Overwrite form isValid function
			dj.byId("TransactionSearchForm").isValid = function()
			{
				var isMandatoryFieldMissing = false;
				d.forEach(dj.byId("TransactionSearchForm").getDescendants(), function(field){
					if(field.required === true && field.get("value") === "")
					{
						isMandatoryFieldMissing = true;
					}
				});
				
				if (isMandatoryFieldMissing)
				{
					return false;
				}
				return dj.byId("TransactionSearchForm").state == "";
			};
		}
	});
	
	d.ready(function(){
		// Hide report description
		m.hideReportDescription();

		// Set grid cell formatters
		m.setGridCellFormatter();
	});
	
})(dojo, dijit, misys);