dojo.provide("misys.openaccount.widget.PaymentCertificateLineItem");
dojo.experimental("misys.openacount.widget.PaymentCertificateLineItem"); 

dojo.require("dijit._Contained");
dojo.require("dijit._Widget");
dojo.require("misys.layout.SimpleItem");

// our declared class
dojo.declare("misys.openaccount.widget.PaymentCertificateLineItem",
	[ dijit._Widget, dijit._Contained, dijit._Container, misys.layout.SimpleItem ],
	// class properties:
	{
		purchaseOrderRefId: "",
		purchaseOrderIssDate: "",
		line_item_id_payment_certificate: "",
		is_valid: "Y",
		
		createItem: function()
		{
			var paymentCertificateLineItemIdText = this.get('line_item_id_payment_certificate');
			paymentCertificateLineItemIdObj = '';
			if(paymentCertificateLineItemIdText){
				paymentCertificateLineItemIdObj = new misys.openaccount.widget.PaymentCertificateLineItemIdentifications();
				paymentCertificateLineItemIdObj.createItemsFromJson(paymentCertificateLineItemIdText);
			}
			
			var item = {
					purchaseOrderRefId: this.get("purchaseOrderRefId"),
					purchaseOrderIssDate: this.get("purchaseOrderIssDate"),
					line_item_id_payment_certificate: "",
					is_valid: this.get('is_valid')
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
			console.debug("[PaymentCertificateLineItem] constructor");
			this.inherited(arguments);
		}
	}
);