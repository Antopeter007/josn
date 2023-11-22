dojo.provide("misys.liquidity.widget.BalAccounts");
dojo.require("misys.grid.GridMultipleItems");
dojo.require("misys.liquidity.widget.BalAccount");
/**
 * This widget stores account details of a sub group.
 */
dojo.declare("misys.liquidity.widget.BalAccounts",
		[ misys.grid.GridMultipleItems ],
		// class properties:
		{
		data: { identifier: "store_id", label: "store_id", items: [] },
		
		templatePath: null,		
		templateString: dojo.byId("balacctsubgroup-template")? dojo.byId("balacctsubgroup-template").innerHTML: "",
		dialogId: "balacctsubgroup-dialog-template",
		dialogAddItemTitle: misys.getLocalization("addaccount-dialog"),
		xmlTagName: "acctsubgroups",
		xmlSubTagName: "acctsubgroup",
		
		gridColumns: ["sub_group_code", "account_no", "account_id", "company_id", "sub_group_id", "sub_group_pivot", "acctsubgrppivot_label", "description"],
        
		propertiesMap: {
			sub_group_code: {_fieldName: "sub_group_code"},
			account_no: {_fieldName: "account_no"},
			account_id: {_fieldName: "account_id"},
			company_id: {_fieldName: "company_id"},
			sub_group_id: {_fieldName: "sub_group_id"},
			sub_group_pivot: {_fieldName: "sub_group_pivot"},
			acctsubgrppivot_label: {_fieldName: "acctsubgrppivot_label"},
			description: {_fieldName: "acctdesc"}
			},
        
		layout: [
				{ name: misys.getLocalization("cashPoolingbalanceSubGroupAccountHeaderAccountNumber"), field: "account_no", width: "30%" },
				{ name: misys.getLocalization("cashPoolingbalanceSubGroupAccountHeaderDescription"), field: "description", width: "20%" },
				{ name: misys.getLocalization("cashPoolingbalanceSubGroupAccountHeaderSubGroupPivot"),  field: "acctsubgrppivot_label", width: "40%" , classes: "align-center"},
				{ name: " ", field: "actions", formatter: misys.grid.formatReportActions, width: "10%" },
				{ name: "Id", field: "store_id", headerStyles: "display:none", cellStyles: "display:none" }
				],
        
		mandatoryFields: [ "account_no",  "sub_group_pivot"],

		startup: function(){
			console.debug("[Balancing sub group Accounts] startup start");
			
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
			console.debug("[Balancing sub group Accounts] startup end");
		},
    	
		openDialogFromExistingItem: function(items, request)
		{
			this.inherited(arguments);
		}, 
		
		addItem: function(event)
		{
			console.debug("[Balancing sub group Accounts] addItem start");
			
			this.inherited(arguments);
			
			console.debug("[Balancing sub group Accounts] addItem end");
		},
		createItemsFromJson: function(jsonMsg)
		{
			console.debug("[Balancing sub group Accounts] createItemsFromJson start");
			
			this.inherited(arguments);
			
			console.debug("[Balancing sub group Accounts] createItemsFromJson end");
		},
		
		updateData: function(event)
		{
			
			this.inherited(arguments);
		},
		
		performValidation: function()
		{

			console.debug("[Bal Account] validate start");
			if(this.validateDialog(true))
			{
				//To check the pivot is unique. 
				if(this.grid && this.grid.store && this.grid.store._arrayOfTopLevelItems)
				{ 
					var alreadypresent=false;
					var newlyaddedPivot = dijit.byId("sub_group_pivot").get("value");
					var storeId = this.grid.gridMultipleItemsWidget.dialog.storeId;
					this.grid.store.fetch({
						query:{store_id:"*"},
						onComplete: dojo.hitch(this.grid, function(items, request){
							dojo.forEach(items, function(item)
							{
								 if(item.sub_group_pivot[0].toUpperCase() === "YES")
								 {
									 alreadypresent=true;
								 }
							});
						})
					});
					if(alreadypresent && (newlyaddedPivot.toUpperCase()=== "YES"))
					{
						misys.dialog.show("ERROR", misys.getLocalization("balaccountPivotUniqueCheck"));
					}
					else
					{
						this.inherited(arguments);
					}
				}
				else
				{
					this.inherited(arguments);
				}
			}
			console.debug("[Bal Account] validate end");
		}
	}
);