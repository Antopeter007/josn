dojo.provide("misys.openaccount.widget.PaymentInsuranceRequiredClauses");
dojo.experimental("misys.openaccount.widget.PaymentInsuranceRequiredClauses"); 

dojo.require("misys.grid.GridMultipleItems");
dojo.require("misys.openaccount.widget.PaymentInsuranceRequiredClause");

// our declared class
dojo.declare("misys.openaccount.widget.PaymentInsuranceRequiredClauses",
		[ misys.grid.GridMultipleItems ],
		// class properties:
		{
		data: { identifier: "store_id", label: "store_id", items: [] },
		templatePath: null,
		templateString: dojo.byId("payment-insurance-required-clause-template") ? dojo.byId("payment-insurance-required-clause-template").innerHTML : "",
		dialogId: "payment-insurance-required-clause-dialog-template",
		xmlTagName: "",
		xmlSubTagName: "",
		
		gridColumns: ["payment_ids_clauses_required","payment_ids_clauses_required_hidden"],
        
		propertiesMap: {
			InsrncClauses: {_fieldName: "payment_ids_clauses_required"},
			payment_ids_clauses_required_hidden: {_fieldName: "payment_ids_clauses_required_hidden"}
			},

		layout: [
				/*{ name: "ClausesReqrd", field: "payment_ids_clauses_required", width: "35%" },*/
				{ name: "Insurance Clauses", field: "payment_ids_clauses_required_hidden", width: "35%" },
				{ name: " ", field: "actions", formatter: misys.grid.formatReportActions, width: "10%" }/*,
				{ name: "Id", field: "store_id", headerStyles: "display:none", cellStyles: "display:none" }*/
				],
        
		mandatoryFields: [],
        
		startup: function(){
			console.debug("[PaymentInsuranceRequiredClauses] startup start");
			
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
			console.debug("[PaymentInsuranceRequiredClauses] startup end");
		},
    	
		openDialogFromExistingItem: function(items, request)
		{
			console.debug("[PaymentInsuranceRequiredClauses] openDialogFromExistingItem start");
			
			this.inherited(arguments);
			
			console.debug("[PaymentInsuranceRequiredClauses] openDialogFromExistingItem end");
		},
		
		createItem: function()
		{
			if(this.hasChildren && this.hasChildren())
			{
				var type= 'misys.openaccount.widget.PaymentInsuranceRequiredClauses';
				var value= [];
				dojo.forEach(this.getChildren(), function(child){
					if (child.createItem)
					{
						value.push(child.createItem());
					}
				}, this);
				var obj = {_value : value , _type: type};
				var item = {};
				item["payment_insurance_dataset_req_clause"] = obj;
				return item;
			}
			return null;
		},
		
		resetDialog: function(event)
		{
			console.debug("[PaymentInsuranceRequiredClauses] ResetDialog start");
			
			this.inherited(arguments);
			
			console.debug("[PaymentInsuranceRequiredClauses] ResetDialog end");
		},


		addItem: function(event)
		{
			console.debug("[PaymentInsuranceRequiredClauses] addItem start");
			this.inherited(arguments);
			
			console.debug("[PaymentInsuranceRequiredClauses] addItem end");
		},

		createItemsFromJson: function(jsonMsg)
		{
			console.debug("[PaymentInsuranceRequiredClauses] createItemsFromJson start");
			
			this.inherited(arguments);
			
			console.debug("[PaymentInsuranceRequiredClauses] createItemsFromJson end");
		}
	}
);