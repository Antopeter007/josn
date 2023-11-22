/**
 * 
 *//**
 * 
 */dojo.provide("misys.binding.openaccount.financing_request_ip");
/*
-----------------------------------------------------------------------------
Scripts for the list def binding for Invoice Payable
Copyright (c) 2000-2016 Misys (http://www.misys.com),
All Rights Reserved. 

version:   1.0
date:      18/01/2017
author:		Meenal Sahasrabudhe
-----------------------------------------------------------------------------
*/
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
dojo.require("dijit.form.FilteringSelect");
dojo.require("dojo.data.ItemFileReadStore");
dojo.require("misys.form.SimpleTextarea");
dojo.require("misys.form.file");
dojo.require("misys.widget.Collaboration");
dojo.require("misys.form.PercentNumberTextBox");
(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {
	
		
	d.mixin(m._config, {

		initReAuthParams : function() {

			var reAuthParams = { 	productCode : dj.byId("product_code").get("value"),
									subProductCode : dj.byId("sub_product_code") ? dj.byId("sub_product_code").get("value") :"",
				    				transactionTypeCode : "63",
				    				entity : dj.byId("entity")?dj.byId("entity").get("value"):"",			        				
				    				currency : dj.byId("finance_requested_cur_code")?dj.byId("finance_requested_cur_code").get("value"):"",
				    				amount : m.trimAmount(dj.byId("finance_requested_amt")?dj.byId("finance_requested_amt").get("value"):""),
				    				
				    				es_field1 : m.trimAmount(dj.byId("finance_requested_amt")?dj.byId("finance_requested_amt").get("value"):""),
				    				es_field2 : ""
				  };
			return reAuthParams;
		}
	});
	
	d.mixin(m, {
			bind : function() {
			m.connect("request_no","onClick",function(){
				if(dj.byId("inv_eligible_cur_code"))
				{
					dj.byId("inv_eligible_cur_code").set("value", dj.byId("total_net_amt").get("value"));
				}
				if(dj.byId("inv_eligible_pct"))
				{
					dj.byId("inv_eligible_pct").set("value", "");
					dj.byId("inv_eligible_pct").set("required", true);
				}
				if(dj.byId("finance_requested_amt"))
				{
					dj.byId("finance_requested_amt").set("value", "");
					dj.byId("finance_requested_amt").set("required", false);
				}
				if(dj.byId("liab_total_net_amt"))
				{
					dj.byId("liab_total_net_amt").set("value", "");
					dj.byId("liab_total_net_amt").set("required", false);	
				}
			});
			if(dj.byId("inv_eligible_cur_code"))
			{
				m.setCurrency(inv_eligible_cur_code, ["inv_eligible_amt"]);
			}
			m.connect("inv_eligible_pct","onChange",function(){
				if(this.get("value") !== null && !isNaN(this.get("value")) && parseFloat(this.get("value")) <= 100 && parseFloat(this.get("value")) > 0)
				{
					var invOutstandingAmt = parseFloat(dj.byId("invoice_outstanding_amt").get("value").replaceAll(",", ""));
					var convertedAmt, outStandingAmt;
					var cashCustomizationEnable = dj.byId("cashCustomizationEnable").get("value");
					// MPS-75123 - As per new changes eligible amount will always be equal to outstanding amount.
					if(cashCustomizationEnable === "true" && dj.byId("total_discount") && dj.byId("total_discount").get("value")!=null)
					{	
						var totalDiscountAmt = parseFloat(dj.byId("total_discount").get("value").replace(",", ""));
						invOutstandingAmt = invOutstandingAmt-totalDiscountAmt;
						convertedAmt = (parseFloat(this.get("value")) * invOutstandingAmt) / 100;
					}
					else
					{
						convertedAmt = (parseFloat(this.get("value")) * invOutstandingAmt) / 100;
					}
					dj.byId("finance_requested_amt").set("value", convertedAmt);
					dj.byId("liab_total_net_amt").set("value", invOutstandingAmt);
				}
				else
				{
					displayMessage = misys.getLocalization("incorrectPercentage");
					dj.byId("finance_requested_amt").set("value", "");
					dj.byId("liab_total_net_amt").set("value", "");
					this.set("value", "");
			 		this.set("state","Error");
			 		m.dialog.show("ERROR", m.getLocalization("focusOnErrorAlert"));
			 		m._config.onSubmitErrorMsg =  m.getLocalization("focusOnErrorAlert");
			 		dj.hideTooltip(this.domNode);
			 		dj.showTooltip(displayMessage, this.domNode, 0);
				}
				m.setCurrency(dj.byId("finance_requested_cur_code"), ["finance_requested_amt"]);
				m.setCurrency(dj.byId("liab_total_net_cur_code"), ["liab_total_net_amt"]);
			});
		},
		onFormLoad : function() {
			m.setCurrency(dj.byId("finance_requested_cur_code"), ["finance_requested_amt"]);
			m.setCurrency(dj.byId("liab_total_net_cur_code"), ["liab_total_net_amt"]);
		},
	beforeSubmitValidations : function() {
		
		var valid = true;
		var error_message = "";
		var freeFormatText = dj.byId("free_format_text") ;
		var prodCode = dj.byId("product_code");
		
		//Fixed as part of MPS-53041, Messages -> Finance Request, customer Instructions text area is mandatory, hence validating that field before submitting
		if((prodCode && prodCode.get("value") == 'IP') && (freeFormatText && dojo.string.trim(freeFormatText.get("value")) === ""))
	    {
			freeFormatText.set("required",true);
			freeFormatText.focus();
			valid = false;
	    }
	    else
	    {
	        valid = true;
	    }
		m._config.onSubmitErrorMsg = error_message;
		return valid;
		
	}
  });
})(dojo, dijit, misys);
//Including the client specific implementation
       dojo.require("misys.client.binding.openaccount.financing_request_ip_client");