dojo.provide("misys.openaccount.widget.Charges");
dojo.experimental("misys.openaccount.widget.Charges"); 

dojo.require("misys.grid.GridMultipleItems");
dojo.require("misys.openaccount.widget.Charge");

// our declared class
dojo.declare("misys.openaccount.widget.Charges",
		[ misys.grid.GridMultipleItems ],
		// class properties:
		{
		data: { identifier: "store_id", label: "store_id", items: [] },
		handle: null,
		templatePath: null,
		templateString: dojo.byId("charges-template").innerHTML,
		dialogId: "charge-dialog-template",
		xmlTagName: "",
		xmlSubTagName: "",
		
		gridColumns: ["payment_charges_payer", "payment_charges_payee", "payment_charges_amount", "payment_charges_percent", "payment_charge_type"],
        
		propertiesMap: {
			ChrgsPyer: {_fieldName: "payment_charges_payer"},
			ChrgsPyee: {_fieldName: "payment_charges_payee"},
			Amt		 : {_fieldName: "payment_charges_amount"},
			Pctg	 : {_fieldName: "payment_charges_percent"},
			Tp		 : {_fieldName: "payment_charge_type"}
			},

		layout: [
				{ name: "payment_charges_payer", field: "payment_charges_payer", width: "35%" },
				{ name: "payment_charges_payee", field: "payment_charges_payee", width: "35%" },
				{ name: " ", field: "actions", formatter: misys.grid.formatReportActions, width: "10%" },
				{ name: "Id", field: "store_id", headerStyles: "display:none", cellStyles: "display:none" }
				],
        
		mandatoryFields: [],
        
		startup: function(){
			console.debug("[Charges] startup start");
			
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
			console.debug("[Charges] startup end");
		},
    	
		openDialogFromExistingItem: function(items, request)
		{
			console.debug("[Charges] openDialogFromExistingItem start");
			
			this.inherited(arguments);
			
			console.debug("[Charges] openDialogFromExistingItem end");
		},
		
		resetDialog: function(event)
		{
			console.debug("[Charges] ResetDialog start");
			
			this.inherited(arguments);
			
			console.debug("[Charges] ResetDialog end");
		},


		createItem: function()
		{
			if(this.hasChildren && this.hasChildren())
			{
				var type= 'misys.openaccount.widget.Charges';
				var value= [];
				dojo.forEach(this.getChildren(), function(child){
					if (child.createItem)
					{
						value.push(child.createItem());
						//items.push(obj);
					}
				}, this);
				var obj = {_value : value , _type: type};
				var item = {};
				item["payment_obligations_charges"] = obj;
				return item;
			}
			return null;
		},
		addItem: function(event)
		{
			console.debug("[Charges] addItem start");
			
			this.inherited(arguments);
			
			console.debug("[Charges] addItem end");
		},

		createItemsFromJson: function(jsonMsg)
		{
			console.debug("[Charges] createItemsFromJson start");
			
			this.inherited(arguments);
			
			console.debug("[Charges] createItemsFromJson end");
		}
	}
);