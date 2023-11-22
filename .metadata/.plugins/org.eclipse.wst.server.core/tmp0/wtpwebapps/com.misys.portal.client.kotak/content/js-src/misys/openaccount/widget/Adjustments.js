dojo.provide("misys.openaccount.widget.Adjustments");
dojo.experimental("misys.openaccount.widget.Adjustments"); 

dojo.require("misys.grid.GridMultipleItems");
dojo.require("misys.openaccount.widget.Adjustment");

// our declared class
dojo.declare("misys.openaccount.widget.Adjustments",
		[ misys.grid.GridMultipleItems ],
		// class properties:
		{
		data: { identifier: "store_id", label: "store_id", items: [] },
		
		templatePath: null,
		templateString: dojo.byId("adjustments-template").innerHTML,
		dialogId: "adjustment-dialog-template",
		xmlTagName: "adjustments",
		xmlSubTagName: "adjustment",
		
		gridColumns: ["type", "type_label", "other_type", "direction", "cur_code", "amt", "rate", "cn_reference_id", "discount_exp_date", "type_hidden"],
        
		propertiesMap: {
			tnx_id: {_fieldName: "tnx_id"},
			ref_id: {_fieldName: "ref_id"},
			allowance_id: {_fieldName: "allowance_id"},
			type: {_fieldName: "adjustment_type"},
			type_label: {_fieldName: "adjustment_type_label"},
			other_type: {_fieldName: "adjustment_other_type"},
			direction: {_fieldName: "adjustment_direction"},
			direction_label: {_fieldName: "adjustment_direction_label"},
			cur_code: {_fieldName: "adjustment_cur_code"},
			amt: {_fieldName: "adjustment_amt"},
			rate: {_fieldName: "adjustment_rate"},
			type_hidden: {_fieldName: "type_hidden"},
			cn_reference_id : {_fieldName: "cn_reference_id"},
			discount_exp_date : {_fieldName: "discount_exp_date"}
			},

		layout: [
				{ name: "Adjustment Type", field: "type" , get: misys.getAdjustmentType, width: "35%" },
				{ name: "Ccy", field: "cur_code", width: "15%" },
				{ name: "Amount/Rate", field:"amt", get: misys.getAdjustmentAmountRate, width: "40%" },
				{ name: " ", field: "actions", formatter: misys.grid.formatReportActions, width: "10%" }
				],
        
		getMandatoryProperties: function(item){
			var mandatoryProperties = [];
			mandatoryProperties.push("type");
			if (item && item.amt == "" && item.rate == "")
			{
				mandatoryProperties.push("amt");
				mandatoryProperties.push("cur_code");
			}
			return mandatoryProperties;
		},
    	
		openDialogFromExistingItem: function(items, request)
		{
			console.debug("[Adjustments] openDialogFromExistingItem start");
			
			// In view mode, disconnect events on amount and rate fields
			// as they are not properly rendered otherwise
			if (misys._config.displayMode === "view") {
				misys.disconnectById("adjustment_amt");
				misys.disconnectById("adjustment_rate");				
			}
			
			if(items && items[0] && items[0].other_type && items[0].other_type[0])
			{
				items[0].other_type[0] = dojox.html.entities.decode(items[0].other_type[0], dojox.html.entities.html);
			}
			
			this.inherited(arguments);
			
			console.debug("[Adjustments] openDialogFromExistingItem end");
		},
		
		defaultAdjustmentCurrency : function() {
			if(dijit.byId("total_cur_code")) {
				dijit.byId("adjustment_cur_code").set("value", dijit.byId("total_cur_code").get("value"));
			}
		},
		
		createDataGrid: function()
		{
			this.inherited(arguments);
			var grid = this.grid;
			misys.connect(grid, "onDelete",
				function(){
					misys.dialog.connect(dijit.byId("okButton"), "onMouseUp", function(){
						if(dijit.byId("line_item_adjustments") && dijit.byId("line_item_adjustments").grid)
						{
						   setTimeout(dojo.hitch(misys, "computeLineItemAmount"), 1000);
						}
						else if(dijit.byId("po-adjustments") && dijit.byId("po-adjustments").grid)
						{
							setTimeout(dojo.hitch(misys, "computePOTotalAmount"), 1000);
						}
					}, "alertDialog");
			});
		},

		resetDialog: function(event)
		{
			console.debug("[Adjustments] ResetDialog start");
			
			this.inherited(arguments);
			
			this.defaultAdjustmentCurrency();
			
			console.debug("[Adjustments] ResetDialog end");
		},
		
		
		addItem: function(event)
		{
			console.debug("[Adjustments] addItem start");
			if (this.id.match("^po-") == "po-" && misys.checkLineItemChildrens()){
				misys.dialog.show("ERROR", misys.getLocalization("tooManyPODetailsError"));
				return;
			} else if(this.id.match("^line_item_") == "line_item_" && misys.checkPOChildrens()){
				misys.dialog.show("ERROR", misys.getLocalization("tooManyPODetailsError"));
				return;
			}
			this.inherited(arguments);
			
			console.debug("[Adjustments] addItem end");
		},

		updateData: function(event)
		{
			console.debug("[Adjustments] updateData start");
			
			this.inherited(arguments);
			
			if(dijit.byId("line_item_adjustments") && dijit.byId("line_item_adjustments").grid)
			{
				misys.computeLineItemAmount();
			    
			}
		    else if(dijit.byId("po-adjustments") && dijit.byId("po-adjustments").grid)
			{
				misys.computePOTotalAmount();
			}
			
			console.debug("[Adjustments] updateData end");
			misys.markFormDirty();
		},
		
		performValidation: function()
		{
			console.debug("[Adjustments] validate start");
			
			var currentdate = new Date();
			
			if(this.validateDialog(true))
			{
				if(dijit.byId("adjustment_amt") && isNaN(dijit.byId("adjustment_amt").get("value")) && dijit.byId("adjustment_rate") && isNaN(dijit.byId("adjustment_rate").get("value")))
				{
					misys.dialog.show("ERROR", misys.getLocalization("addAmtOrRate"));
				}
				else if(dijit.byId("adjustment_direction_1").get("checked")!== true && dijit.byId("adjustment_direction_2").get("checked")!== true ){
						misys.dialog.show("ERROR", misys.getLocalization("selectAdjustmentDirectionError"));
					
				}
				else if(dijit.byId("discount_exp_date") && (dijit.byId("discount_exp_date").get("value")== null || dijit.byId("discount_exp_date").get("value") =="") && dijit.byId("adjustment_type") && dijit.byId("adjustment_type").get("value") == "DISC")
				{
					misys.dialog.show("ERROR", misys.getLocalization("expiryDateMandatoryError"));
				}
				else if(dijit.byId("discount_exp_date") && dijit.byId("discount_exp_date").get("value")!= null && dijit.byId("discount_exp_date").get("value")!="" &&  currentdate.setHours(0, 0, 0, 0) > (dijit.byId("discount_exp_date").get("value")).setHours(0, 0, 0, 0))
				{
					misys.dialog.show("ERROR", misys.getLocalization("selectExpiryDateError"));
				}
				else
				{
					this.inherited(arguments);
				}
			}
			
			console.debug("[Adjustments] validate end");
		}
	}
);
