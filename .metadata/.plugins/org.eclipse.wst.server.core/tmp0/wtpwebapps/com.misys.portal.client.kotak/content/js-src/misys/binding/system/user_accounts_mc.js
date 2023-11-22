dojo.provide("misys.binding.system.user_accounts_mc");

dojo.require("dijit.form.FilteringSelect");
dojo.require("misys.form.MultiSelect");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("misys.form.common");
dojo.require("misys.validation.common");
dojo.require("dojox.xml.DomParser");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode
	
	d.mixin(m._config, {

		initReAuthParams : function() {
									
			var reAuthParams = {
				productCode : 'UAC',	
				subProductCode : '',
				transactionTypeCode : '01',	
				entity :'',
				currency : '',				
				amount : '',
								
				es_field1 : '',
				es_field2 : ''				
			};
			return reAuthParams;
		}
	});
	
	var _accountsSelectedOnce = []; 
	//Build user accounts records for toXML operation
	function _addUserAccountsRecords( /*Dom*/ dom) {
		//  summary:
		//          Create the user account records XML 
		var userId = m.getDomNode(dom, "user_id");
		var transformedXml = [];
		
		for(var i=0; i<m._config.userAccounts.user_entity_accounts_record_count; i++)
		{
			var entityId = m._config.userAccounts.entityIdArray[i];
			if(m._config.userAccounts.entityAccountArray[entityId])
			  {
			     for(var j=0;j<m._config.userAccounts.entityAccountArray[entityId].length;j++)
				{
					var accountId = m._config.userAccounts.entityAccountArray[entityId][j];
					
					var newId = entityId+"_"+accountId;
					var nodes = dom.getElementsByTagName("account_products_exist_nosend_"+newId);
					var selectedProducts = "";
					if(nodes.length > 0) {
						var node = nodes[0].childNodes[0];
						if(node && node.nodeValue) {
							selectedProducts = node.nodeValue;
						}
					}
					
					if(dijit.byId("account_enabled_"+newId) && dijit.byId("account_enabled_"+newId).get("checked"))
					{
						if(selectedProducts !== "")
						{
							var productsArray = selectedProducts.split(',');
							for(var k=0;k<productsArray.length;k++)
							{
								var product = productsArray[k];
								transformedXml.push(_formatUserAccountXML(userId, accountId, entityId, product));
							}
						}
						if(dj.byId("account_pab_enabled_"+newId) && dj.byId("account_pab_enabled_"+newId).get("checked"))
						{
							transformedXml.push(_formatUserAccountXML(userId, accountId, entityId, "PAB"));
						}
						if(dj.byId("account_view_stmt_enabled_"+newId) && dj.byId("account_view_stmt_enabled_"+newId).get("checked"))
						{
							transformedXml.push(_formatUserAccountXML(userId, accountId, entityId, "View STMT"));
						}
						//transformedXml.push("<user_account>",userId,"<account_id>",accountId,"</account_id><entity_id>",entityId,"</entity_id><context_key>enabled</context_key><context_value>Y</context_value></user_account>");
						transformedXml.push("<user_account>");
						transformedXml.push(userId);
						transformedXml.push("<account_id>",accountId,"</account_id>");
						transformedXml.push("<entity_id>",entityId,"</entity_id>");
						if(dj.byId("return_comments"))
						{
							transformedXml.push("<return_comments>",dj.byId("return_comments").get("value"),"</return_comments>");
						}
						transformedXml.push("<context_key>enabled</context_key><context_value>Y</context_value>");
						transformedXml.push("</user_account>");
					}
				}
			  }
		}
		
		return transformedXml.join("");
	}
	
	//function to format and get the xml for a column thats checked
	function _formatUserAccountXML(/*String*/userId,/*String*/accountId,/*String*/entityId,/*String*/product)
	{
		var userAccountRecord = ["<user_account>"];
		userAccountRecord.push(userId);
		userAccountRecord.push("<account_id>",accountId,"</account_id>");
		userAccountRecord.push("<entity_id>",entityId,"</entity_id>");
		if(dj.byId("return_comments"))
		{
			   userAccountRecord.push("<return_comments>",dj.byId("return_comments").get("value"),"</return_comments>");
		}
		
		if(product === "PAB" || product === "View STMT")
		{
			userAccountRecord.push("<context_key>",product,"</context_key>");
			userAccountRecord.push("<context_value>Y</context_value>");
		}
		else
		{
			userAccountRecord.push("<context_key>product</context_key>");
			userAccountRecord.push("<context_value>",product,"</context_value>");
		}
		userAccountRecord.push("</user_account>");
		return userAccountRecord.join("");
	}
	
	function _updateProductsCounter(/*String*/ id)
	{
		dojo.byId("account_products_indicator_"+id).innerHTML = dijit.byId("account_products_exist_nosend_"+id).get('value').length +" "+ "Product(s)";
	}
	
	function _toggleAllProductSelections(/*String*/ id, addFlag)
	{
		var targetWidget,sourceWidget; 
		if(addFlag)
		{
			targetWidget = dijit.byId("account_products_exist_nosend_"+id);
			sourceWidget = dijit.byId("account_products_avail_nosend_"+id);
		}
		else
		{
			targetWidget = dijit.byId("account_products_avail_nosend_"+id);
			sourceWidget = dijit.byId("account_products_exist_nosend_"+id);
		}
		
		console.debug("Array to move",dojo.query("option",sourceWidget.containerNode));
		
		dojo.query("option",sourceWidget.containerNode).forEach(function(n){
			targetWidget.containerNode.appendChild(n);
			targetWidget.domNode.scrollTop = targetWidget.domNode.offsetHeight; // overshoot will be ignored
			var oldscroll = sourceWidget.domNode.scrollTop;
			sourceWidget.domNode.scrollTop = 0;
			sourceWidget.domNode.scrollTop = oldscroll;
		});
		
		// Have to call focus, otherwise sizing issues in Internet Explorer
		sourceWidget.focus();
		targetWidget.focus();
		_updateProductsCounter(id);
	}
	
	// Public functions & variables follow
	d.mixin(m, {
		bind : function() {
			
			var i,j,entityId,accountId;
			for(i=0; i<m._config.userAccounts.user_entity_accounts_record_count; i++)
			{
				entityId = m._config.userAccounts.entityIdArray[i];				
				if(m._config.userAccounts.entityAccountArray[entityId])
				  {
					for(j=0;j<m._config.userAccounts.entityAccountArray[entityId].length;j++)
					{
						accountId = m._config.userAccounts.entityAccountArray[entityId][j];
						var accountIdTemp = entityId+"_"+accountId;
						var 	stringAccountIdTemp = accountIdTemp.toString(),
								stringEntityId 		= stringAccountIdTemp.split("_")[0],
								stringAccountId 	= stringAccountIdTemp.substr(stringEntityId.length + 1),
								account_owner_type 	= misys._config.userAccounts.accountOwnerType[stringAccountId][0],
								account_type        = misys._config.userAccounts.accountType[stringAccountId][0];	
						if (account_type === 12 && dj.byId("account_view_stmt_enabled_" + accountIdTemp))
						{
							dj.byId("account_view_stmt_enabled_"+accountIdTemp).set("disabled",true);
						}
						(function(){
							var accountIdTemp = entityId+"_"+accountId;
							misys.connect("account_enabled_"+accountIdTemp,"onChange",function(){
									if(dijit.byId("account_enabled_"+accountIdTemp).get("checked"))
									{
										var 	stringAccountIdTemp = accountIdTemp.toString(),
												stringEntityId 		= stringAccountIdTemp.split("_")[0],
											 	stringAccountId 	= stringAccountIdTemp.substr(stringEntityId.length + 1),
 												account_owner_type 	= misys._config.userAccounts.accountOwnerType[stringAccountId][0],
 												account_type        = misys._config.userAccounts.accountType[stringAccountId][0];										
										if(account_owner_type !== 10)
										{
											dj.byId("account_pab_enabled_"+accountIdTemp).set("checked",true);
											dj.byId("account_pab_enabled_"+accountIdTemp).set("disabled",false);		
										}
										if(account_type!==12){
										dj.byId("account_view_stmt_enabled_"+accountIdTemp).set("checked",true);
										dj.byId("account_view_stmt_enabled_"+accountIdTemp).set("disabled",false);
										}
										dijit.byId("account_products_avail_nosend_"+accountIdTemp).set("disabled",false);
										dijit.byId("account_products_exist_nosend_"+accountIdTemp).set("disabled",false);
										_toggleAllProductSelections(accountIdTemp,true);
										m.toggleDisplayProducts(accountIdTemp,'down');
									}
									else
									{
										dj.byId("account_pab_enabled_"+accountIdTemp).set("checked",false);
										dj.byId("account_view_stmt_enabled_"+accountIdTemp).set("checked",false);
										dj.byId("account_pab_enabled_"+accountIdTemp).set("disabled",true);
										dj.byId("account_view_stmt_enabled_"+accountIdTemp).set("disabled",true);
										_toggleAllProductSelections(accountIdTemp,false);
										dijit.byId("account_products_avail_nosend_"+accountIdTemp).set("disabled",true);
										dijit.byId("account_products_exist_nosend_"+accountIdTemp).set("disabled",true);
										m.toggleDisplayProducts(accountIdTemp,'up');
									}
								});
						})();
					}
				  }
			}
			for(i=0; i<m._config.userAccounts.user_entity_accounts_record_count; i++)
			{
				entityId = m._config.userAccounts.entityIdArray[i];
				(function(){
					var entityIdTemp = entityId;
				
					misys.connect("account_select_all_"+entityIdTemp,"onChange",function(){
						if(m._config.userAccounts.entityAccountArray[entityId])
						  {
							if(!_accountsSelectedOnce[entityIdTemp])
							{
								if(dijit.byId("account_select_all_"+entityIdTemp).get("checked"))
								{		

										for(j=0;j<m._config.userAccounts.entityAccountArray[entityIdTemp].length;j++)
										{
											accountId = m._config.userAccounts.entityAccountArray[entityIdTemp][j];
											var newId = entityIdTemp+"_"+accountId;
											if(dijit.byId("account_enabled_"+newId).get("checked"))
											{
												dijit.byId("account_enabled_"+newId).set("checked",false);
											}
											dijit.byId("account_enabled_"+newId).set("checked",true);
										}								  
								}
								else
								{

									for(j=0;j<m._config.userAccounts.entityAccountArray[entityIdTemp].length;j++)
									{
										newId = entityIdTemp+"_"+accountId;
										accountId = m._config.userAccounts.entityAccountArray[entityIdTemp][j];
										dijit.byId("account_enabled_"+newId).set("checked",false);
									}
								}
							}
							else
							{
								_accountsSelectedOnce[entityIdTemp] = false;
							}
						}
						
					});
				})();
			}
		},
		onFormLoad : function(){
			
			for(var i=0; i<m._config.userAccounts.user_entity_accounts_record_count; i++)
			{
				var entityId = m._config.userAccounts.entityIdArray[i];
				var accountSelectAll = true;
				if(m._config.userAccounts.entityAccountArray[entityId])
				  {
					for(var j=0;j<m._config.userAccounts.entityAccountArray[entityId].length;j++)
					{
						var accountId = m._config.userAccounts.entityAccountArray[entityId][j];	
						var newId = entityId+"_"+accountId;
						_updateProductsCounter(newId);
						var account_owner_type = misys._config.userAccounts.accountOwnerType[accountId][0];
						if(dj.byId("account_enabled_"+newId) && !dj.byId("account_enabled_"+newId).get("checked"))
						{
							
							dj.byId("account_view_stmt_enabled_"+newId).set("checked",false);
							dj.byId("account_pab_enabled_"+newId).set("disabled",true);
							dj.byId("account_view_stmt_enabled_"+newId).set("disabled",true);
							_toggleAllProductSelections(newId,false);
							dijit.byId("account_products_avail_nosend_"+newId).set("disabled",true);
							dijit.byId("account_products_exist_nosend_"+newId).set("disabled",true);
							accountSelectAll = false;
						}
						else if (dj.byId("account_enabled_"+newId) && dj.byId("account_enabled_"+newId).get("checked"))
						{
							if( account_owner_type === 10)
							{
								dj.byId("account_pab_enabled_"+newId).set("disabled",true);
							}
						}
						/*else
						{
							m.toggleDisplayProducts(accountId,'down');
						}*/
					}
				  }
				if(accountSelectAll)
				{
					_accountsSelectedOnce[entityId] = true;
					if(dj.byId("account_select_all_"+entityId))
						{
							dj.byId("account_select_all_"+entityId).set("checked",true);
						}
				}
				else
				{
					_accountsSelectedOnce[entityId] = false;
				}
			}
			
		},
		addProductMultiSelectItems : function(/*String*/id, addFlag) {
			//  summary:
			//        Move items from one multi-select to another
			
			var targetWidget,sourceWidget; 
			if(addFlag)
			{
				targetWidget = dijit.byId("account_products_exist_nosend_"+id);
				sourceWidget = dijit.byId("account_products_avail_nosend_"+id);
			}
			else
			{
				targetWidget = dijit.byId("account_products_avail_nosend_"+id);
				sourceWidget = dijit.byId("account_products_exist_nosend_"+id);
			}
			
			targetWidget.addSelected(sourceWidget);
			
			// Have to call focus, otherwise sizing issues in Internet Explorer
			sourceWidget.focus();
			targetWidget.focus();
			_updateProductsCounter(id);
		},
		toggleDisplayProducts : function(/*String*/id,/*String*/direction){
			
			var downArrow = d.byId("account_products_down_"+id);
			var upArrow = d.byId("account_products_up_"+id);
			if(direction === 'down')
			{
				if(d.style('account_products_div_'+id, "display") === "none" && dj.byId("account_enabled_"+id).get("checked"))
				{
					m.animate('wipeIn', 'account_products_div_'+id);
					d.style(downArrow, "display", "none");
					d.style(upArrow, "display", "inline");
				}
			}
			else
			{
				if(d.style('account_products_div_'+id, "display") !== "none")
				{
					m.animate('wipeOut', 'account_products_div_'+id);
					d.style(upArrow, "display", "none");
					d.style(downArrow, "display", "inline");
				}
			}
		}
	});
	
	// Add the XML transform function
	m._config = m._config || {};
	d.mixin(m._config, {
		
		initReAuthParams : function(){	
			
			var reAuthParams = { 	productCode : 'UAC',
			         				subProductCode : '',
			        				transactionTypeCode : '01',
			        				entity : '',			        			
			        				currency : '',
			        				amount : '',
			        				
			        				es_field1 : '',
			        				es_field2 : ''
								  };
			return reAuthParams;
		},
		
		xmlTransform : function(/*String*/ xml) {
			
			console.debug("Before Transforming XML", xml);
			// Setup the root of the XML string
			var	transformedXml = ["<user_accounts_record>"],
	
			// Representation of existing XML
			dom = dojox.xml.DomParser.parse(xml);
			
			//console.debug("[binding.user_accounts_mc] Transforming XML", xml);
			
			
			transformedXml.push(m.getDomNode(dom, "brch_code"));
			transformedXml.push(m.getDomNode(dom, "company_id"));
			transformedXml.push(m.getDomNode(dom, "company_abbv_name"));
			transformedXml.push(m.getDomNode(dom, "login_id"));
			transformedXml.push(m.getDomNode(dom, "user_id"));
			
			// Format the role list
		    transformedXml.push(_addUserAccountsRecords(dom));
			transformedXml.push("</user_accounts_record>");
			console.debug("[binding.user_accounts_mc] Transforming XML", transformedXml.join(""));
			return transformedXml.join("");
		}
	});
	
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.system.user_accounts_mc_client');