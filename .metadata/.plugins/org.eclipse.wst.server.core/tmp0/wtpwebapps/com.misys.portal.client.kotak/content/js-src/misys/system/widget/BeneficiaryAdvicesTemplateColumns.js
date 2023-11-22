dojo.provide("misys.system.widget.BeneficiaryAdvicesTemplateColumns");
dojo.experimental("misys.system.widget.BeneficiaryAdvicesTemplateColumns"); 

dojo.require("misys.grid.GridMultipleItems");
dojo.require("misys.system.widget.BeneficiaryAdvicesTemplateColumn");

// our declared class
dojo.declare("misys.system.widget.BeneficiaryAdvicesTemplateColumns",
		[ misys.grid.GridMultipleItems ],
		// class properties:
		{
		data: { identifier: 'store_id', label: 'store_id', items: [] },
		
		templatePath: null,
		templateString: dojo.byId("columns-template").innerHTML,
		dialogId: 'column-dialog-template',
		xmlTagName: 'columns',
		xmlSubTagName: 'column',
		
		gridColumns: ['label', 'type','type_label','alignment','width'],
        
		propertiesMap: {
			label: {_fieldName: 'column_label'},
			type: {_fieldName: 'column_type'},
			type_label: {_fieldName: 'column_type_label'},
			alignment: {_fieldName: 'column_alignment'},
			width: {_fieldName: 'column_width'}
			},
        
		layout: [
				{ name: 'Label', field: 'label', width: '25%',cellStyles:'text-align:center;',noresize:true },
				{ name: 'Data Type', field: 'type_label', width: '30%',cellStyles:'text-align:center;',noresize:true },
				{ name: 'Data Type Hidden', field: 'type', headerStyles: 'display:none', cellStyles:'display:none',noresize:true },
				{ name: 'Alignment', field: 'alignment', width: '20%',cellStyles:'text-align:center;',noresize:true },
				{ name: 'Width', field: 'width', width: '15%',cellStyles:'text-align:center;',noresize:true },
				{ name: ' ', field: 'actions', formatter: misys.grid.formatReportActions, width: '5%',noresize:true },
				{ name: 'Id', field: 'store_id', headerStyles: 'display:none', cellStyles: 'display:none' ,noresize:true}
				],
        
		startup: function(){
			console.debug("[BeneficiaryAdvicesTemplateColumns] startup start");
			// Prepare data store
			this.dataList = [];
			if(this.hasChildren())
			{
				dojo.forEach(this.getChildren(), function(child){
					var item = {label: child.get('label'), type: child.get('type'),type_label: child.get('type_label'),alignment: child.get('alignment'),width: child.get('width') };
					this.dataList.push(item);
				}, this);
			}
			this.inherited(arguments);
			console.debug("[BeneficiaryAdvicesTemplateColumns] startup end");
		},
    	
		openDialogFromExistingItem: function(items, request)
		{
			console.debug("[BeneficiaryAdvicesTemplateColumns] openDialogFromExistingItem start");
			console.debug("[BeneficiaryAdvicesTemplateColumns] openDialogFromExistingItem , items = ", items);
			var item = items[0];
			var storeId = (dojo.isArray(item.store_id) ? item.store_id[0] : item.store_id);
			misys._config = misys._config || {};
			dojo.mixin(misys._config,{
				beneAdvColumnsDialogStoreId : storeId
			});
			this.inherited(arguments);
			console.debug("[BeneficiaryAdvicesTemplateColumns] openDialogFromExistingItem end");
		},
		
		addItem: function(event)
		{
			console.debug("[BeneficiaryAdvicesTemplateColumns] addItem start");
			this.inherited(arguments);
			console.debug("[BeneficiaryAdvicesTemplateColumns] addItem end");
		}
	}
);