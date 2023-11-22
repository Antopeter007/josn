dojo.provide("misys.binding.trade.create_tf");
/*
 -----------------------------------------------------------------------------
 Scripts for
  
  Financing Request (TF) Form, Customer Side.
  
 Note: the function fncFormSpecificValidation is required

 Copyright (c) 2000-2010 Misys (http://www.misys.com),
 All Rights Reserved. 

 version:   1.0
 date:      19/03/08
 -----------------------------------------------------------------------------
 */


dojo.require("dijit.form.Form");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.TextBox");
dojo.require("misys.widget.Dialog");
dojo.require("dijit.ProgressBar");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.CheckBox");
dojo.require("dijit.layout.ContentPane");
dojo.require("dojo.data.ItemFileReadStore");
dojo.require("dijit.form.DateTextBox");
dojo.require("misys.form.CurrencyTextBox");
dojo.require("dijit.form.NumberTextBox");
dojo.require("dijit.form.FilteringSelect");
dojo.require("misys.form.file");
dojo.require("misys.form.SimpleTextarea");
dojo.require("misys.form.common");
dojo.require("misys.widget.Collaboration");
dojo.require("misys.validation.common");
dojo.require("misys.form.PercentNumberTextBox");
dojo.require("misys.binding.trade.ls_common");



(function(/*Dojo*/d, /*Dijit*/dj, /*m*/m) {
	
	var fxSection="fx-section";
	
	function _clearPrincipalFeeAcc(){
		dj.byId("principal_act_no").set("value", "");
		dj.byId("fee_act_no").set("value", "");	
	}
	
	function _clearRequiredFields(message){
		var callback = function() {
			var widget = dijit.byId("fin_amt");
		 	widget.set("state","Error");
	 		m.defaultBindTheFXTypes();
		 	dj.byId('fin_amt').set('value', '');
		 	dj.byId('fin_cur_code').set('value', '');
		 	dj.byId('principal_act_name').set('value', '');
		 	dj.byId('principal_act_cur_code').set('value', '');
		 	dj.byId('principal_act_no').set('value', '');
		 	dj.byId('principal_act_description').set('value', '');
		 	dj.byId('principal_act_pab').set('value', '');
		};
		m.dialog.show("ERROR", message, '', function(){
			setTimeout(callback, 500);
		});
		if(d.byId(fxSection) && (d.style(d.byId(fxSection),"display") !== "none"))
		{
			m.animate("wipeOut", d.byId(fxSection));
		}
	}
	
	d.mixin(m._config, {		
		initReAuthParams : function(){	
			
			var reAuthParams = { productCode : 'TF',
                    			 subProductCode : '',
                   				 transactionTypeCode : '01',
                   				 entity : ( dj.byId("entity") ? dj.byId("entity").get('value'): "" ), 
			                     currency : ( dj.byId("req_cur_code") ? dj.byId("req_cur_code").get('value'): ""),
              	     			 amount : ( dj.byId("req_amt") ? m.trimAmount(dj.byId("req_amt").get('value')): ""),
                   				 bankAbbvName : dj.byId("issuing_bank_abbv_name") ? dj.byId("issuing_bank_abbv_name").get("value") : "",
                   
                   				 es_field1 : ( dj.byId("req_amt") ? m.trimAmount(dj.byId("req_amt").get('value')): ""),
                   				 es_field2 : ''
               };

			return reAuthParams;
		},
	
	/*
	 * Overriding to add license items in the xml. 
	 */
	xmlTransform : function (/*String*/ xml) {
		var tdXMLStart = "<tf_tnx_record>";
		console.log("hello");
		/*
		 * Add license items tags, only in case of LC transaction.
		 * Else pass the input xml, without modification. (Ex : for create beneficiary from popup.)
		 */
		if(xml.indexOf(tdXMLStart) !== -1){
			// Setup the root of the XML string
			var xmlRoot = m._config.xmlTagName,
			transformedXml = xmlRoot ? ["<", xmlRoot, ">"] : [],			
					tdXMLEnd   = "</tf_tnx_record>",
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
	
	d.mixin(m, {
		
		fireFXAction : function(){
			if(m._config.fxParamData && m._config.fxParamData[dj.byId("sub_product_code")].fxParametersData.isFXEnabled === 'Y'){
				var menuName = dj.byId('menu_from').get('value');
				var fromCurrency,toCurrency;
				var financeCurrency = dj.byId('fin_cur_code').get('value');
				var amount = dj.byId('fin_amt').get('value');
				var principalAcctCurrency = '';
				if(dj.byId('principal_act_cur_code') && dj.byId('principal_act_cur_code').get('value')!== ''){
					principalAcctCurrency = dj.byId('principal_act_cur_code').get('value');
				}
				var productCode = dj.byId('product_code').get('value');
				var isDirectConversion = true;
				var bankAbbvName = '';
				if(dj.byId('issuing_bank_abbv_name') && dj.byId('issuing_bank_abbv_name').get('value')!== ''){
					bankAbbvName = dj.byId('issuing_bank_abbv_name').get('value');
				}
				var masterCurrency = dj.byId('bill_amt_cur_code').get('value');
				if(menuName === 'FROM_EXPORT_SCRATCH'||menuName === 'EXPORT_DRAFT')
					{
						masterCurrency = dj.byId('fin_cur_code').get('value'); // since bill cur = fin cur and bill cur is not available on screen
					}
				var importOrExport;
				if(menuName === 'FROM_IMPORT_SCRATCH' || menuName === 'FROM_IMPORT_LC' ||  menuName === 'FROM_IMPORT_COLLECTION' || menuName === 'IMPORT_DRAFT' || menuName === 'IMPORT_UNSIGNED'){
					importOrExport = 'IMPORT';
				}else if(menuName === 'FROM_EXPORT_LC' ||  menuName === 'FROM_EXPORT_COLLECTION' || menuName === 'EXPORT_DRAFT' || menuName === 'EXPORT_UNSIGNED'||menuName === 'FROM_EXPORT_SCRATCH'){
					importOrExport = 'EXPORT';
				}
				
				
					if(financeCurrency !== '' && !isNaN(amount) && productCode !== '' && bankAbbvName !== '' ){	
						menuName = dj.byId('menu_from').get('value');
						if(importOrExport && importOrExport === 'IMPORT'){
							if(menuName === 'FROM_IMPORT_SCRATCH' || (menuName === 'IMPORT_DRAFT' && masterCurrency === ''))
							{
								fromCurrency = financeCurrency;
								toCurrency   = principalAcctCurrency;	
								masterCurrency = principalAcctCurrency;
					 	    
						    }else if(principalAcctCurrency === '' && financeCurrency !== masterCurrency){
								fromCurrency = financeCurrency;
								toCurrency   = masterCurrency;							
							}else if(principalAcctCurrency !== ''){
								// if fin cur = bill amt cur and fin cur != pricipal act currency then no FX
								if(financeCurrency  === masterCurrency  && financeCurrency !== principalAcctCurrency){
								    if(dj.byId('fin_amt').get('value') >  dj.byId('bill_amt').get('value')){
								    	_clearRequiredFields(m.getLocalization("FXTranAmtGreaterThanBillAmtMessage"));
								    }		
								    if(d.byId(fxSection) && (d.style(d.byId(fxSection),"display") !== "none"))
									{
										m.animate("wipeOut", d.byId(fxSection));
									}
								}else if(financeCurrency === principalAcctCurrency && financeCurrency !== masterCurrency){
									fromCurrency = financeCurrency;
									toCurrency   = masterCurrency;
								}else if(masterCurrency === principalAcctCurrency && masterCurrency !== financeCurrency){
									fromCurrency = financeCurrency;
									toCurrency   = masterCurrency;
								}
							}
						}else if(importOrExport && importOrExport === 'EXPORT'){
							if(masterCurrency &&  masterCurrency !== '' && masterCurrency === financeCurrency && financeCurrency !== principalAcctCurrency){
								fromCurrency = financeCurrency;
								toCurrency   = principalAcctCurrency;
								masterCurrency = principalAcctCurrency;
							}
						}
						//var isFailure = false;
						if(fromCurrency && fromCurrency !== '' && toCurrency && toCurrency !== '' && fromCurrency !== toCurrency){
							if(d.byId(fxSection))
								{
									m.animate("wipeIn", d.byId(fxSection));
								}
							m.fetchFXDetails(fromCurrency, toCurrency, amount, productCode, bankAbbvName, masterCurrency, isDirectConversion);
							if(dj.byId('fx_rates_type_1') && dj.byId('fx_rates_type_1').get('checked')){
								if(isNaN(dj.byId('fx_exchange_rate').get('value')) || dj.byId('fx_exchange_rate_cur_code').get('value') === '' ||
										isNaN(dj.byId('fx_exchange_rate_amt').get('value')) || (m._config.fxParamData[dj.byId("sub_product_code")].fxParametersData.toleranceDispInd === 'Y' && (isNaN(dj.byId('fx_tolerance_rate').get('value')) || 
										isNaN(dj.byId('fx_tolerance_rate_amt').get('value')) || dj.byId('fx_tolerance_rate_cur_code').get('value') === ''))){
									_clearRequiredFields(m.getLocalization("FXDefaultErrorMessage"));
								} 
							}
						}else{
							if(d.byId(fxSection) && (d.style(d.byId(fxSection),"display") !== "none"))
							{
								m.animate("wipeOut", d.byId(fxSection));
							}
						m.defaultBindTheFXTypes();
						}
					}
			}
		},
	
	  bind : function() {
			//  summary:
		    //            Binds validations and events to fields in the form.              
		    //   tags:
		    //            public
		  	m.setValidation("fx_tolerance_rate", m.validateToleranceAndExchangeRate);
			m.setValidation("fx_exchange_rate", m.validateToleranceAndExchangeRate);
				
			
			m.setValidation('iss_date', m.validateIssueDate);
			m.setValidation('maturity_date', m.validateTFMaturityDate);
			m.setValidation('fin_cur_code', m.validateCurrency);
		
			m.connect('iss_date', 'onBlur', m.getMaturityDate);
			m.connect('tenor', 'onBlur', m.getMaturityDate);
			m.connect('maturity_date', 'onBlur', m.getMaturityDate);
			m.connect('issuing_bank_abbv_name', 'onChange', m.populateReferences);
			m.connect("issuing_bank_abbv_name", "onChange", m.updateBusinessDate);
			m.connect('issuing_bank_customer_reference', 'onChange', m.setApplicantReference);
			m.connect("issuing_bank_abbv_name", "onChange", m.updateBusinessDate);
			if(dj.byId('issuing_bank_abbv_name'))
			{
				m.connect('entity', 'onChange', function(){dj.byId('issuing_bank_abbv_name').onChange();});
			}
			m.connect('fin_cur_code', 'onChange', function(){
				m.setCurrency(this, ['fin_amt']);
				if(dj.byId("req_cur_code"))
				{
					dj.byId("req_cur_code").set("value", dj.byId("fin_cur_code").get("value"));
					m.setCurrency(dj.byId('req_cur_code'), ['req_amt']);
					m.setValidation('req_cur_code', m.validateCurrency);					
				}
			});
			
			m.connect('req_amt', 'onChange', function(){
				m.setTnxAmt(this.get('value'));
				});
			if(m._config.fxParamData && m._config.fxParamData[dj.byId("sub_product_code")] && m._config.fxParamData[dj.byId("sub_product_code")].fxParametersData.isFXEnabled === 'Y'){
				//Start FX Actions
				m.connect('fin_cur_code', 'onBlur', function(){
					m.setCurrency(this, ['fin_amt']);
					if(dj.byId('fin_cur_code').get('value') !== '' && !isNaN(dj.byId('fin_amt').get('value'))){
						m.fireFXAction();
					}else{
						m.defaultBindTheFXTypes();
					}
				});
				m.connect('fin_amt', 'onBlur', function(){
					if(!isNaN(dj.byId('fin_amt').get('value')) && dj.byId('fin_cur_code').get('value') !== ''){
						m.fireFXAction();
					}else{						
						m.defaultBindTheFXTypes();
					}
				});
				
				m.connect('principal_act_name', 'onChange', function(){
					if(dj.byId('principal_act_cur_code') && dj.byId('principal_act_cur_code').get('value') !== ''){
						m.fireFXAction();
					}else{						
						m.defaultBindTheFXTypes();
						if(d.byId(fxSection) && (d.style(d.byId(fxSection),"display") !== "none"))
						{
							m.animate("wipeOut", d.byId(fxSection));
						}
					}
				});
				//End FX Actions
			}
			
			m.connect("entity_img_label","onClick",_clearPrincipalFeeAcc);
			
			m.connect("license_lookup","onClick", function(){
				m.getLicenses("tf");
			});
			
			// On Blur of request percentage, calculate the requested amount value.
			m.connect("req_pct","onBlur",function(){
				if(this.get("value") !== null && !isNaN(this.get("value")) && parseFloat(this.get("value")) <= 100 && parseFloat(this.get("value")) > 0)
				{
					var convertedAmt = (parseFloat(this.get("value")) * parseFloat(dj.byId("fin_amt").get("value"))) / 100;
					dj.byId("req_amt").set("value", convertedAmt);
				}
				else
				{
					displayMessage = misys.getLocalization("incorrectPercentage");
					this.focus();
			 		this.set("state","Error");
			 		dj.hideTooltip(this.domNode);
			 		dj.showTooltip(displayMessage, this.domNode, 0);
				}
			});
			m.connect("fin_amt","onBlur",function(){
				if(dj.byId("req_pct") && dj.byId("req_pct").get("value") !== null && !isNaN(dj.byId("req_pct").get("value")))
				{
					if(parseFloat(dj.byId("req_pct").get("value")) <= 100 && !(parseFloat(dj.byId("req_pct").get("value")) <= 0))
					{
						var convertedAmt = (parseFloat(dj.byId("req_pct").get("value")) * parseFloat(dj.byId("fin_amt").get("value"))) / 100;
						dj.byId("req_amt").set("value", convertedAmt);
					}
				}
				else if(dj.byId("req_amt"))
				{
					dj.byId("req_amt").set("value", dj.byId("fin_amt").get("value"));
				}
			});
	  },

	   onFormLoad : function() {
			//  summary:
		    //          Events to perform on page load.
		    //  tags:
		    //         public
		
			// Additional onload events for dynamic fields follow
		   var menuName = dj.byId('menu_from').get('value');
			m.setCurrency(dj.byId('fin_cur_code'), ['fin_amt']);
			m.setCurrency(dj.byId('bill_amt_cur_code'), ['bill_amt']);
			if(menuName){
				if(menuName === 'FROM_EXPORT_LC' || menuName === 'FROM_EXPORT_COLLECTION'){
					dj.byId('fin_cur_code').set('readOnly', true);
				}
				if(menuName === 'EXPORT_DRAFT'){
					if(dj.byId('fin_liab_amt').get('value') !== ''){
					   dj.byId('fin_cur_code').set('readOnly', true);
					}
				}
			}
			if(dj.byId('bill_amt')){
				dj.byId('bill_amt').set('readOnly', true);
				dj.byId('bill_amt_cur_code').set('readOnly', true);
			}
		
			var issuingBankCustRef = dj.byId('issuing_bank_customer_reference');
			var tempReferenceValue;
			if(issuingBankCustRef){
				tempReferenceValue = issuingBankCustRef.value;
			}
			var issuingBankAbbvName = dj.byId('issuing_bank_abbv_name');
			if(issuingBankAbbvName)
			{
				issuingBankAbbvName.onChange();
			}
			
			if(issuingBankCustRef)
			{
				issuingBankCustRef.onChange();
				issuingBankCustRef.set('value',tempReferenceValue);
			}
			
			if(menuName == 'FROM_IMPORT_SCRATCH' || menuName == 'FROM_EXPORT_SCRATCH' || menuName == 'FROM_GENERAL_SCRATCH' || menuName == 'GENERAL_DRAFT'){
				var billAmtDiv = dojo.byId('bill_amount_div');
				if(billAmtDiv)
				{
					dojo.style(billAmtDiv, "display", "none");
				}
			}
			
			//hide fx section by default
			if(d.byId(fxSection))
				{
					//show fx section if previously enabled (in case of draft)
					 if((dj.byId("fx_exchange_rate_cur_code") && dj.byId("fx_exchange_rate_cur_code").get("value")!== "")|| (dj.byId("fx_total_utilise_cur_code") && dj.byId("fx_total_utilise_cur_code").get("value")!== ""))
						{
								m.animate("wipeIn", d.byId(fxSection));											
						}else
						{
							d.style(fxSection,"display","none");
						}
				}
			//Start FX Actions	
				if(m._config.fxParamData && m._config.fxParamData[dj.byId("sub_product_code")] && m._config.fxParamData[dj.byId("sub_product_code")].fxParametersData.isFXEnabled === 'Y'){
					m.initializeFX(dj.byId("sub_product_code"));
					m.onloadFXActions();
				}
			//End FX Actions
			m.setTnxAmt(dj.byId("req_amt").get("value"));
			m.setCurrency(dj.byId("fin_cur_code"), ["req_amt"]);
			m.populateGridOnLoad("tf");
	   },
        
        /**
         *<h4>Summary:</h4>
		 *Calculates the converted amount based on exchange rate fetched from server using Ajax call
		 *@param {String} amount to be converted
		 *@param {String} src_currency from currency
		 *@param {String} dest_currency destination currency where amount to be converted
		 *	Amount to be returned as converted amount.
		 *@method calculateEquivalentAmount
         */
        calculateEquivalentAmount : function(/*String*/ amount, /*String*/ src_currency, /*String*/ dest_currency) {
        	
        	console.debug("Getting converted euivalent amount ...");
        	var convertedAmount = amount;
        	m.xhrPost({
				url : m.getServletURL("/screen/AjaxScreen/action/GetConvertedAmount"),
				handleAs :"json",
				sync : true,
				content : {
					original_amt : amount,
					src_curr : src_currency,
					dest_curr : dest_currency,
					token : document.getElementById("_token").getAttribute('value')
				},
				load : function(response, args){
					convertedAmount = response.convertedAmount;
				},
				error : function(response, args){
					console.error("[misys.binding.trade.create_tf] calculateEquivalentAmount error", response);
				}
			});
        	
        	return convertedAmount;
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
			var entity = dj.byId("entity");
				if (entity && entity.get("value") == "") {
					return false;
				} else {
					return true;
				}		
		},
        
	    beforeSubmitValidations : function() {

	    	var validation_flag = true;
		   //Validation check for Transfer Amount value which should be greater than zero
		   if(dj.byId("fin_amt"))
		   {
			   if(!m.validateAmount((dj.byId("fin_amt"))?dj.byId("fin_amt"):0))
			   {
				   m._config.onSubmitErrorMsg =  m.getLocalization("amountcannotzero");
				   dj.byId("fin_amt").set("value", "");
				   return false;
			   }
		   }

		   if(dj.byId("issuing_bank_abbv_name") && !m.validateApplDate(dj.byId("issuing_bank_abbv_name").get("value")))
			{
				m._config.onSubmitErrorMsg = m.getLocalization('changeInApplicationDates');
				m.goToTop();
				return false;
     		}
			
		   var finAmtVal = dj.byId("fin_amt");
		   var billAmtVal = dj.byId("bill_amt");
		   var billAmtCurCode = dj.byId("bill_amt_cur_code");
		   var finAmtCurCode = dj.byId("fin_cur_code");
		   var fxExcgRateAmt =dj.byId("fx_exchange_rate_amt");
		   		   		   		 
		   if( (billAmtCurCode.get("value") === finAmtCurCode.get("value")) &&  (dojo.number.parse(finAmtVal.get("value")) >  dojo.number.parse(billAmtVal.get("value"))) ){
			   	m._config.onSubmitErrorMsg =  m.getLocalization("FinAmtGreaterThanBillAmtValidation");	
			    dj.byId("fin_amt").set("value", "");
				return false;			   			   
		   }
		   else if (billAmtCurCode.get("value") !== finAmtCurCode.get("value")) {
			   var convertedAmt = m.calculateEquivalentAmount(finAmtVal.get("value"), finAmtCurCode.get("value"), billAmtCurCode.get("value"));
			   if( dojo.number.parse(convertedAmt) >  dojo.number.parse(billAmtVal.get("value")) ) {
				   	m._config.onSubmitErrorMsg =  m.getLocalization("FinAmtGreaterThanBillAmtValidation");	
				    dj.byId("fin_amt").set("value", "");
					return false;			   			   
			   }
		   }
		   
		   if(fxExcgRateAmt){
			   if((billAmtCurCode.get("value") !== finAmtCurCode.get("value")) && (dojo.number.parse(fxExcgRateAmt.get("value")) >  dojo.number.parse(billAmtVal.get("value")))){
				   m._config.onSubmitErrorMsg =  m.getLocalization("FinAmtGreaterThanBillAmtValidation");
				   dj.byId("fin_amt").set("value", "");
				   return false;
			   }
		   }
		   var principleAccount = dj.byId("principal_act_no");
			if(principleAccount && principleAccount.get('value')!= "")
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
			if(feeAccount && feeAccount.get('value')!= "")
			{
				if(!m.validateFeeAccount())
				{
					m._config.onSubmitErrorMsg = m.getLocalization('invalidFeeAccountError',[ feeAccount.get("displayedValue")]);
					m.showTooltip(m.getLocalization('invalidFeeAccountError',[ feeAccount.get("displayedValue")]), feeAccount.domNode);
					feeAccount.focus();
					return false;
				}
			}
		   if(m._config.fxParamData && m._config.fxParamData[dj.byId("sub_product_code")].fxParametersData.isFXEnabled === 'Y'){
				if(!m.fxBeforeSubmitValidation())
				{
					return false;
				}
				var valid = true;
				var error_message = "";
				var boardRateOption = dj.byId("fx_rates_type_2");
				var totalUtiliseAmt = dj.byId("fx_total_utilise_amt");
				var finAmt = dj.byId("fin_amt");
				
				if (boardRateOption.get('checked') && totalUtiliseAmt && !isNaN(totalUtiliseAmt.get('value')) && finAmt && !isNaN(finAmt.get('value'))) {
					if(dojo.number.parse(finAmt.get('value')) < dojo.number.parse(totalUtiliseAmt.get('value'))){
					error_message += m.getLocalization("FXUtiliseAmtGreaterMessage");
					valid = false;
					}
				}
				
				m._config.onSubmitErrorMsg =  error_message;
				return valid;
		   }
		   if(dj.byId("issuing_bank_abbv_name") && !m.validateApplDate(dj.byId("issuing_bank_abbv_name").get("value")))
			{
				m._config.onSubmitErrorMsg = m.getLocalization('changeInApplicationDates');
				m.goToTop();
				return false;
     		}
			   return m.validateLSAmtSumAgainstTnxAmt("fin");
		   
		   
		   
		}
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.trade.create_tf_client');