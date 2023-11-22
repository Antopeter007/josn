dojo.provide("misys.binding.lists.ChangeAuthenticationBinding");
/*
 ----------------------------------------------------------
 Event Binding for

   *

 Copyright (c) 2000-2010 Misys (http://www.misys.com),
 All Rights Reserved. 

 version:   1.0
 date:      15/04/10
 ----------------------------------------------------------
 */
dojo.require('dijit.form.TextBox');
dojo.require('dijit.form.Button');
dojo.require('dojo.data.ItemFileReadStore');
dojo.require('dojox.grid.DataGrid');
dojo.require('misys.grid._base');
dojo.require('misys.common.Lists');
dojo.require('dojox.data.QueryReadStore');
dojo.require('dijit.form.DateTextBox');
dojo.require('dijit.form.NumberTextBox');
dojo.require('dijit.form.FilteringSelect');

fncDoBinding = function(){
	//  summary:
    //            Loads resources, binds validations and events to fields in the form.              
    //   tags:
    //            public

    //
	// Events
	//

	
};

fncDoFormOnLoadEvents = function()
{
	//  summary:
    //          Events to perform on page load.
    //  tags:
    //         public

	//fncGetCustomerGridData(dijit.byId('authUserGrid'), 'AUTHEN', ['first_name', 'last_name', 'loginId']);
};