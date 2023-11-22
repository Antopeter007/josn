dojo.provide("misys.openaccount.widget.PaymentTransportFreightCharges");
dojo.experimental("misys.openaccount.widget.PaymentTransportFreightCharges"); 

dojo.require("misys.grid.GridMultipleItems");
dojo.require("misys.openaccount.FormOpenAccountEvents");
dojo.require("misys.openaccount.widget.PaymentTransportFreightCharge");

// our declared class
dojo.declare("misys.openaccount.widget.PaymentTransportFreightCharges",
		[ misys.grid.GridMultipleItems ],
		// class properties:
		{
		data: { identifier: "store_id", label: "store_id", items: [] },
		templatePath: null,
		templateString: dojo.byId("payment-transport-freight-charges-template").innerHTML,
		dialogId: "payment-transport-freight-charge-dialog-template",
		xmlTagName: "freightCharges",
		xmlSubTagName: "freightCharge",
		
		gridColumns: ["type", "type_label", "other_type", "cur_code", "amt","type_hidden"],
        
		propertiesMap: {
			type: {_fieldName: "payment_transport_freight_charge_type"},
			type_label: {_fieldName: "payment_transport_freight_charge_type_label"},
			other_type: {_fieldName: "payment_transport_freight_charge_other_type"},
			cur_code: {_fieldName: "payment_transport_freight_charge_cur_code"},
			amt: {_fieldName: "payment_transport_freight_charge_amt"},
			type_hidden: {_fieldName: "type_hidden"}
			},

		layout: [
				{ name: "Freight Charge Type", get: misys.getTransportFreightChargesType, field: "type_hidden", width: "35%" },
				{ name: "Ccy", field: "cur_code", width: "15%" },
				{ name: "Amount", get: misys.getFreightAmount, width: "40%" },
				{ name: " ", field: "actions", formatter: misys.grid.formatReportActions, width: "10%" }
				],
        
		mandatoryFields: ["type"],
        
		startup: function(){
			console.debug("[Freight Charges] startup start");
			
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
			console.debug("[Freight Charges] startup end");
		},
    	
		openDialogFromExistingItem: function(items, request)
		{
			console.debug("[Freight Charges] openDialogFromExistingItem start");
			
			// In view mode, disconnect events on amount and rate fields
			// as they are not properly rendered otherwise
			if (misys._config.displayMode === "view") {
				misys.disconnectById("payment_transport_freight_charge_amt");
			}

			this.inherited(arguments);
			
			console.debug("[Freight Charges] openDialogFromExistingItem end");
		},
		
		resetDialog: function(event)
		{
			console.debug("[Adjustments] ResetDialog start");
			
			this.inherited(arguments);
			
			this.defaultFreightCharges();
			
			console.debug("[Adjustments] ResetDialog end");
		},

		defaultFreightCharges : function() {
			if(dijit.byId("total_cur_code")) {
				dijit.byId("freight_charge_cur_code").set("value", dijit.byId("total_cur_code").get("value"));
			}
		},
		
		createDataGrid: function()
		{
			this.inherited(arguments);
			var grid = this.grid;
			misys.connect(grid, "onDelete",
					function(){
						misys.dialog.connect(dijit.byId("okButton"), "onMouseUp", function(){
							setTimeout(dojo.hitch(misys, "computeLineItemAmount"), 1000);
						}, "alertDialog");
			});
		},


		createItemsFromJson: function(jsonMsg)
		{
			console.debug("[Freight Charges] createItemsFromJson start");
			
			this.inherited(arguments);
			
			console.debug("[Freight Charges] createItemsFromJson end");
		},
		updateData: function(event)
		{
			console.debug("[Freight Charges] updateData start");
			
			this.inherited(arguments);
			
			misys.computeLineItemAmount();
			
			console.debug("[Freight Charges] updateData end");
			misys.markFormDirty();
		},
		performValidation: function()
		{
			console.debug("[Freight Charges] validate start");
			if(this.validateDialog(true))
			{
				if(dijit.byId("freight_charge_amt") && isNaN(dijit.byId("freight_charge_amt").get("value")) && dijit.byId("freight_charge_rate") && isNaN(dijit.byId("freight_charge_rate").get("value")))
				{
					misys.dialog.show("ERROR", misys.getLocalization("addAmtOrRate"));
				}
				else
				{
					this.inherited(arguments);
				}
			}
			
			console.debug("[Freight Charges] validate end");
		}
	}
);