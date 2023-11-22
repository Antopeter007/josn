dojo.provide("misys.binding.tma.create_tm_status_request");

//
// Copyright (c) 2000-2015 Misys (http://www.m.com),
// All Rights Reserved. 
//
//
// Summary: 
//      Event Binding for TM Console (LC) TM.
//
//

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
dojo.require("misys.form.SimpleTextarea");
dojo.require("misys.widget.Collaboration");
dojo.require("misys.form.common");
dojo.require("misys.form.file");
dojo.require("misys.validation.common");
dojo.require("misys.binding.SessionTimer");
dojo.require("misys.binding.trade.ls_common");
dojo.require("misys.openaccount.widget.EntitiesToBeReportedDetails");
dojo.require("misys.openaccount.widget.EntitiesToBeReportedDetail");


(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode
	
	//
	// Private functions & variables
	//

	//
	// Public functions & variables
	
	d.mixin(m._config, {
		
		xmlTransform : function (/*String*/ xml) {
			
			var xmlRoot = "<tu_tnx_record>",
			transformedXml = [],
					tuXMLEnd   = "</tu_tnx_record>",
					subEAXML	= "" ;
			transformedXml.push(xmlRoot);
			var xmlString = xml.substring(xml.indexOf("<tm_tnx_record>")+15 , xml.indexOf("</tm_tnx_record>"));
			transformedXml.push(xmlString);
			transformedXml.push(tuXMLEnd);
			
			return transformedXml.join("");		
			}		
	}
	);
	
	d.mixin(m, {
		bind : function() {
			m.connect("entity_bic","onBlur",function() {
				m.validateBpoBICFormat(dj.byId("entity_bic"));
			});
			/*m.connect(entity_bic, "onBlur", m.checkBICExistence);*/
		}, 
		
		onFormLoad : function() {
			//  summary:
		    //          Events to perform on page load.
			
		},
		/**
		 * This function performs different validation on mandatory fields before submitting the form.
		 * @method beforeSubmitValidation
		 * @returns boolean(valid=true/false)
		 */
		beforeSubmitValidations : function() {
			
			var entitiesReported = dj.byId('entities-to-be-reported-ds'),
			error_message = "";
			
			if(!entitiesReported || !entitiesReported.store || entitiesReported.store._arrayOfTopLevelItems.length <= 0)
			{
				error_message = misys.getLocalization("statusRequestReportError");
				m._config.onSubmitErrorMsg =  error_message;
				return false;
			}
			return true;
		}
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.tma.create_tm_status_request_client');