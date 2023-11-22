dojo.provide("misys.binding.cash.TradeCreateXoBinding");
/*
 -----------------------------------------------------------------------------
 Scripts for
  
  Foreign Exchange (FX) Form, Customer Side.
  
 Note: the function fncFormSpecificValidation is required

 Copyright (c) 2000-2010 Misys (http://www.misys.com),
 All Rights Reserved. 

 version:   1.1
 date:      22/09/10
 -----------------------------------------------------------------------------
 */
dojo.require("dojo.parser");
dojo.require("dojo.data.ItemFileReadStore");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.CheckBox");
dojo.require("dijit.form.DateTextBox");
dojo.require("dijit.form.TimeTextBox");
dojo.require("misys.form.CurrencyTextBox");
dojo.require("dijit.form.NumberTextBox");
dojo.require("dijit.form.FilteringSelect");
dojo.require("misys.widget.Dialog");
dojo.require("dijit.layout.ContentPane");
dojo.require("dijit.ProgressBar");
dojo.require("misys.form.common");
dojo.require("misys.validation.common");
dojo.require("misys.form.SimpleTextarea");
dojo.require("misys.form.DateTermField");
dojo.require("misys.binding.cash.XoActions");


fncDoBinding = function(){
	//  summary:
    //            Binds validations and events to fields in the form.              
    //   tags:
    //            public
	
	fncCommonBindingRules();

};

fncDoFormOnLoadEvents = function(){
	//  summary:
    //          Events to perform on page load.
    //  tags:
    //         public
	fncExpirationCodeChange();
	fncMarketOrderChange();
	dijit.byId('expiration_time').set('value', null);
	
	//Errors returned by the WebService
	if (dojo.byId('validationErrors')) 
	{
		var message='';
		dojo.query('.validationError').forEach(function(error){
			message += (error.innerHTML != 'null') ? misys.getLocalization(error.innerHTML) + "<br/>" : misys.getLocalization("technicalError");
		});
		misys.dialog.show('ERROR',message);
	}
};

//Including the client specific implementation
       dojo.require('misys.client.binding.cash.TradeCreateXoBinding_client');