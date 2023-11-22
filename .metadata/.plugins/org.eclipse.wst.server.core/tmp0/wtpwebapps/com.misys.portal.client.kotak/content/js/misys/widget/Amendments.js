/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.widget.Amendments"]){dojo._hasResource["misys.widget.Amendments"]=true;dojo.provide("misys.widget.Amendments");dojo.experimental("misys.widget.Amendments");dojo.require("misys.grid.GridMultipleItems");dojo.require("misys.grid.DataGrid");dojo.require("misys.widget.Amendment");dojo.declare("misys.widget.Amendments",[misys.grid.GridMultipleItems],{data:{identifier:"store_id",label:"store_id",items:[]},templatePath:null,templateString:"<div></div>",gridColumns:["content","verb"],propertiesMap:{content:{_fieldName:"amendment"}},layout:[],startup:function(){if(this._started){return;}this.dataList=[];var _1=misys._config.narrativeId;var _2;if("narrative_amend_goods"===_1&&misys._config.narrativeDescGoodsDataStore){_2=misys._config.narrativeDescGoodsDataStore;}else{if("narrative_amend_docs"===_1&&misys._config.narrativeDocsReqDataStore){_2=misys._config.narrativeDocsReqDataStore;}else{if("narrative_amend_instructions"===_1&&misys._config.narrativeAddInstrDataStore){_2=misys._config.narrativeAddInstrDataStore;}else{if("narrative_amend_sp_beneficiary"===_1&&misys._config.narrativeSpBeneDataStore){_2=misys._config.narrativeSpBeneDataStore;}else{if("narrative_amend_sp_recvbank"===_1&&misys._config.narrativeSpRecvbankDataStore){_2=misys._config.narrativeSpRecvbankDataStore;}}}}}if(_2&&_2!=""){for(var i=0;i<_2.length;i++){var _3,_4,_5,_6,_7;if(_2[i]!=null){_3=_2[i].verb[0];_4=misys.showTruncatedGridData(_2[i].content[0].replace(/&#x9;/g,"\t"),2);if(_3==="ADD"){_7=misys.getLocalization("add");}else{if(_3==="DELETE"){_7=misys.getLocalization("delete");}else{if(_3==="REPALL"){_7=misys.getLocalization("repall");}}}_5=_2[i].content[0].replace(/&#x9;/g,"\t");_6=_2[i].text_size[0];var _8={content:_5.replace(/&#xa;/g,"\n"),displayed_content:_4,displayed_verb:_7,verb:_3,text_size:_6};this.dataList.push(_8);}}}if(dijit.byId("amendments").data){dijit.byId("amendments").data.items.splice(0,dijit.byId("amendments").data.items.length);}if(misys._config.codeword_enabled==true){this.layout=[{name:"Verb",field:"verb",headerStyles:"display:none",cellStyles:"display:none",noresize:true},{name:"Verb",field:"displayed_verb",width:"12%",noresize:true},{name:"Content",field:"displayed_content",width:"75%",noresize:true},{name:"Action",field:"actions",formatter:misys.grid.formatReportActions,width:"13%",noresize:true},{name:"Id",field:"store_id",headerStyles:"display:none",cellStyles:"display:none",noresize:true},{name:"size",field:"text_size",headerStyles:"display:none",cellStyles:"display:none",noresize:true},{name:"Content",field:"content",headerStyles:"display:none",cellStyles:"display:none",noresize:true}];}else{this.layout=[{name:"Verb",field:"verb",headerStyles:"display:none",cellStyles:"display:none",noresize:true},{name:"Content",field:"displayed_content",width:"85%",noresize:true},{name:"Action",field:"actions",formatter:misys.grid.formatReportActions,width:"15%",noresize:true},{name:"Id",field:"store_id",headerStyles:"display:none",cellStyles:"display:none",noresize:true},{name:"size",field:"text_size",headerStyles:"display:none",cellStyles:"display:none",noresize:true},{name:"Content",field:"content",headerStyles:"display:none",cellStyles:"display:none",noresize:true}];}this.inherited(arguments);},createDataGrid:function(){if(this.grid){this.grid.destroy();}var _9="";var _a="";var _b=0;if(misys._config.codeword_enabled==true){if(dijit.byId("adr_1").get("value")){_9=dijit.byId("adr_1").get("value");}else{if(dijit.byId("adr_2").get("value")){_9=dijit.byId("adr_2").get("value");}else{if(dijit.byId("adr_3").get("value")){_9=dijit.byId("adr_3").get("value");}}}_b="/"+_9+"/";}else{_9="REPALL";}if(_9==="ADD"){_a=misys.getLocalization("add");}else{if(_9==="DELETE"){_a=misys.getLocalization("delete");}else{if(_9==="REPALL"){_a=misys.getLocalization("repall");}}}var _c=misys.showTruncatedGridData(dijit.byId("narrative_description_goods_popup").get("value").substring(_b.length),2);var _d={content:dijit.byId("narrative_description_goods_popup").get("value").substring(_b.length),displayed_content:_c,displayed_verb:_a,verb:_9,text_size:dijit.byId("narrative_description_goods_popup").rowCount+1};if(_9!=""&&dijit.byId("narrative_description_goods_popup").get("value")!=""){this.dataList.push(_d);}if(this.dataList.length>0&&_9!=""&&dijit.byId("narrative_description_goods_popup").get("value")!=""){this.createAmendDataStoreFromText(_d);}if(this.dataList.length>0&&this.dataList[0].verb=="REPALL"){if(misys._config.codeword_enabled==true){dijit.byId("adr_1").set("disabled",false).set("value",false);dijit.byId("adr_2").set("disabled",false).set("value",false);dijit.byId("adr_3").set("disabled",false).set("value",false);dijit.byId("narrative_description_goods_popup").set("value","/REPALL/");}else{dijit.byId("narrative_description_goods_popup").set("value","");}dijit.byId("narrative_description_goods_popup").set("disabled",true);}this.gridId="";this.inherited(arguments);this.dataList=[];},editGridData:function(_e,_f){misys._config.prevEditedItemIndex=misys._config.editedItemIndex;misys._config.editedItemIndex=-1;var _10=0;for(var itr=0;itr<_f.store._arrayOfAllItems.length;itr++){_10=_f.store._arrayOfAllItems[itr]==null?_10+1:_10;}for(itr=0;itr<_f.store._arrayOfAllItems.length;itr++){if(_f.store._arrayOfAllItems[itr]!=null&&_f.store._arrayOfAllItems[itr].store_id[0]===_e[0].store_id[0]){_10>0?misys._config.editedItemIndex=misys._config.prevEditedItemIndex:misys._config.editedItemIndex=itr;break;}}this.inherited(arguments);},clear:function(){this.inherited(arguments);},addItem:function(_11){this.inherited(arguments);},updateData:function(){this.inherited(arguments);},deleteData:function(){if(dijit.byId("amendments").data.items.length==0){if(misys._config.codeword_enabled==true){if(dijit.byId("narrative_description_goods_popup").get("value")!==""||(dijit.byId("narrative_description_goods_popup").get("value")===""&&dijit.byId("narrative_description_goods_popup").disabled===true)){dijit.byId("narrative_description_goods_popup").set("disabled",false);dijit.byId("adr_1").set("disabled",false);dijit.byId("adr_2").set("disabled",false);dijit.byId("adr_3").set("disabled",false);if(dijit.byId("adr_1").checked){dijit.byId("adr_2").set("value",false);dijit.byId("adr_3").set("value",false);dijit.byId("adr_1").set("value",true);}else{if(dijit.byId("adr_2").checked){dijit.byId("adr_1").set("value",false);dijit.byId("adr_3").set("value",false);}else{dijit.byId("adr_1").set("value",false);dijit.byId("adr_2").set("value",false);}}}}else{dijit.byId("narrative_description_goods_popup").set("disabled",false);dijit.byId("narrative_description_goods_popup").set("value","");}}}});}