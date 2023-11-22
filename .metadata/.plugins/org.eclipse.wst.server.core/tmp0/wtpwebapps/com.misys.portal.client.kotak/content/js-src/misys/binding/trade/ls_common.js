dojo.provide("misys.binding.trade.ls_common");
dojo.require("dojo.data.ItemFileWriteStore");

// Copyright (c) 2000-2011 Misys (http://www.misys.com),
// All Rights Reserved. 
//
//
// description:
//	  This file contains code that is specific to license module
//
// author:    Shailly Palod

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode
	
	// Private Functions and Variables

	/**
	 * <h4>Summary:</h4> Calculate the new License amt. 
	 * 
	 * <h4>Description:</h4>  Calculate the new License amount in
	 * the case of amendment. Handles both increment and decrement in amount.
	 * 
	 * @param {Dijit} node
	 * 	Node either inc_amt or dec_amt
	 * @method _calculateNewLicenseAmt
	 */
	function _calculateNewLicenseAmt( /*Dijit*/ node) {
		//  summary:
		//      Calculate the new License Total Amount (License Amount + Additional Amount).
		//	description:
		//		The ls_amt, org_ls_amt, total_amt org_additional_amt and additional_amt fields must exist for this
		//		function to be correctly called.
		
		var additionalAmtField = dj.byId("additional_amt"),
			orgAdditionalAmtField = dj.byId("org_additional_amt"),
			lsAmtField = dj.byId("ls_amt"),
			orgLsAmtField = dj.byId("org_ls_amt"),
			// We parse to number in case either field happens to be a hidden field.
			orgLsAmt = d.number.parse(orgLsAmtField.get("displayedValue")),
			orgAdditionalAmt = d.number.parse(orgAdditionalAmtField.get("displayedValue")),
			amendAmt = d.number.parse(node.get("displayedValue"));

		orgLsAmt = !isNaN(orgLsAmt) ? orgLsAmt : 0;
		orgAdditionalAmt = !isNaN(orgAdditionalAmt) ? orgAdditionalAmt : 0;
		amendAmt = !isNaN(amendAmt) ? amendAmt : 0;
		
		if(node.id === "inc_amt") {
			console.debug("[misys.form.common] Incrementing amount from", lsAmtField.get("value"), 
								"to", (orgLsAmt + amendAmt));
			lsAmtField.set("value", orgLsAmt + amendAmt);
		} 
		else if(node.id === "dec_amt") {
			if(amendAmt <= orgLsAmt) {
				console.debug("[misys.form.common] Changing amount from", 
						lsAmtField.get("value") ,"to", (orgLsAmt - amendAmt));
				lsAmtField.set("value", orgLsAmt - amendAmt);
			} else {
				// TODO This should be handled by a validation attached
				// to the field
				m.setFieldState(node, false);
			}
		}
		else if(node.id === "additional_inc_amt") {
			console.debug("[misys.form.common] Incrementing amount from", additionalAmtField.get("value"), 
					"to", (orgAdditionalAmt + amendAmt));
			additionalAmtField.set("value", orgAdditionalAmt + amendAmt);
		} 
		else if(node.id === "additional_dec_amt") {
			if(amendAmt <= orgAdditionalAmt) {
				console.debug("[misys.form.common] Changing amount from", 
						additionalAmtField.get("value") ,"to", (orgAdditionalAmt - amendAmt));
				additionalAmtField.set("value", orgAdditionalAmt - amendAmt);
			} else {
				// TODO This should be handled by a validation attached
				// to the field
				m.setFieldState(node, false);
			}
		}
		if(dj.byId("total_amt"))
		{
			var lsAmt = d.number.parse(lsAmtField.get("displayedValue")),
			additionalAmt = d.number.parse(additionalAmtField.get("displayedValue"));
			lsAmt = !isNaN(lsAmt) ? lsAmt : 0;
			additionalAmt = !isNaN(additionalAmt) ? additionalAmt : 0;
			//dj.byId("total_amt").set("value", lsAmt + additionalAmt);
			dj.byId("total_amt").set("value", lsAmt);
		}
	}
	
	// Public Functions and Variables
	d.mixin(m, {
		
		/**
		 * <h4>Summary:</h4>
		 * This function is to amend the transaction amount by taking the value of the field
		 * "node", and either incrementing or decrementing the transaction amount.
		 * 
		 * <h4>Description:</h4> 
		 * Amends the transaction amount by incrementing or decrementing
		 * the transaction amount (action chosen based on the ID of field "this").
		 * If an increment is performed, the decrement field is disabled (and vice versa).
		 * @method amendLicenseTransaction
		 */
		amendLicenseTransaction : function() {

			var otherField = "";
			if("inc_amt" === this.get("id"))
			{
				otherField = dj.byId("dec_amt");
			}
			else if("dec_amt" === this.get("id"))
			{
				otherField = dj.byId("inc_amt");
			}
			else if("additional_inc_amt" === this.get("id"))
			{
				otherField = dj.byId("additional_dec_amt");
			}
			else if("additional_dec_amt" === this.get("id"))
			{
				otherField = dj.byId("additional_inc_amt");
			}
			
			if(!isNaN(this.get("value"))) {
				otherField.set("disabled", true);
			} else {
				this.set("disabled", false);
				otherField.set("disabled", false);
			}
			_calculateNewLicenseAmt(this);
		}, 
		
		/**
		 * <h4>Summary:</h4>
		 * This function is to toggle the additional amount details field if additional amount
		 * is added while creating the license.
		 * 
		 * @method handleAdditionalAmountDetails
		 */
		handleAdditionalAmountDetails : function() {
			if(dj.byId("additional_amt") && dj.byId("org_additional_amt"))
			{
				var addAmtVal = d.number.parse(dj.byId("additional_amt").get("displayedValue")),
				orgAddAmtVal = d.number.parse(dj.byId("org_additional_amt").get("displayedValue"));
				addAmtVal = !isNaN(addAmtVal) ? addAmtVal : 0;
				orgAddAmtVal = !isNaN(orgAddAmtVal) ? orgAddAmtVal : 0;
				if(addAmtVal == orgAddAmtVal || dj.byId("additional_amt").get("value") === 0)
				{
					dj.byId("narrative_additional_amount").set("disabled", true);
					dj.byId("narrative_additional_amount").set("value", dj.byId("org_narrative_additional_amount").get("value"));
					m.toggleRequired("narrative_additional_amount", false);
					if(d.byId("narrative_additional_amount_img")){
						d.byId("narrative_additional_amount_img").style.display = "none";					
						dj.byId("narrative_additional_amount_img").set("disabled", true);
					}
				}
				else
				{
					dj.byId("narrative_additional_amount").set("disabled", false);
					m.toggleRequired("narrative_additional_amount", true);
					d.byId("narrative_additional_amount_img").style.display = "block";
					dj.byId("narrative_additional_amount_img").set("disabled", false);
				}
			}
		},
		
		/**
		 * <h4>Summary:</h4>
		 * This function is to validate the increment amount for license amendment.
		 * <h4>Description:</h4> 
		 * Validates that the increment amount must not be greater than
		 * Number.MAX_VALUE. Else throws error.
		 * @param {dijit._Widget} node
		 * Increment amount field node 
		 * @param {String} product code
		 * Product code of the license transaction
		 * @method validateIncAmount
		 */
		validateIncAmount : function(/*dijit._Widget || DomNode || String*/ node, 
					/*String*/ productCode){
			var widget = dj.byId(node);
			var incValue = widget.get("value");
			var orgAmtVal = d.number.parse(dj.byId("org_" + productCode + "_amt").get("displayedValue"));
			orgAmtVal = !isNaN(orgAmtVal) ? orgAmtVal : 0;
			if(!isNaN(incValue))
			{
				if((incValue + orgAmtVal) > Number.MAX_VALUE)
				{
					console.debug("Invalid Increment Amount");
					m.showTooltip(m.getLocalization("maximumValueError"),
							widget.domNode, ["after"]);
					widget.state = "Error";
					widget._setStateClass();
					dj.setWaiState(widget.focusNode, "invalid", "true");
				}
			}
		},
		
		/**
		 * <h4>Summary:</h4>
		 * This function is to validate the decrement amount for license amendment.
		 * <h4>Description:</h4> 
		 * Validates that the decrement amount must not be greater than
		 * the license original amount. Else throws error.
		 * @param {dijit._Widget} node
		 * Decrement amount field node 
		 * @param {String} product code
		 * Product code of the license transaction
		 * @method validateDecAmount
		 */
		validateDecAmount : function(/*dijit._Widget || DomNode || String*/ node, 
				/*String*/ productCode){
			var widget = dj.byId(node);
			var decValue = widget.get("value");
			var orgAmtVal = d.number.parse(dj.byId("org_" + productCode + "_amt").get("displayedValue"));
			orgAmtVal = !isNaN(orgAmtVal) ? orgAmtVal : 0;
			if(!isNaN(decValue))
			{
				if((orgAmtVal - decValue) < 0)
				{
					console.debug("Invalid Decrement Amount");
					m.showTooltip(m.getLocalization("amendAmountLessThanOriginalError"),
							widget.domNode, ["after"]);
					widget.state = "Error";
					widget._setStateClass();
					dj.setWaiState(widget.focusNode, "invalid", "true");
				}
			}
		},
		
		/**
		 * <h4>Summary:</h4>
		 * This function is to set the valid to date field for the license
		 * by calculating the date from the valid from and valid for period field values
		 * @method setValidToDate
		 */
		setValidToDate: function() {
			var validFromDate 			= dj.byId("valid_from_date"),
				validForNb    			= dj.byId("valid_for_nb"),
				validForPeriod  		= dj.byId("valid_for_period"),
				validToDate 			= dj.byId("valid_to_date"),
				milliSecTillValidity	= null,
				isPreCondStsfd 			= true;
			if(validFromDate && (validFromDate.get("value") === null || validFromDate.get("value") ===""))
			{
				isPreCondStsfd = false;
			}
			if(validForNb && (validForNb.get("value") === null || validForNb.get("value") ==="" || isNaN(validForNb.get("value"))))
			{
				isPreCondStsfd = false;
			}
			if(validForPeriod && (validForPeriod.get("value") === null || validForPeriod.get("value") ===""))
			{
				isPreCondStsfd = false;
			}
			if(validToDate)
			{
				if(isPreCondStsfd)
				{
					 switch (validForPeriod.get("value")) {
						case "01":	 
							milliSecTillValidity = d.date.add(validFromDate.get("value"), "day", validForNb.get("value"));
							break;
						case "02":	
							milliSecTillValidity = d.date.add(validFromDate.get("value"), "week", validForNb.get("value"));		
							break;
						case "03":	
							milliSecTillValidity = d.date.add(validFromDate.get("value"), "month", validForNb.get("value"));
							break;
						case "04":	
							milliSecTillValidity = d.date.add(validFromDate.get("value"), "year", validForNb.get("value"));		
							break;
						default:
							break;
					}
					 validToDate.set("value", milliSecTillValidity);
					 var currentDate = new Date();
					 // set the hours to 0 to compare the date values
					 currentDate.setHours(0, 0, 0, 0);
					 var isValid = d.date.compare(m.localizeDate(dj.byId("valid_to_date")), currentDate) < 0 ? false : true;
					 if(isValid)
					 {
						 validToDate.set("disabled", true);
					 }
					 else
					 {
						 validToDate.set("disabled", false);
						 validForNb.set("value", "");
						 validForPeriod.set("value", "");
						 validForPeriod.set("disabled", true);
					 }
				}
				else
				{
					validToDate.set("disabled", false);
				}
			}
		},
		
		/**
		 * <h4>Summary:</h4>
		 * This function is to Query the list of licenses to be linked to the Product and show it as a popup.
		 * @param {String} product code
		 * Product code of the transaction to which license is getting linked
		 * @method getLicenses
		 */
		getLicenses: function(/*String*/ productCode) {
			var curCodeField = productCode+"_cur_code";
			var beneficiaryName = dj.byId("beneficiary_name")?dj.byId("beneficiary_name").get("value"):"";
			if(productCode === "br")
			{
				curCodeField = "bg_cur_code";
				beneficiaryName = dj.byId("beneficiary_abbv_name")?dj.byId("beneficiary_abbv_name").get("value"):beneficiaryName;
			}
			var curCode = dj.byId(curCodeField)?dj.byId(curCodeField).get("value"):"";
			var entity = dj.byId("entity")?dj.byId("entity").get("value"):"";
			var matDate = d.byId("maturity_date")?d.byId("maturity_date").value:"";
			var applicantName = dj.byId("applicant_name")?dj.byId("applicant_name").get("value"):"";
			var expDate = d.byId("exp_date")?d.byId("exp_date").value:"";
			var issDate = d.byId("iss_date")?d.byId("iss_date").value:"";
			var lastShipDate = d.byId("last_ship_date")?d.byId("last_ship_date").value:"";
			var finalExpDate = d.byId("final_expiry_date")?d.byId("final_expiry_date").value:"";
			var subProductCode = dj.byId("sub_product_code")?dj.byId("sub_product_code").get("value"):"*";
			var bankAbbvName = null;
			var menufrom = null;
			
			var productTypeCode = "";
			if((productCode === "bg") || (productCode === "br")){
				productTypeCode = dj.byId("bg_type_code")?dj.byId("bg_type_code").get("value"):"*";
			} else if (productCode === "si"){
				productTypeCode = dj.byId("product_type_code")?dj.byId("product_type_code").get("value"):"*";
			}
			if(productTypeCode === ""){
				productTypeCode = "*";
			}
			if((productCode === "ec") || (productCode === "ic"))
			{
				var drawerName = dj.byId("drawer_name")?dj.byId("drawer_name").get("value"):"";
				var draweeName = dj.byId("drawee_name")?dj.byId("drawee_name").get("value"):"";
				if(productCode === "ec")
				{
				if(m._config.licenseBeneficiaryEnabled===true)
				{
					if (curCode === "" || draweeName === "" || drawerName === "")
					{
						m.dialog.show("ERROR", m.getLocalization("selectRequiredValuesFirstforCollections"));
						return;
					}
				}
				else
				{
					if (curCode === "" || draweeName === "")
					{
						m.dialog.show("ERROR", m.getLocalization("selectRequiredValuesFirstforCollectionsWithoutBenf"));
						return;
					}
				}
			}
				
				if(productCode === "ic")
				{
					if (curCode === "" || draweeName === "")
					{
						m.dialog.show("ERROR", m.getLocalization("selectRequiredValuesFirstforImportCollections"));
						return;
					}
			}
				if(productCode === "ec")		
				{
					bankAbbvName = dj.byId("remitting_bank_abbv_name") ? dj.byId("remitting_bank_abbv_name").get("value") : "";
					m.showSearchDialog("license_item","['ls_ref_id', 'bo_ref_id', 'ls_number','ls_curr','ls_allocated_amt', 'ls_amt', 'ls_os_amt', 'converted_os_amt', 'allow_overdraw']",
							{cur_code: curCode, entity: entity, beneficiary: draweeName, product_code: productCode.toUpperCase(), sub_product_code: subProductCode , bank_abbv_name : bankAbbvName},"",
							productCode.toUpperCase(),"width:1100px;height:350px;", m.getLocalization("ListOfLicensesTitleMessage"));
				}
				else
				{
					m.showSearchDialog("license_item","['ls_ref_id', 'bo_ref_id', 'ls_number','ls_curr','ls_allocated_amt', 'ls_amt', 'ls_os_amt', 'converted_os_amt', 'allow_overdraw']",
							{cur_code: curCode, entity: entity, beneficiary: dj.byId("drawee_abbv_name")?dj.byId("drawee_abbv_name").get("value"):"", product_code: productCode.toUpperCase(), sub_product_code: subProductCode},"",
							productCode.toUpperCase(),"width:1100px;height:350px;", m.getLocalization("ListOfLicensesTitleMessage"));
				}
			}
			else if(productCode === "el")
			{
				curCodeField = "lc_cur_code";
				curCode = dj.byId(curCodeField)?dj.byId(curCodeField).get("value"):"";
				beneficiaryName = dj.byId("beneficiary_abbv_name")?dj.byId("beneficiary_abbv_name").get("value"):beneficiaryName;
				if(dj.byId("option") && dj.byId("option").get("value") === "ASSIGNEE")
				{
					expDate = dj.byId("assignee_exp_date") ? dj.byId("assignee_exp_date").get("value") : "";
				}
				if (curCode === "" || beneficiaryName === "" || expDate === "")
				{
					m.dialog.show("ERROR", m.getLocalization("selectRequiredValuesFirstForEL"));
					return;
				}
				m.showSearchDialog("license_item","['ls_ref_id', 'bo_ref_id', 'ls_number','ls_curr','ls_allocated_amt', 'ls_amt', 'ls_os_amt', 'converted_os_amt', 'allow_overdraw']",
						{cur_code: curCode, entity: entity, beneficiary: beneficiaryName, product_code: productCode.toUpperCase(), sub_product_code: subProductCode, exp_date: expDate, last_ship_date: lastShipDate},"",
						productCode.toUpperCase(),"width:1100px;height:350px;", m.getLocalization("ListOfLicensesTitleMessage"));
			}
			else if(productCode === "br")
			{
				if (curCode === "" || beneficiaryName === "" || expDate === "")
				{
					m.dialog.show("ERROR", m.getLocalization("selectRequiredValuesFirstForEL"));
					return;
				}
				m.showSearchDialog("license_item","['ls_ref_id', 'bo_ref_id', 'ls_number','ls_curr','ls_allocated_amt', 'ls_amt', 'ls_os_amt', 'converted_os_amt', 'allow_overdraw']",
						{cur_code: curCode, entity: entity, beneficiary: beneficiaryName, product_code: productCode.toUpperCase(), sub_product_code: subProductCode, exp_date: expDate, last_ship_date: lastShipDate},"",
						productCode.toUpperCase(),"width:1100px;height:350px;", m.getLocalization("ListOfLicensesTitleMessage"));
			}
			
			else if(productCode === "tf")
				{
				curCodeField = "fin_cur_code";
				curCode = dj.byId(curCodeField)?dj.byId(curCodeField).get("value"):"";
				menufrom = dijit.byId("menu_from")?dijit.byId("menu_from").get("value"):"";
				if (curCode === "" || applicantName === "")
				{
					m.dialog.show("ERROR", m.getLocalization("selectRequiredValuesFirstWithoutBenf"));
					return;	
				}
				m.showSearchDialog("license_item","['ls_ref_id', 'bo_ref_id', 'ls_number','ls_curr','ls_allocated_amt', 'ls_amt', 'ls_os_amt', 'converted_os_amt', 'allow_overdraw']",
						{cur_code: curCode, entity: entity,  product_code: productCode.toUpperCase(), sub_product_code: subProductCode, menu_from: menufrom, mat_date: matDate},"",
						productCode.toUpperCase(),"width:1100px;height:350px;", m.getLocalization("ListOfLicensesTitleMessage"));
				}
			else if(productCode === "ft" && subProductCode === "TTPT")
			{
			curCodeField = "ft_cur_code";
			curCode = dj.byId(curCodeField)?dj.byId(curCodeField).get("value"):"";
			beneficiaryName = dj.byId("counterparty_name");
			if(m._config.licenseBeneficiaryEnabled===true)
			{
				if (curCode === "" || beneficiaryName === "" || issDate === "" || applicantName === "")
				{
					m.dialog.show("ERROR", m.getLocalization("selectRequiredValuesFirst"));
					return;
				}
			}
			else
			{
				if (curCode === "" || issDate === "" || applicantName === "")
				{
					m.dialog.show("ERROR", m.getLocalization("selectRequiredValuesFirstWithoutBenf"));
					return;
				}
			}

			m.showSearchDialog("license_item","['ls_ref_id', 'bo_ref_id', 'ls_number','ls_curr','ls_allocated_amt', 'ls_amt', 'ls_os_amt', 'converted_os_amt', 'allow_overdraw']",
					{cur_code: curCode, entity: entity,  product_code: productCode.toUpperCase(), sub_product_code: subProductCode},"",
					productCode.toUpperCase(),"width:1100px;height:350px;", m.getLocalization("ListOfLicensesTitleMessage"));
			}
			else if(productCode === "ft" && subProductCode === "TINT")
			{
				curCodeField = "counterparty_cur_code";
				curCode = dj.byId(curCodeField)?dj.byId(curCodeField).get("value"):"";
			if (curCode === "" || applicantName === "" || issDate === "")
			{
				m.dialog.show("ERROR", m.getLocalization("selectRequiredValuesFirstForFTWithoutBenf"));
				return;
			}
			m.showSearchDialog("license_item","['ls_ref_id', 'bo_ref_id', 'ls_number','ls_curr','ls_allocated_amt', 'ls_amt', 'ls_os_amt', 'converted_os_amt', 'allow_overdraw']",
					{cur_code: curCode, entity: entity,  product_code: productCode.toUpperCase(), sub_product_code: subProductCode},"",
					productCode.toUpperCase(),"width:1100px;height:350px;", m.getLocalization("ListOfLicensesTitleMessage"));
			}
			else
			{
				// Amendment scenario
				if(dj.byId("org_exp_date") && expDate === "")
				{
					expDate = dj.byId("org_exp_date").get("value");
				}
				//Renewal Scenario for BG and relevant products	
				if((dj.byId("renew_flag") && (dj.byId("renew_flag").get("checked") === true)) && (finalExpDate === "" || finalExpDate === null)){					
					m.dialog.show("ERROR", m.getLocalization("enterRenewalDetails"));
					return;
				}
				else if((dj.byId("renew_flag") && (dj.byId("renew_flag").get("checked") === true)) && finalExpDate && finalExpDate !== "")
				{
					expDate = finalExpDate;
				}
				if(m._config.licenseBeneficiaryEnabled===true)
				{
					if (curCode === "" || beneficiaryName === "" || expDate === "" || applicantName === "")
					{
						m.dialog.show("ERROR", m.getLocalization("selectRequiredValuesFirst"));
						return;
					}
				}
				else
				{
					if (curCode === "" || expDate === "" || applicantName === "")
					{
						m.dialog.show("ERROR", m.getLocalization("selectRequiredValuesFirstWithoutBenf"));
						return;
					}
				}
				
				if(productCode === "lc")
				{
					bankAbbvName = dj.byId("issuing_bank_abbv_name")? dj.byId("issuing_bank_abbv_name").get("value") : "";
				}
				else if(productCode === "bg")
				{
					bankAbbvName = dj.byId("recipient_bank_abbv_name")? dj.byId("recipient_bank_abbv_name").get("value") : "";
				}
				m.showSearchDialog("license_item","['ls_ref_id', 'bo_ref_id', 'ls_number','ls_curr','ls_allocated_amt', 'ls_amt', 'ls_os_amt', 'converted_os_amt', 'allow_overdraw']",
						{cur_code: curCode, entity: entity, beneficiary: beneficiaryName, product_code: productCode.toUpperCase(), sub_product_code: subProductCode, exp_date: expDate, last_ship_date: lastShipDate, product_type_code: productTypeCode, bank_abbv_name : bankAbbvName},"",
						productCode.toUpperCase(),"width:1100px;height:350px;", m.getLocalization("ListOfLicensesTitleMessage"));
			}
			
		},
		/**
		 * <h4>Summary:</h4>
		 * This function is used to clear the complete license item grid when currency, entity or beneficiary name is changed
		 * @param {dijit._Widget || DomNode || String} field
		 * DomNode of the field that is changed
		 * @param {String} Old Value
		 * Old Value of the field
		 * @method clearLicenseGrid
		 */
		clearLicenseGrid : function(/*dijit._Widget || DomNode || String*/ field, /*String*/ oldValue, productCode) {
			var emptyCells = { items: "" };
			var items=[];
			var grid = dj.byId("gridLicense");
			var isValueChanged = field.get("displayedValue") !== oldValue;
			if(field.id === "entity")
			{
				isValueChanged = field.get("displayedValue") !== oldValue.entity;
			}
			else if(field.id === "beneficiary_name")
			{
				isValueChanged = field.get("displayedValue") !== oldValue.name;
			}
			else if(field.id === "drawee_name")
			{
				isValueChanged = field.get("displayedValue") !== oldValue.name;
			}
			else if(field.id === "renew_flag")
			{
				isValueChanged = field.get("checked") !== oldValue;
			}
			else if(field.id === "bg_type_code")
			{
				isValueChanged = field.get("value") !== oldValue;
			}
			if(grid && grid.store && grid.store._arrayOfTopLevelItems && grid.store._arrayOfTopLevelItems.length !== 0 && isValueChanged)
			{
				var message = misys.getLocalization("resetLicenseGrid");
				var emptyStore = new dojo.data.ItemFileWriteStore({data: emptyCells});
				var okCallback = function()
				{
					items = grid.store._arrayOfTopLevelItems;
					// destroying the widgets
					for(var i=0; i < items.length; i++)
					{
						if(dj.byId("licenseAmt_"+i))
						{
							dj.byId("licenseAmt_"+i).destroy(true);
						}
					}
					// Clearing the grid
					grid.setStore(emptyStore);
					if(field.id === "exp_date")
					{
						m._config.expDate = field.get("displayedValue");
					}
					else if(field.id === "entity" && ( productCode !=="ec" && productCode !=="ic" && productCode !=="el" && productCode !== "br") )
					{
						m._config.applicant.entity = field.get("value");
						m._config.applicant.name = dj.byId("applicant_name").get("value");
						m._config.applicant.addressLine1 = dj.byId("applicant_address_line_1").get("value");
						m._config.applicant.addressLine2 = dj.byId("applicant_address_line_2").get("value");
						m._config.applicant.dom = dj.byId("applicant_dom").get("value");
					}
					else if(field.id === "entity")
					{
						if((productCode ==="ec"))
						{
							m._config.drawer.entity = field.get("value");
							m._config.drawer.name = dj.byId("drawer_name").get("value");
							m._config.drawer.addressLine1 = dj.byId("drawer_address_line_1").get("value");
							m._config.drawer.addressLine2 = dj.byId("drawer_address_line_2").get("value");
							m._config.drawer.dom = dj.byId("drawer_dom").get("value");
						}
						else if(productCode ==="ic")
						{
							m._config.drawee.entity = field.get("value");
							m._config.drawee.name = dj.byId("drawee_name").get("value");
							m._config.drawee.addressLine1 = dj.byId("drawee_address_line_1").get("value");
							m._config.drawee.addressLine2 = dj.byId("drawee_address_line_2").get("value");
							m._config.drawee.dom = dj.byId("drawee_dom").get("value");
						}
					}
					else if(field.id === "beneficiary_name")
					{
						m._config.beneficiary.name = dj.byId("beneficiary_name").get("value");
						if(productCode === "el" || productCode === "br")
						{
							m._config.beneficiary.abbvName = dj.byId("beneficiary_abbv_name").get("value");
							m._config.beneficiary.entity = dj.byId("entity").get("value");
						}
						m._config.beneficiary.addressLine1 = dj.byId("beneficiary_address_line_1").get("value");
						m._config.beneficiary.addressLine2 = dj.byId("beneficiary_address_line_2").get("value");
						m._config.beneficiary.dom = dj.byId("beneficiary_dom").get("value");
					}
					
					else if(field.id === "drawee_name" && (productCode ==="ec"  || productCode ==="ic"))
					{ 
						m._config.drawee.name = field.get("value");
						if(productCode ==="ic")
						{
							m._config.drawee.entity = dj.byId("entity").get("value");
						}
						m._config.drawee.addressLine1 = dj.byId("drawee_address_line_1").get("value");
						m._config.drawee.addressLine2 = dj.byId("drawee_address_line_2").get("value");
						m._config.drawee.dom = dj.byId("drawee_dom").get("value");
					}
					else if(field.id === "lc_cur_code")
					{
						m._config.lcCurCode = field.get("displayedValue");
					}
					else if(field.id === "ec_cur_code")
					{
						m._config.ecCurCode = field.get("displayedValue");
					}
					else if(field.id === "ic_cur_code")
					{
						m._config.icCurCode = field.get("displayedValue");
					}
					else if(field.id === "bg_cur_code")
					{
						m._config.bgCurCode = field.get("displayedValue");
					}
					else if(field.id === "last_ship_date")
					{
						m._config.lastShipDate = field.get("displayedValue");
					}
					else if(field.id === "renew_flag")
					{
						m._config.renewFlag = field.get("checked");
						m.resetRenewalDetails(m._config.renewFlag, field);
					}
					else if(field.id === "bg_type_code")
					{
						m._config.bgTypeCode = field.get("value");
					}
				};
				var onCancelCallback = function() {
					if(field.id === "entity" && (productCode !=="ec" && productCode !=="ic" && productCode !=="el" && productCode !== "br"))
					{
						field.set("value", oldValue.entity);
						dj.byId("applicant_name").set("value", oldValue.name);
						dj.byId("applicant_address_line_1").set("value", oldValue.addressLine1);
						dj.byId("applicant_address_line_2").set("value", oldValue.addressLine2);
						dj.byId("applicant_dom").set("value", oldValue.dom);
					}
					
					else if(field.id === "entity")
					{
						if(productCode ==="ec")
						{
							field.set("value", oldValue.entity);
							dj.byId("drawer_name").set("value", oldValue.name);
							dj.byId("drawer_address_line_1").set("value", oldValue.addressLine1);
							dj.byId("drawer_address_line_2").set("value", oldValue.addressLine2);
							dj.byId("drawer_dom").set("value", oldValue.dom);
						}
						else if(productCode ==="ic")
						{
							field.set("value", oldValue.entity);
							dj.byId("drawee_name").set("value", oldValue.name);
							dj.byId("drawee_address_line_1").set("value", oldValue.addressLine1);
							dj.byId("drawee_address_line_2").set("value", oldValue.addressLine2);
							dj.byId("drawee_dom").set("value", oldValue.dom);
						}
					}
					else if(field.id === "beneficiary_name")
					{
						dj.byId("beneficiary_name").set("value", oldValue.name);
						if(productCode === "el" || productCode === "br")
						{
							dj.byId("beneficiary_abbv_name").set("value", oldValue.abbvName);
							dj.byId("entity") ? dj.byId("entity").set("value", oldValue.entity) : "";
						}
						dj.byId("beneficiary_address_line_1").set("value", oldValue.addressLine1);
						dj.byId("beneficiary_address_line_2").set("value", oldValue.addressLine2);
						dj.byId("beneficiary_dom").set("value", oldValue.dom);
					}
					else if(field.id === "drawee_name" && (productCode ==="ec" || productCode ==="ic"))
					{
						dj.byId("drawee_name").set("value", oldValue.name);
						if(productCode ==="ic")
						{
							dj.byId("entity").set("value", oldValue.entity);
						}
						dj.byId("drawee_address_line_1").set("value", oldValue.addressLine1);
						dj.byId("drawee_address_line_2").set("value", oldValue.addressLine2);
						dj.byId("drawee_dom").set("value", oldValue.dom);
						
					}
					else if(field.id === "renew_flag")
					{
						field.set("checked", oldValue);		
					}
					else if(field.id === "bg_type_code")
					{
						field.set("value", oldValue);	
					}
					else
					{
						field.set("displayedValue", oldValue);
					}
				};
				m.dialog.show("CONFIRMATION", message, "", "", "", "", okCallback, onCancelCallback);
			}
			else
			{
				if(field.id === "exp_date")
				{
					m._config.expDate = field.get("displayedValue");
				}
				else if(field.id === "entity" && (productCode !=="ec" && productCode !=="ic") && productCode !=="el" && productCode !=="br")
				{
					m._config.applicant.entity = field.get("value");
					m._config.applicant.name = dj.byId("applicant_name").get("value");
					m._config.applicant.addressLine1 = dj.byId("applicant_address_line_1").get("value");
					m._config.applicant.addressLine2 = dj.byId("applicant_address_line_2").get("value");
					m._config.applicant.dom = dj.byId("applicant_dom").get("value");
				}
				else if(field.id === "entity")
				{
					if((productCode ==="ec"))
					{
						m._config.drawer.entity = field.get("value");
						m._config.drawer.name = dj.byId("drawer_name").get("value");
						m._config.drawer.addressLine1 = dj.byId("drawer_address_line_1").get("value");
						m._config.drawer.addressLine2 = dj.byId("drawer_address_line_2").get("value");
						m._config.drawer.dom = dj.byId("drawer_dom").get("value");
					}
					else if(productCode ==="ic")
					{
						m._config.drawee.entity = field.get("value");
						m._config.drawee.name = dj.byId("drawee_name").get("value");
						m._config.drawee.addressLine1 = dj.byId("drawee_address_line_1").get("value");
						m._config.drawee.addressLine2 = dj.byId("drawee_address_line_2").get("value");
						m._config.drawee.dom = dj.byId("drawee_dom").get("value");
					}
				}
				else if(field.id === "beneficiary_name")
				{
					m._config.beneficiary.name = dj.byId("beneficiary_name").get("value");
					if(productCode === "el" || productCode === "br")
					{
						m._config.beneficiary.abbvName = dj.byId("beneficiary_abbv_name").get("value");
						m._config.beneficiary.entity = dj.byId("entity").get("value");
					}
					m._config.beneficiary.addressLine1 = dj.byId("beneficiary_address_line_1").get("value");
					m._config.beneficiary.addressLine2 = dj.byId("beneficiary_address_line_2").get("value");
					m._config.beneficiary.dom = dj.byId("beneficiary_dom").get("value");
				}
				
				else if(field.id === "drawee_name" && (productCode ==="ec"  || productCode ==="ic"))
				{ 
					m._config.drawee.name = field.get("value");
					if(productCode ==="ic")
					{
						m._config.drawee.entity = dj.byId("entity").get("value");
					}
					m._config.drawee.addressLine1 = dj.byId("drawee_address_line_1").get("value");
					m._config.drawee.addressLine2 = dj.byId("drawee_address_line_2").get("value");
					m._config.drawee.dom = dj.byId("drawee_dom").get("value");
				}
				else if(field.id === "lc_cur_code")
				{
					m._config.lcCurCode = field.get("displayedValue");
				}
				else if(field.id === "ec_cur_code")
				{
					m._config.ecCurCode = field.get("displayedValue");
				}
				else if(field.id === "ic_cur_code")
				{
					m._config.icCurCode = field.get("displayedValue");
				}
				else if(field.id === "bg_cur_code")
				{
					m._config.bgCurCode = field.get("displayedValue");
				}
				else if(field.id === "last_ship_date")
				{
					m._config.lastShipDate = field.get("displayedValue");
				}
				else if(field.id === "renew_flag")
				{
					m._config.renewFlag = field.get("checked");
					m.resetRenewalDetails(m._config.renewFlag, field);
				}
				else if(field.id === "bg_type_code")
				{
					m._config.bgTypeCode = field.get("value");
				}
			}
		},

		
		/**
		 * <h4>Summary:</h4>
		 * This function is used to validate the selected licenses on the multiple license allowed flag.
		 * If allow_multiple_license field is Y in the License definition, then only multiple selection will be allowed
		 * @param {Object} Grid
		 * Popup Grid
		 * @param {Object} curCode
		 * currency Code Object
		 * @method fetchLicenseRecords
		 */
		fetchLicenseRecords: function(/* Dojox Grid*/ grid, /*String*/ curCode) {
			
			var numSelected = grid.selection.getSelected().length;
			var storeSize	= grid.store? grid.store._arrayOfAllItems.length:0;
			var existingStoreSize = dj.byId("gridLicense").store ? dj.byId("gridLicense").store._arrayOfTopLevelItems.length : 0;
			var isValid = true;
			var message = m.getLocalization("multipleLicenseSelectionNotAllowedError");
			
			/*handling the null selection, when search is entered in the popup, one extra null value comes under the grid.selection.getSelected()*/
			for(var l=0; l < grid.selection.getSelected().length; l++)
			{
				if(grid.selection.getSelected()[l] === null)
				{
					numSelected = l;
					break;
				}
			}
			if(numSelected !== 0)
			{
				// no licenses already selected
				if(existingStoreSize === 0)
				{
					if(numSelected > 1)
					{
						for(var i=0; i < numSelected; i++)
						{
							if (grid.selection.getSelected()[i] && grid.selection.getSelected()[i].ALLOW_MULTIPLE_LS[0] === "N")
							{
								isValid = false;
								m.dialog.show("ERROR", message);
							}
						}
					}
				}
				// one license already existing in the grid
				else if (existingStoreSize === 1)
				{
					var ref = dj.byId("gridLicense") ? dj.byId("gridLicense").store._arrayOfTopLevelItems[0].REFERENCEID[0] : "";
					var multipleLsFlagForExistingLsTnxInGrid;
					for(var j=0; j < grid.store._arrayOfAllItems.length; j++)
					{
						if(ref.slice() === grid.store._arrayOfAllItems[j].REFERENCEID[0].slice())
						{
							multipleLsFlagForExistingLsTnxInGrid = grid.store._arrayOfAllItems[j].ALLOW_MULTIPLE_LS[0];
							break;
						}
					}
					if (multipleLsFlagForExistingLsTnxInGrid === "N")
					{
						isValid = false;
						m.dialog.show("ERROR", message);
					}
					else
					{
						for(var n=0; n < numSelected; n++)
						{
							if (grid.selection.getSelected()[n] && grid.selection.getSelected()[n].ALLOW_MULTIPLE_LS[0] === "N")
							{
								isValid = false;
								m.dialog.show("ERROR", message);
							}
						}
					}
				}
				// multiple licenses already existing in the grid (obv have "Y" as the Multiple LS Allowed Flag)
				else if(existingStoreSize > 1)
				{
					for(var k=0; k < numSelected; k++)
					{
						if (grid.selection.getSelected()[k] && grid.selection.getSelected()[k].ALLOW_MULTIPLE_LS[0] === "N")
						{
							isValid = false;
							m.dialog.show("ERROR", message);
						}
					}
				}
			}
			
			if(isValid)
			{
				if(numSelected > 0 && storeSize > 0) {
					m.processLicenseRecords(grid, curCode);
				} 
				dj.byId("xhrDialog").hide();
			}
		},
		
		/**
		 * <h4>Summary:</h4>
		 * This function is used to create the license item grid after selection of a set of license is done.
		 * This function is also used to validate the license allocated amount widgets with the license actual amount.
		 * @param {Object} Grid
		 * Popup Grid
		 * @param {Object} curCode
		 * currency Code Object
		 * @method processLicenseRecords
		 */
		processLicenseRecords : function( /*Dojox Grid*/ grid, /*String*/ curCode) {
			var licenseData = dj.byId("gridLicense");
			
			//set an empty store
			var emptyStore = new dojo.data.ItemFileWriteStore({data:{"identifier":"REFERENCEID","items" :[]}});
			// Object to save grid data already present
			var obj= [];
			if(licenseData && licenseData.store && licenseData.store._arrayOfTopLevelItems.length >0) {
				licenseData.store.fetch({
					query: {REFERENCEID: '*'},
					onComplete: function(items, request){
						dojo.forEach(items, function(item){
							var refId = item.REFERENCEID.slice().toString();
							var boRefId = item.BO_REF_ID.slice().toString();
							var lsNumber = item.LS_NUMBER.slice().toString();
							var amount = item.LS_ALLOCATED_AMT;
							var lsAmtHidden = item.LS_AMT;
							var lsOsAmtHidden = item.LS_OS_AMT;
							var convertedOsAmtHidden = item.CONVERTED_OS_AMT;
							var allowOverdraw = item.ALLOW_OVERDRAW;
							var lsDeleteIconPath = "";
							if(d.byId("ls_delete_icon")!=null && d.byId("ls_delete_icon"))
							{
								lsDeleteIconPath = d.byId("ls_delete_icon").value;
							}
							var actn= "<img src="+lsDeleteIconPath+" onClick =\"javascript:misys.deleteLicenseRecord('" + item.REFERENCEID + "')\"/>";
							var newItem1 = {"REFERENCEID" : refId, "BO_REF_ID" : boRefId, "LS_NUMBER" : lsNumber, "ACTION" : actn, "LS_ALLOCATED_AMT" : amount, "LS_AMT" : lsAmtHidden, "LS_OS_AMT" : lsOsAmtHidden, "CONVERTED_OS_AMT" : convertedOsAmtHidden, "ALLOW_OVERDRAW" : allowOverdraw};
							emptyStore.newItem(newItem1);
							obj.push(item);
						});
					}
				});
			}
			
			var selItems = grid.selection.getSelected();
			//add - update
			if(selItems.length >0) {
				for(var i=0;i<selItems.length;i++) {
					var isDup= false;
					var amount = "";
					/*var addAmount = "";*/
					var newItem = {};
					var item=selItems[i];
					if(item !== null)
					{
						var refId = item.REFERENCEID.slice().toString();
						var lsNumber = item.LS_NUMBER.slice().toString();
						var boRefId = item.BO_REF_ID.slice().toString();
						var lsAmtHidden = item.LS_AMT;
						var lsOsAmtHidden = item.LS_OS_AMT;
						var convertedOsAmtHidden = item.CONVERTED_OS_AMT;
						var allowOverdraw = item.ALLOW_OVERDRAW;
						var lsDeleteIconPath = "";
						if(d.byId("ls_delete_icon")!=null && d.byId("ls_delete_icon"))
						{
							lsDeleteIconPath = d.byId("ls_delete_icon").value;
						}
						var actn= "<img src="+lsDeleteIconPath+" onClick =\"javascript:misys.deleteLicenseRecord('" + item.REFERENCEID + "')\"/>";
						if(obj.length>0) {
							for(var t=0;t<obj.length ; t++) {
								if(obj[t].REFERENCEID.slice().toString() === refId.slice().toString())	{
									isDup = true;
								}
							}
							if(!isDup) {
								var j, k;
								for(j=0; dj.byId("licenseAmt_"+j); j++)
								{
									continue;
								}
								amount = new misys.form.CurrencyTextBox({id:"licenseAmt_"+j , name:"licenseAmt_"+j, value:"", constraints:{min:0.00, max:999999999999.99}, readOnly:false, selectOnClick:true});
								if(curCode)
								{
									m.setCurrency(curCode, ["licenseAmt_"+j]);
								}
								misys.connect("licenseAmt_"+j, "onClick", function(){
									var widgetid = this.id;
									dijit.byId("gridLicense").onCellFocus = function(inCell, inRowIndex) {
										if(inCell.field === "LS_ALLOCATED_AMT"){
											dijit.byId(widgetid).textbox.focus();
										}
									    };
								});
								
								newItem = {"REFERENCEID" : refId, "BO_REF_ID" : boRefId, "LS_NUMBER" : lsNumber, "ACTION" : actn, "LS_ALLOCATED_AMT" : amount, "LS_AMT" : lsAmtHidden, "LS_OS_AMT" : lsOsAmtHidden, "CONVERTED_OS_AMT" : convertedOsAmtHidden, "ALLOW_OVERDRAW" : allowOverdraw};
								emptyStore.newItem(newItem);
								//Check whether the allocated amount is less than or equal to the original amount. Greater allocated amount allowed only if allow overdraw is Y
								misys.connect("licenseAmt_"+j, "onChange", function(){
									var enteredAmt = d.number.parse(this.get("value"));
									var convertedAmt = d.number.parse(dj.byId("gridLicense").store._arrayOfAllItems[(this.id).slice(-1)].CONVERTED_OS_AMT[0]);
									if(dj.byId("gridLicense").store._arrayOfAllItems[(this.id).slice(-1)].ALLOW_OVERDRAW[0] !== "Y" && (enteredAmt > convertedAmt))
									{
										var message = m.getLocalization("allocatedAmtGreaterThanAvailableLSAmtError");
										var widget = this;
										var callback = function() {
											widget.set("value", null);
										};
										m.dialog.show("ERROR", message, "", function()
										{
											setTimeout(callback, 500);
										});
	                  					
									}
								});
							}
						}
						else {
							amount = new misys.form.CurrencyTextBox({id:"licenseAmt_"+i , name:"licenseAmt_"+i, value:"", constraints:{min:0.00, max:999999999999.99}, readOnly:false, selectOnClick:true});
							if(curCode)
							{
								m.setCurrency(curCode, ["licenseAmt_"+i]);
							}
							misys.connect("licenseAmt_"+i, "onClick", function(){
								var widgetid = this.id;
								dijit.byId("gridLicense").onCellFocus = function(inCell, inRowIndex) {
									if(inCell.field === "LS_ALLOCATED_AMT"){
										dijit.byId(widgetid).textbox.focus();
									}
								    };
							});
							
							newItem = {"REFERENCEID" : refId, "BO_REF_ID" : boRefId, "LS_NUMBER" : lsNumber, "ACTION" : actn, "LS_ALLOCATED_AMT" : amount, "LS_AMT" : lsAmtHidden, "LS_OS_AMT" : lsOsAmtHidden, "CONVERTED_OS_AMT" : convertedOsAmtHidden, "ALLOW_OVERDRAW" : allowOverdraw};
							emptyStore.newItem(newItem);
							//Check whether the allocated amount is less than or equal to the original amount. Greater allocated amount allowed only if allow overdraw is Y
							misys.connect("licenseAmt_"+i, "onChange", function(){
								var enteredAmt = d.number.parse(this.get("value"));
								var convertedAmt = d.number.parse(dj.byId("gridLicense").store._arrayOfAllItems[(this.id).slice(-1)].CONVERTED_OS_AMT[0]);
								if(dj.byId("gridLicense").store._arrayOfAllItems[(this.id).slice(-1)].ALLOW_OVERDRAW[0] !== "Y" && (enteredAmt > convertedAmt))
								{
									var message = m.getLocalization("allocatedAmtGreaterThanAvailableLSAmtError");
									var widget = this;
									var callback = function() {
										widget.set("value", null);
									};
									m.dialog.show("ERROR", message, "", function()
									{
										setTimeout(callback, 500);
									});
								}
							});
						}
					}
				}
			}
			
			if(licenseData)
			{
				licenseData.setStore(emptyStore);
				dojo.style(licenseData.domNode, "display", "");
				licenseData.resize();
			}
		},
		
		/**
		 * <h4>Summary:</h4>
		 * This function is used to delete a particular license record.
		 * @param {String} Reference
		 * Reference Id of the row to be deleted
		 * @method deleteLicenseRecord
		 */
		deleteLicenseRecord : function(/*String*/ ref) {
			var items=[];
			dj.byId("gridLicense").store.fetch({
				query: {REFERENCEID: '*'},
				onComplete: dojo.hitch(dj.byId("gridLicense"), function(items, request){
					dojo.forEach(items, function(item){
						if(item.REFERENCEID.slice().toString() === ref.slice().toString())
						{
							dj.byId("gridLicense").store.deleteItem(item);
							var widgetid1 = item.LS_ALLOCATED_AMT[0].id;
							if(dj.byId(widgetid1))
							{
								dj.byId(widgetid1).destroy(true);
							}
						}
					});
				})
			});
			
			dj.byId("gridLicense").resize();
			dj.byId("gridLicense").render();
		},
		
		/**
		 * <h4>Summary:</h4>
		 * This function is used to populate the license grid on form load.
		 * And create connect events on the license allocated amount widgets for validation against actual amount.
		 * @param {String} productCode
		 * Product Code
		 * @method populateGridOnLoad
		 */
		populateGridOnLoad : function(/*String*/ productCode) {
			//Populate the grid on form load.
			var licenseData = dj.byId("gridLicense");
			if(licenseData && linkedLsItems && linkedLsItems.length > 0)
			{
				//set an empty store
				var emptyStore = new dojo.data.ItemFileWriteStore({data:{"identifier":"REFERENCEID","items" :[]}});
				//add - update
				if(dj.byId("gridLicense") && linkedLsItems && linkedLsItems.length > 0) {
					for(var i=0;i<linkedLsItems.length;i++) {
						var lsAmount = "";
						var lsAddAmount = "";
						var item=linkedLsItems[i];
						var refId = item.REFERENCEID.slice().toString();
						var boRefId = item.BO_REF_ID.slice().toString();
						var lsNumber = item.LS_NUMBER.slice().toString();
						var amount = item.LS_ALLOCATED_AMT;
						var lsAmtHidden = item.LS_AMT;
						var lsOsAmtHidden = item.LS_OS_AMT;
						var convertedOsAmtHidden = item.CONVERTED_OS_AMT;
						var allowOverdraw = item.ALLOW_OVERDRAW;
						var lsDeleteIconPath = "";
						if(!dj.byId("licenseAmt_"+i))
						{
							lsAmount = new misys.form.CurrencyTextBox({id:"licenseAmt_"+i , name:"licenseAmt_"+i, value:amount, constraints:{min:0.00, max:999999999999.99}, readOnly:false, selectOnClick:true});
							if(productCode !== null && dj.byId(productCode+"_cur_code"))
							{
								m.setCurrency(dj.byId(productCode+"_cur_code"), ["licenseAmt_"+i]);
							}
							misys.connect("licenseAmt_"+i, "onClick", function(){
								var widgetid = this.id;
								dijit.byId("gridLicense").onCellFocus = function(inCell, inRowIndex) {
									if(inCell.field === "LS_ALLOCATED_AMT"){
										dijit.byId(widgetid).textbox.focus();
									}
								    };
							});
							//Check whether the allocated amount is less than or equal to the original amount. Greater allocated amount allowed only if allow overdraw is Y
							misys.connect("licenseAmt_"+i, "onChange", function(){
								var enteredAmt = d.number.parse(this.get("value"));
								var convertedAmt = d.number.parse(dj.byId("gridLicense").store._arrayOfAllItems[(this.id).slice(-1)].CONVERTED_OS_AMT[0]);
								if(dj.byId("gridLicense").store._arrayOfAllItems[(this.id).slice(-1)].ALLOW_OVERDRAW[0] !== "Y" && (enteredAmt > convertedAmt))
								{
									var message = m.getLocalization("allocatedAmtGreaterThanAvailableLSAmtError");
									var widget = this;
									var callback = function() {
										widget.set("value", null);
									};
									m.dialog.show("ERROR", message, "", function()
									{
										setTimeout(callback, 500);
									});
								}
							});
						}
						if(d.byId("ls_delete_icon")!=null && d.byId("ls_delete_icon"))
						{
							lsDeleteIconPath = d.byId("ls_delete_icon").value;
						}
						var actn= "<img src="+lsDeleteIconPath+" onClick =\"javascript:misys.deleteLicenseRecord('" + item.REFERENCEID + "')\"/>";
						
						dijit.byId("gridLicense").onCellFocus = function(inCell, inRowIndex) {
								//do nothing
						   };
						var newItem = {"REFERENCEID" : refId, "BO_REF_ID" : boRefId, "LS_NUMBER" : lsNumber, "ACTION" : actn, "LS_ALLOCATED_AMT" : lsAmount, "LS_AMT" : lsAmtHidden, "LS_OS_AMT" : lsOsAmtHidden, "CONVERTED_OS_AMT" : convertedOsAmtHidden, "ALLOW_OVERDRAW" : allowOverdraw};
						emptyStore.newItem(newItem);
					}
				}
				licenseData.setStore(emptyStore);
				dojo.style(licenseData.domNode, "display", "");
				licenseData.resize();
			}
			else if(dj.byId("gridLicense")){
			dojo.style(dj.byId("gridLicense").domNode, "display", "none");
			}
		},
		
		/**
		 * <h4>Summary:</h4>
		 * This function is used to validate the total allocated amount with the product amount.
		 * @param {String} product code
		 * Product code of the transaction to which license is getting linked
		 * @method validateLSAmtSumAgainstTnxAmt
		 */
		validateLSAmtSumAgainstTnxAmt : function(/*String*/ productCode) {
			var licenseData = dj.byId("gridLicense");
			var sum = 0, lsAmt;
			if(licenseData && licenseData.store && licenseData.store._arrayOfTopLevelItems && licenseData.store._arrayOfTopLevelItems.length > 0)
			{
				for(var i=0; i < licenseData.store._arrayOfTopLevelItems.length; i++)
				{
					if((dj.byId("licenseAmt_"+i) && dj.byId("licenseAmt_"+i).state === "Error"))
					{
						m._config.onSubmitErrorMsg =  m.getLocalization("focusOnErrorAlert");
						return false;
					}
					else if(dj.byId("licenseAmt_"+i))
					{
						lsAmt = d.number.parse(dj.byId("licenseAmt_"+i).get("value"));
						if (isNaN(lsAmt))
						{
							m._config.onSubmitErrorMsg =  m.getLocalization("noLicenseAmountError");
							return false;
						}
						sum = sum + (isNaN(lsAmt)?0:lsAmt);
					}
					
					if(dj.byId("licenseAmt_"+i) && dj.byId("licenseAmt_"+i).get("value") === 0)
					{
					 m._config.onSubmitErrorMsg =  m.getLocalization("licenseValueZeroError");
					 return false;
					}
				}
				if(dj.byId(productCode+"_amt") && (sum !== dj.byId(productCode+"_amt").value))
				{
					m._config.onSubmitErrorMsg =  m.getLocalization("licensesSumGreaterThanTnxAmountError");
					return false;
				}
			}
			return true;
		}
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require("misys.client.binding.trade.ls_common_client");