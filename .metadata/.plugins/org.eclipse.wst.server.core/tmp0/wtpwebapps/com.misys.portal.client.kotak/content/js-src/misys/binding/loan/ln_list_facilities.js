dojo.provide("misys.binding.loan.ln_list_facilities");

dojo.require("dojo.data.ItemFileReadStore");
dojo.require('dojo.data.ItemFileWriteStore');
dojo.require("dijit.form.FilteringSelect");
dojo.require("misys.form.MultiSelect");
dojo.require("dijit.layout.TabContainer");
dojo.require("misys.form.common");
dojo.require("misys.validation.common");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.CheckBox");
dojo.require("dijit.layout.ContentPane");
dojo.require("misys.form.CurrencyTextBox");
dojo.require("dijit.form.RadioButton");
dojo.require("misys.grid._base");


(function(/*Dojo*/d, /*dj*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode
	
	function _getBorrowerDeals(widget)
	{
		var borrowerid = dj.byId(widget) ? dj.byId(widget).get("value")  : "";
		dijit.byId('fetch_deals').set('disabled', true);
		console.debug('[Loan Drawdown] Checking for Borrower deals');
		m.xhrPost({
			url : m.getServletURL("/screen/AjaxScreen/action/GetBorrowerDeals"),
			handleAs : "json",
			sync : true,
			content : {
				borrowerid : borrowerid
			},				
			load : function(response)
			{
				misys._config.facilityListResponse = response;
				_populateDealsDropDown();
			},
			error : function(response) 
		    {
		    	console.debug("[INFO] No deals for the borrower found.");
		    }		    
		});
	}
	
	
	function _showBorrowerErrorMsg()
	{
		var borrowerid = dj.byId("custrefid");
		borrowerid.set("state","Error");		
		var displayMessage = m.getLocalization('noBorrowerForTransaction');		
		var hideTT = function() {
			dj.hideTooltip(borrowerid.domNode);
		};
		dj.showTooltip(displayMessage, borrowerid.domNode, 0);
 		setTimeout(hideTT, 5000);
		
	}

	function _populateDealsDropDown() 
	{	
		var borrowerid = dj.byId("custrefid") ? dj.byId("custrefid").get("value")  : "";
		var dealName = dijit.byId("dealid");
		// clear
		dealName.set('value', '');
		dealName.set("state", " ");
		
		var dealsDropDown = misys._config.facilityListResponse["items"];	
		// get associated store
		if(dealsDropDown)
		{
		  dealName.store = new dojo.data.ItemFileReadStore(
				 {
					 data :
					 {
					 	 identifier : "id",
						 label : "name",
						 items : dealsDropDown['dealNames']
					 }
				 });
		}
		
		var storeSize = 0;
		var getSize = function(size, request){
						storeSize = size;
					};

		dealName.get('store').fetch({query: {}, onBegin: getSize, start: 0, count: 0});
		
		//if there is no deals found in Loan IQ show a dialog on borrower reference text box
		if(storeSize === 0)
		{
			m.dialog.show("Warning",m.getLocalization('noDealsDataFound'));		
		}
		else
		{
			dealName.set('disabled', false);
			dijit.byId('fetch_deals').set('disabled', false);
			
			for(var x=1; x<dealName.store._arrayOfTopLevelItems.length;x++)
			{
				dealName.set('value', dealName.store._arrayOfTopLevelItems[x].name[x]);
				dealName.set('displayedValue', dealName.store._arrayOfTopLevelItems[x].name[x]);
				
			}
			dealName.set('value', dealName.store._arrayOfTopLevelItems[0].name[0]);
			dealName.set('displayedValue', dealName.store._arrayOfTopLevelItems[0].name[0]);
			dijit.byId('fetch_deals').onClick();
		}
		
		if((storeSize === 1 && dealName.store && dealName.store._arrayOfTopLevelItems.length) || (m.getLocalization('loanBorrowerReferenceDefault') === "true" && storeSize !== 0)) 
		{
			// Default the deal - if the drop-down contains only one deal item or "loanBorrowerReferenceDefault" flag is set to true
			dealName.set('value', dealName.store._arrayOfTopLevelItems[0].name[0]);
			dealName.set('displayedValue', dealName.store._arrayOfTopLevelItems[0].name[0]);
			dijit.byId('fetch_deals').onClick();
		}

	}
	
	function _populateFacilitiesGrid(widget)
	{
		var dealNamevalue = dj.byId(widget) ? dj.byId(widget).get("value")  : "";
		var facilitiesStore = misys._config.facilityListResponse["items"];
		var dealFacilities = facilitiesStore['facilities'];
		var store;
		
		if(dealNamevalue !== "" && facilitiesStore.facilities[dealNamevalue])
		{
		    store = new dojo.data.ItemFileReadStore(
				 {
					 data :
					 {
					 	 identifier : "id",
						 label : "Facility",
						 items : dealFacilities[dealNamevalue]
					 }
				 });		    
		}
		else
		{
			// Clearing the cells
			var emptyCells = { items: "" };
		    store = new dojo.data.ItemFileWriteStore({data: emptyCells});
		    if(dealNamevalue === "")
		    {
		    	var displayMessage = m.getLocalization('requiredToolTip');		
				var hideTT = function() {
					dj.hideTooltip(dj.byId(widget).domNode);
				};
				dj.showTooltip(displayMessage, dj.byId(widget).domNode, 0);
		 		setTimeout(hideTT, 5000);	
		    }
		}

	    store.comparatorMap = {};
	    store.comparatorMap['Expiry Date'] = misys.grid.sortDateColumn;
	    store.comparatorMap['Maturity'] = misys.grid.sortDateColumn;
	    store.comparatorMap['Total'] = misys.grid.sortAmountColumn;
	    store.comparatorMap['Available'] = misys.grid.sortAmountColumn;
	    store.comparatorMap['FCN'] = misys.grid.sortCaseSensetiveColumn;
	    store.comparatorMap['Facility'] = misys.grid.sortLinkColumn;
	    store.comparatorMap['Borrower'] = misys.grid.sortCaseSensetiveColumn;
	    store.comparatorMap['Ccy'] = misys.grid.sortCaseSensetiveColumn;
	    
		var grid = dj.byId("loanFacilitiesGrid");
		if(!facilitiesStore.facilities[dealNamevalue])
		{
			grid.noDataMessage = m.getLocalization("facilityMISCodeBlockedError");
		}
		grid.setStore(store);		

		//MPS-51272 - Grid Message when facility is blocked or borrower is not attached at facility level
		if(dijit.byId("loanFacilitiesGrid").store._arrayOfAllItems.length === 0){
			dojo.query("div.dojoxGridMasterMessages")[0].innerHTML = m.getLocalization('facilityNotPresent');
		}
	}
			
    d.mixin(m, {
		
		bind : function() {
			
			m.connect("fetch_deals","onClick",function()
				{
					_populateFacilitiesGrid("dealid");		
				});
			
			m.connect("custrefid","onChange",function()
				{
				    //Clear deal Name drop down and disable search button
					var dealid = dijit.byId('dealid');
					dealid.set('value', '');
					dealid.set('state', '');
					dealid.set('disabled', true);
					dijit.byId('fetch_deals').set('disabled', true);
					// clear the grid
					var emptyCells = { items: "" };
					var store = new dojo.data.ItemFileWriteStore({data: emptyCells});
					var grid = dj.byId("loanFacilitiesGrid");
					grid.setStore(store);
					if(dj.byId("custrefid").get("value"))
					{
						_getBorrowerDeals("custrefid");
					}
					
				});
			},
		
		onFormLoad : function() {

			dijit.byId('dealid').set('disabled', true);
			dijit.byId('fetch_deals').set('disabled', true);
	       	
			//If Borrower reference in populated on form load call on change event
        	if(dijit.byId('custrefid') && dijit.byId('custrefid').get('value') !== "")
        	{
        	  dijit.byId('custrefid').onChange();
        	}
        	if(dijit.byId('custrefid') && dijit.byId('custrefid').get('value') == "")
        	{
        	  _showBorrowerErrorMsg();
        	}
        },
    	
    	blockFacility : function (facilityName){
    		m.dialog.show('ERROR',misys.getLocalization('facilityBlockError',[facilityName]));
    	},
    	
        	

		 sortFacilityColumn : function(a, b) {

			var innerA;
			var innerB;

			if (a.indexOf(">", 0) > -1) {
				innerA = (a.substring(a.indexOf(">", 1) + 1, a.indexOf("<", 1))).toLowerCase();
			} else {
				innerA = a.toLowerCase();
			}
			if (b.indexOf(">", 0) > -1) {
				innerB = (b.substring(b.indexOf(">", 1) + 1, b.indexOf("<", 1))).toLowerCase();
			} else {
				innerB = b.toLowerCase();
			}

			if (innerA > innerB) {
				return 1;
			}
			if (innerA < innerB) {
				return -1;
			}

			return 0;
		}
	});
	
})(dojo, dijit, misys);//Including the client specific implementation
dojo.require('misys.client.binding.loan.ln_list_facilities_client');