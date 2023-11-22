dojo.provide("misys.binding.bank.report_secure_email");
/*
----------------------------------------------------------
Event Binding for

Secure Email(SE) Form, Bank Side.

Copyright (c) 2000-2011 Misys (http://www.misys.com),
All Rights Reserved. 

version:   1.0
date:      11/09/2011
author:    Ramesh M
----------------------------------------------------------
*/

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

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	//
	// Public functions & variables
	//
	d.mixin(m, {
		bind : function() {
		
	// onChange
				
		m.connect("se_type", "onChange", function(){	
			var seTypeValue = this.get("value");
			dj.byId("se_type").set("value", seTypeValue);
			m.toggleFields((seTypeValue !== ""),null,["se_advices_type"]);
		});
		m.connect("entity","onChange",function(){
			if(dj.byId("act_no"))
			{
				dj.byId("act_no").set("value","");
			}
			
		});
		m.connect("account_img", "onClick", function(){
			var companyId = dj.byId("company_id").get("value");
			m.showSearchUserAccountsDialog("companyaccount", "['', 'act_no', '', '','','']", 
					'', 'entity', '', '', 'width:750px;height:400px;', m.getLocalization("ListOfAccountsTitleMessage"),'', companyId);
		
		});
		
		m.connect("clear_img", "onClick", function()
		{
			if(dj.byId("act_no") && dj.byId("act_no").get('value') !== "")
			{
				dj.byId("act_no").set("value", "");
			}
		});
			
},

		onFormLoad : function() {
	
}	
});
})(dojo, dijit, misys);

//Including the client specific implementation
       dojo.require('misys.client.binding.bank.report_secure_email_client');