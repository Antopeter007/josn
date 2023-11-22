dojo.provide("misys.binding.trade.upload_bk");
/*
 ----------------------------------------------------------
 Event Binding for

   Letter of Credit (LC) Form, Customer Side.

 Copyright (c) 2000-2010 Misys (http://www.misys.com),
 All Rights Reserved. 

 version:   1.0
 date:      12/09/08
 ----------------------------------------------------------
 */

dojo.require("dojo.parser");
dojo.require("dijit.layout.TabContainer");
dojo.require("dijit.form.DateTextBox");
dojo.require("misys.form.CurrencyTextBox");
dojo.require("dijit.form.NumberTextBox");
dojo.require("dijit.form.FilteringSelect");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.TextBox");
dojo.require("misys.widget.Dialog");
dojo.require("dijit.ProgressBar");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.CheckBox");
dojo.require("misys.form.PercentNumberTextBox");
dojo.require("misys.form.SimpleTextarea");
dojo.require("misys.widget.Collaboration");
dojo.require("misys.form.common");
dojo.require("misys.form.file");
dojo.require("misys.validation.common");
dojo.require("misys.common.FormLcEvents");
dojo.require("misys.form.BusinessDateTextBox");

		(function(/*Dojo*/d, /*Dijit*/dj, /*m*/m) {
			
				function _fncCheckForAttachments () {
		
			    //  summary:
			    //        Check which attachments have been added or deleted.
			    //  tags:
			    //        private
				
				console.debug("[FormEvents] Checking for lost attachments");
				var attIdsField = dj.byId("attIds");
				var numOfFiles = false;
				var count = 0;
				if(attIdsField)
				{
						var grids = [dj.byId("attachment-file"), dj.byId("attachment-fileOTHER")];
						d.forEach(grids, function(gridContainer){
							if(gridContainer &&  gridContainer.grid) {
								var arr = gridContainer.grid.store._arrayOfAllItems;
								d.forEach(arr, function(attachment, i){
									if(attachment !== null) {
										numOfFiles = true;
										count++;
									}
								});
							}
						});
				}
				m._config.onSubmitErrorMsg = m.getLocalization("mandatoryMinimumFileUploadTypeError");
				return numOfFiles;
			}
			d.mixin(m, {
				bind : function() {
			//  summary:
		    //            Binds validations and events to fields in the form.              
		    //   tags:
		    //            public
			
			m.setValidation("exp_date", m.validateTradeExpiryDate);
			m.setValidation("lc_cur_code", m.validateCurrency);
			m.connect("issuing_bank_abbv_name", "onChange", m.populateReferences);
			m.connect("issuing_bank_customer_reference", "onChange", m.setApplicantReference);
			if(dj.byId("issuing_bank_abbv_name"))
			{
				m.connect("entity", "onChange", function(){dj.byId("issuing_bank_abbv_name").onChange();});
			}
			
			m.connect("lc_cur_code", "onChange", function(){
				m.setCurrency(this, ["lc_amt"]);
			});
			m.connect("lc_amt", "onBlur", function(){
				m.setTnxAmt(this.get("value"));
			});
			
			// Optional EUCP flag 
			m.connect("eucp_flag", "onClick", function(){
				m.toggleFields(
						this.checked, 
						null,
						["eucp_details"]);
			});
		},
		
		onFormLoad : function() {
			//  summary:
		    //          Events to perform on page load.
		    //  tags:
		    //         public
		
			
		
			// Additional onload events for dynamic fields follow
			
			var eucpFlag = dj.byId("eucp_flag");
			if(eucpFlag)
			{
				m.toggleFields(
						eucpFlag.checked, 
						null,
						["eucp_details"]);
			}
			
			m.setCurrency(dj.byId("lc_cur_code"), ["lc_amt"]);
		
			var issuingBankAbbvName = dj.byId("issuing_bank_abbv_name");
			if(issuingBankAbbvName)
			{
				issuingBankAbbvName.onChange();
			}
			
			var issuingBankCustRef = dj.byId("issuing_bank_customer_reference");
			if(issuingBankCustRef)
			{
				issuingBankCustRef.onChange();
			}
		},
		
		
		
		beforeSubmitValidations : function(){
			
			return _fncCheckForAttachments();
			//return true;
			
		}
			});
				})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.trade.upload_bk_client');