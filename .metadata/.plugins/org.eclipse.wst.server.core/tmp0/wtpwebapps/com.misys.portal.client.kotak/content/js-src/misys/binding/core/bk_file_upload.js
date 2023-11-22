dojo.provide("misys.binding.core.bk_file_upload");

dojo.require("dijit.form.FilteringSelect");
dojo.require("misys.form.common");
dojo.require("misys.validation.common");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dojo.data.ItemFileWriteStore");
dojo.require("misys.binding.cash.ft_common");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {
	
	function _sethiddenFields(){
		var fileTypeItem = dj.byId('upload_file_type').item;

		// set the additional information related to file types 
		// to hidden fields as these are needed by the data mapper 
		// for processing the uploaded file type
		if(fileTypeItem.formatName)
		{
			dj.byId("format_name").set("value",fileTypeItem.formatName);
		}
		if(fileTypeItem.mapCode)
		{
			dj.byId("map_code").set("value",fileTypeItem.mapCode);
		}
		if(fileTypeItem.formatType)
		{
			dj.byId("format_type").set("value",fileTypeItem.formatType);
		}
		if(fileTypeItem.ammendable)
		{
			dj.byId("amendable").set("value",fileTypeItem.ammendable);
		}
		if(fileTypeItem.fileEncrypted)
		{
			dj.byId("file_encrypted").set("value",fileTypeItem.fileEncrypted);
		}
		if(fileTypeItem.overrideDuplicateReference)
		{
			dj.byId("override_duplicate_reference").set("value",fileTypeItem.overrideDuplicateReference);
		}
		if(fileTypeItem.productGroup)
		{
			dj.byId("product_group").set("value",fileTypeItem.productGroup);
		}
		if(fileTypeItem.productType)
		{
			dj.byId("product_type").set("value",fileTypeItem.productType);
		}
		if(fileTypeItem.payRollType)
		{
			dj.byId("payroll_type").set("value",fileTypeItem.payRollType);
		}
		if(fileTypeItem.fileTypePermissoin)
		{
			dj.byId("file_type_permission").set("value",fileTypeItem.fileTypePermissoin);
		}
	}
	// check for the number of attachments in the form
	 function _checkForAttachments() {

		    //  summary:
		    //        Check which attachments have been added or deleted.
		    //  tags:
		    //        private
			
			console.debug('[bk_file_upload] Checking for lost attachments');
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
	 
	 function _onchangeCustomerBank(){
		 
		 var customerBank = dj.byId("customer_bank").get("value");
		 if(dj.byId("issuing_bank_abbv_name"))
		 {
			 dj.byId("issuing_bank_abbv_name").set("value",customerBank);
		 }
		 if(dj.byId("issuing_bank_name"))
		 {
			 dj.byId("issuing_bank_name").set("value",misys._config.customerBankDetails[customerBank][0].value);
		 }
		 if(misys && misys._config && misys._config.businessDateForBank && misys._config.businessDateForBank[customerBank] && misys._config.businessDateForBank[customerBank][0] && misys._config.businessDateForBank[customerBank][0].value !== '')
		 {
		 	var date = misys._config.businessDateForBank[customerBank][0].value;
			var yearServer = date.substring(0,4);
			var monthServer = date.substring(5,7);
			var dateServer = date.substring(8,10);
			date = dateServer + "/" + monthServer + "/" + yearServer;
			dj.byId("appl_date").set("value", date);
			
			if(document.getElementById('appl_date_view_row')){
				document.getElementById('appl_date_view_row').childNodes[1].innerHTML = date;
			}
		}
	 }
	 
	 
	  function _setApplicantReference()
		{
			if (dj.byId('applicant_reference') && dj.byId('issuing_bank_abbv_name') && dj.byId('entity') && dj.byId('entity').get('value') !== '')
			{
				var key = dj.byId('issuing_bank_abbv_name').get('value') + '_' + dj.byId('entity').get('value');
				// if the reference is exists
				if(m._config.customerReferences[key][1])
				{
					dj.byId('applicant_reference').set('value', m._config.customerReferences[key][1]);
				}
			}
		}
	  
	  function _setBulkTypes()
		{
			console.debug("[misys.binding.core.bk_file_upload] Bulk Method Start: _setBulkTypes");
			var entity, customerBank;
			
			if(dj.byId("entity"))
			{
				entity = dj.byId("entity").get("value");
			}
			else if(dj.byId("entity_hidden"))
			{
				entity = dj.byId("entity_hidden").get("value");
				if (entity === "")
				{
						entity = "*";
				}
			}
			else
			{
				entity = "*";
			}

			if(dj.byId("customer_bank"))
			{
				customerBank = dj.byId("customer_bank").get("value");
			}
			else if(dj.byId("issuing_bank_abbv_name") && dj.byId("issuing_bank_abbv_name").get("value") !== "")
			{
				customerBank = dj.byId("issuing_bank_abbv_name").get("value");
			}
			//dj.byId("bk_type").set("value","");
			if(entity !== "" && customerBank !=="")
			{
				dj.byId("bk_type").store = new dojo.data.ItemFileReadStore({
					data :{
						identifier : "value",
						label : "name",
						items : m._config.bkTypeCollection[customerBank][entity]
					}
				});
			}
		
			console.debug("[misys.binding.core.bk_file_upload] Bulk Method End: _setBulkTypes");
			
		}
		function _setPayRollTypes()
		{
			console.debug("[misys.binding.core.bk_file_upload] Bulk Method Start: _setPayRollTypes");
			var entity, customerBank;
			if(dj.byId("entity"))
				{
					entity = dj.byId("entity").get("value");
				}
			else if(dj.byId("entity_hidden"))
				{
					entity = dj.byId("entity_hidden").get("value");
					if (entity === "")
					{
							entity = "*";
					}
				}
			else
				{
					entity = "*";
				}
			if(dj.byId("customer_bank"))
			{
				customerBank = dj.byId("customer_bank").get("value");
			}
			else if(dj.byId("issuing_bank_abbv_name") && dj.byId("issuing_bank_abbv_name").get("value") !== "")
			{
				customerBank = dj.byId("issuing_bank_abbv_name").get("value");
			}
			if(dj.byId("payroll") && entity !== "" && customerBank !=="")
			{
				dj.byId("payroll").set("value","");
				
				dj.byId("payroll").store = new dojo.data.ItemFileReadStore({
					data :{
						identifier : "value",
						label : "name",
						items : m._config.payrollTypeCollection[customerBank][entity]
					}
				});
			}
			console.debug("[misys.binding.core.bk_file_upload] Bulk Method End: _setPayRollTypes");
			
		}
	
		
		function _setChildSubProduct()
		{
			console.debug("[misys.binding.core.create_bk] Bulk Method Start: _setChildSubProduct");
			var bkType = dj.byId("bk_type").get("value");
			var entity = dj.byId("entity") ? dj.byId("entity").get("value") : "*";
			var customerBank;
			if(dj.byId("customer_bank"))
			{
				customerBank = dj.byId("customer_bank").get("value");
			}
			else if(dj.byId("issuing_bank_abbv_name") && dj.byId("issuing_bank_abbv_name").get("value") !== "")
			{
				customerBank = dj.byId("issuing_bank_abbv_name").get("value");
			}
				dj.byId("upload_file_type").set("value","");
				if(bkType !== '' && bkType !== 'PAYRL')
				{
					dj.byId("upload_file_type").store = new dojo.data.ItemFileReadStore({
						data :{
							identifier : "value",
							items : m._config.childSubProductsCollection[customerBank][bkType][entity]
						}
					});
				}
				else if(bkType !== '' && customerBank!=="" )
				{
					
					var payrollType = dj.byId("payroll").get("value");
					if(payrollType !== '')
					{
						dj.byId("upload_file_type").store = new dojo.data.ItemFileReadStore({
							data :{
								identifier : "value",
								items : m._config.childSubProductsCollectionPayroll[customerBank][bkType][payrollType][entity] 
							}
						});
					}else
					{
						//set up the pay roll types if bk type is payroll
						_setPayRollTypes();
					}
				}
			
			console.debug("[misys.binding.core.bk_file_upload] Bulk Method End: _setChildSubProduct");
		}
		
		function _setfiletype()
		{
			if(dj.byId("entity"))
			{
				entity = dj.byId("entity").get("value");
			}
			else if(dj.byId("entity_hidden"))
			{
				entity = dj.byId("entity_hidden").get("value");
				if (entity === "")
				{
						entity = "*";
				}
			}
			else
			{
				entity = "*";
			}
			
			var customerBank;
			if(dj.byId("customer_bank"))
			{
				customerBank = dj.byId("customer_bank").get("value");
			}
			else if(dj.byId("issuing_bank_abbv_name") && dj.byId("issuing_bank_abbv_name").get("value") !== "")
			{
				customerBank = dj.byId("issuing_bank_abbv_name").get("value");
			}
			if(entity != "" && (m._config.childSubProductsCollection[customerBank] ||  m._config.childSubProductsCollectionPayroll[customerBank]))
			{
              dj.byId("upload_file_type").set("value","");
				
				var options = new dojo.data.ItemFileWriteStore({data: {identifier: 'value', items:[]}});
			   
			    var filetypearr=[];
			    if(m._config.childSubProductsCollection[customerBank] && m._config.childSubProductsCollection[customerBank]['PAYMT'] && m._config.childSubProductsCollection[customerBank]['PAYMT'][entity] !== undefined){
			    	//payments
				    for (var i=0; i < m._config.childSubProductsCollection[customerBank]['PAYMT'][entity].length; i++)
				    	{			    	
				    	filetypearr.push( m._config.childSubProductsCollection[customerBank]['PAYMT'][entity][i]);
				       }
			    }
			    //Collections
			    if(m._config.childSubProductsCollection[customerBank] && m._config.childSubProductsCollection[customerBank]["COLLE"] && m._config.childSubProductsCollection[customerBank]['COLLE'][entity] !== undefined){
			    	//Collections
				    for (var z=0; z < m._config.childSubProductsCollection[customerBank]["COLLE"][entity].length; z++)
				    	{			    	
				    	filetypearr.push( m._config.childSubProductsCollection[customerBank]["COLLE"][entity][z]);
				       }
			    }
			    
			    if(m._config.childSubProductsCollectionPayroll[customerBank] && m._config.childSubProductsCollectionPayroll[customerBank]['PAYRL'])
			    {
			    	//payroll empl
			    	if(m._config.childSubProductsCollectionPayroll[customerBank]['PAYRL']['EMPL'] && m._config.childSubProductsCollectionPayroll[customerBank]['PAYRL']['EMPL'][entity] !== undefined)
			    	{
			    		for (var j=0; j < m._config.childSubProductsCollectionPayroll[customerBank]['PAYRL']['EMPL'][entity].length; j++)
				    	{				    	
					    	filetypearr.push(m._config.childSubProductsCollectionPayroll[customerBank]['PAYRL']['EMPL'][entity][j]);				 
				    	}
			    	}
				    
				  //payroll exec
			    	if(m._config.childSubProductsCollectionPayroll[customerBank]['PAYRL']['EXEC'] && m._config.childSubProductsCollectionPayroll[customerBank]['PAYRL']['EXEC'][entity] !== undefined)
			    	{
			    		for (var k=0; k < m._config.childSubProductsCollectionPayroll[customerBank]['PAYRL']['EXEC'][entity].length; k++)
				    	{
				    		filetypearr.push(m._config.childSubProductsCollectionPayroll[customerBank]['PAYRL']['EXEC'][entity][k]);				 
				    	}
			    	}
			    }
			    
			    
				
				
			dj.byId("upload_file_type").set("value","");
			
					dj.byId("upload_file_type").store = new dojo.data.ItemFileReadStore({
						data :{
							identifier : "value",
					        items : filetypearr
						}
					});
					
					
			}		
				
			
			
		}
		
		function _clearFields(obj)
		{
			dj.byId("upload_description").set("value", "");
			dj.byId("reference").set("value", "");
			if(misys._config.isMultiBank && obj.id!=="customer_bank")
			{
			    dj.byId("customer_bank").set("value", "");
			}
			if(dj.byId("format").get("value")==='STANDARD')
			{
				dj.byId("bk_type").set("value", "");
				dj.byId("payroll").set("value","");
			}
			dj.byId("upload_file_type").set("value", "");
		}
		
		
		
	
	d.mixin(m, {
		onFormLoad : function() {
			m.animate("wipeOut", d.byId('payrolltype'));
		//	_setApplicantReference();	
			if(!misys._config.isMultiBank)
			{
			  if(dj.byId("format").get("value")==='STANDARD')
				{
					_setBulkTypes();
					_setPayRollTypes();		
					d.style('payrolltype','display','none');
						}
					else if(dj.byId("format").get("value")==='FLEXI')
						{		
						_setfiletype();
				}
			}
			
			
			if(misys._config.isMultiBank)
			{
	    		m.populateCustomerBanks(true);
				var linkedBankField = dj.byId("customer_bank");
				var linkedBankHiddenField = dj.byId("customer_bank_hidden");
				var entity = dj.byId("entity");
				if(linkedBankField && linkedBankHiddenField)
				{
					linkedBankField.set("value", linkedBankHiddenField.get("value"));
				}
				if(dj.byId("issuing_bank_abbv_name") && dj.byId("issuing_bank_abbv_name").get("value") !== "")
				{
					linkedBankField.set("value", dj.byId("issuing_bank_abbv_name").get("value"));
					linkedBankHiddenField.set("value", dj.byId("issuing_bank_abbv_name").get("value"));
				}
				if(entity && entity.get("value") === "" && linkedBankField)
				{
					linkedBankField.set("disabled",true);
					linkedBankField.set("required",false);
				}
			}
		},
		bind : function() {
			m.connect("upload_file_type", "onChange", _sethiddenFields);
		
			
			m.connect("entity", "onChange", function(){
				_clearFields(this);
				var customerBankField;
				if(misys._config.isMultiBank){
					customerBankField = dj.byId("customer_bank");
					if(misys._config.isMultiBank && dj.byId("customer_bank")){
						customerBankField.set("value", "");
						m.populateCustomerBanks();
					}
				}
				else
					{
						if(dj.byId("format").get("value")==='STANDARD')
						{
							_setBulkTypes();
							_setPayRollTypes();		
							d.style('payrolltype','display','none');
						}
						else if(dj.byId("format").get("value")==='FLEXI')
						{		
							_setfiletype();
						}
					}
				
			});
			m.connect("customer_bank", "onChange", function(){
				_clearFields(this);
				_onchangeCustomerBank();
				m.animate("wipeOut", d.byId('payrolltype'));
				if(dj.byId("format").get("value")==='STANDARD')
					{
					_setBulkTypes();
					}
					else if(dj.byId("format").get("value")==='FLEXI')
						{
					_setfiletype();
						}
				
				dj.byId("customer_bank_hidden").set("value",dj.byId("customer_bank").get("value"));
				var issuingBankAbbvName = dj.byId("issuing_bank_abbv_name");
				var issuingBankDescName = dj.byId("issuing_bank_name");
				issuingBankAbbvName.set("value", dj.byId("customer_bank").get("value"));
				if(misys._config.customerBankDetails && issuingBankDescName.get("value") === "")
				{	
					issuingBankDescName.set("value", misys._config.customerBankDetails[dijit.byId('customer_bank').get("value")][0].value);
				}	
			});
			
			m.connect("payroll", "onChange", function() {
				_setChildSubProduct();
			});
			
			m.connect("bk_type", "onChange", function(){
				if(this.get("value") === "PAYMT") 
				{
					m.animate("wipeOut", d.byId('payrolltype'));
				}
				else if(this.get("value") === "PAYRL") 
				{
					m.animate("wipeIn", d.byId('payrolltype'));
				}
				
				_setChildSubProduct();
			});
		},
		beforeSubmitValidations : function(){ 
			
			return _checkForAttachments();
		}
	});	
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.core.bk_file_upload_client');