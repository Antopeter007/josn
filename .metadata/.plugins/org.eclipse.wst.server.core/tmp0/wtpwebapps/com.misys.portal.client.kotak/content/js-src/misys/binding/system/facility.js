dojo.provide("misys.binding.system.facility");

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
dojo.require("misys.form.CurrencyTextBox");
dojo.require("dijit.form.RadioButton");
dojo.require("misys.system.widget.LimitDetails");
dojo.require("misys.system.widget.LimitDetail");
//Try
dojo.require("dojo.data.ItemFileWriteStore");
dojo.require("dijit.Editor");
dojo.require("misys.grid.DataGrid");
dojo.require("misys.form.static_document");
dojo.require("dojox.lang.aspect");

/*
 ----------------------------------------------------------
 Event Binding for

 Subscription Package Form, Customer Side.

 Copyright (c) 2000-2011 Misys (http://www.misys.com),
 All Rights Reserved. 

 version:   1.0
 date:      12/09/08
 ----------------------------------------------------------
 */
/**
 * @class facility
 */
(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {
	
	
	
	/**
	 * Validates Limit Review date to be greater or equal to Current date and less or equal to Facility Review date
	 * @method _validateLimitReviewDate
	 */
	function _validateLimitReviewDate()
	{
		var limit_review_date = dj.byId("limit_review_date");

		//limit date should not be less than current date
		var currentDate = new Date();
		var currentDateConvertedObject =  dj.form.DateTextBox("");
		currentDate.setHours(0, 0, 0, 0);
		currentDateConvertedObject.setValue(currentDate);
		
		var facility_review_date = dj.byId("review_date");
		if(!(m.compareDateFields(currentDateConvertedObject,facility_review_date)))
		{
			dj.byId("limit_review_date").set("disabled",true);
		}
		
		if(!(m.compareDateFields(currentDateConvertedObject,limit_review_date)))
		{
			limit_review_date.invalidMessage = misys.getLocalization("limitDateSmallerThanCurrentDate");
			return false;
		}
		
		//limit date should be less than or equal to review date
		// var facility_review_date = dj.byId("review_date");
		if(facility_review_date)
		{
			if(!(m.compareDateFields(limit_review_date,facility_review_date)))
			{
				limit_review_date.invalidMessage = misys.getLocalization("limitDateError");
				return false;
			}
		}
		return true;
	}
	
	
	/**
	* Validated whether LimitReference already exists for the current facility
	*  Note that Limit reference to be unique for a given facility
	*@method _limitRefValidation
	*/
	function _limitRefValidation()
	{

		var grid = dj.byId("limit_defn_grid");
		var limitRef = dj.byId("limit_ref");
		var isRefvalid = true;
		
		//verify whther any limits have review date greater than current facility review date
		if(grid != null && grid.store !=null && grid.store._arrayOfTopLevelItems.length > 0)
		{
			if(limitRef)
			{
					grid.store.fetch({query: {store_id: "*"}, onComplete: function(items, request){
						dojo.forEach(items, function(item){
							
							//Below condition doesnt compare it with itself.
							if(misys._config.storeId !== item.store_id[0])
							{
								var existingLimRef = item.limit_ref[0];
								if(existingLimRef === limitRef.getValue())
								{
									limitRef.invalidMessage = misys.getLocalization("LimitRefExists");
									isRefvalid = false;
								}
							}
						});
					}});
					
			}
			if(!isRefvalid)
			{
				return isRefvalid;
			}
			
			return isRefvalid;
		}
		
		return true;
		
	}
	
	
	/**
	 * Validates if Change in facility review date is allowed or not with limits existing.
	*  It is expected that, when a review date is changed, it is always greater than or equal to Existing limit's review date
	*  @method _validateReviewDateAgainstLimits
	*/
	function _validateReviewDateAgainstLimits()
	{

		var grid = dj.byId("limit_defn_grid");
		var facility_review_date = dj.byId("review_date");
		var isDateValid = true;
		
		//verify whether facility review date is gretaer or equal to current date
		var currentDate = new Date();
		var currentDateConvertedObject =  dj.form.DateTextBox("");
		
		currentDate.setHours(0, 0, 0, 0);
		currentDateConvertedObject.setValue(currentDate);
		
		if(!(m.compareDateFields(currentDateConvertedObject,facility_review_date)))
		{
			facility_review_date.invalidMessage = misys.getLocalization("reviewDateSmallerThanCurrentDate");
			return false;
		}
			
		
		/*verify whether any limits have review date greater than current facility review date*/
		if(grid != null && grid.store !=null && grid.store._arrayOfTopLevelItems.length > 0)
		{
			if(facility_review_date)
			{
					grid.store.fetch({query: {store_id: "*"}, onComplete: function(items, request){
						dojo.forEach(items, function(item){
							var limitReviewDate = d.date.locale.parse(item.limit_review_date[0], {datePattern: "dd/MM/yyyy", selector: "date"});
							var limitDateConverted =  dj.form.DateTextBox("");
								limitDateConverted.setValue(limitReviewDate);
							
							if(!(m.compareDateFields(limitDateConverted,facility_review_date)))
							{
								facility_review_date.invalidMessage = misys.getLocalization("reviewDateError");
								isDateValid = false;
							}
						});
					}});
					
			}
			if(!isDateValid)
			{
				return isDateValid;
			}
			return isDateValid;
		}
		return true;
	}
	
	
	/**
	 * This method does the following operations:
	*	<ol>1) If no limits are added to facility, Reloads the customer reference list, </ol>
	*	<ol>2) If limits exists, user is prompted with message to Clear all limits on Change of Bank, Continue - Clears all Limit.</ol>
	*@method _bankAbbvNameValidation
	*/
	function _bankAbbvNameValidation()
	{
		var grid = dj.byId("limit_defn_grid");
		
		var clearEntityList = function()
		{
			if(dj.byId("entity_avail_list_facility") )
			{	
				entityAvailWidget = dj.byId("entity_avail_list_facility");
				entitySelectWidget = dj.byId("entity_select_list_facility");
				if(entityAvailWidget && entitySelectWidget)
				{
					// clearing entity selections
					entityAvailWidget.domNode.innerHTML = "";
					entitySelectWidget.domNode.innerHTML = "";
				}
			}
		};
		
		var onLimitDeletion = function _boRefChange()
		{
			var gridMultiple = dj.byId("limit_defn_grid");
			
			if(gridMultiple)
			{
				// deleting limit definitions
				gridMultiple.gridMultipleItemsWidget.clear();
			}
			
			var bo_ref = dj.byId("bo_reference");
			
			clearEntityList();
			if(dj.byId("bo_reference") )
			{	
				dj.byId("bo_reference").attr("displayedValue", "", false);
				dj.byId("bo_reference").attr("value", "", false);
				
				
				_changeCustRef();
			}

		};
		
		if(grid != null && grid.store !=null && grid.store._arrayOfTopLevelItems.length > 0)
		{
			m.dialog.show("CONFIRMATION",m.getLocalization("deleteLimitsOnAbbvNameChange"),'',null,null,'',onLimitDeletion, function (){
				
					dj.byId("bank_abbv_name").attr("value", dj.byId("bank_abbv_name").oldValue, false);
					dj.byId("bank_abbv_name").attr("displayedValue", dj.byId("bank_abbv_name").oldValue, false);
			});
		
		}
		else
		{
			clearEntityList();
			if(dj.byId("bo_reference") )
			{	
				dj.byId("bo_reference").attr("displayedValue", "", false);
				dj.byId("bo_reference").attr("value", "", false);
				_changeCustRef();
			}
		}
		
	}
	
	/**
	 * This method does the following operations:
	*	<ol>1) Reloads the facility entity list directly, if no limits existing.</ol>
	*	<ol>2) If limits already exists, then user is prompted to continue or cancel the action.</ol>
	*	If choosen to continue, it would delete all limits and reloads facility entity list
	*@method _backOfficeRefValidation
	**/
	function _backOfficeRefValidation()
	{
		var grid = dj.byId("limit_defn_grid");
		
		var clearEntityList = function()
		{
			if(dj.byId("entity_avail_list_facility") )
			{	
				entityAvailWidget = dj.byId("entity_avail_list_facility");
				entitySelectWidget = dj.byId("entity_select_list_facility");
				if(entityAvailWidget && entitySelectWidget)
				{
					
					entityAvailWidget.domNode.innerHTML = "";
					entitySelectWidget.domNode.innerHTML = "";
				}
			}
		};
		
		var onLimitDeletion = function _boRefChange()
		{
			var gridMultiple = dj.byId("limit_defn_grid");
			
			if(gridMultiple)
			{
				gridMultiple.gridMultipleItemsWidget.clear();
			}
			
			//
			var bo_ref = dj.byId("bo_reference");
			
			clearEntityList();
			_changeEntity();

		};
		
		if(grid != null && grid.store !=null && grid.store._arrayOfTopLevelItems.length > 0)
		{
			m.dialog.show("CONFIRMATION",m.getLocalization("deleteLimitsOnRefChange"),'',null,null,'',onLimitDeletion, function (){
				
					dj.byId("bo_reference").attr('value', dj.byId("bo_reference").oldValue, false);
			});
		
		}
		else
		{
			clearEntityList();
			_changeEntity();
		}
		
	}
	
	
	/**
	* This method validates if an entity can be removed from facility entity selected list.
	* It is not allowed to remove, if at least one entity is making use of that entity
	*@method _performEntityCheck
	*/
	function _performEntityCheck()
	{

		var grid = dj.byId("limit_defn_grid");
		var facility_select_list = dj.byId("entity_select_list_facility");
		
		var isRemovalPossible = true;
		
		if(grid != null && grid.store !=null && grid.store._arrayOfTopLevelItems.length > 0)
		{
			
			if(facility_select_list)
			{
				var facility_selected_items = facility_select_list.getSelected();
				
				for(var i=0; i<facility_selected_items.length; i++)
				{
					var value = facility_selected_items[i].value;
					
					grid.store.fetch({query: {store_id: '*'}, onComplete: function(items, request){
						dojo.forEach(items, function(item){
							var entity_select_string = item.entity_select_list_limit[0],
								entity_select_list = entity_select_string.split(",");
							
							if(entity_select_list.indexOf(value) >= 0)
							{
								// one of the limit making use of the entity, which is being tried to remove. hence not allowed
								isRemovalPossible = false;
							}
						});
					}});
					
					if(!isRemovalPossible)
					{
						break;
					}
					
				}
				
				if(!isRemovalPossible)
				{
				  	var displayMessage = misys.getLocalization('entityValidationError');
				  	//dj.hideTooltip(dj.byId("removeFacilityEntityButton").domNode);
				  	
				  	var hideTT = function() {
						dj.hideTooltip(dj.byId("removeFacilityEntityButton").domNode);
					};
					
			 		dj.showTooltip(displayMessage, dj.byId("removeFacilityEntityButton").domNode, 0);
			 		setTimeout(hideTT, 2000);
			 		
					return;
				}
			}
			
		}
		
		m.addMultiSelectItems(dijit.byId('entity_avail_list_facility'), dijit.byId('entity_select_list_facility'));
	}
	
	/**
	 * This method Change customer reference  based on bank.
	 * @method _changeCustRef
	 */
	function _changeCustRef()
	{
		var bankAbbvName = dj.byId("bank_abbv_name").get("value"),
		
		custRefWidget = dj.byId("bo_reference"),
		
		custRefStore= m._config.custRefCollection[bankAbbvName];
	
		if (custRefStore)
		{
			// Load sub product items based on the newly selected Area (sorted by
			// name)
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
	/**
	 * This function Changes the Entity
	 * @method _changeEntity
	 * 
	 */
	function _changeEntity()
	{
		var custRef = dj.byId("bo_reference"),
		
		entityAvailWidget = dj.byId("entity_avail_list_facility");
		
		if(custRef && custRef.get("value") != "")
			{
				var entityList = m._config.entityCollection[custRef];
				if (entityList)
				{
					for(var i=0; i<entityList.length; i++)
				    {
				     var op = dojo.create("option");
				     	op.innerHTML = entityList[i].name;
				    	op.value = entityList[i].value;
				     entityAvailWidget.domNode.appendChild(op);
				    }
				}
			}
	}
	
/**
 * This method toggles the account field based on product and sub-product code
 * @method _toggleAccType
 */
	function _toggleAccType()
	{
		var accDiv = dojo.byId("accDiv"), isVisible = m.isVisible(accDiv);
		var productCode = dj.byId("product_code") ? dj.byId("product_code").get("value") : "";
		var subProductCode = dj.byId("sub_product_code") ? dj.byId("sub_product_code").get("value") : "";

		if (productCode === "SE" || (productCode === "FT" && !(subProductCode === "TINT" || subProductCode === "TTPT")) || productCode === "BK" || productCode === "TD")
		{
			m.animate("wipeIn", accDiv);
			if (m._config.company_type === "03")
			{
				m.toggleRequired("account_no", true);
			}
		} else
		{
			if (isVisible)
			{
				m.animate("wipeOut", accDiv);
				if (m._config.company_type === "03")
				{
					m.toggleRequired("account_no", false);
				}
			}
		}
	}
	
	/**
	 *  Product type code is changed based on Product code
	 * @method _changeProductTypeCode
	  */
	function _changeProductTypeCode()
	{
		var productCode 				= dj.byId("product_code").get("value"), 
			existingProductTypetWidget 	= dj.byId("product_type_code"), 
			productCodeKey 				= (productCode === "*") ? "ALL" : productCode,
			productTypeCodeStore		= m._config.productTypeCodeList[productCodeKey],
			productTypeCodeHidden 		= dj.byId("product_type_code_hidden").get("value");
			
			if (productTypeCodeStore)
			{
				existingProductTypetWidget.store = new dojo.data.ItemFileReadStore(
				{
					data :
					{
						identifier : "value",
						label : "name",
						items : productTypeCodeStore
					}
				});
				existingProductTypetWidget.fetchProperties =
				{
					sort : [
					{
						attribute : "value"
					} ]
				};
				m.animate("wipeIn", d.byId("productTypeDiv"));
				//When Existing limit is opened value is set from Grid
				if(!misys.dialog.isActive)
				{
					var grid = dj.byId("limit_defn_grid");
					if(grid != null && grid.store !=null && grid.store._arrayOfTopLevelItems.length > 0)
					{
								grid.store.fetch({query: {store_id: misys._config.storeId}, onComplete: function(items, request){
									dojo.forEach(items, function(item){
										
											existingProductTypetWidget.set("value",item.product_type_code[0]);
									});
								}});
					}
				}
				else
				{
					existingProductTypetWidget.attr("value","");
				}
			}
			else
			{
				m.animate("wipeOut", d.byId("productTypeDiv"));
				existingProductTypetWidget.set("value","");
			}
	}
	
	/**
	 * Guarantee Template Dropdown options are loaded based on Selected Product type code
	 * @method _changeGuaranteeTemplate()
	  */
	
	function _changeGuaranteeTemplate()
	{
		var product_type_code 			= dj.byId("product_type_code").get("value"),
			sub_product_code			= dj.byId("sub_product_code").get("value"),
			product_code				= dj.byId("product_code").get("value"),
			existingTemplateWidget 		= dj.byId("product_template"),
			bankName 					= dj.byId("bank_abbv_name").get("value"),
			templateHidden 				= dj.byId("product_template_hidden").get("value"),
			entityField 				= dj.byId("entity_select_list_limit"),
			templateValidAllStore 		= m._config.guaranteeTemplateList[bankName],
			templateValidStore 			= "",
			templateStore = templateValidAllStore[product_type_code];
			if (dj.byId("isSwift2019Enabled") && product_code.toUpperCase() === 'BG') {
				templateValidStore = m._config.guaranteeFacilityTemplateList[bankName];
				var tempValidStore=templateValidStore[product_type_code];
				if (sub_product_code !== '*') {
					templateStore= tempValidStore[sub_product_code];
				}
			}
		
		if(templateStore)
		{
			existingTemplateWidget.store = new dojo.data.ItemFileReadStore(
			{
				data :
				{
					identifier : "value",
					label : "name",
					items : templateStore
				}
			});
			//When Existing limit is opened value is set from Grid
			if(!misys.dialog.isActive)
			{
				var grid = dj.byId("limit_defn_grid");
	
				if(grid != null && grid.store !=null && grid.store._arrayOfTopLevelItems.length > 0)
				{
							grid.store.fetch({query: {store_id: misys._config.storeId}, onComplete: function(items, request){
								dojo.forEach(items, function(item){
										existingTemplateWidget.set("value",item.product_template[0]);
								});
							}});
				}
			}
			else
			{
				existingTemplateWidget.set("value","");
			}
		}
	}
	
	function _changeSubProductCode()
	{
		var product_type_code			= dj.byId("product_type_code"),
		existingTemplateWidget 			= dj.byId("product_template");
		product_type_code.set("value","");
		existingTemplateWidget.set("value","");
	}
	
	function _onChangeLimitAmount()
	{
		var previousLimitAmtWidget = dj.byId("previous_limit_amt");
		
		if(previousLimitAmtWidget && !isNaN(previousLimitAmtWidget.get("value")) && previousLimitAmtWidget.get("value") + "S" !== "S")
		{
				_validateLimitAmount(this, previousLimitAmtWidget, dj.byId("limit_outstanding_amt"));
		}
		else if(dj.byId("limit_outstanding_amt"))
		{
			dj.byId("limit_outstanding_amt").set("value",dj.byId("limit_amt").get("value"));
		}
	}
	
	function _onChangeProductTypeCode()
	{
		_changeProductTypeCode();
		if(dj.byId("product_template") )
		{
			_changeGuaranteeTemplate();
		}
	}

	/*  Client needs a custom version of this method.
	* We keep separate lists of product codes and sub product
	 *but don't show them to the user, who has the impression
	 *that sub products and products are the same thing.
	 *on the storage and in the validation though the difference
	 *still apply.
	 */
	/**
	 * Sub-product items are loaded based on product types
	 * @method _changeSubProductList
	 */
	function _changeSubProductList()
	{
		var productCode = dj.byId("product_code").get("value"), 
			existingSubProductSelectWidget = dj.byId("sub_product_code"), 
			productCodeKey = (productCode === "*") ? "ALL" : productCode,
			subProductDataStore = m._config.SubProductsCollection[productCodeKey],
			subProductHidden = dj.byId("sub_product_code_hidden"),
			accountField = dj.byId("account_no");

		if (subProductDataStore && subProductHidden)
		{
			/*Load sub product items based on the newly selected Area (sorted by
			name)*/
			existingSubProductSelectWidget.store = new dojo.data.ItemFileReadStore(
			{
				data :
				{
					identifier : "value",
					label : "name",
					items : subProductDataStore
				}
			});
			existingSubProductSelectWidget.fetchProperties =
			{
				sort : [
				{
					attribute : "name"
				} ]
			};
			
			existingSubProductSelectWidget.set("value", subProductHidden.get("value"));
		}
	}
	
	//Private functions and variables comes here
	/**
	 * This method add group record to XML
	 *  @method _addGroupRecord 
	   */
	
	function _addGroupRecord(/*String*/ dom, /*String*/ abbvNodeName, /*String*/ nodeName)
	{
		//  summary:
		//          Adds a group record to the XML
	    //  tags:
	    //         privateR
		var abbvNode = dom.getElementsByTagName(abbvNodeName)[0],
			node = dom.getElementsByTagName(nodeName)[0],
			abbvName = '',
			entityXml = [],
			entityArray = new Array();
		
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
				entityArray = childNode.nodeValue.split(',');
			}
	    }
		if(entityArray.length > 0)
		{
			entityXml.push("<attached_entities>");
			dojo.forEach(entityArray, function(entity){
				   if(entity !== null && entity !== '')
				   {
					   entityXml.push("<entity><entity_abbv_name>",entity,"</entity_abbv_name></entity>");
				   }
			});
			entityXml.push("</attached_entities>");
		}
		return entityXml.join("");
	}
	/**
	 * Validates Facility amount is Increased/Decreased.
	 * * @method _validateFacilityAmount
	 */
	function _validateFacilityAmount(amountWidget , previousAmtWidget, outstandingAmtWidget)
	{
		
		var orgoutstandingAmt = parseFloat((dj.byId("temp_outstanding_facility_amt").get("value").split(',').join('')));
		var finalOutstandingAmt;
		if(amountWidget.get("value") < previousAmtWidget.get("value"))
		{
			if(orgoutstandingAmt < previousAmtWidget.get("value"))
			{
				misys.dialog.show("ERROR", misys.getLocalization("facilityAmountDecreaseError"));
				amountWidget.set("value",previousAmtWidget.get("value"));
			}
			else
			{
				if(outstandingAmtWidget)
				{
					var okCallback = function() {
					grid.store.fetch({query: {store_id: "*"}, onComplete: function(items, request){
							dojo.forEach(items, function(item){
								
								item.limit_amt='';
								item.limit_outstanding_amt='';
								
							});
						}});
					outstandingAmtWidget.set("value",amountWidget.get("value"));
					grid.render();
					};
					var onCancelCallback = function() {
						
						amountWidget.set("value",previousAmtWidget.get("value"));
					};
				
					var grid = dj.byId("limit_defn_grid");
					var limitRef = dj.byId("limit_ref");
					var isRefvalid = true;
					
					if(grid != null && grid.store !=null && grid.store._arrayOfTopLevelItems.length > 0)
					{
						var facilityReferenceWidget = dj.byId("facility_reference");
						facilityReference 	= facilityReferenceWidget ? facilityReferenceWidget.get("displayedValue") : "";
						m.xhrPost( {
							url : m.getServletURL("/screen/AjaxScreen/action/GetPendingLimitAmt"),
							handleAs 	: "text",
							sync 		: true,
							content : {
								facility : facilityReference ,
								option : "FACILITY"
							},
							load : function(response, ioArgs) {
								
								if(parseFloat((response.split(',').join(''))) > 0)
									{
									isRefvalid = false;
									
									}
							}
						});
						if(!isRefvalid)
							{
							misys.dialog.show("ERROR", misys.getLocalization("facilityAmountDecreaseError"));
							amountWidget.set("value",previousAmtWidget.get("value"));
							}
						else 
						{
							m.dialog.show("CONFIRMATION", misys.getLocalization("limitAmountWillBeCleared"), '', '', '', '', okCallback, onCancelCallback);
							
						}
					}
					else
						{
						var decreaseAmt			=previousAmtWidget.get("value")- amountWidget.get("value");
						finalOutstandingAmt = orgoutstandingAmt - decreaseAmt;
						outstandingAmtWidget.set("value",finalOutstandingAmt);
						}
				}
			}
		}
		else if(amountWidget.get("value") > previousAmtWidget.get("value"))
			{
				if(outstandingAmtWidget)
				{
					var increaseAmt			= amountWidget.get("value") - previousAmtWidget.get("value");
						finalOutstandingAmt = orgoutstandingAmt + increaseAmt;
					outstandingAmtWidget.set("value",finalOutstandingAmt);
				}
			}
	}
	
	function _validateLimitAmount(amountWidget , previousAmtWidget, outstandingAmtWidget)
	{
		var orgOutstandingLimitAmt = parseFloat((dj.byId("temp_limit_outstanding_amt").get("value").split(',').join('')));
		var limitPendingAmt = dj.byId("limit_pending_bank_amt");
		var limitUtilisedAmt = dj.byId("limit_utilised_amt");
		
		var finalOutstandingAmt;
		if(amountWidget.get("value") < previousAmtWidget.get("value"))
			{
			if(dj.byId("facilityAmtValidation") && dj.byId("facilityAmtValidation").get("value") == "false")
				{
				misys.dialog.show("ERROR", misys.getLocalization("facilityAmountDecreaseError"));
				amountWidget.set("value",previousAmtWidget.get("value"));
				
				}
			else
				{
				if(parseFloat((limitUtilisedAmt.get("value").split(',').join(''))) > amountWidget.get("value"))
				{
					misys.dialog.show("ERROR", misys.getLocalization("facilityAmountDecreaseError"));
					amountWidget.set("value",previousAmtWidget.get("value"));
				}
				var limitReferenceWidget = dj.byId("limit_ref");
				var isRefvalid =true;
				limitReference 	= limitReferenceWidget ? limitReferenceWidget.get("displayedValue") : "";
				m.xhrPost( {
					url : m.getServletURL("/screen/AjaxScreen/action/GetPendingLimitAmt"),
					handleAs 	: "text",
					sync 		: true,
					content : {
						limit : limitReference ,
						option : "LIMIT"
					},
					load : function(response, ioArgs) {
						var totalAmt = parseFloat((response.split(',').join(''))) + parseFloat((limitUtilisedAmt.get("value").split(',').join('')));
						if(totalAmt > amountWidget.get("value"))
							{
							isRefvalid = false;
							
							}
					}
				});
				if(!isRefvalid)
				{
					misys.dialog.show("ERROR", misys.getLocalization("facilityAmountDecreaseError"));
					amountWidget.set("value",previousAmtWidget.get("value"));
				}
				else
					{
						var decreaseAmt			= previousAmtWidget.get("value") - amountWidget.get("value") ;
						finalOutstandingAmt = orgOutstandingLimitAmt - decreaseAmt;
						outstandingAmtWidget.set("value",finalOutstandingAmt);
					}
						
			}
			}
		else
			{
				if(outstandingAmtWidget)
				{
					var increaseAmt			= amountWidget.get("value") - previousAmtWidget.get("value");
						finalOutstandingAmt = orgOutstandingLimitAmt + increaseAmt;
						outstandingAmtWidget.set("value",finalOutstandingAmt);
				}
			}
	}
	
	
	// Setup the XML transform function
	m._config = m._config || {};
	d.mixin(m._config, {
		
		xmlTransform : function(/*String*/ xml) {
			
			//When counterparty is created from pop up it should not be appended with facility tags
			if(xml.indexOf(m._config.xmlTagName) === -1)
			{
				return xml;
			}
			var multiSelects = new Array('entity_select_list_facility'),
			
			// Setup the root of the XML string
			xmlRoot = m._config.xmlTagName,
			
			transformedXml = xmlRoot ? ["<", xmlRoot, ">"] : [],
					
			// Representation of existing XML
			dom = dojox.xml.DomParser.parse(xml);
			
			// Normalize multiselects
			dojo.forEach(multiSelects, function(id){
				if(dj.byId(id))
				{
					var multi = dj.byId(id);
					if(multi && multi.declaredClass.indexOf('MultiSelect') != -1)
					{
						multi.reset();
						multi.invertSelection();
					}
				}
			});
			// Push the entire XML into the new one
			var subXML = xml.substring(xmlRoot.length+2,(xml.length-xmlRoot.length-3));
			transformedXml.push(subXML);
			
			//Generate the Entity xml
		    dojo.forEach(multiSelects, function(id)
		    {
			   if(dom.getElementsByTagName(id).length > 0)
			   {
				   transformedXml.push(_addGroupRecord(dom, 'attached_entities', id));
			   }
		    });
		    
		    if(xmlRoot) {
				transformedXml.push("</", xmlRoot, ">");
			}
			return transformedXml.join("");
		}
	});
	
	// Public functions & variables follow
	d.mixin(m, {

		bind : function() {
		
			m.connect("bank_abbv_name",  "onChange", function()
			{
				_bankAbbvNameValidation();
			});
			
			m.connect("bank_abbv_name",  "onFocus", function()
			{
				this.oldValue = this.get("value");
			});
			
			m.connect("bo_reference",  "onChange",function()
			{
					_backOfficeRefValidation();
			});
			
			m.connect("bo_reference",  "onFocus", function()
			{
				this.oldValue = this.get("value");
				
			});
			
			m.connect("base_cur_code", "onChange", function(){
				m.setCurrency(this, ["facility_amt"]);
			});
			
			m.connect("base_cur_code", "onChange", function(){
				m.setCurrency(this, ["facility_outstanding_amt"]);
			});
			
			m.connect("limit_cur_code", "onChange", function(){
				m.setCurrency(this, ["limit_amt"]);
			});
			
			m.connect("limit_cur_code", "onChange", function(){
				m.setCurrency(this, ["limit_outstanding_amt"]);
			});
			
			m.setValidation("review_date", _validateReviewDateAgainstLimits);
			
			m.setValidation("base_cur_code", m.validateCurrency);
			
			
			m.setValidation("limit_ref",_limitRefValidation);
			
			m.connect("product_code",  "onChange", function()
			{
						_changeSubProductList();
						_toggleAccType();
			});
			m.connect("sub_product_code",  "onChange", _toggleAccType);
			
			m.connect("removeFacilityEntityButton", "onClick", _performEntityCheck);
			
			m.connect('facility_reference', 'onChange', function()
			{
				m.checkFacilityReferenceExists();
			});
			
			m.setValidation("limit_cur_code", m.validateCurrency);
			
			m.setValidation("beneficiary_country", m.validateCountry);
			
			m.setValidation("limit_review_date", _validateLimitReviewDate);
			
			// These fields will exists only if P750 param data is set
			m.connect("product_code",  "onChange", function()
			{
				if(dj.byId("product_type_code"))
				{
					_onChangeProductTypeCode();					
				}
			});
			
			m.connect("product_type_code",  "onChange", function()
			{
					if(dj.byId("product_template") )
					{
						_changeGuaranteeTemplate();
					}
			});
			
			m.connect("sub_product_code",  "onChange", function()
			{
					if(dj.byId("product_type_code") && dj.byId("product_template"))
					{
							 	_changeSubProductCode();
					}
			});
			//Set Outstanding limit amount
			m.connect("limit_amt" , "onChange", function()
			{
				if(misys.dialog.isActive)
				{
					_onChangeLimitAmount();
				}
			});
			
			
			if(dj.byId("isModified") && dj.byId("previous_facility_amt"))
			{
				m.connect("facility_amt" , "onChange" , function()
				{
					_validateFacilityAmount(this,dj.byId("previous_facility_amt") ,dj.byId("facility_outstanding_amt"));
				});
				
			}
			else
			{
				m.connect("facility_amt" , "onChange" , function()
				{
					if(dj.byId("facility_outstanding_amt"))
					{
						dj.byId("facility_outstanding_amt").set("value",this.get("value"));
					}
				});
			}
		},

		onFormLoad : function() {
			
			if(dj.byId("facility_amt"))
			{
				dj.byId("facility_amt").attr("constraints",{min:0.01});
				if(dj.byId("isModified"))
				{
					dj.byId("base_cur_code").set("disabled",true);
				}
			}
			m.setCurrency("base_cur_code", ["facility_amt", "facility_outstanding_amt"]);
			
			if(dj.byId("limit_amt"))
			{
				dj.byId("limit_amt").attr("constraints",{min:0.01});
				dj.byId("limit_amt").attr("trim",false);
			
			}
			
			
			if(dj.byId("bank_abbv_name") && dj.byId("bo_reference") )
				{
					_changeCustRef();

				}
			_changeEntity();
			
			m._config.storeId = "";
		},
		
		//This function is called when Counterparty select icon is clicked. Set the selected bank id from collection and call default function
		showDialogByCompany : function(title)
		{
			var bankId = "";
			if(m._config.bankNameIdCollection && dj.byId("bank_abbv_name"))
			{
				bankId = m._config.bankNameIdCollection[dj.byId("bank_abbv_name").get("value")];
			}
			m.showSearchDialog('beneficiary', "['beneficiary_name','','','','beneficiary_country']", '', '', '', 'width:710px;height:350px;', title,bankId);
		},
		
		beforeSubmitValidations: function() {
			var grid = dj.byId("limit_defn_grid");
			var limitRef = dj.byId("limit_ref");
			var isValid = true;
			//verify whther any limits have review date greater than current facility review date
			if(grid != null && grid.store !=null && grid.store._arrayOfTopLevelItems.length > 0)
			{
				if(limitRef)
				{
						grid.store.fetch({query: {store_id: "*"}, onComplete: function(items, request){
							dojo.forEach(items, function(item){
								
								//Below condition doesnt compare it with itself.
								if(item.limit_amt == "")
								{
									m._config.onSubmitErrorMsg =  m.getLocalization("limitAmountCannotBeZero");
									isValid = false;
									
								}
							});
							
						}});
						
				}
				if(!isValid)
				{
					return isValid;
				}
				
				return isValid;
				
			}
			return true;
		}
		
		
	});

	
	})(dojo, dijit, misys);


//Including the client specific implementation
       dojo.require('misys.client.binding.system.facility_client');