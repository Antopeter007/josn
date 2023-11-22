dojo.provide("misys.binding.system.bank_beneficiary");

dojo.require("misys.grid._base");
dojo.require("dojo.data.ItemFileReadStore");
dojo.require("dijit.layout.TabContainer");
dojo.require("dojox.grid.DataGrid");
dojo.require("misys.form.common");
dojo.require("misys.validation.common");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.CheckBox");
dojo.require("dijit.layout.ContentPane");
dojo.require("dojo.data.ItemFileReadStore");
dojo.require("dijit.layout.TabContainer");
dojo.require("misys.validation.login");
dojo.require("misys.openaccount.FormOpenAccountEvents");
dojo.require("misys.validation.password");
dojo.require("misys.form.MultiSelect");

(function(/* Dojo */d, /* Dijit */dj, /* Misys */m)
{
	var chkCounterPartyAction = m.getServletURL("/screen/AjaxScreen/action/CheckExistingCounterpartyProgramAssociationAction");
	var counterpartyMSG = "Counterparty Program Association validated";
	"use strict"; // ECMA5 Strict Mode
	
	m._config.onLoadShowBenExistingMsg = true;
	
	m._config.markPrtryIdFieldAsDisabled = false;

	function _toggleProductFields(/* Boolean */keepValues)
	{
		var counterpartyProducts = d.byId("counterparty-products"), isChecked = dj.byId(
				"notification_enabled").get("checked"), fieldIds = [];

		if (isChecked)
		{
			m.animate("fadeIn", counterpartyProducts);
		} else
		{
			m.animate("fadeOut", counterpartyProducts);
		}

		d.query("[id*='counterparty_permission_']").query('[id]').forEach(function(field)
		{
			fieldIds.push(field.id);
		});
		m.toggleFields(isChecked, fieldIds, null, keepValues);
	}
	/**
	 * <h4>Summary:</h4>
	 * This method checks the account field and throws an error if its empty. 
	 */
	function _validateAccountField()
	{
		var accountField = dj.byId("account");
		if(accountField && accountField.get('value') === "")
		{
			accountField.set("state","Error");
			dj.showTooltip(m.getLocalization("mandatoryAcctNumberMessage"), accountField.domNode, 0);
			var hideTT = function()
			{
				dj.hideTooltip(accountField.domNode);
			};	
			setTimeout(hideTT, 4500);
		}	
	}

	function _hideOpenAccountFields()
	{
		var openAccountFieldsFormDiv = d.byId("open_account_fields_div");
		var	fscmEnabled = dj.byId("fscm_enabled");
		
		
		var	resetPasswordField = dj.byId("reset_password");
		// Hide div fields
		if (fscmEnabled && fscmEnabled.get("checked"))
		{
			if (openAccountFieldsFormDiv)
			{
				m.animate("fadeIn", openAccountFieldsFormDiv);
				_clearOpenAccountFields(false, true);
			}
			if (resetPasswordField)
			{
				// todo e2eeeabled flag check
				var password_valueField = dj.byId("password_value");
				var password_confirmField = dj.byId("password_confirm");
				if (resetPasswordField.get("checked") && password_valueField && password_confirmField)
				{
					password_valueField.set("disabled", false);
					password_confirmField.set("disabled", false);
					m.toggleRequired("password_value", true);
					m.toggleRequired("password_confirm", true);
				} 
				else if (password_valueField && password_confirmField)
				{
					password_valueField.set("value", "");
					password_confirmField.set("value", "");
					password_valueField.set("disabled", true);
					password_confirmField.set("disabled", true);
					m.toggleRequired("password_value", false);
					m.toggleRequired("password_confirm", false);
				}
			}
			// country is mandatory when fscm prgam is used
			m.toggleRequired("_country", true);
		}
		else
		{
			if (openAccountFieldsFormDiv)
			{
				m.animate("fadeOut", openAccountFieldsFormDiv);
				_clearOpenAccountFields(true, false);
			}
			// resetPasswordField.set("checked",false);
			// country is not mandatory when fscm prgam is not used
			m.toggleRequired("_country", false);
		}
	}
	
	function _clearOpenAccountFields(isClear, isReadOnly)
	{
		// Summary:
		// Clears all the open accounts fields if all the open account related
		// check boxes are un-checked
		var fields = [ "erp_id", "legal_id_no", "account", "bank_iso_code", "bank_name",
				"bank_address_line_1", "bank_address_line_2", "bank_dom", "account_type" ];
		d.forEach(fields, function(fieldName)
		{
			var fieldObj = dj.byId(fieldName);
			if (fieldObj)
			{
				if (fieldName !== "bank_address_line_2" && fieldName !== "bank_dom" && fieldName !== "erp_id" && fieldName !== "legal_id_no" && fieldName !== "bank_iso_code" && fieldName !== "account_type")
				{
					m.toggleRequired(fieldName, isReadOnly);
				}
				if (isClear)
				{
					fieldObj.set("value", "");
				}
			}
		});
	}
	
		/**
		 * <h4>Summary:</h4>
		 * This function is to validate if Program Counterparty Association already exist in DataBase
		 * <h4>Description:</h4> 
		 * Have an AJAX call inside it
		 * @method _counterpartyAssociationCheck
		 * 
		 */
		function _counterpartyAssociationCheck()
		{
				var fscmEnabled;
				fscmEnabled = dj.byId("fscm_enabled");
				
				var beneficiaryId = dj.byId("beneficiary_id").get('value');
				
				if(fscmEnabled !== "" && !fscmEnabled.get("checked")) 
				{
					m.xhrPost( {
						url : chkCounterPartyAction,
						handleAs 	: "json",
						sync 		: true,
						content : {
							beneficiaryId : beneficiaryId	
						},
						load : _showExistingProgramCounterpartyAssociationRefMsg
					});
				}
	}
		
		/**
		 * <h4>Summary:</h4>
		 * This function is to display a tooltip message if Program-Counterparty Association already exists in the database,
		 * telling the user he/she can not modify the counterparty.
		 * <h4>Description:</h4> 
		 * If Invoice reference already exists show tool tip and recheck the fscm_enabled checkbox.
		 * @param {Object} response
		 * @method _showExistingInvoiceRefMsg
		 */
		function _showExistingProgramCounterpartyAssociationRefMsg(response){
			
			console.debug("[Validate] Validating Program Counterparty Association");
			
			var field=null;
			if(dj.byId("fscm_enabled"))
			{
				field = dj.byId("fscm_enabled");
			}
			var displayMessage = '';
				if(response.items.valid === false)
				{
					console.debug(" invalid");
					displayMessage = m.getLocalization("counterpartyProgramAssociationExists");
					if(null != field){
						field.focus();
						field.set("checked", true);
						dj.showTooltip(displayMessage,field.domNode,0);
						setTimeout(function(){
							dj.hideTooltip(field.domNode);
							}, 4000);						}
				}else
				{
					console.debug(counterpartyMSG);
				}
		}
		
		/**
		 * <h4>Summary:</h4>
		 * If Counterparty is linked to any program, buyer role cannot be disabled.
		 * <h4>Description:</h4> 
		 * Have an AJAX call inside it
		 * @method _checkIfBuyerRoleCanBeDisabled
		 * 
		 */
		function _checkIfBuyerRoleCanBeDisabled()
		{
			console.debug("[Start] Validating if Buyer Role can be disabled.");
				var buyerRole = dj.byId("buyer_role");
				
				var beneficiaryId = dj.byId("beneficiary_id").get('value');
				
				if(buyerRole && !buyerRole.get("checked")) 
				{
					m.xhrPost( {
						url : chkCounterPartyAction,
						handleAs 	: "json",
						sync 		: true,
						content : {
							beneficiaryId : beneficiaryId	
						},
						load : _showBuyerRoleMsg
					});
				}
				console.debug("[End] Validating if Buyer Role can be disabled.");
	}
		
		/**
		 * <h4>Summary:</h4>
		 * This function is to display a tooltip message if Program-Counterparty Association already exists in the database
		 * 
		 * <h4>Description:</h4> 
		 * If Counterparty is linked to any program, buyer role cannot be disabled.
		 * @param {Object} response
		 * @method _showBuyerRoleMsg
		 */
		function _showBuyerRoleMsg(response)
		{
			var field=null;
			if(dj.byId("buyer_role"))
			{
				field = dj.byId("buyer_role");
			}
			var displayMessage = '';
				if(response.items.valid === false)
				{
					console.debug("Buyer Role cannot be disabled.");
					displayMessage = m.getLocalization("buyerRoleDisableMsg");
					if(null != field){
						field.focus();
						field.set("checked",true);
						dj.showTooltip(displayMessage,field.domNode,0);
						setTimeout(function(){
							dj.hideTooltip(field.domNode);
							}, 4000);
						}
				}
				else
				{
					console.debug(counterpartyMSG);
				}
				
		}
		
		/**
		 * <h4>Summary:</h4>
		 * If Counterparty is linked to any program, seller role cannot be disabled.
		 * <h4>Description:</h4> 
		 * Have an AJAX call inside it
		 * @method _checkIfSellerRoleCanBeDisabled
		 * 
		 */
		function _checkIfSellerRoleCanBeDisabled()
		{
			console.debug("[Start] Validating if Seller Role can be disabled.");
				var sellerRole = dj.byId("seller_role");
				
				var beneficiaryId = dj.byId("beneficiary_id").get('value');
				
				if(sellerRole && !sellerRole.get("checked")) 
				{
					m.xhrPost( {
						url : chkCounterPartyAction,
						handleAs 	: "json",
						sync 		: true,
						content : {
							beneficiaryId : beneficiaryId	
						},
						load : _showSellerRoleMsg
					});
				}
				console.debug("[End] Validating if Seller Role can be disabled.");
		}
		
		/**
		 * <h4>Summary:</h4>
		 * This function is used to display a message that seller role cannot be disabled, if counterparty is associated to any program.
		 * 
		 * <h4>Description:</h4> 
		 * If Counterparty is linked to any program, seller role cannot be disabled.
		 * @param {Object} response
		 * @method _showSellerRoleMsg
		 */
		function _showSellerRoleMsg(response){
			var field=null;
			if(dj.byId("seller_role"))
			{
				field = dj.byId("seller_role");
			}
			var displayMessage = '';
				if(response.items.valid === false)
				{
					console.debug("Seller Role cannot be disabled.");
					displayMessage = m.getLocalization("sellerRoleDisableMsg");
					if(null != field){
						field.focus();
						field.set("checked",true);
						dj.showTooltip(displayMessage,field.domNode,0);
						setTimeout(function(){
							dj.hideTooltip(field.domNode);
							}, 4000);
						}
				}else
				{
					console.debug(counterpartyMSG);
				}
		}
	
	/**
	 * TMA fields are MutuallyExclusive on FSCM and CreditNote and CounterpartyCollaboration fields.
	 * This method resolves the conflict between FSCM and Proprietary-id fields.
	 *  
	 * @param {Boolean} makePrtryIdEmpty
	 * @method _resolveTMAFields
	 */
	function _resolveTMAFields(makePrtryIdEmpty){
		var tmaPropIdTypeFlag = dj.byId("prtry_id_type_flag");
		var tmaPropIdType = dj.byId("prtry_id_type");
		var isThisSubmitProcess = makePrtryIdEmpty;

		if(tmaPropIdTypeFlag && tmaPropIdType){
		
			var cptyCollabFlag = dj.byId("access_opened");
			var	fscmEnabled = dj.byId("fscm_enabled");
			var isAnyOneChecked = ((fscmEnabled && fscmEnabled.get("checked")) || (cptyCollabFlag && cptyCollabFlag.get("checked")));

			if(isThisSubmitProcess && isAnyOneChecked)
			{
				tmaPropIdType.set("required", false);
				tmaPropIdType.set("value", "");
			}
			
			if(isAnyOneChecked){
				
				// Moving if blocks up-and-down differs the behaviour.
				if(tmaPropIdTypeFlag.get("checked") && !tmaPropIdTypeFlag.get("disabled"))
				{
					tmaPropIdType.set("required", false);
					tmaPropIdType.set("value", "");
				}
				
				tmaPropIdTypeFlag.set("checked", false);
				tmaPropIdTypeFlag.set("disabled", true);
			}
			else if(tmaPropIdType.get("value")){
				
				tmaPropIdTypeFlag.set("checked", true);
				if(m._config.markPrtryIdFieldAsDisabled){
					tmaPropIdTypeFlag.set("disabled", true);
				}
				else{
					tmaPropIdTypeFlag.set("disabled", false);
				}
				
			}
			else{
				tmaPropIdTypeFlag.set("checked", false);
				tmaPropIdTypeFlag.set("disabled", false);
			}
		}
	}
	
	function _checkConfirmPassword(){
		m.checkConfirmPassword("password_value","password_confirm");
	}
	
	/**
	 * When FSCM Enabled flag is unchecked, credit note, buyer and seller role flag s should be disabled by default.
	 * 
	 * @method _toggleCheckBoxFields
	 */
	function _toggleCheckBoxFields(){
		var fscmEnabled = dj.byId("fscm_enabled");
		var creditNoteEnabled = dj.byId("credit_note_enabled");
		var buyerRole = dj.byId("buyer_role");
		var sellerRole = dj.byId("seller_role");
		var accessOpened = dj.byId("access_opened");
		
		
			if(fscmEnabled && !dj.byId("fscm_enabled").get("checked"))
				{
					if(creditNoteEnabled)
					{
						creditNoteEnabled.set("checked", false);
					}
					if(buyerRole)
					{
						buyerRole.set("checked", false);
					}
					if(sellerRole)
					{
						sellerRole.set("checked", false);
					}
					if(accessOpened)
					{
						accessOpened.set("checked", false);
					}
						
				}
		}
	
	d.mixin(m._config, {
		xmlTransform : function(/*String*/ xml) {
			
			// transforming existing currency XML	
			var transformedExistingXml = "<existing_cur_list>",
					selectedList	= dj.byId("corr_bank_currency_exist_nosend");
			if(selectedList)
				{
					var selectedOptions = selectedList.domNode.options;
					for(var i=0 ; i < selectedOptions.length ; i++)
					{
						transformedExistingXml = transformedExistingXml.concat("<existing_cur_details>");
						transformedExistingXml = transformedExistingXml.concat("<currency_description>"+selectedOptions[i].text+"</currency_description>");
						transformedExistingXml = transformedExistingXml.concat("<currency_code>"+selectedOptions[i].value+"</currency_code>");
						transformedExistingXml = transformedExistingXml.concat("</existing_cur_details>");
					}
					transformedExistingXml = transformedExistingXml.concat("</existing_cur_list>");
					var subStr = xml.substring(xml.indexOf("<corr_bank_currency_exist_nosend>"),(xml.indexOf("</corr_bank_currency_exist_nosend>")+34));
					xml = xml.replace(subStr,transformedExistingXml);
				}
				return xml;
		}
	});

	// Public functions & variables follow
	d.mixin(m,
	{

		bind : function()
		{

			//m.setValidation("abbv_name", m.validateCharactersExcludeSpace);
			m.connect("abbv_name", "onKeyPress", function(e)
			{
				if (e.keyCode === 32 || e.charCode === 32)
				{
					dojo.stopEvent(e);
				}
			});
			
			m.connect("abbv_name", "onBlur", function(e)
			{	
				var thisField = this;
				var cptyAbbvName = this.get('value');
				var bankabbname = dj.byId("bank_abbv_name_regex");
				if(!cptyAbbvName.match(bankabbname))
				{	
					thisField.set("state","Error");
					dj.showTooltip(m.getLocalization("cptyAbbvNameFormatError", [cptyAbbvName]), thisField.domNode, 0);
					setTimeout(function(){dj.hideTooltip(thisField.domNode);}, 5000);
				}
			});
			
			m.connect("abbv_name", "onChange", function(e){
				var thisField = this;
				var cptyAbbvName = this.get('value');
				var tmaPropIdTypeFlag = dj.byId("prtry_id_type_flag");
				var tmaPropIdType = dj.byId("prtry_id_type");
				var tmaPropIdTypeDiv = d.byId("prtry_id_type_div");

				if(tmaPropIdTypeFlag && tmaPropIdType && cptyAbbvName != '') {

					m.xhrPost( {
						url : m.getServletURL("/screen/AjaxScreen/action/CheckStaticBeneficiaryAction"),
						handleAs 	: "json",
						sync 		: true,
						content : {
							cpty_abbv_name : cptyAbbvName
						},
						load : function(response){
							if(response.items.prtryIdType)
							{
								m._config.markPrtryIdFieldAsDisabled = response.items.markAsDisabled;
								tmaPropIdType.set("value", response.items.prtryIdType);

								// Make the field(here, prtryIdType) if-and-only-if participating in any of the Open Account transactions.
								if(response.items.markAsDisabled)
								{
									tmaPropIdType.set("disabled", true);
									tmaPropIdType.set("required", false);
								}
								else
								{
									tmaPropIdType.set("disabled", false);
									tmaPropIdType.set("required", true);
								}
								_resolveTMAFields(false);
								// Just intimate the beneficiary with the name(in context) is already exist(except on Form Load).
								if(m._config.onLoadShowBenExistingMsg)
								{
									dj.showTooltip(m.getLocalization("beneficiaryAlreadyExist", [cptyAbbvName]), thisField.domNode, 0);
									setTimeout(function(){dj.hideTooltip(thisField.domNode);}, 5000);
								}
							}
							else
							{
								if(tmaPropIdType.get("disabled") || tmaPropIdTypeFlag.get("checked")){
									tmaPropIdType.set("value", "");
								}
								tmaPropIdTypeFlag.set("checked", false);
								_resolveTMAFields(true);
							}
						} 
					});
				}
			});
			
			m.setValidation("password_value", misys.validateChangePasswordNP);
			m.setValidation("password_confirm", misys.validateChangePasswordCP);
			m.connect("password_value", "onBlur", _checkConfirmPassword);
			m.connect("reset_password", "onChange", function()
			{
				if (dijit.byId("reset_password") && dijit.byId("reset_password").get("checked"))
				{
					if (dijit.byId("password_value") && dijit.byId("password_confirm"))
					{
						dijit.byId("password_value").set("disabled", false);
						dijit.byId("password_confirm").set("disabled", false);
						m.toggleRequired("password_value", true);
						m.toggleRequired("password_confirm", true);
					}

				} else
				{
					if (dijit.byId("password_value") && dijit.byId("password_confirm"))
					{
						dijit.byId("password_value").set("value", "");
						dijit.byId("password_confirm").set("value", "");
						dijit.byId("password_value").set("disabled", true);
						dijit.byId("password_confirm").set("disabled", true);
						m.toggleRequired("password_value", false);
						m.toggleRequired("password_confirm", false);
					}
				}
			});

			/*m.connect("email", "onChange", function(){
				m.validateEmailid();
			});*/
			//m.setValidation("email", m.validateEmailid());
			m.setValidation("web_address", m.validateWebAddr);
			m.setValidation("bei", m.validateBEIFormat);
			m.setValidation("bank_iso_code", m.validateBICFormat);
			m.setValidation("iso_code", m.validateBICFormat);
			m.setValidation("phone", m.validatePhoneOrFax);
			m.setValidation("fax", m.validateFax);
			m.setValidation("telex", m.validateTelex);
			m.setValidation("_country", m.validateCountry);
			/** MPS-41722 Commenting out as requirement is to accept French characters**/
			//m.setValidation("name",m.validateSwiftAddressCharacters);
			m.setValidation("address_line_1",m.validateSwiftAddressCharacters);
			m.setValidation("address_line_2",m.validateSwiftAddressCharacters);
			m.setValidation("dom",m.validateSwiftAddressCharacters);
			
			m.connect("post_code", "onBlur", function()
			{
				dj.byId("swift_address_address_line_1").set("value", this.get("value"));
			});
			m.connect("address_line_1", "onBlur", function()
			{
				dj.byId("address_address_line_1").set("value", this.get("value"));
			});
			//m.setValidation("abbv_name", m.validateCharacters);
			
			m.connect("account_type", "onChange", function()
			{
				m.onChangeSellerAccountType("form_settlement", "account", "account_type");
				_validateAccountField();
			});
			m.connect("account", "onBlur", function()
			{
				m.onBlurSellerAccount("form_settlement", "account", "account_type");
				_validateAccountField();
			});
			
			m.connect("fscm_enabled", "onChange", function()
			{
				_counterpartyAssociationCheck();
				_toggleCheckBoxFields();
				_hideOpenAccountFields();
				_resolveTMAFields(false);
			});
			
			m.connect("buyer_role","onChange", function()
			{
				_checkIfBuyerRoleCanBeDisabled();
			});
			
			m.connect("seller_role","onChange", function()
			{
				_checkIfSellerRoleCanBeDisabled();
			});

			m.connect("access_opened","onChange", function(){
				_resolveTMAFields(false);
			});
			
			m.connect("access_credit_note_product","onChange", function(){
				_resolveTMAFields(false);
			});

			m.connect("prtry_id_type_flag","onChange", function(){
				var tmaPropIdType = dj.byId("prtry_id_type");
				var tmaPropIdTypeDiv = d.byId("prtry_id_type_div");
				
				if(this.get("checked") && this.get("disabled") && tmaPropIdType.get("value")){
					// onBlur of counter-party abbv_name i.e., when modifying counter-party name this block will get into use
					tmaPropIdType.set("disabled", true);
					tmaPropIdType.set("required", false);
					m.animate("fadeIn", tmaPropIdTypeDiv);
				}
				else if(this.get("checked")){
					tmaPropIdType.set("disabled", false);
					tmaPropIdType.set("required", true);
					m.animate("fadeIn", tmaPropIdTypeDiv);
				}
				else{
					tmaPropIdType.set("required", false);
					if(!tmaPropIdType.get("disabled")){
						tmaPropIdType.set("value", "");
					}
					tmaPropIdType.set("disabled", true);
					m.animate("fadeOut", tmaPropIdTypeDiv);
				}
			});
			
			m.connect("prtry_id_type","onBlur", function(){
				var field = this;
				// Non-empty check on this field avoids unnecessary execution 
				var prtryIdTypeValue = field.get('value');
				
				if(field && !field.get("disabled") && prtryIdTypeValue)
				{
					var abbvName = dj.byId("abbv_name");
					var cptyAbbvName = abbvName ? abbvName.get("value"):"";

					var tmaPropIdTypeFlag = dj.byId("prtry_id_type_flag");
					var tmaPropIdType = dj.byId("prtry_id_type");
					var tmaPropIdTypeDiv = d.byId("prtry_id_type_div");

					var prtryIdTypeSeprtr = dj.byId("prtry_id_type_separator");
					var idTypeSeprtr = prtryIdTypeSeprtr ? prtryIdTypeSeprtr.get("value"):"";
					var splitPrtryIdTypeValue = prtryIdTypeValue.split(idTypeSeprtr);
					// Proprietary Id
					var propId = splitPrtryIdTypeValue[0]; 
					// Proprietary Id Type
					var propIdType = splitPrtryIdTypeValue[1]; 
					var tmaValLength = prtryIdTypeValue.length;
					var isSeprtrPositionInvalid = (prtryIdTypeValue.indexOf(idTypeSeprtr) < 1 || prtryIdTypeValue.indexOf(idTypeSeprtr)=== tmaValLength-1) ;
					var isSeprtrAppearsMoreThanTwice = splitPrtryIdTypeValue && splitPrtryIdTypeValue.length > 2 ;
					
					if(prtryIdTypeValue && (isSeprtrPositionInvalid || isSeprtrAppearsMoreThanTwice)){
						console.debug("Invalid Format: Expected format is <ProprietaryId><configured-separator><ProprietaryType> ");
						field.set("state","Error");
						dj.hideTooltip(field.domNode);
						dj.showTooltip(m.getLocalization("invalidPrtryIdTypeFormat", [ idTypeSeprtr ]), field.domNode, 0);
						
					}
				    if(propId && propId.length > 35 || propIdType && propIdType.length > 35)
				    {
					    console.debug("Individual length of ProprietaryId and ProprietaryType should be less or equal to 35");
						field.set("state","Error");
						dj.hideTooltip(field.domNode);
						dj.showTooltip(m.getLocalization("lengthTMAField"), field.domNode, 0);
					   				
				    }

					if(tmaPropIdTypeFlag && tmaPropIdType && prtryIdTypeValue != '' && !isSeprtrPositionInvalid) {

						m.xhrPost( {
							url : m.getServletURL("/screen/AjaxScreen/action/CheckStaticBeneficiaryAction"),
							handleAs 	: "json",
							sync 		: true,
							content : {
								cpty_abbv_name : cptyAbbvName,
								prtry_id_type : prtryIdTypeValue
							},
							load : function(response){
								if(response.items.isDuplicate){
									console.debug("Duplicate: This type of Proprietary-id is already assgined to another party.");
									field.set("value", "");
									field.set("state","Error");
									dj.hideTooltip(field.domNode);
									dj.showTooltip(m.getLocalization("duplicatePrtryIdType"), field.domNode, 0);
								}
							} 
						});
					}
				}
				
			});
			
			m.connect("autoacceptance_day", "onBlur", function()
					{
							var autoacceptanceDay = dj.byId("autoacceptance_day");
							if(autoacceptanceDay && autoacceptanceDay.get('value') === 0)
							{
								autoacceptanceDay.set("state","Error");
								dj.hideTooltip(autoacceptanceDay.domNode);
								dj.showTooltip(m.getLocalization("autoacceptanceDayGreaterthanZero"), autoacceptanceDay.domNode, 0);

							}	
					});
		},
		
		addCurrencyMultiSelectItems : function(addFlag) {
			//  summary:
			//        Move items from one multi-select to another
			
			var targetWidget,sourceWidget; 
			if(addFlag)
			{
				targetWidget = dj.byId("corr_bank_currency_exist_nosend");
				sourceWidget = dj.byId("corr_bank_currency_avail_nosend");
			}
			else
			{
				targetWidget = dj.byId("corr_bank_currency_avail_nosend");
				sourceWidget = dj.byId("corr_bank_currency_exist_nosend");
			}
			
			targetWidget.addSelected(sourceWidget);
			
			// Have to call focus, otherwise sizing issues in Internet Explorer
			sourceWidget.focus();
			targetWidget.focus();
		},

		onFormLoad : function()
		{
			var accessOpened = dj.byId("access_opened");
			var abbvName = dijit.byId("abbv_name");
			
			if (accessOpened)
			{
				m.toggleFields(accessOpened.get("checked"), [ "notification_enabled" ], null, true);
			}

			var notificationEnabled = dj.byId("notification_enabled");
			if (notificationEnabled)
			{
				_toggleProductFields(true);
			}
			// Check FSCMProgrammes and Hide the open account fields on page load
			_hideOpenAccountFields();
			
			// MPSSC-6735
			// Only, on-page-load donot show 'The Beneficiary already exists' message.
			// Show that message only on change of Abbreviation Name(here, abbv_name).
			m._config.onLoadShowBenExistingMsg = false;
			abbvName.onChange();
			_resolveTMAFields(false);
			m._config.onLoadShowBenExistingMsg = true;
			
		},

		beforeSubmitValidations : function(){
			var tmaPropIdTypeFlag = dj.byId("prtry_id_type_flag");
			var tmaPropIdType = dj.byId("prtry_id_type");
			var returnValue = true;
			var error_message = "";
			_resolveTMAFields(true);
			
			if(tmaPropIdTypeFlag && tmaPropIdType && tmaPropIdTypeFlag.get("checked") && !tmaPropIdTypeFlag.get("disabled") && tmaPropIdType.get("value")){
				tmaPropIdType.onBlur();
			}
			
			if(tmaPropIdType && tmaPropIdType.get("state") =="Error"){
				returnValue = false;
			}
			/* If FSCM Enabled for the counterparty, Buyer and/or Seller Role must be selected.At least one has to be selected. */
			if(dj.byId("fscm_enabled") && dj.byId("fscm_enabled").get("checked"))
				{
				console.debug("[Start] Validating at least one of Buyer/Seller has to checked.");
					var buyerRole = dj.byId("buyer_role") ? dj.byId("buyer_role").get("checked") : "";
					var sellerRole = dj.byId("seller_role") ? dj.byId("seller_role").get("checked") : "";
					
					if((buyerRole !== "" && !buyerRole) && (sellerRole !== "" && !sellerRole))
						{
							error_message = m.getLocalization("counterpartyRoleIsRequired");
							m._config.onSubmitErrorMsg =  error_message;
							returnValue = false;
						}
					console.debug("[End] Validating at least one of Buyer/Seller has to checked.");
				}
			return returnValue;
		}

	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require("misys.client.binding.system.bank_beneficiary_client");