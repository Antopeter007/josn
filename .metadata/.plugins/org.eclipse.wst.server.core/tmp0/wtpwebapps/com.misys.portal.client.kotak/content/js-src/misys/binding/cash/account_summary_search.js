dojo.provide("misys.binding.cash.account_summary_search");

dojo.require("misys.validation.common");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.Select");
dojo.require("misys.form.common");
dojo.require("misys.widget.Dialog");
dojo.require("dijit.form.ValidationTextBox");


(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	var formloading = true;
	/**
	 * To change extension of the file depending on the output format selected
	 */
	function _setExportFileName()
	{
		var extension = dj.byId("export_list");
		if(extension != "screen")
		{
			var name = "AccountSummary." + extension;
			dj.byId("filename").set("value", name);
		}
		if(dj.byId('export_list').get('value') === "screen")
		{
			dj.byId('export_list').set('value','');
		}
	}
	
	function populateBanks()
	{
		var entity = null;
		var bank = null;
		if(dj.byId("bank_abbv_name"))
		{
			bank = dj.byId("bank_abbv_name");
		}
		
		if(dj.byId("entity") && dj.byId("entity").get("value") !== "")
		{
			entity =dj.byId("entity").get("value");
		}
		else
		{
			entity = "All";
		}
		
		
		if(misys._config.entityBanksMap)
		{
			var customerBankDataStore = null;
			customerBankDataStore = m._config.entityBanksMap[entity];
			
			if (customerBankDataStore && bank)
			{	
				bank.store = new dojo.data.ItemFileReadStore({
					data :
					{
						identifier : "value",
						label : "name",
						items : customerBankDataStore
					}
				});
				bank.fetchProperties =
				{
					sort : [
					{
						attribute : "name"
					} ]
				};
			}	
		}
	}
	
	function _handleEntityOnChangeFields()
	{
			if(dj.byId("account_no"))
			{
				dj.byId("account_no").set("value", "");
				dj.byId("account_id").set("value", "");
			}
    		if(dj.byId("bank_abbv_name"))
    		{
    			dj.byId("bank_abbv_name").set("value","");
    		}
    		populateBanks();
	}
	
	function _handleBankOnChangeFields()
	{
			if(formloading && dj.byId("account_no"))
			{
				dj.byId("account_no").set("value", "");
			}
			
			formloading = true;
	}
	
	function _openPopup( /*String*/ url,
			 /*String*/ name,
			 /*String*/ props) {
		var windowName = name || misys.getLocalization("transactionPopupWindowTitle"),
		   windowProps = props || "width=800,height=500,resizable=yes,scrollbars=yes",
		   popupWindow = d.global.open(url, windowName, windowProps);
		
		if(!popupWindow.opener)
		{
			popupWindow.opener = self;
		}
		popupWindow.focus();
	}
	
	d.mixin(m, {
		
		bind : function() {			
			m.connect("submit", "onClick", m.submit);
		},
		 	
		submit : function ()
		{
			if (dj.byId("entity") && dj.byId("entity").get("value") === "")
			{
				m.dialog.show("ERROR", m.getLocalization("entityNotSelectedError"));
				e.preventDefault();
			}
			else {
				if(dj.byId("export_list").get("value") === "screen")
				{
					dj.byId("export_list").set("value","");
				}
				if(dj.byId("bank_abbv_name") && dj.byId("bank_abbv_name").get("value") === "")
				{
					dj.byId("bank_abbv_name").set("required",false);
				}					
				if(dj.byId("account_no").get("value")==="")
				{
					dj.byId("account_id").set("value","");
				}
				if(dj.byId("export_list").get("value") === "")
				{
					dj.byId("account_no").set("disabled",true);
				}
				dj.byId("TransactionSearchForm").submit();
			}				
		},
		
		exportABSummaryListToFormat : function( /*String*/ pdfOption) {
			
			//as options always will be upper case
			// in module files, convert the final option to upper case
			pdfOption = pdfOption.toUpperCase();
			var entityName = dj.byId("entity") ? dj.byId("entity").get("value") : "";
			var url = ["/screen/AccountBalanceScreen?operation=LIST_BALANCES"];
			url.push("&export_list=", pdfOption);
			url.push("&filename=", "AccountSummary.pdf");
			url.push("&in_memory_export=", "true");
			url.push("&type=", "export");
			url.push("&entity=", entityName);
			url.push("&account_no=", dj.byId("account_no").get("value"));
			url.push("&account_ccy=", dj.byId("account_ccy").get("value"));
			url.push("&bank_abbv_name=", dj.byId("bank_abbv_name").get("value"));			
			/* TODO Do we need really a popup just for the download? Can we use the line below? */
			//window.location.href = misys.getServletURL(url.join(""));
			_openPopup(misys.getServletURL(url.join("")));
		},
		
		onFormLoad : function() {
			m.connect("export_list", "onChange", _setExportFileName);
			m.connect("entity", "onBlur", function(){
				dj.byId("account_no").set("value","");
				dj.byId("account_no").set("displayedValue","");					
			});
			m.setValidation("account_ccy", m.validateCurrency);	
			m.toggleRequired("entity", true);
			m.connect("entity", "onChange", _handleEntityOnChangeFields);
			m.connect("bank_abbv_name", "onChange", _handleBankOnChangeFields);
			m.connect("submit", "onClick", m.submit);
			m.connect("account_no", "onChange", function() {
				if(dj.byId("bank_abbv_name") && dj.byId("account_no") && dj.byId("account_no").get("value") !== "")
				{	
					if(dj.byId("bank_abbv_name") && dj.byId("bank_abbv_name").get("value") === '')
					{
						formloading = false;
					}
					dj.byId("bank_abbv_name").set("value", m._config.customerBankName);
				}
			});
			m.connect("account_no", "onBlur", function(){
				if(dj.byId('account_no') && dj.byId('account_id') && dj.byId('account_no').get('value') === "")
				{
					dj.byId("account_id").set("value","");
				}
			});	

			populateBanks();
			if(dj.byId("bank_name_hidden") && dj.byId("bank_name_hidden").get("value") !== '' && dj.byId("bank_abbv_name"))
			{
				if(dj.byId("bank_abbv_name").get("value") === '')
				{
					formloading = false;
				}
				dj.byId("bank_abbv_name").set("value", dj.byId("bank_name_hidden").get("value"));
			}
			m.toggleRequired("entity", true);
			m.toggleRequired("bank_abbv_name", false);
			
			if(dj.byId("account_no").get("value") === "" && formloading === "true")
			{
				m.dialog.show("ERROR", m.getLocalization("accountInputError"));
				return;
			}	
			
		},
		
		checkEntityForAccount : function (/*String*/ name, field, /*String*/ title, /*String*/ view)
		{
			if (dj.byId("entity") && dj.byId("entity").get("value") === "")
			{
				m.dialog.show("ERROR", m.getLocalization("entitynotselected"));
				return;
			}
			misys.showSearchUserAccountsDialog("useraccount", "['','" + name + "','" + field + "','','','','','','','','','','customer_associated_bank']", "", "entity", "", "","width:650px;height:400px;", title, view);
		}		
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.cash.account_summary_search_client');