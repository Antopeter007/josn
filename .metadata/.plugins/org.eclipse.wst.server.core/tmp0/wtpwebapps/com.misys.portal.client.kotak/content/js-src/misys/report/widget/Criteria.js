dojo.provide("misys.report.widget.Criteria");
dojo.experimental("misys.report.widget.Criteria"); 

dojo.require("dijit._Contained");
dojo.require("misys.grid.GridMultipleItems");
dojo.require("misys.report.widget.Criterium");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {
// our declared class
dojo.declare("misys.report.widget.Criteria",
        [ misys.grid.GridMultipleItems, dijit._Contained ],
        // class properties:
        {
		openDialogFromExistingItemInitFunction: misys.criteriumOpenDialogFromExistingItemInitFunction,
		
		data: { identifier: 'store_id', label: 'store_id', items: [] },
	
        templatePath: null,
        templateString: dojo.byId("criteria-template").innerHTML,
        dialogId: 'criterium-dialog-template',
        xmlTagName: 'criteria',
        xmlSubTagName: 'criterium',
        name: '',
        
		gridColumns: ['column', 'column_type', 'operator', 'value_type', 'parameter', 'string_value', 
		              'number_value', 'amount_value', 'date_value', 'values_set',
		              'default_string_value', 'default_number_value',  'default_amount_value',
		              'default_values_set', 'default_date_type', 'default_date_report_exec_date_offset',
		              'default_date_report_exec_date_offset_days', 'default_date_first_day_of_month_offset',
		              'default_date_first_day_of_month_offset_days', 'default_date_last_day_of_month_offset',
		              'default_date_last_day_of_month_offset_days', 'default_date_value'],

        propertiesMap: {
			column: {_fieldName: 'criterium_column'},
			column_type: {_fieldName: 'criterium_column_type'},
			operator: {_fieldName: 'criterium_operator'},
			value_type: {_fieldName: 'criterium_operand_type'},
			parameter: {_fieldName: 'criterium_parameter'},
			string_value: {_fieldName: 'criterium_string_value'},
			number_value: {_fieldName: 'criterium_number_value'},
			amount_value: {_fieldName: 'criterium_amount_value'},
			date_value: {_fieldName: 'criterium_date_value'},
			values_set: {_fieldName: 'criterium_values_set'},
			default_string_value: {_fieldName: 'criterium_parameter_default_string_value'},
			default_number_value: {_fieldName: 'criterium_parameter_default_number_value'},
			default_amount_value: {_fieldName: 'criterium_parameter_default_amount_value'},
			default_values_set: {_fieldName: 'criterium_parameter_default_values_set'},
			default_date_type: {_fieldName: 'criterium_parameter_default_date_type'},
			default_date_report_exec_date_offset: {_fieldName: 'criterium_parameter_default_date_report_exec_date_offset'},
			default_date_report_exec_date_offset_days: {_fieldName: 'criterium_parameter_default_date_report_exec_date_offset_days'},
			default_date_first_day_of_month_offset: {_fieldName: 'criterium_parameter_default_date_first_day_of_month_offset'},
			default_date_first_day_of_month_offset_days: {_fieldName: 'criterium_parameter_default_date_first_day_of_month_offset_days'},
			default_date_last_day_of_month_offset: {_fieldName: 'criterium_parameter_default_date_last_day_of_month_offset'},
			default_date_last_day_of_month_offset_days: {_fieldName: 'criterium_parameter_default_date_last_day_of_month_offset_days'},
			default_date_value: {_fieldName: 'criterium_parameter_default_date_value'}
			},

			
			
        layout: [
                 { name: m.getLocalization("column"), field: 'column', formatter: misys.getColumnDecode, width: '35%' },
                 { name: m.getLocalization("operator"), field: 'operator', formatter: misys.getCriteriaOperatorDecode, width: '20%' },
                 { name: m.getLocalization("value"), get: misys.getCriteriumOperand, width: '35%' },
                 { name: ' ', field: 'actions', formatter: misys.grid.formatReportActions, width: '10%' }
                 ],

        
    	/*constructor: function()
    	{
			console.debug("[Criteria] constructor");
    	},
    	
    	postCreate: function(){
			console.debug("[Criteria] postCreate start");
    		this.inherited(arguments);
			console.debug("[Criteria] postCreate end");
    	},
    	
    	
    	Code used when criterium is made with a HTML template instead of a grid
    	addItem: function(event)
    	{
    		console.debug("[Criteria] addItem start");
    		var criteriumItem = new misys.report.widget.Criterium({}, document.createElement("div")); 
    		this.addChild(criteriumItem);
    		this.renderSections();
    		console.debug("[Criteria] addItem end");
    	}*/
    	
    	_showHideSections: function(item)
    	{
    		var valueType = dojo.isArray(item.value_type) ? item.value_type[0] : item.value_type;
    		var column = dojo.isArray(item.column) ? item.column[0] : item.column;
    		
    		dojo.byId('criterium_parameter_section').style.display = (valueType == '01' ? 'block' : 'none');
    		dojo.byId('criterium_string_section').style.display = (valueType == '02' && arrColumn[column][0] == 'String' ? 'block' : 'none');
    		dojo.byId('criterium_number_section').style.display = (valueType == '02' && arrColumn[column][0] == 'Number' ? 'block' : 'none');
    		dojo.byId('criterium_amount_section').style.display = (valueType == '02' && arrColumn[column][0] == 'Amount' ? 'block' : 'none');
    		dojo.byId('criterium_date_section').style.display = (valueType == '02' && arrColumn[column][0] == 'Date' ? 'block' : 'none');
    		dojo.byId('criterium_values_set_section').style.display = (valueType == '02' && arrConstrainedParameterType.indexOf(arrColumn[column][0]) !== -1 ? 'block' : 'none');
    	},
    	
    	startup: function(){
    		if(this._started) { return; }
    		
			console.debug("[Criteria] startup start");
			this.name = this.id;
			// Prepare data store
			this.dataList = [];
			if(this.hasChildren())
			{
				dojo.forEach(this.getChildren(), function(child){
					var column = child.get('column');
					var value = child.get('string_value');
					var operator = child.get('operator');
					var parameter = child.get('parameter');
					var valueType = child.get('value_type');
					var defaultStringValue = child.get('default_string_value');
					var defaultDateType = child.get('default_date_type');
					var defaultDateReportExecDateOffset = child.get('default_date_report_exec_date_offset');
					var defaultDateReportExecDateOffsetDays = child.get('default_date_report_exec_date_offset_days');
					var defaultDateFirstDayOfMonthOffset = child.get('default_date_first_day_of_month_offset');
					var defaultDateFirstDayOfMonthOffsetDays = child.get('default_date_first_day_of_month_offset_days');
					var defaultDateLastDayOfMonthOffset = child.get('default_date_last_day_of_month_offset');
					var defaultDateLastDayOfMonthOffsetDays = child.get('default_date_last_day_of_month_offset_days');
					var item = {
							column: column,
							column_type: arrColumn[column][0],
							operator: operator,
							value_type: valueType == 'parameter' ? (defaultDateType != '' ? '03' : '01') : '02',
							parameter: parameter,
							string_value: valueType == 'string' && arrColumn[column][0] == 'String' ? value : '',
							number_value: valueType == 'string' && arrColumn[column][0] == 'Number' ? value : '',
							amount_value: valueType == 'string' && arrColumn[column][0] == 'Amount' ? child.get('amount_value'): '',
							date_value: valueType == 'string' && arrColumn[column][0] == 'Date' ? value : '',
							values_set: valueType == 'string' && arrConstrainedParameterType.indexOf(arrColumn[column][0]) !== -1 ? value : '',

							default_string_value: arrColumn[column][0] == 'String' ? defaultStringValue : '',
							default_number_value: arrColumn[column][0] == 'Number' ? defaultStringValue : '',
							default_amount_value: arrColumn[column][0] == 'Amount' ? defaultStringValue : '',
							default_values_set: arrConstrainedParameterType.indexOf(arrColumn[column][0]) !== -1 ? defaultStringValue : '',
							default_date_type: defaultDateType,
							default_date_report_exec_date_offset: defaultDateReportExecDateOffset,
							default_date_report_exec_date_offset_days: defaultDateReportExecDateOffsetDays,
							default_date_first_day_of_month_offset: defaultDateFirstDayOfMonthOffset,
							default_date_first_day_of_month_offset_days: defaultDateFirstDayOfMonthOffsetDays,
							default_date_last_day_of_month_offset: defaultDateLastDayOfMonthOffset,
							default_date_last_day_of_month_offset_days: defaultDateLastDayOfMonthOffsetDays,
							default_date_value: arrColumn[column][0] == 'Date' ? defaultStringValue : ''
					};
					this.dataList.push(item);
				}, this);
			}

    		this.inherited(arguments);
			console.debug("[Criteria] startup end");
    	},
    	
    	openDialogFromExistingItem: function(items, request)
    	{
    		console.debug("[Criteria] openDialogFromExistingItem start");

			// Disable dialog events
    		misys.dialog.isActive = false;
    		
    		var item = items[0];
    		
    		// Set list of criterium operators
    		var column = dojo.isArray(item.column) ? item.column[0] : item.column; 
    		misys.setCriteriumOperatorsList(column);

    		// Set list of parameters
    		var currentCriteriumParameterName = dojo.isArray(item.parameter) ? item.parameter[0] : item.parameter; 
    		misys.setCriteriumParametersList(currentCriteriumParameterName);
    		
    		// Show/hide the different sections in the dialog
    		this._showHideSections(item);
    		var column_type = dojo.isArray(item.column_type) ? item.column_type[0] : item.column_type;
    		if(arrConstrainedParameterType.indexOf(column_type) !== -1)
			{
    			misys.setCriteriumValuesSetList(column);
			}
    		
    		this.inherited(arguments);
    		
    		misys.toggleCriteriumParameterDefaultDate();

    		console.debug("[Criteria] openDialogFromExistingItem end");
    	},
    	
    	addItem: function(event)
    	{
    		console.debug("[Criteria] addItem start");

			// Disable dialog events
    		misys.dialog.isActive = false;

    	    this.inherited(arguments);
    		
    		// Set list of criterium operators
    	    misys.setCriteriumOperatorsList();

    		// Set list of parameters
    	   misys.setCriteriumParametersList();
    		
    		// Hide all sections
		    dojo.byId('criterium_parameter_section').style.display = 'none';
		    dojo.byId('criterium_string_section').style.display = 'none';
		    dojo.byId('criterium_number_section').style.display = 'none';
		    dojo.byId('criterium_amount_section').style.display = 'none';
		    //dojo.byId('criterium_date_section').style.display = 'none';
		    dojo.byId('criterium_values_set_section').style.display = 'none';
    		
    		//misys.toggleCriteriumParameterDefaultDate();
    		
    		console.debug("[Criteria] addItem end");
    		document.body.style.overflow = "hidden";
    	},
    	
    	updateData: function(event)
    	{
    		this.inherited(arguments);
    		
    		// Update parameter default values if needed
    		var parameterName = dijit.byId('criterium_parameter').get('value');
    		if (parameterName != '')
    		{
    			var parameters = dijit.byId('parameters');
    			if (parameters.grid && parameters.grid.store)
    			{
    				parameters.grid.store.fetch({query: {name: parameterName}, onComplete: function(items, request){
    					if (items.length == 1)
    					{
    						var getRadioValue = function(radioName, node){
								var value = '';
								var radioDomNodes = dojo.query("[name='" + radioName + "']", node);
								dojo.some(radioDomNodes, function(radioDomNode){
									var radioWidget = dijit.byNode(radioDomNode.parentNode);
									var checked = radioWidget.get('checked'); 
									if (checked)
									{
										value = radioWidget.params.value;
										return true;
									}
								});
								return value;
							};
    						var item = items[0];
    						var parameterDefaultValueSection = dojo.byId('criterium_parameter_default_date_section');
    						parameters.grid.store.setValue(item, 'default_string_value', dijit.byId('criterium_parameter_default_string_value').get('value'));
    						parameters.grid.store.setValue(item, 'default_number_value', dijit.byId('criterium_parameter_default_number_value').get('value'));
    						parameters.grid.store.setValue(item, 'default_amount_value', dijit.byId('criterium_parameter_default_amount_value').get('value'));
    						parameters.grid.store.setValue(item, 'default_date_type', getRadioValue('criterium_parameter_default_date_type', parameterDefaultValueSection));
    						parameters.grid.store.setValue(item, 'current_date_offset_type', getRadioValue('criterium_parameter_default_date_report_exec_date_offset', parameterDefaultValueSection));
    						parameters.grid.store.setValue(item, 'current_date_offset_days', dijit.byId('criterium_parameter_default_date_report_exec_date_offset_days').get('displayedValue'));
    						parameters.grid.store.setValue(item, 'first_day_offset_type',  getRadioValue('criterium_parameter_default_date_first_day_of_month_offset', parameterDefaultValueSection));
    						parameters.grid.store.setValue(item, 'first_day_offset_days', dijit.byId('criterium_parameter_default_date_first_day_of_month_offset_days').get('displayedValue'));
    						parameters.grid.store.setValue(item, 'last_day_offset_type', getRadioValue('criterium_parameter_default_date_last_day_of_month_offset', parameterDefaultValueSection));
    						parameters.grid.store.setValue(item, 'last_day_offset_days', dijit.byId('criterium_parameter_default_date_last_day_of_month_offset_days').get('displayedValue'));
    						parameters.grid.store.setValue(item, 'default_date_value', dijit.byId('criterium_parameter_default_date_value').get('displayedValue'));
    					}
    				}});
    				parameters.grid.store.save();
    			}
    		}
    	}
    	
    	
     }
);
})(dojo, dijit, misys);
