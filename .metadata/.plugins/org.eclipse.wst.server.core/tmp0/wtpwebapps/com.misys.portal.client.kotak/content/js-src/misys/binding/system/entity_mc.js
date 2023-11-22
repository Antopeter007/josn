dojo.provide("misys.binding.system.entity_mc");
dojo.require("dijit.form.FilteringSelect");
dojo.require("dijit.layout.TabContainer");
dojo.require("misys.form.MultiSelect");
dojo.require("misys.form.common");
dojo.require("misys.validation.common");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.CheckBox");
dojo.require("misys.editor.plugins.ProductFieldChoice");
dojo.require("misys.form.SimpleTextarea");
dojo.require("dojo.data.ItemFileWriteStore");
dojo.require("misys.grid.DataGrid");
dojo.require("misys.grid.EnhancedGrid");
dojo.require("misys.widget.Dialog");
dojo.require("dojox.xml.DomParser");
dojo.require("dojox.collections.ArrayList");
dojo.require("dojox.grid.DataGrid");
dojo.require("dojox.grid.EnhancedGrid");
dojo.require("dojo.data.ItemFileReadStore");
dojo.require("dojox.grid.enhanced.plugins.Pagination");
(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {
	"use strict"; // ECMA5 Strict Mode
	d.mixin(m._config, {

		initReAuthParams : function() {
									
			var reAuthParams = {
				productCode : 'EM',	
				subProductCode : '',
				transactionTypeCode : '01',	
				entity : '',
				currency : '',				
				amount : '',
								
				es_field1 : '',
				es_field2 : ''				
			};
			return reAuthParams;
		}
	});
	var
		// List of selected entities
		_entityListNode = "entity_list",
		// List of available entities
		_availListNode = "avail_list",
		_entityDetailsDiv =  d.byId("entity-roles"),
		_packageRoles,
		// Master List of available and existing entity roles for additional entity role section
		_entityRoleNameMasterList,
		// List of available entity roles which may include package roles,
		_entityRoleNameAvailList,
		// List of existing entity roles which may include package roles
		_entityRoleNameExistingList,
		// List of available Package roles for a selected package
		_packageRoleList,	
		 CompanyId,
		 currentmode,
		 removedAccountNo =[],
		 custrefs=[];
		 var accountList = [];
		 /*this loadedOnFormLoad flag is used to assign the accounts-Grid store values to accountList array only on form load.*/
		 var loadedOnFormLoad= false;
	
	function _selectCheckBoxes(onFormLoad)
	{
		d.forEach(m._config.attachedBanks, function(bank){
			var custrefcount=dj.byId('Customer_references_count_'+bank).get('value');
			if(dj.byId('Customer_references_count_'+bank))
			{			
				var custreference="";
				for(var i=1;i<=custrefcount;i++)
				{
					custreference=dj.byId("custref_"+bank+"_"+i).get('value');
					if(m._config.entityReferencesMapping[custreference])
					{
						var entityReference = m._config.entityReferencesMapping[custreference];
						 var refEnabledBank = dj.byId("ref_enabled_"+bank+"_"+i);
						if(refEnabledBank && entityReference)
						{								
							refEnabledBank.set("checked", true);
							custrefs.push(custreference);
						}
					}
				}
				var url = [m.getServletURL("/screen/AjaxScreen/action/GetCustomeraccountsbyReferences")];
				url.push("?companyid=", CompanyId,"&custrefs=", encodeURIComponent(custrefs));
				_createGridsStore(url.join(""));
				if(onFormLoad)
				{
					setTimeout(function(){
						_retreiveAccnum(true);
					}, 2000);
				}else{
					setTimeout(function(){
						_retreiveAccnum();
					}, 2000);
				}
			}
		});	
	}
	
	function _selectCheckBoxesMultiBank(onFormLoad)
	{
		var bankCustRefArray= [];
		d.forEach(m._config.attachedBanks, function(bank){
			if(misys._config.entityReferencesBanks.indexOf(bank) !== -1)
				{
					var custreference="";
					var custrefcount=dj.byId('Customer_references_count_'+bank).get('value');	
					var custRefList =[]; 
					for(var i=1; i<=custrefcount; i++)
						{	
							custreference=dj.byId("custref_"+bank+"_"+i).get('value');
							if(m._config.entityReferencesMapping[custreference])
							{
								var entityReference = m._config.entityReferencesMapping[custreference];
								if(dj.byId("ref_enabled_"+bank+"_"+i) && entityReference)
								{								
										dj.byId("ref_enabled_"+bank+"_"+i).set("checked", true);
								}
								var custRef = bank+"="+custreference; 
								custRefList.push(custRef);
							}
						}
					custRefList = custRefList.join(",");
					bankCustRefArray.push(custRefList);
				}
		});
		bankCustRefArray = bankCustRefArray.join(",");
		var url = [m.getServletURL("/screen/AjaxScreen/action/GetCustomeraccountsbyReferencesMultiBank")];
		url.push("?companyid=", CompanyId,"&bankcustrefarray=", encodeURIComponent(bankCustRefArray));
		_createGridsStore(url.join(""));
		if(onFormLoad)
		{
			setTimeout(function(){
				_retreiveAccnum(true);
			}, 2000);
		}else{
			setTimeout(function(){
				_retreiveAccnum();
			}, 2000);
		}
	}

	function _addExistingEntityRoles( /*String*/ dom,
			  /*String*/ nodeName) {
		//  summary: l
		//  Adds existing permissions to the XML
		var node = dom.getElementsByTagName(nodeName)[0],
		childNode = (node) ? node.childNodes[0] : "",
				permArray = (childNode) ? childNode.nodeValue.split(",") : [],
						permissionsXml = ["<existing_roles>"];
				dojo.forEach(dojo.query("option", dijit.byId(nodeName).domNode), function(option){
					permissionsXml.push("<roles_desc_record><role>", 
							option.value, 
					"</role></roles_desc_record>");
				});
				permissionsXml.push("</existing_roles>");
				return permissionsXml.join("");
	}
	
	function _createGridsStore( /*String*/ url)
	{
		if(dj.byId("accounts_Grid"))
		{
			var data = {
					identifier: 'accounts_Id'
			};	
				var store = new dojo.data.ItemFileWriteStore(
							{					
								jsId:"accountsList",					
								url: url,
								data: data
							});
		    console.debug('newurl'+url);
		    dj.byId("accounts_Grid").setStore(store);
		    console.debug("[Accounts] retrieve items"+data);
		}
   }
	
    function _retreiveAccnum(onFormLoad)
	{
		if(dj.byId("charging_account")){
		console.debug("[Accounts] retrieve accounts for charging accounts");
		var storeItems = [];
		//fetch the store and its items
		dj.byId("accounts_Grid").store.fetch({query: {}, 
			onComplete: dojo.hitch(this, function(items, request){
				dojo.forEach(items, function(item){
						var value = item['acc_num'];
						var ccy = item['ccy'];
						var owner_type = item['owner_type']+'';
						var bank_name = item['bank_name'];
						if(!loadedOnFormLoad){
						accountList.push(item);
						}
						if(owner_type !== '10')
						{
						storeItems.push(
								{
								name: value+" ("+bank_name+")",
								value: value,
								ccy: ccy,
								bank_name:bank_name
								});
						}
				}, this);
				dj.byId('charging_account').store = new dojo.data.ItemFileWriteStore({
					data: {
						identifier: "value",
						label : "name",
						items: storeItems
					}
				});
				dj.byId('charging_account').store.save();
	})});
if((onFormLoad && dj.byId("charging_account_hidden")) || (removedAccountNo.indexOf(dj.byId('charging_account').get("value"))>-1))
	{
		if(removedAccountNo.length>0 && removedAccountNo.indexOf(dj.byId("charging_account_hidden").get("value"))>-1){
			dj.byId('charging_account').set("value","");	
		}
		else{
			dj.byId('charging_account').set("value", dj.byId("charging_account_hidden").get("value"));
			removedAccountNo= [];
		}
	}
		}
	}
	
	function _getAccountsByReference(custrefs, bankname)
	{
		m.xhrPost({
    		url : misys.getServletURL("/screen/AjaxScreen/action/GetCustomeraccountsbyReferences") ,
    		handleAs : "json",
    		sync : true,
    		content : {
    			Custrefs :custrefs,
    			CompanyId:dj.byId('company_id').get('value'),
    			bankname:bankname
    		},
    		load : function(response){
    			dojo.forEach(response.items, function(account){
    				accountList.push(account);
    			});
    			_createAccountListGridStore();
    		},
    		error : function(response){
    			console.error('[Couldnot Get Accounts  for customer] '+dj.byId('company_id').get('value'));
    		}
    	});	
	}
	
	function _createAccountListGridStore()
	{
		if(dj.byId("accounts_Grid")){
				var data = {
						identifier : 'acc_num',
						label : 'bank_name',
						items: accountList
					};
					var store = new dojo.data.ItemFileWriteStore(
								{					
									data: data
								});
			    dj.byId("accounts_Grid").setStore(store);
			}
	}

    function _getPackageDetails(){
    	if(dj.byId('subscription_package'))
    	{
    		var packageId = dj.byId('subscription_package');
    		m.xhrPost( {
    		url : misys.getServletURL("/screen/AjaxScreen/action/GetSubscriptionPackageDetails") ,
    		handleAs : "json",
    		sync : true,
    		content : {
    			packageIdValue : packageId.get('value')
    		},
    		load : function(response){
    			var packageDetails = response.packageDetails;
    			   dj.byId('stnd_charge_cur_code').setValue(packageDetails[0]);
    			   dj.byId('stnd_charge_amt').setValue(packageDetails[1]);
    			   _packageRoles = packageDetails[2];
    			   _packageRoleList = packageDetails[3];
    			   _validateSpecialCharges();	
    		},
    		error : function(response){
    			console.error('[Couldnot Get Subscription Package Details] '+packageId.get('value'));
    		}
    	});
    	}
    }
    /**
     * validate the special charges against the charging account curreny
     */
    function _validateSpecialCharges(){
   		 if(dj.byId('charging_account')){
    	    	charginAccCCy = "";
    	    	stdChargeCCy = dj.byId('stnd_charge_cur_code').get('value');
    	    	chargingAccNo = dj.byId('charging_account').value;
    		//fetch the store and its items
    		 if(dj.byId('accounts-grid'))
    		 {
				dj.byId('accounts-grid').store.fetch({query: {store_id: '*'}, 
					onComplete: dojo.hitch(this, function(items, request){
						dojo.forEach(items, function(item){
							var value = item['account_number'][0];
							var ccy = item['ccy'][0];
							if(value === chargingAccNo)
							{
								charginAccCCy = ccy;
							}
						}, this);
					})});
    		 }
    		//if std charge ccy and charging account currecny are different special charge currency and special charge should be mandatory
    		if(charginAccCCy !== stdChargeCCy){
    			dj.byId('special_charge_cur_code').set('required',true);
    			dj.byId('special_charge_amt').set('required',true);
    		}else{
    			dj.byId('special_charge_cur_code').set('required',false);
    			dj.byId('special_charge_amt').set('required',false);
    		}
   		}
    }
    
   function  _clearOptionsForMultiSelectWidget(/**Dom object**/object)
   {
	     while (object.hasChildNodes()){ 
	    	 console.debug("About to clear widget "+object.id);
	    	 object.removeChild(object.lastChild);     	 
	     } 
   }
   /**
    * Build available and existing entity role list for the additional 
    * entity role section, these lists are used to do a minus
    * operation from the list of subscription package role list.
    * This method is responsible to build  three different types
    * of list and make them available on page.
    * 1._entityRoleNameMasterList - list of Entity roles from both the widgets
    *                               source and destination widget.(total entity
    *                               roles available roles and existing roles)
    * 2._entityRoleNameAvailList - 	list of entity roles available for entity and
    *                               which does not contain existing or already 
    *                               assigned entity roles to entity.                           
    * 3._entityRoleNameExistingList - list of entity roles already assigned to entity. 
    */
   function  _buildAdditionalEntityRoleList()
   {
		   var entityRoleSourceMultiSelect 	= dj.byId("entity_avail_list_nosend"),
		       entityRoleDestMultiSelect 	= dj.byId("entity_role_list");
		   // create array
		   _entityRoleNameMasterList 	= new dojox.collections.ArrayList();
		   _entityRoleNameAvailList  	= new dojox.collections.ArrayList();
		   _entityRoleNameExistingList	= new dojox.collections.ArrayList();
		   //iterate through the source multi select options
		   dojo.query("option",entityRoleSourceMultiSelect.containerNode).forEach(function(n){
			   _entityRoleNameMasterList.add(n);
			   //separate list to maintain available list of entity roles
			   _entityRoleNameAvailList.add(n);
			});
		   dojo.query("option",entityRoleDestMultiSelect.containerNode).forEach(function(n){
			   _entityRoleNameMasterList.add(n);
			   _entityRoleNameExistingList.add(n);
			});
   }
   /**
    *  Modify the additional entity role section, 
    *  Do a minus operation from package roles
    */
   function _modifyAdditonalEntityRoles()
   {
	   console.debug("Modifiying addtional entity role section based on the subscription package selected");   
	   var	entityAvailListNoSendField	=	dj.byId("entity_avail_list_nosend"),
	   		packageRoleNameList			=	_getPackageListAsArray();
	   		
	   //Clear both the source widget ids
	   _clearOptionsForMultiSelectWidget(dojo.byId("entity_avail_list_nosend"));
	   //iterate over the available list of entity roles section
	   console.debug("count for available entity role name list"+_entityRoleNameAvailList.count);
	   // build the available list which does not contain package roles.
	   _entityRoleNameMasterList.forEach(function(option){
		   if(!packageRoleNameList || !packageRoleNameList.contains(option.value))
		   {
			   //append the option object 
			   entityAvailListNoSendField.containerNode.appendChild(option);
		   }
	   console.debug("Iterating available entity role list"+option.value); 
	   }, _entityRoleNameMasterList);
   }
   /**
    * 
    * Modify on load additional entity role section. To remove roles which are
    * in package both from selected widget and available widget.
    * 
    */
   function _modifyAdditonalEntityRolesOnFormLoad()
   {
	   var	entityAvailListNoSendField	=	dj.byId("entity_avail_list_nosend"),
  			entityExistingListField		=	dj.byId("entity_role_list"),
  			packageRoleNameList			=	_getPackageListAsArray();
	   
	   console.debug("Modifiying addtional entity role section on form load");   
	   //Clear both the source widget ids
	   _clearOptionsForMultiSelectWidget(dojo.byId("entity_avail_list_nosend"));
	   _clearOptionsForMultiSelectWidget(dojo.byId("entity_role_list"));
	   //iterate over the available list of entity roles section
	   console.debug("count for available entity role name list"+_entityRoleNameMasterList.count);
	   // build the available list which does not contain package roles.
	   _entityRoleNameAvailList.forEach(function(option){
		   if(!packageRoleNameList || !packageRoleNameList.contains(option.value))
		   {
			   entityAvailListNoSendField.containerNode.appendChild(option);
		   }
	   console.debug("Iterating available entity role list"+option.value); 
	   }, _entityRoleNameAvailList);
	   console.debug("count for existing entity role name list"+_entityRoleNameExistingList.count);
	   // build the available list which does not contain package roles.
	   _entityRoleNameExistingList.forEach(function(option){
		   if(!packageRoleNameList || !packageRoleNameList.contains(option.value))
		   {
			   entityExistingListField.containerNode.appendChild(option);
		   }
	   console.debug("Iterating existing entity role list"+option.value); 
	   }, _entityRoleNameExistingList);
   }
   
   function _getAccountsGrid()
   {
	   var layout = [];
	   if(dj.byId("company_type").get("value")==='02' || dj.byId("company_type").get("value")==='03'){
		   layout = [{field: "acc_num",name: m.getLocalization("accountNumber"),width: '13%',noresize:true},
	                 {field: "bank_name",name: m.getLocalization("bankName"),width: '12%',noresize:true},
	                {field: "displayed_owner_type",name: m.getLocalization("accountOwnerType"),width: '7%',noresize:true},
	     			{field: "acc_type",name: m.getLocalization("accountType"), width: '6%',noresize:true},
	     			{field: "acc_prod_typ",name: m.getLocalization("accountProductType"),width: '8%',noresize:true },
	     			{field: "ccy",name:m.getLocalization("accountCcy"),width: '5%',noresize:true},
	     			{field: "desc",name: m.getLocalization("accountDescription"),width: '10%',noresize:true},
	     			{field: "cust_acc_typ",name: m.getLocalization("custAccountType"),width: '7%',noresize:true},
	     			{field: "bank_id",name: m.getLocalization("bankId"),width: '5%',noresize:true},
	     			{field: "brch_no",name: m.getLocalization("branchNo"),width: '5%',noresize:true},
	     			{field: "nra",name: m.getLocalization("nra"),width: '5%',noresize:true},			
	     			{field: "customerreference",name: m.getLocalization("custReference"),width: '10%',noresize:true},
	     			{field: "actv_flag",name: m.getLocalization("active"),width: '5%',noresize:true},
	     			{ name: 'Id', field: 'accounts_Id', headerStyles: 'display:none', cellStyles: 'display:none',noresize:true}];
	   }
	   else{
		    layout = [{field: "acc_num",name: m.getLocalization("accountNumber"),width: '13%',noresize:true},
		                {field: "displayed_owner_type",name: m.getLocalization("accountOwnerType"),width: '7%',noresize:true},
		     			{field: "acc_type",name: m.getLocalization("accountType"), width: '6%',noresize:true},
		     			{field: "acc_prod_typ",name: m.getLocalization("accountProductType"),width: '8%',noresize:true },
		     			{field: "ccy",name:m.getLocalization("accountCcy"),width: '5%',noresize:true},
		     			{field: "desc",name: m.getLocalization("accountDescription"),width: '10%',noresize:true},
		     			{field: "cust_acc_typ",name: m.getLocalization("custAccountType"),width: '7%',noresize:true},
		     			{field: "bank_id",name: m.getLocalization("bankId"),width: '5%',noresize:true},
		     			{field: "brch_no",name: m.getLocalization("branchNo"),width: '5%',noresize:true},
		     			{field: "nra",name: m.getLocalization("nra"),width: '5%',noresize:true},			
		     			{field: "customerreference",name: m.getLocalization("custReference"),width: '10%',noresize:true},
		     			{field: "actv_flag",name: m.getLocalization("active"),width: '5%',noresize:true},
		     			{ name: 'Id', field: 'accounts_Id', headerStyles: 'display:none', cellStyles: 'display:none',noresize:true}];
	   }

 			if(d.byId("accounts_div"))
 			{
 				var grid = new dojox.grid.DataGrid({
 					query: {
 						id: "*"
 					},
 					id: "accounts_Grid",
 					structure: layout,
 					autoHeight: true,				
 					noDataMessage: m.getLocalization("noAccountsFound"),
 					selectionMode: "none",
 					rowsPerPage : 20,
 					selectable : "true"
 				}, document.createElement("div"));
	 		   d.byId("accounts_div").appendChild(grid.domNode);
	 			grid.startup();
 			} 	   
   }
   
   function _getEnhancedAccountsGrid()
   {
	   var layout = [];
	   if(dj.byId("company_type").get("value")==='02' || dj.byId("company_type").get("value")==='03'){
		   layout = [{field: "acc_num",name: m.getLocalization("accountNumber"),width: '13%',noresize:true},
	                 {field: "bank_name",name: m.getLocalization("bankName"),width: '12%',noresize:true},
	                {field: "displayed_owner_type",name: m.getLocalization("accountOwnerType"),width: '7%',noresize:true},
	     			{field: "acc_type",name: m.getLocalization("accountType"), width: '6%',noresize:true},
	     			{field: "acc_prod_typ",name: m.getLocalization("accountProductType"),width: '8%',noresize:true },
	     			{field: "ccy",name:m.getLocalization("accountCcy"),width: '5%',noresize:true},
	     			{field: "desc",name: m.getLocalization("accountDescription"),width: '10%',noresize:true},
	     			{field: "cust_acc_typ",name: m.getLocalization("custAccountType"),width: '7%',noresize:true},
	     			{field: "bank_id",name: m.getLocalization("bankId"),width: '5%',noresize:true},
	     			{field: "brch_no",name: m.getLocalization("branchNo"),width: '5%',noresize:true},
	     			{field: "nra",name: m.getLocalization("nra"),width: '5%',noresize:true},			
	     			{field: "customerreference",name: m.getLocalization("custReference"),width: '10%',noresize:true},
	     			{field: "actv_flag",name: m.getLocalization("active"),width: '5%',noresize:true},
	     			{ name: 'Id', field: 'accounts_Id', headerStyles: 'display:none', cellStyles: 'display:none',noresize:true}];
	   }
	   else{
		    layout = [{field: "acc_num",name: m.getLocalization("accountNumber"),width: '13%',noresize:true},
		                {field: "displayed_owner_type",name: m.getLocalization("accountOwnerType"),width: '7%',noresize:true},
		     			{field: "acc_type",name: m.getLocalization("accountType"), width: '6%',noresize:true},
		     			{field: "acc_prod_typ",name: m.getLocalization("accountProductType"),width: '8%',noresize:true },
		     			{field: "ccy",name:m.getLocalization("accountCcy"),width: '5%',noresize:true},
		     			{field: "desc",name: m.getLocalization("accountDescription"),width: '10%',noresize:true},
		     			{field: "cust_acc_typ",name: m.getLocalization("custAccountType"),width: '7%',noresize:true},
		     			{field: "bank_id",name: m.getLocalization("bankId"),width: '5%',noresize:true},
		     			{field: "brch_no",name: m.getLocalization("branchNo"),width: '5%',noresize:true},
		     			{field: "nra",name: m.getLocalization("nra"),width: '5%',noresize:true},			
		     			{field: "customerreference",name: m.getLocalization("custReference"),width: '10%',noresize:true},
		     			{field: "actv_flag",name: m.getLocalization("active"),width: '5%',noresize:true},
		     			{ name: 'Id', field: 'accounts_Id', headerStyles: 'display:none', cellStyles: 'display:none',noresize:true}];
	   }

	   if(d.byId("accounts_div"))
		{var grid = new dojox.grid.EnhancedGrid({
	        id: 'accounts_Grid',
	        structure: layout,
	        autoHeight: true,
            rowsPerPage:10,
	        plugins: {
	            pagination: {
	              pageSizes: ['10', '25', '50', '100'],
	              description: true,
	              sizeSwitch: true,
	              pageStepper: true,
	              gotoButton: true,
	              maxPageStep: 7,
	              position: 'top'	             
	            }
	          }
	    }, document.createElement('div'));
	    dojo.byId("accounts_div").appendChild(grid.domNode);
	    grid.startup();}
   }
   /**
    * Builds array list of package roles
    */
   function _getPackageListAsArray()
   {
	   if(dj.byId('subscription_package'))
	   {
		   var packageRoleNameList	=	new dojox.collections.ArrayList();
		   //build a array list of role names available in the selected package
		   if(packageRoleNameList)
		   {
			   for (var i = 0;i < _packageRoleList.length; i++) {
				   console.debug("Role names from package"+_packageRoleList[i]);
				   packageRoleNameList.add(_packageRoleList[i]);
			   }
			   return packageRoleNameList;
		   }
		}
   }
   function validateDuplicateEntity(){
		var entity = this.get("value");
			if(entity !== "" && misys._config.entityArray && misys._config.entityArray !== "") 
			{
				var entities = misys._config.entityArray.split(",");
				if(entities.indexOf(entity) >= 0)
				{
					this.invalidMessage = misys.getLocalization('duplicateEntityAbbvName');
					this.set("state", "Error");
					dj.hideTooltip(this.domNode);
					dj.showTooltip(misys.getLocalization('duplicateEntityAbbvName'), this.domNode, 0);
					return false;
				}
			}
			return true;
	}
   /*this function is used to fix sonar function complexity issues*/
   function _entityAddress()
   {
	 //Change this code with common check
		if(dj.byId('entity_address_line_1'))
			{
			 dj.byId('entity_address_line_1').set('readOnly',false);
			}
		if( dj.byId('entity_address_line_2'))
			{
			 dj.byId('entity_address_line_2').set('readOnly',false);
			}
		if(dj.byId('entity_address_line_3'))
			{
			dj.byId('entity_address_line_3').set('readOnly',false);
			}
		  if(dj.byId('entity_address_line_4'))
			  {
			  dj.byId('entity_address_line_4').set('readOnly',false);
			  }
		   dj.byId('entity_alternative_address_line_1').set('readOnly',false);
		   dj.byId('entity_alternative_address_line_2').set('readOnly',false);
		   dj.byId('entity_alternative_address_line_3').set('readOnly',false);
		   dj.byId('entity_alternative_address_line_4').set('readOnly',false);
   }

	// Public functions & variables follow
	d.mixin(m, {
		bind : function() {
			m.setValidation("bei", m.validateBEIFormat);
			m.setValidation("abbv_name", m.validateCharacters);
			m.setValidation("country_legalid", m.validateCountry);
			
			m.connect("add", "onClick", function(){
				m.addMultiSelectItems(dijit.byId("entity_list"),
						dijit.byId("avail_list"));
			});
			m.connect("remove", "onClick", function(){
				m.addMultiSelectItems(dijit.byId("avail_list"),
						dijit.byId("entity_list"));
			});
			 
			if(dj.byId("charging_account")){
			m.connect("charging_account","onChange",_validateSpecialCharges);
			}
			m.connect("subscription_package", "onChange", function(){
				_clearOptionsForMultiSelectWidget(dojo.byId("entity_role_list"));
				  //get the package details
				_getPackageDetails();
				_modifyAdditonalEntityRoles(); 
			});
			m.connect("enable_additional_role","onChange",function(){
				if(dj.byId("enable_additional_role").get("checked")){
					m.animate('fadeIn', _entityDetailsDiv);
				}else{
					m.animate('fadeOut', _entityDetailsDiv);
				}
			});
		   m.connect("personal","onChange",function(){
				if(!dj.byId("personal").get("checked")){
				      dj.byId("legal_id_type").set("value","");
				      dj.byId("legal_id_no").set("value","");
				      dj.byId("country_legalid").set("value","");
				}
			});
		   m.connect('abbv_name', 'onChange', function(){
				 m.checkEntityIdExists();
			 });
			m.setValidation("account_ccy_cur_code", m.validateCurrency);
			m.setValidation("special_charge_cur_code", m.validateCurrency);
			m.setValidation("stnd_charge_cur_code", m.validateCurrency);
			m.connect("subscription_package","onMouseOver",function(){
				var node = dj.byId("subscription_package");
				//if the package roles are defined, show the tool tip
				if(_packageRoles)
				{
					m.showTooltip(_packageRoles,node.domNode,10);
				}	
			});
			
			d.forEach(m._config.attachedBanks, function(bank, idx){	
				if(dj.byId('Customer_references_count_'+bank))
				{
					for(var k=1; k<=dj.byId('Customer_references_count_'+bank).value; k++)
					{
						if(dj.byId("ref_enabled_"+bank+"_"+k))
						{
							m.connect("ref_enabled_"+bank+"_"+k,"onClick",function(){
								if(!this.get("checked"))
								{
									var message = m.getLocalization("entityCustomerReferenceWarning");
									m.dialog.show("CUSTOM-NO-CANCEL", message, "Entity Reference Warning", "", "", "", "", "");
								}
							});
						}
					}
				}
			});
			
			m.setValidation("email", m.validateEmailAddr);
			//based on the charging account currency  make the special charge currency code mandatory or not
			m.connect("special_charge_cur_code","onChange",function(){
						 m.setCurrency(this, ["special_charge_amt"]);
						 var specialChargeCCy = this.get('value'),
							accountNo = dj.byId('charging_account').get('value'),
							chargingAccountCCy;
						    if(dj.byId('accounts-grid') && dj.byId('accounts-grid').store)
						    {
						    	dj.byId('accounts-grid').store.fetch({query: {store_id: '*'}, 
						    		onComplete: dojo.hitch(this, function(items, request){
						    			dojo.forEach(items, function(item){
						    				var value = item['account_number'];
						    				var ccy = item['ccy'];
						    				//check the grid account no is same as the selected charging account no
						    				if(value === accountNo)
						    				{
												chargingAccountCCy = ccy[0];
						    				}
						    			}, this);
						    	})});
						    	if(chargingAccountCCy !== specialChargeCCy )
						    	{
						    		var displayMessage = m.getLocalization("invalidSpecialChargeCurrency"),
										//focus on the widget and set state to error and display a tooltip indicating the same
								 		widget = dj.byId("special_charge_cur_code");
								 		widget.focus();
								 		widget.set("state","Error");
								 		dijit.hideTooltip(widget.domNode);
								 		dijit.showTooltip(displayMessage, widget.domNode, 0);
						    	}
						    }
			});
			m.connect("stnd_charge_cur_code", "onChange", function(){
				m.setCurrency(this, ["stnd_charge_amt"]);
			});
			
			m.connect("account_product_type","onChange",function(){
							var accountType =  dj.byId('bank_account_type').get('value'),
							    accountProdType = dj.byId('account_product_type').get('value'),
							    accountMapping = "",
								acctDescription = null,
								accountTypeCode = "99";
							if(accountType !== "" && accountProdType !== "")
							{
								accountMapping = accountType +"-"+ accountProdType;
							}
							if(m._config.bankAccountTypeMapping[accountMapping])
							{
								acctDescription = m._config.bankAccountTypeMapping[accountMapping].accountDescription;
							}
							//set the account description 
							if(acctDescription !== null && acctDescription !== "")
							{
								dj.byId("account_desc").set("value",acctDescription);
							}else{
								 var displayMessage = m.getLocalization("invalidAccountTypeProductType"),
									//focus on the widget and set state to error and display a tooltip indicating the same
								 	field = dj.byId("account_desc");
								 	field.state = 'Error';
									field._setStateClass();
									dijit.setWaiState(field.focusNode, "invalid", "true");
									dijit.showTooltip(displayMessage, field.domNode, 0);
									dj.byId("account_desc").set("value","");
							}
							//get the account type from the mapping
							if(m._config.accountTypeCodeMapping[accountMapping])
							{
								accountTypeCode = m._config.accountTypeCodeMapping[accountMapping].accountTypeCode;
							}
							dj.byId('account_type').set('value',accountTypeCode);
			});
			m.setValidation("country_legalid", m.validateCountry);
			m.setValidation("entity_country", m.validateCountry);
			// set the on change currency event for value added services 
			 var totalNoValueAddedService = dj.byId('total_value_added_services');
				if(totalNoValueAddedService)
				{
					for(var i=1; i<=totalNoValueAddedService.get('value'); i++){
						(function(value) {
							m.setValidation("service_stnd_charge_"+value+"_cur_code", m.validateCurrency);
							m.setValidation("service_special_chge_"+value+"_cur_code", m.validateCurrency);
							m.connect("service_stnd_charge_"+value+"_cur_code", "onChange", function(){
								m.setCurrency(this, ["service_stnd_amt_"+value]);
							});
							m.connect("service_special_chge_"+value+"_cur_code", "onChange", function(){
								m.setCurrency(this, ["service_special_amt_"+value]);
							});
						})(i);
					}
				}
			m.setValidation("abbv_name", m.validateCharactersExcludeSpace);
		//	m.setValidation("abbv_name", validateDuplicateEntity);
			m.connect('abbv_name', 'onKeyPress', function(e)
					{
					if(e.keyCode === 32 || e.charCode === 32){
						dojo.stopEvent(e);
					}
					});
			if(dj.byId('CompanyId')){
			CompanyId=dj.byId('CompanyId').get('value');
			}
			
			d.forEach(m._config.attachedBanks, function(/*String*/ bank, idx){
				if(dj.byId('Customer_references_count_'+bank))
				{				
					var custrefcount=dj.byId('Customer_references_count_'+bank).get('value');
					var custreference="";
					for(var cnt=1; cnt<=custrefcount; cnt++)
					{
						(function(idx){
							m.connect("ref_enabled_"+bank+"_"+idx,"onClick",function(){
					    		if(dj.byId("company_type").get("value")==='02' || dj.byId("company_type").get("value")==='03' ){
					    			if(dj.byId("ref_enabled_"+bank+"_"+idx).get("checked"))
					    				{
						    				if(d.byId('accounts_div'))
							    			{
							    				d.byId('accounts_div').style.display = 'block';
							    			}
						    				loadedOnFormLoad = true;
						    				custreference=dj.byId("custref_"+bank+"_"+idx).get('value');
							    			custrefs.push(custreference);
						    				var bankname = bank;
						    				_getAccountsByReference(custrefs, bankname);
						    				custrefs=[];
						    				setTimeout(function(){
						    					_retreiveAccnum();
						    				}, 2000);
					    				}
					    			else if(dj.byId("custref_"+bank+"_"+idx))
					    				{
					    				var removeAccountByThisRef= dj.byId("custref_"+bank+"_"+idx).get("value");
					    				accountList = accountList.filter(function(value){
		    								if(value.customerreference[0]===removeAccountByThisRef && value.bank_name[0] === bank){
		    									removedAccountNo.push(value.acc_num[0]);
		    									loadedOnFormLoad = true;
		    									return false;
		    								}
		    								else{
		    									loadedOnFormLoad = true;
		    									return true;
		    									}
	    								});
				    					_createAccountListGridStore();	
				    					setTimeout(function(){
				    						_retreiveAccnum();
				    					}, 2000);
					    				}
					    		}
					    		else{
						    			if(dj.byId("ref_enabled_"+bank+"_"+idx).get("checked"))
						    			{
							    			if(d.byId('accounts_div'))
							    			{
							    				d.byId('accounts_div').style.display = 'block';
							    			}
							    			custreference=dj.byId("custref_"+bank+"_"+idx).get('value');
							    			custrefs.push(custreference);
							    			var url = [m.getServletURL("/screen/AjaxScreen/action/GetCustomeraccountsbyReferences")];
											url.push("?companyid=", CompanyId,"&custrefs=", encodeURIComponent(custrefs));
											_createGridsStore(url.join(""));
											setTimeout(function(){
												_retreiveAccnum();
											}, 2000);
						    			}
							    		else{	
							    			var remove_ref=dj.byId("custref_"+bank+"_"+idx).get('value');
							    			for(var j=0; j<custrefs.length;j++)
							    			   { 
							    			  if(custrefs[j]===remove_ref)
							    				  {
							    				  custrefs.splice(j,1); 
							    				  }				    			  
							    			   } 
							    			var urlnew = [m.getServletURL("/screen/AjaxScreen/action/GetCustomeraccountsbyReferences")];
							    			urlnew.push("?companyid=", CompanyId,"&custrefs=", encodeURIComponent(custrefs));
											_createGridsStore(urlnew.join(""));
											setTimeout(function(){
												_retreiveAccnum();
											}, 2000);
							    		   }
					    		}
						    	});
							})(cnt);
					    }
					}
				});
		},
	 
		onFormLoad : function() {
			if(dj.byId("charging_account")){
				_entityAddress();
			}
			   //on form load set the value added service currencies Additional onload events for dynamic fields service_stnd_charge_1_cur_code
			   var totalNoValueAddedService = dj.byId('total_value_added_services');
				if(totalNoValueAddedService)
				{
					for(var i=1;i <= totalNoValueAddedService.get('value');i++)
					{
						m.setCurrency(dj.byId("service_stnd_charge_"+i+"_cur_code"), ["service_stnd_amt_"+i]);
						m.setCurrency(dj.byId("service_special_chge_"+i+"_cur_code"), ["service_special_amt_"+i]);
					}
				}
				m.setCurrency(dj.byId("stnd_charge_cur_code"),["stnd_charge_amt"]);
				m.setCurrency(dj.byId("special_charge_cur_code"),["special_charge_amt"]);
				// build the entity role list present under add additional role section
				_buildAdditionalEntityRoleList();
				// for edit mode get the package details
				_getPackageDetails();
				// modify entity role section 
				_modifyAdditonalEntityRolesOnFormLoad();
				//create grid
				if(dj.byId('Curr_mode'))
				{
					currentmode= dj.byId('Curr_mode').get('value');
		        }
				if(currentmode  === 'NEW')
				{
					if(d.byId('accounts_div'))
					{
						d.byId('accounts_div').style.display = 'none';
					}
				}
				var onFormLoad = true;
				var companyType = dj.byId("company_type");
				_getEnhancedAccountsGrid();
				if(companyType.get("value")==='01'){
					_selectCheckBoxes(onFormLoad);	
				}
				if(companyType.get("value")!=='01'){
					_selectCheckBoxesMultiBank(onFormLoad);	
		}
	}
	});
	
	// Add the XML transform function
	m._config = m._config || {};
	d.mixin(m._config, {
		xmlTransform : function(/*String*/ xml) {
			// String manipulation to remove the entity_list node (easier than 
			// building a DOM since we keep almost the exact same structure as before)
			// TODO Should probably use a DOM anyway, for consistency
			var 
				multiSelects = [dj.byId('entity_list'), dj.byId('avail_list')],
				entityNodeIndex = xml.indexOf("<" + _entityListNode + ">"),
				availEntityNodeIndex = xml.indexOf("<" + _availListNode + ">"),
				entities = (entityNodeIndex !== -1) ? 
						xml.substring(entityNodeIndex + _entityListNode.length + 2,
									  xml.indexOf("</" + _entityListNode + ">")).split(",") : [],
				availEntities = (availEntityNodeIndex !== -1) ? 
						xml.substring(availEntityNodeIndex + _availListNode.length + 2,
								xml.indexOf("</" + _availListNode + ">")).split(",") : [],
				mainXml = [],
				//get the total avalible value added services to the entity
				totalAvaliValueAddedServics = dj.byId('total_value_added_services').value,
                dom = dojox.xml.DomParser.parse(xml);				
				mainXml.push("<entity>");
				//if index is s in negative donot split
				if(xml.indexOf("<" + "entity" + ">") !== -1)
				{
					mainXml.push(xml.substring(xml.indexOf("<" + "entity" + ">") + 8,xml.indexOf("</" + "entity" + ">")));
				}
				//build selected value added services to xml
				for(var i=1;i<=totalAvaliValueAddedServics;i++)
				{
					if(dj.byId("select_service_"+i) && dj.byId("select_service_"+i).get("checked"))
					{
						mainXml.push("<value_added_services_"+i+">");
						mainXml.push(m.getDomNode(dom,"sevice_name_"+i));
						mainXml.push(m.getDomNode(dom,"service_std_chge_ccy_"+i));
						mainXml.push(m.getDomNode(dom,"service_stnd_charge_"+i));
						mainXml.push(m.getDomNode(dom,"service_chge_"+i+"_cur_code"));
						mainXml.push(m.getDomNode(dom,"service_special_charge_"+i));
						mainXml.push(m.getDomNode(dom,"service_special_charge_expiry_"+i));
						mainXml.push(m.getDomNode(dom,"service_subscription_waive_"+i));
						mainXml.push(m.getDomNode(dom,"service_waive_expiry_date"+i));
						mainXml.push(m.getDomNode(dom,"service_local_tax_"+i));
						mainXml.push("</value_added_services_"+i+">");
					}
				}
				d.forEach(m._config.attachedBanks, function(bank, idx){	
					if(dj.byId('Customer_references_count_'+bank))
					{
						for(var k=1; k<=dj.byId('Customer_references_count_'+bank).value; k++)
						{
							if(dj.byId("ref_enabled_"+bank+"_"+k) && dj.byId("ref_enabled_"+bank+"_"+k).get("checked"))
							{
								mainXml.push("<references>");
								mainXml.push("<bankabbvname>");
								mainXml.push(bank);
								mainXml.push("</bankabbvname>");
								mainXml.push("<bankid>");
								mainXml.push(dj.byId("bank_id_"+bank).get('value'));
								mainXml.push("</bankid>");
								mainXml.push("<reference>");
								var custref = dj.byId("custref_"+bank+"_"+k).get('value');
								var ref = custref.replace(/&/gi, "&amp;");
								mainXml.push(ref);								
								mainXml.push("</reference>");
								mainXml.push("<description>");
								var custdesc = dj.byId("custdesc_"+bank+"_"+k).get('value');
								var desc = custdesc.replace(/&/gi, "&amp;");
								mainXml.push(desc);
								mainXml.push("</description>");
								mainXml.push("</references>");							
							}					
						}				
					}
				});
				if(dj.byId("enable_additional_role") && dj.byId("enable_additional_role").get("checked") && dom.getElementsByTagName("entity_role_list").length > 0)
				{
					mainXml.push(_addExistingEntityRoles(dom, "entity_role_list"));
				}
				mainXml.push("</entity>");
				console.debug("[binding.entity] Transforming XML", mainXml);			
				return mainXml.join("");
		}
	});
	
	d.mixin(m, {
	getCIFDetails : function(){
		var legalIdType = dijit.byId('legal_id_type').getValue(),
		    legalIdNo = dijit.byId('legal_id_no').getValue(),
		    legalCountryNo =  dijit.byId('country_legalid').getValue();
		//check if legal id type is not selected
		if(legalIdType === ''){
		  	dijit.byId('legal_id_type').set("state","Error");
		}
		//check if legalIdNois not entered
		if(legalIdNo === ''){
		  	dijit.byId('legal_id_no').set("state","Error");
		}
		//check if legalCountryNo is not entered
		if(legalCountryNo === ''){
		  	dijit.byId('country_legalid').set("state","Error");
		}
	},
	
	fncValidateAccountPopup :function(){
			dj.byId('accountOkButton').set('disabled',true);
			var mandatoryFields = ['account_number','account_product_type','cust_account_type','bank_id','brch_no','account_desc'];
			var valid = dojo.every(mandatoryFields, function(id){
				var field = dj.byId(id);
				if(field){
					var value = field.get('value');
					if(value === '' || field.state === 'Error'){
						misys.showTooltip(misys.getLocalization('mandatoryFieldsError'), field.domNode, ['above','before']);
						field.state = 'Error';
						field._setStateClass();
						dijit.setWaiState(field.focusNode, "invalid", "true");
						return false;
					}
				}
				return true;
			});	
			dj.byId('accountOkButton').set('disabled',false);
		if(!valid){
				return false;
			} else {
				dj.byId('account-dialog-template').gridMultipleItemsWidget.updateData();
				dj.byId('accounts').dialog.hide();
				return true;
			}
			},
	
	toggleReferenceSection : function(/*String*/suffix, /*String*/dir){
		   var downArrow = d.byId("customer_bank_down_"+suffix);
		   var upArrow = d.byId("customer_bank_up_"+suffix);
		   if(dir === 'down' && d.style(suffix, "display") === "none")
		   {
				   	misys.animate('wipeIn', suffix);
				     d.style(downArrow, "display", "none");
				     d.style(upArrow, "display", "inline");
		   }
		   else if (dir === 'up' && d.style(suffix, "display") !== "none")
		   {
		     misys.animate('wipeOut', suffix);
		     d.style(upArrow, "display", "none");
		     d.style(downArrow, "display", "inline");
		   }
		  } 
	 });
	d.ready(function(){
		d.require("misys.system.widget.Accounts");
		d.require("misys.system.widget.Account");
	});
})(dojo, dijit, misys);
//Including the client specific implementation
       dojo.require('misys.client.binding.system.entity_mc_client');