dojo.provide("misys.binding.system.company_mc");

dojo.require("dojo.data.ItemFileReadStore");
dojo.require("dijit.form.FilteringSelect");
dojo.require("dijit.layout.TabContainer");
dojo.require("misys.validation.login");
dojo.require("misys.validation.password");
dojo.require("misys.form.common");
dojo.require("misys.form.addons");
dojo.require("misys.validation.common");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.NumberTextBox");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.CheckBox");
dojo.require("misys.form.SimpleTextarea");
dojo.require("dijit.layout.ContentPane");
dojo.require("misys.form.MultiSelect");
dojo.require("dojox.xml.DomParser");
dojo.require("dojox.xml.parser");
/**
 * @class common
 * @param d
 * @param dj
 * @param m
 */

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {
	var notOnFormLoad = true;
	
	//Update the account dialog customer reference dropdown with the list of customer references
	function _changeCustReferencesList(/*to remove reference */ removeReference, /*is from onload*/fromFormLoad, /*actionType*/ actionType, /*String*/ _suffix){
		
		var jsonData;
		/*If there are duplicate customer references in the same profile ie in multibank scenario where the reference.multibank.allow_duplicates is set as true ,
		then setting the id as identifier in JSON data will throw exception while creating an ItemFileWriteStore. */ 
		if(dj.byId("owner_id").get("value")==="2")
			{
				jsonData = {"items" : []};
			}
		else
			{
				jsonData = {"identifier" :"id", "items" : []};
			}
		
		var refsStore = new dojo.data.ItemFileWriteStore( {data : jsonData });
		var defaultReference = dj.byId('default_reference');
		var existingRefs = dj.byId('customer_reference');
			existingRefs.store = null;
		d.forEach(m._config.availBanks, function(suffix, idx){
		//	var suffix = _suffix || dj.byId("bank_name_abbv").get('value');	
			var typeItems 	= [],
				typeValues 	= [];
			var tableName = "customerReference_"+suffix+"-master-table";
			var rowName = "customerReference_"+suffix+"_row_";
			var referenceArray = [];

			var refTable = dojo.byId(tableName);
			if(refTable)
			{
				dojo.query(" #"+tableName+" > tbody > tr").forEach(function(node,index){
					//identify is it a reference row
					var referenceId = dojo.attr(node,"id");
					if( referenceId && referenceId.indexOf(rowName)!== -1)
					{
						if(dojo.query(" #"+tableName+" > tbody > tr#"+referenceId+" > td:first-child > div")[0])
						{
							var reference = dojox.html.entities.decode(dojo.query(" #"+tableName+" > tbody > tr#"+referenceId+" > td:first-child > div")[0].innerHTML);
							if(!removeReference || (removeReference && reference !== removeReference))
							{
								typeItems.push(reference);
								typeValues.push(reference);
							}
						}
					}
				});
			}
			 
			for(var j = 0; j < typeItems.length; j++){
				if((typeValues[j] && typeValues[j] !== "") && (typeItems[j] && typeItems[j] !== ""))
				 {
					refsStore.newItem( {"id" : typeValues[j], "name" : typeItems[j]});
					referenceArray.push({"value" : typeValues[j], "name" : typeItems[j]});
				 }	
			}
			
			misys._config.custRefPerBank[suffix] = referenceArray ;
			
		});
		
		existingRefs.store = refsStore;
		if(defaultReference){

            defaultReference.store = refsStore;

         }
		//If only reference size is '0' then its not a mandatory field
		//if references size is 1 then default and make mandatory
		//if references size is  greater than 1 then set default empty and make mandatory
		if(refsStore && defaultReference)
		{
			if((!actionType && removeReference) || (actionType && removeReference && dj.byId("default_reference") && actionType === 'delete'))
			{
				if(removeReference === dj.byId("default_reference").get("value"))
				{
					defaultReference.set("displayedValue", "");
				}
			}
			
			if(refsStore._arrayOfTopLevelItems.length === 0)
			{
				defaultReference.set("displayedValue", "");
			}
		}
		
		if(fromFormLoad && dj.byId("default_reference_hidden") && defaultReference)
		{
			dj.byId("default_reference").set("value", dj.byId("default_reference_hidden").get("value"));
		}
		_modifyAccountsGridRecords();
	}
	
	function _modifyRelatedRecords(actionType, reference, suffix)
	{
		if(m._config.isBankGroupLogin)
			{
				_modifyAccountsGridRecordsWithBank(actionType, reference,suffix);
			}
		else
			{
				_modifyAccountsGridRecords(actionType, reference);
			}
		
		if(actionType === 'delete')
		{
			_changeCustReferencesList(reference, null, actionType, suffix);
		}else{
			_changeCustReferencesList();
		}
		
	}
	/**
	 * <h4>Summary:</h4>
	 *  This method is to get Account Types per bank, with bank as key and Account Types as values
	 *  <h4>Description:</h4> 
	 *  This method is to get Account Types per bank, with bank as key and Account Types as values. It will be used only for MultiBank
	 *  @method _getAccountTypeByBank
	 * 
	 */
	function _getAccountTypeByBank()
	{
		if(dj.byId("bank_abbv_name") && m._config.accountTypesPerBank && dj.byId("bank_account_type"))
			{
				var bankAbbvName = dj.byId("bank_abbv_name").get("value"),
				
				bankAccountTypeWidget = dj.byId("bank_account_type"),
				
				accountTypeStore= m._config.accountTypesPerBank[bankAbbvName];
				if(!misys._config.isOpenDialog)
					{	
						bankAccountTypeWidget.set("value","");
						bankAccountTypeWidget.store = new dojo.data.ItemFileReadStore(
								{
									data :
									{
										identifier : "value",
										label : "name",
										items : {}
									}
								});
					}
				if (accountTypeStore)
				{
					
					bankAccountTypeWidget.store = new dojo.data.ItemFileReadStore(
					{
						data :
						{
							identifier : "value",
							label : "name",
							items : accountTypeStore
						}
					});
					bankAccountTypeWidget.fetchProperties =
					{
						sort : [
						{
							attribute : "name"
						} ]
					};
				}
			}
	}
	
	
	/**
	 * <h4>Summary:</h4>
	 *  This method is to get Customer Account Types per bank, with bank as key and Account Types as values
	 *  <h4>Description:</h4> 
	 *  This method is to get Account Types per bank, with bank as key and Account Types as values. It will be used only for MultiBank
	 *  @method _getCustomerAccountTypeByBank
	 * 
	 */
	function _getCustomerAccountTypeByBank()
	{
		if(dj.byId("bank_abbv_name") && m._config.customerAccountTypesPerBank && dj.byId("cust_account_type"))
			{
				var bankAbbvName = dj.byId("bank_abbv_name").get("value"),
				
				customerAccountTypeWidget = dj.byId("cust_account_type"),
				
				customerAccountTypeStore= m._config.customerAccountTypesPerBank[bankAbbvName];
				if(!misys._config.isOpenDialog)
					{	
						customerAccountTypeWidget.set("value","");
						customerAccountTypeWidget.store = new dojo.data.ItemFileReadStore(
								{
									data :
									{
										identifier : "value",
										label : "name",
										items : {}
									}
								});
					}
				if (customerAccountTypeStore)
				{
					
					customerAccountTypeWidget.store = new dojo.data.ItemFileReadStore(
					{
						data :
						{
							identifier : "value",
							label : "name",
							items : customerAccountTypeStore
						}
					});
					customerAccountTypeWidget.fetchProperties =
					{
						sort : [
						{
							attribute : "name"
						} ]
					};
				}
			}
	}
	
	/**
	 * <h4>Summary:</h4>
	 *  This method is to get Product Types per bank, with bank as key and Product Types as values
	 *  <h4>Description:</h4> 
	 *  This method is to get Product Types per bank, with bank as key and Product Types as values. It will be used only for MultiBank
	 *  @method _getProdcutTypesByBank
	 * 
	 */
	function _getProdcutTypesByBank()
	{
		if(dj.byId("bank_abbv_name") && m._config.productTypesPerBank && dj.byId("account_product_type"))
			{
				var bankAbbvName = dj.byId("bank_abbv_name").get("value"),
				
				accountProdTypeWidget = dj.byId("account_product_type"),
				
				productTypeStore= m._config.productTypesPerBank[bankAbbvName];
				if(!misys._config.isOpenDialog)
				{
					accountProdTypeWidget.set("value","");
					accountProdTypeWidget.store = new dojo.data.ItemFileReadStore(
							{
								data :
								{
									identifier : "value",
									label : "name",
									items : {}
								}
							});
				}
				
				if (productTypeStore)
				{
					
					accountProdTypeWidget.store = new dojo.data.ItemFileReadStore(
					{
						data :
						{
							identifier : "value",
							label : "name",
							items : productTypeStore
						}
					});
					accountProdTypeWidget.fetchProperties =
					{
						sort : [
						{
							attribute : "name"
						} ]
					};
				}
			}
	}
	
	/**
	 * <h4>Summary:</h4>
	 *  This method is to get Customer references per bank, with bank as key and Customer references as values
	 *  <h4>Description:</h4> 
	 *  This method is to get Customer references per bank, with bank as key and Customer references as values. It will be used only for MultiBank
	 *  @method _getCustRefByBank
	 * 
	 */
	function _getCustRefByBank()
	{
		if(dj.byId("bank_abbv_name") && misys._config.custRefPerBank && dj.byId("customer_reference"))
			{
				var bankAbbvName = dj.byId("bank_abbv_name").get("value"),
				
				custRefWidget = dj.byId("customer_reference"),
				
				custRefStore= m._config.custRefPerBank[bankAbbvName];
				if(!misys._config.isOpenDialog)
				{
					custRefWidget.set("value","");
					custRefWidget.store = new dojo.data.ItemFileReadStore(
							{
								data :
								{
									identifier : "value",
									label : "name",
									items : {}
								}
							});
				}
				
				if (custRefStore)
				{
					
					custRefWidget.store = new dojo.data.ItemFileReadStore(
							{
								data :
								{
									identifier : "value",
									label : "name",
									items : custRefStore
								}
							});
					custRefWidget.fetchProperties =
					{
						sort : [
						{
							attribute : "name"
						} ]
					};
				}
			}
	}
	
	//If any existing reference is updated then update the already linked account on account grid
	function _updateAccountsRecords(oldReference, newReference)
	{
		var accountGrid = dj.byId("accounts-grid"),
			accountGridStore;
		if(accountGrid)
		{
			accountGridStore = accountGrid.store;
		}
		
		if(oldReference && newReference && accountGridStore)
		{
			var rows = accountGridStore._arrayOfTopLevelItems.length;
			  accountGridStore.fetch({query : {store_id : '*'},
					onComplete : function(items, request) {
						dojo.forEach(items, function(item) {
							if (item.customer_reference[0] === oldReference) 
							{
								item.customer_reference[0] = newReference;
								accountGridStore.save(item);
							}
						});
						if (accountGrid) 
						{
							accountGrid._refresh();
						}
					}
				});
		}
	}

	//To validate duplicate customer reference on customer reference table
	// For a multibank profile, the reference should be unique across all banks
	// The param isSameRefUpdate denotes whether an existing reference is being edited - in this case, so not compare again with existing refs
	function _validateDuplicateCustomerReference(/* row */ i) {
		
		var forWarningMsg = true;
		var custRef="customer_reference_";
		var nosend="nosend";
		var backOffice="_details_back_office_";
		var duplicate_across_banks = dj.byId("duplicate_across_banks")?dj.byId("duplicate_across_banks").get("value"):"false";
		var refObj , refValue, backOfficeData;
		var bankAbbvName = dj.byId('bank_name_abbv').get('value');
		var ownerId =  dj.byId('company_id').get('value');
		var currentRow = m._config.currentAddonId;
		
		
		if(i=== 0 )
		{
			var str="customerReference_"+ bankAbbvName + "_details_reference_"+nosend;
			backOfficeData = dj.byId(custRef + bankAbbvName + "_details_reference_"+currentRow);
		}
		else
		{
			str="customerReference_"  + bankAbbvName + backOffice + i + "_"+nosend;
			backOfficeData = dj.byId(custRef + bankAbbvName + backOffice + i + "_"+currentRow);
		}
		refObj = dj.byId(str);

		var oldRef= backOfficeData? backOfficeData.get('value'): undefined;
		
		if(refObj)
		{
			refValue = refObj.get("value");
		}
		else
		{
			refValue= undefined;
		}
		
		if(oldRef !== undefined || refValue !== undefined){
			// Customer reference should be checked for duplicity even if oldvalue = newvalue
			// This is beacuse the oldvalue may have already got used when this record is being edited
			var sameRefUpdate = (oldRef !== refValue);						
			 condition1 = sameRefUpdate && refValue !== undefined && isDuplicateReferenceAdding(refValue, ownerId, i, sameRefUpdate,bankAbbvName,forWarningMsg);
			 condition2 = !sameRefUpdate && oldRef != undefined && isDuplicateReferenceAdding(oldRef, ownerId, i, sameRefUpdate,bankAbbvName,forWarningMsg);
		}
	
		if (condition1 || condition2) 
		{
			displayMessage = misys.getLocalization('DuplicateReferenceWarning');
			dj.hideTooltip(refObj.domNode);
			m.showTooltip(displayMessage,refObj.domNode, 0, 1000);
		}
	}
	
	//To validate duplicate customer reference on customer reference table
	// For a multibank profile, the reference should be unique across all banks
	// The param isSameRefUpdate denotes whether an existing reference is being edited - in this case, so not compare again with existing refs
	function isDuplicateReferenceAdding(/* newRef */newRef, /* ownerId */ownerId, /* index */index, /* boolean */ isSameRefUpdate,/*bank abbrivate name*/bankAbbvName, /*boolean*/ forWarningMsg) {
		var duplicateFound = false;
		var custRef="customer_reference_";
		var backOffice="_details_back_office_";
		var duplicate_across_banks = dj.byId("duplicate_across_banks")?dj.byId("duplicate_across_banks").get("value"):"false";
		var refTable,counter,reference,rowName,tableName;
		
		if(duplicate_across_banks === "true")
		{
			if(isSameRefUpdate)
			{			
				rowName = "customerReference_" + bankAbbvName + "_row_";
				tableName = "customerReference_" + bankAbbvName + "-master-table";
				refTable = dojo.byId(tableName);
				counter=refTable?refTable.rows.length:0;
				for(var i= 0;i<counter;i++)
				{
					if(index===0)
					{
						reference = dj.byId(custRef + bankAbbvName + "_details_reference_"+ i);
					}
					else
					{
						reference = dj.byId(custRef + bankAbbvName + backOffice + index +"_"+ i);
					}
					console.debug("validating the duplicate : newRef",newRef," reference:",reference);
					if (newRef && reference && reference.get('value').toUpperCase() === newRef.toUpperCase()) 
					{
						console.debug("duplicate found inside loop index :",index);
						duplicateFound = true;
					}	
				}
			}
		}
		else{
			d.forEach(m._config.availBanks, function(suffix, idx){
				rowName = "customerReference_" + suffix + "_row_";
				tableName = "customerReference_" + suffix + "-master-table";
				refTable = dojo.byId(tableName);
				counter=refTable?refTable.rows.length:0;
				var skip=false;
				if (refTable && newRef) 
				{
					/*skip the loop for the bank for which the same record is updated*/ 
					if(!isSameRefUpdate && suffix === bankAbbvName)
						{
							skip=true;
						}
					if(refTable && !skip)
					{
						for(var i= 0;i<counter;i++)
						{
							if(index===0)
							{
								reference = dj.byId(custRef + suffix + "_details_reference_"+ i);
							}
							else
							{
								reference = dj.byId(custRef + suffix + backOffice + index +"_"+ i);
							}
							console.debug("validating the duplicate : newRef",newRef," reference:",reference);
							if (newRef && reference && reference.get('value').toUpperCase() === newRef.toUpperCase()) 
							{
								console.debug("duplicate found inside loop index :",index);
								duplicateFound = true;
							}			
						}
					}
				}
			});
			}		
			
		if(!duplicateFound)
		{
			m.xhrPost({
				url : m.getServletURL("/screen/AjaxScreen/action/ValidateDuplicateCustomerReference"),
				sync : true,
				handleAs : "json",
				content: { 
					CUSTOMER_REFERENCE: newRef,
					BANK_ID: ownerId,
					INDEX: index,
					boType: misys._config.backOfficeConfig[index],
					bank:bankAbbvName,
					COMPANY_ID : dijit.byId("company_id").get("value"),
					FOR_WARNING_MESSAGE : forWarningMsg
					},
				load : function(response, args){
					duplicateFound = response.responseFlag;
				},
				error : function(response, args){
					//Should be prevent from submitting when there is a error ?
					//isValid = false;
					console.error("[misys.grid._base] isDuplicateReferenceAdding error", response);
				}
			});
		}
		
		
		return duplicateFound;
	}
	//To validate duplicate account number on account grid
	function _isDuplicateAccountFound(/* accountNumber */accountNumber, /* ownerType*/ ownerType) {
		var accountGrid,
			accountGridStore,
			duplicateFound = false;
		accountGrid = dj.byId("accounts-grid");
		if(accountGrid)
		{
			accountGridStore = accountGrid.store;
		}
		
		if(accountNumber && accountGridStore)
		{
			var storeId = accountGrid.gridMultipleItemsWidget.dialog.storeId;
			var rows = accountGridStore._arrayOfTopLevelItems.length;
			  accountGridStore.fetch({query : {store_id : "*"},
					onComplete : function(items, request) {
						dojo.forEach(items, function(item) {
							if (item.account_number[0] === accountNumber && item.owner_type[0] === ownerType) 
							{
								if(item.store_id[0] !== storeId){
									duplicateFound = true;
								}
								
							}
						});
					}
				});
		}
		return duplicateFound;
	}
	
	function _modifyAccountsGridRecords(/* edit or delete */actionType,
			changedReference) {
		var accountGridStore;
		var chargeAccountStore;
		var accountGrid = dj.byId("accounts-grid");
		var chargeAccount = dj.byId("charge_account");
		if (accountGrid) {
			accountGridStore = accountGrid.store;
		}
		if (chargeAccount) {
			chargeAccountStore = chargeAccount.store;
		}
		
		if (changedReference && accountGridStore) 
		{
			var rows = accountGridStore._arrayOfTopLevelItems.length;
			if("delete" === actionType && chargeAccount && chargeAccountStore)
			{
				var deletedRows = chargeAccountStore._arrayOfTopLevelItems.length;
				var item = chargeAccountStore._arrayOfTopLevelItems;
				var j=0;
				for(var i=0; i< deletedRows; i++)
				{
					if(accountGridStore._arrayOfTopLevelItems[i].customer_reference[0] === changedReference)
					{
						var k = i-j;
						if(item[k].name[0] === accountGridStore._arrayOfTopLevelItems[i].account_number[0])
						{
							chargeAccountStore.deleteItem(item[k]);
							j=j+1;
						}
					}
				}
				if(chargeAccountStore._arrayOfTopLevelItems.length === 0)
				{
					dj.byId("charge_account").set("value","");
				}
				else
				{
					dj.byId("charge_account").set("value",chargeAccountStore._arrayOfTopLevelItems[0].name[0]);
				}
			}
			accountGridStore.fetch({query : {store_id : '*'}, 
				onComplete : function(items, request) {
					dojo.forEach(items, function(item) {
						if (item.customer_reference[0] === changedReference) 
						{
							accountGridStore.deleteItem(item);
						}
					});
					if(accountGridStore)
					{
						accountGridStore.save();
					}
				}
			});
		}
	}
	
	function _modifyAccountsGridRecordsWithBank(/* edit or delete */actionType,
			changedReference,bankName) {
		var accountGridStore;
		var accountGrid = dj.byId("accounts-grid");
		if (accountGrid) {
			accountGridStore = accountGrid.store;
		}

		if (changedReference && accountGridStore) 
		{
			var rows = accountGridStore._arrayOfTopLevelItems.length;

			accountGridStore.fetch({query : {store_id : '*'}, 
				onComplete : function(items, request) {
					dojo.forEach(items, function(item) {
						if (item.bank_abbv_name[0] === bankName && item.customer_reference[0] === changedReference) 
						{
							accountGridStore.deleteItem(item);
						}
					});
					if(accountGridStore)
					{
						accountGridStore.save();
					}
				}
			});
		}
	}
		
	function _getCustomerDetails(suffix, boType) {
		// summary:
		//		Look for information about customer reference (check action)
		var _suffix = suffix || "";
		var myID = "customerReference_"+suffix+"_details_back_office_" + boType + "_nosend";
		var thisField = dj.byId(myID);
		var customerRef = thisField ? thisField.get("value") : "";
		var isInErrorState = (thisField && thisField.get("state") === "Error") ? true: false;
		
		var bank = suffix;
		
		var regex =  new RegExp("^[0-9]{1,11}$");
		
		if(isInErrorState){
			// Avoid unnecessary ajax calls on Fields, which are in Error state.
			return;
		}
				
	
		if(customerRef.length !== 0){
		if((misys._config.backOfficeConfig[boType]==="TMA" || misys._config.backOfficeConfig[boType]==="LBO")?true:regex.test(customerRef)){	
			m.xhrPost({
				url : m.getServletURL("/screen/AjaxScreen/action/CustomerDetailsSearchAction"),
				handleAs : "json",
				content : {
					customer_reference 	: customerRef,
					boType 				: misys._config.backOfficeConfig[boType],
					bank 				: suffix
				},
				load : function(response,args){
					_showCheckField(response,_suffix, myID);
				},
				error : function(response, args){
					//Should be prevent from submitting when there is a error ?
					//isValid = false;
					console.error(response);
					}
				});
			}
		else 
			{		
				console.debug("[misys.validation.common] Validating Treasury Customer", customerRef);
				dj.byId("customerReference_"+suffix+"_details_back_office_" + boType + "_nosend").set("value","");				
				var displayMessage = 	misys.getLocalization("numericCustId");
				var field = 	dj.byId("customerReference_"+suffix+"_details_back_office_" + boType + "_nosend");
				field.focus();
				field.set("state","Error");
				dijit.showTooltip(displayMessage,field.domNode, 0);
				_clearCheckDiv(suffix);
			}
		}
		if((misys._config.backOfficeConfig[boType]!=="TMA" && misys._config.backOfficeConfig[boType]!=="LBO") && (customerRef.length > 10)){
			dj.byId("customerReference_"+suffix+"_details_back_office_" + boType + "_nosend").set("value","");					
			displayMessage = 	misys.getLocalization('lengthTreasuryCustomerField');
			field = 	dj.byId("customerReference_"+suffix+"_details_back_office_"+ boType +"_nosend");
			field.focus();
			field.set("state","Error");
			dijit.showTooltip(displayMessage,field.domNode, 0);
		}
		if(customerRef.length === 0){
			
			dj.byId("customerReference_"+suffix+"_details_back_office_" + boType + "_nosend").set("value","");
			displayMessage = 	misys.getLocalization('emptyField');
			field    = dj.byId("customerReference_"+suffix+"_details_back_office_" + boType + "_nosend");		
			field.focus();
			field.set("state","Error");
			dijit.showTooltip(displayMessage,field.domNode, 0);
			_suffix = _suffix === "" ? "" : "_"+_suffix;
			var checkDiv = d.byId("check_details"+_suffix);
			if (checkDiv){
				checkDiv.innerHTML = "";
			}			
		}
	}
	
	
	function _validateMaxUploadLimit() {
		//validates the field max upload with the property services.UploadService.size.max saved in turbine.preoperties
		var field = dj.byId("attachment_max_upload_size");
		if(field)
		{
			if(field.get("value") < 0){
				return false;
			}
			var maxSizeEntered = field.get("value") * 1048576;
			var maxSizeAllowed = parseInt(dj.byId("upload_size_max").get("value")/1048576, 10);
			if(maxSizeEntered > dj.byId("upload_size_max").get("value"))
			{
				field.invalidMessage = m.getLocalization("invalidMaxUploadSize", [ maxSizeAllowed ]);
				return false; 
				//dj.showTooltip(, field.domNode, 0);
				//field.set("state", "Error");
				//field._setStateClass();
				//dj.setWaiState(field.focusNode, "invalid", "true");
			}
		}
		return true; 
	}
	/**
	 * <h4>Summary:</h4>
	 * Create a list of all the banks which are checked or selected. It is only for MultiBank.
	 * @method _createBankOptions
	 */
	function _createBankOptions() {
		
		var bankAbbvNameWidget = dj.byId("bank_abbv_name");
		misys._config.isOpenDialog = false;
		var banksarrList = m._config.availBanks || new Array();
		if(bankAbbvNameWidget)
		{
			for(var j = 0, len = banksarrList.length; j < len; j++)
			{
				//var bankAbbvName = {'name': banksarrList[j],'value':banksarrList[j]};
				var bankAbbvName = banksarrList[j];
				// Include references only if Bank is attached
				if(! dj.byId("bank_enabled_"+bankAbbvName).get("checked"))
				{
					if(misys._config.attachedBanks && misys._config.attachedBanks.indexOf(bankAbbvName) !== -1)
					{
						misys._config.attachedBanks.splice(misys._config.attachedBanks.indexOf(bankAbbvName),1);
					}
				}
				else
				{
					if(misys._config.attachedBanks && misys._config.attachedBanks.indexOf(bankAbbvName) === -1)
						{
							misys._config.attachedBanks.push(bankAbbvName);
						}
				}
			}
			var banksAbbvNameStore = [];
			for(var k = 0, count = misys._config.attachedBanks.length; k < count; k++)
			{
				var bankObj = {'name': misys._config.attachedBanks[k],'value':misys._config.attachedBanks[k]};
				banksAbbvNameStore.push(bankObj);
			}
			
			if (banksAbbvNameStore)
			{
				
				bankAbbvNameWidget.store = new dojo.data.ItemFileReadStore(
				{
					data :
					{
						identifier : "value",
						label : "name",
						items : banksAbbvNameStore
					}
				});
				bankAbbvNameWidget.fetchProperties =
				{
					sort : [
					{
						attribute : "name"
					} ]
				};
			}
		}
	}
	
	// Validates the field TMA proprietary Id 
	function _validateTmaPropId(tmaBoRef)
	{
		var propIdSeparator = dijit.byId("proprietary_Separator").get('value');
		var tmaField = dijit.byId(tmaBoRef);
		var isValid;
		var tmaValue = tmaField?tmaField.get("value"):"";
		var propIdAndIdType = tmaValue?tmaValue.split(propIdSeparator):"";
		var propId = propIdAndIdType[0]; // Proprietary Id
		var propIdType = propIdAndIdType[1]; // Proprietary Id Type
		var hideTT;
		var tmaValLength = tmaValue.length;
		var isSeprtrPositionInvalid = tmaValue.indexOf(propIdSeparator)=== 0 || tmaValue.indexOf(propIdSeparator)=== tmaValLength-1 || tmaValue.indexOf(propIdSeparator)=== -1 ;
		var isSeprtrAppearsMoreThanTwice = propIdAndIdType && propIdAndIdType.length > 2 ;

        // The valid TMA Proprietary Id format should not start and end with propIdSeparator and must contain propIdSeparator and maximum length of Id and IdType individually could be 35.
        if(tmaValue !== "" && (isSeprtrPositionInvalid || isSeprtrAppearsMoreThanTwice)){
			tmaField.state = "Error"; 
			console.debug("TMA Proprietary Id invalid format");
			tmaField._setStateClass();
			dj.setWaiState(tmaField.focusNode, "invalid", "true");
			dj.hideTooltip(tmaField.domNode);
			dj.showTooltip(m.getLocalization("invalidPrtryIdTypeFormat",[propIdSeparator]), tmaField.domNode, 0);
			hideTT = function() {
				dj.hideTooltip(tmaField.domNode);
			};
			setTimeout(hideTT, 5000);
			m._config.errorField = tmaField;
			isValid = false;
		}
		else if(propId && propId.length > 35 || propIdType && propIdType.length > 35)
		{
			console.debug("ProprietaryId and ProprietaryType should be less than or equal to 35");
			tmaField.state = "Error"; 
			tmaField._setStateClass();
			dj.setWaiState(tmaField.focusNode, "invalid", "true");
			dj.hideTooltip(tmaField.domNode);
			dj.showTooltip(m.getLocalization("lengthTMAField"), tmaField.domNode, 0);
			hideTT = function() {
				dj.hideTooltip(tmaField.domNode);
			};
			setTimeout(hideTT, 5000);
			m._config.errorField = tmaField;
			isValid = false;
		}

		else 
		{
			m._config.errorField = null;
			isValid = true;
		}
		return isValid;		   
	}
		
		
	function _custReferenceAccountModify(/*String*/ suffix){
		var field = dj.byId("customerReference_"+suffix+"_details_reference_nosend")? dj.byId("customerReference_"+suffix+"_details_reference_nosend") : "";
		var message = "";
		if(m.customerRefDialogTempValue && m.customerRefDialogTempValue !== field.get("value")) {
			message = misys.getLocalization("resetAccountReferenceChange",[field.get("value")]);
			dj.hideTooltip(field.domNode);
			dj.showTooltip(message,field.domNode, 0);
		}
	}	
		
		
	function _showCheckField(/*Json*/ response, /*String*/ suffix, myID) {
		// summary:
		//	Display information about customer reference
		var _suffix = suffix || "";
		_suffix = _suffix === "" ? "" : "_"+_suffix;
		var checkDiv = d.byId("check_details"+_suffix),
			content = "";
		
		// TODO Should try to avoid building HTML in JavaScript via String manipuilation, use
		//		dojo.create instead, adding it to a container DIV and then inserting its 
		//		innerHTML into the page
		// TODO Also, what is the purpose of the <span> below? 
		switch(response.STATUS_CODE)
		{
			case "OK":	
				d.forEach(response.RESPONSE, function(refs) {
					d.forEach(refs, function(res, index) {
						if (index === 0) {
							content += "<span>" + res + "</span>";
						}
						else if (res) {
							content += "<br>" + res;
							_removeFromChangedMap(suffix, myID);
						}
					});
					content += "<br><br>";
				});
				break;
				
			case "NOT_OK":
				content =response.ERROR_DETAILS; 
				break;
				
			case "OK_DETAILS":	
				d.forEach(response.RESPONSE, function(refs) {
					d.forEach(refs, function(res, index) {
						if (index === 0) {
							content += "<span>" + res + "</span>";
							_removeFromChangedMap(suffix, myID);
						}						
					});
					content += "<br><br>";
				});
				break;
				
			default : 
				break;
		}
		switch(response.isliquidityenabled)
		{
			case "Y":
				//dj.byId('liquidityenabledflag').set("value", "Y");	
				dj.byId("customerReference_" + suffix + "_details_liquidityenabledflag_nosend").set("value", "Y");
				break;
				
			case "N":
				dj.byId("customerReference_" + suffix + "_details_liquidityenabledflag_nosend").set("value", "N");
				break;
				
			default : 
				break;
		}
	
		checkDiv.innerHTML = content;
	   _showSaveButton(suffix);
		
		// TODO This is not localized, so the if guard will not work in other languages
		
		if(content !== "<span>No Customer Details Found</span><br><br>"){
			checkDiv.setAttribute("display", "inline-block");
		}
		
		
	}
	
	function _showSaveButton(/*String*/ suffix) {
		//	summary:
		//		Check if we have to display the save button
		var _suffix = suffix || "";
		_suffix = _suffix === "" ? "" : "_"+_suffix;
	      if(dj.byId("customerDetailsEnabled").get("value") === "true") {

			// TODO This is not localized, so the guard will not work in other languages
			var treasuryCustRefValue = d.byId("customerReference_"+suffix+"_details_back_office_2_nosend").value;
			if(dojo.trim(treasuryCustRefValue).length !== 0)
			{
				if(	d.byId("customerReference_"+suffix+"_details_nosend") === null && 
					d.byId("customerReference_"+suffix+"_details_description_nosend") === null)
				{
					dj.byId("addCustomerReferenceButton_"+suffix).set("disabled", false);
				}
				else
				{
					dj.byId("addCustomerReferenceButton_"+suffix).set("disabled", true);
				}
			}
			else
			{
				dj.byId("addCustomerReferenceButton_"+suffix).set("disabled", false);
			}
		}
	}

	function _changeCustomerReference(/*String*/ suffix) {
		// summary:
		//		TODO
		
		// TODO This is an unnecessary function, in my opinion
		
		_clearCheckDiv();
		_showSaveButton(suffix);
	}

	function _exitCustomerReferenceDialog(/*String*/ _suffix) {
		// summary:
		//		TODO
		var suffix = _suffix || "";
		_clearCustomerReferenceDialogFields(suffix);
		if(dj.byId("customerDetailsEnabled").get("value") === "true") {
			dj.byId("addCustomerReferenceButton_"+suffix).set("disabled", true);
		}
		misys.hideTransactionAddonsDialog("customerReference");
	}
	
	function _clearCheckDiv(/*String*/ suffix) {
		// summary:
		//		TODO
		var _suffix = suffix || "";
		_suffix = _suffix === "" ? "" : "_"+_suffix;
		var checkDiv = d.byId("check_details"+_suffix);
		if (checkDiv){
			checkDiv.innerHTML = "";
		}
	}
	
	function _clearCustomerReferenceDialogFields(/*String*/ suffix) {
		// summary: 
		//		TODO
		
		_clearCheckDiv(suffix);
		dj.byId("customerReference_"+suffix+"_details_description_nosend").set("value", "");
	//	dj.byId("customerReference_"+suffix+"_details_description_nosend").blur;
		dj.byId("customerReference_"+suffix+"_details_reference_nosend").set("value", "");
	//	dj.byId("customerReference_"+suffix+"_details_reference_nosend").blur;
	}
	
	function _addGroupRecord(/*String*/ dom, /*String*/ abbvNodeName, /*String*/ nodeName)
	{
		//  summary:
		//          Adds a group record to the XML
	    //  tags:
	    //         private
		var abbvNode = dom.getElementsByTagName(abbvNodeName)[0],
			node = dom.getElementsByTagName(nodeName)[0],
			abbvName = "",
			roleXml = [],
			roleArray = new Array();
		
		if(abbvNode)
		{
			var abbvChildNode = abbvNode.childNodes[0];
			if(abbvChildNode && abbvChildNode.nodeValue)
			{
				abbvName = abbvChildNode.nodeValue;
			}
	    }
		if(node)
		{
			var childNode = node.childNodes[0];
			if(childNode && childNode.nodeValue)
			{
				roleArray = childNode.nodeValue.split(',');
			}
	    }
		roleXml.push("<group_record><group_abbv_name>",abbvName,"</group_abbv_name>");
		if(roleArray.length > 0)
		{
			dojo.forEach(roleArray, function(role){
				   if(role !== null && role !== "")
				   {
					   roleXml.push("<existing_roles><role><name>",role,"</name></role></existing_roles>");
				   }
			});
		}
		roleXml.push("</group_record>");
		return roleXml.join("");
	}
	
	function _addBankDescRecord(/*Dijit*/ bankList)
	{
		//  summary: 
		//            Adds a bank record to the XML
	    //  tags:
	    //            private
			var bankXml = [];

		if(bankList.length > 0)
		{
			dojo.forEach(bankList, function(bank){
				if(bank !== null && bank !== "")
				{
					var chkBoxButton = "bank_enabled_"+bank;
					var checkBoxEnabled = dijit.byId(chkBoxButton).get("checked");
					if(checkBoxEnabled)
					{
						var bankFullName = d.byId("bank_desc_"+bank).innerHTML;
						var bankDesc = dojo.trim(bankFullName.split("(")[0]);
						bankXml.push("<bank_desc_record><bank_abbv_name>",bank,"</bank_abbv_name>");   
						bankXml.push("<bank_name>",bankDesc,"</bank_name>");
						bankXml.push("</bank_desc_record>");
					}
			    }
			});
		}
		return bankXml.join("");
	}
	
	/* Bank attachment change handler
	 * If a Bank is selected, the Customer Reference section is expanded. If a Bank is deselected, display a message if Customer References exist
	 */
	function _bankAttachChangeHandler(/*String*/ suffix){
		var bankAttachedField = dj.byId("bank_enabled_"+suffix);
		var isBankAttached = bankAttachedField.get("checked");
		if(isBankAttached)
		{
			m.toggleReferenceSection(suffix, "down");
		}
		else
		{
			if(m._config["customerReference_" + suffix + "Attached"] > 0)
			{
				var displayMessage = "";
				if(m._config.isBankGroupLogin)
					{
						displayMessage = misys.getLocalization('detachedBankHasCustRefAccounts');
					}
				else
					{
						displayMessage = misys.getLocalization('detachedBankHasCustRef');
					}
				dj.showTooltip(displayMessage, bankAttachedField.domNode, 0);
				setTimeout(function(){
					dj.hideTooltip(bankAttachedField.domNode);
				}, 2000);
			}
			m.toggleReferenceSection(suffix, "up");
		}	
	}
	
	function _deleteAccountReleatedToABank(/*String*/ suffix){
		var bankAttachedField = dj.byId("bank_enabled_"+suffix);
		var isBankAttached = bankAttachedField.get("checked");
		if(!isBankAttached)
		{
			var accountGridStore;
			var accountGrid = dj.byId("accounts-grid");
			if (accountGrid) {
				accountGridStore = accountGrid.store;
			}

			if (suffix && accountGridStore) 
			{
				var rows = accountGridStore._arrayOfTopLevelItems.length;

				accountGridStore.fetch({query : {store_id : '*'}, 
					onComplete : function(items, request) {
						dojo.forEach(items, function(item) {
							if (item.bank_abbv_name[0] === suffix) 
							{
								accountGridStore.deleteItem(item);
							}
						});
						if(accountGridStore)
						{
							accountGridStore.save();
						}
					}
				});
			}
		
		}
	}
		
	
	function _addToChangedMap(/* String */ suffix, /* String */ changedField, /* String */ bo_type){
		if(dj.byId("checkCustomerReferenceButton_"+bo_type+"_"+suffix))
		{
			if(dj.byId(changedField).get("value") !== "")
			{
				var changedMap = misys._config.CustomerReferenceChangedMap;
				var temparr;
				if(changedMap[suffix])
				{
					temparr  = changedMap[suffix];
					if(temparr.indexOf(changedField) === -1)
					{
						temparr.push(changedField);
					}
				}
				else
				{
					temparr = [];
					temparr.push(changedField);
				}
				changedMap[suffix] = temparr; 
				misys._config.CustomerReferenceChangedMap = changedMap;
			}
			else
			{
				_removeFromChangedMap(suffix, changedField);
			}
		}
	}
	
	
	function _removeFromChangedMap(/* String */ suffix, /*String*/ changedField){
		
		var changedMap = misys._config.CustomerReferenceChangedMap;
		var temparr  = changedMap[suffix];
		if(temparr)
		{
			var index = temparr.indexOf(changedField);
			if(index !== -1)
			{
				temparr.splice(index,1);
			}
			changedMap[suffix] = temparr; 
		}
	}
	
	function _clearChangedMap(/*String*/ suffix)
	{
		var changedMap = misys._config.CustomerReferenceChangedMap;
		changedMap[suffix] = []; 
	}
	
	function _checkConfirmPassword(){
		m.checkConfirmPassword("password_value","password_confirm");
	}
	
	/*function to change the reference drop down widget store*/
	function _changeReferenceDropdown(){
		var singleBank;
		var singleRef;
		if(dojo.query('#liq_bank_row .content')[0]){
			singleBank = dijit.byId(dojo.query('#liq_bank_row .content')[0]).innerHTML;
		}
		if(dojo.query('#liq_ref_row .content')[0]){
			singleRef = dijit.byId(dojo.query('#liq_ref_row .content')[0]).innerHTML;
		}
		
		var bankName = dijit.byId("liq_bank") ? dijit.byId("liq_bank").get("value") : singleBank;
		var referenceWidget = dijit.byId("liq_ref") ? dijit.byId("liq_ref") : singleRef;
		var referenceDataStore = (bankName!=="" && bankName!==undefined) ? m._config.bankCustomerReference[bankName]:"";
		if(singleRef===undefined){
			if(referenceWidget)
			{
				dijit.byId("liq_ref").displayedValue= "";
				dijit.byId("liq_ref").set("value", "");
				referenceWidget.store = null;
			}
			if(referenceDataStore && referenceWidget!=undefined){
				referenceWidget.store = new dojo.data.ItemFileReadStore({
					data :
					{
						identifier : "value",
						label : "name",
						items : referenceDataStore
					}
				});
				referenceWidget.fetchProperties =
				{
					sort: [
					{
						attribute : "name"
					}]
				};
				if(referenceDataStore.length == 1){
					if(m._config.liquidityData=="" || m._config.liquidityData == undefined){
						_getLiquidityFeatures();
					}
					referenceWidget.set("value", referenceDataStore[0].value);
	//				while(m._config.liquidityData !== "" || m._config.liquidityData !== undefined){
	//					
	//				}
					_populateDataForLiq(bankName, referenceDataStore[0].value);
				}
			}
		}else{
			_populateDataForLiq(bankName, singleRef);
			misys.toggleLiqReferenceSection('bank','down');
		}
	}
	
	
	function _populateDataForLiq( /*String */ bankName, /*String */ reference){
		var bankSpecific ="";
		try {
			bankSpecific = JSON.parse( misys._config.liquidityData[bankName][reference]);
			var liqFields = dojo.query('#ref_liq_bank .column-wrapper .field');
			var structureInnerHtml = '<ul style="display:table-cell;">';
			var typeOfExecutionInnerHtml = '<ul style="display:table-cell;">';
			var triggerEventHTML = '<ul style="display:table-cell;">';
			var accountTypesHTML= '<ul style="display:table-cell;">';
			var entityTypesHTML= '<ul style="display:table-cell;">';
			var multibankSupportedHTML= '<ul style="display:table-cell;">';
			var interAccountTrackingHTML= '<ul style="display:table-cell;">';
			var nonLiveHTML= '<ul style="display:table-cell;">';
			var crossBorderHTML= '<ul style="display:table-cell;">';
			var multiCurrencyHTML= '<ul style="display:table-cell;">';
			var currencyHTML= '<ul style="display:table-cell;">';
			var sweepBackHTML= '<ul style="display:table-cell;">';
			misys._config.liquidityFileds.fields.forEach(function(item, index){
				var temp ="";
				if(item==="structuretype"){
					if(bankSpecific[item]!==""){
						m.animate("fadeIn", dojo.byId("structuretype_row"));
						dojo.byId("structuretype_row").removeAttribute("hidden");
						bankSpecific[item].split(',').forEach(function(type){
							temp+= '<li>'+type+'</li>';
						});
					}else{
						m.animate("fadeOut", dojo.byId("structuretype_row"));
						dojo.byId("structuretype_row").setAttribute("hidden", true);
					}
					structureInnerHtml += temp;
					temp="";
					return;
				}
				if(item==="executiontype"){
					if(bankSpecific[item]!==""){
						m.animate("fadeIn", dojo.byId("executiontype_row"));
						dojo.byId("executiontype_row").removeAttribute("hidden");
						bankSpecific[item].split(',').forEach(function(type){
							temp+= '<li>'+type+'</li>';
						});
					}else{
						m.animate("fadeOut", dojo.byId("executiontype_row"));
						dojo.byId("executiontype_row").setAttribute("hidden", true);
					}
					typeOfExecutionInnerHtml += temp; 
					temp="";
					return;
				}
				if(item==="eventtriggertype" ){
					if(bankSpecific[item]!==""){
						m.animate("fadeIn", dojo.byId("balance_row"));
						dojo.byId("balance_row").removeAttribute("hidden");
						bankSpecific[item].split(',').forEach(function(type){
							temp+= '<li>'+type+'</li>';
						});
					}else{
						m.animate("fadeOut", dojo.byId("balance_row"));
						dojo.byId("balance_row").setAttribute("hidden", true);
					}
					triggerEventHTML += temp;
					temp="";
					return;
				}
				if(item==="accounts" ){
					if(bankSpecific[item]!==""){
						m.animate("fadeIn", dojo.byId("accounts_row"));
						dojo.byId("accounts_row").removeAttribute("hidden");
						bankSpecific[item].split(',').forEach(function(type){
							temp+= '<li>'+type+'</li>';
						});
					}else{
						m.animate("fadeOut", dojo.byId("accounts_row"));
						dojo.byId("accounts_row").setAttribute("hidden", true);
					}
					accountTypesHTML += temp;
					temp="";
					return;
				}
				if(item==="entitytype" ){
					if(bankSpecific[item]!==""){
						m.animate("fadeIn", dojo.byId("entity_type_row"));
						dojo.byId("entity_type_row").removeAttribute("hidden");
						temp =  '<li>'+bankSpecific[item]+'</li>';
					}else{
						m.animate("fadeOut", dojo.byId("entity_type_row"));
						dojo.byId("entity_type_row").setAttribute("hidden", true);
					}
					entityTypesHTML += temp; 
					temp="";
					return;
				}
				if(item==="multibank" ){
					if(bankSpecific[item]!==""){
						m.animate("fadeIn", dojo.byId("multibank_row"));
						dojo.byId("multibank_row").removeAttribute("hidden");
						temp = '<li>'+bankSpecific[item]+'</li>';
					}else{
						m.animate("fadeOut", dojo.byId("multibank_row"));
						dojo.byId("multibank_row").setAttribute("hidden", true);
					}
					multibankSupportedHTML += temp; 
					temp="";
					return;
				}
				if(item==="interaccounttrack" ){
					if(bankSpecific[item]!==""){
						m.animate("fadeIn", dojo.byId("inter_account_track_row"));
						dojo.byId("inter_account_track_row").removeAttribute("hidden");
						temp = '<li>'+bankSpecific[item]+'</li>';
					}else{
						m.animate("fadeOut", dojo.byId("inter_account_track_row"));
						dojo.byId("inter_account_track_row").setAttribute("hidden", true);
					}
					interAccountTrackingHTML += temp; 
					temp="";
					return;
				}
				if(item==="nonlive" ){
					if(bankSpecific[item]!==""){
						m.animate("fadeIn", dojo.byId("non_live_row"));
						dojo.byId("non_live_row").removeAttribute("hidden");
						temp = '<li>'+bankSpecific[item]+'</li>';
					}else{
						m.animate("fadeOut", dojo.byId("non_live_row"));
						dojo.byId("non_live_row").setAttribute("hidden", true);
					}
					nonLiveHTML += temp; 
					temp="";
					return;
				}
				if(item==="crossborder" ){
					if(bankSpecific[item]!==""){
						m.animate("fadeIn", dojo.byId("cross_border_row"));
						dojo.byId("cross_border_row").removeAttribute("hidden");
						temp = '<li>'+bankSpecific[item]+'</li>';
					}else{
						m.animate("fadeOut", dojo.byId("cross_border_row"));
						dojo.byId("cross_border_row").setAttribute("hidden", true);
					}
					crossBorderHTML += temp; 
					temp="";
					return;
				}
				if(item==="multicurrency" ){
					if(bankSpecific[item]!==""){
						m.animate("fadeIn", dojo.byId("multi_currency_row"));
						dojo.byId("multi_currency_row").removeAttribute("hidden");
						temp = '<li>'+bankSpecific[item]+'</li>';
					}else{
						m.animate("fadeOut", dojo.byId("multi_currency_row"));
						dojo.byId("multi_currency_row").setAttribute("hidden", true);
					}
					multiCurrencyHTML += temp; 
					temp="";
					return;
				}
				if(item==="currency" ){
					if(bankSpecific[item]!==""){
						m.animate("fadeIn", dojo.byId("currency_row"));
						dojo.byId("currency_row").removeAttribute("hidden");
						bankSpecific[item].split(',').forEach(function(type){
							temp+= '<li>'+type+'</li>';
						});
					}else{
						m.animate("fadeOut", dojo.byId("currency_row"));
						dojo.byId("currency_row").setAttribute("hidden", true);
					}
					currencyHTML += temp; 
					temp="";
					return;
				}
				if(item==="sweepback" ){
					if(bankSpecific[item]!==""){
						m.animate("fadeIn", dojo.byId("sweep_back_row"));
						dojo.byId("sweep_back_row").removeAttribute("hidden");
						bankSpecific[item].split(',').forEach(function(type){
							temp+= '<li>'+type+'</li>';
						});
					}else{
						m.animate("fadeOut", dojo.byId("sweep_back_row"));
						dojo.byId("sweep_back_row").setAttribute("hidden", true);
					}
					sweepBackHTML += temp; 
					temp="";
					return;
				}
			});
			structureInnerHtml+='</ul>';
			typeOfExecutionInnerHtml+='</ul>';
			triggerEventHTML+='</ul>';
			accountTypesHTML+='</ul>';
			entityTypesHTML+='</ul>';
			multibankSupportedHTML+='</ul>';
			interAccountTrackingHTML+='</ul>';
			nonLiveHTML+='</ul>';
			crossBorderHTML+='</ul>';
			multiCurrencyHTML+='</ul>';
			sweepBackHTML+='</ul>';
			currencyHTML+='</ul>';
			dojo.query('#structuretype_row .content')[0].innerHTML =  structureInnerHtml;
			dojo.query('#currency_row .content')[0].innerHTML= currencyHTML;
			dojo.query('#executiontype_row .content')[0].innerHTML =  typeOfExecutionInnerHtml;
			dojo.query('#balance_row .content')[0].innerHTML = triggerEventHTML;
			dojo.query('#accounts_row .content')[0].innerHTML = accountTypesHTML;
			dojo.query('#entity_type_row .content')[0].innerHTML = entityTypesHTML;
			dojo.query('#multibank_row .content')[0].innerHTML = multibankSupportedHTML;
			dojo.query('#inter_account_track_row .content')[0].innerHTML = interAccountTrackingHTML;
			dojo.query('#non_live_row .content')[0].innerHTML = nonLiveHTML;
			dojo.query('#cross_border_row .content')[0].innerHTML = crossBorderHTML;
			dojo.query('#multi_currency_row .content')[0].innerHTML= multiCurrencyHTML;
			dojo.query('#sweep_back_row .content')[0].innerHTML= sweepBackHTML;
	    } catch(e) {
	        console.error("JSON Parse Exception occured in misys._config.liquidityData[bankName]");
	    }
	}
	
	function _getLiquidityFeatures ()
	{
		var companyId;
		if(dj.byId("company_id") && dj.byId("company_id").get("value")!=="")
		{
			companyId = dj.byId("company_id").get("value");
		}
		if(companyId && companyId!=="")
		{
			m.xhrPost( {
				url : m.getServletURL("/screen/AjaxScreen/action/GetLiquidityFeaturesAction"),
				handleAs : "json",
				sync : true,
				content : {
					company_id : companyId,
					company_name: dj.byId("abbv_name").get("value")
				},
				load : function(data){
					m._config.liquidityData = data;
				}
			});
		}
	}
	
	
	// Public functions & variables follow
	d.mixin(m, {
		
		addCustomerReference : function(/* String */customerReference, /* id */ownerId, /*String*/ suffix) 
		{		
			var forWarningMsg = false;
			var temparr = misys._config.CustomerReferenceChangedMap[suffix];
		
			if(temparr && temparr.length > 0)
			{
				var errorField = dj.byId(temparr[0]);
				displayMessage = misys.getLocalization('invalidCustomerReference');
				errorField.focus();
				errorField.set("state", "Error");
				dj.hideTooltip(errorField.domNode);
				dj.showTooltip(displayMessage,errorField.domNode, 0);
				return;
			}
			var _suffix = suffix || "";
			var currentRow = m._config.currentAddonId;
			var tableName = "customerReference_"+ _suffix+ "-master-table";
			var rowName = "customerReference_"+_suffix+"_row_";
			var refTable = dojo.byId(tableName);
			var oldRef, newRef;
			
			var customerReferenceField = dj.byId("customerReference_"+_suffix+"_details_reference_nosend");
			if (customerReferenceField) 
			{
				newRef = customerReferenceField.get("value");
			}
			
			var bankAbbvName=_suffix;
			var arrayCustomerRef="customerReference";
			var custRef="customer_reference_";
			var backOffice="_details_back_office_";
			var nosend="nosend";
			var newRefObjArray = [];
			newRefObjArray.push(customerReferenceField);
			var boFieldsStateIsValid = true;
			for(var j=1;j<10;j++)
			{
				 var str=arrayCustomerRef  + "_" + bankAbbvName + backOffice + j + "_"+nosend;
				var tempObj = dj.byId(str);
				if(tempObj && tempObj.get("state") === "Error"){
					boFieldsStateIsValid = false;
					break;
				}
				newRefObjArray.push(tempObj);
			}
			if(!boFieldsStateIsValid)
			{
				// Do not allow to save, if any of the customer references are in 'Error' state.
				return;
			}
			
			var condition1, condition2;
			function changeCustRefListfunction(ref){
				return function(){ 
					_changeCustReferencesList(ref, null, null, _suffix);
					};
			}
			for(var i=0; i<newRefObjArray.length; i++)
			{
				var refObj, refValue, backOfficeData;
				
				if(i=== 0 )
				{
					backOfficeData = dj.byId(custRef + bankAbbvName + "_details_reference_"+currentRow);
				}
				else
				{
					backOfficeData = dj.byId(custRef + bankAbbvName + backOffice + i + "_"+currentRow);
				}
				
				oldRef= backOfficeData? backOfficeData.get('value'): undefined;
				
				refObj = newRefObjArray[i];
				if(refObj)
				{
					refValue = refObj.get("value");
				}
				else
				{
					refValue= undefined;
				}
				
				if(oldRef !== undefined || refValue !== undefined){
					// Customer reference should be checked for duplicity even if oldvalue = newvalue
					// This is beacuse the oldvalue may have already got used when this record is being edited
					var sameRefUpdate = (oldRef !== refValue);						
					 condition1 = sameRefUpdate && refValue !== undefined && isDuplicateReferenceAdding(refValue, ownerId, i, sameRefUpdate,bankAbbvName, forWarningMsg);
					 condition2 = !sameRefUpdate && oldRef != undefined && isDuplicateReferenceAdding(oldRef, ownerId, i, sameRefUpdate,bankAbbvName, forWarningMsg);
				}
			
				if (condition1 || condition2) 
				{
					displayMessage = misys.getLocalization('duplicateCustomerReference',[ refObj.get("value") ]);
					refObj.focus();
					refObj.set("state", "Error");
					dj.hideTooltip(refObj.domNode);
					dj.showTooltip(displayMessage,refObj.domNode, 0);
					break;
				}
			
			
			
				if(!(condition1 || condition2))
				{
					if (misys.addTransactionAddon(customerReference)) 
					{
						_clearCustomerReferenceDialogFields(_suffix);
							if(oldRef && newRef && oldRef !== newRef && currentRow !== "") 
						{
							_updateAccountsRecords(oldRef, newRef);
								setTimeout(changeCustRefListfunction(oldRef),1000);
						} 
						else 
						{
								setTimeout(changeCustRefListfunction(null),1000);
						}
					} 
					else 
					{
						if(dj.byId("customerDetailsEnabled").get("value") === "true") {
							dj.byId("addCustomerReferenceButton_"+_suffix).set("disabled", true);
						}
					}
				}
			}
		},

		
		showCustomerReferenceDialog: function( /*String*/ type,
												/*Boolean*/ customerDetailsEnabled,
												/*String*/ prefix,
												/*String*/ _suffix) {
			// summary:  
			//		TODO
			
			var suffix = _suffix || "";
			suffix = suffix === "" ? "" : "_"+suffix;
			if(dj.byId("customerDetailsEnabled").get("value") === "true") {
				if (!customerDetailsEnabled) {
					d.query("#customerReferenceDialog"+suffix+" .field").forEach(function(field){
						 d.style(field, "display", "block");
					});
					dj.byId("addCustomerReferenceButton"+suffix).set("disabled", false);
				}else {
					dj.byId("addCustomerReferenceButton"+suffix).set("disabled", true);
				}
				_clearCustomerReferenceDialogFields(suffix);
			}
			m.customerRefDialogTempValue = undefined;
			_exitCustomerReferenceDialog(_suffix);
			m.showTransactionAddonsDialog(type+suffix, null, _suffix);
		},

		bind : function() {
			m.setValidation("bei", m.validateBEIFormat);
			m.connect("liq_ref", "onChange", function(){
				var singleBank;
				if(dojo.query('#liq_bank_row .content')[0]){
					singleBank = dijit.byId(dojo.query('#liq_bank_row .content')[0]).innerHTML;
				}
				var bankName = dijit.byId("liq_bank") ? dijit.byId("liq_bank").get("value") : singleBank;
//				  var bankName =dijit.byId("liq_bank").get("value");
				   var reference = dijit.byId("liq_ref").get("value");
				   if(bankName!=="" && reference!==""){
					   _populateDataForLiq(bankName, reference);
					   misys.toggleLiqReferenceSection('bank','down');
				   }
			});
			m.connect("liq_bank", "onChange", _changeReferenceDropdown);
			m.connect("liq_bank", "onChange", function(){
				if(dijit.byId("liq_ref") && dijit.byId("liq_ref").get("value")==="" && !notOnFormLoad){
					misys.animate("wipeIn","liq_no_data");
					misys.animate("wipeOut","ref_liq_bank");
				}
				notOnFormLoad = false;
			});
			m.setValidation("email", m.validateSingleEmailAddr);
			m.setValidation("crm_email" , m.validateSingleEmailAddr);
			m.setValidation("web_address", m.validateWebAddr);
			m.setValidation("password_value", m.validatePassword);
			m.setValidation("password_value", m.validateChangePasswordNP);
			m.setValidation("password_confirm", m.validateChangePasswordCP);
			m.setValidation("_country", m.validateCountry);
			m.setValidation("base_cur_code", m.validateCurrency);
			m.setValidation("phone", m.validatePhoneOrFax);
			m.setValidation("fax", m.validateFax);
			m.setValidation("telex", m.validateTelex);
			m.setValidation("account_ccy_cur_code", m.validateCurrency);
			m.setValidation("country_legalid", m.validateCountry);
			m.setValidation("liquidity_ccy_cur_code",m.validateCurrency);
			m.setValidation("account_number",m.validateUserAccountNumber);
			m.setValidation("attachment_max_upload_size",_validateMaxUploadLimit);
			//m.connect("attachment_max_upload_size", "onBlur", _validateMaxUploadLimit);
			m.setValidation("address_line_1",m.validateSwiftAddressCharacters);
			m.setValidation("address_line_2",m.validateSwiftAddressCharacters);
			m.setValidation("dom",m.validateSwiftAddressCharacters);
			m.connect("password_value", "onBlur", _checkConfirmPassword);
			m.setValidation("rmGroup", m.checkRMGroupExists);
			m.setValidation("sgi", m.validateSGI);
			m.setValidation("bban", m.validateBBAN);
			m.connect('abbv_name', 'onKeyPress', function(e)
					{
					if(e.keyCode === 32 || e.charCode === 32){
						dojo.stopEvent(e);
					}
					});
						
			m.connect("create_admin", "onClick", function(){
				m.toggleFields(this.get("checked"), null,
						["password_value", "password_confirm"]);
			});
			misys.connect('add_bank', 'onClick', function() {
				misys.addMultiSelectItems(dj.byId('bank_list'), dj.byId('avail_bank_list_nosend'));
			});
			misys.connect('remove_bank', 'onClick', function() {
				misys.addMultiSelectItems(dj.byId('avail_bank_list_nosend'),
						dj.byId('bank_list'));
			});
			
			 m.connect('abbv_name', 'onChange', function(){
				 m.checkAbbvNameExists();
			 });
			 
			var bankNameAbbv = dj.byId('bank_name_abbv').get('value');
			// checking for duplicate customer reference, for displaying warning message.
			var reference = dj.byId("customerReference_"+bankNameAbbv+"_details_reference_nosend");
			m.connect(reference, "onBlur", function(){_validateDuplicateCustomerReference(0);});
			var BoRef1 = dj.byId("customerReference_"+bankNameAbbv+"_details_back_office_1_nosend");
			m.connect(BoRef1, "onBlur", function(){_validateDuplicateCustomerReference(1);});
			var BoRef2 = dj.byId("customerReference_"+bankNameAbbv+"_details_back_office_2_nosend");
			m.connect(BoRef2, "onBlur", function(){_validateDuplicateCustomerReference(2);});
			var BoRef3 = dj.byId("customerReference_"+bankNameAbbv+"_details_back_office_3_nosend");
			m.connect(BoRef3, "onBlur", function(){_validateDuplicateCustomerReference(3);});
			var BoRef4 = dj.byId("customerReference_"+bankNameAbbv+"_details_back_office_4_nosend");
			m.connect(BoRef4, "onBlur", function(){_validateDuplicateCustomerReference(4);});
			var BoRef5 = dj.byId("customerReference_"+bankNameAbbv+"_details_back_office_5_nosend");
			m.connect(BoRef5, "onBlur", function(){_validateDuplicateCustomerReference(5);});
			var BoRef6 = dj.byId("customerReference_"+bankNameAbbv+"_details_back_office_6_nosend");
			m.connect(BoRef6, "onBlur", function(){_validateDuplicateCustomerReference(6);});
			var BoRef7 = dj.byId("customerReference_"+bankNameAbbv+"_details_back_office_7_nosend");
			m.connect(BoRef7, "onBlur", function(){_validateDuplicateCustomerReference(7);});
			var BoRef8 = dj.byId("customerReference_"+bankNameAbbv+"_details_back_office_8_nosend");
			m.connect(BoRef8, "onBlur", function(){_validateDuplicateCustomerReference(8);});
			var BoRef9 = dj.byId("customerReference_"+bankNameAbbv+"_details_back_office_9_nosend");
			m.connect(BoRef9, "onBlur", function(){_validateDuplicateCustomerReference(9);});
				
			 m.connect('bank_abbv_name', 'onChange',_getAccountTypeByBank);
			 
			 m.connect('bank_abbv_name', 'onChange',_getProdcutTypesByBank);
			 
			 m.connect('bank_abbv_name', 'onChange',_getCustRefByBank);
			 
			 m.connect('bank_abbv_name', 'onChange',_getCustomerAccountTypeByBank);

			 m.connect('addCustomerButton', 'onClick', _createBankOptions);
			
			
			m.connect("bank_account_type","onChange",function(){
				if(dj.byId('bank_previous_account_type').get("value") === "checked")
					{
						dj.byId('bank_previous_account_type').set("value", "");	
					}
				else
					{
						dj.byId('account_product_type').set("value","");
					}
					
			});
			
			//map the account product type and account type to get the account description
			m.connect("account_product_type","onChange",function(){
							
							var accountType =  dj.byId('bank_account_type').get('value'),
							    accountProdType = dj.byId('account_product_type').get('value'),
							    accountMapping = "",
								acctDescription = null,
								accountTypeCode = "99";
							if(m._config.isBankGroupLogin && dj.byId("bank_abbv_name") && dj.byId("bank_abbv_name").get('value') !== '')
								{
									if(accountType !== "" && accountProdType !== "")
									{
										accountMapping = dj.byId("bank_abbv_name").get('value') + "-" + accountType +"-"+ accountProdType;
									}
								}
							else
								{
									if(accountType !== "" && accountProdType !== "")
									{
										accountMapping = accountType +"-"+ accountProdType;
									}
								}
							
							if(!m._config.isBankGroupLogin && m._config.bankAccountTypeMapping[accountMapping])
								{
									acctDescription = m._config.bankAccountTypeMapping[accountMapping].accountDescription;
								}
							else if(m._config.isBankGroupLogin && m._config.perBankAccountProductTypeMappingDesc[accountMapping])
								{
									acctDescription = m._config.perBankAccountProductTypeMappingDesc[accountMapping].accountDescription;
								}
							//set the account description 
							if(acctDescription !== null && acctDescription !== "")
							{
								dj.byId("account_desc").set("value",acctDescription);
								dj.byId("account_desc").set("disabled","true");
							}else{
								 var displayMessage = m.getLocalization("invalidAccountTypeProductType"),
									//focus on the widget and set state to error and display a tooltip indicating the same
								 	field = dj.byId("account_desc");
								 	field.state = 'Error';
									field._setStateClass();
									dj.setWaiState(field.focusNode, "invalid", "true");
									dj.showTooltip(displayMessage, field.domNode, 0);
									dj.byId("account_desc").set("value","");
							}
							//get the account type from the mapping
							if(!m._config.isBankGroupLogin && m._config.accountTypeCodeMapping[accountMapping])
							{
								accountTypeCode = m._config.accountTypeCodeMapping[accountMapping].accountTypeCode;
							}
							else if(m._config.isBankGroupLogin && m._config.perBankAccountTypeCodeMapping[accountMapping])
							{
								accountTypeCode = m._config.perBankAccountTypeCodeMapping[accountMapping].accountTypeCode;
							}
							//set the hidden value of account type code
							dj.byId('account_type').set('value',accountTypeCode);
				
			});
			
			misys.connect("frequency_select_all","onChange",function()
					{						
						if(dj.byId("frequency_select_all") && dj.byId("frequency_select_all").get("checked"))
						{	
							for(i=0; i< m._config.liquidity_frequency_record_count; i++)
							{
								frequencyId = m._config.frequencyIdArray[i];
								
								if(dj.byId("frequency_"+frequencyId) && dj.byId("frequency_"+frequencyId).get("disabled") === false)
								{
									dj.byId("frequency_"+frequencyId).set("checked",true);
								}										
							}						  
						}
						else if(dj.byId("frequency_select_all") && dj.byId("frequency_select_all").get("checked") === false)
						{
							for(i=0; i< m._config.liquidity_frequency_record_count; i++)
							{
								frequencyId = m._config.frequencyIdArray[i];
								
								if(dj.byId("frequency_"+frequencyId))
								{
									dj.byId("frequency_"+frequencyId).set("checked",false);
								}										
							}
						}			
					});	
			
			
			
			misys.connect("balance_type_select_all","onChange",function()
					{						
						if(dj.byId("balance_type_select_all") && dj.byId("balance_type_select_all").get("checked"))
						{	
							for(i=0; i< m._config.liquidity_balance_type_count; i++)
							{
								balTypeId = m._config.balTypeIdArray[i];
								
								if(dj.byId("balance_type_"+balTypeId) && dj.byId("balance_type_"+balTypeId).get("disabled") === false)
								{
									dj.byId("balance_type_"+balTypeId).set("checked",true);
								}										
							}						  
						}
						else if(dj.byId("balance_type_select_all") && dj.byId("balance_type_select_all").get("checked") === false)
						{
							for(i=0; i< m._config.liquidity_balance_type_count; i++)
							{
								balTypeId = m._config.balTypeIdArray[i];
								
								if(dj.byId("balance_type_"+balTypeId))
								{
									dj.byId("balance_type_"+balTypeId).set("checked",false);
								}										
							}
						}			
					});
		},

		onFormLoad : function() {
			if(m._config.liquidityData == undefined || m._config.liquidityData == ""){
				_getLiquidityFeatures();
			}
			_changeReferenceDropdown();
			misys._config.CustomerReferenceChangedMap = new Object();
			_createBankOptions();
			var createAdmin = dj.byId("create_admin"), fromFormLoad = true;
		//	_changeCustReferencesList( null, fromFormLoad);
			if(createAdmin) {
				m.toggleFields(createAdmin.get("checked"),
					null, ["password_value", "password_confirm"]);
			}
			if(dijit.byId("check_duplicate_file") && dijit.byId("abbv_name") && dijit.byId("abbv_name").get("value") === "")
				{
					dijit.byId("check_duplicate_file").set("checked",true);
				}
			if(dojo.byId("liq_bank")){
				dojo.byId("liq_bank").setAttribute("disabled", true);
			}
			if(dojo.byId("liq_ref")){
				dojo.byId("liq_ref").setAttribute("disabled", true);
			}
			dojo.forEach(m._config.availBanks, function(suffix, idx){
				_changeCustReferencesList( null, fromFormLoad, null, suffix);
				m.connect("cancelCustomerReferenceButton_"+suffix, "onClick", function(){
					_exitCustomerReferenceDialog(suffix);
					_clearChangedMap(suffix);	
				});
				
				m.connect("bank_enabled_"+suffix, "onChange", function(){
					_bankAttachChangeHandler(suffix);
				});
				m.connect("bank_enabled_"+suffix, "onChange", function(){
					_deleteAccountReleatedToABank(suffix);
				});
				
				var checkButtonId_1 = "checkCustomerReferenceButton_1_"+ suffix;
				if(dijit.byId(checkButtonId_1))
				{
					m.connect(checkButtonId_1, "onClick",function(){
						_getCustomerDetails(suffix,1);
					});
				}
				var checkButtonId_2 = "checkCustomerReferenceButton_2_"+ suffix;
				if(dijit.byId(checkButtonId_2))
				{
					m.connect(checkButtonId_2, "onClick",function(){
						_getCustomerDetails(suffix,2);
					});
				}
				
				var checkButtonId_3 = "checkCustomerReferenceButton_3_"+ suffix;
				if(dijit.byId(checkButtonId_3))
				{
					m.connect(checkButtonId_3, "onClick",function(){
						_getCustomerDetails(suffix,3);
					});
				}
				var checkButtonId_4 = "checkCustomerReferenceButton_4_"+ suffix;
				if(dijit.byId(checkButtonId_4))
				{
					m.connect(checkButtonId_4, "onClick",function(){
						_getCustomerDetails(suffix,4);
					});
				}
				var checkButtonId_5 = "checkCustomerReferenceButton_5_"+ suffix;
				if(dijit.byId(checkButtonId_5))
				{
					m.connect(checkButtonId_5, "onClick",function(){
						_getCustomerDetails(suffix,5);
					});
				}
				var checkButtonId_6 = "checkCustomerReferenceButton_6_"+ suffix;
				if(dijit.byId(checkButtonId_6))
				{
					m.connect(checkButtonId_6, "onClick",function(){
						_getCustomerDetails(suffix,6);
					});
				}
				var checkButtonId_7 = "checkCustomerReferenceButton_7_"+ suffix;
				if(dijit.byId(checkButtonId_7))
				{
					m.connect(checkButtonId_7, "onClick",function(){
						_getCustomerDetails(suffix,7);
					});
				}
				var checkButtonId_8 = "checkCustomerReferenceButton_8_"+ suffix;
				if(dijit.byId(checkButtonId_8))
				{
					m.connect(checkButtonId_8, "onClick",function(){
						_getCustomerDetails(suffix,8);
					});
				}
				var checkButtonId_9 = "checkCustomerReferenceButton_9_"+ suffix;
				if(dijit.byId(checkButtonId_9))
				{
					m.connect(checkButtonId_9, "onClick",function(){
						_getCustomerDetails(suffix,9);
					});
				}

				var textFieldId_1 = "customerReference_" +suffix+ "_details_back_office_1_nosend";
				if(dijit.byId(textFieldId_1)){					
					m.connect(textFieldId_1, "onBlur",function(){
					_addToChangedMap(suffix, textFieldId_1,"1");
					});				
				}
				
				var textFieldId_2 = "customerReference_" +suffix+ "_details_back_office_2_nosend";
				if(dijit.byId(textFieldId_2)){
					m.connect(textFieldId_2, "onBlur",function(){
					_addToChangedMap(suffix, textFieldId_2,"2");
					});				
				}
				
				var textFieldId_3 = "customerReference_" +suffix+ "_details_back_office_3_nosend";
				if(dijit.byId(textFieldId_3)){
					m.connect(textFieldId_3, "onBlur",function(){
						_addToChangedMap(suffix, textFieldId_3,"3");										
					});				
				}
				
				var textFieldId_4 = "customerReference_" +suffix+ "_details_back_office_4_nosend";
				if(dijit.byId(textFieldId_4)){
					m.connect(textFieldId_4, "onBlur",function(){
						_addToChangedMap(suffix, textFieldId_4,"4");
					});				
				}
				var textFieldId_5 = "customerReference_" +suffix+ "_details_back_office_5_nosend";
				if(dijit.byId(textFieldId_5)){
					m.connect(textFieldId_5, "onBlur",function(){
						_addToChangedMap(suffix, textFieldId_5,"5");
					});				
				}
				var textFieldId_6 = "customerReference_" +suffix+ "_details_back_office_6_nosend";
				if(dijit.byId(textFieldId_6)){
					m.connect(textFieldId_6, "onBlur",function(){
						_addToChangedMap(suffix, textFieldId_6,"6");
					});				
				}
				var textFieldId_8 = "customerReference_" +suffix+ "_details_back_office_8_nosend";
				if(dijit.byId(textFieldId_8)){
					m.connect(textFieldId_8, "onBlur",function(){
						_addToChangedMap(suffix, textFieldId_8,"8");
					});				
				}
				
						
				if(misys._config.backOfficeIndexConfig["TMA"])
				{									
					//validating TMA proprietary Id
					var tmaBoRef= "customerReference_" +suffix+ "_details_back_office_"+misys._config.backOfficeIndexConfig["TMA"]+"_nosend";
					//setting the maxlength of TMA prop Id fiels as 71 i.e, id(35)+separator(1)+id_type(35)
				dijit.byId(tmaBoRef).set("maxLength",71);				
					if(dijit.byId(tmaBoRef))
					{
						dijit.byId(tmaBoRef).set("maxLength",71);	
						m.connect(tmaBoRef, "onBlur",function(){
							_validateTmaPropId(tmaBoRef);
												
						});
						m.connect(tmaBoRef, "onChange",function(){
							_validateTmaPropId(tmaBoRef);
												
						});
						m.connect(tmaBoRef, "onKeyPress", function(e)
						{
							if (e.keyCode === 32 || e.charCode === 32)
							{
								dojo.stopEvent(e);
							}
						});
					}
				}
											

				m.connect("customerReference_"+suffix+"_details_reference_nosend", "onBlur", function(){
					_showSaveButton(suffix);
				});
				m.connect("customerReference_"+suffix+"_details_reference_nosend", "onChange", function(){
					_changeCustomerReference(suffix);
				});
				m.connect("customerReference_"+suffix+"_details_description_nosend", "onBlur", function(){
					_showSaveButton(suffix);
				});
				m.connect("customerReference_"+suffix+"_details_description_nosend", "onChange", function(){
					_showSaveButton(suffix);
				});
				m.connect("customerReference_"+suffix+"_details_reference_nosend", "onBlur", function(){
					_custReferenceAccountModify(suffix);
				});
				
			});
			
		},
		
		beforeSubmitValidations: function() {
			_validateMaxUploadLimit();
			if(dj.byId("attachment_max_upload_size") && dj.byId("attachment_max_upload_size").get("state") === 'Error')
			{
				dj.byId("attachment_max_upload_size").focus();
				return false;
			}
			else
			{
				return true;
			}
		},
		
		beforeSaveValidations: function() {
			var abbv_name = dijit.byId("abbv_name").get("value");
			console.debug("abbv_name:",abbv_name);
			if(!(abbv_name.length>0))
				{
					m._config.onSubmitErrorMsg = m.getLocalization("custAbbvNameEmptyError");
					dijit.byId("abbv_name").focus();
					return false;
				}
			else
				{
					return true;
				}
		}
	});
	
	// Setup the XML transform function
	m._config = m._config || {};
	d.mixin(m._config, {
		xmlTransform : function(/*String*/ xml) {
		//If you try to save static phrase then return the phrase xml content	
		if(xml.indexOf("<static_phrase>") !== -1 || xml.indexOf("<phrase>") !== -1)
		{
			return xml;
		}
				
		var 
			multiSelects = new Array('company_role_list', 'bank_role_list', 'company_auth_level', 'bank_auth_level','entity_role_list'),
			
			authPrefixList = new Array('bank_auth_level', 'company_auth_level','entity_auth_level'),
			
			bankMultiSelectList = dj.byId('bank_list'),
		
			// Whether we have a bank or customer screen
			staticTypeNode = "static_company_info",
			
			returnCommentsValue="",
					
			// Setup the root of the XML string
			xmlRoot = m._config.xmlTagName,
			
			transformedXml = xmlRoot ? ["<", xmlRoot, ">"] : [],

			// Representation of existing XML
			//dom = dojox.xml.DomParser.parse(xml);
					
			//while parsing using dojox.xml.DomParser.parse() function, white spaces between texts are truncated to only one white space. 
			//Hence using dojox.xml.parser.parse() fucntion. 
			dom = dojox.xml.parser.parse(xml);
				
			// Normalize multiselects
			dojo.forEach(multiSelects, function(id){
				if(dj.byId(id))
				{
					var multi = dj.byId(id);
					if(multi && multi.declaredClass.indexOf('MultiSelect') !== -1)
					{
						multi.reset();
						multi.invertSelection();
					}
				}
			});

			// Push the entire XML into the new one
			transformedXml.push("<", staticTypeNode, ">");
			var subXML = xml.substring(xmlRoot.length+2,(xml.length-xmlRoot.length-3));
			transformedXml.push(subXML);
			transformedXml.push("</", staticTypeNode, ">");
			
			//Add customer references related to xml
			
			var banksarrList = m._config.availBanks || new Array();
			
			transformedXml.push("<", "references_record", ">");
			transformedXml.push("<", "customer_references", ">");
			
			var defaultReference = m.getDomValue(dom,"default_reference"),
			    companyAbbvName = m.getDomValue(dom,"abbv_name"),
				coreFields = misys._config.coreReferenceFields || [],
			    customFields = misys._config.customReferenceFields || [],
			    referenceFields = coreFields.concat(customFields);
			    
			for(var j = 0, len = banksarrList.length; j < len; j++)
			{
				var bankAbbvName = banksarrList[j];
				
				// Include references only if Bank is attached
				if(! dj.byId("bank_enabled_"+bankAbbvName).get("checked"))
				{
					continue;
				}	
				
				var rows = d.byId("customerReference_"+bankAbbvName+"-master-table").rows.length;
				
				var posArray = [];
				var alldivs = dom.getElementsByTagName("static_company");
				
				for (var i = 0; i < alldivs[0].childNodes.length; i++) 
				{
					if (alldivs[0].childNodes[i].nodeName !== null && alldivs[0].childNodes[i].nodeName.match("customer_reference_"+bankAbbvName+"_details_reference_"))
					{
						var tagName = alldivs[0].childNodes[i].nodeName;
						posArray.push(tagName.substring(tagName.indexOf("customer_reference_"+bankAbbvName+"_details_reference_") + ("customer_reference_"+bankAbbvName+"_details_reference_").length));
					}
				}
				
				if(posArray.length > 0)
				{
					dojo.forEach(posArray,function(item, index)
					{
						transformedXml.push("<", "customer_reference", ">");
						if(dj.byId("customer_reference_"+bankAbbvName+"_details_reference_"+item))
						{
							transformedXml.push("<bank_abbv_name>",bankAbbvName,"</bank_abbv_name>");
							transformedXml.push("<customer_abbv_name>",companyAbbvName,"</customer_abbv_name>");
							var fieldValue;
							for (var i=0; i<referenceFields.length; i++) {
								fieldValue = m.getDomValue(dom,"customer_reference_"+bankAbbvName+"_details_" +referenceFields[i]+"_"+item);
								transformedXml.push("<"+referenceFields[i]+">",fieldValue,"</"+referenceFields[i]+">");
							}
							var defaultRef = "N";
							if (defaultReference === m.getDomValue(dom,"customer_reference_"+bankAbbvName+"_details_reference_" +item)) {
								defaultRef = "Y";
							}
							
							transformedXml.push("<default_reference>",defaultRef,"</default_reference>");
							
							var liquidityEnabled = m.getDomValue(dom,"customer_reference_"+bankAbbvName+"_details_" +"liquidityenabledflag_"+item);
							transformedXml.push("<liquidityenabledflag>",liquidityEnabled,"</liquidityenabledflag>");
						}
						
						transformedXml.push("</", "customer_reference", ">");
					});
				}
			}

			transformedXml.push("</", "customer_references", ">");
			transformedXml.push("</", "references_record", ">");
			//End of Customer References
			
			//Start of Accounts info
			var testModuleList=dom.getElementsByTagName("account");// constant contains testModule XML Element name
			transformedXml.push("<", "accounts", ">");
			if(testModuleList.length > 0)
			{	
				for(var k=0; k<testModuleList.length;k++)
				{	
					transformedXml.push("<", "account", ">");
					for(var x=0;x<testModuleList[k].childNodes.length;x++)
					{
						var nodeName = testModuleList[k].childNodes[x].nodeName;
						if(testModuleList[k].childNodes[x].childNodes.length > 0)
						{
						var nodeValue = testModuleList[k].childNodes[x].childNodes[0].nodeValue;
						var nodeEncode = dojo.isString(nodeValue)?dojox.html.entities.encode(nodeValue, dojox.html.entities.html) : nodeValue;
							transformedXml.push("<"+nodeName+">", nodeEncode,"</"+nodeName+">");
						}
					}
					transformedXml.push("</", "account", ">");
				}
			}
			transformedXml.push("</", "accounts", ">");
			//End of Accounts info
			
			// Start of Liquidity Frequency Setting 
			if(!(document.getElementById("frequency_list") === null))
			{
			var testModuleList1= frequency_list.childNodes.length -1 ;// constant contains testModule XML Element name
			transformedXml.push("<", "liquidity_frequency", ">");
			if(testModuleList1 > 0)
			{	
				for(var a=1; a<=testModuleList1 ;a++)
				{	
					transformedXml.push("<", "frequency_"+a, ">");
					if(dj.byId("frequency_"+a) && dj.byId("frequency_"+a).get("value") === "on")
					{
						transformedXml.push("true");
					}
					else
					{
						transformedXml.push("false");
					}
					transformedXml.push("</", "frequency_"+a, ">");
				}
			}
			transformedXml.push("</", "liquidity_frequency", ">");
		}
			
			// Start of Liquidity Balance Type Setting
			if(!(document.getElementById("balance_type_list") === null))
			{
			var testModuleList2= balance_type_list.childNodes.length -1 ;// constant contains testModule XML Element name
			transformedXml.push("<", "liquidity_balance_type", ">");
			if(testModuleList2 > 0)
			{	
				for(var p=1; p<=testModuleList2 ;p++)
				{	
					transformedXml.push("<", "balance_type_"+p, ">");
					if(dj.byId("balance_type_"+p) && dj.byId("balance_type_"+p).get("value") === "on")
					{
						
						transformedXml.push("true");
					}
					else
					{
						transformedXml.push("false");
					}
					transformedXml.push("</", "balance_type_"+p, ">");
				}
			}
			transformedXml.push("</", "liquidity_balance_type", ">");
			}
			
		   // generate the roles xml
		    dojo.forEach(multiSelects, function(id)
		    {
			   if(dom.getElementsByTagName(id).length > 0)
			   {
				   var prefix = 'bank';
				   if(id.indexOf('bank') === -1)
				   {
					   prefix = 'company';
				   }
				   transformedXml.push(_addGroupRecord(dom, prefix  + '_group_abbv_name', id));
			   }
		    });
		   
		   //generate attached banks xml
		   /* if(bankMultiSelectList){
			   bankMultiSelectList.reset();
			   bankMultiSelectList.invertSelection();*/
			   transformedXml.push(_addBankDescRecord(banksarrList));
		  //  }
			
			if(xmlRoot) {
				transformedXml.push("</", xmlRoot, ">");
			}
			return transformedXml.join("");
		}
	});
	
	d.mixin(m, {
		fncValidateAccountPopup :function(){
				dj.byId('accountOkButton').set('disabled',true);
				var mandatoryFields = ['account_number','bank_account_type', 'account_product_type','owner_type','account_ccy_cur_code', 'cust_account_type','account_desc','customer_reference'];
				//var mandatoryFields = ['account_number','bank_account_type', 'account_product_type','account_ccy_cur_code', 'cust_account_type','bank_id','branch_code','account_desc','customer_reference'];
				var valid = dojo.every(mandatoryFields, function(id){
					var field = dj.byId(id);
					if(field){
						var value = field.get("value");
						if(value === "" || field.state === "Error"){
							misys.showTooltip(misys.getLocalization('mandatoryFieldsError'), field.domNode, ['above','before']);
							field.state = 'Error';
							field._setStateClass();
							dj.setWaiState(field.focusNode, "invalid", "true");
							return false;
						}
					}
					return true;
				});	
				dj.byId('accountOkButton').set('disabled',false);
				//Validating the account number to verify whether duplicate account number trying add
				var accountField = dj.byId("account_number");
				var ownerTypeField = dj.byId("owner_type");
				var displayedOwnerTypeField = dj.byId("displayed_owner_type");
				var ownerTypeFieldName;
				if(accountField && accountField.get("value") !== "" &&  _isDuplicateAccountFound(accountField.get("value"),ownerTypeField.get("value")))
				{
					if (ownerTypeField.get("value") === "01")
						{
						ownerTypeFieldName = misys.getLocalization('Owner_Type_01');
						}
					else if (ownerTypeField.get("value") === "10")
						{
						ownerTypeFieldName = misys.getLocalization('Owner_Type_10');
						}
					
					
					displayMessage = misys.getLocalization('duplicateAccountNumber',[accountField.get("value"),ownerTypeFieldName]);
					dj.showTooltip(displayMessage,accountField.domNode, 0);
					accountField.set("state", "Error");
					accountField._setStateClass();
					accountField.setWaiState(accountField.focusNode, "invalid", "true");
					valid = false;
				}
				
				if(displayedOwnerTypeField && ownerTypeField && ownerTypeField.get("value") !== '')
				{
					if (ownerTypeField.get("value") === "01")
					{
						displayedOwnerTypeField.set("value", misys.getLocalization('Owner_Type_01'));
					}
					else if (ownerTypeField.get("value") === "10")
					{
						displayedOwnerTypeField.set("value", misys.getLocalization('Owner_Type_10'));
					}
				}
				
				if(!valid){
					return false;
				} else {
					dj.byId('account-dialog-template').gridMultipleItemsWidget.updateData();
					
					dj.byId('accounts').dialog.hide();
					return true;
				}
				},
		
		//On deleting an reference will delete the already attached accounts with that reference and also update the customer reference dropdown at account dialog	
		fncDeleteCustomerReferenceRow : function(type, id, prefix, chain, _suffix) {
			var newId = id;
			var suffix = _suffix || "";
			var rowName = type +"_row_"+newId;
			var rowIndex = d.byId(rowName);
		
			if(rowIndex.children[0].childNodes[0].childNodes[0])
			{
			  reference = rowIndex.children[0].childNodes[0].childNodes[0].nodeValue;
			}else if(rowIndex.children[0].childNodes[0])
			{
			  reference = rowIndex.children[0].childNodes[0].nodeValue;
			}
			
			m.deleteTransactionAddon(type, id, prefix, null, function() 
			{
				_modifyRelatedRecords("delete", reference, suffix);
			});
		},
		toggleLiqReferenceSection : function(/*String*/suffix, /*String*/dir){
			   var downArrow = d.byId("liq_reference_list_down_"+suffix);
			   var upArrow = d.byId("liq_reference_list_up_"+suffix);
			   
			   if(dir === 'down')
			   {
			    if(d.style('ref_liq_'+suffix, "display") === "none")
			    {
			    	if(dijit.byId("liq_bank") && dijit.byId("liq_ref") && (dijit.byId("liq_bank").get("value")==="" || dijit.byId("liq_ref").get("value")===""))
			    	{
						misys.animate("wipeIn","liq_no_data") ;
					}else
					{
					   misys.animate('wipeIn', "ref_liq_"+suffix);
					   misys.animate("wipeOut","liq_no_data") ;
					}
			    	d.style(downArrow, "display", "none");
			    	d.style(upArrow, "display", "inline");
			    }
			   }
			   else if (dir === 'up' && upArrow )
			   {
			    if(d.style('ref_liq_'+suffix, "display") !== "none")
			    {
			    	misys.animate('wipeOut', "ref_liq_"+suffix);
			    }
			    if(d.style('liq_no_data', "display") !== "none"){
			    	misys.animate('wipeOut', "liq_no_data");
			    }
			    	d.style(upArrow, "display", "none");
			    	d.style(downArrow, "display", "inline");
			   }
			  },
		
		// Display Customer Reference section
		toggleReferenceSection : function(/*String*/suffix, /*String*/dir){
		   var downArrow = d.byId("reference_list_down_"+suffix);
		   var upArrow = d.byId("reference_list_up_"+suffix);
		   if(dir === 'down')
		   {
		    if(d.style('bank_custref_'+suffix, "display") === "none" && dj.byId("bank_enabled_"+suffix) && dj.byId("bank_enabled_"+suffix).get("checked"))
		    {
		     misys.animate('wipeIn', "bank_custref_"+suffix);
		     d.style(downArrow, "display", "none");
		     d.style(upArrow, "display", "inline");
		    }
		   }
		   else if (dir === 'up')
		   {
		    if(d.style('bank_custref_'+suffix, "display") !== "none")
		    {
		     misys.animate('wipeOut', "bank_custref_"+suffix);
		     d.style(upArrow, "display", "none");
		     d.style(downArrow, "display", "inline");
		    }
		   }
		  } ,
		  
		  toggleViewLiqReferenceSection : function(/*String*/suffix, /*String*/dir){
			   var downArrow = d.byId("reference_list_down_"+suffix);
			   var upArrow = d.byId("reference_list_up_"+suffix);
			   if(dir === 'down')
			   {
			    if(d.style('bank_custref_'+suffix, "display") === "none")
			    {
			     misys.animate('wipeIn', "bank_custref_"+suffix);
			     d.style(downArrow, "display", "none");
			     d.style(upArrow, "display", "inline");
			    }
			   }
			   else if (dir === 'up')
			   {
			    if(d.style('bank_custref_'+suffix, "display") !== "none")
			    {
			     misys.animate('wipeOut', "bank_custref_"+suffix);
			     d.style(upArrow, "display", "none");
			     d.style(downArrow, "display", "inline");
			    }
			   }
			  } 
	});
	
	d.ready(function(){
		// TODO There is, for the moment, a dependency between these files
		// and the functions in misys.form.file
		d.require("misys.system.widget.Accounts");
		d.require("misys.system.widget.Account");
	});
	
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.system.company_mc_client');