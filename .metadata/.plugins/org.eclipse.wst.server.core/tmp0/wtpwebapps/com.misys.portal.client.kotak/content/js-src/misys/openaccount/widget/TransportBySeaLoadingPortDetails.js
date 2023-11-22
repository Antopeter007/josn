dojo.provide("misys.openaccount.widget.TransportBySeaLoadingPortDetails");
dojo.experimental("misys.openaccount.widget.TransportBySeaLoadingPortDetails"); 

dojo.require("misys.grid.GridMultipleItems");
dojo.require("misys.openaccount.widget.TransportBySeaLoadingPortDetail");

// our declared class
dojo.declare("misys.openaccount.widget.TransportBySeaLoadingPortDetails",
		[ misys.grid.GridMultipleItems ],
		// class properties:
		{
		data: { identifier: "store_id", label: "store_id", items: [] },
		handle: null,
		templatePath: null,   
		templateString: dojo.byId("transport-by-sea-loading-port-details-template")?dojo.byId("transport-by-sea-loading-port-details-template").innerHTML:"",
		xmlTagName: "loading_ports",
		xmlSubTagName: "loading_port",
		gridColumns: ["loading_port_name","routing_summary_sub_type","ref_id", "tnx_id"],
		
		propertiesMap: {
			ref_id: {_fieldName: 'ref_id'},
			tnx_id: {_fieldName: 'tnx_id'},
			loading_port_name: {_fieldName: "loading_port_name"},
			routing_summary_sub_type: {_fieldName: "sea_loading_rs_sub_type"}
				},
		
		layout: [
					{ name: "Port Name", field: "loading_port_name", width: "35%" },
					{ name: " ", field: "actions", formatter: misys.grid.formatReportActions, width: "10%" },
					{ name: "Id", field: "store_id", headerStyles: "display:none", cellStyles: "display:none" }
               ],
		mandatoryFields: [],
        
		startup: function(){
			console.debug("[TransportBySeaLoadingPortDetails] startup start");
			
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
			console.debug("[TransportBySeaLoadingPortDetails] startup end");
		},
    	
		openDialogFromExistingItem: function(items, request)
		{
			console.debug("[TransportBySeaLoadingPortDetails] openDialogFromExistingItem start");
			
			this.inherited(arguments);

			console.debug("[TransportBySeaLoadingPortDetails] openDialogFromExistingItem end");
		},
		
		addItem: function(event)
		{
			console.debug("[TransportBySeaLoadingPortDetails] addItem start");
			
			this.inherited(arguments);
			
			console.debug("[TransportBySeaLoadingPortDetails] addItem end");
		},

		createItemsFromJson: function(jsonMsg)
		{
			console.debug("[TransportBySeaLoadingPortDetails] createItemsFromJson start");
			
			this.inherited(arguments);
			
			console.debug("[TransportBySeaLoadingPortDetails] createItemsFromJson end");
		},
		checkDialog: function()
		{
			console.debug("[TransportBySeaLoadingPortDetails] checkDialog start");
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
			console.debug("[TransportBySeaLoadingPortDetails] checkDialog end");
			
			return this.dialog;
		},
		
		performValidation: function()
		{
			console.debug("[TransportBySeaLoadingPortDetails] validate start");
			if(this.validateDialog(true))
			{
				if(dijit.byId("loading_port_name") && dijit.byId("loading_port_name").get("value") === "")
				{
					misys.dialog.show("ERROR", misys.getLocalization("emptyDialogSubmitError"));
				}
				else
				{
					this.inherited(arguments);
				}
			}
			
			console.debug("[TransportBySeaLoadingPortDetails] validate end");
		}
	}
);