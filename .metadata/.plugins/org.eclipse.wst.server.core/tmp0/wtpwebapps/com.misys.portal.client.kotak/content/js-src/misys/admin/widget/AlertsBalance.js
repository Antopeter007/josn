dojo.provide("misys.admin.widget.AlertsBalance");
dojo.experimental("misys.admin.widget.AlertsBalance"); 

dojo.require("misys.grid.GridMultipleItems");

// our declared class
dojo.declare("misys.admin.widget.AlertsBalance",
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
			
			this.gridColumns = ['address', 'alertlanguage', 'alert_type', 'bank_abbv_name',
			                       'account_num', 'threshold_cur', 'threshold_amt', 'threshold_sign'];
			
			this.propertiesMap = {
					entity: {_fieldName: 'entity'},
		        	address: {_fieldName: 'address' + this.AlertType},
		        	alertlanguage: {_fieldName: 'alertlanguage' + this.AlertType},
		        	alert_type: {_fieldName: 'alert_type' + this.AlertType},
		        	bank_abbv_name: {_fieldName: 'bank_abbv_name' + this.AlertType},
		        	customer_abbv_name: {_fieldName: 'customer_abbv_name' + this.AlertType},
		        	account_num: {_fieldName: 'account_num' + this.AlertType},
		        	threshold_cur: {_fieldName: 'threshold' + this.AlertType + '_cur_code'},
		        	threshold_amt: {_fieldName: 'threshold' + this.AlertType + '_amt'},
		        	threshold_sign: {_fieldName: 'threshold_sign' + this.AlertType}
		        };
			
			if (this.HasEntity === 'Y')
			{
				this.gridColumns.push('entity');
				this.layout= [ { name: 'Entity', field: 'entity', width: '25%' ,noresize:true} ];
			}
			
			this.layout.push({ name: 'AccountNum', get: misys.getAccountLabel, width: '20%' ,noresize:true});
			this.layout.push({ name: 'Threshold', get: misys.getThresholdCode, width: '15%' ,noresize:true});
			
			if (this.isBank === 'Y')
			{
				this.gridColumns.push('customer_abbv_name');
				this.layout.push({ name: 'Customer', field: 'customer_abbv_name', width: '15%' ,noresize:true});
			}
			
			if (this.AlertType!=='03')
			{
				this.layout.push({ name: 'Address', get: misys.getAddressLabel, width: '15%',noresize:true });
			}
			//this.layout.push({ name: ' ', field: 'actions', formatter: misys.grid.formatActions, width: '5%',noresize:true });
			
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
					if (this.HasEntity == 'Y')
					{
						item = { entity: child.get('entity'),
							     address: child.get('address'),
							     alertlanguage: child.get('alertlanguage'),
							     alert_type: child.get('alert_type'),
							     bank_abbv_name: child.get('bank_abbv_name'),
							     account_num: child.get('account_num'),
								 threshold_cur: child.get('threshold_cur'),
								 threshold_amt: child.get('threshold_amt'),
								 threshold_sign: child.get('threshold_sign')
								};
						
					}
					else
					{
						item = { address: child.get('address'),
							     alertlanguage: child.get('alertlanguage'),
							     alert_type: child.get('alert_type'),
							     issuer_abbv_name: child.get('issuer_abbv_name'),
							     account_num: child.get('account_num'),
								 threshold_cur: child.get('threshold_cur'),
								 threshold_amt: child.get('threshold_amt'),
								 threshold_sign: child.get('threshold_sign')
								};
					}
					this.dataList.push(item);
				}, this);
			}
			if(dojo.isIE){
				if(dijit.byId("alertlanguage01")){
    				dojo.connect(dijit.byId("alertlanguage01"), "onClick", function(){
    					this.focus();
    				});
    			}
			}
    		this.inherited(arguments);
			console.debug("[Alerts] startup end");
    	}
    	
       }
);