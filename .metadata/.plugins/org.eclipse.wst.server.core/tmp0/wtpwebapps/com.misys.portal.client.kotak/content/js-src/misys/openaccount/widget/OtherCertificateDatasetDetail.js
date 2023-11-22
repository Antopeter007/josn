dojo.provide("misys.openaccount.widget.OtherCertificateDatasetDetail");
dojo.experimental("misys.openacount.widget.OtherCertificateDatasetDetail"); 

dojo.require("dijit._Contained");
dojo.require("dijit._Container");
dojo.require("dijit._Widget");
dojo.require("misys.layout.SimpleItem");

// our declared class
dojo.declare("misys.openaccount.widget.OtherCertificateDatasetDetail",
	[ dijit._Widget, dijit._Contained,  dijit._Container, misys.layout.SimpleItem ],
	// class properties:
	{
	ocds_cert_type: "",
	ocds_cert_type_hidden: "",
		other_certificate_dataset_bic: "",
				
		createItem: function()
		{
			var otherCertificateBicText = this.get('other_certificate_dataset_bic');
			var otherCertificateBicObj = '';
			if(otherCertificateBicText){
				otherCertificateBicObj = new misys.openaccount.widget.OtherCertificateSubmittrBics();
				otherCertificateBicObj.createItemsFromJson(otherCertificateBicText);
			}
			var item = {
					ocds_cert_type: this.get("ocds_cert_type"),
					ocds_cert_type_hidden: this.get("ocds_cert_type_hidden"),
				other_certificate_dataset_bic: ""
				
				
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