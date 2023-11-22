dojo.provide("misys.binding.system.external_account_mc");

dojo.require("dojo.data.ItemFileReadStore");
dojo.require("dijit.form.FilteringSelect");
dojo.require("misys.form.CurrencyTextBox");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.CheckBox");
dojo.require("misys.form.common");
dojo.require("misys.validation.common");

dojo.require("misys.form.addons");


(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {
	function _entityChange(){
		var count = 0;
		for(var i=0; i<m._config.user_entity_accounts_record_count; i++)
		{
			var entityId = m._config.entityIdArray[i];
			if(dj.byId("entity_"+entityId) && dj.byId("entity_"+entityId).get("checked"))
			{
				count++;
			}
		}
		if(count === m._config.user_entity_accounts_record_count && dj.byId("entity_select_all"))
		{
			dj.byId("entity_select_all").set("checked",true);
		}
		else if(count !== m._config.user_entity_accounts_record_count && dj.byId("entity_select_all") && dj.byId("entity_select_all").get("checked") === true)
		{
			dj.byId("entity_select_all").set("checked",false);
		}
	}
	
	function _validateDuplicateAlternativeAccNo()
	{
		var account_noField	= dj.byId("account_no");
		var alternative_acct_noField = dj.byId("alternative_acct_no");
		var timeoutInMs     = 2000;
		
		var hideTT = function() {
			dj.hideTooltip(alternative_acct_noField.domNode);
		};
		if(alternative_acct_noField.get("value")==="" && account_noField.get("value")==="")
         {
        	 console.debug("validating duplicate account number");
         }
         else if(alternative_acct_noField.get("value")===account_noField.get("value"))
         {  
        	   
        	 	displayMessage = m.getLocalization("duplicateAlternativeAccNo");
        	 	alternative_acct_noField.set("value","");
        	 	alternative_acct_noField.set("state","Error");
				dj.hideTooltip(alternative_acct_noField.domNode);
				dj.showTooltip(displayMessage, alternative_acct_noField.domNode, 0);
				setTimeout(hideTT, timeoutInMs);
		 }
     }
	d.mixin(m, {
		//emulate super (call the parent/standard submit)
		_submit : m.submit,

		bind : function() {
			m.setValidation("account_cur_code", m.validateCurrency);
			misys.setValidation("ccy", misys.validateCurrency);
			m.setValidation("bank_iso_code", m.validateBICFormat);
			m.connect("bank_iso_code","onChange",_truncateBankNameForExternalAccount);
			//m.connect("bank_name","onChange",_truncateBankNameForExternalAccount);
			m.connect("entity_select_all","onChange",function()
					{						
						if(dj.byId("entity_select_all") && dj.byId("entity_select_all").get("checked"))
						{	
							for(i=0; i< m._config.user_entity_accounts_record_count; i++)
							{
								entityId = m._config.entityIdArray[i];
								
								if(dj.byId("entity_"+entityId) && dj.byId("entity_"+entityId).get("disabled") === false)
								{
									dj.byId("entity_"+entityId).set("checked",true);
								}										
							}
						}
						else if(dj.byId("entity_select_all") && dj.byId("entity_select_all").get("checked") === false)
						{
							var count = 0;
							for(i=0; i< m._config.user_entity_accounts_record_count; i++)
							{
								entityId = m._config.entityIdArray[i];
								if(dj.byId("entity_"+entityId) && dj.byId("entity_"+entityId).get("checked"))
								{
									count++;
								}
							}
							if(count === m._config.user_entity_accounts_record_count)
							{
								for(i=0; i< m._config.user_entity_accounts_record_count; i++)
								{
									entityId = m._config.entityIdArray[i];
								    if(dj.byId("entity_"+entityId))
								    {
									 dj.byId("entity_"+entityId).set("checked",false);
								    }
								}
							}
							else
							{
								_entityChange();
							}
						}
					});
			m.connect("alternative_acct_no", "onBlur", _validateDuplicateAlternativeAccNo);
			m.connect("account_no", "onBlur", _validateDuplicateAlternativeAccNo);
		},
		onFormLoad : function() {
			m.setSwiftBankDetailsForOnBlurEvent(false ,"bank_iso_code","",null, null, "bank_", true,true,true,"");
			
			var fields = ["bank_iso_code","bank_name","bank_address_line_1","bank_address_line_2","bank_dom","bank_country"];
			_toggleReadWriteClearState(fields,true,false);
			if(m._config.user_entity_accounts_record_count)
			{
				_entityChange();
				var accountSelectAll = true;
				for(var i=0; i<m._config.user_entity_accounts_record_count; i++)
				{
					var entityId = m._config.entityIdArray[i];
					
					if(dj.byId("entity_"+entityId) && !dj.byId("entity_"+entityId).get("checked") && !dj.byId("entity_"+entityId).get("disabled"))
					{
						accountSelectAll = false;
					}
					m.connect(dj.byId("entity_"+entityId),"onChange", function()
							{
								_entityChange();
						 });
				}

				if(accountSelectAll)
				{
					if(dj.byId("entity_select_all"))
					{
						dj.byId("entity_select_all").set("checked",true);
					}
				}
			}
			
			if(dj.byId('account_no') && dj.byId('description') && dj.byId('account_no').get('value') === "")
			{
				dj.byId('description').set('value',"");
			}
			if((dj.byId('external_acc_reference_val') && dj.byId('external_acc_reference_val').get('value') !== "") && 
					(dj.byId('external_acc_reference') && dj.byId('external_acc_reference').get('displayedValue') === ""))
			{
				dj.byId('external_acc_reference').set('displayedValue',dj.byId('external_acc_reference_val').get('value'));
			}
		},
		
		 beforeSubmitValidations : function() 
		 {
		     var status = true;
		     
		 	 if(dj.byId("format") && dj.byId("format").value === "02")
		 	 {       
		 		 status = _validateIBANCode();
		 	 }
		 	 return status;
		 },
		beforeSaveValidations: function() {
			var account_no = dijit.byId("account_no").get("value");
			console.debug("account_no:",account_no);
			if(!(account_no.length>0))
				{
					m._config.onSubmitErrorMsg = m.getLocalization("externalAccount_noEmptyError");
					dijit.byId("account_no").focus();
					return false;
				}
			else
				{
					return true;
				}
		},
		
		submit : function(/*String*/ type)
		{
			// Don't pass entity abbreviated name in the URL if no entity has been selected
			var entityAbbvNm = "";
			 for(i=0; i< m._config.user_entity_accounts_record_count; i++)
			 {
				entityId = m._config.entityIdArray[i];
					
				if(dj.byId("entity_"+entityId) && dj.byId("entity_"+entityId).get("checked") === true)
				{
					if(i === 0 && m._config.entityIdNmArray && m._config.entityIdNmArray[0] && m._config.entityIdNmArray[0][entityId])
					{
						entityAbbvNm = m._config.entityIdNmArray[0][entityId];
					}
					else if(m._config.entityIdNmArray && m._config.entityIdNmArray[0] && m._config.entityIdNmArray[0][entityId])
					{
						entityAbbvNm = entityAbbvNm +":"+m._config.entityIdNmArray[0][entityId];
					}
				}		
			 }
			 
			if (entityAbbvNm === "")
			{
				dj.byId("url_parameter_entity").set("disabled", true);
				dj.byId("url_parameter_entity").set("value", entityAbbvNm);
			}
			else
			{
				dj.byId("url_parameter_entity").set("value", entityAbbvNm);
			}
			m._submit(type);
		},
		setExecuteClientPassBack : function(state)
		{
			m._config.executeClientPassBack = state;
			m.disconnect(m._config.clearbankFieldsHandle);
			m._config.bankIsoCodeOnBlur = false;
		}
	
	});
	
	d.mixin(m._config, {
		
		passBack : function( /*Array*/ arrFieldIds,
		 		   /*Array*/ arrFieldValues, 
		 		   /*Boolean*/ closeParent) {
			
			if(m._config.executeClientPassBack)
			{
				var fields = ["bank_iso_code","bank_name","bank_address_line_1","bank_address_line_2","bank_dom","bank_country"];
				_toggleReadWriteClearState(fields,true,false);
			}
			//Lock bank address fields if ISO code selected using lookup
		 }
	});
	function _toggleReadWriteClearState(fields,isReadOnly,clearFields)
	{
		//
		d.forEach(fields,function(fieldName){
			var fieldObj = dj.byId(fieldName);
			if(fieldObj)
			{
				fieldObj.set("readOnly",isReadOnly);
				if(clearFields)
				{
					fieldObj.set("value","");
				}
			}
		});
	}
	function _truncateBankNameForExternalAccount(){
		m.setSwiftBankDetailsForOnBlurEvent(false ,"bank_iso_code","", null, null, "bank_", true,true,true,"");
	}

	function _validateIBANCode()
    {
            //  summary:
            //  Validates whether the account is valid IBAN account number
            var country = dj.byId("bank_country").get("value");
            var currency = dj.byId("account_cur_code").get("value");
            var account_no = dj.byId("account_no").get("value");
            var alternative_acct_no = dj.byId("alternative_acct_no").get("value");
            var isAccNoValid = true;
            var isAlterAccNoValid = true;
            var isValid = true;
            if(country !== "" && currency !== "" && account_no !== "")                                      
            {       
                    var productsStr = dj.byId("includedIBANProducts") ? dj.byId("includedIBANProducts").get("value") : '';
                    var productTypeId = dj.byId("product_type")? dj.byId("product_type").get("value") : '';
                    var accountRegExp = new RegExp(misys._config.ibanAccountValidationRegex);
                    isAccNoValid = misys._config.ibanAccountValidationEnabled === "true" ? accountRegExp.test(account_no): true;
                    isAlterAccNoValid = misys._config.ibanAccountValidationEnabled === "true" ? accountRegExp.test(alternative_acct_no): true;
                    if (dj.byId("format").value ==="02")
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
                    if(!(isAccNoValid && isValid)){
							if (account_no) {
								account_no = account_no.replace(/</g, "&lt;");
								account_no = account_no.replace(/>/g, "&gt;");
							}
                            m._config.onSubmitErrorMsg =  m.getLocalization("invalidIBANAccNoError", [ account_no ]);       
                            return false;
                    }
                    if(!(isAlterAccNoValid && isValid)){
						if (alternative_acct_no) {
							alternative_acct_no = alternative_acct_no.replace(/</g, "&lt;");
							alternative_acct_no = alternative_acct_no.replace(/>/g, "&gt;");
						}
                        m._config.onSubmitErrorMsg =  m.getLocalization("invalidIBANAlterAccNoError", [ alternative_acct_no ]);       
                        return false;
                }
            }
            return isValid;
    }

})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.system.external_account_mc_client');