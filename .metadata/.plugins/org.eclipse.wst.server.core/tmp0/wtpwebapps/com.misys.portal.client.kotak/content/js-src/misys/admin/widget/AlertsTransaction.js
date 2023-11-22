dojo.provide("misys.admin.widget.AlertsTransaction");
dojo.experimental("misys.admin.widget.AlertsTransaction"); 

dojo.require("misys.grid.GridMultipleItems");

// our declared class
dojo.declare("misys.admin.widget.AlertsTransaction",
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
			                       'account_num', 'credit_cur', 'credit_amt', 'debit_cur', 'debit_amt'];
			
			this.propertiesMap = {
					entity: {_fieldName: 'entity'},
		        	address: {_fieldName: 'address' + this.AlertType},
		        	alertlanguage: {_fieldName: 'alertlanguage' + this.AlertType},
		        	alert_type: {_fieldName: 'alert_type' + this.AlertType},
		        	bank_abbv_name: {_fieldName: 'bank_abbv_name' + this.AlertType},
		        	customer_abbv_name: {_fieldName: 'customer_abbv_name' + this.AlertType},
		        	account_num: {_fieldName: 'account_num' + this.AlertType},
		        	credit_cur: {_fieldName: 'credit' + this.AlertType + '_cur_code'},
		        	credit_amt: {_fieldName: 'credit' + this.AlertType + '_amt'},
		        	debit_cur: {_fieldName: 'debit' + this.AlertType + '_cur_code'},
		        	debit_amt: {_fieldName: 'debit' + this.AlertType + '_amt'}
		        };
			
			if (this.HasEntity === 'Y')
			{
				this.gridColumns.push('entity');
				this.layout= [ { name: 'Entity', field: 'entity', width: '25%' ,noresize:true} ];
			}
			
			this.layout.push({ name: 'AccountNum', get: misys.getAccountLabel, width: '20%' ,noresize:true});
			this.layout.push({ name: 'Credit', get: misys.getCredit, width: '15%' ,noresize:true});
			this.layout.push({ name: 'Debit', get: misys.getDebit, width: '15%' ,noresize:true});
			
			if (this.isBank === 'Y')
			{
				this.gridColumns.push('customer_abbv_name');
				this.layout.push({ name: 'Customer', field: 'customer_abbv_name', width: '15%',noresize:true });
			}
			
			if (this.AlertType!=='03')
			{
				this.layout.push({ name: 'Address', get: misys.getAddressLabel, width: '15%',noresize:true });
			}
			this.layout.push({ name: ' ', field: 'actions', formatter: misys.grid.formatActions, width: '5%',noresize:true });
			
			this.templateString = dojo.byId('alerts'+this.AlertType+'-template').innerHTML;
			
			
			
			// Display column description in the user's language
			//this.layout[1].field = 'label_' + language;

			// Prepare data store
			this.dataList = [];
			if(this.hasChildren())
			{
								
				dojo.forEach(this.getChildren(), function(child){
					var item;
//					if (this.HasEntity == 'Y')
//					{
						item = { entity: child.get('entity'),
							     address: child.get('address'),
							     alertlanguage: child.get('alertlanguage'),
							     alert_type: child.get('alert_type'),
							     tnx_type_code: child.get('tnx_type_code'),
							     bank_abbv_name: child.get('bank_abbv_name'),
							     account_num: child.get('account_num'),
							     credit_cur: child.get('credit_cur'),
							     credit_amt: child.get('credit_amt'),
							     debit_cur: child.get('debit_cur'),
							     debit_amt: child.get('debit_amt')
								};
						
//					}
//					else
//					{
//						item = { address: child.get('address'),
//							     alertlanguage: child.get('alertlanguage'),
//							     alert_type: child.get('alert_type'),
//							     tnx_type_code: child.get('tnx_type_code'),
//							     issuer_abbv_name: child.get('issuer_abbv_name'),
//							     account_num: child.get('account_num'),
//							     credit_cur: child.get('credit_cur'),
//							     credit_amt: child.get('credit_amt'),
//							     debit_cur: child.get('debit_cur'),
//							     debit_amt: child.get('debit_amt')
//								};
//					}
					this.dataList.push(item);
				}, this);
			}
			
    		this.inherited(arguments);
			console.debug("[Alerts] startup end");
    	}
    	
       }
);