dojo.provide("misys.openaccount.widget.ConsignmentVolDetails");
dojo.experimental("misys.openaccount.widget.ConsignmentVolDetails"); 

dojo.require("misys.grid.GridMultipleItems");
dojo.require("misys.openaccount.widget.ConsignmentVolDetail");

// our declared class
dojo.declare("misys.openaccount.widget.ConsignmentVolDetails",
		[ misys.grid.GridMultipleItems ],
		// class properties:
		{
		data: { identifier: "store_id", label: "store_id", items: [] },
		templatePath: null,
		templateString: dojo.byId("consignment-vol-details-template").innerHTML,
		dialogId: "consignment-vol-details-template",
		xmlTagName: "",
		xmlSubTagName: "",
		
		gridColumns: ['pmt_tds_vol_unit_measr_code','pmt_tds_vol_unit_measr_other','pmt_tds_vol_val','type','type_label', 'other_type'],
        
		propertiesMap: {
			pmt_tds_vol_unit_measr_code: {_fieldName: "pmt_tds_vol_unit_measr_code"},
			pmt_tds_vol_unit_measr_other: {_fieldName: "pmt_tds_vol_unit_measr_other"},
			pmt_tds_vol_val: {_fieldName: "pmt_tds_vol_val"},
			type: {_fieldName: 'pmt_tds_vol_unit_measr_code'},
			type_label: {_fieldName: 'pmt_tds_vol_unit_measr_label'},
			other_type: {_fieldName: 'pmt_tds_vol_unit_measr_other'}
			},

		layout: [
				{ name: "Quantity", field: "type_label", get: misys.grid.formatOpenAccountProductType, width: "40%" },
				{ name: "Value", field: "pmt_tds_vol_val", width: "40%" },
				{ name: " ", field: "actions", formatter: misys.grid.formatReportActions, width: "10%" }/*,
				{ name: "Id", field: "store_id", headerStyles: "display:none", cellStyles: "display:none" }*/
				],
        
		mandatoryFields: [],
        
		startup: function(){
			console.debug("[ConsignmentVolDetails] startup start");
			
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
			console.debug("[ConsignmentVolDetails] startup end");
		},
    	
		openDialogFromExistingItem: function(items, request)
		{
			console.debug("[ConsignmentVolDetails] openDialogFromExistingItem start");
			
			// In view mode, disconnect events on amount and rate fields
			// as they are not properly rendered otherwise
			/*if (misys._config.displayMode === "view") {
				misys.disconnectById("freight_charge_amt");
				misys.disconnectById("freight_charge_rate");				
			}*/

			this.inherited(arguments);
			
			console.debug("[ConsignmentVolDetails] openDialogFromExistingItem end");
		},
		
		createItem: function()
		{
			if(this.hasChildren && this.hasChildren())
			{
				var type= 'misys.openaccount.widget.ConsignmentVolDetails';
				var value= [];
				dojo.forEach(this.getChildren(), function(child){
					if (child.createItem)
					{
						value.push(child.createItem());
					}
				}, this);
				var obj = {_value : value , _type: type};
				var item = {};
				item["consignment_vol_details_id"] = obj;
				return item;
			}
			return null;
		},
		
		resetDialog: function(event)
		{
			console.debug("[ConsignmentVolDetails] ResetDialog start");
			
			this.inherited(arguments);
			
			console.debug("[ConsignmentVolDetails] ResetDialog end");
		},
		
		updateData : function()
		{
			console.debug("[ConsignmentVolDetails] updateData start");
			this.inherited(arguments);
			var grid = this.grid;
			var widgetConsgVolDs = dijit.byId("consignment_vol_details_id");
				widgetConsgVolDs.addButtonNode.set("disabled", true);		
			
			console.debug("[ConsignmentVolDetails] updateData end");
		},

		addItem: function(event)
		{
			console.debug("[ConsignmentVolDetails] addItem start");
			this.inherited(arguments);
			
			console.debug("[ConsignmentVolDetails] addItem end");
		},
		
		createDataGrid: function()
		{
			this.inherited(arguments);
			var grid = this.grid;
			var widgetConsgVolDs = dijit.byId("consignment_vol_details_id");
			misys.connect(grid, "onDelete",
					function(){
						misys.dialog.connect(dijit.byId("okButton"), "onMouseUp", function(){
							widgetConsgVolDs.addButtonNode.set("disabled", false);
						}, "alertDialog");
			});
		},

		createItemsFromJson: function(jsonMsg)
		{
			console.debug("[ConsignmentVolDetails] createItemsFromJson start");
			
			this.inherited(arguments);
			
			console.debug("[ConsignmentVolDetails] createItemsFromJson end");
		},
		
		performValidation: function()
		{
			console.debug("[ConsignmentVolDetails] validate start");
			if(this.validateDialog(true))
			{
				this.inherited(arguments);
			}
			
			console.debug("[ConsignmentVolDetails] validate end");
		}
	}
);