dojo.provide("misys.openaccount.widget.PaymentInsuranceRequiredConditions");
dojo.experimental("misys.openaccount.widget.PaymentInsuranceRequiredConditions"); 

dojo.require("misys.grid.GridMultipleItems");
dojo.require("misys.openaccount.widget.PaymentInsuranceRequiredCondition");

// our declared class
dojo.declare("misys.openaccount.widget.PaymentInsuranceRequiredConditions",
		[ misys.grid.GridMultipleItems ],
		// class properties:
		{
		data: { identifier: "store_id", label: "store_id", items: [] },
		templatePath: null,
		templateString: dojo.byId("payment-insurance-required-conditions-template") ? dojo.byId("payment-insurance-required-conditions-template").innerHTML : "",
		dialogId: "payment-insurance-required-condition-dialog-template",
		xmlTagName: "",
		xmlSubTagName: "",
		
		gridColumns: ["payment_ids_conditions_required","payment_ids_conditions_required_hidden"],
        
		propertiesMap: {
			InsrncConds: {_fieldName: "payment_ids_conditions_required"},
			InsrncCondsHidden: {_fieldName: "payment_ids_conditions_required_hidden"}
			},

		layout: [
				{ name: "InsrncConds", field: "payment_ids_conditions_required", width: "35%" },
				{ name: " ", field: "actions", formatter: misys.grid.formatReportActions, width: "10%" }
				],
        
		mandatoryFields: [],
        
		startup: function(){
			console.debug("[PaymentInsuranceRequiredConditions] startup start");
			
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
			console.debug("[PaymentInsuranceRequiredConditions] startup end");
		},
    	
		openDialogFromExistingItem: function(items, request)
		{
			console.debug("[PaymentInsuranceRequiredConditions] openDialogFromExistingItem start");
			
			this.inherited(arguments);
			
			console.debug("[PaymentInsuranceRequiredConditions] openDialogFromExistingItem end");
		},
		
		createItem: function()
		{
			if(this.hasChildren && this.hasChildren())
			{
				var type= 'misys.openaccount.widget.PaymentInsuranceRequiredConditions';
				var value= [];
				dojo.forEach(this.getChildren(), function(child){
					if (child.createItem)
					{
						value.push(child.createItem());
					}
				}, this);
				var obj = {_value : value , _type: type};
				var item = {};
				item["payment_insurance_dataset_req_condition"] = obj;
				return item;
			}
			return null;
		},
		
		resetDialog: function(event)
		{
			console.debug("[PaymentInsuranceRequiredConditions] ResetDialog start");
			
			this.inherited(arguments);
			
			console.debug("[PaymentInsuranceRequiredConditions] ResetDialog end");
		},


		addItem: function(event)
		{
			console.debug("[PaymentInsuranceRequiredConditions] addItem start");
			this.inherited(arguments);
			
			console.debug("[PaymentInsuranceRequiredConditions] addItem end");
		},

		createItemsFromJson: function(jsonMsg)
		{
			console.debug("[PaymentInsuranceRequiredConditions] createItemsFromJson start");
			
			this.inherited(arguments);
			
			console.debug("[PaymentInsuranceRequiredConditions] createItemsFromJson end");
		}
	}
);