dojo.provide("misys.binding.trade.create_sr");

dojo.require("misys.form.common");
dojo.require("misys.validation.common");
dojo.require("misys.widget.Collaboration");

// TODO This binding does not appear to be currently used anywhere
(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode
	
	d.mixin(m._config, {

		initReAuthParams : function() {
									
			var reAuthParams = {
				productCode : 'SR',	
				subProductCode : '',
				transactionTypeCode : '01',	
				entity :dj.byId("entity") ? dj.byId("entity").get("value") : '',
				currency : dj.byId("lc_cur_code")? dj.byId("lc_cur_code").get('value') : '',				
				amount : dj.byId("lc_amt") ? m.trimAmount(dj.byId("lc_amt").get('value')) : '',
								
				es_field1 : dj.byId("lc_amt") ? m.trimAmount(dj.byId("lc_amt").get('value')) : '',
				es_field2 : ''				
			};
			return reAuthParams;
		}
	});
	
	// Private functions and variables go here

	// Public functions & variables follow
	d.mixin(m, {

		bind : function() {
			// Optional EUCP flag 
			m.connect("eucp_flag", "onClick", function(){
				m.toggleFields(
						this.get("checked"), 
						null,
						["eucp_details"]);
			});
		},

		onFormLoad : function() {
			// Additional onload events for dynamic fields follow
			var eucpFlag = dj.byId("eucp_flag");
			if(eucpFlag) {
				m.toggleFields(
						eucpFlag.get("checked"), 
						null,
						["eucp_details"]);
			}
		}
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.trade.create_sr_client');