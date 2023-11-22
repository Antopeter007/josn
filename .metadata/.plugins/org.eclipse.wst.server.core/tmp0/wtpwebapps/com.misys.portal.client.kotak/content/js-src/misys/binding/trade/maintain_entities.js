dojo.provide("misys.binding.trade.maintain_entities");

dojo.require("misys.form.common");
dojo.require("misys.validation.common");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.CheckBox");
dojo.require("dijit.layout.ContentPane");
dojo.require("dojo.data.ItemFileReadStore");
dojo.require("dijit.form.FilteringSelect");
dojo.require("dijit.layout.TabContainer");
dojo.require("dijit.form.DateTextBox");
dojo.require("misys.form.CurrencyTextBox");
dojo.require("dijit.form.NumberTextBox");
dojo.require("dijit.form.FilteringSelect");
dojo.require("misys.form.SimpleTextarea");
dojo.require("misys.widget.Collaboration");


(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode	
	//
	// Private functions & variables
	//

	//
	// Public functions & variables
	
	d.mixin(m._config, {

		initReAuthParams : function() {
									
			var reAuthParams = {
				
					
				productCode : m._config.productCode,	
				subProductCode : '',
				transactionTypeCode : '01',	
				entity : dj.byId("entity") ? dj.byId("entity").get("value") : '',
				currency : '',				
				amount : '',
				option : dj.byId("option") ? dj.byId("option").get("value") : "",
								
				es_field1 : '',
				es_field2 : ''				
			};
			return reAuthParams;
		}
	});
	
} )(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.trade.maintain_entities_client');