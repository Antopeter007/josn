dojo.provide("misys.openaccount.widget.TakingInTransports");
dojo.experimental("misys.openaccount.widget.TakingInTransports"); 

dojo.require("misys.grid.GridMultipleItems");
dojo.require("misys.openaccount.widget.Transport");

// our declared class
dojo.declare("misys.openaccount.widget.TakingInTransports",
		[ misys.grid.GridMultipleItems ],
		// class properties:
		{
		data: { identifier: "store_id", label: "store_id", items: [] },
		templatePath: null,
		templateString: dojo.byId("routing-summary-taking-in-template") ? dojo.byId("routing-summary-taking-in-template").innerHTML : "",
		dialogId: "routing-summary-taking-in-dialog-template",
		xmlTagName: "transports",
		xmlSubTagName: "transport",
		
		gridColumns: ["transport_id", "transport_mode", "transport_type", "transport_sub_type",
		              "transport_sub_type_label", "transport_group", "taking_in"],
        
		propertiesMap: {
			tnx_id: {_fieldName: "tnx_id"},
			ref_id: {_fieldName: "ref_id"},
			transport_id: {_fieldName: "taking_in_transport_id"},
			transport_mode: {_fieldName: "taking_in_transport_mode"},
			transport_type: {_fieldName: "transport_type"},
			transport_sub_type: {_fieldName: "taking_in_transport_sub_type"},
			transport_sub_type_label: {_fieldName: "taking_in_transport_sub_type_label"},
			transport_group: {_fieldName: "taking_in_transport_group"},
			taking_in: {_fieldName: "taking_in_name"}
			},

		layout: [
				{ name: "Destination", field: "taking_in", width: "90%" },
				{ name: " ", field: "actions", formatter: misys.grid.formatReportActions, width: "10%" }/*,
				{ name: "Id", field: "store_id", headerStyles: "display:none", cellStyles: "display:none" }*/
				],
        
		startup: function(){
			console.debug("[TakingInTransports] startup start");
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
			console.debug("[TakingInTransports] startup end");
		}
	}
);
