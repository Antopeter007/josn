dojo.provide("misys.openaccount.widget.RoutingSummary");
dojo.experimental("misys.openacount.widget.RoutingSummary"); 

dojo.require("dijit._Contained");
dojo.require("dijit._Container");
dojo.require("dijit._Widget");
dojo.require("misys.layout.SimpleItem");

// our declared class
dojo.declare("misys.openaccount.widget.RoutingSummary",
	[ dijit._Widget, dijit._Contained, dijit._Container, misys.layout.SimpleItem ],
	// class properties:
	{
        
		ref_id: '',
		tnx_id: '',
		routing_summary_mode: '',
		routing_summary_type: '',
		is_valid: "Y",
		air_carrier_name: '',
		sea_carrier_name: '',
		rail_carrier_name: '',
		road_carrier_name: '',
		linked_ref_id: '',
		linked_tnx_id: '',
		transport_by_air_departures: '',
		transport_by_air_destinations: '',
		transport_by_sea_loading_ports: '',
		transport_by_sea_discharge_ports: '',
		transport_by_rail_receipt_places: '',
		transport_by_rail_delivery_places: '',
		transport_by_road_receipt_places: '',
		transport_by_road_delivery_places: '',
		
		
		constructor: function()
		{
			console.debug("[RoutingSummary] constructor");
		},

		buildRendering: function()
		{
			console.debug("[RoutingSummary] buildRendering start");
			this.inherited(arguments);
			var children = this.getChildren();
			dojo.forEach(children, function(child){
				dojo.attr(child.domNode, 'style', {display: 'none'});
			});
			console.debug("[RoutingSummary] buildRendering end");
		},
		
		startup: function()
		{
			console.debug("[RoutingSummary] startup start");
			this.inherited(arguments);
			console.debug("[RoutingSummary] startup end");
		},
		
		createItem: function()
		{
			if(this.get('transport_by_air_departures'))
				{
					airDeptText = this.get('transport_by_air_departures');
					airDeptObj = '';
					if(airDeptText){
						airDeptObj = new misys.openaccount.widget.TransportByAirDeptDetails();
						airDeptObj.createItemsFromJson(airDeptText);
					}
				}
			
			
			airDestText = this.get('transport_by_air_destinations');
			airDestObj = '';
			if(airDestText){
				airDestObj = new misys.openaccount.widget.TransportByAirDestDetails();
				airDestObj.createItemsFromJson(airDestText);
			}
			
			seaLoadingPortText = this.get('transport_by_sea_loading_ports');
			seaLoadingPortObj = '';
			if(seaLoadingPortText){
				seaLoadingPortObj = new misys.openaccount.widget.TransportBySeaLoadingPortDetails();
				seaLoadingPortObj.createItemsFromJson(seaLoadingPortText);
			}
			
			seaDischargePortObjText = this.get('transport_by_sea_discharge_ports');
			seaDischargePortObj = '';
			if(seaDischargePortObjText){
				seaDischargePortObj = new misys.openaccount.widget.TransportBySeaDischargePortDetails();
				seaDischargePortObj.createItemsFromJson(seaDischargePortObjText);
			}
			if(this.get('transport_by_rail_receipt_places')){
				railRecPlacesObjText = this.get('transport_by_rail_receipt_places');
				railRecPlacesObj = '';
				if(railRecPlacesObjText){
					railRecPlacesObj = new misys.openaccount.widget.TransportByRailReceiptPlaceDetails();
					railRecPlacesObj.createItemsFromJson(railRecPlacesObjText);
				}
			}
			
			if(this.get('transport_by_rail_delivery_places')){
				railDelPlacesObjText = this.get('transport_by_rail_delivery_places');
				railDelPlacesObj = '';
				if(railDelPlacesObjText){
					railDelPlacesObj = new misys.openaccount.widget.TransportByRailDeliveryPlaceDetails();
					railDelPlacesObj.createItemsFromJson(railDelPlacesObjText);
				}
			}
			
			
			roadRecPlacesObjText = this.get('transport_by_road_receipt_places');
			roadRecPlacesObj = '';
			if(roadRecPlacesObjText){
				roadRecPlacesObj = new misys.openaccount.widget.TransportByRoadReceiptPlaceDetails();
				roadRecPlacesObj.createItemsFromJson(roadRecPlacesObjText);
			}
			
			roadDelPlacesObjText = this.get('transport_by_road_delivery_places');
			roadDelPlacesObj = '';
			if(roadDelPlacesObjText){
				roadDelPlacesObj = new misys.openaccount.widget.TransportByRoadDeliveryPlaceDetails();
				roadDelPlacesObj.createItemsFromJson(roadDelPlacesObjText);
			}

			// alert(item[rail_carrier_name]);


			var item = {
					ref_id: this.get('ref_id'),
					tnx_id: this.get('tnx_id'),
					routing_summary_mode: this.get('routing_summary_mode'),
					routing_summary_type: this.get('routing_summary_type'),
					linked_ref_id: this.get('linked_ref_id'),
					linked_tnx_id: this.get('linked_tnx_id'),
					is_valid: this.get("is_valid"),
					air_carrier_name: this.get("air_carrier_name"),
					sea_carrier_name: this.get("sea_carrier_name"),
					rail_carrier_name: this.get("rail_carrier_name"),
					road_carrier_name: this.get("road_carrier_name"),
					transport_by_air_departures: '',
					transport_by_air_destinations: '',
					transport_by_sea_loading_ports: '',
					transport_by_sea_discharge_ports: '',
					transport_by_rail_receipt_places: '',
					transport_by_rail_delivery_places: '',
					transport_by_road_receipt_places: '',
					transport_by_road_delivery_places: ''
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