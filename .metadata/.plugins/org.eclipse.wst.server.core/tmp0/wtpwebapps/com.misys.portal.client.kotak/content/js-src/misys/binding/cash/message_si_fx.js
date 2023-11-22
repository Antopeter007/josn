dojo.provide("misys.binding.cash.message_si_fx");
/*
 -----------------------------------------------------------------------------
 Scripts for
  
  Foreign Exchange (FX) Form, Customer Side.
  
 Note: the function fncFormSpecificValidation is required

 Copyright (c) 2000-2010 Misys (http://www.misys.com),
 All Rights Reserved. 

 version:   1.0
 date:      22/09/10
 
 TODO reorganize functions (put some in fxAction.js or fxTimer.js)
 -----------------------------------------------------------------------------
 */

dojo.require("misys.form.SimpleTextarea");
dojo.require("misys.form.common");
dojo.require("misys.validation.common");
dojo.require("misys.grid._base");
dojo.require("dojo.data.ItemFileReadStore");
dojo.require("dojo.parser");
dojo.require("dojo.data.ItemFileReadStore");
dojo.require("dijit.layout.TabContainer");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.Dialog");
dojo.require("dijit.ProgressBar");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.CheckBox");
dojo.require("dijit.layout.ContentPane");
dojo.require("dijit.form.DateTextBox");
dojo.require("dijit.form.CurrencyTextBox");
dojo.require("dijit.form.NumberTextBox");
dojo.require("dijit.form.FilteringSelect");
dojo.require("dojox.grid.EnhancedGrid");
dojo.require("dojox.grid.enhanced.plugins.Menu");
dojo.require("dojox.grid.enhanced.plugins.NestedSorting");
dojo.require("dojox.grid.enhanced.plugins.IndirectSelection");
dojo.require("dojox.grid.cells.dijit");
dojo.require("misys.binding.cash.common.request_action");
dojo.require("misys.binding.common");
dojo.require("misys.binding.cash.common.standing_instruction_action");



(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {
	
	"use strict"; // ECMA5 Strict Mode
	
	/**
	  * Validation for Reauthentication 
	 */
	d.mixin(m._config, {

		initReAuthParams : function() {

			var reAuthParams = {
				productCode : 'FX',
				subProductCode : dj.byId("sub_product_code")? dj.byId("sub_product_code").get("value"): '',
				transactionTypeCode : "13",
				entity :dj.byId("entity") ? dj.byId("entity").get("value") : "",
				currency : '',
				amount : '',				
				es_field1 : '',
				es_field2 : ''
			};
			return reAuthParams;
		}
	});
	
	// insert private functions & variables
	
	// Public functions & variables follow
	d.mixin(m, {
		bind : function() {
			//  summary:
		    //            Binds validations and events to fields in the form.              
		    //   tags:
		    //            public
			
			if (dj.byId("beneficiary_country")){
				m.setValidation("beneficiary_country", m.validateCountry);
			}
			if (dj.byId("beneficiary_bank_country")){
				m.setValidation("beneficiary_bank_country", m.validateCountry);
			}
			if (dj.byId("ordering_cust_country")){
				m.setValidation("ordering_cust_country", m.validateCountry);
			}
			if (dj.byId("intermediary_bank_country")){
				m.setValidation("intermediary_bank_country", m.validateCountry);
			}
			
			// Allow user to add only BIC Code or bank name and address
			m.connect('beneficiary_bank_bic', 'onBlur', function(){
				var prefix = "beneficiary";
				var bicCode=  dj.byId('beneficiary_bank_bic').value;
				m.toggleBeneficiaryFields(bicCode,prefix,'beneficiary_bank_country_btn_img',true);
			});
			
			m.connect('intermediary_bank_bic', 'onBlur', function(){
				var prefix = "intermediary";
				var bicCode=  dj.byId('intermediary_bank_bic').value;
				m.toggleBeneficiaryFields(bicCode,prefix,'intermediary_bank_country_btn_img',false);
			});
			m.connect('beneficiary_bank', 'onBlur', function(){
				var bankInp=  dj.byId('beneficiary_bank').value;
				var showBICFlag = "false";
				if(dj.byId("show_bic_code"))
					{
						showBICFlag = dj.byId("show_bic_code").get("value");
					}
				if(showBICFlag === "true")
					{
						if(dj.byId("beneficiary_bank_bic") && dj.byId("beneficiary_bank_bic").get("value") === "")
						{
							m.toggleBICFields(bankInp,'beneficiary_bank_bic');
						}
					}
				else
					{
						m.toggleBICFields(bankInp,'beneficiary_bank_bic');
					}
			});
			
			m.connect('intermediary_bank', 'onBlur', function(){				
				var bankInp=  dj.byId('intermediary_bank').value;
				m.toggleBICFields(bankInp,'intermediary_bank_bic');
			});
			
			
			if (dijit.byId("receipt_completed_indicator") && (dj.byId("receipt_completed_indicator").get("value") === "N" || dj.byId("receipt_completed_indicator").get("value") === "")){
			
				m.connect("instructions_type_1", "onClick", function(){m._fncSwitchBankPaymentInstructionsFields("bank_instruction_field", "free_format_field", "instructions_type_2",null,null,"instructions_type_2",null);});
				m.connect("instructions_type_2", "onClick", function(){
					m._fncSwitchBankPaymentInstructionsFields("free_format_field", "bank_instruction_field","freeformatbeneficiary",null,null, "instructions_type_1");
					misys._populateSwiftFields();
					if(m._config.swift_allowed){
						misys._populateClearingCodes("beneficiary_bank");
						misys._populateClearingCodes("beneficiary");
						misys._populateClearingCodes("intermediary_bank");
						misys._populateClearingCodes("ordering_customer");
					}
					});
				m.connect("payment_type", "onChange", function(){m.changeRequiredFieldsOnPaymentTypeChange("");});
				m.connect("beneficiary_account", "onChange", function(){m._fncChangeRequiredFieldsOnChange("beneficiary_account", "");});
				m.connect("beneficiary_address", "onChange", function(){m._fncChangeRequiredFieldsOnChange("beneficiary_address", "");});
				m._fncConnectSSIFields("");
				
				//When Free Format Instructions --> Additional Instructions is selected
				m.connect("freeformataddlinstructionslabel", "onClick", 
						function(){ m.fncfreeformataddlinstructions(null);});				
				
				//When Free Format Instructions --> Payment Details is selected
				m.connect("freeformatpaymentdetailslabel", "onClick", 
						function(){ m.fncfreeformatpaymentdetails(null);});				
	
				//When Free Format Instructions --> Beneficiary Details is selected
				m.connect("freeformatbeneficiarylabel", "onClick", 
						function(){ m.fncfreeformatbeneficiary(null);});				
			}
			
			
			if("SWAP" === dj.byId("sub_product_code").get("value")){
				if (dijit.byId("near_receipt_completed_indicator") && ( dj.byId("near_receipt_completed_indicator").get("value") === "N" || dj.byId("near_receipt_completed_indicator").get("value") === "")){
					m.connect("near_instructions_type_1", "onClick", function(){
					m._fncSwitchBankPaymentInstructionsFields("bank_instruction_field", "free_format_field", "near_instructions_type_2",null,null,null,"near");});
					m.connect("near_instructions_type_2", "onClick", function(){
					m._fncSwitchBankPaymentInstructionsFields("free_format_field", "bank_instruction_field", "freeformatbeneficiary","freeformataddlinstructions","freeformatpaymentdetails","near_instructions_type_1","near");});
					m.connect("near_payment_type", "onChange", function(){m.changeRequiredFieldsOnPaymentTypeChange("near");});
					m.connect("near_beneficiary_account", "onChange", function(){_fncChangeRequiredFieldsOnChange("near_beneficiary_account", "near");});
					m.connect("near_beneficiary_address", "onChange", function(){_fncChangeRequiredFieldsOnChange("near_beneficiary_address", "near");});
					m.connect("near_intermediary_bank", "onChange", function(){_fncChangeRequiredFieldsOnChange("near_intermediary_bank", "near");});
				//	m.connect("near_bankPaymentGrid", "onSelected", function(){m._fncChangeDisabledAdditionalDetailsFiels("near_additional_details", false);});
					m._fncConnectSSIFields("near_");
					//When Free Format Instructions --> Additional Instructions is selected
					m.connect("near_freeformataddlinstructionslabel", "onClick", 
							function(){ m.fncfreeformataddlinstructions("near");});				
					
					//When Free Format Instructions --> Payment Details is selected
					m.connect("near_freeformatpaymentdetailslabel", "onClick", 
							function(){ m.fncfreeformatpaymentdetails("near");});				
	
					//When Free Format Instructions --> Beneficiary Details is selected
					m.connect("near_freeformatbeneficiarylabel", "onClick", 
							function(){ m.fncfreeformatbeneficiary("near");});				
				
					/*				
					if (dj.byId("near_beneficiary_country")){
						m.setValidation("near_beneficiary_country", m.validateCountry);
					}
					if (dj.byId("near_beneficiary_bank_country")){
						m.setValidation("near_beneficiary_bank_country", m.validateCountry);
					}				
	
					m.connect("near_beneficiary_country", "onChange", function(){
						m.setCountry(this, ["near_beneficiary_country"]);
					});
					m.connect("near_beneficiary_bank_country", "onChange", function(){
						m.setCountry(this, ["near_beneficiary_bank_country"]);
					});*/
					
					m.connect("far_instructions_type_1", "onClick", function(){
					m._fncSwitchBankPaymentInstructionsFields("bank_instruction_field", "free_format_field", "far_instructions_type_2",null,null,null,"far");});
					m.connect("far_instructions_type_2", "onClick", function(){
					m._fncSwitchBankPaymentInstructionsFields("free_format_field", "bank_instruction_field", "freeformatbeneficiary","freeformataddlinstructions","freeformatpaymentdetails","far_instructions_type_1","far");});
					m.connect("far_payment_type", "onChange", function(){m.changeRequiredFieldsOnPaymentTypeChange("far");});
					m.connect("far_beneficiary_account", "onChange", function(){_fncChangeRequiredFieldsOnChange("far_beneficiary_account", "far");});
					m.connect("far_beneficiary_address", "onChange", function(){_fncChangeRequiredFieldsOnChange("far_beneficiary_address", "far");});
	
					//When Free Format Instructions --> Additional Instructions is selected
					m.connect("far_freeformataddlinstructionslabel", "onClick", 
							function(){ m.fncfreeformataddlinstructions("far");});				
					
					//When Free Format Instructions --> Payment Details is selected
					m.connect("far_freeformatpaymentdetailslabel", "onClick", 
							function(){ m.fncfreeformatpaymentdetails("far");});				
	
					//When Free Format Instructions --> Beneficiary Details is selected
					m.connect("far_freeformatbeneficiarylabel", "onClick", 
							function(){ m.fncfreeformatbeneficiary("far");});		
					
					m._fncConnectSSIFields("far_");
				}
				
			}
			m.setValidation("beneficiary_bank_bic", m.validateBICFormat);  
			m.setValidation("intermediary_bank_bic", m.validateBICFormat);
		},
		onFormLoad : function() {
			//  summary:
		    //          Events to perform on page load.
		    //  tags:
		    //         public
			
			var fx_si = m._config.fx_si;
			
			//rec_id
			dj.byId("rec_id").set("value", fx_si.rec_id);
			// display / hide fields (default)
			if (dj.byId("receipt_completed_indicator") && ( dj.byId("receipt_completed_indicator").get("value") === "N" || dj.byId("receipt_completed_indicator").get("value") === "")){
				d.style("bank_instruction_field",{"display":"block"});
				d.style("free_format_field",{"display":"none"});
				// set required false for select field
				if(dj.byId("payment_type")){
					dj.byId("payment_type").set("required", false);				
				}
			}
			// first table - retrieve the json object of instruction payment
			
			// in case of swap
			var sub_product_code = dj.byId("sub_product_code").get("value");
			var customerPaymentJson;
			var bankPaymentJson;
			if (sub_product_code === "SWAP"){
				if (dijit.byId("near_receipt_completed_indicator") && ( dj.byId("near_receipt_completed_indicator").get("value") === "N" || dj.byId("near_receipt_completed_indicator").get("value") === "")){
					// set required false for select field
					if(dj.byId("near_payment_type")){
						dj.byId("near_payment_type").set("required", false);
					}
					// display / hide fields
					d.style("near_bank_instruction_field",{"display":"block"});
					d.style("near_free_format_field",{"display":"none"});
				}
				var customerPaymentNearJson = {items : fx_si.near_payments};
				if (dijit.byId("near_payment_completed_indicator") && (dj.byId("near_payment_completed_indicator").get("value") === "N" || dj.byId("near_payment_completed_indicator").get("value") === "")){
					m._fncConstructCustomerPaymentGrid(customerPaymentNearJson, "near_customerPaymentGrid", "near_payment_instructions_id","near");
					m._fncSetGridSelectedId("near_customerPaymentGrid", dj.byId("near_customer_instruction_indicator").value);
				}
				// second table
				var bankPaymentNearJson = {items : fx_si.near_receipts};
				if (dijit.byId("near_receipt_completed_indicator") && (dj.byId("near_receipt_completed_indicator").get("value") === "N" || dj.byId("near_receipt_completed_indicator").get("value") === "")){	
					m._fncConstructBankPaymentGrid(bankPaymentNearJson, "near_bankPaymentGrid", "near_receipt_instructions_id","near");
					m._fncSetGridSelectedId("near_bankPaymentGrid", dj.byId("near_bank_instruction_indicator").value);
					// in each case, we disabled additional fields
					m._fncChangeDisabledAdditionalDetailsFiels("near_additional_details", true);
					//show Instructions if stored already.
					_fncDisplayStoredBankInstruction("near");		
				}

				customerPaymentJson = {items : fx_si.payments};
				if (dj.byId("payment_completed_indicator") && (dj.byId("payment_completed_indicator").get("value") === "N" || dj.byId("payment_completed_indicator").get("value") === "")){
					_fncConstructCustomerPaymentGrid(customerPaymentJson, "customerPaymentGrid", "payment_instructions_id",null);
					m._fncSetGridSelectedId("customerPaymentGrid", dj.byId("customer_instruction_indicator").value);
				}
				// second table 
				bankPaymentJson = {items : fx_si.receipts};
				if (dijit.byId("receipt_completed_indicator") && (dj.byId("receipt_completed_indicator").get("value") === "N" ||  dj.byId("receipt_completed_indicator").get("value") === "")){

					d.style("bank_instruction_field",{"display":"block"});
					d.style("free_format_field",{"display":"none"});
					
					m._fncConstructBankPaymentGrid(bankPaymentJson, "bankPaymentGrid", "receipt_instructions_id", null);
					m._fncSetGridSelectedId("bankPaymentGrid", dj.byId("bank_instruction_indicator").value);
					// in each case, we disabled additional fields
					m._fncChangeDisabledAdditionalDetailsFiels("additional_details", true);
					_fncDisplayStoredBankInstruction(null);
				}
				
				/*//using FAR instead of standard
				customerPaymentJson = {items : fx_si.payments};
				if (dj.byId("far_payment_completed_indicator") && (dj.byId("far_payment_completed_indicator").get("value") === "N" || dj.byId("far_payment_completed_indicator").get("value") === "")){
					_fncConstructCustomerPaymentGrid(customerPaymentJson, "far_customerPaymentGrid", "far_payment_instructions_id","far");
					m._fncSetGridSelectedId("far_customerPaymentGrid", dj.byId("far_customer_instruction_indicator").value);
				}
				// second table 
				bankPaymentJson = {items : fx_si.receipts};
				if (dijit.byId("far_receipt_completed_indicator") && (dj.byId("far_receipt_completed_indicator").get("value") === "N" ||  dj.byId("far_receipt_completed_indicator").get("value") === "")){

					d.style("far_bank_instruction_field",{"display":"block"});
					d.style("far_free_format_field",{"display":"none"});
					
					m._fncConstructBankPaymentGrid(bankPaymentJson, "far_bankPaymentGrid", "far_receipt_instructions_id", "far");
					m._fncSetGridSelectedId("far_bankPaymentGrid", dj.byId("far_bank_instruction_indicator").value);
					// in each case, we disabled additional fields
					m._fncChangeDisabledAdditionalDetailsFiels("far_additional_details", true);
					//show Instructions if stored already (near and far).
					_fncDisplayStoredBankInstruction("near");		
					_fncDisplayStoredBankInstruction("far");
				}
				*/
				
			}
			else
			{
				
				customerPaymentJson = {items : fx_si.payments};
				if (dj.byId("payment_completed_indicator") && (dj.byId("payment_completed_indicator").get("value") === "N" || dj.byId("payment_completed_indicator").get("value") === "") ) {
					m._fncConstructCustomerPaymentGrid(customerPaymentJson, "customerPaymentGrid", "payment_instructions_id", "", dj.byId("customer_instruction_indicator").value);
					m._fncSetGridSelectedId("customerPaymentGrid", dj.byId("customer_instruction_indicator").value);
				}
				// second table
				bankPaymentJson = {items : fx_si.receipts};
				if (dijit.byId("receipt_completed_indicator") && ( dj.byId("receipt_completed_indicator").get("value") === "N" || dj.byId("receipt_completed_indicator").get("value") === "" ) ){
					d.style("bank_instruction_field",{"display":"block"});
					d.style("free_format_field",{"display":"none"});
					m._fncConstructBankPaymentGrid(bankPaymentJson, "bankPaymentGrid", "receipt_instructions_id");	
					// in each case, we disabled additional fields
					m._fncChangeDisabledAdditionalDetailsFiels("additional_details", true);
					m._fncSetGridSelectedId("bankPaymentGrid", dj.byId("bank_instruction_indicator").value);
					//show Instructions if stored already.
					m._fncDisplayStoredBankInstruction(null);
				}

				// apply validation rules for free format instructions 
				if (dj.byId("instructions_type_2") && dj.byId("instructions_type_2").checked)
				{
					m.changeRequiredFieldsOnPaymentTypeChange();
					misys._populateSwiftFields();
					if(m._config.swift_allowed){
						misys._populateClearingCodes("beneficiary_bank");
						misys._populateClearingCodes("beneficiary");
						misys._populateClearingCodes("intermediary_bank");
						misys._populateClearingCodes("ordering_customer");
					}				
				}
				if (dj.byId("instructions_type_1") && dj.byId("instructions_type_1").checked)
				{
					m._fncChangePaymentTypeRequired("bank_instruction_field", "free_format_field", "");
				}				
			}
			
			var prefix, bicCode, bankInp;
			
			if(dj.byId("beneficiary_bank_bic") && dj.byId("beneficiary_bank_bic").get("value") !== "")
			{
				 prefix = "beneficiary";
				 bicCode=  dj.byId('beneficiary_bank_bic').value;
				m.toggleBeneficiaryFields(bicCode,prefix,'beneficiary_bank_country_btn_img',true);
			}
			else if(dj.byId("beneficiary_bank") && dj.byId("beneficiary_bank").get("value") !== "")
			{
				 bankInp=  dj.byId('beneficiary_bank').value;
				m.toggleBICFields(bankInp,'beneficiary_bank_bic');
			}
			
			
			if(dj.byId("intermediary_bank_bic") && dj.byId("intermediary_bank_bic").get("value") !== "")
			{
				 prefix = "intermediary";
				 bicCode=  dj.byId('intermediary_bank_bic').value;
				m.toggleBeneficiaryFields(bicCode,prefix,'intermediary_bank_country_btn_img',false);
			}
			else if(dj.byId("intermediary_bank") && dj.byId("intermediary_bank").get("value") !== "")
			{
				 bankInp=  dj.byId('intermediary_bank').value;
				m.toggleBICFields(bankInp,'intermediary_bank_bic');
			}
			
			
		},
		beforeSubmitValidations : function() {
			//With one leg submit no test.
			var customerPaymentGridIsValid;
			var bankPaymentGridIsValid;
			var near_customerPaymentGridIsValid;
			var near_bankPaymentGridIsValid;
			var far_customerPaymentGridIsValid;
			var far_bankPaymentGridIsValid;
			var suggest_freeFormatForBankInst=false;
			var error_message = "";
			
			if(dj.byId('customerPaymentGrid') ){
				customerPaymentGridIsValid= dj.byId('customerPaymentGrid').store._arrayOfAllItems.length == 0 || (dj.byId('customerPaymentGrid').store._arrayOfAllItems.length != 0 && dj.byId('customerPaymentGrid').selection.selectedIndex != -1);
			}
			else{
				customerPaymentGridIsValid = true;
				if(dj.byId('bankPaymentGrid') && dj.byId('bankPaymentGrid').store._arrayOfAllItems.length == 0 && dj.byId('instructions_type_1').checked){
					// when one leg is already added and there is no value for the other leg, user must not be allowed to submit.
					// i.e, when customer payment instructions are already added and bank payment grid has no instructions in the store to be chosen 
					suggest_freeFormatForBankInst=true;
				}
			}
			
			if(dj.byId('bankPaymentGrid')){
				bankPaymentGridIsValid = dj.byId('bankPaymentGrid').store._arrayOfAllItems.length == 0 || (dj.byId('bankPaymentGrid').store._arrayOfAllItems.length != 0 && dj.byId('instructions_type_1').checked && dj.byId('bankPaymentGrid').selection.selectedIndex != -1) || dj.byId('instructions_type_2').checked;
			}
			else{
				bankPaymentGridIsValid = true;
				if(dj.byId('customerPaymentGrid') && dj.byId('customerPaymentGrid').store._arrayOfAllItems.length == 0){
					// when one leg is already added and there is no value for the other leg, user must not be allowed to submit.
					// i.e, when bank payment instructions are already added and customer payment grid has no instructions in the store to be chosen 
					customerPaymentGridIsValid=false;
				}
			}

			if(dj.byId('customerPaymentGrid') && dj.byId('bankPaymentGrid') && dj.byId('customerPaymentGrid').store._arrayOfAllItems.length == 0 && dj.byId('bankPaymentGrid').store._arrayOfAllItems.length ==0 && dj.byId('instructions_type_1').checked)
			{
				customerPaymentGridIsValid = false;
				bankPaymentGridIsValid = false;
			}
					
			if(dj.byId("near_customerPaymentGrid") ){
				near_customerPaymentGridIsValid= dj.byId("near_customerPaymentGrid").store._arrayOfAllItems.length === 0 || (dj.byId("near_customerPaymentGrid").store._arrayOfAllItems.length !== 0 && dj.byId("near_customerPaymentGrid").selection.selectedIndex !== -1);
			}
			else{
				near_customerPaymentGridIsValid = true;
			}
			
			if(dj.byId("near_bankPaymentGrid")){
				near_bankPaymentGridIsValid = dj.byId("near_bankPaymentGrid").store._arrayOfAllItems.length === 0 || (dj.byId("near_bankPaymentGrid").store._arrayOfAllItems.length !== 0 && dj.byId("near_instructions_type_1").checked && dj.byId("near_bankPaymentGrid").selection.selectedIndex !== -1) || dj.byId("near_instructions_type_2").checked;
			}
			else{
				near_bankPaymentGridIsValid = true;
			}
			
			
			if(dj.byId("far_customerPaymentGrid") ){
				far_customerPaymentGridIsValid= dj.byId("far_customerPaymentGrid").store._arrayOfAllItems.length === 0 || (dj.byId("far_customerPaymentGrid").store._arrayOfAllItems.length !== 0 && dj.byId("far_customerPaymentGrid").selection.selectedIndex !== -1);
			}
			else{
				far_customerPaymentGridIsValid = true;
			}
			
			if(dj.byId("far_bankPaymentGrid")){
				far_bankPaymentGridIsValid = dj.byId("far_bankPaymentGrid").store._arrayOfAllItems.length === 0 || (dj.byId("far_bankPaymentGrid").store._arrayOfAllItems.length !== 0 && dj.byId("far_instructions_type_1").checked && dj.byId("far_bankPaymentGrid").selection.selectedIndex !== -1) || dj.byId("far_instructions_type_2").checked;
			}
			else{
				far_bankPaymentGridIsValid = true;
			}

			error_message = m.getLocalization("selectInstructionError");
			m._config.onSubmitErrorMsg =  error_message;
			
			//if no instructions are added 
			var gridLength = dojo.query("[class= 'dojoxGridRowTable']");
			var messageError = "";
			if(gridLength.length === 2){
				messageError = m.getLocalization("attachOneInstruction");
				m._config.onSubmitErrorMsg =  messageError;
			}
			
			if(suggest_freeFormatForBankInst){
				var freeFormatMsgError = m.getLocalization("attachFreeFormatInstruction");
				m._config.onSubmitErrorMsg =  freeFormatMsgError;
				return false;
			}
			// TODO: show error message on the table
			return customerPaymentGridIsValid && bankPaymentGridIsValid && near_customerPaymentGridIsValid && near_bankPaymentGridIsValid && far_customerPaymentGridIsValid && far_bankPaymentGridIsValid ;
		},
		/** 
		 * Action linked to the selection of an index in a table.
		 * Complete hidden field with the selected index. 
		 */
		selectIndex : function(/*String*/ idRowSelected, /*String*/ idTable, /*String*/idHiddenField)
		{
			//var selectedIndex = dj.byId(idTable).selection.selectedIndex;
			var idData = dj.byId(idTable).selection.getSelected()[0].id;
			dj.byId(idHiddenField).set("value", idData);
			if (idTable === "bankPaymentGrid"){
				m._fncChangeDisabledAdditionalDetailsFiels("additional_details", false);
			}else if (idTable === "near_bankPaymentGrid"){
				m._fncChangeDisabledAdditionalDetailsFiels("near_additional_details", false);
			} 
			else if (idTable === "far_bankPaymentGrid"){
				m._fncChangeDisabledAdditionalDetailsFiels("far_additional_details", false);
			}
		}
	});
})(dojo, dijit, misys);




//Including the client specific implementation
       dojo.require('misys.client.binding.cash.message_si_fx_client');