/*
 * ---------------------------------------------------------- 
 * Event Binding for Bulk Collection 
 * 
 * Copyright (c) 2000-2011 Misys (http://www.misys.com), All Rights Reserved.
 * 
 * version: 1.0 date: 07/03/11
 * 
 * ----------------------------------------------------------
 */
dojo.provide("misys.binding.cash.create_collection");

dojo.require("dojo.parser");
dojo.require("dijit.layout.TabContainer");
dojo.require("dijit.form.DateTextBox");
dojo.require("misys.form.CurrencyTextBox");
dojo.require("dijit.form.NumberTextBox");
dojo.require("dijit.form.FilteringSelect");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.TextBox");
dojo.require("misys.widget.Dialog");
dojo.require("dijit.ProgressBar");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.CheckBox");
dojo.require("misys.form.PercentNumberTextBox");
dojo.require("misys.form.SimpleTextarea");
dojo.require("misys.widget.Collaboration");
dojo.require("misys.form.common");
dojo.require("misys.form.file");
dojo.require("misys.validation.common");
dojo.require("misys.binding.cash.ft_common");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode
	
	d.mixin(m, {
		
		bind : function()
		{
			
			m.connect("applicant_act_name", "onChange", function() {
				d.byId("display_account").innerHTML =  dj.byId("applicant_act_name").get("value");
			});
			
			m.connect("applicant_collection_act_name", "onChange", function() {
				d.byId("display_to_account").innerHTML =  dj.byId("applicant_collection_act_name").get("value");
			});

			m.connect("sub_product_code", "onChange", function(){
				if(this.get("value") === "COLLE") 
				{
					m.animate("wipeIn", d.byId('display_to_account_row'));
					m.animate("wipeOut", d.byId('display_account_row'));
				} 
				else 
				{
					m.animate("wipeOut", d.byId('display_to_account_row'));
					m.animate("wipeIn", d.byId('display_account_row'));
				}
			});
		},	
		
		onFormLoad : function(){
			
			m.setCurrency(dj.byId("ft_cur_code"), ["ft_amt"]);
			
		},
		
		beforeSubmitValidations : function() {
			// Validate transfer amount should be greater than zero
			if(dj.byId("ft_amt"))
			{
				if(!m.validateAmount((dj.byId("ft_amt"))?dj.byId("ft_amt"):0))
				{
					m._config.onSubmitErrorMsg =  m.getLocalization("amountcannotzero");
					dj.byId("ft_amt").set("value", "");
					return false;
				}
			}
			return true;
		}
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.cash.create_collection_client');