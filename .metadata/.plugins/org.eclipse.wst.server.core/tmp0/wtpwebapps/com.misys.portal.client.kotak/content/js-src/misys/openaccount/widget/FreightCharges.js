dojo.provide("misys.openaccount.widget.FreightCharges");
dojo.experimental("misys.openaccount.widget.FreightCharges"); 

dojo.require("misys.grid.GridMultipleItems");
dojo.require("misys.openaccount.widget.FreightCharge");

// our declared class
dojo.declare("misys.openaccount.widget.FreightCharges",
		[ misys.grid.GridMultipleItems ],
		// class properties:
		{
		data: { identifier: "store_id", label: "store_id", items: [] },
		templatePath: null,
		templateString: dojo.byId("freight-charges-template").innerHTML,
		dialogId: "freight-charge-dialog-template",
		xmlTagName: "freightCharges",
		xmlSubTagName: "freightCharge",
		
		gridColumns: ["type", "type_label", "other_type", "cur_code", "amt", "rate"],
        
		propertiesMap: {
			ref_id: {_fieldName: "ref_id"},
			allowance_id: {_fieldName: "allowance_id"},
			type: {_fieldName: "freight_charge_type"},
			type_label: {_fieldName: "freight_charge_type_label"},
			other_type: {_fieldName: "freight_charge_other_type"},
			cur_code: {_fieldName: "freight_charge_cur_code"},
			amt: {_fieldName: "freight_charge_amt"},
			rate: {_fieldName: "freight_charge_rate"}
			},

		layout: [
				{ name: "Freight Charge Type", field: "type_label", width: "35%" },
				{ name: "Ccy", field: "cur_code", width: "15%" },
				{ name: "Amount/Rate", get: misys.getAmountRate, width: "40%" },
				{ name: " ", field: "actions", formatter: misys.grid.formatReportActions, width: "10%" }/*,
				{ name: "Id", field: "store_id", headerStyles: "display:none", cellStyles: "display:none" }*/
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
				misys.disconnectById("freight_charge_amt");
				misys.disconnectById("freight_charge_rate");				
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
							if(dijit.byId("line_item_freight_charges") && dijit.byId("line_item_freight_charges").grid)
							{
							   setTimeout(dojo.hitch(misys, "computeLineItemAmount"), 1000);
							}
							else if(dijit.byId("po-freight-charges") && dijit.byId("po-freight-charges").grid)
							{
								setTimeout(dojo.hitch(misys, "computePOTotalAmount"), 1000);
							}
						}, "alertDialog");
			});
		},

		addItem: function(event)
		{
			console.debug("[Freight Charges] addItem start");
			if (this.id.match("^po-") == "po-" && misys.checkLineItemChildrens()){
				misys.dialog.show("ERROR", misys.getLocalization("tooManyPODetailsError"));
				return;
			} else if(this.id.match("^line_item_") == "line_item_" && misys.checkPOChildrens()){
				misys.dialog.show("ERROR", misys.getLocalization("tooManyPODetailsError"));
				return;
			}
			this.inherited(arguments);
			
			console.debug("[Freight Charges] addItem end");
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
			
			if(dijit.byId("line_item_freight_charges") && dijit.byId("line_item_freight_charges").grid)
			{
				misys.computeLineItemAmount();
			}
			
		    else if(dijit.byId("po-freight-charges") && dijit.byId("po-freight-charges").grid)
			{
				misys.computePOTotalAmount();
			}
			
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