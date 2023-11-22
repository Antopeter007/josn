dojo.provide("misys.openaccount.widget.ContactDetails");
dojo.experimental("misys.openaccount.widget.ContactDetails"); 

dojo.require("misys.grid.GridMultipleItems");
dojo.require("misys.openaccount.widget.ContactDetail");

// our declared class
dojo.declare("misys.openaccount.widget.ContactDetails",
		[ misys.grid.GridMultipleItems ],
		// class properties:
		{
		data: { identifier: 'store_id', label: 'store_id', items: [] },
		handle: null,
		templatePath: null,
		templateString: dojo.byId("contact-details-template") ? dojo.byId("contact-details-template").innerHTML : "",
		dialogId: 'contact-details-dialog-template',
		xmlTagName: 'contacts',
		xmlSubTagName: 'contact',
		
		gridColumns: ['type', 'type_decode', 'bic', 'name_prefix', 'name_value', 'given_name', 'role', 'phone_number', 'fax_number', 'email'],
        
		propertiesMap: {
			ctcprsn_id: {_fieldName: 'ctcprsn_id'},
			type: {_fieldName: 'contact_type'},
			type_decode: {_fieldName: 'contact_type_decode'},
			bic: {_fieldName: 'contact_bic'},
			name_prefix: {_fieldName: 'contact_name_prefix'},
			name_value: {_fieldName: 'contact_name'},
			given_name: {_fieldName: 'contact_given_name'},
			role: {_fieldName: 'contact_role'},
			phone_number: {_fieldName: 'contact_phone_number'},
			fax_number: {_fieldName: 'contact_fax_number'},
			email: {_fieldName: 'contact_email'}
			},

		layout: [
				{ name: 'Type', field: 'type_decode', width: '45%' },
				{ name: 'Name', get: misys.getContactName, width: '45%' },
				{ name: ' ', field: 'actions', formatter: misys.grid.formatReportActions, width: '10%' },
				{ name: 'Id', field: 'store_id', headerStyles: 'display:none', cellStyles: 'display:none' }
				],
        
        mandatoryFields: ["type", "name_value"],
        
		startup: function(){
			console.debug("[ContactDetails] startup start");
			
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
			console.debug("[ContactDetails] startup end");
		},
    	
		openDialogFromExistingItem: function(items, request)
		{
			console.debug("[ContactDetails] openDialogFromExistingItem start");
			
			this.inherited(arguments);

			console.debug("[ContactDetails] openDialogFromExistingItem end");
		},
		
		addItem: function(event)
		{
			console.debug("[ContactDetails] addItem start");

			this.inherited(arguments);
			
			console.debug("[ContactDetails] addItem end");
		},

		createItemsFromJson: function(jsonMsg)
		{
			console.debug("[ContactDetails] createItemsFromJson start");
			
			this.inherited(arguments);
			
			console.debug("[ContactDetails] createItemsFromJson end");
		},
		
		performValidation: function()
		{
			console.debug("[ContactDetails] validate start");
			if(this.validateDialog(true))
			{
				this.inherited(arguments);
			}
			
			console.debug("[ContactDetails] validate end");
		}
	}
);