dojo.provide("misys.product.widget.AttachmentFiles");
dojo.experimental("misys.product.widget.AttachmentFiles"); 
dojo.require("misys.grid.GridMultipleItems");

// our declared class
dojo.declare("misys.product.widget.AttachmentFiles",
        [ misys.grid.GridMultipleItems ],
        // class properties:
        {
		data: { identifier: 'store_id', label: 'store_id', items: [] },
	
        templatePath: null,
        templateString: '',
        dialogId: 'file-attachment-dialog-template',
        xmlTagName: 'attachments',
        xmlSubTagName: 'attachment',
        attachmentGroup: '',
        dialogOKCallback: '',
        showStatusColumn: '',
        
        viewMode: 'edit',
        
        gridColumns: [ 'attachment_id', 'file_type', 'file_title', 'file_name', 'file_status', 'file_access_dttm', 'file_description', 'fileact' ],
        
        propertiesMap: {},
        
        maxFiles : 0,
        
        fileActVisible : false,
        
        addItem: function(event)
		{
        	var that = this;
			var inherit = false;
			if(that.grid && that.grid.store && that.maxFiles !== 0 && misys._config.isCustUser)
			{
				that.grid.store.fetch({ onBegin: function(total){ 
						if(total < that.maxFiles)
						{
							inherit = true;	
						}
						else
						{
							misys.dialog.show("ERROR",misys.getLocalization("maxFileUploadReached"));
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
                dojo.forEach(dijit.byId('sendfiles' + this.attachmentGroup).getChildren(), function(widget){
                if (widget.name != 'attachment-type'){
                        widget.set('value', '');
                        widget.set('state', '');
                }
                else {
                    widget.set('value', dijit.byId('attachment-type').get('_resetValue'));
            }});
            }
        },
        
        layout: [],
        
		dialogExecute: function(formContents)
		{
			// summary: 
			// 		This is the function called when the OK button is pressed in the dialog
			// 		Override if necessary.
			console.debug("[AttachmentFiles] execute start 200ms");
			
			// We need to wait because the grid is not immediatly updated
			setTimeout(dojo.hitch(this.gridMultipleItemsWidget, "updateData"),500);
			var callback = this.gridMultipleItemsWidget.dialogOKCallback;
			console.debug("dialogOKCallback" + callback);
			setTimeout(function(){
				dojo.eval(callback);
			}, 600);
			console.debug("[AttachmentFiles] execute end");
		},
                 
                 
    	startup: function(){
    		if(this._started) { return; }
			console.debug("[AttachmentFiles] startup start");
			var tempGroup = this.attachmentGroup;
			if (this.attachmentGroup !== '')
			{
				this.templateString = dojo.byId('file-attachment-template'+ this.attachmentGroup).innerHTML;
				
				this.dialogId = 'file-attachment'+ this.attachmentGroup +'-dialog-template';
				
				this.xmlTagName = 'attachments-' + this.attachmentGroup;
				
				this.propertiesMap = {
				       	attachment_id: {_fieldName:'attachment_id' + tempGroup },
				       	file_type: {_fieldName:'file_type' + tempGroup },
				       	file_title: {_fieldName:'file_title' + tempGroup },
				       	file_name: {_fieldName:'file_name' + tempGroup },
				       	file_status: {_fieldName:'file_status' + tempGroup },
				       	file_status_decoded: {_fieldName:'file_status_decoded' + tempGroup },
				       	file_access_dttm: {_fieldName:'file_access_dttm' + tempGroup },
				       	file_description: {_fieldName:'file_description' + tempGroup }
						};
			}
			var viewModeTemp = this.viewMode;
			var fileact = {
				    name: 'FileAct',
				    field: 'fileact', 
				    get: function (inRowIndex, inItem){
				       // if this row is selected, then check the checkbox.
				       var isSel = this.grid.selection.isSelected(inRowIndex);
				       if(inItem && inItem.fileact && inItem.fileact[0] === 'Y' && !misys.isFormDirty)
				       {
				    	   isSel = true;
				    	   this.grid.selection.addToSelection(inRowIndex);
				       }
				       var html = '<input type="checkbox"' + (isSel ? ' checked="checked"' : '') + " />";
				       return html;
				    },
				    formatter: misys.grid.formatHTML,
				    width: '5%',
				    noresize:true,
				    styles: 'text-align: center;'
				 };
			
			this.layout = [
			                 { name: 'Picture', field: 'file_name', formatter: function(value){return misys.getFileIcon(value);}, width: '5%',noresize:true },
			                 { name: 'Title', field: 'file_title', width: '35%' ,noresize:true},
			                 { name: 'FileName', field: 'file_name', width: '35%',noresize:true ,  formatter : function(value){return misys.grid.formatSimpleHTML(value);} },
			                 { name: ' ', field: 'attachment_id', formatter: function(value){return misys.formatFileActions(value, tempGroup);}, width: '10%' ,noresize:true},
			                 fileact
			                 ];
			
			if (this.viewMode == 'view')
			{
				// status column is displayed in summary popup for transaction sent via SWIFT
				// This is related with SWIFT MT798 support
				if (this.showStatusColumn == "true"){
					this.layout = [
					                 { name: ' ', field: 'file_name', formatter: function(value){return misys.getFileIcon(value);}, width: '5%',noresize:true },
					                 { name: 'Title', field: 'file_title', width: '30%' ,noresize:true},
					                 { name: 'FileName', field: 'file_name', width: '30%' ,noresize:true, formatter : function(value){return misys.grid.formatSimpleHTML(value);} },
					                 { name: 'Status', field: 'file_status_decoded', width: '5%' ,noresize:true},
					                 { name: ' ', field: 'attachment_id', formatter: function(value){return misys.formatFileViewActions(value, tempGroup);}, width: '10%' ,noresize:true},
					                 { name: 'FileAct', field: 'fileact', width: '5%',noresize:true, styles: 'text-align: center;',
					                   formatter: function(text){
					                	   if(text === 'Y')
					                	   {
					                		   return 'Yes';
					                	   }
					                	   else if(text === 'Z')
					                	   {
					                		   return 'NA';
					                	   }
					                	   else
					                	   {
					                		   return 'No';
					                	   }
					                   }	 
					                 }
					              ];					
				}else{
					this.layout = [
					                 { name: ' ', field: 'file_name', formatter: function(value){return misys.getFileIcon(value);}, width: '5%',noresize:true },
					                 { name: 'Title', field: 'file_title', width: '30%' ,noresize:true},
					                 { name: 'FileName', field: 'file_name', width: '35%' ,noresize:true , formatter : function(value){return misys.grid.formatSimpleHTML(value);}},
					                 { name: ' ', field: 'attachment_id', formatter: function(value){return misys.formatFileViewActions(value, tempGroup);}, width: '10%' ,noresize:true},
					                 { name: 'FileAct', field: 'fileact', width: '5%',noresize:true, styles: 'text-align: center;',
					                   formatter: function(text){
					                	   if(text === 'Y')
					                	   {
					                		   return 'Yes';
					                	   }
					                	   else if(text === 'Z')
					                	   {
					                		   return 'NA';
					                	   }
					                	   else
					                	   {
					                		   return 'No';
					                	   }
					                   }	 
					                 }
					            ];
				}
			}
			
			
			// Prepare data store
			this.dataList = [];
			if(this.hasChildren())
			{
				dojo.forEach(this.getChildren(), function(child){
					var item = { 
							attachment_id: child.get('attachment_id'),
							file_type: child.get('file_type'),
							file_title: child.get('file_title'),
							file_name: child.get('file_name'),
							file_status: child.get('file_status'),
							file_status_decoded: child.get('file_status_decoded'),
							file_access_dttm: child.get('file_access_dttm'),
							file_description: child.get('file_description'),
							fileact : child.get('fileact')};
				    
					this.dataList.push(item);
				}, this);
			}
			
			dojo.parser.parse(this.dialogId);
			
    		this.inherited(arguments);
    		
			console.debug("[AttachmentFiles] startup end");
    	},
    	onGridCreate: function() {
    		var that = this;
    		dojo.connect(that.grid, 'onSelected', function (inRowIndex)
       		{
    			that.grid.updateRow(inRowIndex);
       		});
       		dojo.connect(that.grid, 'onDeselected', function (inRowIndex)
       		{
       			that.grid.updateRow(inRowIndex);
       		});
       		
       	    // Make clicking the check box changed the selection state.
       		dojo.connect(that.grid, 'onCellClick', function (evt)
       		{
       		    var t = evt.target;
       		    if ( t.tagName.toLowerCase() == 'input' && t.type == 'checkbox' )
       		    {
       		    	misys.isFormDirty = true;
       		    	var funcName = t.checked ? "addToSelection" : "deselect";
       		        that.grid.selection[funcName](evt.rowIndex);
       		        
       		    }
       		}); 

       		// And finally, disable the standard behavior of selecting by clicking the row
       		that.grid.selection.clickSelectEvent = function () { };
       		if (this.viewMode === 'edit' && ((typeof deliveryChannelFileAct !== "undefined") && (deliveryChannelFileAct !== false)))
			{
       			that.displayFileAct(true);
			}
       		else if (this.viewMode === 'edit')
			{
       			that.displayFileAct(false);
			}
       		else
       		{
       			if((typeof deliveryChannelFileAct !== "undefined") && (deliveryChannelFileAct) && (this.attachmentGroup !== "summarybank"))
       			{
       				that.displayFileAct(true);
       			}
       			else
       			{
       				that.displayFileAct(false);
       			}
       		}
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
				canSort: function(/*int*/ colIndex){
					var sortable = true;
					if(this.layout.cells){
					var actionColumnIndex = this.layout.cellCount;
					var fileActIndex = this.layout.cellCount;
						this.layout.cells.forEach(function(item, index) {
							if(item.name){
								if (item.name === " ") {
									actionColumnIndex = index + 1;
								}
								if(item.name === "FileAct"){
									fileActIndex = index + 1;
								}
							}
						});
						sortable = (Math.abs(colIndex) !== 1 && Math.abs(colIndex) !== actionColumnIndex && Math.abs(colIndex) !== fileActIndex);
					}
					return sortable;
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
		displayFileAct : function(/*boolean*/ show){
			var that = this;
			if(that.grid.layout)
			{
				dojo.forEach(that.grid.layout.cells, function(node, index){
					if(node && node.name === 'FileAct' && show)
					{
						that.grid.layout.setColumnVisibility(node.index,true);
						that.fileActVisible = true;
					}
					else if(node && node.name === 'FileAct' && !show)
					{
						if(that.grid.selection){
							that.grid.selection.deselectAll();
						}
						that.grid.layout.setColumnVisibility(node.index,false);
						that.fileActVisible = false;
					}
				});
			}
		}
       }
);