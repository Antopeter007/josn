dojo.provide("misys.binding.system.role");

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
dojo.require("dijit.form.FilteringSelect");
dojo.require("misys.form.MultiSelect");
dojo.require("dojox.xml.DomParser");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode
	
	var
		// 
		_authPrefixList = ["bank_auth_level", "company_auth_level"],
		
		_customerPermissionsOption = "CUSTOMER_PERMISSIONS_MAINTENANCE",
		
		_customerStaticTypeNode = "static_user",
		
		_bankStaticTypeNode = "static_company";

	
	function _addGroupRecord( /*DOM fragment*/ dom,
							  /*String*/ abbvNodeName,
							  /*String*/ nodeName) {
		// summary:
		//		Create an XML group record
		
		var abbvNode = dom.getElementsByTagName(abbvNodeName)[0],
			abbvChildNode = (abbvNode) ? abbvNode.childNodes[0] : "",
			abbvName = (abbvChildNode && abbvChildNode.nodeValue) ? abbvChildNode.nodeValue : "",
			node = dom.getElementsByTagName(nodeName)[0],
			childNode = (node) ? node.childNodes[0] : "",
			roleArray = (childNode && childNode.nodeValue) ? childNode.nodeValue.split(",") : [],
			groupRecordXml = ["<group_record><group_abbv_name>"];
		
		groupRecordXml.push(abbvName, "</group_abbv_name>");
		d.forEach(roleArray, function(role){
			if(role) {
				groupRecordXml.push("<existing_roles><role><name>");
				groupRecordXml.push(role);
				groupRecordXml.push("</name></role></existing_roles>");
			}
		});
		groupRecordXml.push("</group_record>");
		
		return groupRecordXml.join("");
	}

	// Setup the XML transform function
	m._config = m._config || {};
	d.mixin(m._config, {
		xmlTransform : function(/*String*/ xml) {
			var 
				// Whether we have a bank or customer screen
				staticTypeNode = 
					dj.byId("option").get("value") === _customerPermissionsOption ? 
						_customerStaticTypeNode : _bankStaticTypeNode,
						
				// Setup the root of the XML string
				xmlRoot = m._config.xmlTagName,
				transformedXml = xmlRoot ? ["<", xmlRoot, ">"] : [],
	
				// Representation of existing XML
				dom = dojox.xml.DomParser.parse(xml),
				
				// Array of possible multiSelect widgets; not all may be present
				multiSelects = 
					[dj.byId("company_role_list"), dj.byId("bank_role_list"),
					 dj.byId("company_auth_level"), dj.byId("bank_auth_level"),
					 dj.byId("entity_role_list"),dj.byId("entity_auth_level")],
					 
				authPrefix;
			
			console.debug("[binding.role] Transforming XML", xml);

			// Contents of the ${staticTypeNode} element
			transformedXml.push("<", staticTypeNode, ">");
			transformedXml.push(m.getDomNode(dom, "brch_code"));
			transformedXml.push(m.getDomNode(dom, "company_id"));
			transformedXml.push(m.getDomNode(dom, "abbv_name"));
			transformedXml.push(m.getDomNode(dom, "name"));
			transformedXml.push(m.getDomNode(dom, "address_line_1"));
			transformedXml.push(m.getDomNode(dom, "address_line_2"));
			transformedXml.push(m.getDomNode(dom, "dom"));
			transformedXml.push(m.getDomNode(dom, "contact_name"));
			transformedXml.push(m.getDomNode(dom, "company_abbv_name"));
			transformedXml.push(m.getDomNode(dom, "login_id"));
			transformedXml.push(m.getDomNode(dom, "user_id"));
			transformedXml.push(m.getDomNode(dom, "return_comments"));
			transformedXml.push("</", staticTypeNode, ">");
			
			// Format the authorisation levels
			d.forEach(_authPrefixList, function(prefix){
				for(var i = 1; dom.getElementsByTagName(prefix + "_" + i).length > 0; i++) {
					authPrefix = "bank";
					if(prefix.indexOf("bank") === -1) {
						authPrefix = "company";
					}
					
					transformedXml.push(_addGroupRecord(dom,
							authPrefix + "_auth_abbv_name_" + i, prefix + "_" + i));
				}
			});
			
			// Format role list
			d.forEach(multiSelects, function(multi) {
				var name = (multi) ? multi.get("name") : "";
				if(name && dom.getElementsByTagName(name).length > 0) {
					authPrefix = "bank";
					if(name.indexOf("bank") === -1) {
						authPrefix = "company";
					}
					transformedXml.push(_addGroupRecord(dom,
							authPrefix  + "_group_abbv_name", name));
				}
			});
			
			if(xmlRoot) {
				transformedXml.push("</", xmlRoot, ">");
			}
			
			return transformedXml.join("");
		}
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.system.role_client');