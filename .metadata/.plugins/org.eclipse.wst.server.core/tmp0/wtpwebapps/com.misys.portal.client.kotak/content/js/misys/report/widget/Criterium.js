/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.report.widget.Criterium"]){dojo._hasResource["misys.report.widget.Criterium"]=true;dojo.provide("misys.report.widget.Criterium");dojo.experimental("misys.report.widget.Criterium");dojo.require("dijit._Widget");dojo.require("dijit._Contained");dojo.require("misys.layout.SimpleItem");dojo.declare("misys.report.widget.Criterium",[dijit._Widget,dijit._Contained,misys.layout.SimpleItem],{column:"",column_type:"",operator:"",value_type:"",parameter:"",string_value:"",number_value:"",amount_value:"",date_value:"",values_set:"",default_string_value:"",default_number_value:"",default_amount_value:"",default_values_set:"",default_date_type:"",default_date_report_exec_date_offset:"",default_date_report_exec_date_offset_days:"",default_date_first_day_of_month_offset:"",default_date_first_day_of_month_offset_days:"",default_date_last_day_of_month_offset:"",default_date_last_day_of_month_offset_days:"",default_date_value:"",constructor:function(){}});}