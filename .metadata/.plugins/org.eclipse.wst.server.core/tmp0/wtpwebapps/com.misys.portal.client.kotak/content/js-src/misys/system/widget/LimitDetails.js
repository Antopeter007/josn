dojo.provide("misys.system.widget.LimitDetails");
dojo.experimental("misys.system.widget.LimitDetails"); 

dojo.require("misys.grid.GridMultipleItems");
dojo.require("misys.system.widget.LimitDetail");

// our declared class
dojo.declare("misys.system.widget.LimitDetails",
		[ misys.grid.GridMultipleItems ],
		// class properties:
		{
		data: { identifier: "store_id", label: "store_id", items: [] },
		handle: null,
		templatePath: null,
		templateString: dojo.byId("limit-details-template").innerHTML,
		dialogId: "limit-details-dialog-template",
		gridId: 'limit_defn_grid',
		xmlTagName: "limits",
		xmlSubTagName: "limit",
		
		gridColumns: ["product_code","product_code_label","sub_product_code","sub_product_code_label","product_type_code","product_type_code_label",
		              "product_template","beneficiary_name","beneficiary_country",
		              "limit_ref","limit_amt","limit_cur_code","limit_review_date","limit_pricing",
		              "limit_outstanding_amt","limit_pending_bank_amt","limit_utilised_amt",
		              "limit_utilised_percent","entity_avail_list_limit","entity_select_list_limit","existing_limit","limit_status","limit_status_label","limit_id","linked_entities_number"],
        
		propertiesMap: {
			product_code: {_fieldName: "product_code"},
			product_code_label: {_fieldName: "product_code_label"},
			sub_product_code: {_fieldName: "sub_product_code"},
			sub_product_code_label: {_fieldName: "sub_product_code_label"},
			product_type_code: {_fieldName: "product_type_code"},
			product_type_code_label: {_fieldName: "product_type_code_label"},
			product_template: {_fieldName: "product_template"},

			beneficiary_name: {_fieldName: "beneficiary_name"},
			beneficiary_country: {_fieldName: "beneficiary_country"},
			limit_ref: {_fieldName: "limit_ref"},
			limit_amt: {_fieldName: "limit_amt"},
			limit_cur_code: {_fieldName: "limit_cur_code"},
			limit_review_date: {_fieldName: "limit_review_date"},
			limit_pricing: {_fieldName: "limit_pricing"},
			
			limit_outstanding_amt: {_fieldName: "limit_outstanding_amt"},
			limit_pending_bank_amt: {_fieldName: "limit_pending_bank_amt"},
			limit_utilised_amt: {_fieldName: "limit_utilised_amt"},
			limit_utilised_percent: {_fieldName: "limit_utilised_percent"},
			
			entity_avail_list_limit: {_fieldName: "entity_avail_list_limit"},
			entity_select_list_limit: {_fieldName: "entity_select_list_limit"},
			existing_limit : {_fieldName: "existing_limit"},
			limit_status : {_fieldName: "limit_status"},
			limit_status_label : {_fieldName: "limit_status_label"},
			linked_entities_number : {_fieldName:"linked_entities_number"}
			
			},
			
		/*below map is being used for generating outgoing xml for limits. 
		Any tag name change required, to be only done in the below map, by altering the LHS*/
		basicMap : {
			product_code: {_fieldName: "product_code"},
			sub_product_code: {_fieldName: "sub_product_code"},
			product_type_code: {_fieldName: "product_type_code"},
			product_template: {_fieldName: "product_template"},
			limit_counterparty: {_fieldName: "beneficiary_name"},
			beneficiary_country: {_fieldName: "beneficiary_country"},
			limit_ref: {_fieldName: "limit_ref"},
			limit_amt: {_fieldName: "limit_amt"},
			limit_cur_code: {_fieldName: "limit_cur_code"},
			limit_review_date: {_fieldName: "limit_review_date"},
			limit_pricing: {_fieldName: "limit_pricing"},
			
			outstanding_amt: {_fieldName: "limit_outstanding_amt"},
			pending_bank_amt: {_fieldName: "limit_pending_bank_amt"},
			utilised_amt: {_fieldName: "limit_utilised_amt"},
			limit_status : {_fieldName : "limit_status"},
			limit_id : {_fieldName: "limit_id"}
		},
		
		/*Below map is used for sending limit entity list in the required format*/
		entityMap : {
			attached_entities: {_fieldName: "entity_select_list_limit"}
		},
		

		layout: [
				{ name: "limit_ref", field: "limit_ref", width: "10%"},
				{ name: "limit_cur_code", field: "limit_cur_code", width: "3%" },
				{ name: "limit_amt", field: "limit_amt", width: "10%" },
				{ name: "limit_review_date", field: "limit_review_date", width: "7%" },
				{ name: "product_code_label", field: "product_code_label", width: "8%" },
				{ name: "sub_product_code_label", field: "sub_product_code_label", width: "8%" },
				
				{ name: "limit_outstanding_amt", field: "limit_outstanding_amt", width: "10%" },
				{ name: "limit_pending_bank_amt", field: "limit_pending_bank_amt", width: "10%" },
				{ name: "limit_utilised_amt", field: "limit_utilised_amt", width: "10%" },
				{ name: "limit_utilised_percent", field: "limit_utilised_percent", width: "4%" },
				{ name: "linked_entities_number", field: "linked_entities_number", width: "5%"},
				{ name: "limit_status_label", field: "limit_status_label", width: "5%"},
				
				{ name: " ", field: "actions", formatter: misys.grid.formatReportActions, width: "5%" },
				{ name: "Id", field: "store_id", headerStyles: "display:none", cellStyles: "display:none" }
				],
        
		/*Any new mandatory field added on the screen, should be entered here*/		
        mandatoryFields: ["product_code","sub_product_code","limit_ref","limit_review_date","limit_cur_code","limit_amt","limit_status"],
        
		startup: function(){
			console.debug("[Limit Definition] startup start");
			
			// Prepare data store
			this.dataList = [];
			if(this.hasChildren())
			{
				dojo.forEach(this.getChildren(), function(child){
					// Mark the child as started.
					// This will prevent Dojo from parsing the child
					// as we don't want to make it appear on the form now.
						if (child.createItem)
							{
								var item = child.createItem();
								this.dataList.push(item);
							}
					
				}, this);
			}
			
			this.inherited(arguments);
			console.debug("[Limit Definition] startup end");
		},
    	
		openDialogFromExistingItem: function(items, request)
		{
			
			console.debug("[Limit Definition] openDialogFromExistingItem start");
			
			var item = items[0];
			misys._config.storeId = item.store_id[0];
			
			if(dijit.byId("sub_product_code_hidden"))
			{
				dijit.byId("sub_product_code_hidden").set("value", item.sub_product_code[0]);
			}	
			
			this.inherited(arguments);


			if(this.overrideDisplaymode !== "view")
			{
				// below code would make the limits definition fields disabled when opening an already persisted limit
				if(item.existing_limit && item.existing_limit !== null && item.existing_limit[0] === "Y")
				{
					misys.toggleFields(false,["limit_ref","limit_cur_code", "product_code", "sub_product_code", "product_type_code","product_template", "beneficiary_name", "beneficiary_country"],null,true,false);
					if(dijit.byId("previous_limit_amt"))
					{
						dijit.byId("previous_limit_amt").set("value",item.limit_amt[0]);
					}
				}
				else
				{
					// below code would make the limits definition fields enabled when opening a newly created limit
					misys.toggleFields(true,["limit_ref", "limit_cur_code", "product_code", "sub_product_code", "product_type_code","product_template", "beneficiary_name", "beneficiary_country"],null,true,false);
					if(dijit.byId("previous_limit_amt"))
					{
						dijit.byId("previous_limit_amt").set("value","");
					}
				}
			}
			if(dijit.byId("beneficiary_name"))
			{
				dijit.byId("beneficiary_name").set("readOnly",true);
			}
			console.debug("[Limit Definition] openDialogFromExistingItem end");
			
			
			/*Loads the facility selected entity list into Limit entity available list*/
			var facility_select_list = dojo.byId("entity_select_list_facility");
			var limit_avail_list = dojo.byId("entity_avail_list_limit");
			var limit_select_list = dijit.byId("entity_select_list_limit")?dijit.byId("entity_select_list_limit").getValue():"";
			if(limit_avail_list && facility_select_list)
			{
				limit_avail_list.innerHTML=[];
				
				for(var i=0; i<facility_select_list.options.length; i++)
				{
					var value = facility_select_list.options[i].value;
					if(limit_select_list.indexOf(value) == -1)
					{
						var op = dojo.create("option");
						op.label = facility_select_list.options[i].label;
						op.value = facility_select_list.options[i].value;
						op.innerHTML = facility_select_list.options[i].value;
						
						limit_avail_list.appendChild(op);
					}
					
				}
			}
						
			//setting the label  to the actual field
			if(this.overrideDisplaymode == "view")
			{
				if(dijit.byId("product_code"))
				{
					dijit.byId("product_code").attr("value", item.product_code_label[0], false);
				}
				if(dijit.byId("sub_product_code"))
				{
					dijit.byId("sub_product_code").attr("value", item.sub_product_code_label[0], false);
				}
				if(dijit.byId("product_type_code"))
				{
					dijit.byId("product_type_code").attr("value", item.product_type_code_label[0], false);
				}
				if(dijit.byId("limit_status"))
				{
					dijit.byId("limit_status").attr("value", item.limit_status_label[0], false);
				}
				
			}
			
			
		},
		
		/*Opens the Limit dialog defn dialog, only if al facility defn mandatory fields are entered.
		When a new mandatory field is added in the facility defn, it is required add to the "facilityRequiredFields" variable below*/
		
		validatePreRequisite: function(){
			var facilityRequiredFields = ["review_date","facility_amt","base_cur_code","bank_abbv_name","facility_reference","bo_reference","entity_select_list_facility","facility_status"];
			var isStateValid = true;
			for(field in facilityRequiredFields)
			{
				var fieldname = facilityRequiredFields[field];
				if(dijit.byId(fieldname) && (dijit.byId(fieldname).getValue() == null || dijit.byId(fieldname).getValue() == "" || dijit.byId(fieldname).getValue()+"" == "NaN"))
				{

					console.debug("[Mandatory Field validation] Value missing for field :"+fieldname);
					isStateValid = false;
				}
			}
			return isStateValid;
		},
		
		addItem: function(event)
		{
			
			misys.toggleFields(true,["limit_ref","limit_amt", "limit_cur_code", "product_code", "sub_product_code", "product_type_code","product_template", "beneficiary_name", "beneficiary_country"],null,true,false);
			misys._config.storeId = "";
			
			if(dojo.byId("productTypeDiv"))
			{
				misys.animate("wipeOut", dojo.byId("productTypeDiv"));
			}
			// verifies whether all facility defn mandatory fields are entered
			var isValid = this.validatePreRequisite();
			var addLimitBtn = dijit.byId("addLimitButton");
			
			if(isValid != true)
			{
				if(dijit.byId("entity_select_list_facility"))
				{
					misys.dialog.show("ERROR", misys.getLocalization("addLimitValidationWE"));
				}
				else
				{
					misys.dialog.show("ERROR", misys.getLocalization("addLimitValidationWOE"));
				}
				return;
			}

			var facility_select_list = dojo.byId("entity_select_list_facility");
			var limit_avail_list = dojo.byId("entity_avail_list_limit");
			var limit_select_list = dojo.byId("entity_select_list_limit");
			if(limit_avail_list && facility_select_list && limit_select_list)
			{
				limit_avail_list.innerHTML=[];
				limit_select_list.innerHTML=[];
				
				for(var i=0; i<facility_select_list.options.length; i++)
				{
					var op = dojo.create("option");
					op.value = facility_select_list.options[i].value;
					op.innerHTML = facility_select_list.options[i].value;
					limit_avail_list.appendChild(op);
				}
			}
			//reset previous amount for new limit
			if(dijit.byId("previous_limit_amt"))
			{
				dijit.byId("previous_limit_amt").set("value","");
			}
			if(dijit.byId("limit_utilised_amt"))
			{
				dijit.byId("limit_utilised_amt").set("value","");
			}
			if(dijit.byId("limit_utilised_percent"))
			{
				dijit.byId("limit_utilised_percent").set("value","");
			}
			console.debug("[Limit Definition] addItem start");

			this.inherited(arguments);
			
			if(dijit.byId("beneficiary_name"))
			{
				dijit.byId("beneficiary_name").set("readOnly",true);
			}
			
			console.debug("[Limit Definition] addItem end");
		},
		
		toXML: function(){
			var xml = [];
			
			if(this.xmlTagName) {
				xml.push("<",this.xmlTagName,">");
			}
			
			if(this.grid)
			{
				this.grid.store.fetch({query: {store_id: '*'}, 
						onComplete: dojo.hitch(this, function(items, request){
					xml.push(this.itemToXML(items, this.xmlSubTagName));
				})});
			}
			
			if(this.xmlTagName) {
				xml.push("</", this.xmlTagName, ">");
			}
			
			return xml.join("");
		},
		
		itemToXML: function(items, xmlSubTagName)
		{
			var xml = [];
			
			dojo.forEach(items, function(item){
				if(item) {
					if(xmlSubTagName) {
						xml.push("<",xmlSubTagName,">");
					}
					for(var property in item)
					{
						// Process a sub-grid included in this item
						var value = dojo.isArray(item[property]) ? item[property][0] : item[property];
						if (dojo.isObject(value) && value._type)
						{
							var classname = value._type;
							var clazz = dojo.eval(classname);
							var multipleItems = new clazz({});
							xml.push('<', multipleItems.xmlTagName, '>');
							xml.push(this.itemToXML(value._values, multipleItems.xmlSubTagName, xml));
							xml.push('</', multipleItems.xmlTagName ,'>');
						}
						// Otherwise, process a property of the item 
						else if(property != 'store_id' && property.match('^_') != '_')
						{
							value = dojo.isArray(item[property]) ? item[property][0] : item[property];
							value += '';
							
							for(var property1 in this.basicMap) {
								if(this.basicMap[property1]._fieldName === property)
								{
									xml.push('<', property1, '>', dojox.html.entities.encode(value, dojox.html.entities.html), '</', property1, '>');
									break;
								}
							}
							
							
							for(var property2 in this.entityMap) {
								if(this.entityMap[property2]._fieldName === property)
								{
									xml.push("<attached_entities>");
									if(value !== "")
									{
										var arr = value.split(",");
										
										for(var i in arr)
										{
											xml.push("<entity><entity_abbv_name>"+arr[i]+"</entity_abbv_name></entity>");
										}
									}
									xml.push("</attached_entities>");
								}
							}
						}
					}
					
					if(xmlSubTagName) {
						xml.push('</', xmlSubTagName, '>');
					}
				}
			}, this);
							
			return xml.join("");
		},
		
		createItemsFromJson: function(jsonMsg)
		{
			console.debug("[Limit Definition] createItemsFromJson start");
			
			this.inherited(arguments);
			
			console.debug("[Limit Definition] createItemsFromJson end");
		},
		
		validateTemplateEntity : function()
		{

			var productTemplateWidget		= dijit.byId("product_template"),
				bankName 			  		= dijit.byId("bank_abbv_name").get("value"),
				limit_select_list 			= dijit.byId("entity_select_list_limit"),
				limitEntitiesList 			= limit_select_list ? limit_select_list.get("value") : [],
				invalidEntities 			= [];
			
			if(limitEntitiesList && limitEntitiesList.length > 0 && productTemplateWidget && productTemplateWidget.get("value")+"S" !== "S")
			{
				var entityTemplateList = misys._config.guaranteeTemplateByEntityList[bankName],
					templateListForAll = misys._config.guaranteeTemplateByEntityList[bankName]["ALL"];
				
				for(var i=0; i<limitEntitiesList.length; i++)
				{
					var value =  limitEntitiesList[i],
					templateListByEntity = entityTemplateList[value],
					valid = false;
					
					if(!templateListByEntity || (templateListByEntity && templateListByEntity.indexOf(productTemplateWidget.get("value")) === -1))
					{
						if(!templateListForAll || (templateListForAll.indexOf(productTemplateWidget.get("value")) === -1))
						{
							
							invalidEntities.push(value);
						}
					}
					
				}
			}
			if(invalidEntities && invalidEntities.length > 0)
			{
				misys.dialog.show("ERROR",misys.getLocalization("inValidEntitesForTemplate",[invalidEntities.toString(),productTemplateWidget.get("value")]));
				return false;
			}
			else
			{
				return true;
			}
		},
		
		performValidation: function()
		{
			if(this.overrideDisplaymode !== "view")
			{
				//set the linked entity number count.
				var selectedEntitySize = dijit.byId("entity_select_list_limit")? dijit.byId("entity_select_list_limit").getValue().length: 0;
				dijit.byId("linked_entities_number").set("value",selectedEntitySize);
				
				
				//check whether all mandatory fields are entered
				var mandatoryFields = this.mandatoryFields;
				var state = true;
				for(field in mandatoryFields)
				{
					var fieldname = mandatoryFields[field];
					if(dijit.byId(fieldname) && (dijit.byId(fieldname).getValue() == null || dijit.byId(fieldname).getValue() == "" || dijit.byId(fieldname).getValue()+"" == "NaN"))
					{
						console.debug("[Mandatory Field validation] Value missing for field :"+fieldname);
						dijit.byId(fieldname).state = "Error";

						state = false;
					}
				}
				
				if(!state)
				{
					misys.dialog.show("ERROR", misys.getLocalization("addLimitValidationWOE"));
					return state;
				}
				else
				{
					if(dijit.byId("entity_select_list_limit") && dijit.byId("entity_select_list_limit").get("value") && dijit.byId("entity_select_list_limit").get("value").length <1)
					{
						misys.dialog.show("ERROR", misys.getLocalization("addLimitValidationWE"));
						return false;
					}
				}
				
				var isTemplateValid = this.validateTemplateEntity();
				if(!isTemplateValid)
				{
					return false;
				}
				var grid = this.grid;
				var productCode = dijit.byId("product_code"),
					subProductCode = dijit.byId("sub_product_code"),
					productTypeCode = dijit.byId("product_type_code"),
					productTemplate = dijit.byId("product_template"),
					counterparty = dijit.byId("counterparty"),
					country = dijit.byId("beneficiary_country"),
					limAmount = dijit.byId("limit_amt"),
					limCurrency = dijit.byId("limit_cur_code"),
					limRef = dijit.byId("limit_ref"),
					hasCurrencyValidation = dijit.byId("currency_validation"),
					hasTotalLimitAmountValidation = dijit.byId("limit_total_amount_validation"),
					totalLimitAmount = limAmount.get("value");
					var isLimitvalid = true;
					var isLimitInvalid = true;
					//verify if limit is duplicate
					if(grid !== null && grid.store !== null && grid.store._arrayOfTopLevelItems.length > 0)
					{
						  grid.store.fetch({query: {store_id: '*'}, onComplete: function(items, request){
							 isLimitInvalid = dojo.some(items, function(item){
										//check for duplicate limit reference
										if(misys._config.storeId !== item.store_id[0])
										{
											  totalLimitAmount = dojo.number.parse(totalLimitAmount) + dojo.number.parse(item.limit_amt[0]);
											  if(productCode.getValue() === item.product_code[0] && subProductCode.getValue() === item.sub_product_code[0])
											  {
													isLimitvalid = false;
											  }		
														 // check whether currency is also same. Currency is included in the validation based on property config
											 if(!isLimitvalid &&  hasCurrencyValidation && hasCurrencyValidation.getValue() === 'true')
											 {
																
												if(limCurrency.getValue() === item.limit_cur_code[0])
												{
													  isLimitvalid = false;
												}
												else
												{
													  isLimitvalid = true;
												}
											}
											/*Check wther prodTypeCode, template, cpty and country are also same for a given limit. this is based on paramter config(P750)*/
										   if(!isLimitvalid)
											{
														var productTypeCode	= dijit.byId("product_type_code"),
															productTemplate	= dijit.byId("product_template"),
															counterparty	= dijit.byId("beneficiary_name"),
															country			= dijit.byId("beneficiary_country");
												if(productTypeCode && productTypeCode.get("value") !== item.product_type_code[0])
												{
													isLimitvalid = true;
												}
												else if(productTemplate && productTemplate.get("value") !== item.product_template[0])
												{
													isLimitvalid = true;
												}
												else if(!isLimitvalid && counterparty && counterparty.get("value") !== item.beneficiary_name[0])
												{
													isLimitvalid = true;
												}
												else if(!isLimitvalid && country && country.get("value") !== item.beneficiary_country[0])
												{
													isLimitvalid = true;
												}
											}
										}
										if(!isLimitvalid){return !isLimitvalid;}
								 });
						  }});
						  if(isLimitInvalid)
						  {
								 misys.dialog.show("ERROR", misys.getLocalization("limitDuplicationError"));
								 return isLimitvalid;
						  }
						  
					}
				/*to check whether sum of limit amt is allowed to be greater than Facility amt. this is configurable through property*/
				  if(hasTotalLimitAmountValidation && hasTotalLimitAmountValidation.getValue() === 'true')
				  {
					 if(dijit.byId("facility_amt") && totalLimitAmount > dijit.byId("facility_amt").get("value"))
					 { 
						  misys.dialog.show("ERROR", misys.getLocalization("totalLimitAmountError"));
						  return false;
					 }
				  }
				//setting the productCode/SubProductCode displayed values into hidden item fields
				 if(dijit.byId("product_code"))
				 {
					 dijit.byId("product_code_label").set("value",dijit.byId("product_code").get("displayedValue"));
				 }
				 if(dijit.byId("sub_product_code"))
				 {
					 dijit.byId("sub_product_code_label").set("value",dijit.byId("sub_product_code").get("displayedValue"));
				 }
				 if(dijit.byId("limit_status"))
				 {
					 dijit.byId("limit_status_label").set("value",dijit.byId("limit_status").get("displayedValue"));
				 }
				 
			}
			this.inherited(arguments);
			return true;
		},
		
		onGridCreate : function()
		{
			if(dijit.byId("enablePendingBank") && dijit.byId("enablePendingBank").get("value") === "N")
			{
				 if(this.grid && this.grid != null)
				 {
					 for(var i = 0 ; i< this.grid.layout.cellCount; i++)
					{
						if(this.grid.getCell(i).field === "limit_pending_bank_amt")
						{
							this.grid.layout.setColumnVisibility(i,false);
							break;
						}
					}
				 }
			}
		}
	}
);
