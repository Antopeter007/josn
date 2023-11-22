dojo.provide("misys.binding.system.bank_company");

dojo.require("dijit.form.Form");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.CheckBox");
dojo.require("dijit.layout.ContentPane");
dojo.require("dijit.form.FilteringSelect");
dojo.require("misys.form.MultiSelect");
dojo.require("dojox.xml.DomParser");
dojo.require("misys.form.common");
dojo.require("misys.validation.common");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {
	
	"use strict"; // ECMA5 Strict Mode
	
	function _addBankDescRecord( /*String*/ dom,
					  			 /*String*/ nodeName) {
		//  summary: 
		//            Adds existing banks to the XML
		
		var node = dom.getElementsByTagName(nodeName)[0],
			childNode = (node) ? node.childNodes[0] : "",
			bankArray = (childNode) ? childNode.nodeValue.split(",") : [],
			banksXml = [];
			
		d.forEach(bankArray, function(bank){
			if(bank) {
				var abbvName = "";
				try{
					abbvName = bank.substring(0, bank.indexOf("(") - 1);
					banksXml.push("<bank_desc_record><abbv_name>", abbvName, "</abbv_name>");
					banksXml.push("<name>", bank, "</name></bank_desc_record>");
				} catch(e){}
			}
		});
		
		return banksXml.join("");
    }
	
	d.mixin(m, {
		bind : function() {
			m.connect("add", "onClick", function(){
				misys.addMultiSelectItems(dj.byId("bank_list"), dj.byId("avail_list_nosend"));
			});
			m.connect("remove", "onClick", function(){
				misys.addMultiSelectItems(dj.byId("avail_list_nosend"), dj.byId("bank_list"));
			});
		}
	});
	
	// Setup the XML transform function
	m._config = m._config || {};
	d.mixin(m._config, {
		xmlTransform : function(/*String*/ xml) {
			// summary:
			//		TODO
			
			var bankList = dj.byId("bank_list"),
			
				// Whether we have a bank or customer screen
				staticTypeNode = "static_company",
						
				// Setup the root of the XML string
				xmlRoot = m._config.xmlTagName,
				transformedXml = xmlRoot ? ["<", xmlRoot, ">"] : [],
	
				// Representation of existing XML
				dom = dojox.xml.DomParser.parse(xml);
			
			// Contents of the ${staticTypeNode} element
			transformedXml.push("<", staticTypeNode, ">");
			transformedXml.push(m.getDomNode(dom, "brch_code"));
			transformedXml.push(m.getDomNode(dom, "company_id"));
			transformedXml.push(m.getDomNode(dom, "abbv_name"));
			transformedXml.push(m.getDomNode(dom, "name"));
			transformedXml.push(m.getDomNode(dom, "address_line_1"));
			transformedXml.push(m.getDomNode(dom, "address_line_2"));
			transformedXml.push("</", staticTypeNode, ">");
			
			// Retrieve the existing banks
			if(dom.getElementsByTagName("bank_list").length > 0) {
				transformedXml.push(_addBankDescRecord(dom, "bank_list"));
			}
			if(xmlRoot) {
				transformedXml.push("</", xmlRoot, ">");
			}
			
			return transformedXml.join("");
		}
	});
})(dojo, dijit, misys);
//Including the client specific implementation
       dojo.require('misys.client.binding.system.bank_company_client');