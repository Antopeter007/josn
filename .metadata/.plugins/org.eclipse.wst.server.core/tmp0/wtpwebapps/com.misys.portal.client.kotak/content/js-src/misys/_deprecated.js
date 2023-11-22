dojo.provide("misys._deprecated");

(function(/*Dojo*/d, /*Misys*/ m) {

	/**
	 * Maintaining a list of deprecated functions and variables, that will be recreated at runtime and
	 * their arguments passed thru to the new function
	 */
	
	var deprecatedPackages = [
	 // [(old package name, new package name(s))]  
	 // This is just a reference
     ["misys.common.CommonEvents", "misys._base,misys.common"],
     ["misys.common.Resize", "misys.common"],
     ["misys.common.LoginFormValidations", "misys.validation.login"],
     ["misys.common.GridEvents", "misys.grid._base,misys.grid.common"],
     ["misys.binding.SyLoginBinding", "misys.binding.system.login"],
     ["misys.common.FormEvents", "misys.form.common"],
     ["misys.common.FormValidations", "misys.validation.common"],
     ["misys.common.Bookmark", "misys.Bookmark"]
	];
	
	var deprecatedFncs = [
	      // summary:
	      //	an array of tuples of the form [(old func signature, new fnc name)]
	      //
	      // description:
	      //	at runtime, the array is traversed and all old functions (except those that 
	      //	are also in the dontBind array, see below) are recreated as empty function stubs 
	      //    that pass their arguments through to the new function 

    	  ["fncAddDialogEvent(node, event, method, id)", "misys.dialog.connect"],
    	  ["fncDisconnectDialogEvents(node)", "misys.dialog.disconnect"],
    	  ["fncShowModalDialog(type,message,title, onHideCallback,onShowCallback, url)", "misys.dialog.show"],
    	  ["fncDoBinding()", "misys.bind"],	// dontbind
    	  ["fncAddEvent(obj, event, context, method)", "misys.connect"],
    	  ["fncGetLocalizationString(key, subs)", "misys.getLocalization"],
    	  ["fncSetLocalizationString(key, val)", "misys.setLocalization"],
    	  ["fncLoadBinding()", "misys.loadResources"],
    	  ["fncDoFormOnLoadEvents()", "misys.onFormLoad"],	// dontbind
    	  ["fncDoPageOnloadEvents()", "misys.onLoad"],
    	  ["fncDoWidgetParsing(dObj, handle)", "misys.parseWidgets"],
    	  ["fncSetValidation(node,fnc,noWrap)", "misys.setValidation"],
    	  ["fncValidateChangePassword()", "misys.validateChangePassword"],
    	  ["fncValidateLoginId()", "misys.validateLoginId"],
    	  ["fncXhrGet(obj)", "misys.xhrGet"],
    	  ["fncXhrPost(obj)", "misys.xhrPost"],
    	  ["fncActivateTabEvents()", "_bindTabs, but this is a private function"], // dontbind
    	 // ["fncDoBookmarkAction(a, b, c, d, e)", "misys.bookmark"],
    	  ["fncConfirmDelete(a, b)", "misys.confirmDelete"],
    	  ["fncActivateFocusFieldsOnError()", "_focusFieldsOnError, but this is a private function"], //dontbind
    	  ["fncResizeChartWithClass()", "misys.resizeCharts"],	// dontbind
    	  ["fncGetChartImageMap(url, targetId, dealID, borrowerID)", "misys.getChartImageMap"],
    	  ["showDialog(id)", "misys.showChartDialog"],
    	  ["fncGenerateDocument(a, b, c, d, e)", "misys.popup.generateDocument"],
    	  ["fncShowReporting(a, b, c, d, e)", "misys.popup.showReporting"],
    	  ["fncShowPreview(a, b, c, d, e)", "misys.popup.showPreview"],
    	  ["fncSummaryPerform(a, b, c, d, e)", "misys.popup.showSummary"],
    	  ["fncGenerateXMLNodeString(node)", "misys.fieldToXML"],
    	  ["fncGetNodeValue(a, b)", "removed, refer to wiki"], // dontbind
    	  ["fncGenerateTransactionXML()", "misys.formToXML"],
    	  ["fncPerform(type)", "misys.submit"],
    	  ["fncEditTransactionDetails()", "misys.toggleTransaction"], // arguments have changed
    	  ["fncShowTooltip(a,b,c,d)", "misys.showTooltip"],
    	  ["fncSetCurrency(a,b)", "misys.setCurrency"],
    	  ["fncToggleDynamicFields(a,b,c,d,e)", "misys.toggleFields"],
    	  ["fncPopulateReferences()", "misys.populateReferences"],
    	  ["fncSetTnxAmt(a)", "misys.setTnxAmt"],
    	  ["fncAmendIncAmt(a,b)", "misys.amendTransaction"],
    	  ["fncIncAmtReadOnly(a, b)","misys.toggleAmendmentFields"],
    	  ["fncSetSubTnxTypeCode(a)", "misys.updateSubTnxTypeCode"],
    	  ["fncEnableBeneficiaryFields()", "misys.enableBeneficiaryFields"],
    	  ["fncToggleProdStatCodeActions()", "misys.toggleProdStatCodeFields"],
    	  ["fncToggleTOC()", "misys.toggleTOC"],
    	  ["fncCreateTOC()", "misys.createTOC"],
    	  ["fncCutCRLF(a)", "misys.trim, but arguments have changed. Consult doc"], // dontbind
    	  ["fncToggleGuaranteeText()", "misys.toggleGuaranteeText"],
    	  ["fncDoIssuingBankRefAction()", "misys.setApplicantReference"],
    	  ["fncVerifyShipmentDates()", "misys.validateShipmentDates"],
    	  ["fncAddMultiSelectItems(a,b)", "misys.addMultiSelectItems"],
    	  ["_fncInsertAtCursor(a,b)", "misys.insertAtCursor"],
    	  ["fncToggleRequired(a, b)", "misys.toggleRequired"],
    	  ["fncSearchCreditAvailBy(a, b, c, d, e)", "misys.showBankTypeDialog"],
    	  ["fncSearchPopup(a, b, c, d, e, f, g, h, i, j, k)", "misys.showSearchDialog"],
    	  ["fncEntityPopup(a, b, c, d, e, f, g, h, i, j, k, l)", "misys.showEntityDialog"],
    	  ["fncSearchDraweeDetails(a, b, c, d)", "misys.showDraweeDialog"],
    	  ["fncPassBack(a, b, c)", "misys.dialog.passBack"],
    	  ["fncAddStaticData(a, b, c, d, e)", "misys.populateStaticDataDialog"],
    	  ["fncGetStaticDataURL(a, b, c, d, e, f)", "misys.getStaticDataURL"],
    	  ["fncOpenUploadDialog(a)", "misys.showUploadDialog"], 
    	  ["fncComputeMaturityDate()", "misys.getMaturityDate"],
    	  ["fncFtManageCounterparties()", "misys.initFTCounterparties"],
    	  ["fncDisableNonAcceptance()", "misys.disableNonAcceptanceFields"],
    	  ["fncSubmitAuthenticatedRecords(a)", "misys.submitReauthRecords"],
    	  ["checkEnabled(a)", "misys.checkReauthEnabled"],
    	  ["fncValidateTemplateId()", "misys.validateTemplateId"],
    	  ["fncValidateTradeExpiryDate()", "misys.validateTradeExpiryDate"],
    	  ["fncValidateEarlierDateAndLaterDate(a, b, c, d)", "misys.validateOrderedDates"],
    	  ["fncValidateDateGreaterThan(a, b, c)", "misys.validateDateGreaterThan"],
    	  ["fncValidateDateSmallerThan(a, b, c)", "misys.validateDateSmallerThan"],
    	  ["fncValidateLastShipDate()", "misys.validateLastShipmentDate"],
    	  ["fncValidateTolerance()", "misys.validateTolerance"],
    	  ["fncValidateMaxCreditTerm()", "misys.validateMaxCreditTerm"],
    	  ["fncValidateCurrency()", "misys.validateCurrency"], 
    	  ["fncValidateExecDate()", "misys.validateExecDate"],
    	  ["fncValidateIssueDate()", "misys.validateIssueDate"],
    	  ["fncValidateLatestAnwserDate()", "misys.validateLatestAnswerDate"],
    	  ["fncValidateTFMaturityDate()", "misys.validateTFMaturityDate"],
    	  ["fncValidateAmendAmount(a, b, c)", "misys.validateAmendAmount"],
    	  ["fncValidateTransferAmount()", "misys.validateTransferAmount"],
    	  ["fncValidateAmendmentDate()", "misys.validateAmendmentDate"],
    	  ["fncValidateBankExpiryDate()", "misys.validateBankExpiryDate"],
    	  ["fncValidateLink()", "misys.validateLink"],
    	  ["fncValidateBICFormat()", "misys.validateBICFormat"],
    	  ["fncValidateBEIFormat()", "misys.validateBEIFormat"],
    	  ["fncValidateCharacters()", "misys.validateCharacters"],
    	  ["fncValidateEmailAddr()", "misys.validateEmailAddr"],
    	  ["fncValidateWebAddr()", "misys.validateWebAddr"],
    	  ["fncValidatePassword()", "misys.validatePassword"],
    	  ["fncValidateMonthly()", "misys.validateMonthly"],
    	  ["fncValidateDateTermField(a, b, c, d)", "misys.validateDateTermField"],
    	  ["fncValidateOrderType()", "misys.validateOrderType"],
    	  ["fncValidateAxisScale()", "misys.validateAxisScale"],
    	  ["fncValidateGroupingColumn()", "misys.validateGroupingColumn"],
    	  ["fncValidateOutstandingAmountValue()", "misys.validateOutstandingAmount"],
    	  ["fncCheckFormatRate()", "misys.validateRateFormat"], 
    	  ["fncFormatAttachmentActions(a)", "misys.formatFileActions"],
    	  ["fncFormatAttachmentViewActions(a)", "misys.formatFileViewActions"],
    	  ["getImageForAttachment(a)", "misys.getFileIcon"],
    	  ["doUploadFile(a, b)", "misys.uploadFile"],
    	  ["fncDownloadUploadFile(a, b)", "misys.downloadFile"],
    	  ["fncAddItem(a)", "misys.addFileItem"],
	      ["fncSetCreditAvailBy()", "misys.setCreditAvailBy"],
	      ["fncTogglePaymentDraftAt()", "misys.togglePaymentDraftAt"],
	      ["fncToggleBankPaymentDraftAt()", "misys.toggleBankPaymentDraftAt"],
	      ["fncToggleDraftTerm(a)", "misys.toggleDraftTerm"],
	      ["fncWriteDraftTerm()", "misys.setDraftTerm"],
	      ["fncDraweeReadOnlyByCredit()", "misys.initDraweeFields"],
	      ["fncDraftDaysReadOnly()", "misys.setDraftDaysReadOnly"],
	      ["fncCheckIrrevocableFlag()", "misys.checkIrrevocableFlag"],
	      ["fncCheckNonTransferableFlag()", "misys.checkNonTransferableFlag"],
	      ["fncCheckStandByFlag()", "misys.checkStandByFlag"],
	      ["fncResetConfirmationCharges()", "misys.resetConfirmationCharges"],
	      ["fncCheckConfirmationCharges()", "misys.checkConfirmationCharges"],
	      ["fncToggleRenewDetails(a,b)", "misys.toggleRenewalDetails, but arguments have changed. Refer to doc"], // dontbind
	      ["fncToggleDependentFields(a, b, c)", "misys.toggleDependentFields"],
	      ["fncOpenPopupContent(a,b)","misys.dialog.populate"],
	      ["fncClosePopupContent(a, b, c)","misys.dialog.clear"],
	      ["fncPopupPerform(a)","misys.dialog.submit"],
	      ["doPopupBinding()","misys.dialog.bind"],
	      ["fncSetGridStore(a, b, c)","misys.grid.setStore"],
	      ["fncSelectAllRecords()","misys.grid.selectAll"],
	      ["fncRedirectWithConfirmation(a,b)","misys.redirectWithConfirmation"],
	      ["fncFilterGrid(a,b,c)","misys.grid.filter"],
	      ["fncUpdateStoreURL(a, b)", "misys.grid.setStoreURL"],
	      ["fncToggleHistoryButton(a)", "misys.toggleHistoryButton"],
	      ["fncConcatCheckboxes(a,b)", "misys.concatCheckboxes"],
	      ["fncReloadGridForSearchTerms()", "misys.grid.reloadForSearchTerms"],
	      ["fncDeleteRecords()", "misys.grid.deleteRecords"],
	      ["fncLoadRecords()", "misys.grid.loadRecords"],
	      ["fncSubmitRecords()", "misys.grid.submitRecords"],
	      ["fncGroupRecords()", "misys.grid.groupRecords"],
	      ["fncPrintRecords()", "misys.grid.printRecords"],
	      ["fncTriggerSelectionChangedEventFromGridSelection()", "misys.grid.onSelection"],
	      ["getCellData(a,b)", "misys.grid.getCellData"],
	      ["fncFormatJS(a)", "misys.grid.formatJSLink"],
	      ["fncGetBox(a,b)", "misys.grid.formatSelectField"],
	      ["fncAskDeleteRecords(a,b)", "misys.grid.confirmDeleteRecords"],
	      ["fncProcessRecords(a,b)", "misys.grid.processRecords"],
	      ["fncApplyGroupStyle(a)", "misys.grid.setRowStyle"],
	      ["fncGroupOnBeforeRow(a,b)", "misys.grid.setGroupBeforeRow"],
	      ["fncFooterOnBeforeRow(a,b)", "misys.grid.setFooterBeforeRow"],
	      ["fncGetGroupHeader(a,b)", "misys.grid.getGroupHeader"],
	      ["fncFormatGroupHeader(a)", "misys.grid.formatGroupHeader"],
	      ["fncGetGroupFooter(a,b)", "misys.grid.getGroupFooter"],
	      ["fncFormatGroupFooter(a,b)", "misys.grid.formatGroupFooter"],
	      ["fncGroupToggle(a,b,c)", "misys.grid.toggleGroup"],
	      ["fncAllGroupToggle(a,b)", "misys.grid.toggleAllGroups"],
	      ["fncShowGroups(a,b)", "misys.grid.showGroups"],
	      ["fncHideGroups(a,b)", "misys.grid.hideGroups"],
	      ["fncGetAggregates(a,b)", "misys.grid.getAggregates"],
	      ["fncToggleExpandedList(a,b)", "misys.grid.toggleExpandedList"],
	      ["fncValidateSearchDateRange()", "misys.grid.validateSearchDateRange"],
	      ["fncRedirectTo(a)", "misys.grid.redirect"],
	      ["fncRateColumnCanSort(a)", "misys.grid.noSortOnSecondColumn"],
	      ["fncNoSortOnThirdColumn(a)", "misys.grid.noSortOnThirdColumn"],
	      ["fncNoSortOnFourthColumn(a)", "misys.grid.noSortOnFourthColumn"],
	      ["fncNoSortOnFifthColumn(a)", "misys.grid.noSortOnFifthColumn"],
	      ["fncNoSortOnSixthColumn(a)", "misys.grid.noSortOnSixthColumn"],
	      ["fncNoSortOnSeventhColumn(a)", "misys.grid.noSortOnSeventhColumn"],
	      ["fncNoSortOnEighthColumn(a)", "misys.grid.noSortOnEighthColumn"],
	      ["fncSortFloatColumn(a,b)", "misys.grid.sortFloatColumn"],
	      ["fncSortLinkColumn(a,b)", "misys.grid.sortLinkColumn"],
	      ["fncSortDateColumn(a,b)", "misys.grid.sortDateColumn"],
	      ["fncSimpleHTMLFormatter(a)", "misys.grid.formatSimpleHTML"],
	      ["fncHTMLFormatter(a)", "misys.grid.formatHTML"],
	      ["fncCountryFlagFormatter(a)", "misys.grid.formatFlagImage"],
	      ["fncFormatSummary(a,b,c,d,e)", "misys.grid.formatSummary"],
	      ["fncFormatOperationsSummary(a,b)", "misys.grid.formatOperationsSummary"],
	      ["fncFormatTypesSummary(a,b)", "misys.grid.formatTypesSummary"],
	      ["fncFormatDataSummary(a,b)", "misys.grid.formatDataSummary"],
	      ["fncFormatTitlesSummary(a,b)", "misys.grid.formatTitlesSummary"],
	      ["fncFormatURL(a)", "misys.grid.formatURL"],
	      ["fncFormatActions(a)", "misys.grid.formatActions"],
	      ["fncGetURL(a,b)", "misys.grid.getURL"],
	      ["fncGetActions(a,b)", "misys.grid.getActions"],
	      ["fncAskForwardRecords(a,b)", "misys.grid.confirmForwardRecords"],
	      ["fncValidateTransferExpiryDate()", "misys.validateTransferExpiryDate"],
	      ["fncValidateTransferLastShipmentDate()", "misys.validateTransferLastShipmentDate"],
    	  ["fncValidateTransferNumbers()", "misys.validateTransferNumbers"],
    	  ["fncUpdateOutstandingAmount(a, b)", "misys.updateOutstandingAmount"],
    	  ["fncDoPreValidateValidations()", "misys.validateSummitTransaction"],
    	  ["fncConfirmAccountDelete(a, b, c)", "misys.confirmAccountDelete"],
    	  ["fncSearchTransactions(a,b,c)", "misys.showSearchTransactionsDialog"],
    	  ["fncDeleteTransactions()", "misys.deleteTransactions"],
    	  ["fncTransactionUsersDetails(a,b,c)", "misys.showTransactionUsersDialog"],
    	  ["fncSetListKey(a)", "misys.grid.setListKey"],
    	  ["fncBgSelectPerform(a)", "misys.selectGuaranteeType"],
    	  ["fncShowHideBgSections()", "misys.toggleGuaranteeSections"],
    	  ["fncToggleTransactionDetails()", "misys.toggleTransaction but arguments have changed. Consult the doc"], // dontbind
    	  ["fncDoPreSubmitEvents()", "misys.beforeSubmit"], //dontbind
    	  ["fncDoPreSubmitValidations()", "misys.beforeSubmitValidations"], // dontbind
    	  ["fncGetGlobalVariable(a)", "read off the global object misys._config, refer to wiki"], // dontbind
    	  ["fncSetGlobalVariable(a, b)", "written to the global object misys._config, refer to wiki"], // dontbind
    	  ["fncOpenCustomerReferenceDialog(a, b)", "misys.dialog.showCustomerReferenceDialog"],
    	  ["fncAddCustomerReference(a)", "misys.addCustomerReference"],
    	  ["fncDeleteHelpData(a, b)", "misys.deleteHelpData"],
    	  ["fncModifyHelpData(a, b)", "misys.editHelpData"],
    	  ["fncGetHelpSection(a)", "misys.getHelpData"],
    	  ["fncInitHelpTreeMenu()", "misys.initHelpTree"],
    	  ["fncToggleSearchMode()", "misys.toggleHelpSearchMode"],
    	  ["fncBuildLucenceQuery()", "misys.buildLucenceQuery"],
    	  ["fncUploadStaticDocument()", "misys.uploadStaticDocument"],
    	  ["fncDeleteStaticDocument()", "misys.deleteStaticDocument"],
    	  ["fncDownloadStaticDocument(a)", "misys.downloadStaticDocument"],
    	  ["fncOpenStaticDocumentUploadDialog(a)", "misys.openStaticDocumentDialog"],
    	  ["fncAddTask(a, b)", "misys.addCollaborationTask"],
    	  ["fncOpenComment(a, b)", "misys.openCollaborationComment"],
    	  ["fncAddComment(a)", "misys.addCollaborationComment"],
    	  ["fncOpenPublicTaskDialog()", "misys.openPublicTaskDialog"],
    	  ["fncOpenNotificationTaskDialog()", "misys.openNotificationTaskDialog"],
    	  ["fncOpenPrivateTaskDialog()", "misys.openPrivateTaskDialog"],
    	  ["fncDoCollaborationBinding()", "misys.bindCollaboration"],
    	  ["fncFinishTask(a, b, c)", "misys.finishCollaborationTask"],
    	  ["fncGetBankName()", "misys.getCollaborationBankName"],
    	  ["fncReset()", "misys.resetCollaborationFields"],
    	  ["fncShowMoreTasksDetails()", "misys.showCollaborationTaskDetails"],
    	  ["fncShowMultipleChoiceDialog(a, b, c, d)", "misys.showMultipleChoiceDialog"],
    	  ["fncGetMultipleChoiceRadioBtn(a)", "misys.getMultipleChoiceRadioButton"],
    	  ["fncCreateRteEditor()", "misys.createRteEditor"],
    	  ["fncToggleGuaranteeTextType()", "misys.toggleGuaranteeTextType"],
    	  ["fncOpenLogoUploadDialog()", "misys.showLogoUploadDialog"],
    	  ["fncCancelLogoUpload()", "misys.hideLogoUploadDialog"],
    	  ["fncDoUploadLogo(id)", "misys.uploadLogo"],
    	  ["populateImageData(a, b)", "I couldn't find a reference to its use, so I removed it"],
    	  ["fncAddAttachment(a, b)", "misys.addTransactionAddon"],
    	  ["fncDeleteRow(a, b, c)", "misys.deleteTransactionAddon"],
    	  ["fncEditRow(a, b, c)", "misys.editTransactionAddon"],
    	  ["fncDismissDialog(a, b)", "misys.hideTransactionAddonsDialog"],
    	  ["fncDoOpenAttachmentDialog(a, b)", "misys.showTransactionAddonsDialog"],
    	  ["fncDoOpenCounterpartyDialog(a)", "misys.showCounterpartyDialog"],
    	  ["fncDoAddCounterpartyActions(a)", "misys.addCounterpartyAddon"],
    	  ["fncReorganizeDiplayedFields(a)", "misys.toggleAlertAdditionalFields"],
    	  ["fncShowHideDateSections(a)", "misys.toggleAlertDateFields"],
    	  ["fncOpenAttachmentDialog()", "Removed completely. See misys.showTransactionAddonsDialog"],
    	  ["fncOpenCounterpartyDialog()", "Removed completely. See misys.showCounterpartyDialog"],
    	  ["fncOpenCustomerReferenceDialog()", "Removed completely. No references or implementation found"],
    	  ["fncValidateImage", "misys.validateImage"],
    	  ["populateLogoFeedBack", "misys.populateLogoFeedBack"]
    ];
	
	var dontBind = ["fncDoBinding",               // bind
	                "fncDoFormOnLoadEvents",      // onFormLoad
	                "fncToggleTransactionDetails",// toggleBankTransaction
	                "fncDoPreSubmitEvents",       // beforeSubmit
	                "fncDoPreSubmitValidations",  // beforeSubmitValidations
	                "fncActivateTabEvents",       // _bindTabs, private
	                "fncActivateFocusFieldsOnError", // _focusFieldsOnError
	                "fncResizeChartWithClass", // resizeCharts
	                "fncGetNodeValue",	// removed
	                "populateImageData", // removed
	                "fncOpenAttachmentDialog", // removed
	                "fncOpenCounterpartyDialog",
	                "fncCutCRLF",	// now misys.trim, but arguments changed
	                "fncGetGlobalVariable", // read it off misys._config
	                "fncSetGlobalVariable", // write it to misys._config
	                "fncToggleRenewDetails"]; // now misys.toggleRenewalDetails, but params changed

	var deprecatedVars = [
	  // [oldVar, newVar]
	  ["CLIENT", "misys._config.client"],
	  ["CONTEXT_PATH", "misys._config.context"],
	  ["SERVLET_PATH", "misys._config.servlet"],
	  ["XML_TAG_NAME", "misys._config.xmlTagName"],
	  ["REQUIRED_FIELD_PREFIX", "misys._config.requiredFieldPrefix"],
	  ["PRODUCT_CODE", "misys._config.productCode"],
	  ["HOME_URL", "misys._config.homeUrl"],
	  ["ONLINE_HELP_URL", "misys._config.onlineHelpUrl"],
	  ["GLOBAL_EVENTS", "misys.connections"],
	  ["DIALOG_EVENTS", "misys.dialog.connections"],
	  ["IS_DIALOG_ACTIVE", "misys.dialog.isActive"],
	  ["SHOW_TABLE", "misys._config.showTable"],
	  ["SHOW_TABLE_ROW", "misys._config.showTableRow"],
	  ["IMAGES_SRC", "misys._config.imagesSrc"],
	  ["ONSUBMIT_ERRORMSG", "misys._config.onSubmitErrorMsg"],
	  ["ADVISING_BANK", "misys._config.advisingBank"],
	  ["ANY_BANK", "misys._config.anyBank"],
	  ["OTHER", "misys._config.other"],
	  ["NAMED_BANK", "misys._config.namedBank"],
	  ["FIRST_PAGE_LOAD", "misys._config.firstPageLoad"],
	  ["displayMode", "misys._config.displayMode"],
	  ["ft_type", "misys._config.ftType"]
    ];

	fncGetGlobalVariable = function(key) {
		// summary: 
		//	Intercept the old getGlobal function 
		
		if(d.indexOf(m._deprecated.found, "fncGetGlobalVariable") == -1) {
			console.warn('[misys._deprecated] The function fncGetGlobalVariable is deprecated. Instead just add the variable to the global misys object e.g. misys.myVar = "foo"');
			m._deprecated.found.push("fncGetGlobalVariable");
		}
		var value = '';
		if(dojo.global.mtpGlobals)
		{
			value = dojo.global.mtpGlobals[key] || '';
		}
		if(value === null || value === '') {
			deprecatedVars.every(function(tuple) {
				if(tuple[0] === key) {
					if(d.indexOf(m._deprecated.found, key) == -1) {
						console.warn('[misys._deprecated] The global variable ' + key + ' is deprecated. Instead use ' + tuple[1]);
						m._deprecated.found.push(key);
					}
					value = dojo.eval(tuple[1]);
					return false;
				}
				return true;
			});
		}
		return value;
	};
	
	fncSetGlobalVariable = function(key, value) {
		// summary: 
		//	Intercept the old setGlobal function 
		
		if(m._deprecated.found && d.indexOf(m._deprecated.found, "fncSetGlobalVariable") == -1) {
			console.debug('[misys._deprecated] The function fncSetGlobalVariable is deprecated. Instead just read the variable from the global misys object e.g. console.log(misys.myVar)');
			m._deprecated.found.push("fncSetGlobalVariable");
		}
		if(!dojo.global.mtpGlobals)
		{
			dojo.global.mtpGlobals = {};
		}
		
		dojo.global.mtpGlobals[key] = value;
		misys[key] = value;
	};
	
	// A few functions have changed signature, we handle them individually below
	
	fncFadeIn =  function( /*String|Node|NodeList*/ node,
			   			   /*String*/ displayMode,
			   			   /*Function*/ callback) {
			console.warn("[misys._deprecated] fncFadeIn is deprecated,",
				   "use misys.animate('fadeIn', ...) instead");
			var display = displayMode || "block";
			misys.animate("fadeIn", node, callback, false, {display: display});
	};

	fncFadeOut = function( /*String|Node|NodeList*/ node,
				/*Function*/ callback) {
			console.warn("[misys._deprecated] fncFadeOut is deprecated,",
			"use misys.animate('fadeOut', ...) instead");
			misys.animate("fadeOut", node, callback);
	};

	fncWipeIn = function( /*Document Node*/ node,
			   			  /*Function*/ callback) {
		console.warn("[misys._deprecated] fncWipeIn is deprecated,",
		"use misys.animate('wipeIn', ...) instead");
		misys.animate("wipeIn", node, callback);
	};
	
	fncWipeIn = function( /*Document Node*/ node,
 			  			  /*Function*/ callback) {
		console.warn("[misys._deprecated] fncWipeOut is deprecated,",
		"use misys.animate('wipeOut', ...) instead");
		misys.animate("wipeOut", node, callback);
	};
	// On page load, create the function stubs
	
	d.ready(function(){
		var allDeprecated = null;
		d.mixin(m._deprecated, {
				found : [],
				find : function(/*String*/ oldName) {
					// Check functions
					var newNames = [];
					var exactMatch = false;
					if(!allDeprecated) {
						allDeprecated = deprecatedFncs.concat(deprecatedVars);
					}
					allDeprecated.every(function(tuple){
						var fnc = tuple[0];
						var fncName  = fnc.substring(0, fnc.indexOf('('));
						if(fncName === oldName) {
							newNames.push(tuple[1]);
							exactMatch = true;
							return false;
						} else if (fncName.indexOf(oldName) != -1) {
							newNames.push(tuple[1]);
						}
						
						return true;
					});
					var result;
					if(newNames.length === 0) {
						result =  "Sorry I couldn't find your function! Ask Cormac";
					} else  if (newNames.length == 1 && exactMatch){
						result = oldName + " is now " + newNames[0];
					} else {
						result = oldName + " is partially matched by the following\n\n";
						d.forEach(newNames, function(matches) {
							result += " " + matches + "\n";
						});
					}
					return result;
				}
		});
		d.forEach(deprecatedVars, function(tuple) {
			if(d.indexOf(m._deprecated.found, tuple[0]) == -1) {
				m._deprecated.found.push(tuple[0]);
			}
			dojo.eval(tuple[0] + "=" + tuple[1]);
		});
		d.forEach(deprecatedFncs, function(tuple) {
			var fnc = tuple[0],
				fncName  = fnc.substring(0, fnc.indexOf('('));
			
			if(d.indexOf(dontBind, fncName) === -1) {
				var newFnc = tuple[1],
					sig = fnc.substr(fnc.indexOf('(')),
					script = fncName + " = function" + sig + "{";
				
					script += "if(dojo.indexOf(misys._deprecated.found,'" + fncName +
					"') == -1){ console.warn('[misys._deprecated] The function " + 
					fncName + " is deprecated. Instead use " + newFnc +
					"');misys._deprecated.found.push('" + fncName + 
					"');var callerName = (" + fncName + ".caller) ? " + 
					fncName + 
					".caller.name : ''; if(callerName === null || callerName === ''){callerName = " +
					fncName+".caller || '';}console.log('It was called here '+callerName);}";
				script += "return " + newFnc + ".apply(misys, arguments);};";
				d.eval(script);
			}
		});
	});
})(dojo, misys);