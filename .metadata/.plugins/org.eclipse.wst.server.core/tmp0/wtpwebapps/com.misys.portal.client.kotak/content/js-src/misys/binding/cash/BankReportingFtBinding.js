dojo.provide("misys.binding.cash.BankReportingFtBinding");
/*
 -----------------------------------------------------------------------------
 Scripts for
  
  Fund Transfer (FT) Form, Bank Side
  
 Note: the function fncFormSpecificValidation is required

 Copyright (c) 2000-2010 Misys (http://www.misys.com),
 All Rights Reserved. 

 version:   1.0
 date:      19/03/08
 -----------------------------------------------------------------------------
 */
dojo.require("dijit.form.DateTextBox");
dojo.require("misys.form.CurrencyTextBox");
dojo.require("dijit.form.FilteringSelect");
dojo.require("misys.form.file");
dojo.require("misys.form.addons");
dojo.require("misys.form.SimpleTextarea");
dojo.require("dijit.layout.TabContainer");
dojo.require("dojo.data.ItemFileReadStore");
dojo.require("misys.form.common");
dojo.require("misys.validation.common");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.TextBox");
dojo.require("misys.widget.Dialog");
dojo.require("dijit.ProgressBar");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.CheckBox");
dojo.require("dijit.layout.ContentPane");
dojo.require("misys.widget.Collaboration");

fncDoBinding = function(){
    //  summary:
    //            Binds validations and events to fields in the form.              
    //   tags:
    //            public
	misys.setValidation('iss_date', misys.validateExecDate);
	misys.setValidation('ft_cur_code', misys.validateCurrency);
	misys.setValidation('input_cur_code', misys.validateCurrency);
	
	misys.connect('input_cur_code', 'onBlur', misys.initFTCounterparties);
	misys.connect('ft_cur_code', 'onChange', function(){
		misys.setCurrency(this, ['ft_amt']);
	});
	misys.connect('ft_amt', 'onBlur', function(){
		misys.setTnxAmt(this.get('value'));
	});
	
	misys.connect('prod_stat_code', 'onChange', misys.toggleProdStatCodeFields);
	misys.connect('prod_stat_code', 'onChange', function(){
		misys.toggleFields(
			(this.get('value') !== '' && this.get('value') !== '01' && this.get('value') !== '18'), 
			null,
			['iss_date', 'bo_ref_id' ,'action_req_code']);}
	);
};

fncDoFormOnLoadEvents = function(){
	//  summary:
    //          Events to perform on page load.
    //  tags:
    //         public

	// Additional onload events for dynamic fields follow
	misys.setCurrency(dijit.byId('ft_cur_code'), ['tnx_amt']);
};//Including the client specific implementation
       dojo.require('misys.client.binding.cash.BankReportingFtBinding_client');