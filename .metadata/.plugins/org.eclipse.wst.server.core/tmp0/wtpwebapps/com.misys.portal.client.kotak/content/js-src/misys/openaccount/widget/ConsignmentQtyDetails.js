dojo.provide("misys.openaccount.widget.ConsignmentQtyDetails");
dojo.experimental("misys.openaccount.widget.ConsignmentQtyDetails"); 

dojo.require("misys.grid.GridMultipleItems");
dojo.require("misys.openaccount.widget.ConsignmentQtyDetail");

// our declared class
dojo.declare("misys.openaccount.widget.ConsignmentQtyDetails",
		[ misys.grid.GridMultipleItems ],
		// class properties:
		{
		data: { identifier: "store_id", label: "store_id", items: [] },
		templatePath: null,
		templateString: dojo.byId("consignment-qty-details-template").innerHTML,
		dialogId: "consignment-qty-details-template",
		xmlTagName: "",
		xmlSubTagName: "",
		
		gridColumns: ['pmt_tds_qty_unit_measr_code','pmt_tds_qty_unit_measr_other','pmt_tds_qty_val','type','type_label', 'other_type'],
        
		propertiesMap: {
			pmt_tds_qty_unit_measr_code: {_fieldName: "pmt_tds_qty_unit_measr_code"},
			pmt_tds_qty_unit_measr_other: {_fieldName: "pmt_tds_qty_unit_measr_other"},
			pmt_tds_qty_val: {_fieldName: "pmt_tds_qty_val"},
			type: {_fieldName: 'pmt_tds_qty_unit_measr_code'},
			type_label: {_fieldName: 'pmt_tds_qty_unit_measr_label'},
			other_type: {_fieldName: 'pmt_tds_qty_unit_measr_other'}
			},

		layout: [
				{ name: "Quantity", field: "type_label", get: misys.grid.formatOpenAccountProductType, width: "40%" },
				{ name: "Value", field: "pmt_tds_qty_val", width: "40%" },
				{ name: " ", field: "actions", formatter: misys.grid.formatReportActions, width: "10%" }/*,
				{ name: "Id", field: "store_id", headerStyles: "display:none", cellStyles: "display:none" }*/
				],
        
		mandatoryFields: [],
        
		startup: function(){
			console.debug("[ConsignmentQtyDetails] startup start");
			
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
			console.debug("[ConsignmentQtyDetails] startup end");
		},
    	
		openDialogFromExistingItem: function(items, request)
		{
			console.debug("[ConsignmentQtyDetails] openDialogFromExistingItem start");
			
			// In view mode, disconnect events on amount and rate fields
			// as they are not properly rendered otherwise
			/*if (misys._config.displayMode === "view") {
				misys.disconnectById("freight_charge_amt");
				misys.disconnectById("freight_charge_rate");				
			}*/

			this.inherited(arguments);
			
			console.debug("[ConsignmentQtyDetails] openDialogFromExistingItem end");
		},
		
		createItem: function()
		{
			if(this.hasChildren && this.hasChildren())
			{
				var type= 'misys.openaccount.widget.ConsignmentQtyDetails';
				var value= [];
				dojo.forEach(this.getChildren(), function(child){
					if (child.createItem)
					{
						value.push(child.createItem());
					}
				}, this);
				
				var obj = {_value : value , _type: type};
				var item = {};
				item["consignment_qty_details_id"] = obj;
				return item;
			}
			return null;
		},
		
		resetDialog: function(event)
		{
			console.debug("[ConsignmentQtyDetails] ResetDialog start");
			
			this.inherited(arguments);
			
			console.debug("[ConsignmentQtyDetails] ResetDialog end");
		},

		updateData : function()
		{
			console.debug("[ConsignmentQtyDetails] updateData start");
			this.inherited(arguments);
			//Disable Add Consignment Quantity button button, after transport data set is added.
			
			var widgetConsgQtyDs = dijit.byId("consignment_qty_details_id");
				widgetConsgQtyDs.addButtonNode.set("disabled", true);
			
			console.debug("[ConsignmentQtyDetails] updateData end");
		},

		addItem: function(event)
		{
			console.debug("[ConsignmentQtyDetails] addItem start");
			this.inherited(arguments);
			
			console.debug("[ConsignmentQtyDetails] addItem end");
		},
		
		createDataGrid: function()
		{
			this.inherited(arguments);
			var grid = this.grid;
			var widgetConsgQtyDs = dijit.byId("consignment_qty_details_id");
			misys.connect(grid, "onDelete",
					function(){
						misys.dialog.connect(dijit.byId("okButton"), "onMouseUp", function(){
							widgetConsgQtyDs.addButtonNode.set("disabled", false);
						}, "alertDialog");
			});
		},

		createItemsFromJson: function(jsonMsg)
		{
			console.debug("[ConsignmentQtyDetails] createItemsFromJson start");
			
			this.inherited(arguments);
			
			console.debug("[ConsignmentQtyDetails] createItemsFromJson end");
		},
		
		performValidation: function()
		{
			console.debug("[ConsignmentQtyDetails] validate start");
			if(this.validateDialog(true))
			{
				this.inherited(arguments);
			}
			
			console.debug("[ConsignmentQtyDetails] validate end");
		}
	}
);