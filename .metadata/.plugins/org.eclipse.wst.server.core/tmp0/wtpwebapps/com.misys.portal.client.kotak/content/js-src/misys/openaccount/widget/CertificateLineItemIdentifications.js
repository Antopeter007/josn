dojo.provide("misys.openaccount.widget.CertificateLineItemIdentifications");
dojo.experimental("misys.openaccount.widget.CertificateLineItemIdentifications"); 

dojo.require("misys.grid.GridMultipleItems");
dojo.require("misys.openaccount.widget.CertificateLineItemIdentification");

// our declared class
dojo.declare("misys.openaccount.widget.CertificateLineItemIdentifications",
		[ misys.grid.GridMultipleItems ],
		// class properties:
		{
		data: { identifier: "store_id", label: "store_id", items: [] },
		templatePath: null,
		templateString: dojo.byId("certificate-line-item-id-template").innerHTML,
		dialogId: "certificate-line-item-id-dialog-template",
		xmlTagName: "LineItemIds",
		xmlSubTagName: "LineItemId",
		
		gridColumns: ["ceds_line_item_id"],
        
		propertiesMap: {
			LineItmId: {_fieldName: "ceds_line_item_id"}
			},

		layout: [
				{ name: "Line Item Id", field: "ceds_line_item_id", width: "35%" },
				{ name: " ", field: "actions", formatter: misys.grid.formatReportActions, width: "10%" }/*,
				{ name: "Id", field: "store_id", headerStyles: "display:none", cellStyles: "display:none" }*/
				],
        
		mandatoryFields: [],
        
		startup: function(){
			console.debug("[CertificateLineItemIdentifications] startup start");
			
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
			console.debug("[CertificateLineItemIdentifications] startup end");
		},
		
		createItem: function()
		{
			if(this.hasChildren && this.hasChildren())
			{
				var type= 'misys.openaccount.widget.CertificateLineItemIdentifications';
				var value= [];
				dojo.forEach(this.getChildren(), function(child){
					if (child.createItem)
					{
						value.push(child.createItem());
					}
				}, this);
				var obj = {_value : value , _type: type};
				var item = {};
				item["certificate_dataset_line_item_id"] = obj;
				return item;
			}
			return null;
		},
    	
		openDialogFromExistingItem: function(items, request)
		{
			console.debug("[CertificateLineItemIdentifications] openDialogFromExistingItem start");
			
			this.inherited(arguments);
			
			console.debug("[CertificateLineItemIdentifications] openDialogFromExistingItem end");
		},
		
		resetDialog: function(event)
		{
			console.debug("[CertificateLineItemIdentifications] ResetDialog start");
			
			this.inherited(arguments);
			
			console.debug("[CertificateLineItemIdentifications] ResetDialog end");
		},


		addItem: function(event)
		{
			console.debug("[CertificateLineItemIdentifications] addItem start");
			this.inherited(arguments);
			
			console.debug("[CertificateLineItemIdentifications] addItem end");
		},

		createItemsFromJson: function(jsonMsg)
		{
			console.debug("[CertificateLineItemIdentifications] createItemsFromJson start");
			
			this.inherited(arguments);
			
			console.debug("[CertificateLineItemIdentifications] createItemsFromJson end");
		},
		updateData: function(event)
		{
			console.debug("[CertificateLineItemIdentifications] updateData start");
			
			this.inherited(arguments);
			
			console.debug("[CertificateLineItemIdentifications] updateData end");
		}
	}
);