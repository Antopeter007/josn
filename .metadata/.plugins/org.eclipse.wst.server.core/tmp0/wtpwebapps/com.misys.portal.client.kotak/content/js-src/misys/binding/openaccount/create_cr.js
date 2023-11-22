dojo.provide("misys.binding.openaccount.create_cr");
/*
 ----------------------------------------------------------
 Event Binding for

   Credit Node (CN) Form, Customer Side.

 Copyright (c) 2000-2009 Misys (http://www.misys.com),
 All Rights Reserved. 

 version:   1.0
 date:      24/03/2014
 ----------------------------------------------------------
 */
dojo.require("dojo.parser");
dojo.require("dijit.layout.BorderContainer");
dojo.require("misys.widget.Dialog");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.TextBox");
dojo.require("dojo.data.ItemFileWriteStore");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.DateTextBox");
dojo.require("misys.form.CurrencyTextBox");
dojo.require("dijit.form.NumberTextBox");
dojo.require("dijit.form.CheckBox");
dojo.require("dijit.form.FilteringSelect");
dojo.require("dijit.form.Form");
dojo.require("dijit.layout.ContentPane");
dojo.require("dijit.layout.TabContainer");
dojo.require("dojo.io.iframe"); 
dojo.require("dijit.ProgressBar");
dojo.require("dojo.behavior");
dojo.require("dojo.date.locale");
dojo.require("dijit.Tooltip");

dojo.require("misys.openaccount.FormOpenAccountEvents");
dojo.require("misys.grid.DataGrid");
dojo.require("misys.form.SimpleTextarea");
dojo.require("misys.form.common");
dojo.require("misys.form.file");
dojo.require("misys.validation.common");
dojo.require("misys.layout.FloatingPane");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {
	var commonStyle ='width:710px;height:350px;';
	var imagePath = misys.getContextualURL('/content/images/delete.png'); 
	var delInvoice=" onClick =\"javascript:misys.deleteInvoiceRecord('";
	// insert private functions & variables
	function _buyerButtonHandler()
	{
		var fscmProgCode = dj.byId('fscm_programme_code')?dj.byId('fscm_programme_code').get('value'):"";
		if (fscmProgCode === "")
		{
			m.dialog.show("ERROR", m.getLocalization("selectFSCMProgrammeFirst"));
			return;
		}
		m.showSearchDialog("baselineCustomer", 
		   "['buyer_name','buyer_bei', 'buyer_street_name','buyer_post_code', 'buyer_town_name','buyer_country_sub_div', 'buyer_country','buyer_account_type','buyer_account_value','fin_inst_bic','fin_inst_name','fin_inst_street_name','fin_inst_town_name','fscm_programme_01','fscm_programme_02','fscm_programme_03','fscm_programme_04','fin_inst_country_sub_div','buyer_abbv_name','access_opened','transaction_counterparty_email','ben_company_abbv_name']",
		   { fscm_programme: fscmProgCode }, 
		   '', 'CN', commonStyle, m.getLocalization("ListOfBeneficiriesTitleMessage"));
			
	}
	
	function _sellerButtonHandler()
	{
		var fscmProgCode = dj.byId('fscm_programme_code')?dj.byId('fscm_programme_code').get('value'):"";
		if (fscmProgCode === "")
		{
			m.dialog.show("ERROR", m.getLocalization("selectFSCMProgrammeFirst"));
			return;
		}
		m.showSearchDialog("baselineCustomer", 
		   "['seller_name','seller_bei', 'seller_street_name','seller_post_code', 'seller_town_name','seller_country_sub_div', 'seller_country','seller_account_type','seller_account_value','fin_inst_bic','fin_inst_name','fin_inst_street_name','fin_inst_town_name','fscm_programme_01','fscm_programme_02','fscm_programme_03','fscm_programme_04','fin_inst_country_sub_div','seller_abbv_name','access_opened','transaction_counterparty_email','ben_company_abbv_name']",
		   { fscm_programme: fscmProgCode }, 
		   '', 'CN', commonStyle, m.getLocalization("ListOfBeneficiriesTitleMessage"));
			
	}
	
	function populateBuyerDetailsFromSeller()
	{
		var fields= ["buyer_name","buyer_bei", "buyer_street_name",
		                 "buyer_post_code", "buyer_town_name","buyer_country_sub_div",
		                 "buyer_country","buyer_account_type","buyer_account_value","buyer_abbv_name",
		                 "fin_inst_bic","fin_inst_name","fin_inst_street_name","fin_inst_town_name",
		                 "fscm_programme_01","fscm_programme_02","fscm_programme_03","fscm_programme_04",
		                 "fin_inst_country_sub_div","access_opened",
		                 "transaction_counterparty_email"];
	    

		var i=0;
		d.forEach(fields, function(id){
			field = dj.byId(id);
			if(field) {
				field.set("value",cptyObject[i++]);
			}
		});		
	}
	
	function populateSellerDetailsFromBuyer()
	{
		var fields = ["seller_name","seller_bei", "seller_street_name",
		                 "seller_post_code", "seller_town_name","seller_country_sub_div",
		                 "seller_country","seller_account_type","seller_account_value","seller_abbv_name",
		                 "fin_inst_bic","fin_inst_name","fin_inst_street_name","fin_inst_town_name",
		                 "fscm_programme_01","fscm_programme_02","fscm_programme_03","fscm_programme_04",
		                 "fin_inst_country_sub_div","access_opened",
		                 "transaction_counterparty_email"];
		var i=0;
		d.forEach(fields, function(id){
			field = dj.byId(id);
			if(field) {
				field.set("value",cptyObject[i++]);
			}
		});
	}
	
	function _fscmProgramHandler()
	{		
		var fscmProgCode = dj.byId('fscm_programme_code')?dj.byId('fscm_programme_code').get('value'):"";
		//Clear invoice grid on change of fscm program.
		m.clearLinkedInvoiceGrid();	
		
		if(dj.byId("fscm_programme_code").get("value") !== "" && dj.byId("invoice_lookup")) {
			dj.byId("invoice_lookup").set("disabled",false);	
		}
		else if (dj.byId("fscm_programme_code").get("value") === "" && dj.byId("invoice_lookup")){
			dj.byId("invoice_lookup").set("disabled",true);
		}
	}
	
	function _getInvoices()
	{
		var fscmProgCode = dj.byId("fscm_programme_code")?dj.byId("fscm_programme_code").get("value"):"";
		var sellerAbbvName = dj.byId("seller_abbv_name")?dj.byId("seller_abbv_name").get("value"):"";
		var buyerAbbvName = dj.byId("buyer_abbv_name")?dj.byId("buyer_abbv_name").get("value"):"";
		var cnCurCode = dj.byId("cn_cur_code")?dj.byId("cn_cur_code").get("value"):"";
		
		if (fscmProgCode === "")
		{
			m.dialog.show("ERROR", m.getLocalization("selectFSCMProgrammeFirst"));
			return;
		}
		if (sellerAbbvName === "")
		{
			m.dialog.show("ERROR", m.getLocalization("selectSellerFirst"));
			return;
		}
		if (cnCurCode === "")
		{
			m.dialog.show("ERROR", m.getLocalization("cnCurrencyNotEntered"));
			return;
		}
		m.showSearchDialog("invoice_item","['inv_ref_id', 'inv_ref','inv_curr','inv_amt']",
				{fscm_programme: fscmProgCode, seller: sellerAbbvName, buyer: buyerAbbvName, cn_cur_code: cnCurCode},"",
				"CR",commonStyle, m.getLocalization("ListOfInvoicesTitleMessage"));

	}
	function _clearBuyerDetails()
	{
		var field, 
		fieldsToClear = ["buyer_name","buyer_bei", "buyer_street_name",
		                 "buyer_post_code", "buyer_town_name","buyer_country_sub_div",
		                 "buyer_country","buyer_account_type","buyer_account_value","buyer_abbv_name",
		                 "fin_inst_bic","fin_inst_name","fin_inst_street_name","fin_inst_town_name",
		                 "fscm_programme_01","fscm_programme_02","fscm_programme_03","fscm_programme_04",
		                 "fin_inst_country_sub_div","access_opened",
		                 "transaction_counterparty_email","ben_company_abbv_name"];
	    

		d.forEach(fieldsToClear, function(id){
			field = dj.byId(id);
			if(field) {
				field.set("value","");
			}
		});
	}
	
	function _clearSellerDetails()
	{
		var field, 
		fieldsToClear = ["seller_name","seller_bei", "seller_street_name",
		                 "seller_post_code", "seller_town_name","seller_country_sub_div",
		                 "seller_country","seller_account_type","seller_account_value","seller_abbv_name",
		                 "fin_inst_bic","fin_inst_name","fin_inst_street_name","fin_inst_town_name",
		                 "fin_inst_country_sub_div","access_opened",
		                 "transaction_counterparty_email","ben_company_abbv_name"];
	    

		d.forEach(fieldsToClear, function(id){
			field = dj.byId(id);
			if(field) {
				field.set("value","");
			}
		});
	}
	
	// Public functions & variables follow
	var cptyObject = [];
	d.mixin(m._config, {
		initReAuthParams : function() {

			var reAuthParams = {
				productCode :'CR',
				subProductCode : '',
				transactionTypeCode : '01',
				entity : dj.byId("entity") ? dj.byId("entity").get("value") : '',
				currency : dj.byId("cn_cur_code")? dj.byId("cn_cur_code").get("value") : "",				
				amount : dj.byId("cn_amt")? m.trimAmount(dj.byId("cn_amt").get("value")) : "",
				bankAbbvName : dj.byId("issuing_bank_abbv_name") ? dj.byId("issuing_bank_abbv_name").get("value") : "",	


				es_field1 : '',
				es_field2 : ''
			};
			return reAuthParams;
		},
		
		xmlTransform : function (/*String*/ xml) {
			// Setup the root of the XML string
			var xmlRoot = m._config.xmlTagName,
			transformedXml = xmlRoot ? ["<", xmlRoot, ">"] : [],
			tdXMLStart = "<cr_tnx_record>",
			tdXMLEnd   = "</cr_tnx_record>",
			subTDXML	= "",
			selectedIndex = -1;
			
			if(xml.indexOf(tdXMLStart) !== -1)
			{
				subTDXML = xml.substring(tdXMLStart.length,(xml.length-tdXMLEnd.length));
				transformedXml.push(subTDXML);
				if(dj.byId("gridInvoice") && dj.byId("gridInvoice").store && dj.byId("gridInvoice").store != null && dj.byId("gridInvoice").store._arrayOfAllItems.length >0) {
					transformedXml.push("<invoice-items>");
					dj.byId("gridInvoice").store.fetch({
						query: {REFERENCEID: '*'},
						onComplete: dojo.hitch(dj.byId("gridInvoice"), function(items, request){
							dojo.forEach(items, function(item){
								transformedXml.push("<invoice>");
								transformedXml.push("<invoice_ref_id>",item.REFERENCEID,"</invoice_ref_id>");
								transformedXml.push("<invoice_reference>",item.INVOICE_REFERENCE,"</invoice_reference>");
								transformedXml.push("<invoice_currency>",item.CURCODE,"</invoice_currency>");
								transformedXml.push("<invoice_amount>",item.INVOICE_AMOUNT,"</invoice_amount>");	
								transformedXml.push("<invoice_settlement_amt>",item.INVOICE_SETTLEMENT_AMT,"</invoice_settlement_amt>");
								transformedXml.push("</invoice>");
							});
						})
					});
					transformedXml.push("</invoice-items>");
				}
				if(xmlRoot) {
					transformedXml.push("</", xmlRoot, ">");
				}
				return transformedXml.join("");
			}
			else
			{
				return xml;
			}
		}
	});
	
	d.mixin(m, {
		bind : function() {			
			m.setValidation("buyer_bei", m.validateBEIFormat);
			m.setValidation("seller_bei", m.validateBEIFormat);
			m.setValidation('cn_cur_code', m.validateCurrency);
			m.setValidation('buyer_country', m.validateCountry);
			m.setValidation('seller_country', m.validateCountry);
			m.connect('total_net_cur_code', 'onChange', function(){
				m.setCurrency(this, ['total_net_amt']);
			});
			
			m.connect("invoice_lookup","onClick", _getInvoices);
			// onChange
			m.connect("fscm_programme_code", "onChange", _fscmProgramHandler);
			// onChange of buyer name, clear the invoices grid 
			m.connect("buyer_abbv_name", "onChange", function(){
				m.clearLinkedInvoiceGrid();
			});
			m.connect("seller_abbv_name", "onChange", function(){
				m.clearLinkedInvoiceGrid();
			});
			 // onChange
			m.connect("cn_cur_code", "onChange", function(){
				m.setCurrency(this, ["cn_amt"]);
			});
			//populate issuing reference
			m.connect("issuing_bank_abbv_name", "onChange", m.populateReferences);
			m.connect("issuing_bank_customer_reference", "onChange", m.setBuyerReference);
			
			if(dj.byId("issuing_bank_abbv_name"))
			{
				m.connect("entity", "onChange", function(){
					dj.byId("issuing_bank_abbv_name").onChange();
					
				});
			}
			
			var productCode = m._config.productCode.toLowerCase();
			var issuingBankCustRef = dj.byId("issuing_bank_customer_reference"),
				issuingBankAbbvName = dj.byId('issuing_bank_abbv_name'),
				tempReferenceValue;
			
			if(issuingBankCustRef)
			{
				tempReferenceValue = issuingBankCustRef.value;
			}
			if(issuingBankAbbvName)
			{
				issuingBankAbbvName.onChange();
			}
			if(issuingBankCustRef)
			{
				issuingBankCustRef.onChange();
				issuingBankCustRef.set('value',tempReferenceValue);
			}
		},

		fetchInvoiceRecords: function(/* Dojox Grid*/ grid, /*String*/ url,/*String*/ curCode) {
			
			var numSelected = grid.selection.getSelected().length;
			var storeSize	= grid.store? grid.store._arrayOfAllItems.length:0;
			if(numSelected > 0 && storeSize > 0) {
				m.processInvoiceRecords(grid,curCode);
			} 
			dj.byId("xhrDialog").hide();
		},
		processInvoiceRecords : function( /*Dojox Grid*/ grid,/*String*/ curCode) {
			var invoiceData = dj.byId("gridInvoice");
			
			//set an empty store
			var emptyStore = new dojo.data.ItemFileWriteStore({data:{"identifier":"REFERENCEID","items" :[]}});
			// Object to save grid data already present
			var obj= [];
			if(invoiceData && invoiceData.store && invoiceData.store._arrayOfTopLevelItems.length >0) {
				invoiceData.store.fetch({
					query: {REFERENCEID: '*'},
					onComplete: function(items, request){
						dojo.forEach(items, function(item){
							var refId = item.REFERENCEID.slice().toString();
							var invRef = item.INVOICE_REFERENCE.slice().toString();
							var invcurr = item.CURCODE.toString();
							var invamt = item.INVOICE_AMOUNT.toString();
							var amount = item.INVOICE_SETTLEMENT_AMT;
							var actn= "<img src="+imagePath+delInvoice + item.REFERENCEID + "')\"/>";
							//var newItem1 = {"REFERENCEID" : refId, "INVOICE_REFERENCE" : invRef, "ACTION" : actn, "INVOICE_AMT" : amount};
							var newItem1 = {"REFERENCEID" : refId, "INVOICE_REFERENCE" : invRef, "CURCODE" : invcurr, "INVOICE_AMOUNT" :invamt,  "ACTION" : actn, "INVOICE_SETTLEMENT_AMT" : amount};
							emptyStore.newItem(newItem1);
							obj.push(item);
						});
					}
				});
			}
			
			var selItems = grid.selection.getSelected();
			//add - update
			if(selItems.length >0) {
				for(var i=0;i<selItems.length;i++) {
					var isDup= false;
					var amount = "";
					var newItem = {};
					var item=selItems[i];
					var refId = item.REFERENCEID.slice().toString();
					var invRef = item.INVOICE_REFERENCE.slice().toString();
					var invcurr = item.CURCODE.toString();
					var invamt = item.INVOICE_AMOUNT.toString();
					var actn= "<img src="+imagePath+delInvoice + item.REFERENCEID + "')\"/>";
					if(obj.length>0) {
						for(var t=0;t<obj.length ; t++) {
							if(obj[t].REFERENCEID.slice().toString() === refId.slice().toString())	{
								isDup = true;
							}
						}
						if(!isDup) {
							var j;
							for(j=0; dj.byId("invoiceAmt_"+j); j++)
							{
								continue;
							}
							amount = new misys.form.CurrencyTextBox({id:"invoiceAmt_"+j , name:"invoiceAmt_"+j, value:"", constraints:{min:0.00}, readOnly:false, selectOnClick:true});
							if(curCode)
							{
								m.setCurrency(curCode, ["invoiceAmt_"+j]);
							}
							misys.connect("invoiceAmt_"+j, 'onClick', function(){
								dijit.byId('gridInvoice').onCellFocus = function(inCell, inRowIndex) {
									if(inCell.field === "INVOICE_SETTLEMENT_AMT"){
										var widgetid = dijit.byId('gridInvoice').store._arrayOfTopLevelItems[inRowIndex].INVOICE_SETTLEMENT_AMT[0].id;
										dijit.byId(widgetid).textbox.focus();
									}
								    };
							});
							//newItem = {"REFERENCEID" : refId, "INVOICE_REFERENCE" : invRef, "ACTION" : actn, "INVOICE_AMT" : amount};
							newItem = {"REFERENCEID" : refId, "INVOICE_REFERENCE" : invRef, "CURCODE" : invcurr, "INVOICE_AMOUNT" :invamt,  "ACTION" : actn, "INVOICE_SETTLEMENT_AMT" : amount};
							emptyStore.newItem(newItem);
						}
					}
					else {
						amount = new misys.form.CurrencyTextBox({id:"invoiceAmt_"+i , name:"invoiceAmt_"+i, value:"", constraints:{min:0.00}, readOnly:false, selectOnClick:true});
						if(curCode)
						{
							m.setCurrency(curCode, ["invoiceAmt_"+i]);
						}
						misys.connect("invoiceAmt_"+i, 'onClick', function(){
							dijit.byId('gridInvoice').onCellFocus = function(inCell, inRowIndex) {
								if(inCell.field === "INVOICE_SETTLEMENT_AMT"){
									var widgetid = dijit.byId('gridInvoice').store._arrayOfTopLevelItems[inRowIndex].INVOICE_SETTLEMENT_AMT[0].id;
									dijit.byId(widgetid).textbox.focus();
								}
							    };
						});
						//newItem = {"REFERENCEID" : refId, "INVOICE_REFERENCE" : invRef, "ACTION" : actn, "INVOICE_AMT" : amount};
						newItem = {"REFERENCEID" : refId, "INVOICE_REFERENCE" : invRef, "CURCODE" : invcurr, "INVOICE_AMOUNT" :invamt,  "ACTION" : actn, "INVOICE_SETTLEMENT_AMT" : amount};
						emptyStore.newItem(newItem);
					}
				}
			}
			
			invoiceData.setStore(emptyStore);
			dojo.style(invoiceData.domNode, 'display', '');
			invoiceData.resize();
		},

		deleteInvoiceRecord : function(/*String*/ ref) {
			var items=[];
			dj.byId("gridInvoice").store.fetch({
				query: {REFERENCEID: '*'},
				onComplete: dojo.hitch(dj.byId("gridInvoice"), function(items, request){
					dojo.forEach(items, function(item){
						if(item.REFERENCEID.slice().toString() === ref.slice().toString())
						{
							dj.byId("gridInvoice").store.deleteItem(item);
							var widgetid = item.INVOICE_SETTLEMENT_AMT[0].id;
							if(dj.byId(widgetid))
							{
								dj.byId(widgetid).destroy(true);
							}
						}
					});
				})
			});
			
			dj.byId("gridInvoice").resize();
		},
		
		onFormLoad : function() {
			m.setCurrency(dj.byId('total_net_cur_code'), ['total_net_amt']);
			m.setCurrency(dj.byId("cn_cur_code"), ["cn_amt"]);
			if(dj.byId("fscm_programme_code") && dj.byId("invoice_lookup") &&dj.byId("fscm_programme_code").get("value") !== "") {
				dj.byId("invoice_lookup").set("disabled",false);
			}
			else if (dj.byId("invoice_lookup")){
				dj.byId("invoice_lookup").set("disabled",true);
			}
			
			if(d.byId("buyerentity_row"))	{
				d.style(d.byId("buyerentity_row"), "display", "none");
				dj.byId("buyerentity").set("required",false);
			}
			if(d.byId("entity_row"))	{
				d.style(d.byId("entity_row"), "display", "inline-block");
			}
			
			// Populate references
			var issuingBankCustRef 	= dj.byId("issuing_bank_customer_reference"),
				issuingBankAbbvName = dj.byId("issuing_bank_abbv_name"),
				tempReferenceValue;
			if(issuingBankCustRef)
			{
				tempReferenceValue = issuingBankCustRef.value;
			}
			if(issuingBankAbbvName)
			{
				issuingBankAbbvName.onChange();
			}
			if(issuingBankCustRef)
			{
				issuingBankCustRef.onChange();
				issuingBankCustRef.set('value',tempReferenceValue);
			}
			
			//Populate the grid on form load for Draft.
			
			var invoiceData = dj.byId("gridInvoice");
			if(invoiceItems && invoiceData && invoiceItems.length > 0)
			{
			//set an empty store
			var emptyStore = new dojo.data.ItemFileWriteStore({data:{"identifier":"REFERENCEID","items" :[]}});
			//add - update
			if(dj.byId("gridInvoice") && invoiceItems && invoiceItems.length > 0) {
				for(var i=0;i<invoiceItems.length;i++) {
					var amount = "";
					var item=invoiceItems[i];
					var refId = item.REFERENCEID.slice().toString();
					var invRef = item.INVOICE_REFERENCE.slice().toString();
					var invcurr = item.CURCODE.toString();
					var invamt = item.INVOICE_AMOUNT.toString();
					var invAmt = item.INVOICE_SETTLEMENT_AMT;
					if(!dj.byId("invoiceAmt_"+i))
					{
						amount = new misys.form.CurrencyTextBox({id:"invoiceAmt_"+i , name:"invoiceAmt_"+i, value:invAmt, constraints:{min:0.00}, readOnly:false, selectOnClick:true});
						if(dj.byId("cn_cur_code"))
						{
							m.setCurrency(dj.byId("cn_cur_code"), ["invoiceAmt_"+i]);
						}
						misys.connect("invoiceAmt_"+i, 'onClick', function(){
							dijit.byId('gridInvoice').onCellFocus = function(inCell, inRowIndex) {
								if(inCell.field === "INVOICE_SETTLEMENT_AMT"){
									var widgetid = dijit.byId('gridInvoice').store._arrayOfTopLevelItems[inRowIndex].INVOICE_SETTLEMENT_AMT[0].id;
									dijit.byId(widgetid).textbox.focus();
								}
							    };
						});
					}
					var actn= "<img src="+imagePath+delInvoice + item.REFERENCEID + "')\"/>";
					dijit.byId('gridInvoice').onCellFocus = function(inCell, inRowIndex) {
							//do nothing
					   };
					//var newItem = {"REFERENCEID" : refId, "INVOICE_REFERENCE" : invRef, "ACTION" : actn, "INVOICE_AMT" : amount};
					   var newItem = {"REFERENCEID" : refId, "INVOICE_REFERENCE" : invRef, "CURCODE" : invcurr, "INVOICE_AMOUNT" :invamt,  "ACTION" : actn, "INVOICE_SETTLEMENT_AMT" : amount};
					emptyStore.newItem(newItem);
				}
			}
			invoiceData.setStore(emptyStore);
			dojo.style(invoiceData.domNode, 'display', '');
			invoiceData.resize();
			}
			else if(dj.byId("gridInvoice"))
			{
				dojo.style(dj.byId("gridInvoice").domNode, 'display', 'none');
			}
		
			// Create object for storing seller details
			var fields = ["seller_name","seller_bei", "seller_street_name",
			                 "seller_post_code", "seller_town_name","seller_country_sub_div",
			                 "seller_country","seller_account_type","seller_account_value","seller_abbv_name",
			                 "fin_inst_bic","fin_inst_name","fin_inst_street_name","fin_inst_town_name",
			                 "fscm_programme_01","fscm_programme_02","fscm_programme_03","fscm_programme_04",
			                 "fin_inst_country_sub_div","access_opened",
			                 "transaction_counterparty_email"];
			cptyObject= [];
			d.forEach(fields, function(id){
				field = dj.byId(id);
				if(field) {
					cptyObject.push(field.get("value"));
				}
			});
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
		 },
		
		beforeSubmitValidations : function() 
		{
			var valid = true;
			var invoiceData = dj.byId("gridInvoice");
			var sum = 0;
			var error_message = "";
			var warning_message = "";
			var warningSettlement_message = "";
			
			m.checkCnReferenceExists();
			if(dj.byId("cn_reference") && dj.byId("cn_reference").get("state") === "Error")
			{
				error_message += m.getLocalization("mandatoryCNReferenceError");
				valid = false;
			}
			
			if(invoiceData && invoiceData.store && invoiceData.store._arrayOfTopLevelItems)
			{
				for(var i=0; i < invoiceData.store._arrayOfTopLevelItems.length; i++)
				{
					if(dj.byId("invoiceAmt_"+i) && dj.byId("invoiceAmt_"+i).state === "Error")
					{
						valid = false;
						error_message = m.getLocalization("focusOnErrorAlert");
						break;
					}
					if(dj.byId("invoiceAmt_"+i) && (dj.byId("invoiceAmt_"+i).value === null || isNaN(dj.byId("invoiceAmt_"+i).value)))
					{
						valid = false;
						dj.byId("invoiceAmt_"+i).set("state","Error");
				 		error_message = m.getLocalization("CreditNoteAmountRequired");
					}
					else if(dj.byId("invoiceAmt_"+i) && (parseFloat(dj.byId("invoiceAmt_"+i).value) <= 0))
					{
						valid = false;
						dj.byId("invoiceAmt_"+i).set("state","Error");
				 		error_message = m.getLocalization("CreditNoteAmountZero");
					}
					else if(dj.byId("invoiceAmt_"+i))
					{
						sum = sum + dj.byId("invoiceAmt_"+i).value;
						if(dj.byId("cn_amt") && sum > dj.byId("cn_amt").value)
						{
							valid = false;
							error_message = m.getLocalization("invoicesSumLessThanCNAmount");
						}
					}
					else
					{
						valid = true;
						error_message = "";
					}
				 if(dj.byId("invoiceAmt_"+i))
					{
						var invoiceamt = dj.byId("gridInvoice").store._arrayOfAllItems[i].INVOICE_AMOUNT[0].replaceAll(",","");
						var reference = dj.byId("gridInvoice").store._arrayOfAllItems[i].REFERENCEID[0];
						var settlementvalue = dj.byId("invoiceAmt_"+i).value;
						if(parseFloat(settlementvalue) > parseFloat(invoiceamt))
							{
								var invoiceAmtField = dj.byId("invoiceAmt_"+i);
								valid = false;
								error_message = m.getLocalization("settlementAmountLessThanOutstandingAmount");
								invoiceAmtField.set("state","Error");
							}
					}
				}
				
				if(sum < dj.byId("cn_amt").value)
				{
				warningSettlement_message = m.getLocalization("settlementamtlessCNAmt") + "<br/>";
				}
			}
			
			
			if((error_message!=""))
			{
			m._config.onSubmitErrorMsg = error_message;
			return valid;
			
			}
			else if((warning_message!="" || warningSettlement_message!="") && m._config.validitycheck ==undefined)
			{	
				var wmesssage = "";
					wmesssage = warningSettlement_message;
				m._config.holidayCutOffEnabled = true;
				
				var okCallback = function() {
					  valid = true;
					  };
				
				var onCancelCallback = function() {
					valid = true;
					m._config.validitycheck = undefined;
				};
				
				m.dialog.show("WARNING", wmesssage, '', '', '', '', okCallback, onCancelCallback);
				valid = false;
				m._config.validitycheck = valid;
				
			}
			
			return valid;
			
		}
		
	});
})(dojo, dijit, misys);

//Including the client specific implementation
       dojo.require('misys.client.binding.openaccount.create_cr_client');