dojo.provide("misys.binding.cash.account_summary");

dojo.require("misys.form.common");
dojo.require("misys.validation.common");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("misys.widget.Dialog");
dojo.require("dojo.data.ItemFileReadStore");
dojo.require("dojo.data.ItemFileWriteStore");
dojo.require("dijit.form.FilteringSelect");


(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

		"use strict"; // ECMA5 Strict Mode
		
		d.subscribe("ready", function(){
			d.query(".dojoxGrid").forEach(function(g){
					m.connect(g.id, "onRowMouseOver", m._config.showBalanceDate);
					m.connect(g.id, "onRowMouseOut",  m._config.hideBalanceDate);
			});
		});
		
		d.mixin(m, {
			
			bind : function(){
				m.setValidation("account_ccy", m.validateCurrency);
				m.setValidation("alert_date2", m.validateAlertDates);
				m.setValidation("alert_date", m.validateAlertDates); 
				m.setValidation("amt_curcode", m.validateCurrency);
			}
		});
		
		d.mixin(m, {
			openAccountDetails : function(accountId)
			{
				var urlScreen = "/screen/AjaxScreen/action/AccountDetailsAction";
				var query = {};
				var diagTitle = m.getLocalization("accountDetailsTitle");
				query.account_id = accountId;
				//m.dialog.show("URL", "", title, null, null, m.getServletURL(urlScreen), null, null, query);
		        
				var dialogAccountDetails = new dj.Dialog({
					id: "account_details_dialog",
		            title: diagTitle,
		            ioMethod: misys.xhrPost,
		            ioArgs: {content: query},
		            href: m.getServletURL(urlScreen),
		            style: "width: 640px;height:auto"
				});
				
				dialogAccountDetails.connect(dialogAccountDetails, "hide", function(e){
				    dj.byId("account_details_dialog").destroy(); 
				});
				
				dialogAccountDetails.show();
			}
		});
		
		d.mixin(m._config, {
			// TODO This seems a very ugly hack. Need to confirm if it's still necessary
			showBalanceDate : function(evt)
			{
				if( (this.store && this.store._items && evt && evt.rowIndex && this.store._items.length >= evt.rowIndex) && this.store._items[evt.rowIndex].i["owner_type"] === "Other Bank" && this.store._items[evt.rowIndex].i["RunningStatement@AvailableBalance@value_date"])
				{
					var date = this.store._items[evt.rowIndex].i["RunningStatement@AvailableBalance@value_date"];
					var formattedDate = date.substring(0,2) + "/" + date.substring(3,5) + "/" + date.substring(8,10);
					var displayMessage = "The balance is as on " + formattedDate;
					dj.showTooltip(displayMessage, evt.cellNode , 0);
				}
				else
				{
					dj.hideTooltip(evt.cellNode);
				}
			},
			
			hideBalanceDate : function(evt)
			{
				dj.hideTooltip(evt.cellNode);
			}
		});
		

	})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.cash.account_summary_client');