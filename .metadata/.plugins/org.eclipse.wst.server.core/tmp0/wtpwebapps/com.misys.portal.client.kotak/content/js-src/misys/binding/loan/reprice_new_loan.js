dojo.provide("misys.binding.loan.reprice_new_loan");
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
	
	misys._config.count=1;
	misys._config.errorMsgFlag=false;
	misys._config.isReprcingDateFlag=false;
	var CNC='CUSTOM-NO-CANCEL';

	/**
	 * Validates the data entered as the Maturity Date.
	 * 
	 * @method _validateLoanMaturityDate
	 */
	function _validateLoanMaturityDate(){
		//  summary:
		//        Validates the data entered as the Maturity Date.
		//  tags:
		//         public, validation

		// This validation is for non-required fields
		if(this.get('value') == null){
			return true;
		}

		console.debug('[Validate] Validating Loan Maturity Date. Value = ' + this.get('value'));

		var thisObject  = dj.byId(this.id);

		// Test that the loan maturity date is less than or equal to the
		// facility maturity date
		var facMatDate = dijit.byId('facility_maturity_date');
		if(!m.compareDateFields(thisObject, facMatDate))
		{
			this.invalidMessage = misys.getLocalization('loanMatDateGreaterThanFacMatDateError', [
			                                                                                      m.getLocalizeDisplayDate(this),
			                                                                                      m.getLocalizeDisplayDate(facMatDate)]);
			return false;
		}

		// Test that the loan maturity date is greater than or equal to the loan
		// effective date
		var loanEffDate = dijit.byId('effective_date');
		if(!m.compareDateFields(loanEffDate, thisObject))
		{
			this.invalidMessage = misys.getLocalization('loanMatDateLessThanLoanEffDateError', [
			                                                                                    m.getLocalizeDisplayDate(this),
			                                                                                    m.getLocalizeDisplayDate(loanEffDate)]);
			return false;
		}
		return true;
	}
	
	/**
	 * Validates  facility commitment amount for the new Loan repricing.
	 * 
	 * @method _validateRepricingRecords
	 */
	function _validateFacilityCommitmentSchAmt() {
		var isDifferentFacility=true;
		var facilitySelected = dj.byId('bo_facility_id').get('value');
		var linkedLoansRefIds = "";
		var totalOldLnsAmtForFac=0;
		var repricingDateField=dijit.byId('repricing_date').get('value');		
		var modifiedNewLoanAmount;	
		if(repricingDateField!==""){
			var repricedLoanGrid = window.opener.oldLoanGrid;	
				if(repricedLoanGrid && repricedLoanGrid.store)
				{
					repricedLoanGrid.store.fetch({
						query: {loan_facility_id: facilitySelected},
						onComplete: dojo.hitch(this, function(items, request){ 
							d.forEach(items,function(item){
									linkedLoansRefIds = linkedLoansRefIds.concat(item.loan_ref_id[0]);
									linkedLoansRefIds = linkedLoansRefIds.concat(",");
									var newloanOutstanding=item.loan_outstanding_amt[0];
									if(typeof newloanOutstanding === 'string' || newloanOutstanding instanceof String)
									{
										modifiedNewLoanAmount=item.loan_outstanding_amt[0].split(',').join('');
									}
									else
									{
										modifiedNewLoanAmount=item.loan_outstanding_amt[0];
									}
									totalOldLnsAmtForFac = parseFloat(totalOldLnsAmtForFac) + parseFloat(modifiedNewLoanAmount);
									isDifferentFacility=false;
							}, this);
						})
					});
				}
						
				getMaximumAvailableFacilityAmount();
				
				var maxFacAvailableAmount=dijit.byId('faciliy_global_available_amount').get('value');
				
				//perform validation if the facility is fully drawn and not different facility other than old Loans facility.
				if(!parseFloat(maxFacAvailableAmount)>0 && !isDifferentFacility){
					
				var refId = dijit.byId('ref_id').get('value');
				var repricingDate=dijit.byId('repricing_date').get('displayedValue');
				if(repricingDate==="" || repricingDate===null){
					repricingDate=dijit.byId('ln_maturity_date').get('displayedValue');
				}
				var repricingLoanGrid = window.opener.newLoanGrid;
				var ln_amt=dj.byId('ln_amt').get('value');
				var totalOutstandingAmt=parseFloat(ln_amt);
				var isValid = true;
				var errorMsg;
				var fac_cur_code=window.opener.fac_cur_code;
				var loan_currency= window.opener.loan_currency;
									
				if(repricingLoanGrid && repricingLoanGrid.store)
				{
					repricingLoanGrid.store.fetch({
						query: {new_loan_facility_id: facilitySelected},
						onComplete: dojo.hitch(this, function(items, request){ 
							d.forEach(items,function(item){
								if(refId!==item.new_loan_ref_id[0]){
									var newloanOutstanding=item.new_loan_outstanding_amt[0];
									var modifiedcurrencyLimitAmount;
									
									if(typeof newloanOutstanding === 'string' || newloanOutstanding instanceof String)
									{
										modifiedcurrencyLimitAmount=item.new_loan_outstanding_amt[0].split(',').join('');
									}
									else
									{
										modifiedcurrencyLimitAmount=item.new_loan_outstanding_amt[0];
									}
									totalOutstandingAmt = parseFloat(totalOutstandingAmt) + parseFloat(modifiedcurrencyLimitAmount);
								}
	
							}, this);
						})
					});
				}
	
				
				m.xhrPost({
					url : m.getServletURL("/screen/AjaxScreen/action/ValidateAmountWithCommitmentSchedule"),
					handleAs : "json",
					preventCache : true,
					sync : true,
					content: { 
								facilityid 		: facilitySelected,
								repricing_date	:repricingDate,
								loanAmount		:totalOutstandingAmt,
							    linkedLoans 	:linkedLoansRefIds,
							    repriced_ln_amt	:totalOldLnsAmtForFac,
							    facCurCode		:fac_cur_code,
							    loanCurrency	:loan_currency},
					load : function(response, args){
							isValid = response.commitmentViolated;
							errorMsg = response.errorMsg;
					},
					error : function(response, args){
						isValid = false;
						console.error(" processRepricingOfRecords error", response);
					}
				});
			
				if(!isValid)
				{
					m.dialog.show('ERROR',errorMsg);
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

	}

	
/*This method check the expired facility existence
 * return boolean
 * @method _checkNewLoanForExpiredFacility
 */

function _checkNewLoanForExpiredFacility(){
	var boFacilityId=dijit.byId("bo_facility_id");
	var expiredFacilityId=new Array();
	var index=0;
	
	window.opener.facilitiesStore.fetch({
		query: {id: '*'},
		onComplete: d.hitch(this, function(items, request){
		dojo.forEach(items, function(item){	
				var status=item.status;
				if(status[0]==="Expired"){
					expiredFacilityId.push(item.id[0]);
					 index=index+1;
				}
			}, this);
		})
	});
	
	if(expiredFacilityId.indexOf(boFacilityId.get("value"))>-1){
		return false;
	}else{
		return true;
	}
	
}
	/**
	 * checks the limit validations for repricing
	 * @method validateLimitsForrepricing
	 * @returns {Boolean}
	 */
	
function _validateLimitsForRepricing(){
	dijit.byId('ln_amt').set('value', parseFloat(dj.byId('ln_amt').get('value')));
	if(_validateZeroRepricingLoanAmount()){
		if( _checkNewLoanForExpiredFacility()){
				var facilitySelected = dj.byId('bo_facility_id').get('value');
					var oldLoanGrid = window.opener.oldLoanGrid;
					var facilityList = [];
					if(oldLoanGrid && oldLoanGrid.store)
					{
						oldLoanGrid.store.fetch({
							query: {loan_ref_id:'*'},
							onComplete: dojo.hitch(this, function(items, request){ 
								dojo.forEach(items, function(item){
									var facilityId=''+item.loan_facility_id;
									facilityList.push(facilityId);
								}, this);
							})
						});
					}
				var facAmtStore= window.opener.facilityAvailableAmountStore;
				var riskTypeStore= window.opener.riskTypeLimitStore;
				var curTypeStore= window.opener.currencyTypeLimitStore;		  
				var borrowerTypeStore= window.opener.borrowerTypeLimitStore;
				var limitsMap = [];	
				var isValid=true;
				
				var facAvailableAmt;
				facAmtStore.fetch({
					query: {id: facilitySelected},
					onComplete: d.hitch(dj.byId('bo_facility_id'), function(items, request){
						var item = items[0];
						if(item)
						{
							var limitAmt=''+item.borrowerAvailableLimitAmount[0];
							facAvailableAmt = parseFloat(limitAmt.split(',').join(''));	
		                    //if the borrowerAvailableLimitAmount is less than or equal to zero always perform facility fully drawn validation first.
								if(facAvailableAmt<=0 && facilityList.indexOf(facilitySelected) == -1){
								facAvailableAmt=Number.NEGATIVE_INFINITY;
							}		
							limitsMap.push({limitValue:facAvailableAmt,validateMethod:'_checkForFacliltyFullDrawn'});
						}
					})
				});			
           var facAvailAmtWithPend;					
					facAmtStore.fetch({
						query: {id: facilitySelected},
						onComplete: d.hitch(dj.byId('bo_facility_id'), function(items, request){
							var item = items[0];
							if(item)
							{
								if(typeof item.borrowerAvailableLimitAmountWithPend !== 'undefined'){
									var limitAmt=''+item.borrowerAvailableLimitAmountWithPend[0];
									facAvailAmtWithPend = parseFloat(limitAmt.split(',').join(''));	
				                    //if the borrowerAvailableLimitAmount is less than or equal to zero always perform facility fully drawn validation first.
									if(facAvailAmtWithPend<=0 && facilityList.indexOf(facilitySelected) == -1){
										facAvailAmtWithPend=Number.NEGATIVE_INFINITY;
									}		
									limitsMap.push({limitValue:facAvailAmtWithPend,validateMethod:'_checkForFacliltyWithPendLoansFullDrawn'});
								}
							}
						})
					});	
				var borowerTypeLimit;
				borrowerTypeStore.fetch({
					query: {id: facilitySelected},
					onComplete: d.hitch(dj.byId('bo_facility_id'), function(items, request){
						var item = items[0];
						if(item)
						{
							var limitAmt=''+item.borrowerTypeLimitAmount[0];
							borowerTypeLimit = parseFloat(limitAmt.split(',').join(''));
							limitsMap.push({limitValue:borowerTypeLimit,validateMethod:'_checkBorrowerTypeLimitAmount'});
						}
					})
				});	
				
				var riskTypeLimit;
				riskTypeStore.fetch({
					query: {id: facilitySelected},
					onComplete: d.hitch(dj.byId('bo_facility_id'), function(items, request){
						var item = items[0];
						if(item)
						{
							var limitAmt=''+item.riskTypeLimitAmount[0];
							riskTypeLimit = parseFloat(limitAmt.split(',').join(''));
							limitsMap.push({limitValue:riskTypeLimit,validateMethod:'_checkRiskTypeLimitAmount'});
						}
					})
				});	
				
				var curTypeLimit;
				curTypeStore.fetch({
					query: {id: facilitySelected},
					onComplete: d.hitch(dj.byId('bo_facility_id'), function(items, request){
						var item = items[0];
						if(item)
						{
							var limitAmt=''+item.currencyLimitAmount[0];
							curTypeLimit = parseFloat(limitAmt.split(',').join(''));
							limitsMap.push({limitValue:curTypeLimit,validateMethod:'_checkCurrencyTypeLimitAmount'});
						}
					})
				});	

				if(dijit.byId('repricingdate_validation').value == 'true'){
					   var commitmentData = _getCommitmentScheduleAmount();
					   if(commitmentData !== null && commitmentData.get('commitmentScheduled'))
					   {
						    var limitAmt= commitmentData.get("commitmentSchAmount");
							var commitmentScheduleLimit = parseFloat(limitAmt);
							limitsMap.push({limitValue:commitmentScheduleLimit,validateMethod:'_checkCommitmentAmountLimit'});
					   }
				   }
		
				if(limitsMap.length>0){			
					
				   //sort the array with the limit values
				   limitsMap=limitsMap.sort(function(a,b) {
					   return a.limitValue-b.limitValue;
						    });	
				   for (var i = 0; i < limitsMap.length; i++) {
					   //invoke the methods in the order of limit values in ascending order
					   var validateMethod=limitsMap[i].validateMethod;
						
				        if("_checkForFacliltyFullDrawn"==validateMethod){
				        	isValid=_checkForFacliltyFullDrawn();			
					        }else if("_checkForFacliltyWithPendLoansFullDrawn"==validateMethod){
					        	isValid=_checkForFacliltyWithPendLoansFullDrawn();
				        }else if("_checkRiskTypeLimitAmount"==validateMethod){
				        	isValid=_checkRiskTypeLimitAmount();
				        }else if("_checkCurrencyTypeLimitAmount"==validateMethod){
				        	isValid=_checkCurrencyTypeLimitAmount();
				        }else if("_checkBorrowerTypeLimitAmount"==validateMethod){
				        	isValid=_checkBorrowerTypeLimitAmount();
				        }else if("_checkCommitmentAmountLimit" == validateMethod){
				        	isValid=_checkCommitmentAmountLimit(limitsMap[i].limitValue);
				        }
				        var validationFlag= window.opener.limitValidationFlag;
				       	if(!isValid){
			        		break;
			        	}else if(validationFlag!=="error"){
			        		return isValid;
			        	}
					}

				   if(!isValid){
					    var loanAmountWidget = dj.byId('ln_amt');
			       		var invalidMessage = loanAmountWidget.invalidMessage;

			       		dj.hideTooltip(loanAmountWidget.domNode);
			       		loanAmountWidget.set("state","Error");
						dj.showTooltip(invalidMessage, loanAmountWidget.domNode,['after'], 0);
						setTimeout(function(){dj.hideTooltip(loanAmountWidget.domNode);}, 5000);
						return false;  
				   }
				   	
				}
					return isValid;
				}
			else{
			    return true;
			}
	}else{
		return false;
	}
}

	/**
	 * 
	 * @method fncValidateNewRepricingLoanPopup
	 */
	function fncValidateNewRepricingLoanPopup(){
        var isValid = false;
		if(validateRepricingRequiredFields() && _validateLoanRepricingDate()&& _validateLoanAmountForExpiredFacility() && _validateLimitsForRepricing() && _validateRepricingLoanAmount()){
			isValid = true;
		}
		if(isValid && dijit.byId('repricingdate_validation').value != 'true'){
			isValid = _validateFacilityCommitmentSchAmt();
		}
		return isValid;		
	}
	
	/**
	 * 
	 * @method fncValidateNewRepricingLoanPopup1
	 */
	
	function fncValidateNewRepricingLoanPopup1(){
     
		if(validateRepricingRequiredFields() && _validateLoanRepricingDate()){
			return true;
		}		
		return false;		
	}
	
	/**
	 * Validate all mandatory fields
	 * @method validateAllRequiredFields
	 */
	function validateRepricingRequiredFields(){		
	
		dj.byId('addLoan').set('disabled',true);
		var mandatoryFields = ['bo_facility_id','pricing_option', 'ln_amt','effective_date','ln_maturity_date', 'repricing_frequency','repricing_date','risk_type'];
		var valid = dojo.every(mandatoryFields, function(id){
			var field = dj.byId(id);
			if(field){
				var value = field.get("value");
				if(value === "" || field.state === "Error" || field.get("displayedValue") === ""){
					var fieldId = field.get('id');
					if((fieldId === 'ln_maturity_date' || fieldId === 'repricing_frequency' || fieldId === 'repricing_date')){
						if(_isMaturityDateAndRepricingFrequencyMandatory(fieldId)){
							misys.showTooltip(misys.getLocalization('mandatoryFieldsError'), field.domNode, ['above','before']);
							field.state = 'Error';
							field._setStateClass();
							dj.setWaiState(field.focusNode, "invalid", "true");
							return false;
						}else{
							return true;
						}
					}
					misys.showTooltip(misys.getLocalization('mandatoryFieldsError'), field.domNode, ['above','before']);
					field.state = 'Error';
					field._setStateClass();
					field.focus();
					dj.setWaiState(field.focusNode, "invalid", "true");
					return false;
				}
			}
			return true;
		});	
		dj.byId('addLoan').set('disabled',false);	
		
		
		if(valid){
			var fc_access_type=dijit.byId('fc_access_type');
			
			if(fc_access_type.get('value') !== 'A'){
				
				var invalidMessage1 = misys.getLocalization('facilityBlockError',[dj.byId('bo_facility_id').get('displayedValue')]);	
				
				m.dialog.show('ERROR',invalidMessage1);
				return false;	
			}
			
		}
		
		return valid;
		
	}
	
	/*This method checks the loan increase and display the loan increase section based on increase ,
	 * disable the principal payment option
	 *  @method _checkForLoanIncrease
	 */
	function _checkForLoanIncrease(){
		
		 var totalRepricingLoanAmt=window.opener.totalRepricingAmountId.get("value");
		 var totalNewRepricingLoanAmt=window.opener.totalNewRepricingAmountId.get("value");
		
		 var loanIncreaseDiv=window.opener.document.getElementById("loan_increase_Section");
		 var loanRemittanceDiv=window.opener.document.getElementById("remittance_inst_section");
		 var loanRemittanceGrid=window.opener.loanRemittanceGrid;
		 
		//check the loan increase,if increase is there show the increase section,disable the principal amount field and calculate the loan increase
		 if(totalNewRepricingLoanAmt>totalRepricingLoanAmt){	
			 calculateLoanIncrease();
			 dojo.style(loanIncreaseDiv, "display", "block");
			 if(loanRemittanceDiv && loanRemittanceGrid){
				 dojo.style(loanRemittanceDiv, "display", "block");
				 loanRemittanceGrid._refresh();
			 }
			 window.opener.adjustAmuntOptions.set("disabled",true);
		}else{
			 dojo.style(loanIncreaseDiv, "display", "none");
			 if(loanRemittanceDiv){
				 dojo.style(loanRemittanceDiv, "display", "none");
			 }
			 
	       }
	}
	
	function _checkForNetCashFlow(){
		var interestDetailsGrid = window.opener.interestDetailsGrids;
		var totalProjectedEOCamt = 0;

		if(interestDetailsGrid && interestDetailsGrid.store){
			interestDetailsGrid.store.fetch({
				query: {loan_alias: '*'},
				onComplete: dojo.hitch(this, function(items, request){
				dojo.forEach(items,function(item){
				totalProjectedEOCamt = parseFloat(totalProjectedEOCamt) + parseFloat(item.totalProjectedEOCamt_fmt[0].split(',').join(''));
				}, this);
				})
			});
		}

		var totalRepricingLoanAmt=window.opener.totalRepricingAmountId.get("value");
		var totalNewRepricingLoanAmt=window.opener.totalNewRepricingAmountId.get("value");

		var loanIncreaseAmount = (parseFloat(totalNewRepricingLoanAmt)-parseFloat(totalRepricingLoanAmt)).toFixed(2);

		if(loanIncreaseAmount<=totalProjectedEOCamt && loanIncreaseAmount>0){
			window.opener.borrowerSettlement.set("checked" ,false);
			window.opener.borrowerSettlement.set("disabled" ,true);
		}
		else{
			window.opener.borrowerSettlement.set("checked" ,true);
			window.opener.borrowerSettlement.set("disabled" ,false);
		}
	}
		
		/*
		 * This method calculate the loan increase amount
		 * @method calculateLoanIncrease
		 */
		
		 function calculateLoanIncrease(){
		
			 var totalRepricingLoanAmt=window.opener.totalRepricingAmountId.get("value");
			 var totalNewRepricingLoanAmt=window.opener.totalNewRepricingAmountId.get("value");
			 
			 var loanIncreaseAmount = parseFloat(totalNewRepricingLoanAmt)-parseFloat(totalRepricingLoanAmt);
	  		 var loanIncreaseAmountField=window.opener.loanIncreaseAmount;
	  		 loanIncreaseAmountField.set('value', loanIncreaseAmount);
			
		 }
		
		 function getMaximumAvailableFacilityAmount(){
			 
			 var facilitySelected = dj.byId('bo_facility_id').get('value');
				
			 window.opener.facilitiesStore.fetch({
					query: {id: facilitySelected},
					onComplete: d.hitch(this, function(items, request){
						var item = items[0];
						dj.byId('faciliy_global_available_amount').set('value',item.globalAvailableAmount[0]);
						
					})
				});		
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
				var title = m.getLocalization("loanRiskTypeLimtAmtExceededWarning");
				dialogText.innerHTML=title;
				var dialogButtons =   d.create("div",{id:"",style:"text-align:right;"},dialogContent,'last');
				//Buttons
				var yesButtton  = new dj.form.Button({label:m.getLocalization("okMessage"),id:""});
				var cancelButtton  = new dj.form.Button({label:m.getLocalization("cancelMessage"),id:""});
			
				d.place(yesButtton.domNode,dialogButtons);
				d.place(cancelButtton.domNode,dialogButtons);
				
				dialog.attr("content", dialogContent);
				
				//Dialog Connects
				m.dialog.connect(yesButtton, 'onClick', function(){
					dialog.hide();
					var valid=_validateRepricingLoanAmount();
					if(valid)
					{
						if(window.editMode === true){
							updateNewLoanItem();
						}else{
							addNewLoanItem();
						}
							window.close ();
					}	
					else
					{
						 // checks the loan increase is enable or not,if enabled then allow the user to add the loan increase 
						var loanIncreaseFlag = window.opener.loanIncreaseFlag;
						if(loanIncreaseFlag === "false"){
							
							var errorMessage = misys.getLocalization('loanRepricingAmountError');	
							m.dialog.show('ERROR',errorMessage);
							
						}
						else{
							var onOkCallback1 = function(){
								if(window.editMode === true){
										updateNewLoanItem();
									}else{
										addNewLoanItem();
									}
										window.close ();
								
		          
							};
								m.dialog.show("CONFIRMATION", misys.getLocalization('loanIncreaseRepricingAmountError', " "),
										"", null, null, "", onOkCallback1);
						}
					}
				},dialog.id);
				
				m.dialog.connect(cancelButtton, 'onClick', function(){
					dialog.hide();
				},dialog.id);
				
				//On Hide of Dialog
				m.dialog.connect(dialog, 'onHide', function() {
					m.dialog.disconnect(dialog);
				});
				//Show the Dialog
				dialog.show();
			}
	/**
	 * Validates the data entered as the Effective Date.
	 * 
	 * @method _validateLoanEffectiveDate
	 */
	function _validateLoanEffectiveDate(){
		//  summary:
	    //        Validates the data entered as the Effective Date.
	    //  tags:
	    //         public, validation
		
		// This validation is for non-required fields
		if(!this.get("value")) {
			return true;
		}
		
		console.debug('[Validate] Validating Loan Effective Date. Value = ' + this.get('value'));
		
		var thisObject  = dj.byId(this.id);
		
		// Test that the loan effective date is greater than or equal to the
		// current date
		var value = thisObject.get("value");
		
		var currentDate = new Date();
		// set the hours to 0 to compare the date values
		currentDate.setHours(0, 0, 0, 0);
		
		// compare the values of the current date and transfer date
		var isValid = d.date.compare(m.localizeDate(this), currentDate) < 0 ? false : true;
		if(!isValid)
		{
			 this.invalidMessage = m.getLocalization("effectiveDateGreaterThanSystemDate", [m.getLocalizeDisplayDate(this)]);
			 return false;
		}
		
		// Test that the loan effective date is greater than or equal to the
		// facility effective date
		var facEffDate = dijit.byId('facility_effective_date');
		if(!m.compareDateFields(facEffDate, thisObject))
		{
			this.invalidMessage = misys.getLocalization('loanEffDateGreaterThanFacEffDateError', [
							m.getLocalizeDisplayDate(this),
							m.getLocalizeDisplayDate(facEffDate)]);
			return false;
		}
		
		// Test that the loan effective date is less than or equal to the
		// facility expiry date
		var facExpDate = dijit.byId('facility_expiry_date');
		if(!m.compareDateFields(thisObject, facExpDate))
		{
			this.invalidMessage = misys.getLocalization('loanEffDateLessThanFacExpDateError', [
							m.getLocalizeDisplayDate(this),
							m.getLocalizeDisplayDate(facExpDate)]);
			return false;
		}
		
		// Test that the loan effective date is less than or equal to the
		// facility maturity date
		var facMaturityDate = dijit.byId('facility_maturity_date');
		if(!m.compareDateFields(thisObject, facMaturityDate))
		{
			this.invalidMessage = misys.getLocalization('loanEffDateLessThanFacMatDateError', [
							m.getLocalizeDisplayDate(this),
							m.getLocalizeDisplayDate(facMaturityDate)]);
			return false;
		}
		
		// Test that the loan effective date is less than or equal to the loan
		// maturity date
		var loanMaturityDate = dijit.byId('ln_maturity_date');
		if(!m.compareDateFields(thisObject, loanMaturityDate))
		{
			this.invalidMessage = misys.getLocalization('loanEffDateLessThanLoanMatDateError', [
							m.getLocalizeDisplayDate(this),
							m.getLocalizeDisplayDate(loanMaturityDate)]);
			return false;
		}
		
		return true;
	}
	
	
	/**
	 * The Total new repricing loan amount should not exceed the 
	 * @method _validateZeroRepricingLoanAmount
	 */
	function _validateZeroRepricingLoanAmount(){
		
		var loanAmount = dj.byId('ln_amt');
		
			if(loanAmount.get('value') == null){
				return true;
			}
			
			if (loanAmount.get('value') <= 0) {
				// let Dojo handle the constraints
				loanAmount.invalidMessage = misys.getLocalization('loanAmountZeroError');
				return false;
			}
			
//			var newLoanAmt=this.get('value');
//			
//			if(!(parseFloat(newLoanAmt)>0)){
//				this.invalidMessage = misys.getLocalization('loanAmountZeroError');			
//				return false;			
//			}		
		return true;
	}
	
	
	/**
	 * check for facility is fully drawn alone with pending loan,if yes then display a error msg.
	 * @method _checkForFacliltyWithPendLoansFullDrawn
	 */
	
	function _checkForFacliltyWithPendLoansFullDrawn(){
		//if its update mode,first update the record then check...
		if(window.editMode === true)
		{
			return checkTotalOfNewLoanAmountWithPendingLoansForFacilityFullyDrawn();
		}
		else
		{
			
		var facilitySelected = dj.byId('bo_facility_id').get('value');
		var loanAmount = dj.byId('ln_amt').get('value');
		var currency = dijit.byId('ln_cur_code');
	    var store= window.opener.facilityAvailableAmountStore;
		var flag=false;
		var totalDummyOutstandingAmt;
		var borrowerLimitAmt;
		var cldrMonetary = d.cldr.monetary.getData(currency.get("value"));
		
		store.fetch({
			query: {id: facilitySelected},
			onComplete: d.hitch(dj.byId('bo_facility_id'), function(items, request){
				var item = items[0];
				if(item)
				{
					var oldLoanAmount=_calculateOldLoanAmountByFacilityId();
					//var dummyAmount=''+item.dummyBorrowerAvailableLimitAmount[0];
					var newLoanAmt=_calculateNewRepricingTotalOutstandingAmtByFacilityId();
					var borrowerLimitWithPendAmount=item.borrowerAvailableLimitAmountWithPend[0];
					if(typeof borrowerLimitWithPendAmount === 'string' || borrowerLimitWithPendAmount instanceof String)
					{
						borrowerLimitAmt=borrowerLimitWithPendAmount.split(',').join('');
					}
					else
					{
						borrowerLimitAmt=borrowerLimitWithPendAmount;
					}
					
				    totalDummyOutstandingAmt = parseFloat(oldLoanAmount) + parseFloat(borrowerLimitAmt)-parseFloat(newLoanAmt);
				   if(parseFloat(loanAmount)>(totalDummyOutstandingAmt.toFixed(2))){
						//Show the error
						flag=true;
						
					}
				}
			})
		});	
	
			if(flag)
			{			
				var widget = dj.byId("ln_amt");
		 		
				if(totalDummyOutstandingAmt <= 0)
				{
					widget.invalidMessage = m.getLocalization("facilityFullyDrawnErrorWithPend");
				}
				else
				{
					widget.invalidMessage = m.getLocalization("loanFacilityLimtPendAmtExceeded", [ currency.get('value'), d.currency.format(totalDummyOutstandingAmt, {round: cldrMonetary.round,places: cldrMonetary.places})]);
				}
				return false;	
			}
			return true;
		}
	}
	
	
	/**
	 * checks for facility is fully drawn with pending loans in update mode
	 * 
	 */
	
	function checkTotalOfNewLoanAmountWithPendingLoansForFacilityFullyDrawn(){
		var facilitySelected = dj.byId('bo_facility_id').get('value');
		var newRepricingLoanGrid = window.opener.newLoanGrid;
		var totalOutstandingAmt=0;
		var differAmount=0;
		var newLoanAmt;
			if(newRepricingLoanGrid && newRepricingLoanGrid.store)
			{
				newRepricingLoanGrid.store.fetch({
					query: {new_loan_ref_id: '*'},
					onComplete: dojo.hitch(this, function(items, request){ 
						dojo.forEach(items, function(item){
							if(facilitySelected == item.new_loan_facility_id)
							{
									var newLoanAmt=''+item.new_loan_outstanding_amt[0];
									totalOutstandingAmt = parseFloat(totalOutstandingAmt) + parseFloat(newLoanAmt.split(',').join(''));
							}
							
						}, this);
					})
				});
			}
			
		
		var lnAmt=dijit.byId("ln_amt").get("value");
		var currency = dijit.byId("ln_cur_code");
		var oldLoanAmount=dj.byId('dummy_ln_amt').get('value');
		oldLoanAmount =  oldLoanAmount.split(',').join('');
		var totalAmount;
		var cldrMonetary = d.cldr.monetary.getData(currency.get("value"));
		if(oldLoanAmount>lnAmt){
			
			differAmount=parseFloat(oldLoanAmount) - parseFloat(lnAmt);
			 totalAmount=parseFloat(totalOutstandingAmt) - parseFloat(differAmount);
		}
		else{
			differAmount=parseFloat(lnAmt) - parseFloat(oldLoanAmount);
			 totalAmount=parseFloat(totalOutstandingAmt) + parseFloat(differAmount);
		}
		
		// totalAmount=parseFloat(totalOutstandingAmt) + parseFloat(differAmount);
		var store= window.opener.facilityAvailableAmountStore;
		var flag=false;
		var totalDummyOutstandingAmt,amountForMessage;
		store.fetch({
			query: {id: facilitySelected},
			onComplete: d.hitch(dj.byId('bo_facility_id'), function(items, request){
				var item = items[0];	
				if(item)
				{
					if(facilitySelected == item.id[0])
					{
						var calOldLoanAmount=_calculateOldLoanAmountByFacilityId();
						var newLoanAmount = _calculateNewRepricingTotalOutstandingAmtByFacilityId();
						var borrowerAmountLimit=''+item.borrowerAvailableLimitAmountWithPend[0];
						totalDummyOutstandingAmt = parseFloat(calOldLoanAmount) + parseFloat(borrowerAmountLimit.split(',').join(''));
						totalDummyOutstandingAmt = totalDummyOutstandingAmt.toFixed(2);
						amountForMessage = (parseFloat(calOldLoanAmount) + parseFloat(borrowerAmountLimit.split(',').join('')) - (parseFloat(newLoanAmount) - parseFloat(oldLoanAmount))).toFixed(2);
					}
							
					if(parseFloat(lnAmt)>totalDummyOutstandingAmt || totalAmount>totalDummyOutstandingAmt)
					{
						//error
						flag=true;			
					}
				}
			})
		});	
		
		if(flag)
		{			
			var widget = dj.byId("ln_amt");
			if(totalDummyOutstandingAmt <= 0)
			{
				widget.invalidMessage = m.getLocalization("loanFacilityAmtWithPendExceeded");
			}
			else
			{
				widget.invalidMessage = misys.getLocalization('loanFacilityLimtPendAmtExceeded',[ currency.get('value'), d.currency.format(amountForMessage, {round: cldrMonetary.round,places: cldrMonetary.places}) ]);
			}			

			return false;	
		}
		return true;
	}
	/**
	 * update dummy field of store every time while adding or updating a loan.
	 * @method _updateFacilityAvailablAmount
	 * @returns
	 */
	function _updateFacilityAvailablAmount()
	{
		var facilitySelected = dj.byId('bo_facility_id').get('value');
		var loanAmount = dj.byId('ln_amt').get('value');
	    var store= window.opener.facilityAvailableAmountStore;
	    var increamentedAmount;
	    store.fetch({
			query: {id: facilitySelected},
			onComplete: d.hitch(dj.byId('bo_facility_id'), function(items, request){
				var item = items[0];
				if(item)
				{
					var dummyAmount=''+item.dummyBorrowerAvailableLimitAmount[0];
					//update the existing loan
					if(window.editMode === true)
					{
							var oldLoanAmount=dj.byId('dummy_ln_amt').get('value');
					   //if currennt loan amount is greater than old amount then the difference of loan maount should be subtract form the dummmylimit amount
						   if(loanAmount>oldLoanAmount)
						   {
							    increamentedAmount=parseFloat(loanAmount.toFixed(2))-parseFloat(oldLoanAmount.split(',').join(''));
							   item.dummyBorrowerAvailableLimitAmount[0]=parseFloat(dummyAmount.split(',').join(''))-parseFloat(increamentedAmount.toFixed(2));
							   
						   }
						   else
						   {
							   increamentedAmount=parseFloat(oldLoanAmount.split(',').join(''))-parseFloat(loanAmount.toFixed(2));
							   item.dummyBorrowerAvailableLimitAmount[0]=parseFloat(dummyAmount.split(',').join(''))+parseFloat(increamentedAmount.toFixed(2));
							   
						   }
					   
					   
					}
					else
					{
							item.dummyBorrowerAvailableLimitAmount[0]=parseFloat(dummyAmount.split(',').join(''))-parseFloat(loanAmount.toFixed(2));
							
					}
				}
			})
		});	
	}
	
	/**
	 * update limit dummy field of store every time while adding or updating a loan.
	 * @method _updateDummyLimitAmount
	 */
	
	function _updateDummyLimitAmount(){
		// riskType Amount update
		var facilitySelected = dj.byId('bo_facility_id').get('value');
		var loanAmount = dj.byId('ln_amt').get('value');
		 var increamentedAmount;
		  var store= window.opener.riskTypeLimitStore;
			store.fetch({
				query: {id: facilitySelected},
				onComplete: d.hitch(dj.byId('bo_facility_id'), function(items, request){
					var item = items[0];
				
					if(item)
					{
						var dummyAmount=''+item.dummyRiskTypeLimitAmount[0];
	             		//update the existing loan
							if(window.editMode === true)
							{
									var oldLoanAmount="0";
									if (misys._config.facilityId=== facilitySelected)
									{
										oldLoanAmount=dj.byId('dummy_ln_amt').get('value');
									}							 
									//if currennt loan amount is greater than old amount then the difference of loan maount should be subtract form the dummmylimit amount
								   if(loanAmount>oldLoanAmount)
								   {
									    increamentedAmount=parseFloat(loanAmount.toFixed(2))-parseFloat(oldLoanAmount.split(',').join(''));
									   item.dummyRiskTypeLimitAmount[0]=parseFloat(dummyAmount.split(',').join(''))-parseFloat(increamentedAmount.toFixed(2));
									   item.dummyRiskTypeLimitAmount[0]= item.dummyRiskTypeLimitAmount[0].toFixed(2);
									   
								   }
								   else
								   {
									    increamentedAmount=parseFloat(oldLoanAmount.split(',').join(''))-parseFloat(loanAmount.toFixed(2));
									   item.dummyRiskTypeLimitAmount[0]=parseFloat(dummyAmount.split(',').join(''))+parseFloat(increamentedAmount.toFixed(2));
									   item.dummyRiskTypeLimitAmount[0]=item.dummyRiskTypeLimitAmount[0].toFixed(2);
									   
								   }
							   
							   
							}
							else
							{
									item.dummyRiskTypeLimitAmount[0]=parseFloat(dummyAmount.split(',').join(''))-parseFloat(loanAmount.toFixed(2));
									item.dummyRiskTypeLimitAmount[0]=item.dummyRiskTypeLimitAmount[0].toFixed(2);
									
							}
							
					}
				
			})
	});	

			//update borrower Limit type
			  store= window.opener.borrowerTypeLimitStore;
				
				store.fetch({
					query: {id: facilitySelected},
					onComplete: d.hitch(dj.byId('bo_facility_id'), function(items, request){
						var item = items[0];
						
						if(item)
						{
							var dummyAmount=''+item.dummyBorrowerTypeLimitAmount[0];
							//update the existing loan
								if(window.editMode === true)
								{
										var oldLoanAmount="0";
										if (misys._config.facilityId=== facilitySelected)
										{
											oldLoanAmount=dj.byId('dummy_ln_amt').get('value');
										}
										//if currennt loan amount is greater than old amount then the difference of loan maount should be subtract form the dummmylimit amount
									   if(loanAmount>oldLoanAmount)
									   {
										    increamentedAmount=parseFloat(loanAmount.toFixed(2))-parseFloat(oldLoanAmount.split(',').join(''));
										   item.dummyBorrowerTypeLimitAmount[0]=parseFloat(dummyAmount.split(',').join(''))-parseFloat(increamentedAmount.toFixed(2));
										   
									   }
									   else
									   {
										    increamentedAmount=parseFloat(oldLoanAmount.split(',').join(''))-parseFloat(loanAmount.toFixed(2));
										   item.dummyBorrowerTypeLimitAmount[0]=parseFloat(dummyAmount.split(',').join(''))+parseFloat(increamentedAmount.toFixed(2));
										   
									   }
								   
								   
								}
								else
								{
										item.dummyBorrowerTypeLimitAmount[0]=parseFloat(dummyAmount.split(',').join(''))-parseFloat(loanAmount.toFixed(2));
										
								}
						}
							
					})
			});	

				//update currency limit type
				
				  store= window.opener.currencyTypeLimitStore;
					
					store.fetch({
						query: {id: facilitySelected},
						onComplete: d.hitch(dj.byId('bo_facility_id'), function(items, request){
							var item = items[0];
							
							if(item)
							{
								var dummyAmount=''+item.dummyCurrencyLimitAmount[0];
									//update the existing loan
									if(window.editMode === true)
									{
										var oldLoanAmount="0";
										if (misys._config.facilityId=== facilitySelected)
										{
											oldLoanAmount=dj.byId('dummy_ln_amt').get('value');
										}
										   //if currennt loan amount is greater than old amount then the difference of loan maount should be subtract form the dummmylimit amount
										   if(loanAmount>oldLoanAmount)
										   {
											    increamentedAmount=parseFloat(loanAmount.toFixed(2))-parseFloat(oldLoanAmount.split(',').join(''));
											   item.dummyCurrencyLimitAmount[0]=parseFloat(dummyAmount.split(',').join(''))-parseFloat(increamentedAmount.toFixed(2));
											   item.dummyCurrencyLimitAmount[0]=item.dummyCurrencyLimitAmount[0].toFixed(2);
											   
										   }
										   else
										   {
											    increamentedAmount=parseFloat(oldLoanAmount.split(',').join(''))-parseFloat(loanAmount.toFixed(2));
											   item.dummyCurrencyLimitAmount[0]=parseFloat(dummyAmount.split(',').join(''))+parseFloat(increamentedAmount.toFixed(2));
											   item.dummyCurrencyLimitAmount[0]=item.dummyCurrencyLimitAmount[0].toFixed(2);
										   }
									   
									   
									}
									else
									{
											item.dummyCurrencyLimitAmount[0]=parseFloat(dummyAmount.split(',').join(''))-parseFloat(loanAmount.toFixed(2));
											item.dummyCurrencyLimitAmount[0]=item.dummyCurrencyLimitAmount[0].toFixed(2);
											
									}
							}
						})
				});							
	} 
	
	/**
	 * method check and calculate the old loan amount w.r.t facility id from the grid
	 * @method _calculateOldLoanAmountByFacilityId
	 */
function _calculateOldLoanAmountByFacilityId(){
		
		var facilitySelected = dj.byId('bo_facility_id').get('value');
		var oldLoanGrid = window.opener.oldLoanGrid;
		var totalOutstandingAmt=0;
		var differAmount=0;
		var oldLoanAmt=0;
			if(oldLoanGrid && oldLoanGrid.store)
			{
				oldLoanGrid.store.fetch({
					query: {loan_facility_id: facilitySelected},
					onComplete: dojo.hitch(this, function(items, request){ 
						dojo.forEach(items, function(item){

							var oldLoanAmt=''+item.loan_outstanding_amt[0];
							totalOutstandingAmt = parseFloat(totalOutstandingAmt) + parseFloat(oldLoanAmt.split(',').join(''));
							
						}, this);
					})
				});
			}
			
		return totalOutstandingAmt.toFixed(2);		
	}
	/**
	 * check for facility is fully drawn,if yes then display a error msg.
	 * @method _checkForFacliltyFullDrawn
	 */
	
	function _checkForFacliltyFullDrawn(){
		//if its update mode,first update the record then check...
		if(window.editMode === true)
		{
			return checkTotalOfNewLoanAmountForFacilityFullyDrawn();
		}
		else
		{
			
		var facilitySelected = dj.byId('bo_facility_id').get('value');
		var loanAmount = dj.byId('ln_amt').get('value');
		var currency = dijit.byId('ln_cur_code');
	    var store= window.opener.facilityAvailableAmountStore;
		var flag=false;
		var totalDummyOutstandingAmt;
		var borrowerLimitAmt;
		var cldrMonetary = d.cldr.monetary.getData(currency.get("value"));
		
		store.fetch({
			query: {id: facilitySelected},
			onComplete: d.hitch(dj.byId('bo_facility_id'), function(items, request){
				var item = items[0];
				if(item)
				{
					var oldLoanAmount=_calculateOldLoanAmountByFacilityId();
					var newLoanAmt=_calculateNewRepricingTotalOutstandingAmtByFacilityId();
					var borrowerLimitAmount=item.borrowerAvailableLimitAmount[0];
					if(typeof borrowerLimitAmount === 'string' || borrowerLimitAmount instanceof String)
					{
						borrowerLimitAmt=borrowerLimitAmount.split(',').join('');
					}
					else
					{
						borrowerLimitAmt=borrowerLimitAmount;
					}
					
				    totalDummyOutstandingAmt = parseFloat(oldLoanAmount) + parseFloat(borrowerLimitAmt)-parseFloat(newLoanAmt);
				   if(parseFloat(loanAmount)>(totalDummyOutstandingAmt.toFixed(2))){
						//Show the error
						flag=true;
						
					}
				}
			})
		});	
	
			if(flag)
			{			
				var widget = dj.byId("ln_amt");
				
				if(totalDummyOutstandingAmt <= 0)
				{
					widget.invalidMessage = m.getLocalization("facilityFullyDrawnError");
				}
				else
				{
					widget.invalidMessage = m.getLocalization("loanFacilityLimtAmtExceeded", [ currency.get('value'), d.currency.format(totalDummyOutstandingAmt, {round: cldrMonetary.round,places: cldrMonetary.places})]);
				}

				return false;	
			}
			return true;
		}
	}
	
	
	/**
	 * Calculate the Total Outstanding amount from new loan grid as per the selected facility
	 * @method _calculateNewRepricingTotalOutstandingAmtByFacilityId
	 */
	function _calculateNewRepricingTotalOutstandingAmtByFacilityId(){
		var facilitySelected = dj.byId('bo_facility_id').get('value');
		var newRepricingLoanGrid = window.opener.newLoanGrid;
		var totalOutstandingAmt = 0;
		
		if(newRepricingLoanGrid && newRepricingLoanGrid.store)
		{
			newRepricingLoanGrid.store.fetch({
				query: {new_loan_ref_id: '*'},
				onComplete: dojo.hitch(this, function(items, request){ 
					dojo.forEach(items, function(item){
						if(facilitySelected===item.new_loan_facility_id[0])
						{
							var newLoanAmt=''+item.new_loan_outstanding_amt[0];
							totalOutstandingAmt = parseFloat(totalOutstandingAmt) + parseFloat(newLoanAmt.split(',').join(''));
						}
					}, this);
				})
			});
		}
		
		return totalOutstandingAmt;
		
	}
	
	/**
	 * Retrieve data from new loans grid and calculate sum of all loans whose repricing date is <= current loan's repricing date or if in edit mode, get amount of current loan's previous amount.
	 *   
	 * @method _getTotalRepricingAmountForCommitmenValidation
	 */
	function _getTotalRepricingAmountForCommitmenValidation(){
		var facilitySelected = dijit.byId('bo_facility_id').get('value');
		var newRepricingLoanGrid = window.opener.newLoanGrid;
		var totalOutstandingAmt = 0;
		var refId = dijit.byId('ref_id').get('value');
		
		var currentRepricingDate = new Date(dijit.byId('repricing_date').get('value'));
		
		if(newRepricingLoanGrid && newRepricingLoanGrid.store)
		{
			newRepricingLoanGrid.store.fetch({
				query: {new_loan_ref_id: '*'},
				onComplete: dojo.hitch(this, function(items, request){ 
					dojo.forEach(items, function(item){
						var newLoanDate=''+item.new_loan_repricing_date[0];
						var date = dojo.date.locale.parse(newLoanDate, {selector :"date",datePattern : misys.getLocalization("g_strGlobalDateFormat")});
						if(facilitySelected===item.new_loan_facility_id[0] && (dojo.date.compare(currentRepricingDate,date,"date") >= 0 || refId === ''+item.new_loan_ref_id[0]))
						{
							var newLoanAmt=''+item.new_loan_outstanding_amt[0];
							totalOutstandingAmt = parseFloat(totalOutstandingAmt) + parseFloat(newLoanAmt.split(',').join(''));
						}
					}, this);
				})
			});
		}
		
		return totalOutstandingAmt;
	}
	
	
	function _checkCommitmentAmountLimit(limitAmount)
	{
		if(window.editMode){
			return checkCommitmentLimitInEditMode(limitAmount);
		}
		var validationFlag= window.opener.limitValidationFlag;
		var currency=dj.byId('ln_cur_code');
		var cldrMonetary = d.cldr.monetary.getData(currency.get("value"));
		var widget = dj.byId("ln_amt");
		var loanAmount = widget.get("value");
		
		var newLoanAmt=_getTotalRepricingAmountForCommitmenValidation();
		var totalOfOldLoans = _calculateOldLoanAmountByFacilityId();
	    var calculatedLimit = parseFloat(totalOfOldLoans) + parseFloat(limitAmount)- parseFloat(newLoanAmt);
		
	   if(parseFloat(loanAmount)>(calculatedLimit.toFixed(2)))
	   {
			if(validationFlag==="error")
			{
		 		if(calculatedLimit>0)
		 		{
		 			widget.invalidMessage =  misys.getLocalization('commitmentScheduleAmountError',[ currency.get('value'), d.currency.format(calculatedLimit, {round: cldrMonetary.round,places: cldrMonetary.places})]);
		 		}
		 		else
		 		{
		 			widget.invalidMessage =  misys.getLocalization('commitmentScheduleFullyDrawnError',[currency.get('value')]);
		 		}
				return false;	
			}
			else
			{
				var warnMessage;
				if(calculatedLimit>0)
		 		{
					warnMessage =  misys.getLocalization('commitmentScheduleAmountError',[ currency.get('value'), d.currency.format(calculatedLimit, {round: cldrMonetary.round,places: cldrMonetary.places})]);
		 		}
		 		else
		 		{
		 			warnMessage =  misys.getLocalization('commitmentScheduleFullyDrawnError',[currency.get('value')]);
		 		}
				m.dialog.show(CNC,warnMessage,"Info");
				return true;	
			}
		}else{
			return true;
		}
	}
	
	/**
	 * checks for facility is fully drawn with pending loans in update mode
	 * 
	 */
	
	function checkCommitmentLimitInEditMode(limitAmount){
		
		var totalOutstandingAmt = _getTotalRepricingAmountForCommitmenValidation();
		var differAmount=0;
		
		var lnAmt=dijit.byId("ln_amt").get("value");
		var currency = dijit.byId("ln_cur_code");
		var oldLoanAmount=dj.byId('dummy_ln_amt').get('value');
		oldLoanAmount =  oldLoanAmount.split(',').join('');
		var totalAmount;
		var cldrMonetary = d.cldr.monetary.getData(currency.get("value"));
		if(oldLoanAmount>lnAmt){
			
			differAmount=parseFloat(oldLoanAmount) - parseFloat(lnAmt);
			 totalAmount=parseFloat(totalOutstandingAmt) - parseFloat(differAmount);
		}
		else{
			differAmount=parseFloat(lnAmt) - parseFloat(oldLoanAmount);
			 totalAmount=parseFloat(totalOutstandingAmt) + parseFloat(differAmount);
		}
		
		var flag=false;
		var totalDummyOutstandingAmt,amountForMessage;
		
		var calOldLoanAmount=_calculateOldLoanAmountByFacilityId();
		var sumOfnewLoans = _getTotalRepricingAmountForCommitmenValidation();
		totalDummyOutstandingAmt = parseFloat(calOldLoanAmount) + limitAmount;
		totalDummyOutstandingAmt = totalDummyOutstandingAmt.toFixed(2);
		amountForMessage = (parseFloat(calOldLoanAmount) + limitAmount) - (parseFloat(sumOfnewLoans) - parseFloat(oldLoanAmount)).toFixed(2);
				
		if(parseFloat(lnAmt)>totalDummyOutstandingAmt || totalAmount>totalDummyOutstandingAmt)
		{
			//error
			flag=true;			
		}
		
		if(flag)
		{			
			var widget = dj.byId("ln_amt");
			if(amountForMessage <= 0)
			{
				widget.invalidMessage = misys.getLocalization('commitmentScheduleFullyDrawnError',[currency.get('value')]);
			}
			else
			{
				widget.invalidMessage = misys.getLocalization('commitmentScheduleAmountError',[ currency.get('value'), d.currency.format(amountForMessage, {round: cldrMonetary.round,places: cldrMonetary.places}) ]);
			}			

			return false;	
		}
		return true;
	}
	
	function _getCommitmentScheduleAmount()
	{
		   var boFacilityId =  dj.byId("bo_facility_id").get("value");
		   var repricing_date_value = dj.byId("repricing_date").get('displayedValue');
		   var fac_cur_code = window.opener.fac_cur_code;
		   var loan_currency = dijit.byId('ln_cur_code').value;
		   var loan_amount = dijit.byId('ln_amt').value;
		   var commitmentData = new Map();
		   if(!isNaN(loan_amount) && loan_amount >= 0 && repricing_date_value !== "" )
		   {
				m.xhrPost({
					url : m.getServletURL("/screen/AjaxScreen/action/ValidateAmountWithCommitmentSchedule"),
					handleAs : "json",
					preventCache : true,
					sync : true,
					content: { 
							   facilityid : boFacilityId,
							   repricing_date:repricing_date_value,
							   loanAmount:loan_amount,
							   facilityCurrency:fac_cur_code,
						       loanCurrency:loan_currency
						      },
					load : function(response, args){
						commitmentData.set("commitmentSchAmount",response.commitmentSchAmount);
						commitmentData.set("commitmentViolated",response.commitmentViolated);
						commitmentData.set("commitmentScheduled",response.commitmentScheduled);
					},
					error : function(response, args){
						console.log(" Error in validating loan amount with commitment schedule amount", response);
						return null;
					}
				});
		   }else{
			   return null;
		   }
		   return commitmentData;
	}
	
	/**
	 * check for risk type limit,if exceeds the limit amount then display a error msg.
	 * @method _checkRiskTypeLimitAmount
	 */
	
	function _checkRiskTypeLimitAmount(){
		
		if(window.editMode === true)
		{
		
			return checkTotalOfNewLoanAmountForRiskLimit();
		}
		
		var facilitySelected = dj.byId('bo_facility_id').get('value');
		var loanAmount = dj.byId('ln_amt').get('value');
		var currency = dijit.byId('ln_cur_code');
		
		//get the amount of loans which are selected for repricing for mulitple facilies.
		
		var oldLoanAmount=_calculateOldLoanAmountByFacilityId();
		
	    var store= window.opener.riskTypeLimitStore;
		var flag=false;
		var riskTypeLimit;
		var riskTypeLimitAmt;
		var cldrMonetary = d.cldr.monetary.getData(currency.get("value"));
		store.fetch({
			query: {id: facilitySelected},
			onComplete: d.hitch(dj.byId('bo_facility_id'), function(items, request){
				var item = items[0];
				if(item)
				{
					riskTypeLimit = item.riskTypeLimitAmount[0];
					var dummyRiskAmount=''+item.dummyRiskTypeLimitAmount[0];	
					var modifiedLoanAmount=parseFloat(dummyRiskAmount.split(',').join(''))+parseFloat(oldLoanAmount);
					riskTypeLimitAmt=modifiedLoanAmount.toFixed(2);
				   if(parseFloat(loanAmount)>(modifiedLoanAmount.toFixed(2)))
					{
						flag=true;
					}
				}
			})
		});	
	
			if(flag)
			{				
				var validationFlag= window.opener.limitValidationFlag;
				if(validationFlag!=="error")
				{
					var warnMessage;
					if(riskTypeLimitAmt>0)
			 		{
						warnMessage =  misys.getLocalization('loanRiskTypeLimtAmtExceeded',[ currency.get('value'), d.currency.format(riskTypeLimitAmt, {round: cldrMonetary.round,places: cldrMonetary.places}) ]);

			 		}
			 		else
			 		{
			 			warnMessage =  misys.getLocalization('noAmountForRiskLimitError');

			 		}	
					m.dialog.show(CNC,warnMessage,"Info");	
					return true;
				}
				else
				{
					
					var widget = dj.byId("ln_amt");			    
					
			 		if(riskTypeLimitAmt>0)
			 		{		 			
			 			widget.invalidMessage = misys.getLocalization('loanRiskTypeLimtAmtExceeded',[ currency.get('value'), d.currency.format(riskTypeLimitAmt, {round: cldrMonetary.round,places: cldrMonetary.places}) ]);

			 		}
			 		else
			 		{
			 			widget.invalidMessage =misys.getLocalization('noAmountForRiskLimitError');

			 			
			 		}
				}
				 return  false;	
			}
		return true;
	}
	
	/**
	 * check for borrower type limit,if exceeds the limit amount then display a error msg.
	 * @method _checkBorrowerTypeLimitAmount
	 */
	
	function _checkBorrowerTypeLimitAmount(){
		if(window.editMode === true)
		{
		
			return checkTotalOfNewLoanAmountForBorrowerLimit();
		}
		
		var facilitySelected = dj.byId('bo_facility_id').get('value');
		var loanAmount = dj.byId('ln_amt').get('value');
		var currency = dijit.byId('ln_cur_code');
	    var store= window.opener.borrowerTypeLimitStore;
		var borrowerTypeLimitAmount;
		var borrowerTypeLimit;
		var flag=false;
		var cldrMonetary = d.cldr.monetary.getData(currency.get("value"));
		store.fetch({
			query: {id: facilitySelected},
			onComplete: d.hitch(dj.byId('bo_facility_id'), function(items, request){
				var item = items[0];
				if(item)
				{
					var oldLoanAmount=_calculateOldLoanAmountByFacilityId();
					borrowerTypeLimitAmount = item.dummyBorrowerTypeLimitAmount[0];
					var modifiedcurrencyLimitAmount;
					if(typeof borrowerTypeLimitAmount === 'string' || borrowerTypeLimitAmount instanceof String)
					{
						modifiedcurrencyLimitAmount=item.dummyBorrowerTypeLimitAmount[0].split(',').join('');
					}
					else
					{
						modifiedcurrencyLimitAmount=item.dummyBorrowerTypeLimitAmount[0];
					}
				    var totalDummyOutstandingAmt = parseFloat(oldLoanAmount) + parseFloat(modifiedcurrencyLimitAmount);
				    borrowerTypeLimit=totalDummyOutstandingAmt.toFixed(2);
					if(parseFloat(loanAmount)>(totalDummyOutstandingAmt.toFixed(2)))
					{
						//error
					    flag=true;			
					}
				}
				
			})
		});	
	
			if(flag)
			{			
				//check the flag for error/WARNING msg--
				var validationFlag= window.opener.limitValidationFlag;
				if(validationFlag==="error")
				{
					var widget = dj.byId("ln_amt");
				    
					
			 		if(borrowerTypeLimit>0)
			 		{
			 			widget.invalidMessage =  misys.getLocalization('loanBorrowerTypeLimtAmtExceeded', [currency.get('value'), d.currency.format(borrowerTypeLimit, {round: cldrMonetary.round,places: cldrMonetary.places})]);

			 		}
			 		else
			 		{
			 			widget.invalidMessage =  misys.getLocalization('noAmountForBorrowerLimitError');
			 		}
			 		
					return false;	
				}
				else
				{
					var warnMessage;
					if(borrowerTypeLimit>0)
			 		{
						warnMessage =  misys.getLocalization('loanBorrowerTypeLimtAmtExceeded', [currency.get('value'), d.currency.format(borrowerTypeLimit, {round: cldrMonetary.round,places: cldrMonetary.places})]);


			 		}
			 		else
			 		{
			 			warnMessage =  misys.getLocalization('noAmountForBorrowerLimitError');

			 		}
			 		
					
					m.dialog.show(CNC,warnMessage,"Info");
					return true;
					
			  }
			}
			return true;
	}
	
	
	/**
	 * check for currency type limit,if exceeds the limit amount then display a error msg.
	 * @method _checkCurrencyTypeLimitAmount
	 */
	
	function _checkCurrencyTypeLimitAmount(){
    
		if(window.editMode === true)
		{
			//_updateDummyLimitAmount();
			return checkTotalOfNewLoanAmountForCurrencyLimit();
		}
		var facilitySelected = dj.byId('bo_facility_id').get('value');
		var loanAmount = dj.byId('ln_amt').get('value');
		var currency = dijit.byId("ln_cur_code");
	    var store= window.opener.currencyTypeLimitStore;
	    var currencyLimitAmount;
	    var currencyLimit;
		var flag=false;
		var cldrMonetary = d.cldr.monetary.getData(currency.get("value"));
		store.fetch({
			query: {id: facilitySelected},
			onComplete: d.hitch(dj.byId('bo_facility_id'), function(items, request){
				var item = items[0];	
				if(item)
				{
					
					
					var oldLoanAmount=_calculateOldLoanAmountByFacilityId();
					currencyLimitAmount=item.dummyCurrencyLimitAmount[0];
				   
					var modifiedcurrencyLimitAmount;
					if(typeof currencyLimitAmount === 'string' || currencyLimitAmount instanceof String)
					{
						modifiedcurrencyLimitAmount=item.dummyCurrencyLimitAmount[0].split(',').join('');
					}
					else
					{
						modifiedcurrencyLimitAmount=item.dummyCurrencyLimitAmount[0];
					}
					
					 var totalDummyOutstandingAmt = parseFloat(oldLoanAmount) + parseFloat(modifiedcurrencyLimitAmount);
					 currencyLimit=totalDummyOutstandingAmt.toFixed(2);
				    if(parseFloat(loanAmount)>(totalDummyOutstandingAmt.toFixed(2)))
					{
						flag=true;			
						
					}
				}
			})
		});	
	
			if(flag)
			{			
				//check the flag for error/WARNING msg--
				var validationFlag= window.opener.limitValidationFlag;
				var currencyValue=dj.byId('ln_cur_code').get("value");
				if(validationFlag==="error")
				{
					var widget = dj.byId("ln_amt");
				 
			 		if(currencyLimit>0)
			 		{
			 			widget.invalidMessage =  misys.getLocalization('loanCurrencyTypeLimtAmtExceeded',[ currency.get('value'), d.currency.format(currencyLimit, {round: cldrMonetary.round,places: cldrMonetary.places}) ]);

			 		}
			 		else
			 		{
			 			widget.invalidMessage =  misys.getLocalization('noAmountForCurrencyLimitError',[currencyValue]);

			 			
			 		}
					return false;	
				}
				else
				{
					var warnMessage;
					if(currencyLimit>0)
			 		{
						warnMessage =  misys.getLocalization('loanCurrencyTypeLimtAmtExceeded',[ currency.get('value'), d.currency.format(currencyLimit, {round: cldrMonetary.round,places: cldrMonetary.places}) ]);


			 		}
			 		else
			 		{
			 			warnMessage =  misys.getLocalization('noAmountForCurrencyLimitError',[currencyValue]);

			 		}
			 		
					
					m.dialog.show(CNC,warnMessage,"Info");
					return true;	
				}
				
			}
			return true;
	}
	
	
	/**
	 * checks for currency Limit is fully drawn in update mode
	 */
	function checkTotalOfNewLoanAmountForCurrencyLimit(){
		var facilitySelected = dj.byId('bo_facility_id').get('value');
		var newRepricingLoanGrid = window.opener.newLoanGrid;
		var totalOutstandingAmt=0;
		var differAmount=0;
		var newLoanAmt;
		var currencyLimitAmount;
			if(newRepricingLoanGrid && newRepricingLoanGrid.store)
			{
				newRepricingLoanGrid.store.fetch({
					query: {new_loan_ref_id: '*'},
					onComplete: dojo.hitch(this, function(items, request){ 
						dojo.forEach(items, function(item){

							if(facilitySelected == item.new_loan_facility_id)
							{
								var newLoanAmt=''+item.new_loan_outstanding_amt[0];
								totalOutstandingAmt = parseFloat(totalOutstandingAmt) + parseFloat(newLoanAmt.split(',').join(''));
								totalOutstandingAmt=totalOutstandingAmt.toFixed(2);
							}
						}, this);
					})
				});
			}
			
		
		var lnAmt=dijit.byId("ln_amt").get("value");
		var currency = dijit.byId("ln_cur_code");
		var oldLoanAmount=0;
		var cldrMonetary = d.cldr.monetary.getData(currency.get("value"));
		if (misys._config.facilityId=== facilitySelected)
		{
			oldLoanAmount=dj.byId('dummy_ln_amt').get('value');
			if(typeof oldLoanAmount === 'string' || oldLoanAmount instanceof String)
			{
				oldLoanAmount=oldLoanAmount.split(',').join('');
			}
			
		}
		var totalAmount;
		if(oldLoanAmount>lnAmt){
			
			differAmount=parseFloat(oldLoanAmount) - parseFloat(lnAmt);
			 totalAmount=parseFloat(totalOutstandingAmt) - parseFloat(differAmount);
		}
		else{
			differAmount=parseFloat(lnAmt) - parseFloat(oldLoanAmount);
			 totalAmount=parseFloat(totalOutstandingAmt) + parseFloat(differAmount);
		}
	//	var totalAmount=parseFloat(totalOutstandingAmt) + parseFloat(differAmount);
		var store= window.opener.currencyTypeLimitStore;
		var flag=false;
		store.fetch({
			query: {id: facilitySelected},
			onComplete: d.hitch(dj.byId('bo_facility_id'), function(items, request){
				var item = items[0];	
				if(item)
				{
					var repricedOldLoanAmount=_calculateOldLoanAmountByFacilityId();
					 var totalDummyOutstandingAmt = parseFloat(repricedOldLoanAmount) + parseFloat(item.currencyLimitAmount[0].split(',').join(''));
					 currencyLimitAmount=totalDummyOutstandingAmt.toFixed(2) -(totalOutstandingAmt-parseFloat(oldLoanAmount));
					if(parseFloat(lnAmt)>totalDummyOutstandingAmt.toFixed(2) || totalAmount>totalDummyOutstandingAmt.toFixed(2))
					{
						//error
						flag=true;			
					}
				}
			})
		});	
		
		if(flag)
		{			
			var validationFlag= window.opener.limitValidationFlag;
			var currencyValue=dj.byId('ln_cur_code').get("value");
			if(validationFlag==="error")
			{
				var widget = dj.byId("ln_amt");
			
		 		if(currencyLimitAmount>0)
		 		{
		 			widget.invalidMessage =  misys.getLocalization('loanCurrencyTypeLimtAmtExceeded',[ currency.get('value'), d.currency.format(currencyLimitAmount, {round: cldrMonetary.round,places: cldrMonetary.places}) ]);

		 		}
		 		else
		 		{
		 			
		 			widget.invalidMessage = misys.getLocalization('noAmountForCurrencyLimitError',[currencyValue]);

		 			
		 		}
		 	
				return false;	
			}
			else
			{
				var warnMessage;
				if(currencyLimitAmount>0)
		 		{
					warnMessage =  misys.getLocalization('loanCurrencyTypeLimtAmtExceeded',[ currency.get('value'), d.currency.format(currencyLimit, {round: cldrMonetary.round,places: cldrMonetary.places}) ]);


		 		}
		 		else
		 		{
		 			warnMessage =  misys.getLocalization('noAmountForCurrencyLimitError',[currencyValue]);

		 		}
		 		
				
				m.dialog.show(CNC,warnMessage,"Info");
				return true;
			}	
		}
		return true;
	}
	
	
	/**
	 * checks for Borrower Limit is fully drawn in update mode
	 */
	function checkTotalOfNewLoanAmountForBorrowerLimit(){
		var facilitySelected = dj.byId('bo_facility_id').get('value');
		var newRepricingLoanGrid = window.opener.newLoanGrid;
		var totalOutstandingAmt=0;
		var differAmount=0;
		var newLoanAmt;
		var borrowerTypeLimit;
			if(newRepricingLoanGrid && newRepricingLoanGrid.store)
			{
				newRepricingLoanGrid.store.fetch({
					query: {new_loan_ref_id: '*'},
					onComplete: dojo.hitch(this, function(items, request){ 
						dojo.forEach(items, function(item){
							if(facilitySelected == item.new_loan_facility_id)
							{
								var newLoanAmt=''+item.new_loan_outstanding_amt[0];
								totalOutstandingAmt = parseFloat(totalOutstandingAmt) + parseFloat(newLoanAmt.split(',').join(''));
							}
						}, this);
					})
				});
			}
			
		
		var lnAmt=dijit.byId("ln_amt").get("value");
		var currency = dijit.byId("ln_cur_code");
		var cldrMonetary = d.cldr.monetary.getData(currency.get("value"));
		var oldLoanAmount=0;
		if (misys._config.facilityId=== facilitySelected)
		{
			oldLoanAmount=dj.byId('dummy_ln_amt').get('value');
			if(typeof oldLoanAmount === 'string' || oldLoanAmount instanceof String)
			{
				oldLoanAmount=oldLoanAmount.split(',').join('');
			}
			
		}
		var totalAmount;
		if(oldLoanAmount>lnAmt){
			
			differAmount=parseFloat(oldLoanAmount) - parseFloat(lnAmt);
			 totalAmount=parseFloat(totalOutstandingAmt) - parseFloat(differAmount);
			
		}
		else{
			differAmount=parseFloat(lnAmt) - parseFloat(oldLoanAmount);
			 totalAmount=parseFloat(totalOutstandingAmt) + parseFloat(differAmount);
		}
		//var totalAmount=parseFloat(totalOutstandingAmt) + parseFloat(differAmount);
		var store= window.opener.borrowerTypeLimitStore;
		var flag=false;
		store.fetch({
			query: {id: facilitySelected},
			onComplete: d.hitch(dj.byId('bo_facility_id'), function(items, request){
				var item = items[0];	
				if(item)
				{
					var oldLoanGridAmount=_calculateOldLoanAmountByFacilityId();
					var borrowerTypeLimitAmount =item.borrowerTypeLimitAmount[0];
					var modifiedcurrencyLimitAmount;
					if(typeof borrowerTypeLimitAmount === 'string' || borrowerTypeLimitAmount instanceof String)
					{
						modifiedcurrencyLimitAmount=item.borrowerTypeLimitAmount[0].split(',').join('');
					}
					else
					{
						modifiedcurrencyLimitAmount=item.borrowerTypeLimitAmount[0];
					}
				    var totalDummyOutstandingAmt = parseFloat(oldLoanGridAmount) + parseFloat(modifiedcurrencyLimitAmount);
				    borrowerTypeLimit=totalDummyOutstandingAmt.toFixed(2) -(totalOutstandingAmt-parseFloat(oldLoanAmount));
				    if(parseFloat(lnAmt)>totalDummyOutstandingAmt.toFixed(2) || totalAmount>totalDummyOutstandingAmt.toFixed(2))
					{
						//error
						flag=true;			
					}
				}
			})
		});	
		
		if(flag)
		{			
			var validationFlag= window.opener.limitValidationFlag;
			if(validationFlag==="error")
			{
				var widget = dj.byId("ln_amt");
			 
		 		if(borrowerTypeLimit>0)
		 		{
		 			widget.invalidMessage = misys.getLocalization('loanBorrowerTypeLimtAmtExceeded', [currency.get('value'), d.currency.format(borrowerTypeLimit, {round: cldrMonetary.round,places: cldrMonetary.places})]);

		 		}
		 		else
		 		{
		 			widget.invalidMessage =misys.getLocalization('noAmountForBorrowerLimitError');

		 		}
				return false;	
			}
			else
			{
				var warnMessage;
				if(borrowerTypeLimit>0)
		 		{
					warnMessage =  misys.getLocalization('loanBorrowerTypeLimtAmtExceeded', [currency.get('value'), d.currency.format(borrowerTypeLimit, {round: cldrMonetary.round,places: cldrMonetary.places})]);

		 		}
		 		else
		 		{
		 			warnMessage =  misys.getLocalization('noAmountForBorrowerLimitError');
		 		}	 		
				
				m.dialog.show(CNC,warnMessage,"Info");
				return true;
			}	
		}
		return true;
	}
	
	
	/**
	 * checks for Risk Limit is fully drawn in update mode
	 */
	function checkTotalOfNewLoanAmountForRiskLimit(){
		var facilitySelected = dj.byId('bo_facility_id').get('value');
		var newRepricingLoanGrid = window.opener.newLoanGrid;
		var totalOutstandingAmt=0;
		var differAmount=0;
		var riskTypeLimit;
		var newLoanAmt;
			if(newRepricingLoanGrid && newRepricingLoanGrid.store)
			{
				newRepricingLoanGrid.store.fetch({
					query: {new_loan_ref_id: '*'},
					onComplete: dojo.hitch(this, function(items, request){ 
						dojo.forEach(items, function(item){
							if(facilitySelected == item.new_loan_facility_id)
							{
								var newLoanAmt=''+item.new_loan_outstanding_amt[0];
								totalOutstandingAmt = parseFloat(totalOutstandingAmt) + parseFloat(newLoanAmt.split(',').join(''));
							}
						}, this);
					})
				});
			}
			
		
		var lnAmt=dijit.byId("ln_amt").get("value");
		var currency = dijit.byId("ln_cur_code");
		var oldLoanAmount=0;
		var cldrMonetary = d.cldr.monetary.getData(currency.get("value"));
		if (misys._config.facilityId=== facilitySelected)
		{
			oldLoanAmount=dj.byId('dummy_ln_amt').get('value');
			if(typeof oldLoanAmount === 'string' || oldLoanAmount instanceof String)
			{
				oldLoanAmount=oldLoanAmount.split(',').join('');
			}
			
		}
		var totalAmount;
		if(oldLoanAmount>lnAmt){
			
			differAmount=parseFloat(oldLoanAmount) - parseFloat(lnAmt);
			 totalAmount=parseFloat(totalOutstandingAmt) - parseFloat(differAmount);
		}
		else{
			differAmount=parseFloat(lnAmt) - parseFloat(oldLoanAmount);
			 totalAmount=parseFloat(totalOutstandingAmt) + parseFloat(differAmount);
		}
		//var totalAmount=parseFloat(totalOutstandingAmt) + parseFloat(differAmount);
		var oldGridLoanAmount=_calculateOldLoanAmountByFacilityId();
		var store= window.opener.riskTypeLimitStore;
		var flag=false;
		store.fetch({
			query: {id: facilitySelected},
			onComplete: d.hitch(dj.byId('bo_facility_id'), function(items, request){
				var item = items[0];	
				if(item)
				{
					var riskTypeLimitAmount=''+item.riskTypeLimitAmount[0];
					var modifiedLoanAmount=parseFloat(riskTypeLimitAmount.split(',').join(''))+parseFloat(oldGridLoanAmount);
					riskTypeLimit=modifiedLoanAmount.toFixed(2) -(totalOutstandingAmt-parseFloat(oldLoanAmount));
					if(parseFloat(lnAmt)>modifiedLoanAmount.toFixed(2) || totalAmount>modifiedLoanAmount.toFixed(2))
					{
						//error
						flag=true;			
					}
				}
			})
		});	
		
		if(flag)
		{			
			var validationFlag= window.opener.limitValidationFlag;
			if(validationFlag==="error")
			{
				var widget = dj.byId("ln_amt");
			  
		 		if(riskTypeLimit>0)
		 		{
		 			widget.invalidMessage = misys.getLocalization('loanRiskTypeLimtAmtExceeded',[ currency.get('value'), d.currency.format(riskTypeLimit, {round: cldrMonetary.round,places: cldrMonetary.places}) ]);

		 		}
		 		else
		 		{
		 			widget.invalidMessage =misys.getLocalization('noAmountForRiskLimitError');

		 			
		 		}
				return false;	
			}
			else
			{
				var warnMessage;
				if(riskTypeLimitAmt>0)
		 		{
					warnMessage =  misys.getLocalization('loanRiskTypeLimtAmtExceeded',[ currency.get('value'), d.currency.format(riskTypeLimitAmt, {round: cldrMonetary.round,places: cldrMonetary.places}) ]);

		 		}
		 		else
		 		{
		 			warnMessage =  misys.getLocalization('noAmountForRiskLimitError');

		 		}	
				m.dialog.show(CNC,warnMessage,"Info");	
				return true;	
			}	
		}
		return true;
	}
	
	/**
	 * checks for facility is fully drawn in update mode
	 */
	function checkTotalOfNewLoanAmountForFacilityFullyDrawn(){
		var facilitySelected = dj.byId('bo_facility_id').get('value');
		var newRepricingLoanGrid = window.opener.newLoanGrid;
		var totalOutstandingAmt=0;
		var differAmount=0;
		var newLoanAmt;
			if(newRepricingLoanGrid && newRepricingLoanGrid.store)
			{
				newRepricingLoanGrid.store.fetch({
					query: {new_loan_ref_id: '*'},
					onComplete: dojo.hitch(this, function(items, request){ 
						dojo.forEach(items, function(item){
							if(facilitySelected == item.new_loan_facility_id)
							{
									var newLoanAmt=''+item.new_loan_outstanding_amt[0];
									totalOutstandingAmt = parseFloat(totalOutstandingAmt) + parseFloat(newLoanAmt.split(',').join(''));
							}
						}, this);
					})
				});
			}
			
		
		var lnAmt=dijit.byId("ln_amt").get("value");
		var currency = dijit.byId("ln_cur_code");
		var oldLoanAmount=dj.byId('dummy_ln_amt').get('value');
		if(typeof oldLoanAmount === 'string' || oldLoanAmount instanceof String)
		{
			oldLoanAmount=oldLoanAmount.split(',').join('');
		}
		
		var totalAmount;
		var cldrMonetary = d.cldr.monetary.getData(currency.get("value"));
		if(oldLoanAmount>lnAmt){
			
			differAmount=parseFloat(oldLoanAmount) - parseFloat(lnAmt);
			 totalAmount=parseFloat(totalOutstandingAmt) - parseFloat(differAmount);
		}
		else{
			differAmount=parseFloat(lnAmt) - parseFloat(oldLoanAmount);
			 totalAmount=parseFloat(totalOutstandingAmt) + parseFloat(differAmount);
		}
		
		// totalAmount=parseFloat(totalOutstandingAmt) + parseFloat(differAmount);
		var store= window.opener.facilityAvailableAmountStore;
		var flag=false;
		var totalDummyOutstandingAmt;
		store.fetch({
			query: {id: facilitySelected},
			onComplete: d.hitch(dj.byId('bo_facility_id'), function(items, request){
				var item = items[0];	
				if(item)
				{
				   if(facilitySelected == item.new_loan_facility_id)
					{
						var oldLoanAmount=_calculateOldLoanAmountByFacilityId();
						var dummyAmount=''+item.borrowerAvailableLimitAmount[0];
						totalDummyOutstandingAmt = parseFloat(oldLoanAmount) + parseFloat(dummyAmount.split(',').join(''));
						totalDummyOutstandingAmt = totalDummyOutstandingAmt.toFixed(2);
					}
					if(parseFloat(lnAmt)>totalDummyOutstandingAmt || totalAmount>totalDummyOutstandingAmt)
					{
						//error
						flag=true;			
					}
				}
			})
		});	
		
		if(flag)
		{			
			var widget = dj.byId("ln_amt");
			widget.invalidMessage = misys.getLocalization('loanIncreaseFacilityAvailableAmountError',[ currency.get('value'), d.currency.format(totalDummyOutstandingAmt, {round: cldrMonetary.round,places: cldrMonetary.places}) ]);

			return false;	
		}
		return true;
	}
	
	
	
	/**
	 * This method check the old loan grid conatins any Expired Facility or not ,if Yes then checks
	 * restrict loan increase based on some validations.
	 * return boolean
	 * @method _validateLoanAmountForExpiredFacility
	 */
	
	function _validateLoanAmountForExpiredFacility(){
		
		if(!_checkNewLoanForExpiredFacility()){
				var widget = dj.byId("ln_amt");
				var boFacilityId = dj.byId("bo_facility_id");
				
				var expiredFacilityId=new Array();
				var index=0;
				var modifiedNewLoanAmount;
				var modifiedNewLoanAmount1;
				window.opener.facilitiesStore.fetch({
					query: {id: '*'},
					onComplete: d.hitch(this, function(items, request){
					dojo.forEach(items, function(item){	
							var status=item.status;
							if(status[0]==="Expired"){
								expiredFacilityId[index]=item.id[0];
								 index=index+1;
							}
						}, this);
					})
				});		
				
				var repricingOldLoanGrid = window.opener.oldLoanGrid;
				var expriedFacilityLoanAmount=0;
				if(repricingOldLoanGrid && repricingOldLoanGrid.store)
				{
					repricingOldLoanGrid.store.fetch({
						query: {loan_ref_id:'*'},
						onComplete: dojo.hitch(this, function(items, request){ 
							dojo.forEach(items, function(item){			
								var facilityId=''+item.loan_facility_id;
									if(expiredFacilityId.indexOf(facilityId)>-1 && boFacilityId.get("value")===facilityId)
									{
										var newloanOutstanding=item.loan_current_amt[0];
										if(typeof newloanOutstanding === 'string' || newloanOutstanding instanceof String)
										{
											modifiedNewLoanAmount=item.loan_current_amt[0].split(',').join('');
										}
										else
										{
											modifiedNewLoanAmount=item.loan_current_amt[0];
										}
										 expriedFacilityLoanAmount=parseFloat(expriedFacilityLoanAmount)+parseFloat(modifiedNewLoanAmount);
										
									}
							}, this);
						})
					});
				}
				
				var repricingNewLoanGrid = window.opener.newLoanGrid;
				var expriedFacilityNewLoanAmount=0;
				var refId = dijit.byId('ref_id').get('value');
				if(repricingNewLoanGrid && repricingNewLoanGrid.store)
				{
					repricingNewLoanGrid.store.fetch({
						query: {new_loan_ref_id:'*'},
						onComplete: dojo.hitch(this, function(items, request){ 
							dojo.forEach(items, function(item){		
								if(refId!==item.new_loan_ref_id[0]){
									var facilityId=''+item.new_loan_facility_id;
									if(expiredFacilityId.indexOf(facilityId)>-1 && boFacilityId.get("value")===facilityId)
									{
										
										var newloanOutstanding=item.new_loan_outstanding_amt[0];
										if(typeof newloanOutstanding === 'string' || newloanOutstanding instanceof String)
										{
											modifiedNewLoanAmount1=item.new_loan_outstanding_amt[0].split(',').join('');
										}
										else
										{
											modifiedNewLoanAmount1=item.new_loan_outstanding_amt[0];
										}
										expriedFacilityNewLoanAmount=parseFloat(expriedFacilityNewLoanAmount)+parseFloat(modifiedNewLoanAmount1);
										
									}
								}
							}, this);
						})
					});
				}
				
				console.log("expriedFacilityLoanAmount"+expriedFacilityLoanAmount);
				console.log("expriedFacilityNewLoanAmount"+expriedFacilityNewLoanAmount);
				
				
				if(expriedFacilityLoanAmount>0){	
					
					var remainingAmount=parseFloat(expriedFacilityLoanAmount)-parseFloat(expriedFacilityNewLoanAmount);
					
					if(widget.get("value")> remainingAmount){
						var invalidMessage = misys.getLocalization('loanIncreaseOnExpiredFacilityError');					
						m.dialog.show('ERROR',invalidMessage);
						return false;
					}
					
					return true;
				}
				else{			
					return true;
				}
		}
		return true;
	}

	
	/**
	 * The Total new repricing loan amount should not exceed the 
	 * @method _validateRepricingLoanAmount
	 */
	function _validateRepricingLoanAmount(){		
		

		var repricingLnAmt=dijit.byId('ln_amt');
		var refId=dijit.byId('ref_id').get('value');
		
		if(repricingLnAmt.get('value') == null){
			return true;
		}
		var newLoanAmt=repricingLnAmt.get('value');
		
		if(!parseFloat(newLoanAmt)>0){
			var invalidMessage2 = misys.getLocalization('loanAmountZeroError');	
			
			m.dialog.show('ERROR',invalidMessage2);
			return false;			
		}		
		var totalRepricingLoanAmt=window.opener.totalRepricingLoanAmt;
		var totalNewRepricingLoanAmt=window.opener.totalNewRepricingLoanAmt;	
		var newRepricingLoanGrid = window.opener.newLoanGrid;
		 // checks the loan increase is enable or not,if enabled then allow the user to add the loan increase 
		var loanIncreaseFlag = window.opener.loanIncreaseFlag;
		
		var totalOutstandingAmt = 0;
		
		//exclude the old loan amount from the total new repricing amount at the time loan edit
		if(newRepricingLoanGrid && newRepricingLoanGrid.store)
		{
			newRepricingLoanGrid.store.fetch({
				query: {new_loan_ref_id:refId},
				onComplete: dojo.hitch(this, function(items, request){ 
					dojo.forEach(items, function(item){			
						var newLoanAmt=''+item.new_loan_outstanding_amt[0];
						totalNewRepricingLoanAmt=parseFloat(totalNewRepricingLoanAmt.toFixed(2))-parseFloat(newLoanAmt.split(',').join(''));
					}, this);
				})
			});
		}
		
			if((parseFloat(newLoanAmt) + parseFloat(totalNewRepricingLoanAmt))>parseFloat(totalRepricingLoanAmt)){	
				
				if(loanIncreaseFlag === "false"){
					
					var errorMessage = misys.getLocalization('loanRepricingAmountError');	
					m.dialog.show('ERROR',errorMessage);
					return false;		
				}
				else{
					var onOkCallback = function(){
						//_updateFacilityAvailablAmount();
					//	var valid=fncValidateNewRepricingLoanPopup1();
					//	if(valid){
							if(window.editMode === true){
								updateNewLoanItem();
							}else{
								addNewLoanItem();
							}
								window.close ();
					//	}	
          
					};
						m.dialog.show("CONFIRMATION", misys.getLocalization('loanIncreaseRepricingAmountError', " "),
								"", null, null, "", onOkCallback);
					
					 return  false;					
				}
			}
			return true;

	}
	
	/*
	 * This method validates the past dates for repricing date field wr.t effective date.
	 * @method checkPastDateOfCalenderForRepricingDate
	 */
	function checkPastDateOfCalenderForRepricingDate(){
		
		var selectedDate= dijit.byId('repricing_date').get("value");
		var selectedEffectiveDate= dijit.byId('effective_date').get("value");
		if(selectedDate>=selectedEffectiveDate){	
			return true;
		}
		else{
			return false;
		}
	}

	/**
	 * Validate the data entered as the Repricing Date.
	 * 
	 * @method _validateLoanRepricingDate
	 */
	function _validateLoanRepricingDate(){
		//  summary:
		//        Validates the data entered as the Repricing Date.
		//  tags:
		//         public, validation
		var rePricingDate = dijit.byId('repricing_date');
		var invalidMessage;
		// This validation is for non-required fields
		if(rePricingDate.get('value') == null){
			return true;
		}

		console.debug('[Validate] Validating Loan Repricing Date. Value = ' + rePricingDate.get('value'));


		// Test that the loan Repricing date is greater than or equal to the loan effective date
		var loanEffDate = dijit.byId('effective_date');
		

		if(!m.compareDateFields(loanEffDate, rePricingDate))
		{
			 invalidMessage = misys.getLocalization('loanRepricingDateGreaterThanLoanEffDateError', [
			                                                                                             m.getLocalizeDisplayDate(rePricingDate),
			                                                                                             m.getLocalizeDisplayDate(loanEffDate)]);
			m.dialog.show('ERROR',invalidMessage);
			return false;
		}

		// Test that the loan Repricing date is less than or equal to the loan maturity date
		var lnMatDate = dijit.byId('ln_maturity_date');
		if(!m.compareDateFields(rePricingDate, lnMatDate))
		{
			 invalidMessage = misys.getLocalization('loanRepricingDateLessThanLoanMatDateError', [
			                                                                                          m.getLocalizeDisplayDate(rePricingDate),
			                                                                                          m.getLocalizeDisplayDate(lnMatDate)]);
			m.dialog.show('ERROR',invalidMessage);
			return false;
		}

		var facMatDate = dijit.byId('facility_maturity_date');
		if(!m.compareDateFields(rePricingDate, facMatDate))
		{
			invalidMessage = misys.getLocalization('loanRepricingDateLessThanFacMatDateError', [
			                                                                                         m.getLocalizeDisplayDate(rePricingDate),
			                                                                                         m.getLocalizeDisplayDate(facMatDate)]);
			m.dialog.show('ERROR',invalidMessage);
			return false;
		}

		return true;
	}
	

	// Public functions & variables follow
	d.mixin(m,
			{
		/**
		 * <h4>Summary:</h4>
		 *  	
		 *  	Events or Actions that has to be `Connected and/or Binded Only` for the Document Tracking creation screen.
		 *   
		 * @method bind
		 * @override
		 **/
		bind : function()
		{
			misys.setValidation('ln_maturity_date', _validateLoanMaturityDate);
//			misys.setValidation('repricing_frequency', _validateLoanRepricingDate);
     	//	misys.setValidation('ln_amt', _validateZeroRepricingLoanAmount);
			m.connect('ln_amt','onBlur',_validateLimitsForRepricing);
     	//misys.setValidation('ln_amt', _checkRiskTypeLimitAmount);		
			misys.setValidation('effective_date', _validateLoanEffectiveDate);			
			m.connect('bo_facility_id','onChange', _updateFacilityDependentFields);
			misys.connect('pricing_option', 'onChange', _populateRepricingFrequency);
			misys.connect('pricing_option', 'onChange', _updatePricingOptionDependentFields);
			m.connect('repricing_frequency','onChange', _calculateRepricingDate);		
			m.connect('effective_date','onChange', _setRepricingDate);
	       
	       //	m.connect('repricing_date','onChange',_setRepricingDateAsPerTheBusinessDayRule);
	       	m.connect('repricing_date','onChange', function(){
            	if(misys._config.isReprcingDateFlag && checkPastDateOfCalenderForRepricingDate()){            		
            		_setRepricingDateAsPerTheBusinessDayRule();	            		
            	}else{
            	misys._config.isReprcingDateFlag=true;
            	}
            	
            	if(dijit.byId('repricingdate_validation').value == 'true'){
            		if(_validateLimitsForRepricing()){
            			dijit.byId('ln_amt').set("state","");
            		}
            	}
        });
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
	
			var facilityOptions = dijit.byId('bo_facility_id');
			var pricingOption=dj.byId('pricing_option');
			var riskType=dj.byId('risk_type');
			riskType.set('disabled', true);
			var repricingFrequencyId=dj.byId('repricing_frequency');
			facilityOptions.set('store', window.opener.facilitiesStore);
			
			var currencyField=dj.byId('ln_cur_code');
			currencyField.set('value', window.opener.loan_currency);
			currencyField.set('disabled', true);
			
			if(dijit.byId("ln_cur_code")){
				misys.setCurrency(dijit.byId("ln_cur_code"), ["ln_amt"]);
			}
			
			resetRepricingFields();
			disableRepricingFields();		

			var effectiveDate=dj.byId('effective_date');
			effectiveDate.set('displayedValue',window.opener.earliestRepricingDate);
			effectiveDate.set('disabled', true);
			
			window.editLoanItem=null;
			window.editMode=false;
			
			if(window.opener.refId){
				var ref_id = dijit.byId('ref_id');
				ref_id.set('value', window.opener.refId);	
				var refId=window.opener.refId;
				var editPricingOptionVal;
				var editRiskTypeVal;
				var editRepricingFrequencyVal;
				
				var newLoanGrid = window.opener.newLoanGrid;
				if(newLoanGrid && newLoanGrid.store){
					
					newLoanGrid.store.fetch({
						query: {new_loan_ref_id: refId},
						onComplete: dojo.hitch(this, function(items, request){ 
							dojo.forEach(items, function(item){
								facilityOptions.set('value', item.new_loan_facility_id[0]);
								window.editLoanItem=item;
								window.editMode=true;
							}, this);
						})
					});
				}
				if(window.editMode==true){
					var editLoanItem = window.editLoanItem;
					if(editLoanItem){
						dj.byId('cust_ref_id').set('value',editLoanItem.new_loan_our_ref[0]);
						dj.byId('cust_ref_id').set('displayedValue',editLoanItem.new_loan_our_ref[0]);
					}
					
				}
				
				pricingOption.set('value', editPricingOptionVal);
				pricingOption.set('displayedValue', editPricingOptionVal);
			}else{
				var storeSize = 0;
				var sizeFunc = function (size, request){
					storeSize = size;
					};
				facilityOptions.store.fetch({query: {}, onBegin: sizeFunc, start: 0, count: 0});
				if(storeSize === 1){
					//if there is only one facility option set this as default selected in the select box
					//There will be only one facility option available all the time. Above code for checking size is to handle error scenarios
					facilityOptions.store.fetch({
						onComplete: function(items, request){ 
							var item = items[0];
							facilityOptions.set('value',item.id[0]);
						}});
				}
			}
			var fac_cur_code=window.opener.fac_cur_code;
			var ln_cur_code = window.opener.loan_currency;
			var facFXRateDiv = dojo.byId('facFXRateId');
			var fxConversionRate = window.opener.fxConversionRate;
			if(ln_cur_code !== fac_cur_code)
			{
				dijit.byId('fx_display').set('value',"1 " + fac_cur_code + " = " + fxConversionRate +" "+ln_cur_code);
				dijit.byId('fx_conversion_rate').set('value',fxConversionRate);
				dojo.style(facFXRateDiv, "display", "block");
			}
			misys._config.facilityId=dijit.byId('bo_facility_id').get('value');
		},
		

		/**
		 * <h4>Summary:</h4>
		 * 
		 *  Add Entered loan to new repriced Loan Grid
		 * 
		 * @method addNewRepriceLoan
		 * @override
		 **/	
		addNewRepriceLoan: function(){			
		
			var valid=fncValidateNewRepricingLoanPopup();
			
			if(valid){
				if(window.editMode === true){
					updateNewLoanItem();
				}else{
					addNewLoanItem();
				}
				if(false === window.closed)
			      {
					window.close ();
			      }
			}			

		},
		
		
		/**
		 * <h4>Summary:</h4>
		 * 
		 *  	
		 * 
		 * @method cancelRepriceLoan
		 * @override
		 **/
		
		cancelRepriceLoan: function(){

			if(false === window.closed)
		      {
				window.close ();
		      }
		}
	});
	
	/**
	 * Add the new loan details to the grid
	 * @method addNewLoanItem
	 */
	function addNewLoanItem(){
		
		var repriceDate = dj.byId('repricing_date').get('displayedValue');
		var maturityDate=dj.byId('ln_maturity_date').get('displayedValue');
		var effectiveDate=dj.byId('effective_date').get('displayedValue');		
		var facilitySelVal = dj.byId('bo_facility_id').get('value');
		var facilitySel = dj.byId('bo_facility_id').get('displayedValue');
		var lnAmount = dj.byId('ln_amt').get('displayedValue');
		var lnAmountVal = dj.byId('ln_amt').get('value');		
		var refId = dj.byId('ref_id').get('value');
		var tnxId = dj.byId('new_ln_tnxid').get('value');		
		var pricingOption=dj.byId('pricing_option').get('value');	
		var pricingOptionDisp=dj.byId('pricing_option').get('displayedValue');
		var riskType=dj.byId('risk_type').get('value');
		var repricingFrequencyId=dj.byId('repricing_frequency').get('value');
		var repricingFrequency=dj.byId('repricing_frequency').get('displayedValue');
		var matchFundingIndicator=dj.byId('match_funding').get('value');	
		var fcn=dj.byId('fcn').get('value');
		var cust_ref_id = dj.byId('cust_ref_id').get('value');
		var bo_deal_name=window.opener.bo_deal_name;
		var fx_conversion_rate=window.opener.fxConversionRate;
		var fac_cur_code=window.opener.fac_cur_code;
		
		var bo_deal_id= window.opener.bo_deal_id;
		var loan_currency= window.opener.loan_currency;
		var loan_borrower_reference= window.opener.loan_borrower_reference;
		var entity= window.opener.entity;

		var newLoanGrid = window.opener.newLoanGrid;
		if(newLoanGrid && newLoanGrid.store){
			newLoanGrid.store.newItem({new_loan_ref_id :refId,
				new_loan_deal_id:bo_deal_id,
				new_loan_tnx_id:tnxId,
				new_loan_deal_name:bo_deal_name,
				new_loan_entity:entity,
				new_loan_pricing_option:pricingOption,
				new_loan_risk_type:riskType,
				new_loan_effective_date:effectiveDate,
				new_loan_maturity_date:maturityDate,
				new_loan_repricing_frequency_id:repricingFrequencyId,
				new_loan_repricing_frequency:repricingFrequency, 
				new_loan_pricing_option_disp:pricingOptionDisp,
				new_loan_borrower_reference : loan_borrower_reference,
				new_loan_our_ref : cust_ref_id,
				new_loan_ccy : loan_currency,
				new_loan_outstanding_amt : lnAmountVal,
				new_loan_outstanding_amt_disp : lnAmount,
				new_loan_repricing_date : repriceDate,
				new_loan_facility_name : facilitySel,
				new_loan_fcn : fcn,
				new_loan_matchFunding:matchFundingIndicator,
				new_fx_conversion_rate:fx_conversion_rate,
				new_fac_cur_code:fac_cur_code,
				new_loan_facility_id : facilitySelVal});
		}
		
		if(newLoanGrid.store._arrayOfAllItems.length ==1){
			newLoanGrid._refresh();
			}
		_addRepricingLoansOutstandingAmt();
		_calculatePrincipalPaymentAmount();
		_checkPrincipalPaymentField();
		_updateFacilityAvailablAmount();
		_updateDummyLimitAmount();
		
		if(window.opener.loanIncreaseFlag==="true"){
		    _checkForLoanIncrease();
		  }
		if(dijit.byId('net_cashFlow').value == 'true'){
			_checkForNetCashFlow();
		}
		
	}
	
	/**
	 * This method disabled the principal payment field when the total reprice amount becomes equal the new loans amount
	 * @_checkPrincipalPaymentField
	 */
	
	function _checkPrincipalPaymentField(){
		 var totalRepricingLoanAmt=window.opener.totalRepricingAmountId.get("value");
		 var totalNewRepricingLoanAmt=window.opener.totalNewRepricingAmountId.get("value");
		 var pricipalAmountField=window.opener.totalPrincipalAmount;
		 if(totalRepricingLoanAmt===totalNewRepricingLoanAmt ||totalNewRepricingLoanAmt>totalRepricingLoanAmt){
			 var principalPaymentAmount="0.00";
			 window.opener.adjustAmuntOptions.set("disabled",true);
			 window.opener.adjustAmuntOptions.set("checked",false); 
			 pricipalAmountField.set('value', principalPaymentAmount);
		 }else{
			 window.opener.adjustAmuntOptions.set("disabled",false);
			 //pricipalAmountField.set('value', "");
			 if(window.opener.adjustAmuntOptions.get("value")===""){
				 pricipalAmountField.set('value', "");
			 }
		 }
	}
	
	/**
	 * Calculate the Total principal payment  amount
	 * 
	 * @method _calculatePrincipalPaymentAmount
	 */
	function _calculatePrincipalPaymentAmount(){
		
	if(window.opener.adjustAmuntOptions.checked === true){
		 var totalRepricingLoanAmt=window.opener.totalRepricingAmountId.get("value");
		 var totalNewRepricingLoanAmt=window.opener.totalNewRepricingAmountId.get("value");
  		 var principalPaymentAmount = parseFloat(totalRepricingLoanAmt)-parseFloat(totalNewRepricingLoanAmt);
  		 var pricipalAmountField=window.opener.totalPrincipalAmount;
		 pricipalAmountField.set('value', principalPaymentAmount);
		 
	 }
	}
	
	/**
	 * Calculate the Total Outstanding amount
	 * 
	 * @method _addRepricingLoansOutstandingAmt
	 */
	function _addRepricingLoansOutstandingAmt(){

		var totalOutstandingAmt = _calculateNewRepricingTotalOutstandingAmt();
		var newLoanAmtField=window.opener.newLoanAmtField;
		newLoanAmtField.set('value', totalOutstandingAmt);
	}
	
	/**
	 * Calculate the Total Outstanding amount
	 * @method _addRepricingLoansOutstandingAmt
	 */
	function _calculateNewRepricingTotalOutstandingAmt(){
		
		var newRepricingLoanGrid = window.opener.newLoanGrid;
		var totalOutstandingAmt = 0;
		
		if(newRepricingLoanGrid && newRepricingLoanGrid.store)
		{
			newRepricingLoanGrid.store.fetch({
				query: {new_loan_ref_id: '*'},
				onComplete: dojo.hitch(this, function(items, request){ 
					dojo.forEach(items, function(item){
						var newLoanAmt=''+item.new_loan_outstanding_amt[0];
						totalOutstandingAmt = parseFloat(totalOutstandingAmt) + parseFloat(newLoanAmt.split(',').join(''));
					}, this);
				})
			});
		}
		
		return totalOutstandingAmt;
		
	}
	
	/**
	 * Update the new loan repricing details to the grid
	 * @method updateNewLoanItem
	 */
	function updateNewLoanItem(){

		var repriceDate = dj.byId('repricing_date').get('displayedValue');
		var maturityDate=dj.byId('ln_maturity_date').get('displayedValue');
		var effectiveDate=dj.byId('effective_date').get('displayedValue');		
		var facilitySelVal = dj.byId('bo_facility_id').get('value');
		var facilitySel = dj.byId('bo_facility_id').get('displayedValue');
		var lnAmount = dj.byId('ln_amt').get('displayedValue');
		var lnAmountVal = dj.byId('ln_amt').get('value');		
		var refId = dj.byId('ref_id').get('value');
		var pricingOption=dj.byId('pricing_option').get('value');
		var pricingOptionDisp=dj.byId('pricing_option').get('displayedValue');
		var riskType=dj.byId('risk_type').get('value');
		var repricingFrequencyId=dj.byId('repricing_frequency').get('value');
		var repricingFrequency=dj.byId('repricing_frequency').get('displayedValue');	
		var matchFundingIndicator=dj.byId('match_funding').get('value');	
		var fcn=dj.byId('fcn').get('value');
		var custrefSelValue = dj.byId('cust_ref_id').get('value');

		var newLoanGrid = window.opener.newLoanGrid;
		if(newLoanGrid && newLoanGrid.store){
			
			newLoanGrid.store.fetch({
				query: {new_loan_ref_id: refId},
				onComplete: dojo.hitch(this, function(items, request){ 
					dojo.forEach(items, function(item){
				
						newLoanGrid.store.setValue(item, 'new_loan_pricing_option',pricingOption);
						newLoanGrid.store.setValue(item, 'new_loan_pricing_option_disp',pricingOptionDisp);
						newLoanGrid.store.setValue(item, 'new_loan_risk_type',riskType);
						newLoanGrid.store.setValue(item, 'new_loan_effective_date',effectiveDate);
						newLoanGrid.store.setValue(item, 'new_loan_maturity_date',maturityDate);
						newLoanGrid.store.setValue(item, 'new_loan_repricing_frequency_id',repricingFrequencyId);
						newLoanGrid.store.setValue(item, 'new_loan_repricing_frequency',repricingFrequency);
						newLoanGrid.store.setValue(item, 'new_loan_outstanding_amt',lnAmountVal);
						newLoanGrid.store.setValue(item, 'new_loan_outstanding_amt_disp',lnAmount);
						newLoanGrid.store.setValue(item, 'new_loan_repricing_date',repriceDate);
						newLoanGrid.store.setValue(item, 'new_loan_facility_name',facilitySel);
						newLoanGrid.store.setValue(item, 'new_loan_fcn',fcn);
						newLoanGrid.store.setValue(item, 'new_loan_matchFunding',matchFundingIndicator);
						newLoanGrid.store.setValue(item, 'new_loan_facility_id',facilitySelVal);
						newLoanGrid.store.setValue(item, 'new_loan_our_ref',custrefSelValue);
						
					}, this);
				})
			});
			newLoanGrid.store.save();
			_addRepricingLoansOutstandingAmt();
			_calculatePrincipalPaymentAmount();
			_checkPrincipalPaymentField();
			if(window.opener.loanIncreaseFlag==="true"){
			    _checkForLoanIncrease();
			  }
			if(dijit.byId('net_cashFlow').value == 'true'){
				_checkForNetCashFlow();
			}
	      _updateFacilityAvailablAmount();
	    	_updateDummyLimitAmount();
		}
	}
	
	/**
	 * 
	 */
	 function resetRepricingFields(){
		
		
		dj.byId("repricing_date").set('displayedValue','');
		dj.byId("repricing_frequency").set('displayedValue', '');
		dj.byId("pricing_option").set('displayedValue','');
		dj.byId("ln_maturity_date").set('displayedValue','');
		dj.byId("risk_type").set('value', '');
		dj.byId("ln_amt").set('displayedValue', '');
		dj.byId("effective_date").set('displayedValue', '');
	}
	 
	 /**
	  * 
	  */
	 function disableRepricingFields(){
	 
		 dj.byId("pricing_option").set('disabled', true);
		dj.byId("ln_maturity_date").set('disabled', true);
		dj.byId("repricing_frequency").set('disabled', true);
		dj.byId("repricing_date").set('disabled', true);
		dj.byId("ln_amt").set('disabled', true);
		dj.byId("effective_date").set('disabled', true);
	 }
	 
	/**
	 * update the Facility Dependent Fields
	 * @method _updateFacilityDependentFields
	 */
	function _updateFacilityDependentFields(){
		
		var facilitySelected = dj.byId('bo_facility_id').get('value');
				
		var pricingOption = dijit.byId('pricing_option'),
		riskType = dijit.byId('risk_type');
		
		var repricingFrequency = dijit.byId('repricing_frequency');
		// clear
//		riskType.set('store', null);		
		
		if(facilitySelected)
		{			
			
			repricingFrequency.set('value', '');
			repricingFrequency.set('store',null);
			dj.byId("repricing_date").set('displayedValue','');
			dj.byId("pricing_option").set('value', '');
			dj.byId("pricing_option").set('disabled', false);			
			dj.byId("risk_type").set('disabled', false);
			dj.byId("ln_amt").set('disabled', false);
			var editLoanItem=window.editLoanItem;
			
			if(editLoanItem){
				dj.byId("ln_maturity_date").set('displayedValue', editLoanItem.new_loan_maturity_date[0]);	
				dj.byId("effective_date").set('displayedValue', editLoanItem.new_loan_effective_date[0]);	
				dj.byId("ln_amt").set('value', editLoanItem.new_loan_outstanding_amt[0]);
				dj.byId("dummy_ln_amt").set('value', editLoanItem.new_loan_outstanding_amt[0]);
			}
			
			window.opener.facilitiesStore.fetch({
				query: {id: facilitySelected},
				onComplete: d.hitch(this, function(items, request){
					var item = items[0];
					dj.byId('facility_effective_date').set('displayedValue',item.effectiveDate[0]);
					dj.byId('facility_maturity_date').set('displayedValue',item.maturityDate[0]);
					dj.byId('facility_expiry_date').set('displayedValue',item.expiryDate[0]);
					dj.byId('fcn').set('value',item.fcn[0]);
					dj.byId('fc_access_type').set('value',item.access_type[0]);
					
					var lnMatDate = dijit.byId('ln_maturity_date');				
					if(lnMatDate=='' && dijit.byId('facility_maturity_date'))
					{				
						lnMatDate.set('displayedValue', dj.byId('facility_maturity_date').get('displayedValue'));
					}
					lnMatDate.set('disabled', false);
				})
			});			
			
			var pricingOptionStore = JSON.parse(window.opener.pricingOptionsStores[facilitySelected]);
			if (pricingOptionStore) 
			{
				pricingOption.set('store', new dojo.data.ItemFileReadStore(pricingOptionStore));
				misys._config.maturityMandatoryOptions = pricingOptionStore;
				misys._config.matchFundingOfPricingOption = pricingOptionStore;
				
				if(editLoanItem){
					pricingOption.set('value', editLoanItem.new_loan_pricing_option[0]);
				}else{
					var storeSize = 0;
					var sizeFunc = function (size, request){
						storeSize = size;
						};
						pricingOption.store.fetch({query: {}, onBegin: sizeFunc, start: 0, count: 0});
					if(storeSize === 1){
						//if there is only one pricing option set this as default selected in the select box
						pricingOption.store.fetch({
							onComplete: function(items, request){ 
								dojo.forEach(items,function(item){
									pricingOption.set('value',item.name);
								});
							}});
					}else{
						pricingOption.set('value', '');
					}
				}
			}else{				
				pricingOption.set('store', null);
				pricingOption.set('value', '');
			}
			var riskTypeStore = JSON.parse(window.opener.riskTypesStores[facilitySelected]);
			if(riskTypeStore)
			{
//				riskType.set('store', new dojo.data.ItemFileReadStore(riskTypeStore));
				
				var riskTypeStr=new dojo.data.ItemFileReadStore(riskTypeStore);
				
				riskTypeStr.fetch({
					query: {id: '*'},
					onComplete: d.hitch(this, function(items, request){
						var item = items[0];
						dj.byId('risk_type_disp').set('displayedValue',item.name[0]);
						dj.byId('risk_type').set('value',item.id[0]);
					})
				});	
				
				
				if(editLoanItem){
					riskType.set('value', editLoanItem.new_loan_risk_type[0]);	
				}				
			}
		}
		else
		{
			resetRepricingFields();
		}			

	}	
	
	
	
	
	/**
	 * Populates the Repricing Frequency Drop Down based on the Pricing Options
	 * 
	 * @method _populateRepricingFrequency
	 */
	function _populateRepricingFrequency() {
		
		var pricingOption = dijit.byId('pricing_option');
		var repricingFrequency = dijit.byId('repricing_frequency');
		var facilitySelected = dj.byId('bo_facility_id').get('value');
		var pricingOptionSel = pricingOption.get('value');
		
		if(pricingOptionSel && facilitySelected){
			
				repricingFrequency.set('value', '');
				repricingFrequency.set('store',null);
				dj.byId("repricing_date").set('value','');
				dj.byId("repricing_date").set('displayedValue','');
				
				var pricingOptions = JSON.parse(window.opener.pricingOptionsStores[facilitySelected]);				
				var pricingStore=new dojo.data.ItemFileReadStore(pricingOptions);				
				pricingStore.fetch({
					query: {id: pricingOptionSel},
					onComplete: d.hitch(this, function(items, request){
						var item = items[0];
						dj.byId('match_funding').set('value',item.matchFundedIndicator[0]);
					})
				});						
				
				var repFreqStores = JSON.parse(window.opener.repricingFrequenciesStores[facilitySelected]);
				var pricingOptionValue = pricingOption.get('value');

				// get associated store
				var store = repFreqStores[pricingOptionValue];					
				
				if (store) 
				{
					repricingFrequency.set('store', new dojo.data.ItemFileReadStore(store));
					
					var storeSize = 0;
					var getSize = function(size, request){
									storeSize = size;
									};
					repricingFrequency.get('store').fetch({query: {}, onBegin: getSize, start: 0, count: 0});
					
					if (storeSize == 0)
					{
						dj.byId("repricing_frequency").set('disabled', true);
						dj.byId("repricing_date").set('displayedValue','');
						dj.byId("repricing_date").set('disabled', true);
					}
					else
					{					
						dj.byId("repricing_frequency").set('disabled', false);
						dj.byId("repricing_date").set('disabled', false);
						if(window.editLoanItem){
							repricingFrequency.set('value', window.editLoanItem.new_loan_repricing_frequency_id[0]);
							dj.byId("repricing_date").set('displayedValue', window.editLoanItem.new_loan_repricing_date[0]);		 				   
						}else if(storeSize == 1){
							//if there is only one repricing frequency associated with pricing option set this as default selected in the select box
							repricingFrequency.get('store').fetch({
								onComplete: function(items, request){ 
									dojo.forEach(items,function(item){
										repricingFrequency.set('value',item.id);
										repricingFrequency.set('displayedValue', item.name);
									});
								}});
						}
					}
				}
				else
				{
					dj.byId("repricing_date").set('displayedValue','');
				}
				
				
				if(window.editLoanItem){
					 window.editLoanItem=null;
				}
				
			}
		
	}
	
	/**
	 * Populates the update Pricing Option Dependent Fields
	 * 
	 * @method _updatePricingOptionDependentFields
	 */
	function _updatePricingOptionDependentFields() {
		
		var pricingOption = dijit.byId('pricing_option');
		var facilitySelected = dj.byId('bo_facility_id').get('value');
		var pricingOptionSelected = pricingOption.get('value');
		
		if(pricingOptionSelected && facilitySelected){
			var pricingOptions = JSON.parse(window.opener.pricingOptionsStores[facilitySelected]);				
			var pricingStore=new dojo.data.ItemFileReadStore(pricingOptions);				
			pricingStore.fetch({
			query: {id: pricingOptionSelected},
				onComplete: d.hitch(this, function(items, request){
				var item = items[0];
				var isMaturityDateMandatory = item.maturityDateMandatory[0];
				if('Y' === isMaturityDateMandatory){
					dijit.byId('ln_maturity_date').set('disabled',false);
					if(dijit.byId('facility_maturity_date'))
					{
						var lnMatDate = dijit.byId('ln_maturity_date');				
						if(lnMatDate==''){
							lnMatDate.set('displayedValue', dj.byId('facility_maturity_date').get('displayedValue'));
						}
					}
				}else if('N' === isMaturityDateMandatory){
					dijit.byId('ln_maturity_date').set('disabled',true);
					dijit.byId('ln_maturity_date').set('displayedValue', '');
				}})
			});
		}
	}

	/**
	 * Date addition utility
	 * 
	 * @method _addDates
	 */
	function _addDates(date)
	{
		var repFreq = dj.byId('repricing_frequency');
		if(date.get('value') && repFreq.get('value'))
		{
			var frequency = repFreq.get('value'),
			frequencyNo,
			frequencyMultiplier,
			frequencyMultiplierFullForm;

			if(frequency.length > 0)
			{
				frequencyNo = frequency.substring(0, frequency.length - 1);
				frequencyMultiplier = frequency.substring(frequency.length - 1, frequency.length);
			}

			if(frequencyMultiplier === 'W')
			{
				frequencyMultiplierFullForm = 'week';
			}
			else if (frequencyMultiplier === 'M')
			{
				frequencyMultiplierFullForm = 'month';
			}
			else if(frequencyMultiplier === 'Y')
			{
				frequencyMultiplierFullForm = 'year';
			}
			else if(frequencyMultiplier === 'D')
			{
				frequencyMultiplierFullForm = 'day';
			}

			return dojo.date.add(date.get('value'), frequencyMultiplierFullForm, parseInt(frequencyNo, 10));
		}
	}
	
	/**
	 * if repricing frequency is alread re calculate the repricing date  on effective date select
	 * @method _calculateRepricingDate
	 */
	function _setRepricingDate(){
		
		var repFreq = dj.byId('repricing_frequency');
		var repFreqSelected=repFreq.get('value');
		var repricingDate = dj.byId('repricing_date');
		
		if(repFreqSelected){
			_calculateRepricingDate();
		}		
	}

	/**
	 * Calculate the Repricing Date
	 * 
	 * @method _calculateRepricingDate
	 */
	function _calculateRepricingDate(){

		var repricingDate = dj.byId('repricing_date');
		var effDate = dj.byId('effective_date');
		var repFreq = dj.byId('repricing_frequency');
		//misys.config.count=1;
		
		if(effDate.get('value') && repFreq.get('value') && window.editMode===false)
		{
			repricingDate.set('displayedValue','');
			repricingDate.set('value', _addDates(effDate));
			
		}
		else if(effDate.get('value') && repFreq.get('value') && window.editMode===true)
		{
			if(misys._config.count!==1)
			{
				repricingDate.set('displayedValue','');
				repricingDate.set('value', _addDates(effDate));
			}
			
		}
		//_setRepricingDateAsPerTheBusinessDayRule();
		misys._config.count=misys._config.count+1;
		
	}

	/**
	 * Update the Repricing Frequency
	 * 
	 * @method _controlRepricingFrequency
	 */
	function _controlRepricingFrequency(){
		
		var effDate = dj.byId('effective_date');
		var calculatedRepricingDate = _addDates(effDate);
		var repriceDate = dj.byId('repricing_date').get('value');

		if(repriceDate.getDate() === calculatedRepricingDate.getDate() &&
				repriceDate.getMonth() === calculatedRepricingDate.getMonth() && 
				repriceDate.getYear() === calculatedRepricingDate.getYear())
		{
			dj.byId('repricing_frequency').set('disabled', false);
		}
		else
		{
			misys.toggleRequired('repricing_frequency', false);
		}
	}
	
	/**
	 * Checks if the Maturity Date, Repricing Frequency & Repricing Dates are mandatory fields
	 * 
	 * @method _isMaturityDateAndRepricingFrequencyMandatory
	 */
	function _isMaturityDateAndRepricingFrequencyMandatory(fieldId) {
		
		var pricingOption = dijit.byId('pricing_option');
		var facilitySelected = dj.byId('bo_facility_id').get('value');
		var pricingOptionSelected = pricingOption.get('value');
		var repricingFrequency = dijit.byId('repricing_frequency');
		var isMandatory;
		if(facilitySelected && pricingOptionSelected ){
			if(fieldId === 'repricing_frequency' || fieldId === 'repricing_date'){
				var storeSize = 0;
				var getSize = function(size, request){
								storeSize = size;
								};
				repricingFrequency.get('store').fetch({query: {}, onBegin: getSize, start: 0, count: 0});
				if(storeSize === 0){
					return false;
				}else{
					return true;
				}
			}else{
				var pricingOptions = JSON.parse(window.opener.pricingOptionsStores[facilitySelected]);				
				var pricingStore=new dojo.data.ItemFileReadStore(pricingOptions);	
				var isMaturityDateMandatory;
				var getMaturityDate = function(items, request){
					var item = items[0];
					isMaturityDateMandatory = item.maturityDateMandatory[0];
					};
				pricingStore.fetch({
					query: {id: pricingOptionSelected},
					onComplete: d.hitch(this, getMaturityDate)
				});
				if('Y' === isMaturityDateMandatory){
					return true;
				}else{
					return false;
				}
			}				
		}
	}
	

	/**
	 * this method makes the ajax call to get the business date from loan iq
	 * @method _setRepricingDateAsPerTheBusinessDayRule
	 */
	function _setRepricingDateAsPerTheBusinessDayRule() {
		var boFacilityId = dj.byId("bo_facility_id").get("value");
		var pricingOptionName = dj.byId("pricing_option").get("value");
		var repriceDateField  = dijit.byId("repricing_date");
		var repricingDate = repriceDateField.get("displayedValue");
		var currency = dj.byId("ln_cur_code").get("value");
		var facMaturityDate = dijit.byId('facility_maturity_date');		
		var isRepricingDate = 'Y';
		
/*		MPS-47822, as per the issue no need to send loan iq request if reprcing date is greater than facility
		maturity date.*/
		if(m.compareDateFields(repriceDateField, facMaturityDate))
		{
			// console.debug('[Loan Drawdown] Checking for Borrower deals');
			m.xhrPost({url : m.getServletURL("/screen/AjaxScreen/action/GetBusinessDayValidatedDate"),
						handleAs : "json",
						preventCache : true,
						sync : true,
						content : {
							boFacilityId : boFacilityId,
							pricingOptionName : pricingOptionName,
							dateToValidate : repricingDate,
							currency : currency,
							isRepricingDate : isRepricingDate
						},
						load : function(response) {
							console.log("success");
							misys._config.dateValuesResponse = response;
							misys._config.isDirtyFlag = true;
							if(response.items.dateValues && dj.byId("repricing_date").get("displayedValue") === response.items.dateValues[0].localizedDate){
								misys._config.isRepricingDateFlag=true;
								}
								else{
									misys._config.isRepricingDateFlag=false;
								}							
							_populateBusinessDateForRepricing();
						},
						error : function(response) {
							console.log("error");
							console.debug("[INFO] No deals for the borrower found.");

						}
					});
			
		}

	}

	/**
	 * This method render the loan iq business date for repricing
	 * 
	 * @method _populateBusinessDateForRepricing
	 */

	function _populateBusinessDateForRepricing() {
		var repricingDate = dj.byId("repricing_date");
		var repricingDateStringForDisplay = dj.byId("repricing_date").get("displayedValue");
		var repricingDateValue =  (dj.byId("repricing_date").get("value") !== null) ? dj.byId("repricing_date").get("value") : "";
		var store;
		var businessDateValues = misys._config.dateValuesResponse["items"];
		// get associated store
		repricingDate.store = new dojo.data.ItemFileReadStore({
			data : {
				identifier : "id",
				label : "name",
				items : businessDateValues['dateValues']
			}
		});

		var storeSize = 0;
		var getSize = function(size, request) {
			storeSize = size;
		};
		repricingDate.get('store').fetch({
			query : {},
			onBegin : getSize,
			start : 0,
			count : 0
		});
		var dateResponse = repricingDate.store._arrayOfTopLevelItems[0].name[0];
		var darr = dateResponse.split("/"); // ["29", "1", "2016"]
		var dateObject = new Date(parseInt(darr[2], 10),
				parseInt(darr[1], 10) - 1, parseInt(darr[0], 10));
		if(repricingDate.get('disabled')=== false){
		repricingDate.set('value', dateObject);
		}
		var repricingDateObject = new Date(repricingDateValue);	
		
		if(dateObject.valueOf()>repricingDateObject.valueOf()  || dateObject.valueOf()<repricingDateObject.valueOf())
		{
			var displayMessage = m.getLocalization("repricingDateBusinessDayValidationErrorMsg", [ repricingDateStringForDisplay ]);
			m.dialog.show(CNC,displayMessage,"Info");
		}
	}

})(dojo, dijit, misys);
// Including the client specific implementation
dojo.require('misys.client.binding.loan.reprice_new_loan_client');