dojo.provide("misys.openaccount.widget.PaymentTransportDatasetDetail");
dojo.experimental("misys.openacount.widget.PaymentTransportDatasetDetail"); 

dojo.require("dijit._Contained");
dojo.require("dijit._Widget");
dojo.require("dijit._Container");
dojo.require("misys.layout.SimpleItem");

// our declared class
dojo.declare("misys.openaccount.widget.PaymentTransportDatasetDetail",
	[ dijit._Widget, dijit._Contained, dijit._Container, misys.layout.SimpleItem ],
	// class properties:
	{
		payment_tds_version: "",
		payment_tds_id: "",
		payment_tds_bic: "",
		payment_tds_prop_date:"",
		payment_tds_actual_date:"",
		payment_tds_dataset_transported_goods: "",
		payment_tds_dataset_transport_doc_ref: "",
		
		
				
		createItem: function()
		{
			var transportedGoodsText = this.get('payment_tds_dataset_transported_goods');
			var transportedGoodsObj = '';
			if(transportedGoodsText){
				transportedGoodsObj = new misys.openaccount.widget.TransportedGoodsDetails();
				transportedGoodsObj.createItemsFromJson(transportedGoodsText);
			}
			
			var transportedDocRefText = this.get('payment_tds_dataset_transport_doc_ref');
			var transportedDocRefObj = '';
			if(transportedDocRefText){
				transportedDocRefObj = new misys.openaccount.widget.TransportDocumentReferences();
				transportedDocRefObj.createItemsFromJson(transportedDocRefText);
			}
			
			var item = {
				payment_tds_version: this.get("payment_tds_version"),
				payment_tds_id: this.get("payment_tds_id"),
				payment_tds_bic: this.get("payment_tds_bic"),
				payment_tds_prop_date:this.get("payment_tds_prop_date"),
				payment_tds_actual_date:this.get("payment_tds_actual_date"),
				payment_tds_dataset_transported_goods:"",
				payment_tds_dataset_transport_doc_ref: ""
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
			console.debug("[Payment Transport Dataset] constructor");
		}
	}
);