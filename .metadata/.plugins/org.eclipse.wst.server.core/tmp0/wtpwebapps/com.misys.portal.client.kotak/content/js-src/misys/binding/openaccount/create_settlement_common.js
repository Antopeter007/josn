dojo.provide("misys.binding.openaccount.create_settlement_common");
dojo.require("misys.validation.common");
/*
 -----------------------------------------------------------------------------
 Scripts common across Invoice Payable Settlement (IN, IP).

 Copyright (c) 2000-2009 Misys (http://www.misys.com),
 All Rights Reserved. 

 version:   1.0
 date:      30/06/17
 author:    Chaitra Muralidhar
 -----------------------------------------------------------------------------
 */




(function(/*Dojo*/ d, /*Dijit*/ dj, /*Misys*/ m) {
	
	/**
	 * Returns a value of amount field(String) to number
	 */
	_getValueAsNumber = function(value){
		if (d.isString(value))
		{
			var convertedValue = d.number.parse(value);
			return convertedValue; 
		}
		return value;
	};
	/**
	 * <h4>Summary:</h4> Returns a localized display date for a date field.
	 * 
	 * <h4>Description:</h4> 
	 * Return the date of the field in a standard format, for
	 * comparison. If the field is hidden, we convert it to a standardized
	 * format for comparison, otherwise we simply return the value.
	 * Internally it uses dojo functions to do this
	 * @param {dijit._Widget} dateField
	 * 	Date field which we want to format to localise date.
	 * @method _localizeDisplayDate
	 */
	function _localizeDisplayDate( /*dijit._Widget*/ dateField) {
		
		if(dateField.get("type") === "hidden") {
			return d.date.locale.format(m.localizeDate(dateField), {
				selector :"date"
			});
		}
		
		return dateField.get("displayedValue");
	}
	
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
					
					m.setSettlementCurrency(this, ["fx_exchange_rate_amt"]);
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
					var invSettlementCurrency, fxCurrency = "";
					var amount;
					
					if(dj.byId("fx_exchange_rate_cur_code"))
					{
						fxCurrency = dj.byId("fx_exchange_rate_cur_code").get("value");					
					}				
					if(dj.byId("settlement_amt"))
					{
						amount = dj.byId("settlement_amt").get("value");
					}				
					if(dj.byId("liab_total_net_cur_code"))
					{
						invSettlementCurrency = dj.byId("liab_total_net_cur_code").get("value");
					}
				
					var productCode = m._config.productCode;
					var bankAbbvName = "";
					
					if(dj.byId("issuing_bank_abbv_name") && dj.byId("issuing_bank_abbv_name").get("value")!== "")
					{
						bankAbbvName = dj.byId("issuing_bank_abbv_name").get("value");
					}
					if(dj.byId("liab_total_net_cur_code"))
					{
						var masterCurrency = dj.byId("liab_total_net_cur_code").get("value");
					}
					masterCurrency = invSettlementCurrency;
						
					if(d.byId("fx-section")&&(d.style(d.byId("fx-section"),"display") === "none"))
					{
						m.animate("wipeIn", d.byId("fx-section"));
					}							
					m.fetchFXDetails(invSettlementCurrency, fxCurrency, amount, productCode, bankAbbvName, masterCurrency, false);
					
					if (invSettlementCurrency && invSettlementCurrency !== "" && fxCurrency && fxCurrency !== ""  && invSettlementCurrency === fxCurrency)
					{
						dj.byId("fx_exchange_rate").set("value", "1");
						dj.byId("fx_exchange_rate_cur_code").set("value", dj.byId("settlement_cur_code").get("value"));
						dj.byId("fx_exchange_rate_amt").set("value", dj.byId("settlement_amt").get("value"));
					}
						if (isNaN(amount))
					{
						dj.byId("fx_exchange_rate_amt").set("value",'');
					}
				}
			}
		},
	
		setCommonSettlementDetails : function()
		{
			m.initializeSettlementDetails();
			m.setCurrency("liab_total_net_cur_code", ["liab_total_net_amt"]);
			m.setSettlementCurrency("settlement_cur_code", ["settlement_amt"]);
	
			var fxExchangeRateAmount = dj.byId("fx_exchange_rate_amt");
			
			if (fxExchangeRateAmount)
			{
				fxExchangeRateAmount.set("readonly", true);
			}
			
			var invSettlementCurrency = dj.byId("liab_total_net_cur_code");
			var fxExchangeCurrency = dj.byId("fx_exchange_rate_cur_code");			
			
			if(m._config.fxParamData && dj.byId("product_code") && dj.byId("product_code").get("value") !== "" )
			{
				m.initializeFX(dj.byId("product_code").get("value"));
				m.onloadFXActions();
			}
	
			m.fireFXAction();
		},
		/**
		 * <h4>Summary:</h4>
		 * This function is used to validate the invoice date from.	 
		 * 
		 * @method collectionValidateInvoiceDateFrom
		 */
		collectionValidateInvoiceDateFrom : function()
		{
			console.debug("Start Execute collectionValidateInvoiceDateFrom");
			if (this.get("value") === null) {
				return true;
			}
			console.debug("[Validate] Validating Issue From Date. Value = "+ this.get("value"));
			var creationToDate = dj.byId("iss_date2");
			if (!m.compareDateFields(this, creationToDate)) {
				var widget = dj.byId("iss_date");
					displayMessage = misys.getLocalization("InvoiceIssueDateFromLesserThanInvoiceIssueDateTo");
					widget.focus();
					widget.set("state","Error");
					dj.hideTooltip(widget.domNode);
					dj.showTooltip(displayMessage, widget.domNode, 0);
			}
			console.debug("End collectionValidateInvoiceDateFrom");
			return true;
		},		
		
		/**
		 * <h4>Summary:</h4>
		 * This function is used to validate the invoice date to.	 
		 * 
		 * @method collectionValidateInvoiceDateTo
		 */
		collectionValidateInvoiceDateTo : function() 
		{
			console.debug("Start Execute collectionValidateInvoiceDateTo");
			if (this.get("value") === null) {
				return true;
			}
			console.debug("[Validate] Validating Creation To Date. Value = "+ this.get("value"));
			var creationFromDate = dj.byId("iss_date");
			if (!m.compareDateFields(creationFromDate, this)) {
				var widget = dj.byId("iss_date2");
				  	displayMessage = misys.getLocalization("InvoiceIssueDateToGreaterThanInvoiceIssueDateFrom");
			 		widget.focus();
			 		widget.set("state","Error");
			 		dj.hideTooltip(widget.domNode);
			 		dj.showTooltip(displayMessage, widget.domNode, 0);
			 	return false;		
			}
			console.debug("End collectionValidateInvoiceDateTo");
			return true;
			
		},
		
			/**
		 * <h4>Summary:</h4>
		 * This function is used to validate the due date from.	 
		 * 
		 * @method collectionValidateDueDateFrom
		 */
		collectionValidateDueDateFrom : function() 
		{
			console.debug("Start Execute collectionValidateDueDateFrom");

			if (this.get("value") === null) {
				return true;
			}
			console.debug("[Validate] Validating Maturity From Date. Value = "+ this.get("value"));
			var maturityToDate = dj.byId("due_date2");
			if (!m.compareDateFields(this, maturityToDate)) {
				var widget = dj.byId("due_date"),
				    displayMessage = misys.getLocalization("InvoiceDueDateFromGreaterThanInvoiceDueDateTo");
			 		widget.focus();
			 		widget.set("state","Error");
			 		dj.hideTooltip(widget.domNode);
			 		dj.showTooltip(displayMessage, widget.domNode, 0);
			 		dj.showTooltip(displayMessage,
						domNode, 0);
			 		return false;
			}
			console.debug("End collectionValidateDueDateFrom");
			return true;
		},

		/**
		 * <h4>Summary:</h4>
		 * This function is used to validate the due date to.	 
		 * 
		 * @method collectionValidateDueDateTo
		 */
		collectionValidateDueDateTo : function()
		{
			console.debug("Start Execute collectionValidateDueDateTo");
			if (this.get("value") === null) {
				return true;
			}
			console.debug("[Validate] Validating Maturity To Date. Value = "+ this.get("value"));
			// Test that the last shipment date is greater than or equal to
			// the application date
			var maturityFromDate = dj.byId("due_date");
			if (!m.compareDateFields(maturityFromDate, this)) {
				var widget = dj.byId("due_date2");
				 	displayMessage = misys.getLocalization("InvoiceDueDateToLesserThanInvoiceDueDateFrom");
			 		widget.focus();
			 		widget.set("state","Error");
			 		dj.hideTooltip(widget.domNode);
			 		dj.showTooltip(displayMessage, widget.domNode, 0);
			}
			console.debug("End collectionValidateDueDateTo");
			return true;
		},
		/**
		 * <h4>Summary:</h4>
		 * This function is used to set Invoice Settlement Amount.	 
		 * 
		 * @method setSettlementAmt
		 */
		setSettlementAmt : function () 
		{
			console.debug("Start Execute setSettlementAmt");
			var actualInvoiceOutstandingAmt;
			var isValid = true;
			if(dj.byId("invoice_outstanding_amt"))
			{
				actualInvoiceOutstandingAmt = _getValueAsNumber(dj.byId("invoice_outstanding_amt").get("value"));
			}
			var settleAmt = _getValueAsNumber(dj.byId("settlement_amt").get("value"));
			var settlePercent = dj.byId("settlement_percentage");
			var settlePct = settlePercent.get("value");
			var regExpression = '^[0-9]{1,3}(?:\.[0-9]{1,2})?$';
			var settlePercentage = _getValueAsNumber(settlePct);
			var regExp = new RegExp(regExpression);
			
			//threshold amount calculation
			var collectionAmountConfig = dj.byId("collectionAmountConfig").get("value");
			
			if(collectionAmountConfig)
			{
				var thresholdAmount = dj.byId("threshold_amount").get("value");
				var thresholdAmt = _getValueAsNumber(thresholdAmount);
				var totalNetAmount = dj.byId("collections_amt").get("value");
				var totalNetAmt =  _getValueAsNumber(totalNetAmount);
				var outstandingAmount = dj.byId("invoice_outstanding_amt").get("value");
				var outstandingAmt = _getValueAsNumber(outstandingAmount);
				var allowedThresholdAmount = thresholdAmt -(totalNetAmt- outstandingAmt);
				var allowedThresholdAmt = _getValueAsNumber(allowedThresholdAmount);
				var allowedThresholdPercentage =parseFloat((allowedThresholdAmt * 100) / outstandingAmt).toFixed(2);
				var allowedThresholdPercent= _getValueAsNumber(allowedThresholdPercentage);
				var settlementPercentage =parseFloat(settlePercentage).toFixed(2);
				var invalidMessage;
				invalidMessage = m.getLocalization("settlementPercentageError",[settlePercentage,allowedThresholdPercent]);
				
				if(allowedThresholdPercent && 
						(allowedThresholdPercent !== "0"  && allowedThresholdPercent >= settlePercentage))
				{
					settleAmt = (settlePct * actualInvoiceOutstandingAmt) /100; //(80*600/100)
					dj.byId("settlement_amt").set("value", settleAmt);
				}
				else if(allowedThresholdPercent < settlePercentage)
				{ 
					misys.dialog.show('ERROR', invalidMessage);
					dj.byId("settlement_percentage").set("value","");
				}
						
			}
			
			else
			{
				if(settlePct !== null && !isNaN(settlePct) && parseFloat(settlePct) > 0 && regExp.test(settlePct))
				{
					settleAmt = (settlePct * actualInvoiceOutstandingAmt) /100; //(80*600/100)
					dj.byId("settlement_amt").set("value", settleAmt);
				}
			
				else if(settlePercentage === 0)
				{
					displayMessage = misys.getLocalization("settlementPercentageCantBeZero");
					isValid = false;
				}
				else 
				{
					displayMessage = misys.getLocalization("incorrectPercentage");
					isValid = false;
				}
				if(!isValid)
				{
					settlePercent.set("value", "");
					settlePercent.set("state","Error");
			 		dj.hideTooltip(settlePercent.domNode);
			 		dj.showTooltip(displayMessage, settlePercent.domNode, 0);
				}
			}
			console.debug("End setSettlementAmt");
		},
		/**
		 * <h4>Summary:</h4>
		 * This function is used to set Invoice Settlement Percentage .	 
		 * 
		 * @method setSettlementPercentage
		 */
		setSettlementPercentage : function () 
		{
			console.debug("Start Execute setSettlementPercentage");
			
			var settleAmt = dj.byId("settlement_amt");
			var settlementAmt = _getValueAsNumber(dj.byId("settlement_amt").get("value"));
			var actualInvoiceOutstandingAmt;
			var	percentage;
			var settlePercent = dj.byId("settlement_percentage");
			
			 if(dj.byId("invoice_outstanding_amt"))
				{
					actualInvoiceOutstandingAmt = _getValueAsNumber(dj.byId("invoice_outstanding_amt").get("value"));
				}
			if(settlementAmt && settlementAmt !== "0" && actualInvoiceOutstandingAmt)
				{
					percentage = parseFloat((settlementAmt * 100 ) / actualInvoiceOutstandingAmt).toFixed(2);//400*100/600)
				}
			if(settlementAmt === 0)
				{
					misys.dialog.show("ERROR", misys.getLocalization("settlementAmtCantBeZero"));
					settleAmt.set("value","");	
					settleAmt.set("state","Error");
				}
			
			//threshold amount and percentage calculation 
			var collectionAmountConfig = dj.byId("collectionAmountConfig").get("value");
			
			if(collectionAmountConfig)
			{
				var thresholdAmount = dj.byId("threshold_amount").get("value");
				var thresholdAmt = _getValueAsNumber(thresholdAmount);
				var totalNetAmount = dj.byId("collections_amt").get("value");
				var totalNetAmt =  _getValueAsNumber(totalNetAmount);
				var outstandingAmount = dj.byId("invoice_outstanding_amt").get("value");
				var outstandingAmt = _getValueAsNumber(outstandingAmount);
				var allowedThresholdAmount = thresholdAmt -(totalNetAmt- outstandingAmt);
				var allowedThresholdAmt = _getValueAsNumber(allowedThresholdAmount);
				var allowedThresholdPercentage =parseFloat((allowedThresholdAmt * 100) / outstandingAmt).toFixed(2);
				var invalidMessage;
				invalidMessage = m.getLocalization("settlementAmountError",[settlementAmt,allowedThresholdAmt]);
				 
				if(allowedThresholdAmt && allowedThresholdAmt >= settlementAmt)
				   {
					 dj.byId("settlement_percentage").set("value", percentage);	
				   }
				else
				  { 
					misys.dialog.show('ERROR', invalidMessage);
					dj.byId("settlement_amt").set("value","");
				  }
			}
			
			else
			{
			if(percentage && (percentage === "0" || parseFloat(percentage) > 999.99))
			{
				displayMessage = misys.getLocalization("incorrectPercentage");
				settlePercent.set("value", "");
				settlePercent.set("state","Error");
		 		dj.hideTooltip(settlePercent.domNode);
		 		dj.showTooltip(displayMessage, settlePercent.domNode, 0);
			}
			else
			{
				dj.byId("settlement_percentage").set("value", percentage);
			}
			}
			console.debug("End setSettlementPercentage");
		},
		/**
		 * <h4>Summary:</h4>
		 * This function is used to set Invoice Settlement Currency Code.	 
		 * 
		 * @method setSettlementCurrency
		 */
		setSettlementCurrency : function (node, arr, constraints) {
			//  summary:
//			        Set the currency of a set of amount fields
//				description:
//					  This function takes two parameters - a node (or id) of a Dijit containing
//					  a currency code, and a single ID or array of IDs for fields on which this
//					  currency should be set as a constraint
			console.debug("Start Execute setSettlementCurrency");
					var currencyField = dj.byId(node),
							targetFieldIds = d.isArray(arr) ? arr : [arr],
							currency, field, cldrMonetary;
					
					if(currencyField && currencyField.get("value") !== "" &&
								currencyField.state !== "Error") {
						currency = currencyField.get("value");
						d.forEach(targetFieldIds, function(id){
								field  = dj.byId(id);
								if(field){
									console.debug("[misys.form.common] Setting currency code", currency, 
													"on field", id);
									cldrMonetary = d.cldr.monetary.getData(currency);						
									
									//Client specific (FIX ME : Need to find a solution to override common 
									//function's for client specific requirement)
									var monetaryConst = {round: cldrMonetary.round, 
														places: cldrMonetary.places,
														max:999999999999.99,
														min: 0.01};
									
									if(cldrMonetary.places === 2)
									{
										monetaryConst = {
											round: cldrMonetary.round,
											places: cldrMonetary.places,
											min:0.00,
											max:999999999999.99
										};
									}
									else if(cldrMonetary.places === 3)
									{
										monetaryConst = {
											round: cldrMonetary.round,
											places: cldrMonetary.places,
											min:0.000,
											max:999999999999.999
										};
									}
									else if(cldrMonetary.places === 0)
									{
										monetaryConst = {
											round: cldrMonetary.round,
											places: cldrMonetary.places,
											min:0,
											max:9999999999999
										};
									}
								
									// Mixin any provided constraints
									d.mixin(monetaryConst, constraints);
								
									field.set("constraints", monetaryConst);
									field.set("value",field.get("value"));
								}
							});
						}
					console.debug("End setSettlementCurrency");
					},
					
		/**
		 * <h4>Summary:</h4>
		 * This function is used to set Invoice Settlement Details for IP Collections.	 
		 * 
		 * @method setSettlementDetails
		 */
		initializeSettlementDetails : function()
		{

			console.debug("Start Execute initializeSettlementDetails");
			var outstandingSettlementAmt = dj.byId("liab_total_net_amt");
			var outstandingSettlementCur = dj.byId("liab_total_net_cur_code");
			var totalNetCurCode = dj.byId("total_net_cur_code");
			var settlementAmount = dj.byId("settlement_amt");
			var settlementCurCode = dj.byId("settlement_cur_code");
			var settlementPercentage = dj.byId("settlement_percentage");
			var actualInvoiceOutstandingAmt = dj.byId("invoice_outstanding_amt");
			var prodStatCode = dj.byId("prod_stat_code").get('value');
			// Skip this calculation for edit transaction screen
			if(("E1" === prodStatCode ||'E5' === prodStatCode || '46' === prodStatCode || '47' === prodStatCode || '08' === prodStatCode) && ('P' !==  dj.byId("collection_req_flag").get("value")))
			{
				var cashCustomizationEnable = dj.byId("cashCustomizationEnable").get("value");
				if((cashCustomizationEnable === "true" && dj.byId("total_discount") && dj.byId("total_discount").get("value")!=null) && ('Y' !==  dj.byId("collection_discount_flag").get("value")))
				{	
				var totalDiscountAmt = Number(dj.byId("total_discount").get("value"));
				settlementAmount.set("value", (outstandingSettlementAmt.get("value")- (totalDiscountAmt) ));
				settlementCurCode.set("value",outstandingSettlementCur.get("value"));
				settlementPercentage.set("value",100);
				outstandingSettlementAmt.set("value",0);
				}
				else{
				settlementAmount.set("value",outstandingSettlementAmt.get("value"));
				settlementCurCode.set("value",outstandingSettlementCur.get("value"));
				settlementPercentage.set("value",100);
				outstandingSettlementAmt.set("value",0);}
			}
			var settlementCur = dj.byId("settlement_cur_code");
			outstandingSettlementAmt.set("disabled", true);
			outstandingSettlementCur.set("disabled", true);
			settlementAmount.set("disabled", false);
			settlementPercentage.set("disabled", false);
			settlementCur.set("disabled", true);
			//m.calculateOutstandingSettlementAmt();
			//m.setSettlementAmt();
			
			console.debug("End initializeSettlementDetails");
		},
		/**
		 * <h4>Summary:</h4>
		 * This function is used to calculate Invoice outstanding Settlement amount Details for IP Collections.	 
		 * 
		 * @method calculateOutstandingSettlementAmt
		 */
		calculateOutstandingSettlementAmt : function()
		{
			console.debug("Start Execute calculateOutstandingSettlementAmt");
			var outstandingSettlementAmt = dj.byId("liab_total_net_amt");
			var settlementAmount = _getValueAsNumber(dijit.byId("settlement_amt").get("value"));
			var actualInvoiceOutstandingAmt;
			if(dijit.byId("invoice_outstanding_amt"))
			{
				actualInvoiceOutstandingAmt = _getValueAsNumber(dijit.byId("invoice_outstanding_amt").get("value"));
			}
			if(outstandingSettlementAmt)
			{
				var currentOutstanding = actualInvoiceOutstandingAmt - (settlementAmount);
				if(currentOutstanding < 0)
				{
					currentOutstanding = 0;
				}
				outstandingSettlementAmt.set("value",currentOutstanding);
			}
			console.debug("End calculateOutstandingSettlementAmt");
		},
		/**
		 * validate Settlement date with invoice due date and invoice dates
		 */
		validateSettlementDateWithInvoiceDates : function()
		{
			if(!this.get("value")){
				return true;
			}
			console.debug("Start Execute validateSettlementDateWithInvoiceDates");

			/**
			 *	Since past dated invoices are allowed to be settled in collections.
			 *	No need to validate it against Due date. 
			*/	
			var invoiceDate = dj.byId("inv_date");
			if(!m.compareDateFields(invoiceDate, this)) {
				this.invalidMessage = m.getLocalization("settlementDateGreaterThanInvoiceDate",
						[_localizeDisplayDate(this),
			             _localizeDisplayDate(invoiceDate)]);
				return false;
			}
			console.debug("End validateSettlementDateWithInvoiceDates");
			return true;
		}
	});
})(dojo, dijit, misys);