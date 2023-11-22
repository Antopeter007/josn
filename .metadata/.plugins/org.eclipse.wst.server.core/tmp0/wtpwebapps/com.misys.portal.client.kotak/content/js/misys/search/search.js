/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


var input,filter,ul,li,a,i;var validReferenceNumber,actionCode,refId,tnxID,tnxStatCode,productFound,tnxTypeCode,screenUrl,subProdCode;function completeVal(_1){document.getElementById("searchInput").value=document.getElementById(_1).innerHTML;document.getElementById("transIDinnerdiv").innerHTML="";};function searchInpOnKeyup(){input=document.getElementById("searchInput");filter=input.value.toUpperCase();filter=filter.replace(">","&GT;");ul=document.getElementById("menuUL");li=ul.getElementsByTagName("li");for(i=0;i<li.length;i++){a=li[i].getElementsByTagName("a")[0];if(a.innerHTML.toUpperCase().indexOf(filter)>-1&&input.value.length>0){li[i].style.display="";}else{li[i].style.display="none";}}if(event.keyCode!=undefined&&event.keyCode!=0&&event.keyCode!=13&&event.keyCode!=32&&event.which!=undefined&&event.which!=0&&event.which!=13&&event.which!=32){var _2=document.getElementById("searchInput").value;if(_2.length>3&&_2.indexOf(" ")==-1){misys.xhrPost({url:misys.getServletURL("/screen/AjaxScreen/action/RetrieveReferenceData"),handleAs:"json",sync:true,content:{INPUT:filter,REQACT:"D"},load:function(_3,_4){var _5=_3.responseData.REF_LIST;var _6=document.getElementById("transIDinnerdiv");if(_6){document.getElementById("transIDinnerdiv").innerHTML="";}else{_6=document.createElement("div");_6.setAttribute("id","transIDinnerdiv");}for(i=0;i<_5.length;i++){var _7=document.createElement("div");var _8=document.createElement("a");_8.innerHTML=_5[i];_7.setAttribute("id","div"+i);_8.setAttribute("id","link"+i);_8.setAttribute("onClick","completeVal('link"+i+"')");_7.appendChild(_8);_6.appendChild(_7);}document.getElementById("transIDdiv").appendChild(_6);document.getElementById("transIDdiv").style.display="block";}});}else{document.getElementById("transIDdiv").style.display="none";}}document.getElementById("searchInput").onkeydown=function(_9){if(_9.keyCode==8||_9.which==8){var _a=document.getElementById("searchInput").value;if(_a.indexOf(" ")==(_a.length-1)){document.getElementById("actionUL").style.display="none";document.getElementById("actionULTrade").style.display="none";}}};document.getElementById("searchInput").onkeypress=function(_b){var _c=document.getElementById("searchInput").value;if(_b.keyCode==13||_b.which==13){document.getElementById("transIDdiv").style.display="none";misys.xhrPost({url:misys.getServletURL("/screen/AjaxScreen/action/RetrieveReferenceData"),handleAs:"json",sync:true,content:{INPUT:filter,REQACT:"A"},load:function(_d,_e){productFound=_d.responseData.productCode;validReferenceNumber=_d.responseData.valid;actionCode=_d.responseData.actionCode;tnxID=_d.responseData.tnxID;tnxStatCode=_d.responseData.tnxStatCode;tnxTypeCode=_d.responseData.tnxTypeCode;subProdCode=_d.responseData.subProdCode;refId=_d.responseData.refID;screenUrl=_d.responseData.screenUrl;var _f=retrieveURL();if(validReferenceNumber){if(_f!=null){window.location=_f;}else{misys.dialog.show("ERROR",misys.getLocalization("invalidTransactionActionSearchErrorMsg"),[]);}}else{misys.dialog.show("ERROR",misys.getLocalization("invalidTransactionNumberSearchErrorMsg"),[]);}}});}else{if((/^[a-zA-Z]{2}[0-9]{14}$/i).test(_c)&&(_b.keyCode==32||_b.which==32)){document.getElementById("transIDdiv").style.display="none";if(_c.length>2){var _10=_c.substring(0,2);if(_10==="LC"||_10==="EC"||_10==="BG"||_10==="SI"||_10==="LS"){document.getElementById("actionULTrade").style.display="block";}else{if(_10==="EL"||_10==="IC"||_10==="BR"||_10==="SG"||_10==="SR"||_10==="IR"||_10==="LI"){document.getElementById("actionUL").style.display="block";}else{document.getElementById("actionULTrade").style.display="none";document.getElementById("actionUL").style.display="none";}}}}}};};function searchInpOnFocus(){searchInpOnKeyup();document.getElementById("menuUL").style.display="block";};function searchInpOnBlur(){searchInpOnKeyup();document.getElementById("menuUL").style.display="hidden";};function retrieveURL(){if(actionCode!=null){actionCode=actionCode.toLowerCase();}if((actionCode==null)&&(tnxTypeCode==="01"&&tnxStatCode==="01")){return misys.getServletURL(screenUrl+"?mode=DRAFT&tnxtype=01&referenceid="+refId+"&tnxid="+tnxID);}else{if((actionCode==null)&&(productFound==="FT")&&(tnxTypeCode==="54"&&tnxStatCode==="03")){return misys.getServletURL("/screen/ReportingPopup?option=FULL&referenceid="+refId+"&tnxid="+tnxID+"&productcode="+productFound);}else{if(actionCode==null){return misys.getServletURL(screenUrl+"?productcode="+productFound+"&operation=LIST_INQUIRY&referenceid="+refId+"&option=HISTORY");}else{if((actionCode==="1"&&tnxTypeCode==="01"&&tnxStatCode==="04")&&(productFound==="LC"||productFound==="EC"||productFound==="BG"||productFound==="SI"||productFound==="LS")){return misys.getServletURL(screenUrl+"?tnxtype=03&referenceid="+refId+"&option=EXISTING");}else{if((actionCode==="2"&&tnxTypeCode==="01"&&tnxStatCode==="04")&&(productFound==="LC"||productFound==="EL"||productFound==="IC"||productFound==="EC"||productFound==="BG"||productFound==="BR"||productFound==="SG"||productFound==="SI"||productFound==="SR"||productFound==="IR"||productFound==="LI"||productFound==="LS"||(productFound==="TD"&&subProdCode==="TRTD"))){return misys.getServletURL(screenUrl+"?tnxtype=13&referenceid="+refId+"&option=EXISTING");}else{return null;}}}}}};