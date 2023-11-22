dojo.provide("misys.liquidity.widget.BalSubGroups");
dojo.require("misys.grid.GridMultipleItems");
dojo.require("misys.liquidity.widget.BalSubGroup");
dojo.require("misys.liquidity.widget.BalAccounts");
dojo.require("misys.constants");

/**
 * This widget stores the balance sub groups for a given cash pooling structure.
 */
dojo.declare("misys.liquidity.widget.BalSubGroups",
		[ misys.grid.GridMultipleItems ],
		// class properties:
		{
		data: { identifier: "store_id", label: "store_id", items: [] },		
		templatePath: null,		
		templateString: dojo.byId("balsubgroup-template")? dojo.byId("balsubgroup-template").innerHTML: "",
		dialogId: "balsubgroup-dialog-template",
		dialogAddItemTitle: misys.getLocalization("subgroup-dialog"),
		xmlTagName: "balsubgroups",
		xmlSubTagName: "balsubgroup",
		
		gridColumns: ["sub_group_code", "group_code", "company_id", "subgrp_description", "subGrpPivot", "subgrppivot_label",
		              "subGrpType", "subGrp_label", "balance_target", "low_target",
		      		  "high_target", "sub_group_id",
   		    		  "group_id", "indirect", "bal_account_identifiers"],
        
		propertiesMap: {
			sub_group_code: {_fieldName: "sub_group_code"},
			group_code: {_fieldName: "group_code"},
			company_id: {_fieldName: "company_id"},
			subgrp_description: {_fieldName: "subgrp_description"},
			subGrpPivot: {_fieldName: "subGrpPivot"},
			subgrppivot_label: {_fieldName: "subgrppivot_label"},
			subGrpType: {_fieldName: "subGrpType"},
			subGrp_label:{_fieldName: "subGrp_label"},
			balance_target: {_fieldName: "balance_target"},
			low_balance_target: {_fieldName: "low_balance_target"},
			high_balance_target: {_fieldName: "high_balance_target"},			
			low_target: {_fieldName: "low_target"},
			high_target: {_fieldName: "high_target"},			
			sub_group_id: {_fieldName: "sub_group_id"},
			group_id: {_fieldName: "group_id"},
			indirect: {_fieldName: "indirect"},
			bal_account_identifiers: {_fieldName: "bal_account_identifiers", _type: "misys.liquidity.widget.BalAccounts"}
		},
        
		layout: [
				{ name: misys.getLocalization("cashPoolingbalanceSubGroupHeaderCode"), field: "sub_group_code", width: "15%" },
				{ name: misys.getLocalization("cashPoolingbalanceSubGroupHeaderDescription"), field: "subgrp_description", width: "15%" },
				{ name: misys.getLocalization("cashPoolingbalanceSubGroupHeaderPivot"),  field: "subgrppivot_label", width: "10%" },
				{ name: misys.getLocalization("cashPoolingbalanceSubGroupHeaderType"), field: "subGrp_label", width: "15%", classes: "align-center" },
				{ name: misys.getLocalization("cashPoolingbalanceSubGroupHeaderBalanceLowTarget"), field: "low_balance_target", width: "10%", classes: misys.constants.ALIGN_RIGHT_CLASS },
				{ name: misys.getLocalization("cashPoolingbalanceSubGroupHeaderBalanceMaxTarget"), field: "high_balance_target", width: "10%", classes: misys.constants.ALIGN_RIGHT_CLASS },
				{ name: misys.getLocalization("cashPoolingbalanceSubGroupHeaderLowTarget"), field: "low_target", width: "10%", classes: misys.constants.ALIGN_RIGHT_CLASS },
				{ name: misys.getLocalization("cashPoolingbalanceSubGroupHeaderMaxTarget"), field: "high_target", width: "10%", classes: misys.constants.ALIGN_RIGHT_CLASS },
				{ name: misys.getLocalization("cashPoolingbalanceSubGroupHeaderIndirect"), field: "indirect", width: "10%", classes: misys.constants.ALIGN_RIGHT_CLASS },
				{ name: " ", field: "actions", formatter: misys.grid.formatReportActions, width: "10%" },
				{ name: "Id", field: "store_id", headerStyles: "display:none", cellStyles: "display:none" }
				],
				
		typeMap: {
			"misys.liquidity.widget.BalAccounts" : {
				"type": Array,
				"deserialize": function(value) {
					var item = {};
					item._type = "misys.liquidity.widget.BalAccounts";
					item._values = value;
					return item;
				}
			}
		},
        
		mandatoryFields: [ "sub_group_code", "subgrp_description", "balance_target","low_target","high_target","Type"],

		startup: function(){
			console.debug("[Bal Sub Groups] startup start");			
			this.inherited(arguments);
			console.debug("[Bal Sub Groups] startup end");
		},
    	
		openDialogFromExistingItem: function(items, request)
		{
			this.inherited(arguments);
		},
		
		resetDialog: function(items, request)
		{
			console.debug("[BalSubGroup] resetDialog start");			
			this.inherited(arguments);			
			console.debug("[BalSubGroup] resetDialog end");
		},

		createDataGrid: function()
		{
			this.inherited(arguments);
		},

		addItem: function(event)
		{
			console.debug("[BalSubGroup] addItem start");			
			this.inherited(arguments);			
			console.debug("[BalSubGroup] addItem end");
		},
		
		updateData: function(event)
		{
			console.debug("[BalSubGroup] updateData start");

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
								if ((value !== null && value !== undefined) && property === "subGrpType")
								{
									var subGrptypedesc = misys.getsubGroupTypeData(value);
									this.grid.store.setValue(item, "subGrp_label", subGrptypedesc);
								}
							}
						}
						else
						{
							if ((this._itemFields.subGrpType !== null && this._itemFields.subGrpType !== undefined))
							{
								var baltypedesc1 = misys.getsubGroupTypeData(this._itemFields.subGrpType);
								this._itemFields.subGrp_label = baltypedesc1;
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
			console.debug("[BalSubGroup] updateData end");
		},
		
		performValidation: function()
		{
			console.debug("[BalSubGroup] validate start");
			if(this.validateDialog(true) && misys.validateSubGroupCode() && misys.validateSubGrpDescription()&& misys.validateLowTargetBalances() && misys.validateHighTargetBalances())
			{
				//To check the BalSubGroups is unique. 
				if(this.grid && this.grid.store && this.grid.store._arrayOfTopLevelItems)
				{ 
					var balSubGroupCodeUnique=true; 
					var balSubGroupCode = dijit.byId("sub_group_code").get("value");
					var storeId = this.grid.gridMultipleItemsWidget.dialog.storeId;
					this.grid.store.fetch({
						query:{store_id:"*"},
						onComplete: dojo.hitch(this.grid, function(items, request){
							dojo.forEach(items, function(item)
							{
								//Modifying an existing BalSubGroups record check.
								if(storeId)
								{
									if(item.sub_group_code[0].toUpperCase() === balSubGroupCode.toUpperCase() && (item.store_id[0]!== storeId))
									{	
										balSubGroupCodeUnique=false;
										dijit.byId("sub_group_code").focus();
										dijit.byId("sub_group_code").set("state","Error");
										dijit.hideTooltip(dijit.byId("sub_group_code").domNode);
										misys.showTooltip(misys.getLocalization("balSubGroupCodeUniqueCheck"), dijit.byId("sub_group_code").domNode);
										
									}
								}
								//Adding a new BalSubGroups record check.
								else if(item.sub_group_code[0].toUpperCase() === balSubGroupCode.toUpperCase())
							     {
										balSubGroupCodeUnique=false;
										dijit.byId("sub_group_code").focus();
										dijit.byId("sub_group_code").set("state","Error");
										dijit.hideTooltip(dijit.byId("sub_group_code").domNode);
										misys.showTooltip(misys.getLocalization("balSubGroupCodeUniqueCheck"), dijit.byId("sub_group_code").domNode);
								  }
							});
						})
					});
					if(balSubGroupCodeUnique){
						this.inherited(arguments);
					}
				}
				else
				{
					this.inherited(arguments);
				}
			}
			console.debug("[BalSubGroup] validate end");
		}
	}
);