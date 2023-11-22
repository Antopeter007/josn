/*
 * ---------------------------------------------------------- 
 * Event Binding for Bulk
 * 
 * Copyright (c) 2000-2011 Misys (http://www.misys.com), All Rights Reserved.
 * 
 * version: 1.0 date: 07/03/11
 * 
 * ----------------------------------------------------------
 */
dojo.provide("misys.binding.bank.report_bk");

dojo.require("dojo.parser");
dojo.require("dojo.data.ItemFileReadStore");
dojo.require("dojo.window");
dojo.require("dojo.DeferredList");
dojo.require("dijit.layout.TabContainer");
dojo.require("dijit.form.DateTextBox");
dojo.require("misys.form.CurrencyTextBox");
dojo.require("dijit.form.NumberTextBox");
dojo.require("dijit.form.FilteringSelect");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.Select");
dojo.require("misys.widget.NoCloseDialog");
dojo.require("dijit.ProgressBar");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.CheckBox");
dojo.require("misys.form.PercentNumberTextBox");
dojo.require("misys.form.SimpleTextarea");
dojo.require("misys.widget.Collaboration");
dojo.require("misys.form.common");
dojo.require("misys.form.file");
dojo.require("misys.form.addons");
dojo.require("misys.validation.common");
dojo.require("misys.binding.cash.ft_common");
dojo.require("misys.form.BusinessDateTextBox");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {
	
	"use strict"; // ECMA5 Strict Mode
	
	/**
	 * bound to the OK button of the intermediary section
	 */
	function _okButtonHandler()
	{
		var cur_code = dj.byId("bk_cur_code").get("value");
		dj.byId("bk_total_amt_cur_code").set("value", cur_code);
		dj.byId("bk_total_amt").set("value", '');
		dj.byId("bk_highest_amt_cur_code").set("value", cur_code);
		dj.byId("bk_highest_amt").set("value", '');
		d.byId("display_record_number").innerHTML =  '<b>0</b>';
		m.animate("wipeOut", d.byId('content1'), function() {
			m.animate("wipeIn", d.byId('content2'));
		});
	}
	d.mixin(m, {
		
		displayContent: function()
		{
			if (d.style("content1","display") == "block")
			{
				d.style("content1","display","none");	
			}
			else
			{
				d.style("content1","display","block");	
			}
		},
		
		fixBulkTransactions: function()
		{
			return m.xhrPost({
				url: m.getServletURL("/screen/AjaxScreen/action/FixBulkTransactionsAction"),
				sync : true,
				handleAs : "json",
				contentType : "application/json; charset=utf-8",
				content : {
					formContent : m.formToXML({ selector: "#fakeform1", xmlRoot : "bk_tnx_record"})
				},
				load: function(response, args)
				{
					if (response.success)
					{
						m.updateTransactionGrid(window);
						m.dialog.show("CUSTOM-NO-CANCEL", m.getLocalization("fixBulkResult", [response.resultCount]), "");
					}
					else
					{
						m.dialog.show("ERROR", response.errorMessage, "");
					}
				},
				error: function(response, args)
				{
					m.dialog.show("ERROR", m.getLocalization("updateBulkError"), "");
				}
			});
		},
		
		/*
		 * This method resizes the dialog and the iframe in the page, to fit the whole view port.
		 * Then it submits the form provided to the iframe, with the fields defined in content
		 */
		showIframeDialog : function(formName, content)
		{
			var tnxFrame = d.byId("transactionFrame");
			var dialogDiv = d.byId("dialogTransaction");
			var formByDijit = dj.byId(formName);
			var formDOM = d.byId(formName);

			// if the iframe already exists, remove the old one prior to recreating
			if (tnxFrame)
			{
				tnxFrame.parentNode.removeChild(tnxFrame);
			}
			tnxFrame = document.createElement("iframe");
			dojo.attr(tnxFrame, {"id":"transactionFrame", "name":"transactionFrame"});
			d.style(dialogDiv,{"textAlign":"center","backgroundColor":"#FFFFFF"});
			dialogDiv.appendChild(tnxFrame);
			
			// do some calculation to resize things
			var viewport = d.window.getBox();			
			var dialogWidth  = viewport.w - 10;
			var dialogHeight = viewport.h - 10;
			var iframeWidth = dialogWidth - 23;
			var iframeHeight = dialogHeight - 50;
			d.style(tnxFrame, {
				"height" : iframeHeight + "px", 
				"width": iframeWidth + "px", 
				"position" : "relative", 
				"marginTop" : "-10px", 
				"marginLeft" : "8px" });
	
			m.transactionDialog.resize({w: dialogWidth, h: dialogHeight});

			for (var x in content)
			{
				if(!formDOM[x])
				{
					d.create("input", {type: "hidden", name: x, value: content[x]}, formDOM);
				}
				else
				{
					formDOM[x].value = content[x];
				}
			}
			formByDijit.connectChildren();
			formByDijit.set("action", misys.getServletURL("/screen/BulkTransactionPopup"));
			formByDijit.startup();
			formByDijit.submit();
			m.transactionDialog.show();
		},
		
		
		/*
		 * This method resizes the dialog and the iframe in the page, to fit the whole view port.
		 * Then it submits the form provided to the iframe, with the fields defined in content
		 */
		goToTransaction : function(formName, content)
		{
			var tnxFrame = d.byId("transactionFrame");
			var formByDijit = dj.byId(formName);
			var formDOM = d.byId(formName);
			for (var x in content)
			{
				if(!formDOM[x])
				{
					d.create("input", {type: "hidden", name: x, value: content[x]}, formDOM);
				}
				else
				{
					formDOM[x].value = content[x];
				}
			}
			formByDijit.connectChildren();
			formByDijit.set("action", misys.getServletURL("/screen/BulkScreen"));
			formByDijit.startup();
			formByDijit.submit();
		},
		
		confirmDeleteFromBulk : function(/*Object*/ parameters,
											/*Function*/ callback) {
			// summary:
			// Show a popup of confirmation to allow the deletion of a record from a bulk
			d.mixin(m, {bulkDeleteParameters: parameters});
			this.dialog.show("CONFIRMATION", this.getLocalization("removeFromBulkConfirmation", [parameters.referenceid]), "", callback);
		},
		
		/*
		 * This is the call back for the bulk transaction list, for the edit or remove actions
		 */
		editOrRemove : function(parameters)
		{
			var internalParameters = (parameters) ? parameters : m.bulkDeleteParameters;
			if (internalParameters.operation && internalParameters.operation=="DELETE")
			{
				m.xhrPost({
					url: m.getServletURL("/screen/AjaxScreen/action/DeleteBulkTransactionAction"),
					sync : true,
					handleAs : "json",
					content : {
						productcode : "FT",
						referenceid : internalParameters.referenceid,
						tnxid : internalParameters.tnxid
					},
					load: function(response, args)
					{
						if (response.success)
						{
							m.updateTransactionGrid(window);
						}
						else
						{
							m.dialog.show("ERROR", response.errorMessage, "");
						}
					},
					error: function(response, args)
					{
						m.dialog.show("ERROR", m.getLocalization("updateBulkError"), "");
					}
				});
			}
			else if (internalParameters.option && internalParameters.option=="PENDING")
			{
				m.goToTransaction("existingForm", {
					tnxtype: "01",
					option: internalParameters.option,
					mode: internalParameters.mode,
					referenceid : internalParameters.referenceid,
					tnxid: internalParameters.tnxid }
				);
			}
			else
			{
				this.dialog.show("ERROR", this.getLocalization("updateBulkError"));
			}
		},

		/*
		 * This is the "modal" dialog to show a transaction 
		 */
		transactionDialog : new m.widget.NoCloseDialog({
				title: "",
				id: "dialogTransaction",
				refocus: false,
				resizable: true,
				draggable: false,
				"class": "dialog",
				disableCloseButton: true},
			d.byId("dialogTransaction")),
				
		/*
		 * This is the action to add a new transaction to the bulk
		 */
		addTransaction : function()
		{
			var transactionDataContent = m.formToXML({ selector: "#fakeform1", xmlRoot : "bk_tnx_record"});
			// open in a normal window
			m.goToTransaction("transactionForm",
					{ transactiondata : transactionDataContent,
						tnxtype: "01",
						option: "SCRATCH",
						mode: "BULK"});
		},

		verifyCanAdvance: function()
		{
			var canAdv;
			/*
			 * Check if the all mandatory details are filled in the intermediary section and enable/disable the 'ok' button
			 */
			if(dj.byId("bk_type").get("value")=== "PAYMT" || dj.byId("bk_type").get("value")=== "PAYRL") 
			{
				canAdv = dj.byId("sub_product_code").get("value")!=="" && dj.byId("applicant_act_name").validate() && dj.byId("applicant_act_product_types").validate() && dj.byId("bk_cur_code").validate();
				dj.byId("button_intrmdt_ok").set("disabled", !canAdv);
			}
			else
			{
				canAdv =dj.byId("sub_product_code").get("value")!==""  && dj.byId("applicant_collection_act_name").validate() && dj.byId("applicant_collection_act_product_types").validate() && dj.byId("bk_cur_code").validate();
				dj.byId("button_intrmdt_ok").set("disabled", !canAdv);
			}
		},
		
		togglebankref: function()
		{
			
			/*
			 * Check if the all mandatory details are filled in the intermediary section and enable/disable the 'ok' button
			 */
			if(dj.byId("prod_stat_code").get("value")=== "01") 
			{
				 m.toggleRequired('bo_ref_id', false);
				dj.byId("bo_ref_id").set('disabled', true);
			}
			else
			{
				     m.toggleRequired('bo_ref_id', true);
					dj.byId("bo_ref_id").set('disabled', false);
			}
		},

		/*
		 * This method updates the grid and the total, highest and record number fields in the bulk
		 */
		updateTransactionGrid: function(parentWindow)
		{
			var parentDijit = parentWindow.dijit,
				parentMisys = parentWindow.misys,
				parentDojo = parentWindow.dojo,
				total = 0,
				highest = 0,
				record_number = 0;
			
			parentMisys.xhrPost({
				url: parentMisys.getServletURL("/screen/AjaxScreen/action/GetBulkDetailsAction"),
				sync : true,
				handleAs : "json",
				content : {
					productcode : "FT",
					bulk_ref_id : parentDijit.byId("ref_id").get("value"),
					bulk_tnx_id : parentDijit.byId("tnx_id").get("value")
				},
				load: function(response, args)
				{
					parentDijit.byId("bk_total_amt").set("value", response.sum);
					parentDijit.byId("bk_highest_amt").set("value", response.max);
					parentDijit.byId("record_number").set("value", response.count);
				},
				error: function(response, args)
				{
					parentMisys.dialog.show("ERROR", parentMisys.getLocalization("retrieveBulkDetailsError"), "");
				}
			});
			// update the grid
			parentMisys.grid.reloadForSearchTerms();
		},
	
		updateError: function(parentWindow, message)
		{
			var parentDijit = parentWindow.dijit,
				parentMisys = parentWindow.misys,
				parentDojo = parentWindow.dojo;

			parentMisys.dialog.show("ERROR", parentMisys.getLocalization("updateBulkError"), "");

			// update the grid anyway
			parentMisys.grid.reloadForSearchTerms();
		},

		bind : function()
		{
			m.setValidation("bk_cur_code", m.validateCurrency);
			
			m.setValidation("bk_total_amt_cur_code", m.validateCurrency);
			
			m.setValidation("bk_highest_amt_cur_code", m.validateCurrency);
			
			m.connect("bk_total_amt", "onBlur", function(){
				m.setTnxAmt(this.get("value"));
			});
			
			m.connect("bk_highest_amt", "onBlur", function(){
				m.setTnxAmt(this.get("value"));
			});
						
			m.connect("button_intrmdt_ok", "onClick", _okButtonHandler);
			
			m.connect("bk_total_amt_cur_code", "onChange", function(){
				m.setCurrency(this, ["bk_total_amt"]);
			});
			m.connect("bk_highest_amt_cur_code", "onChange", function(){
				m.setCurrency(this, ["bk_highest_amt"]);
			});
			
			m.connect("entity", "onChange", function(){
				d.byId("display_entity").innerHTML =  dj.byId("entity").get("value");
				m.setApplicantReference();
			});
			
			m.connect("applicant_act_name", "onChange", function() {
				d.byId("display_account").innerHTML =  dj.byId("applicant_act_name").get("value");
			});
			
			m.connect("applicant_collection_act_name", "onChange", function() {
				d.byId("display_to_account").innerHTML =  dj.byId("applicant_collection_act_name").get("value");
			});
			
			m.connect("bk_total_amt", "onChange", function(){
				dojo.forEach(d.query('#display_bk_total_amt_row div'), function(entry, i){
					entry.innerHTML = dj.byId("bk_total_amt").get("value");
				});	
			});
			
			m.connect("bk_highest_amt", "onChange", function(){				
				dojo.forEach(d.query('#display_bk_highest_amt_row div'), function(entry, i){
					entry.innerHTML = dj.byId("bk_highest_amt").get("value");
				});	
			});
			
			m.connect("record_number", "onChange", function(){	
				d.byId("display_record_number").innerHTML =  dj.byId("record_number").get("value");
			});
			
		/*	m.connect("applicant_act_product_types", "onChange", function(){				
				dj.byId("child_sub_product_code").set("value", dj.byId("applicant_act_product_types").get("value"));
				d.byId("display_child_sub_product_code").innerHTML =  dj.byId("applicant_act_product_types").get("displayedValue");
			});
			
			m.connect("applicant_collection_act_product_types", "onChange", function(){				
				dj.byId("child_sub_product_code").set("value", dj.byId("applicant_collection_act_product_types").get("value"));
				d.byId("display_child_sub_product_code").innerHTML =  dj.byId("applicant_collection_act_product_types").get("displayedValue");
			});
			*/
			m.connect("bk_type", "onChange", function(){
				if(this.get("value") === "COLLE") 
				{
					dj.byId("applicant_collection_act_name").set('required', true);
				//	dj.byId("applicant_collection_act_product_types").set('required',true);
					dj.byId("applicant_collection_act_name").set('value','');
			//		dj.byId("applicant_collection_act_product_types").set('value','');
					m.animate("wipeIn", d.byId('collection'));
					
					dj.byId("applicant_act_name").set('required', false);
				//	dj.byId("applicant_act_product_types").set('required',false);
					dj.byId("applicant_act_name").set('value','');
				//	dj.byId("applicant_act_product_types").set('value','');
					m.animate("wipeOut", d.byId('otherpayments'));
				} 
				else 
				{
					dj.byId("applicant_act_name").set('required', true);
				//	dj.byId("applicant_act_product_types").set('required',true);
					dj.byId("applicant_act_name").set('value','');
				//	dj.byId("applicant_act_product_types").set('value','');
					m.animate("wipeIn", d.byId('otherpayments'));
					
					dj.byId("applicant_collection_act_name").set('required', false);
				//	dj.byId("applicant_collection_act_product_types").set('required',false);
					dj.byId("applicant_collection_act_name").set('value','');
				//	dj.byId("applicant_collection_act_product_types").set('value','');
					m.animate("wipeOut", d.byId('collection'));
				}
				m.verifyCanAdvance();
			});
			
			m.connect("bk_type", "onChange", function(){
				if(this.get("value") === "COLLE") 
				{
					m.animate("wipeIn", d.byId('display_to_account_row'));
					m.animate("wipeOut", d.byId('display_account_row'));
				} 
				else 
				{
					m.animate("wipeOut", d.byId('display_to_account_row'));
					m.animate("wipeIn", d.byId('display_account_row'));
				}
			});
			
			m.connect("applicant_act_name", "onChange", m.verifyCanAdvance);			
		//	m.connect("applicant_act_product_types", "onChange", m.verifyCanAdvance);
			m.connect("applicant_collection_act_name", "onChange", m.verifyCanAdvance);			
		//	m.connect("applicant_collection_act_product_types", "onChange", m.verifyCanAdvance);
			m.connect("bk_cur_code", "onChange", m.verifyCanAdvance);
			
			m.connect("prod_stat_code", "onChange", m.togglebankref);

			d.mixin(m, {fixBulkTransactionsHandle : m.connect("value_date", "onChange", m.fixBulkTransactions)});			
		},
		
		onFormLoad : function(){
			if(dj.byId("prod_stat_code") && dj.byId("prod_stat_code").get("value") === "01")
			{
				dj.byId("bo_ref_id").set("disabled",true);
			}
			
			if(dj.byId("bk_type").get("value") === "COLLE")
			{
				m.animate("wipeIn", d.byId('display_to_account_row'));
				m.animate("wipeOut", d.byId('display_account_row'));
				m.animate("wipeOut", d.byId('payrolltype'));
				
				d.byId("product_group").innerHTML =  m.getLocalization("bulkCollectionProductGroup");
			}
			else if(dj.byId("bk_type").get("value") === "PAYMT")
			{
				m.animate("wipeOut", d.byId('display_to_account_row'));
				m.animate("wipeIn", d.byId('display_account_row'));
				m.animate("wipeOut", d.byId('payrolltype'));

				d.byId("product_group").innerHTML =  m.getLocalization("bulkPaymentsProductGroup");

			}
			else if(dj.byId("bk_type").get("value") === "PAYRL")
			{
				d.byId("product_group").innerHTML =  m.getLocalization("bulkPayrollProductGroup");
				
				//Add payroll content here
			}
			/*
			else
			{
				//d.style('collection','display','none');
				//d.style('otherpayments','display','none');
			}*/
			m.setCurrency(dj.byId("bk_total_amt_cur_code"), ["bk_total_amt"]);
			m.setCurrency(dj.byId("bk_highest_amt_cur_code"), ["bk_highest_amt"]);
			m.setApplicantReference();
			if(dj.byId("prod_stat_code"))
			{
				dj.byId("prod_stat_code").onChange();	
			}
		},
		
		submitBulk : function(mode)
		{			
			console.log("inside submitBulk");
			var dfdFirstPart = new d.Deferred();
			var dfdSecondPart = new d.Deferred();
			var dfdSubmit = new d.DeferredList([dfdFirstPart, dfdSecondPart]);
	
			var dfdGetBusinessDate = m.xhrPost({
				url : misys.getServletURL("/screen/AjaxScreen/action/GetBulkBusinessDateAction"),
				sync : true,
				handleAs : "json",
				content : {
					transactiondata : m.formToXML({ selector: "#fakeform1", xmlRoot : "bk_tnx_record"}) 
				}
			});
			
			dfdGetBusinessDate.then(
				function(response, args) {
					// If the value date proposed is diferente than the original one, ask if the 
					// user wants to update the whole bulk.
					m._config.oldDate = response.requestedDate;
					if (response.modified)
					{
						m._config.newDate = response.calculatedDate;
						// Ask for confirmation to resolve the deferred
						m.dialog.show("CONFIRMATION",  m.getLocalization("fixBulkForwardDate", [m._config.newDate]), "", 
								function() {dfdFirstPart.resolve(response);});
					}
					else
					{
						// resolve the deferred directly
						dfdFirstPart.resolve(response);
					}
				},
				function(response, args) {
					dfdFirstPart.reject(response);
					m._config.oldDate = response.requestedDate;
					m._config.onSubmitErrorMsg = m.getLocalization("technicalErrorWhileValidatingBusinessDays");
				}
			);

			dfdFirstPart.then(
				function(response){
					if (response.modified)
					{
						// disconnect the event for a sec, so it doesn't trigger the dialog
						d.disconnect(m.fixBulkTransactionsHandle);
						dj.byId("value_date").set("value", m._config.newDate);
						// reconnect the event
						setTimeout(function() {
							d.mixin(m, {fixBulkTransactionsHandle : m.connect("value_date", "onChange", m.fixBulkTransactions)});
						}, 1000);
						
						m.xhrPost({
							url: m.getServletURL("/screen/AjaxScreen/action/FixBulkTransactionsAction"),
							sync : true,
							handleAs : "json",
							contentType : "application/json; charset=utf-8",
							content : {
								formContent : m.formToXML({ selector: "#fakeform1", xmlRoot : "bk_tnx_record"})
							},
							load: function(responseFix, args)
							{
								if (responseFix.success)
								{
									dfdSecondPart.resolve(responseFix);
								}
								else
								{
									dfdSecondPart.reject(responseFix);
								}
							},
							error: function(responseFix, args)
							{
								dfdSecondPart.reject(responseFix);
							}
						});
					}
					else
					{
						dfdSecondPart.resolve(response);
					}
				}, 
				function(response){
					dfdSecondPart.reject(response);
				}
			);
			
			dfdSecondPart.then(
					function(response){
						console.debug("dfdSecondPart resolved", response);
					}, 
					function(response){
						console.debug("dfdSecondPart rejected", response);
					}
				);
			
			dfdSubmit.then(
					function(response) {
						m.submit(mode);
					}, 
					function(response){
						console.debug("dfdSubmit rejected", response);
					}
			);
		}
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.bank.report_bk_client');