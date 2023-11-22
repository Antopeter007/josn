dojo.provide("misys.openaccount.widget.CertificateDatasetDetails");
dojo.experimental("misys.openaccount.widget.CertificateDatasetDetails"); 

dojo.require("misys.grid.GridMultipleItems");
dojo.require("misys.openaccount.widget.CertificateDatasetDetail");
dojo.require("misys.openaccount.widget.CertificateSubmittrBics");
dojo.require("misys.openaccount.widget.CertificateLineItemIdentifications");

/**
 * This widget stores the certificate dataset details for the Open account transactions.
 */
dojo.declare("misys.openaccount.widget.CertificateDatasetDetails",
		[ misys.grid.GridMultipleItems ],
		// class properties:
		{
		data: { identifier: "store_id", label: "store_id", items: [] },
		handle: null,
		templatePath: null,
		templateString: dojo.byId("certificate-ds-details-template").innerHTML,
		dialogId: "certificate-ds-details-dialog-template",
		xmlTagName: "certificate_dataset",
		xmlSubTagName: "CertDataSetReqrd",
		
		gridColumns: ["ceds_cert_type","ceds_cert_type_hidden","ceds_match_issuer_name","ceds_match_issuer_country","ceds_identification","ceds_identification_type","ceds_match_iss_date","ceds_match_insp_date","ceds_match_insp_ind","ceds_match_consignee","ceds_match_mf_issuer_name","ceds_match_mf_issuer_country","ceds_match_mf_identification","ceds_match_mf_identification_type","certificate_dataset_bic","certificate_dataset_line_item_id"],
        
		propertiesMap: {
			CertTp: {_fieldName: "ceds_cert_type"},
			Nm: {_fieldName: "ceds_match_issuer_name"},
			Ctry: {_fieldName: "ceds_match_issuer_country"},
			Id: {_fieldName: "ceds_identification"},
			IdTp: {_fieldName: "ceds_identification_type"},
			MtchIsseDt: {_fieldName: "ceds_match_iss_date"},
			MtchInspctnDt: {_fieldName: "ceds_match_insp_date"},
			AuthrsdInspctrInd: {_fieldName: "ceds_match_insp_ind"},
			MtchConsgn: {_fieldName: "ceds_match_consignee"},
			
			NmMF: {_fieldName: "ceds_match_mf_issuer_name"},
			CtryMF: {_fieldName: "ceds_match_mf_issuer_country"},
			IdMF: {_fieldName: "ceds_match_mf_identification"},
			IdTpMF: {_fieldName: "ceds_match_mf_identification_type"},
			CedsCertTypeHidden: {_fieldName: "ceds_cert_type_hidden"},
			
			CertificateBIC: {_fieldName: 'certificate_dataset_bic', _type: 'misys.openaccount.widget.CertificateSubmittrBics'},
			CertificateLineItemId: {_fieldName: 'certificate_dataset_line_item_id', _type: 'misys.openaccount.widget.CertificateLineItemIdentifications'}
			
			},
			
		matchManufacturerMap : {
			Nm: {_fieldName: "ceds_match_mf_issuer_name"}
			},
		
		matchManufacturerCtryMap : {
			Ctry: {_fieldName: "ceds_match_mf_issuer_country"}
		},
			
		propIdMapManufacturer : {
			Id: {_fieldName: "ceds_match_mf_identification"},
			IdTp: {_fieldName: "ceds_match_mf_identification_type"}
			},
			
		matchIssuerMap : {
			Nm: {_fieldName: "ceds_match_issuer_name"}
			},
			
		matchIssuerCtryMap : {
			Ctry: {_fieldName: "ceds_match_issuer_country"}
		},
		
		propIdMap : {
			Id: {_fieldName: "ceds_identification"},
			IdTp: {_fieldName: "ceds_identification_type"}
			},
			
			
		outerFieldsMap : {
			MtchIsseDt: {_fieldName: "ceds_match_iss_date"},
			MtchInspctnDt: {_fieldName: "ceds_match_insp_date"},
			AuthrsdInspctrInd: {_fieldName: "ceds_match_insp_ind"},
			MtchConsgn: {_fieldName: "ceds_match_consignee"}
		},
		
		bicMap : {
			BIC: {_fieldName: "ceds_bic"}
		},
		
		lineItemIdMap : {
			LineItmId: {_fieldName: "ceds_line_item_id"}
		},
		
		certpMap : {
			CertTp: {_fieldName: "ceds_cert_type"}
		},
		
		typeMap: {
			'misys.openaccount.widget.CertificateSubmittrBics' : {
				'type': Array,
				'deserialize': function(value) {
					var item = {};
					item._type = 'misys.openaccount.widget.CertificateSubmittrBics';
					item._values = value;
					return item;
				}
			},
		'misys.openaccount.widget.CertificateLineItemIdentifications' : {
			'type': Array,
			'deserialize': function(value) {
				var item = {};
				item._type = 'misys.openaccount.widget.CertificateLineItemIdentifications';
				item._values = value;
				return item;
			}
		}
		},

		layout: [
				{ name: "ceds_cert_type_hidden", field: "ceds_cert_type_hidden", width: "90%" },
				{ name: " ", field: "actions", formatter: misys.grid.formatReportActions, width: "10%" },
				{ name: "Id", field: "store_id", headerStyles: "display:none", cellStyles: "display:none" }
				],
        
        mandatoryFields: [],
        
		startup: function(){
			console.debug("[certificate Dataset] startup start");
			
			this.inherited(arguments);
			console.debug("[certificate Dataset] startup end");
		},
    	
		openDialogFromExistingItem: function(items, request)
		{
			console.debug("[certificate Dataset] openDialogFromExistingItem start");
			
			this.inherited(arguments);

			console.debug("[certificate Dataset] openDialogFromExistingItem end");
		},
		
		addItem: function(event)
		{
			console.debug("[certificate Dataset] addItem start");

			this.inherited(arguments);
			
			console.debug("[certificate Dataset] addItem end");
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
			var mfXml = '';
			var propIdMFXml = '';
			
			dojo.forEach(items, function(item){
				issuerXml= '';
				propIdXml='';
				mfXml='';
				propIdMFXml='';
				lineItemIdXml='';
				outerFieldsXml = '';
				certXml='';
				mtchCtryXml='';
				mtchIssuerCtry='';
				issuerXml=issuerXml.concat("<MtchIssr>");
				propIdXml=propIdXml.concat("<PrtryId>");
				mfXml=mfXml.concat("<MtchManfctr>");
				propIdMFXml=propIdMFXml.concat("<PrtryId>");
				if(item) {
					if(xmlSubTagName) {
						xml.push("<", xmlSubTagName, ">");
					}
					for(var property in item)
					{
						if(property != 'store_id' && property.match('^_') != '_')
						{
							if(property === "certificate_dataset_bic" && item[property][0]._values)
							{
								var lengthCertDsBic = item[property][0]._values.length;
								var arrayCertDsBic = item[property][0]._values;
								for(var i=0; i<lengthCertDsBic ; i++)
								{
									var p1 = arrayCertDsBic[i];
									for(var property7 in p1) {
										value = p1[property7];
										value += "";
										for(var property2 in this.bicMap) {
											if(this.bicMap[property2]._fieldName === property7)
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
							
							if(property === "certificate_dataset_line_item_id" && item[property][0]._values)
							{
								var lengthCertDsLi = item[property][0]._values.length;
								var arrayCertDsLi = item[property][0]._values;
								for(var j=0; j<lengthCertDsLi ; j++)
								{
									var certDsLiItem = arrayCertDsLi[j];
									for(var property8 in certDsLiItem) {
										value = certDsLiItem[property8];
										value += "";
										for(var property9 in this.lineItemIdMap) {
											if(this.lineItemIdMap[property9]._fieldName === property8)
											{
												lineItemIdXml = lineItemIdXml.concat('<').concat(property9).concat('>').concat(dojox.html.entities.encode(value, dojox.html.entities.html)).concat('</').concat(property9).concat('>');
												break;
											}
										}
									}
								}
								
							}
							
							value = dojo.isArray(item[property]) ? item[property][0] : item[property];
							value += '';
							
							for(var property1 in this.outerFieldsMap) {
								if(this.outerFieldsMap[property1]._fieldName === property)
								{
									if(value!=null && value == 'Y')
									{
										value = "true";
									}
									else 
									{
										value = "false";
									}
									outerFieldsXml = outerFieldsXml.concat('<').concat(property1).concat('>').concat(dojox.html.entities.encode(value, dojox.html.entities.html)).concat('</').concat(property1).concat('>');
									break;
								}
							}
							
							for(var property3 in this.matchIssuerMap) {
								if(this.matchIssuerMap[property3]._fieldName === property)
								{
									issuerXml=issuerXml.concat('<').concat(property3).concat('>').concat(dojox.html.entities.encode(value, dojox.html.entities.html)).concat('</').concat(property3).concat('>');
									break;
								}
							}
							
							for(var property4 in this.propIdMap) {
								if(this.propIdMap[property4]._fieldName === property)
								{
									propIdXml=propIdXml.concat('<').concat(property4).concat('>').concat(dojox.html.entities.encode(value, dojox.html.entities.html)).concat('</').concat(property4).concat('>');
									break;
								}
							}
							
							for(var property5 in this.matchManufacturerMap) {
								if(this.matchManufacturerMap[property5]._fieldName === property)
								{
									mfXml=mfXml.concat('<').concat(property5).concat('>').concat(dojox.html.entities.encode(value, dojox.html.entities.html)).concat('</').concat(property5).concat('>');
									break;
								}
							}
							
							for(var property6 in this.propIdMapManufacturer) {
								if(this.propIdMapManufacturer[property6]._fieldName === property)
								{
									propIdMFXml=propIdMFXml.concat('<').concat(property6).concat('>').concat(dojox.html.entities.encode(value, dojox.html.entities.html)).concat('</').concat(property6).concat('>');
									break;
								}
							}
							
							for(var property10 in this.certpMap) {
								if(this.certpMap[property10]._fieldName === property)
								{
									certXml=certXml.concat('<').concat(property10).concat('>').concat(dojox.html.entities.encode(value, dojox.html.entities.html)).concat('</').concat(property10).concat('>');
									break;
								}
							}
							
							for(var property11 in this.matchManufacturerCtryMap) {
								if(this.matchManufacturerCtryMap[property11]._fieldName === property)
								{
									mtchCtryXml=mtchCtryXml.concat('<').concat(property11).concat('>').concat(dojox.html.entities.encode(value, dojox.html.entities.html)).concat('</').concat(property11).concat('>');
									break;
								}
							}
							
							for(var property12 in this.matchIssuerCtryMap) {
								if(this.matchIssuerCtryMap[property12]._fieldName === property)
								{
									mtchIssuerCtry=mtchIssuerCtry.concat('<').concat(property12).concat('>').concat(dojox.html.entities.encode(value, dojox.html.entities.html)).concat('</').concat(property12).concat('>');
									break;
								}
							}

							
						}
						
					}
					
					
					propIdXml=propIdXml.concat("</PrtryId>");
					issuerXml=issuerXml.concat(propIdXml).concat(mtchIssuerCtry);
					issuerXml=issuerXml.concat('</MtchIssr>').concat(outerFieldsXml);
										
					propIdMFXml=propIdMFXml.concat("</PrtryId>");
					mfXml=mfXml.concat(propIdMFXml).concat(mtchCtryXml);
					mfXml=mfXml.concat('</MtchManfctr>').concat(lineItemIdXml);
					
					xml.push(certXml);
					xml.push(issuerXml);
					xml.push(mfXml);
					
					if(xmlSubTagName) {
						xml.push('</', xmlSubTagName, '>');
					}
				}
			}, this);
							
			return xml.join("");
		},

		createItemsFromJson: function(jsonMsg)
		{
			console.debug("[certificate Dataset] createItemsFromJson start");
			
			this.inherited(arguments);
			
			console.debug("[certificate Dataset] createItemsFromJson end");
		},
		
		performValidation: function()
		{
			console.debug("[Certificate Data Set] validate start");
			var valid = true;
			if(this.validateDialog(true)) 
			{
				var gridBic = dijit.byId("certificate_dataset_bic");
				if(!(gridBic && gridBic.store && gridBic.store._arrayOfTopLevelItems.length > 0)) {
					valid = false;
					misys.dialog.show("ERROR", misys.getLocalization("bicCodeMandatoryError"));
				}
				if(valid) {
					this.inherited(arguments);
				}
			}
			console.debug("[Certificate Data Set] validate end");
		}
	}
);