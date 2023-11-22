dojo.provide("misys.binding.system.beneficiary_master_mc");
dojo.require("misys.binding.common");
dojo.require("dojo.data.ItemFileReadStore");
dojo.require("dijit.form.FilteringSelect");
dojo.require("misys.validation.login");
dojo.require("misys.validation.password");
dojo.require("misys.form.MultiSelect");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("misys.form.common");
dojo.require("misys.validation.common");
dojo.require("misys.form.CurrencyTextBox");
dojo.require("dojox.xml.DomParser");
(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {
	var freeFormatSettlementAdditional="free-format-settlement-additional";
	var freeFormatSettlementPayment="free-format-settlement-payment";
	var beneficiaryDetailsDiv = d.byId("beneficiary-details-div");
	var beneficiaryActNoDiv = d.byId("account_no_div");
	var beneficiaryMT202ActNoDiv = d.byId("account_no_mt202_div");
	var additionalDiv = d.byId("additional-advice-div");
	var deliveryModeDiv = d.byId("delivery-mode-div");
	var intermediaryBankDetailsDiv = d.byId("intermediary-bank-details-div");
	var intermediaryBankMepsDetailsDiv = d.byId("intermediary-bank-details-meps-div");
	var bankBicCodeMepsDiv = d.byId("bank_iso_code_meps_div");
	var intermediaryBankRtgsDetailsDiv = d.byId("intermediary-bank-details-rtgs-div");
	var bankBicCodeRtgsDiv = d.byId("bank_bic_code_rtgs_div");
	var bankBicCodeDiv = d.byId("bank_iso_code_div");
	var bankCountryCodeDiv = d.byId("bank_country_code_div");
	var bankCountryDiv = d.byId("bank_country_div");
	var noCustBankAvailableDiv = "no-customer-bank-message-div";
	var label_CptyName="label[for=counterparty_name]";

	var label_BankName="label[for=bank_name]";

	var treasurySpecificFields = [ "bank_routing_no", "ordering_customer_name", "ordering_customer_address_1", "ordering_customer_dom",
		"ordering_customer_country", "ordering_customer_act_no", "inter_bank_swift", "inter_bank_name", "inter_bank_address_1" ,
		"inter_bank_dom" , "inter_bank_country", "inter_bank_routing_no", "special_routing_1", "special_routing_2", "special_routing_3", 
		"special_routing_4", "special_routing_5", "special_routing_6", "payment_detail_1", "payment_detail_2", "payment_detail_3","payment_detail_4"];
	var beneremittanceintermediarybiccode = {};
	beneremittanceintermediarybiccode.fields = [ "intermediary_bank_swift_bic_code",
	    "intermediary_bank_name",
	    "intermediary_bank_address_line_1", 
	    "intermediary_bank_address_line_2",
	    "intermediary_bank_dom",
	     "intermediary_bank_country"];
	var htmlSpan_RequiredTag="<span class='required-field-symbol'>*</span>";
	var preApprovedBeneId="pre-approved-beneficiary_beneficiary";

	var searchDialogDimension= "width:710px;height:350px;";

	beneremittanceintermediarybiccode.clear = function() {
	d.forEach(this.fields, function(node, i) {
	if (dj.byId(node)) {
	dj.byId(node).set("value", '');
	}
	});
	};
	
	var beneifsccode = {};
	beneifsccode.fields = [ "bank_ifsc_code",
	    "bank_ifsc_name",
	    "bank_ifsc_address_line_1", 
	    "bank_ifsc_address_line_2",
	    "bank_ifsc_city"];
	beneifsccode.clear = function() {
	d.forEach(this.fields, function(node, i) {
	if (dj.byId(node)) {
	dj.byId(node).set("value", '');
	}
	});
	};
	/**
	 * <h4>Summary:</h4>
	 * This method prepares the related linked customer-banks for the selected Group customer entities.
	 * This field is expected to be disabled until the selection of Entity field.
	 */
	function _populateCustomerBanks(isFormLoading)
	{
		var onFormLoad = isFormLoading?true:false;
		var entityFieldValue = dj.byId("entity") && dj.byId("entity").get('value') ? dj.byId("entity").get('value') : "*";
		var customerBankField = dj.byId("customer_bank");
		var prodTypeField = dj.byId("product_type");
		if(entityFieldValue && customerBankField)
		{
			var entityBanksDataStore = null;
			if(entityFieldValue ==="*")
			{
				entityBanksDataStore = m._config.wildcardLinkedBanksCollection[entityFieldValue];
			}
			else
			{
				entityBanksDataStore = m._config.entityBanksCollection[entityFieldValue];
			}
			customerBankField.set('disabled', false);
			customerBankField.set('required', true);
			if(!onFormLoad)
			{
				customerBankField.set('value', "");
				if(prodTypeField)
				{
					prodTypeField.set('value', "");
				}
			}
			if (entityBanksDataStore && entityBanksDataStore.length > 0)
			{
				customerBankField.store = new dojo.data.ItemFileReadStore(
				{
					data :
					{
						identifier : "value",
						label : "name",
						items : entityBanksDataStore
					}
				});
				customerBankField.fetchProperties =
				{
					sort : [
					{
						attribute : "name"
					} ]
				};
				customerBankField.set('disabled', false);
				misys.animate("fadeOut", dojo.byId(noCustBankAvailableDiv));
			}
			else
			{
				customerBankField.store = new dojo.data.ItemFileReadStore({
					data :
					{
						identifier : "value",
						label : "name",
						items : [{ value:"*", name:"*"}]
					}
				});
				customerBankField.set('disabled', true);
				if(entityFieldValue !== "")
				{
					misys.animate("fadeIn", dojo.byId(noCustBankAvailableDiv));
				}
				_populateProductTypes(true);
			}
		}
		else if(customerBankField)
		{
			customerBankField.set('disabled', true);
			customerBankField.set('value', "");
			if(entityFieldValue !== "")
			{
				// If entityFieldValue is not-empty we display bank message.
				misys.animate("fadeIn", dojo.byId(noCustBankAvailableDiv));
			}
		}
	}

	/**
	 * <h4>Summary:</h4>
	 * This method prepares the related Product Types for the combination of 
	 * Selected group customer entities and it's customer associated or linked customer-banks.
	 * This field is expected to be disabled until the selection of Product Type field.
	 */
	function _populateProductTypes(isFormLoading)
	{
		var onFormLoad = isFormLoading?true:false;
		var entityFieldValue = dj.byId("entity") && dj.byId("entity").get('value') ? dj.byId("entity").get('value') : "*";
		var customerBankField = dj.byId("customer_bank");
		var customerBankFieldValue = customerBankField ? customerBankField.get('value'):"";
		var prodTypeField = dj.byId("product_type");
		var prodTypeFieldValue = prodTypeField?prodTypeField.get('value'):"";
		misys._config.callCountForTheProductType++;
        //Changing the Bank Name drop down, the product types should get refreshed
		// And, while opening the existing records the values should be retained.
		if(prodTypeField && !onFormLoad && prodTypeFieldValue!=="" && misys._config.callCountForTheProductType > 2)
		{
			prodTypeField.set("value", "");
			prodTypeField.store = new dojo.data.ItemFileReadStore(
			{
				data :
				{
					identifier : "value",
					label : "name",
					items : {}
				}
			});
		}
		if(entityFieldValue && customerBankFieldValue && prodTypeField)
		{
			var productTypesDataStore = null;
			if(entityFieldValue === '*' && customerBankFieldValue ==="*")
			{
				productTypesDataStore = m._config.entityAndWildcardForBanksProdTypesCollection[entityFieldValue+'_'+customerBankFieldValue];
			}
			else if(entityFieldValue === '*' && customerBankFieldValue !=="*")
			{
				productTypesDataStore = m._config.wildcardForEntitiesAndBankProdTypesCollection[entityFieldValue+'_'+customerBankFieldValue];
			}
			else if(entityFieldValue !== '*' && customerBankFieldValue === "*")
			{
				productTypesDataStore = m._config.entityAndWildcardForBanksProdTypesCollection[entityFieldValue+'_'+customerBankFieldValue];
			}
			else
			{
				productTypesDataStore = m._config.entityBankProdTypesCollection[entityFieldValue+'_'+customerBankFieldValue];
			}
			if (productTypesDataStore && productTypesDataStore.length > 0)
			{
				prodTypeField.set("disabled", false);
				misys.animate("fadeOut", dojo.byId(noCustBankAvailableDiv));
				prodTypeField.set("required", true);
				prodTypeField.store = new dojo.data.ItemFileReadStore(
				{
					data :
					{
						identifier : "value",
						label : "name",
						items : productTypesDataStore
					}
				});
				prodTypeField.fetchProperties =
				{
					sort : [
					{
						attribute : "name"
					} ]
				};
			}
			else
			{
				if(entityFieldValue !== "" && customerBankFieldValue !=="")
				{
					// Show the message iff entityField and bankField has the value.
					prodTypeField.set("disabled", true);
					misys.animate("fadeIn", dojo.byId(noCustBankAvailableDiv));
					prodTypeField.set("required", false);
				}
				else
				{
					prodTypeField.set("value", "");
				}
				
				prodTypeField.store = new dojo.data.ItemFileReadStore(
				{
					data :
					{
						identifier : "value",
						label : "name",
						items : {}
					}
				});
			}
		}
		else if(prodTypeField)
		{
			prodTypeField.set("disabled", true);
			prodTypeField.set("required", false);
			if(entityFieldValue !== "" && customerBankFieldValue !== "")
			{
				misys.animate("fadeIn", dojo.byId(noCustBankAvailableDiv));
			}
		}
	}
	
	function _truncateBankNameForBeneficiry() {
		m.setSwiftBankDetailsForOnBlurEvent(false ,"bank_iso_code", "brch_code", null, null, "bank_", true,false,true, "");
	}
	
	function _getIFSCCode() {
		m.setIFSCCodeDetailsForOnBlurEvent("bank_ifsc_code", null, null, "bank_", true,false,true);
	}
	
	function _truncateBeneficiaryInstitutionDetails() {
		m.setSwiftBankDetailsForOnBlurEvent(false ,"iso_code", ["counterparty_name", "address_line_1", "address_line_2", "dom", "contact_name", "country"], 
                ["counterparty_name", "address_line_1", "country"],
                "", true, false, true, "");
       _enableDisableCounterpartyDetails();
	}
	
	function _validateDuplicateEmail()
	{
		var email_1Field	= dj.byId("email_1");
		var email_2Field	= dj.byId("email_2");
		var timeoutInMs     = 2000;
		var hideTT = function() {
			dj.hideTooltip(email_2Field.domNode);
		};
		if(email_2Field.get("value")==="" && email_1Field.get("value")==="")
         {
        	 console.debug("validating duplicate email");
         }
         else if(validateMultipleDuplicateEmail(email_1Field.get("value"), email_2Field.get("value")))
         {  
        	 	var displayMessage = m.getLocalization("duplicateEmail");
        	    email_2Field.set("value","");
        	    email_2Field.set("state","Error");
				dj.hideTooltip(email_2Field.domNode);
				dj.showTooltip(displayMessage, email_2Field.domNode, 0);
				setTimeout(hideTT, timeoutInMs);
		 }
     }
	
	function validateMultipleDuplicateEmail(email_1Field, email_2Field)
	{
		var tempArrayEmail1 = email_1Field.split(';');
		var tempArrayEmail2 = email_2Field.split(';');
				
		if(tempArrayEmail1.length>0 && tempArrayEmail2.length>0){
			for (var i = 0; i < tempArrayEmail1.length; i++) {
			    for (var j = 0; j < tempArrayEmail2.length; j++) {
			    	if (tempArrayEmail1[i] !== "" && tempArrayEmail2[j] !== "" && tempArrayEmail1[i].toUpperCase() === tempArrayEmail2[j].toUpperCase()) {
			         return true;
			        }
			    }
			}
             return false;
		}
		return false;
	}
	
	function _showExistingBeneficiaryMsg(response){
		console.debug("[Validate] Validating Beneficiary Name");
		var	field = dijit.byId("counterparty_name");
		var displayMessage = '';
		var timeoutInMs     = 5000;
		var hideTT = function() {
			dj.hideTooltip(field.domNode);
		};
		if(response.items.valid === true && (dijit.byId("counterparty_name").get("_lastValueReported") !== dijit.byId("counterparty_name").get("_resetValue")))
		{
			displayMessage = m.getLocalization("BeneficiaryNameExists", [field.get("value")]);
			field.set("value","");
			field.set("state", "Error");
			dijit.hideTooltip(field.domNode);
			dijit.showTooltip(displayMessage,field.domNode, 0);
			setTimeout(hideTT, timeoutInMs);
		}
		else
		{
			console.debug("message is false");
		}
	}

function _showExistingBeneficiaryIdMsg(){
		console.debug("[Validate] Validating Beneficiary Name");
		var	field = dijit.byId("beneficiary_id");
		var displayMessage = '';
		displayMessage = m.getLocalization("BeneficiaryIdExists");
		field.set("state", "Error");
		dijit.hideTooltip(field.domNode);
		dijit.showTooltip(displayMessage,field.domNode, 0);
	}

	function _clearBankFields()
	{
		m.toggleFieldsReadOnly(["bank_name","bank_address_line_1","bank_address_line_2","bank_dom","bank_code_country"], false,true);
	}
	function _clearInterBankFields()
	{
		m.toggleFieldsReadOnly(["intermediary_bank_meps_name","intermediary_bank_meps_address_line_1","intermediary_bank_meps_address_line_2",
			"intermediary_bank_meps_dom","intermediary_bank_meps_country"], false,true);
	}
	function _clearRTGSInterBankFields()
	{
		m.toggleFieldsReadOnly(["intermediary_bank_rtgs_name","intermediary_bank_rtgs_address_line_1","intermediary_bank_rtgs_address_line_2",
			"intermediary_bank_rtgs_dom","intermediary_bank_rtgs_country"], false,true);
	}
	
	function _onLoadBranchAddress()
	{
		if(dj.byId("branch_address"))
		{
			if(dj.byId("bank_iso_code").get("value").length === 0)
			{
				dj.byId("branch_address").set("checked", false);
				dj.byId("branch_address").set("readOnly", true);
			}
			else
			{
				dj.byId("branch_address").set("readOnly", false);
			}
			if(dj.byId("branch_address_line_1").get("value").length === 0)
			{
				dj.byId("branch_address").set("checked", false);
				dj.byId("branch_address").set("readOnly", false);
			}
			else
			{
				dj.byId("branch_address").set("checked", true);
			}
			if(dj.byId("branch_address").get("checked"))
			{
				m.toggleFieldsReadOnly(["branch_address_line_1","branch_address_line_2","branch_dom"], false);
				m.toggleRequired("branch_address_line_1", true);
			}
			else
			{
				m.toggleFieldsReadOnly(["branch_address_line_1","branch_address_line_2","branch_dom"], true, true);
				m.toggleRequired("branch_address_line_1", false);
			}
		}
	}
	
	
		
	function _toggleBranchAddress(/*boolean*/enable)
	{
		var productType = dj.byId("product_type");
		if (productType && (productType.get("value") === "MT101" || productType.get("value") === "MT103" || productType.get("value") === "RTGS" ||
						productType.get("value") === "FI103" || productType.get("value") === "FI202") || productType.get("value") === "MEPS" || productType.get("value") === "TRSRY" || productType.get("value") === "TRSRYFXFT")
		{
			var array = ["branch_address_line_1","branch_address_line_2","branch_dom"];
			if(enable)
			{
				m.toggleFieldsReadOnly(array, false);
				m.toggleRequired("branch_address_line_1", true);
			}
			else
			{
				m.toggleFieldsReadOnly(array, true, true);
				m.toggleRequired("branch_address_line_1", false);
			}
		}
	}

	function _validateBranchAddressRegex(field){
		

				var selectedProductType = dj.byId("product_type").value;
		if (selectedProductType === "MEPS") {
			var regexStr = "^[a-zA-Z0-9 \\,''().?\\/+-:]*$";
			var beneBranchAddRegExp = new RegExp(regexStr);

			var isValid = true;
			var addrLineStr = field ? field.get("value") : '';
			var errorMessage = null;

			if (addrLineStr !== '' && addrLineStr !== null) {
				isValid = beneBranchAddRegExp.test(addrLineStr);
				if (!isValid) {
					errorMessage = m.getLocalization("invalidCharBranchAddress");
					field.set("state", "Error");
					dj.hideTooltip(field.domNode);
					dj.showTooltip(errorMessage, field.domNode, 0);
				}
			}
			return isValid;
		}
		if (selectedProductType === "RTGS") {
			var rtgsregexStr = "^[a-zA-Z0-9 \\,''().\\/][a-zA-Z0-9 \\,''().\\/+-]*$";
			var rtgsbeneBranchAddRegExp = new RegExp(rtgsregexStr);
			var regexFor1stCharStr = dj.byId("addressStartCharsRegex") ? dj.byId("addressStartCharsRegex").get("value") : '';
		    var regexFor1stChar = new RegExp(regexFor1stCharStr);
		    var isValidAddrs = true;
		    var rtgsaddrLineStr = field ? field.get("value") : '';
			var rtgserrorMessage = null;
		   if(rtgsaddrLineStr !== '')
		   {	
			   if(regexFor1stChar.test(rtgsaddrLineStr))
			   {
				   rtgserrorMessage =  m.getLocalization("invalidFirstCharBeneficiaryAddressFieldRtgs");
				   field.set("state","Error");
				   dj.hideTooltip(field.domNode);
				   dj.showTooltip(rtgserrorMessage, field.domNode, 0);		
				  isValidAddrs =false; 		   
			   }
			   else 
			   {
					isValidAddrs = rtgsbeneBranchAddRegExp.test(rtgsaddrLineStr);
					if (!isValidAddrs) 
					{
						rtgserrorMessage = m.getLocalization("invalidCharBranchAddress");
						field.set("state", "Error");
						dj.hideTooltip(field.domNode);
						dj.showTooltip(rtgserrorMessage, field.domNode, 0);
					}
				}
		   return isValidAddrs;
		   }
		}
		
	}
	/**
	 * <h4>Summary:</h4>
	 * Shows all the product related fields and hides the rest.
	 */	
	function _toggleProductScreenFieldsForMultibank(isFormLoading) {
		var onFormLoad = isFormLoading?true:false;
		//  summary: 
		//  
		var selectedProductType = dj.byId("product_type").value;
		var desc = d.byId("description_div");
		var email2 = d.byId("email2_div");
		var beneCountryDiv = d.byId("bene_country_div");
		
		if (selectedProductType === "")
		{
			selectedProductType = "NONE";
		}
		enableSwiftValidationForBeneficiary();
		
		if(selectedProductType){
			//Iterate over all the screen fields
			d.forEach(m._config.screenFields,function(fieldName)
			{
				//Fetch screen field div object
				var fieldDivObj = d.byId(fieldName+"_div");
				//Fetch screen field object
				var fieldObj = dj.byId(fieldName);
					//if screen field present in the product type fields
					if(d.indexOf(m._config.productTypes[selectedProductType],fieldName) !== -1)
					{
						//Show Field
						if(fieldDivObj)
						{
							m.animate("fadeIn", fieldDivObj);
							if(d.indexOf(m._config.productTypes[selectedProductType].mandatory,fieldName) !== -1)
							{
								m.toggleRequired(fieldName, true);
							}
							else
							{
								m.toggleRequired(fieldName, false);
							}
							
							//Set Swift validation based on product type
							if(d.indexOf(m._config.productTypes[selectedProductType].swift,fieldName) !== -1)
							{
								_enableDisableSWIFTCharactersCheck(fieldObj,true);
							}
							else
							{
								_enableDisableSWIFTCharactersCheck(fieldObj,false);
							}
						}
					}
					else
					{
						//Hide Field
						if(!(fieldName === 'bank_iso_code' && dj.byId("product_type").get("value")=== 'MUPS'))
						{
							if(fieldDivObj)
							{
								m.animate("fadeOut", fieldDivObj);
							}
							m.toggleRequired(fieldName, false);
						}
					}
					if(fieldObj && m._config.clearScreenFields){
						if(/CheckBox/.test(fieldObj.declaredClass) && m._config.clearOnSecondCall && !onFormLoad) 
						{
							fieldObj.set("checked",false);
						}
						else if(fieldName !== "pre_approved" && m._config.clearOnSecondCall && !onFormLoad)
						{
							fieldObj.set("value","");	
							fieldObj.set("readOnly",false);
						}
					}
			});
			var counterparty_name_field = dj.byId("counterparty_name");
			if(counterparty_name_field && m._config.clearScreenFields && m._config.clearOnSecondCall && !onFormLoad)
			{
				counterparty_name_field.set("value","");
			}
			var pre_approved_field = dj.byId("pre_approved");
			if(pre_approved_field && !m._config.non_pab_allowed)
			{
				console.debug("Non-PAB accounts are not allowed. Hiding the PAB checkbox");
				pre_approved_field.set("checked",true);
				d.style(d.byId("pre_approved_div"), "display", "none");
			}
			else if(pre_approved_field && m._config.clearScreenFields && m._config.clearOnSecondCall && !onFormLoad)
			{
				pre_approved_field.set("checked",false);
			}
			var beneficiary_id_field = dj.byId("beneficiary_id");
			if(beneficiary_id_field && m._config.clearScreenFields && m._config.clearOnSecondCall && !onFormLoad)
			{
				beneficiary_id_field.set("value","");
			}
			var email_id_field_1 = dj.byId("email_1");
			if(email_id_field_1 && m._config.clearScreenFields && m._config.clearOnSecondCall && !onFormLoad)
			{
				email_id_field_1.set("value","");
			}
			var email_id_field_2 = dj.byId("email_2");
			if(email_id_field_2 && m._config.clearScreenFields && m._config.clearOnSecondCall && !onFormLoad)
			{
				email_id_field_2.set("value","");
			}
			if(selectedProductType !== 'TRSRY' && selectedProductType !== 'TRSRYFXFT'  )
			{
				_resetTreasuryFields();
			}
			_resizeFields(selectedProductType);
			m._config.clearScreenFields = true;
			m._config.clearOnSecondCall = true;
	
			if(selectedProductType === "NONE")
			{
				m.animate("fadeOut", beneficiaryDetailsDiv);
				m.animate("fadeOut", intermediaryBankDetailsDiv);
				m.animate("fadeOut", bankCountryCodeDiv);
			}
			else if(selectedProductType === "FI202")
			{
				m.animate("fadeIn",  beneficiaryDetailsDiv);
				m.animate("fadeIn",  deliveryModeDiv);
				m.animate("fadeIn",  beneficiaryMT202ActNoDiv);
				m.animate("fadeOut", beneficiaryActNoDiv);
				m.animate("fadeOut", bankCountryCodeDiv);
			}
			else if (selectedProductType === "DD")
			{
				m.animate("fadeIn",  beneficiaryDetailsDiv);
				m.animate("fadeIn",  deliveryModeDiv);
				m.animate("fadeOut", beneficiaryMT202ActNoDiv);
				m.animate("fadeOut", beneficiaryActNoDiv);
			
				m.animate("fadeOut", bankCountryCodeDiv);
			}
			else if(selectedProductType === "TTPT")
			{
				m.animate("fadeIn",  beneficiaryDetailsDiv);
				m.animate("fadeIn",  deliveryModeDiv);
				m.animate("fadeOut", additionalDiv);
				m.animate("fadeOut", beneficiaryMT202ActNoDiv);
				m.animate("fadeOut", desc);
				m.animate("fadeOut", email2);
				m.animate("fadeOut", bankCountryCodeDiv);
			}
			else if(selectedProductType === "RTGS"){
				m.animate("fadeIn",  beneficiaryActNoDiv);
				m.animate("fadeIn",  beneficiaryDetailsDiv);
				m.animate("fadeOut",  bankBicCodeDiv);
				m.animate("fadeIn",  bankBicCodeRtgsDiv);
				m.animate("fadeOut",  intermediaryBankDetailsDiv);
				m.animate("fadeOut", beneficiaryMT202ActNoDiv);
				m.animate("fadeIn",  intermediaryBankRtgsDetailsDiv);
				m.animate("fadeIn",  deliveryModeDiv);
				m.animate("fadeIn", bankCountryCodeDiv);
				m.animate("fadeOut", bankCountryDiv);
			}
			else if(selectedProductType === "TRSRY" || selectedProductType === "TRSRYFXFT" ){
				m.animate("fadeIn",  beneficiaryDetailsDiv);
				m.animate("fadeOut",  deliveryModeDiv);
				m.animate("fadeOut", beneficiaryMT202ActNoDiv);
				m.animate("fadeIn",  beneficiaryActNoDiv);
				m.animate("fadeOut", bankCountryCodeDiv);
			}
			
			else if(selectedProductType === "MEPS"){
				m.animate("fadeIn",  beneficiaryActNoDiv);
				m.animate("fadeIn",  beneficiaryDetailsDiv);
				m.animate("fadeOut",  bankBicCodeDiv);
				m.animate("fadeIn",  bankBicCodeMepsDiv);
				m.animate("fadeOut",  intermediaryBankDetailsDiv);
				m.animate("fadeOut", beneficiaryMT202ActNoDiv);
				m.animate("fadeIn",  intermediaryBankMepsDetailsDiv);
				m.animate("fadeIn",  deliveryModeDiv);
				m.animate("fadeOut", email2);
				m.animate("fadeIn", bankCountryCodeDiv);
				m.animate("fadeOut", bankCountryDiv);
			}
			else{
				m.animate("fadeIn",  beneficiaryDetailsDiv);
				m.animate("fadeIn",  deliveryModeDiv);
				m.animate("fadeOut", beneficiaryMT202ActNoDiv);
				m.animate("fadeIn",  beneficiaryActNoDiv);
				m.animate("fadeOut",  bankBicCodeRtgsDiv);
				m.animate("fadeOut",  bankBicCodeMepsDiv);
				m.animate("fadeOut", bankCountryCodeDiv);
				m.animate("fadeOut",  intermediaryBankMepsDetailsDiv);
				m.animate("fadeOut",  intermediaryBankRtgsDetailsDiv);
				
			}
			
			// Set the maxLength of Dom Treasury to 32, otherwise 35
			if(selectedProductType === "TRSRY")
			{
				if(dj.byId("dom"))
				{
					dj.byId("dom").set("maxLength", "32");
				}
				if(dj.byId("bank_address_line_2"))
				{
					dj.byId("bank_address_line_2").set("maxLength", "32");
				}
				if(dj.byId("bank_dom"))
				{
					dj.byId("bank_dom").set("maxLength", "32");
				}
			}
			else
			{   
				if(selectedProductType != "MEPS" && selectedProductType != "RTGS") {
				if(dj.byId("dom"))
				{
					dj.byId("dom").set("maxLength", "35");
				}
			}
				if(dj.byId("bank_address_line_2"))
				{
					dj.byId("bank_address_line_2").set("maxLength", "35");
				}
			}
			
			if(selectedProductType === "TRSRYFXFT"){
				if(dj.byId("bank_name"))
				{
					dj.byId("bank_name").set("maxLength", "34");
				}
				if(dj.byId("branch_name"))
				{
					dj.byId("branch_name").set("maxLength", "34");
				}
				if(dj.byId("bank_address_line_1"))
				{
					dj.byId("bank_address_line_1").set("maxLength", "34");
				}
				if(dj.byId("bank_dom"))
				{
					dj.byId("bank_dom").set("maxLength", "31");
				}
				if(dj.byId("inter_bank_name"))
				{
					dj.byId("inter_bank_name").set("maxLength", "34");
				}
				if(dj.byId("inter_bank_address_1"))
				{
					dj.byId("inter_bank_address_1").set("maxLength", "34");
				}
				if(dj.byId("inter_bank_address_2"))
				{
					dj.byId("inter_bank_address_2").set("maxLength", "34");
				}
				if(dj.byId("inter_bank_dom"))
				{
					dj.byId("inter_bank_dom").set("maxLength", "31");
				}
				if(dj.byId("ordering_customer_name"))
				{
					dj.byId("ordering_customer_name").set("maxLength", "34");
				}
				if(dj.byId("ordering_customer_address_1"))
				{
					dj.byId("ordering_customer_address_1").set("maxLength", "34");
				}
				if(dj.byId("ordering_customer_address_2"))
				{
					dj.byId("ordering_customer_address_2").set("maxLength", "34");
				}
				if(dj.byId("ordering_customer_dom"))
				{
					dj.byId("ordering_customer_dom").set("maxLength", "31");
				}
				
				
			}
			 
			m.toggleRequired("account_no_mt202", selectedProductType === "FI202");
			
			if ((selectedProductType === "TPT") || (selectedProductType === "DOM")|| (selectedProductType === "MEPS") || (selectedProductType === "RTGS") || (selectedProductType === "MT101")|| (selectedProductType === "MT103")||(selectedProductType === "FI103") || (selectedProductType === "TTPT") || (selectedProductType === "TRSRY") || (selectedProductType === "TRSRYFXFT"))
			{
				dj.byId("account_cur_code").set("readOnly",false);
				m.toggleRequired("account_cur_code", true);
			}
			else
			{
				 dj.byId("account_cur_code").set("readOnly",true);
				m.toggleRequired("account_cur_code", false);
			}

			if (selectedProductType === "MEPS")
			{
				m.animate("fadeIn",  intermediaryBankMepsDetailsDiv);
			}
			else
			{
				m.animate("fadeOut",  intermediaryBankMepsDetailsDiv);
			}

			if (selectedProductType === "RTGS")
			{
				m.animate("fadeIn",  intermediaryBankRtgsDetailsDiv);
			}
			else
			{
				m.animate("fadeOut",  intermediaryBankRtgsDetailsDiv);
			}
			if((selectedProductType === "MEPS")|| (selectedProductType === "RTGS"))
			{
				m.animate("fadeIn",  beneCountryDiv);
				m.toggleRequired("beneficiary_cntry_country", true);
			}
			else
			{
				m.animate("fadeOut",  beneCountryDiv);
				m.toggleRequired("beneficiary_cntry_country", false);
			}
		}
		
		if(m.client && m.client.toggleProductScreenFieldsClient)
		{
			m.client.toggleProductScreenFieldsClient();
		}
	}
	
	function _toggleProductScreenFields() {
		//  summary: 
		//  Shows all the product related fields and hides the rest
		var selectedProductType = dj.byId("product_type").value;
		var desc = d.byId("description_div");
		var email2 = d.byId("email2_div");
		var beneCountryDiv = d.byId("bene_country_div");
		
		if (selectedProductType === "")
		{
			selectedProductType = "NONE";
		}
		enableSwiftValidationForBeneficiary();
		
		if(selectedProductType){
			//Iterate over all the screen fields
			d.forEach(m._config.screenFields,function(fieldName)
			{
				//Fetch screen field div object
				var fieldDivObj = d.byId(fieldName+"_div");
				//Fetch screen field object
				var fieldObj = dj.byId(fieldName);
					//if screen field present in the product type fields
					if(d.indexOf(m._config.productTypes[selectedProductType],fieldName) !== -1)
					{
						//Show Field
						if(fieldDivObj)
						{
							m.animate("fadeIn", fieldDivObj);
							if(d.indexOf(m._config.productTypes[selectedProductType].mandatory,fieldName) !== -1)
							{
								m.toggleRequired(fieldName, true);
							}
							else
							{
								m.toggleRequired(fieldName, false);
							}
							
							//Set Swift validation based on product type
							if(d.indexOf(m._config.productTypes[selectedProductType].swift,fieldName) !== -1)
							{
								_enableDisableSWIFTCharactersCheck(fieldObj,true);
							}
							else
							{
								_enableDisableSWIFTCharactersCheck(fieldObj,false);
							}
						}
					}
					else
					{
						//Hide Field
						if(!(fieldName === 'bank_iso_code' && dj.byId("product_type").get("value")=== 'MUPS'))
						{
							if(fieldDivObj)
							{
								m.animate("fadeOut", fieldDivObj);
							}
							m.toggleRequired(fieldName, false);
						}
					}
					if(fieldObj && m._config.clearScreenFields){
						if(/CheckBox/.test(fieldObj.declaredClass) && m._config.clearOnSecondCall) 
						{
							fieldObj.set("checked",false);
						}
						else if(fieldName !== "pre_approved" && m._config.clearOnSecondCall)
						{
							fieldObj.set("value","");	
							fieldObj.set("readOnly",false);
						}
					}
			});
			var counterparty_name_field = dj.byId("counterparty_name");
			if(counterparty_name_field && m._config.clearScreenFields && m._config.clearOnSecondCall)
			{
				counterparty_name_field.set("value","");
			}
			var pre_approved_field = dj.byId("pre_approved");
			if(pre_approved_field && !m._config.non_pab_allowed)
			{
				console.debug("Non-PAB accounts are not allowed. Hiding the PAB checkbox");
				pre_approved_field.set("checked",true);
				d.style(d.byId("pre_approved_div"), "display", "none");
			}
			else if(pre_approved_field && m._config.clearScreenFields && m._config.clearOnSecondCall)
			{
				pre_approved_field.set("checked",false);
			}
			var beneficiary_id_field = dj.byId("beneficiary_id");
			if(beneficiary_id_field && m._config.clearScreenFields && m._config.clearOnSecondCall)
			{
				beneficiary_id_field.set("value","");
			}
			var email_id_field_1 = dj.byId("email_1");
			if(email_id_field_1 && m._config.clearScreenFields && m._config.clearOnSecondCall)
			{
				email_id_field_1.set("value","");
			}
			var email_id_field_2 = dj.byId("email_2");
			if(email_id_field_2 && m._config.clearScreenFields && m._config.clearOnSecondCall)
			{
				email_id_field_2.set("value","");
			}
			_resetThresholdFields();
			
			if(selectedProductType !== 'TRSRY' && selectedProductType !== 'TRSRYFXFT')
			{
				_resetTreasuryFields();
			}
			_resizeFields(selectedProductType);
			m._config.clearScreenFields = true;
			m._config.clearOnSecondCall = true;
	
			if(selectedProductType === "NONE")
			{
				m.animate("fadeOut", beneficiaryDetailsDiv);
				m.animate("fadeOut", intermediaryBankDetailsDiv);
				m.animate("fadeOut", bankCountryCodeDiv);
			}
			else if(selectedProductType === "FI202")
			{
				m.animate("fadeIn",  beneficiaryDetailsDiv);
				m.animate("fadeIn",  deliveryModeDiv);
				m.animate("fadeIn",  beneficiaryMT202ActNoDiv);
				m.animate("fadeOut", beneficiaryActNoDiv);
				m.animate("fadeOut", bankCountryCodeDiv);
			}
			else if (selectedProductType === "DD")
			{
				m.animate("fadeIn",  beneficiaryDetailsDiv);
				m.animate("fadeIn",  deliveryModeDiv);
				m.animate("fadeOut", beneficiaryMT202ActNoDiv);
				m.animate("fadeOut", beneficiaryActNoDiv);
				m.animate("fadeOut", bankCountryCodeDiv);
			}
			else if(selectedProductType === "TTPT")
			{
				m.animate("fadeIn",  beneficiaryDetailsDiv);
				m.animate("fadeIn",  deliveryModeDiv);
				m.animate("fadeOut", additionalDiv);
				m.animate("fadeOut", beneficiaryMT202ActNoDiv);
				m.animate("fadeOut", desc);
				m.animate("fadeOut", email2);
				m.animate("fadeOut", bankCountryCodeDiv);
			}
			else if(selectedProductType === "RTGS"){
				m.animate("fadeIn",  beneficiaryActNoDiv);
				m.animate("fadeIn",  beneficiaryDetailsDiv);
				m.animate("fadeOut",  bankBicCodeDiv);
				m.animate("fadeOut",  bankBicCodeMepsDiv);
				m.animate("fadeIn",  bankBicCodeRtgsDiv);
				m.animate("fadeOut", beneficiaryMT202ActNoDiv);
				m.animate("fadeOut",  intermediaryBankDetailsDiv);
				m.animate("fadeIn",  intermediaryBankRtgsDetailsDiv);
				m.animate("fadeIn",  deliveryModeDiv);
				m.animate("fadeIn", bankCountryCodeDiv);
				m.animate("fadeOut", bankCountryDiv);
			}
			else if((selectedProductType === "TRSRY") || (selectedProductType === "TRSRYFXFT") ){
				m.animate("fadeIn",  beneficiaryDetailsDiv);
				m.animate("fadeOut",  deliveryModeDiv);
				m.animate("fadeOut", beneficiaryMT202ActNoDiv);
				m.animate("fadeIn",  beneficiaryActNoDiv);
				m.animate("fadeOut", bankCountryCodeDiv);
			}
						
			else if(selectedProductType === "MEPS"){
				m.animate("fadeIn",  beneficiaryActNoDiv);
				m.animate("fadeIn",  beneficiaryDetailsDiv);
				m.animate("fadeOut",  bankBicCodeDiv);
				m.animate("fadeOut",  bankBicCodeRtgsDiv);
				m.animate("fadeIn",  bankBicCodeMepsDiv);
				m.animate("fadeOut", beneficiaryMT202ActNoDiv);
				m.animate("fadeOut",  intermediaryBankDetailsDiv);
				m.animate("fadeIn",  intermediaryBankMepsDetailsDiv);
				m.animate("fadeIn",  deliveryModeDiv);
				m.animate("fadeIn", email2);
				m.animate("fadeIn", bankCountryCodeDiv);
				m.animate("fadeOut", bankCountryDiv);
			}
			else{
				m.animate("fadeIn",  beneficiaryDetailsDiv);
				m.animate("fadeIn",  deliveryModeDiv);
				m.animate("fadeOut", beneficiaryMT202ActNoDiv);
				m.animate("fadeIn",  beneficiaryActNoDiv);
				m.animate("fadeOut",  bankBicCodeRtgsDiv);
				m.animate("fadeOut",  bankBicCodeMepsDiv);
				m.animate("fadeOut", bankCountryCodeDiv);
			}
			
			// Set the maxLength of Dom Treasury to 32, otherwise 35
			if(selectedProductType === "TRSRY" )
			{
				if(dj.byId("dom"))
				{
					dj.byId("dom").set("maxLength", "32");
				}
				if(dj.byId("bank_address_line_2"))
				{
					dj.byId("bank_address_line_2").set("maxLength", "32");
				}
				if(dj.byId("bank_dom"))
				{
					dj.byId("bank_dom").set("maxLength", "32");
				}
			}
			else if(selectedProductType === "TRSRYFXFT" ){
				if(dj.byId("dom"))
				{
					dj.byId("dom").set("maxLength", "31");
				}
					
			}
			
			
			else if(selectedProductType != "MEPS" && selectedProductType != "RTGS")
			{
				if(dj.byId("dom"))
				{
					dj.byId("dom").set("maxLength", "35");
				}
				if(dj.byId("bank_address_line_2"))
				{
					dj.byId("bank_address_line_2").set("maxLength", "35");
				}
			}
			if((selectedProductType === "MUPS") ||(selectedProductType === "HVPS") || (selectedProductType === "HVXB"))
			{
				m.animate("fadeIn",dojo.byId("mailing_address_div"));
				m.animate("fadeOut", dojo.byId("account_amt_img"));
				if(selectedProductType !== "MUPS"){
					m.animate("fadeIn",dojo.byId("cnaps_bank_name_div"));
					}
				else{
					m.animate("fadeOut",dojo.byId("cnaps_bank_name_div"));
				}
			}
			else
			{
				m.animate("fadeOut",dojo.byId("mailing_address_div"));
				m.animate("fadeIn", dojo.byId("account_amt_img"));
				m.animate("fadeOut",dojo.byId("cnaps_bank_name_div"));
			}
			if(selectedProductType === "MEPS")
			{
				m.animate("fadeOut", dojo.byId("account_amt_img"));
			} 
			
			m.toggleRequired("account_no_mt202", selectedProductType === "FI202");
			
			if ((selectedProductType === "TPT") || (selectedProductType === "DOM")|| (selectedProductType === "MT101") || (selectedProductType === "RTGS") || (selectedProductType === "MT103")||(selectedProductType === "FI103") || (selectedProductType === "TTPT") || (selectedProductType === "TRSRY"))
			{
				dj.byId("account_cur_code").set("readOnly",false);
				m.toggleRequired("account_cur_code", true);
			}
			else
			{
				 dj.byId("account_cur_code").set("readOnly",true);
				m.toggleRequired("account_cur_code", false);
			}
			
			if ((selectedProductType === "MT101")|| (selectedProductType === "MT103")||(selectedProductType === "FI103")||(selectedProductType === "FI202"))
			{
				m.animate("fadeIn",  intermediaryBankDetailsDiv);
			}
			else
			{
				m.animate("fadeOut",  intermediaryBankDetailsDiv);
			}

			if (selectedProductType === "MEPS")
			{
				m.animate("fadeIn",  intermediaryBankMepsDetailsDiv);
			}
			else
			{
				m.animate("fadeOut",  intermediaryBankMepsDetailsDiv);
			}

			if (selectedProductType === "RTGS")
			{
				m.animate("fadeIn",  intermediaryBankRtgsDetailsDiv);
			}
			else
			{
				m.animate("fadeOut",  intermediaryBankRtgsDetailsDiv);
			}			
			
			if((selectedProductType === "MEPS")|| (selectedProductType === "RTGS"))
			{
				m.animate("fadeIn",  beneCountryDiv);
				m.toggleRequired("beneficiary_cntry_country", true);
				m.disableFields(["bank_name","bank_address_line_1","bank_address_line_2"],true);
				m.disableFields(["bank_dom","bank_code_country","bank_code_country_btn_img","intermediary_bank_meps_country_btn_img"],true);
			}
			else
			{
				m.animate("fadeOut",  beneCountryDiv);
				m.toggleRequired("beneficiary_cntry_country", false);			
			}
			if (selectedProductType === "MT103" || selectedProductType === "MT101" || selectedProductType === "FI103" )  
			{
				_toggleBranchAddress(dj.byId("branch_address").get("checked"));
				m.animate("fadeIn",  bankBicCodeDiv);
				m.animate("fadeOut",  bankBicCodeMepsDiv);
				m.animate("fadeOut",  bankBicCodeRtgsDiv);
			}
			if ( selectedProductType === "RTGS" || selectedProductType === "MEPS")  
			{
				_toggleBranchAddress(dj.byId("branch_address").get("checked"));
				
			}
		}
		
		if(m.client && m.client.toggleProductScreenFieldsClient)
		{
			m.client.toggleProductScreenFieldsClient();
		}
	}
	
	function _resizeFields(productType)
	{
		//  summary: 
		//  Resize the fields base on product type
		var beneficiaryNameField 		= dj.byId("counterparty_name"),
			beneficiaryAccountField 	= dj.byId("account_no"),
			beneficiaryCurrency			= dj.byId("account_cur_code"),
			searchField					= dj.byId("account_amt_img"),
			bankNameField				= dj.byId("bank_name"),
			branchNameField				= dj.byId("branch_name"),
			beneficiaryAddress1			= dj.byId("address_line_1"),
			beneficiaryAddress3			= dj.byId("dom"),
			beneficiaryAddress2			= dj.byId("address_line_2"),
			beneficaryNameLabel			= dj.byId("beneficiary_name_label").get("value"),
			bankNameLabel				= dj.byId("bank_name_label").get("value"),
			beneficaryInstitutionLabel	= dj.byId("beneficiary_instituion_label").get("value"),
			bankInstitutionLabel		= dj.byId("bank_instituion_label").get("value"),
			bankNameLabelWithOutAddress	= dj.byId("bank_name_label_with_out_address").get("value"),
			beneficaryNameLabelWithOutAddress	= dj.byId("beneficiary_name_label_with_out_address").get("value");
		
		// For Swift changes
		var	beneName				= dj.byId("counterparty_name"),
			beneAdd1				= dj.byId("address_line_1"),
			beneAdd2				= dj.byId("address_line_2"),
			beneCity				= dj.byId("dom"),
			bankAddressLine1Field   = dj.byId("bank_address_line_1"),
			bankDomField            = dj.byId("bank_dom"),
			orderingCustomerName	= dj.byId("ordering_customer_name"),
			orderingCustomerAdd1	= dj.byId("ordering_customer_address_1"),
			orderingCustomerAdd2	= dj.byId("ordering_customer_address_2"),
			orderingCustomerDom		= dj.byId("ordering_customer_dom"),
			interBankName			= dj.byId("inter_bank_name"),
			interBankAdd1			= dj.byId("inter_bank_address_1"),
			interBankAdd2			= dj.byId("inter_bank_address_2"),
			interBankDom			= dj.byId("inter_bank_dom");

		switch(productType)
		{
			case "TPT":
				beneficiaryAccountField.set("maxLength","34");
				beneficiaryNameField.set("maxLength","35");
				bankNameField.set("readOnly",false);
				branchNameField.set("readOnly",false);
				//Disconnect IBAN validation
				m.disconnect(m._config.accountNoIBANValidationHandle);
				//Rename Account Institution to Beneficiary Account Field
				dojo.query(label_CptyName)[0].innerHTML = htmlSpan_RequiredTag+beneficaryNameLabelWithOutAddress;
				dojo.query(label_BankName)[0].innerHTML = htmlSpan_RequiredTag+bankNameLabel;
				break;
				
			case "MUPS":
				beneficiaryNameField.set("maxLength","35");
				beneficiaryAccountField.set("maxLength","34");
				beneficiaryCurrency.set("value", "INR");
				searchField.set("disabled", true);
				dj.byId("threshold_amt_img").set("disabled",true);
				dj.byId("bank_ifsc_name").set("readOnly", true);
				dj.byId("bank_ifsc_address_line_1").set("readOnly", true);
				dj.byId("bank_ifsc_address_line_2").set("readOnly", true);
				dj.byId("bank_ifsc_city").set("readOnly", true);
				dj.byId("threshold_cur_code").set("value", "INR");
				dj.byId("threshold_cur_code").set("readOnly", true);
				//Rename Account Institution to Beneficiary Account Field
				dojo.query(label_CptyName)[0].innerHTML = htmlSpan_RequiredTag+beneficaryNameLabelWithOutAddress;
				dojo.query(label_BankName)[0].innerHTML = htmlSpan_RequiredTag+bankNameLabel;
				break;

			case "DOM":
				beneficiaryAccountField.set("maxLength","34");
				bankNameField.set("readOnly",true);
				branchNameField.set("readOnly",true);
				//Disconnect IBAN validation
				m.disconnect(m._config.accountNoIBANValidationHandle);
				//Rename Account Institution to Beneficiary Account Field
				dojo.query(label_CptyName)[0].innerHTML = htmlSpan_RequiredTag+beneficaryNameLabelWithOutAddress;
				dojo.query(label_BankName)[0].innerHTML = htmlSpan_RequiredTag+bankNameLabelWithOutAddress;
				break;
			case "FI202":
				beneficiaryAccountField.set("maxLength","34");
				bankNameField.set("readOnly",false);
				branchNameField.set("readOnly",false);
				//Disconnect IBAN validation
				m.disconnect(m._config.accountNoIBANValidationHandle);
				//Rename BeneFiciary Account Field to Account Institution
				dojo.query(label_CptyName)[0].innerHTML = htmlSpan_RequiredTag+beneficaryInstitutionLabel;
				dojo.query(label_BankName)[0].innerHTML = htmlSpan_RequiredTag+bankInstitutionLabel;
				break;
			case "MT101":
				beneficiaryAccountField.set("maxLength","34");
				bankNameField.set("readOnly",false);
				branchNameField.set("readOnly",false);
				//Connect IBAN validation
				m._config.accountNoIBANValidationHandle = m.connect("account_no", "onBlur", _validateIBANCode);
				//Rename Account Institution to Beneficiary Account Field
				dojo.query(label_CptyName)[0].innerHTML = htmlSpan_RequiredTag+beneficaryNameLabel;
				dojo.query(label_BankName)[0].innerHTML = htmlSpan_RequiredTag+bankNameLabel;
				break;
			case "MT103":
				beneficiaryNameField.set("maxLength","35");
				dojo.query(label_CptyName)[0].innerHTML = htmlSpan_RequiredTag+beneficaryNameLabel;
				dojo.query(label_BankName)[0].innerHTML = htmlSpan_RequiredTag+bankNameLabel;
				break;
			case "FI103":
				dojo.query(label_CptyName)[0].innerHTML = htmlSpan_RequiredTag+beneficaryNameLabel;
				dojo.query(label_BankName)[0].innerHTML = htmlSpan_RequiredTag+bankNameLabel;
				break;
			case "TRSRY":
				beneficiaryNameField.set("maxLength","50");
				beneficiaryAccountField.set("maxLength","33");
				bankNameField.set("readOnly",false);
				branchNameField.set("readOnly",false);
				m.disconnect(m._config.accountNoIBANValidationHandle);
				//Rename Account Institution to Beneficiary Account Field
				dojo.query(label_CptyName)[0].innerHTML = htmlSpan_RequiredTag+beneficaryNameLabelWithOutAddress;
				dojo.query(label_BankName)[0].innerHTML = htmlSpan_RequiredTag+bankNameLabelWithOutAddress;
				break;
			case "TRSRYFXFT":
				beneName.set("maxLength","34");
				beneAdd1.set("maxLength","34");
				beneAdd2.set("maxLength","34");
				beneCity.set("maxLength","31");
				bankNameField.set("maxLength","34");
				branchNameField.set("maxLength","34");
				bankAddressLine1Field.set("maxLength","34");
				bankDomField.set("maxLength","31");
				orderingCustomerName.set("maxLength","34");
				orderingCustomerAdd1.set("maxLength","34");
				orderingCustomerAdd2.set("maxLength","34");
				orderingCustomerDom.set("maxLength","31");
				interBankName.set("maxLength","34");
				interBankAdd1.set("maxLength","34");
				interBankAdd2.set("maxLength","34");
				interBankDom.set("maxLength","31");
				m.disconnect(m._config.accountNoIBANValidationHandle);
				//Rename Account Institution to Beneficiary Account Field
				dojo.query(label_CptyName)[0].innerHTML = htmlSpan_RequiredTag+beneficaryNameLabelWithOutAddress;
				dojo.query(label_BankName)[0].innerHTML = htmlSpan_RequiredTag+bankNameLabelWithOutAddress;
				break;	
			case "HVPS":
			case "HVXB":
				beneficiaryCurrency.set("value", "CNY");
				searchField.set("disabled", true);
				dj.byId("threshold_amt_img").set("disabled",true);
				dj.byId("threshold_cur_code").set("value", "CNY");
				dj.byId("threshold_cur_code").set("readOnly", true);
				dj.byId("cnaps_bank_name").set("readOnly", true);
				m.disconnect(m._config.accountNoIBANValidationHandle);
				m.connect("cnaps_bank_code", "onBlur", _validateCNAPSBankCode);
				//m.connect("cnaps_crossborder_bank_code", "onBlur", _validateCNAPSBankCode);
				m.connect("cnaps_bank_code_img", "onClick", _cnapBankCodeButtonHandler);
				//Rename Account Institution to Beneficiary Account Field
				dojo.query(label_CptyName)[0].innerHTML = htmlSpan_RequiredTag+beneficaryNameLabelWithOutAddress;
				dojo.query(label_BankName)[0].innerHTML = htmlSpan_RequiredTag+bankNameLabelWithOutAddress;
				
				break;
			case "MEPS":
				beneficiaryNameField.set("maxLength","33");
				beneficiaryAccountField.set("maxLength","34");
				beneficiaryAddress1.set("maxLength","33");
				beneficiaryAddress2.set("maxLength","33");
				beneficiaryAddress3.set("maxLength","30");
				beneficiaryCurrency.set("value", "SGD");
				searchField.set("disabled", true);
				dj.byId("threshold_amt_img").set("disabled",true);
				dj.byId("threshold_cur_code").set("value", "SGD");
				dj.byId("threshold_cur_code").set("readOnly", true);
				dojo.query(label_CptyName)[0].innerHTML = htmlSpan_RequiredTag+beneficaryNameLabel;
				dojo.query(label_BankName)[0].innerHTML = htmlSpan_RequiredTag+bankNameLabel;
				break;
			case "RTGS":
				beneficiaryNameField.set("maxLength","33");
				beneficiaryAccountField.set("maxLength","34");
				beneficiaryAddress1.set("maxLength","33");
				beneficiaryAddress2.set("maxLength","33");
				beneficiaryAddress3.set("maxLength","30");
				dojo.query(label_CptyName)[0].innerHTML = htmlSpan_RequiredTag+beneficaryNameLabel;
				dojo.query(label_BankName)[0].innerHTML = htmlSpan_RequiredTag+bankNameLabel;
				searchField.set("disabled", false);
				break;				
			default:
				beneficiaryAccountField.set("maxLength","34");
				bankNameField.set("readOnly",false);
				branchNameField.set("readOnly",false);
				m.disconnect(m._config.accountNoIBANValidationHandle);
				//Rename Account Institution to Beneficiary Account Field
				dojo.query(label_CptyName)[0].innerHTML = htmlSpan_RequiredTag+beneficaryNameLabelWithOutAddress;
				dojo.query(label_BankName)[0].innerHTML = htmlSpan_RequiredTag+bankNameLabel;
				break;
		}
		
		if(m.client && m.client.resizeFieldsClient)
		{
			m.client.resizeFieldsClient(productType);
		}
	}
	function _toggleThresholdAmount(pabStatus)
	{
		//  summary: 
		// Clear the amount fields if PAB is unchecked
		var preApprovedField = dj.byId("pre_approved");
		if(preApprovedField && (preApprovedField.get("value") === "Y" || preApprovedField.get("value") === "on"))
		{
			pabStatus = true;
		}
		else
		{
			pabStatus = false;
		}
		var threshold_div= d.byId("threshold_cur_code_row");
		var option = dj.byId("option").get("value");
		var reauthFlag = dj.byId("reauth_popup_non_pab_flag").get("value");
		if(!pabStatus)
		{
			_resetThresholdFields();
			//Hide Threshold 
			m.animate("fadeOut", threshold_div);
			if(option === "BENEFICIARY_MASTER_MAINTENANCE_MC"){
				d.forEach(d.query("[widgetid='draftButton']"),function(node,index){
					d.style(node,"display","none");
				});
			}
		}
		else
		{
			//Show Threshold 
			m.animate("fadeIn", threshold_div);
			if(dj.byId('product_type').get('value')==="MUPS" || (dj.byId('product_type').get('value')==="HVPS")	||(dj.byId('product_type').get('value')==="HVXB")|| dj.byId('product_type').get('value')==="MEPS")
			{
				misys.animate("fadeOut", dojo.byId("threshold_amt_img"));
				misys.animate("fadeOut", dojo.byId("account_amt_img"));
				
			}
			else
			{
				misys.animate("fadeIn", dojo.byId("threshold_amt_img"));
				misys.animate("fadeIn", dojo.byId("account_amt_img"));
			}
			if(option === "BENEFICIARY_MASTER_MAINTENANCE_MC"){
				d.forEach(d.query("[widgetid='draftButton']"),function(node,index){
					d.style(node,"display","inline");
				});
			}
		}
	
		//Related to ReAuthentication
		// Re Authenticate only in case of PAB
		if(!pabStatus && reauthFlag === "false")
		{
			if(dj.byId("reauth_perform"))
			{
				dj.byId("reauth_perform").set("value","N");
			}
			
		}
		else
		{
			if(dj.byId("reauth_perform"))
			{
				dj.byId("reauth_perform").set("value","Y");
			}
		}
	}
	
	function _resetThresholdFields()
	{
		//  summary: 
		//  Clear the threshold amount and threshold currency fields
		var threshold_amt_field = dj.byId("threshold_amt");
		if(dj.byId('product_type').get('value')==="MUPS")
		{
			threshold_amt_field.set("required", false);
		}
		if(threshold_amt_field && m._config.clearScreenFields && m._config.clearOnSecondCall)
		{
			threshold_amt_field.set("value","");
			threshold_amt_field.set("required", false);
		}
		var threshold_cur_code_field = dj.byId("threshold_cur_code");
		if(dj.byId('product_type').get('value')!="MUPS" && dj.byId('product_type').get('value')!="MEPS" && dj.byId('product_type').get('value')!="HVPS" && dj.byId('product_type').get('value')!="HVXB")
		{
			if(threshold_cur_code_field && m._config.clearScreenFields && m._config.clearOnSecondCall)
			{
				threshold_cur_code_field.set("value","");	
				threshold_cur_code_field.set("required", false);
			}
		}
	}
	
	function _resetTreasuryFields()
	{
		for (var i = 0; i < treasurySpecificFields.length; i++) { 
			if(dj.byId(treasurySpecificFields[i]))
			{
				dj.byId(treasurySpecificFields[i]).set('value', '');
			}
		}		
	}
	
	function _resetEntityScreenFields()
	{
		//  summary: 
		//  Clear all the screen fields 
		//	Disable if entity field is empty 
		//	Enable if entity field is selected
		var productTypeField 	= dj.byId("product_type"),
			emailField_1		= dj.byId("email_1"),
			emailField_2		= dj.byId("email_2");
		
		if(productTypeField.get("value") === "")
		{
			productTypeField.set("value", "NONE");
		}
		
		productTypeField.set("value", "NONE");
		emailField_1.set("value","");
		emailField_2.set("value","");
		
		//Disable product type field if entity is not selected
		if(dj.byId("entity").get("value") === "")
		{
			productTypeField.set("disabled",true);
		}
		else
		{
			productTypeField.set("disabled",false);
		}
    }
	
	function _validateRegexBeneficiaryId()
	{										 
		   var regex = dj.byId("regexValue");
		   var regexMUPS = dj.byId("beneficiary_accname_regex_mups");
		   var regexMEPS = dj.byId("beneficiary_accname_regex_meps");
		   var regexRTGS = dj.byId("beneficiary_accname_regex_rtgs");
		   var products = dj.byId("allowedProducts");
		   var regexStr = regex ? dj.byId("regexValue").get("value") : '';
		   var regexMUPSStr = regexMUPS ? dj.byId("beneficiary_accname_regex_mups").get("value") : '';
		   var regexMEPSStr = regexMEPS ? dj.byId("beneficiary_accname_regex_meps").get("value") : '';
		   var regexRTGSStr = regexRTGS ? dj.byId("beneficiary_accname_regex_rtgs").get("value") : '';

		   var productsStr = products ? dj.byId("allowedProducts").get("value") : '';
		   var productTypeId = dj.byId("product_type");
		   var productTypeStr =productTypeId ? dj.byId("product_type").get("value") : '';
		   		   
		   var beneficiaryId = dj.byId("beneficiary_id");
		   var beneficiaryStr = beneficiaryId? dj.byId("beneficiary_id").get("value") : ''; 
		   		 	   		  			   
		   var beneficiaryRegExp = new RegExp(regexStr);
		   var beneficiaryMUPSRegExp = new RegExp(regexMUPSStr);
		   var beneficiaryMEPSRegExp = new RegExp(regexMEPSStr);
		   var beneficiaryRTGSRegExp = new RegExp(regexRTGSStr);
		   
		   var isValid = false;
		   var errorMessage=null;
		   		  		   		 		   
		   if (   productTypeId  &&   (    productsStr.indexOf(productTypeStr) < 0   )  && productTypeStr !== 'MUPS' && productTypeStr !== 'MEPS' && productTypeStr !== 'RTGS')
		   {
			   
			   if(regexStr !== null && regexStr !== '' && beneficiaryStr !== '' && beneficiaryStr !== null)
			   {			   			   
				   isValid = beneficiaryRegExp.test(beneficiaryStr);				   
				   if(!isValid)
				   {
	    			   errorMessage =  m.getLocalization("invalidBeneficiaryId");
					   beneficiaryId.set("state","Error");
					   dj.hideTooltip(beneficiaryId.domNode);
					   dj.showTooltip(errorMessage, beneficiaryId.domNode, 0);
				   }				   
			   }
		    }
		   else if( productTypeStr !== '' && productTypeStr === 'MUPS' )
		   {
			   if(regexMUPS !== null && regexMUPS !== '' && beneficiaryStr !== '' && beneficiaryStr !== null)
			   {			   			   
				   isValid = beneficiaryMUPSRegExp.test(beneficiaryStr);				   
				   if(!isValid)
				   {
	    			   errorMessage =  m.getLocalization("invalidBeneficiaryId");
					   beneficiaryId.set("state","Error");
					   dj.hideTooltip(beneficiaryId.domNode);
					   dj.showTooltip(errorMessage, beneficiaryId.domNode, 0);
				   }				   
			   }
		   }
		   else if( productTypeStr !== '' && productTypeStr === 'MEPS' )
		   {
			   if(regexMEPS !== null && regexMEPS !== '' && beneficiaryStr !== '' && beneficiaryStr !== null)
			   {			   			   
				   isValid = beneficiaryMEPSRegExp.test(beneficiaryStr);				   
				   if(!isValid)
				   {
	    			   errorMessage =  m.getLocalization("invalidBeneficiaryId");
					   beneficiaryId.set("state","Error");
					   dj.hideTooltip(beneficiaryId.domNode);
					   dj.showTooltip(errorMessage, beneficiaryId.domNode, 0);
				   }				   
			   }
		   }
		   else if( productTypeStr !== '' && productTypeStr === 'RTGS' )
		   {
			   if(regexRTGS !== null && regexRTGS !== '' && beneficiaryStr !== '' && beneficiaryStr !== null)
			   {			   			   
				   isValid = beneficiaryRTGSRegExp.test(beneficiaryStr);				   
				   if(!isValid)
				   {
	    			   errorMessage =  m.getLocalization("invalidBeneficiaryId");
					   beneficiaryId.set("state","Error");
					   dj.hideTooltip(beneficiaryId.domNode);
					   dj.showTooltip(errorMessage, beneficiaryId.domNode, 0);
				   }				   
			   }
		   }		   
		   else
		   {   
			  isValid = true; 
			  m._config.forceSWIFTValidation = false;   			   			   
		   }
		   
		   var companyid = null;
		   	if(dijit.byId('company'))
		   	{
			   companyid = dijit.byId('company').get("_lastValueReported");
		   	}
		   	
		   var benId = beneficiaryId ? beneficiaryId.get('value') : '';
		   if(benId !== '') {
				
				m.xhrPost( {
					url : m.getServletURL("/screen/AjaxScreen/action/CheckBeneficiaryIdAction"),
					handleAs 	: "json",
					sync 		: true,
					content : {
						beneficiaryId : benId,
						comapany_name : companyid
					},
					load : function(response, args){
						if (response.items.valid === false){
							if(!(dijit.byId("beneficiary_id").get("_lastValueReported") === dijit.byId("beneficiary_id").get("_resetValue")))
							{
							_showExistingBeneficiaryIdMsg();
								isValid = false;
							}
							
						}
						
					},
					error	: function(response, args){
						console.error("[Could not validate Beneficiary ID] "+ benId);
						console.error(response);
					}
				});
			}
		   
		return isValid;
	}
	
	function _validateRegexBeneficiary()
	{										 
		   		  
		   var regex = dj.byId("regexValue");
		   var products = dj.byId("allowedProducts");
		   var regexStr = regex ? dj.byId("regexValue").get("value") : '';
		   var productsStr = products ? dj.byId("allowedProducts").get("value") : '';
		   var productTypeId = dj.byId("product_type");
		   var productTypeStr =productTypeId ? dj.byId("product_type").get("value") : '';
		   
		   var regexMEPS = dj.byId("beneficiary_accname_regex_meps");
		   var regexMEPSStr = regexMEPS ? dj.byId("beneficiary_accname_regex_meps").get("value") : '';
		   		   
		   var beneficiaryId = dj.byId("counterparty_name");
		   var beneficiaryStr = beneficiaryId? dj.byId("counterparty_name").get("value") : ''; 
		   
		   var errorKey = "invalidBeneficiaryName";
		   if(productTypeStr == 'RTGS')
		   {
			   regex = dj.byId("beneficiary_accname_regex_rtgs");  
			   regexStr = regex ? dj.byId("beneficiary_accname_regex_rtgs").get("value") : '';
			   errorKey = "invalidBeneficiaryNameRTGS";
		   }
		   var beneficiaryRegExp = new RegExp(regexStr);
		   var beneficiaryMEPSRegExp = new RegExp(regexMEPSStr);
		   var length = beneficiaryStr.length;
		   
		   var isValid = false;
		   var errorMessage=null;
		   if(dj.byId("product_type").get("value") == 'MUPS')
		   {
		   	  if(beneficiaryId.get("value") !== ""){
			   if(length<12)
			   {
				   errorMessage =  m.getLocalization("invalidLengthForBeneficiaryNameMUPS");
				   beneficiaryId.set("value","");
				   beneficiaryId.set("state","Error");
				   dj.hideTooltip(beneficiaryId.domNode);
				   dj.showTooltip(errorMessage, beneficiaryId.domNode, 0);
			   }
			   else if(!_validateBeneficiary(beneficiaryId))
			   {
	
				   errorMessage =  m.getLocalization("invalidBeneficiaryNameforMUPS");
				   beneficiaryId.set("value","");
				   beneficiaryId.set("state","Error");
				   dj.hideTooltip(beneficiaryId.domNode);
				   dj.showTooltip(errorMessage, beneficiaryId.domNode, 0);
			   }
		   }		   		  		   		 		
		   }   
		   if (   productTypeId  &&   (    productsStr.indexOf(productTypeStr) < 0   )  && productTypeStr !== 'MUPS')
		   {
			   
			   if(regexStr && beneficiaryStr)
			   {	
				   if(productTypeStr === 'MEPS') {
					   isValid = beneficiaryMEPSRegExp.test(beneficiaryStr);
				   }else {
					   isValid = beneficiaryRegExp.test(beneficiaryStr);
				   }
				   
				   if(!isValid && productTypeStr !== 'MEPS')
				   {
					   errorMessage =  m.getLocalization(errorKey);
					   beneficiaryId.focus();
					   beneficiaryId.set("state","Error");
					   dj.hideTooltip(beneficiaryId.domNode);
					   dj.showTooltip(errorMessage, beneficiaryId.domNode, 0);
				   }
				   else if(!isValid && productTypeStr === 'MEPS'){
					   errorMessage =  m.getLocalization("invalidBeneficiaryNameforMeps");
					   beneficiaryId.focus();
					   beneficiaryId.set("state","Error");
					   dj.hideTooltip(beneficiaryId.domNode);
					   dj.showTooltip(errorMessage, beneficiaryId.domNode, 0);
				   
				   }
			   }
			   			   
			   if(productTypeStr === 'MT101' || productTypeStr === 'MT103'  || productTypeStr === 'FI103' || productTypeStr === 'FI202' || productTypeStr === 'DD')
			   {
				   
				   
				   var beneficiaryId2 = dj.byId("counterparty_name_2");
				   var beneficiaryStr2 = beneficiaryId? dj.byId("counterparty_name_2").get("value") : '';
				   
				   if(regexStr !== null && regexStr !== '' && beneficiaryStr2 !== '' && beneficiaryStr2 !== null)
				   {			   			   
					   isValid = beneficiaryRegExp.test(beneficiaryStr2);				   
					   if(!isValid)
					   {
						   errorMessage = m.getLocalization("invalidBeneficiaryName"); 
						   beneficiaryId2.set("state","Error");
						   dj.hideTooltip(beneficiaryId2.domNode);
						   dj.showTooltip(errorMessage, beneficiaryId2.domNode, 0);
					   }				   
				   }
				   
				   var beneficiaryId3 = dj.byId("counterparty_name_3");
				   var beneficiaryStr3 = beneficiaryId? dj.byId("counterparty_name_3").get("value") : '';
				   
				   if(regexStr !== null && regexStr !== '' && beneficiaryStr3 !== '' && beneficiaryStr3 !== null)
				   {			   			   
					   isValid = beneficiaryRegExp.test(beneficiaryStr3);				   
					   if(!isValid)
					   {
						   errorMessage =  m.getLocalization("invalidBeneficiaryName");
						   beneficiaryId3.set("state","Error");
						   dj.hideTooltip(beneficiaryId3.domNode);
						   dj.showTooltip(errorMessage, beneficiaryId3.domNode, 0);
					   }				   
				   }
				   				   				   
			   }
			   
		    }
		   else
		   {   
			  m._config.forceSWIFTValidation = false;   			   			   
		   }
		   
		   var companyid = null;
		   	if(dijit.byId('company'))
		   	{
			   companyid = dijit.byId('company').get("_lastValueReported");
		   	}
		   	
		   var newuserName = beneficiaryId ? beneficiaryId.get('value') : '';
			   var duplicateBeneficiaryValidation = dj.byId("DUPLICATE_BENEFICIARY_NAME_VALIDATION_FLAG");
			   if(newuserName != ''  && duplicateBeneficiaryValidation && duplicateBeneficiaryValidation.get('value') === "true") {
					
					m.xhrPost( {
						url : m.getServletURL("/screen/AjaxScreen/action/CheckBeneficiaryNameAction"),
						handleAs 	: "json",
						sync 		: true,
						content : {
							new_user_name : newuserName,
							company_name : companyid
						},
						load : _showExistingBeneficiaryMsg
					});
				}
	}
	
	function _validateBeneficiary(/*String*/field)
	{	
		var regex = dj.byId("beneficiary_accname_regex_mups");
		
	    var regexStr = regex ? dj.byId("beneficiary_accname_regex_mups").get("value") : '';		 
	    var accountNameRegExp = new RegExp(regexStr);

	    var isValid = false;
		var accNo = dj.byId(field);
		var accountNameString = accNo ? accNo.get("value") : '';

		if(regexStr !== null && regexStr !== ''){
	         if(accountNameString !== '' && accountNameString !== null)
		     {			   			   
				   isValid = accountNameRegExp.test(accountNameString);				   
				   return isValid;
		     }
		}

		return isValid;
	}  

	function _validateBeneficiaryAccountforMUPS(/*String*/field)
	{
	    var regex = dj.byId("beneficiary_account_regex_mups");		  
	    var regexStr = regex ? dj.byId("beneficiary_account_regex_mups").get("value") : '';		 
	    var accountRegExp = new RegExp(regexStr);

	    var isValid = false;
		var accNo = dj.byId(field);
		var accountNoString = accNo ? accNo.get("value") : '';

		if(regexStr !== null && regexStr !== ''){
	         if(accountNoString !== '' && accountNoString !== null)
		     {			   			   
				   isValid = accountRegExp.test(accountNoString);				   
				   return isValid;
		     }
		}

		return isValid;
	}  
	
	function _validateBeneficiaryAccountforMEPS(/*String*/field)
	{
	    var regex = dj.byId("beneficiary_account_regex_meps");		  
	    var regexStr = regex ? dj.byId("beneficiary_account_regex_meps").get("value") : '';		 
	    var accountRegExp = new RegExp(regexStr);

	    var isValid = false;
		var accNo = dj.byId("account_no");
		var accountNoString = accNo ? accNo.get("value") : '';

		if(regexStr !== null && regexStr !== ''){
	         if(accountNoString !== '' && accountNoString !== null)
		     {			   			   
				   isValid = accountRegExp.test(accountNoString);				   
				   return isValid;
		     }
		}

		return isValid;
	}  

	function _validateBeneficiaryAccountforRTGS(/*String*/field)
	{
	    var regex = dj.byId("beneficiary_account_regex_rtgs");		  
	    var regexStr = regex ? dj.byId("beneficiary_account_regex_rtgs").get("value") : '';		 
	    var accountRegExp = new RegExp(regexStr);

	    var isValid = false;
		var accNo = dj.byId("account_no");
		var accountNoString = accNo ? accNo.get("value") : '';

		if(regexStr !== null && regexStr !== ''){
	         if(accountNoString !== '' && accountNoString !== null)
		     {			   			   
				   isValid = accountRegExp.test(accountNoString);				   
				   return isValid;
		     }
		}

		return isValid;
	}  
	function _validateAddressRegexBeneficiary()
	{										 
 		  
		   var regex = dj.byId("regexAddressValue");
		   var regexswift = dj.byId("swiftregexValue");
		   var regexMeps = dj.byId("beneficiary_addr_regex_meps");
		   var regexStrMeps = regexMeps ? dj.byId("beneficiary_addr_regex_meps").get("value") : '';
		   var products = dj.byId("allowedProducts");
		   var regexStr = regex ? dj.byId("regexAddressValue").get("value") : '';
		   var regexStrswift = regexswift ? dj.byId("swiftregexValue").get("value") : '';
		   var productsStr = products ? dj.byId("allowedProducts").get("value") : '';
		   var productTypeId = dj.byId("product_type");
		   var productTypeStr =productTypeId ? dj.byId("product_type").get("value") : '';
		   		   
		   var beneficiaryRegExpSwift = new RegExp(regexStrswift);		 	   		  			   
		   var beneficiaryRegExp = new RegExp(regexStr);
		   var beneficiaryRegExpMeps = new RegExp(regexStrMeps);
		   
		   var isValid = false;
		   var errorMessage=null;
		  
		   var addressId1 = dj.byId("address_line_1");
		   var addressStr1 = addressId1? dj.byId("address_line_1").get("value") : '';
		   
		   var addressId2 = dj.byId("address_line_2");
		   var addressStr2 = addressId2? dj.byId("address_line_2").get("value") : '';
		   
		   var addressId3 = dj.byId("address_line_3");
		   var addressStr3 = addressId2? dj.byId("address_line_3").get("value") : '';
		   
		   var domLineId = dj.byId("dom");
		   var domLineStr = domLineId? dj.byId("dom").get("value") : '';
		   
		   if (   productTypeId  &&   (    productsStr.indexOf(productTypeStr) < 0   )   )
		   {			   
			  		   			   
			   if(productTypeStr === 'MT101' || productTypeStr === 'MT103'  || productTypeStr === 'FI103' || productTypeStr === 'FI202' || productTypeStr === 'DD')
			   {
							   				   
				   if(regexStr !== null && regexStr !== '' && addressStr1 !== '' && addressStr1 !== null)
				   {			   			   
					   isValid = beneficiaryRegExp.test(addressStr1);				   
					   if(!isValid)
					   {
						   errorMessage =  m.getLocalization("invalidBeneficiaryAddressField");
						   addressId1.set("state","Error");
						   dj.hideTooltip(addressId1.domNode);
						   dj.showTooltip(errorMessage, addressId1.domNode, 0);
					   }				   
				   }
				   
				   if(regexStr !== null && regexStr !== '' && addressStr2 !== '' && addressStr2 !== null)
				   {			   			   
					   isValid = beneficiaryRegExp.test(addressStr2);				   
					   if(!isValid)
					   {
						   errorMessage =  m.getLocalization("invalidBeneficiaryAddressField");
						   addressId2.set("state","Error");
						   dj.hideTooltip(addressId2.domNode);
						   dj.showTooltip(errorMessage, addressId2.domNode, 0);
					   }				   
				   }
				   
				   if(regexStr !== null && regexStr !== '' && addressStr3 !== '' && addressStr3 !== null)
				   {			   			   
					   isValid = beneficiaryRegExp.test(addressStr3);				   
					   if(!isValid)
					   {
						   errorMessage =  m.getLocalization("invalidBeneficiaryAddressField");
						   addressId3.set("state","Error");
						   dj.hideTooltip(addressId3.domNode);
						   dj.showTooltip(errorMessage, addressId3.domNode, 0);
					   }				   
				   }
				   				   
				   if(regexStr !== null && regexStr !== '' && domLineStr !== '' && domLineStr !== null)
				   {			   			   
					   isValid = beneficiaryRegExp.test(domLineStr);				   
					   if(!isValid)
					   {
						   errorMessage =  m.getLocalization("invalidBeneficiaryAddressField");
						   domId.set("state","Error");
						   dj.hideTooltip(domId.domNode);
						   dj.showTooltip(errorMessage, domId.domNode, 0);
					   }				   
				   }				   
			   }
			   else if(productTypeStr === 'TTPT')
			  	{
			  	if(regexStrswift !== null && regexStrswift !== '' && addressStr1 !== '' && addressStr1 !== null)
				   {			   			   
					   isValid = beneficiaryRegExpSwift.test(addressStr1);				   
					   if(!isValid)
					   {
						   errorMessage =  m.getLocalization("invalidBeneficiaryAddressField");
						   addressId1.set("state","Error");
						   dj.hideTooltip(addressId1.domNode);
						   dj.showTooltip(errorMessage, addressId1.domNode, 0);
					   }				   
				   }
				   if(regexStrswift !== null && regexStrswift !== '' && addressStr2 !== '' && addressStr2 !== null)
				   {			   			   
					   isValid = beneficiaryRegExpSwift.test(addressStr2);				   
					   if(!isValid)
					   {
						   errorMessage =  m.getLocalization("invalidBeneficiaryAddressField");
						   addressId2.set("state","Error");
						   dj.hideTooltip(addressId2.domNode);
						   dj.showTooltip(errorMessage, addressId2.domNode, 0);
					   }				   
				   }
				   if(regexStrswift !== null && regexStrswift !== '' && addressStr3 !== '' && addressStr3 !== null)
				   {			   			   
					   isValid = beneficiaryRegExpSwift.test(addressStr3);				   
					   if(!isValid)
					   {
						   errorMessage =  m.getLocalization("invalidBeneficiaryAddressField");
						   addressId3.set("state","Error");
						   dj.hideTooltip(addressId3.domNode);
						   dj.showTooltip(errorMessage, addressId3.domNode, 0);
					   }				   
				   }
				   if(regexStrswift !== null && regexStrswift !== '' && domLineStr !== '' && domLineStr !== null)
				   {			   			   
					   isValid = beneficiaryRegExpSwift.test(domLineStr);				   
					   if(!isValid)
					   {
						   errorMessage =  m.getLocalization("invalidBeneficiaryAddressField");
						   domLineId.set("state","Error");
						   dj.hideTooltip(domLineId.domNode);
						   dj.showTooltip(errorMessage, domLineId.domNode, 0);
					   }				   
				   }		
				   }
			   else if(productTypeStr === 'MEPS'){
				   
				   if(regexStrMeps !== null && regexStrMeps !== '' && addressStr1 !== '' && addressStr1 !== null)
				   {			   			   
					   isValid = beneficiaryRegExpMeps.test(addressStr1);				   
					   if(!isValid)
					   {
						   errorMessage =  m.getLocalization("invalidBeneficiaryAddressFieldMeps");
						   addressId1.set("state","Error");
						   dj.hideTooltip(addressId1.domNode);
						   dj.showTooltip(errorMessage, addressId1.domNode, 0);
					   }				   
				   }
				   			   
				   if(regexStrMeps !== null && regexStrMeps !== '' && addressStr2 !== '' && addressStr2 !== null)
				   {			   			   
					   isValid = beneficiaryRegExpMeps.test(addressStr2);				   
					   if(!isValid)
					   {
						   errorMessage =  m.getLocalization("invalidBeneficiaryAddressFieldMeps");
						   addressId2.set("state","Error");
						   dj.hideTooltip(addressId2.domNode);
						   dj.showTooltip(errorMessage, addressId2.domNode, 0);
					   }				   
				   }
				   				   
				   if(regexStrMeps !== null && regexStrMeps !== '' && domLineStr !== '' && domLineStr !== null)
				   {			   			   
					   isValid = beneficiaryRegExpMeps.test(domLineStr);				   
					   if(!isValid)
					   {
						   errorMessage =  m.getLocalization("invalidBeneficiaryAddressFieldMeps");
						   domLineId.set("state","Error");
						   dj.hideTooltip(domLineId.domNode);
						   dj.showTooltip(errorMessage, domLineId.domNode, 0);
						}				   
				   }				   
			   }
			   else if(productTypeStr === 'RTGS')
			   {
				   var regexStrRtgs = dj.byId("beneficiary_addr_regex_rtgs") ? dj.byId("beneficiary_addr_regex_rtgs").get("value") : '';
				   var beneficiaryRegExpRtgs = new RegExp(regexStrRtgs);
				   
				   var regexFor1stCharStr = dj.byId("addressStartCharsRegex") ? dj.byId("addressStartCharsRegex").get("value") : '';
				   var regexFor1stChar = new RegExp(regexFor1stCharStr);
				   			   
				   if(regexStrRtgs !== null && regexStrRtgs !== '' && addressStr1 !== '' && addressStr1 !== null)
				   {			   			   
					   isValid = beneficiaryRegExpRtgs.test(addressStr1);				   
					   if(!isValid)
					   {
						   errorMessage =  m.getLocalization("invalidBeneficiaryAddressFieldRtgs");
						   addressId1.set("state","Error");
						   dj.hideTooltip(addressId1.domNode);
						   dj.showTooltip(errorMessage, addressId1.domNode, 0);
					   }
					   else if(regexFor1stChar.test(addressStr1))
					   {
						   errorMessage =  m.getLocalization("invalidFirstCharBeneficiaryAddressFieldRtgs");
						   addressId1.set("state","Error");
						   dj.hideTooltip(addressId1.domNode);
						   dj.showTooltip(errorMessage, addressId1.domNode, 0);				   
					   }					   
				   }
				   
				   if(regexStrRtgs !== null && regexStrRtgs !== '' && addressStr2 !== '' && addressStr2 !== null)
				   {			   			   
					   isValid = beneficiaryRegExpRtgs.test(addressStr2);				   
					   if(!isValid)
					   {
						   errorMessage =  m.getLocalization("invalidBeneficiaryAddressFieldRtgs");
						   addressId2.set("state","Error");
						   dj.hideTooltip(addressId2.domNode);
						   dj.showTooltip(errorMessage, addressId2.domNode, 0);
					   }
					   else if(regexFor1stChar.test(addressStr2))
					   {
						   errorMessage =  m.getLocalization("invalidFirstCharBeneficiaryAddressFieldRtgs");
						   addressId2.set("state","Error");
						   dj.hideTooltip(addressId2.domNode);
						   dj.showTooltip(errorMessage, addressId2.domNode, 0);				   
					   }					   
				   }
				   
				   if(regexStrRtgs !== null && regexStrRtgs !== '' && domLineStr !== '' && domLineStr !== null)
				   {			   			   
					   isValid = beneficiaryRegExpRtgs.test(domLineStr);				   
					   if(!isValid)
					   {
						   errorMessage =  m.getLocalization("invalidBeneficiaryAddressFieldRtgs");
						   domLineId.set("state","Error");
						   dj.hideTooltip(domLineId.domNode);
						   dj.showTooltip(errorMessage, domLineId.domNode, 0);
					   }
					   else if(regexFor1stChar.test(domLineStr))
					   {
						   errorMessage =  m.getLocalization("invalidFirstCharBeneficiaryAddressFieldRtgs");
						   domLineId.set("state","Error");
						   dj.hideTooltip(domLineId.domNode);
						   dj.showTooltip(errorMessage, domLineId.domNode, 0);				   
					   }					   
				   }				   
				   
			   }
		    }
		   else
		   {   
			  m._config.forceSWIFTValidation = false;   			   			   
		   }
	}
	
	function _validateBankBranchCode()
	{
		//  summary: 
		//  If bank code and branch code both are populated then validate bank branch code
		var brch_code_field	=	dj.byId("brch_code"),
			bank_code_field	=	dj.byId("bank_code"),
			bank_name_field		=	dj.byId("bank_name"),
			branch_name_field		=	dj.byId("branch_name"),
			displayMessage  = 	"";
		var productType = dj.byId("product_type");
		if (productType && (productType.get("value") === "MT101" && productType.get("value") === "MT103" &&
						productType.get("value") === "FI103" && productType.get("value") === "FI202")) 
		{
		if(bank_code_field && brch_code_field)
		{
			if(!(bank_code_field.get("value") === "") && !(brch_code_field.get("value") === ""))
			{
				m.xhrPost( {
					url 		: misys.getServletURL("/screen/AjaxScreen/action/ValidateBankBranchCodeAction") ,
					handleAs 	: "json",
					sync 		: true,
					content 	: {
						bank_code : bank_code_field.get("value"),
						brnch_code : brch_code_field.get("value"),
						internal : "N"
					},
					load : function(response, args){
						if (response.items.valid === false)
						{
							displayMessage = misys.getLocalization("invalidBankCodeBranchCode", [bank_code_field.get("value"),brch_code_field.get("value")]);
							//focus on the widget and set state to error and display a tooltip indicating the same
							brch_code_field.focus();
							bank_name_field.set("value","");
							branch_name_field.set("value","");
							
							bank_code_field.set("state","Error");
							brch_code_field.set("state","Error");
							dj.hideTooltip(brch_code_field.domNode);
							dj.showTooltip(displayMessage, brch_code_field.domNode, 0);
						}
						else
						{
							console.debug("Validated Bank Branch Code");
							bank_name_field.set("value", response.items.bankName);
							branch_name_field.set("value", response.items.branchName);
						}
						
					},
					error 		: function(response, args){
						console.error("[Could not validate Bank Code Branch Code] "+ bank_code_field.get("value") + "," + brch_code_field.get("value"));
						console.error(response);
					}
				});
			}
			else
			{
				bank_name_field.set("value", "");
				branch_name_field.set("value", "");
			}
		}
		}
	}

    function _populateBankDetailsRtgs()
	{
			//  summary: 
			//  If clearing code and bank ifsc code both are populated then validate bank ifsc code
			var swift_code_field	=	dj.byId("bank_bic_code_rtgs"),
				name_field = dj.byId("bank_name"),
				bank_address_line_1_field = dj.byId("bank_address_line_1"),
				bank_address_line_2_field = dj.byId("bank_address_line_2"),
				bank_dom_field = dj.byId("bank_dom"),
				bank_country_field = dj.byId("bank_code_country"),
				intermediary_flag = dj.byId("intermediary_flag"),
				displayMessage  = 	"";
			
			if(swift_code_field)
			{
				if(swift_code_field.get("value") !== "")
				{
					m.xhrPost( {
						url 		: misys.getServletURL("/screen/AjaxScreen/action/ValidateBankRTGSSWIFTCodeAction") ,
						handleAs 	: "json",
						sync 		: true,
						content 	: {
							bank_code     : swift_code_field.get("value")
						},
						load : function(response, args){
							if (response.items.valid === true){					
									name_field.set("value", response.items.bankName);
									bank_address_line_1_field.set("value", response.items.bankAddressLine1);
									bank_address_line_2_field.set("value", response.items.bankAddressLine2);
									bank_dom_field.set("value", response.items.bankDom);
									bank_country_field.set("value", response.items.bankCountry);
									intermediary_flag.set("value", response.items.intermediaryFlag);
							}
							else{
									displayMessage = misys.getLocalization("invalidBankCode");
									swift_code_field.focus();
									swift_code_field.set("value","");
									swift_code_field.set("state","Error");
									dj.hideTooltip(swift_code_field.domNode);
									dj.showTooltip(displayMessage, swift_code_field.domNode, 0);
								}
						},
						error 		: function(response, args){
							console.error("[Could not validate Bank IFSC Code] "+ bank_code_field.get("value"));
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
	}
    
    function _populateBankDetailsMeps()
	{
			//  summary: 
			//  If clearing code and bank ifsc code both are populated then validate bank ifsc code
			var swift_code_field	=	dj.byId("bank_iso_code_meps"),
				name_field = dj.byId("bank_name"),
				bank_address_line_1_field = dj.byId("bank_address_line_1"),
				bank_address_line_2_field = dj.byId("bank_address_line_2"),
				bank_dom_field = dj.byId("bank_dom"),
				bank_country_field = dj.byId("bank_code_country"),
				intermediary_flag = dj.byId("intermediary_flag"),
				displayMessage  = 	"";
			
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
									name_field.set("value", response.items.bankName);
									bank_address_line_1_field.set("value", response.items.bankAddressLine1);
									bank_address_line_2_field.set("value", response.items.bankAddressLine2);
									bank_dom_field.set("value", response.items.bankDom);
									bank_country_field.set("value", response.items.bankCountry);
									intermediary_flag.set("value", response.items.intermediaryFlag);
							}
							else{
									displayMessage = misys.getLocalization("invalidBankCode");
									swift_code_field.focus();
									swift_code_field.set("value","");
									swift_code_field.set("state","Error");
									dj.hideTooltip(swift_code_field.domNode);
									dj.showTooltip(displayMessage, swift_code_field.domNode, 0);
								}
						},
						error 		: function(response, args){
							console.error("[Could not validate Bank IFSC Code] "+ bank_code_field.get("value"));
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
	}
    
    function _validateDescriptionAddress()
	{  
		 var isValid = true;
		   if((dj.byId("mailing_address_line_5") && dj.byId("mailing_address_line_5").get("value") !== "") && ((dj.byId("mailing_address_line_1") && dj.byId("mailing_address_line_1").get("value") == "") || (dj.byId("mailing_address_line_2") && dj.byId("mailing_address_line_2").get("value") == "") || (dj.byId("mailing_address_line_3") && dj.byId("mailing_address_line_3").get("value") == "") || (dj.byId("mailing_address_line_4") && dj.byId("mailing_address_line_4").get("value") == ""))){
	  			isValid = false;
	  		  if(dj.byId("mailing_address_line_4").get("value") == ""){
		           dj.byId("mailing_address_line_4").set("state","Error");
		         }
	  		  else if(dj.byId("mailing_address_line_3").get("value") == ""){
		           dj.byId("mailing_address_line_3").set("state","Error");
		         }else if(dj.byId("mailing_address_line_2").get("value") == ""){
			    	dj.byId("mailing_address_line_2").set("state","Error"); 
			     }else if(dj.byId("mailing_address_line_1").get("value") == ""){
			    	dj.byId("mailing_address_line_1").set("state","Error"); 
			     }
			     return isValid;
		 }
		   else if((dj.byId("mailing_address_line_4") && dj.byId("mailing_address_line_4").get("value") !== "") && ((dj.byId("mailing_address_line_1") && dj.byId("mailing_address_line_1").get("value") == "") || (dj.byId("mailing_address_line_2") && dj.byId("mailing_address_line_2").get("value") == "") || (dj.byId("mailing_address_line_3") && dj.byId("mailing_address_line_3").get("value") == ""))){
	  			isValid = false;
			    if(dj.byId("mailing_address_line_3").get("value") == ""){
		           dj.byId("mailing_address_line_3").set("state","Error");
		         }else if(dj.byId("mailing_address_line_2").get("value") == ""){
			    	dj.byId("mailing_address_line_2").set("state","Error"); 
			     }else if(dj.byId("mailing_address_line_1").get("value") == ""){
			    	dj.byId("mailing_address_line_1").set("state","Error"); 
			     }
			     return isValid;
		 }else if((dj.byId("mailing_address_line_3") && dj.byId("mailing_address_line_3").get("value") !== "") && ((dj.byId("mailing_address_line_1") && dj.byId("mailing_address_line_1").get("value") == "") || (dj.byId("mailing_address_line_2") && dj.byId("mailing_address_line_2").get("value") == ""))){
			 isValid = false;
			 if(dj.byId("mailing_address_line_2").get("value") == ""){
			    	dj.byId("mailing_address_line_2").set("state","Error"); 
			    }else if(dj.byId("mailing_address_line_1").get("value") == ""){
			    	dj.byId("mailing_address_line_1").set("state","Error"); 
			     }
			     return isValid;
		 
	 }else if((dj.byId("mailing_address_line_2") && dj.byId("mailing_address_line_2").get("value") !== "") && (dj.byId("mailing_address_line_1") && dj.byId("mailing_address_line_1").get("value") == "")){
		 isValid = false;
		 if(dj.byId("mailing_address_line_1").get("value") == ""){
		    	dj.byId("mailing_address_line_1").set("state","Error"); 
		     }
		     return isValid;
  	 }
	   return isValid;
	}


	function _populateMepsIntermediaryBankDetails()
	{

		// summary:
		// If clearing code and bank ifsc code both are populated then validate
		// bank ifsc code
		var swift_code_field = dj.byId("intermediary_bank_meps_swift_bic_code"), 
			name_field = dj.byId("intermediary_bank_meps_name"), 
			bank_address_line_1_field = dj.byId("intermediary_bank_meps_address_line_1"), 
			bank_address_line_2_field = dj.byId("intermediary_bank_meps_address_line_2"), 
			bank_dom_field = dj.byId("intermediary_bank_meps_dom"), 
			bank_country_field = dj.byId("intermediary_bank_meps_country"), 
			displayMessage = "";

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
						product_type : dj.byId('product_type').get('value')
					},
					load : function(response, args)
					{
						if (response.items.valid === true)
						{
							name_field.set("value", response.items.bankName);
							bank_address_line_1_field.set("value", response.items.bankAddressLine1);
							bank_address_line_2_field.set("value", response.items.bankAddressLine2);
							bank_dom_field.set("value", response.items.bankDom);
							bank_country_field.set("value", response.items.bankCountry);
						} else
						{
							displayMessage = misys.getLocalization("invalidBankCode");
							swift_code_field.focus();
							swift_code_field.set("value", "");
							swift_code_field.set("state", "Error");
							dj.hideTooltip(swift_code_field.domNode);
							dj.showTooltip(displayMessage, swift_code_field.domNode, 0);
						}
					},
					error : function(response, args)
					{
						console.error("[Could not validate Intermediary Swift Code] " + swift_code_field.get("value"));
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

	}
		
	function _populateRtgsIntermediaryBankDetails()
	{
		// summary:
		// If clearing code and bank ifsc code both are populated then validate
		// bank ifsc code
		var swift_code_field = dj.byId("intermediary_bank_rtgs_swift_bic_code"), 
			name_field = dj.byId("intermediary_bank_rtgs_name"), 
			bank_address_line_1_field = dj.byId("intermediary_bank_rtgs_address_line_1"), 
			bank_address_line_2_field = dj.byId("intermediary_bank_rtgs_address_line_2"), 
			bank_dom_field = dj.byId("intermediary_bank_rtgs_dom"), 
			bank_country_field = dj.byId("intermediary_bank_rtgs_country"), 
			displayMessage = "";

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
						product_type : dj.byId('product_type').get('value')
					},
					load : function(response, args)
					{
						if (response.items.valid === true)
						{
							name_field.set("value", response.items.bankName);
							bank_address_line_1_field.set("value", response.items.bankAddressLine1);
							bank_address_line_2_field.set("value", response.items.bankAddressLine2);
							bank_dom_field.set("value", response.items.bankDom);
							bank_country_field.set("value", response.items.bankCountry);
						} else
						{
							displayMessage = misys.getLocalization("invalidBankCode");
							swift_code_field.focus();
							swift_code_field.set("value", "");
							swift_code_field.set("state", "Error");
							dj.hideTooltip(swift_code_field.domNode);
							dj.showTooltip(displayMessage, swift_code_field.domNode, 0);
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

	}	
	
	function _validateBeneficiaryAccount()
	{
		var productType = dj.byId('product_type').get('value');
		var accountNo = dj.byId("account_no");
		var errorMessage = null;
		var displayMessage = "";
		// Summary:
		// Validate the beneficiary master account
		if(productType ==="MUPS" || productType ==="HVPS"  || productType ==="HVXB")
		{
			if( accountNo && accountNo.get("value") !== "" && (!_validateBeneficiaryAccountforMUPS(accountNo)))
			   {

				   errorMessage =  m.getLocalization("invalidAccountNumberforMUPS");
				   accountNo.focus();
				   accountNo.set("state","Error");
				   dj.hideTooltip(accountNo.domNode);
				   dj.showTooltip(errorMessage, accountNo.domNode, 0);
			   }
		}
		if(productType ==="MEPS")
		{
			if( accountNo && accountNo.get("value") !== "" && (!_validateBeneficiaryAccountforMEPS(accountNo)))
			   {

				   errorMessage =  m.getLocalization("invalidAccountNumberforMeps");
				   accountNo.focus();
				   accountNo.set("state","Error");
				   dj.hideTooltip(accountNo.domNode);
				   dj.showTooltip(errorMessage, accountNo.domNode, 0);
			   }
		}
		if(productType ==="RTGS")
		{
			if( accountNo && accountNo.get("value") !== "" && (!_validateBeneficiaryAccountforRTGS(accountNo)))
			   {

				   errorMessage =  m.getLocalization("invalidAccountNumberforRtgs");
				   //accountNo.focus();
				   accountNo.set("state","Error");
				   dj.hideTooltip(accountNo.domNode);
				   dj.showTooltip(errorMessage, accountNo.domNode, 0);
				   return;
			   }
		}		
		if(productType !=="MUPS" && productType !=="MEPS" && productType !=="RTGS")
		{
			var accountNum = dj.byId("account_no");
			if( accountNum && accountNum.get("value") !== "" && (!_validateBeneficiaryAccountNo(accountNum)))
			   {
				   errorMessage =  m.getLocalization("invalidAccountNumberForBeneficiary");
				   accountNum.focus();
				   accountNum.set("state","Error");
				   dj.hideTooltip(accountNum.domNode);
				   dj.showTooltip(errorMessage, accountNum.domNode, 0);
			   }
		}
			var product_type_field			=	dj.byId("product_type"),
				account_number_field		=	dj.byId("account_no"),
				account_currency_field		=	dj.byId("account_cur_code"),
				bo_account_id_field			=	dj.byId("bo_account_id"),
				bo_account_type_field		=	dj.byId("bo_account_type"),
				bo_account_currency_field	=	dj.byId("bo_account_currency"),
				bo_branch_code_field		=	dj.byId("bo_branch_code"),
				bo_product_type_field		=	dj.byId("bo_product_type");
			
			if (product_type_field.get("value") === "")
			{
				product_type_field.set("value", "NONE");
			}
	
			var companyid = null;
		   	if(dijit.byId('company'))
		   	{
			   companyid = dijit.byId('company').get("_lastValueReported");
		   	}
		   
			if(!(dijit.byId("account_no").get("_lastValueReported") == dijit.byId("account_no").get("_resetValue")))
			{
			   var accountNumber = account_number_field ? account_number_field.get('value') : '';
			   var duplicateBeneficiaryValidation = dj.byId("DUPLICATE_BENEFICIARY_ACCOUNT_VALIDATION_FLAG");
			   if(accountNumber != ''  && duplicateBeneficiaryValidation && duplicateBeneficiaryValidation.get('value') === "true") {
					m.xhrPost( {
						url : m.getServletURL("/screen/AjaxScreen/action/ValidateBeneficiaryMasterAccountNumber"),
						handleAs 	: "json",
						sync 		: true,
						content : {
							account_number : accountNumber,
						company_name : companyid
						},
						load : _showExistingAccountNoMsg
					});
				}
			}
			m.xhrPost({
				url 		: misys.getServletURL("/screen/AjaxScreen/action/ValidateBeneficiaryMasterAccount") ,
				handleAs 	: "json",
				sync 		: true,
				content 	: {
					account_number : account_number_field.get("value"),
					account_cur_code: account_currency_field.get("value")
				},
				load : function(response, args){
					//Clear all back office hidden fields
					_clearBOFields();
					switch(response.items.StatusCode)
					{
						case "OK":
										//Populate the response fields into hidden fields to persist
										bo_account_id_field.set("value",response.items.AcctId);
										bo_account_type_field.set("value",response.items.AcctType);
										bo_account_currency_field.set("value",response.items.AcctCur);
										bo_branch_code_field.set("value",response.items.BranchCode);
										bo_product_type_field.set("value",response.items.ProdType);
										account_currency_field.set("value",response.items.AcctCur);
										break;
						case "ERR_INVALID_INTERFACE_PROCESSING_ERROR":
										displayMessage = misys.getLocalization("mqInterfaceFailure", [account_number_field.get("value")]);
										//focus on the widget and set state to error and display a tool tip indicating the same
										account_number_field.focus();
										account_number_field.set("value","");
										account_number_field.set("state","Error");
										dj.hideTooltip(account_number_field.domNode);
										dj.showTooltip(displayMessage, account_number_field.domNode, 0);
										break;
						case "ERR_INVALID_ACCOUNT_NUMBER":
										displayMessage = misys.getLocalization("invalidAccountNumber", [account_number_field.get("value")]);
										//focus on the widget and set state to error and display a tool tip indicating the same
										account_number_field.focus();
										account_number_field.set("value","");
										account_number_field.set("state","Error");
										dj.hideTooltip(account_number_field.domNode);
										dj.showTooltip(displayMessage, account_number_field.domNode, 0);
										break;
						default:
										displayMessage = response.items.StatusCodeMessage;
										//focus on the widget and set state to error and display a tool tip indicating the same
										account_number_field.focus();
										account_number_field.set("value","");
										account_number_field.set("state","Error");
										dj.hideTooltip(account_number_field.domNode);
										dj.showTooltip(displayMessage, account_number_field.domNode, 0);
										break;
							
					}
				},
				error : function(response, args){
					console.error("[Could not validate Beneficiary Account] "+ account_number_field.get("value"));
					console.error(response);
				}
			});
	}
	
		function _validateBeneficiaryAccountNo(/*String*/field)
		{
		    var regex = dj.byId("beneficiary_account_regex");		  
		    var regexStr = regex ? dj.byId("beneficiary_account_regex").get("value") : '';		 
		    var accountRegExp = new RegExp(regexStr);

		    var isValid = false;
			var accNo = dj.byId(field);
			var accountNoString = accNo ? accNo.get("value") : '';

			if(regexStr !== null && regexStr !== ''){
		         if(accountNoString !== '' && accountNoString !== null)
			     {			   			   
					   isValid = accountRegExp.test(accountNoString);				   
					   return isValid;
			     }
			}

			return isValid;
		}
		
	function _showExistingAccountNoMsg(response){
		 
		// summary:
	    // Validate a change login id, testing if the login id entered is existing in the database.
		// If already exists clear the entered log in id and prompt for new user id.
		
		console.debug("[Validate] Validating Account Number");
		
		var	field = dijit.byId("account_no");
		var displayMessage = '';
		var timeoutInMs     = 2000;
		
		var hideTT = function() {
			dj.hideTooltip(field.domNode);
		};
		if(response.items.valid === true)
		{
			field.focus();
			displayMessage = m.getLocalization("DuplicateAccountNumber", [field.get("value")]);
			field.set("value","");
			field.set("state", "Error");
			dijit.hideTooltip(field.domNode);
			dijit.showTooltip(displayMessage,field.domNode, 0);
			setTimeout(hideTT, timeoutInMs);
		}else
		{
			console.debug("message is false");
		}
	}
	
	function _clearBOFields()
	{
		var bo_account_id_field		=	dj.byId("bo_account_id"),
		bo_account_type_field		=	dj.byId("bo_account_type"),
		bo_account_currency_field	=	dj.byId("bo_account_currency"),
		bo_branch_code_field		=	dj.byId("bo_branch_code"),
		bo_product_type_field		=	dj.byId("bo_product_type");
		//Clear all back office hidden fields
		bo_account_id_field.set("value","");
		bo_account_type_field.set("value","");
		bo_account_currency_field.set("value","");
		bo_branch_code_field.set("value","");
		bo_product_type_field.set("value","");
	}
	
	function _enableDisableSWIFTCharactersCheck(field,isEnabled)
	{
		// Summary:
		// Enables or disables swift characters check for the given field
		if(field)
		{
			if(isEnabled)
			{
				if((d.hasClass(field.domNode, "swift") === false))
				{
					d.addClass(field.domNode,"swift");
				}
			}
			else
			{
				if(d.hasClass(field.domNode, "swift"))
				{
					d.removeClass(field.domNode,"swift");
				}
			}
		}
	}
	
	function _validateIBANCode()
	{
		//  summary: 
		//  Validates whether the account is valid IBAN account number
		var country = dj.byId("bank_country") ? dj.byId("bank_country").get("value") : "";
		var currency = dj.byId("account_cur_code") ? dj.byId("account_cur_code").get("value") : "";
		var account_no = dj.byId("account_no") ? dj.byId("account_no").get("value") : "";
		var isValid=true;
		if(country !== "" && currency !== "" && account_no !== "")					
		{	
			var productsStr = dj.byId("includedIBANProducts") ? dj.byId("includedIBANProducts").get("value") : '';
			var productTypeId = dj.byId("product_type")? dj.byId("product_type").get("value") : '';
			
			if (productTypeId && (productsStr.indexOf(productTypeId) >= 0))
			{
				m.xhrPost({
					url : m.getServletURL("/screen/AjaxScreen/action/IBANValidationAction"),
					sync : true,
					handleAs : "json",
					content: { 
						COUNTRY: country,
						CURRENCY: currency,
						ACCOUNT_NO: account_no
						},
					load : function(response, args){
						isValid = response.responseFlag;
					},
					error : function(response, args){
						//Should be prevent from submitting when there is a error ?
						//isValid = false;
						console.error("[misys.grid._base] IBAN Validation error", response);
					}
				});
			}
			if(!isValid){
				m._config.onSubmitErrorMsg =  m.getLocalization("invalidIBANAccNoError", [ account_no ]);	
				return false;
			}
			
		}
		return isValid;
	}
	
	function _validateBankDetails()
	{  
 	   	
	   var regex = dj.byId("regexAddressValue");		  
	   var regexStr = regex ? dj.byId("regexAddressValue").get("value") : '';		 
	   var addressRegExp = new RegExp(regexStr);
	   
	   var isValid = true;
	   var errorMessage=null;
	  				   				   
	   var bankName = dj.byId("bank_ifsc_name");
	   var bankNameStr = bankName? dj.byId("bank_ifsc_name").get("value") : '';
			 
	   if(regexStr !== null && regexStr !== ''){
	         if(bankNameStr !== '' && bankNameStr !== null)
		     {			   			   
				   isValid = addressRegExp.test(bankNameStr);				   
				   if(!isValid)
				   {
					   errorMessage =  m.getLocalization("invalidDescriptionAddressField");
					   bankName.set("state","Error");
					   dj.hideTooltip(bankName.domNode);
					   dj.showTooltip(errorMessage, bankName.domNode, 0);
					   return isValid;
				   }				   
			   }
			   
			   var bankAddressId1 = dj.byId("bank_ifsc_address_line_1");
			   var bankAddressStr1 = bankAddressId1? dj.byId("bank_ifsc_address_line_1").get("value") : '';
			   
			   if(bankAddressStr1 !== '' && bankAddressStr1 !== null)
			   {			   			   
				   isValid = addressRegExp.test(bankAddressStr1);				   
				   if(!isValid)
				   {
					   errorMessage =  m.getLocalization("invalidDescriptionAddressField");
					   bankAddressId1.set("state","Error");
					   dj.hideTooltip(bankAddressId1.domNode);
					   dj.showTooltip(errorMessage, bankAddressId1.domNode, 0);
					   return isValid;
				   }				   
			   }
			   
			   var bankAddressId2 = dj.byId("bank_ifsc_address_line_2");
			   var bankAddressStr2 = bankAddressId2? dj.byId("bank_ifsc_address_line_2").get("value") : '';
			   
			   if(bankAddressStr2 !== '' && bankAddressStr2 !== null)
			   {			   			   
				   isValid = addressRegExp.test(bankAddressStr2);				   
				   if(!isValid)
				   {
					   errorMessage =  m.getLocalization("invalidDescriptionAddressField");
					   bankAddressId2.set("state","Error");
					   dj.hideTooltip(bankAddressId2.domNode);
					   dj.showTooltip(errorMessage, bankAddressId2.domNode, 0);
					   return isValid;
				   }				   
			   }
			   				   
			   var bankCity = dj.byId("bank_ifsc_city");
			   var BankCityStr = bankCity? dj.byId("bank_ifsc_city").get("value") : '';
			   
			   if(BankCityStr !== '' && BankCityStr !== null)
			   {			   			   
				   isValid = addressRegExp.test(BankCityStr);				   
				   if(!isValid)
				   {
					   errorMessage =  m.getLocalization("invalidDescriptionAddressField");
					   bankCity.set("state","Error");
					   dj.hideTooltip(bankCity.domNode);
					   dj.showTooltip(errorMessage, bankCity.domNode, 0);
					   return isValid;
				   }				   
			   }
		   }
	   else
	   {   
		   m._config.forceSWIFTValidation = false;   			   			   
	   }
	   return isValid;
	  }
		
	function _validateBankDetailsMeps(){
		
	   var regex = dj.byId("beneficiary_addr_regex_meps");
	   var regexStr = regex ? dj.byId("beneficiary_addr_regex_meps").get("value") : '';
	   var bankRegExp = new RegExp(regexStr); 
	   var isValid = true;
	   var bankName = dj.byId("bank_name");
	   var bankNameStr = bankName? dj.byId("bank_name").get("value") : '';
	   var errorMessage = null;
	
		if(regexStr !== null && regexStr !== ''){
	         if(bankNameStr !== '' && bankNameStr !== null)
		     {			   			   
				   isValid = bankRegExp.test(bankNameStr);				   
				   if(!isValid)
				   {
					   errorMessage =  m.getLocalization("invalidBankAddressMeps");
					   bankName.set("state","Error");
					   dj.showTooltip(errorMessage, bankName.domNode, 0);
					   var hideTT = function() {
						   dj.hideTooltip(bankName.domNode);
						};
						setTimeout(hideTT, 5000);
				   }				   
			   }
			   
			   var bankAddressId1 = dj.byId("bank_address_line_1");
			   var bankAddressStr1 = bankAddressId1? dj.byId("bank_address_line_1").get("value") : '';
			   
			   if(bankAddressStr1 !== '' && bankAddressStr1 !== null)
			   {			   			   
				   isValid = bankRegExp.test(bankAddressStr1);				   
				   if(!isValid)
				   {
					   errorMessage =  m.getLocalization("invalidBankAddressMeps");
					   bankAddressId1.set("state","Error");
					   dj.showTooltip(errorMessage, bankAddressId1.domNode, 0);
					   var hideTT1 = function() {
						   dj.hideTooltip(bankAddressId1.domNode);
						};
						setTimeout(hideTT1, 5000);
				   }				   
			   }
			   
			   var bankAddressId2 = dj.byId("bank_address_line_2");
			   var bankAddressStr2 = bankAddressId2? dj.byId("bank_address_line_2").get("value") : '';
			   
			   if(bankAddressStr2 !== '' && bankAddressStr2 !== null)
			   {			   			   
				   isValid = bankRegExp.test(bankAddressStr2);				   
				   if(!isValid)
				   {
					   errorMessage =  m.getLocalization("invalidBankAddressMeps");
					   bankAddressId2.set("state","Error");
					   dj.showTooltip(errorMessage, bankAddressId2.domNode, 0);
					   var hideTT2 = function() {
						   dj.hideTooltip(bankAddressId2.domNode);
						};
						setTimeout(hideTT2, 5000);
				   }				   
			   }
			   				   
			   var bankCity = dj.byId("bank_dom");
			   var bankCityStr = bankCity? dj.byId("bank_dom").get("value") : '';
			   
			   if(bankCityStr !== '' && bankCityStr !== null)
			   {			   			   
				   isValid = bankRegExp.test(bankCityStr);				   
				   if(!isValid)
				   {
					   errorMessage =  m.getLocalization("invalidBankAddressMeps");
					   bankCity.set("state","Error");
					   dj.showTooltip(errorMessage, bankCity.domNode, 0);
					   var hideTT3 = function() {
						   dj.hideTooltip(bankCity.domNode);
						};
						setTimeout(hideTT3, 5000);
				   }				   
			   }
		}	
	   else
	   {   
		   m._config.forceSWIFTValidation = false;   			   			   
	   }
	   return isValid;
	}
	
	function _validateBankInterDetailsMeps(){
		
		   var regex = dj.byId("beneficiary_addr_regex_meps");
		   var regexStr = regex ? dj.byId("beneficiary_addr_regex_meps").get("value") : '';
		   var bankRegExp = new RegExp(regexStr); 
		   var isValid = true;
		   var bankName = dj.byId("intermediary_bank_meps_name");
		   var bankNameStr = bankName? dj.byId("intermediary_bank_meps_name").get("value") : '';
		   var errorMessage = null;
		
			if(regexStr !== null && regexStr !== ''){
		         if(bankNameStr !== '' && bankNameStr !== null)
			     {			   			   
					   isValid = bankRegExp.test(bankNameStr);				   
					   if(!isValid)
					   {
						   errorMessage =  m.getLocalization("invalidBankAddressMeps");
						   bankName.set("state","Error");
						   dj.showTooltip(errorMessage, bankName.domNode, 0);
						   var hideTT = function() {
							   dj.hideTooltip(bankName.domNode);
							};
							setTimeout(hideTT, 5000);
					   }				   
				   }
				   
				   var bankAddressId1 = dj.byId("intermediary_bank_meps_address_line_1");
				   var bankAddressStr1 = bankAddressId1? dj.byId("intermediary_bank_meps_address_line_1").get("value") : '';
				   
				   if(bankAddressStr1 !== '' && bankAddressStr1 !== null)
				   {			   			   
					   isValid = bankRegExp.test(bankAddressStr1);				   
					   if(!isValid)
					   {
						   errorMessage =  m.getLocalization("invalidBankAddressMeps");
						   bankAddressId1.set("state","Error");
						   dj.showTooltip(errorMessage, bankAddressId1.domNode, 0);
						   var hideTT1 = function() {
							   dj.hideTooltip(bankAddressId1.domNode);
							};
							setTimeout(hideTT1, 5000);
					   }				   
				   }
				   
				   var bankAddressId2 = dj.byId("intermediary_bank_meps_address_line_2");
				   var bankAddressStr2 = bankAddressId2? dj.byId("intermediary_bank_meps_address_line_2").get("value") : '';
				   
				   if(bankAddressStr2 !== '' && bankAddressStr2 !== null)
				   {			   			   
					   isValid = bankRegExp.test(bankAddressStr2);				   
					   if(!isValid)
					   {
						   errorMessage =  m.getLocalization("invalidBankAddressMeps");
						   bankAddressId2.set("state","Error");
						   dj.showTooltip(errorMessage, bankAddressId2.domNode, 0);
						   var hideTT2 = function() {
							   dj.hideTooltip(bankAddressId2.domNode);
							};
							setTimeout(hideTT2, 5000);
					   }				   
				   }
				   				   
				   var bankCity = dj.byId("intermediary_bank_meps_dom");
				   var bankCityStr = bankCity? dj.byId("intermediary_bank_meps_dom").get("value") : '';
				   
				   if(bankCityStr !== '' && bankCityStr !== null)
				   {			   			   
					   isValid = bankRegExp.test(bankCityStr);				   
					   if(!isValid)
					   {
						   errorMessage =  m.getLocalization("invalidBankAddressMeps");
						   bankCity.set("state","Error");
						   dj.showTooltip(errorMessage, bankCity.domNode, 0);
						   var hideTT3 = function() {
							   dj.hideTooltip(bankCity.domNode);
							};
							setTimeout(hideTT3, 5000);
					   }				   
				   }
			}	
		   else
		   {   
			   m._config.forceSWIFTValidation = false;   			   			   
		   }
		   return isValid;
		}
	
	function _validateBankDetailsRtgs(){
		
	   var regex = dj.byId("beneficiary_addr_regex_rtgs");
	   var regexStr = regex ? dj.byId("beneficiary_addr_regex_rtgs").get("value") : '';
	   var bankRegExp = new RegExp(regexStr); 
	   var isValid = true;
	   var bankName = dj.byId("bank_name");
	   var bankNameStr = bankName? dj.byId("bank_name").get("value") : '';
	   var errorMessage = null;
	
		if(regexStr !== null && regexStr !== ''){
	         if(bankNameStr !== '' && bankNameStr !== null)
		     {			   			   
				   isValid = bankRegExp.test(bankNameStr);				   
				   if(!isValid)
				   {
					   errorMessage =  m.getLocalization("invalidBankAddressRtgs");
					   bankName.set("state","Error");
					   dj.showTooltip(errorMessage, bankName.domNode, 0);
					   var hideTT = function() {
						   dj.hideTooltip(bankName.domNode);
						};
						setTimeout(hideTT, 5000);
				   }				   
			   }
			   
			   var bankAddressId1 = dj.byId("bank_address_line_1");
			   var bankAddressStr1 = bankAddressId1? dj.byId("bank_address_line_1").get("value") : '';
			   
			   if(bankAddressStr1 !== '' && bankAddressStr1 !== null)
			   {			   			   
				   isValid = bankRegExp.test(bankAddressStr1);				   
				   if(!isValid)
				   {
					   errorMessage =  m.getLocalization("invalidBankAddressRtgs");
					   bankAddressId1.set("state","Error");
					   dj.showTooltip(errorMessage, bankAddressId1.domNode, 0);
					   var hideTT1 = function() {
						   dj.hideTooltip(bankAddressId1.domNode);
						};
						setTimeout(hideTT1, 5000);
				   }				   
			   }
			   
			   var bankAddressId2 = dj.byId("bank_address_line_2");
			   var bankAddressStr2 = bankAddressId2? dj.byId("bank_address_line_2").get("value") : '';
			   
			   if(bankAddressStr2 !== '' && bankAddressStr2 !== null)
			   {			   			   
				   isValid = bankRegExp.test(bankAddressStr2);				   
				   if(!isValid)
				   {
					   errorMessage =  m.getLocalization("invalidBankAddressRtgs");
					   bankAddressId2.set("state","Error");
					   dj.showTooltip(errorMessage, bankAddressId2.domNode, 0);
					   var hideTT2 = function() {
						   dj.hideTooltip(bankAddressId2.domNode);
						};
						setTimeout(hideTT2, 5000);
				   }				   
			   }
			   				   
			   var bankCity = dj.byId("bank_dom");
			   var bankCityStr = bankCity? dj.byId("bank_dom").get("value") : '';
			   
			   if(bankCityStr !== '' && bankCityStr !== null)
			   {			   			   
				   isValid = bankRegExp.test(bankCityStr);				   
				   if(!isValid)
				   {
					   errorMessage =  m.getLocalization("invalidBankAddressRtgs");
					   bankCity.set("state","Error");
					   dj.showTooltip(errorMessage, bankCity.domNode, 0);
					   var hideTT3 = function() {
						   dj.hideTooltip(bankCity.domNode);
						};
						setTimeout(hideTT3, 5000);
				   }				   
			   }
		}	
	   else
	   {   
		   m._config.forceSWIFTValidation = false;   			   			   
	   }
	   return isValid;
	}
	
	function _validateBankInterDetailsRtgs(){
		
		   var regex = dj.byId("beneficiary_addr_regex_rtgs");
		   var regexStr = regex ? dj.byId("beneficiary_addr_regex_rtgs").get("value") : '';
		   var bankRegExp = new RegExp(regexStr); 
		   var isValid = true;
		   var bankName = dj.byId("intermediary_bank_rtgs_name");
		   var bankNameStr = bankName? dj.byId("intermediary_bank_rtgs_name").get("value") : '';
		   var errorMessage = null;
		
			if(regexStr !== null && regexStr !== ''){
		         if(bankNameStr !== '' && bankNameStr !== null)
			     {			   			   
					   isValid = bankRegExp.test(bankNameStr);				   
					   if(!isValid)
					   {
						   errorMessage =  m.getLocalization("invalidBankAddressRtgs");
						   bankName.set("state","Error");
						   dj.showTooltip(errorMessage, bankName.domNode, 0);
						   var hideTT = function() {
							   dj.hideTooltip(bankName.domNode);
							};
							setTimeout(hideTT, 5000);
					   }				   
				   }
				   var bankAddressId1 = dj.byId("intermediary_bank_rtgs_address_line_1");
				   var bankAddressStr1 = bankAddressId1? dj.byId("intermediary_bank_rtgs_address_line_1").get("value") : '';
				   
				   if(bankAddressStr1 !== '' && bankAddressStr1 !== null)
				   {			   			   
					   isValid = bankRegExp.test(bankAddressStr1);				   
					   if(!isValid)
					   {
						   errorMessage =  m.getLocalization("invalidBankAddressRtgs");
						   bankAddressId1.set("state","Error");
						   dj.showTooltip(errorMessage, bankAddressId1.domNode, 0);
						   var hideTT1 = function() {
							   dj.hideTooltip(bankAddressId1.domNode);
							};
							setTimeout(hideTT1, 5000);
					   }				   
				   }
				   
				   var bankAddressId2 = dj.byId("intermediary_bank_rtgs_address_line_2");
				   var bankAddressStr2 = bankAddressId2? dj.byId("intermediary_bank_rtgs_address_line_2").get("value") : '';
				   
				   if(bankAddressStr2 !== '' && bankAddressStr2 !== null)
				   {			   			   
					   isValid = bankRegExp.test(bankAddressStr2);				   
					   if(!isValid)
					   {
						   errorMessage =  m.getLocalization("invalidBankAddressRtgs");
						   bankAddressId2.set("state","Error");
						   dj.showTooltip(errorMessage, bankAddressId2.domNode, 0);
						   var hideTT2 = function() {
							   dj.hideTooltip(bankAddressId2.domNode);
							};
							setTimeout(hideTT2, 5000);
					   }				   
				   }
				   				   
				   var bankCity = dj.byId("intermediary_bank_rtgs_dom");
				   var bankCityStr = bankCity? dj.byId("intermediary_bank_rtgs_dom").get("value") : '';
				   
				   if(bankCityStr !== '' && bankCityStr !== null)
				   {			   			   
					   isValid = bankRegExp.test(bankCityStr);				   
					   if(!isValid)
					   {
						   errorMessage =  m.getLocalization("invalidBankAddressRtgs");
						   bankCity.set("state","Error");
						   dj.showTooltip(errorMessage, bankCity.domNode, 0);
						   var hideTT3 = function() {
							   dj.hideTooltip(bankCity.domNode);
							};
							setTimeout(hideTT3, 5000);
					   }				   
				   }
			}	
		   else
		   {   
			   m._config.forceSWIFTValidation = false;   			   			   
		   }
		   return isValid;
		}
	
		
	function _enableDisableCounterpartyDetails(){
		
		var fields = ["counterparty_name","address_line_1", "address_line_2", "dom"];
		var isDisableField = false;
	    if (dj.byId("iso_code").get("value").length !==0)
		{
	    	isDisableField = true;
		}
	    m.toggleFieldsReadOnly(fields,isDisableField);
	}
	
	function _validatePostalCodeLength()
	{
		//  summary: 
		//  Validates the length of the postal code against the country code
		var postalCodeField,
			beneficiaryCountryField,
			errorMessage			= "",
			postalCodeLength		= 0,
			timeoutInMs 			= 2000,
			hideTT ;
			
		if (this.get("name") === "bene_details_country" || this.get("name") === "bene_details_postal_code")
		{
			beneficiaryCountryField = dj.byId("bene_details_country");
			postalCodeField = dj.byId("bene_details_postal_code");
		}
		else
		{
			beneficiaryCountryField = dj.byId("beneficiary_country");
			postalCodeField = dj.byId("postal_code");
		}
		
		hideTT = function() {
			dj.hideTooltip(beneficiaryCountryField.domNode);
		};
		
		//If both fields exists then validate
		if(postalCodeField && beneficiaryCountryField)
		{
			//Check if the country field is empty
			if(beneficiaryCountryField.get("value") === "")
			{ 
				if(this.get("name") === "postal_code" || this.get("name") === "bene_details_postal_code"){
					postalCodeField.set("value","");
					errorMessage =  m.getLocalization("selectBeneficiaryCountry");
					//beneficiaryCountryField.focus();
					beneficiaryCountryField.set("state","Error");
					dj.hideTooltip(beneficiaryCountryField.domNode);
					dj.showTooltip(errorMessage, beneficiaryCountryField.domNode, 0);
					setTimeout(hideTT, timeoutInMs);
				}
				else
				{
					postalCodeField.set("value","");
					postalCodeField.set("maxLength",0);
				}
			}
			else
			{
				//if postal code length configuration exists for the given country
				if(misys._config.postal_codes[beneficiaryCountryField.get("value")])
				{
					postalCodeLength = misys._config.postal_codes[beneficiaryCountryField.get("value")];
					postalCodeField.set("maxLength",postalCodeLength);
					//Clear the postal code field only when the beneficiary country field changes from the previous value
					if(m._config.currentBeneficiaryCountry !== beneficiaryCountryField.get("value"))
					{
						postalCodeField.set("value","");
						m._config.currentBeneficiaryCountry = beneficiaryCountryField.get("value");
					}
				}
				else
				{
					if((this.get("name") === "beneficiary_country" || this.get("name") === "bene_details_country") && (m._config.currentBeneficiaryCountry !== beneficiaryCountryField.get("value")))
					{
						postalCodeField.set("value","");	
						m._config.currentBeneficiaryCountry = beneficiaryCountryField.get("value");
					}
					postalCodeField.set("maxLength",15);
				}
			}
		}
	}
	
	function _makeFieldsNonMandatory()
	{
		var isoCode = dj.byId("iso_code");
		var beneficiaryName = dj.byId("counterparty_name");
		if ((isoCode.value)||(beneficiaryName.value))
		{
			dj.byId("address_line_2").set("required", false);
			dj.byId("account_no").set("required", false);
		}
	}
	
	function _makeFieldsNonMandatoryFI202Only ()
	{
		if(dj.byId("product_type").get("value") === "FI202")
		{
			_makeFieldsNonMandatory();
		}
	}
	
	function _getReAuthAcccount()
	{   // i am forced to write this below code as beneficiary_master_mc.js is messed up with account_id for different product type 
		// need to change in future
		var productCode = dj.byId("product_type").get("value");
		var account_no = (dj.byId("account_no")) ? dj.byId("account_no").get("value") : "";
		switch(productCode)
		{
			case "TPT":
				account_no = dj.byId("account_no").get("value");
				break;
			case "FI202":
				account_no = dj.byId("account_no_mt202").get("value");
				break;
			default:
				break;
		}
		return account_no;
	}
	
	function _fncChangeIntermediaryRequiredFieldsOnChange() {
		// summary:
		//		Copy of StandingInstructionAction.js methods for customer beneficiary maintenance screen

		var EmptyListfield = ['inter_bank_name','inter_bank_address_1', 'inter_bank_dom', 'inter_bank_country'];

		var required = false;
		var fields = ['inter_bank_name', 'inter_bank_dom', 'inter_bank_country'];
		d.forEach(EmptyListfield, function(Emptyfield){

			if(dj.byId(Emptyfield).get('value')!==''){
				required = true;
			}
		});
		d.forEach(fields, function(field){
			dj.byId(field).set('required', required);
		});
	}
	
	function _fncCheckSpecialRoutingInstructionFields () {
		// summary:
		//		Copy of StandingInstructionAction.js methods for customer beneficiary maintenance screen
		//
		// description:
		//		This functions set as required the routing instruction fields.
		//		Fields are marked as required if a field which the name has a lower index
		//		is empty whereas a field with a greater index is populated.
		
		var instructionFieldName =  'special_routing_';
		var instructionFieldsNameArray = [];
		var i = 1;
		// first field name
		var lastInputIndex = instructionFieldName + i;
		// Populate the array of instruction fields name
		// currently, there are 6
		for (i= 1; i <= 6; i++)
		{
			instructionFieldsNameArray.push(instructionFieldName + i);
			// keep the last input field name
			if (dj.byId(instructionFieldName + i).get('value') !== ''){
				lastInputIndex = instructionFieldName + i;
			}
		}
		// Go through all fields and set their state
		d.forEach(instructionFieldsNameArray, function (instructionFieldName, i){
			var instructionField = dj.byId(instructionFieldName);
			var anInstruction = instructionField.get('value');
			if (anInstruction === '' && instructionFieldName < lastInputIndex)
			{
				instructionField.set('required', true);			
			}
			else
			{
				instructionField.set('required', false);
			}
		});
	}
	
	function _fncCheckPaymentDetailsFields() {
		// summary:
		//		Copy of StandingInstructionAction.js methods for customer beneficiary maintenance screen
		//
		// description:
		//		This functions set as required the payment details fields.
		//		Fields are marked as required if a field which the name has a lower index
		//		is empty whereas a field with a greater index is populated.
		
		var paymentDetailsFieldsNameArray = ['payment_detail_1', 'payment_detail_2', 'payment_detail_3','payment_detail_4'];
		// first field name
		var lastInputIndex = paymentDetailsFieldsNameArray[0];
		// Populate the array of instruction fields name
		// currently, there are 6
		d.forEach(paymentDetailsFieldsNameArray, function(paymentDetailsFieldName){
			// keep the last input field name
			if (dj.byId(paymentDetailsFieldName).get('value') !== ''){
				lastInputIndex = paymentDetailsFieldName;
			}
		});
		// Go through all fields and set their state
		d.forEach(paymentDetailsFieldsNameArray, function(paymentDetailsFieldName, i){
			var aPaymentDetailsField = dj.byId(paymentDetailsFieldName);
			var aPaymentDetails = aPaymentDetailsField.get('value');
			if (aPaymentDetails === '' && paymentDetailsFieldName < lastInputIndex){
				aPaymentDetailsField.set('required', true);			
			}
			else{
				aPaymentDetailsField.set('required', false);
			}
		});
	}
	
		
	d.mixin(m._config, {		
		initReAuthParams : function(){	
			
			var reAuthParams = { 	productCode : "BM",
			         				subProductCode : dj.byId("product_type").get("value"),
			        				transactionTypeCode : "01",
			        				entity : "",			        			
			        				currency : "",
			        				amount : "",
			        				
			        				es_field1 : _getReAuthAcccount(),			        						
			        				es_field2 : ""
								  };
			return reAuthParams;
		}
	});
	
	d.mixin(m, {
		bind : function() {
			m.setValidation("beneficiary_country", m.validateCountry);
			m.setValidation("bene_details_country", m.validateCountry);
			m.setValidation("beneficiary_cntry_country",m.validateCountry);
			m.setValidation("intermediary_bank_rtgs_country",m.validateCountry);
			m.setValidation("intermediary_bank_meps_country",m.validateCountry);
			m.setValidation("bank_country", m.validateCountry);
			m.setValidation("bank_code_country", m.validateCountry);
			m.setValidation("bank_iso_code", m.validateBICFormat);
			m.setValidation("bank_iso_code_meps", m.validateBICFormat);
			m.setValidation("bank_bic_code_rtgs", m.validateBICFormat);
			m.setValidation("account_cur_code", m.validateCurrency);
			m.setValidation("email_1", m.validateEmailAddr);
			m.setValidation("email_2", m.validateEmailAddr);
			m.setValidation("fax", m.validateFax);
			m.setValidation("phone", m.validatePhoneOrFax);
			m.setValidation("threshold_cur_code", m.validateCurrency);
			m.setValidation("inter_bank_swift", m.validateBICFormat);
			m.setValidation("intermediary_bank_swift_bic_code", m.validateBICFormat);
			m.setValidation("intermediary_bank_meps_swift_bic_code", m.validateBICFormat);
			m.setValidation("intermediary_bank_rtgs_swift_bic_code", m.validateBICFormat);
            
			m.connect("email_1", "onChange", _validateEmailAddr);
			
			m.connect("account_cur_code", "onChange", function(){
				m._validateCurrencyCode(dj.byId("product_type"),
						dj.byId("account_cur_code"));
			});
			
			m.connect("threshold_cur_code", "onChange", function(){
				m._validateCurrencyCode(dj.byId("product_type"),
						dj.byId("threshold_cur_code"));
			});
			
			m.connect("entity", "onChange", function(){
				_resetEntityScreenFields();
				if(misys._config.isMultiBank){
					_populateCustomerBanks();
				}
			});
			m.connect("customer_bank", "onChange", function(){
				if(misys._config.isMultiBank){
					_populateProductTypes();
				}
			});
			if (misys._config.isMultiBank){
				m.connect("product_type", "onChange", _toggleProductScreenFieldsForMultibank);
			} 
			else{
				m.connect("product_type", "onChange", _toggleProductScreenFields);
			}
			
			m.connect("pre_approved", "onChange", _toggleThresholdAmount);
			m.connect("approveButton", "onClick",_toggleThresholdAmount);
			m.connect("revertButton", "onClick",_toggleThresholdAmount);
			m.connect("returnButton", "onClick",_toggleThresholdAmount);
			//m.connect("bank_code", "onBlur", _validateBankBranchCode);
			var productType = dj.byId("product_type");
			   if (productType && (productType.get("value") !== "MT101" && productType.get("value") !== "MT103" &&
						productType.get("value") !== "FI103" && productType.get("value") !== "FI202"))
		  {
			m.connect("brch_code", "onBlur", _validateBankBranchCode);
		  }
			m.connect("counterparty_name", "onBlur", _validateRegexBeneficiary);
			m.connect("beneficiary_id", "onBlur", _validateRegexBeneficiaryId);
			m.connect("counterparty_name_2", "onBlur", _validateRegexBeneficiary);
			m.connect("counterparty_name_3", "onBlur", _validateRegexBeneficiary);
			m.connect("address_line_1", "onBlur", _validateAddressRegexBeneficiary);
			m.connect("address_line_2", "onBlur", _validateAddressRegexBeneficiary);
			m.connect("address_line_3", "onBlur", _validateAddressRegexBeneficiary);
			m.connect("dom", "onBlur", _validateAddressRegexBeneficiary);
			m.connect("email_2", "onBlur", _validateDuplicateEmail);
			m.connect("email_1", "onBlur", _validateDuplicateEmail);			
			m.connect("account_no", "onBlur", _validateBeneficiaryAccount);
			m.connect("postal_code", "onKeyPress", _validatePostalCodeLength);
			m.connect("beneficiary_country", "onBlur", _validatePostalCodeLength);
			m.connect("bene_details_postal_code", "onKeyPress", _validatePostalCodeLength);
			m.connect("bene_details_country", "onBlur", _validatePostalCodeLength);
						
			m.connect("iso_code","onChange",_makeFieldsNonMandatoryFI202Only);
			m.connect("counterparty_name","onBlur", _makeFieldsNonMandatoryFI202Only);
			
			m.connect('inter_bank_name', 'onChange', _fncChangeIntermediaryRequiredFieldsOnChange);
			m.connect('inter_bank_dom', 'onChange', _fncChangeIntermediaryRequiredFieldsOnChange);
			m.connect('inter_bank_country', 'onChange', _fncChangeIntermediaryRequiredFieldsOnChange);
			m.connect('inter_bank_address_1', 'onChange', _fncChangeIntermediaryRequiredFieldsOnChange);
			m.connect('special_routing_1', 'onChange', _fncCheckSpecialRoutingInstructionFields);
			m.connect('special_routing_2', 'onChange', _fncCheckSpecialRoutingInstructionFields);
			m.connect('special_routing_3', 'onChange', _fncCheckSpecialRoutingInstructionFields);
			m.connect('special_routing_4', 'onChange', _fncCheckSpecialRoutingInstructionFields);
			m.connect('special_routing_5', 'onChange', _fncCheckSpecialRoutingInstructionFields);
			m.connect('special_routing_6', 'onChange', _fncCheckSpecialRoutingInstructionFields);
			m.connect('payment_detail_1', 'onChange', _fncCheckPaymentDetailsFields);
			m.connect('payment_detail_2', 'onChange', _fncCheckPaymentDetailsFields);
			m.connect('payment_detail_3', 'onChange', _fncCheckPaymentDetailsFields);
			m.connect('payment_detail_4', 'onChange', _fncCheckPaymentDetailsFields);

			m.connect("account_no_mt202", "onChange", function(){
				if(dj.byId("product_type").get("value") === "FI202")
				{
				dj.byId("account_no").set("value", dj.byId("account_no_mt202").get("value"));
				}
			});
			m.connect("branch_address_line_1", "onBlur", function(){
				_validateBranchAddressRegex(dj.byId("branch_address_line_1"));
			});
			m.connect("branch_address_line_2", "onBlur", function(){
				_validateBranchAddressRegex(dj.byId("branch_address_line_2"));
			});
			m.connect("branch_dom", "onBlur", function(){
				_validateBranchAddressRegex(dj.byId("branch_dom"));
			});	
			m.connect("bank_iso_code","onChange",_truncateBankNameForBeneficiry);
			
			m.connect("bank_ifsc_code","onChange",_getIFSCCode);
			//m.connect("bank_name","onChange",_truncateBankNameForBeneficiry);
			/*m.connect("bank_ifsc_code","onChange",function() {
				if (dj.byId("bank_ifsc_code").get("value").length === 0)
				{
					beneifsccode.clear();
			}
				});*/
			m.connect("bank_iso_code","onChange",function() {
				if (dj.byId("bank_iso_code").get("value").length === 0)
				{
					dj.byId("branch_address").set("readOnly", true);
					dj.byId("branch_address").set("checked", false);
					dj.byId("bank_country_btn_img").set("disabled",false);
					
					
					dj.byId("bank_name").set("value", "");
					dj.byId("bank_address_line_1").set("value", "");
					dj.byId("bank_address_line_2").set("value", "");
					dj.byId("bank_dom").set("value", "");
					dj.byId("bank_country").set("value", "");
					dj.byId("brch_code").set("value", "");
				}
				else
				{
					dj.byId("branch_address").set("readOnly", false);
					dj.byId("bank_country_btn_img").set("disabled",true);
					/*dj.byId("branch_address_line_1").set("value","");
					dj.byId("branch_address_line_2").set("value","");
					dj.byId("branch_dom").set("value","");*/
				}
			});
			
			m.connect("bank_iso_code_meps","onBlur",function() {
				var isoCodeMeps = dj.byId("bank_iso_code_meps") ? dj.byId("bank_iso_code_meps").get("value") : "" ;
				var cpty_swift_code_field	=	dj.byId("bank_iso_code_meps");

				if(dj.byId("intermediary_bank_meps_swift_bic_code").get("value") !== "" && dj.byId("bank_iso_code_meps").get("value") !== "" &&  (dj.byId("intermediary_bank_meps_swift_bic_code").get("value") === dj.byId("bank_iso_code_meps").get("value"))) {
					var displayMessageCpty  = 	"";
					displayMessageCpty = misys.getLocalization("invalidSwiftBicCode");
			  		cpty_swift_code_field.set("state","Error");
					dj.hideTooltip(cpty_swift_code_field.domNode);
					dj.showTooltip(displayMessageCpty, cpty_swift_code_field.domNode, 0);
				   } else {
				
				if(isoCodeMeps.length > 0 ){
					_populateBankDetailsMeps();
					_validateBankDetailsMeps();
					dj.byId("branch_address").set("readOnly", false);
					if(dj.byId("intermediary_flag") && dj.byId("intermediary_flag").get("value") !== ""){
						if(dj.byId("intermediary_flag").get("value") === "Y")
						{
							m.toggleRequired("intermediary_bank_meps_swift_bic_code", true);
							m.toggleRequired("intermediary_bank_meps_name", true);
							m.toggleRequired("intermediary_bank_meps_country", true);
							m.toggleRequired("intermediary_bank_meps_address_line_1", true);
						}	
						else if(dj.byId("intermediary_flag").get("value") === "N")
						{
							m.toggleRequired("intermediary_bank_meps_swift_bic_code", false);
							m.toggleRequired("intermediary_bank_meps_name", false);
							m.toggleRequired("intermediary_bank_meps_country", false);
							m.toggleRequired("intermediary_bank_meps_address_line_1", false);
						}		
					}
				}
				else if (isoCodeMeps.length === 0)
				{
					m.toggleFieldsReadOnly(["bank_name","bank_address_line_1","bank_address_line_2","bank_dom","bank_code_country"], false);
					dj.byId("branch_address").set("readOnly", true);
					dj.byId("branch_address").set("checked", false);
					dj.byId("bank_code_country_btn_img").set("disabled",false);
					dj.byId("bank_name").set("readOnly", false);
					dj.byId("bank_code_country").set("readOnly", false);
					_clearBankFields();
				}
				else
				{
					m.toggleFieldsReadOnly(["bank_name","bank_address_line_1","bank_address_line_2","bank_dom","bank_code_country"], true);
					dj.byId("branch_address").set("readOnly", false);
					dj.byId("bank_code_country_btn_img").set("disabled",true);
					dj.byId("bank_name").set("readOnly", true);
					dj.byId("bank_country").set("readOnly", true);
					if(dj.byId("intermediary_flag") && dj.byId("intermediary_flag").get("value") != ""){
						if(dj.byId("intermediary_flag").get("value") === "Y"){
							m.toggleRequired("intermediary_bank_meps_swift_bic_code", true);
							m.toggleRequired("intermediary_bank_meps_name", true);
							m.toggleRequired("intermediary_bank_meps_country", true);
							m.toggleRequired("intermediary_bank_meps_address_line_1", true);
						}	
						else if(dj.byId("intermediary_flag").get("value") === "N"){
							m.toggleRequired("intermediary_bank_meps_swift_bic_code", false);
							m.toggleRequired("intermediary_bank_meps_name", false);
							m.toggleRequired("intermediary_bank_meps_country", false);
							m.toggleRequired("intermediary_bank_meps_address_line_1", false);
						}		
					}

				}
				   }
			});

			m.connect("bank_bic_code_rtgs","onBlur",function() {
				var isoCodeRtgs = dj.byId("bank_bic_code_rtgs") ? dj.byId("bank_bic_code_rtgs").get("value") : "" ;
				var cpty_swift_code_field	=	dj.byId("bank_bic_code_rtgs");

				if(dj.byId("intermediary_bank_rtgs_swift_bic_code").get("value") !== "" && dj.byId("bank_bic_code_rtgs").get("value") !== "" &&  (dj.byId("intermediary_bank_rtgs_swift_bic_code").get("value") === dj.byId("bank_bic_code_rtgs").get("value"))) {
					var displayMessageCpty  = 	"";
					displayMessageCpty = misys.getLocalization("invalidSwiftBicCode");
			  		cpty_swift_code_field.set("state","Error");
					dj.hideTooltip(cpty_swift_code_field.domNode);
					dj.showTooltip(displayMessageCpty, cpty_swift_code_field.domNode, 0);
				   } else {
				
 				if(isoCodeRtgs.length > 0){
					_populateBankDetailsRtgs();
					_validateBankDetailsRtgs();
					dj.byId("branch_address").set("readOnly", false);
					if(dj.byId("intermediary_flag") && dj.byId("intermediary_flag").get("value") != ""){
						if(dj.byId("intermediary_flag").get("value") === "Y"){
							m.toggleRequired("intermediary_bank_rtgs_swift_bic_code", true);
							m.toggleRequired("intermediary_bank_rtgs_name", true);
							m.toggleRequired("intermediary_bank_rtgs_address_line_1", true);
							m.toggleRequired("intermediary_bank_rtgs_country", true);
						}	
						else if(dj.byId("intermediary_flag").get("value") === "N"){
							m.toggleRequired("intermediary_bank_rtgs_swift_bic_code", false);
							m.toggleRequired("intermediary_bank_rtgs_name", false);
							m.toggleRequired("intermediary_bank_rtgs_address_line_1", false);
							m.toggleRequired("intermediary_bank_rtgs_country", false);
						}		
					}
				}
 				else if (isoCodeRtgs.length === 0)
				{
					m.toggleFieldsReadOnly(["bank_name","bank_address_line_1","bank_address_line_2","bank_dom","bank_code_country"], false);
					dj.byId("branch_address").set("readOnly", true);
					dj.byId("branch_address").set("checked", false);
					dj.byId("bank_code_country_btn_img").set("disabled",false);
					dj.byId("bank_name").set("readOnly", false);
					dj.byId("bank_country").set("readOnly", false);
					_clearBankFields();
				}
				else
				{
					m.toggleFieldsReadOnly(["bank_name","bank_address_line_1","bank_address_line_2","bank_dom","bank_code_country"], true);
					dj.byId("branch_address").set("readOnly", false);
					dj.byId("bank_code_country_btn_img").set("disabled",true);
					dj.byId("bank_name").set("readOnly", true);
					dj.byId("bank_code_country").set("readOnly", true);
					m.toggleFieldsReadOnly(["bank_name","bank_address_line_1","bank_address_line_2","bank_dom","bank_code_country"], true);
					if(dj.byId("intermediary_flag") && dj.byId("intermediary_flag").get("value") !== ""){
						if(dj.byId("intermediary_flag").get("value") === "Y"){
							m.toggleRequired("intermediary_bank_rtgs_swift_bic_code", true);
							m.toggleRequired("intermediary_bank_rtgs_name", true);
							m.toggleRequired("intermediary_bank_rtgs_address_line_1", true);
							m.toggleRequired("intermediary_bank_rtgs_country", true);
						}	
						else if(dj.byId("intermediary_flag").get("value") === "N")
						{
							m.toggleRequired("intermediary_bank_rtgs_swift_bic_code", false);
							m.toggleRequired("intermediary_bank_rtgs_name", false);
							m.toggleRequired("intermediary_bank_rtgs_address_line_1", false);
							m.toggleRequired("intermediary_bank_rtgs_country", false);
						}		
					}
				}
			}
			});
			
			m.connect("intermediary_bank_meps_swift_bic_code","onBlur",function(){
				
				var intermediaryMepsSwiftCode = dj.byId("intermediary_bank_meps_swift_bic_code") ? dj.byId("intermediary_bank_meps_swift_bic_code").get("value") : "";	
				var cpty_swift_code_field	=	dj.byId("intermediary_bank_meps_swift_bic_code");

				if(dj.byId("intermediary_bank_meps_swift_bic_code").get("value") !== "" && dj.byId("bank_iso_code_meps").get("value") !== "" &&  (dj.byId("intermediary_bank_meps_swift_bic_code").get("value") === dj.byId("bank_iso_code_meps").get("value"))) {
					var displayMessageCpty  = 	"";
					displayMessageCpty = misys.getLocalization("invalidIntermeditaryCode");
			  		cpty_swift_code_field.set("state","Error");
					dj.hideTooltip(cpty_swift_code_field.domNode);
					dj.showTooltip(displayMessageCpty, cpty_swift_code_field.domNode, 0);
				   } else {
				
				if(intermediaryMepsSwiftCode.length > 0 )
				{
					_populateMepsIntermediaryBankDetails();
				}
				else if(intermediaryMepsSwiftCode.length === 0)
			    	{	
						if(dj.byId("intermediary_flag").get("value") === "N" || dj.byId("intermediary_flag").get("value") === "") {
							m.toggleFieldsReadOnly(["intermediary_bank_meps_name","intermediary_bank_meps_address_line_1","intermediary_bank_meps_address_line_2","intermediary_bank_meps_dom","intermediary_bank_meps_country"], false);
							m.toggleRequired("intermediary_bank_meps_name", false);
							m.toggleRequired("intermediary_bank_meps_address_line_1", false);
							m.toggleRequired("intermediary_bank_meps_country", false);
							dj.byId("intermediary_bank_meps_country_btn_img").set("disabled", false);
							_clearInterBankFields();
				    	}
			    }
				else if((dj.byId("intermediary_bank_meps_name").get("value") !== "" || dj.byId("intermediary_bank_meps_address_line_1").get("value") !== "" || dj.byId("intermediary_bank_meps_country").get("value") !== ""))
				{
					m.toggleFieldsReadOnly(["intermediary_bank_meps_name","intermediary_bank_meps_address_line_1","intermediary_bank_meps_address_line_2","intermediary_bank_meps_dom","intermediary_bank_meps_country"], true);
					dj.byId("intermediary_bank_meps_country_btn_img").set("disabled", true);
					m.toggleRequired("intermediary_bank_meps_name", true);
					m.toggleRequired("intermediary_bank_meps_address_line_1", true);
					m.toggleRequired("intermediary_bank_meps_country", true);
					_validateBankInterDetailsMeps();
				}
				   }
			});

			m.connect("intermediary_bank_rtgs_swift_bic_code","onBlur",function(){
				var intermediaryRtgsSwiftCode = dj.byId("intermediary_bank_rtgs_swift_bic_code") ? dj.byId("intermediary_bank_rtgs_swift_bic_code").get("value") : "";
				
				var intermediary_swift_code_field	=	dj.byId("intermediary_bank_rtgs_swift_bic_code");
				
				if(dj.byId("intermediary_bank_rtgs_swift_bic_code").get("value") !== "" && dj.byId("bank_bic_code_rtgs").get("value") !== "" &&  (dj.byId("intermediary_bank_rtgs_swift_bic_code").get("value") === dj.byId("bank_bic_code_rtgs").get("value"))) {
					var displayMessageInter  = 	"";
					displayMessageInter = misys.getLocalization("invalidIntermeditaryCode");
			  		intermediary_swift_code_field.set("state","Error");
					dj.hideTooltip(intermediary_swift_code_field.domNode);
					dj.showTooltip(displayMessageInter, intermediary_swift_code_field.domNode, 0);
				   } else {
				if(intermediaryRtgsSwiftCode.length > 0 ){
					_populateRtgsIntermediaryBankDetails();
				}
				else if(intermediaryRtgsSwiftCode.length === 0)
		    	{	if(dj.byId("intermediary_flag").get("value") === "N" || dj.byId("intermediary_flag").get("value") === "") {
						m.toggleFieldsReadOnly(["intermediary_bank_rtgs_name","intermediary_bank_rtgs_address_line_1","intermediary_bank_rtgs_address_line_2","intermediary_bank_rtgs_dom","intermediary_bank_rtgs_country"], false);
						dj.byId("intermediary_bank_rtgs_country_btn_img").set("disabled", false);
						m.toggleRequired("intermediary_bank_rtgs_name", false);
						m.toggleRequired("intermediary_bank_rtgs_address_line_1", false);
						m.toggleRequired("intermediary_bank_rtgs_country", false);
						_clearRTGSInterBankFields();
		    		}
			    }
				else if((dj.byId("intermediary_bank_rtgs_name").get("value") !== "" || dj.byId("intermediary_bank_rtgs_address_line_1").get("value") !== "" || dj.byId("intermediary_bank_rtgs_country").get("value") !== ""))
				{
					m.toggleFieldsReadOnly(["intermediary_bank_rtgs_name","intermediary_bank_rtgs_address_line_1","intermediary_bank_rtgs_address_line_2","intermediary_bank_rtgs_dom","intermediary_bank_rtgs_country"], true);
					dj.byId("intermediary_bank_rtgs_country_btn_img").set("disabled", true);
					m.toggleRequired("intermediary_bank_rtgs_name", true);
					m.toggleRequired("intermediary_bank_rtgs_address_line_1", true);
					m.toggleRequired("intermediary_bank_rtgs_country", true);
					_validateBankInterDetailsRtgs();
				}
				   }
			});

			m.connect("intermediary_bank_swift_bic_code","onChange",function(){
				//m.setSwiftBankDetailsForOnBlurEvent(false ,"intermediary_bank_swift_bic_code","", null, null, "intermediary_bank_", true,true,true,"");
				m.setSwiftBankDetailsForOnBlurEvent(false ,"intermediary_bank_swift_bic_code",null, null, null, "intermediary_bank_", true,false,true, "");
				var intermediary_swift_code_field	=	dj.byId("intermediary_bank_swift_bic_code");
				var bic_code_status = false;
				if(dj.byId("intermediary_bank_swift_bic_code").get("value") !== "" && dj.byId("bank_iso_code").get("value") !== "" &&  (dj.byId("intermediary_bank_swift_bic_code").get("value") === dj.byId("bank_iso_code").get("value"))) {
					var displayMessageCpty  = 	"";
					displayMessageCpty = misys.getLocalization("invalidIntermeditaryCode");
					intermediary_swift_code_field.set("state","Error");
					dj.hideTooltip(intermediary_swift_code_field.domNode);
					dj.showTooltip(displayMessageCpty, intermediary_swift_code_field.domNode, 0);
					bic_code_status = true;
				   }
				
				if(bic_code_status){
					setTimeout(function(){ dj.byId("intermediary_bank_swift_bic_code").set("value",""); 
										   dj.byId("intermediary_bank_name").set("value","");
										   dj.byId("intermediary_bank_address_line_1").set("value","");
										   dj.byId("intermediary_bank_address_line_2").set("value","");
										   dj.byId("intermediary_bank_dom").set("value",""); 
										   dj.byId("intermediary_bank_country").set("value",""); }, 5000);
				}
				
				if(dj.byId("intermediary_bank_swift_bic_code").get("value").length === 0 && (dj.byId("intermediary_bank_name").get("value") !== "" || dj.byId("intermediary_bank_address_line_1").get("value") !== "" || dj.byId("intermediary_bank_country").get("value") !== ""))
		    	{
					m.toggleRequired("intermediary_bank_name", true);
					m.toggleRequired("intermediary_bank_address_line_1", true);
					m.toggleRequired("intermediary_bank_country", true);
					dj.byId("intermediary_bank_country_img").set("disabled", false);
			    }
				else
				{
					m.toggleRequired("intermediary_bank_name", false);
					m.toggleRequired("intermediary_bank_address_line_1", false);
					
					dj.byId("intermediary_bank_country_img").set("disabled", true);
					m.toggleFieldsReadOnly(["intermediary_bank_name","intermediary_bank_address_line_1","intermediary_bank_address_line_2","intermediary_bank_dom","intermediary_bank_country"], true);
					
				}
			});
			
			
			// Allow user to add only BIC Code or bank name and address
			m.connect('inter_bank_swift', 'onBlur', function(){
				var prefix = "inter";
				var bicCode=  dj.byId('inter_bank_swift').value;
				m.toggleBeneficiaryFields(bicCode,prefix,'inter_bank_country_btn_img',false);
			});
			
			m.connect('inter_bank_name', 'onBlur', function(){				
				var bankInp=  dj.byId('inter_bank_name').value;
				m.toggleBICFields(bankInp,'inter_bank_swift');
			});
			
			m.connect("iso_code","onChange", _truncateBeneficiaryInstitutionDetails);
			m.connect("counterparty_name","onChange", _truncateBeneficiaryInstitutionDetails);
			
			if(dj.byId('product_type').get('value') != "MUPS")
			{
				m.connect("threshold_cur_code","onChange",function() {
					m.setCurrency(dj.byId("threshold_cur_code"), ["threshold_amt"]);
				});
			
				m.connect("threshold_amt","onChange",function() {
					if(this.get("value") >= 0 && (dj.byId("pre_approved") && dj.byId("pre_approved").get("checked")))
				    {
						dj.byId("threshold_cur_code").set("required", true);
				    }
					else
					{
						dj.byId("threshold_cur_code").set("required", false);
				    }
				});
			}
			
			m.connect ("bank_name", "onBlur", function(){
				if(dj.byId('product_type').get('value') === "MEPS")
				{
					_validateBankDetailsMeps();
				}
			});
			m.connect ("bank_address_line_1", "onBlur", function(){
				if(dj.byId('product_type').get('value') === "MEPS")
				{
					_validateBankDetailsMeps();
				}
			});
			m.connect ("bank_address_line_2", "onBlur", function(){
				if(dj.byId('product_type').get('value') === "MEPS")
				{
					_validateBankDetailsMeps();
				}
			});
			m.connect ("bank_dom", "onBlur", function(){
				if(dj.byId('product_type').get('value') === "MEPS")
				{
					_validateBankDetailsMeps();
				}
			});
			m.connect ("bank_name", "onBlur", function(){
				if(dj.byId('product_type').get('value') === "RTGS")
				{
					_validateBankDetailsRtgs();
				}
			});
			m.connect ("bank_address_line_1", "onBlur", function(){
				if(dj.byId('product_type').get('value') === "RTGS")
				{
					_validateBankDetailsRtgs();
				}
			});
			m.connect ("bank_address_line_2", "onBlur", function(){
				if(dj.byId('product_type').get('value') === "RTGS")
				{
					_validateBankDetailsRtgs();
				}
			});
			m.connect ("bank_dom", "onBlur", function(){
				if(dj.byId('product_type').get('value') === "RTGS")
				{
					_validateBankDetailsRtgs();
				}
			});
			m.connect ("intermediary_bank_meps_name", "onBlur", function(){
				if(dj.byId('product_type').get('value') === "MEPS")
				{
					_validateBankInterDetailsMeps();
				}
			});
			m.connect ("intermediary_bank_meps_address_line_1", "onBlur", function(){
				if(dj.byId('product_type').get('value') === "MEPS")
				{
					_validateBankInterDetailsMeps();
				}
			});
			m.connect ("intermediary_bank_meps_address_line_2", "onBlur", function(){
				if(dj.byId('product_type').get('value') === "MEPS")
				{
					_validateBankInterDetailsMeps();
				}
			});
			m.connect ("intermediary_bank_meps_dom", "onBlur", function(){
				if(dj.byId('product_type').get('value') === "MEPS")
				{
					_validateBankInterDetailsMeps();
				}
			});
			m.connect ("intermediary_bank_rtgs_name", "onBlur", function(){
				if(dj.byId('product_type').get('value') === "RTGS")
				{
					_validateBankInterDetailsRtgs();
				}
			});
			m.connect ("intermediary_bank_rtgs_address_line_1", "onBlur", function(){
				if(dj.byId('product_type').get('value') === "RTGS")
				{
					_validateBankInterDetailsRtgs();
				}
			});
			m.connect ("intermediary_bank_rtgs_address_line_2", "onBlur", function(){
				if(dj.byId('product_type').get('value') === "RTGS")
				{
					_validateBankInterDetailsRtgs();
				}
			});
			m.connect ("intermediary_bank_rtgs_dom", "onBlur", function(){
				if(dj.byId('product_type').get('value') === "RTGS")
				{
					_validateBankInterDetailsRtgs();
				}
			});
			m.connect("branch_address", "onChange", function(){
				_toggleBranchAddress(this.get("checked"));
			});
			
			
			
			m.connect ("mailing_address_line_2", "onBlur", function(){
				if(dj.byId('product_type').get('value') === "TPT")
				{
					var errorMsg = null, 
					mail_addr_line_1_field = dj.byId("mailing_address_line_1"),
					mail_addr_line_2_field = dj.byId("mailing_address_line_2");
					
					if(mail_addr_line_1_field.get("value") === "" ){
						errorMsg = misys.getLocalization("invaliddescriptionaddressline");
						mail_addr_line_2_field.set("state","Error");
						dj.showTooltip(errorMsg, mail_addr_line_2_field.domNode, 0);
						 var hideTT = function() {
								dj.hideTooltip(mail_addr_line_2_field.domNode);
							};
							setTimeout(hideTT, 5000);
					}
				}
			});
			
			m.connect ("mailing_address_line_3", "onBlur", function(){
				if(dj.byId('product_type').get('value') === "TPT")
				{
					var errorMsg = null; 
					var mail_addr_line_1_field = dj.byId("mailing_address_line_1");
					var mail_addr_line_2_field = dj.byId("mailing_address_line_2");
					var mail_addr_line_3_field = dj.byId("mailing_address_line_3");
					
					if(mail_addr_line_1_field.get("value") === "" || mail_addr_line_2_field.get("value") === ""){
						errorMsg = misys.getLocalization("invaliddescriptionaddressline");
						mail_addr_line_3_field.set("state","Error");
						dj.showTooltip(errorMsg, mail_addr_line_3_field.domNode, 0);
						var hideTT = function() {
							dj.hideTooltip(mail_addr_line_3_field.domNode);
						};
						setTimeout(hideTT, 5000);
					} 
				}
			});
			
			m.connect ("mailing_address_line_4", "onBlur", function(){
				if(dj.byId('product_type').get('value') === "TPT")
				{
					var errorMsg = null;
					var mail_addr_line_1_field = dj.byId("mailing_address_line_1");
					var mail_addr_line_2_field = dj.byId("mailing_address_line_2");
					var mail_addr_line_3_field = dj.byId("mailing_address_line_3");
					var mail_addr_line_4_field = dj.byId("mailing_address_line_4");
					
					if(mail_addr_line_1_field.get("value") === "" || mail_addr_line_2_field.get("value") === "" || mail_addr_line_3_field.get("value") === "" ){
						errorMsg = misys.getLocalization("invaliddescriptionaddressline");
						mail_addr_line_4_field.set("state","Error");
						dj.showTooltip(errorMsg, mail_addr_line_4_field.domNode, 0);
						var hideTT = function() {
							dj.hideTooltip(mail_addr_line_4_field.domNode);
						};
						setTimeout(hideTT, 5000);
					} 
				}
			});
			
			
			m.connect ("mailing_address_line_5", "onBlur", function(){
				if(dj.byId('product_type').get('value') === "TPT")
				{
					var errorMsg = null;
					var mail_addr_line_1_field = dj.byId("mailing_address_line_1");
					var mail_addr_line_2_field = dj.byId("mailing_address_line_2");
					var mail_addr_line_3_field = dj.byId("mailing_address_line_3");
					var mail_addr_line_4_field = dj.byId("mailing_address_line_4");
					var mail_addr_line_5_field = dj.byId("mailing_address_line_5");
					
					if(mail_addr_line_1_field.get("value") === "" || mail_addr_line_2_field.get("value") === "" || mail_addr_line_3_field.get("value") === "" || mail_addr_line_4_field.get("value") === "" ){
						errorMsg = misys.getLocalization("invaliddescriptionaddressline");
						mail_addr_line_5_field.set("state","Error");
						dj.showTooltip(errorMsg, mail_addr_line_5_field.domNode, 0);
						var hideTT = function() {
							dj.hideTooltip(mail_addr_line_5_field.domNode);
						};
						setTimeout(hideTT, 5000);
					} 
				}
			});
			

			
					
			if(dj.byId("return_comment_hidden") && dj.byId("return_comments") && dj.byId("return_comment_hidden").get("value") !== "")
			{
				dj.byId("return_comments").set("value",dj.byId("return_comment_hidden").get("value"));
			}			
			
		},
		onFormLoad : function() {
			
			var entityField = dj.byId("entity");
			if(dj.byId('product_type').get('value')==="MUPS")
			{	
				misys.animate("fadeOut",dojo.byId("bank_iso_code_div"));
				/*dj.byId("threshold_amt").set("required", false);*/
			}
			//For MUPS / India payments in edit mode these values are being populated and causing 
			//  validation failures and hence setting them as disabled so not to trigger validations. 
			if(dj.byId("product_type") && dj.byId("product_type").get("value") === "MUPS")
			{
				dj.byId('bank_iso_code').disabled='true';
				dj.byId('bank_iso_code_meps').disabled='true';
				dj.byId('bank_bic_code_rtgs').disabled='true';
			}
			if(misys._config.isMultiBank)
			{
				if(dojo.byId(noCustBankAvailableDiv))
				{
					misys.animate("fadeOut", dojo.byId(noCustBankAvailableDiv));
				}
				_populateCustomerBanks(true);
				var customerBankField = dj.byId("customer_bank");
				var customerBankHiddenField = dj.byId("customer_bank_hidden");
				if(customerBankField && customerBankHiddenField)
				{
					customerBankField.set("value", customerBankHiddenField.get("value"));
				}
				_populateProductTypes(true);
				var prodTypeField = dj.byId("product_type");
				var prodTypeHiddenField = dj.byId("product_type_hidden");
				if(prodTypeField && prodTypeHiddenField)
				{
					prodTypeField.set("value", prodTypeHiddenField.get("value"));
				}
			}
			if (dj.byId('product_type').get('value') === "RTGS" || dj.byId('product_type').get('value') === "MEPS"){
					m.toggleFieldsReadOnly(["intermediary_bank_swift_bic_code","intermediary_bank_name","intermediary_bank_address_line_1","intermediary_bank_address_line_2","intermediary_bank_dom","intermediary_bank_country"], false,true);
			}
			m.setCurrency(dj.byId("threshold_cur_code"), ["threshold_amt"]);
			_onLoadBranchAddress();
			if(m._config.swift_allowed){
			misys._populateClearingCodes("beneficiary_bank");
			misys._populateClearingCodes("intermediary_bank");
			misys._populateClearingCodes("ordering_customer");
			misys._populateClearingCodes("beneficiary");
			}
			
			if(dj.byId("entity_size") && parseInt(dj.byId("entity_size").get("value"),10) > 0  && dijit.byId("product_type").get("value") === "")
			{
				var productTypeField	=	dijit.byId("product_type");
					
				productTypeField.set("value", "NONE");
				//Disable product type field if entity is not selected
				if(entityField.get("value") === "")
				{
					productTypeField.set("disabled",true);
				}
			}
			//Show/Hide Product Wise Screen fields
			if (misys._config.isMultiBank){
				_toggleProductScreenFieldsForMultibank(true);
			} 
			else{
				_toggleProductScreenFields();
			}
			//Check if SWIFT validation is enabled for product
			_validateRegexBeneficiary();
			_validateAddressRegexBeneficiary();
			var preApprovedField = dj.byId("pre_approved");
			if(preApprovedField)
			{
				//if logged in user has PAB acess then he will be able to see a check box other wise a hidden text box field
				if(/CheckBox/.test(preApprovedField.declaredClass))
				{
					_toggleThresholdAmount(preApprovedField.get("checked"));
				}
				else if(/TextBox/.test(preApprovedField.declaredClass))
				{
					if(preApprovedField.get("value") === "Y")
					{
						_toggleThresholdAmount(true);
					}
					else
					{
						_toggleThresholdAmount(false);
					}
				}
			}
			else
			{
				_toggleThresholdAmount(false);
			}
			if((dj.byId("pre_approved") && dj.byId("pre_approved").get("checked") &&  dj.byId("threshold_amt") && dj.byId("threshold_cur_code"))){
				m.setCurrency(dj.byId("threshold_cur_code"), ["threshold_amt"]);
				if(dj.byId("threshold_amt").get("value") >= 0)
			    {
					dj.byId("threshold_cur_code").set("required", true);
			    }
				else
				{
					dj.byId("threshold_cur_code").set("required", false);
			    }
			}

			if (dj.byId('product_type').get('value') != "MUPS" && dj.byId('product_type').get('value') != "MEPS" && dj.byId('product_type').get('value') != "RTGS" && dj.byId("bank_iso_code") && dj.byId("bank_iso_code").get("value") !== "")
			{
				m.getSwiftBankDetails(false, "bank_iso_code", "brch_code", null, null, "bank_", true,false,true,"");
				if(dj.byId("bank_iso_code").get("value").length === 0)
				{
					dj.byId("bank_country_btn_img").set("disabled",false);
					
					
				}
				else
				{
					dj.byId("bank_country_btn_img").set("disabled",true);
				}
			}
			
			if (dj.byId('product_type').get('value') === "MEPS" && dj.byId("bank_iso_code_meps") && dj.byId("bank_iso_code_meps").get("value") !== "")
			{
				if(dj.byId("bank_iso_code_meps").get("value").length === 0)
				{
					m.toggleFieldsReadOnly(["bank_name","bank_address_line_1","bank_address_line_2","bank_dom","bank_code_country"], false);
					dj.byId("bank_code_country_btn_img").set("disabled",false);
				}
				else
				{
					m.toggleFieldsReadOnly(["bank_name","bank_address_line_1","bank_address_line_2","bank_dom","bank_code_country"], true);
					dj.byId("bank_code_country_btn_img").set("disabled",true);
				}
			}
			if (dj.byId('product_type').get('value') === "RTGS" && dj.byId("bank_bic_code_rtgs") && dj.byId("bank_bic_code_rtgs").get("value") !== "")
			{
				if(dj.byId("bank_bic_code_rtgs").get("value").length === 0)
				{
					m.toggleFieldsReadOnly(["bank_name","bank_address_line_1","bank_address_line_2","bank_dom","bank_code_country"], false);
					dj.byId("bank_code_country_btn_img").set("disabled",false);
				}
				else
				{
					m.toggleFieldsReadOnly(["bank_name","bank_address_line_1","bank_address_line_2","bank_dom","bank_code_country"], true);
					dj.byId("bank_code_country_btn_img").set("disabled",true);
				}
			}
			
			if(dj.byId('product_type').get('value') === "MEPS" && dj.byId("intermediary_bank_meps_swift_bic_code") && dj.byId("intermediary_bank_meps_swift_bic_code").get("value") !== ""){
				if(	dj.byId("intermediary_bank_meps_swift_bic_code").get("value").length === 0 /*&& (dj.byId("intermediary_bank_meps_name").get("value") !== "" || dj.byId("intermediary_bank_meps_address_line_1").get("value") !== "" || dj.byId("intermediary_bank_meps_country").get("value") !== "")*/)
		    	{
					m.toggleFieldsReadOnly(["intermediary_bank_meps_name","intermediary_bank_meps_address_line_1","intermediary_bank_meps_address_line_2","intermediary_bank_meps_dom","intermediary_bank_meps_country"], false);
					dj.byId("intermediary_bank_meps_country_btn_img").set("disabled", false);
			    }
				else if((dj.byId("intermediary_bank_meps_name").get("value") !== "" || dj.byId("intermediary_bank_meps_address_line_1").get("value") !== "" || dj.byId("intermediary_bank_meps_country").get("value") !== ""))
				{
					m.toggleFieldsReadOnly(["intermediary_bank_meps_name","intermediary_bank_meps_address_line_1","intermediary_bank_meps_address_line_2","intermediary_bank_meps_dom","intermediary_bank_meps_country"], true);
					dj.byId("intermediary_bank_meps_country_btn_img").set("disabled", true);
				}
			}
			if(dj.byId('product_type').get('value') === "RTGS" && dj.byId("intermediary_bank_rtgs_swift_bic_code") && dj.byId("intermediary_bank_rtgs_swift_bic_code").get("value") !== ""){
				if(	dj.byId("intermediary_bank_rtgs_swift_bic_code").get("value").length === 0 /*&& (dj.byId("intermediary_bank_meps_name").get("value") !== "" || dj.byId("intermediary_bank_meps_address_line_1").get("value") !== "" || dj.byId("intermediary_bank_meps_country").get("value") !== "")*/)
		    	{
					m.toggleFieldsReadOnly(["intermediary_bank_rtgs_name","intermediary_bank_rtgs_address_line_1","intermediary_bank_rtgs_address_line_2","intermediary_bank_rtgs_dom","intermediary_bank_rtgs_country"], false);
					dj.byId("intermediary_bank_rtgs_country_btn_img").set("disabled", false);
			    }
				else if((dj.byId("intermediary_bank_rtgs_name").get("value") !== "" || dj.byId("intermediary_bank_rtgs_address_line_1").get("value") !== "" || dj.byId("intermediary_bank_rtgs_country").get("value") !== ""))
				{
					m.toggleFieldsReadOnly(["intermediary_bank_rtgs_name","intermediary_bank_rtgs_address_line_1","intermediary_bank_rtgs_address_line_2","intermediary_bank_rtgs_dom","intermediary_bank_rtgs_country"], true);
					dj.byId("intermediary_bank_rtgs_country_btn_img").set("disabled", true);
				}
			}			
			if (dj.byId('product_type').get('value') !== "RTGS" && dj.byId('product_type').get('value') !== "MEPS" && dj.byId("intermediary_bank_swift_bic_code") && dj.byId("intermediary_bank_swift_bic_code").get("value") !== "")
			{
				m.getSwiftBankDetails(false, "intermediary_bank_swift_bic_code", null, null, "intermediary_bank_", true,false,true,"");
				if(dj.byId("intermediary_bank_swift_bic_code").get("value").length === 0)
				{
					dj.byId("intermediary_bank_country_img").set("disabled",false);
					m.toggleFieldsReadOnly( ["intermediary_bank_name","intermediary_bank_address_line_1","intermediary_bank_address_line_2","intermediary_bank_dom","intermediary_bank_country"], false);
				}
				else
				{
					dj.byId("intermediary_bank_country_img").set("disabled",true);
					m.toggleFieldsReadOnly( ["intermediary_bank_name","intermediary_bank_address_line_1","intermediary_bank_address_line_2","intermediary_bank_dom","intermediary_bank_country"], true);
				}
			}
			
			if (dj.byId("iso_code") && dj.byId("product_type") && dj.byId("product_type").get("value") === "FI202")
			{
				m.getSwiftBankDetails(false, "iso_code", ["counterparty_name", "address_line_1", "address_line_2", "dom", "contact_name", "country"], 
                        ["counterparty_name", "address_line_1", "country"],
                        "", true, false, true, "");
				_enableDisableCounterpartyDetails();
			}
			if(dj.byId("product_type") && dj.byId("product_type").get("value") === "FI202" && dj.byId("account_no").get("value") !== "")
			{
				dj.byId("account_no_mt202").set("value", dj.byId("account_no").get("value"));
			}
			
			var undefString = undefined;
			var nullString = null;
			var emptyString = "";
			console.debug("undef without S: ", undefString == "");
			console.debug("null without S: ", nullString == "");
			console.debug("empty without S: ", emptyString === "");
			console.debug("undef with S: ", "S" + undefString === "S");
			console.debug("null with S: ", "S" + nullString === "S");
			console.debug("empty with S: ", "S" + emptyString === "S");

			console.debug("undef without S: ", undefString != "");
			console.debug("null without S: ", nullString != "");
			console.debug("empty without S: ", emptyString !== "");
			console.debug("undef with S: ", "S" + undefString !== "S");
			console.debug("null with S: ", "S" + nullString !== "S");
			console.debug("empty with S: ", "S" + emptyString !== "S");
			

			

		}, 
		
		setExecuteClientPassBack : function(state)
		{
			m._config.executeClientPassBack = state;
			m.disconnect(m._config.clearbankFieldsHandle);
			m._config.bankIsoCodeOnBlur = false;
		},
		
		beforeSubmitValidations : function() {
		
            if(dj.byId("branch_address") && dj.byId("branch_address").get("checked"))
            { 
                  var field1 = dj.byId("branch_address_line_1");
                  if(!field1 || field1.get("value") === null || field1.get("value") === "")
                  {
                         field1.focus();
                         field1.set("state", "Error");
                         return false;
                  }
                  
            }
            
            var field2 = dj.byId("account_cur_code");

            var val = m._validateCurrencyCode(dj.byId("product_type"),
					dj.byId("account_cur_code"));
            var displayMessage = "";
            if(!val)
            {
				displayMessage = m.getLocalization("invalidCurrencyConfigured", [dj.byId("account_cur_code").get("value")]);
				
                 //  field2.focus();
                   field2.set("state", "Error");
					dj.showTooltip(displayMessage,dj.byId("account_cur_code").domNode, 0);
                   return false;
            }
            
            if(dj.byId("threshold_cur_code"))
            {
            var valThrshold = m._validateCurrencyCode(dj.byId("product_type"),
					dj.byId("threshold_cur_code"));
            if(!valThrshold)
            {
				displayMessage = m.getLocalization("invalidCurrencyConfigured", [dj.byId("threshold_cur_code").get("value")]);
				
                 //  field2.focus();
                   field2.set("state", "Error");
					dj.showTooltip(displayMessage,dj.byId("threshold_cur_code").domNode, 0);
                   return false;
            }
           }
         

           
            
   		 //mailing address validation for TPT
   		 if(dj.byId("product_type") && dj.byId("product_type").get("value") === "TPT")
			{
   		 if(! _validateDescriptionAddress()){
				 return false;
   		 }
			}
        	if(dj.byId("beneficiary_id") && dj.byId("beneficiary_id").get("value") !== "" && !_validateRegexBeneficiaryId())
	        {
        		return false;
	        }
			
        	if(dj.byId("product_type") && dj.byId("product_type").get("value") === "MUPS")
			{
        		 if(dj.byId("bank_ifsc_code") && dj.byId("bank_ifsc_code").get("value") !== "" && (!_validateBankDetails())){
    	    		 return false;
    	    	 }
			}
        	if(dj.byId("product_type") && dj.byId("product_type").get("value") === "MEPS")
			{	
        		if(dj.byId("bank_iso_code_meps") && dj.byId("bank_iso_code_meps").get("value") == "" ){
        			_populateBankDetailsMeps();
   	    		 return false;
        		}
        		 if(dj.byId("bank_bic_code_meps") && dj.byId("bank_bic_code_meps").get("value") !== "" && (!_validateBankDetailsMeps())){
    	    		 return false;
    	    	 }
        		 
        		 if(dj.byId("intermediary_bank_meps_swift_bic_code") && dj.byId("intermediary_bank_meps_swift_bic_code").get("value") !== "" && (!_validateBankInterDetailsMeps())){
    	    		 return false;
    	    	 } 
        		 //branch address onsubmit validations

         		if(dj.byId("branch_address_line_1") && dj.byId("branch_address_line_1").get("value") !== ""  &&	(!_validateBranchAddressRegex(dj.byId("branch_address_line_1")))){
         			 return false;
         		}
         		if(dj.byId("branch_address_line_2") && dj.byId("branch_address_line_2").get("value") !== ""  &&	(!_validateBranchAddressRegex(dj.byId("branch_address_line_2")))){
        			 return false;
        		}
         		
         		 if(dj.byId("branch_dom") && dj.byId("branch_dom").get("value") !== "" && (!_validateBranchAddressRegex(dj.byId("branch_dom")))){
     	    		 return false;
     	    	 }
        		 
			}
        	if(dj.byId("product_type") && dj.byId("product_type").get("value") === "RTGS")
			{
        		if(dj.byId("bank_bic_code_rtgs") && dj.byId("bank_bic_code_rtgs").get("value") == "" ){
        			_populateBankDetailsRtgs();
   	    		 return false;
        		} 
        		if(dj.byId("bank_bic_code_rtgs") && dj.byId("bank_bic_code_rtgs").get("value") !== "" && (!_validateBankDetailsRtgs())){
    	    		 return false;
    	    	 }
        		 
        		 if(dj.byId("intermediary_bank_rtgs_swift_bic_code") && dj.byId("intermediary_bank_rtgs_swift_bic_code").get("value") !== "" && (!_validateBankInterDetailsRtgs())){
    	    		 return false;
    	    	 }
        		 //branch address onsubmit validations

          		if(dj.byId("branch_address_line_1") && dj.byId("branch_address_line_1").get("value") !== ""  &&	(!_validateBranchAddressRegex(dj.byId("branch_address_line_1")))){
          			 return false;
          		}
          		if(dj.byId("branch_address_line_2") && dj.byId("branch_address_line_2").get("value") !== ""  &&	(!_validateBranchAddressRegex(dj.byId("branch_address_line_2")))){
         			 return false;
         		}
          		
          		 if(dj.byId("branch_dom") && dj.byId("branch_dom").get("value") !== "" && (!_validateBranchAddressRegex(dj.byId("branch_dom")))){
      	    		 return false;
      	    	 }

			}
			// Validate Threshold Amount is greater than zero
			var thresholdAmt = dj.byId("threshold_amt") ? dj.byId("threshold_amt") : 0;
			var preApproved = dj.byId("pre_approved");
			var prodTypeField = dijit.byId("product_type");
			var returnValue = false;	
			if((thresholdAmt && preApproved && preApproved.get("checked")) && (!m.validateAmount(thresholdAmt)))
			{
				m._config.onSubmitErrorMsg =  m.getLocalization("amountcannotzero");
				thresholdAmt.set("value","");
			}
			else if(prodTypeField && (prodTypeField.get("value") === "NONE" || prodTypeField.get("value") === ""))
			{
				prodTypeField.set("state","Error");
			}
			else if(_validateIBANCode())
			{
				returnValue = true;
			}
			return returnValue;
		},
		
		
		
		beforeSaveValidations : function(){
			
			var returnValue = true;
			var field = dj.byId("account_cur_code");
			var curcode = field ? field.get("value") : "";
			if ( curcode !="" && !m.validateCurrencyCode(curcode)){
				var errorMessage = misys.getLocalization("invalidCurrencyError",[curcode]);
				field.set("state", "Error");
				dj.hideTooltip(field.domNode);
				dj.showTooltip(errorMessage, field.domNode, 0);
				returnValue = false;
			}
			return returnValue;
		},
		
		/*
		 * Toggle the beneficiary fields to disable/enable
		 * Set Required/not Required accordingly		
		 */
		toggleBeneficiaryFields : function(bicCode, prefix,imgId,isRequired){
			var arr = ["_bank_name", "_bank_address_1", "_bank_dom","_bank_country"];
			var beneId;
			if(bicCode !== ''){
				for	(var index = 0; index < arr.length; index++) {
				    beneId = prefix+arr[index];				    
				    if(dj.byId(beneId)) {				   
					    dj.byId(beneId).set('required', false);
						dj.byId(beneId).set('disabled', true);
						dj.byId(beneId).reset();
						d.query('#'+beneId+"_row label span").style("display", "none");
						d.query('#'+imgId).style("display", "none");
				    }
				} 
			}
			else{
				for	(index = 0; index < arr.length; index++) {
					beneId = prefix+arr[index];				    
				    if(dj.byId(beneId)) {
					    if(isRequired){
				    		 dj.byId(beneId).set('required', true);
				    	}
						dj.byId(beneId).set('disabled', false);
						d.query('#'+beneId+"_row label span").style("display", "inline-block");
						d.query('#'+imgId).style("display", "inline-block");
				    }
				} 
			}
		},
		
		
		
		
		/*
		 * Toggle the BIC fields to disable/enable
		 * Set Required/not Required accordingly		
		 */
		toggleBICFields : function(bankInp, field){
			if(bankInp !== ''){					    
			    if(dj.byId(field)) {
					dj.byId(field).set('disabled', true);
					dj.byId(field).reset();
					 m.toggleRequired(field,false);
			    }
			}
			else{			    
			    if(dj.byId(field)) {
				    dj.byId(field).set('disabled', false);
				    m.toggleRequired(field,true);
			    }
			}
			
			var noRequiredFields = ["inter_bank_swift"];
			d.forEach(noRequiredFields, function(field){
				m.toggleRequired(field,false);
			});
		
		},
		
		showProductBasedListOfBanks : function()
		{
    		misys.setExecuteClientPassBack(true);
    		misys.showSearchDialog("bank","['bank_name', 'bank_address_line_1', 'bank_address_line_2', 'bank_dom', 'bank_iso_code', 'brch_code','bank_contact_name', 'bank_phone', 'bank_country']", {swiftcode: false, bankcode: false}, "", "",searchDialogDimension, m.getLocalization("ListOfBanksTitleMessage"));
		},
		
		showProductBasedListOfBanksforMUPS : function()
		{
    		misys.setExecuteClientPassBack(true);
    		misys.showSearchDialog("ifscCodeMUPS","['bank_ifsc_code', 'bank_ifsc_name', 'bank_ifsc_address_line_1', 'bank_ifsc_address_line_2', 'bank_ifsc_city']", {swiftcode: false, bankcode: false}, "", "",searchDialogDimension, m.getLocalization("ListOfBanksTitleMessage"),"","",true);
		},
		showProductBasedListOfBanksforMeps : function()
		{
    		misys.setExecuteClientPassBack(true);
    		misys.showSearchDialog("bankBicCodeMEPS","[ 'bank_iso_code_meps', 'bank_name', '', 'bank_address_line_1', 'bank_address_line_2', 'bank_dom', 'bank_code_country', 'branch','intermediary_flag']", {swiftcode: false, bankcode: false}, "", "",searchDialogDimension, m.getLocalization("ListOfBanksTitleMessage"),"","",true);
		},
		showIntermediaryBicCodesforMeps : function()
		{
    		misys.setExecuteClientPassBack(true);
    		misys.showSearchDialog("intermediaryBicCodeMEPS","[ 'intermediary_bank_meps_swift_bic_code', 'intermediary_bank_meps_name', 'intermediary_bank_meps_address_line_1', 'intermediary_bank_meps_address_line_2', 'intermediary_bank_meps_dom', 'intermediary_bank_meps_country']", {swiftcode: false, bankcode: false}, "", "",searchDialogDimension, m.getLocalization("ListOfBanksTitleMessage"),"","",true);
		},
		showProductBasedListOfBanksforRTGS : function()
		{
    		misys.setExecuteClientPassBack(true);
    		misys.showSearchDialog("bankBicCodeRTGS","[ 'bank_bic_code_rtgs', 'bank_name', '', 'bank_address_line_1', 'bank_address_line_2', 'bank_dom', 'bank_code_country', 'branch','intermediary_flag']", {swiftcode: false, bankcode: false}, "", "",searchDialogDimension, m.getLocalization("ListOfBanksTitleMessage"),"","",true);
		},
		showIntermediaryBicCodesforRTGS : function()
		{
    		misys.setExecuteClientPassBack(true);

    		misys.showSearchDialog("intermediaryBicCodeRTGS","[ 'intermediary_bank_rtgs_swift_bic_code', 'intermediary_bank_rtgs_name', 'intermediary_bank_rtgs_address_line_1', 'intermediary_bank_rtgs_address_line_2', 'intermediary_bank_rtgs_dom', 'intermediary_bank_rtgs_country']", {swiftcode: false, bankcode: false}, "", "",searchDialogDimension, m.getLocalization("ListOfBanksTitleMessage"),"","",true);

		}
	});

	d.mixin(m._config, {
		
		passBack : function( /*Array*/ arrFieldIds,
		 		   /*Array*/ arrFieldValues, 
		 		   /*Boolean*/ closeParent) {
			
			if(m._config.executeClientPassBack)
			{
				var fields = ["bank_address_line_1","bank_address_line_2","bank_dom"];
				m.toggleFieldsReadOnly(fields,true,false);
			}
			//Lock bank address fields if ISO code selected using lookup
		 }
	});
	
	function enableSwiftValidationForBeneficiary()
	{		
		var products = dj.byId("allowedProducts");
		var productsStr =  products ? dj.byId("allowedProducts").get("value") : '';
		var productTypeId = dj.byId("product_type");
		var productTypeStr =productTypeId ? dj.byId("product_type").get("value") : '';
		
		m._config.forceSWIFTValidation = true;		
		
		if (   (   productTypeId  &&   (    productsStr.indexOf(productTypeStr) < 0   )   ) )
		{
			m._config.screenFields.push("counterparty_name","counterparty_name_2","counterparty_name_3");				   
		}		
	}
	
	
	////Below function checks for the number of email id provided in the benefiaicary_email field should not exceed 10
	function _validateEmailAddr() {
		var email_1 = dj.byId("email_1").get("value");
		var res = email_1.split(";");
		if(res.length > 10){
			dj.byId("email_1").set("value","");
			var errorMessage =  m.getLocalization("checkEmailId");
			dj.byId("email_1").set("state","Error");
			dj.hideTooltip(dj.byId("email_1").domNode);
			dj.showTooltip(errorMessage, dj.byId("email_1").domNode, 0);
		}
	}
	
	function _validateCNAPSBankCode()
	{
		//  summary: 
		//  If bank code and branch code both are populated then validate bank branch code
		var bank_code_field	=	dj.byId("cnaps_bank_code"),
			bank_name_field	=	dj.byId("cnaps_bank_name"),
			subProdID       =   dj.byId("product_type").get("value"),
			displayMessage  = 	"";
		
//		if (subProdID)
//		{
//			if (subProdID === "HVPS"){
//				bank_code_field	=	dj.byId("cnaps_bank_code");
//			} else {
//				bank_code_field	=	dj.byId("cnaps_bank_code");
//			}
//		}
		
		if(bank_code_field)
		{
			if(!(bank_code_field.get("value") === ""))
			{
				m.xhrPost( {
					url 		: misys.getServletURL("/screen/AjaxScreen/action/ValidateCNAPSBankCode") ,
					handleAs 	: "json",
					sync 		: true,
					content 	: {
						cnaps_bank_code : bank_code_field.get("value"),
						sub_product_code: subProdID
					},
					load : function(response, args){
						if (response.items.valid === false)
						{
							displayMessage = misys.getLocalization("invalidCNAPSBankCode", [bank_code_field.get("value")]);
							//focus on the widget and set state to error and display a tooltip indicating the same
							//bank_code_field.focus();
							bank_name_field.set("value","");
							bank_code_field.set("value","");
							bank_code_field.set("state","Error");
							dj.hideTooltip(bank_code_field.domNode);
							dj.showTooltip(displayMessage, bank_code_field.domNode, 0);
						}
						else
						{
							console.debug("Validated CNAPS Bank Code");
							bank_name_field.set("value", response.items.bankName);
						}
					},
					error 		: function(response, args){
						console.error("[Could not validate CNAPS Bank Code] "+ bank_code_field.get("value"));
						console.error(response);
					}
				});
			}
			else
			{
				bank_name_field.set("value", "");
				bank_code_field.set("value", "");
			}
		}
	}
	
	/**
	 * Open a popup to select a cnaps bank code
	 */
	function _cnapBankCodeButtonHandler()
	{
		var subProdID       =   dj.byId("product_type").get("value");
		var type_field	=	"";
		
		if (subProdID)
		{
			if (subProdID === "HVPS"){
				type_field	=	"cnaps_domestic_bank_code";
			} else {
				type_field	=	"cnaps_crossborder_bank_code";
			}
		}
		
		m.showSearchDialog(type_field, 
				"['cnaps_bank_code','cnaps_bank_name']", "", 
				"AjaxScreen/action/GetStaticDataPopup", "", 
				searchDialogDimension, m.getLocalization("ListOfBanksTitleMessage"),'', 'GetStaticData', false, 'GetStaticData');
		
	}
	
	
	d.ready(function(){
			m._config = (m._config) || {};
			m._config.forceSWIFTValidation = true;
			m._config.clearScreenFields = true;
			m._config.executeClientPassBack = false;
			m._config.clearbankFieldsHandle;
			m._config.accountNoIBANValidationHandle;
			m._config.bankIsoCodeOnBlur = false;
			m._config.clearOnSecondCall = false;
			m._config.screenFields = m._config.screenFields || [];
			m._config.screenFields.push("bank_iso_code","address_line_1","bank_ifsc_code","bank_ifsc_address_line_1","bank_ifsc_address_line_2");
			m._config.screenFields.push("address_line_2","address_line_3","dom","account_cur_code","account_no","account_no","iso_code","bank_code", "swift_charges_type");
			m._config.screenFields.push("bank_name","bank_address_line_1","bank_address_line_2","bank_dom","bank_country", freeFormatSettlementPayment,"counterparty_name_2","counterparty_name_3");
		    m._config.screenFields.push("branch_name","branch_address","branch_address_line_1","branch_address_line_2","branch_dom","brch_code","pre_approved","account_with_institution", preApprovedBeneId);
		    m._config.screenFields.push("bank_routing_no", "ordering_customer_name", "ordering_customer_address_1","ordering_customer_address_2", "ordering_customer_dom", "ordering_customer_country", "order_customer_act_no", freeFormatSettlementAdditional,"counterparty_nickname","bene_details_clrc","order_details_clrc","beneficiary_bank_clrc","inter_bank_clrc","inter_bank_address_2");
		    m._config.screenFields.push("bank_ifsc_name","bank_ifsc_city");
		    m._config.screenFields.push("bank_iso_code_meps","bank_bic_code_rtgs","bank_code_country","beneficiary_cntry_country","intermediary_bank_rtgs_country","intermediary_bank_meps_country");

		    //Back Office Fields
			m._config.screenFields.push("bo_account_id","bo_account_type","bo_account_currency","bo_branch_code","bo_product_type");
			
			//Addendum Fields
			m._config.screenFields.push("mailing_name","mailing_address_line_1","mailing_address_line_2","mailing_address_line_3","mailing_address_line_4","mailing_address_line_5","mailing_address_line_6","postal_code","beneficiary_country","email_1","email_2","fax","phone","bene_details_postal_code","bene_details_country");

			enableSwiftValidationForBeneficiary();
			m._config.productTypes = m._config.productTypes || [];

			//Declaring all product type arrays
			m._config.productTypes["NONE"] = m._config.productTypes["NONE"] || [];
			m._config.productTypes["NONE"].mandatory = m._config.productTypes["NONE"].mandatory || [];
			m._config.productTypes["NONE"].swift = m._config.productTypes["NONE"].swift || [];

			m._config.productTypes["TPT"] = m._config.productTypes["TPT"] || [];
			m._config.productTypes["TPT"].mandatory = m._config.productTypes["TPT"].mandatory || [];
			m._config.productTypes["TPT"].swift = m._config.productTypes["TPT"].swift || [];

			m._config.productTypes["DOM"] = m._config.productTypes["DOM"] || [];
			m._config.productTypes["DOM"].mandatory = m._config.productTypes["DOM"].mandatory || [];
			m._config.productTypes["DOM"].swift = m._config.productTypes["DOM"].swift || [];

			m._config.productTypes["MT101"] = m._config.productTypes["MT101"] || [];
			m._config.productTypes["MT101"].mandatory = m._config.productTypes["MT101"].mandatory || [];
			m._config.productTypes["MT101"].swift = m._config.productTypes["MT101"].swift || [];
			
			m._config.productTypes["MT103"] = m._config.productTypes["MT103"] || [];
			m._config.productTypes["MT103"].mandatory = m._config.productTypes["MT103"].mandatory || [];
			m._config.productTypes["MT103"].swift = m._config.productTypes["MT103"].swift || [];

			m._config.productTypes["FI103"] = m._config.productTypes["FI103"] || [];
			m._config.productTypes["FI103"].mandatory = m._config.productTypes["FI103"].mandatory || [];
			m._config.productTypes["FI103"].swift = m._config.productTypes["FI103"].swift || [];

			m._config.productTypes["FI202"] = m._config.productTypes["FI202"] || [];
			m._config.productTypes["FI202"].mandatory = m._config.productTypes["FI202"].mandatory || [];
			m._config.productTypes["FI202"].swift = m._config.productTypes["FI202"].swift || [];
			
			m._config.productTypes["DD"] = m._config.productTypes["DD"] || [];
			m._config.productTypes["DD"].mandatory = m._config.productTypes["DD"].mandatory || [];
			m._config.productTypes["DD"].swift = m._config.productTypes["DD"].swift || [];
			
			m._config.productTypes["TTPT"] = m._config.productTypes["TTPT"] || [];
			m._config.productTypes["TTPT"].mandatory = m._config.productTypes["TTPT"].mandatory || [];
			m._config.productTypes["TTPT"].swift = m._config.productTypes["TTPT"].swift || [];
			
			m._config.productTypes["TRSRY"] = m._config.productTypes["TRSRY"] || [];
			m._config.productTypes["TRSRY"].mandatory = m._config.productTypes["TRSRY"].mandatory || [];
			m._config.productTypes["TRSRY"].swift = m._config.productTypes["TRSRY"].swift || [];
			
			m._config.productTypes["TRSRYFXFT"] = m._config.productTypes["TRSRYFXFT"] || [];
			m._config.productTypes["TRSRYFXFT"].mandatory = m._config.productTypes["TRSRYFXFT"].mandatory || [];
			m._config.productTypes["TRSRYFXFT"].swift = m._config.productTypes["TRSRYFXFT"].swift || [];

			m._config.productTypes["MUPS"] = m._config.productTypes["MUPS"] || [];
			m._config.productTypes["MUPS"].mandatory = m._config.productTypes["MUPS"].mandatory || [];
			m._config.productTypes["MUPS"].swift = m._config.productTypes["MUPS"].swift || [];
			
			m._config.screenFields.push("cnaps_bank_code", "mailing_address","cnaps_bank_name");
			m._config.screenFields.push("bank_ifsc_code","bank_ifsc_address_line_1","bank_ifsc_address_line_2");
			m._config.screenFields.push("bank_ifsc_name","bank_ifsc_city");
      	
			m._config.productTypes["HVPS"] = m._config.productTypes["HVPS"]	|| [];
			m._config.productTypes["HVPS"].mandatory = m._config.productTypes["HVPS"].mandatory	|| [];
			m._config.productTypes["HVPS"].swift = m._config.productTypes["HVPS"].swift	|| [];

			m._config.productTypes["HVPS"].push("counterparty_name","account_no", "account_cur_code", "cnaps_bank_code","cnaps_bank_name", "pre_approved", "active_flag",preApprovedBeneId);
			m._config.productTypes["HVPS"].push("payee_ref", "cust_ref","description", "mailing_name","mailing_address","postal_code", "beneficiary_country", "email_1","email_2", "fax", "phone","counterparty_nickname");
			m._config.productTypes["HVPS"].mandatory.push("counterparty_name", "account_no","cnaps_bank_code"); // Do not give account_cur_code as mandatory as this is not placed in {field_name}_Div as any other fields

			m._config.productTypes["HVXB"] = m._config.productTypes["HVXB"]	|| [];
			m._config.productTypes["HVXB"].mandatory = m._config.productTypes["HVXB"].mandatory	|| [];
			m._config.productTypes["HVXB"].swift = m._config.productTypes["HVXB"].swift	|| [];

			m._config.productTypes["HVXB"].push("counterparty_name","account_no", "account_cur_code", "cnaps_bank_code","cnaps_bank_name", "pre_approved", "active_flag",preApprovedBeneId);
			m._config.productTypes["HVXB"].push("payee_ref", "cust_ref","description", "mailing_name","mailing_address", "postal_code", "beneficiary_country", "email_1","email_2", "fax", "phone","counterparty_nickname");
			m._config.productTypes["HVXB"].mandatory.push("counterparty_name", "account_no", "cnaps_bank_code"); // Do not give account_cur_code as mandatory as this is not placed in {field_name}_Div as any other fields
		
			m._config.productTypes["MEPS"] = m._config.productTypes["MEPS"] || [];
			m._config.productTypes["MEPS"].mandatory = m._config.productTypes["MEPS"].mandatory || [];
			m._config.productTypes["MEPS"].swift = m._config.productTypes["MEPS"].swift || [];
			
			m._config.productTypes["RTGS"] = m._config.productTypes["RTGS"] || [];
			m._config.productTypes["RTGS"].mandatory = m._config.productTypes["RTGS"].mandatory || [];
			m._config.productTypes["RTGS"].swift = m._config.productTypes["RTGS"].swift || [];
			
			m._config.productTypes["TPT"].push("counterparty_name","account_no","account_cur_code","pre_approved","active_flag", preApprovedBeneId);
			m._config.productTypes["TPT"].push("payee_ref","cust_ref","description","mailing_name","mailing_address_line_1","mailing_address_line_2","mailing_address_line_3","mailing_address_line_4","mailing_address_line_5","mailing_address_line_6","postal_code","beneficiary_country","email_1","email_2","fax","phone");
			m._config.productTypes["TPT"].mandatory.push("counterparty_name","account_no"); //Do not give account_cur_code as mandatory as this is not placed in {field_name}_Div as any other fields
			m._config.productTypes["TPT"].swift.push("counterparty_name","account_no");
			
			m._config.productTypes["MUPS"].push("counterparty_name","account_no","account_cur_code","bank_ifsc_code","bank_ifsc_name","bank_ifsc_address_line_1","bank_ifsc_address_line_2","bank_ifsc_city","pre_approved", preApprovedBeneId);
			m._config.productTypes["MUPS"].push("payee_ref","cust_ref","description","mailing_name","mailing_address","postal_code","beneficiary_country","email_1","email_2","fax","phone","counterparty_nickname");
			m._config.productTypes["MUPS"].mandatory.push("counterparty_name","account_no","account_cur_code","bank_ifsc_code","bank_ifsc_name"); //Do not give account_cur_code as mandatory as this is not placed in {field_name}_Div as any other fields
			m._config.productTypes["MUPS"].swift.push("counterparty_name","account_no");

			m._config.productTypes["MEPS"].push("counterparty_name","account_no","account_cur_code","active_flag","address_line_1","address_line_2","dom","bank_iso_code_meps","brch_code","bank_name","bank_address_line_1","bank_address_line_2","bank_dom","bank_code_country","branch_address","branch_address_line_1","branch_address_line_2","branch_dom","pre_approved","email_1","email_2","fax","phone", preApprovedBeneId,"intermediary_bank_swift_bic_code_meps","intermediary_bank_name","intermediary_bank_address_line_1","intermediary_bank_address_line_2","intermediary_bank_dom","intermediary_bank_country","counterparty_nickname");
			m._config.productTypes["MEPS"].mandatory.push("counterparty_name","account_no","account_cur_code","address_line_1","address_line_2", "dom","bank_name","bank_address_line_1","bank_code_country","beneficiary_cntry_country","bank_iso_code_meps");
			m._config.productTypes["MEPS"].swift.push("counterparty_name", "address_line_1", "address_line_2", "dom", "account_no", "bank_iso_code_meps", "brch_code","bank_name", "bank_address_line_1","bank_address_line_2","bank_dom","bank_code_country","branch_address","branch_address_line_1","branch_address_line_2", "branch_dom");

			m._config.productTypes["RTGS"].push("counterparty_name","account_no","account_cur_code","active_flag","address_line_1","address_line_2","dom","bank_bic_code_rtgs","brch_code","bank_name","bank_address_line_1","bank_address_line_2","bank_dom","bank_code_country","branch_address","branch_address_line_1","branch_address_line_2","branch_dom","pre_approved","email_1","email_2","fax","phone", preApprovedBeneId,"intermediary_bank_swift_bic_code_rtgs","intermediary_bank_name","intermediary_bank_address_line_1","intermediary_bank_address_line_2","intermediary_bank_dom","intermediary_bank_country","bene_country","counterparty_nickname");
			m._config.productTypes["RTGS"].mandatory.push("counterparty_name","account_no","account_cur_code","address_line_1","address_line_2", "dom","bank_name","bank_address_line_1","bank_code_country","beneficiary_cntry_country","bank_bic_code_rtgs");
			m._config.productTypes["RTGS"].swift.push("counterparty_name", "address_line_1", "address_line_2", "dom", "account_no", "bank_bic_code_rtgs", "brch_code","bank_name", "bank_address_line_1","bank_address_line_2","bank_dom","bank_code_country","branch_address","branch_address_line_1","branch_address_line_2", "branch_dom");

			m._config.productTypes["DOM"].push("counterparty_name","account_no", "account_cur_code","bank_code","brch_code","bank_name","branch_name","pre_approved", preApprovedBeneId);
			m._config.productTypes["DOM"].push("mailing_name","mailing_address_line_1","mailing_address_line_2","mailing_address_line_3","mailing_address_line_4","mailing_address_line_5","mailing_address_line_6","postal_code","beneficiary_country","email_1","email_2","fax","ivr","phone","counterparty_nickname");
			m._config.productTypes["DOM"].mandatory.push("counterparty_name","account_no","bank_code","brch_code","bank_name","branch_name");
			m._config.productTypes["DOM"].swift.push("counterparty_name","account_no");

			m._config.productTypes["MT101"].push("counterparty_name","account_no","address_line_1","address_line_2","dom","bank_iso_code","bank_name","bank_address_line_1","bank_address_line_2","bank_dom","bank_country","branch_address","branch_address_line_1","branch_address_line_2","branch_dom","pre_approved","email_1","email_2","fax","phone", preApprovedBeneId,"intermediary_bank_swift_bic_code","intermediary_bank_name","intermediary_bank_address_line_1","intermediary_bank_address_line_2","intermediary_bank_dom","intermediary_bank_country","intermediary_bank_clearing_code","intermediary_bank_clearing_code_desc","counterparty_nickname");
			m._config.productTypes["MT101"].mandatory.push("counterparty_name","account_no","address_line_1","bank_name","bank_address_line_1","bank_country");

			m._config.productTypes["MT103"].push("counterparty_name","account_no","active_flag","address_line_1","address_line_2","dom","bank_iso_code","brch_code","bank_name","bank_address_line_1","bank_address_line_2","bank_dom","bank_country","branch_address","branch_address_line_1","branch_address_line_2","branch_dom","pre_approved","email_1","email_2","fax","phone", preApprovedBeneId,"intermediary_bank_swift_bic_code","intermediary_bank_name","intermediary_bank_address_line_1","intermediary_bank_address_line_2","intermediary_bank_dom","intermediary_bank_country","intermediary_bank_clearing_code","intermediary_bank_clearing_code_desc","counterparty_nickname");
			m._config.productTypes["MT103"].mandatory.push("counterparty_name","account_no","address_line_1","bank_name","bank_address_line_1","bank_country","bank_iso_code");
			m._config.productTypes["MT103"].swift.push("counterparty_name", "address_line_1", "address_line_2", "dom", "account_no", "bank_iso_code", "brch_code","bank_name", "bank_address_line_1","bank_address_line_2","bank_dom","bank_country","branch_address","branch_address_line_1","branch_address_line_2", "branch_dom");
		
			m._config.productTypes["FI103"].push("counterparty_name","account_no","active_flag","address_line_1","address_line_2","dom","bank_iso_code","bank_name","bank_address_line_1","bank_address_line_2","bank_dom","bank_country","branch_address","branch_address_line_1","branch_address_line_2","branch_dom","pre_approved","email_1",preApprovedBeneId,"email_2","fax","phone","intermediary_bank_swift_bic_code","intermediary_bank_name","intermediary_bank_address_line_1","intermediary_bank_address_line_2","intermediary_bank_dom","intermediary_bank_country","intermediary_bank_clearing_code","intermediary_bank_clearing_code_desc","counterparty_nickname");
			m._config.productTypes["FI103"].mandatory.push("counterparty_name","account_no","address_line_1","bank_name","bank_address_line_1","bank_country");
			m._config.productTypes["FI103"].swift.push("counterparty_name", "address_line_1", "address_line_2", "dom", "account_no");

			m._config.productTypes["FI202"].push("counterparty_name","bank_iso_code","account_no","address_line_1","address_line_2","dom","iso_code","bank_name","bank_address_line_1","bank_address_line_2",preApprovedBeneId,"bank_dom","bank_country","pre_approved","account_with_institution","email_1","email_2","fax","phone","intermediary_bank_swift_bic_code","intermediary_bank_name","intermediary_bank_address_line_1","intermediary_bank_address_line_2","intermediary_bank_dom","intermediary_bank_country","intermediary_bank_clearing_code","intermediary_bank_clearing_code_desc","counterparty_nickname");
			m._config.productTypes["FI202"].mandatory.push("counterparty_name","account_no","address_line_1","bank_name","bank_address_line_1","bank_country");
			m._config.productTypes["FI202"].swift.push("counterparty_name", "address_line_1", "address_line_2", "dom", "account_no", "bank_name", "bank_address_line_1", "bank_address_line_2", "bank_dom");

			m._config.productTypes["DD"].push("counterparty_name","counterparty_name_2","counterparty_name_3","address_line_1","address_line_2","address_line_3","dom","pre_approved", preApprovedBeneId);
			m._config.productTypes["DD"].push("mailing_name","mailing_address_line_1","mailing_address_line_2","mailing_address_line_3","mailing_address_line_4","mailing_address_line_5","mailing_address_line_6","postal_code","beneficiary_country","email_1","email_2","fax","phone","bene_details_postal_code","bene_details_country","counterparty_nickname");
			m._config.productTypes["DD"].mandatory.push("counterparty_name","address_line_1");
			
			m._config.productTypes["TTPT"].push("counterparty_name","account_no","address_line_1","address_line_2","address_line_3","dom","pre_approved","account_cur_code");
			m._config.productTypes["TTPT"].push("email_1","email_2","phone","bene_details_postal_code","bene_details_country", preApprovedBeneId,"counterparty_nickname");
			m._config.productTypes["TTPT"].mandatory.push("counterparty_name","account_no");
			
			m._config.productTypes["TRSRY"].push("counterparty_name","account_no","address_line_1","address_line_2","dom","account_cur_code","bank_iso_code","bank_name","bank_address_line_1","bank_country","branch_name", freeFormatSettlementAdditional);
			m._config.productTypes["TRSRY"].push("email_1","email_2","phone","bene_details_country","swift_charges_type", "bank_routing_no", "order_cust_act_no", "swift_charges_type_1","bank_dom", "swift_charges_type_2", "swift_charges_type_3", "ordering_customer_name", "ordering_customer_address_1", "ordering_customer_dom", "ordering_customer_country", "order_customer_act_no", freeFormatSettlementPayment,"counterparty_nickname");
			m._config.productTypes["TRSRY"].mandatory.push("counterparty_name","account_no","bene_details_country", "dom","address_line_1","bank_country",  "bank_name", "bank_dom");
			
			m._config.productTypes["TRSRYFXFT"].push("counterparty_name","account_no","address_line_1","address_line_2","dom","account_cur_code","bank_iso_code","bank_name","bank_address_line_1","bank_country","bene_details_clrc","order_details_clrc","beneficiary_bank_clrc","inter_bank_clrc","branch_name", freeFormatSettlementAdditional,"inter_bank_address_2");
			m._config.productTypes["TRSRYFXFT"].push("email_1","email_2","phone","bene_details_country","swift_charges_type", "bank_routing_no", "order_cust_act_no", "swift_charges_type_1","bank_dom", "swift_charges_type_2", "swift_charges_type_3", "ordering_customer_name", "ordering_customer_address_1","ordering_customer_address_2", "ordering_customer_dom", "ordering_customer_country", "order_customer_act_no", freeFormatSettlementPayment,"counterparty_nickname");
			m._config.productTypes["TRSRYFXFT"].mandatory.push("counterparty_name","account_no","bene_details_country", "dom","address_line_1","bank_country",  "bank_name", "bank_dom");
			
	});

})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.system.beneficiary_master_mc_client');