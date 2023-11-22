/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.openaccount.widget.InvoicePresentationPayments"]){dojo._hasResource["misys.openaccount.widget.InvoicePresentationPayments"]=true;dojo.provide("misys.openaccount.widget.InvoicePresentationPayments");dojo.experimental("misys.openaccount.widget.InvoicePresentationPayments");dojo.require("misys.openaccount.widget.Payments");dojo.require("misys.openaccount.widget.Payment");dojo.declare("misys.openaccount.widget.InvoicePresentationPayments",[misys.openaccount.widget.Payments],{layout:[{name:"Payment Type",get:misys.getPaymentType,width:"35%"},{name:"Ccy",field:"cur_code",width:"15%"},{name:"Amount/Rate",get:misys.getPaymentAmountRate,width:"40%"},{name:" ",field:"actions",formatter:misys.grid.formatReportActionsNoDelete,width:"10%"}]});}