dojo.provide("misys.openaccount.widget.InsuranceDatasetDetails");
dojo.experimental("misys.openaccount.widget.InsuranceDatasetDetails"); 

dojo.require("misys.grid.GridMultipleItems");
dojo.require("misys.openaccount.widget.InsuranceDatasetDetail");
dojo.require("misys.openaccount.widget.InsuranceSubmittrBics");
dojo.require("misys.openaccount.widget.InsuranceRequiredClauses");

// our declared class
dojo.declare("misys.openaccount.widget.InsuranceDatasetDetails",
		[ misys.grid.GridMultipleItems ],
		// class properties:
		{
		data: { identifier: "store_id", label: "store_id", items: [] },
		handle: null,
		templatePath: null,
		templateString: dojo.byId("insurance-ds-details-template").innerHTML,
		dialogId: "insurance-ds-details-dialog-template",
		xmlTagName: "insurance_dataset",
		xmlSubTagName: "InsrncDataSetReqrd",
		
		gridColumns: ["ids_match_issuer_name","ids_match_issuer_country","ids_identification","ids_identification_type","ids_match_iss_date","ids_match_amount","ids_match_transport","ids_match_assured_party","insurance_dataset_req_clause","insurance_dataset_bic"],
        
		propertiesMap: {
			Nm: {_fieldName: "ids_match_issuer_name"},
			Ctry: {_fieldName: "ids_match_issuer_country"},
			Id: {_fieldName: "ids_identification"},
			IdTp: {_fieldName: "ids_identification_type"},
			MtchIsseDt: {_fieldName: "ids_match_iss_date"},
			MtchTrnsprt: {_fieldName: "ids_match_transport"},
			MtchAmt: {_fieldName: "ids_match_amount"},
			MtchAssrdPty: {_fieldName: "ids_match_assured_party"},
			InsuranceBIC: {_fieldName: "insurance_dataset_bic", _type: 'misys.openaccount.widget.InsuranceSubmittrBics'},
			ReqrdClauses: {_fieldName: "insurance_dataset_req_clause", _type: 'misys.openaccount.widget.InsuranceRequiredClauses'}
			},
			
		
		matchIssuerMap : {
			Nm: {_fieldName: "ids_match_issuer_name"}
			},
			
		matchIssuerCtryMap : {
			Ctry: {_fieldName: "ids_match_issuer_country"}
		},			
		propIdMap : {
			Id: {_fieldName: "ids_identification"},
			IdTp: {_fieldName: "ids_identification_type"}
			},
			
			
		outerFieldsMap : {
			MtchIsseDt: {_fieldName: "ids_match_iss_date"},
			MtchTrnsprt: {_fieldName: "ids_match_transport"}
		},
		
		outerAmtMap : {
			MtchAmt: {_fieldName: "ids_match_amount"}
		},
		
		bicMap : {
			BIC: {_fieldName: "ids_bic"}
		},
		
		ClausesReqrdMap : {
			ClausesReqrd: {_fieldName: "ids_clauses_required"}
		},
		
		matchAssuredPrtyMap : {
			MtchAssrdPty: {_fieldName: "ids_match_assured_party"}
		},
		
		typeMap: {
			'misys.openaccount.widget.InsuranceSubmittrBics' : {
				'type': Array,
				'deserialize': function(value) {
					var item = {};
					item._type = 'misys.openaccount.widget.InsuranceSubmittrBics';
					item._values = value;
					return item;
				}
			},
			'misys.openaccount.widget.InsuranceRequiredClauses' : {
				'type': Array,
				'deserialize': function(value) {
					var item = {};
					item._type = 'misys.openaccount.widget.InsuranceRequiredClauses';
					item._values = value;
					return item;
				}
			}
		},

		layout: [
				{ name: "ids_match_issuer_name", field: "ids_match_issuer_name", width: "90%" },
				{ name: " ", field: "actions", formatter: misys.grid.formatReportActions, width: "10%" },
				{ name: "Id", field: "store_id", headerStyles: "display:none", cellStyles: "display:none" }
				],
        
        mandatoryFields: [],
        
		startup: function(){
			console.debug("[insurance Dataset] startup start");
			
			this.inherited(arguments);
			console.debug("[insurance Dataset] startup end");
		},
    	
		openDialogFromExistingItem: function(items, request)
		{
			console.debug("[insurance Dataset] openDialogFromExistingItem start");
			
			this.inherited(arguments);

			console.debug("[insurance Dataset] openDialogFromExistingItem end");
		},
		
		addItem: function(event)
		{
			console.debug("[insurance Dataset] addItem start");

			this.inherited(arguments);
			
			console.debug("[insurance Dataset] addItem end");
		},
		
		createJsonItem: function()
		{
			var jsonEntry = [];
			if(this.hasChildren && this.hasChildren())
			{
				dojo.forEach(this.getChildren(), function(child){
					if (child.createItem)
					{
						var item = child.createItem();
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
		
		createDataGrid: function()
		{
			this.inherited(arguments);
			var grid = this.grid;
			var widgetInsuranceDs = dijit.byId("insurance-ds-details");
			misys.connect(grid, "onDelete",
					function(){
						misys.dialog.connect(dijit.byId("okButton"), "onMouseUp", function(){
							widgetInsuranceDs.addButtonNode.set("disabled", false);
						}, "alertDialog");
			});
		},
		
		toXML: function(){
			var xml = [];
			
			if(this.xmlTagName) {
				xml.push("<", this.xmlTagName, ">");
			}
			
			xml.push("<![CDATA[");
			if(this.grid)
			{
				this.grid.store.fetch({query: {store_id: '*'}, 
						onComplete: dojo.hitch(this, function(items, request){
					xml.push(this.itemToXML(items, this.xmlSubTagName));
				})});
			}
			xml.push("]]>");
			if(this.xmlTagName) {
				xml.push("</", this.xmlTagName, ">");
			}
			
			return xml.join("");
		},
		
		itemToXML: function(items, xmlSubTagName)
		{
			var xml = [];
			var issuerXml = '';
			var propIdXml = '';
			dojo.forEach(items, function(item){
				issuerXml = '';
				propIdXml = '';
				clausesXml = '';
				outerFieldsXml = '';
				matchIssPrtyXml = '';
				outerAmtXml = '';
				mtchIssuerCtry='';
				issuerXml=issuerXml.concat("<MtchIssr>");
				propIdXml=propIdXml.concat("<PrtryId>");
				if(item) {
					if(xmlSubTagName) {
						xml.push("<", xmlSubTagName, ">");
					}
					for(var property in item)
					{
						
						// Otherwise, process a property of the item 
						if(property != 'store_id' && property.match('^_') != '_')
						{
							if(property === "insurance_dataset_bic" && item[property][0]._values)
							{
								var lengthCharges = item[property][0]._values.length;
								var arrayCharges = item[property][0]._values;
								for(var i=0; i<lengthCharges ; i++)
								{
									var p1 = arrayCharges[i];
									for(var property5 in p1) {
										value = p1[property5];
										value += "";
										for(var property2 in this.bicMap) {
											if(this.bicMap[property2]._fieldName === property5)
											{
												xml.push("<Submitr>");
												xml.push('<', property2, '>', dojox.html.entities.encode(value, dojox.html.entities.html), '</', property2, '>');
												xml.push("</Submitr>");
												break;
											}
										}
									}
								}
							}
							if(property === "insurance_dataset_req_clause" && item[property][0]._values)
							{
								var lengthReqClause = item[property][0]._values.length;
								var arrayReqClause = item[property][0]._values;
								for(var j=0; j<lengthReqClause ; j++)
								{
									var insReqClause = arrayReqClause[j];
									for(var property6 in insReqClause) {
										value = insReqClause[property6];
										value += "";
										for(var property7 in this.ClausesReqrdMap) {
											if(this.ClausesReqrdMap[property7]._fieldName === property6)
											{
												//xml.push('<', property7, '>', dojox.html.entities.encode(value, dojox.html.entities.html), '</', property7, '>');
												clausesXml=clausesXml.concat('<').concat(property7).concat('>').concat(dojox.html.entities.encode(value, dojox.html.entities.html)).concat('</').concat(property7).concat('>');
												break;
											}
										}
									}
								}
							}
							
							
							value = dojo.isArray(item[property]) ? item[property][0] : item[property];
							value += '';
							/*xml.push('<', property, '>', dojox.html.entities.encode(value, dojox.html.entities.html), '</', property, '>');*/
							
							for(var property1 in this.outerFieldsMap) {
								if(this.outerFieldsMap[property1]._fieldName === property)
								{
									//xml.push('<', property1, '>', dojox.html.entities.encode(value, dojox.html.entities.html), '</', property1, '>');
									if(value!=null && value == 'Y')
									{
										value = "true";
									}
									else 
									{
										value = "false";
									}
									outerFieldsXml = outerFieldsXml.concat('<').concat(property1).concat('>').concat(dojox.html.entities.encode(value, dojox.html.entities.html)).concat('</').concat(property1).concat('>');
									//flag = true;
									break;
								}
							}
							
							for(var property3 in this.matchIssuerMap) {
								if(this.matchIssuerMap[property3]._fieldName === property)
								{
									//xml.push('<', property1, '>', dojox.html.entities.encode(value, dojox.html.entities.html), '</', property1, '>');
									issuerXml=issuerXml.concat('<').concat(property3).concat('>').concat(dojox.html.entities.encode(value, dojox.html.entities.html)).concat('</').concat(property3).concat('>');
									break;
								}
							}
							
							for(var property4 in this.propIdMap) {
								if(this.propIdMap[property4]._fieldName === property)
								{
									//xml.push('<', property1, '>', dojox.html.entities.encode(value, dojox.html.entities.html), '</', property1, '>');
									propIdXml=propIdXml.concat('<').concat(property4).concat('>').concat(dojox.html.entities.encode(value, dojox.html.entities.html)).concat('</').concat(property4).concat('>');
									break;
								}
							}
							
							for(var property8 in this.matchAssuredPrtyMap) {
								if(this.matchAssuredPrtyMap[property8]._fieldName === property)
								{
									//xml.push('<', property1, '>', dojox.html.entities.encode(value, dojox.html.entities.html), '</', property1, '>');
									matchIssPrtyXml = matchIssPrtyXml.concat('<').concat(property8).concat('>').concat(dojox.html.entities.encode(value, dojox.html.entities.html)).concat('</').concat(property8).concat('>');
									
									//flag = true;
									break;
								}
							}
							
							for(var property9 in this.outerAmtMap) {
								if(this.outerAmtMap[property9]._fieldName === property)
								{//xml.push('<', property1, '>', dojox.html.entities.encode(value, dojox.html.entities.html), '</', property1, '>');
									if(value!=null && value == 'Y')
									{
										value = "true";
									}
									else 
									{
										value = "false";
									}
									outerAmtXml = outerAmtXml.concat('<').concat(property9).concat('>').concat(dojox.html.entities.encode(value, dojox.html.entities.html)).concat('</').concat(property9).concat('>');
									//flag = true;
									break;}
							}
							
							for(var property10 in this.matchIssuerCtryMap) {
								if(this.matchIssuerCtryMap[property10]._fieldName === property)
								{
									mtchIssuerCtry=mtchIssuerCtry.concat('<').concat(property10).concat('>').concat(dojox.html.entities.encode(value, dojox.html.entities.html)).concat('</').concat(property10).concat('>');
									break;
								}
							}
							
						}
						
					}
					propIdXml=propIdXml.concat("</PrtryId>");
					
					issuerXml=issuerXml.concat(propIdXml).concat(mtchIssuerCtry);
					issuerXml=issuerXml.concat('</MtchIssr>').concat(outerFieldsXml).concat(outerAmtXml).concat(clausesXml).concat(matchIssPrtyXml);
					
					
					xml.push(issuerXml);
					
					if(xmlSubTagName) {
						xml.push('</', xmlSubTagName, '>');
					}
				}
			}, this);
							
			return xml.join("");
		},

		createItemsFromJson: function(jsonMsg)
		{
			console.debug("[insurance Dataset] createItemsFromJson start");
			
			this.inherited(arguments);
			
			console.debug("[insurance Dataset] createItemsFromJson end");
		},
		
		updateData : function()
		{
			console.debug("[insurance Dataset] updateData start");
			this.inherited(arguments);
			//Disable Add Insurance data set button, after an Insurance data set is added.
			dijit.byId("add_insurance_ds_button").set("disabled",true);
			
			console.debug("[insurance Dataset] updateData end");
		},
		
		performValidation : function()
		{
			console.debug("[insurance Dataset] validate start");
			var valid = true;
			if(this.validateDialog(true)) 
			{
				var gridBic = dijit.byId("insurance_dataset_bic");
				if(!(gridBic && gridBic.store && gridBic.store._arrayOfTopLevelItems.length > 0)) {
					valid = false;
					misys.dialog.show("ERROR", misys.getLocalization("bicCodeMandatoryError"));
				}
				if(valid) {
					this.inherited(arguments);
				}
			}
			console.debug("[insurance Dataset] validate end");
		}
	}
);