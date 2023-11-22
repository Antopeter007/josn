dojo.provide("misys.binding.system.customer_payee");
/*
 ----------------------------------------------------------
 Event Binding for

 Customer Payee Form, Customer Side.
 Copyright (c) 2000-2011 Misys (http://www.misys.com),
 All Rights Reserved. 
 ----------------------------------------------------------
 */
dojo.require("misys.form.MultiSelect");
dojo.require("dijit.form.FilteringSelect");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.NumberTextBox");
dojo.require("misys.form.CurrencyTextBox");
dojo.require("dijit.form.CheckBox");
dojo.require("dijit.layout.ContentPane");
dojo.require("misys.validation.common");
dojo.require("misys.form.common");
dojo.require("dojox.xml.DomParser");
(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {
	//
	// Private functions & variables
	//
	//
	// Public functions & variables
	//
	
	d.mixin(m._config, {
		
		initReAuthParams : function(){	
			
			var reAuthParams = { 	productCode : 'CP',
			         				subProductCode : '',
			         				transactionTypeCode : dj.byId("tnx_type_code") ? dj.byId("tnx_type_code").get("value") : "01",
			        				entity : '',			        			
			        				currency : '',
			        				amount : '',
			        				
			        				es_field1 : '',
			        				es_field2 : ''
								  };
			return reAuthParams;
		}
	});
	d.mixin(m, {
		bind : function() {
		},
		onFormLoad : function() {
		},
		showHelp: function(/*String */ fldName) {
			var fmtFld = dj.byId(fldName);
			var helpText = dj.byId("help"+"_"+fldName).get("value");
			if(fmtFld){
			
			dijit.hideTooltip(fmtFld.domNode);
			dijit.showTooltip(helpText, fmtFld.domNode, 0);
			}
		}
	});
	m._config = m._config || {};
	d.mixin(m._config, {});
})(dojo, dijit, misys);

//Including the client specific implementation
       dojo.require('misys.client.binding.system.customer_payee_client');