dojo.provide("misys.openaccount.widget.OtherCertificateDatasetDetails");
dojo.experimental("misys.openaccount.widget.OtherCertificateDatasetDetails"); 

dojo.require("misys.grid.GridMultipleItems");
dojo.require("misys.openaccount.widget.OtherCertificateDatasetDetail");
dojo.require("misys.openaccount.widget.OtherCertificateSubmittrBics");

// our declared class
dojo.declare("misys.openaccount.widget.OtherCertificateDatasetDetails",
		[ misys.grid.GridMultipleItems ],
		// class properties:
		{
		data: { identifier: "store_id", label: "store_id", items: [] },
		handle: null,
		templatePath: null,
		templateString: dojo.byId("other-certificate-ds-details-template").innerHTML,
		dialogId: "other-certificate-ds-details-dialog-template",
		xmlTagName: "other_certificate_dataset",
		xmlSubTagName: "OthrCertDataSetReqrd",
		
		gridColumns: ["ocds_cert_type","ocds_cert_type_hidden","other_certificate_dataset_bic"],
        
		propertiesMap: {
			CertTp: {_fieldName: "ocds_cert_type"},
			OcdsCertTypeHidden: {_fieldName: "ocds_cert_type_hidden"},
			OtherCertificateBIC: {_fieldName: 'other_certificate_dataset_bic', _type: 'misys.openaccount.widget.OtherCertificateSubmittrBics'}
			},
			
		outerFieldsMap : {
			CertTp: {_fieldName: "ocds_cert_type"}
		},
		
		bicMap : {
			BIC: {_fieldName: "ocds_bic"}
		},
		
		typeMap: {
			'misys.openaccount.widget.OtherCertificateSubmittrBics' : {
				'type': Array,
				'deserialize': function(value) {
					var item = {};
					item._type = 'misys.openaccount.widget.OtherCertificateSubmittrBics';
					item._values = value;
					return item;
				}
			}
		},

		layout: [
				{ name: "ocds_cert_type_hidden", field: "ocds_cert_type_hidden", width: "90%" },
				{ name: " ", field: "actions", formatter: misys.grid.formatReportActions, width: "10%" },
				{ name: "Id", field: "store_id", headerStyles: "display:none", cellStyles: "display:none" }
				],
        
        mandatoryFields: [],
        
		startup: function(){
			console.debug("[other certificate Dataset] startup start");
			
			
			this.inherited(arguments);
			console.debug("[other certificate Dataset] startup end");
		},
    	
		openDialogFromExistingItem: function(items, request)
		{
			console.debug("[other certificate Dataset] openDialogFromExistingItem start");
			
			this.inherited(arguments);

			console.debug("[other certificate Dataset] openDialogFromExistingItem end");
		},
		
		resetDialog: function(items, request)
		{
			console.debug("[PaymentObligations] resetDialog start");
			
			this.inherited(arguments);
			console.debug("[PaymentObligations] resetDialog end");
		},
		
		addItem: function(event)
		{
			console.debug("[other certificate Dataset] addItem start");

			this.inherited(arguments);
			
			console.debug("[other certificate Dataset] addItem end");
		},
		
		updateData: function(event)
		{
			console.debug("[PaymentObligations] updateData start");
			
			this.inherited(arguments);
			
			console.debug("[PaymentObligations] updateData end");
		},
		
		createDataGrid: function()
		{
			this.inherited(arguments);
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
			
			dojo.forEach(items, function(item){
				certXml='';
				if(item) {
					if(xmlSubTagName) {
						xml.push("<", xmlSubTagName, ">");
					}
					for(var property in item)
					{
						// Otherwise, process a property of the item 
						if(property != 'store_id' && property.match('^_') != '_')
						{
							if(property === "other_certificate_dataset_bic" && item[property][0]._values)
							{
								var lengthCharges = item[property][0]._values.length;
								var arrayCharges = item[property][0]._values;
								for(var i=0; i<lengthCharges ; i++)
								{
									var p1 = arrayCharges[i];
									for(var property3 in p1) {
										value = p1[property3];
										value += "";
										for(var property2 in this.bicMap) {
											if(this.bicMap[property2]._fieldName === property3)
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
							
							value = dojo.isArray(item[property]) ? item[property][0] : item[property];
							value += '';
							/*xml.push('<', property, '>', dojox.html.entities.encode(value, dojox.html.entities.html), '</', property, '>');*/
							
							for(var property1 in this.outerFieldsMap) {
								if(this.outerFieldsMap[property1]._fieldName === property)
								{
									certXml=certXml.concat('<').concat(property1).concat('>').concat(dojox.html.entities.encode(value, dojox.html.entities.html)).concat('</').concat(property1).concat('>');
									//flag = true;
									break;
								}
							}
						}
					}
					
					xml.push(certXml);
					if(xmlSubTagName) {
						xml.push('</', xmlSubTagName, '>');
					}
				}
			}, this);
							
			return xml.join("");
		},

		createItemsFromJson: function(jsonMsg)
		{
			console.debug("[other certificate Dataset] createItemsFromJson start");
			
			this.inherited(arguments);
			
			console.debug("[other certificate Dataset] createItemsFromJson end");
		},
		
		performValidation: function()
		{
			console.debug("[Other certificate Data Set] validate start");
			var valid = true;
			if(this.validateDialog(true)) 
			{
				var gridBic = dijit.byId("other_certificate_dataset_bic");
				if(!(gridBic && gridBic.store && gridBic.store._arrayOfTopLevelItems.length > 0)) {
					valid = false;
					misys.dialog.show("ERROR", misys.getLocalization("bicCodeMandatoryError"));
				}
				if(valid) {
					this.inherited(arguments);
				}
			}
			console.debug("[Other Certificate Data Set] validate end");
		}
	}
);