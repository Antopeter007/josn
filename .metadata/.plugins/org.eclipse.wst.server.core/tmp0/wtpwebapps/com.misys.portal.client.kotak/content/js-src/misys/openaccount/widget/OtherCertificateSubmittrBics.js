dojo.provide("misys.openaccount.widget.OtherCertificateSubmittrBics");
dojo.experimental("misys.openaccount.widget.OtherCertificateSubmittrBics"); 

dojo.require("misys.grid.GridMultipleItems");
dojo.require("misys.openaccount.widget.OtherCertificateSubmittrBic");

// our declared class
dojo.declare("misys.openaccount.widget.OtherCertificateSubmittrBics",
		[ misys.grid.GridMultipleItems ],
		// class properties:
		{
		data: { identifier: "store_id", label: "store_id", items: [] },
		templatePath: null,
		templateString: dojo.byId("other-certificate-bic-template").innerHTML,
		dialogId: "other-certificate-bic-dialog-template",
		xmlTagName: "BICs",
		xmlSubTagName: "BIC",
		
		gridColumns: ["ocds_bic"],
        
		propertiesMap: {
			BIC: {_fieldName: "ocds_bic"}
			},

		layout: [
				{ name: "BIC", field: "ocds_bic", width: "35%" },
				{ name: " ", field: "actions", formatter: misys.grid.formatReportActions, width: "10%" }/*,
				{ name: "Id", field: "store_id", headerStyles: "display:none", cellStyles: "display:none" }*/
				],
        
		mandatoryFields: [],
        
		startup: function(){
			console.debug("[OtherCertificateSubmittrBics] startup start");
			
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
			console.debug("[OtherCertificateSubmittrBics] startup end");
		},
		
		createItem: function()
		{
			if(this.hasChildren && this.hasChildren())
			{
				var type= 'misys.openaccount.widget.OtherCertificateSubmittrBics';
				var value= [];
				dojo.forEach(this.getChildren(), function(child){
					if (child.createItem)
					{
						value.push(child.createItem());
					}
				}, this);
				var obj = {_value : value , _type: type};
				var item = {};
				item["other_certificate_dataset_bic"] = obj;
				return item;
			}
			return null;
		},
    	
		openDialogFromExistingItem: function(items, request)
		{
			console.debug("[OtherCertificateSubmittrBics] openDialogFromExistingItem start");
			
			this.inherited(arguments);
			
			console.debug("[OtherCertificateSubmittrBics] openDialogFromExistingItem end");
		},
		
		resetDialog: function(event)
		{
			console.debug("[OtherCertificateSubmittrBics] ResetDialog start");
			
			this.inherited(arguments);
			
			
			console.debug("[OtherCertificateSubmittrBics] ResetDialog end");
		},


		addItem: function(event)
		{
			console.debug("[OtherCertificateSubmittrBics] addItem start");
			this.inherited(arguments);
			
			console.debug("[OtherCertificateSubmittrBics] addItem end");
		},

		createItemsFromJson: function(jsonMsg)
		{
			console.debug("[OtherCertificateSubmittrBics] createItemsFromJson start");
			
			this.inherited(arguments);
			
			console.debug("[OtherCertificateSubmittrBics] createItemsFromJson end");
		},
		
		performValidation: function()
		{
			console.debug("[Other Certificate Submtter Bic] validate start");
			if(this.validateDialog(true))
			{
				this.inherited(arguments);
			}
			
			console.debug("[Other Certificate Submtter Bic] validate end");
		}
	}
);