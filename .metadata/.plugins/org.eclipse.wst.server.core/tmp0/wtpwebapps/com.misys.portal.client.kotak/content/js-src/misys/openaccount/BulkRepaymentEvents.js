dojo.provide("misys.openaccount.BulkRepaymentEvents");
dojo.require("misys.validation.common");
/*
 -----------------------------------------------------------------------------
 Scripts common for Bulk Repayment events.

 Copyright (c) 2000-2009 Misys (http://www.misys.com),
 All Rights Reserved. 

 version:   1.0
 date:      28/07/2017
 author:    Yashaswini.M
 -----------------------------------------------------------------------------
 */

(function(/*Dojo*/ d, /*Dijit*/ dj, /*Misys*/ m) {

	// Private functions and variables

	
	/******************** Public  Functions *************************/
	
	d.mixin(m, {
		/**
		 * <h4>Summary:</h4>
		 * This function is to get the invoice/invoice payables which have been finances for bulk repayment based on the criteria
		 * <h4>Description:</h4> 
		 * @method getFinancesForBulkRepayment
		 * 
		 */
		getFinancesForBulkRepayment : function(childProductCode,entity,custRef)
		{
			if(childProductCode === "IN")
				{
					m.showSearchDialog("bulk_repay","['invoice_ref_id', 'entity', 'program_name','seller_name','buyer_name', 'total_net_cur_code', 'finance_amt', 'outstanding_repayment_amt', 'fin_date', 'fin_due_date','prod_stat_code']",
							{product_code: childProductCode,entity: entity,customer_reference: custRef},"",childProductCode,"width:1250px;height:400px;", m.getLocalization("ListOfFinancesTitleMessage"));
				}
			else if(childProductCode === "IP")
				{
				m.showSearchDialog("bulk_repay","['invoice_payable_ref_id', 'entity', 'program_name','seller_name','buyer_name', 'total_net_cur_code', 'finance_amt', 'outstanding_repayment_amt', 'fin_date', 'fin_due_date','prod_stat_code']",
						{product_code: childProductCode,entity: entity,customer_reference: custRef},"",childProductCode,"width:1250px;height:400px;", m.getLocalization("ListOfFinancesTitleMessage"));
				}			
		},
		
		/**
		 * <h4>Summary:</h4>
		 * This function is to get the invoice payables eligible for bulk financing based on the criteria
		 * <h4>Description:</h4> 
		 * @method getFinancesForBulkRepayFiltered
		 * 
		 */
		getFinancesForBulkRepayFiltered : function(childProduct)
		{
			
			var customerRef;			
			if(dj.byId("issuing_bank_customer_reference"))
			{
				customerRef = dj.byId("issuing_bank_customer_reference").get("value");
			}
			
			if (!customerRef)
			{
				misys.dialog.show("ERROR", misys.getLocalization("customerReferenceRequiredForBulkFinancingSearch"));
				return;
			}
			
			var curcode;
			if(dj.byId("curCode"))
			{
				curcode = dj.byId("curCode").get("value");
			}
			if ( !m.validateCurrencyCode(curcode)){
				misys.dialog.show("ERROR", misys.getLocalization("invalidCurrencyError",[curcode]));
				return;
			}
						
			var finance_date_from;
			var finance_date_to;
			var finance_due_date_from;
			var finance_due_date_to;
			if(dj.byId("finance_amount_from"))
			{
				finance_amount_from = dj.byId("finance_amount_from");
			}
			if(dj.byId("finance_amount_to"))
			{
				finance_amount_to = dj.byId("finance_amount_to");
			}
			if(dj.byId("os_repay_amount_from"))
			{
				os_repay_amount_from = dj.byId("os_repay_amount_from");
			}
			if(dj.byId("os_repay_amount_to"))
			{
				os_repay_amount_to = dj.byId("os_repay_amount_to");
			}
			if(dj.byId("finance_date_from"))
			{
				finance_date_from = dj.byId("finance_date_from");
			}
			if(dj.byId("finance_date_to"))
			{
				finance_date_to = dj.byId("finance_date_to");
			}
			if(dj.byId("finance_due_date_from"))
			{
				finance_due_date_from = dj.byId("finance_due_date_from");
			}
			if(dj.byId("finance_due_date_to"))
			{
				finance_due_date_to = dj.byId("finance_due_date_to");
			}

			if((finance_amount_to && finance_amount_to.get("value")!== null && finance_amount_from &&  finance_amount_from.get("value")!== null) && finance_amount_to.get("value") < finance_amount_from.get("value"))
            {
					misys.dialog.show("ERROR", misys.getLocalization("invalidMaxAmountValueError",[finance_amount_to.get("displayedValue"),finance_amount_from.get("displayedValue")]));
			}
			
			if((os_repay_amount_to && os_repay_amount_to.get("value")!== null && os_repay_amount_from &&  os_repay_amount_from.get("value")!== null) && os_repay_amount_to.get("value") < os_repay_amount_from.get("value"))
            {
					misys.dialog.show("ERROR", misys.getLocalization("invalidMaxAmountValueError",[os_repay_amount_to.get("displayedValue"),os_repay_amount_from.get("displayedValue")]));
			}
			
			if((finance_date_to && finance_date_to.get("value")!== null && finance_date_from &&  finance_date_from.get("value")!== null) && ( d.date.compare(finance_date_to.get("value"), finance_date_from.get("value")) < 0 ))
            {
					misys.dialog.show("ERROR", misys.getLocalization("financeDateToGreaterThanDateFromError",[finance_date_to.get("displayedValue"),finance_date_from.get("displayedValue")]));
			}
			
			if((finance_due_date_to && finance_due_date_to.get("value")!== null && finance_due_date_from &&  finance_due_date_from.get("value")!== null) && ( d.date.compare(finance_due_date_to.get("value"), finance_due_date_from.get("value")) < 0 ))
            {
					misys.dialog.show("ERROR", misys.getLocalization("financeDueDateToGreaterThanDueDateFromError",[finance_due_date_to.get("displayedValue"),finance_due_date_from.get("displayedValue")]));
			}
			
			
			// Get list of invoice reference IDs from the main screen
			var invoiceRefIDList = "";
			var currentItems;
			
			if(childProduct === "IP" && dj.byId("invoicePayablesGrid") && dj.byId("invoicePayablesGrid").store && dj.byId("invoicePayablesGrid").store._arrayOfAllItems && (dj.byId("invoicePayablesGrid").store._arrayOfAllItems.length > 0))
			{
				currentItems = dj.byId("invoicePayablesGrid").store._arrayOfAllItems;
				for(var i=0; i < currentItems.length; i++)
					{
						if(currentItems[i] && currentItems[i]["REFERENCEID"])
						{
							invoiceRefIDList = invoiceRefIDList + currentItems[i]["REFERENCEID"] + ",";
						}
					}
			}	
			
			else if(childProduct === "IN" && dj.byId("invoicesGrid") && dj.byId("invoicesGrid").store && dj.byId("invoicesGrid").store._arrayOfAllItems &&  (dj.byId("invoicesGrid").store._arrayOfAllItems.length > 0))
			{
				currentItems = dj.byId("invoicesGrid").store._arrayOfAllItems;
				for(var j=0; j < currentItems.length; j++)
					{
						if(currentItems[j] && currentItems[j]["REFERENCEID"])
						{
							invoiceRefIDList = invoiceRefIDList + currentItems[j]["REFERENCEID"] + ",";
						}
					}
			}
			
			// Get the values of search options to be passed for query			
			var bulk_ref_id;
			var invoice_payable_ref_id;
			var invoice_ref_id;
			var seller_name;
			var buyer_name;
			var finance_amount_from;
			var finance_amount_to;
			var os_repay_amount_from;
			var os_repay_amount_to;
			var entity;
			var issuer_ref_id;
			var program_name;
			
			if(dj.byId("ref_id"))
			{
				bulk_ref_id = dj.byId("ref_id").get("value");
			}
			if(childProduct === "IP" && dj.byId("invoice_payable_ref_id"))
			{
				invoice_ref_id = dj.byId("invoice_payable_ref_id").get("value");
			}
			if(childProduct === "IN" && dj.byId("invoice_ref_id"))
			{
				invoice_ref_id = dj.byId("invoice_ref_id").get("value");
			}
			if(dj.byId("seller_name"))
			{
				seller_name = dj.byId("seller_name").get("value");
			}
			if(dj.byId("buyer_name"))
			{
				buyer_name = dj.byId("buyer_name").get("value");
			}
			if(dj.byId("finance_amount_from"))
			{
				finance_amount_from = dj.byId("finance_amount_from");
			}
			if(dj.byId("finance_amount_to"))
			{
				finance_amount_to = dj.byId("finance_amount_to");
			}
			if(dj.byId("os_repay_amount_from"))
			{
				os_repay_amount_from = dj.byId("os_repay_amount_from");
			}
			if(dj.byId("os_repay_amount_to"))
			{
				os_repay_amount_to = dj.byId("os_repay_amount_to");
			}
			if(dj.byId("entity"))
			{
				entity = dj.byId("entity").get("value");
			}
			if(dj.byId("issuer_ref_id"))
			{
				issuer_ref_id = dj.byId("issuer_ref_id").get("value");
			}
			if(dj.byId("program_name"))
			{
				program_name = dj.byId("program_name").get("value");
			}
			
			
			m.xhrPost( {
				url : m.getServletURL("/screen/AjaxScreen/action/GetStaticData"),
				handleAs 	: "json",
				sync 		: true,
				content : {
					option : "bulk_repay",
					product_code : childProduct,
					//bulk_ref_id : bulk_ref_id,
					invoice_ref_id : invoice_ref_id,
					seller_name : seller_name,
					buyer_name : buyer_name,
					curcode : curcode,
					finance_amount_from : finance_amount_from,
					finance_amount_to : finance_amount_to,
					os_repay_amount_from : os_repay_amount_from,
					os_repay_amount_to : os_repay_amount_to,
					finance_date_from : finance_date_from,
					finance_date_to : finance_date_to,
					finance_due_date_from : finance_due_date_from,
					finance_due_date_to : finance_due_date_to,
					invoiceRefIDList : invoiceRefIDList,
					entity : entity,
					customer_reference: customerRef,
					program_name: program_name,
					issuer_ref_id: issuer_ref_id
				},
				load : function(response){
					if(childProduct === "IN")
						{
						m._showFilteredInvoicesForBulkRepay(response);
						}
					else if(childProduct === "IP")
						{
							m._showFilteredInvoicePayablesForBulkRepay(response);
						}
					
				}
			});
		},
			
		/**
		 * <h4>Summary:</h4>
		 * This function displays the invoice payables filtered to the main screen of invoice payable bulk financing
		 * <h4>Description:</h4> 
		 * @method _showFilteredInvoicesForBulkRepay
		 * 
		 */
		_showFilteredInvoicesForBulkRepay : function(response){
			var invoiceData = dj.byId("bulk_repaydata_grid");
			//set an empty store
			var emptyStore = new dojo.data.ItemFileWriteStore({data:{"identifier":"REFERENCEID","items" :[]}});
			if(response.items.length > 0)
			{
				var selItems = response.items;
				//add - update
				if(selItems.length > 0) {
					for(var i = 0 ; i<selItems.length ; i++) {
						var item=selItems[i];
						if(item !== null)
						{
							var newInvoicesItem = m.createInvoiceRepaymentItem(item);
							emptyStore.newItem(newInvoicesItem);
						}
					}
				}
				if(invoiceData)
				{
					invoiceData.setStore(emptyStore);
					dojo.style(invoiceData.domNode, "display", "");
					invoiceData.resize();
				}
			}
			else
			{
				invoiceData.setStore(emptyStore);
				dojo.style(invoiceData.domNode, "display", "");
				invoiceData.resize();
				invoiceData.render();
			}
		},
		/**
		 * <h4>Summary:</h4>
		 * This function is used to create the invoice item grid after selection of a set of invoices is done.
		 * This function is also used to validate the license allocated amount widgets with the license actual amount.
		 * @param {Object} Grid
		 * Popup Grid
		 * @param {Object} curCode
		 * currency Code Object
		 * @method processInvoiceRepayRecords
		 */
		processInvoiceRepayRecords : function( /*Dojox Grid*/ grid) {
			//Grid of selected records on the main screen.
			var invoiceData = dj.byId("invoicesGrid");
			
			//set an empty store
			var emptyStore = new dojo.data.ItemFileWriteStore({data:{"identifier":"REFERENCEID","items" :[]}});
			// Object to save grid data already present
			var existingGridObj= [];
			if(invoiceData && invoiceData.store && invoiceData.store._arrayOfTopLevelItems.length >0) {
				invoiceData.store.fetch({
					query: {REFERENCEID: '*'},
					onComplete: function(items, request){
						dojo.forEach(items, function(item){
							var newItem1 = m.createInvoiceRepaymentItem(item);
							emptyStore.newItem(newItem1);
							existingGridObj.push(item);
						});
					}
				});
			}
			var selItems = grid.selection.getSelected();
			//add - update
			if(selItems.length > 0) {
				for(var i = 0 ; i<selItems.length ; i++) {
					var isDup= false;
					var amount = "";
					var newItem = {};
					var item=selItems[i];
					if(item !== null)
					{
						var newInvoicesItem = m.createInvoiceRepaymentItem(item);
						//If Invoices have already been selected, check the selected record is not in the list and then add.
						if(existingGridObj.length > 0) {
							for(var t=0;t<existingGridObj.length ; t++) {
								if(existingGridObj[t].REFERENCEID.slice().toString() === item.REFERENCEID.slice().toString())	{
									isDup = true;
								}
							}
							if(!isDup) {
								emptyStore.newItem(newInvoicesItem);
							}
						}
						else {
							emptyStore.newItem(newInvoicesItem);
						}
					}
				}
				if(invoiceData)
				{
					invoiceData.setStore(emptyStore);
					dojo.style(invoiceData.domNode, "display", "");
					invoiceData.resize();
				}
				dj.byId("xhrDialog").hide();
			}
			else
			{
				misys.dialog.show("ERROR", misys.getLocalization("invoicePayableShouldBeSelected"));
			}
		},
		/**
		 * <h4>Summary:</h4>
		 * This function is used to create an invoice payable record for the repayment grid
		 * @method createInvoiceRepaymentItem
		 */
		createInvoiceRepaymentItem: function(/* Object */ item) {
			
			var refId = item.REFERENCEID.slice().toString();
			var issuerRefId = item.INVOICE_REFERENCE_LABEL.slice().toString();
			//var entity = item.ENTITY.slice().toString();			
			var program = item.PROGRAM_NAME.slice().toString();
			var entityBuyerName = item.BUYER_NAME.slice().toString();
			var sellerName = item.SELLER_NAME.slice().toString();
			var curCode = item.CURCODE.slice().toString();
			var financeAmount = item.FINANCE_AMOUNT;
			var invoiceAmount = item.INVOICE_AMOUNT;
			var osRepayAmount = item.OUTSTANDING_REPAY_AMOUNT;
			var totalRepayAmount = item.TOTAL_REPAID_AMOUNT;
			var financeIssueDate = item.FINANCE_ISSUE_DATE.slice().toString();
			var financeDueDate = item.FINANCE_DUE_DATE.slice().toString();
			var status = item.STATUS;
			var deleteIconPath = "";
			if(d.byId("delete_icon") != null && d.byId("delete_icon"))
			{
				deleteIconPath = d.byId("delete_icon").value;
			}
			var actn= "<img src="+deleteIconPath+" onClick =\"javascript:misys.deleteItemFromBulkGrid('invoicesGrid','" + item.REFERENCEID + "')\"/>";
				
			var invoiceItem = {"REFERENCEID" : refId, "INVOICE_REFERENCE_LABEL" : issuerRefId, "PROGRAM_NAME" : program, "ACTION" : actn, "BUYER_NAME" : entityBuyerName,
					"SELLER_NAME" : sellerName, "CURCODE" : curCode, "FINANCE_AMOUNT" : financeAmount, "INVOICE_AMOUNT" : invoiceAmount ,"OUTSTANDING_REPAY_AMOUNT" : osRepayAmount,"TOTAL_REPAID_AMOUNT" : totalRepayAmount,
					"FINANCE_ISSUE_DATE" : financeIssueDate, "FINANCE_DUE_DATE": financeDueDate, "STATUS" : status};
			
			return invoiceItem;
		},
		
		/**
		 * <h4>Summary:</h4>
		 * This function is used to delete a particular record, from the list added to bulk.
		 * @param {String} Grid - Name of the grid to be modified
		 * @param {String} Reference
		 * Reference Id of the row to be deleted
		 * @method deleteItemFromBulkGrid
		 */
		deleteItemFromBulkGrid : function(/*String*/ grid, /*String*/ ref) {
			var items=[];
			dj.byId(grid).store.fetch({
				query: {REFERENCEID: '*'},
				onComplete: dojo.hitch(dj.byId(grid), function(items, request){
					dojo.forEach(items, function(item){
						if(item.REFERENCEID.slice().toString() === ref.slice().toString())
						{
							dj.byId(grid).store.deleteItem(item);
						}
					});
				})
			});
			
			dj.byId(grid).resize();
			dj.byId(grid).render();
		},
		
		/**
		 * <h4>Summary:</h4>
		 * This function is to get the invoice payables linked to bulk financing based on the bulk ref id
		 * <h4>Description:</h4> 
		 * @method getFinancesSelectedForBulkRepayment
		 * 
		 */
		getFinancesSelectedForBulkRepayment : function(childProduct)
		{
			// Get the values of search options to be passed for query			
			var bulk_ref_id;
			
			if(dj.byId("ref_id"))
			{
				bulk_ref_id = dj.byId("ref_id").get("value");
			}
			
					m.xhrPost( {
						url : m.getServletURL("/screen/AjaxScreen/action/GetStaticData"),
						handleAs 	: "json",
						sync 		: true,
						content : {
							option : "bulk_repay_linked",
							product_code : childProduct,
							bulk_ref_id : bulk_ref_id						},
						load : function(response){
							if(childProduct === "IN")
								{
								m._showSelectedInvoicesForBulkRepayment(response);
								}
							else if(childProduct === "IP")
								{
									m._showSelectedInvoicePayablesForBulkRepayment(response);
								}
						}
					});
		},
		/**
		 * <h4>Summary:</h4>
		 * This function displays the invoices filtered to the main screen of bulk repayment.
		 * <h4>Description:</h4> 
		 * @method _showSelectedInvoicesForBulkRepayment
		 * 
		 */
		_showSelectedInvoicesForBulkRepayment : function (response){
			var invoiceData = dj.byId("invoicesGrid");
			//set an empty store
			var emptyStore = new dojo.data.ItemFileWriteStore({data:{"identifier":"REFERENCEID","items" :[]}});
			if(response.items.length > 0)
			{
				var selItems = response.items;
				//add - update
				if(selItems.length > 0) {
					for(var i = 0 ; i<selItems.length ; i++) {
						var item=selItems[i];
						if(item !== null)
						{
							var newInvoicesItem = m.createInvoiceRepaymentItem(item);
							emptyStore.newItem(newInvoicesItem);
						}
					}
				}
				if(invoiceData)
				{
					invoiceData.setStore(emptyStore);
					dojo.style(invoiceData.domNode, "display", "");
					invoiceData.resize();
				}
			}
			else
			{
				invoiceData.setStore(emptyStore);
				dojo.style(invoiceData.domNode, "display", "");
				invoiceData.resize();
				invoiceData.render();
			}
		},
		/**
		 * <h4>Summary:</h4>
		 * This function displays the invoice payables filtered to the main screen of bulk repayment.
		 * <h4>Description:</h4> 
		 * @method _showSelectedInvoicePayablesForBulkRepayment
		 * 
		 */
		_showSelectedInvoicePayablesForBulkRepayment : function (response){
			var invoiceData = dj.byId("invoicePayablesGrid");
			//set an empty store
			var emptyStore = new dojo.data.ItemFileWriteStore({data:{"identifier":"REFERENCEID","items" :[]}});
			if(response.items.length > 0)
			{
				var selItems = response.items;
				//add - update
				if(selItems.length > 0) {
					for(var i = 0 ; i<selItems.length ; i++) {
						var item=selItems[i];
						if(item !== null)
						{
							var newInvoicesItem = m.createInvoicePayableRepaymentItem(item);
							emptyStore.newItem(newInvoicesItem);
						}
					}
				}
				if(invoiceData)
				{
					invoiceData.setStore(emptyStore);
					dojo.style(invoiceData.domNode, "display", "");
					invoiceData.resize();
				}
			}
			else
			{
				invoiceData.setStore(emptyStore);
				dojo.style(invoiceData.domNode, "display", "");
				invoiceData.resize();
				invoiceData.render();
			}
		},
		validateRepayDate : function()
		{
			console.debug("Start Execute validateRepayDateWithInvoiceDate");
			var bulkRepayDate = dj.byId("bk_repay_date");
			if(!dj.byId("bk_repay_date").get("value"))
			{
				return true;
			}
			var currentDate = new Date();
			// set the hours to 0 to compare the date values
			currentDate.setHours(0, 0, 0, 0);
			
			var isValid = d.date.compare(m.localizeDate(bulkRepayDate),currentDate) < 0 ? false : true;
			if(!isValid) {
				this.invalidMessage  = m.getLocalization("repayDateNotGreaterThanCurrentDate");
				//bulkRepayDate.set("state","Error");
		 		dj.hideTooltip(bulkRepayDate.domNode);
		 		dj.showTooltip(this.invalidMessage, bulkRepayDate.domNode, 0);
				return false;
			}
			console.debug("End validateRepayDateWithInvoiceDate");
			return true;
		},
		
		/**
		 * <h4>Summary:</h4>
		 * This function displays the invoice payables filtered to the main screen of invoice payable bulk financing
		 * <h4>Description:</h4> 
		 * @method _showFilteredInvoicePayablesForBulkRepay
		 * 
		 */
		_showFilteredInvoicePayablesForBulkRepay : function(response){
			var invoiceData = dj.byId("bulk_repaydata_grid");
			//set an empty store
			var emptyStore = new dojo.data.ItemFileWriteStore({data:{"identifier":"REFERENCEID","items" :[]}});
			if(response.items.length > 0)
			{
				var selItems = response.items;
				//add - update
				if(selItems.length > 0) {
					for(var i = 0 ; i<selItems.length ; i++) {
						var item=selItems[i];
						if(item !== null)
						{
							var newInvoicesItem = m.createInvoicePayableRepaymentItem(item);
							emptyStore.newItem(newInvoicesItem);
						}
					}
				}
				if(invoiceData)
				{
					invoiceData.setStore(emptyStore);
					dojo.style(invoiceData.domNode, "display", "");
					invoiceData.resize();
				}
			}
			else
			{
				invoiceData.setStore(emptyStore);
				dojo.style(invoiceData.domNode, "display", "");
				invoiceData.resize();
				invoiceData.render();
			}
		},
		/**
		 * <h4>Summary:</h4>
		 * This function is used to create an invoice payable record for the repayment grid
		 * @method createInvoicePayableRepaymentItem
		 */
		createInvoicePayableRepaymentItem: function(/* Object */ item) {
			
			var refId = item.REFERENCEID.slice().toString();
			var issuerRefId = item.INVOICE_REFERENCE_LABEL.slice().toString();
			//var entity = item.ENTITY.slice().toString();			
			var program = item.PROGRAM_NAME.slice().toString();
			var entityBuyerName = item.BUYER_NAME.slice().toString();
			var sellerName = item.SELLER_NAME.slice().toString();
			var curCode = item.CURCODE.slice().toString();
			var financeAmount = item.FINANCE_AMOUNT;
			var invoiceAmount = item.INVOICE_AMOUNT;
			var osRepayAmount = item.OUTSTANDING_REPAY_AMOUNT;
			var totalRepayAmount = item.TOTAL_REPAID_AMOUNT;
			var financeIssueDate = item.FINANCE_ISSUE_DATE.slice().toString();
			var financeDueDate = item.FINANCE_DUE_DATE.slice().toString();
			var status = item.STATUS;
			var deleteIconPath = "";
			if(d.byId("delete_icon") != null && d.byId("delete_icon"))
			{
				deleteIconPath = d.byId("delete_icon").value;
			}
			var actn= "<img src="+deleteIconPath+" onClick =\"javascript:misys.deleteItemFromBulkGrid('invoicePayablesGrid','" + item.REFERENCEID + "')\"/>";
			var invoiceItem = {"REFERENCEID" : refId, "INVOICE_REFERENCE_LABEL" : issuerRefId, "PROGRAM_NAME" : program, "ACTION" : actn, "BUYER_NAME" : entityBuyerName, "SELLER_NAME" : sellerName, "CURCODE" : curCode, 
					"FINANCE_AMOUNT" : financeAmount, "INVOICE_AMOUNT" : invoiceAmount, "OUTSTANDING_REPAY_AMOUNT" : osRepayAmount,"TOTAL_REPAID_AMOUNT" : totalRepayAmount, "FINANCE_ISSUE_DATE" : financeIssueDate, 
					"FINANCE_DUE_DATE": financeDueDate, "STATUS" : status};
			
			return invoiceItem;
		},
		
		/**
		 * <h4>Summary:</h4>
		 * This function is used to create the invoice item grid after selection of a set of invoices is done.
		 * This function is also used to validate the license allocated amount widgets with the license actual amount.
		 * @param {Object} Grid
		 * Popup Grid
		 * @param {Object} curCode
		 * currency Code Object
		 * @method processLicenseRecords
		 */
		processInvoicePayableRepayRecords : function( /*Dojox Grid*/ grid) {
			//Grid of selected records on the main screen.
			var invoiceData = dj.byId("invoicePayablesGrid");
			
			//set an empty store
			var emptyStore = new dojo.data.ItemFileWriteStore({data:{"identifier":"REFERENCEID","items" :[]}});
			// Object to save grid data already present
			var existingGridObj= [];
			if(invoiceData && invoiceData.store && invoiceData.store._arrayOfTopLevelItems.length >0) {
				invoiceData.store.fetch({
					query: {REFERENCEID: '*'},
					onComplete: function(items, request){
						dojo.forEach(items, function(item){
							var newItem1 = m.createInvoicePayableRepaymentItem(item);
							emptyStore.newItem(newItem1);
							existingGridObj.push(item);
						});
					}
				});
			}
			var selItems = grid.selection.getSelected();
			//add - update
			if(selItems.length > 0) {
				for(var i = 0 ; i<selItems.length ; i++) {
					var isDup= false;
					var amount = "";
					var newItem = {};
					var item=selItems[i];
					if(item !== null)
					{
						var newInvoicesItem = m.createInvoicePayableRepaymentItem(item);
						//If Invoices have already been selected, check the selected record is not in the list and then add.
						if(existingGridObj.length > 0) {
							for(var t=0;t<existingGridObj.length ; t++) {
								if(existingGridObj[t].REFERENCEID.slice().toString() === item.REFERENCEID.slice().toString())	{
									isDup = true;
								}
							}
							if(!isDup) {
								emptyStore.newItem(newInvoicesItem);
							}
						}
						else {
							emptyStore.newItem(newInvoicesItem);
						}
					}
				}
				if(invoiceData)
				{
					invoiceData.setStore(emptyStore);
					dojo.style(invoiceData.domNode, "display", "");
					invoiceData.resize();
				}
				dj.byId("xhrDialog").hide();
			}
			else
			{
				misys.dialog.show("ERROR", misys.getLocalization("invoicePayableShouldBeSelected"));
			}
		},
		
		/**
		 * <h4>Summary:</h4>
		 * This function is to get the invoice payables linked to bulk financing based on the bulk ref id
		 * <h4>Description:</h4> 
		 * @method getInvoicePayablesForBulkLinkedFiltered
		 * 
		 */
		getInvoicePayablesForBulkRepaymentLinkedFiltered : function()
		{
			// Get the values of search options to be passed for query			
			var bulk_ref_id;
			
			if(dj.byId("ref_id"))
			{
				bulk_ref_id = dj.byId("ref_id").get("value");
			}
			
					m.xhrPost( {
						url : m.getServletURL("/screen/AjaxScreen/action/GetStaticData"),
						handleAs 	: "json",
						sync 		: true,
						content : {
							option : "bulk_repay_linked",
							product_code : "IP",
							bulk_ref_id : bulk_ref_id						},
						load : function(response){
							m._showFilteredInvoicePayablesForBulkRepaymentLinked(response);
						}
					});
		},
		/**
		 * <h4>Summary:</h4>
		 * This function displays the invoices filtered to the main screen of invoice payable bulk financing
		 * <h4>Description:</h4> 
		 * @method _showFilteredInvoicePayablesForBulkRepaymentLinked
		 * 
		 */
		_showFilteredInvoicePayablesForBulkRepaymentLinked : function(response){
			var invoiceData = dj.byId("invoicePayablesGrid");
			//set an empty store
			var emptyStore = new dojo.data.ItemFileWriteStore({data:{"identifier":"REFERENCEID","items" :[]}});
			if(response.items.length > 0)
			{
				var selItems = response.items;
				//add - update
				if(selItems.length > 0) {
					for(var i = 0 ; i<selItems.length ; i++) {
						var item=selItems[i];
						if(item !== null)
						{
							var newInvoicesItem = m.createInvoicePayableRepaymentItem(item);
							emptyStore.newItem(newInvoicesItem);
						}
					}
				}
				if(invoiceData)
				{
					invoiceData.setStore(emptyStore);
					dojo.style(invoiceData.domNode, "display", "");
					invoiceData.resize();
				}
			}
			else
			{
				invoiceData.setStore(emptyStore);
				dojo.style(invoiceData.domNode, "display", "");
				invoiceData.resize();
				invoiceData.render();
			}
		},
		/**
		 * <h4>Summary:</h4>
		 * This function is to get the invoice payables eligible for bulk financing based on the criteria
		 * <h4>Description:</h4> 
		 * @method getInvoicePayablesForBulkRepayFiltered
		 * 
		 */
		getInvoicePayablesForBulkRepayFiltered : function()
		{
			
			var customerRef;			
			if(dj.byId("issuing_bank_customer_reference"))
			{
				customerRef = dj.byId("issuing_bank_customer_reference").get("value");
			}
			
			if (!customerRef)
			{
				misys.dialog.show("ERROR", misys.getLocalization("customerReferenceRequiredForBulkFinancingSearch"));
				return;
			}
			
			var curcode;
			if(dj.byId("curCode"))
			{
				curcode = dj.byId("curCode").get("value");
			}
			if ( !m.validateCurrencyCode(curcode)){
				misys.dialog.show("ERROR", misys.getLocalization("invalidCurrencyError",[curcode]));
				return;
			}
						
			var finance_date_from;
			var finance_date_to;
			var finance_due_date_from;
			var finance_due_date_to;
			if(dj.byId("finance_amount_from"))
			{
				finance_amount_from = dj.byId("finance_amount_from");
			}
			if(dj.byId("finance_amount_to"))
			{
				finance_amount_to = dj.byId("finance_amount_to");
			}
			if(dj.byId("os_repay_amount_from"))
			{
				os_repay_amount_from = dj.byId("os_repay_amount_from");
			}
			if(dj.byId("os_repay_amount_to"))
			{
				os_repay_amount_to = dj.byId("os_repay_amount_to");
			}
			if(dj.byId("finance_date_from"))
			{
				finance_date_from = dj.byId("finance_date_from");
			}
			if(dj.byId("finance_date_to"))
			{
				finance_date_to = dj.byId("finance_date_to");
			}
			if(dj.byId("finance_due_date_from"))
			{
				finance_due_date_from = dj.byId("finance_due_date_from");
			}
			if(dj.byId("finance_due_date_to"))
			{
				finance_due_date_to = dj.byId("finance_due_date_to");
			}

			if((finance_amount_to && finance_amount_to.get("value")!== null && finance_amount_from &&  finance_amount_from.get("value")!== null) && finance_amount_to.get("value") < finance_amount_from.get("value"))
            {
					misys.dialog.show("ERROR", misys.getLocalization("invalidMaxAmountValueError",[finance_amount_to.get("displayedValue"),finance_amount_from.get("displayedValue")]));
			}
			
			if((os_repay_amount_to && os_repay_amount_to.get("value")!== null && os_repay_amount_from &&  os_repay_amount_from.get("value")!== null) && os_repay_amount_to.get("value") < os_repay_amount_from.get("value"))
            {
					misys.dialog.show("ERROR", misys.getLocalization("invalidMaxAmountValueError",[os_repay_amount_to.get("displayedValue"),os_repay_amount_from.get("displayedValue")]));
			}
			
			if((finance_date_to && finance_date_to.get("value")!== null && finance_date_from &&  finance_date_from.get("value")!== null) && ( d.date.compare(finance_date_to.get("value"), finance_date_from.get("value")) < 0 ))
            {
					misys.dialog.show("ERROR", misys.getLocalization("financeDateToGreaterThanDateFromError",[finance_date_to.get("displayedValue"),finance_date_from.get("displayedValue")]));
			}
			
			if((finance_due_date_to && finance_due_date_to.get("value")!== null && finance_due_date_from &&  finance_due_date_from.get("value")!== null) && ( d.date.compare(finance_due_date_to.get("value"), finance_due_date_from.get("value")) < 0 ))
            {
					misys.dialog.show("ERROR", misys.getLocalization("financeDueDateToGreaterThanDueDateFromError",[finance_due_date_to.get("displayedValue"),finance_due_date_from.get("displayedValue")]));
			}
			
			
			// Get list of invoice reference IDs from the main screen
			var invoiceRefIDList = "";
			if(dj.byId("invoicePayablesGrid") && dj.byId("invoicePayablesGrid").store && dj.byId("invoicePayablesGrid").store._arrayOfAllItems &&  dj.byId("invoicePayablesGrid").store._arrayOfAllItems.length)
			{
				var currentItems = dj.byId("invoicePayablesGrid").store._arrayOfAllItems;
				for(var i=0; i < currentItems.length; i++)
					{
						if(currentItems[i] && currentItems[i]["REFERENCEID"])
						{
							invoiceRefIDList = invoiceRefIDList + currentItems[i]["REFERENCEID"] + ",";
						}
					}
			}	
			
			// Get the values of search options to be passed for query			
			var bulk_ref_id;
			var invoice_payable_ref_id;
			var seller_name;
			var finance_amount_from;
			var finance_amount_to;
			var os_repay_amount_from;
			var os_repay_amount_to;
			var entity;
			
			if(dj.byId("ref_id"))
			{
				bulk_ref_id = dj.byId("ref_id").get("value");
			}
			if(dj.byId("invoice_payable_ref_id"))
			{
				invoice_payable_ref_id = dj.byId("invoice_payable_ref_id").get("value");
			}
			if(dj.byId("seller_name"))
			{
				seller_name = dj.byId("seller_name").get("value");
			}
			if(dj.byId("finance_amount_from"))
			{
				finance_amount_from = dj.byId("finance_amount_from");
			}
			if(dj.byId("finance_amount_to"))
			{
				finance_amount_to = dj.byId("finance_amount_to");
			}
			if(dj.byId("os_repay_amount_from"))
			{
				os_repay_amount_from = dj.byId("os_repay_amount_from");
			}
			if(dj.byId("os_repay_amount_to"))
			{
				os_repay_amount_to = dj.byId("os_repay_amount_to");
			}
			if(dj.byId("entity"))
			{
				entity = dj.byId("entity").get("value");
			}
			
			m.xhrPost( {
				url : m.getServletURL("/screen/AjaxScreen/action/GetStaticData"),
				handleAs 	: "json",
				sync 		: true,
				content : {
					option : "bulk_repay",
					product_code : "IP",
					//bulk_ref_id : bulk_ref_id,
					invoice_ref_id : invoice_payable_ref_id,
					seller_name : seller_name,
					curcode : curcode,
					finance_amount_from : finance_amount_from,
					finance_amount_to : finance_amount_to,
					os_repay_amount_from : os_repay_amount_from,
					os_repay_amount_to : os_repay_amount_to,
					finance_date_from : finance_date_from,
					finance_date_to : finance_date_to,
					finance_due_date_from : finance_due_date_from,
					finance_due_date_to : finance_due_date_to,
					invoiceRefIDList : invoiceRefIDList,
					entity : entity,
					customer_reference: customerRef
				},
				load : function(response){
					m._showFilteredInvoicePayablesForBulkRepay(response);
				}
			});
		},
		
		clearInvoiceGrid : function(/*String*/ grid){
			var invoiceData = dj.byId(grid);
			
			var invoiceRefIDList = "";
			if(dj.byId(grid) && dj.byId(grid).store && dj.byId(grid).store._arrayOfAllItems &&  (dj.byId(grid).store._arrayOfAllItems.length > 0))
			{
				var currentItems = dj.byId(grid).store._arrayOfAllItems;
				for(var i=0; i < currentItems.length; i++)
					{
						if(currentItems[i] && currentItems[i]["REFERENCEID"])
						{
							invoiceRefIDList = invoiceRefIDList + currentItems[i]["REFERENCEID"] + ",";
						}
					}
			}	
			//set an empty store
			var emptyStore = new dojo.data.ItemFileWriteStore({data:{"identifier":"REFERENCEID","items" :[]}});
			invoiceData.setStore(emptyStore);
			invoiceData.resize();
			m.resetBulkInvoiceOnEntityChange(invoiceRefIDList);
		},
		
		setTotalRepaymentAmount : function (gridname)
		{			
			var bk_sum_amt = 0;
			if(dj.byId(gridname) && dj.byId(gridname).store && dj.byId(gridname).store._arrayOfAllItems &&  dj.byId(gridname).store._arrayOfAllItems.length && (dj.byId(gridname).store._arrayOfAllItems.length > 0))
			{
				var currentItems = dj.byId(gridname).store._arrayOfAllItems;
				for(var i=0; i < currentItems.length; i++)
				{
					if(currentItems[i] && currentItems[i]["OUTSTANDING_REPAY_AMOUNT"])
					{
						var osRepayAmt = currentItems[i]["OUTSTANDING_REPAY_AMOUNT"][0];
						if (d.isString(osRepayAmt))
						{
							var convertedValue = d.number.parse(osRepayAmt);
						}
						var currency = currentItems[i]["CURCODE"][0];
						
						var osRepayAmtInBaseCcy = m.financeAmtInBaseCcyBulkRepay(convertedValue,currency);
						bk_sum_amt = bk_sum_amt + parseFloat(osRepayAmtInBaseCcy);
					}
				}
				if(bk_sum_amt !== 0)
				{
					dj.byId("bk_total_amt").set("value", bk_sum_amt);
					dj.byId("bk_total_cur_code").set("value", dj.byId("base_ccy").get("value"));
				}
				else
				{
					dj.byId("bk_total_amt").set("value", "");
					dj.byId("bk_total_cur_code").set("value", "");
				}
			}
			else
			{
				dj.byId("bk_total_amt").set("value", "");
				dj.byId("bk_total_cur_code").set("value", "");
			}
		},
		
		/**
		 * Bulk Repayment Total Amount Calculation
		 */
		financeAmtInBaseCcyBulkRepay : function(osRepayAmt,currency)
		{
			var bankAbbvName = "";
			var baseCurrency;
			if(dj.byId("base_ccy"))
			{
				baseCurrency = dj.byId("base_ccy").get("value");					
			}
			if(baseCurrency === currency)
			{
				return osRepayAmt;
			}
			else
			{
				if(dj.byId("issuing_bank_abbv_name") && dj.byId("issuing_bank_abbv_name").get("value")!== "")
				{
					bankAbbvName = dj.byId("issuing_bank_abbv_name").get("value");
				}
				var convertedAmount;
	        	m.xhrPost({
					url : m.getServletURL("/screen/AjaxScreen/action/GetConvertedAmount"),
					handleAs :"json",
					sync : true,
					content : {
						original_amt : osRepayAmt,
						src_curr : currency,
						dest_curr : baseCurrency
					},
					load : function(response, args){
						convertedAmount = response.convertedAmount;
					},
					error : function(response, args){
						console.error("[misys.openaccount.BulkRepaymentEvents] financeAmtInBaseCcyBulkRepay error", response);
					}
				});
	        	return convertedAmount;
			}
		},

		/**
		 * <h4>Summary:</h4>
		 * This function validates that From Date is lesser than To Date.
		 * @method validateFinanceFromDate
		 * <h4>Description:</h4> 
		 * </br>Checks if From Date is greater than To Date and sets an error on From Date.
		 * @return {} 
		 * 
		 */
		validateFinanceFromDate : function(fromDate, toDate)
		{
			console.debug("Start Execute validateFinanceFromDate");
			if(!m.compareDateFields(fromDate, toDate)) {
				var displayMessage = m.getLocalization("fromDateLessThanToDateError", [m.localizeDate(fromDate),m.localizeDate(toDate)]);
				fromDate.focus();
				fromDate.set("state","Error");
		 		dj.hideTooltip(fromDate.domNode);
		 		dj.showTooltip(displayMessage, fromDate.domNode, 0);
			}
			console.debug("End validateFinanceFromDate");
		},
		/**
		 * <h4>Summary:</h4>
		 * This function validates that To Date is greater than From Date.
		 * @method validateFinanceToDate
		 * <h4>Description:</h4> 
		 * </br>Checks if To Date is lesser than From Date and sets an error on To Date.
		 * @return {} 
		 * 
		 */
		validateFinanceToDate : function(fromDate, toDate)
		{
			console.debug("Start Execute validateFinanceToDate");
			if(!m.compareDateFields(fromDate, toDate)) {
				var displayMessage = m.getLocalization("toDateLessThanFromDateError", [m.localizeDate(toDate),m.localizeDate(fromDate)]);
				toDate.focus();
				toDate.set("state","Error");
		 		dj.hideTooltip(toDate.domNode);
		 		dj.showTooltip(displayMessage, toDate.domNode, 0);
			}
			console.debug("End validateFinanceToDate");
		},
		/**
		 * <h4>Summary:</h4>
		 * This function validates that From Amount is lesser than To Amount.
		 * @method validateFromAmountBulkRepay
		 * <h4>Description:</h4> 
		 * </br>Checks if From Amount is greater than To Amount and sets an error on From Amount.
		 * @return {} 
		 * 
		 */
		validateFromAmountBulkRepay : function(fromAmt, toAmt)
		{
			console.debug("Start Execute validateFromAmountBulkRepay");
			var amountFrom = fromAmt ? fromAmt.get("value") : "";
			var amountTo = toAmt ? toAmt.get("value") : "";
			var displayMessage;
			if(amountFrom !== "" && amountFrom <= 0)
			{
				displayMessage = misys.getLocalization('invalidAmountError');
				fromAmt.focus();
				fromAmt.set("state","Error");
		 		dj.hideTooltip(fromAmt.domNode);
		 		dj.showTooltip(displayMessage, fromAmt.domNode, 0);
		 		dj.showTooltip(displayMessage, domNode, 0);
				 
			}
			if(amountFrom !== "" && amountTo !== "" && amountFrom > amountTo)
			{
				displayMessage = misys.getLocalization('invalidMinAmountValueError');
				fromAmt.focus();
				fromAmt.set("state","Error");
		 		dj.hideTooltip(fromAmt.domNode);
		 		dj.showTooltip(displayMessage, fromAmt.domNode, 0);
		 		dj.showTooltip(displayMessage, domNode, 0);
			}
			console.debug("End validateFromAmountBulkRepay");
		},
		
		/**
		 * <h4>Summary:</h4>
		 * This function is used to close the pop up in bulk repayment
		 * @param {Object} Grid
		 * Popup Grid
		 * @method closeRepaymentGrid
		 */
		closeRepaymentGrid : function( /*Dojox Grid*/ grid) {
			dj.byId("xhrDialog").hide();
		},
		
		/**
		 * <h4>Summary:</h4>
		 * This function validates that To Amount is greater than From Amount.
		 * @method validateToAmountBulkRepay
		 * <h4>Description:</h4> 
		 * </br>Checks if To Amount is lesser than From Amount and sets an error on To Amount.
		 * @return {} 
		 * 
		 */
		validateToAmountBulkRepay : function(toAmt, fromAmt)
		{
			console.debug("Start Execute validateToAmountBulkRepay");
			var amountTo = toAmt ? toAmt.get("value") : "";
			var amountFrom = fromAmt ? fromAmt.get("value") : "";
			var displayMessage;
			if(amountTo !== "" && amountTo <= 0)
			{
				displayMessage = misys.getLocalization('invalidAmountError');
				toAmt.focus();
				toAmt.set("state","Error");
		 		dj.hideTooltip(toAmt.domNode);
		 		dj.showTooltip(displayMessage, toAmt.domNode, 0);
		 		dj.showTooltip(displayMessage, domNode, 0);
				 
			}
			if(amountTo !== "" && amountFrom !== "" && amountTo < amountFrom)
			{
				displayMessage = misys.getLocalization('invalidMaxAmountValueError');
				toAmt.focus();
				toAmt.set("state","Error");
		 		dj.hideTooltip(toAmt.domNode);
		 		dj.showTooltip(displayMessage, toAmt.domNode, 0);
		 		dj.showTooltip(displayMessage, domNode, 0);
			}
			console.debug("End Execute validateToAmountBulkRepay");
		},
	//************************ BULK REPAYMENT METHODS END *******************				
		
		resetBulkInvoiceOnEntityChange : function(invoiceRefIDList)
		{	
			// Get the values of search options to be passed for query			
			var bulk_ref_id;
			var invoice_ref_id;
			var seller_name;
			var entity;
			var tnxID;
			var product_code;
			var sub_product_code;
			if(dj.byId("tnx_id"))
			{
				tnxID = dj.byId("tnx_id").get("value");
			}
			if(dj.byId("ref_id"))
			{
				bulk_ref_id = dj.byId("ref_id").get("value");
			}
			if(dj.byId("invoice_ref_id"))
			{
				invoice_ref_id = dj.byId("invoice_ref_id").get("value");
			}
			if(dj.byId("entity"))
			{
				entity = dj.byId("entity").get("value");
			}
			if(dj.byId("child_product_code"))
			{
				product_code = dj.byId("child_product_code").get("value");
			}
			if(dj.byId("sub_product_code"))
			{
				sub_product_code = dj.byId("sub_product_code").get("value");
			}
			
					m.xhrPost( {
						url : m.getServletURL("/screen/AjaxScreen/action/GetStaticData"),
						handleAs 	: "json",
						sync 		: true,
						content : {
							option : "reset_invoice_on_entity_change",
							product_code : product_code,
							sub_product_code : sub_product_code,
							bulk_ref_id : bulk_ref_id,
							tnxID : tnxID,
							invoice_ref_id : invoice_ref_id,
							invoiceRefIDList : invoiceRefIDList,
							entity : entity
						}
					});
		}
	}); 
})(dojo, dijit, misys);