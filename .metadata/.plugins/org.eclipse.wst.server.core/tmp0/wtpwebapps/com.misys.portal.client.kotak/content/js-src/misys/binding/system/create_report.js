dojo.provide("misys.binding.system.create_report");
/*
 ----------------------------------------------------------
 Event Binding for

   Report Designer Form.

 Copyright (c) 2000-2010 Misys (http://www.m.com),
 All Rights Reserved. 

 version:   1.0
 date:      20/11/08
 ----------------------------------------------------------
 */

dojo.require("dijit.Dialog");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.CheckBox");
dojo.require("dijit.form.FilteringSelect");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.NumberTextBox");
dojo.require("misys.form.CurrencyTextBox");
dojo.require("dijit.form.DateTextBox");
dojo.require("misys.grid.DataGrid");
dojo.require("misys.form.common");
dojo.require("misys.validation.common");

dojo.require("misys.report.common");
dojo.require("misys.report.widget.Products");
dojo.require("misys.report.widget.Product");
dojo.require("misys.report.widget.Columns");
dojo.require("misys.report.widget.Column");
dojo.require("misys.report.widget.Parameters");
dojo.require("misys.report.widget.Parameter");
dojo.require("misys.report.widget.Criteria");
dojo.require("misys.report.widget.Criterium");
dojo.require("misys.report.widget.Aggregates");
dojo.require("misys.report.widget.Aggregate");
dojo.require("misys.report.widget.GroupingAggregates");
dojo.require("misys.report.widget.ChartAggregates");
dojo.require("misys.report.widget.Filter");
dojo.require("misys.report.widget.Filters");
dojo.require("misys.report.widget.Entity");
dojo.require("misys.report.widget.Entities");



// dojo.require go here

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode
	var clmGrid = "columns-grid";
	var chrtSection = 'chart-section';
	var chrtAggregates = 'chart-aggregates';
	
	// Private functions and variables go here
	function fncdoPreSaveVerifications()
	{
		var contentURL = m.getServletURL("/screen/AjaxScreen/action/ReportCheckAction");
		contentURL += "?reportname="+dj.byId('report_name').get('value');
		
		var dupeFound = false;
		
		fncXhrGet({
			        url : contentURL,
			        sync: true,
					load : function(response, args) {
							
						   dupeFound = (response.result == "true"); //Another record found with the same name
					}
				});
		
		var callback = function(){
			_fncSubmitForm('OTHER');
		};
		
		if (dupeFound)
		{
			//callback is called if the user clicks OK
			m.dialog.show('CONFIRMATION', fncGetLocalizationString('reportAlreadyExists'),'',callback);
			return false;//Duplicate exists
		}
		
		return true;
	}
	
	function _validateLabel(widget)
	{
		dj.byId('addColumnOkButton').set('disabled',false);
		if(!(dj.byId('duplicateColumnsAllowed') && dj.byId('duplicateColumnsAllowed').get('value')=='true'))
		{
			_duplicateColumnName();
		}
		
		if(dj.byId(widget))
		{
			var widgetContent = dj.byId(widget).get("value");
			if((widgetContent.indexOf("<") !== -1) || (widgetContent.indexOf(">") !== -1)) 
			{
                console.debug("Invalid column label");
                var displayMessage = misys.getLocalization('invalidContent');
                dj.hideTooltip(dj.byId(widget).domNode);
				dj.showTooltip(displayMessage, dj.byId(widget).domNode, 0);
				dj.byId(widget).set("state","Error");
				dj.byId(widget)._setStateClass();
                dj.setWaiState(dj.byId(widget).focusNode, "invalid", "true");
                dj.byId('addColumnOkButton').set('disabled',true);
                return false;
        
			}
		}
	}
	/**
	 * <h4>Summary:</h4>
	 * Checking if the number of lines per page is not equal to zero and neither decimal values nor alphabets 
	 */
	function _validateNumberOfLinesPerPage(){
		if(dj.byId('max_nb_lines').get("value")<= 0)
		{
			dj.byId('max_nb_lines').set("state","Error");
			dj.showTooltip(m.getLocalization("ZeroLinesPerPageNotApplicableError"), dj.byId("max_nb_lines").domNode, 0);
		}
		else if((dj.byId("max_nb_lines").get("value")) % 1 !== 0)
		{
			dj.byId('max_nb_lines').set("state","Error");
			dj.showTooltip(m.getLocalization("DecimalNotAllowedError"), dj.byId("max_nb_lines").domNode, 0);
		}
		var hideTT = function()
		{
			dj.hideTooltip(dj.byId("max_nb_lines").domNode);
		};	
		setTimeout(hideTT, 4500);
	}
	
	
	   //To check duplicate column during create or modify the report.
	        function _duplicateColumnName() {
                var columnGrid,
                        columnGridStore,
                        duplicateFound = false,
                        column;
                dj.byId('addColumnOkButton').set('disabled',false);
                column = dj.byId("column");
                columnGrid = dj.byId(clmGrid);
                if(columnGrid)
                {
                        columnGridStore = columnGrid.store;
                }
                
                if(column && columnGridStore)
                {
                        var storeId = columnGrid.gridMultipleItemsWidget.dialog.storeId;
                        columnGridStore.fetch({query : {store_id : '*'},
                                        onComplete : function(items, request) {
                                                dojo.forEach(items, function(item) {
                                                        if (item.column[0] === column.get("value"))
                                                        {
                                                                if(item.store_id[0] !== storeId){
                                                                        console.debug("Duplicate column name");
                                                                        var displayMessage = misys.getLocalization('duplicateColumnName');
                                                                        dj.showTooltip(displayMessage,column.domNode, 0);
                                                                        column.set("state", "Error");
                                                                        column._setStateClass();
                                                                        dj.setWaiState(column.focusNode, "invalid", "true");
                                                                        dj.byId('addColumnOkButton').set('disabled',true);
                                                                        return false;
                                                                }
                                                                
                                                        }
                                                });
                                        }
                                });
                }
        }
        
        function _toggleProductRequire()
        {
        	
        	if( dj.byId('system_type') && dj.byId('product_type'))
        	{
    			if(dj.byId('system_type').get('checked'))
    				{
    					m.animate('fadeOut',d.byId('entities-section'));
    				  m.toggleFields(true, null, ['system_product']);
					  m.toggleFields(false, null, ['single_product']);
					  dj.byId('report_type').set('value', '02');
    				}
    			
    			if(dj.byId('product_type').get('checked'))
    				{
    				m.animate('fadeIn',d.byId('entities-section'));
    				 m.toggleFields(false, null, ['system_product']);
    				 m.toggleFields(true, null, ['single_product']);
    				 dj.byId('report_type').set('value', '01');
    				}  
    		}
    	}
        
        function _inputSourceMapping()
    	{
    		var product = dj.byId('single_product').get('value'),
    		
    		inputSourceWidget = dj.byId("input_source_type"),
    		
    		inputSourceStore= m._config.productResourceMapping[product];
    	
    		if (inputSourceStore)
    		{
    			inputSourceWidget.set('value',inputSourceStore[0].value);
    		}
    		else
    		{
    			inputSourceWidget.set('value',"");
    		}
    		
    	}


        
	// Public functions & variables follow
	d.mixin(m, {
		
		submitDialog : function(/*String*/ dialogId) {
			var dialog 		= dj.byId(dialogId),
			widthField	= dj.byId("width");
			if(dialog && dialog.validate()) {
				console.debug("submitDialog : dialog validated ");
				var total = 0 + parseInt(widthField.get("value"),10);
				if(dj.byId(clmGrid) && dj.byId(clmGrid).store){
					console.debug("submitDialog : columns-grid store :- " , dj.byId(clmGrid).store);
					console.debug("submitDialog : columns-grid store  Items :- " , dj.byId(clmGrid).store._arrayOfAllItems);
					dojo.forEach(dj.byId(clmGrid).store._arrayOfAllItems, function(obj){
						/*if(obj.store_id != dialog.storeId)
						{
							total = parseInt(total,10)+ parseInt(obj.width,10);
						}*/
					});
				}
				
			
				if(total > 100)
				{
					console.debug("submitDialog : total exceeds 100");
					var displayMessage = misys.getLocalization('invalidTotalWidthOfSelectedColumns');
				    widthField.focus();
				    widthField.set("state","Error");
					dj.hideTooltip(widthField.domNode);
					dj.showTooltip(displayMessage, widthField.domNode, 0);
				}
				else
				{
					console.debug("submitDialog : total doesn't exceeds 100");
					dialog.execute();
					dialog.hide();	
				}
				document.body.style.overflow = "visible";
			}else if(dijit.byId('entity').get('state') === "Error"){
				dj.hideTooltip(dj.byId('entity').domNode);
				dj.showTooltip(m.getLocalization('entityBlankError'), dj.byId('entity').domNode);
			}
		},
		
		submitCriteriumDialog : function() {
			var dialog = dj.byId('criterium-dialog-template');
			if(dialog && dj.byId('criterium_operator').get('value') != "isNull" && dj.byId('criterium_operator').get('value') != "isNotNull") {
				var isChecked = dj.byId('criterium_value_type_1').get('checked') || 
								dj.byId('criterium_value_type_2').get('checked') ||
								dj.byId('criterium_value_type_3').get('checked');
				if(dialog.validate() && isChecked) {
		 	 	 	  if (dj.byId('criterium_value_type_1').get('checked') === true)
	 	 	 		  {
		 	 	 		  	dj.byId('criterium_values_set').set('value', '');
		 	 	 		  	dj.byId('criterium_string_value').set('value', '');
		 	 	 		  	dj.byId('criterium_amount_value').set('value', '');
		 	 	 		  	dj.byId('criterium_number_value').set('value', '');
		 	 	 		  	dj.byId('criterium_date_value').set('value', '');
		 	 	 		  
		 	 	 		  	dj.byId('criterium_parameter_default_date_type_1').set('checked', false);
		 	 	 		  	dj.byId('criterium_parameter_default_date_type_2').set('checked', false);
		 	 	 		  	dj.byId('criterium_parameter_default_date_type_3').set('checked', false);
		 	 	 		  	dj.byId('criterium_parameter_default_date_type_4').set('checked', false);
		 	 	 		  	dj.byId('criterium_parameter_default_date_type_5').set('checked', false);
		 	 	 		  	dj.byId('criterium_parameter_default_date_type_6').set('checked', false);
			 	 	 		dj.byId('criterium_parameter_default_date_first_day_of_month_offset_1').set('checked', false);
							dj.byId('criterium_parameter_default_date_first_day_of_month_offset_2').set('checked', false);
							dj.byId('criterium_parameter_default_date_first_day_of_month_offset_days').set('value', 0);
	 	 	 		  }
		 	 	 	  else if (dj.byId('criterium_value_type_2').get('checked') === true) 
	 	 	 		  {
			 	 	 		dj.byId('criterium_parameter').set('value', '');
		 					dj.byId('criterium_parameter_default_values_set').set('value', '');
		 					dj.byId('criterium_parameter_default_string_value').set('value', '');
		 					dj.byId('criterium_parameter_default_number_value').set('value', '');
		 					dj.byId('criterium_parameter_default_amount_value').set('value', '');
		 					dj.byId('criterium_parameter_default_date_value').set('value', '');
		 					
		 	 	 		  	dj.byId('criterium_parameter_default_date_type_1').set('checked', false);
		 	 	 		  	dj.byId('criterium_parameter_default_date_type_2').set('checked', false);
		 	 	 		  	dj.byId('criterium_parameter_default_date_type_3').set('checked', false);
		 	 	 		  	dj.byId('criterium_parameter_default_date_type_4').set('checked', false);
		 	 	 		  	dj.byId('criterium_parameter_default_date_type_5').set('checked', false);
		 	 	 		  	dj.byId('criterium_parameter_default_date_type_6').set('checked', false);
			 	 	 		dj.byId('criterium_parameter_default_date_first_day_of_month_offset_1').set('checked', false);
							dj.byId('criterium_parameter_default_date_first_day_of_month_offset_2').set('checked', false);
							dj.byId('criterium_parameter_default_date_first_day_of_month_offset_days').set('value', 0);
	 	 	 		  }
		 	 	 	  else
	 	 	 		  {
			 	 	 		dj.byId('criterium_parameter').set('value', '');
		 					dj.byId('criterium_parameter_default_values_set').set('value', '');
		 					dj.byId('criterium_parameter_default_string_value').set('value', '');
		 					dj.byId('criterium_parameter_default_number_value').set('value', '');
		 					dj.byId('criterium_parameter_default_amount_value').set('value', '');
		 					dj.byId('criterium_parameter_default_date_value').set('value', '');
		 					
		 	 	 		  	dj.byId('criterium_values_set').set('value', '');
		 	 	 		  	dj.byId('criterium_string_value').set('value', '');
		 	 	 		  	dj.byId('criterium_amount_value').set('value', '');
		 	 	 		  	dj.byId('criterium_number_value').set('value', '');
		 	 	 		  	dj.byId('criterium_date_value').set('value', '');
		 	 	 		  	
	 	 	 		  }
					dialog.execute();
					dialog.hide();
				} 
				else if(!isChecked){
					m.dialog.show('ALERT', m.getLocalization('mandatoryReportCriteriumOperandType'));
				}
            }               
	 	 	 	else
	 	 	 	{
	 	 	 	  dialog.execute();
	 	 	 	  dialog.hide();
			}
			document.body.style.overflow = "visible";
		},

		bind : function() {
			// Event bindings go here
			
			m.connect("criterium_amount_currency_value", "onChange", function(){
				m.setCurrency(this, ["criterium_amount_value"]);
			});
			m.connect('order_list_by_default', 'onChange', m.toggleOrderDetails);
			m.connect('criterium_value_type_1', 'onChange', m.toggleCriteriumFields);
			m.connect('criterium_value_type_2', 'onChange', m.toggleCriteriumFields);
			m.connect('criterium_value_type_3', 'onChange', m.toggleCriteriumFields);
			m.connect("criterium_string_value", "onBlur", m.validateBasicReportInputFields);
			
			m.connect('criterium_parameter_default_date_type_1', 'onChange', m.toggleCriteriumParameterDefaultDate);
			m.connect('criterium_parameter_default_date_type_2', 'onChange', m.toggleCriteriumParameterDefaultDate);
			m.connect('criterium_parameter_default_date_type_3', 'onChange', m.toggleCriteriumParameterDefaultDate);
			m.connect('criterium_parameter_default_date_type_4', 'onChange', m.toggleCriteriumParameterDefaultDate);
			m.connect('criterium_parameter_default_date_type_5', 'onChange', m.toggleCriteriumParameterDefaultDate);
			m.connect('criterium_parameter_default_date_type_6', 'onChange', m.toggleCriteriumParameterDefaultDate);
			m.connect('criterium_parameter_default_date_type_7', 'onChange', m.toggleCriteriumParameterDefaultDate);
			var foo = d.hitch(dj.byId('grouping_enable'), m.toggleGroupingFields, false);
			m.connect('grouping_enable', 'onChange', foo);
			m.connect('grouping_column', 'onChange', m.groupingColumnOnChange);
			m.connect('chart_flag', 'onChange', m.toggleChartFields);
			
			// These are DOM nodes
			m.connect('display_displayed_column_labels', 'onClick', m.displayColumnLabelsInOtherLanguages);
			m.connect('hide_displayed_column_labels', 'onClick', m.hideColumnLabelsInOtherLanguages);
			m.connect('display_parameter_labels', 'onClick', m.displayParameterLabelsInOtherLanguages);
			m.connect('hide_parameter_labels', 'onClick', m.hideParameterLabelsInOtherLanguages);
			m.connect('display_aggregate_labels', 'onClick', m.displayAggregateLabelsInOtherLanguages);
			m.connect('hide_aggregate_labels', 'onClick', m.hideAggregateLabelsInOtherLanguages);

			m.connect('multi_product', 'onChange', m.toggleProductSections);
			if(dj.byId('system_type')){
				m.connect('system_type', 'onChange', _toggleProductRequire);
			}
			if(dj.byId('product_type')){
				m.connect('product_type', 'onChange', _toggleProductRequire);
			}
			if(dj.byId('product_type')){
				m.connect('report_type', 'onChange', m.toggleProductSections);
			}
			m.connect('column', 'onChange', m.toggleColumnFields);
			if(!(dj.byId('duplicateColumnsAllowed') && dj.byId('duplicateColumnsAllowed').get('value')=='true'))
			{
			m.connect("column", 'onChange', _duplicateColumnName);
			}
			m.connect('computed_field', 'onChange', m.toggleComputedFields);
			m.connect('criterium_column', 'onChange', m.toggleCriteriumColumnFields);
			m.connect('criterium_operator', 'onChange', m.toggleCriteriumOperatorFields);
			m.connect('aggregate_column', 'onChange', m.toggleAggregateFields);
			m.connect('aggregate_type', 'onChange', m.aggregateTypeOnChange);
			m.connect('aggregate_eqv_cur_code', 'onChange', m.toggleAutoComputationOfEquivalentCurrency);
			m.connect('aggregate_use_product_currency', 'onChange', m.toggleEquivalentCurrency);
			m.connect('chart_axis_x', 'onChange', m.chartAxisXOnChange);
			
			m.connect('single_product', 'onChange', m.loadProductColumns);
			m.connect('system_product', 'onChange', m.loadProductColumns);
			m.connect('single_product', 'onChange', function(){
				m.toggleColumnSection(this.get('value') != '');
				if(this.get('value') != '') {
					m.animate('fadeIn',d.byId(chrtSection));
				} else {
					m.animate('fadeOut',d.byId(chrtSection));
				}
			});
			m.connect('system_product', 'onChange', function(){
				m.toggleColumnSection(this.get('value') != '');
				if(this.get('value') != '') {
					m.animate('fadeIn',d.byId(chrtSection));
				} else {
					m.animate('fadeOut',d.byId(chrtSection));
				}
			});
			
			m.connect('report_name', 'onChange', function(){
				m.checkReportNameExists();
				
			});
			
			m.connect('products', 'onGridCreate', function(){
				if(dj.byId('products').store){
					m.toggleColumnSection(misys._getStoreSize(dj.byId('products').store) > 0);
				 var ps = dj.byId('products').store;
				 m.connect(ps, 'onNew', function(){
					 m.toggleColumnSection(misys._getStoreSize(dj.byId('products').store) > 0);
				 });
				 m.connect(ps, 'onDelete', function(){
					 m.toggleColumnSection(misys._getStoreSize(dj.byId('products').store) > 0);
				 });
				}
			});
			
			m.connect('columns', 'onGridCreate', function(){
				if(dj.byId('columns').store){
				 m.toggleReportDetailSections(misys._getStoreSize(dj.byId('columns').store) > 0);
				 var cs = dj.byId('columns').store;
				 m.connect(cs, 'onNew', function(){
					 m.toggleReportDetailSections(misys._getStoreSize(dj.byId('columns').store) > 0);
				 });
				 m.connect(cs, 'onDelete', function(){
					 m.toggleReportDetailSections(misys._getStoreSize(dj.byId('columns').store) > 0);
				 });
				}
			});
			
			m.connect('parameters', 'onGridCreate', function(){
				var parametersGrid = dj.byId('parameters').grid;
				if(parametersGrid)
				{
					parametersGrid.handleGridAction = function(event)
			    	{
			    		console.debug("[DataGrid] handleGridAction start");
			    		console.debug("[DataGrid] handleGridAction grid id: " + this.id);
			    		if(event.target.tagName == 'IMG' && event.target.attributes.type)
			    		{
			    			// Edit details
			    			if(event.target.attributes.type.value == 'edit')
			    			{
			    				// Pass in values to dialog
			    				var store = this.store;
			    				var id = store._arrayOfTopLevelItems[event.rowIndex].store_id[0];
			    				store.fetch({query: {store_id: id}, onComplete: d.hitch(this.gridMultipleItemsWidget, "openDialogFromExistingItem")});
			    			}
			    			// Remove row
			    			else if(event.target.attributes.type.value == 'remove')
			    			{
			    				//this._disableGridEvents();
			    				console.debug("[DataGrid] remove row");
			    	            // Unselect all rows
			    	            var items = this.selection.getSelected();
			    	            if (items.length) {
		    	                	// Check if parameter is used in criteria
		    	                	var parameterName = selectedItem.parameter_name;
		    	        			d.query('[id*="misys_report_widget_Criteria_"]').query('[id]').forEach(
		    	        				function(field) {
		    	        					var criteriaId = field.id;
		    	        					criteriaIds.push(criteriaId);
		    	        					var criteria = dj.byId(criteriaId);
		    	        					if (criteria.store)
		    	        					{
		    	        						criteria.store.fetch({
		    	        							query: {
		    	        								parameter: parameterName
		    	        							},
		    	        							onItem: function(item) {
		    	        								// A criterium referring to the parameter to be removed has been found
		    	        								// TODO: ask user if he should proceed
		    	        								console.debug("Parameter " + parameterName + " is used in a criterium");
		    	        							}
		    	        						});
		    	        					}
		    	        			});
		    	        			
			    	            	// Iterate through the list of selected items
			    	            	// and unselect them
			    	                d.forEach(items, function(selectedItem) {
			    	                    if (selectedItem !== null) {
			    	                        // Delete the item from the data store:
			    	                        this.selection.setSelected(selectedItem, false);
			    	                    }
			    	                }, this);
			    	            }    	            
			    				// Then, select row to be removed
			    				this.selection.setSelected(event.rowIndex, true);
			    				// Get all selected items from the Grid:
			    	            items = this.selection.getSelected();
			    	            if (items.length) {
			    	                // Iterate through the list of selected items
			    	            	// and remove them from the store
			    	                d.forEach(items, function(selectedItem) {
			    	                    if (selectedItem !== null) {
			    	                        // Delete the item from the data store:
			    	                        this.store.deleteItem(selectedItem);
			    	                    }
			    	                }, this);
			    	                this.store.save();
			    	            }
			    	            // Unselect all rows
			    	            items = this.selection.getSelected();
			    	            if (items.length) {
			    	                // Iterate through the list of selected items
			    	            	// and unselect them
			    	                d.forEach(items, function(selectedItem) {
			    	                    if (selectedItem !== null) {
			    	                        // Delete the item from the data store:
			    	                        this.selection.setSelected(selectedItem, false);
			    	                    }
			    	                }, this);
			    	            }    	            
			    				setTimeout(d.hitch(this.gridMultipleItemsWidget, "renderSections"), 100);
			    			}
			    		}
			    		console.debug("[DataGrid] handleGridAction end");
			    	};
				}
			});

			m.connect(chrtAggregates, 'onGridCreate', function(){
				if(dj.byId(chrtAggregates).store){
					dj.byId(chrtAggregates).addButtonNode.set('disabled', false);
					m.connect(dj.byId(chrtAggregates).store, 'onDelete', function(){
					 if(misys._getStoreSize(dj.byId(chrtAggregates).store) <= 0) {
					  dj.byId(chrtAggregates).addButtonNode.set('disabled', false);
					 } else {
					  dj.byId(chrtAggregates).addButtonNode.set('disabled', true);	 
					 }
				 });
				}
			});
			
			m.connect('criterium_operator', 'onChange', function(){
				if(dj.byId('criterium_column').get('value') != '' && 
						dj.byId('criterium_operator').get('value') != '' && dj.byId('criterium_operator').get('value') != "isNull" && dj.byId('criterium_operator').get('value') != "isNotNull") {
					m.animate('fadeIn',d.byId('criterium_operand_type_section'));
				} else {
					m.animate('fadeOut',d.byId('criterium_operand_type_section'));
					m.animate('fadeOut',d.byId('criterium_parameter_section'));
	 	 	 	 	m.animate('fadeOut',d.byId('criterium_parameter_default_values_set_section'));
	 	 	 	 	m.animate('fadeOut',d.byId('criterium_operand_type_section'));
	 	 	 	 	m.animate('fadeOut',d.byId('criterium_parameter_section'));
	 	 	 	 	m.animate('fadeOut',d.byId('criterium_parameter_default_values_set_section'));
	 	 	 	 	m.animate('fadeOut',d.byId('account_no_section'));
	 	 	 	 	m.animate('fadeOut',d.byId('criterium_string_section'));
	 	 	 	 	m.animate('fadeOut',d.byId('criterium_number_section'));
	 	 	 	 	m.animate('fadeOut',d.byId('criterium_amount_section'));
	 	 	 	 	m.animate('fadeOut',d.byId('criterium_date_section'));
	 	 	 	 	m.animate('fadeOut',d.byId('criterium_values_set_section'));
				}
			});
			
			m.connect('criterium_column', 'onChange', function(){
				if(m.dialog.isActive && dj.byId('criterium_column') && dj.byId('criterium_column').get('value') != '')
				{
					if(dj.byId('criterium_value_type_1') && dj.byId('criterium_value_type_1').get('checked') === false)
					{
						dj.byId('criterium_parameter_default_values_set').set('value', null);
					}
					if(dj.byId('criterium_value_type_2') && dj.byId('criterium_value_type_2').get('checked') === false)
					{
						dj.byId('criterium_values_set').set('value', null);
					}
				}
				if(dj.byId('criterium_column').get('value') != '' && 
						dj.byId('criterium_operator').get('value') != '') {
					m.animate('fadeIn',d.byId('criterium_operand_type_section'));
				} else {
					m.animate('fadeOut',d.byId('criterium_operand_type_section'));
				}
			});
			
			m.connect('product-ok', 'onClick', function(){
				var dialog = dj.byId('product-dialog-template');
				if(dialog && dialog.validate()) {
					dialog.execute();
					dialog.hide();
					var foo = d.hitch(dj.byId('product'), m.loadProductColumns);
					foo();
				}
			});
			
			d.query("input[type=text][id^='label_']").forEach(function(field, index){
                if(field && field.id !== ""){
                       m.connect(field.id,"onBlur", function(){
                              _validateLabel(field.id);
                       });
                }
          });
		
			d.query("input[type=text][id^='computed_field_id']").forEach(function(field, index){
				if(field && field.id !== ""){
						m.connect(field.id,"onBlur", function(){
							_validateLabel(field.id);
					   });
				}
		  });
			
//			m.connect("max_nb_lines", "onChange", _validateNumberOfLinesPerPage);
			// the field is validated only if the order by default field is checked.
			//m.setValidation('order_column', m.validateOrderType);
			//m.setValidation('order_type', m.validateOrderType);
			m.setValidation('grouping_column', m.validateGroupingColumn);
			m.setValidation('chart_axis_x_scale', m.validateAxisScale);
			m.setValidation('eqv_cur_code', m.validateCurrency);
			m.setValidation('criterium_parameter_default_amount_cur_code', m.validateCurrency);
			m.setValidation('aggregate_eqv_cur_code', m.validateCurrency);
			m.connect(dj.byId('entity-dialog-template'), "onShow", function(){
				dj.byId('entity') && dj.byId('entity').set('readOnly', true);
			});
			
		},
		
		onFormLoad : function() {
			// Form onload events go here
			
			//m.toggleProductSections();
			//To support operation on multi-product check box 
			//To support operation on product and system feature button
			var isMultiple;
			if( dj.byId('system_type') && dj.byId('product_type')){
				if(dj.byId('report_type') && dj.byId('report_type').get('value') === '02')
				{
					dj.byId('system_type').set('checked', true);
				}
				else{
					dj.byId('product_type').set('checked', true);
					if(dj.byId('report_type').get('value') !== '01')
						{
							dj.byId('report_type').set('value', '01');
						}
				}
			
				if(dj.byId('system_type').get('checked')){
					
						  m.animate('fadeIn',d.byId('system_feture_section'), function(){
							  m.toggleFields(true, null, ['system_product']);
							  m.toggleFields(false, null, ['single_product']);
								  dj.byId('products').clear();
						  });
						  m.animate('fadeOut',d.byId('multi_product_section'));
						  m.animate('fadeOut',d.byId('single_product_section'));
						  m.animate('fadeOut',d.byId('multi_product_row'));
						  if(dj.byId('multi_product').get('checked')){
							  dj.byId('multi_product').set('checked',false);
						  }
						 
					}
				else{
					isMultiple = 	dj.byId('multi_product').get('checked');
					if(isMultiple) {
						  m.animate('fadeIn',d.byId('multi_product_section'),function(){
							  m.toggleFields(!isMultiple, null, ['single_product']);
							  if(dj.byId('system_product')){
							  m.toggleFields(false, null, ['system_product']);
							  }
							  if(!isMultiple) {
								  dj.byId('products').clear();
							  }
						  });
						  m.animate('fadeOut',d.byId('single_product_section'));
					  } else {
						  m.animate('fadeIn',d.byId('single_product_section'), function(){
							  m.toggleFields(!isMultiple, null, ['single_product']);
							  if(dj.byId('system_product')){
								  m.toggleFields(false, null, ['system_product']);
								  }
							  if(!isMultiple) {
								  dj.byId('products').clear();
							  }
						  });
						  m.animate('fadeOut',d.byId('multi_product_section'));
					}
				}
			}
			
			else{
				if(dj.byId('report_type') && dj.byId('report_type').get('value') !== '01')
				{
					dj.byId('report_type').set('value', '01');
				}
				 isMultiple = 	dj.byId('multi_product').get('checked');
				if(isMultiple) {
					  m.animate('fadeIn',d.byId('multi_product_section'),function(){
						  m.toggleFields(!isMultiple, null, ['single_product']);
						  m.toggleFields(false, null, ['system_product']);
						  if(!isMultiple) {
							  dj.byId('products').clear();
						  }
					  });
					  m.animate('fadeOut',d.byId('single_product_section'));
				  } else {
					  m.animate('fadeIn',d.byId('single_product_section'), function(){
						  m.toggleFields(!isMultiple, null, ['single_product']);
						  m.toggleFields(false, null, ['system_product']);
						  if(!isMultiple) {
							  dj.byId('products').clear();
						  }
					  });
					  m.animate('fadeOut',d.byId('multi_product_section'));
				}
			}
			var callback;
			if(dj.byId('order_list_by_default').get('checked'))
			{
				 callback = function(){
					  m.toggleFields(true,
								null, ['order_column', 'order_type'], true);
				 };
				 m.animate('fadeIn',d.byId("order_details_section"), callback);
			}
			var foo;
			var sections = [];
			if(dj.byId('single_product').get('value') != '' || dj.byId('multi_product').get('checked'))
			{
				foo = d.hitch(dj.byId('single_product'), m.loadProductColumns);
				foo();
				m.animate('fadeIn',d.byId('columns-section'));
				m.animate('fadeIn',d.byId(chrtSection));
				m.resetCandidateColumns();
				
				foo = d.hitch(dj.byId('grouping_enable'), m.toggleGroupingFields, true);
				foo();

				callback = function(){
					d.query('.dojoxGrid').forEach(function(grid){
						dj.byId(grid.id).render();
					});
				};
			
				
				sections.push(d.byId('parameters-section'));
				sections.push(d.byId('filters-section'));
				sections.push(d.byId('overall-aggregates-section'));
				sections.push(d.byId('grouping-section'));
				//sections.push(d.byId(chrtSection));
				 
				m.animate('fadeIn',sections, callback);
				 
				var ps = dj.byId('products').store;
				if(ps!=null)
				{
					m.connect(ps, 'onNew', function(){
						m.toggleColumnSection(misys._getStoreSize(dj.byId('products').store) > 0);
					});	
				}
				// Attach events
				 //dj.byId('products').onGridCreate();
				 dj.byId('columns').onGridCreate();
				 dj.byId('parameters').onGridCreate();
				 dj.byId(chrtAggregates).onGridCreate();
				 
				/*m.connect('single_product', 'onChange', m.toggleColumnSection(dj.byId('single_product').get('value') != ''));
				if(dj.byId('products').store) {
					var ps2 = dj.byId('products').store;
					m.connect(ps2, 'onNew', function(){
						m.toggleColumnSection(misys._getStoreSize(dj.byId('products').store) > 0);
					});
					m.connect(ps2, 'onDelete', function(){
						m.toggleColumnSection(misys._getStoreSize(dj.byId('products').store) > 0);
					});
				}
				if(dj.byId('columns').store)
				{
					var cs2 = dj.byId('columns').store;
					m.connect(cs2, 'onNew', function()
							{
						m.toggleReportDetailSections(misys._getStoreSize(dj.byId('columns').store) > 0);
					});
					m.connect(cs2, 'onDelete', function()
					{
						m.toggleReportDetailSections(misys._getStoreSize(dj.byId('columns').store) > 0);
					});
				}
				if(dj.byId(chrtAggregates).store){
					m.connect(dj.byId(chrtAggregates).store, 'onDelete', function()
					{
						if(misys._getStoreSize(dj.byId(chrtAggregates).store) <= 0)
						{
							dj.byId(chrtAggregates).addButtonNode.set('disabled', false);
						} else
						{
							dj.byId(chrtAggregates).addButtonNode.set('disabled', true);	 
						}
					});
				}*/	
			}
			if(dj.byId('system_product').get('value') != '')
			{
				foo = d.hitch(dj.byId('system_product'), m.loadProductColumns);
				foo();
				m.animate('fadeIn',d.byId('columns-section'));
				m.animate('fadeIn',d.byId(chrtSection));
				m.resetCandidateColumns();
				
				foo = d.hitch(dj.byId('grouping_enable'), m.toggleGroupingFields, true);
				foo();

				callback = function(){
					d.query('.dojoxGrid').forEach(function(grid){
						dj.byId(grid.id).render();
					});
				};
			
				
				sections.push(d.byId('parameters-section'));
				sections.push(d.byId('filters-section'));
				sections.push(d.byId('overall-aggregates-section'));
				sections.push(d.byId('grouping-section'));
				//sections.push(d.byId(chrtSection));
				 
				m.animate('fadeIn',sections, callback);
				 
				// Attach events
				 //dj.byId('products').onGridCreate();
				 dj.byId('columns').onGridCreate();
				 dj.byId('parameters').onGridCreate();
				 dj.byId(chrtAggregates).onGridCreate();
				 
				
			}
			
			foo = d.hitch(dj.byId('chart_flag'), m.toggleChartFields);
			foo();
			
			//fncShowAllSections(true);
			//m.toggleProductSections();
			
			/**
			 * Manage multi-product and single product sections
			 */
			//d.style(d.byId('multi_product_section'), 'display', (dj.byId('multi_product').get('checked') ? 'block' : 'none'));
			//d.style(d.byId('single_product_section'), 'display', (dj.byId('multi_product').get('checked') ? 'none' : 'block'));
			
			/**
			 * Hide/display sections depending on the type of report (char or list)
			 */
			//fncManageReportSections();

			/**
			 * Manage grouping section
			 */
			//d.style(d.byId('grouping_details_section'), 'display', (dj.byId('grouping_enable').get('checked') ? 'block' : 'none'));
			
			/**
			 * Set columns select box in all sections 
			 */
			//m.defaultDataInPage();
			
			/**
			 * Default Axis X scale section
			 */
			//d.hitch(dj.byId('chart_axis_x'), m.chartAxisXOnChange);
			
			//dj.byId('chart_axis_x').set('required', false);
			//dj.byId('chart_axis_x_scale').set('required', false);
			//dj.byId('chart_rendering').set('required', false);
			
			/**
			 * Publish event formOnLoadEventsPerformed in order to set properly
			 * order_list_by_default, grouping_enable and chart_flag
			 */
			dojo.publish('formOnLoadEventsPerformed');
		},
	    cancelDialog : function(/*String*/ dialogId)
        {
                dj.byId(dialogId).hide();
                document.body.style.overflow = "visible";
		},

		beforeSubmitValidations : function() {
			// Custom validations go here
			// NOTE This function must return true or false
			
			if(dj.byId('single_product') && dj.byId('single_product').get('value'))
			{
				 _inputSourceMapping();
			}
			
			var errorFound = false;
			
			if(dj.byId('multi_product').get('checked')) {
				var productsGrid = dj.byId("products-grid");
				if(!productsGrid || (misys._getStoreSize(productsGrid.store) === 0)) {
					m._config.onSubmitErrorMsg = m.getLocalization('mandatoryReportProduct');
					errorFound= true;
				}
			}
			
			if (!dj.byId('chart_flag').get('checked'))
			{
				var columnsGrid = dj.byId(clmGrid);
				if(!columnsGrid || (misys._getStoreSize(columnsGrid.store) === 0)) {
					m._config.onSubmitErrorMsg = m.getLocalization('mandatoryReportColumn');
					errorFound= true;
				}
			}
			else
			{
				if(dijit.byId('overall-aggregates') && misys._getStoreSize(dijit.byId('overall-aggregates').store) > 0)
				{
					m._config.onSubmitErrorMsg = m.getLocalization('reportOverAllAggregateError');
					errorFound= true;
				}
				else if(!dj.byId('chart-aggregates-grid') || m._getStoreSize(dijit.byId('chart-aggregates-grid').store) === 0)
				{
					m._config.onSubmitErrorMsg = m.getLocalization('reportChartYAxisMandatory');
					errorFound= true;
				}	
			}

			return !errorFound;
			
		}
	});
})(dojo, dijit, misys);








//Including the client specific implementation
       dojo.require('misys.client.binding.system.create_report_client');