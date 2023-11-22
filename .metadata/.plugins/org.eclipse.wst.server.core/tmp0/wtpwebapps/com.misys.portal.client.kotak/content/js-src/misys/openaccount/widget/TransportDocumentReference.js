dojo.provide("misys.openaccount.widget.TransportDocumentReference");
dojo.experimental("misys.openacount.widget.TransportDocumentReference"); 

dojo.require("dijit._Contained");
dojo.require("dijit._Widget");
dojo.require("misys.layout.SimpleItem");

// our declared class
dojo.declare("misys.openaccount.widget.TransportDocumentReference",
	[ dijit._Widget, dijit._Contained, misys.layout.SimpleItem ],
	// class properties:
	{
	payment_tds_doc_id: "",
	payment_tds_doc_iss_date: "",
		is_valid: "Y",
		
		createItem: function()
		{
			var item = {
					payment_tds_doc_id: this.get("payment_tds_doc_id"),
					payment_tds_doc_iss_date: this.get("payment_tds_doc_iss_date"),
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
			console.debug("[TransportDocumentReference] constructor");
		}
	}
);