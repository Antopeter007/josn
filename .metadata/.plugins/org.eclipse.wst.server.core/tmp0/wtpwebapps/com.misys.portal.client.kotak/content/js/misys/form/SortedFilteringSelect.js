/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.form.SortedFilteringSelect"]){dojo._hasResource["misys.form.SortedFilteringSelect"]=true;dojo.provide("misys.form.SortedFilteringSelect");dojo.experimental("misys.form.SortedFilteringSelect");dojo.require("dijit.form.FilteringSelect");dojo.declare("misys.form.SortedFilteringSelect",dijit.form.FilteringSelect,{postCreate:function(){this.inherited(arguments);this.fetchProperties={sort:[{attribute:"name"}]};}});}