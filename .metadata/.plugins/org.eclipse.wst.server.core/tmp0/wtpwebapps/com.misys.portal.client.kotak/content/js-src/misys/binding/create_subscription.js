dojo.provide("misys.binding.create_subscription");
/*
 ----------------------------------------------------------
 Event Binding for

 Subscription Package Form, Customer Side.

 Copyright (c) 2000-2011 Misys (http://www.misys.com),
 All Rights Reserved. 

 version:   1.0
 date:      12/09/08
 ----------------------------------------------------------
 */
dojo.require("misys.form.MultiSelect");
dojo.require("dijit.form.FilteringSelect");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.NumberTextBox");
dojo.require("misys.form.CurrencyTextBox");
dojo.require("dijit.form.CheckBox");
dojo.require("dijit.layout.ContentPane");
dojo.require("misys.validation.common");
dojo.require("misys.form.common");
dojo.require("dojox.xml.DomParser");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	//
	// Private functions & variables
	//
	function _togglePermissionDetails(theObj)
	{
		//  summary: 
		//            Toggle permission details.
	    //  tags:
	    //            private
		
		var productDetails = dojo.byId('products-attached-to-subscription-package');
	    if(this.get && this.get('value') !== '01')
	    {
	    	misys.animate("fadeOut", productDetails);
	    	
	    	// remove all options from the list
	    	var productList = dj.byId('product_list');
	    	var availList = dj.byId('avail_list_nosend');
	    	productList.reset();
	    	productList.invertSelection();
	    	misys.addMultiSelectItems(availList, productList);
	    	availList.reset();
	    } else {
	    	misys.animate("fadeIn", productDetails);
	    }
	}
	
	function _addExistingPermissions(dom, nodeName)
	{
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
	
	//Private methods follow
	function _addGroupRecord(/*String*/ dom, /*String*/ abbvNodeName, /*String*/ nodeName)
	{
		//  summary:
		//          Adds a group record to the XML
	    //  tags:
	    //         private
		var abbvNode = dom.getElementsByTagName(abbvNodeName)[0],
		
			node = dom.getElementsByTagName(nodeName)[0],
		
			abbvChildNode = "",
			
			abbvName = "",
			
			returnString = [];
		
			if(abbvNode)
			{
				abbvChildNode = abbvNode.childNodes[0];
				if(abbvChildNode && abbvChildNode.nodeValue)
				{
					abbvName = abbvChildNode.nodeValue;
				}
		    }
			returnString.push("<group_record><group_abbv_name>",abbvName,"</group_abbv_name>");
			//If the component type is a filter select then read component value
			if(dijit.byId(nodeName)){
				if(/dijit.form.FilteringSelect/.test(dijit.byId(nodeName).declaredClass)){
					//If the field value is not empty
					if("S" + dijit.byId(nodeName).get("value") != "S"){
					returnString.push("<existing_roles><role><name>", 
							dijit.byId(nodeName).get("value"), 
										"</name></role></existing_roles>");
					}
				}else{
					dojo.forEach(dojo.query("option", dijit.byId(nodeName).domNode), function(option){
						returnString.push("<existing_roles><role><name>", 
								option.value, 
											"</name></role></existing_roles>");
						 
					});	
				}
			}
			returnString.push("</group_record>");
			return returnString.join("");
	}



	//
	// Public functions & variables
	//
	d.mixin(m, {
		bind : function() {
		
			m.setValidation('sp_code', m.validateCharacters);
			m.setValidation('sp_description', m.validateCharacters);
			m.setValidation("charging_cur_code", m.validateCurrency);
			m.connect("charging_cur_code", "onChange", function(){
				m.setCurrency(this, ["charging_amt"]);
			});
			m.connect('add', 'onClick', function(){
				m.addMultiSelectItems(dj.byId('product_list'), dj.byId('avail_list_nosend'));
			});
			m.connect('remove', 'onClick', function(){
				m.addMultiSelectItems(dj.byId('avail_list_nosend'), dj.byId('product_list'));
			});
		},
		onFormLoad : function() {
		
			// Fade in the package list
			m.setCurrency(dj.byId("charging_cur_code"), ["charging_amt"]);
			var togglePermissionFnc = dojo.hitch(dj.byId('roletype'), _togglePermissionDetails);
			togglePermissionFnc();
			
			if(dj.byId("charging_cur_code") && dj.byId("charging_cur_code").get("value") === "")
			{
				dj.byId("charging_cur_code").set("value",dj.byId("base_currency_nosend").get("value"));
			}
		}
	});
		
	m._config = m._config || {};
	d.mixin(m._config, {
		xmlTransform : function(/*String*/ xml) {
			// summary:
			//		TODO
			var role_list = dj.byId("group_record"),
			
				// Whether we have a bank or customer screen
				staticTypeNode = "subscription_package",
				
				returnCommentsValue="",
						
				// Setup the root of the XML string
				xmlRoot = m._config.xmlTagName,
				transformedXml = xmlRoot ? ["<", xmlRoot, ">"] : [],
	
				// Representation of existing XML
				dom = dojox.xml.DomParser.parse(xml);
				
			if(dijit.byId("return_comments")){
				   returnCommentsValue=dijit.byId("return_comments").get("value");
			}
			
			// Contents of the ${staticTypeNode} element
			transformedXml.push("<", staticTypeNode, ">");
			transformedXml.push(m.getDomNode(dom, "subscription_code"));
			transformedXml.push(m.getDomNode(dom, "subscription_description"));
			transformedXml.push(m.getDomNode(dom, "charging_cur_code"));
			transformedXml.push(m.getDomNode(dom, "charging_amt"));
			transformedXml.push(m.getDomNode(dom, "local_tax"));
			transformedXml.push(m.getDomNode(dom, "creation_date"));
			transformedXml.push(m.getDomNode(dom, "last_maintenance_date"));
			transformedXml.push(m.getDomNode(dom, "last_maintenance_user"));
			transformedXml.push(m.getDomNode(dom, "last_maintenance_user"));
			transformedXml.push(m.getDomNode(dom, "lastMaintenanceUserName"));
			transformedXml.push("<return_comments>",returnCommentsValue,"</return_comments>");
			transformedXml.push("</", staticTypeNode, ">");
			
			//2. Retrieve the role list
			var prefix = 'entity';
			   transformedXml.push(_addGroupRecord(dom, prefix  + '_group_abbv_name', "entity_role_list"));
			   
			if(xmlRoot) {
				transformedXml.push("</", xmlRoot, ">");
			}
			
			return transformedXml.join("");
		}
		
	});
})(dojo, dijit, misys);

