/*
 * ---------------------------------------------------------- 
 * Common JS for FX
 * Copyright (c) 2000-2012 Misys (http://www.misys.com), All Rights Reserved.
 * version: 1.0 date: 07/08/11
 * author : Satyanarayana Ragupathi
 * ----------------------------------------------------------
 */
dojo.provide("misys.binding.common.create_fx");

/**
 * Import the required dojo, dijit and customer widgets/components
 */
dojo.require("dojo.parser");

dojo.require("dijit.dijit");
dojo.require("misys.widget.Dialog");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.Button");
dojo.require("dijit.layout.ContentPane");
dojo.require("dijit.ProgressBar");

(function(/*Dojo*/d, /*Dijit*/dj, /*m*/m) {
	
	var _boardRatesDiv = d.byId('fx-board-rate-type'), //Board rate section div
		_fxContractsDiv = d.byId('fx-contracts-type'), //Contract section div
		fxParametersObject, //to hold the present product/subproduct fx configuration information object
		BUY_RATE_TYPE = '1', //To represent transaction direction as buy/direct currency pair
		SELL_RATE_TYPE = '2', //To represent transaction direction as sell/indirect currency pair
		CROSS_RATE_TYPE = '3', //To represent transaction direction as Cross currency
		originalBoardRate, //To hold the fx engine returned board rate
		originalToleranceRate, //To hold the fx engine returned tolernace rate
		patyUnits, //represents the currency pair rate units
		transactionAmount; //represents the transaction amount for which fx being triggered
	
	/**
	 * Clear all the board rate section fields for fund transfer
	 */
	function _clearBoardRateFields()
	{
		if(dj.byId('fx_exchange_rate'))
		{
			dj.byId('fx_exchange_rate').set("value",'');
			dj.byId('fx_exchange_rate_cur_code').set("value",'');
			dj.byId('fx_exchange_rate_amt').set("value",'');
		}
		if(dj.byId('fx_tolerance_rate'))
		{
			dj.byId('fx_tolerance_rate').set("value",'');
			dj.byId('fx_tolerance_rate_amt').set("value",'');
			dj.byId('fx_tolerance_rate_cur_code').set("value",'');
		}
	}
	
	/**
	 * If user chosen 'Utilize contract option' then make the first row of the 'Utilize contract Options' section. Enforcing that user should 
	 * enter first contract number and Utilize amount(if applicable) 
	 */
	function _setContractMandatory(/**boolean **/ flag)
	{
		if(dj.byId("fx_contract_nbr_1"))
	    {
			m.toggleRequired("fx_contract_nbr_1", flag);
	    }
		if(dj.byId("fx_contract_nbr_amt_1"))
	    {
			m.toggleRequired("fx_contract_nbr_amt_1", flag);
	    }
		
		// show the symbol UI
		var requiredNode = d.byId("fx_contract_nbr_1_mand");
		if(!requiredNode)
		{
			requiredNode = d.create("span", { innerHTML: "*", id:"fx_contract_nbr_1_mand"});
			d.addClass(requiredNode,"required-field-symbol");
		}
		else
		{
			requiredNode = d.byId("fx_contract_nbr_1_mand");
		}
		
		if(flag)
		{
			d.query(dj.byId("fx_contract_nbr_1").domNode.parentNode.childNodes).forEach(function(node,index){
				if(index === 0)
				{
					d.place(requiredNode,node[0],"first");
				}
			});
			
		}
		else
		{
			d.destroy(requiredNode);
		}
	}
	
	/**
	 * Clear all the fileds related to 'Utilize contracts option' section
	 */
	function _clearContractRateFields(maxNbrContracts, amtUtiliseInd)
	{
		
		if(maxNbrContracts > 0)
		{
			for(var i = 1; i<=maxNbrContracts; i++)
			{
				if (dj.byId("fx_contract_nbr_"+ i)) 
				{
				dj.byId("fx_contract_nbr_"+i).set("value",'');
				m.toggleRequired("fx_contract_nbr_"+i, false);
			}
		}
		}
		if(amtUtiliseInd === 'Y')
		{
			for(var j = 1; j<=maxNbrContracts; j++)
			{
				if(dj.byId('fx_contract_nbr_amt_'+j))
				{
					dj.byId('fx_contract_nbr_amt_'+j).set("value",'');
					dj.byId('fx_contract_nbr_cur_code_'+j).set("value",'');
				}
			}
			if((maxNbrContracts !== '1') && (dj.byId('fx_total_utilise_cur_code')))
			{
					dj.byId('fx_total_utilise_cur_code').set("value",'');
					dj.byId('fx_total_utilise_amt').set("value",'');
			}
		}
	}
	
	/**
	 * When user changes the tolerance rate then verifies whether entered value is with in the range or not. If within the range recalculate 
	 * the Equivalent amount based on the user entered tolerance rate. The calculation depends on whether the conversion is direct conversion or indirect
	 * conversion
	 */
	function _recalculateEquivalentToleranceAmt(isDirectConversion)
	{
		if(dj.byId('fxBuyOrSell') && dj.byId('fxTnxAmt'))
		{
			var rateType = dj.byId('fxBuyOrSell').get('value');
			var amount = dj.byId('fxTnxAmt').get('value');
			var widget = dj.byId('fx_tolerance_rate');
			var displayMessage;
				//If user entered value is valid recalculate
				if (rateType !== '' &&  !isNaN(amount) && dj.byId('fx_tolerance_rate') && dj.byId("fx_tolerance_rate").get("value") !== '' && dj.byId('fx_tolerance_rate_amt'))
				{
					var tempToleranceRate = dj.byId("fx_tolerance_rate").get("value");
					if(rateType === BUY_RATE_TYPE ||  rateType === CROSS_RATE_TYPE)
					{
						//Validate whether user entered tolerance rate is within the range.
						if(tempToleranceRate >= originalToleranceRate && tempToleranceRate <= originalBoardRate)
						{	
							dj.byId('fx_tolerance_rate_amt').set("value", (amount * (tempToleranceRate/patyUnits )));
						}
						else
						{
							displayMessage = misys.getLocalization('fxToleranceRangeError',[originalToleranceRate,originalBoardRate]);
							widget.focus();
					 		widget.set("state","Error");
					 		dj.hideTooltip(widget.domNode);
					 		dj.showTooltip(displayMessage, widget.domNode, 0);
					 		// dj.showTooltip(displayMessage, domNode, 0);
						}
					}
					else if(rateType === SELL_RATE_TYPE)
					{
						if(tempToleranceRate >= originalBoardRate && tempToleranceRate <= originalToleranceRate)
						{
							dj.byId('fx_tolerance_rate_amt').set("value", (amount / (tempToleranceRate/patyUnits )));
						}
						else
						{
							displayMessage = misys.getLocalization('fxToleranceRangeError',[originalBoardRate,originalToleranceRate]);
							widget.focus();
					 		widget.set("state","Error");
					 		dj.hideTooltip(widget.domNode);
					 		dj.showTooltip(displayMessage, widget.domNode, 0);
					 		// dj.showTooltip(displayMessage, domNode, 0);
						}
					}
				}
		}
	}
	
	/**
	 * makes the Tolerance rate edit filed readonly
	 */
	function _readOnlyBoardRateFields(readOnlyFlag)
	{
		if(dj.byId('fx_tolerance_rate'))
		{
			dj.byId('fx_tolerance_rate').set("readOnly",readOnlyFlag);
		}
	}
	
	/**
	 * makes the contract number and utilize amount fields readonly 
	 */
	function _readOnlyContractRateFields(maxNbrContracts, amtUtiliseInd, readOnlyFlag)
	{
		if(maxNbrContracts > 0)
		{
			for(var i = 1; i<=maxNbrContracts; i++)
			{
				if (dj.byId("fx_contract_nbr_"+ i)) 
				{
				dj.byId('fx_contract_nbr_'+i).set("readOnly", readOnlyFlag);
			}
		}
		}
		if(amtUtiliseInd === 'Y')
		{
			for(var j = 1; j<=maxNbrContracts; j++)
			{
				if(dj.byId('fx_contract_nbr_amt_'+j))
				{
					dj.byId('fx_contract_nbr_amt_'+j).set("readOnly",readOnlyFlag);
				}
			}			
		}
	}
	
	/**
	 * On selecting either 'Board Rate'/'Utilize Contract' radio button, based on the option chosen clearing the other section
	 * fields data, making read only and hiding. And displaying the chosen option related fields and binding the necessary validaiton functions
	 */
	function _onClickBindingType(maxNbrContracts, amtUtiliseInd)
	{
		var subTnxTypeCode = dj.byId("sub_tnx_type_code");
		var tnxTypeCode = dj.byId("tnx_type_code");
		//Board rate option is chosen 
		if(dj.byId('fx_rates_type_1') && dj.byId('fx_rates_type_1').get('checked'))
		{
			//clear contract rate fields
			_clearContractRateFields(maxNbrContracts, amtUtiliseInd);
			//fire the default fx function to trigger fx engine to retrieve the board rate and equivalent amount
			m.fireFXAction();
			//hide the contracts related fields
			m.animate('fadeOut', _fxContractsDiv);
			//display board rate related fields
			m.animate('fadeIn', _boardRatesDiv);
			//hide contracts related static message row
			m.animate('fadeOut', d.byId('contractMsgDiv'));
			//hide total utilize amount row
			m.animate('fadeOut', d.byId('totalUtiliseDiv'));
			//Unregister the action binded for contract option fields
			m.disconnect(dj.byId('fx_rates_type_2'));
			// make one contract number non mandatory
			_setContractMandatory(false);
			
		}
		//Utilize Contracts option chosen
		if(dj.byId('fx_rates_type_2') && dj.byId('fx_rates_type_2').get('checked'))
		{
			//clear board rate fields
			_clearBoardRateFields();
			//hide board rate fields
			m.animate('fadeOut', _boardRatesDiv);
			//display contracts related fields
			m.animate('fadeIn', _fxContractsDiv);
			//display contract static message row
			m.animate('fadeIn', d.byId('contractMsgDiv'));
			//display total utilize amount fields
			m.animate('fadeIn', d.byId('totalUtiliseDiv'));
			if(maxNbrContracts !== '1'){
			//register all utilize amount edit fields to recalculate the total utilize amount on change of any utilize amount	
			m.registerAndcalculateTotalUtiliseAmt(maxNbrContracts);
			}
			// make one contract number mandatory
			if ((tnxTypeCode && tnxTypeCode.get("value") === '85') || (subTnxTypeCode && subTnxTypeCode.get("value") === 'A4'))
			{
				_setContractMandatory(false);
			}
			else
			{
				_setContractMandatory(true);	
			}
		}
	}
	
	function _fxinitDialogs( /*String*/ dialogId) {
		// summary:
		//		Creates the standard dialogs, the first time an attempt is made to open
		//      one.
		
			var alertDialog = new dijit.Dialog({
				id: "fxalertDialog",
				refocus: false,
				draggable: false,
				"class": "dialog"
			}),
			container = d.create("div"),
			dialogButtonsContainer = d.create("div", {
				id: "fxdialogButtons",
				"class": "dijitDialogPaneActionBar"
			});
		
		
		// <p> that will container the dialog message
		d.place(d.create("div", {
			id: "fxalertDialogContent"
		}), container);
		var progressBarPlaceAt = new dijit.ProgressBar({
			id: "fxdialogProgressBar",
			indeterminate: true
		});
		progressBarPlaceAt.placeAt(container);
		
		d.place(dialogButtonsContainer, container);
		alertDialog.set("content", container);

		return alertDialog ;
	}
	function _fxhide() {
		var dialogIds = "fxalertDialog";
		var dialog = dj.byId(dialogId);
		if (dialog && dialog.get("open")) {
			dialog.hide();
		}
	}
	function _fxshow(  type, message,  title  ) 
	{

			type = type.toUpperCase();
			var dialogId = "fxalertDialog";
			dialog = dj.byId(dialogId) || _fxinitDialogs(dialogId);
			var dialogProgressBar = d.byId("fxdialogProgressBar"), alertDialogContent = d.byId("fxalertDialogContent");
			console.debug("[misys._base] Opening a dialog of type", type);
			
			d.style(dialogProgressBar, "display", "none");
			d.style(dialogProgressBar, "visibility", "hidden");
			
			d.toggleClass(alertDialogContent, "informationDialog",
					type === "FXPROGRESS");
			
				title = m.getLocalization("progressMessage");
				d.style(alertDialogContent, "height", "auto");
				d.style(dialogProgressBar, "display", "block");
				d.style(dialogProgressBar, "visibility", "visible");
		

			dialog.set("title", title);
			if (type !== "URL" && type !== "HTML") {
				alertDialogContent.innerHTML = message;
				d.style(alertDialogContent, "height", "auto");
				d.style(alertDialogContent, "width", "auto");
			}

			return dialog.show();
		}

	
	/**
	 * dojo.mixin is a simple utility function for mixing objects together. Mixin combines two objects from right to left,
	 *  overwriting the left-most object, and returning the newly mixed object for use.
	 */
	d.mixin(m, {
		
		fxContractNbrAmtOnBlur : function()
		{
			m.setTnxAmt(this.get('value'));
			m.calculateTotalUtiliseAmt(maxNbrContracts);
		},
		
		
		/**
		 * Validate the tolerance and exchange rate format. it should be max 4n.7n
		 */
		validateToleranceAndExchangeRate : function()
		{
			var toleranceRate,
			    value,
	            isValid = true;
	            
			if(this && this.get("value") !== "")
			{
				value = this.get("value");
				if(isNaN(value))
				{
					this.invalidMessage = m.getLocalization("invalidExchangeAndTolerateRate");
					m.showTooltip(m.getLocalization("invalidExchangeAndTolerateRate"),
							this.domNode, ["after"]);
					this.state = "Error";
					this._setStateClass();
					dj.setWaiState(field.focusNode, "invalid", "true");
					return false;
				}
				//split the number in decimal point
				toleranceRate = value.split(".");
				// check the first part is it less than four.
				if((toleranceRate[0]) && (toleranceRate[0].length > 4))
				{
						isValid = false;
				}
				// check for second part
				if((toleranceRate[1]) && (toleranceRate[1].length > 7))
				{
						isValid = false;
				}
				//check is the value valid
				if(!isValid)
				{
					this.invalidMessage = m.getLocalization("invalidExchangeAndTolerateRateLength");
					m.showTooltip(m.getLocalization("invalidExchangeAndTolerateRateLength"),
							this.domNode, ["after"]);
					this.state = "Error";
					this._setStateClass();
					dj.setWaiState(field.focusNode, "invalid", "true");
					return false;
				}
			}
			return true;
			
		},
		
		/**
		 * Create the no.of contracts rows(contract number label/edit field,Utilize Amount label/currency/edit field  dynamically based 
		 * on the parameter configuration
		 */
		createContractRateFields : function(maxNbrContracts,amtUtiliseInd)
		{
			var subTnxTypeCode = dj.byId("sub_tnx_type_code");
			var tnxTypeCode = dj.byId("tnx_type_code");
			
			for(var i=1;i<=maxNbrContracts;i++)
			{
				if(!dijit.byId("fx_contract_nbr_"+i))
				{	  
					var div = dojo.create("div",null,dojo.byId('fx-contracts-type'));
					div.id = "fx_contract_nbr_"+i;
					
					var contractNbrLabel= dojo.create("label",{innerHTML: m.getLocalization('FXContractNumber')},div);
					var contractNbrText   = new dijit.form.ValidationTextBox({id: 'fx_contract_nbr_'+i,name: 'fx_contract_nbr_'+i}).placeAt(div, 'last');
					if(contractNbrText)
					{
						contractNbrText.set("maxLength","16");
					}
					if(((!tnxTypeCode || tnxTypeCode.get("value") !== '85')&& (!subTnxTypeCode || subTnxTypeCode.get("value") !== 'A4')) && amtUtiliseInd === 'Y')
					{
						var divAmtUt = dojo.create("div",{"class" : "inlineBlock amtUtiliseDiv"},div);
						var amtToUtiliseLabel= dojo.create("label",{innerHTML: m.getLocalization('FXAmountToUtilise2')},divAmtUt);
						var amtToUtiliseCur   = new dijit.form.ValidationTextBox({id: 'fx_contract_nbr_cur_code_'+i,name: 'fx_contract_nbr_cur_code_'+i, maxLength: '3', readOnly: 'Y', 'class' :'xx-small'}).placeAt(divAmtUt, 'last');
						var amtToUtiliseText   = new misys.form.CurrencyTextBox({id: 'fx_contract_nbr_amt_'+i,name: 'fx_contract_nbr_amt_'+i}).placeAt(divAmtUt, 'last');
					}
				}
				if  (((!tnxTypeCode || tnxTypeCode.get("value") !== '85') && (!subTnxTypeCode || subTnxTypeCode.get("value") !== 'A4'))&& (amtUtiliseInd === 'Y' && maxNbrContracts !== '1' && !dijit.byId("fx_total_utilise_amt")) )
				{
						var contractMsgDiv = dojo.create("div",{"class" : "amtUtiliseDiv"},d.byId('contractMsgDiv'));
						var utiliseFXLabel= dojo.create("span",{innerHTML: m.getLocalization('FXContractSequenceNote')},contractMsgDiv);
						
						var totalUtiliseDiv = dojo.create("div",{"class" : "inlineBlock amtUtiliseDiv"},contractMsgDiv);
						var totalUtiliseLabel= dojo.create("label",{innerHTML: m.getLocalization('FXTotalAmountToUtilise')},totalUtiliseDiv);
						var totalUtiliseCur   = new dijit.form.ValidationTextBox({id: 'fx_total_utilise_cur_code',name: 'fx_total_utilise_cur_code', maxLength: '3', readOnly: 'Y', 'class' :'xx-small'}).placeAt(totalUtiliseDiv, 'last');
						var totalUtiliseText   = new misys.form.CurrencyTextBox({id: 'fx_total_utilise_amt',name: 'fx_total_utilise_amt'}).placeAt(totalUtiliseDiv, 'last');
						dj.byId('fx_total_utilise_amt').set('readOnly', true); //total amount is always non editable.
				}
			}
			if(amtUtiliseInd === 'Y')
			{
				for(var j=1;j<=maxNbrContracts;j++)
				{
					m.setCurrency(dj.byId("fx_contract_nbr_cur_code_"+j), ["fx_contract_nbr_amt_"+j]);
					
					if ((!tnxTypeCode || tnxTypeCode.get("value") !== '85') && (!subTnxTypeCode || subTnxTypeCode.get("value") !== 'A4'))
					{
						dj.byId("fx_contract_nbr_cur_code_"+j).set('readOnly', true);
						if(dj.byId('fx_total_utilise_cur_code'))
							{
						dj.byId('fx_total_utilise_cur_code').set('readOnly', true);
							}
					}
				}
			}			
		},
		
		/**
		 * Already saved contracts data pushing on to the contract fields
		 */
		setDataForContractFields : function(maxNbrContracts,amtUtiliseInd)
		{
			var subTnxTypeCode = dj.byId("sub_tnx_type_code");
			var tnxTypeCode = dj.byId("tnx_type_code");
			
			if(m._config.fxContractData)
			{
				for(var i=1;i<=maxNbrContracts;i++)
				{
					var contractData = m._config.fxContractData; 
					if(dj.byId("fx_contract_nbr_"+i))
					{	
						dj.byId("fx_contract_nbr_"+i).set('value',contractData['fx_contract_nbr_'+i]);
						
						if (((!tnxTypeCode || tnxTypeCode.get("value") !== '85') && (!subTnxTypeCode || subTnxTypeCode.get("value") !== 'A4')) && amtUtiliseInd === 'Y')
						{
							dj.byId("fx_contract_nbr_cur_code_"+i).set('value',contractData['fx_contract_nbr_cur_code_'+i]);
							dj.byId("fx_contract_nbr_amt_"+i).set('value',contractData['fx_contract_nbr_amt_'+i]);
						}
					}
				}
			}
		},
		
		/**
		 * on change of each utilize amount field recalculate the total utilize amount.
		 * also validates whether the total utilize amount is greater than the transaction amount.If greater, then display the error message. 
		 */
		calculateTotalUtiliseAmt : function(maxNbrContracts)
		{
			var transactionAmount = dj.byId("ft_amt")?dj.byId("ft_amt").get("value"):dj.byId("td_amt").get("value");
			var  totalAmount =0;
			var displayMessage,widget;
			for(var i = 1; i<=maxNbrContracts; i++)
			{
				if (dj.byId("fx_contract_nbr_amt_"+ i)) 
				{	
				var currentContAmt;
					if(!isNaN(dj.byId("fx_contract_nbr_amt_"+i).get("value")))
					{
					currentContAmt = dj.byId("fx_contract_nbr_amt_"+i).get("value");
					}
					else
					{
					currentContAmt = 0;
					}
				totalAmount = totalAmount + currentContAmt;

					if(totalAmount === '0')
					{
					dj.byId("fx_total_utilise_amt").set("value",'');	
					}
					else
					{
						if(transactionAmount && parseFloat(totalAmount.toFixed(2)) <= parseFloat(transactionAmount) )
						{
							dj.byId("fx_total_utilise_amt").set("value", parseFloat(totalAmount));	
						}
						else{
							displayMessage =  misys.getLocalization('fxContractUtlizeAmtError',[totalAmount.toFixed(2),transactionAmount]);
							widget = dj.byId("fx_contract_nbr_amt_"+ i);
							//widget.focus(); // It causes recursive function calling
					 		widget.set("state","Error");
					 		dj.hideTooltip(widget.domNode);
					 		dj.showTooltip(displayMessage, widget.domNode, 0);
					 		dj.showTooltip(displayMessage, domNode, 0);
						}					
					}
				m.setCurrency(dj.byId('fx_total_utilise_cur_code'), ['fx_total_utilise_amt']);
			}
		  }
		},
		
		/**
		 * Recalculate the Total Utilize Amount
		 */
		againcalculateTotalUtiliseAmtForDrafts : function(maxNbrContracts)
		{
			var transactionAmount = dj.byId("ft_amt")?dj.byId("ft_amt").get("value"):dj.byId("td_amt").get("value");
			var  totalAmount =0;
			var displayMessage,widget;
			for(var i = 1; i<=maxNbrContracts; i++)
			{
				if (dj.byId("fx_contract_nbr_amt_"+ i)) 
				{	
				var currentContAmt;
					if(!isNaN(dj.byId("fx_contract_nbr_amt_"+i).get("value")))
					{
					currentContAmt = dj.byId("fx_contract_nbr_amt_"+i).get("value");
					}
					else
					{
					currentContAmt = 0;
					}
				totalAmount = totalAmount + currentContAmt;

					if(totalAmount === '0')
					{
					dj.byId("fx_total_utilise_amt").set("value",'');	
					}
					else
					{
						if(transactionAmount && parseFloat(totalAmount) <= parseFloat(transactionAmount) )
						{
							dj.byId("fx_total_utilise_amt").set("value", parseFloat(totalAmount));
						
						}
											
					}
				m.setCurrency(dj.byId('fx_total_utilise_cur_code'), ['fx_total_utilise_amt']);
			}
		  }
		},
		
		/**
		 * bind all the utilize amount edit fields to trigger recalculating the total utilize amount
		 */
		registerAndcalculateTotalUtiliseAmt : function(maxNbrContracts)
		{
			for(var i = 1; i<=maxNbrContracts; i++)
			{
				if (dj.byId("fx_contract_nbr_amt_"+ i)) 
				{
				m.connect(('fx_contract_nbr_amt_'+ i), 'onBlur', function(){
					m.setTnxAmt(this.get('value'));
					m.calculateTotalUtiliseAmt(maxNbrContracts);
				});
				m.calculateTotalUtiliseAmt(maxNbrContracts);
				}
			}
		},
		
		registerAndAgainCalculateTotalAmountforDrafts : function(maxNbrContracts)
		{
			var transactionAmount = dj.byId("ft_amt")?dj.byId("ft_amt").get("value"):dj.byId("td_amt").get("value");
			for(var i = 1; i<=maxNbrContracts; i++)
			{
				if (dj.byId("fx_contract_nbr_amt_"+ i).get("value")!== '') 
				{
					m.connect(('fx_contract_nbr_amt_'+ i), 'onBlur', function(){
					m.setTnxAmt(this.get('value'));
					m.calculateTotalUtiliseAmt(maxNbrContracts);
				});
				
				}
			}
		},
		

		
		/**
		 * On submitting transaction validates, if the utilize contract option chosen, verifies whether first contract number, utilize amount
		 * entered or not.
		 * Also verifies whether there are any contract number rows left blank and entered values in the succeeding rows
		 * Verifies not to allow the Utilize amount to be zero
		 * Verifies whether both contract number and utilize amount fields of any row properly entered or not
		 */
		fxBeforeSubmitValidation : function()
		{
			var maxNbrContracts = fxParametersObject.fxParametersData.maxNbrContracts;
			var amtUtiliseInd =  fxParametersObject.fxParametersData.amtUtiliseInd;
			var incorrectContractsTooltip = misys.getLocalization('fxInBetweenContractError');
			//Validations for all the contract fields
			if(dj.byId('fx_rates_type_2') && dj.byId('fx_rates_type_2').get('checked'))
			{
				for(var j = 1; j<=maxNbrContracts; j++)
				{
						var contractAmt = "fx_contract_nbr_amt_"+j;
						var contractNo = "fx_contract_nbr_"+j;	
						
						if(amtUtiliseInd && amtUtiliseInd === "Y")
						{	
							if(dj.byId(contractAmt) && dj.byId(contractNo) && (dj.byId(contractNo).get("value")==="" || isNaN(dj.byId(contractAmt).get("value"))))
							{
								//Contract Number1 and amount1 are mandatory fields
								if(dj.byId(contractNo).get("value")==="" && isNaN(dj.byId(contractAmt).get("value")) && j === 1)
								{
									dj.byId(contractAmt).set("required", true);	
									dj.byId(contractNo).set("required", true);		
									dj.byId(contractNo).focus();
									return false;
								}else if(!isNaN(dj.byId(contractAmt).get("value") && dj.byId(contractNo).get("value")===""))
									{
										dj.byId(contractNo).set("required", true);								
										dj.byId(contractNo).focus();
										return false;
								}else if(dj.byId(contractNo).get("value")!== "" && isNaN(dj.byId(contractAmt).get("value")))
									{
										dj.byId(contractAmt).set("required", true);								
										dj.byId(contractAmt).focus();
										return false;
								}else if(j!== 1 && dj.byId("fx_contract_nbr_"+(j+1)) && dj.byId("fx_contract_nbr_"+(j+1)).get('value') !== '' && dj.byId("fx_contract_nbr_amt_"+(j+1)) && dj.byId("fx_contract_nbr_amt_"+(j+1)).get('value') !== '')
									{
										dj.byId(contractNo).set("required", true);								
										dijit.showTooltip(incorrectContractsTooltip, dj.byId(contractNo).domNode, 0);
										return false;
									}
							}
							//Do not allow amount to be zero.
							if(dj.byId(contractAmt) && dj.byId(contractAmt).get("value") <= 0)
							{
								dj.byId(contractAmt).set("value","");
								var incorrectamtTooltip = misys.getLocalization('fxIncorrectAmount');
								dijit.showTooltip(incorrectamtTooltip, dj.byId(contractAmt).domNode, 0);
								return false;
							}	
						}else
							{
								if(dj.byId(contractNo) &&  j === 1 && dj.byId(contractNo).get("value")==="")
								{
									dj.byId(contractNo).set("required", true);								
									dj.byId(contractNo).focus();
									return false;
								}else if(j !== 1 && dj.byId(contractNo) && dj.byId(contractNo).get("value")==="" && dj.byId("fx_contract_nbr_"+(j+1)) && dj.byId("fx_contract_nbr_"+(j+1)).get('value') !== '' ){
									dj.byId(contractNo).set("required", true);								
									dijit.showTooltip(incorrectContractsTooltip, dj.byId(contractNo).domNode, 0);
									return false;
								}	
							}
				}
			}
			for(var h = 1; h<=maxNbrContracts; h++)
			{
				var contractAmount = "fx_contract_nbr_amt_"+h;
				if(dj.byId(contractAmount).get("state") === 'Error')
				{
					dj.byId(contractAmount).set("state", "");
				}
			}
			return true;
		},
		
		/**
		 * Initialize the fx parameter object based on the sub product code.
		 */
		initializeFX : function(subProductCode)
		{
			if(m._config.fxParamData)
			{
			fxParametersObject = m._config.fxParamData[subProductCode];
			}
		},
		
		/**
		 * While opening the fx section perform the common steps like,
		 * verify whether fx enabled for the sub product
		 * select the Board rate option default and trigger the fx engine to fetch board rate and equivalent amount,tolerance rate and equivalent amount
		 * creates contract fields based on the fx parameter configuration
		 * 
		 */
		defaultBindTheFXTypes : function()
		{
			//Verify whether fx enabled or not. If not hide the fx section.
			if(fxParametersObject && fxParametersObject.fxParametersData && fxParametersObject.fxParametersData.isFXEnabled === 'Y')
			{
				var maxNbrContracts,amtUtiliseInd;
				maxNbrContracts = fxParametersObject.fxParametersData.maxNbrContracts;
				amtUtiliseInd = fxParametersObject.fxParametersData.amtUtiliseInd;
				var subTnxTypeCode = dj.byId("sub_tnx_type_code");
				var tnxTypeCode = dj.byId("tnx_type_code");
					
				if(dj.byId('fx_rates_type_1'))
				{
					m.animate('fadeOut', _fxContractsDiv);				
					m.animate('fadeOut', d.byId('contractMsgDiv'));
					m.animate('fadeOut', d.byId('totalUtiliseDiv'));
					m.animate('fadeIn', _boardRatesDiv);
				}
				m.createContractRateFields(maxNbrContracts, amtUtiliseInd);
			
				if (((!tnxTypeCode || tnxTypeCode.get("value") !== '85') && (!subTnxTypeCode || subTnxTypeCode.get("value") !== 'A4')) && dj.byId('fx_rates_type_2'))
				{
					dj.byId('fx_rates_type_2').set('readOnly',true);
				}
				_clearContractRateFields(maxNbrContracts,amtUtiliseInd);
				_readOnlyBoardRateFields(true);
				if(dj.byId('fx_rates_type_1'))
				{
					dj.byId('fx_rates_type_1').set('checked',true);
				}
				_clearBoardRateFields();
				_readOnlyContractRateFields(true);
				if (((!tnxTypeCode || tnxTypeCode.get("value") !== '85') && (!subTnxTypeCode || subTnxTypeCode.get("value") !== 'A4')) && dj.byId('fx_rates_type_1'))
				{
					dj.byId('fx_rates_type_1').set('readOnly',true);
				}
				//If tolerance display indiactor is configured as 'N' then Tolerance Rate and Tolerance Equivalent Amount fields will be hidden
				if(fxParametersObject.fxParametersData.toleranceDispInd && fxParametersObject.fxParametersData.toleranceDispInd === 'Y')
				{
					m.animate('fadeIn', d.byId('tolerance_div'));
				}
				else
				{
					m.animate('fadeOut', d.byId('tolerance_div'));
				}
			}
			else
			{
				m.animate('fadeOut', d.byId('fx-message-type'));
				if(d.byId("fx-section"))
					{
						d.style("fx-section","display","none");
					}
			}
		},
		
		/**
		 * Bind the Utilize contract option radio button to perform the necessary actions
		 */
		bindTheFXTypes : function(maxNbrContracts, amtUtiliseInd)
		{
			m.connect('fx_rates_type_2', 'onChange', function(){				
			 _onClickBindingType(maxNbrContracts, amtUtiliseInd);		
			});
		},
		
		/**
		 * Set the master currency on each Utilize Amount currency field and Total Utilize Amount currency field
		 */
		setMasterCurrency : function(maxNbrContracts, toCurrency)
		{
			for(var i=1;i<=maxNbrContracts;i++)
			{
				if(dj.byId('fx_contract_nbr_cur_code_'+i) && toCurrency !== '' )
				{
					dj.byId('fx_contract_nbr_cur_code_'+i).set('value',toCurrency);
				}
			}
			if(dj.byId('fx_total_utilise_cur_code') && toCurrency !== '')
			{
				dj.byId('fx_total_utilise_cur_code').set('value', toCurrency);
			}
			for(var j=1;j<=maxNbrContracts;j++)
			{
				m.setCurrency(dj.byId("fx_contract_nbr_cur_code_"+j), ["fx_contract_nbr_amt_"+j]);
			}
		},
		
		/**
		 * To display the saved fx section information, this function gets called on form load.
		 */
		onloadFXActions : function()
		{
			var  maxNbrContracts,amtUtiliseInd;
			var subTnxTypeCode = dj.byId("sub_tnx_type_code");
			var tnxTypeCode = dj.byId("tnx_type_code");
			var fxRatesTypeTemp = dj.byId("fx_rates_type_temp");
			
			if( fxRatesTypeTemp && fxRatesTypeTemp.get("value") === "01")
			{
				d.style("fx-contracts-type","display","none");
				d.style("contractMsgDiv","display","none");
				d.style("totalUtiliseDiv","display","none");
			}
			else if(fxRatesTypeTemp && fxRatesTypeTemp.get("value") === "02")
			{
				d.style("fx-board-rate-type","display","none");
			}
			if(fxRatesTypeTemp && fxRatesTypeTemp.get('value') !== '')
			{
				maxNbrContracts = fxParametersObject.fxParametersData.maxNbrContracts;
				amtUtiliseInd =  fxParametersObject.fxParametersData.amtUtiliseInd;
				m.createContractRateFields(maxNbrContracts, amtUtiliseInd);//, "SGD");
				m.setDataForContractFields(maxNbrContracts, amtUtiliseInd);
				m.bindTheFXTypes(dj.byId('fx_nbr_contracts').get('value'), amtUtiliseInd);				
				   if(dj.byId('fx_rates_type_1') && dj.byId('fx_rates_type_1').get('checked'))
				   {
					   dj.byId('fx_rates_type_1').set('checked', true);
					    m.fireFXAction();
				   }
				   else if(dj.byId('fx_rates_type_2') && dj.byId('fx_rates_type_2').get('checked'))
				   {
					   dj.byId('fx_rates_type_2').set('checked', true);
					    if(dj.byId('fx_master_currency') && dj.byId('fx_master_currency').get('value') !== '')
					    {
					    	m.setMasterCurrency(dj.byId('fx_nbr_contracts').get('value'), dj.byId('fx_master_currency').get('value'));
					    }

						// make one contract number mandatory
						if ((tnxTypeCode && tnxTypeCode.get("value") === '85') || (subTnxTypeCode && subTnxTypeCode.get("value") === 'A4'))
						{
							_setContractMandatory(false);
						}
						else
						{
							if(dj.byId('fx_nbr_contracts').get('value') >= '1')
							{
								m.againcalculateTotalUtiliseAmtForDrafts(dj.byId('fx_nbr_contracts').get('value'));
								m.registerAndAgainCalculateTotalAmountforDrafts(dj.byId('fx_nbr_contracts').get('value'));
								if(dj.byId('fx_nbr_contracts').get('value') !== fxParametersObject.fxParametersData.maxNbrContracts)
								{
									if(dj.byId('fx_contract_nbr_1') && dj.byId('fx_contract_nbr_1').get('value') !== '')
									{
										dj.byId('fx_contract_nbr_1').set('value', dj.byId('fx_contract_nbr_1').get('value'));
									}
								}
								m.setCurrency(dj.byId('fx_total_utilise_cur_code'), ['fx_total_utilise_amt']);						
							}
							_setContractMandatory(true);	
						}
						
				   }
			}
			else if(dj.byId('fx_rates_type_1') || dj.byId('fx_rates_type_2'))
			{
				   maxNbrContracts = fxParametersObject.fxParametersData.maxNbrContracts;
				   amtUtiliseInd =  fxParametersObject.fxParametersData.amtUtiliseInd;
				   m.createContractRateFields(maxNbrContracts, amtUtiliseInd);
				   m.defaultBindTheFXTypes();
			   }
			//If tolerance display indiactor is configured as 'N' then Tolerance Rate and Tolerance Equivalent Amount fields will be hidden
			if(fxParametersObject.fxParametersData.toleranceDispInd && fxParametersObject.fxParametersData.toleranceDispInd === 'Y')
			{
				m.animate('fadeIn', d.byId('tolerance_div'));
			}
			else
			{
				m.animate('fadeOut', d.byId('tolerance_div'));
			}
		}, 
		
		/**
		 * This function triggers the fx engine and fetach the board rate and equivalent amount, if applicable, tolerance rate and equivalent tolerance amount.
		 */
		fetchFXDetails : function(fromCurrency, toCurrency, amount, productCode, bankAbbvName, masterCurrency, isDirectConversion)
		{
			
			var enableBoardRate,boardRateFlag,boardRateMinAmt,boardRateMaxAmt,enableContractRate,contractRateFlag,contractRateMinAmt,contractRateMaxAmt,
				exchangeRate,exchangeRateToken,equivalentRateAmt,maxNbrContracts,amtUtiliseInd,tolerancePercent,toleranceDispInd,toleranceRate,
				toleranceEquiAmount, buyOrSell, boardRateTooltip, contractRateTooltip;
			var subTnxTypeCode = dj.byId("sub_tnx_type_code");
			var tnxTypeCode = dj.byId("tnx_type_code");
			//verify whether fx parameter data is defined			
			if(fxParametersObject.fxParametersData)
			{
			
				maxNbrContracts = fxParametersObject.fxParametersData.maxNbrContracts;
				amtUtiliseInd =  fxParametersObject.fxParametersData.amtUtiliseInd;
				toleranceDispInd = fxParametersObject.fxParametersData.toleranceDispInd;
				
				if(!maxNbrContracts)
				{
					maxNbrContracts = '1';
				}
				
				if(!amtUtiliseInd)
				{
					amtUtiliseInd = 'N';
				}
				//fetch the tolerance percentage if tolerance display indicator is enabled in fx parameter configuration
				if(toleranceDispInd && toleranceDispInd === 'Y')
				{
					tolerancePercent = fxParametersObject.fxParametersData.tolerancePercentage;
				}
				else
				{
					tolerancePercent = '';
				}
			
				if ((tnxTypeCode && tnxTypeCode.get("value") === '85') || (subTnxTypeCode && subTnxTypeCode.get("value") === 'A4'))
				{
					if(toCurrency === "" || (fxParametersObject.fxParametersData.boardCurrencies && fxParametersObject.fxParametersData.boardCurrencies[toCurrency]))
					{
						enableBoardRate = 'Y';
					}
					else
					{
						enableBoardRate = 'N';
					}
				}
				else
				{
					//Validating whether board rate is enabled and amount is within min,max range
					if(fxParametersObject.fxParametersData.boardCurrencies && fxParametersObject.fxParametersData.boardCurrencies[toCurrency])
					{
						boardRateMinAmt = fxParametersObject.fxParametersData.boardCurrencies[toCurrency].minAmt; 
						boardRateMaxAmt = fxParametersObject.fxParametersData.boardCurrencies[toCurrency].maxAmt; 
						
						if ((!tnxTypeCode || tnxTypeCode.get("value") !== '85')&& (!subTnxTypeCode || subTnxTypeCode.get("value") !== 'A4'))
						{
							if (amount >= boardRateMinAmt && amount <= boardRateMaxAmt)
							{
									enableBoardRate = 'Y';
							}
							else
							{
									boardRateTooltip = misys.getLocalization('FXAmountNotInSpecifiedRange', [boardRateMinAmt,boardRateMaxAmt,toCurrency]);
									enableBoardRate = 'N';
							}
						}
					}	
					else
					{
						boardRateTooltip = misys.getLocalization('FXOptionNotAvailable');
						enableBoardRate = 'N';
					}
				}
				//If board rate option is enabled for the transaction currency
				if(enableBoardRate === 'Y')
				{
					//create a progress bar while the rates are fetched.
					_fxshow("FXPROGRESS", m.getLocalization("fetchingExchangeRates"));	
					m.xhrPost( {
						//makes an ajax calls to fx engine to fetch board rate details
						url : misys.getServletURL("/screen/AjaxScreen/action/FXRatesAction"),
						sync : true,
						handleAs : "json",
						content : {
							fromCur: fromCurrency,
							toCur: toCurrency,
							amount: amount,
							productCode: productCode,
							bankAbbvName: bankAbbvName,
							tolerancePercent: tolerancePercent,
							isDirectConversion: isDirectConversion
						},
						load : function(response, args){
							//retrieve the board rate information from the ajax call response.
							exchangeRate = response.boardExchangeRate;
							originalBoardRate = response.boardExchangeRate;
							equivalentRateAmt = response.equivalentRateAmt;
							exchangeRateToken = response.fxToken;
							toleranceRate = response.toleranceRate;
							originalToleranceRate = response.toleranceRate;
							toleranceEquiAmount = response.toleranceEquiAmount;
							buyOrSell = response.buyOrSell;
							patyUnits = response.patyUnits;
							transactionAmount = amount;
							
							if(exchangeRate && exchangeRate !== '' && equivalentRateAmt && equivalentRateAmt !== '' && exchangeRateToken && exchangeRateToken !=='')
							{
									
								if(exchangeRateToken && exchangeRateToken !== '' && dj.byId('fxinteresttoken'))
								{
								    dj.byId('fxinteresttoken').set('value', exchangeRateToken);
								}
								
								if(dj.byId('fx_exchange_rate') && exchangeRate && exchangeRate !== '')
								{
									dj.byId('fx_exchange_rate').set('value', exchangeRate);
								}
								var subTnxTypeCode = dj.byId("sub_tnx_type_code");
								var tnxTypeCode = dj.byId("tnx_type_code");
								
								if ((!tnxTypeCode || tnxTypeCode.get("value") !== '85') && (!subTnxTypeCode || subTnxTypeCode.get("value") !== 'A4') && (dj.byId('fx_exchange_rate_cur_code') && masterCurrency && masterCurrency !== ''))
								{
									dj.byId('fx_exchange_rate_cur_code').set('value', masterCurrency);
								}
								if(dj.byId('fx_exchange_rate_amt') && equivalentRateAmt && equivalentRateAmt !== '')
								{
									dj.byId('fx_exchange_rate_amt').set('value', parseFloat(equivalentRateAmt));
									
									if ((tnxTypeCode && tnxTypeCode.get("value") === '85') || (subTnxTypeCode && subTnxTypeCode.get("value") === 'A4'))
									{
										m.setRepaymentCurrency(dj.byId('fx_exchange_rate_cur_code'), ['fx_exchange_rate_amt']);
									}
									else
									{
										m.setCurrency(dj.byId('fx_exchange_rate_cur_code'), ['fx_exchange_rate_amt']);	
									}
								}
								
								if(dj.byId('fxBuyOrSell'))
								{
									dj.byId('fxBuyOrSell').set('value', buyOrSell);
								}
								
								if(dj.byId('fxTnxAmt'))
								{
									dj.byId('fxTnxAmt').set('value', amount);
								}
								
								//set the tolerance amount, tolerance equivalent amount and currency
								if(toleranceDispInd && toleranceDispInd === 'Y' && toleranceRate && toleranceRate !==''&& toleranceEquiAmount && toleranceEquiAmount !== '')
								{
									if(dj.byId('fx_tolerance_rate') && toleranceRate && toleranceRate !== '')
									{
										dj.byId('fx_tolerance_rate').set('value', toleranceRate);
									}
									if(dj.byId('fx_tolerance_rate_cur_code') && masterCurrency && masterCurrency !== '')
									{
										dj.byId('fx_tolerance_rate_cur_code').set('value', masterCurrency);
									}
									if(dj.byId('fx_tolerance_rate_amt') && toleranceEquiAmount && toleranceEquiAmount !== '')
									{
										dj.byId('fx_tolerance_rate_amt').set('value', toleranceEquiAmount);
										m.setCurrency(dj.byId('fx_tolerance_rate_cur_code'), ['fx_tolerance_rate_amt']);
									}
									if(dj.byId("fx_tolerance_rate") && dj.byId("fx_tolerance_rate_amt") && dj.byId("fx_tolerance_rate_value") && dj.byId("fx_tolerance_rate_amt_value") && dj.byId("fx_tolerance_rate_value").get("value") !== '' && dj.byId("fx_tolerance_rate_amt_value").get("value") !== '')
									{
										var fx_tolerance_rate = dj.byId("fx_tolerance_rate_value").get("value");
										var fx_tolerance_rate_amt = dj.byId("fx_tolerance_rate_amt_value").get("value");
										dj.byId("fx_tolerance_rate").set("value",fx_tolerance_rate);
										dj.byId("fx_tolerance_rate_amt").set("value",fx_tolerance_rate_amt);
									} 
								}
							}
							else
							{
								
								subTnxTypeCode = dj.byId("sub_tnx_type_code");
								tnxTypeCode = dj.byId("tnx_type_code");
								if ((tnxTypeCode && tnxTypeCode.get("value") === '85') || (subTnxTypeCode && subTnxTypeCode.get("value") === 'A4'))
								{
									if ( masterCurrency !== toCurrency  && exchangeRate === '' )
									{	
										misys.dialog.show("ERROR", misys.getLocalization("InvalidCurrencyForFXErrorMessage"));
									}
								}
								else
								{
									m.defaultBindTheFXTypes();
								}
							}
						},
						customError : function(response, args){
							console.error('Technical error while getting fx details ');
							console.error(response);								
						}
					});
					// Hide the progress bar
					setTimeout(function() {
						var dialogIds = "fxalertDialog";
						var dialog = dj.byId(dialogIds);
						if (dialog && dialog.get("open")) {
							dialog.hide();
						}
					},500);	
				}
				else
				{
					enableBoardRate = 'N';
					if ((tnxTypeCode && tnxTypeCode.get("value") === '85') || (subTnxTypeCode && subTnxTypeCode.get("value") === 'A4'))
					{
						dj.byId('fx_exchange_rate').set('value', '');
						dj.byId('fx_exchange_rate_amt').set('value', '');
						
						if(dj.byId('fx_exchange_rate_cur_code').get('value') !== "")
						{ 
							misys.dialog.show("ERROR", misys.getLocalization("InvalidCurrencyForFXErrorMessage"));
						}
					}
				}
				
				if ((tnxTypeCode && tnxTypeCode.get("value") === '85') || (subTnxTypeCode && subTnxTypeCode.get("value") === 'A4'))
				{
					if(toCurrency === "" || (fxParametersObject.fxParametersData.contractCurrencies && fxParametersObject.fxParametersData.contractCurrencies[toCurrency]))
					{
						enableContractRate = 'Y';
					}
					else
					{
						enableContractRate = 'N';
					}
				}
				else
				{
					//Validating whether contract option is enabled and amount is within min,max range
					if(fxParametersObject.fxParametersData.contractCurrencies && fxParametersObject.fxParametersData.contractCurrencies[toCurrency])
					{
						contractRateMinAmt = fxParametersObject.fxParametersData.contractCurrencies[toCurrency].minAmt; 
						contractRateMaxAmt = fxParametersObject.fxParametersData.contractCurrencies[toCurrency].maxAmt; 
							if (amount >= contractRateMinAmt && amount <= contractRateMaxAmt)
							{
								enableContractRate = 'Y';
						}
						else
						{
								contractRateTooltip = misys.getLocalization('FXAmountNotInSpecifiedRange', [contractRateMinAmt,contractRateMaxAmt,toCurrency]);
								enableContractRate = 'N';
							}
					 }
					 else
					 {
						 contractRateTooltip = misys.getLocalization('FXOptionNotAvailable');						
						 enableContractRate = 'N';
					 }
				}
		     }
			
		
			//if both board rate and utilize contrats are enabled then enable board rate fields by default and hide contract fields
			 if(enableBoardRate === 'Y' && enableContractRate === 'Y')
			 {
				if(dj.byId('fx_rates_type_1'))
				{
					dj.byId('fx_rates_type_1').set('readOnly',false);
				}
				if(dj.byId('fx_rates_type_2'))
				{
					dj.byId('fx_rates_type_2').set('readOnly',false);
				}
				_readOnlyBoardRateFields(false);
				_readOnlyContractRateFields(maxNbrContracts, amtUtiliseInd, false);
				
				if ((!tnxTypeCode || tnxTypeCode.get("value") !== '85') && (!subTnxTypeCode || subTnxTypeCode.get("value") !== 'A4'))
				{
					dj.byId('fx_rates_type_1').set('checked',true);
				}
			 }
			 else if(enableBoardRate === 'Y' && enableContractRate === 'N')
			 {
				if(dj.byId('fx_rates_type_2'))
				{
					dj.byId('fx_rates_type_2').set('checked',false);
				}
				if ((!tnxTypeCode || tnxTypeCode.get("value") !== '85') && (!subTnxTypeCode || subTnxTypeCode.get("value") !== 'A4'))
				{
					dj.byId('fx_rates_type_2').set('readOnly',true);
				}
				dj.byId('fx_rates_type_1').set('checked',true);
				var domNode1 = dj.byId("fx_rates_type_2").domNode;
				var handle1 = m.connect('fx_rates_type_2', 'onFocus', function(){
					if (((!tnxTypeCode || tnxTypeCode.get("value") !== '85') && (!subTnxTypeCode || subTnxTypeCode.get("value") !== 'A4')) && (enableContractRate === 'N'&& dj.byId("fx_rates_type_2").get("readOnly")))
					{
						dijit.showTooltip(contractRateTooltip, domNode1, 0);
					}
				});
				m.connect('ft_cur_code', 'onChange', function(){
					m.disconnect(handle1);
				});
				m.connect('fx_rates_type_2', 'onBlur', function(){				
					dijit.hideTooltip(dijit.byId("fx_rates_type_2").domNode);					
				});
			 }
			 //if board rate is not allowed and utilize contrats are allowed then enable contract rate fields by default and hide board rate fields
			 else if(enableBoardRate === 'N' && enableContractRate === 'Y')
			 {
				 transactionAmount = amount;
				if(dj.byId('fx_rates_type_1'))
				{
					dj.byId('fx_rates_type_1').set('checked',false);
					if ((!tnxTypeCode || tnxTypeCode.get("value") !== '85') && (!subTnxTypeCode || subTnxTypeCode.get("value") !== 'A4'))
					{
						dj.byId('fx_rates_type_1').set('readOnly',true);
					}
				}
				if(dj.byId('fx_rates_type_2'))
				{
					dj.byId('fx_rates_type_2').set('checked',true);
				}
				_readOnlyContractRateFields(maxNbrContracts, amtUtiliseInd, false);
				var domNode2 = dj.byId("fx_rates_type_1").domNode;
				var handle2 = m.connect('fx_rates_type_1', 'onFocus', function(){
					if (((!tnxTypeCode || tnxTypeCode.get("value") !== '85') && (!subTnxTypeCode || subTnxTypeCode.get("value") !== 'A4')) && (enableBoardRate === 'N'&& dj.byId("fx_rates_type_1").get("readOnly")))
					{
						dijit.showTooltip(boardRateTooltip, domNode2, 0);
					}
				});
				m.connect('ft_cur_code', 'onChange', function(){
					m.disconnect(handle2);
				});
				m.connect('fx_rates_type_1', 'onBlur', function(){
					dijit.hideTooltip(dijit.byId("fx_rates_type_1").domNode);					
				});
			 }
			 else
			 {
				m.defaultBindTheFXTypes();
			}
			 if((enableContractRate === 'Y') && (dj.byId('fx_nbr_contracts') && maxNbrContracts >= '1'))
			 {
					dj.byId('fx_nbr_contracts').set('value', maxNbrContracts);
			 }
			 if(toleranceDispInd === 'Y')
			 {
				 //bind the tolerance rate field to recalculate the equivalent amount on change of tolerance
					m.connect('fx_tolerance_rate', 'onBlur', function(){
						_recalculateEquivalentToleranceAmt(isDirectConversion);
					});
			}	
			 //On changing the radio button options verifies whether Board rate radio button is selected, if so show a progess bar fetching board rates 
			 //information and trigger the fx engine to fetch the board rate details
				m.connect('fx_rates_type_1', 'onChange', function()
				{					
					if(enableBoardRate === 'Y' && dj.byId('fx_rates_type_1') && dj.byId('fx_rates_type_1').get('checked'))
					{
							_fxshow("FXPROGRESS", m.getLocalization("fetchingExchangeRates"));
							m.animate('fadeOut', _fxContractsDiv);
							m.animate('fadeOut', d.byId('contractMsgDiv'));
							m.animate('fadeOut', d.byId('totalUtiliseDiv'));
							m.animate('fadeIn', _boardRatesDiv);					
							if(enableContractRate === 'Y'){
								_clearContractRateFields(maxNbrContracts, amtUtiliseInd);
							}
							// make contract number non mandatory
							_setContractMandatory(false);
							// Hide the progress bar
							setTimeout(function() {
								var dialogIds = "fxalertDialog";
								var dialog = dj.byId(dialogIds);
								if (dialog && dialog.get("open")) {
									dialog.hide();
								}
							},500);
					}
				});
				
				m.connect('fx_rates_type_2', 'onChange', function()
				{					
					//If contract options radion button is selected, then clear the board rate fields and hide. Dispaly the contract fields and bind them with 
					//necessary functions to perform the required actions
					if(enableContractRate && dj.byId('fx_rates_type_2') && dj.byId('fx_rates_type_2').get('checked'))
					{
						m.animate('fadeOut', _boardRatesDiv);
						m.animate('fadeIn', _fxContractsDiv);
						m.animate('fadeIn', d.byId('contractMsgDiv'));
						m.animate('fadeIn', d.byId('totalUtiliseDiv'));
						
						if(maxNbrContracts !== '1')
						{
							m.registerAndcalculateTotalUtiliseAmt(maxNbrContracts);
						}
						
						_clearBoardRateFields();
							
						m.setMasterCurrency(maxNbrContracts, toCurrency);
						if(dj.byId('fx_nbr_contracts') && maxNbrContracts >= '1')
						{
							dj.byId('fx_nbr_contracts').set('value', maxNbrContracts);
						}
						
						// make contract number mandatory
						
						if ((tnxTypeCode && tnxTypeCode.get("value") === '85') || (subTnxTypeCode && subTnxTypeCode.get("value") === 'A4'))
						{
							_setContractMandatory(false);
						}
						else
						{
							_setContractMandatory(true);	
						}
					}					
				});
	    }
	
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.common.create_fx_client');