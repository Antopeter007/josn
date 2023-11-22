dojo.provide("misys.binding.openaccount.utilize_po");
/*
 ----------------------------------------------------------
 Event Binding for

   Upload Invoice Presentation (IN) Form, Customer Side.

 Copyright (c) 2000-2011 Misys (http://www.misys.com),
 All Rights Reserved. 

 version:   1.0
 date:      24/07/11
 ----------------------------------------------------------
 */

dojo.require("dijit.layout.TabContainer");
dojo.require("dijit.layout.BorderContainer");
dojo.require("misys.widget.Dialog");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.TextBox");
dojo.require("dojo.data.ItemFileWriteStore");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.DateTextBox");
dojo.require("misys.form.CurrencyTextBox");
dojo.require("dijit.form.NumberTextBox");
dojo.require("dijit.form.CheckBox");
dojo.require("dijit.form.FilteringSelect");
dojo.require("dijit.form.Form");
dojo.require("dijit.layout.ContentPane");
dojo.require("misys.widget.Collaboration");

dojo.require("dojo.io.iframe"); 
dojo.require("dijit.ProgressBar");
dojo.require("dojo.behavior");
dojo.require("dojo.date.locale");
dojo.require("dijit.Tooltip");
dojo.require("dojo.parser");

dojo.require("misys.openaccount.FormOpenAccountEvents");
dojo.require("misys.grid.DataGrid");
dojo.require("misys.form.SimpleTextarea");
dojo.require("misys.form.addons");
dojo.require("misys.form.file");
dojo.require("misys.form.common");
dojo.require("misys.validation.common");
dojo.require("misys.layout.FloatingPane");
dojo.require("misys.openaccount.widget.Payments");
dojo.require("misys.openaccount.widget.UtilizePayments");
dojo.require("misys.openaccount.widget.Payment");





(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	// insert private functions & variables

	// Public functions & variables follow
	d.mixin(m, {
		bind : function() {

			//  summary:
		    //            Binds validations and events to fields in the form.              
		    //   tags:
		    //            public
			
			m.connect('payment_terms_type_1', 'onClick', m.onClickCheckPaymentTerms);
			m.connect('payment_terms_type_2', 'onClick', m.onClickCheckPaymentTerms);
			m.connect(dj.byId('details_code'), 'onChange', m.paymentDetailsChange);
			m.onClickCheckPaymentTerms();
			
		},

		onFormLoad : function() {
			//  summary:
			//          Events to perform on page load.
			//  tags:
			//         public
			
		},
		
		beforeSubmitValidations : function() {
			return true;
		}
		
	});
})(dojo, dijit, misys);
//Including the client specific implementation
       dojo.require('misys.client.binding.openaccount.utilize_po_client');