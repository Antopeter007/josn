dojo.provide("misys.binding.openaccount.create_so");
/*
 ----------------------------------------------------------
 Event Binding for

   Purchase Advice Order (PO) Form, Customer Side.

 Copyright (c) 2000-2009 Misys (http://www.misys.com),
 All Rights Reserved. 

 version:   1.0
 date:      12/09/08
 ----------------------------------------------------------
 */
dojo.require("dojo.parser");
dojo.require("dijit.layout.BorderContainer");
dojo.require("misys.widget.Dialog");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.TextBox");
dojo.require("dojo.data.ItemFileWriteStore");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.DateTextBox");
dojo.require("dijit.form.CurrencyTextBox");
dojo.require("dijit.form.NumberTextBox");
dojo.require("dijit.form.CheckBox");
dojo.require("dijit.form.FilteringSelect");
dojo.require("dijit.form.Form");
dojo.require("dijit.layout.ContentPane");
dojo.require("dijit.layout.TabContainer");
dojo.require("dojo.io.iframe"); 
dojo.require("dijit.ProgressBar");
dojo.require("dojo.behavior");
dojo.require("dojo.date.locale");
dojo.require("dijit.Tooltip");


dojo.require("misys.openaccount.FormOpenAccountEvents");//keep this as the first require
dojo.require("misys.openaccount.widget.LineItems");
dojo.require("misys.openaccount.widget.LineItem");
dojo.require("misys.openaccount.widget.ProductIdentifiers");
dojo.require("misys.openaccount.widget.ProductIdentifier");
dojo.require("misys.openaccount.widget.ProductCategories");
dojo.require("misys.openaccount.widget.ProductCategory");
dojo.require("misys.openaccount.widget.ProductCharacteristics");
dojo.require("misys.openaccount.widget.ProductCharacteristic");
dojo.require("misys.openaccount.widget.Adjustments");
dojo.require("misys.openaccount.widget.Adjustment");
dojo.require("misys.openaccount.widget.PaymentTerms");
dojo.require("misys.openaccount.widget.PaymentTerm");
dojo.require("misys.openaccount.widget.Taxes");
dojo.require("misys.openaccount.widget.Tax");
dojo.require("misys.openaccount.widget.AirTransports");
dojo.require("misys.openaccount.widget.SeaTransports");
dojo.require("misys.openaccount.widget.RoadTransports");
dojo.require("misys.openaccount.widget.RailTransports");
dojo.require("misys.openaccount.widget.TakingInTransports");
dojo.require("misys.openaccount.widget.PlaceTransports");
dojo.require("misys.openaccount.widget.FinalDestinationTransports");
dojo.require("misys.openaccount.widget.Transport");
dojo.require("misys.openaccount.widget.FreightCharges");
dojo.require("misys.openaccount.widget.FreightCharge");
dojo.require("misys.openaccount.widget.Incoterms");
dojo.require("misys.openaccount.widget.Incoterm");
dojo.require("misys.openaccount.widget.ContactDetails");
dojo.require("misys.openaccount.widget.ContactDetail");
dojo.require("misys.openaccount.widget.SUserInformations");
dojo.require("misys.openaccount.widget.SUserInformation");
dojo.require("misys.openaccount.widget.BUserInformations");
dojo.require("misys.openaccount.widget.BUserInformation");

dojo.require("misys.grid.DataGrid");
dojo.require("misys.form.SimpleTextarea");
dojo.require("misys.form.common");
dojo.require("misys.validation.common");
dojo.require("misys.layout.FloatingPane");



(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	// insert private functions & variables

	// Public functions & variables follow
	d.mixin(m, {
		bind : function() {

		},

		onFormLoad : function() {
			//  summary:
			//          Events to perform on page load.
			//  tags:
			//         public
			
			// Show/hide other parties section
		
			var displayOtherParties = dj.byId('display_other_parties');
			if(displayOtherParties) {
				m.showHideOtherParties();
			}
			
			m.computePOTotalAmount();
					
//			m.managePOCurrency();
		
		},
		
		beforeSubmitValidations : function(){
			return true;
		}
		
	});
})(dojo, dijit, misys);
//Including the client specific implementation
       dojo.require('misys.client.binding.openaccount.create_so_client');