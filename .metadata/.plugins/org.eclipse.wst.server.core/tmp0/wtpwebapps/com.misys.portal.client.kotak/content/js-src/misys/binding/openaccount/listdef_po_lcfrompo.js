dojo.provide("misys.binding.openaccount.listdef_po_lcfrompo");

dojo.require("dojo.data.ItemFileReadStore");
dojo.require('dojo.data.ItemFileWriteStore');
dojo.require("dijit.form.FilteringSelect");
dojo.require("misys.form.MultiSelect");
dojo.require("dijit.layout.TabContainer");
dojo.require("misys.form.common");
dojo.require("misys.validation.common");
dojo.require("misys.form.SimpleTextarea");
dojo.require("misys.openaccount.StringUtils");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.CheckBox");
dojo.require("dijit.layout.ContentPane");
dojo.require("misys.form.CurrencyTextBox");
/*
 * TODO This file has direct references to the reauthentication This looks
 * wrong, need to reassess if this can be achieved in a more standard way.
 */
dojo.require("misys.binding.common.reauth_listdef_common");
dojo.require("misys.binding.system.reauth");
dojo.require("misys.binding.common.reauth_listdef");

(function(/* Dojo */d, /* dj */dj, /* Misys */m)
{

	function _isAnyItemSelectedInGrid()
	{
		var isSelected = false, grids = [];
		d.query(".dojoxGrid").forEach(function(g)
		{
			grids.push(dj.byId(g.id));
		});
		d.forEach(grids, function(grid)
		{
			if (grid.selection.getSelected().length > 0 && grid.store._items.length > 0)
			{
				isSelected = true;
			}
		});
		return isSelected;
	}

	d.subscribe('ready', function()
	{
		m._config = (m._config) || {};
		m._config.cellNodeReference;
		d.query(".dojoxGrid").forEach(function(grid)
		{
			if (grid.id !== "nonSignedFolders")
			{
				m.connect(grid.id, "onRowClick", m._config.storeCellNodeReference);
				m.connect(grid.id, "onHeaderCellClick", function(evt)
				{
					if (m._config.cellNodeReference && m._config.cellNodeReference.cellNode)
					{
						dj.hideTooltip(m._config.cellNodeReference.cellNode);
						m._config.cellNodeReference.cellNode = null;
					}
				});
			}
		});
	});

	d.mixin(m._config,
					{
						fncInitRecords : function()
						{
							var grids = [], referenceid = "", paramsReAuth = {}, reauth = dj.byId("reauth_perform");
							m._config.programcode = "";
							m._config.subtnxtypecode = "";

							if (_isAnyItemSelectedInGrid())
							{
								if (reauth && reauth.get('value') === "Y")
								{
									if (d.isFunction(m._config.initReAuthParams))
									{
										paramsReAuth = m._config.initReAuthParams();
										m._config.executeReauthentication(paramsReAuth);
									} else
									{
										console.debug("Doesnt find the function initReAuthParams for ReAuthentication");
										m.setContentInReAuthDialog("ERROR", "");
										dj.byId("reauth_dialog").show();
									}
								} else
								{
									m._config.nonReauthSubmit();
								}
							}
							else
							{
								m.dialog.show("ERROR",  m.getLocalization("noTransactionsSelectedError"));
							}
						},
						storeCellNodeReference : function(evt)
						{
							// summary:
							// Preserve the cell node reference for selected
							// event of the check box
							m._config.cellNodeReference = evt;
						},
						initReAuthParams : function()
						{
							var reAuthParams =
							{
								productCode : 'LC',
								subProductCode : '',
								transactionTypeCode : '01',
								entity : '',
								currency : '',
								amount : '',

								es_field1 : '',
								es_field2 : ''
							};
							return reAuthParams;
						},
						reauthSubmit : function()
						{
							var valueToEE = dj.byId("reauth_password").get("value"),
							referenceid = "", grids = [];

							var reauthURLParameter = [];
							reauthURLParameter.push("&reauth_otp_response=", valueToEE);

							if (dj.byId("nonSignedFolders"))
							{
								if (dijit.byId("nonSignedFolders").selection.selectedIndex !== -1)
								{
									if (dj.byId("referenceid"))
									{
										referenceid = dj.byId("referenceid").get("value");
									}
								}
							}
							var url = "/screen/AjaxScreen/action/LCFromPOMultipleSubmission?s=PurchaseOrderScreen&operation=SUBMIT&option=PO_FOLDER_LC&tnxtype=01&referenceid="+ referenceid;//+ "&tnxid="+ tnxid+ "&programcode="+ m._config.programcode;
							if (m._config.subtnxtypecode !== null)
							{
								url = url + "&sub_tnx_type_code=" + m._config.subtnxtypecode;
							}
							d.query(".dojoxGrid").forEach(function(g)
							{
								grids.push(dj.byId(g.id));
							});
							m.grid.processRecords(grids, url + reauthURLParameter.join(""));
						},
						nonReauthSubmit : function()
						{
							var grids = [], referenceid = "";
							if (dj.byId("nonSignedFolders"))
							{
								if (dijit.byId("nonSignedFolders").selection.selectedIndex !== -1)
								{
									if (dj.byId("referenceid"))
									{
										referenceid = dj.byId("referenceid").get("value");
									}
								}
							}
							d.query(".dojoxGrid").forEach(function(g)
							{
								grids.push(dj.byId(g.id));
							});
							var url = "/screen/AjaxScreen/action/LCFromPOMultipleSubmission?s=InvoiceScreen&operation=SUBMIT&option=PO_FOLDER_LC&tnxtype=01&referenceid="+ referenceid;//+ "&tnxid="+ tnxid+ "&programcode="+ m._config.programcode;
							if (m._config.subtnxtypecode !== null)
							{
								url = url + "&sub_tnx_type_code=" + m._config.subtnxtypecode;
							}
							m.grid.processRecords(grids, url);
						}
					});

})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.openaccount.listdef_po_lcfrompo_client');