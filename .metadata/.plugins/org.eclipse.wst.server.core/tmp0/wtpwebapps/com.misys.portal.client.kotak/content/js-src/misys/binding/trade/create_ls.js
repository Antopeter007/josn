dojo.provide("misys.binding.trade.create_ls");

//
// Copyright (c) 2000-2011 Misys (http://www.m.com),
// All Rights Reserved. 
//
//
// Summary: 
//      Event Binding for License (LS) Form, Customer Side.
//
// version:   1.2
// date:      08/04/11
//

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
dojo.require("misys.form.SimpleTextarea");
dojo.require("misys.widget.Collaboration");
dojo.require("misys.form.common");
dojo.require("misys.form.file");
dojo.require("misys.validation.common");
dojo.require("misys.binding.trade.ls_common");
dojo.require("misys.binding.SessionTimer");


(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode
	
	//
	// Private functions & variables
	//
    // dojo.subscribe once a record is deleted from the grid
    var _deleteGridRecord = "deletegridrecord";

	//
	// Public functions & variables
	
	d.mixin(m._config, {

		initReAuthParams : function() {
									
			var reAuthParams = {
				productCode : "LS",	
				subProductCode : "",
				transactionTypeCode : "01",	
				entity : dj.byId("entity") ? dj.byId("entity").get("value") : "",
				currency : dj.byId("ls_cur_code") ? dj.byId("ls_cur_code").get("value") : "",
				amount : dj.byId("ls_amt") ? m.trimAmount(dj.byId("ls_amt").get("value")) : "",
				bankAbbvName :	dj.byId("issuing_bank_abbv_name")? dj.byId("issuing_bank_abbv_name").get("value") : "",
								
				es_field1 : "",
				es_field2 : ""				
			};
			return reAuthParams;
		}
	});
			
	//
	d.mixin(m, {
		bind : function() {
			m.setValidation("template_id", m.validateTemplateId);
			m.setValidation("pstv_tol_pct", m.validateTolerance);
			m.setValidation("neg_tol_pct", m.validateTolerance);
			m.setValidation("ls_cur_code", m.validateCurrency);
			m.setValidation("beneficiary_country", m.validateCountry);
			m.setValidation("reg_date", m.validateRegDate);
			m.setValidation("iss_date", m.validateIssueDate);
			m.setValidation("valid_from_date", m.validateValidFromDate);
			m.setValidation("valid_to_date", m.validateValidToDate);
			m.setValidation("latest_payment_date", m.validateLatestPaymentDate);
			m.setValidation("origin_country", m.validateCountry);
			m.setValidation("supply_country", m.validateCountry);
			m.setValidation("narrative_description_goods", m.validateDescriptionGoods);
			// onChange
			m.connect("ls_cur_code", "onChange", function(){
				dj.byId("additional_cur_code").set("value",this.get("value"));
				dj.byId("total_cur_code").set("value",this.get("value"));
				m.setCurrency(this, ["ls_amt","additional_amt","total_amt"]);
			});
			m.connect("issuing_bank_abbv_name", "onChange", m.populateReferences);
			m.connect("issuing_bank_abbv_name", "onChange", m.updateBusinessDate);
			if(dj.byId("issuing_bank_abbv_name"))
			{
				m.connect("entity", "onChange", function(){
					dj.byId("issuing_bank_abbv_name").onChange();});
			}
			m.connect("issuing_bank_customer_reference", "onChange", m.setApplicantReference);
			m.connect("inco_term", "onChange", function(){
				m.toggleFields(this.get("value"), null, ["inco_place"], false, false);
			});
			m.connect("inco_term_year", "onChange", function(){
				m.toggleFields(this.get("value"), null, ["inco_term"], false, true);
			});
			m.connect("additional_amt", "onBlur", function(){
				m.calculateTotalAmt();
			});
			
			m.connect("ls_amt", "onChange", function(){
				m.calculateTotalAmt();
			});
			m.connect("narrative_description_goods", "onBlur", function(){
				m.descGoodsMaxCharValidation();
			});
			m.connect("additional_amt", "onBlur", function(){
				if(dj.byId("narrative_additional_amount") && (this.get("value") !== "" && !isNaN(this.get("value")) && this.get("value") !== 0))
				{
					dj.byId("narrative_additional_amount").set("disabled", false);
					m.toggleRequired("narrative_additional_amount", true);
					d.byId("narrative_additional_amount_img").style.display = "block";
					dj.byId("narrative_additional_amount_img").set("disabled", false);
				}
				else
				{
					dj.byId("narrative_additional_amount").set("disabled", true);
					dj.byId("narrative_additional_amount").set("value", "");
					m.toggleRequired("narrative_additional_amount", false);
					d.byId("narrative_additional_amount_img").style.display = "none";
					dj.byId("narrative_additional_amount_img").set("disabled", true);
				}
				//m.calculateTotalAmt();
			});
			m.connect("valid_from_date", "onChange", m.setValidToDate);
			m.connect("valid_for_nb", "onBlur", m.setValidToDate);
			m.connect("valid_for_nb", "onBlur",function(){
				if(dj.byId("valid_for_period") && (this.get("value") !== "" && !isNaN(this.get("value"))))
				{
					dj.byId("valid_for_period").set("disabled", false);
					dj.byId("valid_for_period").set("required", true);
				}
				else
				{
					dj.byId("valid_for_period").set("disabled", true);
					dj.byId("valid_for_period").set("required", false);
					dj.byId("valid_for_period").set("value", "");
				}
			});
			m.connect("valid_for_period", "onChange", m.setValidToDate);
			m.connect("issuing_bank_abbv_name", "onChange",  function(){
				if(dj.byId("issuing_bank_abbv_name").get("value")!="")
			{
					m.getIncoYear();
			}
			});
			m.connect("inco_term_year", "onChange",m.getIncoTerm);
	
			m.connect("inco_term_year", "onClick",function(){
				if(dj.byId("issuing_bank_abbv_name").get("value")=="" &&  (this.store._arrayOfAllItems==undefined || this.store._arrayOfAllItems.length==0))
					{
					m.dialog.show("ERROR", m.getLocalization("selectBankToProceed"), '', '');
					}
			});
			m.connect("inco_term", "onClick",function(){
				if(dj.byId("issuing_bank_abbv_name").get("value")=="" &&  (this.store._arrayOfAllItems==undefined || this.store._arrayOfAllItems.length==0))
					{
					m.dialog.show("ERROR", m.getLocalization("selectBankToProceed"), '', '');
					}
				else if (dj.byId("inco_term_year").get("value")=="" &&  (this.store._arrayOfAllItems==undefined || this.store._arrayOfAllItems.length==0))
					{
					m.dialog.show("ERROR", m.getLocalization("selectIncoYearToProceed"), '', '');
					}
			});
		},
	
		calculateTotalAmt: function() {
			if(dj.byId("additional_amt") && dj.byId("ls_amt") && dj.byId("total_amt"))
			{
				var additionalAmount = isNaN(dj.byId("additional_amt").get("value")) ? 0 : dj.byId("additional_amt").get("value"); 
				var licenseAmount = isNaN(dj.byId("ls_amt").get("value")) ? 0 : dj.byId("ls_amt").get("value"); 
				var totalAmount = additionalAmount + licenseAmount;
				dj.byId("total_amt").set("value", totalAmount);
			}	
		},
		
		descGoodsMaxCharValidation: function() {
			if(dj.byId("narrative_description_goods"))
			{	
				dj.byId("narrative_description_goods").set("value", dj.byId("narrative_description_goods").value.replace(/\n/g, " "));
				var strInput = dj.byId("narrative_description_goods").get('value');
				
				if(strInput.length > 35){
					return false;					
				}				
			}
		},
		
		onFormLoad : function() {
			//  summary:
		    //          Events to perform on page load.

			// Additional onload events for dynamic fields
			m.setCurrency(dj.byId("ls_cur_code"), ["ls_amt","additional_amt","total_amt"]);
			
			if(dj.byId("additional_amt") && dj.byId("narrative_additional_amount") && dj.byId("additional_amt").get("value") !== "" && !isNaN(dj.byId("additional_amt").get("value")) && dj.byId("additional_amt").get("value") !== 0)
			{
				dj.byId("narrative_additional_amount").set("disabled", false);
				m.toggleRequired("narrative_additional_amount", true);
				if(d.byId("narrative_additional_amount_img")){
					d.byId("narrative_additional_amount_img").style.display = "block";
					dj.byId("narrative_additional_amount_img").set("disabled", false);
				}
				
			}
			else
			{
				dj.byId("narrative_additional_amount").set("disabled", true);
				dj.byId("narrative_additional_amount").set("value", "");
				m.toggleRequired("narrative_additional_amount", false);
				if(d.byId("narrative_additional_amount_img")){
					d.byId("narrative_additional_amount_img").style.display = "none";
					dj.byId("narrative_additional_amount_img").set("disabled", true);
				}
			}
			if(dj.byId("ls_bank") && dj.byId("ls_bank").get("value")!=null && dj.byId("ls_bank").get("value")!="")
				{
				dj.byId('issuing_bank_abbv_name').set("displayedValue",dj.byId("ls_bank").get("value"));
				dj.byId('issuing_bank_abbv_name').set("disabled",true);
				}
			if(dj.byId("valid_for_nb") && dj.byId("valid_for_period") && dj.byId("valid_for_nb").get("value") !== "" && !isNaN(dj.byId("valid_for_nb").get("value")))
			{
				dj.byId("valid_for_period").set("disabled", false);
				dj.byId("valid_for_period").set("required", true);
				if(dj.byId("valid_for_period").get("value") !== "" && dj.byId("valid_to_date"))
				{
					dj.byId("valid_to_date").set("disabled", true);
				}
			}
			else
			{
				dj.byId("valid_for_period").set("disabled", true);
				dj.byId("valid_for_period").set("required", false);
			}
			// Populate references
			var issuingBankAbbvName = dj.byId("issuing_bank_abbv_name");
			if(issuingBankAbbvName) {
				issuingBankAbbvName.onChange();
			}
			
			var issuingBankCustRef = dj.byId("issuing_bank_customer_reference");
			if(issuingBankCustRef) {
				issuingBankCustRef.onChange();
			}
			
			var incoTerm = dj.byId("inco_term") ? dj.byId("inco_term").get("value") : "";
			if(incoTerm) {
				m.toggleFields(incoTerm, null, ["inco_place"], false, true);
			}
			else{
				m.toggleFields(incoTerm, null, ["inco_place"], false, false);
			}
			if(dj.byId("inco_term_year"))
			{
				m.getIncoYear();
				dijit.byId("inco_term_year").set("value",dj.byId("org_term_year").get("value"));
			}
		if(dj.byId("inco_term"))
		{
			if(dj.byId("issuing_bank_abbv_name") && dj.byId("issuing_bank_abbv_name").get("value")!="" && dj.byId("inco_term_year") && dj.byId("inco_term_year").get("value")!="")
			{
				m.getIncoTerm();
			}
			
			dijit.byId("inco_term").set("value",dj.byId("org_inco_term").get("value"));	
		
		}
			
		}, 
		
		beforeSaveValidations : function(){
			if(dj.byId("total_amt"))
			{
				m.setTnxAmt(dj.byId("total_amt").get("value"));
			}
	    	var entity = dj.byId("entity") ;
	    	if(entity && entity.get("value")=== "")
            {
                    return false;
            }
            else
            {
                    return true;
            }
        },
		
		
		beforeSubmitValidations : function(){
			var valid = true;
			if(dj.byId("total_amt"))
			{
				if(dj.byId("total_amt").get("value") === 0)
				{
					m._config.onSubmitErrorMsg = m.getLocalization("invalidLSTotalAmtError");
					console.debug("Invalid Total Amount. Total Amount cannot be zero.");
					valid =  false;
				}
				else
				{
					m.setTnxAmt(dj.byId("total_amt").get("value"));
				}
			}
			if(dj.byId("issuing_bank_abbv_name") && !m.validateApplDate(dj.byId("issuing_bank_abbv_name").get("value")))
			{
				m._config.onSubmitErrorMsg = m.getLocalization('changeInApplicationDates');
				m.goToTop();
				return false;
      		}
	    	 return valid;
	     }
		
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.trade.create_ls_client');