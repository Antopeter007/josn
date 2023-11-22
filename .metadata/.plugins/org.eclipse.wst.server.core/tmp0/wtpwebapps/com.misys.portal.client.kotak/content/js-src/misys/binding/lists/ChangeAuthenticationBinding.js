dojo.provide("misys.binding.lists.ChangeAuthenticationBinding");
/*
 ----------------------------------------------------------
 Event Binding for

   List of Authentications

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

fncDoBinding = function(){
	//  summary:
    //            Loads resources, binds validations and events to fields in the form.              
    //   tags:
    //            public

    //
	// Events
	//
	
	//submitButton
	misys.connect('submitButton', 'onClick', function(){
		var firstName = dijit.byId('first_name').get('value') != '' ? dijit.byId('first_name').get('value') : '*';
		var lastName = dijit.byId('last_name').get('value') != '' ? dijit.byId('last_name').get('value') : '*';
		dijit.byId('full_name').set('value', firstName + lastName);
		misys.grid.filter(dijit.byId('authUserGrid'), ['NAME', 'LOGIN_ID'], ['full_name', 'loginId']);
	});
};

fncDoFormOnLoadEvents = function()
{
	//  summary:
    //          Events to perform on page load.
    //  tags:
    //         public

	fncGetCustomerGridData(dijit.byId('authUserGrid'), 'AUTHEN', ['first_name', 'last_name', 'loginId']);
};