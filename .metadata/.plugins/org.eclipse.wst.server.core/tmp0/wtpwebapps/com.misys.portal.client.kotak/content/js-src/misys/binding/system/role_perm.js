dojo.provide("misys.binding.system.role_perm");

dojo.require("misys.form.MultiSelect");
dojo.require("dijit.form.FilteringSelect");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.CheckBox");
dojo.require("dijit.layout.ContentPane");
dojo.require("misys.validation.common");
dojo.require("misys.form.common");
dojo.require("dojox.xml.DomParser");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode
	
	function _togglePermissionDetails() {
		//  summary: 
		//            Toggle permission details.
		
		var roleType = dj.byId("roletype"),
			permissionDetails = d.byId("permission-details"),
			permissionList = dj.byId("permission_list"),
			availList = dj.byId("avail_list_nosend");
		
		// Positioned offscreen for page load
		if(d.style(permissionDetails, "position") === "absolute") {
			d.style(permissionDetails, "position", "inherit");
			d.style(permissionDetails, "left", 0);
			d.style(permissionDetails, "display", "none");
		}
		
	    if(roleType && roleType.get("value") !== "01") {
	    	m.animate("fadeOut", permissionDetails, function(){
	    		permissionList.reset();
		    	permissionList.invertSelection();
		    	m.addMultiSelectItems(availList, permissionList);
		    	availList.reset();
	    	});
	    } else {
	    	m.animate("fadeIn", permissionDetails);
	    }
	}
	
	function _addExistingPermissions( /*String*/ dom,
									  /*String*/ nodeName) {
		//  summary: 
		//            Adds existing permissions to the XML
		
		var node = dom.getElementsByTagName(nodeName)[0],
			childNode = (node) ? node.childNodes[0] : "",
			permArray = (childNode) ? childNode.nodeValue.split(",") : [],
			permissionsXml = ["<existing_permissions>"];

			d.forEach(permArray, function(permission){
				if(permission) {
					permissionsXml.push("<permission_desc_record><permission>", 
										permission, 
										"</permission></permission_desc_record>");
				}
			});
	
		permissionsXml.push("</existing_permissions>");
		return permissionsXml.join("");
	}

	d.mixin(m, {
		bind : function() {
			m.connect("roletype", "onChange", _togglePermissionDetails);
			m.connect("add", "onClick", function(){
				m.addMultiSelectItems(dj.byId("permission_list"), dj.byId("avail_list_nosend"));
			});
			m.connect("remove", "onClick", function(){
				m.addMultiSelectItems(dj.byId("avail_list_nosend"), dj.byId("permission_list"));
			});
		},

		onFormLoad : function() {
			_togglePermissionDetails();
		}
	});
	
	// Setup the XML transform function
	m._config = m._config || {};
	d.mixin(m._config, {
		xmlTransform : function(/*String*/ xml) {
			var 
				permissionList = dj.byId("permission_list"),
			
				// Whether we have a bank or customer screen
				staticTypeNode = "role",
						
				// Setup the root of the XML string
				xmlRoot = m._config.xmlTagName,
				transformedXml = xmlRoot ? ["<", xmlRoot, ">"] : [],
	
				// Representation of existing XML
				dom = dojox.xml.DomParser.parse(xml),
				
				roleType = dj.byId("roletype").get("value");
			
			console.debug("[binding.role] Transforming XML", xml);
				
			// Normalize multiselects
			if(permissionList) {
				permissionList.reset();
				permissionList.invertSelection();
			}
			
			// Contents of the ${staticTypeNode} element
			transformedXml.push("<", staticTypeNode, ">");
			transformedXml.push(m.getDomNode(dom, "brch_code"));
			transformedXml.push(m.getDomNode(dom, "name"));
			transformedXml.push(m.getDomNode(dom, "role_id"));
			transformedXml.push(m.getDomNode(dom, "role_description"));
			transformedXml.push(m.getDomNode(dom, "roledest"));
			transformedXml.push(m.getDomNode(dom, "roletype"));
			transformedXml.push("</", staticTypeNode, ">");
			
			
			// Retrieve the existing permissions
			if(roleType === "01" && dom.getElementsByTagName("permission_list").length > 0) {
				transformedXml.push(_addExistingPermissions(dom, "permission_list"));
			}
			
			if(xmlRoot) {
				transformedXml.push("</", xmlRoot, ">");
			}
			
			return transformedXml.join("");
		}
	});
	
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.system.role_perm_client');