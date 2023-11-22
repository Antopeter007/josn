/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.report.parameters"]){dojo._hasResource["misys.report.parameters"]=true;dojo.provide("misys.report.parameters");(function(d,dj,m){m._config=m._config||{};d.mixin(m._config,{isValid:false});d.mixin(m,{Perform:function(_1){var _2="<parameters_data>";var _3=document.realform;var _4=_3.action.split("/");var _5=_4[_4.length-1];if(_1=="save"){if(!fncShowConfirmation(1)){return;}}else{if(_1=="cancel"){if(fncShowConfirmation(4)){document.location.href=misys.getServletURL("/screen/"+_5);}return;}else{if(_1=="help"){window.open(misys.getServletURL("/screen/DisplayHelp/help_project_id/1/help_section_key/"+g_strLanguageCode+"/help_topic_key/SY_RDPDF","OnlineHelp","width=640,height=480,resizable=yes,scrollbars=yes"));return;}else{return;}}}for(j=0;j<document.forms.length;j++){for(i=0;i<document.forms[j].length;i++){_2=_2+fncGenerateEncryptXMLNodeString(document.forms[j].elements[i]);}}_3.TransactionData.value=_2+"</parameters_data>";_3.submit();}});})(dojo,dijit,misys);}