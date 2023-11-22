dojo.provide("misys.openaccount.widget.LineItems");
dojo.experimental("misys.openaccount.widget.LineItems"); 

dojo.require("misys.grid.GridMultipleItems");
dojo.require("misys.openaccount.widget.LineItem");
dojo.require("misys.openaccount.widget.ProductIdentifiers");
dojo.require("misys.openaccount.widget.ProductCharacteristics");
dojo.require("misys.openaccount.widget.Adjustments");
dojo.require("misys.openaccount.widget.Taxes");
dojo.require("misys.openaccount.widget.FreightCharges");
dojo.require("misys.openaccount.widget.Incoterms");
dojo.require("misys.openaccount.widget.AirRoutingSummaries");
dojo.require("misys.openaccount.widget.SeaRoutingSummaries");
dojo.require("misys.openaccount.widget.RailRoutingSummaries");
dojo.require("misys.openaccount.widget.RoadRoutingSummaries");
dojo.require("misys.openaccount.widget.ShipmentSubSchedules");

/**
 * This widget stores the line items details for the Open account transactions.
 */
dojo.declare("misys.openaccount.widget.LineItems",
		[ misys.grid.GridMultipleItems ],
		// class properties:
		{
		data: { identifier: 'store_id', label: 'store_id', items: [] },
		
		templatePath: null,
		templateString: dojo.byId("line-items-template").innerHTML,
		dialogId: 'line-item-dialog-template',
		dialogAddItemTitle: misys.getLocalization('line-item-dialog'),
		xmlTagName: 'lineItems',
		xmlSubTagName: 'lineItem',
		
		gridColumns: ['cust_ref_id','line_item_number', 'product_name', 'product_orgn', 'qty_val',
		              'qty_unit_measr_code', 'qty_factor', 'qty_unit_measr_label',
		      		  'qty_tol_pstv_pct', 'qty_tol_neg_pct',
   		    		  'price_unit_measr_code', 'price_unit_measr_label', 'price_other_unit_measr',
		    		  'price_cur_code', 'price_amt',
		    		  'price_factor', 'price_tol_pstv_pct',
		    		  'price_tol_neg_pct', 'total_cur_code',
		    		  'total_amt', 'freight_charges_type',
		    		  'total_net_cur_code', 'total_net_amt', 'last_ship_date',
		              'product_identifiers',
		              'product_characteristics',
		              'product_categories',
		              'adjustments',
		              'taxes',
		              'shipment_schedules',
		              'freight_charges',
		              'incoterms','qty_other_unit_measr','po_reference','ref_id','earliest_ship_date', 
		              'air_routing_summaries','sea_routing_summaries','rail_routing_summaries','road_routing_summaries',
		              "taking_in_charge","final_dest_place",'qty_other_unit_measr',
		              'po_reference','ref_id','earliest_ship_date'],
        
		propertiesMap: {
			cust_ref_id: {_fieldName: 'line_item_nb'},
			po_reference: {_fieldName: 'line_item_po_reference'},
			line_item_number: {_fieldName: 'line_item_nb'},
			product_name: {_fieldName: 'line_item_product_name'},
			product_orgn: {_fieldName: 'line_item_product_orgn'},
			qty_unit_measr_code: {_fieldName: 'line_item_qty_unit_measr_code'},
			qty_unit_measr_label: {_fieldName: 'line_item_qty_unit_measr_label'},
			qty_other_unit_measr: {_fieldName: 'line_item_qty_unit_measr_other'},
			qty_val: {_fieldName: 'line_item_qty_val'},
			qty_factor: {_fieldName: 'line_item_qty_factor'},
			qty_tol_pstv_pct: {_fieldName: 'line_item_qty_tol_pstv_pct'},
			qty_tol_neg_pct: {_fieldName: 'line_item_qty_tol_neg_pct'},
			price_unit_measr_code: {_fieldName: 'line_item_price_unit_measr_code'},
			price_unit_measr_label: {_fieldName: 'line_item_price_unit_measr_label'},
			price_other_unit_measr: {_fieldName: 'line_item_price_other_unit_measr'},
			price_cur_code: {_fieldName: 'line_item_price_cur_code'},
			price_amt: {_fieldName: 'line_item_price_amt'},
			price_factor: {_fieldName: 'line_item_price_factor'},
			price_tol_pstv_pct: {_fieldName: 'line_item_price_tol_pstv_pct'},
			price_tol_neg_pct: {_fieldName: 'line_item_price_tol_neg_pct'},
			total_cur_code: {_fieldName: 'line_item_total_cur_code'},
			total_amt: {_fieldName: 'line_item_total_amt'},
			freight_charges_type: {_fieldName: 'line_item_freight_charges_type'},
			total_net_cur_code: {_fieldName: 'line_item_total_net_cur_code'},
			total_net_amt: {_fieldName: 'line_item_total_net_amt'},
			last_ship_date: {_fieldName: 'line_item_last_ship_date'},
			earliest_ship_date: {_fieldName: 'line_item_earliest_ship_date'},
			product_identifiers: {_fieldName: 'line_item_product_identifiers', _type: 'misys.openaccount.widget.ProductIdentifiers'},
			product_characteristics: {_fieldName: 'line_item_product_characteristics', _type: 'misys.openaccount.widget.ProductCharacteristics'},
			product_categories: {_fieldName: 'line_item_product_categories', _type: 'misys.openaccount.widget.ProductCategories'},
			adjustments: {_fieldName: 'line_item_adjustments', _type: 'misys.openaccount.widget.Adjustments'},
			taxes: {_fieldName: 'line_item_taxes', _type: 'misys.openaccount.widget.Taxes'},
			freight_charges: {_fieldName: 'line_item_freight_charges', _type: 'misys.openaccount.widget.FreightCharges'},
			incoterms: {_fieldName: 'line_item_incoterms', _type: 'misys.openaccount.widget.Incoterms'} ,
			air_routing_summaries: {_fieldName: 'line_item_air_routing_summaries', _type: 'misys.openaccount.widget.AirRoutingSummaries'} ,
			sea_routing_summaries: {_fieldName: 'line_item_sea_routing_summaries', _type: 'misys.openaccount.widget.SeaRoutingSummaries'} ,
			rail_routing_summaries: {_fieldName: 'line_item_rail_routing_summaries', _type: 'misys.openaccount.widget.RailRoutingSummaries'} ,
			road_routing_summaries: {_fieldName: 'line_item_road_routing_summaries', _type: 'misys.openaccount.widget.RoadRoutingSummaries'} ,
			shipment_schedules: {_fieldName: 'line_item_shipment_schedules', _type: 'misys.openaccount.widget.ShipmentSubSchedules'} ,
			taking_in_charge: {_fieldName: 'line_item_taking_in_charge'},
			final_dest_place: {_fieldName: 'line_item_final_dest_place'},
			ref_id: {_fieldName: "ref_id"}
		},
        
		layout: [
				{ name: 'Line Item Nb', field: 'cust_ref_id', width: '10%' },
				{ name: 'Product Name', field: 'product_name', width: '30%' },
				{ name: 'Quantity',  get: misys.getQuantity, width: '20%' },
				{ name: 'Ccy', field: 'total_net_cur_code', width: '10%', classes: 'align-center' },
				{ name: 'Net Amt', field: 'total_net_amt', get: misys.getTotalNetAmount, width: '20%', classes: 'align-right' },
				{ name: ' ', field: 'actions', formatter: misys.grid.formatReportActions, width: '10%' },
				{ name: 'Id', field: 'store_id', headerStyles: 'display:none', cellStyles: 'display:none' }
				],
				
		typeMap: {
			'misys.openaccount.widget.ProductIdentifiers' : {
				'type': Array,
				'deserialize': function(value) {
					var item = {};
					item._type = 'misys.openaccount.widget.ProductIdentifiers';
					item._values = value;
					return item;
				}
			},
			'misys.openaccount.widget.ProductCharacteristics' : {
				'type': Array,
				'deserialize': function(value) {
					var item = {};
					item._type = 'misys.openaccount.widget.ProductCharacteristics';
					item._values = value;
					return item;
				}
			},
			'misys.openaccount.widget.ProductCategories' : {
				'type': Array,
				'deserialize': function(value) {
					var item = {};
					item._type = 'misys.openaccount.widget.ProductCategories';
					item._values = value;
					return item;
				}
			},
			'misys.openaccount.widget.Adjustments' : {
				'type': Array,
				'deserialize': function(value) {
					var item = {};
					item._type = 'misys.openaccount.widget.Adjustments';
					item._values = value;
					return item;
				}
			},
			'misys.openaccount.widget.Taxes' : {
				'type': Array,
				'deserialize': function(value) {
					var item = {};
					item._type = 'misys.openaccount.widget.Taxes';
					item._values = value;
					return item;
				}
			},
			'misys.openaccount.widget.FreightCharges' : {
				'type': Array,
				'deserialize': function(value) {
					var item = {};
					item._type = 'misys.openaccount.widget.FreightCharges';
					item._values = value;
					return item;
				}
			},
			'misys.openaccount.widget.Incoterms' : {
				'type': Array,
				'deserialize': function(value) {
					var item = {};
					item._type = 'misys.openaccount.widget.Incoterms';
					item._values = value;
					return item;
				}
			},
			'misys.openaccount.widget.AirRoutingSummaries' : {
				'type': Array,
				'deserialize': function(value) {
					var item = {};
					item._type = 'misys.openaccount.widget.AirRoutingSummaries';
					item._values = value;
					return item;
				}
			},
			'misys.openaccount.widget.SeaRoutingSummaries' : {
				'type': Array,
				'deserialize': function(value) {
					var item = {};
					item._type = 'misys.openaccount.widget.SeaRoutingSummaries';
					item._values = value;
					return item;
				}
			},
			'misys.openaccount.widget.RailRoutingSummaries' : {
				'type': Array,
				'deserialize': function(value) {
					var item = {};
					item._type = 'misys.openaccount.widget.RailRoutingSummaries';
					item._values = value;
					return item;
				}
			},
			'misys.openaccount.widget.RoadRoutingSummaries' : {
				'type': Array,
				'deserialize': function(value) {
					var item = {};
					item._type = 'misys.openaccount.widget.RoadRoutingSummaries';
					item._values = value;
					return item;
				}
			},
			'misys.openaccount.widget.ShipmentSubSchedules' : {
				'type': Array,
				'deserialize': function(value) {
					var item = {};
					item._type = 'misys.openaccount.widget.ShipmentSubSchedules';
					item._values = value;
					return item;
				}
			}
		},
        
		mandatoryFields: [ "line_item_number", "product_name", "qty_unit_measr_code", "qty_val", "price_amt" ],

		startup: function(){
			console.debug("[LineItems] startup start");
			
			// TODO: refer to GridMultipleItems#createJsonItem
			/*
			// Prepare data store
			this.dataList = [];
			if(this.hasChildren())
			{
				dojo.forEach(this.getChildren(), function(child){
					// Mark the child as started.
					// This will prevent Dojo from parsing the child
					// as we don't want to make it appear on the form now.
					if (child.createItem)
					{
						var item = child.createItem();
						this.dataList.push(item);
					}
					// Hide children as only the master Dojo grid is displayed
//					dojo.attr(child.domNode, 'style', {display: 'none'});
				}, this);
			}
			*/
			
			this.inherited(arguments);
			
			console.debug("[LineItems] startup end");
		},
    	
		openDialogFromExistingItem: function(items, request)
		{
			console.debug("[LineItems] openDialogFromExistingItem start");
			
			if(items && items[0] && items[0].product_name && items[0].product_name[0])
			{
				items[0].product_name[0] = dojox.html.entities.decode(items[0].product_name[0], dojox.html.entities.html);
			}
			
			if(items && items[0] && items[0].cust_ref_id && items[0].cust_ref_id[0])
			{
				items[0].cust_ref_id[0] = dojox.html.entities.decode(items[0].cust_ref_id[0], dojox.html.entities.html);
			}
			
			this.inherited(arguments);
			
			// Disable shipment dates if shipment sub schedule exists
			if(dijit.byId("line_item_shipment_schedules") && dijit.byId("line_item_shipment_schedules").store && dijit.byId("line_item_shipment_schedules").store._arrayOfTopLevelItems.length > 0) {
				dijit.byId("line_item_last_ship_date")? dijit.byId("line_item_last_ship_date").set("disabled",true):"";
				dijit.byId("line_item_earliest_ship_date")? dijit.byId("line_item_earliest_ship_date").set("disabled",true):"";
			}
			else if((dijit.byId("last_ship_date") && dijit.byId("last_ship_date").get("value")!== null) || (dijit.byId("earliest_ship_date") && dijit.byId("earliest_ship_date").get("value")!== null)){
				dijit.byId("line_item_last_ship_date")? dijit.byId("line_item_last_ship_date").set("disabled",true):"";
				dijit.byId("line_item_earliest_ship_date")? dijit.byId("line_item_earliest_ship_date").set("disabled",true):"";
			}
			else {
				dijit.byId("line_item_last_ship_date")? dijit.byId("line_item_last_ship_date").set("disabled",false):"";
				dijit.byId("line_item_earliest_ship_date")? dijit.byId("line_item_earliest_ship_date").set("disabled",false):"";
			}
			// toggle shipment details
			misys.toggleShipmentDetails();
			// toggle multi modal transport details
			misys.toggleMultimodalTransportDetails();
			console.debug("[LineItems] openDialogFromExistingItem end");
		},
		
		resetDialog: function(items, request)
		{
			console.debug("[LineItems] resetDialog start");
			
			this.inherited(arguments);
			
			//not very good line items not always connected to total_cur_code field
			if (dijit.byId('total_cur_code')){
				var poCurCode = dijit.byId('total_cur_code').get('value');
				// Update existing line items
				dijit.byId('line_item_total_cur_code').set('value', poCurCode);
				dijit.byId('line_item_price_cur_code').set('value', poCurCode);
				dijit.byId('line_item_total_net_cur_code').set('value', poCurCode);
			}
			console.debug("[LineItems] resetDialog end");
		},

		createDataGrid: function()
		{
			this.inherited(arguments);
			var grid = this.grid;
			misys.connect(grid, "onSet", misys.computeLineItemAmount);
			misys.connect(grid, "onNew", misys.computeLineItemAmount);
			misys.connect(grid, "onDelete",
					function(){
						misys.dialog.connect(dijit.byId("okButton"), "onMouseUp", function(){
							setTimeout(function(){
								dojo.hitch(misys, "computeLineItemAmount");
								if(misys._config._hasLineItemShipmentDate)
								{
									misys._config._hasLineItemShipmentDate();
								}
								misys.computePOTotalAmount();
							}, 1000);
						}, "alertDialog");
				});
		},

		addItem: function(event)
		{
			console.debug("[LineItems] addItem start");
			
			this.inherited(arguments);
			// toggle shipment details
			misys.toggleShipmentDetails();
			// toggle multi modal transport details
			misys.toggleMultimodalTransportDetails();
			console.debug("[LineItems] addItem end");
		},
		updateData: function(event)
		{
			console.debug("[LineItems] updateData start");
			
			this.inherited(arguments);
			
			misys.computePOTotalAmount();
			
			if(misys._config._hasLineItemShipmentDate)
			{
				misys._config._hasLineItemShipmentDate();
			}
			// Handle disabling of shipment dates outisde line items
			if(misys.hasLineItemShipmentPeriodDefined()) {
				dijit.byId("last_ship_date")? dijit.byId("last_ship_date").set("disabled",true):"";
				dijit.byId("earliest_ship_date")? dijit.byId("earliest_ship_date").set("disabled",true):"";
			}
			else {
				dijit.byId("last_ship_date")? dijit.byId("last_ship_date").set("disabled",false):"";
				dijit.byId("earliest_ship_date")? dijit.byId("earliest_ship_date").set("disabled",false):"";
			}
			console.debug("[LineItems] updateData end");
			misys.markFormDirty();
		},
		performValidation: function()
		{
			console.debug("[LineItems] validate start");
			if(this.validateDialog(true))
			{
				//To check the Line item number is unique. 
				if(this.grid && this.grid.store && this.grid.store._arrayOfTopLevelItems)
				{ 
					var lineItemNumberUnique=true;
					var lineItemNumber = dijit.byId("line_item_nb").get("value");
					var storeId = this.grid.gridMultipleItemsWidget.dialog.storeId;
					this.grid.store.fetch({
						query:{store_id:"*"},
						onComplete: dojo.hitch(this.grid, function(items, request){
							dojo.forEach(items, function(item)
							{
								//Modifying an existing Line Item record check.
								if(storeId)
								{
									if(item.line_item_number[0].toUpperCase() == lineItemNumber.toUpperCase() && (item.store_id[0]!=storeId))
									{	
										lineItemNumberUnique=false;
										misys.dialog.show("ERROR", misys.getLocalization("lineItemNumberCheck"));
									}
								}
								//Adding a new Line Item record check.
								else if(item.line_item_number[0].toUpperCase() == lineItemNumber.toUpperCase() )
							     {
										lineItemNumberUnique=false;
										misys.dialog.show("ERROR", misys.getLocalization("lineItemNumberCheck"));
								  }
							});
						})
					});
					if(lineItemNumberUnique){
						this.inherited(arguments);
					}
				}
				else
				{
					this.inherited(arguments);
				}
			}
			console.debug("[LineItems] validate end");
		}
	}
);