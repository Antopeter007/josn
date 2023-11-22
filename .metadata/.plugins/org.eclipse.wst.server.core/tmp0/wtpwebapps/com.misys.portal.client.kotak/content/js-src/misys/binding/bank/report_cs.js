dojo.provide("misys.binding.bank.report_cs");

dojo.require("misys.form.common");
dojo.require("misys.validation.common");
dojo.require("misys.form.file");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.TextBox");
dojo.require("misys.widget.Dialog");
dojo.require("dijit.ProgressBar");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.CheckBox");
dojo.require("dijit.layout.ContentPane");
dojo.require("dijit.form.DateTextBox");
dojo.require("misys.form.CurrencyTextBox");
dojo.require("dijit.form.CheckBox");
dojo.require("dijit.form.FilteringSelect");
dojo.require("misys.form.addons");
dojo.require("misys.form.SimpleTextarea");
dojo.require("dojo.data.ItemFileReadStore");
dojo.require("misys.widget.Collaboration");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {
	
	d.mixin(m, {
		
		  bind : function() {
				// Making Bank Reference Non mandatory in case of Not Processed
				m.connect("prod_stat_code","onChange",function(){
					if(dj.byId("bo_ref_id")){
						var prodStatCodeValue = dj.byId("prod_stat_code").get('value');
						if(prodStatCodeValue === '01')
							{
								dj.byId("bo_ref_id").set("readOnly", true);
								dj.byId("bo_ref_id").set("disabled", true);
								m.toggleRequired(dj.byId("bo_ref_id"), false);
							}
						else 
							{
								dj.byId("bo_ref_id").set("readOnly", false);
								dj.byId("bo_ref_id").set("disabled", false);
								m.toggleRequired(dj.byId("bo_ref_id"), true);
							}
					}
				});
		  },

		  onFormLoad : function() {
			  //Make bo_ref_id not mandatory in case of Not Processed
				if(dj.byId("prod_stat_code") && dj.byId("bo_ref_id")){
					
					var prodStatCodeValue = dj.byId("prod_stat_code").get('value');
					if(prodStatCodeValue === '01')
						{
							dj.byId("bo_ref_id").set("readOnly", true);
							dj.byId("bo_ref_id").set("disabled", true);
							m.toggleRequired(dj.byId("bo_ref_id"), false);
						}
				}
		  }
		});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.bank.report_cs_client');