dojo.provide("misys.openaccount.widget.PaymentTerms");
dojo.experimental("misys.openaccount.widget.PaymentTerms"); 

dojo.require("misys.openaccount.FormOpenAccountEvents");
dojo.require("misys.grid.GridMultipleItems");
dojo.require("misys.openaccount.widget.PaymentTerm");

/**
 * This widget stores the payment terms details for the transactions.
 */
dojo.declare("misys.openaccount.widget.PaymentTerms",
		[ misys.grid.GridMultipleItems ],
		// class properties:
		{
		data: { identifier: "store_id", label: "store_id", items: [] },
		
		templatePath: null,
		templateString: dojo.byId("payment-terms-template")? dojo.byId("payment-terms-template").innerHTML : '',
		dialogId: "payment-term-dialog-template",
		xmlTagName: "payments",
		xmlSubTagName: "payment",
		
		gridColumns: ["code", "other_paymt_terms", "nb_days", "cur_code", "amt", "pct","code_desc","itp_payment_amt","itp_payment_date"],
        
		propertiesMap: {
			ref_id: {_fieldName: "ref_id"},
			tnx_id: {_fieldName: "tnx_id"},
			payment_id : {_fieldName: "payment_id"},
			code: {_fieldName: "details_code"},
			other_paymt_terms: {_fieldName: "details_other_paymt_terms"},
			nb_days: {_fieldName: "details_nb_days"},
			cur_code: {_fieldName: "details_cur_code"},
			amt: {_fieldName: "details_amt"},
			pct: {_fieldName: "details_pct"},
			code_desc: {_fieldName: "code_desc"},
			itp_payment_amt: {_fieldName: "itp_payment_amt"},
			itp_payment_date: {_fieldName: "itp_payment_date"}
			},

		layout: [
				{ name: "Payment Type",get: misys.getPaymentDisplayedValue, width: "35%" },
				{ name: "Ccy", field: "cur_code", width: "15%" },
				{ name: "Amount/Rate", get: misys.getPaymentAmountRate, width: "40%" },
				{ name: " ", field: "actions", formatter: misys.grid.formatReportActions, width: "10%" }
				],
				
		getMandatoryProperties: function(item){
			var mandatoryProperties = [];
			mandatoryProperties.push(item.amt === "" ? "pct" : "amt");
			mandatoryProperties.push(item.code === "" ? "other_paymt_terms" : "code");
			return mandatoryProperties;
		},
        
		startup: function(){
			console.debug("[PaymentTerms] startup start");
			
			// Prepare data store
			this.dataList = [];
			if(this.hasChildren())
			{
				dojo.forEach(this.getChildren(), function(child){
					// Mark the child as started.
					// This will prevent Dojo from parsing the child
					// as we don't want to make it appear on the form now.
					if (child.createItem)
					{
						var item = child.createItem();
						this.dataList.push(item);
					}
				}, this);
			}
			this.inherited(arguments);
			console.debug("[PaymentTerms] startup end");
		},
    	
		openDialogFromExistingItem: function(items, request)
		{
			console.debug("[PaymentTerms] openDialogFromExistingItem start");
			
			this.inherited(arguments);
			//Disabling currency code
			dijit.byId("details_cur_code").set("disabled",true);
			
			if(dijit.byId("details_code") && dijit.byId("details_code").get("value") !== "" && dijit.byId("pmt_term_code")) {
				dijit.byId("details_code").set("disabled",false);
				dijit.byId("details_code").set("required",true);
				dijit.byId("details_nb_days").set("disabled",false);
				dijit.byId("pmt_term_code").set("checked",true);
			}
			else if(dijit.byId("details_code") && dijit.byId("details_nb_days") && dijit.byId("pmt_term_code")) {
				dijit.byId("details_code").set("disabled",true);
				dijit.byId("details_nb_days").set("disabled",true);
				dijit.byId("details_code").set("required",false);
				dijit.byId("pmt_term_code").set("checked",false);
			}
			if(dijit.byId("details_other_paymt_terms") && dijit.byId("pmt_term_other_code") && dijit.byId("details_other_paymt_terms").get("value")!== "") {
				dijit.byId("details_other_paymt_terms").set("disabled",false);
				dijit.byId("details_other_paymt_terms").set("required",true);
				dijit.byId("pmt_term_other_code").set("checked",true);
			} 
			else if(dijit.byId("details_other_paymt_terms") && dijit.byId("pmt_term_other_code")) {
				dijit.byId("details_other_paymt_terms").set("disabled",true);
				dijit.byId("details_other_paymt_terms").set("required",false);
				dijit.byId("pmt_term_other_code").set("checked",false);
			}
			console.debug("[PaymentTerms] openDialogFromExistingItem end");
		},
		
		updateData: function(event)
		{
			console.debug("[PaymentTerms] updateData start");
			
			this.inherited(arguments);
			
			console.debug("[PaymentTerms] updateData end");
			misys.markFormDirty();
		},
		
		resetDialog: function(items, request)
		{
			console.debug("[PaymentTerms] resetDialog start");
			
			this.inherited(arguments);
			
			//not very good line items not always connected to total_cur_code field
			if (dijit.byId("total_cur_code")){
				var poCurCode = dijit.byId("total_cur_code").get("value");
				// Update existing line items
				dijit.byId("details_cur_code").set("value", poCurCode);
			}
			console.debug("[PaymentTerms] resetDialog end");
		},
		
		addItem: function(event)
		{
			console.debug("[PaymentTerms] addItem start");

			this.inherited(arguments);	
			//Disabling currency code
			dijit.byId("details_cur_code").set("disabled",true);
			
			if(dijit.byId("pmt_term_code") && dijit.byId("pmt_term_code").get("checked")=== true) {
				dojo.style(dojo.byId("paymentTermCode"), "display", "block");
				dijit.byId("details_code").set("required",true);
				dojo.style(dojo.byId("details_other_paymt_terms_row"), "display", "none");
			}
			else {
				dojo.style(dojo.byId("paymentTermCode"), "display", "none");
				dijit.byId("details_code").set("required",false);
			}
			if(dijit.byId("pmt_term_other_code") && dijit.byId("pmt_term_other_code").get("checked")=== true) {
				dojo.style(dojo.byId("paymentTermCode"), "display", "none");
				dojo.style(dojo.byId("details_other_paymt_terms_row"), "display", "block");
				dijit.byId("details_other_paymt_terms").set("required",true);
			}
			else {
				dojo.style(dojo.byId("details_other_paymt_terms_row"), "display", "none");
				dijit.byId("details_other_paymt_terms").set("required",false);
			}
			console.debug("[PaymentTerms] addItem end");
		},
		
		performValidation: function()
		{
			console.debug("[PaymentTerms] validate start");
			if(this.validateDialog(true))
			{
				if((dijit.byId("details_pct") && dijit.byId("details_pct").get("value") === "") && (dijit.byId("details_amt") && isNaN(dijit.byId("details_amt").get("value"))))
				{
					misys.dialog.show("ERROR", misys.getLocalization("addAmtOrPercentage"));
				}
				else if ((dijit.byId("details_code") && dijit.byId("details_code").get("value") === "") && (dijit.byId("details_other_paymt_terms") && dijit.byId("details_other_paymt_terms").get("value") === "")) {
					misys.dialog.show("ERROR", misys.getLocalization("addPaymentTermCode"));
				}
				else if(dijit.byId("total_net_amt"))
				{
					var sumAmt = 0;
					var	Amt= 0;
					var totalNetAmt = parseFloat(dijit.byId("total_net_amt").get("value"));
					var paymentAmt =  parseFloat(dijit.byId("details_amt").get("value"));
					var paymentPct = (parseFloat(dijit.byId("details_pct").get("value"))/100)*totalNetAmt ;
					//Payment amount/percentage check with the total net amount.
					if(this.grid && this.grid.store && this.grid.store._arrayOfTopLevelItems)
					{
						var storeId = this.grid.gridMultipleItemsWidget.dialog.storeId;
						this.grid.store.fetch({
							query:{store_id:"*"},
							onComplete: dojo.hitch(this.grid, function(items, request){
								dojo.forEach(items, function(item){
									//Modifying an existing record check.
									if(storeId)
									{
										//If Amount is given add the amount to calculate total amount.
										if(item.amt[0] != "" && (item.store_id[0]!=storeId))
										{
											sumAmt = sumAmt + parseFloat(item.amt[0].replace(",",""));
										}
										//If Percentage is given, convert it to amount add it to calculate total amount.
										else if(item.pct[0] != "" && (item.store_id[0]!=storeId))
										{
											Amt = (parseFloat(item.pct[0])/100)*totalNetAmt ;
											sumAmt = sumAmt + Amt;
										}
									}
									//Adding a new record check.
									else 
									{
										if(item.amt[0] != "")
										{
											sumAmt = sumAmt + parseFloat(item.amt[0].replace(",",""));
										}
										else if(item.pct[0] != "")
										{
											Amt = (parseFloat(item.pct[0])/100)*totalNetAmt ;
											sumAmt = sumAmt + Amt;
										}
									}
									
								});
							})
						});
					}
					if(paymentAmt &&(sumAmt + paymentAmt > totalNetAmt))
					{
						misys.dialog.show("ERROR", misys.getLocalization("paymentAmtOrPercentage"));
					}
					else if(paymentPct && (sumAmt + paymentPct > totalNetAmt))
					{
						misys.dialog.show("ERROR", misys.getLocalization("paymentAmtOrPercentage"));
					}
					else
					{
						this.inherited(arguments);
					}
				}
				else
				{
					this.inherited(arguments);
				}
			}
			
			console.debug("[PaymentTerms] validate end");
		},
		
		renderSections: function()
		{
			console.debug("[PaymentTerms] renderSections start");
			this.inherited(arguments);
			if (this.itemsNode)
			{
				var displayGrid = (this.grid && this.grid.rowCount > 0);
				dijit.byId("add_payment_term_button").set("disabled",false);
			}
			console.debug("[PaymentTerms] renderSections end");
		}
	}
);