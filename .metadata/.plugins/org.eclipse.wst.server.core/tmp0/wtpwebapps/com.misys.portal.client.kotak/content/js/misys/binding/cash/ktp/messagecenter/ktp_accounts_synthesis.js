/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.binding.cash.ktp.messagecenter.ktp_accounts_synthesis"]){dojo._hasResource["misys.binding.cash.ktp.messagecenter.ktp_accounts_synthesis"]=true;dojo.provide("misys.binding.cash.ktp.messagecenter.ktp_accounts_synthesis");dojo.require("misys.binding.cash.ktp.common.ktp_common");(function(d,dj,m){d.ready(function(){m.hideReportDescription();m.setGridCellFormatter();var _1=m.searchGridLayout();if(_1){var _2=m.searchGridLayoutCellByFieldName(_1,"COMPTE");d.mixin(_2,{formatter:misys.ibanFormatter});}});})(dojo,dijit,misys);}