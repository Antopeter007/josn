/*
 * ---------------------------------------------------------- 
 * Event Binding for Bulk Repayment in Invoice Payable
 * Copyright (c) 2000-2017 Misys (http://www.misys.com),
 * All Rights Reserved. 
 * 
 * version: 1.0
 * date: 12/07/17
 * author: Meenal Sahasrabudhe
 * ----------------------------------------------------------
 */
dojo.provide("misys.binding.openaccount.create_ip_bk_repayment");
dojo.require("misys.openaccount.BulkRepaymentEvents");
dojo.require("misys.form.common");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {
	
	d.mixin(m._config, {
		

		xmlTransform : function (/*String*/ xml) {
			var tdXMLStart = "<bk_tnx_record>";
			/*
			 * Add invoice items tags, only in case of bulk repayment transaction.
			 * Else pass the input xml, without modification. (Ex : for create beneficiary from popup.)
			 */
			if(xml.indexOf(tdXMLStart) !== -1){
				// Setup the root of the XML string
				var xmlRoot = m._config.xmlTagName,
				transformedXml = xmlRoot ? ["<", xmlRoot, ">"] : [],			
						tdXMLEnd   = "</bk_tnx_record>",
						subTDXML	= "",
						selectedIndex = -1;
				subTDXML = xml.substring(tdXMLStart.length,(xml.length-tdXMLEnd.length));
				transformedXml.push(subTDXML);
				if(dj.byId("invoicePayablesGrid"))
				{
					transformedXml.push("<invoice_payable_items>");
					var grid = dj.byId("invoicePayablesGrid");
					var numRows = grid.rowCount;
					
					for (var i = 0; i < numRows; i++){
						var item = grid.getItem(i);
						transformedXml.push("<invoice_payable>");
						transformedXml.push("<invoice_payable_ref_id>",grid.store.getValue(item, "REFERENCEID"),"</invoice_payable_ref_id>");
						transformedXml.push("<outstanding_repayment_amt>",grid.store.getValue(item, "OUTSTANDING_REPAY_AMOUNT"),"</outstanding_repayment_amt>");
						transformedXml.push("</invoice_payable>");
					}
					transformedXml.push("</invoice_payable_items>");
				}
				if(xmlRoot) {
					transformedXml.push("</", xmlRoot, ">");
				}
				return transformedXml.join("");
			}else{
				return xml;
			}

		},
	
		initReAuthParams : function(){	
						console.debug("[misys.binding.openaccount.create_ip_bk_repayment] Bulk Method Start: initReAuthParams");
						var entity = dj.byId("entity") ? dj.byId("entity").get("value") : "";
			var reAuthParams = { 	productCode : "BK",
			         				subProductCode : dj.byId("sub_product_code") ? dj.byId("sub_product_code").get("value") :"",
			        				transactionTypeCode : "01",
			        				entity : entity,		        				
			        				currency : dj.byId("bk_total_amt_cur_code") ? dj.byId("bk_total_amt_cur_code").get("value") : "",
			        				amount : dj.byId("bk_total_amt") ? m.trimAmount(dj.byId("bk_total_amt").get("value")) : "",
			        				
			        				es_field1 : dj.byId("bk_total_amt") ? m.trimAmount(dj.byId("bk_total_amt").get("value")) : "", 
			        				es_field2 : ""
								  };
						console.debug("[misys.binding.openaccount.create_ip_bk_repayment] Bulk Method End: initReAuthParams");
			return reAuthParams;
		}
		});
	
	d.mixin(m, {
		/**
		 * This function binds validation and events to fields to the form.
		 * @method bind
		 */
		
		bind : function() {
			m.connect("finance_lookup","onClick", function(){
				var entity = dj.byId("entity");
				if(entity && (entity.get("value") === "")){
						m.dialog.show("ERROR", m.getLocalization("selectEntityFirst"));
						return false;
				}
				var customerReference = dj.byId("issuing_bank_customer_reference");
				if(customerReference && (customerReference.get("value") === "")){
						m.dialog.show("ERROR", m.getLocalization("selectIssuerReference"));
						return false;
				}
				if(entity !== null && entity !== undefined) {
					entity = entity.get("value");
				} else {
					entity = "";	
				}
				if(customerReference !== null && customerReference !== undefined) {
					customerReference = customerReference.get("value");
				}else {
					customerReference = "";	
				}
				m.getFinancesForBulkRepayment("IP",entity,customerReference);
				return true;
			});
			m.setValidation("bk_repay_date", m.validateRepayDate);
			m.connect("invoicePayablesGrid", "_onFetchComplete", function(){
				m.setTotalRepaymentAmount("invoicePayablesGrid");
			});
			m.connect("entity", "onChange", function(){
			
				var entity = dj.byId("entity").get("value");
				var hidden_entity = dj.byId("entity_hidden").get("value");
				if(hidden_entity == ""){
					dijit.byId("entity_hidden").set("value",entity);
					return;
				}
				
				var onOkCallback = function(){
					dijit.byId("entity_hidden").set("value",entity);
					m.clearInvoiceGrid("invoicePayablesGrid");
				};
				
				var onCancelCallback = function(){
					dijit.byId("entity").set("value",hidden_entity);
				};				
				
				var invoicesGrid = dj.byId("invoicePayablesGrid");
				if(entity != hidden_entity && invoicesGrid && invoicesGrid.rowCount > 0){
					m.dialog.show("CONFIRMATION", m.getLocalization("removebulkinvoice"), "", "", "", "", onOkCallback, onCancelCallback);
				}
				
				if(dj.byId("issuing_bank_abbv_name"))
				{
					dj.byId("issuing_bank_abbv_name").onChange();
				}
			});
			
			m.connect("issuing_bank_abbv_name", "onChange", m.populateReferences);
			m.connect("issuing_bank_customer_reference", "onChange", m.setApplicantReference);
			m.connect("issuing_bank_customer_reference", "onChange", function(){
				
				var customer_reference = dj.byId("issuing_bank_customer_reference").get("value");
				var hidden_customer_reference = dj.byId("issuing_bank_customer_reference_hidden").get("value");
				var invoicesGrid = dj.byId("invoicePayablesGrid");
				
				var onOkCallback = function(){
					dijit.byId("issuing_bank_customer_reference_hidden").set("value",customer_reference);
					m.clearInvoiceGrid("invoicePayablesGrid");
				};
				
				var onCancelCallback = function(){
					//Reset both values, so that confirmation is not shown second time, on reseting the value.
					dijit.byId("issuing_bank_customer_reference").set("value",hidden_customer_reference);
					dijit.byId("issuing_bank_customer_reference_hidden").set("value",hidden_customer_reference);
				};				
				
				if(customer_reference && customer_reference !== hidden_customer_reference && invoicesGrid && invoicesGrid.rowCount > 0){
					m.dialog.show("CONFIRMATION", m.getLocalization("removebulkinvoiceForCustomerReference"), "", "", "", "", onOkCallback, onCancelCallback);
				}
				
				if(customer_reference !== "") {
					dijit.byId("issuing_bank_customer_reference_hidden").set("value",customer_reference);
					dijit.byId("issuing_bank_customer_reference").set("value",customer_reference);
				}
				
			});

		},
		
		onFormLoad : function(){						
			var invoiceData = dj.byId("invoicePayablesGrid");
			//This condition will be true only in case of re-authentication failure
			if(invoiceItems && invoiceData && invoiceItems.length > 0)
			{
				//set an empty store
				var emptyStore = new dojo.data.ItemFileWriteStore({data:{"identifier":"REFERENCEID","items" :[]}});
				//add - update
				if(dj.byId("invoicePayablesGrid") && invoiceItems && invoiceItems.length > 0) {
					for(var i=0;i<invoiceItems.length;i++) {
						var amount = "";
						var item=invoiceItems[i];
						var refId = item.REFERENCEID.slice().toString();
						var entity = item.ENTITY.toString();
						var buyerName = item.BUYER_NAME.toString();
						var sellerName = item.SELLER_NAME.toString();
						var fscmProgrammeCode = item.PROGRAM_NAME.slice().toString();
						var totalNetCurCode = item.CURCODE.toString();
						var finAmt = item.FINANCE_AMOUNT.toString();
						var osRepayAmt = item.OUTSTANDING_REPAY_AMOUNT.toString();
						var totalRepayAmt = item.TOTAL_REPAID_AMOUNT.toString();
						var finIssDate = item.FINANCE_ISSUE_DATE.toString();
						var finDueDate = item.FINANCE_DUE_DATE.toString();
						var prodStatCode = item.STATUS;						

						var actn= "<img src="+misys.getContextualURL('/content/images/delete.png')+" onClick =\"javascript:misys.deleteInvoicePayableRecord('" + item.REFERENCEID + "')\"/>";
						var newItem = {"REFERENCEID" : refId, "ENTITY" : entity, "BUYER_NAME" : buyerName, "SELLER_NAME" :sellerName, "PROGRAM_NAME" : fscmProgrammeCode,
								"CURCODE" :totalNetCurCode, "FINANCE_AMOUNT" :finAmt,"OUTSTANDING_REPAY_AMOUNT" :osRepayAmt,"TOTAL_REPAID_AMOUNT" :totalRepayAmt,"FINANCE_ISSUE_DATE" :finIssDate,"FINANCE_DUE_DATE" :finDueDate,
								"STATUS" :prodStatCode,"ACTION" : actn};					
						emptyStore.newItem(newItem);
					}
				}
				invoiceData.setStore(emptyStore);
				dojo.style(invoiceData.domNode, "display", "");
				invoiceData.resize();
			}
			else if(dj.byId("invoicePayablesGrid") && dj.byId("displaymode") && dj.byId("displaymode").get("value") === "edit"){			
			// when from form load
				m.getFinancesSelectedForBulkRepayment("IP");
			}
			
			// Populate references
			var issuingBankAbbvName = dj.byId("issuing_bank_abbv_name");
			if(issuingBankAbbvName) {
				issuingBankAbbvName.onChange();
			}
			var issuingBankCustRef = dj.byId("issuing_bank_customer_reference");
			
			var hiddenCustomerRef = dj.byId("issuing_bank_customer_reference_hidden");
			if(hiddenCustomerRef && issuingBankCustRef)
				{
					hiddenCustomerRef.set("value",issuingBankCustRef.get("value")); 
				}

		},
	
	beforeSubmitValidations : function(){
		var error_message = "";
		var valid = true;
		if(dj.byId("invoicePayablesGrid"))
		{
			var grid = dj.byId("invoicePayablesGrid");
			var numRows = grid.rowCount;
			if(numRows < 1)
			{
				error_message =  m.getLocalization("recordsShouldBePresent");
				valid = false;
			}
			if(dj.byId("bk_repay_date") && !m.validateRepayDate())
			{
				error_message =  m.getLocalization("repayDateNotGreaterThanCurrentDate");
				valid = false;
			}
		}
		m._config.onSubmitErrorMsg = error_message;
		return valid;
	},
	
	beforeSaveValidations : function(){
    	var entity = dj.byId("entity") ;
    	if(entity && entity.get("value") === "")
        {
                return false;
        }
        else
        {
                return true;
        }
    }
		
		
	});
})(dojo, dijit, misys);//Including the client specific implementation
dojo.require("misys.client.binding.openaccount.create_ip_bk_repayment_client");