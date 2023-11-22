dojo.provide("misys.binding.cash.TradeMessageXoBinding");
/*
 -----------------------------------------------------------------------------
 Scripts for
  
  Foreign Exchange (XO) Form, Customer Side.
  
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
dojo.require("dijit.form.TextBox");
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

//Mandatory fields required based on user operation. eg : Cancel => only "reason" is mandatory)
var tabIdRequiredUpdate = ['expiration_code','expiration_date','counter_cur_code','fx_cur_code','fx_amt','value_date','value_code'];
var tabIdRequiredCancel = ['reason'];

fncDoBinding = function(){
	//  summary:
    //            Binds validations and events to fields in the form.              
    //   tags:
    //            public
	
	fncCommonBindingRules();

    //
	// Other Events
	//
	misys.connect('sub_tnx_type_code', 'onChange', function(){
		_fncToggleAction(this.get('value'));
	});
};

fncDoFormOnLoadEvents = function(){
	//  summary:
    //          Events to perform on page load.
    //  tags:
    //         public
	if (dijit.byId('expiration_code').get('value') != "EXPDAT/TIM") {
		fncExpirationCodeChange();		
	}
	fncMarketOrderChange();
};

function _fncToggleAction(selectedValue){	
	
	misys.animate("fadeOut", dojo.byId('update-details'));
	misys.animate("fadeOut", dojo.byId('cancel-details'));
	//UPDATE
	if (selectedValue == '18')
	{		
		misys.animate("fadeIn", dojo.byId('update-details'));
		dojo.forEach(tabIdRequiredUpdate,function(field){
			misys.toggleRequired(field,true);			
		});		
		dojo.forEach(tabIdRequiredCancel,function(field){
			misys.toggleRequired(field,false);			
		});
	}
	//CANCEL
	else if (selectedValue == '22')
	{		
		dojo.forEach(tabIdRequiredUpdate,function(field){
			misys.toggleRequired(field,false);			
		});		
		dojo.forEach(tabIdRequiredCancel,function(field){
			misys.toggleRequired(field,true);			
		});
		misys.animate("fadeIn", dojo.byId('cancel-details'));		
	}
	else
	{
		dojo.forEach(tabIdRequiredUpdate,function(field){
			misys.toggleRequired(field,false);			
		});		
		dojo.forEach(tabIdRequiredCancel,function(field){
			misys.toggleRequired(field,false);			
		});
	}
}

//Including the client specific implementation
       dojo.require('misys.client.binding.cash.TradeMessageXoBinding_client');