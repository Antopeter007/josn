/*
 * ---------------------------------------------------------- 
 * Event Binding for cash pooling structure
 * ----------------------------------------------------------
 */
dojo.provide("misys.binding.cash.create_pooling_structure");
dojo.require("dojo.parser");
dojo.require("dijit.layout.TabContainer");
dojo.require("dijit.form.DateTextBox");
dojo.require("misys.form.CurrencyTextBox");
dojo.require("dijit.form.NumberTextBox");
dojo.require("dijit.form.FilteringSelect");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.Dialog");
dojo.require("dijit.ProgressBar");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.CheckBox");
dojo.require("misys.form.PercentNumberTextBox");
dojo.require("misys.form.SimpleTextarea");
dojo.require("misys.widget.Collaboration");
dojo.require("misys.form.common");
dojo.require("misys.form.file");
dojo.require("misys.validation.common");
dojo.require("misys.form.BusinessDateTextBox");
dojo.require("dijit.layout.BorderContainer");
dojo.require("dojo.data.ItemFileWriteStore");
dojo.require("dijit.form.DateTextBox");
dojo.require("misys.form.CurrencyTextBox");
dojo.require("dijit.form.NumberTextBox");
dojo.require("dijit.form.CheckBox");
dojo.require("dijit.form.FilteringSelect");
dojo.require("dijit.form.Form");
dojo.require("dijit.layout.ContentPane");
dojo.require("dijit.layout.TabContainer");
dojo.require("dojo.io.iframe"); 
dojo.require("dijit.ProgressBar");
dojo.require("dojo.behavior");
dojo.require("dojo.date.locale");
dojo.require("dijit.Tooltip");

dojo.require("misys.grid.DataGrid");
dojo.require("misys.form.SimpleTextarea");
dojo.require("misys.form.common");
dojo.require("misys.validation.common");
dojo.require("misys.layout.FloatingPane");

dojo.require("misys.liquidity.widget.BalGroups");
dojo.require("misys.liquidity.widget.BalGroup");


(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {
	
	"use strict"; // ECMA5 Strict Mode
	
	function _validateEffectiveDate()
	{
		if (dj.byId("effective_date")	&& dj.byId("effective_date").get("value") !== "" && dj.byId("effective_date").get("value") !== null) 
		{
			var value = dj.byId("effective_date").get("value");
			console.debug("validating Effective Date : " + value);
			if (value) 
			{
				if (d.date.compare(value, new Date(), "date") >= 0) 
				{
					return true;
				} 
				else 
				{
					dj.byId('effective_date').set("state", "Error");
					dj.showTooltip(m.getLocalization("liquidityEffectiveDateLessThanCurrentDate"), dj.byId("effective_date").domNode, 0);
					return false;
				}
			}
		}
	}
	
	d.mixin(m, {
		
		bind : function() {		
				
		
			
			m.connect("group_code", "onBlur", function(){
				m.validateGroupCode();
			});
			m.connect("description", "onBlur", function(){
				m.validateDescription();
			});
			
			m.connect("structure_code", "onBlur", function(){
				
				var existingcode=dj.byId("existing_code").get("value");
				var modifiedcode=dj.byId("structure_code").get("value");
				
				if(dj.byId("mode") && (dj.byId("mode").get("value")==="EXISTING" || dj.byId("mode").get("value")==="DRAFT"))
					{
					      if (existingcode !== modifiedcode)
					    	  {
					    	  m.checkStructureCodeExists();
					    	  }
					}
				
				if(dj.byId("mode") && (dj.byId("mode").get("value")==="copy"))
					{
					  m.checkStructureCodeExists();
					}
			});
			m.connect("effective_date", "onBlur", function(){
				var existingdate=dj.byId("existing_eff_date").get("value");
				var modifieddate=dj.byId("effective_date").get("value");
				
				
				if(dj.byId("mode") && (dj.byId("mode").get("value")==="EXISTING" || dj.byId("mode").get("value")==="DRAFT"))
					{
					
							if (d.date.compare(m.localizeDate(dj.byId("existing_eff_date")), modifieddate, "date") != 0) 
							{
								m.checkEffectiveDateExists();
					    		_validateEffectiveDate();
							} 
					     
							
					}
				
				if(dj.byId("mode") && (dj.byId("mode").get("value")==="copy"))
				{
					m.checkEffectiveDateExists();
		    		_validateEffectiveDate();
				}
				
			
			});
			
			m.connect("sub_group_code", "onBlur", function(){
				m.validateSubGroupCode();
			});
			
			m.connect("subgrp_description", "onBlur", function(){
				m.validateSubGrpDescription();
			});
			
			
			m.connect(dj.byId("frequency"), "onChange",  function(){dj.byId("frequency").set("value", this.get("value"));});
			
			m.connect("subGrpType", "onChange", function(){
				//Fork Balance
				if(this.get("value")==="1") {
				dj.byId('low_target').set("disabled",false);
				dj.byId('high_target').set("disabled",false);
				dj.byId('balance_target').set("disabled",false);				
				}
				//Target Balance
				if(this.get("value")==="2") {
					dj.byId('low_target').set("disabled",true);
					dj.byId('high_target').set("disabled",true);
					dj.byId('balance_target').set("disabled",false);
					dj.byId('low_target').setValue(0);
					dj.byId('high_target').setValue(0);
				}
				//Zero Balance
				if(this.get("value")==="3") {
					dj.byId('low_target').set("disabled",true);
					dj.byId('high_target').set("disabled",true);
					dj.byId('balance_target').set("disabled",true);	
					dj.byId('balance_target').setValue(0);
					dj.byId('low_target').setValue(0);
					dj.byId('high_target').setValue(0);
				}
			});
			
			m.connect("high_target", "onBlur", function() {
				m.validateHighTargetBalances();
			});
			m.connect("low_target", "onBlur", function() {
				m.validateLowTargetBalances();
			});
			
		},
		
		beforeSubmitValidations : function() {
			var valid = true;
			var error_message = "";
			var structureCode = dj.byId("structure_code");
			var effDate = dj.byId("effective_date");
			if(structureCode && structureCode.get("value") !== "")
			{
					structureCode.onBlur();
					if(structureCode.get("state") === "Error"){
						error_message += m.getLocalization("mandatorystructureCode");
						valid = false;
						m._config.onSubmitErrorMsg = error_message;
						return valid;
					}
			}
			if(effDate && effDate.get("value") !== "")
			{
					effDate.onBlur();
					if(effDate.get("state") === "Error"){
						error_message += m.getLocalization("mandatoryeffectiveDate");
						valid = false;
						m._config.onSubmitErrorMsg = error_message;
						return valid;
					}
			}
			return valid;
		},
		
		beforeSaveValidations: function() {
			var valid = true;
			var error_message = "";
			var structureCode = dj.byId("structure_code");
			var effDate = dj.byId("effective_date");
			if(structureCode && structureCode.get("value") !== "")
			{
					structureCode.onBlur();
					if(structureCode.get("state") === "Error"){
						error_message += m.getLocalization("mandatorystructureCode");
						valid = false;
						m._config.onSubmitErrorMsg = error_message;
						return valid;
					}
			}
			if(effDate && effDate.get("value") !== "")
			{
					effDate.onBlur();
					if(effDate.get("state") === "Error"){
						error_message += m.getLocalization("mandatoryeffectiveDate");
						valid = false;
						m._config.onSubmitErrorMsg = error_message;
						return valid;
					}
			}
			return valid;
			
		}
		
	});
	
	
	
	d.mixin(m._config, {

		initReAuthParams : function() {
									
			var reAuthParams = {
				productCode : 'LIQ',	
				subProductCode : '',
				transactionTypeCode : '01',	
				entity :'',
				currency : '',				
				amount : '',
								
				es_field1 : '',
				es_field2 : ''				
			};
			return reAuthParams;
		}
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.cash.create_pooling_structure_client');