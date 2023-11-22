/*
 * ---------------------------------------------------------- 
 * Event Binding for Internal transfers
 * 
 * Copyright (c) 2000-2012 Misys (http://www.misys.com), All Rights Reserved.
 * 
 * version: 1.0 date: 23/10/2012
 * 
 * ----------------------------------------------------------
 */
dojo.provide("misys.binding.cash.select_payee_service");

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
dojo.require("misys.binding.cash.ft_common");
dojo.require("misys.form.BusinessDateTextBox");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode
	var payeeData= null;
	function _setPayee()
	{
		
		
		dj.byId("biller").set("value","");
		
			dj.byId("biller").store = new dojo.data.ItemFileReadStore({
				data :{
					identifier : "value",
					label : "name",
					items : m._config.payeeCollection
				}
			});
		
	}
	
	d.mixin(m._config, {});
	
	d.mixin(m, {
	bind : function()
	{
		m.connect("biller", "onChange", function(){
			dj.byId("service").set('value','');
			//var serviceCollection = [];
			var serviceElements =  misys._config.serviceCollection[dj.byId("biller").get("value")];
		/*	for (var i=0; i < serviceElements.length; i++) {
				
				var obj = serviceElements[i];
				serviceCollection.push(obj);

			}
*/

			dj.byId("service").store = new dojo.data.ItemFileReadStore({
				data :{
					identifier : "value",
					label : "name",
					items : serviceElements
				}
			});
		});
		m.connect("bank", "onChange", function(){
			dj.byId("biller").set("value",'');
			dj.byId("service").set("value",'');
			var bankName = dj.byId("bank").get("value");
			
			var billerField = dj.byId("biller");
			if(dj.byId("bank").get("value")!==''){
				dj.byId("biller").set("disabled", false);
			}
			payeeData = misys._config.bankBillerService[bankName];
			if(payeeData){
				billerField.store = new dojo.data.ItemFileReadStore({
					data :{
						identifier: 'name',
						items: payeeData
					}
				});
				billerField.fetchProperties =
				{
					sort : [
					{
						attribute : "name"
					} ]
				};
			}
			
		});
		
		m.connect("biller","onChange", function(){
 			var serviceData=null;
 			var serviceField = dj.byId("service");
 			var payeeCode;
 			dj.byId("service").set("disabled", false);
 			for(var i=0; i<payeeData.length; i++){
 				var obj = payeeData[i];
 				if(obj.name[0] === dj.byId("biller").get("value")){
 					payeeCode = payeeData[i].value;
 				}
 			}
 			serviceData = misys._config.bankPayeeService[payeeCode];
 			if(serviceData){
 				serviceField.store = new dojo.data.ItemFileReadStore({
					data :{
						identifier: 'value',
						label:'name',
						items: serviceData
					}
				});
 				serviceField.fetchProperties =
				{
					sort : [
					{
						attribute : "name"
					} ]
				};
			}
		});
	},
	billService : function(){
	    var selectedService = dijit.byId('service').get('value');
	    if(selectedService)
	    	{
			    var featurefld = dijit.byId('featureid');
			    if (featurefld) {
			        featurefld.set('value', selectedService);
			    }
			    var theRealForm = document.realform.submit();
	    	}
	    else
	    	{
	    		m.showTooltip(m.getLocalization('requiredToolTip'), d.byId('service'),0);
	    	}
	},
	onFormLoad : function(){
		_setPayee();
		// Prevent the confirmation message from popping up
		 
		 if(misys._config.isMultiBank && dj.byId("bank") && dj.byId("bank").get("value")==='')
			 {
			 			dj.byId("biller").set("disabled", true);
			 			dj.byId("service").set("disabled", true);
			 }
		 m.excludedMethods.push({object: m, method: "billService"});
	}
	
	}
	);
}
)(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.cash.select_payee_service_client');