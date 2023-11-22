dojo.provide("misys.binding.treasury.message_si_td_trtd");

/*
 -----------------------------------------------------------------------------
 Scripts for

  Term Deposit (TD) Form, Customer Side.

 Note: the function fncFormSpecificValidation is required

 Copyright (c) 2000-2010 Misys (http://www.misys.com),
 All Rights Reserved. 

 version:   1.0
 date:      22/09/10

 -----------------------------------------------------------------------------
 */
dojo.require("misys.form.SimpleTextarea");
dojo.require("misys.form.common");
dojo.require("misys.validation.common");
dojo.require('misys.grid._base');
dojo.require("dojo.data.ItemFileReadStore");
dojo.require("dojo.parser");
dojo.require('dojo.data.ItemFileReadStore');
dojo.require("dijit.layout.TabContainer");
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
dojo.require("dijit.form.NumberTextBox");
dojo.require("dijit.form.FilteringSelect");
dojo.require("dojox.grid.EnhancedGrid");
dojo.require("dojox.grid.enhanced.plugins.Menu");
dojo.require("dojox.grid.enhanced.plugins.NestedSorting");
dojo.require("dojox.grid.enhanced.plugins.IndirectSelection");
dojo.require("dojox.grid.cells.dijit");
dojo.require("misys.binding.common");
dojo.require("misys.binding.cash.common.standing_instruction_action");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {
	

	
	/**
	  * Validation for Reauthentication 
	 */
	d.mixin(m._config, {

		initReAuthParams : function() {

			var reAuthParams = {
				productCode : 'TD',
				subProductCode : dj.byId("sub_product_code").get("value"),
				transactionTypeCode : '01',
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
				m.toggleBICFields(bankInp,'beneficiary_bank_bic');
			});
			
			m.connect('intermediary_bank', 'onBlur', function(){				
				var bankInp=  dj.byId('intermediary_bank').value;
				m.toggleBICFields(bankInp,'intermediary_bank_bic');
			});
			
		
			if (dijit.byId("receipt_completed_indicator") && (dj.byId("receipt_completed_indicator").get("value") === "N" || dj.byId("receipt_completed_indicator").get("value") === "")){
				
				m.connect("instructions_type_1", "onClick", function(){
					m._fncSwitchBankPaymentInstructionsFields("bank_instruction_field", "free_format_field", "instructions_type_2",null,null,"instructions_type_2",null);});
				m.connect("instructions_type_2", "onClick", function(){
					m._fncSwitchBankPaymentInstructionsFields("free_format_field", "bank_instruction_field","freeformatbeneficiary",null,null, "instructions_type_1");
					misys.removeAdditionalFieldsForCD();
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
	
	var subTnxTypeCode = dijit.byId('sub_tnx_type_code').get('value');
	if (subTnxTypeCode=='25'){
		m.connect('near_instructions_type_1', 'onClick', function(){_fncSwitchBankPaymentInstructionsFields('near_bank_instruction_field', 'free_format_field', 'near_instructions_type_2','near');});
		m.connect('near_instructions_type_2', 'onClick', function(){_fncSwitchBankPaymentInstructionsFields('near_free_format_field', 'bank_instruction_field', 'near_instructions_type_1','near');});
		m.connect('near_payment_type', 'onChange', function(){_fncChangeRequiredFieldsOnPaymentTypeChange('near');});
		m.connect('near_beneficiary_account', 'onChange', function(){_fncChangeRequiredFieldsOnChange('near_beneficiary_account', 'near');});
		m.connect('near_beneficiary_address', 'onChange', function(){_fncChangeRequiredFieldsOnChange('near_beneficiary_address', 'near');});
		m.connect('near_intermediary_bank', 'onChange', function(){_fncChangeRequiredFieldsOnChange('near_intermediary_bank', 'near');});
		
		m.connect("freeformataddlinstructionslabel", "onClick", 
				function(){ m.fncfreeformataddlinstructions(null);});				
		
		//When Free Format Instructions --> Payment Details is selected
		m.connect("freeformatpaymentdetailslabel", "onClick", 
				function(){ m.fncfreeformatpaymentdetails(null);});				

		//When Free Format Instructions --> Beneficiary Details is selected
		m.connect("freeformatbeneficiarylabel", "onClick", 
				function(){ m.fncfreeformatbeneficiary(null);});
	}
	
	m.setValidation("beneficiary_bank_bic", m.validateBICFormat);  
	m.setValidation("intermediary_bank_bic", m.validateBICFormat);
},

onFormLoad : function() {
	//  summary:
    //          Events to perform on page load.
    //  tags:
    //         public

	var td_si = misys._config.td_si;
	var subTnxTypeCode = dj.byId('sub_tnx_type_code').get('value');
	//rec_id
	dj.byId("rec_id").set("value", td_si.rec_id);
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
	var customerPaymentJson = {items : td_si.payments};
	//_fncConstructCustomerPaymentGrid(customerPaymentJson, 'customerPaymentGrid', 'receipt_instructions_id','');
	if (dj.byId("payment_completed_indicator") && (dj.byId("payment_completed_indicator").get("value") === "N" || dj.byId("payment_completed_indicator").get("value") === "") ) {
		m._fncConstructCustomerPaymentGrid(customerPaymentJson, "customerPaymentGrid", "payment_instructions_id", "", dj.byId("customer_instruction_indicator").value);
		m._fncSetGridSelectedId("customerPaymentGrid", dj.byId("customer_instruction_indicator").value);
	}
	
	
	// second table
	var bankPaymentJson = {items : td_si.receipts};
	//_fncConstructBankPaymentGrid(bankPaymentJson, 'bankPaymentGrid', 'payment_instructions_id','');
	
	//_fncChangeDisabledAdditionalDetailsFiels('additional_details', true);
	
	if (dijit.byId("receipt_completed_indicator") && ( dj.byId("receipt_completed_indicator").get("value") === "N" || dj.byId("receipt_completed_indicator").get("value") === "" ) ){
		d.style("bank_instruction_field",{"display":"block"});
		d.style("free_format_field",{"display":"none"});
		m._fncConstructBankPaymentGrid(bankPaymentJson, "bankPaymentGrid", "receipt_instructions_id");	
		m._fncSetGridSelectedId("bankPaymentGrid", dj.byId("bank_instruction_indicator").value);
		// in each case, we disabled additional fields
		m._fncChangeDisabledAdditionalDetailsFiels("additional_details", true);
		//show Instructions if stored already.
		m._fncDisplayStoredBankInstruction(null);
	}

	// apply validation rules for free format instructions 
	if (dj.byId("instructions_type_2") && dj.byId("instructions_type_2").checked)
	{
		m.changeRequiredFieldsOnPaymentTypeChange();
		misys.removeAdditionalFieldsForCD();
	}
	if (dj.byId("instructions_type_1") && dj.byId("instructions_type_1").checked)
	{
		m._fncChangePaymentTypeRequired("bank_instruction_field", "free_format_field", "");
	}		
		
	if (subTnxTypeCode=='25'){
		bankPaymentJson = {items : td_si.near_receipts};
		d.style('near_bank_instruction_field',{'display':'block'});
		d.style('near_free_format_field',{'display':'none'});
		d.byId('near_payment_type').set('required', false);
		m._fncConstructBankPaymentGrid(bankPaymentJson, 'near_bankPaymentGrid', 'near_payment_instructions_id','near');
		m._fncChangeDisabledAdditionalDetailsFiels('near_additional_details', true);
	}
	
	var prefix,bicCode,bankInp;
	
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
},
/** 
 * 
 */
beforeSubmitValidations : function() {
	//With one leg submit no test.
	var customerPaymentGridIsValid;
	var bankPaymentGridIsValid;
	var near_customerPaymentGridIsValid;
	var near_bankPaymentGridIsValid;
	var far_customerPaymentGridIsValid;
	var far_bankPaymentGridIsValid;
	var error_message = "";
	
	if(dj.byId('customerPaymentGrid') ){
		customerPaymentGridIsValid= dj.byId('customerPaymentGrid').store._arrayOfAllItems.length == 0 || (dj.byId('customerPaymentGrid').store._arrayOfAllItems.length != 0 && dj.byId('customerPaymentGrid').selection.selectedIndex != -1);
	}
	else{
		customerPaymentGridIsValid = true;
	}
	
	if(dj.byId('bankPaymentGrid')){
		bankPaymentGridIsValid = dj.byId('bankPaymentGrid').store._arrayOfAllItems.length == 0 || (dj.byId('bankPaymentGrid').store._arrayOfAllItems.length != 0 && dj.byId('instructions_type_1').checked && dj.byId('bankPaymentGrid').selection.selectedIndex != -1) || dj.byId('instructions_type_2').checked;
	}
	else{
		bankPaymentGridIsValid = true;
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
	// TODO: show error message on the table
	return customerPaymentGridIsValid && bankPaymentGridIsValid && near_customerPaymentGridIsValid && near_bankPaymentGridIsValid && far_customerPaymentGridIsValid && far_bankPaymentGridIsValid ;
}

	});
})(dojo, dijit, misys);
dojo.require('misys.client.binding.treasury.message_si_td_trtd_client');
