/*
 * ---------------------------------------------------------- 
 * Event Binding for Fund Transfer
 * 
 * Copyright (c) 2000-2011 Misys (http://www.misys.com), All Rights Reserved.
 * 
 * version: 1.0 date: 07/03/11
 * ----------------------------------------------------------
 */
dojo.provide("misys.binding.cash.ft_common");

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
dojo.require("misys.binding.cash.recurring_common");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {
	
	"use strict"; // ECMA5 Strict Mode
	
	function _showContent2()
	{
		m.animate("wipeIn", d.byId('content2'), m.initForm);		
	}
	
	d.mixin(m, {
	
		toggleSections : function() 
		{
			m.animate("wipeOut", d.byId('content1'), _showContent2);
		},

		resetFields : function(intrmdFields) 
		{
			d.forEach(intrmdFields,function(field){
				dj.byId(field).reset(); 
			});
		},
		
		setApplicantReference : function()
		{
			if (dj.byId('applicant_reference') && dj.byId('issuing_bank_abbv_name') && dj.byId('entity') && dj.byId('entity').get('value') !== '')
			{
				var entityName = dj.byId('entity').get('value');
				entityName = (entityName === undefined || entityName === '*') ? "" : entityName;
				var key = dj.byId('issuing_bank_abbv_name').get('value') + '_' + entityName;
				if(m._config.customerReferences && m._config.customerReferences[key])
				{
					dj.byId('applicant_reference').set('value', m._config.customerReferences[key][1]);
				}
			}
		},
		
		/**
		 * <h4>Summary:</h4>
		 * This method prepares the related Customer banks for the selected Group customer entities.
		 * This field is expected to be disabled until the selection of Entity field.
		 */
		populateCustomerBanks : function(isFormLoading)
		{
			var onFormLoad = isFormLoading?true:false;
			var entityField = dj.byId("entity");
			var entityFieldValue = dj.byId("entity")?dj.byId("entity").get('value'):"";
			var customerBankField = dj.byId("customer_bank");
			
			if(entityFieldValue && customerBankField)
			{
				var entityBanksDataStore = null;
				if(entityFieldValue !== "")
				{
					entityBanksDataStore = m._config.entityBanksCollection[entityFieldValue];
				}
				customerBankField.set('disabled', false);
				customerBankField.set('required', true);
				if(!onFormLoad)
				{
					customerBankField.set('value', "");
				}
				
				if (entityBanksDataStore)
				{
					customerBankField.store = new dojo.data.ItemFileReadStore(
					{
						data :
						{
							identifier : "value",
							label : "name",
							items : entityBanksDataStore
						}
					});
					customerBankField.fetchProperties =
					{
						sort : [
						{
							attribute : "name"
						} ]
					};
				}
				else
				{
					customerBankField.store = new dojo.data.ItemFileReadStore({
						data :
						{
							identifier : "value",
							label : "name",
							items : [{ value:"*", name:"*"}]
						}
					});
					customerBankField.set('value', "*");
				}
				
			}
			else if(customerBankField && customerBankField.get("value") === "")
			{
				var customerBankDataStore = null;
				customerBankDataStore = m._config.wildcardLinkedBanksCollection["customerBanksForWithoutEntity"];
				
				if (customerBankDataStore)
				{	
					customerBankField.store = new dojo.data.ItemFileReadStore({
						data :
						{
							identifier : "value",
							label : "name",
							items : customerBankDataStore
						}
					});
					customerBankField.fetchProperties =
					{
						sort : [
						{
							attribute : "name"
						} ]
					};
				}	
			}
			else if(customerBankField)
			{
				customerBankField.set('disabled', true);
				customerBankField.set('required', false);
				customerBankField.set('value', "");
			}
		},
		
		checkNickName:function(){
			var appNickname = dj.byId("applicant_act_nickname");
			if(appNickname && appNickname.value!=="" && appNickname.value!==undefined && appNickname.value!=="null"){
				dj.byId("applicant_act_name").set("value", appNickname.value);
			}
		},
		
		checkNickNameDiv: function(){
			if(misys._config.nickname==="true"){
				if(dj.byId("applicant_act_nickname") && dj.byId("applicant_act_nickname").get("value")!==""  && d.byId("nickname") && d.byId("applicant_act_nickname_row")){
					d.style("nickname", "display", "inline");
					d.style("label", "display", "inline-block");
					d.byId("nickname").innerHTML = dj.byId("applicant_act_nickname").get("value");
					m.animate("fadeIn", d.byId("applicant_act_nickname_row"));
				}else{
					if(d.byId("nickname")){
						d.style("nickname", "display", "none");	
						d.style("applicant_act_nickname_row", "display", "none");
					}
				}
			}
			if(misys._config.beneficiarynickname==="true"){
				if(d.byId("beneficiarynickname")){
					d.style("beneficiarynickname", "display", "none");	
					m.animate("fadeOut", d.byId("beneficiary_nickname_row"));
				}
			}	
			if(misys._config.beneficiarynickname==="true" && dijit.byId("subproductcode").get("value")==="INT"){
				if(d.byId("beneficiary_name_nickname_row")){
					d.style("ben_nickname", "display", "none");
					dijit.byId("beneficiary_act_nickname").set("value", "");
					m.animate("fadeOut", d.byId("beneficiary_name_nickname_row"));
				}
			}
		},
		
		populateReportingStatus: function()
		  {
		   var prodStatCodeField = dj.byId("prod_stat_code");
		    if(prodStatCodeField && prodStatCodeField.get("value") === '02')
		    {
		     dj.byId("bo_ref_id").set("value", "");
		     dj.byId("bo_comment").set("value", "");
		     m.toggleRequired("bo_ref_id",false);
		     dj.byId("bo_ref_id").set("disabled", false);
		     dj.byId("bo_ref_id").set("readOnly", false);
		     m.animate("wipeOut", d.byId("bo_comment_row"));
		     m.animate("wipeOut", d.byId("bo_ref_id_row"));
		     dj.byId("bo_ref_id").set("readOnly", false);
		     dj.byId("bo_ref_id").set("disabled", false);
		    }
			else if(prodStatCodeField && prodStatCodeField.get("value") === '01')
			{
				m.animate("wipeIn", d.byId("bo_comment_row"));
				m.animate("wipeIn", d.byId("bo_ref_id_row"));
				dj.byId("bo_ref_id").set("value", "");
				dj.byId("bo_comment").set("value", "");
				m.toggleRequired("bo_ref_id",false);
				dj.byId("bo_ref_id").set("readOnly", true);
				dj.byId("bo_ref_id").set("disabled", true);
			}
			else
		    {
		     m.animate("wipeIn", d.byId("bo_comment_row"));
		     m.animate("wipeIn", d.byId("bo_ref_id_row"));
		     m.toggleRequired("bo_ref_id",true);
		     dj.byId("bo_ref_id").set("readOnly", false);
		     dj.byId("bo_ref_id").set("disabled", false);
		    }
		   
		  }	
		
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.cash.ft_common_client');