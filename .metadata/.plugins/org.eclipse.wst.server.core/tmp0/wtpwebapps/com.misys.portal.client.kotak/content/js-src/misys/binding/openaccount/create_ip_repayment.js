dojo.provide("misys.binding.openaccount.create_ip_repayment");
/*
 ----------------------------------------------------------
 Event Binding for

   Invoice Payable (IP) Form, Customer Side.

 Copyright (c) 2000-2009 Misys (http://www.misys.com),
 All Rights Reserved. 

 version:   1.0
 date:      25/01/17
 ----------------------------------------------------------
 */
dojo.require("misys.openaccount.FormOpenAccountEvents");
dojo.require("misys.validation.common");
dojo.require("misys.binding.openaccount.create_repayment_common");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {
	
	d.mixin(m._config, {

		initReAuthParams : function() {

			var reAuthParams = {
				productCode : dj.byId("product_code").get("value"),
				subProductCode : '',
				transactionTypeCode : '01',
				entity : dj.byId("entity") ? dj.byId("entity").get("value") : '',
				currency : dj.byId("finance_repayment_cur_code")? dj.byId("finance_repayment_cur_code").get("value") : "",				
				amount : dj.byId("finance_repayment_amt")? m.trimAmount(dj.byId("finance_repayment_amt").get("value")) : "",
				bankAbbvName : dj.byId("issuing_bank_abbv_name") ? dj.byId("issuing_bank_abbv_name").get("value") : "",	

				es_field1 : '',
				es_field2 : ''
			};
			return reAuthParams;
		}
		
	});
	d.mixin(m, {
		bind : function() {
			/*
			 * summary:Binds validations and events to fields in the form. 
			 * tags:public
			 */	
			m.setValidation("finance_repayment_cur_code", m.validateCurrency);
			m.connect("finance_repayment_action", "onChange", function(){
				m.clearRepaymentAmt();
				m.setRepaymentDetails();
			});
			m.connect("finance_repayment_amt", "onChange", function(){
				m.setRepaymentAmtAndCurCode();
				m.fireFXAction();
			});
			m.connect("finance_repayment_cur_code", "onBlur", function(){				
				m.setRepaymentAmtAndCurCode();
				m.setRepaymentCurrency(this, ["finance_repayment_amt"]);
			});
			m.connect("finance_repayment_percentage", "onChange", function(){
				m.setRepaymentPercentage();
			});
			
			m.connect("fx_exchange_rate_cur_code", "onChange", function() {
				m.setRepaymentCurrency(this, ["fx_exchange_rate_amt"]);
			});

			m.setValidation("fx_exchange_rate_cur_code", m.validateCurrency);
			
			m.setFXConversion();
		},
		
		onFormLoad : function() {
			m.setCommonRepaymentDetails();
			//Required for COunterparty Collaboration
			var beneAccessOpened = dj.byId("bene_access_opened");
			var accessOpened = dj.byId("access_opened");
			if(beneAccessOpened && accessOpened){
				console.debug("[create_ip_repayment], Setting access_opened value");
				accessOpened.set("value",beneAccessOpened.get("value"));
			}
			var cptyEmail = dj.byId("transaction_counterparty_email");
			var beneEmail = dj.byId("bene_email");
			if(beneEmail && cptyEmail){
				cptyEmail.set("value",beneEmail.get("value"));
				console.debug("[create_ip_repayment], Setting transaction_counterparty_email value");
			}
			var beneCompAbbvName = dj.byId("ben_company_abbv_name");
			var abbvName = dj.byId("abbvName");
			if(beneCompAbbvName && abbvName){
				beneCompAbbvName.set("value",abbvName.get("value"));
				console.debug("[create_ip_repayment], Setting ben_company_abbv_name value");
			}
		}
	});

})(dojo, dijit, misys);
////Including the client specific implementation
       dojo.require("misys.client.binding.openaccount.create_ip_repayment_client");