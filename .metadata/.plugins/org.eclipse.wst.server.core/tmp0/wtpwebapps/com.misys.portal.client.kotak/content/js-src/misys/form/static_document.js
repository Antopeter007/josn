dojo.provide("misys.form.static_document");

// Copyright (c) 2000-2011 Misys (http://www.misys.com),
// All Rights Reserved. 
//
// summary:
//  Static Document upload
//
// version:   1.2
// date:      24/03/2011
// author:    Gilles Weber

dojo.require("dojo.io.iframe");
dojo.require("misys.widget.Dialog");
dojo.require("dijit.ProgressBar");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode
	
	d.mixin(m, {
		
		uploadStaticDocument : function() {
			// summary: 
			//		sends the attached file to the server.			
			
			var filesForm = dj.byId("sendStaticDocument"),
				fileTitleField = dj.byId("static_title"),
				fileField = dj.byId("static_file"),
				fileRow = d.byId("static_file_row"),
				uploadButton = dj.byId("uploadButton"),
				identifierObj = dj.byId("static_identifier"),
				dialog = dj.byId("staticDocumentUploadDialog"),
				attachedFiles;

			// NOTE Form cannot be validated like other dijit forms, since a "file" input box is
			// a TextBox and not a ValidatingTextBox
			if(!dj.byId("static_file").get("value")){
				m.showTooltip(m.getLocalization("mandatoryPathToFileError"),
						fileField.domNode);
				return false;
			}
			
			console.debug("[m.form.static_document] Sending the request ");	

			m.dialog.show("PROGRESS", m.getLocalization("uploadingFile"));
			
			identifierObj.set("value", "file");	
			dj.byId("static_operation").set("value", "UPLOAD");

			d.io.iframe.send( {
				url : m.getServletURL("/screen/GTPStaticDocumentUploadScreen"),
				method : "post",
				handleAs : "json",
				form : d.byId("sendStaticDocument"),
				content : {
					token : document.getElementById("_token").getAttribute('value')
				},
				handle : function(data, ioArgs){
					if(dialog) {
						dj.byId("alertDialog").hide();
						dialog.hide();
				    }
				    
					if(data.status === "success") {
						if (fileTitleField) {
							dj.byId("specimen_name").set("value", fileTitleField.get("value"));
						}
						
						dj.byId("document_id").set("value", data.details.id);
					} else {
						console.error("[m.form.static_document] File upload error, response status = " + data.status);
						
						var underlay = d.byId("alertDialog_underlay");
						if(underlay) {
							d.style(underlay, "display", "none");
						}
						
						if (data.details && data.details.message && data.details.message.length > 0) {
							// TODO Should we dump the error message untreated to the user?
							m.dialog.show("ERROR", data.details.message);
						}
					}

					// Clear the file input field
					fileTitleField.set("value", "");
					fileField.set("value", "");
					fileField.reset();
				}
			});

			return true;
		},
		
		deleteStaticDocument : function( /*String*/ file_id, 
										 /*String*/ documentTitleFieldName) {
			//	summary:
			//		TODO
			
			var sendfilesForm = dj.byId("sendStaticDocument"),
				realFileTitleField = d.byId("static_title");
			
			if(!sendfilesForm) {
				// TODO Should try to avoid parsing bits of the page after the main parse has 
				// completed
			  d.parser.parse("staticDocumentUploadFields");
			  sendfilesForm = dj.byId("sendStaticDocument");
			}
			
			sendfilesForm.set("action",
					m.getServletURL("/screen/GTPStaticDocumentUploadScreen"));
			d.byId("static_operation").value = "DELETE";
			d.byId("static_documentid").value = file_id;
			
			console.debug("[m.form.static_document] Sending a delete file request");
			
			d.io.iframe.send( {
				url : m.getServletURL("/screen/GTPStaticDocumentUploadScreen"),
				method :"json",
				handleAs :"json",
				form :d.byId("sendStaticDocument"),
				content : {
					token : document.getElementById("_token").getAttribute('value')
				},
				handle : function(data, ioArgs) {
					if(data.status === "success"){
						if (dj.byId(documentTitleFieldName)) {
							dj.byId(documentTitleFieldName).set("value", "");
						}
					 } else {
						m.showTooltip(data.details.message, realFileTitleField);
					 }
				}
			});
		},
		
		downloadStaticDocument : function(/*String*/ documentIdField){
			// summary:
			//		TODO
			
			if (dj.byId(documentIdField)) {
				var documentId = dj.byId(documentIdField).get("value");
				if (documentId) {
					var sendfilesForm = dj.byId("sendStaticDocument");
					if(!sendfilesForm) {
					  d.parser.parse("staticDocumentUploadFields");
					  sendfilesForm = dj.byId("sendStaticDocument");
					}
					
					sendfilesForm.set("action", 
							m.getServletURL("/screen/GTPStaticDocumentDownloadScreen"));
					d.byId("static_documentid").value = documentId;
					sendfilesForm.submit();
				}
			}
		},
		
		openStaticDocumentDialog : function(){
			// summary:
			//		TODO
			
			var fileUploadDialog = dj.byId("staticDocumentUploadDialog");
			if(!fileUploadDialog) {
				d.parser.parse("staticDocumentUploadFields");
				fileUploadDialog = dj.byId("staticDocumentUploadDialog");
			}
			dj.byId("static_title").set("value", "");
			dj.byId("static_file").set("readOnly", false);
			dj.byId("static_file").set("value", "");
			fileUploadDialog.show();
		}
	});
})(dojo, dijit, misys);