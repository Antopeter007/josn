dojo.provide("misys.binding.openaccount.create_repayment_common");
/*
 -----------------------------------------------------------------------------
 Scripts common across Invoice/Invoice Payable (IN, IP).

 Copyright (c) 2000-2009 Misys (http://www.misys.com),
 All Rights Reserved. 

 version:   1.0
 date:      28/02/17
 author:    Kenneth Ivanson Laurel
 -----------------------------------------------------------------------------
 */
//dojo.require("misys.openaccount.FormOpenAccountEvents");

(function(/*Dojo*/ d, /*Dijit*/ dj, /*Misys*/ m) {
	
	d.mixin(m, {
		
		setFXConversion : function()
		{
			var product = dj.byId("product_code").get("value");			
			if(m._config.fxParamData && m._config.fxParamData[product] && m._config.fxParamData[product].fxParametersData.isFXEnabled === "Y"){
				m.connect("fx_exchange_rate_cur_code", "onChange", function(){
					
					var fxExchangeRate = dj.byId("fx_exchange_rate");
					var fxExchangeRateAmount = dj.byId("fx_exchange_rate_amt");
					if (fxExchangeRate)
					{
						fxExchangeRate.set("value",'');
					}
					if (fxExchangeRateAmount)
					{
						fxExchangeRateAmount.set("value",'');
					}
					dj.byId("fx_exchange_rate_amt").set("value",'');
					
					m.setRepaymentCurrency(this, ["fx_exchange_rate_amt"]);
					if(dj.byId("fx_exchange_rate_cur_code").get("value") !== ""){
						m.fireFXAction();
					}
				});
			}
			else
			{
				if(d.byId("fx-section"))
				{
					d.style("fx-section","display","none");
				}
			}	
		},

		fireFXAction : function()
		{
			var product = dj.byId("product_code");
			if (m._config.fxParamData && product && product.get("value") !== "")
			{
				var fxParamObject = m._config.fxParamData[product.get("value")];
				if (m._config.fxParamData && fxParamObject.fxParametersData.isFXEnabled === "Y")
				{   		
					var financeCurrency, fxCurrency = "";
					var amount;
					
					if(dj.byId("fx_exchange_rate_cur_code"))
					{
						fxCurrency = dj.byId("fx_exchange_rate_cur_code").get("value");					
					}				
					if(dj.byId("finance_repayment_amt"))
					{
						amount = dj.byId("finance_repayment_amt").get("value");
					}				
					if(dj.byId("outstanding_repayment_cur_code"))
					{
						financeCurrency = dj.byId("outstanding_repayment_cur_code").get("value");
					}
				
					var productCode = m._config.productCode;
					var bankAbbvName = "";
					
					if(dj.byId("issuing_bank_abbv_name") && dj.byId("issuing_bank_abbv_name").get("value")!== "")
					{
						bankAbbvName = dj.byId("issuing_bank_abbv_name").get("value");
					}
					if(dj.byId("outstanding_repayment_cur_code"))
					{
						var masterCurrency = dj.byId("outstanding_repayment_cur_code").get("value");
					}
					masterCurrency = financeCurrency;
						
					if(d.byId("fx-section")&&(d.style(d.byId("fx-section"),"display") === "none"))
					{
						m.animate("wipeIn", d.byId("fx-section"));
					}							
					m.fetchFXDetails(financeCurrency, fxCurrency, amount, productCode, bankAbbvName, masterCurrency, false);
					
					if (financeCurrency && financeCurrency !== "" && fxCurrency && fxCurrency !== ""  && financeCurrency === fxCurrency)
					{
						dj.byId("fx_exchange_rate").set("value", "1");
						dj.byId("fx_exchange_rate_cur_code").set("value", dj.byId("finance_repayment_cur_code").get("value"));
						dj.byId("fx_exchange_rate_amt").set("value", dj.byId("finance_repayment_amt").get("value"));
					}
						if (isNaN(amount))
					{
						dj.byId("fx_exchange_rate_amt").set("value",'');
					}
				}
			}
		},
	
		setCommonRepaymentDetails : function()
		{
			m.setRepaymentDetails();
			m.setCurrency("finance_cur_code", ["finance_amt"]);
			m.setCurrency("outstanding_repayment_cur_code", ["outstanding_repayment_amt"]);
			m.setRepaymentCurrency("finance_repayment_cur_code", ["finance_repayment_amt"]);
	
			var fxExchangeRateAmount = dj.byId("fx_exchange_rate_amt");
			
			if (fxExchangeRateAmount)
			{
				fxExchangeRateAmount.set("readonly", true);
			}
			
			var financeCurrency = dj.byId("outstanding_repayment_cur_code");
			var fxExchangeCurrency = dj.byId("fx_exchange_rate_cur_code");			
			
			if(m._config.fxParamData && dj.byId("product_code") && dj.byId("product_code").get("value") !== "" )
			{
				m.initializeFX(dj.byId("product_code").get("value"));
				m.onloadFXActions();
			}
	
			m.fireFXAction();
		}
	});
})(dojo, dijit, misys);
