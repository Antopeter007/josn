dojo.provide("misys.openaccount.widget.PaymentOtherCertificateDataset");
dojo.experimental("misys.openacount.widget.PaymentOtherCertificateDataset"); 

dojo.require("dijit._Contained");
dojo.require("dijit._Container");
dojo.require("dijit._Widget");
dojo.require("misys.layout.SimpleItem");

/**
 * This class defines the widget to store the line item detail for the transactions.
 */
dojo.declare("misys.openaccount.widget.PaymentOtherCertificateDataset",
	[ dijit._Widget, dijit._Contained, dijit._Container, misys.layout.SimpleItem ],
	// class properties:
	{
		
		payment_other_cds_type: "",
		payment_other_cds_cert_type_hidden: "",
		payment_other_cert_dataset_id: "",
		payment_other_cert_dataset_version: "",
		payment_other_cert_submitter_bic: "",
		payment_other_cert_id: "",
        payment_other_cert_issue_date: "",
        payment_other_cert_issuer_name: "",
        payment_other_cert_prpty_id: "",
		payment_other_cert_prpty_id_type: "",
		payment_other_cert_addr_street_nm: "",
		payment_other_cert_addr_code: "",
		payment_other_cert_addr_town: "",
		payment_other_cert_addr_ctry_sub_div: "",
		payment_other_cert_addr_ctry: "",
		payment_other_cert_ds_info: "",
		
				
		createItem: function()
		{
			PaymentOtherCertInfoText = this.get("payment_other_cert_ds_info");
			PaymentOtherCertInfoObj = "";
			if(PaymentOtherCertInfoText){
				PaymentOtherCertInfoObj = new misys.openaccount.widget.PaymentOtherCertificateInfos();
				PaymentOtherCertInfoObj.createItemsFromJson(PaymentOtherCertInfoText);
			}
			
			var item = {
				
					payment_other_cds_type: this.get("payment_other_cds_type"),
					payment_other_cds_cert_type_hidden: this.get("payment_other_cds_cert_type_hidden"),
					payment_other_cert_dataset_id: this.get("payment_other_cert_dataset_id"),
					payment_other_cert_dataset_version: this.get("payment_other_cert_dataset_version"),
					payment_other_cert_submitter_bic: this.get("payment_other_cert_submitter_bic"),
					payment_other_cert_id: this.get("payment_other_cert_id"),
			        payment_other_cert_issue_date: this.get("payment_other_cert_issue_date"),
			        payment_other_cert_issuer_name: this.get("payment_other_cert_issuer_name"),
			        payment_other_cert_prpty_id: this.get("payment_other_cert_prpty_id"),
					payment_other_cert_prpty_id_type: this.get("payment_other_cert_prpty_id_type"),
					payment_other_cert_addr_street_nm: this.get("payment_other_cert_addr_street_nm"),
					payment_other_cert_addr_code: this.get("payment_other_cert_addr_code"),
					payment_other_cert_addr_town: this.get("payment_other_cert_addr_town"),
					payment_other_cert_addr_ctry_sub_div: this.get("payment_other_cert_addr_ctry_sub_div"),
					payment_other_cert_addr_ctry: this.get("payment_other_cert_addr_ctry"),
					payment_other_cert_ds_info: ""
				
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
			console.debug("[PaymentOtherCertificateDataset] constructor");
		}
	}
);