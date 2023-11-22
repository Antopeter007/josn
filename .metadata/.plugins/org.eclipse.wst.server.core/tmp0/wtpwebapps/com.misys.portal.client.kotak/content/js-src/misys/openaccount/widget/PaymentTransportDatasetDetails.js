
dojo.provide("misys.openaccount.widget.PaymentTransportDatasetDetails");
dojo.experimental("misys.openaccount.widget.PaymentTransportDatasetDetails"); 

dojo.require("misys.grid.GridMultipleItems");
dojo.require("misys.openaccount.widget.PaymentTransportDatasetDetail");
dojo.require("misys.openaccount.widget.TransportDocumentReferences");
dojo.require("misys.openaccount.widget.TransportedGoodsDetails");
dojo.require("misys.openaccount.widget.ConsignmentQtyDetails");
dojo.require("misys.openaccount.widget.ConsignmentVolDetails");
dojo.require("misys.openaccount.widget.ConsignmentWeightDetails");

// our declared class
dojo.declare("misys.openaccount.widget.PaymentTransportDatasetDetails",
		[ misys.grid.GridMultipleItems ],
		// class properties:
		{
		data: { identifier: "store_id", label: "store_id", items: [] },
		handle: null,
		templatePath: null,
		templateString: dojo.byId("payment-transport-ds-details-template").innerHTML,
		dialogId: "payment-transport-ds-details-dialog-template",
		xmlTagName: "TrnsprtDataSet",
		
		gridColumns: ["payment_tds_version","payment_tds_id","payment_tds_bic","payment_tds_prop_date","payment_tds_actual_date","payment_tds_dataset_transported_goods","payment_tds_dataset_transport_doc_ref","consignment_qty_details_id","consignment_vol_details_id","consignment_weight_details_id"],
        
		propertiesMap: {
			payment_tds_version: {_fieldName: "payment_tds_version"},
			payment_tds_id: {_fieldName: "payment_tds_id"},
			payment_tds_bic: {_fieldName: "payment_tds_bic"},
			payment_tds_prop_date: {_fieldName: "payment_tds_prop_date"},
			payment_tds_actual_date: {_fieldName: "payment_tds_actual_date"},
			transportedGoods:{_fieldName: "payment_tds_dataset_transported_goods", _type: "misys.openaccount.widget.TransportedGoodsDetails"},
			transportDocReference:{_fieldName: "payment_tds_dataset_transport_doc_ref", _type: "misys.openaccount.widget.TransportDocumentReferences"},
			consignmentQtyDtls:{_fieldName: "consignment_qty_details_id", _type: "misys.openaccount.widget.TransportDocumentReferences"},
			consignmentVolDtls:{_fieldName: "consignment_vol_details_id", _type: "misys.openaccount.widget.TransportDocumentReferences"},
			consignmentWeightDtls:{_fieldName: "consignment_weight_details_id", _type: "misys.openaccount.widget.TransportDocumentReferences"}
			},
			
		dataSetIdMap : {
			payment_tds_version: {_fieldName: "payment_tds_version"},
			payment_tds_id: {_fieldName: "payment_tds_id"},
			bic: {_fieldName: "payment_tds_bic"},
			payment_tds_prop_date: {_fieldName: "payment_tds_prop_date"},
			payment_tds_actual_date: {_fieldName: "payment_tds_actual_date"}
		},

		transportedGoodsMap : {
			payment_tds_po_ref_id: {_fieldName: "payment_tds_po_ref_id"},
			payment_tds_goods_desc: {_fieldName: "payment_tds_goods_desc"}			
		},
		
		consgQtyMap : {
			pmt_tds_qty_unit_measr_code: {_fieldName: "pmt_tds_qty_unit_measr_code"},
			pmt_tds_qty_unit_measr_other: {_fieldName: "pmt_tds_qty_unit_measr_other"},
			pmt_tds_qty_val: {_fieldName: "pmt_tds_qty_val"}			
		},
		
		consgVolMap : {
			pmt_tds_vol_unit_measr_code: {_fieldName: "pmt_tds_vol_unit_measr_code"},
			pmt_tds_vol_unit_measr_other: {_fieldName: "pmt_tds_vol_unit_measr_other"},
			pmt_tds_vol_val: {_fieldName: "pmt_tds_vol_val"}			
		},
		
		consgWeightMap : {
			pmt_tds_weight_unit_measr_code: {_fieldName: "pmt_tds_weight_unit_measr_code"},
			pmt_tds_weight_unit_measr_other: {_fieldName: "pmt_tds_weight_unit_measr_other"},
			pmt_tds_weight_val: {_fieldName: "pmt_tds_weight_val"}
		},
		
		transportedDocRefMap : {
			payment_tds_doc_id: {_fieldName: "payment_tds_doc_id"},
			payment_tds_doc_iss_date: {_fieldName: "payment_tds_doc_iss_date"}			
		},
		
		layout: [
		        { name: "ID", field: "payment_tds_id", width: "30%" },
				{ name: "Bic", field: "payment_tds_bic", width: "30%" },
				{ name: "Version", field: "payment_tds_version", width:"30%"},
				{ name: " ", field: "actions", formatter: misys.grid.formatReportActions, width: "10%" },
				{ name: "Id", field: "store_id", headerStyles: "display:none", cellStyles: "display:none" }
				],
		typeMap: {
			'misys.openaccount.widget.TransportedGoodsDetails' : {
				'type': Array,
				'deserialize': function(value) {
					var item = {};
					item._type = 'misys.openaccount.widget.TransportedGoodsDetails';
					item._values = value;
					return item;
				}
			},
			'misys.openaccount.widget.TransportDocumentReferences' : {
				'type': Array,
				'deserialize': function(value) {
					var item = {};
					item._type = 'misys.openaccount.widget.TransportDocumentReferences';
					item._values = value;
					return item;
				}
			},
			'misys.openaccount.widget.ConsignmentWeightDetails' : {
				'type': Array,
				'deserialize': function(value) {
					var item = {};
					item._type = 'misys.openaccount.widget.ConsignmentWeightDetails';
					item._values = value;
					return item;
				}
			},
			'misys.openaccount.widget.ConsignmentQtyDetails' : {
				'type': Array,
				'deserialize': function(value) {
					var item = {};
					item._type = 'misys.openaccount.widget.ConsignmentQtyDetails';
					item._values = value;
					return item;
				}
			},
			'misys.openaccount.widget.ConsignmentVolDetails' : {
				'type': Array,
				'deserialize': function(value) {
					var item = {};
					item._type = 'misys.openaccount.widget.ConsignmentVolDetails';
					item._values = value;
					return item;
				}
			}	
		},
        
        mandatoryFields: ["payment_tds_bic"],
        
		startup: function(){
			console.debug("[transport Dataset] startup start");			
			this.inherited(arguments);
			console.debug("[transport Dataset] startup end");
		},
    	
		openDialogFromExistingItem: function(items, request)
		{
			console.debug("[transport Dataset] openDialogFromExistingItem start");
			
			this.inherited(arguments);

			console.debug("[transport Dataset] openDialogFromExistingItem end");
		},
		
		addItem: function(event)
		{
			console.debug("[transport Dataset] addItem start");

			this.inherited(arguments);
			
			console.debug("[transport Dataset] addItem end");
		},
		
		createDataGrid: function()
		{
			this.inherited(arguments);
			var grid = this.grid;
			var widgetPmtTrnsprtDs = dijit.byId("payment-transport-ds-details");
			misys.connect(grid, "onDelete",
					function(){
						misys.dialog.connect(dijit.byId("okButton"), "onMouseUp", function(){
							widgetPmtTrnsprtDs.addButtonNode.set("disabled", false);
						}, "alertDialog");
			});
		},
		
		createJsonItem: function()
		{
			var jsonEntry = [];
			if(this.hasChildren && this.hasChildren())
			{
				dojo.forEach(this.getChildren(), function(child){
					if (child.createItem)
					{
						var item = child.createItem();
						jsonEntry.push(item);
						if (this.get("is_valid") !== "N")
						{
							this.set("is_valid", item.is_valid ? item.is_valid : "Y");
						}
						misys._widgetsToDestroy = misys._widgetsToDestroy || [];
						misys._widgetsToDestroy.push(child.id);
					}
				}, this);
			}
			return jsonEntry;
			
		},
		
		updateData : function()
		{
			console.debug("[transport Dataset] updateData start");
			this.inherited(arguments);
			//Disable Add transport data set button, after transport data set is added.
			dijit.byId("add_pymt_transport_ds_button").set("disabled",true);
			
			console.debug("[transport Dataset] updateData end");
		},
		
		toXML: function(){
			var xml = [];
			
			xml.push("<payment_transport_dataset>");
			xml.push("<![CDATA[");
			if(this.grid)
			{
				this.grid.store.fetch({query: {store_id: '*'}, 
						onComplete: dojo.hitch(this, function(items, request){
					xml.push(this.itemToXML(items));
				})});
			}
			xml.push("]]>");
			xml.push("</payment_transport_dataset>");
			
			return xml.join("");
		},
		
		itemToXML: function(items)
		{
			var xml = [];
			var postalAddXml = '';
			
			dojo.forEach(items, function(item){
				dataSetIdentificationXML = '';
				dataSetIdentificationXML=dataSetIdentificationXML.concat("<DataSetId>");
				transportedGoods='';
				transportedGoods=transportedGoods.concat("<TrnsprtdGoods>");
				transportDocRef='';
				transportDocRef=transportDocRef.concat("<TrnsprtDocRef>");
				consgWeight='';
				consgQty='';
				consgVol='';
				consgnXML = '';
				consgnXML=consgnXML.concat("<Consgnmt>");
				
				if(item) {
					if(this.xmlTagName) {
						xml.push("<", this.xmlTagName, ">");
					}
					for(var property in item)
					{
						if(property != 'store_id' && property.match('^_') != '_')
						{
							value = dojo.isArray(item[property]) ? item[property][0] : item[property];
							value += '';
							
							for(var property1 in this.dataSetIdMap) {
								if(this.dataSetIdMap[property1]._fieldName === property)
								{
									dataSetIdentificationXML = dataSetIdentificationXML.concat('<').concat(property1).concat('>').concat(dojox.html.entities.encode(value, dojox.html.entities.html)).concat('</').concat(property1).concat('>');
									//xml.push('<', property1, '>', dojox.html.entities.encode(value, dojox.html.entities.html), '</', property1, '>');
									break;
								}
							}

							if(property === "payment_tds_dataset_transported_goods" && item[property][0]._values)
							{
								var goodsLength = item[property][0]._values.length;
								var arrayTransportedGoods = item[property][0]._values;
								for(var i=0; i<goodsLength ; i++)
								{
									transportedGoods = transportedGoods.concat('<TrnsprtdGoodsDtls>');
									var p2 = arrayTransportedGoods[i];
									for(var property2 in p2) {
										value = p2[property2];
										value += "";
										for(var property3 in this.transportedGoodsMap) {
											if(this.transportedGoodsMap[property3]._fieldName === property2)
											{
												transportedGoods = transportedGoods.concat('<').concat(property3).concat('>').concat(dojox.html.entities.encode(value, dojox.html.entities.html)).concat('</').concat(property3).concat('>');
												break;
											}
										}
									}
									transportedGoods = transportedGoods.concat('</TrnsprtdGoodsDtls>');
								}
								
							}
							
							if(property === "payment_tds_dataset_transport_doc_ref" && item[property][0]._values)
							{
								var docRefLength = item[property][0]._values.length;
								var arrayDocRef = item[property][0]._values;
								for(var k=0; k<docRefLength ; k++)
								{
									transportDocRef = transportDocRef.concat('<TrnsprtDocRefDtls>');
									var p1 = arrayDocRef[k];
									for(var property4 in p1) {
										value = p1[property4];
										value += "";
										for(var property5 in this.transportedDocRefMap) {
											if(this.transportedDocRefMap[property5]._fieldName === property4)
											{
												transportDocRef = transportDocRef.concat('<').concat(property5).concat('>').concat(dojox.html.entities.encode(value, dojox.html.entities.html)).concat('</').concat(property5).concat('>');
												break;
											}
										}
									}
									transportDocRef = transportDocRef.concat('</TrnsprtDocRefDtls>');
								}								
							}
							
							if(property === "consignment_weight_details_id" && item[property][0]._values)
							{
								var consgWeightLength = item[property][0]._values.length;
								var arrayconsgWeight = item[property][0]._values;
								for(var l=0; l<consgWeightLength ; l++)
								{
									consgWeight = consgWeight.concat('<TtlWght>');
									var p5 = arrayconsgWeight[l];
									for(var property6 in p5) {
										value = p5[property6];
										value += "";
										for(var property7 in this.consgWeightMap) {
											if(this.consgWeightMap[property7]._fieldName === property6)
											{
												consgWeight = consgWeight.concat('<').concat(property7).concat('>').concat(dojox.html.entities.encode(value, dojox.html.entities.html)).concat('</').concat(property7).concat('>');
												break;
											}
										}
									}
									consgWeight = consgWeight.concat('</TtlWght>');
								}								
							}
							
							if(property === "consignment_qty_details_id" && item[property][0]._values)
							{
								var consgQtyLength = item[property][0]._values.length;
								var arrayconsgQty = item[property][0]._values;
								for(var m=0; m<consgQtyLength ; m++)
								{
									consgQty = consgQty.concat('<TtlQty>');
									var p3 = arrayconsgQty[m];
									for(var property8 in p3) {
										value = p3[property8];
										value += "";
										for(var property9 in this.consgQtyMap) {
											if(this.consgQtyMap[property9]._fieldName === property8)
											{
												consgQty = consgQty.concat('<').concat(property9).concat('>').concat(dojox.html.entities.encode(value, dojox.html.entities.html)).concat('</').concat(property9).concat('>');
												break;
											}
										}
									}
									consgQty = consgQty.concat('</TtlQty>');
								}								
							}
							
							if(property === "consignment_vol_details_id" && item[property][0]._values)
							{
								var consgVolLength = item[property][0]._values.length;
								var arrayconsgVol = item[property][0]._values;
								for(var n=0; n<consgVolLength ; n++)
								{
									consgVol = consgVol.concat('<TtlVol>');
									var p4 = arrayconsgVol[n];
									for(var property10 in p4) {
										value = p4[property10];
										value += "";
										for(var property11 in this.consgVolMap) {
											if(this.consgVolMap[property11]._fieldName === property10)
											{
												consgVol = consgVol.concat('<').concat(property11).concat('>').concat(dojox.html.entities.encode(value, dojox.html.entities.html)).concat('</').concat(property11).concat('>');
												break;
											}
										}
									}
									consgVol = consgVol.concat('</TtlVol>');
								}								
							}
						}
					}
					
					dataSetIdentificationXML = dataSetIdentificationXML.concat('</DataSetId>');
					transportedGoods = transportedGoods.concat('</TrnsprtdGoods>');
					transportDocRef = transportDocRef.concat('</TrnsprtDocRef>');
					consgnXML = consgnXML.concat(consgQty).concat(consgVol).concat(consgWeight).concat('</Consgnmt>');
					xml.push(dataSetIdentificationXML);
					xml.push(transportedGoods);
					xml.push(transportDocRef);
					xml.push(consgnXML);
					if(this.xmlTagName) {
						xml.push("</", this.xmlTagName, ">");
					}
				}
			}, this);
							
			return xml.join("");
		},

		
		createItemsFromJson: function(jsonMsg)
		{
			console.debug("[transport Dataset] createItemsFromJson start");
			
			this.inherited(arguments);
			
			console.debug("[transport Dataset] createItemsFromJson end");
		},
		
		performValidation : function()
		{
			console.debug("[transport Dataset] validate start");
			var valid = true;
			if(this.validateDialog(true)) 
			{
				var gridTrnsportDoc = dijit.byId("payment_tds_dataset_transport_doc_ref");
				if(!(gridTrnsportDoc && gridTrnsportDoc.store && gridTrnsportDoc.store._arrayOfTopLevelItems.length > 0)) {
					valid = false;
					misys.dialog.show("ERROR", misys.getLocalization("transportDocRefError"));
				}
				
				var gridTrnsportedGoods = dijit.byId("payment_tds_dataset_transported_goods");
				if(valid && !(gridTrnsportedGoods && gridTrnsportedGoods.store && gridTrnsportedGoods.store._arrayOfTopLevelItems.length > 0)) {
					valid = false;
					misys.dialog.show("ERROR", misys.getLocalization("transportGoodsError"));
				}
				if(valid) {
					this.inherited(arguments);
				}
			}
			console.debug("[transport Dataset] validate end");
		}
	}
);