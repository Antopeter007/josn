/*
 * ---------------------------------------------------------- 
 * Event Binding for Local Electronic Payment
 * 
 * Copyright (c) 2000-2011 Misys (http://www.misys.com), All Rights Reserved.
 * 
 * version: 1.0 date: 07/03/11
 * 
 * ----------------------------------------------------------
 */
dojo.provide("misys.binding.bank.report_lep");

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
dojo.require("misys.form.addons");
dojo.require("misys.validation.common");
dojo.require("misys.binding.cash.ft_common");
dojo.require("misys.form.BusinessDateTextBox");
dojo.require("misys.binding.core.beneficiary_advice_common");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {
	
	"use strict"; // ECMA5 Strict Mode
	
	var beneficiary = { };
	beneficiary.fields = [  'beneficiary_name',
	                		'beneficiary_account',
	                		'counterparty_details_name_1',
	                		'beneficiary_address',
	                		'beneficiary_city',
	                		'beneficiary_dom',
	                		'cpty_bank_code',
	                		'cpty_bank_name',
	                		'cpty_bank_swift_bic_code',
	                		'cpty_bank_address_line_1',
	                		'cpty_bank_address_line_2',
	                		'cpty_bank_dom',
	                		'cpty_branch_code',
	                		'cpty_branch_name',
	                		'pre_approved'];
	
	beneficiary.toggleEditable = function()
	{
		d.forEach(this.fields ,function(node, i)
		{
			if (dj.byId(node))
			{
				dj.byId(node).set("readOnly", false);
			}
		});
	};
	
	beneficiary.toggleIBG = function()
	{
		d.forEach(d.query('.IBG'),function(node, i)
		{
			d.style(node,"display","block");
		});
		d.forEach(d.query(".CUR"),function(node, i)
				{
					d.style(node,"display","none");
				});
		m.toggleRequired("cpty_bank_code",true);
		m.toggleRequired("cpty_branch_code",true);
		m.toggleRequired("cpty_bank_name",true);
		m.toggleRequired("cpty_branch_name",true);		
	};
	
	beneficiary.toggleMEPS = function()
	{
		d.forEach(d.query('.MEPS'),function(node, i)
		{
			d.style(node,"display","block");
		});
		d.forEach(d.query(".CUR"),function(node, i)
				{
					d.style(node,"display","none");
				});
		m.toggleRequired("beneficiary_address",true);
		m.toggleRequired("cpty_bank_swift_bic_code",true);
		m.toggleRequired("cpty_bank_name",true);
		m.toggleRequired("cpty_bank_address_line_1",true);		
	};
	
	beneficiary.toggleIAFT = function()
	{
		d.forEach(d.query('.IAFT'),function(node, i)
		{
			d.style(node,"display","block");
		});
	};
	
	/**
	 * Validating bank and branch code for IBG
	 **/
	function _validateBankBranchCode()
	{
		//  summary: 
		//  If bank code and branch code both are populated then validate bank branch code
		var brch_code_field	=	dj.byId("cpty_branch_code"),
			bank_code_field	=	dj.byId("cpty_bank_code"),
			bank_name_field		=	dj.byId("cpty_bank_name"),
			branch_name_field	=	dj.byId("cpty_branch_name"),
			displayMessage  = 	"";
		
		if(bank_code_field && brch_code_field)
		{
			if(!("S" + bank_code_field.get("value") === "S") && !("S" + brch_code_field.get("value") === "S"))
			{
				m.xhrPost( {
					url 		: misys.getServletURL("/screen/AjaxScreen/action/ValidateBankBranchCodeAction") ,
					handleAs 	: "json",
					sync 		: true,
					content 	: {
						bank_code : bank_code_field.get("value"),
						brnch_code : brch_code_field.get("value"),
						internal : 'N'
					},
					load : function(response, args){
						if(response.items.valid === false)
						{
							displayMessage = misys.getLocalization('invalidBankCodeBranchCode', [bank_code_field.get("value"),brch_code_field.get("value")]);
							//focus on the widget and set state to error and display a tooltip indicating the same
							brch_code_field.focus();
							bank_name_field.set("value","");
							branch_name_field.set("value","");
							
							bank_code_field.set("state","Error");
							brch_code_field.set("state","Error");
							dj.hideTooltip(brch_code_field.domNode);
							dj.showTooltip(displayMessage, brch_code_field.domNode, 0);
						}
						else
						{
							console.debug('Validated Bank Branch Code');
							bank_name_field.set("value", response.items.bankName);
							branch_name_field.set("value", response.items.branchName);
						}
					},
					error 		: function(response, args){
						console.error('[Could not validate Bank Code Branch Code] '+ bank_code_field.get("value") + ',' + brch_code_field.get("value"));
						console.error(response);
					}
				});
			}
		}
	}
	
	function _setContractMandatory(/**boolean **/ flag){
		
		if(dj.byId("fx_contract_nbr_1"))
	    {
			m.toggleRequired("fx_contract_nbr_1", flag);
	    }
		if(dj.byId("fx_contract_nbr_amt_1"))
	    {
			m.toggleRequired("fx_contract_nbr_amt_1", flag);
	    }
		
		// show the symbol UI
		var requiredNode = d.byId("fx_contract_nbr_122");
		if(!requiredNode)
		{
			requiredNode = d.create("span", { innerHTML: "*", id:"fx_contract_nbr_122"});
			d.addClass(requiredNode,"required-field-symbol");
		}
		else
		{
			requiredNode = d.byId("fx_contract_nbr_122");
		}
		
		if(flag)
		{
			d.query(dj.byId("fx_contract_nbr_1").domNode.parentNode.childNodes).forEach(function(node,index){
				if(index === 0)
				{
					d.place(requiredNode,node[0],"first");
				}
			});
			
		}
		else
		{
			d.destroy(requiredNode);
		}
	}
	
	d.mixin(m, {
		
		bind : function()
		{
			// binding for tolerance
			m.setValidation("fx_tolerance_rate", m.validateToleranceAndExchangeRate);
			m.setValidation("fx_exchange_rate", m.validateToleranceAndExchangeRate);
			m.setValidation("iss_date", m.validateTransferDate);
			//Bind all recurring payment details fields
			m.bindRecurringFields();
			m.connect("ft_cur_code", "onChange", function(){
				m.setCurrency(this, ["ft_amt"]);
			});			
				
			m.setValidation("ft_cur_code", m.validateCurrency);
			
			m.setValidation("beneficiary_act_cur_code", m.validateCurrency);
			
			m.setValidation("cpty_bank_swift_bic_code", m.validateBICFormat);
			
			m._config.forceSWIFTValidation = true;	
			
			m.connect("beneficiary_name", "onChange", function(){				
				dj.byId("counterparty_details_name_1").set("value", dj.byId("beneficiary_name").get("value"));				
			});
			
			m.connect("cpty_bank_code", "onBlur", _validateBankBranchCode);
			m.connect("cpty_branch_code", "onBlur", _validateBankBranchCode);
			if(dj.byId('fx_rates_type_temp') && dj.byId('fx_rates_type_temp').get('value') !== ''){
				var maxNbrContracts =0;
				if(dj.byId('fx_nbr_contracts') && dj.byId('fx_nbr_contracts').get('value') > 0){
					maxNbrContracts = dj.byId('fx_nbr_contracts').get('value');
				}
				m.bindTheFXTypes(maxNbrContracts, 'Y');
			}
		},	
		/**
		 * Validate the tolerance and exchange rate format. it should be max 4n.7n
		 */
		validateToleranceAndExchangeRate : function()
		{
			var toleranceRate,
			    value,
	            isValid = true;
	            
			if(this && this.get("value") != "")
			{
				value = this.get("value");
				if(isNaN(value))
				{
					m.showTooltip(m.getLocalization("invalidExchangeAndTolerateRate"),
							this.domNode, ["after"]);
					this.state = "Error";
					this._setStateClass();
					dj.setWaiState(this.focusNode, "invalid", "true");
					return false;
				}
				//split the number in decimal point
				toleranceRate = value.split(".");
				// check the first part is it less than four.
				if(toleranceRate[0])
				{
					if(toleranceRate[0].length > 4)
					{
						isValid = false;
					}
				}
				// check for second part
				if(toleranceRate[1])
				{
					if(toleranceRate[1].length > 7)
					{
						isValid = false;
					}
				}
				//check is the value valid
				if(!isValid)
				{
					m.showTooltip(m.getLocalization("invalidExchangeAndTolerateRateLength"),
							this.domNode, ["after"]);
					this.state = "Error";
					this._setStateClass();
					dj.setWaiState(this.focusNode, "invalid", "true");
					return false;
				}
			}
			return true;
			
		},
				
		onFormLoad : function() {
			
					m.setCurrency(dj.byId("ft_cur_code"), ["ft_amt"]);				
					
					d.forEach(d.query(".IBG, .MEPS, .IAFT"),function(node, i)
					{
						d.style(node,"display","none");
					});
					
					if(dj.byId("pre_approved") && dj.byId("pre_approved").get("value") === 'Y')
					{
						d.style("PAB","display","inline");
					}
					d.forEach(d.query(".CUR"),function(node, i)
							{
								d.style(node,"display","none");
							});
					beneficiary.toggleEditable();
					
					m.setApplicantReference();	
					
				if(dj.byId("bank_img"))
				{
					d.style("bank_img","display","none");						
				}
				if(dj.byId("bank_iso_img"))
				{
					d.style("bank_iso_img","display","none");		
				}	
				if(d.byId("fx-section"))
				{
					//show fx section if previously enabled (in case of draft)
					if((dj.byId("fx_exchange_rate_cur_code") && dj.byId("fx_exchange_rate_cur_code").get("value")!== "")|| (dj.byId("fx_total_utilise_cur_code") && dj.byId("fx_total_utilise_cur_code").get("value")!== ""))
					{
							m.animate("wipeIn", d.byId('fx-section'));											
					}
					else
					{
						d.style("fx-section","display","none");
					}
				}	
				//Show saved Recurring Payment details section
				m.showSavedRecurringDetails(false);
				
					m.initForm();
					if(dj.byId('fx_rates_type_temp') && dj.byId('fx_rates_type_temp').get('value') !== ''){
						m.onloadFXActions();
					}
		},
		initForm : function()
		{
			if(dj.byId("sub_product_code").get("value") === "IAFT")
			{
				beneficiary.toggleIAFT();
				d.forEach(d.query(".CUR"),function(node, i) {
					d.style(node,"display","inline");
				});
			}
			else if(dj.byId("sub_product_code").get("value") === "IBG")
			{
				beneficiary.toggleIBG();
			}
			else if(dj.byId("sub_product_code").get("value") === "MEPS")
			{
				beneficiary.toggleMEPS();
			}
		}
	});
	d.ready(function(){		
		m._config.clearOnSecondCall = false;		
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.bank.report_lep_client');