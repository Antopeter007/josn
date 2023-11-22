dojo.provide("misys.binding.core.bk_error_file_upload");


dojo.require("dojo.data.ItemFileReadStore");
dojo.require("dijit.form.FilteringSelect");
dojo.require("misys.validation.login");
dojo.require("misys.form.MultiSelect");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("misys.form.common");
dojo.require("misys.validation.common");
dojo.require("misys.form.CurrencyTextBox");
dojo.require("dojox.xml.DomParser");
dojo.require("dojox.grid.EnhancedGrid");
dojo.require("dojox.grid.enhanced.plugins.IndirectSelection");
dojo.require("dojox.grid.enhanced.plugins.Filter");

//TODO - Add method level comments and run lint

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {
	
	dojo.ready(function(){
		//	m.connect("showHideFailedRecords", "onClick", _showHideFailedRecords);
			dojo.mixin(m, {
				toggleFailedRecordsGrid : function(){
					var downArrow = d.byId("actionDown");
					var upArrow = d.byId("actionUp");
					var failedRecDiv = d.byId("failedRecords");
					if(d.style("failedRecords","display") === "none")
					{
						m.animate('wipeIn',failedRecDiv);
						d.style('actionDown',"display","none");
						d.style('actionUp',"display","block");
						d.style('actionUp', "cursor", "pointer");
					}
					else
					{
						m.animate('wipeOut',failedRecDiv);
						d.style('actionUp',"display","none");
						d.style('actionDown',"display","block");
						d.style('actionDown', "cursor", "pointer");
					}
				},

			toggleSuccessfulRecordsGrid : function(){
				var downArrow = d.byId("actionDown");
				var upArrow = d.byId("actionUp");
				var successfulRecDiv = d.byId("successfulRecords");
				if(d.style("successfulRecords","display") === "none")
				{
					m.animate('wipeIn',successfulRecDiv);
					d.style('actionDown',"display","none");
					d.style('actionUp',"display","block");
					d.style('actionUp', "cursor", "pointer");
				}
				else
				{
					m.animate('wipeOut',successfulRecDiv);
					d.style('actionUp',"display","none");
					d.style('actionDown',"display","block");
					d.style('actionDown', "cursor", "pointer");
				}
			}
			});
		});
	
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.core.bk_error_file_upload_client');