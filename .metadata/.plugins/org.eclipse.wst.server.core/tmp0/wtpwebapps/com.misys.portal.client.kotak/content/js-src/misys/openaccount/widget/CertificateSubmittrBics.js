dojo.provide("misys.openaccount.widget.CertificateSubmittrBics");
dojo.experimental("misys.openaccount.widget.CertificateSubmittrBics"); 

dojo.require("misys.grid.GridMultipleItems");
dojo.require("misys.openaccount.widget.CertificateSubmittrBic");

// our declared class
dojo.declare("misys.openaccount.widget.CertificateSubmittrBics",
		[ misys.grid.GridMultipleItems ],
		// class properties:
		{
		data: { identifier: "store_id", label: "store_id", items: [] },
		templatePath: null,
		templateString: dojo.byId("certificate-bic-template").innerHTML,
		dialogId: "certificate-bic-dialog-template",
		xmlTagName: "",
		xmlSubTagName: "",
		
		gridColumns: ["ceds_bic"],
        
		propertiesMap: {
			BIC: {_fieldName: "ceds_bic"}
			},

		layout: [
				{ name: "BIC", field: "ceds_bic", width: "35%" },
				{ name: " ", field: "actions", formatter: misys.grid.formatReportActions, width: "10%" }/*,
				{ name: "Id", field: "store_id", headerStyles: "display:none", cellStyles: "display:none" }*/
				],
        
		mandatoryFields: [],
        
		startup: function(){
			console.debug("[CertificateSubmittrBics] startup start");
			
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
			console.debug("[CertificateSubmittrBics] startup end");
		},
    	
		openDialogFromExistingItem: function(items, request)
		{
			console.debug("[CertificateSubmittrBics] openDialogFromExistingItem start");
			
			// In view mode, disconnect events on amount and rate fields
			// as they are not properly rendered otherwise
			/*if (misys._config.displayMode === "view") {
				misys.disconnectById("freight_charge_amt");
				misys.disconnectById("freight_charge_rate");				
			}*/

			this.inherited(arguments);
			
			console.debug("[CertificateSubmittrBics] openDialogFromExistingItem end");
		},
		
		createItem: function()
		{
			if(this.hasChildren && this.hasChildren())
			{
				var type= 'misys.openaccount.widget.CertificateSubmittrBics';
				var value= [];
				dojo.forEach(this.getChildren(), function(child){
					if (child.createItem)
					{
						value.push(child.createItem());
					}
				}, this);
				var obj = {_value : value , _type: type};
				var item = {};
				item["certificate_dataset_bic"] = obj;
				return item;
			}
			return null;
		},
		
		resetDialog: function(event)
		{
			console.debug("[CertificateSubmittrBics] ResetDialog start");
			
			this.inherited(arguments);
			
			//this.defaultFreightCharges();
			
			console.debug("[CertificateSubmittrBics] ResetDialog end");
		},


		addItem: function(event)
		{
			console.debug("[CertificateSubmittrBics] addItem start");
			/*if (this.id.match("^po-") == "po-" && misys.checkLineItemChildrens()){
				misys.dialog.show("ERROR", misys.getLocalization("tooManyPODetailsError"));
				return;
			} else if(this.id.match("^line_item_") == "line_item_" && misys.checkPOChildrens()){
				misys.dialog.show("ERROR", misys.getLocalization("tooManyPODetailsError"));
				return;
			}*/
			this.inherited(arguments);
			
			console.debug("[CertificateSubmittrBics] addItem end");
		},

		createItemsFromJson: function(jsonMsg)
		{
			console.debug("[CertificateSubmittrBics] createItemsFromJson start");
			
			this.inherited(arguments);
			
			console.debug("[CertificateSubmittrBics] createItemsFromJson end");
		},
		updateData: function(event)
		{
			console.debug("[CertificateSubmittrBics] updateData start");
			
			this.inherited(arguments);
			
			console.debug("[CertificateSubmittrBics] updateData end");
		},
		
		performValidation: function()
		{
			console.debug("[Certificate Submtter Bic] validate start");
			if(this.validateDialog(true))
			{
				this.inherited(arguments);
			}
			
			console.debug("[Certificate Submtter Bic] validate end");
		}
	}
);