/*
 * ---------------------------------------------------------- 
 * Event Binding for Cheque Inquiry Status
 * 
 * Copyright (c) 2000-2011 Misys (http://www.misys.com), All Rights Reserved.
 * 
 * version: 1.0
 * 
 * author: Nijamudeen
 * ----------------------------------------------------------
 */
dojo.provide("misys.binding.cash.create_chqService");

(function(/* Dojo */d, /* Dijit */dj, /* Misys */m) {
	
	var onLoad = true;
	var chqNumberFromFlag = true;
	var cashNumberFromFlag = true;

	function _populateChqStatusResponse(response, ioArgs)
	{
		var chqInquiryGrid = dijit.byId("chqInquiryGrid");
		var storeStatusGrid = new dojo.data.ItemFileReadStore({data: response});
		d.style("chq_inquiry_grid_div","display","block");
		d.style("chq_inquiry_grid_div","overflow","visible");		
		chqInquiryGrid.setStore(storeStatusGrid);
	}
	
	function _setApplicantReference ()
	{
		if (dj.byId('applicant_reference') && dj.byId('issuing_bank_abbv_name') && dj.byId('entity') && dj.byId('entity').get('value') !== '')
		{
			var key = dj.byId('issuing_bank_abbv_name').get('value') + '_' + dj.byId('entity').get('value');
			// if the reference is exists
			if(m._config.customerReferences[key][1])
			{
				dj.byId('applicant_reference').set('value', m._config.customerReferences[key][1]);
			}
		}
	}
	
	function _markFieldAsRequired(field)
	{
        var displayMessage = misys.getLocalization('uploadTemplateValueRequired');
		field.set("state","Error");
		dj.hideTooltip(field.domNode);
		dj.showTooltip(displayMessage, field.domNode, 0);
		var hideTT = function() {
			dj.hideTooltip(field.domNode);
		};
		setTimeout(hideTT, 5000);
	}
	
	function _fieldValidation()
	{
		if(dj.byId("entity") && dj.byId("entity").get("value")=== "")
		{
			_markFieldAsRequired(dj.byId("entity"));
		}
		if(dj.byId("account_no").get("value")=== "")
		{
			 _markFieldAsRequired(dj.byId("account_no"));
		}
		if(chqNumberFromFlag && dj.byId("chqNumberFrom").get("value")=== "")
		{
			_markFieldAsRequired(dj.byId("chqNumberFrom"));
		}
		if(cashNumberFromFlag && dj.byId("cashNumberFrom").get("value")=== "")
		{
			_markFieldAsRequired(dj.byId("cashNumberFrom"));
		}
	    if(dj.byId("chqNumberTo").get("value")== "")
		{
			_markFieldAsRequired(dj.byId("chqNumberTo"));
		}
	}
	
	/*populate banks after entity selection*/
	function populateBanks(isFormLoading)
	{
		var onFormLoad = isFormLoading?true:false;
		var entity = null;
		var bank = null;
		if(dj.byId("customer_bank"))
		{
			bank = dj.byId("customer_bank");
		}
		
		if(dj.byId("entity") && dj.byId("entity").get("value") !== "")
		{
			entity = dj.byId("entity").get("value");
		}
		else
		{
			entity = "All";
		}
		
		
		if(misys._config.entityBanksMap)
		{
			var customerBankDataStore = null;
			if(entity!=="")
			{
			customerBankDataStore = m._config.entityBanksMap[entity];
			}
			if(!onFormLoad && bank)
			{
				bank.set("value", "");
			}
			if (customerBankDataStore && bank)
			{	
				bank.store = new dojo.data.ItemFileReadStore({
					data :
					{
						identifier : "value",
						label : "name",
						items : customerBankDataStore
					}
				});
				bank.fetchProperties =
				{
					sort : [
					{
						attribute : "name"
					} ]
				};
			}	
		}
	}
	
	/*this is to assign the delivery mode per bank*/
	function populateDeliveryModes(){
		var bank= null;
		var deliveryModes = null;
		if(dj.byId("adv_send_mode"))
		{
			deliveryModes = dj.byId("adv_send_mode");
		}
		if(dj.byId("customer_bank") && dj.byId("customer_bank").get("value") !== "")
		{
			bank =dj.byId("customer_bank").get("value");
		}
		
		if(misys._config.perBankDeliveryModes && deliveryModes){
			var deliveryModesDataStore = null;

			if(bank!==""){
				deliveryModesDataStore = m._config.perBankDeliveryModes[bank];
			}
			if(!deliveryModesDataStore){
				deliveryModesDataStore = [{ value:"",name:""}];
			}
			deliveryModes.store = new dojo.data.ItemFileReadStore({
				data:
					{
						identifier : "value",
						label : "name",
						items: deliveryModesDataStore
					}
			});
			deliveryModes.fetchProperties =
			{
				sort : [
				{
					attribute : "name"
				} ]
			};
		}
	}
	
	/*function to handle bank bank field change*/
	function handleBankChange(onFormLoad){
		var formLoad = onFormLoad? true:false;

		var customer_bank = dj.byId("customer_bank").get("value"); 
		if(misys && misys._config && misys._config.businessDateForBank && misys._config.businessDateForBank[customer_bank] && misys._config.businessDateForBank[customer_bank][0] && misys._config.businessDateForBank[customer_bank][0].value !== '')
		{
			var date = misys._config.businessDateForBank[customer_bank][0].value;
			var yearServer = date.substring(0,4);
			var monthServer = date.substring(5,7);
			var dateServer = date.substring(8,10);
			date = dateServer + "/" + monthServer + "/" + yearServer;
			if(misys && misys._config && misys._config.option_for_app_date === "SCRATCH")
			{
				dj.byId("appl_date").set("value", date);
				document.getElementById('appl_date_view_row').childNodes[1].innerHTML = date;
			}
		}
		if(misys._config.isMultiBank && dijit.byId("sub_product_code") && dijit.byId("sub_product_code").get("value")==="CQBKR"){
			populateDeliveryModes();
		}
		if(misys._config.isMultiBank && !formLoad)
		{
			if(misys._config.isMultiBank && dijit.byId("sub_product_code") && dijit.byId("sub_product_code").get("value")==="CQBKR"){
				dj.byId("adv_send_mode").set("value","");
			}
			if(dj.byId("issuing_bank_name")){
				dj.byId("issuing_bank_name").set("value",dj.byId("customer_bank").get("value"));
			}
			if(dj.byId("issuing_bank_abbv_name")){
				dj.byId("issuing_bank_abbv_name").set("value",dj.byId("customer_bank").get("value"));	
			}
			if(dj.byId("no_of_cheque_books") && dj.byId("applicant_act_name") && dj.byId("applicant_act_name").get("value")!=="" && dj.byId("no_of_cheque_books").get("value")!==""){
				dj.byId("no_of_cheque_books").set("value", null);
				dj.byId("applicant_act_name").set("value", null);
			}
			if(dj.byId("cheque_number_range") ){
				dj.byId("cheque_number_range").set("value", misys._config.perBankChequeNumberRange[dj.byId("customer_bank").get("value")]);
			}
			if(dj.byId("applicant_act_name")){
				dj.byId("applicant_act_name").set("value", "");
			}
			if(dj.byId("account_no")){
				dj.byId("account_no").set("value", "");
			}
			if(dj.byId("cheque_number_from") && dj.byId("cheque_number_to")){
				dj.byId("cheque_number_from").set("value","");
				dj.byId("cheque_number_to").set("value","");
			}
			if(dj.byId("chqNumberFrom") && dj.byId("chqNumberTo")){
				dj.byId("chqNumberTo").set("value","");
				dj.byId("chqNumberFrom").set("value","");
			}
			if(dj.byId("cashNumberFrom") && dj.byId("chqNumberTo")){
				dj.byId("chqNumberTo").set("value","");
				dj.byId("cashNumberFrom").set("value","");
			}
			if(dj.byId("cheque_type")){
				dj.byId("cheque_type").set("value","");
			}
			if(dj.byId("chqType")){
				dj.byId("chqType").set("value","");
			}
		}
		onLoad = false;
		_setApplicantReference();
	}
	
	function _validateNoOfChequeBooks()
	{
		//Summary:
		// Method to validate the minimum and maximum Number of cheque books that can be requested.
		
		//If the field is not empty
		if("S" + this.get("value") !== "S")
		{
			var noOfChequeBooks = this.get("value"),
				errorMessage	= "";
			//If Cheque Book Minimum Maximum configuration found
			if(misys._config._isNoOfChqBookConfigMissing === false)
			{
				if(misys._config.isMultiBank===true){
					var bank = dj.byId("customer_bank").get("value");
					if(noOfChequeBooks < misys._config.perBankChequeMin[bank])
					{
						this.set("value", "");
						errorMessage =  m.getLocalization("minChqBooksRequest",[misys._config.perBankChequeMin[bank]]);
						//this.set("state","Error");
						dj.hideTooltip(this.domNode);
						dj.showTooltip(errorMessage, this.domNode, 0);
						var hideTT = function() {
							dj.hideTooltip(this.domNode);
						};
						setTimeout(hideTT, 1000);
						return;
					}
					if(noOfChequeBooks > misys._config.perBankChequeMax[bank])
					{ 
						this.set("value", "");
						errorMessage =  m.getLocalization("maxChqBooksRequest",[misys._config.perBankChequeMax[bank]]);
					 	//this.set("state","Error");
						dj.hideTooltip(this.domNode);
						dj.showTooltip(errorMessage, this.domNode, 0);
						hideTT = function() {
							dj.hideTooltip(this.domNode);
						};
						setTimeout(hideTT, 1000);
						return;
					}
				}
				else{
					if(noOfChequeBooks < misys._config._noOfChqBooksMin)
					{
						this.set("value", "");
						errorMessage =  m.getLocalization("minChqBooksRequest",[misys._config._noOfChqBooksMin]);
						//this.set("state","Error");
						dj.hideTooltip(this.domNode);
						dj.showTooltip(errorMessage, this.domNode, 0);
						hideTT = function() {
							dj.hideTooltip(this.domNode);
						};
						setTimeout(hideTT, 1000);
						return;
					}
					if(noOfChequeBooks > misys._config._noOfChqBooksMax)
					{ 
						this.set("value", "");
						errorMessage =  m.getLocalization("maxChqBooksRequest",[misys._config._noOfChqBooksMax]);
					 	//this.set("state","Error");
						dj.hideTooltip(this.domNode);
						dj.showTooltip(errorMessage, this.domNode, 0);
						hideTT = function() {
							dj.hideTooltip(this.domNode);
						};
						setTimeout(hideTT, 1000);
						return;
					}
				}
			}
			else
			{
				this.set("value", "");
				errorMessage =  m.getLocalization("minMaxChqBooksRequestConfigMissing");
				//this.set("state","Error");
				dj.hideTooltip(this.domNode);
				dj.showTooltip(errorMessage, this.domNode, 0);
				hideTT = function() {
					dj.hideTooltip(this.domNode);
				};
				setTimeout(hideTT, 1000);
				return;
			}
		}
	}
	
	/**
	 * called after selecting a deliveryMode
	 */
	function _deliveryModeChangeHandler() {
		if(dj.byId("adv_send_mode")){
			if (dj.byId("adv_send_mode").get("value") === 'Collect from Branch' || dj.byId("adv_send_mode").get("value") === '08') {
			
				d.style("delivery_mode_08_div", "display", "block");
				m.toggleFields(true,null,['collecting_bank_code', 'collecting_branch_code', 'collectors_name','collectors_id']);
				
				dj.byId("collecting_bank_code").set("readOnly",true);
				dj.byId("collecting_branch_code").set("readOnly",true);
			}  
			else {
				d.style("delivery_mode_08_div", "display", "none"); 
				m.toggleFields(false,null,['collecting_bank_code', 'collecting_branch_code', 'collectors_name','collectors_id','mailing_other_name_address','mailing_other_postal_code','mailing_other_country']);
			} 
		}
	}

	//validation for to field
	function _validateFromChequeNumber(field){
		 var toVal = field.get("value");
		 var fromVal = dijit.byId("chqNumberFrom") ?  dijit.byId("chqNumberFrom").get("value") : (dijit.byId("cashNumberFrom") ? dijit.byId("cashNumberFrom").get("value"): "");
		 var bank = "";
		 if(dijit.byId("issuing_bank_name"))
		 {
		 	bank = dijit.byId("issuing_bank_name").get("value");
		 }
		 if(bank === "" && dijit.byId("customer_bank"))
		 {
			 bank = dijit.byId("customer_bank").get("value");
		 }
		 var chqNumRange 	= 0;
		 if(bank !== "")
		 {
			 chqNumRange = misys._config.perBankChequeNumberRange[bank][0];
		 }
		 else{
				chqNumRange = dj.byId("chqRange").get("value");
			}
		 if (toVal != "") {
				var chqComputedRange = (dojo.number.parse(toVal) - dojo.number.parse(fromVal)) + 1;
				if(chqComputedRange > chqNumRange)					
				{
					var msg = m.getLocalization('mandatoryStopChqNumberRangeValMessage',[ chqComputedRange , chqNumRange ]);
					field.set("state","Error");
					dj.hideTooltip(field.domNode);
					dj.showTooltip(msg, field.domNode, 0);
					var hideTT = function() {
					dj.hideTooltip(field.domNode);
					
					};
					setTimeout(hideTT, 5000);
				}
			}
	}
	
	d.mixin(m._config, {		
		initReAuthParams : function(){	
			
			var reAuthParams = { 	productCode : 'SE',
			         				subProductCode : dj.byId("sub_product_code").get("value"),
			        				transactionTypeCode : '01',
			        				currency : '',
			        				amount : '',
			        				bankAbbvName : dj.byId("customer_bank")? dj.byId("customer_bank").get("value") : "",
			        				entity :dj.byId("entity") ? dj.byId("entity").get("value") : "",
			        				
			        				es_field1 : '',
			        				es_field2 : ''
								  };
			return reAuthParams;
		}
	});
	
	d.mixin(m, {				
		
		statusSummaryGrid : function () 
			{
				var chequeNumberFromField	=	dijit.byId("chqNumberFrom"),
					chequeNumberToField		=	dijit.byId("chqNumberTo"),
					cashNumberFromField	=	dijit.byId("cashNumberFrom"),
					hideTT,displayMessage;
				var chqNumberFrom = chequeNumberFromField ? dojo.number.parse(chequeNumberFromField.get("value")) : "",
						cashNumberFrom = cashNumberFromField ? dojo.number.parse(cashNumberFromField.get("value")) : "",
				chqNumberTo = dojo.number.parse(chequeNumberToField.get("value")),
				chqComputedRange = "",
				chqNumRange = dijit.byId("chqRange").get("value");
				if(chqNumberFrom != "")
							{
				chqComputedRange = (dojo.number.parse(chqNumberTo) - dojo.number.parse(chqNumberFrom)) + 1;		
							}
				else if(cashNumberFrom != "")
					{
					chqComputedRange = (dojo.number.parse(chqNumberTo) - dojo.number.parse(chqNumberFrom)) + 1;		

					}
				//chqType = dijit.byId("chqType").get("value");
				
				/*if(dijit.byId("account_no").get("value")!== "" &&
						chequeNumberFromField.get("value")!== "" && chequeNumberToField.get("value") !== "" )
				{	
					
					if(chqNumberFrom < 0 || isNaN(chqNumberFrom))
					{
						displayMessage = misys.getLocalization('invalidNumber');
						chequeNumberFromField.focus();
					    dijit.hideTooltip(chequeNumberFromField.domNode);
					    dijit.showTooltip(displayMessage, chequeNumberFromField.domNode, 0);
					    hideTT = function() {
							dj.hideTooltip(chequeNumberFromField.domNode);
						};
						setTimeout(hideTT, 5000);
					}

					else if(dojo.number.parse(chqNumberFrom) == 0)
					{
						chequeNumberFromField.focus();
						displayMessage = misys.getLocalization('ChequeNumberFromNonZeroValMessage');
						 dijit.hideTooltip(chequeNumberFromField.domNode);
						    dijit.showTooltip(displayMessage, chequeNumberFromField.domNode, 0);
						    hideTT = function() {
								dj.hideTooltip(chequeNumberFromField.domNode);
							};
							setTimeout(hideTT, 5000);						
					}
					
					else if(chqComputedRange > chqNumRange)						
					{						
						displayMessage = misys.getLocalization('mandatoryChqNumberRangeValMessage', [chqComputedRange,chqNumRange]);
						chequeNumberToField.focus();
					    dijit.hideTooltip(chequeNumberToField.domNode);
					    dijit.showTooltip(displayMessage, chequeNumberToField.domNode, 0);
					    hideTT = function() {
							dj.hideTooltip(chequeNumberToField.domNode);
						};
						setTimeout(hideTT, 5000);
					}
					else
					{
						m.xhrPost({
							url : m.getServletURL("/screen/AjaxScreen/action/ChqStatusInquirySearchAction"),
							handleAs : "json",
							sync : true,
							content : {	
								entity : dijit.byId("entity") ? dijit.byId("entity").get("value") : "",
								bankName: dijit.byId("customer_bank") ? dijit.byId("customer_bank").get("value") : "",
								acctNumber : dijit.byId("account_no").get("value"),
								acctCcy : dijit.byId("act_cur_code").get("value"),
								chqNumFrom  : chequeNumberFromField.get("value"),
								chqNumTo  : chequeNumberToField.get("value"),
								chqType : dijit.byId("chqType").get("value")
							},
							load : function(response, ioArgs){
								_populateChqStatusResponse(response, ioArgs);
							},
							customError : function(response, ioArgs) {
								console.error(response);
							}		    
						});							
				}
				}	*/
				if(dijit.byId("account_no").get("value")!= "" &&
						((chqNumberFromFlag && chequeNumberFromField.get("value")!= "")  || (cashNumberFromFlag && cashNumberFromField.get("value")!= "")) && chequeNumberToField.get("value") != ""){
					
					
				if(chqNumberFrom &&(chqNumberFrom < 0 || isNaN(chqNumberFrom)))
				{
					displayMessage = misys.getLocalization('invalidNumber');
					chequeNumberFromField.focus();
				    dijit.hideTooltip(chequeNumberFromField.domNode);
				    dijit.showTooltip(displayMessage, chequeNumberFromField.domNode, 0);
				    hideTT = function() {
						dj.hideTooltip(chequeNumberFromField.domNode);
					};
					setTimeout(hideTT, 5000);
				}
				else if(cashNumberFrom && (cashNumberFrom < 0 || isNaN(cashNumberFrom)))
				{
					displayMessage = misys.getLocalization('invalidNumber');
					cashNumberFromField.focus();
				    dijit.hideTooltip(NumberFromField.domNode);
				    dijit.showTooltip(displayMessage, cashNumberFromField.domNode, 0);
				    hideTT = function() {
						dj.hideTooltip(cashNumberFromField.domNode);
					};
					setTimeout(hideTT, 5000);
				}
				else if(chqNumberTo < 0)
				{
					displayMessage = misys.getLocalization('invalidNumber');
					chequeNumberToField.focus();
				    dijit.hideTooltip(chequeNumberToField.domNode);
				    dijit.showTooltip(displayMessage, chequeNumberToField.domNode, 0);
				    hideTT = function() {
						dj.hideTooltip(chequeNumberToField.domNode);
					};
					setTimeout(hideTT, 5000);
				}
				else if(dojo.number.parse(chqNumberFrom) === 0)
				{
					chequeNumberFromField.focus();
					displayMessage = misys.getLocalization('ChequeNumberFromNonZeroValMessage');
					 dijit.hideTooltip(chequeNumberFromField.domNode);
					    dijit.showTooltip(displayMessage, chequeNumberFromField.domNode, 0);
					    hideTT = function() {
							dj.hideTooltip(chequeNumberFromField.domNode);
						};
						setTimeout(hideTT, 5000);						
				}
				else if(dojo.number.parse(cashNumberFrom) === 0)
				{
					cashNumberFromField.focus();
					displayMessage = misys.getLocalization('CashNumberFromNonZeroValMessage');
					 dijit.hideTooltip(cashNumberFromField.domNode);
					    dijit.showTooltip(displayMessage, cashNumberFromField.domNode, 0);
					    hideTT = function() {
							dj.hideTooltip(cashNumberFromField.domNode);
						};
						setTimeout(hideTT, 5000);						
				}
				else if(chqNumberFrom > chqNumberTo)
				{
					displayMessage = misys.getLocalization('mandatoryChqNumberValMessage', [dijit.byId("chqNumberTo").get("value")]);
					chequeNumberToField.focus();
				    dijit.hideTooltip(chequeNumberToField.domNode);
				    dijit.showTooltip(displayMessage, chequeNumberToField.domNode, 0);
				    hideTT = function() {
						dj.hideTooltip(chequeNumberToField.domNode);
					};
					setTimeout(hideTT, 5000);						
				}
				else if(cashNumberFrom > chqNumberTo)
				{
					displayMessage = misys.getLocalization('mandatoryCashNumberValMessage', [dijit.byId("chqNumberTo").get("value")]);
					cashNumberFromField.focus();
				    dijit.hideTooltip(cashNumberFromField.domNode);
				    dijit.showTooltip(displayMessage, chequeNumberToField.domNode, 0);
				    hideTT = function() {
						dj.hideTooltip(cashNumberFromField.domNode);
					};
					setTimeout(hideTT, 5000);						
				}
				else if(chqComputedRange > chqNumRange)
				{
					displayMessage = misys.getLocalization('mandatoryChqNumberRangeValMessage', [chqComputedRange,chqNumRange]);
					chequeNumberToField.focus();
				    dijit.hideTooltip(chequeNumberToField.domNode);
				    dijit.showTooltip(displayMessage, chequeNumberToField.domNode, 0);
				    hideTT = function() {
						dj.hideTooltip(chequeNumberToField.domNode);
					};
					setTimeout(hideTT, 5000);
				}
				else
				{
					m.xhrPost({
						url : m.getServletURL("/screen/AjaxScreen/action/ChqStatusInquirySearchAction"),
						handleAs : "json",
						sync : true,
						content : {	
							entity : dijit.byId("entity") ? dijit.byId("entity").get("value") : "",
							acctNumber : dijit.byId("account_no").get("value"),
							acctCcy : dijit.byId("act_cur_code").get("value"),
							chqNumFrom  : chequeNumberFromField.get("value"),
							cashNumFrom : cashNumberFromField.get("value"),
							chqNumTo  : chequeNumberToField.get("value"),
							chqType : dijit.byId("chqType").get("value"),
							bankName: dijit.byId("customer_bank") ? dijit.byId("customer_bank").get("value") : ""
						},
						load : function(response, ioArgs){
							_populateChqStatusResponse(response, ioArgs);
						},
						customError : function(response, ioArgs) {
							console.error(response);
						}		    
					});							
			}
					
				}
				
				else
				{
					_fieldValidation();							
				}
			},
					
			bind : function(){
				m.connect("entity", "onChange", function(){	
					onLoad= false;
					if(dj.byId("applicant_act_nickname")){
						dj.byId("applicant_act_nickname").set("value", "");
					}
					if(misys._config.isMultiBank && dj.byId("customer_bank")){
						dj.byId("customer_bank").set("value", "");
						populateBanks();
					}
					//_setApplicantReference();
					//Below code is to clear the applicant account information.
					//As COCQI and Other SubProducts (COCQS, CQBKR) are using different ids we are doing jimix
					if(dijit.byId("sub_product_code") && dijit.byId("sub_product_code").get("value")!=='COCQI'){
						dj.byId("applicant_act_name").set("value", "");
						if(dj.byId("account_no")){
							dj.byId("account_no").set("value", "");
						}
						if(dj.byId("cheque_number_from")){
							dj.byId("cheque_number_from").set("value", "");
						}
						if(dj.byId("cheque_number_to")){
							dj.byId("cheque_number_to").set("value", "");
						}
						if(dj.byId("customer_bank")){
							dj.byId("customer_bank").set("value", "");
						}
						if(dj.byId("no_of_cheque_books")){
							dj.byId("no_of_cheque_books").set("value", "");
						}
					}else{
						dj.byId("account_no").set("value", "");
						dj.byId("chqNumberFrom").set("value", "");
						dj.byId("chqNumberTo").set("value", "");
						if(dj.byId("customer_bank")){
							dj.byId("customer_bank").set("value", "");
						}
					}
				});
				
				m.connect("applicant_act_name", "onChange", function(){
					if(misys._config.nickname==="true"){
						if(dj.byId("applicant_act_nickname") && dj.byId("applicant_act_nickname").get("value")!==""){
							d.style("label", "display", "inline-block");
							m.animate("fadeIn", d.byId("applicant_act_nickname_row"));
							m.animate("fadeIn", d.byId("nickname"));
							d.style("nickname","display","inline");
							d.byId("nickname").innerHTML = dj.byId("applicant_act_nickname").get("value");
						}else{
							m.animate("wipeOut", d.byId("applicant_act_nickname_row"));
						}
					}
				});
				
				m.connect("no_of_cheque_books", "onBlur", _validateNoOfChequeBooks);
				m.connect("adv_send_mode", "onChange", _deliveryModeChangeHandler);
				
				m.connect("customer_bank", "onChange", function()
					{	
						handleBankChange(onLoad);
					});
				m.connect("applicant_act_name", "onClick", m.validateRequiredField);
				m.connect("entity", "onClick", function() {
						if (this.get("value") == "") 
						{
						 _markFieldAsRequired(this);
						}
				});
				 m.connect("account_no", "onClick",function(){	
					 	if(this.get("value")=="")
					 	{
						 _markFieldAsRequired(this);
					 	}
				});
				 
				m.connect("chqType", "onChange", function(){
					var chqType = dj.byId("chqType").get("value");
					if(dj.byId("option") &&  dj.byId("option").get("value")==='COCQI')
						{
							if(chqType === '01')
							{
								m.animate("fadeOut", d.byId("chq_Number_From"));
								m.animate("fadeIn", d.byId("cash_Number_From"));
								dijit.byId("chqNumberFrom").set("value","");
								dijit.byId("chqNumberTo").set("value","");
								chqNumberFromFlag = false;
								cashNumberFromFlag = true;

								m.animate("fadeOut", d.byId("chq_inquiry_disclaimer"));
								m.animate("fadeIn", d.byId("co_inquiry_disclaimer"));
							}
						else if (chqType === '02' || chqType==="")
							{
							m.animate("fadeOut", d.byId("cash_Number_From"));
							m.animate("fadeIn", d.byId("chq_Number_From"));
							dijit.byId("chqNumberTo").set("value","");
							dijit.byId("cashNumberFrom").set("value","");
							chqNumberFromFlag = true;
							cashNumberFromFlag = false;

								m.animate("fadeOut", d.byId("co_inquiry_disclaimer"));
								m.animate("fadeIn", d.byId("chq_inquiry_disclaimer"));								
							}
						}
				});
				
				m.connect(
						"cheque_type",
						"onChange",
						function() {
							if ((dj.byId("option")&& dj.byId("option").get("value") === 'COCQS') || (dj.byId("subproductcode") && dj.byId("subproductcode").get("value")==='COCQS')) 
							{
								if (dj.byId("cheque_type").get("value") == '01') 
								{
									console.log(d.byId("labelId").innerHTML);
									d.byId("labelId").innerHTML = m.getLocalization('cashier_order_label');
									m.toggleRequired("labelId", true);

								} else if (dj.byId("cheque_type").get("value") == '02') 
								{
									d.byId("labelId").innerHTML = m.getLocalization('cheque_number_label');
									m.toggleRequired("labelId", true);

								}
							}

						});
				m.connect("chqNumberTo", "onChange", function(){
					 _validateFromChequeNumber(this);
				 });
			},
			
			onFormLoad : function() {
				if(misys && misys._config && misys._config.option_for_app_date === "SCRATCH")
				{
					onLoad = false;
				}
				if(misys._config.isMultiBank && dj.byId("customer_bank")){
					populateBanks(true);
				}
				if(dj.byId("adv_send_mode") && dj.byId("adv_send_mode").get("value") !== "")
				{
					_deliveryModeChangeHandler();
				}
				if(misys._config.nickname==="true" && dj.byId("applicant_act_nickname") && dj.byId("applicant_act_nickname").get("value")!=="" && d.byId("nickname")){
					m.animate("fadeIn", d.byId("nickname"));
					d.style("nickname","display","inline");
					d.byId("nickname").innerHTML = dj.byId("applicant_act_nickname").get("value");
				}else{
					m.animate("wipeOut", d.byId("applicant_act_nickname_row"));
				}
				if(misys._config.isMultiBank && dj.byId("issuing_bank_name") && dj.byId("issuing_bank_name").get("value")!==""){
					dj.byId("customer_bank").set("value", dj.byId("issuing_bank_name").get("value"));
					if(dj.byId("cheque_number_range") ){
						dj.byId("cheque_number_range").set("value", misys._config.perBankChequeNumberRange[dj.byId("customer_bank").get("value")]);
					}
					if(dijit.byId("sub_product_code") && dijit.byId("sub_product_code").get("value")==="CQBKR"){
						populateDeliveryModes();
					}
					if(dj.byId("adv_send_mode") && dj.byId("adv_send_mode_hidden"))
					{
						dj.byId("adv_send_mode").set("value", dj.byId("adv_send_mode_hidden").get("value"));
					}
				}
				
				if((dj.byId("option")&& (dj.byId("option").get("value") === 'COCQS')) || (dj.byId("subproductcode") && dj.byId("subproductcode").get("value")==='COCQS'))
				{
					if (dj.byId("cheque_type").get("value") == '01') {
						console.log(d.byId("labelId").innerHTML);
						d.byId("labelId").innerHTML = m.getLocalization('cashier_order_label');
					}
					else if (dj.byId("cheque_type").get("value") == '02' || !dj.byId("cheque_type") || dj.byId("cheque_type").get("value")== '') 
					{
						d.byId("labelId").innerHTML = m.getLocalization('cheque_number_label');
						
					}
				}
				
				
				if(dj.byId("adv_send_mode"))
				{
					_deliveryModeChangeHandler();
				}
				
				//_setApplicantReference();
				if(dj.byId("option") &&  dj.byId("option").get("value")==='COCQI')
				{
				 	var chqType = dj.byId("chqType").get("value");
					if(chqType === '01')
						{
							d.style("co_inquiry_disclaimer","display","block");
							d.style("chq_inquiry_disclaimer","display","none");
						}
					else if (chqType === '02')
						{
							d.style("chq_inquiry_disclaimer","display","block");
							d.style("co_inquiry_disclaimer","display","none");
						}
				}
				if(dijit.byId("chqType"))
				{
					dijit.byId("chqType").set("value","");
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
			
			beforeSubmitValidations : function() {
			
				if(dijit.byId("sub_product_code").get("value")==='COCQS' && dijit.byId("cheque_number_from") && dijit.byId("cheque_number_range")){
					var chqNumberFrom 	= dijit.byId("cheque_number_from").get("value"),
						chqNumberTo 	= dijit.byId("cheque_number_to").get("value"),
						chqNumRange 	= dijit.byId("cheque_number_range").get("value");
					
					if(dojo.number.parse(chqNumberFrom) === 0){
						dijit.byId("cheque_number_from").focus();
						m._config.onSubmitErrorMsg = m.getLocalization('ChequeNumberFromNonZeroValMessage');
						return false;
					}
					else if (dijit.byId("cheque_number_to").get("value") != "") {
						var chqComputedRange = (dojo.number.parse(chqNumberTo) - dojo.number.parse(chqNumberFrom)) + 1;
						if(Number(chqNumberFrom) > Number(chqNumberTo)){
							dijit.byId("cheque_number_to").focus();
							m._config.onSubmitErrorMsg = m.getLocalization('mandatoryChqNumberValMessage',[ chqNumberTo ]);
							return false;
						}
						else if(chqComputedRange > chqNumRange)
						{
							dijit.byId("cheque_number_to").focus();
							m._config.onSubmitErrorMsg = m.getLocalization('mandatoryStopChqNumberRangeValMessage',[ chqComputedRange , chqNumRange ]);
							return false;
						}
					}	
				}
		    	 var accNo = dj.byId("applicant_act_no").get("value");
		    	 var isAccountActive = m.checkAccountStatus(accNo);
		    	 if(!isAccountActive){
		    		 m._config.onSubmitErrorMsg = misys.getLocalization('accountStatusError');
						return false;
		     	 }
				return true;
			}
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.cash.create_chqService_client');