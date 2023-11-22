/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["dojox.grid.enhanced.plugins.IndirectSelection"]){dojo._hasResource["dojox.grid.enhanced.plugins.IndirectSelection"]=true;dojo.provide("dojox.grid.enhanced.plugins.IndirectSelection");dojo.require("dojo.string");dojo.require("dojox.grid.cells.dijit");dojo.require("dojox.grid.enhanced._Plugin");dojo.declare("dojox.grid.enhanced.plugins.IndirectSelection",dojox.grid.enhanced._Plugin,{name:"indirectSelection",constructor:function(){var _1=this.grid.layout;this.connect(_1,"setStructure",dojo.hitch(_1,this.addRowSelectCell,this.option));},addRowSelectCell:function(_2){if(!this.grid.indirectSelection||this.grid.selectionMode=="none"){return;}var _3=false,_4=["get","formatter","field","fields"],_5={type:dojox.grid.cells.MultipleRowSelector,name:"",width:"30px",styles:"text-align: center;"};if(_2.headerSelector){_2.name="";}if(this.grid.rowSelectCell){this.grid.rowSelectCell.destroy();}dojo.forEach(this.structure,function(_6){var _7=_6.cells;if(_7&&_7.length>0&&!_3){var _8=_7[0];if(_8[0]&&_8[0].isRowSelector){_3=true;return;}var _9,_a=this.grid.selectionMode=="single"?dojox.grid.cells.SingleRowSelector:dojox.grid.cells.MultipleRowSelector;_9=dojo.mixin(_5,_2,{type:_a,editable:false,notselectable:true,filterable:false,navigatable:true,nosort:true});dojo.forEach(_4,function(_b){if(_b in _9){delete _9[_b];}});if(_7.length>1){_9.rowSpan=_7.length;}dojo.forEach(this.cells,function(_c,i){if(_c.index>=0){_c.index+=1;}else{console.warn("Error:IndirectSelection.addRowSelectCell()-  cell "+i+" has no index!");}});var _d=this.addCellDef(0,0,_9);_d.index=0;_8.unshift(_d);this.cells.unshift(_d);this.grid.rowSelectCell=_d;_3=true;}},this);this.cellCount=this.cells.length;},destroy:function(){if(this.grid&&this.grid.rowSelectCell){this.grid.rowSelectCell.destroy();delete this.grid.rowSelectCell;}this.inherited(arguments);}});dojo.declare("dojox.grid.cells.RowSelector",dojox.grid.cells._Widget,{inputType:"",map:null,disabledMap:null,isRowSelector:true,_connects:null,_subscribes:null,checkedText:"&#8730;",unCheckedText:"O",constructor:function(){this.map={};this.disabledMap={},this.disabledCount=0;this._connects=[];this._subscribes=[];this.inA11YMode=dojo.hasClass(dojo.body(),"dijit_a11y");this.baseClass="dojoxGridRowSelector dijitReset dijitInline dijit"+this.inputType;this.checkedClass=" dijit"+this.inputType+"Checked";this.disabledClass=" dijit"+this.inputType+"Disabled";this.checkedDisabledClass=" dijit"+this.inputType+"CheckedDisabled";this.statusTextClass=" dojoxGridRowSelectorStatusText";this._connects.push(dojo.connect(this.grid,"dokeyup",this,"_dokeyup"));this._connects.push(dojo.connect(this.grid.selection,"onSelected",this,"_onSelected"));this._connects.push(dojo.connect(this.grid.selection,"onDeselected",this,"_onDeselected"));this._connects.push(dojo.connect(this.grid.scroller,"invalidatePageNode",this,"_pageDestroyed"));this._connects.push(dojo.connect(this.grid,"onCellClick",this,"_onClick"));this._connects.push(dojo.connect(this.grid,"updateRow",this,"_onUpdateRow"));},formatter:function(_e,_f){var _10=this.baseClass;var _11=this.getValue(_f);var _12=!!this.disabledMap[_f];if(_11){_10+=this.checkedClass;if(_12){_10+=this.checkedDisabledClass;}}else{if(_12){_10+=this.disabledClass;}}if(window.isAccessibilityEnabled){var _13=(_11)?(this.inputType+" "+misys.getLocalization("checked")):(this.inputType+" "+misys.getLocalization("unchecked"));return ["<div tabindex = -1 ","id = '"+this.grid.id+"_rowSelector_"+_f+"' ","name = '"+this.grid.id+"_rowSelector' class = '"+_10+"' ","role = 'presentation' aria-checked = '"+_11+"' aria-disabled = '"+_12+"' aria-label = '"+dojo.string.substitute(this.grid._nls["indirectSelection"+this.inputType],[_f+1])+" "+_13+"' >","<span class = '"+this.statusTextClass+"'>"+(_11?this.checkedText:this.unCheckedText)+"</span>","<span class = 'sr-only' aria-live='polite' id='"+this.grid.id+"_rowSelector_"+_f+"live' />","</div>"].join("");}else{return ["<div tabindex = -1 ","id = '"+this.grid.id+"_rowSelector_"+_f+"' ","name = '"+this.grid.id+"_rowSelector' class = '"+_10+"' ","role = 'presentation' aria-pressed = '"+_11+"' aria-disabled = '"+_12+"' aria-label = '"+dojo.string.substitute(this.grid._nls["indirectSelection"+this.inputType],[_f+1])+"'>","<span class = '"+this.statusTextClass+"'>"+(_11?this.checkedText:this.unCheckedText)+"</span>","</div>"].join("");}},setValue:function(_14,_15){},getValue:function(_16){return this.grid.selection.isSelected(_16);},toggleRow:function(_17,_18){this._nativeSelect(_17,_18);},setDisabled:function(_19,_1a){if(_19<0){return;}this._toggleDisabledStyle(_19,_1a);},disabled:function(_1b){return !!this.disabledMap[_1b];},_onClick:function(e){if(e.cell===this){this._selectRow(e);}},_dokeyup:function(e){if(e.cellIndex==this.index&&e.rowIndex>=0&&e.keyCode==dojo.keys.SPACE){this._selectRow(e);}},focus:function(_1c){var _1d=this.map[_1c];if(_1d){_1d.focus();}},_focusEndingCell:function(_1e,_1f){var _20=this.grid.getCell(_1f);this.grid.focus.setFocusCell(_20,_1e);},_nativeSelect:function(_21,_22){this.grid.selection[_22?"select":"deselect"](_21);},_onSelected:function(_23){this._toggleCheckedStyle(_23,true);},_onDeselected:function(_24){this._toggleCheckedStyle(_24,false);},_onUpdateRow:function(_25){delete this.map[_25];},_toggleCheckedStyle:function(_26,_27){var _28=this._getSelector(_26);if(_28){dojo.toggleClass(_28,this.checkedClass,_27);if(this.disabledMap[_26]){dojo.toggleClass(_28,this.checkedDisabledClass,_27);}dijit.setWaiState(_28,"checked",_27);if(this.inA11YMode){dojo.attr(_28.firstChild,"innerHTML",_27?this.checkedText:this.unCheckedText);}if(dojo.query("#"+this.grid.id+"_rowSelector_"+_26+"live")&&dojo.query("#"+this.grid.id+"_rowSelector_"+_26+"live").length>0){var _29=(_27)?(this.inputType+" "+misys.getLocalization("checked")):(this.inputType+" "+misys.getLocalization("unchecked"));dojo.attr(dojo.query("#"+this.grid.id+"_rowSelector_"+_26)[0],"aria-label",dojo.string.substitute(this.grid._nls["indirectSelection"+this.inputType],[_26+1])+" "+_29);var _2a=dojo.query("#"+this.grid.id+"_rowSelector_"+_26+"live")[0];var _2b="";if(_27){_2b=this.inputType+" "+misys.getLocalization("checked");_2b=_2b+" "+dojo.string.substitute(this.grid._nls["indirectSelection"+this.inputType],[_26+1])+" "+misys.getLocalization("checked")+".";}else{_2b=this.inputType+" "+misys.getLocalization("unchecked");_2b=_2b+" "+dojo.string.substitute(this.grid._nls["indirectSelection"+this.inputType],[_26+1])+" "+misys.getLocalization("unchecked")+".";}dojo.attr(_2a,"innerHTML",_2b);}}},_toggleDisabledStyle:function(_2c,_2d){var _2e=this._getSelector(_2c);if(_2e){dojo.toggleClass(_2e,this.disabledClass,_2d);if(this.getValue(_2c)){dojo.toggleClass(_2e,this.checkedDisabledClass,_2d);}dijit.setWaiState(_2e,"disabled",_2d);}this.disabledMap[_2c]=_2d;if(_2c>=0){this.disabledCount+=_2d?1:-1;}},_getSelector:function(_2f){var _30=this.map[_2f];if(!_30){var _31=this.view.rowNodes[_2f];if(_31){_30=dojo.query(".dojoxGridRowSelector",_31)[0];if(_30){this.map[_2f]=_30;}}}return _30;},_pageDestroyed:function(_32){var _33=this.grid.scroller.rowsPerPage;var _34=_32*_33,end=_34+_33-1;for(var i=_34;i<=end;i++){if(!this.map[i]){continue;}dojo.destroy(this.map[i]);delete this.map[i];}},destroy:function(){for(var i in this.map){dojo.destroy(this.map[i]);delete this.map[i];}for(i in this.disabledMap){delete this.disabledMap[i];}dojo.forEach(this._connects,dojo.disconnect);dojo.forEach(this._subscribes,dojo.unsubscribe);delete this._connects;delete this._subscribes;}});dojo.declare("dojox.grid.cells.SingleRowSelector",dojox.grid.cells.RowSelector,{inputType:"Radio",_selectRow:function(e){var _35=e.rowIndex;if(this.disabledMap[_35]){return;}this._focusEndingCell(_35,0);this._nativeSelect(_35,!this.grid.selection.selected[_35]);},toggleAllSelection:function(_36){var _37=this.grid,_38=_37.selection;if(_36){_38.selectRange(0,_37.rowCount-1);}else{_38.deselectAll();}this.toggleAllTrigerred=true;var _39=this.grid.rowCount;for(var i=0;i<_39;i++){var _3a=this.grid.getItem(i);var _3b;if(_3a){_3b=this.grid.store.getValue(_3a,"disable_selection");}if(_3b==="Y"){this.grid.rowSelectCell.toggleRow(i,false);}}}});dojo.declare("dojox.grid.cells.MultipleRowSelector",dojox.grid.cells.RowSelector,{inputType:"CheckBox",swipeStartRowIndex:-1,swipeMinRowIndex:-1,swipeMaxRowIndex:-1,toSelect:false,lastClickRowIdx:-1,toggleAllTrigerred:false,unCheckedText:"&#9633;",constructor:function(){this._connects.push(dojo.connect(dojo.doc,"onmouseup",this,"_domouseup"));this._connects.push(dojo.connect(this.grid,"onRowMouseOver",this,"_onRowMouseOver"));this._connects.push(dojo.connect(this.grid.focus,"move",this,"_swipeByKey"));this._connects.push(dojo.connect(this.grid,"onCellMouseDown",this,"_onMouseDown"));if(this.headerSelector){this._connects.push(dojo.connect(this.grid.views,"render",this,"_addHeaderSelector"));this._connects.push(dojo.connect(this.grid,"onSelectionChanged",this,"_onSelectionChanged"));this._connects.push(dojo.connect(this.grid,"onKeyDown",this,function(e){if(e.rowIndex==-1&&e.cellIndex==this.index&&e.keyCode==dojo.keys.SPACE){this._toggletHeader();}}));}},toggleAllSelection:function(_3c){var _3d=this.grid,_3e=_3d.selection;if(_3c){_3e.selectRange(0,_3d.rowCount-1);}else{_3e.deselectAll();}this.toggleAllTrigerred=true;},_onMouseDown:function(e){if(e.cell==this){this._startSelection(e.rowIndex);dojo.stopEvent(e);}},_onRowMouseOver:function(e){this._updateSelection(e,0);},_domouseup:function(e){if(dojo.isIE){this.view.content.decorateEvent(e);}var _3f=e.cellIndex>=0&&this.inSwipeSelection()&&!this.grid.edit.isEditRow(e.rowIndex);if(_3f){this._focusEndingCell(e.rowIndex,e.cellIndex);}this._finishSelect();},_dokeyup:function(e){this.inherited(arguments);if(!e.shiftKey){this._finishSelect();}},_startSelection:function(_40){this.swipeStartRowIndex=this.swipeMinRowIndex=this.swipeMaxRowIndex=_40;this.toSelect=!this.getValue(_40);},_updateSelection:function(e,_41){if(!this.inSwipeSelection()){return;}var _42=_41!==0;var _43=e.rowIndex,_44=_43-this.swipeStartRowIndex+_41;if(_44>0&&this.swipeMaxRowIndex<_43+_41){this.swipeMaxRowIndex=_43+_41;}if(_44<0&&this.swipeMinRowIndex>_43+_41){this.swipeMinRowIndex=_43+_41;}var min=_44>0?this.swipeStartRowIndex:_43+_41;var max=_44>0?_43+_41:this.swipeStartRowIndex;for(var i=this.swipeMinRowIndex;i<=this.swipeMaxRowIndex;i++){if(this.disabledMap[i]||i<0){continue;}if(i>=min&&i<=max){this._nativeSelect(i,this.toSelect);}else{if(!_42){this._nativeSelect(i,!this.toSelect);}}}},_swipeByKey:function(_45,_46,e){if(!e||_45===0||!e.shiftKey||e.cellIndex!=this.index||this.grid.focus.rowIndex<0){return;}var _47=e.rowIndex;if(this.swipeStartRowIndex<0){this.swipeStartRowIndex=_47;if(_45>0){this.swipeMaxRowIndex=_47+_45;this.swipeMinRowIndex=_47;}else{this.swipeMinRowIndex=_47+_45;this.swipeMaxRowIndex=_47;}this.toSelect=this.getValue(_47);}this._updateSelection(e,_45);},_finishSelect:function(){this.swipeStartRowIndex=-1;this.swipeMinRowIndex=-1;this.swipeMaxRowIndex=-1;this.toSelect=false;},inSwipeSelection:function(){return this.swipeStartRowIndex>=0;},_nativeSelect:function(_48,_49){this.grid.selection[_49?"addToSelection":"deselect"](_48);},_selectRow:function(e){var _4a=e.rowIndex;if(this.disabledMap[_4a]){return;}dojo.stopEvent(e);this._focusEndingCell(_4a,0);var _4b=_4a-this.lastClickRowIdx;var _4c=!this.grid.selection.selected[_4a];if(this.lastClickRowIdx>=0&&!e.ctrlKey&&!e.altKey&&e.shiftKey){var min=_4b>0?this.lastClickRowIdx:_4a;var max=_4b>0?_4a:this.lastClickRowIdx;for(var i=min;i>=0&&i<=max;i++){this._nativeSelect(i,_4c);}}else{this._nativeSelect(_4a,_4c);}this.lastClickRowIdx=_4a;},getValue:function(_4d){if(_4d==-1){var g=this.grid;return g.rowCount>0&&g.rowCount<=g.selection.getSelectedCount();}return this.inherited(arguments);},_addHeaderSelector:function(){var _4e=this.view.getHeaderCellNode(this.index);if(!_4e){return;}dojo.empty(_4e);var g=this.grid;var _4f=_4e.appendChild(dojo.create("div",{"tabindex":-1,"id":g.id+"_rowSelector_-1","class":this.baseClass,"role":"presentation","innerHTML":"<span class = '"+this.statusTextClass+"'></span><span style='height: 0; width: 0; overflow: hidden; display: block;'>"+g._nls["selectAll"]+"</span>"}));this.map[-1]=_4f;var idx=this._headerSelectorConnectIdx;if(idx!==undefined){dojo.disconnect(this._connects[idx]);this._connects.splice(idx,1);}this._headerSelectorConnectIdx=this._connects.length;this._connects.push(dojo.connect(_4f,"onclick",this,"_toggletHeader"));this._onSelectionChanged();},_toggletHeader:function(){if(!!this.disabledMap[-1]){return;}this.grid._selectingRange=true;this.toggleAllSelection(!this.getValue(-1));this._onSelectionChanged();this.grid._selectingRange=false;},_onSelectionChanged:function(){var g=this.grid;if(!this.map[-1]||g._selectingRange){return;}this._toggleCheckedStyle(-1,this.getValue(-1));},_toggleDisabledStyle:function(_50,_51){this.inherited(arguments);if(this.headerSelector){var _52=(this.grid.rowCount==this.disabledCount);if(_52!=!!this.disabledMap[-1]){arguments[0]=-1;arguments[1]=_52;this.inherited(arguments);}}}});dojox.grid.EnhancedGrid.registerPlugin(dojox.grid.enhanced.plugins.IndirectSelection,{"preInit":true});}