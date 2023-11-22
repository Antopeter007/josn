dojo.provide("misys.binding.openaccount.create_ip_settlement");
/*
 ----------------------------------------------------------
 Event Binding for

   Invoice Payable (IP) Form, Customer Side.

 Copyright (c) 2000-2009 Misys (http://www.misys.com),
 All Rights Reserved. 

 version:   1.0
 date:      30/06/17
 author: Chaitra Muralidhar
 ----------------------------------------------------------
 */
dojo.require("misys.openaccount.FormOpenAccountEvents");
dojo.require("misys.binding.openaccount.create_settlement_common");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {
	
	d.mixin(m._config, {

		initReAuthParams : function() {

			var reAuthParams = {
				productCode : dj.byId("product_code").get("value"),
				subProductCode : '',
				transactionTypeCode : dj.byId("tnx_type_code") ? dj.byId("tnx_type_code").get("value") :'01',
				entity : dj.byId("entity") ? dj.byId("entity").get("value") : '',
				currency : dj.byId("settlement_cur_code")? dj.byId("settlement_cur_code").get("value") : "",				
				amount : dj.byId("settlement_amt")? m.trimAmount(dj.byId("settlement_amt").get("value")) : "",
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
			m.setValidation("settlement_date", m.validateSettlementDateWithInvoiceDates);
			m.setValidation("settlement_cur_code", m.validateCurrency);
			m.connect("settlement_amt", "onBlur", function(){
				m.setSettlementPercentage();
				m.calculateOutstandingSettlementAmt();
				m.fireFXAction();
			});
			m.connect("settlement_cur_code", "onBlur", function(){				
				m.setSettlementCurrency(this, ["settlement_amt"]);
			});
			m.connect("settlement_percentage", "onBlur", function(){
				m.setSettlementAmt();
				m.calculateOutstandingSettlementAmt();
				m.fireFXAction();
			});
			
			m.connect("fx_exchange_rate_cur_code", "onChange", function() {
				m.setSettlementCurrency(this, ["fx_exchange_rate_amt"]);
			});

			m.setValidation("fx_exchange_rate_cur_code", m.validateCurrency);
			
			m.setFXConversion();
		},
		
		onFormLoad : function() {
			m.setCommonSettlementDetails();
			//Required for COunterparty Collaboration
			var beneAccessOpened = dj.byId("bene_access_opened");
			var accessOpened = dj.byId("access_opened");
			if(beneAccessOpened && accessOpened){
				console.debug("[create_ip_settlement], Setting access_opened value");
				accessOpened.set("value",beneAccessOpened.get("value"));
			}
			var cptyEmail = dj.byId("transaction_counterparty_email");
			var beneEmail = dj.byId("bene_email");
			if(beneEmail && cptyEmail){
				cptyEmail.set("value",beneEmail.get("value"));
				console.debug("[create_ip_settlement], Setting transaction_counterparty_email value");
			}
			var beneCompAbbvName = dj.byId("ben_company_abbv_name");
			var abbvName = dj.byId("abbvName");
			if(beneCompAbbvName && abbvName){
				beneCompAbbvName.set("value",abbvName.get("value"));
				console.debug("[create_ip_settlement], Setting ben_company_abbv_name value");
			}
		}
	});

})(dojo, dijit, misys);
////Including the client specific implementation
       dojo.require("misys.client.binding.openaccount.create_ip_settlement_client");