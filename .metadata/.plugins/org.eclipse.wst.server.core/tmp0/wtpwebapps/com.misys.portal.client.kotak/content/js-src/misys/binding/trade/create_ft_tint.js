dojo.provide("misys.binding.trade.create_ft_tint");

//
// Copyright (c) 2000-2011 Misys (http://www.m.com),
// All Rights Reserved. 
//
//
// Summary: 
//      Event Binding for Letter of Credit (LC) Form, Customer Side.
//
// version:   1.2
// date:      08/04/11
//

dojo.require("misys.form.common");
dojo.require("misys.validation.common");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.TextBox");
dojo.require("misys.widget.Dialog");
dojo.require("dijit.ProgressBar");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.CheckBox");
dojo.require("dijit.layout.ContentPane");
dojo.require("dojo.data.ItemFileReadStore");
dojo.require("dojo.parser");
dojo.require("dijit.form.DateTextBox");
dojo.require("dijit.form.CurrencyTextBox");
dojo.require("dijit.form.FilteringSelect");
dojo.require("misys.form.SimpleTextarea");
dojo.require("misys.form.addons");
dojo.require("misys.form.file");
dojo.require("dijit.layout.TabContainer");
dojo.require("dojox.grid.DataGrid");
dojo.require("dojox.grid.cells.dijit");
dojo.require("misys.widget.Collaboration");
dojo.require("misys.binding.trade.ls_common");
dojo.require("misys.form.BusinessDateTextBox");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {
	
	"use strict"; // ECMA5 Strict Mode
	
	
	/**
	 * TEMPORARILY REINTRODUCED FOR THIS SCREEN ONLY
	 */
	/*fncGetGlobalVariable = function(key) {
		// summary: 
		//	Intercept the old getGlobal function 
		
		var value = '';
		if(dojo.global.mtpGlobals) {
			value = dojo.global.mtpGlobals[key] || '';
		}
		return value;
	}
*/
	/*fncSetGlobalVariable = function(key, value) {
		// summary: 
		//	Intercept the old setGlobal function 

		if(!dojo.global.mtpGlobals) {
			dojo.global.mtpGlobals = {};
		}
		
		dojo.global.mtpGlobals[key] = value;
	} */
	
	function _clearFeeAcc(){
		dj.byId("fee_act_no").set("value", "");	
	}
	
	function _beneficiaryButtonHandler()
	{
		var applicantActNo = dj.byId('applicant_act_no').get('value');
		if (applicantActNo === "")
		{
			m.dialog.show("ERROR", m.getLocalization("selectDebitFirst"));
			return;
		}
		var ProdCode = dijit.byId('product_code').get('value');
		
		
		misys.showSearchDialog('account', "['beneficiary_account','beneficiary_name', '', '', '','counterparty_cur_code']", '', '', ProdCode, 'width:650px;height:350px;',  m.getLocalization("ListOfAccountsTitleMessage"), '', '', '', '','applicant_act_no');
	}
	
	function _applicantAccountButtonHandler()
	{
         
		var prodCode = dijit.byId('product_code').get('value');	
		misys.showSearchDialog('account', "['applicant_act_no','', '', '', '','applicant_act_cur_code']", '', '',prodCode, 'width:650px;height:350px;',  m.getLocalization("ListOfAccountsTitleMessage"));
	}
	
	function _accountSelectionHandler()
	{
		var applicantActNo = dijit.byId('applicant_act_no').get('value');
		var beneficiaryActNo = dijit.byId('beneficiary_account').get('value');
		if (applicantActNo == beneficiaryActNo)
		{
			misys.dialog.show("ERROR", misys.getLocalization("sameBeneficiaryApplicantError"));
			dijit.byId('applicant_act_cur_code').set("value","");
			dijit.byId('applicant_act_no').set("value", "");
			dijit.byId('beneficiary_account').set("value", "");
			dijit.byId('counterparty_cur_code').set("value", "");
			dijit.byId('beneficiary_name').set("value", "");
			dijit.byId('ft_cur_code').set("value", "");
			
			return;
		} 
	}
	
	
	function _populateFields()
	{
		
		 dj.byId("counterparty_cur_code").set("value", dj.byId("selected_payment_cur_code").get("Value"));
		 dj.byId("beneficiary_name").set("value", dj.byId("selected_beneficiary_name").get("Value"));	
		 dj.byId("beneficiary_account").set("value", dj.byId("selected_beneficiary_account_no").get("Value"));	
		 dj.byId("beneficiary_reference").set("value", dj.byId("selected_beneficiary_reference").get("Value"));
		 dj.byId("feeAccount").set("value", dj.byId("selected_fee_act_no").get("Value"));
	}
	
	d.mixin(m._config, {

		initReAuthParams : function() {
									
			var reAuthParams = {
				productCode : 'FT',	
				subProductCode : '',
				transactionTypeCode : '01',	
				entity : dj.byId("entity") ? dj.byId("entity").get("value") : "",
				bankAbbvName :	dj.byId("issuing_bank_abbv_name")? dj.byId("issuing_bank_abbv_name").get("value") : "",
				currency : dj.byId("ft_cur_code") ? dj.byId("ft_cur_code").get("value") : "",
				amount : dj.byId("ft_amt") ? m.trimAmount(dj.byId("ft_amt").get("value")) : "",
								
				es_field1 : '',
				es_field2 : ''				
			};
			return reAuthParams;
		},
	/*
	 * Overriding to add license items in the xml.
	 */
	xmlTransform : function (/*String*/ xml) {
		var tdXMLStart = "<ft_tnx_record>";
		console.log("hello");
		/*
		 * Add license items tags, only in case of LC transaction.
		 * Else pass the input xml, without modification. (Ex : for create beneficiary from popup.)
		 */
		if(xml.indexOf(tdXMLStart) !== -1){
			// Setup the root of the XML string
			var xmlRoot = m._config.xmlTagName,
			transformedXml = xmlRoot ? ["<", xmlRoot, ">"] : [],		
					tdXMLEnd   = "</ft_tnx_record>",
					subTDXML	= "";
			subTDXML = xml.substring(tdXMLStart.length,(xml.length-tdXMLEnd.length));
			transformedXml.push(subTDXML);
			if(dj.byId("gridLicense") && dj.byId("gridLicense").store && dj.byId("gridLicense").store !== null && dj.byId("gridLicense").store._arrayOfAllItems.length >0) {
				transformedXml.push("<linked_licenses>");
				dj.byId("gridLicense").store.fetch({
					query: {REFERENCEID: '*'},
					onComplete: dojo.hitch(dj.byId("gridLicense"), function(items, request){
						dojo.forEach(items, function(item){
							transformedXml.push("<license>");
							transformedXml.push("<ls_ref_id>",item.REFERENCEID,"</ls_ref_id>");
							transformedXml.push("<bo_ref_id>",item.BO_REF_ID,"</bo_ref_id>");
							transformedXml.push("<ls_number>",item.LS_NUMBER,"</ls_number>");
							transformedXml.push("<ls_allocated_amt>",item.LS_ALLOCATED_AMT,"</ls_allocated_amt>");
							transformedXml.push("<ls_allocated_add_amt>",item.LS_ALLOCATED_ADD_AMT,"</ls_allocated_add_amt>");
							transformedXml.push("<ls_amt>",item.LS_AMT,"</ls_amt>");
							transformedXml.push("<ls_os_amt>",item.LS_OS_AMT,"</ls_os_amt>");
							transformedXml.push("<converted_os_amt>",item.CONVERTED_OS_AMT,"</converted_os_amt>");
							transformedXml.push("<allow_overdraw>",item.ALLOW_OVERDRAW,"</allow_overdraw>");
							transformedXml.push("</license>");
						});
					})
				});
				transformedXml.push("</linked_licenses>");
			}
			if(xmlRoot) {
				transformedXml.push("</", xmlRoot, ">");
			}
			return transformedXml.join("");
		}else{
			return xml;
		}

	}
});

	
	// Public functions & variables follow
	d.mixin(m, {

		bind : function() {
			/*var ft_type = '';
			if (dijit.byId('ft_type')){
				ft_type = dijit.byId('ft_type').get('value');
			}*/
			//fncSetGlobalVariable('ft_type', ft_type);
			
			m.setValidation('template_id', m.validateTemplateId);
			m.setValidation("applicant_act_cur_code", m.validateCurrency);
			m.connect("beneficiary_account_img", "onClick", _beneficiaryButtonHandler);
			m.connect("applicant_act_no_img_label", "onClick", _applicantAccountButtonHandler);
			m.connect("applicant_act_no", "onChange", _accountSelectionHandler);
			m.connect("ft_amt", "onBlur", function() {
				m.setCurrency(dj.byId("ft_cur_code"), ["ft_amt"]);
			});
			/*if(ft_type == '01' || ft_type == '05'){
				misys.setValidation('ft_cur_code', function(){
					//_fncValidateCurrenciesHitched = dojo.hitch(this, _fncValidateCurrencies);
					return _fncValidateCurrencies();
				});
				misys.connect('ft_cur_code', 'onChange', function(){
					misys.setCurrency(this, ['ft_amt']);
				});
				misys.connect('ft_amt', 'onBlur', function(){
					misys.setTnxAmt(this.get('value'));
				});
			}
			if(ft_type == '02' || ft_type == '05'){
				misys.setValidation('payment_cur_code', misys.validateCurrency);
				misys.connect('payment_cur_code', 'onChange', function(){
					misys.setCurrency(this, ['ft_amt']);
				});
				misys.connect('payment_amt', 'onBlur', function(){
					misys.setTnxAmt(this.get('value'));
				});
				
				misys.connect('ft_cur_code', 'onChange', function(){
					misys.setCurrency(this, ['ft_amt']);
				});
				misys.connect('ft_amt', 'onBlur', function(){
					misys.setTnxAmt(this.get('value'));
				});
			}*/
			m.connect("beneficiary_account", "onChange", function(){
				if(dj.byId("counterparty_cur_code").get("value") !== "")
					{
						dj.byId("ft_cur_code").set("value", dj.byId("counterparty_cur_code").get("value"));
					}
			});
			
			
		//	misys.connect('input_cur_code', 'onBlur', misys.initFTCounterparties);
			m.connect('issuing_bank_abbv_name', 'onChange', m.populateReferences);
			m.connect("issuing_bank_abbv_name", "onChange",m.updateBusinessDate);
			if(dijit.byId('issuing_bank_abbv_name'))
			{
				m.connect('entity', 'onChange', function(){
					 dijit.byId('issuing_bank_abbv_name').onChange();});
			}
			m.connect('issuing_bank_customer_reference', 'onChange', m.setApplicantReference);
			
			m.connect("license_lookup","onClick", function(){
				m.getLicenses("ft");
			});

			m.setValidation('iss_date', function(){
                var applDate = dj.byId("appl_date");
                if(!m.compareDateFields(applDate ,this)) {
                	this.invalidMessage = m.getLocalization("executionDateLessThanAppDateError",
                			[ m.getLocalizeDisplayDate(this), m.getLocalizeDisplayDate(applDate)]);
                            return false;
                } 
                return true;
        });

			m.setValidation("counterparty_act_iso_code", m.validateBICFormat);
			
			m.connect("entity_img_label","onClick",_clearFeeAcc);
		},

		onFormLoad : function() {
		//  summary:
		    //          Events to perform on page load.
		    //  tags:
		    //         public
			_populateFields();
			//var ft_type = fncGetGlobalVariable('ft_type');
			
			//m.setCurrency(dijit.byId('counterparty_details_ft_cur_code_nosend'), ['counterparty_details_ft_amt_nosend']);
			m.setCurrency(dj.byId("ft_cur_code"), ["ft_amt"]);
			var issuingBankAbbvName = dijit.byId('issuing_bank_abbv_name');
			if(issuingBankAbbvName)
			{
				issuingBankAbbvName.onChange();
			}
			
			var issuingBankCustRef = dijit.byId('issuing_bank_customer_reference');
			if(issuingBankCustRef)
			{
				issuingBankCustRef.onChange();
				//Set the value selected if any
				issuingBankCustRef.set('value',issuingBankCustRef._resetValue);
			}
			m.populateGridOnLoad("ft");
			
			// Set transaction being signed with eSecure flag to false
			// and initialize the original form submit function
			d.mixin(m, {
				isTransactionDataBeingSigned : false,
				originalRealFormSubmitFunction : function(){ return; }
			});
		},
		beforeSaveValidations : function(){
			var principleAccount = dj.byId("principal_act_no");
			if(principleAccount && principleAccount.get('value')!== "")
			{
				if(!m.validatePricipleAccount())
				{
					m._config.onSubmitErrorMsg = m.getLocalization('invalidPrincipleAccountError',[ principleAccount.get("displayedValue")]);
					m.showTooltip(m.getLocalization('invalidPrincipleAccountError',[ principleAccount.get("displayedValue")]), principleAccount.domNode);
					principleAccount.focus();
					return false;
				}
			}
			
			var feeAccount = dj.byId("fee_act_no");
			if(feeAccount && feeAccount.get('value')!== "")
			{
				if(!m.validateFeeAccount())
				{
					m._config.onSubmitErrorMsg = m.getLocalization('invalidFeeAccountError',[ feeAccount.get("displayedValue")]);
					m.showTooltip(m.getLocalization('invalidFeeAccountError',[ feeAccount.get("displayedValue")]), feeAccount.domNode);
					feeAccount.focus();
					return false;
				}
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

		beforeSubmitValidations : function() {
			// Validate amount.
			if(!m.validateAmount((dj.byId("ft_amt"))?dj.byId("ft_amt"):0))
			{
				m._config.onSubmitErrorMsg =  m.getLocalization("amountcannotzero");
				dj.byId("ft_amt").set("value", "");
				return false;
			}
			// Validate Date.
			var issDate = dj.byId("iss_date");
			var applDate = dj.byId("appl_date");
			if(issDate && issDate.get('value')!== "")
			{
                if(!m.compareDateFields(applDate ,issDate)) {
                	var displayError  = m.getLocalization("executionDateLessThanAppDateError",
                			[ m.getLocalizeDisplayDate(issDate), m.getLocalizeDisplayDate(applDate)]);
                	issDate.set("state", "Error");
					issDate.focus();
					dj.showTooltip(displayError,issDate.domNode, 0);
					return false;
                } 
			}
			var principleAccount = dj.byId("principal_act_no");
			if(principleAccount && principleAccount.get('value')!== "")
			{
				if(!m.validatePricipleAccount())
				{
					m._config.onSubmitErrorMsg = m.getLocalization('invalidPrincipleAccountError',[ principleAccount.get("displayedValue")]);
					m.showTooltip(m.getLocalization('invalidPrincipleAccountError',[ principleAccount.get("displayedValue")]), principleAccount.domNode);
					principleAccount.focus();
					return false;
				}
			}
			
			var feeAccount = dj.byId("fee_act_no");
			if(feeAccount && feeAccount.get('value')!== "")
			{
				if(!m.validateFeeAccount())
			{
					m._config.onSubmitErrorMsg = m.getLocalization('invalidFeeAccountError',[ feeAccount.get("displayedValue")]);
					m.showTooltip(m.getLocalization('invalidFeeAccountError',[ feeAccount.get("displayedValue")]), feeAccount.domNode);
					feeAccount.focus();
					return false;
				}
			}
			if(dj.byId("issuing_bank_abbv_name") && !m.validateApplDate(dj.byId("issuing_bank_abbv_name").get("value")))
			{
				m._config.onSubmitErrorMsg = m.getLocalization('changeInApplicationDates');
				m.goToTop();
				return false;
      		}
			
			return m.validateLSAmtSumAgainstTnxAmt("ft");
				
		}
	});
})(dojo, dijit, misys);
//Including the client specific implementation
       dojo.require('misys.client.binding.trade.create_ft_tint_client');