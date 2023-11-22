/*
 * ---------------------------------------------------------- 
 * Event Binding for Bulk
 * 
 * Copyright (c) 2000-2011 Misys (http://www.misys.com), All Rights Reserved.
 * 
 * version: 1.0 date: 07/03/11
 * 
 * ----------------------------------------------------------
 */
dojo.provide("misys.binding.core.merge_demerge_bk");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {
	
	/**
	 * subscribe an event for on selection for a  bulk perform a demerge
	 * Copy transaction from source bulk  to destination bulk
	 */
	d.subscribe('ready',function(){
		if(dj.byId("gridBulkTransactionForDemerge"))
		{
			 m.connect(dj.byId("gridBulkTransactionForDemerge").selection,"onSelected",function(rowIndex){
				 _performDeMerge("gridBulkTransactionForDemerge");
			 });
		}
	});
	
	function _setTransactionId(/*string*/ childTransactionGridId)
	{
		var tnxGrid =  dj.byId(childTransactionGridId),
			keys = "",
			intNbKeys = 0,
			listkey = dj.byId("list_keys"),
			reference,
			items = tnxGrid.selection.getSelected();
		
		if(items.length) {
			d.forEach(items, function(selectedItem) {
				reference = tnxGrid.store.getValues(selectedItem, "ref_id");

				if(intNbKeys !== 0){ 
					keys += ",";
				}
				
				keys += reference;
				intNbKeys++;
			});

		}
		if (listkey != null){
			listkey.set("value", keys);
		}
		
	}
	function _performDeMerge(/** Grid Id**/ gridId)
	{
		console.debug("[misys.binding.core.merge_demerge_bk] About to perform de merge Start: _performDeMerge");
		var tnxGrid =  dj.byId(gridId),
		    destinationBulkRefId,
		    destinationBulkTnxId,
		    sourceBulkRefId,
		    sourceBulkTnxId,
		    displayMessage,
		    destinationBulkGridItems = tnxGrid.selection.getSelected(),
		    callback = function(){
			_doDeMerge(sourceBulkRefId,sourceBulkTnxId);
		};
		// if item is selected
		if(destinationBulkGridItems.length)
		{
			 // iterate items
			d.forEach(destinationBulkGridItems, function(selectedItem) {
				destinationBulkRefId = tnxGrid.store.getValues(selectedItem,"ref_id");
				destinationBulkTnxId = tnxGrid.store.getValues(selectedItem,"tnx_id");
			});
		}
		// set to hidden fields on the form so can access on server sid
		if(dj.byId("destination_bulk_ref_id"))
		{
			dj.byId("destination_bulk_ref_id").set("value",destinationBulkRefId);
		}
		if(dj.byId("destination_bulk_tnx_id"))
		{
			dj.byId("destination_bulk_tnx_id").set("value",destinationBulkTnxId);
		}
		// get the source ref id and tnx id
		sourceBulkRefId = dj.byId("ref_id").get("value");
		sourceBulkTnxId = dj.byId("tnx_id").get("value");
		displayMessage = misys.getLocalization('confirmForDeMergeBulk', [dj.byId("merge_fts").get("value")]);
		// show dialog only when selected item is atleast one or more than one
		if(destinationBulkGridItems.length >= 1)
		{
			m.dialog.show("CONFIRMATION", displayMessage, "", callback);
		}
		console.debug("[misys.binding.core.merge_demerge_bk] About to perform de merge END: _performDeMerge");
	}
	
	function _doDeMerge(/**String**/sourceBulkRefId,/** String **/ sourceBulkTnxId)
	{
		console.debug("[misys.binding.core.merge_demerge_bk] About to do de merge: _doDeMerge");
		// submit the form
		m.goToTransaction("existingForm", {
			tnxtype: "01",
			option: "DE-MERGE",
			mode: "DRAFT",
			operation:"SAVE",
			referenceid : sourceBulkRefId,
			tnxid: sourceBulkTnxId}
		);
	}
	
	function _doDeMergeToNewBulk(/**String**/sourceBulkRefId,/** String **/ sourceBulkTnxId)
	{
		// submit the form
		m.goToTransaction("existingForm", {
			tnxtype: "01",
			option: "DE-MERGE",
			mode: "DRAFT",
			operation:"NEW",
			referenceid : sourceBulkRefId,
			tnxid: sourceBulkTnxId}
		);
		
	}
	
	d.mixin(m, {
	
	/**
	 *  Function to call next screen on click of move ( to move transaction to different Bulk)
	 */
	moveItems : function(/*string*/ childTransactionGridId)
	{
		var tnxGrid = dj.byId(childTransactionGridId),
		    selectedTransactions = tnxGrid.selection.getSelected(),
		    refId = dijit.byId("referenceid").get('value'),
		    tnxId = dijit.byId("tnxid").get('value');
		console.debug("[misys.binding.core.create_bk] Bulk Method Start: moveItems");
		if(selectedTransactions.length) 
		{
			_setTransactionId(childTransactionGridId);
			m.goToTransaction("existingForm", {
				tnxtype: "01",
				option: "DE-MERGE",
				mode: "DRAFT",
				referenceid : refId,
				tnxid: tnxId }
			);
		}
		else
		{
			console.debug("[misys.binding.core.create_bk] Bulk Method Process : _moveItems: No tnx selected to move to other bulk");
			m.dialog.show("CUSTOM-NO-CANCEL", m.getLocalization("selectAtleastOneTnxToMove"), "");
		}
		console.debug("[misys.binding.core.create_bk] Bulk Method End: moveItems");
	},
	
	onBeforeLoad : function()
	{
		m.excludedMethods.push({object: m, method: "moveItemsToNewBulk"},{object: m, method: "goToTransaction"});
	},
	
  moveItemsToNewBulk : function(/** Grid Id**/ gridId)
	{
		console.debug("[misys.binding.core.merge_demerge_bk] About to perform de merge  to new bulk Start: moveItemsToNewBulk");
		var tnxGrid =  dj.byId(gridId),
		    sourceBulkRefId,
		    sourceBulkTnxId,
		    displayMessage,
		    callback = function(){
			_doDeMergeToNewBulk(sourceBulkRefId,sourceBulkTnxId);
		};
		// get the source ref id and tnx id
		sourceBulkRefId = dj.byId("ref_id").get("value");
		sourceBulkTnxId = dj.byId("tnx_id").get("value");
		displayMessage = misys.getLocalization('confirmForDeMergeBulkForNewBulk', [dj.byId("merge_fts").get("value")]);
		
	    m.dialog.show("CONFIRMATION", displayMessage, "", callback);
		console.debug("[misys.binding.core.merge_demerge_bk] About to perform de merge for new bulk END: moveItemsToNewBulk");
	},
	
	/*
	 * This method resizes the dialog and the iframe in the page, to fit the whole view port.
	 * Then it submits the form provided to the iframe, with the fields defined in content
	 */
	goToTransaction : function(formName, content)
	{
		console.debug("[misys.binding.core.merge_demerge_bk] Bulk Method Start: goToTransaction");
		var formByDijit = dj.byId(formName);
		var formDOM = d.byId(formName);
		for (var x in content)
		{
			if(!formDOM[x])
			{
				d.create("input", {type: "hidden", name: x, value: content[x]}, formDOM);
			}
			else
			{
				formDOM[x].value = content[x];
			}
		}

		// Token value
		if (dj.byId('token'))
		{
			d.create("input", {type: "hidden", name: "token", value: dj.byId('token').get('value')}, formDOM);
		}

		formByDijit.connectChildren();
		formByDijit.set("action", misys.getServletURL("/screen/BulkScreen"));
		formByDijit.startup();
		console.debug("[misys.binding.core.merge_demerge_bk] Bulk Method Submission: goToTransaction");
		formByDijit.submit();
		console.debug("[misys.binding.core.merge_demerge_bk] Bulk Method End: goToTransaction");
	}
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.core.merge_demerge_bk_client');