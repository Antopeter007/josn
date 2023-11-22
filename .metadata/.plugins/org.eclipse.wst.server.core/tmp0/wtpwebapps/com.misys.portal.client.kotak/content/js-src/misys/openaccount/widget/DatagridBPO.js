dojo.provide("misys.openaccount.widget.DatagridBPO");
dojo.experimental("misys.openaccount.widget.DatagridBPO");
dojo.require("misys.grid.DataGrid"); 
dojo.declare("misys.openaccount.widget.DatagridBPO",
		[ misys.grid.DataGrid ],
		{
			postresize: function(){
			// views are position absolute, so they do not inflate the parent
			console.debug("[misys.grid.DatagridBPO] postresize");
			this.inherited(arguments);
			var gridPaymentObligation = dijit.byId("bank-payment-obligations");
			var bpoAddedFlag = false;
			if(gridPaymentObligation && gridPaymentObligation.store && gridPaymentObligation.store._arrayOfTopLevelItems)
			{
				gridPaymentObligation.store.fetch({
					query:{store_id:"*"},
					onComplete: dojo.hitch(gridPaymentObligation, function(items, request){
						dojo.forEach(items, function(item){
							if(item.buyer_bank_bpo[0] === "Y")
							{
								dijit.byId("buyer_bank_bpo_added").set("value",true);
								bpoAddedFlag = true;
							}
						});
					})
				});
				if(!bpoAddedFlag)
				{
					dijit.byId("buyer_bank_bpo_added").set("value",false);
				}
			}
	}
		});