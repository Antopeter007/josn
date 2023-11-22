dojo.provide("misys.openaccount.widget.TransportedGoodsDetail");
dojo.experimental("misys.openacount.widget.TransportedGoodsDetail"); 

dojo.require("dijit._Contained");
dojo.require("dijit._Widget");
dojo.require("misys.layout.SimpleItem");

// our declared class
dojo.declare("misys.openaccount.widget.TransportedGoodsDetail",
	[ dijit._Widget, dijit._Contained, misys.layout.SimpleItem ],
	// class properties:
	{
	payment_tds_po_ref_id: "",
	payment_tds_po_iss_date: "",
	payment_tds_goods_desc: "",
		is_valid: "Y",
		
		createItem: function()
		{
			var item = {
					payment_tds_po_ref_id: this.get("payment_tds_po_ref_id"),
					payment_tds_po_iss_date: this.get("payment_tds_po_iss_date"),
					payment_tds_goods_desc: this.get("payment_tds_goods_desc"),
				is_valid: this.get('is_valid')
			};
			if(this.hasChildren && this.hasChildren())
    		{
				dojo.forEach(this.getChildren(), function(child){
					if (child.createItem)
					{
						item.push(child.createItem());
					}
				}, this);
    		}
    		return item;
		},

		constructor: function()
		{
			console.debug("[TransportedGoodsDetail] constructor");
		}
	}
);