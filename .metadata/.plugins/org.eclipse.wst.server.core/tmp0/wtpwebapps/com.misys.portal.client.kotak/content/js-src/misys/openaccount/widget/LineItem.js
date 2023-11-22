dojo.provide("misys.openaccount.widget.LineItem");
dojo.experimental("misys.openacount.widget.LineItem"); 

dojo.require("dijit._Contained");
dojo.require("dijit._Container");
dojo.require("dijit._Widget");
dojo.require("misys.layout.SimpleItem");

/**
 * This class defines the widget to store the line item detail for the transactions.
 */
dojo.declare("misys.openaccount.widget.LineItem",
	[ dijit._Widget, dijit._Contained, dijit._Container, misys.layout.SimpleItem ],
	// class properties:
	{
        
		cust_ref_id: "",
		po_reference: "",
		line_item_number: "",
		product_name: "",
		product_orgn: "",
		qty_unit_measr_code: "",
		qty_unit_measr_label: "",
		qty_other_unit_measr: "",
		qty_val: "",
		qty_factor: "",
		qty_tol_pstv_pct: "",
		qty_tol_neg_pct: "",
		price_unit_measr_code: "",
		price_unit_measr_label: "",
		price_other_unit_measr: "",
		price_cur_code: "",
		price_amt: "",
		price_factor: "",
		price_tol_pstv_pct: "",
		price_tol_neg_pct: "",
		total_cur_code: "",
		total_amt: "",
		freight_charges_type: "",
		total_net_cur_code: "",
		total_net_amt: "",
		last_ship_date: "",
		earliest_ship_date: "",
		line_item_product_identifiers: "",
		line_item_product_characteristics: "",
		line_item_product_categories: "",
		line_item_adjustments: "",
		line_item_taxes: "",
		line_item_freight_charges: "",
		line_item_incoterms: "",
		line_item_air_routing_summaries: "",
		line_item_sea_routing_summaries: "",
		line_item_rail_routing_summaries: "",
		line_item_road_routing_summaries: "",
		taking_in_charge: "",
		final_dest_place: "",
		line_item_shipment_schedules: "",
		is_valid: "",
		ref_id:"",
		
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
		
		startup: function()
		{
			console.debug("[LineItem] startup start");
			/*var children = this.getChildren();
			dojo.forEach(children, function(child){
				dojo.attr(child.domNode, 'style', {display: 'none'});
				//this.removeChild(child);
			});*/
			this.inherited(arguments);
			console.debug("[LineItem] startup end");
		},
		
		createItem: function()
		{
			adjText = this.get('line_item_adjustments');
			adjObj = "";
			if(adjText){
				adjObj = new misys.openaccount.widget.Adjustments();
				adjObj.createItemsFromJson(adjText);
//				adjObj = adjObj.data.items;
			}
			taxText = this.get('line_item_taxes');
			taxObj = "";
			if(taxText){
				taxObj = new misys.openaccount.widget.Taxes();
				taxObj.createItemsFromJson(taxText);
//				taxObj = taxObj.data.items;
			}
			freightText = this.get('line_item_freight_charges');
			freightObj = "";
			if(freightText){
				freightObj = new misys.openaccount.widget.FreightCharges();
				freightObj.createItemsFromJson(freightText);
//				freightObj = freightObj.data.items;
			}
			prodIdText = this.get('line_item_product_identifiers');
			prodIdObj = "";
			if(prodIdText){
				prodIdObj = new misys.openaccount.widget.ProductIdentifiers();
				prodIdObj.createItemsFromJson(prodIdText);
//				prodIdObj = prodIdObj.data.items;
			}
			prodCaracText = this.get('line_item_product_characteristics');
			prodCaracObj = "";
			if(prodCaracText){
				prodCaracObj = new misys.openaccount.widget.ProductCharacteristics();
				prodCaracObj.createItemsFromJson(prodCaracText);
//				prodCaracObj = prodCaracObj.data.items;
			}
			prodCatText = this.get('line_item_product_categories');
			prodCatObj = "";
			if(prodCatText){
				prodCatObj = new misys.openaccount.widget.ProductCategories();
				prodCatObj.createItemsFromJson(prodCatText);
//				prodCatObj = prodCatObj.data.items;
			}
			incoText = this.get('line_item_incoterms');
			incoObj = "";
			if(incoText){
				incoObj = new misys.openaccount.widget.Incoterms();
				incoObj.createItemsFromJson(incoText);
//				incoObj = incoObj.data.items;
			}
			
			routingSummaryAirText = this.get('line_item_air_routing_summaries');
			routingSummaryAirObj = "";
			if(routingSummaryAirText){
				routingSummaryAirObj = new misys.openaccount.widget.AirRoutingSummaries();
				routingSummaryAirObj.createItemsFromJson(routingSummaryAirText);
			}
			
			routingSummarySeaText = this.get('line_item_sea_routing_summaries');
			routingSummarySeaObj = "";
			if(routingSummarySeaText){
				routingSummarySeaObj = new misys.openaccount.widget.SeaRoutingSummaries();
				routingSummarySeaObj.createItemsFromJson(routingSummarySeaText);
			}
			
			routingSummaryRailText = this.get('line_item_rail_routing_summaries');
			routingSummaryRailObj = "";
			if(routingSummaryRailText){
				routingSummaryRailObj = new misys.openaccount.widget.RailRoutingSummaries();
				routingSummaryRailObj.createItemsFromJson(routingSummaryRailText);
			}
			
			routingSummaryRoadText = this.get('line_item_road_routing_summaries');
			routingSummaryRoadObj = "";
			if(routingSummaryRoadText){
				routingSummaryRoadObj = new misys.openaccount.widget.RoadRoutingSummaries();
				routingSummaryRoadObj.createItemsFromJson(routingSummaryRoadText);
			}
			
			shipmentScheduleText = this.get("line_item_shipment_schedules");
			shipmentScheduleObj = "";
			if(shipmentScheduleText){
				shipmentScheduleObj = new misys.openaccount.widget.ShipmentSubSchedules();
				shipmentScheduleObj.createItemsFromJson(shipmentScheduleText);
			}
			var item = {
				cust_ref_id: this.get('cust_ref_id'),
				po_reference: this.get('po_reference'),
				line_item_number: this.get('line_item_number'),
				product_name: this.get('product_name'),
				product_orgn: this.get('product_orgn'),
				qty_unit_measr_code: this.get('qty_unit_measr_code'),
				qty_unit_measr_label: this.get('qty_unit_measr_label'),
				qty_other_unit_measr: this.get('qty_other_unit_measr'),
				qty_val: this.get('qty_val'),
				qty_factor: this.get('qty_factor'),
				qty_tol_pstv_pct: this.get('qty_tol_pstv_pct'),
				qty_tol_neg_pct: this.get('qty_tol_neg_pct'),
				price_unit_measr_code: this.get('price_unit_measr_code'),
				price_unit_measr_label: this.get('price_unit_measr_label'),
				price_other_unit_measr: this.get('price_other_unit_measr'),
				price_cur_code: this.get('price_cur_code'),
				price_amt: this.get('price_amt'),
				price_factor: this.get('price_factor'),
				price_tol_pstv_pct: this.get('price_tol_pstv_pct'),
				price_tol_neg_pct: this.get('price_tol_neg_pct'),
				total_cur_code: this.get('total_cur_code'),
				total_amt: this.get('total_amt'),
				freight_charges_type: this.get('freight_charges_type'),
				total_net_cur_code: this.get('total_net_cur_code'),
				total_net_amt: this.get('total_net_amt'),
				last_ship_date: this.get('last_ship_date'),
				earliest_ship_date: this.get('earliest_ship_date'),
				line_item_product_identifiers: "",
				line_item_product_characteristics: "",
				line_item_product_categories: "",
				line_item_adjustments: "",
				line_item_taxes: "",
				line_item_freight_charges: "",
				line_item_incoterms: "",
				line_item_air_routing_summaries: "",
				line_item_sea_routing_summaries: "",
				line_item_rail_routing_summaries: "",
				line_item_road_routing_summaries: "",
				line_item_shipment_schedules: "",
				taking_in_charge: this.get("taking_in_charge"),
				final_dest_place: this.get("final_dest_place"),
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
		}
	}
);