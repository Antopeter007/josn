dojo.provide("misys.binding.cash.request.StandingInstructionAction");
/*
 -----------------------------------------------------------------------------
 Scripts for

  StandingInstruction Common


 Copyright (c) 2000-2010 Misys (http://www.misys.com),
 All Rights Reserved. 

 version:   1.0
 author:	Pillon Gauthier
 date:      12/20/10
 -----------------------------------------------------------------------------
 */


/** 
 * Clear fields :
 * _ action '1': clear customer payment instructions table
 * _ action '2': clear Bank Payment Instructions - Bank Instructions
 * _ action '3': clear Bank Payment Instructions - free format instructions
 * _ action '4': clear near customer payment instructions table
 * _ action '5': clear near Bank Payment Instructions - Bank Instructions
 * _ action '6': clear near Bank Payment Instructions - free format instructions
 **/
fncPerformClear = function(/*String*/ prefix, /*int*/action, /*boolean*/notRemoveRequired)
{
	if (prefix!=null && prefix !=''){
		prefix=prefix+'_';
	}else
	{
		prefix="";
	}
	
	var fieldToClear;
	if (action == 1)
	{
		_fncClearTable(prefix+'customerPaymentGrid');
		dijit.byId(prefix+'receipt_instructions_id').set('value', '');
	}
	else if (action == 2)
	{
		_fncClearTable(prefix+'bankPaymentGrid');
		dijit.byId(prefix+'payment_instructions_id').set('value', '');
		fieldToClear = dojo.query('#'+prefix+'bank_instruction_field .dijitInputContainer input');
		_fncChangeDisabledAdditionalDetailsFiels(prefix+'additional_details', true);
	}
	else if (action == 3)
	{
		if(!notRemoveRequired){_fncRemoveRequiredOnFields(prefix+'free_format_field');}
		fieldToClear = dojo.query('#'+prefix+'free_format_field .dijitInputContainer input');
	}

	dojo.forEach(fieldToClear, function(field){
		
		// do not clear default value of Payment CCY/ Payment Amount /Payment Type
		if (!(field.id.match("payment_cur")!=null ||field.id.match("payment_amt")!=null ||field.id.match("payment_type")!=null)){
			field.value = '';	
		}
		
	});
	
};
/** 
 * Clear table (input & radio button).
 */
_fncClearTable = function(/*String*/idTable)
{	
	// clear table
	dojo.query("#"+idTable+" .dojoxGridRowSelector").forEach(
		    function(tag){
		    	dojo.removeClass(tag, 'dijitRadioChecked');
		    });
	dojo.query("#"+idTable+" .dojoxGridRowSelected").forEach(
		    function(tag){
		    	dojo.removeClass(tag, 'dojoxGridRowSelected');
		    	//dijit.byId(tag.id).set('required', false);
		    });
	dijit.byId(idTable).selection.selectedIndex = -1 ;
};

/** 
 * Action linked to the selection of instruction type.
 * Switch displayed fields.
 */
_fncSwitchBankPaymentInstructionsFields = function(/*String*/ fieldToShow, /*String*/ fieldToHide, /*String*/ idRadioButton, /*String */ prefix)
{
	var prefix_name=prefix;
	if (prefix_name!=null && prefix_name !=''){
		prefix_name=prefix_name+'_';
	}else
	{
		prefix_name="";
	}
	
	
	//in case where the fieldToShow is already displayed 
	if (dojo.style(prefix_name+fieldToShow,'display') == 'block' && dojo.style(prefix_name+fieldToHide,'display') == 'none'){
		return;
	}
	// open a modal dialog
	misys.dialog.show('CONFIRMATION',
			misys.getLocalization('clearMessage'),'',
			// in case of ok
			function(){
				misys.animate("fadeOut", dojo.byId(prefix_name+fieldToHide));
				// clear fields
				if (prefix==null){prefix="";}
				var action = 0;
				if(fieldToHide == 'bank_instruction_field'){action = 2;}
				else if(fieldToHide == 'free_format_field'){action = 3;}
				fncPerformClear(prefix,action, false);
				// switch shown fields
				misys.animate("fadeIn", dojo.byId(prefix_name+fieldToShow));
				// changed required fields
				_fncChangePaymentTypeRequired(fieldToShow, fieldToHide,prefix);
			},
			function(){
				// Has to be a global event; otherwise it gets removed too early to fire
				misys.connect(dijit.byId('cancelButton'), 'onClick', function(){
					dijit.byId(idRadioButton).set('checked', true);
				});
			}
	);
};

_fncChangePaymentTypeRequired = function(/*String*/ fieldToShow, /*String*/ fieldToHide,/*String*/prefix)
{
	if (prefix!=null && prefix !=''){
		prefix=prefix+'_';
	}else
	{
		prefix="";
	}
	
	if('free_format_field' == fieldToShow)
	{
		misys.toggleRequired(prefix+'payment_type',true);
		//dijit.byId('payment_type').set('required', true);
	}
	if('bank_instruction_field' == fieldToShow)
	{
		misys.toggleRequired(prefix+'payment_type',false);
		//dijit.byId('payment_type').set('required', false);
	}
};
/** 
 * Function changing required fields according selected payment-type.
 */

_fncChangeRequiredFieldsOnPaymentTypeChange = function(/*String*/ prefix)
{
	if (prefix!=null && prefix !=''){
		prefix=prefix+'_';
	}else
	{
		prefix="";
	}
	var noRequiredFields;
	var requiredFields;
	var valueSelected = dijit.byId(prefix+'payment_type').get('displayedValue');
	if('Wire' == valueSelected)
	{
		noRequiredFields = [prefix+'beneficiary_address', prefix+'beneficiary_city', prefix+'beneficiary_country']; 
		requiredFields = [prefix+'beneficiary_name',prefix+'beneficiary_bank', prefix+'beneficiary_bank_city', prefix+'beneficiary_bank_country'];
		// in case where other fields are required according to paymentType value and to an other value
		if(dijit.byId(prefix+'beneficiary_account').get('value') != '')
		{
			requiredFields.push(prefix+'beneficiary_address', prefix+'beneficiary_city', prefix+'beneficiary_country');
		}
		if(dijit.byId(prefix+'beneficiary_address').get('value') != '')
		{
			requiredFields.push(prefix+'beneficiary_account');
		}
		if(dijit.byId(prefix+'intermediary_bank').get('value') != '')
		{
			requiredFields.push(prefix+'intermediary_bank_city', prefix+'intermediary_bank_country');
		}
	}
	else if('Draft' == valueSelected)
	{
		noRequiredFields = [prefix+'beneficiary_bank', prefix+'beneficiary_bank_city', prefix+'beneficiary_bank_country'];
		requiredFields = [prefix+'beneficiary_name', prefix+'beneficiary_address', prefix+'beneficiary_city', prefix+'beneficiary_country'];
		// in case where other fields are required according to paymentType value
		if(dijit.byId(prefix+'intermediary_bank').get('value') != '')
		{
			requiredFields.push(prefix+'intermediary_bank_city', prefix+'intermediary_bank_country');
		}
	}
	else
	{
		noRequiredFields = [prefix+'beneficiary_name',prefix+'beneficiary_bank', prefix+'beneficiary_bank_city', prefix+'beneficiary_bank_country',
				prefix+'beneficiary_address', prefix+'beneficiary_city', prefix+'beneficiary_country'];
	}
	
	/*
	dojo.forEach(noRequiredFields, function(field){dijit.byId(field).set('required', false);});
	dojo.forEach(requiredFields, function(field){dijit.byId(field).set('required', true);});
	*/
	dojo.forEach(noRequiredFields, function(field){misys.toggleRequired(field,false);});
	dojo.forEach(requiredFields, function(field){misys.toggleRequired(field,true);});
	
};
/** 
 * 
 */
_fncRemoveRequiredOnFields = function(/*String*/tableDivId){
	dojo.query("#"+tableDivId+" input[aria-required=true]").forEach(function(field){dijit.byId(dijit.byId(field).id).set('required', false);});
};
/** 
 * Function changing required fields according non-empty field.
 */
_fncChangeRequiredFieldsOnChange = function(/*String*/provadingField, /*String*/ prefix){
	var provadingFieldValue = dijit.byId(provadingField).get('value');
	var paymentTypeValue = dijit.byId(prefix+'payment_type').get('displayedValue');
	var fields;
	var required;
	
	if(prefix+'beneficiary_account' == provadingField)
	{
		fields = [prefix+'beneficiary_address', prefix+'beneficiary_city', prefix+'beneficiary_country'];
		if(provadingFieldValue == '')
		{
			required = false;
		}
		else if(paymentTypeValue == 'Wire')
		{
			required = true;
		}
	}
	
	else if(prefix+'beneficiary_address' == provadingField)
	{
		fields = [prefix+'beneficiary_account'];
		if(provadingFieldValue == '')
		{
			required = false;
		}
		else if(paymentTypeValue == 'Wire')
		{
			required = true;
		}
	}
	
	else if(prefix+'intermediary_bank' == provadingField)
	{
		fields = [prefix+'intermediary_bank_city', prefix+'intermediary_bank_country'];
		if(provadingFieldValue == '')
		{
			required = false;
		}
		else
		{
			required = true;
		}
	}
	
	dojo.forEach(fields, function(field){dijit.byId(field).set('required', required);});
};

_fncChangeDisabledAdditionalDetailsFiels = function(/*String*/ additionalDetailLineId, /*boolean*/ disabled){
	dijit.byId(additionalDetailLineId+'_line_1_input').set('disabled', disabled);
	dijit.byId(additionalDetailLineId+'_line_2_input').set('disabled', disabled);
	dijit.byId(additionalDetailLineId+'_line_3_input').set('disabled', disabled);
	dijit.byId(additionalDetailLineId+'_line_4_input').set('disabled', disabled);
};


_fncConstructCustomerPaymentGrid = function(/*JSON*/ json, /*String*/ idTab, /*String*/IdHiddenField,/*String*/prefix)
{
	if (prefix!=null && prefix!=''){
		prefix=prefix+'_';
	}
	else 
	{
		prefix="";
	}
	var store = new dojo.data.ItemFileReadStore({data:json});
	// set the layout structure:				
	var layout = [{field: 'currency',name: 'Currency',width: '50px'},
	              {field: 'account',name: 'Account',width: '100px', center: 'true'},
	              {field: 'instruction_indicator',name: 'Instruction Indicator',width: 'auto'}];
	// create a new grid:
	var grid = new dojox.grid.EnhancedGrid({
		query: {
			id: '*'
		},
		store: store,
		id: idTab,
		structure: layout,
		height: '100px',
		noDataMessage: 'No Instructions Found',
		onSelected: function(inRowIndex){_fncSelectIndex(inRowIndex, idTab, IdHiddenField);},
		plugins: {
			indirectSelection:{
				name: "Select",
				width: "50px",
				styles: "text-align: center;"
			}
		},
		selectionMode: "single"
	},
	document.createElement('div'));
	// append the new grid to the div "gridContainer":
	dojo.byId(prefix+"customerPayment").appendChild(grid.domNode);

	// Call startup, in order to render the grid:
	grid.startup();
};

_fncConstructBankPaymentGrid = function(/*JSON*/ json, /*String*/ idTab, /*String*/IdHiddenField,/*String*/prefix)
{
	if (prefix!=null && prefix!=''){
		prefix=prefix+'_';
	}
	else 
	{
		prefix="";
	}
	var store = new dojo.data.ItemFileReadStore({data:json});
	// set the layout structure:				
	var layout = [{field: 'currency',name: 'Currency',width: '50px'},
	              {field: 'account',name: 'Account',width: '100px'},
	              {field: 'instruction_indicator',name: 'Instruction Indicator', 'text-align': 'center', width: '175px'},
	              {field: 'beneficiary_institution',name: 'Beneficiary Institution',width: '175px'},
	              {field: 'beneficiary_account',name: 'Beneficiary Account',width: '175px'},
	              {field: 'institution_account',name: 'Account with Institution',width: '175px'	}];
	// create a new grid:
	var grid = new dojox.grid.EnhancedGrid({
		query: {
			id: '*'
		},
		store: store,
		id: idTab,
		structure: layout,
		height: '100px',
		noDataMessage: 'No Instructions Found',
		onSelected: function(inRowIndex){_fncSelectIndex(inRowIndex, idTab, IdHiddenField);},
		plugins: {
			indirectSelection:{
				name: "Select",
				width: "50px",
				styles: "text-align: center;"
			}
		},
		selectionMode: "single"
	},
	document.createElement('div'));
	// append the new grid to the div "gridContainer":

	dojo.byId(prefix+"bankPayment").appendChild(grid.domNode);


	// Call startup, in order to render the grid:
	grid.startup();
};