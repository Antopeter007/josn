dojo.provide("misys.binding.trade.message_clean");
/*
 -----------------------------------------------------------------------------
 Scripts for the system Banks Data Maintenance (Customer Side) page.
 
 Note: the function fncFormSpecificValidation is required

 Copyright (c) 2000-2010 Misys (http://www.misys.com),
 All Rights Reserved. 

 version:   1.0
 date:      02/03/11
 -----------------------------------------------------------------------------
 */

dojo.require("misys.form.common");
dojo.require("misys.validation.common");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.CheckBox");
dojo.require("dijit.layout.ContentPane");
dojo.require("dojo.data.ItemFileReadStore");
dojo.require("misys.form.SimpleTextarea");
dojo.require("dijit.form.DateTextBox");
dojo.require("dijit.form.FilteringSelect");
dojo.require("dijit.layout.TabContainer");
dojo.require("dijit.form.DateTextBox");
dojo.require("misys.form.CurrencyTextBox");
dojo.require("dijit.form.NumberTextBox");
dojo.require("misys.form.file");
dojo.require("misys.widget.Collaboration");
dojo.require("misys.widget.Dialog");
dojo.require("dijit.ProgressBar");
dojo.require("dijit.layout.TabContainer");
dojo.require("misys.form.CurrencyTextBox");
dojo.require("dijit.form.FilteringSelect");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {
	
	
	d.mixin(m._config, {

		initReAuthParams : function() {
									
			var reAuthParams = {
				productCode : 'LC',	
				subProductCode : '',
				transactionTypeCode : "13",	
				entity :dj.byId("entity") ? dj.byId("entity").get("value") : "",
				currency : dj.byId("lc_cur_code").get('value'),				
				amount : m.trimAmount(dj.byId("lc_amt").get('value')),
								
				es_field1 : m.trimAmount(dj.byId("lc_amt").get('value')),
				es_field2 : ''				
			};
			return reAuthParams;
		}
	});
	
	function _clearRequiredFields(message){
	 	var callback = function() {
	 		var widget = dijit.byId("debit_amt");
		 	widget.set("state","Error");
	 		m.defaultBindTheFXTypes();
		 	dj.byId('debit_amt').set('value', '');
		 	//dj.byId('debit_cur_code').set('value', '');
		 	dj.byId('principal_act_name').set('value', '');
		 	dj.byId('principal_act_cur_code').set('value', '');
		 	dj.byId('principal_act_no').set('value', '');
		 	dj.byId('principal_act_description').set('value', '');
		 	dj.byId('principal_act_pab').set('value', '');
		};
		m.dialog.show("ERROR", message, '', function(){
			setTimeout(callback, 500);
		});
	}
	
	function _validateDebitAmt(){
		   var debitAmt = dj.byId('debit_amt');
			if(dj.byId('document_amt') && dj.byId('document_amt').get('value')!=='' && debitAmt.get('value') !== '' && debitAmt.get('value') > dj.byId('document_amt').get('value'))
			{
				var displayMessage = misys.getLocalization('debitAmtLessThanDocumentAmt', [debitAmt.get('value'),dj.byId('document_amt').get('value')]);
				var domNode = debitAmt.domNode;
				debitAmt.set("state","Error");
				dj.showTooltip(displayMessage, domNode, 0);
				var hideTT = function() {
					dj.hideTooltip(domNode);
				};
				var timeoutInMs = 2000;
				setTimeout(hideTT, timeoutInMs);
			}
	   }
	
   d.mixin(m._config, {		
		initReAuthParams : function(){	
			
			var reAuthParams = { 	productCode : m._config.productCode,
			         				subProductCode : '',
			        				transactionTypeCode : '13',
			        				entity : dj.byId("entity") ? dj.byId("entity").get('value') : "",			        				
			        				currency : dj.byId("lc_cur_code").get('value'),
			        				amount : m.trimAmount(dj.byId("document_amt").get('value')),
			        				
			        				es_field1 : m.trimAmount(dj.byId("document_amt").get('value')),
			        				es_field2 : ''
								  };
			return reAuthParams;
		}
	});
	   
	   
	d.mixin(m, {
		
		fireFXAction : function(){
			if(m._config.fxParamData && m._config.fxParamData[m._config.productCode].fxParametersData.isFXEnabled === 'Y'){
			var fromCurrency,toCurrency,masterCurrency;
			var debitCurrency = dj.byId('debit_cur_code').get('value');
			var amount = dj.byId('debit_amt').get('value');
			var PrincipalAcctCurrency = dj.byId('principal_act_cur_code').get('value');
			var productCode = m._config.productCode;
			var isDirectConversion = false;
			var bankAbbvName = '';
			if(dj.byId('issuing_bank_abbv_name') && dj.byId('issuing_bank_abbv_name').get('value')!== ''){
				bankAbbvName = dj.byId('issuing_bank_abbv_name').get('value');
			}
			
				if(debitCurrency !== '' && !isNaN(amount) && productCode !== '' && bankAbbvName !== '' ){
					if(debitCurrency !== PrincipalAcctCurrency){
						fromCurrency = PrincipalAcctCurrency;
						toCurrency   = debitCurrency;
						masterCurrency = PrincipalAcctCurrency;	
					}
					if(fromCurrency && fromCurrency !== '' && toCurrency && toCurrency !== ''){
						if(d.byId("fx-section"))
								{
									m.animate("wipeIn", d.byId('fx-section'));
								}
						m.fetchFXDetails(fromCurrency, toCurrency, amount, productCode, bankAbbvName, masterCurrency, isDirectConversion);
						if(dj.byId('fx_rates_type_1') && dj.byId('fx_rates_type_1').get('checked')){
							if(isNaN(dj.byId('fx_exchange_rate').get('value')) || dj.byId('fx_exchange_rate_cur_code').get('value') === '' ||
									isNaN(dj.byId('fx_exchange_rate_amt').get('value')) || (m._config.fxParamData[m._config.productCode].fxParametersData.toleranceDispInd === 'Y' && (isNaN(dj.byId('fx_tolerance_rate').get('value')) || 
									isNaN(dj.byId('fx_tolerance_rate_amt').get('value')) || dj.byId('fx_tolerance_rate_cur_code').get('value') === ''))){
								_clearRequiredFields(m.getLocalization("FXDefaultErrorMessage"));
							}
						}
					}else{
						if(d.byId("fx-section"))
						{
							d.style("fx-section","display","none");
						}
						m.defaultBindTheFXTypes();
						}
				}
			}
		},
		
	    bind : function() {
		//validation events
		//validate debit currency
		misys.setValidation('debit_cur_code', misys.validateCurrency);
		//validate for finance currency
		//misys.setValidation('finance_cur_code', misys.validateCurrency);
		//onChange
		misys.connect('debit_cur_code', 'onChange', function(){
			misys.setCurrency(this, ['debit_amt']);
		});
		
		misys.connect('debit_amt', 'onBlur', function(){
			_validateDebitAmt();
		});
		//onchange
		/*misys.connect('finance_cur_code', 'onChange', function(){
			misys.setCurrency(this, ['finance_amt']);
		});*/
		//Other events
		/*misys.connect('settlement_code', 'onChange', function(){
			var settlementCode = this.get('value');
		    //if settlement method is debit account
			//debit amount is mandatory
			misys.toggleFields(
					(settlementCode == '01'), 
					null, ['debit_cur_code','debit_amt'],
					false,false);
			
			misys.toggleFields(
					(settlementCode == '01' || settlementCode == '03'), 
					['debit_cur_code','debit_amt'], null,
					false,false);
		
			//if settlement method is finance account
			misys.toggleFields(
					(settlementCode == '02' && (settlementCode != '03' || settlementCode != '01') ), 
					null, ['finance_cur_code','finance_amt','finance_tenor'],
					false,false);
			
			misys.toggleFields(
					(settlementCode == '02' || settlementCode == '03'), 
					['finance_cur_code','finance_amt','finance_tenor'], null,
					false,false);
				
		});*/
		if(m._config.fxParamData && m._config.fxParamData[m._config.productCode].fxParametersData.isFXEnabled === 'Y'){
			//Start FX Actions
			m.connect('debit_cur_code', 'onChange', function(){
				m.setCurrency(this, ['debit_amt']);
				if(dj.byId('debit_cur_code').get('value') !== '' && !isNaN(dj.byId('debit_amt').get('value'))){
					m.fireFXAction();
				}else{
					m.defaultBindTheFXTypes();
				}
			});
			m.connect('debit_amt', 'onChange', function(){
				m.setTnxAmt(this.get('value'));
				if(!isNaN(dj.byId('debit_amt').get('value')) && dj.byId('debit_cur_code').get('value') !== ''){
					m.fireFXAction();
				}else{
					m.defaultBindTheFXTypes();
				}
			});
			
			m.connect('principal_act_name', 'onChange', function(){
				if(dj.byId('principal_act_cur_code') && dj.byId('principal_act_cur_code').get('value') !== ''){
					m.fireFXAction();
				}else{
					m.defaultBindTheFXTypes();
					if(d.byId("fx-section") && (d.style(d.byId("fx-section"),"display") !== "none"))
					{
						m.animate("wipeOut", d.byId('fx-section'));
					}
				}
			});
			//End FX Actions
		}
		
	  },
	  onFormLoad : function() {
			
			misys.setCurrency(dijit.byId('debit_cur_code'), ['debit_amt']);
			//hide fx section by default
			if(d.byId("fx-section"))
				{//show fx section if previously enabled (in case of draft)
					 if((dj.byId("fx_exchange_rate_cur_code") && dj.byId("fx_exchange_rate_cur_code").get("value")!== "")|| (dj.byId("fx_total_utilise_cur_code") && dj.byId("fx_total_utilise_cur_code").get("value")!== ""))
						{
								m.animate("wipeIn", d.byId('fx-section'));											
						}else
						{
							d.style("fx-section","display","none");
						}
				}
			//Start FX Actions
			if(m._config.fxParamData && m._config.fxParamData[m._config.productCode].fxParametersData.isFXEnabled === 'Y'){
				m.initializeFX(m._config.productCode);
				m.onloadFXActions();
			}	
			//End FX Actions
		},
		beforeSubmitValidations : function() {
			if(m._config.fxParamData && m._config.fxParamData[m._config.productCode].fxParametersData.isFXEnabled === 'Y'){
				if(!m.fxBeforeSubmitValidation())
					{
						return false;
					}
				var valid = true;
				var error_message = "";
				var boardRateOption = dj.byId("fx_rates_type_2");
				var totalUtiliseAmt = dj.byId("fx_total_utilise_amt");
				var debitAmt = dj.byId("debit_amt");
				
				if (boardRateOption.get('checked') && totalUtiliseAmt && !isNaN(totalUtiliseAmt.get('value')) && debitAmt && !isNaN(debitAmt.get('value'))) {
					if(debitAmt.get('value') < totalUtiliseAmt.get('value')){
					error_message += m.getLocalization("FXUtiliseAmtGreaterMessage");
					valid = false;
					}
				}
				
				m._config.onSubmitErrorMsg =  error_message;
				return valid;
			}else{
				return true;
			}
		}	
	});
})(dojo, dijit, misys);
//Including the client specific implementation
       dojo.require('misys.client.binding.trade.message_clean_client');