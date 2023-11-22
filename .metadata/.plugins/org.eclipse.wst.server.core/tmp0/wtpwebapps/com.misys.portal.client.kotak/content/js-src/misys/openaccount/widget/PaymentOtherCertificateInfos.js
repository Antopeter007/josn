dojo.provide("misys.openaccount.widget.PaymentOtherCertificateInfos");
dojo.experimental("misys.openaccount.widget.PaymentOtherCertificateInfos"); 

dojo.require("misys.grid.GridMultipleItems");
dojo.require("misys.openaccount.widget.PaymentOtherCertificateInfo");

// our declared class
dojo.declare("misys.openaccount.widget.PaymentOtherCertificateInfos",
		[ misys.grid.GridMultipleItems ],
		// class properties:
		{
		data: { identifier: "store_id", label: "store_id", items: [] },
		templatePath: null,
		templateString: dojo.byId("pmt-other-cds-info-template")?dojo.byId("pmt-other-cds-info-template").innerHTML:"",
		dialogId: "pmt-other-cds-info-dialog-template",
		xmlTagName: "",
		xmlSubTagName: "",
		
		gridColumns: ["payment_other_cert_info"],
        
		propertiesMap: {
			payment_other_cert_info: {_fieldName: "payment_other_cert_info"}
			},

		layout: [
				{ name: "CertInfo", field: "payment_other_cert_info", width: "80%" },
				{ name: " ", field: "actions", formatter: misys.grid.formatReportActions, width: "20%" }
				],
        
		mandatoryFields: [],
        
		startup: function(){
			console.debug("[PaymentOtherCertificateInfos] startup start");
			
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
			console.debug("[PaymentOtherCertificateInfos] startup end");
		},
    	
		openDialogFromExistingItem: function(items, request)
		{
			console.debug("[PaymentOtherCertificateInfos] openDialogFromExistingItem start");
		
			this.inherited(arguments);
			
			console.debug("[PaymentOtherCertificateInfos] openDialogFromExistingItem end");
		},
		
		createItem: function()
		{
			if(this.hasChildren && this.hasChildren())
			{
				var type= 'misys.openaccount.widget.PaymentOtherCertificateInfos';
				var value= [];
				dojo.forEach(this.getChildren(), function(child){
					if (child.createItem)
					{
						value.push(child.createItem());
					}
				}, this);
				var obj = {_value : value , _type: type};
				var item = {};
				item["payment_other_cert_ds_info"] = obj;
				return item;
			}
			return null;
		},
		
		resetDialog: function(event)
		{
			console.debug("[PaymentOtherCertificateInfos] ResetDialog start");
			
			this.inherited(arguments);
			
			console.debug("[PaymentOtherCertificateInfos] ResetDialog end");
		},


		addItem: function(event)
		{
			console.debug("[PaymentOtherCertificateInfos] addItem start");
			
			this.inherited(arguments);
			
			console.debug("[PaymentOtherCertificateInfos] addItem end");
		},

		createItemsFromJson: function(jsonMsg)
		{
			console.debug("[PaymentOtherCertificateInfos] createItemsFromJson start");
			
			this.inherited(arguments);
			
			console.debug("[PaymentOtherCertificateInfos] createItemsFromJson end");
		},
		updateData: function(event)
		{
			console.debug("[PaymentOtherCertificateInfos] updateData start");
			
			this.inherited(arguments);
			
			console.debug("[PaymentOtherCertificateInfos] updateData end");
		},
		
		performValidation: function()
		{
			console.debug("[PaymentOtherCertificateInfos] validate start");
			if(this.validateDialog(true))
			{
				this.inherited(arguments);
			}
			
			console.debug("[PaymentOtherCertificateInfos] validate end");
		}
	}
);