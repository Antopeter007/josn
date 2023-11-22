/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.openaccount.StringUtils"]){dojo._hasResource["misys.openaccount.StringUtils"]=true;dojo.provide("misys.openaccount.StringUtils");(function(d,dj,m){d.mixin(m,{replaceCarriageReturn:function(_1,_2){_1=escape(_1);for(var i=0;i<_1.length;i++){if(_1.indexOf("%0D%0A")>-1){_1=_1.replace("%0D%0A",_2);}else{if(_1.indexOf("%0A")>-1){_1=_1.replace("%0A",_2);}else{if(_1.indexOf("%0D")>-1){_1=_1.replace("%0D",_2);}}}}_1=unescape(_1);return _1;}});})(dojo,dijit,misys);}