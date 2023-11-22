dojo.provide("misys.form.addons");

dojo.require("misys.form.addon_definitions");
dojo.require("dojo.data.ItemFileReadStore");
dojo.require("misys.grid._base");

// Copyright (c) 2000-2011 Misys (http://www.m.com),
// All Rights Reserved. 
//
//summary:
// Scripts for generically attaching addons to the transaction (charges, documents, etc.). Formerly
// called "Attachments", but this was being confused with file uploads
//
// version:   1.1
// date:      13/07/2011
// author:    Cormac Flynn
// email:     cormac.flynn@m.com

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode
	
	// Private functions & variables go here
	m._config = m._config || {};
	d.mixin(m._config, {
		isEditMode : false,			// Are we in edit mode?
		logoData : "",				// Logo data TODO Is this necessary?
		currentAddonId : ""	,		// The Id of the addon currently being examined
		errorField : []				// array of fields in error
	});	
	
	function _addRow( /*String*/ type,
					  /*String*/ id,
					  /*String*/ prefix,
					  /*String*/ insertIndex) {
		// summary:
		//	Add a row to the table. Specifics of the row are delegated to the functions
		//	for the particular addon.
		
		var suffix = (type === "customerReference") ?
				"_" + dj.byId("customerReference_target_bank").get("value") : "";
		var	table = d.byId(prefix + type + suffix + "-master-table");
		var	lastRow = (insertIndex) ? +insertIndex + 1 : table.rows.length;
		var	cells = m._addons.tableCells[type](prefix);
		var	hiddenFields = m._addons.hiddenFields[type](id, prefix);
		var	anims = [];
		var	row;
		var	showAnimChain;

		//when in edit mode for authorisation role,
		//modify the current row i,e create a new row
		//in the same position which is getting modified
		//as the original row will be deleted.
		if(m._config.isEditMode && type === 'role')
		{
			lastRow = m._config.currentRowIndex; 
		}
		// Create the row, initially hidden
		if(table.lastChild.localName=='tbody')
		{
			row=table.lastChild.insertRow(lastRow-1);
		}
		else
		{
			row= table.insertRow(lastRow);
		}
		row.setAttribute("id", type + suffix + "_row_" + id);
		d.style(row, "display", "none");
		d.style(row, "opacity", 0);
		d.forEach(cells, function(cell, index){
			var node;
			if(type === "topic")
			{
				node = d.create("div", {innerHTML: cell.value}, row.insertCell(index));
			}
			else if(type === "customerReference")
			{
				node = d.create("div", {innerHTML: m.grid.sanitizeHTMLDataForUI(cell.value)}, row.insertCell(index));
				d.style(node,"white-space","pre");
			}
			else
			{
				node = d.create("div", {innerHTML: m.grid.sanitizeHTMLDataForUI(cell.value)}, row.insertCell(index));	
			}
			if(type === "charge" && index == '1')
			{
				dojo.attr(node, "class", "chrgaddcmt");
			}
		});
		
		// Add the standard set of delete/edit buttons, as the last cell in the table
		_addEditButtons(row, cells.length, id, type + suffix, prefix);
		
		// Set the hidden fields for the addon
		d.forEach(hiddenFields, function(hiddenField)
		{
			var aTexBox = new dijit.form.TextBox(
			{
				id : hiddenField.name,
				name : hiddenField.name,
				readOnly : true,
				value : hiddenField.value,
				type : "hidden"
			});
			if (aTexBox)
			{
				aTexBox.placeAt(type + "_fields" + suffix, "last");
			}
		});
		
		// Handle a particular case for Alerts
		// TODO This looks very brittle, too much String manipulation
		if(dj.byId(type+"_product_nosend")) {
			if (dj.byId(type+"_details_usercode_nosend").get("value") === "*") {
				dj.byId("alerts_"+type.substr(5, 2)+"_details_langcode_"+id).set("value", 
					dj.byId(type+"_details_langcode_nosend").get("value"));
				dj.byId("alerts_"+type.substr(5, 2)+"_details_usercode_"+id).set("value", "*");
			} else {
				dj.byId("alerts_"+type.substr(5, 2)+"_details_langcode_"+id).set("value", "*");
				dj.byId("alerts_"+type.substr(5, 2)+"_details_address_"+id).set("value", 
						dj.byId(type+"_details_usercode_nosend").get("value"));
			}
		}
		
		// Setup the animation sequencing
		showAnimChain = m.animate("fadeIn", row, true, null, {display: m._config.showTableRow});
		
		if(m._config.isEditMode) {
			// If we're editing an entry, delete the original row
			m.deleteTransactionAddon(type + suffix, m._config.currentAddonId, "", showAnimChain);
		} else {
			// Set the table to visible, if we have to
			anims.push(showAnimChain);
			if(d.style(table, "display") === "none") {
				d.style(d.byId(type + suffix + "-notice"), "display", "none");
				anims.push(m.animate("fadeIn", table, null, true, {display: m._config.showTable}));	
			}
			try{
			dojo.fx.combine(anims).play();
			}
			catch(err){
				console.debug("error during  playing animation");
			}
			
		}
				
		// Finally, increment the global counter
		if(!m._config.isEditMode) {
			m._config[type + suffix + "Attached"]++;
		}
	}
	
	function _addEditButtons(row, index, id, type, prefix){
		// summary:
		//		TODO
		
		var editCell = row.insertCell(index),
			editButtonDiv = d.create("div", null, editCell),
			deleteDropDown = d.create("div", null, editCell),
	    	deleteTooltip = d.create("div", null, deleteDropDown),
	    	text = d.doc.createElement("p"),
	    	deleteButtonDiv,
	    	editButton,
	    	deleteButton,
	    	deleteTooltipD,
	    	deleteDropDownB;
		
	    text.innerHTML =
	    	m.getLocalization("delete" + type + "FileConfirmation");
	    deleteTooltip.appendChild(text);
	    deleteButtonDiv = d.create("div", null, deleteTooltip, "last");
	    
	    editButton = new dj.form.Button( {
	    	// TODO This should be built using d.create
			label :"<img src='" + misys.getContextualURL(misys._config.imagesSrc +
					m._config.imageStore.editIcon) + "' alt='Edit'>",
			onClick : function(){
				m.editTransactionAddon(type, id, prefix,row.rowIndex);
			}
		}, editButtonDiv);
	    d.addClass(editButton.domNode, "noborder");
	    
	    d.create("p", {
	    		innerHTML:	m.getLocalization("delete" + type + "Confirmation")
	    }, deleteTooltip, "first");
	    
	    deleteButton = new dj.form.Button( {
			label :m.getLocalization("deleteMessage"),
			type :"submit"
		}, deleteButtonDiv);
	    deleteTooltipD = new dj.TooltipDialog( {
			title :m.getLocalization("deleteMessage"),
			execute : function(){
			//Todo: Will improve to make this as overridable function to perform additional tasks before deleting
				if(dj.byId("customerReference_target_bank") && (/customerReference/).test(type))
				{
					m.fncDeleteCustomerReferenceRow(type, id, prefix, null, type.substring("customerReference_".length));
				}else{
					m.deleteTransactionAddon(type, id, prefix);
				}
			}
		}, deleteTooltip);
		deleteTooltipD.startup();
		deleteDropDownB = new dj.form.DropDownButton( {
			// TODO Build using d.create
			label : "<img src='" + m.getContextualURL(m._config.imagesSrc +
							m._config.imageStore.deleteIcon) + "' alt='Delete'>"
		}, deleteDropDown);
		d.addClass(deleteDropDownB.domNode, "noborder");
		deleteDropDownB.startup();
	}

	d.mixin(m, {
		// Public functions & variables go here
		
		addTransactionAddon : function( /*String*/ type, /*String*/ prefix) {
			// summary:
			//		Add an addon to the transaction (document, charge, etc.)
			
			console.debug("[misys.form.addons] Adding an addon of type " + type);
			
			var 
				// Customer references use a special suffix
				suffix = (type === "customerReference") ?
					"_" + dj.byId("customerReference_target_bank").get("value") : "",
	
				//
				id = (type === "customerReference") ? 0 : m._config[type + suffix + "Attached"],
				
				//
				mandatoryFields = m._addons.mandatoryFields[type](prefix, suffix.replace("_", "")),
				//for any error field
				errorFields = m._config.errorField,
				
				//
				valid = false,
				
				field, declaredClass, value;

			prefix = prefix || "";	
			
			// Retrieve a new ID in non-edit mode
			// If the ID already exists, keep incrementing
			// until we find one. Guards against a clash
			// with an existing addon
				
			while(d.byId(type + suffix + "_row_" + id)){
				id++;
			}

			valid = d.every(mandatoryFields, function(fieldDetails, index, arr){
				field = dj.byId(fieldDetails.name);
				if (field){
					
					// TODO Should find a way to hook this into general validation
					value = field.get("displayedValue");
					declaredClass = field.declaredClass;
					if(/Number/.test(declaredClass) || (/Currency/.test(declaredClass))) {
						value = field.get("value");
						value = !isNaN(value) ? value : ""; 
					}

					if(value === "" || field.state === "Error")
					{
						var toolTipMsg = null;
						if (value === "") {
							toolTipMsg = m.getLocalization("mandatoryFieldsError");
						} else if (field.state === "Error") {
							toolTipMsg = m.getLocalization("mandatoryFieldsInvalidStateError");
						}
						m.showTooltip(toolTipMsg, field.domNode, ["above","before"]);
						field.state = "Error";
						field._setStateClass();
						dj.setWaiState(field.focusNode, "invalid", "true");
						return false;
					}
				}
				
				return true;
			});
			
			if(errorFields && errorFields.length >0){
				valid = false;
			}
			
			
			// TODO Update
			if (type === "topic") {
				valid = valid && m.validateImage();
			}
			
			if(!valid) {
				return false;
			}
			// Close the popup
			var dialog = dj.byId(prefix + type + "Dialog" + suffix);
			if(dialog) {
				dialog.hide();
			}
			
			// Add a row to the table
			// If type = role, the new row has to be inserted into the same rank
			if (type.toLowerCase() === "role" && m._config.isEditMode) {
				_addRow(type, id, prefix,
						dj.byId("roles_order_number_role_name_nosend").get("value"));
			} else {
				_addRow(type, id, prefix);
			}

			// Retrieve and reset all fields
			// TODO This was not working correctly, so commenting for now
//			d.query("input[id^=" + type + suffix + "]").forEach(
//					function(node, index, arr){
//						if(node.id && node.id.indexOf("nosend") !== -1){
//							//dj.byId(node.id).reset();
//							/*jsl:pass*/
//						}
//					}
//			);

			// Set edit mode to false
			m._config.isEditMode = false;
			m._config.currentAddonId = "";
			
			console.debug("[misys.form.addons] Addon added successfully");
			return true;
		},
		
		deleteTransactionAddon : function( /*String*/ type, 
										   /*String*/ id,
										   /*String*/ prefix,
										   /*dojo.fx.chain*/ chain,
										   /*CallBack*/ callBack) {
			//  summary:
		    //        Delete a row from the master table.
			
			var orderNumber = (type.toLowerCase() === "role" && !m._config.isEditMode) ? 
					+dj.byId("authorization_level_order_number_" + id).get("value") : 0,
				hiddenFields,
				suffix = "",
				anims = [],
				table,
				header,
				typeArray,
				orderField;
			
			prefix = prefix || "";
					
			// Initialisation for customer references
			if(/customerReference/.test(type)) {
				typeArray = type.split("_");
				if (typeArray.length === 2) {
					dj.byId("customerReference_target_bank").set("value", typeArray[1]);
					suffix = "_" + typeArray[1];
				}
			else if(typeArray.length > 2)
			{
				var customerReference_target_bank_value = "";
				customerReference_target_bank_value = customerReference_target_bank_value + typeArray[1];
				for (var i=2 ; i<typeArray.length;i++)
					{
						customerReference_target_bank_value = customerReference_target_bank_value + "_" + typeArray[i];						
					}
				dj.byId("customerReference_target_bank").set("value", customerReference_target_bank_value);
				suffix = "_" + customerReference_target_bank_value;
			}
				type = "customerReference";
			}
			
			hiddenFields = m._addons.hiddenFields[type](id, prefix);
			table = d.byId(prefix + type + suffix + "-master-table");
			
			// Perform pre-delete cleanup for specific product
			if(m._addons.deleteAddon.hasOwnProperty(type)) {
				m._addons.deleteAddon[type](id);
			}
			
			// Delete all the hidden fields
			d.forEach(hiddenFields, function(hiddenField){
				if(dj.byId(hiddenField.name)){
					dj.byId(hiddenField.name).destroy();
				}
			});
			//if its edit mode do not rearrange the order
			//for other roles
			if(!m._config.isEditMode)
			{
				// Update order_numbers for Authorization Levels
				d.query("*[id^=authorization_level_order_number_]").forEach(function(node){
					orderField = dj.byId(node.id);
					if ((+orderField.get("value")) > orderNumber) {
						orderField.set("value", orderField.get("value") - 1);
					}
				});
			}
			
			// Decrement the counter
			if(!m._config.isEditMode) {
				m._config[type + suffix + "Attached"]--;
			}
			
			// Setup the animation sequencing
			header = d.byId(type + suffix + "_row_" + id);
			anims.push(m.animate("fadeOut", header, function(){
				table.deleteRow(header.rowIndex);
				if(callBack)
				{
					callBack();
				}
				if(chain) {
					try{
						chain.play();
					}
					catch(err){
						console.debug("error during  playing animation");
					}
					
				}
			}, true));
			if(m._config[type + suffix + "Attached"] < 1){
				d.style(d.byId(type + suffix + "-notice"), "display", "block");
				anims.push(m.animate("fadeOut", table, null, true));
			}
			//handling error in executing the play in IE
			try{
				dojo.fx.combine(anims).play();
			}
			catch(err){
				console.debug("error while play");
			}
			
		},
		
		editTransactionAddon : function(type, id, prefix,currentRowIndex) {
			//  summary:
		    //        Edit a row from the master table.

			var suffix = "",
				hiddenFields,
				typeArray,
				noAlert,
				idBank,
				declaredClass;
			
			var prodCode = dijit.byId("product_code");
			var companyType = dijit.byId("company_type");

			if(prodCode && (prodCode.get("value") === "EC" || prodCode.get("value") === "IC") && type === "document") {
				m.populateAttachmentInfo();

				if(companyType && companyType.get("value") !== "01")
				{
					// If this is not a bank empty junk document map-to-attachment data(if any).  
					m.updateDocumentSection();
				}
			}

			prefix = prefix || "";
			m._config.isEditMode = true;
			m._config.currentAddonId = id;
			m._config.currentRowIndex = currentRowIndex;
			// Initialisation for customer references
			if(/customerReference/.test(type)) {
				typeArray = type.split("_");
				if (typeArray.length === 2)	{
					dj.byId("customerReference_target_bank").set("value", typeArray[1]);
					suffix = "_" + typeArray[1];
				}
			else if(typeArray.length > 2)
			{
				var customerReference_target_bank_value = "";
				customerReference_target_bank_value = customerReference_target_bank_value + typeArray[1];
				for (var i=2 ; i<typeArray.length;i++)
					{
						customerReference_target_bank_value = customerReference_target_bank_value + "_" + typeArray[i];						
					}
				dj.byId("customerReference_target_bank").set("value", customerReference_target_bank_value);
				suffix = "_" + customerReference_target_bank_value;
			}
				type = "customerReference";
			}
			
			hiddenFields = m._addons.hiddenFields[type](id, prefix);
			
			if(m._addons.bind.hasOwnProperty(type) && d.isFunction(m._addons.bind[type])) {
				m._addons.bind[type](prefix);
			}
			
			d.forEach(hiddenFields, function(field){
				if(dj.byId(field.name) && dj.byId(field.id)) {
					declaredClass = dj.byId(field.id).declaredClass;
					
					if(/Select/.test(declaredClass)) {
						dj.byId(field.id).set("value", dj.byId(field.name).get("value"));
					} 
					else if(/Radio/.test(declaredClass) || (/Check/.test(declaredClass))) {
						dj.byId(field.id).set("checked", true);
					} 
					else {
						 dj.byId(field.id).set("displayedValue", dj.byId(field.name).get("value"));
					}
				}
			});
			// Alert-specific
			if (dj.byId(type + "_product_nosend")) {
				noAlert=type.substr(5, 2);
				m.connect(type + "_product_nosend", "onChange", function(){
					if(dj.byId(type + "_datecode_nosend")) {
						dj.byId(type + "_datecode_nosend").set("value",
								dj.byId("alerts_" + noAlert +
										"_details_select_datecode_" + id).get("value"));
					}
				});
				dj.byId(type + "_product_nosend").set("value",
						dj.byId("alerts_" + noAlert +
								"_details_select_prodcode_" + id).get("value"));
				
				if (dj.byId(type + "_type_nosend")) {
					dj.byId(type + "_type_nosend").set("value",
							dj.byId("alerts_" + noAlert +
									"_details_select_tnxtypecode_"+id).get("value"));
				}

				if (dj.byId(type + "_details_offsetcode_nosend")) {
					dj.byId(type + "_details_offsetcode_nosend").set("value",
							dj.byId("alerts_" + noAlert +
									"_details_offsetcode_" + id).get("value"));
				}
				
				if(dj.byId("alerts_" + noAlert + "_details_offsetsigncode_"+id)) {
					dj.byId(type+"_details_offsetsigncode_nosend_" +
							dj.byId("alerts_" + noAlert +
								"_details_offsetsigncode_"+id).get("value")).set("checked", true);
				}

				if (dj.byId("alerts_" + noAlert + "_details_langcode_" + id).value === "*") {
					dj.byId(type + "_details_usercode_nosend").set("value",
							dj.byId("alerts_" + noAlert + "_details_address_" + id).get("value"));
				} else {
					dj.byId(type + "_details_usercode_nosend").set("value", "*");
					dj.byId(type + "_details_langcode_nosend").set("value",
							dj.byId("alerts_" + noAlert + "_details_langcode_" + id).value);
					dj.byId(type+"_details_email_nosend").set("value",
							dj.byId("alerts_" + noAlert + "_details_address_" + id).value);
				}
				
				// If there is an entity (customer side)
				if (dj.byId(noAlert + "entity")) {
					dj.byId(type.substr(5, 2) + "entity").set("value",
							dj.byId("alerts_" + noAlert + "_details_entity_" + id).get("value"));
				}
			}
			// References
			else if(dj.byId("customerReference"+suffix+"_details_reference_nosend")){
				m.customerRefDialogTempValue =	dj.byId("customerReference"+suffix+"_details_reference_nosend").get("value");
				idBank = dj.byId("common_fixed_id_" + suffix.substring(1)).get("value");
				
				var coreFields = misys._config.coreReferenceFields || [];
				var customFields = misys._config.customReferenceFields || [];
				var allFields = coreFields.concat(customFields);
				
				dojo.forEach(allFields,function(field, index){
					if(dj.byId("customerReference_details_"+field+"_nosend") && dj.byId("customer_reference_" + idBank +"_details_"+field+"_" + id))
					{
						dj.byId("customerReference_details_"+field+"_nosend").set("value",
								dj.byId("customer_reference_" + idBank +
										"_details_"+field+"_" + id).get("value"));
					}
				});
			}
			// Documents
			else if(dj.byId("documents_details_code_nosend") && type === "document") {
				dj.byId("documents_details_code_nosend").set("value",
						dj.byId("documents_details_code_" + id).get("value"));
				dj.byId("documents_details_name_nosend").set("value",
						dj.byId("documents_details_name_" + id).get("value"));
				dj.byId("documents_details_first_mail_send").set("value",
						dj.byId("documents_details_first_mail_" + id).get("value"));
				dj.byId("documents_details_second_mail_send").set("value",
						dj.byId("documents_details_second_mail_" + id).get("value"));
				dj.byId("documents_details_total_send")?dj.byId("documents_details_total_send").set("value",
						dj.byId("documents_details_total_" + id).get("value")):"";

				if(dj.byId("documents_details_mapped_attachment_name_send") && dj.byId("documents_details_mapped_attachment_id_send"))
				{
					var attachmentName = dj.byId("documents_details_mapped_attachment_name_" + id).get("value");
					var attachmentId = dj.byId("documents_details_mapped_attachment_id_" + id).get("value");
					
					dj.byId("documents_details_mapped_attachment_name_send").set("displayedValue", attachmentName);
				}

				dj.byId("documents_details_doc_no_send")?dj.byId("documents_details_doc_no_send").set("value",
						dj.byId("documents_details_doc_no_" + id).get("value")):"";
				dj.byId("documents_details_doc_date_send")?dj.byId("documents_details_doc_date_send").set("displayedValue",
						dj.byId("documents_details_doc_date_" + id).get("value")):"";
			}
			else if(dj.byId("title_offsetcode_nosend")) {
				dj.byId("title_offsetcode_nosend").set("value",
						dj.byId("title_" + id).get("value"));
				dj.byId("link_offsetcode_nosend").set("value",
						dj.byId("link_" + id).get("value"));
				dj.byId("img_file_id_offsetcode_nosend").set("value",
						dj.byId("img_file_id_" + id).get("value"));
				dj.byId("dialog_topic_id_offsetcode_nosend").set("value",
						dj.byId("topic_id_" + id).get("value"));
				d.attr(d.byId("new-image"), "src", 
						m.getServletURL("/screen/AjaxScreen/action/GetCustomerLogo?logoid=" +
								dj.byId("img_file_id_" + id).get("value")));
				dj.byId("new").set("value",dj.byId("img_file_id_" + id).get("value"));
				d.style(d.byId("new-logo-row"), "display", "block");
				m._config.logoData = "";
			}
			// Authorizations
			else if(dj.byId("roles_details_role_name_nosend")) {
				dj.byId("roles_level_id_role_name_nosend").set("value",
						dj.byId("authorization_level_level_id_" + id).get("value"));
				dj.byId("roles_details_role_name_nosend").set("value",
						dj.byId("authorization_level_role_id_" + id).get("value"));
				dj.byId("roles_order_number_role_name_nosend").set("value",
						dj.byId("authorization_level_order_number_" + id).get("value"));
			}
			
			dj.byId(prefix + type + "Dialog" + suffix).show();
			
			m.connect(dj.byId(prefix + type + "Dialog" + suffix), "onHide",function(){
				m._config.currentAddonId = "";
			});
		},
		
		// TODO Should the logo uploading stuff not be part of the 
		// file upload?
		
		showLogoUploadDialog : function() {
			// summary:
			//  TODO
			
			dj.byId("logofile").set("value", "");
			dj.byId("logoUploadDialog").show();
		},
		
		hideLogoUploadDialog : function() {
			// summary:
			//		TODO
			
			var fileUploadDialog = dj.byId("logoUploadDialog");
			if(fileUploadDialog) {
				 fileUploadDialog.hide();
			}
		},
		
		uploadLogo: function( /*String*/ id) {
			// summary:
			//		TODO
			
			var filesForm = dj.byId("sendlogofiles"),
				fileField = dj.byId("logofile");
			
			if(!fileField.get("value")) {
				m.showTooltip(m.getLocalization("mandatoryPathToFileError"),
									fileField.domNode);
				return false;
			}
			
			console.debug("[FileUpload] Sending the request ");
			
			m.dialog.show("PROGRESS",
					m.getLocalization("uploadingLogo"), m.getLocalization("progressMessage"));
			d.io.iframe.send({
				url : m.getServletURL("/screen/GTPUploadLogoScreen"),
				method : "post",
				handleAs : "json",
				content : {
					logoid : "",
					token : document.getElementById("_token").getAttribute('value')
				},
				form : d.byId("sendlogofiles"),
				handle : function(data, ioArgs){
					// Hide the dialog, regardless of the upload result status
				    var dialog = dj.byId("logoUploadDialog");
				    if(dialog) {
				    	dj.byId("alertDialog").hide();
				    	dialog.hide();
				    }
				    
					if(data.status === "success") {
						dj.byId(id).set("value", data.details.id);
						d.attr(id + "-image", "src", 
								m.getServletURL(
										"/screen/AjaxScreen/action/GetCustomerLogo?logoid=" +
												data.details.id));
						
						m.animate("fadeIn", d.byId(id + "-logo-row"));
						m._config.logoData = data;
						m.populateLogoFeedBack();
						m.validateImage();
				    } else {
						 m.showTooltip(data.details.message,
								 dj.byId("openUploadLogoDialog").domNode);
				    	 console.error("[FileUpload] File upload error, response status = " +
				    			 data.status);
				    }

					// Clear the file input field
					fileField.set("value", "");
					fileField.reset();
				}
			 });
			
			return true;
		},
		
		showTransactionAddonsDialog : function( /*String*/ type,
												/*String*/ prefix,
												/*String*/ _suffix) {
			// summary:
			//		TODO
			
			var suffix = _suffix || "",
				typeArray,
				dialogId;
			
			// Initialisation for customer references
			if(/customerReference/.test(type)) {
				typeArray = type.split("_");
				if (typeArray.length === 2)	{
					dj.byId("customerReference_target_bank").set("value", typeArray[1]);
					suffix = "_" + typeArray[1];
				}
			else if(typeArray.length > 2)
			{
				var customerReference_target_bank_value = "";
				customerReference_target_bank_value = customerReference_target_bank_value + typeArray[1];
				for (var i=2 ; i<typeArray.length;i++)
					{
						customerReference_target_bank_value = customerReference_target_bank_value + "_" + typeArray[i];						
					}
				dj.byId("customerReference_target_bank").set("value", customerReference_target_bank_value);
				suffix = "_" + customerReference_target_bank_value;
			}
				type = "customerReference";
			}

			prefix = prefix || "";
			
			// Bind event handlers, if an appropriate function exists
			if(m._addons.bind.hasOwnProperty(type) && d.isFunction(m._addons.bind[type])) {
				m._addons.bind[type](prefix);
			}

			dialogId = prefix + type + "Dialog" + suffix;
			if(!m._config.isEditMode) {
				// Retrieve and reset all fields
				d.query("#" + dialogId + " input[id^=" + type + "], #" +
						dialogId + " textarea[id^=" + type + "]").forEach(function(node){
					dj.byId(node.id).reset();
				});
				if (dj.byId("01entity")) {
					dj.byId("01entity").reset();
				}
			}
			
			if(type === "topic") {
				d.style(d.byId("new-logo-row"), "display", "none");
				dj.byId("title_offsetcode_nosend").set("value", "");
				dj.byId("link_offsetcode_nosend").set("value", "");
				dj.byId("img_file_id_offsetcode_nosend").set("value", "");
				dj.byId("dialog_topic_id_offsetcode_nosend").set("value", "");
				dj.byId("new").set("value", "");
			}
			
			dj.byId(dialogId).show();
		},
		
		hideTransactionAddonsDialog : function(type, prefix) {
			// summary:
			//		TODO
			
			prefix = prefix || "";
			var suffix = dj.byId("customerReference_target_bank") ? dj.byId("customerReference_target_bank").get("value") : "";
			if(suffix !== "")
			{
				suffix = "_" + suffix;
			}	
		    var dialog = dj.byId(prefix + type + "Dialog" + suffix);
			if(dialog) {				
				dialog.hide();
			}
			m._config.isEditMode = false;
		},
		
		openCounterpartyDialog : function( /*String*/ type) {
			// summary:
			//		
			
			var counterpartyField;
			
			if(dj.byId("input_cur_code").get("value")){
				m.dialog.show("ERROR", m.getLocalization("mandatoryCurrencyCodeError"));
				dj.byId("input_cur_code").focus();
				return false;
			}
			
			if(!m._config.isEditMode) {
				d.query("#" + type + "Dialog input[id^=" + type + "]").forEach(function(node){
					if(node.id){
						dj.byId(node.id).set("value", "");
					}
				});

				counterpartyField = dj.byId("counterparty_details_ft_cur_code_nosend");
				if(dj.byId("input_cur_code").get("value")){
					counterpartyField.set("value", dj.byId("input_cur_code").get("value"));
					m.setCurrency(dj.byId("input_cur_code"),
							["counterparty_details_ft_amt_nosend"]);
				}
			}
			
			dj.byId("counterpartyDialog").show();
			return true;
		},
		
		addCounterpartyAddon : function(type) { 
			// summary:
			//		TODO
			
			var newAmt = dj.byId("counterparty_details_ft_amt_nosend").get("value"),
				existingAmt = 0,
				counterpartyField,
				inputCurCodeField;
			
			if(m.addTransactionAddon(type)) {
				if(dj.byId("ft_amt").get("value")) {
					existingAmt = dj.byId("ft_amt").get("value");
				}
				dj.byId("ft_amt").set("value", existingAmt + parseFloat(newAmt));
				
				// repopulate currency and set contraints
				counterpartyField = dj.byId("counterparty_details_ft_cur_code_nosend");
				inputCurCodeField = dj.byId("input_cur_code"); 
				if(inputCurCodeField.get("value")){
					counterpartyField.set("value", inputCurCodeField.get("value"));
					m.setCurrency(inputCurCodeField, ["counterparty_details_ft_amt_nosend"]);
				}
				
				return true;
			}
			
			return false;
		},
		
		toggleAlertAdditionalFields : function( /*String*/ type) {
			// summary:
			//		TODO
			
			// TODO Refactor
			
			var recepient = dj.byId("alert"+type+"_details_usercode_nosend").get("value");
			if(recepient === "*") {
				dj.byId("alert" + type +
						"_details_langcode_nosend").domNode.parentNode.style.display = "block";
				dj.byId("alert" + type +
						"_details_email_nosend").domNode.parentNode.style.display = "block";
			} else {
				dj.byId("alert" + type +
						"_details_langcode_nosend").domNode.parentNode.style.display = "none";
				dj.byId("alert" + type +
						"_details_email_nosend").domNode.parentNode.style.display = "none";
			}
		},
		
		toggleAlertDateFields : function( /*String*/ type) {
			// summary:
			//		TODO
			
			var dateSelect = dj.byId("alert" + type + "_datecode_nosend"),
				prodCode,
				options;
			
			if(dateSelect) {
				prodCode = dj.byId("alert" + type + "_product_nosend").get("value");
				dateSelect.reset();
				options = new d.data.ItemFileWriteStore({data: 
								{identifier: "index", label : "name", items:[]}});
				for(var index in myDates) {
					if(myDates.hasOwnProperty(index)) {
						code = index.substring(0, 2);
						value = index.substring(3, index.length);
						if(prodCode === code){
							 options.newItem({"index": value, "name": myDates[index]});
						}
					}
				}
				
				dateSelect.set("store", options);
			}
		},
		
		validateImage : function() {
			// summary:
			//		TODO
			
			var fileFormat,
				errorMessage = "";
			
			if (dj.byId("new").get("value") === "" && !d.byId("image")) {
				m.showTooltip(m.getLocalization("missingLogo"),
						dj.byId("openUploadLogoDialog").domNode);
				return false;
			}
										
			if (m._config.logoData && (m._config.logoData.details.imagewidth > 100 || m._config.logoData.details.imageheight > 100))
			{
				errorMessage += m.getLocalization("imageSizeInappropriate",[100,100]);
				m.showTooltip(errorMessage, dj.byId("openUploadLogoDialog").domNode);
				return false;
			}
			
			return true;
		},
		
		populateLogoFeedBack : function() {
			// summary:
			//		TODO
			
			dj.byId("img_file_id_offsetcode_nosend").set("value", m._config.logoData.details.id);
		},
		
		populateAttachmentInfo : function() {
			
			var prodCode = dijit.byId("product_code");
			var toStoreId = dijit.byId("documents_details_mapped_attachment_name_send");
			
			if(prodCode && (prodCode.get("value") === "EC" || prodCode.get("value") === "IC") && toStoreId){
				
				var fromStoreId = dijit.byId("attachment-file");
				var doesFromStoreExist = (fromStoreId && fromStoreId.store && fromStoreId.store._arrayOfAllItems && fromStoreId.store._arrayOfAllItems.length);

				if (doesFromStoreExist && toStoreId)
				{
					var tempItems = [];
					
					tempItems.push(
					{
						id : "",
						name : ""
					});

					d.forEach(fromStoreId.store._arrayOfAllItems, function(item, index)
					{
						if (item && item.attachment_id && item.file_name)
						{
							tempItems.push(
							{
								id : item.attachment_id,
								name : item.file_name
							});
						}
					});

					toStoreId.store = new dojo.data.ItemFileReadStore(
					{
						data :
						{
							identifier : "id",
							label : "name",
							items : tempItems
						}
					});
				}
			}

		},		
		
		updateDocumentSection : function() {
			
			var attachmentField = dijit.byId("attachment-file");
			var tempItems = [];
			var tempAttachmentIds = [];
			var tempAttachmentNames = [];

			if (attachmentField && attachmentField.store && attachmentField.store._arrayOfAllItems && attachmentField.store._arrayOfAllItems.length)
			{
				d.forEach(attachmentField.store._arrayOfAllItems, function(item, index)
				{
					if (item && item.attachment_id && item.file_name)
					{
						tempAttachmentIds.push(item.attachment_id.toString());
						tempAttachmentNames.push(item.file_name.toString());
					}
				});
			}

			d.query("*[id^='documents_details_mapped_attachment_id_']").forEach(function(item, index)
			{
				var docMapId = dijit.byId('documents_details_mapped_attachment_id_' + index);
				var docMapIdValue = docMapId?docMapId.get('value'):"";
				var docMapName = dijit.byId('documents_details_mapped_attachment_name_' + index);
				var docMapNameValue = docMapName?docMapName.get("value"):"";
				var docMapIdNotExistInUploadList = (tempAttachmentIds && docMapIdValue !== "" && tempAttachmentIds.indexOf(docMapIdValue) === -1 && tempAttachmentNames && docMapNameValue !== "" && tempAttachmentNames.indexOf(docMapNameValue) === -1);
				var documentrow = dojo.byId('document_row_' + index);
				
				if (docMapId && docMapName && docMapIdNotExistInUploadList)
				{
					docMapId.set("value", ""); 
					docMapName.set("value","");
					documentrow.cells[6].innerHTML = "";
				}
			});			
		}
	});

	// Onload/Unload/onWidgetLoad Events

})(dojo, dijit, misys);