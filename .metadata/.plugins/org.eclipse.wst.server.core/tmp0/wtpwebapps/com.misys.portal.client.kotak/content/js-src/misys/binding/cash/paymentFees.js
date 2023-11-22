/**
 * 
 */dojo.provide("misys.binding.cash.paymentFees");

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
dojo.require("misys.binding.cash.ft_common");
dojo.require("misys.form.BusinessDateTextBox");
dojo.require("misys.binding.common.create_fx_multibank");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {
	
	function _setFeeDetails(rebate,feeName,feeCurrency,feeAmount,payingParty,taxAmt,taxCurrency,taxOnTaxAmt,taxOnTaxCurrency,debitFeeCount,agentFeeCount,totalFee) {
		if(payingParty === 'DR') {
			var divElement = document.getElementById('transaction_details_div');
			var mainDivElemnt = document.getElementById('fee_transaction_details_div');
			mainDivElemnt.style.display = "block";
			var cloneDivElemnt = divElement.cloneNode(true);
			cloneDivElemnt.id = "transaction_details_div" + '_' + debitFeeCount;
			var cloneNodeId = cloneDivElemnt.id;
					
				if(document.getElementById("debit_fee_name")){
					document.getElementById("debit_fee_name").id = "debit_fee_name_0";
				}
				if(document.getElementById("debit_fee_amt")){
					document.getElementById("debit_fee_amt").id = "debit_fee_amt_0";
				}
				if(document.getElementById("debit_tax_amount")){
					document.getElementById("debit_tax_amount").id = "debit_tax_amount_0";
				}
				if(document.getElementById("debit_tax_on_tax_amt")){
					document.getElementById("debit_tax_on_tax_amt").id = "debit_tax_on_tax_amt_0";
				}
				if(document.getElementById("debit_rebate_amt")){
					document.getElementById("debit_rebate_amt").id = "debit_rebate_amt_0";
				}
				if(document.getElementById("debit_total_fee")){
					document.getElementById("debit_total_fee").id = "debit_total_fee_0";
				}
			
			mainDivElemnt.appendChild(cloneDivElemnt);
			if(document.getElementById(cloneNodeId)){
				document.getElementById(cloneNodeId).style.display = "block";
			}
            var debitFeeNameId = "debit_fee_name" + '_' + debitFeeCount ;
            var debitFeeAmtId = "debit_fee_amt" + '_' + debitFeeCount;
            var debitTaxAmtId = "debit_tax_amount" + '_' + debitFeeCount;
            var debitTaxOnTaxAmtId = "debit_tax_on_tax_amt" + '_' + debitFeeCount;
            var debitRebateAmtId = "debit_rebate_amt" + '_' + debitFeeCount;
            var debitTotalAmtId = "debit_total_fee" + '_' + debitFeeCount;
         
            document.getElementById("debit_fee_name").id = debitFeeNameId ;
			document.getElementById(debitFeeNameId).value = feeName;
				
			document.getElementById("debit_fee_amt").id = debitFeeAmtId ;
			document.getElementById(debitFeeAmtId).value = feeCurrency.concat(' ').concat(dojo.currency.format(feeAmount));
				
			document.getElementById("debit_tax_amount").id = debitTaxAmtId ;
			document.getElementById(debitTaxAmtId).value = feeCurrency.concat(' ').concat(dojo.currency.format(taxAmt));
	
			document.getElementById("debit_tax_on_tax_amt").id = debitTaxOnTaxAmtId ;
			document.getElementById(debitTaxOnTaxAmtId).value = feeCurrency.concat(' ').concat(dojo.currency.format(taxOnTaxAmt));
	
			document.getElementById("debit_rebate_amt").id = debitRebateAmtId ;
			document.getElementById(debitRebateAmtId).value = rebate;
	
			document.getElementById("debit_total_fee").id = debitTotalAmtId ;
			document.getElementById(debitTotalAmtId).value = feeCurrency.concat(' ').concat(dojo.currency.format(totalFee));

			
			if(document.getElementById("debit_fee_name_0")){
				document.getElementById("debit_fee_name_0").id = "debit_fee_name";
			}
			if(document.getElementById("debit_fee_amt_0")){
				document.getElementById("debit_fee_amt_0").id = "debit_fee_amt";
			}
			if(document.getElementById("debit_tax_amount_0")){
				document.getElementById("debit_tax_amount_0").id = "debit_tax_amount";
			}
			if(document.getElementById("debit_tax_on_tax_amt_0")){
				document.getElementById("debit_tax_on_tax_amt_0").id = "debit_tax_on_tax_amt";
			}
			if(document.getElementById("debit_rebate_amt_0")){
				document.getElementById("debit_rebate_amt_0").id = "debit_rebate_amt";
			}
			if(document.getElementById("debit_total_fee_0")){
				document.getElementById("debit_total_fee_0").id = "debit_total_fee";
			}

		} else if(payingParty === 'AF') {
			var agentDivElement = document.getElementById('agent_details_div');
			var agentMainDivElemnt = document.getElementById('fee_agent_details_div');
			agentMainDivElemnt.style.display = "block";
			var agentCloneDivElemnt = agentDivElement.cloneNode(true);
			agentCloneDivElemnt.id = "fee_agent_details_div" + '_' + agentFeeCount;
			var agentCloneNodeId = agentCloneDivElemnt.id;

				if(document.getElementById("agent_fee_name")){
					document.getElementById("agent_fee_name").id = "agent_fee_name_0" ;
				}
				if(document.getElementById("agent_fee_amt")){
					document.getElementById("agent_fee_amt").id = "agent_fee_amt_0";
				}
				if(document.getElementById("agent_tax_amount")){
					document.getElementById("agent_tax_amount").id = "agent_tax_amount_0" ;
				}
				if(document.getElementById("agent_tax_on_tax_amt")){
					document.getElementById("agent_tax_on_tax_amt").id = "agent_tax_on_tax_amt_0";
				}
				if(document.getElementById("agent_rebate_amt")){
					document.getElementById("agent_rebate_amt").id = "agent_rebate_amt_0";
				}
				if(document.getElementById("agent_total_fee")){
					document.getElementById("agent_total_fee").id = "agent_total_fee_0";
				}
			
			agentMainDivElemnt.appendChild(agentCloneDivElemnt);
            if(document.getElementById(agentCloneNodeId)){
				document.getElementById(agentCloneNodeId).style.display = "block";
			}
            var agentFeeNameId = "agent_fee_name" + '_' + agentFeeCount ;
            var agentFeeAmtId = "agent_fee_amt" + '_' + agentFeeCount;
            var agentTaxAmtId = "agent_tax_amount" + '_' + agentFeeCount;
            var agentTaxOnTaxAmtId = "agent_tax_on_tax_amt" + '_' + agentFeeCount;
            var agentRebateAmtId = "agent_rebate_amt" + '_' + agentFeeCount;
            var agentTotalAmtId = "agent_total_fee" + '_' + agentFeeCount;
         
            document.getElementById("agent_fee_name").id = agentFeeNameId ;
			document.getElementById(agentFeeNameId).value = feeName;
			document.getElementById("agent_fee_amt").id = agentFeeAmtId ;
			document.getElementById(agentFeeAmtId).value = feeCurrency.concat(' ').concat(dojo.currency.format(feeAmount));
			
			document.getElementById("agent_tax_amount").id = agentTaxAmtId ;
			document.getElementById(agentTaxAmtId).value = feeCurrency.concat(' ').concat(dojo.currency.format(taxAmt));

			document.getElementById("agent_tax_on_tax_amt").id = agentTaxOnTaxAmtId ;
			document.getElementById(agentTaxOnTaxAmtId).value = feeCurrency.concat(' ').concat(dojo.currency.format(taxOnTaxAmt));

			document.getElementById("agent_rebate_amt").id = agentRebateAmtId ;
			document.getElementById(agentRebateAmtId).value = rebate;

			document.getElementById("agent_total_fee").id = agentTotalAmtId ;
			document.getElementById(agentTotalAmtId).value = feeCurrency.concat(' ').concat(dojo.currency.format(totalFee));

			if(document.getElementById("agent_fee_name_0")){
				document.getElementById("agent_fee_name_0").id = "agent_fee_name" ;
			}
			if(document.getElementById("agent_fee_amt_0")){
				document.getElementById("agent_fee_amt_0").id = "agent_fee_amt";
			}
			if(document.getElementById("agent_tax_amount_0")){
				document.getElementById("agent_tax_amount_0").id = "agent_tax_amount" ;
			}
			if(document.getElementById("agent_tax_on_tax_amt_0")){
				document.getElementById("agent_tax_on_tax_amt_0").id = "agent_tax_on_tax_amt";
			}
			if(document.getElementById("agent_rebate_amt_0")){
				document.getElementById("agent_rebate_amt_0").id = "agent_rebate_amt";
			}
			if(document.getElementById("agent_total_fee_0")){
				document.getElementById("agent_total_fee_0").id = "agent_total_fee";
			}
		}
		
	}
	function getFeeDetails() {
		
		var childFeeNode = document.getElementById("fee_transaction_details_div").children;
		var childAgentNode = document.getElementById("fee_agent_details_div").children;
		if(childFeeNode.length > 1) {
			for(var i=1;i<childFeeNode.length;i++) {
				document.getElementById("fee_transaction_details_div").removeChild(childFeeNode[i]);
			}
		}
		if(childAgentNode.length > 1) {
			for(var j=1;j<childAgentNode.length;j++) {
				document.getElementById("fee_agent_details_div").removeChild(childAgentNode[j]);
			}
		}
		m.getFeeforGPP();
		 
		
	}
		function _validateFeesForms( /* Boolean */doRealValidation,
	/* Array */forms) {

		console.debug("[misys.common] Validating forms in the page ...");
		var _feesFormToValidateSelector = ".validate";
		var
		// Forms to validate. Reverse sort it so "fakeform0" is validated first
		formsToValidate = (forms || d.query(_feesFormToValidateSelector)).reverse(), draftTerm = dj.byId("draft_term"), result = true;

		if (draftTerm) {
			draftTerm.validate();
		}

		d.forEach(formsToValidate, function(form) {
			console.debug("[misys.common] Validating form", form.id);
			var formObj = dj.byId(form.id);

			// TODO Workaround, GridMultipleItems are not hooking into the
			// validation for
			// some reason. Despite their state being Error, the overall form
			// state is
			// empty. Calling _getState() explicitly seems to fix it.
			if (formObj._getState() !== "" || formObj.state !== "") {
				if (doRealValidation) {
					formObj.validate();
				}
				result = false;
			}
		});
		console.debug("[misys.common] Validation result", result);

		return result;
	}
		d.mixin(m, {
			viewFeeDetails : function() {
			if(dj.byId("is_view_fees_btn")) {
				dj.byId("is_view_fees_btn").set("value","true");
			}
			document.getElementById('ft_fee_details_div').style.display = "block";
			
				var validationsFees = [function(){return true;}],
			onErrorCallback,
			errorMessage;
			validationsFees.push(m.beforeSubmitValidations);
			errorMessage = m.getLocalization("mandatoryFieldsToSubmitErrorFees");
			onErrorCallback = function(){
							 
							 //form to be validated in every case
							 _validateFeesForms(true);
			
						 };
				if((d.every(validationsFees, function(f){return f();}))) {
							//document.getElementById('ftFeeFetails').style.display = "block";
							var gppFeeConfigAmtCur = dj.byId("gpp_fee_config_amt_cur_code") ? dj.byId("gpp_fee_config_amt_cur_code").get("value") : "",
							gppFeeConfigAmtValue = dj.byId("gpp_fee_config_amt_val") ? dj.byId("gpp_fee_config_amt_val").get("value") : "";
							if(((gppFeeConfigAmtCur === dj.byId("ft_cur_code").get("value"))|| gppFeeConfigAmtCur === '*') && (gppFeeConfigAmtValue < dj.byId("ft_amt").get("value"))) 
							{		
								getFeeDetails();
						
							} else if((gppFeeConfigAmtCur != dj.byId("ft_cur_code").get("value"))) {
								var amt = dj.byId("ft_amt") ? dj.byId("ft_amt").get("value") : "";
								var cur = dj.byId("ft_cur_code") ? dj.byId("ft_cur_code").get("value") : "";
								var bankAbbvName = dj.byId("issuing_bank_abbv_name") ? dj.byId("issuing_bank_abbv_name").get("value") : "";
								var toCurrencyAmount,toCurrency;
								m.xhrPost({
								url : m.getServletURL("/screen/AjaxScreen/action/GetConvertedCurrencyAmount"),
								handleAs : "json",
								sync : true,
								content : {
									amount:amt,
									currency:cur,
									bank_abbv_name:bankAbbvName,
									toCurrency:gppFeeConfigAmtCur
								},
								load : function(response, args)
								{
									if(response != false || response != "")
									{
										toCurrencyAmount = response.toCurrencyAmount ;
										toCurrency = response.toCurrency;
										if(dj.byId("to_currency")) {
											dj.byId("to_currency").set("value",toCurrency);
										}
										if(dj.byId("to_currency_amount")) {
											dj.byId("to_currency_amount").set("value",toCurrencyAmount);
										}
										if((gppFeeConfigAmtCur === toCurrency) && ((dojo.number.parse(gppFeeConfigAmtValue)) < toCurrencyAmount)) 
										{		
											getFeeDetails();
									
										} else {
											m.hideFeeDetails();
										}
									  
								} else {
									m.hideFeeDetailsForError();
									 document.getElementById('XSL_FEE_DETILS_ERROR').style.display = "block";
	
									}
									},
									error : function(response, args){
										console.error("[misys.grid._base] GetProductConfirmPopUp error", response);
									}
								});
								
							}  else {
								m.hideFeeDetails();
							}
				} else {

					if(errorMessage && errorMessage != "") {
						m.dialog.show("ERROR", errorMessage, "", onErrorCallback);
					}
				}

			},
			getFeeforGPP : function() {
				var accountNo = dj.byId("applicant_act_no") ? dj.byId("applicant_act_no").get("value") : "";
				var accountCur = dj.byId("applicant_act_cur_code") ? dj.byId("applicant_act_cur_code").get("value") : "";
				var amt = dj.byId("ft_amt") ? dj.byId("ft_amt").get("value") : "";
				var cur = dj.byId("ft_cur_code") ? dj.byId("ft_cur_code").get("value") : "";
				var iss_date = dj.byId("iss_date") ? dj.byId("iss_date").get("value") : "";
				if(iss_date){
					iss_date = iss_date.toISOString();
				}
				var product_code = dj.byId("productcode") ? dj.byId("productcode").get("value") : "";
				var sub_prod_code = dj.byId("sub_product_code") ? dj.byId("sub_product_code").get("value") : "";
				var bankAbbvName = dj.byId("issuing_bank_abbv_name") ? dj.byId("issuing_bank_abbv_name").get("value") : "";
				var companyId = dj.byId("company_id") ? dj.byId("company_id").get("value") : "";
				var paymentType;
				var onlineResponse = "";
				if(dj.byId("sub_product_code")) {
					if((dj.byId("sub_product_code").get("value") === 'INT') || dj.byId("sub_product_code").get("value") === 'TPT') {
						paymentType ="BOOK";
					} else if(dj.byId("sub_product_code").get("value") === 'MT103') {
						paymentType ="SWIFT";
					} else if(dj.byId("sub_product_code").get("value") === 'RTGS') {
						paymentType ="RTGS";
					}
				}
				
				var charge_bearer = "SLEV";
				if(dj.byId("sub_product_code") && (dj.byId("sub_product_code").get("value") === 'MT103' || dj.byId("sub_product_code").get("value") === 'RTGS'))
				{
					charge_bearer = dj.byId("charge_option") ? dj.byId("charge_option").get("value") : "";
					if(charge_bearer === "SHA")
					{
						charge_bearer = "SHAR";
					}
					else if(charge_bearer === "OUR")
					{
						charge_bearer = "DEBT";
					}
					else if(charge_bearer === "BEN")
					{
						charge_bearer = "CRED";
					}
				}
				var bicCode = dj.byId("issuing_bank_iso_code") ? dj.byId("issuing_bank_iso_code").get("value") : "";
					m.xhrPost({
						url : m.getServletURL("/screen/AjaxScreen/action/GetFeeAPIAction"),
						handleAs : "json",
						sync : true,
						content : {
							accountIdentification : accountNo,
							accountCurrency : accountCur,
							bic:bicCode,
							amount:amt,
							currency:cur,
							valueDate:iss_date,
							clearingScheme:paymentType,
							ChargeBearer:charge_bearer,
							productcode:product_code,
							sub_product_code:sub_prod_code,
							bank_abbv_name:bankAbbvName,
							company_id:companyId,
							ft_tnx_data:m.formToXML()
						},
						load : function(response, args)
						{
							if(response.getFeeFlag === true && response.statusCode === "200")
							{	
								
								document.getElementById('FEE_DETAILS_CONFIRMATION_DISCLAIMER').style.display = "none";
								dj.byId("add_fee_details_button").set('disabled', true);
								if(dj.byId("response_status")) {
									dj.byId("response_status").set("value", response.statusCode);
								}
								var feesInfo = [],taxInfo = [],tanOnTaxInfo = [];
								var feeName,feeCurrency,feeAmount,payingParty,taxAmt,taxOnTaxAmt,rebate,taxCurrency,taxOnTaxCurrency;
								feesInfo= response.feesInformation;
								taxInfo= response.taxInformation;
								tanOnTaxInfo = response.taxOnTaxInformation;
								var debitFeeCount=0,agentFeeCount = 0;
								var totalTransFee=0,totalAgentFee = 0;
								var feesInfodetails = {};
								var DebitfeesInformation = [],AgentfeesInformation = [];
								feesInfodetails.DebitfeesInformation = DebitfeesInformation;
								feesInfodetails.AgentfeesInformation = AgentfeesInformation;
								var debitFeesInfo = {};
								var agentFeesInfo = {};
								var totalFee = 0, grandTotal = 0;
								var totalTransFees = 0,totalAgentFees = 0;
								var debitFeesCount = 0,agentFeesCount = 0 ;
								var validResponse = true;
								for(var i=0;i<feesInfo.length;i++) {
									if(feesInfo[i].feeName == "" || feesInfo[i].feeName == null || feesInfo[i].feeName == undefined){
										validResponse =  false;
									}
									if(feesInfo[i].payingParty === 'DR') {
										debitFeesCount = debitFeesCount + 1 ;
									} else if(feesInfo[i].payingParty === 'AF') {
										agentFeesCount = agentFeesCount +1;
									}
									
								}
							if(validResponse == true) {
							   if(feesInfo.length==1 && feesInfo[0].payingParty=="CR")
							   {
							      m.hideFeeDetailsForCR();
							   }
							   else
							   {
								for(i=0;i<feesInfo.length;i++) {
						
										feeName = feesInfo[i].feeName;
										feeCurrency = feesInfo[i].feeCurrency;
										feeAmount = (feesInfo[i].feeAmount);
										payingParty= feesInfo[i].payingParty;
										taxAmt= (taxInfo[i].taxAmount);
										taxCurrency = feesInfo[i].feeCurrency;
										taxOnTaxAmt = (tanOnTaxInfo[i].taxOnTaxAmount);
										taxOnTaxCurrency = feesInfo[i].feeCurrency;
										rebate = taxInfo[i].rebate;
										totalFee =  (feeAmount + taxAmt + taxOnTaxAmt);
										if((i === ((feesInfo.length)-1)) && debitFeesCount >= 1 && agentFeesCount >= 1){
											grandTotal = totalTransFee + totalAgentFee + totalFee ;
										}
										if(payingParty === 'DR') {
											totalTransFee = totalTransFee + (feeAmount + taxAmt + taxOnTaxAmt);
											debitFeeCount = debitFeeCount +1;	
											if(debitFeesCount > 1 && debitFeesCount === debitFeeCount) {
												totalTransFees = totalTransFee;
											}
											debitFeesInfo = {
													"feeAmount":feeAmount.toFixed(2),
													"feeCurrency": feeCurrency,
													"feeName": feeName,
													"taxAmount": taxAmt.toFixed(2),
													"taxOnTaxAmount": taxOnTaxAmt.toFixed(2),
													"rebate": rebate,
													"payingParty":'DR',
													"totalFee":totalFee.toFixed(2),
													"totalTransFee":totalTransFees.toFixed(2),
													"GrandTotal" : grandTotal.toFixed(2)
											};
											feesInfodetails.DebitfeesInformation.push(debitFeesInfo);
											}
										if(payingParty === 'AF') {
											totalAgentFee = totalAgentFee + (feeAmount + taxAmt + taxOnTaxAmt);
											agentFeeCount = agentFeeCount +1;
											if(agentFeesCount > 1 && agentFeesCount === agentFeeCount) {
												totalAgentFees = totalAgentFee;
											}
											agentFeesInfo = {
													"feeAmount":feeAmount.toFixed(2),
													"feeCurrency": feeCurrency,
													"feeName": feeName,
													"taxAmount": taxAmt.toFixed(2),
													"taxOnTaxAmount": taxOnTaxAmt.toFixed(2),
													"rebate": rebate,
													"payingParty":'AF',
													"totalFee":totalFee.toFixed(2),
													"totalAgentFee":totalAgentFees.toFixed(2),
													"GrandTotal" : grandTotal.toFixed(2)
											};
											feesInfodetails.AgentfeesInformation.push(agentFeesInfo);
											
										}
										_setFeeDetails(rebate,feeName,feeCurrency,feeAmount.toFixed(2),payingParty,taxAmt.toFixed(2),taxCurrency,taxOnTaxAmt.toFixed(2),taxOnTaxCurrency,debitFeeCount,agentFeeCount,totalFee.toFixed(2));
									}
								if(dj.byId("payment_fee_details")) {
									dj.byId("payment_fee_details").set("value", JSON.stringify(feesInfodetails));
								}
								console.log(JSON.stringify(feesInfodetails));
								if(debitFeeCount > 1){
									if(document.getElementById("total_transaction_fee_details")){
										document.getElementById("total_transaction_fee_details").style.display = "block";
										document.getElementById("total_transaction_fees").value = (feesInfo[0].feeCurrency).concat(' ').concat(totalTransFee.toFixed(2));
									}
								}
								if(agentFeeCount > 1){
									if(document.getElementById("total_agent_fee_details")){
										document.getElementById("total_agent_fee_details").style.display = "block";
										document.getElementById("total_agent_fees").value = (feesInfo[0].feeCurrency).concat(' ').concat(totalAgentFee.toFixed(2));
									}
								}
								if(debitFeeCount >= 1 && agentFeeCount >= 1) {
									if(document.getElementById("grand_total_fee_details")){
										document.getElementById("grand_total_fee_details").style.display = "block";
										document.getElementById("grand_total_fees").value = (feesInfo[0].feeCurrency).concat(' ').concat(dojo.currency.format(grandTotal.toFixed(2)));
									}
								}
								m.showFeeDetailsSection();
								onlineResponse = response;
						      }
							} else {
								if(dj.byId("payment_fee_details")) {
									dj.byId("payment_fee_details").set("value", "");
								}
								m.hideFeeDetails();
								
							}
						}
							else
							{
								if(dj.byId("payment_fee_details")) {
									dj.byId("payment_fee_details").set("value", "");
								}
								if(dj.byId("response_status")) {
									dj.byId("response_status").set("value", "404");
								}
								m.hideFeeDetailsForError();
								document.getElementById('XSL_FEE_DETILS_ERROR').style.display = "block";
								onlineResponse = response;
							}
						},
						error : function(response, args){
							console.error("[misys.grid._base] GetProductConfirmPopUp error", response);
						}
					});
					return onlineResponse;
			},
			hideFeeDetails : function() {
				document.getElementById('NO_FEE_DETAILS_DISCLAIMER').style.display = "block";
				document.getElementById('FEE_DETAILS_DISCLAIMER').style.display = "none";
				document.getElementById('fee_details_div').style.display = "none";
				document.getElementById("FEE_CHARGES_DETAILS_DISCLAIMER").style.display = "none";
				document.getElementById('grand_total_fee_details').style.display = "none";
				document.getElementById('FEE_DETAILS_CONFIRMATION_DISCLAIMER').style.display = "none";
				document.getElementById('NO_FEE_DETAILS_DISCLAIMER_BEN').style.display = "none";
				dj.byId("add_fee_details_button").set('disabled', true);
			},
			hideFeeDetailsForError: function() {
				document.getElementById('NO_FEE_DETAILS_DISCLAIMER').style.display = "none";
				document.getElementById('FEE_DETAILS_DISCLAIMER').style.display = "none";
				document.getElementById('fee_details_div').style.display = "none";
				document.getElementById("FEE_CHARGES_DETAILS_DISCLAIMER").style.display = "none";
				document.getElementById('grand_total_fee_details').style.display = "none";
				document.getElementById('FEE_DETAILS_CONFIRMATION_DISCLAIMER').style.display = "none";
				document.getElementById('XSL_FEE_DETILS_ERROR').style.display = "none";
			    document.getElementById('NO_FEE_DETAILS_DISCLAIMER_BEN').style.display = "none";
				dj.byId("add_fee_details_button").set('disabled', true);
			},
			hideAllDisclaimerMessages: function() {
				document.getElementById('NO_FEE_DETAILS_DISCLAIMER').style.display = "none";
				document.getElementById('FEE_DETAILS_DISCLAIMER').style.display = "none";
				document.getElementById('FEE_DETAILS_CONFIRMATION_DISCLAIMER').style.display = "none";
				document.getElementById("FEE_CHARGES_DETAILS_DISCLAIMER").style.display = "none";
				document.getElementById('NO_FEES_FOR_RECCURING_PAYMENT').style.display = "none";
				document.getElementById('XSL_FEE_DETILS_ERROR').style.display = "none";
			    document.getElementById('NO_FEE_DETAILS_DISCLAIMER_BEN').style.display = "none";
			},
			hideFeeDetailsForCR: function() {
			    document.getElementById('NO_FEE_DETAILS_DISCLAIMER_BEN').style.display = "block";
			    document.getElementById('NO_FEE_DETAILS_DISCLAIMER').style.display = "none";
				document.getElementById('FEE_DETAILS_DISCLAIMER').style.display = "none";
				document.getElementById('FEE_DETAILS_CONFIRMATION_DISCLAIMER').style.display = "none";
				document.getElementById("FEE_CHARGES_DETAILS_DISCLAIMER").style.display = "none";
				document.getElementById('NO_FEES_FOR_RECCURING_PAYMENT').style.display = "none";
				document.getElementById('XSL_FEE_DETILS_ERROR').style.display = "none";
			},
			showFeeDetailsSection: function() {
				 document.getElementById('FEE_DETAILS_DISCLAIMER').style.display = "block";
				 document.getElementById('fee_details_div').style.display = "block";
				 document.getElementById('NO_FEE_DETAILS_DISCLAIMER').style.display = "none";
				 document.getElementById("FEE_CHARGES_DETAILS_DISCLAIMER").style.display = "block";
				 document.getElementById('XSL_FEE_DETILS_ERROR').style.display = "none";
				 document.getElementById('NO_FEE_DETAILS_DISCLAIMER_BEN').style.display = "none";
				 
			}
		});
	
})(dojo, dijit, misys);//Including the client specific implementation
dojo.require('misys.client.binding.cash.paymentFees_client');

