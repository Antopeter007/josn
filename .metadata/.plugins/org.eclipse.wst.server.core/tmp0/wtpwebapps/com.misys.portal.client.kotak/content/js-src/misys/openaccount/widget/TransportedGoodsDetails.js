dojo.provide("misys.openaccount.widget.TransportedGoodsDetails");
dojo.experimental("misys.openaccount.widget.TransportedGoodsDetails"); 

dojo.require("misys.grid.GridMultipleItems");
dojo.require("misys.openaccount.widget.TransportedGoodsDetail");

// our declared class
dojo.declare("misys.openaccount.widget.TransportedGoodsDetails",
		[ misys.grid.GridMultipleItems ],
		// class properties:
		{
		data: { identifier: "store_id", label: "store_id", items: [] },
		templatePath: null,
		templateString: dojo.byId("transported-goods-template").innerHTML,
		dialogId: "transported-goods-template",
		xmlTagName: "",
		xmlSubTagName: "",
		
		gridColumns: ["payment_tds_po_ref_id","payment_tds_po_iss_date","payment_tds_goods_desc"],
        
		propertiesMap: {
			payment_tds_po_ref_id: {_fieldName: "payment_tds_po_ref_id"},
			payment_tds_po_iss_date:{_fieldName: "payment_tds_po_iss_date"},
			payment_tds_goods_desc: {_fieldName: "payment_tds_goods_desc"}
			},

		layout: [
				{ name: "Purchase Order Reference", field: "payment_tds_po_ref_id", width: "35%" },
				{ name: "Purchase Order Issue Date", field: "payment_tds_po_iss_date", width: "20%" },
				{ name: "Goods Description", field: "payment_tds_goods_desc", width: "35%" },
				{ name: " ", field: "actions", formatter: misys.grid.formatReportActions, width: "10%" }/*,
				{ name: "Id", field: "store_id", headerStyles: "display:none", cellStyles: "display:none" }*/
				],
        
		mandatoryFields: [],
        
		startup: function(){
			console.debug("[TransportedGoodsDetails] startup start");
			
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
			console.debug("[TransportedGoodsDetails] startup end");
		},
    	
		openDialogFromExistingItem: function(items, request)
		{
			console.debug("[TransportedGoodsDetails] openDialogFromExistingItem start");
			
			// In view mode, disconnect events on amount and rate fields
			// as they are not properly rendered otherwise
			/*if (misys._config.displayMode === "view") {
				misys.disconnectById("freight_charge_amt");
				misys.disconnectById("freight_charge_rate");				
			}*/

			this.inherited(arguments);
			
			console.debug("[TransportedGoodsDetails] openDialogFromExistingItem end");
		},
		
		createItem: function()
		{
			if(this.hasChildren && this.hasChildren())
			{
				var type= 'misys.openaccount.widget.TransportedGoodsDetails';
				var value= [];
				dojo.forEach(this.getChildren(), function(child){
					if (child.createItem)
					{
						value.push(child.createItem());
					}
				}, this);
				var obj = {_value : value , _type: type};
				var item = {};
				item["payment_tds_dataset_transported_goods"] = obj;
				return item;
			}
			return null;
		},
		
		resetDialog: function(event)
		{
			console.debug("[TransportedGoodsDetails] ResetDialog start");
			
			this.inherited(arguments);
			
			console.debug("[TransportedGoodsDetails] ResetDialog end");
		},


		addItem: function(event)
		{
			console.debug("[TransportedGoodsDetails] addItem start");
			this.inherited(arguments);
			
			console.debug("[TransportedGoodsDetails] addItem end");
		},

		createItemsFromJson: function(jsonMsg)
		{
			console.debug("[TransportedGoodsDetails] createItemsFromJson start");
			
			this.inherited(arguments);
			
			console.debug("[TransportedGoodsDetails] createItemsFromJson end");
		},
		
		performValidation: function()
		{
			console.debug("[TransportedGoodsDetails] validate start");
			if(this.validateDialog(true))
			{
				this.inherited(arguments);
			}
			
			console.debug("[TransportedGoodsDetails] validate end");
		}
	}
);