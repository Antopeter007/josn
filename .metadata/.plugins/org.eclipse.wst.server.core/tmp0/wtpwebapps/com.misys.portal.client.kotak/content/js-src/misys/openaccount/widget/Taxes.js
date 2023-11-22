dojo.provide("misys.openaccount.widget.Taxes");
dojo.experimental("misys.openaccount.widget.Taxes");

dojo.require("misys.grid.GridMultipleItems");
dojo.require("misys.openaccount.widget.Tax");

// our declared class
dojo.declare(
	"misys.openaccount.widget.Taxes",
	[ misys.grid.GridMultipleItems ],
	// class properties:
	{
		data : {
			identifier : "store_id",
			label : "store_id",
			items : []
		},
		templatePath : null,
		templateString : dojo.byId("taxes-template").innerHTML,
		dialogId : "tax-dialog-template",
		xmlTagName : "taxes",
		xmlSubTagName : "tax",

		gridColumns : [ "type", "type_label" , "other_type", "cur_code", "amt",	"rate" ],

		propertiesMap : {
			tnx_id : {_fieldName: "tnx_id"},
			ref_id : {_fieldName: "ref_id"},
			allowance_id : {_fieldName: "allowance_id"},
			type : {_fieldName: "tax_type"},
			type_label : {_fieldName: "tax_type_label"},
			other_type : {_fieldName: "tax_other_type"},
			cur_code : {_fieldName: "tax_cur_code"},
			amt : {_fieldName: "tax_amt"},
			rate : {_fieldName: "tax_rate"}
		},

		layout : [ {
			name : "Tax Type",
			field : "type_label",
			width : "35%"
		}, {
			name : "Ccy",
			field : "cur_code",
			width : "15%"
		}, {
			name : "Amount/Rate",
			get : misys.getAmountRate,
			width : "40%"
		}, {
			name : " ",
			field : "actions",
			formatter : misys.grid.formatReportActions,
			width : "10%"
		}/*, {
			name : "Id",
			field : "store_id",
			headerStyles : "display:none",
			cellStyles : "display:none"
		}*/ ],

		getMandatoryProperties: function(item){
			var mandatoryProperties = [];
			mandatoryProperties.push("type");
			mandatoryProperties.push(item.amt == "" ? "rate" : "amt");
			return mandatoryProperties;
		},

		startup : function() {
			console.debug("[Taxes] startup start");

			// Prepare data store
			this.dataList = [];
			if (this.hasChildren()) {
				dojo.forEach(this.getChildren(), function(child) {
					// Mark the child as started.
						// This will prevent Dojo from parsing the
						// child
						// as we don't want to make it appear on the
						// form now.
						if (child.createItem) {
							var item = child.createItem();
							this.dataList.push(item);
						}
					}, this);
			}

			this.inherited(arguments);
			console.debug("[Taxes] startup end");
		},

		openDialogFromExistingItem : function(items, request) {
			console.debug("[Taxes] openDialogFromExistingItem start");

			// In view mode, disconnect events on amount and rate fields
			// as they are not properly rendered otherwise
			if (misys._config.displayMode === "view") {
				misys.disconnectById("tax_amt");
				misys.disconnectById("tax_rate");				
			}

			this.inherited(arguments);
			
			console.debug("[Taxes] openDialogFromExistingItem end");
		},
		
		resetDialog: function(event)
		{
			console.debug("[Adjustments] ResetDialog start");
			
			this.inherited(arguments);
			
			this.defaultTaxesCurrency();
			
			console.debug("[Adjustments] ResetDialog end");
		},

		defaultTaxesCurrency : function() {
			if(dijit.byId("total_cur_code")) {
				dijit.byId("tax_cur_code").set("value", dijit.byId("total_cur_code").get("value"));
			}
		},
		
		createDataGrid : function() {
			this.inherited(arguments);
			var grid = this.grid;
			misys.connect(grid, "onDelete",
					function(){
						misys.dialog.connect(dijit.byId("okButton"), "onMouseUp", function(){
							if(dijit.byId("line_item_taxes") && dijit.byId("line_item_taxes").grid)
							{
							   setTimeout(dojo.hitch(misys, "computeLineItemAmount"), 1000);
							}
							else if(dijit.byId("po-taxes") && dijit.byId("po-taxes").grid)
							{
								setTimeout(dojo.hitch(misys, "computePOTotalAmount"), 1000);
							}
							
						}, "alertDialog");
			});
		},

		addItem : function(event) {
			console.debug("[Taxes] addItem start");
			if (this.id.match("^po-") == "po-" && misys.checkLineItemChildrens()) {
				misys.dialog.show("ERROR", misys.getLocalization("tooManyPODetailsError"));
				return;
			} else if (this.id.match("^line_item_") == "line_item_" && misys.checkPOChildrens()) {
				misys.dialog.show("ERROR", misys.getLocalization("tooManyPODetailsError"));
				return;
			}
			this.inherited(arguments);

			console.debug("[Taxes] addItem end");
		},

		createItemsFromJson : function(jsonMsg) {
			console.debug("[Taxes] createItemsFromJson start");

			this.inherited(arguments);

			console.debug("[Taxes] createItemsFromJson end");
		},
		updateData: function(event)
		{
			console.debug("[Taxes] updateData start");
			
			this.inherited(arguments);
			
			if(dijit.byId("line_item_taxes") && dijit.byId("line_item_taxes").grid)
			{
				misys.computeLineItemAmount();
			}
			
		    else if(dijit.byId("po-taxes") && dijit.byId("po-taxes").grid)
			{
				misys.computePOTotalAmount();
			}
			
			console.debug("[Taxes] updateData end");
		},
		performValidation: function()
		{
			console.debug("[Taxes] validate start");
			if(this.validateDialog(true))
			{
				if(dijit.byId("tax_amt") && isNaN(dijit.byId("tax_amt").get("value")) && dijit.byId("tax_rate") && isNaN(dijit.byId("tax_rate").get("value")))
				{
					misys.dialog.show("ERROR", misys.getLocalization("addAmtOrRate"));
				}
				else
				{
					this.inherited(arguments);
				}
			}
			
			console.debug("[Taxes] validate end");
			misys.markFormDirty();
		}
	}
);