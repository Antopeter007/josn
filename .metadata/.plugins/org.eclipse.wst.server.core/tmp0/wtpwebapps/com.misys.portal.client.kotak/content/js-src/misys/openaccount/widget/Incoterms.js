dojo.provide("misys.openaccount.widget.Incoterms");
dojo.experimental("misys.openaccount.widget.Incoterms"); 

dojo.require("misys.grid.GridMultipleItems");
dojo.require("misys.openaccount.widget.Incoterm");

/**
 * This widget stores the incoterms details for the transactions.
 */
dojo.declare("misys.openaccount.widget.Incoterms",
		[ misys.grid.GridMultipleItems ],
		// class properties:
		{
		data: { identifier: 'store_id', label: 'store_id', items: [] },
		handle: null,
		templatePath: null,
		templateString: dojo.byId("incoterms-template").innerHTML,
		dialogId: 'incoterm-dialog-template',
		xmlTagName: 'incoterms',
		xmlSubTagName: 'incoterm',
		
		gridColumns: ['code','code_label', 'other', 'location'],
        
		propertiesMap: {
			tnx_id: {_fieldName: 'tnx_id'},
			ref_id: {_fieldName: 'ref_id'},
			inco_term_id: {_fieldName: 'inco_term_id'},
			code: {_fieldName: 'incoterm_code'},
			code_label: {_fieldName: 'incoterm_code_label'},
			other: {_fieldName: 'incoterm_other'},
			location: {_fieldName: 'incoterm_location'}
			},

		layout: [
				{ name: 'Incoterm', field: 'code_label', width: '45%' },
				{ name: 'Location', field: 'location', width: '45%' },
				{ name: ' ', field: 'actions', formatter: misys.grid.formatReportActions, width: '10%' },
				{ name: 'Id', field: 'store_id', headerStyles: 'display:none', cellStyles: 'display:none' }
				],
        
		mandatoryFields: ["code"],
        
		startup: function(){
			console.debug("[Incoterms] startup start");
			
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
			console.debug("[Incoterms] startup end");
		},
    	
		openDialogFromExistingItem: function(items, request)
		{
			console.debug("[Incoterms] openDialogFromExistingItem start");
			
			this.inherited(arguments);

			console.debug("[Incoterms] openDialogFromExistingItem end");
		},
		
		addItem: function(event)
		{
			console.debug("[Incoterms] addItem start");
			if(this.id.match('^misys_')=='misys_' && misys.checkLineItemChildrens()){
				misys.dialog.show('ERROR', misys.getLocalization('tooManyPODetailsError'));
				return;
			}else if(this.id.match('^line_item_')=='line_item_' && misys.checkPOChildrens()){
				misys.dialog.show('ERROR', misys.getLocalization('tooManyPODetailsError'));
				return;
			}
			this.inherited(arguments);
			
			console.debug("[Incoterms] addItem end");
		},

		createItemsFromJson: function(jsonMsg)
		{
			console.debug("[Incoterms] createItemsFromJson start");
			
			this.inherited(arguments);
			
			console.debug("[Incoterms] createItemsFromJson end");
		},
		
		performValidation: function()
		{
			console.debug("[Incoterms] validate start");
			if(this.validateDialog(true))
			{
				this.inherited(arguments);
			}
			console.debug("[Incoterms] validate end");
		},
		
		updateData:  function(event) {
			console.debug("[Incoterms] updateData start");
			
			this.inherited(arguments);
			if(dijit.byId("part_ship_2") && dijit.byId("part_ship_2").get("checked") === true && dijit.byId("line_item_incoterms")) {
				dijit.byId("line_item_incoterms").set("disabled",true);
			}
			
			console.debug("[Incoterms] updateData end");
			misys.markFormDirty();
		},
		
		renderSections: function()
		{
			console.debug("[Incoterms] renderSections start");
			this.inherited(arguments);
			if (this.itemsNode)
			{
				var displayGrid = (this.grid && this.grid.rowCount > 0);
				if(dijit.byId("line_item_incoterms")) {dijit.byId("line_item_incoterms").set("disabled",false);}
			}
			console.debug("[Incoterms] renderSections end");
		}
	}
);