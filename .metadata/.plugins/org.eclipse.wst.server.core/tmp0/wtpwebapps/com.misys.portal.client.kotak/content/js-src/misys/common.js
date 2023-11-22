var originalOperationValue="";
var consoleMSG ='widget invalid: ';
var attachmntFile="attachment-file";
var tabContainr=".tabcontainer";
var colbortionWindow='#collaborationWindow';
var ariaDescrib='aria-describedby';
var langMenu='#languagesMenu .dijitReset.dijitStretch.dijitButtonContents.dijitDownArrowButton';
var bookmrkMenu='#bookmarkMenu .dijitReset.dijitStretch.dijitButtonContents.dijitDownArrowButton';
var popuMenuItem=".dijitReset.dijitInline.dijitMenuItem.dijitMenuItemLabel.portalPopupMenuBarItem";
var h1portletTitle="h1.portlet-title";
var h2portletTitle="h2.portlet-title";
var homepagePortlet=".homepage .portlet";
var inlneBlock='inline-block';
var prductCode="&productcode=";
var refrnceId="&referenceid=";
var entitlementCod="&entitlementcode=";
var entitlementDescp="&entitlementdescription=";
var scrhCrieteria='#searchCriteria > div > p';
var GTPRootPotlet="#GTPRootPortlet > div.portlet-section-header.portlet-font > h1";
var reportingPopup ="/screen/ReportingPopup";
var footerHtml = 'footerHtml';

dojo.provide("misys.common");
dojo.require("misys.grid._base");
dojo.require("misys.widget.Bookmark");
dojo.require("misys.binding.SessionTimer");
dojo.require("dojox.html.entities");
dojo.require("dojox.fx.scroll");
dojo.require("dojox.NodeList.delegate");
dojo.require("dijit.Editor");
dojo.require("dijit.layout.TabContainer");
dojo.require("misys.form.SimpleTextarea");
dojo.require("dijit.form.MultiSelect");
dojo.require("dijit.form.Form");
dojo.require("dojo.data.ItemFileReadStore");
dojo.require("misys.binding.AsyncMessage");
dojo.require("dojox.lang.aspect");
dojo.require("dojox.collections.ArrayList");
dojo.require("dojo.io.iframe");
dojo.require("dojo.NodeList-traverse");
// Copyright (c) 2000-2011 Misys (http://www.misys.com),
// All Rights Reserved. 
//
// summary: 
//    Library of commonly-used security-sensitive JavaScript functions
//
// description:
//    JavaScript functions used across the application, for all secured
//    pages only. This file shouldn't be loaded in a non-secured 
//    session (that's what _base.js is for).
//
//	  This will always be loaded into the page for every authorised session
//    (consult DefaultGTPLayout.java for details) so there is no need to dojo.require this
//	  file.
//
//	  It contains functions that live under the following categories
//		1. Setup functions for page services (topic subscriptions, grids, etc.)
//		2. Common onLoad events for all secured pages. This startup is called for all
//         pages, even those without forms. Hence we include empty functions that
//		   are later defined in misys.forms.common
//      3. Anything needed to get a basic form working with MTP. The functions in 
//		   misys.common decorate such forms with the more complicated functionality
//		   required for product forms.
//
//	  Note that we assume throughout that misys._base has already been loaded (which is
//	  always the case, otherwise there's a problem)
//
//   version:   1.2
//   date:      24/03/2011
//   author:    Cormac Flynn

/**
 * <h4>Summary:</h4>
 *   Library of commonly-used security-sensitive JavaScript functions
 *   JavaScript functions that re  used across the application, for all secured
 *    pages. This file shouldn't be loaded in a non-secured
 *    session (that's what _base.js is for).
 *    This will always be loaded into the page for every authorised session
 *    (consult DefaultGTPLayout.java for details) so there is no need to dojo.require this
 *    file.
 *    
 *    <h4>Description:</h4> 
 *    It contains functions that live under the following categories
 *    1. Setup functions for page services (topic subscriptions, grids, etc.)
 *    2. Common onLoad events for all secured pages. This startup is called for all
 *    pages, even those without forms. Hence we include empty functions that
 *    are later defined in misys.forms.common
 *   3. Anything needed to get a basic form working with MTP. The functions in
 *    misys.common decorate such forms with the more complicated functionality
 *     required for product forms.
 *     
 *     Note that we assume throughout that misys._base has already been loaded (which is
 *     always the case, otherwise there's a problem)
 * @class common
 */

dojo.extend(dijit.Editor, {
	// summary:
	//	 Extend the dijit.Editor prototype to include a toXML method
	// <h4>Description:</h4> 
	//	 We need to escape the Editor content as it will form part of an XML string. Moreover, 
	//	 we wish to avoid logic in commonly used code below, that relied on testing 
	//   the value of declaredClass.
	/**
	 * <h4>Summary:</h4>
	 *  Extend the dijit.Editor prototype to include a toXML method
	 *  <h4>Description:</h4> 
	 *  We need to escape the Editor content as it will form part of an XML string.
	 *  @method toXML
	 * 
	 */
	toXML : function() {
		// Firefox4 inserts garbage into an empty editor, for some reason
		var value = this.get("value").replace("<br _moz_editor_bogus_node=\"TRUE\" />", "");
		value = dojo.trim(value);
		return value !== "" ? 
				"<![CDATA[" + dojo.trim(dojox.html.entities.encode(value,
						dojox.html.entities.html)) + "]]>" : "";
	}
});

dojo.extend(misys.form.SimpleTextarea, {
	// summary:
	//	 Extend the misys.form.SimpleTextarea prototype to include a toXML method
	// description:
	//	 We need to escape the misys.form.SimpleTextarea as it will form part of an XML string.  
	
	toXML : function() 
	{
		var value = this.get("value");
		value = dojo.trim(value);
		return value !== "" ? "<![CDATA[" + dojo.trim(value) + "]]>" : "";
		
	}
});

dojo.extend(dijit.form.MultiSelect, {
	// <h4>Summary:</h4>
	//	 Extend the dijit.form.MultiSelect _getValueAttr method so it returns all options
	// description:
	//	 By default, the a call to .get("value") on a MultiSelect will return only selected
	//	 options. In our use case, we want to return all options, selected or otherwise
	
	_getValueAttr: function(){
		return dojo.query("option", this.containerNode).map(function(n){
			return n.value;
		});
	}
});

function getErrorSection() {

	var counter = 0,counter1 = 0;
	var jsonArray = [];
	misys._config = misys._config || {};
		 dojo.query(".toplevel-header").forEach(function(parentTag){
	 		 var child;
	 		 var i;
	 		 var headerText;
	 		
				var childs = parentTag.childNodes;
				for (i = 0; i < childs.length; i++) { 
					child = childs[i];
						if(child.className === "toc-item")
						{
							headerText = child.firstChild.innerHTML;
						}
						else if(child.className === "fieldset-content")
						{
							var jsonWidgetArray = [];
							dojo.forEach(child.querySelectorAll('*'), function(div){
								console.debug(consoleMSG + div);
								var widget = dijit.byId(div.id);
								if(widget)
									{
										widget._hasBeenBlurred = true;
										var valid = widget.disabled || !widget.validate || widget.validate();
										if (!valid) { 
											console.debug(consoleMSG + widget); 
											var jsonWidgetObj = {"widget": widget };
											var widgetType = widget.declaredClass;
											
											jsonWidgetArray.push(jsonWidgetObj);
										}
									}
								});
						}
						if(headerText && jsonWidgetArray && jsonWidgetArray.length > 0)
						{
							var jsonObject = {"header": headerText, "widgetArray" : jsonWidgetArray , "child" : child};
							jsonArray.push(jsonObject);
						}
					}
		});
		/*dojo.mixin(misys._config, {				
			errorWidgetArray : jsonArray		       
		});*/
	if(jsonArray.length >0) {
		var div_elements = dojo.byId("errorContent");
		if(div_elements){
			div_elements.innerHTML = "";
			var tocRoot = dojo.create("ul");
			 dojo.forEach(jsonArray, function(errorMap) {
				errorMap.child.id = "mylink" + counter1++;
				var headerId = "mylink" + counter++;
				var li = dojo.create("li");
				var a = dojo.create("a", {
				href: "#" + headerId,
				id: "goto_" + headerId,
				innerHTML: errorMap.header
			}, li);
				dojo.place(li, tocRoot);
			    
			});
			dojo.empty(div_elements);
			dojo.style(dojo.byId("errorSection"),"display","block");
		dojo.place(tocRoot, div_elements);
		}
	}
	else
	{
	if(dojo.byId("errorSection"))
		{
		dojo.style(dojo.byId("errorSection"),"display","none");
		}
	}

}



dojo.extend(dijit.form.Form, {
	/**
	 * <h4>Summary:</h4>
	 * Returns if the form is valid - same as isValid - but
	 * provides a few additional (ui-specific) features.
	 * 1 - it will highlight any sub-widgets that are not
	 * valid
	 * 2 - it will call focus() on the first invalid
	 * sub-widget
	 * We override this standard function as it currently does not deal with
	 * fields that are in closed tabs. Moreover, we add a little smooth
	 * scrolling for browsers that can handle it.
	 * @method validate
	 */
	validate: function(){
		// summary:
		//		returns if the form is valid - same as isValid - but
		//		provides a few additional (ui-specific) features.
		//		1 - it will highlight any sub-widgets that are not
		//			valid
		//		2 - it will call focus() on the first invalid
		//			sub-widget

		// We override this standard function as it currently does not deal with
		// fields that are in closed tabs. Moreover, we add a little smooth
		// scrolling for browsers that can handle it.
		
		var didFocus = false;
	
		misys._config = misys._config || {};
		
		return dojo.every(dojo.map(this.getDescendants(), function(widget){
			// Need to set this so that "required" widgets get their
			// state set.
			widget._hasBeenBlurred = true;
			var valid = widget.disabled || !widget.validate || widget.validate();
			
			if (!valid) { 
				console.debug(consoleMSG + widget); 
			}
			
			if(!valid && !didFocus){
				// Set focus of the first non-valid widget
				
				// If the field is in a tabcontainer, select the correct tab
				if(widget.hasOwnProperty("parentTab")) {
					dijit.byId(widget.get("tabContainer")).selectChild(widget.get("parentTab"));
				}

				// Some validating elements are not focusable (GridMultipleItems, for example)
				// and so the .focus() method is not always available.
				var focusFnc = widget.focus || function(){};
				
				if(dojo.isIE <= 6 || misys._config.popupType) {
					dojo.window.scrollIntoView(widget.containerNode || widget.domNode);
					focusFnc();
				} else {
					dojox.fx.smoothScroll({
						node: widget.containerNode || widget.domNode, 
						win: window,
						onEnd: function() {
							focusFnc();
						}
					}).play();
				}

				didFocus = true;
			}
 			return valid;
 		}), function(item){ return item; });
	}
});

(function(/*Dojo*/ d, /*Dijit*/ dj, /*Misys*/ m) {

	"use strict"; // ECMA5 Strict Mode
	
	// Private functions and variables
	
	var 
		// Selector for forms that we wish to be validated upon submission
		_formToValidateSelector = ".validate",
		
		// The ID of the form that is actually submitted to the server
		_realformID = "realform",
		
		// The ID of the container DIV that holds the hidden transaction
		// details on the bank side.
		_bankTransactionContainerID = "transactionDetails",
		
		// The ID of the file attachment widget
		_fileAttachmentsWidgetID = attachmntFile,
		
		_invoiceFileAttachmentsWidgetID = "attachment-fileinvoice",
		
		_purchaseorderFileAttachmentsWidgetID = "attachment-filepurchaseorder",
		
		_purchaseorderUploadFileAttachmentsWidgetID = "attachment-filepurchaseorderupload",
		
		// The ID of the file attachment table
		_fileAttachmentsTableID = "files_master_table",
		
		// The ID of the MT700 File attachment widget
		_mt700FileAttachmentsWidgetID = "attachment-fileOTHER",
	
		// A classname selector for fields that should be validated against the
		// SWIFT standard
		_SWIFTFieldSelector = ".swift",

		// The maximum number of textarea rows that is permitted under the
		// SWIFT standard
		_SWIFTMaxTextareaRows = 100,
		
		// The ID of a form in a popup dialog
		_popupFormId = "popup_fakeform1",
		
		// Selector for widgets which should listen to a topic
		_subscribeTopicSelector = ".subscribeTopic",
		
		// Attribute that holds as its value, the name of the topic
		_subscribeTopicAttr = "subscribe_topic",
		
		// Class to highlight the title of active tabs
		_nonEmptyTabClass = "tabChangeStyle",
		
		// Selector for tab containers
		_tabContainerSelector = tabContainr,
	
		// Selector for grids
		_gridClassSelector = ".dojoxGrid",

		// The id of the search form on list pages (it is always the same)
		_transactionSearchFormId = "TransactionSearchForm",
		
		// The id of the "export" button in list pages
		_exportListFieldId = "export_list",
		
		// The id of the "file" button in list pages
		_filenameFieldId = "filename",
		
		// The container DIV that holds the floating collaboration pane
		_collaborationWindowContainerId = "collaborationWindowContainer",

		// Classname selector for a page element that should be added to the Table of Contents (TOC)
		_tocItemSelector = ".toc-item",
		
		// The default timeout for tooltips
		_defaultTooltipTimeout = 5000, //ms
		
		// Selector for charts in the page
		_chartSelector = ".chartImg",
		
		// Default dimensions for a chart
		_defaultChartHeight = "400px",
		_defaultChartInDialogHeight = "600",
		_defaultChartInDialogWidth = "800",
		
		// utility vars for chart display
		_defaultResizeTimeout = 500,
		_resizeGridTimeoutHandle,
		_resizeChartTimeoutHandle,
		_chartDialog,
		_lastWidth;
	
/**
 * <h4>Summary:</h4>
 *  Submit the transaction.
 *  <h4>Description:</h4> 
 *  Note that this behaves slightly differently in debug mode - we generate the XML
 *  twice, the first time just for outputting to the console. So you can click submit
 *  to submit the transaction, dismiss the confirmation dialog and the XML will be in
 *  the console.
 *  
 *  Upon submit, the following validations are performed in the following order
 *  1. _validateForms (basic validation that all the fields have valid input)
 *  2. _validateSWIFTFields (If SWIFT validation was selected, we check that all
 *  fields with the class swift, have valid input)
 *  3. misys.doPreSubmitValidations (This method is overridden in the form binding,
 *  and performs form-specific validations, if there are any).
 *  As you can see we are passing type of event or submission in the method ,
 *  Depending upon the type different validation are happening.
 *  @param {String} type
 *   Type of the submission like "Save,Submit,System submit"
 *  @method _submit
 */
	function _submit( /*String*/ type) {
		//  summary:
	    //        Submit the transaction.
	    //  description:
		//        Note that this behaves slightly differently in debug mode - we generate the XML 
		//        twice, the first time just for outputting to the console. So you can click submit 
		//        to submit the transaction, dismiss the confirmation dialog and the XML will be in 
		//        the console.
		//
		//        Upon submit, the following validations are performed in the following order
		//        1. _validateForms (basic validation that all the fields have valid input)
	    //        2. _validateSWIFTFields (If SWIFT validation was selected, we check that all 
		//        fields with the class swift, have valid input)
	    //        3. misys.doPreSubmitValidations (This method is overridden in the form binding, 
		//           and performs form-specific validations, if there are any).
		var validations = [function(){return true;}],
		    operation = type,
		    progressMessage,
		    onErrorCallback,
		    errorMessage,
		    returnComments,
		    rejectComments,
		    freeFormatText,
		    freeFormatComments;

		switch(type){
		 case "VALIDATE":
			 validations.push(misys.validateSummitTransaction);
			 progressMessage = m.getLocalization("validatingTransactionMessage");
			break;
		 case "SAVE":
			 validations.push(_validateSWIFTFields,m.beforeSaveValidations);
			 if(m.client && m.client.beforeSaveValidations) {
				 validations.push(m.client.beforeSaveValidations);
			 }
			 errorMessage = m.getLocalization("mandatoryEntityMessage");
			 var productCode = dj.byId("product_code") ? dj.byId('product_code').get('value') : null;
			 // MPS-52317
			 // If the currency code is invalid, the form should be saved and the value should be cleared off
			 if(productCode !== null)
			 {
				 var productCurrencyCodeWidget = dj.byId(productCode.toLowerCase()+"_cur_code");
			 }	 
			 var productCurrencyCodeValue = productCurrencyCodeWidget ? productCurrencyCodeWidget.get("value") : "";
			 if(productCurrencyCodeWidget && productCurrencyCodeValue !== "" && productCurrencyCodeWidget.state === "Error")
			 {
				 productCurrencyCodeWidget.set("value", "");
			 }
			 
			 progressMessage = m.getLocalization("savingTransactionMessage");
			 onErrorCallback = function(){
				 dijit.byId("entity")?dijit.byId("entity").focus():null;
				// If the error was a SWIFT error
				 if(misys._config.swiftError && misys._config.swiftError.length !== 0) {
				         for(var i in misys._config.swiftError){
			                  var swiftErrorField = dijit.byId(m._config.swiftError[i]);
			                  swiftErrorField.set("state","Error");
			                  swiftErrorField._setStateClass();
			                  dj.setWaiState(swiftErrorField.focusNode, "invalid", "true");
			                }
			                  //Scroll to the first field which is in error.
		                 swiftErrorField = dijit.byId(m._config.swiftError[0]);
		                 // If the field is in a tabcontainer, select the correct tab 
		                  if(swiftErrorField.hasOwnProperty("parentTab")) {
		                  dj.byId(swiftErrorField.get("tabContainer")).selectChild(swiftErrorField.get("parentTab"));
		                  _validateTabs();
		                  }
		                  dojox.fx.smoothScroll({
	                         node: swiftErrorField.containerNode || swiftErrorField.domNode, 
	                         win: window
		                   }).play();
				  } 
			 };
			break;
		 case "ADD_BULK":
			 validations.push(_validateSWIFTFields, _validateForms, m.beforeSubmitValidations);
			 if(m.client && m.client.beforeSubmitValidations) {
				 validations.push(m.client.beforeSubmitValidations);
			 }
			 errorMessage = m.getLocalization("mandatoryFieldsToSubmitError");
			 progressMessage = m.getLocalization("validatingAndSubmittingMessage");
			 onErrorCallback = function(){
				 // Open hidden details, if present
				 if(d.byId(_bankTransactionContainerID)) {
					 m.toggleTransaction(true, false, function(){
						_validateForms(true);	
					 });
				 } else {
					 _validateForms(true);
				 }
				 
				// If the error was a SWIFT error
				 if(misys._config.swiftError && misys._config.swiftError.length !== 0) {
						for(var i in misys._config.swiftError){
							 var swiftErrorField = dijit.byId(m._config.swiftError[i]);
							 swiftErrorField.set("state","Error");
							 swiftErrorField._setStateClass();
							 dj.setWaiState(swiftErrorField.focusNode, "invalid", "true");
							 }
							 //Scroll to the first field which is in error.
							swiftErrorField = dijit.byId(m._config.swiftError[0]);
							 dojox.fx.smoothScroll({
									node: swiftErrorField.containerNode || swiftErrorField.domNode, 
									win: window
							  }).play();
						 } 
			 };
			 break; 
		 case "UPDATE_BULK":	 
			 validations.push(_validateSWIFTFields, _validateForms, m.beforeSubmitValidations);
			 // Hook for client specific beforeSubmit validations
			 if(m.client && m.client.beforeSubmitValidations) {
				 validations.push(m.client.beforeSubmitValidations);
			 }
			 errorMessage = m.getLocalization("mandatoryFieldsToSubmitError");
			 progressMessage = m.getLocalization("validatingAndSubmittingMessage");
			 onErrorCallback = function(){
				 // Open hidden details, if present
				 if(d.byId(_bankTransactionContainerID)) {
					 m.toggleTransaction(true, false, function(){
						_validateForms(true);	
					 });
				 } else {
					 _validateForms(true);
				 }
				 
				// If the error was a SWIFT error
				 if(misys._config.swiftError && misys._config.swiftError.length !== 0) {
						for(var i in misys._config.swiftError){
							 var swiftErrorField = dijit.byId(m._config.swiftError[i]);
							 swiftErrorField.set("state","Error");
							 swiftErrorField._setStateClass();
							 dj.setWaiState(swiftErrorField.focusNode, "invalid", "true");
							 }
							 //Scroll to the first field which is in error.
							swiftErrorField = dijit.byId(m._config.swiftError[0]);
							 dojox.fx.smoothScroll({
									node: swiftErrorField.containerNode || swiftErrorField.domNode, 
									win: window
							  }).play();
						 }  
			 };
			 break;
		 case "SYSTEM_SUBMIT":
			 operation = "SUBMIT";
			 validations.push(_validateForms, m.beforeSubmitValidations);
			 // Hook for client specific beforeSubmit validations
			 if(m.client && m.client.beforeSubmitValidations) {
				 validations.push(m.client.beforeSubmitValidations);
			 }
			 errorMessage = m.getLocalization("mandatoryFieldsToSubmitError");
			 progressMessage = m.getLocalization("validatingAndSubmittingMessage");
			 onErrorCallback = function(){
				 setTimeout(function(){_validateForms(true);}, dj.defaultDuration);
			 };
			break;
		 case "SUBMIT":
			 validations.push(_validateSWIFTFields, _validateForms, _validateFileAct, m.beforeSubmitValidations);
			 // Hook for client specific beforeSubmit validations
			 if(m.client && m.client.beforeSubmitValidations) {
				 validations.push(m.client.beforeSubmitValidations);
			 }
			 errorMessage = m.getLocalization("mandatoryFieldsToSubmitError");
			 progressMessage = m.getLocalization("validatingAndSubmittingMessage");
			 if(dj.byId("return_comments"))
			{	
				 dj.byId("return_comments").set("required",false);	
			}
			 getErrorSection();
			 onErrorCallback = function(){
				 
				 //form to be validated in every case
				 _validateForms(true);
	 
				// If the error was a SWIFT error
				 if(misys._config.swiftError && misys._config.swiftError.length !== 0) {
						for(var i in misys._config.swiftError){
							 var swiftErrorField = dijit.byId(m._config.swiftError[i]);
							 swiftErrorField.set("state","Error");
							 swiftErrorField._setStateClass();
							 dj.setWaiState(swiftErrorField.focusNode, "invalid", "true");
							 }
							 //Scroll to the first field which is in error.
							swiftErrorField = dijit.byId(m._config.swiftError[0]);
							 // If the field is in a tabcontainer, select the correct tab 
			                  if(swiftErrorField.hasOwnProperty("parentTab")) {
			                  dj.byId(swiftErrorField.get("tabContainer")).selectChild(swiftErrorField.get("parentTab"));
			                  _validateTabs();
			                  }			                  
			               // Open hidden details, if present, sending scroll function for swift validation as callback
			               //to avoid mix up of synchronous and asynchronous calls
			                  if(d.byId(_bankTransactionContainerID)){
			 					 m.toggleTransaction(true, false, function(){
			 						dojox.fx.smoothScroll({
										node: swiftErrorField.containerNode || swiftErrorField.domNode, 
										win: window
								  }).play();
			 					 }); 
			                  }
		 					 else {
		 						dojox.fx.smoothScroll({
									node: swiftErrorField.containerNode || swiftErrorField.domNode, 
									win: window
							  }).play();
		 					 }
						 } 
			 };
			break;
		 case "SAVE_TEMPLATE":
			 var templateId = dj.byId("template_id"),
			 templateIdVal = templateId.get("value");
			 if(templateIdVal.indexOf("<")!==-1) {
				 templateIdVal = templateIdVal.replaceAll("<", "&lt;");
			 }
			if (misys._config.isMultiBank)
			{
				var bkTypeField = dj.byId("bk_type");
				var bkTypeHiddenField = dj.byId("bk_type_hidden");
				var payrollTypeField = dj.byId("payroll_type");
				var payrollHiddenField = dj.byId("payroll_type_hidden");
				if (bkTypeField && bkTypeField.get("value") === "" && bkTypeHiddenField && bkTypeHiddenField.get("value") !== "")
				{
					bkTypeField.set("value", bkTypeHiddenField.get("value"));
				}
				if (payrollTypeField && payrollTypeField.get("value") === "" && payrollHiddenField && payrollHiddenField.get("value") !== "")
				{
					payrollTypeField.set("value", payrollHiddenField.get("value"));
				}
			}
			 progressMessage = m.getLocalization("savingTemplateMessage", 
					 				[templateIdVal]);
			 errorMessage = m.getLocalization("mandatoryTemplateFieldError");
			 validations.push(
				 function(){
					if(templateId.get("value") === "")  {
						errorMessage = m.getLocalization("mandatoryTemplateFieldError");
						return false;
					}
					/*else {
						var invalidCharacters = "\\'`",
						isValid = d.every(templateId.get("value"), function(theChar) {
							return (invalidCharacters.indexOf(theChar) < 0) ? true : false;
						});
						if(!isValid ) {
							errorMessage = m.getLocalization("focusOnErrorAlert");
							return false;
						}
					}*/
					return true;
				 }
			 );
			 onErrorCallback = function(){
				 templateId.focus();
			 };
			break;
		 case "SAVE_REPORT_TEMPLATE":
			 operation = "SAVE_TEMPLATE";
		     validations.push(_validateForms);
		     errorMessage = m.getLocalization("mandatoryFieldsToSubmitError");
			 progressMessage = m.getLocalization("validatingAndSubmittingMessage");
		     onErrorCallback = function(){
				setTimeout(function(){_validateForms(true);}, dj.defaultDuration);
			 };
			 break;
		 case "CANCEL":
			document.location.href = m.onCancelNavigation();
			return;
			break;
		case "CANCEL_BULK_TRANSACTION":					
			var bulkReferenceId = dj.byId("ref_id").get("value");
			var bulkCancelURL = ["/screen/BulkScreen?referenceid=", bulkReferenceId, "&mode=CANCEL"];
			window.location.href = misys.getServletURL(bulkCancelURL.join(""));
			return;
			break;				
		 case "CANCEL_BULK":
			var bulkRefId = dj.byId("bulk_ref_id").get("value");
			var bulkTnxId = dj.byId("bulk_tnx_id").get("value");
			var childRefId = dj.byId("ref_id").get("value");
			var childTnxId = dj.byId("tnx_id").get("value");
			var bulkDraftURL = ["/screen/BulkScreen?referenceid=", bulkRefId, "&tnxid=", bulkTnxId, "&childrefid=", childRefId, "&childtnxid=", childTnxId, "&tnxtype=01&mode=DRAFT"];
			window.location.href = misys.getServletURL(bulkDraftURL.join(""));
			return;
			break;
		 case "RETURN":
			 returnComments = dj.byId("return_comments");
			 if(returnComments && dojo.string.trim(returnComments.get("value")) === ""){
				 returnComments.set("value", "");
				 returnComments.set("required",true);
				 if(dj.byId("fakeform1"))
				 {
					 dj.byId("fakeform1").validate();
				 }
				 errorMessage = m.getLocalization("requiredToolTip");
				 returnComments.focus();
				 return;
			 }
			 else if(returnComments && dojo.string.trim(returnComments.get("value")) !== "" ){
				 returnComments.set("value", dojo.string.trim(returnComments.get("value")));
			 }
			 break;
		 case "REJECT":
			 operation = "REJECT";
			 if(dj.byId("reject_comments"))
				{	
				 rejectComments = dj.byId("reject_comments");
					 if(rejectComments && dojo.string.trim(rejectComments.get("value")) === ""){
						 rejectComments.set("required",true);
						 errorMessage = m.getLocalization("requiredToolTip");
						 rejectComments.focus();
						 return;
					 }
				}
			 if(dj.byId("free_format_text"))
			 {
				 	freeFormatText = dj.byId("free_format_text");
				 	if(freeFormatText && dojo.string.trim(freeFormatText.get("value")) === "")
				 	{
				 		 freeFormatText.set("required",true);
						 errorMessage = m.getLocalization("requiredToolTip");
						 freeFormatText.focus();
						 return;
					}
				 	
			 }
			
			 progressMessage = m.getLocalization("rejectingTransactionMessage");
			break;
		 case "RETURN_TRANSACTION":
			 operation = "RETURN_TRANSACTION";
			 progressMessage = m.getLocalization("returningTransactionMessage");
			 returnComments = dj.byId("return_comments");
			 if(returnComments){
				 if(returnComments && returnComments.get("value") === ""){				 
					 returnComments.set("required",true);
					 dj.byId("fakeform1").validate();
					 errorMessage = m.getLocalization("requiredToolTip");
					 returnComments.focus();
					 return;
				 }
				 else
					{
						 var checkReturn = dojo.string.trim(dj.byId("return_comments").get("value"));
						 if(checkReturn === "")
						 {
							 dj.byId("return_comments").set("value", checkReturn);
							 returnComments.set("required",true);
							 dj.byId("fakeform1").validate();
							 errorMessage = m.getLocalization("requiredToolTip");
							 returnComments.focus();
							 return;
						 }
					}	 
			 }
			break;
			
		 case "AUTO_FORWARD_SUBMIT":
			 operation = "AUTO_FORWARD_SUBMIT";
			 if(m.client && m.client.beforeSubmitValidations) {
				 validations.push(m.client.beforeSubmitValidations);
			 }
			 progressMessage = m.getLocalization("submitAutoForwardMsg");
			break;
		 case "LEGAL_TEXT_SUBMIT" :
			 operation = "SUBMIT";
			 if(m.client && m.client.beforeSubmitValidations) {
				 validations.push(m.client.beforeSubmitValidations);
			 }
			 progressMessage = m.getLocalization("validatingAndSubmittingMessage");
			break; 
		 case "DRAFT":
			 operation = "DRAFT";
			 validations.push(m.beforeSaveValidations);
			 if(m.client && m.client.beforeSaveValidations) {
				 validations.push(m.client.beforeSaveValidations);
			 }
			break;
		 case "MAKER_SUBMIT":
			 operation = "SUBMIT";
			 validations.push(_validateSWIFTFields, _validateForms, m.beforeSubmitValidations);
			 if(m.client && m.client.beforeSubmitValidations) {
				 validations.push(m.client.beforeSubmitValidations);
			 }
			 errorMessage = m.getLocalization("mandatoryFieldsToSubmitError");
			 progressMessage = m.getLocalization("validatingAndSubmittingMessage");
			 onErrorCallback = function(){
				 _validateForms(true);
	 	 	 	 if(misys._config.swiftError && misys._config.swiftError.length !== 0) {
	 	 	 for(var i in misys._config.swiftError){
	 	 	 var swiftErrorField = dijit.byId(m._config.swiftError[i]);
	 	 	 swiftErrorField.set("state","Error");
	 	 	swiftErrorField._setStateClass();
	 	 	dj.setWaiState(swiftErrorField.focusNode, "invalid", "true");
	 	 	}
	 	 	 //Scroll to the first field which is in error.
	 	 	swiftErrorField = dijit.byId(m._config.swiftError[0]);
	 	 	 dojox.fx.smoothScroll({
	 	 	node: swiftErrorField.containerNode || swiftErrorField.domNode, 
	 	 	win: window
	 	 	}).play();
	 	 	} 
	 };
			break;
		 case "RESUBMIT":
			 operation = "SUBMIT";
			 progressMessage = m.getLocalization("resubmitMessage");
			break;
		 case "MAKER_BENE_FILE_UPLOAD_SUBMIT":
			 operation = "SUBMIT";
			 validations.push(_validateSWIFTFields, _validateForms, m.beforeSubmitValidations);
			 if(m.client && m.client.beforeSubmitValidations) 
			 {
				 validations.push(m.client.beforeSubmitValidations);
			 }
			 errorMessage = m.getLocalization("mandatoryFieldsToSubmitError");
			 progressMessage = m.getLocalization("validatingAndSubmittingMessage");
			 onErrorCallback = function(){
				 _validateForms(true);
	 	 	 	 if(misys._config.swiftError && misys._config.swiftError.length !== 0) 
	 	 	 	 {
	 	 	 		 for(var i in misys._config.swiftError)
	 	 	 		 {
	 	 	 			 var swiftErrorField = dijit.byId(m._config.swiftError[i]);
	 	 	 			 swiftErrorField.set("state","Error");
	 	 	 			 swiftErrorField._setStateClass();
	 	 	 			 dj.setWaiState(swiftErrorField.focusNode, "invalid", "true");
	 	 	 		 }
		 	 	 //Scroll to the first field which is in error.
	 	 	 		 swiftErrorField = dijit.byId(m._config.swiftError[0]);
	 	 	 		 dojox.fx.smoothScroll({
	 	 	 			 node: swiftErrorField.containerNode || swiftErrorField.domNode, 
	 	 	 			 win: window
	 	 	 		 	}).play();
		 	 	} 
			};
			break;
		 case "MAKER_BENE_SUBMIT":
			 operation = "SUBMIT";
			 validations.push(_validateSWIFTFields, _validateForms, m.beforeSubmitValidations);
			 if(m.client && m.client.beforeSubmitValidations) 
			 {
				 validations.push(m.client.beforeSubmitValidations);
			 }
			 errorMessage = m.getLocalization("mandatoryFieldsToSubmitError");
			 progressMessage = m.getLocalization("validatingAndSubmittingMessage");
			 onErrorCallback = function(){
				 _validateForms(true);
	 	 	 	 if(misys._config.swiftError && misys._config.swiftError.length !== 0) 
	 	 	 	 {
	 	 	 		 for(var i in misys._config.swiftError)
	 	 	 		 {
	 	 	 			 var swiftErrorField = dijit.byId(m._config.swiftError[i]);
	 	 	 			 swiftErrorField.set("state","Error");
	 	 	 			 swiftErrorField._setStateClass();
	 	 	 			 dj.setWaiState(swiftErrorField.focusNode, "invalid", "true");
	 	 	 		 }
		 	 	 //Scroll to the first field which is in error.
	 	 	 		 swiftErrorField = dijit.byId(m._config.swiftError[0]);
	 	 	 		 dojox.fx.smoothScroll({
	 	 	 			 node: swiftErrorField.containerNode || swiftErrorField.domNode, 
	 	 	 			 win: window
	 	 	 		 	}).play();
		 	 	} 
			};
			break;
		default:
			break;
		}
		
		// Perform any validations and submit the form
		if(progressMessage && progressMessage !== ""){
			m.dialog.show("PROGRESS", progressMessage);
		}
		
		// If the transaction is rejected, then we don't need to trigger form validation
		// on submit (individual fields are still protected by inline validation)
		// Verify if this is what we want before uncommenting
		//No Validation required for Payment Request Screen because all are read only screen.The validation was happening in case of adding otherChargesType in TransportDataset

		if((d.every(validations, function(f){return f();})) || (dj.byId("tnxtype") && dj.byId("tnxtype").get("value")==="55")) {
			var realformOperation = dj.byId("realform_operation");
			if(realformOperation && realformOperation.get("value") === "") {
				realformOperation.set("value", operation);
			}
			else if(operation !== "" && (operation === "CHECKER_BENE_SUBMIT" || operation === "CHECKER_BENE_FILE_UPLOAD_SUBMIT"))
			{
				realformOperation.set("value", "APPROVE_FEATURES");
			}
			_synchronizeAttachments();
			
			if(type === "SAVE_TEMPLATE" && !_isUniqueTemplateId(dijit.byId("template_id"))) {
				m.dialog.show("CONFIRMATION", m.getLocalization("nonUniqueTemplateIDError"), "", 
					function() {
						if(m.isFormDirty && m.isFormDirty === true )
						{
							m.isFormDirty = false;
						}
						dj.byId("TransactionData").set("value", m.formToXML());
						dj.byId("realform").submit();
					}
				);
				return;
			}

			var trans = dj.byId("transaction_confirmation_details"); 
			if(trans && trans.get('value') === "Y" && (type === "SUBMIT" || type === "AUTO_FORWARD_SUBMIT")){
			     m.checkAndShowTnxConfirmationDetailsDialog();
				 
			} else if (type === "SUBMIT" || type === "MAKER_SUBMIT" || type === "LEGAL_TEXT_SUBMIT" || type === "AUTO_FORWARD_SUBMIT" || type === "APPROVE" || type === "REJECT" || type === "RETURN_TRANSACTION" || type === "REVERT" || type === "RETURN" || type === "DELETE"||type==="SYSTEM_SUBMIT" || type === "RESUBMIT" || type === "CHECKER_BENE_FILE_UPLOAD_SUBMIT" || type === "CHECKER_BENE_SUBMIT" || type === "MAKER_BENE_FILE_UPLOAD_SUBMIT" || type === "MAKER_BENE_SUBMIT"){
				m.performReauthentication();
			} else {
				if(m.isFormDirty && m.isFormDirty === true )
				{
					m.isFormDirty = false;
				}
				dj.byId("TransactionData").set("value", m.formToXML());
				dj.byId(_realformID).submit();
			}
		} else {
			var holidayCutOffEnabled = m._config.holidayCutOffEnabled;
			var legalTextEnabled = m._config.legalTextEnabled;
			if(holidayCutOffEnabled && holidayCutOffEnabled === true)
			{
				m._config.holidayCutOffEnabled = false;
				//Do Nothing here (Custom Dialog is shown in validation/common.js) 
			}
			else if(legalTextEnabled && legalTextEnabled == true){
				m._config.legalTextEnabled = false;
			}
			else
			{
				var globalOnSubmitError = m._config.onSubmitErrorMsg;
				errorMessage = (globalOnSubmitError && globalOnSubmitError !== "") ? 
						globalOnSubmitError : errorMessage;
				
				m._config.onSubmitErrorMsg = "";
				if(errorMessage && errorMessage !== "") {
					m.dialog.show("ERROR", errorMessage, "", onErrorCallback);
				}
			}
		}
	
	}
	/**
	 * <h4>Summary:</h4>
	 *  Asynchronous Click : Submit the transaction.
	 *  <h4>Description:</h4> 
	 *  This is Asynchronous call, called because of asynchronous navigation
	 *  @param {String} type
	 *   Type of the operation like "Submit,Save etc."
	 *  @method _submitAsync
	 * 
	 */
	function _submitAsync( /*String*/ type) {
		//  summary:
	    //        Asynchronous Click : Submit the transaction.
	    //  description:
		//        This is Asynchronous call, called because of asynchronous navigation
		//
		
		var validations = [function(){return true;}],
		    operation = type,
		    onErrorCallback,
		    errorMessage;

		validations.push(m.beforeSaveValidations);
		errorMessage = m.getLocalization("mandatoryEntityMessage");
		onErrorCallback = function(){dijit.byId("entity")?dijit.byId("entity").focus():null;};
		
		// Perform any validations and submit the form

		if(d.every(validations, function(f){return f();})) {
			var realformOperation = dj.byId("realform_operation");
			if(realformOperation.get("value") === "") {
				realformOperation.set("value", operation);
			}
			_synchronizeAttachments();
			
			errorMessage = "";
			
			dj.byId("TransactionData").set("value", m.formToXML());
		} else {
			var holidayCutOffEnabled = m._config.holidayCutOffEnabled;
			if(holidayCutOffEnabled && holidayCutOffEnabled === true)
			{
				m._config.holidayCutOffEnabled = false;
				//Do Nothing here (Custom Dialog is shown in validation/common.js) 
			}
			else
			{
				var globalOnSubmitError = m._config.onSubmitErrorMsg;
				errorMessage = (globalOnSubmitError && globalOnSubmitError !== "") ? 
						globalOnSubmitError : errorMessage;
				
				m._config.onSubmitErrorMsg = "";
				if(errorMessage && errorMessage !== "") {
					m.dialog.show("ERROR", errorMessage, "", onErrorCallback);
				}
			}
		}
		return errorMessage;
	}
	/**
	 * <h4>Summary:</h4>
	 * Submits a form in a popup
	 * @param {String} formId
	 *  Id of the form
	 * @param {Function} callback
	 *  Call back function
	 * @method _submitDialog
	 * 
	 */
	function _submitDialog( /*String*/ formId,
							/*Function*/ callback) {
		//  summary:
	    //           Submits a form in a popup
		
		m.dialog.show("PROGRESS", m.getLocalization("validatingAndSubmittingMessage"), 
						"", null, function(){
			setTimeout(function(){
				m.xhrPost({
				  form: formId,
				  load: function(data, ioArgs){
				  	     //Need to handle the response to show if transaction failed
					  	 var response = data.substring(data.indexOf("<div id='GTPRootPortlet' class='portlet'>"));
					  	 response = response.substring(response.indexOf("<div class='portlet-font portlet-section-body'><p>"));
					  	 response = response.substring(response.indexOf("<p>"),response.indexOf("</div>"));
					  	 dj.byId("alertDialog").hide();
						 m.dialog.clear(d.byId(m._config.popupType + "data"),
								 		dj.byId("contentPane"),
								 		callback,response);
				  },
				  // the AJAX submit breaks with the default contentType, I'm not sure why
				  contentType: ""
				 });
			}, 1000);
		});
	}
	/**
	 *  <h4>Summary:</h4>
	 *   Validates all forms with class "validate" in the page.
	 * 	<h4>Description:</h4> 
	 *  If doRealValidation is false, we call isValid, which returns the status of the
	 *  form without triggering the error state of all fields. If doRealValidation is
	 *  true, we perform the full validation. This is triggered when the "error" dialog
	 *  is dismissed.
	 *  
	 *   Note: We usually don't pass a value to the forms param; the function then
	 *   takes all forms with class 'form'.
	 *   @param {Boolean} doRealValidation
	 *   @method _validateForms
	 * 
	 */
	function _validateForms( /*Boolean*/ doRealValidation,
							 /*Array*/ forms) {
		//  summary:
	    //        Validates all forms with class "validate" in the page.
		//
		//  description:
		//        If doRealValidation is false, we call isValid, which returns the status of the 
		//        form without triggering the error state of all fields. If doRealValidation is 
		//        true, we perform the full validation. This is triggered when the "error" dialog 
		//        is dismissed.
		//
		//	      Note: We usually don't pass a value to the forms param; the function then
		//		  takes all forms with class 'form'.
		
		console.debug("[misys.common] Validating forms in the page ...");
		
		var 
			// Forms to validate. Reverse sort it so "fakeform0" is validated first
			formsToValidate = (forms || d.query(_formToValidateSelector)).reverse(),
			draftTerm = dj.byId("draft_term"),
		    result = true;
		
		if(draftTerm) {
			// This is a workaround, occasionally the draft_term field validate function is
			// not called, so we call it manually once, here
			draftTerm.validate();
		}
		
		d.forEach(formsToValidate, function(form) {
				console.debug("[misys.common] Validating form", form.id);
				var formObj = dj.byId(form.id);
				
				// TODO Workaround, GridMultipleItems are not hooking into the validation for
				// some reason. Despite their state being Error, the overall form state is 
				// empty. Calling _getState() explicitly seems to fix it.
				if(formObj._getState() !== ""|| formObj.state !== "") {
					if(doRealValidation) {
						formObj.validate();
					}
					result = false;
				}
			}
		);

		if(!result && doRealValidation) {
			_validateTabs();
		}
		
		console.debug("[misys.common] Validation result", result);
		
		return result;
	}
	/**
	 * This function is specially written for validating File Act scenarios
	 * If delivery channel is Fact and attachment is there at least one 
	 * attachment should be selected to go with the transaction.
	 * @method _validateFileAct
	 * @return {Boolean}
	 *  Returns true if at least one attachment is selected otherwise show an error message
	 */
	function _validateFileAct(){
		var fileAttachments = dj.byId(_fileAttachmentsWidgetID);
		var deliveryChannel = dj.byId("delivery_channel");
		var selected = false;
		
		if(deliveryChannel && (deliveryChannel.get('value') == 'FACT') && fileAttachments && fileAttachments.grid.selection && fileAttachments.fileActVisible){
			d.forEach(fileAttachments.grid.selection.getSelected(), function(node, index){
				if(node && node != null) {
					selected = true;
				}
			});
		}
		else
		{
			selected = true;
		}
		
		if(!selected)
		{
			m._config.onSubmitErrorMsg = m.getLocalization("selectAtleastOneFileForFileAct");
		}
		
		return selected;
	}
	/**
	 * <h4>Summary:</h4>
	 * Validates all fields with the swift class against the SWIFT standard.
	 * It shows an error message in case validation fails.
	 * @method _validateSWIFTFields
	 * @return {boolean}
	 *  True if field is valid otherwise false
	 * 
	 */
	function _validateSWIFTFields() {
		//  summary:
	    //        Validates all fields with the swift class against the SWIFT standard, 
		//        if we have to
		
		// TODO This needs to be refactored
		
		var advSendMode = dj.byId("adv_send_mode");
		var swiftCharError,swiftFieldError,swiftInvalidFirstCharError=false,swiftFieldErrorForTrade=false,swiftAdderessFieldError=false;
		var extendedErrorFields =false;
		var errorFields = false;
		//userType variable contains the company type value:
		//Values 03 or 06 represent a customer user,any other user represents a bank.
		var userType;
		if (document.getElementById("_userType"))
		{
			userType = document.getElementById("_userType").getAttribute('value');
		}
		misys._config = misys._config || {};
		misys._config.swiftRelatedSections = misys._config.swiftRelatedSections || [];
		dojo.mixin(misys._config, {				
		        swiftError : new Array()		       
       		});
		var isBank = false;
		var isClient = true;
		if(m._config.isBank)
			{
			 if(m._config.isBank === true)
				{
					isBank = true;
					isClient = false;
				}
			 }
		if((advSendMode && advSendMode.get("value") === "01") || m._config.forceSWIFTValidation)
		{
		  if(isClient || ((isBank && misys._config.productCode != 'SR') && (isBank && misys._config.productCode != 'EL')))
		  {
			var invalidFields = [];
			misys._config.swiftRelatedSections.forEach(function(swiftRelatedSection) {
				var nameField = dj.byId(swiftRelatedSection.concat("_name"));
				var addressField = dj.byId(swiftRelatedSection.concat("_address_line_4"));
				if(nameField) {
					if(!_isValidSWIFTFieldSizeErrorForTrade(nameField)){
						//m.showTooltip(m.getLocalization("invalidSWIFTFieldSizeErrorForTrade"), swiftRelatedSection.concat("_name"));
						invalidFields.push(nameField);
						swiftFieldErrorForTrade=true;
						}
					}
				if(addressField && addressField.get("value")!=="") {
					if(isClient || ((isBank && misys._config.productCode != 'SR') && (isBank && misys._config.productCode != 'EL')))
				    {
					//m.showTooltip(m.getLocalization("invalidSWIFTAddressFieldErrorForTrade"), swiftRelatedSection.concat("_address_line_4"));
					invalidFields.push(addressField);
					swiftAdderessFieldError=true;
					}
				}
			  }
			);

			d.query(_SWIFTFieldSelector).forEach(function(node){
				var field = dj.byId(node.getAttribute("widgetid"));
				var ProductCodeValue =  misys._config.productCode;
				var is798 = dj.byId("is798") ? dj.byId("is798").get("value") : "";
				m._config.is798 = is798;
				if((field && field.id != 'cust_ref_id') || (field && field.id == 'cust_ref_id' && misys._config.is798 == 'Y')) {
					field.onBlur(field);
					if(!_isValidSWIFTTextarea(field) && !(ProductCodeValue != 'LC' || ProductCodeValue != 'SI' || ProductCodeValue != 'EL' || ProductCodeValue != 'SR')) {
						m.showTooltip(m.getLocalization("invalidSWIFTFieldSizeError"), node);
						invalidFields.push(field);
						m.connect(field, "onBlur", function(){
							m.setFieldState(this, _isValidSWIFTTextarea(this));
						});
						swiftFieldError=true;
					} else if(!_hasValidSWIFTChars(field) && field.id != 'template_id'){
						invalidFields.push(field);
						m.connect(field, "onBlur", function(){
							m.setFieldState(this, _hasValidSWIFTChars(this));
						});
						swiftCharError=true;
					} else if(m._config.swift2018Enabled && _isExtendedSwiftCharAllowed(node) && !_hasInvalidSWIFTFirstChars(field)){
						invalidFields.push(field);
						m.connect(field, "onBlur", function(){
							m.setFieldState(this, _hasInvalidSWIFTFirstChars(this));
						});
						swiftInvalidFirstCharError=true;
					} else if (!(field.get('required') && (field.get("value") === "" || isNaN(field.get("value")) ))) {
						m.setFieldState(field, true);
					}
				}
			});
			if(invalidFields.length > 0) {
				d.forEach(invalidFields, function(field, index){
					console.debug("[misys.common] The field", field.id, "is in error");
					m.setFieldState(field, false);
					if(m._config.swift2018Enabled && _isExtendedSwiftCharAllowed(field)){
						extendedErrorFields =true;
					}
					else{
						errorFields =true;
					}
					field.invalidMessage = m.getLocalization("invalidSWIFTTransactionError");
					misys._config.swiftError[index] = field.get("id");
				});
			
			  if(swiftFieldError)	
			  {
				  _validateTabs();
		          m._config.onSubmitErrorMsg = m.getLocalization("invalidSWIFTFieldSizeError");
		          return false;
			  }
			  else if(swiftFieldErrorForTrade)	
			  {
				  _validateTabs();
		          m._config.onSubmitErrorMsg = m.getLocalization("invalidSWIFTFieldSizeErrorForTrade");
		          return false;
			  }
			  else if (swiftCharError)
			  {
			    _validateTabs();
			    var errorMsg=m.getLocalization("invalidSWIFTTransactionErrorMsg");
			    if( errorFields && !extendedErrorFields && userType){
			    	errorMsg=errorMsg +m.getLocalization("invalidSWIFTTransactionValidValues");
			    }
			    if( !errorFields && extendedErrorFields && userType){
			    	errorMsg=errorMsg+ m.getLocalization("invalidSWIFTTransactionValidValuesExt");
			    }
			    if( errorFields && extendedErrorFields && userType){
			    	if(userType == '03' || userType == '06'){
			    		errorMsg=errorMsg+ m.getLocalization("invalidSWIFTTransactionValidValuesWithExt");
			    	}else{
			    		errorMsg=errorMsg+ m.getLocalization("invalidSWIFTTransactionValidValuesWithExtBank");
			    	}		    	
			    }
			    m._config.onSubmitErrorMsg =errorMsg;
				return false;
			  }
			  else if(swiftAdderessFieldError)	
			  {
				  _validateTabs();
		          m._config.onSubmitErrorMsg = m.getLocalization("invalidSWIFTAddressFieldErrorForTrade");
		          return false;
			  }
			  else if(swiftInvalidFirstCharError)
			  {
				  _validateTabs();
				  m._config.onSubmitErrorMsg = m.getLocalization("invalidSWIFTFirstCharErrorMsg");
		          return false;
			  }
		   }
	    }
	  }
		return true;
	}
	
	/**
	 * <h4>Summary:</h4>
	 * Checks if a field size is valid with respect to the SWIFT standard
	 * <h4>Description:</h4> 
	 * Return false if the number of lines of existing text exceeds 35 characters.
	 */
	function _isValidSWIFTFieldSizeErrorForTrade( /*dijit._Widget || DomNode*/ node) {
		
		var field = dj.byId(node);
		
		if(field.get("value").length > 35){
			return false;
		}

		return true;
	}
	
	/**
	 * <h4>Summary:</h4>
	 * Checks if a textarea is valid with respect to the SWIFT standard
	 * <h4>Description:</h4> 
	 * Return false if the number of lines of existing text in a textarea object
	 *  exceeds 100.
	 * @param {dijit._widget || DomNode} node
	 *  Node to be validated against swift standard
	 * @method _isValidSWIFTTextarea
	 * @return {boolean}
	 *   True if valid otherwise false
	 */
	function _isValidSWIFTTextarea( /*dijit._Widget || DomNode*/ node) {
		//  summary:
		//        Checks if a textarea is valid with respect to the SWIFT standard
		//
		//  description:
	    //        Return false if the number of lines of existing text in a textarea object 
		//        exceeds 100.
		
		var textarea = dj.byId(node);
		
		if(/SimpleTextarea/.test(textarea.declaredClass)){
			var rowCount = 1,
			    value = textarea.get("value");
			
			return d.every(value, function(c){
				if(c === "\n") {
					return (++rowCount <= _SWIFTMaxTextareaRows);
				}
				return true;
			});
		}

		return true;
	}
	
	
	/**
	 * <h4>Summary:</h4>
	 * check if field is allowed extra characters by swift standards .
	 * @param {dijit._widget || DomNode} node
	 *  Node to be checked 
	 * @method _isExtendedSwiftCharAllowed
	 * @return {Boolean}
	 *  Returns true if field is allowed extra character
	 */
	function _isExtendedSwiftCharAllowed( /*dijit._Widget || DomNode*/ node) {
		//  summary:
	    //        Validates the characters of a field against the SWIFT standard.
		
		if(!m._config.swift2018Enabled){
			return false;
		}
		
		var widget = dj.byId("product_code");		
		var productCode="";
		if(widget)
		{
			productCode=widget.get("value");
		}

		if(m._config.swift2023Enabled){
			var allowedShipmentFields=['ship_from','ship_loading','ship_discharge',
			'ship_to','narrative_delivery_to'];
			if((productCode === "LC" && new RegExp(allowedShipmentFields.join('|')).test(node.id)) ||
					(productCode === "SI" && new RegExp(allowedShipmentFields.join('|')).test(node.id)))
			{
				return true;
			}
		}

		var allowedLCFields=['narrative_documents_required','narrative_description_goods',
			'narrative_additional_instructions','narrative_full_details',
			'narrative_charges','narrative_special_beneficiary','narrative_special_recvbank',
			'narrative_sender_to_receiver','narrative_amend_charges_other','free_format_text','narrative_transfer_conditions',
			'narrative_additional_amount','narrative_payment_instructions','narrative_period_presentation','narrative_shipment_period',
			'line_item_product_name','purchase_order', 'inco_place', 'ship_name'];	
		
		if((productCode === "LC" && new RegExp(allowedLCFields.join('|')).test(node.id)) ||
				(productCode === "EL" && new RegExp(allowedLCFields.join('|')).test(node.id)) ||
				(productCode === "SI" && new RegExp(allowedLCFields.join('|')).test(node.id)) ||
				(productCode === "SR" && new RegExp(allowedLCFields.join('|')).test(node.id)) ||
				(productCode === "BG" && new RegExp(allowedLCFields.join('|')).test(node.id)))
		{
			return true;
		}
		else
		{
			return false;
		}			
	}
	
	
	/**
	 * <h4>Summary:</h4>
	 * Validates the characters of a field against the SWIFT standard.
	 * @param {dijit._widget || DomNode} node
	 *  Node to be validated against swift standard
	 * @method _hasValidSWIFTChars
	 * @return {Boolean}
	 *  Returns true if field is valid otherwise false
	 */
	function _hasValidSWIFTChars( /*dijit._Widget || DomNode*/ node) {
		//  summary:
	    //        Validates the characters of a field against the SWIFT standard.
		
		var widget = dj.byId(node),
			value = widget.get("value");
		var displayedValue = widget.get("displayedValue");
		if ((value != null && value != '') && (displayedValue != null && displayedValue != '')) {
			if(value.length > displayedValue.length) {
				value = widget.get("displayedValue");
			}
		}
		
		if(widget.datePackage && widget.datePackage === "dojo.date")
		 {
		   value=widget.get("displayedValue");
	     }
		
		if(value === null || value === ""){
			return true;
		}
		var isValid=true;
		try
		{
		var regexStr = dj.byId("swiftregexValue") ? dj.byId("swiftregexValue").get("value") : "";
		if(m._config.swift2018Enabled && _isExtendedSwiftCharAllowed(node)){
			regexStr = dj.byId("swiftregexzcharValue") ? dj.byId("swiftregexzcharValue").get("value") : "";
		}
		var swiftchar = value;
		var swiftregexp = new RegExp(regexStr);
			
		isValid=swiftregexp.test(swiftchar);
		}
		catch(err)
		{
			return isValid;
		}
		
		return isValid;
	}
	
	/**
	 * <h4>Summary:</h4>
	 * Validates first character of all new lines except first line.
	 * As per SWIFT standards - and : is not allowed as first char of lines except for the first line.
	 * @param {dijit._widget || DomNode} node
	 *  Node to be validated against swift standard
	 * @method _hasInvalidSWIFTFirstChars
	 * @return {Boolean}
	 *  Returns true if field is valid otherwise false
	 */
	function _hasInvalidSWIFTFirstChars( /*dijit._Widget || DomNode*/ node) {
		//  summary:
	    //        Validates first character of all new lines except first line against the SWIFT standard.
		
		var widget = dj.byId(node),
			value = widget.get("value");
		if(value === null || value === "")
		{
			return true;
		}
		if(value.indexOf("\n:") != -1|| value.indexOf("\n-") != -1)
		{
			return false;
		}		
		return true;
	}
	
	/**
	 *  <h4>Summary:</h4>
	 *   Normalizes the value of form fields to match the expected XML format.
	 *   <h4>Description:</h4> 
	 *   Rules specific to certain widgets should be kept to an absolute minimum here - if
	 *   its a custom widget, implement toXML instead, for complex behaviour. If its
	 *   a standard widget, think about subclassing or check the existing widget
	 *   formatting options to see if they can be used.
	 * 	 @param {Object} value
	 *    Value to be normalised
	 *   @param {String} declaredClass
	 *   @method _normalize
	 */
	function _normalize( /*Object*/ value, 
						 /*String*/ declaredClass) {
		// summary:
		//    normalizes the value of form fields to match the expected XML format.
		//
		// description:	
		//    Rules specific to certain widgets should be kept to an absolute minimum here - if
		//	  its a custom widget, implement toXML instead, for complex behaviour. If its
		//	  a standard widget, think about subclassing or check the existing widget
		//	  formatting options to see if they can be used.
		//
		//	  TODO Some of these can be moved into widget extensions, perhaps?
		
		if(d.isArray(value)) {
			// checkbox/radio
			if(/CheckBox/.test(declaredClass)) {
				if(value.length === 1 && value[0] === "on") {
					return "Y";
				}
				return "N";
			}
		}
		
		if(value === null || value === "" || ((value + "") === "NaN")) {
			return "";
		}

		// TODO Normalize date/time formats client/server, would rather send full standard date
		if(/Date/.test(declaredClass)) {
			return d.date.locale.format(value, {
				selector :'date',
				datePattern : misys.getLocalization('g_strGlobalDateFormat')
			});
		}
		if(/Time/.test(declaredClass)) {
			return d.date.locale.format(value, {
				datePattern: "dd/MM/yyyy", 
				timePattern: "HH:mm:ss"
			});
		}
		return dojo.isString(value) ? 
				dojox.html.entities.encode(value, dojox.html.entities.html) : value;
	}
/**
 * <h4>Summary:</h4>
 * Check which attachments have been added or deleted.
 * @method _synchronizeAttachments
 */
	function _synchronizeAttachments(){
	    //  summary:
	    //        Check which attachments have been added or deleted.
		
		console.debug("[misys.common] Checking for lost attachments ...");
		var attIdsField = dj.byId("attIds");
		var fileActIdsField = dj.byId("fileActIds");
		if(attIdsField) {
			var attIds = [];
			var fileActIds = [];
			if(d.query("table[id^=" + _fileAttachmentsTableID + "]").length > 0) {
				d.query(
					"table[id^=" + _fileAttachmentsTableID + 
					   "] tr[id^='file_row_']]").forEach(function(node, i){
					var nodeId = node.id;
					if(i !== 0) {
						attIds.push("|");
					}
					attIds.push(nodeId.substring(nodeId.indexOf("row_") + 4, nodeId.length));
				});
			} else {
				var grids = [dj.byId(_fileAttachmentsWidgetID),
				             dj.byId(_mt700FileAttachmentsWidgetID),dj.byId(_invoiceFileAttachmentsWidgetID),dj.byId(_purchaseorderFileAttachmentsWidgetID),dj.byId(_purchaseorderUploadFileAttachmentsWidgetID)];	
				var firstInserted = false;
				d.forEach(grids, function(gridContainer){
					if(gridContainer &&  gridContainer.grid) {
						var arr = gridContainer.grid.store._arrayOfAllItems;
						d.forEach(arr, function(attachment, i){
							if(attachment && attachment != null) {
								if (firstInserted) {
									attIds.push("|");
								}
								else
								{
									firstInserted = true;
								}
								attIds.push(attachment.attachment_id);
							}
						});
					}
				});
				
				var fileAttachments = dj.byId(_fileAttachmentsWidgetID);
				if(fileActIdsField && fileAttachments && fileAttachments.grid && fileAttachments.grid.selection){
					firstInserted = false;
					d.forEach(fileAttachments.grid.selection.getSelected(), function(node, index){
						if(node && node != null) {
							if (firstInserted) {
								fileActIds.push("|");
							}
							else
							{
								firstInserted = true;
							}
							fileActIds.push(node.attachment_id);
						}
					});
					fileActIdsField.set("value", fileActIds.join(""));
				}
			}

			attIdsField.set("value", attIds.join(""));
	    }
	}
/**
 * <h4>Summary:</h4>
 * Update a tab's title if it contains a field in error.
 * Query for all the nodes with passed context and css as _tabContainerSelector.
 * Get tab of the tab container check for its state ,if it is error update the tab.
 * @param {dijit._Widget} context
 *  Query for this context passed and get all the elements.
 * @method _validateTabs
 */
	function _validateTabs( /*dijit._Widget*/ context) {
		// summary: 
		//    Update a tab's title if it contains a field in error 
		
		// TODO Should probably be done with some sort of listener instead
		
		d.query(_tabContainerSelector, context).forEach(function(tabContainerNode){
				var tabContainer = dj.byId(tabContainerNode.getAttribute("widgetid"));
				if(tabContainer) {
					d.forEach(tabContainer.getChildren(), function(tab){
						d.some(tab.getChildren(), function(node) {
							if(node.get("state") === "Error") {
								m.connect(node, "onChange", function(){
									_updateTab(tab, node);
								});
								node.onChange();
								return true;
							}
							return false;
						});
					});
				}
		 });
	}
	/**
	 * <h4>Summary:</h4>
	 * Updates the title of a tab to indicate if it contains required fields, or
	 * fields in error
	 * <h4>Description:</h4> 
	 * The tab title is updated in the following cases
	 * 1. If the tab contains at least one field that is required, the title
	 * is preceded by the value of misys._config.requiredFieldPrefix (or '*')
	 * 2. If the tab contains at least one field that has a value, the title
	 *  is given the class nonEmptyTabContainer (which usually bolds the field)
	 * 3. If at least one field is in error, the tab title is preceded by the
	 *  error icon
	 *  @param {dijit._Widget} tab
	 *  @param {dijit._widget || JSON} tabState
	 *    as {"isRequired" : true, "isNonEmpty" : true, "isInError" : true}
	 *  @method _updateTab
	 */
	function _updateTab( /*dijit._Widget*/ tab,
            			 /*dijit._Widget || JSON*/ tabState) {
		//	summary:
		//		Updates the title of a tab to indicate if it contains required fields, or
		//		fields in error
		//		
		//	description:
		//		The tab title is updated in the following cases
		//			1. If the tab contains at least one field that is required, the title
		//			   is preceded by the value of misys._config.requiredFieldPrefix (or '*')
		//			2. If the tab contains at least one field that has a value, the title 
		//			   is given the class nonEmptyTabContainer (which usually bolds the field)
		//			3. If at least one field is in error, the tab title is preceded by the
		//			   error icon
		//
		//		The second parameter can be either JSON or a Dijit. 
		//
		//		When it is JSON, it should be structured as follows
		//
		//		{
		//		 "isRequired" : true,
		//		 "isNonEmpty" : true,
		//		 "isInError" : true
		//		}
		//
		//		(in cases where all three are true, obviously it changes depending on the field)
		//
		//	    In the case of a Dijit, the same JSON structure is formed from the Dijits state.
		
		var errorIcon = d.create("img", {
	    		"class" : "errorIcon",
	    		src: m.getContextualURL(m._config.imagesSrc + m._config.imageStore.warningIcon),
	    		alt: m.getLocalization("tabErrorWarning"),
	    		title: m.getLocalization("tabErrorWarning")
	    	}),
	    	requiredPrefix = m._config.requiredFieldPrefix || "*",
	    	title = tab.get("title"),
	    	container,
	    	state;

		// Establish the state of the tab
		if(tabState.declaredClass) {
			var value = tabState.get("value");
			state = {
					"isRequired" : tabState.get("required"),
					"isNonEmpty" : value !== null && value !== "",
					"isInError" : tabState.get("state") === "Error"
			};
		} else {
			state = tabState;
		}

		// Is node required? 
		if(state.isRequired && (title.indexOf(requiredPrefix) === -1)) {
			requiredPrefix += " ";
			title = requiredPrefix + title;
		}
		
		// Is node in error?
		// Note: this is the only update that is reversible
		if(state.isInError && title.indexOf("<img") === -1) {
			container = d.create("div");
			container.innerHTML = title;
			if (!(dojo.isIE && dojo.isIE === 6)){
				d.place(errorIcon, container);
			}
			title = container.innerHTML;
		}
		if(!state.isInError && title.indexOf("<img") !== -1) {
			title = title.substr(0, title.indexOf("<img"));
		}

		// Does node have a value?
		if(state.isNonEmpty && title.indexOf(_nonEmptyTabClass) === -1) {
			container = d.create("div");
			d.create("span", {
				"class" : _nonEmptyTabClass,
				innerHTML : title
			}, container);
			title = container.innerHTML;
		}
			
		if(title !== tab.get("title")) {
			tab.set("title", title);
		}
	}
	/**
	 * <h4>Summary:</h4>
	 * Bind event handlers to tab containers
	 * <h4>Description:</h4> 
	 * Change the tab title to include an asterisk, indicating that required fields are
	 * present. Moreover, bold the title when a child field fires an onBlur
	 * @method {dijit._Widget} context
	 * @method _bindTabs
	 */
	function _bindTabs( /*dijit._Widget*/ context) {
		//  summary:
	    //    Bind event handlers to tab containers 
		//  description:
		//    Change the tab title to include an asterisk, indicating that required fields are 
		//    present. Moreover, bold the title when a child field fires an onBlur
		
		var tabHasRequired = false,
		    tabHasNonEmpty = false,
		    tabHasInError = false,
		    parentTabId,
		    tabContainerId;

	      d.query(_tabContainerSelector, context).forEach(function(tabContainerNode){
				var tabContainer = dj.byId(tabContainerNode.getAttribute("widgetid"));
				if(tabContainer) {
					tabContainerId = tabContainer.get("id");
					d.forEach(tabContainer.getChildren(), function(tab){
						tabHasRequired = false;
						tabHasNonEmpty = false;
						tabHasInError = false;
						parentTabId = tab.get("id");
						d.forEach(tab.getChildren(), function(node){
							var value = node.get("value");
							
							// At least one field is required (on page load)
							if(!tabHasRequired && node.get("required")) {
								tabHasRequired = true;
							}
							
							// At least one field is non-empty
							// Note: We can't just check that "value" has any value as
							// its value could be zero which is "falsy" in JavaScript
							if(!tabHasNonEmpty && (value !== null && value !== "")) {
								tabHasNonEmpty = true;
							}
							
							// At least one field is non-empty
							if(!tabHasInError && node.get("state") === "Error") {
								tabHasInError = true;
							}
							
							// Highlight the tab if the value of this field is changed
							m.connect(node, "onChange", function() {
								_updateTab(tab, {
									"isRequired" : node.get("required"),
									"isNonEmpty" : node.get("value") !== null && 
														node.get("value") !== "",
									// Error icon is only shown on form submit and on page load
									"isInError" : false	
 								});
							});
							
							// Set the parent tab ID as an attribute on the child, so we
							// know which tab to open during the form validation
							node.set("parentTab", parentTabId);
							node.set("tabContainer", tabContainerId);
						});

						// Set the tab title the first time the page loads
						_updateTab(tab, {
							"isRequired" : tabHasRequired,
							"isNonEmpty" : tabHasNonEmpty,
							"isInError" : tabHasInError
						});
					});
				}
		  });
	}
	/**
	 * <h4>Summary:</h4>
	 * Subscribes elements with class _subscribeTopicSelector to
	 *  topic on attr _subscribeTopicAttr
	 *  @method _setupTopicSubscriptions
	 */
	function _setupTopicSubscriptions() {
		// summary:
		//        Subscribes elements with class _subscribeTopicSelector to
		//        topic on attr _subscribeTopicAttr
		
		var widget,
			topics;
		
		d.query(_subscribeTopicSelector).forEach(function(listener){
			 widget = dj.byId(dojo.attr(listener, "widgetid")) || 
			 				dj.byId(dojo.attr(listener, "id"));
			 if (widget) {
				 topics = widget.get(_subscribeTopicAttr);
				 if(topics) {
					 d.forEach(topics.split(" "), function(topic){
						 console.debug(
								 "[misys.common] Subscribe element", listener.id,  
								 "to topic", topic);
						 d.subscribe(topic, widget, function(event){
							 if (this.handleTopicEvent) {
								 this.handleTopicEvent(event, topic);
							 }
						 });
					 });
				 }
			 }
		});
	}
	/**
	 * <h4>Summary:</h4>
	 * If there is a search form in the page (e.g. for pages that list
	 *  transactions in a grid), then setUp the search.
	 *  @method _setupSearchFields
	 */
	function _setupSearchFields() {
		// summary:
		//       If there is a search form in the page (e.g. for pages that list 
		//       transactions in a grid), then 

		if(d.byId(_transactionSearchFormId)) {
			m.connect(_transactionSearchFormId, "onSubmit",  function(/*Event*/ e){
				var strCurrentFormat = dj.byId(_exportListFieldId) ? 
						                 dj.byId(_exportListFieldId).get("value") : "screen";
				if (e && strCurrentFormat === "screen") {
					e.preventDefault();
				}
				
				d.forEach(dj.byId('TransactionSearchForm').getDescendants(), function(fld){
					if(fld.state === 'Incomplete' && fld.required === true)
					{	
						fld._hasBeenBlurred =true; 
						fld.validate(false); 
					}
				});
				
				if(this.isValid()) {
					if (strCurrentFormat !== "screen") {
						if(strCurrentFormat === "pdf"){
							dj.byId(_filenameFieldId).set("value", "AccountStatement."+strCurrentFormat);
						}
						else {
							dj.byId(_filenameFieldId).set("value", "inquiry."+strCurrentFormat);							
						}
						return true;
					} else {
						m.grid.reloadForSearchTerms();
						m.reloadChartImg();
						return false;
					}
				}
				else { 
					if(dojo.byId('hugeDiv')) {
						dojo.byId('hugeDiv').style.display='none'; // hiding the results if form is in error state
					}
					return true;
				}
			});
		}
	}
	/**
	 * <h4>Summary:</h4>
	 *   Refreshes any grids in the page, which should be given the class "grid".
	 *  <h4>Description:</h4> 
	 *   Sometimes grid column sizes are not correctly sized upon page load, so this
	 *   methods calls the grid resize method to ensure the sizes are properly set.
	 *   @method _setupGrids
	 */
	function _setupGrids() {
		//  summary:
	    //        Refreshes any grids in the page, which should be given the class "grid".
		//  description:
		//        Sometimes grid column sizes are not correctly sized upon page load, so this
		//        methods calls the grid resize method to ensure the sizes are properly set.
		
		// All grids beneath isVisible will be shown
		d.query(_gridClassSelector).forEach(function(/*DomNode*/ grid){
				console.debug("[misys.common] Calling resize for grid", grid.id);
				var selectedItem;
				// Test if it is the datagrid of a graph to collapse it
				var gridObj = dj.byId(grid.id);
				if(gridObj) {
					if(d.hasClass(grid, "ischarted")) {
						m.grid.toggleAllGroups(gridObj, false);
					}
					if(!window.isTopElementToBeFocussed) {
						gridObj.resize();
                    }
					}
		});
	}

/**
 * <h4>Summary:</h4>
 *   Instantiate the collaboration floating pane, if present.
 * @method _setupCollaboration
 */
	function _setupCollaboration() {
		// summary:
		//       Instantiate the collaboration floating pane, if present

		var collaborationWindowContainer = d.byId(_collaborationWindowContainerId),
			collaborationWindow;
			
		if(collaborationWindowContainer) {
			console.debug("[misys.common] Showing Collaboration window ...");
			d.parser.parse(collaborationWindowContainer);
			// Place the window at the <body> tag, otherwise it will appear 
			// beneath other elements
			collaborationWindow = dj.byId("collaborationWindow");
			collaborationWindow.placeAt(dojo.body());
			if((!d.isIE || d.isIE > 7) && collaborationWindow.show) {
				d.style(collaborationWindow.domNode, "opacity", 0);
				collaborationWindow.show();
			} else {
				// Sometimes the collaboration window is a TitlePane & has no show method.
				//	It's been implemented like that, for some reason, when you save a transaction. 
				d.style(collaborationWindow.domNode, "opacity", 1);
			}
		}
	}
	/**
	 *   <h4>Summary:</h4>
	 *   When a field is in error, trap the user's focus until the field is corrected
	 *   <h4>Description:</h4> 
	 *   Add field focus on error action, to all writeable text fields in the page with an
	 *   id attribute, with the exception of those with the class 'nofocusonerror'.
	 *   If you wish to disable this 'feature' entirely for a particular page, set the flag
	 *   misys._config.disableFocusTrap to true
	 *   @method _focusFieldsOnError
	 *    
	 */
	function _focusFieldsOnError(){
		//	summary:
		//		  When a field is in error, trap the user's focus until the field is corrected
		//  description:
	    //        Add field focus on error action, to all writeable text fields in the page with an 
		//        id attribute, with the exception of those with the class 'nofocusonerror'.
		//
		//		  If you wish to disable this 'feature' entirely for a particular page, set the flag
		//		  misys._config.disableFocusTrap to true
		
		var validationBoxRegex = /ValidationTextBox/;
		
		if(!m._config.disableFocusTrap) {
			d.query(".widgetContainer *[id].dijitTextBox:not(.dijitReadOnly):not(.nofocusonerror)").
					forEach(function(field){
				var widget = dj.byId(field.getAttribute("widgetid"));
				if(validationBoxRegex.test(widget.get("declaredClass")) && !widget.focusonerror) {
					/*jsl:pass*/
				} else {
					m.connect(widget, "onBlur", _trapFocus);
				}
			});
		}
	}
	/**
	 * <h4>Summary:</h4>
	 *  Keeps the focus in the field if it is in error
	 * <h4>Description:</h4> 
	 * Keeps the focus in the field if it is in error, for any reason other than
	 * having no value.
	 * The guard checking for empty, NaN and null is to handle the various behaviours of
	 * required text, number and date fields when you enter and leave the field without
	 * entering a value ie.
	 * 
	 *  - A required text field will have an empty value;
	 *  - A number field will have NaN (as opposed to undefined if a non-number is entered);
	 *  - A date field will have null (as opposed to undefined if an invalid date is entered).
	 *  @method _trapFocus
	 */
	function _trapFocus(){
		//  summary:
	    //        Keeps the focus in the field if it is in error
		//  description: 
		//        Keeps the focus in the field if it is in error, for any reason other than
	    //        having no value.
	    // 
	    //        The guard checking for empty, NaN and null is to handle the various behaviours of
	    //        required text, number and date fields when you enter and leave the field without 
	    //        entering a value ie.
	    // 
	    //        - A required text field will have an empty value;
	    //        - A number field will have NaN (as opposed to undefined if a non-number is entered);
	    //        - A date field will have null (as opposed to undefined if an invalid date is entered).

		var value = this.get("value") + "";
		
		// What follows is the really complicated if/else statement that makes this work across all widget
		// types for all values, and neither traps the user in most cases where they enter spaces nor
		// allows them to get stuck in a focus loop

		if(this.state === "Error" && 
				(!m._config.fieldInError || m._config.fieldInError === this.id) &&
				((typeof value === "undefined") ||
				(value !== "" && value !== "null" && value !== "NaN") ||
				(/Select/.test(this.declaredClass) &&
				this.get("displayedValue") !== "" && !this.item))) {
			m._config.fieldInError = this.id;
			var that = this;
			m.dialog.show("ERROR", m.getLocalization("focusOnErrorAlert"), "", function(){
				that.focus();
			});
		} else {
			if(misys._config.fieldInError === this.id) {
				delete misys._config.fieldInError;
			}
		}
	}
	/**
	 * <h4>Summary:</h4>
	 * This fuction is for resizing the charts in FBCC
	 * @param {Array} charts
	 *  Array of chart widgets to be resized
	 * @param {Boolean} init
	 *  If true, initial width and height is positioned
	 * @method _resizeCharts
	 */
	function _resizeCharts( /*Array*/ charts, 
			  		  		/*Boolean*/ init) {
		// summary:
		//
	
		console.debug("[misys.common] Resizing charts");
		charts.forEach(function(chart){
			var width = chart.parentNode.offsetWidth;
			if(width !== 0) {
				_lastWidth = width;	
			}
			
			if(init) {
				d.attr(chart, "width", _lastWidth);
				d.attr(chart, "height", _defaultChartHeight);
			} else {
				d.attr(chart, "src", d.attr(chart, "alt") + "&chartwidth=" + _lastWidth);
			}
		});
	}
	
	/**
	 * <h4>Summary:</h4>
	 * This fuction is for replacing params in a string URL
	 * @param {String} URL
	 *  URL
	 * @param {String} key
	 *  param key
	 * @param {String} value
	 *  param value
	 * @method _setParamsToURLString
	 */
	function _setParamsToURLString( /*String*/ url, /*String*/ key, /*String*/ value) {
		
		key = encodeURI(key); 
		value = encodeURI(value);
		var finalURL;

        if (url.indexOf('?') === -1) {
        	finalURL = url + '?' + key + '=' + value;
        }
        else {
        	var splitURL = url.split('?')[0];
        	var splitParams = url.split('?')[1].split("&");
        	
            var i = splitParams.length; 
            var x; 
            while (i--) {
                x = splitParams[i].split('=');

                if (x[0] == key) {
                    x[1] = value;
                    splitParams[i] = x.join('=');
                    break;
                }
            }

            if (i < 0) { 
            	splitParams[splitParams.length] = [key, value].join('='); 
            }

            //this will reload the page, it's likely better to store this until finished
            finalURL = splitURL + '?' + splitParams.join('&');
        }
	
		return finalURL;
	}
	
/**
 * <h4>Summary:</h4>
 * This function is for resizing grids in FBCC
 * Inside this we are calling resize() and update() method.
 * @param {Array} grids
 *  Grids to be resized
 * @method _resizeGrids
 */
	function _resizeGrids( /* Array */ grids) {
		// summary:
		//
		
		console.debug("[misys.common] Resizing grids");
		grids.forEach(function(gridNode){
			var grid = dj.byId(gridNode.id);
			if(grid) {
				if(!window.isTopElementToBeFocussed || !window.isToPreventTableHeaderFocusAlways) {
					grid.resize();
				}
				grid.update();
			}
		});
	}
	/**
	 * <h4>Summary:</h4>
	 * Opens a new popup window
	 * <h4>Description:</h4> 
	 * We distinguish between Dialogs, which are in-page overlays (see misys.dialog.*) and
	 * popups, which are simply new windows (see misys.popup.*);
	 * Note: Don't change the popup window name without also changing the SELENIUM
	 * test; name is used to select the window
	 * @param {String} url
	 * @param {String} name
	 *  Name of the window
	 * @param {String} props
	 *  Properties for the window
	 * @method _openPopup
	 */
	function _openPopup( /*String*/ url,
						 /*String*/ name,
						 /*String*/ props) {
		// summary:
		//	Opens a new popup window
		//
		// description:
		//		We distinguish between Dialogs, which are in-page overlays (see misys.dialog.*) and
		//		popups, which are simply new windows (see misys.popup.*);
		//
		//		Note: Don't change the popup window name without also changing the SELENIUM
		// 		test; name is used to select the window
		
		var windowName = name || misys.getLocalization("transactionPopupWindowTitle"),
		    windowProps = props || "width=800,height=500,resizable=yes,scrollbars=yes",
		    popupWindow = d.global.open(url, windowName, windowProps);
		
		console.debug("[misys.common] Opening a standard popup with name", windowName, "at URL", url);
		if(!popupWindow.opener){
			popupWindow.opener = self;
		}

		popupWindow.focus();
	}
	
	// TODO Should this be a validation?
	/**
	 *  <h4>Summary:</h4>
	 *  Check if the template ID is unique across all products, with an AJAX call.
	 *  @param {dijit._Widget || DomeNode} node 
	 *  Id of the template or the node itself
	 *  @method _isUniqueTemplateId
	 */
	function _isUniqueTemplateId( /*dijit._Widget || DomNode*/ node) {
		//  summary:
	    //        Check if the template ID is unique across all products, with an AJAX call.
		
		var widget = dj.byId(node),
			value = widget.get("value"),
		    unique = true;
		
		var subProductCodeValue;
		if(dj.byId("sub_product_code"))
		{
			subProductCodeValue = dj.byId("sub_product_code").get("value");
		}else
		{
			subProductCodeValue = "*";
		}
		
		if(value !== "") {
			console.debug(
					"[misys.common] Checking that the Template ID is unique across products");
			m.xhrPost( {
				url : m.getServletURL("/screen/AjaxScreen/action/ValidateTemplateId"),
				handleAs : "text",
				content: {
					productcode 	: m._config.productCode,
					templateid 		: value,
					companyid 		: dj.byId("company_id").get("value"),
					subproductcode 	: subProductCodeValue
				},
				sync : true,
				load : function(response, ioArgs) {
					unique = (response.toLowerCase() === "true");
				},
				customError : function(response, ioArgs) {
					console.error("[misys.common] _isUniqueTemplateId error", response, ioArgs);
					unique = false;
				}
			});
			console.debug("[misys.common] _isUniqueTemplateId, response", unique);
		}
		
		return unique;
	}
	/**
	 * <h4>Summary:</h4>
	 * Binds events to commonly found page buttons.
	 * In this method we are covering all the buttons cancelButton,systemSaveButton etc
	 * For each type of button attach a different event.
	 * @method _bindButtons
	 */
	function _bindButtons() {
		// Summary:
		//		Bind events to commonly found page buttons
		
		if(d.query(".cancelButton").length > 0 || d.query(".cancelBkButton").length > 0) {
			console.debug("[misys.common] Connecting button event handlers ...");
			d.query(".saveButton").forEach(function(btn) {
				m.connect(dj.byId(d.attr(btn, "widgetid")), "onClick", function(){
					m.submit("SAVE");
				});
			});
			d.query(".systemSaveButton").forEach(function(btn) {
				m.connect(dj.byId(d.attr(btn, "widgetid")), "onClick", function(){
					m.submit("SYSTEM_SUBMIT");
				});
			});
			d.query(".saveTemplateButton").forEach(function(btn) {
				m.connect(dj.byId(d.attr(btn, "widgetid")), "onClick", function(){
					m.submit("SAVE_TEMPLATE");
				});
			});
			d.query(".submitButton").forEach(function(btn) {

				var trans = dj.byId("transaction_confirmation_details");
				
				var callback = function(){
					if(m.commonclient && m.commonclient.submit) 
					{
						m.commonclient.submit("SUBMIT");
					}
					else
					{
						m.submit("SUBMIT");
					}
				}; 
				
				if(trans && trans.get('value') === "Y") 
				{	
					callback = function(){
						window.onbeforeunload = null;
						m.beforeSubmit();
						_submit("SUBMIT");
					};
				}
				
				m.connect(dj.byId(d.attr(btn, "widgetid")), "onClick", callback);
			});
			d.query(".validateButton").forEach(function(btn) {
				m.connect(dj.byId(d.attr(btn, "widgetid")), "onClick", function(){
					m.submit("VALIDATE");
				});
			});
			d.query(".forwardButton").forEach(function(btn) {
				m.connect(dj.byId(d.attr(btn, "widgetid")), "onClick", function(){
					m.submit("FORWARD");
				});
			});
			d.query(".rejectButton").forEach(function(btn) {
				m.connect(dj.byId(d.attr(btn, "widgetid")), "onClick", function(){
					m.submit("REJECT");
				});
			});
			d.query(".returnTransactionButton").forEach(function(btn) {
				m.connect(dj.byId(d.attr(btn, "widgetid")), "onClick", function(){
					m.submit("RETURN_TRANSACTION");
				});
			});
			d.query(".cancelButton").forEach(function(btn) {
				m.connect(dj.byId(d.attr(btn, "widgetid")), "onClick", function(){
					m.submit("CANCEL");
				});
			});
			d.query(".cancelBkButton").forEach(function(btn) {
				m.connect(dj.byId(d.attr(btn, "widgetid")), "onClick", function(){
					// bulk needs its own cancel
					m.submit("CANCEL_BULK_TRANSACTION");
				});
			});
			d.query(".helpButton").forEach(function(btn) {
				m.connect(dj.byId(d.attr(btn, "widgetid")), "onClick", function(){
					m.submit("HELP");
				});
			});
			d.query(".resubmitButton").forEach(function(btn) {
				m.connect(dj.byId(d.attr(btn, "widgetid")), "onClick", function(){
					m.submit("RESUBMIT");
				});
			});
			d.query(".submitBulkButton").forEach(function(btn) {
				m.connect(dj.byId(d.attr(btn, "widgetid")), "onClick", function(){
					// bulk needs its own submit
					m.submit("SUBMITBULK");
				});
			});
			
			
		}
		// Bulk buttons if available
		if(d.query(".cancelBulkButton").length > 0) 
		{
			// Set the action to the bulk screen
			dj.byId("realform").set("action", m.getServletURL("/screen/BulkScreen"));
			
			d.query(".addBulkButton").forEach(function(btn) {
				m.connect(dj.byId(d.attr(btn, "widgetid")), "onClick", function(){
					m.submit("ADD_BULK");
				});
			});
			d.query(".updateBulkButton").forEach(function(btn) {
				m.connect(dj.byId(d.attr(btn, "widgetid")), "onClick", function(){
					m.submit("UPDATE_BULK");
				});
			});
			d.query(".saveTemplateBulkButton").forEach(function(btn) {
				m.connect(dj.byId(d.attr(btn, "widgetid")), "onClick", function(){
					m.submit("SAVE_TEMPLATE_BULK");
				});
			});
			d.query(".cancelBulkButton").forEach(function(btn) {
				m.connect(dj.byId(d.attr(btn, "widgetid")), "onClick", function(){
					m.submit("CANCEL_BULK");
				});
			});
			d.query(".helpButton").forEach(function(btn) {
				m.connect(dj.byId(d.attr(btn, "widgetid")), "onClick", function(){
					m.submit("HELP");
				});
			});
		}

		// Setup the table of contents
		// Delegate TOC events to the container node
		/**
		 * Delegate TOC events to the container node
		 */
		d.query("#toc").delegate("a", "onclick", function(evt){
			
			// Toggle the table of contents 
			if(this.id === "toggleTocLink") {
				m.toggleTOC();
				return;
			}
			
			if(this.id && this.id.indexOf("_") !== -1) {
				var headerId = this.id.substr(this.id.indexOf("_") + 1),
				target = d.byId(headerId),
				transactionDetails = d.byId("transactionDetails"),
				fnc = function() {
					if(d.isIE <= 6) {
						d.window.scrollIntoView(target);
					} else {
						dojox.fx.smoothScroll({
							node: target, 
							win: window
						}).play();
					}
				};
				
				if(transactionDetails && 
					d.isDescendant(target, transactionDetails) &&
						(d.style(transactionDetails, "display") === "none" || 
						 d.style(transactionDetails, "position") === "absolute")) {
					m.toggleTransaction(true, false, fnc);
				} else {
					fnc();
				}
			}
		});
		/**
		 * Delegate ErrorSection events to the container node
		 */
		d.query("#errorSection").delegate("a", "onclick", function(evt){
			
			// Toggle the table of contents 
			if(this.id === "errorLink") {
				m.toggleErrorSection();
				return;
			}
		});
		// Setup bank toggle links
		if (dj.byId("editTransactionDetails"))
		{
			m.connect("editTransactionDetails", "onclick", function(){
				m.toggleTransaction(true, true);
			});
		}
		if (dj.byId("hideTransactionDetails"))
		{
			m.connect("hideTransactionDetails", "onclick", function(){
				m.toggleTransaction(false);
			});
		}
	}
	/**
	 * <h4>Summary:</h4>
	 * 	Attach event handlers to the popup dialog buttons.
	 * This method is covering buttons wih css classes as .saveButton,cancelPopupbutton,.helpPopupButton etc
	 * Find all the nodes with these classes and attach events to them.
	 * @method _bindPopupButtons
	 * 
	 */
	function _bindPopupButtons() {
		// summary:
		//		Attach event handlers to the popup dialog buttons
		
		console.debug("[misys.common] Binding popup button event handlers ...");
		d.query(".savePopupButton").forEach(function(btn) {
			m.connect(dj.byId(d.attr(btn, "widgetid")), "onClick", function(){
				m.dialog.submit("SUBMIT");
			});
		});
		d.query(".cancelPopupButton").forEach(function(btn) {
			m.connect(dj.byId(d.attr(btn, "widgetid")), "onClick", function(){
				m.dialog.submit("CANCEL");
			});
		});
		d.query(".helpPopupButton").forEach(function(btn) {
			m.connect(dj.byId(d.attr(btn, "widgetid")), "onClick", function(){
				m.dialog.submit("HELP");
			});
		});
	}	
	
	/**
	 * <h4>Summary:</h4>
	 * Set up listeners. 
	 * <h4>Description:</h4> 
	 * Please refer inline comments below For each method
	 * listed in m.excludedMethods array, remove the window.onbeforeunload
	 * listener before method invocation.
	 * <b>IMPORTANT:</b> Since the window.onbeforeunload is removed and not reinstated,
	 * care should be taken to decide which methods are to be included in the
	 * m.excludedMethods array. Ideally, only those methods should be included
	 * which are bound to navigate to another page, but where an alert is not
	 * needed. For example - clicking on any system buttons like Save, Submit,
	 * Save Template etc, OR transaction navigations like adding Transaction in
	 * case of Bulk
	 * 
	 * @method _setListeners
	 */
	function _setListeners(){
		// Define the browser level unload listener window.onbeforeunload
		if(m.unloadListener)
		{
			window.onbeforeunload = m.unloadListener;
		}
		
		// For each method listed in m.excludedMethods array, remove the window.onbeforeunload listener before method invocation.
		// IMPORTANT: Since the window.onbeforeunload is removed and not reinstated, care should be taken to
		// decide which methods are to be included in the m.excludedMethods array. Ideally, only those
		// methods should be included which are bound to navigate to another page, but where an alert
		// is not needed. For example - clicking on any system buttons like Save, Submit, Save Template etc, 
		// OR transaction navigations like Add Transaction in case of Bulk
		dojo.forEach(m.excludedMethods, function(item, idx){
			dojox.lang.aspect.advise(item.object, item.method, {
				before: function(){
					m.isSystemButtonClicked = true;
					window.onbeforeunload = null;
				}
			});
		});
		
		//Making Form dirty on adding new or deleting the existing attachment from the Grid Store, 
		if(dijit.byId(attachmntFile))
		{
			dojox.lang.aspect.advise(dijit.byId(attachmntFile).grid.store, ["onSet", "onNew", "onDelete"],{
				after: function(){
					m.isFormDirty = true;
				}
			});
		}
		
		// This is actually a hack to work around an IE behavior: in IE, if the displayed dialog contains links 
		// with passback, the browser alert gets displayed. To avoid this, the window.onbeforeunload listener 
		// is temporarily removed before showing a dialog, and LATER REINSTATED when the dialog is closed,
		// based on conditions. Please refer related changes in misys/_base.js for method dialog.show
		dojox.lang.aspect.advise(m.dialog, "show", {
			before: function(){
				console.debug("Removing window.onbeforeunload for dialog");
				window.onbeforeunload = null;
			}
		});
		
		// Addons - handled as a special scenario. Mark the form dirty if the addons table is modified
		dojox.lang.aspect.advise(m, ["addTransactionAddon", "deleteTransactionAddon", "editTransactionAddon"], {
			after: function(){
				console.debug("Marking form dirty after addons change");
				m.isFormDirty = true;
			}
		});
		
		// Set up onChange listeners for all dojo widgets contained in the transaction forms
		d.query("#fakeform0, #fakeform1").forEach(function(node) {
			console.debug("[misys.common] Setting change listeners for all children of", node.id);
			var form = dj.byId(node.id);
		
			d.forEach(form.getDescendants(), function(child){
				m.connect(child, "onChange", m.markFormDirty);
			});
	
		});
		
		// Remove the window.onbeforeunload listener temporarily if any hyperlink contained in the
		// transaction form is clicked. NOTE that we (almost) immediately reinstate the window.onbeforeunload
		// listener by using setTimeout
		d.query("#fakeform0 a, #fakeform1 a, #fakeform0 img[onclick], #fakeform1 img[onclick]").forEach(function(node) {
			dojox.lang.aspect.advise(node, "onclick", {
				before: function(){
					console.debug("Removing onbeforeunload for link " + node);
					m.isSystemButtonClicked = true;
					window.onbeforeunload = null;
					setTimeout(function(){
						window.onbeforeunload = m.unloadListener;
					}, 50);
				}
			});
		});
		
		// Remove the window.onbeforeunload listener temporarily if icon for downloading an existing file is clicked.
		// NOTE that we (almost) immediately reinstate the window.onbeforeunload listener by using setTimeout
		dojox.lang.aspect.advise(misys, "downloadFile", {
			before: function(){
				console.debug("Removing onbeforeunload for file download");
				m.isSystemButtonClicked = true;
				window.onbeforeunload = null;
				setTimeout(function(){
					window.onbeforeunload = m.unloadListener;
				}, 50);
			}
		});
		
		// Set up onClick listeners for all hyperlinks outside the transaction forms
		dojo.query(".header a, .footer a, .portalMenuItem *").forEach(function(node, idx){ 
			m.connect(node, "onClick", function(/*Event*/ event){
				if(m.isPopupRequired())					
				{	
					var evt = event;
					var targetUrl = _getTargetUrl(evt);
					if(targetUrl !== "")
					{
						dojo.stopEvent(evt);
						m.showUnsavedDataDialog();
					}
					
					var handle = dojo.connect(m, "setUnsavedDataOption", function(){
						if(m.unsavedDataOption !== 'notset')
						{
							var errorMsg = "";
							if(m.unsavedDataOption === 'save')
							{
							//	errorMsg = _submitAsync("SAVE");
								m.saveAsync(targetUrl);
							}
							else if(targetUrl !== "" && errorMsg === "" && m.unsavedDataOption === 'nosave')
							{
								location.href = targetUrl;
							}
						}	
						dojo.disconnect(handle);
					});
				}
			});				
		});
		
		// Set up listeners for events on the left navigation tree
		var navBar = dj.byId("menu_tree");
		if(navBar)
		{
			// Set up onClick listeners for the navigation tree. However, NOTE that only those menu leaf
			// items are affected which are visible upon initial page load.
			// NOTE that the onClick event is triggered only when a leaf element is clicked
			
			// Set up onClick listeners for all child (leaf) elements, whenever a menu node is expanded.
			// This method complements the onClick listener defined immediately above, by listening to
			// menu items as and when they become visible
			d.connect(navBar, "onOpen", function(item, node, event){
				console.log("Item expanded");
				d.forEach(dojo.query("#"+node.id+" span.dijitTreeLabel"), function(child, idx){
					m.connect(child, "onClick", function(/*Event*/ event){
						if(m.isPopupRequired())					
						{	
							var evt = event;
							var targetUrl = _getTargetUrl(evt);
							if(targetUrl !== "")
							{
								dojo.stopEvent(evt);
								m.showUnsavedDataDialog();
							}
							
							var handle = dojo.connect(m, "setUnsavedDataOption", function(){
								if(m.unsavedDataOption !== 'notset')
								{
									var errorMsg = "";
									if(m.unsavedDataOption === 'save')
									{
									//	errorMsg = _submitAsync("SAVE");
										m.saveAsync(targetUrl);
									}
									else if(targetUrl !== "" && errorMsg === "" && m.unsavedDataOption === 'nosave')
									{
										location.href = targetUrl;
									}
								}	
								dojo.disconnect(handle);
							});
						}
					});
				});
			});
		}
		
		console.debug("[misys.common] Successfully completed setting change listeners");
	}
	// This method fetches the target url whenever a navigation event is triggered
	/**
	 * <h4>Summary:</h4>
	 * This method fetches the target url whenever a navigation event is triggered
	 * @param {Event} evt
	 *  Event from which we can get the target url
	 * @method _getTargetUrl
	 * @return targetURL
	 */
	function _getTargetUrl(/*Event*/ evt){
		var evtTarget = evt.target;
		var targetUrl = "";
		if(evtTarget.nodeName === "IMG" && evtTarget.parentNode.nodeName === "A")
		{
			
			if(evtTarget.parentNode.href)
			{
				targetUrl = evtTarget.parentNode.href;
			}
		}
		else if(evtTarget.href)
			{
			targetUrl = evtTarget.href;
			}
		else if(dojo.hasClass(evtTarget, "dijitTreeLabel"))
		{
			var navBar = dijit.byId("menu_tree");
			var selectedItemPath = navBar.attr('path');
			var selectedMenu = dojo.filter(selectedItemPath, function(pathEntry){
				return pathEntry.hasOwnProperty("url");
			});
			if(selectedMenu.length === 1 && selectedMenu[0].url)
			{
				targetUrl = selectedMenu[0].url;
			}
		}
		return targetUrl;
	}
	/**
	 * <h4>Summary:</h4>
	 * This function returns the screen name
	 * @method _getScreenName
	 */
	function _getScreenName(){
		var screen = "";
		var path = misys._config.homeUrl;
		if(misys._config.homeUrl.indexOf("?") != -1)
		{
			path = misys._config.homeUrl.split("?")[0];
		}
		screen = path.substr(path.lastIndexOf("/")+1);
		return screen;
	}
	
	/**
	 * <h4>Summary:</h4>
	 * This function returns the xml for re authentication by product. If result is FULL then formToXML is called to send complete xml.
	 * @method _getScreenName
	 */
	function _getReAuthXml(productCode){
		
		var productsForReauth = ["LC", "BG", "EC", "EL", "IC", "BR", "TF", "SG", "SI", "SR", "IR", "FT", "BK", "SE", "LN", "TD", "LI"];
		
		if(productsForReauth.indexOf(productCode) !== -1)
		{
			if(productCode === 'FT' || productCode === 'BK') {
				return m.formToXML({ignoreDisabled : true});
			}
			return m.formToXML();
		}
		else 
		{
			return "";
		}
	}
	
	
	//
	// Public functions follow
	//
	d.mixin(m, {
		/**
		 * <h4>Summary:</h4>
		 * This fuction performs reauthentication process 
		 * If reauthentication is enabled get parameters for the reauthentication, show reauth dialog.
		 * Throws an error if init paramters are not there for the reauthentication.
		 * @method performReauthentication
		 */
		performReauthentication : function () {		

			var reauth = dj.byId("reauth_perform");
			if(reauth && reauth.get("value") === "Y")
			{
				var paramsReAuth = {};
				 if(d.isFunction(m._config.initReAuthParams)) {
					 paramsReAuth =  m._config.initReAuthParams();
					 m.checkAndShowReAuthDialog(paramsReAuth);
				 }else{
					 console.debug("Doesnt find the function initReAuthParams for ReAuthentication");
					 m.setContentInReAuthDialog("ERROR", "");
					 dj.byId("reauth_dialog").show();
				 }
			} else {
				if(m.isFormDirty && m.isFormDirty === true )
				{
					m.isFormDirty = false;
				}
				dj.byId("TransactionData").set("value", m.formToXML());
				dj.byId(_realformID).submit();
			}
		},
		
		submitCommon : function(type){
			_submit(type);
		},
		
		validateFormsCommon : function()
		{
			return _validateForms(true);
		},
		
		openPopupCommon : function ( url, name, props) {
			_openPopup(/*String*/ url,
				 /*String*/ name,
				 /*String*/ props);
		},
		
		/**
		 * <h4>Summary:</h4>
		 * This function sets the reauthentication content that came
		 * from server on ajax call into the diolog
		 * @param {HTML} response
		 *  If response equals to '01' the there is no need for reauthentication.
		 *  If response equals to 'ERROR' then destroy all the widgets and show error dialog.
		 * 	Otherwise do perform reauthentication.
		 * @param {Collection} ioArgs
		 * @method setContentInReAuthDialog 
		 */
		setContentInReAuthDialog : function ( /* html */ response, /* Collection */ ioArgs) {		
			
			// Summary This function sets the reauthentication content that came
			// from server on ajax call into the diolog
			var widgets;
			switch(response)
			{
				case '01':
					// incase reauth not needed
					// no need of reauth dialog
					if(d.isFunction(m._config.nonReauthSubmit))
					{   
					    m._config.nonReauthSubmit();
					}
					else
					{
						if(dj.byId("TransactionData"))
						{
							dj.byId("TransactionData").set("value", m.formToXML());
						}
						dj.byId(_realformID).submit();
					}
					break;
				
				case 'ERROR':
				   // incase error in getting reauth type
					if(d.byId('reauth_dialog_content'))
				    { 
				    // Destroy all previous widgets and containers
				     widgets = dj.findWidgets(d.byId("reauth_dialog_content"));
				     d.forEach(widgets, function(w) {
				         w.destroyRecursive(false);
				     });
				     
				     // Destroy all the Children
				     d.empty("reauth_dialog_content");
				    
				    }
					d.byId("reauth_dialog_content").innerHTML = m.getLocalization("technicalErrorReauth");	
					d.parser.parse("reauth_dialog_content");
					dj.byId("reauth_password").set("required", false);
					m.animate('wipeOut', d.byId("reauth_otp_response_sb"));
					m.toggleClassInlineBlock("reauth_sb", false);
					break;
				case 'EXCHANGE_RATE_ERROR':
					if(d.byId('reauth_dialog_content'))
				    { 
				    // Destroy all previous widgets and containers
				     widgets = dj.findWidgets(d.byId("reauth_dialog_content"));
				     d.forEach(widgets, function(w) {
				         w.destroyRecursive(false);
				     });
				     
				     // Destroy all the Children
				     d.empty("reauth_dialog_content");
				    
				    }
					d.byId("reauth_dialog_content").innerHTML = m.getLocalization("technicalErrorExchangeRate");	
					d.parser.parse("reauth_dialog_content");
					dj.byId("reauth_password").set("required", false);
					m.animate('wipeOut', d.byId("reauth_otp_response_sb"));
					m.toggleClassInlineBlock("reauth_dialog_password", false);
					m.toggleClassInlineBlock("reauth_sb", false);
					break;
				default:				
					// incase reauth needed and got the reauth type
					if(d.byId('reauth_dialog_content'))
				    { 
					    // Destroy all previous widgets and containers
					     widgets = dj.findWidgets(dojo.byId("reauth_dialog_content"));
					     d.forEach(widgets, function(w) {
					         w.destroyRecursive(false);
					     });
					     // Destroy all the Children
					     d.empty("reauth_dialog_content");
				     }
				
					
					d.byId("reauth_dialog_content").innerHTML = response;								
					d.parser.parse("reauth_dialog_content");	
					m.toggleClassInlineBlock("reauth_sb", true);
					
					
					break;
			}
		},
		/**
		 * <h4>Summary:</h4>
		 *  This function is to make a Ajax call to find out whether re-auth is needed.
		 *  If needed it builds the re-auth pop up screen.
		 *  @param {Collection} paramsReAuth
		 *   Parameters for performing reauthenication
		 *  @method checkAndShowReAuthDialog
		 */
		checkAndShowReAuthDialog : function ( /* Collection */ paramsReAuth) {		

			// Summary: This function is to make a Ajax call to find out whether re-auth is needed 
			//          if needed it builds the re-auth pop up screen
			
			if(misys.commonclient && misys.commonclient.checkAndShowReAuthDialog)
			{
				misys.commonclient.checkAndShowReAuthDialog(paramsReAuth);
				return;
			}
			console.debug('[FormEvents] Checking for reAuth requirement');
		/*	var xml 		= [],
			xmlArray	= paramsReAuth.xml;
			if(xmlArray) {
	
				if(m._config.xmlTagName) {
						xml = ["<", m._config.xmlTagName, ">"];
				}
				xmlArray.forEach(function(field){
					if(dj.byId(field)) {
						var widget = dj.byId(field);
						xml.push("<"+field+">"+widget.get("value")+"</"+field+">");
					}
				});
				
				if(m._config.xmlTagName) {
					xml.push("</", m._config.xmlTagName, ">");
				}
			}*/
			m.xhrPost({
			url : m.getServletURL("/screen/AjaxScreen/action/ReAuthenticationAjax"),
			handleAs : "text",
			sync : true,
			preventCache: true,
			content : {
				productCode : paramsReAuth.productCode,
				subProductCode : paramsReAuth.subProductCode,
				transactionTypeCode : paramsReAuth.transactionTypeCode,
				subTransactionTypeCode : (paramsReAuth.subTransactionTypeCode) ? paramsReAuth.subTransactionTypeCode : '',
				entity : (paramsReAuth.entity) ? paramsReAuth.entity : '',
				currency : (paramsReAuth.currency) ? paramsReAuth.currency : '',
				amount : (paramsReAuth.amount) ? paramsReAuth.amount : '',
				tnxAmt : (paramsReAuth.tnxAmt) ? paramsReAuth.tnxAmt : '',
				bank_abbv_name : (paramsReAuth.bankAbbvName) ? paramsReAuth.bankAbbvName : '',
				xml : _getReAuthXml(paramsReAuth.productCode),
				mode : dj.byId("mode") ? dj.byId("mode").get("value") : '',
				operation : dj.byId("realform_operation") ? dj.byId("realform_operation").get("value") : "",
				option : paramsReAuth.option ? paramsReAuth.option : ""
			},		
			load : function(response, ioArgs)
			{   
				    if(!(response.indexOf('SC_UNAUTHORIZED') === -1))
				    {
				    	misys.showSessionOverDialog();
				    }
				    else
				    {
						m.setContentInReAuthDialog(response, ioArgs);
						if (""+response+"" != '01')
						{
							dj.byId("reauth_dialog").show(); 
						}
				    }
			},
			customError : function(response, ioArgs)
			{
				console.debug("Error in ReAuthenticationAjax Call");
				console.error(response);
				m.setContentInReAuthDialog("ERROR", ioArgs);
				dj.byId("reauth_dialog").show();
			}

			});
		
		},
		
		getQueryParameterByName: function(name, url) {
		    name = name.replace(/[\[\]]/g, '\\$&');
		    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
		        results = regex.exec(url);
		    if (!results) {
		    	return null;
		    }
		    if (!results[2]) {
		    	return '';
		    }
		    return decodeURIComponent(results[2].replace(/\+/g, ' '));
		},		
		
		isAngularProductUrl : function (productCode, subProductCode) {
		    if (!subProductCode || subProductCode === 'null' || subProductCode === '') {
		    	var ret = misys._config.angularProducts && misys._config.angularProducts.indexOf(productCode) > -1;
		    	var restrictedAngularScreens = [];
		    	
		    	if(typeof misys._config['restrictedangularscreen'] != 'undefined' && misys._config.restrictedangularscreen != null) {
		    		restrictedAngularScreens = misys._config.restrictedangularscreen.replace(/[\[\]']+/g,'').split(', ');
				}
				
		    	var isAngularScreenRestricted = false;
		    	for(var i=0;i<restrictedAngularScreens.length;i++) {
		    		if(window.location.href.indexOf(restrictedAngularScreens[i]) > -1){
		    			isAngularScreenRestricted = true;
		    		}
		    	}
		    	if(ret && productCode && productCode !== '' && ((typeof misys._config['restrictedangularproductcode'] != 'undefined') && misys._config.restrictedangularproductcode != null && misys._config.restrictedangularproductcode.indexOf(productCode) > -1) && ((isAngularScreenRestricted) || (window.location.href.indexOf('MessageCenterScreen') > -1) || (window.location.href.indexOf('classicUXHome') > -1))) {
		    		ret= false; 
		    	}
		      return ret; 
		    } else {
		      return misys._config.angularSubProducts && misys._config.angularProducts && misys._config.angularProducts.indexOf(productCode) > -1 && m.isSubProductCodeValidForAngularUrl(misys._config.angularSubProducts,subProductCode);
		    }
		},
		
		isSubProductCodeValidForAngularUrl: function contains(subProductsList, subProductCode) {
			var subProductsListString = subProductsList.replace("[","").replace("]","");
			var validSubproductList = subProductsListString.split(", ");
			if(validSubproductList.includes(subProductCode)){
    	         return true;
    	    }
			return false;
    	},
    	
		  
		/**
		 * <h4>Summary:</h4> :
		 * This function sets the content of Transaction confirmation dialog.
		 * @param {HTML} response
		 * @param {Collection} ioArgs
		 * @method setTnxConfirmationDetailsInDialog
		 */
		setTnxConfirmationDetailsInDialog : function ( /* html */ response, /* Collection */ ioArgs) {		
			
			//Set the dialog content
			switch(response)
			{
				case 'ERROR':
	
					console.debug('Error while getting transaction confirmation details');
					m.dialog.show("ERROR",  m.getLocalization("technicalErrorTnxConfirmationDetails"));
					break;
																		
				default:				
					console.debug('Content received from server for confirmation details', response);
					var onOkCallback = function(){
						console.debug("Confirmation details accepted");
						m.performReauthentication();
					};
	
					var onCanceCallback = function(){
						console.debug("Confirmation details cancelled");
						var realformOperation = dj.byId("realform_operation");
						realformOperation.set("value","");
						m.dialog.hide();
					};
	
					m.dialog.show("CONFIRMATION", response, "", null, null, "", onOkCallback, onCanceCallback, null);
					break;
			}
		},
		/**
		 * <h4>Summary:</h4>
		 *  This function is to make a Ajax call to check and display the details of a confirmation of transaction.
		 *  @method checkAndShowReAuthDialog
		 */
		checkAndShowTnxConfirmationDetailsDialog : function () {		

			console.debug('[FormEvents] Checking for transactionConfirmationDetails requirement');
			
			m.xhrPost({
			url : m.getServletURL("/screen/AjaxScreen/action/TransactionConfirmationDetailsAction"),
			handleAs : "text",
			sync : true,
			preventCache: true,
			content : {
				transactionData : m.formToXML()
			},		
			load : function(response, ioArgs)
			{   
				    if(!(response.indexOf('SC_UNAUTHORIZED') === -1))
				    {
				    	misys.showSessionOverDialog();
				    }
				    else
				    {
						m.setTnxConfirmationDetailsInDialog(response, ioArgs);
				    }
			},
			customError : function(response, ioArgs)
			{
				console.debug("Error in TransactionConfirmationDetailsAction Call");
				console.error(response);
				m.setTnxConfirmationDetailsInDialog("ERROR", ioArgs);
			}

			});
		
		},
		/**
		 * With angular menu enabled, the top colmask height needs to be reset based on the top angular menu height. 
		 */		
		angularMenuReSize: function () {
			var height1 = document.querySelector(".ui-menubar-root-list").offsetHeight;
			var dojoContent = document.querySelector(".colmask");
			if(dojoContent && dojoContent !== "undefined") {
				if(height1 >= 42) { 
					dojoContent.style.top = "80px"; 
				}
			}	
		},
		
		/**
		 * Sets the focus to the top element as configured
		 * And also sets the skip to links appropriate to the configuration
		 * Input reset flag will notify whether to reset the flags or not 
		 */		
		_setupFocus: function(resetFlag) {
			m.hideCollabWindow();
			if(resetFlag) {
				m.setAccessibilityFlags();
			}
			
			if(window.isTopElementToBeFocussed) { 
				m.focusTopElement();
			}
			
			if(window.isTopElementToBeFocussed && resetFlag) { 
				setTimeout(function(){
					window.isTopElementToBeFocussed = false; 
				 }, window.topElementFocusTimeout);
			}
		},
		
		/**
		 * Hides the collabaration window and TOC window for accessibility. 
		 */			
		hideCollabWindow: function() {
			if(!window.isFloatingFormSummaryMenuEnabled) { 
				if(dojo.query(colbortionWindow) && dojo.query(colbortionWindow)[0] != undefined) {
					dojo.style(dojo.query(colbortionWindow)[0],'display','none');
				}
				
				if(dojo.query('#toc') && dojo.query('#toc')[0] != undefined) {
					dojo.style(dojo.query('#toc')[0],'display','none');
				}
			}
		},		
		
		/**
		 * Sets the link for the skiptocontent link for accessibility. 
		 */		
		skipToMenuLink: function() { 
			// portalMenuBar
			if(!dojo.byId('portalMenuBar')) {
				dojo.style(dojo.byId('skipToMenu'), "display", "none");
			} else { 
				dojo.style(dojo.byId('skipToMenu'), "display", "inline");					
			}
		},
		
				
		/**
		 * Sets the link for the skiptocontent link for accessibility. 
		 */
		skipToContentLink: function() { 
			if(!dojo.byId('GTPRootPortlet')) {
				var firstHeading = dojo.query(".portlet-title")[0];
				var idToSet = dojo.attr(firstHeading, "id"); 
				if(idToSet) {
					dojo.attr( dojo.byId('skipToContent'), 'href', "#"+idToSet);
					dojo.style(dojo.byId('skipToContent'), "display", "block");
				} else { 
					dojo.style(dojo.byId('skipToContent'), "display", "none");					
				}
			}
		},

		/**
		 * Sets the accessibility related flags like aria-describedby/aria-labelledby etc  
		 */
		setAccessibilityFlags : function() {
			
			//Remove the for attribute for a label if the for is empty 
			dojo.query('label').forEach(function(labelDiv) {
				try {
					if(dojo.hasAttr(labelDiv,'for') && dojo.attr(labelDiv,'for') === '') {
						dojo.removeAttr(labelDiv,'for');
					}
				}catch(exe) {
					//ignore the exception 
				}
			}); 
			
			
			//For all the buttons link it to the main heading 
			var buttonIds = ['validateButton','validateButton2','saveButton','saveButton2','submitButton','submitButton2','forwardButton','forwardButton2','rejectButton','rejectButton2','returnTransactionButton','returnTransactionButton2','templateButton','templateButton2','menuCancelButton','cancelButton2','helpButton','helpButton2','previewButton','previewButton2','submitBulkButton','submitBulkButton2','addBulkButton','addBulkButton2','updateBulkButton','updateBulkButton2','templateBulkButton','templateBulkButton2','cancelBulkButton','cancelBulkButton2','helpButton','helpButton2','uploadFormButton','uploadFormButton2','resubmitButton','resubmitButton2','sySubmitButton'];
			dojo.forEach(buttonIds, function(entry, i){
				if(dojo.query('#'+entry)[0]) {
					dojo.attr(dojo.query('#'+entry)[0],ariaDescrib,'mainScreenHeadingText');
				}
			});
			
			//Set the language dropdown menu's role as menu instead of button 
			if(dojo.query(langMenu) && dojo.query(langMenu)[0] !== undefined) {
				dojo.attr(dojo.query(langMenu)[0], 'role', 'menu');
				dojo.attr(dojo.query(langMenu)[0], ariaDescrib, 'language-menu-instructions');
				//dijitReset dijitStretch dijitButtonContents dijitDownArrowButton
			}
			
			//Favourites menu
			if(dojo.query(bookmrkMenu) && dojo.query(bookmrkMenu)[0] !== undefined) {
				dojo.attr(dojo.query(bookmrkMenu)[0], ariaDescrib, 'bookmark-menu-instructions');
				dojo.attr(dojo.query(langMenu)[0], 'role', 'listbox');
				//dijitReset dijitStretch dijitButtonContents dijitDownArrowButton
			}
			//
			dojo.query("#bookmarkToolTipDialog .bookmark").forEach(function(deleteBookmarkContainer){
				var firstA = dojo.query("a",deleteBookmarkContainer)[0];
				var secondA = dojo.query("a",deleteBookmarkContainer)[1];
				var labelConent =  dojo.attr(dojo.query('img',secondA)[0],'title') + " " + dojo.attr(firstA,'innerHTML') + " " + misys.getLocalization('bookmark') ;
				dojo.style(secondA,"display","inline");
				dojo.attr(secondA,'aria-label',labelConent);
			});			
			
			
			/*if(dojo.query(colbortionWindow) && dojo.query(colbortionWindow)[0] != undefined) {
				dojo.style(dojo.query(colbortionWindow)[0],'display','none');
			}
			
			if(dojo.query('#toc') && dojo.query('#toc')[0] != undefined) {
				dojo.style(dojo.query('#toc')[0],'display','none');
			}*/
			
			
			//Set the accessibility flags for the table headers 
			dojo.query(".dojoxGridHeader table.dojoxGridRowTable").forEach(function(tableHeader){
				try {
					dojo.attr(dojo.query('tbody>tr>th',tableHeader)[0],ariaDescrib,'table-head-instructions');
				} catch (exc) {
					// ignore the exception
					console.debug(exc);
				}
			});
			
			//Set the accessibility flags for the table data  
			dojo.query(".dojoxGridContent ").forEach(function(tableRow){
				try {
					if (dojo.query('div>div.dojoxGridRow>table>tbody>tr>td',tableRow)[0])
					{
						dojo.attr(dojo.query('div>div.dojoxGridRow>table>tbody>tr>td',tableRow)[0],ariaDescrib,'table-body-instructions');
					}
				} catch (exc) {
					// ignore the exception
					console.debug(exc);
				}
			});
			
			//Set the top menu navigation instructions to the first element 
			if(dojo.query(popuMenuItem) && dojo.query(popuMenuItem)[0] != undefined) {
				try {
					dojo.attr(dojo.query(popuMenuItem)[0],ariaDescrib,'top-menu-instructions');
				} catch (exc) {
					// ignore the exception
					console.debug(exc);
				}
			}
			
			
			//Toggle boxes like Search buttons 
			dojo.query(".collapsingImgSpan, .collapsingImgSpanLeftSide").forEach(function(selectTag){
				var helpAriaDescribedBy = 'toggle-box-inst';  
				//For the search criteria if any help is set then link the help text to the search Criteria
				if(dojo.attr(selectTag, 'onclick') === 'javascript:misys.toggleSearchGrid();') { 
					if(dojo.query(scrhCrieteria) && dojo.query(scrhCrieteria)[0] !== undefined ) {
						var searchHelpTextId;
						var searchHelpTag = dojo.query(scrhCrieteria)[0];
						if(dojo.attr(searchHelpTag,'id')) {
							searchHelpTextId = dojo.attr(searchHelpTag,'id');
						} else { 
							dojo.attr(searchHelpTag,'id','searchHelpText');
							searchHelpTextId = dojo.attr(searchHelpTag,'id');
						}
						helpAriaDescribedBy = helpAriaDescribedBy + ' ' + searchHelpTextId;
					} 
				}
				dojo.attr(selectTag, ariaDescrib,helpAriaDescribedBy);
			});
			
			//Buttons/images/links which open the dialog boxes 
			dojo.query("#GTPRootPortlet img, #GTPRootPortlet a, #GTPRootPortlet button, #GTPRootPortlet span, #GTPRootPortlet div ").forEach(function(selectTag){
				try {
					var clickURL = "";
				    if(dojo.attr(selectTag,'onClick')) {
				    	clickURL = dojo.attr(selectTag,'onClick');  
				    } else if(dojo.attr(selectTag,'href')) { 
				    	clickURL = dojo.attr(selectTag,'href');  
				    }
				    if(clickURL && clickURL.length>0) {
				    	//List of URLs with the popup 
				    	if(clickURL.indexOf('misys.showSearchDialog') !== -1 || clickURL.indexOf('misys.popup.showReporting') !== -1 || clickURL.indexOf('misys.popup.showPreview') !== -1 || clickURL.indexOf('misys.showBankTypeDialog')  !== -1 || clickURL.indexOf('misys.showSearchUserAccountsDialog') !== -1 || clickURL.indexOf('misys.showEntityDialog') !== -1 ) {
				    		dojo.attr(selectTag, ariaDescrib,'dialog-link-inst');
				    	}
				    } else {
				    	//Only applies to the images for e.g. //content/images/open_dialog.png" /content/images/search.png
				    	var imgUrl = "";
				    	if(dojo.attr(selectTag, 'src')) {
				    		imgUrl = dojo.attr(selectTag, 'src');
							if(imgUrl.indexOf('open_dialog.png') !== -1 || imgUrl.indexOf('search.png') !== -1 ) {
								//Need to get the container in the parent heirarchy. 
								var parentNode = selectTag.parentNode;
								//if(dojo.attr(parentNode, 'dojoattachpoint') &&   ) {
								if(dojo.attr(parentNode, 'dojoattachpoint') && (dojo.attr(parentNode, 'dojoattachpoint') === 'containerNode')  && !(dojo.attr(parentNode,'onClick')) ) {
									parentNode = parentNode.parentNode;
								}
								dojo.attr(parentNode,ariaDescrib,'dialog-link-inst');
							}
				    	}
				    }			    
				} catch (exc) {
					// ignore the exception
					console.debug(exc);
				}
			});

			/*
			//For alt missing images setting the alternate text. These should not be coming here ideally.  
			dojo.query("img").forEach(function(imageTag){
				if(!dojo.hasAttr(imageTag,'alt')){					
					dojo.attr(imageTag,'alt',misys.getLocalization('imageAlt'));
				}
			});
			*/
			
			
		},
		
		
		/**
		 * Focuses the first/top most element in the page. 
		 * Also sets the action container elements linked to the H1 tag. 
		 * Here right now below elements are assumed to be available in each page. 
		 */
		focusTopElement : function ()  {
			var screenTitle = '';
			var mainTitleHomePageElement; 
			if(window.isTopElementFirstH1 && dojo.query(GTPRootPotlet)) {
				try {
					dojo.query(GTPRootPotlet)[0].focus();
					screenTitle = dojo.attr(dojo.query(GTPRootPotlet)[0],'innerHTML');
					dojo.attr(dojo.query(GTPRootPotlet)[0],'id','mainScreenHeadingText');
					//mainTitleHomePageElement = dojo.query(GTPRootPotlet)[0];
				} catch (exc) {
					if(dojo.query(h1portletTitle) && dojo.query(h1portletTitle)[0] !== undefined ) { 
						dojo.query(h1portletTitle)[0].focus();
						//mainTitleHomePageElement = dojo.query(h1portletTitle)[0];
					} else if(dojo.query(h2portletTitle) && dojo.query(h2portletTitle)[0] !== undefined ) {
						dojo.query(h2portletTitle)[0].focus();
						mainTitleHomePageElement = dojo.query(h2portletTitle)[0];
					}
				}
			}
			else if(dojo.byId('skipToMenu')) {
				dojo.byId('skipToMenu').focus();
				//mainTitleHomePageElement = dojo.byId('skipToMenu');
			} else if(dojo.byId('helpDesk')) {
				dojo.byId('helpDesk').focus();
				//mainTitleHomePageElement = dojo.byId('helpDesk');
			} else if(dojo.byId('manageProfile')) {
				dojo.byId('manageProfile').focus();
				//mainTitleHomePageElement = dojo.byId('manageProfile');
			}
			if(mainTitleHomePageElement && mainTitleHomePageElement !== undefined ) { 
				//Linking the top bar entrees like the logged in user, logged in time and other details to the main title. 
				dojo.attr(mainTitleHomePageElement, ariaDescrib,'welcome userId lastLoginSpanID');
			}
		},
		/**
		 * <h4>Summary:</h4>
		 *   Perform page onload events
		 * <h4>Description:</h4> 
		 * Note that this overwrites the function of the same name defined
		 * in misys._base.You can't use 'this' to reference misys in anything
		 * that is passed to setTimeout/setInterval. This is because its really
		 * window.setTimeout and 'this' always refers to the window. So just use m. or
		 * misys.
		 * @method onLoad
		 * 
		 */
			onLoad : function(){
			//  summary:
		    //         Perform page onload events
			//
			//  dsecription: 
			//         Note that this overwrites the function of the same name defined
			//         in misys._base.
			//
			//		   By the way, remember that you can't use 'this' to reference misys in anything
			//         that is passed to setTimeout/setInterval. This is because its really 
			//         window.setTimeout and 'this' always refers to the window. So just use m. or
			//         misys.
			//
				m.onBeforeLoad();
			
				
				
				/**
				 * Get the closest matching element up the DOM tree.
				 * @private
				 * @param  {Element} elem     Starting element
				 * @param  {String}  selector Selector to match against
				 * @return {Boolean|Element}  Returns null if not match found
				 */
				var getClosest = function ( elem, selector ) {

					// Element.matches() polyfill
					if (!Element.prototype.matches) {
						Element.prototype.matches =
							Element.prototype.matchesSelector ||
							Element.prototype.mozMatchesSelector ||
							Element.prototype.msMatchesSelector ||
							Element.prototype.oMatchesSelector ||
							Element.prototype.webkitMatchesSelector ||
							function(s) {
								var matches = (this.document || this.ownerDocument).querySelectorAll(s),
									i = matches.length;
								while (--i >= 0 && matches.item(i) !== this) {console.debug("");}
								return i > -1;
							};
					}

					// Get closest match
					for ( ; elem && elem !== document; elem = elem.parentNode ) {
						if ( elem.matches( selector ) ) {		return elem;			}
					}

					return null;

				};
				
				function swapNodes(n1, n2) {

				    var p1 = n1.parentNode;
				    var p2 = n2.parentNode;
				    var i1, i2;

				    if ( !p1 || !p2 || p1.isEqualNode(n2) || p2.isEqualNode(n1) ) { return; } 

				    for (var i = 0; i < p1.children.length; i++) {
				        if (p1.children[i].isEqualNode(n1)) {
				            i1 = i;
				        }
				    }
				    for (i = 0; i < p2.children.length; i++) {
				        if (p2.children[i].isEqualNode(n2)) {
				            i2 = i;
				        }
				    }

				    if ( p1.isEqualNode(p2) && i1 < i2 ) {
				        i2++;
				    }
				    p1.insertBefore(n2, p1.children[i1]);
				    p2.insertBefore(n1, p2.children[i2]);
				}
				
				/** MPS-48922 To close Dropdowns when screen resolution is changed **/
				window.onresize = function() {
					 var popupElements = document.getElementsByClassName("dijitPopup dijitComboBoxMenuPopup");
					 for(var i=0;i<popupElements.length;i++) {
						 popupElements[i].style.display = "none"; 
					 }					  
				};
				
				window.setTimeout(function(){ 					
					if(dojo.byId('saveDashboard')) {
						console.log("in save dashboard function");
						dojo.byId('saveDashboard').addEventListener('click',function() {
							var allPortlets = {"level1": [], "level2": [], "level3":[]};
							for(var i=0; i<d.query(homepagePortlet).length;i++) {
								var obj = {};
								var ele = d.query(homepagePortlet)[i];
								if(ele && !getClosest(d.query(homepagePortlet)[i],'.colmid')) {
									if(ele && getClosest(d.query(homepagePortlet)[i],'.colLeft')) {
										console.log("COLLEFT");
										obj["position"] = ele.getAttribute("position");
										obj["id"] = ele.id;
										allPortlets.level1.push(obj);
									} else if(ele && getClosest(d.query(homepagePortlet)[i],'.colRight')){
										
										console.log("COLRIGHT");
										obj["position"] = ele.getAttribute("position");
										obj["id"] = ele.id;
										allPortlets.level2.push(obj);									
									} 
							}
								else {
									console.log("COLMID");
									obj["position"] = ele.getAttribute("position");
									obj["id"] = ele.id;
									allPortlets.level3.push(obj);
								}
								//console.log("Object",obj);
							}
							console.log("allPortlets",allPortlets);
							document.getElementById('_dashboardpositions').value = JSON.stringify(allPortlets);
							console.log("DragdropObj:", document.getElementById('_dashboardpositions').value);
										
							m.xhrPost({
								url : m.getServletURL("/screen/AjaxScreen/action/UserPreferencesAction"),
								handleAs : "text",
								sync : true,
								preventCache: true,
								content : {
									portletPositions : document.getElementById('_dashboardpositions').value, 
									PSML : document.getElementById('DashboardPSML').value,
									operation : 'SAVE',
									themeColor : document.documentElement.style.getPropertyValue('--main-bg-color'),
									textColor : document.documentElement.style.getPropertyValue('--main-text-color'),
									fontType : document.documentElement.style.getPropertyValue('--main-font-family'),
									fontSize : document.documentElement.style.getPropertyValue('--main-font-size')
								},		
								load : function(response, ioArgs)
								{
									window.location.href = m.getServletURL("");
								},
								customError : function(response, ioArgs)
								{
									console.debug("Error in UserPreferencesAction Call");
									console.error(response);
								}
							});							
							
						},false);
					}
					
				}, 100);
				
				var deleteIcon = function(e) {
					console.log('in delete icon fun');
					var closestElem = getClosest(e.target, '.portlet');
					closestElem.style.display = 'none';
				};
				
				if(d.query(".delIcon")[0]) {
					for(var i=0; i<d.query(".delIcon").length;i++) {
						console.log('deliconlength',d.query(".delIcon").length);
						d.query(".delIcon")[i].addEventListener("click", deleteIcon, true);
						console.log(d.query(".delIcon")[i]);
					}
					
					
				}
				
				if(dojo.byId('saveDashboard') && d.query(homepagePortlet)[0]) {
					
					/*for(var i=0; i<d.query(".portlet").length;i++) {console.log('portlets',d.query(".portlet").length);
					d.query(".portlet")[i].setAttribute("draggable","true");
					console.log(d.query(".portlet")[i])
					}*/
				//	var dragDropObj = {"level1": [], "level2": []};
					//var portlet_arr = [];
					for(i=0; i<d.query(homepagePortlet).length;i++) {
						var dEle = d.query(homepagePortlet)[i];
						console.log('portlets',d.query(homepagePortlet).length);
						dEle.setAttribute("draggable","true");					
						dEle.setAttribute("position",i);
						dEle.addEventListener('dragstart', function (e) {
						/*if(dragDropObj.level1 === undefined) {
							dragDropObj["level1"] = [];
						} else if(dragDropObj.level2 === undefined) {
							dragDropObj["level2"] = [];
						}*/
					      e.dataTransfer.effectAllowed = 'copy'; // only dropEffect='copy' will be dropable
					      e.dataTransfer.setData('Text', this.id);
					      console.log('drag start',dEle);// required otherwise doesn't work
					    });
					}
					
					if(d.query(".colContainer")[0]) {
						var parentContainer = d.query(".colContainer")[0];						
						console.log(parentContainer);
						parentContainer.addEventListener('dragover', function (e) {
						    if (e.preventDefault) {e.preventDefault(); } // allows us to drop
						    this.className = 'over';
						    e.dataTransfer.dropEffect = 'copy';						    
						    return false;
						  });
						
						parentContainer.addEventListener('dragenter', function (e) {
						    this.className = 'over';
						    return false;
						  });
						
						parentContainer.addEventListener('dragleave', function () {
						    this.className = '';
						  });
						
						
						parentContainer.addEventListener('drop', function (e) {
							if (e.stopPropagation) { e.stopPropagation(); } 
							//console.log('is this source',e.target.closest(".portlet").outerHTML);
							//var srcDestObj = {"dest":};
							/*var dest = {};
							var src = {};
							var res1 = {};var res2 = {};*/
							
							
							
							var sourceElement = document.getElementById(e.dataTransfer.getData('Text'));
							var destinationElement = getClosest(e.target, '.homepage .portlet');
							var srcPosition = sourceElement.getAttribute("position");
							var destPosition = destinationElement.getAttribute("position");
							
							//Swap Src/Dest Nodes
							swapNodes(sourceElement,destinationElement);
							//Exchange positions
							sourceElement.setAttribute('position',destPosition);
							destinationElement.setAttribute('position',srcPosition);
							
							console.log('source element-->',sourceElement);							
							console.log('destination element-->',destinationElement);	
							console.log('source element-->pos',sourceElement.getAttribute("position"));							
					});
				}
			}	
				/** MPS-59116 To show the Data Grid on home page if customer has less/limited permissions **/
				 if(dojo.query(".maincontent.homepage") && dojo.query(".maincontent.homepage")[0] !== undefined){
					 var onGoingTaskDIv = dojo.byId('CustomerOngoingTasksList')?true:false;
					 var internalNewsDiv= dojo.byId('InternalNewsPortlet')?true:false;
					 var outstandingChartDiv = dojo.byId('OutstandingPerProductChartPortlet')?true:false;
					 var tradeEventDiv = dojo.byId('TradeEventsGridPortlet')?true:false;
					 var accountSummaryDiv = dojo.byId("HomeAccountSummaryListPortlet")?true:false;
					 var actionRequiredDiv = dojo.byId("ActionRequiredPortlet")?true:false;
					 var opicsListBalanceDiv = dojo.byId("OpicsAccountListPortletPlusBalance")?true:false;
					 if(!onGoingTaskDIv && !internalNewsDiv && !outstandingChartDiv && !tradeEventDiv && !accountSummaryDiv && !actionRequiredDiv && !opicsListBalanceDiv)
					 { 	
						 if(dojo.byId("RatePortlet")){
					 		dojo.style("RatePortlet", "width", 10);
					 		dojo.style("RatePortlet", "position", "relative");
					 		dojo.style("RatePortlet", "left", "100%");
						 }
						 if(dojo.byId("ratesGrid")){
					 		dojo.style("ratesGrid", "width", 10);
					 		dojo.style("ratesGrid", "position", "relative");
						 }
					 }
				}
				 
			var p1 = function() {
					try {
						if(dojo.byId('footerMain') && dojo.byId('footerHtml')) {
							dojo.byId('footerHtml').style.cssText = 'display:none !important';
						}
						if(dojo.query('.homepage') && window.dontShowRouter && window.dontShowRouter === true) {
							//Main home page with classic dashboard with modern UX 
							dojo.style(dojo.query('.colContainer')[0], 'padding-top', '70px');
							dojo.byId('layout').style.cssText = 'padding:0px 24px 0px 24px !important';
							if(dojo.query('.colMask')[0]) {
								dojo.style(dojo.query('.colMask')[0], 'position', 'static');
							}
						}
					} catch(err) {
						//Do nothing. 
					}
					m._setupFocus(false);
					_setupGrids();
					_setupSearchFields();
					if(m._config.saveUnsavedData && m._config.saveUnsavedData === true){
						_setListeners();
					}

					var angularMenu = document.querySelector(".ui-menubar-root-list");
					if(angularMenu && angularMenu !== "undefined") { 
						m.angularMenuReSize(); 
						window.addEventListener('resize', m.angularMenuReSize());
					}	
				},
				p2 = function() {
					_setupTopicSubscriptions();
					_bindTabs();
					_focusFieldsOnError();
					m.resizeCharts();
					_setupCollaboration(); 
					_bindButtons();
					m._setupFocus(true);
				};
			
			return this._onLoad(p1, p2);
		},
		
		
		
		// Hook to perform any page specific tasks before the onLoad method is executed
		/**
		 * <h4>Summary:</h4>
		 * Hook to perform any page specific tasks before the onLoad method is executed
		 * @method onBeforeLoad
		 */
		onBeforeLoad : function(){
			if(window.isAccessibilitySkiptoLinksEnabled) {
				m.skipToMenuLink();
				m.skipToContentLink();
			}
		},
		/**
		 * <h4>Summary:</h4> Calls the confirmation dialog for specific actions.
		 * Otherwise, it passes the submit type to the _submit function.
		 * 
		 * <h4>Description:</h4> The behaviour of this function is slightly different in
		 * debug mode. In this case, we parse any bank-side fields and generate
		 * the XML first. This means that if you click submit but cancel the
		 * confirmation dialog, the XML is still generated and written to the
		 * Firebug/Chrome console, so it can be used for debugging.
		 * 
		 * This will act as an onClick or onSubmit event handler, so 'this' is
		 * not guaranteed to refer to the misys object
		 * 
		 * The default action is SAVE.
		 * 
		 * One thing to note is that the XML outputted to the JavaScript console
		 * in DEBUG mode specifically excludes disabled fields (i.e. hidden
		 * fields, conditionally enabled fields, etc.) as otherwise, in the case
		 * where the use hits 'cancel' and halts the submission, we would have
		 * to reenable all those fields again.
		 * @param {String} type
		 *  Type of submission (SUBMIT, DRAFT, APPROVE, REJECT, etc).
		 * @method submit
		 */
		submit : function( /*String*/ type) {
			//  summary:
		    //        Calls the confirmation dialog for specific actions. Otherwise, it passes the
			//        submit type to the _submit function.
			//  description:
			//        The behaviour of this function is slightly different in debug mode. 
			//        In this case, we parse any bank-side fields and generate the XML first. 
			//        This means that if you  click submit but cancel the confirmation dialog, the 
			//        XML is still generated and written to the Firebug/Chrome console, so it can 
			//        be used for debugging.
			//
			//		  This will act as an onClick or onSubmit event handler, so 'this' is not 
			//        guaranteed to refer to the misys object
			//
			//		  The default action is SAVE.
			//
			//		  One thing to note is that the XML outputted to the JavaScript console in 
			//		  DEBUG mode specifically excludes disabled fields (i.e. hidden fields,
			//		  conditionally enabled fields, etc.) as otherwise, in the case where the
			//		  use hits 'cancel' and halts the submission, we would have to reenable all
			//	      those fields again. 
			//
			//		  TODO Arguably, SUBMIT should be the default behaviour
					
			// Prepare default message and callback
		if(misys.commonclient && misys.commonclient.submit)
		{
			misys.commonclient.submit(type);
		}
		else
		{
			var message = m.getLocalization("saveTransactionConfirmation"),
		    callback = function()
			{
				if (type === "SUBMITBULK")
				{
					m.submitBulk(_validateForms);
				}
				else
				{
					m.beforeSubmit();
					_submit(type);
				}
			};
		//var originalOperationValue = ""; 
			
		 if(dj.byId("realform_operation") && (dj.byId("realform_operation").get("_resetValue")!==""))
		 {
			 originalOperationValue = dj.byId("realform_operation").get("_resetValue");
		 }
		console.debug("[misys.common] Performing a", type, "form action");
		switch(type){
		 case "VALIDATE":
		 	 _submit(type);
		 	 return;
			break;
		 case "SUBMITBULK":
		 case "SUBMIT":
			m.setCustomConfirmMessage();
			var submitMsg = m._config.globalSubmitConfirmationMsg;
			
			var warningMessagesSize = misys._config.warningMessages ? misys._config.warningMessages.length : 0;
			
			if(warningMessagesSize > 0)
			{
				var i;
				var messagesWithLineBreaks = "<b><ol>";
				for(i = 0; i < warningMessagesSize; i++)
				{
					messagesWithLineBreaks += ("<li>"+ misys._config.warningMessages[i]+ "</li>");
				}
				
				messagesWithLineBreaks += "</ol></b>";
				
				submitMsg = misys.getLocalization("submitTransactionConfirmationWithWarning",[ messagesWithLineBreaks ]);
			
			}
			
			message = (submitMsg && submitMsg !== "") ? submitMsg : m.getLocalization("submitTransactionConfirmation");
			
			//Raja: below code can be moved to setCustomConfirmMessage function of individual product binding
			var eucp = dj.byId("eucp_flag");
			if(eucp && !eucp.get("disabled")){
				 message = m.getLocalization("submitEUCPTransactionConfirmation");
			}
			break;
		 case "SYSTEM_SUBMIT":
			 var applicableWarningMsg = m.formApplicableWarningMsg();
			 message = applicableWarningMsg ? applicableWarningMsg : message;
			 callback  = function(){
				 _submit(type);
			 };
			break;
		 case "SAVE_TEMPLATE":
			 message = m.getLocalization("saveTemplateConfirmation");
			 callback  = function(){
				 _submit(type);
			 };
			break;
		 case "SAVE_REPORT_TEMPLATE":
			 message = m.getLocalization("saveTemplateConfirmation");
			 callback  = function(){
				 _submit(type);
			 };
			break; 
		 case "CANCEL":
			 message = m.getLocalization("cancelTransactionConfirmation");
			 callback  = function(){
				 _submit(type);
			 };
			break;
		 case "CANCEL_BULK_TRANSACTION":
			 message = m.getLocalization("cancelTransactionConfirmation");
			 callback  = function(){
				 _submit(type);
			 };
			break;		
		 case "REJECT":
			 message = m.getLocalization("rejectTransactionConfirmation");
			 callback  = function(){
				 _submit(type);
			 };
			break;
		 case "RETURN_TRANSACTION":
			 message = m.getLocalization("returnTransactionConfirmation");
			 callback  = function(){
				 _submit(type);
			 };
			break;	
		 case "HELP":
			 _openPopup(m._config.onlineHelpUrl, m.getLocalization("onlineHelpWindowTitle"),
					"width=1000,height=700,resizable=yes,scrollbars=yes");
			return;
			break;
		 case "APPROVE":
			 message = m.getLocalization("submitTransactionConfirmation");
			 dj.byId('realform_operation').set('value', 'APPROVE_FEATURES');
	         callback  = function(){
	        	 _submit(type);
			 };
			break;
		 case "DELETE":
			 message = m.getLocalization("deleteMCTransactionsConfirmation");
			 dj.byId("realform_operation").set("value", "APPROVE_FEATURES");
	         callback  = function(){
	        	 _submit(type);
			 };
			 break;
		 case "CHECKER_WARN_DELETE_ROLE_SUBMIT":
			 var roleName = dijit.byId("featureid").get("value");
			 var roleType = dijit.byId("roletype").get("value");
			 var isRoleMapped = false;
				m.xhrPost({
					url : m.getServletURL("/screen/AjaxScreen/action/CheckRoleMapping"),
					handleAs : "json",
					preventCache : true,
					sync : true,
					content: {role_name : roleName,
							  role_type : roleType},
					load : function(response, args){
						isRoleMapped = response.isRoleMapped;
					},
					error : function(response, args){
						isRoleMapped = false;
						console.error("Checking Role mapping  error ", response);
					}
				});
				
				if(isRoleMapped)
				{
					message = m.getLocalization("deleteMappedRoleConfirmation");
				}
				else
				{
					message = m.getLocalization("deleteRoleConfirmation");
				}
			 dj.byId("realform_operation").set("value", "APPROVE_FEATURES");
	         callback  = function(){
	        	 _submit(type);
			 };
			 break;
		 case "REVERT":
			 message = m.getLocalization("revertMCTransactionsConfirmation");
			 dj.byId("realform_operation").set("value", "REVERT_FEATURES");
	         callback  = function(){
	        	 _submit(type);
			 };
			 break;
		 case "RETURN":
			 message = m.getLocalization("returnMCTransactionsConfirmation");
			 dj.byId("realform_operation").set("value", "RETURN_FEATURES");
	         callback  = function(){
	        	 _submit(type);
			 };
			 break;
		 case "DRAFT":
			 dj.byId("realform_operation").set("value", "DRAFT_FEATURES");
	         callback  = function(){
	        	 _submit(type);
			 };
			 break;
		 case "MAKER_SUBMIT":				
			  m.setCustomConfirmMessage();
			  submitMsg = m._config.globalSubmitConfirmationMsg;
			 message = m.getLocalization("submitTransactionConfirmation");
			 message = submitMsg ? submitMsg : message;
			 callback  = function(){
				 _submit(type);
			 };
			break;
			
		 case "MAKER_BENE_SUBMIT":
			 message = m.getLocalization("submitTransactionConfirmationForMasterBeneficiary");
			 callback  = function(){
			 _submit("MAKER_SUBMIT");
			  };
				 break;
		 case "MAKER_BENE_FILE_UPLOAD_SUBMIT":
			  message = m.getLocalization("submitTransactionConfirmationForBeneficiaryFileUpload");
			  callback  = function(){
			  _submit("MAKER_SUBMIT");
			  };
			  break;
		 case "CHECKER_BENE_SUBMIT":
			    message = m.getLocalization("submitTransactionConfirmationForMasterBeneficiary");
			    dj.byId('realform_operation').set('value', 'APPROVE_FEATURES');
			    callback  = function(){
			    _submit("APPROVE");
			     };
			    break;
		case "CHECKER_BENE_FILE_UPLOAD_SUBMIT":
			   message = m.getLocalization("submitTransactionConfirmationForBeneficiaryFileUpload");
			   dj.byId('realform_operation').set('value', 'APPROVE_FEATURES');
			   callback  = function(){
			   _submit("APPROVE");
			    };
			 break;
		 case "AUTO_FORWARD_SUBMIT":
			 message = m.getLocalization("submitAutoForwardTransactionConfirmation");
			 callback  = function(){
				 _submit(type);
			 };
			break;
		 case "ADD_BULK":
			 message = m.getLocalization("addBulkConfirmation");
			 callback  = function(){
				 _submit(type);
			 };
			break;
		 case "UPDATE_BULK":
			 message = m.getLocalization("updateBulkConfirmation");
			 callback  = function(){
				 _submit("ADD_BULK");
			 };
			break;
		 case "CANCEL_BULK":
			 message = m.getLocalization("cancelBulkConfirmation");
			 callback  = function(){
				 _submit(type);
			 };
			break;
		case "SAVE_TEMPLATE_BULK":
			 message = m.getLocalization("saveTemplateBulkConfirmation");
			 callback  = function(){
				 _submit(type);
			 };
			break;
		case "RESUBMIT":
			 message = m.getLocalization("resubmitConfirmation");
			 callback  = function(){
				 _submit(type);
			 };
			break;
		default:
			break;
		}

		console.debug("[misys.common] Request XML", 
							this.formToXML({ignoreDisabled : true}));
		console.debug("[misys.common] Note that this XML *excludes* disabled fields (such",
					  "as hidden fields and conditionally enabled fields) as if you click",
					  "'cancel' and halt the submit, they will remain enabled, which may",
					  "appear to be a bug. For a complete XML tree, execute misys.formToXML()",
					  "in the console");
		
		var onCancelCallback = function() {
			if(originalOperationValue !== "")
			{
				dj.byId("realform_operation").set("value", originalOperationValue);
			}
			// Reinstate the onbeforeunload if it exists
			if(m.unloadListener)
			{
				window.onbeforeunload = m.unloadListener;
			}
		};
		m.dialog.show("CONFIRMATION", message, "", callback, "", "", "", onCancelCallback);
		}	
		},
		
		acceptLegalText: function () {
			_submit("LEGAL_TEXT_SUBMIT");
		},
		
		
		submitBulkNoAutoForward : function(/*String*/ type)
		{
			 _submit(type);
		},
		/**
		 * <h4>Summary:</h4>
		 * This is the Asynchronous version of submit("SAVE_XXX"). All validations are done silently.
		 * @param {String} Target Url
		 * @method saveAsync
		 */
		saveAsync : function(/*String*/ targetUrl) {
			//  summary:
			//		This is the Asynchronous version of submit("SAVE_XXX"). All validations are done silently.
		    //  description:
			//
			console.debug("[misys.common] Request XML", 
								this.formToXML({ignoreDisabled : true}));
			console.debug("[misys.common] Note that this XML *excludes* disabled fields (such",
						  "as hidden fields and conditionally enabled fields) as if you click",
						  "'cancel' and halt the submit, they will remain enabled, which may",
						  "appear to be a bug. For a complete XML tree, execute misys.formToXML()",
						  "in the console");
			var type;
			
			if(d.query("#draftButton").length > 0){
				type = "DRAFT"; 
				dj.byId('realform_operation').set('value', 'DRAFT_FEATURES');
			}
			else{
				type = "SAVE";
			}
			
			var errorMsg = _submitAsync(type);
			
			if(errorMsg !== "")
			{
				m.unsavedDataOption = 'notset';
				var onErrorCallback = function(){dijit.byId("entity")?dijit.byId("entity").focus():null;};
				m.dialog.show("ERROR", errorMsg, "", onErrorCallback);
			}
			else
			{
				var realForm = d.byId("realform");
				d.attr(realForm, "action", m.getServletURL("/screen/AsyncScreen"));
				
				var urlParams = {
						realscreen: _getScreenName()
				};
				
				m.xhrPost({
					url: m.getServletURL("/screen/AsyncScreen") + "?" + d.objectToQuery(urlParams),
					preventCache: true,
					sync: true,
					form : realForm,
					handleAs: "json",
					load: function(response, args){
						if(response.status === 'success')
						{
							location.href = targetUrl;
							m.isFormDirty = false;
						}
						else if(response.status === 'failure')
						{
							m.unsavedDataOption = 'notset';
							m.dialog.show("ERROR", m.getLocalization(response.message));
						}	
					},
					error: function(response, args){
						console.error("Error during Save");
						m.dialog.show("ERROR", m.getLocalization("technicalError"));
					}
				});
			}
		},
		/**
		 * <h4>Summary:</h4> Converts a form and its children to XML.
		 * 
		 * <h4>Description:</h4> We use the
		 * standard dijit.byId(form).get("value") as a reference, which returns a JSON
		 * object constructed from the [name, value] pairs of each of the form's
		 * children. Look at _FormMixin.js in Dijit core for more details.
		 * 
		 * If you wish a field to be excluded from the generated XML, simply do not give
		 * it a 'name' attribute, and it will be ignored. If you need specific
		 * formatting for the field value, you have 3 options:
		 * 
		 * 1. If it's a custom widget, override _getValueAttr and implement your
		 * formatting there; 2. Alternatively, you may implement toXML, the value of
		 * which will be taken in preference to get('value'); 3. If you can't do either
		 * of these, look at the private method _normalize in this file, for other
		 * options.
		 * 
		 * If you need specific formatting for the XML as a whole (which is sometimes
		 * required for certain system features screens), then create the property
		 * xmlTransform as a function on the misys._config object. This should take an
		 * XML string as its single argument, and output the transformed XML.
		 * 
		 * Note that in 90% of cases, this function takes no arguments. So
		 *  - if ignoreDisabled is false (which it is except for the XML outputted in
		 * the debug), then disabled fields will be enabled, so they can be collected -
		 * id takes the id of the form. If this is not passed, we select all forms with
		 * class .validate - xmlRoot is the root node of the generated XML. If it is not
		 * passed, we use the value of misys._config.xmlTagName
		 * @param {JSON} init
		 *  Set of initial properties.
		 * @method formToXML
		 */
		formToXML : function( /*JSON*/ init) {
			// summary:
			//    Converts a form and its children to XML
			//
			// description: 
			//	  We use the standard dijit.byId(form).get("value") as a reference, which
			//	  returns a JSON object constructed from the [name, value] pairs of
			//	  each of the form's children. Look at _FormMixin.js in Dijit core for
			//	  more details.
			//
			//	  If you wish a field to be excluded from the generated XML, simply do not
			//	  give it a 'name' attribute, and it will be ignored. If you need specific
			//	  formatting for the field value, you have 3 options:
			//
			//	  1. If it's a custom widget, override _getValueAttr and implement your
			//		 formatting there;
			//	  2. Alternatively, you may implement toXML, the value of which will be taken
			//		 in preference to get('value');
			//	  3. If you can't do either of these, look at the private method _normalize in
			//		 this file, for other options.
			//
			//	  If you need specific formatting for the XML as a whole (which is sometimes required
			//	  for certain system features screens), then create the property xmlTransform as a 
			//	  function on the misys._config object. This should take an XML string as its single 
			// 	  argument, and output the transformed XML.
			//
			//	  Note that in 90% of cases, this function takes no arguments. So
			//
			//		- if ignoreDisabled is false (which it is except for the XML outputted
			//		  in the debug), then disabled fields will be enabled, so they can be collected
			//		- id takes the id of the form. If this is not passed, we select all forms
			//		  with class .validate
			//		- xmlRoot is the root node of the generated XML. If it is not passed, we
			//		  use the value of misys._config.xmlTagName
			
			// TODO We should validate forms with .validate but collect XML for forms 
			// 		with .form (for example), to handle cases where a form should be 
			//		collected but not validated
			
			var params = {
					selector: ".validate",
					xmlRoot: m._config.xmlTagName,
					ignoreDisabled: false
				},
				xml = [];
			
			// Init the params
			d.mixin(params, init);
			
			if(params.xmlRoot) {
				xml = ["<", params.xmlRoot, ">"];
			}

			// If there are any disabled fields, enable them before
			// submitting, otherwise they won't be included in the XML
			if(!params.ignoreDisabled) {
				d.query(".dijitDisabled").forEach(function(w){
					var disabledField = dj.byId(d.attr(w, "widgetid"));
					if(disabledField) {
						disabledField.set("disabled", false);
					}
				});
			}	
			
			d.query(params.selector).forEach(function(node) {
				console.debug("[misys.common] Building XML for form", node.id);
				var form = dj.byId(node.id),
					widgets = {},
					values, widget, declaredClass, value;
				
				d.forEach(form.getDescendants(), function(widget){
					if(!widget.name || widgets[widget.name]){ return; }
					widgets[widget.name] = widget;
				});
				
				// Now that all fields are enabled and ready, collect the form value
				values = form.get("value");
				
				for(var name in values) {
					if(widgets.hasOwnProperty(name)) {  // don't traverse the prototype chain
						widget = widgets[name];
						declaredClass = widget.declaredClass;

						if(widget.toXML) {
							value = widget.toXML();
							value = (!value) ? "" : value;
						}
						else if(name === "org_narrative_description_goods" || 
								name === "org_narrative_documents_required" || 
								name === "org_narrative_additional_instructions" ||
								name === "org_narrative_special_beneficiary" ||
								name === "org_narrative_special_recvbank"){
							value = dojox.html.entities.decode(widget.value,dojox.html.entities.map);
						}
						else {
							value = _normalize(values[name], declaredClass);
						}
						
						// If the widget defines its own XML tag, use the tag as provided by this widget
						if (widget.xmlTagName) {
							xml.push(value);
						} else {
							xml.push("<", name, ">", value, "</", name, ">");
						}
					}
				}
			});
			
			if(params.xmlRoot) {
				xml.push("</", params.xmlRoot, ">");
			}
			
			//E2EE is not enabled for Dialog submission
			var dialogForm = false;
			if(dj.byId("xhrDialog") && dj.byId("xhrDialog").open)
			{
				dialogForm = true;
			}

			if(m._config.hasOwnProperty("xmlTransform") && d.isFunction(m._config.xmlTransform)) 
			{
				if(m.e2ee_transaction && m.e2ee_transaction.enabled === true && !dialogForm)
				{
					return m.e2ee_transaction.encryptData(m._config.xmlTransform(xml.join("")));
				}
				else
				{
					return m._config.xmlTransform(xml.join(""));
				}
			} 
			
			if(m.e2ee_transaction && m.e2ee_transaction.enabled === true && !dialogForm)
			{
				return m.e2ee_transaction.encryptData(xml.join(""));
			}
			else
			{
				return xml.join("");
			}
		},
		/**
		 * <h4>Summary:</h4> Utility function to generate an XML string from a given
		 * field or reference
		 * 
		 * <h4>Description:</h4> e.g. for the field
		 * 
		 * &lt;div data-dojo-type="dijit.form.TextBox" id="myField1" name="myField"
		 * value="&myValue"&gt;&lt;/div&gt;
		 * 
		 * the following node will be generated
		 * 
		 * <myField>&amp;myValue</myField>
		 * 
		 * Note that we use the name, and not the ID. Therefore, there could be
		 * duplicate tags in a given XML structure, if this is not correctly
		 * managed by the developer
		 * 
		 * If no name is found, we return the empty string.
		 * @param {Dijit._Widget || String} node
		 *  Node/widget to be converted to XML string. 
		 * @method fieldToXML 
		 */
		fieldToXML : function( /*Dijit._Widget | String*/ node) {
			// summary:
			//		Utility function to generate an XML string from a given field or reference
			//
			// description:
			//		e.g. for the field
			//
			//  <div data-dojo-type="dijit.form.TextBox" id="myField1"
			//					name="myField" value="&myValue"></div>
			//
			//	    the following node will be generated
			//
			//  <myField>&amp;myValue</myField>
			//
			//	Note that we use the name, and not the ID. Therefore, there could be duplicate
			//  tags in a given XML structure, if this is not correctly managed by the developer
			//
			//	If no name is found, we return the empty string.
			
			var field = dj.byId(node), 
				fieldName = field.get("name"),
				tag = [];
			
			if(fieldName) {
				tag.push("<", fieldName, ">",
						d.trim(dojox.html.entities.encode(field.get("value"), 
								dojox.html.entities.html)),
						"</", fieldName, ">");
			}
			
			return tag.join("");
		},
		/**
		 * <h4>Summary:</h4> Utility function to generate an XML string from a given
		 * DOM element identified by its node name.
		 * 
		 * If no element is found, we return the empty string.
		 * @param {DOM fragment} dom
		 * @param {String} nodeName 
		 * @method getDomNode 
		 */
		getDomNode : function( /*Dom Fragment*/ dom, 
				  			   /*String*/ nodeName) {
			//  summary:
			//          Gets the tag nodeName and its value from the
			//          DOM fragment

			var nodes = dom.getElementsByTagName(nodeName),
				xml = [],
				node;
			
			if(nodes.length > 0) {
				xml.push("<", nodeName, ">");
				node = nodes[0].childNodes[0];
				if(node && node.nodeValue) {
					xml.push(dojo.isString(node.nodeValue)?dojox.html.entities.encode(node.nodeValue, dojox.html.entities.html) : node.nodeValue);
				}
				xml.push("</", nodeName, ">");
			}

			return xml.join("");
		},
		/**
		 * <h4>Summary:</h4>
		 *  Gets the tag nodeName and its value from the
		 *  DOM fragment
		 *  @param {DOM Fragment} dom
		 *  @param {String} Node name
		 *  @method getDomValue
		 */
		getDomValue : function( /*Dom Fragment*/ dom, 
	  			   /*String*/ nodeName) {
			//  summary:
			//          Gets the tag nodeName and its value from the
			//          DOM fragment
			
			var nodes = dom.getElementsByTagName(nodeName),
				xml = [],
				node;
			
			if(nodes.length > 0) {
				node = nodes[0].childNodes[0];
				if(node && node.nodeValue) {
					xml.push(dojo.isString(node.nodeValue)?dojox.html.entities.encode(node.nodeValue, dojox.html.entities.html) : node.nodeValue);
				}
			}
			
			return xml.join("");
			},

		// TODO Needs another refactor; we should probably take JSON as a param instead
		// of an ever increasing array, cause noone remembers the order of the params
		/**
		 * <h4>Summary:</h4> Toggle the display and enabling/disabling of fields
		 * 
		 * <h4>Description:</h4> 
		 * - guardPassed true when some test is passed 
		 * - fieldIDs array of ids of non-required fields. Pass null if there
		 * are none 
		 * - requiredFieldIDs array of ids of required fields. Pass
		 * null if there are none
		 * - keepFieldValues true if the current
		 * value of the fields should be preserved
		 * - keepFieldsEnabled true if the field should remain enabled at all times
		 * @param {Boolean} guardPassed
		 * @param {Array} fieldIDs
		 * @param {Array} requiredFieldIDs
		 * @param {Boolean} keepFieldValues
		 * @param {Boolean} keepFieldsEnabled
		 * @method toggleFields
		 * 
		 */
		toggleFields : function(/*Boolean*/ guardPassed,
		          				/*Array*/ fieldIDs, 
		          				/*Array*/ requiredFieldIDs,
		          				/*Boolean*/ keepFieldValues,
		          				/*Boolean*/ keepFieldsEnabled) {
			//  summary:
			//        Toggle the display and enabling/disabling of fields
			//  description:
			//      - guardPassed true when some test is passed
			//      - fieldIDs array of ids of non-required fields. Pass null if there are none
			//      - requiredFieldIDs array of ids of required fields. Pass null if there are none.
			//      - keepFieldValues true if the current value of the fields should be preserved
			//      - keepFieldsEnabled true if the field should remain enabled at all times  
			
			var requiredPrefix = m._config.requiredFieldPrefix || "*", 
				allFields = requiredFieldIDs,
				requiredStartIndex = 0,
				checkboxRegex = /Check/,
				dateRegex = /Date/,
				timeRegex = /Time/;
			
			// Setup array, with non-required in first half
			if(fieldIDs && d.isArray(fieldIDs)) {
				if(requiredFieldIDs && d.isArray(requiredFieldIDs)) {
					allFields = fieldIDs.concat(requiredFieldIDs);
				} else {
					allFields = fieldIDs;
				}
				requiredStartIndex = fieldIDs.length;
			}

			d.forEach(allFields, function(id, i){
				var field = dj.byId(id);
				if(field) {
					// Clear the value
					if(!guardPassed && !keepFieldValues) {
						var declaredClass = field.declaredClass;
						var clearValue = "";
						if(checkboxRegex.test(declaredClass)) {
							clearValue = false;
						}
						else if(dateRegex.test(declaredClass) || (timeRegex.test(declaredClass))) {
							clearValue = null;
						}
						field.set("value", clearValue);
					}
		
					if(keepFieldsEnabled)
					{
						field.set("readOnly", false);
						field.set("disabled", false);
					}
					else
					{
						field.set("readOnly", !guardPassed);
						field.set("disabled", !guardPassed);
					}

					// Setup required fields
					if(i >= requiredStartIndex) {
						field.set("required", guardPassed);
						// If field is not required, call validate to remove the "error" style from previous calls
						// (Check validate function exists, since it currently doesn't for textareas)
						if(!guardPassed && field.validate) {
							field.validate(false);
						}

						// Set the fields row class attribute and required prefix,
						// to signal a required field.
						var row = d.byId(id + "_row");
						if(row) {
							var fieldLabel = d.query("label[for="+id+"]")[0];

							// Add required class to row
							d.toggleClass(row, "required", guardPassed);

							// Add the required prefix
							var labelString = "";
							if(guardPassed) {
								if(fieldLabel &&
										fieldLabel.innerHTML.indexOf(requiredPrefix) === -1) {
									// setting a checkbox as required makes no sense
									if(!(checkboxRegex.test(declaredClass))) {
										d.place(d.create("span", {
											"class" : "required-field-symbol",
											innerHTML : requiredPrefix
										}), fieldLabel, "first");
									}
								}
							} else {
								if(fieldLabel && 
										fieldLabel.innerHTML.indexOf(requiredPrefix) != -1) {
									// TODO We should show/hide the span, cause this probably
									// causes a reflow
									d.query("span", fieldLabel).orphan();
								}
							}
						}
					}
				}
			});
		}, 
		
		// TODO I think this is already covered by the toggleFields function
		// David R on 09/2011: I don't think so, this function allows to 
		// 	set a field to a certain state regardless of the previous one. 
		// But there is definitely duplicated code between the two functions.
		// Mannan: toggleFields(required, null, [node], true, true) does the same
		/**
		 * <h4>Summary:</h4> Set a field mandatory or not
		 * 
		 * <h4>Description:</h4> => Set Dojo validation on or off => Add a red star
		 * before label when mandatory 
		 * Warning : not working yet with Complex date !
		 * @param {Dijit._Widget || DomNode ||String} node
		 * @param {Boolean} required
		 * @method toggleRequired
		 */
		toggleRequired : function( /*dijit._Widget || DomNode || String*/ node,
                				   /*Boolean*/ required) {
			// 	summary:
			//		Set a field mandatory or not
			//
			//  description:
			//		=> Set Dojo validation on or off
			//		=> Add a red star before label when mandatory
			//  	Warning : not working yet with Complex date !
			
			var field = dj.byId(node);
			if (field){
				field.set("required", required);
				var listObj = d.query("#"+field.id+"_row > label");
				listObj.forEach(function(label){
					//Always remove old required
					d.query("span", label).orphan();
					//Add only if needed
					if(required) {
						d.create("span", {innerHTML:"*", "class":"required-field-symbol"}, 
												label, "first");
					}		
				});
			}
		},
		/**
		 * <h4>Summary:</h4> Set the state of a Dijit field
		 * @param {dijit._Widget} node
		 * @param {Boolean} isValid
		 * @method setFieldState
		 * 
		 */
		setFieldState : function( /*dijit._Widget*/ node, 
				 	   			  /*Boolean*/ isValid) {
			//
			// summary:
			//        Set the state of a Dijit
			//
			// TODO There must be a way of doing this thru standard dijit functions?

			node.state = (isValid) ? "" : "Error";
			node._setStateClass();
			dj.setWaiState(node.focusNode, "invalid", !isValid);
		},
		/**
		 * <h4>Summary:</h4> 
		 * Show a popup of confirmation to allow the deletion of a record.
		 * And do a post request after that.
		 * @param {String} strTitle
		 * @param {Object} args
		 * @method confirmDelete
		 * 
		 */
		confirmDelete : function( /*String*/ strTitle,
		                          /*Object*/ args) {
			//  summary:
			//         Show a popup of confirmation to allow the deletion of a record
			
			// TODO Should this be here? No reason that it needs to be abstracted
			
			if(strTitle.indexOf("<")!==-1)
			{
			strTitle = strTitle.replaceAll("<", "&lt;");
			}
			
			if(strTitle !== ""){				
				this.dialog.show("CONFIRMATION",
						this.getLocalization("deleteTransactionConfirmation", [strTitle]), "",
						function() {
							m.post(args);
						}
				);				
			}
			else{
				this.dialog.show("CONFIRMATION",
						this.getLocalization("deleteTransactionConfirmationforEmptyTitle"), "",
						function() {
							m.post(args);
						}
				);
			}			
		},
		/**
		 * <h4>Summary:</h4> 
		 * Show a popup of confirmation to allow the deletion of a role.
		 * And do a post request after that.
		 * @param {String} strTitle
		 * @param {Object} args
		 * @method warnDeleteRole
		 * 
		 */
		warnDeleteRole : function( /*String*/ strTitle,
			                /*Object*/ args) {
			//  summary:
			//         Show a popup of confirmation to allow the deletion of a role
			
			// TODO Should this be here? No reason that it needs to be abstracted
			
			if(strTitle.indexOf("<")!==-1)
			{
			strTitle = strTitle.replaceAll("<", "&lt;");
			}
			
			if(strTitle !== ""){
				
				var isRoleMapped = false;
				var roleType = null;
				for(var arg = 0; arg < args.params.length; arg ++)
				{
				    var arr = args.params[arg].name;
				    
				    if(arr == "Role_Type"){
				    	roleType = args.params[arg].value;
				    	break;
				    }
				}
				
				m.xhrPost({
					url : m.getServletURL("/screen/AjaxScreen/action/CheckRoleMapping"),
					handleAs : "json",
					preventCache : true,
					sync : true,
					content: {role_name : strTitle,
							  role_type : roleType},
					load : function(response, args){
						isRoleMapped = response.isRoleMapped;
					},
					error : function(response, args){
						isRoleMapped = false;
						console.error("Checking Role mapping  error ", response);
					}
				});
				
				if(isRoleMapped)
				{
					this.dialog.show("CONFIRMATION",
							this.getLocalization("deleteMappedRoleConfirmation", [strTitle]), "",
							function() {
								m.post(args);
							}
					);
				}
				else
				{
					this.dialog.show("CONFIRMATION",
							this.getLocalization("deleteRoleConfirmation", [strTitle]), "",
							function() {
								m.post(args);
							}
					);
				}
			}
			else{
				this.dialog.show("CONFIRMATION",
						this.getLocalization("deleteTransactionConfirmationforEmptyTitle"), "",
						function() {
							m.post(args);
						}
				);
			}			
		},
		/**
		 * Summary: Show a tooltip message on the given DOM node.
		 * 
		 * <h4>Description:</h4> 
		 * We implement our own wrapper to showTooltip as otherwise
		 * the tooltip will never hide until hideTooltip is manually called.
		 * 
		 * @param {String} message
		 *  Message to be shown with the tool tip
		 * @param {DomNode || String} node
		 *  Node on which tooltip is to be shown
		 * @param {Array} position
		 *  Position for the tool tip
		 * @param {Number}
		 *  Time Out for the tool tip
		 * @method showTooltip
		 * 
		 */
		showTooltip : function( /*String*/message, 
                				/*DomNode || String*/ node, 
                				/*String[] array*/ position, 
                				/*Number*/ timeout) {
			//  summary:
			//        Show a tooltip message on the given DOM node.
			//
			//	description:
			//		  We implement our own wrapper to showTooltip as otherwise the tooltip
			//		  will never hide until hideTooltip is manually called.

			var domNode = d.byId(node);
			if(domNode) {
				setTimeout(function(){
					dj.hideTooltip(domNode);
				}, (timeout || _defaultTooltipTimeout));
				return dj.showTooltip(message, domNode, position);
			}
		}, 
	/**
	 * <h4>Summary:</h4> Toggles the bank-side transaction details
	 * 
	 * <h4>Description:</h4> 
	 * Without the third parameter, this method will toggle the display of the transaction
	 * depending on whether it is currently visible or not. When forceShow is true,
	 * we will try to show the transaction regardless.
	 * 
	 * @param {Boolean} show
	 *  Show the details if it is true
	 * @param {Boolean} showConfirmation
	 *  Show confirmation dialog if it is true
	 * @param {Function} callback 
	 *  Call back function
	 * @method toggleTransaction
	 */
		toggleTransaction : function( /*Boolean*/ show,
									  /*Boolean*/ showConfirmation,
				  					  /*Function*/ callback) {
			// <h4>Summary:</h4> 
			//         Toggles the bank-side transaction details
			// description:
			//			Without the third parameter, this method will
			//			toggle the display of the transaction depending 
			//			on whether it is currently visible or not. When forceShow
			//			is true, we will try to show the transaction regardless.

			var transaction = d.byId("transactionDetails"),
				editLink = d.byId("editTransactionDetails"),
				hideLink = d.byId("hideTransactionDetails"),
				fadeInCallback = callback || function(){},
				chain = dojo.fx.chain([]);

//			if(!transaction || !editLink || !hideLink) {
//				// All three must be present to continue, so just fire the
//				// callback and return
//				fadeInCallback();
//				return chain;
//			}
				
			// onLoad, the transactionDetails element will be absolutely positioned
			// offscreen, so the first time we call this, we have to reset it to:
			//
			// 		position: inherit, left:0 , display: none
			//
			//	or, for IE6
			//
			//		position: inherit, right: auto, overflow: auto
			
			// This is to fix an occasional issue with widget instantiation, and also
			// for accessibility reasons (absolutely positioned content is still spoken
			// by a screenreader, display:none isn't)
			
			if(d.style(transaction, "position") === "absolute") {
				d.style(transaction, "position", "inherit");
				d.style(transaction, "display", "none");
				if(d.isIE !== 6) {
					d.style(transaction, "left", 0);
				} else {
					d.style(transaction, "right", "auto");
				}
			}
				
			if(show) {
				var action = function(){
					if(editLink)
					{
						return m.animate("fadeOut", editLink, function(){
							dojo.style(transaction, "display", "none");
							dojo.removeClass(transaction, "offscreen");
							m.animate("wipeIn", transaction, function(){
								m.animate("fadeIn", hideLink, fadeInCallback);
									
								// We have to call resize on all tabcontainers, to fix
								// an occasional rendering issue
								dojo.query(tabContainr).forEach(function(t){
									var tabc = dijit.byId(t.id);
									if(tabc.resize && d.isFunction(tabc.resize)) {
										tabc.resize();
									}
								});
							});
						});
					}
					else
					{
						return fadeInCallback();
					}
					
				};
				if(showConfirmation){
					m.dialog.show(
							"CONFIRMATION",
							m.getLocalization("editTransactionConfirmation"),
							null,
							action);
				} else {
					return action();
				}
			} else {
				return m.animate("wipeOut", transaction, function(){
					dojo.addClass(transaction, "offscreen");
					m.animate("fadeOut", hideLink, function(){
						m.animate("fadeIn", editLink, fadeInCallback);
					});
				});
			}
			
			// default return, empty animation chain
			return chain;
		},
		
		/**
		 * <h4>Summary:</h4>
		 * Toggles the amendment details
		 * 
		 * <h4>Description:</h4>
		 * Without the third parameter, this method will toggle the display of
		 * the amendment details depending on whether it is currently visible or
		 * not. When forceShow is true, we will try to show the amendment
		 * details regardless.
		 * 
		 * @param {Boolean}
		 *            show Show the details if it is true
		 * @param {Boolean}
		 *            showConfirmation Show confirmation dialog if it is true
		 * @param {Function}
		 *            callback Call back function
		 * @method toggleAmdDetails
		 */		
		toggleAmdDetails : function( /* Boolean */ show,
				  /* Boolean */ showConfirmation,
				  /* Function */ callback) {
		
			var transaction = d.byId("amdDetails"),
			editLink = d.byId("showAmdDetails"),
			hideLink = d.byId("hideAmdDetails"),
			fadeInCallback = callback || function(){},
			chain = dojo.fx.chain([]);
			
			// onLoad, the transactionDetails element will be absolutely positioned
			// offscreen, so the first time we call this, we have to reset it to:
			//
			// 		position: inherit, left:0 , display: none
			//
			//	or, for IE6
			//
			//		position: inherit, right: auto, overflow: auto
			
			// This is to fix an occasional issue with widget instantiation, and also
			// for accessibility reasons (absolutely positioned content is still spoken
			// by a screenreader, display:none isn't)
			
			if(d.style(transaction, "position") === "absolute") {
			d.style(transaction, "position", "inherit");
			d.style(transaction, "display", "none");
			if(d.isIE !== 6) {
			d.style(transaction, "left", 0);
			} else {
			d.style(transaction, "right", "auto");
			}
			}
			
			if(show) {
			var action = function(){
			if(editLink)
			{
				return m.animate("fadeOut", editLink, function(){
					dojo.style(transaction, "display", "none");
					dojo.removeClass(transaction, "offscreen");
					m.animate("wipeIn", transaction, function(){
						m.animate("fadeIn", hideLink, fadeInCallback);
							
						// We have to call resize on all tabcontainers, to fix
						// an occasional rendering issue
						dojo.query(tabContainr).forEach(function(t){
							var tabc = dijit.byId(t.id);
							if(tabc.resize && d.isFunction(tabc.resize)) {
								tabc.resize();
							}
						});
					});
				});
			}
			else
			{
				return fadeInCallback();
			}
			
			};
			if(showConfirmation){
			m.dialog.show(
					"CONFIRMATION",
					m.getLocalization("editTransactionConfirmation"),
					null,
					action);
			} else {
			return action();
			}
			} else {
			return m.animate("wipeOut", transaction, function(){
			dojo.addClass(transaction, "offscreen");
			m.animate("fadeOut", hideLink, function(){
				m.animate("fadeIn", editLink, fadeInCallback);
			});
			});
			}
			
			// default return, empty animation chain
			return chain;
		},
		
		
		
		/**
		 * <h4>Summary:</h4> 
		 * Create a table of contents ie. a summary of the form.
		 * @method createTOC
		 */
		createTOC : function(){
			//  summary:
		    //        Create a table of contents ie. a summary of the form.
			
			var toc = d.byId("toccontent");
			if(toc) {
				console.debug("[misys.common] Creating table of contents (TOC) ... ");
			
				// If the menu is already open, close it
				if(d.style(toc, "display") === "block") {
					m.toggleTOC();
				}

				var counter = 0,
				    tocRoot = d.create("ul");
			
				d.query(_tocItemSelector).forEach(function(legend){
					var headerId = legend.id || "link" + counter++;
					legend.id = headerId;
					var legendText;
					try {
						var labelChild = legend.firstChild;
						if(labelChild) {
							legendText = labelChild.innerHTML;
						}
					} catch(err){
						console.error("[m.form.common] There was an error building the TOC!");
						console.error(err);
					}
					 
					if(legendText && legendText !== ""){
						console.debug("[misys.common] Adding TOC entry for", legendText);
						var li = d.create("li");
						var a = d.create("a", {
							href: "javascript:void(0)",
							id: "goto_" + headerId,
							innerHTML: legendText
						}, li);
						d.place(li, tocRoot);
					}
				});
				d.empty(toc);
				d.place(tocRoot, toc);
				console.debug("[misys.common] TOC created with", counter, "entries");
			}
		},
		/**
		 * <h4>Summary:</h4> 
		 * Toggle the display of the table of contents (TOC).
		 * create a TOC if it is not there set attributes like width,opacity etc.
		 *  Use animate function for toggeling.Create a chain with node as tocConatiner
		 *  return chain.play() at the end.
		 * 
		 * @param {Function} callBack
		 * @method toggleTOC
		 * 
		 */
		toggleTOC : function( /*Function*/ callback) {
			//  summary:
		    //        Toggle the display of the table of contents (TOC).
			
			var tocContent = d.byId("toccontent");
			if(tocContent) {
				// If toc is empty, generate the summary
				if(tocContent.innerHTML === "") {
					m.createTOC();
				}
				
				var toggleTocLink = d.byId("toggleTocLink"),
					tocContainer = d.byId("toc"),
					show = (d.style(tocContent, "display") === "none"),
					width = (show) ? d.style(d.byId("toc"), "width") + 6 : 
										d.style(d.byId("toc"), "width") - 6,
					opacity = (show) ? 0.9 : 1,
					animation = (show) ? "wipeIn" : "wipeOut",
					linkText = (show) ? 
							m.getLocalization("hideFormSummaryMessage") : m.getLocalization("showFormSummaryMessage"),
					chain = [],
					animations = [];
					
				chain.push(d.animateProperty({
					node: tocContainer,
					properties: {
						width: width
					}
				}));

				animations = animations.concat(
									m.animate(animation, tocContent, null, true)._animations);
				animations.push(d.animateProperty({
									node: tocContainer, 
									properties: {opacity: opacity}}));
				chain = dojo.fx.chain(chain.concat(animations));
				
				d.connect(chain, "onBegin", function(){
					setTimeout(function(){
						toggleTocLink.innerHTML = linkText;
					}, 500);
				});
				d.connect(chain, "onEnd", function(){
					if(callback && d.isFunction(callback)){callback();}
				});
				
				return chain.play();
			}
		}, 
		/**
		 * <h4>Summary:</h4> 
		 * Returns the object value without spaces and CRLF.
		 * @param {String} str
		 * Object you want to trim
		 * @method trim
		 */
		trim : function( /*String*/ str) {
			//  summary:
			//          Returns the object value without spaces and CRLF.
			
			// TODO Examine regular expression solutions to this, for example
			// return str.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g,'').replace(/\s+/g,' ');
			
			var value = str + "",
			    result = [];
			
			d.forEach(value, function(c) {
				if((c !== "\r") && (c !== "\n")) {
			      result.push(c);
			    }
			});

			return d.trim(result.join(""));
		},
		/**
		 *  <h4>Summary:</h4>
		 *  Move items from one multi-select field to another mulit select field
		 *  @param {digit._Widget} target
		 *   Target widget to which items are to be moved
		 *  @param {digit._Widget}  source
		 *   Source widget from which items are to be moved
		 *  @method addMultiSelectItems
		 */
		addMultiSelectItems : function( /*dijit._Widget*/ target,
										/*dijit._Widget*/ source) {
			//  summary:
			//        Move items from one multi-select to another
			
			var targetWidget = dijit.byId(target),
				sourceWidget = dijit.byId(source);
			
			targetWidget.addSelected(sourceWidget);
			
			// Have to call focus, otherwise sizing issues in Internet Explorer
			sourceWidget.focus();
			targetWidget.focus();
		},
		/**
		 * Summary:
		 *  Insert a value into a textarea at the cursor.
		 *  @param {dijit._Widget} field
		 *  Field in which value to be set
		 *  @param {String} text
		 *  Value to be inserted in ot text area 
		 *  @method insertAtCursor
		 */
		insertAtCursor : function( /*dijit._Widget*/ field,
				   				   /*String*/ text) {
			//  summary:
		    //        Insert a value into a textarea at the cursor.
			
			var fieldNode = field.domNode,
			    fieldValue = field.get("value");
			if(document.selection) {
				field.focus();
				var sel = window.getSelection();
				sel.text = text;
				field.set("value", fieldValue + text);
			} else if(fieldNode.selectionStart || fieldNode.selectionStart == "0"){
				field.set("value", fieldValue + text);
			} else{
				field.set("value", fieldValue + text);
			}
		},
		/**
		 * <h4>Summary:</h4> Resize all the charts in the page
		 * Query for all the nodes with css class as _chartSelector.
		 * resize all ten charts .
		 * @method resizeCharts
		 * 
		 */
		resizeCharts : function() {
			// summary: Resize all the charts in the page
			//

			var charts = d.query(_chartSelector);
			if(charts.length > 0) {
				if(_resizeChartTimeoutHandle) {
					clearTimeout(_resizeChartTimeoutHandle);
				}
				_resizeChartTimeoutHandle = setTimeout(function(){_resizeCharts(charts);}, 
						_defaultResizeTimeout);
			}
		},
		/**
		 * <h4>Summary:</h4>
		 * Resize all the grids in the page
		 * Query for all the grids and resixe the grids by providing a time out.
		 * @method resizeGrids
		 */
		resizeGrids : function() {
			// summary: Resize all the grids in the page
			//
			
			var grids = d.query(_gridClassSelector),
				// Increase the timeout for IE6, give it time to recover
				timeout = (d.isIE <= 6) ? 2000 : 200;
			
			if(grids.length > 0) {
				if(_resizeGridTimeoutHandle) {
					clearTimeout(_resizeGridTimeoutHandle);
				}
				_resizeGridTimeoutHandle =
					setTimeout(function(){_resizeGrids(grids);}, timeout);
			}
		},
		
		/**
		 * <h4>Summary:</h4>
		 * Get an image map for a given chart
		 * @param {String} url
		 * @param {String} targetId
		 * @param {String} dealId
		 * @method getChartImageMap
		 */
		getChartImageMap : function( /*String*/ url,
									 /*String*/ targetId, 
									 /*String*/ dealId, 
									 /*String*/ borrowerId){
			// summary: 
			//		Get an image map for a given chart
			
			m.xhrGet( {
				url : m.getServletURL("/screen/AjaxScreen/action/" + url),
				handleAs : "text",
				contentType: "text/html; charset=utf-8",
				content : {
					getmap: "true",
					dealID: dealId,
					borrowerID: borrowerId
				},
				load : function(response){
					d.byId(targetId).innerHTML = response;
				}
			});
		},
		/**
		 * <h4>Summary:</h4>
		 * This function shows chart dialog
		 * @param {String} id
		 * @method showChartDialog
		 */
		showChartDialog : function( /*String*/ id){
			// summary:
			//
			var chartImg = d.create("img", {
				src: d.attr(d.byId(id), "alt") + "&chartwidth=" + 
			    		_defaultChartInDialogWidth + "&chartheight=" +
			    		_defaultChartInDialogHeight,
				width: _defaultChartInDialogWidth,
				height: _defaultChartInDialogHeight,
				alt: "Chart"
			});

			if(!_chartDialog) {
				_chartDialog = new misys.widget.Dialog({
					onLoad: function(){
						var that = this;
						setTimeout(function() {
							that.show();
						}, dj.defaultDuration);
					}
				});
			}
			
			_chartDialog.set("width", _defaultChartInDialogWidth + 50);
			_chartDialog.set("height", _defaultChartInDialogHeight + 50);
			_chartDialog.set("content", chartImg);
			_chartDialog.show();
		},
		/**
		 * <h4>Summary:</h4>
		 * Return true if node/widget is visible in the viewport
		 * @param {dijit._Widget || DomNode} node
		 * @method isVisible
		 */
		isVisible : function(/*dijit._Widget || DomNode*/ node){
			// summary:
			//		Return true if node/widget is visible in the viewport
			
			if(!node) {
				return false;
			}
			
			var p;
			if(node.domNode){ node = node.domNode; }
			/*jsl:ignore*/
			return (dojo.style(node, "display") != "none") &&
				(dojo.style(node, "visibility") != "hidden") &&
				(p = dojo.position(node), (p.y + p.h >= 0) && 
						(p.x + p.w >= 0) && (p.h && p.w));
			/*jsl:end*/
		},
		/**
		 * This function is overriden in Product Bindings
		 * @method beforeSubmitValidations
		 */
		beforeSubmitValidations : function(){
			// summary:
			// 	 this is overridden in the product bindings

			return true;
		},
		/**
		 * This function is overriden in Product Bindings
		 * @method beforeSaveValidations
		 */
		beforeSaveValidations : function(){
			// summary:
			// 	 this is overridden in the product bindings

			return true;
		},
		
		/**
		 * This function can be overridden in Product Bindings
		 * @method onCancelNavigation
		 */
		onCancelNavigation : function(){
			return m._config.homeUrl;
		},
		/**
		 * This function is overriden in Product Bindings
		 * @method beforeSaveValidations
		 */
		setCustomConfirmMessage : function(){
			//   summary: This sets the customized confirmation message for submit
			// 	 this is overridden in the product bindings
		},
		/**
		 * <h4>Summary:</h4> 
		 * Returns a localized date of a date field.
		 *  
		 * <h4>Description:</h4> 
		 * Return the date of the field in a standard format, for comparison. If
		 * the field is hidden, we convert it to a standardized format for
		 * comparison, otherwise we simply return the value.
		 * @param {dijit._Widget} dateField
		 * @method localizeDate
		 */
		localizeDate : function( /*dijit._Widget*/ dateField) {
			//  summary:
		    //        Returns a localized date of a date field.
			//  description:
			//        Return the date of the field in a standard format, for comparison. If the field 
			//        is hidden, we convert it to a standardized format for comparison, otherwise we 
			//        simply return the value.
			
			var dateFieldValue = dateField.get("value");
			if(dateField.get("type") === "hidden") {
				return d.date.locale.parse(dateFieldValue, {
					selector :"date",
					datePattern : m.getLocalization("g_strGlobalDateFormat")
				});
			}
			
			return dateFieldValue;
		},
		/**
		 * <h4>Summary:</h4>
		 * Validates the data range for a search screen.
		 * @method validateSearchStartEndDates
		 */
		validateSearchStartEndDates : function() {			
			//  summary:
		    //        Validates the date range for a search screen. 
		    var start = dj.byId("dttm_begin"),
			end = dj.byId("dttm_end");
			if (end && end.get('value') === null)
			{
				return true;
			}
			if(start && end)
			{
				if (!m.compareDateFields(start, end))
				{
					this.invalidMessage = m.getLocalization("dateRangeValidityMessage");
					return false;
				}
			}
			return true;
		},
		/**
		 * <h4>Summary:</h4>
		 * This function compares two date fields
		 * Get the localised value of both the dates if both are present 
		 *  then comapre them using <b>dojo.date.compare</b> function
		 * @param {dijit._Widget} earlyDateField
		 * @param {dijit._Widget} lateDateField
		 * @method compareDateFields
		 */
		compareDateFields : function( /*dijit._Widget*/ earlyDateField,
				 					  /*dijit._Widget*/ lateDateField) {
			//  summary:
		    //        Compares two date fields.
			
			var lateDateFieldValue,
				earlyDateFieldValue,
				standardizedEarlyDate,
				standardizedLaterDate;
			
			if(earlyDateField && lateDateField) {
				earlyDateFieldValue = earlyDateField.get("value");
				lateDateFieldValue = lateDateField.get("value");
				
				if(earlyDateFieldValue && lateDateFieldValue) {
					console.debug("[misys.common] Performing date comparison validation");
					standardizedEarlyDate = m.localizeDate(earlyDateField);
					standardizedLaterDate = m.localizeDate(lateDateField);
					
					console.debug("[misys.common] Early Date [", earlyDateField.id, "] = ", 
							standardizedEarlyDate);
					console.debug("[misys.common] Later Date [", lateDateField.id, "] = ", 
							standardizedLaterDate);

					if(d.date.compare(standardizedLaterDate, standardizedEarlyDate) < 0){
						return false;
					}
				}
			}
			return true;
		},
		/**
		 * <h4>Summary:</h4>
		 *   Show a popup of confirmation to allow the cancellation of a record.
		 *   Do a post after that.
		 *   @param {String} strTitle
		 *   @param {Object} args
		 *   @method confirmMCCancel
		 */
		confirmMCCancel : function( /*String*/ strTitle,
                					/*Object*/ args) {
			//  summary:
			//         Show a popup of confirmation to allow the cancel of a record
			
			this.dialog.show("CONFIRMATION",
				this.getLocalization("cancelMCTransactionConfirmation", [strTitle]), "",
				function() {
					m.post(args);
				}
			);
		},
		
		// 
		/**
		 * <h4>Summary:</h4> This method trim the amount value to remove characters ','
		 * space and removes the 0's in decimal if unnecessory
		 * 
		 * <h4>Description:</h4> This is basically used in re-authentication to have
		 * consistancy in java and javascript side.
		 * @param {String} amount
		 * @method trimAmount
		 * 
		 */
		trimAmount : function(/*String*/ amount){
			
			//Summary: This method trim the amount value to remove characters ',' space and removes the 0's in decimal if unnecessory
			
			// Description: This is basically used in re-authentication to have consistancy in java and javascript side.
			// ex: javascript value: 12,345.00 and java value: 12345 (this method coverts the 12,345.00 to 12345 in javascript side)
				
			var amountInDigits = (""+amount+"").replace(/[^\d.]/g, '');
			var dotIndex = amountInDigits.indexOf(".");
			var strlength = amountInDigits.length;
			var trimeAmountInDigits = amountInDigits;

			if(dotIndex !== -1)
			{
				for (var v=strlength;v>dotIndex;v--)
				{
					var n = amountInDigits.charAt(v-1);
					if(n === '0' || n === '.')
					{
						trimeAmountInDigits = trimeAmountInDigits.substring(0,v-1);
					}
					else
					{
						break;
					}
				}
			}

			return trimeAmountInDigits;
				
		},
		
		/**
		 *<h4>Summary:</h4>
		 *Formats the export list
		 *@param {String} format
		 *	Format to be set to the export_list id.
		 *@method exportListToFormat
		 */
		exportListToFormat : function (/*String*/format)
		{
			if(d.byId(_transactionSearchFormId)) 
			{
				dj.byId("export_list").set("value",format);
				d.create("input", {type: "hidden", name: "searchFlag", value: "true"}, TransactionSearchForm);
				dj.byId("TransactionSearchForm").submit();
				dj.byId("export_list").set("value","screen");
			}
		},
		
		/**
		 * Formats the export list, sets account_no to blank befor form submit and then set it back to existing value
		 *@param {String} format
		 *	Format to be set to the export_list id.
		 *@method exportListFormat
		 */
		exportListFormat : function (/* String */format)
		{
			if(d.byId(_transactionSearchFormId))
			{
				dj.byId("export_list").set("value",format);
				var form = dj.byId("TransactionSearchForm");
				var acctNo = dj.byId('account_no');
				var acctNoValue = dj.byId('account_no').get('value'); 
				var entityfield = dj.byId("entity");
				var hideTT;
				
				if (dj.byId("operation") && dj.byId("operation").get("value") === 'LIST_BALANCES')
				{
					if (entityfield && entityfield.get("value") === "")
					{
						m.dialog.show("ERROR", m.getLocalization("entityNotSelectedError"));
						return;
					}	
				}
				else if(dj.byId("operation") && dj.byId("operation").get("value") === 'LIST_STATEMENTS')
				{
						if(entityfield && entityfield.get("value") === "" )
						{
							m.dialog.show("ERROR", m.getLocalization("entityNotSelectedError"));
							dj.byId("export_list").set("value","");
							return;
						}
						if (acctNo.get('value') === "" )
						{
							m.dialog.show("ERROR", "Please select an account.");
							dj.byId("export_list").set("value","");
							return;
						}
				}
				if(dijit.byId("is_acc_mandatory") && acctNoValue == "")
				{
					m.dialog.show("ERROR", m.getLocalization("EmptyAccountError"));
				}
				else
				{
					if(dijit.byId('account_id') && dijit.byId('account_id').get('value'))
					{
						dijit.byId('account_no').set('required', false);
						dijit.byId('account_no').set('value', '');
					}
					var dateRange;
					var createDate;
					var createDate2;
					var today;
					var createDate2Str;
					//if (format === 'swift') 
					//{
						//var previousDay = dj.byId('Previous Day').get('value');
						//dateRange = dj.byId('dateRange').get('value');
						//createDate = dj.byId('create_date').get('value');
						//createDate2 = dj.byId('create_date2').get('value');
						//today = dj.byId('today').get('value');
						//AF, to fix MPG-4738 & MPG-4744
						//createDate2Str = dojo.date.locale.format(createDate2, {datePattern: "dd/MM/yyyy", selector: "date"});
						//createDate2Str = dojo.date.locale.format(createDate2, {datePattern: misys.getLocalization('g_strGlobalDateFormat'), selector: "date"});
						//AF, to fix MPG-4738 & MPG-4744 - end
						// only Previous day and Date range is 1 day is allowed for MT940 download
						//if ((previousDay === '2') || 
					         //((dateRange === '5') &&
					           //(dojo.date.compare(createDate, createDate2) == 0) &&
					             //!(today === createDate2Str)))
						//{
							//form.submit();
						//} else {
							//m.dialog.show("ERROR", m.getLocalization("MT940ExportError"));
						//}
					//}
					if (format === 'swift941' || format === 'swift942') 
					 {
						// MT941 & MT942 download is NOT allowed for external account 
						if (dijit.byId('owner_type').get('value') == '05')
						{
							m.dialog.show("ERROR", m.getLocalization("ExternalAccountError"));
						} 
						else 
						{
							var currentDay = dj.byId('Current Day').get('value');
							dateRange = dj.byId('dateRange').get('value');
							createDate = dj.byId('create_date').get('value');
							createDate2 = dj.byId('create_date2').get('value');
							today = dj.byId('today').get('value');
							//AF, to fix MPG-4738 & MPG-4744
							//createDate2Str = dojo.date.locale.format(createDate2, {datePattern: "dd/MM/yyyy", selector: "date"});
							createDate2Str = dojo.date.locale.format(createDate2, {datePattern: misys.getLocalization('g_strGlobalDateFormat'), selector: "date"});
							//AF, to fix MPG-4738 & MPG-4744 - end
							// only Current day is allowed for MT941 & MT942 download
							if ((currentDay === '1') || 
						         ((dateRange === '5') &&
						           (dojo.date.compare(createDate, createDate2) == 0) &&
						             (today === createDate2Str)))
							{
								//AF, to fix MPG-2249
								if (format ==='swift942')
								{
									dj.byId("export_list").set("value",'swift');
								}
								//AF, MPG-2249 - end								
								form.submit();
							} 
							else 
							{
								m.dialog.show("ERROR", m.getLocalization("MT941942ExportError"));
							}
						}
					 } 
					 else 
					 {				
						 form.submit();
					 }
				}	
				if(dijit.byId('account_id') && dijit.byId('account_id').get('value'))
				{
					dijit.byId('account_no').set('value', acctNoValue);
					dijit.byId('account_no').set('required', true);
				}
				dj.byId("export_list").set("value","screen");	
			}
		},
		
		/**
		 *<h4>Summary:</h4>
		 *Formats the export list
		 *@param {String} format
		 *	Format to be set to the export_list id.
		 *@method exportListToFormatInXsl
		 */
		exportListToFormatInXsl : function (/*String*/format)
		{
			var facilityId = dijit.byId("facility_id") ? dijit.byId("facility_id").value :"";
			dojo.io.iframe._currentDfd = null;
			dojo.io.iframe.send({
				url:m.getServletURL("/screen/AjaxScreen/action/GetLimitData"),
				handleAs 	: "json",
				sync 		: true,
				content		:{
								option : format,
								facility_id : facilityId,
								token : document.getElementById("_token").getAttribute('value')
				}
				}); 

		},
		
		/** 
		*<h4>Summary:</h4>
		 *Formats the export list
		 *@param {String} format
		 *	Format to be set to the export_list id.
		 *@method exportListToFormatInXslRpmntSc
		 */
		exportListToFormatInXslPdfRpmntSc : function (/*String*/format,/*String*/ isAllColumn )
		{
			dojo.io.iframe._currentDfd = null;
			var form = document.createElement("FORM");
			form.setAttribute("id", "dummyform");
			document.body.appendChild(form);
			dojo.io.iframe.send({
				url:m.getServletURL("/screen/AjaxScreen/action/LoanRepaymentScheduleAction"),
				handleAs 	: "json",
				form 		: "dummyform",
				method		: "POST",
				sync 		: true,
				content		:{
								option : format,
								allColumn : isAllColumn,
								token : document.getElementById("_token").getAttribute('value')
				}
				}); 

		},
		
		/**
		 * <h4>Summary:</h4>
		 * This function is to fetch the code data for Liquidity frequency 
		 * <h4>Description:</h4> 
		 * Have an AJAX call inside it
		 */
		getFrequencyCodeData : function(frequency)
		{
			var codeFrqDesc;
			m.xhrPost( {
				url : m.getServletURL("/screen/AjaxScreen/action/GetFrequencyCodeData"),
				handleAs 	: "json",
				sync 		: true,
				content : {
					frequencyValue : frequency
				},
				load : function(response)
				{
					codeFrqDesc = response.items.long_desc ;
				},
				error : function()
				{
					codeFrqDesc = frequency;
				}
			});
			
			return codeFrqDesc;
		},
		
		/**
		 * <h4>Summary:</h4>
		 * This function is to fetch the code data for Liquidity Balance Type  
		 * <h4>Description:</h4>
		 * Have an AJAX call inside it
		 */
		getBalanceTypeCodeData : function(balance_type)
		{
			var balance_type_Desc;
			m.xhrPost( {
				url : m.getServletURL("/screen/AjaxScreen/action/GetBalanceTypeCodeData"),
				handleAs 	: "json",
				sync 		: true,
				content : {
					balance_type_Value : balance_type
				},
				load : function(response)
				{
					balance_type_Desc = response.items.long_desc ;
				},
				error : function()
				{
					balance_type_Desc = balance_type;
				}
			});
			
			return balance_type_Desc;
		},
		
		getsubGroupTypeData : function(subGrp_type)
		{
			var subGrp_type_Desc;
			m.xhrPost( {
				url : m.getServletURL("/screen/AjaxScreen/action/GetSubGrpTypeCodeData"),
				handleAs 	: "json",
				sync 		: true,
				content : {
					subGrp_type_Value : subGrp_type
				},
				load : function(response)
				{
					subGrp_type_Desc = response.items.long_desc ;
				},
				error : function()
				{
					subGrp_type_Desc = subGrp_type;
				}
			});
			
			return subGrp_type_Desc;
		},
				
		// This is the default implementation of the hook method called before the Assignee Type fields are displayed on the
		// Collaboration window [refere to misys.widget.Collaboration.js]. Individual binding files should overwrite this as needed
		/**
		 * This is the default implementation of the hook method called before the Assignee Type fields are displayed on the
		 * Collaboration window [refere to misys.widget.Collaboration.js]. Individual binding files should overwrite this as needed
		 * @param {Array} assigneeTypeFields
		 * @method preDisplayAssigneeType
		 */
		preDisplayAssigneeType : function(/*Array of Objects*/ assigneeTypeFields){
	    	 var taskMode = m._config.task_mode || "userandbank";
	    	 dojo.forEach(assigneeTypeFields, function(fieldObj){
	    		if(fieldObj.description === "user_to_bank" && dj.byId(fieldObj.id))
	    		{
	    			if(taskMode === "userandbank")
	    			{
	    				if(dj.byId(fieldObj.id))
	    				{
	    					dj.byId(fieldObj.id).set('disabled', false);
	    				}
	    				else
	    				{
	    					console.error("Could not find widget with id "+fieldObj.id);
	    				}	
	    			}
	    			else
	    			{
	    				if(dj.byId(fieldObj.id))
	    				{
	    					dj.byId(fieldObj.id).set('disabled', true);
		    				console.info("Tasks for Bank is not allowed. Disabling the radio button.");
	    				}
	    				else
	    				{
	    					console.error("Could not find widget with id "+fieldObj.id);
	    				}
	    			}	
	    		}	 
	    	});
	     },
	     
	     isFormDirty : false,
	     
	     isSystemButtonClicked : false,
	     
	     unsavedDataOption : "notset",
	     
	     excludedMethods : [{object: m, method: "submit"}],
	     
		/**
		 * Mark the current entry form as dirty.
		 * @method markFormDirty
		 */
	     markFormDirty : function(){
	    	m.isFormDirty = true;
	    	console.log("Form is dirty - unsaved changes exist"); 
	     },
	     
	     /**
	      * The unsaved data alert appears only if the form is dirty and no user selection exists yet
	      * Also, the alert appears only if a Save option exists on the screen and is NOT hidden
	      * @method isPopupRequired
	      */
	     isPopupRequired : function(){
	    	 /* The unsaved data alert appears only if the form is dirty and no user selection exists yet
	    	  * Also, the alert appears only if a Save option exists on the screen and is NOT hidden
	    	  */
	    	var popupRequired = false;
	    	if(m.isFormDirty && m.unsavedDataOption === "notset")
			{			
				if(dojo.query(".saveButton").length > 0){
					popupRequired = true;						
				}
			} 
	    	return popupRequired;
	     },
	     /**
	      * Unload listner when form is dirty
	      * First check for the form if it is dirty.If it is then unload the listner.
	      * @method unloadListener
	      */
	     unloadListener : function(){
			if(misys.isFormDirty && misys.isFormDirty === true && m._config.saveUnsavedData && m._config.saveUnsavedData === true)
			{
				
				if(m.unsavedDataOption === "save")
				{
				//	m.saveAsync("SAVE");
					return undefined;
				}else if(m.unsavedDataOption === "nosave")
				{
					console.log("Nothing to do here");
					return undefined;
				}else
				{
					return m.getLocalization("unsavedData");
				}	

				
			}
		},
		/**
		 * <h4>Summary:</h4>
		 * Set unsaved data 
		 * @method setUnsavedDataOption
		 */
		setUnsavedDataOption : function(val){
			misys.unsavedDataOption = val;
		},
		/**
		 * <h4>Summary:</h4>
		 * This function is for showing unsaved data dialog.
		 * @method showUnsavedDataDialog
		 */
		showUnsavedDataDialog : function(){
			var asyncMsgDialog = dijit.byId("unsavedDataDialog");
			var asyncMsgDialogButtons = dojo.byId('unsavedDataDialogButtons');
			var asyncMsgButton1 = dijit.byId('SaveContButton').domNode;
			var asyncMsgButton2 = dijit.byId('ContButton').domNode;
			var asyncMsgButton3 = dijit.byId('CancelButton').domNode;
			var asyncMsgWidgetContainer = dijit.byId('unsavedDataDialog').domNode;
			
			dojo.style(asyncMsgDialogButtons, 'display', 'block');
			dojo.style(asyncMsgButton1, 'display', inlneBlock);
			dojo.style(asyncMsgButton2, 'display', inlneBlock);
			dojo.style(asyncMsgButton3, 'display', inlneBlock);
			dojo.style(asyncMsgWidgetContainer, 'display', inlneBlock);
			asyncMsgDialog.set('title', misys.getLocalization('unsavedDataPreUnload'));
			
			// Disable window closing by using the escape key
			misys.dialog.connect(asyncMsgDialog, 'onKeyPress', function(evt) {
				if (evt.keyCode === dojo.keys.ESCAPE) {
					dojo.stopEvent(evt);
				}
			});
				
			misys.dialog.connect(dijit.byId('SaveContButton'), 'onMouseUp', function(){
				misys.dialog.disconnect(asyncMsgDialog);
				asyncMsgDialog.hide();
			}, asyncMsgDialog.id);
			misys.dialog.connect(dijit.byId('ContButton'), 'onMouseUp', function(){
				misys.dialog.disconnect(asyncMsgDialog);
				asyncMsgDialog.hide();
			}, asyncMsgDialog.id);
			misys.dialog.connect(dijit.byId('CancelButton'), 'onMouseUp', function(){
				misys.dialog.disconnect(asyncMsgDialog);
				asyncMsgDialog.hide();
			}, asyncMsgDialog.id);
			
			misys.dialog.connect(asyncMsgDialog, 'onHide', function() {
					misys.dialog.disconnect(asyncMsgDialog);
			});
			
			asyncMsgDialog.show();
		},
		reloadChartImg: function(){
			var chartContainer = dojo.query('#GTPRootPortlet > .portlet-section-body > div.widgetContainer');
			var form = dj.byId("TransactionSearchForm");
			var dateRegex = /Date/;
			var timeRegex = /Time/;
			
			if(form && chartContainer && chartContainer[0] && chartContainer[0].id) {
				var listdefId =  chartContainer[0].id.split("id")[1];
				var chartImg = dojo.query('#chart'+ listdefId)[0];
				
				if(chartImg && chartImg.src && chartImg.alt) {
					var chartAlt = chartImg.alt;
			
					form.getDescendants().forEach(function(field, i){
						if(field.name) {
							var value ;
							// special case if the field is a radio button
							if(field.declaredClass == 'dijit.form.RadioButton')
							{
								var radioDomNodes = dojo.query("[name='" + field.name + "']", form.domNode);
								// iterate through radio buttons
								d.some(radioDomNodes, function(radioDomNode){
									var radioWidget=dj.byNode(radioDomNode.parentNode);
									// if the radio button checked get its value
									if(radioWidget.checked)
									 {
										value = radioWidget.params.value;
									 }
									
								});
							}
							else
							{
								value = field.get("value");
							}
							if(dateRegex.test(field.declaredClass) || (timeRegex.test(field.declaredClass))) {
								value = field.get("displayedValue");
							}
							if(value === " ") {
								value = "";
							}
							if(field.type !== 'hidden') {
								chartAlt = _setParamsToURLString(chartAlt, field.get("name"), value);
							}
							
						}
					});
					chartImg.alt = chartAlt;
					m.resizeCharts();
				}
			}
		},

		/**
		 * <h4>Summary:</h4>
		 * 
		 * This function returns the prepared the warning message(by using variable misys._config.warningMessages) 
		 * in applicable scenario at the point of submission context.
		 * 
		 * @method formApplicableWarningMsg
		 */
	     formApplicableWarningMsg : function() {
	    	
			var submitMsg = m._config.globalSubmitConfirmationMsg;
			var warningMessagesSize = misys._config.warningMessages ? misys._config.warningMessages.length : 0;
			
			if(warningMessagesSize > 0)
			{
				var i;
				var messagesWithLineBreaks = "<b><ol>";
				for(i = 0; i < warningMessagesSize; i++)
				{
					messagesWithLineBreaks += ("<li>"+ misys._config.warningMessages[i]+ "</li>");
				}
				
				messagesWithLineBreaks += "</ol></b>";
				
				submitMsg = misys.getLocalization("submitTransactionConfirmationWithWarning",[ messagesWithLineBreaks ]);
			}
			
			return (submitMsg && submitMsg !== "") ? submitMsg : "";
	     },

		  toggleErrorSection : function( /*Function*/ callback) {
				//  summary:
			    //        Toggle the display of the table of contents (Error Section).
				
				var errorContent = d.byId("errorContent");
				if(errorContent) {
					
					var errorLink = d.byId("errorLink"),
						errorContainer = d.byId("errorSection"),
						show = (d.style(errorContent, "display") === "none"),
						width = (show) ? d.style(d.byId("errorSection"), "width") + 6 : 
											d.style(d.byId("errorSection"), "width") - 6,
						opacity = (show) ? 0.9 : 1,
						animation = (show) ? "wipeIn" : "wipeOut",
						linkText = (show) ? 
								m.getLocalization("hideErrorSectionMessage") : m.getLocalization("showErrorSectionMessage"),
						chain = [],
						animations = [];
						
					chain.push(d.animateProperty({
						node: errorContainer,
						properties: {
							width: width
						}
					}));

					animations = animations.concat(
										m.animate(animation, errorContent, null, true)._animations);
					animations.push(d.animateProperty({
										node: errorContainer, 
										properties: {opacity: opacity}}));
					chain = dojo.fx.chain(chain.concat(animations));
					
					d.connect(chain, "onBegin", function(){
						setTimeout(function(){
							errorLink.innerHTML = linkText;
						}, 500);
					});
					d.connect(chain, "onEnd", function(){
						if(callback && d.isFunction(callback)){callback();}
					});
					
					return chain.play();
				}
			},
			
			encryptText : function(passPhrase)
			{
				if(misys._config.clientSideEncryption)
				{
					var rsa = new RSAKey();
					var htmlUsedModulus = misys._config.htmlUsedModulus; 
					var crSeq = misys._config.cr_seq; 
	    			rsa.setPublic(htmlUsedModulus, '10001');
	                return rsa.encrypt(passPhrase)+crSeq;						
				}
				else
				{
					return passPhrase;
				}
			}
	});

  m.popup = m.popup || {};
  d.mixin(m.popup, {
	  //
	  // summary:
	  //	Functions for manipulating popups (meaning new windows). Previously this lived in
	  //    FormPopupEvents.js
	  /**
		 * <h4>Summary:</h4> 
		 * Open a popup window showing the details of an unsigned
		 * transaction record. This is used for Preview and Print purposes.
		 * @param {String} type
		 * 	Type as preview or print.
		 * @param {String} prodCode
		 *  Product code.
		 * @param {String} refId
		 *  reference id.
		 * @param {String} tnxId
		 *  Transaction id.
		 * @param {String} strScreen
		 *  Technical screen name.
		 * @method showPreview
		 */
	  showPreview : function( /*String*/ type,
              				  /*String*/ prodCode,
              				  /*String*/ refId,
              				  /*String*/ tnxId,
              				  /*String*/ tnxTypeCode,
              				  /*String*/ subTnxTypeCode,
              				  /*String*/ strScreen)
              	{			  
		  //  summary:
		  //            Open a popup window showing the details of an unsigned transaction record.
		  //            This is used for Preview and Print purposes. The localization code
		  var screenParam = "ReportingPopup",url = [] ;
		  
		  if (misys._config.isBank === 'false' && misys._config.fccuiEnabled && misys._config.fccuiEnabled === 'true' && m.isAngularProductUrl(prodCode, "")) {
				url.push("/view?");
				url.push("referenceid=", refId);
				url.push("&tnxid=", tnxId);
				url.push("&productCode=", prodCode);
				url.push("&subProductCode=", "");
				url.push("&mode=", "view");
				url.push("&operation=", "PREVIEW");
				url.push("&tnxTypeCode=", tnxTypeCode);
				url.push("&subTnxTypeCode=", subTnxTypeCode);
				url.push("&eventTnxStatCode=", "");
				var popup =	window.open(m.getServletURL('').replace(/.$/,"#") + url.join(""), '_blank', 'top=100,left=200,height=400,width=900,toolbar=no,resizable=no');
				popup.onload = function(){
				var windowName =misys.getLocalization("mainTitle");
				var productId =misys.getLocalization(prodCode);
				popup.document.title = windowName + ' - ' + productId;
				};
		} else {
		
		  var tnxIdParam = "",tnxTypeCodeParam = "",subTnxTypeCodeParam = "",
			 // Default reporting screen is ReportingPopup
			 parentTitleParam = "";

		  if(tnxId) {
			tnxIdParam = "&tnxid=" + tnxId;
		  }
		  if(tnxTypeCode && tnxTypeCode !== "") {
			  tnxTypeCodeParam = "&tnxtype=" + tnxTypeCode;
		  }
		  if(subTnxTypeCode && subTnxTypeCode !== "") {
			  subTnxTypeCodeParam = "&subtnxtype=" + subTnxTypeCode;
		  }

		  // Use the target screen if passed
		  if(strScreen) {
			screenParam = strScreen;
		  }

		  url = ["/screen/", screenParam];
		  url.push("?option=", type, "&titlecode=INFO_MSG_PREVIEW_UNCONTROLLED&referenceid=", 
					refId, tnxIdParam);
		  url.push(tnxTypeCodeParam);
		  url.push(subTnxTypeCodeParam);
		  url.push(prductCode, prodCode);
		  if(window.isAccessibilityEnabled && window.document.title && window.document.title !== ""){
			  url.push("&parenttitle=", window.document.title); 
			}
		  _openPopup(m.getServletURL(url.join("")));
		  }
	},
	/**
	 * <h4>Summary:</h4> 
	 * The logic associated with the different actions offered to the
	 * user on the page. 
	 * <b>Note:</b> option, refId, tnxId and prodCode parameters are
	 * only used for PDF export so far.
	 * @param {String} type
	 *	Different type of actions
	 * @param {String} option
	 * 	Different option under any action like
	 *  summary or full for export
	 * @param {String} refId 
	 *  Reference Id.
	 * @param {String} tnxId
	 *  Transaction id.
	 * @parm {String} prodCode
	 *  Product code.
	 * @method showSummary
	 */
	showSummary : function( /*String*/ type,
            				/*String*/ option,
            				/*String*/ refId,
            				/*String*/ tnxId,
            				/*String*/ prodCode) {
		//  summary:
		//         The logic associated with the different actions offered to the user on the page.
		//         Note: option, refId, tnxId and prodCode parameters are only used for PDF
		//         export so far.
		switch(type.toLowerCase()) {
		 case "print":
			d.global.print();
			break;
		 case "close":
			d.global.close();
			break;
		 case "export":
			if(option){
				option = option.toLowerCase();
				var pdfOption = option;
				if(option === "summary") {
					pdfOption = "EXPORT_PDF_SUMMARY";
				} else if(option === "full") {
					pdfOption = "EXPORT_PDF_FULL";
				} else if(option === "details") {
					pdfOption = "EXPORT_PDF_DETAILS";
				} else if(option === "pdf_ec_details") {
					pdfOption = "PDF_EC_DETAILS";
				} else if(option === "csv_bk_details") {
					pdfOption = "CSV_BK_DETAILS";
				}else if(option === "snapshot_pdf") {
					pdfOption = "SNAPSHOT_PDF";
				}
				 else if(option === "updated") {
						pdfOption = "EXPORT_PDF_FULL";
					} 
				//as options always will be upper case
				// in module files, convert the final option to upper case
				pdfOption = pdfOption.toUpperCase();

				var url = [reportingPopup];
				url.push("?option=", pdfOption);
				url.push(refrnceId, refId);
				if(tnxId && tnxId !== ""){
					url.push("&tnxid=", tnxId);
				}
				url.push(prductCode, prodCode);
				_openPopup(misys.getServletURL(url.join("")));
			}
			break;
		 default:
			break;
		}
	},
	/**
	 * <h4>Summary:</h4> 
	 * Export to PDF based on the given paramters. 
	 * @method showPDF
	 */
	showPDF : function(url) {
		_openPopup(misys.getServletURL(url));
	},
	
	/**
	 * <h4>Summary:</h4> 
	 * Show reporting summary popup.
	 * @param {String} type
	 *	 Option type like summary or full
	 * @param {String} prodCode
	 * 	Product code.
	 * @param {String} refId
	 *  Reference id.
	 * @param {String} tnxId
	 *  Transaction id.
	 * @param {String} strScreen
	 *  Target screen name.
	 * @method showReporting
	 */
	showReporting : function( /*String*/ type,
            				  /*String*/ prodCode, 
            				  /*String*/ refId, 
            				  /*String*/ tnxId,
            				  /*String*/ tnxTypeCode,
            				  /*String*/ subTnxTypeCode,
            				  /*String*/ tnxstatus,
            				  /*String*/ strScreen,
            				  /*String*/ subProductCode) {
		//  summary:
		//         Show reporting summary popup.
		
		var objPopReporting,
			prodCodeParam = [],
			refIdParam = [],
			tnxIdParam = [],
			parentTitleParam = [],
	        screenParam = "ReportingPopup",
	        url = [],
	        tnxTypeCodeParam = [],
	        subTnxTypeCodeParam = [],
	        tnxStatusParam = [];
			
		var isAngularProductURL = m.isAngularProductUrl(prodCode, subProductCode);
		/**
        * Angular UX is not present for product SE and sub product code OTHER,
        *  should remove below condition once angular ux available
        */
		if(prodCode === 'SE' && subProductCode != null && subProductCode != undefined && subProductCode != '' && subProductCode === 'OTHER') {
				isAngularProductURL = false;
		}
		
		if (misys._config.isBank === 'false' && misys._config.fccuiEnabled && misys._config.fccuiEnabled === 'true' && isAngularProductURL) {
			url.push("/view?");
			url.push("referenceid=", refId);
			url.push("&tnxid=", tnxId);
			url.push("&productCode=", prodCode);
			url.push("&subProductCode=", subProductCode);
			url.push("&mode=", "view");
			url.push("&operation=", "PREVIEW");
			url.push("&tnxTypeCode=", tnxTypeCode);
			url.push("&subTnxTypeCode=", subTnxTypeCode);
			url.push("&eventTnxStatCode=", tnxstatus);
			var popup =	window.open(m.getServletURL('').replace(/.$/,"#") + url.join(""), '_blank', 'top=100,left=200,height=400,width=900,toolbar=no,resizable=no');
			popup.onload = function(){
			var windowName =misys.getLocalization("mainTitle");
			var productId =misys.getLocalization(prodCode);
			popup.document.title = windowName + ' - ' + productId;
			};
	} 
		else {
		if(prodCode && prodCode !== ""){
			prodCodeParam.push(prductCode, prodCode);
		}

		if(refId && refId !== ""){
			refIdParam.push(refrnceId, refId);
		}

		if(tnxId && tnxId !== ""){
			tnxIdParam.push("&tnxid=", tnxId);
		}
		
		if(tnxTypeCode && tnxTypeCode !== "") {
			tnxTypeCodeParam.push("&tnxtype=", tnxTypeCode);
		 }
		
		if(subTnxTypeCode && subTnxTypeCode !== "") {
			subTnxTypeCodeParam.push("&subtnxtype=", subTnxTypeCode);
		 }
		if(tnxstatus && tnxstatus !== "") {
			tnxStatusParam.push("&tnxstatus=", tnxstatus);
		 }

		// Use the target screen if passed
		if(strScreen && strScreen !== ""){
			screenParam = strScreen;
		}

		url.push("/screen/", screenParam);
		url.push("?option=", type);
		url.push(refIdParam.join(""), tnxIdParam.join(""), prodCodeParam.join(""), tnxTypeCodeParam.join(""), subTnxTypeCodeParam.join(""), tnxStatusParam.join(""));
		//url.push("&tnxTypeCode=", tnxTypeCode);
		//url.push("&subTnxTypeCode=", subTnxTypeCode);
		if(window.isAccessibilityEnabled && window.document.title && window.document.title !== ""){
			parentTitleParam.push("&parentTitle=", window.document.title);
			url.push(parentTitleParam.join(""));
		}
		_openPopup(m.getServletURL(url.join("")));
	}
	}, 
	
	openIframePopup : function( /*String*/ type,
			  /*String*/ entitlementCode, 
			  /*String*/ entitlementDescription, 
			  /*String*/ companyAbbvName) {
//  summary:
//         Show entitlement view popup.

			var entitlementCodeParam = [],
			entitlementDescriptionParam = [],
			companyAbbvNameParam = [],
			parentTitleParam = [],
			screenParam = "IframePopup",
			url = [];
			
			if (misys._config.isBank === 'false' && misys._config.fccuiEnabled && misys._config.fccuiEnabled === 'true' && m.isAngularProductUrl(prodCode, subProductCode)) {
			url.push("/view?");
			url.push("entitlementcode=", entitlementCode);
			url.push("&companyabbvname=", companyAbbvName);
			url.push("&entitlementdescription=", entitlementdescription);
			url.push("&mode=", "view");
			url.push("&operation=", "PREVIEW");
			
			window.open(m.getServletURL('').replace(/.$/,"#") + url.join(""), '_blank', 'top=100,left=200,height=400,width=900,toolbar=no,resizable=no');
			} 
			else {
			if(entitlementCode && entitlementCode !== ""){
				entitlementCodeParam.push(entitlementCod, entitlementCode);
			}
			
			if(entitlementDescription && entitlementDescription !== ""){
				entitlementDescriptionParam.push(entitlementDescp, entitlementDescription);
			}
			
			if(companyAbbvName && companyAbbvName !== ""){
				companyAbbvNameParam.push("&companyAbbvName=", companyAbbvName);
			}
			url.push("/screen/", screenParam);
			url.push("?option=", type);
			url.push(entitlementDescriptionParam.join(""), companyAbbvNameParam.join(""), entitlementCodeParam.join(""));
			if(window.isAccessibilityEnabled && window.document.title && window.document.title !== ""){
			parentTitleParam.push("&parentTitle=", window.document.title);
			url.push(parentTitleParam.join(""));
			}
			_openPopup(m.getServletURL(url.join("")));
			}
}, 
	
	/**
     * <h4>Summary:</h4>
     * Show Popup.
     * This method will invokes the portlet which matches to the option with the post method.
     * The params that should pass to this method should in query string format(like refId=val1&product=LN etc).
     * @param {String}
     *            params.
     * @param {String}
     *            option.
     * @method showPopup
     */
     showPopup : function(  /* String */ params,option) {              

           var url = [];
                 url.push("/screen/", "ReportingPopup");
                 url.push("?option=", option);
                 
           var windowName =misys.getLocalization("transactionPopupWindowTitle");
                 
           var mapForm = document.createElement("form");
                 mapForm.target = windowName;
                 mapForm.method = "POST"; 
                 mapForm.action = m.getServletURL(url.join(""));
                 if(window.isAccessibilityEnabled && window.document.title && window.document.title !== ""){
           			params = params + "&parenttitle=" + window.document.title;
           		}
                 if(params){
                     var paramTokens=params.split("&");
                     for(var i = 0; i < paramTokens.length; i++) {         
                           if(paramTokens[i]){
                        	   if(paramTokens[i].indexOf("=") ==-1){
                                	paramTokens[i-1] = paramTokens[i-1] + "&" + paramTokens[i];
                                	var paramArr = Array.from(paramTokens);
                                	paramArr.splice(i,1);
                                	paramTokens = paramArr;
                                }
                           }
                     }
                     for(i = 0; i < paramTokens.length; i++) {
                    	 if(paramTokens[i]){
                                var token=paramTokens[i].split("=");                        
                                var mapInput = document.createElement("input");
                                mapInput.type = "hidden";
                                mapInput.name = token[0];
                                var value = token[1];
                                if(token.length > 2) {
                                	for(var j = 2; j<token.length; j++) {
                               		value = value + "=" + token[j];
                               	}
                               }
                                 mapInput.value = value;
                                 mapForm.appendChild(mapInput);
                           }
                     }           
               }           
           document.body.appendChild(mapForm);
           
           var popupWindow;
           if(misys._config.showAddressBarInPopup && misys._config.showAddressBarInPopup == true ) {
        	   popupWindow = d.global.open('', windowName, "width=800,height=500,resizable=yes,scrollbars=yes,location=yes");
           } else {
        	   popupWindow = d.global.open('', windowName, "width=800,height=500,resizable=yes,scrollbars=yes");
           }  
     
           console.debug("[misys.common] Opening a standard popup with name", windowName, "at URL", url);
           if(!popupWindow.opener){
                 popupWindow.opener = self;
           }
           popupWindow.focus();          

           if(popupWindow){
                 mapForm.submit();
           }                       
     },

	
	
	/**
	 * <h4>Summary:</h4>
	 * The logic associated with the different actions offered to the user
	 * on the page. Note: option, refId, tnxId and prodCode parameters are only used
	 * for PDF export so far.
	 * 
	 * @param {String} type
	 * @param {String} pdfOption
	 * 	Option like full or summary
	 * @param {String} refId
	 * @param {String} tnxId
	 * @param {String} prodCode
	 * @param {String} strFeatureId
	 * @param {String} companyId
	 * @method generateDocument
	 */
	generateDocument : function(/*String*/ type,
								/*String*/ pdfOption,
	                            /*String*/ refId, 
	                            /*String*/ tnxId, 
	                            /*String*/ prodCode, 
	                            /*String*/ strFeatureId,
	                            /*String*/ companyId) {
		//  summary:
		//         The logic associated with the different actions offered to the user on the page.
		//         Note: option, refId, tnxId and prodCode parameters are only used for PDF
		//         export so far.

		switch(type.toLowerCase()){
		 case "bg-document":
			var url = [reportingPopup];
			url.push("?option=", pdfOption);
			if(refId && refId !== "") {
				url.push(refrnceId, refId);
			}
			if(tnxId && tnxId !== "") {
				url.push("&tnxid=", tnxId);
			}
			url.push(prductCode, prodCode);
			if(strFeatureId && !(strFeatureId === "")){
				url.push("&featureid=", strFeatureId);
			}
			if(companyId && !(companyId === "")){
				url.push("&companyId=", companyId);
			}

			_openPopup(m.getServletURL(url.join(""), null, 
					m.getLocalization("pdfSummaryWindowTitle")));
			break;
		 case "si-document":
			var urlSI = [reportingPopup];
			urlSI.push("?option=", pdfOption);
			if(refId && refId !== "") {
				urlSI.push(refrnceId, refId);
			}
			if(tnxId && tnxId !== "") {
				urlSI.push("&tnxid=", tnxId);
			}
			urlSI.push(prductCode, prodCode);
			if(strFeatureId && !(strFeatureId === "")){
				urlSI.push("&featureid=", strFeatureId);
			}
			if(companyId && !(companyId === "")){
				urlSI.push("&companyId=", companyId);
			}

			_openPopup(m.getServletURL(urlSI.join(""), null, 
					m.getLocalization("pdfSummaryWindowTitle")));
			break;
		 default:
			break;
		}
	},
	/**
	 * Bulk specific Summary script to call respective popup based on csv or pdf
	 * selection
	 * @param {String} type
	 * @param {String} option
	 * @param {String} refId
	 * @param {String} tnxId
	 * @param {String} productCode
	 * @param {DomNode} secondDiv
	 * @method showBulkSummary
	 */
	showBulkSummary: function(type, option, refId, tnxId, productCode, secondDiv)
	{
		var exportType;
		if(!secondDiv)	
		{
			if(dj.byId("export_field"))
			{
				exportType = dj.byId("export_field").get("value");
				m.popup.showSummary(type,exportType,refId,tnxId,productCode);
			}
		}else if(secondDiv)
		{
			if(dj.byId("export_field_bottom"))
			{
				exportType = dj.byId("export_field_bottom").get("value");
				m.popup.showSummary(type,exportType,refId,tnxId,productCode);
			}	
		}
	}
  });
  
  m.dialog = m.dialog || {};
  d.mixin(m.dialog, {
	  //
	  // summary:
	  //	Functions for manipulating dialogs (meaning overlays). Previously this lived in
	  //    FormPopupEvents.js
		/**
		 * <h4>Summary:</h4> 
		 * Open a new form in the popup dialog e.g. addCounterparty page
		 * 
		 * <h4>Description:</h4> 
		 * Populates an open dialog with the content of the given
		 * URL. Note that the dialog must have its content wrapped in a &lt;div&gt; or
		 * other block-level tag with the id type + "data" e.g. bankdata,
		 * beneficiarydata, etc.
		 * 
		 * bindingPackagePrefix is optional, in case the popup binding is not
		 * located at misys/binding/dialog
		 * @param {String} type
		 * @param {String} url
		 * @param {String} bindingPackagePrefix
		 * @param {Object} queryOptions
		 * @method populate
		 */	
	  populate: function( /*String*/ type,
						  /*String*/ url,
						  /*String*/ bindingPackagePrefix,
						  /*Object*/ queryOptions) {
		  //  summary:
		  //       Open a new form in the popup dialog e.g. addCounterparty page
		  //
		  //  description:
		  //	   Populates an open dialog with the content of the given URL. Note that the 
		  //	   dialog must its conten wrapped in a <div>, or other block-level
		  //	   tag with the id type + "data" e.g. bankdata, beneficiarydata, etc. 
		  //
		  //	   bindingPackagePrefix is optional, in case the popup binding is not located at
		  //	   misys/binding/dialog

		  var prefixBinding = bindingPackagePrefix || "misys.binding.dialog";
		  
		  m._config.popupType = type;
		  
		  // Must do require like this, otherwise it breaks the ANT build process
		  console.debug("[misys.common] Loading the dialog binding at ", 
				  (prefixBinding + "." + type));
		  
		  d["require"](prefixBinding + "." + type);
				
		  var containerDiv = d.byId(type + "data");
		  
		  // TODO Maybe we should just create the DIV on-the-fly?
		  if(!containerDiv) {
			  console.error("[misys.common] Cannot populate the dialog with content for URL", url);
			  console.error("[misys.common] Check that the dialog content has an element with",
					  		"ID equal to", (type + "data"));
			  return;
		  }
		  
		  // Create the ContentPane to hold the content
		  //
		  // NOTE: the contentPane must have an overflow:auto (for the scrollbar)
		  // and position:relative otherwise widgets will not render correctly under
		  // IE6
		  
		  var dim = d.coords(containerDiv),
		  	  contentPaneContainer = d.create("div", {id: "contentPaneContainer"});
		  
		  var contentPane;

		  if(!dj.byId("contentPane"))
		  {
			 contentPane = new dijit.layout.ContentPane({
				  id: "contentPane",
			      style: {
			    	  height: dim.h + "px",
			    	  width: dim.w + "px",
			    	  overflow: "auto",
			    	  position: "relative"
			      } 
			  });
		   }
		  else
		  {
			  contentPane = dj.byId("contentPane");
		  }
		  
				
		  contentPane.placeAt(contentPaneContainer, "first");
		  d.style(contentPaneContainer, "visibility", "hidden");
		  d.style(contentPaneContainer, "height", "0px");
		  d.place(contentPaneContainer, containerDiv, "after");

		  m.animate("wipeOut", containerDiv, function(){
			  m.animate("wipeIn", contentPaneContainer, function(){
				  m.connect(contentPane.get("id"), "onLoad", function(){
					  m.dialog.bind();
					 _bindPopupButtons();
					 _bindTabs(_popupFormId);
				  });
				  // do an HTTP POST if queryOptions exist,
				  // it may content long parameters and/or sensitive data
				  if (queryOptions){
					  contentPane.set("ioMethod", m.xhrPost);
					  contentPane.set("ioArgs", { content : queryOptions});
				  }
				  contentPane.set("href", url);
				  contentPane.startup();
				  contentPane.resize();
			 }, null, null, true);
		  }, null, null, true);
	  }, 
		/**	
		 * <h4>Summary:</h4>
		 * Close and destroy the dialog content and reopen the parent
		 * content
		 * @param {DomNode} containerDiv
		 * @param {Dijit._Widget} contentPane
		 * @param {Function} callback
		 * @param {String} response
		 * @method clear
		 */
	  clear : function( /*DomNode*/ containerDiv,
                		/*Dijit._Widget*/ contentPane,
                		/*Function*/ callback, 
                		/*String*/ response) {
			//  summary:
		    //            Close and destroy the dialog content and reopen the parent
			//            content 

			var contentPaneContainer = d.byId("contentPaneContainer");
			
			//Show Response in the XHR dialog
			if(response)
			{
				if(d.byId("responseXHRDialogDiv"))
				{
					d.destroy(d.byId("responseXHRDialogDiv"));
				}
				var responseNode = dojo.create("div");
				responseNode.id = "responseXHRDialogDiv";
				dojo.addClass(responseNode, "responseXHRDialogDiv");
				d.place(response, responseNode, "first");
			}
			
			m.animate("wipeOut", contentPaneContainer, function(){
				d.place(contentPaneContainer, d.body(), "last");
				
				if(response)
				{
					d.place(responseNode, containerDiv, "first");
				}
				
				m.animate("wipeIn", containerDiv, function(){
					contentPane.destroyRecursive();
					d.destroy(contentPaneContainer);
					if(callback && d.isFunction(callback)){
						callback();
					}
					delete m._config.popupType;
				});
			});
	  }, 
	  
		/**
		 * <h4>Summary:</h4> :
		 * Submits the popup form via AJAX
		 * <h4>Description:</h4> 
		 * First it checks for the submit type and takes action according to that.
		 * It has three types [SUBMIT,CANCEL,HELP]
		 * @param {String} submitType
		 *  Type of the submit e.g. (submit,cancel,help)
		 * @method submit
		 */	
	  submit : function( /*String*/ submitType){
			//  summary:
		    //           Submits the popup form via AJAX

			switch(submitType){
			case "SUBMIT":
				console.debug("[misys.common] Performing a Popup SUBMIT via AJAX");
				console.debug("[misys.common] Request XML follows ...");
				var productCode = dj.byId("product_code") ? dj.byId("product_code").get("value") : null;
				var disableFieldsForTrade = false; 
				//Enable disabled fields only for LC, EL, SI and SR product codes 
				//for other product codes disableFieldsForTrade and ignoreDisabled is false.
				if(productCode === "LC" || productCode === "EL" || productCode === "SI" || productCode === "SR")
				{
					disableFieldsForTrade = true; //disableFieldsForTrade and ignoreDisabled is true for TRADE.
				}
				console.debug(m.formToXML({
					ignoreDisabled : disableFieldsForTrade,	//Adding to avoid enabling of disabled fields.
					selector: "#" + _popupFormId, 
					xmlRoot : dj.byId("node_name").get("value")
				}));
				var forms = d.query("#" + _popupFormId);
				if(_validateForms(false, forms)) {
					var confirmationMessage =
						m.getLocalization("submitTransactionConfirmation");
					m.dialog.show("CONFIRMATION", confirmationMessage, "", function(){
						var operation = dj.byId("popup_realform_operation");
						if(operation.get("value") === ""){
							operation.set("value", "SUBMIT");
						}
						
						dj.byId("popup_TransactionData").set("value", 
								m.formToXML({
									ignoreDisabled : disableFieldsForTrade,	//Adding to avoid enabling of disabled fields.
									selector: "#" + _popupFormId, 
									xmlRoot : dj.byId("node_name").get("value")
						}));
						_submitDialog("popup_realform", function(){
							m.grid.setStoreURL(dj.byId(m._config.popupType+"data_grid"));
						});
					});
				} else {
					_validateTabs(_popupFormId);
					m.dialog.show("ERROR", m.getLocalization("mandatoryFieldsToSubmitError"), 
							"", function(){_validateForms(true, forms);});
				}
				break;
			case "CANCEL":
				 m.dialog.clear(d.byId(m._config.popupType+"data"), dj.byId("contentPane"));
				 break;
			case "HELP":
				_openPopup(m._config.onlineHelpUrl, 
							 m.getLocalization("onlineHelpWindowTitle"),
							"width=1000,height=700,resizable=yes,scrollbars=yes");
				return;
				break;
			default:
				break;
			}
	  }, 
	  /**
		 * <h4>Summary:</h4> Passback action for the overlay popup 
		 * @param {Array} arrFieldIds
		 *  An array of ids
		 * @param {Array} arrFieldValues
		 *   An array of values
		 * @param {Boolean} closeParent
		 *  Closes the parent dialog or not
		 * @param {String} type
		 *  Dialog type (Eg: bank, user, entity, accounts etc.)
		 *  @method passBack
		 */
	  passBack : function( /*Array*/ arrFieldIds,
				 		   /*Array*/ arrFieldValues, 
				 		   /*Boolean*/ closeParent,
				 		   /*String*/ type) {
		  //  summary:
		  //        Passback action for the overlay popup
		  //  description: 
		  //        arrFieldIds - an array of ids
		  //        arrFieldValues - an array of values
		  //        closeParent - closes the parent dialog
		  //		type - dialog type (Eg: bank, user, entity, accounts etc.)
		  //companytype is used only in counterparty login and in counterparty login case existingProg will not be  cleared.
		  var jsonData=null;
		  var refsStore=null;
		  var customerBankIndexValue = null;
		  var applicantNickNameValue = null;
		  var benApplicantNickNameValue = null;
		  var beneficiaryNickNameValue = null;		  
		  var applicationCollectionNickNameValue = null;
		  var applicantNickNameIndex = arrFieldIds.indexOf("applicant_act_nickname")!==-1?arrFieldIds.indexOf("applicant_act_nickname"):arrFieldIds.indexOf("applicant_collection_act_nickname");
		  var beneficiaryAccountNickNameIndex = arrFieldIds.indexOf("beneficiary_account_nickname");
		  var beneficiaryNickNameIndex = arrFieldIds.indexOf("beneficiary_nickname");		  
		  customerBankIndexValue = arrFieldIds.indexOf("customer_associated_bank");
		  applicantNickNameValue = arrFieldValues[applicantNickNameIndex];
		  beneficiaryNickNameValue = arrFieldValues[beneficiaryNickNameIndex];		  
		  benApplicantNickNameValue = arrFieldValues[beneficiaryAccountNickNameIndex];
		  var customerBankName = arrFieldValues[customerBankIndexValue];
		  if(customerBankName !== "" && customerBankName !== null)
		  {
			  m._config.customerBankName = customerBankName;
	      }
		  if(applicantNickNameValue !== undefined && applicantNickNameValue !=="" && applicantNickNameValue!==null && dj.byId("applicant_act_nickname")){
			  dj.byId("applicant_act_nickname").set("value", applicantNickNameValue);
		  }
		  if(beneficiaryNickNameValue !== undefined && beneficiaryNickNameValue !=="" && beneficiaryNickNameValue!==null && dj.byId("beneficiary_nickname")){
			  dj.byId("beneficiary_nickname").set("value", beneficiaryNickNameValue);
		  }		  
		  if(benApplicantNickNameValue !== undefined && benApplicantNickNameValue!=="" && benApplicantNickNameValue!==null && dj.byId("beneficiary_act_nickname")){
			  dj.byId("beneficiary_act_nickname").set("value", benApplicantNickNameValue);
		  }
		  var childXhrDialog = dj.byId("childXhrDialog"),
		  	  simpleTextareaRegex = /SimpleTextArea/,
		  	  misysSimpleTextareaRegex = /SimpleTextarea/,
		  	  filteringSelectRegex = /FilteringSelect/,
		  	  obj;
		  /**
		    Restrict on blur event swift bic code is selected from Popup. 
			When bic is from popup set a global variable, 
		    if this global variable is true donot bind on blur event for swift bic code.
          **/ 
		  if(type === "swift_bic")
		  {
			  m._config.isBankDetailsPopulated = true;
		  }
		  else if( type === "beneficiary_accounts")
		  {
			  m._config.isBeneficiaryAccountsPopulated = true;
		  }
		 
		  
		  d.forEach(arrFieldIds, function(id, index){
			  //For filtering select value add the widget Id if the select widget is to be kept editable and to populate the value
			  var editableFields = ["seller_account_type"];
			  obj = dj.byId(id);
			  if(obj) {
				  var insertionValue = arrFieldValues[index];
				  if(simpleTextareaRegex.test(obj.declaredClass) || misysSimpleTextareaRegex.test(obj.declaredClass)) {
					  // Insert a space before the text, if the textarea
					  // already has a value.
					  if(obj.get("value") !== "") {
						  insertionValue = "\n" + insertionValue;
					  }
					  m.insertAtCursor(obj, insertionValue);
				  } else if(filteringSelectRegex.test(obj.declaredClass)){
					 if(editableFields.indexOf(obj.id) > -1)
					 {
						 obj.set("value",insertionValue);
					 }
					 else
					 {
						 if( type === "treasury_beneficiary_accounts"){
							 obj.set("value", insertionValue);
							 obj.set("displayedValue",insertionValue);
						 }				 
						 else{ 
							  obj.set("value","");
							  obj.store = new dojo.data.ItemFileReadStore({
									data: {
										 identifier: "value",
								         label: "name",
								         items: insertionValue
									}
							   });
							 }
						 }
				  } else {
					  // We overwrite the value of non-textarea fields
					  obj.set("value", insertionValue);
				  }

				  // TODO This looks hacky
				  // Call the object events, since we've entered a value
				  obj.onChange();
				  obj.onFocus();
				  obj.onBlur();
			  }
		  });

		  //If BIC Code is available clear the other fields and display only BIC Code
		  var showBICFlag = "false";
		  if(dj.byId("show_bic_code"))
			  {
			  	showBICFlag = dj.byId("show_bic_code").get("value");
			  }
		  if(showBICFlag === "true")
			  {
				  if(type === "treasury_beneficiary_accounts" && dj.byId("beneficiary_bank_bic") && dj.byId("beneficiary_bank_bic").get('value') !== "")
				  {
					dj.byId("beneficiary_bank").set('value','');
					dj.byId("beneficiary_bank_branch").set('value','');
					dj.byId("beneficiary_bank_address").set('value','');
					dj.byId("beneficiary_bank_city").set('value','');
					dj.byId("beneficiary_bank_country").set('value','');
					dj.byId("beneficiary_bank_bic").set('disabled', true);
				  }
			  }
		  
		  // TODO Refactor
		  if(childXhrDialog) {
			  if(closeParent) {
				  m.dialog.connect(childXhrDialog, "onHide", function(){
					  setTimeout(function(){
						  dj.byId("xhrDialog").hide();
					  }, dj.defaultDuration);
				  });
			  }
			  childXhrDialog.hide();
		  } else {
			  // Try to close the parent dialog
			  if(dj.byId("xhrDialog")) {
				  dj.byId("xhrDialog").hide();
			  }
		  }

		  // Filling Entity field if exists
		  // TODO This should be moved elsewhere, looks v. specific
		  var entity1 = dj.byId("01entity");
		  var entity2 = dj.byId("02entity");
		  var entity3 = dj.byId("03entity");
		  if (entity1) {
			  entity1.set("value", arrFieldValues[0]);
		  }
		  if (entity2) {
			  entity2.set("value", arrFieldValues[0]);
		  }
		  if (entity3) {
			  entity3.set("value", arrFieldValues[0]);
		  }
		  var swift_charges_type = arrFieldValues[arrFieldIds.indexOf("swift_charges_type")];
		  
		  if(swift_charges_type){					
			  if (swift_charges_type === "01") {
				  document.getElementById("swift_charges_type_1").click();
			  } else if(swift_charges_type === "02"){
				  document.getElementById("swift_charges_type_2").click();
			  } else if(swift_charges_type === "05"){
				  document.getElementById("swift_charges_type_3").click();
			  }  
		  }
		 
		  //passBack Extension for client specific
		  if(d.isFunction(m._config.passBack)) {
				return m._config.passBack(arrFieldIds,arrFieldValues,closeParent);
		 }
		  
		 
	  }
	});
			  
	 // Initialise 
	 d.subscribe("ready", function(){		
	  if(d.query(_chartSelector).length > 0) {
	   m.connect(window, "onresize", m.resizeCharts);
	  }
	  
	  if(d.query(_gridClassSelector).length > 0) {
		m.connect(window, "onresize", m.resizeGrids);
	  }
 });
})(dojo, dijit, misys);
//Including the client specific implementation
dojo.require('misys.client.common_client');