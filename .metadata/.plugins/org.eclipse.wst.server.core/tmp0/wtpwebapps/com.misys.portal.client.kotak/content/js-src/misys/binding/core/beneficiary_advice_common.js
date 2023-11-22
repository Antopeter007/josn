dojo.provide("misys.binding.core.beneficiary_advice_common");

dojo.require("misys.grid.GridMultipleItems");
dojo.require("dojo.parser");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("misys.form.CurrencyTextBox");
dojo.require("dijit.form.DateTextBox");
dojo.require("misys.binding.core.beneficiary_advice_templates");

/**
 * Common JS for Beneficiary Advice at Transaction level
 * version:   1.0
 * date   :   28/11/2011
 * Author : Gurudath Reddy
 * 
 */
(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {
	
	"use strict"; // ECMA5 Strict Mode
	
	function _toggleBeneAdvDisplay(guardPassed, div){
		/*
		 * Based on the guard condition passed toggle the display of a html container
		 */
		if(guardPassed){
			m.animate("wipeIn",div);
		}
		else{
			m.animate("wipeOut",div);
		}
	}
	
	function _validatePostalCodeLength()
	{
		//  summary: 
		//  Validates the length of the postal code against the country code
		var postalCodeField 		= dj.byId("bene_adv_postal_code"),
			beneficiaryCountryField = dj.byId("bene_adv_country"),
			errorMessage			= "",
			countryIndex			= -1,
			postalCodeLength		= 0,
			timeoutInMs 			= 2000,
			hideTT = function() {dj.hideTooltip(beneficiaryCountryField.domNode);};
		//If both fields exists then validate
		if(postalCodeField && beneficiaryCountryField)
		{
			//Check if the country field is empty
			if(beneficiaryCountryField.get("value") === "")
			{ 
				if(this.get("name") === "bene_adv_postal_code"){
					postalCodeField.set("value","");
					errorMessage =  m.getLocalization("selectBeneficiaryCountry");
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
				if(misys._config.bene_advice.postal_codes[beneficiaryCountryField.get("value")])
				{
					postalCodeLength = misys._config.bene_advice.postal_codes[beneficiaryCountryField.get("value")];
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
					if(this.get("name") === "bene_adv_country")
					{
						if(m._config.currentBeneficiaryCountry !== beneficiaryCountryField.get("value"))
						{
							postalCodeField.set("value","");	
							m._config.currentBeneficiaryCountry = beneficiaryCountryField.get("value");
						}
					}
					postalCodeField.set("maxLength",15);
				}
			}
		}
	}
	
	function _load()
	{
		/*
		 * On Load Actions to be performed
		 */
		_toggleBeneAdvDisplay((dj.byId("bene_adv_flag") && dj.byId("bene_adv_flag").checked),"beneAdvDiv");
		m.toggleFields((dj.byId("bene_adv_email_flag") && dj.byId("bene_adv_email_flag").checked),["bene_adv_email_21","bene_adv_email_22"], ["bene_adv_email_1"]);
		m.toggleFields((dj.byId("bene_adv_phone_flag") && dj.byId("bene_adv_phone_flag").checked),null, ["bene_adv_phone"]);
		m.toggleFields((dj.byId("bene_adv_fax_flag") && dj.byId("bene_adv_fax_flag").checked),null, ["bene_adv_fax"]);
		m.toggleFields((dj.byId("bene_adv_ivr_flag") && dj.byId("bene_adv_ivr_flag").checked),null, ["bene_adv_ivr"]);
		_toggleBeneAdvDisplay((dj.byId("bene_adv_mail_flag") && dj.byId("bene_adv_mail_flag").checked),"mailAdditionalDetails");
		m.toggleFields((dj.byId("bene_adv_mail_flag") && dj.byId("bene_adv_mail_flag").checked),
				["bene_adv_mailing_name_add_2","bene_adv_mailing_name_add_3","bene_adv_mailing_name_add_4","bene_adv_mailing_name_add_5",
				 	"bene_adv_mailing_name_add_6","bene_adv_postal_code","bene_adv_country"], ["bene_adv_mailing_name_add_1"]);
	}
	
	function _fadeAndClear(/*Array of Divs to FadeOut*/arrayFade,/*Array of fields to clear*/arrayClear,/*Array of fields to Uncheck*/arrayUncheck)
	{
		/*
		 * Does the job of fading out html containers and also clearing fields and un-checking check boxes
		 */
		for(var k=0;k<arrayUncheck.length;k++)
		{
			if(dj.byId(arrayUncheck[k]))
			{
				dj.byId(arrayUncheck[k]).set("checked",false);
			}
		}
		for(var i=0;i<arrayClear.length;i++)
		{
			if(dj.byId(arrayClear[i]))
			{
				dj.byId(arrayClear[i]).set("value","");
			}
		}
		for(var j=0;j<arrayFade.length;j++)
		{
			m.animate("fadeOut",arrayFade[j]);
		}
	}
	
	function _handleDeliveryModeConfigurations(){
		/*
		 * Based on the parameters configured the Delivery mode fields will be configured
		 */
		
		//Get the configurations from the cache
		var config = _getParameterConfigurations();
		var Y = "Y";
		var arrayOfDivToFade = [];
		var arrayOfFieldsToClear = [];
		var arrayOfFieldsToUncheck = [];
		m._config.beneAdvDeliveryModeSingle = false;
		m._config.beneAdvTableMaxRows = config.table_max_rows || 0;
		if(config.multi_selection !== Y)
		{
			m._config.beneAdvDeliveryModeSingle = true;
		}
		if(config)
		{
			if(config.bene_adv_enabled_for_product === Y)
			{
				if(config.email_1 !== Y)
				{
					if(config.email_2 !== Y)
					{
						arrayOfDivToFade.push("beneAdvEmailDiv");
						arrayOfFieldsToUncheck.push("bene_adv_email_flag");
					}
					else
					{
						arrayOfDivToFade.push("beneAdvEmailDiv1");
						arrayOfFieldsToClear.push("bene_adv_email_1");
					}
				}
				if(config.email_2 !== Y)
				{
					arrayOfDivToFade.push("beneAdvEmailDiv2");
					arrayOfFieldsToClear.push("bene_adv_email_21");
					arrayOfFieldsToClear.push("bene_adv_email_22");
				}
				if(config.phone !== Y)
				{
					arrayOfDivToFade.push("beneAdvPhoneDiv");
					arrayOfFieldsToUncheck.push("bene_adv_phone_flag");
				}
				if(config.fax !== Y)
				{
					arrayOfDivToFade.push("beneAdvFaxDiv");
					arrayOfFieldsToUncheck.push("bene_adv_fax_flag");
				}
				if(config.ivr !== Y)
				{
					arrayOfDivToFade.push("beneAdvIVRDiv");
					arrayOfFieldsToUncheck.push("bene_adv_ivr_flag");
				}
				if(config.print !== Y)
				{
					arrayOfDivToFade.push("beneAdvPrintDiv");
					arrayOfFieldsToUncheck.push("bene_adv_print_flag");
				}
				if(config.mail !== Y)
				{
					arrayOfDivToFade.push("beneAdvMailDiv");
					arrayOfDivToFade.push("mailAdditionalDetails");
					arrayOfFieldsToUncheck.push("bene_adv_mail_flag");
				}
				if(dj.byId("bene_adv_free_format_msg"))
				{
					dj.byId("bene_adv_free_format_msg").set("maxSize",config.free_format_msg_length);
					dj.byId("bene_adv_free_format_msg").set("cols",config.free_format_msg_width);
				}
				_fadeAndClear(arrayOfDivToFade,arrayOfFieldsToClear,arrayOfFieldsToUncheck);
			}
			else
			{
				m.animate("fadeOut","beneficiaryAdvicesTransactionContainer");
				m._config.beneAdvNotConfigured = true;
				dj.byId("bene_adv_flag").set("checked",false);
			}
		}
		else
		{
			console.error(m.getLocalization("technicalErrorWhileConfiguringBeneficiaryAdvices"));
			m.animate("fadeOut","beneficiaryAdvicesTransactionContainer");
			m._config.beneAdvNotConfigured = true;
			dj.byId("bene_adv_flag").set("checked",false);
		}
	}
	
	function _getParameterConfigurations(){
		
		/*
		 * Get the Parameter configurations based on the sub product code
		 */
		var subProductWidgetId = m._config.bene_advice.beneAdvSubProductCodeWidgetId;
		var config;
		if(subProductWidgetId !== null && subProductWidgetId !== "")
		{
			if(dj.byId(subProductWidgetId))
			{
				config = misys._config.bene_advice.parameterConfig[dj.byId(subProductWidgetId).get("value")];
			}
			else
			{
				console.error(m.getLocalization("technicalErrorWhileConfiguringBeneficiaryAdvices"));
				m.animate("fadeOut","beneficiaryAdvicesTransactionContainer");
				m._config.beneAdvNotConfigured = true;
				dj.byId("bene_adv_flag").set("checked",false);
			}
		}
		//If sub product code is not present then consider it as '*'
		else
		{
			config = misys._config.bene_advice.parameterConfig["*"];
		}
		return config;
	}
	
	function _clearAllFields(){
		/*
		 * Helps to clear all Beneficiary Fields
		 */
		var arrayOfFieldsToClear = ["bene_adv_beneficiary_id","bene_adv_payer_name_1","bene_adv_payer_name_2","bene_adv_payer_ref_no","bene_adv_free_format_msg","bene_adv_table_format"];
		var arrayOfFieldsToUncheck = ["bene_adv_email_flag","bene_adv_phone_flag","bene_adv_fax_flag","bene_adv_ivr_flag","bene_adv_mail_flag"];
		_fadeAndClear([],arrayOfFieldsToClear,arrayOfFieldsToUncheck);
	}
	
	function _singleSelection(/*boolean*/context,/*String*/checkedWidget)
	{
		/*
		 * Method to handle Single and Multiple Delivery Mode Selections
		 */
		
		var arrayOfDeliverModes = ["bene_adv_email_flag","bene_adv_phone_flag","bene_adv_fax_flag","bene_adv_ivr_flag","bene_adv_mail_flag"];
		
		d.forEach(arrayOfDeliverModes,function(node,index){
			if(checkedWidget !== node)
			{
				if(context)
				{
					if(dijit.byId(node))
					{
						dijit.byId(node).set("readOnly",true);
					}
				}
				else
				{
					if(dijit.byId(node))
					{
						dijit.byId(node).set("readOnly",false);
					}
				}
			}
		});
	}
	d.mixin(m, {
		beneAdvBinding : function(){
			/*
			 * Binding
			 */
			
			//Common Validations
			m.setValidation("bene_adv_email_1", m.validateEmailAddr);
			m.setValidation("bene_adv_email_21", m.validateEmailAddr);
			m.setValidation("bene_adv_email_22", m.validateEmailAddr);
			m.setValidation("bene_adv_country", m.validateCountry);
			m.setValidation("bene_adv_phone", m.validatePhoneOrFax);
			m.setValidation("bene_adv_fax", m.validatePhoneOrFax);
			m.setValidation("bene_adv_ivr", m.validatePhoneOrFax);
			
			m.connect("bene_adv_postal_code", "onKeyPress", _validatePostalCodeLength);
			m.connect("bene_adv_country", "onBlur", _validatePostalCodeLength);
			
			//Beneficiary advice flag
			m.connect("bene_adv_flag","onChange",function(){
				var toggle = function() {
					//Flag to indicate if the parameter configurations are done
					m._config.beneAdvNotConfigured = m._config.beneAdvNotConfigured || false;
					
					if(m._config.beneAdvNotConfigured === false)
					{
						if(!dj.byId("bene_adv_flag").checked)
						{
							//If the beneficiary flag is unchecked then show a dialog to get the user confirmation
							//with call backs to handle 'ok' and 'cancel' actions
							m.dialog.show("CONFIRMATION", m.getLocalization("beneAdvClearAll"), "",null,null,"",function() {
									_toggleBeneAdvDisplay(false,"beneAdvDiv");
									m._config.beneAdvFlagUnchecked = true;
									_clearAllFields();
								},function(){dj.byId("bene_adv_flag").set("checked",true);
							});
						}
						else
						{
							//Flag to indicate whether the table format selection is configured
							m._config.templateSelectionBuilt = m._config.templateSelectionBuilt || false;
							if(m._config.templateSelectionBuilt === false)
							{
								m.buildTemplateSelection();
							}
							//Default the values from Beneficiary Master if present 
							dj.byId("bene_adv_beneficiary_id").set("value",dj.byId("bene_adv_beneficiary_id_no_send").get("value"));
							
							//Show the Beneficiary Advice's section
							_toggleBeneAdvDisplay(true,"beneAdvDiv");
						}
					}
				};
				//Timeout to handle proper configurations
				setTimeout(toggle, 50);
			});
			
			m.connect("bene_adv_email_flag", "onChange", function(){
				
				//Email Fields
				m.toggleFields((this.checked),["bene_adv_email_21","bene_adv_email_22"], ["bene_adv_email_1"]);
				if(this.checked)
				{
					//Default the values from Beneficiary Master if present 
					dj.byId("bene_adv_email_1").set("value",dj.byId("bene_adv_email_no_send").get("value"));
				}
				
				//Configure Delivery Mode Type (Single or Multiple)
				if(m._config.beneAdvDeliveryModeSingle === true)
				{
					_singleSelection((this.checked),'bene_adv_email_flag');
				}
			});
			m.connect("bene_adv_phone_flag", "onChange", function(){
				//Phone Fields
				m.toggleFields((this.checked),null, ["bene_adv_phone"]);
				if(this.checked)
				{
					//Default the values from Beneficiary Master if present 
					dj.byId("bene_adv_phone").set("value",dj.byId("bene_adv_phone_no_send").get("value"));
				}
				//Configure Delivery Mode Type (Single or Multiple)
				if(m._config.beneAdvDeliveryModeSingle === true)
				{
					_singleSelection((this.checked),'bene_adv_phone_flag');
				}
			});
			m.connect("bene_adv_fax_flag", "onChange", function(){
				
				//Fax Fields
				m.toggleFields((this.checked),null, ["bene_adv_fax"]);
				if(this.checked)
				{
					//Default the values from Beneficiary Master if present 
					dj.byId("bene_adv_fax").set("value",dj.byId("bene_adv_fax_no_send").get("value"));
				}
				//Configure Delivery Mode Type (Single or Multiple)
				if(m._config.beneAdvDeliveryModeSingle === true)
				{
					_singleSelection((this.checked),'bene_adv_fax_flag');
				}
			});
			m.connect("bene_adv_ivr_flag", "onChange", function(){
				
				//IVR Fields
				m.toggleFields((this.checked),null, ["bene_adv_ivr"]);
				if(this.checked)
				{
					//Default the values from Beneficiary Master if present 
					dj.byId("bene_adv_ivr").set("value",dj.byId("bene_adv_ivr_no_send").get("value"));
				}
				//Configure Delivery Mode Type (Single or Multiple)
				if(m._config.beneAdvDeliveryModeSingle === true)
				{
					_singleSelection((this.checked),'bene_adv_ivr_flag');
				}
			});
			m.connect("bene_adv_mail_flag", "onChange", function(){
				
				//Mail Addendum Fields
				_toggleBeneAdvDisplay((this.checked),"mailAdditionalDetails");
				m.toggleFields((this.checked),["bene_adv_mailing_name_add_2","bene_adv_mailing_name_add_3","bene_adv_mailing_name_add_4","bene_adv_mailing_name_add_5",
				                               "bene_adv_mailing_name_add_6","bene_adv_postal_code","bene_adv_country"], ["bene_adv_mailing_name_add_1"]);
				if(this.checked)
				{
					//Default the values from Beneficiary Master if present 
					dj.byId("bene_adv_mailing_name_add_1").set("value",dj.byId("bene_adv_mailing_name_add_1_no_send").get("value"));
					dj.byId("bene_adv_mailing_name_add_2").set("value",dj.byId("bene_adv_mailing_name_add_2_no_send").get("value"));
					dj.byId("bene_adv_mailing_name_add_3").set("value",dj.byId("bene_adv_mailing_name_add_3_no_send").get("value"));
					dj.byId("bene_adv_mailing_name_add_4").set("value",dj.byId("bene_adv_mailing_name_add_4_no_send").get("value"));
					dj.byId("bene_adv_mailing_name_add_5").set("value",dj.byId("bene_adv_mailing_name_add_5_no_send").get("value"));
					dj.byId("bene_adv_mailing_name_add_6").set("value",dj.byId("bene_adv_mailing_name_add_6_no_send").get("value"));
					dj.byId("bene_adv_postal_code").set("value",dj.byId("bene_adv_postal_code_no_send").get("value"));
					dj.byId("bene_adv_country").set("value",dj.byId("bene_adv_country_no_send").get("value"));
				}
				
				//Configure Delivery Mode Type (Single or Multiple)
				if(m._config.beneAdvDeliveryModeSingle === true)
				{
					_singleSelection((this.checked),'bene_adv_mail_flag');
				}
			});
			m.connect("bene_adv_table_format", "onChange", function(){
				
				//Table Format Selection Change
				
				//Flag to check if the change has been made by user or dynamically by _clearAllFields method (To handle Dialog showing or not)
				m._config.beneAdvFlagUnchecked = m._config.beneAdvFlagUnchecked || false;
				if(d.style("beneAdvTableDivContainer","display") !== "none")
				{
					m._config.beneAdvTemplateOld = m._config.beneAdvTemplateOld || false;
					//Store the previously selected Table Format to reset it if the user presses cancel button in the confirmation dialog
					if(!m._config.beneAdvPreviousTemplateSelection)
					{
						m._config.beneAdvPreviousTemplateSelection = dj.byId("bene_adv_table_format").get("value");
					}
					if(m._config.beneAdvTemplateOld === false)
					{
						if(m._config.beneAdvFlagUnchecked === false)
						{
							m.dialog.show("CONFIRMATION", m.getLocalization("beneAdvChangingTemplateFormat"), "",null,null,"",
								function() {
									m._config.beneAdvPreviousTemplateSelection = dj.byId("bene_adv_table_format").get("value");
									m.buildGridMultipleItem();
							},
								function(){
									m._config.beneAdvTemplateOld = true;
									dj.byId("bene_adv_table_format").set("value",m._config.beneAdvPreviousTemplateSelection);
							});
						}
						else
						{
							m._config.beneAdvFlagUnchecked = false;
							m._config.beneAdvPreviousTemplateSelection = null;
							m.buildGridMultipleItem();
						}
					}
					else
					{
						m._config.beneAdvTemplateOld = false;
					}
				}
				else
				{
					if(!m._config.beneAdvPreviousTemplateSelection)
					{
						m._config.beneAdvPreviousTemplateSelection = dj.byId("bene_adv_table_format").get("value");
					}
					m._config.beneAdvFlagUnchecked = false;
					m.buildGridMultipleItem();
				}
			});
		},
		beneAdvFormLoad : function(){
			
			/*
			 * Handles Form Load Events
			 */
			if(dj.byId("bene_adv_flag"))
			{
				_load();
				if(dj.byId("applicant_act_no") && !(dj.byId("applicant_act_no").get("value") === ''))
				{
					m.handleParametersConfigurations();	
					m.buildTemplateSelection();
					
					//Draft Mode handling Modification Time
					if(m._config.bene_advice && m._config.bene_advice.beneAdvTableFormat && m._config.bene_advice.beneAdvTableFormat !== '')
					{
						var currentTemplateModificationTime = m._config.bene_advice.beneAdvTemplates[m._config.bene_advice.beneAdvTableFormat].modificationTime;
						var previousTemplateModificationTime = misys._config.bene_advice.beneAdvTableFormatTime;
						if(currentTemplateModificationTime === previousTemplateModificationTime)
						{
							dj.byId("bene_adv_table_format").set("value", m._config.bene_advice.beneAdvTableFormat);
							var timeOutToParse = function(){
								if(dj.byId("beneAdvTable"))
								{
									dj.byId("beneAdvTable").dataArray = m._config.bene_advice.beneAdvTableData;
									dj.byId("beneAdvTable")._started = false;
									dj.byId("beneAdvTable").startup();
									dj.byId("beneAdvTable").renderAll();
								}
							};
							setTimeout(timeOutToParse,1000);
						}
						else
						{
							m.dialog.show("ERROR",m.getLocalization("beneAdvTemplateModifiedAlert"));
						}
					}
				}
			}
		},
		handleParametersConfigurations : function(){
			/*
			 * Parameter Field Configurations
			 */
			if(dj.byId("bene_adv_flag"))
			{
				_handleDeliveryModeConfigurations();
			}
		},
		beneAdvBeforeSubmitValidation : function(){
			/*
			 * Before Submit Validations 
			 */
			if(dj.byId("bene_adv_flag") && dj.byId("bene_adv_flag").get("checked") === true && m._config.displayMode === "edit")
			{
				console.debug("Beneficiary Advice Before Submit Validation");
				var array = ["bene_adv_email_flag","bene_adv_phone_flag","bene_adv_fax_flag","bene_adv_ivr_flag","bene_adv_mail_flag"];
				var valid = false;
				d.forEach(array,function(node){
					if(dj.byId(node) && dj.byId(node).get("checked") === true)
					{
						valid = true;
					}
				});
				
				if(!valid)
				{
					m._config.onSubmitErrorMsg = m.getLocalization("beneAdvAtleastOneDeliveryModeRequired");
				}
				return valid;
			}
			else
			{
				return true;
			}
		},
		handleBeneAdvViewMode : function(){
			/*
			 * For View Mode onLoad
			 */
			m.buildGridMultipleItem('view');
			console.debug("Bene Advice View Mode Start");
			var timeOutToParse = function(){
				if(dj.byId("beneAdvTable"))
				{
					console.debug("Bene Advice View Mode Update Grid");
					dj.byId("beneAdvTable").dataArray = m._config.bene_advice.beneAdvTableData;
					dj.byId("beneAdvTable")._started = false;
					dj.byId("beneAdvTable").overrideDisplaymode = 'view';
					console.debug("Bene Advice View Mode StartUp Grid");
					dj.byId("beneAdvTable").startup();
					console.debug("Bene Advice View Mode StartUp Grid");
					dj.byId("beneAdvTable").renderAll();
					dj.byId("bene-adv-table-grid").resize();
					
					m.connect("beneAdvTableDivContainer","onClick",function(){
						if(dj.byId("bene-adv-table-grid"))
						{
							dj.byId("bene-adv-table-grid").resize();
						}
					});
				}
			};
			setTimeout(timeOutToParse,1000);
			console.debug("Bene Advice View Mode End");
		},
		clearBeneficiaryAdviceFieldsForDefaultingFromBeneMaster : function()
		{
			/*
			 * Clear fields that are to be defaulted with beneficiary master
			 */
			var arrayOfFieldsToClear = ["bene_adv_beneficiary_id", "bene_adv_email_1", "bene_adv_phone", "bene_adv_fax", "bene_adv_ivr"];
			var arrayOfFieldsToUncheck = ["bene_adv_email_flag","bene_adv_mail_flag","bene_adv_phone_flag", "bene_adv_fax_flag", "bene_adv_ivr_flag"];
			_fadeAndClear([],arrayOfFieldsToClear,arrayOfFieldsToUncheck);
		}
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.core.beneficiary_advice_common_client');