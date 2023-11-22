dojo.provide("misys.report.widget.Aggregates");
dojo.experimental("misys.report.widget.Aggregates"); 

dojo.require("misys.grid.GridMultipleItems");
dojo.require("misys.report.widget.Aggregate");

// our declared class
dojo.declare("misys.report.widget.Aggregates",
		[ misys.grid.GridMultipleItems ],
		// class properties:
		{
		data: { identifier: 'store_id', label: 'store_id', items: [] },
		
		templatePath: null,
		templateString: dojo.byId("aggregates-template").innerHTML,
		dialogId: 'aggregate-dialog-template',
		xmlTagName: 'aggregates',
		xmlSubTagName: 'aggregate',
		
		gridColumns: ['column', 'type', 'eqv_cur_code', 'label_en', 'label_fr', 'label_us', 'label_it' , 'label_nl' ,'label_pt' ,'label_br', 'label_de', 'label_zh', 'label_ca' ,'label_es' ,'label_th'],
        
		propertiesMap: {
			column: {_fieldName: 'aggregate_column'},
			type: {_fieldName: 'aggregate_type'},
			eqv_cur_code: {_fieldName: 'aggregate_eqv_cur_code'},
			label_en: {_fieldName: 'aggregate_label_en'},
			label_fr: {_fieldName: 'aggregate_label_fr'},
			label_us: {_fieldName: 'aggregate_label_us'},
			label_it: {_fieldName: 'aggregate_label_it'},
			label_nl: {_fieldName: 'aggregate_label_nl'},
			label_pt: {_fieldName: 'aggregate_label_pt'},
			label_br: {_fieldName: 'aggregate_label_br'},
			label_de: {_fieldName: 'aggregate_label_de'},
			label_zh: {_fieldName: 'aggregate_label_zh'},
			label_ca: {_fieldName: 'aggregate_label_ca'},
			label_es: {_fieldName: 'aggregate_label_es'},
			label_th: {_fieldName: 'aggregate_label_th'}
			},
        
		layout: [
				{ name: 'Column', field: 'column', formatter: misys.getColumnDecode, width: '40%' },
				{ name: 'Type', field: 'type', formatter: misys.getAggregateOperatorDecode, width: '40%' },
				{ name: ' ', field: 'actions', formatter: misys.grid.formatReportActions, width: '10%' }
				],
        
		startup: function(){
			if(this._started) { return; }
			
			console.debug("[Aggregates] startup start");
			
			// Prepare data store
			this.dataList = [];
			if(this.hasChildren())
			{
				dojo.forEach(this.getChildren(), function(child){
					var item = { column: child.get('column'), type: child.get('type'), eqv_cur_code: child.get('eqv_cur_code') };
					for(var i=0, len = languages.length; i < len; i++)
					{
						item["label_" + languages[i]] = child.get('label_' + languages[i]);
					}
					this.dataList.push(item);
				}, this);
			}
			
			this.inherited(arguments);
			console.debug("[Aggregates] startup end");
		},
    	
		openDialogFromExistingItem: function(items, request)
		{
			console.debug("[Aggregates] openDialogFromExistingItem start");
			
			// Disable dialog events
    		misys.dialog.isActive = false;
    		
    		// Populate the column FilteringSelect list
			//this.populateDisplayedColumnsFilteringSelect();
			
			// Set columns
			var candidate = misys.retrieveCandidate();
			misys.setAggregateColumns(candidate);

			// Set list of aggregates
			misys.setAggregatesList(items[0].column[0]);
			
			this.inherited(arguments);

			// Hide/display equivalent currency section
			misys.toggleCurrencySection();
			var equivalentCurrency = dijit.byId('aggregate_eqv_cur_code').get('value');
			dijit.byId('aggregate_use_product_currency').set('checked', (equivalentCurrency === ''));

			console.debug("[Aggregates] openDialogFromExistingItem end");
		},
		
		addItem: function(event)
		{
			console.debug("[Aggregates] addItem start");
			
			// Disable dialog events
    		misys.dialog.isActive = false;
    		
			this.inherited(arguments);
			
			// Set columns
			var candidate = misys.retrieveCandidate();
			misys.setAggregateColumns(candidate);

			// Set list of aggregates
			misys.setAggregatesList();

			// Hide/display equivalent currency section
			misys.toggleCurrencySection();
			
			console.debug("[Aggregates] addItem end");
			document.body.style.overflow = "hidden";
		}
	}
);