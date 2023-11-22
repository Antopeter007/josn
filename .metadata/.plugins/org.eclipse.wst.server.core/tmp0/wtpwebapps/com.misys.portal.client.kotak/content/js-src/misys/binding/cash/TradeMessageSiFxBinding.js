dojo.provide("misys.binding.cash.TradeMessageSiFxBinding");
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
	
	if('SWAP' == dijit.byId('fx_type').get('value')){
		misys.connect('near_instructions_type_1', 'onClick', function(){_fncSwitchBankPaymentInstructionsFields('bank_instruction_field', 'free_format_field', 'near_instructions_type_2','near');});
		misys.connect('near_instructions_type_2', 'onClick', function(){_fncSwitchBankPaymentInstructionsFields('free_format_field', 'bank_instruction_field', 'near_instructions_type_1','near');});
		misys.connect('near_payment_type', 'onChange', function(){_fncChangeRequiredFieldsOnPaymentTypeChange('near');});
		misys.connect('near_beneficiary_account', 'onChange', function(){_fncChangeRequiredFieldsOnChange('near_beneficiary_account', 'near');});
		misys.connect('near_beneficiary_address', 'onChange', function(){_fncChangeRequiredFieldsOnChange('near_beneficiary_address', 'near');});
		misys.connect('near_intermediary_bank', 'onChange', function(){_fncChangeRequiredFieldsOnChange('near_intermediary_bank', 'near');});
	//	misys.connect('near_bankPaymentGrid', 'onSelected', function(){_fncChangeDisabledAdditionalDetailsFiels('near_additional_details', false);});
		
	}
};

fncDoFormOnLoadEvents = function()
{
	//  summary:
    //          Events to perform on page load.
    //  tags:
    //         public
	
	var fx_si = misys._config.fx_si;
	
	//rec_id
	dijit.byId('rec_id').set('value', fx_si.rec_id);
	// display / hide fields
	dojo.style('bank_instruction_field',{'display':'block'});
	dojo.style('free_format_field',{'display':'none'});
	// set required false for select field
	dijit.byId('payment_type').set('required', false);
	// first table - retrieve the json object of instruction payment
	
	// in case of swap
	fx_type = dijit.byId('fx_type').get('value');
	var customerPaymentJson;
	var bankPaymentJson;
	if (fx_type == 'SWAP'){
		// set required false for select field
		dijit.byId('near_payment_type').set('required', false);
		// display / hide fields
		dojo.style('near_bank_instruction_field',{'display':'block'});
		dojo.style('near_free_format_field',{'display':'none'});
		var customerPaymentNearJson = {items : fx_si.near_payments};
		_fncConstructCustomerPaymentGrid(customerPaymentNearJson, 'near_customerPaymentGrid', 'near_receipt_instructions_id','near');
		// second table
		var bankPaymentNearJson = {items : fx_si.near_receipts};
		_fncConstructBankPaymentGrid(bankPaymentNearJson, 'near_bankPaymentGrid', 'near_payment_instructions_id','near');
		// in each case, we disabled additional fields
		_fncChangeDisabledAdditionalDetailsFiels('near_additional_details', true);
		
		customerPaymentJson = {items : fx_si.payments};
		_fncConstructCustomerPaymentGrid(customerPaymentJson, 'customerPaymentGrid', 'receipt_instructions_id');
		// second table
		bankPaymentJson = {items : fx_si.receipts};
		_fncConstructBankPaymentGrid(bankPaymentJson, 'bankPaymentGrid', 'payment_instructions_id');
		// in each case, we disabled additional fields
		_fncChangeDisabledAdditionalDetailsFiels('additional_details', true);
	}
	else
	{
		customerPaymentJson = {items : fx_si.payments};
		_fncConstructCustomerPaymentGrid(customerPaymentJson, 'customerPaymentGrid', 'receipt_instructions_id');
		// second table
		bankPaymentJson = {items : fx_si.receipts};
		_fncConstructBankPaymentGrid(bankPaymentJson, 'bankPaymentGrid', 'payment_instructions_id');
		// in each case, we disabled additional fields
		_fncChangeDisabledAdditionalDetailsFiels('additional_details', true);
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
	if (idTable == 'bankPaymentGrid'){
		_fncChangeDisabledAdditionalDetailsFiels('additional_details', false);
	}else if (idTable == 'near_bankPaymentGrid'){
		_fncChangeDisabledAdditionalDetailsFiels('near_additional_details', false);
	}
};

/** 
 * 
 */
fncDoPreSubmitValidations = function()
{
	var customerPaymentGridIsValid = dijit.byId('customerPaymentGrid').store._arrayOfAllItems.length == 0 || (dijit.byId('customerPaymentGrid').store._arrayOfAllItems.length != 0 && dijit.byId('customerPaymentGrid').selection.selectedIndex != -1);
	var bankPaymentGridIsValid = dijit.byId('bankPaymentGrid').store._arrayOfAllItems.length == 0 || (dijit.byId('bankPaymentGrid').store._arrayOfAllItems.length != 0 && dijit.byId('instructions_type_1').checked && dijit.byId('bankPaymentGrid').selection.selectedIndex != -1) || dijit.byId('instructions_type_2').checked;
	var near_customerPaymentGridIsValid;
	var near_bankPaymentGridIsValid;
	if (dijit.byId('fx_type').get('value') == 'SWAP')
	{
		near_customerPaymentGridIsValid = dijit.byId('near_customerPaymentGrid').store._arrayOfAllItems.length == 0 || (dijit.byId('near_customerPaymentGrid').store._arrayOfAllItems.length != 0 && dijit.byId('near_customerPaymentGrid').selection.selectedIndex != -1);
		near_bankPaymentGridIsValid = dijit.byId('near_bankPaymentGrid').store._arrayOfAllItems.length == 0  || (dijit.byId('near_bankPaymentGrid').store._arrayOfAllItems.length != 0 && dijit.byId('near_instructions_type_1').checked && dijit.byId('near_bankPaymentGrid').selection.selectedIndex != -1) || dijit.byId('near_instructions_type_2').checked;
	}
	else
	{
		near_customerPaymentGridIsValid = true; 
		near_bankPaymentGridIsValid = true;
	}
	// TODO: show error message on the table
	return customerPaymentGridIsValid && bankPaymentGridIsValid && near_customerPaymentGridIsValid && near_bankPaymentGridIsValid;
};


//Including the client specific implementation
       dojo.require('misys.client.binding.cash.TradeMessageSiFxBinding_client');