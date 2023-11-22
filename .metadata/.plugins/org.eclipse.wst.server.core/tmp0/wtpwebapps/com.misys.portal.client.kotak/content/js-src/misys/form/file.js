dojo.provide("misys.form.file");
dojo.require("dojo.io.iframe");

// Copyright (c) 2000-2011 Misys (http://www.misys.com),
// All Rights Reserved. 
//
// Summary: 
//  Scripts for file uploads
//
//
// version:   1.1
// date:      20/04/11
// author:    Cormac Flynn


(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode
	
	// Private functions & variables

	var 
		// File extensions for which we have an icon
		_extensions = ["txt", "doc", "pdf", "gif", "zip"],	
		
		// The string prefix for all file extension icons 
		_filePrefix = "file_",
		
		// The default file extension icon name
		_defaultFileExtension = "file_ext",
		
		// File type of extension icons
		_defaultFileExtensionType = ".gif",
	
		// The download file icon
		_downloadImg,
		
		// The delete file icon
		_trashImg;

	function _uploadFile( /*String*/ dialogId) {
		// summary:
		//
		
		var dialog = dj.byId(dialogId);
		if(dialog && dialog.validate()) {
			dialog.execute();
			dialog.hide();
			m.isFormDirty = true;
		}
	}
	
	function _getValidationType()
	{
		
		if(dj.byId("validation_type"))
		{
			if(dj.byId("validation_type").get("value") === "")
			{
				return "none";
			}
			else
			{
				return dj.byId("validation_type").get("value");
			}
		}
	}
	/**
	 * get the selected entity which is to be passed for file upload
	 */
	function _getSelectedEntity()
	{
		
		if(dj.byId("entity"))
		{
			if(dj.byId("entity").get("value") === "")
			{
				return "none";
			}
			else
			{
				return dj.byId("entity").get("value");
			}
		}
		else 
        {
            return "";
        }
	}
	/**
	 * get the selected file type which is to be passed for file upload
	 */
	function _getFileTypes()
	{
		
		if(dj.byId("upload_file_type"))
		{
			if(dj.byId("upload_file_type").get("value") === "")
			{
				return "none";
			}
			else
			{
				return dj.byId("upload_file_type").get("value");
			}
		}
	}

	d.mixin(m, {
		formatFileActions : function( /*String*/ value, /* String */groupAttachment) {
			//  summary:
			//          Generate the HTML containing the different possible actions in a grid.
			
			console.debug('[file] start formatFileActions');
			var outer = d.create("div"),
			    container = d.create("div", {"class" : "gridActions", "style": "text-align:center"}),
			    
			    attachmentGroup = groupAttachment;
			
			if(!_downloadImg) {
				_downloadImg = m.getContextualURL(m._config.imagesSrc +
						m._config.imageStore.downloadIcon);
			}
			if(!_trashImg) {
				_trashImg = m.getContextualURL(m._config.imagesSrc +
						m._config.imageStore.deleteIcon);
			}
			
			
			d.create("img", {
				src: _downloadImg,
				alt: m.getLocalization("view_label"),
				// TODO Change to a proper function
				onclick: "misys.downloadFile(" + value + ", '" + attachmentGroup + "')"
			}, container);
			d.create("img", {
				src: _trashImg,
				alt: m.getLocalization("delete_label"),
				type: "remove"
			}, container);
			d.place(container, outer);

			console.debug('[file] end formatFileActions');
			return outer.innerHTML;
			
		}, 
		
		formatFileViewActions : function( /*String*/ value, /* String */groupAttachment) {
			//  summary:
			//          Generate the HTML containing the different possible actions in a grid.
			console.debug('[file] start formatFileActions');
			
			var outer = d.create("div"),
			    container = d.create("div", {"class" : "gridActions", "style": "text-align:center"}),
				attachmentGroup = groupAttachment;

			if(!_downloadImg) {
				_downloadImg = m.getContextualURL(m._config.imagesSrc +
						m._config.imageStore.downloadIcon);
			}
			if(!_trashImg) {
				_trashImg = m.getContextualURL(m._config.imagesSrc +
						m._config.imageStore.deleteIcon);
			}
			
			d.create("img", {
				src: _downloadImg,
				alt: m.getLocalization("view_label"),
				// TODO Change to a proper function
				onclick: "misys.downloadFile(" + value + ", '" + attachmentGroup + "')"
			}, container);
			d.place(container, outer);
			console.debug('[file] end formatFileActions');
			return outer.innerHTML;
		}, 
		
		getFileIcon : function( /*String*/ fileName){
			//  summary:
		    //        Get the image icon.
			
			var outer = d.create("div"),
			    container = d.create("div", {"style": "text-align:center"}),
			    found = false, ext,
			    fileImg = d.create("img", {
			    	alt: m.getLocalization("download")
			    });
			
			var _extensions = m._config.uploadservice_extensions_allowed;
			if((fileName.lastIndexOf(".") !== -1) &&
			        (fileName.lastIndexOf(".") !== fileName.length - 1)) {
				ext = fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();
				// TODO Switch to a dojo.every/some loop
				for(var x = 0, len = _extensions.length; x < len; x++){
					if(ext === _extensions[x]) {
						found = true;
						d.attr(fileImg, "src", m.getContextualURL(m._config.imagesSrc) + 
												_filePrefix + ext + _defaultFileExtensionType);
						break;
					}
				}
			}
			if (!found) {
				d.attr(fileImg, "src", m.getContextualURL(m._config.imagesSrc) + 
												_defaultFileExtension + _defaultFileExtensionType);
			}
			d.place(fileImg, container);
			d.place(container, outer);
			return outer.innerHTML;
		}, 
		
		uploadFile : function( /*String*/ dialogId,
							   /*String*/ attachmentGroup){
			// summary: 
			//		Upload a file
			
			var fileField = dj.byId("file" + attachmentGroup) ? 
								dj.byId("file" + attachmentGroup).domNode : 
								d.byId("file"+ attachmentGroup),
				fileFieldValue = dj.byId("file" + attachmentGroup) ? 
									dj.byId("file" + attachmentGroup).get("value") : 
									fileField.value,
				attachedFiles,
				errorMessage;
				
				if (dj.byId("file_name")){
				var fileName = fileFieldValue.replace(/^.*(\\|\/|\:)/, '');
				dj.byId("file_name").set("value", fileName);
				}
									
            if(dj.byId("file_title") && dj.byId("file_title").get("value") == "")									
            {
            	return false;
            }
									
			if(!fileFieldValue) {
			   m.showTooltip(m.getLocalization("mandatoryPathToFileError"), fileField);
			   return false;
			}
			
			console.warn("[misys.form.file] Sending the request, with attachmentGroup '",attachmentGroup, +"'");	
			m.dialog.show("PROGRESS", m.getLocalization("uploadingFile"));
			
			var encodedFileName = (document.getElementById("file" + attachmentGroup) && document.getElementById("file" + attachmentGroup).files && document.getElementById("file" + attachmentGroup).files[0] && document.getElementById("file" + attachmentGroup).files[0] .name) ? encodeURIComponent(document.getElementById("file" + attachmentGroup).files[0].name): "";
			if ("" === encodedFileName ) {
				encodedFileName = encodeURIComponent(fileFieldValue); 
			}

			d.io.iframe.send( {
				url : m.getServletURL("/screen/GTPUploadScreen"),
				method : "post",
				handleAs : "json",
				content: {
					operation: "UPLOAD",
					identifier: "file" + attachmentGroup,
					file_name: encodedFileName,
					//file_name: encodeURIComponent(document.getElementById("file" + attachmentGroup).files[0].name),
					att_ref_id: dj.byId("ref_id")? dj.byId("ref_id").get("value") : "",
					att_tnx_id: dj.byId("tnx_id")? dj.byId("tnx_id").get("value") : "",
					att_item_id: dj.byId("item_id")? dj.byId("item_id").get("value"): "",
					attachment_type: dj.byId("attachment_type") && 
							dj.byId("attachment_type").get("value") !== "" ? dj.byId("attachment_type").get("value") : "",
					validation_type: _getValidationType(),
					entity: _getSelectedEntity(),
					fileType: _getFileTypes(),
					token : document.getElementById("_token").getAttribute('value'),
					attachmentgroup: attachmentGroup
				},
				form : d.byId("sendfiles" + attachmentGroup),
				handle : function(data, ioArgs){
					console.warn("[misys.form.file] Data response is", data);
					console.warn("[misys.form.file] io args are", ioArgs);
					console.warn("[misys.form.file] data.status is", data.status);
					
					if(data && data.details && data.details.file_name)
					{
						data.details.file_name = data.details.file_name.replace(/^.*(\\|\/|\:)/, '');
					}
					else if (data.details !== undefined && data.details !== null)
					{
						data.details.file_name = fileFieldValue.replace(/^.*(\\|\/|\:)/, '');
					}
					
					dj.byId("alertDialog").hide();
				    
					// TODO We should probably return a boolean
					if(data.status === "success") {
						dj.byId("attachment_id" + attachmentGroup).set("value", data.details.id);
						dj.byId("file_type" + attachmentGroup).set("value", data.details.type);
						dj.byId("file_name" + attachmentGroup).set("value", data.details.file_name);
						dj.byId("file_title" + attachmentGroup).set("value", data.details.title);
						_uploadFile(dialogId);
					}  
					else 
					{
						// Sometimes the underlay is not correctly hidden
						var underlay = d.byId("alertDialog_underlay");
						if(underlay) {
							d.style(underlay, "display", "none");
						}
						
						if (data.details && data.details.message && data.details.message.length > 0) {
							// TODO Should we dump the error message untreated to the user?
							m.dialog.show("ERROR", data.details.message);
						} else if (data.details === undefined || data.details === null) {
							//Scenario where iframe is unable to load files above 10 MB so to handle error this message is shown
							errorMessage = m.getLocalization("fileSizeExceeded");
							m.dialog.show("ERROR", errorMessage);
						}
						
						console.warn("[misys.form.file] File upload error, response status = " + 
												data.status);
					}
				}
			 });

		    return true;
		}, 
		
		downloadFile: function( /*String*/ file_id, 
								/*String*/ group){
			// summary:
			//		Download a file
			var attachmentGroup = group || "",
				attachmentid = d.create("input"),
				type;
			
			if(!dj.byId("downloadfiles" + attachmentGroup)) {
				d.parser.parse(d.byId("downloadfiles-container" + +attachmentGroup));
			}

			attachmentid.type = "hidden";
			attachmentid.name = "attachmentid";
			attachmentid.id = "attachmentid";
			attachmentid.value = file_id;
			
		    d.byId("downloadfiles" + attachmentGroup).appendChild(attachmentid);
			
			if (dj.byId("item_id")) {
				type = d.doc.createElement("input");
				type.type = "hidden";
				type.name = "attachment_type";
				type.id = "attachment_type";
				type.value = "news";
		        d.byId("downloadfiles" + attachmentGroup).appendChild(type);
			}

			dojo.parser.parse(dojo.byId("downloadfiles" + attachmentGroup));
			dj.byId("downloadfiles" + attachmentGroup).submit();

			d.destroy(d.byId("attachmentid"));
			if (d.byId("attachment_type") && dj.byId("item_id")) {
				d.destroy(d.byId("attachment_type"));
			}
		}, 
		
		clearFilePath : function(){
		// summary: 
		//		Clear file path
		
		var x = document.getElementById('file');
		if(x){
			x.setAttribute("type", "file");
			x.setAttribute("type", "text");
			x.setAttribute("type", "file");
		}
		var y = document.getElementById('fileinvoice');
		if(y){
			y.setAttribute("type", "file");
			y.setAttribute("type", "text");
			y.setAttribute("type", "file");
		}		
		},
		
		addFileItem : function( /*String*/ id) {
			// summary:
			//		Add a file item to a grid
			var attachmentType = d.byId('attachment_type');
			var fullId = "attachment-file" + id;
			if(!dj.byId(fullId)) {
				d.style("noFilesNotice" + id, "display", "none");
				d.parser.instantiate([d.byId(fullId)]);
			}
			if(d.byId('file'))
				{
					d.byId('file').value="";
				}
				
				if(id !== ""){
				var fullFilename = "file" + id;
				if(fullFilename){
					d.byId(fullFilename).value="";
				}
				
			}
			dj.byId(fullId).addItem();
		},
		/**
		 * As addFileItem Cannot be overridden in the screen specific JS,
		 * based on the file attachment type invoke the following JS.
		 * Here Bulk file upload - need to do additional validation before showing 
		 * file upload dialog and setting few additional values required for upload
		 * validation like entity name is required while uploading a file
		 */
		addBulkFileItem : function( /*String*/ id) {
			// summary:
			//		Add a file item to a grid
			
			var attachmentType = d.byId('attachment_type'),
			    entity = dj.byId("entity") ? dj.byId("entity").get("value") : "";
			var fullId = "attachment-file" + id;
			if(!dj.byId(fullId)) {
				d.style("noFilesNotice" + id, "display", "none");
				d.parser.instantiate([d.byId(fullId)]);
			}
			if( dj.byId("entity") && entity === "")
			{
				var displayMessage = m.getLocalization("selectEntityForFileUpload");
				//focus on the widget and set state to error and display a tooltip indicating the same
				entity.focus();
				entity.set("state","Error");
				dijit.hideTooltip(entity.domNode);
				dijit.showTooltip(displayMessage, entity.domNode, 0);
			}else{
				if(d.byId('file')){
					d.byId('file').value="";
				}
				dj.byId(fullId).addItem();
			}
			
		}, 
		
		showUploadDialog : function( /*String*/ attachmentGroup) {
			//  summary:
			//          Open the upload dialog
			
		    var fileUploadDialog = dj.byId("fileUploadDialog"),
		    	group = attachmentGroup || "",
		    	maxFiles = d.byId("max-files" + group).value || 1,
		    	file = dj.byId("file");

		    if(!fileUploadDialog) {
			   d.parser.parse("fileUploadFields");
			   fileUploadDialog = dj.byId("fileUploadDialog");
		    }
		   
		    // TODO We previously set a global param GROUP here that was used
		    // elsewhere. We should instead put it in _config, if we can't get
		    // rid of it entirely.
		    
			// Set the group so that we know it on server side
			dj.byId("group").set("value", group);
			
		   // control upload files limit.
		    dj.byId("uploadButton").set("disabled", (m._config.attachedFiles[group] >= maxFiles));
		    dj.byId("title").set("value", "");
		    file.set("readOnly", false);
		    file.set("value", "");
		    fileUploadDialog.show();
		}
	});

	// Onload/Unload/onWidgetLoad Events

	d.ready(function(){
		// TODO There is, for the moment, a dependency between these files
		// and the functions in misys.form.file
		d.require("misys.product.widget.AttachmentFiles");
		d.require("misys.product.widget.AttachmentFile");
	});
})(dojo, dijit, misys);