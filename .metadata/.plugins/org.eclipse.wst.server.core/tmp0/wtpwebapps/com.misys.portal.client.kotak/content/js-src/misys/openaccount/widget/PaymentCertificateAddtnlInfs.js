dojo.provide("misys.openaccount.widget.PaymentCertificateAddtnlInfs");
dojo.experimental("misys.openaccount.widget.PaymentCertificateAddtnlInfs"); 

dojo.require("misys.grid.GridMultipleItems");
dojo.require("misys.openaccount.widget.PaymentCertificateAddtnlInf");

// our declared class
dojo.declare("misys.openaccount.widget.PaymentCertificateAddtnlInfs",
		[ misys.grid.GridMultipleItems ],
		// class properties:
		{
		data: { identifier: "store_id", label: "store_id", items: [] },
		templatePath: null,
		templateString: dojo.byId("payment-certificate-addtl-inf-template").innerHTML,
		dialogId: "payment-certificate-addtl-inf-dialog-template",
		xmlTagName: "",
		xmlSubTagName: "",
		
		gridColumns: ["payment_ceds_addtl_inf"],
        
		propertiesMap: {
			payment_ceds_addtl_inf: {_fieldName: "payment_ceds_addtl_inf"}
			},

		layout: [
				{ name: "AddtlInf", field: "payment_ceds_addtl_inf", width: "80%" },
				{ name: " ", field: "actions", formatter: misys.grid.formatReportActions, width: "20%" }
				],
        
		mandatoryFields: [],
        
		startup: function(){
			console.debug("[PaymentCertificateAddtnlInfs] startup start");
			
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
			console.debug("[PaymentCertificateAddtnlInfs] startup end");
		},
    	
		openDialogFromExistingItem: function(items, request)
		{
			console.debug("[PaymentCertificateAddtnlInfs] openDialogFromExistingItem start");
		
			this.inherited(arguments);
			
			console.debug("[PaymentCertificateAddtnlInfs] openDialogFromExistingItem end");
		},
		
		createItem: function()
		{
			if(this.hasChildren && this.hasChildren())
			{
				var type= 'misys.openaccount.widget.PaymentCertificateAddtnlInfs';
				var value= [];
				dojo.forEach(this.getChildren(), function(child){
					if (child.createItem)
					{
						value.push(child.createItem());
					}
				}, this);
				var obj = {_value : value , _type: type};
				var item = {};
				item["payment_certificate_ds_addtl_inf"] = obj;
				return item;
			}
			return null;
		},
		
		resetDialog: function(event)
		{
			console.debug("[PaymentCertificateAddtnlInfs] ResetDialog start");
			
			this.inherited(arguments);
			
			console.debug("[PaymentCertificateAddtnlInfs] ResetDialog end");
		},


		addItem: function(event)
		{
			console.debug("[PaymentCertificateAddtnlInfs] addItem start");
			
			this.inherited(arguments);
			
			console.debug("[PaymentCertificateAddtnlInfs] addItem end");
		},

		createItemsFromJson: function(jsonMsg)
		{
			console.debug("[PaymentCertificateAddtnlInfs] createItemsFromJson start");
			
			this.inherited(arguments);
			
			console.debug("[PaymentCertificateAddtnlInfs] createItemsFromJson end");
		},
		updateData: function(event)
		{
			console.debug("[PaymentCertificateAddtnlInfs] updateData start");
			
			this.inherited(arguments);
			
			console.debug("[PaymentCertificateAddtnlInfs] updateData end");
		},
		
		performValidation: function()
		{
			console.debug("[PaymentCertificateAddtnlInfs] validate start");
			if(this.validateDialog(true))
			{
				this.inherited(arguments);
			}
			
			console.debug("[PaymentCertificateAddtnlInfs] validate end");
		}
	}
);