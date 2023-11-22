dojo.provide("misys.grid.GridMultipleItems");
dojo.experimental("misys.grid.GridMultipleItems"); 

dojo.require("dijit._Templated");
dojo.require("dijit._Widget");
dojo.require("dijit._Container");
dojo.require("dojo.number");
dojo.require("dojo.data.ItemFileWriteStore");
dojo.require("dojox.uuid.generateRandomUuid");
dojo.require("dojox.html.entities");
dojo.require("misys.grid.DataGrid");

// our declared class
dojo.declare("misys.grid.GridMultipleItems",
	[ dijit._Widget, dijit._Templated, dijit._Container ],
	// class properties:
	{
		overrideDisplaymode : 'edit',
		widgetsInTemplate: true,
		store: null,
		gridId: '',
		handle: [],
		name: '',
		grid: null,
		dialogId: '',
		dialog: null,
		dialogClassName: null,
		dialogAddItemTitle: '',
		dialogUpdateItemTitle: '',
		dialogViewItemTitle: '',
		requiredField: [],
		xmlTagName: '',
		xmlSubTagName: '',
		noItemLabel: 'null',
		addButtonLabel: 'null',
		openDialogFromExistingItemInitFunction: null,
		data: {},
		propertiesMap: {},
		typeMap: {},
		gridColumns: [],
		layout: [],
		headers: [],
		dataList: [],
		_itemFields: null,
		showMoveOptions : false,
		mandatoryFields: [],
		
		// GridMultipleItems are now silently validated - fields are not highlighted and the
		// user is not blocked from saving. The validation result is stored here and, on form
		// submission, we highlight the grid row in error.
		// note: We use a Y string instead of a boolean, to match the way it is done in the database
		is_valid : "Y",
		state: "",

		getMandatoryProperties: function(item){
			return (this.mandatoryFields ? this.mandatoryFields : []);
		},

		buildRendering: function()
		{
			console.debug("[GridMultipleItems (" + this.declaredClass + ", " + this.id + ")] buildRendering start");
			if(!this.templateString){
				if (this.attachmentGroup && this.attachmentGroup != '')
				{
					this.templateString = dojo.byId('file-attachment-template'+ this.attachmentGroup).innerHTML;
				}
				else if (dojo.byId('file-attachment-template'))
				{
					this.templateString = dojo.byId('file-attachment-template').innerHTML;
				}
			}
			this.inherited(arguments);		
			console.debug("[GridMultipleItems (" + this.declaredClass + ", " + this.id + ")] buildRendering end");
		},
		startup: function(){
			if(this.isWidgetToBeDestroyed(this.id)){ 
				return; 
			}
			if(this._started){ 
				return;
			}
			
			console.debug("[GridMultipleItems (" + this.declaredClass + ", " + this.id + ")] startup start");
			
			// Object with empty names are ignored in forms xml generation.
			this.name = this.id;
			
			// TODO: This is done because GridMultipleItems#createJsonItem does not
			// output the content of the very first level but only of its children
			// To be reviewed!!!
			if(this.dataList.length === 0)
			{
				this.dataList = this.createJsonItem();
			}
			else
			{
				dojo.forEach(this.dataList, function(item){
					var areAllMandatoryFieldsFilled = this.checkMandatoryProperties(item);
					item['is_valid'] = areAllMandatoryFieldsFilled ? "Y" : "N";
				}, this);
			}
			
			this.inherited(arguments);
			
			// Update layout headers
			for(var i=0, len = this.headers.length; i < len; i++) {
				this.layout[i].name = this.headers[i];
			}
			
			// Possibly update labels
			if (this.noItemLabel !== 'null' && this.noItemLabelNode)
			{
				this.noItemLabelNode.innerHTML = this.noItemLabel;
			}
			if (this.overrideDisplaymode === 'view' || this.overrideDisplaymode === 'editonly')
			{
				//this.addButtonNode might be null so test			
				if (this.addButtonNode)
				{
					this.addButtonNode.set('style', 'display:none');
				}
			}
			else 
			{
				if (this.addButtonLabel !== 'null' && this.addButtonNode)
				{
					this.addButtonNode.set('label', this.addButtonLabel);
				}
			}
			// Add store_id to grid columns list
			this.gridColumns.push('store_id');
			this.gridColumns.push('is_valid');
	
			//we instanciate the grid in all case at startup.this fix bug with updatedata without timeout
			if(this.dataList.length > 0)
			{
				// Create data store
				this.createDataStoreFromDataList();
				
				// Create data grid
				this.createDataGrid();
			}
			
			this.renderSections();
			
			this.destroyWidgets();
			
			this.collectRequiredField();
			
			this.setDialogFieldUnrequired();
			
			misys.connect(this.dialog, "onHide", this, "setDialogFieldUnrequired");
			misys.connect(this.dialog, "onShow", this, "setDialogFieldRequired");
			
			// Add the displaymode as a class
			dojo.addClass(this.dialog.domNode, "gridMultipleItems_" + this.overrideDisplaymode);
			console.debug("[GridMultipleItems (" + this.declaredClass + ", " + this.id + ")] startup end");
		},
		
		createDataStoreFromDataList: function()
		{
			console.debug("[GridMultipleItems] createDataStoreFromDataList start");
			this.data.items = this.buildStoreItem(this.dataList);
			this.store = new dojo.data.ItemFileWriteStore({ data: this.data,  typeMap: this.typeMap});
			console.debug("[GridMultipleItems] createDataStoreFromDataList end");
		},
		
		createAmendDataStoreFromText: function(dataItem)
		{
			console.debug("[GridMultipleItems] createDataStoreFromDataList start");
			if(misys._config.editedItemIndex != -1 && misys._config.editedItemIndex != undefined && this.data.items.length != 0){
				var dataItemsClonedArray = this.data.items;
				var dataItemsUpdatedArray = [];
				var counter = 0;
				for(var itr = 0; itr < this.data.items.length+1; itr++){
					if(itr === misys._config.editedItemIndex){
						dataItemsUpdatedArray.push(dojo.mixin({ store_id: dojox.uuid.generateRandomUuid() },dataItem));
					}
					else{
						dataItemsUpdatedArray.push(dojo.mixin({ store_id: dojox.uuid.generateRandomUuid() },dataItemsClonedArray[counter++]));
					}
				}
				this.data.items = dataItemsUpdatedArray;
			}
			else{
				this.data.items.push(dojo.mixin({ store_id: dojox.uuid.generateRandomUuid() }, dataItem));
			}
			this.store = new dojo.data.ItemFileWriteStore({ data: this.data,  typeMap: this.typeMap});
			misys._config.editedItemIndex = -1;
			console.debug("[GridMultipleItems] createDataStoreFromDataList end");
		},
		
		buildStoreItem: function(data)
		{
			var items = [];
			for(var i=0, rows=this.dataList.length; i<rows; i++)
			{
				var dataItem = data[i];
				for(var property in dataItem)
				{
					if(dojo.isArray(dataItem[property]))
					{
						dataItem[property] = this.buildStoreItem(dataItem[property]);
					}
				}
				items.push(dojo.mixin({ store_id: dojox.uuid.generateRandomUuid() }, dataItem));
			}
			return items;
		},

		updateGridFromDataList: function()
		{
			console.debug("[GridMultipleItems] updateGridFromDataList start");

			for(var i = 0, rows = this.dataList.length; i<rows; i++)
			{
				var item = this.dataList[i%l];
				if (!item.store_id)
				{
					item = dojo.mixin({ store_id: dojox.uuid.generateRandomUuid() }, item);
				}

				// TODO: check why this function is called twice when the user clicks on edit in the grid
				// Check if the item already exists in the store
				this.grid.store.fetch({
						query: {store_id: item.store_id},
						onComplete: dojo.hitch(this, function(items, request){
							if (items.length <= 0)
							{
								this.grid.store.newItem(item);
							}
						})
				});
			}
			
			this.grid.store.save();
			this.renderAll();
			console.debug("[GridMultipleItems] updateGridFromDataList end"); 
		},
		
		onGridCreate: function() {
		},
		
		createDataGrid: function()
		{
			var gridId = this.gridId;
			if(!gridId)
			{
				gridId = 'grid-' + 
							(this.xmlTagName ? this.xmlTagName + '-' : '') + 
							dojox.uuid.generateRandomUuid();
			}
			this.grid = new misys.grid.DataGrid({
				jsId: gridId,
				id: gridId,
				store: this.store,
				structure: this.layout,
				autoHeight: true,
				selectionMode: 'multiple',
				columnReordering: true,
				autoWidth: true,
				rowsPerpage: 1000,
				initialWidth: '100%',
				canSort: function(){
					return true;
				},
			 	showMoveOptions:  this.showMoveOptions
			}, document.createElement("div"));
			this.grid.gridMultipleItemsWidget = this;
			
			misys.connect(this.grid, "onStyleRow" , dojo.hitch(this, function(row) {
				var item = this.grid.getItem(row.index);
       
				/*if (!this.checkMandatoryFields(item))
				{
					row.customStyles += "background-color: #F9F7BA !important";
				}*/

				if (item && item.hasOwnProperty("is_valid")) {
                	var isValid = dojo.isArray(item.is_valid) ? item.is_valid[0] : item.is_valid;
                	
                	if(isValid && isValid !== "Y") {
                		// We have to use an inline style, otherwise the row colour 
                		// changes onMouseOver
                		row.customStyles += "background-color: #F9F7BA !important";
                		this.state = "Error";
                	}
                }

                 this.grid.focus.styleRow(row);
                 this.grid.edit.styleRow(row);
            }));
			
			this.addChild(this.grid);
			this.onGridCreate();
		},
		
		/*checkMandatoryFields: function(item)
		{
			var areMandatoryFieldsMissing = dojo.some(this.mandatoryFields, function(mandatoryField){
				var itemValue = item[mandatoryField];
				itemValue = dojo.isArray(itemValue) ? itemValue[0] : itemValue;
				return (itemValue == null || itemValue == '');
			});
			return !areMandatoryFieldsMissing;
		},*/

		renderSections: function()
		{
			try
			{
				if (this.itemsNode)
				{
					var displayGrid = (this.grid && this.grid.rowCount > 0);
					dojo.attr(this.itemsNode, 'style', { display: (displayGrid ? 'block' : 'none') } );
					if(document.getElementById('reporting_popup') )
					{
						dojo.attr(this.itemsNode, 'style', { width : '100%'} );
					}
							
				}
				if (this.noItemLabelNode)
				{
					var displayNoItemLabel = (this.grid && this.grid.rowCount === 0) || (! this.grid);
					dojo.attr(this.noItemLabelNode, 'style', { display: (displayNoItemLabel ? 'block' : 'none') } );
				}
			}
			catch(err)
			{
				console.debug("Error: " + err);
			}
		},
		
		openDialogFromExistingItem: function(items, request)
		{
			console.debug("[GridMultipleItems] openDialogFromExistingItem start");
			
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
				var searchedWidgetId = (this.propertiesMap[property] && this.propertiesMap[property]._fieldName ? this.propertiesMap[property]._fieldName : property);
				if(property !== "store_id")
				{					
					dojo.some(widgets, function(widget){
						if(widget.id === searchedWidgetId || widget.name === searchedWidgetId)
						{
							var value = item[property];
							value = dojo.isArray(value) ? value[0] : value;
							
							if (this.overrideDisplaymode === "view") {
								// Being extra safe here in case of strange widget issues
								var displayStyle = (!value && value !== 0) ? "none" : "block";
								if(widget && widget.id && dojo.byId(widget.id + "_row")) {
									dojo.style(widget.id + "_row", "display", displayStyle);
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
		    							widget.set('checked', value === 'Y' ? true : false);
		    							break;
		    						case 'dijit.form.RadioButton':
		    							var radioDomNodes = dojo.query("[name='" + widget.name + "']", this.dialog.domNode);
		    							dojo.some(radioDomNodes, function(radioDomNode){
		    								var radioWidget = dijit.byNode(radioDomNode.parentNode);
		    								if (radioWidget.params.value === value)
		    								{
		    									radioWidget.set('checked', true);
		    									return true;
		    								}
		    							});
		    							break;
		    						case 'dijit.form.NumberTextBox':
		    							if (value != null && value !== '' && value !== 'NaN')
		    							{
		    								widget.set('value', value, false);
		    							}
		    							break;
		    							
		    						case 'misys.form.MultiSelect':
		    							widget.domNode.innerHTML = [];
		    							
		    							if(value !== "")
	    								{
		    								var arr = value.split(",");
		    								for(i=0;i<arr.length;i++)
	    									{
		    									var op = dojo.create("option");
		    									op.innerHTML =  arr[i];
		    									op.value = arr[i];
		    									widget.domNode.appendChild(op);
	    									}
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
			
			if(item && item.product_name && item.product_name[0])
			{
				item.product_name[0] = dojox.html.entities.encode(item.product_name[0], dojox.html.entities.html);
			}
			if(item && item.cust_ref_id && item.cust_ref_id[0])
			{
				item.cust_ref_id[0] = dojox.html.entities.encode(item.cust_ref_id[0], dojox.html.entities.html);
			}
			if(item && item.other_type && item.other_type[0])
			{
				item.other_type[0] = dojox.html.entities.encode(item.other_type[0], dojox.html.entities.html);
			}
			// Execute init function if required
			if (this.openDialogFromExistingItemInitFunction != null)
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

			console.debug("[GridMultipleItems] openDialogFromExistingItem end");
		},	
		editGridData: function(items, request){
			console.debug("editPopup started");
			var decodedValue = dojox.html.entities.decode(items[0].content[0], dojox.html.entities.html);
			var callBack = function(){
				var i = 0;
				dijit.byId("narrative_description_goods_popup").set("disabled",false);
				if(misys._config.codeword_enabled == true){
					if(items[0].verb[0] == "REPALL"){
						dijit.byId("adr_3").set("disabled",false);
						dijit.byId("adr_3").set("value","REPALL");
						dijit.byId("adr_1").set("disabled",false);
						dijit.byId("adr_2").set("disabled",false);
						dijit.byId("narrative_description_goods_popup").set("value","/REPALL/"+decodedValue);
					}
		
					if(items[0].verb[0] == "DELETE"){
						dijit.byId("adr_2").set("disabled",false);
						dijit.byId("adr_2").set("value","DELETE");
						dijit.byId("adr_3").set("disabled",true);
						dijit.byId("narrative_description_goods_popup").set("value","/DELETE/"+decodedValue);
					}
		
					if(items[0].verb[0] == "ADD"){
						dijit.byId("adr_1").set("disabled",false);
						dijit.byId("adr_1").set("value","ADD");
						dijit.byId("adr_3").set("disabled",true);
						dijit.byId("narrative_description_goods_popup").set("value","/ADD/"+decodedValue);
					}
				}else{
					dijit.byId("narrative_description_goods_popup").set("value", decodedValue);
				}
				dijit.byId("amendments").grid.store.deleteItem(items[0]);
			};
			misys.dialog.show("CONFIRMATION",misys.getLocalization("confirmEditGridRecord"),'',callBack);
		},
		
		activateDialog: function(){
			console.debug("[GridMultipleItems] activateDialog start");
			misys.dialog.isActive = true;
		},

		cloneArray : function (arr) {
			var arr1 = []; 
			for (var property in arr) {
				arr1[property] = arr[property];
			}
			return arr1;
		},

		checkDialog: function()
		{
			console.debug("[GridMultipleItems] checkDialog start");
			if(!this.dialog)
			{
				var dialogWidget = dijit.byId(this.dialogId); 
				if(dialogWidget)
				{
					this.dialog = dialogWidget; 
				}
				else
				{
					var id = this.dialogId ? this.dialogId : 'dialog-' +
							(xmlTag ? xmlTag + '-' : '') + dojox.uuid.generateRandomUuid();
					var dojoClass = this.dialogClassName ? this.dialogClassName : 'misys.widget.Dialog';
		    		this.dialog = dojo.eval("new " + dojoClass + "({}, dojo.byId('" + id + "'))");
		    		this.dialog.set("refocus", false);
		    		this.dialog.set("draggable", false);
		    		dojo.addClass(this.dialog.domNode, "multipleItemDialog");
		    		this.dialog.startup();
		    		document.body.appendChild(this.dialog.domNode);
				}
			}
			console.debug("[GridMultipleItems] checkDialog end");
			
			return this.dialog;
		},
		
		dialogExecute: function(formContents)
		{
			// summary: 
			// 		This is the function called when the OK button is pressed in the dialog
			// 		Override if necessary.
			console.debug("[GridMultipleItems] execute start 200ms");
			
			// We need to wait because the grid is not immediatly updated
			setTimeout(dojo.hitch(this.gridMultipleItemsWidget, "updateData"), 500);
			console.debug("[GridMultipleItems] execute end");
		},
		
		performValidation: function()
		{
			console.debug("[GridMultipleItems] validate start");
			if (this.validateDialog()){
				this.dialog._onSubmit();
			}
			console.debug("[GridMultipleItems] validate end");
		},
		
		addItem: function(event)
		{
			console.debug("[GridMultipleItems] addItem start");
			
			// Disable dialog events
			misys.dialog.isActive = false;
		
			// Check Dialog widget
			this.checkDialog();
		
			// Set dialog title
			this.dialog.set('title', this.dialogAddItemTitle);
		
			// Reset dialog fields
			this.resetDialog();

			var widgets = this.dialog.getChildren();
			dojo.some(widgets, function(widget){
				if (widget.grid)
				{
					widget.renderSections();
				}
			});
			// Attach current widget to dialog widget
			this.dialog.gridMultipleItemsWidget = this;
			
			this.dialog.execute = this.dialogExecute;
			
			// Show dialog
			this.dialog.show();
			
			if(this._itemFields && this._itemFields['product_name'])
			{
				this._itemFields['product_name'] = dojox.html.entities.encode(this._itemFields['product_name'], dojox.html.entities.html);
			}
			
			if(this._itemFields && this._itemFields['cust_ref_id'])
			{
				this._itemFields['cust_ref_id'] = dojox.html.entities.encode(this._itemFields['cust_ref_id'], dojox.html.entities.html);
			}
			
			if(this._itemFields && this._itemFields['other_type'])
			{
				this._itemFields['other_type'] = dojox.html.entities.encode(this._itemFields['other_type'], dojox.html.entities.html);
			}
			
			if(dojo.byId("pooling_enabled_row"))
			{
				console.log(dojo.byId("pooling_enabled_row"));
				dojo.style(dojo.byId("pooling_enabled_row"), 'display', 'none');
			}
			if(dojo.byId("sweeping_enabled_row"))
			{
				dojo.style(dojo.byId("sweeping_enabled_row"), 'display', 'none');
			}
			if(dojo.byId("charge_account_for_liq_row"))
			{
				dojo.style(dojo.byId("charge_account_for_liq_row"), 'display', 'none');
			}
			
			// Activate dialog events
			setTimeout(dojo.hitch(this, "activateDialog"), 500);
		
			console.debug("[GridMultipleItems] addItem end");
		},
		
		setDialogFieldRequired: function(){
			misys.toggleFields(true, null, this.requiredField, true, true);
		},
		
		setDialogFieldUnrequired: function(){
			misys.toggleFields(false, null, this.requiredField, true, true);
		},
		
		resetDialog: function()
		{
			var widgets = this.dialog.getChildren();
			dojo.forEach(widgets, function(widget){
				var declaredClass = widget.declaredClass;
				switch(declaredClass)
				{
					case 'dijit.form.RadioButton':
						widget.set('checked', false);
						break;
					case 'dijit.form.CheckBox':
						widget.set('checked', false);
						break;
					case 'dijit.form.DateTextBox':
						widget.set('value', null);
						break;
					default:
						// for hidden fields, do not reset the value
						if (widget.get('type') === 'hidden'){
							break;
						}
						widget.set('value', '');
						widget.state = '';
						if(widget._setStateClass){
							widget._setStateClass();
						}
						break;
				}
				//remove blurred of validation
				widget._hasBeenBlurred= false;
				// Clear also all grids
				if (widget.grid && widget.grid.declaredClass === 'misys.grid.DataGrid')
				{
					widget.clear();
				}
			});
			if(this.dialog.gridMultipleItemsWidget)
			{
				this.dialog.gridMultipleItemsWidget = null;
			}
			if(this.dialog.storeId)
			{
				this.dialog.storeId = null;
			}
			
			for(elm in this.handle){
				dojo.disconnect(this.handle[elm]);
			}
			this.handle = [];
		},
		
		_retrieveItemFields: function()
		{
			console.debug("[GridMultipleItems] _retrieveItemFields start");
			
			var widgets = this.dialog.getChildren();
			var itemFields = {};
		
			// First, look for the widget's properties
			for(var i = 0, len = this.gridColumns.length; i < len; i++)
			{
				var property = this.gridColumns[i];
				var searchedWidgetId = (this.propertiesMap[property] && this.propertiesMap[property]._fieldName ? this.propertiesMap[property]._fieldName : property);
				console.debug("[GridMultipleItems] _retrieveItemFields - Property: " + property + ", Widget id: " + searchedWidgetId);
				itemFields = this._retrieveWidgetsValues(widgets, property, searchedWidgetId, itemFields);
			}
			
			console.debug("[GridMultipleItems] _retrieveItemFields end");
			return itemFields;
		},
		
		_retrieveWidgetsValues: function(widgets, property, searchedWidgetId, itemFields)
		{
			dojo.some(widgets, function(widget){
				if(widget.id === searchedWidgetId || widget.name === searchedWidgetId)
				{
					var value = '';
					var declaredClass = widget.declaredClass;
					
					if (widget.isInstanceOf(misys.grid.GridMultipleItems))
					{
						// For GridMultipleItem widgets, the store contains the JSON data for this widget
						value = this._extractJSON(widget);
						if (value._values.is_valid && value._values.is_valid === "N")
						{
							itemFields.is_valid = "N";
						}
					}
					else
					{
						switch(declaredClass)
						{
							case 'dijit.form.DateTextBox':
								value = widget.get('displayedValue');
								break;
							case 'dijit.form.CheckBox':
								value = widget.get('checked') === true ? 'Y' : 'N';
								break;
							case 'dijit.form.RadioButton':
								var radioDomNodes = dojo.query("[name='" + widget.name + "']", this.dialog.domNode);
								dojo.some(radioDomNodes, function(radioDomNode){
									var radioWidget = dijit.byNode(radioDomNode.parentNode);
									var checked = radioWidget.get('checked'); 
									if (checked)
									{
										value = radioWidget.params.value;
										return true;
									}
								});
								break;
							case 'dijit.form.NumberTextBox':
								console.debug("[GridMultipleItems] _retrieveWidgetsValues NumberTextBox :" + widget.get('value'));
								value = isNaN(widget.get('value'))?"":widget.get('value');
								break;
							case 'misys.form.PercentNumberTextBox':
								console.debug("[GridMultipleItems] _retrieveWidgetsValues PercentNumberTextBox :" + widget.get('value'));
								value = isNaN(widget.get('value'))?"":widget.get('value');
								break;
							case 'misys.form.SpreadTextBox':
								console.debug("[GridMultipleItems] _retrieveWidgetsValues SpreadTextBox :" + widget.get('value'));
								value = isNaN(widget.get('value'))?"":widget.get('value');
								break;
							case 'misys.form.CurrencyTextBox':
								console.debug("[GridMultipleItems] _retrieveWidgetsValues CurrencyTextBox :" + widget.get('value'));
								value = widget.get('displayedValue');
								break;
							default:
								value = widget.get('value');
								value += '';
								break;
						}
					}
					
					if(value == null)
					{
						value = '';
					}
					itemFields[property] = value;
					console.debug("[GridMultipleItems] _retrieveItemFields - Property: " + property + ", Widget id: " + searchedWidgetId + ", Value: " + value);
					return true;
				}
				else if (widget.declaredClass === 'dijit.form.Form')
				{
					var widgets = widget.getChildren();
					itemFields = this._retrieveWidgetsValues(widgets, property, searchedWidgetId, itemFields);
				}
				return false;
			}, this);
			return itemFields;
		},
		
		_extractJSON: function(widget)
		{
			var type = widget.declaredClass;
			var json = { _type: type, _values: [] };
			if (widget && widget.grid && widget.grid.store)
			{
				widget.store.fetch({query: {store_id: '*'}, onComplete: function(items, request){
	    			dojo.forEach(items, function(item){
	    				json._values.push(widget._cloneSingleItem(item));
	    			});
	    		}});
			}
			return json;
		},
		
		_retrieveGridData: function(widgets, itemFields)
		{
			dojo.forEach(widgets, function(widget){
				var declaredClass = widget.declaredClass;
				if(widget.grid)
				{
					var widgetValues = [];
					widget.store.fetch({query: {store_id: '*'}, onComplete: dojo.hitch(this, function(items, request){
		    			dojo.forEach(items, function(item){
		    				var tempItem = widget._cloneSingleItem(item);
		    				widgetValues.push(tempItem);
		    			});
		    		})});
					itemFields[declaredClass] = widgetValues;
				}
				else if (widget.declaredClass === 'dijit.form.Form')
				{
					var widgets = widget.getChildren();
					itemFields = this._retrieveGridData(widgets, itemFields);
				}
			}, this);
			return itemFields;
		},
		
		// Clone an item but without copying internal datastore properties
		_cloneMultipleItems: function(items){
			var cloneItems = [];
			dojo.forEach(items, function(item){
				var isArray = dojo.isArray(item);
				item = dojo.isArray(item) ? item[0] : item;
				var cloneItem = {};
				for (var property in item)
				{
					if(dojo.some(this.gridColumns, function(gridColumn){
						return gridColumn == property;
					}))
					{
						if (property.match('^misys.openaccount.widget.')=='misys.openaccount.widget.')
						{
							var tempWidget = dojo.eval('new ' + property + '()');
							var tempItem = tempWidget._cloneItem(item[property]);
							cloneItem[property] = tempItem;
						}
						else
						{
							if(property.match('^_') !== '_')
							{
								cloneItem[property] = dojo.isArray(item[property]) ? item[property][0] : item[property];
							}
						}
					}
				}
				cloneItems.push(cloneItem);
			}, this);
			return cloneItems;
		},
		
		// Clone an item but without copying internal datastore properties
		_cloneSingleItem: function(item){
			var isArray = dojo.isArray(item);
			item = dojo.isArray(item) ? item[0] : item;
			var cloneItem = {};
			for (var property in item)
			{
				if(dojo.some(this.gridColumns, function(gridColumn){
					return gridColumn == property;
				}))
				{
					if(property.match('^_') !== '_')
					{
						cloneItem[property] = dojo.isArray(item[property]) ? item[property][0] : item[property];
					}
				}
			}
			return isArray ? [cloneItem] : cloneItem;
		},
		
		// Clone an item but without copying internal datastore properties and store_id field
		_cloneItemWithoutStoreId: function(item){
			var isArray = dojo.isArray(item);
			item = dojo.isArray(item) ? item[0] : item;
			var cloneItem = {};
			for (var property in item)
			{
				if(dojo.some(this.gridColumns, function(gridColumn){
					return gridColumn == property;
				}))
				{
					if (property.match('^misys.openaccount.widget.')=='misys.openaccount.widget.')
					{
						var tempWidget = dojo.eval('new ' + property + '()');
						var tempItem = tempWidget._cloneItem(item[property]);
						cloneItem[property] = tempItem;
					}
					else if (property !== 'store_id')
					{
						if(property.match('^_') !== '_')
						{
							cloneItem[property] = dojo.isArray(item[property]) ? item[property][0] : item[property];
						}
					}
				}
			}
			return isArray ? [cloneItem] : cloneItem;
		},		
		
		updateData: function()
		{
			console.debug("[GridMultipleItems] updateData start");

			// retrieve item values from the dialog
			var storeId = this.dialog.storeId;
			
			//TODO: try to remove this internal property (used because we don't know how to pass a parameter to store.fetch method
			this._itemFields = this._retrieveItemFields();	
		
			this._itemFields['store_id'] = (storeId != null ? storeId : dojox.uuid.generateRandomUuid());
			if(this._itemFields && this._itemFields['product_name'])
			{
				this._itemFields['product_name'] = dojox.html.entities.encode(this._itemFields['product_name'], dojox.html.entities.html);
			}
			
			if(this._itemFields && this._itemFields['cust_ref_id'])
			{
				this._itemFields['cust_ref_id'] = dojox.html.entities.encode(this._itemFields['cust_ref_id'], dojox.html.entities.html);
			}
			
			if(this._itemFields && this._itemFields['other_type'])
			{
				this._itemFields['other_type'] = dojox.html.entities.encode(this._itemFields['other_type'], dojox.html.entities.html);
			}
			
			// Mark the item as valid or invalid based on:
			//	- the mandatory fields for this item 
			//	- the validity of underlying sub-items
			var areAllMandatoryFieldsFilled = this.checkMandatoryProperties(this._itemFields);
			var areSubItemsValid = this.checkSubItemsValidity();
			this._itemFields['is_valid'] = areAllMandatoryFieldsFilled && areSubItemsValid ? "Y" : "N";
			
			// Hide the label section and show the grid section
			// as it must be displayed in order to instantiate the Dojo DataGrid.
			dojo.attr(this.itemsNode, 'style', { display: 'block' });
			dojo.attr(this.noItemLabelNode, 'style', { display: 'none' });
			
			// Update the grid
			if (this.grid)
			{
				this.grid.store.fetch({
					query: {store_id: storeId}, 
					onComplete: dojo.hitch(this, function(items, request){
						if (items.length > 0)
						{
							var item = items[0];
							for (var property in this._itemFields)
							{
								var value = this._itemFields[property];
								if ((value != null && value != undefined) && property != 'store_id')
								{
									this.grid.store.setValue(item, property, value);
								}
							}
						}
						else
						{
							this.grid.store.newItem(this._itemFields);
						}
					})
				});
		
		        // Unselect all rows
		        var items = this.grid.selection.getSelected();
		        if (items.length) {
		            // Iterate through the list of selected items
		        	// and unselect them
		            dojo.forEach(items, function(selectedItem) {
		                if (selectedItem !== null) {
		                    // Delete the item from the data store:
		                    this.grid.selection.setSelected(selectedItem, false);
		                }
		            }, this);
		        }    	            
			}
			else
			{
				// Create data store
				var data_list = [this._itemFields];
		    	var data = {
		    			identifier: 'store_id',
		    			label: 'store_id',
		    			items: data_list
		    		};
		
				this.store = new dojo.data.ItemFileWriteStore({data: data, typeMap: this.typeMap});
				this.createDataGrid();
				// Very important: DO NOT call this here because it is already called in createDataGrid ==> it will delete an attachment twice !!!
				//this.grid.startup();  //Don't call startup as it has always been called in createDataGrid
			}
			this.grid.store.save();
			this.grid.render();
			console.debug("[GridMultipleItems] updateData end");
		},
		
		createDataStoreFromNewItemCommand: function(newItemCommand)
		{
			console.debug("[GridMultipleItems] create data store from new item command");
			dojo.eval("this.data.items = [{store_id: '0', " + newItemCommand + "}]");
			
			this.store = new dojo.data.ItemFileWriteStore({ data: this.data });
		},
		
		clear: function()
		{
			if(this.grid && this.grid.store)
			{
				this.grid.store.fetch(
						{
							query: {store_id: '*'},
							onComplete: dojo.hitch(this, function(items, request){
								dojo.forEach(items, function(item){
									this.grid.store.deleteItem(item);
								}, this);
							})
						}
				);
				this.grid.store.save();
				
				var that = this;
				setTimeout(function(){
					that.renderSections();
					that.grid.render();	
				}, 200);
			}
		},
		
		renderAll: function()
		{
			this.renderSections();
			if (this.grid)
			{
				this.grid.render();
			}
		},
    	
		createItem: function()
		{
			if(this.hasChildren && this.hasChildren())
			{
				var items = [];
				dojo.forEach(this.getChildren(), function(child){
					if (child.createItem)
					{
						items.push(child.createItem());
					}
				}, this);
				
				var item = {};
				item[this.declaredClass] = items;
				return item;
			}
			return null;
		},

		toXML: function(){
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
			
			return xml.join("");
		},
        
		itemToXML: function(items, xmlSubTagName)
		{
			var xml = [];
			dojo.forEach(items, function(item){
				if(item) {
					if(xmlSubTagName) {
						xml.push("<", xmlSubTagName, ">");
					}
					for(var property in item)
					{
						// Process a sub-grid included in this item
						var value = dojo.isArray(item[property]) ? item[property][0] : item[property];
						if (dojo.isObject(value) && value._type)
						{
							var classname = value._type;
							var clazz = dojo.eval(classname);
							var multipleItems = new clazz({});
							xml.push('<', multipleItems.xmlTagName, '>');
							if(value._values)
							{
								xml.push(this.itemToXML(value._values, multipleItems.xmlSubTagName, xml));
							}
							else if(value._value)
							{
								xml.push(this.itemToXML(value._value, multipleItems.xmlSubTagName, xml));
							}
							xml.push('</', multipleItems.xmlTagName ,'>');
						}
						// Otherwise, process a property of the item 
						else if(property != 'store_id' && property.match('^_') != '_')
						{
							value = dojo.isArray(item[property]) ? item[property][0] : item[property];
							value += '';
							xml.push('<', property, '>', dojox.html.entities.encode(value, dojox.html.entities.html), '</', property, '>');
						}
					}
					if(xmlSubTagName) {
						xml.push('</', xmlSubTagName, '>');
					}
				}
			}, this);
							
			return xml.join("");
		},

		createItemsFromJson: function(jsonMsg)
		{
			var item;
			
			myData = dojo.fromJson(jsonMsg);
			this.dataList = [];
			for(item in myData.items){
				if(myData.items[item].ref_id) {
					this.dataList.push(myData.items[item]);
				}
			}

			if(this.dataList.length > 0)
			{
				// Create data store
				this.createDataStoreFromDataList();
				// Create data grid
				this.createDataGrid();
			}

		},
		
		createJsonItem: function()
		{
			var jsonEntry = [];
			if(this.hasChildren && this.hasChildren())
			{
				dojo.forEach(this.getChildren(), function(child){
					if (child.createJsonItem)
					{
						var mandatoryFields = this.getMandatoryProperties(child);
						var item = child.createJsonItem(this.propertiesMap, mandatoryFields);
						jsonEntry.push(item);
						if (this.get("is_valid") !== "N")
						{
							this.set("is_valid", item.is_valid ? item.is_valid : "Y");
						}
						misys._widgetsToDestroy = misys._widgetsToDestroy || [];
						misys._widgetsToDestroy.push(child.id);
					}
				}, this);
			}
			return jsonEntry;
		},

		isWidgetToBeDestroyed: function(widget)
		{
			var foundWidget = false;
			if (misys._widgetsToDestroy)
			{
				dojo.some(misys._widgetsToDestroy, function(widgetIdToDestroy){
					if (widgetIdToDestroy === widget.id)
					{
						foundWidget = true;
						return false;
					}
				});
			}
			return foundWidget;
		},
		
		destroyWidgets: function()
		{
			if (misys._widgetsToDestroy) {
				dojo.forEach(misys._widgetsToDestroy, function(widgetIdToDestroy){
					if (dijit.byId(widgetIdToDestroy))
					{
						dijit.byId(widgetIdToDestroy).destroyRecursive();
					}
				});
			}
		},
		
		validate: function() {
			if(this.store) {
				var inError = dojo.some(this.store._arrayOfAllItems, function(item) {
					if(item && item.is_valid) {
						return item.is_valid[0] !== "Y";
					}
					return false;
				});
	
				
				return !inError;
			} else if (this.is_valid) {
				return (this.is_valid === "Y");
			}
			
			return true;
		},
		
		validateDialog: function(/*Boolean*/ doRealValidation){
			// summary:
			//		returns if all field in parameter is valid .
			//		1 - it will highlight any sub-widgets that are not
			//			valid
			//		2 - it will call focus() on the first invalid
			//			sub-widget

			// We override this standard function as it currently does not deal with
			// fields that are in closed tabs. Moreover, we add a little smooth
			// scrolling for browsers that can handle it.
			var allValid = true,
				didFocus = false,
				widgets = this.dialog.getChildren();

			if(!doRealValidation) {
				var isDialogValid = dojo.every(widgets, function(w){
					return (w.disabled || !w.validate || w.validate());
		 		});
				this.is_valid = (isDialogValid)? "Y" : "N";
				this.state = (isDialogValid) ? "" : "Error";
				allValid = true;
			} else {
				dojo.some(widgets, function(widget){
				// Need to set this so that "required" widgets get their state set.

				widget._hasBeenBlurred = true;
				var valid = widget.disabled || !widget.validate || widget.validate();
				if(!valid && !didFocus) {
					// Set focus of the first non-valid widget
					
					// If the field is in a tabcontainer, select the correct tab
					if(widget.hasOwnProperty("parentTab")) {
						dijit.byId(widget.get("tabContainer")).selectChild(widget.get("parentTab"));
					}
					
					dojo.window.scrollIntoView(widget.containerNode || widget.domNode);
					
					// Grids cannot be focused
					if(widget.focus) {
						widget.focus();
					}
					didFocus = true;
				}
	 			if (!valid) {
	 				allValid = false;
	 			}
			  });
			}
			
			return allValid;
		},
		
		collectRequiredField: function(){
			this.checkDialog();
			var widgets = this.dialog.getChildren();
			var localRequiredFields=[];
			dojo.some(widgets, function(widget){
				if (widget.required){
					localRequiredFields.push(widget.id);
				}
			});
			this.requiredField=localRequiredFields;
		},

		checkMandatoryProperties: function(item)
		{
			var mandatoryFields = this.getMandatoryProperties(item);
			var areMandatoryFieldsMissing = dojo.some(mandatoryFields, dojo.hitch(this, function(mandatoryField){
				var value = item[mandatoryField];
				if (typeof value !== 'undefined')
				{
					value = dojo.isArray(value) ? value[0] : value;
					return (value == null || value === "");					
				}
			}));
			return !areMandatoryFieldsMissing;
		},
		
		checkSubItemsValidity: function()
		{		
			// Look for sub-item elements and check their validity
			for(var property in this._itemFields)
			{
				var value = this._itemFields[property];
				if (value._type && value._values)
				{
					var isSubItemInvalid = dojo.some(value._values, dojo.hitch(this, function(item){
						if (item.is_valid)
						{
							var isValid = dojo.isArray(value) ? item.is_valid[0] : item.is_valid;
							return (isValid === "N");
						}
						return false;
					}));
					if (isSubItemInvalid)
					{
						return false;
					}
				}
			}
			return true;
		}
	}
);