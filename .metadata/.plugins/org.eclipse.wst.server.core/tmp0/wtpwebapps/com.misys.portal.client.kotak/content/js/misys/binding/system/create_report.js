/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.binding.system.create_report"]){dojo._hasResource["misys.binding.system.create_report"]=true;dojo.provide("misys.binding.system.create_report");dojo.require("dijit.Dialog");dojo.require("dijit.form.Button");dojo.require("dijit.form.TextBox");dojo.require("dijit.form.ValidationTextBox");dojo.require("dijit.form.CheckBox");dojo.require("dijit.form.FilteringSelect");dojo.require("dijit.form.Form");dojo.require("dijit.form.NumberTextBox");dojo.require("misys.form.CurrencyTextBox");dojo.require("dijit.form.DateTextBox");dojo.require("misys.grid.DataGrid");dojo.require("misys.form.common");dojo.require("misys.validation.common");dojo.require("misys.report.common");dojo.require("misys.report.widget.Products");dojo.require("misys.report.widget.Product");dojo.require("misys.report.widget.Columns");dojo.require("misys.report.widget.Column");dojo.require("misys.report.widget.Parameters");dojo.require("misys.report.widget.Parameter");dojo.require("misys.report.widget.Criteria");dojo.require("misys.report.widget.Criterium");dojo.require("misys.report.widget.Aggregates");dojo.require("misys.report.widget.Aggregate");dojo.require("misys.report.widget.GroupingAggregates");dojo.require("misys.report.widget.ChartAggregates");dojo.require("misys.report.widget.Filter");dojo.require("misys.report.widget.Filters");dojo.require("misys.report.widget.Entity");dojo.require("misys.report.widget.Entities");(function(d,dj,m){var _1="columns-grid";var _2="chart-section";var _3="chart-aggregates";function _4(){var _5=m.getServletURL("/screen/AjaxScreen/action/ReportCheckAction");_5+="?reportname="+dj.byId("report_name").get("value");var _6=false;fncXhrGet({url:_5,sync:true,load:function(_7,_8){_6=(_7.result=="true");}});var _9=function(){_fncSubmitForm("OTHER");};if(_6){m.dialog.show("CONFIRMATION",fncGetLocalizationString("reportAlreadyExists"),"",_9);return false;}return true;};function _a(_b){dj.byId("addColumnOkButton").set("disabled",false);if(!(dj.byId("duplicateColumnsAllowed")&&dj.byId("duplicateColumnsAllowed").get("value")=="true")){_c();}if(dj.byId(_b)){var _d=dj.byId(_b).get("value");if((_d.indexOf("<")!==-1)||(_d.indexOf(">")!==-1)){var _e=misys.getLocalization("invalidContent");dj.hideTooltip(dj.byId(_b).domNode);dj.showTooltip(_e,dj.byId(_b).domNode,0);dj.byId(_b).set("state","Error");dj.byId(_b)._setStateClass();dj.setWaiState(dj.byId(_b).focusNode,"invalid","true");dj.byId("addColumnOkButton").set("disabled",true);return false;}}};function _f(){if(dj.byId("max_nb_lines").get("value")<=0){dj.byId("max_nb_lines").set("state","Error");dj.showTooltip(m.getLocalization("ZeroLinesPerPageNotApplicableError"),dj.byId("max_nb_lines").domNode,0);}else{if((dj.byId("max_nb_lines").get("value"))%1!==0){dj.byId("max_nb_lines").set("state","Error");dj.showTooltip(m.getLocalization("DecimalNotAllowedError"),dj.byId("max_nb_lines").domNode,0);}}var _10=function(){dj.hideTooltip(dj.byId("max_nb_lines").domNode);};setTimeout(_10,4500);};function _c(){var _11,_12,_13=false,_14;dj.byId("addColumnOkButton").set("disabled",false);_14=dj.byId("column");_11=dj.byId(_1);if(_11){_12=_11.store;}if(_14&&_12){var _15=_11.gridMultipleItemsWidget.dialog.storeId;_12.fetch({query:{store_id:"*"},onComplete:function(_16,_17){dojo.forEach(_16,function(_18){if(_18.column[0]===_14.get("value")){if(_18.store_id[0]!==_15){var _19=misys.getLocalization("duplicateColumnName");dj.showTooltip(_19,_14.domNode,0);_14.set("state","Error");_14._setStateClass();dj.setWaiState(_14.focusNode,"invalid","true");dj.byId("addColumnOkButton").set("disabled",true);return false;}}});}});}};function _1a(){if(dj.byId("system_type")&&dj.byId("product_type")){if(dj.byId("system_type").get("checked")){m.animate("fadeOut",d.byId("entities-section"));m.toggleFields(true,null,["system_product"]);m.toggleFields(false,null,["single_product"]);dj.byId("report_type").set("value","02");}if(dj.byId("product_type").get("checked")){m.animate("fadeIn",d.byId("entities-section"));m.toggleFields(false,null,["system_product"]);m.toggleFields(true,null,["single_product"]);dj.byId("report_type").set("value","01");}}};function _1b(){var _1c=dj.byId("single_product").get("value"),_1d=dj.byId("input_source_type"),_1e=m._config.productResourceMapping[_1c];if(_1e){_1d.set("value",_1e[0].value);}else{_1d.set("value","");}};d.mixin(m,{submitDialog:function(_1f){var _20=dj.byId(_1f),_21=dj.byId("width");if(_20&&_20.validate()){var _22=0+parseInt(_21.get("value"),10);if(dj.byId(_1)&&dj.byId(_1).store){dojo.forEach(dj.byId(_1).store._arrayOfAllItems,function(obj){});}if(_22>100){var _23=misys.getLocalization("invalidTotalWidthOfSelectedColumns");_21.focus();_21.set("state","Error");dj.hideTooltip(_21.domNode);dj.showTooltip(_23,_21.domNode,0);}else{_20.execute();_20.hide();}document.body.style.overflow="visible";}else{if(dijit.byId("entity").get("state")==="Error"){dj.hideTooltip(dj.byId("entity").domNode);dj.showTooltip(m.getLocalization("entityBlankError"),dj.byId("entity").domNode);}}},submitCriteriumDialog:function(){var _24=dj.byId("criterium-dialog-template");if(_24&&dj.byId("criterium_operator").get("value")!="isNull"&&dj.byId("criterium_operator").get("value")!="isNotNull"){var _25=dj.byId("criterium_value_type_1").get("checked")||dj.byId("criterium_value_type_2").get("checked")||dj.byId("criterium_value_type_3").get("checked");if(_24.validate()&&_25){if(dj.byId("criterium_value_type_1").get("checked")===true){dj.byId("criterium_values_set").set("value","");dj.byId("criterium_string_value").set("value","");dj.byId("criterium_amount_value").set("value","");dj.byId("criterium_number_value").set("value","");dj.byId("criterium_date_value").set("value","");dj.byId("criterium_parameter_default_date_type_1").set("checked",false);dj.byId("criterium_parameter_default_date_type_2").set("checked",false);dj.byId("criterium_parameter_default_date_type_3").set("checked",false);dj.byId("criterium_parameter_default_date_type_4").set("checked",false);dj.byId("criterium_parameter_default_date_type_5").set("checked",false);dj.byId("criterium_parameter_default_date_type_6").set("checked",false);dj.byId("criterium_parameter_default_date_first_day_of_month_offset_1").set("checked",false);dj.byId("criterium_parameter_default_date_first_day_of_month_offset_2").set("checked",false);dj.byId("criterium_parameter_default_date_first_day_of_month_offset_days").set("value",0);}else{if(dj.byId("criterium_value_type_2").get("checked")===true){dj.byId("criterium_parameter").set("value","");dj.byId("criterium_parameter_default_values_set").set("value","");dj.byId("criterium_parameter_default_string_value").set("value","");dj.byId("criterium_parameter_default_number_value").set("value","");dj.byId("criterium_parameter_default_amount_value").set("value","");dj.byId("criterium_parameter_default_date_value").set("value","");dj.byId("criterium_parameter_default_date_type_1").set("checked",false);dj.byId("criterium_parameter_default_date_type_2").set("checked",false);dj.byId("criterium_parameter_default_date_type_3").set("checked",false);dj.byId("criterium_parameter_default_date_type_4").set("checked",false);dj.byId("criterium_parameter_default_date_type_5").set("checked",false);dj.byId("criterium_parameter_default_date_type_6").set("checked",false);dj.byId("criterium_parameter_default_date_first_day_of_month_offset_1").set("checked",false);dj.byId("criterium_parameter_default_date_first_day_of_month_offset_2").set("checked",false);dj.byId("criterium_parameter_default_date_first_day_of_month_offset_days").set("value",0);}else{dj.byId("criterium_parameter").set("value","");dj.byId("criterium_parameter_default_values_set").set("value","");dj.byId("criterium_parameter_default_string_value").set("value","");dj.byId("criterium_parameter_default_number_value").set("value","");dj.byId("criterium_parameter_default_amount_value").set("value","");dj.byId("criterium_parameter_default_date_value").set("value","");dj.byId("criterium_values_set").set("value","");dj.byId("criterium_string_value").set("value","");dj.byId("criterium_amount_value").set("value","");dj.byId("criterium_number_value").set("value","");dj.byId("criterium_date_value").set("value","");}}_24.execute();_24.hide();}else{if(!_25){m.dialog.show("ALERT",m.getLocalization("mandatoryReportCriteriumOperandType"));}}}else{_24.execute();_24.hide();}document.body.style.overflow="visible";},bind:function(){m.connect("criterium_amount_currency_value","onChange",function(){m.setCurrency(this,["criterium_amount_value"]);});m.connect("order_list_by_default","onChange",m.toggleOrderDetails);m.connect("criterium_value_type_1","onChange",m.toggleCriteriumFields);m.connect("criterium_value_type_2","onChange",m.toggleCriteriumFields);m.connect("criterium_value_type_3","onChange",m.toggleCriteriumFields);m.connect("criterium_string_value","onBlur",m.validateBasicReportInputFields);m.connect("criterium_parameter_default_date_type_1","onChange",m.toggleCriteriumParameterDefaultDate);m.connect("criterium_parameter_default_date_type_2","onChange",m.toggleCriteriumParameterDefaultDate);m.connect("criterium_parameter_default_date_type_3","onChange",m.toggleCriteriumParameterDefaultDate);m.connect("criterium_parameter_default_date_type_4","onChange",m.toggleCriteriumParameterDefaultDate);m.connect("criterium_parameter_default_date_type_5","onChange",m.toggleCriteriumParameterDefaultDate);m.connect("criterium_parameter_default_date_type_6","onChange",m.toggleCriteriumParameterDefaultDate);m.connect("criterium_parameter_default_date_type_7","onChange",m.toggleCriteriumParameterDefaultDate);var foo=d.hitch(dj.byId("grouping_enable"),m.toggleGroupingFields,false);m.connect("grouping_enable","onChange",foo);m.connect("grouping_column","onChange",m.groupingColumnOnChange);m.connect("chart_flag","onChange",m.toggleChartFields);m.connect("display_displayed_column_labels","onClick",m.displayColumnLabelsInOtherLanguages);m.connect("hide_displayed_column_labels","onClick",m.hideColumnLabelsInOtherLanguages);m.connect("display_parameter_labels","onClick",m.displayParameterLabelsInOtherLanguages);m.connect("hide_parameter_labels","onClick",m.hideParameterLabelsInOtherLanguages);m.connect("display_aggregate_labels","onClick",m.displayAggregateLabelsInOtherLanguages);m.connect("hide_aggregate_labels","onClick",m.hideAggregateLabelsInOtherLanguages);m.connect("multi_product","onChange",m.toggleProductSections);if(dj.byId("system_type")){m.connect("system_type","onChange",_1a);}if(dj.byId("product_type")){m.connect("product_type","onChange",_1a);}if(dj.byId("product_type")){m.connect("report_type","onChange",m.toggleProductSections);}m.connect("column","onChange",m.toggleColumnFields);if(!(dj.byId("duplicateColumnsAllowed")&&dj.byId("duplicateColumnsAllowed").get("value")=="true")){m.connect("column","onChange",_c);}m.connect("computed_field","onChange",m.toggleComputedFields);m.connect("criterium_column","onChange",m.toggleCriteriumColumnFields);m.connect("criterium_operator","onChange",m.toggleCriteriumOperatorFields);m.connect("aggregate_column","onChange",m.toggleAggregateFields);m.connect("aggregate_type","onChange",m.aggregateTypeOnChange);m.connect("aggregate_eqv_cur_code","onChange",m.toggleAutoComputationOfEquivalentCurrency);m.connect("aggregate_use_product_currency","onChange",m.toggleEquivalentCurrency);m.connect("chart_axis_x","onChange",m.chartAxisXOnChange);m.connect("single_product","onChange",m.loadProductColumns);m.connect("system_product","onChange",m.loadProductColumns);m.connect("single_product","onChange",function(){m.toggleColumnSection(this.get("value")!="");if(this.get("value")!=""){m.animate("fadeIn",d.byId(_2));}else{m.animate("fadeOut",d.byId(_2));}});m.connect("system_product","onChange",function(){m.toggleColumnSection(this.get("value")!="");if(this.get("value")!=""){m.animate("fadeIn",d.byId(_2));}else{m.animate("fadeOut",d.byId(_2));}});m.connect("report_name","onChange",function(){m.checkReportNameExists();});m.connect("products","onGridCreate",function(){if(dj.byId("products").store){m.toggleColumnSection(misys._getStoreSize(dj.byId("products").store)>0);var ps=dj.byId("products").store;m.connect(ps,"onNew",function(){m.toggleColumnSection(misys._getStoreSize(dj.byId("products").store)>0);});m.connect(ps,"onDelete",function(){m.toggleColumnSection(misys._getStoreSize(dj.byId("products").store)>0);});}});m.connect("columns","onGridCreate",function(){if(dj.byId("columns").store){m.toggleReportDetailSections(misys._getStoreSize(dj.byId("columns").store)>0);var cs=dj.byId("columns").store;m.connect(cs,"onNew",function(){m.toggleReportDetailSections(misys._getStoreSize(dj.byId("columns").store)>0);});m.connect(cs,"onDelete",function(){m.toggleReportDetailSections(misys._getStoreSize(dj.byId("columns").store)>0);});}});m.connect("parameters","onGridCreate",function(){var _26=dj.byId("parameters").grid;if(_26){_26.handleGridAction=function(_27){if(_27.target.tagName=="IMG"&&_27.target.attributes.type){if(_27.target.attributes.type.value=="edit"){var _28=this.store;var id=_28._arrayOfTopLevelItems[_27.rowIndex].store_id[0];_28.fetch({query:{store_id:id},onComplete:d.hitch(this.gridMultipleItemsWidget,"openDialogFromExistingItem")});}else{if(_27.target.attributes.type.value=="remove"){var _29=this.selection.getSelected();if(_29.length){var _2a=selectedItem.parameter_name;d.query("[id*=\"misys_report_widget_Criteria_\"]").query("[id]").forEach(function(_2b){var _2c=_2b.id;criteriaIds.push(_2c);var _2d=dj.byId(_2c);if(_2d.store){_2d.store.fetch({query:{parameter:_2a},onItem:function(_2e){}});}});d.forEach(_29,function(_2f){if(_2f!==null){this.selection.setSelected(_2f,false);}},this);}this.selection.setSelected(_27.rowIndex,true);_29=this.selection.getSelected();if(_29.length){d.forEach(_29,function(_30){if(_30!==null){this.store.deleteItem(_30);}},this);this.store.save();}_29=this.selection.getSelected();if(_29.length){d.forEach(_29,function(_31){if(_31!==null){this.selection.setSelected(_31,false);}},this);}setTimeout(d.hitch(this.gridMultipleItemsWidget,"renderSections"),100);}}}};}});m.connect(_3,"onGridCreate",function(){if(dj.byId(_3).store){dj.byId(_3).addButtonNode.set("disabled",false);m.connect(dj.byId(_3).store,"onDelete",function(){if(misys._getStoreSize(dj.byId(_3).store)<=0){dj.byId(_3).addButtonNode.set("disabled",false);}else{dj.byId(_3).addButtonNode.set("disabled",true);}});}});m.connect("criterium_operator","onChange",function(){if(dj.byId("criterium_column").get("value")!=""&&dj.byId("criterium_operator").get("value")!=""&&dj.byId("criterium_operator").get("value")!="isNull"&&dj.byId("criterium_operator").get("value")!="isNotNull"){m.animate("fadeIn",d.byId("criterium_operand_type_section"));}else{m.animate("fadeOut",d.byId("criterium_operand_type_section"));m.animate("fadeOut",d.byId("criterium_parameter_section"));m.animate("fadeOut",d.byId("criterium_parameter_default_values_set_section"));m.animate("fadeOut",d.byId("criterium_operand_type_section"));m.animate("fadeOut",d.byId("criterium_parameter_section"));m.animate("fadeOut",d.byId("criterium_parameter_default_values_set_section"));m.animate("fadeOut",d.byId("account_no_section"));m.animate("fadeOut",d.byId("criterium_string_section"));m.animate("fadeOut",d.byId("criterium_number_section"));m.animate("fadeOut",d.byId("criterium_amount_section"));m.animate("fadeOut",d.byId("criterium_date_section"));m.animate("fadeOut",d.byId("criterium_values_set_section"));}});m.connect("criterium_column","onChange",function(){if(m.dialog.isActive&&dj.byId("criterium_column")&&dj.byId("criterium_column").get("value")!=""){if(dj.byId("criterium_value_type_1")&&dj.byId("criterium_value_type_1").get("checked")===false){dj.byId("criterium_parameter_default_values_set").set("value",null);}if(dj.byId("criterium_value_type_2")&&dj.byId("criterium_value_type_2").get("checked")===false){dj.byId("criterium_values_set").set("value",null);}}if(dj.byId("criterium_column").get("value")!=""&&dj.byId("criterium_operator").get("value")!=""){m.animate("fadeIn",d.byId("criterium_operand_type_section"));}else{m.animate("fadeOut",d.byId("criterium_operand_type_section"));}});m.connect("product-ok","onClick",function(){var _32=dj.byId("product-dialog-template");if(_32&&_32.validate()){_32.execute();_32.hide();var foo=d.hitch(dj.byId("product"),m.loadProductColumns);foo();}});d.query("input[type=text][id^='label_']").forEach(function(_33,_34){if(_33&&_33.id!==""){m.connect(_33.id,"onBlur",function(){_a(_33.id);});}});d.query("input[type=text][id^='computed_field_id']").forEach(function(_35,_36){if(_35&&_35.id!==""){m.connect(_35.id,"onBlur",function(){_a(_35.id);});}});m.setValidation("grouping_column",m.validateGroupingColumn);m.setValidation("chart_axis_x_scale",m.validateAxisScale);m.setValidation("eqv_cur_code",m.validateCurrency);m.setValidation("criterium_parameter_default_amount_cur_code",m.validateCurrency);m.setValidation("aggregate_eqv_cur_code",m.validateCurrency);m.connect(dj.byId("entity-dialog-template"),"onShow",function(){dj.byId("entity")&&dj.byId("entity").set("readOnly",true);});},onFormLoad:function(){var _37;if(dj.byId("system_type")&&dj.byId("product_type")){if(dj.byId("report_type")&&dj.byId("report_type").get("value")==="02"){dj.byId("system_type").set("checked",true);}else{dj.byId("product_type").set("checked",true);if(dj.byId("report_type").get("value")!=="01"){dj.byId("report_type").set("value","01");}}if(dj.byId("system_type").get("checked")){m.animate("fadeIn",d.byId("system_feture_section"),function(){m.toggleFields(true,null,["system_product"]);m.toggleFields(false,null,["single_product"]);dj.byId("products").clear();});m.animate("fadeOut",d.byId("multi_product_section"));m.animate("fadeOut",d.byId("single_product_section"));m.animate("fadeOut",d.byId("multi_product_row"));if(dj.byId("multi_product").get("checked")){dj.byId("multi_product").set("checked",false);}}else{_37=dj.byId("multi_product").get("checked");if(_37){m.animate("fadeIn",d.byId("multi_product_section"),function(){m.toggleFields(!_37,null,["single_product"]);if(dj.byId("system_product")){m.toggleFields(false,null,["system_product"]);}if(!_37){dj.byId("products").clear();}});m.animate("fadeOut",d.byId("single_product_section"));}else{m.animate("fadeIn",d.byId("single_product_section"),function(){m.toggleFields(!_37,null,["single_product"]);if(dj.byId("system_product")){m.toggleFields(false,null,["system_product"]);}if(!_37){dj.byId("products").clear();}});m.animate("fadeOut",d.byId("multi_product_section"));}}}else{if(dj.byId("report_type")&&dj.byId("report_type").get("value")!=="01"){dj.byId("report_type").set("value","01");}_37=dj.byId("multi_product").get("checked");if(_37){m.animate("fadeIn",d.byId("multi_product_section"),function(){m.toggleFields(!_37,null,["single_product"]);m.toggleFields(false,null,["system_product"]);if(!_37){dj.byId("products").clear();}});m.animate("fadeOut",d.byId("single_product_section"));}else{m.animate("fadeIn",d.byId("single_product_section"),function(){m.toggleFields(!_37,null,["single_product"]);m.toggleFields(false,null,["system_product"]);if(!_37){dj.byId("products").clear();}});m.animate("fadeOut",d.byId("multi_product_section"));}}var _38;if(dj.byId("order_list_by_default").get("checked")){_38=function(){m.toggleFields(true,null,["order_column","order_type"],true);};m.animate("fadeIn",d.byId("order_details_section"),_38);}var foo;var _39=[];if(dj.byId("single_product").get("value")!=""||dj.byId("multi_product").get("checked")){foo=d.hitch(dj.byId("single_product"),m.loadProductColumns);foo();m.animate("fadeIn",d.byId("columns-section"));m.animate("fadeIn",d.byId(_2));m.resetCandidateColumns();foo=d.hitch(dj.byId("grouping_enable"),m.toggleGroupingFields,true);foo();_38=function(){d.query(".dojoxGrid").forEach(function(_3a){dj.byId(_3a.id).render();});};_39.push(d.byId("parameters-section"));_39.push(d.byId("filters-section"));_39.push(d.byId("overall-aggregates-section"));_39.push(d.byId("grouping-section"));m.animate("fadeIn",_39,_38);var ps=dj.byId("products").store;if(ps!=null){m.connect(ps,"onNew",function(){m.toggleColumnSection(misys._getStoreSize(dj.byId("products").store)>0);});}dj.byId("columns").onGridCreate();dj.byId("parameters").onGridCreate();dj.byId(_3).onGridCreate();}if(dj.byId("system_product").get("value")!=""){foo=d.hitch(dj.byId("system_product"),m.loadProductColumns);foo();m.animate("fadeIn",d.byId("columns-section"));m.animate("fadeIn",d.byId(_2));m.resetCandidateColumns();foo=d.hitch(dj.byId("grouping_enable"),m.toggleGroupingFields,true);foo();_38=function(){d.query(".dojoxGrid").forEach(function(_3b){dj.byId(_3b.id).render();});};_39.push(d.byId("parameters-section"));_39.push(d.byId("filters-section"));_39.push(d.byId("overall-aggregates-section"));_39.push(d.byId("grouping-section"));m.animate("fadeIn",_39,_38);dj.byId("columns").onGridCreate();dj.byId("parameters").onGridCreate();dj.byId(_3).onGridCreate();}foo=d.hitch(dj.byId("chart_flag"),m.toggleChartFields);foo();dojo.publish("formOnLoadEventsPerformed");},cancelDialog:function(_3c){dj.byId(_3c).hide();document.body.style.overflow="visible";},beforeSubmitValidations:function(){if(dj.byId("single_product")&&dj.byId("single_product").get("value")){_1b();}var _3d=false;if(dj.byId("multi_product").get("checked")){var _3e=dj.byId("products-grid");if(!_3e||(misys._getStoreSize(_3e.store)===0)){m._config.onSubmitErrorMsg=m.getLocalization("mandatoryReportProduct");_3d=true;}}if(!dj.byId("chart_flag").get("checked")){var _3f=dj.byId(_1);if(!_3f||(misys._getStoreSize(_3f.store)===0)){m._config.onSubmitErrorMsg=m.getLocalization("mandatoryReportColumn");_3d=true;}}else{if(dijit.byId("overall-aggregates")&&misys._getStoreSize(dijit.byId("overall-aggregates").store)>0){m._config.onSubmitErrorMsg=m.getLocalization("reportOverAllAggregateError");_3d=true;}else{if(!dj.byId("chart-aggregates-grid")||m._getStoreSize(dijit.byId("chart-aggregates-grid").store)===0){m._config.onSubmitErrorMsg=m.getLocalization("reportChartYAxisMandatory");_3d=true;}}}return !_3d;}});})(dojo,dijit,misys);dojo.require("misys.client.binding.system.create_report_client");}