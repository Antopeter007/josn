dojo.provide("misys.openaccount.widget.TransportBySeaDischargePortDetails");
dojo.experimental("misys.openaccount.widget.TransportBySeaDischargePortDetails"); 

dojo.require("misys.grid.GridMultipleItems");
dojo.require("misys.openaccount.widget.TransportBySeaDischargePortDetail");

// our declared class
dojo.declare("misys.openaccount.widget.TransportBySeaDischargePortDetails",
		[ misys.grid.GridMultipleItems ],
		// class properties:
		{
		data: { identifier: "store_id", label: "store_id", items: [] },
		handle: null,
		templatePath: null,   
		templateString: dojo.byId("transport-by-sea-discharge-port-details-template") ? dojo.byId("transport-by-sea-discharge-port-details-template").innerHTML : "",
		xmlTagName: "discharge_ports",
		xmlSubTagName: "discharge_port",
		gridColumns: ["discharge_port_name","routing_summary_sub_type","ref_id","tnx_id"],
		
		propertiesMap: {
			ref_id: {_fieldName: 'ref_id'},
			tnx_id: {_fieldName: 'tnx_id'},
			discharge_port_name: {_fieldName: "discharge_port_name"},
				routing_summary_sub_type: {_fieldName: "sea_discharge_rs_sub_type"}
				},
		
		layout: [
					{ name: "Port Name", field: "discharge_port_name", width: "35%" },
					{ name: " ", field: "actions", formatter: misys.grid.formatReportActions, width: "10%" },
					{ name: "Id", field: "store_id", headerStyles: "display:none", cellStyles: "display:none" }
               ],
		mandatoryFields: ["discharge_port_name"],
        
		startup: function(){
			console.debug("[TransportBySeaDischargePortDetails] startup start");
			
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
			console.debug("[TransportBySeaDischargePortDetails] startup end");
		},
    	
		openDialogFromExistingItem: function(items, request)
		{
			console.debug("[TransportBySeaDischargePortDetails] openDialogFromExistingItem start");
			
			this.inherited(arguments);
			
			console.debug("[TransportBySeaDischargePortDetails] openDialogFromExistingItem end");
		},
		
		resetDialog: function(event)
		{
			console.debug("[TransportBySeaDischargePortDetails] ResetDialog start");
			
			this.inherited(arguments);
			
			console.debug("[TransportBySeaDischargePortDetails] ResetDialog end");
		},


		createItem: function()
		{
			if(this.hasChildren && this.hasChildren())
			{
				var type= 'misys.openaccount.widget.TransportBySeaDischargePortDetails';
				var value= [];
				dojo.forEach(this.getChildren(), function(child){
					if (child.createItem)
					{
						value.push(child.createItem());
					}
				}, this);
				var obj = {_value : value , _type: type};
				var item = {};
				item["transport_by_sea_discharge_ports"] = obj;
				return item;
			}
			return null;
		},
		addItem: function(event)
		{
			console.debug("[TransportBySeaDischargePortDetails] addItem start");
			
			this.inherited(arguments);
			
			console.debug("[TransportBySeaDischargePortDetails] addItem end");
		},

		createItemsFromJson: function(jsonMsg)
		{
			console.debug("[TransportBySeaDischargePortDetails] createItemsFromJson start");
			
			this.inherited(arguments);
			
			console.debug("[TransportBySeaDischargePortDetails] createItemsFromJson end");
		},
		checkDialog: function()
		{
			console.debug("[TransportBySeaDischargePortDetails] checkDialog start");
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
			console.debug("[TransportBySeaDischargePortDetails] checkDialog end");
			
			return this.dialog;
		},
		performValidation: function()
		{
			console.debug("[TransportBySeaDischargePortDetails] validate start");
			if(this.validateDialog(true))
			{
				this.inherited(arguments);
			}
			console.debug("[TransportBySeaDischargePortDetails] validate end");
		}
	}
);