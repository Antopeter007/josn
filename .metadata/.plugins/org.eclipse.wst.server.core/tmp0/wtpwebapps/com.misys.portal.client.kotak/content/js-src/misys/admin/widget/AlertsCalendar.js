dojo.provide("misys.admin.widget.AlertsCalendar");
dojo.experimental("misys.admin.widget.AlertsCalendar"); 

dojo.require("misys.grid.GridMultipleItems");

// our declared class
dojo.declare("misys.admin.widget.AlertsCalendar",
        [ misys.grid.GridMultipleItems ],
        // class properties:
        {
		data: { identifier: 'store_id', label: 'store_id', items: [] },
        templatePath: null,
        templateString: dojo.byId('alerts01-template').innerHTML,
        
        gridColumns: ['prod_code', 'address', 'alertlanguage', 'alert_type', 'date_code', 'offset', 'offsetsign', 'issuer_abbv_name'],
        AlertType: '',
        HasEntity: '',
        isBank: '',
        propertiesMap: {},
        
        layout: [],
    	
    	startup: function(){
			console.debug("[Alerts] startup start");
			this.layout=[];
			if (this.HasEntity == 'Y')
			{
				this.gridColumns.push('entity');
				this.layout= [ { name: 'Entity', field: 'entity', width: '15%' ,noresize:true} ];
			}
			
			this.layout.push({ name: 'ProductCode', field: 'prod_code', get: misys.getProductLabel, width: '10%' ,noresize:true});
			this.layout.push({ name: 'Date', field: 'date_code', get: misys.getDateLabel, width: '10%' ,noresize:true});
			
 			if (this.isBank == 'Y')
			{
				this.gridColumns.push('customer_abbv_name');
				this.layout.push({ name: 'Customer', field: 'customer_abbv_name', width: '15%' ,noresize:true});
			}
 			
 			this.layout.push({ name: 'Address', field: 'address', get: misys.getAddressLabel, width: '10%' ,noresize:true});
 			this.layout.push({ name: ' ', field: 'actions', formatter: misys.grid.formatReportActions, width: '5%' ,noresize:true});
 			
			this.templateString = dojo.byId('alerts'+this.AlertType+'-template').innerHTML;
			
			this.propertiesMap = {
		        	prod_code: {_fieldName:'prod_code' + this.AlertType},
		        	customer_abbv_name: {_fieldName:'customer_abbv_name' + this.AlertType},
		        	address: {_fieldName:'address' + this.AlertType},
		        	alertlanguage: {_fieldName:'alertlanguage' + this.AlertType},
		        	alert_type: {_fieldName:'alert_type' + this.AlertType},
		        	date_code: {_fieldName:'date_code' + this.AlertType},
		        	offset: {_fieldName:'offset' + this.AlertType},
		        	offsetsign: {_fieldName:'offsetsign' + this.AlertType},
		        	issuer_abbv_name: {_fieldName:'issuer_abbv_name' + this.AlertType}
		        };
			
			// Display column description in the user's language
			//this.layout[1].field = 'label_' + language;

			// Prepare data store
			this.dataList = [];
			if(this.hasChildren())
			{
				dojo.forEach(this.getChildren(), function(child){
					var item;
					if (this.HasEntity == 'Y')
					{
						item = { entity: child.get('entity'),
								 prod_code: child.get('prod_code'),
							     address: child.get('address'),
							     alertlanguage: child.get('alertlanguage'),
							     alert_type: child.get('alert_type'),
							     date_code: child.get('date_code'),
							     offset: child.get('offset'),
							     offsetsign: child.get('offsetsign'),
							     issuer_abbv_name: child.get('issuer_abbv_name')};
					}
					else
					{
						item = { prod_code: child.get('prod_code'),
								 customer_abbv_name: child.get('customer_abbv_name'),
							     address: child.get('address'),
							     alertlanguage: child.get('alertlanguage'),
							     alert_type: child.get('alert_type'),
							     date_code: child.get('date_code'),
							     offset: child.get('offset'),
							     offsetsign: child.get('offsetsign'),
							     issuer_abbv_name: child.get('issuer_abbv_name')};
					}
					this.dataList.push(item);
				}, this);
			}
			
    		this.inherited(arguments);
    		if(dojo.isIE){
    			if(dijit.byId("prod_code01")){
    				dojo.connect(dijit.byId("prod_code01"), "onClick", function(){
    					this.focus();
    					console.log("focused on prod01 code");
    				});
    			}
        		if(dijit.byId("date_code01")){
    				dojo.connect(dijit.byId("date_code01"), "onClick", function(){
    					this.focus();
    					console.log("focused on date01 code");
    				});
    			}
    			if(dijit.byId("prod_code02")){
    				dojo.connect(dijit.byId("prod_code02"), "onClick", function(){
    					this.focus();
    					console.log("focused on prod02 code");
    				});
    			}
    			if(dijit.byId("date_code02")){
    				dojo.connect(dijit.byId("date_code02"), "onClick", function(){
    					this.focus();
    					console.log("focused on date02 code");
    				});
    			}
    		}
			console.debug("[Alerts] startup end");
    	},
    	openDialogFromExistingItem: function(items, request)
		  {
			console.debug("[Alerts] openDialogFromExistingItem overridden method start");
			var item = items[0];
			misys._config.currentSelectedCalendarAlertItem = item;
			this.inherited(arguments);	
			console.debug("[Alerts] openDialogFromExistingItem overridden method end");
		  }
    	
       }
);