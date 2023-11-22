dojo.provide("misys.system.widget.Accounts");
dojo.experimental("misys.system.widget.Accounts"); 

dojo.require("misys.grid.GridMultipleItems");
dojo.require("misys.system.widget.AccountDataGrid");

//our declared class
dojo.declare("misys.system.widget.Accounts",
		[ misys.grid.GridMultipleItems ],
		// class properties:
		{
			data: { identifier: 'store_id', label: 'store_id', items: [] },
			templatePath: null,
			templateString: dojo.byId("accounts-template").innerHTML,
			dialogId: 'account-dialog-template',
			xmlTagName: 'accounts',
			xmlSubTagName: 'account',
			viewMode: 'edit',
			
			gridColumns: ['account_number','nickname','account_name','bank_abbv_name','displayed_owner_type','owner_type','type','ccy','nra','description','account_product_type','cust_account_type','bank_id','branch_code','account_type','existing_bib_account',
			              'created_dttm','routing_bic','customer_reference', 'actv_flag', 'start_date', 'end_date', 'principal_amount', 'maturity_amount', 'interest_rate_credit', 'interest_rate_debit', 'interest_rate_maturity','settlement_means','sweeping_enabled','pooling_enabled', 'charge_account_for_liq'],
	        
			propertiesMap: {
				account_number: {_fieldName: 'account_number'},
				nickname : {_fieldName:'nickname'},
				account_name: {_fieldName:'account_name'},
				bank_abbv_name: {_fieldName: 'bank_abbv_name'},
				owner_type: {_fieldName: 'owner_type'},
				displayed_owner_type: {_fieldName: 'displayed_owner_type'},
				type: {_fieldName: 'bank_account_type'},
				ccy: {_fieldName: 'account_ccy_cur_code'},
				description:{_fieldName: 'account_desc'},
				nra: {_fieldName: 'account_nra'},
				account_product_type: {_fieldName: 'account_product_type'},
				cust_account_type:{_fieldName:'cust_account_type'},
				bank_id:{_fieldName:'bank_id'},
				branch_code:{_fieldName:'branch_code'},
				account_type:{_fieldName:'account_type'},
				created_dttm: {_fieldName:'created_dttm'},
				routing_bic: {_fieldName:'routing_bic'},
				customer_reference: {_fieldName:'customer_reference'},
				actv_flag: {_fieldName:'act_actv_flag'},
				start_date: {_fieldName:'start_date'},
				end_date: {_fieldName:'end_date'},
				principal_amount: {_fieldName:'principal_amount'},
				maturity_amount: {_fieldName:'maturity_amount'},
				interest_rate_credit: {_fieldName:'interest_rate_credit'},
				interest_rate_debit: {_fieldName:'interest_rate_debit'},
				interest_rate_maturity: {_fieldName:'interest_rate_maturity'},
				settlement_means: {_fieldName:'settlement_means'},
				sweeping_enabled:{_fieldName:'sweeping_enabled'},
				pooling_enabled:{_fieldName:'pooling_enabled'},
				charge_account_for_liq:{_fieldName:'charge_account_for_liq'}
				},
	        
			layout: [],
			resetDialog : function(){
				console.log("Accounts from Accounts widget");
				var widgets = this.dialog.getChildren();
				dojo.forEach(widgets, function(widget){
					var declaredClass = widget.declaredClass;
					switch(declaredClass)
					{
						case 'dijit.form.RadioButton':
							widget.set('checked', false);
							break;
						case 'dijit.form.CheckBox':
							widget.set('checked', false);
							break;
						case 'dijit.form.DateTextBox':
							widget.set('value', null);
							break;
						default:
							// for hidden fields, do not reset the value
							if (widget.get('type') === 'hidden'){
								break;
							}
							widget.set('value', '');
							widget.state = '';
							if(widget._setStateClass){
								widget._setStateClass();
							}
							break;
					}
					//remove blurred of validation
					widget._hasBeenBlurred= false;
					// Clear also all grids
					if (widget.grid && widget.grid.declaredClass === 'misys.grid.DataGrid')
					{
						widget.clear();
					}
				});
				if(this.dialog.gridMultipleItemsWidget)
				{
					this.dialog.gridMultipleItemsWidget = null;
				}
				if(this.dialog.storeId)
				{
					this.dialog.storeId = null;
				}
				
				for(var elm in this.handle){
					if(this.handle.hasOwnProperty(elm)){
						dojo.disconnect(this.handle[elm]);
					}
				}
				this.handle = [];
			
			},
			
			startup: function(){
				if(this._started) { return; }
				console.debug("[Accounts] startup start");
				
				// Prepare data store
				this.dataList = [];
				if(this.hasChildren())
				{
					dojo.forEach(this.getChildren(), function(child){
						var item = { name_: child.get('account_number_')};
						this.dataList.push(item);
					}, this);
				}
				//Only if company type is bank group show the bank column
				if(dijit.byId("multiBank") && dijit.byId("multiBank").get('value') === 'Y' && dijit.byId("account_delete_permission") && dijit.byId("account_delete_permission").get('value') === 'Y')
				{
					this.layout = [
								{ name: 'Account Number', field: 'account_number', width: '15%',noresize:true},
								{ name: 'Bank', field: 'bank_abbv_name', width: '15%',noresize:true},
								{ name: 'Account Owner Type', field: 'displayed_owner_type', width: '7%',noresize:true},
								{ name: 'Account Type', field: 'type', width: '7%',noresize:true},
								{ name: 'Account Product Type', field: 'account_product_type', width: '9%',noresize:true },
								{ name: 'Ccy', field: 'ccy', width: '5%',noresize:true },
								{ name: 'Description', field: 'description', width: '18%',noresize:true },
								{ name: 'Customer Account Type', field: 'cust_account_type', width: '7%',noresize:true },
								{ name: 'Bank Id', field: 'bank_id', width: '5%',noresize:true },
								{ name: 'Branch No', field: 'branch_code', width: '6%',noresize:true},
								{ name: 'NRA', field: 'nra', width: '4%',noresize:true },
								{ name: 'Customer Reference', field: 'customer_reference', width: '10%',noresize:true },
								{ name: 'Active', field: 'actv_flag', width: '5%',noresize:true },
								{ name: ' ', field: 'actions', formatter: misys.grid.formatReportActions, width: '7%' ,noresize:true},
								{ name: 'Id', field: 'store_id', headerStyles: 'display:none', cellStyles: 'display:none',noresize:true},
								{ name: 'nickname', field: 'nickname', headerStyles: 'display:none', cellStyles: 'display:none',noresize:true},
								{ name: 'Sweeping Enabled', field: 'sweeping_enabled', headerStyles: 'display:none', cellStyles: 'display:none',noresize:true},
								{ name: 'Pooling Enabled', field: 'pooling_enabled', headerStyles: 'display:none', cellStyles: 'display:none',noresize:true},
								{ name: 'Charge Account for Liquidity', field: 'charge_account_for_liq', headerStyles: 'display:none', cellStyles: 'display:none',noresize:true}
								];
				}
				else if(dijit.byId("multiBank") && dijit.byId("multiBank").get('value') === 'Y' && dijit.byId("account_delete_permission") && dijit.byId("account_delete_permission").get('value') === 'N')
				{
					this.layout = [
								{ name: 'Account Number', field: 'account_number', width: '15%',noresize:true},
								{ name: 'Bank', field: 'bank_abbv_name', width: '15%',noresize:true},
								{ name: 'Account Owner Type', field: 'displayed_owner_type', width: '7%',noresize:true},
								{ name: 'Account Type', field: 'type', width: '7%',noresize:true},
								{ name: 'Account Product Type', field: 'account_product_type', width: '9%',noresize:true },
								{ name: 'Ccy', field: 'ccy', width: '5%',noresize:true },
								{ name: 'Description', field: 'description', width: '18%',noresize:true },
								{ name: 'Customer Account Type', field: 'cust_account_type', width: '7%',noresize:true },
								{ name: 'Bank Id', field: 'bank_id', width: '5%',noresize:true },
								{ name: 'Branch No', field: 'branch_code', width: '6%',noresize:true},
								{ name: 'NRA', field: 'nra', width: '4%',noresize:true },
								{ name: 'Customer Reference', field: 'customer_reference', width: '10%',noresize:true },
								{ name: 'Active', field: 'actv_flag', width: '5%',noresize:true },
								{ name: ' ', field: 'actions', formatter: misys.grid.formatAccountActions, width: '7%' ,noresize:true},
								{ name: 'Id', field: 'store_id', headerStyles: 'display:none', cellStyles: 'display:none',noresize:true},
								{ name: 'nickname', field: 'nickname', headerStyles: 'display:none', cellStyles: 'display:none',noresize:true}
								];
				}
				else if (dijit.byId("account_delete_permission") && dijit.byId("account_delete_permission").get('value') === 'Y')
				{
					this.layout = [
									{ name: 'Account Number', field: 'account_number', width: '15%',noresize:true},
									{ name: 'Account Owner Type', field: 'displayed_owner_type', width: '7%',noresize:true},
									{ name: 'Account Type', field: 'type', width: '7%',noresize:true},
									{ name: 'Account Product Type', field: 'account_product_type', width: '9%',noresize:true },
									{ name: 'Ccy', field: 'ccy', width: '5%',noresize:true },
									{ name: 'Description', field: 'description', width: '18%',noresize:true },
									{ name: 'Customer Account Type', field: 'cust_account_type', width: '7%',noresize:true },
									{ name: 'Bank Id', field: 'bank_id', width: '5%',noresize:true },
									{ name: 'Branch No', field: 'branch_code', width: '6%',noresize:true},
									{ name: 'NRA', field: 'nra', width: '4%',noresize:true },
									{ name: 'Customer Reference', field: 'customer_reference', width: '10%',noresize:true },
									{ name: 'Active', field: 'actv_flag', width: '5%',noresize:true },
									{ name: ' ', field: 'actions', formatter: misys.grid.formatReportActions, width: '7%' ,noresize:true},
									{ name: 'Id', field: 'store_id', headerStyles: 'display:none', cellStyles: 'display:none',noresize:true},
									{ name: 'nickname', field: 'nickname', headerStyles: 'display:none', cellStyles: 'display:none',noresize:true},
									{ name: 'Sweeping Enabled', field: 'sweeping_enabled', headerStyles: 'display:none', cellStyles: 'display:none',noresize:true},
									{ name: 'Pooling Enabled', field: 'pooling_enabled', headerStyles: 'display:none', cellStyles: 'display:none',noresize:true},
									{ name: 'Charge Account for Liquidity', field: 'charge_account_for_liq', headerStyles: 'display:none', cellStyles: 'display:none',noresize:true}
									];
				}
				else
				{
					this.layout = [
									{ name: 'Account Number', field: 'account_number', width: '15%',noresize:true},
									{ name: 'Account Owner Type', field: 'displayed_owner_type', width: '7%',noresize:true},
									{ name: 'Account Type', field: 'type', width: '7%',noresize:true},
									{ name: 'Account Product Type', field: 'account_product_type', width: '9%',noresize:true },
									{ name: 'Ccy', field: 'ccy', width: '5%',noresize:true },
									{ name: 'Description', field: 'description', width: '18%',noresize:true },
									{ name: 'Customer Account Type', field: 'cust_account_type', width: '7%',noresize:true },
									{ name: 'Bank Id', field: 'bank_id', width: '5%',noresize:true },
									{ name: 'Branch No', field: 'branch_code', width: '6%',noresize:true},
									{ name: 'NRA', field: 'nra', width: '4%',noresize:true },
									{ name: 'Customer Reference', field: 'customer_reference', width: '10%',noresize:true },
									{ name: 'Active', field: 'actv_flag', width: '5%',noresize:true },
									{ name: ' ', field: 'actions', formatter: misys.grid.formatAccountActions, width: '7%' ,noresize:true},
									{ name: 'Id', field: 'store_id', headerStyles: 'display:none', cellStyles: 'display:none',noresize:true},
									{ name: 'nickname', field: 'nickname', headerStyles: 'display:none', cellStyles: 'display:none',noresize:true}
									];
				}
				if ((this.viewMode === 'view' || (dijit.byId("account_maintenance_permission") && dijit.byId("account_maintenance_permission").get("value") === 'N')) && (dijit.byId("multiBank") && dijit.byId("multiBank").get('value') === 'Y' || dijit.byId("owner_is_group") && dijit.byId("owner_is_group").get('value') === 'Y'))
				{
					this.layout = [
									{ name: 'Account Number', field: 'account_number', width: '15%',noresize:true},
									{ name: 'Bank', field: 'bank_abbv_name', width: '15%',noresize:true},
									{ name: 'Account Owner Type', field: 'displayed_owner_type', width: '6%',noresize:true},
									{ name: 'Account Type', field: 'type', width: '6%',noresize:true},
									{ name: 'Account Product Type', field: 'account_product_type', width: '9%',noresize:true },
									{ name: 'Ccy', field: 'ccy', width: '5%',noresize:true },
									{ name: 'Description', field: 'description', width: '20%',noresize:true },
									{ name: 'Customer Account Type', field: 'cust_account_type', width: '7%',noresize:true },
									{ name: 'Bank Id', field: 'bank_id', width: '5%',noresize:true},
									{ name: 'Branch No', field: 'branch_code', width: '5%',noresize:true },
									{ name: 'NRA', field: 'nra', width: '4%',noresize:true },
									{ name: 'Customer Reference', field: 'customer_reference', width: '10%',noresize:true },
									{ name: 'Active', field: 'actv_flag', width: '5%',noresize:true },
									{ name: 'Id', field: 'store_id', headerStyles: 'display:none', cellStyles: 'display:none',noresize:true },
									{ name: 'Sweeping Enabled', field: 'sweeping_enabled', headerStyles: 'display:none', cellStyles: 'display:none',noresize:true},
									{ name: 'Pooling Enabled', field: 'pooling_enabled', headerStyles: 'display:none', cellStyles: 'display:none',noresize:true},
									{ name: 'Charge Account for Liquidity', field: 'charge_account_for_liq', headerStyles: 'display:none', cellStyles: 'display:none',noresize:true}
									];
				}
				else if(this.viewMode === 'view' || (dijit.byId("account_maintenance_permission") && dijit.byId("account_maintenance_permission").get("value") === 'N'))
					{

					this.layout = [
									{ name: 'Account Number', field: 'account_number', width: '15%',noresize:true},
									{ name: 'Account Owner Type', field: 'displayed_owner_type', width: '6%',noresize:true},
									{ name: 'Account Type', field: 'type', width: '6%',noresize:true},
									{ name: 'Account Product Type', field: 'account_product_type', width: '9%',noresize:true },
									{ name: 'Ccy', field: 'ccy', width: '5%',noresize:true },
									{ name: 'Description', field: 'description', width: '20%',noresize:true },
									{ name: 'Customer Account Type', field: 'cust_account_type', width: '7%',noresize:true },
									{ name: 'Bank Id', field: 'bank_id', width: '5%',noresize:true},
									{ name: 'Branch No', field: 'branch_code', width: '5%',noresize:true },
									{ name: 'NRA', field: 'nra', width: '4%',noresize:true },
									{ name: 'Customer Reference', field: 'customer_reference', width: '10%',noresize:true },
									{ name: 'Active', field: 'actv_flag', width: '5%',noresize:true },
									{ name: 'Id', field: 'store_id', headerStyles: 'display:none', cellStyles: 'display:none',noresize:true },
									{ name: 'Sweeping Enabled', field: 'sweeping_enabled', headerStyles: 'display:none', cellStyles: 'display:none',noresize:true},
									{ name: 'Pooling Enabled', field: 'pooling_enabled', headerStyles: 'display:none', cellStyles: 'display:none',noresize:true},
									{ name: 'Charge Account for Liquidity', field: 'charge_account_for_liq', headerStyles: 'display:none', cellStyles: 'display:none',noresize:true}
									];
				
					
					}
				// Prepare data store
				this.dataList = [];
				if(this.hasChildren())
				{
					dojo.forEach(this.getChildren(), function(child){
						var item = { 
								account_number: child.get('account_number'),
								nickname : child.get('nickname'),
								account_name: child.get('account_name'),
								bank_abbv_name: child.get('bank_abbv_name'),
								displayed_owner_type: child.get('displayed_owner_type'),
								owner_type: child.get('owner_type'),
								type: child.get('type'),
								ccy: child.get('ccy'),
								nra: child.get('nra'),
								description: child.get('description'),
								account_product_type: child.get('account_product_type'),
								cust_account_type: child.get('cust_account_type'),
								bank_id: child.get('bank_id'),
								branch_code: child.get('branch_code'),
								account_type: child.get('account_type'),
								created_dttm: child.get('created_dttm'),
								routing_bic: child.get('routing_bic'),
								customer_reference: child.get('customer_reference'),
								actv_flag: child.get('actv_flag'),
								start_date: child.get('start_date'),
								end_date: child.get('end_date'),
								principal_amount: child.get('principal_amount'),
								maturity_amount: child.get('maturity_amount'),
								interest_rate_credit: child.get('interest_rate_credit'),
								interest_rate_debit: child.get('interest_rate_debit'),
								interest_rate_maturity: child.get('interest_rate_maturity'),
								settlement_means: child.get('settlement_means'),
								sweeping_enabled: child.get('sweeping_enabled'),
								pooling_enabled: child.get('pooling_enabled'),
								charge_account_for_liq: child.get('charge_account_for_liq')
								};
					    
						this.dataList.push(item);
					}, this);
				}
				
				
				this.inherited(arguments);
				misys.connect(this, 'onCellClick', this, this.handleGridAction);
				console.debug("[Accounts] startup end");
			},
			_retrieveAccounts: function()
			{
				console.debug("[Accounts] retrieve accounts for charging accounts");
				var storeItems = [];
				//fetch the store and its items
				this.grid.store.fetch({query: {store_id: '*'}, 
					onComplete: dojo.hitch(this, function(items, request){
						dojo.forEach(items, function(item){
								var value = item['account_number'];
								var ccy = item['ccy'];
								var owner_type = item['owner_type'];
								//RESTRICT TREASURY ACCOUNTS AS CHARGING ACCOUNTS
								if(owner_type != '10')
								{
								storeItems.push(
										{
										name: value,
										value: value,
										ccy: ccy
										});
								}
						}, this);
					if(dijit.byId('charge_account'))
						{	
							dijit.byId('charge_account').store = new dojo.data.ItemFileWriteStore({
								data: {
									identifier: "value",
									items: storeItems
								}
							});
						}
						console.debug("[Accounts] retrieve items"+items);
				})});
			},
			
			checkDialog : function()
			{
				this.inherited(arguments);
			},
			updateData: function()
			{
				console.debug("[Accounts] overridden call start");
				this.inherited(arguments);
				this._retrieveAccounts();
				
			},
			openDialogFromExistingItem: function(items, request)
			{
				console.debug("[Accounts] openDialogFromExistingItem start");
				
				// Disable dialog events
				misys.dialog.isActive = false;
				//Set to true if request is coming from an existing dialog.
				misys._config.isOpenDialog = true;
				var item = items[0];
				var bankAbbvName = "";
				var accountType = "";
				var prodType = "";
				var custRef = "";
				var custAccountType = "";
			
				// Check Dialog widget
				this.checkDialog();
			
				// Set dialog title
				if(this.overrideDisplaymode !== "view") {
					this.dialog.set('title', this.dialogUpdateItemTitle);
				} else {
					var viewItemTitle = this.dialogViewItemTitle || this.dialogUpdateItemTitle;
					this.dialog.set('title', viewItemTitle);
				}

				// Reset dialog fields
				this.resetDialog();
				
				// Attach current widget to dialog widget
				this.dialog.gridMultipleItemsWidget = this;
				
				this.dialog.execute = this.dialogExecute;
			
				// Attach current widget and store id to dialog widget
				this.dialog.gridMultipleItemsWidget = this;
				this.dialog.storeId = (dojo.isArray(item.store_id) ? item.store_id[0] : item.store_id);
				if(item.pooling_enabled[0]===''){
					dojo.style(dojo.byId("pooling_enabled_row"), 'display', 'none');
				} else{
					dojo.style(dojo.byId("pooling_enabled_row"), 'display', 'block');
				}
				if(item.sweeping_enabled[0]===''){
					dojo.style(dojo.byId("sweeping_enabled_row"), 'display', 'none');
				} else{
					dojo.style(dojo.byId("sweeping_enabled_row"), 'display', 'block');
				}
				if(item.charge_account_for_liq[0]===''){
					dojo.style(dojo.byId("charge_account_for_liq_row"), 'display', 'none');
				} else{
					dojo.style(dojo.byId("charge_account_for_liq_row"), 'display', 'block');
				}
				
				console.log(dojo.byId("sweeping_enabled_row"));
//				dojo.byId("sweeping_enabled_row").set('style','display:none');	
//				dojo.style(dojo.byId("sweeping_enabled_row"), 'display', 'none');
			
				// Populate the dialog
				var widgets = this.dialog.getChildren();
				for(var property in item)
				{
					var searchedWidgetId = (this.propertiesMap[property] && this.propertiesMap[property]._fieldName ? this.propertiesMap[property]._fieldName : property);
					if(property !== "store_id")
					{					
						dojo.some(widgets, function(widget){
							if(widget.id === searchedWidgetId || widget.name === searchedWidgetId)
							{
								var value = item[property];
								value = dojo.isArray(value) ? value[0] : value;
								
								if (this.overrideDisplaymode === "view") {
									// Being extra safe here in case of strange widget issues
									var displayStyle = (!value && value !== 0) ? "none" : "block";
									if(widget && widget.id && dojo.byId(widget.id + "_row")) {
										dojo.style(widget.id + "_row", "display", displayStyle);
									}
								}
								
								if (widget.isInstanceOf(misys.grid.GridMultipleItems))
		    					{
									// if widget contains grid, destroy it first
									if (widget.grid)
									{
										widget.grid.destroy();
									}
									// Create datalist
									
									if (dojo.isObject(value) && value._values && dojo.isArray(value._values))
									{
										widget.dataList = dojo.clone(value._values);
										widget.createDataStoreFromDataList();
										widget.createDataGrid();
										
										var key = item.store_id+'_'+property;
										if(this.handle && !this.handle[key]){
											this.handle[key] = misys.connect(this.dialog, "onShow", widget, "renderAll");
										}
									}
		    					}
								else
								{
			    					var declaredClass = widget.declaredClass;
			    					switch(declaredClass)
			    					{
			    						case 'dijit.form.DateTextBox':
			    							widget.set('displayedValue', value);
			    							break;
			    						case 'dijit.form.CheckBox':
			    							widget.set('checked', value === 'Y' ? true : false);
			    							break;
			    						case 'dijit.form.RadioButton':
			    							var radioDomNodes = dojo.query("[name='" + widget.name + "']", this.dialog.domNode);
			    							dojo.some(radioDomNodes, function(radioDomNode){
			    								var radioWidget = dijit.byNode(radioDomNode.parentNode);
			    								if (radioWidget.params.value === value)
			    								{
			    									radioWidget.set('checked', true);
			    									return true;
			    								}
			    							});
			    							break;
			    						case 'dijit.form.NumberTextBox':
			    							if (value != null && value !== '' && value !== 'NaN')
			    							{
			    								widget.set('value', value, false);
			    							}
			    							break;
			    							
			    						case 'misys.form.MultiSelect':
			    							widget.domNode.innerHTML = [];
			    							
			    							if(value !== "")
		    								{
			    								var arr = value.split(",");
			    								for(var i=0;i<arr.length;i++)
		    									{
			    									var op = dojo.create("option");
			    									op.innerHTML =  arr[i];
			    									op.value = arr[i];
			    									widget.domNode.appendChild(op);
		    									}
		    								}
			    							
			    							break;
			    							
			    						default:
			    							widget.set('value', value);
			    						if(widget.id === 'bank_abbv_name')
			    							{
			    								bankAbbvName = value;
			    							}
			    						if(widget.id === 'bank_account_type')
			    							{
			    								accountType = value;
			    							}
			    						if(widget.id === 'account_product_type')
			    							{
			    								prodType = value;
			    							}
			    						if(widget.id === 'sweeping_enabled')
		    							{
		    								prodType = value;
		    							}
			    						if(widget.id === 'pooling_enabled')
		    							{
		    								prodType = value;
		    							}
			    						if(widget.id === 'charge_account_for_liq')
		    							{
		    								prodType = value;
		    							}
			    						if(widget.id === 'customer_reference')
			    							{
			    								custRef = value;
			    							}
			    						if(widget.id === 'cust_account_type')
			    							{
				    							custAccountType = value;
			    							}
			    							break;
			    					}
			    					if (this.overrideDisplaymode === 'view'){
										widget.set("readOnly", true);
									}
			    					return true;
								}
							}
							return false;
						}, this);
					}
				}
					//This code is for a special behavior for Bank Group login, A valid store has to be created before setting any value to the dropdowns.
					if(misys._config.isBankGroupLogin)
					{
						if(misys._config.accountTypesPerBank && dijit.byId("bank_account_type") && bankAbbvName !== "")
						{
							var accountTypeStore= misys._config.accountTypesPerBank[bankAbbvName];
							if (accountTypeStore)
							{
								
								dijit.byId("bank_account_type").store = new dojo.data.ItemFileReadStore(
								{
									data :
									{
										identifier : "value",
										label : "name",
										items : accountTypeStore
									}
								});
								dijit.byId("bank_account_type").fetchProperties =
								{
									sort : [
									{
										attribute : "name"
									} ]
								};
							}
							dijit.byId("bank_account_type").set('value',accountType);
						}
					
					if(misys._config.productTypesPerBank && dijit.byId("account_product_type") && bankAbbvName !== "")
					{										
						var productTypeStore= misys._config.productTypesPerBank[bankAbbvName];
						
						if (productTypeStore)
						{
							
							dijit.byId("account_product_type").store = new dojo.data.ItemFileReadStore(
							{
								data :
								{
									identifier : "value",
									label : "name",
									items : productTypeStore
								}
							});
							dijit.byId("account_product_type").fetchProperties =
							{
								sort : [
								{
									attribute : "name"
								} ]
							};
						}
						dijit.byId("account_product_type").set('value',prodType);
						
					}
					
					if(misys._config.custRefPerBank && dijit.byId("customer_reference") && bankAbbvName !== "")
					{					
						var custRefStore= misys._config.custRefPerBank[bankAbbvName];
						
						if (custRefStore)
						{
							
							dijit.byId("customer_reference").store = new dojo.data.ItemFileReadStore(
									{
										data :
										{
											identifier : "value",
											label : "name",
											items : custRefStore
										}
									});
							dijit.byId("customer_reference").fetchProperties =
							{
								sort : [
								{
									attribute : "name"
								} ]
							};
						}
						dijit.byId("customer_reference").set('value',custRef);
					}
					
					if(misys._config.customerAccountTypesPerBank && dijit.byId("cust_account_type") && bankAbbvName !== "")
					{					
						var custAccountStore= misys._config.customerAccountTypesPerBank[bankAbbvName];
						
						if (custAccountStore)
						{
							
							dijit.byId("cust_account_type").store = new dojo.data.ItemFileReadStore(
									{
										data :
										{
											identifier : "value",
											label : "name",
											items : custAccountStore
										}
									});
							dijit.byId("cust_account_type").fetchProperties =
							{
								sort : [
								{
									attribute : "name"
								} ]
							};
						}
						dijit.byId("cust_account_type").set('value',custAccountType);
					}
					
				}
				
				// Execute init function if required
				if (this.openDialogFromExistingItemInitFunction != null)
				{
					this.openDialogFromExistingItemInitFunction(item);
				}
				
				// Show the dialog
				this.dialog.show();
				
				// Activate dialog events
				setTimeout(dojo.hitch(this, "activateDialog"), 500);
				
				// If the row is inValid, then fire the full validation
				if (item.hasOwnProperty("is_valid")) {
					var isValid = (dojo.isArray(item.is_valid)) ? item.is_valid[0] : item.is_valid;
					if(isValid !== "Y") {
						this.validateDialog(true);
					}
	            }

				console.debug("[GridMultipleItems] openDialogFromExistingItem end");
			},
			
			activateDialog: function(){
				console.debug("[Accounts] activateDialog start");
				misys.dialog.isActive = true;
				//To check if request is from a dialog, make it false after some time
				misys._config.isOpenDialog = false;
			},
			createDataGrid: function()
			{
				var gridId = this.gridId;
				if(gridId === '')
				{
					gridId = 'grid-' + (this.xmlTagName !== '' ? this.xmlTagName + '-' : '') + dojox.uuid.generateRandomUuid();
				}
				this.grid = new misys.system.widget.AccountsDataGrid({
					jsId: gridId,
					id: gridId,
					store: this.store,
					structure: this.layout,
					autoHeight: true,
					selectionMode: 'multiple',
					columnReordering: true,
					autoWidth: true,
					canSort: function(){
						return true;
					},
					showMoveOptions:  this.showMoveOptions,
					initialWidth: '100%'
				}, document.createElement("div"));
				this.grid.gridMultipleItemsWidget = this;
				this.addChild(this.grid);
				this.onGridCreate();
			}
		}
);