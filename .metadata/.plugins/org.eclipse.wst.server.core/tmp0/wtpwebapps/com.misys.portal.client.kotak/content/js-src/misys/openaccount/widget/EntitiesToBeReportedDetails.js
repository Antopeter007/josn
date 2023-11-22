dojo.provide("misys.openaccount.widget.EntitiesToBeReportedDetails");
dojo.experimental("misys.openaccount.widget.EntitiesToBeReportedDetails"); 

dojo.require("misys.grid.GridMultipleItems");
dojo.require("misys.openaccount.widget.EntitiesToBeReportedDetail");

/**
 * This widget stores the Entities to be Reported details for the Open account transactions.
 */
function _doesBICExists(items)
{
	var doesExist = false;
	var bankBic = dijit.byId('submitter_bic').get('value');
	console.debug("[Entities to be Reported] doesBICExists() start");
	
	for(var i=0 ; i<items.length ;i++)
	{
		if(bankBic===items[i].BIC[0])
		{
			doesExist = true;
			break;
		}
	}
	
	console.debug("[Entities to be Reported] doesBICExists() end");
	return doesExist;
}

dojo.declare("misys.openaccount.widget.EntitiesToBeReportedDetails",
		[ misys.grid.GridMultipleItems ],
		// class properties:
		{
		data: { identifier: "store_id", label: "store_id", items: [] },
		handle: null,
		templatePath: null,
		templateString: dojo.byId("entities-to-be-reported-details-template").innerHTML,
		dialogId: "entities-to-be-reported-template",
		xmlTagName: "Document",
		xmlSubTagName: "StsRptReq",
		openForEdit: false,
		
		gridColumns: ["BIC"],
        
		propertiesMap: {
			BIC: {_fieldName: "entity_bic"}
			},
			
		bicMap : {
			BIC: {_fieldName: "BIC"}
		},

		layout: [
				{ name: "Bic", field: "BIC", width: "90%" },
				{ name: " ", field: "Actions", formatter: misys.grid.formatReportActions, width: "10%" },
				{ name: "Id", field: "store_id", headerStyles: "display:none", cellStyles: "display:none" }
				],
        
        mandatoryFields: ["BIC"],
        
		startup: function(){
			console.debug("[Entities to be Reported] startup start");
			
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
			console.debug("[Entities to be Reported] startup end");
		},
    	
		openDialogFromExistingItem: function(items, request)
		{
			console.debug("[Entities to be Reported] openDialogFromExistingItem start");
			//Set the flag to true if and only if the total no of records is 1
			if(this.store && this.store._arrayOfTopLevelItems && this.store._arrayOfTopLevelItems.length == 1)
			{
				this.openForEdit = true;
			}
			else
			{
				this.openForEdit = false;
			}
				
			this.inherited(arguments);

			console.debug("[Entities to be Reported] openDialogFromExistingItem end");
		},
		
		addItem: function(event)
		{
			console.debug("[Entities to be Reported] addItem start");
			
			this.inherited(arguments);
			if(dijit.byId('submitter_bic') && this.store && this.store._arrayOfTopLevelItems && (this.store._arrayOfTopLevelItems.length == 0 || !_doesBICExists(this.store._arrayOfTopLevelItems)))
			{
				dijit.byId('entity_bic').set('value',dijit.byId('submitter_bic').get('value'));
			}
			
			this.openForEdit = false;
			console.debug("[Entities to be Reported] addItem end");
		},
		
		createDataGrid: function()
		{
			this.inherited(arguments);
			var grid = this.grid;
			var widgetEntityIDs = dijit.byId("entities-to-be-reported-ds");
			misys.connect(grid, "onDelete",
					function(){
						misys.dialog.connect(dijit.byId("okButton"), "onMouseUp", function(){
							widgetEntityIDs.addButtonNode.set("disabled", false);
						}, "alertDialog");
			});
		},
		
		
		toXML: function(){
			var xml = [];
			var requestIdentificationXML = '';
			
			xml.push("<narrative_xml>");
			xml.push("<![CDATA[");
			
			if(this.xmlTagName) {
				xml.push("<", this.xmlTagName, ">");
			}
			if(this.xmlSubTagName) {
				xml.push("<", this.xmlSubTagName, ">");
			}
			requestIdentificationXML = requestIdentificationXML.concat("<ReqId><Id>").concat(dijit.byId('request_id').get('value')).concat("</Id>");
			requestIdentificationXML = requestIdentificationXML.concat("<CreDtTm>").concat(dijit.byId('creation_dt_time').get('value')).concat("</CreDtTm></ReqId>");
			xml.push(requestIdentificationXML);
			
			if(this.grid)
			{
				this.grid.store.fetch({query: {store_id: '*'}, 
						onComplete: dojo.hitch(this, function(items, request){
					xml.push(this.itemToXML(items, this.xmlSubTagName));
				})});
			}
			
			if(this.xmlSubTagName) {
				xml.push('</', this.xmlSubTagName, '>');
			}
			if(this.xmlTagName) {
				xml.push("</", this.xmlTagName, ">");
			}
			xml.push("]]>");
			xml.push("</narrative_xml>");
			
			return xml.join("");
		},
		
		itemToXML: function(items, xmlSubTagName)
		{
			var xml = [];
			var entitiesToBeReportedXML = '';
			
			dojo.forEach(items, function(item){				
				if(item) 
				{
					for(var property in item)
					{
						// Otherwise, process a property of the item 
						if(property != 'store_id' && property.match('^_') != '_')
						{
							value = dojo.isArray(item[property]) ? item[property][0] : item[property];
							value += '';
							
							for(var property1 in this.bicMap) {
								if(this.bicMap[property1]._fieldName === property)
								{
									entitiesToBeReportedXML=entitiesToBeReportedXML.concat("<NttiesToBeRptd>");
									entitiesToBeReportedXML = entitiesToBeReportedXML.concat('<').concat(property1).concat('>').concat(dojox.html.entities.encode(value, dojox.html.entities.html)).concat('</').concat(property1).concat('>').concat("</NttiesToBeRptd>");
									break;
								}
							}
						}
					}
					
				}
			}, this);
			
			xml.push(entitiesToBeReportedXML);
							
			return xml.join("");
		},


		createItemsFromJson: function(jsonMsg)
		{
			console.debug("[Entities to be Reported] createItemsFromJson start");
			
			this.inherited(arguments);
			
			console.debug("[Entities to be Reported] createItemsFromJson end");
		},
		
		performValidation: function()
		{
			console.debug("[Entities to be Reported] validate start");
			var valid = true;
			if(this.validateDialog(true))
			{
				if(this.store && this.store._arrayOfTopLevelItems && this.store._arrayOfTopLevelItems.length > 0 && !this.openForEdit)
				{
					var bic = this.store._arrayOfTopLevelItems;
	
					for(var i=0 ; i<bic.length; i++)
					{
						var tempBIC = bic[i] && bic[i].BIC ? bic[i].BIC[0] : "";
						if(dijit.byId('entity_bic') && dijit.byId('entity_bic').get('value') === tempBIC)
						{
							valid = false;
							misys.dialog.show("ERROR",  misys.getLocalization('duplicateBICCodeError',[dijit.byId('entity_bic').get('value')]));
							break;
						}
					}
				}
				if(valid) {
					this.inherited(arguments);
				}
			}
			
			console.debug("[Entities to be Reported] validate end");
		},
		
		updateData : function()
		{
			console.debug("[Entities to be Reported] updateData start");
			this.inherited(arguments);
			
			console.debug("[Entities to be Reported] updateData end");
		}
	}
);