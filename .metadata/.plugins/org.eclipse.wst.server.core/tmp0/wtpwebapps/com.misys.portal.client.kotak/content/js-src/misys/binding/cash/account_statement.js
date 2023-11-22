dojo.provide("misys.binding.cash.account_statement");

dojo.require("misys.form.common");
dojo.require("misys.validation.common");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("misys.widget.Dialog");
dojo.require("dojo.data.ItemFileReadStore");
dojo.require("dojo.data.ItemFileWriteStore");
dojo.require("dijit.form.FilteringSelect");


(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

		"use strict"; // ECMA5 Strict Mode
	
		
		
		
		d.mixin(m, {
			openAdditionalPostingDetails : function(line_id,ref_id,statement_id)
			{
				var urlScreen = "/screen/AjaxScreen/action/AdditionalPostingDetailsAction";
				var query = {};
				var diagTitle = m.getLocalization("additionalPostingDetailsTitle");
				query.ref_id = ref_id;
				query.line_id = line_id;
				query.statement_id = statement_id;
				
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
		

		

	})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.cash.account_statement_client');