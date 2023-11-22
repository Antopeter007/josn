dojo.provide("misys.binding.loan.repricing_ln");

dojo.require("dojo.parser");
dojo.require("dijit.layout.TabContainer");
dojo.require("dijit.form.DateTextBox");
dojo.require("misys.form.CurrencyTextBox");
dojo.require("dijit.form.NumberTextBox");
dojo.require("dijit.form.FilteringSelect");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.TextBox");
dojo.require("misys.widget.Dialog");
dojo.require("dijit.ProgressBar");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.CheckBox");
dojo.require("dojo.data.ItemFileReadStore");
dojo.require("misys.form.file");
dojo.require("misys.form.SimpleTextarea");
dojo.require("misys.form.common");
dojo.require("misys.validation.common");
dojo.require("misys.widget.Collaboration");
dojo.require("misys.binding.SessionTimer");
dojo.require("dojox.xml.DomParser");
dojo.require("misys.common");

/**
 * Create Loan Screen JS Binding 
 * 
 * @class  reprice_ln
 * @param d
 * @param dj
 * @param m
 */
(function(/* Dojo */d, /* Dijit */dj, /* Misys */m)
	{

	"use strict"; // ECMA5 Strict Mode
	
	
	function _openRepricingPopup(refId){
		
		
		var screenParam = "ReportingPopup",
        url = [];
		url.push("/screen/", screenParam);
		url.push("?option=", "ADD_NEW_REPRICING_LN");
		
		//To access parent variables in child window
		window.newLoanGrid=dj.byId('gridNewLoanRepricingTransactions');		
		window.oldLoanGrid=dj.byId('gridRepricingLoanTransactions');
		window.facilitiesStore=misys._config.facilitiesStore;
		window.riskTypesStores=misys._config.riskTypesStores;
		window.pricingOptionsStores=misys._config.pricingOptionsStores;
		window.repricingFrequenciesStores=misys._config.repricingFrequenciesStores;
		window.facilityAvailableAmountStore=misys._config.facilityAvailableAmountStore;
		window.riskTypeLimitStore=misys._config.riskTypeLimitStore;
		window.borrowerTypeLimitStore=misys._config.borrowerTypeLimitStore;
		window.currencyTypeLimitStore=misys._config.currencyTypeLimitStore;
		window.newLoanAmtField=dj.byId('total_ln_amt');
		window.borrowerSettlement=dj.byId("borrower_settlement");
		window.interestDetailsGrids=dj.byId('gridLayoutInterestDetailsLoanTransactions');
		window.loanIncreaseAmount=dj.byId('loan_increase_ln_amt');	
		window.loanIncreaseSection=dj.byId('loan_increase_Section');
		window.loanRemittanceSection=dj.byId('remittance_inst_section');
		window.loanRemittanceGrid=dj.byId('gridRemittanceInstruction');
		window.totalRepricingAmountId=dj.byId('total_repricing_ln_amt');
		window.totalNewRepricingAmountId=dj.byId('total_ln_amt');
		window.bo_deal_name=dj.byId('deal_name').get('value');
		window.bo_deal_id=dj.byId('bo_deal_id').get('value');
		window.loan_currency=dj.byId('loan_ccy').get('value');
		window.fxConversionRate=dj.byId('fxConversionRate').get('value');
		window.fac_cur_code=dj.byId('fac_cur_code').get('value');
		window.cust_ref_id=dj.byId('loan_cust_ref_id').get('value');
		
		window.loan_borrower_reference=dj.byId('borrower_reference').get('value');
		window.totalRepricingLoanAmt=dj.byId('total_repricing_ln_amt').get('value');
		window.loanIncreaseFlag=dj.byId('loan_increase_flag').get('value');
		window.limitValidationFlag=dj.byId('limit_validation_flag').get('value');
		window.totalNewRepricingLoanAmt=dj.byId('total_ln_amt').get('value');
		window.entity=dj.byId('entity').get('value');
		window.totalPrincipalAmount=dj.byId('total_principal_amt');
		window.adjustAmuntOptions=dj.byId("adjust_amount_option");
		window.earliestRepricingDate=dj.byId("recent_repricing_date").get('value');
		
		
		
//		if(refId){
			window.refId=refId;
//		}else{
//			window.refId=null;
//		}
		var windowName =misys.getLocalization("transactionPopupWindowTitle");
		var popupWindow = d.global.open(m.getServletURL(url.join("")), windowName, "width=800,height=500,resizable=yes,scrollbars=yes"); 
		popupWindow.onbeforeunload =function(){
		       // set warning message
			
			checkPrincipalPaymentAmount();
		 };
				
		popupWindow.focus();

		
	}
	
	/**
	 * creates a custom dialog box with warning message
	 * @method customDialog
	 */
	function customDialog(){
		
		d.require('misys.widget.Dialog');
		d.require('dijit.form.Button');
		var dialog = new dj.Dialog({id: '',
		    title: m.getLocalization("warningMessage")});
		//Create dialog content
		var dialogContent = d.create("div", { id: ""});
		var dialogText = d.create("div", {id:""},dialogContent,'first');
		var title = m.getLocalization("principalPayementWarning");
		dialogText.innerHTML=title;
		var dialogButtons =   d.create("div",{id:"",style:"text-align:right;"},dialogContent,'last');
		//Buttons
		var yesButtton  = new dj.form.Button({label:m.getLocalization("okMessage"),id:""});
	
		d.place(yesButtton.domNode,dialogButtons);
		
		dialog.attr("content", dialogContent);
		
		//Dialog Connects
		m.dialog.connect(yesButtton, 'onClick', function(){
			dialog.hide();
			
		}, dialog.id);
		
		
		//On Hide of Dialog
		m.dialog.connect(dialog, 'onHide', function() {
			m.dialog.disconnect(dialog);
		});
		//Show the Dialog
		dialog.show();
	}
	
	/**
	 * Setup the Remittance Instructions for Loan
	 * 
	 * @method _setupRemittanceInstructions
	 */
	function _setupRemittanceInstructions(/*boolean*/disabledSelection){
		var data = {
        		identifier : 'description',
    			label : 'description',
    			items : misys._config.remittanceInstructions
		};
		var remittanceInstStore = new dojo.data.ItemFileReadStore({data : data});
		
		var remInst = dijit.byId('gridRemittanceInstruction');
		if(remInst)
		{
			remInst.set('store', remittanceInstStore);
			remInst.startup();
			remInst.render();
			var remittanceInstDescriptionHiddenValue = dj.byId('rem_inst_description_view'),
			remittanceInstLocationCodeHiddenValue = dj.byId('rem_inst_location_code_view'),
			remittanceInstServicingGrpHiddenValue = dj.byId('rem_inst_servicing_group_alias_view');
			remInst.store.fetch({
				query: {preferred: '*'}, 
				onComplete: dojo.hitch(this, function(items, request){
					dojo.forEach(items, function(item, index){
						if(item.preferred[0] === 'Y' && remittanceInstDescriptionHiddenValue.get('value') === '')
						{
							remInst.selection.select(index);
						}
						else if(remittanceInstDescriptionHiddenValue.get('value') === item.description[0] && remittanceInstLocationCodeHiddenValue.get('value') === item.locationCode[0] && remittanceInstServicingGrpHiddenValue.get('value') === item.servicingGroupAlias[0])
						{
							remInst.selection.select(index);
						}
						else
						{
							remInst.selection.deselect(index);
						}
						if(disabledSelection)
						{
							remInst.rowSelectCell.setDisabled(index, true);
						}else{
							remInst.rowSelectCell.setDisabled(index, false);
						}
					}, this);
				})
			});
		}
	}

	/**
	 * checks if principal payement amount field is zero
	 * @method checkPrincipalPaymentAmount
	 */

	function checkPrincipalPaymentAmount(){		
		if(dj.byId("adjust_amount_option").checked === true){
			var principalAmountCheck=dj.byId("total_principal_amt").get("value");
			if(principalAmountCheck===0 || principalAmountCheck<0){
			//m.dialog.show('ALERT',misys.getLocalization('principalPayementWarning'));
				customDialog();
				dj.byId("adjust_amount_option").set("checked",false);
				dj.byId("adjust_amount_option").set("disabled",true);
			}else{
				dj.byId("adjust_amount_option").set("disabled",false);
			}
		}else{
			dj.byId("total_principal_amt").set("value",0);
		}
	}
	
	/**
	 * check if the total new repricing amount is equal or exceed the total repricing amount
	 *  @method isTotalNewRepricingAmountExceeded	 */
	function isTotalNewRepricingAmountExceeded(){
				
		var totalRepricingAmt =dj.byId('total_repricing_ln_amt').get('value');
		var totalNewRepricngAmt =dj.byId('total_ln_amt').get('value');
	    // checks the loan increase is enable or not,if enabled then allow the user to exceed and open the popup. 
		
		var loanIncreaseFlag=dj.byId('loan_increase_flag').get('value');
		
		if(loanIncreaseFlag==="false"){
			if(parseFloat(totalNewRepricngAmt)<parseFloat(totalRepricingAmt)){			
				return true;
			}else{
				m.dialog.show('ERROR',misys.getLocalization('loanRepricingAmountError'));
			}
			return false;
		}
		else{
			return true;
		}
	}
	
	/**
	 * This method based on conf. enable/disable the loan interest payement grid
	 * @method _interestPaymentLoanGridSelection
	 */
	
	function _interestPaymentLoanGridSelection()
	{		
	  var interestPaymentSelectionFlag= dj.byId("interest_Payment_loan_flag");
	  var interestPaymentGrid = dijit.byId('gridLayoutInterestDetailsLoanTransactions');
	  var interestPaymentCheckbox= dojo.byId("loan-repricing-interest-details-checkbox");
		
		if(interestPaymentSelectionFlag.get("value")=== "true")
		{
			dojo.style(interestPaymentCheckbox,"display","none");
			//enable grid checkbox for selection for loans which are having POC greater than Zero.			
			if(interestPaymentGrid && interestPaymentGrid.store)
			{
				interestPaymentGrid.store.fetch({
					query: {loan_alias: '*'},
					onComplete: dojo.hitch(this, function(items, request){ 
						d.forEach(items,function(item,index){
							
							if(item.totalProjectedEOCamt[0]>0)
							{
								interestPaymentGrid.selection.select(index);
								interestPaymentGrid.rowSelectCell.setDisabled(index, false);

							}
							else
							{								
								interestPaymentGrid.rowSelectCell.setDisabled(index, true);

							}					 
							
						}, this);
					})
				});			
		   }
		}
	}
		
	
	/**
	 * Validate the emtpty New loans
	 */
	function validateEmptyLoans(){

		var newRepricingLoanGrid = dijit.byId('gridNewLoanRepricingTransactions');
		if(newRepricingLoanGrid && newRepricingLoanGrid.store)
		{
			var storeSize = 0;
			var getSize = function(size, request)
			{
				storeSize = size;
			};
			newRepricingLoanGrid.get('store').fetch({query: {}, onBegin: getSize, start: 0, count: 0});
			if(storeSize > 0){
				return true;
			}else{
				m._config.onSubmitErrorMsg =  misys.getLocalization('emptyLoanRepricingError');				
				return false;
			}			
		}
		
	}
	
	/**
	 * vallidates the repricing fields before save and submit
	 *  @method validateRepricingFields
	 */
	function validateLNRepricingFields(){
				
		var totalRepricingAmt =dj.byId('total_repricing_ln_amt');
		var totalNewRepricngAmt =dj.byId('total_ln_amt');	
		if(dj.byId('loan_increase_ln_amt'))
		{
			var loanIncreaseAmount=	dj.byId('loan_increase_ln_amt').get('value');
	    //if loan increase is there then no need to check for principal payment
		     if(!loanIncreaseAmount>0)
		     {
					if(totalRepricingAmt && totalNewRepricngAmt &&(parseFloat(totalNewRepricngAmt.get('value')) !== parseFloat(totalRepricingAmt.get('value')))){	
						var totalAmt=0;
						var totalNewRepricingAmtVal=totalNewRepricngAmt.get('value');
						var totalRepricingAmtVal=totalRepricingAmt.get('value');
						var pricipalAdjustAmount=dj.byId('total_principal_amt').get('value');
						totalAmt=parseFloat(pricipalAdjustAmount.toFixed(2))+parseFloat(totalNewRepricingAmtVal.toFixed(2));
						if(parseFloat(totalRepricingAmtVal) === parseFloat(totalAmt.toFixed(2))){
							return true;
						}else{
							m._config.onSubmitErrorMsg =  misys.getLocalization('loanRepricingPrinipalPaymentError');		
						}
					}else{
						return true;
					}	
					return false;
		     }
	     
	     else
	     {
	    	 
	    	 return true;
	     }
	 		
		}else{
			return true;
		}
	}
	
	
	
	/**
	 * Calculate the Total Outstanding amount
	 * 
	 * @method _addRepricingLoansOutstandingAmt
	 */
	function _addRepricingLoansOutstandingAmt(){
		
		var repricingLoanGrid = dijit.byId('gridRepricingLoanTransactions');
		var totalOutstandingAmt = 0;
		
		if(repricingLoanGrid && repricingLoanGrid.store)
		{
			repricingLoanGrid.store.fetch({
				query: {loan_ref_id: '*'},
				onComplete: dojo.hitch(this, function(items, request){ 
					dojo.forEach(items,function(item){
						totalOutstandingAmt = parseFloat(totalOutstandingAmt) + parseFloat(item.loan_current_amt[0].split(',').join(''));
					}, this);
				})
			});

		}

		dj.byId('total_repricing_ln_amt').set('value', totalOutstandingAmt);
	}
	
	/*
	 * check the loan interest due amount ,based on that it disable the checkbox
	 * @mehtod _checkLoanInterestDetailsAmount
	 * 
	 */
	
    function _checkLoanInterestDetailsAmount(){
		
    	var interestDetailsGrid = dijit.byId('gridLayoutInterestDetailsLoanTransactions');
		var totalProjectedEOCamt = 0;
		
		if(interestDetailsGrid && interestDetailsGrid.store)
		{
			interestDetailsGrid.store.fetch({
				query: {loan_alias: '*'},
				onComplete: dojo.hitch(this, function(items, request){ 
					dojo.forEach(items,function(item){
						totalProjectedEOCamt = parseFloat(totalProjectedEOCamt) + parseFloat(item.totalProjectedEOCamt_fmt[0].split(',').join(''));
					}, this);
				})
			});

		}
      //checks the total interest due amount is zero,in that case disable the field
		if(totalProjectedEOCamt===0)
		{
			var interestPayment=dj.byId("interest_payment");
			interestPayment.set("disabled",true);
			interestPayment.set("checked",false);
		}
	}
	
	/**
	 * Calculate the earliest repricing date for all old loands
	 * 
	 * @method _calculateEarliestRepricingDate
	 */
	function _calculateEarliestRepricingDate(){
		
		var repricingLoanGrid = dijit.byId('gridRepricingLoanTransactions');
		var dates = [];
		if(repricingLoanGrid && repricingLoanGrid.store)
		{
			repricingLoanGrid.store.fetch({
				query: {loan_ref_id: '*'},
				onComplete: dojo.hitch(this, function(items, request){ 
					dojo.forEach(items,function(item){	
						var date = d.date.locale.parse(item.loan_repricing_date[0], {
							selector : "date",
							datePattern : m.getLocalization("g_strGlobalDateFormat")
						});
						dates.push(date);						
					}, this);
				})
			});
		}
		var minDate=new Date(Math.min.apply(null,dates));
		var recentDateString = dojo.date.locale.format(minDate, {datePattern: m.getLocalization('g_strGlobalDateFormat'), selector: "date"});
		dj.byId('recent_repricing_date').set('value', recentDateString);
	}
	
	
	
	/**
	 * Calculate the Total new Repricing Outstanding amount
	 * 
	 * @method _addNewRepricingLoansOutstandingAmt
	 */
	function _addNewRepricingLoansOutstandingAmt(){
		
		var newRepricingLoanGrid = dijit.byId('gridNewLoanRepricingTransactions');
		var totalOutstandingAmt = 0;
		
		if(newRepricingLoanGrid && newRepricingLoanGrid.store)
		{
			newRepricingLoanGrid.store.fetch({
				query: {new_loan_ref_id: '*'},
				onComplete: dojo.hitch(this, function(items, request){ 
					dojo.forEach(items,function(item){
						var newLoanAmt=''+item.new_loan_outstanding_amt[0];
						totalOutstandingAmt = parseFloat(totalOutstandingAmt) + parseFloat(newLoanAmt.split(',').join(''));
					}, this);
				})
			});

		}
		dj.byId('total_ln_amt').set('value', totalOutstandingAmt);	
	}
	
	/**
	 * Calculate the Total principal payment  amount
	 * 
	 * @method _calculatePrincipalPaymentAmount
	 */
	function _calculatePrincipalPaymentAmount(){
		
		 var pricipalAmountField=dj.byId('total_principal_amt');
		 var totalRepricingLoanAmt=dj.byId('total_repricing_ln_amt').get("value");
		 var totalNewRepricingLoanAmt=dj.byId('total_ln_amt').get("value");
 		 var	principalPaymentAmount = parseFloat(totalRepricingLoanAmt)-parseFloat(totalNewRepricingLoanAmt);
 		 var prinicapalPaymentAmt=pricipalAmountField.get('value'); 		 
   		
   		if(prinicapalPaymentAmt>0 && principalPaymentAmount===0){
   			//m.dialog.show('ERROR',misys.getLocalization('principalPayementWarning'));
   			customDialog();
   		}

		if(dj.byId("adjust_amount_option").checked === false){
			 pricipalAmountField.set('value', 0);
		}else{
			 pricipalAmountField.set('value', principalPaymentAmount);
		}

    	 if(principalPaymentAmount===0){	
				
				dj.byId("adjust_amount_option").set("disabled",true);
			}else{
				dj.byId("adjust_amount_option").set("disabled",false);
			}
	}
	
	/*This method adds the deleted loan amount to the respective limit store
	 *
	 *  @method _updateLimitsOnDeletionOfLoan
	 */
	function _updateLimitsOnDeletionOfLoan(facilityId,loanAmount){
		var facilitySelected=''+facilityId;
		var newAmount=''+loanAmount;
		//risk type limit store update 
		var store = misys._config.riskTypeLimitStore;
		store.fetch({
			query: {id: facilitySelected},
			onComplete: dojo.hitch(this, function(items, request){
				var item = items[0];	
				if(item)
				{
					// add the amount in to the dummy amount store
					var currentStoreAmount=''+item.dummyRiskTypeLimitAmount[0];
					item.dummyRiskTypeLimitAmount[0]=parseFloat(currentStoreAmount.split(',').join(''))+parseFloat(newAmount.split(',').join(''));
				}
			})
		});	
		//borrower type limit store update
		var borrowerStore = misys._config.borrowerTypeLimitStore;
		borrowerStore.fetch({
			query: {id: facilitySelected},
			onComplete: dojo.hitch(this, function(items, request){
				var item = items[0];
				if(item)
				{
					// add the amount in to the dummy amount store
	     			var currentStoreAmount=''+item.dummyBorrowerTypeLimitAmount[0];
		    		item.dummyBorrowerTypeLimitAmount[0]=parseFloat(currentStoreAmount.split(',').join(''))+parseFloat(newAmount.split(',').join(''));
				}
			})
		});	
		//currency type limit store update
		var currencyStore = misys._config.currencyTypeLimitStore;
		currencyStore.fetch({
			query: {id: facilitySelected},
			onComplete: dojo.hitch(this, function(items, request){
				var item = items[0];	
				if(item)
				{
					// add the amount in to the dummy amount store
					var currentStoreAmount=''+item.dummyCurrencyLimitAmount[0];
					item.dummyCurrencyLimitAmount[0]=parseFloat(currentStoreAmount.split(',').join(''))+parseFloat(newAmount.split(',').join(''));
				}
			})
		});	
	}
	
	
	/*This method adds the deleted loan amount to the respective facility store
	 *
	 *  @method _updateFacilityAmountOnDeletionOfLoan
	 */
	
	function _updateFacilityAmountOnDeletionOfLoan(facilityId,loanAmount){
		
		var facilitySelected=''+facilityId;
		var newAmount=''+loanAmount;
		//facility store update 
		var store = misys._config.facilityAvailableAmountStore;
		store.fetch({
			query: {id: facilitySelected},
			onComplete: dojo.hitch(this, function(items, request){
				var item = items[0];
				if(item)
				{
					// add the amount in to the dummy amount store
					var facilityStoreAmount=''+item.dummyBorrowerAvailableLimitAmount[0];
					item.dummyBorrowerAvailableLimitAmount[0]=parseFloat(facilityStoreAmount.split(',').join(''))+parseFloat(newAmount.split(',').join(''));
				}
			})
		});		
	}
	


	
	
	/*This method checks the loan increase and display the loan increase section based on increase ,
	 * disable the principal payment option
	 *  @method _checkForLoanIncrease
	 */
	function _checkForLoanIncrease(){
		//alert("hello");
		 var totalRepricingLoanAmt=dj.byId('total_repricing_ln_amt').get("value");
		 var totalNewRepricingLoanAmt=dj.byId('total_ln_amt').get("value");
		
		 var loanIncreaseDiv=dojo.byId('loan_increase_Section');
		 var remittanceDiv = dojo.byId('remittance_inst_section');
		//check the loan increase,if increase is there show the increase section,disable the principal amount field and calculate the loan increase
		 if(totalNewRepricingLoanAmt>totalRepricingLoanAmt){	
			 calculateLoanIncrease();
			 dojo.style(loanIncreaseDiv, "display", "block");
			 if(remittanceDiv){
				 dojo.style(remittanceDiv, "display", "block");	 
			 }
			 
			 dj.byId("adjust_amount_option").set("disabled",true);
			
		}else{
			 dojo.style(loanIncreaseDiv, "display", "none");
			 if(remittanceDiv){
				 dojo.style(remittanceDiv, "display", "none");	 
			 }
			 
	       }
	}
	
	/**
	 * This method sets the default value of net cashflow on load
	 */
	function _checkBorrowerSettlementOnLoad(){
		
		var borrowerSettlement=dj.byId("borrower_settlement");
		var totalLoanAmount=dj.byId("total_ln_amt");
		var totalPrincipalAmount=dj.byId("total_principal_amt");
		var increaseAmountWidget = dj.byId("loan_increase_ln_amt");
		
		if(borrowerSettlement && !(totalLoanAmount.get("value")>0 || totalPrincipalAmount.get("value")>0)){	
			borrowerSettlement.set("checked",true);			
		}
		
		if(dijit.byId('net_cashFlow').value == 'true' && increaseAmountWidget)
		{
			var totalInterestAmount = getTotalInterestAmount();
			var increaseAmount = increaseAmountWidget.get('value');
			if(increaseAmount > 0 && increaseAmount <= totalInterestAmount){
				borrowerSettlement.set("checked" ,false);
				borrowerSettlement.set("disabled" ,true);
			}
		}
	}
	
	function getTotalInterestAmount(){
		var interestDetailsGrid = dijit.byId('gridLayoutInterestDetailsLoanTransactions');
		var totalInterestAmount = 0;
		
		if(interestDetailsGrid && interestDetailsGrid.store)
		{
			interestDetailsGrid.store.fetch({
				query: {loan_alias: '*'},
				onComplete: dojo.hitch(this, function(items, request){ 
					dojo.forEach(items,function(item){
						totalInterestAmount = parseFloat(totalInterestAmount) + parseFloat(item.totalProjectedEOCamt_fmt[0].split(',').join(''));
					}, this);
				})
			});
		}
		return totalInterestAmount;
	}
	
	  /** 
     * This method update the limit store in a draft mode and checks the limits in draft mode
    * @method updateLimitStoreForRepricingForDraftMode
    * 
     */
    function updateLimitStoreForRepricingForDraftMode(){
         
//               var facilitySelected = dj.byId('bo_facility_id').get('value');
               
               var riskTypeStore= misys._config.riskTypeLimitStore;
               var curTypeStore= misys._config.currencyTypeLimitStore;         
               var borrowerTypeStore= misys._config.borrowerTypeLimitStore;
               var limitsMap = [];   
               
               //check the new loan amount grid and facility,update the limit store accordingly
               var newRepricingLoanGrid =dj.byId('gridNewLoanRepricingTransactions');
               var totalOutstandingAmt = 0;
               
               if(newRepricingLoanGrid && newRepricingLoanGrid.store)
               {
                     newRepricingLoanGrid.store.fetch({
                          query: {new_loan_ref_id: '*'},
                          onComplete: dojo.hitch(this, function(items, request){ 
                               dojo.forEach(items, function(item){
                                     var newLoanFacilityId=''+item.new_loan_facility_id[0];
                                     var newLoanAmt=''+item.new_loan_outstanding_amt[0];
                                     //create a map and store the new loan facility id and amount
                                      limitsMap.push({facilityId:newLoanFacilityId,loanAmount:newLoanAmt});

                               }, this);
                          })
                    });
               }
               //now calculate each limit and update the limit the limit store; 
               
          for (var i = 0; i < limitsMap.length; i++) {
               
                //get the facility id from map and respective amount ,subtract the new loan amount from 
                //the limit amount
               //invoke the methods in the order of limit values in ascending order
                  var mapFacilityId=limitsMap[i].facilityId;
                  var mapLoanAmt=limitsMap[i].loanAmount;
                  
               var borowerTypeLimit;
               borrowerTypeStore.fetch({
                    query: {id: mapFacilityId},
                    onComplete: d.hitch(this, function(items, request){
                          var item = items[0];
                          if(item)
                          {
                               var limitAmt=''+item.dummyBorrowerTypeLimitAmount[0];
                               
                               if(limitAmt!=''){
                                   borowerTypeLimit = parseFloat(limitAmt.split(',').join(''));
                                   borowerTypeLimit=borowerTypeLimit-parseFloat(mapLoanAmt.split(',').join(''));
                                   item.dummyBorrowerTypeLimitAmount[0]=parseFloat(borowerTypeLimit);
                               }

                          }
                    })
               });  
               
               var riskTypeLimit;
               riskTypeStore.fetch({
                    query: {id: mapFacilityId},
                    onComplete: d.hitch(this, function(items, request){
                          var item = items[0];
                          if(item)
                          {
                               var limitAmt=''+item.dummyRiskTypeLimitAmount[0];
                               if(limitAmt!=''){
                                   riskTypeLimit = parseFloat(limitAmt.split(',').join(''));
                                   riskTypeLimit=riskTypeLimit-parseFloat(mapLoanAmt.split(',').join(''));
                                   item.dummyRiskTypeLimitAmount[0]=parseFloat(riskTypeLimit);
                               }

                          }
                    })
               });  
               
               var curTypeLimit;
               curTypeStore.fetch({
                    query: {id: mapFacilityId},
                    onComplete: d.hitch(this, function(items, request){
                          var item = items[0];
                          if(item)
                          {
                               var limitAmt=''+item.dummyCurrencyLimitAmount[0];
                               if(limitAmt!=''){
                                   curTypeLimit = parseFloat(limitAmt.split(',').join(''));
                                    curTypeLimit=curTypeLimit-parseFloat(mapLoanAmt.split(',').join(''));
                                    item.dummyCurrencyLimitAmount[0]=parseFloat(curTypeLimit);
                                }

                          }
                    })
               });  
         }                    
    }
		
		/*
		 * This method calculate the loan increase amount
		 * @method calculateLoanIncrease
		 */
		
		 function calculateLoanIncrease(){
		
			 var totalRepricingLoanAmt=dj.byId('total_repricing_ln_amt').get("value");
			 var totalNewRepricingLoanAmt=dj.byId('total_ln_amt').get("value");
			
			 var loanIncreaseAmount = parseFloat(totalNewRepricingLoanAmt)-parseFloat(totalRepricingLoanAmt);
	  		 var loanIncreaseAmountField=dj.byId('loan_increase_ln_amt');
	  		 loanIncreaseAmountField.set('value', loanIncreaseAmount);
			
		 }
	
	
	/**
	 * this method show and hide the grid section of interest details based on selection of checkbox
	 * @method _hideAndShowInterestDetailsGrid
	 */	
		
		function _hideAndShowInterestDetailsGrid(){
			
			 var interestPaymentSelectionFlag= dj.byId("interest_Payment_loan_flag");
		      if(interestPaymentSelectionFlag.get("value")==="false"){

				var interestPayment=dj.byId("interest_payment");
				if(interestPayment.checked===true){				
				    dojo.style(dojo.byId('loanInterestDetailsGrid'), "display", "block");
				}else{
					
					dojo.style(dojo.byId('loanInterestDetailsGrid'), "display", "none");
					}
				dijit.byId('gridLayoutInterestDetailsLoanTransactions').resize();
		      }		
			
		}
		
function _checkFacilityMaturity(){
			
			var maturedFacility = misys._config.MaturedFacilityStore;
			var dealId = dijit.byId('bo_deal_id').get('value');
			var linkedLoanGrid = dijit.byId('gridRepricingLoanTransactions');
			var newlinkedLoansFacilityIds = [];
			var linkedLoansFacilityIds = [];
			var allLoansFacilityIds = [],
			isValid = true, 
			errorMsg;
			var finalMaturedFacilityList = [];
			if(linkedLoanGrid && linkedLoanGrid.store)
			{
				linkedLoanGrid.store.fetch({
					query: {loan_ref_id: '*'},
					onComplete: dojo.hitch(this, function(items, request){ 
						d.forEach(items,function(item){
							linkedLoansFacilityIds.push(item.loan_facility_id[0]);
						}, this);
					})
				});
			}
			 //first get the effective date of new loan.			 
			  var newRepricingLoanGrid =dj.byId('gridNewLoanRepricingTransactions');
			  var newLoaneffectiveDate;       
	      if(newRepricingLoanGrid && newRepricingLoanGrid.store)
	      {
	            newRepricingLoanGrid.store.fetch({
	                 query: {new_loan_ref_id: '*'},
	                 onComplete: dojo.hitch(this, function(items, request){ 
	                      dojo.forEach(items, function(item){
	                      	 newlinkedLoansFacilityIds.push(item.new_loan_facility_id[0]);
	                      }, this);
	                 })
	           });
	      }
	      allLoansFacilityIds.push(linkedLoansFacilityIds);
	      allLoansFacilityIds.push(newlinkedLoansFacilityIds);
	            
	    	  if(maturedFacility && maturedFacility._jsonData.items[dealId].length !== 0){
	    		 var maturedFacilityStoreItem = maturedFacility._jsonData.items;
	    		 var maturedFacilityStore =  maturedFacilityStoreItem[dealId];
	    		 
	    		  var i, j;
	    		  for(i=0; i<maturedFacilityStore.length; i++){
	        		  
	    			  var maturedFacilityID = maturedFacilityStore[i].facilityID;
	    			  var maturedFacilityName = maturedFacilityStore[i].facilityName;
	    			  
	    			  for(j=0;j<allLoansFacilityIds.length;j++){
	    				  
	    				  var loansFacilityID = allLoansFacilityIds[j];
	    				  if(maturedFacilityID == loansFacilityID){
	    					  isValid = false;
	    					  if(dojo.indexOf(finalMaturedFacilityList, maturedFacilityName) === -1){
	    						  finalMaturedFacilityList.push(maturedFacilityName);
	    					  }
	    				  }
	    			  }
	        	  }
	    	  }
	      
	    var onHideCallback = function(){
	    	var  targetUrl = m._config.homeUrl;
	    	var mode = dijit.byId("mode").get("value");
	    	var tnxtype = dijit.byId("tnxtype").get("value");
	    	var okButtonUrl = ["/screen/LoanScreen?tnxtype="+tnxtype+"&mode="+mode];
	    	targetUrl = misys.getServletURL(okButtonUrl.join(""));
	    	document.location.href = targetUrl;
	    };
	    	  
	      if(!isValid){
	    	  m.dialog.show('ERROR',misys.getLocalization('maturedFacilityError', [finalMaturedFacilityList.toString()]), null, onHideCallback);
	      }
			
		}
		
		
		/** 
		 * This method check and validate the different type of limits
		* @method _validateRepricingLoanLimitAmt
		* 
		 */
		function _validateRepricingLoanLimitAmt (){
			
			var isValid = true;
			var errorMsg;
			
			m.xhrPost({
				url : m.getServletURL("/screen/AjaxScreen/action/ValidateRepricingLoanLimitAmount"),
				handleAs : "json",
				preventCache : true,
				sync : true,
				content: { xml : misys.formToXML({ignoreDisabled: true})},
				load : function(response, args){
					isValid = response.isValid;
					errorMsg = response.errorMsg;
				},
				error : function(response, args){
					isValid = false;
					console.error("Process repricing error due to limit violation", response);
				}
			});
			
			if(!isValid)
			{
				m._config.onSubmitErrorMsg = errorMsg;
				return false;
			}
			else
			{
				return true;
			}
		}
		
		/**
		 * This method checks whether user selected the remittance or not in case of mandatory
		 * This method also allows to submit those transaction for which currency does not have any remittance instruction when remittance is mandatory
		 */
		function checkRemittanceIsSelected(){
				var data = {
		        		identifier : 'description',
		    			label : 'description',
		    			items : misys._config.remittanceInstructions
				};
				var currencyValue = dj.byId("bk_cur_code").get("value");	
				var dataLength = 0;
				if(data.items && data.items.length){

				  dataLength=data.items.length;

				}
				var isEmpty = true;
				var y;
				for(y=0 ; y<dataLength ; y++){
					
					if(currencyValue===data.items[y].currency[0]){
						isEmpty = false;
						break;
					}
				}
				if(dijit.byId('remittance_flag').get("value")==="mandatory" && !isEmpty){
					var remInst = dijit.byId('gridRemittanceInstruction');
					
					var selectedRemttiance=remInst.selection.getSelected();
					if(selectedRemttiance.length!==0){
						
						return true;
					}
					else{				
							if(dj.byId('screenMode').get('value') === 'UNSIGNED')
							{
								m._config.onSubmitErrorMsg =  misys.getLocalization('ErrorForMandatoryRemittanceForCheckerUser');
							}
						    else
							{
								m._config.onSubmitErrorMsg =  misys.getLocalization('ErrorForMandatoryRemittance');
							}
						return false; 
					}
				}
				return true;
			}
		
		/**
		 * Validates each transaction for it's eligibility to Reprice.
		 * 
		 * @method _validateRepricingRecords
		 */
		function _validateRepricingRecords () {
			
			var refId = dijit.byId('ref_id');
			var borrowerId = dijit.byId('borrower_reference').get("value");
			var linkedLoanGrid = dijit.byId('gridRepricingLoanTransactions');
			var newlinkedLoansRefIds = "";
			var linkedLoansRefIds = "",			
			isValid = true,
			isFacilityMatured = false,
			errorMsg;
			var dealId = dijit.byId('bo_deal_id').get('value');
			var maturedFacility = misys._config.MaturedFacilityStore;
			var facilityData = (maturedFacility && maturedFacility._jsonData.items[dealId].length !==0) ? JSON.stringify(maturedFacility._jsonData.items) : "";
			if(linkedLoanGrid && linkedLoanGrid.store)
			{
				linkedLoanGrid.store.fetch({
					query: {loan_ref_id: '*'},
					onComplete: dojo.hitch(this, function(items, request){ 
						d.forEach(items,function(item){
							linkedLoansRefIds = linkedLoansRefIds.concat(item.loan_ref_id[0]);
							linkedLoansRefIds = linkedLoansRefIds.concat(",");
						}, this);
					})
				});
			}
			 //first get the effective date of new loan.			 
			  var newRepricingLoanGrid =dj.byId('gridNewLoanRepricingTransactions');
			  var newLoaneffectiveDate;       
          if(newRepricingLoanGrid && newRepricingLoanGrid.store)
          {
                newRepricingLoanGrid.store.fetch({
                     query: {new_loan_ref_id: '*'},
                     onComplete: dojo.hitch(this, function(items, request){ 
                          dojo.forEach(items, function(item){
                          	     newLoaneffectiveDate=''+item.new_loan_effective_date[0]; 
                                 newlinkedLoansRefIds = newlinkedLoansRefIds.concat(item.new_loan_ref_id[0]);
                                 newlinkedLoansRefIds = newlinkedLoansRefIds.concat(",");
                          }, this);
                     })
               });
          }
			m.xhrPost({
				url : m.getServletURL("/screen/AjaxScreen/action/ValidateRepricingTransaction"),
				handleAs : "json",
				preventCache : true,
				sync : true,
				content: { ref_id : refId.get('value'),
							linkedLoans : linkedLoansRefIds,
							effectiveDate:newLoaneffectiveDate,
							borrowerId:borrowerId,
							newlinkedLoansRefIds:newlinkedLoansRefIds,
							facilitydata:facilityData,
							deal_id: dijit.byId("bo_deal_id").get("value")
							},
				load : function(response, args){
					isValid = response.isValid;
					errorMsg = response.errorMsg;
					isFacilityMatured = response.isFacilityMatured;
				},
				error : function(response, args){
					console.error(" processRepricingOfRecords error", response);
				}
			});
			
			if(isFacilityMatured){
				m._config.onSubmitErrorMsg =  errorMsg;
				return false;
			}
		
			if(!isValid)
			{
				m._config.onSubmitErrorMsg =  errorMsg;
				return false;
			}
			else
			{
				return true;
			}
		}
		
		d.mixin(m._config,
				{

			/**
			 * Initialize re-Authentication Parameters
			 * 
			 * @method initReAuthParams
			 */
			initReAuthParams : function()
			{
			
				var reAuthParams =
				{
						productCode : 'BK',
						subProductCode : 'LNRPN',
						transactionTypeCode : '01',
						entity : dj.byId("entity") ? dj.byId("entity").get("value") : '',
								currency : '',
								amount : '',

								es_field1 : '',
								es_field2 : ''
				};
				return reAuthParams;
			}
				});		
	
	d.mixin(m,
			{
		
		
			bind : function()
			{
				m.connect('adjust_amount_option','onClick', _calculatePrincipalPaymentAmount);
				m.connect('interest_payment','onChange', _hideAndShowInterestDetailsGrid);
				if(dj.byId('screenMode').get('value') === 'UNSIGNED')
	        	{
	        		_setupRemittanceInstructions(true);
	        	}else{
	        		_setupRemittanceInstructions(false);	
	        	}
				
			},
			
			

			
		/**
		 * Get or Identify the Transaction in the Grid, on which the Action needs to be performed.
		 * 
		 * @method getLinkedLoansInterestDetailsAction
		 * @return {String} `ref_id`, the Transaction Reference ID.
		 */
		getLinkedLoansInterestDetailsAction : function(rowIndex, item) {

			if(!item) {
				return this.defaultValue;
			}

			return {
				ref_id: this.grid.store.getValue(item, "loan_ref_id"),
			    deal_name: this.grid.store.getValue(item, "loan_deal_name"),
			    facility_name: this.grid.store.getValue(item, "loan_facility_name"),
			    loan_alias: this.grid.store.getValue(item, "loan_bo_ref"),
			    entity: this.grid.store.getValue(item, "entity") 
			};
		}, 
		
		
		/**
		 * <h4>Summary:</h4>
		 * 
		 *  	Events/Actions/Validations that has to be performed on Form Load.
		 * 
		 * @method onFormLoad
		 * @override
		 **/		
		onFormLoad : function()
		{
			_addRepricingLoansOutstandingAmt();
			_addNewRepricingLoansOutstandingAmt();
			_calculateEarliestRepricingDate();
			if(dj.byId("adjust_amount_option") && dj.byId("adjust_amount_option").checked === true){
				_calculatePrincipalPaymentAmount();
			}	
			_checkLoanInterestDetailsAmount();
//			_calculatePrincipalPaymentAmount();
			_hideAndShowInterestDetailsGrid();
			if(dj.byId('loan_increase_flag').get('value')==="true"){
				_checkForLoanIncrease();
			}

			if(dj.byId('loan_ccy')){
				misys.setCurrency(dijit.byId('loan_ccy'), ['total_repricing_ln_amt','total_ln_amt','total_principal_amt','loan_increase_ln_amt']);
			}
			_checkBorrowerSettlementOnLoad();
			
			updateLimitStoreForRepricingForDraftMode();
			
			_checkFacilityMaturity();
			
			_interestPaymentLoanGridSelection();
			
		},
		
		/**
		 * Popup for to add new Repricing Loan.
		 * 
		 * @method addNewLoanForRepricing
		 */
		addNewLoanForRepricing : function()
		{
//			var repricingOption = dj.byId('repricing_option').get('value');
			
//			if(repricingOption){	
				if(isTotalNewRepricingAmountExceeded()){

					
					//add New Loan repricing Option
//					if(repricingOption=='newloan'){
						_openRepricingPopup(null);
//						_addRepricingLoansOutstandingAmt();
//					}
				}
				
//			}else{
//				m.dialog.show('ERROR',misys.getLocalization('mustChooseRepricingType'));
//			}	
			
		},
		
		/**
		 * Format Linked Loans Interest Details Grid section. Like, alignment, CSS, and hyper link to appear in each grid-row.
		 * 
		 * @method formatLinkedLoanInterestDetailsPreviewActions
		 */
		formatLinkedLoanInterestDetailsPreviewActions : function(result){
			var parent = dojo.create('a');
			var id = ''+result.ref_id+'_details_link';
			
			if(result.deal_name && result.deal_name.indexOf("'") || result.deal_name.indexOf("\"") || result.deal_name.indexOf("<")|| result.deal_name.indexOf(">") || result.deal_name.indexOf("&")){
				result.deal_name = m.escapeHtml(result.deal_name);
			}
			
			if(result.facility_name && result.facility_name.indexOf("'") || result.facility_name.indexOf("\"") || result.facility_name.indexOf("<")|| result.facility_name.indexOf(">") || result.facility_name.indexOf("&")){
				result.facility_name = m.escapeHtml(result.facility_name);
			}
			
			if(result.entity && result.entity.indexOf("'") || result.entity.indexOf("\"") || result.entity.indexOf("<")|| result.entity.indexOf(">") || result.entity.indexOf("&")){
				result.entity = m.escapeHtml(result.entity);
			}
			
			var params= "referenceid="+result.ref_id+"&dealName="+result.deal_name+"&facilityName="+result.facility_name+"&borefid="+result.loan_alias+"&entity="+result.entity+"&productcode="+dj.byId('product_code').get('value');
			if(window.isAccessibilityEnabled){
				params = params+"&parentTitle="+window.document.title;
			}
			var href = 'javascript:';
			var link='Click Here';
		    href = "javascript:misys.popup.showPopup ('"+params+"','INTEREST_DETAILS')";
			var anchor = dojo.create('a',{'id':id, 'href' : href,'innerHTML':link}, parent);
			var dialogLinkInst = '#dialog-link-inst';
			if(window.isAccessibilityEnabled) {
				if(dojo.query(dialogLinkInst) && dojo.query(dialogLinkInst).length >0){
					  var accessibilityText = dojo.attr(dojo.query(dialogLinkInst)[0],'innerHTML');
					  var a11ySpan = dojo.create('span',{'id':idStr,'innerHTML':accessibilityText},anchor);
					  dojo.addClass(a11ySpan,'sr-only');
				}
				var idStr = id+"_details_a11y_span";
				
				dojo.attr(anchor,'aria-describedby',idStr);
			}
			return parent.innerHTML;
			
		},
		/**
		 * Grid actions only with delete option.
		 *
		 *@method newRepricingLoanDeleteActions
		 *
		 */
		newRepricingLoanFormatActions : function(result) {

			var parent=dojo.create('div');
			
			var div=dojo.create('div',{'class':'gridActions'},parent);
			dojo.create ('img',{'src': misys.getContextualURL(misys._config.imagesSrc + m._config.imageStore.editIcon),
				'alt':'Edit', 'title':'Edit', 'border' : '0', 'type': 'Edit','onclick':'misys.editNewRepricingLoans("'+result.ref_id+'")'},div);	
			
			dojo.create ('img',{'src': misys.getContextualURL(misys._config.imagesSrc + m._config.imageStore.deleteIcon),
				'alt':'Delete', 'title':'Delete', 'border' : '0', 'type': 'remove','onclick':'misys.deleteNewRepricingLoans("'+result.ref_id+'")'},div);			
			
			return parent.innerHTML;
		},


		
		/**
		 * Get or Identify the Transaction in the Grid, on which the Action needs to be performed.
		 * 
		 * @method getRepricedNewLoansAction
		 * @return {String} `ref_id`, the Transaction Reference ID.
		 */
		getRepricedNewLoansAction : function(rowIndex, item) {

			if(!item) {
				return this.defaultValue;
			}
			return {
				ref_id: this.grid.store.getValue(item, "new_loan_ref_id")
			};
		}, 
		
		/**
		 * Edit the New Repricing Loan.
		 * 
		 * @method editNewRepricingLoans
		 */
		editNewRepricingLoans : function(refId)
		{
			_openRepricingPopup(refId);
		},
		
		
		/**
		 * <h4>Summary:</h4>
		 * 
		 *  	Validations that has to be made before Saving any Transaction.
		 *   
		 *  <h4>Description:</h4>
		 *  
		 * 		This beforeSaveValidations is a standard action method.
		 * 
		 * 		Here, if the corresponding Company of the User is associated with one or more Entities
		 * 		then we place a Mandatory check for the selection of at-least `One Entity`,
		 * 		before saving any transaction.
		 * 
		 * @method beforeSaveValidations
		 * @return {Boolean} `True`, if all before saving validations are satisfactory.
		 * 
		 **/
		beforeSaveValidations : function()
		{
			if(dj.byId('tnx_amt') && dj.byId('total_ln_amt')){
				var totalOutstandingAmt=dj.byId('total_ln_amt').get('value');
				dj.byId('bk_total_amt').set('value', totalOutstandingAmt);	
				dj.byId('tnx_amt').set('value', totalOutstandingAmt);
			}
			if(validateLNRepricingFields() && _validateRepricingRecords()){
				return true;
			}
			return false;			
		},

		/**
		 * This function sets the global message for submition based upon the selection of interest payment
		 * @method setCustomConfirmMessage
		 */
		
		setCustomConfirmMessage : function()
		{			
			var interestPayment=dj.byId("interest_payment");
			var currency = null, amount = null;
			
			if(dj.byId('mode').get('value') === 'UNSIGNED'){
				currency = dj.byId('bk_cur_code') && dj.byId('bk_cur_code').get('value') != null ? dj.byId('bk_cur_code').get('value') : "";
				amount = dj.byId('bk_total_amt') && dj.byId('bk_total_amt').get('value') != null ? dj.byId('bk_total_amt').get('value') : "";
	    	}else{
	    		currency = dj.byId('bk_cur_code') && dj.byId('bk_cur_code').get('value') != null ? dj.byId('bk_cur_code').get('value') : "";
			amount = dj.byId('total_ln_amt') && dj.byId('total_ln_amt').get('value') != null ? dj.byId('total_ln_amt').get('value') : "";
			var cldrMonetary = d.cldr.monetary.getData(currency);
	    		amount = amount !== "" ? d.currency.format((Math.floor((parseFloat(amount) * 100).toFixed(2)) / 100), {round: cldrMonetary.round,places: cldrMonetary.places}): "" ;
	    	}
		if(interestPayment && interestPayment.checked===false){
				 m._config.globalSubmitConfirmationMsg=m.getLocalization("submitLoanForRepricingError", [currency, amount]);
	         }else{
	        	 m._config.globalSubmitConfirmationMsg = m.getLocalization("submitTransactionConfirmationForLoan", ["Repricing", currency,amount ]);
	         }

		},
		
		/**
		 * <h4>Summary:</h4>
		 * 
		 *  	Validations that has to be made before Submitting any Transaction.
		 *   
		 *  <h4>Description:</h4>
		 *  
		 * 		This beforeSubmitValidations is a standard action method.
		 * 		Any Product specific validation checks will be coded in this method.
		 *
		 * @method beforeSubmitValidations
		 * @return {Boolean} `True`, if all before submission validations are satisfactory.
		 **/
		beforeSubmitValidations : function()
		{
			
			if(dj.byId('tnx_amt') && dj.byId('total_ln_amt')){
				var totalOutstandingAmt=dj.byId('total_ln_amt').get('value');
				dj.byId('bk_total_amt').set('value', totalOutstandingAmt);	
				dj.byId('tnx_amt').set('value', totalOutstandingAmt);
			}	

			var validCheck = validateEmptyLoans() && checkRemittanceIsSelected() && validateLNRepricingFields() && _validateRepricingRecords() && _validateRepricingLoanLimitAmt();
	
			
			if(!validCheck){
    			m._config.legalTextEnabled = false;
    			return false;
    		}
			var ajaxCallCheck = m.isLegalTextAcceptedForAuthorizer() ;
    		if(validCheck && !(ajaxCallCheck)){
    			m._config.legalTextEnabled = true;
    			return false;
    		}else if(validCheck && (ajaxCallCheck)){
    			return true;
    		}
			return false;
		},
		
        /**
         * Toggle Additional Details Grid
         * 
         * @method toggleAdditionalDetails
         */
		toggleAdditionalDetails : function(){
			var downArrow = d.byId("actionDown");
			var upArrow = d.byId("actionUp");
			var additionalDetailstDiv = d.byId("AdditionalDetailsContainer");
			if(d.style("AdditionalDetailsContainer","display") === "none")
			{
				m.animate('wipeIn',additionalDetailstDiv);
				dj.byId('additionalInnerDetailsGrid').resize();
				d.style('actionDown',"display","none");
				d.style('actionUp',"display","block");
				d.style('actionUp', "cursor", "pointer");
			}
			else
			{
				m.animate('wipeOut',additionalDetailstDiv);
				d.style('actionUp',"display","none");
				d.style('actionDown',"display","block");
				d.style('actionDown', "cursor", "pointer");
			}
		},
		
		/**
		 * <h4>Summary:</h4>
		 * 
		 *  	This methods could be used navigate to Product specific listing screens.
		 *   
		 *  <h4>Description:</h4>
		 *  
		 * 		This onCancelNavigation is a standard action method.
		 * 		Any Product specific navigations will be coded in this method.
		 *
		 * @method onCancelNavigation
		 * @return {String}, the product specific target URL will be returned.
		 **/
		onCancelNavigation : function()
		{
			var targetUrl = misys._config.homeUrl;
			var productCode = dj.byId('product_code');
			var subProdCode = dj.byId('sub_product_code');
			if(productCode && productCode.get('value') === "BK" && subProdCode && subProdCode.get('value') === "LNRPN")
			{
				var cancelButtonURL = ["/screen/LoanScreen?tnxtype=01", "&operation=LIST_REPRICING"];
				targetUrl = misys.getServletURL(cancelButtonURL.join(""));
			}
			return targetUrl;
		},		
        /**
         * Toggle Legal Text Details Grid
         * 
         * @method toggleLegalTextDetails
         */
		toggleLegalTextDetails : function(){
			var downArrow = d.byId("actionDown");
			var upArrow = d.byId("actionUp");
			var LegalDetailsDiv = d.byId("LegalTextContainer");
			if(d.style("LegalTextContainer","display") === "none")
			{
				m.animate('wipeIn',LegalDetailsDiv);
				dj.byId('LegalTextDetailsGrid').resize();
				d.style('actionDown',"display","none");
				d.style('actionUp',"display","block");
				d.style('actionUp', "cursor", "pointer");
			}
			else
			{
				m.animate('wipeOut',LegalDetailsDiv);
				d.style('actionUp',"display","none");
				d.style('actionDown',"display","block");
				d.style('actionDown', "cursor", "pointer");
			}
		},	
		
		
		/**
		 * Deletes the Linked Loan one at a time.
		 * 
		 * @method deleteNewRepricingLoans
		 */
		deleteNewRepricingLoans : function(refId)
		{
			var newRepricingLoanGrid = dijit.byId('gridNewLoanRepricingTransactions');
			if(newRepricingLoanGrid && newRepricingLoanGrid.store)
			{
				var storeSize = 0;
				var getSize = function(size, request)
				{
					storeSize = size;
				};

				newRepricingLoanGrid.get('store').fetch({query: {}, onBegin: getSize, start: 0, count: 0});
				if(storeSize > 1)
				{
					var facilityId;
					var loanAmount;
					var onOkCallback = function(){
						newRepricingLoanGrid.store.fetch({
							query: {new_loan_ref_id: refId},
							onComplete: dojo.hitch(this, function(items, request){ 
								dojo.forEach(items, function(item){
									facilityId=item.new_loan_facility_id;
									loanAmount=item.new_loan_outstanding_amt;
									newRepricingLoanGrid.store.deleteItem(item);
								}, this);
								
							})
						});
						newRepricingLoanGrid.store.save();
						_addNewRepricingLoansOutstandingAmt();
						_calculatePrincipalPaymentAmount();
					    _updateLimitsOnDeletionOfLoan(facilityId,loanAmount);
					    _updateFacilityAmountOnDeletionOfLoan(facilityId,loanAmount);
						if(dj.byId('loan_increase_flag').get('value')==="true"){
						    _checkForLoanIncrease();
						  }
					
					};
					m.dialog.show("CONFIRMATION", misys.getLocalization('linkedLoanDeleteAction', [refId]),
							"", null, null, "", onOkCallback);
				}
				else
				{
					m.dialog.show('CONFIRMATION',misys.getLocalization('lastLoanInlinkedLoanDeleteAction', [refId]));
				}
			}
		}
		
	});
	// Setup the XML transform function
	m._config = m._config || {};
	d.mixin(m._config, {
		/**
		 * XML Custom Transformation 
		 * 
		 * @method xmlTransform
		 */
		xmlTransform : function(/*String*/ xml) {
		

//			var xmlRoot = m._config.xmlTagName,
			var xmlRoot ="bk_tnx_record",

			transformedXml = ["<", xmlRoot, ">"];

			// Representation of existing XML
			var dom = dojox.xml.DomParser.parse(xml);

//			if (xml.indexOf(xmlRoot) != -1)
//			{
				// Push the entire XML into the new one
				var subXML = xml.substring(xmlRoot.length+2,(xml.length-xmlRoot.length-3));
				var interestPaymentIndicator=dj.byId("interest_payment");
				var borrowerSettlement=dj.byId("borrower_settlement");
//				var principalPayment=dj.byId("total_principal_amt").get('value');
				var adjustAmountOptioIndicatorn=dj.byId("adjust_amount_option");
				
				if(borrowerSettlement && (borrowerSettlement.get('value') === 'on' || borrowerSettlement.get('value') === 'Y')){
					transformedXml.push("<borrower_settlement_ind>",'Y',"</borrower_settlement_ind>");
				}else{
					transformedXml.push("<borrower_settlement_ind>",'N',"</borrower_settlement_ind>");
				}
				
			
				if( adjustAmountOptioIndicatorn && (adjustAmountOptioIndicatorn.get('value')=== 'Y' || adjustAmountOptioIndicatorn.get('value') === 'on')){
					transformedXml.push("<adjust_payment_options>",'Y',"</adjust_payment_options>");
				}else{
					transformedXml.push("<adjust_payment_options>",'N',"</adjust_payment_options>");
				}
				if(dijit.byId("legalDialog") && dijit.byId('accept_legal_text') && dijit.byId('accept_legal_text').get('checked')){
					subXML = subXML.concat("<accept_legal_text>");
					subXML = subXML.concat("Y");
					subXML = subXML.concat("</accept_legal_text>");
				}else if(dijit.byId("legalDialog") && dijit.byId('accept_legal_text') && !(dijit.byId('accept_legal_text').get('checked'))){
					subXML = subXML.concat("<accept_legal_text>");
					subXML = subXML.concat("N");
					subXML = subXML.concat("</accept_legal_text>");
				}

				var linkedLoanGrid = dijit.byId('gridRepricingLoanTransactions');
				if(linkedLoanGrid && linkedLoanGrid.store)
				{
					var linkedLoansRefIds = "";
					linkedLoansRefIds = linkedLoansRefIds.concat("<linked_loans>");
					linkedLoanGrid.store.fetch({
						query: {loan_ref_id: '*'},
						onComplete: dojo.hitch(this, function(items, request){ 
							d.forEach(items,function(item){
								linkedLoansRefIds = linkedLoansRefIds.concat("<loan_ref_id>");
								linkedLoansRefIds = linkedLoansRefIds.concat(item.loan_ref_id[0]);
								linkedLoansRefIds = linkedLoansRefIds.concat("</loan_ref_id>");
							}, this);
						})
					});
					linkedLoansRefIds = linkedLoansRefIds.concat("</linked_loans>");
				}
				subXML = subXML.concat(linkedLoansRefIds);

				transformedXml.push(subXML);
				var bulkEffectiveDate;
				var bulkFacilityName;
				var tempFacilityName = 0;
				var newRepricingLoanGrid = dijit.byId('gridNewLoanRepricingTransactions');
				var remittanceInstruction = '';
				if(newRepricingLoanGrid && newRepricingLoanGrid.store)
				{
					transformedXml.push("<repricing_new_loans>");
					var remInst = dijit.byId('gridRemittanceInstruction');
					if(remInst && remInst.selection && 
							remInst.selection.getSelected() && 
							remInst.selection.getSelected()[0] && 
							remInst.selection.getSelected()[0].description && 
							remInst.selection.getSelected()[0].description[0])
					{
						remittanceInstruction = remittanceInstruction.concat("<rem_inst_description>");
						remittanceInstruction = remittanceInstruction.concat(remInst.selection.getSelected()[0].description[0]);
						remittanceInstruction = remittanceInstruction.concat("</rem_inst_description>");
						remittanceInstruction = remittanceInstruction.concat("<rem_inst_location_code>");
						remittanceInstruction = remittanceInstruction.concat(remInst.selection.getSelected()[0].locationCode[0]);
						remittanceInstruction = remittanceInstruction.concat("</rem_inst_location_code>");
						remittanceInstruction = remittanceInstruction.concat("<rem_inst_servicing_group_alias>");
						remittanceInstruction = remittanceInstruction.concat(remInst.selection.getSelected()[0].servicingGroupAlias[0]);
						remittanceInstruction = remittanceInstruction.concat("</rem_inst_servicing_group_alias>");
						remittanceInstruction = remittanceInstruction.concat("<rem_inst_account_no>");
						remittanceInstruction = remittanceInstruction.concat(remInst.selection.getSelected()[0].accountNo[0]);
						remittanceInstruction = remittanceInstruction.concat("</rem_inst_account_no>");
					}
					else
					{
						remittanceInstruction = remittanceInstruction.concat("<rem_inst_description>");
						remittanceInstruction = remittanceInstruction.concat("</rem_inst_description>");
						remittanceInstruction = remittanceInstruction.concat("<rem_inst_location_code>");
						remittanceInstruction = remittanceInstruction.concat("</rem_inst_location_code>");
						remittanceInstruction = remittanceInstruction.concat("<rem_inst_servicing_group_alias>");
						remittanceInstruction = remittanceInstruction.concat("</rem_inst_servicing_group_alias>");
						remittanceInstruction = remittanceInstruction.concat("<rem_inst_account_no>");
						remittanceInstruction = remittanceInstruction.concat("</rem_inst_account_no>");
					}
					newRepricingLoanGrid.store.fetch({
						query: {new_loan_ref_id: '*'},
						onComplete: dojo.hitch(this, function(items, request){ 
							d.forEach(items,function(item){
								transformedXml.push("<ln_tnx_record>");
								transformedXml.push("<new_loan_ref_id>",item.new_loan_ref_id[0],"</new_loan_ref_id>");
								transformedXml.push("<new_loan_tnx_id>",item.new_loan_tnx_id[0],"</new_loan_tnx_id>");
								transformedXml.push("<new_loan_entity>",item.new_loan_entity[0],"</new_loan_entity>");
								transformedXml.push("<new_loan_our_ref>",dojox.html.entities.encode(item.new_loan_our_ref[0], dojox.html.entities.html),"</new_loan_our_ref>");
								transformedXml.push("<new_loan_deal_name>",dojox.html.entities.encode(item.new_loan_deal_name[0], dojox.html.entities.html),"</new_loan_deal_name>");
								transformedXml.push("<new_loan_deal_id>",item.new_loan_deal_id[0],"</new_loan_deal_id>");
								transformedXml.push("<new_loan_facility_name>",dojox.html.entities.encode(item.new_loan_facility_name[0], dojox.html.entities.html),"</new_loan_facility_name>");
								transformedXml.push("<new_loan_facility_id>",item.new_loan_facility_id[0],"</new_loan_facility_id>");
								transformedXml.push("<new_loan_pricing_option>",item.new_loan_pricing_option[0],"</new_loan_pricing_option>");
								transformedXml.push("<new_loan_ccy>",item.new_loan_ccy[0],"</new_loan_ccy>");
								transformedXml.push("<new_loan_outstanding_amt>",item.new_loan_outstanding_amt[0],"</new_loan_outstanding_amt>");
								transformedXml.push("<new_loan_effective_date>",item.new_loan_effective_date[0],"</new_loan_effective_date>");
								transformedXml.push("<new_loan_maturity_date>",item.new_loan_maturity_date[0],"</new_loan_maturity_date>");
								transformedXml.push("<new_loan_borrower_reference>",dojox.html.entities.encode(item.new_loan_borrower_reference[0],dojox.html.entities.html),"</new_loan_borrower_reference>");							
								transformedXml.push("<new_loan_repricing_frequency>",item.new_loan_repricing_frequency_id[0],"</new_loan_repricing_frequency>");
//								transformedXml.push("<new_loan_interest_cycle_frequency>",item.new_loan_interest_cycle_frequency_id[0],"</new_loan_interest_cycle_frequency>");
								transformedXml.push("<new_loan_repricing_date>",item.new_loan_repricing_date[0],"</new_loan_repricing_date>");
								transformedXml.push("<new_loan_repricing_riskType>",item.new_loan_risk_type[0],"</new_loan_repricing_riskType>");
								transformedXml.push("<new_loan_fcn>",item.new_loan_fcn[0],"</new_loan_fcn>");
								transformedXml.push("<new_loan_matchFunding>",item.new_loan_matchFunding[0],"</new_loan_matchFunding>");
								transformedXml.push("<new_fx_conversion_rate>",item.new_fx_conversion_rate[0],"</new_fx_conversion_rate>");	
								transformedXml.push("<new_fac_cur_code>",item.new_fac_cur_code[0],"</new_fac_cur_code>");
								
								transformedXml.push(remittanceInstruction);
								transformedXml.push("</ln_tnx_record>");
								bulkEffectiveDate= item.new_loan_effective_date[0];
								bulkFacilityName= item.new_loan_facility_name[0];
								if(tempFacilityName === 0 || tempFacilityName === item.new_loan_facility_name[0] )
								{
									tempFacilityName = bulkFacilityName;
									bulkFacilityName = item.new_loan_facility_name[0];
								}
								else
								{
									bulkFacilityName = "*";
								}
							}, this);
						})
					});
					transformedXml.push("</repricing_new_loans>");
				}			
				
				if(interestPaymentIndicator && (interestPaymentIndicator.get('value') === 'on' || interestPaymentIndicator.get('value') === 'Y')){
					transformedXml.push("<interest_payment>",'Y',"</interest_payment>");
				}else{
					transformedXml.push("<interest_payment>",'N',"</interest_payment>");
				}	
				transformedXml.push("<bulk_Effective_Date>",bulkEffectiveDate,"</bulk_Effective_Date>");
				
				transformedXml.push("<bulk_facility_name>",dojox.html.entities.encode(bulkFacilityName, dojox.html.entities.html),"</bulk_facility_name>");
//				if(interestPaymentIndicator.checked==true){							

				var interestPaymentGrid = dijit.byId('gridLayoutInterestDetailsLoanTransactions');
				var interestPaymentLoanFlag=dijit.byId('interest_Payment_loan_flag');

					if(interestPaymentGrid && interestPaymentGrid.store)
					{
						transformedXml.push("<interestPayments>");
						var repriceOldLoanAliases=[];
						
						if(interestPaymentLoanFlag.get("value")==="true")
						{
							var selItems = interestPaymentGrid.selection.getSelected();
							//add - update
							if(selItems.length >0) 
							{								
								for(var i=0;i<selItems.length;i++)
								{	var item=selItems[i];			
							
                                    transformedXml.push("<interestPayment>");
									transformedXml.push("<loanAlias>",dojox.html.entities.encode(item.loan_alias[0], dojox.html.entities.html),"</loanAlias>");
									repriceOldLoanAliases.push(dojox.html.entities.encode(item.loan_alias[0], dojox.html.entities.html),",");
									if(item.loan_alias[0]!== "")
									{
									    repriceOldLoanAliases.push(dojox.html.entities.encode(item.loan_alias[0], dojox.html.entities.html),",");
									}
									transformedXml.push("<interesteDueAmt>",item.totalProjectedEOCamt[0],"</interesteDueAmt>");
									transformedXml.push("<cycleStartDate>",item.cycleStartDate[0],"</cycleStartDate>");
									transformedXml.push("</interestPayment>");								
						
								}
							}
						}
						else
						{						
								interestPaymentGrid.store.fetch({
								query: {loan_alias: '*'},
								onComplete: dojo.hitch(this, function(items, request){ 
									d.forEach(items,function(item){							
											transformedXml.push("<interestPayment>");
											transformedXml.push("<loanAlias>",dojox.html.entities.encode(item.loan_alias[0], dojox.html.entities.html),"</loanAlias>");
											repriceOldLoanAliases.push(dojox.html.entities.encode(item.loan_alias[0], dojox.html.entities.html),",");
											transformedXml.push("<interesteDueAmt>",item.totalProjectedEOCamt[0],"</interesteDueAmt>");
											transformedXml.push("<cycleStartDate>",item.cycleStartDate[0],"</cycleStartDate>");
											transformedXml.push("</interestPayment>");											 								
									}, this);
								})
							});							
						}
						transformedXml.push("</interestPayments>");		
						transformedXml.push("<repricing_old_loan_aliases>",repriceOldLoanAliases.join(""),"</repricing_old_loan_aliases>");
					}	
//				}								
				if(xmlRoot) {
					transformedXml.push("</", xmlRoot, ">");
				}
				return transformedXml.join("");
//			}
//			else {
//				return xml;
//			}


		}
	});		
})(dojo, dijit, misys);
// Including the client specific implementation
dojo.require('misys.client.binding.loan.repricing_ln_client');
