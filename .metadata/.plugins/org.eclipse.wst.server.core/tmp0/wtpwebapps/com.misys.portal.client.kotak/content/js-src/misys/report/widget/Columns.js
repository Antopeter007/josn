dojo.provide("misys.report.widget.Columns");
dojo.experimental("misys.report.widget.Columns"); 

dojo.require("misys.grid.GridMultipleItems");
dojo.require("misys.report.widget.Column");

// our declared class
dojo.declare("misys.report.widget.Columns",
        [ misys.grid.GridMultipleItems ],
        // class properties:
        {
		data: { identifier: 'store_id', label: 'store_id', items: [] },
	
        templatePath: null,
        templateString: dojo.byId("columns-template").innerHTML,
        dialogId: 'column-dialog-template',
        xmlTagName: 'columns',
        xmlSubTagName: 'column',
        
        gridColumns: ['column', 'label_en', 'label_ar', 'label_fr', 'label_us', 'label_it' , 'label_nl' ,'label_pt' ,'label_br', 'label_de', 'label_zh', 'label_ca' ,'label_es' , 'label_th', 
                      'alignment', 'width', 'eqv_cur_code', 'open_details_window', 'abbreviation', 'computed_field_id',
                      'operation', 'operand'],

		propertiesMap: {
			column: {_fieldName: 'column'},
			label_en: {_fieldName: 'label_en'},
			label_fr: {_fieldName: 'label_fr'},
			label_us: {_fieldName: 'label_us'},
			label_it: {_fieldName: 'label_it'},
			label_nl: {_fieldName: 'label_nl'},
			label_pt: {_fieldName: 'label_pt'},
			label_br: {_fieldName: 'label_br'},
			label_de: {_fieldName: 'label_de'},
			label_zh: {_fieldName: 'label_zh'},
			label_ca: {_fieldName: 'label_ca'},
			label_es: {_fieldName: 'label_es'},
			label_th: {_fieldName: 'label_th'},
			label_ar: {_fieldName: 'label_ar'},
			alignment: {_fieldName: 'alignment'},
			width: {_fieldName: 'width'},
			eqv_cur_code: {_fieldName: 'eqv_cur_code'},
			open_details_window: {_fieldName: 'open_details_window'},
			abbreviation: {_fieldName: 'abbreviation'},
			computed_field_id: {_fieldName: 'computed_field_id'},
			operation: {_fieldName: 'operation'},
			operand: {_fieldName: 'operand'}			
		},
        
        layout: [
                 { name: 'Description', get: misys.getDisplayedColumnLabel, width: '45%' },
                 { name: 'Column', get: misys.getDisplayedColumn, width: '45%' },
                 { name: ' ', field: 'actions', formatter: misys.grid.formatReportActions, width: '10%' }
                 ],
                 
    	startup: function(){
    		if(this._started) { return; }
    		
			console.debug("[Columns] startup start");
			
			// Display column description in the user's language
			this.layout[0].field = 'label_' + language;
			
			// Prepare data store
			this.dataList = [];
			if(this.hasChildren())
			{
				dojo.forEach(this.getChildren(), function(child){
					var item = {
							column: child.get('column'),
							alignment: child.get('alignment'),
							width: child.get('width'),
							eqv_cur_code: child.get('eqv_cur_code'),
							abbreviation: child.get('abbreviation'),
							computed_field_id: child.get('computed_field_id'),
							operation: child.get('operation'),
							operand: child.get('operand')
					};
					
				    for(var i=0, len = languages.length; i < len; i++)
				    {
						item["label_" + languages[i]] = child.get('label_' + languages[i]);
				    }
					this.dataList.push(item);
				}, this);
			}
			
    		this.inherited(arguments);
			console.debug("[Columns] startup end");
    	},
    	
    	openDialogFromExistingItem: function(items, request)
    	{
    		console.debug("[Columns] openDialogFromExistingItem start");

			// Disable dialog events
    		misys.dialog.isActive = false;

    		var item = items[0];
    		
    		this.inherited(arguments);

    		// Set list of columns
    		var candidate = misys.retrieveCandidate();
    		misys.setColumns('column', candidate);

    		var computedFieldId = dojo.isArray(item.computed_field_id) ?
    				item.computed_field_id[0] : item.computed_field_id;
    		dijit.byId('computed_field').set('checked', computedFieldId);
    		dojo.byId('computation_section').style.display = (computedFieldId ? 'block' : 'none');
    		
    		//Populate data in the computation fields section. 
    		if(computedFieldId){
    			// Enable dialog events
    			misys.dialog.isActive = true;
    			// Set list of operators
        		misys.setOperatorsList(item);

        		// Set list of operands
        		misys.setOperands(item);
    		}
    		// Disable dialog events
    		misys.dialog.isActive = false;
    		
    		
    		console.debug("[Columns] openDialogFromExistingItem end");
    	},
    	
    	addItem: function(event)
    	{
    		console.debug("[Columns] addItem start");
    		/*//var criteriumItem = new misys.report.widget.Criterium({}, document.createElement("div")); 
    		//this.addChild(criteriumItem);
    		//this.renderSections();
    		
    		// Check Dialog widget
   			this.checkDialog();

   			// Reset dialog fields
    		this.resetDialog();
    		
    		// Attach current widget to dialog widget
    		this.dialog.gridMultipleItemsWidget = this;
    		
    		// Populate the column FilteringSelect list
    		this.populateDisplayedColumnsFilteringSelect();
    		
    		// Show dialog
    		this.dialog.show();*/

			// Disable dialog events
    		misys.dialog.isActive = false;
			if (dojo.byId('eqv_currency_section')) {
			dojo.attr('eqv_currency_section', 'style','display:' + 'none');
			}
    		
    		this.inherited(arguments);
    		
    		// Set list of columns
    		var candidate = misys.retrieveCandidate();
    		misys.setColumns('column', candidate);
    		
    		// Set list of operators
    		misys.setOperatorsList();

    		// Set list of operands
    		misys.setOperands();

    		// Hide the computation section
    		dijit.byId('computed_field').set('checked', false);
    		dojo.byId('computation_section').style.display = 'none';
    		
    		console.debug("[Columns] addItem end");
    		document.body.style.overflow = "hidden";
    	}
    }
);