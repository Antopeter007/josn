dojo.provide("misys.binding.system.generic_parameters_list");
/*
 -----------------------------------------------------------------------------
 Scripts for the Parameter Maintenance .
 
 Copyright (c) 2000-2010 Misys (http://www.misys.com),
 All Rights Reserved.
 version:   1.0
 date:      10/02/2011
 -----------------------------------------------------------------------------
 */
dojo.require("dijit.form.NumberTextBox");
dojo.require("misys.form.common");
dojo.require("misys.validation.common");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.CheckBox");
dojo.require("dijit.layout.ContentPane");
dojo.require('dojo.data.ItemFileReadStore');
dojo.require("dojox.grid.cells.dijit");
dojo.require("dojox.grid.cells");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {
	
	"use strict"; // ECMA5 Strict Mode

	function _deleteRecord(){
		
		var selparmid = dijit.byId('parameter').get('value');
	    if( selparmid=== "P261"){
	    	 var keygrid = dijit.byId('keyParameterGrid');
	    	 if (keygrid.selection.selectedIndex > -1) {
	    		 var keyitems = keygrid.getItem(keygrid.selection.selectedIndex);
		    	 var rmGroupId = keygrid.store.getValue(keyitems, "KEY_2");
		    	 if(!_validateRMGroupAssociation(rmGroupId)){	    		 
		    		 return;
		    	 }	
	    	 }    	
	    }		
		_doAction('DELETE_FEATURES');		
	}

	function _doAction(/* String*/actionString){
	    //  summary:
	    //         get the selected record from the keygrid and append to the URL and send it; 
	    //  tags:
	    //         public
	    var keygrid = dijit.byId('keyParameterGrid');
	    if (keygrid.selection.selectedIndex < 0) {//if no rows are selected return
	        return;
	    }
	    var keyitems = keygrid.getItem(keygrid.selection.selectedIndex);
	    var keyvalues = keygrid.store.getValue(keyitems, "MANKEYS");
	    var selparmid = dijit.byId('parameter').get('value');	    
	    
	    //now construct the request for deleting the request
	    var realoperationfld = dijit.byId('realform_operation');
	    if (realoperationfld) {
	        realoperationfld.set('value', actionString);
	    }	    
	    
	    var featurefld = dijit.byId('featureid');
	    if (featurefld) {
	        featurefld.set('value', selparmid);
	    }
	    dijit.byId('ParameterData').set('value', keyvalues);
	    var theRealForm = document.realform.submit();
	}
	
	function _updateStoreData(/*String*/gridID, /*String*/ datavalue){
	    var grid = dijit.byId(gridID);
	    //  var myObject = eval('(' + datavalue + ')');
	    var myObject = dojo.fromJson(datavalue);
	    var dataStore = new dojo.data.ItemFileReadStore({
	        data: myObject
	    });
	    grid.store = dataStore;
	}
	
	//Checks for RM Grou Association with Corporates/Bankers.	
	function _validateRMGroupAssociation(rmGroupId){		
				
		var isValid=true;
		var displayMessage = '';

		if(rmGroupId !== "") {
	
			m.xhrPost( {
				url : m.getServletURL("/screen/AjaxScreen/action/CheckRMGroupAssociationAction"),
				handleAs 	: "json",
				sync 		: true,
				content : {
					rm_group_id : rmGroupId
				},
				load : function(response, args){
					console.debug("[Validate] Validating RMGroup ");
					
						if(response.items.isAssociated === true)
						{
							displayMessage = m.getLocalization("rmGroupAssociationError", [rmGroupId]);
							isValid = false;
						}
				},
				error : function(response, args){
					isValid = false;
					console.error(" RM Group Deletion error", response);
				}
			});
			
			if(!isValid)
			{
				m.dialog.show('ERROR',displayMessage);
				return false;
			}
			else
			{
				return true;
			}
		}
		return isValid;
	}
	
	d.mixin( m, {
		selectParameter : function(){
		    var selectedcmb = dijit.byId('parmid').get('value');
		    if(selectedcmb)
		    	{
				    var featurefld = dijit.byId('featureid');
				    if (featurefld) {
				        featurefld.set('value', selectedcmb);
				    }
				    
				    //now construct the request for deleting the request
				    var realoperationfld = dijit.byId('realform_operation');
				    if (realoperationfld) {
				        realoperationfld.set('value', 'SELECT_PARAMETER');
				    }
				    var optionfld = dijit.byId('option');
				    if (optionfld) {
				        optionfld.set('value', 'GENERIC_PARAMETER_MAINTENANCE');
				    }
				    var theRealForm = document.realform.submit();
		    	}
		    else
		    	{
		    		m.showTooltip(m.getLocalization('requiredToolTip'), d.byId('parmid'),0);
		    	}
		},

		selectionChanged : function(){
			
			
			if(dojo.byId("dataValuesContainer") && dojo.style("dataValuesContainer","display") === "none")
			{
				misys.animate("fadeIn","dataValuesContainer");
				
			}
			
			//getting the combobox selection value
		    var selparmid = dijit.byId('parameter').get('value');
		    var keygrid = dijit.byId('keyParameterGrid');
		    //getting the parameter id . this is available only in the case of mutiple
		    var varUrl = misys.getServletURL('/screen/AjaxScreen/action/GenericParameterMaintAction');
		    if (keygrid.selection.selectedIndex < 0) {//if no rows are selected return
		        //TODO remove the data from data grid
		        misys.grid.setStoreURL('dataParameterGrid', varUrl, { ajaxoption: 'DATA', parmid: selparmid});
		        return;
		    }
		    
		    var keyitems = keygrid.getItem(keygrid.selection.selectedIndex);
		    var status = keygrid.store.getValue(keyitems, "HIDDEN_STATUS");
		    var data = keygrid.store.getValue(keyitems, "DATA");
		    var datagrid = dijit.byId('dataParameterGrid');
		    
		    _updateStoreData('dataParameterGrid', data);
		    datagrid._refresh();
		    //enable the copy record button
		    var copybtn = dijit.byId('copyButton');
		    if(copybtn && selparmid ==="P108")
		    {
		    	copybtn.set("disabled", true);
		    }
		    else if(copybtn && (status === "AN" || status === "RN" || status === "DN"))
		    {
		    		copybtn.set("disabled", true);
		    }
		    else if (copybtn)
		    {
		        copybtn.set("disabled", false);
		    }
		},
		onDeselected:function(){
			var dataGrid = dijit.byId('dataParameterGrid');
			var newStore = new dojo.data.ItemFileReadStore({data: {  identifier: "",  items: []}});
			dataGrid.setStore(newStore);
		},

		recordConfirmDelete : function( /*String*/strURL){
		    //  summary:
		    //         Show a popup of confirmation to allow the deletion of a record
		    //  tags:
		    //         public
		    var keygrid = dijit.byId('keyParameterGrid');
		    if (keygrid.selection.selectedIndex < 0) {//if no rows are selected return
		        return;
		    }
		    misys.dialog.show('CONFIRMATION', misys.getLocalization('deleteRecordConfirmation'), '', _deleteRecord);
		},
		
		recordCopy : function(){
		    _doAction('COPY_FEATURES');
		},

		recordModify : function(){
		    _doAction('MODIFY_FEATURES');
		},
		onFormLoad : function() {
			if(dj.byId('parmid') && dj.byId('parmid').store && dj.byId('parmid').store.root && dj.byId('parmid').store.root.length > 0){
				dj.byId('parmid').fetchProperties = {
					sort : [ {
						attribute : "name"
					} ]
				};
			}
		}
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.system.generic_parameters_list_client');