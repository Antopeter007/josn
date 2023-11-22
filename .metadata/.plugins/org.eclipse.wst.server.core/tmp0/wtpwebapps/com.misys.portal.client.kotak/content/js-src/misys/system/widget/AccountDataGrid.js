dojo.provide("misys.system.widget.AccountDataGrid");
dojo.experimental("misys.system.widget.AccountDataGrid");

dojo.require("misys.grid.EnhancedGrid");
dojo.require("dojox.grid.enhanced.plugins.Pagination");
dojo.require("misys.grid.DataGrid");
//our declared class
dojo.declare("misys.system.widget.AccountsDataGrid",
		[ misys.grid.EnhancedGrid,misys.grid.DataGrid ],
		// class properties:
{   
		rowsPerPage: 10,
		plugins:{paginationEnhanced: {pageSizes: ['10','25','50','100'],description: true,sizeSwitch: true,pageStepper: true,gotoButton: true,maxPageStep: 7,position: ' top '}},
		
		handleGridAction: function(event)
		{
			console.debug("[AccountsDataGrid] handleGridAction start");
			//To handle the pagination,get the page size and current page and calculate the start and pass it as parameter to the onEdit method.
			var start = 0;
			if(event.grid && event.grid.plugin('paginationEnhanced') && event.grid.plugin('paginationEnhanced').pageSize && event.grid.plugin('paginationEnhanced')._currentPage)
				{
					 start = event.grid.plugin('paginationEnhanced')._currentPage *  event.grid.plugin('paginationEnhanced').pageSize;
				}
			 
			 console.debug("[AccountsDataGrid] handleGridAction grid id: " + this.id);
			 if(event.target.tagName == 'IMG' && event.target.attributes.type)
			 {
				// Edit details
				if(event.target.attributes.type.value == 'edit')
				{
					if(dijit.byId("bank_previous_account_type"))
						{
						dijit.byId("bank_previous_account_type").set("value", "checked");
						}
					this.onEdit(event,start);
				}
				// Remove row
				else if(event.target.attributes.type.value == 'remove')
				{
					this.onDelete(event);
				}
			 }
			console.debug("[AccountsDataGrid] handleGridAction end");
	   },
	   /**
	    * Deletes the account no from the charging account drop down.
	    * Clears charging account store and iterates the account grid
	    * and fills the stores with avaliable account no. in the grid
	    */
	   _deleteChargingAccount : function(/**String**/ deleteAccountNo){
		   
		   	var gridItems = this.selection.getSelected(),
		   		accountNo,
		   		chargeAccountNo,
			    chargingAccount = dijit.byId('charge_account');
			
			//make the store null
			chargingAccount.store = null;
			var selectedValue = '';
			if(chargingAccount && chargingAccount.store === null)
			{
				//call delete
				this.inherited(arguments);
				//populate the charging account 
				var storeItems = [];
				//fetch the store and its items
				dijit.byId('accounts-grid').store.fetch({query: {store_id: '*'}, 
					onComplete: dojo.hitch(this, function(items){
						dojo.forEach(items, function(item){
								var value = item['account_number'];
								var ccy = item['ccy'];
								if ('S' + selectedValue === 'S')
								{
									selectedValue = value;
								}
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
						dijit.byId('charge_account').store = new dojo.data.ItemFileWriteStore({
							data: {
								identifier: "value",
								items: storeItems
							}
						});
					})});
				
				dijit.byId('charge_account').store.save();
				 // clear the charging account if its selected in the charging account drop down and the user from 
	            // grid is deleted the selected charging account
	            if(deleteAccountNo && chargingAccount)
	            {	
	            	chargeAccountNo = chargingAccount.get("value");
	            	// if both the selected account for deletion and charge account are same 
	            	// set the dropdown selection to empty
	            	if(deleteAccountNo === chargeAccountNo)
	            	{
	            		chargingAccount.setDisplayedValue("");
	            		chargingAccount.focus();
	            	}
	            }
			}
		},
		
		_editChargingAccount : function(/**String**/ editAccountNo){
			
			var gridItems = this.selection.getSelected(),
	   		accountNo,
	   		chargeAccountNo,
		    chargingAccount = dijit.byId('charge_account');
			
			chargingAccount.store = null;
			var selectedValue = '';
			
			if(chargingAccount && chargingAccount.store === null)
			{
				//call delete
				this.inherited(arguments);
				//populate the charging account 
				var storeItems = [];
				//fetch the store and its items
				dijit.byId('accounts-grid').store.fetch({query: {store_id: '*'}, 
					onComplete: dojo.hitch(this, function(items, request){
						dojo.forEach(items, function(item){
								var value = item['account_number'];
								var ccy = item['ccy'];
								if ('S' + selectedValue === 'S')
								{
									selectedValue = value;
								}
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
						dijit.byId('charge_account').store = new dojo.data.ItemFileWriteStore({
							data: {
								identifier: "value",
								items: storeItems
							}
						});
					})});
				
				dijit.byId('charge_account').store.save();
				 if(editAccountNo && chargingAccount)
		            {	
		            	chargeAccountNo = chargingAccount.get("value");
		            	// if both the selected account for deletion and charge account are same 
		            	// set the dropdown selection to empty
		            	if(editAccountNo === chargeAccountNo)
		            	{
		            		chargingAccount.setDisplayedValue("");
		            		
		            	}
		            }
				}
			
		},
		/**
		 * Overrides DataGrid onDelete as need to do additional task on deletion from grid.
		 * Reason to override complete method rather than calling super. As super method
		 * has a call back with confirmation dialog, cannot be controlled from here the
		 * confirmation dialogs result based on which action has to be taken.
		 */
	   onDelete: function(event)
	   {
			console.debug("[AccountsDataGrid] onDelete");


			var that = this,
				deleteAccountNo;
			var callBack = function(){
					
				  var items = that.selection.getSelected();
		            if (items.length) {
		                // Iterate through the list of selected items and unselect them
		                dojo.forEach(items, function(selectedItem) {
		                    if (selectedItem !== null) {
		                        // Delete the item from the data store:
		                    	that.selection.setSelected(selectedItem, false);
		                    }
		                }, that);
		            }
		            
					// Then, select row to be removed
		            that.selection.setSelected(event.rowIndex, true);
					// Get all selected items from the Grid:
		             items = that.selection.getSelected();
		            // get the account no getting deleted
		            if(items.length && items[0].account_number)
		            {
		                if(items[0].account_number[0])
		                {
		                  deleteAccountNo = items[0].account_number[0];
		                }
		            }
		            if (items.length) {
		                // Iterate through the list of selected items
		            	// and remove them from the store
		                dojo.forEach(items, function(selectedItem) {
		                    if (selectedItem !== null) {
		                        // Delete the item from the data store:
		                    	that.store.deleteItem(selectedItem);
		                    }
		                }, that);
		                that.store.save();
		            }
		            //Some code was causing issue while deleting a single account in the grid,it seems to be redundant. Removed it.
		            //Deleted the code as it will become sonar issue if commented
		            
					setTimeout(dojo.hitch(that.gridMultipleItemsWidget, "renderSections"), 100);
					// delete charging account
					if(dijit.byId('charge_account'))
					{	
						that._deleteChargingAccount(deleteAccountNo);
					}
					
			};
			misys.dialog.show("CONFIRMATION",misys.getLocalization("confirmDeletionAccountRecord"),'',callBack);
	   },
	   onEdit: function(event,start)
	   {
		   console.debug("[AccountsDataGrid] onEdit start");
		   var that = this,
			editAccountNo;
		
				
			  var items = that.selection.getSelected();
	    
	            // get the account no getting deleted
	            if(items.length && items[0].account_number)
	            {
	                if(items[0].account_number[0])
	                {
	                  editAccountNo = items[0].account_number[0];
	                }
	            }
		
		   if(this.gridMultipleItemsWidget && this.gridMultipleItemsWidget.dialogId)
		   {
			   this.gridMultipleItemsWidget.dialogId='edit-account-dialog-template';
		   }

   		console.debug("[misys.grid.DataGrid] onEdit");
   		
			// Pass in values to dialog
			var store = this.store;
			var id;
			store.fetch(
					{
						query: {store_id: '*'},
						sort: this.getSortProps(),
						onComplete: dojo.hitch(this, function(items, request){
							dojo.forEach(items, function(item, index){
								//To handle the pagination using the start variable
								if(index === event.rowIndex+start)
								{
									console.debug("Here is the item:", item );
									id = item.store_id[0];
								}
							}, this);
						})
					}
			);
			
			store.fetch({
				query: {store_id: id},
				onComplete: dojo.hitch(this.gridMultipleItemsWidget, "openDialogFromExistingItem")
			});
   			   console.debug("[AccountsDataGrid] onEdit end");
		   if(dijit.byId('charge_account'))
			{	
				that._editChargingAccount(editAccountNo);
			}
		   
	   }

}
);

// MPS-36551 - Issues in pagination in case of multiple accounts
// i.e, Unnecessarily empty records are getting appended.
dojo.extend(dojox.grid.enhanced.plugins.Pagination,{
	defaultRows: 100
});

