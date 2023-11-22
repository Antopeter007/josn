dojo.provide("misys.openaccount.widget.PaymentCertificateDatasetDetails");
dojo.experimental("misys.openaccount.widget.PaymentCertificateDatasetDetails"); 

dojo.require("misys.grid.GridMultipleItems");
dojo.require("misys.openaccount.widget.PaymentCertificateDatasetDetail");
dojo.require("misys.openaccount.widget.PaymentCertificateAddtnlInfs");
dojo.require("misys.openaccount.widget.PaymentCertificateLineItems");
dojo.require("misys.openaccount.widget.PaymentCertificateLineItemIdentifications");




/**
 * This widget stores the payment certificate dataset details for the Open account transactions.
 */
dojo.declare("misys.openaccount.widget.PaymentCertificateDatasetDetails",
		[ misys.grid.GridMultipleItems ],
		// class properties:
		{
		data: { identifier: "store_id", label: "store_id", items: [] },
		handle: null,
		templatePath: null,
		templateString: dojo.byId("payment-certificate-ds-details-template").innerHTML,
		dialogId: "payment-certificate-ds-details-dialog-template",
		xmlTagName: "payment_certificate_dataset",
		xmlSubTagName: "CertDataSet",
		
		gridColumns:["payment_ceds_cert_type",
		             	"payment_ceds_cert_type_hidden",
		  				"payment_ceds_po_authrsd_inspctn_dt",
		  				"payment_ceds_po_cert_id",
						"payment_ceds_po_goods_desc",
						"payment_ceds_certfdchrtcs_origin",
						"payment_ceds_certfdchrtcs_qlty",
						"payment_ceds_certfdchrtcs_anlys",
						"payment_ceds_certfdchrtcs_wt_unit",
						"payment_ceds_certfdchrtcs_wt_othrunit",
						"payment_ceds_certfdchrtcs_wt_val",
						"payment_ceds_certfdchrtcs_wt_fctr",
						"payment_ceds_certfdchrtcs_qty_unit",
						"payment_ceds_certfdchrtcs_qty_othrunit",
						"payment_ceds_certfdchrtcs_qty_val",
						"payment_ceds_certfdchrtcs_qty_fctr",
						"payment_ceds_certfdchrtcs_hlthIndctn",
						"payment_ceds_certfdchrtcs_phytosntryIndctn",
						"payment_ceds_iss_date",
						"payment_ceds_poi_strtnm",
						"payment_ceds_poi_pstcdid",
						"payment_ceds_poi_twnnm",
						"payment_ceds_poi_ctrysubdvsn",
						"payment_ceds_poi_ctry",
						"payment_ceds_po_issuer_nm",
						"payment_ceds_po_issr_prtry_id",
						"payment_ceds_po_issr_prtry_id_type",
						"payment_ceds_po_issr_strtnm",
						"payment_ceds_po_issr_pstcdid",
						"payment_ceds_po_issr_twnnm",
						"payment_ceds_po_issr_ctrysubdvsn",
						"payment_ceds_po_issr_ctry",
						"payment_ceds_po_inspctn_fr_dt",
						"payment_ceds_po_inspctn_to_dt",
						"payment_ceds_po_manfctr_nm",
						"payment_ceds_po_manfctr_prtry_id",
						"payment_ceds_po_manfctr_prtry_id",
						"payment_ceds_po_manfctr_strtnm",
						"payment_ceds_po_manfctr_pstcdid",
						"payment_ceds_po_manfctr_twnnm",
						"payment_ceds_po_manfctr_ctrysubdvsn",
						"payment_ceds_po_manfctr_ctry",
						"payment_certificate_ds_addtl_inf",
						"line_item_payment_certificate",
						"payment_cert_dataset_id",
						"payment_cert_dataset_version",
						"payment_cert_dataset_submitter_bic"],
        
		propertiesMap: {
			payment_ceds_cert_type:{_fieldName: "payment_ceds_cert_type"},
			payment_ceds_cert_type_hidden:{_fieldName: "payment_ceds_cert_type_hidden"},
			payment_ceds_po_authrsd_inspctn_ind:{_fieldName: "payment_ceds_po_authrsd_inspctn_ind"},
			payment_ceds_po_cert_id:{_fieldName: "payment_ceds_po_cert_id"},		
			payment_ceds_po_goods_desc:{_fieldName: "payment_ceds_po_goods_desc"},
			payment_ceds_certfdchrtcs_origin:{_fieldName: "payment_ceds_certfdchrtcs_origin"},
			payment_ceds_certfdchrtcs_qlty:{_fieldName: "payment_ceds_certfdchrtcs_qlty"},
			payment_ceds_certfdchrtcs_anlys:{_fieldName: "payment_ceds_certfdchrtcs_anlys"},
			payment_ceds_certfdchrtcs_wt_unit:{_fieldName: "payment_ceds_certfdchrtcs_wt_unit"},
			payment_ceds_certfdchrtcs_wt_othrunit:{_fieldName: "payment_ceds_certfdchrtcs_wt_othrunit"},
			payment_ceds_certfdchrtcs_wt_val:{_fieldName: "payment_ceds_certfdchrtcs_wt_val"},
			payment_ceds_certfdchrtcs_wt_fctr:{_fieldName: "payment_ceds_certfdchrtcs_wt_fctr"},
			payment_ceds_certfdchrtcs_qty_unit:{_fieldName: "payment_ceds_certfdchrtcs_qty_unit"},
			payment_ceds_certfdchrtcs_qty_othrunit:{_fieldName: "payment_ceds_certfdchrtcs_qty_othrunit"},
			payment_ceds_certfdchrtcs_qty_val:{_fieldName: "payment_ceds_certfdchrtcs_qty_val"},
			payment_ceds_certfdchrtcs_qty_fctr:{_fieldName: "payment_ceds_certfdchrtcs_qty_fctr"},
			payment_ceds_certfdchrtcs_hlthIndctn:{_fieldName: "payment_ceds_certfdchrtcs_hlthIndctn"},
			payment_ceds_certfdchrtcs_phytosntryIndctn:{_fieldName: "payment_ceds_certfdchrtcs_phytosntryIndctn"},
			payment_ceds_iss_date:{_fieldName: "payment_ceds_iss_date"},
			payment_ceds_poi_strtnm:{_fieldName: "payment_ceds_poi_strtnm"},
			payment_ceds_poi_pstcdid:{_fieldName: "payment_ceds_poi_pstcdid"},
			payment_ceds_poi_twnnm:{_fieldName: "payment_ceds_poi_twnnm"},
			payment_ceds_poi_ctrysubdvsn:{_fieldName: "payment_ceds_poi_ctrysubdvsn"},
			payment_ceds_poi_ctry:{_fieldName: "payment_ceds_poi_ctry"},
			payment_ceds_po_issuer_nm:{_fieldName: "payment_ceds_po_issuer_nm"},
			payment_ceds_po_issr_prtry_id:{_fieldName: "payment_ceds_po_issr_prtry_id"},
			payment_ceds_po_issr_prtry_id_type:{_fieldName: "payment_ceds_po_issr_prtry_id_type"},
			payment_ceds_po_issr_strtnm:{_fieldName: "payment_ceds_po_issr_strtnm"},
			payment_ceds_po_issr_pstcdid:{_fieldName: "payment_ceds_po_issr_pstcdid"},
			payment_ceds_po_issr_twnnm:{_fieldName: "payment_ceds_po_issr_twnnm"},
			payment_ceds_po_issr_ctrysubdvsn:{_fieldName: "payment_ceds_po_issr_ctrysubdvsn"},
			payment_ceds_po_issr_ctry:{_fieldName: "payment_ceds_po_issr_ctry"},
			payment_ceds_po_inspctn_fr_dt:{_fieldName: "payment_ceds_po_inspctn_fr_dt"},
			payment_ceds_po_inspctn_to_dt:{_fieldName: "payment_ceds_po_inspctn_to_dt"},
			payment_ceds_po_manfctr_nm:{_fieldName: "payment_ceds_po_manfctr_nm"},
			payment_ceds_po_manfctr_prtry_id:{_fieldName: "payment_ceds_po_manfctr_prtry_id"},		
			payment_ceds_po_manfctr_prtry_id_type:{_fieldName: "payment_ceds_po_manfctr_prtry_id_type"},
			payment_ceds_po_manfctr_strtnm:{_fieldName: "payment_ceds_po_manfctr_strtnm"},
			payment_ceds_po_manfctr_pstcdid:{_fieldName: "payment_ceds_po_manfctr_pstcdid"},
			payment_ceds_po_manfctr_twnnm:{_fieldName: "payment_ceds_po_manfctr_twnnm"},
			payment_ceds_po_manfctr_ctrysubdvsn:{_fieldName: "payment_ceds_po_manfctr_ctrysubdvsn"},
			payment_ceds_po_manfctr_ctry:{_fieldName: "payment_ceds_po_manfctr_ctry"},
			payment_certificate_ds_addtl_inf:{_fieldName: 'payment_certificate_ds_addtl_inf', _type: 'misys.openaccount.widget.PaymentCertificateAddtnlInfs'},	
			line_item_payment_certificate:{_fieldName: 'line_item_payment_certificate', _type: 'misys.openaccount.widget.PaymentCertificateLineItems'},
			payment_cert_dataset_id:{_fieldName: "payment_cert_dataset_id"},
			payment_cert_dataset_version:{_fieldName: "payment_cert_dataset_version"},
			payment_cert_dataset_submitter_bic:{_fieldName: "payment_cert_dataset_submitter_bic"}
			
		},		
		
		paymentCerTpMap : {
			PaymentCertTp: {_fieldName: "payment_ceds_cert_type"}
		},
			
		addtlInfMap : {
			paymentAddtlInfMap: {_fieldName: "payment_certificate_ds_addtl_inf"}
		},
		
		lineItemMap :{
			paymentLineItemMap: {_fieldName: "line_item_payment_certificate"}
		},
		
		typeMap: {
			'misys.openaccount.widget.PaymentCertificateAddtnlInfs' : {
				'type': Array,
				'deserialize': function(value) {
					var item = {};
					item._type = 'misys.openaccount.widget.PaymentCertificateAddtnlInfs';
					item._values = value;
					return item;
				}
			},
			'misys.openaccount.widget.PaymentCertificateLineItems' : {
				'type': Array,
				'deserialize': function(value) {
					var item = {};
					item._type = 'misys.openaccount.widget.PaymentCertificateLineItems';
					item._values = value;
					return item;
				}
			}
		},
			
		layout: [
				{ name: "payment_ceds_cert_type", field: "payment_ceds_cert_type", width: "50%" },
				{ name: " ", field: "actions", formatter: misys.grid.formatReportActions, width: "50%" },
				{ name: "Id", field: "store_id", headerStyles: "display:none", cellStyles: "display:none" }
				],
        
        mandatoryFields: [],
        
		startup: function(){
			console.debug("[payment certificate Dataset] startup start");
			
			this.inherited(arguments);
			console.debug("[payment certificate Dataset] startup end");
		},
    	
		openDialogFromExistingItem: function(items, request)
		{
			console.debug("[payment certificate Dataset] openDialogFromExistingItem start");
			
			this.inherited(arguments);

			console.debug("[payment certificate Dataset] openDialogFromExistingItem end");
		},
		
		addItem: function(event)
		{
			console.debug("[payment certificate Dataset] addItem start");

			this.inherited(arguments);
			
			console.debug("[payment certificate Dataset] addItem end");
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
		
		createItemsFromJson: function(jsonMsg)
		{
			console.debug("[payment certificate Dataset] createItemsFromJson start");
			
			this.inherited(arguments);
			
			console.debug("[payment certificate Dataset] createItemsFromJson end");
		}
	
	}
);