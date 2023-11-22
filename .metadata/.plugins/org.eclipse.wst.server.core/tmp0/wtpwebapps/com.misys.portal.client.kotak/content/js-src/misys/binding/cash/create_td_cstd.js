dojo.provide("misys.binding.cash.create_td_cstd");

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
dojo.require("misys.binding.cash.ft_common");
dojo.require("misys.form.BusinessDateTextBox");
dojo.require("dojox.xml.DomParser");
dojo.require("misys.binding.common.create_fx_multibank");

(function(/*Dojo*/d, /*Dijit*/dj, /*m*/m) {
	
	var fxMsgType = d.byId('fx-message-type');
	var hasCustomerBankValue = false;
	var formLoading = true;
	
	function _setFieldValue(fieldName,fieldValue)
	{
		if(dj.byId(fieldName))
	   {
	    	dj.byId(fieldName).set('value', fieldValue);
	   }
	}
	
	function _clearFields()
	{
		if(dj.byId('display_interest'))
		{
			dj.byId('interest').set('value', '');
			dj.byId('display_interest').set('value', '');
			if(dj.byId('contract_amt'))
    		{
    			dj.byId('contract_amt').set('value','');
    		}
			if(dj.byId('fx_total_utilise_amt'))
    		{
    			dj.byId('fx_total_utilise_amt').set('value','');
    		}
		}
	}
	
	
	
	function _fncAutoForwardDate()
	{

  	   var valid = false;
  	   var subproductcode = dijit.byId("sub_product_code") ? dijit.byId("sub_product_code").get("value") : "";
  	   var modeValue = dijit.byId("mode") ? dijit.byId("mode").get("value") : "";
	       if(modeValue === "DRAFT")
	       {		    	 
  		  valid =  m.validateHolidaysAndCutOffTime("issuing_bank_abbv_name","sub_product_code",modeValue,["value Date"],["value_date"],"entity","td_cur_code","td_amt");		    		  
	       }
	       else if(modeValue === "UNSIGNED")
	       {
  		   valid =  m.validateHolidaysAndCutOffTime("issuing_bank_abbv_name","sub_product_code_unsigned",modeValue,["value Date"],["value_date_unsigned"],"display_entity_unsigned","td_cur_code_unsigned","td_amt_unsigned");		    		   
	       }
	       else
	       {
	    	    m._config.onSubmitErrorMsg = m.getLocalization("technicalErrorWhileValidatingBusinessDays");
				console.debug("Mode is unknown to validate Holidays and Cut-Off Time");
				valid =  false;
	       }
 
	       if(valid)
	       {
	    	   m._config.holidayCutOffEnabled = false;
	       }
	       return valid;
	     
		
	}
	function _formatDate(dateWithOutSeperator)
	{
		//Summary:
		//		Formats the date dd/MM/yyyy format
		if(("S" + dateWithOutSeperator !== "S") && dateWithOutSeperator.length > 7)
		{
			var day 	=	"",
				month	=	"",
				year	=	"";
				day		=	dateWithOutSeperator.substring(0,2);
				month	=	dateWithOutSeperator.substring(2,4);
				year	=	dateWithOutSeperator.substring(4);
				
				return 	day + "/" + month + "/" + year;
		}
		else
		{
				console.debug("Unable to Format the date [Invalid Date Value]:"+dateWithOutSeperator);
				return dateWithOutSeperator;
		}
	}
	
	function _clearRequiredFields(message){
		var callback = function() {
			var widget = dijit.byId("td_amt");
		 	widget.set("state","Error");
	 		m.defaultBindTheFXTypes();
		 	dj.byId('td_amt').set('value', '');
		 	if(dj.byId('td_cur_code') && !dj.byId('td_cur_code').get('readOnly')){
		 		dj.byId('td_cur_code').set('value', '');
		 	}
		};
		m.dialog.show("ERROR", message, '', function(){
			setTimeout(callback, 500);
		});
		if(d.byId("fx-section") && (d.style(d.byId("fx-section"),"display") !== "none"))
		{
			m.animate("wipeOut", d.byId('fx-section'));
		}
	}				
	
	function _fncTenorForSelectedDeposit(depositType){
		var typeItems 	= [],
	        typeValues 	= [],
	        array  = [],
		    tenorTypes =  "";
		if(dj.byId('tenor_term_code')){
		tenorTypes	= dj.byId('tenor_term_code');
		tenorTypes.store = null;
		if (misys._config.depositTypes)
		{
		array = misys._config.depositTypes[depositType].tenor;
		dojo.forEach(array,function(tenorType,index){
			  typeItems[index] = misys._config.depositTypes[depositType].tenor[tenorType].key;
			  typeValues[index] = misys._config.depositTypes[depositType].tenor[tenorType].value;
		  });
		
		 jsonData = {"identifier" :"id", "items" : []};
		 productStore = new dojo.data.ItemFileWriteStore( {data : jsonData });
		 
		 for(var j = 0; j < typeItems.length; j++){
			 productStore.newItem( {"id" :  typeItems[j], "name" : typeValues[j]});
		 }
		 tenorTypes.store = productStore;
		}
		 //Remove previously entered text if any
		 tenorTypes.set("value","");
		}
	}
	
	function _showFXSection(){
		//hide all fields that are irrelevant for TD
		m.animate("wipeIn", d.byId('fx-section'));
		
	}
	
	function _loadFX(){
		if(!isNaN(dj.byId('td_amt').get('value')) && dj.byId('td_cur_code').get('value') !== ''){
			m.fireFXAction();
		}else{
			if(d.byId("fx-section") && (d.style(d.byId("fx-section"),"display") !== "none"))
			{
				m.animate("wipeOut", d.byId('fx-section'));
			}
			m.defaultBindTheFXTypes();
		}
	}
	
	function _fncValidCurrencies(depositType, tenorType){
		var typeItems 	= [],
	        typeValues 	= [],
	        array  = [],
		    curTypes =  "",
			currentCurrencyValue,
			isCurrentCurrValid = false;
		if(dj.byId('td_cur_code')){
			curTypes = dj.byId('td_cur_code');
			curTypes.store = null;
			if(dj.byId('td_cur_code'))
			{
				currentCurrencyValue = dj.byId('td_cur_code').get("value");
			}
			if (misys._config.depositTypes && misys._config.depositTypes[depositType] && misys._config.depositTypes[depositType].tenor[tenorType])
			{
			array = misys._config.depositTypes[depositType].tenor[tenorType].currency;
			array.sort();
			dojo.forEach(array,function(currency, index){
				  typeItems[index] = currency;
				  typeValues[index] = currency;
				  if(currentCurrencyValue === currency)
				  {
					  isCurrentCurrValid = true;
				  }
			  });
			
			 jsonData = {"identifier" :"id", "items" : []};
			 productStore = new dojo.data.ItemFileWriteStore( {data : jsonData });
			 
			 for(var j = 0; j < typeItems.length; j++){
				 productStore.newItem( {"id" :  typeItems[j], "name" : typeValues[j]});
			 }
			 curTypes.store = productStore;
			}
			if(!isCurrentCurrValid && dj.byId('td_cur_code'))
			{
				dj.byId('td_cur_code').set("value", "");
			}
			 //Remove previously entered text if any
			 //curTypes.set("value","");
			}
	}
	
	function _fncMaturityInstForSelectedDeposit(depositType){
		  var typeItems 	= [],
		      typeValues 	= [],
			  maturityTypes = "";
		  if(dj.byId('maturity_instruction')){
		  maturityTypes	= dj.byId('maturity_instruction');
		  maturityTypes.store = null;
		  var maturityCodes = misys._config.maturityCodes[depositType];
		  var maturityDesc = misys._config.maturityCodesDescription[depositType];
		  for(var i =0; i< maturityCodes.length; i++){
			  typeItems[i] = maturityCodes[i];
		  }
		  for(var k =0; k< maturityDesc.length ; k++){
			  typeValues[k] = maturityDesc[k];
		  }
		 jsonData = {"identifier" :"id", "label" : "name","items" : []};	 
		 productStore = new dojo.data.ItemFileWriteStore( {data : jsonData });
		 
		 for(var j = 0; j < typeItems.length; j++){
			 productStore.newItem( {"id" : typeItems[j], "name" :typeValues[j]});
		 }
		 maturityTypes.store = productStore;
		 maturityTypes.set("value","");
		 }
	}
	
	function _fncMandatoryFlagForSelectedMaturityInst(depositType){
		  var typeItems 	= [],
		      typeMandatory 	= [],
		      mandatoryTypes = "";
		  if(dj.byId('maturity_mandatory')){
			  mandatoryTypes= dj.byId('maturity_mandatory');
			  mandatoryTypes.store = null;
		  var maturityCodes = misys._config.maturityCodes[depositType];
		  var MandatoryFlag = misys._config.maturityMandatoryFlag[depositType];
		  
		  for(var i =0; (maturityCodes && i< maturityCodes.length); i++){
			  typeItems[i] = maturityCodes[i];
		  }
		  for(var k =0; (MandatoryFlag && k< MandatoryFlag.length); k++){
			  typeMandatory[k] = MandatoryFlag[k];
		  }

		 jsonData = {"identifier" :"id", "label" : "name","items" : []};
		 
		 productStore1 = new dojo.data.ItemFileWriteStore( {data : jsonData });
		 
		 for(var j = 0; (typeItems && j < typeItems.length); j++){
			 productStore1.newItem( {"id" : typeItems[j], "name" :typeMandatory[j]});
		 }
		 mandatoryTypes.store = productStore1;
		 mandatoryTypes.set("value","");
		 }
	}
	
	
	function _fncDisplayOrHideEquivalentContractRate(){
		if(dj.byId('fx_rates_type_2') && dj.byId('fx_rates_type_2').get('checked'))
		   {
				m.animate("wipeIn", d.byId('equivalent-contract-amt'));
		   }
		else
		  {
			    m.animate("wipeOut", d.byId('equivalent-contract-amt'));
			    if(dj.byId("contract_amt"))
			    	{
			    		dj.byId("contract_amt").set("value","");
			    	}
			    d.forEach(d.query(".amtUtiliseDiv"),function(node){
				d.style(node,"display","none");
			    });	
		  }
		
	}
	function _fncDisplayOrHideInterestLink(){
	if(dj.byId('service_enabled')&& dj.byId('service_enabled').get('value')==='Y')
	 {
		if((dj.byId('tenor_term_code') && dj.byId('tenor_term_code').get('value') !== '') && (dj.byId('td_cur_code') && dj.byId('td_cur_code').get('value') !== '') && (dj.byId('td_amt') && !isNaN(dj.byId('td_amt').get('value'))) && (dj.byId('maturity_instruction') && dj.byId('maturity_instruction').get('value') !== '') && (dj.byId('applicant_act_name') && dj.byId('applicant_act_name').get('value') !== '') && (dj.byId('credit_act_name') && dj.byId('credit_act_name').get('value') !== ''))
		{
			d.style("interestLink","display","inline");
			_fncDisplayOrHideEquivalentContractRate();
		}
		else
		{
			d.style("interestLink","display","none");
			_fncDisplayOrHideEquivalentContractRate();
		}	
	 }
	}
	
	function _getInterestRateDetails(){
		//  summary:
	    //         Gets the  interest rate details from interface
	    //  tags:
	    //         public
		var tenor = dj.byId('tenor_term_code').getValue(),
			placementAmtCur = dj.byId('td_cur_code').getValue(),
			placementAmt =  dj.byId('td_amt').getValue(),
			refId        = dj.byId('ref_id').getValue(),
			placementAcct = dj.byId('placement_act_no').getValue(),
			productCode   = "TD",
			renewal		= "",
			interestRate = "",
			debitAcctNbr = dj.byId('applicant_act_no').getValue(),
			debitAcctCur = dj.byId('applicant_act_cur_code').getValue(),
			maturityInstruction = dj.byId('maturity_instruction').getValue(),
			creditAcctNbr = dj.byId('credit_act_no').getValue(),
			creditAcctCur = dj.byId('credit_act_cur_code').getValue(),
			tnxId = dj.byId('tnx_id').getValue(),
		    entity =dj.byId("entity") ? dj.byId("entity").get("value") : "",
		    applicantReference = dj.byId('applicant_reference').getValue(),
		    tdType = dj.byId('td_type').getValue(),
			fxRatesType = "", fxExchangeRate="", fxExchangeRateCur="", fxExchangeRateAmt="", fxContractNbr1="", fxContractNbrCur1="", fxContractNbrAmt1="";
		    if(dj.byId("fx_rates_type_1") && dj.byId("fx_rates_type_1").get('checked'))
	    	{
		    	fxRatesType = dj.byId("fx_rates_type_1").get("value");
	    	}
		    else if(dj.byId("fx_rates_type_2") && dj.byId("fx_rates_type_2").get('checked'))
	    	{
		    	fxRatesType = dj.byId("fx_rates_type_2").get("value");
	    	}
		    
		    if(fxRatesType && fxRatesType !== '' && fxRatesType === "01" && dj.byId('fx_exchange_rate')){
			    fxExchangeRate = dj.byId('fx_exchange_rate').getValue();
			    fxExchangeRateCur = dj.byId('fx_exchange_rate_cur_code').getValue();
			    fxExchangeRateAmt = dj.byId('fx_exchange_rate_amt').getValue();
		    }else if(fxRatesType && fxRatesType !== '' && fxRatesType === "02"){
				fxContractNbr1 = dj.byId('fx_contract_nbr_1').getValue();
				//since ideally, there is only one contract for TD placement, we can fetch values from td amt and td_cur_code
				if(dj.byId('fx_contract_nbr_cur_code_1'))
				{
					fxContractNbrCur1 = dj.byId('fx_contract_nbr_cur_code_1').getValue();
				}
				else
				{
					fxContractNbrCur1 = dj.byId('td_cur_code').getValue();
				}
				if(dj.byId('fx_contract_nbr_amt_1'))
				{
					fxContractNbrAmt1 = dj.byId('fx_contract_nbr_amt_1').getValue();
				}
				else
				{
					fxContractNbrAmt1 = dj.byId('td_amt').getValue();
				}
		    }
			
		     //clear the value for interest rate if its already set
		    _clearFields();
		    
		    if(isNaN(fxExchangeRateAmt))
		    {
		    	fxExchangeRateAmt = '';
		    }
		   
		    m.xhrPost( {
				url : misys.getServletURL("/screen/AjaxScreen/action/TDInterestRateInquiryDetails") ,
				handleAs : "json",
				sync : true,
				content : {
					tenor 				: tenor,
					placementAmtCur 	: placementAmtCur,
					placementAmt  		: placementAmt,
					refId		  		: refId,
					placementAcct 		: placementAcct,
					productCode   		: productCode,
					renewal       		: renewal,
					debitAcctNbr 		: debitAcctNbr,
					debitAcctCur  		: debitAcctCur,
					maturityInstruction : maturityInstruction,
					creditAcctNbr 		: creditAcctNbr,
					creditAcctCur 		: creditAcctCur,
					tnxId 				: tnxId,
					entity 				: entity,
					fxRatesType 		: fxRatesType,
					fxExchangeRate 		: fxExchangeRate,
					fxExchangeRateCur 	: fxExchangeRateCur,
					fxExchangeRateAmt 	: fxExchangeRateAmt,
					fxContractNbr1 		: fxContractNbr1,
					fxContractNbrCur1 	: fxContractNbrCur1,
					fxContractNbrAmt1 	: fxContractNbrAmt1,
					applicantReference 	: applicantReference,
					tdType 				: tdType
				},
				load : function(response, args){
					var interestField	=	dj.byId('display_interest'),
						tdAmountField	=	dj.byId('td_amt');
					switch(response.StatusCode)
					{
						case '0000000':
									   _setFieldValue('DueWtdrwDt',response.DueWtdrwDt);
									   _setFieldValue('bank_value_date',_formatDate(response.bank_value_date));
									   _setFieldValue('HoldCode',response.HoldCode);
									   _setFieldValue('display_interest',response.display_interest);
									   _setFieldValue('interest',response.interest);
									   _setFieldValue('PledgeBranchCode',response.PledgeBranchCode);
									   _setFieldValue('FundValDate',response.FundValDate);
									   _setFieldValue('ReplCost',response.ReplCost);
									   _setFieldValue('SibidSibor',response.SibidSibor);
									   _setFieldValue('WaiveIndicator',response.WaiveIndicator);
									   _setFieldValue('TranchNum',response.TranchNum);
									   _setFieldValue('MinAmt',response.MinAmt);
									   _setFieldValue('SgdDepAmt',response.SgdDepAmt);
									   _setFieldValue('SgdXchgRate',response.SgdXchgRate);
									   _setFieldValue('ConvertedAmt',response.ConvertedAmt);
									   _setFieldValue('CtrRate',response.CtrRate);
									   _setFieldValue('contract_amt',response.contract_amt);
									   _setFieldValue('FcfdAmt',response.FcfdAmt);
									   _setFieldValue('interestToken',response.Interest_Token);									  
									   break;
						case '0002001':
										//focus on the widget and set state to error and display a tool tip indicating the same
										tdAmountField.focus();
										tdAmountField.set("value","");
										tdAmountField.set("state","Error");
										dj.hideTooltip(tdAmountField.domNode);
										dj.showTooltip(response.ErrorDesc, tdAmountField.domNode, 0);
										break;
						case 'TECHNICAL_ERROR':
										var displayMessage = misys.getLocalization('technicalErrorWhileInterestRateFetch');
										//focus on the widget and set state to error and display a tool tip indicating the same
										interestField.focus();
										interestField.set("value","");
										interestField.set("state","Error");
										dj.hideTooltip(interestField.domNode);
										dj.showTooltip(displayMessage, interestField.domNode, 0);
										break;
						default:
										//focus on the widget and set state to error and display a tool tip indicating the same
								   		interestField.focus();
								   		interestField.set("value","");
								   		interestField.set("state","Error");
										dj.hideTooltip(interestField.domNode);
										dj.showTooltip(response.ErrorDesc, interestField.domNode, 0);
										break;
					
					}
				},
				error : function(response, args){
					console.error('[] ');
					console.error(response);					
				}
	     });
	}
	
	/**
	 * <h4>Summary:</h4>
	 * This method prepares the related Customer banks for the selected Group customer entities.
	 * This field is expected to be disabled until the selection of Entity field.
	 */
	function _populateCustomerBanks(isFormLoading)
	{
		var onFormLoad = isFormLoading?true:false;
		var entityField = dj.byId("entity");
		var entityFieldValue = dj.byId("entity")?dj.byId("entity").get('value'):"";
		var customerBankField = dj.byId("customer_bank");
		
		if(entityFieldValue && customerBankField)
		{
			var entityBanksDataStore = null;
			if(entityFieldValue !== "")
			{
				entityBanksDataStore = m._config.entityBanksCollection[entityFieldValue];
			}
			customerBankField.set('disabled', false);
			customerBankField.set('required', true);
			if(!onFormLoad)
			{
				customerBankField.set('value', "");
			}
			
			if (entityBanksDataStore)
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
				customerBankField.set('value', "*");
			}
			
		}
		else if(customerBankField && customerBankField.get("value") === "")
		{
			var customerBankDataStore = null;
			customerBankDataStore = m._config.wildcardLinkedBanksCollection["customerBanksForWithoutEntity"];
			
			if (customerBankDataStore)
			{	
				customerBankField.store = new dojo.data.ItemFileReadStore({
					data :
					{
						identifier : "value",
						label : "name",
						items : customerBankDataStore
					}
				});
				customerBankField.fetchProperties =
				{
					sort : [
					{
						attribute : "name"
					} ]
				};
			}	
		}
		else if(customerBankField)
		{
			customerBankField.set('disabled', true);
			customerBankField.set('required', false);
			customerBankField.set('value', "");
		}
	}
	
	/**
	 * Customer Bank Field onChange handler
	 */
	function _handleCustomerBankOnChangeFields()
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
			if(misys && misys._config && misys._config.option_for_app_date === "SCRATCH")
			{
				dj.byId("appl_date").set("value", date);
				document.getElementById('appl_date_view_row').childNodes[1].innerHTML = date;
				if(dj.byId("appl_date_hidden")){
					dj.byId("appl_date_hidden").set("value", date1);
				}
			}
			if(dj.byId("todays_date")){
				dj.byId("todays_date").set("value", date1);
			}
			/*if(dj.byId('value_date')){
				dj.byId('value_date').set('value', date);
			}*/
			/*if(document.getElementById('value_date_row')){
				document.getElementById('value_date_row').childNodes[1].innerHTML = date;
			}*/
		}
		if(!hasCustomerBankValue && !formLoading)
		{	
			dj.byId("applicant_act_name").set("value", "");
			dj.byId("credit_act_name").set("value", "");
			dj.byId("td_type").set("value", "");
			dj.byId("tenor_term_code").set("value", "");
			dj.byId("maturity_instruction").set("value", "");
			dj.byId("td_cur_code").set("value", "");
			dj.byId("td_amt").set("value", "");
			dj.byId("value_date").set("value", null);
    		dj.byId("issuing_bank_abbv_name").set("value",customer_bank);
    		bank_desc_name = misys._config.customerBankDetails[customer_bank][0].value;
    		dj.byId("issuing_bank_name").set("value",bank_desc_name);
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
		
		if(dj.byId("issuing_bank_abbv_name") && dj.byId("issuing_bank_abbv_name").get("value")!=="")
		{	
			m.initializeFX(m._config.subProductCode, dj.byId("issuing_bank_abbv_name").get("value"));
			if(dj.byId('applicant_act_cur_code') && dj.byId('applicant_act_cur_code').get('value') !== '' && dj.byId('selected_td_cur') && dj.byId('selected_td_cur').get('value') !== '' && dj.byId('applicant_act_cur_code').get('value')!== dj.byId('selected_td_cur').get('value') && !isNaN(dj.byId("td_amt").get("value")))
			{
				m.onloadFXActions();
			}
			else
			{
				m.defaultBindTheFXTypes();
			}
			
			_handleFXAction();
		}
	}
	
	function _handleFXAction()
	{
		if(m._config.fxParamData && dj.byId("issuing_bank_abbv_name") && dj.byId("issuing_bank_abbv_name").get("value")!=="" && m._config.fxParamData[m._config.subProductCode][dj.byId("issuing_bank_abbv_name").get("value")].isFXEnabled === 'Y'){
			//Start FX Actions
			m.connect('td_cur_code', 'onChange', function(){
				m.setCurrency(this, ['td_amt']);
				if(dj.byId('td_cur_code').get('value') !== '' && !isNaN(dj.byId('td_amt').get('value'))){
						if(dj.byId('selected_td_cur') && dj.byId('selected_td_cur').get("value")!== dj.byId('td_cur_code').get('value'))
						{
							m.fireFXAction();
							dj.byId('selected_td_cur').set("value","");
						}
				}else{
					if(d.byId("fx-section") && (d.style(d.byId("fx-section"),"display") !== "none"))
					{
						m.animate("wipeOut", d.byId('fx-section'));
					}
					m.defaultBindTheFXTypes();
				}
			});
			m.connect('td_amt', 'onBlur', function(){
				m.setTnxAmt(this.get('value'));
				_loadFX();
			});
			
			 m.connect('fx_rates_type_2', 'onChange', function(){
				 if(dj.byId("fx_rates_type_2").get("checked"))
					 {
						m.animate("wipeIn", d.byId('equivalent-contract-amt'));
						 if(dj.byId("contract_cur_code"))
						 {
						 	dj.byId("contract_cur_code").set("value",dj.byId('applicant_act_cur_code').get("value"));
						 }
					 }
				 else
					 {
					 	m.animate("wipeOut", d.byId('equivalent-contract-amt'));
					 	if(dj.byId("contract_cur_code"))
					 	{
					 		dj.byId("contract_cur_code").set("value","");
					 	}
					 	dj.byId('fx_contract_nbr_1').reset();						 	
					 }
				 if(dj.byId("interest"))
				 {
					 dj.byId("interest").reset();
				 }
				 if(dj.byId("display_interest"))
				 {
				 	dj.byId("display_interest").reset();
			 	 }
				 if(dj.byId("contract_amt"))
				 {
					 dj.byId("contract_amt").reset();
				 }
				 if(dj.byId('fx_total_utilise_amt') && dj.byId('fx_total_utilise_amt').get("value") === "")
				 {
			 		dj.byId('fx_total_utilise_amt').reset();	
			 	 }
			 });
						
			 m.connect('contract_amt','onChange', function(){
				 if(dj.byId("contract_cur_code"))
					 {
					 	dj.byId("contract_cur_code").set("value",dj.byId('applicant_act_cur_code').get("value"));
					 }
			 });
			 m.setCurrency(dj.byId('applicant_act_cur_code'), ['contract_amt']);
			 m.connect('contract_amt','onChange',function(){				
			 if(dj.byId('fx_total_utilise_cur_code'))
		 		{					 
				 	dj.byId('fx_total_utilise_cur_code').set('value',dj.byId('contract_cur_code').get('value'));
		 		}
			 if(dj.byId('fx_total_utilise_amt'))
		 		{
				 dj.byId('fx_total_utilise_amt').set('value',dj.byId('contract_amt').get('value'));
		 		}
			 });
		}
	}
	function _compareApplicantAndBenificiaryCurrency()	
	{
		var applicant_act_cur_code = dj.byId('applicant_act_cur_code').get('value');
		var credit_act_cur_code = dj.byId('credit_act_cur_code').get('value');
		
		if (applicant_act_cur_code != "" && credit_act_cur_code != "" && applicant_act_cur_code !== credit_act_cur_code)
			{
				m.dialog.show("ERROR",m.getLocalization("crossCurrency"));
				dj.byId('credit_act_name').set('value','');
				dj.byId('credit_act_cur_code').set('value','');
				dj.byId('credit_act_no').set('value','');
				dj.byId("credit_act_description").set("value",'');
				dj.byId("td_amt").set("value",'');
				return false;
			}
		return true;
	}
		    
	d.mixin(m, {
		
		getInterestDetails : function(){
			if(dj.byId('service_enabled') && dj.byId('service_enabled').get('value')==='Y')
				{
			_getInterestRateDetails();
				}
		},
		
		fireFXAction : function(){

			if(m._config.fxParamData && m._config.fxParamData[m._config.subProductCode][dj.byId("issuing_bank_abbv_name").get("value")].isFXEnabled === 'Y'){
				var fromCurrency,toCurrency;
				var tdCurrency = dj.byId('td_cur_code').get('value');
				var amount = dj.byId('td_amt').get('value');
				var tdAcctCurrency = dj.byId('applicant_act_cur_code').get('value');
				var productCode = m._config.productCode;
				var bankAbbvName = '';
				if(dj.byId('issuing_bank_abbv_name') && dj.byId('issuing_bank_abbv_name').get('value')!== ''){
					bankAbbvName = dj.byId('issuing_bank_abbv_name').get('value');
				}
				var masterCurrency = dj.byId('applicant_act_cur_code').get('value');
				var isDirectConversion = false;
					if(tdCurrency !== '' && !isNaN(amount) && productCode !== '' && bankAbbvName !== '' ){	
						if(tdCurrency !== tdAcctCurrency)
						{
							fromCurrency = tdAcctCurrency;
							toCurrency   = tdCurrency;
							masterCurrency = tdAcctCurrency;
						}
						if(fromCurrency && fromCurrency !== '' && toCurrency && toCurrency !== '' && fromCurrency !== toCurrency)
						{
							if(d.byId("fx-section") && (d.style(d.byId("fx-section"),"display") === "none"))
							{
								_showFXSection();								
							}
							m.fetchFXDetails(fromCurrency, toCurrency, amount, productCode, bankAbbvName, masterCurrency, isDirectConversion);
							if(dj.byId('fx_rates_type_1') && dj.byId('fx_rates_type_1').get('checked') && 
									(isNaN(dj.byId('fx_exchange_rate').get('value')) || dj.byId('fx_exchange_rate_cur_code').get('value') === '' || 
										isNaN(dj.byId('fx_exchange_rate_amt').get('value')) || (m._config.fxParamData[m._config.subProductCode][dj.byId("issuing_bank_abbv_name").get("value")].toleranceDispInd === 'Y' && 
												(isNaN(dj.byId('fx_tolerance_rate').get('value')) || isNaN(dj.byId('fx_tolerance_rate_amt').get('value')) || dj.byId('fx_tolerance_rate_cur_code').get('value') === ''))))
							{
								_clearRequiredFields(m.getLocalization("FXDefaultErrorMessage"));
							}
						}else{
								if(d.byId("fx-section") && (d.style(d.byId("fx-section"),"display") !== "none"))
								{
									m.animate("wipeOut", d.byId('fx-section'));
								}
								 m.defaultBindTheFXTypes();
							}
					}
			}
		},
	
	  bind : function() {
		  
		// clear the date array to make ajax call for BusinessDate to get holidays and cutoff details		
			m.connect("value_date","onClick", function(){
				m.clearDateCache();
				if(misys._config.isMultiBank){
					var customer_bank;
					if(dijit.byId("customer_bank"))
					{
						customer_bank = dijit.byId("customer_bank").get("value");
					}
					if(customer_bank !== '' && misys && misys._config && misys._config.businessDateForBank && misys._config.businessDateForBank[customer_bank][0] && misys._config.businessDateForBank[customer_bank][0].value !== '')
					{
						var yearServer = parseInt(misys._config.businessDateForBank[customer_bank][0].value.substring(0,4), 10);
						var monthServer = parseInt(misys._config.businessDateForBank[customer_bank][0].value.substring(5,7), 10);
						var dateServer = parseInt(misys._config.businessDateForBank[customer_bank][0].value.substring(8,10), 10);
						this.dropDown.currentFocus = new  Date(yearServer, monthServer - 1, dateServer);
					}
				}
			});
			
		   m.connect("applicant_act_name", "onChange", m.checkNickNameDiv);
		   m.setValidation("value_date", m.validateValueApplicationDate);
		 //validate transfer amount should be greater than zero
		  if(dj.byId('tnxId') && dj.byId('tnxId').getValue() === '01' ){
			  m.connect('tenor_term_code', 'onChange', function(){
				  _clearFields();
				_fncDisplayOrHideInterestLink();
			  });
			  m.connect('td_cur_code', 'onChange', function(){
				m.setCurrency(this, ['td_amt']);
				_clearFields();
				_fncDisplayOrHideInterestLink();
			  });
			  m.connect('td_amt', 'onBlur', function(){
				m.setTnxAmt(this.get('value'));
				_clearFields();
				_fncDisplayOrHideInterestLink();
			  });
			  m.connect('credit_act_name', 'onChange', function(){
				  _clearFields();
				  _fncDisplayOrHideInterestLink();
				  var check_currency = dj.byId('currency_res').get('value');
				  if(check_currency==="true")
				  {
					  _compareApplicantAndBenificiaryCurrency();
				  }
			  });			 
			  m.connect('maturity_instruction', 'onChange', function(){
				  _clearFields();
				  _fncDisplayOrHideInterestLink();
			  });
			  
			  m.connect('applicant_act_name', 'onChange', function(){
			      _clearFields();
			      _fncDisplayOrHideInterestLink();
				  if(dj.byId('applicant_act_name').get('value') && dj.byId('applicant_act_name').get('value') !== '' && dj.byId("maturity_instruction") && 
						  (dj.byId("maturity_instruction").get("value") === 'D' || dj.byId("maturity_instruction").get("value") === 'X') && 
						  dj.byId("credit_act_name") )
				  {
		 			dj.byId("credit_act_name").set("value",dj.byId("applicant_act_name").get("value"));
		 			dj.byId("credit_img").set("disabled",true);
				  }
				  
				  if(dj.byId("customer_bank") && dj.byId("applicant_act_name") && dj.byId("applicant_act_name").get("value") !== "")
				  {	
					  dj.byId("customer_bank").set("value", m._config.customerBankName);
				  }
			      if(m._config.fxParamData && dj.byId("issuing_bank_abbv_name") && dj.byId("issuing_bank_abbv_name").get("value")!=="" && m._config.fxParamData[m._config.subProductCode][dj.byId("issuing_bank_abbv_name").get("value")].isFXEnabled === 'Y')
			      {
			       _loadFX();
			      }
			      
			      	dj.byId("td_type").set("value", "");
					dj.byId("tenor_term_code").set("value", "");
					dj.byId("maturity_instruction").set("value", "");
					dj.byId("td_cur_code").set("value", "");
					dj.byId("td_amt").set("value", "");
					dj.byId('credit_act_no').set('value', '');
					dj.byId('credit_act_name').set('value', '');
					dj.byId('credit_act_cur_code').set('value', '');
					dj.byId('credit_act_description').set('value', '');
					dj.byId('credit_act_pab').set('value', '');
			     });
		  }
		  m.connect("entity", "onClick", m.validateRequiredField);
		  m.connect("applicant_act_name", "onClick", m.validateRequiredField);
		  m.connect("credit_act_name", "onClick", m.validateRequiredField);
		 
		  
		  m.connect("entity", "onChange", function() {
			  if(dj.byId("tnx_type_code"))
			  {
				  if(dj.byId("tnx_type_code").get("value") === '01')
				  {
					  dj.byId('applicant_act_no').set('value', '');
					  dj.byId('applicant_act_name').set('value', '');
					  dj.byId('applicant_act_cur_code').set('value', '');
					  dj.byId('applicant_act_description').set('value', '');
					  dj.byId('applicant_act_pab').set('value', '');
					  
					  dj.byId('placement_act_no').set('value', '');
					  dj.byId('placement_act_name').set('value', '');
					  dj.byId('placement_act_cur_code').set('value', '');
					  dj.byId('placement_act_description').set('value', '');
					  dj.byId('placement_act_pab').set('value', '');
				  }
					
				 	dj.byId('credit_act_no').set('value', '');
					dj.byId('credit_act_name').set('value', '');
					dj.byId('credit_act_cur_code').set('value', '');
					dj.byId('credit_act_description').set('value', '');
					dj.byId('credit_act_pab').set('value', '');
					
			  }
			  	dj.byId("td_type").set("value", "");
				dj.byId("tenor_term_code").set("value", "");
				dj.byId("maturity_instruction").set("value", "");
				dj.byId("td_cur_code").set("value", "");
				dj.byId("td_amt").set("value", "");

			formLoading = true;
			if(misys._config.isMultiBank && dj.byId("customer_bank"))
			{
				dj.byId("customer_bank").set("value", "");
				_populateCustomerBanks();
			}
		  });
		  
		  m.connect("customer_bank", "onChange", _handleCustomerBankOnChangeFields);
		  
		 if(dj.byId('td_type')){
		  m.connect('td_type', 'onChange', function() {
			  var placement = d.byId('placment-div');
				if (dj.byId('td_type') && dj.byId('td_type').get('value') !== '')
				{
					var depositType = dijit.byId('td_type').get('value');
					_fncTenorForSelectedDeposit(depositType);
					_fncMaturityInstForSelectedDeposit(depositType);
					_fncMandatoryFlagForSelectedMaturityInst(depositType);
					if(dj.byId('placement_act_name'))
					{
						if(dj.byId('placement_account_enabled')&& dj.byId('placement_account_enabled').get('value') === 'Y')
							{
						m.animate('fadeIn', placement, function(){});
							}
						else
							{
							m.animate('fadeOut', placement, function(){});
							}
					}
				 }
				 else
				 {
						if(dj.byId('placement_act_name'))
						{
							dj.byId('placement_act_name').set('value', '');
							if(dj.byId('placement_account_enabled')&& dj.byId('placement_account_enabled').get('value') === 'Y')
							{
						m.animate('fadeIn', placement, function(){});
							}
						else
							{
							m.animate('fadeOut', placement, function(){});
							}
				 		}
			 	 }
			});
		 }else if(dj.byId('selected_td_type') && dj.byId('selected_td_type').get('value') !== ''){
			 var depositType = dj.byId('selected_td_type').get('value');
			 _fncMaturityInstForSelectedDeposit(depositType);
			 _fncMandatoryFlagForSelectedMaturityInst(depositType);
		 }
		  if(dj.byId('selected_td_type') && dj.byId('selected_td_type').get('value') === '' && dj.byId('tenor_term_code') === undefined){			 
			 dj.byId('selected_td_type').set("value","*");
			 var depositType1 = dj.byId('selected_td_type').get('value');
			 _fncMaturityInstForSelectedDeposit(depositType1);
			 _fncMandatoryFlagForSelectedMaturityInst(depositType1);
		 }
		 if(dj.byId('tenor_term_code')){
			 m.connect('tenor_term_code', 'onChange', function() {
					if (dj.byId('td_type') && dj.byId('td_type').get('value')!== '' && dj.byId('tenor_term_code') && dj.byId('tenor_term_code').get('value') !== '') {
						_fncValidCurrencies(dj.byId('td_type').get('value'), dijit.byId('tenor_term_code'));
					}
				});
		 }
		 
		 m.connect("maturity_instruction", "onChange", function(){
			 var instType = dj.byId("maturity_instruction").get("value");
			 if(dj.byId("maturity_mandatory") && dj.byId("maturity_mandatory").store)
			 {
				 for(var i=0;i<dj.byId("maturity_mandatory").store._arrayOfAllItems.length;i++)
				 {
					 if(dj.byId("maturity_mandatory").store._arrayOfAllItems[i].id[0] === instType)
					 {
						 if(dj.byId("maturity_mandatory").store._arrayOfAllItems[i].name[0]==="Y" && dj.byId("credit_act_name"))
						 {
							 if((!m._config.preSelectedAccExist) && dj.byId("tnx_type_code") && dj.byId("tnx_type_code").get("value") !== '03')
							 {
								 dj.byId("credit_act_name").set("value",dj.byId("applicant_act_name").get("value"));
								 dj.byId("credit_act_no").set("value",dj.byId("applicant_act_no").get("value"));
								 dj.byId("credit_act_cur_code").set("value",dj.byId("applicant_act_cur_code").get("value"));
							 }

							 dj.byId("credit_img").set("disabled",false);
							 m.toggleRequired("credit_act_name", true);

							 m._config.preSelectedAccExist = false;
							 return;
						 }
						 else
						 {
							 if(dj.byId("credit_act_name"))
							 {
								 m.toggleRequired("credit_act_name", false);
								 if((!m._config.preSelectedAccExist) && dj.byId('credit_act_name').get("value") === dj.byId("applicant_act_name").get("value"))
								 {
									 dj.byId('credit_act_name').set('value', '');
								 }
								 dj.byId("credit_img").set("disabled",false);

								 m._config.preSelectedAccExist = false;
								 return;
							 }
						 }								
					 }
				 }
			 }

		 });
	  },

	  onFormLoad : function() {
		  var typeItems 	= [],
		      typeValues 	= [],
		      emptyFlag 	= true,
			  depositTypes = "",
			  tempDepositType = "",
			  tempMaturityType = "",
			  tempCurType = "",
			  timeoutInMs = -1,
			  setter = "",
			  issuingBankCustRef = "",
			  issuingBankAbbvName = "";
		  
		  if(misys._config.isMultiBank)
		  {
	    		_populateCustomerBanks(true);
				var linkedBankField = dj.byId("customer_bank");
				var linkedBankHiddenField = dj.byId("customer_bank_hidden");
				var entity = dj.byId("entity");
				if(linkedBankField && linkedBankHiddenField)
				{
					linkedBankField.set("value", linkedBankHiddenField.get("value"));
				}
				if(dj.byId("issuing_bank_abbv_name") && dj.byId("issuing_bank_abbv_name").get("value") !== "")
				{
					hasCustomerBankValue = true;
					formLoading = true;
					linkedBankField.set("value", dj.byId("issuing_bank_abbv_name").get("value"));
					linkedBankHiddenField.set("value", dj.byId("issuing_bank_abbv_name").get("value"));
				}
				if(entity && entity.get("value") === "" && linkedBankField)
				{
					linkedBankField.set("disabled",true);
					linkedBankField.set("required",false);
				}	
			}
		  	else if(dj.byId("issuing_bank_abbv_name") && dj.byId("issuing_bank_abbv_name").get("value") !== "")
			{
			  m.initializeFX(m._config.subProductCode,dj.byId("issuing_bank_abbv_name").get("value"));
				if(dj.byId('applicant_act_cur_code') && dj.byId('applicant_act_cur_code').get('value') !== '' && dj.byId('selected_td_cur') && dj.byId('selected_td_cur').get('value') !== '' && dj.byId('applicant_act_cur_code').get('value')!== dj.byId('selected_td_cur').get('value') && !isNaN(dj.byId("td_amt").get("value")))
				{
					m.onloadFXActions();
				}
				else
				{
					m.defaultBindTheFXTypes();
				}
				_handleFXAction();
			}	  
		  
		  if(dj.byId('tnxId') && dj.byId('tnxId').getValue() === '01' ){
		     issuingBankAbbvName = dj.byId("issuing_bank_abbv_name");
			 if(issuingBankAbbvName)
			 {
				issuingBankAbbvName.onChange();
			 }
			 issuingBankCustRef = dj.byId("issuing_bank_customer_reference");
			 if(issuingBankCustRef)
			 {
				issuingBankCustRef.onChange();
			 }
		
		  _fncDisplayOrHideInterestLink();	
		  
		  m.setCurrency(dj.byId('td_cur_code'), ['td_amt']);
		  }
		  if(dj.byId('td_type')){
			  depositTypes = dj.byId('td_type');
		  
			  depositTypes.store = null;
			  
			  m.setCurrency(dj.byId('td_cur_code'), ['td_amt']);
			  
			  dojo.forEach(misys._config.depositTypes,function(depositType, index){
				  var depType = depositType.split(',');
				  typeItems[index] = depType[0];
				  typeValues[index] = depType[1];
			  });
		  
		  if(dj.byId('td_type')){
			 jsonData = {"identifier" :"id", "label" : "name","items" : []};
			 productStore = new dojo.data.ItemFileWriteStore( {data : jsonData });
			 
			 for(var j = 0; j < typeItems.length; j++){
				 productStore.newItem( {"id" : typeItems[j], "name" :typeValues[j]});
			 }
			 depositTypes.store = productStore;
			 if(dj.byId('selected_td_type') && !('S' + dj.byId('selected_td_type').get('value') === 'S')){
				 tempDepositType = dj.byId('selected_td_type').get('value');
				 dj.byId('td_type').set('value', tempDepositType);
				 
				 if((dj.byId('selected_tenor_type') && !('S' + dj.byId('selected_tenor_type').get('value') === 'S'))){
					 tempTenorType = dj.byId('selected_tenor_type').get('value');
					 _fncTenorForSelectedDeposit(tempDepositType);
					  setter = function() {
						  dj.byId('tenor_term_code').set('value', tempTenorType);
					  };
					  timeoutInMs = 1000;
					  setTimeout(setter, timeoutInMs);
				 }
				 if((dj.byId('selected_td_cur') && !('S' + dj.byId('selected_td_cur').get('value') === 'S'))){
					 tempCurType = dj.byId('selected_td_cur').get('value');
					 tempDepositType = dj.byId('selected_td_type').get('value');
					 tempTenorType = dj.byId('selected_tenor_type').get('value');
					 _fncValidCurrencies(tempDepositType, tempTenorType);
					  dj.byId('td_cur_code').set('value', tempCurType);					 
				 }
				 
				 if((dj.byId('selected_maturity_type') && !('S' + dj.byId('selected_maturity_type').get('value') === 'S'))){
					 tempMaturityType = dj.byId('selected_maturity_type').get('value');
					 if(dj.byId('maturity_instruction')){
					     _fncMaturityInstForSelectedDeposit(tempDepositType);
					     _fncMandatoryFlagForSelectedMaturityInst(tempDepositType);
					     setter = function() {
					    	 dj.byId('maturity_instruction').set('value', tempMaturityType);
						 };
						 timeoutInMs = 1000;
						 setTimeout(setter, timeoutInMs);
					}
				 }
			 }
			 else{
				 depositTypes.set("displayedValue","");
			 }
		  }
		  }else if(dj.byId('selected_td_type') && dj.byId('maturity_instruction') && 
				   (dj.byId('selected_maturity_type').get('value') !== '' || dj.byId('selected_td_type').get("value") !== '')){
				  tempMaturityType = dj.byId('selected_maturity_type').get('value');
				  if(!tempMaturityType || tempMaturityType ==='')
				  {
					  tempMaturityType = dj.byId('selected_td_type').get("value"); 
				  }
				  if(dj.byId('maturity_instruction')){
					     //_fncMaturityInstForSelectedDeposit(tempDepositType);
					     setter = function() {
					    	 dj.byId('maturity_instruction').set('value', tempMaturityType);
						 };
						 timeoutInMs = 1000;
						 setTimeout(setter, timeoutInMs);
					}
		 }
		 if(dj.byId('placement_act_name')){
			 var placement = d.byId('placment-div');
			 if((dj.byId('td_type') && dj.byId('td_type').getValue() !== '')&&(dj.byId('placement_account_enabled')&& dj.byId('placement_account_enabled').get('value')==='Y')){
			     m.animate('fadeIn', placement, function(){});
			 }else{
			     m.animate('fadeOut', placement, function(){});
			 }
		 }
		
			if(m._config.fxParamData && dj.byId("issuing_bank_abbv_name") && dj.byId("issuing_bank_abbv_name").get("value") !== '')
			{
				m.initializeFX(m._config.subProductCode,dj.byId("issuing_bank_abbv_name").get("value"));
				if(dj.byId('applicant_act_cur_code') && dj.byId('applicant_act_cur_code').get('value') !== '' && dj.byId('selected_td_cur') && dj.byId('selected_td_cur').get('value') !== '' && dj.byId('applicant_act_cur_code').get('value')!== dj.byId('selected_td_cur').get('value') && !isNaN(dj.byId("td_amt").get("value")))
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
				m.animate('fadeOut', fxMsgType);
			}
			
			//hide fx section by default
			if(d.byId("fx-section"))
			{
				//show fx section if previously enabled (in case of draft)
				if((dj.byId("fx_exchange_rate_cur_code") && dj.byId("fx_exchange_rate_cur_code").get("value")!== "")|| (dj.byId("fx_total_utilise_cur_code") && dj.byId("fx_total_utilise_cur_code").get("value")!== ""))
				{					
					_showFXSection();	
					if((dj.byId("fx_rates_type"))&&(dj.byId("fx_rates_type").get("value") === "02"))
						{
							_fncDisplayOrHideEquivalentContractRate();
						}
				}
				else
				{
					d.style("fx-section","display","none");
				}				
			}
			if(d.byId('totalUtiliseDiv'))
			{
				  m.animate("wipeOut", d.byId('totalUtiliseDiv'));
			}
			
			m._config.preSelectedAccExist = (dj.byId('credit_act_name') && dj.byId('credit_act_name').get('value') !== "")? true : false;
			
	  },
	  
	  beforeSaveValidations : function(){
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
		  if(dj.byId('fx_rates_type_2') && dj.byId('fx_rates_type_2').get('checked') && 
				  dj.byId("fx_contract_nbr_1") && dj.byId("fx_contract_nbr_1").get("value")==="")
			{
			  dj.byId("fx_contract_nbr_1").focus();
			  return false;
			}	
		  if(dj.byId("applicant_act_name") && dj.byId("applicant_act_name").get('value')==="")
			  {
			  m._config.onSubmitErrorMsg =  m.getLocalization("debitAccountTDMessage");
			  dj.byId("applicant_act_name").focus();
			  dj.byId("applicant_act_name").set("state","Error");
			  return false;
			  }
		  if(dj.byId("td_amt") && !m.validateAmount((dj.byId("td_amt"))?dj.byId("td_amt"):0))
			{
				m._config.onSubmitErrorMsg =  m.getLocalization("amountcannotzero");
				dj.byId("td_amt").set("value","");
				return false;
			}
		  
		  var tnxtype = dj.byId("tnx_type_code").get('value');
		  if (!(tnxtype == "13" || tnxtype == "03"))
	    	 {			 
			  return _fncAutoForwardDate();	    	 	    	  
		     }
		  return true;
	  }
	});
	
	// Setup the XML transform function
	m._config = m._config || {};
	d.mixin(m._config, {
		preSelectedAccExist : false,
		xmlTransform : function(/*String*/ xml) {
				// Setup the root of the XML string
				var xmlRoot = m._config.xmlTagName,
				transformedXml = xmlRoot ? ["<", xmlRoot, ">"] : [],
				tdXMLStart = "<td_tnx_record>",
				tdXMLEnd   = "</td_tnx_record>",
				maturityInstructionType = "",
				subTDXML	= "",
				selectedIndex = -1,
				maturityCodes = [], 
				maturityDesc  = [], 
				depositType   = "", 
				selectedValue = "",
				selectedTenor = "",
				tenorNumber   = -1,
				tenorCode     = "",
				selectedTenorArray = [];
						
				/*
				 * Add additional tags, only in case of term deposit transaction.
				 * Else pass the input xml, without modification. (Ex : for create phrase from popup.)
				 */
				if(xml.indexOf(tdXMLStart) !== -1)
				{
						subTDXML = xml.substring(tdXMLStart.length,(xml.length-tdXMLEnd.length));
						transformedXml.push(subTDXML);
		
						if(dj.byId("maturity_instruction") && dj.byId("maturity_instruction").get('value') !== '' && dj.byId('td_type') && !('S' + dj.byId('td_type').get('value') === 'S')){
								maturityInstructionType = dj.byId("maturity_instruction").get("value");
								 depositType = dijit.byId('td_type').get('value');
								 maturityCodes = misys._config.maturityCodes[depositType];
								 maturityDesc = misys._config.maturityCodesDescription[depositType];
								 for(var i =0; i< maturityCodes.length ; i++)
								 {
									  if(maturityInstructionType === maturityCodes[i])
									  {
										  selectedIndex = i; 
										  break;
									  }
								 }
								  transformedXml.push("<maturity_instruction>",maturityInstructionType,"</maturity_instruction>");
								  selectedValue = maturityDesc[selectedIndex];
								  transformedXml.push("<maturity_instruction_name>",selectedValue,"</maturity_instruction_name>");
							}
						else if(dj.byId("maturity_instruction") && dj.byId("maturity_instruction").get('value') !== '' && !dj.byId('td_type')){
							maturityInstructionType = dj.byId("maturity_instruction").get("value");
							if(dj.byId('selected_td_type')){
							depositType = dj.byId('selected_td_type').get('value');
							 
							 maturityCodes = misys._config.maturityCodes[depositType];
							 maturityDesc = misys._config.maturityCodesDescription[depositType];
							 for(var j =0; j< maturityCodes.length ; j++)
							 {
								  if(maturityInstructionType === maturityCodes[j])
								  {
									  selectedIndex = j; 
									  break;
								  }
							 }
							  transformedXml.push("<maturity_instruction>",maturityInstructionType,"</maturity_instruction>");
							  selectedValue = maturityDesc[selectedIndex];
							  transformedXml.push("<maturity_instruction_name>",selectedValue,"</maturity_instruction_name>");
							  if(dj.byId("tnx_type_code") && dj.byId("tnx_type_code").get("value") === '03')
							  {
								  transformedXml.push("<td_type>",depositType,"</td_type>");
							  }
							}
						}
						if(dj.byId('tenor_term_code') && dj.byId('tenor_term_code').get('value') !== '' && dj.byId('td_type') && !('S' + dj.byId('td_type').get('value') === 'S')){
							selectedTenor = dj.byId('tenor_term_code').get('value');
							selectedTenorArray = selectedTenor.split('_');
							tenorNumber = selectedTenorArray[0];
							tenorCode = selectedTenorArray[1];
							transformedXml.push("<value_date_term_number>",tenorNumber,"</value_date_term_number>");
							selectedValue = maturityDesc[selectedIndex];
							transformedXml.push("<value_date_term_code>",tenorCode,"</value_date_term_code>");
						}
						if(xmlRoot) {
							transformedXml.push("</", xmlRoot, ">");
						}
						return transformedXml.join("");
				}
				else{
					return xml;
				}
		}
	});
	
	d.mixin(m._config, {		
		initReAuthParams : function(){	
			
			var reAuthParams = { 	productCode : 'TD',
			         				subProductCode : '',
			        				transactionTypeCode : "01",
			        				entity : dj.byId("entity") ? dj.byId("entity").get("value") : "",			        				
			        				currency : dj.byId("td_cur_code") ? dj.byId("td_cur_code").get("value") : "",
			        				amount : dj.byId("td_amt") ? m.trimAmount(dj.byId("td_amt").get("value")): "",
			        				bankAbbvName : dj.byId("customer_bank")? dj.byId("customer_bank").get("value") : "",
			        				
			        				es_field1 : dj.byId("td_amt") ? m.trimAmount(dj.byId("td_amt").get("value")): "",
			        				es_field2 : ''
								  };
			return reAuthParams;
		}
	});
	
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.cash.create_td_cstd_client');