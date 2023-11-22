dojo.provide("misys.purchaseorder.widget.PurchaseOrders");

dojo.require("misys.grid.GridMultipleItems");
dojo.require("misys.purchaseorder.widget.PurchaseOrder");
dojo.require("misys.purchaseorder.FormPurchaseOrderEvents");
dojo.require("misys.validation.common");

//our declared class
dojo.declare("misys.purchaseorder.widget.PurchaseOrders",
		[ misys.grid.GridMultipleItems ],
		// class properties:
		{
		data: { identifier: 'store_id', label: 'store_id', items: [] },
		
		templatePath: null,
		templateString: dojo.byId("line-item-template").innerHTML,
		dialogId: 'line-item-dialog-template',
		dialogAddItemTitle: misys.getLocalization('line-item-dialog'),
		xmlTagName: 'lineItems',
		xmlSubTagName: 'lineItem',
		
		gridColumns: ['cust_ref_id','line_item_number', 'product_name', 'qty_val',
		              'qty_unit_measr_code', 'qty_unit_measr_label',
		      		  'qty_tol_pstv_pct', 'qty_tol_neg_pct',
   		    		  'price_unit_measr_code', 'price_unit_measr_label', 'price_other_unit_measr',
		    		  'price_cur_code', 'price_amt',
		    		  'price_tol_pstv_pct',
		    		  'price_tol_neg_pct','total_cur_code',
		    		  'total_amt',
		    		  'total_net_cur_code', 'total_net_amt', 'qty_other_unit_measr','po_reference','ref_id'],
		    		  
		propertiesMap: {
			cust_ref_id: {_fieldName: 'line_item_nb'},
			po_reference: {_fieldName: 'line_item_po_reference'},
			line_item_number: {_fieldName: 'line_item_nb'},
			product_name: {_fieldName: 'line_item_product_name'},
			qty_unit_measr_code: {_fieldName: 'line_item_qty_unit_measr_code'},
			qty_unit_measr_label: {_fieldName: 'line_item_qty_unit_measr_label'},
			qty_other_unit_measr: {_fieldName: 'line_item_qty_unit_measr_other'},
			qty_val: {_fieldName: 'line_item_qty_val'},
			qty_tol_pstv_pct: {_fieldName: 'line_item_qty_tol_pstv_pct'},
			qty_tol_neg_pct: {_fieldName: 'line_item_qty_tol_neg_pct'},
			price_unit_measr_code: {_fieldName: 'line_item_price_unit_measr_code'},
			price_unit_measr_label: {_fieldName: 'line_item_price_unit_measr_label'},
			price_other_unit_measr: {_fieldName: 'line_item_price_other_unit_measr'},
			price_cur_code: {_fieldName: 'line_item_price_cur_code'},
			price_amt: {_fieldName: 'line_item_price_amt'},
			price_tol_pstv_pct: {_fieldName: 'line_item_price_tol_pstv_pct'},
			price_tol_neg_pct: {_fieldName: 'line_item_price_tol_neg_pct'},
			total_cur_code: {_fieldName: 'line_item_total_cur_code'},
			total_amt: {_fieldName: 'line_item_total_amt'},
			total_net_cur_code: {_fieldName: 'line_item_total_net_cur_code'},
			total_net_amt: {_fieldName: 'line_item_total_net_amt'},
			ref_id: {_fieldName: "ref_id"}
		},
        
		layout: [
				{ name: 'Number', field: 'qty_val', width: '15%'},
				{ name: 'Unit Measure', get: misys.getUnitMesureLocalization, width: '15%'},
				{ name: 'Description', field: 'product_name', width: '40%' },
				{ name: 'Amount', get: misys.getPriceAmount, width: '12%' , classes: 'align-right'},
				{ name: 'Currency', field: 'price_cur_code', width: '8%' ,classes: 'align-center'},
				{ name: ' ', field: 'actions', formatter: misys.grid.formatReportActions, width: '10%'},
				{ name: 'Id', field: 'store_id', headerStyles: 'display:none', cellStyles: 'display:none'}
				],
				
		mandatoryFields: [ "product_name", "qty_unit_measr_code", "qty_val", "price_amt" ],

		startup: function(){
			console.debug("[PurchaseOrders] startup start");
			
			
			this.inherited(arguments);
			
			console.debug("[PurchaseOrders] startup end");
		},
    	
		openDialogFromExistingItem: function(items, request)
		{
			console.debug("[PurchaseOrders] openDialogFromExistingItem start");
			if(items && items[0] && items[0].product_name && items[0].product_name[0])
			{
				items[0].product_name[0] = dojox.html.entities.decode(items[0].product_name[0], dojox.html.entities.html);
			}
			this.inherited(arguments);
			

			console.debug("[PurchaseOrders] openDialogFromExistingItem end");
		},
		
		resetDialog: function(items, request)
		{
			console.debug("[PurchaseOrders] resetDialog start");
			
			this.inherited(arguments);
			
			//not very good line items not always connected to total_cur_code field
			if (dijit.byId('lc_cur_code')){
				var poCurCode = dijit.byId('lc_cur_code').get('value');
				// Update existing line items
				dijit.byId('line_item_total_cur_code').set('value', poCurCode);
				dijit.byId('line_item_price_cur_code').set('value', poCurCode);
				dijit.byId('line_item_total_net_cur_code').set('value', poCurCode);
			}
			console.debug("[PurchaseOrders] resetDialog end");
		},

		createDataGrid: function()
		{
			this.inherited(arguments);
			var grid = this.grid;
			
			misys.connect(grid, "onSet", misys.computeLineItemAmount);
			misys.connect(grid, "onNew", misys.computeLineItemAmount);
			
			//Modification of description of goods 
			misys.connect(grid.store, "onSet", function(){
				misys.fncUpdateDescriptionOfGoods();
			});
			
			//Adding of description of goods 
			misys.connect(grid.store, "onNew", function(){
				misys.fncUpdateDescriptionOfGoods();
			});
			
			//Deletion of  any record from grid
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
								misys.fncUpdateDescriptionOfGoods();
							}, 1000);
						}, "alertDialog");
						
				});
			
		},

		addItem: function(event)
		{
			console.debug("[PurchaseOrders] addItem start");
			
			this.inherited(arguments);
			
			console.debug("[PurchaseOrders] addItem end");
		},
		updateData: function(event)
		{
			console.debug("[PurchaseOrders] updateData start");
			
			this.inherited(arguments);
			
			misys.computePOTotalAmount();
			
			if(misys._config._hasLineItemShipmentDate)
			{
				misys._config._hasLineItemShipmentDate();
			}
			
			console.debug("[PurchaseOrders] updateData end");
		},
		performValidation: function()
		{
			console.debug("[PurchaseOrders] validate start");
			if(this.validateDialog(true))
			{
				this.inherited(arguments);
			}
			console.debug("[PurchaseOrders] validate end");
		},
		
        
		itemToXML: function(items, xmlSubTagName)
		{
			//var decodedValue = dojox.html.entities.decode(items[0].content[0], dojox.html.entities.html);
			var xml = [];
			dojo.forEach(items, function(item){
				if(item) {
					if(xmlSubTagName) {
						xml.push("<", xmlSubTagName, ">");
					}
					for(var property in item)
					{
						// Process a sub-grid included in this item
						var value = dojo.isArray(item[property]) ? item[property][0] : item[property];
						if (dojo.isObject(value) && value._type)
						{
							var classname = value._type;
							var clazz = dojo.eval(classname);
							var multipleItems = new clazz({});
							xml.push('<', multipleItems.xmlTagName, '>');
							xml.push(this.itemToXML(value._values, multipleItems.xmlSubTagName, xml));
							xml.push('</', multipleItems.xmlTagName ,'>');
						}
						// Otherwise, process a property of the item 
						else if(property != 'store_id' && property.match('^_') != '_')
						{
							value = dojo.isArray(item[property]) ? item[property][0] : item[property];
							value += '';
							xml.push('<', property, '>', value, '</', property, '>');
						}
					}
					if(xmlSubTagName) {
						xml.push('</', xmlSubTagName, '>');
					}
				}
			}, this);
		
			return xml.join("");
		}
		
	}
);