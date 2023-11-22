dojo.provide("misys.validation.common");
dojo.require("dojox.validate.web");


//
// Copyright (c) 2000-2011 Misys (http://www.misys.com), All Rights Reserved.
// version:   1.3
// date:      08/04/11
// author:    Cormac Flynn
//
/**
 * <h4>Summary:</h4> Common Javascript Validations (validations used across forms)
 * 
 * <h4>Description:</h4>  Note: Previously, validations were required to match a certain
 * code template. This is no longer the case - consult the functions
 * misys.setValidation and _wrapValidation in misys.common for an explanation.
 * 
 * Validation functions should take no parameters. If you have to pass
 * parameters, you should probably find another way to do it.
 * 
 * Note that in each validation, "this" always refers to the field itself
 * 
 * @class common(Validation)
 
 */
(function(/* Dojo */d, /* Dijit */dj, /* Misys */m) {
	
	"use strict"; // ECMA5 Strict Mode
	
	/**
	 * <h4>Summary:</h4>
	 * This function is to validate the content of the specified field against the given character set.
	 * In this we have a string of valid characters we validate all of our characters passed.
	 * @param {Widget} field
	 * Field to validate
	 * @param {String} strValidCharachters
	 * A string of valid characters.
	 * @method _validateChar
	 */
	var falseMessage="message is false";
	var chkPoRefAct=m.getServletURL("/screen/AjaxScreen/action/CheckPoReferenceAction");
	var currISOCode=m.getServletURL("/screen/AjaxScreen/action/GetCurrencyISOCodes");
	var custmNoCancel="CUSTOM-NO-CANCEL";
	var failedMandatoryField="[Could not validate mandatory field] ";
	var currntDatevalue="[misys.validation.common] Current Date Value = ";
	var ExpDateValue="[misys.validation.common] Validating Expiry Date. Value = ";
	var ExpDateCurrntDate="[misys.validation.common] Days difference between expiry date and current date = ";
	var validateCurrError="[misys.validation.common] validateCurrency error";
	var validateAbbNameFormat="[misys.validation.common] Validating Abbv Name Format, Value =";
	var validateCurrValue="[misys.validation.common] Validating Currency. Value";
	var appJson ="application/json; charset=utf-8";
	function _validateChar( /*Widget*/ field, 
							/*String*/ strValidCharacters) {
		if(!strValidCharacters){
			strValidCharacters = 
				" 0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ/-?:().,+_";
		}
		
		return d.every(field.get("value"), function(theChar){
			return strValidCharacters.indexOf(theChar) >= 0;
		});
	}
	
	function validateBusinessDate(dateField)
	{
		var bDate="";
		if(dijit.byId('issuing_bank_abbv_name') && dijit.byId('issuing_bank_abbv_name').get('value') !== '' && misys && misys._config && misys._config.businessDateForBank &&[dijit.byId('issuing_bank_abbv_name').get('value')][0] &&[dijit.byId('issuing_bank_abbv_name').get('value')][0].name !== "")
		{
			bDate = misys._config.businessDateForBank[dijit.byId('issuing_bank_abbv_name').get('value')][0].name;
		}
		else if(dijit.byId('remitting_bank_abbv_name') && dijit.byId('remitting_bank_abbv_name').get('value') !== '' && misys && misys._config && misys._config.businessDateForBank && misys._config.businessDateForBank &&[dijit.byId('remitting_bank_abbv_name').get('value')][0] && misys._config.businessDateForBank &&[dijit.byId('remitting_bank_abbv_name').get('value')][0].name !== "")
		{
			bDate = misys._config.businessDateForBank[dijit.byId('remitting_bank_abbv_name').get('value')][0].name;
		}
		else if(dijit.byId('recipient_bank_abbv_name') && dijit.byId('recipient_bank_abbv_name').get('value') !== '' && misys && misys._config && misys._config.businessDateForBank && [dijit.byId('recipient_bank_abbv_name').get('value')][0] && [dijit.byId('recipient_bank_abbv_name').get('value')][0].name !== "")
		{
			bDate = misys._config.businessDateForBank[dijit.byId('recipient_bank_abbv_name').get('value')][0].name;
		}
		else if(dijit.byId('advising_bank_abbv_name') && dijit.byId('advising_bank_abbv_name').get('value') !== '' && misys && misys._config && misys._config.businessDateForBank &&[dijit.byId('advising_bank_abbv_name').get('value')][0] && [dijit.byId('advising_bank_abbv_name').get('value')][0].name !== "")
		{
			bDate = misys._config.businessDateForBank[dijit.byId('advising_bank_abbv_name').get('value')][0].name;
		}
		else if(dijit.byId('bank_abbv_name') && dijit.byId('bank_abbv_name').get('value') !== '' && misys && misys._config && misys._config.businessDateForBank [dijit.byId('bank_abbv_name').get('value')][0] && [dijit.byId('bank_abbv_name').get('value')][0].name !== "")
		{
			bDate = misys._config.businessDateForBank[dijit.byId('bank_abbv_name').get('value')][0].name;
		}
		else if(misys && misys._config && misys._config.bankBusinessDate && misys._config.bankBusinessDate !== "")
		{
			bDate = misys._config.bankBusinessDate;
		}
		var date=dateField.get("value");
		if(bDate!=="")
		{
			var yearServer = parseInt(bDate.substring(0,4), 10);
			var monthServer = parseInt(bDate.substring(5,7), 10);
			var dateServer = parseInt(bDate.substring(8,10), 10);
			var currentDate = new  Date(yearServer, monthServer - 1, dateServer);	
			currentDate.setHours(0, 0, 0, 0);
			var days = dojo.date.compare(date,currentDate, "date");
		    return days;
		}
	}
	
	// Private functions & variables
	/**
	 * <h4>Summary:</h4> Returns a localized display date for a date field.
	 * 
	 * <h4>Description:</h4> 
	 * Return the date of the field in a standard format, for
	 * comparison. If the field is hidden, we convert it to a standardized
	 * format for comparison, otherwise we simply return the value.
	 * Internally it uses dojo functions to do this
	 * @param {dijit._Widget} dateField
	 * 	Date field which we want to format to localise date.
	 * @method _localizeDisplayDate
	 */
	function _localizeDisplayDate( /*dijit._Widget*/ dateField) {
		
		if(dateField.get("type") === "hidden") {
			return d.date.locale.format(m.localizeDate(dateField), {
				selector :"date",
				datePattern : m.getLocalization("g_strGlobalDateFormat")
			});
		}
		
		return dateField.get("displayedValue");
	}
	
	/**
	 * this methods changes the field status to either error or valid based on the result of ValidateEmailAddress action
	 * 
	 */
	function _setEmailIdfieldStatus(response, error){

		var isValid = response.items.valid;	
		var field;
		if(dj.byId("email"))
		{
			field = dj.byId("email");
		}
		var displayMessage = '';
			if(response.items.valid === false)
			{
				if(field!=undefined){
				field.focus();
				displayMessage = m.getLocalization("invalidEmailAddressError", [field.get("value")]);
				field.set("state", "Error");
				dj.hideTooltip(field.domNode);
				dj.showTooltip(displayMessage,field.domNode, 0);
				}

			}else
			{
				console.debug("Valid email Address");
			}
	
	}
/**
 * <h4>Summary:</h4>
 * Returns a date from a DateTermField Widget when a code is use (ex: 3d).
 * 
 * @param {dijit._Widget || DomNode || String} node
 * @param {Date} startDate
 * Todays date
 * @method _normalizeDate
 */
	function _normalizeDate( /*dijit._Widget || DomNode || String*/ node, 
							 /*Date*/ startDate) {
		
		var myWidget = dj.byId(node);
		if (myWidget) {
			if(!(/Date/.test(myWidget.get("declaredClass")))){
				return -1;
			}
			if (myWidget.isValidDate()) {
				return myWidget.getDate();
			}
			if (myWidget.getCode() === "SPOT") {
				//return toDay;
				return -1;
			}
			if (myWidget.getCode() === "" || myWidget.getNumber() === "") {
				return -1;
			}
			
			var amount = parseInt(myWidget.getNumber(), 10),
				newDate = null,
				today = startDate || new Date();
			
			if (myWidget.getCode() === "d") {
				return d.date.add(today, "day", amount);
			}
			else if (myWidget.getCode() === "w") {
				return d.date.add(today, "week", amount);
			}
			else if (myWidget.getCode() === "m") {
				return d.date.add(today, "month", amount);
			}
			else if (myWidget.getCode() === "y") {
				return d.date.add(today, "year", amount);
			}
		}
		else {
			return -1;
		}
	}
/**
 * <h4>Summary:</h4>
 * Function to get an IBAN checksum. Landcode can be empty, but then, the landcode
 * must be included in the first two characters of sIban, followed by two zeros
 * @param {Object} sIban
 *  iban code 
 * @param {Object} landcode
 *  land code 
 * @method _getIBANchecksum
 * @return {object}
 *  IBAN check sum
 */
	
	function _getIBANchecksum(sIban, landcode)
	{
		var skipChars = " .-_,/", 
			sIbanDigits = "",
			sIbanMixed	= "",
			sLCCS		= "",
			curChar		= "";
		if (sIban.length < 5 || sIban.length > 35)
		{
			return -1;
		}

		if (landcode == null || landcode === "")
		{
		    sLCCS = sIban.substring(0,4);
		    sIbanMixed = sIban.substring(4, sIban.length) + sLCCS.toUpperCase();
		}
		else
		{
			sLCCS = landcode + "00";
			sIbanMixed = sIban + sLCCS.toUpperCase();
		}

		for (var i=0; i<sIbanMixed.length; i++)
		{
			curChar = sIbanMixed.charAt(i);
			if (!isNaN(curChar))
			{
				sIbanDigits += "" + curChar;
			}
			else if (skipChars.indexOf(curChar) > 0)
			{
				continue;
			}
			else if (curChar.charCodeAt(0) < 65 || curChar.charCodeAt(0) > 90)
			{
				return -1;
			}
			else
			{
				sIbanDigits +=  curChar.charCodeAt(0) - 55;
			}
		}

	    return (_largeModulus(sIbanDigits, 97));
	}

	/**
	 * <h4>Summary:</h4>
	 * Calculates the modulus of large integers that are actually strings.
	 * @param {Object} sNumber
	 * @param {Object} modulus
	 * @method _largeModulus
	 */
	function _largeModulus(sNumber, modulus)
	{
	    var i = 0, j = 0, sRebuild = new Array(), r = "";
	    for (i=0; i<sNumber.length+6;i+=6)
	    {
	    	var sItem = sNumber.substring(i, i+6);
	    	if (sItem!=="")
	    	{
	        	sRebuild[j++] = sNumber.substring(i, i+6);
	        }
	    }
	    for (i=0; i<sRebuild.length;i++)
	    {
	        r = (r + "" + sRebuild[i]) % modulus;
	    }
	    return r;
	}
	
	//Format the date to send through ajax
	/**
	 * <h4>Summary:</h4>
	 * This function is to format holiday and cutoff date.
	 * <h4>Description:</h4> 
	 * First it checks if passed object is an instance of date or not.If it is formats it and returns the same.
	 * @param {DateNode} dateNode
	 *  Date node passed
	 * @method _formatHolidaysAndCutOffDate
	 * @return {Object} 
	 *   Formatted date object
	 */
	function _formatHolidaysAndCutOffDate(/*Date Node*/dateNode)
	{
		var objDate = dateNode.get("value") !== null ?  dateNode.get("value") : "";
		if(objDate === "" || !(objDate instanceof Date))
		{
			return objDate;
		}
		else if(dateNode.get("displayedValue")) 
		{
			return dateNode.get("displayedValue");
		}
		else
		{
			var month = objDate.getMonth();
			month = month + 1;
			var year = objDate.getFullYear(); 
			var day = objDate.getDate();
			return day +"/"+month+"/"+year;
		}
	}
	

	// <h4>Summary:</h4>
    // Validate an Abbreviated Name, testing if the Abbreviated Name entered is existing in the database.
	// If already exists clear the entered Abbreviated Name and prompt for Abbreviated Name.
	/**
	 * <h4>Summary:</h4>
	 * This function is to validate abbreviated name if already exists in the database.
	 * <h4>Description:</h4> 
	 * If abbreviated name already exists clear the entered Abbreviated name and prompt for Abbreviated name
	 * @param {Object} response
	 * @method _showExistingAbbvNameMsg
	 */
	function _showExistingAbbvNameMsg(response){
		
		console.debug("[Validate] Validating Abbreviated Name");
		
		var field;
		if(dj.byId("abbv_name"))
		{
			field = dj.byId("abbv_name");
		}
		var displayMessage = '';
			if(response.items.valid === true)
			{
				if(field!=undefined){
				field.focus();
				displayMessage = m.getLocalization("abbvNameExists", [field.get("value")]);
				field.set("value", "");
				field.set("state", "Error");
				dj.hideTooltip(field.domNode);
				dj.showTooltip(displayMessage,field.domNode, 0);
				}

			}else
			{
				console.debug(falseMessage);
			}
	}
	
	// summary:
    // Validate an Abbreviated Name, testing if the Abbreviated Name entered is existing in the database.
	// If already exists clear the entered Abbreviated Name and prompt for Abbreviated Name.
	/**
	 * <h4>Summary:</h4>
	 * This function is to validate claim reference if it already exists in the database.
	 * <h4>Description:</h4> 
	 * If claim reference already exists clear the entered claim reference and prompt for claim reference.
	 * @param {Object} response
	 * @method _showExistingClaimRefMsg
	 */
	function _showExistingClaimRefMsg(response){
		
		console.debug("[Validate] Validating Claim Reference");
		
		var field;
		if(dj.byId("claim_reference"))
		{
			field = dj.byId("claim_reference");
		}
		var displayMessage = '';
			if(response.items.valid === false)
			{
				console.debug("Claim Reference invalid");
				if(field!=undefined){
				displayMessage = m.getLocalization("claimReferenceExists", [field.get("value")]);
				}
				var callback = function() {
					field.focus();
					field.set("state","Error");
				};
				m.dialog.show("ERROR", displayMessage, '', function(){
					setTimeout(callback, 500);
				});

			}else
			{
				console.debug("Claim Reference validated");
			}
	}
	/**
	 * <h4>Summary:</h4>
	 * This function is to validate PO reference if it already exists in the database.
	 * <h4>Description:</h4> 
	 * If PO reference already exists clear the entered PO reference and prompt for PO reference.
	 * @param {Object} response
	 * @method _showExistingPoRefMsg
	 */
	function _showExistingPoRefMsg(response){
		
		console.debug("[Validate] Validating PO Reference");
		
		var field;
		if(dj.byId("issuer_ref_id"))
		{
			field = dj.byId("issuer_ref_id");
		}
		var displayMessage = '';
			if(response.items.valid === false)
			{
				console.debug("PO Reference invalid");
				if(field!=undefined){
				displayMessage = m.getLocalization("poReferenceExists", [field.get("value")]);
				field.focus();
				field.set("state","Error");
				field.set("value","");
				dj.hideTooltip(field.domNode);
				dj.showTooltip(displayMessage,field.domNode, 0);
				}
				
			}else
			{
				console.debug("PO Reference validated");
			}
	}
	/**
	 * <h4>Summary:</h4>
	 * This function is to validate Invoice reference if it already exists in the database.
	 * <h4>Description:</h4> 
	 * If Invoice reference already exists clear the entered Invoice reference and prompt for Invoice reference.
	 * @param {Object} response
	 * @method _showExistingInvoiceRefMsg
	 */
	function _showExistingInvoiceRefMsg(response){
		
		console.debug("[Validate] Validating Invoice Reference");
		
		var field;
		if(dj.byId("issuer_ref_id"))
		{
			field = dj.byId("issuer_ref_id");
		}
		var displayMessage = '';
			if(response.items.valid === false && field!=undefined)
			{
				console.debug("Invoice Reference invalid");
				displayMessage = m.getLocalization("invoiceReferenceExists", [field.get("value")]);
				field.focus();
				field.set("state","Error");
				field.set("value","");
				dj.hideTooltip(field.domNode);
				dj.showTooltip(displayMessage,field.domNode, 0);
			}else
			{
				console.debug("Invoice Reference validated");
			}
	}
	/**
	 * <h4>Summary:</h4>
	 * This function is to validate Customer reference if it already exists in the database.
	 * <h4>Description:</h4> 
	 * If customer reference already exists clear the entered customer reference and prompt for customer reference.
	 * @param {Object} response
	 * @method _showExistingPoRefMsg
	 */
	function _showExistingCustRefMsg(response){
		
		console.debug("[Validate] Validating PO Reference");
		
		var field;
		if(dj.byId("cust_ref_id"))
		{
			field = dj.byId("cust_ref_id");
		}
		var displayMessage = '';
			if(response.items.valid === false)
			{
				console.debug("Customer Reference invalid");
				if(field!=undefined){
				displayMessage = m.getLocalization("custReferenceExists", [field.get("value")]);
				field.focus();	
				field.set("state","Error");
				field.set("value","");
				dj.showTooltip(displayMessage,field.domNode, 0);
				}
			}else
			{
				console.debug("Customer Reference validated");
			}
	}
	/**
	 * <h4>Summary:</h4>
	 * This function is to validate CN reference if it already exists in database.
	 * <h4>Description:</h4> 
	 * If CN reference already exists clear the entered CN reference and prompt for CN reference.
	 * @param {Object} response
	 * @method _showExistingCnRefMsg
	 * 
	 */
	function _showExistingCnRefMsg(response){
		
		console.debug("[Validate] Validating CN Reference");
		
		var field;
		if(dj.byId("cn_reference"))
		{
			field = dj.byId("cn_reference");
		}
		var displayMessage = '';
			if(response.items.valid === false)
			{
				console.debug("CN Reference invalid");
				if(field!=undefined){
				displayMessage = m.getLocalization("cnReferenceExists", [field.get("value")]);
				field.focus();
				field.set("state","Error");
				dj.hideTooltip(field.domNode);
				dj.showTooltip(displayMessage,field.domNode, 0);
				}
			}else
			{
				console.debug("CN Reference validated");
			}
	}
	/**
	 * <h4>Summary:</h4> This function is to validate Report name if it already exists in
	 * database. <h4>Description:</h4>  If Report name reference already exists clear the
	 * entered report name and prompt for report name reference.
	 * 
	 * @param {Object} response
	 * @method _showExistingReportNameMsg
	 */
	function _showExistingReportNameMsg(response){
			
			console.debug("[Validate] Validating Report Name");
			
			var field;
			if(dj.byId("report_name"))
			{
				field = dj.byId("report_name");
			}
			var displayMessage = '';
				if(response.items.valid === true)
				{
					if(field!=undefined){
					field.focus();
					displayMessage = m.getLocalization("reportNameExists", [response.items.reportName]);
					field.set("value", "");
					field.set("state", "Error");
					dj.hideTooltip(field.domNode);
					dj.showTooltip(displayMessage,field.domNode, 0);
					}
	
				}else
				{
					console.debug(falseMessage);
				}
	}
	/**
	 * <h4>Summary:</h4> 
	 * This function is to validate LS name if it already exists in
	 * database. <h4>Description:</h4>  If LS name already exists clear the
	 * entered LS name and prompt for LS name.
	 * 
	 * @param {Object} response
	 * @method _showExistingLsNameMsg
	 */
	function _showExistingLsNameMsg(response){
		
		console.debug("[Validate] Validating License Name");
		
		var field;
		var lsName = dj.byId("ls_name");
		if(lsName)
		{
			field = lsName;
		}
		var displayMessage = '';
			if(response.items.valid === false)
			{
				console.debug("License Name invalid");
				if(field!=undefined){
				displayMessage = m.getLocalization("lsNameExists", [field.get("value")]);
				field.focus();
				field.set("state","Error");
				dj.hideTooltip(field.domNode);
				dj.showTooltip(displayMessage,field.domNode, 0);
				}
			}else
			{
				console.debug("License Name validated");
			}
	}
	
	/**
	 * <h4>Summary:</h4> 
	 * This function is to validate Facility reference if it already exists in
	 * database. <h4>Description:</h4>  If Facility reference already exists clear the
	 * entered Facility reference and prompt for Facility reference.
	 * 
	 * @param {Object} response
	 * @method _showExistingFacilityReferenceMsg
	 */
	function _showExistingFacilityReferenceMsg(response){
		
		console.debug("[Validate] Validating facility Refernce");
		
		var field;
		if(dj.byId("facility_reference"))
		{
			field = dj.byId("facility_reference");
		}
		var displayMessage = '';
			if(response.items.valid === true)
			{
				if(field!=undefined){
				field.focus();
				displayMessage = m.getLocalization("facilityRefExists", [field.get("value")]);
				field.set("value","");
				field.set("state", "Error");
				dj.hideTooltip(field.domNode);
				dj.showTooltip(displayMessage,field.domNode, 0);
				}

			}else
			{
				console.debug(falseMessage);
			}
		}
	/**
	 * <h4>Summary:</h4> 
	 * This function is to validate Employee number if it already exists in
	 * database. <h4>Description:</h4>  If Employee number already exists clear the
	 * entered Employee number and prompt for Employee number.
	 * 
	 * @param {Object} response
	 * @method _showExistingEmployeeNoMsg
	 */
	function _showExistingEmployeeNoMsg(response){
		
		console.debug("[Validate] Validating Employee No");
		
		var field;
		if(dj.byId("employee_no"))
		{
			field = dj.byId("employee_no");
		}
		var displayMessage = '';
			if(response.items.valid === true)
			{
				if(field!=undefined){
				field.focus();
				displayMessage = m.getLocalization("employeeNoExists", [field.get("value")]);
				field.set("value", "");
				field.set("state", "Error");
				dj.hideTooltip(field.domNode);
				dj.showTooltip(displayMessage,field.domNode, 0);
				}
	
			}else
			{
				console.debug(falseMessage);
			}
	}
	
	
	/**
	 * <h4>Summary:</h4> 
	 * This function is to prompt an error message to the user if the 
	 * structure code exists 	
	 * 
	 * @param {Object} response
	 * @method _showExistingEmployeeNoMsg
	 */
	function _showExistingCodeMsg(response){
		
		console.debug("[Validate] Validating structure Code");
		
		var field;
		if(dj.byId("structure_code"))
		{
			field = dj.byId("structure_code");
		}
		var displayMessage = '';
			if(response.items.exists === true)
			{
				dj.byId('structure_code').set("state", "Error");
				if(field!=undefined){
				displayMessage = m.getLocalization("structureCodeExists", [field.get("value")]);
				}
				dj.showTooltip(displayMessage, dj.byId("structure_code").domNode, 0);
	
			}else
			{
				console.debug(falseMessage);
			}
	}
	
	/**
	 * <h4>Summary:</h4> 
	 * This function is to prompt an error message to the user if the 
	 * structure code exists 	
	 * 
	 * @param {Object} response
	 * @method _showExistingEmployeeNoMsg
	 */
	function _showExistingEffectiveDate(response){
		
		console.debug("[Validate] Validating effective Date");
		
		var field;
		if(dj.byId("effective_date"))
		{
			field = dj.byId("effective_date");
		}
		var displayMessage = '';
			if(response.items.exists === true)
			{
				dj.byId('effective_date').set("state", "Error");
				dj.showTooltip(m.getLocalization("effectiveDateExists"), dj.byId("effective_date").domNode, 0);
	
			}else
			{
				console.debug(falseMessage);
			}
	}
	
	
	
	/**
	 * <h4>Summary:</h4> 
	 * This function is for marking a field as required field.
	 * @param {Object} field
	 * @param _markFieldAsRequired
	 */
	function _markFieldAsRequired(field)
	{
		var displayMessage = misys.getLocalization('uploadTemplateValueRequired');
		field.set("state","Error");
		dj.hideTooltip(field.domNode);
		if(dojo.query('html') && dojo.query('html')[0] && dojo.query('html')[0].dir === 'rtl')
		{
			dj.showTooltip(displayMessage, field.domNode,['before']);
		}
		else
		{
			dj.showTooltip(displayMessage, field.domNode, 0);
		}
		var hideTT = function() {
			dj.hideTooltip(field.domNode);
		};
		setTimeout(hideTT, 5000);
		}
	
	//Holidays And CutOffTime Error Dialog With Auto Forward Operation
	/**
	 * <h4>Summary:</h4>
	 * This method is for showing error dialog for the holiday and cutoff time error.
	 * @param {String} mode
	 * @param {boolean} autoFormwardEnabled
	 * @method _showHolidaysNCutOffTimeErrorDialog
	 */
	function _showHolidaysNCutOffTimeErrorDialog(/*String*/mode,/*boolean*/autoForwardEnabled)
	{
		//if holidayCutOffDialog not defined
		if(!dj.byId("holidayCutOffDialog"))
		{
			d.require('misys.widget.Dialog');
			d.require('dijit.form.Button');
			
			//Create a dialog
			var dialog = new dj.Dialog({id: 'holidayCutOffDialog',
			    title: 'Error',draggable: false});
			
			//Create dialog content
			var dialogContent = d.create("div", { id: "holidayCutOffDialogContent"});
			var dialogText = d.create("div", {id:"dialogHolidayText"},dialogContent,'first');
			var dialogButtons =   d.create("div",{id:"holidayCutOffDialogButtons",style:"text-align:center;"},dialogContent,'last');
			
			//Buttons
			var rejectButton  = new dj.form.Button({label:m.getLocalization("returnMessage"),id:"rejectHolidayButtonId"});
			var autoForwardButton  = new dj.form.Button({label:m.getLocalization("autoForwardMessage"),id:"forwardHolidayButtonId"});
			var cancelButton  = new dj.form.Button({label:m.getLocalization("cancelMessage"),id:"cancelHolidayButtonId"});
			
			//UNSIGNED mode will have reject
			if(mode === "UNSIGNED")
			{
				d.place(rejectButton.domNode,dialogButtons);
			}
			//Only if AutoForward Enabled for User's Entity
			if(autoForwardEnabled === true)
			{
				d.place(autoForwardButton.domNode,dialogButtons);
			}
			d.place(cancelButton.domNode,dialogButtons);
			
			dialog.set("content", dialogContent);
		}
			
		if(mode !== "UNSIGNED" && !autoForwardEnabled) {
			m._config.onSubmitErrorMsg = m.getLocalization('failedSingleSubmissionFromDraft');
		}

		var holidayDialog = dj.byId("holidayCutOffDialog");
		
		//Set the Error into the Dialog
		if(d.byId("dialogHolidayText"))
		{
			d.byId("dialogHolidayText").innerHTML = m._config.onSubmitErrorMsg;
		}
		// Disable window closing by using the escape key
		m.dialog.connect(holidayDialog, 'onKeyPress', function(evt) {
			if (evt.keyCode === d.keys.ESCAPE) {
				d.stopEvent(evt);
			}
		});
		
		//Dialog Connects
		m.dialog.connect(dj.byId('forwardHolidayButtonId'), 'onClick', function(){
			holidayDialog.hide();
			setTimeout(function(){
				m.submit("AUTO_FORWARD_SUBMIT");
			}, 500);
		}, holidayDialog.id);
		
		
		m.dialog.connect(dj.byId('rejectHolidayButtonId'), 'onClick', function(){
			//Reject mode is handled as Return Transaction only for FT
			var submitType = "REJECT";
			if(dj.byId("productcode") && dj.byId("productcode").get("value") ==='FT' || 'TD' && mode === "UNSIGNED" )
			{
				submitType = "RETURN_TRANSACTION";
			}
			m.submit(submitType);
			m.dialog.hide();
			holidayDialog.hide();
		}, holidayDialog.id);
		
		m.dialog.connect(dj.byId('cancelHolidayButtonId'), 'onClick', function(){
			 m.dialog.hide();
			holidayDialog.hide();
			//MPG-10582-mandatory error field message is not shown after clicking on cancelHolidayButtonId 
			if(d.byId("dialogHolidayText"))
			{
				d.byId("dialogHolidayText").innerHTML = "";
				m._config.onSubmitErrorMsg = d.byId("dialogHolidayText").innerHTML;
			}
		}, holidayDialog.id);
		
		//On Hide of Dialog
		m.dialog.connect(holidayDialog, 'onHide', function() {
			m.dialog.disconnect(holidayDialog);
			m.dialog.hide();
		});
		
		//Show the Dialog
		holidayDialog.show();
	}
	
	//AJAX call to validate Holidays and Cut-Off Time and Load back response and error msg if any
	/**
	 * This method has an ajax call to validate Holidays and cutoff time and Load back message 
	 * and error message if any
	 * @param {String} bankAbbvname
	 * @param {String} productCode
	 * @param {String} subProductCode
	 * @param {String} mode
	 * @param {Array of date names} dateNames
	 * @param {Array of date values} dateValues
	 * @param {String} entityValue
	 * @param {String} currencyOcde
	 * @param {String} amountValue
	 * @method _validateHolidayAndCutOffTime
	 * @return {boolean}
	 *  True if valid otherwise false.
	 */
	function _validateHolidayAndCutOffTime(/*String*/bankAbbvNameValue,/*String*/productCode,/*String*/subProductCode,/*String*/mode,
				/*Array of Date Names*/dateNames,/*Array of Date values*/dateValues,/*String*/entityValue,/*String*/currencyCode,/*String*/amountValue,/*String*/clearingCodeValue)
	{
		var status = true;	
		//AJAX Call
			m.xhrPost({
					url : misys.getServletURL("/screen/AjaxScreen/action/GetBusinessDateAndCutOffTimeStatus"),
					sync : true,
					handleAs : "json",
					content : {
						date_names : dateNames,
						date_values : dateValues,
						bankAbbvName : bankAbbvNameValue,
						entity_abbv_name : entityValue,
						product_code : productCode,
						sub_product_code : subProductCode,
						cur_code : currencyCode,
						amount : amountValue,
						clearingCode :clearingCodeValue
					},
					load : function(response, args){
						//Response 
						var isValid = response.valid;
						var autoForwardEnabled = response.autoForwardEnabled;
						if(isValid === false)
						{
							status = false;
							//Set Error Msg
							m._config.onSubmitErrorMsg = response.errorMessage;
							//Dialog show
							_showHolidaysNCutOffTimeErrorDialog(mode,autoForwardEnabled);
						}
					},
					customError : function(response, args){
						console.error('[misys.validation.common] Technical error while validating business days and cut-off time');
						console.error(response);
						status = false;
						
						//Set Error Msg
						m._config.onSubmitErrorMsg = m.getLocalization("technicalErrorWhileValidatingBusinessDays");
						//Set Holidays Disabled to show non custom error
						m._config = m._config || {};
						dojo.mixin(m._config,{holidayCutOffEnabled:false});
					}
			});
		return status;
	}
	
	//
	// Public functions & variables
	//
	d.mixin(m, {
		
		//Function to check on an IBAN
		/**
		 * <h4>Summary:</h4>
		 * This function is to check on IBAN.
		 * @method isIBAN
		 */
		isIBAN : function (sIban) {
			//  summary:
		    //        Validate a value is an IBAN
			//  description:
			//        Validate a value is an IBAN by checking modulus
			return _getIBANchecksum(sIban) === 1;
		},
		/**
		 * <h4>Summary:</h4>
		 * This function is display the localize display date it internally calls psuedo private function to display the localize siaplay date
		 * @param {dijit._Widget} dateField 
		 * @method getLocalizeDisplayDate
		 */
		getLocalizeDisplayDate : function(/*dijit._Widget*/ dateField){
			return _localizeDisplayDate(dateField);
		},
						/**
						 * <h4>Summary:</h4> This function is to validate the required
						 * field <h4>Description:</h4>  This function internally calls
						 * pseudo private function to mark field as required
						 * 
						 * @method validateRequiredField
						 */
		validateRequiredField : function() {
				if(this.get("value") ==="")
					{
					 _markFieldAsRequired(this);
					}
		},
						/**
						 * <h4>Summary:</h4> This function is to validate the template id
						 * 
						 * <h4>Description:</h4>  description: The set of characters is
						 * the same as the default ones, with the accentuated
						 * characters and no "&". return
						 * validateCharacter(theObj,
						 * "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ/-?:().,+");
						 * allow all characters but quote
						 * @method validateTemplateId
						 * @return {boolean}
						 *  True if valid otherwise false.
						 */
		validateTemplateId : function() {
			//  summary:
		    //        Validates the template id.
			//  description:
			//        The set of characters is the same as the default ones, with the accentuated
		    //        characters and no "&". return validateCharacter(theObj,
			//        "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ/-?:().,+");
		    //        allow all characters but quote
			
			//var invalidCharacters = "\\'`";
			var character;
			var isValid = d.every(this.get("value"), function(theChar){
				character = theChar;
				return true;
			});
			
			if(!isValid) {
				this.invalidMessage = m.getLocalization("illegalCharError", [ character ]);
			}
			else if(this.get("value").length===1 && this.get("value")==="-")
			{
				this.invalidMessage = m.getLocalization("singleHyphenError");
				isValid=false;
			}


			return isValid;
	   }, 
	   /**
	    * <h4>Summary:</h4>
	    * This function is to validate if Abbreviated name already exist in DataBase
	    * <h4>Description:</h4> 
	    * Internally calls a pseudo private function to show the error
	    * @method checkAbbvNameExists
	    */
		checkAbbvNameExists : function()
		{
			var newAbbvName;
			if(dj.byId('abbv_name'))
			{
				newAbbvName = dj.byId('abbv_name').get('value');
			}
			if(newAbbvName !== "") {
		
				m.xhrPost( {
					url : m.getServletURL("/screen/AjaxScreen/action/CheckAbbvNameAction"),
					handleAs 	: "json",
					sync 		: true,
					content : {
						abbv_name : newAbbvName	
					},
					load : _showExistingAbbvNameMsg
				});
			}
		},
		
		/**
		 * Validates extended narrative sizes based on swift 2018 configurations (only initiation)
		 */
		
		validateExtNarrativeSwiftInit2018 : function(/*String*/ allNarratives, /*boolean*/ isSingleNarrative) {
			var trimmed = allNarratives.trim();
			var message = trimmed.split(/\n/);
			var rowcount = message == "" ? 0 : message.length;
			return rowcount > (isSingleNarrative ? 800 : 1000) ? false : true;
		},
		
		/**
		 * Validates extended narrative row count and character count sizes based on swift 2018 configurations (only initiation)
		 */
		
		validateRowExtNarrativeSwiftInit2018 : function(/*String*/ allNarratives, /*boolean*/ isSingleNarrative) {
			var trimmed = allNarratives.trim();
			var message = trimmed.split(/\r*\n/);
			var rowcount = message == "" ? 0 : message.length;
			var numCharTrimmed = allNarratives.trim().length;
			var numChar = numCharTrimmed == "" ? 0 : numCharTrimmed;
			var lineCount = rowcount > (isSingleNarrative ? 800 : 1000) ? true : false;
			var charCount = numChar > (isSingleNarrative ? 52000 : 65000) ? true : false;
			return (lineCount) || (charCount);
		},
		
		
		/**
		 * Validates extended narrative sizes based on swift 2018 configurations
		 */
		
		validateExtendedNarrativeSwift2018 : function(/*String*/ allNarratives,
														/*String*/msgRows, 
														/*Boolean*/ is798,
														/*boolean*/ isSingleNarrative) {
			var trimmed = allNarratives.trim();
			var message = trimmed.split(/\n/);
			var rowcount = message == "" ? 0 : message.length + (msgRows ? msgRows : 0);
			var messageSizeLimit = misys._config.swiftExtendedNarrativeEnabled ? (isSingleNarrative ? (is798 ? 792 : 800) : (is798 ? 992 : 1000)) : 100;
			return rowcount > messageSizeLimit ? false : true;
		},
		
		/**
		 * <h4>Summary:</h4>
		 * This function is to validate if claim reference already exist in DataBase
		 * <h4>Description:</h4> 
		 * Have an AJAX call inside it
		 * @method checkClaimReferenceExists
		 * 
		 */
		checkClaimReferenceExists : function()
		{
				var claimRef, prodCode, companyId;
				if(dj.byId('claim_reference'))
				{
					claimRef = dj.byId('claim_reference').get('value');
				}
				if(dj.byId('product_code'))
				{
					prodCode = dj.byId('product_code').get('value');
				}
				if(dj.byId('company_id'))
				{
					companyId = dj.byId('company_id').get('value');
				}
				
				if(claimRef !== "") {
			
					m.xhrPost( {
						url : m.getServletURL("/screen/AjaxScreen/action/CheckClaimReferenceAction"),
						handleAs 	: "json",
						sync 		: true,
						content : {
							claim_ref : claimRef,	
							product_code : prodCode,
							company_id : companyId
						},
						load : _showExistingClaimRefMsg
					});
				}
		},
		/**
		 * <h4>Summary:</h4>
		 * This function is to validate if PO reference already exist in DataBase
		 * <h4>Description:</h4> 
		 * Have an AJAX call inside it
		 * @method checkPoReferenceExists
		 * 
		 */
		checkPoReferenceExists : function()
		{
				var poRef, prodCode, buyerAbbvName, sellerAbbvName, refId;
				if(dj.byId('issuer_ref_id'))
				{
					poRef = dj.byId('issuer_ref_id').get('value');
				}
				if(dj.byId('product_code'))
				{
					prodCode = dj.byId('product_code').get('value');
				}
				if(dj.byId('buyer_abbv_name'))
				{
					buyerAbbvName = dj.byId('buyer_abbv_name').get('value');
				}
				if(dj.byId('seller_abbv_name'))
				{
					sellerAbbvName = dj.byId('seller_abbv_name').get('value');
				}
				if(dj.byId('ref_id'))
				{
					refId = dj.byId('ref_id').get('value');
				}
				
				if(poRef !== "" && buyerAbbvName !== "" && sellerAbbvName !== "") {
			
					m.xhrPost( {
						url : chkPoRefAct,
						handleAs 	: "json",
						sync 		: true,
						content : {
							poRef : poRef,	
							productCode : prodCode,
							buyerAbbvName : buyerAbbvName,
							sellerAbbvName : sellerAbbvName,
							refId : refId
						},
						load : _showExistingPoRefMsg
					});
				}
		},
		/**
		 * <h4>Summary:</h4>
		 * This function is to validate if Invoice reference already exist in DataBase
		 * <h4>Description:</h4> 
		 * Have an AJAX call inside it
		 * @method checkInvoiceReferenceExists
		 * 
		 */
		checkInvoiceReferenceExists : function()
		{
				var poRef, prodCode, buyerAbbvName, sellerAbbvName, refId;
				if(dj.byId("issuer_ref_id"))
				{
					poRef = dj.byId("issuer_ref_id").get("value");
				}
				if(dj.byId('product_code'))
				{
					prodCode = dj.byId('product_code').get('value');
				}
				if(dj.byId('buyer_abbv_name'))
				{
					buyerAbbvName = dj.byId('buyer_abbv_name').get('value');
				}
				if(dj.byId('seller_abbv_name'))
				{
					sellerAbbvName = dj.byId('seller_abbv_name').get('value');
				}
				if(dj.byId('ref_id'))
				{
					refId = dj.byId('ref_id').get('value');
				}
				
				if(poRef !== "" && buyerAbbvName !== "" && sellerAbbvName !== "") {
			
					m.xhrPost( {
						url : chkPoRefAct,
						handleAs 	: "json",
						sync 		: true,
						content : {
							poRef : poRef,	
							productCode : prodCode,
							buyerAbbvName : buyerAbbvName,
							sellerAbbvName : sellerAbbvName,
							refId : refId
						},
						load : _showExistingInvoiceRefMsg
					});
				}
		},
		/**
		 * <h4>Summary:</h4>
		 * This function is to validate if PO customer reference already exist in DataBase
		 * <h4>Description:</h4> 
		 * Have an AJAX call inside it
		 * @method checkPoCustReferenceExists
		 * 
		 */
		checkInvoiceCustReferenceExists : function()
		{
				var custRef, prodCode, buyerAbbvName, sellerAbbvName, refId;
				if(dj.byId("issuer_ref_id"))
				{
					custRef = dj.byId("cust_ref_id").get("value");
				}
				if(dj.byId('product_code'))
				{
					prodCode = dj.byId('product_code').get('value');
				}
				if(dj.byId('buyer_abbv_name'))
				{
					buyerAbbvName = dj.byId('buyer_abbv_name').get('value');
				}
				if(dj.byId('seller_abbv_name'))
				{
					sellerAbbvName = dj.byId('seller_abbv_name').get('value');
				}
				if(dj.byId('ref_id'))
				{
					refId = dj.byId('ref_id').get('value');
				}
				
				if(custRef !== "" && buyerAbbvName !== "" && sellerAbbvName !== "") {
			
					m.xhrPost( {
						url : m.getServletURL("/screen/AjaxScreen/action/CheckCustReferenceAction"),
						handleAs 	: "json",
						sync 		: true,
						content : {
							custRef : custRef,	
							productCode : prodCode,
							buyerAbbvName : buyerAbbvName,
							sellerAbbvName : sellerAbbvName,
							refId : refId
						},
						load : _showExistingCustRefMsg
					});
				}
		},
		/**
		 * <h4>Summary:</h4>
		 * This function is to validate if CN reference already exist in DataBase
		 * <h4>Description:</h4> 
		 * Have an AJAX call inside it
		 * @method checkCnReferenceExists
		 */
		checkCnReferenceExists : function()
		{
				var cnRef, prodCode, buyerAbbvName, sellerAbbvName, fscmProg, refId;
				if(dj.byId("cn_reference"))
				{
					cnRef = dj.byId("cn_reference").get("value");
				}
				if(dj.byId("product_code"))
				{
					prodCode = dj.byId("product_code").get("value");
				}
				else if(dj.byId("productCode"))
				{
					prodCode = dj.byId("productCode").get("value");
				}
				if(dj.byId("buyer_abbv_name"))
				{
					buyerAbbvName = dj.byId("buyer_abbv_name").get("value");
				}
				if(dj.byId("seller_abbv_name"))
				{
					sellerAbbvName = dj.byId("seller_abbv_name").get("value");
				}
				if(dj.byId("fscm_programme_code"))
				{
					fscmProg = dj.byId("fscm_programme_code").get("value");
				}
				if(dj.byId("ref_id"))
				{
					refId = dj.byId("ref_id").get("value");
				}
				
				if(cnRef !== "") {
			
					m.xhrPost( {
						url : m.getServletURL("/screen/AjaxScreen/action/CheckCnReferenceAction"),
						handleAs 	: "json",
						sync 		: true,
						content : {
							cnReference : cnRef,	
							productCode : prodCode,
							buyerAbbvName : buyerAbbvName,
							sellerAbbvName : sellerAbbvName,
							fscmProgram : fscmProg,
							refId : refId
						},
						load : _showExistingCnRefMsg
					});
				}
		},
		/**
		 * <h4>Summary:</h4>
		 * This function is to validate if PO reference already exist in DataBase for IO
		 * <h4>Description:</h4> 
		 * Have an AJAX call inside it
		 * @method checkPoReferenceExistsIO
		 */
		checkPoReferenceExistsIO : function()
		{
				var poRef, prodCode, buyerAbbvName, sellerAbbvName, refId;
				if(dj.byId('issuer_ref_id'))
				{
					poRef = dj.byId('issuer_ref_id').get('value');
				}
				if(dj.byId('product_code'))
				{
					prodCode = dj.byId('product_code').get('value');
				}
				if(dj.byId('buyer_abbv_name'))
				{
					buyerAbbvName = dj.byId('buyer_abbv_name').get('value');
				}
				if(dj.byId('seller_abbv_name'))
				{
					sellerAbbvName = dj.byId('seller_abbv_name').get('value');
				}
				if(dj.byId('ref_id'))
				{
					refId = dj.byId('ref_id').get('value');
				}
				
				if(poRef !== "") {
			
					m.xhrPost( {
						url : chkPoRefAct,
						handleAs 	: "json",
						sync 		: true,
						content : {
							poRef : poRef,	
							productCode : prodCode,
							buyerAbbvName : buyerAbbvName,
							sellerAbbvName : sellerAbbvName,
							refId : refId
						},
						load : _showExistingPoRefMsg
					});
				}
		},
		/**
		 * <h4>Summary:</h4>
		 * This function is to validate if a Report name already exist in DataBase 
		 * <h4>Description:</h4> 
		 * Have an AJAX call inside it
		 * @method checkReportNameExists
		 */
		checkReportNameExists : function()
		{
			//Checks for Duplicate report name.			
			var newReportName;
			var repId;
			if(dj.byId('report_name'))
			{
				newReportName = dj.byId('report_name').get('value');
			}
			if(dj.byId('report_id')){
				repId = dj.byId('report_id').get('value');
			}
			
			if(newReportName !== "") {
		
				m.xhrPost( {
					url : m.getServletURL("/screen/AjaxScreen/action/CheckReportNameAction"),
					handleAs 	: "json",
					sync 		: true,
					content : {
						report_name : newReportName ,
						report_id : repId
					},
					load : _showExistingReportNameMsg
				});
			}
		},
		/**
		 * <h4>Summary:</h4>
		 * This function is to validate if a License name already exist in DataBase 
		 * <h4>Description:</h4> 
		 * Have an AJAX call inside it
		 * @method checkLicenseNameExists
		 */
		checkLicenseNameExists : function()
		{
				var lsName;
				if(dj.byId('ls_name'))
				{
					lsName = dj.byId('ls_name').get('value');
				}
				
				if(lsName !== '') {
			
					m.xhrPost( {
						url : m.getServletURL("/screen/AjaxScreen/action/CheckLsNameAction"),
						handleAs 	: "json",
						sync 		: true,
						content : {
							ls_Name : lsName
						},
						load : _showExistingLsNameMsg
					});
				}
		},
		
		/**
		 * <h4>Summary:</h4>
		 * This function is to validate if a Facility refernce already exist in DataBase 
		 * <h4>Description:</h4> 
		 * Have an AJAX call inside it
		 * @method checkFacilityReferenceExists
		 */
		checkFacilityReferenceExists : function()
		{
			var newFacilityRef;
			var facilityId;
			var bankAbbvName;
			var compAbbvName;
			if(dj.byId('facility_reference'))
			{
				newFacilityRef = dj.byId('facility_reference').get('value');
			}
			if(dj.byId('facility_id')){
				facilityId = dj.byId('facility_id').get('value');
			}
			if(dj.byId('company_abbv_name')){
				compAbbvName = dj.byId('company_abbv_name').get('value');
			}
			if(dj.byId('bank_abbv_name')){
				bankAbbvName = dj.byId('bank_abbv_name').get('value');
			}
			
			if(newFacilityRef !== "") {
		
				m.xhrPost( {
					url : m.getServletURL("/screen/AjaxScreen/action/CheckFacilityReferenceAction"),
					handleAs 	: "json",
					sync 		: true,
					content : {
						facility_reference : newFacilityRef ,
						facility_id : facilityId,
						company_abbv_name : compAbbvName,
						bank_abbv_name : bankAbbvName
					},
					load : _showExistingFacilityReferenceMsg
				});
			}
		},
		/**
		 * <h4>Summary:</h4>
		 * This function is to validate if a Employee name already exist in DataBase 
		 * <h4>Description:</h4> 
		 * Have an AJAX call inside it
		 * @method checkEmployeeNoExists
		 */
		checkEmployeeNoExists : function()
		{
			//Checks for Duplicate Employee No name.			
			var newEmployeeNo;
			var companyId;
			var loginId;
			var NewLoginId;
			if(dj.byId('employee_no'))
			{
				newEmployeeNo = dj.byId('employee_no').get('value');
			}
			if(dj.byId('company_id'))
			{
				companyId = dj.byId('company_id').get('value');
			}
			if(dj.byId('login_id_hidden'))
			{
				loginId = dj.byId('login_id_hidden').get('value');
			}
			if(dj.byId('login_id'))
				{
				NewLoginId = dj.byId('login_id').get('value');
				}
			
			
			if(newEmployeeNo !== "") {
		
				m.xhrPost( {
					url : m.getServletURL("/screen/AjaxScreen/action/CheckEmployeeNoAction"),
					handleAs 	: "json",
					sync 		: true,
					content : {
						employee_no : newEmployeeNo,
						company_id : companyId,
						login_id_hidden : loginId,
						login_id : NewLoginId
					},
					load : _showExistingEmployeeNoMsg
				});
			}
		},
		
		/**
		 * <h4>Summary:</h4>
		 * This function is to validate if a Bank reference (BO_REF_ID) already exist in DataBase 
		 * <h4>Description:</h4> 
		 * Have an AJAX call inside it
		 * @method checkBankReference
		 */
		checkBankReference : function()
		{
			//Checks for Duplicate Bank reference.			
			var bo_ref, refId;
			var isValidRef = true;
			if(dj.byId('bo_ref_id'))
			{
				bo_ref = dj.byId('bo_ref_id').get('value');
			}
			if(dj.byId('ref_id'))
			{
				refId = dj.byId('ref_id').get('value');
			}
			
			if(bo_ref !== "") {
				m.xhrPost({
					url : m.getServletURL("/screen/AjaxScreen/action/ValidateDuplicateBankReference"),
					sync : true,
					handleAs : "json",
					content: {
						bo_ref_id: bo_ref,
						refId: refId
						},
					load : function(response, args){
						if(response.responseFlag == false)
						{
							console.debug("Dublicate Bank Reference");
							isValidRef = false;
						}else
						{
							console.debug("bo_ref_id is unique");
						}
					},
					error : function(response, args){
						console.error("checkBankReference AJAX error", response);
					}
				});
			}
			return isValidRef;
		},
		
		/**
		 * <h4>Summary:</h4>
		 * This function is to validate if a RM Group already exist in DataBase 
		 * <h4>Description:</h4> 
		 * Have an AJAX call inside it
		 * @method checkEmployeeNoExists
		 */
		checkRMGroupExists : function()
		{
			//Checks for Duplicate Employee No name.			
			var rmGroup;
			var isValid=true;
			

			if(dj.byId('rmGroup'))
			{
				rmGroup = dj.byId('rmGroup').get('value');
			}
			var companyId = dj.byId('company_id').get('value');
			if(rmGroup !== "") {
		
				m.xhrPost( {
					url : m.getServletURL("/screen/AjaxScreen/action/CheckRMGroupExistsAction"),
					handleAs 	: "json",
					sync 		: false,
					content : {
						rm_group : rmGroup,
						companyid: companyId
					},
					load : function(response, args){
						console.debug("[Validate] Validating RMGroup ");
						
						var field;
						if(dj.byId("rmGroup"))
						{
							field = dj.byId("rmGroup");
						}
						var displayMessage = '';
							if(response.items.valid === false)
							{
								if(field!=undefined){
								field.focus();
								displayMessage = m.getLocalization("rmGroupNoExists", [response.items.rmGroup]);
								field.set("value", "");
								field.set("state", "Error");
								dj.hideTooltip(field.domNode);
								dj.showTooltip(displayMessage,field.domNode, 0);
								}
								isValid = false;
					
							}else
							{
								console.debug(falseMessage);
							}
					},
					error : function(response, args){
						isValid = false;
						console.error(" processRepricingOfRecords error", response);
					}
				});
			}
			return isValid;
		},	
		
		validateFeeAccount : function (){
			var entityField="";
			var isValidFeeAccount = false;
			var feeAccount = "";
			if(dj.byId("fee_act_no")){
				feeAccount = feeAccount = dj.byId("fee_act_no").get('value');	
			}

			if (dj.byId("entity"))
			{
				entityField = dj.byId("entity").get('value');			
			}
			m.xhrPost({
				url : m.getServletURL("/screen/AjaxScreen/action/GetStaticData"),
				sync : true,
				handleAs : "json",
				content: {
					option: "account",
					fields: "['fee_act_no']",
					productcode: "SI",
					entity: entityField
					},
				load : function(response, args){
					for (var i = 0; i < response.items.length; i++) {
					    if(response.items[i].ACCOUNTNO==feeAccount)
				    	{
					    	isValidFeeAccount = true;
					    	console.debug("validate Fee Account is true");
					    	break;
				    	}
					}
				},
				error : function(response, args){
					console.error("validateFeeAccount AJAX error", response);
				}
			});	
			return isValidFeeAccount;
		},
		
		validateApplDate : function (bankAbbvName){
			var valid= true;
			var applDate;
			if(dj.byId("appl_date")){
				 applDate=dj.byId("appl_date").get('value');	
			}
			m.xhrPost({
				url : m.getServletURL("/screen/AjaxScreen/action/ValidateApplDate"),
				sync : true,
				handleAs : "json",
				content: {
					bankAbbvName: bankAbbvName,
					applDate: applDate
					},
				load : function(response, args){
					if(response.items.valid == false)
					{
						valid= false;
						 if(dj.byId("appl_date"))
							{
								dj.byId("appl_date").set("value",response.items.bDate);
								dojo.byId("appl_date_view_row").childNodes[1].innerHTML=dj.byId("appl_date").get("value");
							}
					}
				}
			});	
			return valid;
		},
		goToTop : function (){
		var target = d.byId("body");
		if(d.isIE <= 6) 
		{
			d.window.scrollIntoView(target);
	    }
		else
		{
			dojox.fx.smoothScroll({
				node: target, 
				win: window
				}).play();
		}
		},
		validatePricipleAccount : function (){
			var entityField="";
			var productCode = "";
			var isValidPrincipleAccount = false;
			var principleAccount = "";
			if(dj.byId("principal_act_no")){
				principleAccount = dj.byId("principal_act_no").get('value');
			}

			if (dj.byId("entity"))
			{
				entityField = dj.byId("entity").get('value');			
			}
			if (dj.byId("product_code"))
			{
				productCode = dj.byId("product_code").get('value');			
			}
			m.xhrPost({
				url : m.getServletURL("/screen/AjaxScreen/action/GetStaticData"),
				sync : true,
				handleAs : "json",
				content: {
					option: "account",
					fields: "['principal_act_no']",
					productcode: productCode,
					entity: entityField
					},
				load : function(response, args){
					for (var i = 0; i < response.items.length; i++) {
					    if(response.items[i].ACCOUNTNO==principleAccount)
				    	{
					    	isValidPrincipleAccount = true;
					    	console.debug("validate Principle Account is true");
					    	break;
				    	}
					}
				},
				error : function(response, args){
					console.error("validatePrincipleAccount AJAX error", response);
				}
			});	
			return isValidPrincipleAccount;
		},
		
		checkEntityIdExists : function()
		{
			var newAbbvName;
			var companyId;
			if(dj.byId('abbv_name'))
			{
				newAbbvName = dj.byId('abbv_name').get('value');
				
			}
			if(dj.byId('company_abbv_name'))
			{
				companyId = dj.byId('company_id').get('value');
				
			}
			
			if(newAbbvName !== "") {
		
				m.xhrPost( {
					url : m.getServletURL("/screen/AjaxScreen/action/CheckEntityIdAction"),
					handleAs 	: "json",
					sync 		: true,
					content : {
						abbv_name : newAbbvName,	
						companyId : companyId
					},
					load : _showExistingAbbvNameMsg
				});
			}
		},
		/**
		 * <h4>Summary:</h4>
		 * This function is to validate if structure code already exist in DataBase
		 * <h4>Description:</h4> 
		 * Have an AJAX call inside it
		 * @method checkStructureCodeExists
		 */
		checkStructureCodeExists : function()
		{
				var structCode;
				if(dj.byId('structure_code'))
				{
					structCode = dj.byId('structure_code').get('value');
				}			
				
				if(structCode !== "") {
			
					m.xhrPost( {
						url : m.getServletURL("/screen/AjaxScreen/action/CheckStructureCodeExistsAction"),
						handleAs 	: "json",
						sync 		: true,
						content : {
							structureCode : structCode	
						},
						load : _showExistingCodeMsg
					});
				}
		},
		/**
		 * <h4>Summary:</h4>
		 * This function is to validate if effectiveDate already exist in DataBase
		 * <h4>Description:</h4> 
		 * Have an AJAX call inside it
		 * @method checkEffectiveDateExists
		 */
		checkEffectiveDateExists : function()
		{
				var effDate;
				if(dj.byId('effective_date'))
				{
					 effDate = dj.byId("effective_date").get("displayedValue");
					
					
				}			
				
				if(effDate !== "") {
			
					m.xhrPost( {
						url : m.getServletURL("/screen/AjaxScreen/action/CheckEffectiveDateExistsAction"),
						handleAs 	: "json",
						sync 		: true,
						content : {
							effective_date : effDate	
						},
						load : _showExistingEffectiveDate
					});
				}
		},
		/**
		 * <h4>Summary:</h4>
		 * This function validates that request date is greater than or equal to the processing date and application date.
		 * @method validateCashRequestDate
		 * @return {booelan}
		 *  True if valid otherwise false.
		 */
	   validateCashRequestDate : function() {
			// Test that the request_date is greater than or equal to
			// the processing_date
			var applDate = dj.byId("appl_date");
			if(!m.compareDateFields(applDate, this)) {
				this.invalidMessage = m.getLocalization("requestDateLessThanAppDateError", [
								_localizeDisplayDate(this),
								_localizeDisplayDate(applDate)]);
				return false;
			}
			var issueDate = dj.byId("iss_date");
			if(!m.compareDateFields(issueDate, this)) {
				this.invalidMessage = m.getLocalization("requestDateLessThanProcessingDateError", [
								_localizeDisplayDate(this),
								_localizeDisplayDate(issueDate)]);
				return false;
			}
			return true;
	   },
	   
	   /**
		 * <h4>Summary:</h4>
		 * This function validates that Alert from date is greater than Alert to date.
		 * @method validateCashRequestDates
		 * @return {boolean}
		 *  True if valid otherwise false.
		 */
	   validateAlertDates : function() {
			// Test that the request_date is greater than or equal to
			// the processing_date

			var fromDate = dj.byId("alert_date");
			var toDate = dj.byId("alert_date2");
			if(fromDate && fromDate.get("value")!=="" && toDate && toDate.get("value")!=="" && (!m.compareDateFields(fromDate, toDate)))
			{
				this.invalidMessage = m.getLocalization("alertToDateLessThanFromError", [
								_localizeDisplayDate(toDate),
								_localizeDisplayDate(fromDate)]);
				toDate.set("state", "Error");
				dj.showTooltip(this.invalidMessage,toDate.domNode, 0);
				return false;
			}
			return true;
	   },
	   
	   /**
		 * Validate the transaction type drop down for Screens 
		 * related to Loan Product
		 *  
		 */
	   validateLoanTransactionTypeDropDown : function() {	
		   
			dj.byId("tnx_type_code_parameter").set("value", "");
			dj.byId("sub_tnx_type_code_parameter").set("value", "");
			dj.byId("sub_product_code_parameter").set("value", "");
			
			var tnx_sub_tnx_combine = (dj.byId("tnx_type_code_dropdown").get("value")).split(":");
			if(dj.byId("tnx_type_code_dropdown") && dj.byId("tnx_type_code_dropdown") != " "){
				var tnx_type_code = dj.byId("tnx_type_code_parameter");
				var sub_tnx_type_code = dj.byId("sub_tnx_type_code_parameter");
				var sub_product_code = dj.byId("sub_product_code_parameter") ;
				if(tnx_sub_tnx_combine.length > 1)
				{
					tnx_type_code.set('value',tnx_sub_tnx_combine[0]);
					sub_tnx_type_code.set('value',tnx_sub_tnx_combine[1]);
					sub_product_code.set('value',"");
				}
				else
				{
					tnx_type_code.set('value',tnx_sub_tnx_combine[0]);
					sub_product_code.set('value',"LNRPN");
					sub_tnx_type_code.set('value',"");
				}
			}
	},
	   
	validateLoanTransactionStatusDropDown : function()
	{
		dj.byId("tnx_stat_code_parameter").set("value","");
		if(dj.byId("sub_tnx_stat_code_parameter")){
			dj.byId("sub_tnx_stat_code_parameter").set("value", "");
		}
		
		
	   if(dj.byId("tnx_stat_code_dropdown") && dj.byId("tnx_stat_code_dropdown") != " "){
		   var tnx_sub_tnx_combine = (dj.byId("tnx_stat_code_dropdown").get("value")).split(":");
		   var tnx_stat_code_parameter = dj.byId("tnx_stat_code_parameter");
			var sub_tnx_stat_code_parameter = dj.byId("sub_tnx_stat_code_parameter");
			if(tnx_sub_tnx_combine.length > 1)
			{
				tnx_stat_code_parameter.set('value',tnx_sub_tnx_combine[0]);
				sub_tnx_stat_code_parameter.set('value',tnx_sub_tnx_combine[1]);
				
			}
			else
			{
				tnx_stat_code_parameter.set('value',tnx_sub_tnx_combine[0]);
				if(sub_tnx_stat_code_parameter){
					sub_tnx_stat_code_parameter.set('value',"");
				}
				
			}
		   
	   }
	},
	   
	isLegalTextAcceptedForAuthorizer : function() {	
		
		 var isValid = false, 
		errorMsg;
		m.xhrPost({
		url : m.getServletURL("/screen/AjaxScreen/action/ValidateAuthorizer"),
		handleAs : "json",
		sync : true,
		preventCache: true,
		content : {
			productCode : dj.byId("product_code") ? dj.byId("product_code").get("value") : misys._config.productCode,
			subProductCode : dijit.byId('sub_product_code') ? dijit.byId('sub_product_code').get('value') : '',
			tnxtype : dijit.byId('tnxtype').get('value') ? dijit.byId('tnxtype').get('value') : dijit.byId('tnx_type_code').get('value'),
			option : dj.byId("option") ? dj.byId("option").get("value") : '',
			subtnxtypeCode :  dj.byId("sub_tnx_type_code") ? dj.byId("sub_tnx_type_code").get("value") : '',
			xml : misys.formToXML({ignoreDisabled: true}),
			mode : dj.byId("mode") ? dj.byId("mode").get("value") : '',
			operation : dj.byId("realform_operation") ? dj.byId("realform_operation").get("value") : ""
			
		},		
		load : function(response, ioArgs)
		{   
			isValid = response.isValid;
			errorMsg = response.errorMsg;
		},
		customError : function(response, ioArgs)
		{
			console.error(" processRepricingOfRecords error", response);
			m._config = m._config || {};
			dojo.mixin(m._config,{legalTextEnabled:false});
		}

		});
	if(isValid){
//		return true when there is no dialog box, added this to accomodate new changes to legal text
		var legalDialog = dijit.byId("legalDialog");
		if(!legalDialog){
			return true;
		}
		if(legalDialog.open === false ){
				dj.byId("accept_legal_text").set("checked", false);
				dijit.byId('submitlegal').set('disabled',true);
				
		}
		m.dialog.connect(dj.byId('submitlegal'), 'onClick', function(){
			
			legalDialog.hide();
			setTimeout(function(){
				m.acceptLegalText();
			}, 500);
		}, legalDialog.id);
		
		m.dialog.connect(dj.byId('cancel'), 'onClick', function(){
			 m.dialog.disconnect(legalDialog);
		}, legalDialog.id);
		
		m.dialog.connect(d.byId('legalDialog_close'), 'onClick', function(){
			m.dialog.disconnect(legalDialog);
		});
		
		dijit.byId("alertDialog").hide();
		
		legalDialog.show();
		return false;
		
	}else{
		//Remove these fields from form if current user is not a valid authorizer
		dojo.destroy("authorizer_id");
		dojo.destroy("legal_text_value");
		return true;
	}
	} ,
	   /**
	    * <h4>Summary:</h4>
	    * This fuction validates that processing date should be greater than the application date
	    * also request date should be ore than processing date.
	    * @method validateCashProcessingDate
	    * @return {boolean}
	    *  True if valid otherwise false.
	    */
	   validateCashProcessingDate : function() {
		   if(!this.get("value")) {
				return true;
			}
			// Test that the request_date is greater than or equal to
			// the processing_date
			var applDate = dj.byId("appl_date");
			if(!m.compareDateFields(applDate, this)) {
				this.invalidMessage = m.getLocalization("processingDateLessThanAppDateError", [
								_localizeDisplayDate(this),
								_localizeDisplayDate(applDate)]);
				return false;
			}
			var processingDate = dj.byId("iss_date");
			if(!m.compareDateFields(processingDate, this)) {
				this.invalidMessage = m.getLocalization("requestDateLessThanProcessingDateError", [
								_localizeDisplayDate(this),
								_localizeDisplayDate(processingDate)]);
				return false;
			}
			// validate for current date
			// For Customer End, processing date should not be less than the current date
			// validate only at customer side
			if(this.get("value") !== "")
			{
				 var isValid;
				console.debug("[misys.validation.common] Begin Validating processing Date with current date. Value = ",
						this.get("value"));	
				var currentDate, customer_bank;
			    if(dj.byId("customer_bank"))
				{
					customer_bank = dj.byId("customer_bank").get("value"); 
				}
			    else if(dj.byId("bank_abbv_name"))
				{
					customer_bank = dj.byId("bank_abbv_name").get("value"); 
				}
				else
				{
					customer_bank = dj.byId("issuing_bank_abbv_name").get("value"); 
				}
			    var yearServer, monthServer, dateServer;
			    if(customer_bank !== "" && misys && misys._config && misys._config.businessDateForBank && misys._config.businessDateForBank[customer_bank] && misys._config.businessDateForBank[customer_bank][0] && misys._config.businessDateForBank[customer_bank][0].value !== "")
			    {
			    	yearServer = parseInt(misys._config.businessDateForBank[customer_bank][0].value.substring(0,4), 10);
					monthServer = parseInt(misys._config.businessDateForBank[customer_bank][0].value.substring(5,7), 10);
					dateServer = parseInt(misys._config.businessDateForBank[customer_bank][0].value.substring(8,10), 10);
					currentDate = new  Date(yearServer, monthServer - 1, dateServer);
			    }
			    else if(misys && misys._config && misys._config.bankBusinessDate && misys._config.bankBusinessDate !== "")
			    {
			    	yearServer = parseInt(misys._config.bankBusinessDate.substring(0,4), 10);
					monthServer = parseInt(misys._config.bankBusinessDate.substring(5,7), 10);
					dateServer = parseInt(misys._config.bankBusinessDate.substring(8,10), 10);
					currentDate = new  Date(yearServer, monthServer - 1, dateServer);
			    }
			    else
			    {
			    	currentDate = new Date();
			    }
				// set the hours to 0 to compare the date values
				currentDate.setHours(0, 0, 0, 0);
				// get the localized value in standard format.
				console.debug(currntDatevalue,
						currentDate);	
				// compare the values of the current date and transfer date
				isValid = d.date.compare(m.localizeDate(this), currentDate) < 0 ? false : true;
				if(!isValid)
				{
					 this.invalidMessage = m.getLocalization("processingDateGreaterThanCurrentDateError", [_localizeDisplayDate(this)]);
					 return false;
				}
				console.debug("[misys.validation.common] End Validating processing Date with current date. Value = ",
						this.get("value"));
			}
			return true;
	   },
	   /**
	    * <h4>Summary:</h4>
	    * This function validates that end date should be greater than the system's date
	    * @method validateEndDateWithCurrentDate
	    * @return {boolean}
	    *   True if valid otherwise false.
	    */
	   validateEndDateWithCurrentDate : function()
	   {
	    //  summary:
	    //Validates the end date.
		//Test that the end date is greater than or equal to the system's date.
		   
		   if(!this.get("value")) {
				return true;
			}

		console.debug("[misys.validation.common] Validating end Date, Value = ", 
				this.get("value"));
	    var endDate = this.get("value");
	    var currentDate, customer_bank;
	    if(dj.byId("customer_bank"))
		{
			customer_bank = dj.byId("customer_bank").get("value"); 
		}
	    else if(dj.byId("bank_abbv_name"))
		{
			customer_bank = dj.byId("bank_abbv_name").get("value"); 
		}
		else if(dj.byId("issuing_bank_abbv_name"))
		{
			customer_bank = dj.byId("issuing_bank_abbv_name").get("value"); 
		}
	    var yearServer, monthServer, dateServer;
	    if(customer_bank !== "" && misys && misys._config && misys._config.businessDateForBank && misys._config.businessDateForBank[customer_bank] && misys._config.businessDateForBank[customer_bank][0] && misys._config.businessDateForBank[customer_bank][0].value !== "")
	    {
	    	yearServer = parseInt(misys._config.businessDateForBank[customer_bank][0].value.substring(0,4), 10);
			monthServer = parseInt(misys._config.businessDateForBank[customer_bank][0].value.substring(5,7), 10);
			dateServer = parseInt(misys._config.businessDateForBank[customer_bank][0].value.substring(8,10), 10);
			currentDate = new  Date(yearServer, monthServer - 1, dateServer);
	    }
	    else if(misys && misys._config && misys._config.bankBusinessDate && misys._config.bankBusinessDate !== "")
	    {
	    	yearServer = parseInt(misys._config.bankBusinessDate.substring(0,4), 10);
			monthServer = parseInt(misys._config.bankBusinessDate.substring(5,7), 10);
			dateServer = parseInt(misys._config.bankBusinessDate.substring(8,10), 10);
			currentDate = new  Date(yearServer, monthServer - 1, dateServer);
	    }
	    else
	    {
	    	currentDate = new Date();
	    }
		// set the hours to 0 to compare the date values
		currentDate.setHours(0, 0, 0, 0);
		// get the localized value in standard format.
		console.debug(currntDatevalue,
						currentDate);	
		// compare the values of the current date and end date
		var isValid = d.date.compare(m.localizeDate(this), currentDate) < 0 ? false : true;
		if(!isValid)
		{
			 this.invalidMessage = m.getLocalization("endDateSmallerThanCurrentDate", [_localizeDisplayDate(this)]);
			 return false;
		}
		
		return true;
	   },
	   /**
	    * <h4>Summary:</h4>
	    * This function validates the Expiry date
	    * 
	    * <h4>Description:</h4> 
	    * Expiry date should be greater than the Application date,
	    * Expiry date should be greater than the issue date.
	    * @method validateTradeExpiryDate
	    * @return {boolean}
	    *  True if valid otherwise false.
	    */
	   validateTradeExpiryDate : function() {
			//  summary:
		    //        Validates the data entered as the Expiry Date.
		    // 
		    // TODO Add business logic explanation here
		   
			// This validation is for non-required fields
			if(!this.get("value")) {
				return true;
			}

			console.debug(ExpDateValue,
					this.get("value"));
			
			// Test that the expiry date is greater than or equal to
			// the application date
			var applDate = dj.byId("appl_date");
			if(!m.compareDateFields(applDate, this)) {
				this.invalidMessage = m.getLocalization("expiryDateLessThanAppDateError", [
								_localizeDisplayDate(this),
								_localizeDisplayDate(applDate)]);
				return false;
			}
			
			// Test that the expiry date is greater than or equal to the issue date 
			var issueDate = dj.byId("iss_date");
			if((issueDate) && (!m.compareDateFields(issueDate, this)))
			{
					this.invalidMessage = m.getLocalization("issueDateGreaterThanExpiryDateError",[
									_localizeDisplayDate(issueDate),
									_localizeDisplayDate(this)]);
					return false;
			}
			
			var orgExpDate = dj.byId("org_previous_exp_date");
			if((orgExpDate) && (!m.compareDateFields(orgExpDate, this)))
			{
					this.invalidMessage = m.getLocalization("orgExpDateGreaterThanExpiryDateError",[
									_localizeDisplayDate(this),
									_localizeDisplayDate(orgExpDate)]);
					return false;
			}
			
			// Test that the expiry date is greater than or equal to the Amendment date 
			var amdDate = dj.byId("amd_date");
			if((amdDate) && (!m.compareDateFields(amdDate, this)))
			{
					this.invalidMessage = m.getLocalization("ExpiryDateLessThanamendDate",[
									_localizeDisplayDate(this),
									_localizeDisplayDate(amdDate)]);
					return false;
			}
			
			
			
			// Test that the expiry date is greater than or equal to the last shipment detail
			var lastShipDate = dj.byId("last_ship_date");
			if((lastShipDate) && (!m.compareDateFields(lastShipDate, this)))
			{
					this.invalidMessage = m.getLocalization("expiryDateLessThanLastShipmentError",[
							        _localizeDisplayDate(this),
									_localizeDisplayDate(lastShipDate)
									]);
					return false;
			}
			
			var oldLastShipDate = dj.byId("org_last_ship_date");
			if((lastShipDate && lastShipDate.get("value") == null) && (oldLastShipDate && !m.compareDateFields(oldLastShipDate, this)))
				{
					this.invalidMessage = m.getLocalization("newexpiryDateLessThanOldShipmentError",[
									_localizeDisplayDate(oldLastShipDate),
									_localizeDisplayDate(this)]);
					return false;
	   		}
				
			var renewalCalDate = dj.byId("renewal_calendar_date");
			if(renewalCalDate)
				{
				if(renewalCalDate.get("value") != null && this.get("value") != null && (renewalCalDate.get("value") > this.get("value"))) {
					var localizedCalendarDate = dojo.date.locale.format(renewalCalDate.get("value"), {selector:"date", formatLength:"short", locale:dojo.config.locale});
					var localizedExpiryDate = dojo.date.locale.format(this.get("value"), {selector:"date", formatLength:"short", locale:dojo.config.locale});
					renewalCalDate.invalidMessage = m.getLocalization("calendarDateLessThanSystemDate", [localizedCalendarDate,localizedExpiryDate]);
					renewalCalDate.set("state","Error");
				}
				else if(renewalCalDate.get("value") != null && this.get("value") != null && renewalCalDate.get("value") <= this.get("value"))
				{
					renewalCalDate.set("state","");
				}
				}
			
			var nextRevolveDate = dj.byId("next_revolve_date");
			if(nextRevolveDate && !m.compareDateFields(nextRevolveDate, this)) 
			{
				this.invalidMessage = m.getLocalization("expDateLessThanNextRevolveDateError", [
									_localizeDisplayDate(nextRevolveDate),
									_localizeDisplayDate(this)]);
				return false;
			}
			
			// Test that the expiry date is greater than or equal to the Business date
			if(!m._config.isBank){

				var expDate = this.get("value");

				var days = validateBusinessDate(this);
				if(days < 0)
				{
				console.debug(ExpDateCurrntDate, days);
					this.invalidMessage = m.getLocalization("expiryDateSmallerThanSystemDate",[
					                                               						         _localizeDisplayDate(this)
					                                               								]);
					return false;
				}	
			}
			return true;
		}, 
		
		/**
		 * <h4>Summary:</h4>  This method validates the maturity date with the current date.
		 * <h4>Description</h4> : This method validates the maturity date with the current date.
		 * Validation - The maturity date should be greater than the current date else an error will be thrown.
		 *
		 * @method validateEnteredDateGreaterThanCurrentDate
		 */
		validateEnteredDateGreaterThanCurrentDate : function() {
				
			if(!m._config.isBank || (m._config.isBank && dj.byId("prod_stat_code") && dj.byId("prod_stat_code").get("value") === '03' || dj.byId("prod_stat_code").get("value") === '08'))
			{	
		
				var maturityDate = dj.byId("maturity_date");
				if(this.get("value")!=null)
					{
				var days = validateBusinessDate(this);
				if(days < 0)
				{					
					console.debug("[misys.binding.trade.message_bg] Result of comparison = ", m.getLocalization("lessthanCurrentDate"));					
					m.dialog.show("ERROR", m.getLocalization("lessthanCurrentDate"));					
					maturityDate.set("value", " ");
					return false;
				}
					}
			}
			return true;												
		},
		   /**
		    * <h4>Summary:</h4>
		    * This function validates the Amend Expiry date onChange
		    * 
		    * <h4>Description:</h4> 
		    * Expiry date should be greater than the Application date,
		    * Expiry date should be greater than the issue date.
		    * @method validateAmendBGTradeExpiryDate
		    */
		   validateAmendBGTradeExpiryDate : function() {
				//  summary:
			    //        Validates the data entered as the Expiry Date.
			    // 
			    // TODO Add business logic explanation here
			   

				console.debug(ExpDateValue,
						this.get("value"));
								
				// Test that the expiry date is greater than or equal to the Amendment date 
				var amdDate = dj.byId("amd_date");
				if((amdDate) && (!m.compareDateFields(amdDate, this)))
				{
					this.invalidMessage =m.getLocalization("ExpiryDateLessThanamendDate",[_localizeDisplayDate(this),_localizeDisplayDate(amdDate)]);
					return false;
				}
									
				
				// Test that the expiry date is greater than or equal to the current date

				var expDate = this.get("value");
				var days = validateBusinessDate(this);
			if(days < 0)
				{
				this.invalidMessage = m.getLocalization("expiryDateSmallerThanSystemDate",[_localizeDisplayDate(this)]);
				return false;
				}
				
				//Test that the expiry date is more than the renewal calendar date(if renewal calendar date is there).
				var renewalCalDate = dj.byId("renewal_calendar_date");
				if(renewalCalDate)
				{
					if(renewalCalDate.get("value") != null && this.get("value") != null && (renewalCalDate.get("value") > this.get("value"))) 
					{
						this.invalidMessage =m.getLocalization("expiryDateLessThanRenewalDate", [_localizeDisplayDate(renewalCalDate)]);
						return false;
					}
				}	
				return true;
			},
		
		/**
		 * <h4>Summary:</h4>
		 * This function validates the data enetered as the contract date.
		 * <h4>Description:</h4> 
		 * This checks for the following scenarios
		 * The new contract date should be before the application date.
		 * @method validateContractDate
		 * @return {booelan}
		 *   True if valid otherwise false.
		 */
		validateContractDate : function(){
			
			
			if(!this.get("value")) {
				return true;
			}

			console.debug("[misys.validation.common] Validating Contract Date. Value = ",
					this.get("value"));
			
			// Test that the contract date is less than or equal to
			// the application date
			var applDate = dj.byId("appl_date");
			if(!m.compareDateFields( this, applDate)) {
				this.invalidMessage = m.getLocalization("contractDateGreaterThanApplicationDateError", [
								_localizeDisplayDate(this),
								_localizeDisplayDate(applDate)]);
				return false;
			}
			
			return true;
			
		},
		/**
		 * <h4>Summary:</h4>
		 * This function validates the data enetered as the Base date.
		 * <h4>Description:</h4> 
		 * This checks for the following scenarios
		 * The new contract date should be before the application date.
		 * @method validateBaseDate
		 * @return {booelan}
		 *   True if valid otherwise false.
		 */
		validateBaseDate : function(){
			
			
			if(!this.get("value")) {
				return true;
			}

			console.debug("[misys.validation.common] Validating base Date. Value = ",
					this.get("value"));
			
			// Test that the contract date is less than or equal to
			// the application date
			var applDate = dj.byId("appl_date");
			if(!m.compareDateFields( this, applDate)) {
				this.invalidMessage = m.getLocalization("baseDateGreaterThanApplicationDateError", [
								_localizeDisplayDate(this),
								_localizeDisplayDate(applDate)]);
				return false;
			}
			
			return true;
			
		},
		/**
		 * <h4>Summary:</h4>
		 * This function validates the data enetered as the document date.
		 * <h4>Description:</h4> 
		 * This checks for the following scenarios
		 * The new document date should be before the application date.
		 * @method validateDocumentDate
		 * @return {booelan}
		 *   True if valid otherwise false.
		 */
		validateDocumentDate : function(){
			
			
			if(!this.get("value")) {
				return true;
			}

			console.debug("[misys.validation.common] Validating Contract Date. Value = ",
					this.get("value"));
			
			// Test that the contract date is less than or equal to
			// the application date
			var applDate = dj.byId("appl_date");
			if(!m.compareDateFields( this, applDate)) {
				this.invalidMessage = m.getLocalization("documentDateGreaterThanApplicationDateError", [
								_localizeDisplayDate(this),
								_localizeDisplayDate(applDate)]);
				
				m._config.errorField.push(this);
				return false;
			}
			if(!(this.get("state") === "Error")) {
				m._config.errorField = [];
			}
			
			return true;
			
		},
		
		/**
		 * <h4>Summary:</h4>
		 * This function validates the data enetered as the tender expiry date.
		 * <h4>Description:</h4> 
		 * This checks for the following scenarios
		 * The tender expiry date should be after the application date.
		 * @method validateTenderExpiryDate
		 * @return {booelan}
		 *   True if valid otherwise false.
		 */
		validateTenderExpiryDate : function(){
			
			
			if(!this.get("value")) {
				return true;
			}

			console.debug("[misys.validation.common] Validating Tender Expiry Date. Value = ",
					this.get("value"));
			
			// Test that the contract date is greater than or equal to
			// the application date
			var applDate = dj.byId("appl_date");
			if(!m.compareDateFields(applDate, this)) {
				this.invalidMessage = m.getLocalization("tenderExpDateLessThanApplicationDateError", [
								_localizeDisplayDate(this),
								_localizeDisplayDate(applDate)]);
				return false;
			}
			
			// Test that the contract date is less than or equal to
			// the expiry date
			var expDate = dj.byId("exp_date");
			if((expDate) && (!m.compareDateFields(this, expDate)))
			{
					this.invalidMessage = m.getLocalization("expDateGreaterThanTenderExpiryDateError",[
									_localizeDisplayDate(this),
									_localizeDisplayDate(expDate)]);
					return false;
			}
			
			return true;
			
		},
		
		/**
		 * <h4>Summary:</h4>
		 * This function validates the data enetered as the Expiry date.
		 * <h4>Description:</h4> 
		 * This checks for the following scenarios
		 * The new expiry date should be after the original expiry date.
		 * The new expiry date should be after the issue date.
		 * @method validateMessageTradeExpiryDate
		 * @return {booelan}
		 *   True if valid otherwise false.
		 */
		validateMessageTradeExpiryDate : function() {
			//  summary:
		    //        Validates the data entered as the Expiry Date.
		    // 
		    // TODO Add business logic explanation here
		   
			// This validation is for non-required fields
			if(!this.get("value")) {
				return true;
			}

			// Test that the expiry date is greater than or equal to the original expiry date (hidden fields)
			var thisObject  = dj.byId(this.id);
			var orgExpDateDate = dj.byId("org_exp_date");
			
			if(!m.compareDateFields(orgExpDateDate, thisObject)) {
				this.invalidMessage = m.getLocalization("expiryDateSmallerThanOrgExpiryDate",[
								_localizeDisplayDate(thisObject),
								_localizeDisplayDate(orgExpDateDate)]);
				return false;
			}
			
			
			// Test that the Next revolve date is greater than or equal to the issue date 
			var issueDate = dj.byId("iss_date");
			if(!m.compareDateFields(issueDate, thisObject)) {
				this.invalidMessage = m.getLocalization("expiryDateSmallerThanIssueDate",[
								_localizeDisplayDate(thisObject),
								_localizeDisplayDate(issueDate)]);
				return false;
			}
			
			// Test that the expiry date is greater than or equal to the current date
			
		var days = validateBusinessDate(this);
			if(days < 0)
					{
					console.debug(ExpDateCurrntDate, days);
				this.invalidMessage = m.getLocalization("expiryDateSmallerThanSystemDate",[
				                                               						         _localizeDisplayDate(thisObject)
				                                               								]);
			return false;
			}
			
			return true;
		}, 
		
		/**
		 * <h4>Summary:</h4>
		 * This function validates the message transfer expiry date 
		 * <h4>Description:</h4> 
		 * Expiry date should be greater than the issue date
		 * @method validateMessageTransferTradeExpiryDate
		 * @return {boolean}
		 *  True if valid otherwise false.
		 */
		validateMessageTransferTradeExpiryDate : function() {
			//  summary:
		    //        Validates the data entered as the Expiry Date.
		    // 
		    // TODO Add business logic explanation here
		   
			// This validation is for non-required fields
			if(!this.get("value")) {
				return true;
			}

			// Test that the expiry date is greater than or equal to the original expiry date (hidden fields)
			var thisObject  = dj.byId(this.id);
			var orgExpDateDate = dj.byId("org_exp_date");
			
			if(!m.compareDateFields(thisObject, orgExpDateDate)) {
				this.invalidMessage = m.getLocalization("expiryDateBiggerThanOrgExpiryDate",[
								_localizeDisplayDate(thisObject),
								_localizeDisplayDate(orgExpDateDate)]);
				return false;
			}
			
			
			// Test that the expiry date is greater than or equal to the issue date (hidden fields)
			var issueDate = dj.byId("iss_date");
			if(!m.compareDateFields(issueDate, thisObject)) {
				this.invalidMessage = m.getLocalization("expiryDateSmallerThanIssueDate",[
								_localizeDisplayDate(thisObject),
								_localizeDisplayDate(issueDate)]);
				return false;
			}
			
			// Test that the expiry date is greater than or equal to the Business date
			var days = validateBusinessDate(this);
			if(days < 0)
			{
				console.debug(ExpDateCurrntDate, days);
				this.invalidMessage = m.getLocalization("expiryDateSmallerThanSystemDate",[
				                                               						         _localizeDisplayDate(thisObject)
				                                               								]);
			return false;
			}
			
			return true;
		}, 

		/**
		 * <h4>Summary:</h4>
		 * This function validates Free format message if it is null. 
		 * <h4>Description:</h4> 
		 * Free format message should'nt be null.
		 * @method validateFreeFormatMessage
		 * @return {boolean}
		 *  True if valid otherwise false.
		 */
		validateFreeFormatMessage : function(){
			if(dj.byId("free_format_text").get("value")==="" || dj.byId("free_format_text").get("value") ===null){
				console.debug("[misys.validation.common] validating 'Customer Instructions' of 'Free Formate Message' if it is null");
				this.invalidMessage = m.getLocalization("requiredToolTip");
				return false;
			}else{
				return true;
			}
		},
		
		/**
		 * <h4>Summary:</h4>
		 * This fucntion validates the data entered as the Maturity date
		 * <h4>Description:</h4> 
		 * Maturity date sholud be greater than the application date
		 * @method validateTradeMaturityDate
		 * @return {boolean}
		 *  True if valid otherwise false.
		 */
		validateTradeMaturityDate : function() {
			//  summary:
		    //        Validates the data entered as the Expiry Date.
		    // 
		    // TODO Add business logic explanation here
		   
			// This validation is for non-required fields
			if(!this.get("value")) {
				return true;
			}

			console.debug(ExpDateValue,
					this.get("value"));
			
			// Test that the expiry date is greater than or equal to
			// the application date
			var applDate = dj.byId("appl_date");
			if(!m.compareDateFields(applDate, this)) {
				this.invalidMessage = m.getLocalization("maturityDateLessThanAppDateError", [
								_localizeDisplayDate(this),
								_localizeDisplayDate(applDate)]);
				return false;
			}

			
			return true;
		}, 
		/**
		 * <h4>Summary:</h4>
		 * This function validates the data entered as the BL On board or AWB issue date.
		 * <h4>Description:</h4> 
		 * Awb Issue date should be greater than application date
		 * @method validateAWBIssueDate
		 * @return {boolean}
		 *  True if valid otherwise false.
		 */
		validateAWBIssueDate : function() {
			//  summary:
		    //        Validates the data entered as the BL On Board/AWB Issue Date.
		    // 
			// This validation is for non-required fields
			if(!this.get("value")) {
				return true;
			}

			console.debug("[misys.validation.common] Validating AWB Issue Date. Value = ",
					this.get("value"));
			
			// Test that the Awb Issue date is greater than or equal to
			// the application date
			var applDate = dj.byId("appl_date");
			if(!m.compareDateFields(applDate, this)) {
				this.invalidMessage = m.getLocalization("awbIssueDateLessThanAppDateError", [
								_localizeDisplayDate(this),
								_localizeDisplayDate(applDate)]);
				return false;
			}
			
			return true;
		}, 		
		/**
		 * <h4>Summary:</h4>
		 * This function validates the data enteredin date field.
		 * @method validateOrderedDates
		 */
		validateOrderedDates : function ( /*Boolean*/ isFocused, 
										  /*String*/ earlierDateId,
										  /*String*/ laterDateId,
										  /*String*/ localizationString) {
			//  summary:
		    //        Validates the data entered as the Last Shipment Date.
			// TODO Refactor once update committed, no need for this call to be as complicated as 
			//      it is

			// Return true for empty values
			if(!this.get("value")){
				return true;
			}
			
			console.debug("[misys.validation.common] Validating Start date. Value = ",
					this.get("value"));
			
			// Test that the last shipment date is greater than or equal to
			// the application date
			var endDate = dj.byId(laterDateId);
			if(!m.compareDateFields(this,endDate)) {
				this.invalidMessage = m.getLocalization(localizationString, [
								_localizeDisplayDate(this),
								_localizeDisplayDate(endDate)]);
				return false;
			}
			
			var startDate = dj.byId(earlierDateId);
			if(!m.compareDateFields(startDate, this)) {
				this.invalidMessage = m.getLocalization(localizationString, [
								_localizeDisplayDate(startDate),
								_localizeDisplayDate(this)]);
				
				return false;
			}

			return true;
		}, 
		
		// TODO Refactor once update committed, no need for this call to be as complicated as it is
		// TODO Also, the name of the function makes no sense. Greater than what?
		/**
		 * Sunmmary:
		 * This function validates that the date entered is greater than the date passed as argument.
		 * @param {boolean} isFocussed
		 * @param {String} earlierDateName
		 * @param {String} errorMessage
		 * @method validateDateGreaterThan
		 */
		validateDateGreaterThan : function( /*Boolean*/ isFocused,
				                            /*String*/ earlierDateName,
				                            /*String*/ errorMessage) {
			//  summary:
		    //        Validates the date entered as greater than the date passed on argument.
			//        earlierDateName can be equals to "" or be null. In this case,
			//        comparison will be made relative to the current date.
			//        

			// Return true for empty values
			if(!this.get("value")){
				return true;
			}
			
			// retrieve the earlier date
			var earlierDate;
			if (!earlierDateName) {
				// TODO: modify to get the real date of the day (not the appl_date)
				earlierDate = dj.byId("appl_date");
			}
			else {
				earlierDate = dj.byId(earlierDateName);
			}
			
			console.debug("[misys.validation.common] Validating Date (", this.get("value"),
					") Greater than earlier date ", earlierDate.get("value"));
			// Test that the far date is greater than or equal to the earlier date
			if(!m.compareDateFields(earlierDate, this)) {
				this.invalidMessage = m.getLocalization(errorMessage, [
								_localizeDisplayDate(this),
								_localizeDisplayDate(earlierDate)]);
				return false;
			}

			return true;
		},
		
		// TODO Refactor once update committed, no need for this call to be as complicated as it is
		// TODO Also, the name of the function makes no sense.Smaller than what?
		/**
		 * <h4>Summary:</h4>
		 * This function validates that the date entered is smaller than the date passed as argument.
		 * @param {Boolean} isFocused
		 * @param {String} lateDateName
		 * @param {String} errorMessage
		 * @method validateDateSmallerThan
		 */
		validateDateSmallerThan : function( /*Boolean*/ isFocused,
				                            /*String*/ laterDateName, 
				                            /*String*/ errorMessage) {
			//  summary:
		    //        Validates the data entered as smaller than the date passed on argument.
		  
			// Return true for empty values
			if(!this.get("value")){
				return true;
			}

			// Test that the far date is greater than or equal to
			// the value date
			var laterDate = dj.byId(laterDateName);
			console.debug("[misys.validation.common] Validating Date (", this.get("value"), 
					") smaller than later date ", laterDate.get("value"));
			if(!m.compareDateFields(this, laterDate)) {
				this.invalidMessage = m.getLocalization(errorMessage, [
								_localizeDisplayDate(this),
								_localizeDisplayDate(laterDate)]);
				return false;
			}

			return true;
		}, 
		/**
		 * <h4>Summary:</h4>
		 * This function validates the data entered as the Last shipment date
		 * @method validateLastShipmentDate
		 * <h4>Description:</h4> 
		 * </br>Last shipment date should be greater than the application date
		 * </br>Last shipment date should be  less than the expiry date
		 * </br>Last shipment date should be less than the Amend date 
		 * </br>Last shipment date should be less than due date
		 * @method validateLastShipmentDate
		 * @return {booelan} 
		 *  True if valid otherwise false.
		 */
		validateLastShipmentDate : function() {
			//  summary:
		    //        Validates the data entered as the Last Shipment Date.
			// 
			// TODO Add business logic explanation
			
			//Do not validate for Close event
			/*if((dj.byId("tnxtype") && (dj.byId("tnxtype").get("value") === "38")) || 
			    	(dj.byId("close_tnx") && (dj.byId("close_tnx").get("checked") === true)))
			{
				  return true;
			}*/
						// Return true for empty values
			if(!this.get("value")){
				return true;
			}
			
			console.debug("[misys.validation.common] Validating Last Ship Date. Value = ", 
					this.get("value"));
			
			// Test that the last shipment date is greater than or equal to
			// the application date
//			var applDate = dj.byId("appl_date");
//			if(!m.compareDateFields(applDate, this)) {
//				this.invalidMessage = m.getLocalization("lastShipmentDateLessThanAppDateError",[
//								_localizeDisplayDate(this),
//								_localizeDisplayDate(applDate)]);
//				return false;
//			}
			
			// Test that the Latest Ship Date is greater than or
			// equal to the issue date
			/*var issueDate = dj.byId("iss_date");
			if (issueDate && issueDate.get("value"))
			{
				if (d.date.compare(this.get("value"), m.localizeDate(issueDate)) < 0)
				{
					this.invalidMessage = m.getLocalization(
							"issDateSmallerThanLatestShipDate", [
									_localizeDisplayDate(this),
									_localizeDisplayDate(issueDate) ]);
					return false;
				}
			}*/
			// Test that the last shipment date is less than or equal to the 
			// expiry date.
			var expDate = dj.byId("exp_date");

			if(!m.compareDateFields(this, expDate)) {
				this.invalidMessage = m.getLocalization("expiryDateLessThanLastShipmentError",[
								_localizeDisplayDate(expDate),
								_localizeDisplayDate(this)]);
				return false;
			}
			
			// this is moved to OpenAccount validation
			/*var maxBpoExpiryDate = m.getMaxBPOExpiryDate();
				if(this.get("value") !== "" && maxBpoExpiryDate && maxBpoExpiryDate !== "") {
					if(d.date.compare(this.get("value"), maxBpoExpiryDate) > 0 ) {
						this.invalidMessage = m.getLocalization("lastShipmentDateGreaterThanBpoExpiryDateError",[
	                                _localizeDisplayDate(this),
	                                dojo.date.locale.format(maxBpoExpiryDate,{locale:dojo.config.locale, formatLength:"short", selector:"date" })]);
						return false;
				}
			
			if(expDate && !m.compareDateFields(this, expDate)) {
				this.invalidMessage = m.getLocalization("latestShipDateLessThanExpiryDateError",[
				                _localizeDisplayDate(this),
								_localizeDisplayDate(expDate)]);
				return false;
			}*/
			
			//Test if there is no new exp date then shipmnet date should check with old exp date
			if(expDate && expDate.get("value") == null)
			{
				var oldExpDate = dj.byId("org_exp_date");
				if(oldExpDate && !m.compareDateFields(this, oldExpDate)) {
					this.invalidMessage = m.getLocalization("originalexpiryDateLessThanLastShipmentError",[
									_localizeDisplayDate(oldExpDate),
									_localizeDisplayDate(this)]);
					return false;
				}
			}		
			
			
			// Test that the last shipment date is less than or equal to the 
			// amendment date.
			//Removed test for amendment date and shipment date as per suggestion by BA MPS-54646
			
			
			// Test that the last shipment date is less than or equal to the 
			// due date (used in IN product).
			var dueDate = dj.byId("due_date");
			if(!m.compareDateFields(this, dueDate)) {
				this.invalidMessage = m.getLocalization("dueDateLessThanLastShipmentError",[
								_localizeDisplayDate(dueDate),
								_localizeDisplayDate(this)]);
				return false;
			}
			
			var earliestShipDate = dj.byId("earliest_ship_date");
			if (earliestShipDate && earliestShipDate.get("value") !== null)
			{
				if(misys._config.shipment_period_standard === false){
					if((!m.compareDateFields(earliestShipDate, this)) ){
						this.invalidMessage = m.getLocalization("lastDateLesserThanEarliestShipmentDate",[
									_localizeDisplayDate(this),
									_localizeDisplayDate(earliestShipDate)]);
					return false;
					}
				} else {
					if(!m.compareDateFields(earliestShipDate, this)) {
					this.invalidMessage = m.getLocalization("lastShipDateLessThanEarliestShipDateError",[
									_localizeDisplayDate(this),
									_localizeDisplayDate(earliestShipDate)]);
					return false;
					}
				}
			}
			
			// this is moved to OpenAccount validation
			/*
			// Test that the last ship date is greater than the
			// Earliest Ship Date
			var earliestShipDate = dj.byId("earliest_ship_date");
			if (earliestShipDate && earliestShipDate.get("value") !== null)
			{
				if (d.date.compare(this.get("value"), m.localizeDate(earliestShipDate)) < 0)
				{
					this.invalidMessage = m.getLocalization(
							"lastShipDateLessThanEarliestShipDateError", [
									_localizeDisplayDate(this),
									_localizeDisplayDate(earliestShipDate) ]);
					return false;
				}
			}
			
			// Test that the line item latest ship date is greater than the
			// line item Earliest Ship Date
			var lineItemEarliestShipDate = dj.byId("line_item_earliest_ship_date");
			if (lineItemEarliestShipDate && lineItemEarliestShipDate.get("value") !== null)
			{
				if (d.date.compare(this.get("value"), m.localizeDate(lineItemEarliestShipDate)) < 0)
				{
					this.invalidMessage = m.getLocalization(
							"lastShipDateLessThanEarliestShipDateError", [
									_localizeDisplayDate(this),
									_localizeDisplayDate(lineItemEarliestShipDate) ]);
					return false;
				}
			}
			
			// Test that the line item shipment sub schedule latest ship date is greater than the
			// line item shipment sub schedule Earliest Ship Date
			var scheduleEarliestShipDate = dj.byId("schedule_earliest_ship_date");
			var schedule = dj.byId("line_item_shipment_schedules");
			if(schedule && schedule.store  && schedule.store._arrayOfTopLevelItems.length > 0 && scheduleEarliestShipDate && scheduleEarliestShipDate.get("value") !== null) 
			{
				if (d.date.compare(this.get("value"), m.localizeDate(scheduleEarliestShipDate)) < 0)
				{
					this.invalidMessage = m.getLocalization(
							"lastShipDateLessThanEarliestShipDateError", [
									_localizeDisplayDate(this),
									_localizeDisplayDate(scheduleEarliestShipDate) ]);
					return false;
				}
			}			*/
			return true;
		}, 
		/**
		 * <h4>Summary:</h4>
		 * This function validates the data entered as the Earliest shipment date
		 * @method validateEarliestShipmentDate
		 * <h4>Description:</h4> 
		 * </br>Last shipment date should be  less than the expiry date 
		 * </br>Last shipment date should be less than last date
		 * @method validateEarliestShipmentDate
		 * @return {boolean} 
		 *  True if valid otherwise false.
		 */
		validateEarliestShipmentDate : function() {
			// Return true for empty values  
			if(!this.get("value")){
				return true;
			}
			
			console.debug("[misys.validation.common] Validating Earliest Ship Date. Value = ", 
					this.get("value"));
			var lastDate = dj.byId("last_ship_date");
			var expDate = dj.byId("exp_date");

			if((!m.compareDateFields(this, lastDate))) {
				this.invalidMessage = m.getLocalization("earliestDateGreaterThanLastShipmentDate",[
								_localizeDisplayDate(lastDate),
								_localizeDisplayDate(this)]);
				return false;
			}
			
			if(!m.compareDateFields(this, expDate)) {
				this.invalidMessage = m.getLocalization("earliestDateGreaterThanExpiryDate",[
								_localizeDisplayDate(expDate),
								_localizeDisplayDate(this)]);
				return false;
			}
			return true;
		},
		
		/**
		 * <h4>Summary:</h4>
		 * Validates the data entered as the Last shipment date 
		 * <h4>Description:</h4> 
		 * It checks for the following scenarios
		 * </br>The Last Shipment Date must be greater than or equal to the Application Date.
		 * </br>The Expiry Date must be greater than or equal to the Last Shipment Date.
		 * </br>The new last shipment date should not exceed the original last shipment date.
		 * @method validateMessageTransferLastShipmentDate
		 * @return {boolean}
		 *   True if valid otherwise false.
		 */
		validateMessageTransferLastShipmentDate : function() {
			//  summary:
		    //        Validates the data entered as the Last Shipment Date.
			// 
			// TODO Add business logic explanation
			
			// Return true for empty values
			if(!this.get("value")){
				return true;
			}
			
			console.debug("[misys.validation.common] Validating Last Ship Date. Value = ", 
					this.get("value"));
			
			// Test that the last shipment date is greater than or equal to
			// the application date
//			var applDate = dj.byId("appl_date");
//			if(!m.compareDateFields(applDate, this)) {
//				this.invalidMessage = m.getLocalization("lastShipmentDateLessThanAppDateError",[
//								_localizeDisplayDate(this),
//								_localizeDisplayDate(applDate)]);
//				return false;
//			}
			
			// Test that the last shipment date is less than or equal to the 
			// expiry date.
			var expDate = dj.byId("exp_date");
			if(!m.compareDateFields(this, expDate)) {
				this.invalidMessage = m.getLocalization("expiryDateLessThanLastShipmentError",[
								_localizeDisplayDate(expDate),
								_localizeDisplayDate(this)]);
				return false;
			}
			
			var thisObject  = dj.byId(this.id);
			var orgLastShipDate = dj.byId("org_last_ship_date");
			
			if(!m.compareDateFields(thisObject, orgLastShipDate)) {
				this.invalidMessage = m.getLocalization("lastShipDateBiggerThanOrgLastShipDate",[
								_localizeDisplayDate(thisObject),
								_localizeDisplayDate(orgLastShipDate)]);
				return false;
			}
			
			return true;
		}, 
		/**
		 * <h4>Summary:</h4>
		 * This function checks if the renew for no field contains a decimal value if so display a specific error message.
		 * <h4>Description:</h4> 
		 * Value should be integer and it should be greater than zero.
		 * @method validateRenewFor
		 * @return {boolean}
		 *   True if valid otherwise false.
		 */
		validateRenewFor : function() {
			//  summary:
		    //  test if the field contains a decimal value if so display a specific error message   

			console.debug("[misys.validation.common] Validating Renew For Value");

			// If renew contain value
			if(!isNaN(dj.byId("renew_for_nb").get("value")))
			{
				var renewFor = dj.byId("renew_for_nb").get("value")+"";
				if(renewFor.indexOf(".")!== -1)
					{
						dj.byId("renew_for_nb").invalidMessage  = m.getLocalization("valueShouldBeInteger");
						return false;
					}
				if(renewFor <= 0) {
					dj.byId("renew_for_nb").invalidMessage  = m.getLocalization("valueShouldBeGreaterThanZero");
					return false;
				}
			}				
			return true;
		},
						/**
						 * <h4>Summary:</h4> This function checks if the advice renewal
						 * days no field contains a decimal value if so display
						 * a specific error message
						 * <h4>Description:</h4> 
						 * Value sholud be an integer and it should be greater than zero.
						 * @method validateDaysNotice
						 * @return {boolean}
						 *  True if valid otherwise false.
						 */
		validateDaysNotice : function() {
			//  summary:
		    //  test if the field contains a decimal value if so display a specific error message   

			console.debug("[misys.validation.common] Validating Days Notice Value");

			// If renew contain value
			if(!isNaN(dj.byId("advise_renewal_days_nb").get("value")))
			{
				var renewFor = dj.byId("advise_renewal_days_nb").get("value")+"";
				if(renewFor.indexOf(".")!== -1)
					{
						dj.byId("advise_renewal_days_nb").invalidMessage  = m.getLocalization("valueShouldBeInteger");
						return false;
					}
				if(renewFor <= 0) {
					dj.byId("renew_for_nb").invalidMessage  = m.getLocalization("valueShouldBeGreaterThanZero");
					return false;
				}
			}
			return true;
		},
		
		/**
		 * <h4>Summary:</h4> This function checks if the Frequency
		 * field contains a decimal value if so display
		 * a specific error message
		 * <h4>Description:</h4> 
		 * Value sholud be an integer and it should be greater than zero.
		 * @method validateRollingFrequency
		 * @return {boolean}
		 *  True if valid otherwise false.
		 */
		validateRollingFrequency : function() {
			// summary:
			// test if the field contains a decimal value if so
			// display a specific error message

			console.debug("[misys.validation.common] Validating Frquency Value");

			// If renew contain value
			if (!isNaN(dj.byId("rolling_renew_for_nb").get("value"))) {
				var renewFor = dj.byId("rolling_renew_for_nb").get("value")+ "";
				if (renewFor.indexOf(".") !== -1) {
					dj.byId("rolling_renew_for_nb").invalidMessage = m.getLocalization("valueShouldBeInteger");
					return false;
				}
				if (renewFor <= 0) {
					dj.byId("rolling_renew_for_nb").invalidMessage = m.getLocalization("valueShouldBeGreaterThanZero");
					return false;
				}
			}
			return true;
		},
		/**
		 * <h4>Summary:</h4> This function checks if the rolling renewal
		 * days number field contains a decimal value if so display
		 * a specific error message.
		 * <h4>Description:</h4> 
		 * Value should be an integer and it should be greater than zero.
		 * @method validateNumberOfRenewals
		 * @return {boolean}
		 *  True if valid otherwise false.
		 */
		validateNumberOfRenewals : function() {
			//  summary:
		    //  test if the field contains a decimal value if so display a specific error message   

			console.debug("[misys.validation.common] Validating Number Of Renewals Value");

			// If renew contain value
			if(!isNaN(dj.byId("rolling_renewal_nb").get("value")))
			{
				var renewFor = dj.byId("rolling_renewal_nb").get("value")+"";
				if(renewFor.indexOf(".")!== -1)
					{
						dj.byId("rolling_renewal_nb").invalidMessage  = m.getLocalization("valueShouldBeInteger");
						return false;
					}
				if(renewFor <= 0) {
					dj.byId("renew_for_nb").invalidMessage  = m.getLocalization("valueShouldBeGreaterThanZero");
					return false;
				}
			}				
			return true;
		},
		/**
		 * <h4>Summary:</h4> This function checks if the rolling cancellation 
		 * days field contains a decimal value if so display
		 * a specific error message
		 * <h4>Description:</h4> 
		 * It checks for the following scenarios
		 * Value enetered should be an integer
		 * Vlaue should be greater than zero.
		 * @method validateCancellationNotice
		 * @return {boolean}
		 *  True if valid otherwise false
		 */
		validateCancellationNotice : function() {
			//  summary:
		    //  test if the field contains a decimal value if so display a specific error message   

			console.debug("[misys.validation.common] Validating Cancellation Notice days Value");

			// If renew contain value
			if(!isNaN(dj.byId("rolling_cancellation_days").get("value")))
			{
				var renewFor = dj.byId("rolling_cancellation_days").get("value")+"";
				if(renewFor.indexOf(".")!== -1)
					{
						dj.byId("rolling_cancellation_days").invalidMessage  = m.getLocalization("valueShouldBeInteger");
						return false;
					}
				if(renewFor <= 0) {
					dj.byId("renew_for_nb").invalidMessage  = m.getLocalization("valueShouldBeGreaterThanZero");
					return false;
				}
			}				
			return true;
		},
		/**
		 * <h4>Summary:</h4>
		 * Validates the positive tolerance of varitaion in drawing.
		 * <h4>Description:</h4> 
		 * It checks for the following scenarios 
		 * Mutual exclusion of Positive or Negative Tolerances and the Maximum Credit Amount.
		 * Value of tolerance should be greater than zero.
		 * @method validateTolerance
		 * @return {boolean}
		 *  True if Tolerance is valid otherwise false.
		 */
		validateTolerance : function() {
			//  summary:
		    //        Validates the positive tolerance of the variation in drawing.
			
			var DrawingTolerenceSpl = (dj.byId("DrawingTolerence_spl") && dj.byId("DrawingTolerence_spl").get("value")==='true');
			var maxCrDescCodeexceed = dj.byId("max_cr_desc_code")? dj.byId("max_cr_desc_code").get("value") : "";
			if(DrawingTolerenceSpl && maxCrDescCodeexceed == 3){
				if(dj.byId("pstv_tol_pct").get("value")!= 0){
					dj.byId("pstv_tol_pct").set("value","0");
				}
				if(dj.byId("neg_tol_pct").get("value")!= 5){
					dj.byId("neg_tol_pct").set("value","5");
				}
			
				dj.byId("pstv_tol_pct").set('readOnly',true);
				dj.byId("neg_tol_pct").set('readOnly',true); 
				if(!isNaN(this.get("value")) && this.get("value") < 0){
					return false;
				}
				console.debug("[misys.validation.common] Validating Tolerence. Value = ",
						this.get("value"));
				return true;
			}else{
			console.debug("[misys.validation.common] Validating Tolerence. Value = ", 
					this.get("value"));

			// If Max Credit Amt has a value, we're in error
			var maxCrDescCode = dj.byId("max_cr_desc_code");
			if(!(isNaN(this.get("value"))|| this.get("value")=="") && maxCrDescCode && maxCrDescCode.get("value")){
				this.invalidMessage = m.getLocalization("toleranceExclusivityError");
				return false;
			}
			else if(!isNaN(this.get("value")) && this.get("value") < 0)
			{
				return false;
			}
			else if(dj.byId("pstv_tol_pct").displayedValue === "." && this.id !=="neg_tol_pct"){  
				this.invalidMessage = m.getLocalization("invalidMessage"); 
				return false;
			}else if(dj.byId("neg_tol_pct").displayedValue === "." && this.id !=="pstv_tol_pct"){
				this.invalidMessage = m.getLocalization("invalidMessage"); 
				return false;
			}

			return true;
			}
		}, 
		/**
		 * <h4>Summary:</h4>
		 * This function validates the maximum credit term of variation in drawing.
		 * @method validateMaxCreditTerm
		 * @retrun {booelan}
		 *  True if valid otherwise false
		 */
		validateMaxCreditTerm : function() {
			//  summary:
		    //        Validates the maximum credit term of the variation in drawing.
			//  <h4>Description:</h4> 
		    //        Note that this shouldn't be wrapped with the standard validation as it 
			//        interferes with the operation of the field.
			
			var DrawingTolerenceSplexceed = dj.byId("DrawingTolerence_spl").get("value")==='true';
			var maxCrDescCodeexceed = dj.byId("max_cr_desc_code");
			if(DrawingTolerenceSplexceed && maxCrDescCodeexceed==3){
				d.forEach(dj.byId("max_cr_desc_code").store.root.children, function(widget){
					if((dj.byId("max_cr_desc_code").get("displayedValue") === widget.text)) {
						status = true;
					}
				});
				dj.byId("pstv_tol_pct").set("value","0");
				dj.byId("neg_tol_pct").set("value","5");
				dj.byId("pstv_tol_pct").set('readOnly',true);
				dj.byId("neg_tol_pct").set('readOnly',true);
				return true;
			}else{
				dj.byId("pstv_tol_pct").set('readOnly',false);
				dj.byId("neg_tol_pct").set('readOnly',false);
				
			console.debug("[misys.validation.common] Validating Max Credit Term. Value = ",
					this.get("value"));
			
			if(this.get("value") &&
					((!isNaN(dj.byId("pstv_tol_pct").get("value")) ||
							!isNaN(dj.byId("neg_tol_pct").get("value")))&& 
							!(dj.byId("pstv_tol_pct").get("value")=="" && 
									dj.byId("neg_tol_pct").get("value")=="") )){
				this.invalidMessage = m.getLocalization("toleranceExclusivityError");
				return false;
			} else {
				var status = false;
				d.forEach(dj.byId("max_cr_desc_code").store.root.children, function(widget){
					if((dj.byId("max_cr_desc_code").get("displayedValue") === widget.text)) {
						status = true;
					}
				});
			}
				return status;
			}
		}, 
		/**
		 * <h4>Summary:</h4>
		 * This function validates the currency.
		 * <h4>Description:</h4> 
		 * Currency code's length should be 3
		 * It should be a valid currency supported in portal
		 * @method validateCurrency
		 * @return {boolean}
		 *  True if valid otherwise false
		 */
		validateCurrency : function() {
			//  summary:
		    //        Validates the currency.
			//        Cache currencies to improve performance

			var currency = this.get("value"),
				isValid = true,
				that = this;
			
			// For non-required empty values, just return true
			if(!currency){
				return true;
			}

			console.debug(validateCurrValue, currency);
			
			// Currency code must be at 3 chars in length
			if(currency.length !== 3){
				return false;
			}		
			if(!m._config.currencyCodes || m._config.currencyCodes.length < 1)
			{
				m._config = m._config || {};
				d.mixin(m._config,{
					currencyCodes : []
				});
	
			m.xhrGet({
					url : currISOCode,
					handleAs :"json",
					contentType : appJson,
				content:{bank_abbv_name:(dj.byId("bank_abbv_name") && misys._config.isMultiBank===true)?dj.byId("bank_abbv_name").get("value"):""},
				preventCache : true,
				sync : true,
				load : function(response, args){
						m._config.currencyCodes = response.currencyCodesJsonArray;
				},
				error : function(response, args){
					console.error(validateCurrError, response);
				}
			});
			}
			if(d.indexOf(m._config.currencyCodes, currency)=== -1)
			{
				that.invalidMessage = m.getLocalization("invalidCurrencyError", 
						[that.get("displayedValue")]);
				isValid = false;
			}
			return isValid;
		},
		
		validateCurrencyObj : function(currencyObj) {
			//  summary:
		    //        Validates the currency.
			//        Cache currencies to improve performance

			var currency = currencyObj.get("value");
			var	isValid = true;
			var	that = currencyObj;
			var displayMessage = "";
			
			// For non-required empty values, just return true
			if(!currency){
				return true;
			}

			console.debug(validateCurrValue, currency);
			
			// Currency code must be at 3 chars in length
			if(currency.length !== 3){
				displayMessage = m.getLocalization("invalidCurrencyError", 
						[that.get("value")]);
				that.focus();
				that.set("value", "");
				dijit.hideTooltip(that.domNode);
				dijit.showTooltip(displayMessage,that.domNode, 0);
				setTimeout(function() {
					dijit.hideTooltip(that.domNode);
				}, 2000);
				return false;
			}		
			if(!m._config.currencyCodes || m._config.currencyCodes.length < 1)
			{
				m._config = m._config || {};
				d.mixin(m._config,{
					currencyCodes : []
				});
	
			m.xhrGet({
					url : currISOCode,
					handleAs :"json",
					contentType : appJson,
				content:{bank_abbv_name:(dj.byId("bank_abbv_name") && misys._config.isMultiBank===true)?dj.byId("bank_abbv_name").get("value"):""},
				preventCache : true,
				sync : true,
				load : function(response, args){
						m._config.currencyCodes = response.currencyCodesJsonArray;
				},
				error : function(response, args){
					console.error(validateCurrError, response);
				}
			});
			}
			if(d.indexOf(m._config.currencyCodes, currency)=== -1)
			{
				displayMessage = m.getLocalization("invalidCurrencyError", 
						[that.get("value")]);
				that.focus();
				that.set("value", "");
				dijit.hideTooltip(that.domNode);
				dijit.showTooltip(displayMessage,that.domNode, 0);
				setTimeout(function() {
					dijit.hideTooltip(that.domNode);
				}, 2000);
				isValid = false;
			}
			return isValid;
		},
		/**
		 * <h4>Summary:</h4>
		 * This function validates the Account Number field
		 * <h4>Description:</h4> 
		 * Account number should be an alpha numeric characters.
		 * No special characters are allowed. 
		 * @method validateAccountNumber
		 * @return {booelan}
		 *  True if valid otherwise false
		 */
		validateUserAccountNumber : function() {
			if(misys._config.userAccountValidationEnabled === "false")
			{
				return true;
			}
			else
			{
				var accountNumber = this.get("value"),
				isValid = true,
				that = this;
	           var accountRegExp = new RegExp(misys._config.userAccountValidationRegex);
	        
	           if(accountNumber !== "" && accountNumber !== null)
	           {                                         
	        	   	  isValid = accountRegExp.test(accountNumber);                         
	           }
				console.debug("[misys.validation.common] Validating Account Number. Value", accountNumber);

				if(!isValid)
				{
					var fieldDispValue = that.get("displayedValue");
					if(fieldDispValue) {
						fieldDispValue = fieldDispValue.replace(/</g, "&lt;");
						fieldDispValue = fieldDispValue.replace(/>/g, "&gt;");
					}
					that.invalidMessage = m.getLocalization("invalidUserAccountNumber", 
							[fieldDispValue]);
					isValid = false;
				}
				return isValid;
			}
		},
				 
		
		/**
		 * <h4>Summary:</h4>
		 * This function validates the currency passed.
		 * <h4>Description:</h4> 
		 * Currency code's length should be 3
		 * It should be a valid currency supported in portal
		 * @method validateCurrencyCode
		 * @return {boolean}
		 *  True if valid otherwise false
		 */
		validateCurrencyCode : function( currencyCode ) {
			//  summary:
		    //        Validates the currency.
			//        Cache currencies to improve performance

			var currency = currencyCode,
				isValid = true,
				that = this;
			
			// For non-required empty values, just return true
			if(!currency){
				return true;
			}

			console.debug(validateCurrValue, currency);
			
			// Currency code must be at 3 chars in length
			if(currency.length !== 3){
				return false;
			}		
			if(!m._config.currencyCodes || m._config.currencyCodes.length < 1)
			{
				m._config = m._config || {};
				d.mixin(m._config,{
					currencyCodes : []
				});
	
			m.xhrGet({
					url : currISOCode,
					handleAs :"json",
					contentType : appJson,
				preventCache : true,
				sync : true,
				load : function(response, args){
						m._config.currencyCodes = response.currencyCodesJsonArray;
				},
				error : function(response, args){
					console.error(validateCurrError, response);
				}
			});
			}
			if(d.indexOf(m._config.currencyCodes, currency)=== -1)
			{
				isValid = false;
			}
			return isValid;
		}, 
		/**
		 * <h4>Summary:</h4>
		 * This function validates the country code field
		 * <h4>Description:</h4> 
		 * Country code lenght should be equal to 2
		 * Also It should be a valid country code
		 * @method validateCountry
		 * @return {booelan}
		 *  True if valid otherwise false
		 */
		validateCountry : function() {
			//  summary:
		    //        Validates the country.

			var country = this.get("value"),
				isValid = true,
				that = this;
			
			// For non-required empty values, just return true
			if(!country){
				return true;
			}

			console.debug("[misys.validation.common] Validating Country. Value", country);
			
			// country code must be at 3 chars in length
			if(country.length !== 2){
				return false;
			}
			
			if(!m._config.countryCodes || m._config.countryCodes.length < 1)
			{
				m._config = m._config || {};
				d.mixin(m._config,{
					countryCodes : []
				});
				
				m.xhrGet({
					url : m.getServletURL("/screen/AjaxScreen/action/GetCountryCodes"),
					handleAs : "json",
					contentType : appJson,
					preventCache : true,
					sync : true,
					load : function(response, args){
						m._config.countryCodes = response.countryCodesJsonArray;
					},
					error : function(response, args){
						console.error("[misys.validation.common] validateCountry error", response);
					}
				});
			}
			if(d.indexOf(m._config.countryCodes, country)=== -1)
			{
				that.invalidMessage = m.getLocalization("invalidCountryError", 
						[that.get("displayedValue")]);
				isValid = false;
			}
			return isValid;
		}, 
		/**
		 * <h4>Summary:</h4>
		 *  Validates the data entered as the Execution/Issue Date.
		 * <h4>Description:</h4> 
		 * This method checks for the following scenarios .
		 * The Execution Date must be greater than or equal to the Application Date.
		 * Shows an error message in case if not valid.
		 *  @method validateExecDate
		 *  @return {boolean}
		 *   True if date is valid otherwise false
		 */
		validateExecDate : function() {
			//  summary:
		    //       Validates the data entered as the Execution/Issue Date.
			//
			// TODO Check this against v3
			
			
			console.debug("[misys.validation.common] Validating Exec Date, Value", 
					this.get("value"));
			
			// Test that the execution date is greater than or equal to the
			// application date
			var applDate = dj.byId("appl_date");
			if(!m.compareDateFields(this, applDate)) {
				this.invalidMessage = m.getLocalization("executionDateLessThanAppDateError",
						[_localizeDisplayDate(this),
		                 _localizeDisplayDate(applDate)]);
				return false;
			}

			return true;
		}, 
		/**
		 * <h4>Summary:</h4>
		 * This function validates the issue date 
		 * <h4>Description:</h4> 
		 * This will check for the following scenarios  
		 * </br>The Issue Date must be greater than or equal to the Application Date.
		 * </br>The Issue Date must be less than or equal to the Maturity Date.
		 * </br>The Issue Date must be less than or equal to the Expiry Date.
		 * </br>The Issue Date must be less than or equal to the Valid From Date.
		 * </br>The Issue Date must be less than or equal to the Latest Payment Date.
		 * @method validateIssueDate
		 * @return {booelan}
		 *  True if date is valid otherwise false
		 */
		validateIssueDate : function() {
			//  summary:
		    //       Validates the issue date.

			if(!this.get("value")){
				return true;
			}
			
			console.debug("[misys.validation.common] Validating Issue Date, Value", 
					this.get("value"));
			
			// Test that the issue date is greater than the application date
			var productCode = dj.byId("product_code");
			if(productCode && productCode.get("value") !== "SR" && productCode.get("value") !== "BR" && productCode.get("value") !== "EL" && productCode.get("value") !== "LS") 
			{

				var applDate = dj.byId("appl_date");
				if(!m.compareDateFields(applDate, this)) {
					this.invalidMessage = m.getLocalization("issueDateLessThanAppDateError",
							[_localizeDisplayDate(this),
							 _localizeDisplayDate(applDate)]);
					return false;
				}
			}
			if(dj.byId("tenor_maturity_date") && dj.byId("tenor_maturity_date").get("value") != null){
				var tenorDate = dj.byId("tenor_maturity_date");
				if(!m.compareDateFields(this, tenorDate)) {
					this.invalidMessage = m.getLocalization("IssueDateGreaterThanMaturityDateError", [
									_localizeDisplayDate(this),
									_localizeDisplayDate(tenorDate)]);
					return false;
				}
				}
			if(dj.byId("exp_date") && dj.byId("exp_date").get("value") != null){
			var expDate = dj.byId("exp_date");
			if(!m.compareDateFields(this, expDate)) {
				this.invalidMessage = m.getLocalization("issueDateGreaterThanExpiryDateError",
						[_localizeDisplayDate(this),
			             _localizeDisplayDate(expDate)]);
				return false;
			}
			}
			if(dj.byId("product_code") && dj.byId("product_code").get("value")==="LS"){
				
				var bankDate=dj.byId("bankDate") && dj.byId("bankDate").get("value") != null?dj.byId("bankDate").get("value") : "";
				var days = validateBusinessDate(this);
				if(days > 0)
				{
					this.invalidMessage = m.getLocalization("issueDateGreaterThanCurrentDateError",[
				                                               						         _localizeDisplayDate(this)
					                                               								]);
					return false;
				}
				if(dj.byId("reg_date")) 
				{
					var regDate = dj.byId("reg_date");
					if(!m.compareDateFields(regDate, this)) {
						this.invalidMessage = m.getLocalization("issDateLessThanRegDateError",
								[_localizeDisplayDate(this),
								 _localizeDisplayDate(regDate)]);
						return false;
					}
				}
				}
			if(dj.byId("valid_from_date") && dj.byId("valid_from_date").get("value")!=null){
				var validFromDate = dj.byId("valid_from_date");
				if(!m.compareDateFields(this, validFromDate)) {
					this.invalidMessage = m.getLocalization("issueDateGreaterThanValidFromDateError",
							[_localizeDisplayDate(this),
				             _localizeDisplayDate(validFromDate)]);
					return false;
				}
				}
			if(dj.byId("valid_to_date") && dj.byId("valid_to_date").get("value")!=null){
				var validToDate = dj.byId("valid_to_date");
				if(!m.compareDateFields(this, validToDate)) {
					this.invalidMessage = m.getLocalization("issueDateGreaterThanValidToDateError",
							[_localizeDisplayDate(this),
				             _localizeDisplayDate(validToDate)]);
					return false;
				}
				}
			if(dj.byId("latest_payment_date") && dj.byId("latest_payment_date").get("value")!=null){
				var latestPaymentDate = dj.byId("latest_payment_date");
				if(!m.compareDateFields(this, latestPaymentDate)) {
					this.invalidMessage = m.getLocalization("issueDateGreaterThanLatestPaymentDateError",
							[_localizeDisplayDate(this),
				             _localizeDisplayDate(latestPaymentDate)]);
					return false;
				}
				}
			 if((dj.byId("tnxtype") && (dj.byId("tnxtype").get("value") !== "38")) || 
				    	(dj.byId("close_tnx") && (dj.byId("close_tnx").get("checked") === false)))
			 {
				if(dj.byId("product_code") && (dj.byId("product_code").get("value")==="IO" || dj.byId("product_code").get("value") === "EA")){
					var lastMatchDate = dj.byId("last_match_date");
					if((lastMatchDate && lastMatchDate.get("value") != null) && (!m.compareDateFields(this, lastMatchDate)))
							{
							this.invalidMessage = m.getLocalization("issueDateLessThanLastMatchDateError",
									[_localizeDisplayDate(this),
						             _localizeDisplayDate(lastMatchDate)]);
							return false;						
						}					
				}
			 }
			return true;
		},
		
		validateEffectiveIssueDate :function(){
			if(!this.get("value")){
				return true;
			}
			if(dj.byId("exp_date") && dj.byId("exp_date").get("value") != null){
				var expDate = dj.byId("exp_date");
				if(!m.compareDateFields(this, expDate)) {
					this.invalidMessage = m.getLocalization("effectiveDateGreaterThanExpiryDateError",
							[_localizeDisplayDate(this),
				             _localizeDisplayDate(expDate)]);
					return false;
				}
			}
			var applDate = dj.byId("appl_date");
			if(applDate && applDate.get("value") != null){
			if(!m.compareDateFields(applDate,this)) {
				this.invalidMessage = m.getLocalization("AppDateMoreThanEffectiveDateError",
						[_localizeDisplayDate(this),
			             _localizeDisplayDate(applDate)]);
				return false;
			}}
			return true;
		},
		validatePaymentDueDate : function() {
			
			if(!this.get("value")){
				return true;
			}
			
			console.debug("[misys.validation.common] Validating Payment Due Date, Value", 
					this.get("value"));
			
			var applDate = dj.byId("appl_date");
			if(!m.compareDateFields(applDate, this)) {
				this.invalidMessage = m.getLocalization("paymentDueDateDateLessThanAppDateError",
						[_localizeDisplayDate(this),
						 _localizeDisplayDate(applDate)]);
				return false;
			}
			return true;
		},
		/**
		 * <h4>Summary:</h4>
		 * This function validates the issue date for Products initiated from middle office(SR,BR).
		 * @method validateMOProdIssueDate
		 */
		validateMOProdIssueDate : function() {
			//  summary:
		    //       Validates the issue date for Products initiated from middle office(SR,BR).

			if(!this.get("value")){
				return true;
			}
			
			console.debug("[misys.validation.common] Validate Issue Date, Value", 
					this.get("value"));
			
			// Test that the issue date is before or equal to the application date
			var applDate = dj.byId("appl_date");
			if(!m.compareDateFields(this, applDate)) {
				this.invalidMessage = m.getLocalization("issueDateMoreThanAppDateError",
						[_localizeDisplayDate(this),
			             _localizeDisplayDate(applDate)]);
				return false;
			}
			if(dj.byId("tenor_maturity_date") && dj.byId("tenor_maturity_date").get("value")!=null){
				var tenorDate = dj.byId("tenor_maturity_date");
				if(!m.compareDateFields(this, tenorDate)) {
					this.invalidMessage = m.getLocalization("IssueDateGreaterThanMaturityDateError", [
									_localizeDisplayDate(this),
									_localizeDisplayDate(tenorDate)]);
					return false;
				}
				}
			if(dj.byId("exp_date") && dj.byId("exp_date").get("value")!= null){
			var expDate = dj.byId("exp_date");
			if(!m.compareDateFields(this, expDate)) {
				this.invalidMessage = m.getLocalization("issueDateGreaterThanExpiryDateError",
						[_localizeDisplayDate(this),
			             _localizeDisplayDate(expDate)]);
				return false;
			}
			}
			return true;
		},
		/**
		 * <h4>Summary:</h4>
		 * This function validates the issue date for Products initiated from middle office(EL).
		 * @method validateMOProdIssueDate
		 */
		validateMOProdELIssueDate : function() {
			//  summary:
		    //       Validates the issue date for Products initiated from middle office(EL).

			if(!this.get("value")){
				return true;
			}
			
			console.debug("[misys.validation.common] Validating EL Issue Date, Value", 
					this.get("value"));

			if(dj.byId("tenor_maturity_date") && dj.byId("tenor_maturity_date").get("value")!=null){
				var tenorDate = dj.byId("tenor_maturity_date");
				if(!m.compareDateFields(this, tenorDate)) {
					this.invalidMessage = m.getLocalization("IssueDateGreaterThanMaturityDateError", [
									_localizeDisplayDate(this),
									_localizeDisplayDate(tenorDate)]);
					return false;
				}
				}
			if(dj.byId("exp_date") && dj.byId("exp_date").get("value")!= null){
			var expDate = dj.byId("exp_date");
			if(!m.compareDateFields(this, expDate)) {
				this.invalidMessage = m.getLocalization("issueDateGreaterThanExpiryDateError",
						[_localizeDisplayDate(this),
			             _localizeDisplayDate(expDate)]);
				return false;
			}
			}
			return true;
		},
		/**
		 * <h4>Summary:</h4> This function validates the maturity date
		 * @method validateMaturityDate
		 */
		validateMaturityDate : function() {
			

			if(!this.get("value")){
				return true;
			}
			
			console.debug("[misys.validation.common] Validating Maturtiy Date, Value", 
					this.get("value"));
			
			var applDate = dj.byId("appl_date");
			if(!m.compareDateFields(applDate, this)) {
				this.invalidMessage = m.getLocalization("maturityDateLessThanAppDateError",
						[_localizeDisplayDate(this),
			             _localizeDisplayDate(applDate)]);
				return false;
			}
			if(dj.byId("iss_date") && dj.byId("iss_date").get("value")!= null){
			var issDate = dj.byId("iss_date");
			if(!m.compareDateFields(issDate, this)) {
				this.invalidMessage = m.getLocalization("maturityDateLessThanIssueDateError", [
								_localizeDisplayDate(this),
								_localizeDisplayDate(issDate)]);
				return false;
			}
			}
			
			return true;
			
		},
		/**
		 * <h4>Summary:</h4> This function validates the issue date at middle-office 
		 * And, shows ERROR message iff respective dates are not within the range.
		 * @method validateIssueDateInMO
		 */
		validateIssueDateInMO : function() {
		
			var issDate = dj.byId("iss_date");
			var applDate = dj.byId("appl_date");
			if(issDate && issDate.get('value') && applDate && applDate.get('value') && !m.compareDateFields(applDate, issDate))
			{
				var callback = function() {
					var widget = dijit.byId("iss_date");
					widget.focus();
					widget.set("state","Error");
				};
				m.dialog.show("ERROR", m.getLocalization("issueDateLessThanAppDateError",[ issDate.get("displayedValue"), applDate.get("displayedValue") ]), '', function(){
					setTimeout(callback, 100);
				});
				return false;
			}
		},
		/**
		 * <h4>Summary:</h4> This function validates the maturity date at middle-office 
		 * And, shows ERROR message iff respective dates are not within the range.
		 * @method validateMaturityDateInMO
		 */
		validateMaturityDateInMO : function() {
		
			var maturityDate = dj.byId("maturity_date");
			var issDate = dj.byId("iss_date");
			if(maturityDate && maturityDate.get('value'))
			{
				console.log("maturity_date:"+maturityDate.get("value")+"\n issue_date:"+issDate.get('value'));
				if(issDate && issDate.get('value') && !m.compareDateFields(issDate, maturityDate)) 
				{
					var callback1 = function() {
						var widget = dijit.byId("maturity_date");
						widget.focus();
						widget.set("state","Error");
					};
					m.dialog.show("ERROR", m.getLocalization("maturityDateLessThanIssueDateError",[ maturityDate.get("displayedValue"), issDate.get("displayedValue") ]), '', function(){
						setTimeout(callback1, 100);
					});
					return false;
				}
			}
			return true;
		},
		/**
		 * <h4>Summary:</h4>
		 * This function validate the latest answer date.
		 * @method validateLatestAnswerDate
		 */
		validateLatestAnswerDate : function() {
			//  summary:
		    //       Validates the latest answer date

			// For non-required empty values, just return true
			if(!this.get("value")){
				return true;
			}
			
			console.debug("[misys.validation.common] Validating Last Answer Date, Value", 
					this.get("value"));

			// Test that the last answer date is greater than the issue date
			var issDate = dj.byId("iss_date");
			if(!m.compareDateFields(issDate, this)) {
				this.invalidMessage = m.getLocalization("lastAnwerDateLessThanIssDateError",
						[_localizeDisplayDate(this),
			             _localizeDisplayDate(issDate)]);
				return false;
			}
			// Test that the last answer date is less than the expiry date
			var expDate = dj.byId("exp_date");
			if(!m.compareDateFields(this, expDate)) {
				this.invalidMessage = m.getLocalization("lastAnswerDateGreaterThanExpDateError",
						[_localizeDisplayDate(this),
			             _localizeDisplayDate(expDate)]);
				return false;
			}

			return true;
		},
		/**
		 * <h4>Summary:</h4>
		 * This function validate the LC Available Amt.
		 * @method validateLcAvailableAmt
		 */
		validateLCAvailableAmt : function() {
			//  summary:
		    //       Validates the LC Available Amt
			var callback ;
			console.debug("[misys.validation.common] Validating LC Available Amt for EL, Value", 
					this.get("value"));	
			if(dj.byId("lc_available_amt").get("value") > 0){
			if(dj.byId("lc_amt") && dj.byId("lc_available_amt") && dj.byId("prod_stat_code") && dj.byId("prod_stat_code").get('value')=="03" && (dj.byId("lc_amt").get("value") != dj.byId("lc_available_amt").get("value")))
			{
				callback = function() {
					var widget = dijit.byId("lc_available_amt");
					widget.focus();
				 	widget.set("state","Error");
				};
				m.dialog.show("ERROR", m.getLocalization("AvailLCAmtNotEqualToTranAmt"), '', function(){
						setTimeout(callback, 500);
					});
			}
			else if(dj.byId("lc_amt") && dj.byId("lc_available_amt") && (dj.byId("lc_amt").get("value") < dj.byId("lc_available_amt").get("value")))
			{
				callback = function() {
					var widget = dijit.byId("lc_available_amt");
					widget.focus();
				 	widget.set("state","Error");
				};
				m.dialog.show("ERROR", m.getLocalization("AvailLCamtcanNotMoreThanTranAmt"), '', function(){
						setTimeout(callback, 500);
					});
			}
			}
		},
		
		/**
		 * <h4>Summary:</h4>
		 * This function validate the LC Liab Amt.
		 * @method validateLCLiabAmt
		 */
		validateLCLiabAmt : function() {
			//  summary:
		    //       Validates the LC Liab Amt
			var callback ;
			console.debug("[misys.validation.common] Validating LC Liab Amt for EL, Value", 
					this.get("value"));	
			if(dj.byId("lc_liab_amt").get("value") > 0){
			if (dj.byId("lc_amt") && dj.byId("prod_stat_code") && dj.byId("prod_stat_code").get("value") === '03' &&
					(dj.byId("lc_amt").get("value") > dj.byId("lc_liab_amt").get("value")))
			{
				callback = function() {
						var widget = dijit.byId("lc_liab_amt");
						widget.focus();
					 	widget.set("state","Error");
					};
					m.dialog.show("ERROR", m.getLocalization("LiabLCAmtcanNotLessThanTranAmt"), '', function(){
							setTimeout(callback, 500);
						});
			}
			/*else if(dj.byId("lc_amt") && (dj.byId("lc_amt").get("value") < dj.byId("lc_liab_amt").get("value")))
			{
				callback = function() {
						var widget = dijit.byId("lc_liab_amt");
						widget.focus();
					 	widget.set("state","Error");
					};
					m.dialog.show("ERROR", m.getLocalization("LiabLCAmtcanNotMoreThanTranAmt"), '', function(){
							setTimeout(callback, 500);
						});
			}*/
			}
		},
		/**
		 * <h4>Summary:</h4>
		 *   Validates the Maturity Date (Finance request only)
		 *  @method validateTFMaturityDate
		 */
		validateTFMaturityDate : function() {
			//  summary:
		    //       Validates the Maturity Date (TF only)

			console.debug("[misys.validation.common] Validating TF Maturity Date, Value = ", 
					this.get("value"));
			
			// Test that the maturity date is greater than or equal to the
			// application date
			var applDate = dj.byId("appl_date");
			if(!m.compareDateFields(applDate, this)) {
				this.invalidMessage = m.getLocalization("maturityDateLessThanAppDateError", [
								_localizeDisplayDate(this),
								_localizeDisplayDate(applDate)]);
				return false;
			}
			
			// Test that the maturity date is greater than or equal to the issue
			// date
			var issDate = dj.byId("iss_date");
			if(!m.compareDateFields(issDate, this)) {
				this.invalidMessage = m.getLocalization("issueDateGreaterThanMaturityError", [
								_localizeDisplayDate(issDate),
								_localizeDisplayDate(this)]);
				return false;
			}

			return true;
		},
		
		// TODO Refactor
		// TODO Remove passing of product code
						/**
						 * <h4>Summary:</h4> This function validates the amendment
						 * amount. <h4>Description:</h4>  Format the eventual
						 * increase/decrease of amount, set the transaction
						 * amount and compute the new LC amount.
						 */
		validateAmendAmount : function( /*Boolean*/ isFocused,
										/*dijit._Widget || DomNode || String*/ node, 
										/*String*/ productCode) {
			//  summary:
		    //       Validates the amendment amount.
			//  description:
			//        Format the eventual increase/decrease of amount, set the transaction amount
		    //        and compute the new LC amount.
			
			var widget = dj.byId(node);
			widget.invalidMessage = widget.messages.invalidMessage;
			if(!widget.validator(widget.textbox.value, widget.constraints)){
				return false;
			}
			if(widget && widget.get("value") < 0) {
				return false;
				}
			// Validate only when the field is onfocussed or focussed but in error
			var isValid = (widget.state === "Error") ? false : true;
			if(false === isFocused || (true === isFocused && !isValid)){
				console.debug("[misys.validation.common] Validating Amendment Amount, Value = ", 
						widget.get("value"));
				
				isValid = true;
				var fieldId = widget.id;
				var orgAmtVal = d.number.parse(dj.byId("org_" + productCode + "_amt").get("value"));
				
				if(fieldId === "inc_amt") {
					var incValue = widget.get("value");
					if((!isNaN(incValue)) && ((incValue + orgAmtVal) > Number.MAX_VALUE))
					{
							widget.invalidMessage = m.getLocalization("maximumValueError");
							isValid = false;
					}
				}
				else if(fieldId === "dec_amt") {
					var decValue = widget.get("value");
					if((!isNaN(decValue)) && ((orgAmtVal - decValue) < 0))
					{
							widget.invalidMessage = 
								m.getLocalization("amendAmountLessThanOriginalError");
							isValid = false;
					}
					
				}
			}
			
			return isValid;
		}, 
		/**
		 * <h4>Summary:</h4>
		 *  Validates the transfer amount. Must be applied to an input field of
		 *   dojoType misys.form.CurrencyTextBox.
		 *   @method validateTransferAmount
		 */
		validateTransferAmount : function(){
			//  summary:
		    //       Validates the transfer amount. Must be applied to an input field of 
			//       dojoType misys.form.CurrencyTextBox.
			
			var value = this.get("value"),
				orgValue = d.number.parse(dj.byId("org_lc_amt").get("value"));
			
			console.debug("[misys.validation.common] Validating Transfer Amount, Value = ", 
					value);			

			if(value && orgValue && orgValue < value){
				this.invalidMessage = m.getLocalization("transferAmtGreaterThanLCAmtError");
				return false;
			}
		
			return true;
		},
		/**
		 * <h4>Summary:</h4>
		 * This function validates the data entered as the start Date.
		 * @method validateStartDate
		 */
		validateStartDate : function() {
				//  summary:
			    //        Validates the data entered as the start Date.
			    // 
			    
			   // This validation is for non-required fields
				if(!this.get("value")) {
					return true;
				}
				
				console.debug("[misys.validation.common] Validating Start Date. Value = ",
						this.get("value"));

				// Test that the start date is greater than or equal to
				// the application date
				var applDate = dj.byId("appl_date");
				if(!m.compareDateFields(applDate, this)) {
					this.invalidMessage = m.getLocalization("startDateLessThanAppDateError", [
									_localizeDisplayDate(this),
									_localizeDisplayDate(applDate)]);
					return false;
				}
				
				// Test that the start date is smaller than or equal to
				// the end date
				var endDate = dj.byId("end_date");
				if(!m.compareDateFields(this, endDate)) {
					this.invalidMessage = m.getLocalization("startDateGreaterThanEndDateError", [
									_localizeDisplayDate(this),
									_localizeDisplayDate(endDate)]);
					return false;
				}
				
				// Validates if the start date is smaller than registered end date.
				// returns true if the start date is smaller than registered end date.
				var registeredEndDate = dj.byId("registered_end_date");
				if(!m.compareDateFields(this, registeredEndDate)) {
					this.invalidMessage = m.getLocalization("startDateGreaterThanRegisteredEndDateError", [
									_localizeDisplayDate(this),
									_localizeDisplayDate(registeredEndDate)]);
					return false;
				}						
				return true;
			},	
			/**
			 * <h4>Summary:</h4>
			 * This function validates the data entered as the end date
			 * @method validateEndDate
			 */
		validateEndDate : function() {
				//  summary:
			    //        Validates the data entered as the end Date.
			    // 
			
				// This validation is for non-required fields
				if(!this.get("value")) {
					return true;
				}
				
				console.debug("[misys.validation.common] Validating End Date. Value = ",
						this.get("value"));
				
				var startDate = dj.byId("start_date");
				if(!m.compareDateFields(startDate, this)) {
						this.invalidMessage = m.getLocalization("endDateLessThanStartDateError", [
										_localizeDisplayDate(this),
										_localizeDisplayDate(startDate)]);
						return false;
				}

				// Validates if the end date is smaller than registered end date.
				// returns true if the end date is smaller than registered end date.
				var registeredEndDate = dj.byId("registered_end_date");
				if(!m.compareDateFields(this, registeredEndDate)) {
					this.invalidMessage = m.getLocalization("endDateGreaterThanRegisteredEndDateError", [
									_localizeDisplayDate(this),
									_localizeDisplayDate(registeredEndDate)]);
					return false;
				}				
								
				return true;
			},
			
			/**
			 * <h4>Summary:</h4>
			 * This function validates the data entered for the News Start Date.
			 * 
			 * @method validateNewsStartDate
			 */
			validateNewsStartDate : function()
			{
				// This validation is for non-required fields
				if (!this.get("value"))
				{
					return true;
				}

				console.debug("[misys.validation.common] Validating News Start Date. Value = ",
						this.get("value"));

				// Test that the start date is earlier than or equal to	the end date
				var startDate = dj.byId("start_display_date");
				var endDate = dj.byId("end_display_date");
				if (!m.compareDateFields(this, endDate))
				{
					this.invalidMessage = m.getLocalization(
							"newsStartDateGreaterThanEndDateError", [
									_localizeDisplayDate(this),
									_localizeDisplayDate(endDate) ]);
					return false;
				}
				var currentDate,
			 	isValid;
			 	if ((startDate) && (startDate.get("value") !== ""))
			 	{
			 		currentDate = new Date();
					// set the hours to 0 to compare the date values
					currentDate.setHours(0, 0, 0, 0);
					// get the localized value in standard format.
					console.debug(currntDatevalue,
							currentDate);	
					// compare the values of the current date and transfer date
					isValid = d.date.compare(m.localizeDate(startDate), currentDate) < 0 ? false : true;
					if(!isValid)
					{
						startDate.state = "Error"; 
						startDate.set("focusonerror", true);
						startDate.invalidMessage = m.getLocalization("startDateGreaterThanCurrentDateError", [_localizeDisplayDate(startDate)]);
						startDate._setStateClass();
						dj.setWaiState(startDate.focusNode, "invalid", "true");
						return false;
					}
				 }
				return true;
			},
			/**
			 * <h4>Summary:</h4>
			 * This function validates the data entered as the news End Date.
			 * 
			 * @method validateNewsEndDate
			 */
			validateNewsEndDate : function()
			{
				// This validation is for non-required fields
				if (!this.get("value"))
				{
					return true;
				}

				console.debug("[misys.validation.common] Validating News End Date. Value = ",
						this.get("value"));

				// Test that the News End date is later than or equal to the News Start date
				var startDate = dj.byId("start_display_date");
				var endDate = dj.byId("end_display_date");
				if (!m.compareDateFields(startDate, this))
				{
					this.invalidMessage = m.getLocalization("newsEndDateLesserThanStartDateError",
							[ _localizeDisplayDate(this), _localizeDisplayDate(startDate) ]);
					return false;
				}
				var currentDate,
			 	isValid;
			 	if((endDate) && (endDate.get("value") !== ""))
			 	{
			 		currentDate = new Date();
					// set the hours to 0 to compare the date values
					currentDate.setHours(0, 0, 0, 0);
					// get the localized value in standard format.
					console.debug(currntDatevalue,
							currentDate);	
					// compare the values of the current date and end date
					isValid = d.date.compare(m.localizeDate(endDate), currentDate) < 0 ? false : true;
					if(!isValid)
					{
						endDate.state = "Error"; 
						endDate.set("focusonerror", true);
						endDate.invalidMessage = m.getLocalization("endDateGreaterThanCurrentDateError", [_localizeDisplayDate(endDate)]);
						endDate._setStateClass();
						dj.setWaiState(endDate.focusNode, "invalid", "true");
						return false;
					}
				 }
				return true;
			},
			/**
			 * <h4>Summary:</h4>
			 * This fucntion validates the data entered as the transfer date
			 * <h4>Description:</h4> 
			 *Transfer date sholud not be lesser than application date.
			 *Transfer date should not be greater than the end date.
			 *Transfer date shoul not be less than current date
			 *@method validateTransferDateCustomer
			 */
	 validateTransferDateCustomer : function() {
			//  summary:
		    //        Validates the data entered as the transfer Date.
		    // 
		    // TODO Add business logic explanation here
			// This validation is for non-required fields

			 var currentDate,
			    isValid;
			if(!this.get("value")) {
				return true;
			}
			console.debug("[misys.validation.common] Validating Transfer Date. Value = ",
					this.get("value"));
			var customer_bank = "";
			if(dj.byId("customer_bank"))
			{
				customer_bank = dj.byId("customer_bank").get("value"); 
			}
			if(customer_bank === "")
			{
				customer_bank = dj.byId("issuing_bank_abbv_name").get("value"); 
			}
			// Test that the expiry date is greater than or equal to
			// the application date
			var applDate = dj.byId("appl_date");
			if(!m.compareDateFields(applDate, this)) {
				this.invalidMessage = m.getLocalization("transferDateLessThanAppDateError", [
								_localizeDisplayDate(this),
								_localizeDisplayDate(applDate)]);
				return false;
			}
			// Bill Payment specific: Validates if the transfer date is smaller than registered end date.
			// returns true if the transfer date is smaller than registered end date.
			if(dj.byId("sub_product_code").get("value") === "BILLP" || dj.byId("sub_product_code").get("value") === "BILLS") {
				var registeredEndDate = dj.byId("registered_end_date");
				if(!m.compareDateFields(this, registeredEndDate)) {
					this.invalidMessage = m.getLocalization("transferDateGreaterThanRegisteredEndDateError", [
									_localizeDisplayDate(this),
									_localizeDisplayDate(registeredEndDate)]);
					return false;
				}				
			}
			// validate for current date
			// For Customer End, transfer date should not be less than the current date
			// validate only at customer side
			if(this.get("value") !== "")
			{
				console.debug("[misys.validation.common] Begin Validating Transfer Date with current date. Value = ",
						this.get("value"));
				var yearServer = parseInt(misys._config.businessDateForBank[customer_bank][0].value.substring(0,4), 10);
				var monthServer = parseInt(misys._config.businessDateForBank[customer_bank][0].value.substring(5,7), 10);
				var dateServer = parseInt(misys._config.businessDateForBank[customer_bank][0].value.substring(8,10), 10);
				currentDate = new  Date(yearServer, monthServer - 1, dateServer);
				// set the hours to 0 to compare the date values
				currentDate.setHours(0, 0, 0, 0);
				// get the localized value in standard format.
				console.debug(currntDatevalue,
						currentDate);	
				// compare the values of the current date and transfer date
				isValid = d.date.compare(m.localizeDate(this), currentDate) < 0 ? false : true;
				if(!isValid)
				{
					 this.invalidMessage = m.getLocalization("transferDateGreaterThanCurrentDateError", [_localizeDisplayDate(this)]);
					 return false;
				}
				console.debug("[misys.validation.common] End Validating Transfer Date with current date. Value = ",
						this.get("value"));
			}
			return true;
		},	
		/**
		 * <h4>Summary:</h4>
		 * This function validates transfer date with the current date
		 * @param {widget} transferDate
		 * @method validateTransferDateWithCurrentDate
		 */
	 validateTransferDateWithCurrentDate : function(/**widget**/transferDate){
			 var currentDate,
			 isValid;
			if((transferDate) && (transferDate.get("value") !== ""))
			{
					console.debug("[misys.validation.common] Begin Validating Transfer Date with current date. Value = ",
							transferDate.get("value"));	
					currentDate = new Date();
					// set the hours to 0 to compare the date values
					currentDate.setHours(0, 0, 0, 0);
					// get the localized value in standard format.
					console.debug(currntDatevalue,
							currentDate);	
					// compare the values of the current date and transfer date
					isValid = d.date.compare(m.localizeDate(transferDate), currentDate) < 0 ? false : true;
					if(!isValid)
					{
						transferDate.state = "Error"; 
						transferDate.set("focusonerror", true);
						transferDate.invalidMessage = m.getLocalization("transferDateGreaterThanCurrentDateError", [_localizeDisplayDate(transferDate)]);
						transferDate._setStateClass();
						dj.setWaiState(transferDate.focusNode, "invalid", "true");
						return false;
					}
					console.debug("[misys.validation.common] End Validating Transfer Date with current date. Value = ",
							transferDate.get("value"));					
			}
			return true;
		},
		/**
		 * <h4>Summary:</h4>
		 * This fuction validates the data entered as the transer date
		 * @method validateTransferDate
		 */
		validateTransferDate : function() {
			//  summary:
		    //        Validates the data entered as the transfer Date.
		    // 
		    // TODO Add business logic explanation here
			// This validation is for non-required fields
			if(!this.get("value")) {
				return true;
			}

			console.debug("[misys.validation.common] Validating Transfer Date. Value = ",
					this.get("value"));
			
			// Test that the expiry date is greater than or equal to
			// the application date
			var applDate = dj.byId("appl_date");
			if(!m.compareDateFields(applDate, this)) {
				this.invalidMessage = m.getLocalization("transferDateLessThanAppDateError", [
								_localizeDisplayDate(this),
								_localizeDisplayDate(applDate)]);
				return false;
			}
			// Bill Payment specific: Validates if the transfer date is smaller than registered end date.
			// returns true if the transfer date is smaller than registered end date.
			if(dj.byId("sub_product_code").get("value") === "BILLP" ||dj.byId("sub_product_code").get("value") === "BILLS") {
				var registeredEndDate = dj.byId("registered_end_date");
				if(!m.compareDateFields(this, registeredEndDate)) {
					this.invalidMessage = m.getLocalization("transferDateGreaterThanRegisteredEndDateError", [
									_localizeDisplayDate(this),
									_localizeDisplayDate(registeredEndDate)]);
					return false;
				}				
			}
			return true;
		},
		/**
		 * <h4>Summary:</h4>
		 * This function validates the data entered as the transfer expiry date.
		 * @method validateTransferExpiryDate
		 */
		validateTransferExpiryDate : function(){
			//  summary:
		    //        Validates the data entered as the transfer expiry date.
			
			// Return true for empty values
			if(!this.get("value")){
				return true;
			}

			console.debug("[misys.validate.common] Validating Transfer expiry date. Value", 
							this.get("value"));
			
			// Test that the transfer expiry date is smaller than the LC issue date
			var issueDate = dj.byId("iss_date");
			if(!m.compareDateFields(issueDate, this)) {
				//this is smaller, issueDate is greater
				this.invalidMessage = m.getLocalization(
						"transferExpiryDateLessThanIssueDateError",
						[_localizeDisplayDate(this), _localizeDisplayDate(issueDate)]);
				return false;		
			}
			
			// Test that the transfer expiry date is greater than the LC expiry date
			var expDate = dj.byId("exp_date");
			if(!m.compareDateFields(this, expDate)) {
				//this is greater, expDate is smaller
				this.invalidMessage = m.getLocalization(
						"transferExpiryDateGreaterThanExpiryDateError",
						[_localizeDisplayDate(this), _localizeDisplayDate(expDate)]);
				return false;	
				
			}
			
			return true;
		},
		/**
		 * <h4>Summary:</h4>
		 * This function validates  the data entered as the transfer last shipment date.
		 * @method validateTransferLastShipmentDate
		 */
		validateTransferLastShipmentDate : function(){
			//  summary:
		    //        Validates the data entered as the transfer last shipment date.
			
			if(!this.get("value")){
				return true;
			}

			console.debug("[misys.validate.common] Validating Transfer Last Shipment date. Value",
								this.get("value"));
			
			// Test that the last shipment date is greater than or equal to
			// the application date
//			var applDate = dj.byId("iss_date");
//			if(!m.compareDateFields(applDate, this)) {
//				this.invalidMessage = m.getLocalization("lastShipmentDateLessThanAppDateError", [
//								_localizeDisplayDate(this),
//								_localizeDisplayDate(applDate)]);
//				return false;
//			}
			
			var trfExpDate = dj.byId("transfer_expiry_date");
			
			if(!m.compareDateFields(this, trfExpDate)) {
				this.invalidMessage = m.getLocalization(
						"transferLastShipmentDateLessThanTransferExpiryDateError",
						[_localizeDisplayDate(this),_localizeDisplayDate(trfExpDate)]);
				return false;	
				
			}
			
			return true;
		},
		
		/**
		 * <h4>Summary:</h4>
		 * This function validates the data entered as the Value date and Application date.
		 * @method validateValueApplicationDate
		 */
		validateValueApplicationDate : function(){
				//  summary:
			    //        Validates the data entered as the value and Application date.
			console.debug("[misys.validation.common] Start Validating Value Date with Application date.");
				var valueDate = this;
				if(valueDate && !valueDate.get("value")){
					return true;
				}
				var applDate = dj.byId("appl_date");
				// compare the values of the Value date and Application date
				var isValid = d.date.compare(m.localizeDate(valueDate), m.localizeDate(applDate)) < 0 ? false : true;
				if(!isValid)
				{
					valueDate.state = "Error"; 
					valueDate.set("focusonerror", true);
					valueDate.invalidMessage = m.getLocalization("valueDateIsLessThanApplDateError",
													[_localizeDisplayDate(valueDate),
													_localizeDisplayDate(applDate)]);
					valueDate._setStateClass();
					dj.setWaiState(valueDate.focusNode, "invalid", "true");
					return false;
				}
				console.debug("[misys.validation.common] End Validating Value Date with Application date. Value = ",
						valueDate.get("value"));					
				
				return true;
			},		
		/**
		 * <h4>Summary:</h4>
		 * this funtion validates the data entered as the Transfer presentation period or Insurance coverage percentage.
		 * @method validateTransferNumbers
		 */
		validateTransferNumbers : function(){
			//  summary:
		    //        Validates the data entered as the Transfer presentation period or Insurance coverage percentage.
			
			// Return true for empty values
			if(!this.get("value")){
				return true;
			}

			console.debug("[misys.validate.common] Validating", this.get("name"), 
								". Value", this.get("value"));
			
			
			if(this.get("value") < 0 || this.get("value") > 999) {
				this.invalidMessage = m.getLocalization("invalidTransferNumbers");
				return false;	
				
			}
			
			return true;
		},
		/**
		 * <h4>Summary:</h4>
		 * This function validates the data entered as the Transfer presentation period or Insurance coverage percentage.
		 * @method validateBlankEndorsedPercentage
		 */
		validateBlankEndorsedPercentage : function(){
			//  summary:
		    //        Validates the data entered as the Transfer presentation period or Insurance coverage percentage.
			
			// Return true for empty values
			if(!this.get("value")){
				return true;
			}

			console.debug("[misys.validate.common] Validating", this.get("name"), 
								". Value", this.get("value"));
			
			
			if(this.get("value") < 110 || this.get("value") > 999) {
				this.invalidMessage = m.getLocalization("invalidBlankEndorsedPercentage");
				return false;	
				
			}
			
			return true;
		},
		/**
		 * <h4>Summary:</h4>
		 * This function validates the amendment date
		 * <h4>Description:</h4> 
		 * Amendment date should be greater than the current date
		 * Amend date sholud be less than the shipment date
		 * @method validateAmendmentDate
		 */
		validateAmendmentDate : function() {
			//  summary:
		    //       Validates the amendment date.
			//Test that the amendment date is greater than or equal to the system's date.
			console.debug("[misys.validation.common] Validating Amendment Date, Value = ", 
					this.get("value"));
		    var amendDate = this.get("value");

	    if(!m._config.isBank || (m._config.isBank && dj.byId("prod_stat_code") && (dj.byId("prod_stat_code").get("value") === '03' || dj.byId("prod_stat_code").get("value") === '08')))
		  {

			if(amendDate != null)
			{
				
				var days = validateBusinessDate(this);
				if(days < 0)
				{
					 this.invalidMessage = m.getLocalization("amdDateSmallerThanCurrentDate", [_localizeDisplayDate(this)]);
					 return false;
				}
				
				
				//Test if amendment date is before the shipment date.
				
				//	Removed test for amendment date and shipment date as per suggestion by BA MPS-54646
			}
			
			//Test if amendment date is less than expiry date.
			if(dj.byId("amd_date") && dj.byId("amd_date").get("value") != null && dj.byId("exp_date") && dj.byId("exp_date").get("value") != null)
			{
				var amdDate = dj.byId("amd_date");
				var expdate = dj.byId("exp_date");
				console.debug("[misys.validation.common] Amendment Date Value = ",
						amdDate.get("value"));
				var isValid = d.date.compare(m.localizeDate(amdDate), m.localizeDate(expdate)) >= 0 ? false : true;
				if(!isValid)
				{
					 this.invalidMessage = m.getLocalization("amdDateGreaterThanExpiryDate", [_localizeDisplayDate(amdDate), _localizeDisplayDate(expdate)]);
					 return false;
				}
			}
		}

			return true;
		}, 
		
		/**
		 * <h4>Summary:</h4>
		 * This function validates the amendment date
		 * <h4>Description:</h4> 
		 * Amendment date should be greater than the current date
		 * Amend date sholud be less than the shipment date
		 * @method validateBGAmendmentDate
		 */
		validateBGAmendmentDate : function() {
			//  summary:
		    //       Validates the amendment date.
			//Test that the amendment date is greater than or equal to the system's date.
			console.debug("[misys.validation.common] Validating Amendment Date, Value = ", 
					this.get("value"));
		    var amendDate = this.get("value");
			var currentDate = new Date();
			var that = this;
			// set the hours to 0 to compare the date values
			currentDate.setHours(0, 0, 0, 0);
			// get the localized value in standard format.
			console.debug(currntDatevalue,
							currentDate);	
			if(amendDate != null)
			{
				var days = validateBusinessDate(this);
				if(days < 0)
				{
					this.invalidMessage = m.getLocalization("amdDateSmallerThanCurrentDate", [_localizeDisplayDate(this)]);
					return false;
				}	
			}
			
			//Test if amendment date is less than expiry date.
			if(dj.byId("amd_date") && dj.byId("amd_date").get("value") != null && dj.byId("exp_date") && dj.byId("exp_date").get("value") != null)
			{
				var amdDate = dj.byId("amd_date");
				var expdate = dj.byId("exp_date");
				console.debug("[misys.validation.common] Amendment Date Value = ",
						amdDate.get("value"));
				var isValid = d.date.compare(m.localizeDate(amdDate), m.localizeDate(expdate)) >= 0 ? false : true;
				if(!isValid)
				{
					this.invalidMessage =m.getLocalization("amdDateGreaterThanExpiryDate", [_localizeDisplayDate(amdDate), _localizeDisplayDate(expdate)]);
					return false;
				}
			}
			return true;
		}, 
		/**
		 * <h4>Summary:</h4>
		 *  Validates the data entered as the Expiry Date (bank side).
		 *  @method validateBankExpiryDate
		 */
		validateBankExpiryDate : function() {
			//  summary:
		    //       Validates the data entered as the Expiry Date (bank side).

			// This test is for non-required fields
			if(!this.get("value")){
				return true;
			}

			console.debug("[misys.validation.common] Validating Bank Expiry Date, Value =", 
					this.get("value"));
			
			var applDate = dj.byId("appl_date");
			if(!m.compareDateFields(applDate, this)) {
				this.invalidMessage = m.getLocalization("expiryDateLessThanAppDateError", [
								_localizeDisplayDate(this),
								_localizeDisplayDate(applDate)]);
				return false;
			}
			
			var issDate = dj.byId("iss_date");
			if(!m.compareDateFields(issDate, this)) {
				this.invalidMessage = m.getLocalization("expiryDateLessThanIssueDateError", [
								_localizeDisplayDate(this),
								_localizeDisplayDate(issDate)]);
				return false;
			}
			
			
			var orgDate = dj.byId("org_previous_exp_date");
			if(!m.compareDateFields(orgDate, this)) {
				this.invalidMessage = m.getLocalization("orgExpDateGreaterThanExpiryDateError", [
								_localizeDisplayDate(this),
								_localizeDisplayDate(orgDate)]);
				return false;
			}

			var lastShipDate = dj.byId("last_ship_date");
			if(!m.compareDateFields(lastShipDate, this)) {
				this.invalidMessage = m.getLocalization("expiryDateLessThanLastShipmentError", [
								_localizeDisplayDate(this),
								_localizeDisplayDate(lastShipDate)]);
				return false;
			}
			
			var nextRevolveDate = dj.byId("next_revolve_date");
			if(nextRevolveDate && !m.compareDateFields(nextRevolveDate, this)) 
			{
				this.invalidMessage = m.getLocalization("expDateLessThanNextRevolveDateError", [
									_localizeDisplayDate(nextRevolveDate),
									_localizeDisplayDate(this)]);
				return false;
			}
			if((!m._config.isBank && (null == dj.byId("prod_stat_code") || null!=dj.byId("prod_stat_code") && dj.byId("prod_stat_code").get("value") != "10")) || (m._config.isBank && null!=dj.byId("prod_stat_code") && dj.byId("prod_stat_code") && dj.byId("prod_stat_code").get("value") === '03' || dj.byId("prod_stat_code").get("value") === '08'))
			{
				if(dj.byId("product_code") && (dj.byId("product_code").get("value")==="BG" || dj.byId("product_code").get("value")==="LC" || dj.byId("product_code").get("value")==="EL" || dj.byId("product_code").get("value")==="SI"))
				{
					// Test that the expiry date is greater than or equal to the Business date

				var days = validateBusinessDate(this);
					if(days < 0)
					{
					console.debug(ExpDateCurrntDate, days);
						this.invalidMessage = m.getLocalization("expiryDateSmallerThanSystemDate",[
						                                               						         _localizeDisplayDate(this)
						                                               								]);
						return false;
					}		
				}
			}
			
			return true;
		}, 
			/**
			 * <h4>Summary:</h4>
			 * Validates that only one of the fields has been populated.
			 * @method validateLink 
			 */
		validateLink : function() {
			//  summary:
		    //       Validates that only one of the fields has been populated.
			
			console.debug("[misys.validation.common] Validating Link, Value =", this.get("value"));
			
			if(dj.byId("link").get("value") !== "" &&
					dj.byId("file_name").get("value") !== ""){
				this.invalidMessage = m.getLocalization("tooManyNewsLinksError");
				return false;
			}
			
			return true;
		}, 
		/**
		 * <h4>Summary:</h4>
		 *   Validates the BIC code.
		 *   @method validateBICFormat 
		 */
		validateBICFormat : function() {
			//  summary:
		    //       Validates the BIC code.
			var bic = this.get("value"),
			regex = new RegExp(dj.byId("swiftBicCodeRegexValue") ? dj.byId("swiftBicCodeRegexValue").get("value") : "");
		
			if(!dj.byId("swiftBicCodeRegexValue")){
				console.debug("[misys.validation.common] Validating BIC Format, swiftBicCodeRegexValue not available on the screen");
				this.invalidMessage = m.getLocalization("invalidBICError", [ bic ]);
				return false;
			}
			if(bic) {
				console.debug("[misys.validation.common] Validating BIC Format, Value", bic);
				if(!regex.test(bic)){
					this.invalidMessage = m.getLocalization("invalidBICError", [ bic ]);
					return false;
				}
			}

			return true;
		},
		
		/**
		 * <h4>Summary:</h4>
		 *   Validates Liquidity branch reference selected
			 and shows error if it's already in use.
		 *   @method validateLiquidityBranchReference 
		 */
		validateLiquidityBranchReference : function() {
			// summary:
			// Validates Liquidity branch reference selected
			// and shows error if it's already in use.
			var LBORef = dj.byId("liquidity_branch_reference");
			if(LBORef && LBORef.get('value') !== ''){
				var LBOReferences = misys._config.liquidityBranchReferences;
				for(var itr = 0; itr < LBOReferences.length; itr++){
					if(misys._config.liqBranchRef === LBORef.get('value')){
						return true;
					}
					else if(LBORef.get('value') === LBOReferences[itr].fi_code && LBOReferences[itr].in_use === 'Y'){
						this.invalidMessage = m.getLocalization("invalidLBORefError");
						return false;
					}
				}
			}
			return true;
		},		

		/**
		 * <h4>Summary:</h4>
			 *   Checks for uniqueness of the email
			 *   @method checkEmailExistence 
			 */
			checkEmailExistence : function() {
			
			var thisField = dj.byId("email");
			var login = dj.byId("login_id");
			var company = dj.byId("company_abbv_name");
			var field = dijit.byId("email");
			var org_email = dj.byId("org_email") ? dj.byId("org_email").get("value"): "" ;
			var user_id = dj.byId("user_id") ? dj.byId("user_id").get("value"): "" ;
			var emailValue = thisField ? thisField.get("value"):"";
			var loginValue = login ? login.get("value"):"";
			var companyValue = company ? company.get("value"):"";
			var fieldStateValid =  (field && (field.get("state") === "Error" || field.get("state") === "Incomplete" || field.readOnly || field.disabled)) ? false: true;
			if(emailValue)
			{
				m.xhrPost({
					url : m.getServletURL("/screen/AjaxScreen/action/CheckEmailUniquenessAction"),
					handleAs : "json",
					sync : true,
					content : {
						emailInContext : emailValue,
						loginInContext : loginValue,
						companyInContext : companyValue,
						orgEmail : org_email,
						userID : user_id
					},
					load : function(response){
						var displayMessage = "";
						if(response.items.isEmailUnique === false && fieldStateValid)
						{
							fieldStateValid = false;
							displayMessage = m.getLocalization("emailIdExists", [ emailValue ]);
							
							m.dialog.show("CUSTOM-NO-CANCEL", displayMessage, "Email Error", function(){
								field.focus();
								field.set("state", "Error");
								dj.hideTooltip(thisField.domNode);
								dj.showTooltip(displayMessage, thisField.domNode, 0);
							});
							setTimeout(function(){
								dj.hideTooltip(thisField.domNode);
								}, 5000);
							
						}
						else
							{
								fieldStateValid = true;
								field.set("state","");
							}
					}
				});
			}
			
			else
				{
					fieldStateValid = true;
				}
				
			return fieldStateValid;
		},

		/**
		 * <h4>Summary:</h4>
		 *   Checks for the existence of the BIC code in the system.
		 *   @method checkBICExistence 
		 */
		checkBICExistence : function() {
			
			//var thisField = this.id?dijit.byId(this.id):dijit.byId(fieldId);
			var thisField = dijit.byId(this.id);
			var validBICValue = thisField ? thisField.get("value"):"";
			var fieldStateValid =  (thisField && (thisField.get("state") === "Error" || thisField.get("state") === "Incomplete" || thisField.readOnly || thisField.disabled)) ? false: true;
			//Call validation only if BIC format is valid and is not one of the above conditions.
			if(validBICValue && fieldStateValid)
			{
				var prodCode = dijit.byId("product_code")? dijit.byId("product_code").get("value"): "";
				
				m.xhrPost({
					url : m.getServletURL("/screen/AjaxScreen/action/CheckSwiftBICAction"),
					handleAs : "json",
					sync : true,
					content : {
						productCode : prodCode,
						bicInContext : validBICValue
					},
					load : function(response){
						var displayMessage = "";
						if(!response.items.bankDataExists)
						{
							fieldStateValid = true;
							displayMessage = m.getLocalization("nonExistentBICWarning", [ validBICValue ]);
							
							m.dialog.show(custmNoCancel, displayMessage, "BIC Error", function(){
								dj.hideTooltip(thisField.domNode);
								dj.showTooltip(displayMessage, thisField.domNode, 0);
							});
							setTimeout(function(){
								dj.hideTooltip(thisField.domNode);
								}, 5000);
							
						}
						else if(!response.items.isValidBic)
						{
							fieldStateValid = false;
							displayMessage = m.getLocalization("nonExistentBICError", [ validBICValue ]);

							m.dialog.show(custmNoCancel, displayMessage, "BIC Error", function(){
								thisField.focus();
								thisField.set("state","Error");
								dj.hideTooltip(thisField.domNode);
								dj.showTooltip(displayMessage,thisField.domNode, 0);
							});
							setTimeout(function(){
								dj.hideTooltip(thisField.domNode);
								}, 5000);
						}
					}
				});
			}
			
			return fieldStateValid;
		},
		
		/**
		 * <h4>Summary:</h4>
		 *   Checks for the existence of the BIC code in the system.
		 *   @method checkBICExistenceForWidgets 
		 */
		checkBICExistenceForWidgets : function() {
						
			var thisField = dijit.byId(this.id);
			var validBICValue = thisField ? thisField.get("value"):"";
			var fieldStateValid =  (thisField && (thisField.get("state") === "Error" || thisField.get("state") === "Incomplete" || thisField.readOnly || thisField.disabled)) ? false: true;
			
			//Call validation only if BIC format is valid and is not one of the above conditions.
			if(validBICValue && fieldStateValid)
			{
				var prodCode = dijit.byId("product_code")? dijit.byId("product_code").get("value"): "";
				
				m.xhrPost({
					url : m.getServletURL("/screen/AjaxScreen/action/CheckSwiftBICAction"),
					handleAs : "json",
					sync : true,
					content : {
						productCode : prodCode,
						bicInContext : validBICValue
					},
					load : function(response){
						var displayMessage = "";
						if(!response.items.bankDataExists)
						{
							fieldStateValid = true;
							displayMessage = m.getLocalization("nonExistentBICWarning", [ validBICValue ]);
							
							m.dialog.show(custmNoCancel, displayMessage, "BIC Error", function(){
								dj.hideTooltip(thisField.domNode);
								dj.showTooltip(displayMessage, thisField.domNode, 0);
							});
							setTimeout(function(){
								dj.hideTooltip(thisField.domNode);
								}, 5000);
							
						}
						else if(!response.items.isValidBic)
						{
							fieldStateValid = false;
							displayMessage = m.getLocalization("nonExistentBICError", [ validBICValue ]);

							m.dialog.show(custmNoCancel, displayMessage, "BIC Error", function(){
								thisField.set("value", "");
								thisField.focus();
								thisField.set("state","Error");
								dj.hideTooltip(thisField.domNode);
								dj.showTooltip(displayMessage,thisField.domNode, 0);
							});
							setTimeout(function(){
								dj.hideTooltip(thisField.domNode);
								}, 5000);
						}
					}
				});
			}
			
			return fieldStateValid;
		},
		
		/**
		 * <h4>Summary:</h4>
		 * Validates the BEI format
		 * @method validateBEIFormat
		 */
		validateBEIFormat : function() {
			//  summary:
		    //       Validates the BEI code.

			// Not required, so return
			var swiftRegex= "^[A-Z0-9]{4,4}[A-Z]{2,2}[A-Z0-9][A-Z2-9]([A-Z0-9]{3,3}){0,1}$";
			var bei = this.get("value"),
				regex = (dj.byId("swiftBicCodeRegexValue") && dj.byId("swiftBicCodeRegexValue").get("value") && dj.byId("swiftBicCodeRegexValue").get("value")!== "") ?  new RegExp(dj.byId("swiftBicCodeRegexValue").get("value"),"g") : new RegExp(swiftRegex,"g");
			if(bei) {
				console.debug("[misys.validation.common] Validating BEI Format, Value", bei);
				if(!regex.test(bei)) {
					this.invalidMessage = m.getLocalization("invalidBEIError", [ bei ]);
					return false;
				}
			}

			return true;
		},
		
		/**
		 * <h4>Summary:</h4>
		 * Validates the SGI
		 * @method validateSGI
		 */
		validateSGI : function() {
			var reg = misys._config.sgiValidationRegex;
			var sgi = this.get("value"),
				regex = new RegExp(reg, "g");
			if(reg !== undefined && reg !== null){
				var allowedChars = reg.substring(reg.indexOf("["), reg.indexOf("]") + 1);
				var allowedLength = reg.substring(reg.indexOf("{"), reg.indexOf("}")).split(',')[1];
				if(sgi) {
					if(!regex.test(sgi)) {
						this.invalidMessage = m.getLocalization("sgiBbanValidationError", [allowedChars, allowedLength]);
						return false;
					}
				}	
			}	
			return true;
		},
		
		/**
		 * <h4>Summary:</h4>
		 * Validates the BBAN
		 * @method validateBBAN
		 */
		validateBBAN : function() {
			var reg = misys._config.bbanValidationRegex;
			var bban = this.get("value"),
				regex = new RegExp(reg);
			if(reg !== undefined && reg !== null){
				var allowedChars = reg.substring(reg.indexOf("["), reg.indexOf("]") + 1);
				var allowedLength = reg.substring(reg.indexOf("{"), reg.indexOf("}")).split(',')[1];
				if(bban) {
					if(!regex.test(bban)) {
						this.invalidMessage = m.getLocalization("sgiBbanValidationError", [allowedChars, allowedLength]);
						return false;
					}
				}
			}
			return true;
		},
	  /**
	   * <h4>Summary:</h4>
	   * Validates that no invalid characters are present.
	   * @method validateCharacters
	   */
		validateCharacters : function() {
			//  summary:
		    //       Validates that no invalid characters are present.
				
			console.debug(validateAbbNameFormat, 
					this.get("value"));

			var strValidCharacters = 
				" 0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ/-?.,+_";
			var character;
			var isValid = d.every(this.get("value"), function(theChar){
				character = theChar;
				return (strValidCharacters.indexOf(theChar) < 0) ? false : true;
			});
			
			if(!isValid) {
				this.invalidMessage = m.getLocalization("illegalCharError", [ character ]);
			}

			return isValid;
		},
	  /**
	   * <h4>Summary:</h4>
	   * Validates that no invalid characters are present in role creation.
	   * @method validateCharacters
	   */
		validateCharsInRolesCreation : function() {
			//  summary:
			//       Validates that no invalid characters are present.
					
			console.debug(validateAbbNameFormat, 
						this.get("value"));

			var strValidCharacters = 
				"0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-()/'  ";
			var character;
			var isValid = d.every(this.get("value"), function(theChar){
				character = theChar;
				return (strValidCharacters.indexOf(theChar) < 0) ? false : true;
			});
				
			if(!isValid) {
				this.invalidMessage = m.getLocalization("illegalCharError", [ character ]);
			}

			return isValid;
		}, 
		/**
		 * <h4>Summary:</h4>
		 * Validates that no invalid SWIFT Address characters are present.
		 * @method validateSwiftAddressCharacters
		 */
		validateSwiftAddressCharacters : function() {
			//  summary:
		    //       Validates that no invalid SWIFT Address characters are present.
				
			console.debug("[misys.validation.common] Validating Swift Characters, Value =", 
					this.get("value"));
			
			
			var regexStr =dj.byId("swiftregexValue").get("value");
			var swiftchar = this.get("value"),
			swiftregexp = new RegExp(regexStr);
		
			var isValid=false;
			
			isValid=swiftregexp.test(swiftchar);
			
			if(!isValid) {
				this.invalidMessage = m.getLocalization("invalidSWIFTTransactionError");
			}

			return isValid;
		}, 
		/**
		 * <h4>Summary:</h4>
		 *  Validates that no invalid characters are present excluding space.
		 *  @method validateCharactersExcludeSpace
		 */				
		validateCharactersExcludeSpace : function() {
			//  summary:
		    //       Validates that no invalid characters are present.
				
			console.debug(validateAbbNameFormat, 
					this.get("value"));

			var strValidCharacters = 
				" 0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ/-?.,+_";
			var character;
			var isValid = d.every(this.get("value"), function(theChar){
				character = theChar;
				return (strValidCharacters.indexOf(theChar) < 0) ? false : true;
			});
			
			if(!isValid) {
				this.invalidMessage = m.getLocalization("illegalCharError", [ character ]);
			}

			return isValid;

		}, 
		
		/**
		 * <h4>Summary:</h4>
		 *  Validates specified char shoudn't be allowed.
		 *  @method validateBlackListChar
		 */				
		validateBlackListChar : function() {

			var regexStr = dijit.byId("blacklistspecialcharregexvalue").get("value");
			var blacklistspecialcharregexStr = new RegExp(regexStr);
			var isValid = blacklistspecialcharregexStr.test(this.get("value"));//.test(this.get("value"));
			if(isValid) {
				this.invalidMessage = m.getLocalization("blacklistCharError");
			}
			return isValid;
		},
		
		validateBlackListCharInDynamicRTE: function(field) {
			var fieldValue = field ? field.get('value') : "";
			var encodeValue = dojo.trim(dojox.html.entities.encode(fieldValue, dojox.html.entities.html));
			var regexStr = dijit.byId("blacklistspecialcharregexvalue").get("value");
			var blacklistspecialcharregexStr = new RegExp(regexStr);
			var isValid = blacklistspecialcharregexStr.test(encodeValue);
			if(isValid) {
				this.invalidMessage = m.getLocalization("blacklistCharError");
			}
			return isValid;
		},
				
		/**
		 * Summary;
		 * Validates single email address
		 * @method validateEmailAddr
		 */
		validateSingleEmailAddr : function() {
			//  summary:
		    //       Validates single email address

			// Not required, so return
			var fieldValue = this.get("value");
			var isValid = true;
			if(fieldValue === ""){
				return isValid;
			}

			console.debug("[misys.validation.common] Validating Single Email Addr, Value =", fieldValue);

			if(!dojox.validate.isEmailAddress(fieldValue)){
				isValid = false;
			}
			
			if(!isValid){
				this.invalidMessage = m.getLocalization("invalidEmailAddressError");
				return false;
			}
			return true;
		},

		
		/**
		 * Summary;
		 * Validates an email address
		 * @method validateEmailAddr
		 */
		validateEmailAddr : function() {
			//  summary:
		    //       Validates an email address

			// Not required, so return
			var fieldValue = this.get("value");
			if(fieldValue === ""){
				return true;
			}

			console.debug("[misys.validation.common] Validating Email Addr, Value =", fieldValue);

			var multiemail = fieldValue.split(";");
			var validemail = [];
			var j = 0;
			for( var i=(multiemail.length-1); i>=0; i--)
			{
				if(!dojox.validate.isEmailAddress(multiemail[i])){
					validemail[j] = multiemail[i];
					j++;
				}
		     }
			
			if(i>j){
				this.invalidMessage = m.getLocalization("invalidEmailAddressError");
				return false;
			}
			
			for( var k=(validemail.length-1); k>=0; k--)
			{
				if(!dojox.validate.isEmailAddress(validemail[k])){
					this.invalidMessage = m.getLocalization("invalidEmailAddressError");
					return false;
				}
				
			}
			
			return true;
		},
		
		validateNoOfEmails :  function(){
			
			var email_1 = dj.byId("notify_beneficiary_email").get("value");
			var res = email_1.split(";");
				
				if(res.length > 10){
					var errorMessage =  m.getLocalization("checkEmailId");
					dj.byId("notify_beneficiary_email").set("state","Error");
					dj.hideTooltip(dj.byId("notify_beneficiary_email").domNode);
					dj.showTooltip(errorMessage, dj.byId("notify_beneficiary_email").domNode, 0);
				}
			},
		/**
		 * <h4>Summary:</h4>
		 * Validates a web address.
		 */
		validateWebAddr : function() {
			//  summary:
		    //       Validates a web address.

			// Not required, so return
			var fieldValue = this.get("value");
			if(fieldValue === ""){
				return true;
			}
				
			console.debug("[misys.validation.common] Validating Web Addr, Value =", fieldValue);
			
			if(!dojox.validate.isUrl(fieldValue)){
				this.invalidMessage = m.getLocalization("invalidWebAddressError");
				return false;
			}

			return true;
		}, 
		/**
		 * Summary;
		 *  Validates a password.
		 *  @method validatePassword
		 */
		validatePassword : function() {
			//  summary:
		    //       Validates a password.


			// Uncomment the following to have the password length checked
			// First Implementation: between 4 to 10 characters
			/*
			 * if((4>theObj.value.length) || (10<theObj.value.length)){
			 * fncShowError(34, "4", "10"); theObj.focus(); return false; }
			 */

			// Second implementation : minimum 6 chars
			/*
			 * if(6>theObj.value.length){ fncShowError(35, "6"); theObj.focus();
			 * return false; }
			 */

			//
			// Uncomment the following to check there is at least one digit and one
			// letter character
			/*
			 * strDigitCharacters = "0123456789"; strLetterCharacters =
			 * "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"; boolDigitFound =
			 * false; boolLetterFound = false; for(var i = 0; i < theObj.value.length; i++){
			 * if(strDigitCharacters.indexOf(theObj.value.charAt(i)) > -1){
			 * boolDigitFound = true; } if
			 * (strLetterCharacters.indexOf(theObj.value.charAt(i)) > -1){
			 * boolLetterFound = true; } } if(!(boolDigitFound && boolLetterFound)){
			 * fncShowError(35, "6"); theObj.focus(); return false; }
			 */

			return true;
		}, 
		/**
		 * <h4>Summary:</h4>
		 *  Validates a monthly date value
		 *  @method validateMonthly
		 */
		validateMonthly: function() {
			//  summary:
		    //       Validates a monthly date value

			console.debug("[misys.validation.common] Validating monthly date value");

			// check if monthly frequency is selected
			if(!dj.byId("frequency_2").get("checked")) {
				this.set("value", "");
		    }
		   
			var value = this.get("value");
		    if(value === "29" || value === "30" || value === "31") {
		    	this.invalidMessage = m.getLocalization("monthDayWarningMessage");
		    	return false;
		    }

		    return true;
		 }, 
		 /**
		  * <h4>Summary:</h4>
		  *  Validates that the format of the rate field is correct
		  *  <h4>Description:</h4> 
		  *  Basically checks for the number of digits before and after the comma.
		  *  @method validateRateFormat
		  */
		 validateRateFormat : function() {
		 	//  summary:
		     //       Validates that the format of the rate field is correct 
			 //       (number of digits before and after the comma).	

			var isValid = true;
		 	var rate = this.get("value");
		 	if(rate < 0 || rate === 0)
		 	{
		 		isValid = false;
		 		return isValid;
		 	}		 	
		 	var rateString = (rate + "");
		 	
		 	console.debug("[misys.validation.common] Validating  Rate Field, Value =", rate);
		 	
		 	var l_intCounterNumbersBeforeComma = 0;
		     var l_intCounterNumbersAfterComma = 0;
		     var foundNumbersBeforeComma = false;
		     var foundstrDecimalDelimiter = false;
		
		     // todo change to .every()
		 	d.forEach(rateString, function(theChar){
		       console.debug("[misys.validation.common] Character is", theChar);
		       
		       if (((theChar >= "0" || theChar <= "9") && 
		    		   theChar !== m.getLocalization("g_strDecimalDelimiter"))) {
		     	  if (!foundNumbersBeforeComma) {
		     		  l_intCounterNumbersBeforeComma= l_intCounterNumbersBeforeComma+1;
		     	  }
		     	  else {
		     		  l_intCounterNumbersAfterComma = l_intCounterNumbersAfterComma +1; 
		     	  }
		       }
		       else if (theChar === m.getLocalization("g_strDecimalDelimiter")) {
		     	  foundNumbersBeforeComma = true;
		     	  foundstrDecimalDelimiter = true;

		     	  if (l_intCounterNumbersBeforeComma > m.getLocalization("g_numbersBeforeComma"))
		     	  {
		     		  this.invalidMessage = 
		     			  m.getLocalization("rateMessageNumbersBeforeAndAfterComma",
		     					  [m.getLocalization("g_numbersBeforeComma"), 
		     					   m.getLocalization("g_numbersAfterComma") ]);
		     		  isValid = false;
		     	  }
		       }
		     });
		 	
		 	// check the rest of the rate
		     if (l_intCounterNumbersAfterComma > m.getLocalization("g_numbersAfterComma")) {
		     	this.invalidMessage = 
		     		m.getLocalization("rateMessageNumbersBeforeAndAfterComma", 
		     				[ m.getLocalization("g_numbersBeforeComma"), 
		     				  m.getLocalization("g_numbersAfterComma") ]);
		     	isValid = false;
		 	 }
			     var numberBeforeComma = m.getLocalization("g_numbersBeforeComma");
			     
			     var parsedNumberBeforeComma = parseInt(numberBeforeComma, 10);
			     //var x = round(m);
			     if(!foundstrDecimalDelimiter && rateString.length > parsedNumberBeforeComma) {
			     	this.invalidMessage = 
			     		m.getLocalization("rateMessageNumbersBeforeComma", 
			     				[m.getLocalization("g_numbersBeforeComma")]);
			     	isValid = false;
			     }
		 	return isValid;
		 }, 
		 
		 /**
		  * <h4>Summary:<h4> Validates the number entered in the widget
		  * misys.form.DateOrTermField.js. This function has to be hitch with
		  * the widget DateOrTermField before to be use.
		  * 
		  * @param {String} errorMessage  
		  * error message which will be displayed in 'this'
		  */
		 validateTermNumberField : function(/*String*/ errorMessage) {
				
			 // if this is not a DateTermField Widget
			if(!(/Date/.test(this.get("declaredClass")))){
				return false;
			}
			// Return true for empty values
			if(!this.isCorrectlyFilled()){
				return true;
			}
			
			if (!this.isValidNumber()) {
				this.get("_numberField").invalidMessage = m.getLocalization(errorMessage);
				return false;
			}
			
			return true;
		 },
		 
		 // TODO Refactor, this shouldn"t receive parameters
		 /**
			 * <h4>Summary:</h4> Validates the date entered in the widget
			 * misys.form.DateTermField.js. This function has to be hitch with
			 * the widget DateTermField before to be use.
			 * 
			 * @param {Boolean} isFocused
			 * @param {String} comparedWidgetId  
			 * id of the misys.form.DateTermField widget with which 'this' will be compared
			 * @param {String} errorMessage  
			 *  error message which will be displayed in 'this'
			 * @param {Boolean} smaller  
			 *  true if the comparison is 'smaller than'
			 * @param {date} startdate
			 * @method 
			 */
		 validateDateTermField : function( /*Boolean*/ isFocused,
				 						   /*String*/ comparedWidgetId,
				 						   /*String*/ errorMessage,
				 						   /*Boolean*/ smaller,
				 						   /*Date*/ startdate) {
				// summary:
			    //		Validates the date entered in the widget misys.form.DateTermField.js.
				//		This function has to be hitch with the widget DateTermField before to be use.
				//		Four validations are possible :
				//		_ compared to date of day (greater or smaller).
				//		_ compared to another misys.form.DateTermField widget (greater or smaller).
				//
				//		NOTE: This function have to be in the scope of widget which is validate.
				//
				//      comparedWidgetId
				//		 id of the misys.form.DateTermField widget with which 'this' will be 
			    //       compared
				//
				//      errorMessage
				//		 error message which will be displayed in 'this'
				//
				//      smaller
				//		 true if the comparison is 'smaller than' 
				
				// if this is not a DateTermField Widget
				if(!(/Date/.test(this.get("declaredClass")))){
					return false;
				}
				
				this.get("_calendarWidget").invalidMessage = 
					this.get("_calendarWidget").messages.invalidMessage;
				if(!this.get("_calendarWidget").validator(this.get("_calendarWidget").textbox.value, 
						this.get("_calendarWidget").constraints)){
					return false;
				}
				
				// Return true for empty values
				if(!this.isCorrectlyFilled()){
					return true;
				}
				var isValid = true;
				if (!smaller){
					smaller = false;
				}
				
				// retrive the first date 
				var firstDate;
				if (this.isValidDate()) {
					firstDate = this.getFormalValueDate();
					if (!firstDate){
						return true;
					}
				}
				else {
					firstDate = _normalizeDate(this.get("id"));
					if (firstDate < 0){
						return true;
					}
				}
				// if firstDate is null, return true ?
				if (!firstDate){
					return true;
				}
				
				// retrieve the second date
				var secondDate;
				var compareWidget = dj.byId(comparedWidgetId);
				if (!comparedWidgetId) {
					// date of the day
					secondDate = new Date();
				}
				else
				{
					//second date is date field 
					if (!(/Date/.test(compareWidget.get("declaredClass")))){
						
						secondDate = m.localizeDate(compareWidget);
						if (!secondDate){
							return true;
						}
					} else {
						if (compareWidget.isValidDate()) {
							secondDate = compareWidget.getFormalValueDate();
							if (!secondDate){
								return true;
							}
						}
				
						else{
							if (startdate) {
								secondDate = _normalizeDate(comparedWidgetId, firstDate);								
							}
							else {
								secondDate = _normalizeDate(comparedWidgetId);								
							}
							
							if (secondDate < 0){
								return true;
							}	
						}
					}
				}
				// set hour, minutes ... to 0 for comparison
				firstDate.setHours(0);
				firstDate.setMinutes(0);
				firstDate.setSeconds(0);
				firstDate.setMilliseconds(0);
				if(secondDate !== undefined){
				secondDate.setHours(0);
				secondDate.setMinutes(0);
				secondDate.setSeconds(0);
				secondDate.setMilliseconds(0);
				}
				
				console.debug("[misys.validation.common] Validate date.");
				console.debug("[misys.validation.common] First date", firstDate);
				console.debug("[misys.validation.common] Second date", secondDate);
				// Test that the far date is greater than or equal to the earlier date
				if(smaller) {
					isValid = d.date.compare(firstDate, secondDate) <= 0 ? true : false;
				}
				else {
					isValid = d.date.compare(firstDate, secondDate) >= 0 ? true : false;
				}
				if (!isValid) {
					this.get("_calendarWidget").invalidMessage = m.getLocalization(errorMessage, 
							[d.date.locale.format(firstDate, {selector :"date"}),
							 d.date.locale.format(secondDate, {selector :"date"})]);
				}

				return isValid;
		}, 
		


						/**
						 * <h4>Summary:</h4> This function validates the order type
						 * <h4>Description:</h4>  Its displayed value should not be empty
						 * 
						 * @method validateOrderType
						 */
		validateOrderType : function() {
			// summary:
			//		TODO
			
			var orderCheckBox = dj.byId("order_list_by_default");
			if(orderCheckBox && orderCheckBox.get("checked")) {
				return this.get("displayedValue") !== '';
			}
			return true;
		},
						/**
						 * Summary; This function validates the axis value
						 * 
						 * @method validateAxisScale
						 */
		validateAxisScale: function() {
			// summary:
			//		TODO
			
			var axisXValue = dj.byId("chart_axis_x");
			if((axisXValue && axisXValue.get("value") && arrColumn) && (arrColumn[axisXValue][0] === "Date"))
			{
				// test the column type if is date we can validate.
					return this.get("displayedValue");
			}
			return true;
		},

		validateGroupingColumn: function() {
			// summary:
			//		TODO
			
			var orderCheckBox = dj.byId("grouping_enable");
			if(this.get('value')=='' && this.get('displayedValue')!=''){
				return false;
			}
			if(orderCheckBox && orderCheckBox.get("checked")) {
				return this.get("displayedValue") !== "";
			}
			return true;
		},
		/**
		 * <h4>Summary:</h4>
		 * Validate outstanding amount
		 * <h4>Description:</h4> 
		 * Checks for the following senerios
		 * The outstanding amount should be zero before the purge event can be processed.
		 * @method validateOutstandingAmount
		 * @return {boolean}
		 *  True if amount is valid otherwise false
		 * 
		 */
		validateOutstandingAmount : function() {
			// TODO This class is added via the appendClass attribute in XSL, but
			// originally on the row rather than the input, for a specific case in
			// the Summit code. This needs to be addressed.
			
			// TODO We should really just change the ID of the field (keeping the original
			// name). Check for dependencies elsewhere
			
			var fields = d.query(".outstanding");
			if(fields.length === 1) {
				var outstandingAmount = 
					dj.byId(d.attr(fields[0], "widgetid")).get("value") || 0;
				if (outstandingAmount > 0 && this.get("value") === "10") {
					this.invalidMessage = m.getLocalization("outstandingAmountShouldBeZero");
					return false;
				}
			}

			// TODO CF It is likely here where the standard validation should be invoked,
			// For DR to check as I don't know the purpose behind the original change
			
			return true;
		},
		validatecourierPartnerField : function() {
				var courierPartnerField = dj.byId("courier_partner");
				var courierPartnerWaybillNoField = dj.byId("courier_partner_waybill_no");
				if(courierPartnerField && courierPartnerWaybillNoField)
				{
				if(courierPartnerField.get("value") !== '')
				{
				 	 m.toggleRequired("courier_partner_waybill_no", true);	
				}
				else
			    {
					m.toggleRequired("courier_partner_waybill_no", false);
					
				 }
				}
		},
		/**
		 * <h4>Summary:</h4>
		 * This function validates the shipment date
		 * <h4>Description:</h4> 
		 *  Called as a pre-submit validation in LC-forms, to verify that one or other
		 *  of last_ship_date or narrative_shipment_period have a value 
		 *  User must have choose atleast latest shipment date or shipment period.
		 *  @method validateShipmentDates
		 *  @return {boolean}
		 *   True if date or period  is valid otherwise false
		 */
		validateShipmentDates : function() {
			//  summary:
		    //        Called as a pre-submit validation in LC-forms, to verify that one or other 
			//        of last_ship_date or narrative_shipment_period have a value
			
			var lastShipDate = dj.byId("last_ship_date"),
			    narrativeShipmentPeriod = dj.byId("narrative_shipment_period");
			if(lastShipDate && narrativeShipmentPeriod && !lastShipDate.get("value") &&
					narrativeShipmentPeriod.get("value") === ""){
				m._config.onSubmitErrorMsg = m.getLocalization("shipmentPeriodOrDateMissingError");
				return false;
			}
			
			return true;
		},
		/**
		 * <h4>Summary:</h4>
		 * This function validates holidaye abd cutoff time
		 * <h4>Description:</h4> 
		 * Called as a pre-submit validation in all forms, to verify for holidays and cutoff time
		 * @method validateHolidaysAndCutOffTime
		 * 
		 */
		validateHolidaysAndCutOffTime : function(/*String*/bankAbbvNameWidgetId,/*String*/subProductCodeWidgetId,/*String*/mode,
													/*Array of Date Names*/dateNames,/*Array of date widgetId's*/dateWidgetIds,/*String*/entityWidgetId,
													/*String*/currencyCodeWidgetId,/*String*/amountWidgetId){
				//  summary:
			    //        Called as a pre-submit validation in all forms, to verify for holidays and cutoff time
			
				var productCode = misys._config.productCode ? misys._config.productCode : "" ;
				var bankAbbvName = dj.byId(bankAbbvNameWidgetId) ? dj.byId(bankAbbvNameWidgetId).get("value") : "";
				var subProductCode = dj.byId(subProductCodeWidgetId) ? dj.byId(subProductCodeWidgetId).get("value") : ""; 
				//IAFT same n different currency check for holiday cutoff
				if(subProductCode === 'IAFT')
				{
					if(mode === "UNSIGNED")
					{
						if(dj.byId(currencyCodeWidgetId).get("value") === dj.byId("applicant_act_cur_code_unsigned").get("value"))
						{
							subProductCode = "IAFTS";
						}
						else
						{
							subProductCode = "IAFTD";
						}
					}
					else
					{
						if(dj.byId(currencyCodeWidgetId).get("value") === dj.byId("applicant_act_cur_code").get("value"))
						{
							subProductCode = "IAFTS";
						}
						else
						{
							subProductCode = "IAFTD";
						}
					}
				}
				
				var curCode = dj.byId(currencyCodeWidgetId) ? dj.byId(currencyCodeWidgetId).get("value") : ""; 
				var amount = dj.byId(amountWidgetId) ? dj.byId(amountWidgetId).get("value") : ""; 
				//Set flag to indicate Holiday Validation
				m._config = m._config || {};
				dojo.mixin(m._config,{holidayCutOffEnabled:true});
				
				//Get All date values from respective widgets
				var dateValueArray = new Array();
				var enityValue = dj.byId(entityWidgetId) ? dj.byId(entityWidgetId).get("value") : "" ;
				dojo.forEach(dateWidgetIds,function(node,index){
					var date = _formatHolidaysAndCutOffDate(dj.byId(node));
					dateValueArray.push(date);	
				});
				//m.dialog.hide();
				
				//referenceid and tnxid are not required in draft mode
				//AJAX call
				return  _validateHolidayAndCutOffTime(bankAbbvName,productCode,subProductCode,mode,dateNames,dateValueArray,enityValue,curCode,amount,null);
		},
		
		/**
		 * <h4>Summary:</h4>
		 * This function validates holiday and cutoff time for India Payment
		 * <h4>Description:</h4> 
		 * Called as a pre-submit validation in all forms, to verify for holidays and cutoff time with clearingCode
		 * @method validateHolidaysAndCutOffTimeForMUPS
		 * 
		 * 
		 * 
		 */
		validateHolidaysAndCutOffTimeForMUPS : function(/*String*/bankAbbvNameWidgetId,/*String*/subProductCodeWidgetId,/*String*/mode,
													/*Array of Date Names*/dateNames,/*Array of date widgetId's*/dateWidgetIds,/*String*/entityWidgetId,
													/*String*/currencyCodeWidgetId,/*String*/amountWidgetId,/*String*/clearingCodeWidgetId){
				//  summary:
			    //        Called as a pre-submit validation in all forms, to verify for holidays and cutoff time
			
				var productCode = misys._config.productCode ? misys._config.productCode : "" ;
				var bankAbbvName = dj.byId(bankAbbvNameWidgetId) ? dj.byId(bankAbbvNameWidgetId).get("value") : "";
				var subProductCode = dj.byId(subProductCodeWidgetId) ? dj.byId(subProductCodeWidgetId).get("value") : ""; 
				var clearingCode = dj.byId(clearingCodeWidgetId) ? dj.byId(clearingCodeWidgetId).get("value") : "";
				//IAFT same n different currency check for holiday cutoff
				if(subProductCode === 'IAFT')
				{
					if(mode === "UNSIGNED")
					{
						if(dj.byId(currencyCodeWidgetId).get("value") === dj.byId("applicant_act_cur_code_unsigned").get("value"))
						{
							subProductCode = "IAFTS";
						}
						else
						{
							subProductCode = "IAFTD";
						}
					}
					else
					{
						if(dj.byId(currencyCodeWidgetId).get("value") === dj.byId("applicant_act_cur_code").get("value"))
						{
							subProductCode = "IAFTS";
						}
						else
						{
							subProductCode = "IAFTD";
						}
					}
				}
				
				var curCode = dj.byId(currencyCodeWidgetId) ? dj.byId(currencyCodeWidgetId).get("value") : ""; 
				var amount = dj.byId(amountWidgetId) ? dj.byId(amountWidgetId).get("value") : ""; 
				//Set flag to indicate Holiday Validation
				m._config = m._config || {};
				dojo.mixin(m._config,{holidayCutOffEnabled:true});
				
				//Get All date values from respective widgets
				var dateValueArray = new Array();
				var enityValue = dj.byId(entityWidgetId) ? dj.byId(entityWidgetId).get("value") : "" ;
				dojo.forEach(dateWidgetIds,function(node,index){
					var date = _formatHolidaysAndCutOffDate(dj.byId(node));
					dateValueArray.push(date);	
				});
				//m.dialog.hide();
				
				//referenceid and tnxid are not required in draft mode
				//AJAX call
				return  _validateHolidayAndCutOffTime(bankAbbvName,productCode,subProductCode,mode,dateNames,dateValueArray,enityValue,curCode,amount,clearingCode);
		},
		
			/**
			 * <h4>Summary:</h4>
			 *  check the account status for cash FTs and bulk.
			 *  <h4>Description:</h4> 
			 *  it will check the from account status for particular transaction
			 *  Shows an error message in case if status is inactive.
			 *  @method checkAccountStatus
			 */
		checkAccountStatus : function(/*String*/accNo){

			var isAccountActive = true;
			m.xhrPost( {
				url : m.getServletURL("/screen/AjaxScreen/action/CheckAccountStatus"),
				handleAs 	: "json",
				sync 		: true,
				content : {
					accNo : accNo
				},
				load : function(response, args){
					isAccountActive = response.isAccountActive;
				},
				error : function(response, args){
					console.error("Checking Account status  error ", response);
				}
			});
			return isAccountActive;
		},
		
		/**
		 * <h4>Summary:</h4>
		 *  Validates that no invalid characters and spaces are present.
		 *  <h4>Description:</h4> 
		 *  It has a string of valid alphanumeric characters,passed value is tested against it.
		 *  Shows an error messgae in case if invalid charcters passed.
		 *  @method validateAlphaNumeric
		 */
		validateAlphaNumeric : function(){
				//  summary:
			    //       Validates that no invalid characters and spaces are present.
				
			var regexStr = dijit.byId("userNameRegexValue").get("value");
			var userNameRegexStr = new RegExp(regexStr);
			var isValid = userNameRegexStr.test(this.get("value"));
			if(!isValid) {
				this.invalidMessage = m.getLocalization("userIdillegalCharError");
			}

			return isValid;
		},
		/**
		 * <h4>Summary:</h4>
		 *  Validates that no invalid characters and spaces are present.
		 * It has a string of valid alphanumeric characters,passed value is tested against it.
		 *  Shows an error messgae in case if invalid charcters passed.
		 *  @method validateGroupId
		 */
			validateGroupId : function(){
				//  summary:
			    //       Validates that no invalid characters and spaces are present.
				
			var regexStr = dijit.byId("groupIdRegexValue").get("value");
			var groupIdRegexStr = new RegExp(regexStr);
			var isValid = groupIdRegexStr.test(this.get("value"));
			if(!isValid) {
				this.invalidMessage = m.getLocalization("userIdillegalCharError");
			}
	
			return isValid;
		},
		/**
		 * <h4>Summary:</h4>
		 *  Validates that no invalid characters and spaces are present.
		 * It has a string of valid alphanumeric characters,passed value is tested against it.
		 *  Shows an error messgae in case if invalid charcters passed.
		 *  @method validateGroupId
		 */
			validateGroupName : function(){
				//  summary:
			    //       Validates that no invalid characters and spaces are present.
				
			var regexStr = dijit.byId("groupNameRegexValue").get("value");
			var groupNameRegexStr = new RegExp(regexStr);
			var isValid = groupNameRegexStr.test(this.get("value"));
			if(!isValid) {
				this.invalidMessage = m.getLocalization("userIdillegalCharError");
			}
		
			return isValid;
		},
		/**
		 * <h4>Summary:</h4>
		 *  Validates that no invalid characters.
		 *  <h4>Description:</h4> 
		 *  It has a string of valid alphanumeric characters,passed value is tested against it.
		 *  Shows an error messgae in case if invalid charcters passed.
		 *  @method validateAlphaNumericRemarks
		 */
		validateAlphaNumericRemarks : function(){
			//	summary:
		    //		Function used to validate the remarks.
			console.debug("[Validate] Validating Remarks, Value = " + this.get('value'));
			if(!_validateChar(this, " 0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ")){
				var message = m.getLocalization("illegalRemarksCharError", [ this.get('value') ]);
				// TODO:This fix was introduced to replace < characters with &lt; as they were being replaced with a DIV's
				// in subsequent processing.
				// This cased the remarks tool top to only display as far as the first < character.
				// This fix should most likely be removed one a reason is determined for why in some
				// cases the < is interpreted as a div
				message = message.replace(/>/g, "&gt;");
				message = message.replace(/</g, "&lt;");
				this.invalidMessage= message;
				return false;
			}
			return true;
		},
		/**
		 * <h4>Summary:</h4>
		 * Validates that no invalid characters and spaces are present.
		 * Desciption:
		 * It has string of valid characters,passed value is tested against it.
		 * Checks for the following scenarios .
		 * Invalid character
		 * @method validateNumeric
		 */
		validateNumeric : function(){
			//  summary:
		    //       Validates that no invalid characters and spaces are present.
			
		var strValidCharacters = "0123456789";
		var character;
		var isValid = d.every(this.get("value"), function(theChar){
			character = theChar;
			return (strValidCharacters.indexOf(theChar) < 0) ? false : true;
		});
		
		if(!isValid) {
			this.invalidMessage = m.getLocalization("illegalCharError", [ character ]);
		}

		return isValid;
		},
/**
 * <h4>Summary:</h4>
 * This function is to validate Phone or Fax number
 * <h4>Description:</h4> 
 * It has string of valid characters .Fax number is tested against it.
 * Checks for the following scenarios 
 * Invalid position of character.
 * Invalid character.
 * @method validatePhoneOrFax
 */
		validatePhoneOrFax : function(){
			//  summary:
		    //       Validates phone and fax numbers.
			
			var strValidCharacters = "0123456789- ()";
			var character;
			var isValid = d.every(this.get("value"), function(theChar,index){
				if(index === 0 && theChar === "+")
				{
					return true;
				}
				else
				{
					character = theChar;
					return (strValidCharacters.indexOf(theChar) < 0) ? false : true;
				}
			});
			
			if(!isValid) {
				if(character === "+")
				{
					this.invalidMessage = m.getLocalization("invalidCharacterPosition",[ character ]);
				}
				else
				{
					this.invalidMessage = m.getLocalization("illegalCharErrorContact");
				}
			}
	
			return isValid;
		},
		/**
		 * <h4>Summary:</h4>
		 * This function is to validate  Fax number
		 * <h4>Description:</h4> 
		 * It has string of valid characters .Fax number is tested against it.
		 * Checks for the following scenarios 
		 * Invalid position of character.
		 * Invalid character.
		 * @method validateFax
		 */
				validateFax : function(){
					//  summary:
				    //       Validates phone and fax numbers.
					
					var strValidCharacters = "0123456789- ()";
					var character;
					var isValid = d.every(this.get("value"), function(theChar,index){
						if(index === 0 && theChar === "+")
						{
							return true;
						}
						else
						{
							character = theChar;
							return (strValidCharacters.indexOf(theChar) < 0) ? false : true;
						}
					});
					
					if(!isValid) {
						if(character === "+")
						{
							this.invalidMessage = m.getLocalization("invalidCharacterPosition",[ character ]);
						}
						else
						{
							this.invalidMessage = m.getLocalization("illegalCharErrorContactForFax");
						}
					}
			
					return isValid;
				},
				/**
		 * <h4>Summary:</h4>
		 *  Validates that no invalid characters.
		 *  <h4>Description:</h4> 
		 *  It has a string of valid alphanumeric characters,passed value is tested against it.
		 *  Shows an error messgae in case if invalid charcters passed.
		 *  @method validateTelex
		 */
			validateTelex : function(){
					//  summary:
				    //       Validates phone and fax numbers.
					
					var strValidCharacters = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ ";
					var character;
					var isValid = d.every(this.get("value"), function(theChar,index){
						
							return (strValidCharacters.indexOf(theChar) < 0) ? false : true;
					});
					
					if(!isValid)			
						{
							this.invalidMessage = m.getLocalization("illegalCharErrorContactForTelex");
						}
			
					return isValid;
				},
		/**
		 * Summary;
		 *  Validates the IP Invoice date
		 *  <h4>Description:</h4> 
		 *  It checks for the following scenarios 
		 *  The Invoice Date must be less than or equal to the Due Date.
		 *  @method validateIPInvoiceDate
		 *  @return {boolean}
		 *   True if date is valid otherwise false 
		 */
		validateIPInvoiceDate : function() {
			//  summary:
		    //       Validates the latest answer date

			// For non-required empty values, just return true
			if(!this.get("value")){
				return true;
			}
			
			console.debug("[misys.validation.common] Validating Invoice Date, Value", 
					this.get("value"));

			// Test that the issue date is less than the due date
			var dueDate = dj.byId("due_date");
			if(!m.compareDateFields(this, dueDate)) {
				this.invalidMessage = m.getLocalization("invoiceDateGreaterThanDueDateError",
						[_localizeDisplayDate(this),
			             _localizeDisplayDate(dueDate)]);
				return false;
			}
			return true;
		},
		/**
		 * <h4>Summary:</h4>
		 * This function validates the Invoice payable due date
		 * <h4>Description:</h4> 
		 * It checks for the following scenarios 
		 * The Due Date must be greater than or equal to the Application Date.
		 * The Due Date must be greater than or equal to the Invoice Date.
		 * @method validateIPDueDate
		 * @return {boolean}
		 *  True if date is valid otherwise false
		 */
		validateIPDueDate : function() {
			//  summary:
		    //       Validates the latest answer date

			// For non-required empty values, just return true
			if(!this.get("value")){
				return true;
			}
			
			console.debug("[misys.validation.common] Validating Invoice Due Date, Value", 
					this.get("value"));

			// Test that the due date is greater than the application date
			var applDate = dj.byId("appl_date");
			if(!m.compareDateFields(applDate, this)) {
				this.invalidMessage = m.getLocalization("dueDateLessThanAppDateError",
						[_localizeDisplayDate(this),
			             _localizeDisplayDate(applDate)]);
				return false;
			}
			// Test that the due date is greater than the issue date
			var issDate = dj.byId("iss_date");
			if(!m.compareDateFields(issDate, this)) {
				this.invalidMessage = m.getLocalization("dueDateLessThanInvoiceDateError",
						[_localizeDisplayDate(this),
			             _localizeDisplayDate(issDate)]);
				return false;
			}

			return true;
		},
		/**
		 * <h4>Summary:</h4>
		 *   Validates the data entered as the Remittance Date.
		 *   <h4>Description:</h4> 
		 *   Its checks for the following scenarios 
		 *   The Remittance Date should not be after the system date.",
		 *   @method validateRemittanceDate
		 *   @return {boolean}
		 *    True if date is valid otherwise false
		 */
	   validateRemittanceDate : function() {
			//  summary:
		    //        Validates the data entered as the Remittance Date.
		    // 
		   
			// This validation is for non-required fields
			if(!this.get("value")) {
				return true;
			}

			console.debug("[misys.validation.common] Validating Remittance Date. Value = ",
					this.get("value"));
			
			
			var remittanceDate = this.get("value");
			var days = validateBusinessDate(this);
			if(days > 0)
			{console.debug("[misys.validation.common] Days difference between remittance date and current date = ", days);
				this.invalidMessage = m.getLocalization("remittanceDateGreaterThanSystemDateError",
						[ _localizeDisplayDate(this) ]);
				return false;
			}
			
			return true;
		}, 

		clearPrincipalAndFeeAccount : function( )
		{
			if(dj.byId("principal_act_name"))
				{
					dj.byId("principal_act_name").set("value", "");
				}
			if(dj.byId("fee_act_name"))
			{
				dj.byId("fee_act_name").set("value", "");
			}
		},
		
		// validate transfer amount should be greater than zero
		/**
		 * <h4>Summary:</h4>
		 * This function validates amount field
		 * <h4>Description:</h4> 
		 * Amount shuould not be zero or negative show an error in both the cases
		 * @method validateAmount
		 * @return {boolean}
		 *  True if amount is correct otherwise false.
		 */
		validateAmount : function(amtId) {
				if(amtId)
				{
					var amt = amtId.get("value");
					var displayMessage,widget;
					if (amt === 0) {
						displayMessage = m.getLocalization("amountcannotzero");
						amtId.set("state","Error");
				 		dj.hideTooltip(amtId.domNode);
				 		dj.showTooltip(displayMessage, amtId.domNode, 0);
				 		amtId.focus();
						return false;
					} 
					else if ((amt < 0) || (amt === undefined)) {
						displayMessage = m.getLocalization("invalidMessage");
						amtId.set("state","Error");
				 		dj.hideTooltip(amtId.domNode);
				 		dj.showTooltip(displayMessage, amtId.domNode, 0);
				 		amtId.focus();
						return false;
					} 
					else
					{
						return true;
					}
			}
				return true;
			},
			
			/**
			 *<h4>Summary:</h4>
			 * Validates the data entered as the Final Expiry Date for rolling renewals of trade products.
			 * @method validateFinalExpiryDate
			 * @return {boolean}
			 *  True if date is valid otherwise false
			 */	
			validateFinalExpiryDate: function() {
				var isValidFinalExpiryDate = true;
				var expDateObj = dj.byId("exp_date").get("value");
				var finalExpiryDate = dj.byId("final_expiry_date").get("value");
				
				if(expDateObj == null || expDateObj == "") {
					isValidFinalExpiryDate = false;
					this.invalidMessage = m.getLocalization("expiryDateReqd");
				}
				else if(finalExpiryDate && finalExpiryDate != "")
				{
					if(finalExpiryDate<expDateObj)
					{
						dj.byId("final_expiry_date").set("value",null);
						isValidFinalExpiryDate = false;
						this.invalidMessage = m.getLocalization("finalExpDateLessThanTransactionExpDtError", [ dj.byId("final_expiry_date").get("displayedValue"), dj.byId("exp_date").get("displayedValue") ]);
					}
				}
			
				return isValidFinalExpiryDate;
			},
			
		/**
		 *<h4>Summary:</h4>
		 * Validates the data entered as the Final Expiry Date for rolling renewals of trade products.
		 * @method validateTradeFinalExpiryDate
		 * @return {boolean}
		 *  True if date is valid otherwise false
		 */	
		validateTradeFinalExpiryDate: function() {
			//  summary:
		    //        Validates the data entered as the Final Expiry Date for rolling renewals of trade products.
		    // 
			var isFinalExpDateValid = true;
			var isPreCondStsfd = true;
			//Since Final Expiry Date is not a mandatory field, it needs to be validated only if it is non-null
			if(this.get("value") != null) {
				// This validation is for non-required fields
				var finalExpDateObj = this.get("value");
				
				var renewalOn = dj.byId("renew_on_code").get("value");					//Whether the first renewal is on "Expiry('01')" or "Calendar Date('02')"
				var renewalCalDate = dj.byId("renewal_calendar_date").get("value");		//Date String if first renewal is on a "Calendar Date('02')"
				var renewalInterval = dj.byId("renew_for_nb").get("value");				//Interval between subsequent renewals (number) 
				var renewalIntervalUnit = dj.byId("renew_for_period").get("value");		//Unit of interval i.e., whether it is "Days"/"Weeks"/"Months"/"Years". 
				var rollingReneNbdays = dj.byId("rolling_renewal_nb").get("value");																		//This along with the interval forms the frequency of renewal.
																		//For ex. Once in 10(renewalInterval) months (renewalIntervalUnit)
				var numOfRenewals = dj.byId("rolling_renewal_nb").get("value");			//Number of renewals allowed
				//var rollingRenewalOn = dj.byId("rolling_renew_on_code").get("value");                      //Whether the rolling renewal is on "Expiry('01')" or "Every('03')"
	            //var rollingRenewalInterval = dj.byId("rolling_renew_for_nb").get("value");                   //Interval between subsequent rolling renewals (number) 
	            //var rollingRenewalIntervalUnit = dj.byId("rolling_renew_for_period").get("value");		//Unit of interval i.e., whether it is "Days"/"Weeks"/"Months"/"Years".
				var milliSecTillLastRenewal = null;
				//var milliSecTillLastRollingRenewal = null;
				var firstRenewalDateObj = null;
				var orgExpDate = null;
				if(renewalOn === "01") {
					firstRenewalDateObj = dj.byId("exp_date").get("value");
					orgExpDate = dj.byId("org_exp_date");
					if(!firstRenewalDateObj && orgExpDate)
					{
						firstRenewalDateObj = dojo.date.locale.parse(orgExpDate.get("value"),{locale:dojo.config.locale, formatLength:"short", selector:"date" });
					}
					if(firstRenewalDateObj == null) {
						isPreCondStsfd = false;
						this.invalidMessage = m.getLocalization("expiryDateReqdForFinExpiryDateError");
					}
				}
				else if(renewalOn === "02") {
					firstRenewalDateObj = renewalCalDate;
					if(firstRenewalDateObj == null)
					{
						isPreCondStsfd = false;
						this.invalidMessage = m.getLocalization("calendarDateReqdForFinExpiryDateError");
					}
				}
				else{
						isPreCondStsfd = false;
						this.invalidMessage = m.getLocalization("renewOnNotSelectedError");
				}
				
				if(rollingReneNbdays == null || isNaN(rollingReneNbdays)) 
				{
					isPreCondStsfd = false;
					this.invalidMessage = m.getLocalization("nbofRenewalsNotSelectedError");
				}
				else if (renewalOn === "01" || renewalOn === "02")
				{
					if(renewalInterval == null || renewalInterval === "" || renewalIntervalUnit == null || renewalIntervalUnit === "")
					{
						isPreCondStsfd = false;
						this.invalidMessage = m.getLocalization("renewForNotSelectedError");
					}
				}
				if(isPreCondStsfd) {
					switch (renewalIntervalUnit) {
						case "D":	
							milliSecTillLastRenewal =  d.date.add(firstRenewalDateObj, "day", numOfRenewals * renewalInterval);
							break;
						case "W":	
							milliSecTillLastRenewal = d.date.add(firstRenewalDateObj, "week", numOfRenewals * renewalInterval);		
							break;
						case "M":	
							milliSecTillLastRenewal = d.date.add(firstRenewalDateObj, "month", numOfRenewals * renewalInterval);
							break;
						case "Y":	
							milliSecTillLastRenewal = d.date.add(firstRenewalDateObj, "year", numOfRenewals * renewalInterval);		
							break;
						default:
							break;
					}
					//Last active date of the trade product
					var lastActiveDateObj;
					if(milliSecTillLastRenewal!=undefined){
						lastActiveDateObj = new Date(milliSecTillLastRenewal.getTime());
					}
					
					//Final expiry date can be any date after the last active date
					if(lastActiveDateObj!=undefined && finalExpDateObj.getTime() < lastActiveDateObj.getTime() ) {
						isFinalExpDateValid = false;
						// Formatting the Date String as per the User Locale
						var localizedLastActiveDate = dojo.date.locale.format(lastActiveDateObj, {selector:"date", formatLength:"short", locale:dojo.config.locale});
						console.log("Final Expiry Date cannot be before Last Active Date: " + localizedLastActiveDate);
						this.invalidMessage = m.getLocalization("finExpiryDateLessThanLastActiveDateError", 
														[ _localizeDisplayDate(this), 
														  localizedLastActiveDate
														]);
					}
				}
				else{								//Cannot validate Final Expiry Date if required fields (Expiry Date/Calendar Date for Renewal) are missing
					isFinalExpDateValid = false;
				}
				
				//Code for validation of final expiry date after rolling renewal. Can be used later for MPSSC-4449
				/*if(isPreCondStsfd) {
					if(!rollingRenewalOn || rollingRenewalOn !== "03")
					{
						switch (renewalIntervalUnit) {
							case "D":	
								milliSecTillLastRenewal =  d.date.add(firstRenewalDateObj, "day", numOfRenewals * renewalInterval);
								break;
							case "W":	
								milliSecTillLastRenewal = d.date.add(firstRenewalDateObj, "week", numOfRenewals * renewalInterval);		
								break;
							case "M":	
								milliSecTillLastRenewal = d.date.add(firstRenewalDateObj, "month", numOfRenewals * renewalInterval);
								break;
							case "Y":	
								milliSecTillLastRenewal = d.date.add(firstRenewalDateObj, "year", numOfRenewals * renewalInterval);		
								break;
							default:
								break;
						}
						//Last active date of the trade product
						var lastActiveDateObj = new Date(milliSecTillLastRenewal.getTime());
						
						//Final expiry date can be any date after the last active date
						if(finalExpDateObj.getTime() < lastActiveDateObj.getTime() ) {
							isFinalExpDateValid = false;
							// Formatting the Date String as per the User Locale
							var localizedLastActiveDate = dojo.date.locale.format(lastActiveDateObj, {selector:"date", formatLength:"short", locale:dojo.config.locale});
							console.log("Final Expiry Date cannot be before Last Active Date: " + localizedLastActiveDate);
							this.invalidMessage = m.getLocalization("finExpiryDateLessThanLastActiveDateError", 
															[ _localizeDisplayDate(this), 
															  localizedLastActiveDate
															]);
						}
					}
					else if(rollingRenewalOn === "03" && rollingRenewalIntervalUnit !== "" && rollingRenewalInterval !== "")
					{
						switch (renewalIntervalUnit) {
						case "D":	 
							milliSecTillLastRenewal =  d.date.add(firstRenewalDateObj, "day", renewalInterval);
							break;
						case "W":	
							milliSecTillLastRenewal = d.date.add(firstRenewalDateObj, "week", renewalInterval);		
							break;
						case "M":	
							milliSecTillLastRenewal = d.date.add(firstRenewalDateObj, "month", renewalInterval);
							break;
						case "Y":	
							milliSecTillLastRenewal = d.date.add(firstRenewalDateObj, "year", renewalInterval);		
							break;
						default:
							break;
		            	}
		                  var finalExpiryOnFirstRenewal = new Date(milliSecTillLastRenewal.getTime());
		                  
	                	  switch (rollingRenewalIntervalUnit) {
							case "D":	 
								milliSecTillLastRollingRenewal =  d.date.add(finalExpiryOnFirstRenewal, "day", (numOfRenewals-1) * rollingRenewalInterval);
								break;
							case "W":	
								milliSecTillLastRollingRenewal = d.date.add(finalExpiryOnFirstRenewal, "week", (numOfRenewals-1) * rollingRenewalInterval);		
								break;
							case "M":	
								milliSecTillLastRollingRenewal = d.date.add(finalExpiryOnFirstRenewal, "month", (numOfRenewals-1) * rollingRenewalInterval);
								break;
							case "Y":	
								milliSecTillLastRollingRenewal = d.date.add(finalExpiryOnFirstRenewal, "year", (numOfRenewals-1) * rollingRenewalInterval);		
								break;
							default:
								break;
	                	  }
	                	  var finalExpiryOnRollingRenewal = new Date(milliSecTillLastRollingRenewal.getTime());
		                  //Final expiry date can be any date after the last active date
						  if(finalExpDateObj.getTime() < finalExpiryOnRollingRenewal.getTime() ) {
								isFinalExpDateValid = false;
								// Formatting the Date String as per the User Locale
								var localizedFinalExpiryOnRollingRenewal = dojo.date.locale.format(finalExpiryOnRollingRenewal, {selector:"date", formatLength:"short", locale:dojo.config.locale});
								console.log("Final Expiry Date cannot be before Last Active Date: " + localizedFinalExpiryOnRollingRenewal);
								this.invalidMessage = m.getLocalization("finExpiryDateLessThanLastActiveDateError", 
																[ _localizeDisplayDate(this), 
																  localizedFinalExpiryOnRollingRenewal
																]);
							}
					}
				}
				else{								//Cannot validate Final Expiry Date if required fields (Expiry Date/Calendar Date for Renewal) are missing
					isFinalExpDateValid = false;
				}*/
				
			}
			return isFinalExpDateValid;
		},
		/**
		 * Summary:
		 * Validates the Valid From date.(Used in License(LS))
		 * <h4>Description:</h4> 
		 * It checks for the following scenarios  
		 * </br>The Valid From Date must be greater than or equal to the Application Date.
		 * </br>The Valid From Date must be greater than or equal to the Registration Date.
		 * </br>The Valid From Date must be greater than or equal to the Issue Date.
		 * </br>The Valid From Date must be less than or equal to the Valid To Date.
		 * </br>The Valid From Date must be less than or equal to the Latest Payment Date.
		 * </br>In case of error it shows an error popup.
		 * @method validateValidFromDate
		 * @return {boolean}
		 *  True if date is valid otherwise false.
		 */
		validateValidFromDate : function() {
			//  summary:
		    //       Validates the Valid From date.(Used in License(LS))

			if(!this.get("value")){
				return true;
			}
			
			console.debug("[misys.validation.common] Validating Valid From Date, Value", 
					this.get("value"));
			
			if(dj.byId("reg_date")) 
			{
				var regDate = dj.byId("reg_date");
				if(!m.compareDateFields(regDate, this)) {
					this.invalidMessage = m.getLocalization("validFromDateLessThanRegDateError",
							[_localizeDisplayDate(this),
							 _localizeDisplayDate(regDate)]);
					return false;
				}
			}
			if(dj.byId("iss_date") && dj.byId("iss_date").get("value") !== null)
			{
				var issDate = dj.byId("iss_date");
				if(!m.compareDateFields(issDate, this)) {
					this.invalidMessage = m.getLocalization("validFromDateLessThanIssDateError",
							[_localizeDisplayDate(this),
				             _localizeDisplayDate(issDate)]);
					return false;
				}
			}
			if(dj.byId("valid_to_date") && dj.byId("valid_to_date").get("value") !== null)
			{
				var validToDate = dj.byId("valid_to_date");
				if(!m.compareDateFields(this, validToDate)) {
					this.invalidMessage = m.getLocalization("validFromDateGreaterThanValidToDateError",
							[_localizeDisplayDate(this),
				             _localizeDisplayDate(validToDate)]);
					return false;
				}
			}
			if(dj.byId("latest_payment_date") && dj.byId("latest_payment_date").get("value") !== null)
			{
				var latestPaymentDate = dj.byId("latest_payment_date");
				if(!m.compareDateFields(this, latestPaymentDate)) {
					this.invalidMessage = m.getLocalization("validFromDateGreaterThanLatestPaymntDateError",
							[_localizeDisplayDate(this),
				             _localizeDisplayDate(latestPaymentDate)]);
					return false;
				}
			}
			return true;
		},
		/**
		 * Summary:
		 *  Validates the Valid To date.(Used in License(LS))
		 *  <h4>Description:</h4> 
		 *  It checks for the following scenarios 
		 *  </br>The Valid To Date must be greater than or equal to the Current Date.
		 *  </br>The Valid To Date must be greater than or equal to the Application Date.
		 *  </br>The Valid To Date must be greater than or equal to the Issue Date.
		 *  </br>The Valid To Date must be greater than or equal to the Valid From Date.
		 *  </br>The Valid To Date must be less than or equal to the Latest Payment Date.
		 *  </br> Shows an error dialog in case of error
		 *  @method validateValidToDate
		 *  @return {boolean}
		 *   True if date is valid otherwise false
		 */
		validateValidToDate : function() {
			//  summary:
		    //       Validates the Valid To date.(Used in License(LS))

			if(!this.get("value")){
				return true;
			}
			
			console.debug("[misys.validation.common] Validating Valid To Date, Value", 
					this.get("value"));
			
			
			var days = validateBusinessDate(this);
			if(days < 0)
			{
				this.invalidMessage = m.getLocalization("validToDateLessThanTodayDateError",
						[_localizeDisplayDate(this)]);
				return false;
			}	
			
			// Test that the Valid To date is greater than the application date
			if(dj.byId("appl_date")) 
			{
				var applDate = dj.byId("appl_date");
				if(!m.compareDateFields(applDate, this)) {
					this.invalidMessage = m.getLocalization("validToDateLessThanAppDateError",
							[_localizeDisplayDate(this),
							 _localizeDisplayDate(applDate)]);
					return false;
				}
			}
			if(dj.byId("iss_date") && dj.byId("iss_date").get("value")!= null)
			{
				var issDate = dj.byId("iss_date");
				if(!m.compareDateFields(issDate, this)) {
					this.invalidMessage = m.getLocalization("validToDateLessThanIssDateError",
							[_localizeDisplayDate(this),
				             _localizeDisplayDate(issDate)]);
					return false;
				}
			}
			if(dj.byId("valid_from_date") && dj.byId("valid_from_date").get("value")!==null)
			{
				var validFromDate = dj.byId("valid_from_date");
				if(!m.compareDateFields(validFromDate, this)) {
					this.invalidMessage = m.getLocalization("validToDateLessThanValidFromDateError",
							[_localizeDisplayDate(this),
				             _localizeDisplayDate(validFromDate)]);
					return false;
				}
			}
			if(dj.byId("latest_payment_date") && dj.byId("latest_payment_date").get("value")!==null)
			{
				var latestPaymentDate = dj.byId("latest_payment_date");
				if(!m.compareDateFields(this, latestPaymentDate)) {
					this.invalidMessage = m.getLocalization("validToDateGreaterThanLatestPaymntDateError",
							[_localizeDisplayDate(this),
				             _localizeDisplayDate(latestPaymentDate)]);
					return false;
				}
			}
			return true;
		},
		/**
		 * Summary:
		 * Validates the Latest Payment date.(Used in License(LS))
		 * <h4>Description:</h4> 
		 * It checks for the following scenarios  
		 * </br>The Latest Payment Date  must be greater than or equal to the Application Date.
		 * </br>The Latest Payment Date must be greater than or equal to the Issue Date.
		 * </br>The Latest Payment Date must be greater than or equal to the Valid From Date.
		 * </br>The Latest Payment Date must be greater than or equal to the Valid To Date.
		 * @method validateLatestPaymentDate
		 */
		validateLatestPaymentDate : function() {
			//  summary:
		    //       Validates the Latest Payment date.(Used in License(LS))

			if(!this.get("value")){
				return true;
			}
			
			console.debug("[misys.validation.common] Validating Latest Payment Date, Value", 
					this.get("value"));
			
			// Test that the Latest Payment date is greater than the application date
			if(dj.byId("appl_date")) 
			{

				var applDate = dj.byId("appl_date");
				if(!m.compareDateFields(applDate, this)) {
					this.invalidMessage = m.getLocalization("latestPaymentDateLessThanAppDateError",
							[_localizeDisplayDate(this),
							 _localizeDisplayDate(applDate)]);
					return false;
				}
			}
			if(dj.byId("iss_date") && dj.byId("iss_date").get("value")!==null){
			var issDate = dj.byId("iss_date");
			if(!m.compareDateFields(issDate, this)) {
				this.invalidMessage = m.getLocalization("latestPaymentDateLessThanIssDateError",
						[_localizeDisplayDate(this),
			             _localizeDisplayDate(issDate)]);
				return false;
			}
			}
			if(dj.byId("valid_from_date") && dj.byId("valid_from_date").get("value")!==null){
				var validFromDate = dj.byId("valid_from_date");
				if(!m.compareDateFields(validFromDate, this)) {
					this.invalidMessage = m.getLocalization("latestPaymentDateLessThanValidFromDateError",
							[_localizeDisplayDate(this),
				             _localizeDisplayDate(validFromDate)]);
					return false;
				}
				}
			if(dj.byId("valid_to_date") && dj.byId("valid_to_date").get("value")!==null){
				var validToDate = dj.byId("valid_to_date");
				if(!m.compareDateFields(validToDate, this)) {
					this.invalidMessage = m.getLocalization("latestPaymentDateLessThanValidToDateError",
							[_localizeDisplayDate(this),
				             _localizeDisplayDate(validToDate)]);
					return false;
				}
				}
			return true;
		},
		
		/**
		 * Summary:
		 * Validates the Registration date.(Used in License(LS))
		 * <h4>Description:</h4> 
		 * It checks for the following scenarios  
		 * </br>The Registration Date  must be less than or equal to the Issue Date.
		 * @method validateRegDate
		 */
		validateRegDate : function() {
			//  summary:
		    //       Validates the Registration date.(Used in License(LS))

			if(!this.get("value")){
				return true;
			}
			
			console.debug("[misys.validation.common] Validating Registration Date, Value", 
					this.get("value"));
			
			// Test that the Issue date is greater than the Registration date
			if(dj.byId("iss_date")) 
			{
				var issDate = dj.byId("iss_date");
				if(!m.compareDateFields(this, issDate)) {
					this.invalidMessage = m.getLocalization("regDateGreaterThanIssDateError",
							[_localizeDisplayDate(this),
							 _localizeDisplayDate(issDate)]);
					return false;
				}
			}

			var days = validateBusinessDate(this);
			if(days > 0)
			{
				this.invalidMessage = m.getLocalization("RegistrationDateGreaterThanApplicationDateError",
						[_localizeDisplayDate(this)]);
				return false;
			}
			return true;
		},
		
		/**
		 * Summary:
		 * Validate the license settlement date
		 * <h4>Description:</h4> 
		 * License Settlement Amount cannot be greater than the License Amount.
		 * @method validateLicenseSettlementAmt
		 * @return {boolean}
		 *  True if Amount is valid other wise false
		 */
		validateLicenseSettlementAmt : function() {
			if(dj.byId("ls_amt"))
			{
				var lsAmt = d.number.parse(dj.byId("ls_amt").get("value"));
				var lsSettlementAmt = d.number.parse(dj.byId("ls_settlement_amt").get("value"));
				lsAmt = !isNaN(lsAmt) ? lsAmt : 0;
				lsSettlementAmt = !isNaN(lsSettlementAmt) ? lsSettlementAmt : 0;
				if(lsSettlementAmt > lsAmt)
				{
					console.debug("License Settlement Amount cannot be greater than the License Amount.");
					m.showTooltip(m.getLocalization("lsSettlementAmtGreaterThanLSAmtError", [lsSettlementAmt, lsAmt]),
							this.domNode, ["after"]);
					this.state = "Error";
					this._setStateClass();
					dj.setWaiState(this.focusNode, "invalid", "true");
					return false;
				}
			}
			return true;
		},
		/**
		 * Summary:
		 * Validates the license settelment amount 
		 * <h4>Description:</h4> 
		 * Additional Settlement Amount cannot be greater than the Additional License Amount.
		 * @method validateAddLicenseSettlementAmt
		 * @return {boolean}
		 *  True if amount is valid otherwise false
		 */
		validateAddLicenseSettlementAmt : function() {
			if(dj.byId("additional_amt"))
			{
				var additionalAmt = d.number.parse(dj.byId("additional_amt").get("value"));
				var additionalSettlementAmt = d.number.parse(dj.byId("add_settlement_amt").get("value"));
				additionalAmt = !isNaN(additionalAmt) ? additionalAmt : 0;
				additionalSettlementAmt = !isNaN(additionalSettlementAmt) ? additionalSettlementAmt : 0;
				if(additionalSettlementAmt > additionalAmt)
				{
					console.debug("Additional Settlement Amount cannot be greater than the Additional License Amount.");
					m.showTooltip(m.getLocalization("addSettlementAmtGreaterThanAddAmtError", [additionalSettlementAmt, additionalAmt]),
							this.domNode, ["after"]);
					this.state = "Error";
					this._setStateClass();
					dj.setWaiState(this.focusNode, "invalid", "true");
					return false;
				}
			}
			return true;
		},
		/**
		 * Summary: 
		 * Validates the renewal calendar date. Checks
		 * for the expiry date if it is not there show an error
		 * message. Also date selected should be greater than
		 * the system date and less than the expiry date.
		 * 
		 * @method validateRenewalCalendarDate
		 */
		validateRenewalCalendarDate: function() {
			var renewalCalDate = dj.byId("renewal_calendar_date") ?dj.byId("renewal_calendar_date").get("value"):"";
			var renewalOn = dj.byId("renew_on_code")?dj.byId("renew_on_code").get("value"):"";
			var currentDate= new Date();
			var isValidRenewalCalendarDate= true;
			if(renewalOn != null && renewalOn === "02") {
				var expDateObj = dj.byId("exp_date").get("value");
				var orgExpDate = dj.byId("org_exp_date");
				if(!expDateObj && orgExpDate)
				{
					expDateObj = dojo.date.locale.parse(orgExpDate.get("value"),{locale:dojo.config.locale, formatLength:"short", selector:"date" });
				}
				if(expDateObj == null || expDateObj === "") {
					isValidRenewalCalendarDate = false;
					this.invalidMessage = m.getLocalization("expiryDateReqd");
				}
				if(renewalCalDate != null && expDateObj != null && ((renewalCalDate <= currentDate) || (renewalCalDate > expDateObj))) {
					isValidRenewalCalendarDate=false;
					var localizedCurrentDate = dojo.date.locale.format(currentDate, {selector:"date", formatLength:"short", locale:dojo.config.locale});
					var localizedExpiryDate = dojo.date.locale.format(expDateObj, {selector:"date", formatLength:"short", locale:dojo.config.locale});
					this.invalidMessage = m.getLocalization("calendarDateLessThanSystemDate", [localizedCurrentDate,localizedExpiryDate]);
				}
			}
			return isValidRenewalCalendarDate;
		},
		/**
		 * Summary: 
		 * Validates the renewal calendar date. Checks
		 * for the expiry date if it is not there show an error
		 * message. Also date selected should be greater than
		 * the system date and less than the expiry date.
		 * 
		 * @method validateAmendBGRenewalCalendarDate
		 */
		validateAmendBGRenewalCalendarDate: function() {
			var renewalCalDate = dj.byId("renewal_calendar_date") ?dj.byId("renewal_calendar_date").get("value"):"";
			var renewalOn = dj.byId("renew_on_code")?dj.byId("renew_on_code").get("value"):"";
			var currentDate = new Date();
			if(renewalOn != null && renewalOn === "02") {
				var expDateObj = dj.byId("exp_date").get("value");
				var orgExpDate = dj.byId("org_exp_date");
				var that = this;
				if(!expDateObj && orgExpDate)
				{
					expDateObj = dojo.date.locale.parse(orgExpDate.get("value"),{locale:dojo.config.locale, formatLength:"short", selector:"date" });
				}
				if(expDateObj == null || expDateObj === "") {
					m.dialog.show("ERROR", m.getLocalization("expiryDateReqd"), "", function(){
						that.focus();
					});
					this.reset();
				}
				if(renewalCalDate != null && expDateObj != null && ((renewalCalDate <= currentDate) || (renewalCalDate > expDateObj))) {
					var localizedCurrentDate = dojo.date.locale.format(currentDate, {selector:"date", formatLength:"short", locale:dojo.config.locale});
					var localizedExpiryDate = dojo.date.locale.format(expDateObj, {selector:"date", formatLength:"short", locale:dojo.config.locale});
					m.dialog.show("ERROR", m.getLocalization("calendarDateLessThanSystemDate", [localizedCurrentDate,localizedExpiryDate]), "", function(){
						that.focus();
					});
					this.reset();
				}
			}
		},
		/**
		 * Summary:
		 * Validates the data entered as the Transport document date.
		 * Transport document date should be less than the application date.
		 * @method validateTransportDocumentDate
		 * @return {boolean}
		 *  True if Date is valid otherwise false
		 */
		 validateTransportDocumentDate : function() {
			// summary:
			// Validates the data entered as the Transport
			// Document Date.
			//
			 if(!this.get("value")) {
					return true;
				}
			console.debug("[misys.validation.common] Validating Transport Document Date. Value = ",
								this.get("value"));

				// Test that the Transport Document date is greater
				// than or equal to
				// the application date
				var applDate = dj.byId("appl_date");
				if (d.date.compare(this.get("value"), m.localizeDate(applDate)) >= 0)
				{
					this.invalidMessage = m.getLocalization(
							"TransDocDateGreaterThanApplDateError", [
									_localizeDisplayDate(this),
									_localizeDisplayDate(applDate) ]);
					return false;
				}
				return true;
			},
			/**
			 * Summary:
			 * Validates the Future date
			 * Shows an error message if Furture date is less than issue date or application date.
			 * @method validateFutureDate
			 */
			validateFutureDate : function()
			{

				if(!this.get("value")) {
					return true;
				}
				// Test that the expiry date is greater than or
				// equal to the issue date
				var issueDate = dj.byId("iss_date");
				if ((issueDate && issueDate.get("value")) && (d.date.compare(this.get("value"), m.localizeDate(issueDate)) <= 0))
				{
						this.invalidMessage = m.getLocalization(
								"issDateSmallerThanFutureDate", [
										_localizeDisplayDate(this),
										_localizeDisplayDate(issueDate) ]);
						return false;
				}

				// Test that the expiry date is greater than the
				// application date
				var applDate = dj.byId("appl_date");
				if ((applDate && applDate.get('value')) && (d.date.compare(this.get("value"), m.localizeDate(applDate)) <= 0))
				{
						this.invalidMessage = m.getLocalization(
								"futureDateSmallerThanAppDate", [
										_localizeDisplayDate(this),
										_localizeDisplayDate(applDate) ]);
						return false;
				}
				return true;
			},
			/**
			 * Summary: Validates the transaction amount. It should
			 * not be greater than the guarantee amount and should
			 * not be equal to zero. <h4>Description:</h4>  Must be applied to
			 * an input field of dojoType.Shows an error message in case of error.
			 * dijit.form.CurrencyTextBox.
			 * @method validateTnxAmount
			 * @return {boolean}
			 *  True if transaction amount is valid otherwise false
			 */
			validateTnxAmount : function()
			{
				//  summary:
			    //       Validates the transaction amount. It should not be greater than the guarantee amount and should not be equal to zero.
				//		 Must be applied to an input field of 
				//       dojoType dijit.form.CurrencyTextBox.
				
				var tnxAmt = dj.byId("tnx_amt");
				var claimAmt = dj.byId("claim_amt");
				var tnxAmtValue = dojo.number.parse(dj.byId("tnx_amt").get("value"));
				var amtValue;
				if(dj.byId("lc_amt"))
				{
					amtValue = dojo.number.parse(dj.byId("lc_amt").get("value"));
					console.debug("SI Amount, Value = ", amtValue);
				}
				else if(dj.byId("bg_amt"))
				{
					amtValue = dojo.number.parse(dj.byId("bg_amt").get("value"));
					console.debug("BG Amount, Value = ", amtValue);
				}
				console.debug("Tnx Amount, Value = ", tnxAmtValue);
				
				if(claimAmt)
				{
					var claimAmtValue = dojo.number.parse(claimAmt.get("value"));
					console.debug("Claim Amount, Value = ", claimAmtValue);
				}
				
				if(tnxAmtValue < 0)
				{
					tnxAmt.invalidMessage = m.getLocalization('totalamount');
					return false;
				}

				if(tnxAmt && amtValue && tnxAmtValue > amtValue)
				{
					tnxAmt.invalidMessage = misys.getLocalization('settlementAmtGreaterThanOrigTnxAmtError',[ tnxAmtValue.toFixed(2), amtValue.toFixed(2) ]);
					return false;
				}
				else if(tnxAmt && claimAmt && tnxAmtValue > claimAmtValue)
				{
					tnxAmt.invalidMessage = misys.getLocalization('tnxAmtGreaterThanClaimAmtError',[ tnxAmtValue.toFixed(2), claimAmtValue.toFixed(2) ]);
					return false;
				}
				else if(tnxAmt && tnxAmtValue === 0)
				{
					tnxAmt.invalidMessage = misys.getLocalization('tnxAmtZeroError');
					return false;
				}
				return true;
			},
			
			/**
			 * Summary:
			 * Validates the Finance requested amount
			 * Shows an error message if Finance requested amount is greateer than the intent to pay amount or total net amount.
			 * @method validateFutureDate
			 */
			validateFinanceAmt : function()
			{
				var intentToPayAmt,totalNetAmt;
				var isValid = true;
				
				if(this.get("value") <= 0)
				{
					isValid = false;
					this.invalidMessage = misys.getLocalization("financeRequestAmtError");
				}
				
				else if(dj.byId("intent_to_pay_amt"))
				{
					intentToPayAmt = Number(dj.byId("intent_to_pay_amt").get("value").replace(",",""));
									
					if(intentToPayAmt !="" && this.get("value") > intentToPayAmt)
					{
						isValid = false;
						this.invalidMessage = misys.getLocalization("financeRequestAmtErrorForIntentPayAmt");
					}
				}
				else if(dj.byId("total_net_amt"))
				{
					totalNetAmt =  dj.byId("total_net_amt").get("value");
					
					if(totalNetAmt !== "" && this.get("value") > totalNetAmt)
					{
						isValid = false;
						this.invalidMessage = misys.getLocalization("financeRequestAmtErrorForTotalAmt");
					}
				}
				return isValid;
			},
			/**
			 * Summary:
			 * Validates the value of Parity field while modifying a Rate.
			 * <h4>Description:</h4> 
			 * If the value of parity field is lesser and equal to zero show an error message.
			 * @method validateParity
			 * @return {Boolean} isValid
			 *  Ture if Parity field is valid otherwise false
			 */
			validateParity : function(){
 	           //summary: Validates the value of Parity field while modifying a Rate.
                var parityVal = this.get("value");
                var isValid=true;
				if((parityVal === 0) || (parityVal < 0))
                {
					this.invalidMessage =m.getLocalization("parityError");
				    isValid=false;
				}
				return isValid;
			},
			/**
			 * Summary:
			 * Function used to validate the remarks.
			 * It internally calls function _validateChar to validate the remarks for examples(input_split_remarks)
			 * @method validateRemarks
			 */
			validateRemarks : function() {
				//	summary:
			    //		Function used to validate the remarks.
				console.debug("[Validate] Validating Remarks, Value = " + this.get('value'));
				if(!_validateChar(this, " 0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ#$^*_=`~{}|:./[]-")){
					var message = m.getLocalization("illegalRemarksCharError", [ this.get('value') ]);
					// TODO:This fix was introduced to replace < characters with &lt; as they were being replaced with a DIV's
					// in subsequent processing.
					// This cased the remarks tool top to only display as far as the first < character.
					// This fix should most likely be removed one a reason is determined for why in some
					// cases the < is interpreted as a div
					message = message.replace(/>/g, "&gt;");
					message = message.replace(/</g, "&lt;");
					this.invalidMessage= message;
					return false;
				}
				return true;
			},
			/**
			 * <h4>Summary:</h4>
			 * Validates the data entered as the amendment Date.
			 * It shows an error message if loan amendment date is lesser than the Loan effective date
			 * It shows an error message if loan amendment date is greater than the Loan maturity date.
			 * It shows an error message if loan amendment date is greater than the Facility Expiry date.
			 * @method validateLoanIncreaseDate
			 */
			validateLoanIncreaseDate:function(){
			    //  tags:
			    //         public, validation
				
			
				
				// This validation is for non-required fields
				if(this.get('value') == null){
					return true;
				}

				console.debug('[Validate] Validating Loan Amendment Date. Value = ' + this.get('value'));
				var thisObject  = dj.byId(this.id);
				//Current date validation
				// Test that the amendment date is less than  the current system date
				var currentDate = new Date();
				// set the hours to 0 to compare the date values
				currentDate.setHours(0, 0, 0, 0);
				
				// compare the values of the current date and transfer date
				var isValid = d.date.compare(m.localizeDate(this), currentDate) < 0 ? false : true;
				if(!isValid)
				{
					 this.invalidMessage = m.getLocalization("loanEffectiveIncreaseDateLessThanCurrentDate", [_localizeDisplayDate(this)]);
					 return false;
				}
				
				// Test that the amendment date is greater than the loan effective date
				var thisObjLocalized = m.localizeDate(thisObject);
				var effLoanDate = dj.byId('effective_date');
				if(effLoanDate){
					var effLoanDateLocalized = m.localizeDate(effLoanDate);
					if(d.date.compare(effLoanDateLocalized, thisObjLocalized) > 0){
						this.invalidMessage = m.getLocalization('loanAmendDateLesserThanLoanEffectiveDateError', [
									_localizeDisplayDate(this),
									_localizeDisplayDate(effLoanDate)]);
						return false;
					}
				}
				
				// Test that the loan effective date is greater than repricing date
				thisObjLocalized = m.localizeDate(thisObject);
				var flag = dj.byId('sub_product_code');
				var subProductcodeforSwing="SWG";
				if(flag.get("value") === subProductcodeforSwing){
				var effectLoanDate = dj.byId('repricing_date');
					if(effectLoanDate){
						var effectLoanDateLocalized = m.localizeDate(effectLoanDate);
						if(d.date.compare(effectLoanDateLocalized, thisObjLocalized) <= 0){
							this.invalidMessage = m.getLocalization('loanAmendDateLesserThanRepricingDateError', [
										_localizeDisplayDate(this),
										_localizeDisplayDate(effectLoanDate)]);
							return false;
						}
					}
				}
								
				// Test that the amendment date is less than or equal to the maturity date
				var lnMatDate = dj.byId('ln_maturity_date');
				
				if(lnMatDate && lnMatDate.get('value') !== ""){
					var lnMatDateLocalized = m.localizeDate(lnMatDate);
					if(d.date.compare(lnMatDateLocalized, thisObjLocalized) <= 0){
						this.invalidMessage = m.getLocalization('loanAmendDateGreaterThanLoanMatDateError', [
									_localizeDisplayDate(this),
									_localizeDisplayDate(lnMatDate)]);
						return false;
					}
				}
				
				// Test that the amendment date is less than or equal to the facility expiry date
				var facExpDate = dijit.byId('facility_expiry_date');
				if(facExpDate){
					var facExpDateLocalized = m.localizeDate(facExpDate);
					if(d.date.compare(facExpDateLocalized, thisObjLocalized) < 0){
						this.invalidMessage = m.getLocalization('loanAmendDateGreaterThanFacExpDateError', [
									_localizeDisplayDate(this),
									_localizeDisplayDate(facExpDate)]);
						return false;
					}
				}
				
				var applDate = dj.byId('appl_date');
				if(applDate){
					var applDateLocalized = m.localizeDate(applDate);
					if(d.date.compare(applDateLocalized, thisObjLocalized) > 0){
						this.invalidMessage = m.getLocalization('loanAmendDateLesserThanLoanApplDateError', [
									_localizeDisplayDate(this),
									_localizeDisplayDate(applDate)]);
						return false;
					}
				}
					
				return true;
			},
			/**
			 * Summary:
			 * Validates the BIC code for BPO.In this we have defined a regular expression defined.We check our BIC code against this.
			 * If it doesn't pass the test.It displays an error message telling that it is invalid BIC.
			 * @param {Object} id
			 *  Id of the bic code
			 * @method validateBpoBICFormat
			 */
			validateBpoBICFormat : function(id) {
				//  summary:
			    //       Validates the BIC code.

				var bic = id.get("value"),
				regex = new RegExp(
						"^[A-Z0-9]{4,4}[A-Z]{2,2}[A-Z0-9][A-Z2-9]([A-Z0-9]{3,3}){0,1}$", "g");
			
				if(bic) {
					console.debug("[misys.validation.common] Validating BIC Format, Value", bic);
					if(!regex.test(bic)){
						var displayMessage = m.getLocalization("invalidBICError", [bic]);
						id.set("value","");
						id.set("state","Error");
						m.dialog.show("ERROR", m.getLocalization("focusOnErrorAlert"), "", function(){
							id.focus();
							dj.hideTooltip(id.domNode);
							dj.showTooltip(displayMessage,id.domNode, 0);
						});
					}
				}
			},
			
			
			/**
			 * Summary:
			 * Validates that the node date field is greater than current date, and greater than the dates in the array.
			 *  @param {String} node
			 * @param {Array of date nodes} dateNodes
			 * 
			 * @method compareDateIsGreater
			 */
			compareDateIsGreater : function(/* dijit._Widget || DomNode || String */node,/*Array of Nodes*/dateNodes)
			{
				
				var widget = dj.byId(node);
				var date1 = null;
				if(!(widget && widget.get("value"))) {
					return true;
				}else{
					date1 = widget.get("value");
				}
				var currentDate = new Date();
				// set the hours to 0 to compare the date values
				currentDate.setHours(0, 0, 0, 0);
				// Test that the date is greater than or
				// equal to current date.
				if(d.date.compare(m.localizeDate(widget), currentDate) < 0)
				{
					m._config.onSubmitErrorMsg = m.getLocalization(
							"expDateSmallerThanCurrentDate", [
									_localizeDisplayDate(widget)]);
					return false;
				
				}
				// Test that the date is greater than or
				// equal to all the dates in the array.
				for(var i = 0; i < dateNodes.length; i++){
					var toCompareWidget = dj.byId(dateNodes[i]);
					if ((toCompareWidget && toCompareWidget.get("value")) && (d.date.compare(date1, m.localizeDate(toCompareWidget)) <= 0))
					{
							m._config.onSubmitErrorMsg = m.getLocalization(
									"issDateSmallerThanFutureDate", [
											_localizeDisplayDate(widget),
											_localizeDisplayDate(toCompareWidget) ]);
							return false;
					}
				}
				return true;
			},
			
			validateDescriptionGoods : function() {
				//  summary:
			    //  Validates Description of Goods for Licence product.
				//  Will revert this later				
			
				var strInput = this.get("value"),
					isValid = true,
					that = this;
					
					
				if(strInput.length > 35){
					that.invalidMessage = m.getLocalization("invalidLSDescGoodsLength", 
								[that.get("displayedValue")]);
					
					/*m.dialog.show("ERROR", that.invalidMessage, '', function(){
						setTimeout(callback, 500);
					});*/
					isValid = false;
					return false;
						
				}
				return true;
			}, 
			
			/**
			 * <h4>Summary:</h4>
			 * Function to set the renewal amount code for SI and SR.
			 * @method setRenewalAmount
			 * @param renewAmtCode
			 *
			 */
			 setRenewalAmount : function(renewAmtCode){
				var renewAmtCodeVal = renewAmtCode.get("value");
				if(renewAmtCodeVal === "01"){				
					dj.byId("renew_amt_code_1").set("checked", true);
					dj.byId("renew_amt_code_1").set("value", "01");
				}else if(renewAmtCodeVal === "02"){
					dj.byId("renew_amt_code_2").set("checked",true);
					dj.byId("renew_amt_code_2").set("value", "02");
				}
			},
			
			
			
			/**
			 * <h4>Summary:</h4>
			 * Function to set the renewal amount code for SI and SR on form load.
			 * @method setRenewalAmountOnFormLoad
			 *
			 */
			setRenewalAmountOnFormLoad : function(){
				//Radio field template is reading values from all nodes in the input xml.
				// For ones with multiple transactions, (ex:  create, approve, amend, approve.) the tag values from the root node is not being picked, because of radio-value = //*name in form-templates.
				// To overcome this we are overriding "value" and "checked" params from js.
				if(dj.byId("renew_flag") && dj.byId("renew_flag").get("checked") === true)
				{
					var renewAmountCode = dj.byId("renew_amount_code") ? dj.byId("renew_amount_code").get("value") : "02";			
					if(renewAmountCode){
						if(renewAmountCode === "01") {				
							dj.byId("renew_amt_code_1").set("checked", true);
						}else if(renewAmountCode === "02"){
							dj.byId("renew_amt_code_2").set("checked", true);
						}
					}
				}
			},
			
			/**
			 * <h4>Summary:</h4>
			 * Function to validate whether the rolling renewal frequency is lesser than the renew period.
			 * If not, throws an error.
			 * 
			 * @param {DomNode} node
			 * @method validateRollingRenewalFrequency
			 *
			 */
			validateRollingRenewalFrequency : function(/* dijit._Widget || DomNode || String */node){
				var renewPeriod = dj.byId("renew_for_nb").get("value");
				var rollingRenewPeriod = dj.byId("rolling_renew_for_nb").get("value");
				if(renewPeriod !== "" && rollingRenewPeriod !== "" && rollingRenewPeriod > renewPeriod)
				{
					node.set("value","");
					dj.showTooltip(m.getLocalization("rollingFrequencyCannotBeMoreThanRenewalPeriodError"), node.domNode, 0);
					var hideTT = function() {
						dj.hideTooltip(node.domNode);
					};
					setTimeout(hideTT, 1500);
				}
			},
			
			/**
			 * <h4>Summary:</h4>
			 * Validate maturity with current date
			 * 
			 */
			validateEnteredGreaterThanCurrentDate : function() {
				var maturityDate = dj.byId("maturity_date");
				var currentDate = dj.byId("current_date");
				  if(currentDate && !m.compareDateFields(currentDate, maturityDate))
				  {
					  console.debug("[misys.binding.bank.report_el] Result of comparison = ", m.getLocalization("lessthanCurrentDate"));
				      m.dialog.show("ERROR", m.getLocalization("lessthanCurrentDate"));
				      maturityDate.set("value", " ");
				      return false;
				  }
				return true;
			
			},			
			
			/**
			 * <h4>Summary:</h4>
			 * This function checks if the field contains a decimal value if so display a specific error message.
			 * <h4>Description:</h4> 
			 * Value should be integer and it should be greater than zero.
			 * @param {DomNode} node
			 * @method validateRenewFor
			 */
			validateIntegerValue : function(/* dijit._Widget || DomNode || String */node) {
				//  summary:
			    //  test if the field contains a decimal value if so display a specific error message   

				console.debug("[misys.validation.common] Validate whether "+node.get("id")+" Value is an Integer or not.");

				// If renew contain value
				if(!isNaN(node.get("value")))
				{
					var nodeVal = node.get("value")+"";
					var hideTT = function() {
						dj.hideTooltip(node.domNode);
					};
					if(nodeVal.indexOf(".")!== -1)
					{
						dj.showTooltip(m.getLocalization("valueShouldBeInteger"), node.domNode, 0);
						setTimeout(hideTT, 1500);
						node.set("state","Error");
					}
					if(nodeVal <= 0) 
					{
						dj.showTooltip(m.getLocalization("valueShouldBeGreaterThanZero"), node.domNode, 0);
						setTimeout(hideTT, 1500);
						node.set("state","Error");
					}
				}				
			},
			
			 /**
			    * <h4>Summary:</h4>
			    * This function validates the Expiry date/Next Revolve Date
			    * 
			    * <h4>Description:</h4> 
			    * Next Revolve date should be lesser than the Expiry date,
			    * @method validateNextRevolveDate
			    * @return {boolean}
			    *  True if valid otherwise false.
			    */
			   validateNextRevolveDate : function() {
					//  summary:
				    //        Validates the data entered as the Next Revolve Date.
				    // 
				    // TODO Add business logic explanation here
				   
					// This validation is for non-required fields
					if(!this.get("value")) {
						return true;
					}

					console.debug("[misys.validation.common] Validating Next Revolve Date Date. Value = ",
							this.get("value"));
					
					var days = validateBusinessDate(this);
					if(days < 0)
					{
						console.debug("[misys.validation.common] Days difference between Next Revolve Date and current date = ", days);
						this.invalidMessage = m.getLocalization("nextRevolveDateSmallerThanSystemDate",[
						                                						         _localizeDisplayDate(this)
						                                               								]);
						return false;
					}		
					
					// Test that the expiry date is greater than or equal to the issue date 
					var issueDate = dj.byId("iss_date");
					if((issueDate) && (!m.compareDateFields(issueDate, this)))
					{
							this.invalidMessage = m.getLocalization("nextRevolveDateLessThenIssDateError",[_localizeDisplayDate(this),
											_localizeDisplayDate(issueDate)]);
							return false;
					}
					var expDate = dj.byId("exp_date");
					var orgExpDate = dj.byId("org_exp_date");
					if(expDate && !m.compareDateFields(this, expDate)) 
					{
						this.invalidMessage = m.getLocalization("nextRevolveDateGreaterThanExpiryDateError", [
										_localizeDisplayDate(this),
										_localizeDisplayDate(expDate)]);
						return false;
					}
					else if(expDate.get("value")==null && orgExpDate && !m.compareDateFields(this, orgExpDate) )
					{
						this.invalidMessage = m.getLocalization("nextRevolveDateGreaterThanExpiryDateError", [
										_localizeDisplayDate(this),
										_localizeDisplayDate(orgExpDate)]);
						return false;
					}
					return true;
					
			   },
			
			
			/**
			 * <h4>Summary:</h4>
			 * Function to validate whether the last match date is less than the max BPO expiry date.
			 * If not, throws an error.
			 * 
			 * @method validateOpenAccountLastMatchDate
			 *
			 */
			validateOpenAccountLastMatchDate : function () {
				console.debug("[misys.validation.common] Validating Last Match Date, Value", 
						this.get("value"));
				var lastMatchDate = dj.byId("last_match_date");
				var maxBpoExpiryDate = m.getMaxBPOExpiryDate();
				if(lastMatchDate  && lastMatchDate.get("value") != null && maxBpoExpiryDate !== "") {
					if(d.date.compare(lastMatchDate.get("value"), maxBpoExpiryDate) > 0 ) {
						this.invalidMessage = m.getLocalization("lastMatchDateGreaterThanBpoExpiryDateError",[
                                  _localizeDisplayDate(this),
                                  dojo.date.locale.format(maxBpoExpiryDate,{locale:dojo.config.locale, formatLength:"short", selector:"date" })]);
						return false;
					}	
				}
				
				var expDate = dj.byId("exp_date");
				if(lastMatchDate && lastMatchDate.get("value") != null && expDate &&  expDate.get("value") != null) {
					if(d.date.compare(lastMatchDate.get("value"), expDate.get("value")) > 0 ) {
						this.invalidMessage = m.getLocalization("lastMatchDateGreaterThanExpiryDateError",[
                                  _localizeDisplayDate(this),
                                  _localizeDisplayDate(expDate)]);
						return false;
					}	
				}
				
				var issDate = dj.byId("iss_date");
				if(lastMatchDate && lastMatchDate.get("value") != null && issDate &&  issDate.get("value") != null) {
					if(d.date.compare(lastMatchDate.get("value"), issDate.get("value")) < 0 ) {
						this.invalidMessage = m.getLocalization("lastMatchDateLessThanIssueDateError",[
                                  _localizeDisplayDate(this),
                                  _localizeDisplayDate(issDate)]);
						return false;
					}	
				}
				
				var applDate = dj.byId("appl_date");
				if(lastMatchDate && lastMatchDate.get("value") != null && applDate &&  applDate.get("value") != null) {
					if(d.date.compare(lastMatchDate.get("value"), applDate.get("value")) < 0 ) {
						this.invalidMessage = m.getLocalization("lastMatchDateLessThanApplicationDateError",[
                                  _localizeDisplayDate(this),
                                  _localizeDisplayDate(applDate)]);
						return false;
					}	
				}
				
				
				
				return true;
			},
			
			/**
			 * <h4>Summary:</h4>
			 * Function to validate whether the contract percentage is within 12 digit number, 
			 * including decimal precision.
			 * 
			 * @method checkContractPercent
			 * 
			 */
			checkContractPercent : function() {
				if(!this.get("value")) {
					return true;
				}
				var percent = this.get("value");
				var index = percent.toString().indexOf(".");
				var length = percent.toString().length;
				console.debug("Validating Contract percent Value = ", this.get("value"));
				if(percent<=100 && percent >= 0)
				{
					if (index === -1 && length > 12) {
						this.invalidMessage = m.getLocalization("contractPercentMoreThan12DigitError");
						return false;
					}else if(percent.toString().indexOf(".") >= 0){
						var countDecimalPlaces = (length - index -1);
						if(countDecimalPlaces > 2){
							this.invalidMessage = m.getLocalization("contractPercentMoreThan2DecilamError");
							return false;
						}
					}
					return true;
				}
				else
				{
					this.invalidMessage = m.getLocalization("contractPercentMoreThan100Error");
					return false;
				}				
			},
			
			/**
			 * Summary:
			 * This method validates the earliest ship date
			 * @method validateEarliestShipDate
			 * <h4>Description:</h4> 
			 * </br>Earliest shipment date should be greater than the application date
			 * </br>Earliest shipment date should be greater than the issue date
			 * </br>Earliest shipment date should be less than the expiry date
			 * </br>Earliest shipment date should be less than the Amend date 
			 * </br>Earliest shipment date should be less than the latest shipment date
			 * @method validateEarliestShipDate
			 * @return {booelan} 
			 *  True if valid otherwise false.
			 */
			validateEarliestShipDate : function() {

				//Do not validate for close event
				if((dj.byId("tnxtype") && (dj.byId("tnxtype").get("value") === "38")) || 
				    	(dj.byId("close_tnx") && (dj.byId("close_tnx").get("checked") === true)))
				{
					  return true;
				}
				
				if(!this.get("value")) {
					return true;
				}
				// Test that the Earliest Ship Date is greater than or
				// equal to the issue date
				var issueDate = dj.byId("iss_date");
				if ((issueDate && issueDate.get("value")) && (d.date.compare(this.get("value"), m.localizeDate(issueDate)) < 0))
				{
						this.invalidMessage = m.getLocalization(
								"issDateSmallerThanEarliestShipDate", [
										_localizeDisplayDate(this),
										_localizeDisplayDate(issueDate) ]);
						return false;
				}

				// Test that the Earliest Ship Date is greater than the
				// application date
				var applDate = dj.byId("appl_date");
				if ((applDate) && (d.date.compare(this.get("value"), m.localizeDate(applDate)) < 0))
				{
						this.invalidMessage = m.getLocalization(
								"earliestShipDateSmallerThanAppDate", [
										_localizeDisplayDate(this),
										_localizeDisplayDate(applDate) ]);
						return false;
				}
				
				// Test that the early shipment date is less than or equal to the 
				// max BPO expiry date, if present
				// Else test that the last shipment date is less than or equal to the 
				// expiry date.
				var expDate = dj.byId("exp_date");
				
					var maxBpoExpiryDate = m.getMaxBPOExpiryDate();
					if(this.get("value") !== "" && maxBpoExpiryDate && maxBpoExpiryDate !== "") {
						if(d.date.compare(this.get("value"), maxBpoExpiryDate) > 0 ) {
							this.invalidMessage = m.getLocalization("BPOexpiryDateLessThanEarliestShipmentError",[
		                                _localizeDisplayDate(this),
		                                dojo.date.locale.format(maxBpoExpiryDate,{locale:dojo.config.locale, formatLength:"short", selector:"date" })]);
							return false;
						}	
					}
				
				if(expDate && !m.compareDateFields(this, expDate)) {
					this.invalidMessage = m.getLocalization("expiryDateLessThanEarliestShipmentError",[
					                _localizeDisplayDate(this),
									_localizeDisplayDate(expDate)]);
					return false;
				}
				
				// Test that the Earliest Ship Date is less than the
				// last ship date
				var lastShipDate = dj.byId("last_ship_date");
				if ((lastShipDate && lastShipDate.get("value") != null) && (d.date.compare(this.get("value"), m.localizeDate(lastShipDate)) > 0))
				{
						this.invalidMessage = m.getLocalization(
								"earliestShipDateSmallerThanLastShipDate", [
										_localizeDisplayDate(this),
										_localizeDisplayDate(lastShipDate) ]);
						return false;
				}
				
				// Test that the Earliest Ship Date is less than the
				// line item latest ship date
				var lineItemLastShipDate = dj.byId("line_item_last_ship_date");
				if ((lineItemLastShipDate && lineItemLastShipDate.get("value") != null) && (d.date.compare(this.get("value"), m.localizeDate(lineItemLastShipDate)) > 0))
				{
						this.invalidMessage = m.getLocalization(
								"earliestShipDateSmallerThanLastShipDate", [
										_localizeDisplayDate(this),
										_localizeDisplayDate(lineItemLastShipDate) ]);
						return false;
				}
				
				// Test that the line item shipment sub schedule Earliest ship date is greater than the
				// line item shipment sub schedule latest Ship Date
				var scheduleLatestShipDate = dj.byId("schedule_latest_ship_date");
				var schedule = dj.byId("line_item_shipment_schedules");
				if(schedule && schedule.store && schedule.store._arrayOfTopLevelItems.length > 0 && scheduleLatestShipDate && scheduleLatestShipDate.get("value") != null) 
				{
					if (d.date.compare(this.get("value"), m.localizeDate(scheduleLatestShipDate)) > 0)
					{
						this.invalidMessage = m.getLocalization(
								"earliestShipDateSmallerThanLastShipDate", [
										_localizeDisplayDate(this),
										_localizeDisplayDate(scheduleLatestShipDate) ]);
						return false;
					}
				}
				return true;
			
			},

			validateGroupCode : function() {
				var regex = reg_exp_validationCode.value,
				groupCodeValue = dj.byId("group_code").get("value"),
				regexValue = new RegExp(regex);
				if(groupCodeValue) 
				{
					console.debug("[misys.validation.common] Validating Group Code Format, Value", groupCodeValue);
					if(!regexValue.test(groupCodeValue))
					{
						dj.byId('group_code').set("state", "Error");
						misys.dialog.show("ERROR", misys.getLocalization("validateCode"));
						return false;
					}
				}
				return true;
			},
			
			 validateDescription : function() {
				var regex = reg_exp_validationDesc.value,
				groupDescValue = dj.byId("description").get("value"),
				regexValue = new RegExp(regex);
				if(groupDescValue) 
				{
					console.debug("[misys.validation.common] Validating description Format, Value", groupDescValue);
					if(!regexValue.test(groupDescValue))
					{
						dj.byId('description').set("state", "Error");
						misys.dialog.show("ERROR", misys.getLocalization("validateDesc"));
						return false;
					}
				}
				return true;
				
			},
			
			validateLCAvailablelAmount : function(amtId) {
				if(amtId)
				{
					var amt = amtId.get("value");
					var displayMessage,widget;
					if ((amt < 0) || (amt === undefined)) {
						displayMessage = m.getLocalization("invalidMessage");
						amtId.set("state","Error");
				 		dj.hideTooltip(amtId.domNode);
				 		dj.showTooltip(displayMessage, amtId.domNode, 0);
				 		amtId.focus();
						return false;
					} 
					else
					{
						return true;
					}
				}
				return true;
			},
			
			
			 validateSubGroupCode : function() {
				var regex = reg_exp_validationCode.value,
				subGroupCodeValue = dj.byId("sub_group_code").get("value"),
				regexValue = new RegExp(regex);
				if(subGroupCodeValue) 
				{
					console.debug("[misys.validation.common] Validating Sub Group Code Format, Value", subGroupCodeValue);
					if(!regexValue.test(subGroupCodeValue))
					{
						dj.byId('sub_group_code').set("state", "Error");
						misys.dialog.show("ERROR", misys.getLocalization("validateCode"));
						return false;
					}
				}
				return true;
			},
			validateHighTargetBalances: function()
			{
				//Fork Balance
				if(dj.byId("subGrpType").get("value") && dj.byId("subGrpType").get("value")==="1" )
				{
				if(dj.byId("high_target") && dj.byId("low_target")) {					
					var hightgtAmt = dj.byId("high_target").get("value");
					var lowtgtAmt = dj.byId("low_target").get("value");
					if(hightgtAmt < lowtgtAmt ) {
					   var 	errorMessage =  misys.getLocalization("hightargetLesserThanhighTargetError");
						dj.byId("high_target").set("state","Error");
					    dj.hideTooltip(dj.byId("high_target").domNode);
					    dj.showTooltip(errorMessage, dj.byId("high_target").domNode, 0);
					    return false;
					}
					}	
				}
				return true;
			},
			
			validateLowTargetBalances: function()
			{
				//Fork Balance
				if(dj.byId("subGrpType").get("value") && dj.byId("subGrpType").get("value")==="1" )
				{
				if(dj.byId("high_target") && dj.byId("low_target")) {					
					var hightgtAmt = dj.byId("high_target").get("value");
					var lowtgtAmt = dj.byId("low_target").get("value");
					if(lowtgtAmt > hightgtAmt ) {
					   var 	errorMessage =  misys.getLocalization("lowtargetGreaterThanhighTargetError");
						dj.byId("low_target").set("state","Error");
					    dj.hideTooltip(dj.byId("low_target").domNode);
					    dj.showTooltip(errorMessage, dj.byId("low_target").domNode, 0);
					    return false;
					}
					}	
				}
				return true;
			},
			
			 validateSubGrpDescription : function() {
				var regex = reg_exp_validationDesc.value,
				subGroupDescValue = dj.byId("subgrp_description").get("value"),
				regexValue = new RegExp(regex);
				if(subGroupDescValue) 
				{
					console.debug("[misys.validation.common] Validating description Format, Value", subGroupDescValue);
					if(!regexValue.test(subGroupDescValue))
					{
						dj.byId('subgrp_description').set("state", "Error");
						misys.dialog.show("ERROR", misys.getLocalization("validateDesc"));
						return false;
					}
				}
				return true;
			},
			
			/**
			 * <h4>Summary:</h4>
			 * This function is to validate the upload template already exist in DataBase
			 * <h4>Description:</h4> 
			 * Have an AJAX call inside it
			 * @method checkUploadTemplateNameExists
			 * 
			 */
			checkUploadTemplateNameExists : function()
			{
					var name, prodCode,subProdCode,uploadTemplateId;
					var isValid = false;
					if(dj.byId("name"))
					{
						name = dj.byId("name").get("value");
					}
					if(dj.byId("product_code"))
					{
						prodCode = dj.byId("product_code").get("value");
					}
					if(dj.byId("sub_product_code"))
					{
						subProdCode = dj.byId("sub_product_code").get("value");
					}
					if(dj.byId("upload_template_id"))
					{
						uploadTemplateId = dj.byId("upload_template_id").get("value");
					}
					
					
					
					if(name !== "") {
				
						m.xhrPost( {
							url : m.getServletURL("/screen/AjaxScreen/action/CheckFileUploadTemplateAction"),
							handleAs 	: "json",
							sync 		: true,
							content : {
								name : name,	
								productCode : prodCode,
								subProdCode : subProdCode,
								uploadTemplateId: uploadTemplateId
							},
							load : function(response, args){
								isValid = response.items.valid;
							}
						});
					}
					return isValid;
			},
			
			checkNumericOnlyValue: function(){
				var value = this.get("value");
					if(value !== "") 
					{
						console.debug("[misys.validation.common] Validating , Value", value);
						if(value.match(/^[0-9]+$/) === null)
						{
							this.invalidMessage = misys.getLocalization('valueShouldBeInteger');
							this.set("state", "Error");
							dj.hideTooltip(this.domNode);
							dj.showTooltip(misys.getLocalization('valueShouldBeInteger'), this.domNode, 0);
							return false;
						}
					}
					return true;
			},
			
			/**
			 * This function checks if the Period Presentation Days field contains a decimal value
			 * if so display a specific error message. 
			 * Value should be integer.
			 * @method validatePeriodPresentationDays
			 * @return {boolean}
			 *   True if valid otherwise false.
			 */
			validatePeriodPresentationDays : function()
			{
				var periodPresentationDaysField = dj.byId("period_presentation_days");
				var periodPresentationDaysValue = dj.byId("period_presentation_days").get("value");
				if (typeof periodPresentationDaysValue === "undefined")
				{
					console.debug("Invalid Period Presentation Days value.");
			 		this.invalidMessage = m.getLocalization("valueShouldBeInteger");
			 		return false;
				}
				else if(periodPresentationDaysValue <= 0)
				{
					console.debug("Period Presentation Days value is less than or equal to Zero.");
					this.invalidMessage = m.getLocalization("valueShouldBeGreaterThanZero");
					return false;
				}
				console.debug("Valid Period Presentation Days value");
				return true;
			},
			
			/**
			 *  <h4>Summary:</h4>
			 *  Check if the beneficiary is active or not
			 *  @param {dijit._Widget || DomeNode} node 
			 *  Beneficiary name or the node itself
			 *  @method _validateBeneficiaryStatus
			 */
			
			validateBeneficiaryStatus : function() {
				//  summary:
			    //  Check if the beneficiary is active or not, with an AJAX call.
				
				var beneficiaryName = dj.byId("beneficiary_name")? dj.byId("beneficiary_name").get("value") :"";
				var companyId = dj.byId("company_id")? dj.byId("company_id").get("value") :"";
				var active = true;
						
				if(beneficiaryName !== "" && companyId !== "") 
				{
					console.debug("[cash.create_ft_tpt] Checking if the beneficiary is in active state");
					m.xhrPost({
						url : m.getServletURL("/screen/AjaxScreen/action/ValidateBeneficiaryStatus"),
						handleAs : "json",
						sync 	: true,
						content: {
							beneficiary_name	: beneficiaryName,
							company_id 			: companyId
						},
						load : function(response, args){
							console.debug("[Validate] Validating beneficiary status ");
							if(response && response.items && response.items.active === false)
							{
								active = false;
							}
							else
							{
								console.debug(falseMessage);
							}
						},
						error : function(response, args){
							active = false;
							console.error(" Validating beneficiary status error", response);
						}
					});
				}
				return active;
			},

			/**
			 * <h4>Summary:</h4>
			 * This function is to validate the total length of bank name and address fields to be maximum of 1024
			 * <h4>Description:</h4> 
			 * @method validateLength
			 * 
			 */
			
			validateLength : function(bankType)
			{
				var set = true;
                                var maxlength =  m._config.trade_total_combined_sizeallowed;	
				d.forEach(bankType, function(id){
					if(id) {
						var fieldTotalLength=0; 
						var arrayOfBankFields = [id+"_name", id+"_address_line_1", id+"_address_line_2", 
						               id+"_dom", id+"_address_line_4"];
						d.forEach(arrayOfBankFields, function(id){
							var field = dj.byId(id);
							if(field) {
								fieldTotalLength = fieldTotalLength + (field.get("value")).length;
								if(fieldTotalLength>maxlength)
								{
									m._config.onSubmitErrorMsg =  m.getLocalization("invalidBankFieldSizeErrorForTrade");
									set= false;
								}
							}
						});			
					}
				});		
				return set;
			},
			
			/**
			 * <h4>Summary:</h4>
			 * Validates the data entered as the discount expiry date 
			 * <h4>Description:</h4> 
			 * It checks for the following scenarios
			 * </br>The discount expiry date must be less than or equal to the Invoice due Date.
			 * @method validateDiscountExpDate
			 * @return {boolean}
			 *   if valid return TRUE otherwise return FALSE.
			 */
			validateDiscountExpDate : function() {
			//  summary:
			    //        Validates the data entered as the discount expiry date.
				// 
				// Return true for empty values
				if(!this.get("value")){
					return true;
				}
				
				console.debug("[misys.validation.common] Validating discount expiry date, Value = ", 
						this.get("value"));
				
				// Test that the discount expiry date is less than or equal to
				// the due date
					
					var discountDate = dj.byId("due_date");
										
					if(!m.compareDateFields(this, discountDate)) {
						this.invalidMessage = m.getLocalization("expiryDateGraterThanDueDateError",[
										_localizeDisplayDate(this),
										_localizeDisplayDate(discountDate)]);
						return false;
					}
					return true;
				},
				
				/**
				 * <h4>Summary:</h4>
				 * Validates Email address field
				 * <h4>Description:</h4> 
				 * if the email id field is valid then fine if not it changes the state of the 
				 * email id field to error state.
				 */
				validateEmailid : function()
				{
					console.log("[validation]: Validating email address on field.");
					var emailId;
					if(dj.byId('email'))
					{
						emailId = dj.byId('email').get('value');
					}
					if(emailId !== "") {
				
						m.xhrPost( {
							url : m.getServletURL("/screen/AjaxScreen/action/ValidateEmailAddress"),
							handleAs 	: "json",
							sync 		: true,
							content : {
								email : emailId	
							},
							load : _setEmailIdfieldStatus
						});
					}
				},
				
				
				/**
				 * <h4>Summary:</h4>
				 *   Validates the data entered as the Base Date.
				 *   <h4>Description:</h4> 
				 *   Its checks for the following scenarios 
				 *   The Base Date should not be after the system date.",
				 *   @method validateBaseDateWithCurrentSystemDate
				 *   @return {boolean}
				 *    True if date is valid otherwise false
				 */
				validateBaseDateWithCurrentSystemDate : function() {
					//  summary:
				    //        Validates the data entered as the Base Date.
				    // 
				   
					// This validation is for non-required fields
					if(!this.get("value")) {
						return true;
					}

					console.debug("[misys.validation.common] Validating Base Date. Value = ",
							this.get("value"));
					
					// Test that the expiry date is smaller than or equal to the current date
					var baseDate = this.get("value");
					
					var days = validateBusinessDate(this);
					if(days > 0)
					{
					console.debug("[misys.validation.common] Days difference between base date and current date = ", days);
						this.invalidMessage = m.getLocalization("baseDateGreaterThanSystemDateError",[
						                                               						         _localizeDisplayDate(this)
						                                               								]);
						return false;
					}	
									
					return true;
				}, 
				
				/**
				 * <h4>Summary:</h4>
				 *   Validates the data entered as the Base Date.
				 *   <h4>Description:</h4> 
				 *   Its checks for the following scenarios 
				 *   The Maturity Date should not be less the system date.",
				 *   @method validateMaturityDateWithSystemDate
				 *   @return {boolean}
				 *    True if date is valid otherwise false
				 */
				validateMaturityDateWithSystemDate : function() {
					//  summary:
				    //        Validates the data entered as the Maturity Date.
				    // 
				   
					// This validation is for non-required fields
					if(!this.get("value")) {
						return true;
					}

					console.debug("[misys.validation.common] Validating Base Date. Value = ",
							this.get("value"));
					
					// Test that the maturity date is smaller than or equal to the Business date
					var maturityDate = this.get("value");
					var days = validateBusinessDate(this);
								
					if(days < 0)
					{
						console.debug("[misys.validation.common] Days difference between base date and current date = ", days);
						this.invalidMessage = m.getLocalization("maturityDateLessThanSystemDateError",[_localizeDisplayDate(this)]);
						return false;
					}
					
					return true;
				}, 
				
				validateOffset : function(offsetField)
				{
					
					if(offsetField == Math.floor(offsetField))
						{
						return true;
						}
					else
						{
						return false;
						}
				},
				
				/**
				 * <h4>Summary:</h4>
				 * sets the maxlines to bo comment filed as 250 and checks for hyphen validation
				 * <h4>Description:</h4> 
				 * if the initial character is hyphen (_), error state is returned 
				 */
				
				bofunction : function() {
					
					//hyphen validation
					var boComment = dj.byId('bo_comment');
					if(boComment.get("value").charAt(0) == "-")
					{	
						this.invalidMessage = m.getLocalization("hyphenError");
						 return false;
					}
					if(this.rowCount >= this.maxSize){
						this.invalidMessage  = misys.getLocalization('textareaLinesError', [this.maxSize, this.rowCount+1]);
            			return false;
            		} 
					return  true;
					
				},
					getUnitMesureLocalization : function(rowIndex,item){
						console.debug('[m.UniteMesureLocalization]');
						var value = "";
						if(item)
						{
							var unity = item.qty_unit_measr_label[0];
							value = unity;
						}
						return value;
					},
		
					validateMandatoryRemarks : function() {
						var bank_name_field	=	dj.byId("issuing_bank_abbv_name"),
						payment_type_field	=	dj.byId("sub_product_code"),
						credit_currency_field	= 	dj.byId("ft_cur_code"),
						debit_currency_field = dj.byId("applicant_act_cur_code");

						var valid = false;

						m.xhrPost({
							url 		: misys.getServletURL("/screen/AjaxScreen/action/ValidateMandatoryRemarks") ,
							handleAs 	: "json",
							sync 		: true,
							content 	: { bank_name : bank_name_field.get("value"), 
								payment_type : payment_type_field.get("value"), 
								credit_currency: credit_currency_field.get("value") ,
								debit_currency: debit_currency_field.get("value")},
								load : function(response, args)
								{
									var a ="";
									switch (response.items.StatusCode)
									{

									case "OK":

										var indicator_field = response.items.mandatoryIndicator ;
										var credit_curr = response.items.credCur ;
										var debit_cur = response.items.debCur ;
										if(indicator_field && credit_curr && debit_cur){	

											if (indicator_field === "Y" || indicator_field ==="y")
											{

												dj.byId("free_format_text").set("required",true);

												if(document.getElementById('mandatorySpan') == undefined)
												{
													var mandatory = dojo.create('span' ,{'id':'mandatorySpan' , 'class' : 'required-field-symbol' ,'innerHTML' : '*' });
													d.parser.parse(mandatory);
													dojo.place(mandatory , dojo.byId('free_format_text') , "before");
													valid = true;
												}
												else
												{
													a = document.getElementById('mandatorySpan');
													a.setAttribute("style","display:inline-block");							
												}

											}

										}	
										else{

											dj.byId("free_format_text").set("required",false);
											if(document.getElementById('mandatorySpan'))
											{
												a = document.getElementById('mandatorySpan');
												a.setAttribute("style","display:none");
											}
										}
										break;
									default: break;
									}
								},
								error : function(response, args) 
								{
									console.error(failedMandatoryField);
									console.error(response);
								}
						});

						return valid;
					},


					// FD 6 for paymentDetailsBeneficiary MT103  
					MT103DetailsBeneficiary : function() {
						console.log("inside the MT103DetailsBeneficiary :: ");
						var bank_name_field	=	dj.byId("issuing_bank_abbv_name"),
						payment_type_field	=	dj.byId("sub_product_code"),
						credit_currency_field	= 	dj.byId("ft_cur_code"),
						debit_currency_field = dj.byId("applicant_act_cur_code");


						var valid = false;

						m.xhrPost({
							url 		: misys.getServletURL("/screen/AjaxScreen/action/ValidateMandatoryRemarks") ,
							handleAs 	: "json",
							sync 		: true,
							content 	: { bank_name : bank_name_field.get("value"), 
								payment_type : payment_type_field.get("value"), 
								credit_currency: credit_currency_field.get("value") ,
								debit_currency: debit_currency_field.get("value")},
								load : function(response, args)
								{
									var a= "";
									switch (response.items.StatusCode)
									{
									case "OK":

										var indicator_field = response.items.mandatoryIndicator ;

										if (indicator_field) {
											if (indicator_field === "Y" || indicator_field ==="y")
											{

												console.log("inside MT103DetailsBeneficiary indicator_field"+indicator_field);
												dj.byId("payment_details_to_beneficiary").set("required",true);

												m.toggleRequired("payment_details_to_beneficiary", true);


											}

										}	
										else{
											console.log("inside else of MT103DetailsBeneficiary indicator_field"+indicator_field);
											dj.byId("payment_details_to_beneficiary").set("required",false);

											m.toggleRequired("payment_details_to_beneficiary", false);

										}


										break;
									default: break;
									}
								},
								error : function(response, args) 
								{
									console.error(failedMandatoryField);
									console.error(response);
								}
						});

						return valid;
					},


					//FDS 13.7.2
					// Below function checks for the remittance reason mandatory
					validateRemittanceReasonCode : function(){

						var bank_name_field =       dj.byId("issuing_bank_abbv_name"),
						bene_currency_field =          dj.byId("ft_cur_code");
						var valid               = false;

						m.xhrPost({
							url          : misys.getServletURL("/screen/AjaxScreen/action/ValidateRemittanceReasonCode") ,
							handleAs     : "json",
							sync         : true,
							content      : { 
								bank_name : bank_name_field.get("value"), 
								bene_currency: bene_currency_field.get("value")},

								load : function(response, args)
								{
									switch (response.items.StatusCode)
									{
									case "OK":

										var indicator_field = response.items.mandatoryIndicator ;
										valid = true;


										if (indicator_field) {
											if (indicator_field === "Y" || indicator_field ==="y")
											{
												m.toggleRequired("remittance_description", true);	   
											}                                                
										}      
										else{
											m.toggleRequired("remittance_description", false);		
										}
										break;
									default: break;
									}
								},
								error : function(response, args) 
								{
									console.error(failedMandatoryField);
									console.error(response);
								}
						});

						return valid;

					},


					// 9.2	and 9.1 Intermediary Detail Mandatory check and 9.1	Valid Country Code per Transaction Currency FDs
					MT103ValidCountryCode : function() {
						console.log("inside the MT103ValidCountryCode:: ");
						var bank_name_field	=	dj.byId("issuing_bank_abbv_name"),
						currency_code_field	= 	dj.byId("ft_cur_code"),//  ft_cur_code
						country_code_field = dj.byId("cpty_bank_country");

						if(country_code_field.get("value") === "")
						{
							return true;
						}
						var valid = false;

						m.xhrPost({
							url 		: misys.getServletURL("/screen/AjaxScreen/action/ValidateCountryCode") ,
							handleAs 	: "json",
							sync 		: true,
							content 	: { bank_name : bank_name_field.get("value"), 
								currency_code: currency_code_field.get("value") ,
								country_code: country_code_field.get("value")},
								load : function(response, args)
								{
									var a= "";
									switch (response.items.StatusCode)
									{
									case "Mandatory":

										var indicator_field = response.items.mandatoryIndicator ;
										var countrycode = response.items.countryCode;
										valid = true;
										if (indicator_field && countrycode ) {
											if (indicator_field === "Y" || indicator_field ==="y")
											{
												m.toggleRequired("intermediary_bank_swift_bic_code", true);
												m.toggleRequired("intermediary_bank_name", true);
												m.toggleRequired("intermediary_bank_address_line_1", true);
												m.toggleRequired("intermediary_bank_country", true);

											}

										}

										else{
											m.toggleRequired("intermediary_bank_swift_bic_code", false);	
											m.toggleRequired("intermediary_bank_name", false);
											m.toggleRequired("intermediary_bank_address_line_1", false);
											m.toggleRequired("intermediary_bank_country", false);
										
										}


										break;
									case "NotMandatory" : 
										m.toggleRequired("intermediary_bank_swift_bic_code", false);
										m.toggleRequired("intermediary_bank_name", false);
										m.toggleRequired("intermediary_bank_address_line_1", false);
										m.toggleRequired("intermediary_bank_country", false);

										break;

									default: 

										break;
									}
								},
								error : function(response, args) 
								{
									console.error(failedMandatoryField);
									console.error(response);
								}
						});

						return valid;
					},


					// 9.3	Intermediary Detail Mandatory check and 9.1	Valid Country Code per Transaction Currency 
					MT103Intermediarydetailvalidation : function() {
						if(!misys._config.mt103_intermediary_details)
						{
							return true;
						}
						var bank_name_field	=	dj.byId("issuing_bank_abbv_name"),
						currency_code_field	= 	dj.byId("ft_cur_code"),
						country_code_field = dj.byId("intermediary_bank_country"),
						displayMessage = '';

						var valid = true;

						m.xhrPost({
							url 		: misys.getServletURL("/screen/AjaxScreen/action/IntermediaryDetailValidation") ,
							handleAs 	: "json",
							sync 		: true,
							content 	: { bank_name : bank_name_field.get("value"), 
								currency_code: currency_code_field.get("value") ,
								country_code: country_code_field.get("value")},
								load : function(response, args)
								{
									var a= "";
									switch (response.items.StatusCode)
									{
									case "Mandatory":

										var indicator_field = response.items.mandatoryIndicator ;
										var countrycode = response.items.countryCode;
										valid = false;
										if (indicator_field && countrycode ) {
											if (indicator_field === "Y" || indicator_field ==="y")
												{
													displayMessage = country_code_field.value+": is not valid Country Code";
													country_code_field.set("state", "Error");
													m.dialog.show("ERROR", displayMessage);
												}
											}
											else {
											m.toggleRequired("intermediary_bank_country", false);
											valid = true;
											}
										break;
									case "NotMandatory" : 
											m.toggleRequired("intermediary_bank_country", false);
											valid = true;
										break;

									default: 

										break;
									}
								},
								error : function(response, args) 
								{
									console.error(failedMandatoryField);
									console.error(response);
								}
						});

						return valid;
					},
					
					_validateCurrencyCode : function(product_code_field, account_cur_code_field) 
					{
						   var productTypeStr =product_code_field ? product_code_field.get("value") : '';
						   var account_cur_code = account_cur_code_field ? account_cur_code_field.get("value") : '';
						   var displayMessage = "";
						   var valid = true;
						   		if(account_cur_code != "")
						   			{
									m.xhrPost( {
										url : m.getServletURL("/screen/AjaxScreen/action/ValidateCurrencyValid"),
										handleAs 	: "json",
										sync 		: true,
										content : {
											subproductcode : productTypeStr,
											transferCurCode : account_cur_code
											
										},
										load : function(response, args)
										{
											var isValid = response.isValid;
											if(!isValid)
												{
												 
												displayMessage = m.getLocalization("invalidCurrencyConfigured", [account_cur_code_field.get("value")]);
												account_cur_code_field.set("state", "Error");
												dj.showTooltip(displayMessage,account_cur_code_field.domNode, 0);
												valid = false;
												return valid;
												}
											
											
										}
									});
									
						   				}
						   		return valid;
					},
					
					/**
					 * <h4>Summary:</h4>  This method validates the document amount with lc amount.
					 * <h4>Description</h4> : This method validates the document amount or transaction amount with LC amount.
					 * Validation - The document amount should be less than the LC amount else an error will be thrown.
					 *
					 * @method validateDocumentAmtAndLCAmt
					 */
					validateDocumentAmtAndLCAmt : function() {
					
						var nonAmendmentTransaction = dj.byId("prod_stat_code") && !(dj.byId("prod_stat_code").get("value")==="08" || dj.byId("prod_stat_code").get("value")==="31");
						if(nonAmendmentTransaction)
						{
							var orgLcLiabAmt = dojo.number.parse(dj.byId("org_lc_liab_amt").getValue());
							if(dj.byId("tnx_amt"))
							{
								var tnxAmt = dj.byId("tnx_amt").getValue();
								if(isNaN(tnxAmt))
								{
									return true;
								}
								if((tnxAmt > 0) && (tnxAmt > orgLcLiabAmt))
								{
									console.debug("validateDocumentAmtOnLCAmt : Document amount is greater than the LC amount.");
									 if(dj.byId("prod_stat_code").get("value") == '12') {
										 var language = document.documentElement.getAttribute("lang");
										 var tnxAmtValue = dojo.currency.format(parseFloat(tnxAmt));
										 var liabAmtValue = dojo.currency.format(parseFloat(orgLcLiabAmt));
										 var displayWarningMessage  = m.getLocalization("documentAmtGreaterthanLiabilityAmt",[ dj.byId("lc_cur_code").getValue(),tnxAmtValue,liabAmtValue ]);
										 if(language==="ar")
										 {
										    m.showTooltip(displayWarningMessage, dj.byId("tnx_amt").domNode, ['before']);	 
										 }
										 else{
									 	 m.showTooltip(displayWarningMessage, dj.byId("tnx_amt").domNode, ['after']);
										 }		 
										 return true;
									 }
									 else{
									 var displayMessage = m.getLocalization("documentAmtGreaterThanLCAmt",[ dj.byId("lc_cur_code").getValue(), tnxAmt, orgLcLiabAmt ]);
									dj.byId("tnx_amt").set("state","Error");
								    dj.byId("tnx_amt").set("value", "");
							 		dj.hideTooltip(dj.byId("tnx_amt").domNode);				
							 	    dj.showTooltip(displayMessage, dj.byId("tnx_amt").domNode, 100);
							 		dj.byId("tnx_amt").invalidMessage = displayMessage;
							 		m._config.onSubmitErrorMsg =  displayMessage;
									return false;
									 }
								}
							}
						}			
						return true;
						
					}
	});
})(dojo, dijit, misys);
//Including the client specific implementation
       dojo.require('misys.client.validation.common_client');