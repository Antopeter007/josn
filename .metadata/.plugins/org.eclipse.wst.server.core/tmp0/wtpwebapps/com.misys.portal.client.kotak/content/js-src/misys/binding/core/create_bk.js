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
dojo.provide("misys.binding.core.create_bk");

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
dojo.require("dijit.Dialog");
dojo.require("misys.widget.NoCloseDialog");
dojo.require("dijit.ProgressBar");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.CheckBox");
dojo.require("misys.form.PercentNumberTextBox");
dojo.require("misys.form.SimpleTextarea");
dojo.require("misys.widget.Collaboration");
dojo.require("misys.form.common");
dojo.require("misys.form.file");
dojo.require("misys.validation.common");
dojo.require("misys.binding.cash.ft_common");
dojo.require("misys.form.BusinessDateTextBox");
dojo.require("misys.binding.core.merge_demerge_bk");
dojo.require("misys.openaccount.FormOpenAccountEvents");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {
	
	"use strict"; // ECMA5 Strict Mode
	
	var noCustBAnkMsgDiv="no-customer-bank-message-div";
	var childTransactionGridId = "gridBulkTransaction",
		/** Use this parameter to avoid on change events 
		 *  from bk_type ->child_sub_product_code ->clear_Account_fields
		 *  Donot clear account fields when this is being called from draft
		 */
		bkTypeChangeFromDraft  = false,
		/**
		 * to put a check on onChange methods being called on form loading
		 */
		OnFormLoad = false,
		/**
			Global flag to set  child transactions on the grid are valid/invalid.
			if valid - true;
			if invalid  - false;
		**/
		childTransactionsValid = true;
		
		
	//Holidays And CutOffTime Error Dialog With Auto Forward Operation
	/**
	 * <h4>Summary:</h4>
	 * This method is for showing error dialog for the holiday and cutoff time error.
	 * @param {String} mode
	 * @param {boolean} autoFormwardEnabled
	 * @method _showHolidaysNCutOffTimeErrorDialog
	 */
	function _showHolidaysNCutOffTimeErrorDialog(/*boolean*/autoForwardEnabled)
	{	
   	 	var mode = dijit.byId("mode") ? dijit.byId("mode").get("value") : "";
		//if holidayCutOffDialog not defined
		if(!dj.byId("holidayCutOffDialog"))
		{
			d.require('misys.widget.Dialog');
			d.require('dijit.form.Button');
			
			//Create a dialog
			var dialog = new dj.Dialog({id: 'holidayCutOffDialog',
			    title: 'Confirmation',draggable: false});
			
			//Create dialog content
			var dialogContent = d.create("div", { id: "holidayCutOffDialogContent"});
			var dialogText = d.create("div", {id:"dialogHolidayText"},dialogContent,'first');
			var dialogButtons =   d.create("div",{id:"holidayCutOffDialogButtons",style:"text-align:center;"},dialogContent,'last');
			
			//Buttons
			var rejectButton  = new dj.form.Button({label:m.getLocalization('returnMessage'),id:"rejectHolidayButtonId"});
			var autoForwardButton  = new dj.form.Button({label:m.getLocalization('autoForwardMessage'),id:"forwardHolidayButtonId"});
			var cancelButton  = new dj.form.Button({label:m.getLocalization('cancelMessage'),id:"cancelHolidayButtonId"});
			
			//UNSIGNED mode will have reject
			if(mode === "UNSIGNED")
			{
				d.place(rejectButton.domNode,dialogButtons);
			}
			//Only if AutoForward Enabled for User's Entity
			if(autoForwardEnabled === true)
			{
				d.place(autoForwardButton.domNode,dialogButtons);
			}
			d.place(cancelButton.domNode,dialogButtons);
			dialog.set("content", dialogContent);
		}
			
		if(mode !== "UNSIGNED" && !autoForwardEnabled) {
			m._config.onSubmitErrorMsg = m.getLocalization('failedSingleSubmissionFromDraft');
		}
		
		var holidayDialog = dj.byId("holidayCutOffDialog");
		
		//Set the Error into the Dialog
		if(d.byId("dialogHolidayText"))
		{
			d.byId("dialogHolidayText").innerHTML = m._config.onSubmitErrorMsg;
		}
		// Disable window closing by using the escape key
		m.dialog.connect(holidayDialog, 'onKeyPress', function(evt) {
			if (evt.keyCode == d.keys.ESCAPE) {
				d.stopEvent(evt);
			}
		});
		
		//Dialog Connects
		m.dialog.connect(dj.byId('forwardHolidayButtonId'), 'onClick', function(){
			holidayDialog.hide();
			setTimeout(function(){
				dj.byId("bulk_autoforward").set("value","Y");
				m.submit("AUTO_FORWARD_SUBMIT");
			}, 500);
		}, holidayDialog.id);
		
		m.dialog.connect(dj.byId('rejectHolidayButtonId'), 'onClick', function(){
			m.submit("RETURN_TRANSACTION");
			 m.dialog.hide();
			holidayDialog.hide();
		}, holidayDialog.id);
		
		m.dialog.connect(dj.byId('cancelHolidayButtonId'), 'onClick', function(){
			 m.dialog.hide();
			holidayDialog.hide();
		}, holidayDialog.id);
		
		//On Hide of Dialog
		m.dialog.connect(holidayDialog, 'onHide', function() {
			m.dialog.disconnect(holidayDialog);
			m.dialog.hide();
		});
		
		//Show the Dialog
		holidayDialog.show();
	}
	
	/**
	 * bound to the OK button of the intermediary section
	 */
	function _okButtonHandler()
	{
		console.debug("[misys.binding.core.create_bk] Bulk Method Start: _okButtonHandler");
		var cur_code = dj.byId("bk_cur_code").get("value");
		dj.byId("bk_total_amt_cur_code").set("value", cur_code);
		d.attr(dj.byId("bk_total_amt"),'value','',false);
		dj.byId("bk_highest_amt_cur_code").set("value", cur_code);
		d.attr(dj.byId("bk_total_amt"),'value','',false);
		if(dj.byId("value_date"))
		{
			d.attr(dj.byId("value_date"),'value','',false);
		}
		d.byId("display_record_number").innerHTML =  '<b>0</b>';
		_checkPayrollAmtTransactionAccess(false);
		// PAB check show PAB only, only if PAB check box is checked
		if(dj.byId("pre_approved"))
		{
			// wipe in only if it selected
			if(dj.byId("pre_approved").get("checked") === true)
			{
				m.animate("wipeIn", d.byId("PAB"));
				dj.byId("pre_approved_status").set("value","Y");
				// set pre approved act at debting account as Y
				if(dj.byId("applicant_act_pab"))
				{
					dj.byId("applicant_act_pab").set("value","Y");
				}
				
			}
			else
			{
				dj.byId("pre_approved_status").set("value","N");
				// set pre approved act at debting account as Y
				if(dj.byId("applicant_act_pab"))
				{
					dj.byId("applicant_act_pab").set("value","N");
				}
			}
		}
		
		if(misys._config.nickname==="true"){
			if(dj.byId("applicant_act_nickname") && d.byId("applicant_act_nickname_row") && d.byId("nickname") && dj.byId("applicant_act_nickname").get("value")!==""){
				m.animate("fadeIn", d.byId("label"));
				d.style("label", "display", "inline-block");
				d.style("nickname","display","inline");
				d.byId("nickname").innerHTML = dj.byId("applicant_act_nickname").get("value");
			}else{
				m.animate("wipeOut", d.byId("applicant_act_nickname_row"));
			}
		}
		
		m.animate("wipeOut", d.byId('content1'), function() {
			m.animate("wipeIn", d.byId('content2'),function(){
				dj.byId("gridBulkTransaction").resize();
				dj.byId("gridBulkTransaction").update();
			});
			// wipe out the bulk type row
			m.animate("wipeOut", d.byId('display_sub_product_code_row'));
		});
		console.debug("[misys.binding.core.create_bk] Bulk Method End: _okButtonHandler");
	}
	/**
	 * Set the bulk currency based on the FT type(product Type on screen)
	 * Setting Criteria as follows
	 * IBG -  Local Currency and Not editable
	 * IAFT - Bulk Currency set to currency of �Transfer From/To account� .  Can be overwritten using Lookup.
	 * MEPS. Same as IBG
     * MT101: Same as IAFT
     * MT103:  Same as IAFT
     * Cashier ORDER:  same as IBG
     * GPC: (Bulk, Only) Same as IBG
	 */
	function _setBulkCurrency()
    {
		console.debug("[misys.binding.core.create_bk] Bulk Method Start: _setBulkCurrency");
		var bulkCurrency,
		    ftType,
		    accountCcy,
		    accountName,
		    bankBaseCur,
		    collAcctName;
		if(dj.byId("child_sub_product_code"))
		{
			ftType = dj.byId("child_sub_product_code").get("value");
			accountName = dj.byId("applicant_act_no").get("value");
			collAcctName = dj.byId("applicant_collection_act_no").get("value");
			if(misys._config.isMultiBank)
			{
				bankBaseCur = _getBaseCurrencyPerCustomerBank();
			}
			else if(dj.byId("bank_base_currency"))
			{
				bankBaseCur = dj.byId("bank_base_currency").get("value"); 
			}
			// if its IBG or IBGEXP
			if((ftType === "DOM" || ftType === "PICO") && accountName !== "")
			{
				dj.byId("bk_cur_code").set("value", bankBaseCur);
				dj.byId("bk_cur_code").set("readOnly",true);
				
			}
			else if(ftType === "DOM" && collAcctName !== "")
			{
				dj.byId("bk_cur_code").set("value", bankBaseCur);
				dj.byId("bk_cur_code").set("readOnly",true);
			
			}
			else if(ftType === "MEPS")
			{
				dj.byId("bk_cur_code").set("value", "SGD");
				dj.byId("bk_cur_code").set("readOnly",true);
			
			}
			else if(ftType == "HVPS" || ftType == "HVXB")
			{
				accountCcy = dj.byId("applicant_act_cur_code") ? dj.byId("applicant_act_cur_code").get("value"):"";
                if(accountCcy !== "")
                {
                    dj.byId("bk_cur_code").set("value",accountCcy);
                    dj.byId("bk_cur_code").set("readOnly",true);
                }
			}
			else if((ftType === "INT" || ftType === "TPT" || ftType === "MUPS"  || ftType === "RTGS" || ftType === "MT101" || ftType === "MT103" || ftType =="PIDD") && accountName !== "")
			{
				//set the account currency
				accountCcy = dj.byId("bk_type").get("value") === "COLLE" ? dj.byId("applicant_collection_act_cur_code").get("value") : dj.byId("applicant_act_cur_code").get("value");
				if(accountCcy !== "")
				{
				  dj.byId("bk_cur_code").set("value",accountCcy);
				  dj.byId("bk_cur_code").set("readOnly",true);
				  if(ftType === "PIDD")
				  {
					  dj.byId("bk_amt_img").set("disabled",true); 
				  }
				}
			}
		}
		console.debug("[misys.binding.core.create_bk] Bulk Method End: _setBulkCurrency");
		
		if(m.client && m.client.setBulkCurrency)
		{
			m.client.setBulkCurrency();
		}
    }

	/**
	 * TODO: comment
	 */
	function _validateTotalamt()
	{
		var displayMessage = m.getLocalization('totalamount');
		var total_amt_Field	= dijit.byId("bk_total_amt");
		if(dijit.byId("bk_total_amt").isValid(true) === false)
		{
			total_amt_Field.set("state","Error");
	 		dijit.hideTooltip(total_amt_Field.domNode);
	 		dijit.showTooltip(displayMessage, total_amt_Field.domNode, 0);
		}
	}
	/**
	 * Clear the accounts
	 */
	function _clearAccountFields()
     {
		if (!bkTypeChangeFromDraft) {
			if (dj.byId("applicant_act_name")) {
				dj.byId("applicant_act_name").set("value", "");
				dj.byId("applicant_act_cur_code").set("value", "");
				dj.byId("applicant_act_no").set("value", "");
				dj.byId("applicant_act_description").set("value", "");
				dj.byId("applicant_act_pab").set("value", "");
			}
			if (dj.byId("applicant_collection_act_name")) {
				// for collection accounts
				dj.byId("applicant_collection_act_name").set("value", "");
				dj.byId("applicant_collection_act_cur_code").set("value", "");
				dj.byId("applicant_collection_act_no").set("value", "");
				dj.byId("applicant_collection_act_description").set("value", "");
				dj.byId("applicant_collection_act_pab").set("value", "");
			}
		}
	}
	/**
	 * 
	 */
	function _setChildSubProductCodeDependentFieldValues()
    {
		if (!bkTypeChangeFromDraft)
		{
			dj.byId("sub_product_code_display").set('value','');
			dj.byId("sub_product_code").set('value','');
			dj.byId("bk_cur_code").set("value","");
			dj.byId("applicant_img").set("disabled",false);
			if(dj.byId("clearing_code")){
				dj.byId("clearing_code").set("value","");
			}
			_setSubProductCode();
			m.verifyCanAdvance;
		}
		
    }
	/**
	 * Check the PAB check box 
	 */
	
	function _checkPAB()
	{
		console.debug("[misys.binding.core.create_bk] Bulk Method Start: _checkPAB");
		if(dj.byId("applicant_act_pab").get("value") !== "" && dj.byId("applicant_act_name").get("value") !== "")
		{
		// if account is set than only show the PAB check boxck
			if(dj.byId("applicant_act_name").get("value") !== "")
			{
				if(dj.byId("applicant_act_pab").get("value") === "Y")
				{
					dj.byId("pre_approved").set("checked",true);
		    		dj.byId("pre_approved").set("disabled",true);
		    	
				}else if(dj.byId("applicant_act_pab").get("value") === "N")
				{
					dj.byId("pre_approved").set("disabled",false);
					dj.byId("pre_approved").set("checked",false);
				}
				if(!m._config.non_pab_allowed)
				{
					console.debug("Non-PAB accounts are not allowed. PAB checkbox is not displayed");
					m.animate("wipeOut", d.byId("pab_checkbox_row"));
				}
				else if(m._config.non_pab_allowed && dj.byId("applicant_act_pab").get("value") === "Y")
				{
					console.debug("Selected account only allows PAB transactions. PAB checkbox is not displayed");
					m.animate("wipeOut", d.byId("pab_checkbox_row"));
				}
				else
				{
					m.animate("wipeIn", d.byId("pab_checkbox_row"));
				}
			}
		}
		else if(dj.byId("applicant_collection_act_pab").get("value") !== "" && dj.byId("applicant_collection_act_name").get("value") !== "")
			{
			// if account is set than only show the PAB check boxck
				if(dj.byId("applicant_collection_act_name").get("value") !== "")
				{
					if(dj.byId("applicant_collection_act_pab").get("value") === "Y")
					{
						dj.byId("pre_approved").set("checked",true);
			    		dj.byId("pre_approved").set("disabled",true);
			    	
					}else if(dj.byId("applicant_collection_act_pab").get("value") === "N")
					{
						dj.byId("pre_approved").set("disabled",false);
						dj.byId("pre_approved").set("checked",false);
					}
					if(!m._config.non_pab_allowed)
					{
						console.debug("Non-PAB accounts are not allowed. PAB checkbox is not displayed");
						m.animate("wipeOut", d.byId("pab_checkbox_row"));
					}
					else if(m._config.non_pab_allowed && dj.byId("applicant_collection_act_pab").get("value") === "Y")
					{
						console.debug("Selected account only allows PAB transactions. PAB checkbox is not displayed");
						m.animate("wipeOut", d.byId("pab_checkbox_row"));
					}
					else
					{
						m.animate("wipeIn", d.byId("pab_checkbox_row"));
					}
				}
			}
		else
		{
			dj.byId("pre_approved").set("checked",false);
			m.animate("wipeOut", d.byId("pab_checkbox_row"));
			m.animate("wipeOut", d.byId("PAB"));
		}
		
		console.debug("[misys.binding.core.create_bk] Bulk Method End: _checkPAB");
	}
	
	function _checkPayrollAmtTransactionAccess(/*boolean*/isDraft)
	{
		var moveItem="move-items";
		console.debug("[misys.binding.core.create_bk] Bulk Method Start: _checkPayrollAmtTransactionAccess");
		var payrollType = dj.byId("payroll_type").get("value");
		var entity = dj.byId("entity") ? dj.byId("entity").get("value") : "*";
		var contextualBankFieldValue = dj.byId("issuing_bank_abbv_name") ? dj.byId("issuing_bank_abbv_name").get('value') : "";
		if(misys._config.isMultiBank && isDraft && isDraft !== true)
		{
			contextualBankFieldValue = dj.byId("customer_bank") ? dj.byId("customer_bank").get('value') : "";		
		}
		
		if(!isDraft && payrollType !== '')
		{
			var amountAccessFlag = (m._config.bkAccessPayrollArray[payrollType][entity+"_"+contextualBankFieldValue] && m._config.bkAccessPayrollArray[payrollType][entity+"_"+contextualBankFieldValue][0].amountAccess);
			if(!(amountAccessFlag === "true"))
			{
				m.animate("wipeOut", d.byId("bk_highest_amt_cur_code_row"));
				if( m._config.displayMode==="edit")	
				{
					/*dj.byId("submitBulkButton").set("disabled",true);
					dj.byId("submitBulkButton2").set("disabled",true);*/
					m.animate("wipeOut", d.byId("addTransactionButtonContainer"));
					m.animate("wipeOut", d.byId(moveItem));
				}
			}
			
			var itemAccessFlag = (m._config.bkAccessPayrollArray[payrollType][entity+"_"+contextualBankFieldValue] && m._config.bkAccessPayrollArray[payrollType][entity+"_"+contextualBankFieldValue][0].itemAccess);
			if(!(itemAccessFlag === "true"))
			{
				m.animate("wipeOut", d.byId("addTransactionButtonContainer")); 
				m.animate("wipeOut", d.byId("transactionGridContainer")); 
				m.animate("wipeOut", d.byId(moveItem));
			}
		}
		else if(isDraft)
		{
			if(!m._config.amountAccessPayroll )
			{
				m.animate("wipeOut", d.byId("bk_highest_amt_cur_code_row"));
				if( m._config.displayMode==="edit")
				{
					/* */
					m.animate("wipeOut", d.byId("addTransactionButtonContainer"));
					m.animate("wipeOut", d.byId(moveItem));
				}
			}
			if(!m._config.itemAccessPayroll)
			{
				m.animate("wipeOut", d.byId("addTransactionButtonContainer")); 
				m.animate("wipeOut", d.byId("transactionGridContainer")); 
				m.animate("wipeOut", d.byId(moveItem));
			}
		}
		console.debug("[misys.binding.core.create_bk] Bulk Method End: _checkPayrollAmtTransactionAccess");
	}
	
	function _setChildSubProduct()
	{
		console.debug("[misys.binding.core.create_bk] Bulk Method Start: _setChildSubProduct");
		var bkType = dj.byId("bk_type").get("value");
		var entity = dj.byId("entity") ? dj.byId("entity").get("value") : "*";
		var contextualBankFieldValue = dj.byId("issuing_bank_abbv_name") ? dj.byId("issuing_bank_abbv_name").get('value') : "";
		if(misys._config.isMultiBank && !bkTypeChangeFromDraft)
		{
			contextualBankFieldValue = dj.byId("customer_bank") ? dj.byId("customer_bank").get('value') : "";
		}
		
		if (!bkTypeChangeFromDraft)
		{
			dj.byId("child_sub_product_code").set("value","");
			if(bkType !== '' && bkType !== 'PAYRL')
			{
				dj.byId("child_sub_product_code").store = new dojo.data.ItemFileReadStore({
					data :{
						identifier : "value",
						label : "name",
						items : m._config.childSubProductsCollection[bkType][entity+"_"+contextualBankFieldValue]
					}
				});
			}
			else if(bkType !== '')
			{
				
				var payrollType = dj.byId("payroll_type").get("value");
				if(payrollType !== '')
				{
					dj.byId("child_sub_product_code").store = new dojo.data.ItemFileReadStore({
						data :{
							identifier : "value",
							label : "name",
							items : m._config.childSubProductsCollectionPayroll[bkType][payrollType][entity+"_"+contextualBankFieldValue]
						}
					});
				}else
				{
					//set up the pay roll types if bk type is payroll
					_setPayRollTypes();
				}
			}
		}
		console.debug("[misys.binding.core.create_bk] Bulk Method End: _setChildSubProduct");
	}
	/**
	 * As Bk types drop down store has to be based on the 
	 * entity selected, always create a store from Collection.
	 * if this is being called on Load,pass flag as true. To
	 * Avoid calls for onChange Events 
	 */
	function _setBulkTypes(/**boolean**/ isDraft)
	{
		console.debug("[misys.binding.core.create_bk] Bulk Method Start: _setBulkTypes");
		var entity;
		var contextualBankFieldValue = dj.byId("issuing_bank_abbv_name") ? dj.byId("issuing_bank_abbv_name").get('value') : "";
		if(misys._config.isMultiBank && !isDraft)
		{
			contextualBankFieldValue = dj.byId("customer_bank") ? dj.byId("customer_bank").get('value') : "";		
		}
		
		if(dj.byId("entity"))
		{
			entity = dj.byId("entity").get("value");
		}
		else if(dj.byId("entity_hidden"))
		{
			entity = dj.byId("entity_hidden").get("value");
			if (entity === "")
			{
					entity = "*";
			}
		}
		else
		{
			entity = "*";
		}
		
		dj.byId("bk_type").set("value","");
		if(entity !== "")
		{
			var bkTypeItemsForStore = m._config.bkTypeCollection[entity+"_"+contextualBankFieldValue];
			dj.byId("bk_type").store = new dojo.data.ItemFileReadStore({
				data :{
					identifier : "value",
					label : "name",
					items : bkTypeItemsForStore
				}
			});
			
			if(d.byId(noCustBAnkMsgDiv))
			{
				if(!bkTypeItemsForStore && contextualBankFieldValue)
				{
					misys.animate("fadeIn", d.byId(noCustBAnkMsgDiv));
				}
				else
				{
					misys.animate("fadeOut", d.byId(noCustBAnkMsgDiv));
				}
			}
		}
		if(isDraft)
		{
			bkTypeChangeFromDraft = isDraft;
		}
		console.debug("[misys.binding.core.create_bk] Bulk Method End: _setBulkTypes");
		
	}
	function _setPayRollTypes()
	{
		console.debug("[misys.binding.core.create_bk] Bulk Method Start: _setPayRollTypes");
		var entity;
		var contextualBankFieldValue = dj.byId("issuing_bank_abbv_name") ? dj.byId("issuing_bank_abbv_name").get('value') : "";
		if(misys._config.isMultiBank && !bkTypeChangeFromDraft)
		{
			contextualBankFieldValue = dj.byId("customer_bank") ? dj.byId("customer_bank").get('value') : "";		
		}
		if(dj.byId("entity"))
			{
				entity = dj.byId("entity").get("value");
			}
		else if(dj.byId("entity_hidden"))
			{
				entity = dj.byId("entity_hidden").get("value");
				if (entity === "")
				{
						entity = "*";
				}
			}
		else
			{
				entity = "*";
			}
		if(dj.byId("payroll_type") && entity !== "")
		{
			dj.byId("payroll_type").set("value","");
			
			dj.byId("payroll_type").store = new dojo.data.ItemFileReadStore({
				data :{
					identifier : "value",
					label : "name",
					items : m._config.payrollTypeCollection[entity+"_"+contextualBankFieldValue]
				}
			});
		}
		console.debug("[misys.binding.core.create_bk] Bulk Method End: _setPayRollTypes");
		
	}
	function _setSubProductCode()
	{
		console.debug("[misys.binding.core.create_bk] Bulk Method Start: _setSubProductCode");
		var bkType = dj.byId("bk_type").get("value");
		var childSubProductCode = dj.byId("child_sub_product_code").get("value");
		var payrollType = dj.byId("payroll_type").get("value");
		var entity = dj.byId("entity") ? dj.byId("entity").get("value") : "*";
		var contextualBankFieldValue = dj.byId("issuing_bank_abbv_name") ? dj.byId("issuing_bank_abbv_name").get('value') : "";
		if(misys._config.isMultiBank && !bkTypeChangeFromDraft)
		{
			contextualBankFieldValue = dj.byId("customer_bank") ? dj.byId("customer_bank").get('value') : "";		
		}
		
		dj.byId("sub_product_code").set("value","");
		dj.byId("sub_product_code_display").set("value","");
		
		if(childSubProductCode !== '')
		{
			if(bkType === 'PAYRL' && payrollType !== '')
			{
				dj.byId("sub_product_code_display").set('value',m._config.subProductsCollectionPayroll[payrollType][entity+"_"+contextualBankFieldValue][childSubProductCode].name);
				dj.byId("sub_product_code").set('value',m._config.subProductsCollectionPayroll[payrollType][entity+"_"+contextualBankFieldValue][childSubProductCode].value);
				d.byId("display_value_sub_product_code_row").innerHTML =  m._config.subProductsCollectionPayroll[payrollType][entity+"_"+contextualBankFieldValue][childSubProductCode].name;
				
			}
			else
			{
				dj.byId("sub_product_code_display").set('value',m._config.subProductsCollection[bkType][entity+"_"+contextualBankFieldValue][childSubProductCode].name);
				dj.byId("sub_product_code").set('value',m._config.subProductsCollection[bkType][entity+"_"+contextualBankFieldValue][childSubProductCode].value);
				d.byId("display_value_sub_product_code_row").innerHTML = m._config.subProductsCollection[bkType][entity+"_"+contextualBankFieldValue][childSubProductCode].name;
			}
			m.animate("wipeIn", d.byId('display_sub_product_code_row'));
			if(dj.byId("child_sub_product_code").get("value") !== '' && dj.byId("child_sub_product_code").get("value") === 'MUPS'){
				d.style('clearingCode_div','display','block');
				if(dj.byId("clearing_code")){
					dj.byId("clearing_code").set("required",true);
				}
				d.style('display_clearing_code_row','display','block');
			}
			else{
				d.style('clearingCode_div','display','none');
				if(dj.byId("clearing_code")){
					dj.byId("clearing_code").set("required",false);
				}
				d.style('display_clearing_code_row','display','none');
			}
		}
		else
		{
			// wipe out the bulk type row
			m.animate("wipeOut", d.byId('display_sub_product_code_row'));
			d.style('clearingCode_div','display','none');
			if(dj.byId("clearing_code")){
				dj.byId("clearing_code").set("required",false);
			}
		}
		console.debug("[misys.binding.core.create_bk] Bulk Method End: _setSubProductCode");
	}
	/**
	check the account status whether account is active or not
	**/
	function _checkFTAccountStatus()
    {
       var accNo = dj.byId("applicant_act_no").get("value");
	   	var isAccountActive = m.checkAccountStatus(accNo);
	   	if(!isAccountActive){
			return false;
	   	}
       return true;
    }
	/**
		Validate the child transactions. Check 
		whether the child transaction state is valid or invalid
	**/
	
	function _validChildTransactions()
	{
		
		var bulkTransactionGrid = dijit.byId("gridBulkTransaction");
	
		if(bulkTransactionGrid && bulkTransactionGrid.store)
		{
			for(var i=0;i<bulkTransactionGrid.store._items.length;i++)
			{
				if(bulkTransactionGrid.store._items[i].i['tnx_stat_code'] + "S" === "Error"+"S")
				{
					childTransactionsValid = false;
					return;
				}
			}
		}
	}
	
	function _populateCustomerBankFields(OnFormLoad)
	{
		var customerBankFieldValue = dj.byId("customer_bank") ? dj.byId("customer_bank").get("value") : "";
		if(dj.byId('optionVal') && dj.byId('optionVal').get('value') === 'SCRATCH' && misys && misys._config && misys._config.businessDateForBank && misys._config.businessDateForBank[customerBankFieldValue] && misys._config.businessDateForBank[customerBankFieldValue][0] && misys._config.businessDateForBank[customerBankFieldValue][0].value !== '')
		{
			var date = misys._config.businessDateForBank[customerBankFieldValue][0].value;
			var yearServer = date.substring(0,4);
			var monthServer = date.substring(5,7);
			var dateServer = date.substring(8,10);
			date = dateServer + "/" + monthServer + "/" + yearServer;
			dj.byId("appl_date").set("value", date);
			if(document.getElementById('appl_date_view_row')){
				document.getElementById('appl_date_view_row').childNodes[1].innerHTML = date;
			}
		}
		
		if (!OnFormLoad)
		{
			var customerBankHiddenField = dj.byId("customer_bank_hidden");
			_clearAccountFields();
			_setBulkTypes();
			if (customerBankHiddenField)
			{
				dj.byId("customer_bank_hidden").set("value", customerBankFieldValue);
			}
			var issuingBankAbbvName = dj.byId("issuing_bank_abbv_name");
			var issuingBankDescName = dj.byId("issuing_bank_name");
			if (issuingBankAbbvName && issuingBankDescName && misys._config.customerBankDetails)
			{
				issuingBankAbbvName.set("value", customerBankFieldValue);
				if (m._config.customerBankDetails && m._config.customerBankDetails[customerBankFieldValue])
				{
					issuingBankDescName.set("value", m._config.customerBankDetails[customerBankFieldValue][0].value);
				}
				else
				{
					issuingBankDescName.set("value", customerBankFieldValue);
				}
			}
			if (d.byId("display_customer_bank"))
			{
				d.byId("display_customer_bank").innerHTML = issuingBankDescName.get("value");
			}

		}
	}
	
	function _getESIGNFeildForBulk()
	{
		if(dj.byId("bk_esign2_value"))
		{
			return dj.byId("bk_esign2_value").value;
		}
	}
	
	// Retrieve the Collaboration mode for the selected sub-product code
	function _getCollaborationMode(){
		console.log("[misys.binding.core.create_bk] Getting collaboration mode for the selected Bulk type");
		var subProdCode = dj.byId("sub_product_code") ? dj.byId("sub_product_code").get("value") : "";
		if(subProdCode !== '')
		{
			var dataJson = dojo.toJson({
				productcode : 'BK',
				subproductcode : subProdCode
			});
			return m.xhrPost({
				url: m.getServletURL("/screen/AjaxScreen/action/GetCollaborationMode"),
				sync : true,
				handleAs : "json",
				contentType : "application/json; charset=utf-8",
				content : dataJson,
				load: function(response, args)
				{
					console.debug("[misys.binding.core.create_bk] Bulk Method XHR Response: _getCollaborationMode :"+response);
					if (response.success)
					{
						if(dj.byId("collaborationWindow"))
						{
							if(response.collaboration_mode && response.collaboration_mode === "none")
							{
								dj.byId("collaborationWindow").hide();
								console.info("Collaboration is not enabled for BK:"+subProdCode+". Hiding collaboration window");
							}
							else
							{
								dj.byId("collaborationWindow").show();
							}
						}						
					}
					else
					{
						m.dialog.show("ERROR", response.errorMessage, "");
					}
				},
				error: function(response, args)
				{
					console.debug("[misys.binding.core.create_bk] Bulk Method Error occured in getting collaboration mode");
					m.dialog.show("ERROR", m.getLocalization("updateBulkError"), "");
				}
			});
		}
	}
	
	// Retrieve the allowed Task assignment mode for the selected sub-product code
	function _getTaskMode(){
		console.log("[misys.binding.core.create_bk] Getting task assignment mode for the selected Bulk type");
		var subProdCode = dj.byId("sub_product_code") ? dj.byId("sub_product_code").get("value") : "";
		if(subProdCode !== '')
		{
			var dataJson = dojo.toJson({
				productcode : 'BK',
				subproductcode : subProdCode
			});
			return m.xhrPost({
				url: m.getServletURL("/screen/AjaxScreen/action/GetTaskMode"),
				sync : true,
				content : dataJson,
				load: function(response, args)
				{
					misys._config = misys._config || {};			
					misys._config.task_mode = response;
				},
				error: function(response, args)
				{
					console.debug("[misys.binding.core.create_bk] Bulk Method  Error occured in Getting Task assignment");
					m.dialog.show("ERROR", m.getLocalization("updateBulkError"), "");
				}
			});
		}
	}

	function _crossCurrencyCNAPS(){
		var applicant_act_cur_code = dj.byId('applicant_act_cur_code').get('value');
		if (applicant_act_cur_code !== "" && applicant_act_cur_code !=="CNY")
			{
				m.dialog.show("ERROR",m.getLocalization("bulkCNYError"));
				dj.byId('applicant_act_name').set('value','');
				dj.byId('applicant_act_cur_code').set('value','');
				dj.byId('applicant_act_no').set('value','');
				dj.byId('bk_cur_code').set('value','');
				return true;
			}
	}
		
	/**
	 * Update/Backfill Bulk and Payroll Types, if-and-only-if they are empty, from it's corresponding hidden field.
	 * 
	 * @method _updateBulkTypeWithHiddenField
	 */
	function _updateBulkTypeWithHiddenField()
	{
			var bkTypeField = dj.byId("bk_type");
			var bkTypeHiddenField = dj.byId("bk_type_hidden");
			var payrollTypeField = dj.byId("payroll_type");
			var payrollHiddenField = dj.byId("payroll_type_hidden");
			if (bkTypeField && bkTypeField.get("value") === "" && bkTypeHiddenField && bkTypeHiddenField.get("value") !== "")
			{
				bkTypeField.set("value", bkTypeHiddenField.get("value"));
			}
			if (payrollTypeField && payrollTypeField.get("value") === "" && payrollHiddenField && payrollHiddenField.get("value") !== "")
			{
				payrollTypeField.set("value", payrollHiddenField.get("value"));
			}
	}

	/**
	 * Return Base currency field on selection of Customer Bank.
	 * 
	 * @method _getBaseCurrencyPerCustomerBank
	 * @private 
	 */
	function _getBaseCurrencyPerCustomerBank()
	{
		var customerBankFieldValue = dj.byId("customer_bank") ? dj.byId("customer_bank").get("value") : "";
		var bkTypeFieldValue = dj.byId("bk_type") ? dj.byId("bk_type").get("value") : "";
		var childSubProductCodeFieldValue = dj.byId("child_sub_product_code") ? dj.byId("child_sub_product_code").get("value") : "";
		var returnBankBaseCcy = "";
		if (customerBankFieldValue !== "" &&  bkTypeFieldValue !== "" && childSubProductCodeFieldValue !== "" && childSubProductCodeFieldValue === "DOM" && misys._config.bankBaseCurCode)
		{
			// For DOM bulk-type customer-bank's base currency should be populated or mapped to the BK currency code.
			returnBankBaseCcy = misys._config.bankBaseCurCode[customerBankFieldValue];
		}
		return returnBankBaseCcy;
	}
	function _crossCurrency(){
		var applicant_act_cur_code = dj.byId('applicant_act_cur_code').get('value');
		if (applicant_act_cur_code !== "" && applicant_act_cur_code !=="INR")
			{
				m.dialog.show("ERROR",m.getLocalization("mismatchFromINR"));
				dj.byId('applicant_act_name').set('value','');
				dj.byId('applicant_act_cur_code').set('value','');
				dj.byId('applicant_act_no').set('value','');
				dj.byId('bk_cur_code').set('value','');
				return true;
			}
	}
	//Cnaps Code
	function _setDefaultAccount()
	{
		//  summary: 
		//  If bank code and branch code both are populated then validate bank branch code
		var	productCode = dj.byId("product_code").get("value"),	
			subProductCode = dj.byId("sub_product_code").get("value"),
			applicant_act_name_field	=	dj.byId("applicant_act_name"),
			applicant_act_no_field	=	dj.byId("applicant_act_no"),
			//applicant_act_id_field	=	dj.byId("applicant_act_id"),
			applicant_act_cur_code_field	=	dj.byId("applicant_act_cur_code"),
			applicant_act_description_field	=	dj.byId("applicant_act_description"),
			applicant_act_product_types_field	=	dj.byId("applicant_act_product_types"),
			applicant_reference_field	=	dj.byId("applicant_reference"),
			applicant_acc_nra_field  = 	dj.byId("applicant_acc_nra"),
			applicant_act_pab_field  = 	dj.byId("applicant_act_pab");
		
		if(productCode && subProductCode)
		{
			if(!(productCode === "") && !(subProductCode === ""))
			{
				
				applicant_act_name_field.set("value","");
				applicant_act_no_field.set("value","");
				applicant_act_cur_code_field.set("value","");
				applicant_act_description_field.set("value","");
				applicant_reference_field.set("value","");
				applicant_act_pab_field.set("value", "");
				
				m.xhrPost( {
					url 		: misys.getServletURL("/screen/AjaxScreen/action/SetDefaultAccount") ,
					handleAs 	: "json",
					sync 		: true,
					content 	: {
						product_code : productCode,
						sub_product_code : subProductCode
					},
					load : function(response, args){
						if (response.items.oneAccount === true)
						{
							console.debug("only 1 eligible account found. setting values");
							
							//set Applicant Account details.
							//
							applicant_act_name_field.set("value",response.items.applicant_act_name);
							applicant_act_no_field.set("value",response.items.applicant_act_no);
							applicant_act_cur_code_field.set("value",response.items.applicant_act_cur_code);
							applicant_act_description_field.set("value",response.items.applicant_act_description);
							applicant_reference_field.set("value",response.items.applicant_reference);
							applicant_act_pab_field.set("value", response.items.applicant_act_pab);
							
						}
						else
						{
							console.debug("more than 1 eligible account found");
						}
					},
					error 		: function(response, args){
						console.error("[Could not check eligible accounts] ");
						console.error(response);
					}
				});
			}
		}
	}

	d.mixin(m._config, {
	initReAuthParams : function(){	
					console.debug("[misys.binding.core.create_bk] Bulk Method Start: initReAuthParams");
					var entity = dj.byId("entity") ? dj.byId("entity").get("value") : "";
					var bank = dj.byId("issuing_bank_abbv_name") ? dj.byId("issuing_bank_abbv_name").get("value") : "";
		var reAuthParams = { 	productCode : 'BK',
		         				subProductCode : dj.byId("sub_product_code").get("value"),
		        				transactionTypeCode : '01',
		        				entity : entity,		        				
		        				currency : dj.byId("bk_total_amt_cur_code").get('value'),
		        				amount : m.trimAmount(dj.byId("bk_total_amt").get('value')),
		        				bankAbbvName: bank,
		        				es_field1 : m.trimAmount(dj.byId("bk_total_amt").get('value')), 
		        				es_field2 : _getESIGNFeildForBulk()
							  };
					console.debug("[misys.binding.core.create_bk] Bulk Method End: initReAuthParams");
		return reAuthParams;
	}
	});	
	
	d.mixin(m, {
		
		fixBulkTransactions: function()
		{
			
			console.debug("[misys.binding.core.create_bk] Bulk Method Start: fixBulkTransactions");
			if(dj.byId("value_date").get("value") !== "" && dj.byId("value_date").get("value") !== null)
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
						console.debug("[misys.binding.core.create_bk] Bulk Method XHR Response: fixBulkTransactions :"+response);
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
					console.debug("[create_bk] Bulk Method Error occured : fixBulkTransactions");
					m.dialog.show("ERROR", m.getLocalization("updateBulkError"), "");
				}
			});
			}
		},
		
		select : function(submitType){
			switch(submitType){
			 case 'CANCEL':
				document.location.href = m._config.homeUrl;
				return;
				break;
			default:
				break;
			}
		},
		
		
		/*
		 * This method resizes the dialog and the iframe in the page, to fit the whole view port.
		 * Then it submits the form provided to the iframe, with the fields defined in content
		 */
		goToTransaction : function(formName, content)
		{
			console.debug("[misys.binding.core.create_bk] Bulk Method Start: goToTransaction");
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
			console.debug("[misys.binding.core.create_bk] Bulk Method Submission: goToTransaction");
			formByDijit.submit();
			console.debug("[misys.binding.core.create_bk] Bulk Method End: goToTransaction");
		},
		
		confirmDeleteFromBulk : function(/*Object*/ parameters,
											/*Function*/ callback) {
			// summary:
			// Show a popup of confirmation to allow the deletion of a record from a bulk
			console.debug("[misys.binding.core.create_bk] Bulk Method Start: confirmDeleteFromBulk");
			d.mixin(m, {bulkDeleteParameters: parameters});
			this.dialog.show("CONFIRMATION", this.getLocalization("removeFromBulkConfirmation", [parameters.referenceid]), "", callback);
			console.debug("[misys.binding.core.create_bk] Bulk Method End: confirmDeleteFromBulk");
		},
		
		/*
		 * This is the call back for the bulk transaction list, for the edit or remove actions
		 */
		editOrRemove : function(parameters)
		{
			console.debug("[misys.binding.core.create_bk] Bulk Method Start: editOrRemove");
			var internalParameters = (parameters) ? parameters : m.bulkDeleteParameters;
			if (internalParameters.operation && internalParameters.operation=="DELETE")
			{
				m.xhrPost({
					url: m.getServletURL("/screen/AjaxScreen/action/DeleteBulkTransaction"),
					sync : true,
					handleAs : "json",
					content : {
						productcode : "FT",
						referenceid : internalParameters.referenceid,
						tnxid : internalParameters.tnxid,
						bulkRefId : dj.byId("ref_id") ? dj.byId("ref_id").get("value") : "",
						bulkTnxId : dj.byId("tnx_id") ? dj.byId("tnx_id").get("value") : "",
						e2ee_plus_public_key : dj.byId("e2ee_plus_public_key") ? dj.byId("e2ee_plus_public_key").get("value") : "",
						e2ee_plus_challenge : dj.byId("e2ee_plus_challenge") ? dj.byId("e2ee_plus_challenge").get("value") : ""
					},
					load: function(response, args)
					{
						console.debug("[misys.binding.core.create_bk] Bulk Method XHR Response: editOrRemove :-"+ response);
						if (response.success)
						{
							m.updateTransactionGrid(window);
							// update the esign value
							if(response.bulkEsign2Value && dj.byId("bk_esign2_value"))
							{
								dj.byId("bk_esign2_value").set("value",response.bulkEsign2Value);
							}
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
				_updateBulkTypeWithHiddenField();
				
				var transactionDataContent = m.formToXML({ selector: "#fakeform1, #collaboration_form", xmlRoot : "bk_tnx_record"});
				m.goToTransaction("existingForm", {
					tnxtype: "01",
					option: internalParameters.option,
					mode: internalParameters.mode,
					referenceid : internalParameters.referenceid,
					tnxid: internalParameters.tnxid,
					text: dj.byId("narrative_additional_instructions") ? dj.byId("narrative_additional_instructions").get("value"):'',
					bulktemplateid: dj.byId("template_id") ? dj.byId("template_id").get("value"):'',
					custrefid: dj.byId("cust_ref_id") ? dj.byId("cust_ref_id").get("value"):'',
					transactiondata : transactionDataContent ,
					e2ee_plus_public_key : dj.byId("e2ee_plus_public_key") ? dj.byId("e2ee_plus_public_key").get("value") : "",
					e2ee_plus_challenge : dj.byId("e2ee_plus_challenge") ? dj.byId("e2ee_plus_challenge").get("value") : ""
					}
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
			console.debug("[misys.binding.core.create_bk] Bulk Method Start: addTransaction");
			_updateBulkTypeWithHiddenField();
			var transactionDataContent = m.formToXML({ selector: "#fakeform1, #collaboration_form", xmlRoot : "bk_tnx_record"});
			// open in a normal window
			var gen_array = {
					transactiondata : transactionDataContent,
					tnxtype: "01",
					option: "SCRATCH",
					mode: "BULK"
				};
			
			// collect all required widgets for e2ee and add it to gen_array
			var e2ee_widgets = dj.findWidgets(dojo.byId("e2ee_content_div"));
			dojo.forEach(e2ee_widgets, function(w) {				
				gen_array[w.get('id')] = w.get('value');				
			});
			
			m.goToTransaction("transactionForm", gen_array);
		},

		verifyCanAdvance: function()
		{
			var canAdv;
			
			if(dj.byId("child_sub_product_code").get("value") === 'MUPS'){
				
				canAdv = dj.byId("child_sub_product_code").validate() && dj.byId("sub_product_code").get("value")!=="" && dj.byId("applicant_act_name").validate() && dj.byId("bk_cur_code").validate() && dj.byId("clearing_code").get("value") !== "";
			}
			else{
				canAdv = dj.byId("child_sub_product_code").validate() && dj.byId("sub_product_code").get("value")!=="" && dj.byId("applicant_act_name").validate() && dj.byId("bk_cur_code").validate();
			}
			/*
			 * Check if the all mandatory details are filled in the intermediary section and enable/disable the 'ok' button
			 */
			if(dj.byId("bk_type").get("value")=== "PAYMT" || dj.byId("bk_type").get("value")=== "PAYRL") 
			{
				if (misys._config.isMultiBank)
				{
					canAdv = canAdv && dj.byId("customer_bank").validate();
				}
				if(canAdv && (dj.byId("sub_product_code").get("value")=== "PAYRL" ) && dj.byId("payroll_type").get("value")==="")
				{
						canAdv = false;
				}
			}
			dj.byId("button_intrmdt_ok").set("disabled", !canAdv);
			canAdv = true;
		},

		/*
		 * This method updates the grid and the total, highest and record number fields in the bulk
		 */
		updateTransactionGrid: function(parentWindow)
		{
			console.debug("[misys.binding.core.create_bk] Bulk Method Start: updateTransactionGrid");
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
					if(response.sum)
					{
						parentDijit.byId("bk_total_amt").set("value", response.sum);
					}
					else
					{
						parentDijit.byId("bk_total_amt").set("value", "");
					}
					if(response.max)
					{
						parentDijit.byId("bk_highest_amt").set("value", response.max);
					}
					else
					{
						parentDijit.byId("bk_highest_amt").set("value", "");
					}
					if(response.count)
					{
						parentDijit.byId("record_number").set("value", response.count);
					}
					else
					{
						parentDijit.byId("record_number").set("value", "");
					}
				},
				error: function(response, args)
				{
					parentMisys.dialog.show("ERROR", parentMisys.getLocalization("retrieveBulkDetailsError"), "");
				}
			});
			// update the grid
			parentMisys.grid.reloadForSearchTerms();
			console.debug("[misys.binding.core.create_bk] Bulk Method End: updateTransactionGrid");
		},
	
		updateError: function(parentWindow, message)
		{
			console.debug("[misys.binding.core.create_bk] Bulk Method Start: updateError");
			var parentDijit = parentWindow.dijit,
				parentMisys = parentWindow.misys,
				parentDojo = parentWindow.dojo;

			parentMisys.dialog.show("ERROR", parentMisys.getLocalization("updateBulkError"), "");

			// update the grid anyway
			parentMisys.grid.reloadForSearchTerms();
			console.debug("[misys.binding.core.create_bk] Bulk Method End: updateError");
		},
	
		bind : function()
		{
			console.debug("[misys.binding.core.create_bk] Bulk Method Start: bind");
			m.setValidation("bk_cur_code", m.validateCurrency);
			m.setValidation("template_id", m.validateTemplateId);
			m.setValidation("value_date", m.validateTransferDateCustomer);
			// clear the date array to make ajax call for BusinessDate to get holidays and cutoff details		
			m.connect("value_date","onClick", function(){
				m.clearDateCache();
				if(misys._config.isMultiBank){
					var customer_bank;
					if(dijit.byId("customer_bank"))
					{
						customer_bank = dijit.byId("customer_bank").get("value");
					}
					if(customer_bank !== "" && misys && misys._config && misys._config.businessDateForBank && misys._config.businessDateForBank[customer_bank][0] && misys._config.businessDateForBank[customer_bank][0].value !== "")
					{
						var yearServer = parseInt(misys._config.businessDateForBank[customer_bank][0].value.substring(0,4), 10);
						var monthServer = parseInt(misys._config.businessDateForBank[customer_bank][0].value.substring(5,7), 10);
						var dateServer = parseInt(misys._config.businessDateForBank[customer_bank][0].value.substring(8,10), 10);
						this.dropDown.currentFocus = new  Date(yearServer, monthServer - 1, dateServer);
					}
				}
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
				// clear the account fields like name,ccy,pab,account no.
				_clearAccountFields();
				_setBulkTypes();
			//	m.setApplicantReference();
				//set the value for template field
				dj.byId("entity_hidden").set("value",dj.byId("entity").get("value"));
				var customerBankField = dj.byId("customer_bank");
				if(misys._config.isMultiBank && customerBankField){
					customerBankField.set("value", "");
					m.populateCustomerBanks();
				}
			});
			
			m.connect("customer_bank", "onChange", function(){
				_populateCustomerBankFields(OnFormLoad);
				OnFormLoad = false;
			});
			
			m.connect("applicant_act_name", "onChange", function() {
				d.byId("display_customer_bank").innerHTML =  dj.byId("issuing_bank_name").get("value");
				d.byId("display_account").innerHTML =  dj.byId("applicant_act_name").get("value");
				d.byId("product_group").innerHTML =  dj.byId("bk_type").get("displayedValue");
				d.byId("display_child_sub_product_code").innerHTML =  dj.byId("child_sub_product_code").get("displayedValue");
				if( dj.byId("child_sub_product_code").get("value") =='MEPS' || dj.byId("child_sub_product_code").get("value") =='RTGS')
					{
					d.byId("MEPS_RTGS_DISCLAIMER").innerHTML = m.getLocalization('disclaimerforrtgs');
					}
				var child_sub_product_code = dj.byId('child_sub_product_code').get('value');
        if(child_sub_product_code=="HVPS" || child_sub_product_code=="HVXB")
					{
					_crossCurrencyCNAPS();
					}
				if(child_sub_product_code=="MUPS")
				{
				_crossCurrency();
				}
				m.verifyCanAdvance;
				_setBulkCurrency();
			});
			
			
			m.connect("applicant_collection_act_name", "onChange", function() {
				d.byId("display_to_account").innerHTML =  dj.byId("applicant_collection_act_name").get("value");
				d.byId("product_group").innerHTML =  dj.byId("bk_type").get("displayedValue");
				d.byId("display_child_sub_product_code").innerHTML =  dj.byId("child_sub_product_code").get("displayedValue");
				m.verifyCanAdvance;
				_setBulkCurrency();
			});
			
			m.connect("payroll_type", "onChange", function() {
				d.byId("display_payroll_type").innerHTML =  dj.byId("payroll_type").get("displayedValue");
				m.verifyCanAdvance;
				_setChildSubProduct();
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
			
			m.connect("bk_type", "onChange", function(){
				if(this.get("value") === "COLLE") 
				{
					m.animate("wipeOut", d.byId('payrolltype'));
				}
				else if(this.get("value") === "PAYMT") 
				{
					m.animate("wipeOut", d.byId('payrolltype'));
				}
				else if(this.get("value") === "PAYRL") 
				{
					m.animate("wipeIn", d.byId('payrolltype'));
				}
			});
			
			m.connect("child_sub_product_code", "onChange", function(){
				_clearAccountFields();
			    _setChildSubProductCodeDependentFieldValues();
			    dj.byId("child_sub_product_code").get("value") === 'MUPS' ? d.byId("display_clearing_code").style.display = "inline" : d.byId("display_clearing_code").style.display = "none";
			    
			    //Cnaps Code
			    var ftType = dj.byId("child_sub_product_code").get("value");
	            if(dj.byId("child_sub_product_code"))
	            {
	            	if (ftType == "HVPS" || ftType == "HVXB")
	            	{
	            		_setDefaultAccount();
	            	}
	            }
			});
			
			m.connect("clearing_code", "onChange", function() {
				if(dj.byId("child_sub_product_code") && dj.byId("child_sub_product_code").get("value") === 'MUPS'){
					d.byId("display_clearing_code") ? d.byId("display_clearing_code").innerHTML =  dj.byId("clearing_code").get("value") : "";
					m.verifyCanAdvance();
				}
			});
			
			m.connect("bk_type", "onChange", function(){
				if(this.get("value") === "COLLE") 
				{
					m.animate("wipeIn", d.byId('collection'));
					dj.byId("applicant_act_name").set('required', false);
					m.animate("wipeOut", d.byId('otherpayments'));
					m.animate("wipeOut", d.byId('payrolltype'));
					m.animate("wipeOut", d.byId('display_payroll_row'));
					m.animate("wipeIn", d.byId('display_to_account_row'));
					m.animate("wipeOut", d.byId('display_account_row'));
					m.animate("wipeIn", d.byId('display_customer_bank_row'));
				} 
				else 
				{
					if(this.get("value") === "PAYRL")
					{
						m.animate("wipeIn", d.byId('payrolltype'));
						m.animate("wipeIn", d.byId('display_payroll_row'));
					}
					else
					{
						m.animate("wipeOut", d.byId('payrolltype'));
						m.animate("wipeOut", d.byId('display_payroll_row'));
					}
					m.animate("wipeIn", d.byId('otherpayments'));
					
					dj.byId("applicant_collection_act_name").set('required', false);
					m.animate("wipeOut", d.byId('collection'));
					
					m.animate("wipeOut", d.byId('display_to_account_row'));
					m.animate("wipeIn", d.byId('display_account_row'));
					m.animate("wipeIn", d.byId('display_customer_bank_row'));
				}
				m.verifyCanAdvance();
				//if from onload dont clear 
				if (!bkTypeChangeFromDraft) {
					dj.byId("child_sub_product_code").set("value","");
					dj.byId("sub_product_code").set("value","");
					dj.byId("payroll_type").set("value","");
				}
				_setChildSubProduct();
			});
			
			m.connect("sub_product_code", "onChange", m.verifyCanAdvance);			
			m.connect("bk_cur_code", "onChange", m.verifyCanAdvance);
			m.connect("applicant_act_pab","onChange",_checkPAB);
			m.connect("applicant_collection_act_pab","onChange",_checkPAB);
			m.connect("sub_product_code", "onChange", _getCollaborationMode);
			m.connect("sub_product_code", "onChange", _getTaskMode);			
			m.connect("AmountRange", "onBlur", 
					function(){
						m.validateFSCMFromAmount("AmountRange","AmountRange2");
					});
			m.connect("AmountRange2", "onBlur", 
					function(){
						m.validateFSCMToAmount("AmountRange2","AmountRange");
					});			
			m.connect("invoice_date_from", "onBlur",  m.validateInvoiceDateFrom);
			m.connect("invoice_date_to", "onBlur", m.validateInvoiceDateTo);
			m.connect("invoice_due_date_from", "onBlur", m.validateInvoiceDueDateFrom);
			m.connect("invoice_due_date_to", "onBlur",m.validateInvoiceDueDateTo);
			
			console.debug("[misys.binding.core.create_bk] Bulk Method End: bind");
		},
		
		onBeforeLoad : function(){
			m.excludedMethods.push({object: m, method: "addTransaction"},{object: m, method: "moveItems"},{object: m, method: "editOrRemove"});
			
			if(misys._config.isMultiBank)
			{
				if(d.byId(noCustBAnkMsgDiv))
				{
					misys.animate("fadeOut", d.byId(noCustBAnkMsgDiv));
				}
			}
		},
		
		onFormLoad : function(){
			console.debug("[misys.binding.core.create_bk] Bulk Method Start: onFormLoad");
			var bkTypeValue = dj.byId("bk_type") ? dj.byId("bk_type").get("value") : "";
			var bkTypeHiddenValue = dj.byId("bk_type_hidden") ? dj.byId("bk_type_hidden").get("value") : "";
			var issuingBankAbbvName = dj.byId("issuing_bank_abbv_name");
			var issuingBankDescName = dj.byId("issuing_bank_name");
			
			if(dj.byId("bk_highest_amt") && dijit.byId("bk_highest_amt").params && dijit.byId("bk_highest_amt").params['value'] && dijit.byId("bk_highest_amt").params['value'] != dijit.byId("bk_highest_amt").get("value"))
			{
			dj.byId("bk_highest_amt").set("value",dj.byId("bk_highest_amt").params['value']);
			}
				if(dj.byId("bk_total_amt") && dijit.byId("bk_total_amt").params && dijit.byId("bk_total_amt").params['value'] && dijit.byId("bk_total_amt").params['value'] != dijit.byId("bk_total_amt").get("value"))
			{
			dj.byId("bk_total_amt").set("value",dj.byId("bk_total_amt").params['value']);
			}
			if(misys._config.nickname==="true" && dj.byId("applicant_act_nickname_hidden") && dj.byId("applicant_act_nickname_hidden").get("value")!==""){
				dj.byId("applicant_act_nickname").set("value", dj.byId("applicant_act_nickname_hidden").get("value"));
			}
			if(misys._config.nickname==="true" && dj.byId("applicant_act_nickname") && dj.byId("applicant_act_nickname").get("value")!==""){
				m.animate("fadeIn", d.byId("label"));
				d.style("label", "display", "inline-block");
				m.animate("fadeIn", d.byId("nickname"));
				d.style("nickname","display","inline");
				d.byId("nickname").innerHTML = dj.byId("applicant_act_nickname").get("value");
			}else if(misys._config.option_for_app_date!=="SCRATCH"){
				m.animate("wipeOut", d.byId("applicant_act_nickname_row"));
			}
			m.checkBeneficiaryNicknameOnFormLoad();
			
			// when from from load or from retrieve draft or from unsigned
			//m._config.openPending is true, if from upload donot 
			if(dijit.byId('sub_product_code') && dijit.byId('sub_product_code').get('value') != "")
			{
				dijit.byId('value_date').focus();	
			}
			OnFormLoad = m._config.openPending;
			if(m._config.openPending)
			{
				_setBulkTypes(true);
				if(dj.byId("bk_type_hidden"))
				{
					dj.byId("bk_type").set("value",dj.byId("bk_type_hidden").get("value"));
				}
				if(dj.byId("payroll_type_hidden"))
				{
					dj.byId("payroll_type").set("value",dj.byId("payroll_type_hidden").get("value"));
				}
			}else
			{
				_setBulkTypes();
			}
			_setPayRollTypes();
			if(misys._config.isMultiBank)
			{
				if(d.byId(noCustBAnkMsgDiv))
				{
					misys.animate("fadeOut", d.byId(noCustBAnkMsgDiv));
				}
	    		m.populateCustomerBanks(true);
				var customerBankField = dj.byId("customer_bank");
				var customerBankHiddenField = dj.byId("customer_bank_hidden");
				var entity = dj.byId("entity");
				if(customerBankField && customerBankHiddenField)
				{
					customerBankField.set("value", customerBankHiddenField.get("value"));
				}
				if(issuingBankAbbvName && issuingBankAbbvName.get("value") !== "")
				{
					customerBankField.set("value", issuingBankAbbvName.get("value"));
					customerBankHiddenField.set("value", issuingBankAbbvName.get("value"));
					if(m._config.customerBankDetails && m._config.customerBankDetails[issuingBankAbbvName.get("value")])
					{
						issuingBankDescName.set("value", m._config.customerBankDetails[issuingBankAbbvName.get("value")][0].value);
					}
					else
					{
						issuingBankDescName.set("value", issuingBankAbbvName.get("value"));
					}
				}
				if(entity && entity.get("value") === "" && customerBankField)
				{
					customerBankField.set("disabled",true);
					customerBankField.set("required",false);
				}
				if(d.byId("display_customer_bank"))
				{
					d.byId("display_customer_bank").innerHTML =  issuingBankDescName.get("value");
				}
			}
	    	
			if(bkTypeValue === "COLLE" || bkTypeHiddenValue === "COLLE")
			{
				d.style('payrolltype','display','none');
				
				m.animate("wipeIn", d.byId('display_to_account_row'));
				m.animate("wipeOut", d.byId('display_account_row'));
				m.animate("wipeOut", d.byId('display_payroll_row'));
				m.animate("wipeIn", d.byId('display_customer_bank_row'));
				
				d.byId("product_group").innerHTML =  m.getLocalization("bulkCollectionProductGroup");
				
				d.style('collection','display','block');
				d.style('payrolltype','display','none');
				d.style('otherpayments','display','none');	
				
				dj.byId("applicant_collection_act_name").set('required', false);
			}
			else if(bkTypeValue === "PAYMT" || bkTypeHiddenValue === "PAYMT")
			{
				d.style('payrolltype','display','none');
				
				m.animate("wipeOut", d.byId('display_to_account_row'));
				m.animate("wipeIn", d.byId('display_account_row'));
				m.animate("wipeOut", d.byId('display_payroll_row'));
				m.animate("wipeIn", d.byId('display_customer_bank_row'));
				
				d.byId("product_group").innerHTML =  m.getLocalization("bulkPaymentsProductGroup");
				
				d.style('collection','display','none');
				d.style('payrolltype','display','none');
				d.style('otherpayments','display','block');	
				
				dj.byId("applicant_collection_act_name").set('required', false);
			}
			else if(bkTypeValue === "PAYRL" || bkTypeHiddenValue === "PAYRL")
			{
				d.style('payrolltype','display','block');
				
				m.animate("wipeOut", d.byId('display_to_account_row'));
				m.animate("wipeIn", d.byId('display_account_row'));
				m.animate("wipeIn", d.byId('display_customer_bank_row'));
				
				d.byId("product_group").innerHTML =  m.getLocalization("bulkPayrollProductGroup");
				
				d.style('collection','display','none');
				d.style('otherpayments','display','none');	
				d.style('payrolltype','display','block');
				d.style('display_payroll_row','display','block');
				
				dj.byId("applicant_collection_act_name").set('required', false);
				
				_checkPayrollAmtTransactionAccess(true);
			}
			else
			{
				d.style('payrolltype','display','none');
				if(dj.byId("applicant_img"))
				{
					dj.byId("applicant_img").set("disabled",true);
				}
				
				m.animate("wipeOut", d.byId('display_to_account_row'));
				
				d.style('collection','display','none');
				d.style('otherpayments','display','none');
				d.style('payrolltype','display','none');
				d.style('display_payroll_row','display','none');
			}
			
			var content1 = d.byId("content1"),
				content2 = d.byId("content2");
			if(dj.byId("applicant_act_no") && dj.byId("applicant_act_no").get("value") === '')
			{
				if (content1)
				{
					d.style("content1", "display", "block");
					d.style("display_sub_product_code_row", "display", "none");
				}
				if (content2)
				{
					d.style("content2", "display", "none");
				}							
			}
			else
			{
				if (content1)
				{
					d.style("content1", "display", "none");
				}
				if (content2)
				{
					d.style("content2", "display", "block");
				}
			}
			
			if(d.byId('clearingCode_div'))
			{
				d.style('clearingCode_div','display','none');
				if(dj.byId("clearing_code"))
				{
					dj.byId("clearing_code").set('required', false);
				}
				
			}
			
			if (dj.byId("button_intrmdt_ok"))
			{
				dj.byId("button_intrmdt_ok").set("disabled", true);				
			}
			m.setCurrency(dj.byId("bk_total_amt_cur_code"), ["bk_total_amt"]);
			m.setCurrency(dj.byId("bk_highest_amt_cur_code"), ["bk_highest_amt"]);
			// by default on load dont show PAB check box
			m.animate("wipeOut", d.byId('pab_checkbox_row'));
			//m.setApplicantReference();
			//validate transfer date 
			var valueDateField = dj.byId("value_date");
			var applDate = dj.byId("appl_date");
			if (valueDateField && valueDateField.get('value') && applDate && applDate.get('value') && !m.compareDateFields(applDate, valueDateField))
			{
				var displayMessage = m.getLocalization("transferDateLessThanAppDateError", [ valueDateField.get('displayedValue'), applDate.get('displayedValue') ]);
				valueDateField.set("state","Error");
				dj.hideTooltip(valueDateField.domNode);
				dj.showTooltip(displayMessage, valueDateField.domNode, 0);
				setTimeout(function(){
					dj.hideTooltip(valueDateField.domNode);
				}, 2000);
			}
			
			_validateTotalamt();
			console.debug("[misys.binding.core.create_bk] Bulk Method End: onFormLoad");
		}, 
		
		beforeSaveValidations : function(){
			
			_updateBulkTypeWithHiddenField();
			var entity = dj.byId("entity") ;
	    	if (entity && entity.get("value") === "")
			{
				return false;
			} else
			{
				return true;
			}
        },
        
        submitBulkCommon : function(form)
        {
        	this.submitBulk(form);
        },

		submitBulk : function(formValidation)
		{		
			_updateBulkTypeWithHiddenField();
			
			// Summary : submit method for Bulk. First checks for Holiday and Cut-off then Fixes the child transactions if date is modified
			//			 then Submits.
			//TODO : Deferred calls are used, which are not necessary for synchronous calls. Need to remove them to reduce complexity.
			
			console.debug("[misys.binding.core.create_bk] Bulk Method Start: submitBulk");
			
			//check for the child transactions validating
			_validChildTransactions();
			//checking account status for Bulk FTs
		    var ftType = dj.byId("child_product_code").get("value");
		    if(ftType !== "" && ftType === "FT"){
		    	if(!_checkFTAccountStatus()){
		    		misys.dialog.show('ERROR',m.getLocalization("accountStatusError"));
		    		return;
		    	}
			}
			 if(dj.byId("return_comments"))
			 {	
				 dj.byId("return_comments").set("required",false);	
			 }
			if(!formValidation())
			{
				 misys.dialog.show('ERROR',m.getLocalization("mandatoryFieldsToSubmitError"));
			}
			else if(dj.byId("record_number").get("value") < 1) 
			{
				m.dialog.show("ERROR",m.getLocalization("atleastOneTransactionHasTobeAddedForBulk"));
			}
			else if(!childTransactionsValid)
			{
				m.dialog.show("ERROR",m.getLocalization("oneTransactionIsInvalid"));
			}
			else
			{
			var dfdFirstPart = new d.Deferred();
			var dfdSecondPart = new d.Deferred();
			var dfdSubmit = new d.DeferredList([dfdFirstPart, dfdSecondPart]);
	
			var dfdGetBusinessDate = m.xhrPost({
				url : misys.getServletURL("/screen/AjaxScreen/action/GetBulkBusinessDateAction"),
				sync : true,
				handleAs : "json",
				content : {
					transactiondata : m.formToXML({ selector: "#fakeform1", xmlRoot : "bk_tnx_record"}),
					//TODO: Remove this once holiday cut off is generalized
					e2ee_plus_public_key : dj.byId("e2ee_plus_public_key") ? dj.byId("e2ee_plus_public_key").get("value") : null,
					e2ee_plus_challenge    : dj.byId("e2ee_plus_challenge") ? dj.byId("e2ee_plus_challenge").get("value") : null,
					e2ee_server_random : dj.byId("e2ee_server_random") ? dj.byId("e2ee_server_random").get("value") :null
				},
				load: function(response, args){
					//Response 
					var valid = response.valid;
					var requestedDate = response.requestedDate;
					var calculatedDate = response.calculatedDate;
					var autoForwardEnabled = response.autoForwardEnabled;
					if(valid === false)
					{
						m._config.onSubmitErrorMsg = response.errorMessage;
						//Dialog show
						_showHolidaysNCutOffTimeErrorDialog(autoForwardEnabled);
					}
					else
					{
						m.submitBulkNoAutoForward("SUBMIT");
					}
				},
				customError : function(response, args){
					console.error('[misys.validation.common] Technical error while validating business days and cut-off time');
					console.error(response);
					status = false;
					
					//Set Error Msg
					m._config.onSubmitErrorMsg = m.getLocalization("technicalErrorWhileValidatingBusinessDays");
					//Set Holidays Disabled to show non custom error
					m._config = m._config || {};
					dojo.mixin(m._config,{holidayCutOffEnabled:false});
				}
			});
		}
		
	}
   });

})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.core.create_bk_client');