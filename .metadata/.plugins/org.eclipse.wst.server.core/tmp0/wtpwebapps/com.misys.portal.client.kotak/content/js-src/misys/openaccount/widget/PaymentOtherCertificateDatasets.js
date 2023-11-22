dojo.provide("misys.openaccount.widget.PaymentOtherCertificateDatasets");
dojo.experimental("misys.openaccount.widget.PaymentOtherCertificateDatasets"); 

dojo.require("misys.grid.GridMultipleItems");
dojo.require("misys.openaccount.widget.PaymentOtherCertificateDataset");
dojo.require("misys.openaccount.widget.PaymentOtherCertificateInfos");


/**
 * This widget stores the line items details for the Open account transactions.
 */
dojo.declare("misys.openaccount.widget.PaymentOtherCertificateDatasets",
		[ misys.grid.GridMultipleItems ],
		// class properties:
		{
		data: { identifier: "store_id", label: "store_id", items: [] },
		
		templatePath: null,
		templateString: dojo.byId("payment-other-cds-template") ? dojo.byId("payment-other-cds-template").innerHTML : "",
		dialogId: "payment-other-cds-dialog-template",
		xmlTagName: "payment_other_certificate_dataset",
		xmlSubTagName: "OthrCertDataSet",
		
		gridColumns: ["payment_other_cds_type","payment_other_cds_cert_type_hidden","payment_other_cert_dataset_id", "payment_other_cert_dataset_version", "payment_other_cert_submitter_bic", "payment_other_cert_id",
		              "payment_other_cert_issue_date", "payment_other_cert_issuer_name", "payment_other_cert_prpty_id",
		      		  "payment_other_cert_prpty_id_type", "payment_other_cert_addr_street_nm","payment_other_cert_addr_code",
		      		  "payment_other_cert_addr_town","payment_other_cert_addr_ctry_sub_div","payment_other_cert_addr_ctry","payment_other_cert_ds_info"],
        
		propertiesMap: {
			payment_other_cds_type: {_fieldName: "payment_other_cds_type"},
			payment_other_cds_cert_type_hidden: {_fieldName: "payment_other_cds_cert_type_hidden"},
			payment_other_cert_dataset_id: {_fieldName: "payment_other_cert_dataset_id"},
			payment_other_cert_dataset_version: {_fieldName: "payment_other_cert_dataset_version"},
			payment_other_cert_submitter_bic: {_fieldName: "payment_other_cert_submitter_bic"},
			payment_other_cert_id: {_fieldName: "payment_other_cert_id"},
			payment_other_cert_issue_date: {_fieldName: "payment_other_cert_issue_date"},
			payment_other_cert_issuer_name: {_fieldName: "payment_other_cert_issuer_name"},
			payment_other_cert_prpty_id: {_fieldName: "payment_other_cert_prpty_id"},
			payment_other_cert_prpty_id_type: {_fieldName: "payment_other_cert_prpty_id_type"},
			payment_other_cert_addr_street_nm: {_fieldName: "payment_other_cert_addr_street_nm"},
			payment_other_cert_addr_code: {_fieldName: "payment_other_cert_addr_code"},
			payment_other_cert_addr_town: {_fieldName: "payment_other_cert_addr_town"},
			payment_other_cert_addr_ctry_sub_div: {_fieldName: "payment_other_cert_addr_ctry_sub_div"},
			payment_other_cert_addr_ctry: {_fieldName: "payment_other_cert_addr_ctry"},
			payment_other_cert_ds_info: {_fieldName: "payment_other_cert_ds_info", _type: "misys.openaccount.widget.PaymentOtherCertificateInfos"}
		},
        
		layout: [
				{ name: "Other Certificate Type", field: "payment_other_cds_cert_type_hidden", width: "10%" },
				{ name: " ", field: "actions", formatter: misys.grid.formatReportActions, width: '10%' },
				{ name: 'Id', field: 'store_id', headerStyles: 'display:none', cellStyles: 'display:none' }
				],
		
		otherInfoMap : {
						paymentOtherInfoMap: {_fieldName: "payment_other_cert_ds_info"}
		},		
				
		typeMap: {
			
			"misys.openaccount.widget.PaymentOtherCertificateInfos" : {
				'type': Array,
				'deserialize': function(value) {
					var item = {};
					item._type = "misys.openaccount.widget.PaymentOtherCertificateInfos";
					item._values = value;
					return item;
				}
			}
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
        
		mandatoryFields: [ "payment_other_cds_type"/*, "product_name", "qty_unit_measr_code", "qty_val", "price_amt"*/ ],

		startup: function(){
					console.debug("[payment other certificate Dataset] startup start");
						
					this.inherited(arguments);
			
					console.debug("[payment other certificate Dataset] startup end");
		},
    	
		openDialogFromExistingItem: function(items, request)
		{
			console.debug("[PaymentOtherCertificateDatasets] openDialogFromExistingItem start");
			
			this.inherited(arguments);

			console.debug("[PaymentOtherCertificateDatasets] openDialogFromExistingItem end");
		},
		
		resetDialog: function(items, request)
		{
			console.debug("[PaymentOtherCertificateDatasets] resetDialog start");
			
			this.inherited(arguments);

			console.debug("[PaymentOtherCertificateDatasets] resetDialog end");
		},

		createDataGrid: function()
		{
			this.inherited(arguments);

		},

		addItem: function(event)
		{
			console.debug("[LineItems] addItem start");
			
			this.inherited(arguments);

			console.debug("[LineItems] addItem end");
		},
		updateData: function(event)
		{
			console.debug("[LineItems] updateData start");
			
			this.inherited(arguments);
			console.debug("[LineItems] updateData end");
			misys.markFormDirty();
		},
		
		performValidation: function()
		{
			console.debug("[LineItems] validate start");
			this.inherited(arguments);
			console.debug("[LineItems] validate end");
		}
	}
);