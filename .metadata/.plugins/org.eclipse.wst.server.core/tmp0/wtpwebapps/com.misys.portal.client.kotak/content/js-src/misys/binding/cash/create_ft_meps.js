/*
 * ---------------------------------------------------------- 
 * Event Binding for Singapore domestic transfers
 * 
 * Copyright (c) 2000-2019 Finastra (http://www.misys.com), All Rights Reserved.
 * 
 * version: 1.0 date: 08/06/2019
 * 
 * ----------------------------------------------------------
 */

dojo.provide("misys.binding.cash.create_ft_meps");

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
dojo.require("misys.binding.core.beneficiary_advice_common");
dojo.require("misys.binding.common.create_fx_multibank"   );

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode	
	var fxMsgType = d.byId("fx-message-type");
	var hasCustomerBankValue = false;
	var validationFailedOrDraftMode = false;
	var formLoading = true;
	var hasIntermediaryBankDetails=false;
	var fxSection = "fx-section";
	var whStyle = "width:710px;height:350px;";
	function _compareApplicantAndBenificiaryCurrency()	
	{
		var applicant_act_cur_code = dj.byId('applicant_act_cur_code').get('value');
		var beneficiary_act_cur_code = dj.byId('ft_cur_code').get('value');
		
		if (applicant_act_cur_code !== "" && beneficiary_act_cur_code !== "" && applicant_act_cur_code !== beneficiary_act_cur_code)
			{
				m.dialog.show("ERROR",m.getLocalization("mismatchFrom"));
				dj.byId('applicant_act_name').set('value','');
				dj.byId('applicant_act_cur_code').set('value','');
				dj.byId('applicant_act_no').set('value','');
				return;
			}
	}
	function _clearRequiredFields(message)
	{
		var callback = function() {
			var widget = dijit.byId("ft_amt");
		 	widget.set("state","Error");
	 		m.defaultBindTheFXTypes();
		 	dj.byId("ft_amt").set("value", "");
		 	if(dj.byId("ft_cur_code") && !dj.byId("ft_cur_code").get("readOnly"))
		 	{
		 		dj.byId("ft_cur_code").set("value", "");
		 	}
		};
		m.dialog.show("ERROR", message, "", function()
		{
			setTimeout(callback, 500);
		});
		
		if(d.byId(fxSection) && (d.style(d.byId(fxSection),"display") !== "none"))
		{
			m.animate("wipeOut", d.byId(fxSection));
		}
	}
	
	function populateDebitAccountDetails(){
		m.xhrPost(
				{
					url 		: misys.getServletURL("/screen/AjaxScreen/action/GetUserAccountList") ,
					handleAs : "json",
					sync : true,
					content :
					{
						context_value : "FT:MEPS",
						entity        : dj.byId("entity") ? dj.byId("entity").get("value") : ""
						
					},
					load : function(response, args)
					{
						if (response.items.valid === true)
						{	
							dj.byId("applicant_act_cur_code").set("value", response.items.currency);
							dj.byId("applicant_act_pab").set("value", response.items.PAB);
							dj.byId("applicant_act_no").set("value", response.items.accountNo);
							dj.byId("applicant_act_name").set("value", response.items.accountName);
							_applicantAccountPABHandler();
							
						} 
					},
					error : function(response, args)
					{
						console.error("[Could not fetch userAccounts] " );
						console.error(response);
					}
				});
	}

	
	function _preSubmissionFXValidation(){
		var valid = true;
		var error_message = "";
		var boardRateOption = dj.byId("fx_rates_type_2");
		var totalUtiliseAmt = dj.byId("fx_total_utilise_amt");
		var ftAmt = dj.byId("ft_amt");
		var maxNbrContracts = m._config.fxParamData[dj.byId("sub_product_code").get("value")][dj.byId("issuing_bank_abbv_name").get("value")].maxNbrContracts;
		
		if (boardRateOption.get("checked") && totalUtiliseAmt && !isNaN(totalUtiliseAmt.get("value")) && ftAmt && !isNaN(ftAmt.get("value")))
		{
			if (ftAmt.get("value") < totalUtiliseAmt.get("value"))
			{
				error_message += m.getLocalization("FXUtiliseAmtGreaterMessage");
				valid = false;
			}
		}
		m._config.onSubmitErrorMsg =  error_message;
		
		if(boardRateOption.get("checked") && totalUtiliseAmt  && ftAmt)
		{
			var totalAmt = 0;
			for(var j = 1; j<=maxNbrContracts; j++)
			{
				var contractAmt = "fx_contract_nbr_amt_"+j;
				totalAmt = totalAmt + dj.byId(contractAmt).get("value");
				if(dj.byId(contractAmt).get("state") === 'Error' || totalAmt.toFixed(2) > totalUtiliseAmt.get("value"))
				{
					dj.byId(contractAmt).set("state", "Error");
					dj.byId(contractAmt).focus();
					valid = false;
				}
			}
		}

		return valid;
	}
	function _handleFXAction()
	{
		var subProduct = dj.byId("sub_product_code").get("value");			
		if(dj.byId("issuing_bank_abbv_name") && dj.byId("issuing_bank_abbv_name").get("value") !== "" && m._config.fxParamData && m._config.fxParamData[subProduct][dj.byId("issuing_bank_abbv_name").get("value")].isFXEnabled === "Y"){
			//Start FX Actions
			m.connect("ft_cur_code", "onBlur", function(){
				m.setCurrency(this, ["ft_amt"]);
				if(dj.byId("ft_cur_code").get("value") !== "" && !isNaN(dj.byId("ft_amt").get("value"))){
					m.fireFXAction();
				}else{
					m.defaultBindTheFXTypes();
				}
			});
			m.connect("ft_cur_code", "onChange", function(){
				if(dj.byId("iss_date") && dj.byId("iss_date").get("value") !== "")
				{
					dj.byId("iss_date").validate();
				}
				if(dj.byId("recurring_start_date") && dj.byId("recurring_start_date").get("value") !== "")
				{
					dj.byId("recurring_start_date").validate();
				}
				m.setCurrency(this, ["ft_amt"]);
				if(dj.byId("ft_cur_code").get("value") !== "" && !isNaN(dj.byId("ft_amt").get("value"))){
					m.fireFXAction();
				}else{
					m.defaultBindTheFXTypes();
				}
			});
			m.connect("ft_amt", "onBlur", function(){
				m.setTnxAmt(this.get("value"));
				var ftCurrency="";
				if(dj.byId("ft_cur_code")){
					ftCurrency = dj.byId("ft_cur_code").get("value");					
				}
				if(!isNaN(dj.byId("ft_amt").get("value")) && ftCurrency !== ""){
					m.fireFXAction();
				}else{
					m.defaultBindTheFXTypes();
				}
			});
		}
		else
		{
			if(d.byId(fxSection))
				{
					d.style(fxSection,"display","none");
				}
		}
		
		if(dijit.byId("ft_cur_code") && dijit.byId("ft_amt"))
		{
			misys.setCurrency(dijit.byId("ft_cur_code"), ["ft_amt"]);
		}
	}
	
	var beneficiary = { }, bicCode = { }, interBicCode = { }, CptybicCode = { };
	beneficiary.fields = [  "beneficiary_name",
	                		"beneficiary_address",
	                		"beneficiary_city",
	                		"beneficiary_dom",
	                		"beneficiary_country",
	                		"beneficiary_account",
	                		"pre_approved"];
	                		
	beneficiary.toggleReadonly = function(/*boolean*/ flag)
	{
		m.toggleFieldsReadOnly(this.fields, flag);
	};
	
	beneficiary.clear = function()
	{
		d.forEach(this.fields ,function(node, i)
		{
			if (dj.byId(node))
			{
				dj.byId(node).set("value", '');
			}
		});
		if (dj.byId("branch_address_flag"))
		{
			dj.byId("branch_address_flag").set("checked", false);
		}
		if (dj.byId("cpty_bank_country_img"))
		{
			dj.byId("cpty_bank_country_img").set("disabled", false);
		}
		d.style("PAB","display","none");
	};
	
	bicCode.fields = [  "cpty_bank_swift_bic_code",
						"cpty_bank_name",
						"cpty_bank_address_line_1",
						"cpty_bank_address_line_2",
						"cpty_bank_dom",
						"cpty_bank_country",
						"intermediary_bank_swift_bic_code",
						"intermediary_bank_name",
						"intermediary_bank_address_line_1",
						"intermediary_bank_address_line_2",
						"intermediary_bank_dom",
						"intermediary_bank_country"];
	bicCode.clear = function()
	{
		d.forEach(this.fields ,function(node, i)
		{
			if (dj.byId(node))
			{
				dj.byId(node).set("value", '');
			}
		});
	};
	
	       CptybicCode.fields = [  "cpty_bank_name",
			                     "cpty_bank_address_line_1", 
			                     "cpty_bank_address_line_2",
			                     "cpty_bank_dom", 
			                     "cpty_bank_country" ];
	CptybicCode.clear = function() {
		d.forEach(this.fields, function(node, i) {
			if (dj.byId(node)) {
				dj.byId(node).set("value", '');
			}
		});
	};

	interBicCode.fields = [ "intermediary_bank_name",
			               "intermediary_bank_address_line_1",
			               "intermediary_bank_address_line_2", 
			               "intermediary_bank_dom",
			                "intermediary_bank_country" ];
	interBicCode.clear = function() {
		d.forEach(this.fields, function(node, i) {
			if (dj.byId(node)) {
				dj.byId(node).set("value", '');
			}
		});
	};
	/**
	 * bound to the Clear button
	 */
	function _clearButtonHandler()
	{
		var applicantAcctPAB = dj.byId("applicant_act_pab").get("value");
		if (applicantAcctPAB == "Y")
		{
			beneficiary.toggleReadonly(true);
		}
		else
		{
			beneficiary.toggleReadonly(false);
			
		}
		dj.byId("pre_approved_status").set("value", "");
		beneficiary.clear();	
		bicCode.clear();
		if(dj.byId("beneficiary_country_btn_img"))
		{
			dj.byId("beneficiary_country_btn_img").set("disabled",false);
		}
		d.style("PAB","display","none");
	}
	
	/**
	 * called after selecting a beneficiary
	 * No processing done if beneficiary is getting cleared
	 */
	function _beneficiaryChangeHandler()
	{
		var beneficiaryName = dj.byId("beneficiary_name").get("value");
		hasIntermediaryBankDetails=false;
		if(beneficiaryName !== "")
		{
			dj.byId('ft_amt').set('displayedValue','');
			if(dj.byId("pre_approved_status") && dj.byId("pre_approved_status").get("value") === "Y")
			{
				// Display PAB text only if non-PAB accounts are allowed
				if(m._config.non_pab_allowed)
				{
					d.style("PAB", "display", "inline");
				}else
				{
					console.debug("Non-PAB accounts are not allowed, hiding PAB text");
					d.style("PAB","display","none");
				}
				if(dj.byId("intermediary_bank_swift_bic_code") && dj.byId("intermediary_bank_swift_bic_code").get("value") !== "" && dj.byId("intermediary_bank_swift_bic_code").get("value") !== null)
				{
					hasIntermediaryBankDetails=true;
					if(dj.byId("inter_bank_iso_img"))
					{
						dj.byId("inter_bank_iso_img").set("disabled", true);
					}
					
					dj.byId("has_intermediary").set("value","true");
					
				}
				else
				{
				dj.byId("has_intermediary").set("value","false");

				}
				
				if(dj.byId("bank_iso_img"))
				{
					dj.byId("bank_iso_img").set("disabled", true);
				}
				if(dj.byId("cpty_bank_country_img"))
				{
					dj.byId("cpty_bank_country_img").set("disabled", true);
				}
				
				if(dj.byId("cpty_bank_swift_bic_code") && dj.byId("cpty_bank_swift_bic_code").get("value").length !==0)
		    	{
					m.toggleFieldsReadOnly( ["cpty_bank_swift_bic_code"], true);
		    	}
				
				if(dj.byId("intermediary_bank_swift_bic_code") && dj.byId("intermediary_bank_swift_bic_code").get("value").length !==0)
		    	{
					m.toggleFieldsReadOnly( ["intermediary_bank_swift_bic_code"], true);
		    	}
				
				beneficiary.toggleReadonly(true);
				m.toggleFieldsReadOnly(["beneficiary_bank_branch_address_line_1","beneficiary_bank_branch_address_line_2","beneficiary_bank_branch_dom"], true);
				if(dj.byId("beneficiary_iso_img"))
				{
					dj.byId("beneficiary_iso_img").set("disabled",true);
				}
				
				if(dj.byId("cpty_bank_swift_bic_code") && dj.byId("cpty_bank_swift_bic_code").get("value").length !==0)
		    	{
					m.toggleFieldsReadOnly( ["cpty_bank_swift_bic_code"], true);
		    	}
				if(dj.byId("beneficiary_country_btn_img"))
				{
					dj.byId("beneficiary_country_btn_img").set("disabled",true);
				}
				
				
			}	
			else
			{
				beneficiary.toggleReadonly(false);
				d.style("PAB","display","none");
				m.toggleFieldsReadOnly(["beneficiary_swift_bic_code"], false);
				
				if(dj.byId("inter_bank_iso_img"))
				{
					dj.byId("inter_bank_iso_img").set("disabled",false);
				}
				
				if(dj.byId("intermediary_bank_swift_bic_code") && dj.byId("intermediary_bank_swift_bic_code").get("value") !== "" && dj.byId("intermediary_bank_swift_bic_code").get("value") !== null)
				{
					hasIntermediaryBankDetails=true;
					if(dj.byId("inter_bank_iso_img"))
					{
						dj.byId("inter_bank_iso_img").set("disabled", true);
					}
					dj.byId("has_intermediary").set("value","true");

					
				}
				else
				{
				dj.byId("has_intermediary").set("value","false");

				}
				
				if( (dj.byId("pre_approved") && dj.byId("pre_approved").get("value") === "") || (dj.byId("pre_approved") && dj.byId("pre_approved").get("value") === null))
				{
					beneficiary.toggleReadonly(false);		
					if(dj.byId("bank_iso_img"))
					{
						dj.byId("bank_iso_img").set("disabled",false);
					}
					if(dj.byId("beneficiary_country_btn_img"))
					{
						dj.byId("beneficiary_country_btn_img").set("disabled",false);
					}
					m.toggleFieldsReadOnly(["beneficiary_bank_branch_address_line_1","beneficiary_bank_branch_address_line_2","beneficiary_bank_branch_dom"], false);	
				}	
				else
				{
					beneficiary.toggleReadonly(true);	
					if(dj.byId("bank_iso_img"))
					{
						dj.byId("bank_iso_img").set("disabled",true);
					}
					m.toggleFieldsReadOnly(["beneficiary_bank_branch_address_line_1","beneficiary_bank_branch_address_line_2","beneficiary_bank_branch_dom"], true);
				}
				
				if(dj.byId("beneficiary_swift_bic_code") && dj.byId("beneficiary_swift_bic_code").get("value") !== "")
				{
					m.toggleFieldsReadOnly(["beneficiary_name","beneficiary_address","beneficiary_city", "beneficiary_dom"], true);
				}
				
				if(dj.byId("intermediary_bank_swift_bic_code") && dj.byId("intermediary_bank_swift_bic_code").get("value") !== "")
				{
					m.toggleFieldsReadOnly(["intermediary_bank_swift_bic_code","intermediary_bank_name","intermediary_bank_address_line_1","intermediary_bank_address_line_2", "intermediary_bank_dom", "intermediary_bank_country"], true);
				}
						
				if(dj.byId("beneficiary_country_btn_img") && dj.byId("beneficiary_country").get("value") !== "" && dj.byId("beneficiary_country").get("value") !== null)
				{
					dj.byId("beneficiary_country_btn_img").set("disabled",true);
				}
				if(dj.byId("cpty_bank_swift_bic_code") && dj.byId("cpty_bank_swift_bic_code").get("value").length !==0)
		    	{
					m.toggleFieldsReadOnly( ["cpty_bank_swift_bic_code","cpty_bank_name","cpty_bank_address_line_1","cpty_bank_address_line_2","cpty_bank_dom","cpty_bank_country"], true);
		    	}
				if(dj.byId("intermediary_bank_swift_bic_code") && dj.byId("intermediary_bank_swift_bic_code").get("value").length !==0)
		    	{
					m.toggleFieldsReadOnly( ["intermediary_bank_swift_bic_code","intermediary_bank_name","intermediary_bank_address_line_1","intermediary_bank_address_line_2","intermediary_bank_dom","intermediary_bank_country"], true);
		    	}
				
			}
		}
	}	
	
	/**
	 * Either open a popup to select a Master Beneficiary or a user Account
	 */
	function _beneficiaryButtonHandler()
	{
		var applicantActNo = dj.byId("applicant_act_no").get("value");
		var entity = dj.byId("entity") ? dj.byId("entity").get("value") : "";
		if (applicantActNo === "")
		{
			m.dialog.show("ERROR", m.getLocalization("selectDebitFirst"));
			return;
		}
		m.showSearchDialog("beneficiary_accounts", 
							   "['beneficiary_name','beneficiary_account','ft_cur_code', 'beneficiary_address', 'beneficiary_city', 'change_address_line_3', 'beneficiary_dom', " +
							   "'pre_approved_status', 'change_counterparty_name_2', 'change_counterparty_name_3', 'cpty_bank_name', 'cpty_bank_address_line_1', 'cpty_bank_address_line_2', " +
							   "'cpty_bank_dom', 'beneficiary_bank_branch_address_line_1', 'beneficiary_bank_branch_address_line_2', 'beneficiary_bank_branch_dom', 'cpty_bank_country', " +
							   "'beneficiary_swift_bic_code', 'cpty_bank_swift_bic_code', 'beneficiary_bank_code', 'beneficiary_branch_code', 'beneficiary_branch_name', " +
							   "'pre_approved', 'change_threshold','change_threshold_curcode','bene_adv_beneficiary_id_no_send','bene_adv_mailing_name_add_1_no_send'," +
							   "'bene_adv_mailing_name_add_2_no_send','bene_adv_mailing_name_add_3_no_send','bene_adv_mailing_name_add_4_no_send','bene_adv_mailing_name_add_5_no_send'," +
							   "'bene_adv_mailing_name_add_6_no_send','bene_adv_postal_code_no_send','bene_adv_country_no_send','bene_email_1','bene_email_2', 'beneficiary_postal_code','beneficiary_country'," +
							   "'bene_adv_fax_no_send', 'bene_adv_ivr_no_send','beneficiary_nickname', 'bene_adv_phone_no_send','intermediary_bank_swift_bic_code','intermediary_bank_name','intermediary_bank_address_line_1'," +
							   "'intermediary_bank_address_line_2','intermediary_bank_dom','intermediary_bank_country']",
							   {product_type: dijit.byId("sub_product_code").get("value"), entity_name: entity, pabAccStat: dijit.byId("applicant_act_pab").get("value"),debitAcctNo: applicantActNo},
							   "", 
							   dijit.byId("sub_product_code").get("value"),
							   whStyle,
							   m.getLocalization("ListOfBeneficiriesTitleMessage"));	
	}


	function _swiftClearBeneficiaryAddressFields()
	{
		var bankFieldsDisabled = true;
	    if(dj.byId("cpty_bank_swift_bic_code") && dj.byId("cpty_bank_swift_bic_code").get("value").length ===0)
    	{
	    	bankFieldsDisabled=false;
	    }
	    changePropertyIfPresent("cpty_bank_swift_bic_code", "readOnly", bankFieldsDisabled);
	    changePropertyIfPresent("cpty_bank_country_img", "disabled", bankFieldsDisabled);
	    if( (dj.byId("pre_approved") && dj.byId("pre_approved").get("value") === "") || (dj.byId("pre_approved") && dj.byId("pre_approved").get("value") === null))
		{
	    	changePropertyIfPresent("cpty_bank_swift_bic_code", "readOnly", false);
		    changePropertyIfPresent("cpty_bank_country_img", "disabled", false);
		}
	    changePropertyIfPresent("cpty_bank_name", "readOnly", bankFieldsDisabled);
	    changePropertyIfPresent("cpty_bank_address_line_1", "readOnly", bankFieldsDisabled);
	    changePropertyIfPresent("cpty_bank_address_line_2", "readOnly", bankFieldsDisabled);
	    changePropertyIfPresent("cpty_bank_dom", "readOnly", bankFieldsDisabled);
	    changePropertyIfPresent("cpty_bank_country", "readOnly", bankFieldsDisabled);
	    changePropertyIfPresent("bank_iso_img", "disabled", false);
		m.toggleRequired("cpty_bank_name", true);
		m.toggleRequired("cpty_bank_address_line_1", true);
		m.toggleRequired("cpty_bank_country", true);
	}	
	function changePropertyIfPresent(id, property, value)
	{
		var field = dj.byId(id);
		if (field)
		{
			field.set(property, value);
		}
	}
		
	function _swiftClearIntermediaryBankDetails()
	{
		var bankFieldsDisabled	=	true;
	    if(dj.byId("intermediary_bank_swift_bic_code") && dj.byId("intermediary_bank_swift_bic_code").get("value").length === 0)
    	{
	    	bankFieldsDisabled=false;
	    }
	    changePropertyIfPresent("intermediary_bank_swift_bic_code", "readOnly", bankFieldsDisabled);
	    changePropertyIfPresent("intermediary_bank_name", "readOnly", bankFieldsDisabled);
	    changePropertyIfPresent("intermediary_bank_address_line_1", "readOnly", bankFieldsDisabled);
	    changePropertyIfPresent("intermediary_bank_address_line_2", "readOnly", bankFieldsDisabled);
	    changePropertyIfPresent("intermediary_bank_dom", "readOnly", bankFieldsDisabled);
	    changePropertyIfPresent("intermediary_bank_country", "readOnly", bankFieldsDisabled);
	    changePropertyIfPresent("inter_bank_iso_img", "disabled", false);
	    changePropertyIfPresent("intermediary_bank_country_img", "disabled", bankFieldsDisabled);
	    m.toggleRequired("intermediary_bank_swift_bic_code", bankFieldsDisabled);
		m.toggleRequired("intermediary_bank_name", bankFieldsDisabled);
		m.toggleRequired("intermediary_bank_address_line_1", bankFieldsDisabled);
		m.toggleRequired("intermediary_bank_address_line_2", false);
		m.toggleRequired("intermediary_bank_dom", false);
		m.toggleRequired("intermediary_bank_country", bankFieldsDisabled);	
		  if( (dj.byId("pre_approved") && dj.byId("pre_approved").get("value") === "") || (dj.byId("pre_approved") && dj.byId("pre_approved").get("value") === null))
			{
		    	changePropertyIfPresent("intermediary_bank_swift_bic_code", "readOnly", false);
			    changePropertyIfPresent("intermediary_bank_country_img", "disabled", false);
			    m.toggleRequired("intermediary_bank_address_line_1", false);
			}
	}
	
	function _toggleBranchAddress(/*boolean*/enable)
	{
		var array = ["beneficiary_bank_branch_address_line_1","beneficiary_bank_branch_address_line_2","beneficiary_bank_branch_dom"];
		var isBeneficiaryReadOnly = (dj.byId("beneficiary_name") && dj.byId("beneficiary_name").get('readOnly')) ? true : false;
		if(enable)
		{
			if( ((dj.byId("pre_approved_status") && dj.byId("pre_approved_status").get("value") === "Y") || (dj.byId("pre_approved_status") && dj.byId("pre_approved_status").get("value") === "N")) && isBeneficiaryReadOnly)
			{
				m.toggleFieldsReadOnly(array, true);
			}
			else
			{
				m.toggleFieldsReadOnly(array, false);
				dj.byId("branch_address_flag").set("disabled", false);
				dj.byId("branch_address_flag").set("readOnly", false);
			}
			m.toggleRequired("beneficiary_bank_branch_address_line_1", true);
		}
		else
		{
			m.toggleFieldsReadOnly(array, true, true);
			m.toggleRequired("beneficiary_bank_branch_address_line_1", false);
		}
	}
	
	function _onPreApprovedChangeToggleBranchAdress()
	{
		if(dj.byId("branch_address_flag"))
		{
			if(	(dj.byId("pre_approved_status") && dj.byId("pre_approved_status").get("value") === "Y") || (dj.byId("pre_approved_status") && dj.byId("pre_approved_status").get("value") === "N"))
			{
				m.toggleFieldsReadOnly(["branch_address_flag","beneficiary_bank_branch_address_line_1","beneficiary_bank_branch_address_line_2","beneficiary_bank_branch_dom"], true);
			}
			else
			{
				if( (dj.byId("pre_approved") && dj.byId("pre_approved").get("value") === "") || (dj.byId("pre_approved") && dj.byId("pre_approved").get("value") === null))
				{
					m.toggleFieldsReadOnly(["branch_address_flag","beneficiary_bank_branch_address_line_1","beneficiary_bank_branch_address_line_2","beneficiary_bank_branch_dom"], false);
				}
				else
				{
					m.toggleFieldsReadOnly(["branch_address_flag","beneficiary_bank_branch_address_line_1","beneficiary_bank_branch_address_line_2","beneficiary_bank_branch_dom"], true);
				}
			}
	    }
	}
	
	function _changeBeneficiaryNotification()
	{
		var sendNotifyChecked = dj.byId("notify_beneficiary").get("checked");

		var choice1 = dj.byId("notify_beneficiary_choice_1");
		var choice2 = dj.byId("notify_beneficiary_choice_2");
		var notifyEmail = dj.byId("notify_beneficiary_email");

		choice1.set("disabled", !sendNotifyChecked);
		choice2.set("disabled", !sendNotifyChecked);
		notifyEmail.set("disabled",true);
		choice1.set("checked", sendNotifyChecked);
		choice2.set("checked", false);
		notifyEmail.set("value","");

		var notifyEmailDOM = d.byId("notify_beneficiary_email_node");
		var notifyRadio1DOM = d.byId("label_notify_beneficiary_choice_1");		
		d.place(notifyEmailDOM, notifyRadio1DOM, "after");
		var email = dj.byId("bene_email_1").get("value");
		if (!email)
		{
			email = dj.byId("bene_email_2").get("value");
		}
		if (email && sendNotifyChecked)
		{
			notifyEmail.set("value", email);
			notifyEmail.set("readOnly", true);
		}
		if (!email && sendNotifyChecked)
		{
			if(dj.byId("beneficiary_name") && dj.byId("beneficiary_name").get("value")==="")
			{	
				m.dialog.show("ERROR", m.getLocalization("noBeneficiaryEmail"));
			}
			choice2.set("checked", true);
			var notifyRadio2DOM = d.byId("label_notify_beneficiary_choice_2");		
			d.place(notifyEmailDOM, notifyRadio2DOM, "after");
			notifyEmail.set("disabled",false);
		}
		
		m.toggleRequired("notify_beneficiary_email", sendNotifyChecked);
		m.toggleRequired("notify_beneficiary_choice_1", sendNotifyChecked);
		m.toggleRequired("notify_beneficiary_choice_2", sendNotifyChecked);
		
	}
	
	function _changeBeneficiaryNotificationEmail()
	{
		var sendAlternativeChecked = dj.byId("notify_beneficiary_choice_2").get("checked") && !dj.byId("notify_beneficiary_choice_2").get("disabled");
		var notifyEmail = dj.byId("notify_beneficiary_email");
		var notifyRadio2 = dj.byId("notify_beneficiary_choice_2");
		
		var notifyEmailDOM = d.byId("notify_beneficiary_email_node");
		var notifyRadio1DOM = d.byId("label_notify_beneficiary_choice_1");
		var notifyRadio2DOM = d.byId("label_notify_beneficiary_choice_2");		
		
		var email = dj.byId("bene_email_1").get("value");
		if (!email)
		{
			email = dj.byId("bene_email_2").get("value");
		}

		if (sendAlternativeChecked)
		{
			d.place(notifyEmailDOM, notifyRadio2DOM, "after");
			notifyEmail.set("disabled", false);
		}
		else
		{
			if (!email)
			{
				m.dialog.show("ERROR", m.getLocalization("noBeneficiaryEmail"));
				notifyRadio2.set("checked", true);
				notifyEmail.set("disabled", false);
			}
			else
			{
				d.place(notifyEmailDOM, notifyRadio1DOM, "after");
			}
		}
		
		if (email && !sendAlternativeChecked)
		{
			notifyEmail.set("value", email);
			notifyEmail.set("readOnly", true);
		}
		else
		{
			notifyEmail.set("value", "");
			notifyEmail.set("readOnly", false);
			notifyEmail.set("disabled", false);
		}
	}
	
	/**
	 * Customer Bank Field onChange handler
	 */
	function _handleCusomterBankOnChangeFields()
	{
		var bank_desc_name = null;
		var customer_bank = dj.byId("customer_bank").get("value"); 
		
		if(misys && misys._config && misys._config.businessDateForBank && misys._config.businessDateForBank[customer_bank] && misys._config.businessDateForBank[customer_bank][0] && misys._config.businessDateForBank[customer_bank][0].value !== '')
		{
			var date = misys._config.businessDateForBank[customer_bank][0].value;
			var yearServer = date.substring(0,4);
			var monthServer = date.substring(5,7);
			var dateServer = date.substring(8,10);
			date = dateServer + "/" + monthServer + "/" + yearServer;
			var date1 = new Date(yearServer, monthServer - 1, dateServer);
			if(dj.byId("option_for_app_date") && dj.byId("option_for_app_date").get("value") === "SCRATCH"){
				dj.byId("appl_date").set("value", date);
				document.getElementById('appl_date_view_row').childNodes[1].innerHTML = date;
				if(dj.byId("appl_date_hidden")){
					dj.byId("appl_date_hidden").set("value", date1);
				}
			}
			if(dj.byId("todays_date")){
				dj.byId("todays_date").set("value", date1);
			}
		}
		if(!hasCustomerBankValue && !formLoading)
		{	
			if(dj.byId("applicant_act_name")){
				dj.byId("applicant_act_name").set("value", "");
			}
			if(dj.byId("applicant_act_no"))
			{
				dj.byId("applicant_act_no").set("value", "");
			}
			if(dj.byId("beneficiary_name")){
				dj.byId("beneficiary_name").set("value", "");
			}
			if(dj.byId("beneficiary_act_cur_code")){
				dj.byId("beneficiary_act_cur_code").set("value", "");
			}
			if(dj.byId("beneficiary_account")){
				dj.byId("beneficiary_account").set("value", "");
			}
			if(dj.byId("cpty_bank_name")){
				dj.byId("cpty_bank_name").set("value", "");
			}
			if(dj.byId("cpty_branch_name")){
				dj.byId("cpty_branch_name").set("value", "");
			}
			if(dj.byId("ft_cur_code")){
				dj.byId("ft_cur_code").set("value", "");
			}
			if(dj.byId("ft_amt")){
				dj.byId("ft_amt").set("value", "");
			}
			if(dj.byId("iss_date")){
				dj.byId("iss_date").set("value", null);
			}
    		if(dj.byId("issuing_bank_abbv_name")){
    			dj.byId("issuing_bank_abbv_name").set("value",customer_bank);
    		}
    		bank_desc_name = misys._config.customerBankDetails[customer_bank][0].value;
    		if(dj.byId("issuing_bank_name")){
    			dj.byId("issuing_bank_name").set("value",bank_desc_name);
    		}
		}
		
		if(!hasCustomerBankValue)
		{
			dj.byId("issuing_bank_abbv_name").set("value",customer_bank);
			bank_desc_name = misys._config.customerBankDetails[customer_bank][0].value;
    		dj.byId("issuing_bank_name").set("value",bank_desc_name);
		}
		hasCustomerBankValue = false;
		if(dj.byId("customer_bank") && customer_bank !== "")
		{
			formLoading = false;
			if(dj.byId("issuing_bank_abbv_name").get("value")!== "")
			{
				bank_desc_name = misys._config.customerBankDetails[customer_bank][0].value;
	    		dj.byId("issuing_bank_name").set("value",bank_desc_name);
			}	
		}
		
		m.initializeFX(dj.byId("sub_product_code").get("value"), dj.byId("issuing_bank_abbv_name").get("value"));
		if(dj.byId("applicant_act_cur_code") && dj.byId("applicant_act_cur_code").get("value") !== '' && dj.byId("ft_cur_code") && dj.byId("ft_cur_code").get("value") !== "" && dj.byId("applicant_act_cur_code").get("value")!== dj.byId("ft_cur_code").get("value") && !isNaN(dj.byId("ft_amt").get("value")))
		{
			m.onloadFXActions();
		}
		else
		{
			m.defaultBindTheFXTypes();
		}
		
		_handleFXAction();
	}

	function _applicantAccountPABHandler()
	{
		
		var applicantAcctPAB = dj.byId("applicant_act_pab").get("value");
		
		if (applicantAcctPAB == "Y")
		{
			beneficiary.toggleReadonly(true);
		}
		else
		{
			if(m._config.non_pab_allowed)
			{
				beneficiary.toggleReadonly(false);
			}else
			{
				console.log("Adhoc mode is unavailable although selected debit account is non-PAB. Beneficiary is readonly");
				beneficiary.toggleReadonly(true);
			}
		}
		
		if(d.byId("clear_img"))
		{
			if(applicantAcctPAB == 'Y' && d.style(d.byId("clear_img"),"display") !== "none")
			{
				m.animate("wipeOut", d.byId('clear_img'));
				dj.byId("clear_img").setAttribute('disabled', true);
				console.log("Selected debit account is PAB. Hiding and Disabling clear button");
			}
			else if(applicantAcctPAB == 'N' && d.style(d.byId("clear_img"),"display") == "none")
			{
				m.animate("wipeIn", d.byId('clear_img'));
				dj.byId("clear_img").setAttribute('disabled', false);
				console.log("Selected debit account is non-PAB and adhoc mode is available. Displaying and enabling clear button");
			}
		}		
	}
	
	function _applicantAccountChangeHandler()
	{
		
		// clear all beneficiary fields
		dojo.forEach(["pre_approved", "beneficiary_account", "beneficiary_act_cur_code", "beneficiary_address", "beneficiary_city", "beneficiary_dom", "pre_approved_status", "cpty_bank_name", 
					"cpty_bank_address_line_1", "cpty_bank_address_line_2", "cpty_bank_dom", "cpty_branch_address_line_1", "cpty_branch_address_line_2", "cpty_branch_dom", "cpty_bank_country",
					"cpty_bank_swift_bic_code", "cpty_bank_code", "cpty_branch_code", "cpty_branch_name", "beneficiary_name", "bene_adv_beneficiary_id_no_send", 
					"bene_adv_mailing_name_add_1_no_send","bene_adv_mailing_name_add_2_no_send","bene_adv_mailing_name_add_3_no_send","bene_adv_mailing_name_add_4_no_send", 
					"bene_adv_mailing_name_add_5_no_send","bene_adv_mailing_name_add_6_no_send","bene_adv_postal_code_no_send","bene_adv_country_no_send","bene_email_1", 
					"bene_email_2","beneficiary_postal_code","beneficiary_country", "bene_adv_fax_no_send", "bene_adv_ivr_no_send", "bene_adv_phone_no_send", "bene_adv_email_no_send1",
					"bene_adv_email_no_send", "ft_amt","intermediary_bank_swift_bic_code","intermediary_bank_name","intermediary_bank_address_line_1","intermediary_bank_address_line_2",
					"intermediary_bank_dom","intermediary_bank_country","beneficiary_bank_branch_address_line_1","beneficiary_bank_branch_address_line_2","beneficiary_bank_branch_dom"], function(currentField) {
			if (dj.byId(currentField)) 
			{
				dj.byId(currentField).set("value", "");
			}
		});
		// clear fx section
		if(d.byId(fxSection) && (d.style(d.byId(fxSection),"display") !== "none"))
		{
			m.animate("wipeOut", d.byId(fxSection));
		}
		// Clear PAB label
		d.style("PAB","display","none");
		m.setApplicantReference();
	}
	
	function _validateCutomerReference(/*String*/field)
	{	
		var regex = dj.byId("customerReference");
	    var regexStr = regex ? dj.byId("customerReference").get("value") : '';		 
	    var custRefRegx = new RegExp(regexStr);
	    var custNameId = dj.byId("cust_ref_id");

	    var isValid = false;
		var custRef = dj.byId(field);
		var custRefString = custRef ? custRef.get("value") : '';
		var errorMessage = null;

		
	         if(custRefString !== '' && custRefString !== null)
		     {			   			   
				   isValid = custRefRegx.test(custRefString);		
				   if(!isValid){
					   errorMessage =  m.getLocalization("invalidCustRef");
					   custNameId.set("state","Error");
					   dj.hideTooltip(custNameId.domNode);
					   dj.showTooltip(errorMessage, custNameId.domNode, 0);
				   }
		}
	}
	
	function _validateBeneficiaryName()
	{	
		var regex = dj.byId("beneNameRegex");
	    var regexStr = regex ? dj.byId("beneNameRegex").get("value") : '';		 
	    var beneNameRegExp = new RegExp(regexStr);

	    var isValid = false;
		var beneNameString = dj.byId("beneficiary_name") ? dj.byId("beneficiary_name").get("value") : '';

		if(regexStr !== null && regexStr !== ''){
	         if(beneNameString !== '' && beneNameString !== null)
		     {			   			   
				   isValid = beneNameRegExp.test(beneNameString);		
				   if(!isValid){
					   this.invalidMessage = m.getLocalization("invalidBeneficiaryNameforMeps");
					   return false;	   
				   }   
		     }
		}
		return true;
	}
	function _matchBicCodes()
	{
		var intermediaryBankCountryImg = dj.byId("intermediary_bank_country_img");
		var intermediary_swift_code_field	=	dj.byId("intermediary_bank_swift_bic_code");
		var valid= true;
		if(dj.byId("intermediary_bank_swift_bic_code").get("value") !== "" && dj.byId("cpty_bank_swift_bic_code").get("value") !== "" &&  (dj.byId("intermediary_bank_swift_bic_code").get("value") === dj.byId("cpty_bank_swift_bic_code").get("value"))) {
			var displayMessageInter  = 	"";
			displayMessageInter = misys.getLocalization("invalidIntermeditaryCode");
	  		intermediary_swift_code_field.set("state","Error");
			dj.hideTooltip(intermediary_swift_code_field.domNode);
			dj.showTooltip(displayMessageInter, intermediary_swift_code_field.domNode, 0);
			intermediaryBankCountryImg.set("disabled", false);
			valid =false;
		}
		return valid;
	}
	
	function _validateAddressRegexBeneficiary(field)
	{										 
		   var regex = dj.byId("beneAddressRegex");
		   var regexStr = regex ? dj.byId("beneAddressRegex").get("value") : '';
		   var beneficiaryRegExp = new RegExp(regexStr);	
		   
		   var isValid = false;
		   var errorMessage=null;		   		  				   				   
		   var addressId1 = dj.byId(field);
		   var addressStr1 = addressId1? dj.byId(field).get("value") : '';
		   
		   if(regexStr !== null && regexStr !== '' && addressStr1 !== '' && addressStr1 !== null)
		   {			   			   
			   isValid = beneficiaryRegExp.test(addressStr1);				   
			   if(!isValid)
			   {
				   errorMessage =  m.getLocalization("invalidBeneficiaryAddressFieldMeps");
				   addressId1.set("state","Error");
				   dj.hideTooltip(addressId1.domNode);
				   dj.showTooltip(errorMessage, addressId1.domNode, 0);
			   }				   
		   }		   		   
	}
	
	function _validateAccountRegexBeneficiary(){
		
		var regex = dj.byId("beneAcctRegex");
	    var regexStr = regex ? dj.byId("beneAcctRegex").get("value") : '';		 
	    var beneAcctRegExp = new RegExp(regexStr);
	    var beneAcctId = dj.byId("beneficiary_account");

	    var isValid = false;
		var beneAcct = beneAcctId;
		var beneAcctStr = beneAcct ? beneAcct.get("value") : '';
		var errorMessage = null;

		if(regexStr !== null && regexStr !== ''){
	         if(beneAcctStr !== '' && beneAcctStr !== null)
		     {			   			   
				   isValid = beneAcctRegExp.test(beneAcctStr);		
				   if(!isValid){
					   errorMessage =  m.getLocalization("invalidBeneficiaryAccountforMeps");
					   beneAcctId.set("state","Error");
					   dj.hideTooltip(beneAcctId.domNode);
					   dj.showTooltip(errorMessage, beneAcctId.domNode, 0);
				   }
		     }
		}
	}
    function _populateBankDetailsMeps()
	{

			var swift_code_field = dj.byId("cpty_bank_swift_bic_code"),
			
				name_field = dj.byId("cpty_bank_name"),
				bank_address_line_1_field = dj.byId("cpty_bank_address_line_1"),
				bank_address_line_2_field = dj.byId("cpty_bank_address_line_2"),
				bank_dom_field = dj.byId("cpty_bank_dom"),
				bank_country_field = dj.byId("cpty_bank_country"),
				intermediary_flag = dj.byId("intermediary_flag"),
				displayMessage  = 	"";
			
			var valid = false;
			if(swift_code_field)
			{
				if(swift_code_field.get("value") !== "")
				{
					m.xhrPost( {
						url 		: misys.getServletURL("/screen/AjaxScreen/action/ValidateBankMepsSWIFTCodeAction") ,
						handleAs 	: "json",
						sync 		: true,
						content 	: {
							bank_code     : swift_code_field.get("value")
						},
						load : function(response, args){
							if (response.items.valid === true){			
									valid = true;
										name_field.set("value", response.items.bankName);
										bank_address_line_1_field.set("value", response.items.bankAddressLine1);
										bank_address_line_2_field.set("value", response.items.bankAddressLine2);
										bank_dom_field.set("value", response.items.bankDom);
										bank_country_field.set("value", response.items.bankCountry);
										intermediary_flag.set("value", response.items.intermediaryFlag);
							}
							else{
								    displayMessage = misys.getLocalization("invalidBankCode");
									//swift_code_field.focus();
									//dj.byId("cpty_bank_swift_bic_code").set("value","");
								    swift_code_field.set("state","Error");
									dj.hideTooltip(swift_code_field.domNode);
									dj.showTooltip(displayMessage, swift_code_field.domNode, 0);										
									CptybicCode.clear();
									
								}
						},
						error 		: function(response, args){
							console.error("[Could not validate Bank BIC Code] "+ swift_code_field.get("value"));
							console.error(response);
						}
					});
				}
			  
			  else
			  {
					name_field.set("value", "");
					bank_address_line_1_field.set("value", "");
					bank_address_line_2_field.set("value", "");
					bank_dom_field.set("value", "");
					intermediary_flag.set("value", "");
			  }
			}
		return valid;
	}

	function _populateIntermediaryBankDetails()
	{

		var swift_code_field = dj.byId("intermediary_bank_swift_bic_code"), 
			name_field = dj.byId("intermediary_bank_name"), 
			bank_address_line_1_field = dj.byId("intermediary_bank_address_line_1"), 
			bank_address_line_2_field = dj.byId("intermediary_bank_address_line_2"), 
			bank_dom_field = dj.byId("intermediary_bank_dom"), 
			bank_country_field = dj.byId("intermediary_bank_country"), 
			displayMessage = "";

		var valid = false;
		if (swift_code_field)
		{
			if (swift_code_field.get("value") !== "")
			{
				m.xhrPost(
				{
					url : misys.getServletURL("/screen/AjaxScreen/action/ValidateIntermediarySWIFTCodeAction"),
					handleAs : "json",
					sync : true,
					content :
					{
						bank_code : swift_code_field.get("value"),
						product_type : dj.byId("sub_product_code").get("value")
					},
					load : function(response, args)
					{
						if (response.items.valid === true)
						{
							valid = true;
							if( (dj.byId("pre_approved") && dj.byId("pre_approved").get("value") === "") || (dj.byId("pre_approved") && dj.byId("pre_approved").get("value") === null)){
								name_field.set("value", response.items.bankName);
								bank_address_line_1_field.set("value", response.items.bankAddressLine1);
								bank_address_line_2_field.set("value", response.items.bankAddressLine2);
								bank_dom_field.set("value", response.items.bankDom);
								bank_country_field.set("value", response.items.bankCountry);
							}
						} else
						{
							displayMessage = misys.getLocalization("invalidBankCode");
							swift_code_field.focus();
							swift_code_field.set("value","");
							swift_code_field.set("state", "Error");
							dj.hideTooltip(swift_code_field.domNode);
							dj.showTooltip(displayMessage, swift_code_field.domNode, 0);
							interBicCode.clear();
						}
					},
					error : function(response, args)
					{
						console.error("[Could not validate Intermediary Swift Code] " + bank_code_field.get("value"));
						console.error(response);
					}
				});
			}

			else
			{	
				name_field.set("value", "");
				bank_address_line_1_field.set("value", "");
				bank_address_line_2_field.set("value", "");
				bank_dom_field.set("value", "");
			}
		}
		return valid;
	}

	function _validateBranchAddressRegex(field){
		
	    var regexStr = "^[a-zA-Z0-9 \\,''().?\\/+-:]*$";		 
	    var beneBranchAddRegExp = new RegExp(regexStr);
	
	    var isValid = false;
		var addrLineStr = field ? field.get("value") : '';
		var errorMessage = null;

	         if(addrLineStr !== '' && addrLineStr !== null)
		     {			   			   
				   isValid = beneBranchAddRegExp.test(addrLineStr);		
				   if(!isValid){
					   errorMessage =  m.getLocalization("invalidCharBranchAddress");
					   field.set("state","Error");
					   dj.hideTooltip(field.domNode);
					   dj.showTooltip(errorMessage, field.domNode, 0);
				   }
		     }		
	}
	
	function _validateInstructionToBrachRegx(field){
		

			   var regex = dj.byId("beneAddressRegex");
			   var regexStr = regex ? dj.byId("beneAddressRegex").get("value") : '';
			   var beneficiaryRegExp = new RegExp(regexStr); 
			 		
	    var isValid = false;
		var instLineStr = field ? field.get("value") : '';
		var errorMessage = null;
	
		if(regexStr !== null && regexStr !== ''){
	         if(instLineStr !== null)
		     {			   			   
				   isValid = beneficiaryRegExp.test(instLineStr);		
				   if(!isValid){
					   errorMessage =  m.getLocalization("invalidCharBranchAddress");
					   field.set("state","Error");
					   dj.hideTooltip(field.domNode);
					   dj.showTooltip(errorMessage, field.domNode, 0);
				   }
		     }
		}
		return isValid;
	}
	
    d.ready(function(){
		
		m._config.forceSWIFTValidation = true;

	});	
    
    d.mixin(m._config, {

		initReAuthParams : function() {
			var entityValue = dj.byId("entity") ? dj.byId("entity").get("value") : "";
			var reAuthParams = {
				productCode : "FT",
				subProductCode : dj.byId("sub_product_code")? dj.byId("sub_product_code").get("value"): '',
				transactionTypeCode : "01",
				entity : entityValue,
				currency : dj.byId("ft_cur_code")? dj.byId("ft_cur_code").get("value"): '',
				amount : dj.byId("ft_amt") ? m.trimAmount(dj.byId("ft_amt").get("value")): '',
				bankAbbvName : dj.byId("customer_bank")? dj.byId("customer_bank").get("value") : "",
				es_field1 : dj.byId("ft_amt")? m.trimAmount(dj.byId("ft_amt").get("value")): '',
				es_field2 : (dj.byId("beneficiary_account")) ? dj.byId(
						"beneficiary_account").get("value") : ""
			};
			return reAuthParams;
		}
	});
    
d.mixin(m, {
		
		fireFXAction : function()
		{
			if (m._config.fxParamData && dj.byId("sub_product_code") && dj.byId("sub_product_code").get("value") !== "" && dj.byId("issuing_bank_abbv_name") && dj.byId("issuing_bank_abbv_name").get("value") !== "")
			{
				var fxParamObject = m._config.fxParamData[dj.byId("sub_product_code").get("value")][dj.byId("issuing_bank_abbv_name").get("value")];
				if (m._config.fxParamData && fxParamObject.isFXEnabled === "Y")
				{
					var fromCurrency,toCurrency;
					var ftCurrency="";
					if(dj.byId("ft_cur_code"))
					{
						ftCurrency = dj.byId("ft_cur_code").get("value");					
					}
					var amount = dj.byId("ft_amt").get("value");
					var ftAcctCurrency = dj.byId("applicant_act_cur_code").get("value");
					var productCode = m._config.productCode;
					var bankAbbvName = "";
					if(dj.byId("issuing_bank_abbv_name") && dj.byId("issuing_bank_abbv_name").get("value")!== "")
					{
						bankAbbvName = dj.byId("issuing_bank_abbv_name").get("value");
					}
					var masterCurrency = dj.byId("applicant_act_cur_code").get("value");
					var isDirectConversion = false;
						if(ftCurrency !== "" && !isNaN(amount) && productCode !== "" && bankAbbvName !== "" )
						{	
							if (ftCurrency !== ftAcctCurrency)
							{
								fromCurrency = ftAcctCurrency;
								toCurrency   = ftCurrency;
								masterCurrency = ftAcctCurrency;
							}
							if(fromCurrency && toCurrency)
							{
								if(d.byId(fxSection)&&(d.style(d.byId(fxSection),"display") === "none"))
								{
									m.animate("wipeIn", d.byId(fxSection));
								}							
								m.fetchFXDetails(fromCurrency, toCurrency, amount, productCode, bankAbbvName, masterCurrency, isDirectConversion);
								if(dj.byId("fx_rates_type_1") && dj.byId("fx_rates_type_1").get("checked"))
								{
									if(isNaN(dj.byId("fx_exchange_rate").get("value")) || dj.byId("fx_exchange_rate_cur_code").get("value") === "" ||
											isNaN(dj.byId("fx_exchange_rate_amt").get("value")) || (m._config.fxParamData[dj.byId("sub_product_code").get("value")][dj.byId("issuing_bank_abbv_name").get("value")].toleranceDispInd === "Y" && (isNaN(dj.byId("fx_tolerance_rate").get("value")) || 
											isNaN(dj.byId("fx_tolerance_rate_amt").get("value")) || dj.byId("fx_tolerance_rate_cur_code").get("value") === "")))
									{
										_clearRequiredFields(m.getLocalization("FXDefaultErrorMessage"));
									}
								}
							}
							else
							{
								if(d.byId(fxSection) && (d.style(d.byId(fxSection),"display") !== "none"))
								{
									m.animate("wipeOut", d.byId(fxSection));
								}
								m.defaultBindTheFXTypes();
							}
						}
						if (dj.byId("recurring_payment_enabled") && dj.byId("recurring_payment_enabled").get("checked") && dj.byId("fx_rates_type_2"))
						{
							dj.byId("fx_rates_type_2").set("disabled", true);
							m.animate("wipeOut", d.byId("contracts_div"));
						}	
					}
			}
		},
		
		
		bind : function() {
			
			m.setValidation("fx_tolerance_rate",m.validateToleranceAndExchangeRate);
			m.connect("beneficiary_name", "onChange", m.checkBeneficiaryNicknameDiv);
			m.connect("applicant_act_name", "onChange", m.checkNickNameDiv);
			m.connect("applicant_act_name", "onChange", function() {
				var check_currency = dj.byId('currency_res').get('value');
				if(check_currency==="true"){
				_compareApplicantAndBenificiaryCurrency();
				}
        	});
			m.setValidation("template_id", m.validateTemplateId);
			m.setValidation("request_date", m.validateCashRequestDate);
			m.setValidation("iss_date", m.validateCashProcessingDate);
			// clear the date array to make ajax call for BusinessDate to get holidays and cutoff details		
			m.connect("iss_date","onClick", function(){
				m.clearDateCache();
				if(misys._config.isMultiBank){
					var customer_bank;
					if(dijit.byId("customer_bank"))
					{
						customer_bank = dijit.byId("customer_bank").get("value");
					}
					if(customer_bank !== "" && misys && misys._config && misys._config.businessDateForBank && misys._config.businessDateForBank[customer_bank][0] && misys._config.businessDateForBank[customer_bank][0].value !== "")
					{
						var yearServer = parseInt(misys._config.businessDateForBank[customer_bank][0].value.substring(0,4), 10);
						var monthServer = parseInt(misys._config.businessDateForBank[customer_bank][0].value.substring(5,7), 10);
						var dateServer = parseInt(misys._config.businessDateForBank[customer_bank][0].value.substring(8,10), 10);
						this.dropDown.currentFocus = new  Date(yearServer, monthServer - 1, dateServer);
					}
				}
			});
			m.setValidation("ft_cur_code", m.validateCurrency);
			m.setValidation("cpty_bank_country", m.validateCountry);
			m.setValidation("intermediary_bank_country", m.validateCountry);
			m.setValidation("beneficiary_country", m.validateCountry);
			m.setValidation("fx_exchange_rate", m.validateToleranceAndExchangeRate);
			m.setValidation("notify_beneficiary_email", m.validateEmailAddr);
			m.setValidation("cpty_bank_swift_bic_code", m.validateBICFormat);
			m.setValidation("intermediary_bank_swift_bic_code", m.validateBICFormat);
			m.connect("entity", "onClick", m.validateRequiredField);
			m.connect("applicant_act_name", "onClick", m.validateRequiredField);
			m.connect("beneficiary_name", "onClick", m.validateRequiredField);
 	 	 	m.connect("beneficiary_address", "onClick", m.validateRequiredField);
 	 	 	m.connect("beneficiary_account", "onClick", m.validateRequiredField);
 	 	 	m.connect("cpty_bank_name", "onClick", m.validateRequiredField);
 	 	 	m.connect("cpty_bank_address_line_1", "onClick", m.validateRequiredField);
 	 	 	m.connect("cpty_bank_country", "onClick", m.validateRequiredField);
			
			m.connect("recurring_flag", "onClick", m.showRecurring);

			m.setValidation("beneficiary_name", _validateBeneficiaryName);
			m.connect("beneficiary_name", "onChange", function(){
				_beneficiaryChangeHandler();
				if(dj.byId("notify_beneficiary_email") && dj.byId("notify_beneficiary").get("checked"))
				{
					if(dj.byId("notify_beneficiary_choice_1").get("checked"))
						{
						if(dj.byId("bene_adv_email_no_send").get("value") !== "")
							{
							dj.byId("notify_beneficiary_email").set("value", dj.byId("bene_adv_email_no_send").get("value"));
							}
						else if(dj.byId("bene_adv_email_no_send1").get("value") !== "")
							{
							dj.byId("notify_beneficiary_email").set("value", dj.byId("bene_adv_email_no_send1").get("value"));
							}
						else
							{
							dj.byId("notify_beneficiary").set("checked", false);
							dj.byId("notify_beneficiary_choice_1").set("checked", false);
							dj.byId("notify_beneficiary_email").set("value", "");
							dj.byId("notify_beneficiary_email").set("disabled", true);
							}
						}
					else if(dj.byId("notify_beneficiary_choice_2").get("checked"))
						{
						dj.byId("notify_beneficiary_email").set("value", "");
						}
				}
			});
			m.connect("beneficiary_img", "onClick", _beneficiaryButtonHandler);
			m.connect("beneficiary_address", "onBlur",function(){ _validateAddressRegexBeneficiary(dj.byId("beneficiary_address"));});
			m.connect("beneficiary_city", "onBlur", function(){_validateAddressRegexBeneficiary(dj.byId("beneficiary_city"));});
			m.connect("beneficiary_dom", "onBlur", function(){_validateAddressRegexBeneficiary(dj.byId("beneficiary_dom"));});
			m.connect("cpty_bank_address_line_1", "onBlur", function(){_validateAddressRegexBeneficiary(dj.byId("cpty_bank_address_line_1"));});
			m.connect("cpty_bank_address_line_2", "onBlur", function(){_validateAddressRegexBeneficiary(dj.byId("cpty_bank_address_line_2"));});
			m.connect("cpty_bank_dom", "onBlur", function(){_validateAddressRegexBeneficiary(dj.byId("cpty_bank_dom"));});
			m.connect("intermediary_bank_address_line_1", "onBlur", function(){_validateAddressRegexBeneficiary(dj.byId("intermediary_bank_address_line_1"));});
			m.connect("intermediary_bank_address_line_2", "onBlur", function(){_validateAddressRegexBeneficiary(dj.byId("intermediary_bank_address_line_2"));});
			m.connect("intermediary_bank_dom", "onBlur", function(){_validateAddressRegexBeneficiary(dj.byId("intermediary_bank_dom"));});
			m.connect("cpty_bank_name", "onBlur",function(){ _validateAddressRegexBeneficiary(dj.byId("cpty_bank_name"));});
			m.connect("intermediary_bank_name", "onBlur",function(){ _validateAddressRegexBeneficiary(dj.byId("intermediary_bank_name"));});
			m.connect("beneficiary_account", "onBlur", _validateAccountRegexBeneficiary);
			m.connect("notify_beneficiary", "onClick", _changeBeneficiaryNotification);
			m.connect("notify_beneficiary_choice_1", "onClick", _changeBeneficiaryNotificationEmail);
			m.connect("notify_beneficiary_choice_2", "onClick", _changeBeneficiaryNotificationEmail);

			m.connect("beneficiary_bank_branch_address_line_1", "onBlur", function(){
				_validateBranchAddressRegex(dj.byId("beneficiary_bank_branch_address_line_1"));
			});
			m.connect("cust_ref_id", "onBlur", function(){
				_validateCutomerReference(dj.byId("cust_ref_id"));
			});
			m.connect("instruction_to_bank", "onBlur", function(){
				_validateInstructionToBrachRegx(dj.byId("instruction_to_bank"));
			});
			m.connect("payment_details_to_beneficiary", "onBlur", function(){
				_validateInstructionToBrachRegx(dj.byId("payment_details_to_beneficiary"));
			});
			
			m.connect("beneficiary_bank_branch_address_line_2", "onBlur", function(){
				_validateBranchAddressRegex(dj.byId("beneficiary_bank_branch_address_line_2"));
			});
			m.connect("beneficiary_bank_branch_dom", "onBlur", function(){
				_validateBranchAddressRegex(dj.byId("beneficiary_bank_branch_dom"));
			});
			
			m.connect("cpty_bank_swift_bic_code","onChange",_matchBicCodes);
			m.connect("cpty_bank_swift_bic_code","onBlur",function() {
				
				if(dj.byId("cpty_bank_swift_bic_code") && (dj.byId("cpty_bank_swift_bic_code").get("value").length === 11 || dj.byId("cpty_bank_swift_bic_code").get("value").length === 8)){
					_populateBankDetailsMeps();
				}
				if (dj.byId("cpty_bank_swift_bic_code") && dj.byId("cpty_bank_swift_bic_code").get("value").length === 0)
				{		
					if( (dj.byId("pre_approved") && dj.byId("pre_approved").get("value") === "") || (dj.byId("pre_approved") && dj.byId("pre_approved").get("value") === null)){
						m.toggleFieldsReadOnly(["cpty_bank_swift_bic_code","cpty_bank_name","cpty_bank_address_line_1","cpty_bank_address_line_2","cpty_bank_dom","cpty_bank_country"], false);
						dj.byId("beneficiary_bank_branch_address_line_1").set("readOnly", true);
						dj.byId("branch_address_flag").set("checked", false);
						dj.byId("cpty_bank_country_img").set("disabled",false);
					}
					bicCode.clear();
				}
				else
				{
					//dj.byId("beneficiary_bank_branch_address_line_1").set("readOnly", false);
					dj.byId("cpty_bank_country_img").set("disabled",true);
					m.toggleFieldsReadOnly(["cpty_bank_name","cpty_bank_address_line_1","cpty_bank_address_line_2","cpty_bank_dom","cpty_bank_country"], true);
					if(dj.byId("cpty_bank_swift_bic_code") && dj.byId("cpty_bank_swift_bic_code").get("value").length < 11 && dj.byId("cpty_bank_swift_bic_code").get("value").length > 0 && dj.byId("cpty_bank_swift_bic_code").get("value").length !== 8 ){
						CptybicCode.clear();
					}
					if(dj.byId("intermediary_flag") && dj.byId("intermediary_flag").get("value") != ""){
						if(dj.byId("intermediary_flag").get("value") === "Y"){						
							m.toggleRequired("intermediary_bank_swift_bic_code", true);
							m.toggleRequired("intermediary_bank_name", true);
							//MPS-57552
							m.toggleRequired("intermediary_bank_address_line_1", true);
							m.toggleRequired("intermediary_bank_country", true);
						}	
						else if(dj.byId("intermediary_flag").get("value") === "N"){
							m.toggleRequired("intermediary_bank_swift_bic_code", false);
							m.toggleRequired("intermediary_bank_name", false);
							m.toggleRequired("intermediary_bank_country", false);
							m.toggleRequired("intermediary_bank_address_line_1", false);
						}		
					}
				}
			});
			
			m.connect("intermediary_bank_swift_bic_code","onChange",_matchBicCodes);
			m.connect("intermediary_bank_swift_bic_code","onBlur",function(){
				
				var intermediaryBankCountryImg = dj.byId("intermediary_bank_country_img");
				if(dj.byId("intermediary_bank_swift_bic_code") && (dj.byId("intermediary_bank_swift_bic_code").get("value").length === 11 || dj.byId("intermediary_bank_swift_bic_code").get("value").length === 8)){
					_populateIntermediaryBankDetails();
				}
				if(dj.byId("intermediary_bank_swift_bic_code").get("value").length === 0)
		    	{
					m.toggleFieldsReadOnly(["intermediary_bank_swift_bic_code","intermediary_bank_name","intermediary_bank_address_line_1","intermediary_bank_address_line_2","intermediary_bank_dom","intermediary_bank_country"], false);
					interBicCode.clear();
		    	}
				
				else if((dj.byId("intermediary_bank_name").get("value") !== "" || dj.byId("intermediary_bank_address_line_1").get("value") !== "" || dj.byId("intermediary_bank_country").get("value") !== ""))
				{
					m.toggleFieldsReadOnly(["intermediary_bank_name","intermediary_bank_address_line_1","intermediary_bank_address_line_2","intermediary_bank_dom","intermediary_bank_country"], true);
				}
			
				if (intermediaryBankCountryImg)
				{
					if ((dj.byId("intermediary_bank_swift_bic_code").get("value").length !== 0 && hasIntermediaryBankDetails))
					{
						if(dj.byId("intermediary_bank_country").get("value") !== "" ){
							intermediaryBankCountryImg.set("disabled", true);
						}
					} else
					{
						intermediaryBankCountryImg.set("disabled", false);
					}
				}
			});
			
			
			m.connect("intermediary_bank_country","onBlur",function(){
				
				var intermediaryBankCountryImg = dj.byId("intermediary_bank_country_img");
				
				if((dj.byId("intermediary_bank_name").get("value") !== "" || dj.byId("intermediary_bank_address_line_1").get("value") !== "" || dj.byId("intermediary_bank_country").get("value") !== ""))
				{
					m.toggleFieldsReadOnly(["intermediary_bank_name","intermediary_bank_address_line_1","intermediary_bank_address_line_2","intermediary_bank_dom","intermediary_bank_country"], true);
				}
				
				if(dj.byId("intermediary_bank_country").get("value") !== "" ){
					intermediaryBankCountryImg.set("disabled", true);
				}
				
			});
			
			m.connect("branch_address_flag", "onChange", function(){
				_toggleBranchAddress(this.get("checked"));
			});	
			
			m.connect("beneficiary_bank_branch_address_line_1", "onChange", function(){
				if(this.get("value") !== "")
				{
					if(!dj.byId("branch_address_flag").get("checked"))
					{
						dj.byId("branch_address_flag").set("checked", true);
					}
				}
				if(m._config.isBeneficiaryAccountsPopulated)
				{
					if(this.get("value") === "")
					{
						dj.byId("branch_address_flag").set("checked", false);
					}
				}
			});	
			
			m.connect("pre_approved_status","onChange",function(){
				_onPreApprovedChangeToggleBranchAdress();
				if(dj.byId("pre_approved_status").get("value")==="N" )
				{
						if(dj.byId("bank_img"))
						{
							dj.byId("bank_img").set("disabled",false);
						}
						if(dj.byId("bank_iso_img"))
						{
							dj.byId("bank_iso_img").set("disabled",true);
						}
						if(dj.byId("currency"))
						{
							dj.byId("currency").set("disabled",false);
						}
						if(dj.byId("cpty_bank_country_img"))
						{
							if(dj.byId("cpty_bank_swift_bic_code").get("value").length === 0)
						    {
								dj.byId("cpty_bank_country_img").set("disabled", false);
							}
							else
							{
								dj.byId("cpty_bank_country_img").set("disabled", true);
							}
						}
				}
			});
			
			m.connect("intermediary_bank_swift_bic_code","onBlur",function(){
				if(dj.byId("intermediary_bank_swift_bic_code").get("value").length !== 0  && (hasIntermediaryBankDetails || (dj.byId("has_intermediary") && dj.byId("has_intermediary").get('value')=="true")))
		    	{
					dj.byId("intermediary_bank_country_img").set("disabled", true);
					dj.byId("inter_bank_iso_img").set("disabled",true);
			    }
				else
				{
					dj.byId("intermediary_bank_country_img").set("disabled", false);
					dj.byId("inter_bank_iso_img").set("disabled",false);
				}
			});
			
			m.connect("entity", "onChange", function(){				
				if(!misys._config.isMultiBank) {
					m.setApplicantReference();
				}
				formLoading = true;
				
				dj.byId("applicant_act_name").set("value", "");
				if(dj.byId("recurring_flag"))
				{
					dj.byId("recurring_flag").set("checked", false);
				}
				
				if(!misys._config.isMultiBank) {
					m.setApplicantReference();
				}
			});
			/**
			 * This basically deals with the multibank scenarios for recurring
			 */
			m.connect("customer_bank", "onChange", function(){
				m.handleMultiBankRecurring(validationFailedOrDraftMode);
				//this is to handle an onchange event which was getting triggered while onformload
				validationFailedOrDraftMode = false;
			});
			if(dj.byId("bulk_ref_id") && dj.byId("bulk_ref_id").get("value") !== "" && dj.byId("issuing_bank_abbv_name") && dj.byId("issuing_bank_abbv_name").get('value') !== "")
			{
				m.initializeFX(dj.byId("sub_product_code").get("value"), dj.byId("issuing_bank_abbv_name").get("value"));
				if(dj.byId('applicant_act_cur_code') && dj.byId('applicant_act_cur_code').get('value') !== '' && dj.byId('ft_cur_code') && dj.byId('ft_cur_code').get('value') !== '' && dj.byId('applicant_act_cur_code').get('value')!== dj.byId('ft_cur_code').get('value') && !isNaN(dj.byId("ft_amt").get("value")))
				{
					m.onloadFXActions();
				}
				else
				{
					m.defaultBindTheFXTypes();
				}
				
				_handleFXAction();
			}
			else
			{
				m.connect("customer_bank", "onChange", _handleCusomterBankOnChangeFields);
			}
			
			m.connect("applicant_act_name", "onChange", function() {
				if(dj.byId("customer_bank") && dj.byId("applicant_act_name") && dj.byId("applicant_act_name").get("value") !== "")
				{	
					dj.byId("customer_bank").set("value", m._config.customerBankName);
				}
				_applicantAccountChangeHandler();
			});
			
			m.connect("clear_img", "onClick", function(){
				_clearButtonHandler();
				if(dj.byId("notify_beneficiary_email"))
					{
					dj.byId("notify_beneficiary").set("checked", false);
					dj.byId("notify_beneficiary_choice_1").set("checked", false);
					dj.byId("notify_beneficiary_choice_2").set("checked", false);
					dj.byId("notify_beneficiary_choice_1").set("disabled", true);
					dj.byId("notify_beneficiary_choice_2").set("disabled", true);
					dj.byId("notify_beneficiary_email").set("value", "");
					dj.byId("notify_beneficiary_email").set("disabled", true);
					dj.byId("bene_email_1").set("value", "");
					dj.byId("bene_email_2").set("value", "");
					}
				_swiftClearIntermediaryBankDetails();
			});
			
			m.connect("iss_date", "onChange", function(){	
				var dateValue = this.get("value");
				if(dj.byId("request_date")) 
				{
					if(dj.byId("request_date").get("value") === null || m.compareDateFields(dj.byId("request_date"), this)) 
					{
						dj.byId("request_date").set("value", dateValue);
					}
				}
			});
						
			m.connect("applicant_act_pab", "onChange", _applicantAccountPABHandler);
			
			//Bind all recurring payment details fields
			m.bindRecurringFields();
			
			m.connect("ft_cur_code", "onBlur", function(){
				m.setCurrency(this, ["ft_amt"]);
			});
			var subProduct = dj.byId("sub_product_code").get("value");
			if(dj.byId("issuing_bank_abbv_name") && dj.byId("issuing_bank_abbv_name").get("value") !== "" && m._config.fxParamData && m._config.fxParamData[subProduct][dj.byId("issuing_bank_abbv_name").get("value")].isFXEnabled === "Y"){
				//Start FX Actions
				m.connect("ft_cur_code", "onBlur", function(){
					m.setCurrency(this, ["ft_amt"]);
					if(dj.byId("ft_cur_code").get("value") !== "" && !isNaN(dj.byId("ft_amt").get("value"))){
						m.fireFXAction();
					}else{
						m.defaultBindTheFXTypes();
					}
				});
				m.connect("ft_cur_code", "onChange", function(){
					m.setCurrency(this, ["ft_amt"]);
					if(dj.byId("ft_cur_code").get("value") !== "" && !isNaN(dj.byId("ft_amt").get("value"))){
						m.fireFXAction();
					}else{
						m.defaultBindTheFXTypes();
					}
				});
				m.connect("ft_amt", "onBlur", function(){
					m.setTnxAmt(this.get("value"));
					var ftCurrency="";
					if(dj.byId("ft_cur_code")){
						ftCurrency = dj.byId("ft_cur_code").get("value");					
					}
					if(!isNaN(dj.byId("ft_amt").get("value")) && ftCurrency !== ""){
						m.fireFXAction();
					}else{
						m.defaultBindTheFXTypes();
					}
				});
			}
			else
			{
				if(d.byId(fxSection))
					{
						d.style(fxSection,"display","none");
					}
			}
			
			if(dijit.byId("ft_cur_code") && dijit.byId("ft_amt"))
			{
				misys.setCurrency(dijit.byId("ft_cur_code"), ["ft_amt"]);
            }
		},
		

		onFormLoad : function() {
			m.setCurrency(dj.byId("ft_cur_code"), ["ft_amt"]);
			if(misys._config.nickname==="true" && dj.byId("applicant_act_nickname") && dj.byId("applicant_act_nickname").get("value")!=="" && d.byId("nickname")){
				m.animate("fadeIn", d.byId("nickname"));
				 d.style("nickname","display","inline");
				d.byId("nickname").innerHTML = dj.byId("applicant_act_nickname").get("value");
			}else{
				m.animate("fadeOut", d.byId("applicant_act_nickname_row"));
			}
			var modeValue = dijit.byId("mode") ? dijit.byId("mode").get("value") : "";
			if(modeValue === "DRAFT" && dj.byId("beneficiary_name") && dj.byId("applicant_act_pab") && dj.byId("applicant_act_pab").get("value") === "Y" && dj.byId("beneficiary_name").value !== "")
		    {
				if(!m.validateBeneficiaryStatus())
				{	
					dj.byId("beneficiary_name").set("state", "Error");
					dj.showTooltip(m.getLocalization("beneficiaryIsInactive"), dj.byId("beneficiary_name").domNode, 0);
				}
		    }
			
			if(dj.byId("ft_cur_code")){
				dj.byId("ft_cur_code").set("value","SGD");
				dj.byId("ft_cur_code").set("readOnly", true);
			}
			
			m.animate("fadeOut", dojo.byId("ft_amt_img"));
			
			if(d.byId("recurring_on_div"))
			{
				d.style("recurring_on_div","display","none");
			}
			if(dj.byId("notify_beneficiary") && dj.byId("notify_beneficiary").get("checked") && (modeValue === "DRAFT"))
			{
				var sendNotifyChecked = dj.byId("notify_beneficiary").get("checked");
				m.toggleRequired("notify_beneficiary_email", sendNotifyChecked);
				m.toggleRequired("notify_beneficiary_choice_1", sendNotifyChecked);
				m.toggleRequired("notify_beneficiary_choice_2", sendNotifyChecked);
				if(dj.byId("notify_beneficiary_choice_1").get("checked"))
				{
					var notifyEmailDOM = d.byId("notify_beneficiary_email_node");
					var notifyRadio2DOM = d.byId("label_notify_beneficiary_choice_2");	
					_changeBeneficiaryNotificationEmail();
					if (dj.byId("notify_beneficiary_choice_2").get("checked"))
					{
						d.place(notifyEmailDOM, notifyRadio2DOM, "after");
					}
				}
			}
			
			if(dj.byId("customer_bank") && dj.byId("customer_bank").get("value") !== '' && misys && misys._config && misys._config.businessDateForBank && misys._config.businessDateForBank[dj.byId("customer_bank").get("value")] && misys._config.businessDateForBank[dj.byId("customer_bank").get("value")][0] && misys._config.businessDateForBank[dj.byId("customer_bank").get("value")][0].value !== '')
			{
				var date = misys._config.businessDateForBank[dj.byId("customer_bank").get("value")][0].value;
				var yearServer = date.substring(0,4);
				var monthServer = date.substring(5,7);
				var dateServer = date.substring(8,10);
				date = dateServer + "/" + monthServer + "/" + yearServer;
				var date1 = new Date(yearServer, monthServer - 1, dateServer);
				if(dj.byId("option_for_tnx") && dj.byId("option_for_tnx").get("value") === 'SCRATCH')
				{
					dj.byId("appl_date").set("value", date);
					document.getElementById('appl_date_view_row').childNodes[1].innerHTML = date;
					if(dj.byId("appl_date_hidden")){
						dj.byId("appl_date_hidden").set("value", date1);
					}
				}
				if(dj.byId("todays_date"))
				{
					dj.byId("todays_date").set("value", date1);
				}
			}
			if(dj.byId("notify_beneficiary").get("checked") && dj.byId("notify_beneficiary_choice_1").get("checked") && (dijit.byId("mode").value === "DRAFT"))
			{
				var notifyEmailDOMNode = d.byId("notify_beneficiary_email_node");
				var notifyRadio2DOMNode = d.byId("label_notify_beneficiary_choice_2");	
				_changeBeneficiaryNotificationEmail();
				if (dj.byId("notify_beneficiary_choice_2").get("checked"))
				{
					d.place(notifyEmailDOMNode, notifyRadio2DOMNode, "after");
				}
			}
			
			m.checkBeneficiaryNicknameOnFormLoad();
			
			if(misys._config.isMultiBank)
			{
				m.populateCustomerBanks(true);
				
				var entityField = dj.byId("entity");
				var linkedBankField = dj.byId("customer_bank");
				//Enable bank name drop down if it is non entity multi bank customer
				if(!entityField && linkedBankField)
				{
					linkedBankField.set('disabled', false);
					linkedBankField.set('required', true);
				}
								
				var linkedBankHiddenField = dj.byId("customer_bank_hidden");
				if(linkedBankField && linkedBankHiddenField)
				{
					linkedBankField.set("value", linkedBankHiddenField.get("value"));
				}
				if(d.byId("server_message") && d.byId("server_message").innerHTML !== "" || dijit.byId("option_for_tnx") && (dijit.byId("option_for_tnx").get("value") === "REMITTANCE_CORP" || dijit.byId("option_for_tnx").get("value") === "REMITTANCE_FI" || dijit.byId("option_for_tnx").get("value") === "TEMPLATE"))
				{
					validationFailedOrDraftMode = true;
				}
				if(dj.byId("issuing_bank_abbv_name") && dj.byId("issuing_bank_abbv_name").get("value") !== "")
				{
					hasCustomerBankValue = true;
					formLoading = true;
					linkedBankField.set("value", dj.byId("issuing_bank_abbv_name").get("value"));
					linkedBankHiddenField.set("value", dj.byId("issuing_bank_abbv_name").get("value"));
				}
				if(misys._config.perBankRecurringAllowed && dojo.byId("recurring_payment_checkbox") && dj.byId("customer_bank"))
				{
					if(dj.byId("customer_bank").get("value") === "")
						{
							m.animate("fadeOut", dojo.byId("recurring_payment_checkbox"));
						}
					else if(dj.byId("customer_bank").get("value") !== "" && misys._config.perBankRecurringAllowed[dj.byId("customer_bank").get("value")] !== "Y")
						{
							m.animate("fadeOut", dojo.byId("recurring_payment_checkbox"));
						}
				}
				if(entityField && entityField.get("value") === "" && linkedBankField)
				{
					linkedBankField.set("disabled",true);
					linkedBankField.set("required",false);
				}
				if(dijit.byId("recurring_frequency") && dijit.byId("customer_bank").get("value") !== "" && misys._config.perBankFrequency)
				{
					var frequencyStore = misys._config.perBankFrequency[dijit.byId("customer_bank").get("value")];
					if(frequencyStore)
						{
							dijit.byId("recurring_frequency").store = new dojo.data.ItemFileReadStore(
									{
										data :
										{
											identifier : "value",
											label : "name",
											items : frequencyStore
										}
									});
							dijit.byId("recurring_frequency").fetchProperties =
							{
								sort : [
								{
									attribute : "name"
								} ]
							};
						
						}
					dijit.byId("recurring_frequency").set("value",dijit.byId("recurring_frequency")._lastQuery);
				}
			}	
			else {
				m.setApplicantReference();
			}
			
			d.forEach(d.query(".mepsDisclaimer"),function(node){
				var productDisclaimer = dj.byId("sub_product_code").get("value")+"_"+m.getLocalization("disclaimer");
					if(dj.byId("sub_product_code") && (node.id == productDisclaimer))
					{
						m.animate("fadeIn", productDisclaimer);
					}					
				});
			if( (dj.byId("pre_approved") && dj.byId("pre_approved").get("value") !== "") || (dj.byId("pre_approved") && dj.byId("pre_approved").get("value") !== null))
			{
				if(dj.byId("beneficiary_country_btn_img"))
				{
					dj.byId("beneficiary_country_btn_img").set("disabled",true);
				}
			}
			_swiftClearBeneficiaryAddressFields();
			
			_swiftClearIntermediaryBankDetails();
			
			if(dj.byId("cpty_bank_swift_bic_code") && (dj.byId("cpty_bank_swift_bic_code").get("value").length === 11 || dj.byId("cpty_bank_swift_bic_code").get("value").length === 8)){
				_populateBankDetailsMeps();
				if(dj.byId("intermediary_flag") && dj.byId("intermediary_flag").get("value") != ""){
					if(dj.byId("intermediary_flag").get("value") === "Y"){						
						m.toggleRequired("intermediary_bank_swift_bic_code", true);
						m.toggleRequired("intermediary_bank_name", true);
						m.toggleRequired("intermediary_bank_address_line_1", true);
						m.toggleRequired("intermediary_bank_country", true);
					}	
					else if(dj.byId("intermediary_flag").get("value") === "N"){
						m.toggleRequired("intermediary_bank_swift_bic_code", false);
						m.toggleRequired("intermediary_bank_name", false);
						m.toggleRequired("intermediary_bank_country", false);
						m.toggleRequired("intermediary_bank_address_line_1", false);
					}	
				}
			}
			
			if(dj.byId("branch_address_flag"))
			{
				if(dj.byId("cpty_bank_swift_bic_code") && dj.byId("cpty_bank_swift_bic_code").get("value").length === 0)
				{
					dj.byId("branch_address_flag").set("checked", false);
					dj.byId("branch_address_flag").set("readOnly", true);
				}
				else
				{
					dj.byId("branch_address_flag").set("readOnly", false);
					if(dj.byId("branch_address_flag").get("checked"))
					{
						m.toggleRequired("beneficiary_bank_branch_address_line_1", true);
					}
					else
					{
						m.toggleRequired("beneficiary_bank_branch_address_line_1", false);
					}
					
				}
			}
			_onPreApprovedChangeToggleBranchAdress();

			m.initForm();

			dj.byId("payment_details_to_beneficiary").set("required",true);
			if(document.getElementById('mandatorySpan') == undefined)
			{
				var mandatory = dojo.create('span' ,{'id':'mandatorySpan' , 'class' : 'required-field-symbol' ,'innerHTML' : '*' });
				d.parser.parse(mandatory);
				dojo.place(mandatory , dojo.byId('payment_details_to_beneficiary') , "before");
			}
			
			if (dj.byId("recurring_payment_enabled") && dj.byId("recurring_payment_enabled").get("checked"))
			{
				dj.byId("recurring_flag").set("checked", true);
			    //this is to mark recurring fields mandatory if recurring is enabled
				m._config.clearOnSecondCall = true; 
				m.showSavedRecurringDetails(false);
				d.style("recurring_payment_div","display","block");
			}
			else
			{
				if(d.byId("recurring_payment_div"))
				{
					d.style("recurring_payment_div","display","none");
				}
				m.hasRecurringPayment();
				m.showSavedRecurringDetails(false);
			}
			
			m.toggleSections();
			m.showRecurring();
			
			//hide fx section by default
			
			if (!m._config.isMultiBank && dj.byId("issuing_bank_abbv_name") && dj.byId("issuing_bank_abbv_name").get("value") !== "" && m._config.fxParamData && dj.byId("sub_product_code") && dj.byId("sub_product_code").get("value") !== "" && dj.byId("sub_product_code").get("value") !== "IBG")
			{
				m.initializeFX(dj.byId("sub_product_code").get("value"), dj.byId("issuing_bank_abbv_name").get("value"));
				if(dj.byId("applicant_act_cur_code") && dj.byId("applicant_act_cur_code").get("value") !== "" && dj.byId("ft_cur_code") && dj.byId("ft_cur_code").get("value") !== "" && dj.byId("applicant_act_cur_code").get("value")!== dj.byId("ft_cur_code").get("value") && dj.byId("ft_amt") && !isNaN(dj.byId("ft_amt").get("value")))
				{
					m.onloadFXActions();
				}
				else
				{
					m.defaultBindTheFXTypes();
				}
			}
			else
			{
				m.animate("fadeOut", fxMsgType);
			}
			if(d.byId(fxSection))
			{
				//In case of bulk, from template will have amount and currency values on load, hence show fx section
				if(dj.byId("bulk_ref_id").get("value") !== "" && dj.byId("ft_cur_code").get("value") !== ""&& !isNaN(dj.byId("ft_amt").get("value")))
				{
					m.initializeFX(dj.byId("sub_product_code").get("value"), dj.byId("issuing_bank_abbv_name").get("value"));
					m.fireFXAction();
				}	
				else
				{
					//show fx section if previously enabled (in case of draft)
					if((dj.byId("fx_exchange_rate_cur_code") && dj.byId("fx_exchange_rate_cur_code").get("value")!== "")|| (dj.byId("fx_total_utilise_cur_code") && dj.byId("fx_total_utilise_cur_code").get("value")!== ""))
					{
						m.animate("wipeIn", d.byId(fxSection));
									
					}
					else
					{
						d.style(fxSection,"display","none");
					}
				}
			}
		
			
			//validate processing date 
			if ((dj.byId("iss_date") && dj.byId("iss_date").get("value") !== "") && (dj.byId("iss_date").get("value") !== null))
			{
				m.validateTransferDateWithCurrentDate(dj.byId("iss_date"));
			}
			
			populateDebitAccountDetails();

		}, 
    
		initForm : function()
		{

			
			//To make "SHA" as default charging option
			if(dj.byId("charge_option") && dj.byId("charge_option").get("value") === "")
			{
				dj.byId("charge_option").set("value","SHA");
			}
			
			dj.byId("sub_product_code").set("value", "MEPS");
			
			// Control initial visibility of the Clear button based on selected debit account
			var applicantAcctPAB = dj.byId("applicant_act_pab").get("value");

			if(d.byId("clear_img"))
			{
				if(applicantAcctPAB == 'Y' && d.style(d.byId("clear_img"),"display") !== "none")
				{
					m.animate("wipeOut", d.byId('clear_img'));
					dj.byId("clear_img").setAttribute('disabled', true);
					console.log("Selected debit account is PAB. Hiding and Disabling clear button ");
				}
			}
				
			
			if(applicantAcctPAB === 'Y' || (dj.byId("pre_approved_status") && dj.byId("pre_approved_status").get("value") === "Y")) {
				
				beneficiary.toggleReadonly(true);
				if(dj.byId("cpty_bank_country_img"))
				{
					dj.byId("cpty_bank_country_img").set("disabled",true);
				}
				if(dj.byId("bank_iso_img"))
				{
					dj.byId("bank_iso_img").set("disabled",true);
				}
				m.toggleFieldsReadOnly(["branch_address_flag", "beneficiary_bank_branch_address_line_1","beneficiary_bank_branch_address_line_2","beneficiary_bank_branch_dom"], true);
				if(dj.byId("intermediary_bank_swift_bic_code").get("value").length !== 0)
				{
			
					dj.byId("inter_bank_iso_img").set("disabled",true);
					
				}
			
			}
			else{
				if( (dj.byId("pre_approved") && dj.byId("pre_approved").get("value") === "") || (dj.byId("pre_approved") && dj.byId("pre_approved").get("value") === null))
				{
					beneficiary.toggleReadonly(false);
					if(dj.byId("cpty_bank_country_img"))
					{
						dj.byId("cpty_bank_country_img").set("disabled",false);
					}
					if(dj.byId("bank_iso_img"))
					{
						dj.byId("bank_iso_img").set("disabled",false);
					}
					if(dj.byId("inter_bank_iso_img"))
					{
						dj.byId("inter_bank_iso_img").set("disabled",false);
					}
					if(dj.byId("beneficiary_country_btn_img"))
					{
						dj.byId("beneficiary_country_btn_img").set("disabled",false);
					}
					m.toggleFieldsReadOnly(["branch_address_flag", "beneficiary_bank_branch_address_line_1","beneficiary_bank_branch_address_line_2","beneficiary_bank_branch_dom"], false);
				}
				else 
				{
					beneficiary.toggleReadonly(true);	
					if(dj.byId("cpty_bank_country_img"))
					{
						dj.byId("cpty_bank_country_img").set("disabled",true);
					}
					if(dj.byId("bank_iso_img"))
					{
						dj.byId("bank_iso_img").set("disabled",true);
					}
					m.toggleFieldsReadOnly(["branch_address_flag", "beneficiary_bank_branch_address_line_1","beneficiary_bank_branch_address_line_2","beneficiary_bank_branch_dom"], true);
					if(dj.byId("intermediary_bank_swift_bic_code").get("value").length !== 0)
					{
				
						dj.byId("inter_bank_iso_img").set("disabled",true);
					
					}	
				
				}
				
			}
			
		},
		
		beforeSaveValidations : function(){
		      var entity = dj.byId("entity") ;
		      var returnValue = false;
		      if(entity && entity.get("value")== "")
	          {
	                  return returnValue;
	          }
	          else
	          {
	                  return !returnValue;
	          }
	      },
	      
			beforeSubmitValidations : function() 
			{
				var modeValue = dijit.byId("mode") ? dijit.byId("mode").get("value") : "";

				// Validate the beneficiary only in case the account is PAB
				if(modeValue === "DRAFT" && dj.byId("applicant_act_pab") && dj.byId("applicant_act_pab").get("value") === "Y" && !m.validateBeneficiaryStatus())
			    {
		    		 m._config.onSubmitErrorMsg =  m.getLocalization("beneficiaryIsInactive");
		    		 dj.byId("beneficiary_name").set("state", "Error");
		    		 return false;
			    }
				
				if(dj.byId("cpty_bank_swift_bic_code") && dj.byId("cpty_bank_swift_bic_code").get('value')!== "" && !_populateBankDetailsMeps()){
					return false;
				}
				if(dj.byId("intermediary_flag") && dj.byId("intermediary_flag").get("value") != "" &&dj.byId("intermediary_flag").get("value") === "Y"){
					if(dj.byId("intermediary_bank_swift_bic_code").length === 0 || dj.byId("intermediary_bank_name").length === 0 || dj.byId("intermediary_bank_country").length === 0){
						m.toggleRequired("intermediary_bank_swift_bic_code", true);
						m.toggleRequired("intermediary_bank_name", true);
						//MPS-57552
						m.toggleRequired("intermediary_bank_address_line_1", true);
						m.toggleRequired("intermediary_bank_country", true);
					}
				}
				if(dj.byId("intermediary_bank_swift_bic_code") && dj.byId("intermediary_bank_swift_bic_code").get("value") !== "" && !_populateIntermediaryBankDetails()) {

					return false;
				}
				if(dj.byId("intermediary_bank_swift_bic_code") && dj.byId("intermediary_bank_swift_bic_code").get("value") !== "" && !_matchBicCodes()) {
					return false;
				}
				//payment narrative 
				if(dj.byId("payment_details_to_beneficiary") && dj.byId("payment_details_to_beneficiary").get("value")!=="" && !_validateInstructionToBrachRegx(dj.byId("payment_details_to_beneficiary"))){
					return false;
				}

				
				/**	MPS-59385 : Mandatory payment narrative blank spaces validation		*/
		    	 if(dijit.byId("payment_details_to_beneficiary"))
		    	 {
		    		 if(dijit.byId("payment_details_to_beneficiary").get("required")){
		    			 var value = dijit.byId("payment_details_to_beneficiary").get("value").trim();
		    			 if(value.length === 0){
							 dj.byId("payment_details_to_beneficiary").set("value", "");
		    				 dj.byId("payment_details_to_beneficiary").set("state", "Error");
		    				 return false;
		    			 }
		    		 }
		    	 }	    	
				// Validate transfer amount should be greater than zero
				if(dj.byId("ft_amt"))
				{
					if(!m.validateAmount((dj.byId("ft_amt"))?dj.byId("ft_amt"):0))
					{
						m._config.onSubmitErrorMsg =  m.getLocalization("amountcannotzero");
						dj.byId("ft_amt").set("value", "");
						return false;
					}
				}   
	   
				 //Validate Recurring payment details prior to transaction submit
		    	 if(!m.isRecurringDetailsValidForSubmit())
		   		 {
		    		 return false;
		   		 }
				
				if(dj.byId("issuing_bank_abbv_name") && dj.byId("issuing_bank_abbv_name").get("value") !== "" && m._config.fxParamData && m._config.fxParamData[dj.byId("sub_product_code").get("value")][dj.byId("issuing_bank_abbv_name").get("value")].isFXEnabled === "Y"){
					if(!m.fxBeforeSubmitValidation())
					{
						return false;
					}
					if(!_preSubmissionFXValidation())
					{
						return false;
					}
				}
		    	 var accNo = dj.byId("applicant_act_no").get("value");
		    	 var isAccountActive = m.checkAccountStatus(accNo);
		    	 if(!isAccountActive){
		    		 m._config.onSubmitErrorMsg = misys.getLocalization('accountStatusError');
						return false;
		     	 }  	 
				if (!dj.byId("bulk_ref_id").get("value"))
				{
					var valid = false;
			        if(modeValue === "DRAFT")
			        {
			        	if (dj.byId("recurring_payment_enabled") && dj.byId("recurring_payment_enabled").get("checked"))
			        	{
			        		valid =  m.validateHolidaysAndCutOffTime("issuing_bank_abbv_name","sub_product_code",modeValue,["Start Date"],["recurring_start_date"],"entity","ft_cur_code","ft_amt");
			        	}
			        	else
			        	{
			        		valid =  m.validateHolidaysAndCutOffTime("issuing_bank_abbv_name","sub_product_code",modeValue,["Processing Date"],["iss_date"],"entity","ft_cur_code","ft_amt");
			        	}
			    	    
			        }
			        else if(modeValue === "UNSIGNED")
			        {
			        	if (dj.byId("recurring_payment_enabled") && dj.byId("recurring_payment_enabled").get("value") === "Y")
			        	{
			        		valid =  m.validateHolidaysAndCutOffTime("issuing_bank_abbv_name","sub_product_code_unsigned",modeValue,["Start Date"],["recurring_start_date_unsigned"],"display_entity_unsigned","ft_cur_code_unsigned","ft_amt_unsigned");
			        	}
			        	else
			        	{
			        		valid =  m.validateHolidaysAndCutOffTime("issuing_bank_abbv_name","sub_product_code_unsigned",modeValue,["Processing Date"],["iss_date_unsigned"],"display_entity_unsigned","ft_cur_code_unsigned","ft_amt_unsigned");
			        	}    	   
			        }
			        else
			        {
			    	    m._config.onSubmitErrorMsg = m.getLocalization("technicalErrorWhileValidatingBusinessDays");
						console.debug("Mode is unknown to validate Holidays and Cut-Off Time");
			        }
			        if(valid)
			        {
			    	   m._config.holidayCutOffEnabled = false;
			        }
			        return valid;
				}
				else
				{
					return true;
				}
			},
			showProductBasedListOfBanksforMeps : function()
			{
	    		misys.showSearchDialog("bankBicCodeMEPS","[ 'cpty_bank_swift_bic_code', 'cpty_bank_name', '', 'cpty_bank_address_line_1', 'cpty_bank_address_line_2', 'cpty_bank_dom', 'cpty_bank_country', '','intermediary_flag']", {swiftcode: false, bankcode: false}, "", "", whStyle, m.getLocalization("ListOfBanksTitleMessage"),"","",true);
			},
			showIntermediaryBicCodesforMeps : function()
			{
	    		misys.showSearchDialog("intermediaryBicCodeMEPS","[ 'intermediary_bank_swift_bic_code', 'intermediary_bank_name', 'intermediary_bank_address_line_1', 'intermediary_bank_address_line_2', 'intermediary_bank_dom', 'intermediary_bank_country']", {swiftcode: false, bankcode: false}, "", "", whStyle, m.getLocalization("ListOfBanksTitleMessage"),"","",true);
			}
});		
})(dojo, dijit, misys);//Including the client specific implementation
dojo.require('misys.client.binding.cash.create_ft_meps_client');
