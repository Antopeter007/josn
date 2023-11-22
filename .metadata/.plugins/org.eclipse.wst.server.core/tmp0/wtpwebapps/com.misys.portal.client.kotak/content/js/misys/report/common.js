/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.report.common"]){dojo._hasResource["misys.report.common"]=true;dojo.provide("misys.report.common");(function(d,dj,m){var _1=" in arrColumn";var _2="overall-aggregates";var _3="group-aggregates";var _4="chart-aggregates";var _5="columns-grid";var _6="chart-fields";m._config=m._config||{};d.mixin(m._config,{isValid:false});d.mixin(m,{arrComputedFieldIds:[],getProductDecode:function(_7){return arrCandidateName[_7];},getColumnDecode:function(_8){return arrColumn[_8][1];},getDisplayedColumn:function(_9,_a){if(_a){var _b=d.isArray(_a.computed_field_id)?_a.computed_field_id[0]:_a.computed_field_id;if(_b!==""){return m.getLocalization("computedLabel");}var _c=d.isArray(_a.column)?_a.column[0]:_a.column;return m.getColumnDecode(_c);}},getDisplayedColumnLabel:function(_d,_e){if(_e){if(_e.computed_field_id!=""){return _e.computed_field_id;}return _e["label_"+language];}},loadProductColumns:function(){var _f=this.get("value").toLowerCase();if(misys.reportclient&&misys.reportclient.loadProductColumns){misys.reportclient.loadProductColumns(_f);}else{dojo.require("misys.report.definitions.report_all_candidates");try{if(_f.indexOf("tnx")!=-1){_f=_f.substring(0,_f.indexOf("tnx"));}if(_f.indexOf("template")!=-1){_f=_f.substring(0,_f.indexOf("template"))+"_template";}if(dj.byId("isSwift2019Enabled").get("value")&&(_f==="bg"||_f==="bg_template"||_f==="br")){if(_f==="bg"){dojo["require"]("misys.report.definitions.report_iu_candidate");}else{if(_f==="bg_template"){dojo["require"]("misys.report.definitions.report_iu_template_candidate");}else{if(_f==="br"){dojo["require"]("misys.report.definitions.report_ru_candidate");}}}}else{dojo["require"]("misys.report.definitions.report_"+_f+"_candidate");}initialiseProductArrays(_f);}catch(e){}}},validateBasicReportInputFields:function(){var _10=this;if(_10&&_10.get("value")&&dj.byId("swiftregexValue")&&dj.byId("swiftregexValue").get("value")){var _11=new RegExp(dj.byId("swiftregexValue").get("value"));if(_10&&_11.test(_10.get("value"))==false){m.dialog.show("ERROR",m.getLocalization("invalidSWIFTTransactionError"));_10.set("value","");_10.set("state","Error");_10.focus();return false;}return true;}},toggleProductSections:function(){var _12;if(dj.byId("system_type")&&dj.byId("system_type").get("checked")){dj.byId("multi_product").set("checked",false);_12=function(){m.toggleFields(true,null,["system_product"]);dj.byId("products").clear();m.toggleColumnSection(false);m.toggleReportDetailSections(false);};m.animate("fadeIn",d.byId("system_feture_section"),_12);m.animate("fadeOut",d.byId("single_product_section"));m.animate("fadeOut",d.byId("multi_product_section"));m.animate("fadeOut",d.byId("multi_product_row"));m.resetCandidateColumns();}else{m.animate("fadeIn",d.byId("multi_product_row"));var _13=dj.byId("multi_product").get("checked");_12=function(){m.toggleFields(!_13,null,["single_product"]);m.toggleFields(false,null,["system_product"]);if(!_13){dj.byId("products").clear();}m.toggleColumnSection(false);m.toggleReportDetailSections(false);};if(_13){m.animate("fadeIn",d.byId("multi_product_section"),_12);m.animate("fadeOut",d.byId("single_product_section"));m.animate("fadeOut",d.byId("system_feture_section"));}else{m.animate("fadeIn",d.byId("single_product_section"),_12);m.animate("fadeOut",d.byId("multi_product_section"));m.animate("fadeOut",d.byId("system_feture_section"));}m.resetCandidateColumns();}},toggleColumnSection:function(_14){dj.byId("columns").clear();dj.byId("order_list_by_default").set("checked",false);dj.byId("use_absolute_width").set("checked",false);if(_14){m.animate("fadeIn",d.byId("columns-section"));}else{m.animate("fadeOut",d.byId("columns-section"));}m.resetCandidateColumns();},toggleReportDetailSections:function(_15){var _16=[];_16.push(d.byId("parameters-section"));_16.push(d.byId("filters-section"));_16.push(d.byId("overall-aggregates-section"));_16.push(d.byId("grouping-section"));_16.push(d.byId("chart-section"));if(_15){d.forEach(_16,function(_17){m.animate("fadeIn",_17);});}else{dj.byId("parameters").clear();dj.byId("filters").clear();dj.byId(_2).clear();dj.byId(_3).clear();dj.byId(_4).clear();dj.byId("grouping_enable").set("checked",false);dj.byId("chart_flag").set("checked",false);dj.byId("order_list_by_default").set("checked",false);d.forEach(_16,function(_18){m.animate("fadeOut",_18);});}},toggleCriteriumFields:function(){var _19=[];_19.push(d.byId("criterium_parameter_section"));_19.push(d.byId("criterium_pre_defined_value_section"));_19.push(d.byId("criterium_values_set_section"));_19.push(d.byId("criterium_string_section"));_19.push(d.byId("criterium_number_section"));_19.push(d.byId("criterium_amount_section"));_19.push(d.byId("criterium_date_section"));_19.push(d.byId("criterium_values_set_section"));_19.push(d.byId("criterium_parameter_default_string_section"));_19.push(d.byId("criterium_parameter_default_number_section"));_19.push(d.byId("criterium_parameter_default_amount_section"));_19.push(d.byId("criterium_parameter_default_date_section"));_19.push(d.byId("criterium_parameter_default_values_set_section"));var _1a=[];var _1b=dj.byId("criterium_column").get("value");if(_1b!==""){var _1c=dj.byId("criterium_value_type_1").get("checked");var _1d=dj.byId("criterium_value_type_2").get("checked");var _1e=dj.byId("criterium_value_type_3").get("checked");var _1f=arrColumn[_1b][0];var _20=function(){m.toggleFields(_1c,["criterium_parameter_default_string_value","criterium_parameter_default_number_value","criterium_parameter_default_date_value","criterium_parameter_default_values_set"],["criterium_parameter"],true);m.toggleFields(_1d,["criterium_string_value","criterium_number_value","criterium_values_set","criterium_date_value","criterium_amount_value"],null,true);m.toggleFields(_1e,["criterium_parameter_default_date_type_1","criterium_parameter_default_date_type_2","criterium_parameter_default_date_type_3","criterium_parameter_default_date_type_4","criterium_parameter_default_date_type_5","criterium_parameter_default_date_type_6"],null,true);};if(_1c){_1a.push(d.byId("criterium_parameter_section"));if(_1f==="String"){_1a.push(d.byId("criterium_parameter_default_string_section"));}else{if(_1f==="Number"){_1a.push(d.byId("criterium_parameter_default_number_section"));}}if(_1f==="Amount"){_1a.push(d.byId("criterium_parameter_default_amount_section"));}else{if(_1f==="Date"){_1a.push(d.byId("criterium_parameter_default_date_section"));}else{if(arrConstrainedParameterType.indexOf(_1f)!==-1){_1a.push(d.byId("criterium_parameter_default_values_set_section"));m._fncSetCriteriumValuesList();}}}m._fncToggleParameterDefaultValuesSection(_1f);}else{if(_1d){dj.byId("criterium_string_value").set("required",false);dj.byId("criterium_number_value").set("required",false);dj.byId("criterium_amount_value").set("required",false);dj.byId("criterium_date_value").set("required",false);dj.byId("criterium_values_set").set("required",false);dj.byId("criterium_parameter_default_values_set").set("required",false);if(_1f==="String"){_1a.push(d.byId("criterium_string_section"));dj.byId("criterium_string_value").set("required",true);}else{if(_1f==="Number"){_1a.push(d.byId("criterium_number_section"));dj.byId("criterium_number_value").set("required",true);}}if(_1f==="Amount"){_1a.push(d.byId("criterium_amount_section"));dj.byId("criterium_amount_value").set("required",true);}else{if(_1f==="Date"){_1a.push(d.byId("criterium_date_section"));dj.byId("criterium_date_value").set("required",true);}else{if(arrConstrainedParameterType.indexOf(_1f)!==-1){_1a.push(d.byId("criterium_values_set_section"));dj.byId("criterium_values_set").set("required",true);m._fncSetCriteriumValuesList(_1b);}}}}else{if(_1e){_1a.push(d.byId("criterium_pre_defined_value_section"));}}}}d.forEach(_19,function(_21){if(d.indexOf(_1a,_21)===-1){m.animate("fadeOut",_21);}});d.forEach(_1a,function(_22){m.animate("fadeIn",_22,_20);});},toggleAggregateFields:function(){if(m.dialog.isActive){var _23=m._fncGetParentWidget(this);if(_23!==null&&_23.open){dj.byId("aggregate_type").set("value","");dj.byId("aggregate_eqv_cur_code").set("value","");dj.byId("aggregate_use_product_currency").set("checked",false);d.forEach(languages,function(_24){var _25=dj.byId("aggregate_label_"+_24);if(_25){_25.set("value","");}});m.toggleCurrencySection();m.setAggregatesList();m._fncDefaultAggregateColumnLabel(true);}}},toggleCurrencySection:function(){if(m.reportclient&&m.reportclient.toggleCurrencySection){m.reportclient.toggleCurrencySection();}else{var _26=dj.byId("aggregate_column").get("value");var _27=dj.byId("aggregate_type").get("value");var _28=dj.byId("aggregate_eqv_cur_code").get("value");var _29=(_26!==""&&arrColumn[_26][0]==="Amount")&&(_27!==""&&_27!=="count");var _2a=function(){};var _2b=[d.byId("aggregate_eqv_currency_section"),d.byId("auto_determine_currency_section")];if(_29){d.forEach(_2b,function(_2c){m.animate("fadeIn",_2c);m.toggleFields(_29,null,["aggregate_eqv_cur_code"],false);});}else{d.forEach(_2b,function(_2d){m.animate("fadeOut",_2d);m.toggleFields(_29,null,["aggregate_eqv_cur_code"],false);});}}},toggleAutoComputationOfEquivalentCurrency:function(){var _2e=dj.byId("aggregate_eqv_cur_code").get("value");dj.byId("aggregate_use_product_currency").set("checked",(_2e===""));dj.byId("aggregate_use_product_currency").set("disabled",(_2e!==""));},toggleEquivalentCurrency:function(){var _2f=dj.byId("aggregate_use_product_currency").get("checked");dj.byId("aggregate_eqv_cur_code").set("required",!_2f);dj.byId("aggregate_eqv_cur_code").set("disabled",_2f);if(_2f){dj.byId("aggregate_eqv_cur_code").set("value","");}},toggleComputedFields:function(){var _30=dj.byId("computed_field").get("checked");var _31=function(){m.toggleFields(_30,null,["computed_field_id","operation","operand"]);};if(_30){m.animate("fadeIn",d.byId("computation_section"),_31);}else{m.animate("fadeOut",d.byId("computation_section"),_31);}},toggleOrderDetails:function(){var _32=this.get("checked");var _33=function(){dj.hideTooltip(dijit.byId("addColumnButton").domNode);};if(dijit.byId(_5)){var _34=function(){m.toggleFields(_32&&misys._getStoreSize(dijit.byId(_5).store)>0,null,["order_column","order_type"]);};if(_32&&misys._getStoreSize(dijit.byId(_5).store)>0){m.animate("fadeIn",d.byId("order_details_section"),_34);}else{m.animate("fadeOut",d.byId("order_details_section"),_34);}if(misys._getStoreSize(dijit.byId(_5).store)===0){this.set("checked",false);m.showTooltip(m.getLocalization("addAColumnFirst"),dijit.byId("addColumnButton").domNode,["after"]);setTimeout(_33,1000);}}else{if(_32){m.showTooltip(m.getLocalization("addAColumnFirst"),dijit.byId("addColumnButton").domNode,["after"]);setTimeout(_33,1000);}this.set("checked",false);}},toggleGroupingFields:function(_35){var _36=this;var _37=function(){m.toggleFields(_36.get("checked"),null,["grouping_column"],_35,true);};if(this.get("checked")){m.animate("fadeIn",dojo.byId("grouping_details_section"),_37);m._fncClearChartSection();}else{m.animate("fadeOut",dojo.byId("grouping_details_section"),_37);m._fncClearGroupingSection();}},toggleChartFields:function(){var _38=dj.byId("chart_flag").get("checked");var _39=function(){dj.hideTooltip(dijit.byId("addColumnButton").domNode);};if(dijit.byId(_5)){var _3a=function(){m.toggleFields(_38&&misys._getStoreSize(dijit.byId(_5).store)>0,null,["chart_axis_x","chart_axis_x_scale","chart_rendering",_4]);dj.byId("chart_axis_x_scale").set("required",false);};if(_38&&misys._getStoreSize(dijit.byId(_5).store)>0){m.animate("fadeIn",d.byId(_6),_3a);m._fncClearGroupingSection();}else{m.animate("fadeOut",d.byId(_6),_3a);dj.byId(_4).clear();}if(dj.byId(_4).store){dj.byId(_4).addButtonNode.set("disabled",(m._getStoreSize(dj.byId(_4).store)>0));}if(misys._getStoreSize(dijit.byId(_5).store)===0){this.set("checked",false);m.showTooltip(m.getLocalization("addAColumnFirst"),dijit.byId("addColumnButton").domNode,["after"]);setTimeout(_39,1000);}}else{if(_38){m.showTooltip(m.getLocalization("addAColumnFirst"),dijit.byId("addColumnButton").domNode,["after"]);setTimeout(_39,1000);}this.set("checked",false);m.animate("fadeOut",d.byId(_6),_3a);dj.byId(_4).clear();}},toggleColumnFields:function(_3b){var _3c=dj.byId("columns").dialog.open;if(_3c){var _3d=dj.byId("column").get("value");d.forEach(languages,function(_3e){var _3f=dj.byId("label_"+_3e);});if(!dj.byId("alignment")){dj.byId("alignment").set("value","");}if(!dj.byId("width")){dj.byId("width").set("value","");}if(!dj.byId("eqv_cur_code")){dj.byId("eqv_cur_code").set("value","");}if(!dj.byId("computed_field_id")){dj.byId("computed_field_id").set("value","");}if(!dj.byId("operation")){dj.byId("operation").set("value","");}if(!dj.byId("operand")){dj.byId("operand").set("value","");}if(arrColumn[_3d]){d.attr("eqv_currency_section","style","display:"+(arrColumn[_3d][0]==="Amount"?"block":"none"));}if(!dj.byId("computed_field")){dj.byId("computed_field").set("checked",false);m.toggleComputedFields();}if(m.dialog.isActive||dj.byId("label_"+language).get("value")==""){m.defaultColumnLabel(true);}m.setOperatorsList();m.setOperands();}},toggleCriteriumColumnFields:function(){if(m.dialog.isActive){var _40=m._fncGetParentWidget(this);if(_40!==null&&_40.open){dj.byId("criterium_operator").set("value","");dj.byId("criterium_parameter").set("value","");dj.byId("criterium_string_value").set("value","");dj.byId("criterium_number_value").set("value","");dj.byId("criterium_amount_value").set("value","");dj.byId("criterium_date_value").set("value",null);dj.byId("criterium_value_type_1").set("checked",false);dj.byId("criterium_value_type_2").set("checked",false);dj.byId("criterium_value_type_3").set("checked",false);var _41=[d.byId("criterium_parameter_section"),d.byId("criterium_string_section"),d.byId("criterium_number_section"),d.byId("criterium_amount_section"),d.byId("criterium_date_section"),d.byId("criterium_values_set_section")];d.forEach(_41,function(_42){m.animate("fadeOut",_42);});m.setCriteriumOperatorsList(dj.byId("criterium_column").get("value"));m._fncSetCriteriumValuesList(dj.byId("criterium_column").get("value"));if(this.get("value")!==""&&this.get("value")!==null){var _43=arrColumn[this.get("value")][0];dj.byId("criterium_column_type").set("value",_43);m._fncToggleParameterDefaultValuesSection(_43);dj.byId("criterium_value_type_3").set("disabled",_43!="Date");dj.byId("criterium_value_type_2").set("hidden",_43!="String"||_43!="Date");}}}},toggleCriteriumOperatorFields:function(){if(dj.byId("criterium_operator").get("value")==="isNull"){dj.byId("criterium_parameter").set("value","");dj.byId("criterium_string_value").set("value","");dj.byId("criterium_number_value").set("value","");dj.byId("criterium_amount_value").set("value","");dj.byId("criterium_date_value").set("value",null);dj.byId("criterium_value_type_1").set("checked",false);dj.byId("criterium_value_type_2").set("checked",false);dj.byId("criterium_value_type_3").set("checked",false);}},toggleCriteriumParameterDefaultDate:function(){var _44="";var _45=d.query("[name='criterium_parameter_default_date_type']",d.byId("criterium_pre_defined_value_section"));d.some(_45,function(_46){var _47=dj.byNode(_46.parentNode);var _48=_47.get("checked");if(_48){_44=_47.params.value;return true;}});switch(_44){case "01":m._fncEnableReportExecutionDate(true);m._fncEnableFirstDayOfCurrentMonth(false);m._fncEnableLastDayOfCurrentMonth(false);m._fncEnableToday(false);m._fncEnableTomorrow(false);m._fncEnableYesterday(false);break;case "02":m._fncEnableReportExecutionDate(false);m._fncEnableFirstDayOfCurrentMonth(true);m._fncEnableLastDayOfCurrentMonth(false);m._fncEnableToday(false);m._fncEnableTomorrow(false);m._fncEnableYesterday(false);break;case "03":m._fncEnableReportExecutionDate(false);m._fncEnableFirstDayOfCurrentMonth(false);m._fncEnableLastDayOfCurrentMonth(true);m._fncEnableToday(false);m._fncEnableTomorrow(false);m._fncEnableYesterday(false);break;case "04":m._fncEnableReportExecutionDate(false);m._fncEnableFirstDayOfCurrentMonth(false);m._fncEnableLastDayOfCurrentMonth(false);m._fncEnableToday(true);m._fncEnableTomorrow(false);m._fncEnableYesterday(false);break;case "05":m._fncEnableReportExecutionDate(false);m._fncEnableFirstDayOfCurrentMonth(false);m._fncEnableLastDayOfCurrentMonth(false);m._fncEnableToday(false);m._fncEnableTomorrow(true);m._fncEnableYesterday(false);break;case "06":m._fncEnableReportExecutionDate(false);m._fncEnableFirstDayOfCurrentMonth(false);m._fncEnableLastDayOfCurrentMonth(false);m._fncEnableToday(false);m._fncEnableTomorrow(false);m._fncEnableYesterday(true);break;default:m._fncEnableReportExecutionDate(false);m._fncEnableFirstDayOfCurrentMonth(false);m._fncEnableLastDayOfCurrentMonth(false);m._fncEnableToday(false);m._fncEnableTomorrow(false);m._fncEnableYesterday(false);break;}},resetCandidateColumns:function(){var _49=m.retrieveCandidate();m.setColumns("column",_49);m.setColumns("order_column",_49);m.setColumns("criterium_column",_49);m.setColumns("grouping_column",_49);m.setColumns("chart_axis_x",_49);m.setAggregateColumns(_49);},criteriumOpenDialogFromExistingItemInitFunction:function(_4a){if(misys.reportclient&&misys.reportclient.criteriumOpenDialogFromExistingItemInitFunction){misys.reportclient.criteriumOpenDialogFromExistingItemInitFunction();}else{var _4b=dj.byId("criterium_value_type_1").get("checked");var _4c=dj.byId("criterium_value_type_2").get("checked");var _4d=dj.byId("criterium_value_type_3").get("checked");var _4e=dj.byId("criterium_column").get("value");var _4f=arrColumn[_4e][0];if(_4b){d.byId("criterium_string_section").style.display="none";d.byId("criterium_number_section").style.display="none";d.byId("criterium_amount_section").style.display="none";d.byId("criterium_date_section").style.display="none";d.byId("criterium_values_set_section").style.display="none";d.byId("criterium_parameter_section").style.display="block";d.style("criterium_pre_defined_value_section","display","none");m._fncToggleParameterDefaultValuesSection(_4f);}else{if(_4c){if(arrColumn[_4e]){d.byId("criterium_parameter_section").style.display="none";d.byId("criterium_string_section").style.display=(_4f==="String"?"block":"none");d.byId("criterium_number_section").style.display=(_4f==="Number"?"block":"none");d.byId("criterium_amount_section").style.display=(_4f==="Amount"?"block":"none");d.byId("criterium_date_section").style.display=(_4f==="Date"?"block":"none");if(arrConstrainedParameterType.indexOf(_4f)!==-1){d.byId("criterium_values_set_section").style.display="block";}else{d.byId("criterium_values_set_section").style.display="none";}d.style("criterium_pre_defined_value_section","display","none");}}else{if(_4d){if(arrColumn[_4e]){d.style("criterium_parameter_section","display","none");d.style("criterium_string_section","display","none");d.style("criterium_number_section","display","none");d.style("criterium_amount_section","display","none");d.style("criterium_date_section","display","none");d.style("criterium_values_set_section","display","none");d.style("criterium_pre_defined_value_section","display","block");}}}}if(_4f!="Date"){dj.byId("criterium_value_type_3").set("disabled",true);d.style("criterium_pre_defined_value_section","display","none");}}},displayColumnLabelsInOtherLanguages:function(){d.style("display_displayed_column_labels","display","none");d.style("hide_displayed_column_labels","display","inline");m.animate("fadeIn",d.byId("displayed_column_labels_other_languages"));},hideColumnLabelsInOtherLanguages:function(){d.style("display_displayed_column_labels","display","inline");d.style("hide_displayed_column_labels","display","none");m.animate("fadeOut",d.byId("displayed_column_labels_other_languages"));},defaultDataInPage:function(){var _50=m.retrieveCandidate();m.setColumns("column",_50);m.setColumns("order_column",_50);m.setColumns("criterium_column",_50);m.setColumns("grouping_column",_50);m.setColumns("chart_axis_x",_50);m.setAggregateColumns(_50);var _51=dj.byId("hidden_grouping_column").get("value");dj.byId("grouping_column").set("value",_51);var _52=dj.byId("hidden_chart_axis_x").get("value");dj.byId("chart_axis_x").set("value",_52);},defaultColumnLabel:function(_53){var _54=dj.byId("column").get("value");if(_54&&_54!==""){var _55=dj.byId("label_"+language);var _56=arrColumn[_54][1];if((_55.get("value")===""||_53)&&_55.get("value")!=_56){dj.byId("label_"+language).set("value",_56);}}},displayParameterLabelsInOtherLanguages:function(){d.byId("display_parameter_labels").style.display="none";d.byId("hide_parameter_labels").style.display="inline";d.byId("parameter_labels_other_languages").style.display="block";},hideParameterLabelsInOtherLanguages:function(){d.byId("hide_parameter_labels").style.display="none";d.byId("parameter_labels_other_languages").style.display="none";misys.animate("fadeIn",d.byId("display_parameter_labels"),null,false,{display:"inline"});},displayAggregateLabelsInOtherLanguages:function(){d.byId("display_aggregate_labels").style.display="none";d.byId("hide_aggregate_labels").style.display="inline";d.byId("aggregate_labels_other_languages").style.display="block";},hideAggregateLabelsInOtherLanguages:function(){d.byId("hide_aggregate_labels").style.display="none";d.byId("aggregate_labels_other_languages").style.display="none";misys.animate("fadeIn",d.byId("display_aggregate_labels"),null,false,{display:"inline"});},getAggregateOperatorDecode:function(_57){return aggregateOperators[_57];},getCriteriaOperatorDecode:function(_58){return criteriaOperators[_58];},setColumns:function(_59,_5a){if(_5a!=""){var _5b=m._fncBuildColumnsData(_59,_5a);var _5c=new d.data.ItemFileReadStore({data:_5b});dj.byId(_59).store=_5c;dj.byId(_59).set("searchAttr","name");}},setAggregateColumns:function(_5d){if(_5d!==""){var _5e=m._fncBuildColumnsData("aggregate_column",_5d);var _5f=dj.byId("columns");if(_5f.grid){_5f.grid.store.fetch({query:{column:"*"},onComplete:function(_60,_61){d.forEach(_60,function(_62){if(_62.computed_field_id!=""){var _63=_62["label_"+language];_5e.items.push({column:_62.computed_field_id,name:_63});}});}});}var _64=new d.data.ItemFileReadStore({data:_5e});dj.byId("aggregate_column").store=_64;dj.byId("aggregate_column").set("searchAttr","name");}},retrieveCandidate:function(){if(dj.byId("system_type")&&dj.byId("system_type").get("checked")){return dj.byId("system_product").get("value");}if(dj.byId("multi_product").get("checked")){var _65="";var _66=dj.byId("products-grid");if(_66){_66.store.fetch({query:{store_id:"*"},onComplete:function(_67,_68){if(_67.length>0){var _69=_67[0].product[0];if(_69.match("Tnx$")=="Tnx"){_65="AllTnx";}else{if(_69.match("Template$")=="Template"){_65="Alltemplate";}else{_65="AllMaster";}}}}});}return _65;}return dj.byId("single_product").get("value");},setOperands:function(_6a){if(m.dialog.isActive){var _6b=dj.byId("column").get("value");if(arrColumn[_6b]){var _6c=arrColumn[_6b][0];var _6d=m.retrieveCandidate();var _6e={identifier:"column",label:"name",items:[]};d.forEach(arrProductColumn[_6d],function(_6f){if(_6f){if(arrColumn[_6f]&&arrColumn[_6f][0]==_6c){_6e.items.push({column:_6f,name:arrColumn[_6f][1]});}else{}}});var _70=new d.data.ItemFileReadStore({data:_6e});dj.byId("operand").store=_70;dj.byId("operand").set("searchAttr","name");if(_6a){if(_6a.operand[0].toString()!=""){dj.byId("operand").set("value",_6a.operand[0].toString());}}}}},setOperatorsList:function(_71){if(m.dialog.isActive){var _72=[];var _73=dj.byId("column").get("value");if(arrColumn[_73]){if(arrColumn[_73][0]=="Amount"){_72=["+","-","/"];}else{if(arrColumn[_73][0]=="Date"){_72=["-"];}else{if(arrColumn[_73][0]=="String"){_72=["+"];}else{if(arrColumn[_73][0]=="Number"){_72=["+","-","*","/"];}}}}}else{}var _74={identifier:"operator",label:"name",items:[]};d.forEach(_72,function(_75){if(_75){_74.items.push({operator:_75,name:arrComputation[_75]});}});var _76=new d.data.ItemFileReadStore({data:_74});dj.byId("operation").store=_76;dj.byId("operation").set("searchAttr","name");if(_71){if(_71.operation[0].toString()!=""){dj.byId("operation").set("value",_71.operation[0].toString());}}}},setCriteriumValuesSetList:function(_77){m._fncSetCriteriumValuesList(_77);},setCriteriumParametersList:function(_78){var _79=dj.byId("parameters");if(_79.grid){var _7a=[];var _7b={identifier:"parameter",label:"name",items:[]};_79.grid.store.fetch({query:{parameter_name:"*"},onComplete:function(_7c,_7d){d.forEach(_7c,function(_7e){_7b.items.push({parameter:_7e.parameter_name,name:_7e["label_"+language]});});}});var _7f=new d.data.ItemFileReadStore({data:_7b});dj.byId("criterium_parameter").store=_7f;dj.byId("criterium_parameter").set("searchAttr","name");}},setCriteriumOperatorsList:function(_80){var _81=[];if(arrColumn[_80]){if(arrColumn[_80][0]=="Amount"){_81=["different","equal","infOrEqual","supOrEqual","inferior","superior"];}else{if(arrColumn[_80][0]=="Date"){_81=["different","equal","infOrEqual","supOrEqual","inferior","superior"];}else{if(arrColumn[_80][0]=="String"){_81=["different","equal","like","notLike","isNull","isNotNull"];}else{if(arrColumn[_80][0]=="Number"){_81=["different","equal","infOrEqual","supOrEqual","inferior","superior"];}else{if(arrConstrainedParameterType.indexOf(arrColumn[_80][0])!==-1){_81=["different","equal","isNull","isNotNull"];}}}}}}else{}var _82={identifier:"operator",label:"name",items:[]};d.forEach(_81,function(_83){if(_83){_82.items.push({operator:_83,name:criteriaOperators[_83]});}});var _84=new d.data.ItemFileReadStore({data:_82});dj.byId("criterium_operator").store=_84;dj.byId("criterium_operator").set("searchAttr","name");},getCriteriumOperand:function(_85,_86){var _87="";if(_86&&arrColumn[_86.column]){var _88=d.isArray(_86.value_type)?_86.value_type[0]:_86.value_type;var _89=arrColumn[_86.column][0];if(_88=="01"){_87=m.getLocalization("parameterLabel")+" "+_86.parameter;}else{if(_88=="02"){if(_89==="String"){_87=_86.string_value;}else{if(_89==="Number"){_87=_86.number_value;}}if(_89==="Amount"){_87=_86.amount_value;}else{if(_89==="Date"){_87=_86.date_value;}else{if(arrConstrainedParameterType.indexOf(_89)!==-1){var _8a=_86.values_set;var _8b=[];var _8c=m.retrieveCandidate();if(arrValuesSetProduct[_86.column]){if(_8c.indexOf("All")===0){_8b=arrValuesSetProduct[_86.column]["All"];}else{_8b=arrValuesSetProduct[_86.column][_8c.substring(0,2)];}}if(_8b.length===0&&arrValuesSet[_86.column]){_8b=arrValuesSet[_86.column];}var _8d=d.filter(_8b,function(_8e){return _8e[0]==_8a;});_87=(_8d.length>0?_8d[0][1]:"");}}}}else{if(_88=="03"){var _8f=d.isArray(_86.default_date_type)?_86.default_date_type[0]:_86.default_date_type;var _90="";var _91="";switch(_8f){case "01":_90=d.isArray(_86.default_date_report_exec_date_offset)?_86.default_date_report_exec_date_offset[0]:_86.default_date_report_exec_date_offset;_91=d.isArray(_86.default_date_report_exec_date_offset_days)?_86.default_date_report_exec_date_offset_days[0]:_86.default_date_report_exec_date_offset_days;_87=m.getLocalization("reportExecutionDate")+(_90=="01"?" + ":" - ")+_91+" "+m.getLocalization("days");break;case "02":_90=d.isArray(_86.default_date_first_day_of_month_offset)?_86.default_date_first_day_of_month_offset[0]:_86.default_date_first_day_of_month_offset;_91=d.isArray(_86.default_date_first_day_of_month_offset_days)?_86.default_date_first_day_of_month_offset_days[0]:_86.default_date_first_day_of_month_offset_days;_87=m.getLocalization("firstDayOfCurrentMonth")+(_90=="01"?" + ":" - ")+_91+" "+m.getLocalization("days");break;case "03":_90=d.isArray(_86.default_date_last_day_of_month_offset)?_86.default_date_last_day_of_month_offset[0]:_86.default_date_last_day_of_month_offset;_91=d.isArray(_86.default_date_last_day_of_month_offset_days)?_86.default_date_last_day_of_month_offset_days[0]:_86.default_date_last_day_of_month_offset_days;_87=m.getLocalization("lastDayOfCurrentMonth")+(_90=="01"?" + ":" - ")+_91+" "+m.getLocalization("days");break;case "04":_87=m.getLocalization("today");break;case "05":_87=m.getLocalization("tomorrow");break;case "06":_87=m.getLocalization("yesterday");break;default:break;}}}}}return _87;},aggregateTypeOnChange:function(_92){if(m.dialog.isActive){var _93=(dj.byId(_2).dialog&&dj.byId(_2).dialog.open)||(dj.byId(_3).dialog&&dj.byId(_3).dialog.open);if(_93){dj.byId("aggregate_use_product_currency").set("checked",false);dj.byId("aggregate_eqv_cur_code").set("value","");dj.byId("aggregate_eqv_cur_code").set("required",false);m._fncDefaultAggregateColumnLabel(true);m.toggleCurrencySection();}}},setAggregatesList:function(_94){if(misys.reportclient&&misys.reportclient.setAggregatesList){misys.reportclient.setAggregatesList(_94);}else{var _95=[];_94=_94?_94:dj.byId("aggregate_column").get("value");if(arrColumn[_94]){if(arrColumn[_94][0]=="Amount"){_95=["sum","count","average","minimum","maximum"];}else{if(arrColumn[_94][0]=="String"||arrColumn[_94][0]=="Date"){_95=["count"];}else{if(arrColumn[_94][0]=="Number"){_95=["sum","count","average","minimum","maximum"];}else{if(arrConstrainedParameterType.indexOf(arrColumn[_94][0])!==-1){_95=["count"];}}}}}else{}var _96={identifier:"operator",label:"name",items:[]};d.forEach(_95,function(_97){if(_97){_96.items.push({operator:_97,name:aggregateOperators[_97]});}});var _98=new d.data.ItemFileReadStore({data:_96});dj.byId("aggregate_type").store=_98;dj.byId("aggregate_type").set("searchAttr","name");}},chartAxisXOnChange:function(){var _99=this.get("value");if(_99!==""&&arrColumn[_99][0]==="Date"){d.byId("chart-x-scale-section").style.display="block";}else{d.byId("chart-x-scale-section").style.display="none";dj.byId("chart_axis_x_scale").set("value","");}dj.byId("chart_axis_x_scale").set("required",false);},groupingColumnOnChange:function(){var _9a=this.get("value");var _9b=(_9a!=""&&arrColumn[_9a][0]=="Date");d.byId("group-scale-section").style.display=_9b?"block":"none";dj.byId("grouping_column_scale").set("required",false);if(!_9b){dj.byId("grouping_column_scale").set("value","");}},_getStoreSize:function(_9c){if(_9c&&_9c._getItemsArray){return _9c._getItemsArray().length;}},_fncClearGroupingSection:function(){dj.byId("grouping_enable").set("checked",false);dj.byId(_3).clear();dj.byId("grouping_column").set("value","");dj.byId("grouping_column_scale").set("value","");},_fncClearChartSection:function(){dj.byId("chart_flag").set("checked",false);dj.byId("chart_rendering").set("value","");dj.byId("hidden_chart_axis_x").set("value","");dj.byId("chart_axis_x").set("value","");dj.byId("chart_axis_x_scale").set("value","");dj.byId(_4).clear();},_fncBuildColumnsData:function(_9d,_9e){var _9f={identifier:"column",label:"name",items:[]};var _a0=[];switch(_9d){case "order_column":_a0=arrProductOrderColumn[_9e];break;case "criterium_column":_a0=arrProductCriteriaColumn[_9e];break;case "grouping_column":_a0=arrProductGroupColumn[_9e];break;case "chart_axis_x":_a0=arrProductChartXAxisColumn[_9e];break;case "aggregate_column":_a0=arrProductAggregateColumn[_9e];break;default:_a0=arrProductColumn[_9e];break;}if(!_a0||_a0.length===0){_a0=arrProductColumn[_9e];}d.forEach(_a0,function(_a1){var _a2=new RegExp("Narrative@");if(arrColumn[_a1]&&_9d==="column"){_9f.items.push({column:_a1,name:arrColumn[_a1][1]});}else{if(arrColumn[_a1]&&_a2.test(_a1)===false){_9f.items.push({column:_a1,name:arrColumn[_a1][1]});}else{}}});return _9f;},_fncToggleParameterDefaultValuesSection:function(_a3){d.byId("criterium_parameter_default_string_section").style.display=(_a3=="String"?"block":"none");d.byId("criterium_parameter_default_number_section").style.display=(_a3=="Number"?"block":"none");d.byId("criterium_parameter_default_amount_section").style.display=(_a3=="Amount"?"block":"none");d.byId("criterium_parameter_default_date_section").style.display=(_a3=="Date"?"block":"none");if(arrConstrainedParameterType.indexOf(_a3)!==-1){d.byId("criterium_parameter_default_values_set_section").style.display="block";}else{d.byId("criterium_parameter_default_values_set_section").style.display="none";}},_fncSetCriteriumValuesList:function(_a4){var _a5=_a4;if(arrColumn[_a5]&&arrConstrainedParameterType.indexOf(arrColumn[_a5][0])!==-1){var _a6={identifier:"value",label:"name",items:[]};var _a7=[];var _a8=m.retrieveCandidate();if(arrValuesSetProduct[_a5]){if(_a8.indexOf("All")===0){_a7=arrValuesSetProduct[_a5]["All"];}else{_a7=arrValuesSetProduct[_a5][_a8.substring(0,2)];}}if(_a7.length===0&&arrValuesSet[_a5]){_a7=arrValuesSet[_a5];}d.forEach(_a7,function(_a9){_a6.items.push({value:_a9[0],name:_a9[1]});});var _aa=new d.data.ItemFileReadStore({data:_a6});dj.byId("criterium_values_set").store=_aa;dj.byId("criterium_values_set").set("searchAttr","name");dj.byId("criterium_parameter_default_values_set").store=_aa;dj.byId("criterium_parameter_default_values_set").set("searchAttr","name");}},_fncGetParentWidget:function(_ab){for(var p=_ab.domNode.parentNode;p;p=p.parentNode){var id=p.getAttribute&&p.getAttribute("widgetId");if(id){var _ac=dj.byId(id);return _ac;}}return null;},_fncDefaultAggregateColumnLabel:function(_ad){var _ae=dj.byId("aggregate_column").get("value");var _af=dj.byId("aggregate_type").get("value");if(_ae!=""&&_af!=""){var _b0=dj.byId("aggregate_label_"+language);if(_b0.get("value")==""||_ad){var _b1=arrColumn[_ae][1]+" ("+aggregateOperators[_af]+")";dj.byId("aggregate_label_"+language).set("value",_b1);}}},_fncEnableReportExecutionDate:function(_b2){dj.byId("criterium_parameter_default_date_type_1").set("checked",_b2);dj.byId("criterium_parameter_default_date_report_exec_date_offset_1").set("disabled",!_b2);dj.byId("criterium_parameter_default_date_report_exec_date_offset_2").set("disabled",!_b2);dj.byId("criterium_parameter_default_date_report_exec_date_offset_days").set("disabled",!_b2);if(dj.byId("criterium_parameter_default_date_report_exec_date_offset_1").get("checked")==false&&dj.byId("criterium_parameter_default_date_report_exec_date_offset_2").get("checked")==false){dj.byId("criterium_parameter_default_date_report_exec_date_offset_1").set("checked",true);}if(!_b2){dj.byId("criterium_parameter_default_date_report_exec_date_offset_1").set("checked",false);dj.byId("criterium_parameter_default_date_report_exec_date_offset_2").set("checked",false);dj.byId("criterium_parameter_default_date_report_exec_date_offset_days").set("value",0);}},_fncEnableFirstDayOfCurrentMonth:function(_b3){dj.byId("criterium_parameter_default_date_type_2").set("checked",_b3);dj.byId("criterium_parameter_default_date_first_day_of_month_offset_1").set("disabled",!_b3);dj.byId("criterium_parameter_default_date_first_day_of_month_offset_2").set("disabled",!_b3);dj.byId("criterium_parameter_default_date_first_day_of_month_offset_days").set("disabled",!_b3);if(dj.byId("criterium_parameter_default_date_first_day_of_month_offset_1").get("checked")==false&&dj.byId("criterium_parameter_default_date_first_day_of_month_offset_2").get("checked")==false){dj.byId("criterium_parameter_default_date_first_day_of_month_offset_1").set("checked",true);}if(!_b3){dj.byId("criterium_parameter_default_date_first_day_of_month_offset_1").set("checked",false);dj.byId("criterium_parameter_default_date_first_day_of_month_offset_2").set("checked",false);dj.byId("criterium_parameter_default_date_first_day_of_month_offset_days").set("value",0);}},_fncEnableLastDayOfCurrentMonth:function(_b4){dj.byId("criterium_parameter_default_date_type_3").set("checked",_b4);dj.byId("criterium_parameter_default_date_last_day_of_month_offset_1").set("disabled",!_b4);dj.byId("criterium_parameter_default_date_last_day_of_month_offset_2").set("disabled",!_b4);dj.byId("criterium_parameter_default_date_last_day_of_month_offset_days").set("disabled",!_b4);if(dj.byId("criterium_parameter_default_date_last_day_of_month_offset_1").get("checked")==false&&dj.byId("criterium_parameter_default_date_last_day_of_month_offset_2").get("checked")==false){dj.byId("criterium_parameter_default_date_last_day_of_month_offset_1").set("checked",true);}if(!_b4){dj.byId("criterium_parameter_default_date_last_day_of_month_offset_1").set("checked",false);dj.byId("criterium_parameter_default_date_last_day_of_month_offset_2").set("checked",false);dj.byId("criterium_parameter_default_date_last_day_of_month_offset_days").set("value",0);}},_fncEnableToday:function(_b5){dj.byId("criterium_parameter_default_date_type_4").set("checked",_b5);},_fncEnableTomorrow:function(_b6){dj.byId("criterium_parameter_default_date_type_5").set("checked",_b6);},_fncEnableYesterday:function(_b7){dj.byId("criterium_parameter_default_date_type_6").set("checked",_b7);}});})(dojo,dijit,misys);dojo.require("misys.client.report.common_client");}