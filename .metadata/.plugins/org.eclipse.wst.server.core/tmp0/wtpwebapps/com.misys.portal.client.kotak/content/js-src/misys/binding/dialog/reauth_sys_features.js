dojo.provide("misys.binding.dialog.reauth_sys_features");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode
	
	m._config 				= m._config || {};
	m._config.reAuthParams 	=  m._config.reAuthParams || {
															productCode 		: "",
															subProductCode 		: "",
															transactionTypeCode : "",
															entity 				: "",			        			
															currency 			: "",
															amount 				: "",
															es_field1 			: "",			        						
															es_field2 			: ""
														  };
														  
	d.mixin(m._config, {

		doReauthSubmit : function(navForm) {

			m._config.sf_submit_form = m._config.sf_submit_form || {};
			m._config.sf_submit_form = navForm;

			var paramsReAuth = {};
			if (d.isFunction(m._config.initReAuthParams)) {
				paramsReAuth = m._config.initReAuthParams();
				m.checkAndShowReAuthDialog(paramsReAuth);
			} else {
				console.error(response);
				m.setContentInReAuthDialog("ERROR", "");
				dj.byId("reauth_dialog").show();
			}
		},

		reauthSubmit : function() {

			var valueToEE = dj.byId("reauth_password").get("value");

			//Add the above values to form
			var navForm = m._config.sf_submit_form;
			d.create("input", {id:'reauth_otp_response',name :'reauth_otp_response',type:'hidden',value:valueToEE,dojoType:'dijit.form.TextBox',readOnly:'true'},navForm.domNode);
			d.create("input", {id:'reauth_password',name :'reauth_password',type:'hidden',value:valueToEE,dojoType:'dijit.form.TextBox',readOnly:'true'},navForm.domNode);
			navForm.submit();
		},
		
		nonReauthSubmit : function() {
			//Add the above values to form
			var navForm = m._config.sf_submit_form;

			navForm.submit();
		},
		
		initReAuthParams : function() {	
			return m._config.reAuthParams;
		},
		
		setReAuthParams : function(/*String */ productCode, /*String */ subProductCode, /*String */ transactionTypeCode, /*String */ es_field1, /*String */ es_field2){
			m._config.reAuthParams.productCode 			= productCode;
			m._config.reAuthParams.subProductCode 		= subProductCode;
			m._config.reAuthParams.transactionTypeCode 	= transactionTypeCode;
			m._config.reAuthParams.es_field1 			= es_field1;
			m._config.reAuthParams.es_field2		 	= es_field2;
		}
				
		
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.dialog.reauth_sys_features_client');