/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.grid._View"]){dojo._hasResource["misys.grid._View"]=true;dojo.provide("misys.grid._View");dojo.experimental("misys.grid._View");dojo.require("dojox.grid._View");dojo.declare("misys.grid._View",[dojox.grid._View],{_getHeaderContent:function(_1){var _2="";if(_1.grid.showMoveOptions&&_1.field&&_1.field==="actions"){_2=["<div align='center'>"];_2=_2.concat(["<img src='"+misys.getContextualURL("/content/images/pic_arrowdown.gif")+"' alt='Move Down' border='0' type='moveDown'/>"],["&nbsp;"],["<img src='"+misys.getContextualURL("/content/images/pic_arrowup.gif")+"' alt='Move Up' border='0' type='moveUp'/>"],["</div>"]);return _2.join("");}else{var n=_1.name||_1.grid.getCellName(_1);_2=["<div class=\"dojoxGridSortNode"];if(_1.index!=_1.grid.getSortIndex()){_2.push("\">");}else{_2=_2.concat([" ",_1.grid.sortInfo>0?"dojoxGridSortUp":"dojoxGridSortDown","\"><div class=\"dojoxGridArrowButtonChar\">",_1.grid.sortInfo>0?"&#9650;":"&#9660;","</div><div class=\"dojoxGridArrowButtonNode\" role=\""+(dojo.isFF<3?"wairole:":"")+"presentation\"></div>"]);}_2=_2.concat([n,"</div>"]);return _2.join("");}}});}