dojo.provide("misys.binding.loan.reprice_ln");

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
	 * Validates the amount based on risk type limit.
	 * 
	 * @method _validateRiskTypeLimitAmount
	 */
	function _validateRiskTypeLimitAmount(){
		//  summary:
		//        Validates the amount based on risk type limit.
		//  tags:
		//         public, validation

		var thisObject = dj.byId(this.id);
		var that = this;

		var riskTypeLimitAmt;
		// Get the limit amount
		thisObject.store.fetch({
			query: {
				id: thisObject.get('value')
			},
			onItem: function(item) {
				riskTypeLimitAmt = parseFloat(item.limitAmount[0]);
			}
		});

        var riskTypeField = dj.byId('risk_type');
        var displayMessage;
        
        if(riskTypeLimitAmt)
        {
               var currency = dj.byId('ln_cur_code');
               var lnAmt= dj.byId('ln_amt');
               var repricedLoanAmt = parseFloat(lnAmt.get('value'));

               if (repricedLoanAmt > riskTypeLimitAmt && riskTypeField && riskTypeField.get('value') !== "")
               {
                     // validate the loan amount is less or equal to the limit in the
                     // selected currency
                     if(misys._config.warnFacilityAmtExceeded)
                     {
                            misys._config.warningMessages = [];
                            misys._config.warningMessages.push(m.getLocalization('loanFacilityAmtExceeded'));

                            return true;
                     }
                     else
                     {
                    	 	that.invalidMessage = m.getLocalization('loanRepricingAmountBigThanBorrowerCcyLimitAmtError',[ currency.get('value'), riskTypeLimitAmt ]);
                     }
                     return false;
               }
               else
               {
                     // Flush the warnings 
                     misys._config.warningMessages = [];
                     return true;
               }
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

		// This validation is for non-required fields
		if(this.get('value') == null){
			return true;
		}

		console.debug('[Validate] Validating Loan Repricing Date. Value = ' + this.get('value'));

		var thisObject  = dj.byId(this.id);

		// Test that the loan Repricing date is greater than or equal to the loan effective date
		var loanEffDate = dijit.byId('effective_date');
		if(!m.compareDateFields(loanEffDate, thisObject))
		{
			this.invalidMessage = misys.getLocalization('loanRepricingDateGreaterThanLoanEffDateError', [
			                                                                                             m.getLocalizeDisplayDate(this),
			                                                                                             m.getLocalizeDisplayDate(loanEffDate)]);
			return false;
		}

		// Test that the loan Repricing date is less than or equal to the loan maturity date
		var lnMatDate = dijit.byId('ln_maturity_date');
		if(!m.compareDateFields(thisObject, lnMatDate))
		{
			this.invalidMessage = misys.getLocalization('loanRepricingDateLessThanLoanMatDateError', [
			                                                                                          m.getLocalizeDisplayDate(this),
			                                                                                          m.getLocalizeDisplayDate(lnMatDate)]);
			return false;
		}

		var facMatDate = dijit.byId('facility_maturity_date');
		if(!m.compareDateFields(thisObject, facMatDate))
		{
			this.invalidMessage = misys.getLocalization('loanRepricingDateLessThanFacMatDateError', [
			                                                                                         m.getLocalizeDisplayDate(this),
			                                                                                         m.getLocalizeDisplayDate(facMatDate)]);
			return false;
		}


		return true;
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

		if(facilitySelected)
		{
			var repFreqStores = JSON.parse(misys._config.repricingFrequenciesStores[facilitySelected]);

			// clear
			repricingFrequency.set('value', '');

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

				// if Store is empty (pricing option has no repricing frequency)
				// remove required attribute
				if (storeSize == 0)
				{
					misys.toggleRequired('repricing_frequency', false);
					misys.toggleRequired('repricing_date', false);
					dj.byId("repricing_date").set('displayedValue','');
					dj.byId("repricing_date").set('disabled', true);
					dj.byId("repricing_frequency").set('disabled', true);
				}
				else
				{
					dj.byId("repricing_frequency").set('disabled', false);
					misys.toggleRequired('repricing_frequency', true);
					dj.byId("repricing_date").set('disabled', false);
					misys.toggleRequired('repricing_date', true);

					if(dj.byId('repricing_frequency_view') && dj.byId('repricing_frequency_view').get('value'))
					{
						dj.byId('repricing_frequency').set('value',dj.byId('repricing_frequency_view').get('value'));
						_controlRepricingFrequency();
						dj.byId('repricing_frequency_view').set('value','');
					}
				}
			}
			else
			{
				dj.byId("repricing_date").set('displayedValue','');
			}
		}
	}

	/**
	 * Update all the pricing option dependent fields
	 * 
	 * @method _updatePricingOptionDependentFields
	 */
	function _updatePricingOptionDependentFields(onload)
	{
		var pricingOptionValue = dijit.byId('pricing_option').get('value');
		dj.byId("ln_maturity_date").set('disabled', true);
		if(pricingOptionValue)
		{
			if(misys._config.maturityMandatoryOptions && misys._config.maturityMandatoryOptions.data && misys._config.maturityMandatoryOptions.data.items)
			{
				dojo.forEach(misys._config.maturityMandatoryOptions.data.items,function(item){
					if(pricingOptionValue === item.id[0])
					{
						// Pricing option based Loan Maturity Date
						if(item.maturityDateMandatory[0] === 'Y')
						{
							dj.byId("ln_maturity_date").set('disabled', false);
							m.toggleRequired("ln_maturity_date", true);
							if(!dj.byId('ln_maturity_date').get('value') && dj.byId('facility_maturity_date'))
							{
								dj.byId('ln_maturity_date').set('displayedValue',dj.byId('facility_maturity_date').get('value'));
							}
						}
						else
						{
							if(onload)
							{
								dj.byId('ln_maturity_date').set('displayedValue','');
							}
							m.toggleRequired("ln_maturity_date", false);
							dj.byId("ln_maturity_date").set('disabled', true);
						}

						// Pricing Option based Match Funding
						if(dj.byId('match_funding'))
						{
							if(item.matchFundedIndicator[0] && item.matchFundedIndicator[0] === 'Y')
							{
								dj.byId('match_funding').set('value', 'Y');
							}
							else
							{
								dj.byId('match_funding').set('value', 'N');
							}
						}
					}
				});
			}
		}
		else
		{
			dj.byId('ln_maturity_date').set('displayedValue','');
		}
	} 


	/**
	 * Calculate the Total Outstanding amount
	 * 
	 * @method _addRepricingLoansOutstandingAmt
	 */
	function _addRepricingLoansOutstandingAmt(){

		var linkedLoanGrid = dijit.byId('gridRepricingLoanTransactions');
		var totalOutstandingAmt = 0;
		if(linkedLoanGrid && linkedLoanGrid.store)
		{

			linkedLoanGrid.store.fetch({
				query: {loan_ref_id: '*'},
				onComplete: dojo.hitch(this, function(items, request){ 
					d.forEach(items,function(item){
						totalOutstandingAmt = parseFloat(totalOutstandingAmt) + parseFloat(item.loan_outstanding_amt[0].split(',').join(''));
					}, this);
				})
			});

			dj.byId('ln_amt').set('value', totalOutstandingAmt);
		}
	}

	/**
	 * Validate the Loan Amount and, if it exceeds Facility Available amount just WARN.
	 * 
	 * WARN is based on configuration. 
	 * 
	 * @method _warnAboutFacilityLimitAmount
	 */
	function _warnAboutFacilityLimitAmount()
	{
		var boFacilityId = dj.byId('bo_facility_id');
		var borrowerAvailAmt = dj.byId("borrower_available_amt");
		var linkedLoanGrid = dijit.byId('gridRepricingLoanTransactions');
		var boAvailableCurCode = dj.byId('borrower_available_cur_code');
		var currencyLimitAmount;
		var repricedCurrencyEqvLimitAmount;
		var borrowerAvailableLimitAmount;
		if(misys._config['currencyLimitAmount']) {
			currencyLimitAmount = parseFloat(misys._config['currencyLimitAmount']);
		}
		if(misys._config['repricedCurrencyEqvLimitAmount']) {
			repricedCurrencyEqvLimitAmount = parseFloat(misys._config['repricedCurrencyEqvLimitAmount']);
		}
		if(misys._config['borrowerAvailableLimitAmount']) {
			borrowerAvailableLimitAmount = parseFloat(misys._config['borrowerAvailableLimitAmount']);
		}
		var displayMessage;
		var amountToSubtract = 0;
		
		//subtracting the outstanding amount of the loans drawn from the facility against which the loan is repriced,
		//from the total repriced loan amount
		if(linkedLoanGrid && linkedLoanGrid.store && boFacilityId && boFacilityId.get('value') !== "")
		{
			linkedLoanGrid.store.fetch({
				query: {loan_facility_id: boFacilityId.get('value')},
				onComplete: dojo.hitch(this, function(items, request){ 
					d.forEach(items,function(item){
						amountToSubtract = parseFloat(amountToSubtract) + parseFloat(item.loan_outstanding_amt[0].split(',').join(''));
					}, this);
				})
			});
		}
		
		if(borrowerAvailAmt)
		{
			var currency = dj.byId('ln_cur_code');
			var lnAmt= dj.byId('ln_amt');
			var repricedLoanAmt = parseFloat(lnAmt.get('value'));
			var boAvailableCurCodeValue = boAvailableCurCode ? boAvailableCurCode.get('value') : ""; 
			var borrowerAvailableAmt;
			if(currency && repricedCurrencyEqvLimitAmount && boAvailableCurCodeValue !=="" && (currency.get('value') !== boAvailableCurCodeValue) )
			{
				borrowerAvailableAmt = repricedCurrencyEqvLimitAmount;		
			}
			else
			{
				borrowerAvailableAmt = borrowerAvailAmt.get('value');
			}
			var totalRepricingAmtToValidate = repricedLoanAmt - amountToSubtract;

			if (totalRepricingAmtToValidate > borrowerAvailableAmt && boFacilityId && boFacilityId.get('value') !== "")
			{
				// validate the loan amount is less or equal to the limit in the
				// selected currency
				if(misys._config.warnFacilityAmtExceeded)
				{
					misys._config.warningMessages = [];
					misys._config.warningMessages.push(m.getLocalization('loanFacilityAmtExceeded'));

					return true;
				}
				else
				{
					displayMessage = m.getLocalization('loanRepricingAmountTooBigError',[ currency.get('value'), borrowerAvailableAmt ]);
					boFacilityId.focus();
					boFacilityId.set("value","");
					boFacilityId.set("state","Error");
			 		dj.hideTooltip(boFacilityId.domNode);
			 		dj.showTooltip(displayMessage, boFacilityId.domNode, 0);
				}
				return false;
			}
			 else if (currencyLimitAmount && (repricedLoanAmt > currencyLimitAmount && boFacilityId && boFacilityId.get('value') !== ""))
			{
					// validate the loan amount is less or equal to the limit in the
					// selected currency
					if(misys._config.warnFacilityAmtExceeded)
					{
						misys._config.warningMessages = [];
						misys._config.warningMessages.push(m.getLocalization('loanBorrowerCcyLimtAmtExceeded'));

						return true;
					}
					else
					{
						displayMessage = m.getLocalization('loanRepricingAmountTooBigForCurrencyError',[ currency.get('value'), currencyLimitAmount, boFacilityId.get('displayedValue') ]);
						boFacilityId.focus();
						boFacilityId.set("value","");
						boFacilityId.set("state","Error");
				 		dj.hideTooltip(boFacilityId.domNode);
				 		dj.showTooltip(displayMessage, boFacilityId.domNode, 0);
					}
					return false;
				}
			 	else if(borrowerAvailableLimitAmount && (repricedLoanAmt > borrowerAvailableLimitAmount && boFacilityId && boFacilityId.get('value') !== ""))
				{
					if(misys._config.warnFacilityAmtExceeded)
					{
						misys._config.warningMessages = [];
						misys._config.warningMessages.push(m.getLocalization('loanBorrowerLevelLimtAmtExceeded'));

						return true;
					}
					else
					{
						displayMessage = m.getLocalization('loanRepricingAmountTooBigForBorrowerError',[ currency.get('value'), borrowerAvailableLimitAmount]);
						boFacilityId.focus();
						boFacilityId.set("value","");
						boFacilityId.set("state","Error");
				 		dj.hideTooltip(boFacilityId.domNode);
				 		dj.showTooltip(displayMessage, boFacilityId.domNode, 0);
					}
					return false;	
			}
			else
			{
				// Flush the warnings 
				misys._config.warningMessages = [];
				return true;
			}
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
	 * Calculate the Repricing Date
	 * 
	 * @method _calculateRepricingDate
	 */
	function _calculateRepricingDate(){

		var repricingDate = dj.byId('repricing_date');
		var effDate = dj.byId('effective_date');
		var repFreq = dj.byId('repricing_frequency');

		if(effDate.get('value') && repFreq.get('value'))
		{
			repricingDate.set('displayedValue','');
			repricingDate.set('value', _addDates(effDate));
		}
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
			misys.toggleRequired('repricing_frequency', true);
			dj.byId('repricing_frequency').set('disabled', false);
		}
		else
		{
			misys.toggleRequired('repricing_frequency', false);
			dj.byId('repricing_frequency').set('disabled', true);
		}
	}

	/**
	 * Update the Facility Dependent Fields, based on the selection of the Back-Office Facility.
	 * 
	 * @method _updateFacilityDependentFields
	 */
	function _updateFacilityDependentFields(){
		var facilitySelected = dj.byId('bo_facility_id').get('value');

		var facilityDependentHiddenFields = ['bo_facility_name','facility_effective_date','facility_expiry_date','facility_maturity_date','fcn'];

		var facilityDependentViewFields = ['fcn_view_row','facility_effective_date_view_row','facility_expiry_date_view_row',
		                                   'facility_maturity_date_view_row','borrower_limit_view_row', 'borrower_available_view_row'];

		d.forEach(facilityDependentHiddenFields,function(field){
			if(dj.byId(field))
			{
				dj.byId(field).set('value','');
				dj.byId(field).set('displayedValue','');
			}
		});

		d.forEach(facilityDependentViewFields,function(field){
			if(d.byId(field) && dojo.query('#'+field+' > .content') && dojo.query('#'+field+' > .content')[0]) 
			{
				dojo.query('#'+field+' > .content')[0].innerHTML = "";
			}
		});

		var pricingOption = dijit.byId('pricing_option'),
		riskType = dijit.byId('risk_type');
		// clear
		pricingOption.set('value', '');
		pricingOption.set('store', null);
		riskType.set('value', '');
		riskType.set('store', null);

		if(facilitySelected)
		{
			m._config.facilitiesStore.fetch({
				query: {id: facilitySelected},
				onComplete: d.hitch(this, function(items, request){
					var item = items[0];
					dj.byId('bo_facility_name').set('value',item.name[0]);
					dj.byId('facility_effective_date').set('displayedValue',item.effectiveDate[0]);
					dj.byId('facility_expiry_date').set('displayedValue',item.expiryDate[0]);
					dj.byId('facility_maturity_date').set('displayedValue',item.maturityDate[0]);
					dj.byId('fcn').set('value',item.fcn[0]);

					dojo.query('#fcn_view_row > .content')[0].innerHTML = item.fcn[0];
					dojo.query('#facility_effective_date_view_row > .content')[0].innerHTML = item.effectiveDate[0];
					dojo.query('#facility_expiry_date_view_row > .content')[0].innerHTML = item.expiryDate[0];
					dojo.query('#facility_maturity_date_view_row > .content')[0].innerHTML = item.maturityDate[0];


					if(d.byId('borrower_limit_view_row'))
					{
						dj.byId('borrower_limit_cur_code').set('value',item.mainCurrency[0]);
						dj.byId('borrower_limit_amt').set('value', item.globalLimitAmount[0]);
						misys.setCurrency(dijit.byId('borrower_limit_cur_code'), ['borrower_limit_amt']);
						dojo.query('#borrower_limit_view_row > .content')[0].innerHTML = item.mainCurrency[0] + ' '+ dj.byId('borrower_limit_amt').get('displayedValue');
					}

					if(d.byId('borrower_available_view_row'))
					{
						dj.byId('borrower_available_cur_code').set('value',item.mainCurrency[0]);
						dj.byId('borrower_available_amt').set('value', item.globalLimitAmount[0]);
						misys.setCurrency(dijit.byId('borrower_available_cur_code'), ['borrower_available_amt']);
						dojo.query('#borrower_available_view_row > .content')[0].innerHTML = item.mainCurrency[0] + ' '+ dj.byId('borrower_available_amt').get('displayedValue');

						dj.byId('borrower_available_amt').set('value', item.globalAvailableAmount[0]);
						misys.setCurrency(dijit.byId('borrower_available_cur_code'), ['borrower_available_amt']);
						dojo.query('#borrower_available_view_row > .content')[0].innerHTML = item.mainCurrency[0] + ' '+ dj.byId('borrower_available_amt').get('displayedValue');
						if (item.currencyLimitAmount) {
							var currencyLimitAmount = item.currencyLimitAmount[0];
							misys._config['currencyLimitAmount'] = currencyLimitAmount;
						}
						if (item.repricedCurrencyEqvLimitAmount) {
							var repricedCurrencyEqvLimitAmount = item.repricedCurrencyEqvLimitAmount[0];
							misys._config['repricedCurrencyEqvLimitAmount'] = repricedCurrencyEqvLimitAmount;
						}
						if (item.borrowerAvailableLimitAmount) {
							var borrowerAvailableLimitAmount = item.borrowerAvailableLimitAmount[0];
							misys._config['borrowerAvailableLimitAmount'] = borrowerAvailableLimitAmount;
						}
					}
				})
			});

			d.style(d.byId('facilityDependentFields'),'display','block');

			// get associated store
			var pricingOptionStore = JSON.parse(misys._config.pricingOptionsStores[facilitySelected]);
			if (pricingOptionStore) 
			{
				pricingOption.set('store', new dojo.data.ItemFileReadStore(pricingOptionStore));
				misys._config.maturityMandatoryOptions = pricingOptionStore;
				misys._config.matchFundingOfPricingOption = pricingOptionStore;
			}

			var riskTypeStore = JSON.parse(misys._config.riskTypesStores[facilitySelected]);
			if(riskTypeStore)
			{
				riskType.set('store', new dojo.data.ItemFileReadStore(riskTypeStore));
			}
		}
		else
		{
			d.style(d.byId('facilityDependentFields'),'display','none');
			misys.toggleRequired('repricing_frequency', false);
			misys.toggleRequired('repricing_date', false);
			misys.toggleRequired('ln_maturity_date', false);
			dj.byId("repricing_date").set('displayedValue','');
			dj.byId("repricing_frequency").set('displayedValue', '');
			dj.byId("repricing_date").set('disabled', true);
			dj.byId("repricing_frequency").set('disabled', true);
		}
	}
	 
	/**
	 * Validates each transaction for it's eligibility to Reprice.
	 * 
	 * @method _validateRepricingRecords
	 */
	function _validateRepricingRecords () {
		
		var refId = dijit.byId('ref_id');
		var linkedLoanGrid = dijit.byId('gridRepricingLoanTransactions');
		var linkedLoansRefIds = "",
		isValid = true, 
		errorMsg;
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
		m.xhrPost({
			url : m.getServletURL("/screen/AjaxScreen/action/ValidateRepricingTransaction"),
			handleAs : "json",
			preventCache : true,
			sync : true,
			content: { ref_id : refId.get('value'),
						linkedLoans : linkedLoansRefIds},
			load : function(response, args){
				isValid = response.isValid;
				errorMsg = response.errorMsg;
			},
			error : function(response, args){
				console.error(" processRepricingOfRecords error", response);
			}
		});
	
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
					productCode : 'LN',
					subProductCode : '',
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
			misys.setValidation('repricing_date', _validateLoanRepricingDate);

			m.connect('bo_facility_id','onChange', _updateFacilityDependentFields);
			m.connect('bo_facility_id','onBlur', _warnAboutFacilityLimitAmount);

			misys.connect('pricing_option', 'onChange', _populateRepricingFrequency);
			m.connect('pricing_option','onChange', _updatePricingOptionDependentFields);

			m.connect('repricing_frequency','onChange', _calculateRepricingDate);
			m.connect('ln_maturity_date','onChange', _calculateRepricingDate);
			m.connect('repricing_date','onChange',_controlRepricingFrequency);

			m.connect('ln_amt','onChange', _warnAboutFacilityLimitAmount);
			m.setValidation('risk_type', _validateRiskTypeLimitAmount);

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
			_updateFacilityDependentFields();
			var boFacilityId = dj.byId('bo_facility_id');
			if(boFacilityId && boFacilityId.get('value'))
			{
				if(dj.byId('pricing_option_view') && dj.byId('pricing_option_view').get('value'))
				{
					dj.byId('pricing_option').set('value',dj.byId('pricing_option_view').get('value'));
				}

				if(dj.byId('risk_type_view') && dj.byId('risk_type_view').get('value'))
				{
					dj.byId('risk_type').set('value',dj.byId('risk_type_view').get('value'));
				}
			}

			if(dijit.byId('pricing_option') && !dijit.byId('pricing_option').get('value'))
			{
				// Repricing Frequency is Disabled, so it should also be marked as Not-required 
				dijit.byId("repricing_frequency").set('disabled', true);
				misys.toggleRequired('repricing_frequency', false);

				// Repricing Date is Disabled, so it should also be marked as Not-required 
				dijit.byId("repricing_date").set('disabled', true);
				misys.toggleRequired('repricing_date', false);
			}

			_addRepricingLoansOutstandingAmt();
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
			var entity = dj.byId("entity");
			if (entity && entity.get("value") === "")
			{
				return false;
			}
			else
			{
				if (!_validateRepricingRecords())
				{
					return false;
				}
				return true;
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
			_warnAboutFacilityLimitAmount();
			
			if (!(_validateRepricingRecords()))
			{
				return false;
			}

			return true;

		},

		/**
		 * Grid actions only with delete option.
		 *
		 *@method formatLinkedLoanDeleteActions
		 *
		 */
		formatLinkedLoanDeleteActions : function(result) {

			var parent=dojo.create('div');
			var div=dojo.create('div',{'class':'gridActions'},parent);
			dojo.create ('img',{'src': misys.getContextualURL(misys._config.imagesSrc + m._config.imageStore.deleteIcon),
				'alt':'Delete','border' : '0', 'type': 'remove','onclick':'misys.deleteLinkedLoans("'+result.ref_id+'")'},div);
			return parent.innerHTML;
		},

		/**
		 * Get or Identify the Transaction in the Grid, on which the Action needs to be performed.
		 * 
		 * @method getLinkedLoansAction
		 * @return {String} `ref_id`, the Transaction Reference ID.
		 */
		getLinkedLoansAction : function(rowIndex, item) {

			if(!item) {
				return this.defaultValue;
			}

			return {
				ref_id: this.grid.store.getValue(item, "loan_ref_id")
			};
		}, 

		/**
		 * Format Linked Loans Grid section. Like, alignment, CSS, and default buttons to appear in each grid-row.
		 * 
		 * @method formatLinkedLoanPreviewActions
		 */
		formatLinkedLoanPreviewActions : function(result){
			var parent = dojo.create('a');
			var id = ''+result.ref_id+'_details_link';
			var href = 'javascript:misys.popup.showReporting ("FULL","LN","'+result.ref_id+'")';
			var anchor = dojo.create('a',{'id':id, 'href' : href}, parent);
			dojo.create ('img',{'src': misys.getContextualURL(misys._config.imagesSrc+'preview_large.png'), 'alt':'Details of the file','border' : '0'}, anchor);
			return parent.innerHTML;
		},

		/**
		 * Deletes the Linked Loan one at a time.
		 * 
		 * @method deleteLinkedLoans
		 */
		deleteLinkedLoans : function(refId)
		{
			var linkedLoanGrid = dijit.byId('gridRepricingLoanTransactions');
			if(linkedLoanGrid && linkedLoanGrid.store)
			{
				var storeSize = 0;
				var getSize = function(size, request)
				{
					storeSize = size;
				};

				linkedLoanGrid.get('store').fetch({query: {}, onBegin: getSize, start: 0, count: 0});
				if(storeSize > 1)
				{
					var onOkCallback = function(){
						linkedLoanGrid.store.fetch({
							query: {loan_ref_id: refId},
							onComplete: dojo.hitch(this, function(items, request){ 
								dojo.forEach(items, function(item){
									linkedLoanGrid.store.deleteItem(item);
								}, this);
							})
						});
						linkedLoanGrid.store.save();
						_addRepricingLoansOutstandingAmt();
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

			var xmlRoot = m._config.xmlTagName,

			transformedXml = xmlRoot ? ["<", xmlRoot, ">"] : [];

			// Representation of existing XML
			var dom = dojox.xml.DomParser.parse(xml);

			if (xml.indexOf(xmlRoot) != -1)
			{
				// Push the entire XML into the new one
				var subXML = xml.substring(xmlRoot.length+2,(xml.length-xmlRoot.length-3));

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
				if(xmlRoot) {
					transformedXml.push("</", xmlRoot, ">");
				}
				return transformedXml.join("");
			}
			else {
				return xml;
			}
		}
	});
})(dojo, dijit, misys);
// Including the client specific implementation
dojo.require('misys.client.binding.loan.reprice_ln_client');