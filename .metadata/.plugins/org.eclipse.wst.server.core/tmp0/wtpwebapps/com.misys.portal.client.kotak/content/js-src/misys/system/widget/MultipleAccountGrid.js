dojo.provide("misys.system.widget.MultipleAccountGrid");
dojo.experimental("misys.system.widget.MultipleAccountGrid"); 

dojo.require("misys.grid.GridMultipleItems");
dojo.require("misys.system.widget.AccountDataGrid");

dojo.declare("misys.system.widget.MultipleAccountGrid",
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
			gridColumns: ['account_number','type','ccy','nra','description','account_product_type','cust_account_type','bank_id','branch_code','account_type','existing_bib_account','created_dttm','routing_bic','nickname','actv_flag','sweeping_enabled','pooling_enabled','charge_account_for_liq'],
			//property map represents each row of the child grid
			propertiesMap: {
				account_number: {_fieldName: 'account_number'},
				type: {_fieldName: 'type'},
				ccy: {_fieldName: 'ccy'},
				description:{_fieldName: 'description'},
				nra: {_fieldName: 'nra'},
				account_product_type: {_fieldName: 'account_product_type'},
				cust_account_type:{_fieldName:'cust_account_type'},
				bank_id:{_fieldName:'bank_id'},
				branch_code:{_fieldName:'branch_code'},
				account_type:{_fieldName:'account_type'},
				existing_bib_account:{_fieldName:'existing_bib_account'},
				created_dttm: {_fieldName:'created_dttm'},
				routing_bic: {_fieldName:'routing_bic'},
				actv_flag: {_fieldName:'actv_flag'},
				sweeping_anabled: {_fieldName:'sweeping_enabled'},
				pooling_enabled: {_fieldName:'pooling_enabled'},
				charge_account_for_liq: {_fieldName:'charge_account_for_liq'}
				},
			
			layout: [],
			_itemFields: null,
			//create a store for the accounts from interface
			_createStoreMultipleAccountGrid: function(){
			       var legalIdType = dijit.byId('legal_id_type').getValue(),
					legalIdNo = dijit.byId('legal_id_no').getValue(),
					legalCountryNo =  dijit.byId('country_legalid').getValue(),
					cif = dijit.byId('reference').getValue(),
					store = new dojo.data.ItemFileWriteStore(
							{
								jsId:"multipleAccounts",
								url: misys.getServletURL("/screen/AjaxScreen/action/GetMultipleAccountsForCIF?legal_id_type="+legalIdType+"&legal_id_no="+legalIdNo+"&legal_country_no="+legalCountryNo+"&reference="+cif)
							});
			     //assign the store to the account interface grid
			      dijit.byId('account-interface-grid').setStore(store);
			      //disable the existing accounts already exists in the portal
			      this._disableExistingAccountsForSelection();
		    },
		    onCompleteGrid1 : function(items, request){

					dojo.forEach(items, function(item){
						var value = item['account_number'][0];
						// parse the list of item for the child grid 
						        dijit.byId('account-interface-grid').store.fetch({query: {store_id: '*'},
						        	      onComplete: function(childItems,request){
						        	    	         var rowIndex = 0;
						        	    	        dojo.forEach(childItems, function(childItem){
						        	    	        	var childAcctId = childItem['account_number'][0];
						        	    	        	//check if the childAcctId is same as parent one
						        	    	        	  if(value === childAcctId)
						        	    	        	  {
						        	    	        		  dijit.byId('account-interface-grid').store.setValue(childItem,'existing_bib_account','Yes');
						        	    	        		  dijit.byId('account-interface-grid').rowSelectCell.setDisabled(rowIndex, true);
						        	    	        	  }
						        	    	        	  rowIndex++;
						        	    	        });
						       }});
					});
		
		    },
		    _disableExistingAccountsForSelection: function(){
		    	//parse the each account number present in the parent grid to check duplicates
		    	if(this.grid)
		    	{
		    		this.grid.store.fetch({query: {store_id: '*'}, onComplete: this.onCompleteGrid1 });
		    		dijit.byId('account-interface-grid').store.save();
		    	}
		    	
		    },
			 
	        addItem: function(event)
			{
	        	if(!((dijit.byId('legal_id_type').getValue() === '') || (dijit.byId('legal_id_no').getValue() === '') || 
	        			(dijit.byId('country_legalid').getValue() === '') || (dijit.byId('reference').getValue() === '')))
	        	{

	        	this.dialogId='account-dialog-template';
	        	this._createStoreMultipleAccountGrid();
	        	this.inherited(arguments);
	        	//this.dialog.gridMultipleItemsWidget = this;
	        	}
			},
			
			startup: function(){
				if(this._started) { return; }
				console.debug("[MultipleAccountGrid] startup start");
				
				// Prepare data store
				this.dataList = [];
				
				this.layout = [
								{ name: 'Account Number', field: 'account_number', width: '15%',noresize:true},
								{ name: 'Account Type', field: 'type', width: '10%',noresize:true},
								{ name: 'Account Product Type', field: 'account_product_type', width: '10%',noresize:true },
								{ name: 'Ccy', field: 'ccy', width: '5%',noresize:true },
								{ name: 'Description', field: 'description', width: '20%',noresize:true },
								{ name: 'Customer Account Type', field: 'cust_account_type', width: '10%',noresize:true },
								{ name: 'NRA', field: 'nra', width: '5%',noresize:true },
								{ name: 'Nick Name', field: 'nickname', width: '10%',noresize:true },
								{ name: 'Active', field: 'actv_flag', width: '5%',noresize:true },
								{ name: ' ', field: 'actions', formatter: misys.grid.formatReportActions, width: '10%' ,noresize:true},
								{ name: 'Id', field: 'store_id', headerStyles: 'display:none', cellStyles: 'display:none',noresize:true},
								{ name: 'Sweeping Enabled', field: 'sweeping_enabled', headerStyles: 'display:none', cellStyles: 'display:none',noresize:true},
								{ name: 'Pooling Enabled', field: 'pooling_enabled', headerStyles: 'display:none', cellStyles: 'display:none',noresize:true},
								{ name: 'Charge Account for Liquidity', field: 'charge_account_for_liq', headerStyles: 'display:none', cellStyles: 'display:none',noresize:true}
								];
					if (this.viewMode == 'view')
					{
						this.layout = [
										{ name: 'Account Number', field: 'account_number', width: '15%',noresize:true},
										{ name: 'Account Type', field: 'type', width: '10%',noresize:true},
										{ name: 'Account Product Type', field: 'account_product_type', width: '10%',noresize:true },
										{ name: 'Ccy', field: 'ccy', width: '5%',noresize:true },
										{ name: 'Description', field: 'description', width: '20%',noresize:true },
										{ name: 'Customer Account Type', field: 'cust_account_type', width: '10%',noresize:true },
										{ name: 'NRA', field: 'nra', width: '5%',noresize:true },
										{ name: 'Nick Name', field: 'nickname', width: '10%',noresize:true },
										{ name: 'Id', field: 'store_id', headerStyles: 'display:none', cellStyles: 'display:none',noresize:true },
										{ name: 'Sweeping Enabled', field: 'sweeping_enabled', headerStyles: 'display:none', cellStyles: 'display:none',noresize:true},
										{ name: 'Pooling Enabled', field: 'pooling_enabled', headerStyles: 'display:none', cellStyles: 'display:none',noresize:true},
										{ name: 'Charge Account for Liquidity', field: 'charge_account_for_liq', headerStyles: 'display:none', cellStyles: 'display:none',noresize:true}
										];
					}
				// Prepare data store for edit mode
				this.dataList = [];
				if(this.hasChildren())
				{
					dojo.forEach(this.getChildren(), function(child){
					var item = { 
							account_number: child.get('account_number'),
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
							nickname: child.get('nickname'),
							actv_flag: child.get('actv_flag'),
							sweeping_enabled: child.get('sweeping_enabled'),
							pooling_enabled: child.get('pooling_enabled'),
							charge_account_for_liq: child.get('charge_account_for_liq')
							};
				    
					this.dataList.push(item);
				}, this);
				}
				this.inherited(arguments);
				misys.connect(this, 'onCellClick', this, this.handleGridAction);
				console.debug("[MultipleAccountGrid] startup end");
			},
			checkDialog: function()
			{
				console.debug("[MultipleAccountGrid] checkDialog start");
				var dialogWidget = dijit.byId(this.dialogId); 
				if(dialogWidget)
				{
					this.dialog = dialogWidget; 
				}
				else
				{
					var id = this.dialogId !== '' ? this.dialogId : 'dialog-' + (xmlTag !== '' ? xmlTag + '-' : '') + dojox.uuid.generateRandomUuid();
					var dojoClass = this.dialogClassName !== null ? this.dialogClassName : 'misys.widget.Dialog';
					// TODO Remove use of eval here
		    		this.dialog = dojo.eval("new " + dojoClass + "({}, dojo.byId('" + id + "'))");
		    		this.dialog.set("refocus", false);
		    		this.dialog.set("draggable", false);
		    		dojo.addClass(this.dialog.domNode, "multipleAccountDialog");
		    		this.dialog.startup();
		    		document.body.appendChild(this.dialog.domNode);
				}
				console.debug("[MultipleAccountGrid] checkDialog end");
				return this.dialog;
			},
			collectRequiredField: function(){
				//Do Nothing
				//this.checkDialog();
			},
			updateData: function()
			{
				console.debug("[MulitpleAccountGrid] overridden call start");
				var parent = this;
				var parentGrid = this.grid;
				//check the grid popup with mulitple account exists
				if(dijit.byId('account-interface-grid'))
				{
					 var itemFields = {},
					 	items = dijit.byId('account-interface-grid').selection.getSelected(),
					 	datalist = [];
							dojo.forEach(items, function(item){
								// First, look for the widget's properties
								for(var i = 0, len = dijit.byId('account-dialog-template').gridMultipleItemsWidget.gridColumns.length; i < len; i++)
								{
									var property = dijit.byId('account-dialog-template').gridMultipleItemsWidget.gridColumns[i];
									console.debug("[MultipleAccountGrid] Item value of property"+property+" is"+item[property]);

									var value = item[property];
									if((value != null && value != undefined))
									{
										itemFields[property] = value;
									}
								}
								//check if for the grid store has already been created if yes update the store
								//or else create a new store
								if(parentGrid != null && parentGrid.store != null)
								{
									var newItem = {'store_id':item['store_id'][0],
												    'account_number':item['account_number'][0],
												    'type':item['type'] ? item['type'][0] : '',
												    'account_product_type':item['account_product_type'] ? item['account_product_type'][0] : '',
												    'ccy':item['ccy'] ? item['ccy'][0] : '',
												    'description':item['description'] ? item['description'][0] : '',
												    'cust_account_type':item['cust_account_type'] ? item['cust_account_type'][0] : '',
												    'bank_id':item['bank_id'] ? item['bank_id'][0] : '',
												    'branch_code':item['branch_code'] ? item['branch_code'][0] : '',
												    'nra':item['nra'] ? item['nra'][0] : '',
												    'existing_bib_account':item['existing_bib_account'] ? item['existing_bib_account'][0] :'',
													'account_type': item['account_type'] ? item['account_type'][0] : '',
													'routing_bic': item['routing_bic'] ? item['routing_bic'][0] : '',
													'nickname': item['nickname'] ? item['nickname'][0] : '',
													'actv_flag': item['actv_flag'] ? item['actv_flag'][0] : '',
													'sweeping_enabled': item['sweeping_enabled'] ? item['sweeping_enabled'][0] : '',
													'pooling_enabled': item['pooling_enabled'] ? item['pooling_enabled'][0] : '',
													'charge_account_for_liq': item['charge_account_for_liq'] ? item['charge_account_for_liq'][0] : ''			
												    };
									parentGrid.store.newItem(newItem);
								}
								//push the items to a array selected item while create a new store may contain more den one selected
								//values, here itemFields always points to one item in the child grid
								else{
									datalist.push(itemFields);
								}
								//clear the item fields which has current item
								itemFields = {};
							});
							if(parentGrid == null)
							{
								// Create data store
						    	var data = {
						    			identifier: 'store_id',
						    			label: 'store_id',
						    			items: datalist
						    		};
						
						    	parent.store = new dojo.data.ItemFileWriteStore({data: data});
						    	parent.createDataGrid();
						    	parentGrid = this.grid;
								
							}
				}
				parentGrid.store.save();
				parentGrid.render();
				parent.renderAll();
				//this.inherited(arguments);
				parent._retrieveAccounts();
				
			},
			createDataGrid: function()
			{
				var gridId = this.gridId;
				if(gridId === '')
				{
					gridId = 'grid-' + 
								(this.xmlTagName !== '' ? this.xmlTagName + '-' : '') + 
								dojox.uuid.generateRandomUuid();
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
						initialWidth: '100%'
						}, document.createElement("div"));
					
					this.grid.gridMultipleItemsWidget = this;
					this.addChild(this.grid);
					this.onGridCreate();
			},
			//populate the charging account drop down on selection of accounts
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
		
								storeItems.push(
										{
										name: value,
										value: value,
										ccy: ccy
										});
							
						}, this);
						dijit.byId('charging_account').store = new dojo.data.ItemFileWriteStore({
							data: {
								identifier: "value",
								items: storeItems
							}
						});
						console.debug("[Accounts] retrieve items"+items);
			})});
			},
			updateAccountNickName: function()
			{
				console.debug("[MulitpleAccountGrid] update Nick Name start");
				var storeId = this.dialog.storeId;
				
				//TODO: try to remove this internal property (used because we don't know how to pass a parameter to store.fetch method
				this._itemFields = this._retrieveItemFields();	
			
				this._itemFields['store_id'] = (storeId != null ? storeId : dojox.uuid.generateRandomUuid());
				
				this.grid.store.fetch({
					query: {store_id: storeId}, 
					onComplete: dojo.hitch(this, function(items, request){
						if (items.length > 0)
						{
							var item = items[0];
							/*for (var property in this._itemFields)
							{
								var value = this._itemFields[property];
								if ((value != null && value != undefined) && property == 'nickname')
								{
									this.grid.store.setValue(item, property, value);
								}
							}*/
							var value = this._itemFields['nickname'];
							if ((value != null && value != undefined))
							{
								this.grid.store.setValue(item, 'nickname', value);
							}
						}
						else
						{
							this.grid.store.newItem(this._itemFields);
						}
					})
				});
				this.grid.store.save();
				this.grid.render();
				console.debug("[MulitpleAccountGrid] update Nick Name end");
			}
	
		}
);