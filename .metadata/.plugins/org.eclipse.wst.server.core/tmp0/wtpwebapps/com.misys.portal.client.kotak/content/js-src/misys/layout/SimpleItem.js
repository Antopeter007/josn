dojo.provide("misys.layout.SimpleItem");

/**
 * This class is used to type the items that are referenced by a GridMultipleItem object.
 */
dojo.declare("misys.layout.SimpleItem",
	null,
	// class properties:
	{
		is_valid : "Y",
		
		getMandatoryProperties: function(){return [];},
	
		checkMandatoryProperties: function(mandatoryFields)
		{
			var areMandatoryFieldsMissing = dojo.some(mandatoryFields, dojo.hitch(this, function(mandatoryField){
				var value = this[mandatoryField];
				if (typeof value != 'undefined')
				{
					value = dojo.isArray(value) ? value[0] : value;
					return (value == null || value == '');
				}
			}));
			return !areMandatoryFieldsMissing;
		},

		createJsonItem: function(propertiesMap, mandatoryFields)	
		{
			var jsonEntry = {};
			
			// Check mandatory properties
			this.set("is_valid", this.checkMandatoryProperties(mandatoryFields) ? "Y" : "N");

			for(var property in propertiesMap)
			{
				var value;
				// Is the property attached to a complex class?
				if (propertiesMap && propertiesMap[property] && propertiesMap[property]._type)
				{
					var type = propertiesMap[property]._type;
					var child = this.findChildInheritingFromClass(type);
					if (child)
					{
						value = {_type: type, _value: child.createJsonItem()};
						var isValid = dojo.every(value._value, dojo.hitch(this, function(item){
							var value = item.is_valid;
							value = dojo.isArray(value) ? value[0] : value;
							return (value == "Y");
						}));
						if (this.get("is_valid") != "N")
						{
							this.set("is_valid", isValid ? "Y" : "N");
						}

						jsonEntry[property] = value;
						misys._widgetsToDestroy = misys._widgetsToDestroy || [];
						misys._widgetsToDestroy.push(child.id);
					}
				}
				else if(property.match('^_') != '_')
				{
					value = this.get(property);
					value = (value && value != null ? value : '');
					jsonEntry[property] = value;
				}
			}
			jsonEntry.is_valid = this.get("is_valid");
			return jsonEntry;
		},
		
		findChildInheritingFromClass: function(type)
		{
			var foundChild = null;
			if(this.hasChildren && this.hasChildren())
			{
				dojo.some(this.getChildren(), function(child){
					var typeObject = dojo.getObject(type);
					if (typeObject.prototype.isPrototypeOf(child)){
						foundChild = child;
						return false;
					}
				}, this);
			}
			return foundChild;
		}
	}
);