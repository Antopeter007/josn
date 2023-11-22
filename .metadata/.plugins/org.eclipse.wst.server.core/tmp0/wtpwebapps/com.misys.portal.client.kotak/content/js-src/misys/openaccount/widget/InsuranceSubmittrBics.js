dojo.provide("misys.openaccount.widget.InsuranceSubmittrBics");
dojo.experimental("misys.openaccount.widget.InsuranceSubmittrBics"); 

dojo.require("misys.grid.GridMultipleItems");
dojo.require("misys.openaccount.widget.InsuranceSubmittrBic");

// our declared class
dojo.declare("misys.openaccount.widget.InsuranceSubmittrBics",
		[ misys.grid.GridMultipleItems ],
		// class properties:
		{
		data: { identifier: "store_id", label: "store_id", items: [] },
		templatePath: null,
		templateString: dojo.byId("insurance-bic-template").innerHTML,
		dialogId: "insurance-bic-dialog-template",
		xmlTagName: "",
		xmlSubTagName: "",
		
		gridColumns: ["ids_bic"],
        
		propertiesMap: {
			BIC: {_fieldName: "ids_bic"}
			},

		layout: [
				{ name: "BIC", field: "ids_bic", width: "35%" },
				{ name: " ", field: "actions", formatter: misys.grid.formatReportActions, width: "10%" }/*,
				{ name: "Id", field: "store_id", headerStyles: "display:none", cellStyles: "display:none" }*/
				],
        
		mandatoryFields: ["ids_bic"],
        
		startup: function(){
			console.debug("[InsuranceSubmittrBics] startup start");
			
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
			console.debug("[InsuranceSubmittrBics] startup end");
		},
    	
		openDialogFromExistingItem: function(items, request)
		{
			console.debug("[InsuranceSubmittrBics] openDialogFromExistingItem start");
			
			// In view mode, disconnect events on amount and rate fields
			// as they are not properly rendered otherwise
			/*if (misys._config.displayMode === "view") {
				misys.disconnectById("freight_charge_amt");
				misys.disconnectById("freight_charge_rate");				
			}*/

			this.inherited(arguments);
			
			console.debug("[InsuranceSubmittrBics] openDialogFromExistingItem end");
		},
		
		createItem: function()
		{
			if(this.hasChildren && this.hasChildren())
			{
				var type= 'misys.openaccount.widget.InsuranceSubmittrBics';
				var value= [];
				dojo.forEach(this.getChildren(), function(child){
					if (child.createItem)
					{
						value.push(child.createItem());
					}
				}, this);
				var obj = {_value : value , _type: type};
				var item = {};
				item["insurance_dataset_bic"] = obj;
				return item;
			}
			return null;
		},
		
		resetDialog: function(event)
		{
			console.debug("[InsuranceSubmittrBics] ResetDialog start");
			
			this.inherited(arguments);
			
			console.debug("[InsuranceSubmittrBics] ResetDialog end");
		},


		addItem: function(event)
		{
			console.debug("[InsuranceSubmittrBics] addItem start");

			this.inherited(arguments);
			
			console.debug("[InsuranceSubmittrBics] addItem end");
		},

		createItemsFromJson: function(jsonMsg)
		{
			console.debug("[InsuranceSubmittrBics] createItemsFromJson start");
			
			this.inherited(arguments);
			
			console.debug("[InsuranceSubmittrBics] createItemsFromJson end");
		},
		
		performValidation: function()
		{
			console.debug("[Insurance Submtter Bic] validate start");
			if(this.validateDialog(true))
			{
				this.inherited(arguments);
			}
			
			console.debug("[Insurance Submtter Bic] validate end");
		}
	}
);