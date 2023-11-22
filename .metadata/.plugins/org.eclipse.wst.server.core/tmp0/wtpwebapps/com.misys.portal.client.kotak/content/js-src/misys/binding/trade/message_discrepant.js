dojo.provide("misys.binding.trade.message_discrepant");

dojo.require("misys.form.common");
dojo.require("misys.validation.common");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.CheckBox");
dojo.require("dijit.layout.ContentPane");
dojo.require("dojo.data.ItemFileReadStore");
dojo.require("misys.form.SimpleTextarea");
dojo.require("dijit.form.DateTextBox");
dojo.require("dijit.form.FilteringSelect");
dojo.require("dijit.layout.TabContainer");
dojo.require("dijit.form.DateTextBox");
dojo.require("misys.form.CurrencyTextBox");
dojo.require("dijit.form.NumberTextBox");
dojo.require("misys.form.file");
dojo.require("misys.widget.Collaboration");


(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode
	
	// Private functions and variables go here
	// dojo.subscribe once a record is deleted from the grid
    var _deleteGridRecord = "deletegridrecord";
		
	d.mixin(m._config, {

		initReAuthParams : function() {
									
			var reAuthParams = {
				productCode : 'LC',	
				subProductCode : '',
				transactionTypeCode : "13",	
				entity :dj.byId("entity") ? dj.byId("entity").get("value") : "",
				currency : dj.byId("lc_cur_code").get('value'),				
				amount : m.trimAmount(dj.byId("lc_amt").get('value')),
								
				es_field1 : m.trimAmount(dj.byId("lc_amt").get('value')),
				es_field2 : ''				
			};
			return reAuthParams;
		}
	});
	
	// Public functions & variables follow
	d.mixin(m, {

		onFormLoad : function() {
			
			var mainBankAbbvName = dj.byId("issuing_bank_abbv_name").get('value');
			var isMT798Enable = m._config.customerBanksMT798Channel[mainBankAbbvName] === true && dj.byId("adv_send_mode").get("value") === "01";
			if(isMT798Enable)
			{
				if(!m.hasAttachments())
				{
					m.animate("fadeIn", d.byId("bankInst"));
					dj.byId("delivery_channel").set("disabled", true);
				}
				else
				{
					m.animate("fadeIn", d.byId("bankInst"));
					if(dj.byId("delivery_channel"))
					{
						m.toggleFields(true, null, ["delivery_channel"], false, false);
					}
				}
				if (dj.byId("delivery_channel")){
					m.connect("delivery_channel", "onChange",  function(){
						if(dj.byId('attachment-file'))
						{
							if(dj.byId("delivery_channel").get('value') === 'FACT')
							{
								dj.byId('attachment-file').displayFileAct(true);
							}
							else
							{
								dj.byId('attachment-file').displayFileAct(false);
							}
						}
					});
					dj.byId("delivery_channel").onChange();
				}
			}
			else
			{
				m.animate("fadeOut", d.byId("bankInst"));
			}
			
			 var handle = dojo.subscribe(_deleteGridRecord, function(){
				 m.toggleFields(m._config.customerBanksMT798Channel[dj.byId("issuing_bank_abbv_name").get('value')] === true && m.hasAttachments(), null, ["delivery_channel"], false, false);
			 });
			 var disposalInstNotif = dj.byId('disposal_instruction_notification').get("value");
			 if(dojo.byId("free_format_text_row")){
				 dojo.place("<p style='width: 305px;font-size: 14px;margin-left: 245px;font-weight: bold'> "+ disposalInstNotif + "</p>", "free_format_text_row", "first");
			}
		},
	
		beforeSaveValidations : function(){
			return m.validateDisposalInst();
		 },
		 
		 beforeSubmitValidations : function(){
			 return m.validateDisposalInst();
		 },
		 
		 validateDisposalInst : function(){
			 var discrepencyAccept = dj.byId("disposal_instruction_accept");
			 var discrepencyReject = dj.byId("disposal_instruction_hold");
			 
				if(discrepencyAccept && discrepencyReject && discrepencyAccept.get('value') === false && discrepencyReject.get('value') === false)
				{
					m.dialog.show("ERROR", m.getLocalization("mandatoryDisposalInstMessage"));
					m._config.onSubmitErrorMsg = m.getLocalization("mandatoryDisposalInstMessage");
					return false;
				}else{
					return true;
				}
			}
	 
	});

})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.trade.message_discrepant_client');