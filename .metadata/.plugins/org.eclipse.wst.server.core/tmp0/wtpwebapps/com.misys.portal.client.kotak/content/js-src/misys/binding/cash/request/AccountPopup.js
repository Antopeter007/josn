dojo.provide('misys.binding.cash.request.AccountPopup');

/*
-----------------------------------------------------------------------------
Scripts for the template account-popup in cash_common.xsl
	
	
	Note: To be used, is required a global variable (accountType+'PopupFirstOpening' : boolean)
		  and a function: fillAccountField(String accountType, json accountSelected)


Copyright (c) 2000-2011 Misys (http://www.misys.com),
All Rights Reserved. 

version:   1.0
author:    Pascal Marzin
date:      17/02/11
-----------------------------------------------------------------------------
*/

/*
 * Show the account popup.
 * @accountType: is the type of account which we lookink for (ordering / beneficiary).
 * 				 It is used to know the id of the popup. @see cash_common.xsl -> template account-popup
 */
fncOpenAccountPopup = function(/*String*/ accountType, /*String*/ action, /*String*/ matchingCur){
	firstOpening = fncGetGlobalVariable(accountType+'PopupFirstOpening');
	if (firstOpening == 'true'){
		_fncSearchAccountAjaxCall(action, accountType, matchingCur);
	}
	// specific to sweep module --> do ajax call every time
	else if (accountType === 'fundingAccount' || accountType === 'receivingAccount'){
		_fncSearchAccountAjaxCall(action, accountType, matchingCur, 'UPDATE');
	}
	else {
		dijit.byId(accountType).show();
	}
	fncSetGlobalVariable(accountType+'PopupFirstOpening', 'false');
};

/* 
 * Create grids for the account popup and show it.
 * Call by the ajax call.
 */
fncCreateAccountPopup = function(/*JSON*/ response, /*Obj*/ ioArgs){
	var length = 0,
	    divId = '',
	    height = 100,
	    accountType = ioArgs.args.accountType,
	    update = ioArgs.args.update,
	    jsonObject;
	dijit.byId(accountType).show();
	
	dojo.style(accountType, 'width', '450px');
	for (jsonData in response){ 
		jsonObject = {items : response[length]};
		// specific to sweep module --> update grid with new values if it's not the first opening
		if (update === 'UPDATE' && (accountType === 'fundingAccount' || accountType === 'receivingAccount')){
			_fncUpdateTable(jsonObject, accountType, length);
		}
		else {
			divId = accountType+'_div_'+length;
			dojo.create("div", {id: divId}, accountType+'_div');
			//dojo.byId(accountType+'_div').appendChild('<div id=\''+divId+'\'><div>');
			_fncCreateAccountTable(jsonObject, accountType, length, divId);
		}
		height = height + 115;
		length++; 
	}
	dojo.style(accountType, 'height', height+'px');
};

_fncUpdateTable = function(/*json*/ json, /*String*/ accountType, /*int*/ indexTable){
	var store = new dojo.data.ItemFileReadStore({data:json});
	var grid = dijit.byId(accountType+'_Grid_'+indexTable);
	if (grid){
		if (grid.selection !== null) {
            grid.selection.clear();
        }
		grid.setStore(store);
	}
};

/*
 * Build the account grid
 */
_fncCreateAccountTable = function(/*json*/ json, /*String*/ accountType, /*int*/ indexTable, /*String*/ divId){
	var store = new dojo.data.ItemFileReadStore({data:json});
	var gridTitle = json.items[0].bank_abbv_name;
	// set the layout structure: TODO: Localize Label
	var accntNumLabel = misys.getLocalization('acct_no_header_label');
	var accntDescLabel = misys.getLocalization('description_header_label');
	
    var layout = [{field: 'account_no',name: accntNumLabel,width: '100px', styles: 'text-align: center;'},
			        {field: 'description',name: accntDescLabel,width: 'auto'}];
	// create a new grid:
    var grid = new dojox.grid.DataGrid({
        query: {
            id: '*'
        },
        store: store,
        id: accountType+'_Grid'+'_'+indexTable,
        structure: layout,
        height: '100px',
        noDataMessage: 'No Accounts Found',
        onSelected: function(inRowIndex){_fncSelectAccountIndex(inRowIndex, accountType, indexTable);},
//        plugins: {
//        	indirectSelection:{
//            	name: "Select",
//                width: "50px",
//            	styles: "text-align: center;"
//        	}
//        },
        selectionMode: "single"
    },
    document.createElement('div'));
	// append the new grid to the div "gridContainer":
    dojo.create("div", { id: accountType+'_Grid_Title'+'_'+indexTable, innerHTML: misys.getLocalization('bank_title_label')+gridTitle }, dojo.byId(divId));
   	dojo.byId(divId).appendChild(grid.domNode);
    // Call startup, in order to render the grid:
    grid.startup();
};
/*
 * Call when an account is choose.
 */
_fncSelectAccountIndex = function(inRowIndex, accountType, indexTable){
	var accountSelected = dijit.byId(accountType+'_Grid_'+indexTable).get('store')._arrayOfAllItems[inRowIndex];
	fillAccountField(accountType, accountSelected);
	_fncCleanOtherSelectedRow(accountType, indexTable);
	//dojo.query('#'+accountType+'_div > div').forEach(function(elt){dojo.destroy(elt)});
	//dojo.byId(+accountType+'_div').innerHTML = '';
	dijit.byId(accountType).hide();
};

/*
 * Function to fill fields after selected an account.
 * This function has to be override.
 */
fillAccountField = function(accountType, accountSelected){
	console.info('[INFO] You have to implements the function fillAccountField()');
};

fncFilteringAccount = function(/*String*/ searchFieldId){
	// retrieve the account type using the searchfield id
	var accountType = searchFieldId.split('_')[0];
	// for all table (we don't know exactly how much)
	var nbTable = dojo.query('#'+accountType+'_div > div').length; // counting nb table
	for (i=0; i<nbTable; i++){
		misys.grid.filter(dijit.byId(accountType+'_Grid_'+i), ['account_no', 'description'], [accountType+'_number_acct_search', accountType+'_desc_acct_search']);
	}
};

/* 
 * If multiple table, when we select one row, 
 * we unselect previous row selectd on other table
 */
_fncCleanOtherSelectedRow = function(accountType, indexTable){
	var nbTable = dojo.query('#'+accountType+'_div > div').length;
	if (nbTable == 1){
		return;
	}else {
		for (i=0; i<nbTable; i++){
			if(indexTable != i){
				dijit.byId(accountType+'_Grid_'+i).selection.selectedIndex = -1;
				dojo.query('#'+accountType+'_Grid_'+i+' .dojoxGridContent div.dojoxGridRowSelected').forEach(function(element)
						{
							dojo.removeClass(element, 'dojoxGridRowSelected');
							dojo.removeClass(element, 'dojoxGridRowOdd');
						});
			}
		}	
	}
};


_fncSearchAccountAjaxCall = function(/*String*/ user_action, /*String*/ accountType, /*String*/ matchingCur, /*String*/ update)
{
	console.debug('[INFO] Begin Ajax call');
	m.xhrPost(
			{
				url: misys.getServletURL("/screen/AjaxScreen/action/ListOfAccountsAction"),
				handleAs : "json",
				load: fncCreateAccountPopup,
				update: update,
				content: {
					COMPANYID: dijit.byId('company_id').get('value'),
					ACCOUNTSEARCHACTION: user_action,
					MATCHINGCURR: matchingCur,
					accountType: accountType
				},
				customError: function(response, args){
					fncSetGlobalVariable(accountType+'PopupFirstOpening', 'true');
					console.debug('[INFO] Error on Account Search.');
				}
			}
	);
};
