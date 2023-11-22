dojo.provide("misys.system.widget.PayeeRefs");
dojo.experimental("misys.system.widget.PayeeRefs"); 

dojo.require("misys.grid.GridMultipleItems");
dojo.require("misys.system.widget.PayeeRef");

// our declared class
dojo.declare("misys.system.widget.PayeeRefs",
		[ misys.grid.GridMultipleItems ],
		// class properties:
		{
		data: { identifier: 'store_id', label: 'store_id', items: [] },
		templatePath: null,
		templateString:dojo.byId("payeerefs-template").innerHTML,
		dialogId: 'payeref-dialog-template',
		xmlTagName: 'master_payee_refs',
		xmlSubTagName: 'master_payee_ref',
		viewMode: 'edit',
		gridColumns: ['reference_id', 'label', 'local_label','help_message','local_help_message', 'optional', 'validation_format', 'external_validation', 'input_in_type', 'field_type'],
		propertiesMap: {
			reference_id: {_fieldName: 'reference_id'},
			label: {_fieldName: 'label'},
			local_label: {_fieldName: 'local_label'},
			help_message: {_fieldName: 'help_message'},
			local_help_message: {_fieldName: 'local_help_message'},
			optional: {_fieldName: 'optional'},
			validation_format: {_fieldName: 'validation_format'},
			external_validation: {_fieldName: 'external_validation'},
			input_in_type: {_fieldName: 'input_in_type'},
			field_type: {_fieldName: 'field_type'}
			},		
				
		 maxBillRefs : 0,
	        
		startup: function(){
			console.debug("[PayeeRefs] startup start");
			// Prepare data store
			this.dataList = [];
			
			this.layout = [
							{ name: 'Reference ID', field: 'reference_id', width: '10%' ,noresize:true},
							{ name: 'Bill Reference Label', field: 'label', width: '30%',noresize:true },
							{ name: 'Local Label', field: 'local_label', width: '30%',noresize:true },
							{ name: 'V', field: 'optional', width: '5%' ,noresize:true},
							{ name: 'C', field: 'external_validation', width: '5%',noresize:true },
							{ name: 'R', field: 'input_in_type', width: '5%',noresize:true },
							{ name: 'T', field: 'field_type', width: '5%',noresize:true },
							{ name: '', field: 'actions', formatter: misys.grid.formatReportActions, width: '10%',noresize:true },
							{ name: 'Id', field: 'store_id', headerStyles: 'display:none', cellStyles: 'display:none' ,noresize:true}
							];
			
				if (this.viewMode === 'view')
				{
					this.layout = [
							{ name: 'Reference ID', field: 'reference_id', width: '10%' ,noresize:true},
							{ name: 'Bill Reference Label', field: 'label', width: '30%',noresize:true },
							{ name: 'Local Label', field: 'local_label', width: '30%',noresize:true },
							{ name: 'V', field: 'optional', width: '5%' ,noresize:true},
							{ name: 'C', field: 'external_validation', width: '5%',noresize:true },
							{ name: 'R', field: 'input_in_type', width: '5%',noresize:true },
							{ name: 'T', field: 'field_type', width: '5%',noresize:true },
							{ name: 'Id', field: 'store_id', headerStyles: 'display:none', cellStyles: 'display:none' ,noresize:true}
									];
				}
			if(this.hasChildren())
			{
				dojo.forEach(this.getChildren(), function(child){
					var item = { reference_id: child.get('reference_id'), label: child.get('label'), local_label: child.get('local_label'),help_message: child.get('help_message'),local_help_message:child.get('local_help_message'),optional: child.get('optional'), validation_format: child.get('validation_format'),external_validation: child.get('external_validation'), input_in_type: child.get('input_in_type'), field_type: child.get('field_type') };
					this.dataList.push(item);
				}, this);
			}
			this.inherited(arguments);
			console.debug("[PayeeRefs] startup end");
		},
		resetDialog: function(items, request)
		{
			console.debug("[Payee Refs] resetDialog start");
			
			this.inherited(arguments);
			if (dijit.byId('reg_required').get("value") == 'N'){
				dijit.byId('input_in_type_1').set("disabled", true);
			}
			else{
				dijit.byId('input_in_type_1').set("disabled", false);
			}
			
			//setting the input type mode as selected by default
			if (dijit.byId('input_in_type_2')){
				
				dijit.byId('input_in_type_2').set('checked', 'checked');
				
			}
			//setting the field type as selected by default
			if (dijit.byId('field_type_2')){
				
				dijit.byId('field_type_2').set('checked', 'checked');
				
			}
			console.debug("[Payee Refs] resetDialog end");
		},
		openDialogFromExistingItem: function(items, request)
		{
			console.debug("[PayeeRefs] openDialogFromExistingItem start");
			this.inherited(arguments);
			console.debug("[PayeeRefs] openDialogFromExistingItem end");
		},
		
		addItem: function(event)
		{
			console.debug("[PayeeRefs] addItem start");
			
			var that = this;
			var inherit = false;
			if(that.grid && that.grid.store && that.maxBillRefs !== 0)
			{
				that.grid.store.fetch({ onBegin: function(total){ 
						if(total < that.maxBillRefs)
						{
							inherit = true;	
						}
						else
						{
							misys.dialog.show("ERROR",misys.getLocalization("maxBillReferenceReached"));
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
			console.debug("[PayeeRefs] addItem end");
		}
	}
);