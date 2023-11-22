dojo.provide("misys.binding.loan.deal_list");
dojo.require("dojo.data.ItemFileReadStore");
dojo.require("dijit.tree.ForestStoreModel"); 
dojo.require("dojox.grid.TreeGrid");
dojo.require("dojo.date.locale");
dojo.require("misys.grid._base");

/**
 * Loan Deal List Screen JS Binding  
 * 
 * @class deal_list
 * @param d
 * @param dj
 * @param m
 */

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {
	 
	"use strict"; // ECMA5 Strict Mode
	
    // private functions and variables go here
 
    // Public functions & variables follow
    d.mixin(m, {
 
    	/**
    	 * bind validations and connections
    	 * @method bind
    	 */
        bind : function() {
                   // event bindings go here
        	// handle click on a row
        	m.connect(facilitiesGrid, "onRowClick", function(event) {
        		m.grid.redirect(event);
        	});

        	// append the grid to the facilities div
        	d.byId('facilities').appendChild(facilitiesGrid.domNode);

        	//TODO Avengers work on this
        	//Check if this has to be moved into onformload
        	// render the grid
        	facilitiesGrid.startup();
        },
 
        /**
		 * On Form Load Events
		 * @method onFormLoad
		 */
        onFormLoad : function() {
                  // form onload events go here
        },
 
        /**
         * Before Submit Validations
         * 
         * @method beforeSubmitValidations
         */
        beforeSubmitValidations : function() {
                 // custom validations go here
        }
    });
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.loan.deal_list_client');