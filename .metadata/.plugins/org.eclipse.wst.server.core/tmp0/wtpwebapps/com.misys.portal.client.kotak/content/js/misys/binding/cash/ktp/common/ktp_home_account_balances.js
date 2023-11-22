/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.binding.cash.ktp.common.ktp_home_account_balances"]){dojo._hasResource["misys.binding.cash.ktp.common.ktp_home_account_balances"]=true;dojo.provide("misys.binding.cash.ktp.common.ktp_home_account_balances");dojo.require("misys.binding.cash.ktp.common.ktp_common");(function(d,dj,m){var _1=".dojoxGrid";d.mixin(m,{disactivateReloadForNonKTPGrids:function(){var _2=d.query(_1,d.byId("KTPHomeAccountSummaryListPortlet"));var _3=_2.length===1?_2[0].id:"";if(_3!==""){d.forEach(d.query(_1,d.byId("layout")),function(_4){if(_4.id!==_3){d.addClass(_4,"noReload");}});}},bind:function(){m.disactivateReloadForNonKTPGrids();var _5=d.query(_1,d.byId("KTPHomeAccountSummaryListPortlet"));var _6=_5.length===1?_5[0].id:"";if(_6!==""){var _7=dj.byId(_6).layout;var _8=m.searchGridLayoutCellByFieldName(_7,"COMPTE");d.mixin(_8,{formatter:misys.ibanFormatter});}}});})(dojo,dijit,misys);}