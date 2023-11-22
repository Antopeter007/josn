dojo.provide("misys.binding.system.beneficiary_upload_mc");

dojo.require("dojo.data.ItemFileReadStore");
dojo.require("dijit.form.FilteringSelect");
dojo.require("misys.validation.login");
dojo.require("misys.form.MultiSelect");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("misys.form.common");
dojo.require("misys.validation.common");
dojo.require("misys.form.CurrencyTextBox");
dojo.require("dojox.xml.DomParser");
dojo.require("dojox.grid.EnhancedGrid");
dojo.require("dojox.grid.enhanced.plugins.IndirectSelection");
dojo.require("dojox.grid.enhanced.plugins.Filter");

//TODO - Add method level comments and run lint

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {
	
	dojo.ready(function(){
		//	m.connect("showHideFailedRecords", "onClick", _showHideFailedRecords);
			dojo.mixin(m, {
				toggleFailedRecordsGrid : function(){
					var downArrow = d.byId("actionDown");
					var upArrow = d.byId("actionUp");
					var failedRecDiv = d.byId("failedRecords");
					if(d.style("failedRecords","display") === "none")
					{
						m.animate('wipeIn',failedRecDiv);
						d.style('actionDown',"display","none");
						d.style('actionUp',"display","block");
						d.style('actionUp', "cursor", "pointer");
					}
					else
					{
						m.animate('wipeOut',failedRecDiv);
						d.style('actionUp',"display","none");
						d.style('actionDown',"display","block");
						d.style('actionDown', "cursor", "pointer");
					}
				}
			});
		});
	
	
	 function _checkForAttachments() {

		    //  summary:
		    //        Check which attachments have been added or deleted.
		    //  tags:
		    //        private
			
			console.debug('[FormEvents] Checking for lost attachments');
			var attIdsField = dj.byId('attIds');
			var numOfFiles = false;
			var count = 0;
			if(attIdsField)
			{
					var grids = [dj.byId('attachment-file'), dj.byId('attachment-fileOTHER')];
					d.forEach(grids, function(gridContainer){
						if(gridContainer &&  gridContainer.grid) {
							var arr = gridContainer.grid.store._arrayOfAllItems;
							d.forEach(arr, function(attachment, i){
								if(attachment !== null) {
									numOfFiles = true;
									count++;
								}
							});
						}
					});
			}
			if(numOfFiles == false){
				m._config.onSubmitErrorMsg = m.getLocalization("mandatoryMinimumFileUploadTypeError");				
			}
			if(count>1){
				m._config.onSubmitErrorMsg = m.getLocalization("mandatoryMaximumFileUploadTypeError");				
				numOfFiles = false;
			}
			
			return numOfFiles;
		}
	  
	
	d.mixin(m, {
	beforeSubmitValidations : function(){
		if(dijit.byId("realform_operation") && dijit.byId("realform_operation").get("value") !== "DELETE_FEATURES") {
			return _checkForAttachments();
		}
		else {
			return true;
		}
	}
	});
	
	d.mixin(m._config, {

		initReAuthParams : function() {
									
			var reAuthParams = {
				productCode : 'BU',	
				subProductCode : dj.byId("product_type").get("value"),
				transactionTypeCode : '01',	
				entity : dj.byId("entity") ? dj.byId("entity").get("value") : '',
				currency : '',				
				amount : '',
								
				es_field1 : '',
				es_field2 : ''				
			};
			return reAuthParams;
		}
	});
	
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.system.beneficiary_upload_mc_client');