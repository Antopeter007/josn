dojo.provide("misys.openaccount.widget.AirTransports");
dojo.experimental("misys.openaccount.widget.AirTransports"); 

dojo.require("misys.grid.GridMultipleItems");
dojo.require("misys.openaccount.widget.Transport");

// our declared class
dojo.declare("misys.openaccount.widget.AirTransports",
		[ misys.grid.GridMultipleItems ],
		// class properties:
		{
		data: { identifier: "store_id", label: "store_id", items: [] },
		templatePath: null,
		templateString: dojo.byId("routing-summary-air-template") ? dojo.byId("routing-summary-air-template").innerHTML : "",
		dialogId: "routing-summary-air-dialog-template",
		xmlTagName: "transports",
		xmlSubTagName: "transport",
		
		gridColumns: ["transport_id", "transport_mode", "transport_type", "transport_sub_type",
		              "transport_group", "airport_name", "airport_code", "town"],
        
		propertiesMap: {
			tnx_id: {_fieldName: "tnx_id"},
			ref_id: {_fieldName: "ref_id"},
			transport_id: {_fieldName: "air_transport_id"},
			transport_mode: {_fieldName: "air_transport_mode"},
			transport_type: {_fieldName: "transport_type"},
			transport_sub_type: {_fieldName: "air_transport_sub_type"},
			transport_sub_type_label: {_fieldName: "air_transport_sub_type_label"},
			transport_group: {_fieldName: "air_transport_group"},
			airport_name: {_fieldName: "airport_name"},
			airport_code: {_fieldName: "airport_code"},
			town: {_fieldName: "air_town"}
			},

		layout: [
				{ name: "Direction",
					get: function(rowIndex, item){
						var formattedValue = item.transport_sub_type_label ? (dojo.isArray(item.transport_sub_type_label) ? item.transport_sub_type_label[0] : item.transport_sub_type_label) : "";
						var direction = dojo.isArray(item.transport_sub_type) ? item.transport_sub_type[0] : item.transport_sub_type;
						if (dijit.byId("air_transport_sub_type"))
						{
							dijit.byId("air_transport_sub_type").set("value", direction);
							formattedValue = dijit.byId("air_transport_sub_type").get("displayedValue");
						}
						return formattedValue;
					},
					width: "15%" },
				{ name: "Airport",
					get: function(rowIndex, item){
						var airportCode = dojo.isArray(item.airport_code) ? item.airport_code[0] : item.airport_code;
						var airportTown = dojo.isArray(item.town) ? item.town[0] : item.town;
						var airportName = dojo.isArray(item.airport_name) ? item.airport_name[0] : item.airport_name;
						if (airportCode != "")
						{
							return airportCode;
						}
						return airportTown + (airportName != "" ? " (" + airportName + ")" : "");
					}, 
					width: "75%" },
				{ name: " ", field: "actions", formatter: misys.grid.formatReportActions, width: "10%" },
				{ name: "Id", field: "store_id", headerStyles: "display:none", cellStyles: "display:none" }
				],
        
		startup: function(){
			console.debug("[AirTransports] startup start");
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
			console.debug("[AirTransports] startup end");
		},
		performValidation: function()
		{
			console.debug("[AirTransports] validate start");
			if(this.validateDialog(true))
			{
				this.inherited(arguments);
			}
			console.debug("[AirTransports] validate end");
		}
	}
);
