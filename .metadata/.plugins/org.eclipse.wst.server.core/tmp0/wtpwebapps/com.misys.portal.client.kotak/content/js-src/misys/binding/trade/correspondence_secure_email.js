dojo.provide("misys.binding.trade.correspondence_secure_email");

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
dojo.require("misys.form.file");
dojo.require("misys.form.SimpleTextarea");
dojo.require("misys.widget.Collaboration");
dojo.require("misys.form.common");
dojo.require("misys.validation.common");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode
	
	d.mixin(m._config, {

		initReAuthParams : function() {
									
			var reAuthParams = {
				productCode : 'SE',	
				subProductCode : '',
				transactionTypeCode : '01',	
				entity : dj.byId("entity") ? dj.byId("entity").get("value") : '',
				currency : '',				
				amount : '',
								
				es_field1 : '',
				es_field2 : ''				
			};
			return reAuthParams;
		}
	});
	  
	function _getTopics(){
		var bank = dj.byId("issuing_bank_abbv_name") ? dj.byId("issuing_bank_abbv_name").get("value") : "";
		m.xhrPost({
			url : m.getServletURL("/screen/AjaxScreen/action/GetTopicsForBank"),
			handleAs : "json",
			content : {
			      bank : bank
			},
			load : _populateTopics,
		    customError : function(response, ioArgs) {

		            //fncMyErrorCallback(response) ; 
		    	 console.error('[misys.binding.trade.correspondence_secure_email] Technical error while getting Topics for Bank', response);
		    }		    
		});
	}
	function _populateTopics(response, ioArgs)
	{
	    var availableTopics = dj.byId("topic");
	    var index = 1;
	     availableTopics.store = new d.data.ItemFileReadStore({ data: response});		    
	} 
	// Public functions & variables follow
	d.mixin(m, {		

		bind : function() {
		
			if(dj.byId("bank_abbv_name"))	
			{
				dj.byId("bank_abbv_name").set("value", "");
			}
				var customerBankName = "" ;
				m.connect("issuing_bank_abbv_name", "onChange", m.populateReferences);
				m.connect("issuing_bank_abbv_name", "onChange", function(){
					_getTopics();
					var customer_bank = dj.byId("issuing_bank_abbv_name").get("value"); 
					if(dj.byId("bank_abbv_name"))
					{
						dj.byId("bank_abbv_name").set("value", customer_bank);
					}
				});

					m.connect("entity", "onChange",function(){
						if(dj.byId("issuing_bank_abbv_name"))
						{
							dj.byId("issuing_bank_abbv_name").onChange();
						}
					});						
				m.connect("issuing_bank_customer_reference","onChange",function(){
				     //set applicant reference
				     if(dj.byId("applicant_reference"))
				     {
				      var reference = this.get("value");
				      dj.byId("applicant_reference").set("value",reference);
				     }
				    });	
		},

		onFormLoad : function() {	
							
				var issuingBankCustRef = dj.byId("issuing_bank_customer_reference_temp");
				var tempReferenceValue;
				if(issuingBankCustRef){
					tempReferenceValue = issuingBankCustRef.value;
				}
				// Populate references
				var issuingBankAbbvName = dj.byId("issuing_bank_abbv_name");
				if(issuingBankAbbvName)
				{
					issuingBankAbbvName.onChange();
				}
				issuingBankCustRef =  dj.byId("issuing_bank_customer_reference");
				if(issuingBankCustRef)
				{
					issuingBankCustRef.onChange();
					issuingBankCustRef.set('value',tempReferenceValue);
				}
		}
	});
})(dojo, dijit, misys);//Including the client specific implementation
dojo.require('misys.client.binding.trade.correspondence_secure_email_client');