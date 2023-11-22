/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.binding.cash.request.AccountPopup"]){dojo._hasResource["misys.binding.cash.request.AccountPopup"]=true;dojo.provide("misys.binding.cash.request.AccountPopup");fncOpenAccountPopup=function(_1,_2,_3){firstOpening=fncGetGlobalVariable(_1+"PopupFirstOpening");if(firstOpening=="true"){_fncSearchAccountAjaxCall(_2,_1,_3);}else{if(_1==="fundingAccount"||_1==="receivingAccount"){_fncSearchAccountAjaxCall(_2,_1,_3,"UPDATE");}else{dijit.byId(_1).show();}}fncSetGlobalVariable(_1+"PopupFirstOpening","false");};fncCreateAccountPopup=function(_4,_5){var _6=0,_7="",_8=100,_9=_5.args.accountType,_a=_5.args.update,_b;dijit.byId(_9).show();dojo.style(_9,"width","450px");for(jsonData in _4){_b={items:_4[_6]};if(_a==="UPDATE"&&(_9==="fundingAccount"||_9==="receivingAccount")){_fncUpdateTable(_b,_9,_6);}else{_7=_9+"_div_"+_6;dojo.create("div",{id:_7},_9+"_div");_fncCreateAccountTable(_b,_9,_6,_7);}_8=_8+115;_6++;}dojo.style(_9,"height",_8+"px");};_fncUpdateTable=function(_c,_d,_e){var _f=new dojo.data.ItemFileReadStore({data:_c});var _10=dijit.byId(_d+"_Grid_"+_e);if(_10){if(_10.selection!==null){_10.selection.clear();}_10.setStore(_f);}};_fncCreateAccountTable=function(_11,_12,_13,_14){var _15=new dojo.data.ItemFileReadStore({data:_11});var _16=_11.items[0].bank_abbv_name;var _17=misys.getLocalization("acct_no_header_label");var _18=misys.getLocalization("description_header_label");var _19=[{field:"account_no",name:_17,width:"100px",styles:"text-align: center;"},{field:"description",name:_18,width:"auto"}];var _1a=new dojox.grid.DataGrid({query:{id:"*"},store:_15,id:_12+"_Grid"+"_"+_13,structure:_19,height:"100px",noDataMessage:"No Accounts Found",onSelected:function(_1b){_fncSelectAccountIndex(_1b,_12,_13);},selectionMode:"single"},document.createElement("div"));dojo.create("div",{id:_12+"_Grid_Title"+"_"+_13,innerHTML:misys.getLocalization("bank_title_label")+_16},dojo.byId(_14));dojo.byId(_14).appendChild(_1a.domNode);_1a.startup();};_fncSelectAccountIndex=function(_1c,_1d,_1e){var _1f=dijit.byId(_1d+"_Grid_"+_1e).get("store")._arrayOfAllItems[_1c];fillAccountField(_1d,_1f);_fncCleanOtherSelectedRow(_1d,_1e);dijit.byId(_1d).hide();};fillAccountField=function(_20,_21){};fncFilteringAccount=function(_22){var _23=_22.split("_")[0];var _24=dojo.query("#"+_23+"_div > div").length;for(i=0;i<_24;i++){misys.grid.filter(dijit.byId(_23+"_Grid_"+i),["account_no","description"],[_23+"_number_acct_search",_23+"_desc_acct_search"]);}};_fncCleanOtherSelectedRow=function(_25,_26){var _27=dojo.query("#"+_25+"_div > div").length;if(_27==1){return;}else{for(i=0;i<_27;i++){if(_26!=i){dijit.byId(_25+"_Grid_"+i).selection.selectedIndex=-1;dojo.query("#"+_25+"_Grid_"+i+" .dojoxGridContent div.dojoxGridRowSelected").forEach(function(_28){dojo.removeClass(_28,"dojoxGridRowSelected");dojo.removeClass(_28,"dojoxGridRowOdd");});}}}};_fncSearchAccountAjaxCall=function(_29,_2a,_2b,_2c){m.xhrPost({url:misys.getServletURL("/screen/AjaxScreen/action/ListOfAccountsAction"),handleAs:"json",load:fncCreateAccountPopup,update:_2c,content:{COMPANYID:dijit.byId("company_id").get("value"),ACCOUNTSEARCHACTION:_29,MATCHINGCURR:_2b,accountType:_2a},customError:function(_2d,_2e){fncSetGlobalVariable(_2a+"PopupFirstOpening","true");}});};}