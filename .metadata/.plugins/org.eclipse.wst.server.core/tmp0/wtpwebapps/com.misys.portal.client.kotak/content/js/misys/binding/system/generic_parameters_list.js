/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.binding.system.generic_parameters_list"]){dojo._hasResource["misys.binding.system.generic_parameters_list"]=true;dojo.provide("misys.binding.system.generic_parameters_list");dojo.require("dijit.form.NumberTextBox");dojo.require("misys.form.common");dojo.require("misys.validation.common");dojo.require("dijit.form.Form");dojo.require("dijit.form.Button");dojo.require("dijit.form.TextBox");dojo.require("dijit.form.ValidationTextBox");dojo.require("dijit.form.CheckBox");dojo.require("dijit.layout.ContentPane");dojo.require("dojo.data.ItemFileReadStore");dojo.require("dojox.grid.cells.dijit");dojo.require("dojox.grid.cells");(function(d,dj,m){function _1(){var _2=dijit.byId("parameter").get("value");if(_2==="P261"){var _3=dijit.byId("keyParameterGrid");if(_3.selection.selectedIndex>-1){var _4=_3.getItem(_3.selection.selectedIndex);var _5=_3.store.getValue(_4,"KEY_2");if(!_6(_5)){return;}}}_7("DELETE_FEATURES");};function _7(_8){var _9=dijit.byId("keyParameterGrid");if(_9.selection.selectedIndex<0){return;}var _a=_9.getItem(_9.selection.selectedIndex);var _b=_9.store.getValue(_a,"MANKEYS");var _c=dijit.byId("parameter").get("value");var _d=dijit.byId("realform_operation");if(_d){_d.set("value",_8);}var _e=dijit.byId("featureid");if(_e){_e.set("value",_c);}dijit.byId("ParameterData").set("value",_b);var _f=document.realform.submit();};function _10(_11,_12){var _13=dijit.byId(_11);var _14=dojo.fromJson(_12);var _15=new dojo.data.ItemFileReadStore({data:_14});_13.store=_15;};function _6(_16){var _17=true;var _18="";if(_16!==""){m.xhrPost({url:m.getServletURL("/screen/AjaxScreen/action/CheckRMGroupAssociationAction"),handleAs:"json",sync:true,content:{rm_group_id:_16},load:function(_19,_1a){if(_19.items.isAssociated===true){_18=m.getLocalization("rmGroupAssociationError",[_16]);_17=false;}},error:function(_1b,_1c){_17=false;console.error(" RM Group Deletion error",_1b);}});if(!_17){m.dialog.show("ERROR",_18);return false;}else{return true;}}return _17;};d.mixin(m,{selectParameter:function(){var _1d=dijit.byId("parmid").get("value");if(_1d){var _1e=dijit.byId("featureid");if(_1e){_1e.set("value",_1d);}var _1f=dijit.byId("realform_operation");if(_1f){_1f.set("value","SELECT_PARAMETER");}var _20=dijit.byId("option");if(_20){_20.set("value","GENERIC_PARAMETER_MAINTENANCE");}var _21=document.realform.submit();}else{m.showTooltip(m.getLocalization("requiredToolTip"),d.byId("parmid"),0);}},selectionChanged:function(){if(dojo.byId("dataValuesContainer")&&dojo.style("dataValuesContainer","display")==="none"){misys.animate("fadeIn","dataValuesContainer");}var _22=dijit.byId("parameter").get("value");var _23=dijit.byId("keyParameterGrid");var _24=misys.getServletURL("/screen/AjaxScreen/action/GenericParameterMaintAction");if(_23.selection.selectedIndex<0){misys.grid.setStoreURL("dataParameterGrid",_24,{ajaxoption:"DATA",parmid:_22});return;}var _25=_23.getItem(_23.selection.selectedIndex);var _26=_23.store.getValue(_25,"HIDDEN_STATUS");var _27=_23.store.getValue(_25,"DATA");var _28=dijit.byId("dataParameterGrid");_10("dataParameterGrid",_27);_28._refresh();var _29=dijit.byId("copyButton");if(_29&&_22==="P108"){_29.set("disabled",true);}else{if(_29&&(_26==="AN"||_26==="RN"||_26==="DN")){_29.set("disabled",true);}else{if(_29){_29.set("disabled",false);}}}},onDeselected:function(){var _2a=dijit.byId("dataParameterGrid");var _2b=new dojo.data.ItemFileReadStore({data:{identifier:"",items:[]}});_2a.setStore(_2b);},recordConfirmDelete:function(_2c){var _2d=dijit.byId("keyParameterGrid");if(_2d.selection.selectedIndex<0){return;}misys.dialog.show("CONFIRMATION",misys.getLocalization("deleteRecordConfirmation"),"",_1);},recordCopy:function(){_7("COPY_FEATURES");},recordModify:function(){_7("MODIFY_FEATURES");},onFormLoad:function(){if(dj.byId("parmid")&&dj.byId("parmid").store&&dj.byId("parmid").store.root&&dj.byId("parmid").store.root.length>0){dj.byId("parmid").fetchProperties={sort:[{attribute:"name"}]};}}});})(dojo,dijit,misys);dojo.require("misys.client.binding.system.generic_parameters_list_client");}