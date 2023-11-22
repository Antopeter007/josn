dojo.provide("misys.binding.system.customer_reference");

dojo.require("dojo.parser");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.Button");
dojo.require("misys.widget.Dialog");
dojo.require("dijit.Tooltip");
dojo.require("misys.form.addons");
dojo.require("misys.form.common");
dojo.require("misys.validation.common");
dojo.require("dojo._base.json");
dojo.require("dojox.xml.DomParser");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode
	
	function _getCustomerDetails() {
		// summary:
		//		Look for information about customer reference (check action)
		
		var customerRef = dj.byId("customerReference_details_reference_nosend").get("value");
		if(customerRef) {
			m.xhrPost({
				url : m.getServletURL("/screen/AjaxScreen/action/CustomerDetailsSearchAction"),
				handleAs : "json",
				content : {
					customer_reference : customerRef
					//bank : todo
				},
				load : _showCheckField
			});
		}
	}
	
	function _showCheckField(/*Json*/ response) {
		// summary:
		//	Display information about customer reference
		
		var checkDiv = d.byId("checkField"),
			content = "";
		
		// TODO Should try to avoid building HTML in JavaScript via String manipuilation, use
		//		dojo.create instead, adding it to a container DIV and then inserting its 
		//		innerHTML into the page
		// TODO Also, what is the purpose of the <span> below? 
		
		d.forEach(response, function(refs) {
			d.forEach(refs, function(res, index) {
				if (index === 0) {
			    	content += "<span>" + res + "</span>";
			    }
			    else if (res) {
			    	content += "<br>" + res;
			    }
			});
			content += "<br><br>";
		});
		
		checkDiv.innerHTML = content;
		_showSaveButton();
		
		// TODO This is not localized, so the if guard will not work in other languages
		
		if(content !== "<span>No Customer Details Found</span><br><br>"){
			checkDiv.setAttribute("display", "inline-block");
		}
	}
	
	function _showSaveButton() {
		//	summary:
		//		Check if we have to display the save button
		
		if(dj.byId("customerDetailsEnabled").get("value") === "true") {
			
			// TODO This is not localized, so the guard will not work in other languages
			
			if (d.byId("checkField").innerHTML !== "<span>No Customer Details Found</span><br><br>" && 
					d.byId("checkField").innerHTML !== "" && 
					d.byId("customerReference_details_description_nosend").value !== "" && 
					d.byId("customerReference_details_reference_nosend").value !== ""){
				dj.byId("addCustomerReferenceButton").set("disabled", false);
			}
			else {
				dj.byId("addCustomerReferenceButton").set("disabled", true);
			}
		}
	}

	function _changeCustomerReference() {
		// summary:
		//		TODO
		
		// TODO This is an unnecessary function, in my opinion
		
		_clearCheckDiv();
		_showSaveButton();
	}

	function _exitCustomerReferenceDialog() {
		// summary:
		//		TODO
		
		_clearCustomerReferenceDialogFields();
		if(dj.byId("customerDetailsEnabled").get("value") === "true") {
			dj.byId("addCustomerReferenceButton").set("disabled", true);
		}
		misys.hideTransactionAddonsDialog("customerReference");
	}
	
	function _clearCheckDiv() {
		// summary:
		//		TODO
		
		var checkDiv = d.byId("checkField");
		if (checkDiv){
			checkDiv.innerHTML = "";
		}
	}
	
	function _clearCustomerReferenceDialogFields() {
		// summary: 
		//		TODO
		
		_clearCheckDiv();
		dj.byId("customerReference_details_description_nosend").set("value", "");
		dj.byId("customerReference_details_description_nosend").blur;
		dj.byId("customerReference_details_reference_nosend").set("value", "");
		dj.byId("customerReference_details_reference_nosend").blur;
	}

	// Public functions & variables follow
	d.mixin(m, {
		bind : function() {
			m.connect("checkCustomerReferenceButton", "onClick", _getCustomerDetails);
			m.connect("cancelCustomerReferenceButton", "onClick", _exitCustomerReferenceDialog);
			m.connect("customerReference_details_reference_nosend", "onBlur", _showSaveButton);
			m.connect("customerReference_details_reference_nosend", "onChange", _changeCustomerReference);
			m.connect("customerReference_details_description_nosend", "onBlur", _showSaveButton);
			m.connect("customerReference_details_description_nosend", "onChange", _showSaveButton);
			m.setValidation("abbv_name", m.validateCharacters);
		},
		
		addCustomerReference : function(/*String*/ customerReference) {
			if (misys.addTransactionAddon(customerReference)){
				_clearCustomerReferenceDialogFields();
			} else {
				if(dj.byId("customerDetailsEnabled").get("value") === "true") {
					dj.byId("addCustomerReferenceButton").set("disabled", true);
				}
			}
		},
		
		showCustomerReferenceDialog : function( /*String*/ type,
												/*Boolean*/ customerDetailsEnabled) {
			// summary:
			//		TODO
			
			if(dj.byId("customerDetailsEnabled").get("value") === "true") {
				if (!customerDetailsEnabled) {
					d.query("#customerReferenceDialog .field").forEach(function(field){
						 d.style(field, "display", "block");
					});
					dj.byId("addCustomerReferenceButton").set("disabled", false);
				}else {
					dj.byId("addCustomerReferenceButton").set("disabled", true);
				}
				_clearCustomerReferenceDialogFields();
			}
			m.showTransactionAddonsDialog(type);
		}
	});
	
	
	// Setup the XML transform function
	m._config = m._config || {};
	d.mixin(m._config, {
		xmlTransform : function(/*String*/ xml) {
			
			var xmlRoot = m._config.xmlTagName,
				transformedXml = xmlRoot ? ["<", xmlRoot, ">"] : [],
				banksArray = [],
				dom = dojox.xml.DomParser.parse(xml),
				docNode = dom.documentElement,
				xmlElementNode = "";

			for (var i = 0, len = docNode.childNodes.length; i < len; i++) {
				xmlElementNode = docNode.childNodes[i];
				//create individual bank_abbv_name element for each bank 
				if(xmlElementNode.nodeName && xmlElementNode.nodeName == "bank_abbv_name")
				{
					banksArray = (xmlElementNode.childNodes[0]) ? xmlElementNode.childNodes[0].nodeValue.split(",") : [];
					d.forEach(banksArray, function(bank){
						if(bank) {
							transformedXml.push("<", xmlElementNode.nodeName,">");
							transformedXml.push(bank);
							transformedXml.push("</", xmlElementNode.nodeName,">");	
						}
					});
				} else {
					transformedXml.push("<", xmlElementNode.nodeName,">");
					if(xmlElementNode.childNodes[0]) {
						transformedXml.push(xmlElementNode.childNodes[0].nodeValue);
					}
					transformedXml.push("</", xmlElementNode.nodeName,">");	
				}
			}
			transformedXml.push("</", xmlRoot, ">");	
			return transformedXml.join("");
		}
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.system.customer_reference_client');