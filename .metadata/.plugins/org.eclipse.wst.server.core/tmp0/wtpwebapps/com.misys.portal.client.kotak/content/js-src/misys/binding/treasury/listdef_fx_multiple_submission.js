dojo.provide("misys.binding.treasury.listdef_fx_multiple_submission");

/*
-----------------------------------------------------------------------------
Scripts for the list def binding for Multiple Submission of FX Deals


Copyright (c) 2000-2012 Misys (http://www.misys.com),
All Rights Reserved. 


-----------------------------------------------------------------------------
*/

dojo.require("dojo.data.ItemFileReadStore");
dojo.require('dojo.data.ItemFileWriteStore');
dojo.require("dijit.form.FilteringSelect");
dojo.require("misys.form.MultiSelect");
dojo.require("dijit.layout.TabContainer");
dojo.require("misys.form.common");
dojo.require("misys.openaccount.StringUtils");
dojo.require("misys.validation.common");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.CheckBox");
dojo.require("dijit.layout.ContentPane");
dojo.require("misys.form.CurrencyTextBox");
dojo.require("misys.binding.common.reauth_listdef_common");
dojo.require("misys.binding.system.reauth");
dojo.require("misys.binding.common.reauth_listdef");

(function(/*Dojo*/d, /*dj*/dj, /*Misys*/m) {
	
	d.mixin(m._config, {
		doReauthSubmit : function(xhrParams){
			 var paramsReAuth 	= 	{};
			 if(d.isFunction(m._config.initReAuthParams)) 
			 {
				 paramsReAuth 				=  m._config.initReAuthParams();
				 m._config.reauthXhrParams	=  m._config.reauthXhrParams || {};
				 m._config.reauthXhrParams	=  xhrParams;
				 m._config.executeReauthentication(paramsReAuth);
			 }
		},
		initReAuthParams : function(){	
			//var	accountAmountArray	=	m._config.getAmountAccountArray('tnx_amt;amt','Counterparty@counterparty_act_no',true),		
				reAuthParams 		= 	{	productCode    : 'FX',
											subProductCode :dj.byId("sub_product_code") ? dj.byId("sub_product_code").get("value") : "",
											transactionTypeCode : '01',
											entity :dj.byId("entity") ? dj.byId("entity").get("value") : "",
											currency : '',
											amount : '',				
											es_field1 : '',
											es_field2 : ''
										};
			return reAuthParams;
		},
		reauthSubmit : function()
		{
			//Summary: This function append the reauth related parameters to the actual XHR content params and the posts the transaction
			var valueToEE 					= 	dj.byId("reauth_password").get("value");
				
			d.mixin(m._config.reauthXhrParams.content,{
				reauth_otp_response			:	valueToEE
			});
			m.xhrPost (m._config.reauthXhrParams);
			setTimeout(d.hitch(dijit.byId(m._config.getGridId()), "render"), 100);
			dj.byId("reauth_password").set("value","");
			dj.byId("reauth_dialog").hide();
		},
		nonReauthSubmit : function()
		{
			//Summary: When Reauthentication is defined for then execute the below code
			m.xhrPost (m._config.reauthXhrParams);
			setTimeout(d.hitch(dijit.byId(m._config.getGridId()), "render"), 100);
		},
		submitFXOrder : function() {
				var grids 		= [],
					referenceid = "",
					tnxid		= "";
				if(dj.byId("nonSignedFolders"))
				{
					if(dijit.byId("nonSignedFolders").selection.selectedIndex !== -1)
					{
						if(dj.byId("referenceid"))
						{
							referenceid = dj.byId("referenceid").get("value");
						}
						if(dj.byId("tnxid"))
						{
							tnxid		= dj.byId("tnxid").get("value");
						}
					}
				}
				d.query(".dojoxGrid").forEach(function(g){
					grids.push(dj.byId(g.id));
				});
				m._config.processRecords(grids, "/screen/AjaxScreen/action/TreasuryMultipleSubmission?s=ForeignExchangeScreen&option=STANDING_INSTRUCTIONS&mode=UNSIGNED&tnxtype=13&referenceid="+referenceid+"&tnxid="+tnxid);
		},
		processRecords : function( /*Dojox Grid || Array of Grids*/ grid,
					   /*String*/ url,
					   /*Function*/ handleCallback) {
			// summary:
			//		Triggers the submission of transaction records (msg = 22).
			// 
			//	TODO This appears to be only partially implemented
		    
			var grids = d.isArray(grid) ? grid : [grid],
				targetNode = d.byId("batchContainer"),
				items = [],
				keys = "",
				intNbKeys = 0,
				reference, xhrArgs;
				m.animate("wipeOut", targetNode);
			d.forEach(grids, function(grid){
				items = grid.selection.getSelected();
				if(items && items.length) {
					d.forEach(items, function(selectedItem) {
						// extract the reference
						reference = grid.store.getValues(selectedItem, "box_ref");

						// separator
						if(keys !== ""){
							keys += ", ";
						}
						keys += reference;
						intNbKeys++;
					});
				}
			});
			
			if(intNbKeys > 0) {
				// TODO This should be implemented properly
				m._config._processRecords(grids, url, keys, handleCallback);
				
			}	
			else if (intNbKeys === 0){
				m.dialog.show("ERROR", m.getLocalization("noTransactionsSelectedError"));
			}
			
		},
 	 _processRecords : function( /*Dijit._widget | Array of grids*/ grids,
		  /*String*/ url,
		  /*String*/ keys,
		  /*Function*/handleCallback)
		{
			grids = d.isArray(grids) ? grids : [ grids ];
			var urlParams =
			{
				"list_keys" : keys
			}, targetNode = d.byId("batchContainer"), xhrArgs;

			/*if (dj.byId("reauth_password"))
			{
				d.mixin(urlParams,
				{
					"reauth_password" : dj.byId("reauth_password").get("value")
				});
			}*/
			xhrArgs =
			{
				url : m.getServletURL(url),
				handleAs : "text",
				sync : true,
				content : urlParams,
				load : function(data)
				{
					// Replace newlines with nice HTML tags.
					data = data.replace(/\n/g, "<br>");

					// Replace tabs with spaces.
					data = data.replace(/\t/g, "&nbsp;&nbsp;&nbsp;");
					targetNode.innerHTML = data;

					setTimeout(function()
					{
						m.animate("wipeIn", "batchContainer");
					}, 500);

					// Deselect all rows & rerender grids
					m._config.groups = [];
					d.forEach(grids, function(g)
					{
						// Reload data
						g.setStore(g.store);
						d.hitch(g, "render")();

						// Clear selection once data fetch complete
						m.connect(g, "_onFetchComplete", function()
						{
							g.selection.clear();
						});
					});
				}
			};

			if (handleCallback)
			{
				d.mixin(xhrArgs,
				{
					handle : handleCallback
				});
			}
			
			var reauth = dj.byId("reauth_perform");
			if((reauth && reauth.get('value') === "Y") && d.isFunction(m._config.doReauthSubmit))
			{
				m._config.doReauthSubmit(xhrArgs);
			}
			else
			{
				m.xhrPost(xhrArgs);
			}
			// Call the asynchronous xhrPost
		   //	d.xhrPost(xhrArgs);
		}
	});
	
	
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.openaccount.listdef_fx_multiple_submission_client');
