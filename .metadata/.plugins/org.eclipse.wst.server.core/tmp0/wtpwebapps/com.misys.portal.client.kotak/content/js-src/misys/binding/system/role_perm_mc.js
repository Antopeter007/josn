dojo.provide("misys.binding.system.role_perm_mc");

dojo.require("misys.form.MultiSelect");
dojo.require("dijit.form.FilteringSelect");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.CheckBox");
dojo.require("misys.form.SimpleTextarea");
dojo.require("dijit.layout.ContentPane");
dojo.require("misys.validation.common");
dojo.require("misys.form.common");
dojo.require("dojox.xml.DomParser");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {
	
	var roleEntityTypeStore, roleTypeStore;
	function _toggleRoleTypes()
	{
		var roleTypeSelectWidget = dj.byId('roletype');
		if (roleTypeSelectWidget)
		{
			if (this.get("value") === "04")
			{
				roleTypeSelectWidget.set("value", '');
				roleTypeSelectWidget.store =  new dojo.data.ItemFileReadStore({	data: {	identifier: "value",label: "name",items: roleEntityTypeStore}});
			}
			else
			{
				roleTypeSelectWidget.store =  new dojo.data.ItemFileReadStore({	data: {	identifier: "value",label: "name",items: roleTypeStore}});
			}
		}
	}

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
			dojo.forEach(dojo.query("option", dijit.byId(nodeName).domNode), function(option){
				permissionsXml.push("<permission_desc_record><permission>", 
						option.value, 
									"</permission></permission_desc_record>");
				 
			});
	
		permissionsXml.push("</existing_permissions>");
		return permissionsXml.join("");
	}

	d.mixin(m, {
		bind : function() {
			m.connect("roletype", "onChange", _togglePermissionDetails);
			m.connect("roledest", "onChange", _toggleRoleTypes);
			m.connect("add", "onClick", function(){
				m.addMultiSelectItems(dj.byId("permission_list"), dj.byId("avail_list_nosend"));
			});
			m.connect("remove", "onClick", function(){
				m.addMultiSelectItems(dj.byId("avail_list_nosend"), dj.byId("permission_list"));
			});
			
			m.setValidation("name", m.validateIllegalCharsInRolesCreation);
			
			m.setValidation("role_description", m.validateIllegalCharsInRolesCreation);

		},
		
		validateIllegalCharsInRolesCreation : function(){
			//  summary:
		    //       Validates that no invalid characters and spaces are present.
			
		var strValidCharacters = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-()/'  ";
		var character;
		var isValid = d.every(this.get("value"), function(theChar){
			character = theChar;
			return (strValidCharacters.indexOf(theChar) < 0) ? false : true;
		});
		
		if(!isValid) {
			this.invalidMessage = m.getLocalization("illegalCharError", [ character ]);
		}

		return isValid;
	}, 

	onFormLoad : function() {
		roleEntityTypeStore = []; 
		roleTypeStore = [];
		roleEntityTypeStore.push(
		{
			"name": m.getLocalization("role"),
			"value": "01"
		});
		roleTypeStore.push(
		{
			"name": m.getLocalization("role"),
			"value": "01"
		});
		roleTypeStore.push(
		{
			"name": m.getLocalization("authLevel"),
			"value": "02"
		});
		_togglePermissionDetails();
	},
	beforeSaveValidations : function() {
		var isValid = true;
		var roleName = dj.byId("name");
		if(roleName && roleName.get("value") == "")
		{
			isValid = false;
			console.debug("Role Code is mandatory.");
			m._config.onSubmitErrorMsg = m.getLocalization("blankRoleCode");
		}
		return isValid;
	},
	
	beforeSubmitValidations : function() {
		var isValid = true;
		var roleTypeField = dj.byId("roletype");
		var roleDestField = dj.byId("roledest");
		if (roleDestField && "S" + roleDestField.get("value") !== "S" && roleDestField.get("value") === "04" && roleTypeField && "S" + roleTypeField.get("value") !== "S" && roleTypeField.get("value") === "02")
		{
			m._config.onSubmitErrorMsg = m.getLocalization("invalidAuthorisationRole", [roleTypeField.get("displayedValue"), roleDestField.get("displayedValue")]);
			console.debug("Role type is not valid for selected role destination.");
			isValid = false;
		}
		return isValid;
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
				
				returnCommentsValue="",
						
				// Setup the root of the XML string
				xmlRoot = m._config.xmlTagName,
				transformedXml = xmlRoot ? ["<", xmlRoot, ">"] : [],
	
				// Representation of existing XML
				dom = dojox.xml.DomParser.parse(xml),
				
				roleType = "";
				
				if(dj.byId("roletype")){
					roleType = dj.byId("roletype").get("value");
				}
				if(dijit.byId("return_comments")){
				   returnCommentsValue=dijit.byId("return_comments").get("value");
				}
			
			// Contents of the ${staticTypeNode} element
			transformedXml.push("<", staticTypeNode, ">");
			transformedXml.push(m.getDomNode(dom, "brch_code"));
			transformedXml.push(m.getDomNode(dom, "name"));
			transformedXml.push(m.getDomNode(dom, "role_id"));
			transformedXml.push(m.getDomNode(dom, "role_description"));
			transformedXml.push(m.getDomNode(dom, "roledest"));
			transformedXml.push(m.getDomNode(dom, "roletype"));
			transformedXml.push("<return_comments>",returnCommentsValue,"</return_comments>");
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
	
})(dojo, dijit, misys);
//Including the client specific implementation
       dojo.require('misys.client.binding.system.role_perm_mc_client');