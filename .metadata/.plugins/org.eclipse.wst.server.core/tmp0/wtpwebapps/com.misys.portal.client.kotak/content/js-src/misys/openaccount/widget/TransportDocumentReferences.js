dojo.provide("misys.openaccount.widget.TransportDocumentReferences");
dojo.experimental("misys.openaccount.widget.TransportDocumentReferences"); 

dojo.require("misys.grid.GridMultipleItems");
dojo.require("misys.openaccount.widget.TransportDocumentReference");

// our declared class
dojo.declare("misys.openaccount.widget.TransportDocumentReferences",
		[ misys.grid.GridMultipleItems ],
		// class properties:
		{
		data: { identifier: "store_id", label: "store_id", items: [] },
		templatePath: null,
		templateString: dojo.byId("transport-document-ref-template").innerHTML,
		dialogId: "transport-document-ref-template",
		xmlTagName: "",
		xmlSubTagName: "",
		
		gridColumns: ["payment_tds_doc_id","payment_tds_doc_iss_date"],
        
		propertiesMap: {
			payment_tds_doc_id: {_fieldName: "payment_tds_doc_id"},
			payment_tds_doc_iss_date: {_fieldName: "payment_tds_doc_iss_date"}
			},

		layout: [
				{ name: "Transport Document ID", field: "payment_tds_doc_id", width: "40%" },
				{ name: "Transport Document Date", field: "payment_tds_doc_iss_date", width: "40%" },
				{ name: " ", field: "actions", formatter: misys.grid.formatReportActions, width: "10%" }/*,
				{ name: "Id", field: "store_id", headerStyles: "display:none", cellStyles: "display:none" }*/
				],
        
		mandatoryFields: [],
        
		startup: function(){
			console.debug("[TransportDocumentReferences] startup start");
			
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
			console.debug("[TransportDocumentReferences] startup end");
		},
    	
		openDialogFromExistingItem: function(items, request)
		{
			console.debug("[TransportDocumentReferences] openDialogFromExistingItem start");
			
			// In view mode, disconnect events on amount and rate fields
			// as they are not properly rendered otherwise
			/*if (misys._config.displayMode === "view") {
				misys.disconnectById("freight_charge_amt");
				misys.disconnectById("freight_charge_rate");				
			}*/

			this.inherited(arguments);
			
			console.debug("[TransportDocumentReferences] openDialogFromExistingItem end");
		},
		
		createItem: function()
		{
			if(this.hasChildren && this.hasChildren())
			{
				var type= 'misys.openaccount.widget.TransportDocumentReferences';
				var value= [];
				dojo.forEach(this.getChildren(), function(child){
					if (child.createItem)
					{
						value.push(child.createItem());
					}
				}, this);
				var obj = {_value : value , _type: type};
				var item = {};
				item["payment_tds_dataset_transport_doc_ref"] = obj;
				return item;
			}
			return null;
		},
		
		resetDialog: function(event)
		{
			console.debug("[TransportDocumentReferences] ResetDialog start");
			
			this.inherited(arguments);
			
			console.debug("[TransportDocumentReferences] ResetDialog end");
		},


		addItem: function(event)
		{
			console.debug("[TransportDocumentReferences] addItem start");
			this.inherited(arguments);
			
			console.debug("[TransportDocumentReferences] addItem end");
		},

		createItemsFromJson: function(jsonMsg)
		{
			console.debug("[TransportDocumentReferences] createItemsFromJson start");
			
			this.inherited(arguments);
			
			console.debug("[TransportDocumentReferences] createItemsFromJson end");
		},
		
		performValidation: function()
		{
			console.debug("[TransportDocumentReferences] validate start");
			if(this.validateDialog(true))
			{
				this.inherited(arguments);
			}
			
			console.debug("[TransportDocumentReferences] validate end");
		}
	}
);