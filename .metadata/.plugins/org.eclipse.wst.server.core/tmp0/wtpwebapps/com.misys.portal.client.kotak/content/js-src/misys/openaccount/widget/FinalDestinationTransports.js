dojo.provide("misys.openaccount.widget.FinalDestinationTransports");
dojo.experimental("misys.openaccount.widget.FinalDestinationTransports"); 

dojo.require("misys.grid.GridMultipleItems");
dojo.require("misys.openaccount.widget.Transport");

// our declared class
dojo.declare("misys.openaccount.widget.FinalDestinationTransports",
		[ misys.grid.GridMultipleItems ],
		// class properties:
		{
		data: { identifier: "store_id", label: "store_id", items: [] },
		templatePath: null,
		templateString: dojo.byId("routing-summary-final-destination-template") ? dojo.byId("routing-summary-final-destination-template").innerHTML : "",
		dialogId: "routing-summary-final-destination-dialog-template",
		xmlTagName: "transports",
		xmlSubTagName: "transport",
		
		gridColumns: ["transport_id", "transport_mode", "transport_type", "transport_sub_type",
		              "transport_sub_type_label", "transport_group", "final_place_name"],
        
		propertiesMap: {
			tnx_id: {_fieldName: "tnx_id"},
			ref_id: {_fieldName: "ref_id"},
			transport_id: {_fieldName: "final_destination_transport_id"},
			transport_mode: {_fieldName: "final_destination_transport_mode"},
			transport_type: {_fieldName: "transport_type"},
			transport_sub_type: {_fieldName: "final_destination_transport_sub_type"},
			transport_sub_type_label: {_fieldName: "final_destination_transport_sub_type_label"},
			transport_group: {_fieldName: "final_destination_transport_group"},
			final_place_name: {_fieldName: "final_destination_name"}
			},

		layout: [
				{ name: "Destination", field: "final_place_name", width: "90%" },
				{ name: " ", field: "actions", formatter: misys.grid.formatReportActions, width: "10%" }/*,
				{ name: "Id", field: "store_id", headerStyles: "display:none", cellStyles: "display:none" }*/
				],
        
		startup: function(){
			console.debug("[FinalDestinationTransports] startup start");
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
			console.debug("[FinalDestinationTransports] startup end");
		}
	}
);
