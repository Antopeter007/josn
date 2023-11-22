dojo.provide("misys.liquidity.widget.BalGroups");
dojo.require("misys.grid.GridMultipleItems");
dojo.require("misys.liquidity.widget.BalGroup");
dojo.require("misys.liquidity.widget.BalSubGroups");
dojo.require("misys.constants");

/**
 * This widget stores the line items details for the Open account transactions.
 */
dojo.declare("misys.liquidity.widget.BalGroups",
		[ misys.grid.GridMultipleItems ],
		// class properties:
		{
		data: { identifier: "store_id", label: "store_id", items: [] },
		
		templatePath: null,		
		templateString: dojo.byId("balgroup-template")? dojo.byId("balgroup-template").innerHTML: "",
		dialogId: "balgroup-dialog-template",
		dialogAddItemTitle: misys.getLocalization("group-dialog"),
		xmlTagName: "BalGroups",
		xmlSubTagName: "BalGroup",
		
		gridColumns: ["group_code", "structure_code", "description", "frequency", "frequency_label", "balance_type", "balance_type_label",
		              "currency", "currency_label", "minimum", "rounding",
		      		  "group_order", "company_id",
   		    		  "structure_id", "group_id", "sub_group_identifiers"],
        
		propertiesMap: {
			group_code: {_fieldName: "group_code"},
			structure_code: {_fieldName: "structure_code"},
			description: {_fieldName: "description"},
			frequency: {_fieldName: "frequency"},
			frequency_label: {_fieldName: "frequency_label"},
			currency_label:{_fieldName: "currency_label"},
			balance_type: {_fieldName: "balance_type"},
			balance_type_label: {_fieldName: "balance_type_label"},
			currency: {_fieldName: "currency"},
			minimum: {_fieldName: "minimum"},
			rounding: {_fieldName: "rounding"},
			group_order: {_fieldName: "group_order"},
			company_id: {_fieldName: "company_id"},
			structure_id: {_fieldName: "structure_id"},
			group_id: {_fieldName: "group_id"},
			sub_group_identifiers: {_fieldName: "sub_group_identifiers", _type: "misys.liquidity.widget.BalSubGroups"}
		},
        
		layout: [
				{ name: misys.getLocalization("cashPoolingbalanceGroupHeaderCode"), field: "group_code", width: "10%" },
				{ name: misys.getLocalization("cashPoolingbalanceGroupHeaderDescription"), field: "description", width: "20%" },
				{ name: misys.getLocalization("cashPoolingbalanceGroupHeaderFrequency"),  field: "frequency_label", width: "10%" },
				{ name: misys.getLocalization("cashPoolingbalanceGroupHeaderBalanceType"), field: "balance_type_label", width: "10%", classes: "align-center" },
				{ name: misys.getLocalization("cashPoolingbalanceGroupHeaderCurrency"), field: "currency", width: "10%", classes: misys.constants.ALIGN_RIGHT_CLASS },
				{ name: misys.getLocalization("cashPoolingbalanceGroupHeaderMinimum"), field: "minimum", width: "10%", classes: misys.constants.ALIGN_RIGHT_CLASS },
				{ name: misys.getLocalization("cashPoolingbalanceGroupHeaderRounding"), field: "rounding", width: "10%", classes: misys.constants.ALIGN_RIGHT_CLASS },
				{ name: misys.getLocalization("cashPoolingbalanceGroupHeaderOrder"), field: "group_order", width: "10%", classes: misys.constants.ALIGN_RIGHT_CLASS },				
				{ name: " ", field: "actions", formatter: misys.grid.formatReportActions, width: "10%" },
				{ name: "Id", field: "store_id", headerStyles: "display:none", cellStyles: "display:none" }
				],
				
		typeMap: {
			"misys.liquidity.widget.BalSubGroups" : {
				"type": Array,
				"deserialize": function(value) {
					var item = {};
					item._type = "misys.liquidity.widget.BalSubGroups";
					item._values = value;
					return item;
				}
			}
		},
        
		mandatoryFields: ["group_code", "description",  "currency","Frequency", "Balance Type"],

		startup: function(){
			console.debug("[Bal Groups] startup start");
			
			this.inherited(arguments);
			console.debug("[Bal Groups] startup end");
		},
    	
		openDialogFromExistingItem: function(items, request)
		{
			this.inherited(arguments);
		},
		
		resetDialog: function(items, request)
		{
			console.debug("[BalGroup] resetDialog start");
			
			this.inherited(arguments);
			
			
			console.debug("[BalGroup] resetDialog end");
		},

		createDataGrid: function()
		{
			this.inherited(arguments);
		},

		addItem: function(event)
		{
			console.debug("[BalGroup] addItem start");
			
			this.inherited(arguments);
			
			console.debug("[BalGroup] addItem end");
		},
		
		updateData: function(event)
		{
		
			console.debug("[BalGroup] updateData start");

			// retrieve item values from the dialog
			var storeId = this.dialog.storeId;
			
			//TODO: try to remove this internal property (used because we don't know how to pass a parameter to store.fetch method
			this._itemFields = this._retrieveItemFields();	
			
			if (storeId !== null && storeId !== undefined) 
			{
				this._itemFields["store_id"] = storeId;
			}
			else 
			{
				this._itemFields["store_id"] = dojox.uuid.generateRandomUuid();
			}
			
			// Mark the item as valid or invalid based on:
			//	- the mandatory fields for this item 
			//	- the validity of underlying sub-items
			var areAllMandatoryFieldsFilled = this.checkMandatoryProperties(this._itemFields);
			var areSubItemsValid = this.checkSubItemsValidity();
			this._itemFields["is_valid"] = areAllMandatoryFieldsFilled && areSubItemsValid ? "Y" : "N";
			
			// Hide the label section and show the grid section
			// as it must be displayed in order to instantiate the Dojo DataGrid.
			dojo.attr(this.itemsNode, "style", { display: "block" });
			dojo.attr(this.noItemLabelNode, "style", { display: "none" });
			
			// Update the grid
			if (this.grid)
			{
				this.grid.store.fetch({
					query: {store_id: storeId}, 
					onComplete: dojo.hitch(this, function(items, request){
						if (items.length > 0)
						{
							var item = items[0];
							for (var property in this._itemFields)
							{
								var value = this._itemFields[property];
								if ((value !== null && value !== undefined) && property !== "store_id")
								{
									this.grid.store.setValue(item, property, value);
								}
								if ((value !== null && value !== undefined) && property === "frequency")
								{
									var frdesc = misys.getFrequencyCodeData(value);
									this.grid.store.setValue(item, "frequency_label", frdesc);
								}
								if ((value !== null && value !== undefined) && property === "balance_type")
								{
									var baltypedesc = misys.getBalanceTypeCodeData(value);
									this.grid.store.setValue(item, "balance_type_label", baltypedesc);
								}
							}
						}	
						else
						{
							if ((this._itemFields.frequency !== null && this._itemFields.frequency !== undefined))
							{
								var frdesc1 = misys.getFrequencyCodeData(this._itemFields.frequency);
								this._itemFields.frequency_label = frdesc1;
							}
							if ((this._itemFields.balance_type !== null && this._itemFields.balance_type !== undefined))
							{
								var baltypedesc1 = misys.getBalanceTypeCodeData(this._itemFields.balance_type);
								this._itemFields.balance_type_label = baltypedesc1;
							}
							this.grid.store.newItem(this._itemFields);
						}
					})
				});
		
		        // Unselect all rows
		        var items = this.grid.selection.getSelected();
		        if (items.length) {
		            // Iterate through the list of selected items
		        	// and unselect them
		            dojo.forEach(items, function(selectedItem) {
		                if (selectedItem !== null) {
		                    // Delete the item from the data store:
		                    this.grid.selection.setSelected(selectedItem, false);
		                }
		            }, this);
		        }    	            
			}
			else
			{
				// Create data store
				var data_list = [this._itemFields];
		    	var data = {
		    			identifier: "store_id",
		    			label: "store_id",
		    			items: data_list
		    		};
		
				this.store = new dojo.data.ItemFileWriteStore({data: data, typeMap: this.typeMap});
				this.createDataGrid();
			}
			this.grid.store.save();
			this.grid.render();
			console.debug("[BalGroup] updateData end");
		
			
		},
		
		performValidation: function()
		{
			console.debug("[BalGroups] validate start");
			if(this.validateDialog(true) && misys.validateGroupCode() && misys.validateDescription())
			{
				//To check the BalGroups is unique. 
				if(this.grid && this.grid.store && this.grid.store._arrayOfTopLevelItems)
				{ 
					var balGroupCodeUnique=true; 
					var balGroupOrderUnique = true;
					var balGroupCode = dijit.byId("group_code").get("value");
					var balGroupOrder = dijit.byId("group_order").get("value");
					var storeId = this.grid.gridMultipleItemsWidget.dialog.storeId;
					this.grid.store.fetch({
						query:{store_id:"*"},
						onComplete: dojo.hitch(this.grid, function(items, request){
							dojo.forEach(items, function(item)
							{
								//Modifying an existing BalGroups record check.
								if(storeId)
								{
									if(item.group_code[0].toUpperCase() === balGroupCode.toUpperCase() && (item.store_id[0]!== storeId))
									{	
										balGroupCodeUnique=false;
										dijit.byId("group_code").focus();
										dijit.byId("group_code").set("state","Error");
										dijit.hideTooltip(dijit.byId("group_code").domNode);
										misys.showTooltip(misys.getLocalization("balGroupCodeUniqueCheck"), dijit.byId("group_code").domNode);
										
									}
									if(parseInt(item.group_order[0],10) === balGroupOrder && (item.store_id[0]!== storeId))
									{	
										balGroupOrderUnique=false;
										dijit.byId("group_order").focus();
										dijit.byId("group_order").set("state","Error");
										dijit.hideTooltip(dijit.byId("group_order").domNode);
										misys.showTooltip(misys.getLocalization("balGroupOrderUniqueCheck"), dijit.byId("group_order").domNode);
									}
								}
								//Adding a new BalGroups record check.
								else if(item.group_code[0].toUpperCase() === balGroupCode.toUpperCase())
							     {
										balGroupCodeUnique=false;
										dijit.byId("group_code").focus();
										dijit.byId("group_code").set("state","Error");
										dijit.hideTooltip(dijit.byId("group_code").domNode);
										misys.showTooltip(misys.getLocalization("balGroupCodeUniqueCheck"), dijit.byId("group_code").domNode);
								  }
								else if(parseInt(item.group_order[0],10) === balGroupOrder)
							     {
									balGroupOrderUnique=false;
									dijit.byId("group_order").focus();
									dijit.byId("group_order").set("state","Error");
									dijit.hideTooltip(dijit.byId("group_order").domNode);
									misys.showTooltip(misys.getLocalization("balGroupOrderUniqueCheck"), dijit.byId("group_order").domNode);
								  }
							});
						})
					});
					if(balGroupCodeUnique && balGroupOrderUnique){
						this.inherited(arguments);
					}
				}
				else
				{
					this.inherited(arguments);
				}
			}
			console.debug("[BalGroups] validate end");
		}
	}
);