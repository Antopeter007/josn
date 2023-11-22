dojo.provide("misys.binding.trade.create_ft_ttpt");

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

	/**
	 * TEMPORARILY REINTRODUCED FOR THIS SCREEN ONLY
	 */
	fncGetGlobalVariable = function(key) {
		// summary: 
		//	Intercept the old getGlobal function 
		
		var value = '';
		if(dojo.global.mtpGlobals) {
			value = dojo.global.mtpGlobals[key] || '';
		}
		return value;
	};

	fncSetGlobalVariable = function(key, value) {
		// summary: 
		//	Intercept the old setGlobal function 

		if(!dojo.global.mtpGlobals) {
			dojo.global.mtpGlobals = {};
		}
		
		dojo.global.mtpGlobals[key] = value;
	}; 
	
	function _clearFeeAcc(){
		dj.byId("fee_act_no").set("value", "");	
	}
	
	/**
	 * Open a popup to select a Master Beneficiary
	 */
	function _beneficiaryButtonHandler()
	{
		var applicantActNo = dj.byId('applicant_act_no').get('value');
		if (applicantActNo === "")
		{
			m.dialog.show("ERROR", m.getLocalization("selectDebitFirst"));
			return;
		}
		var entity = dj.byId("entity") ? dj.byId("entity").get("value") : "";
		var subProdCode = dijit.byId("sub_product_code").get("value");
		m.showSearchDialog("beneficiary_accounts", 
		   "['counterparty_name','counterparty_act_no','counterparty_cur_code', 'counterparty_address_line_1', 'counterparty_address_line_2', '', 'counterparty_dom', 'pre_approved_status', '', ''," +
		   "'cpty_bank_name', 'cpty_bank_address_line_1', 'cpty_bank_address_line_2', 'cpty_bank_dom', 'cpty_branch_address_line_1', 'cpty_branch_address_line_2', 'cpty_branch_dom','','', " +
		   "'cpty_bank_swift_bic_code', 'cpty_bank_code', 'cpty_branch_code', 'cpty_branch_name','pre_approved', '','','bene_adv_beneficiary_id_no_send', " +
		   "'bene_adv_mailing_name_add_1_no_send','bene_adv_mailing_name_add_2_no_send','bene_adv_mailing_name_add_3_no_send','bene_adv_mailing_name_add_4_no_send', " +
		   "'bene_adv_mailing_name_add_5_no_send','bene_adv_mailing_name_add_6_no_send','bene_adv_postal_code_no_send','bene_adv_country_no_send','bene_email_1'," + 
		   "'bene_email_2','counterparty_postal_code','counterparty_country', 'bene_adv_fax_no_send','bene_adv_phone_no_send','beneficiary_nickname']",
		   { product_type: subProdCode, entity_name: entity}, 
		   "", subProdCode, "width:710px;height:350px;", m.getLocalization("ListOfBeneficiriesTitleMessage"));
			
	}
	
	function _applicantAccountButtonHandler()
	{
		var prodCode = dijit.byId('product_code').get('value');
		misys.showSearchDialog("account", "['applicant_act_no','', '', '', '','applicant_act_cur_code', '']", "", "", prodCode, "width:650px;height:350px;", m.getLocalization("ListOfAccountsTitleMessage"));
	}
	
	d.mixin(m._config, {

		initReAuthParams : function() {

			var reAuthParams = {
				productCode : "FT",
				subProductCode : dj.byId("sub_product_code").get("value"),
				transactionTypeCode : "01",
				entity : dj.byId("entity") ? dj.byId("entity").get("value") : "",
				currency : dj.byId("ft_cur_code").get("value"),
				amount : m.trimAmount(dj.byId("ft_amt").get("value")),
				bankAbbvName :	dj.byId("issuing_bank_abbv_name")? dj.byId("issuing_bank_abbv_name").get("value") : "",
				
				es_field1 : m.trimAmount(dj.byId("ft_amt").get("value")),
				es_field2 : (dj.byId("counterparty_act_no")) ? dj.byId("counterparty_act_no").get("value") : ""
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
			var parentTabAWB;
			var parentTabPTB;
			m.setValidation("account_with_bank_iso_code", m.validateBICFormat);
			m.setValidation("pay_through_bank_iso_code", m.validateBICFormat);
			m.connect("counterparty_name", "onChange", m.checkBeneficiaryNicknameDiv);
			m.setValidation("counterparty_cur_code", m.validateCurrency);
			m.setValidation("applicant_act_cur_code", m.validateCurrency);
			m.connect("counterparty_img", "onClick", _beneficiaryButtonHandler);
			m.connect("ft_amt", "onBlur", function() {
				m.setCurrency(dj.byId("ft_cur_code"), ["ft_amt"]);
			});
			m.connect("counterparty_name", "onChange", function(){
				if(dj.byId("counterparty_cur_code").get("value") !== "")
					{
						dj.byId("ft_cur_code").set("value", dj.byId("counterparty_cur_code").get("value"));
					}
			});
			
			m.connect("counterparty_cur_code", "onChange", function(){
				if(dj.byId("counterparty_cur_code").get("value") !== "")
					{
						dj.byId("ft_cur_code").set("value", dj.byId("counterparty_cur_code").get("value"));
					}
			});
			m.connect("license_lookup","onClick", function(){
				m.getLicenses("ft");
			});
			
			m.connect("pay_through_bank_name", "onChange", function(){
				if(dj.byId("pay_through_bank_name").get("value") !== "")
					{
						m.toggleRequired("pay_through_bank_iso_code", true);
						m.toggleRequired("account_with_bank_name", true);
						m.toggleRequired("account_with_bank_iso_code", true);
					}
				else
					{
						m.toggleRequired("pay_through_bank_iso_code", false);
						m.toggleRequired("account_with_bank_name", false);
						m.toggleRequired("account_with_bank_iso_code", false);
						//Reset tabstate of Pay through bank to non mandatory if it was mandatory earlier
						parentTabPTB = dj.byId("pay_through_bank_iso_code").parentTab;
						m.resetTabState(dijit.byId(parentTabPTB));
					}
			});
			
			m.connect("account_with_bank_name", "onChange", function(){
				if(dj.byId("account_with_bank_name").get("value") !== "")
					{
						m.toggleRequired("account_with_bank_iso_code", true);
					}
				else
					{
						m.toggleRequired("account_with_bank_iso_code", false);	
						//Reset tabstate of Account with bank to non mandatory if it was mandatory earlier
						parentTabAWB = dj.byId("account_with_bank_iso_code").parentTab;
						m.resetTabState(dijit.byId(parentTabAWB));
					}
			});
			
			m.connect("applicant_act_no_img", "onClick", _applicantAccountButtonHandler);

			var ft_type = '';
			if (dijit.byId('ft_type')){
				ft_type = dijit.byId('ft_type').get('value');
			}
			fncSetGlobalVariable('ft_type', ft_type);
			
			misys.setValidation('template_id', misys.validateTemplateId);
			misys.setValidation('iss_date', misys.validateExecDate);
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
			
			//misys.connect('input_cur_code', 'onBlur', misys.initFTCounterparties);
			
			misys.connect('issuing_bank_abbv_name', 'onChange', misys.populateReferences);
			m.connect("issuing_bank_abbv_name", "onChange",m.updateBusinessDate);
			if(dijit.byId('issuing_bank_abbv_name'))
			{
				misys.connect('entity', 'onChange', function(){
					 dijit.byId('issuing_bank_abbv_name').onChange();});
			}
			misys.connect('issuing_bank_customer_reference', 'onChange', misys.setApplicantReference);
			
			misys.setValidation('iss_date', function(){
				misys.validateDateGreaterThanHitched = dojo.hitch(this, misys.validateDateGreaterThan);
				return misys.validateDateGreaterThanHitched(false, '', 'executionDateLessThanDateofDay');
			});
			if(ft_type == '01'){
				misys.setValidation('applicant_act_no', function(){
					fncValidateAccountHitched = dojo.hitch(this, fncValidateAccount);
					return fncValidateAccountHitched('transfer_account');
				});
				misys.setValidation('transfer_account', function(){
					fncValidateAccountHitched = dojo.hitch(this, fncValidateAccount);
					return fncValidateAccountHitched('applicant_act_no');
				});
			}
			//m.setValidation("counterparty_act_iso_code", m.validateBICFormat);
			m.connect("entity_img_label","onClick",_clearFeeAcc);
		},

		onFormLoad : function() {
		//  summary:
		    //          Events to perform on page load.
		    //  tags:
		    //         public
			var ft_type = fncGetGlobalVariable('ft_type');
			
			misys.setCurrency(dijit.byId('counterparty_details_ft_cur_code_nosend'), ['counterparty_details_ft_amt_nosend']);
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
			m.checkBeneficiaryNicknameOnFormLoad();		
			m.populateGridOnLoad("ft");
			// Set transaction being signed with eSecure flag to false
			// and initialize the original form submit function
			d.mixin(m, {
				isTransactionDataBeingSigned : false,
				originalRealFormSubmitFunction : function(){ return; }
			});
		},
		
		beforeSaveValidations : function(){
			var entity = dj.byId("entity") ;
			if(entity && entity.get("value") == "")
			{
				return false;
			}
			else
			{
				return true;
			}
		},
		
		beforeSubmitValidations : function() {
			
			//validate transfer amount should be greater than zero
			if(!m.validateAmount((dj.byId("ft_amt"))?dj.byId("ft_amt"):0))
			{
				m._config.onSubmitErrorMsg =  m.getLocalization("amountcannotzero");
				dj.byId("ft_amt").set("value", "");
				return false;
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

//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
//Submission functions
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-* 
fncRequestFT = function(){
	if(fncCheckFields() && fncDoPreSubmitValidations()) 
	{
		if (fncGetGlobalVariable('ft_type') == '01'){
			fncFillVar();
			_fncAjaxRequestFT();
		}
		else if (fncGetGlobalVariable('ft_type') == '02'){
			fncFillVar();
			_fncAjaxRequestFT();
		}
		else if (fncGetGlobalVariable('ft_type') == '05'){
			fncFillVar();
			_fncAjaxRequestFT();
		}
	}
};
fncAcceptFT = function(){
	dijit.byId('option').set('value', 'ACCEPT');
	misys.submit('SUBMIT');
};
fncRejectFT = function(){
	if(misys.countdown){
		_stopCountDown(misys.countdown);
	}
	_fncAjaxCancelFT();
};

//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
//Function use to add a counter party
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
//TODO: TO IMPLEMENTS, not used yet
_fncOpenCounterPartyDialog = function(){
	console.debug('_fncOpenCounterPartyDialog>>'+fncGetGlobalVariable('haveABeneficiaryAccount'));
	if (dojo.byId('counterparty_row_0') === null){fncSetGlobalVariable('haveABeneficiaryAccount', 'false');}
	if (fncGetGlobalVariable('haveABeneficiaryAccount') === 'false'){
		// call the original function to open counterpartyDialog
		misys.penCounterpartyDialog('counterparty');
	}
};

_fncDoAddCounterpartyActions = function(){
	console.debug('_fncDoAddCounterpartyActions>>'+fncGetGlobalVariable('haveABeneficiaryAccount'));
	// fill hidden field
	dijit.byId('counterparty_acct_no').set('value', dijit.byId('counterparty_details_act_no_nosend').get('value'));
	dijit.byId('counterparty_name').set('value',  dijit.byId('counterparty_details_name_nosend').get('value'));
	dijit.byId('counterparty_cur_code').set('value', dijit.byId('counterparty_details_ft_cur_code_nosend').get('value'));
	// call the original function to add a counterparty
	var isOk = fncDoAddCounterpartyActions('counterparty');
	if (isOk){
		console.debug('_fncDoAddCounterpartyActions>> IsOk');
		fncSetGlobalVariable('haveABeneficiaryAccount', 'true');
	}
};
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
//Validation Functions
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
fncValidateAccount = function(secondAccountField){
	var messageError;
	if (secondAccountField == "applicant_act_no"){
		messageError = 'creditAcctEqualsToDebitAcct';
	}
	else {
		messageError = 'debitAcctEqualsToCreditAcct';
	}
	var firstAcct = this.get('value');
	var secondAcct = dijit.byId(secondAccountField).get('value');
	console.debug('[INFO] Validate account:'+this.id);
	if (secondAcct !== '' && (this.state !== 'Error' || dijit.byId(secondAccountField).state !== 'Error'))
	{
		console.debug('[INFO] Validate equals account :'+firstAcct+' & '+secondAcct);
		if (firstAcct == secondAcct)
		{		
			//this.focus();
			//this.state = 'Error';
			this.displayMessage(misys.getLocalization(messageError, [firstAcct, secondAcct]));
			return false;
		}
		else if (dijit.byId(secondAccountField).state == 'Error'){
			dijit.byId(secondAccountField).validate();
		}
	}
	return true;
};

_fncValidateCurrencies = function(){
	var curr = dijit.byId('ft_cur_code').get('value');
	var firstCurr = dijit.byId('applicant_act_cur_code').get('value');
	var secondCurr = dijit.byId('transfer_account_cur_code').get('value');
	if (firstCurr !== '' && secondCurr !== '' && this.state !== 'Error')
	{
		console.debug('[INFO] Validate currencies: '+curr+', with: '+firstCurr+' and '+secondCurr);
		if (curr != firstCurr && curr != secondCurr)
		{
			dijit.byId('ft_cur_code').invalidMessage = misys.getLocalization('transferCurrencyDifferentThanAccountsCurrencies', [curr, firstCurr, secondCurr]);
			return false;
		}
	}
	return true;
};

//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
//Miscellaneous Functions
//*-*-*-*-*-*-*-*-*-*-*-*-*-*-* 

fncFillVar = function(){
	
	// global variable
	if (dijit.byId('applicant_reference_hidden'))
	{
		fncSetGlobalVariable('applicant_reference', dijit.byId('applicant_reference_hidden').get('value'));
	}
	else {
		fncSetGlobalVariable('applicant_reference', '');
	}
	fncSetGlobalVariable('ordering_account', dijit.byId('applicant_act_no').get('value'));
	fncSetGlobalVariable('ordering_currency', dijit.byId('applicant_act_cur_code').get('value'));
	fncSetGlobalVariable('execution_date', dijit.byId('iss_date').getDisplayedValue());
	fncSetGlobalVariable('remarks', dijit.byId('narrative_additional_instructions').get('value'));
	// for tansfer
	if (fncGetGlobalVariable('ft_type') == '01'){
		
		fncSetGlobalVariable('ft_amount', dijit.byId('ft_amt').get('value'));
		fncSetGlobalVariable('ft_cur_code', dijit.byId('ft_cur_code').get('value'));
		
		fncSetGlobalVariable('transfer_account', dijit.byId('transfer_account').get('value'));
		fncSetGlobalVariable('transfer_currency', dijit.byId('transfer_account_cur_code').get('value'));
		// initialize other variable to empty
		fncSetGlobalVariable('beneficiary_currency', '');
		fncSetGlobalVariable('beneficiary_name', '');
		fncSetGlobalVariable('beneficiary_address', '');
		fncSetGlobalVariable('beneficiary_city', '');
		fncSetGlobalVariable('beneficiary_country', '');
		fncSetGlobalVariable('beneficiary_bank', '');
		
		fncSetGlobalVariable('beneficiary_bank_routing_number', '');
		fncSetGlobalVariable('beneficiary_bank_branch', '');
		fncSetGlobalVariable('beneficiary_bank_address', '');
		fncSetGlobalVariable('beneficiary_bank_city', '');
		fncSetGlobalVariable('beneficiary_bank_country', '');
		fncSetGlobalVariable('beneficiary_bank_account', '');
		
		fncSetGlobalVariable('payment_currency', '');
		fncSetGlobalVariable('payment_amount', '');
	}
	// for payment
	if (fncGetGlobalVariable('ft_type') == '02'){
		
		fncSetGlobalVariable('ft_amount', dijit.byId('payment_amt').get('value'));
		fncSetGlobalVariable('ft_cur_code', dijit.byId('payment_cur_code').get('value'));
		
		fncSetGlobalVariable('transfer_account', '');
		fncSetGlobalVariable('transfer_currency', '');
		
		fncSetGlobalVariable('payment_currency', '');
		fncSetGlobalVariable('payment_amount', '');
		
		fncSetGlobalVariable('beneficiary_name', dijit.byId('beneficiary_name').get('value'));
		fncSetGlobalVariable('beneficiary_address', dijit.byId('beneficiary_address').get('value'));
		fncSetGlobalVariable('beneficiary_city', dijit.byId('beneficiary_city').get('value'));
		fncSetGlobalVariable('beneficiary_account', dijit.byId('counterparty_details_act_no').get('value'));
		fncSetGlobalVariable('beneficiary_bank', dijit.byId('account_with_bank_name').get('value'));
		fncSetGlobalVariable('beneficiary_country', dijit.byId('beneficiary_country').get('value'));
		
		fncSetGlobalVariable('beneficiary_bank_routing_number', dijit.byId('beneficiary_bank_routing_number').get('value'));
		fncSetGlobalVariable('beneficiary_bank_branch', dijit.byId('beneficiary_bank_branch').get('value'));
		fncSetGlobalVariable('beneficiary_bank_address', dijit.byId('beneficiary_bank_address').get('value'));
		fncSetGlobalVariable('beneficiary_bank_city', dijit.byId('account_with_bank_dom').get('value'));
		fncSetGlobalVariable('beneficiary_bank_country', dijit.byId('beneficiary_bank_country').get('value'));
		fncSetGlobalVariable('beneficiary_bank_account', dijit.byId('beneficiary_bank_account').get('value'));
		
	}
	if (fncGetGlobalVariable('ft_type') == '05'){
		
		fncSetGlobalVariable('ft_amount', dijit.byId('ft_amt').get('value'));
		fncSetGlobalVariable('ft_cur_code', dijit.byId('ft_cur_code').get('value'));
		fncSetGlobalVariable('transfer_currency', dijit.byId('transfer_account_cur_code').get('value'));
		fncSetGlobalVariable('transfer_account', dijit.byId('transfer_account').get('value'));
		
		fncSetGlobalVariable('payment_currency', dijit.byId('payment_cur_code').get('value'));
		fncSetGlobalVariable('payment_amount', dijit.byId('payment_amt').get('value'));
		
		fncSetGlobalVariable('beneficiary_name', dijit.byId('beneficiary_name').get('value'));
		fncSetGlobalVariable('beneficiary_address', dijit.byId('beneficiary_address').get('value'));
		fncSetGlobalVariable('beneficiary_city', dijit.byId('beneficiary_city').get('value'));
		fncSetGlobalVariable('beneficiary_account', dijit.byId('counterparty_details_act_no').get('value'));
		fncSetGlobalVariable('beneficiary_bank', dijit.byId('account_with_bank_name').get('value'));
		fncSetGlobalVariable('beneficiary_country', dijit.byId('beneficiary_country').get('value'));
		
		fncSetGlobalVariable('beneficiary_bank_routing_number', dijit.byId('beneficiary_bank_routing_number').get('value'));
		fncSetGlobalVariable('beneficiary_bank_branch', dijit.byId('beneficiary_bank_branch').get('value'));
		fncSetGlobalVariable('beneficiary_bank_address', dijit.byId('beneficiary_bank_address').get('value'));
		fncSetGlobalVariable('beneficiary_bank_city', dijit.byId('account_with_bank_dom').get('value'));
		fncSetGlobalVariable('beneficiary_bank_country', dijit.byId('beneficiary_bank_country').get('value'));
		fncSetGlobalVariable('beneficiary_bank_account', dijit.byId('beneficiary_bank_account').get('value'));
		
	}
	// for the fee account 
	// TODO: re-do this part
	if (dijit.byId('open_chrg_brn_by_code_1').get('value') == '01'){
		fncSetGlobalVariable('fee_account', dijit.byId('applicant_act_no').get('value'));
	}
	else if (dijit.byId('open_chrg_brn_by_code_2').get('value') == '02'){
		if (fncGetGlobalVariable('ft_type') == '01' || fncGetGlobalVariable('ft_type') == '05'){
			fncSetGlobalVariable('fee_account', dijit.byId('transfer_account').get('value'));
		}
		else if (fncGetGlobalVariable('ft_type') == '02'){
			fncSetGlobalVariable('fee_account', dijit.byId('counterparty_details_act_no').get('value'));
		}
	}
	else if (dijit.byId('open_chrg_brn_by_code_3').get('value') == '03'){
		fncSetGlobalVariable('fee_account', dijit.byId('counterparty_details_act_no').get('value'));
	}
};
//Including the client specific implementation
       dojo.require('misys.client.binding.trade.create_ft_ttpt_client');