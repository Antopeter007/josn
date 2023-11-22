dojo.provide("misys.grid.Pagination");
dojo.experimental("misys.grid.Pagination"); 

dojo.require("dojox.grid.enhanced.plugins.Pagination");

//our declared class
dojo.declare("misys.grid.Pagination",
		[ dojox.grid.enhanced.plugins.Pagination ],
		// class properties:
		{
			name: "paginationEnhanced",
			defaultRows: 100,
			queryOptions : {},
			gotoPage: function(page){
				
				// summary:
				//		Function to handle shifting to an arbirtary page in the list.
				//		Over ride the this method so the search criteria will be restored.
				//		While moving from one page to another page.
				//	page:
				//		The page to go to, starting at 1.
				
				//set the query options required. To retain search parameters.
				window.preventTableHeaderFocus = true;
				this.setQueryOptions();
				var totalPages = Math.ceil(this._maxSize / this.pageSize);
				page--;
				if(page < totalPages && page >= 0 && this._currentPage !== page){
					this._currentPage = page;
					// for list def's  we dont pass data from search form as get
					// its always post,and is set as query options.
					if(this.grid.store && this.grid.store.declaredClass === 'dojox.data.QueryReadStore')
					{
						if(this.grid.params.domIdArray)
						{
							 var grid = this.grid,
                             filterString = {},
                             field,
                             jsonKeys = this.grid.params.jsonArray,
                             fieldIds = this.grid.params.domIdArray;
                    
							 if(grid && (jsonKeys.length === fieldIds.length)) {
								 dojo.forEach(jsonKeys, function(key, i){
                                    field = dijit.byId(fieldIds[i]);
                                     if(field) {
                                             var fieldValue = field.get("value");
                                             fieldValue = fieldValue.replace("'", "\'");
                                             if(fieldValue != ""){
                                             	filterString[key] = fieldValue; 
                                             }
                                     }
								 });
                             
							}
							this.queryOptions=  filterString;
						}
						this.grid.setQuery(this.queryOptions);
					}
					else
					{
						this.grid.setQuery(this.grid.query);
					}
					this.grid.resize();
				}
				if(this.grid.rowSelectCell)
				{
					this.grid.rowSelectCell.toggleAllSelection(false);
				}
				window.preventTableHeaderFocus = false;
			},
			
			/**
			 * Set the query options which are on the screen. Browse through 
			 * search criteria on the screen and build the query options.
			 */
			
			setQueryOptions : function() {
				// summary: 
				//
				
				var form = dijit.byId("TransactionSearchForm"),
					grids = dojo.query(".dojoxGrid"),
					queryOptions = {},
					gridContainer = dojo.query(".gridContainer")[0],
					dateRegex = /Date/,
					timeRegex = /Time/;

				if(form)
				 {
					form.getDescendants().forEach(function(field, i){
						if(field.name) {
							var value ;
							// special case if the field is a radio button
							if(field.declaredClass == 'dijit.form.RadioButton')
							{
								var radioDomNodes = dojo.query("[name='" + field.name + "']", form.domNode);
								// iterate through radio buttons
								dojo.some(radioDomNodes, function(radioDomNode){
									var radioWidget=dijit.byNode(radioDomNode.parentNode);
									// if the radio button checked get its value
									if(radioWidget.checked)
									 {
										value = radioWidget.params.value;
									 }
									
								});
							}
							else
							{
								value = field.get("value");
							}
							if(dateRegex.test(field.declaredClass) || (timeRegex.test(field.declaredClass))) {
								value = field.get("displayedValue");
							}
							if(value === " ") {
								value = "";
							}
							queryOptions[field.get("name")] = value;
						}
					});
					queryOptions["searchFlag"] = true;
					this.queryOptions = queryOptions;
				  }
			}
			
		}
);

dojox.grid.EnhancedGrid.registerPlugin(misys.grid.Pagination/*name:'paginationEnhanced'*/);