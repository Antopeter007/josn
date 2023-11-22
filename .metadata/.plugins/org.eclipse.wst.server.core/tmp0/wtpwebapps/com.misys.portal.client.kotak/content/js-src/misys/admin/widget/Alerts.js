dojo.provide("misys.admin.widget.Alerts");
dojo.experimental("misys.admin.widget.Alerts"); 
dojo.require("misys.grid.DataGrid");
dojo.require("misys.grid.GridMultipleItems");

// our declared class:
dojo.declare("misys.admin.widget.Alerts",
        [ misys.grid.GridMultipleItems ],
        // class properties:
        {
		data: { identifier: 'store_id', label: 'store_id', items: [] },
        templatePath: null,
        templateString: dojo.byId('alerts01-template').innerHTML,
        
        gridColumns: [],
        AlertType: '',
        HasEntity: '',
        propertiesMap: {},
        isBank: '',
        
        layout: [],
 
    	startup: function(){
			console.debug("[Alerts] startup start");
			
			this.layout = [];
			
			this.gridColumns = ['prod_code', 'sub_prod_code', 'address', 'alertlanguage', 'alert_type', 'tnx_type_code', 'issuer_abbv_name',
			                       'tnx_amount_sign', 'tnx_currency', 'tnx_amount', 'prod_stat_code'];
			
			this.propertiesMap = {
					entity: {_fieldName:'entity'},
		        	prod_code: {_fieldName:'prod_code' + this.AlertType},
		        	sub_prod_code: {_fieldName:'sub_prod_code' + this.AlertType},
		        	address: {_fieldName:'address' + this.AlertType},
		        	alertlanguage: {_fieldName:'alertlanguage' + this.AlertType},
		        	alert_type: {_fieldName:'alert_type' + this.AlertType},
		        	tnx_type_code: {_fieldName:'tnx_type_code' + this.AlertType},
		        	issuer_abbv_name: {_fieldName:'issuer_abbv_name' + this.AlertType},
		        	customer_abbv_name: {_fieldName:'customer_abbv_name' + this.AlertType},
		        	tnx_amount_sign: {_fieldName:'tnx_amount_sign' + this.AlertType},
		        	tnx_currency: {_fieldName:'tnx_currency' + this.AlertType},
		        	tnx_amount: {_fieldName:'tnx_amount' + this.AlertType},
		        	prod_stat_code: {_fieldName:'prod_stat_code' + this.AlertType}
		        	
		        };
			
			if (this.HasEntity === 'Y')
			{
				this.gridColumns.push('entity');
				this.layout= [ { name: 'Entity', field: 'entity', width: '10%' ,noresize:true} ];
			}
			
			this.layout.push({ name: 'ProductCode', field: 'prod_code', get: misys.getProductLabel, width: '10%' ,noresize:true});
			this.layout.push({ name: 'SubProductCode', field: 'sub_prod_code', get: misys.getSubProductLabel, width: '10%' ,noresize:true});
			this.layout.push({ name: 'TnxTypeCode', field: 'tnx_type_code', get: misys.getTypeLabel, width: '5%' ,noresize:true});			
			this.layout.push({ name: 'ProdStatCode', field: 'prod_stat_code', get: misys.getProdStatCode, width: '10%' ,noresize:true});
			
			if (this.isBank === 'Y')
			{
				this.gridColumns.push('customer_abbv_name');
				this.layout.push({ name: 'Customer', field: 'customer_abbv_name', width: '15%' ,noresize:true});
			}
			
			this.layout.push({ name: 'Amount', field: 'tnx_amount', get: misys.getAmountLabel, width: '10%' ,noresize:true});
			if (this.AlertType!=='03')
			{
				this.layout.push({ name: 'Address', field: 'address', get: misys.getAddressLabel, width: '15%',noresize:true });
			}
			this.layout.push({ name: ' ', field: 'actions', formatter: misys.grid.formatReportActions, width: '5%' ,noresize:true});
			
			this.templateString = dojo.byId('alerts'+this.AlertType+'-template').innerHTML;
			
			
			
			// Display column description in the user's language
			//this.layout[1].field = 'label_' + language;

			// Prepare data store
			this.dataList = [];
			if(this.hasChildren())
			{
								
				dojo.forEach(this.getChildren(), function(child){
					var item;
					if (this.HasEntity === 'Y')
					{
						item = { entity: child.get('entity'),
								 prod_code: child.get('prod_code'),
								 sub_prod_code: child.get('sub_prod_code'),
							     address: child.get('address'),
							     alertlanguage: child.get('alertlanguage'),
							     alert_type: child.get('alert_type'),
							     tnx_type_code: child.get('tnx_type_code'),
							     issuer_abbv_name: child.get('issuer_abbv_name'),
								 tnx_amount_sign: child.get('tnx_amount_sign'),
								 tnx_currency: child.get('tnx_currency'),
								 tnx_amount: child.get('tnx_amount'),
								 prod_stat_code: child.get('prod_stat_code')
								};
						
					}
					else
					{
						item = { prod_code: child.get('prod_code'),
								 sub_prod_code: child.get('sub_prod_code'),
							     address: child.get('address'),
							     alertlanguage: child.get('alertlanguage'),
							     alert_type: child.get('alert_type'),
							     tnx_type_code: child.get('tnx_type_code'),
							     issuer_abbv_name: child.get('issuer_abbv_name'),
							     customer_abbv_name: child.get('customer_abbv_name'),
								 tnx_amount_sign: child.get('tnx_amount_sign'),
								 tnx_currency: child.get('tnx_currency'),
								 tnx_amount: child.get('tnx_amount'),
								 prod_stat_code: child.get('prod_stat_code')
								};
					}
					this.dataList.push(item);
				}, this);
			}
			
    		this.inherited(arguments);
			console.debug("[Alerts] startup end");
    	},
    	openDialogFromExistingItem: function(items, request)
		{
    		misys._config = misys._config || {};
    		misys._config.alerts = {};
    		dojo.mixin(misys._config.alerts,{
    			tempSubProductCode : items[0].sub_prod_code[0],
    			tempProdStatCode : items[0].prod_stat_code[0],
    			tempTypeCode : items[0].tnx_type_code[0]
    		});
    		this.inherited(arguments);
    		
    		if(dijit.byId('is_customer') && dijit.byId('is_customer').get('value') === 'N'){
    			dijit.byId('issuer_abbv_name01_4').set('checked',true);
    			dijit.byId('issuer_abbv_name01_4').set('disabled',true);
     		}
    		if(dijit.byId('issuer_abbv_name01_4')){
    			if(dijit.byId('issuer_abbv_name01_4').get('checked')){
    				misys.toggleFields(true, ["alertlanguage01", "address01"],
    						["alertlanguage01", "address01"]);
    				misys.animate("fadeIn", dojo.byId("language-address-id-01"));
    			}else{
    				misys.toggleFields(false, ["alertlanguage01", "address01"],
    						["alertlanguage01", "address01"]);
    				misys.animate("fadeOut", dojo.byId("language-address-id-01"));	
    			}
			}else if(!dijit.byId('issuer_abbv_name01_4')){
				misys.toggleFields(false, ["alertlanguage01", "address01"],
						["alertlanguage01", "address01"]);
				misys.animate("fadeOut", dojo.byId("language-address-id-01"));
			}
    		if(dijit.byId('is_customer') && dijit.byId('is_customer').get('value') === 'N'){
    			misys.animate("fadeOut", dojo.byId("issuer_abbv_name01_4_row"));
    		}
    		
			if(dijit.byId('issuer_abbv_name01_5')){
    			if(dijit.byId('issuer_abbv_name01_5').get('checked'))
    			{
					misys.animate("fadeIn", dojo.byId("contact-person-id-01"));
					if(dijit.byId("contact_person01"))
					{
						if( dijit.byId('01entity') && dijit.byId('01entity').get('value') !== '')
						{
							dijit.byId('contact_person01').set('value',misys._config.entityEmailCollection[dijit.byId('01entity').get('value')].alertContactPerson);
							dijit.byId('contact_address01').set('value',misys._config.entityEmailCollection[dijit.byId('01entity').get('value')].alertEmail);
						}
						else if(dijit.byId('01entity')  && dijit.byId('01entity').get('value') === '')
						{
							dijit.byId('contact_person01').set('value','');
							dijit.byId('contact_address01').set('value','');
						}
						else
						{
							dijit.byId('contact_person01').set('value',misys._config.entityEmailCollection['*'].alertContactPerson);
							dijit.byId('contact_address01').set('value',misys._config.entityEmailCollection['*'].alertEmail);
						}
					}
    			}
				else
				{
    				misys.animate("fadeOut", dojo.byId("contact-person-id-01"));	
    			}
			}else if(!dijit.byId('issuer_abbv_name01_5')){
				misys.animate("fadeOut", dojo.byId("contact-person-id-01"));
			}
		},
		addItem: function()
		{
    		this.inherited(arguments);
    		if(dijit.byId('is_customer') && dijit.byId('is_customer').get('value') === 'N'){
    			dijit.byId('issuer_abbv_name01_4').set('checked',true);
    			dijit.byId('issuer_abbv_name01_4').set('disabled',true);
     		}
    		if(dijit.byId('issuer_abbv_name01_4')){
    			if(dijit.byId('issuer_abbv_name01_4').get('checked')){
    				misys.toggleFields(true, ["alertlanguage01", "address01"],
    						["alertlanguage01", "address01"]);
    				misys.animate("fadeIn", dojo.byId("language-address-id-01"));
    			}else{
    				misys.toggleFields(false, ["alertlanguage01", "address01"],
    						["alertlanguage01", "address01"]);
    				misys.animate("fadeOut", dojo.byId("language-address-id-01"));	
    			}
			}else if(!dijit.byId('issuer_abbv_name01_4')){
				misys.toggleFields(false, ["alertlanguage01", "address01"],
						["alertlanguage01", "address01"]);
				misys.animate("fadeOut", dojo.byId("language-address-id-01"));
			}
    		if(dijit.byId('is_customer') && dijit.byId('is_customer').get('value') === 'N'){
    			misys.animate("fadeOut", dojo.byId("issuer_abbv_name01_4_row"));
    		}
    		
			if(dijit.byId('issuer_abbv_name01_5')){
    			if(dijit.byId('issuer_abbv_name01_5').get('checked')){
				misys.animate("fadeIn", dojo.byId("contact-person-id-01"));
    			}else{
    				misys.animate("fadeOut", dojo.byId("contact-person-id-01"));	
    			}
			}else if(!dijit.byId('issuer_abbv_name01_5')){
				misys.animate("fadeOut", dojo.byId("contact-person-id-01"));
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
				rowsPerPage: 3000,
				initialWidth: '100%',
				canSort: function(col){
				//Removing sorting from the actions column. We have to check for the column index in this method, 
				//cant check the column name as it passes only index of the column clicked.
					 if(Math.abs(col) === 8) {
						    return false;
						  } else {
						    return true;
						  }
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
		}
    	
    	
       }
);