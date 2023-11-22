dojo.provide("misys.binding.bank.report_cn");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.TextBox");
dojo.require("misys.widget.Dialog");
dojo.require("dijit.ProgressBar");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.CheckBox");
dojo.require("dijit.layout.ContentPane");
dojo.require("dijit.form.DateTextBox");
dojo.require("misys.form.CurrencyTextBox");
dojo.require("dijit.form.FilteringSelect");
dojo.require("dijit.layout.TabContainer");
dojo.require("misys.form.SimpleTextarea");
dojo.require("misys.widget.Collaboration");

dojo.require("misys.form.addons");
dojo.require("misys.form.common");
dojo.require("misys.form.file");
dojo.require("misys.validation.common");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode
	// insert private functions & variables
	
	function _getInvoices()
	{
		var fscmProgCode = dj.byId('fscm_program_code')?dj.byId('fscm_program_code').get('value'):"";
		var sellerAbbvName = dj.byId('seller_abbv_name')?dj.byId('seller_abbv_name').get('value'):"";
		var buyerAbbvName = dj.byId('buyer_abbv_name')?dj.byId('buyer_abbv_name').get('value'):"";
		var cnCurCode = dj.byId("cn_cur_code")?dj.byId("cn_cur_code").get("value"):"";
		
		if (fscmProgCode === "")
		{
			m.dialog.show("ERROR", m.getLocalization("selectFSCMProgrammeFirst"));
			return;
		}
		m.showSearchDialog('invoice_item',"['inv_ref_id', 'inv_ref','inv_curr','inv_amt']",
				{fscm_programme: fscmProgCode, seller: sellerAbbvName, buyer: buyerAbbvName, cn_cur_code: cnCurCode},"",
				"CN",'width:710px;height:350px;', m.getLocalization("ListOfInvoicesTitleMessage"));
	}
	
	function clearBuyerDetails()
	{
		var field, 
		fieldsToClear = ["buyer_name","buyer_bei", "buyer_street_name",
		                 "buyer_post_code", "buyer_town_name","buyer_country_sub_div",
		                 "buyer_country","buyer_account_type","buyer_account_value",
		                 "fin_inst_bic","fin_inst_name","fin_inst_street_name","fin_inst_town_name",
		                 "fscm_programme_01","fscm_programme_02","fscm_programme_03","fscm_programme_04",
		                 "fin_inst_country_sub_div","buyer_abbv_name","access_opened",
		                 "transaction_counterparty_email","ben_company_abbv_name"];
	    

		d.forEach(fieldsToClear, function(id){
			field = dj.byId(id);
			if(field) {
				field.set("value","");
			}
		});
	}
	
	// Public functions & variables follow
	d.mixin(m._config, {
		
		xmlTransform : function (/*String*/ xml) {
			// Setup the root of the XML string
			var xmlRoot = m._config.xmlTagName,
			transformedXml = xmlRoot ? ["<", xmlRoot, ">"] : [],
			tdXMLStart = "<cn_tnx_record>",
			tdXMLEnd   = "</cn_tnx_record>",
			subTDXML	= "",
			selectedIndex = -1;
					
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
	});
	
	d.mixin(m, {
		bind : function() {
			
			m.setValidation("buyer_bei", m.validateBEIFormat);
			m.setValidation("seller_bei", m.validateBEIFormat);
			
			m.setValidation('total_net_cur_code', m.validateCurrency);

			m.setValidation('buyer_country', m.validateCountry);
			m.setValidation('seller_country', m.validateCountry);
			m.connect('total_net_cur_code', 'onChange', function(){
				m.setCurrency(this, ['total_net_amt']);
			});
			
			m.connect("invoice_lookup","onClick", _getInvoices);
			// onChange
			/*m.connect('fscm_program_code', 'onChange', function(){
				clearBuyerDetails();
				if(dj.byId("fscm_program_code").get("value") !== "" && dj.byId("invoice_lookup")) {
					dj.byId("invoice_lookup").set("disabled",false);	
				}
				else if (dj.byId("fscm_program_code").get("value") === "" && dj.byId("invoice_lookup")){
					dj.byId("invoice_lookup").set("disabled",true);
				}
			});*/
			
		},
		
		fetchInvoiceRecords: function(/* Dojox Grid*/ grid, /*String*/ url, /*String*/ curCode) {
			
			var numSelected = grid.selection.getSelected().length;
			var storeSize	= grid.store? grid.store._arrayOfAllItems.length:0;
			if(numSelected > 0 && storeSize > 0) {
				m.processInvoiceRecords(grid,curCode);
			} 
			dj.byId("xhrDialog").hide();
		},
		
		processInvoiceRecords : function( /*Dojox Grid*/ grid, /*String*/ curCode) {
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
							var invCur= item.CURCODE.toString();
							var invAmt = item.INVOICE_AMOUNT;
							var amount = item.INVOICE_SETTLEMENT_AMT;
							var actn= "<img src="+misys.getContextualURL('/content/images/delete.png')+" onClick =\"javascript:misys.deleteInvoiceRecord('" + item.REFERENCEID + "')\"/>";
							var newItem1 = {"REFERENCEID" : refId, "INVOICE_REFERENCE" : invRef, "CURCODE" : invCur, "INVOICE_AMOUNT" : invAmt, "ACTION" : actn, "INVOICE_SETTLEMENT_AMT" : amount};
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
					var invCur = item.CURCODE.toString();
					var invAmt = item.INVOICE_AMOUNT;
					var actn= "<img src="+misys.getContextualURL('/content/images/delete.png')+" onClick =\"javascript:misys.deleteInvoiceRecord('" + item.REFERENCEID + "')\"/>";
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
							newItem = {"REFERENCEID" : refId, "INVOICE_REFERENCE" : invRef, "CURCODE" : invCur, "INVOICE_AMOUNT" : invAmt,  "ACTION" : actn, "INVOICE_SETTLEMENT_AMT" : amount};
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
						newItem = {"REFERENCEID" : refId, "INVOICE_REFERENCE" : invRef, "CURCODE" : invCur, "INVOICE_AMOUNT" : invAmt, "ACTION" : actn, "INVOICE_SETTLEMENT_AMT" : amount};
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
			
			/*if(dj.byId("fscm_program_code").get("value") !== "") {
				dj.byId("invoice_lookup").set("disabled",false);
			}
			else {
				dj.byId("invoice_lookup").set("disabled",true);
			}*/
			
			//Populate the grid on form load.
			
			var invoiceData = dj.byId("gridInvoice");
			if(invoiceItems && invoiceItems.length > 0)
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
					var invCur = item.CURCODE.toString();
					var invAmount = item.INVOICE_AMOUNT;
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
					var actn= "<img src="+misys.getContextualURL('/content/images/delete.png')+" onClick =\"javascript:misys.deleteInvoiceRecord('" + item.REFERENCEID + "')\"/>";
					dijit.byId('gridInvoice').onCellFocus = function(inCell, inRowIndex) {
							//do nothing
					   };
					   var newItem = {"REFERENCEID" : refId, "INVOICE_REFERENCE" : invRef, "CURCODE" : invCur, "INVOICE_AMOUNT" : invAmount, "ACTION" : actn, "INVOICE_SETTLEMENT_AMT" : amount};
						emptyStore.newItem(newItem);
				}
			}
			invoiceData.setStore(emptyStore);
			dojo.style(invoiceData.domNode, 'display', '');
			invoiceData.resize();
			}
			else{
			dojo.style(dj.byId("gridInvoice").domNode, 'display', 'none');
		}
			
			/*if(dj.byId("gridInvoice") && invoiceItems && invoiceItems.length > 0) {
				var dataStore = {
						id: 'REFERENCEID',
						items: invoiceItems
					};
				var storeInvoiceTransactions = new dojo.data.ItemFileWriteStore({data: dataStore});
				dj.byId("gridInvoice").setStore(storeInvoiceTransactions);
				dojo.style(dj.byId("gridInvoice").domNode, 'display', '');
				dj.byId("gridInvoice").resize();
			}
			if(dj.byId("gridInvoice") && !(dj.byId("gridInvoice").store)) {
				dojo.style(dj.byId("gridInvoice").domNode, 'display', 'none');
			}*/
		},
		

		beforeSubmitValidations : function()
		{

			var valid = true;
			var invoiceData = dj.byId("gridInvoice");
			var sum = 0;
			var error_message = "";
			if (invoiceData && invoiceData.store && invoiceData.store._arrayOfTopLevelItems)
			{
				for (var i = 0; i < invoiceData.store._arrayOfTopLevelItems.length; i++)
				{
					var invoiceOutstandingAmt = invoiceData.store._arrayOfTopLevelItems[i].INVOICE_AMOUNT[i];
					var invoiceAmtField = dj.byId("invoiceAmt_"+i);
					if (invoiceAmtField && invoiceAmtField.state === "Error")
					{
						valid = false;
						error_message = m.getLocalization("focusOnErrorAlert");
						break;
					}
					else if(invoiceOutstandingAmt && invoiceAmtField && invoiceAmtField.value !== null && (invoiceAmtField.value > invoiceOutstandingAmt))
					{
						valid = false;
						invoiceAmtField.set("state","Error");
				 		error_message = m.getLocalization("settlementAmountGreaterThanInvoiceAmount");
					}
					else if (invoiceAmtField)
					{
						sum = sum + dj.byId("invoiceAmt_" + i).value;
						if (sum > dj.byId("cn_amt").value)
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
				}
			}
			m._config.onSubmitErrorMsg = error_message;
			return valid;
		}
	});
	
})(dojo, dijit, misys);	//Including the client specific implementation
       dojo.require('misys.client.binding.bank.report_cn_client');