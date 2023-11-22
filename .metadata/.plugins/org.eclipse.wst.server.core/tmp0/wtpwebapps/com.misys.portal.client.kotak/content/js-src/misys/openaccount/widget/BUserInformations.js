dojo.provide("misys.openaccount.widget.BUserInformations");
dojo.experimental("misys.openaccount.widget.BUserInformations"); 

dojo.require("misys.grid.GridMultipleItems");
dojo.require("misys.openaccount.widget.BUserInformation");

// our declared class
dojo.declare("misys.openaccount.widget.BUserInformations",
		[ misys.grid.GridMultipleItems ],
		// class properties:
		{
		data: { identifier: 'store_id', label: 'store_id', items: [] },
		
		templatePath: null,
		templateString: dojo.byId("po_buyer-user-defined-template").innerHTML,
		dialogId: 'po_buyer-user-defined-dialog-template',
		xmlTagName: 'buyer_defined_informations',
		xmlSubTagName: 'buyer_defined_information',
		
		gridColumns: ['user_id', 'info_id', 'label', 'information'],
        
		propertiesMap: {
			user_id: {_fieldName: 'po_buyer_user_id'},
			info_id: {_fieldName: 'po_buyer_info_id'},
			label: {_fieldName: 'po_buyer_label'},
			information: {_fieldName: 'po_buyer_information'}
			},

		layout: [
				{ name: 'Label', field: 'label', width: '25%' },
				{ name: 'Information', field: 'information', width: '65%' },
				{ name: ' ', field: 'actions', formatter: misys.grid.formatReportActions, width: '10%' }
				],
        
		startup: function(){
			console.debug("[BUserInformations] startup start");
			
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
			console.debug("[BUserInformations] startup end");
		},
    	
		openDialogFromExistingItem: function(items, request)
		{
			console.debug("[BUserInformations] openDialogFromExistingItem start");
			
			this.inherited(arguments);

			console.debug("[BUserInformations] openDialogFromExistingItem end");
		},
		
		addItem: function(event)
		{
			console.debug("[BUserInformations] addItem start");
			
			this.inherited(arguments);
			
			console.debug("[BUserInformations] addItem end");
		},
		
		performValidation: function()
		{
			var regExpression = new RegExp(/^[a-zA-Z0-9][a-zA-Z0-9-+('.&\,@#$*) ]*$/g);
			
			console.debug("[BUserInformations] validate start");
			if(this.validateDialog(true))
			{
				if((dijit.byId("po_buyer_label") && dijit.byId("po_buyer_label").get("value") === "") && (dijit.byId("po_buyer_information") && dijit.byId("po_buyer_information").get("value") === ""))
				{
					misys.dialog.show("ERROR", misys.getLocalization("addLabelOrInfo"));
				}
				else if(regExpression.test(dijit.byId("po_buyer_information").get("value")))
				{
					this.inherited(arguments);
				}
				else
				{	
					misys.dialog.show('ERROR',"The field contain non-supported characters.");  
		        	this.focus();
				}
			}
			
			console.debug("[BUserInformations] validate end");
			misys.markFormDirty();
			
		}
	}
);