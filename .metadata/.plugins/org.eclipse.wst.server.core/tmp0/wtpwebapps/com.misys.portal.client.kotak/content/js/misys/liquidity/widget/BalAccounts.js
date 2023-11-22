/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.liquidity.widget.BalAccounts"]){dojo._hasResource["misys.liquidity.widget.BalAccounts"]=true;dojo.provide("misys.liquidity.widget.BalAccounts");dojo.require("misys.grid.GridMultipleItems");dojo.require("misys.liquidity.widget.BalAccount");dojo.declare("misys.liquidity.widget.BalAccounts",[misys.grid.GridMultipleItems],{data:{identifier:"store_id",label:"store_id",items:[]},templatePath:null,templateString:dojo.byId("balacctsubgroup-template")?dojo.byId("balacctsubgroup-template").innerHTML:"",dialogId:"balacctsubgroup-dialog-template",dialogAddItemTitle:misys.getLocalization("addaccount-dialog"),xmlTagName:"acctsubgroups",xmlSubTagName:"acctsubgroup",gridColumns:["sub_group_code","account_no","account_id","company_id","sub_group_id","sub_group_pivot","acctsubgrppivot_label","description"],propertiesMap:{sub_group_code:{_fieldName:"sub_group_code"},account_no:{_fieldName:"account_no"},account_id:{_fieldName:"account_id"},company_id:{_fieldName:"company_id"},sub_group_id:{_fieldName:"sub_group_id"},sub_group_pivot:{_fieldName:"sub_group_pivot"},acctsubgrppivot_label:{_fieldName:"acctsubgrppivot_label"},description:{_fieldName:"acctdesc"}},layout:[{name:misys.getLocalization("cashPoolingbalanceSubGroupAccountHeaderAccountNumber"),field:"account_no",width:"30%"},{name:misys.getLocalization("cashPoolingbalanceSubGroupAccountHeaderDescription"),field:"description",width:"20%"},{name:misys.getLocalization("cashPoolingbalanceSubGroupAccountHeaderSubGroupPivot"),field:"acctsubgrppivot_label",width:"40%",classes:"align-center"},{name:" ",field:"actions",formatter:misys.grid.formatReportActions,width:"10%"},{name:"Id",field:"store_id",headerStyles:"display:none",cellStyles:"display:none"}],mandatoryFields:["account_no","sub_group_pivot"],startup:function(){this.dataList=[];if(this.hasChildren()){dojo.forEach(this.getChildren(),function(_1){if(_1.createItem){var _2=_1.createItem();this.dataList.push(_2);}},this);}this.inherited(arguments);},openDialogFromExistingItem:function(_3,_4){this.inherited(arguments);},addItem:function(_5){this.inherited(arguments);},createItemsFromJson:function(_6){this.inherited(arguments);},updateData:function(_7){this.inherited(arguments);},performValidation:function(){if(this.validateDialog(true)){if(this.grid&&this.grid.store&&this.grid.store._arrayOfTopLevelItems){var _8=false;var _9=dijit.byId("sub_group_pivot").get("value");var _a=this.grid.gridMultipleItemsWidget.dialog.storeId;this.grid.store.fetch({query:{store_id:"*"},onComplete:dojo.hitch(this.grid,function(_b,_c){dojo.forEach(_b,function(_d){if(_d.sub_group_pivot[0].toUpperCase()==="YES"){_8=true;}});})});if(_8&&(_9.toUpperCase()==="YES")){misys.dialog.show("ERROR",misys.getLocalization("balaccountPivotUniqueCheck"));}else{this.inherited(arguments);}}else{this.inherited(arguments);}}}});}