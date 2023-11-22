dojo.provide("misys.openaccount.widget.CertificateDatasetDetail");
dojo.experimental("misys.openacount.widget.CertificateDatasetDetail"); 

dojo.require("dijit._Contained");
dojo.require("dijit._Widget");
dojo.require("dijit._Container");
dojo.require("misys.layout.SimpleItem");

// our declared class
dojo.declare("misys.openaccount.widget.CertificateDatasetDetail",
	[ dijit._Widget, dijit._Contained, dijit._Container, misys.layout.SimpleItem ],
	// class properties:
	{
		ceds_cert_type: "",
		ceds_match_issuer_name: "",
		ceds_match_issuer_country: "",
		ceds_identification: "",
		ceds_identification_type: "",
		ceds_match_iss_date: "",
		ceds_match_insp_date: "",
		ceds_match_insp_ind: "",
		ceds_match_consignee: "",
		ceds_match_mf_issuer_name: "",
		ceds_match_mf_issuer_country: "",
		ceds_match_mf_identification: "",
		ceds_match_mf_identification_type: "",
		ceds_cert_type_hidden: "",
		certificate_dataset_bic: "",
		certificate_dataset_line_item_id: "",
				
		createItem: function()
		{
			var certificateBicText = this.get('certificate_dataset_bic');
			var certificateBicObj = '';
			if(certificateBicText){
				certificateBicObj = new misys.openaccount.widget.CertificateSubmittrBics();
				certificateBicObj.createItemsFromJson(certificateBicText);
			}
			var certificateLineItemIdText = this.get('certificate_dataset_line_item_id');
			var certificateLineItemIdObj = '';
			if(certificateLineItemIdText){
				certificateLineItemIdObj = new misys.openaccount.widget.CertificateLineItemIdentifications();
				certificateLineItemIdObj.createItemsFromJson(certificateLineItemIdText);
			}
			var item = {
					ceds_cert_type: this.get("ceds_cert_type"),
					ceds_match_issuer_name: this.get("ceds_match_issuer_name"),
					ceds_match_issuer_country: this.get("ceds_match_issuer_country"),
					ceds_identification: this.get("ceds_identification"),
					ceds_identification_type: this.get("ceds_identification_type"),
					ceds_match_iss_date: this.get("ceds_match_iss_date"),
				
					ceds_match_insp_date: this.get("ceds_match_insp_date"),
					ceds_match_insp_ind: this.get("ceds_match_insp_ind"),
					ceds_match_consignee: this.get("ceds_match_consignee"),
					ceds_match_mf_issuer_name: this.get("ceds_match_mf_issuer_name"),
					ceds_match_mf_issuer_country: this.get("ceds_match_mf_issuer_country"),
					ceds_match_mf_identification: this.get("ceds_match_mf_identification"),
					ceds_match_mf_identification_type: this.get("ceds_match_mf_identification_type"),
					ceds_cert_type_hidden: this.get("ceds_cert_type_hidden"),
					certificate_dataset_bic: "",
					certificate_dataset_line_item_id: ""
			};
			if(this.hasChildren && this.hasChildren())
			{
				dojo.forEach(this.getChildren(), function(child){
					if (child.createItem)
					{
						var items = child.createItem();
						if (items != null)
						{
							dojo.mixin(item, items);
						}
					}
				}, this);
    		}
    		return item;
		},

		constructor: function()
		{
			console.debug("[CertificateDatasetDetail] constructor");
		}
	}
);