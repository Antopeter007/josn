/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.binding.openaccount.simplified_upload_ip_template"]){dojo._hasResource["misys.binding.openaccount.simplified_upload_ip_template"]=true;dojo.provide("misys.binding.openaccount.simplified_upload_ip_template");dojo.require("dojo.data.ItemFileReadStore");dojo.require("dijit.form.FilteringSelect");dojo.require("misys.validation.login");dojo.require("misys.validation.password");dojo.require("misys.form.MultiSelect");dojo.require("dijit.form.Select");dojo.require("dijit.form.Form");dojo.require("dijit.form.Button");dojo.require("dijit.form.TextBox");dojo.require("dijit.form.ValidationTextBox");dojo.require("misys.form.common");dojo.require("misys.validation.common");dojo.require("dojox.xml.DomParser");dojo.require("misys.openaccount.FormOpenAccountEvents");(function(d,dj,m){d.mixin(m,{bind:function(){misys.connect("name","onBlur",_1);misys.connect("mapping_fixed","onClick",_2);misys.connect("mapping_delimited","onClick",_2);misys.connect("delimiter","onChange",_3);misys.connect("user_list","onClick",_4);misys.connect("start","onBlur",_5);misys.connect("format_length","onBlur",_5);misys.connect("date_format_select","onChange",_5);misys.connect("amount_format_select","onChange",_5);misys.connect("date_format_other","onBlur",_5);misys.connect("amount_format_other","onBlur",_5);misys.connect("add_column","onClick",_6);misys.connect("remove_column","onClick",_7);m.connect("delimiter","onChange",function(){if(dj.byId("amount_format_select")){m.changeAmountFormatSelectField();}});var _8=dj.byId("mapping_fixed");var _9=dj.byId("mapping_delimited");if(_8&&_8.get("checked")===false&&dj.byId("mapping_delimited").get("checked")===false){_8.set("checked",true);_8.onClick();}else{if(_8&&_8.get("checked")===true){_8.onClick();}else{if(_9&&_9.get("checked")===true){_9.onClick();}}}misys.connect("move_column_up_img","onClick",_a);misys.connect("move_column_down_img","onClick",_a);},onFormLoad:function(){var _b=dj.byId("hidden_delimiter").get("value"),_c=dj.byId("mapping_fixed"),_d=misys._config.matchedColumn;if(_d==="Y"){_e(d.byId("column_amount_format_div"));_e(d.byId("column_date_format_div"));_e(d.byId("column_start_length_div"));_f();dj.byId("date_format_select").onChange();if(_c&&_c.get("checked")===true){_c.onClick();}else{var _10=dj.byId("delimiter");var _11=dj.byId("delimiter_text");if("S"+_b!=="S"){_10?_10.onChange():null;if(_10&&_b!=="comma"&&_b!==";"&&_b!=="tab"&&_b!==";;"){_10.set("value","OTHER");_11.set("value",_b);}}else{if(_10&&_11){_10.set("value","OTHER");_11.set("value",_b);}}}}else{if(d.byId("disclaimer")){d.byId("disclaimer").style.display="block";}}},beforeSubmitValidations:function(){var _12=true,_13=dj.byId("mapping_delimited"),_14=dj.byId("mapping_fixed"),_15=dj.byId("delimiter"),_16=dj.byId("delimiter_text");userList=dj.byId("user_list");if(_13&&_13.get("checked")===true){if("S"+_15.get("value")==="S"){displayMessage=misys.getLocalization("uploadTemplateDelimiterRequired");_15.set("state","Error");dj.hideTooltip(_15.domNode);dj.showTooltip(displayMessage,_15.domNode,0);return false;}if(_15.get("value")==="OTHER"&&"S"+_16.get("value")==="S"){displayMessage=misys.getLocalization("uploadTemplateDelimiterTextRequired");_16.set("state","Error");dj.hideTooltip(_16.domNode);dj.showTooltip(displayMessage,_16.domNode,0);return false;}}if(!_17()){return false;}if(_13&&_13.get("checked")&&!m.validateDateAmountFormatFields()){return false;}d.forEach(d.query("option",userList.domNode),function(_18){if(!_18.value){return false;}});if(_14&&_14.get("checked")&&!_19()){return false;}return _12;}});d.mixin(m._config,{xmlTransform:function(xml){var _1a=m._config.xmlTagName,_1b=_1a?["<",_1a,">"]:[],dom=dojox.xml.DomParser.parse(xml),_1c=dj.byId("user_list");_1b.push("<brch_code>","00001","</brch_code>");_1b.push(m.getDomNode(dom,"upload_template_id"));_1b.push(m.getDomNode(dom,"name"));_1b.push(m.getDomNode(dom,"description"));_1b.push(m.getDomNode(dom,"mapping"));_1b.push(m.getDomNode(dom,"delimiter"));_1b.push(m.getDomNode(dom,"delimiter_text"));_1b.push(m.getDomNode(dom,"executable"));d.forEach(d.query("option",_1c.domNode),function(_1d){_1b.push("<column>",_1d.value,"</column>");});_1b.push(_1e(_1c));_1b.push(m.getDomNode(dom,"product_code"));if(_1a){_1b.push("</",_1a,">");}return _1b.join("");}});d.ready(function(){m._config.clearOnSecondCall=false;});function _3(){var _1f=dj.byId("delimiter"),_20=dj.byId("delimiter_text"),_21=d.byId("delimiter_text_div");if(_1f.get("value")==="OTHER"){_22(_21);}else{_e(_21);_20.set("value","");}};function _6(){var _23=dj.byId("avail_mapped_columns_list_nosend"),_24=dj.byId("user_list"),_25=_23.domNode.selectedIndex,_26,_27;if(_25===-1){return;}else{while(_25!=-1){_26=_23.domNode[_25];_27=_26.value;if(_27!="ignored_column"){d.byId("user_list").appendChild(_26);}else{var c=dojo.doc.createElement("option");c.innerHTML=_26.innerHTML;c.value=_27;c.className=_26.className;c.text=_26.text;d.byId("user_list").appendChild(c);_23.domNode[_25].selected=false;}m._config.mappedColumns[_27].dataType=m._config.arrColumn[_27][0];m._config.mappedColumns[_27].key=m._config.arrColumn[_27][1];_25=_23.domNode.selectedIndex;}}};function _7(){var _28=dj.byId("avail_mapped_columns_list_nosend"),_29=dj.byId("user_list"),_2a=d.byId("column_start_length_div"),_2b=d.byId("column_amount_format_div"),_2c=d.byId("column_date_format_div"),_2d=_29.domNode.selectedIndex,_2e,_2f;if(_2d==-1){return;}else{_2e=_29.domNode.options[_2d];_2f=_2e.value;}if(_2f.indexOf("ignored_column")===-1){_28.addSelected(_29);}else{_29.containerNode.remove(_2d);}_30(_2a);_30(_2b);_30(_2c);};function _4(){var _31=dj.byId("start"),_32=dj.byId("format_length"),_33=dj.byId("date_format_select"),_34=dj.byId("date_format_other"),_35=dj.byId("amount_format_select"),_36=dj.byId("amount_format_other"),_37=d.byId("column_start_length_div"),_38=d.byId("column_amount_format_div"),_39=d.byId("column_date_format_div"),_3a=d.byId("unit_code_div"),_3b=d.byId("payment_term_code_div"),_3c=d.byId("fscm_programme_code_div"),_3d=this.containerNode.options.selectedIndex,_3e,_3f,_40;if(_3d==-1){_30(_37);_e(_38);_e(_39);return;}else{_3e=this.domNode.options[_3d];_3f=_3e.value;_40=m._config.mappedColumns[_3f];}if(dj.byId("mapping_fixed")&&dj.byId("mapping_fixed").get("checked")){_41(_37);}else{_30(_37);}if(_40){_31.set("value",_40.start);_32.set("value",_40.formatLength);_33.set("value",_40.dateFormat);_34.set("value",_40.dateFormatText);_35.set("value",_40.amountFormat);_36.set("value",_40.amountFormatText);_42(_40.dataType);}};function _5(){var _43=this.get("name"),_44=dj.byId("user_list"),_45=dj.byId("start"),_46=_44.domNode.selectedIndex,_47,_48,_49;if(_46==-1){return;}else{_47=_44.domNode.options[_46];_48=_47.value;_49=m._config.mappedColumns[_48];}if(_49){switch(_43){case "start":_49.start=this.get("value");break;case "format_length":_49.formatLength=this.get("value");break;case "date_format_select":_49.dateFormat=this.get("value");_4a(this);break;case "date_format_other":_49.dateFormatText=this.get("value");break;case "amount_format_select":if(this.get("value")!==""){_49.amountFormat=this.get("value");}else{dijit.byId("delimiter").onChange();}_4a(this);break;case "amount_format_other":_49.amountFormatText=this.get("value");break;default:undefined;break;}}};function _42(_4b){var _4c=d.byId("column_amount_format_div"),_4d=d.byId("column_date_format_div"),_4e=dj.byId("user_list"),_4f=_4e.domNode.selectedIndex,_50=_4e.domNode.options[_4f],_51=_50.value;if(_4b==="Date"){_22(_4d);_e(_4c);dj.byId("date_format_select").onChange();}else{if(_4b==="Number"&&_51!=="line_item_qty_val"&&_51!=="payment_term_nb_days"){_22(_4c);_e(_4d);dj.byId("amount_format_select").onChange();}else{_e(_4c);_e(_4d);}}};function _4a(_52){var _53=d.byId(_52.get("name")+"_other_div");if(_52.get("name")==="date_format_select"){if(_52.get("value")==="OTHER"){dojo.removeClass(_53,"hide");}else{d.addClass(_53,"hide");}}else{if(_52.get("name")==="amount_format_select"){if(_52.get("value")==="OTHER"){d.removeClass(_53,"hide");}else{d.addClass(_53,"hide");}}}};function _1(){var _54;if(dj.byId("name")){_54=dj.byId("name");}if(_54&&(_54.get("value")!=="")&&(!m.checkUploadTemplateNameExists())){var _55=m.getLocalization("uploadTemplateNameExists",[_54.get("value")]);_54.focus();_54.set("state","Error");dj.hideTooltip(_54.domNode);dj.showTooltip(_55,_54.domNode,0);}};function _2(){var _56=d.byId("column_start_length_div"),_57=dj.byId("user_list"),_58=_57.domNode.selectedIndex,_59=d.byId("delimiter_select_div"),_5a=d.byId("delimiter_text_div");if(this.get("checked")===true){if(this.get("value")==="fixed"){if(_58!==-1){_41(_56);}else{_30(_56);}_e(_59);_e(_5a);}else{if(this.get("value")==="delimited"){_30(_56);_22(_59);if(m._config.clearOnSecondCall){dj.byId("delimiter").set("value","");dj.byId("delimiter_text").set("value","");}m._config.clearOnSecondCall=true;}}}};function _f(){var _5b=dj.byId("avail_mapped_columns_list_nosend"),_5c=dj.byId("user_list");d.forEach(_5b.domNode.options,function(_5d){if(m._config.arrColumn[_5d.value]&&m._config.arrColumn[_5d.value][1]===true){_5d.className="ipUploadTemplateMandatoryColumn";}});d.forEach(_5c.domNode.options,function(_5e){if(m._config.arrColumn[_5e.value]&&m._config.arrColumn[_5e.value][1]===true){_5e.className="ipUploadTemplateMandatoryColumn";}});};function _a(){var _5f=dj.byId("user_list"),_60=_5f.domNode.selectedIndex,_61,_62;if(_60!==-1){_61=_5f.domNode.options[_60];_62=_61.value;}if(this.id==="move_column_up_img"){if(_60===-1||_60===0){return;}_5f.containerNode.remove(_60);if(dojo.isIE){_5f.containerNode.add(_61,_60-1);}else{_5f.containerNode.add(_61,_5f.domNode.options[_60-1]);}}else{if(this.id==="move_column_down_img"){if(_60===-1||_60===_5f.domNode.length-1){return;}_5f.containerNode.remove(_60);if(_60>_5f.domNode.length){_5f.containerNode.appendChild(_61);}else{if(dojo.isIE){_5f.containerNode.add(_61,_60+1);}else{_5f.containerNode.add(_61,_5f.domNode.options[_60+1]);}}}}};function _e(div){d.removeClass(div,"inlineBlock");d.addClass(div,"hide");};function _22(div){d.removeClass(div,"hide");d.addClass(div,"inlineBlock");};function _30(div){d.removeClass(div,"inline-group");d.addClass(div,"hide");};function _41(div){d.removeClass(div,"hide");d.addClass(div,"inline-group");};function _1e(_63){var _64=[];d.forEach(d.query("option",_63.domNode),function(_65){_64.push("<",_65.value,"_key>",m._config.mappedColumns[_65.value].key,"</",_65.value,"_key>");_64.push("<",_65.value,"_type>",m._config.mappedColumns[_65.value].dataType,"</",_65.value,"_type>");_64.push("<",_65.value,"_start>",m._config.mappedColumns[_65.value].start,"</",_65.value,"_start>");_64.push("<",_65.value,"_length>",m._config.mappedColumns[_65.value].formatLength,"</",_65.value,"_length>");_64.push("<",_65.value,"_minlength>",m._config.mappedColumns[_65.value].minLength,"</",_65.value,"_minlength>");_64.push("<",_65.value,"_maxlength>",m._config.mappedColumns[_65.value].maxLength,"</",_65.value,"_maxlength>");if(m._config.mappedColumns[_65.value].dataType==="Date"){_64.push("<",_65.value,"_format>",m._config.mappedColumns[_65.value].dateFormat,"</",_65.value,"_format>");_64.push("<",_65.value,"_format_text>",m._config.mappedColumns[_65.value].dateFormatText,"</",_65.value,"_format_text>");}else{if(m._config.mappedColumns[_65.value].dataType==="Number"){_64.push("<",_65.value,"_format>",m._config.mappedColumns[_65.value].amountFormat,"</",_65.value,"_format>");_64.push("<",_65.value,"_format_text>",m._config.mappedColumns[_65.value].amountFormatText,"</",_65.value,"_format_text>");}}});return _64.join("");};function _17(){var _66=dj.byId("avail_mapped_columns_list_nosend"),_67=[],_68=true;d.forEach(d.query("option",_66.domNode),function(_69){if(m._config.arrColumn[_69.value]&&m._config.arrColumn[_69.value][1]===true){_67.push(_69.value);}});if(_67.length>0){_68=false;displayMessage=misys.getLocalization("selectAllUploadTemplateKeyColumns");dj.hideTooltip(_66.domNode);dj.showTooltip(displayMessage,_66.domNode,0);}else{dj.hideTooltip(_66.domNode);}return _68;};function _6a(){var _6b=dj.byId("user_list");if(_6b){if((_6b.get("value").indexOf("payment_term_cur_code")!=-1&&_6b.get("value").indexOf("payment_term_amt")!=-1&&_6b.get("value").indexOf("payment_term_pct")===-1)){m._config.arrColumn["payment_term_pct"][1]=false;}else{if(_6b.get("value").indexOf("payment_term_pct")!=-1&&_6b.get("value").indexOf("payment_term_cur_code")===-1&&_6b.get("value").indexOf("payment_term_amt")===-1){m._config.arrColumn["payment_term_cur_code"][1]=false;m._config.arrColumn["payment_term_amt"][1]=false;}}}};function _19(){var _6c=dj.byId("user_list"),_6d=true,_6e=dj.byId("start"),_6f=dj.byId("format_length"),_70=dj.byId("date_format_select"),_71=dj.byId("amount_format_select"),_72=dj.byId("date_format_other"),_73=dj.byId("amount_format_other"),_74=false;d.some(d.query("option",_6c.domNode),function(_75,_76){var _77=[];if("S"+m._config.mappedColumns[_75.value].start==="S"){_77.push(_6e);_74=true;_6d=false;}if("S"+m._config.mappedColumns[_75.value].length==="S"){_77.push(_6f);_74=true;_6d=false;}if(m._config.mappedColumns[_75.value].dataType==="Date"){if("S"+m._config.mappedColumns[_75.value].dateFormat==="S"){_77.push(_70);_74=true;_6d=false;}else{if(m._config.mappedColumns[_75.value].dateFormat==="OTHER"&&("S"+m._config.mappedColumns[_75.value].dateFormatText==="S")){_77.push(_72);_74=true;_6d=false;}}}else{if(m._config.mappedColumns[_75.value].dataType==="Number"){if("S"+m._config.mappedColumns[_75.value].amountFormat==="S"){_77.push(_71);_74=true;_6d=false;}else{if(m._config.mappedColumns[_75.value].amountFormat==="OTHER"&&("S"+m._config.mappedColumns[_75.value].amountFormatText==="S")){_77.push(_73);_74=true;_6d=false;}}}}if(_74){dj.byId("user_list").domNode.options.selectedIndex=_76;dj.byId("user_list").onClick();m.markErrorFields(_77);}return _74;});return _6d;};})(dojo,dijit,misys);dojo.require("misys.client.binding.openaccount.simplified_upload_ip_template_client");}