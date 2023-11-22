dojo.provide("misys.binding.core.beneficiary_advice_templates");

(function(d, dj, m){
	
	function _initialiseGridMultipleItem(templateJson,gridColumnsArray,gridHeadersArray,mode,templateDescription)
	{
		console.debug("[beneficiary_advice_templates] Start : _initialiseGridMultipleItem");
		
		console.debug("[beneficiary_advice_templates] Inside :_initialiseGridMultipleItem,  templateJson : " ,templateJson);
		console.debug("[beneficiary_advice_templates] Inside :_initialiseGridMultipleItem,  gridColumnsArray : " ,gridColumnsArray);
		console.debug("[beneficiary_advice_templates] Inside :_initialiseGridMultipleItem,  gridHeadersArray : " ,gridHeadersArray);
		
		dojo.require("misys.grid.GridMultipleItems");
		
		//GridMultipleItem Built Programmatically
		dojo.declare("misys.system.widget.BeneficiaryAdvicesGrid",
				[ misys.grid.GridMultipleItems ],
				// class properties:
				{
				data: { identifier: 'store_id', label: 'store_id', items: [] },
				overrideDisplaymode : mode,
				templatePath: null,
				templateString: dojo.byId("beneAdvTable-template").innerHTML,
				dialogId: 'beneAdvTable-dialog-template',
				xmlTagName: 'bene_advices',
				xmlSubTagName: 'bene_advice',
				headers : gridHeadersArray,
				gridColumns: gridColumnsArray,
				dataArray : null,
				templateJSON : templateJson,
				templateDesc : templateDescription,
				propertiesMap: _getPropertiesMap(templateJson,gridColumnsArray),
		        
				layout: _getLayout(templateJson),
		        
				buildRendering: function()
				{
					console.debug("[BeneficiaryAdvicesGrid] Start : buildRendering");
					this.inherited(arguments);
					console.debug("[BeneficiaryAdvicesGrid] End : buildRendering");
				},
				startup: function(){
					console.debug("[BeneficiaryAdvicesGrid] Start : startup");
					// Prepare data store
					this.dataList = this.dataArray || [];
					this.templateString = dojo.byId("beneAdvTable-template").innerHTML;
					this.inherited(arguments);
					console.debug("[BeneficiaryAdvicesGrid] End : startup");
				},
				_retrieveItemFields : function(){
					console.debug("[BeneAdvicesGrid] Start : _retrieveItemFields");
					
					var widgets = this.dialog.getChildren();
					var itemFields = {};
					// First, look for the widget's properties
					console.debug("[BeneAdvicesGrid] Inside : _retrieveItemFields, this.gridColumns : ",this.gridColumns);
					for(var i = 0, len = this.gridColumns.length; i < len; i++)
					{
						console.debug("[BeneAdvicesGrid] Inside : _retrieveItemFields, this.gridColumns : ",this.gridColumns[i]);
						var property = this.gridColumns[i];
						console.debug("[BeneAdvicesGrid] Inside : _retrieveItemFields, property : ",property);
						if(this.propertiesMap[property] && this.propertiesMap[property].amtflag && this.propertiesMap[property].amtflag === "N")
						{
							console.debug("[BeneAdvicesGrid] Inside : _retrieveItemFields, this.propertiesMap : ",this.propertiesMap);
							var searchedWidgetId = this.propertiesMap[property]._fieldName;
							console.debug("[BeneAdvicesGrid] Inside : _retrieveItemFields, widgets : ",widgets);
							console.debug("[BeneAdvicesGrid] Inside : _retrieveItemFields, property : ",property);
							console.debug("[BeneAdvicesGrid] Inside : _retrieveItemFields, searchedWidgetId : ",searchedWidgetId);
							console.debug("[BeneAdvicesGrid] Inside : _retrieveItemFields, itemFields passed: ",itemFields);
							
							itemFields = this._retrieveWidgetsValues(widgets, property, searchedWidgetId, itemFields);
							
							console.debug("[BeneAdvicesGrid] Inside : _retrieveItemFields, itemFields returned: ",itemFields);
						}
						else if(this.propertiesMap[property] && this.propertiesMap[property].amtflag && this.propertiesMap[property].amtflag === "Y")
						{
							console.debug("[BeneAdvicesGrid] here5");
							var curCodeWidgetId = property+"_cur_code";
							var amtWidgetId = property+"_amt";
							var  value;
							if(dj.byId(curCodeWidgetId) && dj.byId(amtWidgetId))
							{
								value = dj.byId(curCodeWidgetId).get('displayedValue') + " " + dj.byId(amtWidgetId).get('displayedValue');
							}
							else
							{
								value = '';
							}
							itemFields[property] = value;
						}
						else
						{
							if(property !== 'store_id' && property !== 'is_valid')
							{
								console.error("[BeneAdvicesGrid] Error while updating grid"+property);
							}
						}
					}
					itemFields.is_valid = this.is_valid;
					
					console.debug("[BeneAdvicesGrid] End : _retrieveItemFields");
					return itemFields;
				},
				addItem : function(event)
				{
					console.debug("[BeneAdvicesGrid] Start : addItem");
					var that = this;
					var inherit = false;
					if(that.grid && that.grid.store)
					{
						that.grid.store.fetch({ onBegin: function(total){ 
								if(total < parseInt(m._config.beneAdvTableMaxRows,10))
								{
									inherit = true;	
								}
								else
								{
									m.dialog.show("ALERT",m.getLocalization("beneAdvMaxRowsReached"));
								}
							} 
						});
					}
					else
					{
						inherit = true;
					}
					if(inherit)
					{
						that.inherited(arguments);
					}
					console.debug("[BeneAdvicesGrid] End : addItem");
				},
				toXML: function(){
					
					console.debug("[BeneAdvicesGrid] Start : toXML");
					var xml = [];
					
					if(this.xmlTagName) {
						xml.push("<", this.xmlTagName, ">");
					}
					if(this.grid)
					{
						this.grid.store.fetch({query: {store_id: '*'}, 
								onComplete: dojo.hitch(this, function(items, request){
							xml.push(this.itemToXML(items, this.xmlSubTagName));
						})});
					}
					if(this.xmlTagName) {
						xml.push("</", this.xmlTagName, ">");
					}
					xml.push("<bene_adv_table_format_time>");
					xml.push(this.templateJSON.modificationTime);
					xml.push("</bene_adv_table_format_time>");
					
					xml.push("<bene_adv_table_format_json>");
					xml.push(dojo.toJson(this.templateJSON));
					xml.push("</bene_adv_table_format_json>");
					if(this.templateDesc !== null && this.templateDesc !== undefined)
					{
						xml.push("<bene_adv_table_format_description>");
						xml.push(dojo.trim(dojox.html.entities.encode(this.templateDesc, dojox.html.entities.html)));
						xml.push("</bene_adv_table_format_description>");
					}
					console.debug("[BeneAdvicesGrid] Inside : toXML, var xml = "+ xml.join(""));
					console.debug("[BeneAdvicesGrid] End : toXML");
					return xml.join("");
				},
				openDialogFromExistingItem: function(items, request)
				{
					console.debug("[BeneAdvicesGrid] Start : openDialogFromExistingItem");
					
					// Disable dialog events
					misys.dialog.isActive = false;
					
					var item = items[0];
				
					// Check Dialog widget
					this.checkDialog();
				
					// Set dialog title
					if(this.overrideDisplaymode !== "view") {
						this.dialog.set('title', this.dialogUpdateItemTitle);
					} else {
						var viewItemTitle = this.dialogViewItemTitle || this.dialogUpdateItemTitle;
						this.dialog.set('title', viewItemTitle);
					}

					// Reset dialog fields
					this.resetDialog();
					
					// Attach current widget to dialog widget
					this.dialog.gridMultipleItemsWidget = this;
					
					this.dialog.execute = this.dialogExecute;
				
					// Attach current widget and store id to dialog widget
					this.dialog.gridMultipleItemsWidget = this;
					this.dialog.storeId = (dojo.isArray(item.store_id) ? item.store_id[0] : item.store_id);
				
					// Populate the dialog
					var widgets = this.dialog.getChildren();
					for(var property in item)
					{
						if(this.propertiesMap[property] && this.propertiesMap[property].amtflag && this.propertiesMap[property].amtflag === "N")
						{
							var searchedWidgetId = (this.propertiesMap[property] && this.propertiesMap[property]._fieldName ? this.propertiesMap[property]._fieldName : property);
							if(property != "store_id")
							{					
								dojo.some(widgets, function(widget){
									if(widget.id == searchedWidgetId || widget.name == searchedWidgetId)
									{
										var value = item[property];
										value = dojo.isArray(value) ? value[0] : value;
										
										if((value !== 0 && !value) && this.overrideDisplaymode === 'view') {
											// Being extra safe here in case of strange widget issues
											if(widget && widget.id && dojo.byId(widget.id + "_row")) {
												dojo.style(widget.id + "_row", "display", "none");
											}
										}
										
										if (widget.isInstanceOf(misys.grid.GridMultipleItems))
				    					{
											// if widget contains grid, destroy it first
											if (widget.grid)
											{
												widget.grid.destroy();
											}
											// Create datalist
											
											if (dojo.isObject(value) && value._values && dojo.isArray(value._values))
											{
												widget.dataList = dojo.clone(value._values);
												widget.createDataStoreFromDataList();
												widget.createDataGrid();
												
												var key = item.store_id+'_'+property;
												if(this.handle && !this.handle[key]){
													this.handle[key] = misys.connect(this.dialog, "onShow", widget, "renderAll");
												}
											}
				    					}
										else
										{
					    					var declaredClass = widget.declaredClass;
					    					switch(declaredClass)
					    					{
					    						case 'dijit.form.DateTextBox':
					    							widget.set('displayedValue', value);
					    							break;
					    						case 'dijit.form.CheckBox':
					    							widget.set('checked', value == 'Y' ? true : false);
					    							break;
					    						case 'dijit.form.RadioButton':
					    							var radioDomNodes = dojo.query("[name='" + widget.name + "']", this.dialog.domNode);
					    							dojo.some(radioDomNodes, function(radioDomNode){
					    								var radioWidget = dj.byNode(radioDomNode.parentNode);
					    								if (radioWidget.params.value == value)
					    								{
					    									radioWidget.set('checked', true);
					    									return true;
					    								}
					    							});
					    							break;
					    						case 'dijit.form.NumberTextBox':
					    							if (value !== null && value !== '' && value !== 'NaN')
					    							{
					    								widget.set('value', value, false);
					    							}
					    							break;
					    						default:
					    							widget.set('value', value);
					    							break;
					    					}
					    					if (this.overrideDisplaymode === 'view'){
												widget.set("readOnly", true);
											}
					    					return true;
										}
									}
									return false;
								}, this);
							}
						}
						else if(this.propertiesMap[property] && this.propertiesMap[property].amtflag && this.propertiesMap[property].amtflag === "Y")
						{
							var curCodeWidgetId = property+"_cur_code";
							var amtWidgetId = property+"_amt";
							var value = item[property];
							var arrValue = value = dojo.isArray(value) ? value[0].split(" ") : value.split(" ");
							if(dj.byId(curCodeWidgetId) && dj.byId(amtWidgetId) && value !== '')
							{
								dj.byId(curCodeWidgetId).set('displayedValue',arrValue[0]);
								dj.byId(amtWidgetId).set('displayedValue',arrValue[1]);
							}
							else
							{
								dj.byId(curCodeWidgetId).set('displayedValue',"");
								dj.byId(amtWidgetId).set('displayedValue',"");
							}
						}
						else
						{
							if(property !== 'store_id' && property !== 'is_valid')
							{
								console.error("[BeneAdvicesGrid] Error while opening dialog from existing "+property);
							}
						}
					}
					
					// Execute init function if required
					if (this.openDialogFromExistingItemInitFunction !== null)
					{
						this.openDialogFromExistingItemInitFunction(item);
					}
					
					// Show the dialog
					this.dialog.show();
					
					// Activate dialog events
					setTimeout(dojo.hitch(this, "activateDialog"), 500);
					
					// If the row is inValid, then fire the full validation
					if (item.hasOwnProperty("is_valid")) {
						var isValid = (dojo.isArray(item.is_valid)) ? item.is_valid[0] : item.is_valid;
						if(isValid !== "Y") {
							this.validateDialog(true);
						}
		            }

					console.debug("[BeneAdvicesGrid] End : openDialogFromExistingItem");
				}
			}
		);
		
		console.debug("[beneficiary_advice_templates] End : _initialiseGridMultipleItem");
	}
	
	function _createDialogField(/*Object*/node)
	{
		/*
		 * Dialog for the GridMultiple Item is Created here
		 */
		console.debug("[beneficiary_advice_templates] Start : _createDialogField");
		var fieldDivId = (node.column_label).replace(/\s/g,'')+"_row";
		var fieldDivStr = "<div id='"+ fieldDivId +"' class='field'>";
		var labelDivStr = "<label>"+node.column_label+':'+"</label>";
		var resultString = "";
		resultString = resultString.concat(fieldDivStr,labelDivStr);
		var field = "";
		if(node.column_type === "01")
		{
			field = "<div trim='true' uppercase='true' dojoType='dijit.form.ValidationTextBox' required='true' regExp='^[a-zA-Z]*$' class='xx-small' maxLength='3'" +
					"id='"+ (node.column_label).replace(/\s/g,'') +"_cur_code'" +
					"></div>";
			field = field.concat("<div trim='true' dojoType='misys.form.CurrencyTextBox' required='true' class='small'" +
					"id='"+ (node.column_label).replace(/\s/g,'') +"_amt'" +
					"maxLength='"+ node.column_width +"'" +
					"></div>");
		}
		else if(node.column_type === "02")
		{
			field = "<div trim='true' uppercase='true' dojoType='dijit.form.ValidationTextBox' required='true' regExp='^[a-zA-Z]*$' class='xx-small' maxLength='3'" +
					"id='"+ (node.column_label).replace(/\s/g,'') +"_cur_code'" +
					"></div>";
			field = field.concat("<div trim='true' dojoType='misys.form.CurrencyTextBox' required='true' class='small'" +
					"id='"+ (node.column_label).replace(/\s/g,'') +"_amt'" +
					"maxLength='"+ node.column_width +"'" +
					"></div>");
		}
		else if(node.column_type === "03")
		{
			field = "<div dojoType='dijit.form.DateTextBox' required='true' class='small'" +
					"id='"+ (node.column_label).replace(/\s/g,'') +"'" +
					"></div>";
		}
		else if(node.column_type === "04")
		{
			field = "<div dojoType='dijit.form.ValidationTextBox' regExp='^[0-9\\s+-]*$' required='true' class='medium' " +
			"id='"+ (node.column_label).replace(/\s/g,'') +"'" +
			"maxLength='"+ node.column_width +"'" +
			"></div>";
		}
		else if(node.column_type === "05")
		{
			field = "<div  dojoType='dijit.form.ValidationTextBox' regExp='^[a-zA-Z0-9\\s+-]*$' required='true' class='medium'" +
			"id='"+ (node.column_label).replace(/\s/g,'') +"'" +
			"maxLength='"+ node.column_width +"'" +
			"></div>";
		}
		else if(node.column_type === "06")
		{
			field = "<div dojoType='dijit.form.ValidationTextBox' regExp='^[a-zA-Z\\s]*$' required='true' class='medium'" +
			"id='"+ (node.column_label).replace(/\s/g,'') +"'" +
			"maxLength='"+ node.column_width +"'" +
			"></div>";
		}
		resultString = resultString.concat(field);
		resultString = resultString.concat("</div>");
		console.debug("[beneficiary_advice_templates] End : _createDialogField");
		return resultString;
	}
	
	function _setCurrencyWithDecimal(node)
	{
		/*
		 * Sets the Currency to the Amount field 
		 */
		console.debug("[beneficiary_advice_templates] Start : _setCurrencyWithDecimal");
		var currencyField = dj.byId(""+(node.column_label).replace(/\s/g,'')+"_cur_code");
		var amountField = dj.byId(""+(node.column_label).replace(/\s/g,'')+"_amt");
		var currency, cldrMonetary;
	
		var widthOfField = parseFloat(node.column_width);
		if(currencyField && currencyField.get("value") !== "" &&
				currencyField.state !== "Error") 
		{
			currency = currencyField.get("value");
			if(amountField)
			{
				cldrMonetary = d.cldr.monetary.getData(currency);
				var i,maxStr = "";
				if(cldrMonetary.places === 2)
				{
					for(i=0;i<(widthOfField-3);i++)
					{
						maxStr = maxStr.concat("9");
					}
					maxStr = maxStr.concat(".99");
					amountField.set("constraints", {
						round: cldrMonetary.round,
						places: cldrMonetary.places,
						min:0.00,
						max: parseFloat(maxStr)
					});
				}
				else if(cldrMonetary.places === 3)
				{
					for(i=0;i<(widthOfField-4);i++)
					{
						maxStr = maxStr.concat("9");
					}
					maxStr = maxStr.concat(".999");
					amountField.set("constraints", {
						round: cldrMonetary.round,
						places: cldrMonetary.places,
						min:0.000,
						max: parseFloat(maxStr)
					});
				}
				else if(cldrMonetary.places === 0)
				{
					for(i=0;i<(widthOfField);i++)
					{
						maxStr = maxStr.concat("9");
					}
					amountField.set("constraints", {
						round: cldrMonetary.round,
						places: cldrMonetary.places,
						min:0,
						max: parseFloat(maxStr)
					});
				}
			}
		}
		console.debug("[beneficiary_advice_templates] End : _setCurrencyWithDecimal");
	}
	
	function _setCurrencyWithOutDecimal(node)
	{
		/*
		 * Sets the Currency to the Amount field 
		 */
		console.debug("[beneficiary_advice_templates] Start : _setCurrencyWithOutDecimal");
		var currencyField = dj.byId(""+(node.column_label).replace(/\s/g,'')+"_cur_code");
		var amountField = dj.byId(""+(node.column_label).replace(/\s/g,'')+"_amt");
		var currency, cldrMonetary;
	
		var widthOfField = parseFloat(node.column_width);
		if(currencyField && currencyField.get("value") !== "" &&
				currencyField.state !== "Error") 
		{
			currency = currencyField.get("value");
			if(amountField)
			{
				cldrMonetary = d.cldr.monetary.getData(currency);
				
				var maxStr = "";
				for(var i=0;i<(widthOfField);i++)
				{
					maxStr = maxStr.concat("9");
				}
				amountField.set("constraints", {
					round: cldrMonetary.round,
					places: 0,
					min:0,
					max: parseFloat(maxStr)
				});
				
			}
		}
		console.debug("[beneficiary_advice_templates] End : _setCurrencyWithOutDecimal");
	}
	
	function _getPropertiesMap(templateJson,gridColumnsArray)
	{
		/*
		 * Builds the propertiesMap json for GridMultipleItem
		 */
		console.debug("[beneficiary_advice_templates] Start : _getPropertiesMap");
		var propertiesMap = {};
		dojo.forEach(templateJson.table, function(node, index){
			if(node.column_type !== "01" && node.column_type !== "02")
			{
				propertiesMap[(node.column_label).replace(/\s/g,'')] = {_fieldName: (node.column_label).replace(/\s/g,''),amtflag:'N'};
			}
			else
			{
				propertiesMap[(node.column_label).replace(/\s/g,'')] = {_fieldName: (node.column_label).replace(/\s/g,''),amtflag:'Y'};
			}
		});
		console.debug("[beneficiary_advice_templates] End : _getPropertiesMap");
		return propertiesMap;
	}
	
	function _getLayout(templateJson)
	{
		/*
		 * Builds the layout json for GridMultipleItem
		 */
		console.debug("[beneficiary_advice_templates] Start : _getLayout");
		var layout = [];
		var columnCount = templateJson.table.length;
		var eachColumnWidth = ""+95/columnCount+"%";
		dojo.forEach(templateJson.table, function(node, index){
			var columnLabel = ''+(node.column_label).replace(/\s/g,'')+'';
			var columnAlignment = 'text-align:'+node.column_alignment+';';
			layout.push({ name: columnLabel, field: columnLabel, width: eachColumnWidth , cellStyles: columnAlignment, noresize:true });
		});
		layout.push({ name: ' ', field: 'actions', formatter: misys.grid.formatReportActions, width: '5%',noresize:true });
		layout.push({ name: 'Id', field: 'store_id', headerStyles: 'display:none', cellStyles: 'display:none' ,noresize:true});
		console.debug("[beneficiary_advice_templates] inside : _getLayout, var layout = " , layout);
		console.debug("[beneficiary_advice_templates] End : _getLayout");
		return layout;
	}
	
	function _validateDialog(){
		// summary: Validates the Dialog for mandatory fields
		
		console.debug("[beneficiary_advice_templates] Start : _validateDialog");
		var templateId = dj.byId("bene_adv_table_format").get("value");
		var templateJson = m._config.bene_advice.beneAdvTemplates[templateId];
		var arrayOfMandatoryFields = [];
		if(templateJson)
		{
			dojo.forEach(templateJson.table, function(node, index){
				if(node.column_type !== '01' && node.column_type !== '02')
				{
					arrayOfMandatoryFields.push((node.column_label).replace(/\s/g,''));
				}
				else
				{
					arrayOfMandatoryFields.push((node.column_label).replace(/\s/g,'')+"_cur_code");
					arrayOfMandatoryFields.push((node.column_label).replace(/\s/g,'')+"_amt");
				}
			});
			
			dj.byId("beneAdvDialogOkButton").set("disabled", true);
			var valid = false,
				field, value;
			
			valid = d.every(arrayOfMandatoryFields, function(id){
				field = dj.byId(id);
				if(field){
					value = field.get("value");
					if(!value || field.state === "Error"){
						if(value == null || isNaN(value) || (typeof(value) == 'string' && value.replace(/\s/g,"") === ""))
						{
							m.showTooltip(m.getLocalization("mandatoryFieldsError"),
									field.domNode, ["above","before"]);
							field.state = "Error";
							field._setStateClass();
							dj.setWaiState(field.focusNode, "invalid", "true");
							return false;
						}
						else if(!isNaN(value) && value < 0)
						{
							m.showTooltip(m.getLocalization("mandatoryFieldsError"),
									field.domNode, ["above","before"]);
							field.state = "Error";
							field._setStateClass();
							dj.setWaiState(field.focusNode, "invalid", "true");
							return false;
						}
					}
				}
				return true;
			});
			
			dj.byId("beneAdvDialogOkButton").set("disabled",false);
			if(!valid)
			{
				d.forEach(arrayOfMandatoryFields, function(id){
					field = dj.byId(id);
					if(field){
						value = field.get("value");
						if(!value || field.state === "Error"){
							if(value == null || isNaN(value) || (typeof(value) == 'string' && value.replace(/\s/g,"") === ""))
							{
								field.state = "Error";
								field._setStateClass();
								dj.setWaiState(field.focusNode, "invalid", "true");
							}
							else if(!isNaN(value) && value < 0)
							{
								field.state = "Error";
								field._setStateClass();
								dj.setWaiState(field.focusNode, "invalid", "true");
							}
						}
					}
				});
				return false;
			} 
			else 
			{
				dj.byId("beneAdvTable-dialog-template").gridMultipleItemsWidget.updateData();
				dj.byId("beneAdvTable").dialog.hide();
				return true;
			}
		}
		else
		{
			console.error(m.getLocalization("technicalErrorWhileConfiguringBeneficiaryAdvices"));
			m.animate("fadeOut","beneficiaryAdvicesTransactionContainer");
			dj.byId("bene_adv_flag").set("checked",false);
			return false;
		}
	}
	
	d.mixin(m,{
		buildTemplateSelection : function()
		{
			/*
			 * Build the Table Format Selection based on bank and entity
			 */
			console.debug("[beneficiary_advice_templates] Start : buildTemplateSelection");
			var bankWidget = dj.byId(m._config.bene_advice.beneAdvBankAbbvNameWidgetId);
			var entityWidget = dj.byId(m._config.bene_advice.beneAdvEntityWidgetId);
			if(bankWidget && entityWidget)
			{
				if( bankWidget.get("value") === "" || entityWidget.get("value") === "")
				{
					var callBackBank = function(){
						dj.byId("bene_adv_flag").set("checked",false);
						bankWidget.set("state","error");
					};
					var callBackEntity = function(){
						dj.byId("bene_adv_flag").set("checked",false);
						entityWidget.set("state","error");
					};
					if(bankWidget.get("value") === "")
					{
						m.dialog.show("ERROR",m.getLocalization("selectBankToProceed"),'',callBackBank);
						
					}
					else
					{
						m.dialog.show("ERROR",m.getLocalization("selectEntityToProceed"),'',callBackEntity);
					}
				}
				else
				{
					if(dj.byId("bene_adv_table_format"))
					{
						var storeItems = m._config.bene_advice.beneAdvBankEntityTemplates[bankWidget.get("value")][entityWidget.get("value")];
						if(!storeItems[0])
						{
							m.animate("fadeOut","beneAdvTemplateDiv");
						}
						else
						{
							m._config.templateSelectionBuilt = true;
							dj.byId("bene_adv_table_format").set("value","");
							dj.byId("bene_adv_table_format").store = new dojo.data.ItemFileReadStore({
								 data :{
										identifier : "value",
										label : "name",
										items : storeItems
									}
						    });
							
						}
					}
				}
			}
			else
			{
				console.error(m.getLocalization("technicalErrorWhileConfiguringBeneficiaryAdvices"));
				m.animate("fadeOut","beneficiaryAdvicesTransactionContainer");
				dj.byId("bene_adv_flag").set("checked",false);
			}
			
			console.debug("[beneficiary_advice_templates] End : buildTemplateSelection");
		},
		buildGridMultipleItem : function(/*String*/mode)
		{
			/*
			 * Builds the Grid Multiple Item 
			 */
			console.debug("[beneficiary_advice_templates] Start : buildGridMultipleItem");
			var templateJson;
			var templateDescription;
			if(!mode)
			{
				mode = "edit";
			}
			//If edit mode then select the json format from the templates from parameter tables
			if(mode === "edit")
			{
				var templateId = dj.byId("bene_adv_table_format").get("value");
				templateJson = m._config.bene_advice.beneAdvTemplates[templateId];
				templateDescription = m._config.bene_advice.beneAdvTemplatesDescription[templateId];
			}
			//else get the json stored in the transaction
			else
			{
				templateJson = m._config.bene_advice.beneAdvTableFormatJson;
			}
			
			var gridColumnsArray = [];
			var headersArray = [];
			var resultString = new String("<div>");
			
			d.style("beneAdvTableDivContainer","display","none");
			
			//Destroy all previous widgets and containers
			var widgets = dj.findWidgets(dojo.byId("beneAdvTable-dialog-template-content"));
			dojo.forEach(widgets, function(w) {
			    w.destroyRecursive(false);
			});
			
			//Destroy all the Children
			dojo.empty("beneAdvTable-dialog-template-content");
			if(templateJson)
			{
				var arrayOfAmountFieldsWithDecimal = [];
				var arrayOfAmountFieldsWithOutDecimal = [];
				
				//Store all the Cloumn Labels and special case to handle amount with decimal and without decimal
				dojo.forEach(templateJson.table, function(node, index){
					headersArray.push(node.column_label);
					gridColumnsArray.push((node.column_label).replace(/\s/g,''));
					
					//Dynamically create the Dialog
					resultString = resultString.concat(_createDialogField(node));
					
					//Amount Field with Decimal
					if(node.column_type === "01")
					{
						arrayOfAmountFieldsWithDecimal.push(node);
					}
					//Amount Field without Decimal
					else if(node.column_type === "02")
					{
						arrayOfAmountFieldsWithOutDecimal.push(node);
					}
				});
				
				console.debug("[beneficiary_advice_templates] Inside : buildGridMultipleItem , Dialog Creation: " + resultString );
				
				if(resultString !== "")
				{
					resultString.concat("</div>");
					dojo.place(resultString,"beneAdvTable-dialog-template-content");
				}
				//Parse
				dojo.parser.parse("beneAdvTable-dialog-template-content");
				
				//For Amount Fields Validations have to be set
				dojo.forEach(arrayOfAmountFieldsWithDecimal,function(node,index){
					var columnCurCode = ""+(node.column_label).replace(/\s/g,'')+"_cur_code";
					var columnAmt = ""+(node.column_label).replace(/\s/g,'')+"_amt";
					m.setValidation(columnCurCode, m.validateCurrency);
					m.connect(columnCurCode,"onChange",function(){
						_setCurrencyWithDecimal(node);
					});
				});
				
				//For Amount Fields Validations have to be set
				dojo.forEach(arrayOfAmountFieldsWithOutDecimal,function(node,index){
					var columnCurCode = ""+(node.column_label).replace(/\s/g,'')+"_cur_code";
					var columnAmt = ""+(node.column_label).replace(/\s/g,'')+"_amt";
					m.setValidation(columnCurCode, m.validateCurrency);
					m.connect(columnCurCode,"onChange",function(){
						_setCurrencyWithOutDecimal(node);
					});
				});
				
				//Initialise the Grid Multiple Item
				_initialiseGridMultipleItem(templateJson,gridColumnsArray,headersArray,mode,templateDescription);
				
				//If same widget with id present the Destroy it
				if(dj.byId('beneAdvTable'))
				{
					dj.byId('beneAdvTable').destroyRecursive();
				}
				
				//Create the Grid 
				var gridStr = "<div dojoType='misys.system.widget.BeneficiaryAdvicesGrid' gridId='bene-adv-table-grid' id='beneAdvTable' class'dojoxGrid'></div>";
				dojo.place(gridStr,"beneAdvTableDivContainer","last");
				dojo.parser.parse("beneAdvTableDivContainer");
				m.animate("wipeIn","beneAdvTableDivContainer");
				
				//Set Resizing of grid when window resized
				m.connect(window, "onresize", m.resizeGrids);
			}
			else
			{
				if(dj.byId('beneAdvTable'))
				{
					dj.byId('beneAdvTable').destroyRecursive();
				}
			}
			
			console.debug("[beneficiary_advice_templates] End : buildGridMultipleItem");
		},
		updateGridDataFromDialog : function(){
			
			console.debug("[beneficiary_advice_templates] Start : updateGridDataFromDialog");
			//Check for mandatory fields
			_validateDialog();
			
			console.debug("[beneficiary_advice_templates] End : updateGridDataFromDialog");
		}
	});
})( dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.core.beneficiary_advice_templates_client');