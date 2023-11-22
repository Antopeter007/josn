dojo.provide("misys.binding.cash.TradeCreateSpBinding");

/*
 -----------------------------------------------------------------------------
 Scripts for
  
  Sweep (SP) Form, Customer Side.
  
 Note: the function fncFormSpecificValidation is required

 Copyright (c) 2000-2010 Misys (http://www.misys.com),
 All Rights Reserved. 

 version:   1.0
 date:      22/09/10
  
 -----------------------------------------------------------------------------
 */

dojo.require("misys.form.common");
dojo.require("misys.validation.common");
dojo.require("misys.form.SimpleTextarea");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.Button");
dojo.require("misys.widget.Dialog");
dojo.require("dijit.ProgressBar");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.CheckBox");
dojo.require("dijit.layout.ContentPane");
dojo.require("dijit.form.DateTextBox");
dojo.require("misys.form.CurrencyTextBox");
dojo.require("dijit.form.NumberTextBox");
dojo.require("dijit.form.FilteringSelect");
dojo.require("dojo.data.ItemFileReadStore");
dojo.require("misys.form.DateTermField");
dojo.require("misys.binding.cash.request.AccountPopup");
dojo.require("dojo.parser");

misys._config = misys._config || {}; 

dojo.mixin(misys._config, {
	fundingAccountAttached : 0,
	receivingAccountAttached : 0,
	editMode : false,
	currentId : ""
});

var fncDoBinding = function(){
	//  summary:
    //            Binds validations and events to fields in the form.              
    //   tags:
    //            public
	
	// for the concentration account popup
	fncSetGlobalVariable('concentrationAccountPopupFirstOpening', 'true');
	if (dijit.byId('concentration_account_no_img')){
		dijit.byId('concentration_account_no_img').set('onClick', 
				function()
				{
					fncOpenAccountPopup('concentrationAccount', 'SWEEPING');
				}
		);
	}
	// for funding account popup
	fncSetGlobalVariable('fundingAccountPopupFirstOpening', 'true');
	if (dijit.byId('funding_acct_no_send_img')){
		dijit.byId('funding_acct_no_send_img').set('onClick', 
				function()
				{
					fncOpenAccountPopup('fundingAccount', 'FUNDING_ACCT_SWEEPING', dijit.byId('concentration_account_cur_code').get('value'));
				}
		);
	}
	// for funding account popup
	fncSetGlobalVariable('receivingAccountPopupFirstOpening', 'true');
	if (dijit.byId('receiving_acct_no_send_img')){
		dijit.byId('receiving_acct_no_send_img').set('onClick', 
				function()
				{
					fncOpenAccountPopup('receivingAccount', 'RECEIVING_ACCT_SWEEPING', dijit.byId('concentration_account_cur_code').get('value'));
				}
		);
	}
	
	misys.connect('sweeping_method_deficit', 'onChange', function(){
		fncToggleMethodField('deficit');
	});
	misys.connect('sweeping_method_surplus', 'onChange', function(){
		fncToggleMethodField('surplus');
	});
	
};

var fncDoFormOnLoadEvents = function(){
	//  summary:
    //          Events to perform on page load.
    //  tags:
    //         public
	
	dijit.byId('max_balance_cur_code').set('disabled', true);
	dijit.byId('min_balance_cur_code').set('disabled', true);
	misys.animate("fadeOut", 'funding-currency-field');
	misys.animate("fadeOut", 'funding-attachments-accounts-field');
	misys.animate("fadeOut", 'receiving-currency-field');
	misys.animate("fadeOut", 'receiving-attachments-accounts-field');
	
	dijit.byId('funding_min_transfer_no_send_cur_code').set('disabled', true);
	dijit.byId('funding_keep_balance_no_send_cur_code').set('disabled', true);
	dijit.byId('receiving_min_transfer_no_send_cur_code').set('disabled', true);
	dijit.byId('receiving_keep_balance_no_send_cur_code').set('disabled', true);
};

var fncDoPreSubmitEvents = function(){
	// check the selection of the sweeping method
	var sp_method = dijit.byId('sweeping_method_deficit').checked || dijit.byId('sweeping_method_surplus').checked;
	if (!sp_method){
		misys.dialog.show('CUSTOM-NO-CANCEL', misys.getLocalization('noSweepingMethodLabel'), misys.getLocalization('noSweepingMethodTitle'));
		return false;
	}
	// check the selection of a frequency
	var sp_freq = dijit.byId('frequency_daily').checked || dijit.byId('frequency_weekly').checked || dijit.byId('frequency_monthly').checked || dijit.byId('frequency_annually').checked;
	if (!sp_freq){
		misys.dialog.show('CUSTOM-NO-CANCEL', misys.getLocalization('noSweepingFrequencyLabel'), misys.getLocalization('noSweepingFrequencyTitle'));
		return false;
	}
	// check if at least one account has been added
	if ((dijit.byId('sweeping_method_deficit').checked && dojo.style(dojo.byId('funding-account-notice'), 'display') === 'block') || (dijit.byId('sweeping_method_surplus').checked && dojo.style(dojo.byId('receiving-account-notice'), 'display') === 'block')){
		misys.dialog.show('CUSTOM-NO-CANCEL', misys.getLocalization('noAccountLabel'), misys.getLocalization('noAccountTitle'));
		return false;
	}
	
};

//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
// Functions to add funding 
// and receiving accounts
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
/**
 * Show / hide fields according the selected method
 */
var fncToggleMethodField = function(method){
	if (method ==='deficit'){
		if (dijit.byId('sweeping_method_deficit').checked){
			misys.animate("fadeIn", 'funding-currency-field');
			misys.animate("fadeIn", 'funding-attachments-accounts-field');
			dijit.byId('min_balance_amt').set('required', true);
		}
		else{
			misys.animate("fadeOut", 'funding-currency-field');
			misys.animate("fadeOut", 'funding-attachments-accounts-field');
			dijit.byId('min_balance_amt').set('required', false);
			_fncCleanAddtionalAccount('funding');
		}
	}
	else if (method ==='surplus'){
		if (dijit.byId('sweeping_method_surplus').checked){
			misys.animate("fadeIn", 'receiving-currency-field');
			misys.animate("fadeIn", 'receiving-attachments-accounts-field');
			dijit.byId('max_balance_amt').set('required', true);
		}
		else{
			misys.animate("fadeOut", 'receiving-currency-field');
			misys.animate("fadeOut", 'receiving-attachments-accounts-field');
			dijit.byId('max_balance_amt').set('required', false);
			_fncCleanAddtionalAccount('receiving');
		}
	}
};
/**
 * Open the dialog to add an account and set the sweeping rules.
 */
var fncOpenAddAccountPopup = function(/*String*/ prefix, /*String*/ paramater){
	// we show it only if an concentration account has been chosen
	if(dijit.byId('concentration_account_cur_code').get('value') === ''){
		misys.dialog.show('CUSTOM-NO-CANCEL', misys.getLocalization('noConcentrationAccountLabel'), misys.getLocalization('noConcentrationAccountTitle'));
	}
	else {
		// fill currencies fields
		dijit.byId(prefix+'_min_transfer_no_send_cur_code').set('value', dijit.byId('concentration_account_cur_code').get('value'));
		dijit.byId(prefix+'_keep_balance_no_send_cur_code').set('value', dijit.byId('concentration_account_cur_code').get('value'));
		// clear other fields
		dijit.byId(prefix+'_acct_no_send').reset();
		dijit.byId(prefix+'_min_transfer_no_send_amt').reset();
		dijit.byId(prefix+'_keep_balance_no_send_amt').reset();
		// show dialog
		dijit.byId(prefix+'accountDialog').show();
	}
};
/**
 * Fill correct fields when an funding / receiving account is selected.
 */
fillAccountField = function(accountType, accountSelected){
	// concentration account has been selected
	if (accountType === 'concentrationAccount'){
		dijit.byId('concentration_account_no').set('value', accountSelected.account_no);
		dijit.byId('applicant_reference').set('value', accountSelected.customer_ref);
		// if an account with a different currency has been selected
		if(dijit.byId('concentration_account_cur_code').get('value') != accountSelected.cur_code){
			_fncCleanAddtionalAccount('funding');
			_fncCleanAddtionalAccount('receiving');
		}
		dijit.byId('concentration_account_cur_code').set('value', accountSelected.cur_code);
		dijit.byId('min_balance_cur_code').set('value', accountSelected.cur_code);
		dijit.byId('max_balance_cur_code').set('value', accountSelected.cur_code);
	}
	// funding account has been selected
	else if (accountType === 'fundingAccount'){
		dijit.byId('funding_acct_no_send').set('value', accountSelected.account_no);
	}
	// receiving account has been selected
	else if (accountType === 'receivingAccount'){
		dijit.byId('receiving_acct_no_send').set('value', accountSelected.account_no);
	}
};
/**
 * Clean funding or receiving account table
 */
_fncCleanAddtionalAccount = function(accountType){
	dojo.query('#'+accountType+'account-master-table tbody tr').forEach(function(elt){
		if(elt.id){
			var id = elt.id.charAt(elt.id.length-1);
			fncDeleteRow(id, accountType);
		}
	});
};
/**
 * Hide the dialog to adding an account.
 */
var fncCancelAddAccount = function(prefix){
	dijit.byId(prefix+'accountDialog').hide();
};
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
// Functions to add funding 
// and receiving accounts
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
/**
 * Add an selected account to the table.
 */
var fncAddAccount = function(prefix){	
	console.debug('[Add Account] Add an '+prefix+' Account.');
	// Retrieve a new ID in non-edit mode
	// If the ID already exists, keep incrementing
	// until we find one. Guards against a clash
	// with an existing attachment
	var id = misys._config[prefix + 'AccountAttached'];
	while(dojo.byId(prefix + 'account_row_' + id)){
		id++;
	}

	// Validate that all mandatory fields have been filled
	if (isNaN(dijit.byId(prefix+'_min_transfer_no_send_amt').get('value'))){
		dijit.byId(prefix+'_min_transfer_no_send_amt').focus();
		return false;
	}
	if (isNaN(dijit.byId(prefix+'_keep_balance_no_send_amt').get('value'))){
		dijit.byId(prefix+'_keep_balance_no_send_amt').focus();
		return false;
	}
	if (dijit.byId(prefix+'_acct_no_send').get('value') == "" ){
		misys.dialog.show('CUSTOM-NO-CANCEL', misys.getLocalization('noAccountLabel'), misys.getLocalization('noAccountTitle'));
		return false;
	}
	// check if the account has been already chosen
	if (_fncIsAccountAlreadyPresent(prefix)){
		misys.dialog.show('CUSTOM-NO-CANCEL', misys.getLocalization('accountAlreadySelectedLabel'), misys.getLocalization('accountAlreadySelectedTitle'));
		return false;
	}
	
	// Close the popup
	var dialog = dijit.byId(prefix+'accountDialog');
	if(dialog){
		dialog.hide();
	}
	
	// Add a row to the table
	_fncAddRow(id, prefix);
	// If we're editing an entry, delete the original row

	if(misys._config.editMode){
		fncDeleteRow(misys._config.currentId, prefix);
	}

	// Set edit mode to false
	misys._config.editMode = false;
	misys._config.currentId = '';
	
	console.debug('[Add Account] Account added successfully');
	return true;
};
/**
 * Check if the accounted selected has already been added.
 */
_fncIsAccountAlreadyPresent = function(/*String*/prefix){
	var accountSelected = dijit.byId(prefix+'_acct_no_send').get('value');
	console.debug('Account Selected ='+accountSelected);
	// compare to the concentration account
	if (dijit.byId('concentration_account_no').get('value') === accountSelected){
		return true;
	}
	var isEquals = false;
	//compare to the other selected account
	dojo.query('#'+prefix+'account-master-table tbody tr td:first-child div').forEach(function(node, index){
		// only if node isn't empty
		console.debug(node.innerHTML+' is equals to '+accountSelected+':');
		if (node.innerHTML != '' && node.innerHTML == accountSelected){
			console.debug(node.innerHTML == accountSelected);
			isEquals = true;
		}
	});
	return isEquals;
};
/**
 * Add a row to the table.
 */ 
_fncAddRow = function(id, prefix){
	// 1. Retrieve the master table
	var table = dojo.byId(prefix+'account-master-table');
	// 2. Set the table to visible, if we have to
	if(table.style.display == 'none'){
		misys.animate("fadeIn", table,  misys._config.showTable);
		dojo.style(table, 'display',  misys._config.showTable);
		dojo.style(dojo.byId(prefix + '-account-notice'), 'display', 'none');
	}
	// 3. Create the row, initially hidden
	var lastRow = table.rows.length;
	var iteration = lastRow;
	var row = table.insertRow(lastRow);
	row.setAttribute('id', prefix + 'account_row_' + id);
	dojo.style(row, "display", "none");
	dojo.style(row, "opacity", 0);
	// 4. Set the row cells for the particular attachment
	var cellValues = fncAccountGetCells(prefix);
	dojo.forEach(cellValues, function(cellValue, index, arr){
		dojo.create("div", {innerHTML: cellValue.value}, row.insertCell(index));
	});
	// 5. Add the standard set of delete/edit buttons, as the last cell in the
	// table.
	_fncAddEditingButtons(row, cellValues.length, id, prefix);
	// 6. Set the hidden fields for the attachment
	var hiddenFields = fncAccountGetHiddenFields(id, prefix);
	dojo.forEach(hiddenFields, function(hiddenFieldDetails){
		var hiddenField = new dijit.form.TextBox( {
			id :hiddenFieldDetails.name,
			name :hiddenFieldDetails.name,
			readOnly :true,
			value :hiddenFieldDetails.value,
			type :'hidden'
		}).placeAt(prefix+ 'account_fields', 'last');
	});
	// 7. Show the row
	misys.animate("fadeIn", row, null, false, {display: misys._config.showTableRow});
	// 8. Hide the notice
	dojo.style(dojo.byId(prefix + '-account-notice'), 'display', 'none');
	// 9. Finally, increment the global counter
	misys._config[prefix + 'AccountAttached']++;
};
/**
 * Retrieve list of a row cells.
 */
var fncAccountGetCells = function(prefix){
	var transfer_data = dijit.byId(prefix+'_min_transfer_no_send_cur_code').get('value')+ ' '+dijit.byId(prefix+'_min_transfer_no_send_amt').get('value');
	var balance_data = dijit.byId(prefix+'_keep_balance_no_send_cur_code').get('value')+ ' '+dijit.byId(prefix+'_keep_balance_no_send_amt').get('value');
	var cells = [
			{
				name :'',
				value :dijit.byId(prefix+'_acct_no_send').get('value')
			},
			{
				name :'',
				value :transfer_data
			},
			{
				name :'',
				value :balance_data
			}
	];
	return cells;
};
/**
 * Retrieve list of hiding fields.
 */
var fncAccountGetHiddenFields = function(id, prefix){
	var hiddenFields = [
		{
			name : prefix+'_account_no_' + id,
			id : prefix+'_acct_no_send',
			value :dijit.byId(prefix+'_acct_no_send').get('value')
		},
		{
			name : prefix+'_min_transfer_cur_code_' + id,
			id : prefix+'_min_transfer_no_send_cur_code',
			value :dijit.byId(prefix+'_min_transfer_no_send_cur_code').get('value')
		},
		{
			name : prefix+'_min_transfer_amt_' + id,
			id : prefix+'_min_transfer_no_send_amt',
			value :dijit.byId(prefix+'_min_transfer_no_send_amt').get('value')
		},
		{
			name : prefix+'_keep_balance_cur_code_' + id,
			id : prefix+'_keep_balance_no_send_cur_code',
			value :dijit.byId(prefix+'_keep_balance_no_send_cur_code').get('value')
		},
		{
			name : prefix+'_keep_balance_amt_' + id,
			id : prefix+'_keep_balance_no_send_amt',
			value :dijit.byId(prefix+'_keep_balance_no_send_amt').get('value')
		},
		{
			name : prefix+'_type_' + id,
			id : prefix+'_type',
			value :prefix
		},
		{
			name : prefix+'_account_id_' + id,
			value :id
		} 
	];
	return hiddenFields;
};
/**
 * Add edit buttons in a row.
 */  
_fncAddEditingButtons = function(row, index, id, prefix){
	var editCell = row.insertCell(index);
	var editButtonDiv = dojo.create('div', null, editCell);
	var deleteDropDown = dojo.create('div', null, editCell);
    var deleteTooltip = dojo.create('div', null, deleteDropDown);
    var deleteButtonDiv = dojo.create('div', null, deleteTooltip, "last");
    
	var editButton = new dijit.form.Button( {
		label :"<img src='" + misys.getContextualURL(m._config.imagesSrc +
				m._config.imageStore.editIcon) + "' alt='Edit'>",
		onClick : function(){
			fncEditRow(id, prefix);
		}
	}, editButtonDiv);
	dojo.addClass(editButton.domNode, 'noborder');
	
	dojo.create('p', {innerHTML:misys.getLocalization('deleteAccountConfirmation')}, deleteTooltip, "first");

	var deleteButton = new dijit.form.Button( {
		label :misys.getLocalization('deleteMessage'),
		type :"submit"
	}, deleteButtonDiv);

	var deleteTooltipD = new dijit.TooltipDialog( {
		title :misys.getLocalization('deleteMessage'),
		execute : function(){
			fncDeleteRow(id, prefix);
		}
	}, deleteTooltip);
	deleteTooltipD.startup();

	var deleteDropDownB = new dijit.form.DropDownButton( {
		label :"<img src='" + misys.getContextualURL(m._config.imagesSrc +
				m._config.imageStore.deleteIcon) + "' alt='delete icon' title='" +
		 misys.getLocalization('deleteAttachedAccountConfirmation') + "'/>"
	}, deleteDropDown);
	dojo.addClass(deleteDropDownB.domNode, 'noborder');
	deleteDropDownB.startup();
};
/**
 * Action to remove an account from the table.
 */
var fncDeleteRow = function(id, prefix){
	console.debug('[Attachments] Deleting an Account, id = ' + id);
	var table = dojo.byId(prefix+ 'account-master-table');
	
	// 1. Fade out and remove row
	var header = dojo.byId(prefix + "account_row_" + id);
	dojo.fadeOut( {
		'node' :header,
		'duration' :500
	}).play();
	var deleteRow = function(){
		table.deleteRow(header.rowIndex);
	};
	setTimeout(deleteRow, 500);
	// 2. Check if have to hide the table and
	// display the notice
	if(misys._config[prefix + 'AccountAttached'] <= 1){
		dojo.fadeOut( {
			'node' :table,
			'duration' :500
		}).play();
		var hideTable = function(){
			dojo.style(table, 'display', 'none');
		};
		setTimeout(hideTable, 501);
		dojo.style(dojo.byId(prefix + '-account-notice'), 'display', 'block');
	}
	// 3. Perform pre delete cleanup for the specific product
	//dojo.eval('fnc' + _fncToProperCase(type) + 'DeleteRow('+id+')');
	
	// 4. Delete all the hidden fields
	var hiddenFields = fncAccountGetHiddenFields(id, prefix);
	dojo.forEach(hiddenFields, function(hiddenFieldDetails, index, arr){
		if(dijit.byId(hiddenFieldDetails.name)){
			dijit.byId(hiddenFieldDetails.name).destroy();
		}
	});
	// 5. Finally, increment the global counter
	misys._config[prefix + 'AccountAttached']--;
	console.debug('[Attachments] Acccount deleted successfully. ' + dojo.eval('misys.'+ prefix + 'AccountAttached') + ' '+ prefix+' account(s) remain');
};
/**
 * Action to edit an account in the table.
 */
var fncEditRow = function(id, prefix){
	// Set edit mode to true
	misys._config.editMode = true;
	misys._config.currentId = id;

	// Populate 2 the static fields with the values of the hidden fields for this entry
	if(dijit.byId(prefix+'_acct_no_send'))
	{
		dijit.byId(prefix+'_acct_no_send').set('value', dijit.byId(prefix+'_account_no_'+id).value);
	}
	if(dijit.byId(prefix+'_min_transfer_no_send_cur_code'))
	{
		dijit.byId(prefix+'_min_transfer_no_send_cur_code').set('value', dijit.byId(prefix+'_min_transfer_cur_code_'+id).value);
	}
	if(dijit.byId(prefix+'_min_transfer_no_send_amt'))
	{
		dijit.byId(prefix+'_min_transfer_no_send_amt').set('value', dijit.byId(prefix+'_min_transfer_amt_'+id).value);
	}
	if(dijit.byId(prefix+'_keep_balance_no_send_cur_code'))
	{
		dijit.byId(prefix+'_keep_balance_no_send_cur_code').set('value', dijit.byId(prefix+'_keep_balance_cur_code_'+id).value);
	}
	if(dijit.byId(prefix+'_keep_balance_no_send_amt'))
	{
		dijit.byId(prefix+'_keep_balance_no_send_amt').set('value', dijit.byId(prefix+'_keep_balance_amt_'+id).value);
	}
	
	// Show the dialog
	dijit.byId(prefix+'accountDialog').show();
};//Including the client specific implementation
       dojo.require('misys.client.binding.cash.TradeCreateSpBinding_client');