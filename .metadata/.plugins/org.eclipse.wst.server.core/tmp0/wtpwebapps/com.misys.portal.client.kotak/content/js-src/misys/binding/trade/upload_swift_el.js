dojo.provide("misys.binding.trade.upload_swift_el");

dojo.require("dojo.data.ItemFileReadStore");
dojo.require("dijit.layout.TabContainer");
dojo.require("dijit.form.DateTextBox");
dojo.require("misys.form.CurrencyTextBox");
dojo.require("dijit.form.FilteringSelect");
dojo.require("misys.form.file");
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

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode
	var attFileOther ='attachment-fileOTHER';
	function _hasAttachments(){
	    //  summary:
	    //        Check if there are attachments in the form for a specific group
	    //  tags:
	    //        private
		
		var attachments = dj.byId(attFileOther),
			nb = 0,
			attachmentsArray;
		
		console.debug('[m.binding.bank.upload_swift_el] Checking for SWIFT attachments');
		
		if (!attachments) {
			m.showTooltip(m.getLocalization('noMT700Uploaded'), d.byId(attFileOther), ['below']);
			return false;
		} else {
			attachmentsArray = attachments.grid.store._arrayOfAllItems;
			for (var i = 0, len = attachmentsArray.length; i < len ; i++) {
				if (attachmentsArray[i]) {
					nb++;
				}
			}
			
			if(nb <= 0) {
				m.showTooltip(m.getLocalization('noMT700Uploaded'), d.byId(attFileOther), ['below']);
				m._config.onSubmitErrorMsg = m.getLocalization('attachmentsMissingError', [ "MT700" ]);
				return false;
			}
			
			return true;
		}
	}
	
	// Private functions and variables go here

	// Public functions & variables follow
	d.mixin(m, {

		bind : function() {
			m.connect("advising_bank_abbv_name", "onChange", m.populateReferences);
			m.connect("advising_bank_abbv_name", "onChange", m.updateBusinessDate);
			m.connect("advising_bank_customer_reference", "onChange",
					m.setApplicantReference);
			if(dj.byId("advising_bank_abbv_name"))
			{
				m.connect("entity", "onChange", function(){
					dj.byId("advising_bank_abbv_name").onChange();});
			}
			
			// Optional EUCP flag 
			m.connect("eucp_flag", "onClick", function(){
				m.toggleFields(
						this.get("checked"), 
						null,
						["eucp_details"]);
			});
		},

		onFormLoad : function() {
			var eucpFlag = dj.byId("eucp_flag");
			if(eucpFlag) {
				m.toggleFields(
						eucpFlag.get("checked"), 
						null,
						["eucp_details"]);
			}
			
			m.setCurrency(dj.byId("lc_cur_code"), ["lc_amt"]);

			var advisingBankAbbvName = dj.byId("advising_bank_abbv_name");
			if(advisingBankAbbvName) {
				advisingBankAbbvName.onChange();
			}
			
			var advisingBankCustRef = dj.byId("advising_bank_customer_reference");
			if(advisingBankCustRef) {
				advisingBankCustRef.onChange();
			}
		},

		beforeSubmitValidations : function(){
				
			if(dj.byId("advising_bank_abbv_name") && !m.validateApplDate(dj.byId("advising_bank_abbv_name").get("value")))
			{
				m._config.onSubmitErrorMsg = m.getLocalization('changeInApplicationDates');
				m.goToTop();
				return false;
	  		}
			return _hasAttachments();
		}
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.trade.upload_swift_el_client');