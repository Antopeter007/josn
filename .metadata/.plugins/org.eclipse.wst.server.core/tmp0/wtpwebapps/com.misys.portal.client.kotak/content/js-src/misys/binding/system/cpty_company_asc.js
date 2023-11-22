dojo.provide("misys.binding.system.cpty_company_asc");

//
// Copyright (c) 2000-2011 Misys (http://www.m.com),
// All Rights Reserved. 
//
//
// Summary: 
//      Event Binding for counter party and customer association
//
// version:   1.2
// date:      08/04/11
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


(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode
	
	//
	// Private functions & variables
	//
	// Public functions & variables
	
	function _hideFields()
	{	
		var cptyCsompanyAscFieldsDiv = d.byId("cpty_cust_div");
		if (cptyCsompanyAscFieldsDiv)
		{
			m.animate("fadeOut", cptyCsompanyAscFieldsDiv);	
		}	
		dj.byId('cpty_company').set('value','');
	}
	
	// Add the XML transform function
	m._config = m._config || {};
	d.mixin(m._config, {
		
			xmlTransform : function(/*String*/ xml) {
				
				if(dj.byId("return_comments"))
				{
					console.debug("Before Transforming XML", xml);
					// Setup the root of the XML string
					var	transformedXml = ["<static_beneficiary>"];
					
					transformedXml.push("<return_comments>",dj.byId("return_comments").get("value"),"</return_comments>");
					transformedXml.push("</static_beneficiary>");
					console.debug("Transforming XML", transformedXml.join(""));
					return transformedXml.join("");
				}
				else
				{
					return xml;
				}
		}
	});
			
	//
	d.mixin(m, {
		bind : function() {
			m.connect("cpty_cust_code_2", "onClick", function(){
				var cptyCsompanyAscFieldsDiv = d.byId("cpty_cust_div");
				if (cptyCsompanyAscFieldsDiv)
				{
					m.animate("fadeIn", cptyCsompanyAscFieldsDiv);	
				}			
			});
			m.connect("cpty_cust_code_1", "onClick", function(){
				_hideFields();		
			});	
		},
		
		/*
		 * This function performs several events when page loads
		 * @method onFormLoad
		 */
		onFormLoad : function(){
			
			if(dj.byId('cpty_company') && dj.byId('cpty_company').get('value') === '')
			{
				dj.byId('cpty_cust_code_1').set('checked',true);
				_hideFields();
			}
			if(dj.byId('cpty_cust_code_2') && dj.byId('cpty_cust_code_2').get('value') !== '' && dj.byId('cpty_company') && dj.byId('cpty_company').get('value') !== '')
			{
				dj.byId('cpty_cust_code_1').set("readOnly", true);
				dj.byId('cpty_cust_code_2').set("readOnly", true);
			}
			if(dj.byId("tnx_stat_code") && dj.byId("tnx_stat_code").get("value") !== "" && dj.byId("tnx_stat_code").get("value") !== "54")
			{
				dj.byId("cpty_cust_code_1").set("readOnly", true);
				dj.byId("cpty_cust_code_2").set("readOnly", true);
				dj.byId("cpty_company").set("readOnly", true);
			}
		},

		
		 /* This function performs different validation on mandatory fields before submitting the form.
		 * @method beforeSubmitValidation
		 * @returns boolean(valid=true/false)
		 */
		beforeSubmitValidations : function() 
		{
			var isValid = true;
			if(dj.byId('cpty_cust_code_2').get('checked') && dj.byId('cpty_company').get('value') === '')
			{
				isValid = false;
				m._config.onSubmitErrorMsg =  m.getLocalization("companyMandatoryError");
			}
			return isValid;
		}
	});
})(dojo, dijit, misys);//Including the client specific implementation
dojo.require('misys.client.binding.system.cpty_company_asc_client');