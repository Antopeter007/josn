/*
 * ---------------------------------------------------------- 
 * Event Binding for domestic transfers
 * 
 * Copyright (c) 2000-2012 Misys (http://www.misys.com), All Rights Reserved.
 * 
 * 
 * ----------------------------------------------------------
 */
dojo.provide("misys.binding.openaccount.fscm_financing_request");
dojo.require("misys.form.CurrencyTextBox");
dojo.require("dijit.form.NumberTextBox");
dojo.require("dijit.form.FilteringSelect");
dojo.require("misys.form.common");
dojo.require("misys.validation.common");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.CheckBox");
dojo.require("dijit.layout.ContentPane");
dojo.require("dijit.TooltipDialog");
dojo.require("dojo.data.ItemFileReadStore");
dojo.require("misys.form.SimpleTextarea");
dojo.require("misys.form.file");
dojo.require("misys.widget.Collaboration");
dojo.require("misys.form.PercentNumberTextBox");
dojo.require("misys.openaccount.FormOpenAccountEvents");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {
	d.mixin(m._config, {

		initReAuthParams : function() {
			var reAuthParams = {
								productCode : dj.byId("product_code").get("value"),
			    				transactionTypeCode : "63",
			    				entity : dj.byId("entity")?dj.byId("entity").get("value"):"",			        				
			    				currency : dj.byId("base_cur_code")?dj.byId("base_cur_code").get("value"):"",
			    				amount : m.trimAmount(dj.byId("grand_total")?dj.byId("grand_total").get("value"):""),
			    				es_field1 : m.trimAmount(dj.byId("grand_total")?dj.byId("grand_total").get("value"):""),
			    				es_field2 : ""
				  };
			return reAuthParams;
		}
	});
	
	d.mixin(m, {
		bind : function()
		{
			var theFinanceForm=document.realform;
			console.debug("bind function");
			m.connect("request_no","onClick",function(){
				if(dj.byId("inv_eligible_pct"))
				{
					dj.byId("inv_eligible_pct").set("value", "100");
					dj.byId("inv_eligible_pct").set("required", true);
					theFinanceForm.percentage_value.value=dj.byId("inv_eligible_pct").get("value");
				}
			});
			m.connect("inv_eligible_pct","onBlur",function(){
				if(this.get("value") !== null && !isNaN(this.get("value")))
				{
					if(parseFloat(this.get("value")) <= 100 && (parseFloat(this.get("value")) > 0))
					{
						var convertedAmt = (parseFloat(this.get("value")) * parseFloat(dj.byId("grand_total").get("value").replace(",", ""))) / 100;
						dj.byId("requested_amt").set("value", convertedAmt);
					}
					else
					{
						displayMessage = misys.getLocalization("incorrectPercentage");
						this.set("value", "");
				 		this.set("state","Error");
				 		m.dialog.show("ERROR", m.getLocalization("focusOnErrorAlert"));
				 		m._config.onSubmitErrorMsg =  m.getLocalization("focusOnErrorAlert");
				 		dj.hideTooltip(this.domNode);
				 		dj.showTooltip(displayMessage, this.domNode, 0);
				 		dj.showTooltip(displayMessage, domNode, 0);
					}
					theFinanceForm.percentage_value.value=this.get("value");
				}
				else
				{
					dj.byId("requested_amt").set("value", "");
				}
				m.setCurrency(dj.byId("base_cur_code"), ["requested_amt"]);
			});
		},
		
		onFormLoad : function(){
			var reqAmt;
			if(dj.byId("inv_eligible_pct").get("value") === null || isNaN(dj.byId("inv_eligible_pct").get("value")))
			{
				dj.byId("inv_eligible_pct").set("value", "100");
				reqAmt = dj.byId("grand_total").get("value").replace(",", "");
			}
			else
			{
				reqAmt = (parseFloat(dj.byId("inv_eligible_pct").get("value")) * parseFloat(dj.byId("grand_total").get("value").replace(",", ""))) / 100;
			}
			document.realform.percentage_value.value=dj.byId("inv_eligible_pct").get("value");
			dj.byId("requested_amt").set("value", reqAmt);
			m.setCurrency(dj.byId("base_cur_code"), ["requested_amt"]);
			
		},
		
		initForm : function()
		{
			console.debug("init form function");
		}
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require("misys.client.binding.openaccount.fscm_financing_request_client");