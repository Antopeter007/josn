dojo.provide("misys.purchaseorder.widget.PurchaseOrder");

dojo.require("dijit._Contained");
dojo.require("dijit._Container");
dojo.require("dijit._Widget");
dojo.require("misys.layout.SimpleItem");

// our declared class
dojo.declare("misys.purchaseorder.widget.PurchaseOrder",
		[ dijit._Widget, dijit._Contained, dijit._Container, misys.layout.SimpleItem ],
	// class properties:
	{
	cust_ref_id: '',
	po_reference: '',
	line_item_number: '',
	product_name: '',
	qty_unit_measr_code: '',
	qty_unit_measr_label: '',
	qty_other_unit_measr: '',
	qty_val: '',
	qty_tol_pstv_pct: '',
	qty_tol_neg_pct: '',
	price_unit_measr_code: '',
	price_unit_measr_label: '',
	price_other_unit_measr: '',
	price_cur_code: '',
	price_amt: '',
	price_tol_pstv_pct: '',
	price_tol_neg_pct: '',
	total_cur_code: '',
	total_amt: '',
	total_net_cur_code: '',
	total_net_amt: '',
	is_valid: '',
	ref_id:'',
		
	constructor: function()
	{
		console.debug("[LineItem] constructor");
	},
	
	buildRendering: function()
	{
		console.debug("[LineItem] buildRendering start");
		this.inherited(arguments);
		var children = this.getChildren();
		dojo.forEach(children, function(child){
			dojo.attr(child.domNode, 'style', {display: 'none'});
		});
		console.debug("[LineItem] buildRendering end");
	},
	
	createItem: function()
	{
		var item = {
			cust_ref_id: this.get('cust_ref_id'),
			po_reference: this.get('po_reference'),
			line_item_number: this.get('line_item_number'),
			product_name: this.get('product_name'),
			qty_unit_measr_code: this.get('qty_unit_measr_code'),
			qty_unit_measr_label: this.get('qty_unit_measr_label'),
			qty_other_unit_measr: this.get('qty_other_unit_measr'),
			qty_val: this.get('qty_val'),
			qty_tol_pstv_pct: this.get('qty_tol_pstv_pct'),
			qty_tol_neg_pct: this.get('qty_tol_neg_pct'),
			price_unit_measr_code: this.get('price_unit_measr_code'),
			price_unit_measr_label: this.get('price_unit_measr_label'),
			price_other_unit_measr: this.get('price_other_unit_measr'),
			price_cur_code: this.get('price_cur_code'),
			price_amt: this.get('price_amt'),
			price_tol_pstv_pct: this.get('price_tol_pstv_pct'),
			price_tol_neg_pct: this.get('price_tol_neg_pct'),
			total_cur_code: this.get('total_cur_code'),
			total_amt: this.get('total_amt'),
			total_net_cur_code: this.get('total_net_cur_code'),
			total_net_amt: this.get('total_net_amt'),
			is_valid: this.get('is_valid'),
			ref_id: this.get("ref_id")
		};
		if(this.hasChildren && this.hasChildren())
		{
			dojo.forEach(this.getChildren(), function(child){
				if (child.createItem)
				{
					//item.push(child.createItem());
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
	
	startup: function()
		{
			if(this._started) { return; }
			console.debug("[PurchaseOrder] startup start");
			this.inherited(arguments);
			console.debug("[PurchaseOrder] startup end");
		}
		
	
	}
);