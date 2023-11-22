dojo.provide("misys.openaccount.widget.InsuranceRequiredClauses");
dojo.experimental("misys.openaccount.widget.InsuranceRequiredClauses"); 

dojo.require("misys.grid.GridMultipleItems");
dojo.require("misys.openaccount.widget.InsuranceRequiredClause");

// our declared class
dojo.declare("misys.openaccount.widget.InsuranceRequiredClauses",
		[ misys.grid.GridMultipleItems ],
		// class properties:
		{
		data: { identifier: "store_id", label: "store_id", items: [] },
		templatePath: null,
		templateString: dojo.byId("insurance-required-clause-template").innerHTML,
		dialogId: "insurance-required-clause-dialog-template",
		xmlTagName: "",
		xmlSubTagName: "",
		
		gridColumns: ["ids_clauses_required","ids_clauses_required_hidden"],
        
		propertiesMap: {
			ClausesReqrd: {_fieldName: "ids_clauses_required"},
			ClausesReqrdHidden: {_fieldName: "ids_clauses_required_hidden"}
			},

		layout: [
				{ name: "Clause Required", field: "ids_clauses_required_hidden", width: "35%" },
				{ name: " ", field: "actions", formatter: misys.grid.formatReportActions, width: "10%" }/*,
				{ name: "Id", field: "store_id", headerStyles: "display:none", cellStyles: "display:none" }*/
				],
        
		mandatoryFields: [],
        
		startup: function(){
			console.debug("[InsuranceRequiredClauses] startup start");
			
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
			console.debug("[InsuranceRequiredClauses] startup end");
		},
    	
		openDialogFromExistingItem: function(items, request)
		{
			console.debug("[InsuranceRequiredClauses] openDialogFromExistingItem start");
			
			// In view mode, disconnect events on amount and rate fields
			// as they are not properly rendered otherwise
			/*if (misys._config.displayMode === "view") {
				misys.disconnectById("freight_charge_amt");
				misys.disconnectById("freight_charge_rate");				
			}*/

			this.inherited(arguments);
			
			console.debug("[InsuranceRequiredClauses] openDialogFromExistingItem end");
		},
		
		createItem: function()
		{
			if(this.hasChildren && this.hasChildren())
			{
				var type= 'misys.openaccount.widget.InsuranceRequiredClauses';
				var value= [];
				dojo.forEach(this.getChildren(), function(child){
					if (child.createItem)
					{
						value.push(child.createItem());
					}
				}, this);
				var obj = {_value : value , _type: type};
				var item = {};
				item["insurance_dataset_req_clause"] = obj;
				return item;
			}
			return null;
		},
		
		resetDialog: function(event)
		{
			console.debug("[InsuranceRequiredClauses] ResetDialog start");
			
			this.inherited(arguments);
			
			console.debug("[InsuranceRequiredClauses] ResetDialog end");
		},


		addItem: function(event)
		{
			console.debug("[InsuranceRequiredClauses] addItem start");
			this.inherited(arguments);
			
			console.debug("[InsuranceRequiredClauses] addItem end");
		},

		createItemsFromJson: function(jsonMsg)
		{
			console.debug("[InsuranceRequiredClauses] createItemsFromJson start");
			
			this.inherited(arguments);
			
			console.debug("[InsuranceRequiredClauses] createItemsFromJson end");
		}
	}
);