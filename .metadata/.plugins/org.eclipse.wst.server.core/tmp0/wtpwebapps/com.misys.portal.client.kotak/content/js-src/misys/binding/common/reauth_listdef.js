dojo.provide("misys.binding.common.reauth_listdef");

/*
-----------------------------------------------------------------------------
Scripts for Re-authentication of listDef binding for Multiple Batch Submission


Copyright (c) 2000-2012 Misys (http://www.misys.com),
All Rights Reserved. 

version:    1.0
date:       10/07/12
author:		Sam Sundar K
-----------------------------------------------------------------------------
*/

(function(/*Dojo*/d, /*dj*/dj, /*Misys*/m) {
	
	function _getQualifiedAmount(rowData,amountArrayFieldNames)
	{
		//Summary:
		// Method to identify tnx_amt or amount field and return the amount value 
		var qualifiedAmount	=	0;
		for(var i in amountArrayFieldNames)
		{
			if((rowData.i[amountArrayFieldNames[i]] !== undefined) && (rowData.i[amountArrayFieldNames[i]] + "S" !== "S"))
			{
				qualifiedAmount	=	rowData.i[amountArrayFieldNames[i]];
				break;
			}
		}
		return	qualifiedAmount;
	}
	
	d.mixin(m._config, {
		getAmountAccountArray : function(amountFieldName,accountFieldName,onlySelected){
			//Summary: This function extracts the Amount and Account Field information from the Grid
			var gridId						= m._config.getGridId(),
				amountAccountArray 			= amountAccountArray || [],
				amountArrayFieldNames		= amountFieldName.split(";"),
				qualifiedAmountFieldName	= "";
				//Proceed if any grid is defined
				if("S" + gridId !== "S")
				{
					var bulkTransactionGrid = dijit.byId(gridId);
					if(bulkTransactionGrid && bulkTransactionGrid.store)
					{
						//Sort store items by tnx_id
						var selectedItems	= [];
						
							if(onlySelected)
							{
								selectedItems	=	bulkTransactionGrid.selection.getSelected();
							}
							else
							{
								selectedItems	=	bulkTransactionGrid.store._items;
							}
							
						selectedItems.sort(function(a,b){
							if (a.i.tnx_id < b.i.tnx_id) 
							{
								return -1;
							}
							else if (a.i.tnx_id > b.i.tnx_id) 
							{
								return 1;
							}
							else
							{
								return 0;
							}
						});
						for(var i=0;i<selectedItems.length;i++)
							{
								amountAccountArray[i]	=	{};
								amountAccountArray[i].esf1_amount	=	m.trimAmount(_getQualifiedAmount(selectedItems[i],amountArrayFieldNames));
								
								if(!(selectedItems[i].i[accountFieldName]) || selectedItems[i].i[accountFieldName] + "S" === "S")
								{
									amountAccountArray[i].esf2_account	= 	0;
								}
								else
								{
									amountAccountArray[i].esf2_account	=	selectedItems[i].i[accountFieldName];
								}
							}
					}
				}
				else
				{
					console.debug("getAmountAccountArray failed to continue. Because Couldn't found any grids to process");
				}
				return amountAccountArray;
		},
		getAmountSum :	function(amountAccountArray){
			// Summary: This function computes the sum of all selected transactions amount 
			var amountSum = d.number.parse(0);
			for(var i=0;i<amountAccountArray.length;i++)
			{
				var x = d.number.parse(amountAccountArray[i].esf1_amount);
				amountSum	=	(d.number.parse(amountSum) + d.number.parse(x)).toFixed(3);
			}
			return amountSum;
		},
		executeReauthentication : function(paramsReAuth){
			// Summary: This function is to make a Ajax call to find out whether re-auth is needed 
			//          if needed it builds the re-auth pop up screen
			
			console.debug('[FormEvents] Checking for reAuth requirement');
			
			var es_field1 = (paramsReAuth.es_field1) ? paramsReAuth.es_field1 : '';
			var	es_field2 = (paramsReAuth.es_field2) ? paramsReAuth.es_field2 : '';
			
			m.xhrPost({
			url 					: m.getServletURL("/screen/AjaxScreen/action/ReAuthenticationAjax"),
			handleAs 				: "text",
			sync 					: true,
			preventCache			: true,
			content 				: 
			{
				productCode 		: paramsReAuth.productCode,
				subProductCode 		: paramsReAuth.subProductCode,
				transactionTypeCode : paramsReAuth.transactionTypeCode,
				entity 				: (paramsReAuth.entity) ? paramsReAuth.entity : '',		
				currency 			: (paramsReAuth.currency) ? paramsReAuth.currency : '',
				amount 				: (paramsReAuth.amount) ? paramsReAuth.amount : '',
				list_keys			: paramsReAuth.list_keys,
				operation			: paramsReAuth.operation ? paramsReAuth.operation : ''
			},		
			load : function(response, ioArgs)
			{   
				 if(!(response.indexOf('SC_UNAUTHORIZED') === -1)){
				    	misys.showSessionOverDialog();
				    }
				 else{
					m.setContentInReAuthDialog(response, ioArgs);
					if("" +	response + "" !== '01')
					{
						m._config.addESFields(es_field1, es_field2);
						dj.byId("reauth_dialog").show(); 
					}	
				 }
			},
			customError : function(response, ioArgs)
			{				
				console.error(response);
				m.setContentInReAuthDialog("ERROR", ioArgs);
				dj.byId("reauth_dialog").show();
			}		
			});
		},
		getGridId : function()
		{
			var gridId = "";
			d.query(".dojoxGrid").forEach(function(grid){
				if(grid.id !== "nonSignedFolders")
				{
					gridId = grid.id;				
				}
			});
			return gridId;
		}
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.common.reauth_listdef_client');