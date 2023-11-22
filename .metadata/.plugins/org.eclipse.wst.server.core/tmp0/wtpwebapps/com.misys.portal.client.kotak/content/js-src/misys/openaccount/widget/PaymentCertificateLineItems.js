dojo.provide("misys.openaccount.widget.PaymentCertificateLineItems");
dojo.experimental("misys.openaccount.widget.PaymentCertificateLineItems"); 

dojo.require("misys.grid.GridMultipleItems");
dojo.require("misys.openaccount.widget.PaymentCertificateLineItem");
dojo.require("misys.openaccount.widget.PaymentCertificateLineItemIdentifications");

// our declared class
dojo.declare("misys.openaccount.widget.PaymentCertificateLineItems",
		[ misys.grid.GridMultipleItems ],
		// class properties:
		{
		data: { identifier: "store_id", label: "store_id", items: [] },
		templatePath: null,
		templateString: dojo.byId("payment-certificate-line-item-template").innerHTML,
		dialogId: "payment-certificate-line-item-dialog-template",
		xmlTagName: "",
		xmlSubTagName: "",
		
		gridColumns: ["purchaseOrderRefId","purchaseOrderIssDate", "line_item_id_payment_certificate"],
        
		propertiesMap: {
						purchaseOrderRefId: {_fieldName: "purchaseOrderRefId"},
						purchaseOrderIssDate: {_fieldName: "purchaseOrderIssDate"},
						line_item_id_payment_certificate: {_fieldName: "line_item_id_payment_certificate", _type: 'misys.openaccount.widget.PaymentCertificateLineItemIdentifications'}
			},

		layout: [
				{ name: 'PO Ref Id', field: "purchaseOrderRefId", width: "25%" },
				{ name: 'PO Issue Date', field: "purchaseOrderIssDate", width: "25%" },
				{ name: ' ', field: "actions", formatter: misys.grid.formatReportActions, width: "10%" },
				{ name: "Id", field: "store_id", headerStyles: "display:none", cellStyles: "display:none" }
				],
				
			lineItemMap :{
				paymentLineItemMap: {_fieldName: "line_item_payment_certificate"}
			},
			
			lineItemIdMap :{
				paymentLineItemIdMap: {_fieldName: "line_item_id_payment_certificate"}
			},
				
		typeMap: {
			'misys.openaccount.widget.PaymentCertificateLineItemIdentifications' : {
				'type': Array,
				'deserialize': function(value) {
					var item = {};
					item._type = 'misys.openaccount.widget.PaymentCertificateLineItemIdentifications';
					item._values = value;
					return item;
				}
			}
		},
        
		mandatoryFields: ["purchaseOrderRefId","purchaseOrderIssDate"],
        
		startup: function(){
			console.debug("[PaymentCertificateLineItems] startup start");
			
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
			console.debug("[PaymentCertificateLineItems] startup end");
		},
    	
		openDialogFromExistingItem: function(items, request)
		{
			console.debug("[PaymentCertificateLineItems] openDialogFromExistingItem start");
			
			this.inherited(arguments);
			
			console.debug("[PaymentCertificateLineItems] openDialogFromExistingItem end");
		},
		
		createItem: function()
		{
			if(this.hasChildren && this.hasChildren())
			{
				var type= 'misys.openaccount.widget.PaymentCertificateLineItems';
				var value= [];
				dojo.forEach(this.getChildren(), function(child){
					if (child.createItem)
					{
						value.push(child.createItem());
					}
				}, this);
				var obj = {_value : value , _type: type};
				var item = {};
				item["line_item_payment_certificate"] = obj;
				return item;
			}
			return null;
		},
		
		createJsonItem: function()
		{
			var jsonEntry = [];
			if(this.hasChildren && this.hasChildren())
			{
				dojo.forEach(this.getChildren(), function(child){
					if (child.createItem)
					{
						var item = child.createItem();
						jsonEntry.push(item);
						if (this.get("is_valid") !== "N")
						{
							this.set("is_valid", item.is_valid ? item.is_valid : "Y");
						}
						misys._widgetsToDestroy = misys._widgetsToDestroy || [];
						misys._widgetsToDestroy.push(child.id);
					}
				}, this);
			}
			return jsonEntry;
			
		},
		
		resetDialog: function(event)
		{
			console.debug("[PaymentCertificateLineItems] ResetDialog start");
			
			this.inherited(arguments);
			
			console.debug("[PaymentCertificateLineItems] ResetDialog end");
		},


		addItem: function(event)
		{
			console.debug("[PaymentCertificateLineItems] addItem start");
			
			this.inherited(arguments);
			
			console.debug("[PaymentCertificateLineItems] addItem end");
		},

		createItemsFromJson: function(jsonMsg)
		{
			console.debug("[PaymentCertificateLineItems] createItemsFromJson start");
			
			this.inherited(arguments);
			
			console.debug("[PaymentCertificateLineItems] createItemsFromJson end");
		},
		updateData: function(event)
		{
			console.debug("[PaymentCertificateLineItems] updateData start");
			
			this.inherited(arguments);
			
			console.debug("[PaymentCertificateLineItems] updateData end");
		},
		
		performValidation: function()
		{
			console.debug("[PaymentCertificateLineItems] validate start");
			
			if(this.validateDialog(true))
			{
				this.inherited(arguments);
			}
			
			console.debug("[PaymentCertificateLineItems] validate end");
		}
	}
);