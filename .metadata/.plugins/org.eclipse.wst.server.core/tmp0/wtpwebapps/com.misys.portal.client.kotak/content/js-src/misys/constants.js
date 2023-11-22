dojo.provide("misys.constants");

// Copyright (c) 2000-2020 Finastra (http://www.finastra.com),
// All Rights Reserved. 
//
// summary: 
//    Constants provider
//
// description:
//    Placeholder to store all constants used within the Javascript layer.

(function(/*Dojo*/ d, /*Dijit*/ dj, /*Misys*/ m) {

	"use strict"; // ECMA5 Strict Mode
	
	//
	// Public functions
	//
	m.constants = m.constants || {};
	
	d.mixin(m.constants, {

		ALIGN_RIGHT_CLASS : "align-right"
		
	});

})(dojo, dijit, misys);
//Including the client specific implementation
dojo.require("misys.client.constants_client");