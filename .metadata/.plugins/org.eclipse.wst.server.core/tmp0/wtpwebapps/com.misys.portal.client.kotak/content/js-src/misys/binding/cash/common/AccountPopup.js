dojo.provide("misys.binding.cash.common.AccountPopup");

/*
-----------------------------------------------------------------------------
Scripts for the template account-popup in cash_common.xsl
	
	
	Note: To be used, is required a global variable (accountType+"PopupFirstOpening" : boolean)
		  and a function: fillAccountField(String accountType, json accountSelected)


Copyright (c) 2000-2011 Misys (http://www.misys.com),
All Rights Reserved. 

version:   1.0
author:    Pascal Marzin
date:      17/02/11
-----------------------------------------------------------------------------
*/




(function(/*Dojo*/ d, /*Dijit*/ dj, /*Misys*/ m) {
	
	"use strict"; // ECMA5 Strict Mode

	// Private functions and variables

	function _fncUpdateTable(/*json*/ json, /*String*/ accountType, /*int*/ indexTable){
		var store = new d.data.ItemFileReadStore({data:json});
		var grid = dj.byId(accountType+"_Grid_"+indexTable);
		if (grid){
			if (grid.selection !== null) {
	            grid.selection.clear();
	        }
			grid.setStore(store);
		}
	}

	/*
	 * Build the account grid
	 */
	function _fncCreateAccountTable(/*json*/ json, /*String*/ accountType, /*int*/ indexTable, /*String*/ divId){
		var store = new d.data.ItemFileReadStore({data:json});
		var gridTitle = json.items[0].bank_abbv_name;
		// set the layout structure: TODO: Localize Label
		var accntNumLabel = m.getLocalization("acct_no_header_label");
		var accntDescLabel = m.getLocalization("description_header_label");
		var ccyLabel = m.getLocalization("ccy_header_label");
		var accntTypeLabel = m.getLocalization("account_type_header_label");
	    var layout = [{field: "account_no",		name: accntNumLabel, 	width: "10em", styles: "text-align: center;"},
				      {field: "description",	name: accntDescLabel, 	width: "14em"},
				      {field: "cur_code",		name: ccyLabel, 		width: "4em", styles: "text-align: center;"},
				      {field: "type",			name: accntTypeLabel, 	width: "8em", styles: "text-align: center;"}];

	    // create a new grid:
	    var grid = new dojox.grid.DataGrid({
	        query: {
	            id: "*"
	        },
	        store: store,
	        id: accountType+"_Grid"+"_"+indexTable,
	        structure: layout,
	        height: "350px",
	        autoWidth: true,
	        noDataMessage: "No Accounts Found",
	        onSelected: function(inRowIndex){_fncSelectAccountIndex(inRowIndex, accountType, indexTable);},
	        selectionMode: "single"
	    },
	    document.createElement("div"));
		// append the new grid to the div "gridContainer":
	    d.create("div", { id: accountType+"_Grid_Title"+"_"+indexTable, innerHTML: m.getLocalization("bank_title_label")+gridTitle }, d.byId(divId));
	   	d.byId(divId).appendChild(grid.domNode);
	    // Call startup, in order to render the grid:
	    grid.startup();
	}
	
	/*
	 * Call when an account is choose.
	 */
	function _fncSelectAccountIndex(inRowIndex, accountType, indexTable){
		var accountsSelected = dj.byId(accountType+"_Grid_"+indexTable).selection.getSelected();
		var accountSelected;
        if(accountsSelected.length){
            dojo.forEach(accountsSelected, function(selectedItem){
                if(selectedItem !== null){
                	console.debug("[INFO] selected account: " + selectedItem.account_no);
                	accountSelected = selectedItem;
                }
            });
        } else {
        	accountSelected = dj.byId(accountType+"_Grid_"+indexTable).get("store")._arrayOfAllItems[inRowIndex];
        }
		
		m.fillAccountField(accountType, accountSelected);
		_fncCleanOtherSelectedRow(accountType, indexTable);
		//dojo.query("#"+accountType+"_div > div").forEach(function(elt){dojo.destroy(elt)});
		//dojo.byId(+accountType+"_div").innerHTML = "";
		dj.byId(accountType).hide();
	}
	
	/* 
	 * If multiple table, when we select one row, 
	 * we unselect previous row selectd on other table
	 */
	function _fncCleanOtherSelectedRow(accountType, indexTable){
		var nbTable = d.query("#"+accountType+"_div > div").length;
		if (nbTable === 1){
			return;
		}else {
			for (i=0; i<nbTable; i++){
				if(indexTable !== i){
					dj.byId(accountType+"_Grid_"+i).selection.selectedIndex = -1;
					d.query("#"+accountType+"_Grid_"+i+" .dojoxGridContent div.dojoxGridRowSelected").forEach(function(element)
							{
								d.removeClass(element, "dojoxGridRowSelected");
								d.removeClass(element, "dojoxGridRowOdd");
							});
				}
			}	
		}
	}


	function _fncSearchAccountAjaxCall(/*String*/ user_action, /*String*/ accountType, /*String*/ matchingCur, /*String*/ update)
	{
		console.debug("[INFO] Begin Ajax call");
		
		if (dj.byId("entity"))
		{
			m.xhrPost(
					{
						url: m.getServletURL("/screen/AjaxScreen/action/ListOfAccountsAction"),
						handleAs: "json",
						load: _fncCreateAccountPopup,
						accountType: accountType,
						update: update,
						content: {
							COMPANYID: dj.byId("company_id").get("value"),
							ENTITY: dj.byId("entity").get("value"),
							ACCOUNTSEARCHACTION: user_action,
							MATCHINGCURR: matchingCur
						},
						customError: function(response, args){
							m[accountType+"PopupFirstOpening"] = "true";
//							dijit.byId("loadingDialog").hide();
//							console.error("[TDAjaxCall] error retrieving quote");
//							_fncManageErrors();
							console.debug("[INFO] Error on Account Search.");
						}
					}
			);			
		}
		else
		{
			m.xhrPost(
					{
						url: m.getServletURL("/screen/AjaxScreen/action/ListOfAccountsAction"),
						handleAs: "json",
						load: _fncCreateAccountPopup,
						accountType: accountType,
						update: update,
						content: {
							COMPANYID: dj.byId("company_id").get("value"),
							ACCOUNTSEARCHACTION: user_action,
							MATCHINGCURR: matchingCur
						},
						customError: function(response, args){
							m[accountType+"PopupFirstOpening"] = "true";
//							dijit.byId("loadingDialog").hide();
//							console.error("[TDAjaxCall] error retrieving quote");
//							_fncManageErrors();
							console.debug("[INFO] Error on Account Search.");
						}
					}
			);
		}

	}

	/* 
	 * Create grids for the account popup and show it.
	 * Call by the ajax call.
	 */
	function _fncCreateAccountPopup(/*JSON*/ response, /*Obj*/ ioArgs){
		var length = 0,
		    divId = "",
		    height = 400,
		    accountType = ioArgs.args.accountType,
		    update = ioArgs.args.update,
		    jsonObject;
		dj.byId(accountType).show();
		
		//d.style(accountType, "width", "430px");
		for (jsonData in response){ 
			jsonObject = {items : response[length]};
			// specific to sweep module --> update grid with new values if it"s not the first opening
			if (update === "UPDATE" && (accountType === "fundingAccount" || accountType === "receivingAccount" || accountType === "orderingAccount" || accountType === "beneficiaryAccount")){
				_fncUpdateTable(jsonObject, accountType, length);
			}
			else {
				divId = accountType+"_div_"+length;
				d.create("div", {id: divId}, accountType+"_div");
				//dojo.byId(accountType+"_div").appendChild("<div id=\""+divId+"\"><div>");
				_fncCreateAccountTable(jsonObject, accountType, length, divId);
			}
			height = height + 115;
			length++; 
		}
		d.style(accountType, "height", height+"px");
		//dijit.byId(accountType).show();
	}
	
	
	/************ Public  Function *************************/
	
	d.mixin(m, {

		/*
		 * Show the account popup.
		 * @accountType: is the type of account which we lookink for (ordering / beneficiary).
		 * 				 It is used to know the id of the popup. @see cash_common.xsl -> template account-popup
		 */
		openAccountPopup : function(/*String*/ accountType, /*String*/ action, /*String*/ matchingCur)
		{
			firstOpening = m[accountType+"PopupFirstOpening"];
			if (firstOpening === "true"){
				_fncSearchAccountAjaxCall(action, accountType, matchingCur);
			}
			// specific to sweep module --> do ajax call every time
			else if (accountType === "fundingAccount" || accountType === "receivingAccount" || accountType === "orderingAccount" || accountType === "beneficiaryAccount"){
				_fncSearchAccountAjaxCall(action, accountType, matchingCur, "UPDATE");
			}
			else {
				dj.byId(accountType).show();
			}
			m[accountType+"PopupFirstOpening"] = "false";
		},

		/*
		 * Function to fill fields after selected an account.
		 * This function has to be override.
		 */

		fillAccountField : function(accountType, accountSelected){
			console.info("[INFO] You have to implement the function fillAccountField()");
		},
		
		filteringAccount : function(/*String*/ searchFieldId){
			var accountType = searchFieldId.split("_")[0];
			var sAccountNo = accountType+"_number_acct_search";
			var sDescrpition = accountType+"_desc_acct_search";
			var sCurCode = accountType+"_ccy_acct_search";
			var sType = accountType+"_type_acct_search";
			
			// for all table (we don"t know exactly how much)
			var nbTable = dojo.query("#"+accountType+"_div > div").length; // counting nb table
			for (i=0; i<nbTable; i++){
				m.grid.filter(dijit.byId(accountType+"_Grid_"+i), 
					["account_no", "description", "cur_code", "type"], 
					[sAccountNo, sDescrpition, sCurCode, sType]);
			}
		}
	});

})(dojo, dijit, misys);





