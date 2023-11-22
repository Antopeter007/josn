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
dojo.require("misys.widget.Dialog");
dojo.require("dojox.xml.DomParser");
dojo.require("dojox.grid.EnhancedGrid");
dojo.require("dojox.grid.enhanced.plugins.DnD");
dojo.require("dojox.grid.enhanced.plugins.IndirectSelection");
dojo.require("dojox.collections.ArrayList");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {
	
	"use strict"; // ECMA5 Strict Mode
	
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
		_packageRoleList;
		
	//private
	//method to make a ajax call get cif details from interface
	function _getCompanyCIF(){
		//  summary:
	    //         Gets the  cif details from interface
	    //  tags:
	    //         public
		var legalIdType = dj.byId('legal_id_type').getValue(),
			legalIdNo = dj.byId('legal_id_no').getValue(),
			legalCountryNo =  dj.byId('country_legalid').getValue(),
			reference_field = dj.byId('reference'),
			name_field = dj.byId('name'),
			second_entity_name_field = dj.byId('second_entity_name');
		var	displayMessage;
			
		     //clear the value for cif if it s already set
		    if(reference_field.value !== "")
		    {
		    	reference_field.set('value','');
		    }
		    if(name_field.value !== "")
		    {
		    	name_field.set('value','');
		    }
		    if(second_entity_name_field.value != "")
		    {
		    	second_entity_name_field.set('value','');
		    }
		m.xhrPost( {
			url : misys.getServletURL("/screen/AjaxScreen/action/GetCompanyCIF") ,
			handleAs : "json",
			sync : true,
			content : {
				legalIdType : legalIdType,
				legalIdNo : legalIdNo,
				legalCountryNo : legalCountryNo
			},
			load : function(response, args){
				
				switch(response.items.StatusCode)
				{
					case '0000000':
						            
						            if(!response.items.CIFNo || response.items.CIFNO === "")
						            {
						            	displayMessage = misys.getLocalization('NoCIFFound');
						            	reference_field.focus();
										reference_field.set("value","");
										reference_field.set("state","Error");
										dj.hideTooltip(reference_field.domNode);
										dj.showTooltip(displayMessage, reference_field.domNode, 0);
						            	
						            }
						            else{
						            	
						            	//Populate the response fields into hidden fields to persist
										reference_field.set("value",response.items.CIFNo);
										reference_field.set("readOnly",true);
										name_field.set("value",response.items.CustomerName1);
										name_field.set("readOnly",true);
						            }
									
									if(response.items.CustomerName2)
									{
										second_entity_name_field.set("value",response.items.AcctCur);
									}
									break;
					case 'ERR_MQ_INTERFACE_FAILURE':
									displayMessage = misys.getLocalization('CIFFetcingmqFailure');
									//focus on the widget and set state to error and display a tool tip indicating the same
									reference_field.focus();
									reference_field.set("value","");
									reference_field.set("state","Error");
									dj.hideTooltip(reference_field.domNode);
									dj.showTooltip(displayMessage, reference_field.domNode, 0);
									break;
					case 'ERR_SAME_CIF_EXISTS':
									displayMessage = misys.getLocalization('CIFAlreadyAssignedtoOtherEntity',[response.items.CIFNo]);
									//focus on the widget and set state to error and display a tool tip indicating the same
									reference_field.focus();
									reference_field.set("value","");
									reference_field.set("state","Error");
									dj.hideTooltip(reference_field.domNode);
									dj.showTooltip(displayMessage, reference_field.domNode, 0);
									break;
					default:
									displayMessage = response.items.StatusCodeMessage;
									//focus on the widget and set state to error and display a tool tip indicating the same
									reference_field.focus();
									reference_field.set("value","");
									reference_field.set("state","Error");
									dj.hideTooltip(reference_field.domNode);
									dj.showTooltip(displayMessage, reference_field.domNode, 0);
									break;
						
				}
				
			},
			error : function(response, args){
				console.error('[] ');
				console.error(response);
				
			}
		});
	}
	
	function _validateAccountItmes(){
		console.info("[_validateAccountItems] setting error message for the account interface grid");
		if(dj.byId('account-interface-grid'))
		{
			// empty the present error message
			 dj.byId('account-interface-grid').errorMessage = "";
			//dj.byId('account-interface-grid').errorMessage = "sorry interface is down";
		}
		
	}
	function _addExistingEntityRoles( /*String*/ dom,
			  /*String*/ nodeName) {
		//  summary: 
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
	//private
	//method to make a ajax call to get charging account details from interface
	function _getChargingAccountAddress(){
		var chargingAccountNo  = dj.byId('charging_account').get('value');
		if (chargingAccountNo && chargingAccountNo !== ""){
				var chargingAccountType,
				address_line_1_field = dj.byId('entity_address_line_1'),
				address_line_2_field = dj.byId('entity_address_line_2'),
				address_line_3_field = dj.byId('entity_address_line_3'),
				address_line_4_field = dj.byId('entity_address_line_4'),
				entity_alternative_address_line_1_field = dj.byId('entity_alternative_address_line_1'),
				entity_alternative_address_line_2_field = dj.byId('entity_alternative_address_line_2'),
				entity_alternative_address_line_3_field = dj.byId('entity_alternative_address_line_3'),
				entity_alternative_address_line_4_field = dj.byId('entity_alternative_address_line_4');
				
				
			//fetch the store and its items
		    //get the charging account currency by parsing the grid 
			dj.byId('accounts-grid').store.fetch({query: {store_id: '*'}, 
	//	    if (chargingAccountNo.length() >0) {
	//	    	return true;
	//	    }
			onComplete: dojo.hitch(this, function(items, request){
				dojo.forEach(items, function(item){
						var value = item['account_number'];
						var name =  item['description'];
						var type = item['type'];
						//check the grid account no is same as the selected charging account no
						if(value == chargingAccountNo)
						{
							chargingAccountType = type[0];
						}
					
				}, this);
			})});
			m.xhrPost( {
			url : misys.getServletURL("/screen/AjaxScreen/action/GetChargingAccountAddrDetails") ,
			handleAs : "json",
			sync : true,
			content : {
				chargingAccountNo : chargingAccountNo,
				chargingAccountType: chargingAccountType
			},
			load : function(response, args){
				switch(response.items.StatusCode)
				{
					case '0000000':
						            
						if(!response.items.address_line_1 || response.items.address_line_1 === "")
						{
							displayMessage = misys.getLocalization('NoAddressFound');
							reference_field.focus();
							address_line_1_field.set("value","");
							address_line_1_field.set("state","Error");
							dj.hideTooltip(address_line_1_field.domNode);
							dj.showTooltip(displayMessage, address_line_1_field.domNode, 0);
				
						}
						else
						{
							//Populate the response fields into  fields to persist
							address_line_1_field.set("value",response.items.address_line_1);
							address_line_1_field.set("readOnly",true);
							// address line 2
							address_line_2_field.set("value",response.items.address_line_2);
							address_line_2_field.set("readOnly",true);
							// address line 3
							address_line_3_field.set("value",response.items.address_line_3);
							address_line_3_field.set("readOnly",true);
							// address line 4
							if(response.items.address_line_4)
							{
								address_line_4_field.set("value",response.items.address_line_4);
								address_line_4_field.set("readOnly",true);
							}
							//entity_alternative_address_line_1_field.set("value",response.items.address_line_1);
							entity_alternative_address_line_1_field.set("readOnly",false);
							// alternative address line 2
							//entity_alternative_address_line_2_field.set("value",response.items.address_line_2);
							entity_alternative_address_line_2_field.set("readOnly",false);
							// alternative address line 3
							//entity_alternative_address_line_3_field.set("value",response.items.address_line_3);
							entity_alternative_address_line_3_field.set("readOnly",false);
							if(response.items.address_line_4)
							{
								//entity_alternative_address_line_4_field.set("value",response.items.address_line_4);
								entity_alternative_address_line_4_field.set("readOnly",false);
							}
						}
									
						break;
					case 'ERR_MQ_INTERFACE_FAILURE':
							displayMessage = misys.getLocalization('AddressFetcingmqFailure');
							//focus on the widget and set state to error and display a tool tip indicating the same
							address_line_1_field.focus();
							address_line_1_field.set("value","");
							address_line_1_field.set("state","Error");
							dj.hideTooltip(address_line_1_field.domNode);
							dj.showTooltip(displayMessage, address_line_1_field.domNode, 0);
							break;
					default:
							displayMessage = response.items.StatusCodeMessage;
							//focus on the widget and set state to error and display a tool tip indicating the same
							address_line_1_field.focus();
							address_line_1_field.set("value","");
							address_line_1_field.set("state","Error");
							dj.hideTooltip(address_line_1_field.domNode);
							dj.showTooltip(displayMessage, address_line_1_field.domNode, 0);
							break;
						
				}
				
				
			},
			error : function(response, args){
				console.error('[] ');
				console.error(response);
				
			}
			});
		}
	}
	//get the package details
    function _getPackageDetails(){
    	var packageId = dj.byId('subscription_package');
    		
    		m.xhrPost( {
    		url : misys.getServletURL("/screen/AjaxScreen/action/GetSubscriptionPackageDetails") ,
    		handleAs : "json",
    		sync : true,
    		content : {
    			packageIdValue : packageId.get('value')
    		},
    		load : function(response, args){
    			var packageDetails = response.packageDetails;
    			   dj.byId('stnd_charge_cur_code').setValue(packageDetails[0]);
    			   dj.byId('stnd_charge_amt').setValue(packageDetails[1]);
    			   _packageRoles = packageDetails[2];
    			   //list of roles with role names
    			   _packageRoleList = packageDetails[3];
    			   _validateSpecialCharges();
    			  
    		},
    		error : function(response, args){
    			console.error('[Couldnot Get Subscription Package Details] '+packageId.get('value'));
    			console.error(response);
    			
    		}
    	});
    	
    }
       
    /**
     * validate the special charges against the charging account curreny
     */
    function _validateSpecialCharges(){
    	
   		 if(dj.byId('charging_account')){
    		var chargingAccount = dj.byId('charging_account'),
    	    	charginAccCCy = "",
    	    	stdChargeCCy = dj.byId('stnd_charge_cur_code').get('value'),
    	    	chargingAccNo = dj.byId('charging_account').value;
    		//fetch the store and its items
    		 if(dj.byId('accounts-grid'))
    		 {
				dj.byId('accounts-grid').store.fetch({query: {store_id: '*'}, 
					onComplete: dojo.hitch(this, function(items, request){
						dojo.forEach(items, function(item){
							var value = item['account_number'][0];
							var name =  item['description'][0];
							var ccy = item['ccy'][0];
							if(value == chargingAccNo)
							{
								charginAccCCy = ccy;
							}
						
						}, this);
					})});
    		 }
    		//if std charge ccy and charging account currecny are different
    		// special charge currency and special charge should be mandatory
    		if(charginAccCCy !== stdChargeCCy){
    			dj.byId('special_charge_cur_code').set('required',true);
    			dj.byId('special_charge_amt').set('required',true);
    			// TODO Hack to show fields are mandatory as on click of submit
    			// despite required set, not getting focused on these fields
    			//dj.byId('special_charge_cur_code').set('state','Error');
    			//dj.byId('special_charge_amt').set('state','Error');
    		}else{
    			dj.byId('special_charge_cur_code').set('required',false);
    			dj.byId('special_charge_amt').set('required',false);
    		}
    	
   		}
    }
    function  _clearOptionsForMultiSelectWidget(/**Dom object**/object)
    {
 	     while (object.hasChildNodes()){ 
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
     *                                                         
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
 		   //iterate through the destination multi select options
 		   dojo.query("option",entityRoleDestMultiSelect.containerNode).forEach(function(n){
 			   _entityRoleNameMasterList.add(n);
 			 //separate list to maintain existing list of entity roles
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
 		   if(!packageRoleNameList.contains(option.value))
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
 		   if(!packageRoleNameList.contains(option.value))
 		   {
 			   //append the option object 
 			   entityAvailListNoSendField.containerNode.appendChild(option);
 		   }
 	   console.debug("Iterating available entity role list"+option.value); 
 	   }, _entityRoleNameAvailList);
 	   console.debug("count for existing entity role name list"+_entityRoleNameExistingList.count);
 	   // build the available list which does not contain package roles.
 	   _entityRoleNameExistingList.forEach(function(option){
 		   if(!packageRoleNameList.contains(option.value))
 		   {
 			   //append the option object 
 			   entityExistingListField.containerNode.appendChild(option);
 		   }
 	   console.debug("Iterating existing entity role list"+option.value); 
 	   }, _entityRoleNameExistingList);
    }
    /**
     * Builds array list of package roles
     */
    function _getPackageListAsArray()
    {
 	   var packageRoleNameList	=	new dojox.collections.ArrayList();
 	   //build a array list of role names available in the selected package
 	   for (var i = 0;i < _packageRoleList.length; i++) {
 		   console.debug("Role names from package"+_packageRoleList[i]);
 		   packageRoleNameList.add(_packageRoleList[i]);
 	   }
 	   return packageRoleNameList;
    }
    /**
     * clear CIF and all dependents fields when Legal ID, No or Country changes
     */
    function _clearCIFFields(){
    	var fields = [ "name", "second_entity_name", "reference", "description" ];
		d.forEach(fields, function(fieldName){
			var field = dj.byId(fieldName);
			if (field){
				field.set("value", "");
			}
		});
		var abbvName = dj.byId("abbv_name");
		if (abbvName && !abbvName.get("readOnly")){
			abbvName.set("value", "");
		}
    	_clearCIFDependentFields();
    }
    /**
     * Accounts added to the Grid, are associated with the customer CIF,
     * Once CIF is changed, need to clear the grid as well so the user need to select accounts
     * for the newly changed CIF
     */
    function _clearCIFDependentFields(){
    	
    	var emptyAccountStoreItems = {items: []},
    		emptyStore;
    	// On CIF Change, clear the accounts
    	if(dj.byId("accounts-grid"))
    	{
    		emptyStore = new dojo.data.ItemFileReadStore({data:emptyAccountStoreItems});
    		dj.byId("accounts-grid").setStore(emptyStore);
    		dj.byId("accounts-grid")._refresh();
    	}
    	// once accounts are cleared, cleared dependent charging account 
    	if(dj.byId("charging_account"))
    	{
    		emptyStore = new dojo.data.ItemFileReadStore({data:emptyAccountStoreItems});
    		dj.byId("charging_account").set("value","");
    		dj.byId("charging_account").store = emptyStore;
    	}
    	
    }
    function _createMultipleAccountGrid(){

        //set up layout for account interface grid
        var layout = [
            {
            'name': 'Ccy',
            'field': 'ccy',
            'width': '10%'
            
        },
        {
            'name': 'Account Number',
            'field': 'account_number',
            'width': '15%'
        },
        {
            'name': 'Account Type',
            'field': 'type',
            'width': '15%'
        },
        {
            'name': 'Product Type',
            'field': 'account_product_type',
            'width': '15%'
        },
        {
        	'name':'Description',
        	'field': 'description',
        	'width': '25%'
        },
        {
            'name': 'NRA Flag',
            'field': 'nra',
            'width':'7%'
        },
        {
            'name': 'Existing BIB Account',
            'field': 'existing_bib_account',
            'width': '7%'
        }
        ];

       // create a new grid:
        var grid = new dojox.grid.EnhancedGrid({
            id: 'account-interface-grid',
            structure: layout,
            rowSelector: '0px',
            autoHeight:10,
            rowsPerPage:'10',
            plugins: {
            			dnd: true,
                       indirectSelection: {
                           width: "3%",
                           styles: "text-align: center;"
                     }
            }
        },dojo.create('div',{ style: "position: relative;" }));
        d.place(grid.domNode,"dialog-buttons","before");
      //  m.connect(grid, "_onFetchError", _validateAccountItmes);
    }

	
	// Public functions & variables follow
	d.mixin(m, {
		bind : function() {
			m.setValidation("bei", m.validateBEIFormat);
			m.setValidation("abbv_name", m.validateCharacters);
			m.setValidation("country_legalid", m.validateCountry);
			m.setValidation("entity_country", m.validateCountry);

			m.connect("add", "onClick", function(){
				m.addMultiSelectItems(dijit.byId("entity_list"),
						dijit.byId("avail_list"));
			});
			m.connect("remove", "onClick", function(){
				m.addMultiSelectItems(dijit.byId("avail_list"),
						dijit.byId("entity_list"));
			});
			m.connect("charging_account", "onChange", _getChargingAccountAddress);
			m.connect("charging_account","onChange",_validateSpecialCharges);
			m.connect("subscription_package", "onChange", function(){
				 //clear the selected entity role widget
				_clearOptionsForMultiSelectWidget(dojo.byId("entity_role_list"));
				  //get the package details
				_getPackageDetails();
				  //modifying additional entity roles based on package roles
				_modifyAdditonalEntityRoles();
				
			});
			//TODO just to test
			//m.connect("reference","onChange",_getChargingAccountAddress);
			m.connect("reference","onChange",_clearCIFDependentFields);

			m.connect("legal_id_type", "onChange", _clearCIFFields);
			m.connect("legal_id_no", "onChange", _clearCIFFields);
			m.connect("country_legalid", "onChange", _clearCIFFields);
			
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
		  // m.connect(grid, "_onFetchComplete", _validateAccountItmes)
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
			m.setValidation("email", m.validateEmailAddr);
		   
			//based on the charging account currency  make the special charge currency code
			//mandatory or not
			m.connect("special_charge_cur_code","onChange",function(){
				//validate special charge currency should always be same as charging currency
				var specialChargeCCy = this.get('value'),
					chargingAccount = dj.byId('charging_account'),
					accountNo = dj.byId('charging_account').get('value'),
					chargingAccountCCy;
				
					m.setCurrency(this, ["special_charge_amt"]);
					//fetch the store and its items
				    //get the charging account currency by parsing the grid 
				 	if(dj.byId('accounts-grid') && dj.byId('accounts-grid').store)
				    {
						dj.byId('accounts-grid').store.fetch({query: {store_id: '*'}, 
						onComplete: dojo.hitch(this, function(items, request){
							dojo.forEach(items, function(item){
									var value = item['account_number'];
									var name =  item['description'];
									var ccy = item['ccy'];
									//check the grid account no is same as the selected charging account no
									if(value == accountNo)
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
			//map the account product type and account type to get the account description
			m.connect("stnd_charge_cur_code", "onChange", function(){
				m.setCurrency(this, ["stnd_charge_amt"]);
			});
			// set currency validation
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
				m.connect('abbv_name', 'onKeyPress', function(e)
						{
						if(e.keyCode === 32 || e.charCode === 32){
							dojo.stopEvent(e);
						}
						});
		},
	 
		onFormLoad : function() {
			   dj.byId('entity_address_line_1').set('readonly',true);
			   dj.byId('entity_address_line_2').set('readonly',true);
			   dj.byId('entity_address_line_3').set('readonly',true);
			   dj.byId('entity_address_line_4').set('readonly',true);
			   //add the alternative address 
			   dj.byId('entity_alternative_address_line_1').set('readonly',false);
			   dj.byId('entity_alternative_address_line_2').set('readonly',false);
			   dj.byId('entity_alternative_address_line_3').set('readonly',false);
			   dj.byId('entity_alternative_address_line_4').set('readonly',false);
			   
			   dj.byId('reference').set('readOnly',true);
			   //dj.byId('description').set('readOnly',true);
			   dj.byId('name').set('readOnly',true);
			   dj.byId('second_entity_name').set('readOnly',true);
			   //on form load set the value added service currencies
				// Additional onload events for dynamic fields
			   //service_stnd_charge_1_cur_code
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
				//for edit mode get the package details
				_createMultipleAccountGrid();
				// build the entity role list present under add additional role section
				_buildAdditionalEntityRoleList();
				// for edit mode get the package details
				_getPackageDetails();
				// modify entity role section 
				_modifyAdditonalEntityRolesOnFormLoad();
				
		}
	});
	
	// Add the XML transform function
	m._config = m._config || {};
	d.mixin(m._config, {
		xmlTransform : function(/*String*/ xml) {
			// String manipulation to remove the entity_list node (easier than 
			// building a DOM since we keep almost the exact same structure as before)
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
				entitiesXml  = [],
				availEntitiesXml = [],
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
					//check if service check box is selected
					if(dj.byId("select_service_"+i).get("checked"))
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
				
				// Contents of the references element
				mainXml.push("<references>");
				mainXml.push(m.getDomNode(dom, "reference"));
				mainXml.push(m.getDomNode(dom, "description"));
				mainXml.push("</references>");
				//construct the xml with entity roles in the standard format
				//construct the xml oly when the additional entity roles is checked
				if(dj.byId("enable_additional_role"))
				{
					if(dj.byId("enable_additional_role").get("checked"))
					{
						if(dom.getElementsByTagName("entity_role_list").length > 0) {
							mainXml.push(_addExistingEntityRoles(dom, "entity_role_list"));
						}
					}
				}
				
				//add the end tag
				mainXml.push("</entity>");
				
				console.debug("[binding.entity] Transforming XML", mainXml);			
				return mainXml.join("");
			
			
			
		}
	});
	
	
	d.mixin(m, {
	getCIFDetails : function(/*String*/ cif){
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
		  	dijit.byId('legal_id_country').set("state","Error");
		}
		_getCompanyCIF();
		
	},
	fncValidateAccountPopup :function(){
			dj.byId('accountOkButton').set('disabled',true);
			var mandatoryFields = ['account_number'];
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
		/*	if(!valid){
				return false;
			} else {*/
				dj.byId('account-dialog-template').gridMultipleItemsWidget.updateData();
				dj.byId('accounts').dialog.hide();
				return true;
			//}
	 },
	 fncUpdateNickName:function()
	 {
			var field = dj.byId('nickname');
			if(field){
				var value = field.get('value');
				if(value === '' || field.state === 'Error'){
					misys.showTooltip(misys.getLocalization('mandatoryFieldsError'), field.domNode, ['above','before']);
					field.state = 'Error';
					field._setStateClass();
					dijit.setWaiState(field.focusNode, "invalid", "true");
					return;
				}
			}
			dj.byId('edit-account-dialog-template').gridMultipleItemsWidget.updateAccountNickName();
			dj.byId('accounts').dialog.hide();
	 }
	});
	d.ready(function(){
		// TODO There is, for the moment, a dependency between these files
		// and the functions in misys.form.file
		d.require("misys.system.widget.MultipleAccountGrid");
		d.require("misys.system.widget.Account");
	});
	
})(dojo, dijit, misys);
//Including the client specific implementation
       dojo.require('misys.client.binding.system.entity_mc_interface_client');