dojo.provide("misys.openaccount.widget.PlaceTransports");
dojo.experimental("misys.openaccount.widget.PlaceTransports"); 

dojo.require("misys.grid.GridMultipleItems");
dojo.require("misys.openaccount.widget.Transport");

// our declared class
dojo.declare("misys.openaccount.widget.PlaceTransports",
		[ misys.grid.GridMultipleItems ],
		// class properties:
		{
		data: { identifier: "store_id", label: "store_id", items: [] },
		templatePath: null,
		templateString: dojo.byId("routing-summary-place-template") ? dojo.byId("routing-summary-place-template").innerHTML : "",
		dialogId: "routing-summary-place-dialog-template",
		xmlTagName: "transports",
		xmlSubTagName: "transport",
		
		gridColumns: ["transport_id", "transport_mode", "transport_type", "transport_sub_type",
		              "transport_sub_type_label", "transport_group", "place_name"],
        
		propertiesMap: {
			tnx_id: {_fieldName: "tnx_id"},
			ref_id: {_fieldName: "ref_id"},
			transport_id: {_fieldName: "place_transport_id"},
			transport_mode: {_fieldName: "place_transport_mode"},
			transport_type: {_fieldName: "transport_type"},
			transport_sub_type: {_fieldName: "place_transport_sub_type"},
			transport_sub_type_label: {_fieldName: "place_transport_sub_type_label"},
			transport_group: {_fieldName: "place_transport_group"},
			place_name: {_fieldName: "place_name"}
			},

		layout: [
				{ name: "Direction", 
					get: function(rowIndex, item){
						var formattedValue = item.transport_sub_type_label ? (dojo.isArray(item.transport_sub_type_label) ? item.transport_sub_type_label[0] : item.transport_sub_type_label) : "";
						var direction = dojo.isArray(item.transport_sub_type) ? item.transport_sub_type[0] : item.transport_sub_type;
						if (dijit.byId("place_transport_sub_type"))
						{
							dijit.byId("place_transport_sub_type").set("value", direction);
							formattedValue = dijit.byId("place_transport_sub_type").get("displayedValue");
						}
						return formattedValue;
					},
					width: "15%" },
				{ name: "Destination", field: "place_name", width: "75%" },
				{ name: " ", field: "actions", formatter: misys.grid.formatReportActions, width: "10%" }/*,
				{ name: "Id", field: "store_id", headerStyles: 'display:none', cellStyles: "display:none" }*/
				],
        
		startup: function(){
			console.debug("[PlaceTransports] startup start");
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
				}, this);
			}
			
			this.inherited(arguments);
			console.debug("[PlaceTransports] startup end");
		}
	}
);
