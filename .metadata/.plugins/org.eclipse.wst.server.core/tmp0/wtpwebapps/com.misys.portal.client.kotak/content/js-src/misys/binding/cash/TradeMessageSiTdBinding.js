dojo.provide("misys.binding.cash.TradeMessageSiTdBinding");
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
dojo.require("misys.binding.cash.request.StandingInstructionAction");

fncDoBinding = function()
{
	//  summary:
	//            Binds validations and events to fields in the form.              
	//   tags:
	//            public


	misys.connect('instructions_type_1', 'onClick', function(){_fncSwitchBankPaymentInstructionsFields('bank_instruction_field', 'free_format_field', 'instructions_type_2');});
	misys.connect('instructions_type_2', 'onClick', function(){_fncSwitchBankPaymentInstructionsFields('free_format_field', 'bank_instruction_field', 'instructions_type_1');});
	misys.connect('payment_type', 'onChange', function(){_fncChangeRequiredFieldsOnPaymentTypeChange('');});
	misys.connect('beneficiary_account', 'onChange', function(){_fncChangeRequiredFieldsOnChange('beneficiary_account', '');});
	misys.connect('beneficiary_address', 'onChange', function(){_fncChangeRequiredFieldsOnChange('beneficiary_address', '');});
	misys.connect('intermediary_bank', 'onChange', function(){_fncChangeRequiredFieldsOnChange('intermediary_bank', '');});
	var subTnxTypeCode = dijit.byId('sub_tnx_type_code').get('value');
	if (subTnxTypeCode=='25'){
		misys.connect('near_instructions_type_1', 'onClick', function(){_fncSwitchBankPaymentInstructionsFields('near_bank_instruction_field', 'free_format_field', 'near_instructions_type_2','near');});
		misys.connect('near_instructions_type_2', 'onClick', function(){_fncSwitchBankPaymentInstructionsFields('near_free_format_field', 'bank_instruction_field', 'near_instructions_type_1','near');});
		misys.connect('near_payment_type', 'onChange', function(){_fncChangeRequiredFieldsOnPaymentTypeChange('near');});
		misys.connect('near_beneficiary_account', 'onChange', function(){_fncChangeRequiredFieldsOnChange('near_beneficiary_account', 'near');});
		misys.connect('near_beneficiary_address', 'onChange', function(){_fncChangeRequiredFieldsOnChange('near_beneficiary_address', 'near');});
		misys.connect('near_intermediary_bank', 'onChange', function(){_fncChangeRequiredFieldsOnChange('near_intermediary_bank', 'near');});
	}
};

fncDoFormOnLoadEvents = function()
{
	//  summary:
	//          Events to perform on page load.
	//  tags:
	//         public

	var td_si = misys._config.td_si;
	
	//rec_id
	dijit.byId('rec_id').set('value', td_si.rec_id);
	
	var subTnxTypeCode = dijit.byId('sub_tnx_type_code').get('value');
	// display / hide fields
	dojo.style('bank_instruction_field',{'display':'block'});
	dojo.style('free_format_field',{'display':'none'});

	// set required false for select field
	dijit.byId('payment_type').set('required', false);
	
	// first table - retrieve the json object of instruction payment
	var customerPaymentJson = {items : td_si.receipts};
	_fncConstructCustomerPaymentGrid(customerPaymentJson, 'customerPaymentGrid', 'receipt_instructions_id','');
	
	// second table
	var bankPaymentJson = {items : td_si.payments};
	_fncConstructBankPaymentGrid(bankPaymentJson, 'bankPaymentGrid', 'payment_instructions_id','');
	
	_fncChangeDisabledAdditionalDetailsFiels('additional_details', true);
		
	if (subTnxTypeCode=='25'){
		bankPaymentJson = {items : td_si.near_receipts};
		dojo.style('near_bank_instruction_field',{'display':'block'});
		dojo.style('near_free_format_field',{'display':'none'});
		dijit.byId('near_payment_type').set('required', false);
		_fncConstructBankPaymentGrid(bankPaymentJson, 'near_bankPaymentGrid', 'near_payment_instructions_id','near');
		_fncChangeDisabledAdditionalDetailsFiels('near_additional_details', true);
	}
	else if(subTnxTypeCode=='24'){
		customerPaymentJson = {items : td_si.near_payments};
		_fncConstructCustomerPaymentGrid(customerPaymentJson, 'near_customerPaymentGrid', 'near_receipt_instructions_id','near');
	}
};


/** 
 * Action linked to the selection of an index in a table.
 * Complete hidden field with the selected index. 
 */
_fncSelectIndex = function(/*String*/ idRowSelected, /*String*/ idTable, /*String*/idHiddenField)
{
	var selectedIndex = dijit.byId(idTable).selection.selectedIndex;
	var idData = dijit.byId(idTable).get('store')._arrayOfAllItems[selectedIndex].id;
	dijit.byId(idHiddenField).set('value', idData);
};

/** 
 * 
 */
fncDoPreSubmitValidations = function()
{
	var customerPaymentGridIsValid = dijit.byId('customerPaymentGrid').store._arrayOfAllItems.length == 0 || (dijit.byId('customerPaymentGrid').store._arrayOfAllItems.length != 0 && dijit.byId('customerPaymentGrid').selection.selectedIndex != -1);
	var bankPaymentGridIsValid = dijit.byId('bankPaymentGrid').store._arrayOfAllItems.length == 0 || (dijit.byId('bankPaymentGrid').store._arrayOfAllItems.length != 0 && dijit.byId('instructions_type_1').checked && dijit.byId('bankPaymentGrid').selection.selectedIndex != -1);
	var near_customerPaymentGridIsValid;
	var near_bankPaymentGridIsValid;
	
	var subTnxTypeCode = dijit.byId('sub_tnx_type_code').get('value');
	if (subTnxTypeCode=='24'){
		near_customerPaymentGridIsValid = dijit.byId('near_customerPaymentGrid').store._arrayOfAllItems.length == 0 || (dijit.byId('customerPaymentGrid').store._arrayOfAllItems.length != 0 && dijit.byId('customerPaymentGrid').selection.selectedIndex != -1);
		near_bankPaymentGridIsValid = true;
	}
	else if (subTnxTypeCode=='25'){
		near_bankPaymentGridIsValid= dijit.byId('near_bankPaymentGrid').store._arrayOfAllItems.length == 0 || (dijit.byId('bankPaymentGrid').store._arrayOfAllItems.length != 0 && dijit.byId('instructions_type_1').checked && dijit.byId('bankPaymentGrid').selection.selectedIndex != -1);
		near_customerPaymentGridIsValid = true;
	}
	else{
		near_customerPaymentGridIsValid = true; 
		near_bankPaymentGridIsValid = true;
	}
	
	// TODO: show error message on the table
	return customerPaymentGridIsValid && bankPaymentGridIsValid && near_customerPaymentGridIsValid && near_bankPaymentGridIsValid;
};
//Including the client specific implementation
       dojo.require('misys.client.binding.cash.TradeMessageSiTdBinding_client');