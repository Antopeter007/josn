dojo.provide("misys.openaccount.widget.BpoPaymentTerms");
dojo.experimental("misys.openaccount.widget.BpoPaymentTerms"); 

dojo.require("misys.grid.GridMultipleItems");
dojo.require("misys.openaccount.widget.BpoPaymentTerm");

/**
 * This widget store the payment terms details present in the Bank Payment Obligation.
 */
dojo.declare("misys.openaccount.widget.BpoPaymentTerms",
		[ misys.grid.GridMultipleItems ],
		// class properties:
		{
		data: { identifier: "store_id", label: "store_id", items: [] },
		templatePath: null,
		templateString: dojo.byId("bpo-payment-terms-template") ? dojo.byId("bpo-payment-terms-template").innerHTML : "",
		dialogId: "bpo-payment-terms-dialog-template",
		xmlTagName: "",
		xmlSubTagName: "",
		
		gridColumns: ['pmt_code',
		              'pmt_other_term_code',
		              'payment_code', 'payment_nb_days',
		              'payment_other_term',
		              'payment_amount', 'payment_percent'],
        
		propertiesMap: {
			Cd						: {_fieldName: 'payment_code'},
			NbOfDays				: {_fieldName: 'payment_nb_days'},
			Amt						: {_fieldName: 'payment_amount'},
			Pctg					: {_fieldName: 'payment_percent'},
			OthrPmtTerms			: {_fieldName: 'payment_other_term'},
			pmt_code				: {_fieldName: 'pmt_code'},
			pmt_other_term_code		: {_fieldName: 'pmt_other_term_code'}
			},

		layout: [
				{ name: "Payment Code", get: misys.getPaymentDisplayedValue , width: "35%" },
				{ name: " ", field: "actions", formatter: misys.grid.formatReportActions, width: "10%" }/*,
				{ name: "Id", field: "store_id", headerStyles: "display:none", cellStyles: "display:none" }*/
				],
        
		getMandatoryProperties: function(item){
					var mandatoryProperties = [];
					mandatoryProperties.push(item.Amt == "" ? "Pctg" : "Amt");
					mandatoryProperties.push(item.Cd == "" ? "OthrPmtTerms" : "Cd");
					return mandatoryProperties;
				},
        
		startup: function(){
			console.debug("[BpoPaymentTerms] startup start");
			
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
			console.debug("[BpoPaymentTerms] startup end");
		},
    	
		openDialogFromExistingItem: function(items, request)
		{
			console.debug("[BpoPaymentTerms] openDialogFromExistingItem start");
			this.inherited(arguments);
			if(dijit.byId("payment_code") && dijit.byId("payment_code").get("value") !== "" && dijit.byId("pmt_code")) {
				dijit.byId("payment_code").set("disabled",false);
				dijit.byId("payment_code").set("required",true);
				dijit.byId("payment_nb_days").set("disabled",false);
				dijit.byId("pmt_code").set("checked",true);
			} 
			else if(dijit.byId("payment_code") && dijit.byId("payment_nb_days") && dijit.byId("pmt_code")) {
				dijit.byId("payment_code").set("disabled",true);
				dijit.byId("payment_code").set("required",false);
				dijit.byId("payment_nb_days").set("disabled",true);
				dijit.byId("pmt_code").set("checked",false);
			}
			
			if(dijit.byId("payment_other_term") && dijit.byId("pmt_other_term_code") && dijit.byId("payment_other_term").get("value")!== "") {
				dijit.byId("payment_other_term").set("disabled",false);
				dijit.byId("payment_other_term").set("required",true);
				dijit.byId("pmt_other_term_code").set("checked",true);
			} 
			else if(dijit.byId("payment_other_term") && dijit.byId("pmt_other_term_code")) {
				dijit.byId("payment_other_term").set("disabled",true);
				dijit.byId("payment_other_term").set("required",false);
				dijit.byId("pmt_other_term_code").set("checked",false);
			}
			// BPO : Payment Amount
			if(dijit.byId("payment_amount") && dijit.byId("payment_amount").get("value") !== "") {
				dijit.byId("payment_amount").set("disabled",false);
			} 
			else if(dijit.byId("payment_amount")) {
				dijit.byId("payment_amount").set("disabled",true);
			}
			if(dijit.byId("payment_percent") && dijit.byId("payment_percent").get("value") !== "") {
				dijit.byId("payment_percent").set("disabled",false);
			} 
			else if(dijit.byId("payment_percent")) {
				dijit.byId("payment_percent").set("disabled",true);
			}
			if(dijit.byId("pmt_code") && dijit.byId("pmt_code").get("checked") !== true && dojo.byId("paymentCode")) {
				dojo.style(dojo.byId("paymentCode"), "display", "none");
			}
			else if (dojo.byId("paymentCode")){
				dojo.style(dojo.byId("paymentCode"), "display", "block");
			}
			if(dijit.byId("pmt_other_term_code") && dijit.byId("pmt_other_term_code").get("checked") !== true && dojo.byId("payment_other_term_row")) {
				dojo.style(dojo.byId("payment_other_term_row"), "display", "none");
			}
			else if (dojo.byId("payment_other_term_row")){
				dojo.style(dojo.byId("payment_other_term_row"), "display", "block");
			}
			console.debug("[BpoPaymentTerms] openDialogFromExistingItem end");
		},
		
		resetDialog: function(items, request)
		{
			console.debug("[BpoPaymentTerms] ResetDialog start");
			this.inherited(arguments);
			if(dijit.byId("payment_amount")) {
				dijit.byId("payment_amount").set("disabled",false);
			}
			if(dijit.byId("payment_percent")) {
				dijit.byId("payment_percent").set("disabled",false);
			}
			if(dijit.byId("pmt_code") && dijit.byId("pmt_code").get("checked")=== true && dojo.byId("paymentCode")) {
				dojo.style(dojo.byId("paymentCode"), "display", "block");
			}
			else if (dojo.byId("paymentCode")){
				dojo.style(dojo.byId("paymentCode"), "display", "none");
			}
			if(dijit.byId("pmt_other_term_code") && dijit.byId("pmt_other_term_code").get("checked")=== true && dojo.byId("payment_other_term_row")) {
				dojo.style(dojo.byId("payment_other_term_row"), "display", "block");
			}
			else if (dojo.byId("payment_other_term_row")){
				dojo.style(dojo.byId("payment_other_term_row"), "display", "none");
			}
			console.debug("[BpoPaymentTerms] ResetDialog end");
		},
		
		addItem: function(event)
		{
			console.debug("[BpoPaymentTerms] addItem start");
			this.inherited(arguments);
			if(dijit.byId("payment_amount")) {
				dijit.byId("payment_amount").set("disabled",false);
			}
			if(dijit.byId("payment_percent")) {
				dijit.byId("payment_percent").set("disabled",false);
			}
			if(dijit.byId("pmt_code") && dijit.byId("pmt_code").get("checked")=== true) {
				dojo.style(dojo.byId("paymentCode"), "display", "block");
				dijit.byId("payment_code").set("required",true);
				dojo.style(dojo.byId("payment_other_term_row"), "display", "none");
			}
			else {
				dojo.style(dojo.byId("paymentCode"), "display", "none");
				dijit.byId("payment_code").set("required",false);
			}
			if(dijit.byId("pmt_other_term_code") && dijit.byId("pmt_other_term_code").get("checked")=== true) {
				dojo.style(dojo.byId("paymentCode"), "display", "none");
				dojo.style(dojo.byId("payment_other_term_row"), "display", "block");
				dijit.byId("payment_other_term").set("required",true);
			}
			else {
				dojo.style(dojo.byId("payment_other_term_row"), "display", "none");
				dijit.byId("payment_other_term").set("required",false);
			}
			console.debug("[BpoPaymentTerms] addItem end");
		},
		
		createItem: function()
		{
			if(this.hasChildren && this.hasChildren())
			{
				var type= 'misys.openaccount.widget.BpoPaymentTerms';
				var value= [];
				dojo.forEach(this.getChildren(), function(child){
					if (child.createItem)
					{
						value.push(child.createItem());
					}
				}, this);
				var obj = {_value : value , _type: type};
				var item = {};
				item["payment_obligations_paymnt_terms"] = obj;
				return item;
			}
			return null;
		},

		createItemsFromJson: function(jsonMsg)
		{
			console.debug("[BpoPaymentTerms] createItemsFromJson start");
			
			this.inherited(arguments);
			
			console.debug("[BpoPaymentTerms] createItemsFromJson end");
		},
		
		performValidation: function()
		{
			console.debug("[BpoPaymentTerms] validate start");
			if(this.validateDialog(true))
			{
				if((dijit.byId("payment_percent") && dijit.byId("payment_percent").get("value") === "") && (dijit.byId("payment_amount") && isNaN(dijit.byId("payment_amount").get("value"))))
				{
					misys.dialog.show("ERROR", misys.getLocalization("addAmtOrPercentage"));
				}
				else if ((dijit.byId("payment_code") && dijit.byId("payment_code").get("value") === "") && (dijit.byId("payment_other_term") && dijit.byId("payment_other_term").get("value") === "")) {
					misys.dialog.show("ERROR", misys.getLocalization("addPaymentTermCode"));
				}
				else
				{
					this.inherited(arguments);
				}
			}
			
			console.debug("[BpoPaymentTerms] validate end");
		}
	}
);