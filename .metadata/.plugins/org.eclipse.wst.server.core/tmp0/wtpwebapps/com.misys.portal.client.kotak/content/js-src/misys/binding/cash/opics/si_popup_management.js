dojo.provide("misys.binding.cash.opics.si_popup_management");
/*
 -----------------------------------------------------------------------------
 Scripts for
  
  Standing Instruction (FT) Popup Management, Bank Payments
  

 Copyright (c) 2000-2012 Misys (http://www.misys.com),
 All Rights Reserved. 

 version:   1.0
 date:      
 author:    
 -----------------------------------------------------------------------------
*/

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {
	// insert private functions & variables
	
	_fncDoDisplay = function(/*String*/ field, /*String*/ data){
		if (data && data !== ""){
			dojo.query("#summary_"+field+"_row div.content").forEach(function(div){div.innerHTML = data;});
			
			if (dojo.byId("summary_"+field+"_row")){
				dojo.style(dojo.byId("summary_"+field+"_row"), "display", "");
			}
		}
		else{
			dojo.query("#summary_"+field+"_row div.content").forEach(function(div){div.innerHTML = null;});
			if (dojo.byId("summary_"+field+"_row")){
				dojo.style(dojo.byId("summary_"+field+"_row"), "display", "none");
			}
		}
		if (dijit.byId(field)){
			dijit.byId(field).set("value", data);
		}
	};
	
	_fncDoDisplayFieldNameForEmptyValue = function(/*String*/ field, /*String*/ data){
		if (data && data !== ""){
			dojo.query("#summary_"+field+"_row div.content").forEach(function(div){div.innerHTML = data;});
			
			if (dojo.byId("summary_"+field+"_row")){
				dojo.style(dojo.byId("summary_"+field+"_row"), "display", "");
			}
		}
		else{
			dojo.query("#summary_"+field+"_row div.content").forEach(function(div){div.innerHTML = "";});
		}
		if (dijit.byId(field)){
			dijit.byId(field).set("value", data);
		}
	};
	
	_fncBlankSummaryStyle = function(/*String*/ field){
		
		if (dojo.byId("summary_"+field+"_row")){
			dojo.style(dojo.byId("summary_"+field+"_row"), "display", "none");
		}
	};

	
	// Public functions & variables follow
	d.mixin(m, {
	
	
		//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
		// Summary PopUp
		//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*

		showSiDialog : function(/*JSON*/ data, prefix){
			var status = data.status;
	
			dijit.byId(prefix + "siDialog").show();
			
			// hidden fields
			//dijit.byId("hidden_field").set("value", data.);
			

			// populate fields
			_fncDoDisplay(prefix + "si_currency", data.currency);
			_fncDoDisplay(prefix + "si_instruction_indicator", data.instruction_indicator);
			_fncDoDisplay(prefix + "si_beneficiary_institution", data.beneficiary_institution);
			_fncDoDisplay(prefix + "si_beneficiary_account", data.beneficiary_account);
			_fncDoDisplay(prefix + "si_beneficiary_account_bic", data.beneficiary_bank_bic);
			
			_fncDoDisplay(prefix + "si_account_with_institution", data.account_with_institution);
			_fncDoDisplay(prefix + "si_account_with_institution_BIC", data.account_with_institution_BIC);
			
			_fncDoDisplay(prefix + "si_settlement_means", data.settlementMeans);
			_fncDoDisplay(prefix + "si_settlement_account", data.account);

			if (data.additionalBankInstructions) {
				_fncDoDisplay(prefix + "si_intermediary_bank", data.additionalBankInstructions[0].intermediary_bank);
				_fncDoDisplay(prefix + "si_intermediary_bank_bic", data.additionalBankInstructions[0].intermediary_bic);
				
				if((data.additionalBankInstructions[0].intermediary_address && data.additionalBankInstructions[0].intermediary_address !== "")  ||
						(data.additionalBankInstructions[0].intermediary_city && data.additionalBankInstructions[0].intermediary_city !== "")  ||
						(data.additionalBankInstructions[0].intermediary_country_code && data.additionalBankInstructions[0].intermediary_country_code !== "")){
							_fncDoDisplayFieldNameForEmptyValue(prefix + "si_intermediary_bank_street", data.additionalBankInstructions[0].intermediary_address);
							_fncDoDisplay(prefix + "si_intermediary_bank_city", data.additionalBankInstructions[0].intermediary_city);
							_fncDoDisplay(prefix + "si_intermediary_bank_country", data.additionalBankInstructions[0].intermediary_country_code);
						}else{
							_fncBlankSummaryStyle(prefix + "si_intermediary_bank_street");
							_fncBlankSummaryStyle(prefix + "si_intermediary_bank_city");
							_fncBlankSummaryStyle(prefix + "si_intermediary_bank_country");
						}
				

				_fncDoDisplay(prefix + "si_intermediary_bank_account_number", data.additionalBankInstructions[0].intermediary_bank_account_number);
				
				var iban = data.additionalBankInstructions[0].intermediary_bank_account_number;
			    if(iban && iban[0])
				{
					if (iban[0].substring(0,1) === "/") { 
						_fncDoDisplay(prefix + "si_intermediary_bank_aba", iban[0].substring(1));
					}
					else
					{
						_fncDoDisplay(prefix + "si_intermediary_bank_aba", data.additionalBankInstructions[0].intermediary_bank_account_number);
					}
				 }
				
				_fncDoDisplay(prefix + "si_intermediary_bank_instruction_1", data.additionalBankInstructions[0].routing_instructions_1);
				_fncDoDisplay(prefix + "si_intermediary_bank_instruction_2", data.additionalBankInstructions[0].routing_instructions_2);
				_fncDoDisplay(prefix + "si_intermediary_bank_instruction_3", data.additionalBankInstructions[0].routing_instructions_3);
				_fncDoDisplay(prefix + "si_intermediary_bank_instruction_4", data.additionalBankInstructions[0].routing_instructions_4);
				_fncDoDisplay(prefix + "si_intermediary_bank_instruction_5", data.additionalBankInstructions[0].routing_instructions_5);
				_fncDoDisplay(prefix + "si_intermediary_bank_instruction_6", data.additionalBankInstructions[0].routing_instructions_6);

				_fncDoDisplay(prefix + "si_additional_detail_1", data.additionalBankInstructions[0].payment_details_1);
				_fncDoDisplay(prefix + "si_additional_detail_2", data.additionalBankInstructions[0].payment_details_2);
				_fncDoDisplay(prefix + "si_additional_detail_3", data.additionalBankInstructions[0].payment_details_3);
				_fncDoDisplay(prefix + "si_additional_detail_4", data.additionalBankInstructions[0].payment_details_4);

				if ((data.additionalBankInstructions[0].swift_charges_type && data.additionalBankInstructions[0].swift_charges_type !== "") ||
						(data.additionalBankInstructions[0].ordering_cust_name && data.additionalBankInstructions[0].ordering_cust_name !== "") ||
						(data.additionalBankInstructions[0].ordering_cust_address && data.additionalBankInstructions[0].ordering_cust_address !== "") ||
						(data.additionalBankInstructions[0].ordering_cust_citystate && data.additionalBankInstructions[0].ordering_cust_citystate !== "") ||
						(data.additionalBankInstructions[0].ordering_cust_country && data.additionalBankInstructions[0].ordering_cust_country !== "") ||
						(data.additionalBankInstructions[0].ordering_cust_account && data.additionalBankInstructions[0].ordering_cust_account !== "") ||
						(data.settlementMeans &&  data.settlementMeans !== "") ||
						(data.account &&  data.account !== ""))
				{
				     if(d.byId("paymentBeneficiaryPopup"))
				     {
						d.style(d.byId("paymentBeneficiaryPopup"), "display", "block");
				     }
				}
				else {
				     if(d.byId("paymentBeneficiaryPopup"))
				     {
						d.style(d.byId("paymentBeneficiaryPopup"), "display", "none");
				     }
				}

				if ((data.additionalBankInstructions[0].intermediary_bic && data.additionalBankInstructions[0].intermediary_bic !== "") ||
					(data.additionalBankInstructions[0].intermediary_address && data.additionalBankInstructions[0].intermediary_address !== "") ||		
					(data.additionalBankInstructions[0].intermediary_city && data.additionalBankInstructions[0].intermediary_city !== "") ||		
					(data.additionalBankInstructions[0].intermediary_country_code && data.additionalBankInstructions[0].intermediary_country_code !== "") ||		
					(data.additionalBankInstructions[0].intermediary_bank_account_number && data.additionalBankInstructions[0].intermediary_bank_account_number !== "") ||							
					(data.additionalBankInstructions[0].routing_instructions_1 && data.additionalBankInstructions[0].routing_instructions_1 !== "") ||		
					(data.additionalBankInstructions[0].routing_instructions_2 && data.additionalBankInstructions[0].routing_instructions_2 !== "") ||		
					(data.additionalBankInstructions[0].routing_instructions_3 && data.additionalBankInstructions[0].routing_instructions_3 !== "") ||		
					(data.additionalBankInstructions[0].routing_instructions_4 && data.additionalBankInstructions[0].routing_instructions_4 !== "") ||		
					(data.additionalBankInstructions[0].routing_instructions_5 && data.additionalBankInstructions[0].routing_instructions_5 !== "") ) {
					d.style(d.byId("additionalDetailsPopup"), "display", "block");
				}
				else {
					d.style(d.byId("additionalDetailsPopup"), "display", "none");
				}
				
				if ((data.additionalBankInstructions[0].payment_details_1 && data.additionalBankInstructions[0].payment_details_1 !== "") ||
				    (data.additionalBankInstructions[0].payment_details_2 && data.additionalBankInstructions[0].payment_details_2 !== "") ||
				    (data.additionalBankInstructions[0].payment_details_3 && data.additionalBankInstructions[0].payment_details_3 !== "") ||
				    (data.additionalBankInstructions[0].payment_details_4 && data.additionalBankInstructions[0].payment_details_4 !== "") ) {
					d.style(d.byId("paymentDetailsPopup"), "display", "block");
				}
				else {
					d.style(d.byId("paymentDetailsPopup"), "display", "none");
				}
				

				if (data.additionalBankInstructions[0].swift_charges_type === "OUR"){
					_fncDoDisplay(prefix + "si_swift_charges_type", dijit.byId("summary_" + prefix + "si_swift_charges_type_01").get("value"));
				} else if (data.additionalBankInstructions[0].swift_charges_type === "BEN") {
					_fncDoDisplay(prefix + "si_swift_charges_type", dijit.byId("summary_" + prefix + "si_swift_charges_type_02").get("value"));
				} else if (data.additionalBankInstructions[0].swift_charges_type === "SHA") {
					_fncDoDisplay(prefix + "si_swift_charges_type", dijit.byId("summary_" + prefix + "si_swift_charges_type_05").get("value"));
				} else {
					_fncDoDisplay(prefix + "si_swift_charges_type", data.additionalBankInstructions[0].swift_charges_type);
				}
				_fncDoDisplay(prefix + "si_ordering_cust_name", data.additionalBankInstructions[0].ordering_cust_name);
				if ((data.additionalBankInstructions[0].ordering_cust_address && data.additionalBankInstructions[0].ordering_cust_address !== "") ||
						(data.additionalBankInstructions[0].ordering_cust_citystate && data.additionalBankInstructions[0].ordering_cust_citystate !== "") ||
						(data.additionalBankInstructions[0].ordering_cust_country && data.additionalBankInstructions[0].ordering_cust_country !== "")){
					_fncDoDisplayFieldNameForEmptyValue(prefix + "si_ordering_cust_address", data.additionalBankInstructions[0].ordering_cust_address);
					_fncDoDisplay(prefix + "si_ordering_cust_citystate", data.additionalBankInstructions[0].ordering_cust_citystate);
					_fncDoDisplay(prefix + "si_ordering_cust_country", data.additionalBankInstructions[0].ordering_cust_country);
				}else{
					_fncBlankSummaryStyle(prefix + "si_ordering_cust_address");
					_fncBlankSummaryStyle(prefix + "si_ordering_cust_citystate");
					_fncBlankSummaryStyle(prefix + "si_ordering_cust_country");
				}

				_fncDoDisplay(prefix + "si_ordering_cust_account", data.additionalBankInstructions[0].ordering_cust_account);
			} 
			else {
				_fncDoDisplay(prefix + "si_intermediary_bank", null);
				_fncDoDisplay(prefix + "si_intermediary_bank_bic", null);
				
				_fncDoDisplay(prefix + "si_intermediary_bank_street", null);
				_fncDoDisplay(prefix + "si_intermediary_bank_city", null);
				_fncDoDisplay(prefix + "si_intermediary_bank_country", null);
				
				_fncDoDisplay(prefix + "si_intermediary_bank_account_number", null);
				_fncDoDisplay("si_intermediary_bank_aba", null);
				
				_fncDoDisplay(prefix + "si_intermediary_bank_instruction_1", null);
				_fncDoDisplay(prefix + "si_intermediary_bank_instruction_2", null);
				_fncDoDisplay(prefix + "si_intermediary_bank_instruction_3", null);
				_fncDoDisplay(prefix + "si_intermediary_bank_instruction_4", null);
				_fncDoDisplay(prefix + "si_intermediary_bank_instruction_5", null);
				_fncDoDisplay(prefix + "si_intermediary_bank_instruction_6", null);
				
				_fncDoDisplay(prefix + "si_additional_detail_1", null);
				_fncDoDisplay(prefix + "si_additional_detail_2", null);
				_fncDoDisplay(prefix + "si_additional_detail_3", null);
				_fncDoDisplay(prefix + "si_additional_detail_4", null);
				
				_fncDoDisplay(prefix + "si_swift_charges_type", null);
				_fncDoDisplay(prefix + "si_ordering_cust_name", null);
				
				_fncDoDisplay(prefix + "si_ordering_cust_address", null);
				_fncDoDisplay(prefix + "si_ordering_cust_citystate", null);
				_fncDoDisplay(prefix + "si_ordering_cust_country", null);
				
				_fncDoDisplay(prefix + "si_ordering_cust_account", null);
			}
		},

		closeSiDialog : function(/* String */ prefix){
			
			if (prefix!=null && prefix !=""){
				prefix=prefix+"_";
			}else
			{
				prefix="";
			}			
			
			dijit.byId(prefix + "siDialog").hide();
		}
	});
})(dojo, dijit, misys);
