dojo.provide("misys.binding.SySubscriptionPackageBinding");
/*
 -----------------------------------------------------------------------------
 Scripts for the Subscription Package page.
 
 Note: the function fncFormSpecificValidation is required

 Copyright (c) 2000-2010 Misys (http://www.misys.com),
 All Rights Reserved. 

 version:   1.0
 date:      07/03/2011
 -----------------------------------------------------------------------------
*/
dojo.require('misys.form.MultiSelect');
dojo.require('dijit.form.FilteringSelect');
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

fncDoBinding = function(){
	//  summary:
    //            Binds validations and events to fields in the form.              
    //   tags:
    //            public
	
	misys.setValidation('sp_code', fncValidateCharacters);
	misys.setValidation('sp_description', fncValidateCharacters);
	
	misys.connect('add', 'onClick', function(){
		misys.addMultiSelectItems(dijit.byId('product_list'), dijit.byId('avail_list_nosend'));
	});
	misys.connect('remove', 'onClick', function(){
		misys.addMultiSelectItems(dijit.byId('avail_list_nosend'), dijit.byId('product_list'));
	});
};

fncDoFormOnLoadEvents = function(){
	//  summary:
    //          Events to perform on page load.
    //  tags:
    //         public

	// Fade in the package list
	var togglePermissionFnc = dojo.hitch(dijit.byId('roletype'), _fncTogglePermissionDetails);
	togglePermissionFnc();
};

fncGenerateTransactionXML = function(){
	//  summary: 
	//            Generate transaction XML
	//  description:
    //            We have to override this, since the XML for this form is very 
	//            different to the standard forms.
    //  tags:
    //            public
	
	// Select everything in the list
	var productList = dijit.byId('product_list');
	
	var xmlString = '';
	dojo.query("#edit .validate").forEach(
			function(form){
				var fields = dijit.byId(form.id).getDescendants();
				dojo.forEach(fields,
						function(field){
						 xmlString += misys.fieldToXML(field);
						}
				);
			}
	);
	
   dojo.require('dojox.xml.DomParser');
   // Use a DOM so that the tag order doesn't matter
   var dom = dojox.xml.DomParser.parse(xmlString);
   
   var subscription_package = 'subscription_package';
   
   // Get static user.
   var xmlTagName = misys._config.xmlTagName;
   var transformedString = '<' + xmlTagName + '><'+subscription_package+'>';
   transformedString += fncGetNodeValue(dom, 'subscription_code'); 
   transformedString += fncGetNodeValue(dom, 'subscription_description');
   transformedString += fncGetNodeValue(dom, 'charging_cur_code');
   transformedString += fncGetNodeValue(dom, 'standard_charge');
   transformedString += fncGetNodeValue(dom, 'waived');
   transformedString += fncGetNodeValue(dom, 'special_charge');
   transformedString += fncGetNodeValue(dom, 'special_charge_expiry_date');
   transformedString += fncGetNodeValue(dom, 'transaction_retention_period');
   transformedString += fncGetNodeValue(dom, 'no_of_free_tokens');
   transformedString += '</'+subscription_package+'>';

   // Retrieve the existing permissions
   if(dom.getElementsByTagName('product_list').length > 0)
   {
	   transformedString += _addExistingPermissions(dom, 'product_list');
   }

   transformedString += '</' + xmlTagName + '>';
   
   return transformedString;
};

// Private methods follow 
 
_fncTogglePermissionDetails = function(theObj)
{
	//  summary: 
	//            Toggle permission details.
    //  tags:
    //            private
	
	var productDetails = dojo.byId('products-attached-to-subscription-package');
    if(this.get && this.get('value') != '01')
    {
    	misys.animate("fadeOut", productDetails);
    	
    	// remove all options from the list
    	var productList = dijit.byId('product_list');
    	var availList = dijit.byId('avail_list_nosend');
    	productList.reset();
    	productList.invertSelection();
    	misys.addMultiSelectItems(availList, productList);
    	availList.reset();
    } else {
    	misys.animate("fadeIn", productDetails);
    }
};

_addExistingPermissions = function(dom, nodeName)
{
	//  summary: 
	//            Adds existing permissions to the XML
    //  tags:
    //            private
	
	var node = dom.getElementsByTagName(nodeName)[0];
	
	var permArray = [];	
	if(node)
	{
		var childNode = node.childNodes[0];
		if(childNode && childNode.nodeValue)
		{
			permArray = childNode.nodeValue.split(',');
		}
    }

	var returnString = '<existing_products>';
	if(permArray.length > 0)
	{
		dojo.forEach(permArray, function(permission){
			   if(permission != null && permission != '')
			   {
				   returnString += '<product_record><product_code>' + permission + '</product_code></product_record>';
			   }
		});
	}
	
	return returnString += '</existing_products>';
};