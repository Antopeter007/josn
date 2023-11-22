dojo.provide("misys.openaccount.widget.TransportByAirDestDetails");
dojo.experimental("misys.openaccount.widget.TransportByAirDestDetails"); 

dojo.require("misys.grid.GridMultipleItems");
dojo.require("misys.openaccount.widget.TransportByAirDestDetail");

// our declared class
dojo.declare("misys.openaccount.widget.TransportByAirDestDetails",
		[ misys.grid.GridMultipleItems ],
		// class properties:
		{
		data: { identifier: 'store_id', label: 'store_id', items: [] },
		templatePath: null,
		templateString: dojo.byId("transport-by-air-dest-details-template") ? dojo.byId("transport-by-air-dest-details-template").innerHTML : "",
		xmlTagName: 'destinations',
		xmlSubTagName: 'destination',
		
		gridColumns: ["destination_airport_code", "destination_air_town", "destination_airport_name", 'ref_id', 'tnx_id','routing_summary_sub_type'],
        
		propertiesMap: {
			destination_airport_code: {_fieldName: 'destination_airport_code'},
			ref_id: {_fieldName: 'ref_id'},
			tnx_id: {_fieldName: 'tnx_id'},
			destination_air_town: {_fieldName: 'destination_air_town'},
			destination_airport_name: {_fieldName: 'destination_airport_name'},
			routing_summary_sub_type: {_fieldName: 'air_dest_rs_sub_type'}
			},

		layout: [
				{ name: 'Airport Code', field: 'destination_airport_code',width: '30%' },
				{ name: 'Town', field: 'destination_air_town', width: '30%' },
				{ name: 'Airport Name', field: 'destination_airport_name', width: '30%' },
				{ name: ' ', field: 'actions', formatter: misys.grid.formatReportActions, width: '10%' },
				{ name: 'Id', field: 'store_id', headerStyles: 'display:none', cellStyles: 'display:none' }
				],
        
		mandatoryFields: [],
        
		startup: function(){
			console.debug("[TransportByAirDestDetails] startup start");
			
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
			console.debug("[TransportByAirDestDetails] startup end");
		},
    	
		openDialogFromExistingItem: function(items, request)
		{
			console.debug("[TransportByAirDestDetails] openDialogFromExistingItem start");
			
			this.inherited(arguments);

			console.debug("[TransportByAirDestDetails] openDialogFromExistingItem end");
		},
		
		addItem: function(event)
		{
			console.debug("[TransportByAirDestDetails] addItem start");
			
			this.inherited(arguments);
			
			console.debug("[TransportByAirDestDetails] addItem end");
		},

		createItemsFromJson: function(jsonMsg)
		{
			console.debug("[TransportByAirDestDetails] createItemsFromJson start");
			
			this.inherited(arguments);
			
			console.debug("[TransportByAirDestDetails] createItemsFromJson end");
		},
		checkDialog: function()
		{
			console.debug("[TransportByAirDestDetails] checkDialog start");
			if(!this.dialog)
			{
				var dialogWidget = dijit.byId(this.dialogId); 
				if(dialogWidget)
				{
					this.dialog = dialogWidget; 
				}
				else
				{
					var id = this.dialogId ? this.dialogId : 'dialog-' +
							dojox.uuid.generateRandomUuid();
					var dojoClass = this.dialogClassName ? this.dialogClassName : 'misys.widget.Dialog';
		    		this.dialog = dojo.eval("new " + dojoClass + "({}, dojo.byId('" + id + "'))");
		    		this.dialog.set("refocus", false);
		    		this.dialog.set("draggable", false);
		    		dojo.addClass(this.dialog.domNode, "multipleItemDialog");
		    		this.dialog.startup();
		    		document.body.appendChild(this.dialog.domNode);
				}
			}
			console.debug("[TransportByAirDestDetails] checkDialog end");
			
			return this.dialog;
		},
		performValidation: function()
		{
			console.debug("[TransportByAirDestDetails] validate start");
			if(dijit.byId("destination_airport_code").value === "" && dijit.byId("destination_air_town").value === "")
				{
					misys.dialog.show('ERROR', misys.getLocalization('transportByAirDetMandatoryError'));
					return;
				}
			if(this.validateDialog(true))
			{
				this.inherited(arguments);
			}
			console.debug("[TransportByAirDestDetails] validate end");
		}
	}
);