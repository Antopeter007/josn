/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.binding.cash.ktp.bank.global_conventions"]){dojo._hasResource["misys.binding.cash.ktp.bank.global_conventions"]=true;dojo.provide("misys.binding.cash.ktp.bank.global_conventions");dojo.require("misys.binding.cash.ktp.common.ktp_common");(function(d,dj,m){d.ready(function(){var _1=m.searchGridLayout();if(_1){var _2=m.searchGridLayoutCellByFieldName(_1,"Attachment@file_name");d.mixin(_2,{formatter:function(_3,_4){return "<a href=\""+_3.href+"\" target=\"_blank\">"+_3.text+"</a>";}});}});})(dojo,dijit,misys);}