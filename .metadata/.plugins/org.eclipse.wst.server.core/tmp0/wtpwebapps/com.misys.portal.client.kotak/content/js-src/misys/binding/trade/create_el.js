dojo.provide("misys.binding.trade.create_el");

dojo.require("misys.form.common");
dojo.require("misys.validation.common");
dojo.require("misys.widget.Collaboration");

// TODO This binding does not appear to be currently used anywhere
(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode
	
	d.mixin(m._config, {

		initReAuthParams : function() {
									
			var reAuthParams = {
				productCode : 'EL',	
				subProductCode : '',
				transactionTypeCode : '01',	
				entity :dj.byId("entity") ? dj.byId("entity").get("value") : '',
				currency : dj.byId("el_cur_code")? dj.byId("el_cur_code").get("value"): '',				
				amount : dj.byId("el_amt")? m.trimAmount(dj.byId("el_amt").get("value")) : '',
								
				es_field1 : dj.byId("el_amt")? m.trimAmount(dj.byId("el_amt").get("value")) : '',
				es_field2 : ''				
			};
			return reAuthParams;
		}
	});
		
	// Public functions & variables follow
	d.mixin(m, {

		bind : function() {
			m.connect("eucp_flag", "onClick", function(){
				m.toggleFields(
						this.get("checked"), 
						null,
						["eucp_details"]);
			});
		},

		onFormLoad : function() {
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
       dojo.require('misys.client.binding.trade.create_el_client');