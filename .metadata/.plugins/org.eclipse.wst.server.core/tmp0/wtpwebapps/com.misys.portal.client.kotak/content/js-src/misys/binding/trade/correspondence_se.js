dojo.provide("misys.binding.trade.correspondence_se");

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
dojo.require("misys.form.file");
dojo.require("misys.form.SimpleTextarea");
dojo.require("misys.widget.Collaboration");
dojo.require("misys.form.common");
dojo.require("misys.validation.common");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode
	
	d.mixin(m._config, {

		initReAuthParams : function() {
									
			var reAuthParams = {
				productCode : 'SE',	
				subProductCode : '',
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
			if(count>5){
				m._config.onSubmitErrorMsg = m.getLocalization("mandatoryMaximumFileUploadTypeError");				
				numOfFiles = false;
			}
			
			return numOfFiles;
		}
	  
		/**
		 * To populate File types based on entity Selection
		 */
		function _getFileTypesPackage(){
			var entity = dj.byId("entity") ? dj.byId("entity").get("value") : "";
			if(dj.byId("upload_file_type") != null){
			dj.byId("upload_file_type").set("value","");
			}
			m.xhrPost({
				url : m.getServletURL("/screen/AjaxScreen/action/GetFileTypesForEntities"),
				handleAs : "json",
				content : {
				      entity : entity
				},
				load : _populateProducts,
			    customError : function(response, ioArgs) {

			            //fncMyErrorCallback(response) ; 
			    	 console.error('[misys.binding.trade.correspondence_se] Technical error while getting File types for Entity', response);
			    }		    
			});
		}

		function _populateProducts(response, ioArgs)
		{
		    var availableProductSelectWidget = dj.byId("upload_file_type");
		    var index = 1;
		    misys._config.reportTypeArray = [];
		    availableProductSelectWidget.store = new d.data.ItemFileReadStore({ data: response});		    
		    dj.byId("upload_file_type").set("value", dj.byId("selected_upload_file_type").get("displayedValue"));	
		    dj.byId("margin_act_name").set("value", dj.byId("selected_margin_act_name").get("displayedValue"));
		    dj.byId("margin_act_no").set("value", dj.byId("selected_margin_act_no").get("displayedValue"));
		    
			
			misys._config.reportTypeArray["report"] = [];
		    availableProductSelectWidget.store.fetch({query: {ID: '*'}, 
		        onComplete: function(items, request){
		         dojo.forEach(items, function(item){
		          var value = item['flag'];
		            console.debug("[Accounts Data Grid] Deleting the charging account item "+value);
		          	misys._config.reportTypeArray["report"][index] = new Array();
					misys._config.reportTypeArray["report"][index].description = item['name'];
					misys._config.reportTypeArray["report"][index].flag = item['flag'];
					misys._config.reportTypeArray["report"][index].fileSystemName = item['fileSystemName'];
					misys._config.reportTypeArray["report"][index].fileTypeName = item['fileTypeName'];
					index++;
		         }, this);
		        }});
		    misys.hasAccount();
		} 
	// Public functions & variables follow
	d.mixin(m, {		
		
		hasAccount : function() {
			var accountFlagDiv = d.byId("account-flag");
			var selectedReportType=dj.byId("upload_file_type").get("value");
			for(var i in misys._config.reportTypeArray)
			{
				for(var j=1;j< misys._config.reportTypeArray[i].length;j++)
				{
					if(misys._config.reportTypeArray[i][j] && misys._config.reportTypeArray[i][j].description == selectedReportType)
					{
						if(misys._config.reportTypeArray[i][j].flag == "Y")
						{													
							dj.byId("margin_act_name").set("disabled", false);
							m.toggleRequired('margin_act_name', true);
							//d.style("margin_account_img","visibility","visible");
						}
						else
						{	
							dj.byId("margin_act_name").set("value", "");
							dj.byId("margin_act_name").set("disabled", true);
							m.toggleRequired('margin_act_name', false);
							//d.style("margin_account_img","visibility","hidden");
						}
						dj.byId("file_type_name").set("value",misys._config.reportTypeArray[i][j].fileTypeName);
						dj.byId("file_system_name").set("value",misys._config.reportTypeArray[i][j].fileSystemName);
					}
				}
			}
		},		

		bind : function() {
		
			if(dj.byId("bank_abbv_name"))	
			{
				dj.byId("bank_abbv_name").set("value", "");
			}
				var customerBankName = "" ;
				m.connect("issuing_bank_abbv_name", "onChange", m.populateReferences);
				m.connect("issuing_bank_abbv_name", "onChange", function(){
					var customer_bank = dj.byId("issuing_bank_abbv_name").get("value"); 
					if(dj.byId("bank_abbv_name"))
					{
						dj.byId("bank_abbv_name").set("value", customer_bank);
					}
					if(customer_bank && customer_bank !== customerBankName )
					{
						dj.byId("margin_act_name").set("value","");
					}
					if(misys && misys._config && misys._config.businessDateForBank && misys._config.businessDateForBank[customer_bank] && misys._config.businessDateForBank[customer_bank][0] && misys._config.businessDateForBank[customer_bank][0].value !== "")
					{
						var date = misys._config.businessDateForBank[customer_bank][0].value;
						var yearServer = date.substring(0,4);
						var monthServer = date.substring(5,7);
						var dateServer = date.substring(8,10);
						date = dateServer + "/" + monthServer + "/" + yearServer;
						if(misys && misys._config && misys._config.option_for_app_date === "SCRATCH")
						{
							dj.byId("appl_date").set("value", date);
							document.getElementById('appl_date_view_row').childNodes[1].innerHTML = date;
						}
					}
				});
				m.connect("margin_act_name", "onChange", function(){
					if(misys._config.nickname==="true" && misys._config.option_for_app_date!=="PENDING"){
						if(dj.byId("margin_act_nickname") && dj.byId("margin_act_nickname").get("value")!=="" ){
							d.byId("nickname").innerHTML = dj.byId("margin_act_nickname").get("value");
							d.style("nickname", "display", "inline");
						}else{
							d.style("nickname", "display", "none");
						}
					}
				});
				
				if(dj.byId("entity"))
				{
					m.connect("entity", "onChange",function(){
						_getFileTypesPackage();
						if(dj.byId("issuing_bank_abbv_name"))
						{
							dj.byId("issuing_bank_abbv_name").onChange();
						}
					});						
				}else{
					_getFileTypesPackage();
				}
				
				m.connect("upload_file_type", "onChange", m.hasAccount);
				
				m.connect("issuing_bank_customer_reference","onChange",function(){
				     //set applicant reference
				     if(dj.byId("applicant_reference"))
				     {
				      var reference = this.get("value");
				      dj.byId("applicant_reference").set("value",reference);
				     }
				    });
				m.connect("margin_act_name", "onChange", function(){
					if(dj.byId("issuing_bank_abbv_name"))
					{
						customerBankName = misys._config.customerBankName ;
					}
				});
				
		},

		onFormLoad : function() {	
			
				_getFileTypesPackage();					
				var issuingBankCustRef = dj.byId("issuing_bank_customer_reference_temp");
				var tempReferenceValue;
				if(issuingBankCustRef){
					tempReferenceValue = issuingBankCustRef.value;
				}
				// Populate references
				var issuingBankAbbvName = dj.byId("issuing_bank_abbv_name");
				if(issuingBankAbbvName)
				{
					issuingBankAbbvName.onChange();
				}
				issuingBankCustRef =  dj.byId("issuing_bank_customer_reference");
				if(issuingBankCustRef)
				{
					issuingBankCustRef.onChange();
					issuingBankCustRef.set('value',tempReferenceValue);
				}

		},
		
		beforeSaveValidations : function(){
			var entity = dj.byId("entity") ;
			if(entity && entity.get("value") == "")
			{
				return false;
			}
			else
			{
				return true;
			}
		},
		
		beforeSubmitValidations : function(){
				
			return _checkForAttachments();
		}
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.trade.correspondence_se_client');