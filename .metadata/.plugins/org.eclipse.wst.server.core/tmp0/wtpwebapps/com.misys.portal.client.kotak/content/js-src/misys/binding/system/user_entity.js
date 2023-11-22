dojo.provide("misys.binding.system.user_entity");

dojo.require("dijit.form.FilteringSelect");
dojo.require("misys.form.MultiSelect");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("misys.form.common");
dojo.require("misys.validation.common");
dojo.require("dojox.xml.DomParser");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode
	
	var
		_customerPermissionsOption = "CUSTOMER_PERMISSIONS_MAINTENANCE",
		
		_userStaticTypeNode = "static_user",
		
		_companyStaticTypeNode = "static_company";

	function _addEntityRecord(/*Dom*/ dom, /*String*/ nodeName) {
		//  summary:
		//          Create the entity record XML 

	 	var node = dom.getElementsByTagName(nodeName)[0],
	 		childNode = (node) ? node.childNodes[0] : "",
	 		entityArray = (childNode) ? childNode.nodeValue.split(",") : [],
	 		entityRecordXml = [];

	 	d.forEach(entityArray, function(entity){
	 		if(entity) {
	 			entityRecordXml.push("<entity_record><abbv_name>",
	 						entity, "</abbv_name></entity_record>");
	 		}
	 	});

	 	return entityRecordXml.join("");
	}

	// Public functions & variables follow
	d.mixin(m, {
		bind : function() {
			m.connect("add", "onClick", function(){
				m.addMultiSelectItems(dj.byId("user_list"), dj.byId("avail_list_nosend"));
			});
			m.connect("remove", "onClick", function(){
				m.addMultiSelectItems(dj.byId("avail_list_nosend"), dj.byId("user_list"));
			});
		}
	});
	
	// Add the XML transform function
	m._config = m._config || {};
	d.mixin(m._config, {
		xmlTransform : function(/*String*/ xml) {
			var 
				userList = dj.byId("user_list"),
				
				option = dj.byId("option").get("value"),
			
				// Whether we have a bank or customer screen
				staticTypeNode = 
					option === _customerPermissionsOption ? 
						_companyStaticTypeNode : _userStaticTypeNode,
						
				// Setup the root of the XML string
				xmlRoot = option === _customerPermissionsOption ? 
							"company_entity_record" : m._config.xmlTagName,
							
				containerNode = "user_entity_record",
	
				transformedXml = xmlRoot ? ["<", xmlRoot, ">"] : [],
	
				// Representation of existing XML
				dom = dojox.xml.DomParser.parse(xml);
			
			console.debug("[binding.user_entity] Transforming XML", xml);
				
			// Contents of the ${staticTypeNode} element
			transformedXml.push("<", containerNode, "><", staticTypeNode, ">");
			transformedXml.push(m.getDomNode(dom, "brch_code"));
			transformedXml.push(m.getDomNode(dom, "company_id"));
			transformedXml.push(m.getDomNode(dom, "company_abbv_name"));
			transformedXml.push(m.getDomNode(dom, "login_id"));
			transformedXml.push(m.getDomNode(dom, "user_id"));
			transformedXml.push("</", staticTypeNode, ">");
			
			// Format the role list
		    if(dom.getElementsByTagName("user_list").length > 0) {
		    	transformedXml.push(_addEntityRecord(dom, "user_list"));
		    }

		    transformedXml.push("</", containerNode, ">");
			if(xmlRoot) {
				transformedXml.push("</", xmlRoot, ">");
			}
			
			return transformedXml.join("");
		}
	});
	
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.system.user_entity_client');