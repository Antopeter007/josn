var parmtrs ="misys.report.widget.Parameters";
dojo.provide(parmtrs);
dojo.experimental(parmtrs); 

dojo.require("misys.grid.GridMultipleItems");

// our declared class
dojo.declare(parmtrs,
	[ misys.grid.GridMultipleItems ],
	// class properties:
	{
		data: { identifier: 'store_id', label: 'store_id', items: [] },
	
		templatePath: null,
		templateString: dojo.byId("parameters-template").innerHTML,
		dialogId: 'parameter-dialog-template',
		xmlTagName: 'parameters',
		xmlSubTagName: 'parameter',
        
		gridColumns: ['parameter_name', 'label_en', 'label_fr', 'label_ar', 'label_us', 'label_it' , 'label_nl' ,'label_pt' ,'label_br', 'label_de', 'label_zh', 'label_ca' ,'label_es' ,'label_th', 'mandatory'],
        
		propertiesMap: {
			parameter_name: {_fieldName: 'parameter_name'},
			label_en: {_fieldName: 'parameter_label_en'},
			label_fr: {_fieldName: 'parameter_label_fr'},
			label_ar: {_fieldName: 'parameter_label_ar'},
			label_us: {_fieldName: 'parameter_label_us'},
			label_it: {_fieldName: 'parameter_label_it'},
			label_nl: {_fieldName: 'parameter_label_nl'},
			label_pt: {_fieldName: 'parameter_label_pt'},
			label_br: {_fieldName: 'parameter_label_br'},
			label_de: {_fieldName: 'parameter_label_de'},
			label_zh: {_fieldName: 'parameter_label_zh'},
			label_ca: {_fieldName: 'parameter_label_ca'},
			label_es: {_fieldName: 'parameter_label_es'},
			label_th: {_fieldName: 'parameter_label_th'},
			mandatory: {_fieldName: 'parameter_mandatory'},
			default_string_value: {_fieldName: 'parameter_default_string_value'},
			default_number_value: {_fieldName: 'parameter_default_number_value'},
			default_amount_value: {_fieldName: 'parameter_default_amount_value'},
			default_values_set: {_fieldName: 'parameter_default_values_set'},
			default_date_type: {_fieldName: 'parameter_default_date_type'},
			current_date_offset_type: {_fieldName: 'parameter_current_date_offset_type'},
			current_date_offset_days: {_fieldName: 'parameter_current_date_offset_days'},
			first_day_offset_type: {_fieldName: 'parameter_first_day_offset_type'},
			first_day_offset_days: {_fieldName: 'parameter_first_day_offset_days'},
			last_day_offset_type: {_fieldName: 'parameter_last_day_offset_type'},
			last_day_offset_days: {_fieldName: 'parameter_last_day_offset_days'},
			default_date_value: {_fieldName: 'parameter_default_date_value'}			
		},

		layout: [
		         { name: 'Parameter', field: 'parameter_name', width: '45%' },
                 { name: 'Description', field: 'label_en', width: '45%' },
                 { name: ' ', field: 'actions', formatter: misys.grid.formatReportActions, width: '10%' }
                 ],
    	
    	startup: function(){
			console.debug("[Parameters] startup start");
			
			// Display column description in the user's language
			this.layout[1].field = 'label_' + language;

			// Prepare data store
			this.dataList = [];
			if(this.hasChildren())
			{
				dojo.forEach(this.getChildren(), function(child){
					var item = { 
						parameter_name: child.get('parameter_name'),
						mandatory: child.get('mandatory'),
						default_string_value: child.get('default_string_value'),
						default_number_value: child.get('default_number_value'),
						default_amount_value: child.get('default_amount_value'),
						default_values_set: child.get('default_values_set'),
						default_date_type: child.get('default_date_type'),
						current_date_offset_type: child.get('current_date_offset_type'),
						current_date_offset_days: child.get('current_date_offset_days'),
						first_day_offset_type: child.get('first_day_offset_type'),
						first_day_offset_days: child.get('first_day_offset_days'),
						last_day_offset_type: child.get('last_day_offset_type'),
						last_day_offset_days: child.get('last_day_offset_days'),
						default_date_value: child.get('default_date_value')
					};
				    for(var i=0, len = languages.length; i < len; i++)
				    {
						//eval("item.label_" + languages[i] + " = child.get('label_" + languages[i] + "')");
						item["label_" + languages[i]] = child.get('label_' + languages[i]);
				    }
					this.dataList.push(item);
				}, this);
			}
			
    		this.inherited(arguments);
    		
    		// Defer the correct default values assignment
			dojo.subscribe("ready", function(){
				var parameters = dijit.byId('parameters');
    			if (parameters && parameters.grid && parameters.grid.store)
    			{
    				parameters.grid.store.fetch({query: {store_id: '*'}, onComplete: function(items, request){
		    			dojo.forEach(items, function(item){
		    				var defaultStringValue = dojo.isArray(item.default_string_value) ? item.default_string_value[0] : item.default_string_value;
		    				if (defaultStringValue != '')
		    				{
		    					// Browser criteria to search for the column type
								var parameterName = dojo.isArray(item.parameter_name) ? item.parameter_name[0] : item.parameter_name;
								dijit.registry.byClass('misys.report.widget.Criteria').forEach(function(criterium) {
									if (criterium.grid && criterium.grid.store)
									{
										criterium.grid.store.fetch({
											query: {parameter : parameterName},
											onItem : function(criteriumItem, criteriumRequest){
												var columnType = dojo.isArray(criteriumItem.column_type) ? criteriumItem.column_type[0] : criteriumItem.column_type;
												if (columnType == 'Date')
												{
													parameters.grid.store.setValue(item, 'default_date_value', defaultStringValue);
													parameters.grid.store.setValue(item, 'default_date_type', '07');
													parameters.grid.store.setValue(item, 'default_string_value', '');
												}
												else if (columnType == 'Number')
												{
													parameters.grid.store.setValue(item, 'default_number_value', defaultStringValue);
													parameters.grid.store.setValue(item, 'default_string_value', '');
												}
												else if (columnType == 'Amount')
												{
													var amount = defaultStringValue.substring(0, defaultStringValue.indexOf('@'));
													var curCode = defaultStringValue.substring(defaultStringValue.indexOf('@')+1, defaultStringValue.length);
													parameters.grid.store.setValue(item, 'default_amount_value', amount);
													parameters.grid.store.setValue(item, 'default_string_value', '');
												}
											}
										});
									}
								});
		    				}
		    			});
		    		}});
    			}
			});
    		
			console.debug("[Parameters] startup end");
    	},
    	
		createDataGrid: function()
		{
			this.inherited(arguments);
			
			// Overwrite the delete behavior to check for parameters
			// already used in criteria.
			this.grid.onDelete = function(event){
				console.debug("[Parameters DataGrid] onDelete");
				
				var that = this;				
				// Is parameter already used in a criterium?
				var storeId = this.store._arrayOfTopLevelItems[event.rowIndex].store_id;
				storeId = dojo.isArray(storeId) ? storeId[0] : storeId;
				this.store.fetch({
					query: {store_id: storeId}, 
					onComplete: function(items, request) {
						if (items.length > 0)
						{
							var parameter = items[0];
							var parameterName = dojo.isArray(parameter.parameter_name) ? parameter.parameter_name[0] : parameter.parameter_name;
							
							var deleteCallBack = function() {
								var items = that.selection.getSelected();
					            if (items.length) {
					                // Iterate through the list of selected items
					            	// and unselect them
					                dojo.forEach(items, function(selectedItem) {
					                    if (selectedItem !== null) {
					                        // Delete the item from the data store:
					                    	that.selection.setSelected(selectedItem, false);
					                    }
					                }, that);
					            }    	            
								// Then, select row to be removed
					            that.selection.setSelected(event.rowIndex, true);
								// Get all selected items from the Grid:
					            items = that.selection.getSelected();
					            if (items.length) {
					                // Iterate through the list of selected items
					            	// and remove them from the store
					                dojo.forEach(items, function(selectedItem) {
					                    if (selectedItem !== null) {
					                        // Delete the item from the data store:
					                    	that.store.deleteItem(selectedItem);
					                    }
					                }, that);
					                that.store.save();
					            }
					            // Unselect all rows
					           	            
								setTimeout(dojo.hitch(that.gridMultipleItemsWidget, "renderSections"), 100);
							};
							
							var criteriaExists = false;
							
							dijit.registry.byClass('misys.report.widget.Criteria').forEach(function(criterium) {
								criteriaExists = true;
								if (criterium.grid && criterium.grid.store)
								{
									criterium.grid.store.fetch({
										query: {parameter : parameterName},
										onComplete: dojo.hitch(this, function(items, request){
											
											if (items.length <= 0) {
												misys.dialog.show("CONFIRMATION", misys.getLocalization("confirmDeletionGridRecord"),'', deleteCallBack);
											}
											else {
												var item = items[0];
												var onHideCallback = function() {
													deleteCallBack();
													criterium.grid.store.deleteItem(item);
													criterium.grid.store.save();
													setTimeout(function(){
														criterium.renderSections();
														criterium.grid.render();	
													}, 200);
												};
												misys.dialog.show(
														'CONFIRMATION',
														misys.getLocalization('parameterAlreadyUsedInCriterionConfirmation', [parameterName]),
														'',
														onHideCallback);
											}
										})
									});
								}
								else {
									misys.dialog.show("CONFIRMATION", misys.getLocalization("confirmDeletionGridRecord"),'', deleteCallBack);
								}
							});
							
							if(!criteriaExists) {
								misys.dialog.show("CONFIRMATION", misys.getLocalization("confirmDeletionGridRecord"),'', deleteCallBack);
							}
						}
					}  
				});
	    	};
		}
	}
);