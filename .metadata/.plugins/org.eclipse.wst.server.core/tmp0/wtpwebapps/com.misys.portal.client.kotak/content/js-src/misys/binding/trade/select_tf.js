dojo.provide("misys.binding.trade.select_tf");

dojo.require("dijit.form.FilteringSelect");
dojo.require("dijit.form.Form");
dojo.require("misys.form.file");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.TextBox");
dojo.require("misys.widget.Dialog");
dojo.require("dijit.ProgressBar");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.layout.ContentPane");
dojo.require("misys.form.common");
dojo.require("misys.widget.Collaboration");
dojo.require("misys.validation.common");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {
	d.mixin(m, {
		select : function(submitType){
			switch(submitType){
			 case 'OK':
				var finType =  dj.byId('sub_product_code').get('value');
				if (finType != '')
				{
					dj.byId('realform_featureid').set('value', finType);
					dj.byId('realform').submit();
				}
				else
				{
					m.dialog.show('ERROR', m.getLocalization('mustChooseFinanceType'));
				}
				break;
			 case 'CANCEL':
				document.location.href = m._config.homeUrl;
				return;
				break;
			default:
				break;
			}
		},
		
		onBeforeLoad : function(){
			m.excludedMethods.push({object: m, method: "select"});
		}
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.trade.select_tf_client');