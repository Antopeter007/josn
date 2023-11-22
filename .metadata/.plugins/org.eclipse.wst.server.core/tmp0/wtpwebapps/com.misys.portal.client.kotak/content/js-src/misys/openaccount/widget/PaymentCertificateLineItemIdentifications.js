dojo.provide("misys.openaccount.widget.PaymentCertificateLineItemIdentifications");
dojo.experimental("misys.openaccount.widget.PaymentCertificateLineItemIdentifications"); 

dojo.require("misys.grid.GridMultipleItems");
dojo.require("misys.openaccount.widget.PaymentCertificateLineItemIdentification");

// our declared class
dojo.declare("misys.openaccount.widget.PaymentCertificateLineItemIdentifications",
		[ misys.grid.GridMultipleItems ],
		// class properties:
		{
		data: { identifier: "store_id", label: "store_id", items: [] },
		templatePath: null,
		templateString: dojo.byId("payment-certificate-line-item-id-template").innerHTML ? dojo.byId("payment-certificate-line-item-id-template").innerHTML : "",
		dialogId: "payment-certificate-line-item-id-dialog-template",
		xmlTagName: "",
		xmlSubTagName: "",
		
		gridColumns: ["payment_ceds_line_item_id"],
        
		propertiesMap: {
			payment_ceds_line_item_id: {_fieldName: "payment_ceds_line_item_id"}
			},

		layout: [
				{ name: "LineItmId", field: "payment_ceds_line_item_id", width: "35%" },
				{ name: " ", field: "actions", formatter: misys.grid.formatReportActions, width: "10%" }
				],
        
		mandatoryFields: [],
        
		startup: function(){
			console.debug("[PaymentCertificateLineItemIdentifications] startup start");
			
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
			
			console.debug("[PaymentCertificateLineItemIdentifications] startup end");
		},
    	
		openDialogFromExistingItem: function(items, request)
		{
			console.debug("[PaymentCertificateLineItemIdentifications] openDialogFromExistingItem start");
		
			this.inherited(arguments);
			
			console.debug("[PaymentCertificateLineItemIdentifications] openDialogFromExistingItem end");
		},
		
		createItem: function()
		{
			if(this.hasChildren && this.hasChildren())
			{
				var type= 'misys.openaccount.widget.PaymentCertificateLineItemIdentifications';
				var value= [];
				dojo.forEach(this.getChildren(), function(child){
					if (child.createItem)
					{
						value.push(child.createItem());
					}
				}, this);
				var obj = {_value : value , _type: type};
				var item = {};
				item["line_item_id_payment_certificate"] = obj;
				return item;
			}
			return null;
		},
		
		resetDialog: function(event)
		{
			console.debug("[PaymentCertificateLineItemIdentifications] ResetDialog start");
			
			this.inherited(arguments);
			
			console.debug("[PaymentCertificateLineItemIdentifications] ResetDialog end");
		},


		addItem: function(event)
		{
			console.debug("[PaymentCertificateLineItemIdentifications] addItem start");
			
			this.inherited(arguments);
			
			console.debug("[PaymentCertificateLineItemIdentifications] addItem end");
		},

		createItemsFromJson: function(jsonMsg)
		{
			console.debug("[PaymentCertificateLineItemIdentifications] createItemsFromJson start");
			
			this.inherited(arguments);
			
			console.debug("[PaymentCertificateLineItemIdentifications] createItemsFromJson end");
		},
		checkDialog: function()
		{
			console.debug("[PaymentCertificateLineItemIdentifications] checkDialog start");
			if(!this.dialog)
			{
				var dialogWidget = dijit.byId(this.dialogId); 
				if(dialogWidget)
				{
					this.dialog = dialogWidget; 
				}
				else
				{
					var id = this.dialogId ? this.dialogId : 'dialog-' +
							dojox.uuid.generateRandomUuid();
					var dojoClass = this.dialogClassName ? this.dialogClassName : 'misys.widget.Dialog';
		    		this.dialog = dojo.eval("new " + dojoClass + "({}, dojo.byId('" + id + "'))");
		    		this.dialog.set("refocus", false);
		    		this.dialog.set("draggable", false);
		    		dojo.addClass(this.dialog.domNode, "multipleItemDialog");
		    		this.dialog.startup();
		    		document.body.appendChild(this.dialog.domNode);
				}
			}
			console.debug("[PaymentCertificateLineItemIdentifications] checkDialog end");
			
			return this.dialog;
		},
		updateData: function(event)
		{
			console.debug("[PaymentCertificateLineItemIdentifications] updateData start");
			
			this.inherited(arguments);
			
			console.debug("[PaymentCertificateLineItemIdentifications] updateData end");
		},
		
		performValidation: function()
		{
			console.debug("[PaymentCertificateLineItemIdentifications] validate start");
			
			if(this.validateDialog(true))
			{
				this.inherited(arguments);
			}
			console.debug("[PaymentCertificateLineItemIdentifications] validate end");
		}
	}
);