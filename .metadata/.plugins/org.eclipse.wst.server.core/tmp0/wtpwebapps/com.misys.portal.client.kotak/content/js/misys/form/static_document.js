/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.form.static_document"]){dojo._hasResource["misys.form.static_document"]=true;dojo.provide("misys.form.static_document");dojo.require("dojo.io.iframe");dojo.require("misys.widget.Dialog");dojo.require("dijit.ProgressBar");(function(d,dj,m){d.mixin(m,{uploadStaticDocument:function(){var _1=dj.byId("sendStaticDocument"),_2=dj.byId("static_title"),_3=dj.byId("static_file"),_4=d.byId("static_file_row"),_5=dj.byId("uploadButton"),_6=dj.byId("static_identifier"),_7=dj.byId("staticDocumentUploadDialog"),_8;if(!dj.byId("static_file").get("value")){m.showTooltip(m.getLocalization("mandatoryPathToFileError"),_3.domNode);return false;}m.dialog.show("PROGRESS",m.getLocalization("uploadingFile"));_6.set("value","file");dj.byId("static_operation").set("value","UPLOAD");d.io.iframe.send({url:m.getServletURL("/screen/GTPStaticDocumentUploadScreen"),method:"post",handleAs:"json",form:d.byId("sendStaticDocument"),content:{token:document.getElementById("_token").getAttribute("value")},handle:function(_9,_a){if(_7){dj.byId("alertDialog").hide();_7.hide();}if(_9.status==="success"){if(_2){dj.byId("specimen_name").set("value",_2.get("value"));}dj.byId("document_id").set("value",_9.details.id);}else{console.error("[m.form.static_document] File upload error, response status = "+_9.status);var _b=d.byId("alertDialog_underlay");if(_b){d.style(_b,"display","none");}if(_9.details&&_9.details.message&&_9.details.message.length>0){m.dialog.show("ERROR",_9.details.message);}}_2.set("value","");_3.set("value","");_3.reset();}});return true;},deleteStaticDocument:function(_c,_d){var _e=dj.byId("sendStaticDocument"),_f=d.byId("static_title");if(!_e){d.parser.parse("staticDocumentUploadFields");_e=dj.byId("sendStaticDocument");}_e.set("action",m.getServletURL("/screen/GTPStaticDocumentUploadScreen"));d.byId("static_operation").value="DELETE";d.byId("static_documentid").value=_c;d.io.iframe.send({url:m.getServletURL("/screen/GTPStaticDocumentUploadScreen"),method:"json",handleAs:"json",form:d.byId("sendStaticDocument"),content:{token:document.getElementById("_token").getAttribute("value")},handle:function(_10,_11){if(_10.status==="success"){if(dj.byId(_d)){dj.byId(_d).set("value","");}}else{m.showTooltip(_10.details.message,_f);}}});},downloadStaticDocument:function(_12){if(dj.byId(_12)){var _13=dj.byId(_12).get("value");if(_13){var _14=dj.byId("sendStaticDocument");if(!_14){d.parser.parse("staticDocumentUploadFields");_14=dj.byId("sendStaticDocument");}_14.set("action",m.getServletURL("/screen/GTPStaticDocumentDownloadScreen"));d.byId("static_documentid").value=_13;_14.submit();}}},openStaticDocumentDialog:function(){var _15=dj.byId("staticDocumentUploadDialog");if(!_15){d.parser.parse("staticDocumentUploadFields");_15=dj.byId("staticDocumentUploadDialog");}dj.byId("static_title").set("value","");dj.byId("static_file").set("readOnly",false);dj.byId("static_file").set("value","");_15.show();}});})(dojo,dijit,misys);}