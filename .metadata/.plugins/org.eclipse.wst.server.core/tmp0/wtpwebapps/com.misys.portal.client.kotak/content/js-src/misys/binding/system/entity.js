dojo.provide("misys.binding.system.entity");

dojo.require("dijit.form.FilteringSelect");
dojo.require("dijit.layout.TabContainer");
dojo.require("misys.form.MultiSelect");
dojo.require("misys.form.common");
dojo.require("misys.validation.common");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.CheckBox");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {
	
	"use strict"; // ECMA5 Strict Mode
	
	var
		// List of selected entities
		_entityListNode = "entity_list",
	
		// List of available entities
		_availListNode = "avail_list";
	
	// Public functions & variables follow
	d.mixin(m, {
		bind : function() {
			m.setValidation("bei", m.validateBEIFormat);
			m.setValidation("abbv_name", m.validateCharacters);
			
			m.connect("add", "onClick", function(){
				m.addMultiSelectItems(dijit.byId("entity_list"),
						dijit.byId("avail_list"));
			});
			m.connect("remove", "onClick", function(){
				m.addMultiSelectItems(dijit.byId("avail_list"),
						dijit.byId("entity_list"));
			});
		}
	});
	
	// Add the XML transform function
	m._config = m._config || {};
	d.mixin(m._config, {
		xmlTransform : function(/*String*/ xml) {
			// String manipulation to remove the entity_list node (easier than 
			// building a DOM since we keep almost the exact same structure as before)
			var 
				multiSelects = [dj.byId('entity_list'), dj.byId('avail_list')],
				entityNodeIndex = xml.indexOf("<" + _entityListNode + ">"),
				availEntityNodeIndex = xml.indexOf("<" + _availListNode + ">"),
				entities = (entityNodeIndex !== -1) ? 
						xml.substring(entityNodeIndex + _entityListNode.length + 2,
									  xml.indexOf("</" + _entityListNode + ">")).split(",") : [],
				availEntities = (availEntityNodeIndex !== -1) ? 
						xml.substring(availEntityNodeIndex + _availListNode.length + 2,
								xml.indexOf("</" + _availListNode + ">")).split(",") : [],  
				entitiesXml  = [],
				availEntitiesXml = [];
			
			console.debug("[binding.user_entity] Transforming XML", xml);

			// Reformat XML for selected and available entities
			/*d.forEach(entities, function(entity) {
				if(entity) {
					entitiesXml.push("<", _entityListNode, ">",
										entity, 
										"</", _entityListNode, ">");
				}
			});
			
			if(entitiesXml.length > 0) {
				xml = xml.substring(0, entityNodeIndex + entitiesXml.join("") + 
					xml.indexOf("</" + _entityListNode + ">") + _entityListNode.length + 3);
			}
			
			d.forEach(availEntities, function(entity) {
				if(entity) {
					availEntitiesXml.push("<", _availListNode, ">",
										entity, 
										"</", _availListNode, ">");
				}
			});*/
			
			// Rebuild the XML
			/*if(availEntitiesXml.length > 0) {
				xml = xml.substring(0, availEntityNodeIndex + availEntitiesXml.join("") +  
					xml.indexOf("</" + _availListNode + ">") + _availListNode.length + 3);
			}*/
			
			return xml;
		}
	});
	
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.system.entity_client');